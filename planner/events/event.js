import { firebaseConfig } from "../firebase-config.js";

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
const eventList = document.querySelector("#eventList");
const eventTitle = document.querySelector("#eventTitle");
const eventMeta = document.querySelector("#eventMeta");
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
  const d = new Date(v);
  return Number.isNaN(d.getTime()) ? null : d;
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

function renderEventList(items) {
  eventList.innerHTML = "";
  if (!items.length) {
    eventList.innerHTML = `<div class="muted">No published game days yet.</div>`;
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
    eventList.appendChild(el);
  }
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
        </div>
        <div class="meta">${esc(p.createdByDisplayName || "Someone")}${p.notes ? ` - ${esc(p.notes)}` : ""}</div>
      </div>
    `;
    publicWants.appendChild(el);
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
    eventList.innerHTML = `<div class="muted">That event was not found or is not public.</div>`;
    return;
  }

  const gd = { id: snap.id, ...snap.data() };
  if (gd.status !== "published") {
    eventListView.style.display = "";
    eventDetailView.style.display = "none";
    eventList.innerHTML = `<div class="muted">That event is not public yet.</div>`;
    return;
  }

  eventListView.style.display = "none";
  eventDetailView.style.display = "";
  pageTitle.textContent = gd.title || "DFWGV Game Day";
  eventTitle.textContent = gd.title || "DFWGV Game Day";
  eventMeta.innerHTML = `
    <span class="eventPill">${esc(fmtDate(gd.startsAt))}</span>
    ${gd.location ? `<span class="eventPill">${esc(gd.location)}</span>` : ""}
  `;
  btnOpenPlanner.href = `../?event=${encodeURIComponent(id)}`;
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

const params = new URLSearchParams(window.location.search);
const eventId = params.get("id");
if (eventId) {
  await loadEvent(eventId);
} else {
  await loadList();
}
