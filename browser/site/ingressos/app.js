"use strict";

const state = {
  catalog: null,
  event: null,
  quantities: new Map(),
  checkoutReady: false,
  pollTimer: null,
  order: null,
};

const $ = (id) => document.getElementById(id);
const money = (cents) => new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(cents / 100);
const digits = (value) => String(value || "").replace(/\D/g, "");
const cartKey = (slug) => `event-cart:${slug}`;

function showError(message) {
  $("loading").hidden = true;
  for (const id of ["events-view", "event-view", "cart-view", "checkout-view", "payment-view"]) $(id).hidden = true;
  $("site-footer").hidden = true;
  $("error").textContent = message;
  $("error").hidden = false;
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

function setView(viewId, showFooter = true) {
  for (const id of ["events-view", "event-view", "cart-view", "checkout-view", "payment-view"]) $(id).hidden = id !== viewId;
  $("loading").hidden = true;
  $("error").hidden = true;
  $("site-footer").hidden = !showFooter;
}

function ticketMap(event) {
  const tickets = new Map();
  for (const section of event.sections || []) {
    for (const ticket of section.tickets || []) tickets.set(ticket.id, ticket);
  }
  return tickets;
}

function selectedTickets() {
  if (!state.event) return [];
  const tickets = ticketMap(state.event);
  return [...state.quantities.entries()]
    .filter(([, quantity]) => quantity > 0)
    .map(([ticketId, quantity]) => ({ ticket: tickets.get(ticketId), ticketId, quantity }))
    .filter((entry) => entry.ticket);
}

function totals() {
  return selectedTickets().reduce((result, item) => {
    result.quantity += item.quantity;
    result.priceCents += Number(item.ticket.priceCents) * item.quantity;
    result.feeCents += Number(item.ticket.feeCents) * item.quantity;
    return result;
  }, { quantity: 0, priceCents: 0, feeCents: 0 });
}

function saveCart() {
  if (!state.event) return;
  localStorage.setItem(cartKey(state.event.slug), JSON.stringify([...state.quantities.entries()]));
}

function loadCart(event) {
  state.quantities.clear();
  try {
    const saved = JSON.parse(localStorage.getItem(cartKey(event.slug)) || "[]");
    for (const [ticketId, quantity] of saved) {
      if (ticketMap(event).has(ticketId) && Number.isInteger(quantity) && quantity > 0 && quantity <= 5) {
        state.quantities.set(ticketId, quantity);
      }
    }
  } catch {
    localStorage.removeItem(cartKey(event.slug));
  }
}

function formatEventDetails(event) {
  return `${event.date} · ${event.time} · ${event.city}`;
}

function renderEventList() {
  state.event = null;
  setView("events-view");
  document.title = "Ingressos | Green Valley";
  const cards = $("event-cards");
  cards.replaceChildren();

  for (const event of state.catalog.events) {
    const card = document.createElement("a");
    card.className = "event-card";
    card.href = `/ingressos/?evento=${encodeURIComponent(event.slug)}`;

    const image = document.createElement("img");
    image.src = event.image;
    image.alt = `${event.title} — arte do evento`;
    image.loading = "lazy";

    const copy = document.createElement("div");
    copy.className = "event-card-copy";
    const title = document.createElement("h2");
    title.textContent = event.title;
    const location = document.createElement("div");
    location.className = "event-card-meta";
    location.innerHTML = '<span aria-hidden="true">●</span>';
    const locationText = document.createElement("span");
    locationText.textContent = event.city.toUpperCase();
    location.append(locationText);
    const date = document.createElement("div");
    date.className = "event-card-meta";
    date.innerHTML = '<span aria-hidden="true">▦</span>';
    const dateText = document.createElement("span");
    dateText.textContent = event.date;
    date.append(dateText);
    const action = document.createElement("div");
    action.className = "event-card-action";
    action.innerHTML = "<span>Ver detalhes e ingressos</span><strong>COMPRAR →</strong>";
    copy.append(title, location, date, action);
    card.append(image, copy);
    cards.append(card);
  }

  $("event-search").value = "";
  $("empty-search").hidden = true;
}

function buildTicketSections() {
  const container = $("ticket-sections");
  container.replaceChildren();

  for (const [sectionIndex, section] of (state.event.sections || []).entries()) {
    const group = document.createElement("details");
    group.className = "ticket-section";
    group.open = sectionIndex === 0 || section.tickets.some((ticket) => state.quantities.has(ticket.id));

    const summary = document.createElement("summary");
    summary.className = "section-toggle";
    const copy = document.createElement("span");
    copy.className = "section-toggle-copy";
    const title = document.createElement("strong");
    title.textContent = section.name;
    const minTicket = section.tickets.reduce((minimum, ticket) => Math.min(minimum, Number(ticket.priceCents)), Number.POSITIVE_INFINITY);
    const price = document.createElement("small");
    price.textContent = `a partir de ${money(minTicket)} + taxas`;
    const icon = document.createElement("span");
    icon.className = "section-chevron";
    icon.setAttribute("aria-hidden", "true");
    icon.textContent = "⌄";
    copy.append(title, price);
    summary.append(copy, icon);

    const items = document.createElement("div");
    items.className = "section-items";
    for (const ticket of section.tickets) items.append(createTicketRow(ticket));
    group.append(summary, items);
    container.append(group);
  }
}

function createTicketRow(ticket) {
  const row = document.createElement("div");
  row.className = "ticket-row";
  const copy = document.createElement("div");
  copy.className = "ticket-copy";
  const name = document.createElement("strong");
  name.textContent = ticket.title;
  const batch = document.createElement("span");
  batch.className = "ticket-batch";
  batch.textContent = `Lote: ${ticket.batch || ""}`;
  const price = document.createElement("span");
  price.className = "ticket-price";
  const fullPrice = document.createElement("strong");
  fullPrice.textContent = money(Number(ticket.priceCents) + Number(ticket.feeCents));
  const fee = document.createElement("em");
  fee.textContent = ` + ${money(Number(ticket.feeCents))} taxa de serviço`;
  price.append("Valor: ", fullPrice, fee);

  const controls = document.createElement("div");
  controls.className = "quantity-control";
  const decrease = document.createElement("button");
  decrease.type = "button";
  decrease.dataset.ticket = ticket.id;
  decrease.dataset.step = "-1";
  decrease.setAttribute("aria-label", `Remover um ingresso: ${ticket.title}`);
  decrease.textContent = "−";
  const quantity = document.createElement("output");
  quantity.id = `quantity-${ticket.id}`;
  quantity.dataset.ticket = ticket.id;
  quantity.setAttribute("aria-live", "polite");
  quantity.textContent = String(state.quantities.get(ticket.id) || 0);
  const increase = document.createElement("button");
  increase.type = "button";
  increase.dataset.ticket = ticket.id;
  increase.dataset.step = "1";
  increase.setAttribute("aria-label", `Adicionar um ingresso: ${ticket.title}`);
  increase.textContent = "+";
  controls.append(decrease, quantity, increase);
  copy.append(name, batch, price);
  row.append(copy, controls);
  return row;
}

function renderEvent(event) {
  state.event = event;
  loadCart(event);
  setView("event-view");
  document.title = `${event.title} | Ingressos Green Valley`;
  const [day, month, year] = event.date.split("/");
  const monthLabel = new Intl.DateTimeFormat("en", { month: "short" }).format(new Date(Number(year), Number(month) - 1, Number(day))).toUpperCase();
  $("hero-date").textContent = `${day}${monthLabel} // ${event.time.replace(":00", "")}`;
  $("hero-artist").textContent = event.artist || event.title;
  $("event-image").src = event.image;
  $("event-image").alt = `${event.title} — arte do evento`;
  $("event-title").textContent = event.title;
  $("event-date").textContent = event.date;
  $("event-time").textContent = event.time;
  $("event-venue").textContent = `${event.venue} - ${event.city.toUpperCase()}`;
  $("event-address").textContent = event.address;
  $("event-description").textContent = event.description || "";
  $("age-label").textContent = `${event.minAge}+`;
  $("event-hero").style.backgroundImage = `url("${event.image}")`;
  buildTicketSections();
  updateTicketSummary();
}

function updateTicketSummary() {
  if (!state.event) return;
  saveCart();
  const summary = totals();
  const dock = $("ticket-dock");
  dock.hidden = summary.quantity === 0;
  $("dock-count").textContent = `${summary.quantity} ${summary.quantity === 1 ? "ITEM" : "ITENS"} NO CARRINHO`;
  $("dock-total").textContent = money(summary.priceCents + summary.feeCents);
  $("dock-fees").textContent = `Taxas: ${money(summary.feeCents)}`;

  const totalQuantity = summary.quantity;
  document.querySelectorAll(".quantity-control output").forEach((output) => {
    output.textContent = String(state.quantities.get(output.dataset.ticket) || 0);
  });
  document.querySelectorAll(".quantity-control button").forEach((button) => {
    const current = state.quantities.get(button.dataset.ticket) || 0;
    if (button.dataset.step === "-1") button.disabled = current === 0;
    else button.disabled = current >= 5 || totalQuantity >= 10;
  });
}

function renderCart() {
  if (!state.event || totals().quantity === 0) {
    goTo({ evento: state.event?.slug });
    return;
  }
  setView("cart-view");
  document.title = `Carrinho | ${state.event.title}`;
  $("back-to-tickets").href = `/ingressos/?evento=${encodeURIComponent(state.event.slug)}`;
  const summary = totals();
  $("cart-count").textContent = String(summary.quantity);
  $("cart-fees").textContent = money(summary.feeCents);
  $("cart-total").textContent = money(summary.priceCents + summary.feeCents);
  const container = $("cart-items");
  container.replaceChildren();

  for (const item of selectedTickets()) {
    const row = document.createElement("div");
    row.className = "cart-item-row";
    const info = document.createElement("div");
    info.className = "cart-item-info";
    const icon = document.createElement("span");
    icon.className = "ticket-icon-box";
    icon.setAttribute("aria-hidden", "true");
    icon.textContent = "▤";
    const copy = document.createElement("div");
    copy.className = "cart-item-copy";
    const title = document.createElement("strong");
    title.textContent = `${state.event.title} · ${state.event.date}`;
    const ticketName = document.createElement("span");
    ticketName.textContent = `Ingresso: ${item.ticket.title}`;
    copy.append(title, ticketName);
    info.append(icon, copy);

    const quantity = document.createElement("div");
    quantity.className = "cart-quantity";
    const select = document.createElement("select");
    select.dataset.ticket = item.ticketId;
    select.setAttribute("aria-label", `Quantidade de ${item.ticket.title}`);
    const available = Math.max(0, 10 - (summary.quantity - item.quantity));
    for (let count = 0; count <= Math.min(5, available); count += 1) {
      const option = document.createElement("option");
      option.value = String(count);
      option.textContent = String(count);
      option.selected = count === item.quantity;
      select.append(option);
    }
    quantity.append(select);

    const price = document.createElement("div");
    price.className = "cart-item-price";
    const amount = document.createElement("span");
    amount.textContent = money(Number(item.ticket.priceCents) * item.quantity);
    const remove = document.createElement("button");
    remove.type = "button";
    remove.className = "cart-remove";
    remove.dataset.remove = item.ticketId;
    remove.setAttribute("aria-label", `Remover ${item.ticket.title} do carrinho`);
    remove.textContent = "×";
    price.append(amount, remove);
    row.append(info, quantity, price);
    container.append(row);
  }
}

function renderSidebar(imageId, titleId, detailsId, linesId, totalId, stepId = null) {
  const summary = totals();
  $(imageId).src = state.event.image;
  $(imageId).alt = `${state.event.title} — arte do evento`;
  $(titleId).textContent = state.event.title;
  $(detailsId).textContent = `${state.event.date} · ${state.event.venue}`;
  const lines = $(linesId);
  lines.replaceChildren();
  for (const item of selectedTickets()) {
    const line = document.createElement("div");
    line.className = "sidebar-line";
    const description = document.createElement("span");
    description.textContent = `${item.quantity} × ${item.ticket.title}`;
    const amount = document.createElement("strong");
    amount.textContent = money((Number(item.ticket.priceCents) + Number(item.ticket.feeCents)) * item.quantity);
    line.append(description, amount);
    lines.append(line);
  }
  $(totalId).textContent = money(summary.priceCents + summary.feeCents);
  if (stepId) $(stepId).textContent = `${summary.quantity} ${summary.quantity === 1 ? "ingresso" : "ingressos"}`;
}

function showCheckout() {
  const summary = totals();
  if (!summary.quantity) {
    goTo({ evento: state.event.slug });
    return;
  }
  setView("checkout-view", false);
  document.title = `Finalizar pedido | ${state.event.title}`;
  $("back-to-cart").href = `/ingressos/?evento=${encodeURIComponent(state.event.slug)}&etapa=carrinho`;
  $("form-error").hidden = true;
  $("checkout-notice").hidden = state.checkoutReady;
  $("create-order").disabled = !state.checkoutReady;
  renderSidebar("sidebar-image", "sidebar-title", "sidebar-details", "checkout-lines", "sidebar-total", "sidebar-step");
}

function showPayment(order) {
  state.order = order;
  setView("payment-view", false);
  document.title = `Pagamento Pix | ${order.eventTitle || state.event.title}`;
  const total = Number(order.amountCents || totals().priceCents + totals().feeCents);
  $("payment-total").textContent = money(total);
  $("payment-sidebar-total").textContent = money(total);
  $("pix-code").value = order.pixCode || "";
  $("payment-order-id").textContent = order.orderId || "";
  $("payment-pending").hidden = false;
  $("tickets-panel").hidden = true;
  $("payment-image").src = state.event.image;
  $("payment-image").alt = `${state.event.title} — arte do evento`;
  $("payment-event-title").textContent = state.event.title;
  $("payment-event-details").textContent = `${state.event.date} · ${state.event.venue}`;
  const lines = $("payment-lines");
  lines.replaceChildren();
  for (const item of selectedTickets()) {
    const line = document.createElement("div");
    line.className = "sidebar-line";
    const label = document.createElement("span");
    label.textContent = `${item.quantity} × ${item.ticket.title}`;
    const amount = document.createElement("strong");
    amount.textContent = money((Number(item.ticket.priceCents) + Number(item.ticket.feeCents)) * item.quantity);
    line.append(label, amount);
    lines.append(line);
  }
  if (window.QRCode && typeof window.QRCode.toDataURL === "function" && order.pixCode) {
    window.QRCode.toDataURL(order.pixCode, { width: 260, margin: 1 }, (error, dataUrl) => {
      if (!error && dataUrl) $("pix-qr").src = dataUrl;
    });
  } else {
    $("pix-qr").removeAttribute("src");
  }
}

function showTickets(tickets) {
  $("payment-pending").hidden = true;
  $("tickets-panel").hidden = false;
  const container = $("issued-tickets");
  container.replaceChildren();
  for (const ticket of tickets) {
    const card = document.createElement("article");
    card.className = "issued-ticket";
    const heading = document.createElement("h3");
    heading.textContent = ticket.title;
    const details = document.createElement("p");
    details.textContent = `${ticket.eventTitle} · ${ticket.eventDate}`;
    const code = document.createElement("code");
    code.textContent = ticket.code;
    card.append(heading, details, code);
    container.append(card);
  }
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
      $("payment-status").textContent = result.status === "paid"
        ? "Pagamento confirmado. Emitindo seus ingressos…"
        : "Aguardando confirmação do Pix…";
      if (result.status === "paid" && Array.isArray(result.tickets)) {
        clearInterval(state.pollTimer);
        showTickets(result.tickets);
      } else if (result.status === "paid_unverified") {
        clearInterval(state.pollTimer);
        $("payment-status").textContent = `O PixVault sinalizou o pagamento, mas não foi possível conferir o valor. Nenhum ingresso foi emitido. Informe este pedido ao suporte: ${orderId}.`;
      } else if (["expired", "failed", "cancelled", "gateway_error"].includes(result.status)) {
        clearInterval(state.pollTimer);
        $("payment-status").textContent = "Esta cobrança não foi aprovada. Retorne aos ingressos para tentar novamente.";
      }
    } catch (error) {
      $("payment-status").textContent = error.message || "A consulta falhou; vamos tentar novamente.";
    }
  };
  await check();
  state.pollTimer = setInterval(check, 5000);
}

async function submitOrder(event) {
  event.preventDefault();
  if (!state.checkoutReady) return;
  const form = $("buyer-form");
  if (!form.reportValidity()) return;
  const customer = {
    name: $("buyer-name").value.trim(),
    email: $("buyer-email").value.trim(),
    cpf: digits($("buyer-cpf").value),
    phone: digits($("buyer-phone").value),
  };
  const button = $("create-order");
  button.disabled = true;
  button.textContent = "Criando cobrança Pix…";
  $("form-error").hidden = true;
  try {
    const response = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        eventSlug: state.event.slug,
        items: selectedTickets().map(({ ticketId, quantity }) => ({ ticketId, quantity })),
        customer,
      }),
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || "Não foi possível criar a cobrança Pix.");
    localStorage.setItem(`order-access:${result.orderId}`, result.accessToken);
    localStorage.setItem(`order-event:${result.orderId}`, state.event.slug);
    goTo({ evento: state.event.slug, pedido: result.orderId });
  } catch (error) {
    $("form-error").textContent = error.message || "Falha de comunicação. Tente novamente.";
    $("form-error").hidden = false;
    button.disabled = false;
    button.textContent = "Finalizar pedido";
  }
}

async function restoreOrder(orderId) {
  const accessToken = localStorage.getItem(`order-access:${orderId}`);
  if (!accessToken) {
    showError("Este pedido não está salvo neste dispositivo. Reabra a tela de pagamento no dispositivo usado na compra.");
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
    else if (result.status === "paid_unverified") $("payment-status").textContent = "Pagamento informado pelo PixVault. A conferência do valor está pendente; nenhum ingresso foi emitido.";
    else pollOrder(orderId, accessToken);
  } catch (error) {
    showError(error.message || "Não foi possível recuperar o pedido.");
  }
}

async function checkCheckoutReady() {
  try {
    const response = await fetch("/api/health", { cache: "no-store" });
    const health = await response.json();
    state.checkoutReady = response.ok && health.checkoutReady === true;
  } catch {
    state.checkoutReady = false;
  }
}

async function renderRoute() {
  const url = currentUrl();
  const eventSlug = url.searchParams.get("evento");
  const orderId = url.searchParams.get("pedido");
  const step = url.searchParams.get("etapa");

  if (!eventSlug) {
    clearInterval(state.pollTimer);
    renderEventList();
    return;
  }
  const event = state.catalog.events.find((candidate) => candidate.slug === eventSlug);
  if (!event) {
    showError("Este evento não está disponível.");
    return;
  }
  state.event = event;
  loadCart(event);
  if (orderId) {
    await restoreOrder(orderId);
    return;
  }
  clearInterval(state.pollTimer);
  if (step === "carrinho") renderCart();
  else if (step === "checkout") showCheckout();
  else renderEvent(event);
}

async function init() {
  try {
    const [healthResult, catalogResponse] = await Promise.all([
      checkCheckoutReady(),
      fetch("./eventos.json", { cache: "no-store" }),
    ]);
    if (!catalogResponse.ok) throw new Error("Não foi possível carregar os eventos.");
    state.catalog = await catalogResponse.json();
    await renderRoute();
  } catch (error) {
    showError(error.message || "Não foi possível carregar a página de ingressos.");
  }
}

$("ticket-sections").addEventListener("click", (event) => {
  const button = event.target.closest("button[data-ticket]");
  if (!button || !state.event) return;
  const current = state.quantities.get(button.dataset.ticket) || 0;
  const total = totals().quantity;
  const next = current + Number(button.dataset.step);
  if (next < 0 || next > 5 || (next > current && total >= 10)) return;
  if (next) state.quantities.set(button.dataset.ticket, next);
  else state.quantities.delete(button.dataset.ticket);
  updateTicketSummary();
});

$("event-cards").addEventListener("click", (event) => {
  const card = event.target.closest("a.event-card");
  if (!card) return;
  event.preventDefault();
  const slug = new URL(card.href).searchParams.get("evento");
  goTo({ evento: slug });
});

$("event-search").addEventListener("input", (event) => {
  const query = event.target.value.trim().toLocaleLowerCase("pt-BR");
  let visible = 0;
  for (const card of $("event-cards").children) {
    const matches = card.textContent.toLocaleLowerCase("pt-BR").includes(query);
    card.hidden = !matches;
    if (matches) visible += 1;
  }
  $("empty-search").hidden = visible > 0;
});

$("continue-checkout").addEventListener("click", () => {
  if (state.event && totals().quantity) goTo({ evento: state.event.slug, etapa: "carrinho" });
});
$("cart-items").addEventListener("change", (event) => {
  const select = event.target.closest("select[data-ticket]");
  if (!select || !state.event) return;
  const quantity = Number(select.value);
  if (quantity > 0) state.quantities.set(select.dataset.ticket, quantity);
  else state.quantities.delete(select.dataset.ticket);
  updateTicketSummary();
  renderCart();
});
$("cart-items").addEventListener("click", (event) => {
  const button = event.target.closest("button[data-remove]");
  if (!button || !state.event) return;
  state.quantities.delete(button.dataset.remove);
  updateTicketSummary();
  renderCart();
});
$("back-to-tickets").addEventListener("click", (event) => {
  event.preventDefault();
  if (state.event) goTo({ evento: state.event.slug });
});
$("to-checkout").addEventListener("click", () => {
  if (state.event && totals().quantity) goTo({ evento: state.event.slug, etapa: "checkout" });
});
$("buyer-form").addEventListener("submit", submitOrder);
$("copy-pix").addEventListener("click", async () => {
  const button = $("copy-pix");
  try {
    await navigator.clipboard.writeText($("pix-code").value);
    button.textContent = "Código copiado";
  } catch {
    $("pix-code").select();
    document.execCommand("copy");
    button.textContent = "Código copiado";
  }
  setTimeout(() => { button.textContent = "Copiar código de pagamento"; }, 2500);
});
window.addEventListener("popstate", renderRoute);

init();
