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

// ---- Multi-day events -------------------------------------------------
// An event spans the Central days from startsAt to endsAt (inclusive).
// Single-day events simply have no endsAt.

// "YYYY-MM-DD" -> Date at midday UTC (safely inside that Central day).
export function dayKeyToDate(dayKey) {
  return new Date(`${dayKey}T12:00:00Z`);
}

// "Sat, Aug 22" for a day key.
export function fmtDayLabel(dayKey) {
  return dayKeyToDate(dayKey).toLocaleDateString("en-US", {
    timeZone: "America/Chicago",
    weekday: "short",
    month: "short",
    day: "numeric"
  });
}

// Every Central day the event covers, in order.
export function eventDayKeys(startsAt, endsAt) {
  const start = asDate(startsAt);
  if (!start) return [];
  const first = centralDateKey(start);
  const end = asDate(endsAt);
  if (!end) return [first];
  const last = centralDateKey(end);
  if (last <= first) return [first];

  const days = [];
  let cursor = dayKeyToDate(first);
  for (let i = 0; i < 60; i++) { // sane cap
    const key = centralDateKey(cursor);
    days.push(key);
    if (key >= last) break;
    cursor = new Date(cursor.getTime() + 24 * 60 * 60 * 1000);
  }
  return days;
}

// "Fri, Aug 21, 2026, 2:00 PM" or "Fri, Aug 21 – Sun, Aug 23, 2026" for a span.
export function fmtEventWhen(startsAt, endsAt) {
  const start = asDate(startsAt);
  if (!start) return "Date TBD";
  const days = eventDayKeys(startsAt, endsAt);
  if (days.length <= 1) return fmtDate(start);
  const year = start.toLocaleDateString("en-US", { timeZone: "America/Chicago", year: "numeric" });
  return `${fmtDayLabel(days[0])} – ${fmtDayLabel(days[days.length - 1])}, ${year}`;
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

// ============================================================================
// Modal controller
// ----------------------------------------------------------------------------
// One #modal element per page (planner + admin markup; events has none — the
// confirm falls back to window.confirm there). Every user-initiated dismissal
// path (Close button, Escape, backdrop click) runs the opener's onDismiss so
// promise-returning modals always settle; programmatic closeModal() does not.
// ============================================================================

let modalEl = null;
let modalTitleEl = null;
let modalBodyEl = null;
let modalCloseBtn = null;
let modalWired = false;
let onDismiss = null;
let lastFocus = null;

function bindModal() {
  if (modalWired) return !!modalEl;
  modalWired = true;
  modalEl = document.querySelector("#modal");
  modalTitleEl = document.querySelector("#modalTitle");
  modalBodyEl = document.querySelector("#modalBody");
  modalCloseBtn = document.querySelector("#btnModalClose");
  if (!modalEl || !modalTitleEl || !modalBodyEl) {
    modalEl = null;
    return false;
  }
  modalCloseBtn?.addEventListener("click", dismissModal);
  modalEl.addEventListener("click", (e) => {
    if (e.target === modalEl) dismissModal();
  });
  document.addEventListener("keydown", (e) => {
    if (!modalEl || modalEl.style.display === "none") return;
    if (e.key === "Escape") {
      dismissModal();
      return;
    }
    // Focus trap: Tab cycles within the dialog.
    if (e.key === "Tab") {
      const focusables = Array.from(
        modalEl.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])')
      ).filter((f) => !f.disabled && f.offsetParent !== null);
      if (!focusables.length) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  });
  return true;
}

// While a dialog is open, the page behind it is inert for keyboard and
// assistive tech. (No-op on engines without `inert`.)
function setBackgroundInert(on) {
  document.querySelectorAll("body > main, body > header").forEach((el) => {
    try { el.inert = on; } catch {}
  });
}

export function qs(sel) {
  return modalBodyEl ? modalBodyEl.querySelector(sel) : null;
}

export function openModal(title, html, opts = {}) {
  if (!bindModal()) return;
  // Opening over an existing modal settles the old flow as cancelled first.
  if (onDismiss) {
    const fn = onDismiss;
    onDismiss = null;
    try { fn(); } catch {}
  }
  onDismiss = opts.onDismiss || null;
  lastFocus = document.activeElement;
  modalTitleEl.textContent = title;
  modalBodyEl.innerHTML = html;
  modalEl.style.display = "";
  document.body.style.overflow = "hidden";
  setBackgroundInert(true);
  // Initial focus: explicit [data-autofocus], else the first input, else Close.
  const auto = modalBodyEl.querySelector("[data-autofocus]")
    || modalBodyEl.querySelector("input, select, textarea");
  (auto || modalCloseBtn)?.focus();
}

// Programmatic close (success paths) — does NOT fire onDismiss.
export function closeModal() {
  if (!modalEl || modalEl.style.display === "none") return;
  onDismiss = null;
  modalEl.style.display = "none";
  modalTitleEl.textContent = "Modal";
  modalBodyEl.innerHTML = "";
  document.body.style.overflow = "";
  setBackgroundInert(false);
  if (lastFocus && lastFocus.isConnected) {
    try { lastFocus.focus(); } catch {}
  }
  lastFocus = null;
}

// User-initiated dismissal — settles the opener's pending flow.
export function dismissModal() {
  if (!modalEl || modalEl.style.display === "none") return;
  const fn = onDismiss;
  onDismiss = null;
  closeModal();
  if (fn) {
    try { fn(); } catch {}
  }
}

export function showInlineError(msg) {
  const el = qs("#modalError");
  if (!el) return;
  el.setAttribute("role", "alert");
  el.textContent = msg ? String(msg) : "";
  el.style.display = msg ? "" : "none";
}

export function showInlineStatus(msg) {
  const el = qs("#modalStatus");
  if (!el) return;
  el.setAttribute("role", "status");
  el.textContent = msg ? String(msg) : "";
  el.style.display = msg ? "" : "none";
}

export function confirmDialog({ title = "Please confirm", message = "", confirmLabel = "Confirm", danger = false } = {}) {
  if (!bindModal()) {
    // Page without #modal markup: degrade to the native dialog.
    return Promise.resolve(window.confirm(message || title));
  }
  return new Promise((resolve) => {
    let settled = false;
    const finish = (val) => {
      if (settled) return;
      settled = true;
      closeModal();
      resolve(val);
    };
    openModal(title, `
      <div class="modalStack">
        <div class="muted" style="white-space:pre-wrap;">${esc(message)}</div>
        <div class="modalActions">
          <button class="btn" id="btnConfirmCancel">Cancel</button>
          <button class="btn ${danger ? "btn-danger" : "btn-primary"}" id="btnConfirmOk">${esc(confirmLabel)}</button>
        </div>
      </div>
    `, { onDismiss: () => finish(false) });
    qs("#btnConfirmCancel")?.addEventListener("click", () => finish(false));
    qs("#btnConfirmOk")?.addEventListener("click", () => finish(true));
  });
}

// ============================================================================
// Toasts — capped, deduped, announced
// ============================================================================

let toastHost = null;
const MAX_TOASTS = 3;

function ensureToastHost() {
  if (toastHost) return toastHost;
  toastHost = document.createElement("div");
  toastHost.className = "toastHost";
  // The live region must exist BEFORE content lands in it to announce reliably.
  toastHost.setAttribute("aria-live", "polite");
  document.body.appendChild(toastHost);
  return toastHost;
}

function removeToast(el) {
  el.classList.remove("is-shown");
  setTimeout(() => el.remove(), 200);
}

export function toast(message, kind = "info", timeout = 4000) {
  const host = ensureToastHost();
  const text = String(message ?? "");

  // Dedupe: an identical visible toast just restarts its timer.
  for (const existing of host.children) {
    if (existing.dataset.kind === kind && existing.textContent === text) {
      clearTimeout(existing._timer);
      if (timeout > 0) existing._timer = setTimeout(() => removeToast(existing), timeout);
      return () => removeToast(existing);
    }
  }

  // Cap the stack so errors can't bury the page on a phone.
  while (host.children.length >= MAX_TOASTS) {
    host.firstElementChild.remove();
  }

  const el = document.createElement("div");
  el.className = `toast toast-${kind}`;
  el.dataset.kind = kind;
  el.setAttribute("role", kind === "error" ? "alert" : "status");
  el.tabIndex = 0;
  el.textContent = text;
  host.appendChild(el);
  requestAnimationFrame(() => el.classList.add("is-shown"));
  if (timeout > 0) el._timer = setTimeout(() => removeToast(el), timeout);
  el.addEventListener("click", () => removeToast(el));
  el.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " " || e.key === "Escape") {
      e.preventDefault();
      removeToast(el);
    }
  });
  return () => removeToast(el);
}

// Create the live region at load so even the first toast announces.
if (typeof document !== "undefined" && document.body) {
  ensureToastHost();
}
