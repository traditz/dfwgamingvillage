// PATH: site/store.js
// Events and the sessions inside them, from the planner's Firestore project
// through the API worker. The same documents drive the Discord bot's board,
// so a session hosted here shows up in Discord within a couple of seconds
// and a Join clicked in Discord shows up here on the next poll.
//
// Reads are public and polled for whichever view is open (the worker owns
// the service account, so the site needs no Firestore rules). Writes send
// the user's Firebase ID token.

import { apiFetch } from "./api.js";

const POLL_MS = 20_000;
const EVENT_LOOKBACK_MS = 14 * 24 * 3600 * 1000;

const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);

class RemoteStore {
  constructor() {
    this.events = [];
    this.eventsAttempted = false;
    this.bundles = new Map();   // eventId -> { event, sessions } | null (deleted)
    this.role = undefined;      // undefined = not fetched, null = signed out
    this.lastError = "";
    this.currentEventId = null; // which view is open, so polling refreshes the right thing
    this.listeners = new Set();
    this.timer = null;
    this.inflight = new Map();
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "visible") this.refresh().catch(() => {});
    });
  }

  get backendLabel() {
    return "the shared planner and mirrored to Discord";
  }

  // ---------- reads ----------

  setView(eventId) {
    this.currentEventId = eventId || null;
  }

  /** Refreshes whatever the open view needs. */
  refresh() {
    return this.currentEventId ? this.refreshEvent(this.currentEventId) : this.refreshEvents();
  }

  _dedupe(key, fn) {
    if (this.inflight.has(key)) return this.inflight.get(key);
    const p = fn().finally(() => this.inflight.delete(key));
    this.inflight.set(key, p);
    return p;
  }

  refreshEvents() {
    return this._dedupe("events", async () => {
      let changed = false;
      try {
        const since = new Date(Date.now() - EVENT_LOOKBACK_MS).toISOString();
        const data = await apiFetch(`/api/vg-events?since=${encodeURIComponent(since)}`);
        const next = Array.isArray(data.events) ? data.events : [];
        changed = this.lastError !== "" || !same(next, this.events);
        this.events = next;
        this.lastError = "";
      } catch (e) {
        changed = this.lastError !== e.message;
        this.lastError = e.message;
        throw e;
      } finally {
        this.eventsAttempted = true;
        if (changed) this.emit();
      }
    });
  }

  refreshEvent(eventId) {
    return this._dedupe(`event:${eventId}`, async () => {
      let changed = false;
      try {
        const data = await apiFetch(`/api/vg-events/${encodeURIComponent(eventId)}`);
        const next = { event: data.event, sessions: Array.isArray(data.sessions) ? data.sessions : [] };
        changed = this.lastError !== "" || !same(next, this.bundles.get(eventId));
        this.bundles.set(eventId, next);
        this.lastError = "";
      } catch (e) {
        if (e.status === 404) {
          changed = this.bundles.get(eventId) !== null;
          this.bundles.set(eventId, null);
          this.lastError = "";
        } else {
          changed = this.lastError !== e.message;
          this.lastError = e.message;
          throw e;
        }
      } finally {
        if (changed) this.emit();
      }
    });
  }

  async listEvents() {
    if (!this.eventsAttempted) {
      try { await this.refreshEvents(); } catch { /* render what we have; lastError is set */ }
    }
    return [...this.events];
  }

  /**
   * { event, sessions } when loaded, null when the server said the event is
   * gone (404), undefined when it couldn't be fetched at all (lastError says why).
   */
  async getEventBundle(eventId) {
    if (!this.bundles.has(eventId)) {
      try { await this.refreshEvent(eventId); } catch { /* fall through */ }
    }
    return this.bundles.has(eventId) ? this.bundles.get(eventId) : undefined;
  }

  /** { uid, name, isOwner, canCreateEvents } for the signed-in user, else null. */
  async me() {
    if (this.role !== undefined) return this.role;
    try {
      this.role = await apiFetch("/api/vg-me", { auth: true });
    } catch {
      this.role = null;
    }
    return this.role;
  }

  forgetMe() {
    this.role = undefined;
  }

  // ---------- writes ----------

  async createEvent(input) {
    const data = await apiFetch("/api/vg-events", { method: "POST", body: input, auth: true });
    await this.refreshEvents().catch(() => {});
    return data.event;
  }

  async removeEvent(eventId) {
    await apiFetch(`/api/vg-events/${encodeURIComponent(eventId)}`, { method: "DELETE", auth: true });
    this.bundles.set(eventId, null);
    await this.refreshEvents().catch(() => {});
  }

  // `input` is what the worker validates: { igdbId, launcher, launcherLabel,
  // startTime, capacity, notes, crossplayNote }. Game details are re-fetched
  // from IGDB server-side, and identity comes from the token.
  async createSession(eventId, input) {
    const data = await apiFetch(`/api/vg-events/${encodeURIComponent(eventId)}/sessions`, { method: "POST", body: input, auth: true });
    await this.refreshEvent(eventId).catch(() => {});
    return data.session;
  }

  async join(eventId, sessionId) {
    const data = await apiFetch(`/api/vg-events/${encodeURIComponent(eventId)}/sessions/${encodeURIComponent(sessionId)}/join`, { method: "POST", auth: true });
    await this.refreshEvent(eventId).catch(() => {});
    return data;
  }

  async leave(eventId, sessionId) {
    const data = await apiFetch(`/api/vg-events/${encodeURIComponent(eventId)}/sessions/${encodeURIComponent(sessionId)}/leave`, { method: "POST", auth: true });
    await this.refreshEvent(eventId).catch(() => {});
    return data;
  }

  async removeSession(eventId, sessionId) {
    await apiFetch(`/api/vg-events/${encodeURIComponent(eventId)}/sessions/${encodeURIComponent(sessionId)}`, { method: "DELETE", auth: true });
    await this.refreshEvent(eventId).catch(() => {});
  }

  // ---------- subscriptions ----------

  subscribe(fn) {
    this.listeners.add(fn);
    if (!this.timer) {
      this.timer = setInterval(() => {
        if (document.visibilityState === "visible") this.refresh().catch(() => {});
      }, POLL_MS);
    }
    return () => {
      this.listeners.delete(fn);
      if (!this.listeners.size && this.timer) {
        clearInterval(this.timer);
        this.timer = null;
      }
    };
  }

  emit() {
    for (const fn of this.listeners) {
      try { fn(); } catch { /* one bad listener shouldn't break the rest */ }
    }
  }
}

export function createStore() {
  return new RemoteStore();
}
