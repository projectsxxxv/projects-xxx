"use strict";

const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");
const { DatabaseSync } = require("node:sqlite");

const ROOT = __dirname;
const PUBLIC_DIR = path.join(ROOT, "browser", "site");
const CATALOG_PATH = path.join(PUBLIC_DIR, "ingressos", "eventos.json");
const DB_PATH = path.resolve(process.env.SQLITE_DB_PATH || path.join(ROOT, ".data", "orders.sqlite"));
const PORT = Number(process.env.PORT || 3000);
const MIME = {
  ".avif": "image/avif", ".css": "text/css; charset=utf-8", ".gif": "image/gif",
  ".html": "text/html; charset=utf-8", ".ico": "image/x-icon", ".jpeg": "image/jpeg",
  ".jpg": "image/jpeg", ".js": "text/javascript; charset=utf-8", ".json": "application/json; charset=utf-8",
  ".mp4": "video/mp4", ".png": "image/png", ".svg": "image/svg+xml", ".webp": "image/webp",
  ".woff": "font/woff", ".woff2": "font/woff2"
};

function loadLocalEnvironment() {
  const envPath = path.join(ROOT, ".env");
  if (!fs.existsSync(envPath)) return;
  for (const line of fs.readFileSync(envPath, "utf8").split(/\r?\n/)) {
    const match = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/);
    if (!match || match[1] in process.env) continue;
    let value = match[2];
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    process.env[match[1]] = value;
  }
}

loadLocalEnvironment();

const catalog = JSON.parse(fs.readFileSync(CATALOG_PATH, "utf8"));
const eventBySlug = new Map(catalog.events.map((event) => [event.slug, event]));
const ticketById = new Map();
for (const event of catalog.events) {
  for (const section of event.sections || []) {
    for (const ticket of section.tickets || []) ticketById.set(ticket.id, { event, section, ticket });
  }
}

fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
const db = new DatabaseSync(DB_PATH);
db.exec(`
  PRAGMA journal_mode = WAL;
  PRAGMA foreign_keys = ON;
  PRAGMA busy_timeout = 5000;
  CREATE TABLE IF NOT EXISTS orders (
    id TEXT PRIMARY KEY,
    access_hash TEXT NOT NULL,
    event_slug TEXT NOT NULL,
    event_title TEXT NOT NULL,
    event_date TEXT NOT NULL,
    buyer_name TEXT NOT NULL,
    buyer_email TEXT NOT NULL,
    buyer_cpf TEXT NOT NULL,
    buyer_phone TEXT NOT NULL,
    items_json TEXT NOT NULL,
    amount_cents INTEGER NOT NULL CHECK(amount_cents > 0),
    provider_id TEXT UNIQUE,
    pix_code TEXT,
    status TEXT NOT NULL,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );
  CREATE TABLE IF NOT EXISTS tickets (
    id TEXT PRIMARY KEY,
    order_id TEXT NOT NULL REFERENCES orders(id),
    code TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    event_title TEXT NOT NULL,
    event_date TEXT NOT NULL,
    issued_at TEXT NOT NULL,
    checked_in_at TEXT
  );
  CREATE INDEX IF NOT EXISTS tickets_order_id_idx ON tickets(order_id);
`);

function json(res, status, body) {
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
    "X-Content-Type-Options": "nosniff"
  });
  res.end(JSON.stringify(body));
}

async function readBody(req, limit = 32 * 1024) {
  const chunks = [];
  let size = 0;
  for await (const chunk of req) {
    size += chunk.length;
    if (size > limit) throw Object.assign(new Error("A solicitação excede o limite."), { statusCode: 413 });
    chunks.push(chunk);
  }
  try { return JSON.parse(Buffer.concat(chunks).toString("utf8") || "{}"); }
  catch { throw Object.assign(new Error("JSON inválido."), { statusCode: 400 }); }
}

function validCpf(value) {
  const cpf = String(value || "").replace(/\D/g, "");
  if (cpf.length !== 11 || /^([0-9])\1{10}$/.test(cpf)) return false;
  for (let digit = 9; digit < 11; digit += 1) {
    let sum = 0;
    for (let index = 0; index < digit; index += 1) sum += Number(cpf[index]) * ((digit + 1) - index);
    const check = (sum * 10) % 11;
    if (Number(cpf[digit]) !== (check === 10 ? 0 : check)) return false;
  }
  return true;
}

function resolveOrder(eventSlug, items, customer) {
  const event = eventBySlug.get(eventSlug);
  if (!event) throw Object.assign(new Error("Evento indisponível."), { statusCode: 400 });
  if (!Array.isArray(items) || items.length < 1 || items.length > 20) {
    throw Object.assign(new Error("Selecione ao menos um ingresso."), { statusCode: 400 });
  }

  let quantityTotal = 0;
  let amountCents = 0;
  const lines = [];
  const seen = new Set();
  for (const item of items) {
    const ticketId = String(item?.ticketId || "");
    const quantity = Number(item?.quantity);
    const found = ticketById.get(ticketId);
    if (!found || found.event.slug !== eventSlug || !Number.isInteger(quantity) || quantity < 1 || quantity > 5 || seen.has(ticketId)) {
      throw Object.assign(new Error("A seleção de ingressos é inválida."), { statusCode: 400 });
    }
    seen.add(ticketId);
    quantityTotal += quantity;
    if (quantityTotal > 10) throw Object.assign(new Error("O limite por pedido é de 10 ingressos."), { statusCode: 400 });
    const unitCents = Number(found.ticket.priceCents) + Number(found.ticket.feeCents);
    if (!Number.isSafeInteger(unitCents) || unitCents < 1) {
      throw Object.assign(new Error("O preço de um ingresso está configurado incorretamente."), { statusCode: 500 });
    }
    amountCents += unitCents * quantity;
    lines.push({ ticketId, title: found.ticket.title, section: found.section.name, quantity, unitCents });
  }

  const name = String(customer?.name || "").trim();
  const email = String(customer?.email || "").trim().toLowerCase();
  const cpf = String(customer?.cpf || "").replace(/\D/g, "");
  const phone = String(customer?.phone || "").replace(/\D/g, "");
  if (name.length < 3 || name.length > 120 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 180 || !validCpf(cpf) || phone.length < 10 || phone.length > 13) {
    throw Object.assign(new Error("Confira nome, e-mail, CPF e celular."), { statusCode: 400 });
  }
  return { event, lines, amountCents, quantityTotal, customer: { name, email, cpf, phone } };
}

function gatewayConfig() {
  let local = {};
  const configPath = path.join(ROOT, "gateway_config.json");
  if (fs.existsSync(configPath)) {
    try { local = JSON.parse(fs.readFileSync(configPath, "utf8")).pixvault || {}; }
    catch { throw Object.assign(new Error("A configuração local do PixVault está inválida."), { statusCode: 503 }); }
  }
  const token = process.env.PIXVAULT_TOKEN || local.token;
  const clientId = process.env.PIXVAULT_CLIENT_ID || local.client_id;
  if (!token || token === "COLE_SEU_TOKEN_AQUI" || !clientId) {
    throw Object.assign(new Error("PixVault ainda não está configurado neste servidor."), { statusCode: 503 });
  }
  return {
    token,
    clientId,
    createUrl: process.env.PIXVAULT_API_URL || local.api_url || "https://pixvault.one/api/v1/charge",
    statusUrl: process.env.PIXVAULT_STATUS_URL || local.status_url || ""
  };
}

function gatewayHeaders(config) {
  return {
    Accept: "application/json",
    Authorization: `Bearer ${config.token}`,
    "Content-Type": "application/json",
    "x-client-id": config.clientId
  };
}

function gatewayCreateBody(url, order, details) {
  const customer = {
    name: details.customer.name,
    email: details.customer.email,
    phone: details.customer.phone,
    document: { number: details.customer.cpf, type: "CPF" }
  };
  if (/\/charge(?:\?|$)/i.test(url)) {
    return { amount: details.amountCents / 100, method: "pix", customer, external_reference: order.id };
  }
  return {
    paymentMethod: "pix",
    amount: details.amountCents,
    customer,
    items: [{
      title: `${details.event.title} — ${details.quantityTotal} ingresso(s)`,
      unitPrice: details.amountCents,
      quantity: 1,
      tangible: false
    }],
    externalReference: order.id
  };
}

function findField(value, keys, depth = 0) {
  if (!value || typeof value !== "object" || depth > 5) return undefined;
  for (const key of keys) if (value[key] !== undefined && value[key] !== null && value[key] !== "") return value[key];
  for (const key of ["data", "transaction", "payment", "result"]) {
    const found = findField(value[key], keys, depth + 1);
    if (found !== undefined) return found;
  }
  return undefined;
}

function statusEndpoint(config, providerId) {
  if (config.statusUrl) return config.statusUrl.replace("{id}", encodeURIComponent(providerId));
  const url = new URL(config.createUrl);
  url.pathname = url.pathname.replace(/\/(?:payments\/pix|charge)\/?$/i, "").replace(/\/$/, "") + `/transactions/${encodeURIComponent(providerId)}`;
  url.search = "";
  return url.toString();
}

function toCents(value, key, config) {
  const number = Number(value);
  if (!Number.isFinite(number) || number < 0) return null;
  if (/cents/i.test(key)) return Math.round(number);
  if (/\/charge(?:\?|$)/i.test(config.createUrl)) return Math.round(number * 100);
  return Math.round(number);
}

function amountFromStatus(payload, config) {
  for (const key of ["amount_cents", "amountCents", "amount", "value"]) {
    const value = findField(payload, [key]);
    if (value !== undefined) return toCents(value, key, config);
  }
  return null;
}

function issueTickets(order) {
  const existing = db.prepare("SELECT id, code, title, event_title AS eventTitle, event_date AS eventDate FROM tickets WHERE order_id = ? ORDER BY rowid").all(order.id);
  if (existing.length) return existing;
  const lines = JSON.parse(order.items_json);
  const insert = db.prepare("INSERT INTO tickets (id, order_id, code, title, event_title, event_date, issued_at) VALUES (?, ?, ?, ?, ?, ?, ?)");
  db.exec("BEGIN IMMEDIATE");
  try {
    const issuedAt = new Date().toISOString();
    for (const line of lines) {
      for (let count = 0; count < line.quantity; count += 1) {
        insert.run(crypto.randomUUID(), order.id, crypto.randomBytes(16).toString("hex").toUpperCase(), line.title, order.event_title, order.event_date, issuedAt);
      }
    }
    db.prepare("UPDATE orders SET status = 'paid', updated_at = ? WHERE id = ?").run(issuedAt, order.id);
    db.exec("COMMIT");
  } catch (error) {
    db.exec("ROLLBACK");
    throw error;
  }
  return db.prepare("SELECT id, code, title, event_title AS eventTitle, event_date AS eventDate FROM tickets WHERE order_id = ? ORDER BY rowid").all(order.id);
}

async function createOrder(req, res) {
  const body = await readBody(req);
  const details = resolveOrder(body.eventSlug, body.items, body.customer);
  const config = gatewayConfig();
  const id = crypto.randomUUID();
  const accessToken = crypto.randomBytes(32).toString("base64url");
  const now = new Date().toISOString();
  const insert = db.prepare(`INSERT INTO orders
    (id, access_hash, event_slug, event_title, event_date, buyer_name, buyer_email, buyer_cpf, buyer_phone, items_json, amount_cents, status, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'creating', ?, ?)`);
  insert.run(id, crypto.createHash("sha256").update(accessToken).digest("hex"), details.event.slug, details.event.title, details.event.date, details.customer.name, details.customer.email, details.customer.cpf, details.customer.phone, JSON.stringify(details.lines), details.amountCents, now, now);

  try {
    const upstream = await fetch(config.createUrl, {
      method: "POST",
      headers: { ...gatewayHeaders(config), "Idempotency-Key": id },
      body: JSON.stringify(gatewayCreateBody(config.createUrl, { id }, details)),
      signal: AbortSignal.timeout(15000)
    });
    const payload = await upstream.json().catch(() => null);
    if (!upstream.ok || !payload) throw new Error("A API do PixVault recusou ou não respondeu à cobrança.");
    const pixCode = findField(payload, ["pix_code", "pix_key", "copy_paste", "emv", "qrcode", "qr_code"]);
    const providerId = findField(payload, ["uuid", "transaction_id", "transactionId", "id"]);
    if (!pixCode || !providerId) throw new Error("O PixVault não retornou o código Pix e o identificador da cobrança.");
    db.prepare("UPDATE orders SET provider_id = ?, pix_code = ?, status = 'pending', updated_at = ? WHERE id = ?")
      .run(String(providerId), String(pixCode), new Date().toISOString(), id);
    return json(res, 201, { orderId: id, accessToken, eventTitle: details.event.title, amountCents: details.amountCents, pixCode: String(pixCode), status: "pending" });
  } catch (error) {
    db.prepare("UPDATE orders SET status = 'gateway_error', updated_at = ? WHERE id = ?").run(new Date().toISOString(), id);
    console.error("PixVault create failed:", error.message);
    return json(res, 502, { error: "Não foi possível confirmar a cobrança com o PixVault. Nenhum ingresso foi emitido. Se o banco mostrar um débito, procure o suporte antes de tentar novamente." });
  }
}

function authorizedOrder(req, orderId) {
  const order = db.prepare("SELECT * FROM orders WHERE id = ?").get(orderId);
  const match = String(req.headers.authorization || "").match(/^Bearer\s+(.+)$/i);
  if (!order || !match) return null;
  const supplied = crypto.createHash("sha256").update(match[1]).digest();
  const expected = Buffer.from(order.access_hash, "hex");
  return supplied.length === expected.length && crypto.timingSafeEqual(supplied, expected) ? order : null;
}

async function orderStatus(req, res, orderId) {
  const order = authorizedOrder(req, orderId);
  if (!order) return json(res, 404, { error: "Pedido não encontrado." });
  if (order.status === "paid") {
    return json(res, 200, { orderId, status: "paid", amountCents: order.amount_cents, pixCode: order.pix_code, tickets: issueTickets(order) });
  }
  if (["gateway_error", "failed", "expired", "cancelled", "paid_unverified"].includes(order.status)) {
    return json(res, 200, { orderId, status: order.status, amountCents: order.amount_cents, pixCode: order.pix_code, tickets: [] });
  }
  if (!order.provider_id) return json(res, 202, { orderId, status: "pending", amountCents: order.amount_cents, pixCode: order.pix_code, tickets: [] });

  try {
    const config = gatewayConfig();
    const upstream = await fetch(statusEndpoint(config, order.provider_id), {
      headers: { Accept: "application/json", Authorization: `Bearer ${config.token}`, "x-client-id": config.clientId },
      signal: AbortSignal.timeout(12000),
      cache: "no-store"
    });
    const payload = await upstream.json().catch(() => null);
    if (!upstream.ok || !payload) throw new Error("A consulta de pagamento falhou.");
    const remoteStatus = String(findField(payload, ["status", "payment_status", "paymentStatus"]) || "pending").toLowerCase();
    const updatedAt = new Date().toISOString();
    if (["approved", "paid", "completed", "success", "succeeded"].includes(remoteStatus)) {
      const paidAmount = amountFromStatus(payload, config);
      if (paidAmount === null || paidAmount !== order.amount_cents) {
        db.prepare("UPDATE orders SET status = 'paid_unverified', updated_at = ? WHERE id = ?").run(updatedAt, order.id);
        return json(res, 200, { orderId, status: "paid_unverified", amountCents: order.amount_cents, pixCode: order.pix_code, tickets: [] });
      }
      db.prepare("UPDATE orders SET status = 'paid', updated_at = ? WHERE id = ?").run(updatedAt, order.id);
      const paidOrder = db.prepare("SELECT * FROM orders WHERE id = ?").get(order.id);
      return json(res, 200, { orderId, status: "paid", amountCents: order.amount_cents, pixCode: order.pix_code, tickets: issueTickets(paidOrder) });
    }
    if (["expired", "failed", "cancelled", "canceled", "rejected"].includes(remoteStatus)) {
      db.prepare("UPDATE orders SET status = ?, updated_at = ? WHERE id = ?").run(remoteStatus === "canceled" ? "cancelled" : remoteStatus, updatedAt, order.id);
      return json(res, 200, { orderId, status: remoteStatus === "canceled" ? "cancelled" : remoteStatus, amountCents: order.amount_cents, pixCode: order.pix_code, tickets: [] });
    }
    return json(res, 200, { orderId, status: "pending", amountCents: order.amount_cents, pixCode: order.pix_code, tickets: [] });
  } catch (error) {
    console.error("PixVault status check failed:", error.message);
    return json(res, 502, { error: "Não foi possível consultar o pagamento agora." });
  }
}

function safeStaticPath(urlPath) {
  const decoded = decodeURIComponent(urlPath);
  const candidate = path.resolve(PUBLIC_DIR, `.${decoded}`);
  if (candidate !== PUBLIC_DIR && !candidate.startsWith(PUBLIC_DIR + path.sep)) return null;
  return candidate;
}

async function serveStatic(req, res, pathname) {
  let filePath;
  try { filePath = safeStaticPath(pathname); }
  catch { return json(res, 400, { error: "Endereço inválido." }); }
  if (!filePath) return json(res, 403, { error: "Acesso negado." });
  try {
    let stat = await fs.promises.stat(filePath);
    if (stat.isDirectory()) {
      if (!pathname.endsWith("/")) {
        res.writeHead(301, { Location: `${pathname}/${new URL(req.url, "http://localhost").search}` });
        return res.end();
      }
      filePath = path.join(filePath, "index.html");
      stat = await fs.promises.stat(filePath);
    }
    if (!stat.isFile()) return json(res, 404, { error: "Não encontrado." });
    const type = MIME[path.extname(filePath).toLowerCase()] || "application/octet-stream";
    res.writeHead(200, {
      "Content-Type": type,
      "Content-Length": stat.size,
      "Cache-Control": path.extname(filePath) === ".html" ? "no-cache" : "public, max-age=3600",
      "X-Content-Type-Options": "nosniff",
      "Referrer-Policy": "same-origin"
    });
    fs.createReadStream(filePath).pipe(res);
  } catch {
    json(res, 404, { error: "Não encontrado." });
  }
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, "http://localhost");
  try {
    if (url.pathname === "/api/health" && req.method === "GET") {
      let pixVaultConfigured = true;
      try { gatewayConfig(); } catch { pixVaultConfigured = false; }
      return json(res, 200, { status: "ok", storage: "sqlite", pixVaultConfigured, checkoutReady: pixVaultConfigured });
    }
    if (url.pathname === "/api/checkout" && req.method === "POST") return await createOrder(req, res);
    if (url.pathname === "/api/checkout" && req.method === "GET") return await orderStatus(req, res, url.searchParams.get("orderId"));
    if (url.pathname === "/api/orders" && req.method === "POST") return await createOrder(req, res);
    const orderMatch = url.pathname.match(/^\/api\/orders\/([0-9a-f-]{36})\/status$/i);
    if (orderMatch && req.method === "GET") return await orderStatus(req, res, orderMatch[1]);
    if (url.pathname.startsWith("/api/")) return json(res, 404, { error: "Rota de API não encontrada." });
    if (req.method !== "GET" && req.method !== "HEAD") return json(res, 405, { error: "Método não permitido." });
    return await serveStatic(req, res, url.pathname);
  } catch (error) {
    const status = Number(error.statusCode) || 500;
    return json(res, status, { error: status < 500 ? error.message : "Erro interno do servidor." });
  }
});

server.listen(PORT, "0.0.0.0", () => {
  console.log(`Site e checkout próprio disponíveis na porta ${PORT}.`);
  console.log(`SQLite: ${DB_PATH}`);
});

function shutdown() {
  server.close(() => {
    db.close();
    process.exit(0);
  });
}
process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
