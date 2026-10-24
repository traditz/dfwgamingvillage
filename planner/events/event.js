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
  onSnapshot,
  orderBy,
  query,
  where
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";
import { getFunctions, httpsCallable } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-functions.js";

import { esc, asDate, fmtTime, eventDayKeys, eventEndTimeLabel, centralDateKey, isPastEventDates, toast } from "../shared.js?v=20260817-p39";
import { ic, keyParts, dateBlockHtml, slotHeadHtml, seatMeterHtml, artHtml, avatarHtml, emptyHtml } from "../ui.js?v=20261024-d2";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const functions = getFunctions(app, appConfig.FUNCTIONS_REGION);
const fnGetMyPlannerRole = httpsCallable(functions, "getMyPlannerRole");

const eventListView = document.querySelector("#eventListView");
const eventDetailView = document.querySelector("#eventDetailView");
const upcomingEvents = document.querySelector("#upcomingEvents");
const pastEvents = document.querySelector("#pastEvents");
const btnUpcomingToggle = document.querySelector("#btnUpcomingToggle");
const btnPastEventsToggle = document.querySelector("#btnPastEventsToggle");
const pastEventsPanel = document.querySelector("#pastEventsPanel");
const eventTitle = document.querySelector("#eventTitle");
const evKicker = document.querySelector("#evKicker");
const eventMeta = document.querySelector("#eventMeta");
const evStats = document.querySelector("#evStats");
const evBg = document.querySelector("#evBg");
const historyNotice = document.querySelector("#historyNotice");
const dayTabsEl = document.querySelector("#dayTabs");
const tTitle = document.querySelector("#tTitle");
const tSub = document.querySelector("#tSub");
const publicTables = document.querySelector("#publicTables");
const publicWants = document.querySelector("#publicWants");
const wantsCount = document.querySelector("#wantsCount");
const btnShare = document.querySelector("#btnShare");
const btnOpenPlanner = document.querySelector("#btnOpenPlanner");
const btnOpenPlanner2 = document.querySelector("#btnOpenPlanner2");
const btnCalendar = document.querySelector("#btnCalendar");
const joinCard = document.querySelector(".joinCard");
const filters = document.querySelector("#filters");
const adminLinks = document.querySelectorAll("[data-admin-link]");

let activeFilter = "all";
let activeDayKey = null;
let currentGd = null;
let tables = [];
let tablesLoaded = false;
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
  if (year) parts.push(year);
  if (rating) parts.push(`★ ${rating}`);
  return parts.join(" · ");
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
  if (!host.isConnected) return;
  const text = gameMetaText(meta);
  if (text) {
    host.textContent = text;
    host.hidden = false;
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
  // Multi-day events stay current through their final day.
  return isPastEventDates(gd?.startsAt, gd?.endsAt);
}

const gdDays = (gd) => eventDayKeys(gd?.startsAt, gd?.endsAt);

// 1-based day number while a multi-day event is running, else 0.
function liveDayOf(gd) {
  if (!gd || isPastEvent(gd)) return 0;
  const days = gdDays(gd);
  if (days.length < 2) return 0;
  return days.indexOf(centralDateKey(new Date())) + 1;
}

// "Sat, Nov 7 · 11:00 AM – 9:00 PM" or "Fri, Nov 6, 10:00 AM – Sun, Nov 8, 4:00 PM".
function whenText(gd) {
  const days = gdDays(gd);
  if (!days.length) return "Date TBD";
  const f = keyParts(days[0]);
  const l = keyParts(days[days.length - 1]);
  const start = asDate(gd.startsAt) ? fmtTime(gd.startsAt) : "";
  const end = eventEndTimeLabel(gd.endsAt);
  if (days.length > 1) return `${f.label}${start ? `, ${start}` : ""} – ${l.label}${end ? `, ${end}` : ""}`;
  return `${f.label}${start ? ` · ${start}${end ? ` – ${end}` : ""}` : ""}`;
}

function statusPillHtml(gd) {
  const days = gdDays(gd);
  const live = liveDayOf(gd);
  if (isPastEvent(gd)) return `<span class="pill">${ic("history")}Past</span>`;
  if (live) return `<span class="pill pill-amber">Day ${live} of ${days.length}</span>`;
  if (days.length > 1) return `<span class="pill">${days.length} days</span>`;
  return "";
}

// -----------------------------
// List of game days
// -----------------------------
function eventCardHtml(gd) {
  const status = statusPillHtml(gd);
  return `<a class="evCard" href="${eventUrl(gd.id)}">
    ${dateBlockHtml(gdDays(gd), "evDate")}
    <span class="evCardBody">
      ${status ? `<span class="pills">${status}</span>` : ""}
      <span class="evCardTitle">${esc(gd.title || "DFWGV Game Day")}</span>
      <span class="evCardLine">${ic("clock", "ico-sm")}<span>${esc(whenText(gd))}</span></span>
      ${gd.location ? `<span class="evCardLine">${ic("pin", "ico-sm")}<span>${esc(gd.location)}</span></span>` : ""}
    </span>
    <span class="evCardGo" aria-hidden="true">${ic("right")}</span>
  </a>`;
}

function renderEventCollection(host, items, emptyTitle, emptyBody) {
  host.innerHTML = items.length
    ? items.map(eventCardHtml).join("")
    : emptyHtml("cal", emptyTitle, emptyBody, `<a class="btn btn-small" href="../">Open the planner</a>`);
}

function setListMode(past) {
  if (pastEventsPanel) pastEventsPanel.hidden = !past;
  if (upcomingEvents) upcomingEvents.hidden = past;
  btnUpcomingToggle?.setAttribute("aria-pressed", String(!past));
  btnPastEventsToggle?.setAttribute("aria-pressed", String(past));
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

  renderEventCollection(upcomingEvents, upcoming, "No upcoming public game days", "Check back soon. New game days show up here as soon as they're posted.");
  renderEventCollection(pastEvents, past, "No past game days yet", "Finished game days stay here for history.");
  if (btnPastEventsToggle) {
    btnPastEventsToggle.disabled = past.length === 0;
    btnPastEventsToggle.textContent = `Past (${past.length})`;
  }
  if (!past.length) setListMode(false);
}

// -----------------------------
// One game day
// -----------------------------
function seatsOf(t) {
  return {
    cap: Number(t.capacity || 0),
    confirmed: Number(t.confirmedCount || 0),
    waitlist: Number(t.waitlistCount || 0)
  };
}

function eventBounds() {
  const days = currentGd ? gdDays(currentGd) : [];
  if (days.length < 2) return null;
  return {
    days,
    firstDay: days[0],
    lastDay: days[days.length - 1],
    todayKey: centralDateKey(new Date()),
    startsLabel: asDate(currentGd.startsAt) ? fmtTime(currentGd.startsAt) : "",
    endsLabel: eventEndTimeLabel(currentGd.endsAt)
  };
}

// The event day a table belongs to (off-day rows clamp to the nearest day).
function tableDayKey(t, bounds) {
  const st = asDate(t.startTime);
  const key = st ? centralDateKey(st) : "";
  if (!bounds) return key;
  if (!key || key < bounds.firstDay) return bounds.firstDay;
  if (key > bounds.lastDay) return bounds.lastDay;
  return key;
}

// "" | "started" | "past": only meaningful on multi-day events.
function tableTimeState(t, bounds) {
  if (!bounds) return "";
  const st = asDate(t.startTime);
  if (!st) return "";
  const key = centralDateKey(st);
  if (key < bounds.todayKey) return "past";
  if (key === bounds.todayKey && st.getTime() < Date.now()) return "started";
  return "";
}

function renderDetailHeader(gd) {
  eventTitle.textContent = gd.title || "DFWGV Game Day";
  document.title = `${gd.title || "DFWGV Game Day"} — DFWGV Events`;
  const isPast = isPastEvent(gd);
  const days = gdDays(gd);
  const f = days.length ? keyParts(days[0]) : null;
  const l = days.length ? keyParts(days[days.length - 1]) : null;
  const year = days.length ? days[0].slice(0, 4) : "";
  const dateText = !f ? "Date TBD" : days.length > 1 ? `${f.long} – ${l.long}, ${year}` : `${f.long}, ${year}`;
  const status = statusPillHtml(gd).replace(">Past<", ">Past event<");
  if (evKicker) evKicker.innerHTML = `<span class="num">${esc(dateText)}</span>${status}`;

  const start = asDate(gd.startsAt) ? fmtTime(gd.startsAt) : "";
  const end = eventEndTimeLabel(gd.endsAt);
  const timeText = !start ? ""
    : days.length > 1 ? `${start} ${f.dow}${end ? ` – ${end} ${l.dow}` : ""}`
    : `${start}${end ? ` – ${end}` : ""}`;
  eventMeta.innerHTML = [
    timeText ? `<span>${ic("clock")}<span class="num">${esc(timeText)}</span></span>` : "",
    gd.location ? `<span>${ic("pin")}<span>${esc(gd.location)}</span></span>` : "",
    gd.createdByDisplayName ? `<span>${avatarHtml(gd.createdByDisplayName, "av-sm")}<span>Hosted by ${esc(gd.createdByDisplayName)}</span></span>` : ""
  ].join("");

  if (historyNotice) historyNotice.hidden = !isPast;
  const plannerHref = `../?event=${encodeURIComponent(gd.id)}`;
  btnOpenPlanner.href = plannerHref;
  btnOpenPlanner.textContent = isPast ? "View in planner" : "Host or Join";
  btnOpenPlanner.classList.toggle("btn-primary", !isPast);
  if (btnOpenPlanner2) btnOpenPlanner2.href = plannerHref;
  if (joinCard) joinCard.hidden = isPast;
  btnCalendar.href = calendarUrl(gd);
  btnCalendar.hidden = isPast;
  renderStats();
}

function renderStats() {
  if (!evStats) return;
  if (!tablesLoaded || !currentGd) { evStats.innerHTML = ""; return; }
  const bounds = eventBounds();
  const isPast = isPastEvent(currentGd);
  let taken = 0, open = 0, waiting = 0;
  for (const t of tables) {
    const s = seatsOf(t);
    taken += s.confirmed;
    waiting += s.waitlist;
    const custom = t.isCustom === true || !t.bggId;
    if (!custom && s.cap > 0 && tableTimeState(t, bounds) !== "past") open += Math.max(0, s.cap - s.confirmed);
  }
  const n = tables.length;
  evStats.innerHTML = `<span class="stat"><b>${n}</b>${n === 1 ? "table" : "tables"}</span>`
    + `<span class="stat"><b>${taken}</b>${isPast ? "seats filled" : "seats taken"}</span>`
    + (isPast ? "" : `<span class="stat green"><b>${open}</b>open seats</span>`)
    + (waiting ? `<span class="stat gold"><b>${waiting}</b>on waitlists</span>` : "");
  // The header picks up the colors of the day's own box art.
  const art = tables.find((t) => t.thumbUrl)?.thumbUrl;
  if (evBg) evBg.style.backgroundImage = art ? `url("${encodeURI(String(art))}")` : "";
}

function renderDayTabs(bounds, day) {
  if (!dayTabsEl) return;
  if (!bounds) {
    dayTabsEl.innerHTML = "";
    dayTabsEl.className = "";
    dayTabsEl.removeAttribute("role");
    return;
  }
  const counts = {};
  tables.forEach((t) => { const k = tableDayKey(t, bounds); counts[k] = (counts[k] || 0) + 1; });
  dayTabsEl.className = "dayTabs";
  dayTabsEl.setAttribute("role", "tablist");
  dayTabsEl.setAttribute("aria-label", "Days");
  dayTabsEl.innerHTML = bounds.days.map((k, i) => {
    const p = keyParts(k);
    const isToday = k === bounds.todayKey;
    const isPastDay = k < bounds.todayKey;
    const n = counts[k] || 0;
    const edge = [
      i === 0 && bounds.startsLabel ? `from ${bounds.startsLabel}` : "",
      i === bounds.days.length - 1 && bounds.endsLabel ? `until ${bounds.endsLabel}` : ""
    ].filter(Boolean).join(" · ");
    return `<button class="dayTab${isToday ? " is-today" : ""}${isPastDay ? " is-past" : ""}" type="button" role="tab" aria-selected="${k === day}" data-day="${k}">
      <span class="dn">Day ${i + 1}${isToday ? " · Today" : ""}${isPastDay ? " · Past" : ""}</span>
      <span class="dl">${esc(p.label)}</span>
      <span class="ds">${n} ${n === 1 ? "table" : "tables"}${edge ? `<span class="edge"> · ${esc(edge)}</span>` : ""}</span>
    </button>`;
  }).join("");
}

function cardHtml(t, bounds) {
  const s = seatsOf(t);
  const custom = t.isCustom === true || !t.bggId;
  const ts = tableTimeState(t, bounds);
  const isPast = isPastEvent(currentGd);
  const pills = [
    !isPast && ts !== "past" && s.cap > 0 && s.confirmed >= s.cap ? `<span class="pill pill-gold">Full</span>` : "",
    ts === "started" ? `<span class="pill pill-amber">${ic("clock")}Started</span>` : "",
    ts === "past" ? `<span class="pill">${ic("history")}Past</span>` : "",
    custom ? `<span class="pill pill-blue">${ic("clip")}Sign-up</span>` : "",
    t.gameSource === "library" ? `<span class="pill">${ic("book")}Library copy</span>` : ""
  ].join("");
  const bggUrl = t.bggId ? `https://boardgamegeek.com/boardgame/${encodeURIComponent(t.bggId)}` : "";
  const name = esc(t.gameName || "Game");
  const meta = custom ? "Custom sign-up" : gameMetaText(t);
  const host = t.hostDisplayName || "Unknown";
  return `<article class="tCard${ts === "past" ? " is-pastTable" : ""}">
    <div class="tArt${custom && !t.thumbUrl ? " signup" : ""}" aria-hidden="true">${artHtml(t.thumbUrl, { custom, signupSrc: "../signup-sheet.png" })}${pills ? `<span class="tOver">${pills}</span>` : ""}</div>
    <div class="tBody">
      ${pills ? `<div class="tPills pills">${pills}</div>` : ""}
      <div>
        <h3 class="tName">${bggUrl ? `<a href="${esc(bggUrl)}" target="_blank" rel="noopener">${name}</a>` : name}</h3>
        <p class="tMeta" data-game-meta${meta ? "" : " hidden"}>${esc(meta)}</p>
      </div>
      <div class="tHost">${avatarHtml(host, "av-sm")}<span>Hosted by <b>${esc(host)}</b></span></div>
      <div class="tSeats"><span class="seatMeter">${seatMeterHtml({ ...s, custom })}</span></div>
      ${t.notes ? `<p class="tNotes">${esc(t.notes)}</p>` : ""}
    </div>
  </article>`;
}

function renderTables() {
  const bounds = eventBounds();
  const day = bounds
    ? (activeDayKey && bounds.days.includes(activeDayKey) ? activeDayKey
      : bounds.days.includes(bounds.todayKey) ? bounds.todayKey : bounds.firstDay)
    : null;
  renderDayTabs(bounds, day);

  const onDay = bounds ? tables.filter((t) => tableDayKey(t, bounds) === day) : tables;
  const visible = onDay.filter((t) => {
    const s = seatsOf(t);
    if (activeFilter === "open") return s.cap > s.confirmed;
    if (activeFilter === "waitlist") return s.waitlist > 0;
    return true;
  });

  if (tTitle) tTitle.textContent = bounds ? `Day ${bounds.days.indexOf(day) + 1} · ${keyParts(day).long}` : "Tables";
  if (tSub) {
    tSub.textContent = !tablesLoaded ? "Loading tables…"
      : `${visible.length} ${visible.length === 1 ? "table" : "tables"} by start time`
        + (activeFilter === "open" ? " · with open seats" : activeFilter === "waitlist" ? " · with a waitlist" : "");
  }
  if (!tablesLoaded) return;

  if (!visible.length) {
    publicTables.innerHTML = onDay.length
      ? emptyHtml("dice", "No tables match", "Choose All to see every table.")
      : emptyHtml("dice", bounds ? "No tables on this day yet" : "No tables yet",
          isPastEvent(currentGd) ? "Nothing was hosted." : "Hosts add tables in the planner. Check back soon.");
    return;
  }

  const slots = [];
  for (const t of visible) {
    const st = asDate(t.startTime);
    const key = st ? String(Math.floor(st.getTime() / 60000)) : "tbd";
    const last = slots[slots.length - 1];
    if (last && last.key === key) last.items.push(t);
    else slots.push({ key, label: st ? fmtTime(st) : "TBD", items: [t] });
  }
  publicTables.innerHTML = slots.map((s) =>
    `<section class="slot n${Math.min(s.items.length, 3)}" aria-label="${esc(s.label)}">${slotHeadHtml(s.label, s.items.length)}<div class="slotGrid">${s.items.map((t) => cardHtml(t, bounds)).join("")}</div></section>`
  ).join("");
  const cards = publicTables.querySelectorAll(".tCard");
  visible.forEach((t, i) => { if (cards[i]) hydrateGameMeta(cards[i], t); });
}

function wantHtml(p) {
  const bggUrl = p.bggId ? `https://boardgamegeek.com/boardgame/${encodeURIComponent(p.bggId)}` : "";
  const meta = gameMetaText(p);
  const n = Number(p.interestedCount || (Array.isArray(p.interested) ? p.interested.length : 0) || 0);
  return `
    <div class="rqTop">
      <span class="rqThumb">${p.thumbUrl ? `<img src="${esc(p.thumbUrl)}" alt="" loading="lazy" />` : ic("dice")}</span>
      <div style="min-width:0">
        <div class="nm">${bggUrl ? `<a href="${esc(bggUrl)}" target="_blank" rel="noopener">${esc(p.gameName || "Game")}</a>` : esc(p.gameName || "Game")}</div>
        <div class="sub" data-game-meta${meta ? "" : " hidden"}>${esc(meta)}</div>
      </div>
    </div>
    <div class="rqBy">Requested by <b>${esc(p.createdByDisplayName || "Someone")}</b></div>
    ${p.notes ? `<p class="rqNote">${esc(p.notes)}</p>` : ""}
    ${n > 0 ? `<span class="rqInt">${ic("hand", "ico-sm")}<span><b class="num">${n}</b> would play</span></span>` : ""}
  `;
}

function renderWants(posts) {
  publicWants.innerHTML = "";
  const wants = posts.filter((p) => p.kind === "want_to_play");
  if (wantsCount) wantsCount.textContent = wants.length ? String(wants.length) : "";
  if (!wants.length) {
    publicWants.innerHTML = `<p class="none" style="margin:0">No game requests yet.</p>`;
    return;
  }
  for (const p of wants) {
    const el = document.createElement("article");
    el.className = "rq";
    el.innerHTML = wantHtml(p);
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

function showListError() {
  upcomingEvents.innerHTML = emptyHtml("alert", "Couldn't load game days", "Check your connection and try again.",
    `<button class="btn btn-small" type="button" id="btnRetryLoad">Retry</button>`);
  pastEvents.innerHTML = "";
  document.querySelector("#btnRetryLoad")?.addEventListener("click", () => location.reload());
}

function loadList() {
  stopDetailListeners();
  eventListView.hidden = false;
  eventDetailView.hidden = true;
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
  }, showListError);
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

  if (unsubList) { unsubList(); unsubList = null; }
  eventListView.hidden = true;
  eventDetailView.hidden = false;
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
    renderTables();
  });

  const tablesQ = query(collection(db, "gamedays", id, "tables"), orderBy("startTime", "asc"));
  unsubTables = onSnapshot(tablesQ, (tableSnap) => {
    tables = tableSnap.docs.map((d) => ({ id: d.id, ...d.data() }));
    tablesLoaded = true;
    renderTables();
    renderStats();
  }, () => {
    publicTables.innerHTML = emptyHtml("alert", "Couldn't load tables", "Check your connection and reload.");
  });

  const postsQ = query(collection(db, "gamedays", id, "posts"), orderBy("createdAt", "desc"));
  unsubPosts = onSnapshot(postsQ, (postSnap) => {
    renderWants(postSnap.docs.map((d) => ({ id: d.id, ...d.data() })));
  }, () => {
    publicWants.innerHTML = `<p class="none" style="margin:0">Couldn't load requests — check your connection.</p>`;
  });
}

filters?.addEventListener("click", (ev) => {
  const btn = ev.target.closest("[data-filter]");
  if (!btn) return;
  activeFilter = btn.getAttribute("data-filter");
  filters.querySelectorAll("[data-filter]").forEach((el) => el.setAttribute("aria-pressed", String(el === btn)));
  renderTables();
});

dayTabsEl?.addEventListener("click", (ev) => {
  const b = ev.target.closest("[data-day]");
  if (!b) return;
  activeDayKey = b.getAttribute("data-day");
  renderTables();
  dayTabsEl.querySelector(`[data-day="${activeDayKey}"]`)?.focus();
});

btnShare?.addEventListener("click", async () => {
  const label = btnShare.querySelector("span");
  try {
    await navigator.clipboard.writeText(window.location.href);
    if (label) label.textContent = "Link copied";
    setTimeout(() => { if (label) label.textContent = "Share"; }, 1600);
  } catch {
    toast("Couldn't copy automatically — copy this page's address from the address bar.", "info", 6000);
  }
});

btnUpcomingToggle?.addEventListener("click", () => setListMode(false));
btnPastEventsToggle?.addEventListener("click", () => setListMode(true));

onAuthStateChanged(auth, async (user) => {
  // Reflect the signed-in state — the static "Sign in to join" read as
  // signed-out even for signed-in visitors.
  const authLink = document.querySelector("#pubAuthLink");
  const authStatusEl = document.querySelector("#pubAuthStatus");
  if (authLink) authLink.textContent = user ? "Open planner" : "Sign in to join";

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
    authStatusEl.hidden = !user;
    authStatusEl.textContent = user ? (nickname ? `Signed in as ${nickname}` : "Signed in") : "";
  }
  const joinText = document.querySelector("#joinText");
  if (joinText) {
    joinText.textContent = user
      ? "Join a table, host your own game, or request one in the planner."
      : "Sign in on the planner to join a table, host your own game, or request one.";
  }
  // Owner sees "Admin", approved hosts see "Manage Events" — matching the planner.
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
    eventListView.hidden = false;
    eventDetailView.hidden = true;
    showListError();
  }
}

// Day rollovers and start times are clock events — refresh periodically.
setInterval(() => {
  if (currentGd && gdDays(currentGd).length > 1) {
    renderTables();
    renderStats();
  }
}, 60 * 1000);

await boot();
