/* =============================================================================
   Marvel Champions — Rules Reference & Setup (DFW Gaming Village)
   Data: window MC (js/data.js, rules content with page citations),
         MC.rulesIndex (js/rules.js, per-page rulebook text for search),
         window.MCE (../marvel-champions-builder/js/mc-encounters.js, scenarios).
   Config lives in the URL hash so any setup can be shared or bookmarked.
   ============================================================================= */
(function () {
  'use strict';
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));
  const ENC = window.MCE || null;
  /* data.js declares `const MC` (a global lexical binding, not a window property) */
  const RULES = (typeof MC !== 'undefined') ? MC : (window.MC || {});
  const SETS = ENC ? ENC.sets : {};
  const setName = id => (SETS[id] && SETS[id].name) || String(id).replace(/_/g, ' ');

  // ------------------------------------------------------------- config
  const state = { players: 2, mode: 'standard', heroic: 0, skirmish: false, campaign: false, pool: false, scn: '', mods: null, std: null, exp: null };
  function readHash() {
    const p = new URLSearchParams(location.hash.replace(/^#/, ''));
    if (p.has('p')) state.players = clamp(+p.get('p'), 1, 4);
    if (p.has('m')) state.mode = p.get('m') === 'expert' ? 'expert' : 'standard';
    if (p.has('h')) state.heroic = clamp(+p.get('h'), 0, 5);
    state.skirmish = p.get('sk') === '1';
    state.campaign = p.get('cp') === '1';
    state.pool = p.get('pool') === '1';
    if (p.has('scn')) state.scn = p.get('scn');
    state.mods = p.has('mods') ? p.get('mods').split(',').filter(Boolean) : null;
    state.std = p.has('std') ? p.get('std') : null;
    state.exp = p.has('exp') ? p.get('exp') : null;
  }
  function writeHash() {
    const p = new URLSearchParams();
    p.set('p', state.players); p.set('m', state.mode);
    if (state.heroic) p.set('h', state.heroic);
    if (state.skirmish) p.set('sk', '1');
    if (state.campaign) p.set('cp', '1');
    if (state.pool) p.set('pool', '1');
    if (state.scn) p.set('scn', state.scn);
    if (state.scn && state.mods) p.set('mods', state.mods.join(','));
    if (state.std) p.set('std', state.std);
    if (state.exp) p.set('exp', state.exp);
    const h = '#' + p.toString();
    if (location.hash !== h) history.replaceState(null, '', h);
  }
  const clamp = (n, a, b) => Math.max(a, Math.min(b, isNaN(n) ? a : n));
  function scenario() { return ENC && state.scn ? ENC.scenarios.find(s => s.id === state.scn) || null : null; }
  function ctx() {
    const s = scenario();
    let scn = null;
    if (s) {
      scn = Object.assign({}, s);
      if (state.std !== null) scn.standardSet = state.std || null;
      if (state.exp !== null) scn.expertSet = state.exp || null;
    }
    const mods = s ? (state.mods || (s.recommendedModulars || []).slice()) : [];
    return {
      players: state.players, mode: state.mode, heroic: state.heroic, skirmish: state.skirmish,
      campaign: state.campaign, pool: state.pool, scn, setName, modulars: mods,
    };
  }
  const val = (x, c) => typeof x === 'function' ? x(c) : x;
  const when = (item, c) => { try { return !item.when || item.when(c); } catch (e) { console.warn(e); return false; } };

  // --------------------------------------------------------- configurator
  function renderConfig() {
    const s = scenario();
    const seg = (key, opts) => `<div class="seg" role="group">${opts.map(([v, l]) => `<button type="button" data-k="${key}" data-v="${v}" class="${String(state[key]) === String(v) ? 'on' : ''}">${l}</button>`).join('')}</div>`;
    let scnOpts = '<option value="">— No scenario (general setup) —</option>';
    if (ENC) {
      const groups = {};
      for (const x of ENC.scenarios) (groups[x.productName] = groups[x.productName] || []).push(x);
      for (const [g, list] of Object.entries(groups)) scnOpts += `<optgroup label="${esc(g)}">${list.map(x => `<option value="${esc(x.id)}" ${x.id === state.scn ? 'selected' : ''}>${esc(x.name)}${x.campaignOrder ? ' (#' + x.campaignOrder + ')' : ''}</option>`).join('')}</optgroup>`;
    }
    let scnHtml = '';
    if (s) {
      const c = ctx();
      const modChips = (ENC.modularOrder || []).filter(id => c.modulars.includes(id) || (s.recommendedModulars || []).includes(id))
        .map(id => `<button type="button" class="chip ${c.modulars.includes(id) ? 'on' : ''}" data-mod="${esc(id)}">${esc(setName(id))}${(s.recommendedModulars || []).includes(id) ? ' ★' : ''}</button>`).join('');
      const addOpts = (ENC.modularOrder || []).filter(id => !c.modulars.includes(id)).map(id => `<option value="${esc(id)}">${esc(setName(id))}</option>`).join('');
      scnHtml = `<div class="scn-card">${s.img ? `<img src="../marvel-champions-builder/${esc(s.img)}" alt="">` : '<span></span>'}
        <div><b>${esc(s.name)}</b><div class="muted">${esc(s.productName)}${s.campaign ? ' · ' + esc(s.campaign) : ''}</div>
        <div class="row" style="margin-top:8px">${modChips}<select class="select" id="addMod" aria-label="Add a modular set"><option value="">+ Add modular…</option>${addOpts}</select>
        <a class="btn small ghost" href="../marvel-champions-builder/#villain/${encodeURIComponent(s.id)}">Open in builder ↗</a></div>
        <p class="explain" style="margin:6px 0 0">★ = recommended by the scenario insert. Tap a chip to remove it.</p></div></div>`;
    }
    $('#cfg').innerHTML = `
      <div class="cfg-row">
        <div class="cfg-group"><span class="cfg-label">Players</span>${seg('players', [[1, '1'], [2, '2'], [3, '3'], [4, '4']])}</div>
        <div class="cfg-group"><span class="cfg-label">Mode</span>${seg('mode', [['standard', 'Standard'], ['expert', 'Expert']])}</div>
        <div class="cfg-group"><span class="cfg-label">Heroic level</span><select class="select" id="heroic">${[0, 1, 2, 3, 4, 5].map(n => `<option value="${n}" ${state.heroic === n ? 'selected' : ''}>${n ? 'Heroic ' + n : 'Off'}</option>`).join('')}</select></div>
        <div class="cfg-group"><span class="cfg-label">Options</span><div class="row">
          <label class="toggle ${state.skirmish ? 'on' : ''}"><input type="checkbox" data-t="skirmish" ${state.skirmish ? 'checked' : ''}> Skirmish</label>
          <label class="toggle ${state.campaign ? 'on' : ''}"><input type="checkbox" data-t="campaign" ${state.campaign ? 'checked' : ''}> Campaign</label>
          <label class="toggle ${state.pool ? 'on' : ''}"><input type="checkbox" data-t="pool" ${state.pool ? 'checked' : ''}> A player uses 'Pool</label></div></div>
      </div>
      <div class="cfg-row"><div class="cfg-group grow"><span class="cfg-label">Scenario <span class="hint">(optional — adds its exact villain deck, schemes and encounter sets to the steps)</span></span>
        <select class="select" id="scnSel" style="width:100%">${scnOpts}</select></div></div>
      ${scnHtml}`;
    $$('[data-k]').forEach(b => b.addEventListener('click', () => {
      const k = b.dataset.k; state[k] = k === 'players' ? +b.dataset.v : b.dataset.v; update();
    }));
    $('#heroic').addEventListener('change', e => { state.heroic = +e.target.value; update(); });
    $$('[data-t]').forEach(i => i.addEventListener('change', () => { state[i.dataset.t] = i.checked; update(); }));
    $('#scnSel').addEventListener('change', e => { state.scn = e.target.value; state.mods = null; state.std = null; state.exp = null; update(); });
    $$('[data-mod]').forEach(b => b.addEventListener('click', () => {
      const c = ctx(); const id = b.dataset.mod;
      state.mods = c.modulars.includes(id) ? c.modulars.filter(x => x !== id) : c.modulars.concat(id);
      update();
    }));
    const am = $('#addMod'); if (am) am.addEventListener('change', e => { if (!e.target.value) return; state.mods = ctx().modulars.concat(e.target.value); update(); });
  }

  // --------------------------------------------------------------- content
  function stepHtml(st, n, c, cls) {
    let d = '';
    try { d = val(st.d, c); } catch (e) { console.warn(e); d = ''; }
    return `<li class="step ${cls || ''}"><span class="num">${n}</span><div><h4>${esc(st.t)}</h4><div class="d">${d}</div>${st.src ? `<span class="src">📖 ${esc(st.src)}</span>` : ''}</div></li>`;
  }
  function scenarioSteps(c) {
    // Setup steps 8, 10 and 12 in data.js already fold in the scenario's decks and setup notes;
    // this adds the scenario's own ongoing rules (from its insert) after the setup sequence.
    const s = c.scn;
    if (!s) return [];
    const items = [];
    if ((s.specialRules || []).length) items.push({ t: `${s.name}: special rules`, d: `<ul>${s.specialRules.map(x => `<li>${esc(x)}</li>`).join('')}</ul>`, src: s.src });
    if (s.modularChoice) items.push({ t: 'Choosing modular sets', d: `<p>Choose ${esc(String(s.modularChoice.count || ''))} modular set${s.modularChoice.count > 1 ? 's' : ''}: ${esc(s.modularChoice.from || '')}.</p>`, src: s.src });
    return items;
  }
  function renderContent() {
    const c = ctx();
    const MCd = RULES;
    let html = '';
    // ---- setup
    const phases = MCd.phases || ['Setup'];
    const steps = (MCd.setup || []).filter(st => when(st, c));
    let n = 0;
    let setupHtml = '';
    phases.forEach((ph, i) => {
      const list = steps.filter(st => (st.ph || 0) === i);
      if (!list.length) return;
      setupHtml += `<div class="phase"><h3 class="phase-h">${esc(ph)}</h3><ol class="steps">${list.map(st => stepHtml(st, st.n || ++n, c, st.when ? 'mode' : '')).join('')}</ol></div>`;
    });
    const sItems = scenarioSteps(c);
    if (sItems && sItems.length) setupHtml += `<div class="phase"><h3 class="phase-h">While playing ${esc(c.scn.name)}</h3><ol class="steps">${sItems.map(st => stepHtml(st, '★', c, 'scn')).join('')}</ol></div>`;
    html += `<section class="sec" id="sec-setup"><h2 class="sec-h">Setup <span class="tagbox">${c.players} player${c.players > 1 ? 's' : ''} · ${c.mode}${c.heroic ? ' · heroic ' + c.heroic : ''}</span></h2>
      <p class="sec-intro">The official 16-step setup (Rules Reference Appendix II, p.51), filled in for your options${c.scn ? ' and ' + esc(c.scn.name) : ''}. Steps that only apply to a chosen option are outlined in gold.</p>${setupHtml || '<p class="muted">Setup data is loading…</p>'}</section>`;
    // ---- round
    const round = MCd.round || [];
    if (round.length) {
      html += `<section class="sec" id="sec-round"><h2 class="sec-h">The round at a glance</h2><div class="round">${round.map(r => `<div class="panel ${esc(r.id)}"><h3>${esc(r.h)}</h3>${(r.steps || []).map((s, i) => `<div class="rs"><span class="n">${i + 1}</span><div><span class="rs-t">${esc(s.t)}</span><div class="rs-d">${val(s.d, c) || ''}</div>${s.src ? `<span class="src">📖 ${esc(s.src)}</span>` : ''}</div></div>`).join('')}${r.src ? `<span class="src">📖 ${esc(r.src)}</span>` : ''}</div>`).join('')}</div></section>`;
    }
    // ---- reference
    const ref = (MCd.reference || []).filter(r => when(r, c));
    const modes = MCd.modes || [];
    const db = MCd.deckbuilding;
    let refHtml = ref.map(r => refCard(r, c)).join('');
    if (modes.length) refHtml += `<div class="panel"><h3>Modes of play</h3><ul>${modes.map(m => `<li><b>${esc(m.h)}</b> — ${val(m.d, c)} <span class="src">📖 ${esc(m.src || '')}</span></li>`).join('')}</ul></div>`;
    if (db) refHtml += `<div class="panel"><h3>Deck building</h3><ul>${(db.player || []).map(x => `<li>${x}</li>`).join('')}</ul>${(db.encounter || []).length ? `<h3 style="margin-top:12px">Encounter decks</h3><ul>${db.encounter.map(x => `<li>${x}</li>`).join('')}</ul>` : ''}<span class="src">📖 ${esc(db.src || '')}</span></div>`;
    html += `<section class="sec" id="sec-ref"><h2 class="sec-h">Rules reference</h2><div class="masonry">${refHtml}</div></section>`;
    // ---- keywords
    const kws = MCd.keywords || [];
    html += `<section class="sec" id="sec-kw"><h2 class="sec-h">Keywords &amp; icons <span class="tagbox">${kws.length}</span></h2>
      <div class="toolbar"><input class="input search" id="kwQ" type="search" placeholder="Filter keywords…" aria-label="Filter keywords">
      <div class="seg" role="group"><button type="button" data-side="all" class="on">All</button><button type="button" data-side="encounter">Encounter</button><button type="button" data-side="player">Player</button></div></div>
      <div class="kw-grid" id="kwGrid">${kws.map(k => `<div class="kw" data-side="${esc(k.side || 'both')}" data-q="${esc((k.k + ' ' + stripTags(k.d)).toLowerCase())}"><span class="side pill ${k.side === 'encounter' ? 'a-encounter' : k.side === 'player' ? 'a-leadership' : 'a-basic'}">${esc(k.side || 'both')}</span><span class="kw-n">${esc(k.k)}</span><p>${k.d}</p><span class="src">📖 ${esc(k.src || '')}</span></div>`).join('')}</div></section>`;
    // ---- FAQ & errata
    const faq = MCd.faq || [], errata = MCd.errata || [];
    html += `<section class="sec faq" id="sec-faq"><h2 class="sec-h">FAQ &amp; errata <span class="tagbox">RR v1.8</span></h2>
      <p class="sec-intro">Official rulings from Appendix IV (FAQ) and Appendix V (errata) of the Rules Reference, paraphrased. Errata'd card text always wins over the printed card.</p>
      <div class="toolbar"><input class="input search" id="faqQ" type="search" placeholder="Filter FAQ &amp; errata (card name, keyword…)" aria-label="Filter FAQ"></div>
      <h3 class="phase-h">FAQ · ${faq.length}</h3>
      <div id="faqList">${faq.map(f => `<details data-q="${esc((f.q + ' ' + stripTags(f.a) + ' ' + (f.topic || '')).toLowerCase())}"><summary><span class="q-t">${f.topic ? `<span class="topic">${esc(f.topic)}</span>` : ''}${esc(f.q)}</span></summary><div class="ans">${f.a}<br><span class="src">📖 ${esc(f.src || '')}</span></div></details>`).join('')}</div>
      <h3 class="phase-h" style="margin-top:16px">Errata · ${errata.length}</h3>
      <div class="tblwrap"><table class="tbl" id="errTbl"><thead><tr><th>Card</th><th>Change</th><th>Source</th></tr></thead><tbody>${errata.map(e => `<tr data-q="${esc((e.card + ' ' + (e.product || '') + ' ' + stripTags(e.change)).toLowerCase())}"><td><b>${esc(e.card)}</b><br><span class="dim">${esc(e.product || '')}</span></td><td>${e.change}</td><td class="dim">${esc(e.src || '')}</td></tr>`).join('')}</tbody></table></div></section>`;
    // ---- search
    html += `<section class="sec" id="sec-search"><h2 class="sec-h">Search the rulebooks</h2>
      <p class="sec-intro">Searches every page of the Rules Reference v1.8 and the Learn to Play. Type keywords or ask a plain question (“can allies defend for another player?”). Expand a result for the full page.</p>
      <input type="search" id="rules-q" class="input rs-input" placeholder="Ask a question, or search a rule or keyword…" autocomplete="off" spellcheck="false">
      <div id="rules-results"><p class="rs-hint">Type a few words — or ask a question.</p></div></section>`;
    $('#content').innerHTML = html;
    bindFilters();
    const rq = $('#rules-q'); rq.addEventListener('input', () => mcSearch(rq.value));
  }
  function refCard(r, c) {
    let body = '';
    if (r.intro) body += `<p>${val(r.intro, c)}</p>`;
    if (r.items) body += `<ul>${val(r.items, c).map(x => `<li>${x}</li>`).join('')}</ul>`;
    if (r.table) body += `<table><thead><tr>${r.table.cols.map(h => `<th>${esc(h)}</th>`).join('')}</tr></thead><tbody>${r.table.rows.map(row => `<tr>${row.map(x => `<td>${x}</td>`).join('')}</tr>`).join('')}</tbody></table>`;
    return `<div class="panel" id="ref-${esc(r.id)}"><h3>${esc(r.h)}</h3>${body}${r.src ? `<span class="src">📖 ${esc(r.src)}</span>` : ''}</div>`;
  }
  function stripTags(s) { return String(s || '').replace(/<[^>]+>/g, ' '); }
  function bindFilters() {
    let side = 'all';
    const kq = $('#kwQ');
    const applyKw = () => {
      const q = kq.value.trim().toLowerCase();
      $$('#kwGrid .kw').forEach(k => { k.hidden = !((side === 'all' || k.dataset.side === side || k.dataset.side === 'both') && (!q || k.dataset.q.includes(q))); });
    };
    kq.addEventListener('input', applyKw);
    $$('[data-side]', $('#sec-kw .seg')).forEach(b => b.addEventListener('click', () => { side = b.dataset.side; $$('[data-side]', $('#sec-kw .seg')).forEach(x => x.classList.toggle('on', x === b)); applyKw(); }));
    const fq = $('#faqQ');
    fq.addEventListener('input', () => {
      const q = fq.value.trim().toLowerCase();
      $$('#faqList details').forEach(d => { d.hidden = q && !d.dataset.q.includes(q); if (q && !d.hidden) d.open = true; });
      $$('#errTbl tbody tr').forEach(r => { r.hidden = q && !r.dataset.q.includes(q); });
    });
  }

  // ------------------------------------------------------------ teaching
  function teachHtml(c) {
    const T = RULES.teach;
    if (!T) return '<p>Teaching script is loading…</p>';
    let h = `<div class="teach-head"><h3>Teach this game in ~5 minutes</h3><div class="row"><button class="btn small" id="copyTeach">📋 Copy script</button><button class="btn small ghost" id="closeTeach">Close</button></div></div>`;
    h += `<div class="teach-body">${val(T.intro, c) || ''}`;
    for (const s of (T.sections || [])) {
      if (!when(s, c)) continue;
      let body = '';
      try { body = val(s.body, c); } catch (e) { console.warn(e); }
      if (!body) continue;
      h += `<h4>${esc(val(s.h, c))}</h4>${body}`;
    }
    return h + '</div>';
  }
  function toggleTeach(force) {
    const p = $('#teach');
    const show = force != null ? force : p.hidden;
    p.hidden = !show;
    if (show) {
      p.innerHTML = teachHtml(ctx());
      $('#closeTeach').addEventListener('click', () => toggleTeach(false));
      $('#copyTeach').addEventListener('click', () => {
        const text = $('.teach-body', p).innerText.replace(/\n{3,}/g, '\n\n');
        copy(text, 'Teaching script copied');
      });
      p.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
  async function copy(text, msg) {
    try { await navigator.clipboard.writeText(text); flash(msg); } catch (e) { flash('Copy blocked by the browser'); }
  }
  function flash(msg) {
    let t = $('#toast');
    if (!t) { t = document.createElement('div'); t.id = 'toast'; t.className = 'toast'; document.body.appendChild(t); }
    t.textContent = msg; t.hidden = false; clearTimeout(flash._t); flash._t = setTimeout(() => { t.hidden = true; }, 2400);
  }

  // --------------------------------------------------------------- search
  // BM25 with stop-words, plural stemming and Marvel Champions synonyms (pattern from the site's other player aids).
  const STOP = new Set(('a an the and or but if then of to in on for from with as at by be is are was were do does did can could should would will may might must have has had this that these those it its i you he she they we me my your our their what when where which who whom why how than into over under about during while there here not no yes get got make use using used such per each any all some many much his her him').split(' '));
  const SYN = {
    thwart: ['threat', 'scheme', 'remove'], threat: ['scheme', 'thwart', 'acceleration'], scheme: ['threat', 'main', 'side'],
    attack: ['damage', 'atk'], damage: ['attack', 'defeat', 'hit'], defend: ['defense', 'def', 'undefended'], defense: ['defend', 'def'],
    heal: ['recover', 'damage'], recover: ['heal', 'rec', 'alter'], hand: ['size', 'draw', 'discard'], draw: ['hand', 'deck'],
    ally: ['allies', 'limit', 'consequential'], allies: ['ally'], resource: ['cost', 'pay', 'generate', 'wild'], cost: ['resource', 'pay'], pay: ['resource', 'cost'],
    form: ['hero', 'alter', 'flip', 'change'], alter: ['form', 'ego'], hero: ['form', 'identity'], flip: ['form', 'change'],
    villain: ['stage', 'activation', 'boost'], boost: ['villain', 'activation', 'icon'], minion: ['engage', 'engaged', 'guard'], engage: ['minion'],
    encounter: ['deal', 'reveal', 'surge'], surge: ['encounter', 'reveal'], treachery: ['reveal', 'encounter'], obligation: ['encounter', 'nemesis'],
    nemesis: ['obligation', 'set'], stun: ['stunned', 'status'], stunned: ['stun', 'status'], confuse: ['confused', 'status'], confused: ['confuse', 'status'],
    tough: ['status', 'damage'], expert: ['mode', 'set'], heroic: ['mode', 'level'], skirmish: ['mode', 'rookie'], campaign: ['mode', 'log'],
    unique: ['match', 'title'], mulligan: ['setup', 'draw'], first: ['player', 'token'], exhaust: ['ready', 'basic'], ready: ['exhaust'],
    lose: ['defeat', 'win', 'threat'], win: ['defeat', 'villain'], deck: ['empty', 'shuffle'], upgrade: ['attach', 'restricted'], support: ['upgrade'],
  };
  const stem = w => { if (w.length <= 3) return w; w = w.replace(/('s|s')$/, ''); if (/ies$/.test(w) && w.length > 4) return w.slice(0, -3) + 'y'; if (/(ches|shes|sses|xes|zes)$/.test(w)) return w.slice(0, -2); if (/s$/.test(w) && !/(ss|us|is|as|os)$/.test(w)) return w.slice(0, -1); return w; };
  const tok = t => (t.toLowerCase().match(/[a-z0-9]+/g) || []).filter(w => !STOP.has(w) && w.length >= 2).map(stem).filter(s => s.length >= 2);
  let SI = null;
  function index() {
    if (SI) return SI;
    const docs = [], inv = new Map(); let total = 0;
    (RULES.rulesIndex || []).forEach((e, i) => {
      const flat = e.t.replace(/\n/g, ' ');
      const tk = tok(flat); const tf = new Map();
      tk.forEach(t => tf.set(t, (tf.get(t) || 0) + 1));
      tf.forEach((n, t) => { let p = inv.get(t); if (!p) { p = []; inv.set(t, p); } p.push([i, n]); });
      docs.push({ len: tk.length || 1, low: flat.toLowerCase() }); total += tk.length;
    });
    SI = { docs, inv, N: docs.length, avg: total / Math.max(1, docs.length) };
    return SI;
  }
  const escReg = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  function hl(text, terms) {
    let s = esc(text);
    const alt = terms.filter(t => t.length >= 3).map(t => escReg(t) + '\\w*');
    if (alt.length) s = s.replace(new RegExp('\\b(' + alt.join('|') + ')', 'gi'), '<mark>$1</mark>');
    return s;
  }
  function snip(text, terms, phrase) {
    const lt = text.toLowerCase();
    let pos = phrase.includes(' ') && lt.includes(phrase) ? lt.indexOf(phrase) : -1;
    if (pos < 0) for (const t of terms) { const m = lt.search(new RegExp('\\b' + escReg(t))); if (m >= 0 && (pos < 0 || m < pos)) pos = m; }
    pos = Math.max(0, pos);
    const a = Math.max(0, pos - 90), b = Math.min(text.length, pos + 230);
    return hl((a > 0 ? '… ' : '') + text.slice(a, b) + (b < text.length ? ' …' : ''), terms);
  }
  function mcSearch(q) {
    const box = $('#rules-results');
    const phrase = (q || '').trim().toLowerCase().replace(/\s+/g, ' ');
    if (phrase.length < 2) { box.innerHTML = '<p class="rs-hint">Type a few words — or ask a question.</p>'; return; }
    const MCd = RULES;
    if (!MCd.rulesIndex) { box.innerHTML = '<p class="rs-hint">Loading the rulebook index…</p>'; return; }
    const si = index();
    const raw = phrase.match(/[a-z0-9]+/g) || [];
    let qt = [...new Set(raw.filter(w => !STOP.has(w)).map(stem).filter(s => s.length >= 2))];
    if (!qt.length) qt = [...new Set(raw.map(stem).filter(s => s.length >= 2))];
    if (!qt.length) { box.innerHTML = '<p class="rs-hint">Try a more specific word.</p>'; return; }
    const question = /\b(how|what|why|when|where|who|which|can|do|does|should|is|are|will|if)\b/.test(phrase) || phrase.includes('?');
    const termMode = !question && qt.length <= 3;
    const syn = [];
    qt.forEach(t => (SYN[t] || []).map(stem).forEach(s => { if (!qt.includes(s) && !syn.includes(s)) syn.push(s); }));
    const all = qt.concat(syn);
    const acc = new Map(), k1 = 1.5, b = 0.75;
    all.forEach((t, ti) => {
      const post = si.inv.get(t); if (!post) return;
      const idf = Math.log(1 + (si.N - post.length + 0.5) / (post.length + 0.5));
      const w = ti < qt.length ? 1 : 0.45;
      post.forEach(([i, tf]) => {
        const dl = si.docs[i].len;
        const s = idf * (tf * (k1 + 1)) / (tf + k1 * (1 - b + b * dl / si.avg)) * w;
        let cur = acc.get(i); if (!cur) { cur = { score: 0, hits: new Set() }; acc.set(i, cur); }
        cur.score += s; if (ti < qt.length) cur.hits.add(t);
      });
    });
    const res = [];
    for (const [i, inf] of acc) {
      if (termMode && inf.hits.size < qt.length) continue;
      let score = inf.score;
      if (phrase.length >= 3 && si.docs[i].low.includes(phrase)) score *= 2.4;
      score *= 1 + (inf.hits.size - 1) * 0.15;
      if (MCd.rulesIndex[i].x === 'rr') score *= 1.05;     // the Rules Reference is the definitive source (RR p.4)
      res.push({ e: MCd.rulesIndex[i], score });
    }
    res.sort((a, b2) => b2.score - a.score);
    const top = res.slice(0, 25);
    if (!top.length) { box.innerHTML = '<p class="rs-hint">No matches. Try different words.</p>'; return; }
    box.innerHTML = `<p class="rs-count">${res.length} matching page${res.length === 1 ? '' : 's'}${res.length > top.length ? ` · showing top ${top.length}` : ''}</p>` + top.map(r => {
      const e = r.e;
      return `<details class="rs-item"><summary class="rs-sum"><div class="rs-meta"><span class="pill ${e.x === 'rr' ? 'a-aggression' : 'a-leadership'}">${esc(e.x === 'rr' ? 'Rules Reference' : 'Learn to Play')}</span><span>${esc(e.b)} · p.${e.p}</span><span class="rs-toggle">Full page</span></div><div class="rs-snip">${snip(e.t.replace(/\n/g, ' '), qt, phrase)}</div></summary><div class="rs-full">${e.t.split('\n').map(p => `<p>${hl(p, qt)}</p>`).join('')}</div></details>`;
    }).join('');
  }

  // ------------------------------------------------------------------ boot
  function update() { writeHash(); renderConfig(); renderContent(); if (!$('#teach').hidden) $('#teach').innerHTML = teachHtml(ctx()), toggleTeach(true); }
  function addJumpbar() {
    const bar = document.createElement('nav');
    bar.className = 'jumpbar'; bar.setAttribute('aria-label', 'Sections');
    bar.innerHTML = [['sec-setup', 'Setup'], ['sec-round', 'Round'], ['sec-ref', 'Reference'], ['sec-kw', 'Keywords'], ['sec-faq', 'FAQ & Errata'], ['sec-search', 'Search']].map(([id, l]) => `<a href="#${id}" data-jumpto="${id}">${l}</a>`).join('');
    $('.mc-main').insertBefore(bar, $('.mc-main').firstChild);
    document.addEventListener('click', e => {
      const a = e.target.closest('[data-jumpto], [data-jump]');
      if (!a) return;
      e.preventDefault();
      const id = a.dataset.jumpto || a.getAttribute('href').slice(1);
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }
  $('#teachBtn').addEventListener('click', () => toggleTeach());
  $('#copyLink').addEventListener('click', () => { writeHash(); copy(location.href, 'Setup link copied'); });
  window.addEventListener('hashchange', () => { if (/^#(p|m|scn|h)=/.test(location.hash) || location.hash.includes('&')) { readHash(); renderConfig(); renderContent(); } });
  readHash();
  addJumpbar();
  renderConfig();
  renderContent();
  writeHash();
})();
