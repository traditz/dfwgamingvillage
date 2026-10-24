// PATH: site/app.js
// Two views, like the board-game planner: the events list, and one event with
// the games hosted inside it. Organizers create events; anyone signed in can
// host a game in one and claim slots. Data comes from store.js, game details
// from igdb.js, identity from auth.js (shared with the board-game planner).

import { esc, fmtDate, fmtTime, asDate, centralDateKey, fmtDayHeader, toDatetimeLocalValue, fromDatetimeLocalValue, eventEnd, isPastEvent, eventStarted, fmtEventWhen } from "./shared.js";
import { searchGames, getGame, health } from "./igdb.js";
import { LAUNCHERS, LAUNCHER_ORDER, launcherMeta, defaultLauncher, crossplayHint, badgeHtml } from "./launchers.js";
import { createStore } from "./store.js";
import { onUser, signInWithDiscord, signInWithGoogle, signOutUser, handleDiscordRedirect } from "./auth.js";
import { IGDB_PROXY_BASE } from "./app-config.js";
// Icons, avatars, date blocks and the seat meter are shared with the board-game planner.
import { ic, avatarHtml, dateBlockHtml, seatMeterHtml } from "/planner/ui.js?v=20261024-d2";

const qs = (sel, root = document) => root.querySelector(sel);
const qsa = (sel, root = document) => [...root.querySelectorAll(sel)];

const store = createStore();

// Current identity, or null when signed out. Set only by onUser().
let me = null;
// Server-side role for `me` ({ isOwner, canCreateEvents }) or null.
let role = null;

// ---------- routing ----------

function currentEventId() {
  return new URL(location.href).searchParams.get("event") || null;
}

function go(eventId, { replace = false } = {}) {
  const u = new URL(location.href);
  if (eventId) u.searchParams.set("event", eventId); else u.searchParams.delete("event");
  (replace ? history.replaceState : history.pushState).call(history, {}, "", u.toString());
  store.setView(eventId);
  render();
  window.scrollTo({ top: 0 });
}

window.addEventListener("popstate", () => { store.setView(currentEventId()); render(); });

// ---------- page-level status ----------

function showPageStatus(text, ms = 0) {
  const el = qs("#pageStatus");
  el.textContent = text;
  el.hidden = !text;
  if (text && ms) setTimeout(() => { if (el.textContent === text) el.hidden = true; }, ms);
}

// ---------- modal ----------

function openModal(title, bodyHtml) {
  const root = qs("#modalRoot");
  root.innerHTML = `
    <div class="modalOverlay" data-overlay>
      <div class="modal" role="dialog" aria-modal="true" aria-labelledby="modalTitle">
        <div class="modalHead">
          <h2 id="modalTitle">${esc(title)}</h2>
          <button type="button" class="btn btn-small btn-ghost btn-icon" data-close aria-label="Close">${ic("x")}</button>
        </div>
        <div class="modalBody" data-body>${bodyHtml}</div>
      </div>
    </div>`;
  const overlay = qs("[data-overlay]", root);
  const close = () => { root.innerHTML = ""; document.removeEventListener("keydown", onKey); };
  const onKey = (e) => { if (e.key === "Escape") close(); };
  overlay.addEventListener("click", (e) => { if (e.target === overlay) close(); });
  qs("[data-close]", root).addEventListener("click", close);
  document.addEventListener("keydown", onKey);
  return {
    el: overlay,
    close,
    setTitle(t) { qs("#modalTitle", root).textContent = t; },
    setBody(html) { qs("[data-body]", root).innerHTML = html; }
  };
}

function setModalStatus(m, text, isError = false) {
  const status = qs("#modalStatus", m.el);
  const error = qs("#modalError", m.el);
  if (!status || !error) return;
  status.hidden = isError || !text;
  error.hidden = !isError || !text;
  (isError ? error : status).textContent = text;
}

// ---------- sign in ----------

function openSignInModal(message) {
  const m = openModal("Sign in", `
    <div class="modalStack">
      <div class="muted">${esc(message || "Signing in lets hosts see who's coming. The same account works on the board game planner.")}</div>
      <div>
        <button type="button" class="btn btn-primary btnWide" id="btnDiscord">Sign in with Discord</button>
        <div class="hint muted">In our Discord server? Use this — your name carries over.</div>
      </div>
      <div>
        <button type="button" class="btn btnWide" id="btnGoogle">Sign in with Google</button>
        <div class="hint muted">No Discord? Any Google account works.</div>
      </div>
      <div class="modalStatus" id="modalStatus" hidden></div>
      <div class="modalError" id="modalError" hidden></div>
    </div>`);

  qs("#btnDiscord", m.el).addEventListener("click", () => {
    setModalStatus(m, "Redirecting to Discord…");
    signInWithDiscord().catch((e) => setModalStatus(m, e?.message || String(e), true));
  });

  qs("#btnGoogle", m.el).addEventListener("click", async () => {
    setModalStatus(m, "Opening Google…");
    try {
      await signInWithGoogle();
      m.close();
    } catch (e) {
      if (e?.code === "auth/popup-closed-by-user" || e?.code === "auth/cancelled-popup-request") {
        setModalStatus(m, "");
        return;
      }
      setModalStatus(m, `Google sign-in failed: ${e?.message || e}`, true);
    }
  });
  return m;
}

// Returns true when the caller should stop because nobody is signed in.
function requireSignIn(message) {
  if (me) return false;
  openSignInModal(message);
  return true;
}

function renderAuthBar() {
  const status = qs("#authStatus");
  const inBtn = qs("#btnSignIn");
  const outBtn = qs("#btnSignOut");
  qsa("[data-admin-link]").forEach((a) => { a.hidden = !role?.isOwner; });
  if (me) {
    const via = me.provider === "discord" ? "Discord" : me.provider === "google" ? "Google" : "";
    const tag = role?.isOwner ? " · owner" : "";
    status.textContent = `Signed in as ${me.name}${via ? ` · ${via}` : ""}${tag}`;
    inBtn.hidden = true;
    outBtn.hidden = false;
  } else {
    status.textContent = "Not signed in";
    inBtn.hidden = false;
    outBtn.hidden = true;
  }
}

// ---------- API health ----------

async function checkProxy() {
  const pill = qs("#proxyStatus");
  try {
    const h = await health();
    if (h.igdb && h.firestore) {
      pill.textContent = "API connected";
      pill.className = "statusPill is-ok";
      pill.title = `IGDB and the planner store are reachable (${IGDB_PROXY_BASE})`;
    } else if (h.igdb) {
      pill.textContent = "IGDB ok · planner store off";
      pill.className = "statusPill is-bad";
      pill.title = h.firestoreError || "The worker has no Firebase service account configured.";
    } else {
      pill.textContent = "IGDB unavailable";
      pill.className = "statusPill is-bad";
      pill.title = h.igdbError || "";
    }
  } catch (e) {
    pill.textContent = "API offline";
    pill.className = "statusPill is-bad";
    pill.title = `${e.message} (${IGDB_PROXY_BASE})`;
  }
}

// ---------- create event ----------

function openCreateEventModal() {
  const start = new Date(Date.now() + 24 * 3600 * 1000);
  start.setMinutes(0, 0, 0);
  const m = openModal("Create event", `
    <div class="modalStack">
      <label class="field">
        <div class="label">Title</div>
        <input id="evTitle" class="input" type="text" maxlength="80" placeholder="e.g. Friday PC Game Night" />
      </label>
      <div class="modalGrid">
        <label class="field">
          <div class="label">Starts</div>
          <input id="evStart" class="input" type="datetime-local" value="${esc(toDatetimeLocalValue(start))}" />
          <div class="hint muted">Central time.</div>
        </label>
        <label class="field">
          <div class="label">Ends (optional)</div>
          <input id="evEnd" class="input" type="datetime-local" />
          <div class="hint muted">Leave blank for a single evening.</div>
        </label>
        <label class="field fieldSpan2">
          <div class="label">Where</div>
          <input id="evLocation" class="input" type="text" maxlength="80" value="Online · DFWGV Discord voice" />
        </label>
        <label class="field fieldSpan2">
          <div class="label">Notes (optional)</div>
          <textarea id="evNotes" class="textarea" rows="3" maxlength="600" placeholder="Theme, voice channel, what to have installed…"></textarea>
        </label>
      </div>
      <div class="modalStatus" id="modalStatus" hidden></div>
      <div class="modalError" id="modalError" hidden></div>
      <div class="modalFoot">
        <span></span>
        <button type="button" class="btn btn-primary" id="btnCreateEventSubmit">Create event</button>
      </div>
    </div>`);
  qs("#evTitle", m.el).focus();

  qs("#btnCreateEventSubmit", m.el).addEventListener("click", async () => {
    const title = qs("#evTitle", m.el).value.trim();
    if (title.length < 3) { setModalStatus(m, "Give the event a title.", true); return; }
    const startsAt = fromDatetimeLocalValue(qs("#evStart", m.el).value);
    if (!startsAt) { setModalStatus(m, "Pick a start time.", true); return; }
    const endsAt = fromDatetimeLocalValue(qs("#evEnd", m.el).value);
    if (endsAt && endsAt < startsAt) { setModalStatus(m, "The event can't end before it starts.", true); return; }

    setModalStatus(m, "Creating event…");
    try {
      const ev = await store.createEvent({
        title,
        startsAt: startsAt.toISOString(),
        endsAt: endsAt ? endsAt.toISOString() : null,
        location: qs("#evLocation", m.el).value.trim(),
        notes: qs("#evNotes", m.el).value.trim()
      });
      m.close();
      go(ev.id);
    } catch (e) {
      setModalStatus(m, e.message, true);
    }
  });
}

// ---------- host flow: search ----------

function searchStepHtml(initialQuery = "") {
  return `
    <form class="searchRow" id="searchForm">
      <input id="gameSearch" class="input" type="search" placeholder="Search IGDB for a PC game (e.g. Diablo, Halo, Helldivers)…" value="${esc(initialQuery)}" autocomplete="off" />
      <button type="submit" class="btn btn-primary" id="btnSearch">Search</button>
    </form>
    <div class="hint muted">Results are limited to games released on PC. Editions and DLC are folded into the base game.</div>
    <div class="modalStatus" id="modalStatus" hidden></div>
    <div class="modalError" id="modalError" hidden></div>
    <div class="results" id="results"></div>`;
}

function resultRowHtml(hit) {
  const dots = LAUNCHER_ORDER.filter((k) => k !== "other" && hit.launchers?.[k])
    .map((k) => `<span class="miniDot is-${k}" title="${esc(launcherMeta(k).label)}"></span>`).join("");
  const meta = [hit.year, hit.publishers?.[0], hit.platforms?.length ? hit.platforms.slice(0, 5).join(" · ") : ""]
    .filter(Boolean).join(" • ");
  return `
    <button type="button" class="resultRow" data-igdb-id="${esc(hit.igdbId)}" aria-label="${esc(hit.name)}${hit.year ? ` (${esc(hit.year)})` : ""}">
      ${hit.thumbUrl ? `<img src="${esc(hit.thumbUrl)}" alt="" loading="lazy" />` : `<div class="thumbph">${ic("gamepad")}</div>`}
      <span>
        <span class="resultName">${esc(hit.name)}</span>
        <span class="resultMeta">${esc(meta)}</span>
      </span>
      <span class="resultLaunchers" aria-label="Detected launchers">${dots}</span>
    </button>`;
}

function wireSearchStep(m, event) {
  const input = qs("#gameSearch", m.el);
  const form = qs("#searchForm", m.el);
  const results = qs("#results", m.el);
  let lastRun = 0;

  const run = async () => {
    const q = input.value.trim();
    if (q.length < 2) { setModalStatus(m, "Type at least two characters.", true); return; }
    const runId = ++lastRun;
    setModalStatus(m, "Searching IGDB…");
    results.innerHTML = "";
    try {
      const hits = await searchGames(q);
      if (runId !== lastRun) return;
      setModalStatus(m, "");
      results.innerHTML = hits.length
        ? hits.map(resultRowHtml).join("")
        : `<div class="empty"><strong>No PC games matched "${esc(q)}"</strong>Try a shorter or different title.</div>`;
    } catch (e) {
      if (runId !== lastRun) return;
      setModalStatus(m, e.message, true);
    }
  };

  form.addEventListener("submit", (e) => { e.preventDefault(); run(); });
  results.addEventListener("click", (e) => {
    const row = e.target.closest("[data-igdb-id]");
    if (row) showGameForm(m, event, Number(row.dataset.igdbId), input.value.trim());
  });
  input.focus();
  if (input.value.trim().length >= 2) run();
}

// ---------- host flow: form ----------

function capacityHint(game) {
  const mp = game.multiplayer?.pc || game.multiplayer?.any;
  if (!mp) return "IGDB has no player count for this game — set it yourself.";
  const parts = [];
  if (mp.onlineMax) parts.push(`online max ${mp.onlineMax}`);
  if (mp.onlineCoopMax) parts.push(`co-op max ${mp.onlineCoopMax}`);
  const where = game.multiplayer?.pc ? "PC" : (mp.platform || "another platform");
  return parts.length ? `IGDB lists ${parts.join(", ")} on ${where}.` : "IGDB lists multiplayer but no player count.";
}

// Default start: the event's start, or the next quarter hour if it's already under way.
function defaultSessionStart(event) {
  const start = asDate(event.startsAt);
  const now = Date.now();
  if (start && start.getTime() > now) return start;
  const d = new Date(now + 15 * 60 * 1000);
  d.setMinutes(Math.ceil(d.getMinutes() / 15) * 15, 0, 0);
  return d;
}

function formHtml(game, event) {
  const def = defaultLauncher(game);
  const meta = [game.year, game.genres.slice(0, 3).join(", ")].filter(Boolean).join(" • ");
  const chips = [...game.modes.map((x) => `<span class="chip">${esc(x)}</span>`), game.rating ? `<span class="chip">★ ${esc(game.rating)}</span>` : ""].join("");
  const companies = [game.developers[0] && `Developer: ${game.developers[0]}`, game.publishers[0] && `Publisher: ${game.publishers[0]}`].filter(Boolean).join(" • ");

  const windowStart = new Date(asDate(event.startsAt).getTime() - 2 * 3600 * 1000);
  const windowEnd = new Date(eventEnd(event).getTime() + 3600 * 1000);

  const launcherOptions = LAUNCHER_ORDER.map((key) => {
    const info = LAUNCHERS[key];
    const det = game.launchers?.[key];
    const detected = Boolean(det?.detected);
    let hint;
    if (detected) hint = `✓ ${det.reason || "Detected"}`;
    else if (key === "other") hint = info.hint;
    else hint = "Not detected — you can still pick it";
    return `
      <label class="launcherOpt${detected ? " is-detected" : ""}">
        <input type="radio" name="launcher" value="${esc(key)}" aria-label="${esc(info.label)}"${key === def ? " checked" : ""} />
        <span class="launcherOptTitle">${badgeHtml(key)}</span>
        <span class="launcherOptHint muted">${esc(hint)}</span>
      </label>`;
  }).join("");

  return `
    <div class="gameHeader">
      ${game.coverUrl ? `<img src="${esc(game.coverUrl)}" alt="" />` : `<div class="coverph">${ic("gamepad")}</div>`}
      <div class="gameHeaderBody">
        <div class="gameHeaderTitle">${esc(game.name)}</div>
        <div class="muted">${esc(meta)}</div>
        <div class="chips">${chips}</div>
        ${companies ? `<div class="muted small">${esc(companies)}</div>` : ""}
        <div class="muted small"><a href="${esc(game.links.igdb)}" target="_blank" rel="noopener">View on IGDB</a></div>
      </div>
    </div>

    <div class="field">
      <div class="label">Which launcher are you playing on?</div>
      <div class="launcherChoice" role="radiogroup" aria-label="Launcher">${launcherOptions}</div>
      <div class="hint muted">Detected from IGDB's store listings. Battle.net is inferred from the publisher, so double-check it. Attendees see this as a badge on the session.</div>
    </div>

    <label class="field" id="otherLauncherField" hidden>
      <div class="label">Launcher name</div>
      <input id="launcherOther" class="input" type="text" maxlength="40" placeholder="Epic Games, GOG Galaxy, Ubisoft Connect…" />
    </label>

    <div class="modalGrid">
      <label class="field">
        <div class="label">Start time</div>
        <input id="startTime" class="input" type="datetime-local" value="${esc(toDatetimeLocalValue(defaultSessionStart(event)))}" min="${esc(toDatetimeLocalValue(windowStart))}" max="${esc(toDatetimeLocalValue(windowEnd))}" />
        <div class="hint muted">During ${esc(event.title)}: ${esc(fmtEventWhen(event))}.</div>
      </label>
      <label class="field">
        <div class="label">Player slots (including you)</div>
        <input id="capacity" class="input" type="number" min="1" max="200" step="1" value="${esc(game.suggestedCapacity || "")}" placeholder="e.g. 4" />
        <div class="hint muted">${esc(capacityHint(game))}</div>
      </label>
      <label class="field fieldSpan2">
        <div class="label">Cross-play note</div>
        <input id="crossplay" class="input" type="text" maxlength="200" value="${esc(crossplayHint(game))}" placeholder="Can Steam, Xbox PC and Battle.net players join each other?" />
      </label>
      <label class="field fieldSpan2">
        <div class="label">Notes</div>
        <textarea id="notes" class="textarea" rows="3" maxlength="600" placeholder="Voice channel, mods, difficulty, what to have installed…"></textarea>
      </label>
    </div>

    <div class="modalStatus" id="modalStatus" hidden></div>
    <div class="modalError" id="modalError" hidden></div>

    <div class="modalFoot">
      <button type="button" class="btn btn-ghost" id="btnBack">${ic("left", "ico-sm")}Back to search</button>
      <button type="button" class="btn btn-primary" id="btnHostIt">Host it</button>
    </div>`;
}

async function showGameForm(m, event, igdbId, backQuery) {
  m.setTitle("Host a game");
  m.setBody(`<div class="modalStatus">Loading game details from IGDB…</div>`);
  let game;
  try {
    game = await getGame(igdbId);
  } catch (e) {
    m.setBody(searchStepHtml(backQuery));
    wireSearchStep(m, event);
    setModalStatus(m, e.message, true);
    return;
  }

  m.setTitle(`Host ${game.name}`);
  m.setBody(formHtml(game, event));

  const otherField = qs("#otherLauncherField", m.el);
  const syncOther = () => { otherField.hidden = qs('input[name="launcher"]:checked', m.el)?.value !== "other"; };
  qsa('input[name="launcher"]', m.el).forEach((r) => r.addEventListener("change", syncOther));
  syncOther();

  qs("#btnBack", m.el).addEventListener("click", () => {
    m.setTitle("Host a game");
    m.setBody(searchStepHtml(backQuery));
    wireSearchStep(m, event);
  });

  qs("#btnHostIt", m.el).addEventListener("click", async () => {
    if (!me) { setModalStatus(m, "Your sign-in expired. Sign in again to host.", true); return; }
    const launcher = qs('input[name="launcher"]:checked', m.el)?.value || "";
    if (!launcher) { setModalStatus(m, "Pick the launcher you'll be playing on.", true); return; }
    const start = fromDatetimeLocalValue(qs("#startTime", m.el).value);
    if (!start) { setModalStatus(m, "Pick a start time.", true); return; }
    const capacity = Number(qs("#capacity", m.el).value);
    if (!Number.isInteger(capacity) || capacity < 1) { setModalStatus(m, "Player slots must be a whole number of at least 1.", true); return; }

    const input = {
      igdbId: game.igdbId,
      launcher,
      launcherLabel: launcher === "other" ? qs("#launcherOther", m.el).value.trim() : "",
      startTime: start.toISOString(),
      capacity,
      notes: qs("#notes", m.el).value.trim(),
      crossplayNote: qs("#crossplay", m.el).value.trim()
    };

    setModalStatus(m, "Creating session…");
    try {
      await store.createSession(event.id, input);
      m.close();
    } catch (e) {
      setModalStatus(m, e.message, true);
    }
  });
}

function openHostFlow(event) {
  if (requireSignIn("Sign in to host a session — attendees need to know who's running it.")) return;
  const m = openModal(`Host a game at ${event.title}`, searchStepHtml());
  wireSearchStep(m, event);
}

// ---------- session cards ----------

function isPastSession(s) {
  const start = asDate(s.startTime);
  return start ? start.getTime() < Date.now() - 3 * 3600 * 1000 : false;
}

function multiplayerFacts(mp) {
  if (!mp) return [];
  const facts = [];
  if (mp.onlineMax) facts.push(["Online max", mp.onlineMax]);
  if (mp.onlineCoopMax) facts.push(["Co-op max", mp.onlineCoopMax]);
  const flags = [mp.campaignCoop && "campaign co-op", mp.dropIn && "drop-in", mp.lanCoop && "LAN", mp.splitscreen && "split-screen"].filter(Boolean);
  if (flags.length) facts.push(["Supports", flags.join(", ")]);
  return facts;
}

function sessionCardHtml(s, event) {
  const cap = Number(s.capacity || 0);
  const confirmed = Array.isArray(s.confirmed) ? s.confirmed : [];
  const waitlist = Array.isArray(s.waitlist) ? s.waitlist : [];
  const isHost = Boolean(me && s.hostUid === me.uid);
  const canCancel = isHost || Boolean(me && (event.createdBy === me.uid || role?.isOwner));
  const isIn = Boolean(me && [...confirmed, ...waitlist].some((e) => e.uid === me.uid));
  const past = isPastSession(s);
  const facts = multiplayerFacts(s.multiplayer);

  const rosterList = (entries) => entries.length
    ? `<ul class="rosterList">${entries.map((e) => {
        const you = Boolean(me && e.uid === me.uid);
        return `<li class="${e.uid === s.hostUid ? "is-host" : ""}${you ? " is-you" : ""}">${avatarHtml(e.name, "av-sm", you)}${esc(e.name)}</li>`;
      }).join("")}</ul>`
    : `<div class="rosterEmpty">Nobody yet</div>`;

  return `
    <article class="sessionCard${past ? " is-past" : ""}" data-session-id="${esc(s.id)}" data-event-id="${esc(event.id)}">
      <div class="cover">
        ${s.coverUrl ? `<img src="${esc(s.coverUrl)}" alt="" loading="lazy" />` : `<div class="coverph">${ic("gamepad")}</div>`}
      </div>
      <div class="cardBody">
        <div class="cardTop">
          <div class="gameName">
            ${s.igdbUrl ? `<a href="${esc(s.igdbUrl)}" target="_blank" rel="noopener">${esc(s.gameName)}</a>` : esc(s.gameName)}
            ${s.year ? `<span class="gameYear">(${esc(s.year)})</span>` : ""}
          </div>
          <div class="when" title="${esc(fmtDate(s.startTime))}">${ic("clock", "ico-sm")}${esc(fmtTime(s.startTime))}</div>
        </div>

        <div class="cardRow">
          ${badgeHtml(s.launcher, s.launcher === "other" ? s.launcherLabel : "")}
          <span class="chip">PC</span>
          ${s.storeUrl ? `<a class="storeLink" href="${esc(s.storeUrl)}" target="_blank" rel="noopener">Store page${ic("ext", "ico-xs")}</a>` : ""}
        </div>

        <div class="cardMeta">
          ${[...(s.genres || []).slice(0, 2), ...(s.modes || []).filter((x) => /multi|co-op|mmo/i.test(x)).slice(0, 2)].map(esc).join(" • ")}
        </div>

        <div class="hostLine">${avatarHtml(s.hostDisplayName || "?", "av-sm", isHost)}<span>Hosted by <strong>${esc(s.hostDisplayName || "Unknown")}</strong>${isHost ? " (you)" : ""}</span></div>

        <div class="seats${confirmed.length >= cap ? " is-full" : ""}">
          <span class="seatMeter">${seatMeterHtml({ confirmed: confirmed.length, waitlist: waitlist.length, cap }).replace(" seats", " players")}</span>
        </div>

        ${s.crossplayNote ? `<div class="crossplay">${ic("link", "ico-sm")}<span>${esc(s.crossplayNote)}</span></div>` : ""}
        ${s.notes ? `<div class="notes"><strong>Notes:</strong> ${esc(s.notes)}</div>` : ""}

        <div class="roster">
          <div class="rosterGroup">
            <div class="rosterHead"><span>Confirmed</span><span class="n">${confirmed.length}</span></div>
            ${rosterList(confirmed)}
          </div>
          <div class="rosterGroup wait">
            <div class="rosterHead"><span>Waitlist</span><span class="n">${waitlist.length}</span></div>
            ${rosterList(waitlist)}
          </div>
        </div>

        <div class="cardActions">
          ${past ? "" : (isIn
            ? `<button type="button" class="btn btn-small" data-action="leave">${ic("logout", "ico-sm")}Leave</button>`
            : `<button type="button" class="btn btn-small btn-primary" data-action="join">${ic(confirmed.length >= cap ? "clock" : "plus", "ico-sm")}${confirmed.length >= cap ? "Join waitlist" : "Join"}</button>`)}
          <button type="button" class="btn btn-small btn-ghost" data-action="details">${ic("down", "ico-sm")}Details</button>
          ${canCancel && !past ? `<button type="button" class="btn btn-small btn-danger" data-action="delete">${ic("trash", "ico-sm")}Cancel session</button>` : ""}
        </div>

        <div class="details" data-details hidden>
          ${s.summary ? `<div class="summary">${esc(s.summary)}</div>` : ""}
          ${facts.length ? `<div class="factGrid">${facts.map(([k, v]) => `<div class="fact"><span class="k">${esc(k)}</span><span class="v">${esc(v)}</span></div>`).join("")}</div>` : ""}
          <div class="linkRow">
            ${s.igdbUrl ? `<a href="${esc(s.igdbUrl)}" target="_blank" rel="noopener">IGDB${ic("ext", "ico-xs")}</a>` : ""}
            ${s.officialUrl ? `<a href="${esc(s.officialUrl)}" target="_blank" rel="noopener">Official site${ic("ext", "ico-xs")}</a>` : ""}
            ${s.storeUrl ? `<a href="${esc(s.storeUrl)}" target="_blank" rel="noopener">${esc(launcherMeta(s.launcher).label)} page${ic("ext", "ico-xs")}</a>` : ""}
          </div>
          <div class="muted small">${esc([s.developers?.[0] && `Developer: ${s.developers[0]}`, s.publishers?.[0] && `Publisher: ${s.publishers[0]}`, s.rating && `IGDB rating ${s.rating}`].filter(Boolean).join(" • "))}</div>
        </div>
      </div>
    </article>`;
}

async function onCardAction(e) {
  const btn = e.target.closest("[data-action]");
  if (!btn) return;
  const card = btn.closest("[data-session-id]");
  const id = card?.dataset.sessionId;
  const eventId = card?.dataset.eventId;
  if (!id || !eventId) return;
  const action = btn.dataset.action;

  if (action === "details") {
    const d = qs("[data-details]", card);
    d.hidden = !d.hidden;
    return;
  }

  try {
    if (action === "join") {
      if (requireSignIn("Sign in to claim a slot — the host needs to know who's coming.")) return;
      const r = await store.join(eventId, id);
      if (r?.result === "waitlist") showPageStatus("That session is full — you're on the waitlist.", 5000);
    } else if (action === "leave") {
      if (requireSignIn()) return;
      await store.leave(eventId, id);
    } else if (action === "delete") {
      const bundle = await store.getEventBundle(eventId);
      const s = bundle?.sessions.find((x) => x.id === id);
      if (s && window.confirm(`Cancel the ${s.gameName} session?`)) await store.removeSession(eventId, id);
    }
  } catch (err) {
    showPageStatus(err.message, 6000);
  }
}

// ---------- views ----------

// First and last Central day of an event, for the date block.
function eventDays(ev) {
  const first = centralDateKey(ev.startsAt);
  const last = centralDateKey(eventEnd(ev));
  if (!first) return [];
  return last && last !== first ? [first, last] : [first];
}

function eventCardHtml(ev) {
  const past = isPastEvent(ev);
  return `
    <a class="eventCard${past ? " is-past" : ""}" href="?event=${encodeURIComponent(ev.id)}" data-event-link="${esc(ev.id)}" aria-label="${esc(ev.title)}${past ? " (ended)" : ""}">
      ${dateBlockHtml(eventDays(ev), "evDate")}
      <div class="eventBody">
        <div class="eventTitle">${esc(ev.title)}</div>
        <div class="eventLine eventWhen">${ic("clock", "ico-sm")}<span>${esc(fmtEventWhen(ev))}</span></div>
        ${ev.location ? `<div class="eventLine">${ic("pin", "ico-sm")}<span>${esc(ev.location)}</span></div>` : ""}
        <div class="eventLine">${ic("user", "ico-sm")}<span>Organized by ${esc(ev.createdByDisplayName || "Unknown")}</span></div>
      </div>
      <span class="eventGo">${ic("right")}</span>
    </a>`;
}

const emptyHtml = (icon, title, body) =>
  `<div class="empty"><span class="eico">${ic(icon, "ico-lg")}</span><strong>${esc(title)}</strong><span>${body}</span></div>`;

async function renderEventsView(view) {
  const events = await store.listEvents();
  const upcoming = events.filter((ev) => !isPastEvent(ev));
  const past = events.filter(isPastEvent).reverse();
  const canCreate = Boolean(role?.canCreateEvents);

  view.innerHTML = `
    <section class="hero">
      <div>
        <div class="kicker">Video games</div>
        <h2 class="heroTitle">PC game nights</h2>
        <p class="muted heroText">Open an event to see who's hosting what, grab a slot, or host a game yourself.</p>
      </div>
      ${canCreate ? `<button type="button" class="btn btn-primary btn-lg" id="btnCreateEvent">${ic("plus")}Create event</button>` : ""}
    </section>
    ${upcoming.length
      ? `<div class="eventGrid">${upcoming.map(eventCardHtml).join("")}</div>`
      : emptyHtml("cal", "No upcoming events", canCreate ? "Create one and people can start hosting games in it." : "Check back soon — the next game night will show up here.")}
    ${past.length ? `
      <details class="pastBlock">
        <summary>${ic("history", "ico-sm")}Past events (${past.length})</summary>
        <div class="eventGrid">${past.map(eventCardHtml).join("")}</div>
      </details>` : ""}`;

  qs("#btnCreateEvent", view)?.addEventListener("click", () => {
    if (requireSignIn()) return;
    openCreateEventModal();
  });
}

async function renderEventView(view, eventId) {
  const bundle = await store.getEventBundle(eventId);
  if (bundle === null) {
    view.innerHTML = `
      <a class="backLink" href="./" data-nav="events">${ic("left", "ico-sm")}All events</a>
      ${emptyHtml("x", "This event was removed", "It may have been cancelled by its organizer.")}`;
    return;
  }
  if (!bundle) {
    view.innerHTML = `
      <a class="backLink" href="./" data-nav="events">${ic("left", "ico-sm")}All events</a>
      ${emptyHtml("alert", "Couldn't load this event", `${esc(store.lastError || "The planner API didn't answer.")} It will retry automatically.`)}`;
    return;
  }

  const { event, sessions } = bundle;
  const past = isPastEvent(event);
  const canManage = Boolean(me && (event.createdBy === me.uid || role?.isOwner));
  const upcoming = sessions.filter((s) => !isPastSession(s));
  const done = sessions.filter(isPastSession);

  const byDay = new Map();
  for (const s of upcoming) {
    const key = centralDateKey(s.startTime) || "tbd";
    if (!byDay.has(key)) byDay.set(key, []);
    byDay.get(key).push(s);
  }
  const multiDay = byDay.size > 1;
  const players = upcoming.reduce((n, s) => n + (Array.isArray(s.confirmed) ? s.confirmed.length : 0), 0);
  const open = upcoming.reduce((n, s) => n + Math.max(0, Number(s.capacity || 0) - (Array.isArray(s.confirmed) ? s.confirmed.length : 0)), 0);
  const state = past ? `<span class="pill">Ended</span>` : eventStarted(event) ? `<span class="pill pill-green">Under way</span>` : "";

  view.innerHTML = `
    <a class="backLink" href="./" data-nav="events">${ic("left", "ico-sm")}All events</a>
    <section class="eventHeader">
      <div class="eventHeaderMain">
        <div class="kicker">Video game night${state}</div>
        <h2>${esc(event.title)}</h2>
        <div class="eventHeaderLines">
          <span>${ic("cal")}<strong>${esc(fmtEventWhen(event))}</strong></span>
          ${event.location ? `<span>${ic("pin")}${esc(event.location)}</span>` : ""}
          <span>${ic("user")}Organized by ${esc(event.createdByDisplayName || "Unknown")}</span>
        </div>
        ${event.notes ? `<div class="eventNotes">${esc(event.notes)}</div>` : ""}
        ${upcoming.length ? `<div class="stats">
          <span class="stat"><b>${upcoming.length}</b>${upcoming.length === 1 ? "session" : "sessions"}</span>
          <span class="stat green"><b>${open}</b>open ${open === 1 ? "slot" : "slots"}</span>
          <span class="stat"><b>${players}</b>${players === 1 ? "player" : "players"}</span>
        </div>` : ""}
      </div>
      <div class="eventActions">
        ${canManage ? `<button type="button" class="btn btn-danger" id="btnDeleteEvent">${ic("trash", "ico-sm")}Delete event</button>` : ""}
        ${past ? "" : `<button type="button" class="btn btn-primary btn-lg" id="btnHost">${ic("plus")}Host a game</button>`}
      </div>
    </section>

    <section id="sessionList">
      ${upcoming.length
        ? [...byDay.entries()].map(([key, items]) => `
            ${multiDay ? `<h3 class="dayHeader">${esc(key === "tbd" ? "Date TBD" : fmtDayHeader(items[0].startTime))}</h3>` : ""}
            <div class="sessionGrid">${items.map((s) => sessionCardHtml(s, event)).join("")}</div>`).join("")
        : emptyHtml("gamepad", "No games hosted yet", past ? "This event has ended." : "Hit “Host a game”, pick a title, and say which launcher you're on.")}
    </section>

    ${done.length ? `
      <details class="pastBlock">
        <summary>${ic("history", "ico-sm")}Finished sessions (${done.length})</summary>
        <div class="sessionGrid" id="pastList">${done.reverse().map((s) => sessionCardHtml(s, event)).join("")}</div>
      </details>` : ""}`;

  qs("#btnHost", view)?.addEventListener("click", () => openHostFlow(event));
  qs("#btnDeleteEvent", view)?.addEventListener("click", async () => {
    if (!window.confirm(`Delete "${event.title}" and every session in it? This can't be undone.`)) return;
    try {
      await store.removeEvent(event.id);
      go(null);
    } catch (e) {
      showPageStatus(e.message, 6000);
    }
  });
  qsa("[data-session-id]", view).forEach(() => {}); // cards are delegated below
}

let shownStoreError = "";
let renderSeq = 0;

async function render() {
  const seq = ++renderSeq;
  const view = qs("#view");
  const eventId = currentEventId();

  if (eventId) await renderEventView(view, eventId);
  else await renderEventsView(view);
  if (seq !== renderSeq) return; // a newer render already replaced this one

  if (store.lastError !== shownStoreError) {
    shownStoreError = store.lastError;
    showPageStatus(store.lastError || "");
  }
  const notice = qs("#storageNotice");
  notice.hidden = false;
  notice.textContent = `Sign-in is shared with the board game planner. Events and sessions are saved in ${store.backendLabel}.`;
}

// ---------- boot ----------

qs("#btnSignIn").addEventListener("click", () => openSignInModal());
qs("#btnSignOut").addEventListener("click", async () => {
  try { await signOutUser(); } catch (e) { showPageStatus(`Sign-out failed: ${e.message}`, 6000); }
});

// One delegated handler for session cards and in-app navigation links.
qs("#view").addEventListener("click", (e) => {
  const link = e.target.closest("[data-event-link], [data-nav]");
  if (link) {
    e.preventDefault();
    go(link.dataset.eventLink || null);
    return;
  }
  onCardAction(e);
});

store.setView(currentEventId());
store.subscribe(render);

// Identity drives the views (organizer controls, host controls, "you" markers),
// so re-render on every auth change — including the restored session on first
// load, which is what makes arriving from the board game planner seamless.
onUser(async (identity) => {
  me = identity;
  store.forgetMe();
  role = me ? await store.me() : null;
  renderAuthBar();
  render();
});

handleDiscordRedirect().then((r) => {
  if (r.handled && !r.ok) showPageStatus(r.error, 10000);
});

render();
checkProxy();
