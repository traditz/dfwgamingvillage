/* =============================================================================
   BSG Setup Utility — application logic
   Configurator -> generates every valid setup "module" -> gallery -> detail.
   ============================================================================= */

const state = {
  expansions: new Set(["base"]),   // base always on
  players: 5,
  options: new Set(),              // toggled options that act as gallery filters
  selected: null                   // currently opened configuration key
};

const $ = (sel, root = document) => root.querySelector(sel);
const el = (tag, cls, html) => { const n = document.createElement(tag); if (cls) n.className = cls; if (html != null) n.innerHTML = html; return n; };

/* ---- Validity helpers ---------------------------------------------------- */
function expEnabled(id) { return id === "base" || state.expansions.has(id); }

/* Seven-player game is only possible when a Cylon Leader exists — i.e. Pegasus
   or Daybreak is in play (Pegasus p.18, extended by Exodus p.22 / Daybreak p.16). */
function canSeven() { return expEnabled("pegasus") || expEnabled("daybreak"); }
function maxPlayers() { return canSeven() ? 7 : 6; }
function sevenForced() { return state.players === 7; }   // Cylon Leader mandatory

function availableObjectives() {
  return BSG.objectives.filter(o => {
    if (!expEnabled(o.requires)) return false;
    const max = canSeven() ? 7 : o.players[1];
    return state.players >= o.players[0] && state.players <= max;
  });
}

// `requires` may be one expansion id or a list (any-of). e.g. Cylon Leaders = Pegasus OR Daybreak.
function requiresMet(req) {
  return Array.isArray(req) ? req.some(expEnabled) : expEnabled(req);
}

function availableOptions() {
  // A 7-player game forces a Cylon Leader even if not explicitly selected.
  const clInPlay = state.options.has("cylonLeaders") || sevenForced();
  return BSG.options.filter(o =>
    requiresMet(o.requires) &&
    (!o.minPlayers || state.players >= o.minPlayers) &&
    (!o.onlyPlayers || o.onlyPlayers.includes(state.players)) &&
    !(o.disabledBy && expEnabled(o.disabledBy)) &&   // e.g. Daybreak disables Sympathetic Cylon
    !(o.disabledByOption === "cylonLeaders" && clInPlay));   // Sympathetic Cylon can't coexist with a Cylon Leader
}

/* Enumerate valid configurations. The selected optional modules are exactly
   the modules included in every generated setup — an unselected module never
   appears. The gallery therefore shows one card per valid objective for the
   currently-selected module set. (A 7-player game always includes a Cylon Leader.) */
function enumerateConfigs() {
  const objs = availableObjectives();
  const selected = availableOptions()
    .filter(o => state.options.has(o.id))
    .map(o => o.id);
  if (sevenForced() && !selected.includes("cylonLeaders")) selected.push("cylonLeaders");
  return objs.map(obj => ({ objective: obj.id, options: new Set(selected) }));
}

function configKey(c) { return c.objective + "|" + [...c.options].sort().join(","); }

function configTitle(c) {
  const obj = BSG.objectives.find(o => o.id === c.objective);
  const tags = [...c.options].map(id => BSG.options.find(o => o.id === id).name);
  return { name: obj.name, tags };
}

/* ---- Rendering: configurator -------------------------------------------- */
function renderConfigurator() {
  const ex = $("#expansions"); ex.innerHTML = "";
  BSG.expansions.forEach(e => {
    const on = expEnabled(e.id);
    const chip = el("button", "chip" + (on ? " on" : "") + (e.always ? " locked" : ""));
    chip.innerHTML = `<span class="chip-name">${e.name}</span>`;
    chip.title = e.blurb;
    if (!e.always) chip.onclick = () => {
      on ? state.expansions.delete(e.id) : state.expansions.add(e.id);
      // drop options/players that became invalid
      pruneState(); renderAll();
    };
    ex.appendChild(chip);
  });

  const pl = $("#players"); pl.innerHTML = "";
  for (let p = 3; p <= maxPlayers(); p++) {
    const b = el("button", "pbtn" + (state.players === p ? " on" : ""), String(p));
    if (p === 7) b.title = BSG.sevenPlayer.note;
    b.onclick = () => { state.players = p; pruneState(); renderAll(); };
    pl.appendChild(b);
  }

  const op = $("#options"); op.innerHTML = "";
  const opts = availableOptions();
  if (!opts.length) { op.appendChild(el("p", "muted", "Enable an expansion to unlock optional modules.")); }
  opts.forEach(o => {
    // A 7-player game forces a Cylon Leader — show it locked-on.
    const forced = o.id === "cylonLeaders" && sevenForced();
    const on = state.options.has(o.id) || forced;
    const chip = el("button", "chip small" + (on ? " on" : "") + (forced ? " locked" : ""));
    chip.innerHTML = `<span class="chip-name">${o.name}${forced ? " ·  required at 7" : ""}</span>`;
    chip.title = forced ? "Required: a 7-player game must include a Cylon Leader." : o.description;
    if (!forced) chip.onclick = () => { on ? state.options.delete(o.id) : state.options.add(o.id); pruneState(); renderAll(); };
    op.appendChild(chip);
  });
  if (sevenForced()) op.appendChild(el("p", "muted seven-note", BSG.sevenPlayer.note));
}

function pruneState() {
  if (state.players > maxPlayers()) state.players = 6;
  [...state.options].forEach(id => {
    const o = BSG.options.find(x => x.id === id);
    if (!o || !requiresMet(o.requires) || (o.minPlayers && state.players < o.minPlayers) ||
        (o.onlyPlayers && !o.onlyPlayers.includes(state.players)) ||
        (o.disabledBy && expEnabled(o.disabledBy)) ||
        (o.disabledByOption && state.options.has(o.disabledByOption))) state.options.delete(id);
  });
  if (state.selected) {
    const stillValid = enumerateConfigs().some(c => configKey(c) === state.selected);
    if (!stillValid) state.selected = null;
  }
}

/* ---- Rendering: gallery -------------------------------------------------- */
function renderGallery() {
  const grid = $("#gallery"); grid.innerHTML = "";
  const configs = enumerateConfigs();
  $("#galleryCount").textContent = `${configs.length} setup${configs.length === 1 ? "" : "s"}`;
  if (!configs.length) {
    grid.appendChild(el("p", "muted", "No valid setups for this player count. Adjust expansions or players."));
    return;
  }
  configs.forEach(c => {
    const { name, tags } = configTitle(c);
    const card = el("button", "card" + (state.selected === configKey(c) ? " active" : ""));
    const obj = BSG.objectives.find(o => o.id === c.objective);
    card.innerHTML = `
      <div class="card-mode">${name}</div>
      <div class="card-sum">${obj.summary}</div>
      <div class="card-tags">${tags.length ? tags.map(t => `<span class="tag">${t}</span>`).join("") : `<span class="tag base">Core only</span>`}</div>`;
    card.onclick = () => { state.selected = configKey(c); renderAll(); $("#detail").scrollIntoView({behavior:"smooth", block:"start"}); };
    grid.appendChild(card);
  });
}

/* ---- Rendering: detail (full setup) -------------------------------------- */
function renderDetail() {
  const wrap = $("#detail");
  if (!state.selected) {
    wrap.innerHTML = `<div class="placeholder"><h2>Select a setup</h2>
      <p>Pick a mode card above to see clean, step-by-step setup instructions and the rule diagrams for that exact configuration.</p></div>`;
    return;
  }
  const config = enumerateConfigs().find(c => configKey(c) === state.selected);
  const obj = BSG.objectives.find(o => o.id === config.objective);
  const { tags } = configTitle(config);

  // Compose the ordered setup procedure for this configuration.
  const headHtml = `<div class="detail-head">
      <button class="share-btn" onclick="copyShareLink(this)" title="Copy a link that reopens this exact setup">🔗 Copy setup link</button>
      <div class="dh-mode">${obj.name}</div>
      <p class="dh-desc">${obj.description}</p>
      <div class="dh-meta">
        <span class="meta-pill">${state.players} players</span>
        ${tags.map(t => `<span class="meta-pill opt">${t}</span>`).join("")}
      </div>
    </div>`;

  // Condition context for resolving the unified setup sequence.
  // cyl = a Cylon Leader is in play (selected, or mandatory in a 7-player game).
  const cylonLeaderInPlay = config.options.has("cylonLeaders") || state.players === 7;
  const c = {
    has: e => expEnabled(e),
    p: state.players,
    obj: config.objective,
    opt: id => config.options.has(id),
    cyl: cylonLeaderInPlay
  };

  // Active rulebooks for this setup (drives the search scope + suppression).
  BSG._searchCtx = { exps: ["base", "pegasus", "exodus", "daybreak"].filter(expEnabled) };

  // --- Config-aware section list for the jump-nav ---
  const faqItems = BSG.faq.filter(f => !f.when || f.when(c));
  const hasReckless = BSG.reckless.when(c);
  const hasSetupDiag = BSG.diagrams.some(d => d.group === "setup" && d.when(c));
  const navItems = [
    ["sec-search", "🔍 Search"],
    ["sec-setup", "Setup Steps"],
    ["sec-loyalty", "Loyalty Deck"],
    ["sec-howto", "How to Play"],
    hasReckless ? ["sec-reckless", "Reckless"] : null,
    ["sec-locations", "Locations"],
    faqItems.length ? ["sec-faq", "FAQ"] : null,
    hasSetupDiag ? ["sec-setupdiag", "Setup Diagrams"] : null,
    ["sec-charts", "Reference Charts"]
  ].filter(Boolean);
  const navHtml = `<nav class="jump-nav" aria-label="Jump to section">${
    navItems.map(([id, label]) => `<a href="#${id}" class="jn">${label}</a>`).join("")
  }</nav>`;
  const searchHtml = buildSearchPanel(c);

  let html = "";

  // Resolve the merged, precedence-aware step list (only applicable rulings).
  const steps = BSG.setup.filter(s => !s.when || s.when(c));

  // Render as ONE continuous numbered list, grouped by phase, each step tagged.
  let n = 0, blocks = "";
  BSG.phases.forEach((phaseName, pi) => {
    const phaseSteps = steps.filter(s => s.ph === pi);
    if (!phaseSteps.length) return;
    blocks += `<section class="setup-block">
        <h3>${phaseName}</h3>
        <ol class="ustep">${phaseSteps.map(s => {
          n++;
          const m = BSG.expMeta[s.exp];
          return `<li><span class="snum">${n}</span>
            <div class="sbody"><span class="st">${s.t}</span> <span class="etag ${m.cls}">${m.name}</span>
            <div class="sd">${s.d}</div>${s.src ? `<div class="ssrc">${s.src}</div>` : ""}</div></li>`;
        }).join("")}</ol>
      </section>`;
  });
  html += `<div class="legend" id="sec-setup">Each step is tagged with the expansion it comes from and cites its rulebook source (official page · v4.4 reference page). Where a newer expansion supersedes an older rule, only the newest version is shown.</div>`;
  html += `<div class="steps">${blocks}</div>`;

  // Loyalty deck panel — exact composition for THIS setup.
  const L = BSG.loyalty.compute(c);
  const gm = BSG.expMeta[L.gov];
  const cards = [];
  cards.push(`<span class="loy-card cyl">${L.cylon}× You Are a Cylon</span>`);
  const notBreakdown = L.extras.length ? ` <span class="loy-math">(${L.notBase}+${L.not - L.notBase})</span>` : "";
  cards.push(`<span class="loy-card not">${L.not}× You Are Not a Cylon${notBreakdown}</span>`);
  if (L.mutineer)    cards.push(`<span class="loy-card mut">1× You Are a Mutineer</span>`);
  if (L.sympathizer) cards.push(`<span class="loy-card sym">1× You Are a Sympathizer</span>`);
  const cylNote =
    L.gov === "daybreak"
      ? (L.mutineer
          ? `The <b>Mutineer is REQUIRED</b> in this setup (Daybreak chart).`
          : `The Mutineer is <b>not</b> included in this setup — set it aside.`)
      : "";
  const leaderNote = L.cl
      ? (L.motive ? `Cylon Leader in play: they draw <b>Motive cards</b> (no Agenda, no Sympathizer).`
                  : L.agenda ? `Cylon Leader in play: deal one random <b>${L.agenda} Agenda</b> card (no Sympathizer).` : "")
      : "";
  html += `<div class="panel loyalty" id="sec-loyalty">
      <h3>Loyalty Deck — ${state.players} players${L.cl ? " + Cylon Leader" : ""}
          <span class="etag ${gm.cls}">${gm.name} chart</span></h3>
      ${L.valid ? `<div class="loy-total">Deal a <b>${L.total}-card</b> Loyalty deck:</div>
      <div class="loy-cards">${cards.join("")}</div>` : `<div class="loy-total">No standard composition for this player count.</div>`}
      ${L.extras.length ? `<p class="note2"><b>${L.not}× You Are Not a Cylon</b> = ${L.notBase} from the chart (${state.players} players${L.cl ? " + Cylon Leader" : ""}) + ${L.not - L.notBase} for ${L.extras.join(" & ")}. The chart's asterisk (*) is the Exodus +1.</p>` : ""}
      ${cylNote ? `<p class="note2 ${L.mutineer ? "req" : ""}">${cylNote}</p>` : ""}
      ${leaderNote ? `<p class="note2">${leaderNote}</p>` : ""}
      <ul class="loy-adj">${BSG.loyalty.charNotes(c).map(x => `<li>${x}</li>`).join("")}</ul>
      ${config.options.has("conflictedLoyalties") ? `<p class="note2"><b>Conflicted Loyalties:</b> shuffle the chosen Personal Goal / Final Five cards into the ‘You Are Not a Cylon’ pile before dealing — the counts above don't change; some ‘Not a Cylon’ cards are now secretly those cards.</p>` : ""}
      <div class="src">${L.src}</div>
      ${L.gov === "daybreak"
          ? `<figure class="loy-fig"><img loading="lazy" src="images/loyalty-chart-daybreak.png" alt="Daybreak Loyalty Deck Chart"><figcaption>Daybreak ‘Creating the Loyalty Deck’ Chart (p.7)</figcaption></figure>`
          : (L.cl && L.gov === "pegasus"
              ? `<figure class="loy-fig"><img loading="lazy" src="images/loyalty-chart-pegasus-leader.png" alt="Pegasus Cylon Leader Loyalty chart"><figcaption>Pegasus — Loyalty Deck with a Cylon Leader (p.11)</figcaption></figure>`
              : "")}
    </div>`;

  // How to Play — rules reference for this mode + active modules.
  html += `<div id="sec-howto">${buildHowToPlay(c, obj)}</div>`;

  // Reckless skill checks (Daybreak) — focused rules reference.
  if (hasReckless) html += buildReckless(c);

  // Location reference (boards in play) + contextual FAQ.
  html += `<div id="sec-locations">${buildLocations(c)}</div>`;
  if (faqItems.length) html += `<div id="sec-faq">${buildFaq(c)}</div>`;

  // Diagrams & charts relevant to THIS setup only.
  const relevant = BSG.diagrams.filter(d => d.when(c));
  const figHtml = list => list.map(d =>
    `<figure class="${d.tall ? "tall" : ""}"><img loading="lazy" src="${d.src}" alt="${d.caption}"><figcaption>${d.caption}</figcaption></figure>`).join("");
  const setupD = relevant.filter(d => d.group === "setup");
  const refD   = relevant.filter(d => d.group === "reference");
  if (setupD.length)
    html += `<div class="diagrams" id="sec-setupdiag"><h3>Setup Diagrams</h3><div class="diag-grid">${figHtml(setupD)}</div></div>`;

  // Combined combat reference (always) + other reference charts.
  html += `<div class="diagrams" id="sec-charts"><h3>Reference Charts</h3>`;
  html += buildCombatChart(c);
  if (refD.length) html += `<div class="diag-grid">${figHtml(refD)}</div>`;
  html += `</div>`;

  wrap.innerHTML = headHtml + navHtml + searchHtml + html;
  syncTopbarHeight();   // dock the new sticky nav + set section scroll offsets
}

/* Reckless skill checks (Daybreak) — focused rules reference. */
function buildReckless(c) {
  const r = BSG.reckless;
  return `<section class="panel reckless" id="sec-reckless">
      <h3>Reckless Skill Checks <span class="etag e-day">Daybreak</span></h3>
      <p class="rk-intro">${r.intro}</p>
      <ul class="rk-outcomes">${r.outcomes.map(o =>
        `<li><span class="rk-k">${o.k}</span><span class="rk-t">${o.t}</span></li>`).join("")}</ul>
      <ul class="rk-notes">${r.notes.map(n => `<li>${n}</li>`).join("")}</ul>
      <div class="src">${r.src}</div>
    </section>`;
}

/* Rulebook search panel — the input + (initially empty) results area. */
function buildSearchPanel(c) {
  const books = ["base", "pegasus", "exodus", "daybreak"].filter(expEnabled).map(e => BSG.expMeta[e].name);
  return `<section class="rules-search" id="sec-search">
      <h3>Search the Rulebooks</h3>
      <p class="rs-sub">Searches the ${books.join(", ")} rulebook${books.length > 1 ? "s" : ""}, the official FFG <b>FAQ &amp; Errata</b>, and a community <b>Unofficial FAQ</b> — scoped to this setup. Each result cites its source; newer expansions supersede older rules, official sources rank above unofficial, and you can expand any result for the full passage. (The v4.4 combined reference is intentionally excluded.)</p>
      <input type="search" id="rules-q" class="rs-input" placeholder="Search a rule, keyword or component…" oninput="bsgSearch(this.value)" autocomplete="off" spellcheck="false">
      <div id="rules-results" class="rs-results"><p class="rs-hint">Type at least 2 characters to search.</p></div>
    </section>`;
}

/* ---- Live rulebook search -------------------------------------------------
   Scopes to the rulebooks in play, suppresses superseded versions of curated
   conflict topics (newest in-play book governs), cites book + page. --------- */
function _escHtml(s) { return s.replace(/[&<>]/g, ch => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[ch])); }
function _escReg(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); }

/* Escape a string for HTML, then highlight every occurrence of `phrase`. */
function _hl(s, phrase) {
  s = _escHtml(s);
  if (phrase) s = s.replace(new RegExp("(" + _escReg(phrase) + ")", "gi"), "<mark>$1</mark>");
  return s;
}

/* A short preview window centred on the phrase (from the flattened page text). */
function _snippet(flat, phrase) {
  const lt = flat.toLowerCase();
  let i = lt.indexOf(phrase);
  if (i < 0) i = 0;
  const start = Math.max(0, i - 70);
  const end = Math.min(flat.length, i + phrase.length + 170);
  const s = (start > 0 ? "… " : "") + flat.slice(start, end) + (end < flat.length ? " …" : "");
  return _hl(s, phrase);
}

/* The full page, rendered as paragraphs with the phrase highlighted. */
function _fullPassage(text, phrase) {
  return text.split("\n").map(p => `<p>${_hl(p, phrase)}</p>`).join("");
}

function bsgSearch(q) {
  const box = document.getElementById("rules-results");
  if (!box) return;
  // Phrase search: the whole query must appear contiguously (so "cylon leader"
  // matches only where those words sit together, not pages with "cylon" and
  // "leadership" far apart).
  const phrase = (q || "").trim().toLowerCase().replace(/\s+/g, " ");
  if (phrase.length < 2) { box.innerHTML = `<p class="rs-hint">Type at least 2 characters to search.</p>`; return; }
  if (!BSG.rulesIndex) { box.innerHTML = `<p class="rs-hint">Loading rulebook index…</p>`; return; }

  const active = new Set((BSG._searchCtx || { exps: ["base"] }).exps);
  // Governing expansion per suppression topic (chain is precedence-ascending).
  const gov = BSG.rulesSuppress.map(s => {
    const inPlay = s.chain.filter(e => active.has(e));
    return inPlay.length ? inPlay[inPlay.length - 1] : null;
  });
  const prec = BSG.precedence;
  const results = [];

  for (const e of BSG.rulesIndex) {
    if (!active.has(e.x)) continue;
    const flat = e.t.replace(/\n/g, " ");
    const lt = flat.toLowerCase();
    const pos = lt.indexOf(phrase);
    if (pos < 0) continue;
    // Suppress superseded rulebook rules only — FAQ / errata are never hidden.
    if (!e.s) {
      let suppressed = false;
      for (let k = 0; k < BSG.rulesSuppress.length; k++) {
        const s = BSG.rulesSuppress[k], g = gov[k];
        if (g && e.x !== g && s.chain.includes(e.x) && s.kw.some(kw => lt.includes(kw))) { suppressed = true; break; }
      }
      if (suppressed) continue;
    }
    results.push({ e, flat, pos });
  }
  // Official sources first (rulebooks + FFG FAQ), unofficial BGG last; then newest expansion.
  results.sort((a, b) => {
    const ua = a.e.s === "u" ? 1 : 0, ub = b.e.s === "u" ? 1 : 0;
    return (ua - ub) || (prec[b.e.x] - prec[a.e.x]) || (a.pos - b.pos);
  });
  const top = results.slice(0, 40);

  if (!top.length) { box.innerHTML = `<p class="rs-hint">No matches in the rulebooks or FAQ for this setup. Try a different term.</p>`; return; }
  box.innerHTML =
    `<div class="rs-count">${results.length} result${results.length > 1 ? "s" : ""}${results.length > top.length ? ` · showing ${top.length}` : ""}</div>` +
    top.map(({ e, flat }) => {
      const m = BSG.expMeta[e.x];
      const loc = e.s === "u" ? e.sec : "p." + e.p;
      const badge = e.s === "u" ? `<span class="rs-badge rs-unofficial">Unofficial</span>`
                  : e.s === "f" ? `<span class="rs-badge rs-faq">FAQ · Errata</span>` : "";
      return `<details class="rs-item${e.s === "u" ? " is-unofficial" : ""}">
          <summary class="rs-sum">
            <div class="rs-meta"><span class="etag ${m.cls}">${m.name}</span>${badge} <span class="rs-page">${e.b} · ${loc}</span><span class="rs-toggle">Full passage</span></div>
            <div class="rs-snip">${_snippet(flat, phrase)}</div>
          </summary>
          <div class="rs-full">${_fullPassage(e.t, phrase)}</div>
        </details>`;
    }).join("");
}

/* How to Play — mode rules + core loop + active-module rules.
   Items may be strings or { t, when?, tag?, src? }. A `tag` (expansion id or a
   function (c)=>id) marks which expansion's version of an overlapping rule applies. */
function buildHowToPlay(c, obj) {
  const tagHtml = tag => {
    const id = typeof tag === "function" ? tag(c) : tag;
    const m = BSG.expMeta[id];
    return m ? `<span class="etag ${m.cls}">${m.name}</span> ` : "";
  };
  const block = (title, items, cls = "") => {
    const lis = items
      .filter(i => typeof i === "string" || !i.when || i.when(c))
      .map(i => typeof i === "string"
        ? `<li>${i}</li>`
        : `<li>${i.tag ? tagHtml(i.tag) : ""}${i.t}${i.src ? ` <span class="htp-src">${i.src}</span>` : ""}</li>`)
      .join("");
    return lis ? `<section class="htp-sec ${cls}"><h5>${title}</h5><ul>${lis}</ul></section>` : "";
  };

  let body = "";
  // 1) This mode
  const mode = BSG.howToPlay.modes[obj.id];
  if (mode) body += block(`${obj.name} — How This Mode Plays`, mode.items, "mode");
  // 2) Core gameplay topics (always; conditional items inside)
  BSG.howToPlay.core.forEach(g => { body += block(g.h, g.items); });
  // 3) Active modules
  BSG.howToPlay.modules.filter(m => m.when(c)).forEach(m => { body += block(m.h, m.items, "mod"); });

  return `<div class="howto">
      <h3>How to Play — Rules Reference</h3>
      <div class="legend">These rules match your exact setup. A coloured tag marks which expansion's version governs where rules overlap (e.g. <span class="etag e-day">Daybreak</span> Treachery replaces <span class="etag e-peg">Pegasus</span> Treachery).</div>
      <div class="htp-grid">${body}</div>
    </div>`;
}

/* Location reference — only the boards in play; overlay-specific entries via `when`. */
function buildLocations(c) {
  const tagHtml = tag => { const m = BSG.expMeta[typeof tag === "function" ? tag(c) : tag]; return m ? ` <span class="etag ${m.cls}">${m.name}</span>` : ""; };
  let blocks = "";
  BSG.locationBoards.filter(b => b.when(c)).forEach(board => {
    const locs = BSG.locations.filter(l => l.b === board.id && (!l.when || l.when(c)));
    if (!locs.length) return;
    blocks += `<section class="loc-board"><h5>${board.name}</h5><ul>${
      locs.map(l => `<li><b>${l.n}</b>${l.tag ? tagHtml(l.tag) : ""} — ${l.a}</li>`).join("")
    }</ul></section>`;
  });
  return `<div class="locations"><h3>Location Reference</h3>
      <div class="legend">What each location does — only the boards in your setup. Where the Daybreak overlays change a location, the revised version is shown.</div>
      <div class="loc-grid">${blocks}</div></div>`;
}

/* Contextual FAQ — official rulings relevant to this setup. */
function buildFaq(c) {
  const items = BSG.faq.filter(f => !f.when || f.when(c));
  if (!items.length) return "";
  return `<div class="faq"><h3>FAQ — Rulings for This Setup</h3>
      <p class="faq-note">Key rulings for this configuration are below. The complete official FFG <b>FAQ &amp; Errata</b> (updated 3-5-15) and a community <b>Unofficial FAQ</b> are fully searchable in <a href="#sec-search">Search the Rulebooks</a> above.</p>
      <div class="faq-list">${
        items.map(f => `<details class="faq-item"><summary>${f.q}</summary><div class="faq-a">${f.a}</div></details>`).join("")
      }</div></div>`;
}

/* Combined combat reference: merged text (v4.4 p.6 + p.14) + p.14 Attack Table image. */
function buildCombatChart(c) {
  const fleet = c.opt("cylonFleet");   // Cylon Fleet board only with the Exodus Cylon Fleet option
  const secHtml = BSG.combat.sections
    .filter(s => !s.fleet || fleet)   // hide Cylon-Fleet-only sections when no fleet board
    .map(s => {
      const li = i => typeof i === "string"
        ? `<li>${i}</li>`
        : `<li class="ic"><img class="li-icon" loading="lazy" src="images/charts/icn/${i.icon}.png" alt=""><span>${i.t}</span></li>`;
      const body = `<ul>${s.items.map(li).join("")}</ul>`;
      return `<section class="cc-sec${s.fleet ? " fleet" : ""}">
        <h5>${s.h}${s.fleet ? ` <span class="cc-flag">Cylon Fleet</span>` : ""}</h5>
        ${body}
      </section>`;
    }).join("");
  return `<div class="combat-chart">
      <div class="cc-head">Combat Reference <span class="cc-src">combined from v4.4 p.6 &amp; p.14</span></div>
      <div class="cc-grid">
        <div class="cc-text">${secHtml}</div>
        <figure class="cc-table">
          <img loading="lazy" src="${BSG.combat.attackTableImg}" alt="Attack Table (D8)">
          <figcaption>${BSG.combat.attackTableNote}</figcaption>
        </figure>
      </div>
    </div>`;
}

/* ---- Lightbox for diagrams ----------------------------------------------- */
function initLightbox() {
  const lb = el("div", "lightbox");
  lb.innerHTML = `<img alt="">`;
  lb.onclick = () => lb.classList.remove("show");
  document.body.appendChild(lb);
  document.addEventListener("click", e => {
    if (e.target.tagName === "IMG" && e.target.closest("figure")) {
      $("img", lb).src = e.target.src;
      lb.classList.add("show");
    }
  });
  document.addEventListener("keydown", e => { if (e.key === "Escape") lb.classList.remove("show"); });
}

/* ---- Boot ---------------------------------------------------------------- */
/* ---- Shareable / bookmarkable setup (URL hash) --------------------------- */
function encodeState() {
  const p = new URLSearchParams();
  const exps = [...state.expansions].filter(e => e !== "base");
  if (exps.length) p.set("e", exps.join(","));
  p.set("p", state.players);
  if (state.options.size) p.set("m", [...state.options].join(","));
  if (state.selected) p.set("s", state.selected.split("|")[0]);   // selected objective id
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
  if (pl >= 3 && pl <= 7) state.players = pl;
  state.options = new Set(p.get("m") ? p.get("m").split(",").filter(Boolean) : []);
  pruneState();
  const objId = p.get("s");
  if (objId) {
    const cfg = enumerateConfigs().find(x => x.objective === objId);
    if (cfg) state.selected = configKey(cfg);
  }
  return true;
}
function copyShareLink(btn) {
  const txt = btn.textContent;
  navigator.clipboard.writeText(location.href).then(
    () => { btn.textContent = "✓ Link copied"; setTimeout(() => { btn.textContent = txt; }, 1600); },
    () => { btn.textContent = "Copy failed"; setTimeout(() => { btn.textContent = txt; }, 1600); }
  );
}

function renderAll() { renderConfigurator(); renderGallery(); renderDetail(); syncUrl(); }

/* Dock the sticky jump-nav just under the (variable-height) topbar, and offset
   anchored sections so the topbar + nav never cover their heading. Concrete px
   values are applied directly (more reliable than a CSS var across engines). */
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
  decodeState(); renderAll(); initLightbox();
  syncTopbarHeight();
  window.addEventListener("resize", syncTopbarHeight, { passive: true });
});
