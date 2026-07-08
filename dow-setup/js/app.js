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

  // Active rulebooks for this setup (drives search scope).
  DW._searchCtx = { exps: DW.expansions.map(e => e.id).filter(expEnabled) };

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
            <div class="sd">${F(s.d, c)}</div>${s.src ? `<div class="ssrc">${s.src}</div>` : ""}</div></li>`;
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
      return `<li>${show ? tagHtml(tag) : ""}${F(i.t, c)}${i.src ? ` <span class="htp-src">${i.src}</span>` : ""}</li>`;
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
        <li>The simultaneous actions step is limited by the 2-minute sand timer (flipped by whoever finishes first${c.mod("quickplay") ? " — Quick Play: one shared 2-minute timer for everyone" : ""}).</li>
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
      <ul class="ref-notes"><li>${DW.playerRef.twoPlayerNote}</li>${DW.playerRef.notes.map(n => `<li>${n}</li>`).join("")}</ul>`;
  }
  return `<div class="reference"><h3>Reference Table</h3>
      <div class="legend">Core numbers for your game. ${DW.playerRef.src}.</div>
      <div class="ref-grid">${table}</div></div>`;
}

/* ---- Rulebook search panel ----------------------------------------------- */
function buildSearchPanel(c) {
  const books = DW.expansions.filter(e => expEnabled(e.id)).map(e => e.short + " rulebook");
  return `<section class="rules-search" id="sec-search">
      <h3>Search the Rulebooks</h3>
      <p class="rs-sub">Searches the ${books.join(", ")} for this setup — type keywords <i>or ask a plain question</i> (“what happens when an entrance is overrun?”). Results are ranked by relevance and cite their book and page; expand any result for the full passage.</p>
      <input type="search" id="rules-q" class="rs-input" placeholder="Ask a question, or search a rule or component…" oninput="dwSearch(this.value)" autocomplete="off" spellcheck="false">
      <div id="rules-results" class="rs-results"><p class="rs-hint">Type a few words — or ask a question.</p></div>
    </section>`;
}

function _escHtml(s) { return s.replace(/[&<>]/g, ch => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[ch])); }
function _escReg(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); }

/* ---- Smart search: BM25 relevance + stop-words + light stemming + synonyms.
   Fully client-side: handles natural-language questions while keeping precise
   multi-word term matching. -------------------------------------------------- */
const _STOP = new Set(("a an the and or but if then of to in on for from with as at by be is are was were " +
  "do does did can could should would will may might must have has had this that these those it its it's i you " +
  "he she they we me my your our their what when where which who whom why how whats hows than into over under " +
  "about yours during while there here not no yes get got make use using used such per each any all some many much " +
  "you're i'm we're they're do i").split(" "));

/* Dead of Winter vocabulary map so plain questions hit the right rules. Keys
   and values are in the (plural-normalised) form the stemmer produces. */
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

/* Plural-only stemmer: safe normalisation (zombies->zombie, crises->crisis-ish)
   without over-stemming that breaks pairs like win / winning. */
function _stem(w) {
  if (w.length <= 3) return w;
  w = w.replace(/('s|s')$/, "");
  if (/ies$/.test(w) && w.length > 4) return w.slice(0, -3) + "y";
  if (/(ches|shes|sses|xes|zes)$/.test(w)) return w.slice(0, -2);
  if (/s$/.test(w) && !/(ss|us|is|as|os)$/.test(w)) return w.slice(0, -1);
  return w;
}
/* Content tokens (lowercased, stop-words removed, stemmed). */
function _tok(text) {
  const out = [];
  (text.toLowerCase().match(/[a-z0-9]+/g) || []).forEach(w => {
    if (_STOP.has(w) || w.length < 2) return;
    const s = _stem(w);
    if (s.length >= 2) out.push(s);
  });
  return out;
}

/* Build the inverted index once (lazily, on first search). */
function _buildSearchIndex() {
  if (DW._si) return DW._si;
  const docs = [], inv = new Map();
  let total = 0;
  DW.rulesIndex.forEach((e, idx) => {
    const flat = e.t.replace(/\n/g, " ");
    const toks = _tok(flat);
    const tf = new Map();
    toks.forEach(t => tf.set(t, (tf.get(t) || 0) + 1));
    tf.forEach((cnt, t) => { (inv.get(t) || inv.set(t, []).get(t)).push([idx, cnt]); });
    docs.push({ len: toks.length || 1, flatLower: flat.toLowerCase() });
    total += toks.length;
  });
  DW._si = { docs, inv, N: docs.length, avgdl: total / Math.max(1, docs.length) };
  return DW._si;
}

/* Highlight every query-term occurrence (prefix match) in an HTML-escaped string. */
function _hlTerms(text, terms) {
  let s = _escHtml(text);
  const alt = terms.filter(t => t.length >= 3).map(t => _escReg(t) + "\\w*");
  if (alt.length) s = s.replace(new RegExp("\\b(" + alt.join("|") + ")", "gi"), "<mark>$1</mark>");
  return s;
}
function _snip(text, terms, phrase) {
  const lt = text.toLowerCase();
  let pos = phrase && phrase.includes(" ") && lt.includes(phrase) ? lt.indexOf(phrase) : -1;
  if (pos < 0) for (const t of terms) { const m = lt.search(new RegExp("\\b" + _escReg(t))); if (m >= 0 && (pos < 0 || m < pos)) pos = m; }
  if (pos < 0) pos = 0;
  const start = Math.max(0, pos - 80), end = Math.min(text.length, pos + 210);
  const s = (start > 0 ? "… " : "") + text.slice(start, end) + (end < text.length ? " …" : "");
  return _hlTerms(s, terms);
}
function _fullPassage(text, terms) {
  return text.split("\n").map(p => `<p>${_hlTerms(p, terms)}</p>`).join("");
}

function dwSearch(q) {
  const box = document.getElementById("rules-results");
  if (!box) return;
  const phrase = (q || "").trim().toLowerCase().replace(/\s+/g, " ");
  if (phrase.length < 2) { box.innerHTML = `<p class="rs-hint">Type a few words — or ask a question.</p>`; return; }
  if (!DW.rulesIndex) { box.innerHTML = `<p class="rs-hint">Loading rulebook index…</p>`; return; }
  const si = _buildSearchIndex();

  const rawWords = phrase.match(/[a-z0-9]+/g) || [];
  let qterms = [...new Set(rawWords.filter(w => !_STOP.has(w)).map(_stem).filter(s => s.length >= 2))];
  if (!qterms.length) qterms = [...new Set(rawWords.map(_stem).filter(s => s.length >= 2))];
  if (!qterms.length) { box.innerHTML = `<p class="rs-hint">Try a more specific word.</p>`; return; }
  // Question vs. exact-term mode (the latter requires every term).
  const isQuestion = /\b(how|what|why|when|where|who|which|can|do|does|should|is|are|will|if)\b/.test(phrase) || phrase.includes("?");
  const termMode = !isQuestion && qterms.length <= 3;
  // Synonyms are optional, lower-weighted extra terms.
  const synTerms = [];
  qterms.forEach(t => (_SYN[t] || []).forEach(s => { if (!qterms.includes(s) && !synTerms.includes(s)) synTerms.push(s); }));
  const allTerms = qterms.concat(synTerms);

  const active = new Set((DW._searchCtx || { exps: ["base"] }).exps);
  const gov = (DW.rulesSuppress || []).map(s => { const ip = s.chain.filter(e => active.has(e)); return ip.length ? ip[ip.length - 1] : null; });
  const prec = DW.precedence, k1 = 1.5, b = 0.75;

  // BM25 accumulation over candidate docs (union of postings).
  const acc = new Map();
  allTerms.forEach((t, ti) => {
    const post = si.inv.get(t); if (!post) return;
    const idf = Math.log(1 + (si.N - post.length + 0.5) / (post.length + 0.5));
    const w = ti < qterms.length ? 1 : 0.45;
    post.forEach(([idx, tf]) => {
      const dl = si.docs[idx].len;
      const s = idf * (tf * (k1 + 1)) / (tf + k1 * (1 - b + b * dl / si.avgdl)) * w;
      let cur = acc.get(idx); if (!cur) { cur = { score: 0, hits: new Set() }; acc.set(idx, cur); }
      cur.score += s; if (ti < qterms.length) cur.hits.add(t);
    });
  });

  const results = [];
  for (const [idx, info] of acc) {
    const e = DW.rulesIndex[idx];
    if (!active.has(e.x)) continue;
    if (termMode && info.hits.size < qterms.length) continue;          // require all terms in term mode
    const lt = si.docs[idx].flatLower;
    // suppress superseded rulebook passages on curated conflict topics
    let sup = false;
    for (let k = 0; k < (DW.rulesSuppress || []).length; k++) {
      const s = DW.rulesSuppress[k], g = gov[k];
      if (g && e.x !== g && s.chain.includes(e.x) && s.kw.some(kw => lt.includes(kw))) { sup = true; break; }
    }
    if (sup) continue;
    let score = info.score;
    if (phrase.length >= 3 && lt.includes(phrase)) score *= 2.4;        // exact phrase boost
    score *= 1 + (info.hits.size - 1) * 0.15;                           // reward covering more query terms
    score += (prec[e.x] || 0) * 0.003;                                  // tiny recency tiebreak among books
    results.push({ e, score });
  }
  results.sort((a, b2) => b2.score - a.score);
  const top = results.slice(0, 30);

  if (!top.length) { box.innerHTML = `<p class="rs-hint">No matches in the rulebooks for this setup. Try different words.</p>`; return; }
  const countLine = `<div class="rs-count">${results.length} matching page${results.length === 1 ? "" : "s"}${results.length > top.length ? ` · showing top ${top.length}` : ""}</div>`;
  box.innerHTML = countLine +
    top.map(r => {
      const e = r.e;
      const m = DW.expMeta[e.x] || { name: e.b, cls: "e-base" };
      return `<details class="rs-item">
          <summary class="rs-sum">
            <div class="rs-meta"><span class="etag ${m.cls}">${m.name}</span> <span class="rs-page">${e.b} · p.${e.p}</span><span class="rs-toggle">Full passage</span></div>
            <div class="rs-snip">${_snip(e.t.replace(/\n/g, " "), qterms, phrase)}</div>
          </summary>
          <div class="rs-full">${_fullPassage(e.t, qterms)}</div>
        </details>`;
    }).join("");
}

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

function renderAll() { renderConfigurator(); renderDetail(); syncUrl(); }

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
