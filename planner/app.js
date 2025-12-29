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

// --- UI elements (must exist in your index.html) ---
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
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;"
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

function bggUrl(bggId) {
  if (!bggId) return null;
  return `https://boardgamegeek.com/boardgame/${encodeURIComponent(String(bggId))}`;
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
modal?.addEventListener("click", (e) => { if (e.target === modal) closeModal(); });

// --- Discord OAuth (state stored in BOTH to avoid mismatch) ---
function randomState() {
  const a = new Uint8Array(16);
  crypto.getRandomValues(a);
  return [...a].map((b) => b.toString(16).padStart(2, "0")).join("");
}

function buildDiscordAuthUrl() {
  const state = randomState();
  localStorage.setItem("dfwgv_discord_oauth_state", state);
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
  if (!code) return;

  const expectedState =
    sessionStorage.getItem("dfwgv_discord_oauth_state") ||
    localStorage.getItem("dfwgv_discord_oauth_state");

  sessionStorage.removeItem("dfwgv_discord_oauth_state");
  localStorage.removeItem("dfwgv_discord_oauth_state");

  if (!returnedState) throw new Error("Missing ?state from Discord.");
  if (!expectedState || returnedState !== expectedState) {
    throw new Error("State mismatch (blocked for safety). Try signing in again.");
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

  // bounce from /planner/auth/ back to /planner/
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

function toLocalDatetimeValue(date = new Date()) {
  const pad = (n) => String(n).padStart(2, "0");
  const d = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

async function pickGameModal({ title = "Pick a game" } = {}) {
  return new Promise((resolve) => {
    const html = `
      <div class="row" style="justify-content:space-between; gap:12px;">
        <div style="flex:1; min-width:240px;">
          <label class="muted">Search</label>
          <input class="input" id="bggQ" placeholder="e.g. Twilight Imperium" />
        </div>
        <div style="margin-top:18px;">
          <button class="btn btn-primary" id="bggSearchBtn">Search</button>
        </div>
      </div>

      <div class="hr"></div>

      <div id="bggResults" class="list"></div>

      <div class="hr"></div>

      <div class="row" style="justify-content:flex-end;">
        <button class="btn" id="bggCancel">Cancel</button>
      </div>
    `;
    showModal(title, html);

    const qEl = modalBody.querySelector("#bggQ");
    const resultsEl = modalBody.querySelector("#bggResults");
    const searchBtn = modalBody.querySelector("#bggSearchBtn");
    const cancelBtn = modalBody.querySelector("#bggCancel");

    const renderResults = (items) => {
      resultsEl.innerHTML = items.map((it) => {
        const u = bggUrl(it.bggId);
        return `
          <div class="listitem" style="align-items:center;">
            <div class="li-main" style="flex:1;">
              <img class="thumb" src="${escapeHtml(it.thumbUrl || "")}" alt="" onerror="this.style.display='none'"/>
              <div style="min-width:0;">
                <div class="li-title">${escapeHtml(it.name)}</div>
                <div class="li-sub">
                  <span class="badge">BGG #${escapeHtml(it.bggId)}</span>
                  ${u ? `<a href="${escapeHtml(u)}" target="_blank" rel="noopener">View on BGG</a>` : ""}
                </div>
              </div>
            </div>
            <div class="li-actions">
              <button class="btn btn-success" data-pick="${escapeHtml(it.bggId)}">Select</button>
            </div>
          </div>
        `;
      }).join("");

      resultsEl.querySelectorAll("[data-pick]").forEach((btn) => {
        btn.addEventListener("click", async () => {
          try {
            btn.disabled = true;
            btn.textContent = "Loading…";
            const thing = await bggThing(btn.getAttribute("data-pick"));
            closeModal();
            resolve(thing);
          } catch (e) {
            btn.disabled = false;
            btn.textContent = "Select";
            alert(e?.message || String(e));
          }
        });
      });
    };

    searchBtn.addEventListener("click", async () => {
      try {
        const q = qEl.value.trim();
        if (!q) return;
        searchBtn.disabled = true;
        searchBtn.textContent = "Searching…";
        const items = await bggSearch(q);
        renderResults(items.slice(0, 25));
      } catch (e) {
        resultsEl.innerHTML = `<div class="muted">${escapeHtml(e?.message || String(e))}</div>`;
      } finally {
        searchBtn.disabled = false;
        searchBtn.textContent = "Search";
      }
    });

    qEl.addEventListener("keydown", (e) => {
      if (e.key === "Enter") searchBtn.click();
    });

    cancelBtn.addEventListener("click", () => {
      closeModal();
      resolve(null);
    });
  });
}

// --- Rendering: left list ---
function renderGameDayList() {
  gamedayList.innerHTML = gamedays.map((gd) => {
    const starts = fmtTimestamp(gd.startsAt);
    const loc = gd.location ? ` • ${escapeHtml(gd.location)}` : "";
    return `
      <div class="listitem ${gd.id === selectedGameDayId ? "selected" : ""}">
        <div class="li-main">
          <div style="min-width:0;">
            <div class="li-title">${escapeHtml(gd.title || "Game Day")}</div>
            <div class="li-sub">${escapeHtml(starts)}${loc}</div>
          </div>
        </div>
        <div class="li-actions">
          <button class="btn btn-primary" data-open="${gd.id}">Open</button>
          ${isAdmin() ? `<button class="btn btn-danger" data-del="${gd.id}">Delete</button>` : ""}
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
    const u = bggUrl(w.bggId);
    return `
      <div class="listitem">
        <div class="li-main" style="flex:1;">
          <img class="thumb" src="${escapeHtml(w.thumbUrl || "")}" alt="" onerror="this.style.display='none'"/>
          <div style="min-width:0;">
            <div class="li-title">${escapeHtml(w.gameName || "Want to Play")}${who}</div>
            <div class="li-sub">
              ${u ? `<a href="${escapeHtml(u)}" target="_blank" rel="noopener">BoardGameGeek</a>` : `<span class="muted">No BGG link</span>`}
            </div>
            ${note}
          </div>
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
    const u = bggUrl(t.bggId);

    const exp = (t.expansions && t.expansions.length)
      ? `<div class="tableMeta">Expansions: ${t.expansions.map((e) => escapeHtml(e.name)).join(", ")}</div>`
      : "";

    const note = t.notes ? `<div class="tableMeta">${escapeHtml(t.notes)}</div>` : "";

    const joinBtn = auth.currentUser ? `<button class="btn btn-success" data-join="${t.id}">Join</button>` : "";
    const leaveBtn = auth.currentUser ? `<button class="btn" data-leave="${t.id}">Leave</button>` : "";

    return `
      <div class="table">
        <div class="tableHead">
          <div class="li-main" style="align-items:flex-start; flex:1;">
            <img class="thumb" src="${escapeHtml(t.thumbUrl || "")}" alt="" onerror="this.style.display='none'"/>
            <div style="min-width:0;">
              <div class="tableTitle">
                ${escapeHtml(t.gameName || "Table")}
                ${u ? ` <span class="badge"><a href="${escapeHtml(u)}" target="_blank" rel="noopener">BGG</a></span>` : ""}
              </div>
              <div class="tableMeta">${escapeHtml(startTime)} • Seats: ${confirmed}/${cap || "?"} • Wait: ${wait}</div>
              ${exp}
              ${note}
            </div>
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

  const fmt = (arr) => arr.length
    ? arr.map((s) => escapeHtml(s.displayName || s.uid)).join(", ")
    : "—";

  el.innerHTML = `
    <div class="rosterBox">
      <strong>Confirmed</strong>
      <div>${fmt(confirmed)}</div>
    </div>
    <div class="rosterBox">
      <strong>Waitlist</strong>
      <div>${fmt(wait)}</div>
    </div>
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

    // Only subscribe rosters for the visible page
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

// --- Modal forms (create gameday / host table / want to play) ---
async function createGameDayFlow() {
  const now = toLocalDatetimeValue(new Date());
  showModal("Create Game Day", `
    <div>
      <label class="muted">Title <span class="kbd">required</span></label>
      <input class="input" id="gdTitle" placeholder="e.g. DFWGV Saturday Game Day" />
    </div>
    <div style="margin-top:10px;">
      <label class="muted">Start date/time <span class="kbd">required</span></label>
      <input class="input" id="gdStarts" type="datetime-local" value="${escapeHtml(now)}" />
    </div>
    <div style="margin-top:10px;">
      <label class="muted">Location</label>
      <input class="input" id="gdLoc" placeholder="e.g. Madness Games & Comics" />
    </div>
    <div class="modalFoot">
      <button class="btn" id="gdCancel">Cancel</button>
      <button class="btn btn-primary" id="gdCreate">Create</button>
    </div>
  `);

  modalBody.querySelector("#gdCancel").onclick = () => closeModal();
  modalBody.querySelector("#gdCreate").onclick = async () => {
    const title = modalBody.querySelector("#gdTitle").value.trim();
    const starts = modalBody.querySelector("#gdStarts").value;
    const location = modalBody.querySelector("#gdLoc").value.trim();

    if (!title) return alert("Title is required.");
    if (!starts) return alert("Start date/time is required.");

    const startsIso = new Date(starts).toISOString();
    await fnCreateGameDay({ title, startsAt: startsIso, location });
    closeModal();
  };
}

async function hostTableFlow(gamedayId) {
  const thing = await pickGameModal({ title: "Host a table — pick a game" });
  if (!thing) return;

  const defaultStart = toLocalDatetimeValue(new Date(Date.now() + 60 * 60 * 1000));
  const maxPlayers = Number(thing.maxPlayers || 0) || 0;
  const defaultCap = maxPlayers || 6;

  const expHtml = (thing.expansions && thing.expansions.length)
    ? `
      <div class="hr"></div>
      <div class="muted">Expansions (optional)</div>
      <div class="list" style="margin-top:8px; max-height:220px; overflow:auto; padding-right:6px;">
        ${thing.expansions.slice(0, 40).map((e) => `
          <label class="listitem" style="justify-content:flex-start;">
            <input type="checkbox" class="expPick" value="${escapeHtml(e.bggId)}" style="margin-right:10px;" />
            <div style="min-width:0;">
              <div class="li-title">${escapeHtml(e.name)}</div>
              <div class="li-sub">BGG #${escapeHtml(e.bggId)}</div>
            </div>
          </label>
        `).join("")}
      </div>
    `
    : `<div class="hr"></div><div class="muted">No expansions detected for this title.</div>`;

  const u = bggUrl(thing.bggId);

  showModal("Host a table", `
    <div class="listitem" style="justify-content:flex-start;">
      <img class="thumb" src="${escapeHtml(thing.thumbUrl || "")}" alt="" onerror="this.style.display='none'"/>
      <div style="min-width:0;">
        <div class="li-title">${escapeHtml(thing.name)}</div>
        <div class="li-sub">
          ${u ? `<a href="${escapeHtml(u)}" target="_blank" rel="noopener">View on BoardGameGeek</a>` : ""}
          ${maxPlayers ? ` • <span class="badge">Max players: ${escapeHtml(maxPlayers)}</span>` : ""}
        </div>
      </div>
    </div>

    <div style="margin-top:10px;">
      <label class="muted">Start time <span class="kbd">required</span></label>
      <input class="input" id="tStart" type="datetime-local" value="${escapeHtml(defaultStart)}" />
    </div>

    <div style="margin-top:10px;">
      <label class="muted">Seat count (capacity) <span class="kbd">required</span></label>
      <input class="input" id="tCap" type="number" min="1" step="1" value="${escapeHtml(defaultCap)}" />
      <div class="muted" style="font-size:12px; margin-top:6px;">Used for confirmed vs waitlist.</div>
    </div>

    <div style="margin-top:10px;">
      <label class="muted">Notes</label>
      <textarea class="input" id="tNotes" placeholder="Optional details (teach, experience level, house rules, etc.)"></textarea>
    </div>

    ${expHtml}

    <div class="modalFoot">
      <button class="btn" id="tCancel">Cancel</button>
      <button class="btn btn-primary" id="tCreate">Create Table</button>
    </div>
  `);

  modalBody.querySelector("#tCancel").onclick = () => closeModal();
  modalBody.querySelector("#tCreate").onclick = async () => {
    const startVal = modalBody.querySelector("#tStart").value;
    const capVal = Number(modalBody.querySelector("#tCap").value);
    const notes = modalBody.querySelector("#tNotes").value.trim();

    if (!startVal) return alert("Start time is required.");
    if (!capVal || capVal < 1) return alert("Capacity must be at least 1.");

    const expansionIds = [...modalBody.querySelectorAll(".expPick:checked")].map((c) => String(c.value));

    await fnCreateTable({
      gamedayId,
      bggId: String(thing.bggId),
      gameName: thing.name,
      thumbUrl: thing.thumbUrl || "",
      startTime: new Date(startVal).toISOString(),
      capacity: capVal,
      notes,
      expansionIds
    });

    closeModal();
  };
}

async function wantToPlayFlow(gamedayId) {
  const thing = await pickGameModal({ title: "Want to play — pick a game" });
  if (!thing) return;

  const u = bggUrl(thing.bggId);

  showModal("Post: Want to Play", `
    <div class="listitem" style="justify-content:flex-start;">
      <img class="thumb" src="${escapeHtml(thing.thumbUrl || "")}" alt="" onerror="this.style.display='none'"/>
      <div style="min-width:0;">
        <div class="li-title">${escapeHtml(thing.name)}</div>
        <div class="li-sub">${u ? `<a href="${escapeHtml(u)}" target="_blank" rel="noopener">View on BoardGameGeek</a>` : ""}</div>
      </div>
    </div>

    <div style="margin-top:10px;">
      <label class="muted">Notes</label>
      <textarea class="input" id="wNotes" placeholder="Optional: preferred time, player count, teach, etc."></textarea>
    </div>

    <div class="modalFoot">
      <button class="btn" id="wCancel">Cancel</button>
      <button class="btn btn-primary" id="wPost">Post</button>
    </div>
  `);

  modalBody.querySelector("#wCancel").onclick = () => closeModal();
  modalBody.querySelector("#wPost").onclick = async () => {
    const notes = modalBody.querySelector("#wNotes").value.trim();
    await fnCreateWantToPlay({
      gamedayId,
      bggId: String(thing.bggId),
      gameName: thing.name,
      thumbUrl: thing.thumbUrl || "",
      notes
    });
    closeModal();
  };
}

// --- Wire UI ---
btnDiscord?.addEventListener("click", () => { window.location.href = buildDiscordAuthUrl(); });

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
