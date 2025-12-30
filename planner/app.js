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
  if (!modal || !modalTitle || !modalBody) return;
  modalTitle.textContent = title;
  modalBody.innerHTML = html;
  modal.style.display = "";
}

function closeModal() {
  if (!modal || !modalTitle || !modalBody) return;
  modal.style.display = "none";
  modalTitle.textContent = "Modal";
  modalBody.innerHTML = "";
}

function qs(sel) {
  return modalBody.querySelector(sel);
}

function fmtLocalDatetimeValue(date = new Date()) {
  const pad = (n) => String(n).padStart(2, "0");
  const yyyy = date.getFullYear();
  const mm = pad(date.getMonth() + 1);
  const dd = pad(date.getDate());
  const hh = pad(date.getHours());
  const mi = pad(date.getMinutes());
  return `${yyyy}-${mm}-${dd}T${hh}:${mi}`;
}

function parseDatetimeLocalToISO(v) {
  // v like "2025-12-29T18:30"
  const d = new Date(v);
  if (Number.isNaN(d.getTime())) return null;
  return d.toISOString();
}

function showInlineError(msg) {
  const el = qs("#modalError");
  if (!el) return;
  el.textContent = msg ? String(msg) : "";
  el.style.display = msg ? "" : "none";
}

function showInlineStatus(msg) {
  const el = qs("#modalStatus");
  if (!el) return;
  el.textContent = msg ? String(msg) : "";
  el.style.display = msg ? "" : "none";
}

function unwrapCallableError(e) {
  // Firebase callable errors often look like: FirebaseError: functions/invalid-argument
  const msg = e?.message || String(e);
  return msg;
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

  // remember where to return after callback
  sessionStorage.setItem("discord_return_to", window.location.href);

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
  if (!authStatus) return;
  authStatus.textContent = text;
}

function showEmailCard(show) {
  emailCard.style.display = show ? "" : "none";
  emailMsg.textContent = "";
}

function setButtonsForAuth(user) {
  if (!btnDiscord || !btnEmail || !btnSignOut || !btnCreateGameDay) return;

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
    openModal("Discord Sign-in", `
      <div class="modalStack">
        <div class="muted">Signing you in…</div>
        <div class="modalStatus" id="modalStatus" style="display:none;"></div>
        <div class="modalError" id="modalError" style="display:none;"></div>
      </div>
    `);

    const url = `${DISCORD_AUTH_FUNCTION_URL}?code=${encodeURIComponent(code)}`;
    const r = await fetch(url);
    const j = await r.json();
    if (!r.ok) throw new Error(j?.error || `HTTP ${r.status}`);

    const firebaseToken = j.firebaseToken;
    if (!firebaseToken) throw new Error("No firebaseToken returned.");

    const { signInWithCustomToken } = await import("https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js");
    await signInWithCustomToken(auth, firebaseToken);

    const returnTo = sessionStorage.getItem("discord_return_to") || "/planner/";
    window.location.replace(returnTo);
    return;

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
// BGG proxy helpers (your Cloud Functions)
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
// Modal: Search + select a BGG game (with box art + year)
// -----------------------------
function openGameSearchModal({ title }) {
  return new Promise((resolve) => {
    openModal(title, `
      <div class="modalStack">
        <div class="modalRow">
          <input id="bggQuery" class="input" type="text" placeholder="Search BoardGameGeek (e.g. Catan, Twilight Imperium)..." />
          <button class="btn btn-primary" id="btnDoSearch">Search</button>
        </div>

        <div class="modalHint muted">Tip: try a few words. Results show year + box art. Click one to select.</div>

        <div class="modalStatus" id="modalStatus" style="display:none;"></div>
        <div class="modalError" id="modalError" style="display:none;"></div>

        <div class="searchResults" id="results"></div>

        <div class="modalActions">
          <button class="btn" id="btnCancel">Cancel</button>
        </div>
      </div>
    `);

    const input = qs("#bggQuery");
    const btnSearch = qs("#btnDoSearch");
    const results = qs("#results");
    const btnCancel = qs("#btnCancel");

    let closed = false;
    let lastRun = 0;

    const done = (val) => {
      if (closed) return;
      closed = true;
      closeModal();
      resolve(val);
    };

    btnCancel.addEventListener("click", () => done(null));

    const renderResults = (items) => {
      results.innerHTML = "";
      if (!items.length) {
        results.innerHTML = `<div class="muted">No results.</div>`;
        return;
      }

      for (const it of items) {
        const year = it.year ? String(it.year) : "";
        const sub = [
          year ? `Year: ${year}` : "",
          (it.minPlayers && it.maxPlayers) ? `Players: ${it.minPlayers}-${it.maxPlayers}` : ""
        ].filter(Boolean).join(" • ");

        const card = document.createElement("button");
        card.type = "button";
        card.className = "resultCard";
        card.innerHTML = `
          <div class="resultThumb">
            ${it.thumbUrl ? `<img src="${esc(it.thumbUrl)}" alt="" loading="lazy" />` : `<div class="thumbph">🎲</div>`}
          </div>
          <div class="resultBody">
            <div class="resultTitle">${esc(it.name || "Unknown")}</div>
            <div class="resultMeta muted">${esc(sub)}</div>
          </div>
        `;

        card.addEventListener("click", async () => {
          try {
            showInlineError("");
            showInlineStatus("Loading game details…");
            const full = await bggThing(it.bggId);
            showInlineStatus("");

            // Normalize "thing" object used by the next modal:
            const expansions = full.expansions || [];
            done({
              bggId: it.bggId,
              name: it.name,
              thumbUrl: it.thumbUrl || "",
              year: it.year || null,
              minPlayers: it.minPlayers || null,
              maxPlayers: it.maxPlayers || null,
              expansions
            });
          } catch (e) {
            showInlineStatus("");
            showInlineError(unwrapCallableError(e));
          }
        });

        results.appendChild(card);
      }
    };

    const runSearch = async () => {
      const q = String(input.value || "").trim();
      if (!q) {
        showInlineError("Type a search term first.");
        return;
      }

      const runId = ++lastRun;
      showInlineError("");
      showInlineStatus("Searching…");
      results.innerHTML = "";

      try {
        const items = await bggSearch(q);
        if (runId !== lastRun) return; // stale
        showInlineStatus("");
        renderResults(items);
      } catch (e) {
        if (runId !== lastRun) return;
        showInlineStatus("");
        showInlineError(unwrapCallableError(e));
      }
    };

    btnSearch.addEventListener("click", runSearch);
    input.addEventListener("keydown", (ev) => {
      if (ev.key === "Enter") runSearch();
    });

    // autofocus
    setTimeout(() => input.focus(), 50);

    // nice: debounce while typing
    input.addEventListener("input", () => {
      const now = Date.now();
      if (now - lastRun < 250) return;
      // no auto-search until at least 3 chars to reduce spam
      if (String(input.value || "").trim().length >= 3) {
        // soft debounce
        const stamp = Date.now();
        setTimeout(() => {
          if (Date.now() - stamp >= 260) runSearch();
        }, 300);
      }
    });
  });
}

// -----------------------------
// Modal: host table form (no prompts)
// -----------------------------
function openHostTableFormModal({ gamedayId, thing }) {
  return new Promise((resolve) => {
    const defaultStart = fmtLocalDatetimeValue(new Date(Date.now() + 60 * 60 * 1000));
    const defaultCap = thing?.maxPlayers || "";

    openModal("Host a Table", `
      <div class="modalStack">
        <div class="gameHeader">
          <div class="gameHeaderThumb">
            ${thing.thumbUrl ? `<img src="${esc(thing.thumbUrl)}" alt="" loading="lazy" />` : `<div class="thumbph">🎲</div>`}
          </div>
          <div class="gameHeaderBody">
            <div class="gameHeaderTitle">${esc(thing.name)}</div>
            <div class="muted">
              ${thing.year ? `Year: ${esc(thing.year)}` : ""}
              ${(thing.minPlayers && thing.maxPlayers) ? ` • Players: ${esc(thing.minPlayers)}-${esc(thing.maxPlayers)}` : ""}
            </div>
          </div>
        </div>

        <div class="modalGrid">
          <label class="field">
            <div class="label">Start time</div>
            <input id="startTime" class="input" type="datetime-local" value="${esc(defaultStart)}" />
          </label>

          <label class="field">
            <div class="label">Seats</div>
            <input id="capacity" class="input" type="number" min="1" step="1" placeholder="e.g. 4" value="${esc(defaultCap)}" />
            <div class="hint muted">Defaults to max players if known.</div>
          </label>

          <label class="field fieldSpan2">
            <div class="label">Notes</div>
            <textarea id="notes" class="textarea" rows="3" placeholder="Optional: teach game, bring expansion, start at 2pm, etc."></textarea>
          </label>
        </div>

        <div class="expBlock">
          <div class="label">Expansions (optional)</div>
          <div class="expList" id="expList">
            ${thing.expansions?.length
              ? thing.expansions.slice(0, 40).map((e) => `
                <label class="check">
                  <input type="checkbox" value="${esc(e.bggId)}" />
                  <span>${esc(e.name)}</span>
                </label>
              `).join("")
              : `<div class="muted">No expansions found for this title.</div>`
            }
          </div>
        </div>

        <div class="modalStatus" id="modalStatus" style="display:none;"></div>
        <div class="modalError" id="modalError" style="display:none;"></div>

        <div class="modalActions">
          <button class="btn" id="btnCancel">Cancel</button>
          <button class="btn btn-primary" id="btnCreate">Create table</button>
        </div>
      </div>
    `);

    const btnCancel = qs("#btnCancel");
    const btnCreate = qs("#btnCreate");

    const done = (val) => {
      closeModal();
      resolve(val);
    };

    btnCancel.addEventListener("click", () => done(null));

    btnCreate.addEventListener("click", async () => {
      showInlineError("");
      showInlineStatus("");

      const startVal = qs("#startTime").value;
      const startIso = parseDatetimeLocalToISO(startVal);
      if (!startIso) {
        showInlineError("Please choose a valid start time.");
        return;
      }

      const capRaw = Number(qs("#capacity").value || 0);
      const capFinal = (Number.isFinite(capRaw) && capRaw > 0)
        ? capRaw
        : (Number(thing.maxPlayers) || 0);

      if (!capFinal || capFinal < 1) {
        showInlineError("Please set Seats (capacity).");
        return;
      }

      const notes = String(qs("#notes").value || "").trim();

      const expList = qs("#expList");
      const checked = Array.from(expList.querySelectorAll('input[type="checkbox"]:checked'))
        .map((c) => String(c.value))
        .filter(Boolean);

      try {
        btnCreate.disabled = true;
        btnCancel.disabled = true;
        showInlineStatus("Creating table…");

        await fnCreateTable({
          gamedayId,
          bggId: String(thing.bggId),
          gameName: thing.name,
          thumbUrl: thing.thumbUrl || "",
          startTime: startIso,
          capacity: capFinal,
          notes,
          expansionIds: checked
        });

        showInlineStatus("Created!");
        setTimeout(() => done({ ok: true }), 350);
      } catch (e) {
        btnCreate.disabled = false;
        btnCancel.disabled = false;
        showInlineStatus("");
        showInlineError(unwrapCallableError(e));
      }
    });
  });
}

// -----------------------------
// Modal: want to play form
// -----------------------------
function openWantToPlayFormModal({ gamedayId, thing }) {
  return new Promise((resolve) => {
    openModal("Want to Play", `
      <div class="modalStack">
        <div class="gameHeader">
          <div class="gameHeaderThumb">
            ${thing.thumbUrl ? `<img src="${esc(thing.thumbUrl)}" alt="" loading="lazy" />` : `<div class="thumbph">🎲</div>`}
          </div>
          <div class="gameHeaderBody">
            <div class="gameHeaderTitle">${esc(thing.name)}</div>
            <div class="muted">${thing.year ? `Year: ${esc(thing.year)}` : ""}</div>
          </div>
        </div>

        <label class="field">
          <div class="label">Notes (optional)</div>
          <textarea id="notes" class="textarea" rows="3" placeholder="Looking for players, prefer 5p, can teach, etc."></textarea>
        </label>

        <div class="modalStatus" id="modalStatus" style="display:none;"></div>
        <div class="modalError" id="modalError" style="display:none;"></div>

        <div class="modalActions">
          <button class="btn" id="btnCancel">Cancel</button>
          <button class="btn btn-primary" id="btnPost">Post</button>
        </div>
      </div>
    `);

    const btnCancel = qs("#btnCancel");
    const btnPost = qs("#btnPost");

    const done = (val) => {
      closeModal();
      resolve(val);
    };

    btnCancel.addEventListener("click", () => done(null));

    btnPost.addEventListener("click", async () => {
      showInlineError("");
      showInlineStatus("");
      const notes = String(qs("#notes").value || "").trim();

      try {
        btnPost.disabled = true;
        btnCancel.disabled = true;
        showInlineStatus("Posting…");

        await fnCreateWantToPlay({
          gamedayId,
          bggId: String(thing.bggId),
          gameName: thing.name,
          thumbUrl: thing.thumbUrl || "",
          notes
        });

        showInlineStatus("Posted!");
        setTimeout(() => done({ ok: true }), 350);
      } catch (e) {
        btnPost.disabled = false;
        btnCancel.disabled = false;
        showInlineStatus("");
        showInlineError(unwrapCallableError(e));
      }
    });
  });
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
        alert(`Join failed: ${unwrapCallableError(e)}`);
      }
    });

    el.querySelector('[data-action="leave"]').addEventListener("click", async (ev) => {
      ev.stopPropagation();
      if (!currentUser) return alert("Please sign in first.");
      try {
        await fnLeaveTable({ gamedayId: currentGameDayId, tableId: t.id });
      } catch (e) {
        alert(`Leave failed: ${unwrapCallableError(e)}`);
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
      <div class="title">
        ${bggUrl ? `<a href="${esc(bggUrl)}" target="_blank" rel="noopener">${esc(p.gameName || "Game")}</a>` : esc(p.gameName || "Game")}
      </div>
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
  gamedayMeta.innerHTML = `<div class="muted">${esc(fmtDate(startsAt))}${gd.location ? ` • ${esc(gd.location)}` : ""}</div>`;
  showGameDayCard();
  subscribeGameDayDetails(gd.id);
}

async function hostTableFlow(gamedayId) {
  const thing = await openGameSearchModal({ title: "Select a game to host" });
  if (!thing) return;
  await openHostTableFormModal({ gamedayId, thing });
}

async function wantToPlayFlow(gamedayId) {
  const thing = await openGameSearchModal({ title: "Select a game you want to play" });
  if (!thing) return;
  await openWantToPlayFormModal({ gamedayId, thing });
}

async function createGamedayPromptFlow() {
  // Keeping as prompt for now (admin-only). If you want, we can convert this to a modal too.
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
    alert(`Create Game Day failed: ${unwrapCallableError(e)}`);
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
    emailMsg.textContent = unwrapCallableError(e);
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
    emailMsg.textContent = unwrapCallableError(e);
  }
}

// -----------------------------
// Event wiring
// -----------------------------
if (btnModalClose) btnModalClose.addEventListener("click", closeModal);

if (btnDiscord) btnDiscord.addEventListener("click", async () => {
  const url = await buildDiscordAuthUrl();
  window.location.href = url;
});

if (btnEmail) btnEmail.addEventListener("click", () => showEmailCard(true));
if (btnEmailCancel) btnEmailCancel.addEventListener("click", () => showEmailCard(false));
if (btnEmailSignIn) btnEmailSignIn.addEventListener("click", doEmailSignIn);
if (btnEmailSignUp) btnEmailSignUp.addEventListener("click", doEmailSignUp);

if (btnSignOut) btnSignOut.addEventListener("click", async () => {
  await signOut(auth);
});

if (btnCreateGameDay) btnCreateGameDay.addEventListener("click", async () => {
  if (!currentUser) return alert("Please sign in first.");
  await createGamedayPromptFlow();
});

if (btnBack) btnBack.addEventListener("click", () => {
  showGameDayList();
});

if (btnHostTable) btnHostTable.addEventListener("click", async () => {
  try {
    if (!currentUser) {
      alert("Please sign in first.");
      return;
    }
    if (!currentGameDayId) {
      alert("Please click a Game Day first (from the left list), then host a table.");
      return;
    }

    await hostTableFlow(currentGameDayId);
  } catch (e) {
    console.error("Host Table failed:", e);
    alert(`Host Table failed: ${e?.message || e}`);
  }
});


if (btnWantToPlay) btnWantToPlay.addEventListener("click", async () => {
  if (!currentUser) return alert("Please sign in first.");
  if (!currentGameDayId) return;
  await wantToPlayFlow(currentGameDayId);
});

if (btnRefresh) btnRefresh.addEventListener("click", () => {
  if (currentGameDayId) subscribeGameDayDetails(currentGameDayId);
});

// pager
if (btnPrev) btnPrev.addEventListener("click", () => {
  currentPage = Math.max(0, currentPage - 1);
  renderTablesPage();
});
if (btnNext) btnNext.addEventListener("click", () => {
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
