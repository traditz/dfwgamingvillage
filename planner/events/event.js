import { firebaseConfig } from "../firebase-config.js";
import * as appConfig from "../app-config.js";

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";
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
import { getFunctions, httpsCallable } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-functions.js";

import { esc, asDate, fmtDate, fmtTime, fmtEventWhen, fmtDayLabel, eventDayKeys, centralDateKey, toast } from "../shared.js?v=20260817-p33";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const functions = getFunctions(app, appConfig.FUNCTIONS_REGION);
const fnGetMyPlannerRole = httpsCallable(functions, "getMyPlannerRole");

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
const adminLinks = document.querySelectorAll("[data-admin-link]");

let activeFilter = "all";
let currentGd = null;
let tables = [];
let unsubTables = null;
let unsubPosts = null;
const bggMetaCache = new Map();

function isOwnerFallback(user) {
  if (!user) return false;
  const owner = appConfig.OWNER_UID;
  if (!owner) return false;
  return user.uid === owner || user.uid === `discord:${owner}`;
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

function renderEventCollection(host, items, emptyText) {
  host.innerHTML = "";
  if (!items.length) {
    host.innerHTML = `<div class="muted">${esc(emptyText)}</div>`;
    return;
  }

  for (const gd of items) {
    const isPast = isPastEvent(gd);
    // The inner "Open Event" link is the single accessible action — the card
    // itself is a mouse convenience, not a second tab stop.
    const el = document.createElement("article");
    el.className = "eventTile eventCard";
    el.innerHTML = `
      <div class="eventCardMain">
        <div class="eventCardKicker">${isPast ? "Past Event" : "Upcoming Event"}</div>
        <div class="eventTileTitle eventCardTitle">${esc(gd.title || "DFWGV Game Day")}</div>
        <div class="eventCardMeta">${esc(fmtEventWhen(gd.startsAt, gd.endsAt))}</div>
        ${gd.location ? `<div class="eventCardMeta">${esc(gd.location)}</div>` : ""}
      </div>
      <div class="eventCardFooter">
        ${isPast ? `<span class="eventCardStatus">History</span>` : `<span class="eventCardStatus is-live">Open</span>`}
        <a class="btn btn-primary eventCardAction" href="${eventUrl(gd.id)}">${isPast ? "Open History" : "Open Event"}</a>
      </div>
    `;
    el.addEventListener("click", (ev) => {
      if (ev.target.closest("a, button")) return;
      window.location.href = eventUrl(gd.id);
    });
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
      ? `Past Events — ${past.length} available`
      : "Past Events — none yet");
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

  // Multi-day events (conventions) group their tables under a header per day,
  // with finished days pushed to the bottom and marked Past.
  const days = currentGd ? eventDayKeys(currentGd.startsAt, currentGd.endsAt) : [];
  const showDayHeaders = days.length > 1;
  let lastDayKey = null;

  let ordered = visible;
  const todayKey = centralDateKey(new Date());
  if (showDayHeaders) {
    const dayOf = (t) => {
      const st = asDate(t.startTime);
      return st ? centralDateKey(st) : "";
    };
    ordered = [
      ...visible.filter((t) => !dayOf(t) || dayOf(t) >= todayKey),
      ...visible.filter((t) => dayOf(t) && dayOf(t) < todayKey)
    ];
  }

  for (const t of ordered) {
    if (showDayHeaders) {
      const st = asDate(t.startTime);
      const dayKey = st ? centralDateKey(st) : "";
      if (dayKey && dayKey !== lastDayKey) {
        lastDayKey = dayKey;
        const dayNum = days.indexOf(dayKey);
        const isFinished = dayKey < todayKey;
        const header = document.createElement("div");
        header.className = `dayHeader${isFinished ? " is-past" : ""}`;
        header.innerHTML = `
          <span class="dayHeaderLabel">${esc(fmtDayLabel(dayKey))}</span>
          ${dayNum >= 0 ? `<span class="dayHeaderBadge">Day ${dayNum + 1}</span>` : ""}
          ${isFinished ? `<span class="dayHeaderState is-past">Past</span>` : ""}
          ${dayKey === todayKey ? `<span class="dayHeaderState is-today">Today</span>` : ""}
        `;
        publicTables.appendChild(header);
      }
    }
    const cap = Number(t.capacity || 0);
    const confirmed = Number(t.confirmedCount || 0);
    const wait = Number(t.waitlistCount || 0);
    const openSeats = Math.max(0, cap - confirmed);
    const bggUrl = t.bggId ? `https://boardgamegeek.com/boardgame/${encodeURIComponent(t.bggId)}` : "";
    // Custom sign-up sheets (food run, setup crew) have no box art to show.
    const isCustomEntry = t.isCustom === true || !t.bggId;

    const stDay = asDate(t.startTime) ? centralDateKey(asDate(t.startTime)) : "";
    const isPastTable = showDayHeaders && stDay && stDay < todayKey;
    const isStarted = showDayHeaders && stDay === todayKey
      && asDate(t.startTime) && asDate(t.startTime).getTime() < Date.now();

    const el = document.createElement("article");
    el.className = `publicTable${isPastTable ? " is-pastTable" : ""}`;
    el.innerHTML = `
      <div class="publicThumb">
        ${t.thumbUrl
          ? `<img src="${esc(t.thumbUrl)}" alt="" loading="lazy" />`
          : (isCustomEntry
              ? `<img src="../signup-sheet.png" alt="" loading="lazy" />`
              : `<div class="thumbph">Game</div>`)}
      </div>
      <div>
        <div class="publicTableTitle">
          ${isPastTable ? `<span class="timePill is-past">Past</span> ` : ""}${isStarted ? `<span class="timePill is-started">Started</span> ` : ""}${bggUrl ? `<a href="${esc(bggUrl)}" target="_blank" rel="noopener">${esc(t.gameName || "Game")}</a>` : esc(t.gameName || "Game")}
          <div class="gameMeta" data-game-meta ${gameMetaText(t) ? "" : "style=\"display:none;\""}>${esc(gameMetaText(t))}</div>
        </div>
        <div class="seatBadge ${openSeats ? "is-open" : ""}">
          ${openSeats
            ? `${openSeats} open ${isCustomEntry ? "spot" : "seat"}${openSeats === 1 ? "" : "s"}`
            : `Waitlist ${wait}`}
        </div>
        <div class="publicTableMeta">Host: ${esc(t.hostDisplayName || "Unknown")}</div>
        ${t.gameSource === "library" ? `<div class="publicTableMeta">📚 Library copy</div>` : ""}
        <div class="publicTableMeta">Starts: ${esc(showDayHeaders ? fmtTime(t.startTime) : fmtDate(t.startTime))}</div>
        ${t.notes ? `<div class="publicTableMeta">${esc(t.notes)}</div>` : ""}
      </div>
    `;
    publicTables.appendChild(el);
    hydrateGameMeta(el, t);
  }
}

function wantPostHtml(p, bggUrl) {
  return `
    <div class="wantGame">
      <div class="title">
        ${bggUrl ? `<a href="${esc(bggUrl)}" target="_blank" rel="noopener">${esc(p.gameName || "Game")}</a>` : esc(p.gameName || "Game")}
        <div class="gameMeta" data-game-meta ${gameMetaText(p) ? "" : "style=\"display:none;\""}>${esc(gameMetaText(p))}</div>
      </div>
    </div>
    <div class="wantDetails">
      <div class="wantBy"><span>Requested by</span> ${esc(p.createdByDisplayName || "Someone")}</div>
      ${Number(p.interestedCount || 0) > 0 ? `<div class="wantInterest">🙋 <b>${Number(p.interestedCount)}</b> would play</div>` : ""}
      ${p.notes ? `<div class="wantNote"><span>Note</span> <div class="wantNoteText">${esc(p.notes)}</div></div>` : ""}
    </div>
  `;
}

function renderWants(posts) {
  publicWants.innerHTML = "";
  const wants = posts.filter((p) => p.kind === "want_to_play");
  if (!wants.length) {
    publicWants.innerHTML = `<div class="muted">No game requests yet.</div>`;
    return;
  }

  for (const p of wants) {
    const bggUrl = p.bggId ? `https://boardgamegeek.com/boardgame/${encodeURIComponent(p.bggId)}` : "";
    const el = document.createElement("div");
    el.className = "listitem wantItem";
    el.innerHTML = wantPostHtml(p, bggUrl);
    publicWants.appendChild(el);
    hydrateGameMeta(el, p);
  }
}

let unsubList = null;
let unsubEventDoc = null;

function stopDetailListeners() {
  if (unsubTables) { unsubTables(); unsubTables = null; }
  if (unsubPosts) { unsubPosts(); unsubPosts = null; }
  if (unsubEventDoc) { unsubEventDoc(); unsubEventDoc = null; }
}

function loadList() {
  stopDetailListeners();
  eventListView.style.display = "";
  eventDetailView.style.display = "none";
  const header = document.querySelector(".publicPageHeader");
  if (header) header.style.display = "";
  pageTitle.textContent = "DFWGV Events";
  document.title = "DFWGV Events";
  const q = query(
    collection(db, "gamedays"),
    where("visibility", "==", "public"),
    where("status", "==", "published"),
    orderBy("startsAt", "asc")
  );
  if (unsubList) unsubList();
  unsubList = onSnapshot(q, (snap) => {
    renderEventList(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
  }, () => {
    upcomingEvents.innerHTML = `
      <div class="muted">Couldn't load events — check your connection.</div>
      <button class="btn" id="btnRetryLoad" style="margin-top:10px;">Retry</button>
    `;
    pastEvents.innerHTML = "";
    document.querySelector("#btnRetryLoad")?.addEventListener("click", () => location.reload());
  });
}

function renderDetailHeader(gd) {
  eventTitle.textContent = gd.title || "DFWGV Game Day";
  document.title = `${gd.title || "DFWGV Game Day"} — DFWGV Events`;
  const isPast = isPastEvent(gd);
  eventMeta.innerHTML = `
    ${isPast ? `<span class="eventPill is-history">Past Event</span>` : ""}
    <span class="eventPill">${esc(fmtEventWhen(gd.startsAt, gd.endsAt))}</span>
    ${gd.location ? `<span class="eventPill">${esc(gd.location)}</span>` : ""}
  `;
  if (historyNotice) historyNotice.style.display = isPast ? "" : "none";
  btnOpenPlanner.href = `../?event=${encodeURIComponent(gd.id)}`;
  btnOpenPlanner.textContent = isPast ? "View in Planner" : "Host or Join";
  btnOpenPlanner.classList.toggle("btn-primary", !isPast);
  btnCalendar.href = calendarUrl(gd);
}

function showUnavailable(msg) {
  toast(msg, "info", 6000);
  history.replaceState({}, "", "./");
  loadList();
}

async function loadEvent(id) {
  let snap;
  try {
    snap = await getDoc(doc(db, "gamedays", id));
  } catch {
    // Permission denied — a private event this visitor can't read.
    return showUnavailable("That event is private. Ask the organizer for an invite link. Here's what's public:");
  }
  if (!snap.exists()) return showUnavailable("That event link isn't available — it may have been removed. Here's what's on:");

  const gd = { id: snap.id, ...snap.data() };
  if (gd.status !== "published") return showUnavailable("That event isn't public yet. Here's what's on:");

  eventListView.style.display = "none";
  eventDetailView.style.display = "";
  // The generic "Event" header block is redundant on the detail view — the
  // card right below carries the real title.
  const header = document.querySelector(".publicPageHeader");
  if (header) header.style.display = "none";
  pageTitle.textContent = "";
  currentGd = gd;
  renderDetailHeader(gd);

  stopDetailListeners();

  // Keep the header live; bounce to the list if the event stops being public.
  unsubEventDoc = onSnapshot(doc(db, "gamedays", id), (s) => {
    if (!s.exists() || (s.data() || {}).status !== "published") {
      stopDetailListeners();
      showUnavailable("This event is no longer public.");
      return;
    }
    currentGd = { id: s.id, ...s.data() };
    renderDetailHeader(currentGd);
  });

  const tablesQ = query(collection(db, "gamedays", id, "tables"), orderBy("startTime", "asc"));
  unsubTables = onSnapshot(tablesQ, (tableSnap) => {
    tables = tableSnap.docs.map((d) => ({ id: d.id, ...d.data() }));
    renderTables();
  }, () => {
    publicTables.innerHTML = `<div class="muted">Couldn't load tables — check your connection.</div>`;
  });

  const postsQ = query(collection(db, "gamedays", id, "posts"), orderBy("createdAt", "desc"));
  unsubPosts = onSnapshot(postsQ, (postSnap) => {
    renderWants(postSnap.docs.map((d) => ({ id: d.id, ...d.data() })));
  }, () => {
    publicWants.innerHTML = `<div class="muted">Couldn't load requests — check your connection.</div>`;
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
    toast("Couldn't copy automatically — copy this page's address from the address bar.", "info", 6000);
  }
});

btnPastEventsToggle?.addEventListener("click", () => {
  if (!pastEventsPanel) return;
  const shouldShow = pastEventsPanel.hidden;
  pastEventsPanel.hidden = !shouldShow;
  btnPastEventsToggle.setAttribute("aria-expanded", String(shouldShow));
});

onAuthStateChanged(auth, async (user) => {
  // Reflect the signed-in state — the static "Sign in to join" read as
  // signed-out even for signed-in visitors.
  const authLink = document.querySelector("#pubAuthLink");
  const authStatusEl = document.querySelector("#pubAuthStatus");
  if (authLink) authLink.textContent = user ? "Open Planner" : "Sign in to join";

  let owner = false;
  let host = false;
  let nickname = "";
  if (user) {
    try {
      const r = await fnGetMyPlannerRole({});
      owner = !!r.data?.owner;
      host = !!r.data?.host;
      nickname = r.data?.nickname || "";
    } catch {
      owner = isOwnerFallback(user);
      host = owner;
    }
  }
  if (authStatusEl) {
    authStatusEl.style.display = user ? "" : "none";
    authStatusEl.textContent = user ? (nickname ? `Signed in as ${nickname}` : "Signed in") : "";
  }
  // Owner sees "Admin", approved hosts see "My Events" — matching the planner.
  adminLinks.forEach((link) => {
    link.hidden = !(owner || host);
    if (owner || host) link.textContent = owner ? "Admin" : "Manage Events";
  });
});

// Boot with error handling — a Firestore failure must never leave a blank page.
async function boot() {
  const params = new URLSearchParams(window.location.search);
  const eventId = params.get("id");
  try {
    if (eventId) {
      await loadEvent(eventId);
    } else {
      await loadList();
    }
  } catch (e) {
    console.error("Events page failed to load", e);
    eventListView.style.display = "";
    eventDetailView.style.display = "none";
    upcomingEvents.innerHTML = `
      <div class="muted">Couldn't load events — check your connection.</div>
      <button class="btn" id="btnRetryLoad" style="margin-top:10px;">Retry</button>
    `;
    pastEvents.innerHTML = "";
    document.querySelector("#btnRetryLoad")?.addEventListener("click", () => location.reload());
  }
}

// Day rollovers are clock events — refresh the grouping periodically.
setInterval(() => {
  if (currentGd && eventDayKeys(currentGd.startsAt, currentGd.endsAt).length > 1) renderTables();
}, 60 * 1000);

await boot();
