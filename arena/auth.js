// PATH: arena/auth.js
// The arena's own Discord sign-in, on the arena's own Firebase project. Nothing here touches
// the planners: a named Firebase app ("arena") with its own config, so its session lives
// apart from theirs even on the same origin.
//
//   the page   -> Discord's consent page (OAuth2 authorization code + PKCE)
//   Discord    -> back to this page with ?code=&state=
//   the page   -> signs in anonymously, writes arena_auth/<anon uid> {code, verifier, redirect}
//   the bot    -> exchanges the code with Discord, mints the arena's own sign-in token for
//                 uid "discord:<id>", writes it onto the document
//   the page   -> signInWithCustomToken: signed in as discord:<id>, the anonymous session gone
//
// The bot publishes the Discord application id and the redirect it registered in
// arena_public/config, so this file holds no Discord setting of its own.
import { initializeApp, getApps, getApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import { getAuth, onAuthStateChanged, signInAnonymously, signInWithCustomToken, signOut } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";
import { getFirestore, doc, setDoc, onSnapshot, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";
import { firebaseConfig } from "./firebase-config.js";

export const ready = !!(firebaseConfig && firebaseConfig.projectId && firebaseConfig.apiKey);
const APP = "arena";
const app = ready ? (getApps().some((a) => a.name === APP) ? getApp(APP) : initializeApp(firebaseConfig, APP)) : null;
export const auth = app ? getAuth(app) : null;
export const db = app ? getFirestore(app) : null;

const K_STATE = "arena_oauth_state", K_VERIFIER = "arena_pkce_verifier", K_RETURN = "arena_return_to";
const AUTH_ENDPOINT = "https://discord.com/api/oauth2/authorize";
const TOKEN_WAIT = 30000;

function base64Url(bytes) { return btoa(String.fromCharCode(...bytes)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, ""); }
async function sha256(str) { return new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(str))); }
function randomString(len) { const b = new Uint8Array(len); crypto.getRandomValues(b); return base64Url(b); }

/** Sends the browser to Discord. clientId and redirect come from the bot's arena_public/config. */
export async function signInWithDiscord(clientId, redirect) {
  if (!ready) throw new Error("the arena's sign-in is not set up yet");
  if (!clientId || !redirect) throw new Error("the arena has not published its Discord settings yet");
  const state = randomString(32), verifier = randomString(64);
  sessionStorage.setItem(K_STATE, state);
  sessionStorage.setItem(K_VERIFIER, verifier);
  sessionStorage.setItem(K_RETURN, location.hash || "#watch");
  const params = new URLSearchParams({ client_id: clientId, redirect_uri: redirect, response_type: "code", scope: "identify", state,
    prompt: "none", code_challenge: base64Url(await sha256(verifier)), code_challenge_method: "S256" });
  location.href = AUTH_ENDPOINT + "?" + params.toString();
}

function clearParams() {
  const u = new URL(location.href);
  u.searchParams.delete("code"); u.searchParams.delete("state"); u.searchParams.delete("error"); u.searchParams.delete("error_description");
  const back = sessionStorage.getItem(K_RETURN) || "";
  sessionStorage.removeItem(K_RETURN);
  history.replaceState({}, "", u.pathname + u.search + (back || u.hash));
}

/**
 * Completes a sign-in when Discord has sent the browser back with ?code=&state=.
 *   { handled: false }                     nothing to do
 *   { handled: true, ok: true }            signed in
 *   { handled: true, ok: false, error }    tell the viewer
 */
export async function handleDiscordRedirect(redirect) {
  const params = new URL(location.href).searchParams;
  const code = params.get("code"), state = params.get("state");
  if (params.get("error") && !code) { clearParams(); return { handled: true, ok: false, error: "Sign-in was cancelled." }; }
  if (!code) return { handled: false };
  const expected = sessionStorage.getItem(K_STATE), verifier = sessionStorage.getItem(K_VERIFIER);
  sessionStorage.removeItem(K_STATE); sessionStorage.removeItem(K_VERIFIER);
  if (!ready) { clearParams(); return { handled: true, ok: false, error: "the arena's sign-in is not set up yet" }; }
  if (!expected || expected !== state) { clearParams(); return { handled: true, ok: false, error: "Sign-in was blocked for safety (state mismatch). Please try again." }; }
  if (!verifier) { clearParams(); return { handled: true, ok: false, error: "Sign-in session expired. Please try again." }; }
  try {
    const anon = await signInAnonymously(auth);
    const ref = doc(db, "arena_auth", anon.user.uid);
    await setDoc(ref, { code, verifier, redirect: redirect || (location.origin + location.pathname), status: "pending", created: serverTimestamp() });
    const token = await new Promise((resolve, reject) => {
      let done = false;
      const un = onSnapshot(ref, (snap) => {
        const d = snap.data() || {};
        if (done) return;
        if (d.status === "done" && d.token) { done = true; un(); resolve(d.token); }
        else if (d.status === "failed") { done = true; un(); reject(new Error(d.note || "the arena could not complete the sign-in")); }
      }, (e) => { if (!done) { done = true; reject(e); } });
      setTimeout(() => { if (!done) { done = true; un(); reject(new Error("the arena did not answer the sign-in in time (is the bot running?)")); } }, TOKEN_WAIT);
    });
    await signInWithCustomToken(auth, token);
    clearParams();
    return { handled: true, ok: true };
  } catch (e) {
    clearParams();
    try { if (auth.currentUser && auth.currentUser.isAnonymous) await signOut(auth); } catch (e2) {}
    return { handled: true, ok: false, error: e && e.message ? e.message : String(e) };
  }
}

/** Calls back with { uid, name, provider } for a Discord sign-in, or null (anonymous sessions count as nobody). */
export function onUser(callback) {
  if (!auth) { queueMicrotask(() => callback(null)); return () => {}; }
  return onAuthStateChanged(auth, async (u) => {
    if (!u || u.isAnonymous || !String(u.uid).startsWith("discord:")) { callback(null); return; }
    let claims = {};
    try { claims = (await u.getIdTokenResult()).claims || {}; } catch (e) {}
    callback({ uid: u.uid, name: claims.discordDisplayName || claims.discordUsername || u.displayName || ("Discord user " + u.uid.slice(-4)), provider: "discord" });
  });
}

export function signOutUser() { return auth ? signOut(auth) : Promise.resolve(); }
