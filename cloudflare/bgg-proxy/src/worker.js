const BGG_COLLECTION_URL = "https://boardgamegeek.com/xmlapi2/collection";
const DEFAULT_USERNAME = "traditz";
const ALLOWED_ORIGINS = new Set([
  "https://www.dfwgamingvillage.com",
  "https://dfwgamingvillage.com"
]);

function corsHeaders(request) {
  const origin = request.headers.get("Origin");
  const allowedOrigin = ALLOWED_ORIGINS.has(origin) ? origin : "https://www.dfwgamingvillage.com";

  return {
    "Access-Control-Allow-Origin": allowedOrigin,
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400"
  };
}

function validateUsername(username) {
  return /^[A-Za-z0-9_-]{1,32}$/.test(username);
}

export default {
  async fetch(request, env) {
    const cors = corsHeaders(request);

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: cors });
    }

    if (request.method !== "GET") {
      return new Response("Method not allowed", {
        status: 405,
        headers: { ...cors, "Content-Type": "text/plain; charset=utf-8" }
      });
    }

    if (!env.BGG_TOKEN) {
      return new Response("BGG token is not configured.", {
        status: 500,
        headers: { ...cors, "Content-Type": "text/plain; charset=utf-8" }
      });
    }

    const incomingUrl = new URL(request.url);
    if (incomingUrl.pathname !== "/api/bgg-collection") {
      return new Response("Not found", {
        status: 404,
        headers: { ...cors, "Content-Type": "text/plain; charset=utf-8" }
      });
    }

    const username = incomingUrl.searchParams.get("username") || DEFAULT_USERNAME;
    if (!validateUsername(username)) {
      return new Response("Invalid username", {
        status: 400,
        headers: { ...cors, "Content-Type": "text/plain; charset=utf-8" }
      });
    }

    const bggUrl = new URL(BGG_COLLECTION_URL);
    bggUrl.searchParams.set("username", username);
    bggUrl.searchParams.set("own", "1");
    bggUrl.searchParams.set("stats", "1");
    bggUrl.searchParams.set("excludesubtype", "boardgameexpansion");

    const bggResponse = await fetch(bggUrl.toString(), {
      headers: {
        Authorization: `Bearer ${env.BGG_TOKEN}`
      }
    });

    const body = await bggResponse.text();
    const contentType = bggResponse.headers.get("Content-Type") || "application/xml; charset=utf-8";

    return new Response(body, {
      status: bggResponse.status,
      headers: {
        ...cors,
        "Content-Type": contentType,
        "Cache-Control": bggResponse.status === 200 ? "public, max-age=900" : "no-store"
      }
    });
  }
};
