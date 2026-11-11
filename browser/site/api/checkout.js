"use strict";

const crypto = require("node:crypto");
const { cert, getApps, initializeApp } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");
const catalog = require("../ingressos/eventos.json");

const eventBySlug = new Map(catalog.events.map((event) => [event.slug, event]));
const ticketById = new Map();
for (const event of catalog.events) {
  for (const section of event.sections || []) {
    for (const ticket of section.tickets || []) ticketById.set(ticket.id, { event, section, ticket });
  }
}

function json(res, status, body) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.end(JSON.stringify(body));
}

function appError(message, statusCode) {
  return Object.assign(new Error(message), { statusCode });
}

function firestore() {
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  if (!raw) throw appError("Firebase ainda não está conectado neste projeto.", 503);

  let serviceAccount;
  try { serviceAccount = JSON.parse(raw); }
  catch { throw appError("A credencial do Firebase está inválida.", 503); }
  if (!serviceAccount.project_id || !serviceAccount.client_email || !serviceAccount.private_key) {
    throw appError("A credencial do Firebase está incompleta.", 503);
  }

  const appName = `site-de-evento-${serviceAccount.project_id}`;
  let app = getApps().find((entry) => entry.name === appName);
  if (!app) {
    app = initializeApp({
      credential: cert(serviceAccount),
      projectId: serviceAccount.project_id,
    }, appName);
  }
  return getFirestore(app);
}

function gatewayConfig() {
  const token = process.env.PIXVAULT_TOKEN;
  const clientId = process.env.PIXVAULT_CLIENT_ID;
  if (!token || !clientId) throw appError("PixVault ainda não está conectado neste projeto.", 503);
  return {
    token,
    clientId,
    createUrl: process.env.PIXVAULT_API_URL || "https://pixvault.one/api/v1/charge",
    statusUrl: process.env.PIXVAULT_STATUS_URL || "",
  };
}

function gatewayHeaders(config) {
  return {
    Accept: "application/json",
    Authorization: `Bearer ${config.token}`,
    "Content-Type": "application/json",
    "x-client-id": config.clientId,
  };
}

function gatewayCreateBody(url, orderId, details) {
  const customer = {
    name: details.customer.name,
    email: details.customer.email,
    phone: details.customer.phone,
    document: { number: details.customer.cpf, type: "CPF" },
  };
  if (/\/charge(?:\?|$)/i.test(url)) {
    return { amount: details.amountCents / 100, method: "pix", customer, external_reference: orderId };
  }
  return {
    paymentMethod: "pix",
    amount: details.amountCents,
    customer,
    items: [{
      title: `${details.event.title} — ${details.quantityTotal} ingresso(s)`,
      unitPrice: details.amountCents,
      quantity: 1,
      tangible: false,
    }],
    externalReference: orderId,
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
  if (!event) throw appError("Evento indisponível.", 400);
  if (!Array.isArray(items) || items.length < 1 || items.length > 20) throw appError("Selecione ao menos um ingresso.", 400);

  let quantityTotal = 0;
  let amountCents = 0;
  const lines = [];
  const seen = new Set();
  for (const item of items) {
    const ticketId = String(item?.ticketId || "");
    const quantity = Number(item?.quantity);
    const found = ticketById.get(ticketId);
    if (!found || found.event.slug !== eventSlug || !Number.isInteger(quantity) || quantity < 1 || quantity > 5 || seen.has(ticketId)) {
      throw appError("A seleção de ingressos é inválida.", 400);
    }
    seen.add(ticketId);
    quantityTotal += quantity;
    if (quantityTotal > 10) throw appError("O limite por pedido é de 10 ingressos.", 400);
    const unitCents = Number(found.ticket.priceCents) + Number(found.ticket.feeCents);
    if (!Number.isSafeInteger(unitCents) || unitCents < 1) throw appError("O preço de um ingresso está configurado incorretamente.", 500);
    amountCents += unitCents * quantity;
    lines.push({ ticketId, title: found.ticket.title, section: found.section.name, quantity, unitCents });
  }

  const name = String(customer?.name || "").trim();
  const email = String(customer?.email || "").trim().toLowerCase();
  const cpf = String(customer?.cpf || "").replace(/\D/g, "");
  const phone = String(customer?.phone || "").replace(/\D/g, "");
  if (name.length < 3 || name.length > 120 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 180 || !validCpf(cpf) || phone.length < 10 || phone.length > 13) {
    throw appError("Confira nome, e-mail, CPF e celular.", 400);
  }
  return { event, lines, amountCents, quantityTotal, customer: { name, email, cpf, phone } };
}

async function readBody(req) {
  if (req.body && typeof req.body === "object") return req.body;
  if (typeof req.body === "string") {
    try { return JSON.parse(req.body || "{}"); }
    catch { throw appError("JSON inválido.", 400); }
  }
  const chunks = [];
  let size = 0;
  for await (const chunk of req) {
    size += chunk.length;
    if (size > 32 * 1024) throw appError("A solicitação excede o limite.", 413);
    chunks.push(chunk);
  }
  try { return JSON.parse(Buffer.concat(chunks).toString("utf8") || "{}"); }
  catch { throw appError("JSON inválido.", 400); }
}

async function createOrder(req, res) {
  const body = await readBody(req);
  const details = resolveOrder(body.eventSlug, body.items, body.customer);
  const config = gatewayConfig();
  const db = firestore();
  const id = crypto.randomUUID();
  const accessToken = crypto.randomBytes(32).toString("base64url");
  const now = new Date().toISOString();
  const orderRef = db.collection("orders").doc(id);

  await orderRef.create({
    accessHash: crypto.createHash("sha256").update(accessToken).digest("hex"),
    eventSlug: details.event.slug,
    eventTitle: details.event.title,
    eventDate: details.event.date,
    buyer: details.customer,
    items: details.lines,
    amountCents: details.amountCents,
    providerId: null,
    pixCode: null,
    tickets: [],
    status: "creating",
    createdAt: now,
    updatedAt: now,
  });

  try {
    const upstream = await fetch(config.createUrl, {
      method: "POST",
      headers: { ...gatewayHeaders(config), "Idempotency-Key": id },
      body: JSON.stringify(gatewayCreateBody(config.createUrl, id, details)),
      signal: AbortSignal.timeout(15000),
    });
    const payload = await upstream.json().catch(() => null);
    if (!upstream.ok || !payload) throw new Error("A API do PixVault recusou ou não respondeu à cobrança.");
    const pixCode = findField(payload, ["pix_code", "pix_key", "copy_paste", "emv", "qrcode", "qr_code"]);
    const providerId = findField(payload, ["uuid", "transaction_id", "transactionId", "id"]);
    if (!pixCode || !providerId) throw new Error("O PixVault não retornou o código Pix e o identificador da cobrança.");
    await orderRef.update({ providerId: String(providerId), pixCode: String(pixCode), status: "pending", updatedAt: new Date().toISOString() });
    return json(res, 201, { orderId: id, accessToken, eventTitle: details.event.title, amountCents: details.amountCents, pixCode: String(pixCode), status: "pending" });
  } catch (error) {
    await orderRef.update({ status: "gateway_error", updatedAt: new Date().toISOString() });
    console.error("PixVault create failed:", error.message);
    return json(res, 502, { error: "Não foi possível confirmar a cobrança com o PixVault. Nenhum ingresso foi emitido. Se o banco mostrar um débito, procure o suporte antes de tentar novamente." });
  }
}

async function authorizedOrder(req, db, orderId) {
  if (!/^[0-9a-f-]{36}$/i.test(orderId)) return null;
  const snapshot = await db.collection("orders").doc(orderId).get();
  if (!snapshot.exists) return null;
  const order = snapshot.data();
  const match = String(req.headers.authorization || "").match(/^Bearer\s+(.+)$/i);
  if (!match || !order.accessHash) return null;
  const supplied = crypto.createHash("sha256").update(match[1]).digest();
  const expected = Buffer.from(order.accessHash, "hex");
  if (supplied.length !== expected.length || !crypto.timingSafeEqual(supplied, expected)) return null;
  return { ...order, id: orderId, ref: snapshot.ref };
}

async function issueTickets(db, order) {
  return db.runTransaction(async (transaction) => {
    const snapshot = await transaction.get(order.ref);
    if (!snapshot.exists) return [];
    const current = snapshot.data();
    if (current.status !== "paid") return [];
    if (Array.isArray(current.tickets) && current.tickets.length) return current.tickets;

    const issuedAt = new Date().toISOString();
    const tickets = [];
    for (const line of current.items || []) {
      for (let count = 0; count < line.quantity; count += 1) {
        tickets.push({
          id: crypto.randomUUID(),
          code: crypto.randomBytes(16).toString("hex").toUpperCase(),
          title: line.title,
          eventTitle: current.eventTitle,
          eventDate: current.eventDate,
          issuedAt,
        });
      }
    }
    transaction.update(order.ref, { tickets, updatedAt: issuedAt });
    return tickets;
  });
}

function statusResponse(order, status, tickets = []) {
  return {
    orderId: order.id,
    status,
    amountCents: order.amountCents,
    pixCode: order.pixCode,
    tickets,
  };
}

async function orderStatus(req, res) {
  const url = new URL(req.url, "https://local.invalid");
  const orderId = String(req.query?.orderId || url.searchParams.get("orderId") || "");
  const db = firestore();
  const order = await authorizedOrder(req, db, orderId);
  if (!order) return json(res, 404, { error: "Pedido não encontrado." });

  if (order.status === "paid") {
    const tickets = await issueTickets(db, order);
    return json(res, 200, statusResponse(order, "paid", tickets));
  }
  if (["gateway_error", "failed", "expired", "cancelled", "paid_unverified"].includes(order.status)) {
    return json(res, 200, statusResponse(order, order.status));
  }
  if (!order.providerId) return json(res, 202, statusResponse(order, "pending"));

  const config = gatewayConfig();
  try {
    const upstream = await fetch(statusEndpoint(config, order.providerId), {
      headers: { Accept: "application/json", Authorization: `Bearer ${config.token}`, "x-client-id": config.clientId },
      signal: AbortSignal.timeout(12000),
      cache: "no-store",
    });
    const payload = await upstream.json().catch(() => null);
    if (!upstream.ok || !payload) throw new Error("A consulta de pagamento falhou.");
    const remoteStatus = String(findField(payload, ["status", "payment_status", "paymentStatus"]) || "pending").toLowerCase();
    const updatedAt = new Date().toISOString();

    if (["approved", "paid", "completed", "success", "succeeded"].includes(remoteStatus)) {
      const paidAmount = amountFromStatus(payload, config);
      if (paidAmount === null || paidAmount !== order.amountCents) {
        await order.ref.update({ status: "paid_unverified", updatedAt });
        return json(res, 200, statusResponse(order, "paid_unverified"));
      }
      await order.ref.update({ status: "paid", updatedAt });
      const tickets = await issueTickets(db, order);
      return json(res, 200, statusResponse(order, "paid", tickets));
    }

    if (["expired", "failed", "cancelled", "canceled", "rejected"].includes(remoteStatus)) {
      const finalStatus = remoteStatus === "canceled" ? "cancelled" : remoteStatus;
      await order.ref.update({ status: finalStatus, updatedAt });
      return json(res, 200, statusResponse(order, finalStatus));
    }
    return json(res, 200, statusResponse(order, "pending"));
  } catch (error) {
    console.error("PixVault status check failed:", error.message);
    return json(res, 502, { error: "Não foi possível consultar o pagamento agora." });
  }
}

module.exports = async function handler(req, res) {
  try {
    if (req.method === "POST") return await createOrder(req, res);
    if (req.method === "GET") return await orderStatus(req, res);
    res.setHeader("Allow", "GET, POST");
    return json(res, 405, { error: "Método não permitido." });
  } catch (error) {
    const status = Number(error.statusCode) || 500;
    if (status >= 500) console.error("Checkout API error:", error.message);
    return json(res, status, { error: status < 500 ? error.message : "Não foi possível processar o pedido agora." });
  }
};
