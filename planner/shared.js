// PATH: planner/shared.js
// Shared pure helpers for the planner surfaces (planner, events, admin).
// One implementation of escaping, date handling, and Central-time formatting —
// these previously existed as three diverged copies across app.js/event.js/admin.js.

export function esc(s) {
  return String(s ?? "").replace(/[&<>"']/g, (m) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  }[m]));
}

// Normalizes Firestore Timestamps ({toDate}), raw {seconds}/{_seconds} maps,
// Dates, and parseable strings to a Date (or null).
export function asDate(v) {
  if (!v) return null;
  if (v.toDate) return v.toDate();
  if (typeof v.seconds === "number") {
    return new Date((v.seconds * 1000) + Math.floor((v.nanoseconds || 0) / 1000000));
  }
  if (typeof v._seconds === "number") {
    return new Date((v._seconds * 1000) + Math.floor((v._nanoseconds || 0) / 1000000));
  }
  const d = v instanceof Date ? v : new Date(v);
  return Number.isNaN(d.getTime()) ? null : d;
}

// "Sat, Jun 13, 2026, 2:00 PM" — Central, no seconds. Accepts anything asDate does.
export function fmtDate(v) {
  const d = asDate(v);
  if (!d) return "Date TBD";
  return d.toLocaleString("en-US", {
    timeZone: "America/Chicago",
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit"
  });
}

// "2:00 PM" — Central time only, for same-day contexts like table cards.
export function fmtTime(v) {
  const d = asDate(v);
  if (!d) return "TBD";
  return d.toLocaleString("en-US", {
    timeZone: "America/Chicago",
    hour: "numeric",
    minute: "2-digit"
  });
}

// "YYYY-MM-DD" of the given instant in Central time.
export function centralDateKey(date) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Chicago",
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).formatToParts(date);
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return `${values.year}-${values.month}-${values.day}`;
}

// "HH:MM" (24h) of the given instant in Central time.
export function centralTimeHHMM(date) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Chicago",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false
  }).formatToParts(date);
  const v = Object.fromEntries(parts.map((p) => [p.type, p.value]));
  const hh = v.hour === "24" ? "00" : v.hour; // some engines emit 24 at midnight
  return `${hh}:${v.minute}`;
}

// datetime-local prefill value representing this instant's CENTRAL wall clock.
// Must be used for every datetime-local prefill, because parseDatetimeLocalToISO
// interprets the field as Central — prefilling with browser-local time shifts
// the stored instant for anyone outside Central.
export function fmtCentralDatetimeValue(v) {
  const d = asDate(v);
  if (!d) return "";
  return `${centralDateKey(d)}T${centralTimeHHMM(d)}`;
}

// Parse a datetime-local value as America/Chicago wall-clock time → ISO string.
// The offset is derived by reinterpreting the wall clock as UTC and asking
// Intl for Chicago's offset at that instant; exact for whole-hour zones except
// within a few hours of the 2 AM DST transition (acceptable for this app).
export function parseDatetimeLocalToISO(v) {
  if (!v) return null;
  const d = new Date(v);
  if (Number.isNaN(d.getTime())) return null;

  try {
    const isoAsUtc = v + "Z";
    const refDate = new Date(isoAsUtc);

    const parts = new Intl.DateTimeFormat("en-US", {
      timeZone: "America/Chicago",
      timeZoneName: "shortOffset"
    }).formatToParts(refDate);

    const offsetPart = parts.find((p) => p.type === "timeZoneName")?.value;
    if (!offsetPart) return new Date(v).toISOString();

    const offset = offsetPart.replace("GMT", "");
    const offsetNum = parseInt(offset);

    const absOffset = Math.abs(offsetNum);
    const sign = offsetNum >= 0 ? "+" : "-";
    const offsetStr = `${sign}${String(absOffset).padStart(2, "0")}:00`;

    return `${v}:00${offsetStr}`;
  } catch (e) {
    console.error("Timezone parse error", e);
    return new Date(v).toISOString();
  }
}

export function unwrapCallableError(e) {
  return e?.message || String(e);
}
