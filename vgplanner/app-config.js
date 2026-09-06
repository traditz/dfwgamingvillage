// PATH: site/app-config.js
// Not secret. IGDB credentials live only in the Cloudflare Worker; the Discord
// client secret lives only in the planner's Cloud Function.

const LOCAL_HOSTS = new Set(["localhost", "127.0.0.1"]);
export const IS_LOCAL = LOCAL_HOSTS.has(location.hostname);

// Local dev talks to `wrangler dev` on 8787; production is the deployed
// worker (`npx wrangler deploy` from cloudflare/igdb-proxy prints this URL).
export const IGDB_PROXY_BASE = IS_LOCAL
  ? "http://127.0.0.1:8787"
  : "https://dfwgv-igdb-proxy.joemsprague.workers.dev";

export const SITE_NAME = "DFWGV Video Game Planner";
export const TIME_ZONE = "America/Chicago";

// Where this planner is published, relative to the site root. It must be a
// path on the SAME origin as the board-game planner (/planner/) — see the
// comment in firebase-config.js for why.
export const BASE_PATH = "/vgplanner/";

// -----------------------------------------------------------------------
// Discord OAuth
// -----------------------------------------------------------------------
// Same Discord application as the board-game planner, so a user who signs in
// here gets the identical Firebase uid ("discord:<id>") they have there.
export const DISCORD_CLIENT_ID = "1454339984004743334";
export const DISCORD_AUTH_ENDPOINT = "https://discord.com/api/oauth2/authorize";
export const DISCORD_RESPONSE_TYPE = "code";
export const DISCORD_SCOPES = "identify";
export const DISCORD_PROMPT = "consent";

// The planner's existing Cloud Function. It exchanges the OAuth code for a
// Firebase custom token; it accepts our redirect_uri as a query parameter, so
// no change to that function is needed.
export const DISCORD_AUTH_FUNCTION_URL =
  "https://us-central1-dfwgv-planner.cloudfunctions.net/discordAuth";

// SETUP STEP: this exact URL must be listed as a redirect in the Discord
// Developer Portal (Applications -> DFWGV -> OAuth2 -> Redirects). Discord
// rejects any redirect_uri that isn't registered.
//
// Zero-config alternative: set PROD_REDIRECT_URI to the board-game planner's
// already registered callback instead —
//   "https://dfwgamingvillage.com/planner/auth/discord-callback.html"
// That page reads the same `discord_return_to` sessionStorage key we write and
// bounces back here, so it works with no Discord Portal change. The cost is a
// runtime dependency on a file inside the board-game planner.
const PROD_REDIRECT_URI = "https://dfwgamingvillage.com/vgplanner/auth/discord-callback.html";

// In local dev the site is served from the root, so the callback sits at
// /auth/discord-callback.html. Testing Discord locally also needs that URL
// registered in the Discord Portal; Google sign-in needs no setup because
// Firebase authorizes `localhost` out of the box.
export const DISCORD_REDIRECT_URI = IS_LOCAL
  ? `${location.origin}/auth/discord-callback.html`
  : PROD_REDIRECT_URI;
