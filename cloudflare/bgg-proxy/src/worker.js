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
const WATCHLIST_CAP = 50;
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
async function handleWatchlist(request, env, cors, incomingUrl) {
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
    // Manual price check, same routine the cron runs. Takes ~1.5s per watched
    // game (polite pacing toward BGG/BGP), so the client should show progress.
    if (incomingUrl.searchParams.get("check") === "1") {
      const summary = await checkWatchedPrices(env);
      return jsonResponse({ ok: true, ...summary, webhookConfigured: Boolean(env.ALERT_WEBHOOK) }, 200, cors);
    }
    let body;
    try { body = await request.json(); } catch { body = {}; }
    const id = String(body.id || "");
    const name = clampString(body.name, 160);
    if (!/^\d+$/.test(id) || !name) {
      return jsonResponse({ ok: false, error: "Invalid game" }, 400, cors);
    }
    if (!list.some((g) => g.id === id)) {
      if (list.length >= WATCHLIST_CAP) {
        return jsonResponse({ ok: false, error: `Watchlist is capped at ${WATCHLIST_CAP} games` }, 400, cors);
      }
      list.push({ id, name, addedAt: new Date().toISOString().slice(0, 10) });
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

const GITHUB_REPO = "traditz/dfwgamingvillage";
const SNAPSHOT_WORKFLOW = "refresh-library.yml";

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
 * Daily cron: check every watched game's lowest US retail price (BoardGamePrices)
 * and lowest USD BGG Marketplace listing, record both, and alert on drops.
 */
async function checkWatchedPrices(env) {
  const list = JSON.parse((await env.HOT_HISTORY.get(WATCHLIST_KEY)) || "[]");
  if (list.length === 0) return { checked: 0, alerts: [] };
  const history = JSON.parse((await env.HOT_HISTORY.get(PRICE_HISTORY_KEY)) || "{}");
  const today = new Date().toISOString().slice(0, 10);
  const cooldownDate = new Date(Date.now() - ALERT_COOLDOWN_DAYS * 864e5).toISOString().slice(0, 10);
  const alerts = [];

  for (const g of list.slice(0, WATCHLIST_CAP)) {
    const snap = {};
    try { // retail — lowest in-stock US item price + today's average
      const res = await fetch(`https://boardgameprices.com/api/info?eid=${g.id}&currency=USD&destination=US&sitename=dfwgamingvillage.com`);
      if (res.ok) {
        const data = await res.json();
        const best = (data.items || [])
          .map((it) => ({
            url: it.url || "",
            prices: (it.prices || []).filter((p) => p.country === "US" && p.stock === "Y").map((p) => +p.product || +p.price).filter(Boolean)
          }))
          .sort((a, b) => b.prices.length - a.prices.length)[0];
        if (best && best.prices.length) {
          snap.r = Math.min(...best.prices);
          snap.rAvg = best.prices.reduce((a, b) => a + b, 0) / best.prices.length;
          snap.rUrl = best.url; // BoardGamePrices item page — where the offers are listed
        }
      }
    } catch { /* leave channel empty for today */ }
    try { // second-hand — lowest USD BGG Marketplace listing + today's average
      const res = await fetch(`${BGG_THING_URL}?id=${g.id}&marketplace=1`, {
        headers: { Authorization: `Bearer ${env.BGG_TOKEN}` }
      });
      if (res.ok) {
        const xml = await res.text();
        const prices = [...xml.matchAll(/<price currency="USD" value="([\d.]+)"/g)].map((m) => +m[1]).filter(Boolean);
        if (prices.length) {
          snap.m = Math.min(...prices);
          snap.mAvg = prices.reduce((a, b) => a + b, 0) / prices.length;
        }
      }
    } catch { /* leave channel empty for today */ }

    const gh = history[g.id] = history[g.id] || {};
    const prevDates = Object.keys(gh).filter((d) => /^\d{4}-/.test(d) && d < today).sort().slice(-30);
    for (const [key, label] of [["r", "new retail"], ["m", "second-hand"]]) {
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
      if (note && (!gh.lastAlert || gh.lastAlert < cooldownDate)) {
        // Link straight to where the deal actually is: the BoardGamePrices
        // page for retail, the game's BGG Marketplace listings for second-hand.
        const link = key === "r"
          ? (snap.rUrl || `https://boardgameprices.com/search?search=${encodeURIComponent(g.name)}`)
          : `https://boardgamegeek.com/boardgame/${g.id}/marketplace`;
        alerts.push({ id: g.id, name: g.name, channel: label, note, link, date: today });
      }
    }
    gh[today] = { r: snap.r, m: snap.m };
    if (alerts.some((a) => a.id === g.id)) gh.lastAlert = today;
    const dates = Object.keys(gh).filter((d) => /^\d{4}-/.test(d)).sort();
    for (const d of dates.slice(0, Math.max(0, dates.length - PRICE_HISTORY_DAYS))) delete gh[d];

    await new Promise((r) => setTimeout(r, 700)); // pace BGG/BGP politely
  }

  await env.HOT_HISTORY.put(PRICE_HISTORY_KEY, JSON.stringify(history));
  if (alerts.length) {
    const prev = JSON.parse((await env.HOT_HISTORY.get(PRICE_ALERTS_KEY)) || "[]");
    await env.HOT_HISTORY.put(PRICE_ALERTS_KEY, JSON.stringify(alerts.concat(prev).slice(0, 20)));
    await sendPriceAlert(env, alerts);
  }
  return { checked: Math.min(list.length, WATCHLIST_CAP), alerts };
}

/** Posts alerts to the Discord webhook stored as the ALERT_WEBHOOK secret. */
async function sendPriceAlert(env, alerts, isTest) {
  if (!env.ALERT_WEBHOOK) return false;
  const content = (isTest ? "🧪 " : "") + "🎲 **Library price alert**\n" + alerts.map((a) =>
    `**${a.name}**${a.channel ? ` · ${a.channel}` : ""} — ${a.note}\n<${a.link || `https://boardgamegeek.com/boardgame/${a.id}`}>`
  ).join("\n");
  try {
    const res = await fetch(env.ALERT_WEBHOOK.trim(), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content })
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
    ctx.waitUntil(snapshotHotness(env));
    ctx.waitUntil(checkWatchedPrices(env));
  },

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

    if (incomingUrl.pathname === "/api/bgg-hot") {
      return handleBggHot(request, env, cors);
    }

    if (incomingUrl.pathname === "/api/hot-history") {
      return handleHotHistory(request, env, cors);
    }

    if (incomingUrl.pathname === "/api/watchlist") {
      return handleWatchlist(request, env, cors, incomingUrl);
    }

    if (incomingUrl.pathname === "/api/ignore") {
      return handleIgnoreList(request, env, cors, incomingUrl);
    }

    if (incomingUrl.pathname === "/api/refresh-snapshot") {
      return handleRefreshSnapshot(request, env, cors);
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
