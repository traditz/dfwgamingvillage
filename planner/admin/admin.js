import { firebaseConfig } from "../firebase-config.js";
import * as appConfig from "../app-config.js";

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";
import {
  getFirestore,
  collection,
  onSnapshot,
  orderBy,
  query,
  where
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";
import { getFunctions, httpsCallable } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-functions.js";

import { esc, asDate, fmtDate, fmtCentralDatetimeValue, parseDatetimeLocalToISO, confirmDialog, toast } from "../shared.js?v=20260816-p10";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const functions = getFunctions(app, appConfig.FUNCTIONS_REGION);

const fnCreateGameDay = httpsCallable(functions, "createGameDay");
const fnUpdateGameDay = httpsCallable(functions, "updateGameDay");
const fnDeleteGameDay = httpsCallable(functions, "deleteGameDay");
const fnListHostAdmin = httpsCallable(functions, "listHostAdmin");
const fnManageHost = httpsCallable(functions, "manageHost");
const fnGetMyPlannerRole = httpsCallable(functions, "getMyPlannerRole");

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
const eventVisibility = document.querySelector("#eventVisibility");
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
// Role resolved server-side: owner sees everything; hosts see their own events.
let myRole = { owner: false, host: false };

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
  // Prefill in CENTRAL wall clock — the submit path parses as Central.
  eventStart.value = fmtCentralDatetimeValue(gd.startsAt);
  eventStatus.value = gd.status || "draft";
  if (eventVisibility) eventVisibility.value = gd.visibility === "private" ? "private" : "public";
  eventLocation.value = gd.location || "";
  publicLink.href = `../events/?id=${encodeURIComponent(gd.id)}`;
  renderDiscordBinding(gd);
  renderEvents();
  subscribeTables(gd.id);
}

function newEvent() {
  // Stop the previous event's tables listener so its next snapshot can't
  // overwrite the "save first" placeholder below.
  if (unsubTables) {
    unsubTables();
    unsubTables = null;
  }
  selectedId = "";
  eventId.value = "";
  eventTitle.value = "";
  eventStart.value = "";
  eventStatus.value = "draft";
  if (eventVisibility) eventVisibility.value = "public";
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
  // Owner reads everything (rules allow admins); hosts query only their own
  // events — under the private-events rules an unfiltered query would be denied.
  const q = myRole.owner
    ? query(collection(db, "gamedays"), orderBy("startsAt", "desc"))
    : query(collection(db, "gamedays"), where("createdBy", "==", currentUser.uid), orderBy("startsAt", "desc"));
  unsubEvents = onSnapshot(q, (snap) => {
    const all = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    // Hosts only see (and manage) the events they created; owner sees all.
    events = myRole.owner ? all : all.filter((gd) => currentUser && gd.createdBy === currentUser.uid);
    renderEvents();
    renderReadiness();
    if (!selectedId && events.length) selectEvent(events[0].id);
    // A just-created event: populate the form once its doc arrives, but never
    // clobber a form the user is already editing (guarded by the id check).
    else if (selectedId && eventId.value === selectedId && events.some((e) => e.id === selectedId)) {
      const currentTitle = eventTitle.value;
      const gd = events.find((e) => e.id === selectedId);
      if (gd && (!currentTitle || currentTitle === gd.title)) selectEvent(selectedId);
    }
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
    // Parse the field as CENTRAL wall clock (matches the planner's create modal).
    startsAt: eventStart.value ? parseDatetimeLocalToISO(eventStart.value) : "",
    location: eventLocation.value.trim(),
    status: eventStatus.value,
    visibility: eventVisibility ? eventVisibility.value : "public"
  };

  try {
    if (eventId.value) {
      await fnUpdateGameDay({ gamedayId: eventId.value, ...payload });
      showStatus("Event updated.");
    } else {
      const result = await fnCreateGameDay(payload);
      // Bind the form to the new event immediately — leaving eventId empty
      // made a second Save create a duplicate event.
      selectedId = result.data.gamedayId;
      eventId.value = selectedId;
      showStatus("Event created.");
    }
  } catch (e) {
    showStatus("");
    showError(e?.message || String(e));
  }
});

btnDeleteEvent?.addEventListener("click", async () => {
  if (!eventId.value) return;
  const ok = await confirmDialog({
    title: "Delete this event?",
    message: "This deletes the event and ALL of its tables and signups. This cannot be undone.",
    confirmLabel: "Delete Event",
    danger: true
  });
  if (!ok) return;
  showStatus("Deleting...");
  showError("");
  try {
    await fnDeleteGameDay({ gamedayId: eventId.value });
    newEvent();
    showStatus("");
    toast("Event deleted.", "success");
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

async function resolveAccess() {
  const user = currentUser;
  myRole = { owner: false, host: false };
  let roleError = false;

  if (user) {
    try {
      const r = await fnGetMyPlannerRole({});
      myRole = { owner: false, host: false, ...(r.data || {}) };
    } catch {
      // A transient failure must not read as "your access was removed" —
      // fall back to the owner check, otherwise offer a Retry.
      const owner = isAdmin(user);
      if (owner) myRole = { owner: true, host: true };
      else roleError = true;
    }
  }

  const access = myRole.owner || myRole.host;
  adminLinks.forEach((link) => {
    link.hidden = !access;
    if (access) link.textContent = myRole.owner ? "Admin" : "Manage Events";
  });

  const blockedRetry = document.querySelector("#blockedRetry");
  if (!access) {
    authStatus.textContent = user
      ? (roleError ? "Signed in — couldn't verify access." : "Signed in — host access required.")
      : "Not signed in.";
    if (blockedRetry) blockedRetry.style.display = roleError ? "" : "none";
    blockedState.style.display = "";
    adminApp.style.display = "none";
    return;
  }
  if (blockedRetry) blockedRetry.style.display = "none";

  const name = myRole.nickname || await displayNameForUser(user);
  authStatus.textContent = `${myRole.owner ? "Admin" : "Host"}: ${name}`;

  // Owner-only panels
  const hostsCard = document.querySelector("#hostsCard");
  const readinessCard = document.querySelector("#readinessCard");
  if (hostsCard) hostsCard.style.display = myRole.owner ? "" : "none";
  if (readinessCard) readinessCard.style.display = myRole.owner ? "" : "none";

  blockedState.style.display = "none";
  adminApp.style.display = "";
  subscribeEvents();
  if (myRole.owner) loadHosts();
}

onAuthStateChanged(auth, async (user) => {
  currentUser = user || null;
  await resolveAccess();
});

document.querySelector("#btnRetryAccess")?.addEventListener("click", resolveAccess);

// Live counts for the At a Glance card (owner-only card; data already loaded).
function renderReadiness() {
  const set = (sel, v) => {
    const el = document.querySelector(sel);
    if (el) el.textContent = String(v);
  };
  set("#statPublished", events.filter((e) => e.status === "published").length);
  set("#statDraft", events.filter((e) => e.status === "draft").length);
  set("#statHosts", (hostData.hosts || []).length);
  set("#statRequests", (hostData.requests || []).length);
}

// ----------------------------
// Hosts panel
// ----------------------------
const hostRequestRows = document.querySelector("#hostRequestRows");
const hostSearch = document.querySelector("#hostSearch");
const hostSearchRows = document.querySelector("#hostSearchRows");
const hostInviteEmail = document.querySelector("#hostInviteEmail");
const btnInviteHost = document.querySelector("#btnInviteHost");
const hostInviteRows = document.querySelector("#hostInviteRows");
const hostRows = document.querySelector("#hostRows");
const hostStatusBox = document.querySelector("#hostStatusBox");
const hostErrorBox = document.querySelector("#hostErrorBox");

let hostData = { hosts: [], requests: [], users: [], invites: [] };

function showHostStatus(msg) {
  hostStatusBox.textContent = msg || "";
  hostStatusBox.style.display = msg ? "" : "none";
  if (msg) showHostError("");
}

function showHostError(msg) {
  hostErrorBox.textContent = msg || "";
  hostErrorBox.style.display = msg ? "" : "none";
}

async function loadHosts() {
  if (!hostRequestRows) return;
  try {
    hostData = (await fnListHostAdmin({})).data || { hosts: [], requests: [], users: [], invites: [] };
    renderHostsPanel();
    renderReadiness();
  } catch (e) {
    showHostError(e?.message || String(e));
  }
}

function userLabel(u) {
  const name = u.nickname || u.displayName || u.authDisplayName || u.uid;
  const provider = String(u.uid || "").startsWith("discord:") ? "Discord" : "Google";
  const email = u.email ? ` · ${u.email}` : "";
  return { name, meta: `${provider}${email}` };
}

function hostActionRow(title, meta, buttons) {
  const row = document.createElement("div");
  row.className = "adminRow";
  row.innerHTML = `
    <div style="flex:1; min-width:0;">
      <div class="rowTitle">${esc(title)}</div>
      <div class="rowMeta">${esc(meta)}</div>
    </div>
  `;
  for (const b of buttons) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = `btn ${b.danger ? "btn-danger" : b.primary ? "btn-primary" : ""}`;
    btn.textContent = b.label;
    btn.addEventListener("click", async () => {
      btn.disabled = true;
      try {
        await fnManageHost(b.payload);
        showHostStatus(b.done);
        await loadHosts();
      } catch (e) {
        btn.disabled = false;
        showHostError(e?.message || String(e));
      }
    });
    row.appendChild(btn);
  }
  return row;
}

function renderHostsPanel() {
  const hostUids = new Set((hostData.hosts || []).map((h) => h.uid));

  hostRequestRows.innerHTML = "";
  const requests = hostData.requests || [];
  if (!requests.length) {
    hostRequestRows.innerHTML = `<div class="muted">No pending requests.</div>`;
  } else {
    for (const r of requests) {
      const { name, meta } = userLabel(r);
      hostRequestRows.appendChild(hostActionRow(name, meta, [
        { label: "Approve", primary: true, payload: { uid: r.uid, action: "approve" }, done: "Host approved." },
        { label: "Deny", payload: { uid: r.uid, action: "deny" }, done: "Request denied." },
      ]));
    }
  }

  hostRows.innerHTML = "";
  const hosts = hostData.hosts || [];
  if (!hosts.length) {
    hostRows.innerHTML = `<div class="muted">No approved hosts yet.</div>`;
  } else {
    for (const h of hosts) {
      const { name, meta } = userLabel(h);
      hostRows.appendChild(hostActionRow(name, meta, [
        { label: "Remove", danger: true, payload: { uid: h.uid, action: "remove" }, done: "Host removed." },
      ]));
    }
  }

  hostInviteRows.innerHTML = "";
  for (const inv of hostData.invites || []) {
    hostInviteRows.appendChild(hostActionRow(inv.email, "Pending email invite — becomes a host on first sign-in", [
      { label: "Cancel", payload: { email: inv.email, action: "uninvite" }, done: "Invite cancelled." },
    ]));
  }

  renderHostSearch(hostUids);
}

function renderHostSearch(hostUids) {
  const q = String(hostSearch?.value || "").trim().toLowerCase();
  hostSearchRows.innerHTML = "";
  if (!q) {
    hostSearchRows.innerHTML = `<div class="muted">Type to search everyone who has signed in to the planner.</div>`;
    return;
  }

  const matches = (hostData.users || []).filter((u) => {
    if (hostUids.has(u.uid)) return false;
    const hay = `${u.nickname || ""} ${u.authDisplayName || ""} ${u.email || ""} ${u.uid}`.toLowerCase();
    return hay.includes(q);
  }).slice(0, 12);

  if (!matches.length) {
    hostSearchRows.innerHTML = `<div class="muted">No matches. They may need to sign in to the planner once first — or use an email invite below.</div>`;
    return;
  }

  for (const u of matches) {
    const { name, meta } = userLabel(u);
    hostSearchRows.appendChild(hostActionRow(name, meta, [
      { label: "Make Host", primary: true, payload: { uid: u.uid, action: "approve", displayName: u.nickname || u.authDisplayName || "" }, done: "Host added." },
    ]));
  }
}

hostSearch?.addEventListener("input", () => {
  renderHostsPanel();
});

btnInviteHost?.addEventListener("click", async () => {
  const email = String(hostInviteEmail?.value || "").trim().toLowerCase();
  if (!email || !email.includes("@")) return showHostError("Enter a valid email address.");
  btnInviteHost.disabled = true;
  try {
    await fnManageHost({ email, action: "invite" });
    hostInviteEmail.value = "";
    showHostStatus(`Invited ${email} — they become a host when they sign in with that email.`);
    await loadHosts();
  } catch (e) {
    showHostError(e?.message || String(e));
  } finally {
    btnInviteHost.disabled = false;
  }
});
