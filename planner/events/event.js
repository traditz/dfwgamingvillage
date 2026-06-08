import { firebaseConfig } from "../firebase-config.js";
import * as appConfig from "../app-config.js";

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import {
  getFirestore,
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  where
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const pageTitle = document.querySelector("#pageTitle");
const eventListView = document.querySelector("#eventListView");
const eventDetailView = document.querySelector("#eventDetailView");
const upcomingEvents = document.querySelector("#upcomingEvents");
const pastEvents = document.querySelector("#pastEvents");
const btnPastEventsToggle = document.querySelector("#btnPastEventsToggle");
const pastEventsPanel = document.querySelector("#pastEventsPanel");
const eventTitle = document.querySelector("#eventTitle");
const eventMeta = document.querySelector("#eventMeta");
const historyNotice = document.querySelector("#historyNotice");
const publicTables = document.querySelector("#publicTables");
const publicWants = document.querySelector("#publicWants");
const btnShare = document.querySelector("#btnShare");
const btnOpenPlanner = document.querySelector("#btnOpenPlanner");
const btnCalendar = document.querySelector("#btnCalendar");
const filters = document.querySelector("#filters");

let activeFilter = "all";
let tables = [];
let unsubTables = null;
let unsubPosts = null;
const bggMetaCache = new Map();

function esc(s) {
  return String(s ?? "").replace(/[&<>"']/g, (m) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  }[m]));
}

function asDate(v) {
  if (!v) return null;
  if (v.toDate) return v.toDate();
  if (typeof v.seconds === "number") {
    return new Date((v.seconds * 1000) + Math.floor((v.nanoseconds || 0) / 1000000));
  }
  if (typeof v._seconds === "number") {
    return new Date((v._seconds * 1000) + Math.floor((v._nanoseconds || 0) / 1000000));
  }
  const d = new Date(v);
  return Number.isNaN(d.getTime()) ? null : d;
}

function normalizeBggThingPayload(payload) {
  if (!payload || typeof payload !== "object") return {};
  const thing = payload.thing && typeof payload.thing === "object" ? payload.thing : payload;
  return {
    ...thing,
    expansions: thing.expansions || payload.expansions || []
  };
}

async function bggThing(id) {
  const url = `${appConfig.BGG_THING_URL}?id=${encodeURIComponent(id)}`;
  const r = await fetch(url);
  const j = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(`BGG thing failed: ${JSON.stringify(j)}`);
  return j;
}

function gameYear(item) {
  const year = Number(item?.bggYear ?? item?.year ?? 0);
  return Number.isFinite(year) && year > 0 ? String(year) : "";
}

function gameRating(item) {
  const rating = Number(item?.bggRating ?? item?.rating ?? 0);
  return Number.isFinite(rating) && rating > 0 ? rating.toFixed(1) : "";
}

function gameMetaText(item) {
  const parts = [];
  const year = gameYear(item);
  const rating = gameRating(item);
  if (year) parts.push(`Year: ${year}`);
  if (rating) parts.push(`BGG: ${rating}`);
  return parts.join(" • ");
}

async function fetchBggMeta(bggId) {
  const key = String(bggId || "").trim();
  if (!key) return {};
  if (!bggMetaCache.has(key)) {
    bggMetaCache.set(key, bggThing(key).then((payload) => {
      const thing = normalizeBggThingPayload(payload);
      return {
        bggYear: thing.year || thing.bggYear || null,
        bggRating: thing.bggRating || thing.rating || null
      };
    }).catch(() => ({})));
  }
  return bggMetaCache.get(key);
}

async function hydrateGameMeta(root, item) {
  const host = root?.querySelector?.("[data-game-meta]");
  if (!host || !item?.bggId || gameMetaText(item)) return;
  const meta = await fetchBggMeta(item.bggId);
  const text = gameMetaText(meta);
  if (text) {
    host.textContent = text;
    host.style.display = "";
  }
}

function fmtDate(v) {
  const d = asDate(v);
  if (!d) return "Date TBD";
  return d.toLocaleString("en-US", {
    timeZone: "America/Chicago",
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit"
  });
}

function calendarUrl(gd) {
  const d = asDate(gd.startsAt);
  if (!d) return "#";
  const end = new Date(d.getTime() + 4 * 60 * 60 * 1000);
  const stamp = (x) => x.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: gd.title || "DFWGV Game Day",
    dates: `${stamp(d)}/${stamp(end)}`,
    location: gd.location || "",
    details: window.location.href
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

function eventUrl(id) {
  return `./?id=${encodeURIComponent(id)}`;
}

function isPastEvent(gd) {
  const d = asDate(gd.startsAt);
  if (!d) return false;
  return centralDateKey(d) < centralDateKey(new Date());
}

function centralDateKey(date) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Chicago",
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).formatToParts(date);
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return `${values.year}-${values.month}-${values.day}`;
}

function renderEventCollection(host, items, emptyText) {
  host.innerHTML = "";
  if (!items.length) {
    host.innerHTML = `<div class="muted">${esc(emptyText)}</div>`;
    return;
  }

  for (const gd of items) {
    const el = document.createElement("article");
    el.className = "eventTile";
    el.innerHTML = `
      <div>
        <div class="eventTileTitle">${esc(gd.title || "DFWGV Game Day")}</div>
        <div class="publicTableMeta">${esc(fmtDate(gd.startsAt))}</div>
        ${gd.location ? `<div class="publicTableMeta">${esc(gd.location)}</div>` : ""}
      </div>
      <a class="btn btn-primary" href="${eventUrl(gd.id)}">View Event</a>
    `;
    host.appendChild(el);
  }
}

function renderEventList(items) {
  const upcoming = [];
  const past = [];
  for (const gd of items) {
    if (isPastEvent(gd)) past.push(gd);
    else upcoming.push(gd);
  }

  upcoming.sort((a, b) => (asDate(a.startsAt)?.getTime() || 0) - (asDate(b.startsAt)?.getTime() || 0));
  past.sort((a, b) => (asDate(b.startsAt)?.getTime() || 0) - (asDate(a.startsAt)?.getTime() || 0));

  renderEventCollection(upcomingEvents, upcoming, "No upcoming public events.");
  renderEventCollection(pastEvents, past, "No past public events yet.");
  if (btnPastEventsToggle) {
    btnPastEventsToggle.disabled = past.length === 0;
    btnPastEventsToggle.setAttribute("aria-label", past.length
      ? `View ${past.length} past event${past.length === 1 ? "" : "s"}`
      : "No past events yet");
  }
  if (pastEventsPanel) {
    pastEventsPanel.hidden = true;
  }
  btnPastEventsToggle?.setAttribute("aria-expanded", "false");
}

function renderTables() {
  publicTables.innerHTML = "";
  const visible = tables.filter((t) => {
    const cap = Number(t.capacity || 0);
    const confirmed = Number(t.confirmedCount || 0);
    const wait = Number(t.waitlistCount || 0);
    if (activeFilter === "open") return cap > confirmed;
    if (activeFilter === "waitlist") return wait > 0;
    return true;
  });

  if (!visible.length) {
    publicTables.innerHTML = `<div class="muted">No tables match this view.</div>`;
    return;
  }

  for (const t of visible) {
    const cap = Number(t.capacity || 0);
    const confirmed = Number(t.confirmedCount || 0);
    const wait = Number(t.waitlistCount || 0);
    const openSeats = Math.max(0, cap - confirmed);
    const bggUrl = t.bggId ? `https://boardgamegeek.com/boardgame/${encodeURIComponent(t.bggId)}` : "";

    const el = document.createElement("article");
    el.className = "publicTable";
    el.innerHTML = `
      <div class="publicThumb">
        ${t.thumbUrl ? `<img src="${esc(t.thumbUrl)}" alt="" loading="lazy" />` : `<div class="thumbph">Game</div>`}
      </div>
      <div>
        <div class="publicTableTitle">
          ${bggUrl ? `<a href="${esc(bggUrl)}" target="_blank" rel="noopener">${esc(t.gameName || "Game")}</a>` : esc(t.gameName || "Game")}
          <div class="gameMeta" data-game-meta ${gameMetaText(t) ? "" : "style=\"display:none;\""}>${esc(gameMetaText(t))}</div>
        </div>
        <div class="seatBadge ${openSeats ? "is-open" : ""}">
          ${openSeats ? `${openSeats} open seat${openSeats === 1 ? "" : "s"}` : `Waitlist ${wait}`}
        </div>
        <div class="publicTableMeta">Host: ${esc(t.hostDisplayName || "Unknown")}</div>
        <div class="publicTableMeta">Starts: ${esc(fmtDate(t.startTime))}</div>
        ${t.notes ? `<div class="publicTableMeta">${esc(t.notes)}</div>` : ""}
      </div>
    `;
    publicTables.appendChild(el);
    hydrateGameMeta(el, t);
  }
}

function renderWants(posts) {
  publicWants.innerHTML = "";
  const wants = posts.filter((p) => p.kind === "want_to_play");
  if (!wants.length) {
    publicWants.innerHTML = `<div class="muted">No want-to-play posts yet.</div>`;
    return;
  }

  for (const p of wants) {
    const bggUrl = p.bggId ? `https://boardgamegeek.com/boardgame/${encodeURIComponent(p.bggId)}` : "";
    const el = document.createElement("div");
    el.className = "listitem";
    el.innerHTML = `
      <div>
        <div class="title">
          ${bggUrl ? `<a href="${esc(bggUrl)}" target="_blank" rel="noopener">${esc(p.gameName || "Game")}</a>` : esc(p.gameName || "Game")}
          <div class="gameMeta" data-game-meta ${gameMetaText(p) ? "" : "style=\"display:none;\""}>${esc(gameMetaText(p))}</div>
        </div>
        <div class="meta">${esc(p.createdByDisplayName || "Someone")}${p.notes ? ` - ${esc(p.notes)}` : ""}</div>
      </div>
    `;
    publicWants.appendChild(el);
    hydrateGameMeta(el, p);
  }
}

async function loadList() {
  eventListView.style.display = "";
  eventDetailView.style.display = "none";
  const q = query(collection(db, "gamedays"), where("status", "==", "published"), orderBy("startsAt", "asc"));
  const snap = await getDocs(q);
  renderEventList(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
}

async function loadEvent(id) {
  const snap = await getDoc(doc(db, "gamedays", id));
  if (!snap.exists()) {
    eventListView.style.display = "";
    eventDetailView.style.display = "none";
    upcomingEvents.innerHTML = `<div class="muted">That event was not found or is not public.</div>`;
    pastEvents.innerHTML = "";
    return;
  }

  const gd = { id: snap.id, ...snap.data() };
  if (gd.status !== "published") {
    eventListView.style.display = "";
    eventDetailView.style.display = "none";
    upcomingEvents.innerHTML = `<div class="muted">That event is not public yet.</div>`;
    pastEvents.innerHTML = "";
    return;
  }

  eventListView.style.display = "none";
  eventDetailView.style.display = "";
  pageTitle.textContent = gd.title || "DFWGV Game Day";
  eventTitle.textContent = gd.title || "DFWGV Game Day";
  const isPast = isPastEvent(gd);
  eventMeta.innerHTML = `
    ${isPast ? `<span class="eventPill is-history">Past Event</span>` : ""}
    <span class="eventPill">${esc(fmtDate(gd.startsAt))}</span>
    ${gd.location ? `<span class="eventPill">${esc(gd.location)}</span>` : ""}
  `;
  if (historyNotice) {
    historyNotice.style.display = isPast ? "" : "none";
  }
  btnOpenPlanner.href = `../?event=${encodeURIComponent(id)}`;
  btnOpenPlanner.textContent = isPast ? "View in Planner" : "Host or Join";
  btnOpenPlanner.classList.toggle("btn-primary", !isPast);
  btnCalendar.href = calendarUrl(gd);

  if (unsubTables) unsubTables();
  if (unsubPosts) unsubPosts();

  const tablesQ = query(collection(db, "gamedays", id, "tables"), orderBy("startTime", "asc"));
  unsubTables = onSnapshot(tablesQ, (tableSnap) => {
    tables = tableSnap.docs.map((d) => ({ id: d.id, ...d.data() }));
    renderTables();
  });

  const postsQ = query(collection(db, "gamedays", id, "posts"), orderBy("createdAt", "desc"));
  unsubPosts = onSnapshot(postsQ, (postSnap) => {
    renderWants(postSnap.docs.map((d) => ({ id: d.id, ...d.data() })));
  });
}

filters?.addEventListener("click", (ev) => {
  const btn = ev.target.closest("[data-filter]");
  if (!btn) return;
  activeFilter = btn.getAttribute("data-filter");
  filters.querySelectorAll("[data-filter]").forEach((el) => el.classList.toggle("is-active", el === btn));
  renderTables();
});

btnShare?.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(window.location.href);
    btnShare.textContent = "Copied";
    setTimeout(() => { btnShare.textContent = "Share"; }, 1400);
  } catch {
    window.prompt("Copy event link:", window.location.href);
  }
});

btnPastEventsToggle?.addEventListener("click", () => {
  if (!pastEventsPanel) return;
  const shouldShow = pastEventsPanel.hidden;
  pastEventsPanel.hidden = !shouldShow;
  btnPastEventsToggle.setAttribute("aria-expanded", String(shouldShow));
});

const params = new URLSearchParams(window.location.search);
const eventId = params.get("id");
if (eventId) {
  await loadEvent(eventId);
} else {
  await loadList();
}
