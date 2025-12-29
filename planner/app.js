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

// --- Callable functions ---
const fnCreateGameDay = httpsCallable(functions, "createGameDay");
const fnDeleteGameDay = httpsCallable(functions, "deleteGameDay");
const fnCreateTable = httpsCallable(functions, "createTable");
const fnCreateWantToPlay = httpsCallable(functions, "createWantToPlay");
const fnJoinTable = httpsCallable(functions, "joinTable");
const fnLeaveTable = httpsCallable(functions, "leaveTable");

// --- UI (matches your index.html) ---
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

// --- State ---
let gamedays = [];
let expandedId = null;
let tablesByDay = new Map();
let wantsByDay = new Map();
let unsubs = new Map();

// --- Helpers ---
function isAdmin() {
  return !!auth.currentUser && auth.currentUser.uid === OWNER_UID;
}
function escapeHtml(s) {
  return String(s || "").replace(/[&<>"']/g, (c) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  }[c]));
}
function tsToMs(ts) {
  if (!ts) return 0;
  if (typeof ts.toMillis === "function") return ts.toMillis();
  if (typeof ts.seconds === "number") return ts.seconds * 1000;
  return new Date(ts).getTime();
}
function fmtDateTime(ms) {
  if (!ms) return "";
  return new Date(ms).toLocaleString();
}
function isPast(ms) {
  return ms > 0 && ms < Date.now();
}

// --- Discord OAuth state handling ---
function randomState() {
  const buf = new Uint8Array(16);
  crypto.getRandomValues(buf);
  return Array.from(buf).map(b => b.toString(16).padStart(2, "0")).join("");
}

function buildDiscordAuthorizeUrl() {
  const state = randomState();
  sessionStorage.setItem("dfwgv_discord_oauth_state", state);

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

  const expectedState = sessionStorage.getItem("dfwgv_discord_oauth_state");
  sessionStorage.removeItem("dfwgv_discord_oauth_state");

  if (!returnedState) throw new Error("Missing ?state from Discord.");
  if (!expectedState || returnedState !== expectedState) throw new Error("OAuth state mismatch. Try signing in again.");

  const r = await fetch(`${DISCORD_AUTH_FUNCTION_URL}?code=${encodeURIComponent(code)}`);
  const txt = await r.text();
  if (!r.ok) throw new Error(`discordAuth failed: ${r.status} ${txt}`);

  const data = JSON.parse(txt);
  if (!data.firebaseToken) throw new Error("discordAuth did not return firebaseToken");

  await signInWithCustomToken(auth, data.firebaseToken);

  url.searchParams.delete("code");
  url.searchParams.delete("state");
  window.history.replaceState({}, "", url.toString());
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
  return JSON.parse(t).thing;
}
async function promptPickBGGThing() {
  const q = window.prompt("Search BoardGameGeek (example: catan)");
  if (!q) return null;

  const items = await bggSearch(q);
  if (!items.length) {
    alert("No results.");
    return null;
  }

  const lines = items.map(
    (it, i) => `${i + 1}) ${it.name} (${it.minPlayers || "?"}-${it.maxPlayers || "?"}p • ${it.durationMin || "?"}m)`
  );

  const pick = window.prompt(`Pick a game by number:\n\n${lines.join("\n")}`);
  const idx = Number(pick);
  if (!Number.isFinite(idx) || idx < 1 || idx > items.length) return null;

  return await bggThing(items[idx - 1].bggId);
}

// --- Firestore subscriptions ---
function unsubscribeDay(gamedayId) {
  const tkey = `tables:${gamedayId}`;
  const pkey = `posts:${gamedayId}`;
  if (unsubs.has(tkey)) { try { unsubs.get(tkey)(); } catch {} unsubs.delete(tkey); }
  if (unsubs.has(pkey)) { try { unsubs.get(pkey)(); } catch {} unsubs.delete(pkey); }
  tablesByDay.delete(gamedayId);
  wantsByDay.delete(gamedayId);
}

function ensureDaySubscriptions(gamedayId) {
  if (!gamedayId) return;

  const tkey = `tables:${gamedayId}`;
  if (!unsubs.has(tkey)) {
    const tq = query(collection(db, "gamedays", gamedayId, "tables"), orderBy("startTime", "asc"));
    const unsubTables = onSnapshot(tq, (snap) => {
      const tables = snap.docs.map((d) => {
        const t = { id: d.id, ...d.data() };
        t.startTimeMs = tsToMs(t.startTime);
        return t;
      });
      tablesByDay.set(gamedayId, tables);
      render();
    });
    unsubs.set(tkey, unsubTables);
  }

  const pkey = `posts:${gamedayId}`;
  if (!unsubs.has(pkey)) {
    const pq = query(collection(db, "gamedays", gamedayId, "posts"), orderBy("createdAt", "asc"));
    const unsubPosts = onSnapshot(pq, (snap) => {
      wantsByDay.set(gamedayId, snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      render();
    });
    unsubs.set(pkey, unsubPosts);
  }
}

function subscribeGamedays() {
  const qy = query(
    collection(db, "gamedays"),
    where("status", "==", "published"),
    orderBy("startsAt", "asc")
  );

  onSnapshot(qy, (snap) => {
    gamedays = snap.docs.map((d) => {
      const gd = { id: d.id, ...d.data() };
      gd.startsAtMs = tsToMs(gd.startsAt);
      return gd;
    });

    if (expandedId && !gamedays.find(g => g.id === expandedId)) expandedId = null;
    render();
    if (expandedId) ensureDaySubscriptions(expandedId);
  }, (err) => {
    gamedayList.innerHTML = `<div class="muted">Error loading gamedays: ${escapeHtml(err.message)}</div>`;
  });
}

// --- Rendering (inline open under clicked day) ---
function render() {
  const upcoming = gamedays.filter(g => !isPast(g.startsAtMs));
  const archived = gamedays.filter(g => isPast(g.startsAtMs));

  const parts = [];
  parts.push(`<div class="muted" style="margin-bottom:10px;">Click a Game Day to open its planner.</div>`);

  parts.push(`<div class="muted" style="margin-top:8px;">📅 <b>Upcoming</b></div>`);
  parts.push(renderCards(upcoming, false));

  parts.push(`<div class="muted" style="margin-top:14px;">🗃️ <b>Archive</b> (read-only)</div>`);
  parts.push(renderCards(archived, true));

  gamedayList.innerHTML = parts.join("\n");
  wireButtons();
}

function renderCards(days, archived) {
  if (!days.length) {
    return `<div class="muted" style="margin:10px 0;">${archived ? "No archived game days yet." : "No upcoming game days yet."}</div>`;
  }

  return days.map((gd) => {
    const open = expandedId === gd.id;

    return `
      <div class="gamedayCard">
        <div class="gamedayHeader">
          <div>
            <div class="gamedayTitle">${escapeHtml(gd.title || "Untitled Game Day")}</div>
            <div class="gamedayMeta">${escapeHtml(fmtDateTime(gd.startsAtMs))}${gd.location ? " • " + escapeHtml(gd.location) : ""}</div>
          </div>
        </div>

        <div class="gamedayActions">
          <button class="btn secondary" data-open="${escapeHtml(gd.id)}">${open ? "Close" : "Open"}</button>
          ${(!archived && isAdmin()) ? `<button class="btn danger" data-del="${escapeHtml(gd.id)}">Delete</button>` : ""}
        </div>

        ${open ? `<div class="gamedayDetails">${renderOpen(gd, archived)}</div>` : ""}
      </div>
    `;
  }).join("\n");
}

function renderOpen(gd, archived) {
  const tables = tablesByDay.get(gd.id) || [];
  const wants = wantsByDay.get(gd.id) || [];
  const myUid = auth.currentUser?.uid || "";

  const actions = archived ? `
    <div class="muted">Archived (read-only)</div>
  ` : `
    <div class="row">
      <button class="btn" data-host="${escapeHtml(gd.id)}">➕ Host a Table</button>
      <button class="btn secondary" data-want="${escapeHtml(gd.id)}">🙋 Want to Play</button>
      <button class="btn secondary" data-refresh="${escapeHtml(gd.id)}">🔄 Refresh</button>
    </div>
  `;

  const tablesHtml = tables.length ? tables.map((t) => {
    const link = t.bggUrl
      ? `<a href="${escapeHtml(t.bggUrl)}" target="_blank" rel="noopener">${escapeHtml(t.gameName || "Unknown Game")}</a>`
      : `${escapeHtml(t.gameName || "Unknown Game")}`;

    const exps = Array.isArray(t.expansions) ? t.expansions.map(e => e?.name).filter(Boolean) : [];
    const confirmed = Array.isArray(t.confirmedNames) ? t.confirmedNames : [];
    const waitlist = Array.isArray(t.waitlistNames) ? t.waitlistNames : [];
    const isHost = t.hostUid && myUid && t.hostUid === myUid;

    return `
      <div class="tableItem">
        ${t.thumbUrl ? `<img class="thumb" src="${escapeHtml(t.thumbUrl)}" alt="">` : `<div class="thumb"></div>`}
        <div class="tableMain">
          <div class="tableTitle">${link}</div>
          <div class="tableMeta">
            👤 Host: <b>${escapeHtml(t.hostDisplayName || "Unknown")}</b> •
            🕒 Start: <b>${escapeHtml(fmtDateTime(t.startTimeMs))}</b> •
            🎟 Seats: <b>${escapeHtml(String(t.capacity || 0))}</b>
          </div>
          <div class="pills">
            <span class="pill">🧩 Expansions: ${escapeHtml(exps.join(", ") || "None")}</span>
            <span class="pill">✅ Roster: ${escapeHtml(confirmed.join(", ") || "—")}</span>
            <span class="pill">⏳ Waitlist: ${escapeHtml(waitlist.join(", ") || "—")}</span>
          </div>

          ${archived ? "" : `
            <div class="gamedayActions" style="margin-top:10px;">
              <button class="btn secondary" data-join="${escapeHtml(gd.id)}:${escapeHtml(t.id)}">Join</button>
              <button class="btn secondary" data-leave="${escapeHtml(gd.id)}:${escapeHtml(t.id)}">${isHost ? "Leave (Host = Delete)" : "Leave"}</button>
            </div>
          `}
        </div>
      </div>
    `;
  }).join(`<div class="hr"></div>`) : `<div class="muted">No hosted tables yet.</div>`;

  const wantsHtml = wants.length ? wants.map((p) => {
    const link = p.bggUrl
      ? `<a href="${escapeHtml(p.bggUrl)}" target="_blank" rel="noopener">${escapeHtml(p.gameName || "Unknown Game")}</a>`
      : `${escapeHtml(p.gameName || "Unknown Game")}`;

    return `
      <div class="tableItem">
        ${p.thumbUrl ? `<img class="thumb" src="${escapeHtml(p.thumbUrl)}" alt="">` : `<div class="thumb"></div>`}
        <div class="tableMain">
          <div class="tableTitle">${link}</div>
          <div class="tableMeta">Requested by <b>${escapeHtml(p.createdByDisplayName || "Unknown")}</b>${p.notes ? " • " + escapeHtml(p.notes) : ""}</div>
        </div>
      </div>
    `;
  }).join(`<div class="hr"></div>`) : `<div class="muted">No Want to Play posts yet.</div>`;

  return `
    ${actions}
    <div class="hr"></div>
    <h3>🎲 Hosted Tables</h3>
    ${tablesHtml}
    <div class="hr"></div>
    <h3>🙋 Want to Play</h3>
    ${wantsHtml}
  `;
}

function wireButtons() {
  document.querySelectorAll("[data-open]").forEach((b) => {
    b.onclick = () => {
      const id = b.getAttribute("data-open");
      expandedId = (expandedId === id) ? null : id;
      for (const g of gamedays) if (g.id !== expandedId) unsubscribeDay(g.id);
      render();
      if (expandedId) ensureDaySubscriptions(expandedId);
    };
  });

  document.querySelectorAll("[data-del]").forEach((b) => {
    b.onclick = async () => {
      const id = b.getAttribute("data-del");
      if (!confirm("Delete this Game Day? This removes all tables, signups, and want-to-play posts.")) return;
      await fnDeleteGameDay({ gamedayId: id });
      if (expandedId === id) expandedId = null;
    };
  });

  document.querySelectorAll("[data-host]").forEach((b) => b.onclick = () => hostTableFlow(b.getAttribute("data-host")));
  document.querySelectorAll("[data-want]").forEach((b) => b.onclick = () => wantToPlayFlow(b.getAttribute("data-want")));
  document.querySelectorAll("[data-refresh]").forEach((b) => b.onclick = () => render());

  document.querySelectorAll("[data-join]").forEach((b) => {
    b.onclick = async () => {
      const [gamedayId, tableId] = b.getAttribute("data-join").split(":");
      await fnJoinTable({ gamedayId, tableId });
    };
  });

  document.querySelectorAll("[data-leave]").forEach((b) => {
    b.onclick = async () => {
      const [gamedayId, tableId] = b.getAttribute("data-leave").split(":");
      await fnLeaveTable({ gamedayId, tableId });
    };
  });
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
        const pick = window.prompt(`Enter expansion ids separated by commas (or blank):\n\n${expLines.join("\n")}`);
        if (pick && pick.trim()) {
          expansionIds = pick.split(",").map(s => Number(s.trim())).filter(n => Number.isFinite(n) && n > 0);
        }
      }
    }

    const notes = window.prompt("Notes (optional):") || "";

    await fnCreateTable({
      gamedayId,
      baseThing: thing,
      capacity,
      startTime: startIso,
      notes,
      expansionIds
    });
  } catch (e) {
    alert(`Host table failed: ${e?.message || e}`);
  }
}

async function wantToPlayFlow(gamedayId) {
  try {
    const thing = await promptPickBGGThing();
    if (!thing) return;
    const notes = window.prompt("Notes (optional):") || "";
    await fnCreateWantToPlay({ gamedayId, thing, notes });
  } catch (e) {
    alert(`Want to play failed: ${e?.message || e}`);
  }
}

async function createGamedayPromptFlow() {
  try {
    const title = window.prompt("Game Day title:");
    if (!title) return;
    const location = window.prompt("Location (optional):") || "";
    const startsAtLocal = window.prompt("Start date/time (YYYY-MM-DD HH:MM) e.g. 2026-01-05 18:00");
    if (!startsAtLocal) return;
    const iso = new Date(startsAtLocal.replace(" ", "T")).toISOString();
    await fnCreateGameDay({ title, location, startsAt: iso });
  } catch (e) {
    alert(`Create failed: ${e?.message || e}`);
  }
}

// --- Email sign-in ---
function showEmailCard(show) {
  emailCard.style.display = show ? "" : "none";
  emailMsg.textContent = "";
}
btnEmail.onclick = () => showEmailCard(true);
btnEmailCancel.onclick = () => showEmailCard(false);

btnEmailSignIn.onclick = async () => {
  emailMsg.textContent = "";
  try {
    await signInWithEmailAndPassword(auth, emailInput.value.trim(), passwordInput.value);
    showEmailCard(false);
  } catch (e) {
    emailMsg.textContent = e?.message || String(e);
  }
};

btnEmailSignUp.onclick = async () => {
  emailMsg.textContent = "";
  try {
    await createUserWithEmailAndPassword(auth, emailInput.value.trim(), passwordInput.value);
    showEmailCard(false);
  } catch (e) {
    emailMsg.textContent = e?.message || String(e);
  }
};

// --- Auth buttons ---
btnDiscord.onclick = () => { window.location.href = buildDiscordAuthorizeUrl(); };
btnSignOut.onclick = async () => { await signOut(auth); };

// --- Boot ---
(async function boot() {
  btnCreateGameDay.onclick = createGamedayPromptFlow;

  try {
    await completeDiscordCallbackIfPresent();
  } catch (e) {
    console.error(e);
    alert(`Sign-in failed.\n${e?.message || e}`);
  }

  onAuthStateChanged(auth, (user) => {
    if (!user) {
      authStatus.textContent = "Signed out";
      btnDiscord.style.display = "";
      btnEmail.style.display = "";
      btnSignOut.style.display = "none";
      btnCreateGameDay.style.display = "none";
      gamedayList.innerHTML = `<div class="muted">Sign in to view game days.</div>`;
      return;
    }

    authStatus.textContent = "Signed in";
    btnDiscord.style.display = "none";
    btnEmail.style.display = "none";
    btnSignOut.style.display = "";
    btnCreateGameDay.style.display = isAdmin() ? "" : "none";

    subscribeGamedays();
  });
})();
