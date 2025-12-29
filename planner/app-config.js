// PATH: planner/app-config.js
// Not secret. Used only for client UI gating and Discord OAuth URL creation.

export const OWNER_UID = "172758922417930240";
export const DISCORD_CLIENT_ID = "1454339984004743334";

// This must match what you set in Discord Dev Portal + Functions env var
export const DISCORD_REDIRECT_URI = "https://dfwgamingvillage.com/planner/auth/discord-callback.html";

// Your deployed function endpoint
export const DISCORD_AUTH_FUNCTION_URL = "https://us-central1-dfwgv-planner.cloudfunctions.net/discordAuth";

// BGG proxy endpoints (your deployed Functions)
export const BGG_SEARCH_URL = "https://us-central1-dfwgv-planner.cloudfunctions.net/bggSearch";
export const BGG_THING_URL = "https://us-central1-dfwgv-planner.cloudfunctions.net/bggThing";

// Firebase Functions callable region
export const FUNCTIONS_REGION = "us-central1";
