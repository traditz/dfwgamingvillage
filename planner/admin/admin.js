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
const adminLinks = document.querySelectorAll("[data-admin-link]");
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
const discordStatusValue = document.querySelector("#discordStatusValue");
const discordHelp = document.querySelector("#discordHelp");
const discordCommand = document.querySelector("#discordCommand");
const btnCopyBindCommand = document.querySelector("#btnCopyBindCommand");
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

function setAdminNavVisibility(user) {
  adminLinks.forEach((link) => {
    link.hidden = !isAdmin(user);
  });
}

async function displayNameForUser(user) {
  if (!user) return "";
  try {
    const token = await user.getIdTokenResult();
    const claims = token?.claims || {};
    return (
      claims.discordDisplayName ||
      claims.discordUsername ||
      user.displayName ||
      user.email ||
      (user.uid?.startsWith("discord:") ? "Discord user" : user.uid)
    );
  } catch {
    return user.displayName || user.email || (user.uid?.startsWith("discord:") ? "Discord user" : user.uid);
  }
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
  renderDiscordBinding(gd);
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
  renderDiscordBinding(null);
  tableRows.innerHTML = `<div class="muted">Save the event before managing tables.</div>`;
  renderEvents();
}

function discordBinding(gd) {
  const discord = gd?.discord && typeof gd.discord === "object" ? gd.discord : {};
  const channelId = String(discord.channelId || "").trim();
  return {
    channelId,
    channelName: String(discord.channelName || "").trim(),
    messageId: String(discord.plannerMessageId || "").trim(),
    lastSyncedAt: discord.lastSyncedAt || null
  };
}

function bindCommand(gamedayId) {
  return `/planner_bind gameday_id:${gamedayId}`;
}

function renderDiscordBinding(gd) {
  if (!discordStatusValue || !discordHelp || !discordCommand || !btnCopyBindCommand) return;

  if (!gd?.id) {
    discordStatusValue.textContent = "Save or select an event first.";
    discordStatusValue.className = "discordStatus";
    discordHelp.textContent = "Create events here, then bind one to the desired Discord channel with the bot.";
    discordCommand.textContent = "/planner_bind gameday_id:<event id>";
    btnCopyBindCommand.disabled = true;
    return;
  }

  const binding = discordBinding(gd);
  const command = bindCommand(gd.id);
  discordCommand.textContent = command;
  btnCopyBindCommand.disabled = false;

  if (binding.channelId) {
    const label = binding.channelName ? `#${binding.channelName}` : `channel ${binding.channelId}`;
    discordStatusValue.textContent = `Linked to ${label}`;
    discordStatusValue.className = "discordStatus is-linked";
    const syncText = binding.lastSyncedAt ? ` Last sync: ${fmtDate(binding.lastSyncedAt)}.` : "";
    discordHelp.textContent = `Run /planner_event in Discord to inspect it, /planner_refresh to rebuild the board, or /planner_unbind in that channel to detach it.${syncText}`;
    return;
  }

  discordStatusValue.textContent = "Not linked to Discord";
  discordStatusValue.className = "discordStatus is-unlinked";
  discordHelp.textContent = "Run this in the Discord channel that should host the planner board.";
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
        <div class="rowMeta">${discordBinding(gd).channelId ? `Discord: ${esc(discordBinding(gd).channelName ? `#${discordBinding(gd).channelName}` : discordBinding(gd).channelId)}` : "Discord: Not linked"}</div>
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

btnCopyBindCommand?.addEventListener("click", async () => {
  if (!eventId.value) return;
  const command = bindCommand(eventId.value);
  try {
    await navigator.clipboard.writeText(command);
    showStatus("Discord bind command copied.");
  } catch {
    showError(command);
  }
});

onAuthStateChanged(auth, async (user) => {
  currentUser = user || null;
  setAdminNavVisibility(currentUser);
  if (!isAdmin(currentUser)) {
    authStatus.textContent = currentUser ? "Signed in, not admin." : "Not signed in.";
    blockedState.style.display = "";
    adminApp.style.display = "none";
    return;
  }

  authStatus.textContent = `Admin: ${await displayNameForUser(currentUser)}`;
  blockedState.style.display = "none";
  adminApp.style.display = "";
  subscribeEvents();
});
