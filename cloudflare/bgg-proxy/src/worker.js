import TOP100 from "./top100.json";

const BGG_COLLECTION_URL = "https://boardgamegeek.com/xmlapi2/collection";
const BGG_PLAYS_URL = "https://boardgamegeek.com/xmlapi2/plays";
const BGG_THING_URL = "https://boardgamegeek.com/xmlapi2/thing";
const BGG_HOT_URL = "https://boardgamegeek.com/xmlapi2/hot";
const BGG_SEARCH_URL = "https://boardgamegeek.com/xmlapi2/search";
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

const HOT_HISTORY_KEY = "hot-history";
const HOT_HISTORY_DAYS = 60; // keep two months of daily snapshots

const WATCHLIST_KEY = "watchlist";
const PRICE_HISTORY_KEY = "price-history";
const PRICE_ALERTS_KEY = "price-alerts";
const PRICE_HISTORY_DAYS = 90;
const WATCHLIST_CAP = 150;
const PRICE_SLICE = 10; // games per price-check invocation (chained via self-fetch)
const DROP_VS_TRAILING = 0.10;  // alert when today's low is 10% under the trailing average
const OUTLIER_VS_TODAY = 0.15;  // ...or (young history) 15% under today's average listing
const MIN_TRAILING_POINTS = 3;
const ALERT_COOLDOWN_DAYS = 7;  // don't re-alert the same game within a week

/**
 * Daily cron: snapshot the current Hotness list into KV so the admin
 * dashboard can distinguish sustained heat from one-day blips. Stored as a
 * single JSON object { "yyyy-mm-dd": [{id, rank, name}, ...], ... }.
 */
async function snapshotHotness(env) {
  const response = await fetch(`${BGG_HOT_URL}?type=boardgame`, {
    headers: { Authorization: `Bearer ${env.BGG_TOKEN}` }
  });
  if (!response.ok) return;
  const xml = await response.text();
  const games = [];
  for (const m of xml.matchAll(/<item\b[^>]*\bid="(\d+)"[^>]*\brank="(\d+)"[\s\S]*?<name value="([^"]*)"/g)) {
    games.push({ id: m[1], rank: parseInt(m[2], 10), name: decodeEntities(m[3]) });
  }
  if (games.length === 0) return;

  const history = JSON.parse((await env.HOT_HISTORY.get(HOT_HISTORY_KEY)) || "{}");
  history[new Date().toISOString().slice(0, 10)] = games;
  const dates = Object.keys(history).sort();
  for (const date of dates.slice(0, Math.max(0, dates.length - HOT_HISTORY_DAYS))) delete history[date];
  await env.HOT_HISTORY.put(HOT_HISTORY_KEY, JSON.stringify(history));
}

/**
 * Price watchlist for the admin dashboard (token-gated). Games on the list are
 * price-checked by the daily cron; drops below average ping a Discord webhook
 * (the ALERT_WEBHOOK secret). GET returns list + price history + recent alerts.
 */
async function handleWatchlist(request, env, cors, incomingUrl, ctx) {
  if (!isAuthorized(request, env)) {
    return jsonResponse({ ok: false, error: "Unauthorized" }, 401, cors);
  }

  const list = dedupeById(JSON.parse((await env.HOT_HISTORY.get(WATCHLIST_KEY)) || "[]"));

  if (request.method === "POST") {
    if (incomingUrl.searchParams.get("test") === "1") {
      const result = await sendPriceAlert(env, [{ id: "13", name: "Test alert — the pipeline works", note: "this is a test from the Library Admin dashboard" }], true);
      const sent = typeof result === "object" ? result.ok : Boolean(result);
      return jsonResponse({
        ok: true, sent,
        status: typeof result === "object" ? result.status : undefined,
        detail: typeof result === "object" ? result.detail : "",
        webhookConfigured: Boolean(env.ALERT_WEBHOOK)
      }, 200, cors);
    }
    // Manual price check, same routine the cron runs. The first slice is
    // checked inline (so the response is meaningful); any remaining games
    // continue as chained background invocations.
    if (incomingUrl.searchParams.get("check") === "1") {
      const summary = await checkWatchedPrices(env, ctx, 0);
      return jsonResponse({ ok: true, ...summary, webhookConfigured: Boolean(env.ALERT_WEBHOOK) }, 200, cors);
    }
    let body;
    try { body = await request.json(); } catch { body = {}; }
    const id = String(body.id || "");
    const name = clampString(body.name, 160);
    if (!/^\d+$/.test(id) || !name) {
      return jsonResponse({ ok: false, error: "Invalid game" }, 400, cors);
    }
    // Optional per-game target: alert as soon as the lowest genuine price is at
    // or below this. `target` present but null/0 clears it (back to avg rules);
    // `target` absent leaves any existing target untouched.
    const hasTarget = Object.prototype.hasOwnProperty.call(body, "target");
    const target = hasTarget ? (Number(body.target) > 0 ? Math.round(Number(body.target) * 100) / 100 : null) : undefined;

    const existing = list.find((g) => g.id === id);
    if (existing) {
      existing.name = name;
      if (target !== undefined) existing.target = target;
    } else {
      if (list.length >= WATCHLIST_CAP) {
        return jsonResponse({ ok: false, error: `Watchlist is capped at ${WATCHLIST_CAP} games` }, 400, cors);
      }
      list.push({ id, name, addedAt: new Date().toISOString().slice(0, 10), target: target || null });
    }
    await env.HOT_HISTORY.put(WATCHLIST_KEY, JSON.stringify(list));
    return jsonResponse({ ok: true, list }, 200, cors);
  }

  if (request.method === "DELETE") {
    const id = incomingUrl.searchParams.get("id") || "";
    const next = list.filter((g) => g.id !== id);
    await env.HOT_HISTORY.put(WATCHLIST_KEY, JSON.stringify(next));
    return jsonResponse({ ok: true, list: next }, 200, cors);
  }

  const history = JSON.parse((await env.HOT_HISTORY.get(PRICE_HISTORY_KEY)) || "{}");
  const lastAlerts = JSON.parse((await env.HOT_HISTORY.get(PRICE_ALERTS_KEY)) || "[]");
  return jsonResponse(
    { ok: true, list, history, lastAlerts, webhookConfigured: Boolean(env.ALERT_WEBHOOK) },
    200, cors
  );
}

// Marketplace listings that are NOT the actual base game (organizers, promos,
// upgrade kits, single components, 3D-printed accessories, price-tracker
// placeholders) — detected from the seller's notes. Tuned for precision: it
// triggers on explicit negations and "for the <accessory>" / "selling
// <accessory>" phrasings, NOT on bare accessory words, so a real copy that
// merely "includes an organizer" is kept. See scripts validation runs.
const JUNK_LISTING_NOTES = /\bnot (the|for)( the)?( base)? game\b|\bgame (is )?not includ|\bno game\b|\bgame sold separately\b|\bwithout the (base )?game\b|\bnot offering to sell\b|\bplaceholder\b|\b3d[ -]?print|\bfdm\b|\bresin\b|\bstl\b|laser.?cut|\bi print\b|piece holder|card holder|component holder|dice tray|\bselling (the |my )?(components?|coins?|inserts?|organiz\w+|promos?|stickers?|sleeves?|minis?|miniatures?|upgrades?|tokens?)\b|\b(this|it) is (only )?for (a |an |the |one |1 |my )*(set of |pair of )?[^.]{0,28}\b(coins?|inserts?|organiz\w+|promos?|stickers?|mats?|upgrades?|components?|sleeves?|minis?|tokens?|dashboards?|meeples?|holders?)\b/i;

/** Parses genuine USD marketplace listings, dropping accessory/promo listings
 *  and low-outlier prices (below 60% of the median, floor $8) that are almost
 *  always partial components. Returns them sorted cheapest-first. */
function parseCleanUsdListings(xml) {
  const all = [];
  for (const block of xml.match(/<listing>[\s\S]*?<\/listing>/g) || []) {
    const price = parseFloat((block.match(/<price currency="USD" value="([\d.]+)"/) || [])[1] || "");
    if (!price) continue;
    const notes = decodeEntities((block.match(/<notes value="([^"]*)"/) || [])[1] || "")
      .replace(/\[\/?[a-z=0-9#]+\]/gi, " ");
    const link = (block.match(/<link\s+href="([^"]+)"/) || [])[1] || "";
    const condition = (block.match(/<condition value="([^"]*)"/) || [])[1] || "";
    all.push({ price, link, condition, junk: JUNK_LISTING_NOTES.test(notes) });
  }
  if (all.length === 0) return [];
  const median = all.map((l) => l.price).sort((a, b) => a - b)[Math.floor(all.length / 2)];
  const floor = Math.max(median * 0.6, 8);
  return all.filter((l) => !l.junk && l.price >= floor).sort((a, b) => a.price - b.price);
}

/* ===================== eBay data (sold baseline + live) ===================== */

const EBAY_SOLD_KEY = "ebay-sold";
const EBAY_SOLD_TTL_MS = 72 * 3600 * 1000; // the sold feed is historical; refresh sparingly
const BROWSER_UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36";

/** Does this listing title plausibly refer to the game itself (not an
 *  accessory/expansion/parts listing for it)? */
function relevantTitle(title, name) {
  const words = name.toLowerCase().split(/[^a-z0-9]+/).filter((w) => w.length > 2);
  const junk = /\b(expansion|promo|sleeve|sleeves|insert|organizer|upgrade kit|replacement|parts|pieces only|no game|empty box|proxy)\b/i;
  const t = title.toLowerCase();
  const hits = words.filter((w) => t.includes(w)).length;
  if (words.length && hits < Math.ceil(words.length * 0.6)) return false;
  if (!junk.test(name) && junk.test(title)) return false;
  return true;
}

/** Real eBay sold-sale history via 130point.com's lookup service. Their eBay
 *  feed is historical (currently ends ~Mar 2026), so this is a BASELINE of
 *  what copies actually sold for — not live market data. KV-cached. */
async function fetchEbaySold(env, id, name, cacheOnly) {
  let cache = {};
  try { cache = JSON.parse((await env.HOT_HISTORY.get(EBAY_SOLD_KEY)) || "{}"); } catch { /* rebuild */ }
  const hit = cache[id];
  if (hit && (cacheOnly || Date.now() - hit.fetchedAt < EBAY_SOLD_TTL_MS)) return hit;
  if (cacheOnly) return null;
  // Prefer eBay's official 90-day sold history once the Insights scope is
  // approved — it's fresh, unlike the frozen 130point feed.
  const official = await fetchEbaySoldOfficial(env, name);
  if (official) {
    cache[id] = official;
    await env.HOT_HISTORY.put(EBAY_SOLD_KEY, JSON.stringify(cache));
    return official;
  }
  try {
    const res = await fetch("https://back.130point.com/sales/", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded", "User-Agent": BROWSER_UA },
      body: `query=${encodeURIComponent(`${name} board game`)}&type=2&subcat=-1`
    });
    if (!res.ok) return hit || null;
    const html = await res.text();
    const sales = [];
    for (const seg of html.split(/<span id=['"]titleText['"]>/).slice(1)) {
      const title = decodeEntities((seg.match(/^<a href=['"][^'"]+['"][^>]*>([^<]+)<\/a>/) || [])[1] || "");
      const priceM = seg.match(/class=['"]priceSpan['"][^>]*>\s*([\d,.]+)\s*([A-Z]{3})/);
      const dateM = seg.match(/Date:<\/b>\s*([^<]+)/);
      const type = (seg.match(/id=['"]auctionLabel['"]>([^<]+)/) || [])[1] || "";
      if (!title || !priceM || priceM[2] !== "USD" || !dateM) continue;
      if (!relevantTitle(title, name)) continue;
      const price = parseFloat(priceM[1].replace(/,/g, ""));
      const date = new Date(dateM[1].trim());
      if (!price || isNaN(date)) continue;
      sales.push({ price, date: date.toISOString().slice(0, 10), type: type.trim() });
    }
    if (!sales.length) return hit || null;
    sales.sort((a, b) => b.date.localeCompare(a.date));
    const prices = sales.map((s) => s.price).sort((a, b) => a - b);
    const entry = {
      fetchedAt: Date.now(),
      source: "130point-historical",
      soldCount: sales.length,
      medianSold: prices[Math.floor(prices.length / 2)],
      low: prices[0],
      high: prices[prices.length - 1],
      dataThrough: sales[0].date,
      dataFrom: sales[sales.length - 1].date,
      recentSales: sales.slice(0, 8)
    };
    cache[id] = entry;
    await env.HOT_HISTORY.put(EBAY_SOLD_KEY, JSON.stringify(cache));
    return entry;
  } catch { return hit || null; }
}

/** Client-credentials OAuth token for eBay's APIs, cached in KV per scope. */
async function ebayToken(env, scope) {
  if (!env.EBAY_CLIENT_ID || !env.EBAY_CLIENT_SECRET) return null;
  const kvKey = `ebay-oauth:${scope}`;
  let tok = null;
  try { tok = JSON.parse((await env.HOT_HISTORY.get(kvKey)) || "null"); } catch { /* refetch */ }
  if (tok && Date.now() < tok.exp) return tok.token;
  const res = await fetch("https://api.ebay.com/identity/v1/oauth2/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${btoa(`${env.EBAY_CLIENT_ID}:${env.EBAY_CLIENT_SECRET}`)}`
    },
    body: "grant_type=client_credentials&scope=" + encodeURIComponent(scope)
  });
  if (!res.ok) return null;
  const d = await res.json();
  await env.HOT_HISTORY.put(kvKey, JSON.stringify({ token: d.access_token, exp: Date.now() + (d.expires_in - 300) * 1000 }));
  return d.access_token;
}

/** Live eBay asking prices via the official Browse API. Needs the
 *  EBAY_CLIENT_ID / EBAY_CLIENT_SECRET secrets (free developer account);
 *  silently unavailable until they're set. */
async function fetchEbayLive(env, name) {
  try {
    const token = await ebayToken(env, "https://api.ebay.com/oauth/api_scope");
    if (!token) return null;
    const url = `https://api.ebay.com/buy/browse/v1/item_summary/search?q=${encodeURIComponent(`${name} board game`)}` +
      `&filter=${encodeURIComponent("buyingOptions:{FIXED_PRICE},itemLocationCountry:US,priceCurrency:USD")}&sort=price&limit=25`;
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${token}`, "X-EBAY-C-MARKETPLACE-ID": "EBAY_US" }
    });
    if (!res.ok) return null;
    const d = await res.json();
    const items = (d.itemSummaries || [])
      .filter((it) => it.price && +it.price.value && relevantTitle(it.title || "", name))
      .map((it) => ({ price: +it.price.value, condition: it.condition || "", url: it.itemWebUrl || "" }));
    if (!items.length) return null;
    const prices = items.map((i) => i.price);
    return {
      liveListings: items.length,
      cheapest: items[0],
      cheapestFew: items.slice(0, 3),
      avgAsk: Math.round(prices.reduce((a, b) => a + b, 0) / prices.length)
    };
  } catch { return null; }
}

/** OFFICIAL eBay 90-day sold history via the Marketplace Insights API.
 *  Limited-release: needs the same keyset PLUS eBay's approval of the
 *  buy.marketplace.insights scope. Set the EBAY_INSIGHTS var/secret to "1"
 *  once approved; until then this stays dormant and the 130point baseline
 *  carries the sold picture. */
async function fetchEbaySoldOfficial(env, name) {
  if (String(env.EBAY_INSIGHTS || "") !== "1") return null;
  try {
    const token = await ebayToken(env, "https://api.ebay.com/oauth/api_scope/buy.marketplace.insights");
    if (!token) return null;
    const url = `https://api.ebay.com/buy/marketplace_insights/v1_beta/item_sales/search?q=${encodeURIComponent(`${name} board game`)}` +
      `&filter=${encodeURIComponent("priceCurrency:USD,itemLocationCountry:US")}&limit=100`;
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${token}`, "X-EBAY-C-MARKETPLACE-ID": "EBAY_US" }
    });
    if (!res.ok) return null;
    const d = await res.json();
    const sales = (d.itemSales || [])
      .filter((it) => it.lastSoldPrice && +it.lastSoldPrice.value && relevantTitle(it.title || "", name))
      .map((it) => ({
        price: +it.lastSoldPrice.value,
        date: String(it.lastSoldDate || "").slice(0, 10),
        type: "sold"
      }))
      .filter((s) => s.price && s.date);
    if (!sales.length) return null;
    sales.sort((a, b) => b.date.localeCompare(a.date));
    const prices = sales.map((s) => s.price).sort((a, b) => a - b);
    return {
      fetchedAt: Date.now(),
      source: "ebay-official-90d",
      soldCount: sales.length,
      medianSold: prices[Math.floor(prices.length / 2)],
      low: prices[0],
      high: prices[prices.length - 1],
      dataThrough: sales[0].date,
      dataFrom: sales[sales.length - 1].date,
      recentSales: sales.slice(0, 8)
    };
  } catch { return null; }
}

/* ============ Watched-game intelligence (BGG-native + community) ============ */

const WORKER_SELF_URL = "https://dfwgv-bgg-proxy.joemsprague.workers.dev";
const LIVE_MARKET_KEY = "live-market-cache"; // freshest retail/eBay snapshot per game (staged 6-hourly)
const GAME_INTEL_KEY = "game-intel";         // forum chatter + videos per game (staged, rotating)
const INTEL_CURSOR_KEY = "intel-cursor";     // rotation pointer for the intel job
const MARKET_LISTINGS_KEY = "market-listings"; // listing ids seen per game (sold detection)
const BGG_SOLD_KEY = "bgg-sold";               // probable sales: listings that disappeared
const MARKET_STATS_KEY = "market-stats";       // daily BGG supply/demand/popularity stats
const KNOWN_LINKS_KEY = "known-links";         // known expansion links (announcement radar)
const FORUM_CACHE_KEY = "forum-cache";         // forumlist ids per game (weekly)
const REDDIT_SEEN_KEY = "reddit-seen";         // reddit post ids already alerted
const REDDIT_DEALS_KEY = "reddit-deals";       // recent matches, for the digest
const FORUM_KEYWORDS = /(reprint|print\s*run|out of print|\boop\b|restock|back in stock|in stock|sold out|discontinued|price|sale|deal|msrp|new edition|2nd edition|second edition|kickstarter|gamefound|preorder|pre-order)/i;

/** Median/count/recency summary of our probable-sale records. */
function probableSaleStats(arr) {
  if (!arr || !arr.length) return null;
  const ps = arr.map((x) => x.p).sort((a, b) => a - b);
  return {
    detectedSales: arr.length,
    median: ps[Math.floor(ps.length / 2)],
    newest: arr[0].date,
    recent: arr.slice(0, 3).map((x) => ({ price: x.p, condition: x.c, date: x.date }))
  };
}

/** Recent forum threads about a game that touch pricing/availability/print
 *  status. Forum ids are cached a week; thread lists are fetched live. */
async function fetchForumChatter(env, id) {
  try {
    let cache = {};
    try { cache = JSON.parse((await env.HOT_HISTORY.get(FORUM_CACHE_KEY)) || "{}"); } catch { /* rebuild */ }
    let entry = cache[id];
    if (!entry || Date.now() - entry.fetched > 7 * 864e5) {
      const res = await fetch(`https://boardgamegeek.com/xmlapi2/forumlist?id=${id}&type=thing`, {
        headers: { Authorization: `Bearer ${env.BGG_TOKEN}` }
      });
      if (!res.ok) return [];
      const xml = await res.text();
      const forums = [];
      for (const m of xml.matchAll(/<forum\s+id="(\d+)"[^>]*title="([^"]*)"/g)) {
        if (/news|general|crowdfunding/i.test(m[2])) forums.push({ fid: m[1], title: m[2] });
      }
      entry = { fetched: Date.now(), forums: forums.slice(0, 3) };
      cache[id] = entry;
      await env.HOT_HISTORY.put(FORUM_CACHE_KEY, JSON.stringify(cache));
    }
    const cutoff = Date.now() - 14 * 864e5;
    const chatter = [];
    const activity = { activeThreads14d: 0, newThreads14d: 0 };
    for (const f of entry.forums) {
      const res = await fetch(`https://boardgamegeek.com/xmlapi2/forum?id=${f.fid}`, {
        headers: { Authorization: `Bearer ${env.BGG_TOKEN}` }
      });
      if (!res.ok) continue;
      const xml = await res.text();
      for (const t of xml.matchAll(/<thread\s+id="(\d+)"\s+subject="([^"]*)"[^>]*?postdate="([^"]*)"[^>]*lastpostdate="([^"]*)"/g)) {
        const subject = decodeEntities(t[2]);
        const posted = new Date(t[3]);
        const last = new Date(t[4]);
        if (isNaN(last) || last.getTime() < cutoff) continue;
        activity.activeThreads14d++;
        if (!isNaN(posted) && posted.getTime() >= cutoff) activity.newThreads14d++;
        if (!FORUM_KEYWORDS.test(subject)) continue;
        chatter.push({ title: subject, forum: f.title, lastPost: last.toISOString().slice(0, 10), url: `https://boardgamegeek.com/thread/${t[1]}` });
      }
      await new Promise((r) => setTimeout(r, 400));
    }
    return { list: chatter.sort((a, b) => b.lastPost.localeCompare(a.lastPost)).slice(0, 5), activity };
  } catch { return { list: [], activity: null }; }
}

/* -------- buzz signals (all keyless; gathered by the intel rotation) -------- */

const BUZZ_WINDOW_MS = 14 * 864e5;

/** Posts in r/boardgames naming the game, last 14 days (public search RSS). */
async function fetchRedditMentions(name) {
  try {
    const res = await fetch(`https://www.reddit.com/r/boardgames/search.rss?q=${encodeURIComponent(`"${name}"`)}&restrict_sr=on&sort=new&limit=25`, {
      headers: { "User-Agent": "dfwgv-librarian/1.0 (board game library buzz tracker)" }
    });
    if (!res.ok) return null;
    const xml = await res.text();
    let count = 0;
    for (const entry of xml.split(/<entry>/).slice(1)) {
      const updated = new Date((entry.match(/<updated>([^<]+)/) || [])[1] || "");
      if (!isNaN(updated) && Date.now() - updated.getTime() < BUZZ_WINDOW_MS) count++;
    }
    return count;
  } catch { return null; }
}

/** Bluesky posts mentioning the game, last 14 days (public search API —
 *  api.bsky.app; the public.api.bsky.app host 403s). */
async function fetchBlueskyMentions(name) {
  try {
    const res = await fetch(`https://api.bsky.app/xrpc/app.bsky.feed.searchPosts?q=${encodeURIComponent(`${name} board game`)}&limit=25`, {
      headers: { "User-Agent": BROWSER_UA }
    });
    if (!res.ok) return null;
    const d = await res.json();
    let count = 0;
    for (const p of d.posts || []) {
      const t = new Date(p.indexedAt || (p.record && p.record.createdAt) || "");
      if (!isNaN(t) && Date.now() - t.getTime() < BUZZ_WINDOW_MS) count++;
    }
    return count;
  } catch { return null; }
}

/** Mainstream press coverage via Google News RSS: 14-day count + latest. */
async function fetchNewsBuzz(name) {
  try {
    const res = await fetch(`https://news.google.com/rss/search?q=${encodeURIComponent(`"${name}" board game`)}&hl=en-US&gl=US&ceid=US:en`, {
      headers: { "User-Agent": BROWSER_UA }
    });
    if (!res.ok) return null;
    const items = [];
    for (const item of (await res.text()).split(/<item>/).slice(1)) {
      const title = decodeEntities(((item.match(/<title>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/title>/) || [])[1] || "").trim());
      const link = ((item.match(/<link>([^<]+)<\/link>/) || [])[1] || "").trim();
      const pub = new Date((item.match(/<pubDate>([^<]+)/) || [])[1] || "");
      if (!title || isNaN(pub)) continue;
      if (Date.now() - pub.getTime() < BUZZ_WINDOW_MS) items.push({ title, link, date: pub });
    }
    if (!items.length) return { count14d: 0 };
    items.sort((a, b) => b.date - a.date);
    return {
      count14d: items.length,
      latest: { title: items[0].title.slice(0, 120), url: items[0].link, date: items[0].date.toISOString().slice(0, 10) }
    };
  } catch { return null; }
}

/** General-public interest via Wikipedia pageviews: article resolved once
 *  (cached on the intel entry), then recent-7-day daily average vs the
 *  prior three weeks (1.0 = flat). */
async function fetchWikiInterest(name, cachedArticle) {
  try {
    let article = cachedArticle;
    if (article === undefined) {
      const res = await fetch(`https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(`${name} board game`)}&format=json&srlimit=3`, {
        headers: { "User-Agent": BROWSER_UA }
      });
      if (!res.ok) return null;
      const d = await res.json();
      const norm = (s) => String(s).toLowerCase().replace(/\s*\([^)]*\)\s*$/, "").replace(/[^a-z0-9]+/g, " ").trim();
      const hit = (((d.query || {}).search) || []).find((s) => norm(s.title) === norm(name));
      article = hit ? hit.title : null;
    }
    if (!article) return { article: null };
    const fmt = (d) => d.toISOString().slice(0, 10).replace(/-/g, "") + "00";
    const end = new Date(Date.now() - 864e5);
    const start = new Date(Date.now() - 29 * 864e5);
    const res2 = await fetch(`https://wikimedia.org/api/rest_v1/metrics/pageviews/per-article/en.wikipedia/all-access/user/${encodeURIComponent(article.replace(/ /g, "_"))}/daily/${fmt(start)}/${fmt(end)}`, {
      headers: { "User-Agent": BROWSER_UA }
    });
    if (!res2.ok) return { article };
    const views = (((await res2.json()).items) || []).map((i) => i.views);
    if (views.length < 10) return { article };
    const avg = (a) => a.reduce((x, y) => x + y, 0) / a.length;
    const recent = avg(views.slice(-7));
    const prior = avg(views.slice(0, -7));
    return {
      article,
      dailyViews7d: Math.round(recent),
      vsPrior3wks: Math.round((recent / Math.max(prior, 1)) * 100) / 100
    };
  } catch { return null; }
}

/** Recent big-channel YouTube coverage of a game (needs YOUTUBE_API_KEY). */
async function fetchRecentVideos(env, name) {
  if (!env.YOUTUBE_API_KEY) return null;
  try {
    const after = new Date(Date.now() - 7 * 864e5).toISOString();
    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&order=date&maxResults=5` +
      `&publishedAfter=${encodeURIComponent(after)}&q=${encodeURIComponent(`${name} board game`)}&key=${env.YOUTUBE_API_KEY}`;
    const res = await fetch(url);
    if (!res.ok) return null;
    const d = await res.json();
    const vids = (d.items || [])
      .filter((v) => v.id && v.id.videoId && relevantTitle(decodeEntities(v.snippet.title), name))
      .map((v) => ({
        id: v.id.videoId,
        title: decodeEntities(v.snippet.title),
        channel: v.snippet.channelTitle,
        published: String(v.snippet.publishedAt).slice(0, 10),
        url: `https://www.youtube.com/watch?v=${v.id.videoId}`
      }))
      .slice(0, 3);
    if (!vids.length) return null;
    try { // view counts turn "a video exists" into "it has 80k views" (1 quota unit)
      const r2 = await fetch(`https://www.googleapis.com/youtube/v3/videos?part=statistics&id=${vids.map((v) => v.id).join(",")}&key=${env.YOUTUBE_API_KEY}`);
      if (r2.ok) {
        const stats = {};
        for (const it of ((await r2.json()).items) || []) stats[it.id] = +((it.statistics || {}).viewCount || 0);
        for (const v of vids) if (stats[v.id]) v.views = stats[v.id];
      }
    } catch { /* views are optional */ }
    for (const v of vids) delete v.id;
    return vids;
  } catch { return null; }
}

/** Scans r/boardgamedeals and r/BoardGameExchange for fresh posts naming a
 *  watched game, via Reddit's public RSS feeds — no API key needed (the
 *  .json endpoints are 403-blocked, but .rss answers even from Cloudflare's
 *  datacenter IPs). Alerts Discord for new matches and stores them for the
 *  digest. */
async function checkRedditDeals(env) {
  const watchlist = JSON.parse((await env.HOT_HISTORY.get(WATCHLIST_KEY)) || "[]");
  if (!watchlist.length) return { ok: true, matches: 0 };
  try {
    const seen = new Set(JSON.parse((await env.HOT_HISTORY.get(REDDIT_SEEN_KEY)) || "[]"));
    const wl = watchlist.map((g) => ({
      ...g,
      words: g.name.toLowerCase().split(/[^a-z0-9]+/).filter((w) => w.length > 2)
    }));
    const matches = [];
    for (const sub of ["boardgamedeals", "BoardGameExchange"]) {
      const res = await fetch(`https://www.reddit.com/r/${sub}/new.rss?limit=50`, {
        headers: { "User-Agent": "dfwgv-librarian/1.0 (board game library price watcher)" }
      });
      if (!res.ok) continue;
      const xml = await res.text();
      for (const entry of xml.split(/<entry>/).slice(1)) {
        const pid = (entry.match(/<id>([^<]+)<\/id>/) || [])[1] || "";
        if (!pid || seen.has(pid)) continue;
        const title = decodeEntities((entry.match(/<title>([^<]*)<\/title>/) || [])[1] || "");
        const link = decodeEntities((entry.match(/<link[^>]*href="([^"]+)"/) || [])[1] || "");
        const updated = ((entry.match(/<updated>([^<]+)/) || [])[1] || "").slice(0, 10);
        const t = title.toLowerCase();
        const hit = wl.find((g) => g.words.length && g.words.every((w) => t.includes(w)));
        if (!hit) continue;
        matches.push({ game: hit.name, gameId: hit.id, title, sub, url: link, date: updated });
        seen.add(pid);
      }
      await new Promise((r) => setTimeout(r, 400));
    }
    await env.HOT_HISTORY.put(REDDIT_SEEN_KEY, JSON.stringify([...seen].slice(-500)));

    if (matches.length) {
      const prev = JSON.parse((await env.HOT_HISTORY.get(REDDIT_DEALS_KEY)) || "[]");
      await env.HOT_HISTORY.put(REDDIT_DEALS_KEY, JSON.stringify(matches.concat(prev).slice(0, 20)));
      if (env.ALERT_WEBHOOK) {
        await fetch(env.ALERT_WEBHOOK.trim(), {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            embeds: [{
              title: "🔥 Community deal spotted",
              description: matches.slice(0, 10).map((m) =>
                `**[${m.game}](https://boardgamegeek.com/boardgame/${m.gameId})** — [${m.title.slice(0, 120)}](${m.url}) · r/${m.sub}`
              ).join("\n\n").slice(0, 3900),
              color: 0x9B59B6,
              footer: { text: "DFWGV Librarian · r/boardgamedeals + r/BoardGameExchange" },
              timestamp: new Date().toISOString()
            }]
          })
        });
      }
    }
    return { ok: true, matches: matches.length };
  } catch (err) {
    return { ok: false, reason: String(err.message).slice(0, 120) };
  }
}

/**
 * Rotating intel gatherer (token-gated; the cron calls it on the worker's own
 * URL so it runs as a SEPARATE invocation with its own subrequest budget —
 * the free plan allows 50 per invocation). Each run refreshes forum chatter,
 * YouTube coverage, and the eBay sold baseline for the next few watched
 * games, then sweeps Reddit. The digest assembles from this staged data.
 */
async function gatherIntelSlice(env, includeReddit) {
  const watchlist = JSON.parse((await env.HOT_HISTORY.get(WATCHLIST_KEY)) || "[]").slice(0, WATCHLIST_CAP);
  if (watchlist.length) {
    let cursor = 0;
    try { cursor = Number(JSON.parse((await env.HOT_HISTORY.get(INTEL_CURSOR_KEY)) || "0")) || 0; } catch { /* restart */ }
    let intel = {};
    try { intel = JSON.parse((await env.HOT_HISTORY.get(GAME_INTEL_KEY)) || "{}"); } catch { /* rebuild */ }
    const SLICE = 3; // smaller slices: buzz gathering costs ~11 subrequests/game
    for (let i = 0; i < Math.min(SLICE, watchlist.length); i++) {
      const g = watchlist[(cursor + i) % watchlist.length];
      const forum = await fetchForumChatter(env, g.id);
      // YouTube searches are the quota-expensive part (100 units each of a
      // 10k/day budget) — refresh a game's videos at most every ~40 hours.
      const prev = intel[g.id] || {};
      let videos = prev.videos || null;
      let videosAt = prev.videosAt || 0;
      if (Date.now() - videosAt > 40 * 3600e3) {
        videos = await fetchRecentVideos(env, g.name);
        videosAt = Date.now();
      }
      await fetchEbaySold(env, g.id, g.name); // refresh the sold baseline within its TTL
      // Community buzz signals (all keyless).
      const prevWiki = prev.buzz && prev.buzz.wiki ? prev.buzz.wiki.article : undefined;
      const buzz = {
        redditMentions14d: await fetchRedditMentions(g.name),
        bluesky14d: await fetchBlueskyMentions(g.name),
        news: await fetchNewsBuzz(g.name),
        wiki: await fetchWikiInterest(g.name, prevWiki),
        fetchedAt: Date.now()
      };
      intel[g.id] = {
        name: g.name, chatter: forum.list, forumActivity: forum.activity,
        videos, videosAt, buzz, fetchedAt: Date.now()
      };
      await new Promise((r) => setTimeout(r, 400));
    }
    const ids = new Set(watchlist.map((g) => g.id));
    for (const id of Object.keys(intel)) if (!ids.has(id)) delete intel[id];
    await env.HOT_HISTORY.put(GAME_INTEL_KEY, JSON.stringify(intel));
    await env.HOT_HISTORY.put(INTEL_CURSOR_KEY, JSON.stringify((cursor + SLICE) % watchlist.length));
  }
  if (includeReddit) await checkRedditDeals(env);
  return watchlist.length > 3; // more games than one slice covers?
}

/* ---------------- BGG community auctions (geeklist-based) ---------------- */

const AUCTION_LISTS_KEY = "auction-lists"; // auction geeklists we're tracking
const AUCTION_WATCH_KEY = "auction-watch"; // watched games found inside them

/**
 * Sweeps BGG's community auctions: discovers auction geeklists from the
 * recent-geeklists JSON feed (title keyword match — the category param is
 * ignored by that API), then checks a rotating handful for items matching
 * watched games. Bids live in item comments; the current high bid is the
 * largest plausible dollar figure. New finds alert Discord; a list that
 * closes (title says so, or it goes quiet for 4+ days) records its final
 * high bid as a real community sale in the bgg-sold history.
 */
async function runAuctionSweep(env) {
  const watchlist = JSON.parse((await env.HOT_HISTORY.get(WATCHLIST_KEY)) || "[]").slice(0, WATCHLIST_CAP);
  if (!watchlist.length) return { ok: true, matches: 0 };
  const wlIds = new Set(watchlist.map((g) => String(g.id)));

  let tracked = {};
  try { tracked = JSON.parse((await env.HOT_HISTORY.get(AUCTION_LISTS_KEY)) || "{}"); } catch { /* rebuild */ }

  // 1. Discovery: two pages of recent geeklists, auction-titled only.
  for (const page of [1, 2]) {
    try {
      const res = await fetch(`https://boardgamegeek.com/api/geeklists?page=${page}`, {
        headers: { Authorization: `Bearer ${env.BGG_TOKEN}`, Accept: "application/json" }
      });
      if (!res.ok) continue;
      const d = await res.json();
      for (const l of d.lists || []) {
        const title = String(l.title || l.name || "");
        if (!/auction/i.test(title)) continue;
        const prev = tracked[l.id] || {};
        tracked[l.id] = {
          ...prev,
          title: title.slice(0, 140),
          lastSeen: Date.now(),
          closed: /closed|ended/i.test(title) || prev.closed || false
        };
      }
    } catch { /* discovery is best-effort */ }
  }
  for (const [id, t] of Object.entries(tracked)) {
    if (Date.now() - (t.lastSeen || 0) > 30 * 864e5) delete tracked[id];
  }

  // 2. Check the least-recently-checked open lists (a few per sweep).
  let auctionWatch = {};
  try { auctionWatch = JSON.parse((await env.HOT_HISTORY.get(AUCTION_WATCH_KEY)) || "{}"); } catch { /* rebuild */ }
  let bggSold = {};
  try { bggSold = JSON.parse((await env.HOT_HISTORY.get(BGG_SOLD_KEY)) || "{}"); } catch { /* rebuild */ }
  const newFinds = [];
  const listIds = Object.keys(tracked).filter((id) => !tracked[id].done)
    .sort((a, b) => (tracked[a].lastChecked || 0) - (tracked[b].lastChecked || 0))
    .slice(0, 6);

  for (const id of listIds) {
    const t = tracked[id];
    try {
      const res = await fetch(`https://boardgamegeek.com/xmlapi/geeklist/${id}?comments=1`, {
        headers: { Authorization: `Bearer ${env.BGG_TOKEN}` }
      });
      t.lastChecked = Date.now();
      if (res.status === 202) continue; // queued at BGG; next sweep collects it
      if (!res.ok) continue;
      const xml = await res.text();
      const editTs = +((xml.match(/<editdate_timestamp>(\d+)/) || [])[1] || 0);
      const isFinal = t.closed || (editTs && Date.now() / 1000 - editTs > 4 * 86400);

      for (const item of xml.split(/<item\s/).slice(1)) {
        const objectid = (item.match(/objectid="(\d+)"/) || [])[1];
        if (!objectid || !wlIds.has(objectid)) continue;
        const itemId = (item.match(/^[^>]*\bid="(\d+)"/) || [])[1] || "";
        const name = decodeEntities((item.match(/objectname="([^"]*)"/) || [])[1] || "");
        const body = decodeEntities((item.match(/<body>([\s\S]*?)<\/body>/) || [])[1] || "");
        const comments = [...item.matchAll(/<comment[^>]*>([\s\S]*?)<\/comment>/g)].map((m) => decodeEntities(m[1]));
        const bids = [];
        for (const c of comments) {
          for (const m of c.matchAll(/\$\s?(\d{1,4}(?:\.\d\d)?)\b|(?:^|\s)(\d{2,4})(?:\s|$)/g)) {
            const v = +(m[1] || m[2]);
            if (v >= 2 && v <= 1500) bids.push(v);
          }
        }
        const high = bids.length ? Math.max(...bids) : null;
        const bin = +((body.match(/\bbin\b[^\d$]{0,12}\$?\s?(\d{1,4})/i) || [])[1] || 0) || null;

        const key = `${id}:${objectid}`;
        const prev = auctionWatch[key];
        const rec = {
          listId: id, listTitle: t.title, gameId: objectid, name,
          currentHigh: high, bidCount: bids.length, bin,
          url: `https://boardgamegeek.com/geeklist/${id}${itemId ? `?itemid=${itemId}` : ""}`,
          firstSeen: prev ? prev.firstSeen : Date.now(),
          updated: Date.now(),
          recorded: prev ? prev.recorded : false
        };
        if (isFinal && high && !rec.recorded) {
          (bggSold[objectid] = bggSold[objectid] || []).unshift({ p: high, c: "auction final bid", date: new Date().toISOString().slice(0, 10) });
          bggSold[objectid] = bggSold[objectid].slice(0, 60);
          rec.recorded = true;
        }
        auctionWatch[key] = rec;
        if (!prev) newFinds.push(rec);
      }
      if (t.closed) t.done = true;
    } catch { /* this list retries next sweep */ }
    await new Promise((r) => setTimeout(r, 600));
  }
  for (const [key, rec] of Object.entries(auctionWatch)) {
    if (Date.now() - (rec.updated || 0) > 30 * 864e5) delete auctionWatch[key];
  }

  await env.HOT_HISTORY.put(AUCTION_LISTS_KEY, JSON.stringify(tracked));
  await env.HOT_HISTORY.put(AUCTION_WATCH_KEY, JSON.stringify(auctionWatch));
  await env.HOT_HISTORY.put(BGG_SOLD_KEY, JSON.stringify(bggSold));

  // 3. Alert on newly spotted watched games in auctions.
  if (newFinds.length && env.ALERT_WEBHOOK) {
    await fetch(env.ALERT_WEBHOOK.trim(), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        embeds: [{
          title: "🔨 Watched game up for auction on BGG",
          description: newFinds.slice(0, 10).map((f) =>
            `**[${f.name}](https://boardgamegeek.com/boardgame/${f.gameId})** — [${f.listTitle.slice(0, 80)}](${f.url})\n` +
            `${f.currentHigh ? `current high $${f.currentHigh} (${f.bidCount} bids)` : "no bids yet"}${f.bin ? ` · BIN $${f.bin}` : ""}`
          ).join("\n\n").slice(0, 3900),
          color: 0xE67E22,
          footer: { text: "DFWGV Librarian · BGG community auctions" },
          timestamp: new Date().toISOString()
        }]
      })
    });
  }
  return { ok: true, trackedLists: Object.keys(tracked).length, matches: newFinds.length };
}

async function handleCronAuctions(request, env, ctx, cors) {
  if (!isAuthorized(request, env)) {
    return jsonResponse({ ok: false, error: "Unauthorized" }, 401, cors);
  }
  ctx.waitUntil(runAuctionSweep(env).catch(() => { /* next sweep retries */ }));
  return jsonResponse({ ok: true }, 200, cors);
}

async function handleCronIntel(request, env, ctx, cors) {
  if (!isAuthorized(request, env)) {
    return jsonResponse({ ok: false, error: "Unauthorized" }, 401, cors);
  }
  const hops = Math.min(parseInt(new URL(request.url).searchParams.get("hops") || "0", 10) || 0, 12);
  // Respond immediately; do the slice (and chain the next hop) in the
  // background so the calling invocation never blocks on us.
  ctx.waitUntil((async () => {
    const more = await gatherIntelSlice(env, hops === 0);
    if (more && hops < 8) {
      await fetch(`${WORKER_SELF_URL}/api/cron-intel?hops=${hops + 1}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${env.ANALYTICS_ADMIN_TOKEN}` }
      }).catch(() => { /* next cron continues the rotation */ });
    }
  })());
  return jsonResponse({ ok: true, hops }, 200, cors);
}

const GITHUB_REPO = "traditz/dfwgamingvillage";
const SNAPSHOT_WORKFLOW = "refresh-library.yml";

/* ===================== AI features ===================== */

const SITE_BASE = "https://www.dfwgamingvillage.com";
const ANTHROPIC_MODEL = "claude-sonnet-5";
const DIGEST_CRON = "0 14 * * *"; // daily, 14:00 UTC ≈ 9am Central
const LAST_DIGEST_KEY = "last-digest";

/** Minimal Anthropic Messages API client. */
async function askClaude(env, system, user, maxTokens) {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": env.ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01",
      "content-type": "application/json"
    },
    body: JSON.stringify({
      model: ANTHROPIC_MODEL,
      max_tokens: maxTokens || 1024,
      // Sonnet 5 thinks by default and max_tokens caps thinking + text
      // together; a small budget then yields zero text blocks. Thinking off
      // keeps the whole budget for the reply.
      thinking: { type: "disabled" },
      system,
      messages: [{ role: "user", content: user }]
    })
  });
  if (!res.ok) throw new Error(`Anthropic ${res.status}: ${(await res.text()).slice(0, 200)}`);
  const data = await res.json();
  const text = (data.content || []).filter((b) => b.type === "text").map((b) => b.text).join("").trim();
  if (!text) {
    const types = (data.content || []).map((b) => b.type).join(",") || "none";
    throw new Error(`Anthropic returned no text (stop_reason=${data.stop_reason}, blocks=${types})`);
  }
  return text;
}

/**
 * Weekly AI digest: gathers the library's live signals (unowned high-rated
 * candidates, hotness streaks, watchlist price movement) and has Claude write
 * an opinionated procurement brief, posted to the Discord webhook.
 */
async function postWeeklyDigest(env) {
  if (!env.ALERT_WEBHOOK) return { ok: false, error: "ALERT_WEBHOOK secret not set" };
  if (!env.ANTHROPIC_API_KEY) return { ok: false, error: "ANTHROPIC_API_KEY secret not set" };

  // Owned set (id + normalized name, so other editions count as owned).
  const norm = (s) => String(s || "").toLowerCase().replace(/\s*\([^)]*\)\s*$/, "").replace(/[^a-z0-9]+/g, " ").trim();
  const snapshot = await (await fetch(`${SITE_BASE}/games-library.json`)).json();
  const ownedIds = new Set(snapshot.games.map((g) => String(g.id)));
  const ownedNames = new Set(snapshot.games.map((g) => norm(g.name)));
  const isOwned = (id, name) => ownedIds.has(String(id)) || ownedNames.has(norm(name));

  // Top unowned candidates from the Top-1000 pool.
  let topCandidates = [];
  try {
    const cand = await (await fetch(`${SITE_BASE}/candidates.json`)).json();
    topCandidates = cand.games
      .filter((c) => c.rating >= 7.3 && !isOwned(c.id, c.name))
      .slice(0, 25)
      .map((c) => ({ id: c.id, name: c.name, year: c.year, rank: c.rank, rating: c.rating, weight: c.weight, bestWith: c.bestWith, publisher: c.pubName }));
  } catch { /* pool optional */ }

  // Hotness streaks over the last 14 recorded days.
  const hotHistory = JSON.parse((await env.HOT_HISTORY.get(HOT_HISTORY_KEY)) || "{}");
  const hotDates = Object.keys(hotHistory).sort().slice(-14);
  const streaks = new Map(); // id -> {name, days}
  for (const d of hotDates) {
    for (const g of hotHistory[d] || []) {
      const cur = streaks.get(g.id) || { name: g.name, days: 0 };
      cur.days++;
      streaks.set(g.id, cur);
    }
  }
  const sustainedHot = [...streaks.entries()]
    .filter(([id, s]) => s.days >= Math.min(4, hotDates.length) && !isOwned(id, s.name))
    .sort((a, b) => b[1].days - a[1].days)
    .slice(0, 12)
    .map(([id, s]) => ({ id, name: s.name, daysOnHotness: s.days, of: hotDates.length }));

  // Watchlist: full live market scan (BGG Marketplace + US retail) layered
  // on top of our tracked history, per watched game.
  const watchlist = JSON.parse((await env.HOT_HISTORY.get(WATCHLIST_KEY)) || "[]").slice(0, WATCHLIST_CAP);
  const priceHistory = JSON.parse((await env.HOT_HISTORY.get(PRICE_HISTORY_KEY)) || "{}");

  // Batched BGG calls (20 ids each — BGG's limit) cover every watched game's
  // listings, box art, supply/demand stats, and expansion links.
  const liveMarket = {}; // id -> { thumb, used, demand, newExpansions }
  const todayKey = new Date().toISOString().slice(0, 10);
  const newAnnouncements = [];
  if (watchlist.length) {
    let marketStats = {};
    let knownLinks = {};
    try { marketStats = JSON.parse((await env.HOT_HISTORY.get(MARKET_STATS_KEY)) || "{}"); } catch { /* rebuild */ }
    try { knownLinks = JSON.parse((await env.HOT_HISTORY.get(KNOWN_LINKS_KEY)) || "{}"); } catch { /* rebuild */ }
    for (let chunkStart = 0; chunkStart < watchlist.length; chunkStart += 20) {
      try {
      const chunk = watchlist.slice(chunkStart, chunkStart + 20);
      const res = await fetch(`${BGG_THING_URL}?id=${chunk.map((g) => g.id).join(",")}&marketplace=1&stats=1&videos=1`, {
        headers: { Authorization: `Bearer ${env.BGG_TOKEN}` }
      });
      if (res.ok) {
        const xml = await res.text();
        for (const item of xml.split(/<item\s/).slice(1)) {
          const id = (item.match(/^[^>]*\bid="(\d+)"/) || [])[1];
          if (!id) continue;
          const clean = parseCleanUsdListings(item);
          const prices = clean.map((l) => l.price);
          const num = (re) => { const m = item.match(re); return m ? +m[1] : null; };

          // Daily supply/demand/popularity snapshot (kept 120 days).
          const stats = {
            ow: num(/<owned value="(\d+)"/), tr: num(/<trading value="(\d+)"/),
            wa: num(/<wanting value="(\d+)"/), wi: num(/<wishing value="(\d+)"/),
            ur: num(/<usersrated value="(\d+)"/)
          };
          const gs = marketStats[id] = marketStats[id] || {};
          gs[todayKey] = stats;
          const sDates = Object.keys(gs).sort();
          for (const d of sDates.slice(0, Math.max(0, sDates.length - 120))) delete gs[d];
          const at = (daysAgo) => {
            const target = new Date(Date.now() - daysAgo * 864e5).toISOString().slice(0, 10);
            const d = sDates.filter((x) => x <= target).pop();
            return d ? gs[d] : null;
          };
          const prev30 = at(30);
          const demand = stats.wa === null ? null : {
            wanting: stats.wa, wishing: stats.wi, forTrade: stats.tr, owners: stats.ow,
            wantPerTradeCopy: stats.tr ? Math.round((stats.wa / stats.tr) * 10) / 10 : null,
            owners30dChange: prev30 && prev30.ow !== null ? stats.ow - prev30.ow : null,
            ratings30dChange: prev30 && prev30.ur !== null ? stats.ur - prev30.ur : null
          };

          // Expansion/edition announcement radar: a link id we've never seen.
          const links = [...item.matchAll(/<link type="boardgame(?:expansion|implementation)"\s+id="(\d+)"\s+value="([^"]*)"/g)]
            .map((m) => ({ lid: m[1], name: decodeEntities(m[2]) }));
          const known = new Set(knownLinks[id] || []);
          if (knownLinks[id]) { // only diff after a baseline exists
            for (const l of links) {
              if (!known.has(l.lid)) newAnnouncements.push({ gameId: id, related: l.name });
            }
          }
          knownLinks[id] = links.map((l) => l.lid);

          // Community content velocity: videos posted to the game's BGG page
          // in the last 14 days.
          let videos14dOnBgg = 0;
          const vidCutoff = Date.now() - 14 * 864e5;
          for (const v of item.matchAll(/<video\s[^>]*postdate="([^"]+)"/g)) {
            const pd = new Date(v[1]);
            if (!isNaN(pd) && pd.getTime() >= vidCutoff) videos14dOnBgg++;
          }

          liveMarket[id] = {
            thumb: decodeEntities((item.match(/<thumbnail>([^<]+)<\/thumbnail>/) || [])[1] || ""),
            used: clean.length ? {
              listings: clean.length,
              low: prices[0],
              lowCondition: clean[0].condition,
              lowLink: clean[0].link,
              median: prices[Math.floor(prices.length / 2)]
            } : null,
            demand,
            videos14dOnBgg
          };
        }
      }
      } catch { /* this chunk stays sparse; history still carries the digest */ }
      await new Promise((r) => setTimeout(r, 400));
    }
    await env.HOT_HISTORY.put(MARKET_STATS_KEY, JSON.stringify(marketStats));
    await env.HOT_HISTORY.put(KNOWN_LINKS_KEY, JSON.stringify(knownLinks));
  }

  // Retail, eBay, forum chatter, and video coverage are STAGED in KV by the
  // 6-hourly price check and the rotating intel job — each of those runs in
  // its own invocation with its own subrequest budget (the free plan allows
  // 50 per invocation, which one all-live digest scan would blow through).
  // The digest just assembles the staged data.
  let stagedLive = {};
  try { stagedLive = JSON.parse((await env.HOT_HISTORY.get(LIVE_MARKET_KEY)) || "{}"); } catch { /* optional */ }
  let stagedIntel = {};
  try { stagedIntel = JSON.parse((await env.HOT_HISTORY.get(GAME_INTEL_KEY)) || "{}"); } catch { /* optional */ }
  let ebaySoldStage = {};
  try { ebaySoldStage = JSON.parse((await env.HOT_HISTORY.get(EBAY_SOLD_KEY)) || "{}"); } catch { /* optional */ }
  let auctionStage = {};
  try { auctionStage = JSON.parse((await env.HOT_HISTORY.get(AUCTION_WATCH_KEY)) || "{}"); } catch { /* optional */ }
  for (const g of watchlist) {
    const lm = liveMarket[g.id] = liveMarket[g.id] || {};
    const staged = stagedLive[g.id] || {};
    if (staged.retail) lm.retail = staged.retail;
    if (staged.ebayLive) lm.ebayLive = staged.ebayLive;
    if (ebaySoldStage[g.id]) lm.ebaySold = ebaySoldStage[g.id];
    const gi = stagedIntel[g.id] || {};
    if (gi.chatter && gi.chatter.length) lm.chatter = gi.chatter;
    if (gi.videos && gi.videos.length) lm.videos = gi.videos;
    if (gi.forumActivity) lm.forumActivity = gi.forumActivity;
    if (gi.buzz) lm.buzz = gi.buzz;
    const auctions = Object.values(auctionStage).filter((a) =>
      a.gameId === String(g.id) && !a.recorded && Date.now() - a.updated < 5 * 864e5);
    if (auctions.length) {
      lm.auctions = auctions.slice(0, 3).map((a) => ({
        listTitle: a.listTitle, currentHighBid: a.currentHigh, bidCount: a.bidCount, buyItNow: a.bin, url: a.url
      }));
    }
  }
  let bggSoldMap = {};
  try { bggSoldMap = JSON.parse((await env.HOT_HISTORY.get(BGG_SOLD_KEY)) || "{}"); } catch { /* optional */ }
  const redditDeals = JSON.parse((await env.HOT_HISTORY.get(REDDIT_DEALS_KEY)) || "[]").slice(0, 8);

  const watch = watchlist.map((g) => {
    const gh = priceHistory[g.id] || {};
    const dates = Object.keys(gh).filter((d) => /^\d{4}-/.test(d)).sort();
    const series = (key) => dates.map((d) => ({ date: d, price: gh[d][key] })).filter((p) => p.price);
    const hist = (key) => {
      const s = series(key);
      if (!s.length) return null;
      const prices = s.map((p) => p.price);
      const min = Math.min(...prices);
      const last14 = prices.slice(-14);
      const avg14 = last14.reduce((a, b) => a + b, 0) / last14.length;
      const latest = prices[prices.length - 1];
      return {
        historicLow: min,
        historicLowDate: s.find((p) => p.price === min).date,
        low14d: Math.min(...last14),
        avg14d: Math.round(avg14),
        latest,
        trend: latest < avg14 * 0.97 ? "falling" : latest > avg14 * 1.03 ? "rising" : "flat",
        daysTracked: s.length
      };
    };
    const live = liveMarket[g.id] || {};
    const eb = live.ebaySold;
    const offerCounts = dates.slice(-14).map((d) => gh[d].rc).filter((x) => x !== null && x !== undefined);
    return {
      id: g.id, name: g.name, target: g.target || null,
      liveSecondHand: live.used || null,
      liveRetailUS: live.retail || null,
      retailOfferCountLast14d: offerCounts.length ? offerCounts : null,
      demandAndSupply: live.demand || null,
      bggSalesWeDetected: probableSaleStats(bggSoldMap[g.id]),
      ebaySoldBaseline: eb ? {
        soldSales: eb.soldCount, medianSoldPrice: eb.medianSold, low: eb.low, high: eb.high,
        dataThrough: eb.dataThrough, recentSales: eb.recentSales.slice(0, 3)
      } : null,
      ebayLiveNow: live.ebayLive || null,
      trackedRetail: hist("r"),
      trackedSecondHand: hist("m"),
      trackedEbayAsks: hist("e"),
      forumChatter: live.chatter || null,
      recentVideos: live.videos || null,
      liveBggAuctions: live.auctions || null,
      ebaySoldPricesLink: `https://www.ebay.com/sch/i.html?_nkw=${encodeURIComponent(`${g.name} board game`)}&LH_Sold=1&LH_Complete=1&LH_PrefLoc=1`
    };
  });
  // Composite 0–100 Buzz Score per watched game: weighted attention across
  // social chatter, press, video coverage, and BGG-native momentum, with a
  // trend vs the last digest and the top contributing drivers.
  let buzzHistory = {};
  try { buzzHistory = JSON.parse((await env.HOT_HISTORY.get("buzz-scores")) || "{}"); } catch { /* rebuild */ }
  for (const w of watch) {
    const lm = liveMarket[w.id] || {};
    const b = lm.buzz || {};
    const parts = [];
    let s = 0;
    const add = (label, frac, weight) => {
      const v = Math.max(0, Math.min(1, frac || 0)) * weight;
      if (v > 0.5) parts.push({ label, v });
      s += v;
    };
    add("Reddit chatter", (b.redditMentions14d || 0) / 5, 15);
    add("Bluesky chatter", (b.bluesky14d || 0) / 10, 10);
    add("press coverage", ((b.news && b.news.count14d) || 0) / 3, 10);
    const vids = w.recentVideos || [];
    add("YouTube coverage", vids.length / 3, 8);
    add("YouTube views", Math.log10(1 + vids.reduce((a, v) => a + (v.views || 0), 0)) / 5, 7);
    const hotDays = (streaks.get(String(w.id)) || {}).days || 0;
    add("BGG Hotness", hotDays ? 0.5 + hotDays / 14 : 0, 15);
    const dm = w.demandAndSupply || {};
    add("new ratings", (dm.ratings30dChange || 0) / 300, 8);
    add("new owners", (dm.owners30dChange || 0) / 500, 7);
    add("forum activity", ((lm.forumActivity || {}).activeThreads14d || 0) / 6, 8);
    add("new BGG videos", (lm.videos14dOnBgg || 0) / 4, 5);
    add("Wikipedia interest", (b.wiki && b.wiki.vsPrior3wks) ? (b.wiki.vsPrior3wks - 1) : 0, 4);
    add("live auction", w.liveBggAuctions ? 1 : 0, 3);
    const score = Math.round(Math.min(100, s));
    const prev = buzzHistory[w.id];
    const trend = prev ? (score - prev.score >= 5 ? "rising" : score - prev.score <= -5 ? "falling" : "steady") : "new";
    w.communityBuzz = {
      score, trend,
      drivers: parts.sort((a, b2) => b2.v - a.v).slice(0, 2).map((p) => p.label),
      redditMentions14d: b.redditMentions14d ?? null,
      blueskyMentions14d: b.bluesky14d ?? null,
      pressItems14d: (b.news && b.news.count14d) ?? null,
      latestPress: (b.news && b.news.latest) || null,
      wikipediaDailyViews7d: (b.wiki && b.wiki.dailyViews7d) || null,
      wikipediaVsBaseline: (b.wiki && b.wiki.vsPrior3wks) || null,
      hotnessDaysOf14: hotDays || 0
    };
    buzzHistory[w.id] = { score, date: todayKey };
  }
  for (const id of Object.keys(buzzHistory)) {
    if (!watch.some((w) => String(w.id) === id)) delete buzzHistory[id];
  }
  await env.HOT_HISTORY.put("buzz-scores", JSON.stringify(buzzHistory));

  const recentAlerts = JSON.parse((await env.HOT_HISTORY.get(PRICE_ALERTS_KEY)) || "[]").slice(0, 6)
    .map((a) => ({ id: a.id, name: a.name, channel: a.channel, note: a.note, date: a.date }));

  // With a large watchlist, only games with real signals today get full
  // detail in the brief; the rest are summarized compactly.
  const announcedIds = new Set(newAnnouncements.map((a) => a.gameId));
  const twoDaysAgo = new Date(Date.now() - 2 * 864e5).toISOString().slice(0, 10);
  const scored = watch.map((w) => {
    let score = 0;
    const candidates = [
      w.liveSecondHand && w.liveSecondHand.low,
      w.liveRetailUS && w.liveRetailUS.lowItem,
      w.ebayLiveNow && w.ebayLiveNow.cheapest && w.ebayLiveNow.cheapest.price,
      w.trackedSecondHand && w.trackedSecondHand.latest,
      w.trackedRetail && w.trackedRetail.latest
    ].filter(Boolean);
    const bestNow = candidates.length ? Math.min(...candidates) : null;
    if (w.target && bestNow && bestNow <= w.target) score += 3;
    for (const t of [w.trackedRetail, w.trackedSecondHand, w.trackedEbayAsks]) {
      if (t && t.avg14d && Math.abs(t.latest - t.avg14d) / t.avg14d >= 0.08) score += 2;
    }
    if (w.forumChatter) score += 1.5;
    if (w.liveBggAuctions) score += 2.5;
    if (w.recentVideos) score += 1;
    score += ((w.communityBuzz && w.communityBuzz.score) || 0) / 25;
    if (w.communityBuzz && w.communityBuzz.trend === "rising") score += 1;
    if (announcedIds.has(w.id)) score += 1;
    if (w.bggSalesWeDetected && w.bggSalesWeDetected.newest >= twoDaysAgo) score += 1;
    return { w, score, bestNow };
  });
  scored.sort((a, b) => b.score - a.score);
  const spotlight = scored.slice(0, 15).map((s) => s.w);
  const quiet = scored.slice(15).map((s) => ({ id: s.w.id, name: s.w.name, bestPriceNow: s.bestNow, target: s.w.target }));

  // Box art for the embed: the most interesting watch game (deepest current
  // discount vs its 14-day average), else the first with art.
  let digestThumb = "";
  let bestRatio = 1;
  for (const w of watch) {
    const live = (w.liveSecondHand && w.liveSecondHand.low) || (w.liveRetailUS && w.liveRetailUS.lowItem);
    const avg = (w.trackedSecondHand && w.trackedSecondHand.avg14d) || (w.trackedRetail && w.trackedRetail.avg14d);
    const thumb = (liveMarket[w.id] || {}).thumb;
    if (!thumb) continue;
    const ratio = live && avg ? live / avg : 1;
    if (!digestThumb || ratio < bestRatio) { digestThumb = thumb; bestRatio = ratio; }
  }

  const data = {
    libraryGames: snapshot.games.length,
    topUnownedCandidates: topCandidates,
    sustainedHotnessUnowned: sustainedHot,
    watchlistSpotlight: spotlight,
    watchlistQuiet: quiet,
    recentPriceAlerts: recentAlerts,
    newExpansionOrEditionAnnouncements: newAnnouncements.slice(0, 10),
    communityDealsSpotted: redditDeals
  };

  const system = `You write the DAILY pricing-and-procurement digest for the curator of the DFW Gaming Village board-game lending library (~${snapshot.games.length} games), rendered in Discord as a series of embeds — one per spotlighted game. The data includes a LIVE market scan (BGG Marketplace second-hand listings with condition, plus US retail in-stock offers) layered on our tracked price history.

OUTPUT FORMAT — a machine parses your reply, follow it EXACTLY, no text outside the delimited sections:
===OVERVIEW===
2-4 short lines: the day at a glance — biggest movers and best opportunities first. If watchlistQuiet is non-empty, end with one line: "**Quiet:** N others steady" (name at most 3 with their current best price where interesting; never itemize the whole quiet list).
===GAME:<id>===
One section per game in watchlistSpotlight, using its id, in the order given. First line EXACTLY "VERDICT: buy" or "VERDICT: wait" or "VERDICT: watch". Then 2-4 punchy lines (max 380 characters total): today's best genuine second-hand price (with condition, linked to the listing) and best US retail (item + delivered) vs the target; 14-day average/low and historic low (with its date); trend direction; then the reasoning behind the verdict (e.g. "within $3 of its historic low and trending down — wait a week", or "at target and only 4 genuine copies listed — grab it"). Don't repeat the game's name — its embed shows it.
===EXTRA===
Two INDEPENDENT subsections — evaluate each on its own:
"🛒 Opportunities" — ALWAYS write this when topUnownedCandidates or sustainedHotnessUnowned has entries (they almost always do): the 3 strongest unowned pickups today, two lines each — the signal (rating/rank, hotness streak, or a recent price alert), and why it matters for a lending library. Omit only if BOTH lists are truly empty.
"📣 Signals" — only when newExpansionOrEditionAnnouncements or communityDealsSpotted has entries (announcements can crater old-edition prices — an opportunity; community deals link to Reddit posts worth acting on fast). Omitting Signals must NOT stop you writing Opportunities.
Leave EXTRA empty only in the rare case that both subsections have nothing.

Data guidance:
- ebaySoldBaseline is REAL eBay sold-sale history (what copies actually sold for — count, median, range, last sales). Check its source field: "ebay-official-90d" is fresh official data; "130point-historical" ends at dataThrough — still a useful value anchor, but note the through-date when it matters. ebayLiveNow, when present, is today's cheapest live eBay asking price (official API) and trackedEbayAsks is our own day-by-day history of that cheapest ask — treat those as the freshest eBay signal. When a verdict is still close, point at the game's eBay sold-prices link.
- bggSalesWeDetected are BGG Marketplace listings we watched disappear — probable real sales at those prices. Fresh, first-party evidence of what copies sell for; weigh it alongside the eBay baseline.
- demandAndSupply is BGG market pressure: wanting vs forTrade copies (wantPerTradeCopy — above ~5 is a seller's market where drops are unlikely; near or below 1 means soft demand), plus owners/ratings 30-day growth as popularity momentum. Use it to judge whether waiting is realistic.
- retailOfferCountLast14d is the count of in-stock US retail offers per day — a shrinking series with rising used prices = possibly going out of print: say so and recommend buying before the spike.
- forumChatter is recent BGG forum threads about pricing/availability/print status — cite anything decisive (reprint confirmed, sold out at publisher) with its thread link. recentVideos is fresh YouTube coverage — big-channel reviews foreshadow demand bumps.
- liveBggAuctions means the game is up for auction in the BGG community RIGHT NOW (current high bid, bid count, BIN price, link). Community auctions often close below market — compare the current high bid to the other prices and flag genuine opportunities prominently in the verdict.
- communityBuzz is a computed 0-100 attention score (Reddit + Bluesky chatter, press coverage with the latest headline, Wikipedia interest vs baseline, YouTube reach, BGG hotness/forum/video momentum), with trend and top drivers. The score line renders automatically under each game — do NOT restate the number; USE it in verdicts: rising buzz firms prices and argues for buying sooner, falling buzz supports waiting. Cite specific drivers (e.g. a linked press headline) when they change the calculus.
- This posts EVERY day: on quiet days the game sections shrink naturally (verdict + two lines) rather than padding, but always state the current best price so each embed stands on its own.
- Use ONLY the data provided; never invent prices, listings, streaks, or games. Round to whole dollars except sub-$1 differences.
- Discord markdown inside sections: [text](url) links — link listing prices to their listing, "all retail offers" to storeListUrl, "eBay sold prices" to ebaySoldPricesLink, game names in OVERVIEW/EXTRA as [Name](https://boardgamegeek.com/boardgame/ID). No greeting, no sign-off, no overall title.`;

  let content;
  try {
    content = await askClaude(env, system, JSON.stringify(data), 2800);
  } catch (err) {
    const error = String(err.message).slice(0, 300);
    await env.HOT_HISTORY.put(LAST_DIGEST_KEY, JSON.stringify({ date: new Date().toISOString(), posted: false, error }));
    return { ok: false, error };
  }
  // Parse the delimited sections into per-game embeds with box art.
  const parsed = { overview: "", games: [], extra: "" };
  {
    const marks = [];
    const re = /===\s*(OVERVIEW|GAME:(\d+)|EXTRA)\s*===/g;
    let m;
    while ((m = re.exec(content))) marks.push({ key: m[1], id: m[2], at: m.index, end: re.lastIndex });
    for (let i = 0; i < marks.length; i++) {
      const body = content.slice(marks[i].end, i + 1 < marks.length ? marks[i + 1].at : undefined).trim();
      if (marks[i].key === "OVERVIEW") parsed.overview = body;
      else if (marks[i].key === "EXTRA") parsed.extra = body;
      else if (marks[i].id) parsed.games.push({ id: marks[i].id, body });
    }
  }

  const VERDICT_COLORS = { buy: 0x2ECC71, wait: 0xE67E22, watch: 0xF5C542 };
  const stamp = new Date().toISOString();
  const footerText = `DFWGV Librarian · live scan of ${watch.length} watched games · BGG Marketplace + US retail + eBay sold`;
  const embeds = [];
  if (parsed.games.length) {
    embeds.push({
      title: "📚 Daily Library Digest",
      description: (parsed.overview || "Today's watchlist briefing:").slice(0, 3900),
      color: 0xF5C542,
      footer: { text: footerText },
      timestamp: stamp
    });
    for (const sec of parsed.games) {
      const w = watch.find((x) => String(x.id) === sec.id);
      const vm = sec.body.match(/^VERDICT:\s*(buy|wait|watch)\s*\n?/i);
      const verdict = vm ? vm[1].toLowerCase() : "watch";
      const body = (vm ? sec.body.slice(vm[0].length) : sec.body).trim();
      const tag = verdict === "buy" ? "🟢 BUY" : verdict === "wait" ? "🟠 WAIT" : "🟡 WATCH";
      // Data-driven buzz line — appended by code so it's always accurate.
      const cb = w && w.communityBuzz;
      const buzzLine = cb
        ? `\n\n📢 Buzz **${cb.score}/100** ${cb.trend === "rising" ? "↑" : cb.trend === "falling" ? "↓" : "→"}${cb.drivers.length ? ` — ${cb.drivers.join(", ")}` : ""}`
        : "";
      embeds.push({
        title: `${tag} — ${(w && w.name) || `Game ${sec.id}`}`,
        url: `https://boardgamegeek.com/boardgame/${sec.id}`,
        description: `${body}${buzzLine}`.slice(0, 1500),
        color: VERDICT_COLORS[verdict],
        thumbnail: (liveMarket[sec.id] && liveMarket[sec.id].thumb) ? { url: liveMarket[sec.id].thumb } : undefined
      });
    }
    if (parsed.extra) {
      embeds.push({ title: "🛒 Opportunities & 📣 Signals", description: parsed.extra.slice(0, 3900), color: 0xF5C542 });
    }
  } else {
    // Claude ignored the format — fall back to the classic single embed.
    embeds.push({
      title: "📚 Daily Library Digest",
      description: content.slice(0, 3900),
      color: 0xF5C542,
      thumbnail: digestThumb ? { url: digestThumb } : undefined,
      footer: { text: footerText },
      timestamp: stamp
    });
  }

  // Discord caps 10 embeds and ~6000 chars per webhook message — batch.
  let posted = true;
  let batch = [];
  let batchChars = 0;
  const flush = async () => {
    if (!batch.length) return;
    const res = await fetch(env.ALERT_WEBHOOK.trim(), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ embeds: batch })
    });
    posted = posted && res.ok;
    batch = [];
    batchChars = 0;
    await new Promise((r) => setTimeout(r, 400));
  };
  for (const e of embeds) {
    const size = (e.title || "").length + (e.description || "").length + ((e.footer && e.footer.text) || "").length;
    if (batch.length >= 10 || batchChars + size > 5200) await flush();
    batch.push(e);
    batchChars += size;
  }
  await flush();

  const record = parsed.games.length
    ? [parsed.overview, ...parsed.games.map((g) => g.body), parsed.extra].filter(Boolean).join("\n\n")
    : content;
  await env.HOT_HISTORY.put(LAST_DIGEST_KEY, JSON.stringify({
    date: stamp, posted, embeds: embeds.length, content: record.slice(0, 6000)
  }));
  return { ok: posted, error: posted ? "" : "Discord rejected one or more digest messages", preview: record.slice(0, 400) };
}

/** Token-gated manual digest trigger (POST) / last digest (GET). */
async function handleDigest(request, env, cors) {
  if (!isAuthorized(request, env)) {
    return jsonResponse({ ok: false, error: "Unauthorized" }, 401, cors);
  }
  if (request.method === "POST") {
    try {
      const result = await postWeeklyDigest(env);
      return jsonResponse(result, result.ok ? 200 : 400, cors);
    } catch (err) {
      return jsonResponse({ ok: false, error: String(err.message).slice(0, 300) }, 500, cors);
    }
  }
  const last = (await env.HOT_HISTORY.get(LAST_DIGEST_KEY)) || "null";
  return new Response(`{"ok":true,"last":${last}}`, {
    status: 200,
    headers: { ...cors, "Content-Type": "application/json; charset=utf-8" }
  });
}

/**
 * AI-drafted publisher donation-request letter (token-gated). The dashboard
 * sends the context it already holds — the game, its publisher, and which of
 * that publisher's titles the library owns with play counts — and Claude
 * writes a letter tailored to that publisher.
 */
async function handleDraftLetter(request, env, cors) {
  if (!isAuthorized(request, env)) {
    return jsonResponse({ ok: false, error: "Unauthorized" }, 401, cors);
  }
  if (request.method !== "POST") {
    return jsonResponse({ ok: false, error: "POST only" }, 405, cors);
  }
  if (!env.ANTHROPIC_API_KEY) {
    return jsonResponse({ ok: false, error: "ANTHROPIC_API_KEY secret not set" }, 400, cors);
  }

  let body;
  try { body = await request.json(); } catch { body = {}; }
  const gameName = clampString(body.game && body.game.name, 160);
  const publisher = clampString(body.publisher && body.publisher.name, 160);
  if (!gameName || !publisher) {
    return jsonResponse({ ok: false, error: "game.name and publisher.name are required" }, 400, cors);
  }

  const system = `You draft donation-request letters for DFW Gaming Village, a community tabletop group in the Dallas–Fort Worth area: weekly game nights with 20–40 attendees, built around a free lending library of ${Number(body.libraryCount) || 1200}+ games that members borrow and learn at events (site: dfwgamingvillage.com).

Write a letter to the publisher ${publisher} asking them to donate "${gameName}" for the lending library. The letter must be genuinely compelling regardless of how much data is provided — build it from the STRONGEST available angles, in this order:
1. If any of their titles have notable play counts, cite 1–2 concretely ("X has hit our tables N times").
2. If the library owns their titles but play data is thin or zero, lean on shelf presence instead ("N of your titles live in our library, including A and B — members reach for them constantly"). Never mention, imply, or apologize for missing play data.
3. If the library owns none of their titles, frame the ask as an introduction: this game would be how the community discovers their catalog, taught table by table.
Angles that are ALWAYS available and should carry weight: the requested game's own reputation when provided (BGG rating, rank, best player count — "consistently rated X", "shines at our N-player tables"); the library's scale; total community plays logged if provided ("our members have logged N plays and counting"); the unusual durability of a lending-library donation — one copy is taught to new players week after week for years, which is repeat product discovery no ad buy matches; supporter credit on the website and at events.
Rules:
- Never invent facts, titles, numbers, or play counts — use only what the data provides.
- 220–320 words. Warm, professional, specific; open with something about THEM or the game, never with boilerplate about us.
- Plain text. Placeholders [Your name] and [Your email] in the sign-off. No date line, no addresses.
- Honor the user's extra notes if given.`;

  try {
    const letter = await askClaude(env, system, JSON.stringify({
      game: body.game || { name: gameName },
      publisher: body.publisher,
      ownedByPublisher: (body.ownedByPublisher || []).slice(0, 10),
      totalCommunityPlaysLogged: Number(body.totalPlays) || undefined,
      notes: clampString(body.notes, 400)
    }), 700);
    return jsonResponse({ ok: true, letter }, 200, cors);
  } catch (err) {
    return jsonResponse({ ok: false, error: String(err.message).slice(0, 300) }, 502, cors);
  }
}

/**
 * Deep AI price analysis for one game (token-gated): live BGG Marketplace
 * listings, live US retail offers, our tracked price history + alerts, and
 * reference links, synthesized by Claude into a buy/wait brief.
 */
async function handlePriceAnalysis(request, env, cors) {
  if (!isAuthorized(request, env)) {
    return jsonResponse({ ok: false, error: "Unauthorized" }, 401, cors);
  }
  if (request.method !== "POST") {
    return jsonResponse({ ok: false, error: "POST only" }, 405, cors);
  }
  if (!env.ANTHROPIC_API_KEY) {
    return jsonResponse({ ok: false, error: "ANTHROPIC_API_KEY secret not set" }, 400, cors);
  }

  let body;
  try { body = await request.json(); } catch { body = {}; }
  const id = String(body.id || "");
  const name = clampString(body.name, 160) || "this game";
  if (!/^\d+$/.test(id)) {
    return jsonResponse({ ok: false, error: "Numeric id required" }, 400, cors);
  }

  // 1. Second-hand: full BGG Marketplace picture.
  const market = { totalListings: 0, nonUsd: 0, excludedNonGame: 0, listings: [] };
  try {
    const res = await fetch(`${BGG_THING_URL}?id=${id}&marketplace=1`, {
      headers: { Authorization: `Bearer ${env.BGG_TOKEN}` }
    });
    if (res.ok) {
      const xml = await res.text();
      const all = [];
      for (const block of xml.match(/<listing>[\s\S]*?<\/listing>/g) || []) {
        market.totalListings++;
        const price = parseFloat((block.match(/<price currency="USD" value="([\d.]+)"/) || [])[1] || "");
        if (!price) { market.nonUsd++; continue; }
        const notes = decodeEntities((block.match(/<notes value="([^"]*)"/) || [])[1] || "").replace(/\[\/?[a-z=0-9#]+\]/gi, " ");
        if (JUNK_LISTING_NOTES.test(notes)) { market.excludedNonGame++; continue; }
        all.push({
          price,
          condition: (block.match(/<condition value="([^"]*)"/) || [])[1] || "",
          listedOn: ((block.match(/<listdate value="([^"]*)"/) || [])[1] || "").slice(0, 16),
          link: (block.match(/<link\s+href="([^"]+)"/) || [])[1] || ""
        });
      }
      all.sort((a, b) => a.price - b.price);
      const prices = all.map((l) => l.price);
      market.usdGenuine = all.length;
      market.low = prices[0] || null;
      market.median = prices.length ? prices[Math.floor(prices.length / 2)] : null;
      market.high = prices[prices.length - 1] || null;
      market.listings = all.slice(0, 8);
    }
  } catch { /* section stays sparse */ }

  // 2. New retail: US in-stock offers via BoardGamePrices.
  const retail = { offers: [], itemUrl: "" };
  try {
    const res = await fetch(`https://boardgameprices.com/api/info?eid=${id}&currency=USD&destination=US&sitename=dfwgamingvillage.com`);
    if (res.ok) {
      const data = await res.json();
      const best = (data.items || [])
        .map((it) => ({
          url: it.url || "",
          offers: (it.prices || []).filter((p) => p.country === "US" && p.stock === "Y")
            .map((p) => ({ item: +p.product || +p.price, delivered: +p.price }))
        }))
        .sort((a, b) => b.offers.length - a.offers.length)[0];
      if (best) {
        retail.itemUrl = best.url;
        retail.offers = best.offers.sort((a, b) => a.delivered - b.delivered).slice(0, 8);
        retail.usInStock = best.offers.length;
      }
    }
  } catch { /* section stays sparse */ }

  // 3. Our tracked history (only exists for watched games).
  const priceHistory = JSON.parse((await env.HOT_HISTORY.get(PRICE_HISTORY_KEY)) || "{}");
  const watchlist = JSON.parse((await env.HOT_HISTORY.get(WATCHLIST_KEY)) || "[]");
  const gh = priceHistory[id] || null;
  let tracked = null;
  if (gh) {
    const dates = Object.keys(gh).filter((d) => /^\d{4}-/.test(d)).sort();
    const series = (key) => dates.map((d) => ({ date: d, price: gh[d][key] })).filter((p) => p.price);
    const summarize = (key) => {
      const s = series(key);
      if (!s.length) return null;
      const lows = s.map((p) => p.price);
      const min = Math.min(...lows);
      return {
        samples: s.length,
        firstTracked: s[0].date,
        historicLow: min,
        historicLowDate: s.find((p) => p.price === min).date,
        average: Math.round(lows.reduce((a, b) => a + b, 0) / lows.length),
        latest: s[s.length - 1].price
      };
    };
    tracked = { retail: summarize("r"), secondHand: summarize("m"), ebayLiveAsks: summarize("e") };
  }
  const watched = watchlist.find((g) => g.id === id);
  const alerts = JSON.parse((await env.HOT_HISTORY.get(PRICE_ALERTS_KEY)) || "[]").filter((a) => a.id === id).slice(0, 4);

  // 4. eBay: real sold-sale baseline + live asking prices (when configured).
  const ebaySold = await fetchEbaySold(env, id, name);
  const ebayLive = await fetchEbayLive(env, name);

  // 5. Our detected BGG sales, market pressure, and forum chatter.
  let bggSoldMap = {};
  try { bggSoldMap = JSON.parse((await env.HOT_HISTORY.get(BGG_SOLD_KEY)) || "{}"); } catch { /* optional */ }
  let demandNow = null;
  try {
    const ms = JSON.parse((await env.HOT_HISTORY.get(MARKET_STATS_KEY)) || "{}")[id];
    if (ms) {
      const latest = ms[Object.keys(ms).sort().pop()];
      demandNow = latest ? { wanting: latest.wa, wishing: latest.wi, forTradeCopies: latest.tr, owners: latest.ow } : null;
    }
  } catch { /* optional */ }
  const forum = await fetchForumChatter(env, id);
  const chatter = forum.list;

  // 6. Buzz: staged intel first (watched games), else live lookups.
  let giEntry = null;
  try { giEntry = JSON.parse((await env.HOT_HISTORY.get(GAME_INTEL_KEY)) || "{}")[id] || null; } catch { /* optional */ }
  let videos = (giEntry && giEntry.videos && giEntry.videos.length) ? giEntry.videos : null;
  if (!videos) videos = await fetchRecentVideos(env, name);
  const buzzRaw = (giEntry && giEntry.buzz) || null;

  const q = encodeURIComponent(`${name} board game`);
  const data = {
    game: name,
    secondHandMarket: market,
    newRetailUS: retail,
    ebaySoldHistory: ebaySold || "unavailable",
    ebayLiveNow: ebayLive || "not configured",
    bggSalesWeDetected: probableSaleStats(bggSoldMap[id]) || "none detected yet",
    bggDemandAndSupply: demandNow || "no snapshot yet (builds daily for watched games)",
    forumChatter: chatter.length ? chatter : "no recent pricing/availability threads",
    forumActivity: forum.activity || undefined,
    recentYouTubeCoverage: videos || "none found in the last 7 days (or YouTube key not set)",
    communityBuzz: buzzRaw || "not yet gathered (builds via the intel rotation for watched games)",
    trackedHistory: tracked || "not on the watchlist — no tracked history yet",
    watchTarget: watched ? watched.target || null : null,
    recentAlerts: alerts,
    referenceLinks: {
      bggMarketplace: `https://boardgamegeek.com/boardgame/${id}/marketplace`,
      allRetailOffersWithStoreNames: retail.itemUrl || `https://boardgameprices.com/search?search=${encodeURIComponent(name)}`,
      ebaySoldPrices: `https://www.ebay.com/sch/i.html?_nkw=${q}&LH_Sold=1&LH_Complete=1&LH_PrefLoc=1`
    }
  };

  const system = `You are a board-game price analyst advising a lending-library curator on acquiring "${name}". Use ONLY the JSON data provided; never invent numbers; round to whole dollars; markdown links as [text](url).

OUTPUT FORMAT — a machine parses your reply, follow it EXACTLY, no text outside the delimited sections:
===VERDICT===
First line EXACTLY "VERDICT: buy" or "VERDICT: wait" or "VERDICT: watch". Then 1-3 lines: the fair target price to set (anchored to real sold prices when available) and the core reasoning. If forumChatter contains print-status or availability news that changes the calculus (reprint incoming, sold out at publisher), cite it with its thread link.
===BEST BUYS===
Max 900 characters, bullet lines: cheapest genuine second-hand listing (price, condition, [its listing](link)), cheapest US retail (item + delivered, [all retail offers](storeListUrl)), and today's cheapest live eBay ask if ebayLiveNow has data.
===MARKET===
Max 900 characters, bullet lines: listing counts and price spread used vs new, what was filtered out (accessory/promo listings), BGG demand pressure from bggDemandAndSupply (wanting vs for-trade copies) if present, and community buzz: recentYouTubeCoverage (cite channel, views, link), communityBuzz (Reddit/Bluesky mention counts, press items with the latest headline linked, Wikipedia interest vs its baseline), and forumActivity. Rising buzz firms prices — say so when it shifts the verdict.
===HISTORY===
Max 900 characters, bullet lines: real sold prices FIRST — ebaySoldHistory (note dataThrough if the source is historical) and bggSalesWeDetected (probable sales from vanished BGG listings, fresh and first-party) — then our tracked history if it exists (historic low with date, averages, how today compares); otherwise note tracking starts once the game is watched.`;

  try {
    const content = await askClaude(env, system, JSON.stringify(data), 1400);

    // Parse the delimited sections; fall back to raw text if the model
    // ignored the format.
    const sec = {};
    {
      const marks = [];
      const re = /===\s*(VERDICT|BEST BUYS|MARKET|HISTORY)\s*===/g;
      let m;
      while ((m = re.exec(content))) marks.push({ key: m[1], at: m.index, end: re.lastIndex });
      for (let i = 0; i < marks.length; i++) {
        sec[marks[i].key] = content.slice(marks[i].end, i + 1 < marks.length ? marks[i + 1].at : undefined).trim();
      }
    }
    const structured = Boolean(sec.VERDICT && (sec["BEST BUYS"] || sec.MARKET || sec.HISTORY));
    let verdict = "watch";
    let verdictBody = sec.VERDICT || "";
    const vm = verdictBody.match(/^VERDICT:\s*(buy|wait|watch)\s*\n?/i);
    if (vm) { verdict = vm[1].toLowerCase(); verdictBody = verdictBody.slice(vm[0].length).trim(); }
    const tag = verdict === "buy" ? "🟢 BUY" : verdict === "wait" ? "🟠 WAIT" : "🟡 WATCH";

    // Readable version for the dashboard modal.
    const analysis = structured
      ? `${tag}\n${verdictBody}\n\n**Best buys right now**\n${sec["BEST BUYS"] || "—"}\n\n**Market picture**\n${sec.MARKET || "—"}\n\n**History & real sales**\n${sec.HISTORY || "—"}`
      : content;

    // Post to Discord: box art, verdict color, one field per section.
    let posted = false;
    if (env.ALERT_WEBHOOK) {
      const thumbs = await fetchThumbnails(env, [id]);
      const VERDICT_COLORS = { buy: 0x2ECC71, wait: 0xE67E22, watch: 0xF5C542 };
      const embed = {
        title: `📊 Price Analysis — ${name}`,
        url: `https://boardgamegeek.com/boardgame/${id}`,
        thumbnail: thumbs[id] ? { url: thumbs[id] } : undefined,
        color: structured ? VERDICT_COLORS[verdict] : 0x6EA8FF,
        footer: { text: "DFWGV Librarian · on-demand price analysis" },
        timestamp: new Date().toISOString()
      };
      if (structured) {
        embed.description = `**${tag}** — ${verdictBody}`.slice(0, 3900);
        embed.fields = [
          sec["BEST BUYS"] ? { name: "💰 Best buys right now", value: sec["BEST BUYS"].slice(0, 1024), inline: false } : null,
          sec.MARKET ? { name: "📈 Market picture", value: sec.MARKET.slice(0, 1024), inline: false } : null,
          sec.HISTORY ? { name: "📜 History & real sales", value: sec.HISTORY.slice(0, 1024), inline: false } : null
        ].filter(Boolean);
      } else {
        embed.description = content.slice(0, 3900);
      }
      const res = await fetch(env.ALERT_WEBHOOK.trim(), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ embeds: [embed] })
      });
      posted = res.ok;
    }
    return jsonResponse({ ok: true, analysis, posted }, 200, cors);
  } catch (err) {
    return jsonResponse({ ok: false, error: String(err.message).slice(0, 300) }, 502, cors);
  }
}


/**
 * Manually trigger (POST) or check (GET) the GitHub Action that rebuilds
 * games-library.json. Token-gated; needs a GITHUB_TOKEN secret (fine-grained
 * PAT for this repo with Actions read/write).
 */
async function handleRefreshSnapshot(request, env, cors) {
  if (!isAuthorized(request, env)) {
    return jsonResponse({ ok: false, error: "Unauthorized" }, 401, cors);
  }
  if (!env.GITHUB_TOKEN) {
    return jsonResponse({ ok: false, error: "GITHUB_TOKEN secret not set on the worker" }, 400, cors);
  }
  const gh = (path, init) => fetch(`https://api.github.com/repos/${GITHUB_REPO}/actions/${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${env.GITHUB_TOKEN}`,
      "User-Agent": "dfwgv-bgg-proxy",
      Accept: "application/vnd.github+json",
      ...(init && init.headers)
    }
  });

  if (request.method === "POST") {
    const res = await gh(`workflows/${SNAPSHOT_WORKFLOW}/dispatches`, {
      method: "POST",
      body: JSON.stringify({ ref: "main" })
    });
    if (res.status === 204) return jsonResponse({ ok: true }, 200, cors);
    return jsonResponse({ ok: false, error: `GitHub ${res.status}: ${(await res.text()).slice(0, 150)}` }, 502, cors);
  }

  if (request.method === "GET") {
    const res = await gh(`workflows/${SNAPSHOT_WORKFLOW}/runs?per_page=1`);
    if (!res.ok) {
      return jsonResponse({ ok: false, error: `GitHub ${res.status}` }, 502, cors);
    }
    const data = await res.json();
    const run = (data.workflow_runs || [])[0];
    return jsonResponse({
      ok: true,
      run: run ? { status: run.status, conclusion: run.conclusion, created_at: run.created_at, html_url: run.html_url } : null
    }, 200, cors);
  }

  return new Response("Method not allowed", {
    status: 405,
    headers: { ...cors, "Content-Type": "text/plain; charset=utf-8" }
  });
}

/** KV reads are eventually consistent, so racing writes can duplicate an id —
 *  dedupe (keep the first occurrence) everywhere a list is read or written. */
function dedupeById(list) {
  const seen = new Set();
  return list.filter((g) => !seen.has(g.id) && seen.add(g.id));
}

/**
 * Ignore list for the admin dashboard's suggestion surfaces (token-gated).
 * Games here are hidden from Suggested acquisitions / Top-100 gaps / Trending
 * until restored.
 */
async function handleIgnoreList(request, env, cors, incomingUrl) {
  if (!isAuthorized(request, env)) {
    return jsonResponse({ ok: false, error: "Unauthorized" }, 401, cors);
  }

  const raw = JSON.parse((await env.HOT_HISTORY.get("ignore-list")) || "[]");
  const list = dedupeById(raw);

  if (request.method === "POST") {
    let body;
    try { body = await request.json(); } catch { body = {}; }
    const id = String(body.id || "");
    const name = clampString(body.name, 160);
    if (!/^\d+$/.test(id) || !name) {
      return jsonResponse({ ok: false, error: "Invalid game" }, 400, cors);
    }
    if (!list.some((g) => g.id === id)) {
      if (list.length >= 500) {
        return jsonResponse({ ok: false, error: "Ignore list is capped at 500 games" }, 400, cors);
      }
      list.push({ id, name, addedAt: new Date().toISOString().slice(0, 10) });
    }
    await env.HOT_HISTORY.put("ignore-list", JSON.stringify(list));
    return jsonResponse({ ok: true, list }, 200, cors);
  }

  if (request.method === "DELETE") {
    const id = incomingUrl.searchParams.get("id") || "";
    const next = list.filter((g) => g.id !== id);
    await env.HOT_HISTORY.put("ignore-list", JSON.stringify(next));
    return jsonResponse({ ok: true, list: next }, 200, cors);
  }

  // Reading found duplicates from an earlier race — persist the cleanup.
  if (list.length !== raw.length) {
    await env.HOT_HISTORY.put("ignore-list", JSON.stringify(list));
  }
  return jsonResponse({ ok: true, list }, 200, cors);
}

/**
 * 6-hourly price check: each invocation handles PRICE_SLICE watched games
 * (lowest US retail via BoardGamePrices, lowest genuine BGG Marketplace
 * listing, cheapest live eBay ask), records them, and alerts on drops. If
 * more games remain it chains to the next slice via the worker's own URL,
 * so each slice gets a fresh free-plan subrequest budget.
 */
async function checkWatchedPrices(env, ctx, start = 0) {
  const list = JSON.parse((await env.HOT_HISTORY.get(WATCHLIST_KEY)) || "[]");
  if (list.length === 0) return { checked: 0, alerts: [] };
  const total = Math.min(list.length, WATCHLIST_CAP);
  const slice = list.slice(start, Math.min(start + PRICE_SLICE, total));
  if (!slice.length) return { checked: 0, alerts: [], totalWatched: total };
  const history = JSON.parse((await env.HOT_HISTORY.get(PRICE_HISTORY_KEY)) || "{}");
  let ebaySoldCache = {};
  try { ebaySoldCache = JSON.parse((await env.HOT_HISTORY.get(EBAY_SOLD_KEY)) || "{}"); } catch { /* optional */ }
  let listTrack = {};
  try { listTrack = JSON.parse((await env.HOT_HISTORY.get(MARKET_LISTINGS_KEY)) || "{}"); } catch { /* rebuild */ }
  let bggSold = {};
  try { bggSold = JSON.parse((await env.HOT_HISTORY.get(BGG_SOLD_KEY)) || "{}"); } catch { /* rebuild */ }
  let liveCache = {};
  try { liveCache = JSON.parse((await env.HOT_HISTORY.get(LIVE_MARKET_KEY)) || "{}"); } catch { /* rebuild */ }
  const today = new Date().toISOString().slice(0, 10);
  const cooldownDate = new Date(Date.now() - ALERT_COOLDOWN_DAYS * 864e5).toISOString().slice(0, 10);
  const alerts = [];

  for (const g of slice) {
    const snap = {};
    try { // retail — lowest in-stock US item price + today's average
      const res = await fetch(`https://boardgameprices.com/api/info?eid=${g.id}&currency=USD&destination=US&sitename=dfwgamingvillage.com`);
      if (res.ok) {
        const data = await res.json();
        const best = (data.items || [])
          .map((it) => ({
            url: it.url || "",
            offers: (it.prices || []).filter((p) => p.country === "US" && p.stock === "Y")
              .map((p) => ({ item: +p.product || +p.price, delivered: +p.price })).filter((o) => o.item)
          }))
          .sort((a, b) => b.offers.length - a.offers.length)[0];
        if (best && best.offers.length) {
          const prices = best.offers.map((o) => o.item);
          snap.r = Math.min(...prices);
          snap.rAvg = prices.reduce((a, b) => a + b, 0) / prices.length;
          snap.rUrl = best.url; // BoardGamePrices item page — where the offers are listed
          snap.rCount = best.offers.length;
          snap.rDeliv = Math.min(...best.offers.map((o) => o.delivered).filter(Boolean));
        }
      }
    } catch { /* leave channel empty for today */ }
    try { // second-hand — lowest genuine USD BGG Marketplace listing + today's average
      const res = await fetch(`${BGG_THING_URL}?id=${g.id}&marketplace=1`, {
        headers: { Authorization: `Bearer ${env.BGG_TOKEN}` }
      });
      if (res.ok) {
        const clean = parseCleanUsdListings(await res.text());
        if (clean.length) {
          snap.m = clean[0].price;
          snap.mLink = clean[0].link; // direct link to the cheapest genuine listing
          snap.mAvg = clean.reduce((a, b) => a + b.price, 0) / clean.length;
          snap.mCount = clean.length;
          snap.mCond = clean[0].condition;
        }
        // Sold-copy detection: a tracked listing that vanished since the last
        // check almost certainly sold — record it as a probable sale. This
        // builds our OWN fresh second-hand sold-price history over time.
        const cur = new Map(clean.filter((l) => l.link).map((l) => [l.link, l]));
        for (const [link, info] of Object.entries(listTrack[g.id] || {})) {
          if (cur.has(link)) continue;
          (bggSold[g.id] = bggSold[g.id] || []).unshift({ p: info.p, c: info.c, date: today });
          bggSold[g.id] = bggSold[g.id].slice(0, 60);
        }
        listTrack[g.id] = {};
        for (const [link, l] of cur) listTrack[g.id][link] = { p: l.price, c: l.condition };
      }
    } catch { /* leave channel empty for today */ }
    try { // eBay — cheapest genuine live US ask (official Browse API, when keys are set)
      const live = await fetchEbayLive(env, g.name);
      if (live) {
        snap.e = live.cheapest.price;
        snap.eLink = live.cheapest.url;
        snap.eCond = live.cheapest.condition;
        snap.eAvg = live.avgAsk;
        snap.eCount = live.liveListings;
      }
    } catch { /* leave channel empty for today */ }

    const gh = history[g.id] = history[g.id] || {};
    const prevDates = Object.keys(gh).filter((d) => /^\d{4}-/.test(d) && d < today).sort().slice(-30);
    const linkFor = (key) => key === "r"
      ? (snap.rUrl || `https://boardgameprices.com/search?search=${encodeURIComponent(g.name)}`)
      : key === "e"
        ? (snap.eLink || `https://www.ebay.com/sch/i.html?_nkw=${encodeURIComponent(`${g.name} board game`)}&LH_BIN=1`)
        : (snap.mLink || `https://boardgamegeek.com/boardgame/${g.id}/marketplace`);
    const canAlert = !gh.lastAlert || gh.lastAlert < cooldownDate;

    // Context stats for the alert embed: trailing avg, 14-day low, historic
    // low (with date) per channel, drawn from the stored history + today.
    const ctxFor = (key) => {
      const allDates = Object.keys(gh).filter((d) => /^\d{4}-/.test(d)).sort();
      const pts = allDates.map((d) => ({ date: d, price: gh[d][key] })).filter((p) => p.price);
      if (snap[key]) pts.push({ date: today, price: snap[key] });
      if (!pts.length) return {};
      const prices = pts.map((p) => p.price);
      const histLow = Math.min(...prices);
      const last14 = pts.slice(-14).map((p) => p.price);
      return {
        avg30: Math.round(prices.slice(-30).reduce((a, b) => a + b, 0) / Math.min(prices.length, 30)),
        low14: Math.min(...last14),
        histLow,
        histLowDate: pts.find((p) => p.price === histLow).date,
        trackedDays: pts.length
      };
    };
    const eb = ebaySoldCache[g.id];
    const CHANNELS = { r: "new retail", m: "second-hand", e: "eBay live" };
    // Full per-channel picture for the alert embed's structured sections.
    const chanData = (key) => {
      const ctx = ctxFor(key);
      if (!snap[key] && !ctx.histLow) return null;
      return {
        now: snap[key] || null,
        cond: key === "m" ? (snap.mCond || "") : key === "e" ? (snap.eCond || "") : "",
        count: (key === "r" ? snap.rCount : key === "m" ? snap.mCount : snap.eCount) || 0,
        link: linkFor(key),
        ...ctx
      };
    };
    const enrich = (key) => ({
      price: snap[key],
      target: g.target || null,
      cond: key === "m" ? snap.mCond : key === "e" ? snap.eCond : "",
      counts: { used: snap.mCount || 0, retail: snap.rCount || 0, ebay: snap.eCount || 0 },
      other: Object.keys(CHANNELS)
        .filter((k) => k !== key && snap[k])
        .map((k) => ({ label: CHANNELS[k], price: snap[k] }))
        .sort((a, b) => a.price - b.price)[0] || null,
      channels: { retail: chanData("r"), secondHand: chanData("m"), ebayLive: chanData("e") },
      ebaySold: eb ? { median: eb.medianSold, count: eb.soldCount, through: eb.dataThrough } : null,
      bggProbableSales: probableSaleStats(bggSold[g.id]),
      ...ctxFor(key)
    });

    if (g.target > 0) {
      // Manual target: alert the moment the cheapest genuine price (either
      // channel) is at or below the target. Overrides the average rules.
      const options = [];
      if (snap.r) options.push({ key: "r", label: "new retail", price: snap.r });
      if (snap.m) options.push({ key: "m", label: "second-hand", price: snap.m });
      if (snap.e) options.push({ key: "e", label: "eBay live", price: snap.e });
      const best = options.filter((o) => o.price <= g.target).sort((a, b) => a.price - b.price)[0];
      if (best && canAlert) {
        alerts.push({
          id: g.id, name: g.name, channel: best.label,
          note: `$${best.price.toFixed(2)} — at or below your $${g.target} target`,
          link: linkFor(best.key), date: today,
          ...enrich(best.key)
        });
      }
    } else {
      // No target: the statistical rules — below recent average, or (young
      // history) a steep discount off today's average listing.
      for (const [key, label] of [["r", "new retail"], ["m", "second-hand"], ["e", "eBay live"]]) {
        const cur = snap[key];
        if (!cur) continue;
        const prev = prevDates.map((d) => gh[d][key]).filter(Boolean);
        let note = "";
        if (prev.length >= MIN_TRAILING_POINTS) {
          const avg = prev.reduce((a, b) => a + b, 0) / prev.length;
          if (cur <= avg * (1 - DROP_VS_TRAILING)) {
            note = `$${cur.toFixed(2)} — ${Math.round((1 - cur / avg) * 100)}% below its ${prev.length}-day average of $${avg.toFixed(0)}`;
          }
        } else if (snap[key + "Avg"] && cur <= snap[key + "Avg"] * (1 - OUTLIER_VS_TODAY)) {
          note = `$${cur.toFixed(2)} — ${Math.round((1 - cur / snap[key + "Avg"]) * 100)}% below today's average listing of $${snap[key + "Avg"].toFixed(0)}`;
        }
        if (note && canAlert) {
          alerts.push({ id: g.id, name: g.name, channel: label, note, link: linkFor(key), date: today, ...enrich(key) });
        }
      }
    }
    gh[today] = { r: snap.r, m: snap.m, e: snap.e, rc: snap.rCount, mc: snap.mCount };
    // Stage the fresh market snapshot for the digest (which must stay cheap
    // in subrequests, so it assembles from KV instead of re-fetching).
    liveCache[g.id] = {
      t: Date.now(),
      retail: snap.r ? { usInStockOffers: snap.rCount, lowItem: snap.r, lowDelivered: snap.rDeliv || null, storeListUrl: snap.rUrl } : null,
      ebayLive: snap.e ? { liveListings: snap.eCount, avgAsk: snap.eAvg, cheapest: { price: snap.e, condition: snap.eCond, url: snap.eLink } } : null
    };
    if (alerts.some((a) => a.id === g.id)) gh.lastAlert = today;
    const dates = Object.keys(gh).filter((d) => /^\d{4}-/.test(d)).sort();
    for (const d of dates.slice(0, Math.max(0, dates.length - PRICE_HISTORY_DAYS))) delete gh[d];

    await new Promise((r) => setTimeout(r, 500)); // pace BGG/BGP politely
  }

  await env.HOT_HISTORY.put(PRICE_HISTORY_KEY, JSON.stringify(history));
  await env.HOT_HISTORY.put(MARKET_LISTINGS_KEY, JSON.stringify(listTrack));
  await env.HOT_HISTORY.put(BGG_SOLD_KEY, JSON.stringify(bggSold));
  await env.HOT_HISTORY.put(LIVE_MARKET_KEY, JSON.stringify(liveCache));
  if (alerts.length) {
    const prev = JSON.parse((await env.HOT_HISTORY.get(PRICE_ALERTS_KEY)) || "[]");
    await env.HOT_HISTORY.put(PRICE_ALERTS_KEY, JSON.stringify(alerts.concat(prev).slice(0, 20)));
    await sendPriceAlert(env, alerts);
  }

  // More games to check → chain the next slice as its own invocation.
  const nextStart = start + slice.length;
  if (nextStart < total && ctx) {
    ctx.waitUntil(fetch(`${WORKER_SELF_URL}/api/cron-prices?start=${nextStart}`, {
      method: "POST",
      headers: { Authorization: `Bearer ${env.ANALYTICS_ADMIN_TOKEN}` }
    }).catch(() => { /* the next cron sweep will cover the rest */ }));
  }
  return { checked: slice.length, alerts, totalWatched: total, continuing: nextStart < total };
}

/** Chained price-check slice (token-gated; called by the worker itself).
 *  Responds immediately and does the slice work via waitUntil so the caller
 *  never blocks on it. */
async function handleCronPrices(request, env, ctx, cors) {
  if (!isAuthorized(request, env)) {
    return jsonResponse({ ok: false, error: "Unauthorized" }, 401, cors);
  }
  const start = parseInt(new URL(request.url).searchParams.get("start") || "0", 10) || 0;
  ctx.waitUntil(checkWatchedPrices(env, ctx, start).catch(() => { /* next sweep retries */ }));
  return jsonResponse({ ok: true, started: start }, 200, cors);
}

/** Box art thumbnails for a set of BGG ids — one batched thing call. */
async function fetchThumbnails(env, ids) {
  const thumbs = {};
  if (!ids.length) return thumbs;
  try {
    const res = await fetch(`${BGG_THING_URL}?id=${ids.slice(0, 20).join(",")}`, {
      headers: { Authorization: `Bearer ${env.BGG_TOKEN}` }
    });
    if (res.ok) {
      const xml = await res.text();
      for (const item of xml.split(/<item\s/).slice(1)) {
        const id = (item.match(/^[^>]*\bid="(\d+)"/) || [])[1];
        const thumb = (item.match(/<thumbnail>([^<]+)<\/thumbnail>/) || [])[1];
        if (id && thumb) thumbs[id] = decodeEntities(thumb);
      }
    }
  } catch { /* thumbnails are decorative */ }
  return thumbs;
}

/** Posts alerts to the Discord webhook stored as the ALERT_WEBHOOK secret.
 *  Real alerts render one rich embed per game: box art, price-context fields
 *  (target / 14-day low / averages / historic low), and a Claude-written
 *  one-line assessment of whether the deal is actually good. */
async function sendPriceAlert(env, alerts, isTest) {
  if (!env.ALERT_WEBHOOK) return false;
  try {
    let embeds;
    if (isTest) {
      embeds = [{
        title: "🧪 🎲 Library Price Alert",
        description: alerts.map((a) => `**[${a.name}](https://boardgamegeek.com/boardgame/${a.id})**\n${a.note}`).join("\n\n").slice(0, 3900),
        color: 0x99AAB5,
        footer: { text: "DFWGV Librarian · price watch" },
        timestamp: new Date().toISOString()
      }];
    } else {
      const batch = alerts.slice(0, 10);
      const thumbs = await fetchThumbnails(env, batch.map((a) => a.id));

      // One Claude call for the whole batch: a one-liner per alert on whether
      // this is a genuinely good buy given history and the wider market.
      const takes = {};
      if (env.ANTHROPIC_API_KEY) {
        try {
          const raw = await askClaude(env,
            `You assess board-game price alerts for a lending-library curator. For EACH alert in the JSON, write ONE sentence (max 30 words) of buying advice: is this genuinely a good price given its historic low, averages, listing condition, the other channel's price, and the ebaySold baseline (median of REAL eBay sale prices — the best value anchor when present) — and act now or wait? Be direct and specific with numbers. Output exactly one line per alert, formatted "id|sentence", nothing else.`,
            JSON.stringify(batch), 600);
          for (const line of raw.split("\n")) {
            const m = line.match(/^\s*(\d+)\s*\|\s*(.+)$/);
            if (m) takes[m[1]] = m[2].trim();
          }
        } catch { /* assessment is optional garnish */ }
      }

      const money = (v) => (v || v === 0) ? `$${Math.round(v)}` : "—";
      // One bulleted section per price channel, so retail / second-hand /
      // eBay each read as their own block.
      const channelField = (label, unit, c) => {
        if (!c) return null;
        const lines = [
          c.now
            ? `• Now **$${(+c.now).toFixed(2)}**${c.cond ? ` (${c.cond})` : ""}${c.count ? ` · ${c.count} ${unit}` : ""}`
            : "• Nothing listed today",
          (c.low14 || c.avg30) ? `• 14d low ${money(c.low14)} · 30d avg ${money(c.avg30)}` : null,
          c.histLow ? `• Hist. low ${money(c.histLow)} (${c.histLowDate})` : null,
          c.now && c.link ? `• [View listings](${c.link})` : null
        ].filter(Boolean);
        return { name: label, value: lines.join("\n"), inline: true };
      };
      embeds = batch.map((a) => {
        const ch = a.channels || {};
        const fields = [
          channelField("🏪 New retail", "offers", ch.retail),
          channelField("🔄 Second-hand (BGG)", "listings", ch.secondHand),
          channelField("🛒 eBay live", "asks", ch.ebayLive)
        ].filter(Boolean);
        const sold = [
          a.ebaySold ? `• eBay: ${money(a.ebaySold.median)} median · ${a.ebaySold.count} sales thru ${a.ebaySold.through}` : null,
          a.bggProbableSales ? `• BGG (detected): ${money(a.bggProbableSales.median)} median · ${a.bggProbableSales.detectedSales} copies, latest ${a.bggProbableSales.newest}` : null
        ].filter(Boolean);
        if (sold.length) {
          fields.push({ name: "🧾 Real sale prices", value: sold.join("\n"), inline: false });
        }
        const headline = [
          `**${a.channel}** · ${a.note}`,
          `🎯 Target: ${a.target ? `$${a.target}` : "none set (automatic rules)"}`,
          takes[a.id] ? `💡 ${takes[a.id]}` : null,
          `[View listing](${a.link || `https://boardgamegeek.com/boardgame/${a.id}`}) · [eBay sold prices](https://www.ebay.com/sch/i.html?_nkw=${encodeURIComponent(`${a.name} board game`)}&LH_Sold=1&LH_Complete=1&LH_PrefLoc=1)`
        ].filter(Boolean).join("\n");
        return {
          title: `🎲 Price Alert — ${a.name}`,
          url: `https://boardgamegeek.com/boardgame/${a.id}`,
          description: headline,
          fields,
          thumbnail: thumbs[a.id] ? { url: thumbs[a.id] } : undefined,
          color: 0x35B8A6,
          footer: { text: "DFWGV Librarian · price watch" },
          timestamp: new Date().toISOString()
        };
      });
    }

    const res = await fetch(env.ALERT_WEBHOOK.trim(), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ embeds })
    });
    if (isTest) {
      return { ok: res.ok, status: res.status, detail: res.ok ? "" : (await res.text()).slice(0, 200) };
    }
    return res.ok;
  } catch (err) {
    // e.g. TypeError: Invalid URL when the stored secret isn't a clean URL
    return isTest ? { ok: false, status: 0, detail: String(err.message).slice(0, 200) } : false;
  }
}

/** Serves the accumulated Hotness snapshots (JSON). */
async function handleHotHistory(request, env, cors) {
  if (request.method !== "GET") {
    return new Response("Method not allowed", {
      status: 405,
      headers: { ...cors, "Content-Type": "text/plain; charset=utf-8" }
    });
  }

  const history = (await env.HOT_HISTORY.get(HOT_HISTORY_KEY)) || "{}";
  return new Response(history, {
    status: 200,
    headers: {
      ...cors,
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "public, max-age=3600"
    }
  });
}

/** BGG "Hotness" list (trending games) — XML pass-through, cached 1 hour. */
async function handleBggHot(request, env, cors) {
  if (request.method !== "GET") {
    return new Response("Method not allowed", {
      status: 405,
      headers: { ...cors, "Content-Type": "text/plain; charset=utf-8" }
    });
  }

  const response = await fetch(`${BGG_HOT_URL}?type=boardgame`, {
    headers: { Authorization: `Bearer ${env.BGG_TOKEN}` }
  });
  const body = await response.text();

  return new Response(body, {
    status: response.status,
    headers: {
      ...cors,
      "Content-Type": response.headers.get("Content-Type") || "application/xml; charset=utf-8",
      "Cache-Control": response.status === 200 ? "public, max-age=3600" : "no-store"
    }
  });
}

/** BGG game search — XML pass-through, cached 6 hours per query. */
async function handleBggSearch(request, env, cors, incomingUrl) {
  if (request.method !== "GET") {
    return new Response("Method not allowed", {
      status: 405,
      headers: { ...cors, "Content-Type": "text/plain; charset=utf-8" }
    });
  }

  const query = clampString(incomingUrl.searchParams.get("q"), 80).trim();
  if (query.length < 2) {
    return new Response("Query too short", {
      status: 400,
      headers: { ...cors, "Content-Type": "text/plain; charset=utf-8" }
    });
  }

  const searchUrl = new URL(BGG_SEARCH_URL);
  searchUrl.searchParams.set("query", query);
  searchUrl.searchParams.set("type", "boardgame");
  const response = await fetch(searchUrl.toString(), {
    headers: { Authorization: `Bearer ${env.BGG_TOKEN}` }
  });
  const body = await response.text();

  return new Response(body, {
    status: response.status,
    headers: {
      ...cors,
      "Content-Type": response.headers.get("Content-Type") || "application/xml; charset=utf-8",
      "Cache-Control": response.status === 200 ? "public, max-age=21600" : "no-store"
    }
  });
}

/**
 * Retail price aggregate for the admin dashboard, proxied from the
 * BoardGamePrices.com public API (no CORS on their side). eid = BGG id.
 * Their free tier includes prices/stock/links but not store names — the
 * per-item URL in the response is where users see the actual retailers.
 */
async function handleRetailPrices(request, env, cors, incomingUrl) {
  if (request.method !== "GET") {
    return new Response("Method not allowed", {
      status: 405,
      headers: { ...cors, "Content-Type": "text/plain; charset=utf-8" }
    });
  }

  const eid = incomingUrl.searchParams.get("eid") || "";
  if (!/^\d+$/.test(eid)) {
    return new Response("Invalid eid", {
      status: 400,
      headers: { ...cors, "Content-Type": "text/plain; charset=utf-8" }
    });
  }

  const url = `https://boardgameprices.com/api/info?eid=${eid}&currency=USD&destination=US&sitename=dfwgamingvillage.com`;
  const response = await fetch(url);
  const body = await response.text();

  return new Response(body, {
    status: response.status,
    headers: {
      ...cors,
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": response.ok ? "public, max-age=21600" : "no-store" // 6 hours
    }
  });
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
  async scheduled(event, env, ctx) {
    if (event.cron === DIGEST_CRON) {
      ctx.waitUntil(postWeeklyDigest(env).catch(() => {}));
      return;
    }
    ctx.waitUntil(snapshotHotness(env));
    ctx.waitUntil(checkWatchedPrices(env, ctx, 0));
    // Forum/YouTube/eBay-sold/Reddit intel runs as a separate invocation via
    // the worker's own URL so it gets its own free-plan subrequest budget.
    ctx.waitUntil(fetch(`${WORKER_SELF_URL}/api/cron-intel`, {
      method: "POST",
      headers: { Authorization: `Bearer ${env.ANALYTICS_ADMIN_TOKEN}` }
    }).catch(() => {}));
    ctx.waitUntil(fetch(`${WORKER_SELF_URL}/api/cron-auctions`, {
      method: "POST",
      headers: { Authorization: `Bearer ${env.ANALYTICS_ADMIN_TOKEN}` }
    }).catch(() => {}));
  },

  async fetch(request, env, ctx) {
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

    if (incomingUrl.pathname === "/api/bgg-hot") {
      return handleBggHot(request, env, cors);
    }

    if (incomingUrl.pathname === "/api/hot-history") {
      return handleHotHistory(request, env, cors);
    }

    if (incomingUrl.pathname === "/api/watchlist") {
      return handleWatchlist(request, env, cors, incomingUrl, ctx);
    }

    if (incomingUrl.pathname === "/api/ignore") {
      return handleIgnoreList(request, env, cors, incomingUrl);
    }

    if (incomingUrl.pathname === "/api/refresh-snapshot") {
      return handleRefreshSnapshot(request, env, cors);
    }

    if (incomingUrl.pathname === "/api/cron-auctions") {
      return handleCronAuctions(request, env, ctx, cors);
    }

    if (incomingUrl.pathname === "/api/cron-intel") {
      return handleCronIntel(request, env, ctx, cors);
    }

    if (incomingUrl.pathname === "/api/cron-prices") {
      return handleCronPrices(request, env, ctx, cors);
    }

    if (incomingUrl.pathname === "/api/digest") {
      return handleDigest(request, env, cors);
    }

    if (incomingUrl.pathname === "/api/draft-letter") {
      return handleDraftLetter(request, env, cors);
    }

    if (incomingUrl.pathname === "/api/price-analysis") {
      return handlePriceAnalysis(request, env, cors);
    }

    if (incomingUrl.pathname === "/api/bgg-search") {
      return handleBggSearch(request, env, cors, incomingUrl);
    }

    if (incomingUrl.pathname === "/api/retail-prices") {
      return handleRetailPrices(request, env, cors, incomingUrl);
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
