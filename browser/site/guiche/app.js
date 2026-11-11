const pageState = document.querySelector("#page-state");
const eventContent = document.querySelector("#event-content");

function setText(selector, value) {
  document.querySelector(selector).textContent = value || "";
}

function showError(message) {
  pageState.textContent = message;
  pageState.classList.add("page-state-error");
}

function renderEvent(event) {
  document.title = `${event.title} | Green Valley`;
  document.querySelector('meta[name="description"]').content = event.description || `Informações e ingressos para ${event.title}.`;
  setText("#event-title", event.title);
  setText("#event-date", event.dateLabel);
  document.querySelector("#event-date").dateTime = event.dateTime || "";
  setText("#event-time", event.timeLabel);
  setText("#event-venue", event.venue);
  setText("#event-city", event.city);
  setText("#event-description", event.description);
  setText("#event-address", event.address);

  const image = document.querySelector("#event-image");
  const artWrap = document.querySelector("#event-art-wrap");
  if (event.image && event.image.startsWith("/imagens/")) {
    image.src = event.image;
    image.alt = event.imageAlt || `Arte do evento ${event.title}`;
    image.addEventListener("error", () => artWrap.remove(), { once: true });
  } else {
    artWrap.remove();
  }

  const ageFact = document.querySelector("#age-fact");
  if (event.ageRestriction) {
    setText("#event-age", event.ageRestriction);
    ageFact.hidden = false;
  }

  const checkoutLink = document.querySelector("#checkout-link");
  checkoutLink.href = `/ingressos/?evento=${encodeURIComponent(event.checkoutSlug || event.slug)}`;
  document.querySelector("#checkout-note").textContent = "Escolha os ingressos e conclua a compra nesta página.";

  pageState.hidden = true;
  eventContent.hidden = false;
}

async function loadEvent() {
  try {
    const response = await fetch("./eventos.json", { cache: "no-store" });
    if (!response.ok) throw new Error("Não foi possível carregar a lista de eventos.");
    const data = await response.json();
    const slug = new URLSearchParams(window.location.search).get("evento") || data.defaultEvent;
    const event = data.events.find((item) => item.slug === slug);
    if (!event) {
      showError("Não encontramos esse evento. Confira o link ou volte ao site Green Valley.");
      return;
    }
    renderEvent(event);
  } catch {
    showError("Não conseguimos carregar as informações agora. Atualize a página ou volte ao site Green Valley.");
  }
}

loadEvent();
