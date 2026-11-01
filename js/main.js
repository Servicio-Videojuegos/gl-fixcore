/* =====================================================
   CONFIGURACIÓN RÁPIDA
   Cambia aquí tu número de WhatsApp (código de país + número,
   sin "+" ni espacios). Ejemplo Perú: 51987654321
   ===================================================== */
const CONFIG = {
  whatsapp: "51906708261",
  message: "Hola GL FIXCORE, quisiera cotizar un servicio para mi consola."
};

/* ---------- Utilidades ---------- */
const $  = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

// Quita tildes y pasa a minúsculas para que "pokemon" encuentre "Pokémon"
const normalize = (text) =>
  text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();

/* ---------- Enlaces de WhatsApp ----------
   Cualquier <a data-whatsapp> usa el número de CONFIG.
   Si el atributo trae texto, se usa como mensaje:
   <a data-whatsapp="Hola, busco un juego">                 */
$$("[data-whatsapp]").forEach((link) => {
  const custom = link.dataset.whatsapp;
  const text = encodeURIComponent(custom || CONFIG.message);
  link.href = `https://wa.me/${CONFIG.whatsapp}?text=${text}`;
  link.target = "_blank";
  link.rel = "noopener";
});

/* ---------- Imágenes opcionales (data-img) ----------
   Si el archivo existe, se usa como fondo; si no, se queda
   el diseño por defecto. Así nada se ve roto.            */
function loadBackground(el, urls = [el.dataset.img]) {
  const [url, ...rest] = urls.filter(Boolean);
  if (!url) return;
  const img = new Image();
  img.onload = () => {
    el.style.backgroundImage = `url("${url}")`;
    el.classList.add("has-img");
  };
  img.onerror = () => loadBackground(el, rest); // prueba la siguiente opción
  img.src = url;
}
$$("[data-img]").forEach((el) => loadBackground(el));

/* ---------- Menú móvil ---------- */
const burger = $("#burger");
const nav = $("#nav");

function setMenu(open) {
  nav.classList.toggle("open", open);
  burger.classList.toggle("open", open);
  burger.setAttribute("aria-expanded", String(open));
  burger.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
}
burger.addEventListener("click", () => setMenu(!nav.classList.contains("open")));
$$("a", nav).forEach((a) => a.addEventListener("click", () => setMenu(false)));
document.addEventListener("keydown", (e) => { if (e.key === "Escape") setMenu(false); });

/* ---------- Cabecera con fondo al hacer scroll ---------- */
const header = $("#header");
const onScroll = () => header.classList.toggle("scrolled", window.scrollY > 24);
window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

/* ---------- Enlace activo según la sección visible ---------- */
const navLinks = $$("a", nav);
const sections = navLinks
  .map((a) => $(a.getAttribute("href")))
  .filter(Boolean);

if ("IntersectionObserver" in window) {
  const spy = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      navLinks.forEach((a) =>
        a.classList.toggle("active", a.getAttribute("href") === `#${entry.target.id}`)
      );
    });
  }, { rootMargin: "-45% 0px -50% 0px" });
  sections.forEach((s) => spy.observe(s));
}

/* =====================================================
   CATÁLOGO DE JUEGOS (datos en js/games.js)
   ===================================================== */
const grid = $("#gamesGrid");
const chipsBox = $("#genreChips");
const searchInput = $("#gameSearch");
const countEl = $("#gameCount");
const emptyEl = $("#gamesEmpty");

/* Convierte las líneas de CATALOG ("Nombre | Plataformas | imagen")
   en objetos de juego. */
const slugify = (text) => normalize(text).replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

const GAMES = Object.entries(CATALOG).flatMap(([genre, lines]) =>
  lines.map((line) => {
    const [title, platforms = "", image = ""] = line.split("|").map((p) => p.trim());
    const folder = "images/games/";
    const slug = slugify(title);
    return {
      title,
      genre,
      platforms: platforms.split(",").map((p) => p.trim()).filter(Boolean),
      // Imagen indicada, o búsqueda automática por nombre del juego
      images: image
        ? [image.includes("/") ? image : folder + image]
        : ["jpg", "webp", "png", "jpeg"].map((ext) => `${folder}${slug}.${ext}`)
    };
  })
);

/* Juegos por página: 24 en PC y tablet, 12 en móvil (hasta 720px) */
const PAGE_SIZE = { desktop: 24, mobile: 12 };
const mobileQuery = window.matchMedia("(max-width: 720px)");
const pageSize = () => (mobileQuery.matches ? PAGE_SIZE.mobile : PAGE_SIZE.desktop);

const state = { genre: "todos", query: "", page: 1 };
const genreLabel = Object.fromEntries(GENRES.map((g) => [g.id, g.label]));

// Botones de género
GENRES.forEach((g) => {
  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = "chip" + (g.id === state.genre ? " active" : "");
  btn.textContent = g.label;
  btn.dataset.genre = g.id;
  btn.setAttribute("aria-pressed", String(g.id === state.genre));
  chipsBox.appendChild(btn);
});

chipsBox.addEventListener("click", (e) => {
  const btn = e.target.closest(".chip");
  if (!btn) return;
  state.genre = btn.dataset.genre;
  state.page = 1;
  $$(".chip", chipsBox).forEach((c) => {
    const on = c === btn;
    c.classList.toggle("active", on);
    c.setAttribute("aria-pressed", String(on));
  });
  renderGames();
});

searchInput.addEventListener("input", () => {
  state.query = normalize(searchInput.value);
  state.page = 1;
  renderGames();
});

// Crea la tarjeta de un juego
function createCard(game) {
  const card = document.createElement("article");
  card.className = "game";
  card.dataset.genre = game.genre;

  const cover = document.createElement("div");
  cover.className = "game__cover";

  const placeholder = document.createElement("span");
  placeholder.className = "game__ph";
  placeholder.textContent = game.title;
  cover.appendChild(placeholder);

  const info = document.createElement("div");
  info.className = "game__info";

  const title = document.createElement("h3");
  title.textContent = game.title;

  const meta = document.createElement("p");
  meta.textContent = [genreLabel[game.genre], (game.platforms || []).join(", ")]
    .filter(Boolean)
    .join(" · ");

  info.append(title, meta);
  card.append(cover, info);

  loadBackground(cover, game.images);
  return card;
}

const pagerEl = $("#pagination");
const gamesSection = $("#juegos");

function renderGames() {
  const list = GAMES.filter((g) =>
    (state.genre === "todos" || g.genre === state.genre) &&
    normalize(g.title).includes(state.query)
  );

  const size = pageSize();
  const totalPages = Math.max(1, Math.ceil(list.length / size));
  state.page = Math.min(Math.max(state.page, 1), totalPages);

  const start = (state.page - 1) * size;
  const visible = list.slice(start, start + size);

  grid.replaceChildren(...visible.map(createCard));
  emptyEl.hidden = list.length > 0;

  if (list.length === 0) {
    countEl.textContent = "0 juegos";
  } else if (totalPages === 1) {
    countEl.textContent = list.length === 1 ? "1 juego" : `${list.length} juegos`;
  } else {
    countEl.textContent = `Mostrando ${start + 1}-${start + visible.length} de ${list.length} juegos`;
  }

  renderPagination(totalPages);
}

/* Lista de páginas a mostrar: 1 ... 4 5 6 ... 10 */
function pageItems(current, total) {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const items = [1];
  const from = Math.max(2, current - 1);
  const to = Math.min(total - 1, current + 1);
  if (from > 2) items.push("…");
  for (let i = from; i <= to; i++) items.push(i);
  if (to < total - 1) items.push("…");
  items.push(total);
  return items;
}

function renderPagination(totalPages) {
  pagerEl.hidden = totalPages <= 1;
  if (totalPages <= 1) { pagerEl.replaceChildren(); return; }

  const makeBtn = (label, page, { disabled = false, current = false, aria } = {}) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "page-btn" + (current ? " active" : "");
    b.textContent = label;
    b.disabled = disabled;
    if (aria) b.setAttribute("aria-label", aria);
    if (current) b.setAttribute("aria-current", "page");
    b.dataset.page = page;
    return b;
  };

  const nodes = [makeBtn("‹", state.page - 1, { disabled: state.page === 1, aria: "Página anterior" })];

  pageItems(state.page, totalPages).forEach((item) => {
    if (item === "…") {
      const dots = document.createElement("span");
      dots.className = "page-dots";
      dots.textContent = "…";
      nodes.push(dots);
    } else {
      nodes.push(makeBtn(item, item, { current: item === state.page, aria: `Página ${item}` }));
    }
  });

  nodes.push(makeBtn("›", state.page + 1, { disabled: state.page === totalPages, aria: "Página siguiente" }));
  pagerEl.replaceChildren(...nodes);
}

pagerEl.addEventListener("click", (e) => {
  const btn = e.target.closest(".page-btn");
  if (!btn || btn.disabled) return;
  state.page = Number(btn.dataset.page);
  renderGames();
  // Vuelve al inicio del catálogo para ver los juegos nuevos
  const top = gamesSection.getBoundingClientRect().top + window.scrollY;
  window.scrollTo({ top, behavior: "smooth" });
});

// Si cambia el tamaño de pantalla (móvil <-> PC), se recalcula la paginación
mobileQuery.addEventListener("change", () => { state.page = 1; renderGames(); });

renderGames();

/* ---------- Año del pie de página ---------- */
$("#year").textContent = new Date().getFullYear();
