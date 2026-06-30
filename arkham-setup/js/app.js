/* =============================================================================
   Arkham Horror Setup Utility — application logic
   Configurator (expansions + players + modules) -> live, precedence-aware
   setup instructions, board/location reference, rules reference, FAQ & search.
   ============================================================================= */

const state = {
  expansions: new Set(["base"]),   // base always on
  players: 4,
  modules: new Set()               // toggled Heralds / Guardians / Institutions / variants
};

const $ = (sel, root = document) => root.querySelector(sel);
const el = (tag, cls, html) => { const n = document.createElement(tag); if (cls) n.className = cls; if (html != null) n.innerHTML = html; return n; };

/* ---- Validity helpers ---------------------------------------------------- */
function expEnabled(id) { return id === "base" || state.expansions.has(id); }
function requiresMet(req)    { return Array.isArray(req) ? req.some(expEnabled) : expEnabled(req); }
function requiresAllMet(req) { return !req || req.every(expEnabled); }

function moduleAvailable(m) {
  return requiresMet(m.requires === undefined ? "base" : m.requires) &&
         requiresAllMet(m.requiresAll) &&
         (!m.minPlayers || state.players >= m.minPlayers);
}
function availableModules() { return AH.modules.filter(moduleAvailable); }

/* Count how many big-box expansion boards are on the table. */
function boardCount() {
  return ["dunwich", "kingsport", "innsmouth"].filter(expEnabled).length;
}

/* Build the condition context used by every `when` predicate in the data. */
function ctx() {
  const heraldCount = AH.modules.filter(m => m.type === "herald" && state.modules.has(m.id)).length;
  const guardian    = AH.modules.some(m => m.type === "guardian" && state.modules.has(m.id));
  const institution = AH.modules.some(m => m.type === "institution" && state.modules.has(m.id));
  return {
    has: e => expEnabled(e),
    p: state.players,
    mod: id => state.modules.has(id),
    boardCount: boardCount(),
    heraldCount, guardian, institution
  };
}

/* Drop modules / state that became invalid after a configurator change. */
function pruneState() {
  if (state.players < 1) state.players = 1;
  if (state.players > 8) state.players = 8;
  [...state.modules].forEach(id => {
    const m = AH.modules.find(x => x.id === id);
    if (!m || !moduleAvailable(m)) { state.modules.delete(id); return; }
    if (m.excludes && m.excludes.some(x => state.modules.has(x))) {
      // keep this one, drop the conflicting partner(s) it was just toggled against
    }
  });
}

/* ---- Rendering: configurator -------------------------------------------- */
function renderConfigurator() {
  // Expansions
  const ex = $("#expansions"); ex.innerHTML = "";
  AH.expansions.forEach(e => {
    const on = expEnabled(e.id);
    const chip = el("button", "chip" + (on ? " on" : "") + (e.always ? " locked" : "") + " " + AH.expMeta[e.id].cls + "-chip");
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
  for (let p = 1; p <= 8; p++) {
    const b = el("button", "pbtn" + (state.players === p ? " on" : ""), String(p));
    b.onclick = () => { state.players = p; pruneState(); renderAll(); };
    pl.appendChild(b);
  }

  // Modules, grouped by type
  const op = $("#modules"); op.innerHTML = "";
  const avail = availableModules();
  if (!avail.length) {
    op.appendChild(el("p", "muted", "Add an expansion to unlock Heralds, Guardians, Institutions and variants."));
  } else {
    AH.moduleTypes.forEach(gt => {
      const mods = avail.filter(m => m.type === gt.id);
      if (!mods.length) return;
      const group = el("div", "mod-group");
      group.appendChild(el("div", "mod-group-label", gt.label + ` <span class="mg-note">${gt.note}</span>`));
      const chips = el("div", "chips");
      mods.forEach(m => {
        const on = state.modules.has(m.id);
        const chip = el("button", "chip small" + (on ? " on" : ""));
        chip.innerHTML = `<span class="chip-name">${m.name}</span>`;
        chip.title = m.description;
        chip.onclick = () => {
          if (on) state.modules.delete(m.id);
          else {
            state.modules.add(m.id);
            if (m.excludes) m.excludes.forEach(x => state.modules.delete(x));  // mutually-exclusive
          }
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

  // Active rulebooks for this setup (drives search scope).
  AH._searchCtx = { exps: AH.expansions.map(e => e.id).filter(expEnabled).concat(["faq"]) };

  // Header: what's on the table
  const expNames = AH.expansions.filter(e => expEnabled(e.id)).map(e => e.short);
  const modChips = AH.modules.filter(m => state.modules.has(m.id)).map(m => m.name);
  const headHtml = `<div class="detail-head">
      <button class="share-btn" onclick="copyShareLink(this)" title="Copy a link that reopens this exact configuration">🔗 Copy setup link</button>
      <div class="dh-mode">Your Arkham Setup</div>
      <p class="dh-desc">Clean, step-by-step setup for the exact expansions and modules below, following the base game’s 14 setup steps with each change tagged by its source. Where the FAQ or a later expansion overrides an earlier rule, only the current ruling is shown.</p>
      <div class="dh-meta">
        <span class="meta-pill">${state.players} investigator${state.players === 1 ? "" : "s"}</span>
        ${expNames.map(t => `<span class="meta-pill">${t}</span>`).join("")}
        ${modChips.map(t => `<span class="meta-pill opt">${t}</span>`).join("")}
      </div>
    </div>`;

  // Jump nav
  const faqItems = AH.faq.filter(f => !f.when || f.when(c));
  const navItems = [
    ["sec-search", "🔍 Search"],
    ["sec-setup", "Setup Steps"],
    ["sec-howto", "How to Play"],
    ["sec-boards", "Boards & Locations"],
    faqItems.length ? ["sec-faq", "FAQ"] : null,
    ["sec-ref", "Reference Table"]
  ].filter(Boolean);
  const navHtml = `<nav class="jump-nav" aria-label="Jump to section">${
    navItems.map(([id, label]) => `<a href="#${id}" class="jn">${label}</a>`).join("")
  }</nav>`;

  const searchHtml = buildSearchPanel(c);

  // ---- Setup steps: merged, precedence-aware, grouped by phase ----
  const steps = AH.setup.filter(s => !s.when || s.when(c));
  let n = 0, blocks = "";
  AH.phases.forEach((phaseName, pi) => {
    const phaseSteps = steps.filter(s => s.ph === pi);
    if (!phaseSteps.length) return;
    blocks += `<section class="setup-block">
        <h3>${phaseName}</h3>
        <ol class="ustep">${phaseSteps.map(s => {
          n++;
          const m = AH.expMeta[s.exp];
          return `<li><span class="snum">${n}</span>
            <div class="sbody"><span class="st">${s.t}</span> <span class="etag ${m.cls}">${m.name}</span>
            <div class="sd">${s.d}</div>${s.src ? `<div class="ssrc">${s.src}</div>` : ""}</div></li>`;
        }).join("")}</ol>
      </section>`;
  });
  let html = `<div class="legend" id="sec-setup">Each step is tagged with the expansion it comes from and cites its rulebook source. Add expansions and modules above and the steps update instantly — only steps that apply to your table are shown.</div>`;
  html += `<div class="steps">${blocks}</div>`;

  // ---- How to play ----
  html += `<div id="sec-howto">${buildHowToPlay(c)}</div>`;

  // ---- Boards & locations ----
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
    const m = AH.expMeta[id];
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
  AH.howToPlay.core.forEach(g => { body += block(g.h, g.items); });
  AH.howToPlay.modules.filter(m => m.when(c)).forEach(m => {
    body += block(m.h, m.items, "mod");
  });

  return `<div class="howto">
      <h3>How to Play — Rules Reference</h3>
      <div class="legend">A concise reference for your exact table. Coloured tags mark which expansion’s version of an overlapping rule applies.</div>
      <div class="htp-grid">${body}</div>
    </div>`;
}

/* ---- Boards & Location reference ----------------------------------------- */
function buildBoards(c) {
  let blocks = "";
  AH.boards.filter(b => b.when(c)).forEach(b => {
    blocks += `<section class="loc-board"><h5>${b.name}</h5><ul>${
      b.items.map(i => `<li>${i}</li>`).join("")
    }</ul></section>`;
  });
  return `<div class="locations"><h3>Boards & Location Reference</h3>
      <div class="legend">The special tracks and rules each board in your setup adds. (Arkham locations have no fixed actions — you draw an encounter card — so this covers the mechanics that matter at the table.)</div>
      <div class="loc-grid">${blocks}</div></div>`;
}

/* ---- Contextual FAQ ------------------------------------------------------ */
function buildFaq(c) {
  const items = AH.faq.filter(f => !f.when || f.when(c));
  if (!items.length) return "";
  return `<div class="faq"><h3>FAQ — Rulings for This Setup</h3>
      <div class="faq-list">${
        items.map(f => `<details class="faq-item"><summary>${f.q}</summary><div class="faq-a">${f.a}</div></details>`).join("")
      }</div></div>`;
}

/* ---- Player-count reference table ---------------------------------------- */
function buildReference(c) {
  const eff = AH.playerRef.effectivePlayers(state.players, c.boardCount);
  const dunInn = c.has("dunwich") && c.has("innsmouth");
  const rows = [];
  for (let p = 1; p <= 8; p++) {
    const cls = p === eff ? ' class="ref-active"' : "";
    const gates = AH.playerRef.gatesToAwaken(p) + (dunInn ? 1 : 0);
    rows.push(`<tr${cls}><td>${p}</td><td>${AH.playerRef.monsterLimit(p)}</td><td>${AH.playerRef.outskirtsLimit(p)}</td><td>${gates}</td></tr>`);
  }
  const effNote = c.boardCount >= 2
    ? `<p class="ref-callout">You have <b>${state.players}</b> investigators across <b>${c.boardCount}</b> expansion boards, so most in-game numbers use an <b>effective ${eff} player${eff === 1 ? "" : "s"}</b> (−1 per board beyond the first). The highlighted row reflects that — when counting successes against the Ancient One, use the full ${state.players}.</p>`
    : "";
  const dunInnNote = dunInn
    ? `<p class="ref-callout">Dunwich + Innsmouth together: the “gates to awaken” column already includes the +1.</p>`
    : "";
  return `<div class="reference"><h3>Reference Table</h3>
      <div class="legend">Core numbers for your game. ${AH.playerRef.src}.</div>
      ${effNote}${dunInnNote}
      <div class="ref-grid">
        <table class="ref-table">
          <thead><tr><th>Investigators</th><th>Monster limit</th><th>Outskirts limit</th><th>Gates to awaken</th></tr></thead>
          <tbody>${rows.join("")}</tbody>
        </table>
        <ul class="ref-notes">${AH.playerRef.notes.map(n => `<li>${n}</li>`).join("")}</ul>
      </div></div>`;
}

/* ---- Rulebook search panel ----------------------------------------------- */
function buildSearchPanel(c) {
  const books = AH.expansions.filter(e => expEnabled(e.id)).map(e => AH.expMeta[e.id].name).concat(["FAQ"]);
  return `<section class="rules-search" id="sec-search">
      <h3>Search the Rulebooks &amp; FAQ</h3>
      <p class="rs-sub">Searches the ${books.join(", ")} for this setup — type keywords <i>or ask a plain question</i> (“how do I seal a gate?”). Results are ranked by relevance, with the in-play <b>rulebooks shown first</b> and <b>FAQ &amp; Errata clarifications after</b>. Each cites its source and page; expand any result for the full passage.</p>
      <input type="search" id="rules-q" class="rs-input" placeholder="Ask a question, or search a rule or component…" oninput="ahSearch(this.value)" autocomplete="off" spellcheck="false">
      <div id="rules-results" class="rs-results"><p class="rs-hint">Type a few words — or ask a question.</p></div>
    </section>`;
}

function _escHtml(s) { return s.replace(/[&<>]/g, ch => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[ch])); }
function _escReg(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); }

/* ---- Smart search: BM25 relevance + stop-words + light stemming + synonyms.
   Fully client-side (no API): handles natural-language questions while keeping
   precise multi-word term matching. ----------------------------------------- */
const _STOP = new Set(("a an the and or but if then of to in on for from with as at by be is are was were " +
  "do does did can could should would will may might must have has had this that these those it its it's i you " +
  "he she they we me my your our their what when where which who whom why how whats hows than into over under " +
  "about yours during while there here not no yes get got make use using used such per each any all some many much " +
  "you're i'm we're they're do i").split(" "));

/* Arkham vocabulary map so plain questions hit the right rules. Keys and values
   are in the (plural-normalised) form the stemmer below produces. */
const _SYN = {
  gate: ["portal", "dimensional", "vortex", "rift", "open"], portal: ["gate"], rift: ["gate", "kingsport"], vortex: ["gate", "monster"],
  seal: ["elder", "sign", "close"], elder: ["sign", "seal"], sign: ["elder", "seal"], close: ["seal", "gate", "trophy"],
  monster: ["creature", "cup", "spawn"], creature: ["monster"], spawn: ["monster", "riot"],
  doom: ["track", "awaken", "ancient"], ancient: ["doom", "awaken", "old", "one"], awaken: ["doom", "ancient", "final", "battle"],
  investigator: ["character", "player"], character: ["investigator"],
  sanity: ["horror", "mad", "insane", "will"], horror: ["sanity", "will"], mad: ["sanity", "insane", "injury"],
  stamina: ["health", "combat", "wound"], health: ["stamina"],
  clue: ["token", "seal"], token: ["clue", "marker"],
  terror: ["track", "level"], level: ["terror"],
  mythos: ["card", "phase"], phase: ["turn", "upkeep", "movement", "encounter"],
  combat: ["fight", "attack", "weapon"], fight: ["combat"], attack: ["combat"],
  evade: ["sneak", "flee"], sneak: ["evade"], flee: ["evade"],
  spell: ["cast", "magic", "lore"], cast: ["spell"], weapon: ["item", "hand", "fight"], item: ["weapon", "common", "unique", "exhibit"],
  ally: ["companion"], herald: ["sheet"], guardian: ["sheet", "nodens", "hypnos", "bast"], institution: ["sheet"],
  corruption: ["cult", "goat"], cult: ["corruption", "membership"],
  outskirt: ["monster", "limit"], limit: ["outskirt", "monster"],
  upkeep: ["phase", "refresh"], movement: ["move", "speed"], focus: ["skill", "slider"],
  skill: ["check", "slider", "focus"], check: ["skill", "dice", "difficulty"],
  trophy: ["close", "spend"], devour: ["dead", "eliminate"],
  arrest: ["jail", "police", "patrol"], patrol: ["arrest", "sneak"],
  bless: ["blessing"], curse: ["cursed"],
  deep: ["one", "innsmouth", "rising"], rising: ["deep", "feds", "innsmouth"], feds: ["raid", "innsmouth"],
  aquatic: ["water", "wave", "river"], exhibit: ["pharaoh", "whisper", "item"], whisper: ["exhibit", "pharaoh"],
  personal: ["story"], story: ["personal"], epic: ["battle", "plot"], battle: ["final", "epic", "awaken"]
};

/* Plural-only stemmer: safe normalisation (monsters->monster, checks->check)
   without the over-stemming that breaks pairs like win / winning. */
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
  if (AH._si) return AH._si;
  const docs = [], inv = new Map();
  let total = 0;
  AH.rulesIndex.forEach((e, idx) => {
    const flat = e.t.replace(/\n/g, " ");
    const toks = _tok(flat);
    const tf = new Map();
    toks.forEach(t => tf.set(t, (tf.get(t) || 0) + 1));
    tf.forEach((c, t) => { (inv.get(t) || inv.set(t, []).get(t)).push([idx, c]); });
    docs.push({ len: toks.length || 1, flatLower: flat.toLowerCase() });
    total += toks.length;
  });
  AH._si = { docs, inv, N: docs.length, avgdl: total / Math.max(1, docs.length) };
  return AH._si;
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

function ahSearch(q) {
  const box = document.getElementById("rules-results");
  if (!box) return;
  const phrase = (q || "").trim().toLowerCase().replace(/\s+/g, " ");
  if (phrase.length < 2) { box.innerHTML = `<p class="rs-hint">Type a few words — or ask a question.</p>`; return; }
  if (!AH.rulesIndex) { box.innerHTML = `<p class="rs-hint">Loading rulebook index…</p>`; return; }
  const si = _buildSearchIndex();

  const rawWords = phrase.match(/[a-z0-9]+/g) || [];
  let qterms = [...new Set(rawWords.filter(w => !_STOP.has(w)).map(_stem).filter(s => s.length >= 2))];
  if (!qterms.length) qterms = [...new Set(rawWords.map(_stem).filter(s => s.length >= 2))];
  if (!qterms.length) { box.innerHTML = `<p class="rs-hint">Try a more specific word.</p>`; return; }
  // Question vs. exact-term mode (the latter requires every term, as before).
  const isQuestion = /\b(how|what|why|when|where|who|which|can|do|does|should|is|are|will|if)\b/.test(phrase) || phrase.includes("?");
  const termMode = !isQuestion && qterms.length <= 3;
  // Synonyms are optional, lower-weighted extra terms.
  const synTerms = [];
  qterms.forEach(t => (_SYN[t] || []).forEach(s => { if (!qterms.includes(s) && !synTerms.includes(s)) synTerms.push(s); }));
  const allTerms = qterms.concat(synTerms);

  const active = new Set((AH._searchCtx || { exps: ["base", "faq"] }).exps);
  const gov = (AH.rulesSuppress || []).map(s => { const ip = s.chain.filter(e => active.has(e)); return ip.length ? ip[ip.length - 1] : null; });
  const prec = AH.precedence, k1 = 1.5, b = 0.75;

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
    const e = AH.rulesIndex[idx];
    if (!active.has(e.x)) continue;
    if (termMode && info.hits.size < qterms.length) continue;          // require all terms in term mode
    const lt = si.docs[idx].flatLower;
    // suppress superseded rulebook passages on curated conflict topics
    let sup = false;
    for (let k = 0; k < (AH.rulesSuppress || []).length; k++) {
      const s = AH.rulesSuppress[k], g = gov[k];
      if (g && e.x !== g && s.chain.includes(e.x) && s.kw.some(kw => lt.includes(kw))) { sup = true; break; }
    }
    if (sup) continue;
    let score = info.score;
    if (phrase.length >= 3 && lt.includes(phrase)) score *= 2.4;        // exact phrase boost
    score *= 1 + (info.hits.size - 1) * 0.15;                           // reward covering more query terms
    score += (prec[e.x] || 0) * 0.003;                                 // tiny supersession tiebreak among rulebooks
    results.push({ e, score, faq: e.x === "faq" });
  }
  // Each group is relevance-ranked; the in-play rulebooks lead, the FAQ follows
  // as clarification (so setup rules come first, errata after).
  const books = results.filter(r => !r.faq).sort((a, b) => b.score - a.score);
  const faqs  = results.filter(r =>  r.faq).sort((a, b) => b.score - a.score);
  // Reserve slots per group so the FAQ clarifications always show even when the
  // rulebooks have many hits — rulebooks still lead, the FAQ follows.
  const shownBooks = books.slice(0, 28);
  const shownFaqs  = faqs.slice(0, 12);
  const top = shownBooks.concat(shownFaqs);

  if (!top.length) { box.innerHTML = `<p class="rs-hint">No matches in the rulebooks or FAQ for this setup. Try different words.</p>`; return; }
  const truncated = books.length > shownBooks.length || faqs.length > shownFaqs.length;
  const countLine = `<div class="rs-count">${books.length} rulebook · ${faqs.length} FAQ${truncated ? ` · showing top ${shownBooks.length} + ${shownFaqs.length}` : ""}</div>`;
  box.innerHTML = countLine +
    top.map((r, i) => {
      const e = r.e;
      const m = AH.expMeta[e.x] || { name: e.b, cls: "e-base" };
      // divider where the rulebook results give way to the FAQ
      const divider = (r.faq && i > 0 && !top[i - 1].faq)
        ? `<div class="rs-divider"><span>FAQ &amp; Errata — clarifications</span></div>` : "";
      return divider + `<details class="rs-item${r.faq ? " is-faq" : ""}">
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
  if (pl >= 1 && pl <= 8) state.players = pl;
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
  decodeState(); renderAll();
  syncTopbarHeight();
  window.addEventListener("resize", syncTopbarHeight, { passive: true });
});
