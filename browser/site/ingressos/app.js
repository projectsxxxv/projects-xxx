"use strict";

const state = {
  catalog: null,
  event: null,
  quantities: new Map(),
  checkoutReady: false,
  hasInsurance: false,
  pollTimer: null,
  sidebarTimerId: null,
  paymentTimerId: null,
  order: null,
};

const $ = (id) => document.getElementById(id);
const money = (cents) => new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(cents / 100);
const digits = (value) => String(value || "").replace(/\D/g, "");
const cartKey = (slug) => `event-cart:${slug}`;
const USER_KEY = "gw_user_profile";

function promoConfig() {
  const p = (state.catalog && state.catalog.promo) || {};
  return {
    couponCode: String(p.couponCode || "NOPIX").toUpperCase(),
    discountPercent: Number.isFinite(Number(p.discountPercent)) ? Number(p.discountPercent) : 0.30,
    insuranceCents: Number.isSafeInteger(Number(p.insuranceCents)) ? Number(p.insuranceCents) : 1265,
  };
}

function loadUser() {
  try {
    const raw = localStorage.getItem(USER_KEY) || sessionStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveUser(patch) {
  const current = loadUser();
  const next = { ...current, ...patch };
  try {
    localStorage.setItem(USER_KEY, JSON.stringify(next));
    sessionStorage.setItem(USER_KEY, JSON.stringify(next));
  } catch {}
  return next;
}

function validCpf(value) {
  const cpf = digits(value);
  if (cpf.length !== 11 || /^([0-9])\1{10}$/.test(cpf)) return false;
  for (let digit = 9; digit < 11; digit += 1) {
    let sum = 0;
    for (let i = 0; i < digit; i += 1) sum += Number(cpf[i]) * (digit + 1 - i);
    const check = (sum * 10) % 11;
    if (Number(cpf[digit]) !== (check === 10 ? 0 : check)) return false;
  }
  return true;
}

function formatCpfMask(raw) {
  const d = digits(raw).slice(0, 11);
  if (d.length > 9) return d.replace(/(\d{3})(\d{3})(\d{3})(\d{1,2})/, "$1.$2.$3-$4");
  if (d.length > 6) return d.replace(/(\d{3})(\d{3})(\d{1,3})/, "$1.$2.$3");
  if (d.length > 3) return d.replace(/(\d{3})(\d{1,3})/, "$1.$2");
  return d;
}

function formatPhoneMask(raw) {
  const d = digits(raw).slice(0, 11);
  if (d.length > 6) {
    return d.length === 11
      ? d.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3")
      : d.replace(/(\d{2})(\d{4})(\d{0,4})/, "($1) $2-$3");
  }
  if (d.length > 2) return d.replace(/(\d{2})(\d{1,4})/, "($1) $2");
  return d;
}

function currentUrl() {
  return new URL(window.location.href);
}

function goTo(params) {
  const url = new URL(window.location.pathname, window.location.origin);
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== "") url.searchParams.set(key, value);
  }
  history.pushState({}, "", url);
  window.dispatchEvent(new PopStateEvent("popstate"));
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function configureShell(mode) {
  const views = ["events-view", "event-view", "login-view", "cart-view", "checkout-view", "payment-view"];
  for (const id of views) $(id).hidden = true;
  $("loading").hidden = true;
  $("error").hidden = true;
  document.body.classList.remove("has-dock-open");
  document.body.classList.toggle("event-page", mode === "event");

  const header = $("gw-header");
  const footer = $("site-footer");
  const wa = $("whatsapp-float");
  const searchWrap = $("header-search-wrap");
  const backSite = $("header-back-site");
  const cartLink = $("header-cart-link");
  const flag = $("header-flag");
  const userLabel = $("header-user-label");

  const user = loadUser();
  const displayName = user.name
    ? `Olá, ${user.name.split(" ")[0]}`
    : user.email
      ? `Olá, ${user.email.split("@")[0]}`
      : user.cpf
        ? "Olá, Cliente"
        : null;

  if (mode === "hub") {
    header.hidden = false;
    footer.hidden = false;
    wa.hidden = false;
    searchWrap.hidden = false;
    backSite.hidden = false;
    cartLink.hidden = true;
    flag.hidden = true;
    userLabel.textContent = displayName || "ENTRAR";
    $("events-view").hidden = false;
    document.body.style.backgroundColor = "#e9ecef";
  } else if (mode === "event") {
    header.hidden = false;
    footer.hidden = false;
    wa.hidden = false;
    searchWrap.hidden = true;
    backSite.hidden = true;
    cartLink.hidden = true;
    flag.hidden = false;
    userLabel.textContent = displayName || "Entrar";
    $("event-view").hidden = false;
    document.body.style.backgroundColor = "#d9f01e";
  } else if (mode === "login") {
    header.hidden = true;
    footer.hidden = true;
    wa.hidden = true;
    $("login-view").hidden = false;
    document.body.style.backgroundColor = "#f5f7fb";
  } else if (mode === "cart") {
    header.hidden = false;
    footer.hidden = false;
    wa.hidden = false;
    searchWrap.hidden = true;
    backSite.hidden = true;
    cartLink.hidden = false;
    flag.hidden = true;
    userLabel.textContent = displayName || "Olá, Cliente";
    $("cart-view").hidden = false;
    document.body.style.backgroundColor = "#f0f2f5";
  } else if (mode === "checkout" || mode === "payment") {
    header.hidden = true;
    footer.hidden = true;
    wa.hidden = true;
    $(mode === "checkout" ? "checkout-view" : "payment-view").hidden = false;
    document.body.style.backgroundColor = "#ffffff";
  }

  // Update footer deep links cleanly
  const slugParam = state.event ? `?evento=${encodeURIComponent(state.event.slug)}` : "";
  $("footer-login-link").href = slugParam ? `/ingressos/${slugParam}&etapa=login` : "/ingressos/?etapa=login";
  $("footer-cart-link").href = state.event && totals().quantity > 0
    ? `/ingressos/?evento=${encodeURIComponent(state.event.slug)}&etapa=carrinho`
    : "/ingressos/";
}

function showError(message) {
  configureShell("hub");
  $("events-view").hidden = true;
  $("error").textContent = message;
  $("error").hidden = false;
}

function ticketMap(event) {
  const map = new Map();
  for (const section of event.sections || []) {
    for (const ticket of section.tickets || []) map.set(ticket.id, { ticket, sectionName: section.name });
  }
  return map;
}

function selectedTickets() {
  if (!state.event) return [];
  const map = ticketMap(state.event);
  return [...state.quantities.entries()]
    .filter(([, qty]) => qty > 0)
    .map(([ticketId, quantity]) => {
      const entry = map.get(ticketId);
      return entry ? { ticket: entry.ticket, sectionName: entry.sectionName, ticketId, quantity } : null;
    })
    .filter(Boolean);
}

function totals() {
  const base = selectedTickets().reduce((acc, item) => {
    acc.quantity += item.quantity;
    acc.priceCents += Number(item.ticket.priceCents) * item.quantity;
    acc.feeCents += Number(item.ticket.feeCents) * item.quantity;
    return acc;
  }, { quantity: 0, priceCents: 0, feeCents: 0 });

  const promo = promoConfig();
  const originalTotalCents = base.priceCents + base.feeCents;
  const discountCents = Math.round(originalTotalCents * promo.discountPercent);
  const insuranceCents = state.hasInsurance ? promo.insuranceCents : 0;
  const finalTotalCents = Math.max(0, originalTotalCents - discountCents + insuranceCents);
  return { ...base, originalTotalCents, discountCents, insuranceCents, finalTotalCents };
}

function saveCart() {
  if (!state.event) return;
  try {
    localStorage.setItem(cartKey(state.event.slug), JSON.stringify([...state.quantities.entries()]));
  } catch {}
}

function loadCart(event) {
  state.quantities.clear();
  try {
    const saved = JSON.parse(localStorage.getItem(cartKey(event.slug)) || "[]");
    const map = ticketMap(event);
    for (const [ticketId, qty] of saved) {
      if (map.has(ticketId) && Number.isInteger(qty) && qty > 0 && qty <= 5) {
        state.quantities.set(ticketId, qty);
      }
    }
  } catch {
    localStorage.removeItem(cartKey(event.slug));
  }
}

/* ================================
   STAGE 0: HUB
   ================================ */
function renderEventList() {
  state.event = null;
  configureShell("hub");
  document.title = "Ingressos | Greenvalley Brasil";
  const cards = $("event-cards");
  cards.replaceChildren();

  for (const event of state.catalog.events || []) {
    const card = document.createElement("a");
    card.className = "event-card";
    card.href = `/ingressos/?evento=${encodeURIComponent(event.slug)}`;
    card.dataset.search = `${event.title} ${event.artist || ""} ${event.venue || ""} ${event.city || ""} ${event.date || ""}`.toLowerCase();

    const imgWrap = document.createElement("div");
    imgWrap.className = "img-wrapper";
    const img = document.createElement("img");
    img.src = event.image;
    img.alt = event.title;
    img.loading = "lazy";
    imgWrap.append(img);

    const info = document.createElement("div");
    info.className = "card-info";

    const h2 = document.createElement("h2");
    h2.className = "card-title-text";
    h2.textContent = event.title;

    const locRow = document.createElement("div");
    locRow.className = "meta-item";
    locRow.innerHTML = '<svg viewBox="0 0 24 24" width="12" height="12" fill="currentColor" aria-hidden="true"><path d="M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7zm0 9.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5z"/></svg>';
    const locSpan = document.createElement("span");
    locSpan.textContent = (event.city || "CAMBORIÚ/SC").replace(", ", "/").toUpperCase();
    locRow.append(locSpan);

    const dateRow = document.createElement("div");
    dateRow.className = "meta-item";
    dateRow.innerHTML = '<svg viewBox="0 0 24 24" width="12" height="12" fill="currentColor" aria-hidden="true"><path d="M19 4h-1V2h-2v2H8V2H6v2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zm0 16H5V9h14z"/></svg>';
    const dateSpan = document.createElement("span");
    dateSpan.textContent = event.date;
    dateRow.append(dateSpan);

    info.append(h2, locRow, dateRow);
    card.append(imgWrap, info);
    cards.append(card);
  }

  $("event-search").value = "";
  $("empty-search").hidden = true;
}

/* ================================
   STAGE 1: EVENT PAGE & SECTORS
   ================================ */
function createTicketRow(ticket) {
  const row = document.createElement("div");
  row.className = "ticket-row";

  const copy = document.createElement("div");
  copy.className = "ticket-copy";

  const nameLine = document.createElement("div");
  const p1 = document.createElement("span");
  p1.className = "meta-prefix";
  p1.textContent = "Ingresso: ";
  nameLine.append(p1, document.createTextNode(ticket.title));

  const batchLine = document.createElement("div");
  const p2 = document.createElement("span");
  p2.className = "meta-prefix";
  p2.textContent = "Lote: ";
  batchLine.append(p2, document.createTextNode(ticket.batch || ""));

  const priceLine = document.createElement("div");
  priceLine.className = "ticket-price";
  const p3 = document.createElement("span");
  p3.className = "meta-prefix";
  p3.textContent = "Valor: ";
  const baseStrong = document.createElement("strong");
  baseStrong.textContent = money(Number(ticket.priceCents));
  const feeSpan = document.createElement("span");
  feeSpan.className = "fee-label";
  const feeGreen = document.createElement("span");
  feeGreen.className = "fee-green";
  feeGreen.textContent = money(Number(ticket.feeCents));
  feeSpan.append(" + ", feeGreen, " Taxa de Serviço");
  priceLine.append(p3, baseStrong, feeSpan);

  copy.append(nameLine, batchLine, priceLine);

  const controls = document.createElement("div");
  controls.className = "quantity-control";

  const dec = document.createElement("button");
  dec.type = "button";
  dec.dataset.ticket = ticket.id;
  dec.dataset.step = "-1";
  dec.setAttribute("aria-label", `Remover um ingresso: ${ticket.title}`);
  dec.textContent = "-";

  const out = document.createElement("output");
  out.dataset.ticket = ticket.id;
  out.setAttribute("aria-live", "polite");
  out.textContent = String(state.quantities.get(ticket.id) || 0);

  const inc = document.createElement("button");
  inc.type = "button";
  inc.dataset.ticket = ticket.id;
  inc.dataset.step = "1";
  inc.setAttribute("aria-label", `Adicionar um ingresso: ${ticket.title}`);
  inc.textContent = "+";

  controls.append(dec, out, inc);
  row.append(copy, controls);
  return row;
}

function buildTicketSections() {
  const container = $("ticket-sections");
  container.replaceChildren();

  for (const [idx, section] of (state.event.sections || []).entries()) {
    const group = document.createElement("details");
    group.className = "ticket-section";
    group.dataset.sectorIdx = String(idx);
    const hasSelected = (section.tickets || []).some((t) => (state.quantities.get(t.id) || 0) > 0);
    group.open = idx === 0 || hasSelected;

    const summary = document.createElement("summary");
    summary.className = "section-toggle";

    const copy = document.createElement("div");
    copy.className = "section-toggle-copy";

    const titleRow = document.createElement("div");
    titleRow.className = "section-toggle-title-row";
    const strong = document.createElement("strong");
    strong.textContent = section.name;

    const badge = document.createElement("span");
    badge.className = "sector-cart-badge";
    badge.dataset.sectorBadge = String(idx);
    badge.hidden = true;
    badge.innerHTML = '<svg viewBox="0 0 24 24" width="12" height="12" fill="currentColor" aria-hidden="true"><path d="M7 18a2 2 0 1 0 2 2 2 2 0 0 0-2-2zm10 0a2 2 0 1 0 2 2 2 2 0 0 0-2-2zM7.16 14.26l.03-.12.9-1.64h7.45a2 2 0 0 0 1.75-1.03l3.58-6.49A1 1 0 0 0 20 3.5H5.21l-.94-2H1v2h2l3.6 7.59-1.35 2.44A2 2 0 0 0 7 16.5h12v-2H7.42a.25.25 0 0 1-.26-.24z"/></svg>';
    const countSpan = document.createElement("span");
    countSpan.className = "sector-badge-count";
    countSpan.textContent = "0";
    badge.append(countSpan);

    titleRow.append(strong, badge);

    const minCents = (section.tickets || []).reduce(
      (min, t) => Math.min(min, Number(t.priceCents)),
      Number.POSITIVE_INFINITY
    );
    const small = document.createElement("small");
    const helpDot = document.createElement("span");
    helpDot.className = "help-dot help-dot-dark";
    helpDot.setAttribute("aria-hidden", "true");
    helpDot.textContent = "?";
    small.append(`a partir de ${money(minCents)} + taxas`, helpDot);

    copy.append(titleRow, small);

    const chevron = document.createElement("span");
    chevron.className = "section-chevron";
    chevron.setAttribute("aria-hidden", "true");
    chevron.textContent = "⌄";

    summary.append(copy, chevron);

    const items = document.createElement("div");
    items.className = "section-items";
    for (const ticket of section.tickets || []) {
      items.append(createTicketRow(ticket));
    }

    group.append(summary, items);
    container.append(group);
  }
}

function updateTicketSummary() {
  if (!state.event) return;
  saveCart();
  const summary = totals();
  const dock = $("ticket-dock");
  dock.hidden = summary.quantity === 0;
  document.body.classList.toggle("has-dock-open", summary.quantity > 0);

  $("dock-count").textContent = `${summary.quantity} ${summary.quantity === 1 ? "ITEM NO CARRINHO" : "ITENS NO CARRINHO"}`;
  $("dock-total").textContent = money(summary.priceCents);
  $("dock-fees").textContent = `Taxas: ${money(summary.feeCents)}`;
  $("header-cart-badge").textContent = String(summary.quantity);

  document.querySelectorAll(".quantity-control output").forEach((out) => {
    out.textContent = String(state.quantities.get(out.dataset.ticket) || 0);
  });
  document.querySelectorAll(".quantity-control button").forEach((btn) => {
    const curr = state.quantities.get(btn.dataset.ticket) || 0;
    if (btn.dataset.step === "-1") btn.disabled = curr === 0;
    else btn.disabled = curr >= 5 || summary.quantity >= 10;
  });

  // Update blue cart count badge per sector
  for (const [idx, section] of (state.event.sections || []).entries()) {
    const sectorQty = (section.tickets || []).reduce(
      (sum, t) => sum + (state.quantities.get(t.id) || 0),
      0
    );
    const badge = document.querySelector(`[data-sector-badge="${idx}"]`);
    if (badge) {
      badge.hidden = sectorQty === 0;
      const countEl = badge.querySelector(".sector-badge-count");
      if (countEl) countEl.textContent = String(sectorQty);
    }
  }
}

function renderEvent(event) {
  state.event = event;
  loadCart(event);
  configureShell("event");
  document.title = `${event.title} - Guichê Web | Greenvalley`;

  const hero = $("event-hero");
  const bannerWrap = $("event-hero-banner-wrap");
  const heroArt = $("hero-art-img");
  const heroFallback = $("event-hero-fallback");

  if (event.heroArt) {
    hero.classList.remove("is-poster-hero");
    hero.style.backgroundImage = `url("${event.heroBg || event.image}")`;
    heroArt.src = event.heroArt;
    heroArt.alt = event.title;
    bannerWrap.hidden = false;
    heroFallback.hidden = true;
  } else {
    hero.classList.add("is-poster-hero");
    hero.style.backgroundImage = `url("${event.image}")`;
    bannerWrap.hidden = true;
    heroFallback.hidden = false;
    const [day, month, year] = event.date.split("/");
    const monthLabel = new Intl.DateTimeFormat("en", { month: "short" })
      .format(new Date(Number(year), Number(month) - 1, Number(day)))
      .toUpperCase();
    $("hero-date").textContent = `${day}${monthLabel} // ${event.time}`;
    $("hero-artist").textContent = event.artist || event.title;
  }

  $("event-image").src = event.flyerImage || event.image;
  $("event-image").alt = event.title;
  $("event-title").textContent = event.title;
  $("event-date").textContent = event.date;
  $("event-time").textContent = event.time;
  $("event-venue").textContent = `${event.venue} - ${(event.city || "CAMBORIÚ/SC").replace(", ", "/").toUpperCase()}`;
  $("event-description").textContent = event.fullDescription || event.description || "";
  const minimumAge = Number(event.minAge) || 18;
  $("age-label").textContent = `${minimumAge} anos completos ou mais.`;
  $("information-age-copy").textContent = `${minimumAge} anos`;
  $("information-event-title").textContent = event.title;
  $("event-facts").textContent = [
    `Data: ${event.date}${event.dayOfWeek ? ` (${event.dayOfWeek})` : ""}`,
    `Abertura: ${event.time}`,
    `Local: ${event.venue} · ${event.city}`,
  ].join("\n");
  $("event-address").textContent = event.address || "";
  $("location-address").textContent = event.address || "";

  const hasSocialTickets = (event.sections || []).some((section) =>
    (section.tickets || []).some((ticket) => /social/i.test(`${section.name} ${ticket.title} ${ticket.batch}`))
  );
  $("event-social-copy").textContent = hasSocialTickets
    ? "Os ingressos da categoria Social indicam a doação de 1 kg de alimento no lote correspondente. Confira as condições exibidas junto ao ingresso escolhido."
    : "Consulte a descrição do lote escolhido para verificar se há condição especial vinculada ao ingresso.";

  const sectorList = $("event-sector-list");
  sectorList.replaceChildren();
  for (const section of event.sections || []) {
    const item = document.createElement("li");
    item.textContent = `${section.name}: ${(section.tickets || []).map((ticket) => ticket.title).join(" · ")}`;
    sectorList.append(item);
  }

  const rules = [
    "Confira o evento, a data, o horário, o setor e a categoria selecionados antes de avançar para o carrinho.",
    "A quantidade máxima é de 5 unidades por tipo de ingresso e 10 ingressos por pedido.",
    "Os valores apresentados no seletor incluem o preço do ingresso e a taxa de serviço indicada para aquele lote.",
    "Preencha nome, e-mail, CPF e celular do comprador para solicitar a cobrança Pix.",
    "O pedido permanece aguardando pagamento enquanto a cobrança Pix não tiver confirmação.",
    "Os ingressos digitais são emitidos após a confirmação do pagamento. Se a conferência da cobrança ficar pendente, nenhum ingresso é liberado até a validação.",
    "Apresente na entrada o código digital de cada ingresso. Cada código pode ser validado uma única vez.",
    "Guarde os códigos de ingresso e não os compartilhe: quem apresentar primeiro um código válido poderá utilizá-lo na entrada.",
    `A classificação indicada para este evento é de ${minimumAge} anos. Leve documento oficial com foto para conferência de idade e de categoria, quando aplicável.`,
    "Lotes e disponibilidade podem mudar conforme as vendas. Confira o preço atualizado antes de concluir o pedido.",
    "Em caso de dúvida sobre o pedido ou o acesso ao evento, use os canais de atendimento informados nesta página.",
  ];
  const rulesList = $("event-rules-copy");
  rulesList.replaceChildren();
  for (const rule of rules) {
    const item = document.createElement("li");
    item.textContent = rule;
    rulesList.append(item);
  }

  const mapWrap = $("event-map-wrap");
  if (event.mapImage) {
    $("event-map").src = event.mapImage;
    mapWrap.hidden = false;
  } else {
    mapWrap.hidden = true;
  }

  const videoSec = $("video-section");
  const tabVideo = $("tab-video");
  const embedWrap = $("video-embed-wrap");
  if (event.videoUrl) {
    embedWrap.replaceChildren();
    const video = document.createElement("video");
    video.controls = true;
    video.preload = "none";
    video.playsInline = true;
    video.poster = event.videoPoster || "/imagens/video/greenvalley_video_poster.jpg";
    video.setAttribute("aria-label", `Vídeo ${event.title}`);
    const source = document.createElement("source");
    source.src = event.videoUrl;
    source.type = "video/mp4";
    video.append(source, "Seu navegador não consegue reproduzir este vídeo.");
    embedWrap.append(video);
    videoSec.hidden = false;
    tabVideo.hidden = false;
  } else {
    embedWrap.replaceChildren();
    videoSec.hidden = true;
    tabVideo.hidden = true;
  }

  buildTicketSections();
  updateTicketSummary();
}

/* ================================
   STAGE 2: LOGIN SEM SENHA
   ================================ */
function renderLogin() {
  configureShell("login");
  document.title = state.event ? `Entrar | ${state.event.title}` : "Faça login em sua conta | Guichê Web";
  const user = loadUser();
  $("login-identifier").value = user.email || (user.cpf ? formatCpfMask(user.cpf) : "");
  $("login-identifier").classList.remove("is-invalid");
  $("login-error").hidden = true;
}

function handleLoginSubmit(e) {
  e.preventDefault();
  const input = $("login-identifier");
  const errorEl = $("login-error");
  const val = input.value.trim();

  if (!val) {
    input.classList.add("is-invalid");
    errorEl.textContent = "Por favor, informe seu e-mail ou CPF para continuar.";
    errorEl.hidden = false;
    input.focus();
    return;
  }

  const isEmailMode = /[a-zA-Z@]/.test(val);
  if (isEmailMode) {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val) || val.length > 180) {
      input.classList.add("is-invalid");
      errorEl.textContent = "Digite um endereço de e-mail válido.";
      errorEl.hidden = false;
      input.focus();
      return;
    }
    saveUser({ email: val.toLowerCase(), identifier: val.toLowerCase() });
  } else {
    const rawCpf = digits(val);
    if (!validCpf(rawCpf)) {
      input.classList.add("is-invalid");
      errorEl.textContent = "O CPF informado é inválido. Confira os 11 dígitos.";
      errorEl.hidden = false;
      input.focus();
      return;
    }
    saveUser({ cpf: rawCpf, identifier: rawCpf });
  }

  if (state.event && totals().quantity > 0) {
    goTo({ evento: state.event.slug, etapa: "carrinho" });
  } else if (state.event) {
    goTo({ evento: state.event.slug });
  } else {
    goTo({});
  }
}

/* ================================
   STAGE 3: CARRINHO
   ================================ */
function renderCart() {
  const summary = totals();
  if (!state.event || summary.quantity === 0) {
    goTo(state.event ? { evento: state.event.slug } : {});
    return;
  }
  configureShell("cart");
  document.title = `Carrinho | ${state.event.title}`;

  $("back-to-tickets").href = `/ingressos/?evento=${encodeURIComponent(state.event.slug)}`;
  $("cart-count").textContent = String(summary.quantity);
  $("cart-fees").textContent = money(summary.feeCents);
  $("cart-total").textContent = money(summary.originalTotalCents);
  $("header-cart-badge").textContent = String(summary.quantity);

  const container = $("cart-items");
  container.replaceChildren();

  const shortDate = state.event.date ? state.event.date.slice(0, 5) : "";

  for (const item of selectedTickets()) {
    const row = document.createElement("div");
    row.className = "cart-item-row";

    const info = document.createElement("div");
    info.className = "cart-item-info";

    const iconBox = document.createElement("div");
    iconBox.className = "ticket-icon-box";
    iconBox.setAttribute("aria-hidden", "true");
    iconBox.innerHTML = '<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M4 6h16v2H4zm0 5h16v2H4zm0 5h10v2H4z"/></svg>';

    const copy = document.createElement("div");
    copy.className = "cart-item-copy";

    const strong = document.createElement("strong");
    strong.textContent = `${state.event.title} - ${shortDate}`;

    const cam = document.createElement("span");
    cam.className = "cart-camera-icon";
    cam.setAttribute("aria-hidden", "true");
    cam.innerHTML = '<svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M9 3L7.17 5H4a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-3.17L15 3H9zm3 14a4.5 4.5 0 1 1 0-9 4.5 4.5 0 0 1 0 9z"/></svg>';

    const ticketName = document.createElement("span");
    ticketName.className = "ticket-name";
    ticketName.textContent = `Ingresso: ${item.ticket.title}`;

    copy.append(strong, cam, ticketName);
    info.append(iconBox, copy);

    const qtyWrap = document.createElement("div");
    qtyWrap.className = "cart-quantity";
    const select = document.createElement("select");
    select.dataset.ticket = item.ticketId;
    select.setAttribute("aria-label", `Quantidade de ${item.ticket.title}`);
    const available = Math.max(0, 10 - (summary.quantity - item.quantity));
    for (let count = 0; count <= Math.min(5, available); count += 1) {
      const opt = document.createElement("option");
      opt.value = String(count);
      opt.textContent = String(count);
      opt.selected = count === item.quantity;
      select.append(opt);
    }
    qtyWrap.append(select);

    const priceWrap = document.createElement("div");
    priceWrap.className = "cart-item-price";
    const valSpan = document.createElement("span");
    valSpan.textContent = money(Number(item.ticket.priceCents) * item.quantity);

    const removeBtn = document.createElement("button");
    removeBtn.type = "button";
    removeBtn.className = "cart-remove";
    removeBtn.dataset.remove = item.ticketId;
    removeBtn.setAttribute("aria-label", `Remover ${item.ticket.title} do carrinho`);
    removeBtn.innerHTML = "&times;";

    priceWrap.append(valSpan, removeBtn);
    row.append(info, qtyWrap, priceWrap);
    container.append(row);
  }
}

/* ================================
   STAGE 4: CHECKOUT (NOPIX 30% + PIX LOCKED + INGRESSO PROTEGIDO)
   ================================ */
function populateSidebarLines(containerId, includeBreakdown = true) {
  const container = $(containerId);
  container.replaceChildren();
  const summary = totals();
  for (const item of selectedTickets()) {
    const line = document.createElement("div");
    line.className = "sidebar-line";
    const left = document.createElement("span");
    left.textContent = `${item.quantity} × ${item.ticket.title}`;
    const right = document.createElement("strong");
    right.textContent = money((Number(item.ticket.priceCents) + Number(item.ticket.feeCents)) * item.quantity);
    line.append(left, right);
    container.append(line);
  }
  if (includeBreakdown) {
    const discLine = document.createElement("div");
    discLine.className = "sidebar-line";
    discLine.style.color = "#00a859";
    const discLeft = document.createElement("span");
    discLeft.textContent = `Desconto Cupom ${promoConfig().couponCode} (30%)`;
    const discRight = document.createElement("strong");
    discRight.textContent = `-${money(summary.discountCents)}`;
    discLine.append(discLeft, discRight);
    container.append(discLine);
    if (summary.insuranceCents > 0) {
      const insLine = document.createElement("div");
      insLine.className = "sidebar-line";
      const insLeft = document.createElement("span");
      insLeft.textContent = "Ingresso Protegido";
      const insRight = document.createElement("strong");
      insRight.textContent = `+${money(summary.insuranceCents)}`;
      insLine.append(insLeft, insRight);
      container.append(insLine);
    }
  }
}

function updateCheckoutSidebarTotals() {
  const summary = totals();
  $("sidebar-original-val").textContent = money(summary.originalTotalCents);
  $("sidebar-total").textContent = money(summary.finalTotalCents);
  populateSidebarLines("checkout-lines", true);
}

function startSidebarCountdown(elId, startSeconds, timerProp) {
  clearInterval(state[timerProp]);
  let remaining = startSeconds;
  const update = () => {
    const m = Math.floor(remaining / 60);
    const s = remaining % 60;
    const el = $(elId);
    if (el) el.textContent = `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
    if (--remaining < 0) remaining = startSeconds;
  };
  update();
  state[timerProp] = setInterval(update, 1000);
}

function showCheckout() {
  const summary = totals();
  if (!state.event || summary.quantity === 0) {
    goTo(state.event ? { evento: state.event.slug } : {});
    return;
  }
  configureShell("checkout");
  document.title = `Escolha a forma de pagamento | ${state.event.title}`;

  $("back-to-cart").href = `/ingressos/?evento=${encodeURIComponent(state.event.slug)}&etapa=carrinho`;
  $("promo-lock-notice").hidden = true;
  $("checkout-notice").hidden = state.checkoutReady;
  $("buyer-modal").hidden = true;

  const flyerSrc = state.event.flyerImage || state.event.image;
  $("sidebar-image").src = flyerSrc;
  $("sidebar-image").alt = state.event.title;
  $("sidebar-title").textContent = state.event.title;
  $("sidebar-details").textContent = state.event.shortAddress || `${state.event.venue} · ${state.event.date}`;

  const promo = promoConfig();
  $("cupom-code").value = promo.couponCode;
  $("insurance-price-label").textContent = money(promo.insuranceCents);

  const radioSim = document.querySelector('input[name="insurance-opt"][value="sim"]');
  const radioNao = document.querySelector('input[name="insurance-opt"][value="nao"]');
  if (radioSim && radioNao) {
    radioSim.checked = state.hasInsurance;
    radioNao.checked = !state.hasInsurance;
  }

  updateCheckoutSidebarTotals();
  startSidebarCountdown("sidebar-timer", 14 * 60 + 44, "sidebarTimerId");
}

function openBuyerModal() {
  const user = loadUser();
  $("buyer-name").value = user.name || "";
  $("buyer-email").value = user.email || "";
  $("buyer-cpf").value = user.cpf ? formatCpfMask(user.cpf) : "";
  $("buyer-phone").value = user.phone ? formatPhoneMask(user.phone) : "";
  $("form-error").hidden = true;

  const btn = $("create-order");
  btn.disabled = false;
  btn.textContent = "Gerar QR Code Pix";

  $("buyer-modal").hidden = false;
  if (!$("buyer-name").value) $("buyer-name").focus();
  else if (!$("buyer-email").value) $("buyer-email").focus();
  else if (!$("buyer-cpf").value) $("buyer-cpf").focus();
  else $("buyer-phone").focus();
}

function closeBuyerModal() {
  $("buyer-modal").hidden = true;
}

async function submitOrder(e) {
  e.preventDefault();
  const form = $("buyer-form");
  const errorBox = $("form-error");
  errorBox.hidden = true;

  const name = $("buyer-name").value.trim();
  const email = $("buyer-email").value.trim().toLowerCase();
  const cpf = digits($("buyer-cpf").value);
  const phone = digits($("buyer-phone").value);

  if (!form.reportValidity() || name.length < 3) {
    errorBox.textContent = "Informe seu nome completo (mínimo 3 caracteres).";
    errorBox.hidden = false;
    return;
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errorBox.textContent = "Informe um endereço de e-mail válido.";
    errorBox.hidden = false;
    return;
  }
  if (!validCpf(cpf)) {
    errorBox.textContent = "CPF inválido. Confira os 11 dígitos.";
    errorBox.hidden = false;
    return;
  }
  if (phone.length < 10 || phone.length > 13) {
    errorBox.textContent = "Informe um celular válido com DDD (10 ou 11 dígitos).";
    errorBox.hidden = false;
    return;
  }

  saveUser({ name, email, cpf, phone });

  const btn = $("create-order");
  btn.disabled = true;
  btn.textContent = "Gerando cobrança Pix...";

  try {
    const response = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        eventSlug: state.event.slug,
        coupon: promoConfig().couponCode,
        insurance: state.hasInsurance,
        items: selectedTickets().map(({ ticketId, quantity }) => ({ ticketId, quantity })),
        customer: { name, email, cpf, phone },
      }),
    });

    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.error || "Não foi possível criar a cobrança Pix.");
    }

    localStorage.setItem(`order-access:${result.orderId}`, result.accessToken);
    localStorage.setItem(`order-event:${result.orderId}`, state.event.slug);
    closeBuyerModal();
    goTo({ evento: state.event.slug, pedido: result.orderId });
  } catch (err) {
    errorBox.textContent = err.message || "Falha de comunicação. Tente novamente.";
    errorBox.hidden = false;
    btn.disabled = false;
    btn.textContent = "Gerar QR Code Pix";
  }
}

/* ================================
   STAGE 5: PAYMENT PIX SCREEN
   ================================ */
function showTickets(tickets) {
  $("payment-pending").hidden = true;
  $("tickets-panel").hidden = false;
  const container = $("issued-tickets");
  container.replaceChildren();

  for (const ticket of tickets) {
    const card = document.createElement("article");
    card.className = "issued-ticket";
    const h3 = document.createElement("h3");
    h3.textContent = ticket.title;
    const details = document.createElement("p");
    details.textContent = `${ticket.eventTitle} · ${ticket.eventDate}`;
    const code = document.createElement("code");
    code.textContent = ticket.code;
    card.append(h3, details, code);
    container.append(card);
  }
}

function showPayment(order) {
  state.order = order;
  configureShell("payment");
  document.title = `Finalize o pagamento com o Pix | ${order.eventTitle || state.event.title}`;

  const summary = totals();
  const finalCents = Number(order.amountCents || summary.finalTotalCents);
  const origCents = Number(order.originalAmountCents || summary.originalTotalCents || finalCents);

  $("payment-original-val").textContent = money(origCents);
  $("payment-original-val").hidden = origCents <= finalCents;
  $("payment-sidebar-total").textContent = money(finalCents);

  $("pix-code").value = order.pixCode || "";
  $("payment-order-id").textContent = order.orderId || "";
  $("payment-pending").hidden = false;
  $("tickets-panel").hidden = true;
  $("copy-toast").hidden = true;

  $("payment-image").src = state.event.flyerImage || state.event.image;
  $("payment-image").alt = state.event.title;
  $("payment-event-title").textContent = order.eventTitle || state.event.title;
  $("payment-event-details").textContent = state.event.shortAddress || `${state.event.venue} · ${state.event.date}`;
  populateSidebarLines("payment-lines", false);

  if (window.QRCode && typeof window.QRCode.toDataURL === "function" && order.pixCode) {
    window.QRCode.toDataURL(order.pixCode, { width: 220, margin: 1 }, (err, dataUrl) => {
      $("pix-qr").src = !err && dataUrl ? dataUrl : "./assets/pix_qrcode.png";
    });
  } else {
    $("pix-qr").src = "./assets/pix_qrcode.png";
  }

  startSidebarCountdown("payment-timer", 14 * 60 + 53, "paymentTimerId");
}

async function pollOrder(orderId, accessToken) {
  clearInterval(state.pollTimer);
  const check = async () => {
    try {
      const response = await fetch(`/api/checkout?orderId=${encodeURIComponent(orderId)}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
        cache: "no-store",
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Não foi possível consultar o pagamento.");

      if (result.status === "paid" && Array.isArray(result.tickets)) {
        $("payment-status").textContent = "Pagamento confirmado! Emitindo seus ingressos...";
        clearInterval(state.pollTimer);
        showTickets(result.tickets);
      } else if (result.status === "paid_unverified") {
        clearInterval(state.pollTimer);
        $("payment-status").textContent = `Pagamento sinalizado pelo PixVault, porém aguarda conferência manual do pedido: ${orderId}.`;
      } else if (["expired", "failed", "cancelled", "gateway_error"].includes(result.status)) {
        clearInterval(state.pollTimer);
        $("payment-status").textContent = "Esta cobrança expirou ou não foi aprovada. Retorne aos ingressos para tentar novamente.";
      } else {
        $("payment-status").textContent = "Aguardando confirmação do pagamento via Pix...";
      }
    } catch (error) {
      $("payment-status").textContent = error.message || "Falha ao consultar pagamento; tentando novamente...";
    }
  };
  await check();
  state.pollTimer = setInterval(check, 5000);
}

async function restoreOrder(orderId) {
  const accessToken = localStorage.getItem(`order-access:${orderId}`);
  if (!accessToken) {
    showError("Este pedido não está salvo neste dispositivo. Reabra o link no dispositivo utilizado na compra.");
    return;
  }
  try {
    const response = await fetch(`/api/checkout?orderId=${encodeURIComponent(orderId)}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
      cache: "no-store",
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || "Não foi possível recuperar o pedido.");
    result.orderId = orderId;
    showPayment(result);
    if (result.status === "paid" && Array.isArray(result.tickets)) showTickets(result.tickets);
    else if (result.status === "paid_unverified") {
      $("payment-status").textContent = "Pagamento informado pelo PixVault. Conferência de valor pendente.";
    } else {
      pollOrder(orderId, accessToken);
    }
  } catch (err) {
    showError(err.message || "Não foi possível recuperar o pedido.");
  }
}

/* ================================
   ROUTER & BOOTSTRAP
   ================================ */
async function checkCheckoutReady() {
  try {
    const res = await fetch("/api/health", { cache: "no-store" });
    const data = await res.json();
    state.checkoutReady = res.ok && data.checkoutReady === true;
  } catch {
    state.checkoutReady = false;
  }
}

async function renderRoute() {
  const url = currentUrl();
  const eventSlug = url.searchParams.get("evento");
  const orderId = url.searchParams.get("pedido");
  const step = url.searchParams.get("etapa");

  clearInterval(state.pollTimer);
  clearInterval(state.sidebarTimerId);
  clearInterval(state.paymentTimerId);

  if (step === "login") {
    state.event = eventSlug
      ? (state.catalog.events || []).find((e) => e.slug === eventSlug) || null
      : null;
    if (state.event) loadCart(state.event);
    renderLogin();
    return;
  }

  if (!eventSlug) {
    renderEventList();
    return;
  }

  const event = (state.catalog.events || []).find((e) => e.slug === eventSlug);
  if (!event) {
    showError("Este evento não está disponível no momento.");
    return;
  }

  state.event = event;
  loadCart(event);

  if (orderId) {
    await restoreOrder(orderId);
    return;
  }

  if (step === "carrinho") renderCart();
  else if (step === "checkout") showCheckout();
  else renderEvent(event);
}

async function init() {
  try {
    const [, catalogRes] = await Promise.all([
      checkCheckoutReady(),
      fetch("./eventos.json", { cache: "no-store" }),
    ]);
    if (!catalogRes.ok) throw new Error("Não foi possível carregar o catálogo de eventos.");
    state.catalog = await catalogRes.json();
    await renderRoute();
  } catch (err) {
    showError(err.message || "Não foi possível carregar a página de ingressos.");
  }
}

/* ================================
   EVENT LISTENERS
   ================================ */
$("event-cards").addEventListener("click", (e) => {
  const card = e.target.closest("a.event-card");
  if (!card) return;
  e.preventDefault();
  const slug = new URL(card.href).searchParams.get("evento");
  goTo({ evento: slug });
});

$("event-search").addEventListener("input", (e) => {
  const q = e.target.value.trim().toLocaleLowerCase("pt-BR");
  let visible = 0;
  for (const card of $("event-cards").children) {
    const match = !q || (card.dataset.search || "").includes(q);
    card.hidden = !match;
    if (match) visible += 1;
  }
  $("empty-search").hidden = visible > 0;
});

$("header-user-btn").addEventListener("click", () => {
  goTo({ evento: state.event?.slug, etapa: "login" });
});

$("header-cart-link").addEventListener("click", (e) => {
  e.preventDefault();
  if (state.event && totals().quantity > 0) {
    goTo({ evento: state.event.slug, etapa: "carrinho" });
  }
});

$("ticket-sections").addEventListener("click", (e) => {
  const btn = e.target.closest("button[data-ticket]");
  if (!btn || !state.event) return;
  const ticketId = btn.dataset.ticket;
  const step = Number(btn.dataset.step);
  const curr = state.quantities.get(ticketId) || 0;
  const next = curr + step;
  const total = totals().quantity;
  if (next < 0 || next > 5 || (next > curr && total >= 10)) return;
  if (next > 0) state.quantities.set(ticketId, next);
  else state.quantities.delete(ticketId);
  updateTicketSummary();
});

$("continue-checkout").addEventListener("click", () => {
  if (!state.event || !totals().quantity) return;
  const user = loadUser();
  if (user.email || user.cpf) {
    goTo({ evento: state.event.slug, etapa: "carrinho" });
  } else {
    goTo({ evento: state.event.slug, etapa: "login" });
  }
});

document.querySelector(".share-icons")?.addEventListener("click", (e) => {
  const btn = e.target.closest("button[data-share]");
  if (!btn || !state.event) return;
  const shareUrl = window.location.href;
  const text = `${state.event.title} - Garanta seu ingresso com 30% OFF no PIX: ${shareUrl}`;
  const kind = btn.dataset.share;
  if (kind === "whatsapp") {
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank", "noopener,noreferrer");
  } else if (kind === "facebook" || kind === "messenger") {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, "_blank", "noopener,noreferrer");
  } else if (navigator.clipboard) {
    navigator.clipboard.writeText(shareUrl).catch(() => {});
  }
});

$("login-identifier").addEventListener("input", (e) => {
  $("login-identifier").classList.remove("is-invalid");
  $("login-error").hidden = true;
  const val = e.target.value;
  const hasLettersOrAt = /[a-zA-Z@]/.test(val);
  if (!hasLettersOrAt && digits(val).length > 0) {
    e.target.value = formatCpfMask(val);
    e.target.setAttribute("maxlength", "14");
  } else {
    e.target.setAttribute("maxlength", "100");
  }
});

$("login-form").addEventListener("submit", handleLoginSubmit);
$("login-focus-signup").addEventListener("click", (e) => {
  e.preventDefault();
  $("login-identifier").focus();
});

$("cart-items").addEventListener("change", (e) => {
  const select = e.target.closest("select[data-ticket]");
  if (!select || !state.event) return;
  const qty = Number(select.value);
  if (qty > 0) state.quantities.set(select.dataset.ticket, qty);
  else state.quantities.delete(select.dataset.ticket);
  updateTicketSummary();
  renderCart();
});

$("cart-items").addEventListener("click", (e) => {
  const btn = e.target.closest("button[data-remove]");
  if (!btn || !state.event) return;
  state.quantities.delete(btn.dataset.remove);
  updateTicketSummary();
  renderCart();
});

$("back-to-tickets").addEventListener("click", (e) => {
  e.preventDefault();
  if (state.event) goTo({ evento: state.event.slug });
});

$("to-checkout").addEventListener("click", () => {
  if (state.event && totals().quantity > 0) {
    goTo({ evento: state.event.slug, etapa: "checkout" });
  }
});

$("back-to-cart").addEventListener("click", (e) => {
  e.preventDefault();
  if (state.event) goTo({ evento: state.event.slug, etapa: "carrinho" });
});

document.querySelector(".payment-options-list").addEventListener("click", (e) => {
  if (e.target.closest("[data-locked-method]")) {
    $("promo-lock-notice").hidden = false;
  }
});

$("insurance-saiba-mais").addEventListener("click", () => {
  $("insurance-more-info").hidden = !$("insurance-more-info").hidden;
});

document.querySelectorAll('input[name="insurance-opt"]').forEach((radio) => {
  radio.addEventListener("change", (e) => {
    state.hasInsurance = e.target.value === "sim";
    updateCheckoutSidebarTotals();
  });
});

$("checkout-summary-toggle").addEventListener("click", () => {
  $("checkout-lines-wrap").hidden = !$("checkout-lines-wrap").hidden;
});

$("payment-summary-toggle").addEventListener("click", () => {
  $("payment-lines-wrap").hidden = !$("payment-lines-wrap").hidden;
});

$("btn-checkout-continuar").addEventListener("click", openBuyerModal);
$("close-buyer-modal").addEventListener("click", closeBuyerModal);
$("buyer-modal").addEventListener("click", (e) => {
  if (e.target === $("buyer-modal")) closeBuyerModal();
});

$("buyer-cpf").addEventListener("input", (e) => {
  e.target.value = formatCpfMask(e.target.value);
});
$("buyer-phone").addEventListener("input", (e) => {
  e.target.value = formatPhoneMask(e.target.value);
});
$("buyer-form").addEventListener("submit", submitOrder);

$("copy-pix").addEventListener("click", async () => {
  const btn = $("copy-pix");
  const toast = $("copy-toast");
  const code = $("pix-code").value;
  try {
    await navigator.clipboard.writeText(code);
  } catch {
    $("pix-code").select();
    document.execCommand("copy");
  }
  btn.textContent = "✓ Código copiado!";
  btn.style.backgroundColor = "#1e4620";
  toast.hidden = false;
  setTimeout(() => {
    btn.textContent = "Copiar código de pagamento";
    btn.style.backgroundColor = "";
    toast.hidden = true;
  }, 3000);
});

window.addEventListener("popstate", renderRoute);

init();
