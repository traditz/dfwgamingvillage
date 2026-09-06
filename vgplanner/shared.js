// PATH: site/shared.js
// Pure helpers: escaping, dates, ids. Mirrors planner/shared.js in the
// board-game planner so the two sites read the same.

import { TIME_ZONE } from "./app-config.js";

export function esc(s) {
  return String(s ?? "").replace(/[&<>"']/g, (m) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  }[m]));
}

// Accepts Dates, ISO strings, Firestore Timestamps ({toDate}) or {seconds}.
export function asDate(v) {
  if (!v) return null;
  if (v.toDate) return v.toDate();
  if (typeof v.seconds === "number") return new Date(v.seconds * 1000);
  const d = v instanceof Date ? v : new Date(v);
  return Number.isNaN(d.getTime()) ? null : d;
}

// "Sat, Jun 13, 2:00 PM" — Central time.
export function fmtDate(v) {
  const d = asDate(v);
  if (!d) return "Date TBD";
  return d.toLocaleString("en-US", {
    timeZone: TIME_ZONE,
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit"
  });
}

// "2:00 PM" — Central time.
export function fmtTime(v) {
  const d = asDate(v);
  if (!d) return "TBD";
  return d.toLocaleString("en-US", { timeZone: TIME_ZONE, hour: "numeric", minute: "2-digit" });
}

// "YYYY-MM-DD" in Central time, used to group sessions by day.
export function centralDateKey(v) {
  const d = asDate(v);
  if (!d) return "";
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: TIME_ZONE, year: "numeric", month: "2-digit", day: "2-digit"
  }).formatToParts(d);
  const get = (t) => parts.find((p) => p.type === t)?.value || "";
  return `${get("year")}-${get("month")}-${get("day")}`;
}

// "Saturday, June 13" for day headers.
export function fmtDayHeader(v) {
  const d = asDate(v);
  if (!d) return "Date TBD";
  return d.toLocaleString("en-US", { timeZone: TIME_ZONE, weekday: "long", month: "long", day: "numeric" });
}

// ---------- events ----------

// End of the given instant's calendar day in Central time. Central is UTC-5
// or UTC-6, so midnight of the next day is 05:00Z or 06:00Z; pick whichever
// lands on the right calendar day.
export function centralDayEnd(date) {
  const parts = new Intl.DateTimeFormat("en-US", { timeZone: TIME_ZONE, year: "numeric", month: "2-digit", day: "2-digit" }).formatToParts(date);
  const get = (t) => Number(parts.find((p) => p.type === t)?.value);
  const today = centralDateKey(date);
  for (const hourUtc of [5, 6]) {
    const candidate = Date.UTC(get("year"), get("month") - 1, get("day") + 1, hourUtc);
    if (centralDateKey(new Date(candidate - 1)) === today && centralDateKey(new Date(candidate)) !== today) {
      return new Date(candidate - 1);
    }
  }
  return new Date(date.getTime() + 24 * 3600 * 1000);
}

// When an event is over: its end time, or the end of its start day.
export function eventEnd(ev) {
  const end = asDate(ev?.endsAt);
  if (end) return end;
  const start = asDate(ev?.startsAt);
  return start ? centralDayEnd(start) : null;
}

export function isPastEvent(ev) {
  const end = eventEnd(ev);
  return end ? end.getTime() < Date.now() : false;
}

export function eventStarted(ev) {
  const start = asDate(ev?.startsAt);
  return start ? start.getTime() <= Date.now() : false;
}

// "Sat, Sep 5, 7:00 PM" · "Sat, Sep 5, 7:00 PM – 11:00 PM" · "Fri, Sep 4, 6:00 PM – Sun, Sep 6, 10:00 PM"
export function fmtEventWhen(ev) {
  const start = asDate(ev?.startsAt);
  const end = asDate(ev?.endsAt);
  if (!start) return "Date TBD";
  if (!end) return fmtDate(start);
  if (centralDateKey(start) === centralDateKey(end)) return `${fmtDate(start)} – ${fmtTime(end)}`;
  return `${fmtDate(start)} – ${fmtDate(end)}`;
}

// <input type="datetime-local"> works in the browser's local time.
export function toDatetimeLocalValue(date) {
  const p = (n) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${p(date.getMonth() + 1)}-${p(date.getDate())}T${p(date.getHours())}:${p(date.getMinutes())}`;
}

export function fromDatetimeLocalValue(value) {
  if (!value) return null;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
}

export function uid() {
  if (globalThis.crypto?.randomUUID) return crypto.randomUUID();
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

export function clamp(text, max) {
  const s = String(text ?? "");
  return s.length > max ? `${s.slice(0, max - 1).trimEnd()}…` : s;
}
