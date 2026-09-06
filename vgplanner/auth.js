// PATH: site/auth.js
// Discord + Google sign-in, sharing one session with the board-game planner.
//
// Both providers land on the same Firebase project (dfwgv-planner):
//   Discord -> OAuth PKCE -> the planner's `discordAuth` function mints a
//              custom token with uid "discord:<id>" -> signInWithCustomToken
//   Google  -> signInWithPopup(GoogleAuthProvider)
//
// Nothing here writes to the board-game planner's data. The only Firestore
// access is reading the signed-in user's OWN users/{uid} doc for their
// nickname, which the planner's rules explicitly allow
// (`allow read: if signedIn() && request.auth.uid == uid`). We deliberately do
// NOT call getMyPlannerRole — that callable upserts user records and can
// auto-accept host invites, which are board-game planner side effects.

import { initializeApp, getApps } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
  signOut,
  signInWithCustomToken,
  signInWithPopup,
  GoogleAuthProvider
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";

import { firebaseConfig } from "./firebase-config.js";
import {
  DISCORD_CLIENT_ID,
  DISCORD_AUTH_ENDPOINT,
  DISCORD_RESPONSE_TYPE,
  DISCORD_SCOPES,
  DISCORD_PROMPT,
  DISCORD_REDIRECT_URI,
  DISCORD_AUTH_FUNCTION_URL,
  BASE_PATH,
  IS_LOCAL
} from "./app-config.js";

// initializeApp with no name gives the [DEFAULT] app — the same app name the
// board-game planner uses. Combined with the same apiKey and origin, that is
// what makes the persisted session shared. Never pass a custom app name here.
const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
export const auth = getAuth(app);
const db = getFirestore(app);

// Persistence is left at the SDK default (IndexedDB). The board-game planner
// does the same; calling setPersistence with anything else would split the
// stored session and force a second sign-in.

// sessionStorage keys are shared with the board-game planner on purpose: its
// callback page reads `discord_return_to`, so either callback can serve either
// planner.
const K_STATE = "discord_oauth_state";
const K_VERIFIER = "discord_pkce_verifier";
const K_RETURN = "discord_return_to";

// ---------- PKCE helpers ----------

function base64UrlEncode(bytes) {
  return btoa(String.fromCharCode(...bytes))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

async function sha256(str) {
  const enc = new TextEncoder().encode(str);
  return new Uint8Array(await crypto.subtle.digest("SHA-256", enc));
}

function randomString(len = 48) {
  const bytes = new Uint8Array(len);
  crypto.getRandomValues(bytes);
  return base64UrlEncode(bytes);
}

// ---------- display name ----------

// Same precedence as the board-game planner, so a person shows up under one
// name on both sites: their planner nickname if they set one, otherwise their
// Discord name from the token claims, otherwise the Google profile name.
async function resolveDisplayName(user) {
  if (!user) return "";

  let claims = {};
  try {
    claims = (await user.getIdTokenResult())?.claims || {};
  } catch { /* fall through to profile fields */ }

  let nickname = "";
  try {
    const snap = await getDoc(doc(db, "users", user.uid));
    if (snap.exists()) nickname = String(snap.data()?.nickname || "").trim();
  } catch { /* not readable or offline — the fallbacks below are fine */ }

  return (
    nickname
    || claims.discordDisplayName
    || claims.discordUsername
    || user.displayName
    || user.email
    || (user.uid?.startsWith("discord:") ? "Discord user" : user.uid)
  );
}

function providerOf(user) {
  if (!user) return "";
  if (user.uid?.startsWith("discord:")) return "discord";
  return user.providerData?.[0]?.providerId === "google.com" ? "google" : "";
}

// ---------- sign in / out ----------

export async function signInWithDiscord() {
  const state = randomString(32);
  const verifier = randomString(64);
  const challenge = base64UrlEncode(await sha256(verifier));

  sessionStorage.setItem(K_STATE, state);
  sessionStorage.setItem(K_VERIFIER, verifier);
  sessionStorage.setItem(K_RETURN, window.location.href);

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

  window.location.href = `${DISCORD_AUTH_ENDPOINT}?${params.toString()}`;
}

export async function signInWithGoogle() {
  await signInWithPopup(auth, new GoogleAuthProvider());
}

export function signOutUser() {
  if (devIdentity()) {
    localStorage.removeItem(DEV_USER_KEY);
    location.reload();
    return Promise.resolve();
  }
  return signOut(auth);
}

// ---------- API credential ----------

/** The Firebase ID token the API worker verifies, or "" when signed out. */
export async function getIdToken() {
  const dev = devIdentity();
  if (dev) return `dev:${dev.uid}:${dev.name}`;
  const user = auth.currentUser;
  if (!user) return "";
  try { return await user.getIdToken(); } catch { return ""; }
}

// ---------- local-only test identity ----------

// On localhost only: `localStorage.setItem("vgplanner.devUser", "discord:123:Joe")`
// acts as a signed-in user without a real sign-in, so the hosting and joining
// flows can be exercised end to end against the local worker (which accepts
// dev tokens only when DEV_AUTH_BYPASS=1 is in its .dev.vars). Inert when the
// site is served from any real host.
const DEV_USER_KEY = "vgplanner.devUser";

function devIdentity() {
  if (!IS_LOCAL) return null;
  try {
    const v = localStorage.getItem(DEV_USER_KEY);
    if (!v) return null;
    // "discord:123:Joe" -> uid "discord:123", name "Joe"; "abc:Joe" -> uid "abc".
    const m = v.match(/^((?:discord:)?[^:]+):?(.*)$/);
    if (!m) return null;
    return { user: null, uid: m[1], name: m[2] || m[1], provider: "dev" };
  } catch {
    return null;
  }
}

// ---------- Discord return leg ----------

function clearOAuthParams() {
  const u = new URL(window.location.href);
  u.searchParams.delete("code");
  u.searchParams.delete("state");
  window.history.replaceState({}, "", u.toString());
}

/**
 * Completes Discord sign-in when the callback page has bounced us back with
 * ?code=&state=. Returns:
 *   { handled: false }                    nothing to do
 *   { handled: true, ok: true }           signed in
 *   { handled: true, ok: false, error }   surface this to the user
 */
export async function handleDiscordRedirect() {
  const params = new URL(window.location.href).searchParams;
  const code = params.get("code");
  const state = params.get("state");
  if (!code) return { handled: false };

  const expected = sessionStorage.getItem(K_STATE);
  const verifier = sessionStorage.getItem(K_VERIFIER);

  const finish = () => {
    clearOAuthParams();
    sessionStorage.removeItem(K_STATE);
    sessionStorage.removeItem(K_VERIFIER);
    sessionStorage.removeItem(K_RETURN);
  };

  // The state check is the CSRF guard: only a flow this browser started can
  // complete. A mismatch means the code didn't come from our request.
  if (!expected || expected !== state) {
    finish();
    return { handled: true, ok: false, error: "Sign-in was blocked for safety (state mismatch). Please try again." };
  }
  if (!verifier) {
    finish();
    return { handled: true, ok: false, error: "Sign-in session expired. Please try again." };
  }

  try {
    const url = `${DISCORD_AUTH_FUNCTION_URL}`
      + `?code=${encodeURIComponent(code)}`
      + `&code_verifier=${encodeURIComponent(verifier)}`
      + `&redirect_uri=${encodeURIComponent(DISCORD_REDIRECT_URI)}`;

    const res = await fetch(url);
    const body = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(body?.error || `HTTP ${res.status}`);
    if (!body.firebaseToken) throw new Error("No token returned by the sign-in service.");

    await signInWithCustomToken(auth, body.firebaseToken);
    finish();
    return { handled: true, ok: true };
  } catch (e) {
    finish();
    return { handled: true, ok: false, error: e?.message || String(e) };
  }
}

// ---------- observation ----------

/**
 * Calls back with { user, uid, name, provider } or null, whenever auth changes.
 * Fires immediately with the restored session on page load — that restore is
 * what makes moving between the two planners seamless.
 */
export function onUser(callback) {
  const dev = devIdentity();
  if (dev) {
    queueMicrotask(() => callback(dev));
    return () => {};
  }
  let seq = 0;
  return onAuthStateChanged(auth, async (user) => {
    const mine = ++seq;
    if (!user) {
      callback(null);
      return;
    }
    const name = await resolveDisplayName(user);
    if (mine !== seq) return; // a newer auth change superseded this one
    callback({ user, uid: user.uid, name, provider: providerOf(user) });
  });
}

export { BASE_PATH };
