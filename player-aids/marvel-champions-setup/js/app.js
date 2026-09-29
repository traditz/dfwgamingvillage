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
  // Competitive (VS) mode: vs, t = players per team, and per side (reg / res) the leader scenario,
  // its modular sets (…m) and its stage 1 + stage 2 main scheme codes (…s). null = the preconstructed scenario's.
  const state = { players: 2, mode: 'standard', heroic: 0, skirmish: false, campaign: false, pool: false, scn: '', mods: null, std: null, exp: null,
    vs: false, team: 2, reg: '', res: '', regm: null, resm: null, regs: null, ress: null, lms: null };
  const VSKEY = { registration: 'reg', resistance: 'res' };
  const list = (p, k) => (p.has(k) ? p.get(k).split(',').filter(Boolean) : null);
  function readHash() {
    const p = new URLSearchParams(location.hash.replace(/^#/, ''));
    if (p.has('p')) state.players = clamp(+p.get('p'), 1, 4);
    if (p.has('m')) state.mode = p.get('m') === 'expert' ? 'expert' : 'standard';
    if (p.has('h')) state.heroic = clamp(+p.get('h'), 0, 5);
    state.skirmish = p.get('sk') === '1';
    state.campaign = p.get('cp') === '1';
    state.pool = p.get('pool') === '1';
    if (p.has('scn')) state.scn = p.get('scn');
    state.mods = list(p, 'mods');
    state.lms = list(p, 'lms');
    state.std = p.has('std') ? p.get('std') : null;
    state.exp = p.has('exp') ? p.get('exp') : null;
    state.vs = p.get('vs') === '1';
    if (p.has('t')) state.team = clamp(+p.get('t'), 1, 2);
    for (const k of ['reg', 'res']) {
      state[k] = p.get(k) || '';
      state[k + 'm'] = list(p, k + 'm');
      state[k + 's'] = list(p, k + 's');
    }
  }
  function writeHash() {
    const p = new URLSearchParams();
    if (state.vs) {
      p.set('vs', '1'); p.set('t', state.team); p.set('m', state.mode);
      for (const k of ['reg', 'res']) {
        if (state[k]) p.set(k, state[k]);
        if (state[k + 'm']) p.set(k + 'm', state[k + 'm'].join(','));
        if (state[k + 's']) p.set(k + 's', state[k + 's'].join(','));
      }
    } else {
      p.set('p', state.players); p.set('m', state.mode);
      if (state.heroic) p.set('h', state.heroic);
      if (state.skirmish) p.set('sk', '1');
      if (state.campaign) p.set('cp', '1');
      if (state.pool) p.set('pool', '1');
      if (state.scn) p.set('scn', state.scn);
      if (state.scn && state.mods) p.set('mods', state.mods.join(','));
      if (state.scn && state.lms) p.set('lms', state.lms.join(','));
      if (state.std) p.set('std', state.std);
      if (state.exp) p.set('exp', state.exp);
    }
    const h = '#' + p.toString();
    if (location.hash !== h) history.replaceState(null, '', h);
  }
  const clamp = (n, a, b) => Math.max(a, Math.min(b, isNaN(n) ? a : n));
  function scenario() { return ENC && state.scn ? ENC.scenarios.find(s => s.id === state.scn) || null : null; }
  const leaderTitle = s => String(s.villain || s.name).replace(/\s*\(leader\)$/i, '');
  // The scenario one team builds for its own leader (Civil War rulebook p.4-5).
  function vsTeam(side) {
    const V = ENC && ENC.vs;
    const sd = V && V.sides[side];
    if (!sd) return null;
    const key = VSKEY[side];
    const leaders = ENC.scenarios.filter(s => s.side === side);
    const s = leaders.find(x => x.id === state[key]) || leaders[0];
    if (!s) return null;
    const codes = state[key + 's'] || s.vsSchemes || [];
    return {
      side, sideName: sd.name, scn: s, leader: leaderTitle(s), pool: sd, cards: s.vsCards || [],
      modulars: (state[key + 'm'] || s.recommendedModulars || []).filter(id => sd.modulars.includes(id)),
      ms1: sd.stage1.find(x => x.code === codes[0]) || sd.stage1[0],
      ms2: sd.stage2.find(x => x.code === codes[1]) || sd.stage2[0],
    };
  }
  // A leader scenario's stage 1 and stage 2 main schemes in co-op (custom scenario creation, Civil War rulebook p.4-5)
  function leaderMs(s) {
    const sd = s && s.side && ENC && ENC.vs ? ENC.vs.sides[s.side] : null;
    if (!sd) return null;
    const codes = state.lms || s.vsSchemes || [];
    const m1 = sd.stage1.find(x => x.code === codes[0]) || sd.stage1[0], m2 = sd.stage2.find(x => x.code === codes[1]) || sd.stage2[0];
    return m1 && m2 ? [m1, m2] : null;
  }
  function ctx() {
    if (state.vs && ENC && ENC.vs) {
      return {
        vs: true, team: state.team, players: state.team, mode: state.mode, heroic: 0, skirmish: false, campaign: false, pool: false,
        scn: null, setName, linkSets: true, modulars: [], teams: { registration: vsTeam('registration'), resistance: vsTeam('resistance') },
      };
    }
    const s = scenario();
    let scn = null;
    if (s) {
      scn = Object.assign({}, s);
      const ls = leaderMs(s);
      if (ls) scn.mainSchemeDeck = [ls[0].name + ' (stage 1)', ls[1].name + ' (stage 2)'];
      if (state.std !== null) scn.standardSet = state.std || null;
      if (state.exp !== null) scn.expertSet = state.exp || null;
    }
    const mods = s ? (state.mods || (s.recommendedModulars || []).slice()) : [];
    return {
      players: state.players, mode: state.mode, heroic: state.heroic, skirmish: state.skirmish,
      campaign: state.campaign, pool: state.pool, scn, setName, linkSets: true, modulars: mods,
    };
  }
  const val = (x, c) => typeof x === 'function' ? x(c) : x;
  const when = (item, c) => { try { return !item.when || item.when(c); } catch (e) { console.warn(e); return false; } };

  // --------------------------------------------------------- configurator
  const infoBtn = (id, side) => `<button type="button" class="chip-info" data-setinfo="${esc(id)}"${side ? ` data-side="${side}"` : ''} aria-label="What's in ${esc(setName(id))}" title="See the cards in this set">i</button>`;
  function openSet(id, side, fromChip) {
    if (!window.MCSetSheet) return;
    let action = null;
    if (fromChip && side) {
      const t = vsTeam(side);
      const on = t && t.modulars.includes(id);
      if (t) action = { label: on ? `Remove from the ${side} scenario` : `Add to the ${side} scenario`, cls: on ? 'ghost' : 'red', onClick: () => { state[VSKEY[side] + 'm'] = on ? t.modulars.filter(x => x !== id) : t.modulars.concat(id); update(); } };
    } else if (fromChip && scenario()) {
      const mods = ctx().modulars, on = mods.includes(id);
      action = { label: on ? 'Remove from this setup' : 'Add to this setup', cls: on ? 'ghost' : 'red', onClick: () => { state.mods = on ? mods.filter(x => x !== id) : mods.concat(id); update(); } };
    }
    window.MCSetSheet.open(id, action ? { action } : {});
  }
  document.addEventListener('click', e => {
    const el = e.target.closest('[data-setinfo]');
    if (!el) return;
    e.preventDefault();
    openSet(el.dataset.setinfo, el.dataset.side || null, el.classList.contains('chip-info'));
  });
  const seg = (key, opts) => `<div class="seg" role="group">${opts.map(([v, l]) => `<button type="button" data-k="${key}" data-v="${v}" class="${String(state[key]) === String(v) ? 'on' : ''}">${l}</button>`).join('')}</div>`;
  const gameSeg = () => (ENC && ENC.vs ? `<div class="cfg-group"><span class="cfg-label">Game</span>${seg('vs', [['false', 'Co-op'], ['true', 'VS · competitive']])}</div>` : '');
  function bindSeg() {
    $$('[data-k]').forEach(b => b.addEventListener('click', () => {
      const k = b.dataset.k, v = b.dataset.v;
      state[k] = k === 'players' || k === 'team' ? +v : k === 'vs' ? v === 'true' : v;
      update();
    }));
  }
  function vsTeamCard(side) {
    const t = vsTeam(side);
    if (!t) return '';
    const key = VSKEY[side], foe = side === 'registration' ? 'resistance' : 'registration';
    const rec = t.scn.recommendedModulars || [];
    const n = t.modulars.length;
    const chips = t.pool.modulars.map(id => `<span class="chipset"><button type="button" class="chip ${t.modulars.includes(id) ? 'on' : ''}" data-vsmod="${side}:${esc(id)}" aria-pressed="${t.modulars.includes(id)}">${esc(setName(id))}${rec.includes(id) ? ' ★' : ''}</button>${infoBtn(id, side)}</span>`).join('');
    const msSel = (stage, cur) => `<select class="select" data-vsms="${side}:${stage}" aria-label="${esc(t.sideName)} stage ${stage} main scheme">${t.pool['stage' + stage].map(x => `<option value="${esc(x.code)}" ${cur && cur.code === x.code ? 'selected' : ''}>${esc(x.name)}${x.product === 'synthezoid' ? ' (Synthezoid)' : ''}</option>`).join('')}</select>`;
    const bq = new URLSearchParams({ vs: '1', p: String(state.team), m: state.mode, mods: t.modulars.join(','), ms1: t.ms1 ? t.ms1.code : '', ms2: t.ms2 ? t.ms2.code : '' });
    return `<div class="vs-team ${side}">
      <div class="vs-team-h"><span class="vs-side">${esc(t.sideName)} team</span><span class="muted">builds this scenario · the ${foe} team plays against it</span></div>
      <div class="scn-card">${t.scn.img ? `<img src="../marvel-champions-builder/${esc(t.scn.img)}" alt="">` : '<span></span>'}
        <div>
          <label class="cfg-label" for="vsL-${side}">Leader</label>
          <select class="select" id="vsL-${side}" data-vsleader="${side}">${ENC.scenarios.filter(s => s.side === side).map(s => `<option value="${esc(s.id)}" ${s.id === t.scn.id ? 'selected' : ''}>${esc(leaderTitle(s))} · ${esc(s.productName)}</option>`).join('')}</select>
          <div class="cfg-label vs-lbl">Modular sets <span class="hint">${n} chosen · 3–4 from the ${side} side${n < 3 || n > 4 ? ' · <b class="warn">choose 3–4</b>' : ''}</span></div>
          <div class="row">${chips}</div>
          <div class="cfg-label vs-lbl">Main schemes <span class="hint">one stage 1 on top of one stage 2</span></div>
          <div class="vs-ms">${msSel(1, t.ms1)}<span aria-hidden="true">→</span>${msSel(2, t.ms2)}</div>
          <p class="explain" style="margin:8px 0 0">★ = in the preconstructed ${esc(t.leader)} scenario; <b>i</b> = see the cards. <a href="../marvel-champions-builder/#villain/${encodeURIComponent(t.scn.id)}?${bq.toString()}">Open in builder ↗</a></p>
        </div></div></div>`;
  }
  function renderVsConfig() {
    $('#cfg').innerHTML = `
      <div class="cfg-row">${gameSeg()}
        <div class="cfg-group"><span class="cfg-label">Teams</span>${seg('team', [[1, '1v1'], [2, '2v2']])}</div>
        <div class="cfg-group"><span class="cfg-label">Mode</span>${seg('mode', [['standard', 'Standard'], ['expert', 'Expert']])}</div>
      </div>
      <p class="explain" style="margin:0">Competitive mode (Civil War rulebook p.14): each team builds a scenario for <b>its own</b> leader, then the teams trade. Tune both below; the setup, round and rules adapt.</p>
      <div class="vs-teams">${vsTeamCard('registration')}${vsTeamCard('resistance')}</div>`;
    bindSeg();
    $$('[data-vsleader]').forEach(sel => sel.addEventListener('change', e => {
      const key = VSKEY[sel.dataset.vsleader];
      state[key] = e.target.value; state[key + 'm'] = null; state[key + 's'] = null;
      update();
    }));
    $$('[data-vsmod]').forEach(b => b.addEventListener('click', () => {
      const [side, id] = b.dataset.vsmod.split(':');
      const t = vsTeam(side);
      state[VSKEY[side] + 'm'] = t.modulars.includes(id) ? t.modulars.filter(x => x !== id) : t.modulars.concat(id);
      update();
    }));
    $$('[data-vsms]').forEach(sel => sel.addEventListener('change', e => {
      const [side, stage] = sel.dataset.vsms.split(':');
      const t = vsTeam(side);
      const codes = [t.ms1 ? t.ms1.code : '', t.ms2 ? t.ms2.code : ''];
      codes[+stage - 1] = e.target.value;
      state[VSKEY[side] + 's'] = codes;
      update();
    }));
  }
  function lmsHtml(s) {
    const ls = leaderMs(s);
    if (!ls) return '';
    const sd = ENC.vs.sides[s.side];
    const sel = k => `<select class="select" data-lms="${k}" aria-label="Stage ${k} main scheme">${sd['stage' + k].map(x => `<option value="${esc(x.code)}" ${x.code === ls[k - 1].code ? 'selected' : ''}>${esc(x.name)}${x.product === 'synthezoid' ? ' (Synthezoid)' : ''}</option>`).join('')}</select>`;
    return `<div class="cfg-label vs-lbl">Main schemes <span class="hint">one ${esc(s.side)} stage 1 on top of one stage 2</span></div><div class="vs-ms">${sel(1)}<span aria-hidden="true">→</span>${sel(2)}</div>`;
  }
  function renderConfig() {
    if (state.vs && ENC && ENC.vs) { renderVsConfig(); return; }
    const s = scenario();
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
        .map(id => `<span class="chipset"><button type="button" class="chip ${c.modulars.includes(id) ? 'on' : ''}" data-mod="${esc(id)}">${esc(setName(id))}${(s.recommendedModulars || []).includes(id) ? ' ★' : ''}</button>${infoBtn(id)}</span>`).join('');
      const addOpts = (ENC.modularOrder || []).filter(id => !c.modulars.includes(id)).map(id => `<option value="${esc(id)}">${esc(setName(id))}</option>`).join('');
      scnHtml = `<div class="scn-card">${s.img ? `<img src="../marvel-champions-builder/${esc(s.img)}" alt="">` : '<span></span>'}
        <div><b>${esc(s.name)}</b><div class="muted">${esc(s.productName)}${s.campaign ? ' · ' + esc(s.campaign) : ''}</div>
        <div class="row" style="margin-top:8px">${modChips}<select class="select" id="addMod" aria-label="Add a modular set"><option value="">+ Add modular…</option>${addOpts}</select>
        <a class="btn small ghost" href="../marvel-champions-builder/#villain/${encodeURIComponent(s.id)}">Open in builder ↗</a></div>
        ${lmsHtml(s)}
        <p class="explain" style="margin:6px 0 0">★ = recommended by the scenario insert. Tap a chip to remove it, or its <b>i</b> to see the cards.</p></div></div>`;
    }
    $('#cfg').innerHTML = `
      <div class="cfg-row">${gameSeg()}
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
    bindSeg();
    $('#heroic').addEventListener('change', e => { state.heroic = +e.target.value; update(); });
    $$('[data-t]').forEach(i => i.addEventListener('change', () => { state[i.dataset.t] = i.checked; update(); }));
    $('#scnSel').addEventListener('change', e => { state.scn = e.target.value; state.mods = null; state.std = null; state.exp = null; state.lms = null; update(); });
    $$('[data-lms]').forEach(sel => sel.addEventListener('change', e => {
      const ls = leaderMs(scenario());
      const codes = ls ? [ls[0].code, ls[1].code] : ['', ''];
      codes[+sel.dataset.lms - 1] = e.target.value;
      state.lms = codes;
      update();
    }));
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
    if (c.vs && (MCd.vsSetup || []).length) {
      setupHtml += `<div class="phase"><h3 class="phase-h vs">${esc(MCd.vsPhase || 'Competitive setup')}</h3><ol class="steps">${MCd.vsSetup.map(st => stepHtml(st, st.n, c, 'mode vs')).join('')}</ol></div>`;
    }
    phases.forEach((ph, i) => {
      const list = steps.filter(st => (st.ph || 0) === i);
      if (!list.length) return;
      setupHtml += `<div class="phase"><h3 class="phase-h">${esc(ph)}</h3><ol class="steps">${list.map(st => stepHtml(st, st.n || ++n, c, st.when || (c.vs && st.vs) ? 'mode' : '')).join('')}</ol></div>`;
    });
    const sItems = scenarioSteps(c);
    if (sItems && sItems.length) setupHtml += `<div class="phase"><h3 class="phase-h">While playing ${esc(c.scn.name)}</h3><ol class="steps">${sItems.map(st => stepHtml(st, '★', c, 'scn')).join('')}</ol></div>`;
    const tag = c.vs ? `${c.team === 1 ? '1v1' : '2v2'} · VS · ${c.mode}` : `${c.players} player${c.players > 1 ? 's' : ''} · ${c.mode}${c.heroic ? ' · heroic ' + c.heroic : ''}`;
    const intro = c.vs
      ? 'Competitive setup comes first (Civil War rulebook p.14). Then each team follows the official 16-step setup (Rules Reference Appendix II, p.51) in its own game area, against the scenario the other team built. Steps that change in competitive mode are outlined in gold.'
      : `The official 16-step setup (Rules Reference Appendix II, p.51), filled in for your options${c.scn ? ' and ' + esc(c.scn.name) : ''}. Steps that only apply to a chosen option are outlined in gold.`;
    html += `<section class="sec" id="sec-setup"><h2 class="sec-h">Setup <span class="tagbox">${tag}</span></h2>
      <p class="sec-intro">${intro}</p>${setupHtml || '<p class="muted">Setup data is loading…</p>'}</section>`;
    // ---- round
    const round = (MCd.round || []).filter(r => when(r, c));
    if (round.length) {
      html += `<section class="sec" id="sec-round"><h2 class="sec-h">The round at a glance</h2><div class="round">${round.map(r => `<div class="panel ${esc(r.id)}"><h3>${esc(r.h)}</h3>${(r.steps || []).map((s, i) => `<div class="rs"><span class="n">${i + 1}</span><div><span class="rs-t">${esc(s.t)}</span><div class="rs-d">${val(s.d, c) || ''}</div>${s.src ? `<span class="src">📖 ${esc(s.src)}</span>` : ''}</div></div>`).join('')}${r.note ? `<p class="rs-note">${val(r.note, c)}</p>` : ''}${r.src ? `<span class="src">📖 ${esc(r.src)}</span>` : ''}</div>`).join('')}</div></section>`;
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
      <p class="sec-intro">Official rulings from Appendix IV (FAQ) and Appendix V (errata) of the Rules Reference, plus the competitive-mode FAQ from the Civil War rulebook — paraphrased. Errata'd card text always wins over the printed card.</p>
      <div class="toolbar"><input class="input search" id="faqQ" type="search" placeholder="Filter FAQ &amp; errata (card name, keyword…)" aria-label="Filter FAQ"></div>
      <h3 class="phase-h">FAQ · ${faq.length}</h3>
      <div id="faqList">${faq.map(f => `<details data-q="${esc((f.q + ' ' + stripTags(f.a) + ' ' + (f.topic || '')).toLowerCase())}"><summary><span class="q-t">${f.topic ? `<span class="topic">${esc(f.topic)}</span>` : ''}${esc(f.q)}</span></summary><div class="ans">${f.a}<br><span class="src">📖 ${esc(f.src || '')}</span></div></details>`).join('')}</div>
      <h3 class="phase-h" style="margin-top:16px">Errata · ${errata.length}</h3>
      <div class="tblwrap"><table class="tbl" id="errTbl"><thead><tr><th>Card</th><th>Change</th><th>Source</th></tr></thead><tbody>${errata.map(e => `<tr data-q="${esc((e.card + ' ' + (e.product || '') + ' ' + stripTags(e.change)).toLowerCase())}"><td><b>${esc(e.card)}</b><br><span class="dim">${esc(e.product || '')}</span></td><td>${e.change}</td><td class="dim">${esc(e.src || '')}</td></tr>`).join('')}</tbody></table></div></section>`;
    // ---- search
    html += `<section class="sec" id="sec-search"><h2 class="sec-h">Search the rulebooks</h2>
      <p class="sec-intro">Searches every page of the Rules Reference v1.8 and the Learn to Play, plus the rules pages of the Civil War and Synthezoid Smackdown rulebooks (leaders and competitive mode). Type keywords or ask a plain question (“can allies defend for another player?”). Expand a result for the full page.</p>
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
    vs: ['competitive', 'versus'], versus: ['competitive'], pvp: ['competitive', 'standard'], competitive: ['team', 'enemy', 'leader'],
    leader: ['villain', 'enemy', 'competitive'], registration: ['resistance', 'side'], resistance: ['registration', 'side'],
  };
  const stem = w => { if (w.length <= 3) return w; w = w.replace(/('s|s')$/, ''); if (/ies$/.test(w) && w.length > 4) return w.slice(0, -3) + 'y'; if (/(ches|shes|sses|xes|zes)$/.test(w)) return w.slice(0, -2); if (/s$/.test(w) && !/(ss|us|is|as|os)$/.test(w)) return w.slice(0, -1); return w; };
  const tok = t => (t.toLowerCase().match(/[a-z0-9]+/g) || []).filter(w => !STOP.has(w) && w.length >= 2).map(stem).filter(s => s.length >= 2);
  const BOOKS = { rr: ['Rules Reference', 'a-aggression'], ltp: ['Learn to Play', 'a-leadership'], cw: ['Civil War rulebook', 'a-justice'], ss: ['Synthezoid Smackdown', 'a-protection'] };
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
      const [label, pill] = BOOKS[e.x] || [e.b, 'a-basic'];
      return `<details class="rs-item"><summary class="rs-sum"><div class="rs-meta"><span class="pill ${pill}">${esc(label)}</span><span>${esc(e.b)} · p.${e.p}</span><span class="rs-toggle">Full page</span></div><div class="rs-snip">${snip(e.t.replace(/\n/g, ' '), qt, phrase)}</div></summary><div class="rs-full">${e.t.split('\n').map(p => `<p>${hl(p, qt)}</p>`).join('')}</div></details>`;
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
