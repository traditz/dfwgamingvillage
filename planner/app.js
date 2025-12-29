// PATH: planner/app.js
import { firebaseConfig } from "./firebase-config.js";
import * as appConfig from "./app-config.js";

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
  signOut,
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

// -----------------------------
// Config
// -----------------------------
const {
  FUNCTIONS_REGION,
  DISCORD_CLIENT_ID,
  DISCORD_REDIRECT_URI,
  DISCORD_AUTH_ENDPOINT,
  DISCORD_SCOPES,
  DISCORD_RESPONSE_TYPE,
  DISCORD_PROMPT,
  DISCORD_AUTH_FUNCTION_URL,
  BGG_SEARCH_URL,
  BGG_THING_URL
} = appConfig;

// -----------------------------
// Firebase init
// -----------------------------
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

// -----------------------------
// UI bindings
// -----------------------------
const authStatus = document.querySelector("#authStatus");
const btnDiscord = document.querySelector("#btnDiscord");
const btnEmail = document.querySelector("#btnEmail");
const btnSignOut = document.querySelector("#btnSignOut");

const emailCard = document.querySelector("#emailCard");
const emailMsg = document.querySelector("#emailMsg");
const inputEmail = document.querySelector("#email");
const inputPassword = document.querySelector("#password");
const btnEmailSignIn = document.querySelector("#btnEmailSignIn");
const btnEmailSignUp = document.querySelector("#btnEmailSignUp");
const btnEmailCancel = document.querySelector("#btnEmailCancel");

const btnCreateGameDay = document.querySelector("#btnCreateGameDay");

const gamedayList = document.querySelector("#gamedayList");
const gamedayCard = document.querySelector("#gamedayCard");
const gamedayTitle = document.querySelector("#gamedayTitle");
const gamedayMeta = document.querySelector("#gamedayMeta");
const btnBack = document.querySelector("#btnBack");

const btnHostTable = document.querySelector("#btnHostTable");
const btnWantToPlay = document.querySelector("#btnWantToPlay");
const btnRefresh = document.querySelector("#btnRefresh");

const tablesList = document.querySelector("#tablesList");
const wantsList = document.querySelector("#wantsList");

const tablePager = document.querySelector("#tablePager");
const btnPrev = document.querySelector("#btnPrev");
const btnNext = document.querySelector("#btnNext");
const pageInfo = document.querySelector("#pageInfo");

const modal = document.querySelector("#modal");
const modalTitle = document.querySelector("#modalTitle");
const modalBody = document.querySelector("#modalBody");
const btnModalClose = document.querySelector("#btnModalClose");

// -----------------------------
// State
// -----------------------------
let currentUser = null;
let currentGameDayId = null;

// tables pagination
let currentTables = [];
let currentPage = 0;
const PAGE_SIZE = 8;

// unsubscribe handles
let unsubGameDays = null;
let unsubTables = null;
let unsubPosts = null;

// -----------------------------
// Helpers
// -----------------------------
function esc(s) {
  return String(s ?? "").replace(/[&<>"']/g, (m) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  }[m]));
}

function fmtDate(d) {
  try {
    const dt = d instanceof Date ? d : new Date(d);
    return dt.toLocaleString();
  } catch {
    return String(d || "");
  }
}

function openModal(title, html) {
  modalTitle.textContent = title;
  modalBody.innerHTML = html;
  modal.style.display = "";
}

function closeModal() {
  modal.style.display = "none";
  modalTitle.textContent = "Modal";
  modalBody.innerHTML = "";
}

// -----------------------------
// Discord OAuth (PKCE + state)
// -----------------------------
function base64UrlEncode(bytes) {
  return btoa(String.fromCharCode(...bytes))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

async function sha256(str) {
  const enc = new TextEncoder().encode(str);
  const hash = await crypto.subtle.digest("SHA-256", enc);
  return new Uint8Array(hash);
}

function randomString(len = 48) {
  const bytes = new Uint8Array(len);
  crypto.getRandomValues(bytes);
  return base64UrlEncode(bytes);
}

async function buildDiscordAuthUrl() {
  const state = randomString(32);
  const verifier = randomString(64);
  const challenge = base64UrlEncode(await sha256(verifier));

  sessionStorage.setItem("discord_oauth_state", state);
  sessionStorage.setItem("discord_pkce_verifier", verifier);

  const params = new URLSearchParams({
    client_id: DISCORD_CLIENT_ID,
    redirect_uri: DISCORD_REDIRECT_URI,
    response_type: DISCORD_RESPONSE_TYPE,
    scope: DISCORD_SCOPES,
    state,
    prompt: DISCORD_PROMPT,
    code_challenge: challenge,
    code_challenge_method: "S256"
  });

  return `${DISCORD_AUTH_ENDPOINT}?${params.toString()}`;
}

function getUrlParams() {
  const u = new URL(window.location.href);
  return u.searchParams;
}

function clearUrlParams() {
  const u = new URL(window.location.href);
  u.searchParams.delete("code");
  u.searchParams.delete("state");
  window.history.replaceState({}, "", u.toString());
}

// -----------------------------
// Auth UI
// -----------------------------
function setAuthStatus(text) {
  authStatus.textContent = text;
}

function showEmailCard(show) {
  emailCard.style.display = show ? "" : "none";
  emailMsg.textContent = "";
}

function setButtonsForAuth(user) {
  if (user) {
    btnDiscord.style.display = "none";
    btnEmail.style.display = "none";
    btnSignOut.style.display = "";
    btnCreateGameDay.style.display = "";
  } else {
    btnDiscord.style.display = "";
    btnEmail.style.display = "";
    btnSignOut.style.display = "none";
    btnCreateGameDay.style.display = "none";
  }
}

// -----------------------------
// Discord sign-in flow (custom token from /discordAuth)
// -----------------------------
async function handleDiscordCallbackIfPresent() {
  const params = getUrlParams();
  const code = params.get("code");
  const state = params.get("state");
  if (!code) return;

  const expectedState = sessionStorage.getItem("discord_oauth_state");
  if (!expectedState || expectedState !== state) {
    openModal("Discord Sign-in", `
      <div class="muted">Sign-in failed.</div>
      <div class="muted">State mismatch (blocked for safety). Try signing in again.</div>
    `);
    clearUrlParams();
    return;
  }

  try {
    openModal("Discord Sign-in", `<div class="muted">Signing you in…</div>`);
    const url = `${DISCORD_AUTH_FUNCTION_URL}?code=${encodeURIComponent(code)}`;
    const r = await fetch(url);
    const j = await r.json();
    if (!r.ok) throw new Error(j?.error || `HTTP ${r.status}`);

    const firebaseToken = j.firebaseToken;
    if (!firebaseToken) throw new Error("No firebaseToken returned.");

    const { signInWithCustomToken } = await import("https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js");
    await signInWithCustomToken(auth, firebaseToken);

    closeModal();
  } catch (e) {
    openModal("Discord Sign-in", `
      <div class="muted">Sign-in failed.</div>
      <pre class="muted">${esc(e?.message || e)}</pre>
    `);
  } finally {
    clearUrlParams();
    sessionStorage.removeItem("discord_oauth_state");
    sessionStorage.removeItem("discord_pkce_verifier");
  }
}

// -----------------------------
// BGG proxy helpers
// -----------------------------
async function bggSearch(q) {
  const url = `${BGG_SEARCH_URL}?q=${encodeURIComponent(q)}`;
  const r = await fetch(url);
  const j = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(`BGG search failed: ${JSON.stringify(j)}`);
  return j.items || [];
}

async function bggThing(id) {
  const url = `${BGG_THING_URL}?id=${encodeURIComponent(id)}`;
  const r = await fetch(url);
  const j = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(`BGG thing failed: ${JSON.stringify(j)}`);
  return j;
}

// -----------------------------
// Prompt-based picker (kept for now)
// -----------------------------
async function promptPickBGGThing() {
  const q = window.prompt("Search BoardGameGeek for a game name:");
  if (!q) return null;

  const items = await bggSearch(q);
  if (!items.length) {
    alert("No results.");
    return null;
  }

  const lines = items.slice(0, 10).map((it, i) => `${i + 1}) ${it.name} (id=${it.bggId})`);
  const pick = window.prompt(`Pick a game number:\n\n${lines.join("\n")}\n\nEnter 1-${Math.min(10, items.length)}`);
  if (!pick) return null;

  const idx = Number(pick) - 1;
  if (!Number.isFinite(idx) || idx < 0 || idx >= Math.min(10, items.length)) {
    alert("Invalid selection.");
    return null;
  }

  const chosen = items[idx];
  const full = await bggThing(chosen.bggId);
  const expansions = full.expansions || [];
  return { ...chosen, expansions };
}

// -----------------------------
// Firestore reads
// -----------------------------
function subscribeGameDays() {
  if (unsubGameDays) unsubGameDays();
  const q = query(collection(db, "gamedays"), where("status", "==", "published"), orderBy("startsAt", "asc"));
  unsubGameDays = onSnapshot(q, (snap) => {
    const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    renderGameDays(list);
  });
}

function subscribeGameDayDetails(gamedayId) {
  if (unsubTables) unsubTables();
  if (unsubPosts) unsubPosts();

  const tablesQ = query(collection(db, "gamedays", gamedayId, "tables"), orderBy("startTime", "asc"));
  unsubTables = onSnapshot(tablesQ, (snap) => {
    currentTables = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    currentPage = 0;
    renderTablesPage();
  });

  const postsQ = query(collection(db, "gamedays", gamedayId, "posts"), orderBy("createdAt", "desc"));
  unsubPosts = onSnapshot(postsQ, (snap) => {
    const posts = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    renderWants(posts.filter((p) => p.kind === "want_to_play"));
  });
}

// -----------------------------
// Rendering
// -----------------------------
function renderGameDays(list) {
  gamedayList.innerHTML = "";
  if (!list.length) {
    gamedayList.innerHTML = `<div class="muted">No upcoming game days.</div>`;
    return;
  }
  for (const gd of list) {
    const startsAt = gd.startsAt?.toDate ? gd.startsAt.toDate() : gd.startsAt;
    const el = document.createElement("div");
    el.className = "listitem";
    el.innerHTML = `
      <div class="title">${esc(gd.title || "Game Day")}</div>
      <div class="meta">${esc(fmtDate(startsAt))}${gd.location ? ` • ${esc(gd.location)}` : ""}</div>
    `;
    el.addEventListener("click", () => openGameDay(gd));
    gamedayList.appendChild(el);
  }
}

function renderTablesPage() {
  const total = currentTables.length;
  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  currentPage = Math.max(0, Math.min(currentPage, pages - 1));

  const startIdx = currentPage * PAGE_SIZE;
  const pageItems = currentTables.slice(startIdx, startIdx + PAGE_SIZE);

  if (total > PAGE_SIZE) {
    tablePager.style.display = "";
    pageInfo.textContent = `Page ${currentPage + 1} / ${pages}`;
  } else {
    tablePager.style.display = "none";
  }

  tablesList.innerHTML = "";
  if (!pageItems.length) {
    tablesList.innerHTML = `<div class="muted">No hosted tables yet.</div>`;
    return;
  }

  for (const t of pageItems) {
    const startTime = t.startTime?.toDate ? t.startTime.toDate() : t.startTime;
    const cap = Number(t.capacity || 0);
    const confirmed = Number(t.confirmedCount || 0);
    const wait = Number(t.waitlistCount || 0);

    const canJoin = !!currentUser;
    const bggUrl = t.bggId ? `https://boardgamegeek.com/boardgame/${encodeURIComponent(t.bggId)}` : null;

    const el = document.createElement("div");
    el.className = "tablecard";
    el.innerHTML = `
      <div class="thumb">
        ${t.thumbUrl ? `<img src="${esc(t.thumbUrl)}" alt="" loading="lazy" />` : `<div class="thumbph">🎲</div>`}
      </div>
      <div class="body">
        <div class="row1">
          <div class="name">
            ${bggUrl ? `<a href="${esc(bggUrl)}" target="_blank" rel="noopener">${esc(t.gameName || "Game")}</a>` : esc(t.gameName || "Game")}
          </div>
          <div class="time">${esc(fmtDate(startTime))}</div>
        </div>
        <div class="row2">
          <div class="muted">Host: ${esc(t.hostDisplayName || t.hostUid || "Unknown")}</div>
          <div class="muted">Seats: ${confirmed}/${cap} ${wait ? ` • Waitlist: ${wait}` : ""}</div>
        </div>
        ${t.notes ? `<div class="notes">${esc(t.notes)}</div>` : ""}
        <div class="row3">
          <button class="btn btn-primary" data-action="join" ${canJoin ? "" : "disabled"}>Join</button>
          <button class="btn" data-action="leave" ${canJoin ? "" : "disabled"}>Leave</button>
        </div>
      </div>
    `;

    el.querySelector('[data-action="join"]').addEventListener("click", async (ev) => {
      ev.stopPropagation();
      if (!currentUser) return alert("Please sign in first.");
      try {
        await fnJoinTable({ gamedayId: currentGameDayId, tableId: t.id });
      } catch (e) {
        alert(`Join failed: ${e?.message || e}`);
      }
    });

    el.querySelector('[data-action="leave"]').addEventListener("click", async (ev) => {
      ev.stopPropagation();
      if (!currentUser) return alert("Please sign in first.");
      try {
        await fnLeaveTable({ gamedayId: currentGameDayId, tableId: t.id });
      } catch (e) {
        alert(`Leave failed: ${e?.message || e}`);
      }
    });

    tablesList.appendChild(el);
  }
}

function renderWants(items) {
  wantsList.innerHTML = "";
  if (!items.length) {
    wantsList.innerHTML = `<div class="muted">No “want to play” posts yet.</div>`;
    return;
  }

  for (const p of items) {
    const bggUrl = p.bggId ? `https://boardgamegeek.com/boardgame/${encodeURIComponent(p.bggId)}` : null;
    const el = document.createElement("div");
    el.className = "listitem";
    el.innerHTML = `
      <div class="title">${bggUrl ? `<a href="${esc(bggUrl)}" target="_blank" rel="noopener">${esc(p.gameName || "Game")}</a>` : esc(p.gameName || "Game")}</div>
      <div class="meta">${esc(p.createdByDisplayName || p.createdByUid || "Someone")}${p.notes ? ` • ${esc(p.notes)}` : ""}</div>
    `;
    wantsList.appendChild(el);
  }
}

// -----------------------------
// Flows
// -----------------------------
function showGameDayList() {
  currentGameDayId = null;
  gamedayCard.style.display = "none";
}

function showGameDayCard() {
  gamedayCard.style.display = "";
}

function openGameDay(gd) {
  currentGameDayId = gd.id;
  gamedayTitle.textContent = gd.title || "Game Day";
  const startsAt = gd.startsAt?.toDate ? gd.startsAt.toDate() : gd.startsAt;
  gamedayMeta.innerHTML = `
    <div class="muted">${esc(fmtDate(startsAt))}${gd.location ? ` • ${esc(gd.location)}` : ""}</div>
  `;
  showGameDayCard();
  subscribeGameDayDetails(gd.id);
}

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
        const pick = window.prompt(`Enter expansion indexes separated by commas (e.g. 1,3,5)\n\n${expLines.join("\n")}`);
        if (pick) {
          const chosen = pick
            .split(",")
            .map((s) => Number(s.trim()) - 1)
            .filter((n) => Number.isFinite(n) && n >= 0 && n < Math.min(20, thing.expansions.length));
          expansionIds = chosen.map((i) => String(thing.expansions[i].bggId));
        }
      }
    }

    const notes = window.prompt("Notes (optional):") || "";

    // ✅ FIX: match Cloud Function createTable() contract
    const capFinal = (capacity && Number.isFinite(capacity) && capacity > 0)
      ? capacity
      : (thing.maxPlayers || thing.maxplayers || 0);

    if (!capFinal || capFinal < 1) {
      alert("Capacity is required (and the selected game has no max player count to default to).");
      return;
    }

    await fnCreateTable({
      gamedayId,
      bggId: String(thing.bggId),
      gameName: thing.name,
      thumbUrl: thing.thumbUrl || "",
      startTime: startIso,
      capacity: capFinal,
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

    // ✅ FIX: match Cloud Function createWantToPlay() contract
    await fnCreateWantToPlay({
      gamedayId,
      bggId: String(thing.bggId),
      gameName: thing.name,
      thumbUrl: thing.thumbUrl || "",
      notes
    });
  } catch (e) {
    alert(`Want to play failed: ${e?.message || e}`);
  }
}

async function createGamedayPromptFlow() {
  try {
    const title = window.prompt("Game Day title:");
    if (!title) return;
    const location = window.prompt("Location (optional):") || "";
    const startsAt = window.prompt("Start date/time (YYYY-MM-DD HH:MM) e.g. 2026-01-05 10:00");
    if (!startsAt) return;

    await fnCreateGameDay({
      title,
      location,
      startsAt: new Date(startsAt.replace(" ", "T")).toISOString()
    });
  } catch (e) {
    alert(`Create Game Day failed: ${e?.message || e}`);
  }
}

// -----------------------------
// Email Auth flows
// -----------------------------
async function doEmailSignIn() {
  emailMsg.textContent = "";
  const email = inputEmail.value.trim();
  const pass = inputPassword.value;
  if (!email || !pass) {
    emailMsg.textContent = "Email and password required.";
    return;
  }
  try {
    await signInWithEmailAndPassword(auth, email, pass);
    showEmailCard(false);
  } catch (e) {
    emailMsg.textContent = e?.message || String(e);
  }
}

async function doEmailSignUp() {
  emailMsg.textContent = "";
  const email = inputEmail.value.trim();
  const pass = inputPassword.value;
  if (!email || !pass) {
    emailMsg.textContent = "Email and password required.";
    return;
  }
  try {
    await createUserWithEmailAndPassword(auth, email, pass);
    showEmailCard(false);
  } catch (e) {
    emailMsg.textContent = e?.message || String(e);
  }
}

// -----------------------------
// Event wiring
// -----------------------------
btnModalClose.addEventListener("click", closeModal);

btnDiscord.addEventListener("click", async () => {
  const url = await buildDiscordAuthUrl();
  window.location.href = url;
});

btnEmail.addEventListener("click", () => showEmailCard(true));
btnEmailCancel.addEventListener("click", () => showEmailCard(false));
btnEmailSignIn.addEventListener("click", doEmailSignIn);
btnEmailSignUp.addEventListener("click", doEmailSignUp);

btnSignOut.addEventListener("click", async () => {
  await signOut(auth);
});

btnCreateGameDay.addEventListener("click", async () => {
  if (!currentUser) return alert("Please sign in first.");
  await createGamedayPromptFlow();
});

btnBack.addEventListener("click", () => {
  showGameDayList();
});

btnHostTable.addEventListener("click", async () => {
  if (!currentUser) return alert("Please sign in first.");
  if (!currentGameDayId) return;
  await hostTableFlow(currentGameDayId);
});

btnWantToPlay.addEventListener("click", async () => {
  if (!currentUser) return alert("Please sign in first.");
  if (!currentGameDayId) return;
  await wantToPlayFlow(currentGameDayId);
});

btnRefresh.addEventListener("click", () => {
  if (currentGameDayId) subscribeGameDayDetails(currentGameDayId);
});

// pager
btnPrev.addEventListener("click", () => {
  currentPage = Math.max(0, currentPage - 1);
  renderTablesPage();
});
btnNext.addEventListener("click", () => {
  const pages = Math.max(1, Math.ceil(currentTables.length / PAGE_SIZE));
  currentPage = Math.min(pages - 1, currentPage + 1);
  renderTablesPage();
});

// -----------------------------
// Auth state + boot
// -----------------------------
onAuthStateChanged(auth, async (user) => {
  currentUser = user || null;
  if (user) {
    const name =
      user.displayName ||
      user.email ||
      (user.uid?.startsWith("discord:") ? user.uid.replace("discord:", "Discord ") : user.uid);
    setAuthStatus(`Signed in: ${name}`);
  } else {
    setAuthStatus("Not signed in.");
  }
  setButtonsForAuth(user);
});

// start
await handleDiscordCallbackIfPresent();
subscribeGameDays();
showGameDayList();
