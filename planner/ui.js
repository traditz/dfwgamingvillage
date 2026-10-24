// PATH: planner/ui.js
// Shared building blocks of the planner design (Direction D; see DESIGN.md)
// for the Planner, Events and Admin pages: the icon set, avatars, date
// pieces, the seat meter, box art and empty states. No Firebase and no page
// state, so any page can import it.

const escHtml = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

// Stroke icon set, referenced as <use href="#i-name"> (static markup too).
export const ICONS = {
  cal: '<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',
  pin: '<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0116 0z"/><circle cx="12" cy="10" r="3"/>',
  user: '<path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/>',
  users: '<path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/>',
  lock: '<rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/>',
  link: '<path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/>',
  clip: '<path d="M16 4h2a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h2"/><rect x="8" y="2" width="8" height="4" rx="1"/>',
  bell: '<path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  left: '<path d="M15 18l-6-6 6-6"/>',
  right: '<path d="M9 18l6-6-6-6"/>',
  down: '<path d="M6 9l6 6 6-6"/>',
  pencil: '<path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 013 3L7 19l-4 1 1-4z"/>',
  trash: '<path d="M3 6h18M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6M10 11v6M14 11v6M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2"/>',
  ext: '<path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3"/>',
  check: '<path d="M20 6L9 17l-5-5"/>',
  clock: '<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',
  dice: '<rect x="3" y="3" width="18" height="18" rx="3"/><circle cx="8.5" cy="8.5" r="1.25" fill="currentColor" stroke="none"/><circle cx="15.5" cy="8.5" r="1.25" fill="currentColor" stroke="none"/><circle cx="12" cy="12" r="1.25" fill="currentColor" stroke="none"/><circle cx="8.5" cy="15.5" r="1.25" fill="currentColor" stroke="none"/><circle cx="15.5" cy="15.5" r="1.25" fill="currentColor" stroke="none"/>',
  book: '<path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/>',
  hand: '<path d="M18 11V6a2 2 0 00-4 0v5"/><path d="M14 10V4a2 2 0 00-4 0v6"/><path d="M10 10.5V6a2 2 0 00-4 0v8"/><path d="M18 8a2 2 0 014 0v6a8 8 0 01-8 8h-2a8 8 0 01-8-8v-1"/>',
  more: '<circle cx="12" cy="12" r="1.3" fill="currentColor" stroke="none"/><circle cx="19" cy="12" r="1.3" fill="currentColor" stroke="none"/><circle cx="5" cy="12" r="1.3" fill="currentColor" stroke="none"/>',
  shield: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>',
  x: '<path d="M18 6L6 18M6 6l12 12"/>',
  rotate: '<path d="M21 2v6h-6"/><path d="M3 12a9 9 0 0115-6.7L21 8"/><path d="M3 22v-6h6"/><path d="M21 12a9 9 0 01-15 6.7L3 16"/>',
  share: '<circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="M8.59 13.51l6.83 3.98M15.41 6.51l-6.82 3.98"/>',
  logout: '<path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"/>',
  login: '<path d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4M10 17l5-5-5-5M15 12H3"/>',
  star: '<path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>',
  history: '<path d="M3 3v5h5"/><path d="M3.05 13A9 9 0 106 5.3L3 8"/><path d="M12 7v5l4 2"/>',
  copy: '<rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/>',
  refresh: '<path d="M23 4v6h-6"/><path d="M20.49 15a9 9 0 11-2.12-9.36L23 10"/>',
  activity: '<path d="M22 12h-4l-3 9L9 3l-3 9H2"/>',
  alert: '<circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/>',
  discord: '<path d="M8 12h.01M16 12h.01"/><path d="M7.5 7.5c3-1.5 6-1.5 9 0M7 16.5c3.3 1.7 6.7 1.7 10 0"/><path d="M17 6l2 2c1.6 3 2.2 6.3 2 10-1.6 1.3-3.3 2-5 2l-1-2M7 6L5 8c-1.6 3-2.2 6.3-2 10 1.6 1.3 3.3 2 5 2l1-2"/>',
  gamepad: '<path d="M6 11h4M8 9v4M15.5 11h.01M18 13h.01"/><rect x="2" y="6" width="20" height="12" rx="5"/>'
};

// The sprite goes in once per page; module scripts run after the document
// has parsed, so <use> references in static markup resolve as soon as it lands.
if (!document.getElementById("dIcons")) {
  document.body.insertAdjacentHTML("afterbegin",
    '<svg id="dIcons" width="0" height="0" style="position:absolute" aria-hidden="true" focusable="false">' +
    Object.keys(ICONS).map((k) => `<symbol id="i-${k}" viewBox="0 0 24 24">${ICONS[k]}</symbol>`).join("") + "</svg>");
}

export const ic = (name, cls) => `<svg class="ico${cls ? " " + cls : ""}" aria-hidden="true"><use href="#i-${name}"/></svg>`;

// -----------------------------
// Avatars
// -----------------------------
export function initials(name) {
  const parts = String(name || "").replace(/[^\p{L}\p{N} ]/gu, " ").trim().split(/\s+/);
  return (((parts[0] || "")[0] || "") + ((parts[1] || "")[0] || "")).toUpperCase() || "?";
}

export function nameHue(name) {
  let h = 11;
  const s = String(name || "");
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) % 360;
  return h;
}

export function avatarHtml(name, cls = "", isMe = false) {
  return `<span class="av${cls ? " " + cls : ""}${isMe ? " me" : ""}" style="--h:${nameHue(name)}" aria-hidden="true">${escHtml(initials(name))}</span>`;
}

// -----------------------------
// Dates and times
// -----------------------------
// Date pieces for a Central day key ("2026-11-06"). Noon UTC keeps the
// calendar date stable in every viewer's timezone.
export function keyParts(key) {
  const d = new Date(`${key}T12:00:00Z`);
  const f = (o) => d.toLocaleDateString("en-US", { timeZone: "UTC", ...o });
  return {
    day: String(Number(String(key).slice(8, 10))),
    mon: f({ month: "short" }),
    dow: f({ weekday: "short" }),
    label: f({ weekday: "short", month: "short", day: "numeric" }),
    long: f({ weekday: "long", month: "long", day: "numeric" })
  };
}

// The big date block on tickets and event cards: "7 NOV" or "6–8 NOV".
export function dateBlockHtml(days, cls = "tkDate") {
  const f = days.length ? keyParts(days[0]) : null;
  const l = days.length ? keyParts(days[days.length - 1]) : null;
  const multi = days.length > 1;
  const day = !f ? "?" : multi ? `${f.day}–${l.day}` : f.day;
  const mon = !f ? "TBD" : f.mon === l.mon ? f.mon : `${f.mon}–${l.mon}`;
  return `<span class="${cls}${multi ? " is-multi" : ""}"><span class="d">${day}</span><span class="m">${escHtml(mon)}</span></span>`;
}

// "2:00 PM" -> { hm: "2:00", ap: "PM" } for the slot headings.
export function splitTimeLabel(label) {
  const s = String(label);
  const i = s.lastIndexOf(" ");
  return i > 0 ? { hm: s.slice(0, i), ap: s.slice(i + 1) } : { hm: s, ap: "" };
}

export function slotHeadHtml(label, count) {
  const tm = splitTimeLabel(label);
  return `<div class="slotHead" aria-hidden="true"><span class="hm">${escHtml(tm.hm)}</span><span class="ap">${escHtml(tm.ap)}</span>${count > 1 ? `<span class="cnt">${count} tables</span>` : ""}<span class="rule"></span></div>`;
}

// -----------------------------
// Tables
// -----------------------------
// One dot per chair (green = confirmed, gold = waiting); a bar past 12 seats.
export function seatMeterHtml({ confirmed = 0, waitlist = 0, cap = 0, custom = false } = {}) {
  const unit = custom ? "spots" : "seats";
  const text = `${confirmed}/${cap || "?"} ${unit}` + (waitlist ? ` · <span class="w">${waitlist} waiting</span>` : "");
  let vis = "";
  if (cap > 0 && cap <= 12) {
    let h = "";
    const filled = Math.min(confirmed, cap);
    for (let i = 0; i < cap; i++) h += `<i class="${i < filled ? "on" : ""}"></i>`;
    if (waitlist) {
      h += '<b class="gap"></b>';
      for (let i = 0; i < Math.min(waitlist, 4); i++) h += '<i class="wait"></i>';
    }
    vis = `<span class="pips" aria-hidden="true">${h}</span>`;
  } else if (cap > 0) {
    vis = `<span class="seatBar" aria-hidden="true"><i style="width:${Math.min(100, Math.round((confirmed / cap) * 100))}%"></i></span>`;
  }
  return `${vis}<span class="seatTxt">${text}</span>`;
}

// BGG thumbnails are small (about 200px), so the art sits at its own size
// over a blurred copy of itself instead of being stretched and going soft.
export function artHtml(thumbUrl, { custom = false, signupSrc = "./signup-sheet.png" } = {}) {
  if (thumbUrl) {
    const u = escHtml(encodeURI(String(thumbUrl)));
    return `<span class="tArtBg" style="background-image:url(&quot;${u}&quot;)"></span><img class="tArtImg" src="${escHtml(thumbUrl)}" alt="" loading="lazy" />`;
  }
  if (custom) return `<img class="tArtImg" src="${escHtml(signupSrc)}" alt="" loading="lazy" />`;
  return `<span class="ph">${ic("dice")}</span>`;
}

export const emptyHtml = (icon, title, body, action = "") =>
  `<div class="dEmpty"><span class="eico">${ic(icon, "ico-lg")}</span><b>${escHtml(title)}</b><span>${escHtml(body)}</span>${action}</div>`;
