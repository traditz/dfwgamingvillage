// PATH: planner/app.js
import { firebaseConfig } from "./firebase-config.js";
import {
  OWNER_UID,
  DISCORD_CLIENT_ID,
  DISCORD_REDIRECT_URI,
  DISCORD_AUTH_FUNCTION_URL,
  BGG_SEARCH_URL,
  BGG_THING_URL,
  FUNCTIONS_REGION
} from "./app-config.js";

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
  signOut,
  signInWithCustomToken,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";
import {
  getFirestore,
  collection,
  doc,
  query,
  where,
  orderBy,
  onSnapshot
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";
import { getFunctions, httpsCallable } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-functions.js";

// --- Firebase init ---
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const functions = getFunctions(app, FUNCTIONS_REGION);

// --- Callable functions (Cloud Functions) ---
const fnCreateGameDay = httpsCallable(functions, "createGameDay");
const fnDeleteGameDay = httpsCallable(functions, "deleteGameDay");
const fnCreateTable = httpsCallable(functions, "createTable");
const fnCreateWantToPlay = httpsCallable(functions, "createWantToPlay");
const fnJoinTable = httpsCallable(functions, "joinTable");
const fnLeaveTable = httpsCallable(functions, "leaveTable");

// --- UI ---
const authStatus = document.querySelector("#authStatus");
const btnDiscord = document.querySelector("#btnDiscord");
const btnEmail = document.querySelector("#btnEmail");
const btnSignOut = document.querySelector("#btnSignOut");

const emailCard = document.querySelector("#emailCard");
const emailInput = document.querySelector("#email");
const passwordInput = document.querySelector("#password");
const btnEmailSignIn = document.querySelector("#btnEmailSignIn");
const btnEmailSignUp = document.querySelector("#btnEmailSignUp");
const btnEmailCancel = document.querySelector("#btnEmailCancel");
const emailMsg = document.querySelector("#emailMsg");

const btnCreateGameDay = document.querySelector("#btnCreateGameDay");
const gamedayList = document.querySelector("#gamedayList");

// Right panel (selected Game Day)
const gamedayCard = document.querySelector("#gamedayCard");
const gamedayTitle = document.querySelector("#gamedayTitle");
const gamedayMeta = document.querySelector("#gamedayMeta");
const btnBack = document.querySelector("#btnBack");
const btnHostTable = document.querySelector("#btnHostTable");
const btnWantToPlay = document.querySelector("#btnWantToPlay");
const btnRefresh = document.querySelector("#btnRefresh");

const tablePager = document.querySelector("#tablePager");
const btnPrev = document.querySelector("#btnPrev");
const btnNext = document.querySelector("#btnNext");
const pageInfo = document.querySelector("#pageInfo");
const tablesList = document.querySelector("#tablesList");
const wantsList = document.querySelector("#wantsList");

// Modal
const modal = document.querySelector("#modal");
const modalTitle = document.querySelector("#modalTitle");
const modalBody = document.querySelector("#modalBody");
const btnModalClose = document.querySelector("#btnModalClose");

// --- State ---
let selectedGameDayId = null;
let selectedGameDayDoc = null;

let gamedays = [];
let unsubGamedays = null;
let unsubTables = null;
let unsubWants = null;
const unsubSignupsByTable = new Map();

let tables = [];
let wants = [];
let page = 0;
const PAGE_SIZE = 5;

// --- Helpers ---
function isAdmin() {
  return !!auth.currentUser && auth.currentUser.uid === OWNER_UID;
}

function escapeHtml(s) {
  return String(s ?? "").replace(/[&<>"']/g, (c) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  }[c]));
}

function fmtTimestamp(ts) {
  if (!ts) return "";
  try {
    if (typeof ts.toDate === "function") return ts.toDate().toLocaleString();
    if (typeof ts === "string") return new Date(ts).toLocaleString();
    if (ts instanceof Date) return ts.toLocaleString();
  } catch {}
  return String(ts);
}

function showModal(title, html) {
  modalTitle.textContent = title;
  modalBody.innerHTML = html;
  modal.style.display = "flex";
}
function closeModal() {
  modal.style.display = "none";
  modalBody.innerHTML = "";
}
btnModalClose?.addEventListener("click", closeModal);
modal?.addEventListener("click", (e) => {
  if (e.target === modal) closeModal();
});

// --- Discord OAuth ---
function randomState() {
  const a = new Uint8Array(16);
  crypto.getRandomValues(a);
  return [...a].map((b) => b.toString(16).padStart(2, "0")).join("");
}

function buildDiscordAuthUrl() {
  const state = randomState();
  // localStorage survives refresh + works across a dedicated callback page
  localStorage.setItem("dfwgv_discord_oauth_state", state);

  const params = new URLSearchParams({
    client_id: DISCORD_CLIENT_ID,
    redirect_uri: DISCORD_REDIRECT_URI,
    response_type: "code",
    scope: "identify",
    state
  });
  return `https://discord.com/api/oauth2/authorize?${params.toString()}`;
}

async function completeDiscordCallbackIfPresent() {
  const url = new URL(window.location.href);
  const code = url.searchParams.get("code");
  const returnedState = url.searchParams.get("state");
  if (!code) return; // not a callback

  const expectedState = localStorage.getItem("dfwgv_discord_oauth_state");
  localStorage.removeItem("dfwgv_discord_oauth_state");

  if (!returnedState) throw new Error("Missing ?state from Discord.");
  if (!expectedState || returnedState !== expectedState) {
    throw new Error("OAuth state mismatch. Click “Sign in with Discord” again (single tab) and complete the login flow.");
  }

  const r = await fetch(`${DISCORD_AUTH_FUNCTION_URL}?code=${encodeURIComponent(code)}`);
  const txt = await r.text();
  if (!r.ok) throw new Error(`discordAuth failed: ${r.status} ${txt}`);

  const data = JSON.parse(txt);
  if (!data.firebaseToken) throw new Error("discordAuth did not return firebaseToken");

  await signInWithCustomToken(auth, data.firebaseToken);

  // Clean URL
  url.searchParams.delete("code");
  url.searchParams.delete("state");
  window.history.replaceState({}, "", url.toString());

  // If we're on a dedicated callback page, bounce back to the planner root.
  if (window.location.pathname.includes("/planner/auth/")) {
    window.location.href = "/planner/";
  }
}

// --- BGG helpers ---
async function bggSearch(q) {
  const r = await fetch(`${BGG_SEARCH_URL}?q=${encodeURIComponent(q)}`);
  const t = await r.text();
  if (!r.ok) throw new Error(`BGG search failed: ${t}`);
  return (JSON.parse(t).items || []);
}

async function bggThing(id) {
  const r = await fetch(`${BGG_THING_URL}?id=${encodeURIComponent(id)}`);
  const t = await r.text();
  if (!r.ok) throw new Error(`BGG thing failed: ${t}`);
  return JSON.parse(t);
}

async function promptPickBGGThing() {
  const q = window.prompt("Search BoardGameGeek (enter game name):");
  if (!q) return null;

  const items = await bggSearch(q);
  if (!items.length) {
    window.alert("No results found.");
    return null;
  }

  const lines = items.slice(0, 15).map((it, i) => `${i + 1}) ${it.name} (id=${it.bggId})`);
  const pick = window.prompt(`Pick a game by number:\n\n${lines.join("\n")}`);
  if (!pick) return null;
  const idx = Number(pick) - 1;
  if (Number.isNaN(idx) || idx < 0 || idx >= Math.min(items.length, 15)) {
    window.alert("Invalid selection.");
    return null;
  }

  return await bggThing(items[idx].bggId);
}

// --- Rendering: left list ---
function renderGameDayList() {
  gamedayList.innerHTML = gamedays.map((gd) => {
    const starts = fmtTimestamp(gd.startsAt);
    const loc = gd.location ? ` • ${escapeHtml(gd.location)}` : "";
    return `
      <div class="listitem ${gd.id === selectedGameDayId ? "selected" : ""}" data-gameday="${gd.id}">
        <div class="li-main">
          <div class="li-title">${escapeHtml(gd.title || "Game Day")}</div>
          <div class="muted">${escapeHtml(starts)}${loc}</div>
        </div>
        <div class="li-actions">
          <button class="btn" data-open="${gd.id}">Open</button>
          ${isAdmin() ? `<button class="btn" data-del="${gd.id}">Delete</button>` : ""}
        </div>
      </div>
    `;
  }).join("");

  gamedayList.querySelectorAll("[data-open]").forEach((b) => {
    b.onclick = () => openGameDay(b.getAttribute("data-open"));
  });
  gamedayList.querySelectorAll("[data-del]").forEach((b) => {
    b.onclick = async () => {
      const id = b.getAttribute("data-del");
      if (!confirm("Delete this Game Day? This cannot be undone.")) return;
      await fnDeleteGameDay({ gamedayId: id });
    };
  });
}

// --- Rendering: right panel ---
function renderSelectedMeta() {
  if (!selectedGameDayDoc) return;
  const gd = selectedGameDayDoc;
  const parts = [
    gd.startsAt ? `🕒 ${escapeHtml(fmtTimestamp(gd.startsAt))}` : "",
    gd.location ? `📍 ${escapeHtml(gd.location)}` : "",
    gd.status ? `🏷 ${escapeHtml(gd.status)}` : ""
  ].filter(Boolean);

  gamedayTitle.textContent = gd.title || "Game Day";
  gamedayMeta.innerHTML = parts.map((p) => `<div>${p}</div>`).join("");
}

function renderWants() {
  wantsList.innerHTML = wants.map((w) => {
    const who = w.createdByDisplayName ? ` • ${escapeHtml(w.createdByDisplayName)}` : "";
    const note = w.notes ? `<div class="muted">${escapeHtml(w.notes)}</div>` : "";
    return `
      <div class="listitem">
        <div class="li-main">
          <div class="li-title">${escapeHtml(w.gameName || "Want to Play")}${who}</div>
          ${note}
        </div>
      </div>
    `;
  }).join("");
}

function renderTablesPage() {
  const start = page * PAGE_SIZE;
  const slice = tables.slice(start, start + PAGE_SIZE);

  if (tables.length > PAGE_SIZE) {
    tablePager.style.display = "flex";
    pageInfo.textContent = `Page ${page + 1} / ${Math.ceil(tables.length / PAGE_SIZE)}`;
  } else {
    tablePager.style.display = "none";
    pageInfo.textContent = "";
  }

  btnPrev.disabled = page <= 0;
  btnNext.disabled = start + PAGE_SIZE >= tables.length;

  tablesList.innerHTML = slice.map((t) => {
    const startTime = fmtTimestamp(t.startTime);
    const cap = t.capacity ? Number(t.capacity) : 0;
    const confirmed = Number(t.confirmedCount || 0);
    const wait = Number(t.waitlistCount || 0);

    const exp = (t.expansions && t.expansions.length)
      ? `<div class="muted">Expansions: ${t.expansions.map((e) => escapeHtml(e.name)).join(", ")}</div>`
      : "";

    const note = t.notes ? `<div class="muted">${escapeHtml(t.notes)}</div>` : "";

    const joinBtn = auth.currentUser ? `<button class="btn btn-primary" data-join="${t.id}">Join</button>` : "";
    const leaveBtn = auth.currentUser ? `<button class="btn" data-leave="${t.id}">Leave</button>` : "";

    return `
      <div class="table">
        <div class="tableHead">
          <div>
            <div class="tableTitle">${escapeHtml(t.gameName || "Table")}</div>
            <div class="muted">${escapeHtml(startTime)} • Seats: ${confirmed}/${cap || "?"} • Wait: ${wait}</div>
            ${exp}
            ${note}
          </div>
          <div class="tableBtns">
            ${joinBtn}
            ${leaveBtn}
          </div>
        </div>
        <div class="rosters" id="roster-${escapeHtml(t.id)}">
          <div class="muted">Loading roster…</div>
        </div>
      </div>
    `;
  }).join("");

  tablesList.querySelectorAll("[data-join]").forEach((b) => {
    b.onclick = async () => {
      const tableId = b.getAttribute("data-join");
      await fnJoinTable({ gamedayId: selectedGameDayId, tableId });
    };
  });
  tablesList.querySelectorAll("[data-leave]").forEach((b) => {
    b.onclick = async () => {
      const tableId = b.getAttribute("data-leave");
      await fnLeaveTable({ gamedayId: selectedGameDayId, tableId });
    };
  });
}

function renderRoster(tableId, signups) {
  const el = document.querySelector(`#roster-${CSS.escape(tableId)}`);
  if (!el) return;

  const confirmed = signups.filter((s) => s.status === "confirmed");
  const wait = signups.filter((s) => s.status === "waitlist");

  const fmtNames = (arr) => arr.length ? arr.map((s) => escapeHtml(s.displayName || s.uid)).join(", ") : "—";

  el.innerHTML = `
    <div><strong>Confirmed:</strong> ${fmtNames(confirmed)}</div>
    <div><strong>Waitlist:</strong> ${fmtNames(wait)}</div>
  `;
}

// --- Subscriptions ---
function unsubscribeSelected() {
  if (unsubTables) unsubTables();
  if (unsubWants) unsubWants();
  unsubTables = null;
  unsubWants = null;

  for (const u of unsubSignupsByTable.values()) {
    try { u(); } catch {}
  }
  unsubSignupsByTable.clear();

  tables = [];
  wants = [];
  page = 0;
}

function subscribeSelected(gamedayId) {
  unsubscribeSelected();

  const tablesQ = query(collection(db, `gamedays/${gamedayId}/tables`), orderBy("startTime", "asc"));
  unsubTables = onSnapshot(tablesQ, (snap) => {
    tables = snap.docs.map((d) => ({ id: d.id, ...d.data() }));

    renderTablesPage();

    const visibleIds = new Set(tables.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE).map((t) => t.id));

    for (const [tableId, unsub] of [...unsubSignupsByTable.entries()]) {
      if (!visibleIds.has(tableId)) {
        try { unsub(); } catch {}
        unsubSignupsByTable.delete(tableId);
      }
    }

    for (const tableId of visibleIds) {
      if (unsubSignupsByTable.has(tableId)) continue;
      const signupsQ = query(
        collection(db, `gamedays/${gamedayId}/tables/${tableId}/signups`),
        orderBy("joinedAt", "asc")
      );
      const unsub = onSnapshot(signupsQ, (s) => {
        const signups = s.docs.map((d) => d.data());
        renderRoster(tableId, signups);
      }, (err) => {
        const el = document.querySelector(`#roster-${CSS.escape(tableId)}`);
        if (el) el.innerHTML = `<div class="muted">Roster unavailable (${escapeHtml(err.message)})</div>`;
      });
      unsubSignupsByTable.set(tableId, unsub);
    }
  }, (err) => {
    tablesList.innerHTML = `<div class="muted">Failed to load tables: ${escapeHtml(err.message)}</div>`;
  });

  const wantsQ = query(collection(db, `gamedays/${gamedayId}/posts`), orderBy("createdAt", "desc"));
  unsubWants = onSnapshot(wantsQ, (snap) => {
    wants = snap.docs.map((d) => ({ id: d.id, ...d.data() }))
      .filter((p) => p.kind === "want_to_play");
    renderWants();
  }, (err) => {
    wantsList.innerHTML = `<div class="muted">Failed to load wants: ${escapeHtml(err.message)}</div>`;
  });
}

async function openGameDay(id) {
  selectedGameDayId = id;
  page = 0;
  gamedayCard.style.display = "block";

  const gdRef = doc(db, "gamedays", id);
  if (window.__unsubGdDoc) { try { window.__unsubGdDoc(); } catch {} }
  window.__unsubGdDoc = onSnapshot(gdRef, (d) => {
    selectedGameDayDoc = d.exists() ? { id: d.id, ...d.data() } : null;
    if (!selectedGameDayDoc) return;
    renderSelectedMeta();
    renderGameDayList();
  });

  subscribeSelected(id);
}

function closeGameDay() {
  selectedGameDayId = null;
  selectedGameDayDoc = null;
  gamedayCard.style.display = "none";
  unsubscribeSelected();
  renderGameDayList();
}

// --- Flows ---
async function hostTableFlow(gamedayId) {
  try {
    const thing = await promptPickBGGThing();
    if (!thing) return;

    const start = window.prompt("Start time (YYYY-MM-DD HH:MM) e.g. 2026-01-05 14:00");
    if (!start) return;
    const startIso = new Date(start.replace(" ", "T")).toISOString();

    const capStr = window.prompt("Seat count (capacity). Leave blank to use game max players.");
    const capacity = capStr ? Number(capStr) : 0;

    let expansionIds = [];
    if (thing.expansions && thing.expansions.length) {
      const wantExp = window.confirm("Add expansions? (OK = yes, Cancel = skip)");
      if (wantExp) {
        const expLines = thing.expansions.slice(0, 20).map((e, i) => `${i + 1}) ${e.name} (id=${e.bggId})`);
        const pick = window.prompt(`Enter expansion ids separated by commas (or blank to skip):\n\n${expLines.join("\n")}`);
        if (pick) expansionIds = pick.split(",").map((s) => s.trim()).filter(Boolean);
      }
    }

    const notes = window.prompt("Notes (optional):") || "";

    await fnCreateTable({
      gamedayId,
      bggId: String(thing.bggId),
      gameName: thing.name,
      thumbUrl: thing.thumbUrl || "",
      startTime: startIso,
      capacity,
      notes,
      expansionIds
    });
  } catch (e) {
    alert(e?.message || String(e));
  }
}

async function wantToPlayFlow(gamedayId) {
  try {
    const thing = await promptPickBGGThing();
    if (!thing) return;
    const notes = window.prompt("Notes (optional):") || "";
    await fnCreateWantToPlay({
      gamedayId,
      bggId: String(thing.bggId),
      gameName: thing.name,
      thumbUrl: thing.thumbUrl || "",
      notes
    });
  } catch (e) {
    alert(e?.message || String(e));
  }
}

async function createGameDayFlow() {
  try {
    const title = window.prompt("Game Day title:");
    if (!title) return;
    const starts = window.prompt("Start date/time (YYYY-MM-DD HH:MM) e.g. 2026-01-05 10:00");
    if (!starts) return;
    const startsIso = new Date(starts.replace(" ", "T")).toISOString();
    const location = window.prompt("Location (optional):") || "";
    await fnCreateGameDay({ title, startsAt: startsIso, location });
  } catch (e) {
    alert(e?.message || String(e));
  }
}

// --- Wire UI ---
btnDiscord?.addEventListener("click", () => {
  window.location.href = buildDiscordAuthUrl();
});

btnEmail?.addEventListener("click", () => {
  emailCard.style.display = "block";
  emailMsg.textContent = "";
});

btnEmailCancel?.addEventListener("click", () => {
  emailCard.style.display = "none";
  emailMsg.textContent = "";
});

btnEmailSignIn?.addEventListener("click", async () => {
  try {
    emailMsg.textContent = "Signing in…";
    await signInWithEmailAndPassword(auth, emailInput.value, passwordInput.value);
    emailCard.style.display = "none";
    emailMsg.textContent = "";
  } catch (e) {
    emailMsg.textContent = e?.message || String(e);
  }
});

btnEmailSignUp?.addEventListener("click", async () => {
  try {
    emailMsg.textContent = "Creating account…";
    await createUserWithEmailAndPassword(auth, emailInput.value, passwordInput.value);
    emailCard.style.display = "none";
    emailMsg.textContent = "";
  } catch (e) {
    emailMsg.textContent = e?.message || String(e);
  }
});

btnSignOut?.addEventListener("click", () => signOut(auth));

btnCreateGameDay?.addEventListener("click", createGameDayFlow);

btnBack?.addEventListener("click", closeGameDay);
btnHostTable?.addEventListener("click", () => selectedGameDayId && hostTableFlow(selectedGameDayId));
btnWantToPlay?.addEventListener("click", () => selectedGameDayId && wantToPlayFlow(selectedGameDayId));
btnRefresh?.addEventListener("click", () => selectedGameDayId && subscribeSelected(selectedGameDayId));

btnPrev?.addEventListener("click", () => {
  if (page <= 0) return;
  page -= 1;
  renderTablesPage();
  subscribeSelected(selectedGameDayId);
});
btnNext?.addEventListener("click", () => {
  if ((page + 1) * PAGE_SIZE >= tables.length) return;
  page += 1;
  renderTablesPage();
  subscribeSelected(selectedGameDayId);
});

// --- Auth + boot ---
function setAuthedUi(user) {
  if (!user) {
    authStatus.textContent = "Not signed in";
    btnDiscord.style.display = "inline-flex";
    btnEmail.style.display = "inline-flex";
    btnSignOut.style.display = "none";
    btnCreateGameDay.style.display = "none";
    return;
  }
  authStatus.textContent = `Signed in: ${user.uid}`;
  btnDiscord.style.display = "none";
  btnEmail.style.display = "none";
  btnSignOut.style.display = "inline-flex";
  btnCreateGameDay.style.display = isAdmin() ? "inline-flex" : "none";
}

function subscribeGameDays() {
  if (unsubGamedays) unsubGamedays();

  const qDays = query(
    collection(db, "gamedays"),
    where("status", "==", "published"),
    orderBy("startsAt", "asc")
  );

  unsubGamedays = onSnapshot(qDays, (snap) => {
    gamedays = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    renderGameDayList();
  }, (err) => {
    gamedayList.innerHTML = `<div class="muted">Failed to load Game Days: ${escapeHtml(err.message)}</div>`;
  });
}

async function boot() {
  try {
    await completeDiscordCallbackIfPresent();
  } catch (e) {
    authStatus.textContent = `Discord Sign-in failed. ${e?.message || e}`;
    console.error(e);
  }

  onAuthStateChanged(auth, (user) => {
    setAuthedUi(user);
  });

  subscribeGameDays();
}

boot();
