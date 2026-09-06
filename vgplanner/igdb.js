// PATH: site/igdb.js
// Thin client for the IGDB proxy worker. All shaping happens server-side;
// this module only knows the three endpoints and turns HTTP failures into
// readable errors.

import { IGDB_PROXY_BASE } from "./app-config.js";

async function getJson(path) {
  let res;
  try {
    res = await fetch(`${IGDB_PROXY_BASE}${path}`);
  } catch {
    throw new Error(`Can't reach the IGDB proxy at ${IGDB_PROXY_BASE}. Is the worker running?`);
  }
  if (!res.ok) {
    let message = `Request failed (${res.status}).`;
    try {
      const text = await res.text();
      try { message = JSON.parse(text).error || message; } catch { if (text) message = text; }
    } catch { /* keep default */ }
    throw new Error(message);
  }
  return res.json();
}

export async function searchGames(query) {
  const data = await getJson(`/api/vg-search?q=${encodeURIComponent(query)}`);
  return Array.isArray(data.results) ? data.results : [];
}

export function getGame(igdbId) {
  return getJson(`/api/vg-game?id=${encodeURIComponent(igdbId)}`);
}

// Health answers 503 when any dependency is down but still says which; read
// the body either way and only throw when the worker itself is unreachable.
export async function health() {
  let res;
  try {
    res = await fetch(`${IGDB_PROXY_BASE}/api/vg-health`);
  } catch {
    throw new Error(`Can't reach the planner API at ${IGDB_PROXY_BASE}. Is the worker running?`);
  }
  try {
    return await res.json();
  } catch {
    return { ok: false, igdb: false, firestore: false };
  }
}
