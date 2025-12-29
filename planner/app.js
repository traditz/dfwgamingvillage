// PATH: planner/app.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
  signOut,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";
import {
  getFirestore,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";
import {
  getFunctions,
  httpsCallable
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-functions.js";

import { firebaseConfig } from "./firebase-config.js";

// ---------- Config you’ll set in Firebase Functions ----------
const FUNCTIONS_REGION = "us-central1";

// Your BGG proxy functions (already deployed)
const BGG_SEARCH_URL = "https://us-central1-dfwgv-planner.cloudfunctions.net/bggSearch";
const BGG_THING_URL  = "https://us-central1-dfwgv-planner.cloudfunctions.net/bggThing";

// Discord OAuth (Client ID is NOT secret) — put your actual Application ID here:
const DISCORD_CLIENT_ID = "1454339984004743334";
// Must match the redirect you added in Discord portal
const DISCORD_REDIRECT_URI = "https://dfwgamingvillage.com/planner/auth/discord-callback.html";
// We only need identify to get the Discord user id/username
const DISCORD_SCOPE = "identify";

// ---------- App init ----------
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const functions = getFunctions(app, FUNCTIONS_REGION);

// Callable functions
const fnCreateGameDay = httpsCallable(functions, "createGameDay");
const fnCreateWant = httpsCallable(functions, "createWantToPlay");
const fnCreateTable = httpsCallable(functions, "createTable");
const fnJoinTable = httpsCallable(functions, "joinTable");
const fnLeaveTable = httpsCallable(functions, "leaveTable");

// ---------- UI elements ----------
const authStatus = document.getElementById("authStatus");
const btnDiscord = document.getElementById("btnDiscord");
const btnEmail = document.getElementById("btnEmail");
const btnSignOut = document.getElementById("btnSignOut");

const emailCard = document.getElementById("emailCard");
const emailEl = document.getElementById("email");
const passwordEl = document.getElementById("password");
const btnEmailSignIn = document.getElementById("btnEmailSignIn");
const btnEmailSignUp = document.getElementById("btnEmailSignUp");
const btnEmailCancel = document.getElementById("btnEmailCancel");
const emailMsg = document.getElementById("emailMsg");

const gamedayList = document.getElementById("gamedayList");
const gamedayCard = document.getElementById("gamedayCard");
const gamedayTitle = document.getElementById("gamedayTitle");
const gamedayMeta = document.getElementById("gamedayMeta");
const btnBack = document.getElementById("btnBack");

const btnCreateGameDay = document.getElementById("btnCreateGameDay");

const btnHostTable = document.getElementById("btnHostTable");
const btnWantToPlay = document.getElementById("btnWantToPlay");
const btnRefresh = document.getElementById("btnRefresh");

const tablesList = document.getElementById("tablesList");
const wantsList = document.getElementById("wantsList");

const tablePager = document.getElementById("tablePager");
const btnPrev = document.getElementById("btnPrev");
const btnNext = document.getElementById("btnNext");
const pageInfo = document.getElementById("pageInfo");

const modal = document.getElementById("modal");
const modalTitle = document.getElementById("modalTitle");
const modalBody = document.getElementById("modalBody");
const btnModalClose = document.getElementById("btnModalClose");

// ---------- State ----------
let currentUser = null;
let currentGameDayId = null;
let unsubGameDays = null;
let unsubGameDayDoc = null;
let unsubTables = null;
let unsubWants = null;

const TABLES_PER_PAGE = 7;
let tablePage = 0;
let tablePages = 1;
let cachedTables = []; // used for client pagination display

// ---------- Helpers ----------
function esc(s) {
  return String(s ?? "").replace(/[&<>"']/g, (c) => ({
    "&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"
  }[c]));
}

function fmtDate(dt) {
  if (!dt) return "TBD";
  const d = dt instanceof Date ? dt : dt.toDate?.() || null;
  if (!d) return "TBD";
  return d.toLocaleString(undefined, { weekday:"short", month:"short", day:"numeric", year:"numeric", hour:"numeric", minute:"2-digit" });
}

function bggUrl(bggId) {
  if (!bggId) return null;
  return `https://boardgamegeek.com/boardgame/${Number(bggId)}`;
}

function openModal(title, html) {
  modalTitle.textContent = title;
  modalBody.innerHTML = html;
  modal.style.display = "flex";
}
function closeModal() {
  modal.style.display = "none";
  modalBody.innerHTML = "";
}
btnModalClose.onclick = closeModal;
modal.addEventListener("click", (e) => { if (e.target === modal) closeModal(); });

function requireAuth() {
  if (!currentUser) throw new Error("Please sign in first.");
}

function discordAuthorizeUrl() {
  const state = crypto.randomUUID();
  sessionStorage.setItem("dfwgv_discord_state", state);

  const u = new URL("https://discord.com/api/oauth2/authorize");
  u.searchParams.set("client_id", DISCORD_CLIENT_ID);
  u.searchParams.set("redirect_uri", DISCORD_REDIRECT_URI);
  u.searchParams.set("response_type", "code");
  u.searchParams.set("scope", DISCORD_SCOPE);
  u.searchParams.set("state", state);
  return u.toString();
}

// ---------- Auth UI ----------
btnDiscord.onclick = () => {
  if (!DISCORD_CLIENT_ID || DISCORD_CLIENT_ID.includes("PASTE_")) {
    alert("Set DISCORD_CLIENT_ID in planner/app.js first.");
    return;
  }
  window.location.href = discordAuthorizeUrl();
};

btnEmail.onclick = () => {
  emailCard.style.display = "block";
  emailMsg.textContent = "";
};

btnEmailCancel.onclick = () => {
  emailCard.style.display = "none";
  emailMsg.textContent = "";
};

btnEmailSignIn.onclick = async () => {
  try {
    const email = emailEl.value.trim();
    const pass = passwordEl.value;
    await signInWithEmailAndPassword(auth, email, pass);
    emailMsg.textContent = "Signed in.";
    emailCard.style.display = "none";
  } catch (e) {
    emailMsg.textContent = String(e?.message || e);
  }
};

btnEmailSignUp.onclick = async () => {
  try {
    const email = emailEl.value.trim();
    const pass = passwordEl.value;
    await createUserWithEmailAndPassword(auth, email, pass);
    emailMsg.textContent = "Account created and signed in.";
    emailCard.style.display = "none";
  } catch (e) {
    emailMsg.textContent = String(e?.message || e);
  }
};

btnSignOut.onclick = async () => {
  await signOut(auth);
};

// ---------- Routing ----------
function setRouteGameDay(id) {
  const u = new URL(location.href);
  if (id) u.searchParams.set("gameday", id);
  else u.searchParams.delete("gameday");
  history.pushState({}, "", u.toString());
  applyRoute();
}

window.addEventListener("popstate", applyRoute);

function applyRoute() {
  const u = new URL(location.href);
  const id = u.searchParams.get("gameday");
  if (!id) {
    currentGameDayId = null;
    gamedayCard.style.display = "none";
    return;
  }
  openGameDay(id);
}

btnBack.onclick = () => setRouteGameDay(null);

// ---------- Firestore listeners ----------
function listenGameDays() {
  if (unsubGameDays) unsubGameDays();
  // Published gamedays only (you can later add drafts for admin)
  const q = query(collection(db, "gamedays"), where("status", "==", "published"), orderBy("startsAt", "asc"), limit(25));
  unsubGameDays = onSnapshot(q, (snap) => {
    const rows = [];
    snap.forEach((d) => {
      const gd = d.data();
      rows.push({ id: d.id, ...gd });
    });
    renderGameDays(rows);
  }, (err) => {
    gamedayList.innerHTML = `<div class="muted">Error loading gamedays: ${esc(err.message)}</div>`;
  });
}

function listenCurrentGameDay(gamedayId) {
  // cleanup
  if (unsubGameDayDoc) unsubGameDayDoc();
  if (unsubTables) unsubTables();
  if (unsubWants) unsubWants();

  unsubGameDayDoc = onSnapshot(doc(db, "gamedays", gamedayId), (snap) => {
    if (!snap.exists()) return;
    const gd = snap.data();
    gamedayTitle.textContent = `📅 ${gd.title || "Game Day"}`;
    gamedayMeta.innerHTML = `
      <div class="item">
        <div class="itemTitle">🗓 ${esc(fmtDate(gd.startsAt))}</div>
        <div class="itemSub">📍 ${esc(gd.location || "Location TBD")}</div>
      </div>
    `;
  });

  // Tables (we read them directly; join/leave writes go through Functions)
  unsubTables = onSnapshot(collection(db, "gamedays", gamedayId, "tables"), (snap) => {
    const t = [];
    snap.forEach((d) => t.push({ id: d.id, ...d.data() }));
    cachedTables = t;
    tablePage = 0;
    renderTables();
  });

  // Wants
  unsubWants = onSnapshot(collection(db, "gamedays", gamedayId, "posts"), (snap) => {
    const w = [];
    snap.forEach((d) => w.push({ id: d.id, ...d.data() }));
    // only want_to_play
    const wants = w.filter(x => x.kind === "want_to_play")
      .sort((a,b) => (b.createdAt?.seconds||0) - (a.createdAt?.seconds||0));
    renderWants(wants);
  });
}

// ---------- Rendering ----------
function renderGameDays(items) {
  if (!items.length) {
    gamedayList.innerHTML = `<div class="muted">No published Game Days yet.</div>`;
    return;
  }
  gamedayList.innerHTML = items.map(gd => `
    <div class="item">
      <div class="itemHead">
        <div>
          <div class="itemTitle">📅 ${esc(gd.title || "Game Day")}</div>
          <div class="itemSub">🗓 ${esc(fmtDate(gd.startsAt))} • 📍 ${esc(gd.location || "Location TBD")}</div>
        </div>
        <div>
          <button class="btn btn-primary" data-open="${esc(gd.id)}">Open</button>
        </div>
      </div>
    </div>
  `).join("");

  gamedayList.querySelectorAll("button[data-open]").forEach(btn => {
    btn.onclick = () => setRouteGameDay(btn.getAttribute("data-open"));
  });
}

function renderTables() {
  // sort stable: startTime then createdAt
  const tables = [...cachedTables].sort((a,b) => {
    const as = a.startTime?.seconds || 0;
    const bs = b.startTime?.seconds || 0;
    if (as !== bs) return as - bs;
    const ac = a.createdAt?.seconds || 0;
    const bc = b.createdAt?.seconds || 0;
    return ac - bc;
  });

  tablePages = Math.max(1, Math.ceil(tables.length / TABLES_PER_PAGE));
  tablePage = Math.max(0, Math.min(tablePage, tablePages - 1));

  const start = tablePage * TABLES_PER_PAGE;
  const end = start + TABLES_PER_PAGE;
  const pageItems = tables.slice(start, end);

  // pager
  if (tablePages <= 1) {
    tablePager.style.display = "none";
  } else {
    tablePager.style.display = "flex";
    btnPrev.disabled = tablePage <= 0;
    btnNext.disabled = tablePage >= tablePages - 1;
    pageInfo.textContent = `Page ${tablePage + 1} of ${tablePages}`;
  }

  if (!pageItems.length) {
    tablesList.innerHTML = `<div class="muted">No tables yet.</div>`;
    return;
  }

  tablesList.innerHTML = pageItems.map(t => {
    const url = bggUrl(t.bggId);
    const title = url ? `<a href="${esc(url)}" target="_blank" rel="noreferrer">${esc(t.gameName || "Unknown Game")}</a>` : esc(t.gameName || "Unknown Game");
    const thumb = t.thumbUrl ? `<img class="thumb" src="${esc(t.thumbUrl)}" alt="box art">` : `<div class="thumb"></div>`;

    const expansions = Array.isArray(t.expansions) && t.expansions.length
      ? t.expansions.map(e => esc(e.name)).join(", ")
      : "None";

    const confirmed = Array.isArray(t.confirmedNames) ? t.confirmedNames : [];
    const waitlist = Array.isArray(t.waitlistNames) ? t.waitlistNames : [];

    const cap = Number(t.capacity || 0);
    const confCount = Number(t.confirmedCount ?? confirmed.length ?? 0);
    const wlCount = Number(t.waitlistCount ?? waitlist.length ?? 0);

    const seats = cap ? `${confCount}/${cap}` : `${confCount}/?`;
    const startTime = t.startTime ? fmtDate(t.startTime) : "TBD";
    const host = t.hostDisplayName || "Unknown";

    const myUid = currentUser ? currentUser.uid : null;
    const canJoin = !!myUid;
    const joinLabel = "Join";
    const leaveLabel = "Leave";

    return `
      <div class="tableCard">
        ${thumb}
        <div class="tableMain">
          <div class="tableTop">
            <div>
              <div class="tableTitle">${title}</div>
              <div class="badges">
                <span class="badge">🧑‍💼 Host: ${esc(host)}</span>
                <span class="badge">🕒 Start: ${esc(startTime)}</span>
                <span class="badge">🪑 Seats: ${esc(seats)} • Wait: ${esc(wlCount)}</span>
              </div>
              <div class="roster">
                🧩 <b>Expansions:</b> ${esc(expansions)}<br/>
                👥 <b>Roster:</b> ${esc(confirmed.join(", ") || "(none)")}${waitlist.length ? `<br/>⏳ <b>Waitlist:</b> ${esc(waitlist.join(", "))}` : ""}
              </div>
            </div>
            <div style="display:flex;flex-direction:column;gap:8px;">
              <button class="btn btn-primary" data-join="${esc(t.id)}" ${canJoin ? "" : "disabled"}>${joinLabel}</button>
              <button class="btn" data-leave="${esc(t.id)}" ${canJoin ? "" : "disabled"}>${leaveLabel}</button>
            </div>
          </div>
        </div>
      </div>
    `;
  }).join("");

  tablesList.querySelectorAll("button[data-join]").forEach(btn => {
    btn.onclick = async () => {
      try {
        requireAuth();
        const tableId = btn.getAttribute("data-join");
        await fnJoinTable({ gamedayId: currentGameDayId, tableId });
      } catch (e) {
        alert(String(e?.message || e));
      }
    };
  });

  tablesList.querySelectorAll("button[data-leave]").forEach(btn => {
    btn.onclick = async () => {
      try {
        requireAuth();
        const tableId = btn.getAttribute("data-leave");
        await fnLeaveTable({ gamedayId: currentGameDayId, tableId });
      } catch (e) {
        alert(String(e?.message || e));
      }
    };
  });
}

function renderWants(items) {
  if (!items.length) {
    wantsList.innerHTML = `<div class="muted">No requests yet.</div>`;
    return;
  }
  wantsList.innerHTML = items.slice(0, 20).map(w => {
    const url = bggUrl(w.bggId);
    const title = url ? `<a href="${esc(url)}" target="_blank" rel="noreferrer">${esc(w.gameName || "Unknown Game")}</a>` : esc(w.gameName || "Unknown Game");
    const by = w.createdByDisplayName || "Unknown";
    return `
      <div class="item">
        <div class="itemTitle">${title}</div>
        <div class="itemSub">Requested by <b>${esc(by)}</b></div>
      </div>
    `;
  }).join("");
}

// ---------- Page actions ----------
btnPrev.onclick = () => { tablePage = Math.max(0, tablePage - 1); renderTables(); };
btnNext.onclick = () => { tablePage = Math.min(tablePages - 1, tablePage + 1); renderTables(); };
btnRefresh.onclick = () => { renderTables(); };

btnCreateGameDay.onclick = () => {
  try { requireAuth(); } catch { alert("Sign in first."); return; }
  openModal("Create Game Day (Admin)", `
    <div class="muted">Only admin can create Game Days. If you’re not admin, this will fail.</div>
    <div class="row">
      <input id="gdTitle" placeholder="Title (e.g., Saturday Game Day)" />
      <input id="gdLoc" placeholder="Location" />
    </div>
    <div class="row">
      <input id="gdDate" type="date" />
      <input id="gdTime" type="time" />
    </div>
    <div class="row">
      <button class="btn btn-primary" id="gdCreate">Create</button>
    </div>
    <div class="muted" id="gdMsg"></div>
  `);

  document.getElementById("gdCreate").onclick = async () => {
    const title = document.getElementById("gdTitle").value.trim();
    const location = document.getElementById("gdLoc").value.trim();
    const date = document.getElementById("gdDate").value;
    const time = document.getElementById("gdTime").value;
    const gdMsg = document.getElementById("gdMsg");

    try {
      if (!title) throw new Error("Title required.");
      if (!date || !time) throw new Error("Date and time required.");

      const startsAt = new Date(`${date}T${time}:00`);
      const res = await fnCreateGameDay({ title, location, startsAt: startsAt.toISOString() });
      gdMsg.textContent = `Created: ${res.data.gamedayId}`;
      closeModal();
      setRouteGameDay(res.data.gamedayId);
    } catch (e) {
      gdMsg.textContent = String(e?.message || e);
    }
  };
};

btnHostTable.onclick = async () => {
  try { requireAuth(); } catch { alert("Sign in first."); return; }
  if (!currentGameDayId) return;

  openModal("Host a Table", `
    <div class="muted">Search BoardGameGeek, select a game, optionally select expansions, then set seats and start time.</div>
    <div class="row">
      <input id="q" placeholder="Search BGG (e.g., catan)" />
      <button class="btn btn-primary" id="btnSearch">Search</button>
    </div>
    <div id="searchResults" class="list"></div>
    <hr/>
    <div id="selectedArea" style="display:none;">
      <div class="item">
        <div class="itemTitle" id="selTitle"></div>
        <div class="itemSub" id="selMeta"></div>
      </div>

      <div class="row">
        <input id="cap" type="number" min="1" placeholder="Seats (override)" />
        <input id="startTime" type="datetime-local" />
      </div>

      <div class="row">
        <textarea id="notes" placeholder="Notes (optional)"></textarea>
      </div>

      <div class="item">
        <div class="itemTitle">🧩 Expansions (optional)</div>
        <div class="muted">Select any expansions being used.</div>
        <div id="expansionList" class="list"></div>
      </div>

      <div class="row">
        <button class="btn btn-primary" id="btnCreateTable">Create Table</button>
      </div>

      <div class="muted" id="createMsg"></div>
    </div>
  `);

  const qEl = document.getElementById("q");
  const btnSearch = document.getElementById("btnSearch");
  const results = document.getElementById("searchResults");

  const selectedArea = document.getElementById("selectedArea");
  const selTitle = document.getElementById("selTitle");
  const selMeta = document.getElementById("selMeta");
  const expansionList = document.getElementById("expansionList");
  const btnCreateTable2 = document.getElementById("btnCreateTable");
  const createMsg = document.getElementById("createMsg");

  let selectedThing = null;
  let selectedExpansions = new Set();

  btnSearch.onclick = async () => {
    try {
      const q = qEl.value.trim();
      if (!q) return;
      results.innerHTML = `<div class="muted">Searching…</div>`;
      const r = await fetch(`${BGG_SEARCH_URL}?q=${encodeURIComponent(q)}`);
      if (!r.ok) throw new Error(await r.text());
      const data = await r.json();
      const items = data.items || [];
      if (!items.length) {
        results.innerHTML = `<div class="muted">No results.</div>`;
        return;
      }

      results.innerHTML = items.slice(0, 10).map(it => `
        <div class="item">
          <div class="itemHead">
            <div>
              <div class="itemTitle">${esc(it.name)}</div>
              <div class="itemSub">Players ${esc(it.minPlayers)}–${esc(it.maxPlayers)} • ${esc(it.durationMin)} min</div>
            </div>
            <div>
              <button class="btn btn-primary" data-pick="${esc(it.bggId)}">Select</button>
            </div>
          </div>
        </div>
      `).join("");

      results.querySelectorAll("button[data-pick]").forEach(btn => {
        btn.onclick = async () => {
          const id = btn.getAttribute("data-pick");
          results.innerHTML = `<div class="muted">Loading game details…</div>`;
          const rr = await fetch(`${BGG_THING_URL}?id=${encodeURIComponent(id)}`);
          if (!rr.ok) throw new Error(await rr.text());
          const dd = await rr.json();
          selectedThing = dd.thing;
          selectedExpansions = new Set();

          selectedArea.style.display = "block";
          selTitle.innerHTML = selectedThing.bggId ? `<a target="_blank" rel="noreferrer" href="${esc(bggUrl(selectedThing.bggId))}">${esc(selectedThing.name)}</a>` : esc(selectedThing.name);
          selMeta.textContent = `Players ${selectedThing.minPlayers}–${selectedThing.maxPlayers} • ${selectedThing.durationMin} min`;

          // Default seats to BGG max
          document.getElementById("cap").value = String(selectedThing.maxPlayers || 4);

          // Expansions
          const exps = selectedThing.expansions || [];
          if (!exps.length) {
            expansionList.innerHTML = `<div class="muted">No expansions found from BGG.</div>`;
          } else {
            expansionList.innerHTML = exps.slice(0, 30).map(e => `
              <label class="item" style="cursor:pointer;display:block;">
                <input type="checkbox" data-exp="${esc(e.bggId)}" />
                <b>${esc(e.name)}</b>
              </label>
            `).join("");
            expansionList.querySelectorAll("input[data-exp]").forEach(chk => {
              chk.onchange = () => {
                const eid = Number(chk.getAttribute("data-exp"));
                if (chk.checked) selectedExpansions.add(eid);
                else selectedExpansions.delete(eid);
              };
            });
          }

          results.innerHTML = `<div class="muted">Selected: ${esc(selectedThing.name)} (scroll down)</div>`;
        };
      });
    } catch (e) {
      results.innerHTML = `<div class="muted">Search failed: ${esc(e?.message || e)}</div>`;
    }
  };

  btnCreateTable2.onclick = async () => {
    try {
      if (!selectedThing) throw new Error("Select a game first.");
      const cap = Number(document.getElementById("cap").value || selectedThing.maxPlayers || 4);
      const dt = document.getElementById("startTime").value;
      const notes = document.getElementById("notes").value || "";

      if (!dt) throw new Error("Start time required.");
      const startTime = new Date(dt).toISOString();

      createMsg.textContent = "Creating…";

      await fnCreateTable({
        gamedayId: currentGameDayId,
        baseThing: selectedThing,
        capacity: cap,
        startTime,
        notes,
        expansionIds: Array.from(selectedExpansions),
      });

      createMsg.textContent = "Created.";
      closeModal();
    } catch (e) {
      createMsg.textContent = String(e?.message || e);
    }
  };
};

btnWantToPlay.onclick = async () => {
  try { requireAuth(); } catch { alert("Sign in first."); return; }
  if (!currentGameDayId) return;

  openModal("Want to Play", `
    <div class="muted">Search BGG and post a Want-to-Play request.</div>
    <div class="row">
      <input id="q2" placeholder="Search BGG (e.g., witcher)" />
      <button class="btn btn-primary" id="btnSearch2">Search</button>
    </div>
    <div id="searchResults2" class="list"></div>
    <div class="row">
      <textarea id="notes2" placeholder="Notes (optional)"></textarea>
    </div>
    <div class="muted" id="wantMsg"></div>
  `);

  const q2 = document.getElementById("q2");
  const btnSearch2 = document.getElementById("btnSearch2");
  const results2 = document.getElementById("searchResults2");
  const notes2 = document.getElementById("notes2");
  const wantMsg = document.getElementById("wantMsg");

  btnSearch2.onclick = async () => {
    try {
      const q = q2.value.trim();
      if (!q) return;
      results2.innerHTML = `<div class="muted">Searching…</div>`;
      const r = await fetch(`${BGG_SEARCH_URL}?q=${encodeURIComponent(q)}`);
      if (!r.ok) throw new Error(await r.text());
      const data = await r.json();
      const items = data.items || [];
      if (!items.length) {
        results2.innerHTML = `<div class="muted">No results.</div>`;
        return;
      }

      results2.innerHTML = items.slice(0, 10).map(it => `
        <div class="item">
          <div class="itemHead">
            <div>
              <div class="itemTitle">${esc(it.name)}</div>
              <div class="itemSub">Players ${esc(it.minPlayers)}–${esc(it.maxPlayers)} • ${esc(it.durationMin)} min</div>
            </div>
            <div>
              <button class="btn btn-primary" data-pick="${esc(it.bggId)}">Post</button>
            </div>
          </div>
        </div>
      `).join("");

      results2.querySelectorAll("button[data-pick]").forEach(btn => {
        btn.onclick = async () => {
          try {
            const id = btn.getAttribute("data-pick");
            wantMsg.textContent = "Loading…";
            const rr = await fetch(`${BGG_THING_URL}?id=${encodeURIComponent(id)}`);
            if (!rr.ok) throw new Error(await rr.text());
            const dd = await rr.json();
            const thing = dd.thing;

            wantMsg.textContent = "Posting…";
            await fnCreateWant({
              gamedayId: currentGameDayId,
              thing,
              notes: notes2.value || "",
            });
            wantMsg.textContent = "Posted.";
            closeModal();
          } catch (e) {
            wantMsg.textContent = String(e?.message || e);
          }
        };
      });
    } catch (e) {
      results2.innerHTML = `<div class="muted">Search failed: ${esc(e?.message || e)}</div>`;
    }
  };
};

// ---------- Open gameday ----------
async function openGameDay(id) {
  currentGameDayId = id;
  gamedayCard.style.display = "block";
  listenCurrentGameDay(id);
}

// ---------- Auth state ----------
onAuthStateChanged(auth, async (user) => {
  currentUser = user || null;

  if (!user) {
    authStatus.textContent = "Signed out";
    btnSignOut.style.display = "none";
  } else {
    authStatus.textContent = `Signed in: ${user.uid}`;
    btnSignOut.style.display = "inline-block";
  }

  // Always listen gamedays
  listenGameDays();

  // Route handler
  applyRoute();
});

// ---------- Boot ----------
listenGameDays();
applyRoute();

