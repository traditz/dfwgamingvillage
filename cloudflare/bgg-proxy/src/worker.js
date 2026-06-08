const BGG_COLLECTION_URL = "https://boardgamegeek.com/xmlapi2/collection";
const DEFAULT_USERNAME = "traditz";
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
        page,
        COUNT(*) AS views,
        COUNT(DISTINCT session_id) AS sessions
      FROM page_views
      WHERE datetime(timestamp) >= datetime('now', ?)
      GROUP BY page
      ORDER BY views DESC
      LIMIT 25
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

export default {
  async fetch(request, env) {
    const cors = corsHeaders(request);
    const incomingUrl = new URL(request.url);

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: cors });
    }

    if (incomingUrl.pathname === "/api/page-view") {
      return handlePageView(request, env, cors);
    }

    if (incomingUrl.pathname === "/api/analytics-summary") {
      return handleAnalyticsSummary(request, env, cors);
    }

    if (incomingUrl.pathname === "/api/bgg-collection") {
      return handleBggCollection(request, env, cors, incomingUrl);
    }

    return new Response("Not found", {
      status: 404,
      headers: { ...cors, "Content-Type": "text/plain; charset=utf-8" }
    });
  }
};
