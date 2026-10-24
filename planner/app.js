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
  limit,
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
  eventEndTimeLabel,
  isPastEventDates,
  shortExpansionName,
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
} from "./shared.js?v=20260817-p39";

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
const fnToggleWantInterest = httpsCallable(functions, "toggleWantInterest");
const fnMarkNotificationsRead = httpsCallable(functions, "markNotificationsRead");
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

const btnBecomeHost = document.querySelector("#btnBecomeHost");
const btnNickname = document.querySelector("#btnNickname");
const btnMyEvents = document.querySelector("#btnMyEvents");
const btnInbox = document.querySelector("#btnInbox");
const inboxBadge = document.querySelector("#inboxBadge");
const btnHostGuide = document.querySelector("#btnHostGuide");
const acctWrap = document.querySelector("#acctWrap");
const btnAccount = document.querySelector("#btnAccount");
const acctMenu = document.querySelector("#acctMenu");

// Discord bot invite: same application as OAuth. Permissions = View Channels,
// Send Messages, Manage Messages (pinning), Embed Links, Read Message History.
const BOT_INVITE_URL =
  `https://discord.com/oauth2/authorize?client_id=${encodeURIComponent(DISCORD_CLIENT_ID)}` +
  `&scope=bot%20applications.commands&permissions=93184`;

const gdRail = document.querySelector("#gdRail");
const gdPicker = document.querySelector("#gdPicker");
const gamedayCard = document.querySelector("#gamedayCard");
const gamedayTitle = document.querySelector("#gamedayTitle");
const gamedayMeta = document.querySelector("#gamedayMeta");
const gdKicker = document.querySelector("#gdKicker");
const gdActs = document.querySelector("#gdActs");
const gdStats = document.querySelector("#gdStats");
const evBg = document.querySelector("#evBg");

const btnHostTable = document.querySelector("#btnHostTable");
const btnWantToPlay = document.querySelector("#btnWantToPlay");

const dayTabsEl = document.querySelector("#dayTabs");
const tTitle = document.querySelector("#tTitle");
const tSub = document.querySelector("#tSub");
const tablesList = document.querySelector("#tablesList");
const wantsList = document.querySelector("#wantsList");
const wantsCount = document.querySelector("#wantsCount");
const yourDayEl = document.querySelector("#yourDay");
const ydTitle = document.querySelector("#ydTitle");
const ydCount = document.querySelector("#ydCount");

const sheetEl = document.querySelector("#tableSheet");
const sheetBody = document.querySelector("#sheetBody");
const sheetScrim = document.querySelector("#sheetScrim");

// Stroke icon set, referenced as <use href="#i-name"> (static markup included).
const ICONS = {
  cal: '<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',
  pin: '<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0116 0z"/><circle cx="12" cy="10" r="3"/>',
  user: '<path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/>',
  users: '<path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/>',
  lock: '<rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/>',
  link: '<path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/>',
  clip: '<path d="M16 4h2a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h2"/><rect x="8" y="2" width="8" height="4" rx="1"/>',
  bell: '<path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  right: '<path d="M9 18l6-6-6-6"/>',
  down: '<path d="M6 9l6 6 6-6"/>',
  pencil: '<path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 013 3L7 19l-4 1 1-4z"/>',
  trash: '<path d="M3 6h18M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6M10 11v6M14 11v6M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2"/>',
  ext: '<path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3"/>',
  check: '<path d="M20 6L9 17l-5-5"/>',
  clock: '<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',
  dice: '<rect x="3" y="3" width="18" height="18" rx="3"/><circle cx="8.5" cy="8.5" r="1.25" fill="currentColor" stroke="none"/><circle cx="15.5" cy="8.5" r="1.25" fill="currentColor" stroke="none"/><circle cx="12" cy="12" r="1.25" fill="currentColor" stroke="none"/><circle cx="8.5" cy="15.5" r="1.25" fill="currentColor" stroke="none"/><circle cx="15.5" cy="15.5" r="1.25" fill="currentColor" stroke="none"/>',
  book: '<path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/>',
  hand: '<path d="M18 11V6a2 2 0 00-4 0v5"/><path d="M14 10V4a2 2 0 00-4 0v6"/><path d="M10 10.5V6a2 2 0 00-4 0v8"/><path d="M18 8a2 2 0 014 0v6a8 8 0 01-8 8h-2a8 8 0 01-8-8v-1"/>',
  more: '<circle cx="12" cy="12" r="1.3" fill="currentColor" stroke="none"/><circle cx="19" cy="12" r="1.3" fill="currentColor" stroke="none"/><circle cx="5" cy="12" r="1.3" fill="currentColor" stroke="none"/>',
  shield: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>',
  x: '<path d="M18 6L6 18M6 6l12 12"/>',
  rotate: '<path d="M21 2v6h-6"/><path d="M3 12a9 9 0 0115-6.7L21 8"/><path d="M3 22v-6h6"/><path d="M21 12a9 9 0 01-15 6.7L3 16"/>',
  share: '<circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="M8.59 13.51l6.83 3.98M15.41 6.51l-6.82 3.98"/>',
  logout: '<path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"/>',
  star: '<path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>',
  history: '<path d="M3 3v5h5"/><path d="M3.05 13A9 9 0 106 5.3L3 8"/><path d="M12 7v5l4 2"/>',
  login: '<path d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4M10 17l5-5-5-5M15 12H3"/>'
};
document.body.insertAdjacentHTML("afterbegin",
  '<svg width="0" height="0" style="position:absolute" aria-hidden="true" focusable="false">' +
  Object.keys(ICONS).map((k) => `<symbol id="i-${k}" viewBox="0 0 24 24">${ICONS[k]}</symbol>`).join("") + "</svg>");
const ic = (name, cls) => `<svg class="ico${cls ? " " + cls : ""}" aria-hidden="true"><use href="#i-${name}"/></svg>`;

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

// The open game day's tables and requests. No pager: every table for the
// selected day shows, grouped under its start time.
let currentTables = [];
let currentPosts = [];
let showPastDays = false;    // date rail: Upcoming vs Past
let pickerOpen = false;      // phone "Change" list
let activeDayKey = null;     // selected day tab on multi-day events
let sheetTableId = null;     // table whose details sheet is open
let sheetBusy = false;       // an action in the sheet is in flight
let sheetOpener = null;
const notesOpen = new Set();
const expOpen = new Set();
let lastLayoutSig = "";
let tablesLoaded = false;
let gameDaysLoaded = false;

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

  // When the organizer set a wrap-up time, tables can't be scheduled past it.
  const endsAtDate = asDate(currentGameDay.endsAt);
  const endsLabel = eventEndTimeLabel(currentGameDay.endsAt);
  const max = endsAtDate ? fmtCentralDatetimeValue(endsAtDate) : `${last}T23:59`;

  // Days already behind us can't take new tables, so on day 2 of a convention
  // the picker starts at day 2 rather than letting you schedule into day 1.
  const earliestDay = todayKey > first ? todayKey : first;

  return {
    day: first,
    days,
    multiDay,
    firstDay: first,
    lastDay: last,
    todayKey,
    earliestDay,
    startsLabel: fmtTime(startsAt),
    endsLabel,
    isEventDay: (key) => days.includes(key),
    isPastDay: (key) => !!key && key < todayKey,
    label: (multiDay
      ? `${fmtDayLabel(first)} – ${fmtDayLabel(last)}`
      : fmtDayLabel(first)) + (endsLabel ? `, ending ${endsLabel}` : ""),
    min: `${earliestDay}T00:00`,
    max,
    default: `${defaultDay}T${centralTimeHHMM(startsAt)}`
  };
}

function isPastGameDay(gd) {
  // Multi-day events stay current through their final day.
  return isPastEventDates(gd?.startsAt, gd?.endsAt);
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
  if (year) parts.push(year);
  if (rating) parts.push(`★ ${rating}`);
  return parts.join(" · ");
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
    host.hidden = false;
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
      toast(`Welcome!${shownAs} Want a different name? Open your account menu (top right) and choose Change nickname.`, "info", 8000);
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

function canCreateGameDays() {
  return !!currentUser && (myRole.owner || myRole.host);
}

function applyRoleUI() {
  const signedIn = !!currentUser;
  if (btnBecomeHost) {
    const show = signedIn && !myRole.owner && !myRole.host;
    btnBecomeHost.style.display = show ? "" : "none";
    btnBecomeHost.disabled = myRole.requested;
    const label = btnBecomeHost.querySelector("span");
    if (label) label.textContent = myRole.requested ? "Organizer request pending" : "Request organizer access";
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
  updateAccountUI();
  // Organizer-only controls (create, invites, delete, edit) are rendered.
  if (lastGameDaysRaw.length) renderGameDays(lastGameDaysRaw);
  if (currentGameDay) renderGameDayHeader(currentGameDay);
  if (currentGameDayId) {
    renderTablesPage({ force: true });
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
      const guests = Math.max(0, Number(s.guestCount || 0));

      if (s.status === "waitlist") {
          waitlist.push({ name, uid, guests });
          waitlistIds.add(uid);
      } else {
          confirmed.push({ name, uid, guests });
          confirmedIds.add(uid);
      }
    });

    const seats = (list) => list.reduce((n, e) => n + 1 + e.guests, 0);
    rosterByTableId.set(tableId, {
      confirmed, waitlist, confirmedIds, waitlistIds,
      confirmedSeats: seats(confirmed), waitlistSeats: seats(waitlist)
    });
    updateRosterDom(tableId);
    // Targeted button refresh instead of a full page re-render (avoids flicker).
    const card = tablesList?.querySelector?.(`[data-table-card="${CSS.escape(String(tableId))}"]`);
    const t = currentTables.find((x) => x.id === tableId);
    if (card && t) applyJoinLeaveState(card, t);
  });

  rosterUnsubsByTableId.set(tableId, unsub);
}

// A live roster changed: refresh that table's card, its sheet if open, and
// everything summarised from rosters (Your day, the header stats).
function updateRosterDom(tableId) {
  const t = currentTables.find((x) => x.id === tableId);
  if (!t) return;
  const card = tableCardEl(tableId);
  if (card) refreshCardState(card, t);
  if (sheetTableId === tableId) renderSheet();
  renderYourDay();
  renderStats();
}

function tableCardEl(tableId) {
  return tablesList?.querySelector?.(`[data-table-card="${CSS.escape(String(tableId))}"]`) || null;
}

function isCustomTable(t) {
  return t.isCustom === true || !t.bggId;
}

// "hosting" | "joined" | "waitlist" | null, for the signed-in user.
function myTableStatus(t) {
  const uid = currentUser?.uid;
  if (!uid) return null;
  if (t.hostUid && uid === t.hostUid) return "hosting";
  const r = rosterByTableId.get(t.id);
  if (!r) return null;
  if (r.confirmedIds.has(uid)) return "joined";
  if (r.waitlistIds.has(uid)) return "waitlist";
  return null;
}

function myWaitPos(t) {
  const r = rosterByTableId.get(t.id);
  const uid = currentUser?.uid;
  if (!r || !uid) return 0;
  return r.waitlist.findIndex((e) => e.uid === uid) + 1;
}

function tableIsFull(t) {
  const cap = Number(t.capacity || 0);
  return cap > 0 && seatCounts(t).confirmed >= cap;
}

function tablePillsHtml(t) {
  const s = myTableStatus(t);
  const ts = tableTimeState(t);
  const out = [];
  if (s === "hosting") out.push(`<span class="pill pill-red">${ic("star")}Hosting</span>`);
  else if (s === "joined") out.push(`<span class="pill pill-green">${ic("check")}Joined</span>`);
  else if (s === "waitlist") out.push(`<span class="pill pill-gold num">Waitlist #${myWaitPos(t)}</span>`);
  else if (tableIsFull(t) && !currentEventIsPast() && ts !== "past") out.push(`<span class="pill pill-gold">Full</span>`);
  if (ts === "started") out.push(`<span class="pill pill-amber">${ic("clock")}Started</span>`);
  if (ts === "past") out.push(`<span class="pill">${ic("history")}Past</span>`);
  if (isCustomTable(t)) out.push(`<span class="pill pill-blue">${ic("clip")}Sign-up</span>`);
  if (t.gameSource === "library") out.push(`<span class="pill">${ic("book")}Library copy</span>`);
  return out.join("");
}

// One dot per chair (green = confirmed, gold = waiting); a bar past 12 seats.
function seatMeterHtml(t) {
  const cap = Number(t.capacity || 0);
  const { confirmed, waitlist } = seatCounts(t);
  const unit = isCustomTable(t) ? "spots" : "seats";
  const text = `${confirmed}/${cap || "?"} ${unit}` + (waitlist ? ` · <span class="w">${waitlist} waiting</span>` : "");
  let vis = "";
  if (cap > 0 && cap <= 12) {
    let h = "";
    const filled = Math.min(confirmed, cap);
    for (let i = 0; i < cap; i++) h += `<i class="${i < filled ? "on" : ""}"></i>`;
    if (waitlist) {
      h += '<b class="gap"></b>';
      for (let i = 0; i < Math.min(waitlist, 4); i++) h += '<i class="wait"></i>';
    }
    vis = `<span class="pips" aria-hidden="true">${h}</span>`;
  } else if (cap > 0) {
    vis = `<span class="seatBar" aria-hidden="true"><i style="width:${Math.min(100, Math.round((confirmed / cap) * 100))}%"></i></span>`;
  }
  return `${vis}<span class="seatTxt">${text}</span>`;
}

function avatarStackHtml(entries, max = 3) {
  if (!entries?.length) return "";
  const uid = currentUser?.uid;
  const shown = entries.slice(0, max);
  const total = entries.reduce((n, e) => n + 1 + (e.guests || 0), 0);
  const extra = total - shown.length;
  const label = entries.map((e) => e.name + (e.guests ? ` +${e.guests}` : "")).join(", ");
  return `<span class="avStack" title="${esc(label)}">${shown.map((e) => avatarHtml(e.name, "av-sm", !!uid && e.uid === uid)).join("")}${extra > 0 ? `<span class="av av-sm more" aria-hidden="true">+${extra}</span>` : ""}<span class="sr">${esc(label)}</span></span>`;
}

// Join / Joined + Leave / Sign in to join. A host's own table and tables on a
// finished day (or a past event) have no join actions.
function joinActionsHtml(t, { small = true } = {}) {
  const sz = small ? " btn-small" : "";
  if (currentEventIsPast() || tableTimeState(t) === "past") return "";
  if (!currentUser) return `<button class="btn btn-primary${sz}" data-action="join">Sign in to join</button>`;
  const s = myTableStatus(t);
  if (s === "hosting") return "";
  if (s === "joined" || s === "waitlist") {
    return `<button class="btn is-joined${sz}" disabled>${ic("check", "ico-sm")}${s === "waitlist" ? "On waitlist" : "Joined"}</button><button class="btn${sz}" data-action="leave">Leave</button>`;
  }
  return `<button class="btn btn-primary${sz}" data-action="join">${tableIsFull(t) ? "Join waitlist" : "Join"}</button>`;
}

// Update a card in place (pills, seats, roster avatars, join buttons) so live
// roster changes never rebuild the card or steal focus.
function refreshCardState(card, t) {
  const pills = tablePillsHtml(t);
  card.querySelectorAll("[data-pills]").forEach((el) => { el.innerHTML = pills; el.hidden = !pills; });
  const seats = card.querySelector("[data-seats]");
  if (seats) seats.innerHTML = seatMeterHtml(t);
  const stack = card.querySelector("[data-avstack]");
  if (stack) {
    const r = rosterByTableId.get(t.id);
    stack.innerHTML = r ? avatarStackHtml(r.confirmed) : "";
  }
  const join = card.querySelector("[data-joinbox]");
  if (join && !join.dataset.busy) join.innerHTML = joinActionsHtml(t);
  card.classList.toggle("is-mine", !!myTableStatus(t));
}
const applyJoinLeaveState = refreshCardState;

function rosterNamesHtml(entries) {
  if (!entries?.length) return `<span class="none">None yet</span>`;
  const myUid = currentUser?.uid;
  return entries.map((e) => {
    const isYou = !!(myUid && e.uid === myUid);
    const party = e.guests > 0 ? ` <span class="party">+${e.guests}</span>` : "";
    return `<span class="rchip${isYou ? " is-you" : ""}">${avatarHtml(e.name, "av-sm", isYou)}${esc(e.name)}${party}${isYou ? " (you)" : ""}</span>`;
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
  if (!btnSignIn) return;
  btnSignIn.style.display = user ? "none" : "";
  if (btnInbox) btnInbox.style.display = user ? "" : "none";
  if (acctWrap) acctWrap.hidden = !user;
  if (!user) setAccountMenu(false);
  // Create Game Day / Request Organizer Access are role-driven.
  applyRoleUI();
}

// -----------------------------
// Avatars and the account menu
// -----------------------------
function initials(name) {
  const parts = String(name || "").replace(/[^\p{L}\p{N} ]/gu, " ").trim().split(/\s+/);
  return (((parts[0] || "")[0] || "") + ((parts[1] || "")[0] || "")).toUpperCase() || "?";
}
function nameHue(name) {
  let h = 11;
  const s = String(name || "");
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) % 360;
  return h;
}
function avatarHtml(name, cls = "", isMe = false) {
  return `<span class="av${cls ? " " + cls : ""}${isMe ? " me" : ""}" style="--h:${nameHue(name)}" aria-hidden="true">${esc(initials(name))}</span>`;
}

function myName() {
  return myRole.nickname || lastDisplayName || "";
}

function updateAccountUI() {
  if (!currentUser) return;
  const name = myName() || "Signed in";
  const av = document.querySelector("#acctAvatar");
  if (av) {
    av.textContent = initials(name);
    av.style.setProperty("--h", String(nameHue(name)));
  }
  const nm = document.querySelector("#acctName");
  if (nm) nm.textContent = name;
  const role = document.querySelector("#acctRole");
  if (role) role.textContent = myRole.owner ? "Site admin" : myRole.host ? "Organizer" : "Player";
}

function setAccountMenu(open) {
  if (!acctMenu || !btnAccount) return;
  acctMenu.hidden = !open;
  btnAccount.setAttribute("aria-expanded", String(open));
}
btnAccount?.addEventListener("click", (e) => {
  e.stopPropagation();
  setAccountMenu(acctMenu.hidden);
});
// Any choice in the menu closes it.
acctMenu?.addEventListener("click", (e) => {
  if (e.target.closest(".mi")) setAccountMenu(false);
});

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
function openHostTableFormModal({ gamedayId, thing, fromPostId = null, requestedByName = "" }) {
  return new Promise((resolve) => {
    const bounds = eventDayBounds();
    const defaultStart = bounds ? bounds.default : fmtCentralDatetimeValue(new Date(Date.now() + 60 * 60 * 1000));
    const dtAttrs = bounds ? ` min="${bounds.min}" max="${bounds.max}"` : "";
    const dtHint = bounds ? `<div class="hint muted">Must be during the event (${esc(bounds.label)}).</div>` : "";
    const isCustom = thing.isCustom === true;
    const defaultCap = isCustom ? "" : (thing?.maxPlayers || "");

    openModal(isCustom ? "Create a Sign-Up" : "Host a Table", `
      <div class="modalStack">
        ${fromPostId ? `<div class="convertBanner">🙋 Picking up ${esc(requestedByName || "someone")}'s request — it clears once your table is up.</div>` : ""}
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

          ${isCustom ? "" : `
          <div class="field fieldSpan2">
            <div class="label">Whose copy?</div>
            <div class="copyChoice" role="radiogroup" aria-label="Whose copy of the game">
              <label class="check"><input type="radio" name="gameSource" value="personal" checked /> <span>🎒 My copy</span></label>
              <label class="check"><input type="radio" name="gameSource" value="library" /> <span>📚 Library copy</span></label>
            </div>
            <div class="hint muted">Library copies are checked against the event's game library.</div>
          </div>`}

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
      if (bounds && bounds.isPastDay(startVal.slice(0, 10))) {
        showInlineError(`That day of the event has already passed — pick today or later.`);
        return;
      }
      if (bounds && bounds.endsLabel && startVal > bounds.max) {
        showInlineError(`The event wraps up at ${bounds.endsLabel} — pick an earlier start.`);
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
      const checkedBoxes = expList
        ? Array.from(expList.querySelectorAll('input[type="checkbox"]:checked'))
        : [];
      const checked = checkedBoxes.map((c) => String(c.value)).filter(Boolean);
      // Sent alongside the ids so the server can still label them if BGG is
      // down when the table is created.
      const checkedNames = checkedBoxes.map((c) => c.parentElement?.querySelector("span")?.textContent?.trim() || "");

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
          expansionIds: checked,
          expansionNames: checkedNames,
          fromPostId: fromPostId || null,
          gameSource: (qs('input[name="gameSource"]:checked')?.value === "library") ? "library" : "personal"
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
        if (bounds && bounds.isPastDay(startVal.slice(0, 10))) {
            showInlineError(`That day of the event has already passed — pick today or later.`);
            return;
        }
        if (bounds && bounds.endsLabel && startVal > bounds.max) {
            showInlineError(`The event wraps up at ${bounds.endsLabel} — pick an earlier start.`);
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
    gameDaysLoaded = true;
    renderGameDays(list);
    tryOpenDeepLink();

    // Keep the OPEN game day's header live, and move on if it vanishes
    // (deleted/unpublished while someone was looking at it).
    if (currentGameDayId) {
      const fresh = list.find((g) => g.id === currentGameDayId);
      if (fresh) {
        currentGameDay = fresh;
        renderGameDayHeader(fresh);
      } else if (currentGameDay?.visibility !== "private") {
        // Private events aren't in the public snapshot — never bounce those.
        history.replaceState({}, "", gameDayUrl(null));
        toast("This Game Day is no longer available.", "info");
        showGameDayList();
      }
    }
    // Nothing chosen (no deep link): open the next game day.
    if (!currentGameDayId) showGameDayList();
  }, () => {
    // Snapshot failure (offline, rules): never leave a blank/broken-looking page.
    if (gdRail) gdRail.innerHTML = `<div class="railIn wrap gutter"><p class="railEmpty">Couldn't load game days — check your connection. <button class="linkBtn" id="btnRetryGamedays">Retry</button></p></div>`;
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
    tablesLoaded = true;
    renderTablesPage();
    // The header's art tint and stats come from the tables.
    if (currentGameDay) renderGameDayHeader(currentGameDay);
  });

  const postsQ = query(collection(db, "gamedays", gamedayId, "posts"), orderBy("createdAt", "desc"));
  unsubPosts = onSnapshot(postsQ, (snap) => {
    const posts = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    currentPosts = posts.filter((p) => p.kind === "want_to_play");
    renderWants(currentPosts);
    renderYourDay();
  });
}

// -----------------------------
// Rendering
// -----------------------------
function renderGameDays(list) {
  // Private events I'm part of merge into the list (never in the public query).
  const merged = [...list, ...myPrivateGamedays.filter((p) => !list.some((g) => g.id === p.id))];
  const sorted = sortByStartsAtAsc(merged);
  currentGameDays = sorted.filter((gd) => !isPastGameDay(gd));
  currentPastGameDays = sortByStartsAtDesc(sorted.filter(isPastGameDay));
  if (!currentPastGameDays.length) showPastDays = false;
  renderRail();
}

// Date pieces for a Central day key ("2026-11-06"). Noon UTC keeps the
// calendar date stable in every viewer's timezone.
function keyParts(key) {
  const d = new Date(`${key}T12:00:00Z`);
  const f = (o) => d.toLocaleDateString("en-US", { timeZone: "UTC", ...o });
  return {
    day: String(Number(String(key).slice(8, 10))),
    mon: f({ month: "short" }),
    dow: f({ weekday: "short" }),
    label: f({ weekday: "short", month: "short", day: "numeric" }),
    long: f({ weekday: "long", month: "long", day: "numeric" })
  };
}

const gdDays = (gd) => eventDayKeys(gd?.startsAt, gd?.endsAt);

// 1-based day number while a multi-day event is running, else 0.
function liveDayOf(gd) {
  if (!gd || isPastGameDay(gd)) return 0;
  const days = gdDays(gd);
  if (days.length < 2) return 0;
  return days.indexOf(centralDateKey(new Date())) + 1;
}

const shortPlace = (gd) => String(gd?.location || "").split(",")[0].trim();

function ticketInnerHtml(gd) {
  const days = gdDays(gd);
  const f = days.length ? keyParts(days[0]) : null;
  const l = days.length ? keyParts(days[days.length - 1]) : null;
  const multi = days.length > 1;
  const day = !f ? "?" : multi ? `${f.day}–${l.day}` : f.day;
  const mon = !f ? "TBD" : f.mon === l.mon ? f.mon : `${f.mon}–${l.mon}`;
  const live = liveDayOf(gd);
  const when = live ? `<span class="live">Day ${live} of ${days.length}</span>` : (f ? esc(multi ? `${f.dow}–${l.dow}` : f.dow) : "");
  const sub = [when, shortPlace(gd) ? esc(shortPlace(gd)) : ""].filter(Boolean).join(" · ");
  return `<span class="tkDate${multi ? " is-multi" : ""}"><span class="d">${day}</span><span class="m">${esc(mon)}</span></span>
    <span class="tkT">${gd.visibility === "private" ? ic("lock", "ico-sm") : ""}<span>${esc(gd.title || "Game Day")}</span></span>
    <span class="tkS">${sub}</span>`;
}

const ticketBtnHtml = (gd) =>
  `<button class="ticket" type="button" data-gd="${esc(gd.id)}" aria-current="${gd.id === currentGameDayId}">${ticketInnerHtml(gd)}</button>`;

function railListHtml() {
  if (!gameDaysLoaded) return `<p class="railEmpty">Loading game days…</p>`;
  const list = showPastDays ? currentPastGameDays : currentGameDays;
  return list.map(ticketBtnHtml).join("")
    || `<p class="railEmpty">${showPastDays ? "No past game days yet." : "No upcoming game days yet — check back soon!"}</p>`;
}

function pastSegHtml() {
  const n = currentPastGameDays.length;
  return `<div class="seg" role="group" aria-label="Which game days">
    <button type="button" data-past="0" aria-pressed="${!showPastDays}">Upcoming</button>
    <button type="button" data-past="1" aria-pressed="${showPastDays}"${n ? "" : " disabled"}>Past (${n})</button>
  </div>`;
}

const addTicketHtml = () => (canCreateGameDays() && !showPastDays)
  ? `<button class="ticket add" type="button" data-create>${ic("plus", "ico-sm")}Create game day</button>`
  : "";

// Wide screens get a row of date tickets; phones get the open game day plus a
// "Change" list (CSS shows one or the other), so nothing scrolls sideways.
function renderRail() {
  if (gdRail) {
    gdRail.innerHTML = `<div class="railIn wrap gutter"><div class="railTools">${pastSegHtml()}</div><div class="railTickets">${railListHtml()}${addTicketHtml()}</div></div>`;
  }
  if (gdPicker) {
    const cur = currentGameDay;
    const open = pickerOpen || !cur;
    gdPicker.innerHTML = `<div class="gdPickIn wrap gutter">
      ${cur ? `<button class="gdNow" type="button" data-pick aria-expanded="${open}"><span class="tkGrid">${ticketInnerHtml(cur)}</span><span class="chg">Change${ic("down", "ico-sm")}</span></button>` : ""}
      ${open ? `<div class="gdPanel">${pastSegHtml()}${railListHtml()}${addTicketHtml()}</div>` : ""}
    </div>`;
  }
}

function onRailClick(e) {
  const container = e.currentTarget;
  const gdBtn = e.target.closest("[data-gd]");
  if (gdBtn) {
    const id = gdBtn.getAttribute("data-gd");
    const gd = [...currentGameDays, ...currentPastGameDays].find((g) => g.id === id);
    pickerOpen = false;
    if (gd && gd.id !== currentGameDayId) openGameDay(gd);
    else renderRail();
    return;
  }
  const past = e.target.closest("[data-past]");
  if (past && !past.disabled) {
    showPastDays = past.getAttribute("data-past") === "1";
    renderRail();
    container.querySelector(`[data-past="${showPastDays ? 1 : 0}"]`)?.focus();
    return;
  }
  if (e.target.closest("[data-create]")) {
    pickerOpen = false;
    renderRail();
    if (!currentUser) return openSignInModal();
    openCreateGameDayModal();
    return;
  }
  if (e.target.closest("[data-pick]")) {
    pickerOpen = !pickerOpen;
    renderRail();
    container.querySelector("[data-pick]")?.focus();
  }
}
gdRail?.addEventListener("click", onRailClick);
gdPicker?.addEventListener("click", onRailClick);

// Past events are read-only: no Host a Table or Request a Game.
function setPastEventActions(isPast) {
  if (btnHostTable) btnHostTable.hidden = isPast;
  if (btnWantToPlay) btnWantToPlay.hidden = isPast;
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
  // Seats (people incl. guests), not signup docs — matches the server's
  // aggregate meaning. Fallback uses the denormalized counts, same units.
  if (r) return { confirmed: r.confirmedSeats, waitlist: r.waitlistSeats };
  return { confirmed: Number(t.confirmedCount || 0), waitlist: Number(t.waitlistCount || 0) };
}

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

// Everything that affects a card's static markup. When unchanged, the card's
// DOM node is reused as-is by the reconcile, preserving in-flight button
// labels and focus during live updates; seats, pills and Join state are
// refreshed in place by refreshCardState.
function tableRenderSig(t) {
  return JSON.stringify([
    asDate(t.startTime)?.getTime() ?? null,
    t.gameName, t.thumbUrl, t.bggId, t.isCustom === true,
    t.hostUid, t.hostDisplayName, t.bggYear ?? null, t.bggRating ?? null,
    currentUser?.uid || null
  ]);
}

// The event day a table belongs to (off-day legacy rows clamp to the
// nearest event day so they never vanish from the tabs).
function tableDayKey(t, bounds) {
  const st = asDate(t.startTime);
  const key = st ? centralDateKey(st) : "";
  if (!bounds || !bounds.days.length) return key;
  if (!key || key < bounds.firstDay) return bounds.firstDay;
  if (key > bounds.lastDay) return bounds.lastDay;
  return key;
}

// Open on today while a multi-day event runs, else day 1 (like the host picker).
function pickActiveDay(bounds) {
  if (activeDayKey && bounds.days.includes(activeDayKey)) return activeDayKey;
  return bounds.days.includes(bounds.todayKey) ? bounds.todayKey : bounds.firstDay;
}

function splitTimeLabel(label) {
  const i = String(label).lastIndexOf(" ");
  return i > 0 ? { hm: label.slice(0, i), ap: label.slice(i + 1) } : { hm: label, ap: "" };
}

// BGG thumbnails are small (about 200px): show them at their own size over a
// blurred copy of themselves rather than stretched and soft.
function artHtml(t) {
  if (t.thumbUrl) {
    const u = esc(encodeURI(String(t.thumbUrl)));
    return `<span class="tArtBg" style="background-image:url(&quot;${u}&quot;)"></span><img class="tArtImg" src="${esc(t.thumbUrl)}" alt="" loading="lazy" />`;
  }
  if (isCustomTable(t)) return `<img class="tArtImg" src="./signup-sheet.png" alt="" loading="lazy" />`;
  return `<span class="ph">${ic("dice")}</span>`;
}

function buildTableCard(t, sig) {
  const el = document.createElement("article");
  el.className = "tCard";
  el.dataset.tableCard = t.id;
  el.dataset.sig = sig;
  const isHost = !!(currentUser && currentUser.uid === t.hostUid);
  const custom = isCustomTable(t);
  const meta = custom ? "Custom sign-up" : gameMetaText(t);
  el.innerHTML = `
    <button class="tArt${custom && !t.thumbUrl ? " signup" : ""}" type="button" data-open tabindex="-1" aria-hidden="true">${artHtml(t)}<span class="tOver" data-pills hidden></span></button>
    <div class="tBody">
      <div class="tPills pills" data-pills hidden></div>
      <div>
        <h3 style="margin:0"><button class="tName" type="button" data-open>${esc(t.gameName || "Game")}</button></h3>
        <p class="tMeta" data-game-meta${meta ? "" : " hidden"}>${esc(meta)}</p>
      </div>
      <div class="tHost">${avatarHtml(t.hostDisplayName || "?", "av-sm", isHost)}<span>${isHost ? '<span class="you">You’re hosting</span>' : `Hosted by <b>${esc(t.hostDisplayName || "Unknown")}</b>`}</span></div>
      <div class="tSeats"><span class="seatMeter" data-seats></span><span data-avstack></span></div>
    </div>
    <div class="tFoot"><span data-joinbox style="display:contents"></span><span class="grow"></span><button class="btn btn-quiet btn-small" type="button" data-open>Details${ic("right", "ico-sm")}</button></div>
  `;
  return el;
}

const dEmpty = (icon, title, body, action = "") =>
  `<div class="dEmpty"><span class="eico">${ic(icon, "ico-lg")}</span><b>${esc(title)}</b><span>${esc(body)}</span>${action}</div>`;

function tablesEmptyHtml(isPast, multi) {
  if (isPast) return dEmpty("history", "No tables were hosted", multi ? "Nothing ran on this day." : "This game day finished without any tables.");
  return dEmpty("dice", multi ? "No tables on this day yet" : "No tables yet",
    "Host a table to run a game, or request one and see who would play.",
    `<button class="btn btn-primary btn-small" type="button" data-empty-host>${ic("plus", "ico-sm")}Host a Table</button>`);
}

function renderDayTabs(bounds, day) {
  if (!dayTabsEl) return;
  if (!bounds || !bounds.multiDay) {
    dayTabsEl.innerHTML = "";
    dayTabsEl.className = "";
    dayTabsEl.removeAttribute("role");
    return;
  }
  const counts = {};
  currentTables.forEach((t) => { const k = tableDayKey(t, bounds); counts[k] = (counts[k] || 0) + 1; });
  dayTabsEl.className = "dayTabs";
  dayTabsEl.setAttribute("role", "tablist");
  dayTabsEl.setAttribute("aria-label", "Days");
  dayTabsEl.innerHTML = bounds.days.map((k, i) => {
    const p = keyParts(k);
    const isToday = k === bounds.todayKey;
    const isPastDay = k < bounds.todayKey;
    const n = counts[k] || 0;
    const edge = [
      i === 0 ? `from ${bounds.startsLabel}` : "",
      i === bounds.days.length - 1 && bounds.endsLabel ? `until ${bounds.endsLabel}` : ""
    ].filter(Boolean).join(" · ");
    return `<button class="dayTab${isToday ? " is-today" : ""}${isPastDay ? " is-past" : ""}" type="button" role="tab" aria-selected="${k === day}" data-day="${k}">
      <span class="dn">Day ${i + 1}${isToday ? " · Today" : ""}${isPastDay ? " · Past" : ""}</span>
      <span class="dl">${esc(p.label)}</span>
      <span class="ds">${n} ${n === 1 ? "table" : "tables"}${edge ? `<span class="edge"> · ${esc(edge)}</span>` : ""}</span>
    </button>`;
  }).join("");
}

dayTabsEl?.addEventListener("click", (e) => {
  const b = e.target.closest("[data-day]");
  if (!b) return;
  activeDayKey = b.getAttribute("data-day");
  renderTablesPage();
  dayTabsEl.querySelector(`[data-day="${activeDayKey}"]`)?.focus();
});

// Slot headings turn red where you're hosting or playing.
function refreshSlotMine() {
  tablesList?.querySelectorAll(".slot").forEach((sec) => {
    sec.classList.toggle("has-mine", !!sec.querySelector(".tCard.is-mine"));
  });
}

// No pager: the selected day's tables, grouped under their start time. Every
// table of the open game day keeps a live roster (seats, Join state, Your day).
function renderTablesPage({ force = false } = {}) {
  if (!tablesList) return;
  const isPast = currentEventIsPast();

  const ids = new Set(currentTables.map((t) => t.id));
  stopRosterListenersExcept(ids);
  if (currentGameDayId) currentTables.forEach((t) => ensureRosterListener(currentGameDayId, t.id));

  const bounds = eventDayBounds();
  const multi = !!(bounds && bounds.multiDay);
  const day = multi ? pickActiveDay(bounds) : null;
  renderDayTabs(bounds, day);

  const sorted = [...currentTables].sort((a, b) =>
    (asDate(a.startTime)?.getTime() ?? Infinity) - (asDate(b.startTime)?.getTime() ?? Infinity));
  const list = multi ? sorted.filter((t) => tableDayKey(t, bounds) === day) : sorted;

  if (tTitle) tTitle.textContent = multi ? `Day ${bounds.days.indexOf(day) + 1} · ${keyParts(day).long}` : "Tables";
  const edge = multi ? [
    day === bounds.firstDay ? `starts ${bounds.startsLabel}` : "",
    day === bounds.lastDay && bounds.endsLabel ? `ends ${bounds.endsLabel}` : ""
  ].filter(Boolean).join(" · ") : "";
  if (tSub) {
    tSub.textContent = tablesLoaded
      ? `${list.length} ${list.length === 1 ? "table" : "tables"} by start time${edge ? " · " + edge : ""}`
      : "Loading tables…";
  }

  if (!tablesLoaded) return; // the skeleton stays until the first snapshot

  if (!list.length) {
    lastLayoutSig = "";
    tablesList.innerHTML = tablesEmptyHtml(isPast, multi);
  } else {
    const slots = [];
    for (const t of list) {
      const st = asDate(t.startTime);
      const key = st ? String(Math.floor(st.getTime() / 60000)) : "tbd";
      const last = slots[slots.length - 1];
      if (last && last.key === key) last.items.push(t);
      else slots.push({ key, label: st ? fmtTime(st) : "TBD", items: [t] });
    }

    const existing = new Map([...tablesList.querySelectorAll("[data-table-card]")].map((el) => [el.dataset.tableCard, el]));
    const cardFor = (t) => {
      const sig = tableRenderSig(t);
      let el = existing.get(t.id);
      if (!el || el.dataset.sig !== sig) {
        el = buildTableCard(t, sig);
        hydrateGameMeta(el, t);
      }
      el.classList.toggle("is-pastTable", tableTimeState(t) === "past");
      refreshCardState(el, t);
      return el;
    };

    const layoutSig = JSON.stringify([day, isPast, slots.map((s) => [s.key, s.items.map((t) => t.id)])]);
    if (layoutSig === lastLayoutSig && !force) {
      // Same structure: replace only cards whose markup changed.
      for (const s of slots) {
        for (const t of s.items) {
          const old = existing.get(t.id);
          const el = cardFor(t);
          if (old && old !== el) old.replaceWith(el);
        }
      }
    } else {
      lastLayoutSig = layoutSig;
      const frag = document.createDocumentFragment();
      for (const s of slots) {
        const sec = document.createElement("section");
        sec.className = `slot n${Math.min(s.items.length, 3)}`;
        sec.setAttribute("aria-label", s.label);
        const tm = splitTimeLabel(s.label);
        sec.innerHTML = `<div class="slotHead" aria-hidden="true"><span class="hm">${esc(tm.hm)}</span><span class="ap">${esc(tm.ap)}</span>${s.items.length > 1 ? `<span class="cnt">${s.items.length} tables</span>` : ""}<span class="rule"></span></div><div class="slotGrid"></div>`;
        const grid = sec.querySelector(".slotGrid");
        for (const t of s.items) grid.appendChild(cardFor(t));
        frag.appendChild(sec);
      }
      tablesList.replaceChildren(frag);
    }
    refreshSlotMine();
  }

  if (sheetTableId) {
    if (!currentTables.some((t) => t.id === sheetTableId)) closeSheet();
    else renderSheet();
  }
  renderYourDay();
  renderStats();
}

tablesList?.addEventListener("click", (e) => {
  if (e.target.closest("[data-empty-host]")) { btnHostTable?.click(); return; }
  const card = e.target.closest("[data-table-card]");
  if (!card || e.target.closest("a")) return;
  const t = currentTables.find((x) => x.id === card.dataset.tableCard);
  if (!t) return;
  const actBtn = e.target.closest("[data-action]");
  if (actBtn) {
    e.stopPropagation();
    runTableAction(actBtn.getAttribute("data-action"), t, actBtn, card.querySelector("[data-joinbox]"));
    return;
  }
  const opener = e.target.closest("[data-open]");
  if (opener) openSheet(t.id, card.querySelector(".tName"));
});

// One implementation of every table action, for cards and the details sheet.
async function runTableAction(action, t, btn, joinBox) {
  const busy = () => {
    if (joinBox) joinBox.dataset.busy = "1";
    sheetBusy = true;
    return () => {
      if (joinBox) delete joinBox.dataset.busy;
      sheetBusy = false;
      const fresh = currentTables.find((x) => x.id === t.id);
      if (!fresh) return;
      const card = tableCardEl(fresh.id);
      if (card) refreshCardState(card, fresh);
      if (sheetTableId === fresh.id) renderSheet();
    };
  };

  if (action === "join") {
    if (stopPastEventAction()) return;
    if (!currentUser) return openSignInModal();
    let guestCount = 0;
    if (GUESTS_ENABLED && t.isCustom !== true) {
      guestCount = await openJoinPartyModal(t);
      if (guestCount === null) return; // cancelled
    }
    const done = busy();
    await attemptJoin(t, btn, btn.textContent, { guestCount });
    done();
    return;
  }

  if (action === "leave") {
    if (stopPastEventAction()) return;
    if (!currentUser) return openSignInModal();
    const isHost = currentUser.uid === t.hostUid;
    if (isHost) {
      const ok = await confirmDialog({
        title: "Leave & delete table?",
        message: "You are the host.\n\nLeaving will delete this table and remove all players.",
        confirmLabel: "Delete table",
        danger: true
      });
      if (!ok) return;
    }
    const done = busy();
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
    done();
    return;
  }

  if (action === "edit") {
    if (stopPastEventAction()) return;
    openEditTableModal(t);
    return;
  }

  if (action === "delete") {
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
  }
}

// -----------------------------
// Table details sheet
// -----------------------------
function openSheet(tableId, opener) {
  if (!sheetEl || !sheetBody) return;
  sheetTableId = tableId;
  sheetOpener = opener || document.activeElement;
  renderSheet();
  sheetEl.hidden = false;
  if (sheetScrim) sheetScrim.hidden = false;
  document.body.classList.add("sheet-open");
  sheetBody.scrollTop = 0;
  sheetBody.querySelector("[data-close]")?.focus();
}

function closeSheet() {
  if (!sheetTableId) return;
  sheetTableId = null;
  sheetBusy = false;
  if (sheetEl) sheetEl.hidden = true;
  if (sheetScrim) sheetScrim.hidden = true;
  document.body.classList.remove("sheet-open");
  if (sheetBody) sheetBody.innerHTML = "";
  if (sheetOpener && sheetOpener.isConnected) sheetOpener.focus();
  sheetOpener = null;
}

function renderSheet() {
  if (!sheetTableId || !sheetBody || sheetBusy) return;
  const t = currentTables.find((x) => x.id === sheetTableId);
  if (!t) { closeSheet(); return; }
  const isPast = currentEventIsPast();
  const isHost = !!(currentUser && currentUser.uid === t.hostUid);
  const canManage = !isPast && (isHost || isAdmin() || isOrganizerOf(currentGameDay));
  const custom = isCustomTable(t);
  const bggUrl = t.bggId ? `https://boardgamegeek.com/boardgame/${encodeURIComponent(t.bggId)}` : null;
  const r = rosterByTableId.get(t.id) || { confirmed: [], waitlist: [] };
  const { confirmed, waitlist } = seatCounts(t);
  const bounds = eventDayBounds();
  const st = asDate(t.startTime);
  const dayFact = bounds?.multiDay
    ? (() => { const k = tableDayKey(t, bounds); return `Day ${bounds.days.indexOf(k) + 1} · ${keyParts(k).label}`; })()
    : (st ? keyParts(centralDateKey(st)).label : "TBD");
  const exps = Array.isArray(t.expansions) ? t.expansions : [];
  const expLinks = exps.map((e) => {
    const name = shortExpansionName(e?.name ?? "", t.gameName ?? "");
    const id = e?.bggId ?? "";
    return id
      ? `<a class="chip" href="https://boardgamegeek.com/boardgame/${encodeURIComponent(id)}" target="_blank" rel="noopener">${esc(name)}</a>`
      : `<span class="chip">${esc(name)}</span>`;
  });
  const showAllExp = expOpen.has(t.id);
  const notesLong = String(t.notes || "").length > 180;
  const notesAll = notesOpen.has(t.id);
  const meta = custom ? "Custom sign-up" : gameMetaText(t);
  const pills = tablePillsHtml(t);
  const join = joinActionsHtml(t, { small: false });
  // Re-rendering replaces the toggle buttons; keep keyboard focus on them.
  const ae = document.activeElement;
  const focusKey = ae && sheetBody.contains(ae)
    ? (ae.hasAttribute("data-notes") ? "[data-notes]" : ae.hasAttribute("data-exp") ? "[data-exp]" : null)
    : null;

  sheetBody.innerHTML = `
    <div class="shArt${custom && !t.thumbUrl ? " signup" : ""}">${artHtml(t)}<button class="btn btn-icon shClose" type="button" data-close aria-label="Close details">${ic("x")}</button></div>
    <div class="shBody">
      <div>
        ${pills ? `<div class="pills" style="margin-bottom:10px">${pills}</div>` : ""}
        <h2 class="shTitle" id="sheetTitle">${bggUrl ? `<a href="${esc(bggUrl)}" target="_blank" rel="noopener">${esc(t.gameName || "Game")}</a>` : esc(t.gameName || "Game")}</h2>
        <p class="tMeta" data-game-meta${meta ? "" : " hidden"}>${esc(meta)}</p>
        ${t.requestedByDisplayName ? `<p class="shReq">${ic("hand", "ico-sm")}Requested by ${esc(t.requestedByDisplayName)}</p>` : ""}
      </div>
      <dl class="facts">
        <div><dt>Starts</dt><dd class="num">${esc(st ? fmtTime(st) : "TBD")}</dd></div>
        <div><dt>Host</dt><dd>${avatarHtml(t.hostDisplayName || "?", "av-sm", isHost)}<span>${isHost ? "You" : esc(t.hostDisplayName || "Unknown")}</span></dd></div>
        <div><dt>${custom ? "Spots" : "Seats"}</dt><dd><span class="seatMeter">${seatMeterHtml(t)}</span></dd></div>
        <div><dt>${bounds?.multiDay ? "Day" : "Date"}</dt><dd>${esc(dayFact)}</dd></div>
      </dl>
      ${t.notes ? `<div class="dNotes${notesLong && !notesAll ? " clamp" : ""}"><span class="txt"><span class="lbl">Notes:</span> ${esc(t.notes)}</span>${notesLong ? `<button class="linkBtn" type="button" data-notes>${notesAll ? "Show less" : "Show more"}</button>` : ""}</div>` : ""}
      ${expLinks.length ? `<div class="chips"><span class="lbl">Expansions</span>${(showAllExp ? expLinks : expLinks.slice(0, 3)).join("")}${expLinks.length > 3 ? `<button class="linkBtn" type="button" data-exp>${showAllExp ? "Show fewer" : `+${expLinks.length - 3} more`}</button>` : ""}</div>` : ""}
      <div class="rgroups">
        <div class="rgroup"><div class="rhead">${custom ? "Sign-ups" : "Confirmed"}<span class="rcount num">${confirmed}</span></div><div class="rchips">${rosterNamesHtml(r.confirmed)}</div></div>
        <div class="rgroup wait"><div class="rhead">Waitlist<span class="rcount num">${waitlist}</span></div><div class="rchips">${rosterNamesHtml(r.waitlist)}</div></div>
      </div>
    </div>
    ${(join || canManage) ? `<div class="shFoot"><span data-joinbox style="display:contents">${join}</span><span class="grow"></span>${canManage ? `<button class="btn btn-quiet" type="button" data-action="edit">${ic("pencil", "ico-sm")}Edit</button><button class="btn btn-dangerQuiet" type="button" data-action="delete">${ic("trash", "ico-sm")}Delete</button>` : ""}</div>` : ""}
  `;
  hydrateGameMeta(sheetBody, t);
  if (focusKey) sheetBody.querySelector(focusKey)?.focus();
}

sheetBody?.addEventListener("click", (e) => {
  if (e.target.closest("[data-close]")) { closeSheet(); return; }
  const t = currentTables.find((x) => x.id === sheetTableId);
  if (!t) return;
  if (e.target.closest("[data-notes]")) {
    notesOpen.has(t.id) ? notesOpen.delete(t.id) : notesOpen.add(t.id);
    renderSheet();
    return;
  }
  if (e.target.closest("[data-exp]")) {
    expOpen.has(t.id) ? expOpen.delete(t.id) : expOpen.add(t.id);
    renderSheet();
    return;
  }
  const actBtn = e.target.closest("[data-action]");
  if (actBtn) runTableAction(actBtn.getAttribute("data-action"), t, actBtn, sheetBody.querySelector("[data-joinbox]"));
});
sheetScrim?.addEventListener("click", closeSheet);

// -----------------------------
// Your day + header stats (summaries of the live tables and rosters)
// -----------------------------
function renderYourDay() {
  if (!yourDayEl) return;
  const bounds = eventDayBounds();
  const multi = !!(bounds && bounds.multiDay);
  if (ydTitle) ydTitle.textContent = multi ? "Your schedule" : "Your day";
  if (!currentUser) {
    if (ydCount) ydCount.textContent = "";
    yourDayEl.innerHTML = `<div class="ydEmpty"><p style="margin:0">Sign in to see every table you host, play or wait on, in time order.</p><button class="btn btn-primary btn-small" type="button" data-signin style="justify-self:start">${ic("login", "ico-sm")}Sign in</button></div>`;
    return;
  }
  const todayKey = centralDateKey(new Date());
  const items = currentTables
    .map((t) => ({ t, s: myTableStatus(t) }))
    .filter((x) => x.s)
    .sort((a, b) => {
      if (multi) {
        const fa = tableDayKey(a.t, bounds) < todayKey ? 1 : 0;
        const fb = tableDayKey(b.t, bounds) < todayKey ? 1 : 0;
        if (fa !== fb) return fa - fb;
      }
      return (asDate(a.t.startTime)?.getTime() ?? Infinity) - (asDate(b.t.startTime)?.getTime() ?? Infinity);
    });
  const wants = currentPosts.filter((p) => (Array.isArray(p.interested) ? p.interested : []).some((x) => x?.uid === currentUser.uid));
  const total = items.length + wants.length;
  if (ydCount) ydCount.textContent = total ? String(total) : "";
  if (!total) {
    yourDayEl.innerHTML = `<p class="none" style="margin:0">${currentEventIsPast() ? "You weren’t at any tables." : "Nothing yet. Join a table, or host one."}</p>`;
    return;
  }
  const label = { hosting: ["pill-red", "Hosting"], joined: ["pill-green", "Playing"], waitlist: ["pill-gold", "Waitlist"] };
  const rows = items.map(({ t, s }) => {
    const st = asDate(t.startTime);
    const tm = splitTimeLabel(st ? fmtTime(st) : "TBD");
    const day = multi ? `<span class="ydDay">${esc(keyParts(tableDayKey(t, bounds)).dow)}</span>` : "";
    const [cls, txt] = label[s];
    return `<li><button class="ydItem" type="button" data-yd="${esc(t.id)}"><span class="t">${esc(tm.hm)}<small>${esc(tm.ap)}</small></span><span style="min-width:0"><span class="g">${esc(t.gameName || "Game")}</span><span class="k">${day}<span class="pill ${cls}">${txt}${s === "waitlist" ? " #" + myWaitPos(t) : ""}</span>${tableTimeState(t) === "past" ? '<span class="pill">Past</span>' : ""}</span></span></button></li>`;
  }).concat(wants.map((p) => `<li><div class="ydItem" style="cursor:default"><span class="t">—</span><span style="min-width:0"><span class="g">${esc(p.gameName || "Game")}</span><span class="k"><span class="pill">${ic("hand")}Would play</span></span></span></div></li>`));
  yourDayEl.innerHTML = `<ul class="yd">${rows.join("")}</ul>`;
}

yourDayEl?.addEventListener("click", (e) => {
  if (e.target.closest("[data-signin]")) { openSignInModal(); return; }
  const b = e.target.closest("[data-yd]");
  if (!b) return;
  const t = currentTables.find((x) => x.id === b.getAttribute("data-yd"));
  if (!t) return;
  const bounds = eventDayBounds();
  if (bounds?.multiDay) {
    activeDayKey = tableDayKey(t, bounds);
    renderTablesPage();
  }
  openSheet(t.id, b);
});

function renderStats() {
  if (!gdStats) return;
  if (!tablesLoaded) { gdStats.innerHTML = ""; return; }
  const isPast = currentEventIsPast();
  let taken = 0, open = 0, waiting = 0;
  for (const t of currentTables) {
    const { confirmed, waitlist } = seatCounts(t);
    taken += confirmed;
    waiting += waitlist;
    const cap = Number(t.capacity || 0);
    if (!isCustomTable(t) && cap > 0 && tableTimeState(t) !== "past") open += Math.max(0, cap - confirmed);
  }
  const n = currentTables.length;
  gdStats.innerHTML = `<span class="stat"><b>${n}</b>${n === 1 ? "table" : "tables"}</span>`
    + `<span class="stat"><b>${taken}</b>${isPast ? "seats filled" : "seats taken"}</span>`
    + (isPast ? "" : `<span class="stat green"><b>${open}</b>open seats</span>`)
    + (waiting ? `<span class="stat gold"><b>${waiting}</b>on waitlists</span>` : "");
}

// -----------------------------
// In-app inbox (the bell)
// -----------------------------
// Same outbox the Discord bot drains. Discord delivery stamps sentAt; the
// web tracks its own readAt, so a message shows here whether or not a DM
// also went out. This is the only channel for people signed in with Google.
let inboxItems = [];
let inboxUnsub = null;
let inboxPrimed = false;

// Messages are authored in Discord markdown. Render the two constructs we
// actually use: **bold** and <t:unix:f> timestamps (shown in Central).
function inboxMessageHtml(text) {
  let out = esc(String(text || ""));
  out = out.replace(/\*\*(.+?)\*\*/g, "<b>$1</b>");
  out = out.replace(/&lt;t:(\d+):[a-zA-Z]&gt;/g, (_, secs) => esc(fmtDate(new Date(Number(secs) * 1000))));
  out = out.replace(/(https?:\/\/[^\s<]+)/g, (m) => `<a href="${m}">${m.replace(/^https?:\/\/(www\.)?/, "")}</a>`);
  return out;
}

function inboxPlainText(text) {
  return String(text || "").replace(/\*\*/g, "").replace(/<t:(\d+):[a-zA-Z]>/g,
    (_, secs) => fmtTime(new Date(Number(secs) * 1000))).replace(/https?:\/\/\S+/g, "").trim();
}

function updateInboxBadge() {
  if (!inboxBadge) return;
  const unread = inboxItems.filter((n) => !n.readAt).length;
  inboxBadge.textContent = unread > 9 ? "9+" : String(unread);
  inboxBadge.hidden = unread === 0;
  if (btnInbox) btnInbox.setAttribute("aria-label", unread ? `Notifications, ${unread} unread` : "Notifications");
}

function startInboxListener(uid) {
  stopInboxListener();
  inboxPrimed = false;
  const q = query(
    collection(db, "plannerNotifications"),
    where("uid", "==", uid),
    orderBy("createdAt", "desc"),
    limit(30)
  );
  inboxUnsub = onSnapshot(q, (snap) => {
    const prevIds = new Set(inboxItems.map((n) => n.id));
    inboxItems = snap.docs.map((d) => ({ id: d.id, ...(d.data() || {}) }));
    updateInboxBadge();
    // Toast genuinely new arrivals while the page is open — a seat opening
    // up should interrupt; the initial load should not.
    if (inboxPrimed) {
      for (const n of inboxItems) {
        if (!prevIds.has(n.id) && !n.readAt) toast(inboxPlainText(n.message), "success");
      }
    }
    inboxPrimed = true;
  }, (err) => {
    console.warn("inbox listener", err);
  });
}

function stopInboxListener() {
  if (inboxUnsub) { try { inboxUnsub(); } catch {} }
  inboxUnsub = null;
  inboxItems = [];
  updateInboxBadge();
}

function openInboxModal() {
  const rows = inboxItems.length
    ? inboxItems.map((n) => `
        <div class="inboxItem${n.readAt ? "" : " is-unread"}">
          <div>${inboxMessageHtml(n.message)}</div>
          <div class="inboxWhen muted">${n.createdAt ? esc(fmtDate(asDate(n.createdAt))) : ""}</div>
        </div>`).join("")
    : `<div class="muted">Nothing yet. You'll hear here when a request of yours is picked up, or a seat opens up for you.</div>`;

  openModal("Notifications", `<div class="inboxList">${rows}</div>`);

  const unreadIds = inboxItems.filter((n) => !n.readAt).map((n) => n.id);
  if (unreadIds.length) {
    // Optimistic: clear the badge now; the snapshot confirms shortly.
    inboxItems = inboxItems.map((n) => (n.readAt ? n : { ...n, readAt: new Date() }));
    updateInboxBadge();
    fnMarkNotificationsRead({ ids: unreadIds }).catch(() => {});
  }
}

btnInbox?.addEventListener("click", openInboxModal);

// Guests consume real seats, but an old bot recomputing counts as
// signup-count can soft-overfill during the deploy gap — flipped on only
// once the bot redeploy is confirmed.
const GUESTS_ENABLED = true;

// One join implementation for every path (plain join, party join, and the
// post-conflict retry). The server only runs the overlap check when the
// client declares it can handle the confirm round-trip.
async function attemptJoin(t, btn, prevLabel, { guestCount = 0, force = false } = {}) {
  btn.disabled = true;
  btn.textContent = "Joining…";
  try {
    const res = await fnJoinTable({
      gamedayId: currentGameDayId,
      tableId: t.id,
      clientSupportsConfirm: true,
      force,
      ...(guestCount > 0 ? { guestCount } : {})
    });

    if (res?.data?.needsConfirm) {
      btn.disabled = false;
      btn.textContent = prevLabel;
      const c = res.data.conflicts?.[0];
      const when = c?.startTime ? fmtTime(new Date(c.startTime)) : "around the same time";
      const where = c && c.gamedayId !== currentGameDayId ? " (another event)" : "";
      const extra = (res.data.conflicts?.length || 0) > 1
        ? ` — plus ${res.data.conflicts.length - 1} more`
        : "";
      const ok = await confirmDialog({
        title: "Schedule overlap",
        message: `You're already in ${c?.gameName || "another game"} at ${when}${where}${extra}. Join this one too?`,
        confirmLabel: "Join anyway"
      });
      if (ok) await attemptJoin(t, btn, prevLabel, { guestCount, force: true });
      return;
    }

    toast("You're on the list.", "success");
    // roster snapshot refreshes the button to its joined state
  } catch (e) {
    btn.disabled = false;
    btn.textContent = prevLabel;
    toast(`Join failed: ${unwrapCallableError(e)}`, "error");
  }
}

// "Just me / +1 / +2 / +3" — resolves the guest count, or null on cancel.
function openJoinPartyModal(t) {
  return new Promise((resolve) => {
    let done = false;
    const finish = (v) => { if (!done) { done = true; closeModal(); resolve(v); } };
    openModal("Who's coming?", `
      <div class="modalStack">
        <div class="muted">Joining <b>${esc(t.gameName || "this table")}</b>. Bringing anyone without an account? They'll take real seats.</div>
        <div class="partyChoices">
          <button class="btn btn-primary" data-party="0">Just me</button>
          <button class="btn" data-party="1">+1</button>
          <button class="btn" data-party="2">+2</button>
          <button class="btn" data-party="3">+3</button>
        </div>
      </div>
    `, { onDismiss: () => { if (!done) { done = true; resolve(null); } } });
    for (const b of document.querySelectorAll("[data-party]")) {
      b.addEventListener("click", () => finish(Number(b.dataset.party)));
    }
  });
}

function wantInterestNames(p) {
  return (Array.isArray(p.interested) ? p.interested : [])
    .map((x) => x?.name).filter(Boolean);
}

function wantPostHtml(p, bggUrl, { canDelete = false, canAct = false, iAmInterested = false, isMine = false, signIn = false } = {}) {
  const people = (Array.isArray(p.interested) ? p.interested : []).filter((x) => x?.name);
  const meta = gameMetaText(p);
  const acts = [
    canAct ? `<button class="btn btn-small" type="button" data-action="want-convert">${ic("dice", "ico-sm")}Host this</button>` : "",
    canAct ? `<button class="btn btn-small${iAmInterested ? " is-on" : ""}" type="button" data-action="want-interest" aria-pressed="${iAmInterested}">${iAmInterested ? ic("check", "ico-sm") + "Interested" : ic("hand", "ico-sm") + "I’d play this"}</button>` : "",
    canDelete ? `<button class="btn btn-dangerQuiet btn-small btn-icon" type="button" data-action="want-delete" aria-label="Delete request" title="Delete request">${ic("trash", "ico-sm")}</button>` : "",
    signIn ? `<button class="btn btn-quiet btn-small" type="button" data-action="want-signin">Sign in to respond</button>` : ""
  ].join("");
  return `
    <div class="rqTop">
      <span class="rqThumb">${p.thumbUrl ? `<img src="${esc(p.thumbUrl)}" alt="" loading="lazy" />` : ic("dice")}</span>
      <div style="min-width:0">
        <div class="nm">${bggUrl ? `<a href="${esc(bggUrl)}" target="_blank" rel="noopener">${esc(p.gameName || "Game")}</a>` : esc(p.gameName || "Game")}</div>
        <div class="sub" data-game-meta${meta ? "" : " hidden"}>${esc(meta)}</div>
      </div>
    </div>
    <div class="rqBy">Requested by <b>${esc(p.createdByDisplayName || p.createdByUid || "Someone")}${isMine ? " (you)" : ""}</b>${p.restoredAt ? `<span class="pill" title="A table picked this up, then closed">${ic("rotate")}Back on the list</span>` : ""}</div>
    ${p.notes ? `<p class="rqNote">${esc(p.notes)}</p>` : ""}
    ${people.length ? `<span class="rqInt">${avatarStackHtml(people.map((x) => ({ name: x.name, uid: x.uid, guests: 0 })))}<span><b class="num">${people.length}</b> would play</span></span>` : ""}
    ${acts ? `<div class="rqActs">${acts}</div>` : ""}
  `;
}

function renderWants(items) {
  if (!wantsList) return;
  wantsList.innerHTML = "";
  if (wantsCount) wantsCount.textContent = items.length ? String(items.length) : "";
  const isPast = currentEventIsPast();
  if (!items.length) {
    wantsList.innerHTML = `<p class="none" style="margin:0">${isPast ? "No requests were posted." : "No requests yet. Tap “Request a Game” to ask for one — a host may pick it up."}</p>`;
    return;
  }

  for (const p of items) {
    const isCreator = !!(currentUser && currentUser.uid === p.createdByUid);
    const canDelete = !isPast && (isCreator || isAdmin() || isOrganizerOf(currentGameDay));
    const canAct = !isPast && !!currentUser;
    const iAmInterested = !!(currentUser
      && (Array.isArray(p.interested) ? p.interested : []).some((x) => x?.uid === currentUser.uid));

    const bggUrl = p.bggId ? `https://boardgamegeek.com/boardgame/${encodeURIComponent(p.bggId)}` : null;
    const el = document.createElement("article");
    el.className = "rq";
    el.innerHTML = wantPostHtml(p, bggUrl, { canDelete, canAct, iAmInterested, isMine: isCreator, signIn: !isPast && !currentUser });

    // Keyed bindings — never querySelector("button"), which grabs whichever
    // action happens to render first.
    el.querySelector('[data-action="want-delete"]')?.addEventListener("click", async (ev) => {
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

    el.querySelector('[data-action="want-interest"]')?.addEventListener("click", async (ev) => {
        ev.stopPropagation();
        const btn = ev.currentTarget;
        btn.disabled = true;
        try {
            await fnToggleWantInterest({ gamedayId: currentGameDayId, postId: p.id });
            // The posts snapshot re-renders the list with the new state.
        } catch (e) {
            btn.disabled = false;
            toast(unwrapCallableError(e), "error");
        }
    });

    el.querySelector('[data-action="want-convert"]')?.addEventListener("click", (ev) => {
        ev.stopPropagation();
        convertRequestFlow(p);
    });

    el.querySelector('[data-action="want-signin"]')?.addEventListener("click", () => openSignInModal());

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

// There's no separate list view any more (the date rail is the list): this
// opens the next game day, or the most recent past one, or shows the empty
// state when there are none.
function showGameDayList() {
  const gd = currentGameDays[0] || currentPastGameDays[0] || null;
  if (gd) {
    openGameDay(gd, { push: false });
    return;
  }
  if (!gameDaysLoaded) return;
  stopRosterListenersExcept(new Set());
  if (unsubTables) { unsubTables(); unsubTables = null; }
  if (unsubPosts) { unsubPosts(); unsubPosts = null; }
  closeSheet();
  currentGameDayId = null;
  currentGameDay = null;
  currentTables = [];
  currentPosts = [];
  if (gamedayCard) gamedayCard.hidden = true;
  if (dayTabsEl) { dayTabsEl.innerHTML = ""; dayTabsEl.className = ""; }
  if (tTitle) tTitle.textContent = "No game days yet";
  if (tSub) tSub.textContent = "";
  if (tablesList) {
    tablesList.innerHTML = dEmpty("cal", "No game days posted yet", "Check back soon. Organizers can post the next one.",
      canCreateGameDays() ? `<button class="btn btn-primary btn-small" type="button" data-empty-create>${ic("plus", "ico-sm")}Create game day</button>` : "");
    tablesList.querySelector("[data-empty-create]")?.addEventListener("click", openCreateGameDayModal);
  }
  if (wantsList) wantsList.innerHTML = "";
  if (wantsCount) wantsCount.textContent = "";
  renderYourDay();
  renderRail();
}

function showGameDayCard() {
  if (gamedayCard) gamedayCard.hidden = false;
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
  const isPast = isPastGameDay(gd) || currentPastGameDays.some((x) => x.id === gd.id);
  const isPrivate = gd.visibility === "private";
  const canManage = isAdmin() || isOrganizerOf(gd);
  const days = gdDays(gd);
  const f = days.length ? keyParts(days[0]) : null;
  const l = days.length ? keyParts(days[days.length - 1]) : null;
  const year = days.length ? days[0].slice(0, 4) : "";
  const live = liveDayOf(gd);

  const dateText = !f ? "Date TBD" : days.length > 1 ? `${f.long} – ${l.long}, ${year}` : `${f.long}, ${year}`;
  const pills = (isPast ? `<span class="pill">${ic("history")}Past event</span>` : "")
    + (live ? `<span class="pill pill-amber">Day ${live} of ${days.length}</span>` : (days.length > 1 ? `<span class="pill">${days.length} days</span>` : ""))
    + (isPrivate ? `<span class="pill pill-gold">${ic("lock")}Private</span>` : "");
  if (gdKicker) gdKicker.innerHTML = `<span class="num">${esc(dateText)}</span>${pills}`;

  const startT = asDate(gd.startsAt) ? fmtTime(gd.startsAt) : "";
  const endL = eventEndTimeLabel(gd.endsAt);
  const timeText = !startT ? ""
    : days.length > 1 ? `${startT} ${f.dow}${endL ? ` – ${endL} ${l.dow}` : ""}`
    : `${startT}${endL ? ` – ${endL}` : ""}`;
  gamedayMeta.innerHTML = [
    timeText ? `<span>${ic("clock")}<span class="num">${esc(timeText)}</span></span>` : "",
    gd.location ? `<span>${ic("pin")}<span>${esc(gd.location)}</span></span>` : "",
    gd.createdByDisplayName ? `<span>${avatarHtml(gd.createdByDisplayName, "av-sm")}<span>Hosted by ${esc(gd.createdByDisplayName)}</span></span>` : ""
  ].join("");

  // Private events have no public share page: organizers get the invite
  // controls instead. Delete lives in the ⋯ menu for organizers and admins.
  let lead = "";
  const menuItems = [];
  if (isPrivate) {
    if (canManage) {
      lead = `<button class="btn btn-quiet" type="button" data-gdact="invite-copy">${ic("link", "ico-sm")}Copy invite link</button>`;
      menuItems.push(
        `<button class="mi" type="button" data-gdact="invite-list">${ic("users")}Invited…</button>`,
        `<button class="mi" type="button" data-gdact="invite-reset">${ic("rotate")}Reset invite link</button>`
      );
    }
  } else {
    lead = `<a class="btn btn-quiet" href="./events/?id=${encodeURIComponent(gd.id)}">${ic("share", "ico-sm")}View / Share</a>`;
  }
  if (canManage) {
    menuItems.push(`${menuItems.length ? "<hr />" : ""}<button class="mi danger" type="button" data-gdact="delete">${ic("trash")}Delete game day</button>`);
  }
  if (gdActs) {
    gdActs.innerHTML = lead + (menuItems.length
      ? `<div class="menuWrap"><button class="btn btn-quiet btn-icon" type="button" data-gdact="menu" aria-haspopup="menu" aria-expanded="false" aria-label="More game day actions">${ic("more")}</button><div class="menu" role="menu" hidden>${menuItems.join("")}</div></div>`
      : "");
  }

  // The header picks up the colors of the day's own box art.
  const art = currentTables.find((t) => t.thumbUrl)?.thumbUrl;
  if (evBg) evBg.style.backgroundImage = art ? `url("${encodeURI(String(art))}")` : "";

  renderStats();
  setPastEventActions(isPast);
}

gdActs?.addEventListener("click", async (e) => {
  const b = e.target.closest("[data-gdact]");
  const gd = currentGameDay;
  if (!b || !gd) return;
  const act = b.getAttribute("data-gdact");
  const menu = gdActs.querySelector(".menu");
  if (act === "menu") {
    e.stopPropagation();
    const open = !!menu?.hidden;
    if (menu) menu.hidden = !open;
    b.setAttribute("aria-expanded", String(open));
    return;
  }
  if (menu) menu.hidden = true;

  if (act === "invite-copy") return copyInviteLink(gd.id);
  if (act === "invite-list") return openInvitesModal(gd);
  if (act === "invite-reset") {
    const ok = await confirmDialog({
      title: "Reset invite link?",
      message: "The old link stops working immediately. People already invited keep their access.",
      confirmLabel: "Reset Link"
    });
    if (!ok) return;
    try {
      const r = await fnRotateInviteToken({ gamedayId: gd.id });
      const link = `${window.location.origin}${window.location.pathname}?event=${encodeURIComponent(gd.id)}&invite=${encodeURIComponent(r.data.token)}`;
      await navigator.clipboard.writeText(link);
      toast("New invite link created and copied.", "success", 6000);
    } catch (err) {
      toast(unwrapCallableError(err), "error");
    }
    return;
  }
  if (act === "delete") {
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
      // Move on now rather than waiting for the snapshot (private events never
      // appear in it).
      lastGameDaysRaw = lastGameDaysRaw.filter((g) => g.id !== gd.id);
      myPrivateGamedays = myPrivateGamedays.filter((g) => g.id !== gd.id);
      currentGameDayId = null;
      currentGameDay = null;
      renderGameDays(lastGameDaysRaw);
      history.replaceState({}, "", gameDayUrl(null));
      showGameDayList();
    } catch (err) {
      toast(unwrapCallableError(err), "error");
    }
  }
});

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
  const changed = gd.id !== currentGameDayId;
  currentGameDayId = gd.id;
  currentGameDay = gd;
  if (changed) {
    closeSheet();
    activeDayKey = null;
    notesOpen.clear();
    expOpen.clear();
    currentTables = [];
    currentPosts = [];
    tablesLoaded = false;
    lastLayoutSig = "";
    stopRosterListenersExcept(new Set());
    if (tablesList) tablesList.innerHTML = '<div class="skeletonCard" aria-hidden="true"></div><div class="skeletonCard" aria-hidden="true"></div>';
    if (dayTabsEl) { dayTabsEl.innerHTML = ""; dayTabsEl.className = ""; }
    if (wantsList) wantsList.innerHTML = "";
    if (wantsCount) wantsCount.textContent = "";
    subscribeGameDayDetails(gd.id);
  }
  renderGameDayHeader(gd);
  showGameDayCard();
  renderRail();
  renderTablesPage();
  if (deepLink) {
    // A deep-linked load has only one history entry; give Back somewhere to
    // land (the planner's default view) instead of leaving the site.
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

// "Host this" on a game request: the normal host flow, pre-filled with the
// requested game. The request is consumed server-side when the table lands.
async function convertRequestFlow(p) {
  if (!currentUser) { openSignInModal(); return; }
  let thing = null;
  try {
    const j = await bggThing(p.bggId);
    thing = { ...(j.thing || {}), expansions: j.expansions || [] };
  } catch (e) {
    // BGG down: fall back to what the request already knows. No expansions,
    // but the table still gets created.
    thing = null;
  }
  if (!thing || !thing.bggId) {
    thing = {
      bggId: p.bggId, name: p.gameName, thumbUrl: p.thumbUrl || "",
      bggYear: p.bggYear || null, bggRating: p.bggRating || null, expansions: []
    };
  }
  await openHostTableFormModal({
    gamedayId: currentGameDayId,
    thing,
    fromPostId: p.id,
    requestedByName: p.createdByDisplayName || ""
  });
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
          <div class="label">Ends (optional)</div>
          <input id="gdEndDate" class="input" type="datetime-local" />
          <div class="hint muted">For conventions: the last day and the time it wraps up.</div>
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

    // Validate the optional end BEFORE disabling the buttons, so a bad value
    // leaves the form usable. A date-only entry means "end of that day".
    const endVal = String(qs("#gdEndDate")?.value || "").trim();
    if (endVal && endVal <= gdStartVal) {
      showInlineError("The event has to end after it starts.");
      return;
    }
    const endsAt = endVal
      ? parseDatetimeLocalToISO(endVal.length === 10 ? `${endVal}T23:59` : endVal)
      : null;

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
      updateAccountUI();
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

// Menus close on an outside click; Escape closes menus, then the sheet.
document.addEventListener("click", (e) => {
  if (acctMenu && !acctMenu.hidden && !e.target.closest("#acctWrap")) setAccountMenu(false);
  const gdMenu = gdActs?.querySelector(".menu");
  if (gdMenu && !gdMenu.hidden && !e.target.closest("#gdActs .menuWrap")) {
    gdMenu.hidden = true;
    gdActs.querySelector('[data-gdact="menu"]')?.setAttribute("aria-expanded", "false");
  }
});
document.addEventListener("keydown", (e) => {
  if (e.key !== "Escape") return;
  if (document.querySelector("#modal")?.style.display !== "none") return; // the modal handles its own Escape
  if (acctMenu && !acctMenu.hidden) { setAccountMenu(false); btnAccount?.focus(); return; }
  const gdMenu = gdActs?.querySelector(".menu");
  if (gdMenu && !gdMenu.hidden) { gdMenu.hidden = true; return; }
  if (sheetTableId) { closeSheet(); return; }
  if (pickerOpen) { pickerOpen = false; renderRail(); }
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

// Browser back/forward moves between game days.
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
  }
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
  if (user) startInboxListener(user.uid); else stopInboxListener();

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
  // Every minute keeps "Started" honest; a day change moves Today, the
  // "Day N of M" tag and the default day tab along.
  renderTablesPage();
  if (dayChanged) {
    if (lastGameDaysRaw.length) renderGameDays(lastGameDaysRaw);
    if (currentGameDay) renderGameDayHeader(currentGameDay);
  }
}, 60 * 1000);

// start
renderRail();
await handleDiscordCallbackIfPresent();
subscribeGameDays();
