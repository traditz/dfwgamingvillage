import { firebaseConfig } from "../firebase-config.js";
import * as appConfig from "../app-config.js";

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";
import {
  getFirestore,
  collection,
  onSnapshot,
  orderBy,
  query
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";
import { getFunctions, httpsCallable } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-functions.js";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const functions = getFunctions(app, appConfig.FUNCTIONS_REGION);

const fnCreateGameDay = httpsCallable(functions, "createGameDay");
const fnUpdateGameDay = httpsCallable(functions, "updateGameDay");
const fnDeleteGameDay = httpsCallable(functions, "deleteGameDay");

const authStatus = document.querySelector("#authStatus");
const blockedState = document.querySelector("#blockedState");
const adminApp = document.querySelector("#adminApp");
const eventRows = document.querySelector("#eventRows");
const tableRows = document.querySelector("#tableRows");
const btnNewEvent = document.querySelector("#btnNewEvent");
const eventForm = document.querySelector("#eventForm");
const eventId = document.querySelector("#eventId");
const eventTitle = document.querySelector("#eventTitle");
const eventStart = document.querySelector("#eventStart");
const eventStatus = document.querySelector("#eventStatus");
const eventLocation = document.querySelector("#eventLocation");
const btnDeleteEvent = document.querySelector("#btnDeleteEvent");
const publicLink = document.querySelector("#publicLink");
const statusBox = document.querySelector("#statusBox");
const errorBox = document.querySelector("#errorBox");

let currentUser = null;
let events = [];
let selectedId = "";
let unsubEvents = null;
let unsubTables = null;

function esc(s) {
  return String(s ?? "").replace(/[&<>"']/g, (m) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  }[m]));
}

function isAdmin(user) {
  if (!user) return false;
  const owner = appConfig.OWNER_UID;
  return user.uid === owner || user.uid === `discord:${owner}`;
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
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit"
  });
}

function toLocalInput(v) {
  const d = asDate(v);
  if (!d) return "";
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function showStatus(msg) {
  statusBox.textContent = msg || "";
  statusBox.style.display = msg ? "" : "none";
  if (msg) showError("");
}

function showError(msg) {
  errorBox.textContent = msg || "";
  errorBox.style.display = msg ? "" : "none";
}

function selectEvent(id) {
  selectedId = id;
  const gd = events.find((item) => item.id === id);
  if (!gd) return;

  eventId.value = gd.id;
  eventTitle.value = gd.title || "";
  eventStart.value = toLocalInput(gd.startsAt);
  eventStatus.value = gd.status || "draft";
  eventLocation.value = gd.location || "";
  publicLink.href = `../events/?id=${encodeURIComponent(gd.id)}`;
  renderEvents();
  subscribeTables(gd.id);
}

function newEvent() {
  selectedId = "";
  eventId.value = "";
  eventTitle.value = "";
  eventStart.value = "";
  eventStatus.value = "draft";
  eventLocation.value = "";
  publicLink.href = "../events/";
  tableRows.innerHTML = `<div class="muted">Save the event before managing tables.</div>`;
  renderEvents();
}

function renderEvents() {
  eventRows.innerHTML = "";
  if (!events.length) {
    eventRows.innerHTML = `<div class="muted">No events yet.</div>`;
    return;
  }

  for (const gd of events) {
    const row = document.createElement("button");
    row.type = "button";
    row.className = `adminRow ${gd.id === selectedId ? "is-active" : ""}`;
    row.innerHTML = `
      <div>
        <div class="rowTitle">${esc(gd.title || "Game Day")}</div>
        <div class="rowMeta">${esc(fmtDate(gd.startsAt))}${gd.location ? ` - ${esc(gd.location)}` : ""}</div>
      </div>
      <span class="statusPill ${esc(gd.status || "draft")}">${esc(gd.status || "draft")}</span>
    `;
    row.addEventListener("click", () => selectEvent(gd.id));
    eventRows.appendChild(row);
  }
}

function renderTables(items) {
  tableRows.innerHTML = "";
  if (!items.length) {
    tableRows.innerHTML = `<div class="muted">No hosted tables for this event.</div>`;
    return;
  }

  for (const table of items) {
    const row = document.createElement("div");
    row.className = "adminRow";
    row.innerHTML = `
      <div>
        <div class="rowTitle">${esc(table.gameName || "Game")}</div>
        <div class="rowMeta">Host: ${esc(table.hostDisplayName || "Unknown")} - Seats ${Number(table.confirmedCount || 0)}/${Number(table.capacity || 0)}</div>
      </div>
      <span class="statusPill">${Number(table.waitlistCount || 0)} wait</span>
    `;
    tableRows.appendChild(row);
  }
}

function subscribeEvents() {
  if (unsubEvents) unsubEvents();
  const q = query(collection(db, "gamedays"), orderBy("startsAt", "desc"));
  unsubEvents = onSnapshot(q, (snap) => {
    events = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    renderEvents();
    if (!selectedId && events.length) selectEvent(events[0].id);
  }, (err) => showError(err.message || String(err)));
}

function subscribeTables(gamedayId) {
  if (unsubTables) unsubTables();
  const q = query(collection(db, "gamedays", gamedayId, "tables"), orderBy("startTime", "asc"));
  unsubTables = onSnapshot(q, (snap) => {
    renderTables(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
  }, (err) => showError(err.message || String(err)));
}

btnNewEvent?.addEventListener("click", newEvent);

eventForm?.addEventListener("submit", async (ev) => {
  ev.preventDefault();
  showStatus("Saving...");
  showError("");

  const payload = {
    title: eventTitle.value.trim(),
    startsAt: eventStart.value ? new Date(eventStart.value).toISOString() : "",
    location: eventLocation.value.trim(),
    status: eventStatus.value
  };

  try {
    if (eventId.value) {
      await fnUpdateGameDay({ gamedayId: eventId.value, ...payload });
      showStatus("Event updated.");
    } else {
      const result = await fnCreateGameDay(payload);
      selectedId = result.data.gamedayId;
      showStatus("Event created.");
    }
  } catch (e) {
    showStatus("");
    showError(e?.message || String(e));
  }
});

btnDeleteEvent?.addEventListener("click", async () => {
  if (!eventId.value) return;
  if (!confirm("Delete this event and all planner data under it?")) return;
  showStatus("Deleting...");
  showError("");
  try {
    await fnDeleteGameDay({ gamedayId: eventId.value });
    newEvent();
    showStatus("Event deleted.");
  } catch (e) {
    showStatus("");
    showError(e?.message || String(e));
  }
});

onAuthStateChanged(auth, (user) => {
  currentUser = user || null;
  if (!isAdmin(currentUser)) {
    authStatus.textContent = currentUser ? "Signed in, not admin." : "Not signed in.";
    blockedState.style.display = "";
    adminApp.style.display = "none";
    return;
  }

  authStatus.textContent = `Admin: ${currentUser.displayName || currentUser.uid}`;
  blockedState.style.display = "none";
  adminApp.style.display = "";
  subscribeEvents();
});
