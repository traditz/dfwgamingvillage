// PATH: site/admin/admin.js
// Owner dashboard: create and edit video game events, and get the exact
// /vg_bind command for a Discord channel. Access is decided server-side by
// /api/vg-me (owner = your Discord id or your Google email); the page only
// hides itself for everyone else.

import { esc, asDate, fmtEventWhen, isPastEvent, toDatetimeLocalValue, fromDatetimeLocalValue } from "../shared.js";
import { apiFetch } from "../api.js";
import { onUser, signInWithDiscord, signInWithGoogle, signOutUser, handleDiscordRedirect } from "../auth.js";
import { BASE_PATH, IS_LOCAL } from "../app-config.js";

const qs = (sel, root = document) => root.querySelector(sel);

// Where the public planner lives, for "Public page" links.
const PUBLIC_BASE = IS_LOCAL ? "/" : BASE_PATH;

let me = null;
let role = null;
let events = [];
let bindings = [];
let selectedId = null; // null = "new event" form

// ---------- status ----------

function showPageStatus(text, ms = 0) {
  const el = qs("#pageStatus");
  el.textContent = text;
  el.hidden = !text;
  if (text && ms) setTimeout(() => { if (el.textContent === text) el.hidden = true; }, ms);
}

function setFormStatus(text, isError = false) {
  const s = qs("#formStatus");
  const e = qs("#formError");
  s.hidden = isError || !text;
  e.hidden = !isError || !text;
  (isError ? e : s).textContent = text;
}

// ---------- access ----------

function showBlocked(text, offerSignIn) {
  qs("#blockedState").hidden = false;
  qs("#adminApp").hidden = true;
  qs("#blockedText").textContent = text;
  qs("#blockedActions").hidden = !offerSignIn;
}

async function applyAccess() {
  const status = qs("#authStatus");
  qs("#btnSignIn").hidden = Boolean(me);
  qs("#btnSignOut").hidden = !me;

  if (!me) {
    status.textContent = "Not signed in";
    showBlocked("Sign in with the owner account to manage video game events.", true);
    return;
  }

  status.textContent = `Signed in as ${me.name}`;
  try {
    role = await apiFetch("/api/vg-me", { auth: true });
  } catch (e) {
    showBlocked(`Couldn't verify your access: ${e.message}`, false);
    return;
  }
  if (!role.isOwner) {
    showBlocked("This dashboard is for the site owner only. You're signed in, but not as the owner account.", false);
    return;
  }

  status.textContent = `Signed in as ${me.name} · owner`;
  qs("#blockedState").hidden = true;
  qs("#adminApp").hidden = false;
  await reload();
}

// ---------- data ----------

async function reload() {
  try {
    const since = new Date(Date.now() - 365 * 24 * 3600 * 1000).toISOString();
    const [ev, b] = await Promise.all([
      apiFetch(`/api/vg-events?since=${encodeURIComponent(since)}`),
      apiFetch("/api/vg-admin/bindings", { auth: true })
    ]);
    events = Array.isArray(ev.events) ? ev.events : [];
    bindings = Array.isArray(b.bindings) ? b.bindings : [];
    showPageStatus("");
  } catch (e) {
    showPageStatus(e.message);
  }
  if (selectedId && !events.some((x) => x.id === selectedId)) selectedId = null;
  renderRows();
  renderDetail();
  renderAllBindings();
}

function bindingsFor(eventId) {
  return bindings.filter((b) => b.eventId === eventId);
}

// ---------- events list ----------

function renderRows() {
  const root = qs("#eventRows");
  const upcoming = events.filter((ev) => !isPastEvent(ev));
  const past = events.filter(isPastEvent).reverse();
  const row = (ev) => `
    <button type="button" class="adminRow${ev.id === selectedId ? " is-selected" : ""}${isPastEvent(ev) ? " is-past" : ""}" data-id="${esc(ev.id)}">
      <div class="adminRowTitle">${esc(ev.title)}${bindingsFor(ev.id).length ? `<span class="adminRowBadge">${bindingsFor(ev.id).length} Discord</span>` : ""}</div>
      <div class="adminRowMeta">${esc(fmtEventWhen(ev))}${ev.location ? ` · ${esc(ev.location)}` : ""}</div>
    </button>`;
  root.innerHTML = [...upcoming, ...past].map(row).join("") || `<div class="bindingEmpty">No events yet. Create the first one on the right.</div>`;
}

// ---------- detail form ----------

function fillForm(ev) {
  qs("#eventId").value = ev?.id || "";
  qs("#evTitle").value = ev?.title || "";
  const start = ev ? asDate(ev.startsAt) : (() => { const d = new Date(Date.now() + 24 * 3600 * 1000); d.setMinutes(0, 0, 0); return d; })();
  qs("#evStart").value = start ? toDatetimeLocalValue(start) : "";
  const end = ev ? asDate(ev.endsAt) : null;
  qs("#evEnd").value = end ? toDatetimeLocalValue(end) : "";
  qs("#evLocation").value = ev ? (ev.location || "") : "Online · DFWGV Discord voice";
  qs("#evNotes").value = ev?.notes || "";
}

function renderDetail() {
  const ev = selectedId ? events.find((x) => x.id === selectedId) : null;
  qs("#detailTitle").textContent = ev ? "Edit event" : "New event";
  qs("#btnSave").textContent = ev ? "Save changes" : "Create event";
  qs("#btnDeleteEvent").hidden = !ev;
  qs("#publicLink").href = ev ? `${PUBLIC_BASE}?event=${encodeURIComponent(ev.id)}` : PUBLIC_BASE;
  setFormStatus("");
  fillForm(ev);

  const block = qs("#discordBlock");
  block.hidden = !ev;
  if (!ev) return;

  qs("#bindCommand").textContent = `/vg_bind event:${ev.id}`;
  const list = bindingsFor(ev.id);
  qs("#eventBindings").innerHTML = list.length
    ? list.map(bindingRowHtml).join("")
    : `<div class="bindingEmpty">Not shown in any Discord channel yet.</div>`;
}

function bindingRowHtml(b, { showEvent = false } = {}) {
  const ev = events.find((x) => x.id === b.eventId);
  const orphan = showEvent && !ev;
  return `
    <div class="bindingRow${orphan ? " is-orphan" : ""}" data-channel="${esc(b.id)}">
      <div>
        <strong>#${esc(b.channelName || b.channelId || b.id)}</strong>
        <span class="muted"> · ${esc(b.guildName || "Discord")}</span>
        ${showEvent ? `<div class="muted">${orphan ? `⚠️ event ${esc(b.eventId || "?")} no longer exists` : `→ ${esc(ev.title)}`}</div>` : ""}
        ${b.messageId ? "" : `<div class="muted">Board message not posted yet</div>`}
      </div>
      <div class="cardActions">
        <button type="button" class="btn btn-small btn-danger" data-forget="${esc(b.id)}">Forget binding</button>
      </div>
    </div>`;
}

function renderAllBindings() {
  const root = qs("#allBindings");
  root.innerHTML = bindings.length
    ? bindings.map((b) => bindingRowHtml(b, { showEvent: true })).join("")
    : `<div class="bindingEmpty">The bot isn't keeping a video game board anywhere yet. Create an event, then run its /vg_bind command in a channel.</div>`;
}

// ---------- actions ----------

async function saveEvent(e) {
  e.preventDefault();
  const title = qs("#evTitle").value.trim();
  if (title.length < 3) { setFormStatus("Give the event a title.", true); return; }
  const startsAt = fromDatetimeLocalValue(qs("#evStart").value);
  if (!startsAt) { setFormStatus("Pick a start time.", true); return; }
  const endsAt = fromDatetimeLocalValue(qs("#evEnd").value);
  if (endsAt && endsAt < startsAt) { setFormStatus("The event can't end before it starts.", true); return; }

  const body = {
    title,
    startsAt: startsAt.toISOString(),
    endsAt: endsAt ? endsAt.toISOString() : null,
    location: qs("#evLocation").value.trim(),
    notes: qs("#evNotes").value.trim()
  };

  setFormStatus(selectedId ? "Saving…" : "Creating…");
  try {
    if (selectedId) {
      await apiFetch(`/api/vg-events/${encodeURIComponent(selectedId)}`, { method: "PATCH", body, auth: true });
    } else {
      const data = await apiFetch("/api/vg-events", { method: "POST", body, auth: true });
      selectedId = data.event.id;
    }
    await reload();
    setFormStatus("Saved.");
    setTimeout(() => setFormStatus(""), 3000);
  } catch (err) {
    setFormStatus(err.message, true);
  }
}

async function deleteEvent() {
  const ev = events.find((x) => x.id === selectedId);
  if (!ev) return;
  if (!window.confirm(`Delete "${ev.title}" and every session in it? Discord boards for it will show "event removed".`)) return;
  try {
    await apiFetch(`/api/vg-events/${encodeURIComponent(ev.id)}`, { method: "DELETE", auth: true });
    selectedId = null;
    await reload();
  } catch (err) {
    setFormStatus(err.message, true);
  }
}

async function forgetBinding(channelId) {
  const b = bindings.find((x) => x.id === channelId);
  const label = b ? `#${b.channelName || channelId}` : channelId;
  if (!window.confirm(`Forget the binding for ${label}? The bot stops updating that board; the pinned message stays until you run /vg_unbind there.`)) return;
  try {
    await apiFetch(`/api/vg-admin/bindings/${encodeURIComponent(channelId)}`, { method: "DELETE", auth: true });
    await reload();
  } catch (err) {
    showPageStatus(err.message, 6000);
  }
}

async function copyBindCommand() {
  const text = qs("#bindCommand").textContent;
  const btn = qs("#btnCopyBind");
  try {
    await navigator.clipboard.writeText(text);
    btn.textContent = "Copied";
  } catch {
    // Clipboard API can be unavailable (http, permissions); select the text so Ctrl+C works.
    const range = document.createRange();
    range.selectNodeContents(qs("#bindCommand"));
    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
    btn.textContent = "Select + Ctrl+C";
  }
  setTimeout(() => { btn.textContent = "Copy"; }, 2000);
}

// ---------- boot ----------

qs("#eventRows").addEventListener("click", (e) => {
  const row = e.target.closest("[data-id]");
  if (!row) return;
  selectedId = row.dataset.id;
  renderRows();
  renderDetail();
});
qs("#btnNewEvent").addEventListener("click", () => { selectedId = null; renderRows(); renderDetail(); qs("#evTitle").focus(); });
qs("#eventForm").addEventListener("submit", saveEvent);
qs("#btnDeleteEvent").addEventListener("click", deleteEvent);
qs("#btnCopyBind").addEventListener("click", copyBindCommand);
qs("#btnReload").addEventListener("click", reload);
document.addEventListener("click", (e) => {
  const b = e.target.closest("[data-forget]");
  if (b) forgetBinding(b.dataset.forget);
});

const signInDiscord = () => signInWithDiscord().catch((e) => showPageStatus(e.message, 6000));
const signInGoogle = () => signInWithGoogle().catch((e) => {
  if (e?.code !== "auth/popup-closed-by-user" && e?.code !== "auth/cancelled-popup-request") showPageStatus(`Google sign-in failed: ${e.message}`, 6000);
});
qs("#btnSignIn").addEventListener("click", signInGoogle);
qs("#btnBlockedDiscord").addEventListener("click", signInDiscord);
qs("#btnBlockedGoogle").addEventListener("click", signInGoogle);
qs("#btnSignOut").addEventListener("click", () => signOutUser().catch((e) => showPageStatus(e.message, 6000)));

onUser((identity) => {
  me = identity;
  role = null;
  applyAccess();
});

handleDiscordRedirect().then((r) => {
  if (r.handled && !r.ok) showPageStatus(r.error, 10000);
});
