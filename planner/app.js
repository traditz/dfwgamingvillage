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
  getAuth, onAuthStateChanged, signOut, signInWithCustomToken
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";
import {
  getFirestore, collection, query, where, orderBy, onSnapshot
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";
import { getFunctions, httpsCallable } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-functions.js";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const functions = getFunctions(app, FUNCTIONS_REGION);

// UI
const elAuthState = document.querySelector("#authState");
const btnDiscordSignIn = document.querySelector("#btnDiscordSignIn");
const btnSignOut = document.querySelector("#btnSignOut");
const adminPanel = document.querySelector("#adminPanel");

const gdTitle = document.querySelector("#gdTitle");
const gdLocation = document.querySelector("#gdLocation");
const gdStartsAt = document.querySelector("#gdStartsAt");
const btnCreateGameday = document.querySelector("#btnCreateGameday");

const elUpcoming = document.querySelector("#gamedaysUpcoming");
const elArchived = document.querySelector("#gamedaysArchived");

let expandedGamedayId = null;
let gamedaysCache = [];
let tablesByGameday = new Map();
let postsByGameday = new Map();

// ---- Helpers ----
function isAdmin() {
  return auth.currentUser && auth.currentUser.uid === OWNER_UID;
}

function tsToMs(ts) {
  if (!ts) return 0;
  if (typeof ts.toMillis === "function") return ts.toMillis();
  if (typeof ts.seconds === "number") return ts.seconds * 1000;
  if (typeof ts === "string") return new Date(ts).getTime();
  return 0;
}

function fmtDate(ms) {
  if (!ms) return "";
  return new Date(ms).toLocaleString();
}

function escapeHtml(s) {
  return String(s || "").replace(/[&<>"']/g, (c) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  }[c]));
}

function pill(txt) {
  return `<span class="pill">${escapeHtml(txt)}</span>`;
}

function confirmDanger(msg) {
  return window.confirm(msg);
}

// ---- Discord Login ----
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

  // Exchange with our function to get Firebase custom token
  const r = await fetch(`${DISCORD_AUTH_FUNCTION_URL}?code=${encodeURIComponent(code)}`, { method: "GET" });
  const txt = await r.text();
  if (!r.ok) throw new Error(`discordAuth failed: ${r.status} ${txt}`);

  const data = JSON.parse(txt);
  if (!data.firebaseToken) throw new Error("discordAuth did not return firebaseToken");

  await signInWithCustomToken(auth, data.firebaseToken);

  // Clean URL
  url.searchParams.delete("code");
  url.searchParams.delete("state");
  window.history.replaceState({}, "", url.toString());
}

// ---- Firestore subscriptions ----
function subscribeGamedays() {
  // published only (matches your composite index)
  const qy = query(
    collection(db, "gamedays"),
    where("status", "==", "published"),
    orderBy("startsAt", "asc")
  );

  onSnapshot(qy, (snap) => {
    gamedaysCache = snap.docs.map((d) => {
      const gd = { id: d.id, ...d.data() };
      gd.startsAtMs = tsToMs(gd.startsAt);
      return gd;
    });
    renderAll();
    ensureSubscriptionsForOpenDay();
  }, (err) => {
    elUpcoming.innerHTML = `<div class="muted">Error loading gamedays: ${escapeHtml(err.message)}</div>`;
  });
}

function subscribeTables(gamedayId) {
  const key = `tables:${gamedayId}`;
  if (tablesByGameday.has(key)) return; // already subscribed

  const qy = query(collection(db, "gamedays", gamedayId, "tables"), orderBy("startTime", "asc"));
  const unsub = onSnapshot(qy, (snap) => {
    const tables = snap.docs.map((d) => {
      const t = { id: d.id, ...d.data() };
      t.startTimeMs = tsToMs(t.startTime);
      return t;
    });
    tablesByGameday.set(gamedayId, tables);
    renderAll();
  });

  tablesByGameday.set(key, unsub);
}

function subscribePosts(gamedayId) {
  const key = `posts:${gamedayId}`;
  if (postsByGameday.has(key)) return;

  const qy = query(collection(db, "gamedays", gamedayId, "posts"), orderBy("createdAt", "asc"));
  const unsub = onSnapshot(qy, (snap) => {
    const posts = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    postsByGameday.set(gamedayId, posts);
    renderAll();
  });

  postsByGameday.set(key, unsub);
}

function ensureSubscriptionsForOpenDay() {
  if (!expandedGamedayId) return;
  subscribeTables(expandedGamedayId);
  subscribePosts(expandedGamedayId);
}

// ---- Functions calls ----
const fnCreateGameDay = httpsCallable(functions, "createGameDay");
const fnDeleteGameDay = httpsCallable(functions, "deleteGameDay");
const fnCreateTable = httpsCallable(functions, "createTable");
const fnCreateWantToPlay = httpsCallable(functions, "createWantToPlay");
const fnJoinTable = httpsCallable(functions, "joinTable");
const fnLeaveTable = httpsCallable(functions, "leaveTable");

// ---- BGG helpers (simple first draft UI prompts) ----
async function bggSearch(queryStr) {
  const r = await fetch(`${BGG_SEARCH_URL}?q=${encodeURIComponent(queryStr)}`);
  const t = await r.text();
  if (!r.ok) throw new Error(`BGG search failed: ${t}`);
  return JSON.parse(t).items || [];
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

  // Simple numbered picker
  const lines = items.map((it, i) => `${i + 1}) ${it.name} (${it.minPlayers || "?"}-${it.maxPlayers || "?"}p • ${it.durationMin || "?"}m)`);
  const pick = window.prompt(`Pick a game by number:\n\n${lines.join("\n")}`);
  const idx = Number(pick);
  if (!Number.isFinite(idx) || idx < 1 || idx > items.length) return null;

  const selected = items[idx - 1];
  const full = await bggThing(selected.bggId);
  return full;
}

// ---- Render ----
function renderAll() {
  const now = Date.now();
  const upcoming = gamedaysCache.filter(g => g.startsAtMs >= now).sort((a,b) => a.startsAtMs - b.startsAtMs);
  const archived = gamedaysCache.filter(g => g.startsAtMs < now).sort((a,b) => b.startsAtMs - a.startsAtMs);

  renderGamedaySection(elUpcoming, upcoming, false);
  renderGamedaySection(elArchived, archived, true);
}

function renderGamedaySection(container, days, archived) {
  if (!days.length) {
    container.innerHTML = `<div class="muted">${archived ? "No archived game days yet." : "No upcoming game days yet."}</div>`;
    return;
  }

  container.innerHTML = "";
  for (const gd of days) {
    const card = document.createElement("div");
    card.className = "gamedayCard";

    const isOpen = expandedGamedayId === gd.id;
    const canModify = !archived; // archived section is read-only

    card.innerHTML = `
      <div class="gamedayHeader">
        <div>
          <div class="gamedayTitle">${escapeHtml(gd.title || "Untitled Game Day")}</div>
          <div class="gamedayMeta">${escapeHtml(fmtDate(gd.startsAtMs))}${gd.location ? " • " + escapeHtml(gd.location) : ""}</div>
        </div>
      </div>

      <div class="gamedayActions">
        <button class="btn btnOpen">${isOpen ? "Close" : "Open"}</button>
        ${canModify && isAdmin() ? `<button class="btn danger btnDelete">Delete</button>` : ""}
      </div>

      ${isOpen ? `<div class="gamedayDetails" id="details-${gd.id}"></div>` : ""}
    `;

    card.querySelector(".btnOpen").onclick = () => {
      expandedGamedayId = (expandedGamedayId === gd.id) ? null : gd.id;
      renderAll();
      ensureSubscriptionsForOpenDay();
    };

    const del = card.querySelector(".btnDelete");
    if (del) {
      del.onclick = async () => {
        if (!confirmDanger("Delete this Game Day? This removes all tables, signups, and want-to-play posts.")) return;
        try {
          await fnDeleteGameDay({ gamedayId: gd.id });
          if (expandedGamedayId === gd.id) expandedGamedayId = null;
        } catch (e) {
          alert(`Delete failed: ${e?.message || e}`);
        }
      };
    }

    container.appendChild(card);

    if (isOpen) {
      const details = card.querySelector(`#details-${gd.id}`);
      details.innerHTML = renderGamedayDetailsHtml(gd, archived);

      if (!archived) {
        details.querySelector(".btnHost").onclick = () => hostTableFlow(gd.id);
        details.querySelector(".btnWant").onclick = () => wantToPlayFlow(gd.id);
      }

      // Join/leave buttons (only show on upcoming; archive is read-only)
      if (!archived) {
        details.querySelectorAll("[data-join]").forEach((b) => {
          b.onclick = () => fnJoinTable({ gamedayId: gd.id, tableId: b.getAttribute("data-join") });
        });
        details.querySelectorAll("[data-leave]").forEach((b) => {
          b.onclick = () => fnLeaveTable({ gamedayId: gd.id, tableId: b.getAttribute("data-leave") });
        });
      }
    }
  }
}

function renderGamedayDetailsHtml(gd, archived) {
  const tables = tablesByGameday.get(gd.id) || [];
  const posts = postsByGameday.get(gd.id) || [];

  const myUid = auth.currentUser?.uid || "";

  const actions = archived ? `
    <div class="muted">Archived (read-only)</div>
  ` : `
    <div class="row">
      <button class="btn btnHost">Host a Table</button>
      <button class="btn secondary btnWant">Want to Play</button>
    </div>
  `;

  const tablesHtml = tables.length ? tables.map((t) => {
    const bggUrl = t.bggUrl || "";
    const titleLink = bggUrl
      ? `<a href="${escapeHtml(bggUrl)}" target="_blank" rel="noopener">${escapeHtml(t.gameName || "Unknown Game")}</a>`
      : `${escapeHtml(t.gameName || "Unknown Game")}`;

    const expNames = Array.isArray(t.expansions) ? t.expansions.map(e => e?.name).filter(Boolean) : [];
    const expLine = expNames.length ? expNames.join(", ") : "None";

    const confirmed = Array.isArray(t.confirmedNames) ? t.confirmedNames : [];
    const waitlist = Array.isArray(t.waitlistNames) ? t.waitlistNames : [];

    // Determine if user appears by display name list only (simple draft)
    // Buttons still call Functions which enforce real state.
    const isHost = (t.hostUid && myUid && t.hostUid === myUid);

    return `
      <div class="tableItem">
        ${t.thumbUrl ? `<img class="thumb" src="${escapeHtml(t.thumbUrl)}" alt="">` : `<div class="thumb"></div>`}
        <div class="tableMain">
          <div class="tableTitle">${titleLink}</div>
          <div class="tableMeta">
            🧑 Host: <b>${escapeHtml(t.hostDisplayName || "Unknown")}</b> •
            🕒 Start: <b>${escapeHtml(fmtDate(t.startTimeMs))}</b> •
            🎟 Seats: <b>${escapeHtml(String(t.capacity || 0))}</b>
          </div>
          <div class="pills">
            ${pill(`🧩 Expansions: ${expLine}`)}
            ${pill(`✅ Roster: ${confirmed.join(", ") || "—"}`)}
            ${pill(`⏳ Waitlist: ${waitlist.join(", ") || "—"}`)}
          </div>

          ${archived ? "" : `
            <div class="gamedayActions" style="margin-top:10px;">
              <button class="btn secondary" data-join="${escapeHtml(t.id)}">Join</button>
              <button class="btn secondary" data-leave="${escapeHtml(t.id)}">${isHost ? "Leave (Host = Delete)" : "Leave"}</button>
            </div>
          `}
        </div>
      </div>
    `;
  }).join(`<div class="hr"></div>`) : `<div class="muted">No hosted tables yet.</div>`;

  const wantsHtml = posts.length ? posts.map((p) => {
    const linkTitle = p.bggUrl
      ? `<a href="${escapeHtml(p.bggUrl)}" target="_blank" rel="noopener">${escapeHtml(p.gameName || "Unknown Game")}</a>`
      : `${escapeHtml(p.gameName || "Unknown Game")}`;
    return `
      <div class="tableItem">
        ${p.thumbUrl ? `<img class="thumb" src="${escapeHtml(p.thumbUrl)}" alt="">` : `<div class="thumb"></div>`}
        <div class="tableMain">
          <div class="tableTitle">${linkTitle}</div>
          <div class="tableMeta">Requested by <b>${escapeHtml(p.createdByDisplayName || "Unknown")}</b>${p.notes ? " • " + escapeHtml(p.notes) : ""}</div>
        </div>
      </div>
    `;
  }).join(`<div class="hr"></div>`) : `<div class="muted">No Want to Play posts yet.</div>`;

  return `
    ${actions}
    <div class="hr"></div>
    <h3 style="margin: 0 0 8px 0;">Hosted Tables</h3>
    ${tablesHtml}
    <div class="hr"></div>
    <h3 style="margin: 0 0 8px 0;">Want to Play</h3>
    ${wantsHtml}
  `;
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

    // Expansions optional (simple comma-separated ids; we’ll improve UX later)
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
async function createGamedayFromUI() {
  try {
    const title = gdTitle.value.trim();
    const location = gdLocation.value.trim();
    const startsAt = gdStartsAt.value; // datetime-local -> "YYYY-MM-DDTHH:MM"
    if (!title) return alert("Title required.");
    if (!startsAt) return alert("Start date/time required.");

    const iso = new Date(startsAt).toISOString();
    await fnCreateGameDay({ title, location, startsAt: iso });

    gdTitle.value = "";
    gdLocation.value = "";
    gdStartsAt.value = "";
  } catch (e) {
    alert(`Create failed: ${e?.message || e}`);
  }
}

// ---- Wire up ----
btnDiscordSignIn.onclick = async () => {
  // Simple: redirect to Discord authorize
  window.location.href = buildDiscordAuthorizeUrl();
};

btnSignOut.onclick = async () => {
  await signOut(auth);
};

btnCreateGameday.onclick = createGamedayFromUI;

// ---- Boot ----
(async function boot() {
  try {
    await completeDiscordCallbackIfPresent();
  } catch (e) {
    console.error(e);
    alert(`Sign-in failed.\n${e?.message || e}`);
  }

  onAuthStateChanged(auth, (user) => {
    if (!user) {
      elAuthState.textContent = "Signed out";
      btnDiscordSignIn.style.display = "";
      btnSignOut.style.display = "none";
      adminPanel.style.display = "none";
      elUpcoming.innerHTML = `<div class="muted">Sign in to view game days.</div>`;
      elArchived.innerHTML = "";
      return;
    }

    elAuthState.textContent = `Signed in as ${user.uid}`;
    btnDiscordSignIn.style.display = "none";
    btnSignOut.style.display = "";
    adminPanel.style.display = isAdmin() ? "" : "none";

    subscribeGamedays();
  });
})();
