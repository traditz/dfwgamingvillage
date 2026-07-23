import TOP100 from "./top100.json";

const BGG_COLLECTION_URL = "https://boardgamegeek.com/xmlapi2/collection";
const BGG_PLAYS_URL = "https://boardgamegeek.com/xmlapi2/plays";
const BGG_THING_URL = "https://boardgamegeek.com/xmlapi2/thing";
const BGG_BROWSE_URL = "https://boardgamegeek.com/browse/boardgame/page/";
const DEFAULT_USERNAME = "traditz";

// Gallery: lists images from a public Google Drive folder via the Drive API.
const GOOGLE_DRIVE_FILES_URL = "https://www.googleapis.com/drive/v3/files";
const GALLERY_FOLDER_ID = "1ClIRRga46wACqe0yB5lA14ToIneXXBrB";
// The Google API key is restricted to this HTTP referrer; the worker sends it.
const GALLERY_REFERER = "https://www.dfwgamingvillage.com/";
const ALLOWED_ORIGINS = new Set([
  "https://www.dfwgamingvillage.com",
  "https://dfwgamingvillage.com",
  "http://127.0.0.1:8080",
  "http://localhost:8080"
]);

function corsHeaders(request) {
  const origin = request.headers.get("Origin");
  const allowedOrigin = ALLOWED_ORIGINS.has(origin) ? origin : "https://www.dfwgamingvillage.com";

  return {
    "Access-Control-Allow-Origin": allowedOrigin,
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Max-Age": "86400"
  };
}

function validateUsername(username) {
  return /^[A-Za-z0-9_-]{1,32}$/.test(username);
}

function clampString(value, maxLength) {
  return typeof value === "string" ? value.slice(0, maxLength) : "";
}

function jsonResponse(body, status, cors) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...cors,
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store"
    }
  });
}

function isAuthorized(request, env) {
  const expectedToken = env.ANALYTICS_ADMIN_TOKEN;
  const authorization = request.headers.get("Authorization") || "";
  const token = authorization.startsWith("Bearer ") ? authorization.slice(7).trim() : "";

  return Boolean(expectedToken && token && token === expectedToken);
}

function getAnalyticsRange(range) {
  const ranges = {
    "24h": "-1 day",
    "7d": "-7 days",
    "30d": "-30 days",
    "90d": "-90 days"
  };

  return ranges[range] || ranges["7d"];
}

function requireAnalyticsDb(env) {
  if (!env.ANALYTICS_DB) {
    throw new Error("Analytics database is not configured.");
  }

  return env.ANALYTICS_DB;
}

async function handlePageView(request, env, cors) {
  if (request.method !== "POST") {
    return new Response("Method not allowed", {
      status: 405,
      headers: { ...cors, "Content-Type": "text/plain; charset=utf-8" }
    });
  }

  let payload;
  try {
    payload = await request.json();
  } catch {
    return new Response("Invalid JSON", {
      status: 400,
      headers: { ...cors, "Content-Type": "text/plain; charset=utf-8" }
    });
  }

  const page = clampString(payload.page, 160);
  if (!page || !page.startsWith("/")) {
    return new Response("Invalid page", {
      status: 400,
      headers: { ...cors, "Content-Type": "text/plain; charset=utf-8" }
    });
  }

  const db = requireAnalyticsDb(env);
  const country = request.cf?.country || "";
  const userAgent = clampString(request.headers.get("User-Agent"), 300);
  const refererHeader = clampString(request.headers.get("Referer"), 500);
  const referrer = clampString(payload.referrer, 500) || refererHeader;
  const utm = payload.utm && typeof payload.utm === "object" ? payload.utm : {};

  await db.prepare(`
    INSERT INTO page_views (
      timestamp,
      page,
      query,
      title,
      referrer,
      language,
      timezone,
      country,
      user_agent,
      utm_source,
      utm_medium,
      utm_campaign,
      viewport_width,
      viewport_height,
      screen_width,
      screen_height,
      session_id
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).bind(
    clampString(payload.timestamp, 40) || new Date().toISOString(),
    page,
    clampString(payload.query, 300),
    clampString(payload.title, 180),
    referrer,
    clampString(payload.language, 40),
    clampString(payload.timezone, 80),
    country,
    userAgent,
    clampString(utm.utm_source, 120),
    clampString(utm.utm_medium, 120),
    clampString(utm.utm_campaign, 120),
    Number(payload.viewportWidth) || 0,
    Number(payload.viewportHeight) || 0,
    Number(payload.screenWidth) || 0,
    Number(payload.screenHeight) || 0,
    clampString(payload.sessionId, 80)
  ).run();

  return jsonResponse({ ok: true }, 202, cors);
}

async function handleAnalyticsSummary(request, env, cors) {
  if (request.method !== "GET") {
    return new Response("Method not allowed", {
      status: 405,
      headers: { ...cors, "Content-Type": "text/plain; charset=utf-8" }
    });
  }

  if (!isAuthorized(request, env)) {
    return jsonResponse({ ok: false, error: "Unauthorized" }, 401, cors);
  }

  const db = requireAnalyticsDb(env);
  const url = new URL(request.url);
  const range = url.searchParams.get("range") || "7d";
  const since = getAnalyticsRange(range);

  const bindSince = (statement) => db.prepare(statement).bind(since);
  const [overview, topPages, daily, referrers, countries, campaigns, recent] = await Promise.all([
    bindSince(`
      SELECT
        COUNT(*) AS views,
        COUNT(DISTINCT session_id) AS sessions,
        COUNT(DISTINCT page) AS pages
      FROM page_views
      WHERE datetime(timestamp) >= datetime('now', ?)
    `).first(),
    bindSince(`
      SELECT
        CASE WHEN page LIKE '%/index.html'
             THEN substr(page, 1, length(page) - 10)
             ELSE page END AS page,
        COUNT(*) AS views,
        COUNT(DISTINCT session_id) AS sessions
      FROM page_views
      WHERE datetime(timestamp) >= datetime('now', ?)
      GROUP BY 1
      ORDER BY views DESC
      LIMIT 500
    `).all(),
    bindSince(`
      SELECT
        date(timestamp) AS day,
        COUNT(*) AS views,
        COUNT(DISTINCT session_id) AS sessions
      FROM page_views
      WHERE datetime(timestamp) >= datetime('now', ?)
      GROUP BY day
      ORDER BY day ASC
    `).all(),
    bindSince(`
      SELECT
        COALESCE(NULLIF(referrer, ''), '(direct)') AS referrer,
        COUNT(*) AS views
      FROM page_views
      WHERE datetime(timestamp) >= datetime('now', ?)
      GROUP BY referrer
      ORDER BY views DESC
      LIMIT 20
    `).all(),
    bindSince(`
      SELECT
        COALESCE(NULLIF(country, ''), '(unknown)') AS country,
        COUNT(*) AS views
      FROM page_views
      WHERE datetime(timestamp) >= datetime('now', ?)
      GROUP BY country
      ORDER BY views DESC
      LIMIT 20
    `).all(),
    bindSince(`
      SELECT
        COALESCE(NULLIF(utm_source, ''), '(none)') AS source,
        COALESCE(utm_medium, '') AS medium,
        COALESCE(utm_campaign, '') AS campaign,
        COUNT(*) AS views
      FROM page_views
      WHERE datetime(timestamp) >= datetime('now', ?)
      GROUP BY source, medium, campaign
      ORDER BY views DESC
      LIMIT 20
    `).all(),
    bindSince(`
      SELECT
        timestamp,
        page,
        referrer,
        country
      FROM page_views
      WHERE datetime(timestamp) >= datetime('now', ?)
      ORDER BY timestamp DESC
      LIMIT 50
    `).all()
  ]);

  return jsonResponse({
    ok: true,
    range,
    generatedAt: new Date().toISOString(),
    overview: overview || { views: 0, sessions: 0, pages: 0 },
    topPages: topPages.results || [],
    daily: daily.results || [],
    referrers: referrers.results || [],
    countries: countries.results || [],
    campaigns: campaigns.results || [],
    recent: recent.results || []
  }, 200, cors);
}

async function handleBggCollection(request, env, cors, incomingUrl) {
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

  const username = incomingUrl.searchParams.get("username") || DEFAULT_USERNAME;
  if (!validateUsername(username)) {
    return new Response("Invalid username", {
      status: 400,
      headers: { ...cors, "Content-Type": "text/plain; charset=utf-8" }
    });
  }

  const bggUrl = new URL(BGG_COLLECTION_URL);
  bggUrl.searchParams.set("username", username);
  bggUrl.searchParams.set("stats", "1");
  // Default is owned games. ?want=1 requests the "want to play" list;
  // ?wishlist=1 requests the wishlist (items carry a wishlistpriority attr).
  if (incomingUrl.searchParams.get("want") === "1") {
    bggUrl.searchParams.set("wanttoplay", "1");
  } else if (incomingUrl.searchParams.get("wishlist") === "1") {
    bggUrl.searchParams.set("wishlist", "1");
  } else {
    bggUrl.searchParams.set("own", "1");
  }
  // Base games only unless the caller explicitly asks to include expansions.
  if (incomingUrl.searchParams.get("includeexp") !== "1") {
    bggUrl.searchParams.set("excludesubtype", "boardgameexpansion");
  }

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

/**
 * Aggregates every recorded play for a user into per-game totals plus the
 * comment text for each play (used client-side to detect which expansions were
 * played). Walks BGG's paginated plays API server-side so the page only makes
 * one request. Returns JSON keyed by BGG object id.
 */
async function handleBggPlays(request, env, cors, incomingUrl) {
  if (request.method !== "GET") {
    return new Response("Method not allowed", {
      status: 405,
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

  const games = {};
  const MAX_PAGES = 40; // BGG returns 100 plays/page; 40 pages = 4000 plays cap.
  let total = 0;

  for (let page = 1; page <= MAX_PAGES; page++) {
    const playsUrl = new URL(BGG_PLAYS_URL);
    playsUrl.searchParams.set("username", username);
    playsUrl.searchParams.set("page", String(page));

    const response = await fetch(playsUrl.toString(), {
      headers: { Authorization: `Bearer ${env.BGG_TOKEN}` }
    });
    if (!response.ok) {
      if (page === 1) {
        return new Response(`BGG plays API responded with status: ${response.status}`, {
          status: 502,
          headers: { ...cors, "Content-Type": "text/plain; charset=utf-8" }
        });
      }
      break; // Tolerate a mid-walk hiccup; return what we have.
    }

    const xml = await response.text();
    if (page === 1) {
      const totalMatch = xml.match(/<plays[^>]*\btotal="(\d+)"/);
      total = totalMatch ? parseInt(totalMatch[1], 10) : 0;
    }

    const playRegex = /<play\b[^>]*>[\s\S]*?<\/play>/g;
    const playMatches = xml.match(playRegex) || [];
    if (playMatches.length === 0) break; // No more plays.

    for (const play of playMatches) {
      const quantity = parseInt((play.match(/\bquantity="(\d+)"/) || [])[1] || "1", 10);
      const itemMatch = play.match(/<item\b[^>]*\bobjectid="(\d+)"[^>]*>/);
      if (!itemMatch) continue;
      const id = itemMatch[1];
      const nameMatch = play.match(/<item\b[^>]*\bname="([^"]*)"/);
      const commentMatch = play.match(/<comments>([\s\S]*?)<\/comments>/);
      const comment = commentMatch ? decodeEntities(commentMatch[1]).trim() : "";

      if (!games[id]) {
        games[id] = { id, name: nameMatch ? decodeEntities(nameMatch[1]) : "", plays: 0, comments: [] };
      }
      games[id].plays += quantity;
      if (comment) games[id].comments.push(comment);
    }

    // Last page reached when this page had fewer than a full 100 plays.
    if (playMatches.length < 100) break;
  }

  return jsonResponse(
    { ok: true, username, total, generatedAt: new Date().toISOString(), games },
    200,
    { ...cors, "Cache-Control": "public, max-age=900" }
  );
}

/**
 * Pass-through to BGG's thing API (comma-separated ids), used client-side to
 * hydrate Top-100 entries and to list a base game's expansions on demand.
 */
async function handleBggThing(request, env, cors, incomingUrl) {
  if (request.method !== "GET") {
    return new Response("Method not allowed", {
      status: 405,
      headers: { ...cors, "Content-Type": "text/plain; charset=utf-8" }
    });
  }

  const ids = incomingUrl.searchParams.get("id") || "";
  if (!/^\d+(,\d+)*$/.test(ids) || ids.length > 400) {
    return new Response("Invalid id list", {
      status: 400,
      headers: { ...cors, "Content-Type": "text/plain; charset=utf-8" }
    });
  }

  const thingUrl = new URL(BGG_THING_URL);
  thingUrl.searchParams.set("id", ids);
  thingUrl.searchParams.set("stats", "1");
  // ?marketplace=1 includes current BGG Marketplace listings (price/condition),
  // used by the admin dashboard's second-hand pricing tool.
  if (incomingUrl.searchParams.get("marketplace") === "1") {
    thingUrl.searchParams.set("marketplace", "1");
  }

  const response = await fetch(thingUrl.toString(), {
    headers: { Authorization: `Bearer ${env.BGG_TOKEN}` }
  });
  const body = await response.text();

  return new Response(body, {
    status: response.status,
    headers: {
      ...cors,
      "Content-Type": response.headers.get("Content-Type") || "application/xml; charset=utf-8",
      "Cache-Control": response.status === 200 ? "public, max-age=86400" : "no-store"
    }
  });
}

/**
 * Returns the all-time Top N games (default 100).
 *
 * BGG has no official top-list endpoint. We try to scrape the public "browse
 * boardgames" ranking page live, but BGG's bot protection blocks requests coming
 * from Cloudflare's network (403), so in practice we fall back to the bundled
 * src/top100.json snapshot — refresh it with `node scripts/refresh-top100.mjs`.
 */
async function handleBggTop(request, env, cors, incomingUrl) {
  if (request.method !== "GET") {
    return new Response("Method not allowed", {
      status: 405,
      headers: { ...cors, "Content-Type": "text/plain; charset=utf-8" }
    });
  }

  const count = Math.min(parseInt(incomingUrl.searchParams.get("count") || "100", 10) || 100, 200);
  const scraped = await scrapeBggTop(count);

  if (scraped.length) {
    return jsonResponse(
      { ok: true, count: scraped.length, source: "live", generatedAt: new Date().toISOString(), games: scraped },
      200,
      { ...cors, "Cache-Control": "public, max-age=21600" } // 6 hours
    );
  }

  // Live scrape unavailable (blocked) — serve the bundled snapshot.
  return jsonResponse(
    { ok: true, count: Math.min(count, TOP100.games.length), source: "snapshot", generatedAt: TOP100.generatedAt, games: TOP100.games.slice(0, count) },
    200,
    { ...cors, "Cache-Control": "public, max-age=21600" }
  );
}

/** Attempts the live browse-page scrape; returns [] on any failure. */
async function scrapeBggTop(count) {
  const pagesNeeded = Math.ceil(count / 100); // BGG browse shows 100 ranks per page.
  const games = [];
  try {
    for (let page = 1; page <= pagesNeeded; page++) {
      const response = await fetch(`${BGG_BROWSE_URL}${page}`, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
          Accept: "text/html,application/xhtml+xml"
        }
      });
      if (!response.ok) break;

      const html = await response.text();
      // Each ranked game is a <tr id='row_'> block (BGG uses single-quoted
      // attributes). Regexes are quote-agnostic so a future switch won't break.
      const rows = html.match(/<tr[^>]*id=['"]row_['"][\s\S]*?<\/tr>/g) || [];
      for (const row of rows) {
        const linkMatch = row.match(/\/boardgame\/(\d+)\/[^"]*"\s+class=['"]primary['"]\s*>([^<]+)<\/a>/);
        if (!linkMatch) continue;
        const rankMatch = row.match(/<a name="(\d+)"><\/a>/);
        const yearMatch = row.match(/<span[^>]*class=['"]smallerfont dull['"][^>]*>\(([^)]+)\)<\/span>/);
        const imgMatch = row.match(/<img[^>]+\ssrc="([^"]+)"/);
        const ratingCells = [...row.matchAll(/<td[^>]*class=['"]collection_bggrating['"][^>]*>\s*([\d.]+|N\/A)/g)];
        games.push({
          rank: rankMatch ? parseInt(rankMatch[1], 10) : games.length + 1,
          id: linkMatch[1],
          name: decodeEntities(linkMatch[2]).trim(),
          year: yearMatch ? yearMatch[1] : "N/A",
          image: imgMatch ? imgMatch[1] : "",
          geekRating: ratingCells[0] ? ratingCells[0][1] : "N/A",
          avgRating: ratingCells[1] ? ratingCells[1][1] : "N/A"
        });
        if (games.length >= count) break;
      }
      if (games.length >= count) break;
    }
  } catch {
    return [];
  }
  return games;
}

/** Minimal XML/HTML entity decoder for the few named entities BGG emits. */
function decodeEntities(str) {
  return str
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(parseInt(code, 10)));
}

/**
 * Lists the images in the public gallery Drive folder (newest first) and returns
 * their file ids + names as JSON. The page picks a random subset to display.
 */
async function handleGallery(request, env, cors) {
  if (request.method !== "GET") {
    return new Response("Method not allowed", {
      status: 405,
      headers: { ...cors, "Content-Type": "text/plain; charset=utf-8" }
    });
  }

  if (!env.GOOGLE_API_KEY) {
    return new Response("Google API key is not configured.", {
      status: 500,
      headers: { ...cors, "Content-Type": "text/plain; charset=utf-8" }
    });
  }

  const driveUrl = new URL(GOOGLE_DRIVE_FILES_URL);
  driveUrl.searchParams.set("q", `'${GALLERY_FOLDER_ID}' in parents and mimeType contains 'image/' and trashed = false`);
  driveUrl.searchParams.set("key", env.GOOGLE_API_KEY);
  driveUrl.searchParams.set("fields", "files(id,name)");
  driveUrl.searchParams.set("pageSize", "1000");
  driveUrl.searchParams.set("orderBy", "createdTime desc");

  const driveResponse = await fetch(driveUrl.toString(), {
    headers: { Referer: GALLERY_REFERER }
  });

  if (!driveResponse.ok) {
    const detail = await driveResponse.text();
    return new Response(`Drive API responded with status ${driveResponse.status}: ${detail.slice(0, 200)}`, {
      status: 502,
      headers: { ...cors, "Content-Type": "text/plain; charset=utf-8" }
    });
  }

  const data = await driveResponse.json();
  const files = (data.files || []).map((f) => ({ id: f.id, name: f.name }));

  return jsonResponse(
    { ok: true, count: files.length, files },
    200,
    { ...cors, "Cache-Control": "public, max-age=600" } // 10 minutes
  );
}

export default {
  async fetch(request, env) {
    const cors = corsHeaders(request);
    const incomingUrl = new URL(request.url);

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: cors });
    }

    // "/api/v" is the neutral-named endpoint; "/api/page-view" kept for
    // backward compat with cached pages (the old name matches blocker rules).
    if (incomingUrl.pathname === "/api/v" || incomingUrl.pathname === "/api/page-view") {
      return handlePageView(request, env, cors);
    }

    if (incomingUrl.pathname === "/api/analytics-summary") {
      return handleAnalyticsSummary(request, env, cors);
    }

    // Token check for the unlisted admin dashboard (same token as analytics).
    if (incomingUrl.pathname === "/api/admin-verify") {
      const ok = isAuthorized(request, env);
      return jsonResponse({ ok }, ok ? 200 : 401, cors);
    }

    if (incomingUrl.pathname === "/api/bgg-collection") {
      return handleBggCollection(request, env, cors, incomingUrl);
    }

    if (incomingUrl.pathname === "/api/bgg-plays") {
      return handleBggPlays(request, env, cors, incomingUrl);
    }

    if (incomingUrl.pathname === "/api/bgg-thing") {
      return handleBggThing(request, env, cors, incomingUrl);
    }

    if (incomingUrl.pathname === "/api/bgg-top") {
      return handleBggTop(request, env, cors, incomingUrl);
    }

    if (incomingUrl.pathname === "/api/gallery") {
      return handleGallery(request, env, cors);
    }

    return new Response("Not found", {
      status: 404,
      headers: { ...cors, "Content-Type": "text/plain; charset=utf-8" }
    });
  }
};
