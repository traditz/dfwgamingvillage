// PATH: site/api.js
// One fetch wrapper for the planner API worker. Authenticated calls carry the
// signed-in user's Firebase ID token; the worker verifies it and writes
// Firestore with a service account, so the site never needs Firestore rules.

import { IGDB_PROXY_BASE } from "./app-config.js";
import { getIdToken } from "./auth.js";

export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

export async function apiFetch(path, { method = "GET", body, auth = false } = {}) {
  const headers = {};
  if (body !== undefined) headers["Content-Type"] = "application/json";
  if (auth) {
    const token = await getIdToken();
    if (!token) throw new ApiError("Sign in to do that.", 401);
    headers.Authorization = `Bearer ${token}`;
  }

  let res;
  try {
    res = await fetch(`${IGDB_PROXY_BASE}${path}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined
    });
  } catch {
    throw new ApiError(`Can't reach the planner API at ${IGDB_PROXY_BASE}. Is the worker running?`, 0);
  }

  const text = await res.text();
  let data = null;
  try { data = text ? JSON.parse(text) : null; } catch { data = null; }
  if (!res.ok) throw new ApiError(data?.error || text || `Request failed (${res.status}).`, res.status);
  return data;
}
