/* =============================================================================
   Dead of Winter Setup Utility — application logic
   Configurator (game sets + players + modules/variants) -> live,
   precedence-aware setup instructions, rules reference, location reference,
   common rulings & full-text rulebook search.
   ============================================================================= */

const state = {
  expansions: new Set(["base"]),   // at least one of base / longnight required
  players: 4,
  modules: new Set()
};

const $ = (sel, root = document) => root.querySelector(sel);
const el = (tag, cls, html) => { const n = document.createElement(tag); if (cls) n.className = cls; if (html != null) n.innerHTML = html; return n; };

/* ---- Validity helpers ---------------------------------------------------- */
function expEnabled(id) { return state.expansions.has(id); }
function coreCount()    { return ["base", "longnight"].filter(expEnabled).length; }
function requiresMet(req)    { return req === undefined ? true : (Array.isArray(req) ? req.some(expEnabled) : expEnabled(req)); }
function requiresAllMet(req) { return !req || req.every(expEnabled); }

function moduleAvailable(m) {
  if (!requiresMet(m.requires) || !requiresAllMet(m.requiresAll)) return false;
  if (m.minPlayers && state.players < m.minPlayers) return false;
  // Quick Play only makes sense inside the Warring Colonies variant
  if (m.id === "quickplay" && !state.modules.has("wcvariant")) return false;
  return true;
}
function availableModules() { return DW.modules.filter(moduleAvailable); }

/* Build the condition context used by every `when` predicate in the data. */
function ctx() {
  const wc = state.modules.has("wcvariant");
  const twoPlayer = !wc && state.players === 2;
  return {
    has: e => expEnabled(e),
    p: state.players,
    mod: id => state.modules.has(id),
    wc,
    loneWolf: wc && state.players % 2 === 1,
    twoPlayer,
    coopRules: !wc && (state.modules.has("coop") || twoPlayer),
    combined: expEnabled("base") && expEnabled("longnight")
  };
}

/* Player-count availability for the current mode. */
function playerRange() {
  return state.modules.has("wcvariant") ? [4, 11] : [2, 5];
}

/* Drop modules / state that became invalid after a configurator change. */
function pruneState() {
  // keep at least one core set
  if (coreCount() === 0) state.expansions.add("base");
  // Warring Colonies content requires a core set (always true) and wc box
  [...state.modules].forEach(id => {
    const m = DW.modules.find(x => x.id === id);
    if (!m || !requiresMet(m.requires) || !requiresAllMet(m.requiresAll)) state.modules.delete(id);
  });
  // player clamp per mode (before minPlayers pruning so wcvariant survives)
  const [lo, hi] = playerRange();
  if (state.players < lo) state.players = lo;
  if (state.players > hi) state.players = hi;
  // now prune anything failing minPlayers / dependency checks
  [...state.modules].forEach(id => {
    const m = DW.modules.find(x => x.id === id);
    if (m && !moduleAvailable(m)) state.modules.delete(id);
  });
  // scenarios imply their module
  DW.modules.filter(m => m.implies && state.modules.has(m.id))
    .forEach(m => m.implies.forEach(x => state.modules.add(x)));
}

function toggleModule(m, on) {
  if (on) state.modules.delete(m.id);
  else {
    state.modules.add(m.id);
    if (m.excludes) m.excludes.forEach(x => state.modules.delete(x));
    if (m.implies)  m.implies.forEach(x => {
      state.modules.add(x);
      const im = DW.modules.find(z => z.id === x);
      if (im && im.excludes) im.excludes.forEach(y => { if (y !== m.id) state.modules.delete(y); });
    });
  }
  pruneState(); renderAll();
}

/* ---- Rendering: configurator -------------------------------------------- */
function renderConfigurator() {
  // Game sets
  const ex = $("#expansions"); ex.innerHTML = "";
  DW.expansions.forEach(e => {
    const on = expEnabled(e.id);
    const isLastCore = on && e.kind === "base" && coreCount() === 1;
    const chip = el("button", "chip" + (on ? " on" : "") + (isLastCore ? " locked" : "") + " " + DW.expMeta[e.id].cls + "-chip");
    chip.innerHTML = `<span class="chip-name">${e.short}</span>`;
    chip.title = e.name + " — " + e.blurb + (isLastCore ? " (You need at least one core set on the table.)" : "");
    chip.onclick = () => {
      if (on) {
        if (isLastCore) return;                    // must keep a core set
        state.expansions.delete(e.id);
      } else state.expansions.add(e.id);
      pruneState(); renderAll();
    };
    ex.appendChild(chip);
  });

  // Players
  const pl = $("#players"); pl.innerHTML = "";
  const [lo, hi] = playerRange();
  for (let p = 2; p <= 11; p++) {
    const ok = p >= lo && p <= hi;
    const b = el("button", "pbtn" + (state.players === p ? " on" : "") + (ok ? "" : " off"), String(p));
    b.title = ok ? `${p} players`
      : (p > 5 ? "6-11 players require the Warring Colonies variant (Base + Long Night + Warring Colonies)."
               : "The Warring Colonies variant needs at least 4 players.");
    b.onclick = () => { if (!ok) return; state.players = p; pruneState(); renderAll(); };
    pl.appendChild(b);
  }

  // Modules, grouped by type
  const op = $("#modules"); op.innerHTML = "";
  const avail = availableModules();
  DW.moduleTypes.forEach(gt => {
    const mods = avail.filter(m => m.type === gt.id);
    if (!mods.length) return;
    const group = el("div", "mod-group");
    group.appendChild(el("div", "mod-group-label", gt.label + ` <span class="mg-note">${gt.note}</span>`));
    const chips = el("div", "chips");
    mods.forEach(m => {
      const on = state.modules.has(m.id);
      const chip = el("button", "chip small" + (on ? " on" : ""));
      chip.innerHTML = `<span class="chip-name">${m.name}</span>`;
      chip.title = m.description.replace(/<[^>]+>/g, "");
      chip.onclick = () => toggleModule(m, on);
      chips.appendChild(chip);
    });
    group.appendChild(chips);
    op.appendChild(group);
  });
}

/* Resolve possibly-functional fields against the context. */
const F = (v, c) => (typeof v === "function" ? v(c) : v);

/* ---- Rendering: detail (full setup + references) ------------------------- */
function renderDetail() {
  const wrap = $("#detail");
  const c = ctx();

  const expNames = DW.expansions.filter(e => expEnabled(e.id)).map(e => e.short);
  const modChips = DW.modules.filter(m => state.modules.has(m.id)).map(m => m.name);
  const modeLine = c.wc
    ? `Warring Colonies — two colonies of ${DW.wcSeating[c.p].teams}${c.loneWolf ? " plus a Lone Wolf" : ""}`
    : c.coopRules ? "Co-op colony" : "Standard game — secret objectives & a possible betrayer";
  const headHtml = `<div class="detail-head">
      <button class="share-btn" onclick="copyShareLink(this)" title="Copy a link that reopens this exact configuration">🔗 Copy setup link</button>
      <div class="dh-mode">Your Colony Setup</div>
      <p class="dh-desc">Step-by-step setup for exactly the sets and modules below, following the rulebooks' numbered setup steps with every change tagged by its source. Where The Long Night or Warring Colonies rewrites a rule, only the ruling that applies to your table is shown.</p>
      <div class="dh-meta">
        <span class="meta-pill">${c.p} players</span>
        <span class="meta-pill mode">${modeLine}</span>
        ${expNames.map(t => `<span class="meta-pill">${t}</span>`).join("")}
        ${modChips.map(t => `<span class="meta-pill opt">${t}</span>`).join("")}
      </div>
    </div>`;

  const faqItems = DW.faq.filter(f => !f.when || f.when(c));
  const navItems = [
    ["sec-search", "🔍 Search"],
    ["sec-setup", "Setup Steps"],
    ["sec-howto", "How to Play"],
    ["sec-boards", "Locations"],
    faqItems.length ? ["sec-faq", "Rulings"] : null,
    ["sec-ref", "Reference"]
  ].filter(Boolean);
  const navHtml = `<nav class="jump-nav" aria-label="Jump to section">${
    navItems.map(([id, label]) => `<a href="#${id}" class="jn">${label}</a>`).join("")
  }</nav>`;

  const searchHtml = buildSearchPanel(c);

  // ---- Setup steps: merged, precedence-aware, grouped by phase ----
  const steps = DW.setup.filter(s => !s.when || s.when(c));
  let n = 0, blocks = "";
  DW.phases.forEach((phaseName, pi) => {
    const phaseSteps = steps.filter(s => s.ph === pi);
    if (!phaseSteps.length) return;
    blocks += `<section class="setup-block">
        <h3>${phaseName}</h3>
        <ol class="ustep">${phaseSteps.map(s => {
          n++;
          const m = DW.expMeta[F(s.exp, c)];
          return `<li><span class="snum">${n}</span>
            <div class="sbody"><span class="st">${F(s.t, c)}</span> <span class="etag ${m.cls}">${m.name}</span>
            <div class="sd">${F(s.d, c)}</div>${s.src ? `<div class="ssrc">${F(s.src, c)}</div>` : ""}</div></li>`;
        }).join("")}</ol>
      </section>`;
  });
  let html = `<div class="legend" id="sec-setup">Each step is tagged with its source — the game set, module, scenario or variant it comes from — and cites its rulebook page. Change the sets, player count or modules above and the steps update instantly — only steps that apply to your table are shown.</div>`;
  html += `<div class="steps">${blocks}</div>`;

  html += `<div id="sec-howto">${buildHowToPlay(c)}</div>`;
  html += `<div id="sec-boards">${buildBoards(c)}</div>`;
  if (faqItems.length) html += `<div id="sec-faq">${buildFaq(c)}</div>`;
  html += `<div id="sec-ref">${buildReference(c)}</div>`;

  wrap.innerHTML = headHtml + navHtml + searchHtml + html;
  syncTopbarHeight();
}

/* ---- How to Play — core loop + active-module rules ----------------------- */
function buildHowToPlay(c) {
  const tagHtml = tag => {
    const id = F(tag, c);
    const m = DW.expMeta[id];
    return m ? `<span class="etag ${m.cls}">${m.name}</span> ` : "";
  };
  const block = (title, items, cls = "", defTag) => {
    const vis = items.filter(i => typeof i === "string" || !i.when || i.when(c));
    if (!vis.length) return "";
    // The box's header carries the dominant source tag; individual rules are
    // tagged only when a different set/module/variant supplies that line.
    const resolved = vis.map(i => (typeof i === "string") ? null : (F(i.tag || defTag, c) || null));
    const counts = {};
    resolved.forEach(t => { if (t) counts[t] = (counts[t] || 0) + 1; });
    const headTag = Object.keys(counts).sort((a, b) => counts[b] - counts[a])[0] || null;
    const lis = vis.map((i, idx) => {
      if (typeof i === "string") return `<li>${i}</li>`;
      const tag = resolved[idx];
      const show = tag && tag !== headTag;
      return `<li>${show ? tagHtml(tag) : ""}${F(i.t, c)}${i.src ? ` <span class="htp-src">${F(i.src, c)}</span>` : ""}</li>`;
    }).join("");
    return `<section class="htp-sec ${cls}"><h5>${title}${headTag ? tagHtml(headTag) : ""}</h5><ul>${lis}</ul></section>`;
  };

  let body = "";
  DW.howToPlay.core.forEach(g => { body += block(g.h, g.items); });
  DW.howToPlay.modules.filter(m => m.when(c)).forEach(m => {
    body += block(m.h, m.items, "mod", m.tag);
  });

  return `<div class="howto">
      <h3>How to Play — Rules Reference</h3>
      <div class="legend">A concise reference for your exact table. Each box's header shows its source; a line gets its own tag only when a different set, module or variant supplies that rule.</div>
      <div class="htp-grid">${body}</div>
    </div>`;
}

/* ---- Locations reference -------------------------------------------------- */
function buildBoards(c) {
  let blocks = "";
  DW.boards.filter(b => b.when(c)).forEach(b => {
    blocks += `<section class="loc-board"><h5>${b.name}</h5><ul>${
      b.items.map(i => `<li>${F(i, c)}</li>`).join("")
    }</ul></section>`;
  });
  return `<div class="locations"><h3>Location Reference</h3>
      <div class="legend">What every board and location in your setup does at the table.</div>
      <div class="loc-grid">${blocks}</div></div>`;
}

/* ---- Contextual rulings --------------------------------------------------- */
function buildFaq(c) {
  const items = DW.faq.filter(f => !f.when || f.when(c));
  if (!items.length) return "";
  return `<div class="faq"><h3>Common Rulings for This Setup</h3>
      <div class="legend">Frequently-missed rules pulled straight from the rulebooks, filtered to your table.</div>
      <div class="faq-list">${
        items.map(f => `<details class="faq-item"><summary>${f.q}</summary><div class="faq-a">${F(f.a, c)}</div></details>`).join("")
      }</div></div>`;
}

/* ---- Reference table ------------------------------------------------------- */
function buildReference(c) {
  let table;
  if (c.wc) {
    const rows = [];
    for (let p = 4; p <= 11; p++) {
      const s = DW.wcSeating[p];
      const cls = p === c.p ? ' class="ref-active"' : "";
      rows.push(`<tr${cls}><td>${p}</td><td>${s.teams}</td><td>${s.lw ? "Yes" : "—"}</td><td>${p === 11 ? "4 each" : "5 each"}</td><td>${p <= 5 ? "Deal 5, keep 3" : "Deal 4, keep 2"}</td></tr>`);
    }
    table = `<table class="ref-table">
        <thead><tr><th>Players</th><th>Colonies</th><th>Lone Wolf</th><th>Starting items</th><th>Survivor draft</th></tr></thead>
        <tbody>${rows.join("")}</tbody></table>
      <ul class="ref-notes">
        <li>Colony leaders: highest-influence group leader per colony at start, re-elected every round.</li>
        <li>Each colony gains <b>2 bullets</b> per round (Add 2 Bullets step); bid bullets are discarded after every combat.</li>
        <li>Lone Wolf: dealt 5 survivors, keeps 3; morale starts at 4 (max 5); starts with 3 mission cards.</li>
        <li>${c.mod("quickplay")
          ? "Quick Play: flip the 2-minute sand timer as soon as both active players have finished moving; they have 2 minutes TOTAL for all their actions, and unfinished actions are lost (WC rulebook p.15)."
          : "The simultaneous actions step: the first active player to finish flips the 2-minute sand timer, and the other has 2 minutes to finish (WC rulebook p.9)."}${c.loneWolf ? " The Lone Wolf has no time limit (WC rulebook p.14)." : ""}</li>
      </ul>`;
  } else {
    const rows = [];
    for (let p = 2; p <= 5; p++) {
      const r = DW.playerRef.stdRows(p);
      const cls = p === c.p ? ' class="ref-active"' : "";
      // 2-player row always reflects the mandatory 2-player rules; other rows
      // reflect a selected variant only when one is actually selected.
      const pool = p === 2 ? r.pool
        : c.mod("coop") ? "None — co-op selected"
        : c.mod("betrayer") ? `${p} non-betrayal + 1 betrayal`
        : r.pool;
      rows.push(`<tr${cls}><td>${p}</td><td>${r.dice}</td><td>${r.items}</td><td>${r.draft}</td><td>${pool}</td><td>${r.crisis}</td></tr>`);
    }
    table = `<table class="ref-table">
        <thead><tr><th>Players</th><th>Starting dice</th><th>Starting items</th><th>Survivor draft</th><th>Secret objective pool</th><th>Crisis target</th></tr></thead>
        <tbody>${rows.join("")}</tbody></table>
      <ul class="ref-notes"><li>${F(DW.playerRef.twoPlayerNote, c)}</li>${DW.playerRef.notes.map(n => `<li>${n}</li>`).join("")}</ul>`;
  }
  return `<div class="reference"><h3>Reference Table</h3>
      <div class="legend">Core numbers for your game. ${F(DW.playerRef.src, c)}.</div>
      <div class="ref-grid">${table}</div></div>`;
}

/* ---- Rulebook search panel ----------------------------------------------- */
function buildSearchPanel(c) {
  const books = DW.expansions.filter(e => expEnabled(e.id)).map(e => e.short.replace(/^The /, "") + " rulebook");
  return `<section class="rules-search" id="sec-search">
      <h3>Search the Rulebooks</h3>
      <p class="rs-sub">Searches this page first, then the ${books.join(", ")} for this setup — type keywords <i>or ask a plain question</i> (“what happens when an entrance is overrun?”). Rulebook results are ranked by relevance and cite their book and page; “Read the whole page” opens the full text.</p>
      <input type="search" id="rules-q" class="rs-input" placeholder="Ask a question, or search a rule or component…" autocomplete="off" spellcheck="false">
      <div id="rules-results" class="rs-results"></div>
    </section>`;
}

/* Dead of Winter vocabulary map so plain questions hit the right rules. The shared
   search (js/search-widget.js) takes it as `synonyms`: a synonym scores at 0.45 and
   never counts toward "all your words". */
const _SYN = {
  zombie: ["standee", "overrun", "kill", "entrance"], walker: ["zombie"], undead: ["zombie"], horde: ["zombie"],
  morale: ["track", "lose", "colony"], round: ["track", "tracker", "phase"],
  crisis: ["prevent", "contribute", "symbol"], crossroad: ["trigger", "option", "card"],
  exposure: ["die", "wound", "frostbite", "bitten"], frostbite: ["wound", "exposure"],
  bite: ["bitten", "spread", "exposure"], bitten: ["bite", "spread", "kill"],
  wound: ["token", "kill", "exposure", "medicine"], heal: ["wound", "medicine"], medicine: ["wound", "hospital"],
  barricade: ["entrance", "token", "trap"], trap: ["explosive", "barricade"], explosive: ["trap", "barricade"],
  noise: ["token", "search", "zombie"], search: ["item", "deck", "noise", "location"],
  item: ["card", "equip", "deck"], equip: ["item", "hand", "off"], weapon: ["item", "attack", "combat"],
  food: ["token", "supply", "starvation", "pay"], starvation: ["food", "morale"], starve: ["starvation", "food"],
  colony: ["board", "entrance", "morale"], location: ["card", "entrance", "search"],
  survivor: ["influence", "standee", "leader", "helpless"], helpless: ["survivor", "token", "unruly"],
  unruly: ["helpless", "medicine"], influence: ["survivor", "leader", "first"],
  leader: ["group", "influence", "colony"], exile: ["vote", "objective", "betrayer"],
  betrayer: ["betrayal", "secret", "exile"], betrayal: ["betrayer", "secret", "objective"],
  objective: ["main", "secret", "victory", "win"], secret: ["objective", "betrayal"],
  vote: ["exile", "thumb", "first"], win: ["objective", "victory"], lose: ["morale", "round"],
  attack: ["die", "zombie", "survivor", "kill"], kill: ["zombie", "survivor", "morale"],
  die: ["dice", "action", "roll"], dice: ["die", "action", "roll"], action: ["die", "turn"],
  move: ["survivor", "exposure", "location"], attract: ["zombie", "move"],
  waste: ["pile", "clean", "morale"], request: ["item", "play"], hand: ["off", "equip", "card"],
  despair: ["token", "wound"], graveyard: ["dead", "survivor"],
  improvement: ["advancement", "token", "module"], advancement: ["improvement", "token"],
  bandit: ["hideout", "scavenge", "module", "standee"], hideout: ["bandit"], scavenge: ["bandit"],
  raxxon: ["experiment", "pill", "containment", "module"], pill: ["raxxon", "side", "effect"],
  containment: ["code", "raxxon", "experiment"], experiment: ["raxxon", "special", "zombie"],
  special: ["zombie", "experiment", "encounter"], encounter: ["special", "zombie", "card"],
  combat: ["strength", "tactic", "bullet", "colony"], bullet: ["token", "bid", "combat", "supply"],
  tactic: ["combat", "card", "leader"], bid: ["bullet", "combat"], strength: ["combat", "tracker"],
  timer: ["sand", "simultaneous", "minute"], sand: ["timer"], simultaneous: ["timer", "turn", "action"],
  wolf: ["lone", "den", "mission"], lone: ["wolf", "den", "mission"], den: ["lone", "wolf"],
  mission: ["lone", "wolf", "card"], enemy: ["colony", "combat", "survivor"],
  random: ["location", "item", "die"], first: ["player", "token", "vote", "tie"],
  tie: ["first", "player", "break"], overrun: ["entrance", "zombie", "kill", "barricade"],
  entrance: ["zombie", "barricade", "space", "overrun"], standee: ["token", "zombie", "survivor"],
  mature: ["crossroad", "symbol", "remove"], hardcore: ["variant", "objective"],
  coop: ["variant", "co", "op"], eliminate: ["variant", "player"],
  fuel: ["gas", "station", "move"], gas: ["fuel", "station"], book: ["library", "education"],
  education: ["library", "school", "book"], hospital: ["medicine"], police: ["weapon", "station"],
  grocery: ["food", "store"]
};

/* Rulebook search: rendered by js/search-widget.js (search standard v1). It answers from this page's
   setup steps, references and Components glossary first, then ranks every rulebook page for this setup,
   and keeps the query through configuration changes (renderAll re-renders the panel; the widget
   re-mounts on the new #rules-q / #rules-results after each aid:config). _SYN feeds its synonyms,
   DW.rulesSuppress hides an older book's passages on a topic a newer book in play governs, and
   DW.precedence breaks ties toward the newer book. */
window.AID_SEARCH = {
  index: DW.rulesIndex,
  visible: (x, c) => x === "wcv" ? !!c.wc : c.has(x),
  skin: "rs", input: "#rules-q", results: "#rules-results", headingLevel: 4, sticky: ".jump-nav", partial: "always",
  synonyms: _SYN, suppress: DW.rulesSuppress, precedence: DW.precedence, onPage: "detail",
  label: (pg) => { const m = DW.expMeta[pg.x] || { name: pg.b, cls: "e-base" }; return { tag: { text: m.name, cls: "etag " + m.cls } }; },
  hint: () => "Type a few words — or ask a question.",
  noMatch: () => "No matches on this page or in the rulebooks for this setup. Try different words."
};

/* ---- Shareable / bookmarkable config (URL hash) -------------------------- */
function encodeState() {
  const p = new URLSearchParams();
  const exps = [...state.expansions];
  if (exps.length) p.set("e", exps.join(","));
  p.set("p", state.players);
  if (state.modules.size) p.set("m", [...state.modules].join(","));
  return p.toString();
}
function syncUrl() {
  const q = encodeState();
  history.replaceState(null, "", location.pathname + (q ? "#" + q : ""));
}
function decodeState() {
  const h = location.hash.replace(/^#/, "");
  if (!h) return false;
  const p = new URLSearchParams(h);
  state.expansions = new Set((p.get("e") ? p.get("e").split(",") : ["base"]).filter(Boolean));
  state.modules = new Set(p.get("m") ? p.get("m").split(",").filter(Boolean) : []);
  const pl = parseInt(p.get("p"), 10);
  if (pl >= 2 && pl <= 11) state.players = pl;
  pruneState();
  return true;
}
function copyShareLink(btn) {
  const txt = btn.textContent;
  navigator.clipboard.writeText(location.href).then(
    () => { btn.textContent = "✓ Link copied"; setTimeout(() => { btn.textContent = txt; }, 1600); },
    () => { btn.textContent = "Copy failed"; setTimeout(() => { btn.textContent = txt; }, 1600); }
  );
}

function renderAll() { renderConfigurator(); renderDetail(); renderTeach(); syncUrl(); document.dispatchEvent(new CustomEvent("aid:config", { detail: ctx() })); /* components glossary (js/comp-widget.js) */ }

/* Dock the sticky jump-nav under the variable-height topbar; offset anchors. */
function syncTopbarHeight() {
  const bar = document.querySelector(".topbar");
  if (!bar) return;
  const h = bar.offsetHeight;
  document.documentElement.style.setProperty("--topbar-h", h + "px");
  const nav = document.querySelector(".jump-nav");
  if (nav) nav.style.top = h + "px";
  const off = h + (nav ? nav.offsetHeight : 56) + 12;
  document.querySelectorAll('[id^="sec-"]').forEach(s => { s.style.scrollMarginTop = off + "px"; });
}

document.addEventListener("DOMContentLoaded", () => {
  decodeState(); pruneState(); renderAll();
  syncTopbarHeight();
  window.addEventListener("resize", syncTopbarHeight, { passive: true });
});


/* ---- Teaching script panel ------------------------------------------------ */
function renderTeach() {
  const box = document.getElementById("teach");
  if (!box || !DW.teach) return;
  const c = ctx();
  const secs = DW.teach.sections
    .filter(s => !s.when || s.when(c))
    .map(s => ({ h: (typeof s.h === "function" ? s.h(c) : s.h), html: (typeof s.body === "function" ? s.body(c) : s.body) }))
    .filter(s => s.html);
  DW._teachText = secs.map(s =>
    s.h.toUpperCase() + "\n" +
    s.html.replace(/<li>/g, "\u2022 ").replace(/<\/p>\s*<p>/g, "\n\n")
          .replace(/<[^>]+>/g, "").replace(/\n{3,}/g, "\n\n").trim()
  ).join("\n\n");
  box.innerHTML = "<div class='teach-top'><h3>\uD83D\uDCD6 Teaching Script \u2014 this setup</h3><button type='button' class='teach-copy' id='teachCopy'>\uD83D\uDCCB Copy script</button></div>" +
    "<p class='teach-note'>" + DW.teach.intro + "</p>" +
    secs.map(s => "<h4>" + s.h + "</h4>" + s.html).join("");
  document.getElementById("teachCopy").addEventListener("click", () => {
    const b = document.getElementById("teachCopy"), t = b.textContent;
    navigator.clipboard.writeText(DW._teachText || "").then(
      () => { b.textContent = "\u2713 Script copied"; setTimeout(() => { b.textContent = t; }, 1600); },
      () => { b.textContent = "Copy failed"; setTimeout(() => { b.textContent = t; }, 1600); });
  });
}
(function () {
  const b = document.getElementById("teachBtn");
  if (b) b.addEventListener("click", () => {
    const p = document.getElementById("teach");
    p.hidden = !p.hidden;
    if (!p.hidden) p.scrollIntoView({ behavior: "smooth", block: "start" });
  });
})();
