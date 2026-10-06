/* =============================================================================
   Relic Setup Utility — application logic
   Configurator (expansions + players + modes) -> live, precedence-aware
   setup instructions, board/space reference, rules reference, FAQ & search.
   ============================================================================= */

const state = {
  expansions: new Set(["base"]),   // base always on
  players: 4,
  modules: new Set()               // toggled game modes / variants
};

const $ = (sel, root = document) => root.querySelector(sel);
const el = (tag, cls, html) => { const n = document.createElement(tag); if (cls) n.className = cls; if (html != null) n.innerHTML = html; return n; };

/* ---- Validity helpers ---------------------------------------------------- */
function expEnabled(id) { return id === "base" || state.expansions.has(id); }
function requiresMet(req) { return Array.isArray(req) ? req.some(expEnabled) : expEnabled(req); }

function moduleAvailable(m) {
  return requiresMet(m.requires === undefined ? "base" : m.requires) &&
         (!m.minPlayers || state.players >= m.minPlayers);
}
function availableModules() { return RL.modules.filter(moduleAvailable); }

function maxPlayers() { return expEnabled("nemesis") ? 6 : 4; }
function nemesisCount() { return state.players <= 4 ? 1 : 2; }

/* Build the condition context used by every `when` predicate in the data. */
function ctx() {
  return {
    has: e => expEnabled(e),
    p: state.players,
    mod: id => state.modules.has(id),
    eoti: state.modules.has("eoti"),
    solBoard: expEnabled("halls") && !state.modules.has("hallsCards"),
    nemCount: nemesisCount()
  };
}

/* Drop modules / state that became invalid after a configurator change. */
function pruneState() {
  if (state.players < 2) state.players = 2;
  if (state.players > maxPlayers()) state.players = maxPlayers();
  [...state.modules].forEach(id => {
    const m = RL.modules.find(x => x.id === id);
    if (!m || !moduleAvailable(m)) state.modules.delete(id);
  });
}

/* ---- Rendering: configurator -------------------------------------------- */
function renderConfigurator() {
  // Expansions
  const ex = $("#expansions"); ex.innerHTML = "";
  RL.expansions.forEach(e => {
    const on = expEnabled(e.id);
    const chip = el("button", "chip" + (on ? " on" : "") + (e.always ? " locked" : "") + " " + RL.expMeta[e.id].cls + "-chip");
    chip.innerHTML = `<span class="chip-name">${e.short}</span>`;
    chip.title = e.name + " — " + e.blurb;
    if (!e.always) chip.onclick = () => {
      on ? state.expansions.delete(e.id) : state.expansions.add(e.id);
      pruneState(); renderAll();
    };
    ex.appendChild(chip);
  });

  // Players
  const pl = $("#players"); pl.innerHTML = "";
  for (let p = 2; p <= 6; p++) {
    const ok = p <= maxPlayers();
    const b = el("button", "pbtn" + (state.players === p ? " on" : "") + (ok ? "" : " off"), String(p));
    b.title = ok ? `${p} players` : `${p} players requires the Nemesis expansion (extra colours)`;
    b.disabled = !ok;
    if (ok) b.onclick = () => { state.players = p; pruneState(); renderAll(); };
    pl.appendChild(b);
  }

  // Modules, grouped by type
  const op = $("#modules"); op.innerHTML = "";
  const avail = availableModules();
  if (!avail.length) {
    op.appendChild(el("p", "muted", "Add an expansion to unlock game modes and variants (Enemies of the Imperium needs Nemesis and 3+ players)."));
  } else {
    RL.moduleTypes.forEach(gt => {
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
        chip.onclick = () => {
          on ? state.modules.delete(m.id) : state.modules.add(m.id);
          pruneState(); renderAll();
        };
        chips.appendChild(chip);
      });
      group.appendChild(chips);
      op.appendChild(group);
    });
  }
}

/* ---- Rendering: detail (full setup + references) ------------------------- */
function renderDetail() {
  const wrap = $("#detail");
  const c = ctx();

  // Header: what's on the table
  const expNames = RL.expansions.filter(e => expEnabled(e.id)).map(e => e.short);
  const modChips = RL.modules.filter(m => state.modules.has(m.id)).map(m => m.name);
  const headHtml = `<div class="detail-head">
      <button class="share-btn" onclick="copyShareLink(this)" title="Copy a link that reopens this exact configuration">🔗 Copy setup link</button>
      <div class="dh-mode">Your Relic Setup</div>
      <p class="dh-desc">Clean, step-by-step setup for the exact expansions and modes below, following the base game's 12 setup steps with each change tagged by its source. Only steps that apply to your table are shown.</p>
      <div class="dh-meta">
        <span class="meta-pill">${state.players} players${c.eoti ? ` (${c.nemCount} ${c.nemCount === 1 ? "nemesis" : "nemeses"})` : ""}</span>
        ${expNames.map(t => `<span class="meta-pill">${t}</span>`).join("")}
        ${modChips.map(t => `<span class="meta-pill opt">${t}</span>`).join("")}
      </div>
    </div>`;

  // Jump nav
  const faqItems = RL.faq.filter(f => !f.when || f.when(c));
  const navItems = [
    ["sec-search", "🔍 Search"],
    ["sec-setup", "Setup Steps"],
    ["sec-howto", "How to Play"],
    ["sec-boards", "Boards & Spaces"],
    faqItems.length ? ["sec-faq", "FAQ"] : null,
    ["sec-ref", "Reference Table"]
  ].filter(Boolean);
  const navHtml = `<nav class="jump-nav" aria-label="Jump to section">${
    navItems.map(([id, label]) => `<a href="#${id}" class="jn">${label}</a>`).join("")
  }</nav>`;

  const searchHtml = buildSearchPanel(c);

  // ---- Setup steps: merged, precedence-aware, grouped by phase ----
  const steps = RL.setup.filter(s => !s.when || s.when(c));
  let n = 0, blocks = "";
  RL.phases.forEach((phaseName, pi) => {
    const phaseSteps = steps.filter(s => s.ph === pi);
    if (!phaseSteps.length) return;
    blocks += `<section class="setup-block">
        <h3>${phaseName}</h3>
        <ol class="ustep">${phaseSteps.map(s => {
          n++;
          const m = RL.expMeta[s.exp];
          const d = s.d.replace("{NEM}", `${c.nemCount} ${c.nemCount === 1 ? "nemesis" : "nemeses"}`);
          return `<li><span class="snum">${n}</span>
            <div class="sbody"><span class="st">${s.t}</span> <span class="etag ${m.cls}">${m.name}</span>
            <div class="sd">${d}</div>${s.src ? `<div class="ssrc">${s.src}</div>` : ""}</div></li>`;
        }).join("")}</ol>
      </section>`;
  });
  let html = `<div class="legend" id="sec-setup">Each step is tagged with the book it comes from and cites its rulebook source. Change the expansions and modes above and the steps update instantly.</div>`;
  html += `<div class="steps">${blocks}</div>`;

  // ---- How to play ----
  html += `<div id="sec-howto">${buildHowToPlay(c)}</div>`;

  // ---- Boards & spaces ----
  html += `<div id="sec-boards">${buildBoards(c)}</div>`;

  // ---- FAQ ----
  if (faqItems.length) html += `<div id="sec-faq">${buildFaq(c)}</div>`;

  // ---- Reference table ----
  html += `<div id="sec-ref">${buildReference(c)}</div>`;

  wrap.innerHTML = headHtml + navHtml + searchHtml + html;
  syncTopbarHeight();
}

/* ---- How to Play — core loop + active-module rules ----------------------- */
function buildHowToPlay(c) {
  const tagHtml = tag => {
    const id = typeof tag === "function" ? tag(c) : tag;
    const m = RL.expMeta[id];
    return m ? `<span class="etag ${m.cls}">${m.name}</span> ` : "";
  };
  // An item may carry a nested list: { t, sub: [...], num: true } renders the
  // sub-entries as a numbered (num) or bulleted sequence under the lead-in.
  const subList = i => {
    if (!i.sub) return "";
    const entries = i.sub
      .filter(s => typeof s === "string" || !s.when || s.when(c))
      .map(s => `<li>${typeof s === "string" ? s : s.t}</li>`).join("");
    if (!entries) return "";
    return i.num ? `<ol class="sub">${entries}</ol>` : `<ul class="sub">${entries}</ul>`;
  };
  const block = (title, items, cls = "", tag) => {
    const lis = items
      .filter(i => typeof i === "string" || !i.when || i.when(c))
      .map(i => typeof i === "string"
        ? `<li>${i}</li>`
        : `<li>${i.tag ? tagHtml(i.tag) : ""}${i.t}${i.src ? ` <span class="htp-src">${i.src}</span>` : ""}${subList(i)}</li>`)
      .join("");
    const head = (tag ? tagHtml(tag) : "") + title;
    return lis ? `<section class="htp-sec ${cls}"><h5>${head}</h5><ul>${lis}</ul></section>` : "";
  };

  let body = "";
  RL.howToPlay.core.forEach(g => { body += block(g.h, g.items); });
  RL.howToPlay.modules.filter(m => m.when(c)).forEach(m => {
    body += block(m.h, m.items, "mod", m.tag);
  });

  return `<div class="howto">
      <h3>How to Play — Rules Reference</h3>
      <div class="legend">A concise reference for your exact table. Coloured tags mark which book an overlapping rule comes from.</div>
      <div class="htp-grid">${body}</div>
    </div>`;
}

/* ---- Boards & spaces reference -------------------------------------------- */
function buildBoards(c) {
  let blocks = "";
  RL.boards.filter(b => b.when(c)).forEach(b => {
    blocks += `<section class="loc-board"><h5>${b.name}</h5><ul>${
      b.items.filter(i => typeof i === "string" || !i.when || i.when(c))
        .map(i => `<li>${typeof i === "string" ? i : i.t}</li>`).join("")
    }</ul></section>`;
  });
  return `<div class="locations"><h3>Boards & Notable Spaces</h3>
      <div class="legend">The tiers, areas and key spaces on your table — where to buy wargear and Power cards, shed Corruption, respawn, and cross between tiers.</div>
      <div class="loc-grid">${blocks}</div></div>`;
}

/* ---- Contextual FAQ ------------------------------------------------------ */
function buildFaq(c) {
  const items = RL.faq.filter(f => !f.when || f.when(c));
  if (!items.length) return "";
  return `<div class="faq"><h3>Clarifications — Rulings for This Setup</h3>
      <div class="faq-list">${
        items.map(f => `<details class="faq-item"><summary>${f.q}</summary><div class="faq-a">${f.a}</div></details>`).join("")
      }</div></div>`;
}

/* ---- Key-numbers reference table ------------------------------------------ */
function buildReference(c) {
  const rows = RL.refRows.filter(r => !r.when || r.when(c))
    .map(r => `<tr><td>${r.k}</td><td>${r.v}</td><td class="ref-src">${r.src || ""}</td></tr>`);
  const notes = RL.refNotes
    .filter(n => typeof n === "string" || !n.when || n.when(c))
    .map(n => `<li>${typeof n === "string" ? n : n.t}</li>`);
  return `<div class="reference"><h3>Reference Table</h3>
      <div class="legend">The numbers that come up at the table, for your exact setup.</div>
      <div class="ref-grid">
        <table class="ref-table">
          <thead><tr><th>Rule</th><th>Value</th><th>Source</th></tr></thead>
          <tbody>${rows.join("")}</tbody>
        </table>
        <ul class="ref-notes">${notes.join("")}</ul>
      </div></div>`;
}

/* ---- Rulebook search panel ----------------------------------------------- */
function buildSearchPanel(c) {
  const books = RL.expansions.filter(e => expEnabled(e.id)).map(e => RL.expMeta[e.id].name);
  return `<section class="rules-search" id="sec-search">
      <h3>Search the Rulebooks</h3>
      <p class="rs-sub">Searches this page first, then the ${books.join(", ")} rulebook${books.length > 1 ? "s" : ""} for this setup — type keywords <i>or ask a plain question</i> (“how do I gain a level?”). Rulebook results are ranked by relevance and each cites its book and page; “Read the whole page” opens the full text.</p>
      <input type="search" id="rules-q" class="rs-input" placeholder="Ask a question, or search a rule or component…" autocomplete="off" spellcheck="false">
      <div id="rules-results" class="rs-results"></div>
    </section>`;
}

/* Relic vocabulary map so plain questions hit the right rules. The shared search
   (js/search-widget.js) takes it as `synonyms`: a synonym scores at 0.45 and never
   counts toward "all your words". */
const _SYN = {
  battle: ["fight", "enemy", "score", "combat"], fight: ["battle"], combat: ["battle"],
  enemy: ["battle", "threat", "trophy"], monster: ["enemy", "threat"],
  trophy: ["level", "spend", "point"], level: ["trophy", "peg", "reward"],
  relic: ["mission", "inner", "artefact"], artefact: ["relic"],
  mission: ["relic", "objective", "completed"], objective: ["mission", "scenario"],
  influence: ["token", "currency", "buy", "spend"], money: ["influence"], buy: ["influence", "wargear"],
  wargear: ["weapon", "armour", "equipment", "buy"], weapon: ["wargear", "battle"],
  armour: ["wargear", "battle"], armor: ["armour", "wargear"], equipment: ["wargear"],
  corruption: ["activation", "threshold", "corrupted", "mutation"], corrupted: ["corruption", "threshold"],
  vanquish: ["life", "zero", "sanctuary"], die: ["vanquish", "life"], death: ["vanquish"],
  life: ["vanquish", "dial", "heal"], heal: ["life"],
  power: ["card", "number", "substitute"], substitute: ["power", "might", "roll"],
  charge: ["token", "spend"],
  dice: ["roll", "explode"], roll: ["dice", "explode", "reroll"], explode: ["dice", "roll", "six"],
  skill: ["test", "target", "bonus"], test: ["skill", "target"],
  evade: ["enemy", "ability"],
  tier: ["inner", "middle", "outer", "cross"], inner: ["tier", "warp", "rift", "relic"],
  warp: ["rift", "inner"], rift: ["warp", "inner", "guardian"],
  scenario: ["confrontation", "sheet", "win"], confrontation: ["scenario", "win"], win: ["scenario", "confrontation", "infamy"],
  movement: ["move", "space", "roll"], move: ["movement", "space"], space: ["movement", "area", "board"],
  threat: ["icon", "card", "deck", "enemy"], icon: ["threat"],
  event: ["threat", "engagement"], encounter: ["threat", "engagement"], asset: ["limit", "acquire", "wargear"],
  engagement: ["resolve", "phase"], exploration: ["draw", "threat", "phase"], experience: ["trophy", "level", "phase"],
  duel: ["skill", "apostate", "challenge"], apostate: ["duel", "devotee", "steal"], devotee: ["apostate"],
  steal: ["duel", "asset"],
  nemesis: ["infamy", "imperium", "might"], infamy: ["nemesis", "win", "dial"],
  imperium: ["agent", "arsenal", "nemesis"], agent: ["imperium", "battle", "nemesis"],
  arsenal: ["imperium", "nemesis", "asset"], might: ["nemesis", "power"], crisis: ["nemesis"],
  bounty: ["nemesis", "defeat"],
  affiliation: ["token", "champion", "terra"], champion: ["affiliation", "sanctum"],
  terra: ["sol", "palace", "affiliation"], sol: ["terra", "board", "tier"],
  gateway: ["arrow", "sol", "cross"], palace: ["imperial", "tier", "titanolith"],
  titanolith: ["palace", "direction"], orange: ["threat", "deck"],
  attribute: ["strength", "willpower", "cunning", "dial"],
  strength: ["red", "attribute"], willpower: ["blue", "attribute"], cunning: ["yellow", "attribute"],
  red: ["strength", "ork"], blue: ["willpower", "tyranid"], yellow: ["cunning", "eldar"],
  ork: ["red"], tyranid: ["blue"], eldar: ["yellow"],
  character: ["player", "sheet"], player: ["character"],
  turn: ["phase", "miss"], miss: ["turn", "skip"], skip: ["miss", "turn"],
  discard: ["pile", "excess"], limit: ["asset", "power", "discard"],
  first: ["oldest", "start"], oldest: ["first"],
  webway: ["portal", "special", "movement"], portal: ["webway"],
  timing: ["start", "end", "during"], cannot: ["golden", "rule"], golden: ["rule", "cannot"]
};

/* Rulebook search: rendered by js/search-widget.js (search standard v1). It answers from this page's
   setup steps, references and Components glossary first, then ranks every rulebook page for this setup,
   and keeps the query through configuration changes (renderAll re-renders the panel; the widget
   re-mounts on the new #rules-q / #rules-results after each aid:config). _SYN feeds its synonyms,
   RL.rulesSuppress hides an older book's passages on a topic a newer book in play governs, and
   RL.precedence breaks ties toward the newer book. */
window.AID_SEARCH = {
  index: RL.rulesIndex,
  visible: (x, c) => c.has(x),
  skin: "rs", input: "#rules-q", results: "#rules-results", headingLevel: 4, sticky: ".jump-nav", partial: "always",
  synonyms: _SYN, suppress: RL.rulesSuppress, precedence: RL.precedence, onPage: "detail",
  label: (pg) => { const m = RL.expMeta[pg.x] || { name: pg.b, cls: "e-base" }; return { tag: { text: m.name, cls: "etag " + m.cls } }; },
  hint: () => "Type a few words — or ask a question.",
  noMatch: () => "No matches on this page or in the rulebooks for this setup. Try different words."
};

/* ---- Shareable / bookmarkable config (URL hash) -------------------------- */
function encodeState() {
  const p = new URLSearchParams();
  const exps = [...state.expansions].filter(e => e !== "base");
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
  state.expansions = new Set(["base", ...(p.get("e") ? p.get("e").split(",") : [])].filter(Boolean));
  const pl = parseInt(p.get("p"), 10);
  if (pl >= 2 && pl <= 6) state.players = pl;
  state.modules = new Set(p.get("m") ? p.get("m").split(",").filter(Boolean) : []);
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
  decodeState(); renderAll();
  syncTopbarHeight();
  window.addEventListener("resize", syncTopbarHeight, { passive: true });
});


/* ---- Teaching script panel ------------------------------------------------ */
function renderTeach() {
  const box = document.getElementById("teach");
  if (!box || !RL.teach) return;
  const c = ctx();
  const secs = RL.teach.sections
    .filter(s => !s.when || s.when(c))
    .map(s => ({ h: (typeof s.h === "function" ? s.h(c) : s.h), html: (typeof s.body === "function" ? s.body(c) : s.body) }))
    .filter(s => s.html);
  RL._teachText = secs.map(s =>
    s.h.toUpperCase() + "\n" +
    s.html.replace(/<li>/g, "\u2022 ").replace(/<\/p>\s*<p>/g, "\n\n")
          .replace(/<[^>]+>/g, "").replace(/\n{3,}/g, "\n\n").trim()
  ).join("\n\n");
  box.innerHTML = "<div class='teach-top'><h3>\uD83D\uDCD6 Teaching Script \u2014 this setup</h3><button type='button' class='teach-copy' id='teachCopy'>\uD83D\uDCCB Copy script</button></div>" +
    "<p class='teach-note'>" + RL.teach.intro + "</p>" +
    secs.map(s => "<h4>" + s.h + "</h4>" + s.html).join("");
  document.getElementById("teachCopy").addEventListener("click", () => {
    const b = document.getElementById("teachCopy"), t = b.textContent;
    navigator.clipboard.writeText(RL._teachText || "").then(
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
