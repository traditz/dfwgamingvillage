// PATH: planner/auth/discord-callback.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import { getAuth, signInWithCustomToken } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";
import { firebaseConfig } from "../firebase-config.js";

const msg = document.getElementById("msg");
const err = document.getElementById("err");

function qs(name) {
  return new URLSearchParams(location.search).get(name);
}

(async () => {
  try {
    const code = qs("code");
    const state = qs("state");
    if (!code) throw new Error("Missing ?code from Discord.");
    if (!state) throw new Error("Missing ?state from Discord.");

    const expectedState = sessionStorage.getItem("dfwgv_discord_state");
    if (!expectedState || expectedState !== state) {
      throw new Error("State mismatch (blocked for safety). Try signing in again.");
    }

    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);

    msg.textContent = "Exchanging Discord code for a Firebase token…";

    // Call your HTTP function
    const url = new URL("https://us-central1-dfwgv-planner.cloudfunctions.net/discordAuth");
    url.searchParams.set("code", code);
    url.searchParams.set("state", state);
    url.searchParams.set("redirect", location.origin + location.pathname); // informational

    const res = await fetch(url.toString(), { method: "GET" });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(`discordAuth failed: ${res.status} ${text}`);
    }
    const data = await res.json();
    if (!data.firebaseToken) throw new Error("No firebaseToken in response.");

    msg.textContent = "Signing into Firebase…";
    await signInWithCustomToken(auth, data.firebaseToken);

    msg.textContent = "Signed in. Redirecting…";
    setTimeout(() => {
      window.location.href = "/planner/";
    }, 700);
  } catch (e) {
    err.textContent = String(e?.message || e);
    msg.textContent = "Sign-in failed.";
  }
})();

