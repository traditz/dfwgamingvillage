// PATH: planner/app.js
import { firebaseConfig } from "./firebase-config.js";
import * as appConfig from "./app-config.js";

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
  signOut
  
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";
import {
  getFirestore,
  collection,
  doc,
  getDoc,
  query,
  where,
  orderBy,
  onSnapshot
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";
import { getFunctions, httpsCallable } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-functions.js";

import {
  esc,
  asDate,
  fmtDate,
  fmtTime,
  centralDateKey,
  centralTimeHHMM,
  eventDayKeys,
  fmtDayLabel,
  fmtEventWhen,
  fmtCentralDatetimeValue,
  parseDatetimeLocalToISO,
  unwrapCallableError,
  qs,
  openModal,
  closeModal,
  showInlineError,
  showInlineStatus,
  confirmDialog,
  toast
} from "./shared.js?v=20260817-p19";

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
const fnUpdateTable = httpsCallable(functions, "updateTable");
const fnDeleteTable = httpsCallable(functions, "deleteTable");
const fnCreateWantToPlay = httpsCallable(functions, "createWantToPlay");
const fnDeleteWantToPlay = httpsCallable(functions, "deleteWantToPlay");
const fnJoinTable = httpsCallable(functions, "joinTable");
const fnLeaveTable = httpsCallable(functions, "leaveTable");
const fnGetMyPlannerRole = httpsCallable(functions, "getMyPlannerRole");
const fnRequestHostAccess = httpsCallable(functions, "requestHostAccess");
const fnSetNickname = httpsCallable(functions, "setNickname");
const fnGetMyActivity = httpsCallable(functions, "getMyActivity");
const fnRedeemInvite = httpsCallable(functions, "redeemInvite");
const fnRotateInviteToken = httpsCallable(functions, "rotateInviteToken");
const fnListInvites = httpsCallable(functions, "listInvites");
const fnRemoveInvite = httpsCallable(functions, "removeInvite");
const fnReviewInvite = httpsCallable(functions, "reviewInvite");

// -----------------------------
// UI bindings
// -----------------------------
const authStatus = document.querySelector("#authStatus");
const btnSignIn = document.querySelector("#btnSignIn");
const btnSignOut = document.querySelector("#btnSignOut");
const adminLinks = document.querySelectorAll("[data-admin-link]");



const btnCreateGameDay = document.querySelector("#btnCreateGameDay");
const btnPastEvents = document.querySelector("#btnPastEvents");
const btnBecomeHost = document.querySelector("#btnBecomeHost");
const btnNickname = document.querySelector("#btnNickname");
const btnMyEvents = document.querySelector("#btnMyEvents");
const btnHostGuide = document.querySelector("#btnHostGuide");

// Discord bot invite: same application as OAuth. Permissions = View Channels,
// Send Messages, Manage Messages (pinning), Embed Links, Read Message History.
const BOT_INVITE_URL =
  `https://discord.com/oauth2/authorize?client_id=${encodeURIComponent(DISCORD_CLIENT_ID)}` +
  `&scope=bot%20applications.commands&permissions=93184`;

const gamedayList = document.querySelector("#gamedayList");
const pastEventsPanel = document.querySelector("#pastEventsPanel");
const pastGamedayList = document.querySelector("#pastGamedayList");
const gamedayCard = document.querySelector("#gamedayCard");
const gamedayTitle = document.querySelector("#gamedayTitle");
const gamedayMeta = document.querySelector("#gamedayMeta");
const btnBack = document.querySelector("#btnBack");

const btnHostTable = document.querySelector("#btnHostTable");
const btnWantToPlay = document.querySelector("#btnWantToPlay");

const tablesList = document.querySelector("#tablesList");
const wantsList = document.querySelector("#wantsList");

const tablePager = document.querySelector("#tablePager");
const btnPrev = document.querySelector("#btnPrev");
const btnNext = document.querySelector("#btnNext");
const pageInfo = document.querySelector("#pageInfo");

// Modal element wiring lives in shared.js (single controller for all pages).

// -----------------------------
// State
// -----------------------------
let currentUser = null;
let currentGameDayId = null;
let currentGameDay = null;
let currentGameDays = [];
let currentPastGameDays = [];
let lastGameDaysRaw = [];
// Platform role, resolved server-side after sign-in (owner = site admin,
// host = approved to create Game Days, requested = pending host request).
let myRole = { owner: false, host: false, requested: false };
let lastDisplayName = "";
let myPrivateGamedays = []; // private events I organize / joined / am invited to
let initialEventId = new URLSearchParams(window.location.search).get("event") || "";

// Invite link (?event=<id>&invite=<token>): captured at boot, redeemed after
// sign-in, then stripped from the URL.
let pendingInvite = null;
let invitePromptShown = false;
{
  const bootParams = new URLSearchParams(window.location.search);
  const inviteToken = bootParams.get("invite");
  const inviteEvent = bootParams.get("event");
  if (inviteToken && inviteEvent) {
    pendingInvite = { gamedayId: inviteEvent, token: inviteToken };
    const u = new URL(window.location.href);
    u.searchParams.delete("invite");
    window.history.replaceState({}, "", u.toString());
  }
}

// tables pagination
let currentTables = [];
let currentPosts = [];
let currentPage = 0;
const PAGE_SIZE = 8;

// roster (per-table signups)
const rosterByTableId = new Map(); // tableId -> { confirmed: string[], waitlist: string[], confirmedIds: Set, waitlistIds: Set }
const rosterUnsubsByTableId = new Map(); // tableId -> unsubscribe()
const bggMetaCache = new Map(); // bggId -> Promise<{ bggYear, bggRating }>

// unsubscribe handles
let unsubGameDays = null;
let unsubTables = null;
let unsubPosts = null;

// -----------------------------
// Helpers
// -----------------------------

// datetime-local bounds restricting a table's start to the open event's day.
// The datetime-local value is treated as Central throughout the app, so the
// date portion can be compared directly against the event's Central date.
function eventDayBounds() {
  const startsAt = currentGameDay ? asDate(currentGameDay.startsAt) : null;
  if (!startsAt) return null;
  const days = eventDayKeys(currentGameDay.startsAt, currentGameDay.endsAt);
  const first = days[0];
  const last = days[days.length - 1];
  const multiDay = days.length > 1;

  // On a multi-day event default to today when the event is running, so
  // hosting during a convention lands on the right day automatically.
  const todayKey = centralDateKey(new Date());
  const defaultDay = days.includes(todayKey) ? todayKey : first;

  return {
    day: first,
    days,
    multiDay,
    isEventDay: (key) => days.includes(key),
    label: multiDay
      ? `${fmtDayLabel(first)} – ${fmtDayLabel(last)}`
      : fmtDayLabel(first),
    min: `${first}T00:00`,
    max: `${last}T23:59`,
    default: `${defaultDay}T${centralTimeHHMM(startsAt)}`
  };
}

function isPastGameDay(gd) {
  const startsAt = asDate(gd?.startsAt);
  if (!startsAt) return false;
  return centralDateKey(startsAt) < centralDateKey(new Date());
}

function sortByStartsAtAsc(items) {
  return [...items].sort((a, b) => {
    const aTime = asDate(a.startsAt)?.getTime() ?? Number.MAX_SAFE_INTEGER;
    const bTime = asDate(b.startsAt)?.getTime() ?? Number.MAX_SAFE_INTEGER;
    return aTime - bTime;
  });
}

function sortByStartsAtDesc(items) {
  return [...items].sort((a, b) => {
    const aTime = asDate(a.startsAt)?.getTime() ?? 0;
    const bTime = asDate(b.startsAt)?.getTime() ?? 0;
    return bTime - aTime;
  });
}

function normalizeBggThingPayload(payload) {
  if (!payload || typeof payload !== "object") return {};
  const thing = payload.thing && typeof payload.thing === "object" ? payload.thing : payload;
  return {
    ...thing,
    expansions: thing.expansions || payload.expansions || []
  };
}

function gameYear(item) {
  const year = Number(item?.bggYear ?? item?.year ?? 0);
  return Number.isFinite(year) && year > 0 ? String(year) : "";
}

function gameRating(item) {
  const rating = Number(item?.bggRating ?? item?.rating ?? 0);
  return Number.isFinite(rating) && rating > 0 ? rating.toFixed(1) : "";
}

function gameMetaText(item) {
  const parts = [];
  const year = gameYear(item);
  const rating = gameRating(item);
  if (year) parts.push(`Year: ${year}`);
  if (rating) parts.push(`BGG: ${rating}`);
  return parts.join(" • ");
}

async function fetchBggMeta(bggId) {
  const key = String(bggId || "").trim();
  if (!key) return {};
  if (!bggMetaCache.has(key)) {
    bggMetaCache.set(key, bggThing(key).then((payload) => {
      const thing = normalizeBggThingPayload(payload);
      return {
        bggYear: thing.year || thing.bggYear || null,
        bggRating: thing.bggRating || thing.rating || null
      };
    }).catch(() => ({})));
  }
  return bggMetaCache.get(key);
}

async function hydrateGameMeta(root, item) {
  const host = root?.querySelector?.("[data-game-meta]");
  if (!host || !item?.bggId || gameMetaText(item)) return;
  const meta = await fetchBggMeta(item.bggId);
  // The card may have been rebuilt while the BGG fetch was in flight.
  if (!host.isConnected) return;
  const text = gameMetaText(meta);
  if (text) {
    host.textContent = text;
    host.style.display = "";
  }
}

// Robust check for admin ID (handles both "123" and "discord:123")
function isAdminUser(user) {
  if (!user) return false;
  const owner = appConfig.OWNER_UID;
  if (!owner) return false;
  
  // Exact match (if config has "discord:123")
  if (user.uid === owner) return true;
  
  // Prefix match (if config has "123" but user is "discord:123")
  if (user.uid === `discord:${owner}`) return true;
  
  return false;
}

function isAdmin() {
  return myRole.owner || isAdminUser(currentUser);
}

// Did the signed-in user create this Game Day? (Per-event organizer admin.)
function isOrganizerOf(gd) {
  return !!(currentUser && gd && gd.createdBy && gd.createdBy === currentUser.uid);
}

let roleSeq = 0;
async function refreshMyRole() {
  const seq = ++roleSeq;
  if (!currentUser) {
    myRole = { owner: false, host: false, requested: false };
    applyRoleUI();
    return;
  }
  try {
    const r = await fnGetMyPlannerRole({});
    if (seq !== roleSeq) return; // superseded by a newer auth change
    myRole = { owner: false, host: false, requested: false, ...(r.data || {}) };
    if (myRole.nickname) setAuthStatus(`Signed in as: ${myRole.nickname}`);

    // One-time nudge: your sign-in name is public on rosters; nicknames exist.
    if (!myRole.nickname && !localStorage.getItem("plannerNickNudge")) {
      localStorage.setItem("plannerNickNudge", "1");
      const shownAs = lastDisplayName ? ` You'll appear as “${lastDisplayName}” on game days.` : "";
      toast(`Welcome!${shownAs} Want a different name? Tap the ✏️ Nickname button up top.`, "info", 8000);
    }
  } catch {
    if (seq !== roleSeq) return;
    // Callable unavailable (e.g. mid-deploy): fall back to the client owner
    // check, keeping any nickname we already knew.
    const owner = isAdminUser(currentUser);
    myRole = { owner, host: owner, requested: false, nickname: myRole.nickname };
  }
  applyRoleUI();
}

function applyRoleUI() {
  const signedIn = !!currentUser;
  if (btnCreateGameDay) {
    btnCreateGameDay.style.display = signedIn && (myRole.owner || myRole.host) ? "" : "none";
  }
  if (btnBecomeHost) {
    const show = signedIn && !myRole.owner && !myRole.host;
    btnBecomeHost.style.display = show ? "" : "none";
    btnBecomeHost.disabled = myRole.requested;
    btnBecomeHost.textContent = myRole.requested ? "Organizer request pending" : "Request Organizer Access";
  }
  if (btnHostGuide) {
    btnHostGuide.style.display = signedIn && (myRole.owner || myRole.host) ? "" : "none";
  }
  // Dashboard nav link: owner sees "Admin", hosts see "My Events".
  adminLinks.forEach((link) => {
    const show = signedIn && (myRole.owner || myRole.host);
    link.hidden = !show;
    if (show) link.textContent = myRole.owner ? "Admin" : "Manage Events";
  });
  // Organizer-only controls live inside rendered lists — refresh them.
  if (lastGameDaysRaw.length) renderGameDays(lastGameDaysRaw);
  if (currentGameDayId) {
    renderTablesPage();
    renderWants(currentPosts);
  }
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


function stopRosterListenersExcept(keepIds = new Set()) {
  for (const [tableId, unsub] of rosterUnsubsByTableId.entries()) {
    if (!keepIds.has(tableId)) {
      try { unsub(); } catch {}
      rosterUnsubsByTableId.delete(tableId);
      rosterByTableId.delete(tableId);
    }
  }
}

function ensureRosterListener(gamedayId, tableId) {
  if (rosterUnsubsByTableId.has(tableId)) return;

  const signupsRef = collection(db, "gamedays", gamedayId, "tables", tableId, "signups");
  const signupsQ = query(signupsRef, orderBy("joinedAt", "asc"));

  const unsub = onSnapshot(signupsQ, (snap) => {
    const confirmed = [];
    const waitlist = [];
    const confirmedIds = new Set();
    const waitlistIds = new Set();

    snap.forEach((d) => {
      const s = d.data() || {};
      const uid = s.uid || d.id;
      // Count EVERY signup doc — a missing display name must not make the
      // roster (and seat counts) disagree with the server.
      const name = String(s.displayName || "").trim() || "Player";

      if (s.status === "waitlist") {
          waitlist.push({ name, uid });
          waitlistIds.add(uid);
      } else {
          confirmed.push({ name, uid });
          confirmedIds.add(uid);
      }
    });

    rosterByTableId.set(tableId, { confirmed, waitlist, confirmedIds, waitlistIds });
    updateRosterDom(tableId);
    // Targeted button refresh instead of a full page re-render (avoids flicker).
    const card = tablesList?.querySelector?.(`[data-table-card="${CSS.escape(String(tableId))}"]`);
    const t = currentTables.find((x) => x.id === tableId);
    if (card && t) applyJoinLeaveState(card, t);
  });

  rosterUnsubsByTableId.set(tableId, unsub);
}

function updateRosterDom(tableId) {
  const host = tablesList?.querySelector?.(`[data-roster-for="${CSS.escape(String(tableId))}"]`);
  if (!host) return;

  const roster = rosterByTableId.get(tableId) || { confirmed: [], waitlist: [] };

  const cEl = host.querySelector('[data-roster-kind="confirmed"]');
  const wEl = host.querySelector('[data-roster-kind="waitlist"]');
  const cCountEl = host.querySelector('[data-roster-count="confirmed"]');
  const wCountEl = host.querySelector('[data-roster-count="waitlist"]');

  if (cEl) cEl.innerHTML = rosterNamesHtml(roster.confirmed);
  if (wEl) wEl.innerHTML = rosterNamesHtml(roster.waitlist);
  if (cCountEl) cCountEl.textContent = String(roster.confirmed.length);
  if (wCountEl) wCountEl.textContent = String(roster.waitlist.length);

  const card = host.closest(".tablecard");
  const t = currentTables.find((x) => x.id === tableId);
  if (card && t) refreshSeatsDom(card, t);
}

// Toggle a table card's Join/Leave buttons in place (no DOM rebuild) so live
// roster updates don't cause the whole list to flicker.
function applyJoinLeaveState(card, t) {
  const uid = currentUser?.uid;
  const roster = rosterByTableId.get(t.id);
  const isSignedUp = !!(roster && uid && (roster.confirmedIds.has(uid) || roster.waitlistIds.has(uid)));
  const isHostMine = !!(uid && t.hostUid && uid === t.hostUid);

  // Card-level cue even when the action row is absent (past events).
  card.classList.toggle("is-mine", isSignedUp || isHostMine);

  const joinBtn = card.querySelector('[data-action="join"]');
  const leaveBtn = card.querySelector('[data-action="leave"]');
  if (!joinBtn || !leaveBtn) return;

  const isPast = currentEventIsPast();

  if (isHostMine) {
    // The host manages via Leave (which deletes the table) — a permanently
    // disabled "Joined" pill is just noise on their own card.
    joinBtn.style.display = "none";
    leaveBtn.style.display = isPast ? "none" : "";
    leaveBtn.disabled = isPast;
    leaveBtn.textContent = "Leave";
    return;
  }
  joinBtn.style.display = "";

  if (isSignedUp) {
    joinBtn.disabled = true;
    joinBtn.textContent = "✅ Joined";
    joinBtn.classList.remove("btn-primary");
    joinBtn.title = "";
    leaveBtn.style.display = isPast ? "none" : "";
    leaveBtn.disabled = isPast;
    leaveBtn.textContent = "Leave";
  } else {
    // Signed-out visitors keep an ENABLED Join that routes to the sign-in
    // chooser — a dead disabled button explains nothing on a phone.
    joinBtn.disabled = isPast;
    joinBtn.textContent = currentUser ? "Join" : "Sign in to join";
    joinBtn.classList.add("btn-primary");
    joinBtn.title = isPast ? "Past events are read-only." : "";
    leaveBtn.style.display = "none";
    leaveBtn.disabled = true;
  }
}

function rosterNamesHtml(entries) {
  if (!entries?.length) return `<span class="rosterEmpty">None yet</span>`;
  const myUid = currentUser?.uid;
  return entries.map((e) => {
    const isYou = !!(myUid && e.uid === myUid);
    return `<span class="rosterChip${isYou ? " is-you" : ""}">${esc(e.name)}${isYou ? " (you)" : ""}</span>`;
  }).join("");
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



function setButtonsForAuth(user) {
  if (!btnSignIn || !btnSignOut) return;

  if (user) {
    btnSignIn.style.display = "none";
    btnSignOut.style.display = "";
    if (btnNickname) btnNickname.style.display = "";
    if (btnMyEvents) btnMyEvents.style.display = "";
  } else {
    btnSignIn.style.display = "";
    btnSignOut.style.display = "none";
    if (btnNickname) btnNickname.style.display = "none";
    if (btnMyEvents) btnMyEvents.style.display = "none";
  }
  // Create Game Day / Request Organizer Access buttons are role-driven.
  applyRoleUI();
}

// One sign-in entry point: a chooser with a hint per provider. Also opened
// when a signed-out visitor taps Join / Host a Table / Request a Game.
function openSignInModal(message) {
  openModal("Sign In", `
    <div class="modalStack">
      <div class="muted">${esc(message || "Signing in takes a few seconds and lets hosts see who's coming.")}</div>
      <div>
        <button class="btn btn-primary" id="btnSignInDiscord" style="width:100%;">Sign in with Discord</button>
        <div class="hint muted" style="margin-top:6px;">In our Discord server? Use this — your name carries over.</div>
      </div>
      <div>
        <button class="btn" id="btnSignInGoogle" style="width:100%;">Sign in with Google</button>
        <div class="hint muted" style="margin-top:6px;">No Discord? Any Google account works.</div>
      </div>
      <div class="modalActions">
        <button class="btn" id="btnCancel">Cancel</button>
      </div>
    </div>
  `);
  qs("#btnCancel")?.addEventListener("click", closeModal);
  qs("#btnSignInDiscord")?.addEventListener("click", async () => {
    const url = await buildDiscordAuthUrl();
    window.location.href = url;
  });
  qs("#btnSignInGoogle")?.addEventListener("click", async () => {
    try {
      const { GoogleAuthProvider, signInWithPopup } = await import("https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js");
      await signInWithPopup(auth, new GoogleAuthProvider());
      closeModal();
      toast("Signed in!", "success");
    } catch (e) {
      // Closing the popup isn't an error worth surfacing.
      if (e?.code !== "auth/popup-closed-by-user" && e?.code !== "auth/cancelled-popup-request") {
        toast(`Google sign-in failed: ${e?.message || e}`, "error");
      }
    }
  });
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

    const verifier = sessionStorage.getItem("discord_pkce_verifier");
    if (!verifier) throw new Error("Missing PKCE code_verifier in sessionStorage.");

    const url =
      `${DISCORD_AUTH_FUNCTION_URL}` +
      `?code=${encodeURIComponent(code)}` +
      `&code_verifier=${encodeURIComponent(verifier)}` +
      `&redirect_uri=${encodeURIComponent(DISCORD_REDIRECT_URI)}`;

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
  } catch (e) {
    openModal("Discord Sign-in", `
      <div class="muted">Sign-in failed.</div>
      <pre class="muted">${esc(e?.message || e)}</pre>
    `);
  } finally {
    clearUrlParams();
    sessionStorage.removeItem("discord_oauth_state");
    sessionStorage.removeItem("discord_pkce_verifier");
    sessionStorage.removeItem("discord_return_to");
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
          <input id="bggQuery" class="input" type="text" data-autofocus placeholder="Search BoardGameGeek (e.g. Catan, Twilight Imperium)..." />
          <button class="btn btn-primary" id="btnDoSearch">Search</button>
        </div>

        <div class="modalHint muted">Tip: try a few words. Results show year + box art. Click one to select.</div>

        <div class="modalStatus" id="modalStatus" style="display:none;"></div>
        <div class="modalError" id="modalError" style="display:none;"></div>

        <div class="searchResults" id="results"></div>

        <div class="customBlock">
          <div class="label">Not a game?</div>
          <div class="hint muted">Make a custom sign-up sheet — food run, early setup, library help, anything people can claim a spot on.</div>
          <div class="modalRow" style="margin-top:8px;">
            <input id="customName" class="input" type="text" maxlength="80" placeholder="e.g. Pizza run — who's in?" />
            <button class="btn" id="btnCustom">Create sign-up</button>
          </div>
        </div>

        <div class="modalActions">
          <button class="btn" id="btnCancel">Cancel</button>
        </div>
      </div>
    `, { onDismiss: () => done(null) });

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

    // Custom sign-up: skip BoardGameGeek entirely and name it yourself.
    const doCustom = () => {
      const name = String(qs("#customName")?.value || "").trim();
      if (name.length < 2) {
        showInlineError("Give your sign-up a short title.");
        return;
      }
      done({ isCustom: true, name });
    };
    qs("#btnCustom")?.addEventListener("click", doCustom);
    qs("#customName")?.addEventListener("keydown", (ev) => {
      if (ev.key === "Enter") {
        ev.preventDefault();
        doCustom();
      }
    });

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
        // FIX: Force white text and left alignment for visibility

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
            const thing = normalizeBggThingPayload(full);
            showInlineStatus("");

            const expansions = thing.expansions || [];
            done({
              bggId: it.bggId,
              name: thing.name || it.name,
              thumbUrl: thing.thumbUrl || it.thumbUrl || "",
              year: thing.year || it.year || null,
              bggYear: thing.year || it.year || null,
              bggRating: thing.bggRating || it.bggRating || null,
              minPlayers: thing.minPlayers || it.minPlayers || null,
              maxPlayers: thing.maxPlayers || it.maxPlayers || null,
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
        if (runId !== lastRun) return; 
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

  });
}

// -----------------------------
// Modal: host table form (no prompts)
// -----------------------------
function openHostTableFormModal({ gamedayId, thing }) {
  return new Promise((resolve) => {
    const bounds = eventDayBounds();
    const defaultStart = bounds ? bounds.default : fmtCentralDatetimeValue(new Date(Date.now() + 60 * 60 * 1000));
    const dtAttrs = bounds ? ` min="${bounds.min}" max="${bounds.max}"` : "";
    const dtHint = bounds ? `<div class="hint muted">Must be during the event (${esc(bounds.label)}).</div>` : "";
    const isCustom = thing.isCustom === true;
    const defaultCap = isCustom ? "" : (thing?.maxPlayers || "");

    openModal(isCustom ? "Create a Sign-Up" : "Host a Table", `
      <div class="modalStack">
        <div class="gameHeader">
          <div class="gameHeaderThumb">
            ${thing.thumbUrl
              ? `<img src="${esc(thing.thumbUrl)}" alt="" loading="lazy" />`
              : (isCustom
                  ? `<img src="./signup-sheet.png" alt="" loading="lazy" />`
                  : `<div class="thumbph">🎲</div>`)}
          </div>
          <div class="gameHeaderBody">
            <div class="gameHeaderTitle">${esc(thing.name)}</div>
            <div class="muted">
              ${isCustom
                ? "Custom sign-up — people claim a spot just like a table"
                : `${thing.year ? `Year: ${esc(thing.year)}` : ""}${(thing.minPlayers && thing.maxPlayers) ? ` • Players: ${esc(thing.minPlayers)}-${esc(thing.maxPlayers)}` : ""}`}
            </div>
          </div>
        </div>

        <div class="modalGrid">
          <label class="field">
            <div class="label">Start time</div>
            <input id="startTime" class="input" type="datetime-local" value="${esc(defaultStart)}"${dtAttrs} />
            ${dtHint}
          </label>

          <label class="field">
            <div class="label">${isCustom ? "Spots" : "Seats"}</div>
            <input id="capacity" class="input" type="number" min="1" step="1" placeholder="${isCustom ? "e.g. 6" : "e.g. 4"}" value="${esc(defaultCap)}" />
            <div class="hint muted">${isCustom ? "How many people can sign up?" : "Defaults to max players if known."}</div>
          </label>

          <label class="field fieldSpan2">
            <div class="label">Notes</div>
            <textarea id="notes" class="textarea" rows="3" placeholder="${isCustom ? "Optional: where to meet, what to bring, timing…" : "Optional: teach game, bring expansion, start at 2pm, etc."}"></textarea>
          </label>
        </div>

        ${isCustom ? "" : `
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
        </div>`}

        <div class="modalStatus" id="modalStatus" style="display:none;"></div>
        <div class="modalError" id="modalError" style="display:none;"></div>

        <div class="modalActions">
          <button class="btn" id="btnCancel">Cancel</button>
          <button class="btn btn-primary" id="btnCreate">${isCustom ? "Create sign-up" : "Create table"}</button>
        </div>
      </div>
    `, { onDismiss: () => done(null) });

    const btnCancel = qs("#btnCancel");
    const btnCreate = qs("#btnCreate");

    let settled = false;
    const done = (val) => {
      if (settled) return;
      settled = true;
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
      if (bounds && !bounds.isEventDay(startVal.slice(0, 10))) {
        showInlineError(`Tables must start during the event (${bounds.label}).`);
        return;
      }

      const capRaw = Number(qs("#capacity").value || 0);
      const capFinal = (Number.isFinite(capRaw) && capRaw > 0)
        ? capRaw
        : (Number(thing.maxPlayers) || 0);

      // Games need 2+ players; a custom sign-up can have a single spot.
      const minCap = isCustom ? 1 : 2;
      if (!capFinal || capFinal < minCap || capFinal > 999) {
        showInlineError(`${isCustom ? "Spots" : "Seats"} must be between ${minCap} and 999.`);
        return;
      }

      const notes = String(qs("#notes").value || "").trim();

      const expList = qs("#expList");
      const checked = expList
        ? Array.from(expList.querySelectorAll('input[type="checkbox"]:checked'))
            .map((c) => String(c.value))
            .filter(Boolean)
        : [];

      try {
        btnCreate.disabled = true;
        btnCancel.disabled = true;
        showInlineStatus("Creating table…");

        await fnCreateTable({
          gamedayId,
          isCustom,
          bggId: isCustom ? "" : String(thing.bggId),
          gameName: thing.name,
          thumbUrl: isCustom ? "" : (thing.thumbUrl || ""),
          bggYear: isCustom ? null : (thing.bggYear || thing.year || null),
          bggRating: isCustom ? null : (thing.bggRating || null),
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
// Modal: Edit Table (NEW)
// -----------------------------
function openEditTableModal(t) {
    const bounds = eventDayBounds();
    const dtAttrs = bounds ? ` min="${bounds.min}" max="${bounds.max}"` : "";
    const dtHint = bounds ? `<div class="hint muted">Must be during the event (${esc(bounds.label)}).</div>` : "";
    openModal("Edit Table", `
      <div class="modalStack">
        <div class="modalGrid">
          <label class="field"><div class="label">Start</div><input id="editStart" class="input" type="datetime-local"${dtAttrs} />${dtHint}</label>
          <label class="field"><div class="label">Seats</div><input id="editCap" class="input" type="number" min="2" max="999" /></label>
          <label class="field fieldSpan2"><div class="label">Notes</div><textarea id="editNotes" class="textarea" rows="3"></textarea></label>
        </div>
        <div class="modalStatus" id="modalStatus" style="display:none;"></div>
        <div class="modalError" id="modalError" style="display:none;"></div>
        <div class="modalActions">
            <button class="btn" id="btnCancel">Cancel</button>
            <button class="btn btn-primary" id="btnSave">Save Changes</button>
        </div>
      </div>
    `);
    
    // Pre-fill with the CENTRAL wall clock — the parse side interprets the
    // field as Central, so a browser-local prefill would shift the time for
    // any host outside Central.
    qs("#editStart").value = t.startTime ? fmtCentralDatetimeValue(t.startTime) : "";
    qs("#editCap").value = t.capacity;
    qs("#editNotes").value = t.notes || "";

    qs("#btnCancel").addEventListener("click", closeModal);
    qs("#btnSave").addEventListener("click", async () => {
        const startVal = qs("#editStart").value;
        const startIso = parseDatetimeLocalToISO(startVal);
        const cap = Number(qs("#editCap").value);
        const notes = qs("#editNotes").value;

        if (!startIso || cap < 2 || cap > 999) {
            showInlineError("Invalid Start or Seats (must be 2-999).");
            return;
        }
        if (bounds && !bounds.isEventDay(startVal.slice(0, 10))) {
            showInlineError(`Tables must start during the event (${bounds.label}).`);
            return;
        }

        const btnSave = qs("#btnSave");
        const btnCancel = qs("#btnCancel");
        btnSave.disabled = true;
        btnCancel.disabled = true;
        showInlineError("");
        showInlineStatus("Saving...");
        try {
            await fnUpdateTable({
                gamedayId: currentGameDayId,
                tableId: t.id,
                startTime: startIso,
                capacity: cap,
                notes: notes
            });
            closeModal();
        } catch (e) {
            btnSave.disabled = false;
            btnCancel.disabled = false;
            showInlineStatus("");
            showInlineError(unwrapCallableError(e));
        }
    });
}

// -----------------------------
// Modal: want to play form
// -----------------------------
function openWantToPlayFormModal({ gamedayId, thing }) {
  return new Promise((resolve) => {
    openModal("Request a Game", `
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
    `, { onDismiss: () => done(null) });

    const btnCancel = qs("#btnCancel");
    const btnPost = qs("#btnPost");

    let settled = false;
    const done = (val) => {
      if (settled) return;
      settled = true;
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
          bggYear: thing.bggYear || thing.year || null,
          bggRating: thing.bggRating || null,
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
  const q = query(
    collection(db, "gamedays"),
    where("visibility", "==", "public"),
    where("status", "==", "published"),
    orderBy("startsAt", "asc")
  );
  unsubGameDays = onSnapshot(q, (snap) => {
    const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    lastGameDaysRaw = list;
    renderGameDays(list);
    tryOpenDeepLink();

    // Keep the OPEN game day's header live, and bounce out if it vanishes
    // (deleted/unpublished while someone was looking at it).
    if (currentGameDayId) {
      const fresh = list.find((g) => g.id === currentGameDayId);
      if (fresh) {
        currentGameDay = fresh;
        renderGameDayHeader(fresh);
      } else if (currentGameDay?.visibility !== "private") {
        // Private events aren't in the public snapshot — never bounce those.
        showGameDayList();
        history.replaceState({}, "", gameDayUrl(null));
        toast("This Game Day is no longer available.", "info");
      }
    }
  }, () => {
    // Snapshot failure (offline, rules): never leave a blank/broken-looking list.
    gamedayList.innerHTML = `
      <div class="muted">Couldn't load game days — check your connection.</div>
      <button class="btn" id="btnRetryGamedays" style="margin-top:6px;">Retry</button>
    `;
    document.querySelector("#btnRetryGamedays")?.addEventListener("click", subscribeGameDays);
  });
}

// Deep links (?event=) are consumed here — from snapshot data only, never as
// a side effect of unrelated re-renders.
function tryOpenDeepLink() {
  if (!initialEventId) return;
  const all = [...currentGameDays, ...currentPastGameDays];
  const match = all.find((gd) => gd.id === initialEventId);
  const id = initialEventId;
  initialEventId = "";
  if (match) {
    openGameDay(match, { push: false, deepLink: true });
    return;
  }
  if (currentUser) {
    // Possibly a private event this user can read (invitee/organizer/admin).
    getDoc(doc(db, "gamedays", id)).then((snap) => {
      if (snap.exists()) {
        openGameDay({ id: snap.id, ...snap.data() }, { push: false, deepLink: true });
      } else {
        toast("That event link isn't available — it may have been removed or unpublished.", "info", 6000);
        history.replaceState({}, "", gameDayUrl(null));
      }
    }).catch(() => {
      toast("That event isn't available — it may be private. Ask the organizer for an invite link.", "info", 7000);
      history.replaceState({}, "", gameDayUrl(null));
    });
  } else if (pendingInvite && pendingInvite.gamedayId === id) {
    // Invite flow will reopen it after sign-in; keep quiet for now.
    initialEventId = id;
  } else {
    toast("Sign in to view that event — it may be private.", "info", 6000);
  }
}

function subscribeGameDayDetails(gamedayId) {
  if (unsubTables) unsubTables();
  if (unsubPosts) unsubPosts();

  const tablesQ = query(collection(db, "gamedays", gamedayId, "tables"), orderBy("startTime", "asc"));
  unsubTables = onSnapshot(tablesQ, (snap) => {
    currentTables = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    // NOTE: no page reset here — a remote join must not yank viewers back to
    // page 1. The page resets in openGameDay when a new event is opened.
    renderTablesPage();
  });

  const postsQ = query(collection(db, "gamedays", gamedayId, "posts"), orderBy("createdAt", "desc"));
  unsubPosts = onSnapshot(postsQ, (snap) => {
    const posts = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    currentPosts = posts.filter((p) => p.kind === "want_to_play");
    renderWants(currentPosts);
  });
}

// -----------------------------
// Rendering
// -----------------------------
function renderGameDays(list) {
  // Private events I'm part of merge into the list (never in the public query).
  const merged = [...list, ...myPrivateGamedays.filter((p) => !list.some((g) => g.id === p.id))];
  const sorted = sortByStartsAtAsc(merged);
  const visibleGameDays = sorted.filter((gd) => !isPastGameDay(gd));
  currentGameDays = visibleGameDays;
  currentPastGameDays = sortByStartsAtDesc(sorted.filter(isPastGameDay));
  if (btnPastEvents) {
    btnPastEvents.disabled = currentPastGameDays.length === 0;
    if (currentPastGameDays.length === 0 && pastEventsPanel) {
      pastEventsPanel.style.display = "none";
    }
    btnPastEvents.setAttribute("aria-expanded", pastEventsPanel?.style.display !== "none" ? "true" : "false");
    btnPastEvents.setAttribute("aria-label", currentPastGameDays.length
      ? `Past Events — ${currentPastGameDays.length} available`
      : "Past Events — none yet");
  }
  renderPastGameDays();

  gamedayList.innerHTML = "";
  if (!visibleGameDays.length) {
    gamedayList.innerHTML = `<div class="muted">No upcoming game days yet — check back soon!</div>`;
  } else {
    for (const gd of visibleGameDays) {
      const startsAt = asDate(gd.startsAt);
      const el = document.createElement("div");
      el.className = "listitem eventCard";
      el.innerHTML = `
        <div>
          <button type="button" class="cardOpenBtn"><span class="title">${esc(gd.title || "Game Day")}</span></button>
          <div class="meta">${gd.visibility === "private" ? `<span class="eventPill is-private">🔒 Private</span> ` : ""}${esc(fmtEventWhen(gd.startsAt, gd.endsAt))}${gd.location ? ` • ${esc(gd.location)}` : ""}${gd.createdByDisplayName ? ` • Hosted by ${esc(gd.createdByDisplayName)}` : ""}</div>
        </div>
      `;

      const actions = document.createElement("div");
      actions.className = "eventCardFooter plannerEventActions";

      // Private events have no public share page — organizers get the invite
      // link instead; public events keep View / Share.
      if (gd.visibility === "private") {
        if (isAdmin() || isOrganizerOf(gd)) {
          const inviteBtn = document.createElement("button");
          inviteBtn.type = "button";
          inviteBtn.className = "btn eventCardAction";
          inviteBtn.textContent = "🔗 Invite Link";
          inviteBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            copyInviteLink(gd.id);
          });
          actions.appendChild(inviteBtn);
        }
      } else {
        const publicLink = document.createElement("a");
        publicLink.className = "btn eventCardAction";
        publicLink.href = `./events/?id=${encodeURIComponent(gd.id)}`;
        publicLink.textContent = "View / Share";
        publicLink.addEventListener("click", (e) => e.stopPropagation());
        actions.appendChild(publicLink);
      }

      // Delete: site owner, or this Game Day's organizer
      if (isAdmin() || isOrganizerOf(gd)) {
        const delBtn = document.createElement("button");
        delBtn.className = "btn btn-danger eventCardAction";
        delBtn.textContent = "Delete";
        delBtn.addEventListener("click", async (e) => {
          e.stopPropagation();
          const ok = await confirmDialog({
            title: "Delete Game Day?",
            message: `Delete “${gd.title || "Game Day"}”? This wipes all of its tables and signups.`,
            confirmLabel: "Delete Game Day",
            danger: true
          });
          if (!ok) return;
          try {
              await fnDeleteGameDay({ gamedayId: gd.id });
              toast("Game Day deleted.", "success");
          } catch (err) {
              toast(unwrapCallableError(err), "error");
          }
        });
        actions.appendChild(delBtn);
      }

      el.appendChild(actions);
      // The title button is the keyboard/SR action; whole-card click stays as
      // a mouse convenience.
      el.querySelector(".cardOpenBtn")?.addEventListener("click", (e) => {
        e.stopPropagation();
        openGameDay(gd);
      });
      el.addEventListener("click", (e) => {
        if (e.target.closest("a, button")) return;
        openGameDay(gd);
      });
      gamedayList.appendChild(el);
    }
  }

}

function renderPastGameDays() {
  if (!pastGamedayList) return;
  pastGamedayList.innerHTML = "";
  if (!currentPastGameDays.length) {
    pastGamedayList.innerHTML = `<div class="muted">No past events yet.</div>`;
    return;
  }

  for (const gd of currentPastGameDays) {
    const el = document.createElement("div");
    el.className = "listitem eventCard pastEventItem";
    el.innerHTML = `
      <div>
        <button type="button" class="cardOpenBtn"><span class="title">${esc(gd.title || "Game Day")}</span></button>
        <div class="meta">${esc(fmtDate(asDate(gd.startsAt)))}${gd.location ? ` • ${esc(gd.location)}` : ""}</div>
      </div>
    `;

    const actions = document.createElement("div");
    actions.className = "eventCardFooter plannerEventActions";

    // Past private events: no public share page either.
    if (gd.visibility !== "private") {
      const publicLink = document.createElement("a");
      publicLink.className = "btn eventCardAction";
      publicLink.href = `./events/?id=${encodeURIComponent(gd.id)}`;
      publicLink.textContent = "View / Share";
      publicLink.addEventListener("click", (e) => e.stopPropagation());
      actions.appendChild(publicLink);
    }

    el.appendChild(actions);
    el.querySelector(".cardOpenBtn")?.addEventListener("click", (e) => {
      e.stopPropagation();
      openGameDay(gd);
    });
    el.addEventListener("click", (e) => {
      if (e.target.closest("a, button")) return;
      openGameDay(gd);
    });
    pastGamedayList.appendChild(el);
  }
}

function togglePastEvents() {
  if (!pastEventsPanel || !btnPastEvents) return;
  const show = pastEventsPanel.style.display === "none";
  pastEventsPanel.style.display = show ? "" : "none";
  btnPastEvents.setAttribute("aria-expanded", String(show));
}

function setPastEventActions(isPast) {
  if (btnHostTable) {
    btnHostTable.disabled = isPast;
    btnHostTable.title = isPast ? "Past events are read-only." : "";
  }
  if (btnWantToPlay) {
    btnWantToPlay.disabled = isPast;
    btnWantToPlay.title = isPast ? "Past events are read-only." : "";
  }
}

function currentEventIsPast() {
  if (!currentGameDay) return false;
  if (currentPastGameDays.some((gd) => gd.id === currentGameDay.id)) return true;
  return isPastGameDay(currentGameDay);
}

function stopPastEventAction(ev) {
  if (!currentEventIsPast()) return false;
  ev?.stopPropagation?.();
  toast("Past events are read-only.", "info");
  return true;
}

// Seat numbers have ONE source of truth: the live roster once loaded (counting
// every signup doc, named or not), falling back to the table doc's denormalized
// counts before the roster listener delivers. Prevents visible count jumps.
function seatCounts(t) {
  const r = rosterByTableId.get(t.id);
  if (r) return { confirmed: r.confirmed.length, waitlist: r.waitlist.length };
  return { confirmed: Number(t.confirmedCount || 0), waitlist: Number(t.waitlistCount || 0) };
}

// The only writer of the seats text/bar/full state.
function refreshSeatsDom(card, t) {
  const seatsEl = card.querySelector(`[data-seats-root="${CSS.escape(String(t.id))}"]`);
  if (!seatsEl) return;
  const cap = Number(t.capacity || 0);
  const { confirmed, waitlist } = seatCounts(t);
  const textEl = seatsEl.querySelector(".seatsText");
  if (textEl) textEl.textContent = `Seats: ${confirmed}/${cap}${waitlist ? ` • Waitlist: ${waitlist}` : ""}`;
  const fillEl = seatsEl.querySelector(".seatsFill");
  if (fillEl) fillEl.style.width = `${cap ? Math.min(100, Math.round((confirmed / cap) * 100)) : 0}%`;
  const isFull = cap > 0 && confirmed >= cap;
  seatsEl.classList.toggle("is-full", isFull);

  // Seat dots: one per chair, filled as people join (the bar stays as the
  // fallback for unusually large capacities where dots would be noise).
  const pipsEl = seatsEl.querySelector(".seatPips");
  const barEl = seatsEl.querySelector(".seatsBar");
  const usePips = cap > 0 && cap <= 12;
  if (pipsEl) {
    pipsEl.style.display = usePips ? "" : "none";
    if (usePips) {
      const filled = Math.min(confirmed, cap);
      let html = "";
      for (let i = 0; i < cap; i++) {
        html += `<span class="seatDot${i < filled ? " is-filled" : ""}"></span>`;
      }
      pipsEl.innerHTML = html;
    } else {
      pipsEl.innerHTML = "";
    }
  }
  if (barEl) barEl.style.display = usePips ? "none" : "";

  // Explain the waitlist in words — the red bar alone says nothing.
  let note = seatsEl.querySelector(".seatsNote");
  if (isFull && !note) {
    note = document.createElement("span");
    note.className = "seatsNote muted";
    note.textContent = "Table full — Join adds you to the waitlist.";
    seatsEl.appendChild(note);
  } else if (!isFull && note) {
    note.remove();
  }
}

// Everything that affects a card's static markup. When unchanged, the card's
// DOM node is reused verbatim by the reconcile — preserving in-flight button
// labels, scroll position, and focus during live updates.
// "" | "started" | "past" — only meaningful for multi-day events, where a
// finished day's tables drop to the bottom and read as Past.
function tableTimeState(t) {
  const bounds = eventDayBounds();
  if (!bounds || !bounds.multiDay) return "";
  const st = asDate(t.startTime);
  if (!st) return "";
  const dayKey = centralDateKey(st);
  const todayKey = centralDateKey(new Date());
  if (dayKey < todayKey) return "past";
  if (dayKey === todayKey && st.getTime() < Date.now()) return "started";
  return "";
}

function tableRenderSig(t, isPast) {
  const isHost = !!(currentUser && currentUser.uid === t.hostUid);
  const canManage = !isPast && (isHost || isAdmin() || isOrganizerOf(currentGameDay));
  return JSON.stringify([
    asDate(t.startTime)?.getTime() ?? null,
    t.capacity, t.notes, t.gameName, t.thumbUrl, t.bggId,
    t.hostUid, t.hostDisplayName,
    Array.isArray(t.expansions) ? t.expansions.map((e) => e?.bggId) : [],
    isHost, canManage, isPast,
    currentUser?.uid || null,
    tableTimeState(t)
  ]);
}

function buildTableCard(t, isPast, sig) {
  const startTime = asDate(t.startTime);
  // Tables are same-day as their event, so time-only ("2:00 PM") reads far
  // better than 8 repeated full dates; legacy off-day rows keep the full date.
  const eventDays = currentGameDay ? eventDayKeys(currentGameDay.startsAt, currentGameDay.endsAt) : [];
  const inEvent = !!(startTime && eventDays.includes(centralDateKey(startTime)));
  const timeDisplay = startTime ? esc(inEvent ? fmtTime(startTime) : fmtDate(startTime)) : "TBD";

  const cap = Number(t.capacity || 0);
  const { confirmed, waitlist: wait } = seatCounts(t);

  const isHost = currentUser && (currentUser.uid === t.hostUid);
  const canManageEvent = isAdmin() || isOrganizerOf(currentGameDay);
  const canDelete = !isPast && (isHost || canManageEvent);
  const canEdit = !isPast && (isHost || canManageEvent);

  const bggUrl = t.bggId ? `https://boardgamegeek.com/boardgame/${encodeURIComponent(t.bggId)}` : null;
  // Custom sign-ups (food runs, setup crew) have no BGG game behind them.
  const isCustomEntry = t.isCustom === true || !t.bggId;

  const expansions = Array.isArray(t.expansions) ? t.expansions : [];
  const expLinks = expansions.map((e) => {
    const expId = e?.bggId ?? "";
    const expName = e?.name ?? "";
    const expUrl = expId ? `https://boardgamegeek.com/boardgame/${encodeURIComponent(expId)}` : null;
    return expUrl
      ? `<div><a href="${esc(expUrl)}" target="_blank" rel="noopener">${esc(expName)}</a></div>`
      : `<div>${esc(expName)}</div>`;
  });
  // Long expansion lists collapse to the first 3 with a toggle — full list
  // always reachable, cards stay scannable.
  const expansionsHtml = expLinks.length
    ? `
      <div class="muted expansionsBlock" style="margin-top:8px;">
        <div style="font-weight:600; margin-bottom:4px;">Expansions:</div>
        ${expLinks.slice(0, 3).join("")}
        ${expLinks.length > 3
          ? `<div class="expMore" hidden>${expLinks.slice(3).join("")}</div>
             <button type="button" class="btn btn-small expToggle">+${expLinks.length - 3} more</button>`
          : ""}
      </div>
    `
    : "";

  const el = document.createElement("div");
  el.className = "tablecard";
  el.dataset.tableCard = t.id;
  el.dataset.sig = sig;
  if (tableTimeState(t) === "past") el.classList.add("is-pastTable");
  el.innerHTML = `
    <div class="thumb">
      ${t.thumbUrl
        ? `<img src="${esc(t.thumbUrl)}" alt="" loading="lazy" />`
        : (isCustomEntry
            ? `<img src="./signup-sheet.png" alt="" loading="lazy" />`
            : `<div class="thumbph">🎲</div>`)}
    </div>
    <div class="body">
      <div class="row1">
        <div class="name">
          ${(() => {
            const st = tableTimeState(t);
            if (st === "past") return `<span class="timePill is-past">Past</span> `;
            if (st === "started") return `<span class="timePill is-started">Started</span> `;
            return "";
          })()}${isCustomEntry ? `<span class="signupPill">📋 Sign-up</span> ` : ""}${bggUrl ? `<a href="${esc(bggUrl)}" target="_blank" rel="noopener">${esc(t.gameName || "Game")}</a>` : esc(t.gameName || "Game")}
          <div class="gameMeta" data-game-meta ${gameMetaText(t) ? "" : "style=\"display:none;\""}>${esc(gameMetaText(t))}</div>
        </div>
        <div class="time">${timeDisplay}</div>
      </div>
      <div class="row2">
        <div class="muted">Host: <span class="hostName${isHost ? " is-you" : ""}">${esc(t.hostDisplayName || t.hostUid || "Unknown")}</span>${isHost ? " (you)" : ""}</div>
        <div class="seats" data-seats-root="${esc(t.id)}" data-cap="${cap}">
          <span class="seatsText muted">Seats: ${confirmed}/${cap}${wait ? ` • Waitlist: ${wait}` : ""}</span>
          <span class="seatPips" aria-hidden="true"></span>
          <span class="seatsBar" aria-hidden="true" style="display:none;"><span class="seatsFill" style="width:${cap ? Math.min(100, Math.round((confirmed / cap) * 100)) : 0}%"></span></span>
        </div>
      </div>
      ${t.notes ? `<div class="notes notesClamp"><span style="font-weight:600;">Notes:</span> ${esc(t.notes)}</div>` : ""}
      ${expansionsHtml}
      <div class="roster" data-roster-for="${esc(t.id)}">
        <div class="rosterTopline">${isCustomEntry ? "Sign-ups" : "Players"}</div>
        <div class="rosterGrid">
          <div class="rosterGroup">
            <div class="rosterGroupHead">
              <span>Confirmed</span>
              <span class="rosterCount" data-roster-count="confirmed">${confirmed}</span>
            </div>
            <div class="rosterNames" data-roster-kind="confirmed"><span class="rosterEmpty">None yet</span></div>
          </div>
          <div class="rosterGroup">
            <div class="rosterGroupHead">
              <span>Waitlist</span>
              <span class="rosterCount" data-roster-count="waitlist">${wait}</span>
            </div>
            <div class="rosterNames" data-roster-kind="waitlist"><span class="rosterEmpty">None yet</span></div>
          </div>
        </div>
      </div>

      ${isPast ? "" : `
      <div class="row3">
        <button class="btn btn-primary" data-action="join">Join</button>
        <button class="btn" data-action="leave">Leave</button>
        ${canEdit ? `<button class="btn" data-action="edit">Edit</button>` : ""}
        ${canDelete ? `<button class="btn btn-danger" data-action="delete">Delete</button>` : ""}
      </div>`}
    </div>
  `;

  el.querySelector(".expToggle")?.addEventListener("click", (ev) => {
    const more = el.querySelector(".expMore");
    if (!more) return;
    const show = more.hidden;
    more.hidden = !show;
    ev.currentTarget.textContent = show ? "Show fewer" : `+${expLinks.length - 3} more`;
  });

  el.querySelector('[data-action="join"]')?.addEventListener("click", async (ev) => {
    ev.stopPropagation();
    if (stopPastEventAction(ev)) return;
    if (!currentUser) return openSignInModal();

    const btn = ev.currentTarget;
    const prevLabel = btn.textContent;
    btn.disabled = true;
    btn.textContent = "Joining…";
    try {
      await fnJoinTable({ gamedayId: currentGameDayId, tableId: t.id });
      toast("You're on the list.", "success");
      // roster snapshot refreshes the button to its joined state
    } catch (e) {
      btn.disabled = false;
      btn.textContent = prevLabel;
      toast(`Join failed: ${unwrapCallableError(e)}`, "error");
    }
  });

  el.querySelector('[data-action="leave"]')?.addEventListener("click", async (ev) => {
    ev.stopPropagation();
    if (stopPastEventAction(ev)) return;
    if (!currentUser) return openSignInModal();

    // HOST LEAVE WARNING
    if (isHost) {
      const ok = await confirmDialog({
        title: "Leave & delete table?",
        message: "⚠️ You are the host.\n\nLeaving will DELETE this table and remove all players.",
        confirmLabel: "Delete table",
        danger: true
      });
      if (!ok) return;
    }

    const btn = el.querySelector('[data-action="leave"]');
    const prevLabel = btn.textContent;
    btn.disabled = true;
    btn.textContent = "Leaving…";
    try {
      await fnLeaveTable({ gamedayId: currentGameDayId, tableId: t.id });
      toast(isHost ? "Table deleted." : "You left the table.", "success");
    } catch (e) {
      btn.disabled = false;
      btn.textContent = prevLabel;
      toast(`Leave failed: ${unwrapCallableError(e)}`, "error");
    }
  });

  el.querySelector('[data-action="edit"]')?.addEventListener("click", async (ev) => {
    ev.stopPropagation();
    if (stopPastEventAction(ev)) return;
    openEditTableModal(t);
  });

  el.querySelector('[data-action="delete"]')?.addEventListener("click", async (ev) => {
    ev.stopPropagation();
    const ok = await confirmDialog({
      title: "Delete table?",
      message: "This removes the table and all of its signups.",
      confirmLabel: "Delete table",
      danger: true
    });
    if (!ok) return;
    try {
      await fnDeleteTable({ gamedayId: currentGameDayId, tableId: t.id });
      toast("Table deleted.", "success");
    } catch (e) {
      toast(`Delete failed: ${unwrapCallableError(e)}`, "error");
    }
  });

  return el;
}

// Adds a Show more/less toggle to notes that exceed the 3-line clamp.
function setupNotesClamp(card) {
  const notes = card.querySelector(".notes");
  if (!notes || card.querySelector(".notesToggle")) return;
  requestAnimationFrame(() => {
    if (!notes.isConnected || notes.scrollHeight <= notes.clientHeight + 4) return;
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "btn btn-small notesToggle";
    btn.textContent = "Show more";
    btn.addEventListener("click", () => {
      const clamped = notes.classList.toggle("notesClamp");
      btn.textContent = clamped ? "Show more" : "Show less";
    });
    notes.after(btn);
  });
}

function renderTablesPage() {
  const total = currentTables.length;
  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  currentPage = Math.max(0, Math.min(currentPage, pages - 1));
  const isPast = currentEventIsPast();

  // Multi-day events push finished days to the bottom so what's still ahead
  // leads. Single-day events keep their plain chronological order.
  const boundsForOrder = eventDayBounds();
  let ordered = currentTables;
  if (boundsForOrder && boundsForOrder.multiDay) {
    const todayKey = centralDateKey(new Date());
    const dayOf = (t) => {
      const st = asDate(t.startTime);
      return st ? centralDateKey(st) : "";
    };
    const upcoming = currentTables.filter((t) => !dayOf(t) || dayOf(t) >= todayKey);
    const finished = currentTables.filter((t) => dayOf(t) && dayOf(t) < todayKey);
    ordered = [...upcoming, ...finished];
  }

  const startIdx = currentPage * PAGE_SIZE;
  const pageItems = ordered.slice(startIdx, startIdx + PAGE_SIZE);

  const visibleIds = new Set(pageItems.map((t) => t.id));
  stopRosterListenersExcept(visibleIds);
  for (const t of pageItems) {
    if (currentGameDayId) ensureRosterListener(currentGameDayId, t.id);
  }

  if (total > PAGE_SIZE) {
    tablePager.style.display = "";
    pageInfo.textContent = `Page ${currentPage + 1} / ${pages}`;
  } else {
    tablePager.style.display = "none";
  }

  if (!pageItems.length) {
    tablesList.innerHTML = `<div class="muted">No tables yet. Tap “Host a Table” to run a game, or “Request a Game” to ask for one.</div>`;
    return;
  }

  // Clear a possible empty-state placeholder before reconciling real cards.
  if (!tablesList.querySelector("[data-table-card]")) tablesList.innerHTML = "";

  // Keyed reconcile: reuse each card whose render signature is unchanged so a
  // remote join/edit can never destroy in-flight buttons, scroll, or focus.
  const existing = new Map();
  for (const el of tablesList.querySelectorAll("[data-table-card]")) {
    existing.set(el.dataset.tableCard, el);
  }
  // Day headers are rebuilt each pass — they're cheap and carry no state.
  tablesList.querySelectorAll("[data-day-header]").forEach((el) => el.remove());

  // Multi-day events group their tables under a header per day.
  const bounds = eventDayBounds();
  const showDayHeaders = !!(bounds && bounds.multiDay);
  let lastDayKey = null;

  let cursor = null;
  for (const t of pageItems) {
    const sig = tableRenderSig(t, isPast);
    let el = existing.get(t.id);
    let isNew = false;
    if (el && el.dataset.sig !== sig) {
      const fresh = buildTableCard(t, isPast, sig);
      el.replaceWith(fresh);
      el = fresh;
      isNew = true;
    } else if (!el) {
      el = buildTableCard(t, isPast, sig);
      isNew = true;
    }
    existing.delete(t.id);

    // Day header whenever the day changes (and at the top of each page).
    if (showDayHeaders) {
      const st = asDate(t.startTime);
      const dayKey = st ? centralDateKey(st) : "";
      if (dayKey && dayKey !== lastDayKey) {
        lastDayKey = dayKey;
        const header = document.createElement("div");
        header.className = "dayHeader";
        header.setAttribute("data-day-header", dayKey);
        const dayNum = bounds.days.indexOf(dayKey);
        const todayKey = centralDateKey(new Date());
        const isFinished = dayKey < todayKey;
        const isToday = dayKey === todayKey;
        header.classList.toggle("is-past", isFinished);
        header.innerHTML = `
          <span class="dayHeaderLabel">${esc(fmtDayLabel(dayKey))}</span>
          ${dayNum >= 0 ? `<span class="dayHeaderBadge">Day ${dayNum + 1}</span>` : ""}
          ${isFinished ? `<span class="dayHeaderState is-past">Past</span>` : ""}
          ${isToday ? `<span class="dayHeaderState is-today">Today</span>` : ""}
        `;
        const at = cursor ? cursor.nextElementSibling : tablesList.firstElementChild;
        tablesList.insertBefore(header, at);
        cursor = header;
      }
    }

    // Keep DOM order aligned with the sorted data without touching settled nodes.
    const expectedNext = cursor ? cursor.nextElementSibling : tablesList.firstElementChild;
    if (el !== expectedNext) tablesList.insertBefore(el, expectedNext);
    cursor = el;

    if (isNew) {
      hydrateGameMeta(el, t);
      setupNotesClamp(el);
    }
    updateRosterDom(t.id);
    applyJoinLeaveState(el, t);
    refreshSeatsDom(el, t);
  }

  // Cards whose tables left this page (or were deleted) go away.
  for (const el of existing.values()) el.remove();
}

function wantPostHtml(p, bggUrl, canDelete = false) {
  return `
    <div class="wantGame">
      <div class="title">
        ${bggUrl ? `<a href="${esc(bggUrl)}" target="_blank" rel="noopener">${esc(p.gameName || "Game")}</a>` : esc(p.gameName || "Game")}
        <div class="gameMeta" data-game-meta ${gameMetaText(p) ? "" : "style=\"display:none;\""}>${esc(gameMetaText(p))}</div>
      </div>
    </div>
    <div class="wantDetails">
      <div class="wantBy"><span>Requested by</span> ${esc(p.createdByDisplayName || p.createdByUid || "Someone")}</div>
      ${p.notes ? `<div class="wantNote"><span>Note</span> <div class="wantNoteText">${esc(p.notes)}</div></div>` : ""}
    </div>
    ${canDelete ? `<div class="wantActions"><button class="btn btn-danger btn-small">Delete</button></div>` : ""}
  `;
}

function renderWants(items) {
  wantsList.innerHTML = "";
  const isPast = currentEventIsPast();
  if (!items.length) {
    wantsList.innerHTML = `<div class="muted">No requests yet. Tap “Request a Game” to ask for a game — a host may pick it up.</div>`;
    return;
  }

  for (const p of items) {
    const isCreator = currentUser && (currentUser.uid === p.createdByUid);
    const canDelete = !isPast && (isCreator || isAdmin() || isOrganizerOf(currentGameDay));

    const bggUrl = p.bggId ? `https://boardgamegeek.com/boardgame/${encodeURIComponent(p.bggId)}` : null;
    const el = document.createElement("div");
    el.className = "listitem wantItem";
    el.innerHTML = wantPostHtml(p, bggUrl, canDelete);

    
    const delBtn = el.querySelector("button");
    if (delBtn) {
        delBtn.addEventListener("click", async (ev) => {
            ev.stopPropagation();
            const ok = await confirmDialog({
              title: "Delete request?",
              message: `Remove the “want to play” request for ${p.gameName || "this game"}?`,
              confirmLabel: "Delete request",
              danger: true
            });
            if (!ok) return;
            try {
                await fnDeleteWantToPlay({ gamedayId: currentGameDayId, postId: p.id });
                toast("Request deleted.", "success");
            } catch (e) {
                toast(`Delete failed: ${unwrapCallableError(e)}`, "error");
            }
        });
    }

    wantsList.appendChild(el);
    hydrateGameMeta(el, p);
  }
}

// -----------------------------
// Flows
// -----------------------------
// Reflect the selected Game Day in the URL so views are shareable/bookmarkable.
function gameDayUrl(gamedayId) {
  const u = new URL(window.location.href);
  if (gamedayId) u.searchParams.set("event", gamedayId);
  else u.searchParams.delete("event");
  return u.toString();
}

function showGameDayList({ push = false } = {}) {
  stopRosterListenersExcept(new Set());
  currentGameDayId = null;
  currentGameDay = null;
  setPastEventActions(false);
  gamedayCard.style.display = "none";
  if (push) history.pushState({}, "", gameDayUrl(null));
}

function showGameDayCard() {
  gamedayCard.style.display = "";
}

// Fetch the current invite token and put the invite link on the clipboard.
// (Rules only let the organizer/admin read the token.)
async function copyInviteLink(gamedayId) {
  try {
    const snap = await getDoc(doc(db, "gamedays", gamedayId));
    const token = snap.exists() ? (snap.data() || {}).inviteToken : null;
    if (!token) return toast("No invite link yet — open the event and tap Reset Link.", "info");
    const link = `${window.location.origin}${window.location.pathname}?event=${encodeURIComponent(gamedayId)}&invite=${encodeURIComponent(token)}`;
    await navigator.clipboard.writeText(link);
    toast("Invite link copied — anyone with it can join this private event.", "success", 6000);
  } catch (e) {
    toast(`Couldn't copy the link: ${unwrapCallableError(e)}`, "error");
  }
}

function renderGameDayHeader(gd) {
  gamedayTitle.textContent = gd.title || "Game Day";
  const startsAt = asDate(gd.startsAt);
  const isPast = isPastGameDay(gd);
  const isPrivate = gd.visibility === "private";
  const canManage = isAdmin() || isOrganizerOf(gd);
  gamedayMeta.innerHTML = `
    <div class="muted">
      ${isPast ? `<span class="eventPill is-history">Past Event</span> ` : ""}
      ${isPrivate ? `<span class="eventPill is-private">🔒 Private</span> ` : ""}
      ${esc(fmtEventWhen(gd.startsAt, gd.endsAt))}${gd.location ? ` • ${esc(gd.location)}` : ""}${gd.createdByDisplayName ? ` • Hosted by ${esc(gd.createdByDisplayName)}` : ""}
    </div>
    ${isPrivate && canManage ? `
    <div class="actions inviteControls">
      <button class="btn" id="btnCopyInvite">🔗 Copy Invite Link</button>
      <button class="btn" id="btnManageInvites">Invited…</button>
      <button class="btn" id="btnResetInvite">Reset Link</button>
    </div>` : ""}
  `;
  setPastEventActions(isPast);

  if (isPrivate && canManage) {
    const buildLink = (token) =>
      `${window.location.origin}${window.location.pathname}?event=${encodeURIComponent(gd.id)}&invite=${encodeURIComponent(token)}`;

    gamedayMeta.querySelector("#btnCopyInvite")?.addEventListener("click", () => copyInviteLink(gd.id));

    gamedayMeta.querySelector("#btnResetInvite")?.addEventListener("click", async () => {
      const ok = await confirmDialog({
        title: "Reset invite link?",
        message: "The old link stops working immediately. People already invited keep their access.",
        confirmLabel: "Reset Link"
      });
      if (!ok) return;
      try {
        const r = await fnRotateInviteToken({ gamedayId: gd.id });
        await navigator.clipboard.writeText(buildLink(r.data.token));
        toast("New invite link created and copied.", "success", 6000);
      } catch (e) {
        toast(unwrapCallableError(e), "error");
      }
    });

    gamedayMeta.querySelector("#btnManageInvites")?.addEventListener("click", () => openInvitesModal(gd));
  }
}

async function openInvitesModal(gd) {
  openModal(`Invited — ${gd.title || "Game Day"}`, `<div class="modalStack"><div class="muted">Loading…</div></div>`);
  const render = async () => {
    let invites = [];
    try {
      invites = ((await fnListInvites({ gamedayId: gd.id })).data || {}).invites || [];
    } catch (e) {
      const body = document.querySelector("#modalBody");
      if (body) body.innerHTML = `<div class="modalError" style="display:block;">${esc(unwrapCallableError(e))}</div>`;
      return;
    }
    const body = document.querySelector("#modalBody");
    if (!body) return;
    const pending = invites.filter((i) => i.status === "pending");
    const approved = invites.filter((i) => i.status !== "pending");
    const row = (i, buttons) => `
      <div class="listitem" style="cursor:default;">
        <div style="flex:1; min-width:0;">
          <div class="title">${esc(i.displayName || i.uid)}</div>
          <div class="meta muted">${esc(i.addedVia === "channel-sync" ? "From Discord channel" : "Invite link")}</div>
        </div>
        ${buttons}
      </div>`;
    body.innerHTML = `
      <div class="modalStack">
        ${pending.length ? `
        <div>
          <div class="label" style="font-weight:700; margin-bottom:8px;">Waiting for approval (${pending.length})</div>
          <div class="list">
            ${pending.map((i) => row(i, `
              <button class="btn btn-small btn-primary" data-approve="${esc(i.uid)}">Approve</button>
              <button class="btn btn-small" data-deny="${esc(i.uid)}">Deny</button>
            `)).join("")}
          </div>
        </div>` : ""}
        <div>
          <div class="label" style="font-weight:700; margin-bottom:8px;">Invited (${approved.length})</div>
          <div class="muted" style="margin-bottom:8px;">Everyone here can view and join this private event.</div>
          <div class="list">
            ${approved.length ? approved.map((i) => row(i, `
              <button class="btn btn-small btn-danger" data-uninvite="${esc(i.uid)}">Remove</button>
            `)).join("") : `<div class="muted">Nobody yet — copy the invite link and share it.</div>`}
          </div>
        </div>
      </div>
    `;
    const wire = (attr, fn, done) => {
      body.querySelectorAll(`[${attr}]`).forEach((btn) => {
        btn.addEventListener("click", async () => {
          btn.disabled = true;
          try {
            await fn(btn.getAttribute(attr));
            toast(done, "success");
            await render();
          } catch (e) {
            btn.disabled = false;
            toast(unwrapCallableError(e), "error");
          }
        });
      });
    };
    wire("data-approve", (uid) => fnReviewInvite({ gamedayId: gd.id, uid, approve: true }), "Approved — they're in.");
    wire("data-deny", (uid) => fnReviewInvite({ gamedayId: gd.id, uid, approve: false }), "Request denied.");
    wire("data-uninvite", (uid) => fnRemoveInvite({ gamedayId: gd.id, uid }), "Removed from the invite list.");
  };
  await render();
}

// Refresh the private-events merge from the server (also powers My Events).
async function refreshMyActivitySummary() {
  if (!currentUser) {
    myPrivateGamedays = [];
    if (lastGameDaysRaw.length) renderGameDays(lastGameDaysRaw);
    return;
  }
  try {
    const r = await fnGetMyActivity({});
    const items = (r.data && r.data.items) || [];
    myActivity = items;
    const seen = new Map();
    // Group roles per gameday so pending-only events stay un-openable.
    const rolesByGd = new Map();
    for (const it of items) {
      const arr = rolesByGd.get(it.gamedayId) || [];
      arr.push(it.role);
      rolesByGd.set(it.gamedayId, arr);
    }
    for (const it of items) {
      const roles = rolesByGd.get(it.gamedayId) || [];
      if (roles.length && roles.every((r) => r === "requested")) continue;
      if (it.visibility === "private" && !seen.has(it.gamedayId)) {
        seen.set(it.gamedayId, {
          id: it.gamedayId,
          title: it.title,
          startsAt: it.startsAt,
          location: it.location,
          status: it.status,
          visibility: "private",
          createdBy: it.createdBy || null
        });
      }
    }
    myPrivateGamedays = [...seen.values()];
    renderGameDays(lastGameDaysRaw);
  } catch {
    /* non-fatal: public list still works */
  }
}

async function tryRedeemPendingInvite() {
  if (!pendingInvite || !currentUser) return;
  const inv = pendingInvite;
  pendingInvite = null;
  try {
    const r = await fnRedeemInvite({ gamedayId: inv.gamedayId, token: inv.token });
    if (r.data?.pending) {
      toast(`Request sent for “${r.data?.title || "the event"}” — the organizer will approve you soon.`, "success", 8000);
      history.replaceState({}, "", gameDayUrl(null));
      await refreshMyActivitySummary();
      return;
    }
    toast(`Invite accepted — welcome to “${r.data?.title || "the event"}”!`, "success", 6000);
    await refreshMyActivitySummary();
    initialEventId = inv.gamedayId;
    tryOpenDeepLink();
  } catch (e) {
    toast(unwrapCallableError(e), "error", 8000);
  }
}

function openGameDay(gd, { push = true, deepLink = false } = {}) {
  currentGameDayId = gd.id;
  currentGameDay = gd;
  currentPage = 0;
  renderGameDayHeader(gd);
  showGameDayCard();
  subscribeGameDayDetails(gd.id);
  if (deepLink) {
    // A deep-linked load has only one history entry; give Back somewhere to
    // land (the list) instead of leaving the site.
    history.replaceState({}, "", gameDayUrl(null));
    history.pushState({ event: gd.id }, "", gameDayUrl(gd.id));
  } else if (push) {
    history.pushState({ event: gd.id }, "", gameDayUrl(gd.id));
  }
}

async function hostTableFlow(gamedayId) {
  const thing = await openGameSearchModal({ title: "Select a game to host" });
  if (!thing) return;
  await openHostTableFormModal({ gamedayId, thing });
}

async function wantToPlayFlow(gamedayId) {
  const thing = await openGameSearchModal({ title: "Select a game to request" });
  if (!thing) return;
  await openWantToPlayFormModal({ gamedayId, thing });
}

function openCreateGameDayModal() {
  const defaultStart = fmtCentralDatetimeValue(new Date(Date.now() + 24 * 60 * 60 * 1000));
  openModal("Create Game Day", `
    <div class="modalStack">
      <label class="field">
        <div class="label">Title</div>
        <input id="gdTitle" class="input" type="text" data-autofocus placeholder="e.g. Saturday Board Game Day" />
      </label>

      <div class="modalGrid">
        <label class="field">
          <div class="label">Start time (Central / Texas)</div>
          <input id="gdStart" class="input" type="datetime-local" value="${esc(defaultStart)}" />
          <div class="hint muted">Interpreted as America/Chicago time.</div>
        </label>

        <label class="field">
          <div class="label">Last day (optional)</div>
          <input id="gdEndDate" class="input" type="date" />
          <div class="hint muted">Set this for conventions that run several days.</div>
        </label>

        <label class="field fieldSpan2">
          <div class="label">Location (optional)</div>
          <input id="gdLocation" class="input" type="text" placeholder="e.g. DFW Gaming Village" />
        </label>

        <label class="field fieldSpan2">
          <div class="label">Visibility</div>
          <select id="gdVisibility" class="input">
            <option value="public">Public — listed for everyone</option>
            <option value="private">Private — invite link only</option>
          </select>
          <div class="hint muted">Private events are hidden from the public lists; you'll get an invite link to share.</div>
        </label>

        <label class="field fieldSpan2 check" id="gdApprovalRow" style="display:none;">
          <input id="gdInviteApproval" type="checkbox" />
          <span>Require approval — people who use the invite link wait for your OK before they can see or join. Stops forwarded links.</span>
        </label>
      </div>

      <div class="modalStatus" id="modalStatus" style="display:none;"></div>
      <div class="modalError" id="modalError" style="display:none;"></div>

      <div class="modalActions">
        <button class="btn" id="btnCancel">Cancel</button>
        <button class="btn btn-primary" id="btnCreate">Create Game Day</button>
      </div>
    </div>
  `);

  qs("#btnCancel").addEventListener("click", closeModal);

  qs("#gdVisibility")?.addEventListener("change", () => {
    const row = qs("#gdApprovalRow");
    if (row) row.style.display = qs("#gdVisibility").value === "private" ? "" : "none";
  });

  qs("#btnCreate").addEventListener("click", async () => {
    showInlineError("");

    const title = String(qs("#gdTitle").value || "").trim();
    if (!title) {
      showInlineError("Please enter a title.");
      return;
    }

    // datetime-local is interpreted as Central, matching the rest of the app.
    const gdStartVal = String(qs("#gdStart").value || "");
    const startIso = parseDatetimeLocalToISO(gdStartVal);
    if (!startIso) {
      showInlineError("Please choose a valid start time.");
      return;
    }

    // Validate the optional last day BEFORE disabling the buttons, so a bad
    // value leaves the form usable.
    const endDay = String(qs("#gdEndDate")?.value || "").trim();
    if (endDay && endDay < gdStartVal.slice(0, 10)) {
      showInlineError("The last day can't be before the start.");
      return;
    }
    const endsAt = endDay ? parseDatetimeLocalToISO(`${endDay}T23:59`) : null;

    const location = String(qs("#gdLocation").value || "").trim();

    const btnCreate = qs("#btnCreate");
    const btnCancel = qs("#btnCancel");
    try {
      btnCreate.disabled = true;
      btnCancel.disabled = true;
      showInlineStatus("Creating…");
      const visibility = qs("#gdVisibility")?.value === "private" ? "private" : "public";
      const inviteApproval = visibility === "private" && !!qs("#gdInviteApproval")?.checked;
      await fnCreateGameDay({ title, location, startsAt: startIso, endsAt, visibility, inviteApproval });
      closeModal();
      if (visibility === "private") {
        toast("Private event created — open it and tap 🔗 Copy Invite Link to invite people.", "success", 8000);
        refreshMyActivitySummary();
      } else {
        toast("Game Day created.", "success");
      }
    } catch (e) {
      btnCreate.disabled = false;
      btnCancel.disabled = false;
      showInlineStatus("");
      showInlineError(unwrapCallableError(e));
    }
  });
}



// -----------------------------
// Host Guide (bring the planner bot to your own Discord)
// -----------------------------
function openHostGuideModal() {
  openModal("Host Guide", `
    <div class="modalStack guide">

      <div class="muted guideIntro">
        You can create and run Game Days — public or private — right from this page,
        with an optional live board in your own Discord server. Here's the whole
        process, start to finish.
      </div>

      <div class="guideSection">
        <div class="guideHead"><span class="guideNum">1</span> Create your Game Day</div>
        <div class="muted">Tap <b>Create Game Day</b> and set the title, start time (Central), and location. Then pick who can see it:</div>
        <ul class="guideList muted">
          <li><b>🌐 Public</b> — listed on the planner and events pages for everyone to browse, share, and join.</li>
          <li><b>🔒 Private</b> — completely hidden. Only people you invite can see it or join. Tick <b>Require approval</b> and anyone using your invite link waits for your OK first — that stops forwarded links.</li>
        </ul>
      </div>

      <div class="guideSection">
        <div class="guideHead"><span class="guideNum">2</span> Private events: inviting people</div>
        <ul class="guideList muted">
          <li><b>🔗 Copy Invite Link</b> — on the event card or inside the event — and share it. Anyone with the link joins instantly (or requests to join, if approval is on).</li>
          <li><b>Invited…</b> shows everyone with access. Approve or deny pending requests, and remove anyone, anytime.</li>
          <li><b>Reset Link</b> instantly kills a leaked link. People already invited keep their access.</li>
          <li>Bind the event to a <b>private Discord channel</b> (step 4) and everyone in that channel is invited automatically.</li>
        </ul>
      </div>

      <div class="guideSection">
        <div class="guideHead"><span class="guideNum">3</span> Running the day</div>
        <ul class="guideList muted">
          <li>Attendees (and you) tap <b>Host a Table</b> to run a game — pick it from BoardGameGeek, set seats, a start time, and any expansions.</li>
          <li><b>Request a Game</b> posts a wish — anyone can pick it up and host it.</li>
          <li>Joining a full table adds you to the <b>waitlist</b>; when a seat opens, the first in line is promoted automatically.</li>
          <li>As organizer you can edit or delete any table or request in your event. Everything updates live for everyone — web and Discord.</li>
        </ul>
      </div>

      <div class="guideSection">
        <div class="guideHead"><span class="guideNum">4</span> Discord — optional, but great</div>
        <div class="muted" style="margin-bottom:10px;">Put a live, self-updating board in your own server. You need the <b>Manage Server</b> permission there. The bot only posts and pins its board — it can't read your messages.</div>
        <a class="btn btn-primary" href="${BOT_INVITE_URL}" target="_blank" rel="noopener">➕ Add DFWGV Planner Bot to your server</a>
        <ul class="guideList muted" style="margin-top:12px;">
          <li>In the channel that should show the board, run <code>/planner_bind</code> and pick your event (only yours appear). Or create + bind in one step with <code>/gameday_create_and_bind</code>.</li>
          <li>Binding a <b>private</b> event auto-invites everyone currently in the channel; run <code>/planner_invite_sync</code> anytime to pick up new members.</li>
          <li>The pinned board syncs both ways — joins in Discord appear on the web and vice versa, live.</li>
          <li>Handy: <code>/planner_event</code> (what's bound here), <code>/planner_refresh</code>, <code>/planner_unbind</code>.</li>
        </ul>
      </div>

      <div class="guideSection">
        <div class="guideHead"><span class="guideNum">5</span> Your tools</div>
        <ul class="guideList muted">
          <li><a href="./admin/">Manage Events</a> (top nav) — edit your event's details, watch table signups live, and copy the exact Discord bind command.</li>
          <li><b>📅 My Profile and Events</b> (top right) — everything you organize, host, or have joined, across all events, current and past.</li>
        </ul>
      </div>

      <div class="modalActions">
        <button class="btn" id="btnCloseGuide">Close</button>
      </div>
    </div>
  `);
  qs("#btnCloseGuide")?.addEventListener("click", closeModal);
}

// -----------------------------
// My Events hub: account, linked sign-ins, and activity across all events
// -----------------------------
let myActivity = null; // cached items from getMyActivity

function activityBadge(item) {
  const label = item.role === "organizing" ? "Organizing"
    : item.role === "hosting" ? `Hosting: ${item.gameName}`
    : item.role === "waitlist" ? `Waitlist: ${item.gameName}`
    : item.role === "invited" ? "Invited"
    : item.role === "requested" ? "Waiting for approval"
    : `Playing: ${item.gameName}`;
  const cls = item.role === "organizing" ? "is-organizing"
    : item.role === "hosting" ? "is-hosting"
    : item.role === "waitlist" ? "is-waitlist"
    : item.role === "invited" ? "is-invited"
    : item.role === "requested" ? "is-requested"
    : "is-playing";
  return `<span class="activityBadge ${cls}">${esc(label)}</span>`;
}

function renderMyActivity(tab) {
  const host = qs("#activityList");
  if (!host) return;
  if (!myActivity) {
    host.innerHTML = `<div class="muted">Loading your activity…</div>`;
    return;
  }

  // Group items by game day, split into upcoming vs past.
  const groups = new Map();
  for (const item of myActivity) {
    let g = groups.get(item.gamedayId);
    if (!g) {
      g = { gamedayId: item.gamedayId, title: item.title, startsAt: item.startsAt, location: item.location, items: [] };
      groups.set(item.gamedayId, g);
    }
    g.items.push(item);
  }
  const all = [...groups.values()];
  const wanted = all.filter((g) => (tab === "past") === isPastGameDay(g));
  wanted.sort((a, b) => {
    const at = asDate(a.startsAt)?.getTime() ?? 0;
    const bt = asDate(b.startsAt)?.getTime() ?? 0;
    return tab === "past" ? bt - at : at - bt;
  });

  if (!wanted.length) {
    host.innerHTML = `<div class="muted">${tab === "past"
      ? "No past events yet — your history will build up here."
      : "Nothing coming up yet. Browse the game days and join a table!"}</div>`;
    return;
  }

  host.innerHTML = wanted.map((g) => `
    <div class="listitem activityGroup" data-open-gd="${esc(g.gamedayId)}">
      <div style="flex:1; min-width:0;">
        <div class="title">${esc(g.title)}</div>
        <div class="meta muted">${esc(fmtDate(g.startsAt))}${g.location ? ` • ${esc(g.location)}` : ""}</div>
        <div class="activityBadges">${g.items.map(activityBadge).join("")}</div>
      </div>
    </div>
  `).join("");

  host.querySelectorAll("[data-open-gd]").forEach((el) => {
    el.addEventListener("click", () => {
      const id = el.getAttribute("data-open-gd");
      const gd = [...currentGameDays, ...currentPastGameDays, ...myPrivateGamedays].find((x) => x.id === id);
      const group = (myActivity || []).filter((x) => x.gamedayId === id);
      if (group.length && group.every((x) => x.role === "requested")) {
        toast("Your request is waiting for the organizer's approval.", "info");
      } else if (gd) {
        closeModal();
        openGameDay(gd);
      } else {
        toast("That event isn't currently published.", "info");
      }
    });
  });
}

async function openMyEventsModal() {
  if (!currentUser) return openSignInModal();

  const isDiscordAccount = !!currentUser.uid?.startsWith("discord:");
  const googleInfo = (currentUser.providerData || []).find((pd) => pd.providerId === "google.com");
  const googleLinked = !!googleInfo;

  openModal("My Profile and Events", `
    <div class="modalStack">
      <div class="accountRow">
        <div style="min-width:0;">
          <div class="label">Nickname</div>
          <div class="muted">${esc(myRole.nickname || "(none — rosters show your sign-in name)")}</div>
        </div>
        <button class="btn btn-small" id="btnMeNickname">Change</button>
      </div>

      <div class="accountRow">
        <div style="min-width:0;">
          <div class="label">Discord</div>
          <div class="muted">${isDiscordAccount
            ? "Linked — this account signs in with Discord"
            : "Not linked. To use Discord, sign out and sign in with Discord — then link Google there so both open this same account."}</div>
        </div>
        ${isDiscordAccount ? `<span class="eventPill">Linked</span>` : ""}
      </div>

      <div class="accountRow">
        <div style="min-width:0;">
          <div class="label">Google</div>
          <div class="muted">${googleLinked
            ? esc(googleInfo.email || "Linked")
            : "Not linked. Link it and you can sign in either way — same account, same signups."}</div>
        </div>
        ${googleLinked
          ? `<span class="eventPill">Linked</span>`
          : (isDiscordAccount ? `<button class="btn btn-small" id="btnLinkGoogle">Link Google</button>` : "")}
      </div>

      <div class="tabRow">
        <button class="btn tabBtn is-active" data-tab="upcoming">Current &amp; Upcoming</button>
        <button class="btn tabBtn" data-tab="past">Past</button>
      </div>
      <div id="activityList" class="list"><div class="muted">Loading your activity…</div></div>
    </div>
  `);

  qs("#btnMeNickname")?.addEventListener("click", () => openNicknameModal({ returnToMyEvents: true }));

  qs("#btnLinkGoogle")?.addEventListener("click", async () => {
    try {
      const { GoogleAuthProvider, linkWithPopup } = await import("https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js");
      await linkWithPopup(auth.currentUser, new GoogleAuthProvider());
      toast("Google linked! You can now sign in with either.", "success");
      openMyEventsModal();
    } catch (e) {
      if (e?.code === "auth/credential-already-in-use") {
        toast("That Google account already has its own planner account here. Use a different Google account, or keep them separate.", "error", 8000);
      } else if (e?.code !== "auth/popup-closed-by-user" && e?.code !== "auth/cancelled-popup-request") {
        toast(`Link failed: ${unwrapCallableError(e)}`, "error");
      }
    }
  });

  qs("#activityList")?.parentElement?.querySelectorAll(".tabBtn").forEach((btn) => {
    btn.addEventListener("click", () => {
      qs("#activityList")?.parentElement?.querySelectorAll(".tabBtn").forEach((b) => b.classList.toggle("is-active", b === btn));
      renderMyActivity(btn.getAttribute("data-tab"));
    });
  });

  try {
    const r = await fnGetMyActivity({});
    myActivity = (r.data && r.data.items) || [];
    renderMyActivity("upcoming");
  } catch (e) {
    const host = qs("#activityList");
    if (host) host.innerHTML = `<div class="modalError" style="display:block;">${esc(unwrapCallableError(e))}</div>`;
  }
}

// -----------------------------
// Nickname
// -----------------------------
function openNicknameModal(opts = {}) {
  openModal("Set Nickname", `
    <div class="modalStack">
      <label class="field">
        <div class="label">Display name</div>
        <input id="nickInput" class="input" type="text" data-autofocus maxlength="32" placeholder="How your name appears on game days" />
        <div class="hint muted">2–32 characters. Updates everywhere your name appears — including the Discord board.</div>
      </label>
      <div class="modalStatus" id="modalStatus" style="display:none;"></div>
      <div class="modalError" id="modalError" style="display:none;"></div>
      <div class="modalActions">
        <button class="btn" id="btnCancel">Cancel</button>
        <button class="btn btn-primary" id="btnSaveNick">Save</button>
      </div>
    </div>
  `);

  qs("#nickInput").value = myRole.nickname || "";
  qs("#btnCancel").addEventListener("click", closeModal);

  const save = async () => {
    const nick = String(qs("#nickInput").value || "").trim();
    if (nick.length < 2 || nick.length > 32) {
      showInlineError("Nickname must be 2–32 characters.");
      return;
    }
    const btn = qs("#btnSaveNick");
    btn.disabled = true;
    showInlineError("");
    showInlineStatus("Saving everywhere…");
    try {
      await fnSetNickname({ nickname: nick });
      myRole.nickname = nick;
      setAuthStatus(`Signed in as: ${nick}`);
      closeModal();
      toast("Nickname updated everywhere.", "success");
      if (opts.returnToMyEvents) openMyEventsModal();
    } catch (e) {
      btn.disabled = false;
      showInlineStatus("");
      showInlineError(unwrapCallableError(e));
    }
  };

  qs("#btnSaveNick").addEventListener("click", save);
  qs("#nickInput").addEventListener("keydown", (ev) => {
    if (ev.key === "Enter") save();
  });
}

// -----------------------------
// Event wiring
// -----------------------------
if (btnSignIn) btnSignIn.addEventListener("click", () => openSignInModal());

if (btnBecomeHost) btnBecomeHost.addEventListener("click", async () => {
  if (!currentUser) return openSignInModal();
  const ok = await confirmDialog({
    title: "Request organizer access?",
    message: "This asks the site owner for permission to create and manage your own Game Days.",
    confirmLabel: "Send request"
  });
  if (!ok) return;
  try {
    await fnRequestHostAccess({});
    myRole.requested = true;
    applyRoleUI();
    toast("Request sent! You'll be able to host once it's approved.", "success");
  } catch (e) {
    toast(unwrapCallableError(e), "error");
  }
});

if (btnHostGuide) btnHostGuide.addEventListener("click", openHostGuideModal);

if (btnNickname) btnNickname.addEventListener("click", () => {
  if (!currentUser) return openSignInModal();
  openNicknameModal();
});

if (btnMyEvents) btnMyEvents.addEventListener("click", () => {
  if (!currentUser) return openSignInModal();
  openMyEventsModal();
});



if (btnSignOut) btnSignOut.addEventListener("click", async () => {
  await signOut(auth);
});

if (btnCreateGameDay) btnCreateGameDay.addEventListener("click", async () => {
  if (!currentUser) return openSignInModal();
  openCreateGameDayModal();
});

if (btnPastEvents) btnPastEvents.addEventListener("click", togglePastEvents);

if (btnBack) btnBack.addEventListener("click", () => {
  showGameDayList({ push: true });
});

if (btnHostTable) btnHostTable.addEventListener("click", async () => {
  try {
    if (stopPastEventAction()) return;
    if (!currentUser) {
      openSignInModal();
      return;
    }
    if (!currentGameDayId) {
      toast("Open a Game Day first, then host a table.", "info");
      return;
    }

    await hostTableFlow(currentGameDayId);
  } catch (e) {
    console.error("Host Table failed:", e);
    toast(`Host Table failed: ${e?.message || e}`, "error");
  }
});


if (btnWantToPlay) btnWantToPlay.addEventListener("click", async () => {
  if (stopPastEventAction()) return;
  if (!currentUser) return openSignInModal();
  if (!currentGameDayId) return;
  await wantToPlayFlow(currentGameDayId);
});

// Browser back/forward navigates between the list and a Game Day.
window.addEventListener("popstate", () => {
  const id = new URLSearchParams(window.location.search).get("event");
  if (!id) return showGameDayList();
  const gd = [...currentGameDays, ...currentPastGameDays].find((g) => g.id === id);
  if (gd) {
    openGameDay(gd, { push: false });
  } else {
    // Snapshot data may not have arrived yet — re-arm the deep link so the
    // next game-days snapshot opens it, instead of stranding the URL.
    initialEventId = id;
    showGameDayList();
  }
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
  // Reset the role synchronously so a previous user's buttons never flash
  // while the server-side role check is in flight.
  myRole = { owner: false, host: false, requested: false };
  if (user) {
    const name = await displayNameForUser(user);
    lastDisplayName = name;
    setAuthStatus(`Signed in as: ${name}`);
  } else {
    lastDisplayName = "";
    setAuthStatus("Not signed in.");
  }
  setButtonsForAuth(user);

  // Re-render to show/hide owner-only controls (delete/edit, want-to-play delete)
  // on auth change. Both tables and wants are kept in state so both refresh.
  if (currentGameDayId) {
    renderTablesPage();
    renderWants(currentPosts);
  }

  // Resolve platform role (owner/host) server-side; re-applies role UI when done.
  refreshMyRole();
  refreshMyActivitySummary();
  tryRedeemPendingInvite();

  // Arrived on an invite link while signed out: prompt once.
  if (!user && pendingInvite && !invitePromptShown) {
    invitePromptShown = true;
    openSignInModal("You've been invited to a private event — sign in to accept the invite.");
  }
});

// A day rolling over is a clock event, not a data change — nothing would
// otherwise redraw the board at midnight, so tick the views along.
let lastTickDayKey = centralDateKey(new Date());
setInterval(() => {
  const nowKey = centralDateKey(new Date());
  const dayChanged = nowKey !== lastTickDayKey;
  lastTickDayKey = nowKey;
  if (!currentGameDayId) return;
  const bounds = eventDayBounds();
  if (!bounds || !bounds.multiDay) return;
  // Every minute keeps "Started" honest; a day change reshuffles the groups.
  renderTablesPage();
  if (dayChanged && lastGameDaysRaw.length) renderGameDays(lastGameDaysRaw);
}, 60 * 1000);

// start
await handleDiscordCallbackIfPresent();
subscribeGameDays();
showGameDayList();
