const BGG_COLLECTION_URL = "https://boardgamegeek.com/xmlapi2/collection";
const DEFAULT_USERNAME = "traditz";
const ANALYTICS_DATASET = "dfwgv_page_views";
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

  const requestUrl = new URL(request.url);
  const country = request.cf?.country || "";
  const userAgent = clampString(request.headers.get("User-Agent"), 300);
  const refererHeader = clampString(request.headers.get("Referer"), 500);
  const referrer = clampString(payload.referrer, 500) || refererHeader;
  const utm = payload.utm && typeof payload.utm === "object" ? payload.utm : {};

  const dataPoint = {
    blobs: [
      page,
      clampString(payload.title, 180),
      clampString(payload.query, 300),
      referrer,
      clampString(payload.language, 40),
      clampString(payload.timezone, 80),
      country,
      userAgent,
      clampString(utm.utm_source, 120),
      clampString(utm.utm_medium, 120),
      clampString(utm.utm_campaign, 120)
    ],
    doubles: [
      Number(payload.viewportWidth) || 0,
      Number(payload.viewportHeight) || 0,
      Number(payload.screenWidth) || 0,
      Number(payload.screenHeight) || 0
    ],
    indexes: [
      clampString(payload.sessionId, 80) || `${requestUrl.hostname}-unknown`
    ]
  };

  if (env.PAGE_VIEWS?.writeDataPoint) {
    env.PAGE_VIEWS.writeDataPoint(dataPoint);
  } else {
    console.log(JSON.stringify({ type: "page_view", dataPoint }));
  }

  return jsonResponse({ ok: true }, 202, cors);
}

function isAuthorized(request, env) {
  const expectedToken = env.ANALYTICS_ADMIN_TOKEN;
  const authorization = request.headers.get("Authorization") || "";
  const token = authorization.startsWith("Bearer ") ? authorization.slice(7).trim() : "";

  return Boolean(expectedToken && token && token === expectedToken);
}

function getAnalyticsInterval(range) {
  const ranges = {
    "24h": "1 DAY",
    "7d": "7 DAY",
    "30d": "30 DAY",
    "90d": "90 DAY"
  };

  return ranges[range] || ranges["7d"];
}

async function queryAnalyticsEngine(env, sql) {
  const accountId = env.CLOUDFLARE_ACCOUNT_ID;
  const apiToken = env.CLOUDFLARE_API_TOKEN;

  if (!accountId || !apiToken) {
    throw new Error("Analytics query credentials are not configured.");
  }

  const response = await fetch(`https://api.cloudflare.com/client/v4/accounts/${accountId}/analytics_engine/sql`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiToken}`,
      "Content-Type": "text/plain; charset=utf-8"
    },
    body: sql
  });

  const text = await response.text();

  if (!response.ok) {
    throw new Error(`Analytics query failed: ${response.status} ${text.slice(0, 240)}`);
  }

  const parsed = JSON.parse(text);
  return Array.isArray(parsed) ? parsed : parsed.data || parsed.rows || [];
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

  const url = new URL(request.url);
  const range = url.searchParams.get("range") || "7d";
  const interval = getAnalyticsInterval(range);
  const where = `timestamp > NOW() - INTERVAL '${interval}'`;

  const queries = {
    overview: `
      SELECT
        SUM(_sample_interval) AS views,
        uniq(index1) AS sessions,
        uniq(blob1) AS pages
      FROM ${ANALYTICS_DATASET}
      WHERE ${where}
      FORMAT JSON
    `,
    topPages: `
      SELECT
        blob1 AS page,
        SUM(_sample_interval) AS views,
        uniq(index1) AS sessions
      FROM ${ANALYTICS_DATASET}
      WHERE ${where}
      GROUP BY page
      ORDER BY views DESC
      LIMIT 25
      FORMAT JSON
    `,
    daily: `
      SELECT
        toStartOfDay(timestamp) AS day,
        SUM(_sample_interval) AS views,
        uniq(index1) AS sessions
      FROM ${ANALYTICS_DATASET}
      WHERE ${where}
      GROUP BY day
      ORDER BY day ASC
      FORMAT JSON
    `,
    referrers: `
      SELECT
        if(blob4 = '', '(direct)', blob4) AS referrer,
        SUM(_sample_interval) AS views
      FROM ${ANALYTICS_DATASET}
      WHERE ${where}
      GROUP BY referrer
      ORDER BY views DESC
      LIMIT 20
      FORMAT JSON
    `,
    countries: `
      SELECT
        if(blob7 = '', '(unknown)', blob7) AS country,
        SUM(_sample_interval) AS views
      FROM ${ANALYTICS_DATASET}
      WHERE ${where}
      GROUP BY country
      ORDER BY views DESC
      LIMIT 20
      FORMAT JSON
    `,
    campaigns: `
      SELECT
        if(blob9 = '', '(none)', blob9) AS source,
        if(blob10 = '', '', blob10) AS medium,
        if(blob11 = '', '', blob11) AS campaign,
        SUM(_sample_interval) AS views
      FROM ${ANALYTICS_DATASET}
      WHERE ${where}
      GROUP BY source, medium, campaign
      ORDER BY views DESC
      LIMIT 20
      FORMAT JSON
    `,
    recent: `
      SELECT
        timestamp,
        blob1 AS page,
        blob4 AS referrer,
        blob7 AS country
      FROM ${ANALYTICS_DATASET}
      WHERE ${where}
      ORDER BY timestamp DESC
      LIMIT 50
      FORMAT JSON
    `
  };

  try {
    const [overview, topPages, daily, referrers, countries, campaigns, recent] = await Promise.all([
      queryAnalyticsEngine(env, queries.overview),
      queryAnalyticsEngine(env, queries.topPages),
      queryAnalyticsEngine(env, queries.daily),
      queryAnalyticsEngine(env, queries.referrers),
      queryAnalyticsEngine(env, queries.countries),
      queryAnalyticsEngine(env, queries.campaigns),
      queryAnalyticsEngine(env, queries.recent)
    ]);

    return jsonResponse({
      ok: true,
      range,
      generatedAt: new Date().toISOString(),
      overview: overview[0] || { views: 0, sessions: 0, pages: 0 },
      topPages,
      daily,
      referrers,
      countries,
      campaigns,
      recent
    }, 200, cors);
  } catch (error) {
    return jsonResponse({ ok: false, error: error.message }, 500, cors);
  }
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
