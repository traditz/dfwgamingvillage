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

// Firebase CDN modular imports
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

// ---- Firebase init ----
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const functions = getFunctions(app, FUNCTIONS_REGION);

// ---- Callable functions ----
const fnCreateGameDay = httpsCallable(functions, "createGameDay");
const fnDeleteGameDay = httpsCallable(functions, "deleteGameDay");
const fnCreateTable = httpsCallable(functions, "createTable");
const fnCreateWantToPlay = httpsCallable(functions, "createWantToPlay");
const fnJoinTable = httpsCallable(functions, "joinTable");
const fnLeaveTable = httpsCallable(functions, "leaveTable");

// ---- UI elements (MATCHES planner/index.html) ----
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

// NOTE: you still have these in HTML but we do inline-open now; we’ll keep them unused for now:
const gamedayCard = document.querySelector("#gamedayCard"); // hidden card
const btnBack = document.querySelector("#btnBack"); // unused in inline mode

// ---- State ----
let gamedays = [];               // published gamedays from Firestore
let expandedId = null;           // currently open gameday id
let tablesByDay = new Map();     // gamedayId -> tables[]
let wantsByDay = new Map();      // gamedayId -> wants[]
let unsubs = new Map();          // "tables:<id>" -> unsubscribe, "posts:<id>" -> unsubscribe

// ---- Helpers ----
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

function bggGameUrl(id) {
  const n = Number(id);
  return Number.isFinite(n) && n > 0 ? `https://boardgamegeek.com/boardgame/${n}` : "";
}

function isPast(ms) {
  return ms > 0 && ms < Date.now();
}

// ---- Discord OAuth ----
function buildDiscordAuthorizeUrl() {
  const params = new URLSearchParams({
    client_id: DISCORD_CLIENT_ID,
    redirect_uri: DISCORD_REDIRECT_URI,
    response_type: "code",
    scope: "identify"
  });
  return `https://discord.com/api/oauth2/authorize?${params.toString()}`;
}

async function completeDiscordCallbackIfPresent() {
  const url = new URL(window.location.href);
  const code = url.searchParams.get("code");
  if (!code) return;

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

// ---- BGG helpers ----
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

  const selected = items[idx - 1];
  return await bggThing(selected.bggId);
}

// ---- Firestore subscriptions ----
function unsubscribeDay(gamedayId) {
  const tkey = `tables:${gamedayId}`;
  const pkey = `posts:${gamedayId}`;
  if (unsubs.has(tkey)) {
    try { unsubs.get(tkey)(); } catch {}
    unsubs.delete(tkey);
  }
  if (unsubs.has(pkey)) {
    try { unsubs.get(pkey)(); } catch {}
    unsubs.delete(pkey);
  }
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
      const posts = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      wantsByDay.set(gamedayId, posts);
      render();
    });
    unsubs.set(pkey, unsubPosts);
  }
}

function subscribeGamedays() {
  // If your rules only allow signed-in users, we only subscribe after auth.
  // NOTE: This query is "published only". We’ll archive client-side by date.
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

    // If currently expanded day disappeared (deleted), close it.
    if (expandedId && !gamedays.find(g => g.id === expandedId)) {
      expandedId = null;
    }

    render();
    if (expandedId) ensureDaySubscriptions(expandedId);
  }, (err) => {
    gamedayList.innerHTML = `<div class="muted">Error loading gamedays: ${escapeHtml(err.message)}</div>`;
  });
}

// ---- Rendering (inline open under clicked day) ----
function render() {
  const now = Date.now();
  const upcoming = gamedays.filter(g => !isPast(g.startsAtMs)).sort((a,b) => a.startsAtMs - b.startsAtMs);
  const archived = gamedays.filter(g => isPast(g.startsAtMs)).sort((a,b) => b.startsAtMs - a.startsAtMs);

  // We render both sections in one list to keep your single list element.
  const parts = [];

  parts.push(`<div class="muted" style="margin-bottom:10px;">Click a Game Day to open its planner.</div>`);

  parts.push(`<div class="sectionTitle">📅 Upcoming</div>`);
  parts.push(renderDayCards(upcoming, false));

  parts.push(`<div class="sectionTitle" style="margin-top:16px;">🗃️ Archive</div>`);
  parts.push(`<div class="muted">Read-only history of past game days.</div>`);
  parts.push(renderDayCards(archived, true));

  gamedayList.innerHTML = parts.join("\n");

  // Wire buttons after HTML insertion
  wireDayCardButtons();
}

function renderDayCards(days, archived) {
  if (!days.length) {
    return `<div class="muted" style="margin:10px 0;">${archived ? "No archived game days yet." : "No upcoming game days yet."}</div>`;
  }

  return days.map((gd) => {
    const open = expandedId === gd.id;
    const canModify = !archived;

    const deleteBtn = (canModify && isAdmin())
      ? `<button class="btn btn-danger btnDelete" data-del="${escapeHtml(gd.id)}">Delete</button>`
      : "";

    return `
      <div class="gamedayRow">
        <div class="gamedayRowHead">
          <div>
            <div class="gamedayRowTitle">${escapeHtml(gd.title || "Untitled Game Day")}</div>
            <div class="muted">${escapeHtml(fmtDateTime(gd.startsAtMs))}${gd.location ? " • " + escapeHtml(gd.location) : ""}</div>
          </div>

          <div class="gamedayRowBtns">
            <button class="btn btnOpen" data-open="${escapeHtml(gd.id)}">${open ? "Close" : "Open"}</button>
            ${deleteBtn}
          </div>
        </div>

        ${open ? `<div class="gamedayRowBody" id="open-${escapeHtml(gd.id)}">${renderOpenPlanner(gd, archived)}</div>` : ""}
      </div>
    `;
  }).join("\n");
}

function renderOpenPlanner(gd, archived) {
  const tables = tablesByDay.get(gd.id) || [];
  const wants = wantsByDay.get(gd.id) || [];
  const myUid = auth.currentUser?.uid || "";

  const actions = archived ? `
    <div class="muted">Archived (read-only)</div>
  ` : `
    <div class="actions" style="margin: 10px 0;">
      <button class="btn btn-primary btnHost" data-host="${escapeHtml(gd.id)}">➕ Host a Table</button>
      <button class="btn btn-primary btnWant" data-want="${escapeHtml(gd.id)}">🙋 Want to Play</button>
      <button class="btn btn-secondary btnRefresh" data-refresh="${escapeHtml(gd.id)}">🔄 Refresh</button>
    </div>
  `;

  const tablesHtml = tables.length ? tables.map((t) => {
    const title = escapeHtml(t.gameName || "Unknown Game");
    const link = t.bggUrl ? `<a href="${escapeHtml(t.bggUrl)}" target="_blank" rel="noopener">${title}</a>` : title;

    const exps = Array.isArray(t.expansions) ? t.expansions.map(e => e?.name).filter(Boolean) : [];
    const expLine = exps.length ? escapeHtml(exps.join(", ")) : "None";

    const confirmed = Array.isArray(t.confirmedNames) ? t.confirmedNames : [];
    const waitlist = Array.isArray(t.waitlistNames) ? t.waitlistNames : [];

    const isHost = (t.hostUid && myUid && t.hostUid === myUid);

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
            <span class="pill">🧩 Expansions: ${expLine}</span>
            <span class="pill">✅ Roster: ${escapeHtml(confirmed.join(", ") || "—")}</span>
            <span class="pill">⏳ Waitlist: ${escapeHtml(waitlist.join(", ") || "—")}</span>
          </div>

          ${archived ? "" : `
            <div class="gamedayActions" style="margin-top:10px;">
              <button class="btn" data-join="${escapeHtml(gd.id)}:${escapeHtml(t.id)}">Join</button>
              <button class="btn" data-leave="${escapeHtml(gd.id)}:${escapeHtml(t.id)}">${isHost ? "Leave (Host = Delete)" : "Leave"}</button>
            </div>
          `}
        </div>
      </div>
    `;
  }).join(`<div class="hr"></div>`) : `<div class="muted">No hosted tables yet.</div>`;

  const wantsHtml = wants.length ? wants.map((p) => {
    const title = escapeHtml(p.gameName || "Unknown Game");
    const link = p.bggUrl ? `<a href="${escapeHtml(p.bggUrl)}" target="_blank" rel="noopener">${title}</a>` : title;

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

function wireDayCardButtons() {
  // Open/close
  document.querySelectorAll("[data-open]").forEach((btn) => {
    btn.onclick = () => {
      const id = btn.getAttribute("data-open");
      expandedId = (expandedId === id) ? null : id;

      // unsubscribe previous open day (optional; keeps costs lower)
      // If you want to keep multiple open, remove this block.
      for (const g of gamedays) {
        if (g.id !== expandedId) unsubscribeDay(g.id);
      }

      render();
      if (expandedId) ensureDaySubscriptions(expandedId);
    };
  });

  // Admin delete
  document.querySelectorAll("[data-del]").forEach((btn) => {
    btn.onclick = async () => {
      const id = btn.getAttribute("data-del");
      if (!confirm("Delete this Game Day? This removes all tables, signups, and want-to-play posts.")) return;
      try {
        await fnDeleteGameDay({ gamedayId: id });
        if (expandedId === id) expandedId = null;
      } catch (e) {
        alert(`Delete failed: ${e?.message || e}`);
      }
    };
  });

  // Host table / want to play
  document.querySelectorAll("[data-host]").forEach((btn) => {
    btn.onclick = () => hostTableFlow(btn.getAttribute("data-host"));
  });
  document.querySelectorAll("[data-want]").forEach((btn) => {
    btn.onclick = () => wantToPlayFlow(btn.getAttribute("data-want"));
  });

  // Join/Leave
  document.querySelectorAll("[data-join]").forEach((btn) => {
    btn.onclick = async () => {
      const [gamedayId, tableId] = btn.getAttribute("data-join").split(":");
      try {
        await fnJoinTable({ gamedayId, tableId });
      } catch (e) {
        alert(`Join failed: ${e?.message || e}`);
      }
    };
  });
  document.querySelectorAll("[data-leave]").forEach((btn) => {
    btn.onclick = async () => {
      const [gamedayId, tableId] = btn.getAttribute("data-leave").split(":");
      try {
        await fnLeaveTable({ gamedayId, tableId });
      } catch (e) {
        alert(`Leave failed: ${e?.message || e}`);
      }
    };
  });

  // Refresh just forces a re-render; snapshots will update naturally
  document.querySelectorAll("[data-refresh]").forEach((btn) => {
    btn.onclick = () => render();
  });
}

// ---- Flows ----
async function hostTableFlow(gamedayId) {
  try {
    const thing = await promptPickBGGThing();
    if (!thing) return;

    const start = window.prompt("Start time (YYYY-MM-DD HH:MM) e.g. 2025-12-28 14:00");
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

// ---- Admin create gameday ----
// Your current HTML doesn’t have input fields for create-gameday yet.
// We'll use prompts so the button works in this first draft.
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

// ---- Email sign-in UI ----
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

// ---- Auth buttons ----
btnDiscord.onclick = () => {
  window.location.href = buildDiscordAuthorizeUrl();
};

btnSignOut.onclick = async () => {
  await signOut(auth);
};

// ---- Boot ----
(async function boot() {
  // Hide the legacy gamedayCard panel (we use inline open now)
  if (gamedayCard) gamedayCard.style.display = "none";
  if (btnBack) btnBack.style.display = "none";

  // Admin-only create button visibility will be set by auth state.
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

    authStatus.textContent = `Signed in`;
    btnDiscord.style.display = "none";
    btnEmail.style.display = "none";
    btnSignOut.style.display = "";
    btnCreateGameDay.style.display = isAdmin() ? "" : "none";

    subscribeGamedays();
  });
})();
