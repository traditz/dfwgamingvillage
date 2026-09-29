/* =============================================================================
   Marvel Champions — Hero Decks & Villain Builder (DFW Gaming Village)
   Vanilla JS, no build step. Data: window.MCC (cards), window.MCH (heroes,
   community weights, collection plan), window.MCE (scenarios & encounter sets).
   Deck edits are kept in this browser (localStorage) and can be exported.
   ============================================================================= */
(function () {
  'use strict';

  // ------------------------------------------------------------------ data
  const C = window.MCC.cards;
  const PACKS = window.MCC.packs;
  const PACK = Object.fromEntries(PACKS.map(p => [p.code, p]));
  const HD = window.MCH;
  const HEROES = HD.heroes;
  const HERO = Object.fromEntries(HEROES.map(h => [h.id, h]));
  const ENC = window.MCE || null;
  const ASPECTS = ['aggression', 'justice', 'leadership', 'protection'];
  const ANAME = { aggression: 'Aggression', justice: 'Justice', leadership: 'Leadership', protection: 'Protection', pool: "'Pool", basic: 'Basic', hero: 'Hero', encounter: 'Encounter', campaign: 'Campaign' };
  const TYPE_ORDER = ['ally', 'event', 'upgrade', 'support', 'resource', 'player_side_scheme'];
  const TYPE_NAME = { ally: 'Allies', event: 'Events', upgrade: 'Upgrades', support: 'Supports', resource: 'Resources', player_side_scheme: 'Player Side Schemes' };
  const TYPE_ONE = { ally: 'Ally', event: 'Event', upgrade: 'Upgrade', support: 'Support', resource: 'Resource', player_side_scheme: 'Player Side Scheme', hero: 'Hero', alter_ego: 'Alter-Ego', obligation: 'Obligation' };
  const STORE_KEY = 'dfwgv-mc-builder-v1';
  const IMG_BASE = 'https://marvelcdb.com/bundles/cards/';

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));
  const app = $('#app');

  // -------------------------------------------------------------- storage
  function loadStore() {
    try { return JSON.parse(localStorage.getItem(STORE_KEY) || '{}') || {}; } catch (e) { return {}; }
  }
  function saveStore() {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(store)); } catch (e) { /* private mode: edits last for this visit only */ }
  }
  const store = loadStore();
  store.edits = store.edits || {};
  store.night = store.night || { seats: [], scn: null };
  store.enc = store.enc || {};

  // ------------------------------------------------------------ weights
  const weightCache = {};
  function weights(heroId, opt) {
    const key = heroId + '|' + opt;
    if (weightCache[key]) return weightCache[key];
    const W = (HD.weights[heroId] || {})[opt];
    const rows = [];
    if (W && W.top) {
      for (const part of W.top.split('|')) {
        const f = part.split(':');
        rows.push({ code: f[0], p: [+f[1] / 100, +f[2] / 100, +f[3] / 100], raw: +f[4] / 100, off: f[5] === 'o' });
      }
    }
    weightCache[key] = rows;
    return rows;
  }
  function optionList(heroId) {
    const W = HD.weights[heroId] || {};
    return Object.keys(W).map(k => ({ key: k, share: W[k].share, decks: W[k].decks, eligible: W[k].eligible }))
      .sort((a, b) => b.share - a.share);
  }
  function pctOf(heroId, opt, code) {
    const r = weights(heroId, opt).find(x => x.code === code);
    return r ? r.raw : null;
  }

  // ---------------------------------------------------------------- decks
  function planDeck(id) {
    const p = HD.plan[id];
    return { opt: p.opt, cards: Object.assign({}, p.cards) };
  }
  function deckOf(id) {
    const e = store.edits[id];
    return e ? { opt: e.opt, cards: Object.assign({}, e.cards), custom: true } : Object.assign(planDeck(id), { custom: false });
  }
  function setDeck(id, deck) {
    const p = HD.plan[id];
    const same = deck.opt === p.opt && sameCards(deck.cards, p.cards);
    if (same) delete store.edits[id]; else store.edits[id] = { opt: deck.opt, cards: deck.cards };
    saveStore();
    usageDirty = true;
  }
  function sameCards(a, b) {
    const ka = Object.keys(a).filter(k => a[k] > 0), kb = Object.keys(b).filter(k => b[k] > 0);
    if (ka.length !== kb.length) return false;
    return ka.every(k => a[k] === b[k]);
  }
  const sigCount = h => h.sig.reduce((s, x) => s + x[1], 0);
  const deckSize = (h, d) => sigCount(h) + Object.values(d.cards).reduce((s, q) => s + q, 0);

  let usageDirty = true, usageMemo = null;
  function usage() {
    if (!usageDirty && usageMemo) return usageMemo;
    const total = {}, by = {};
    for (const h of HEROES) {
      const d = deckOf(h.id);
      for (const [code, q] of Object.entries(d.cards)) {
        if (!q) continue;
        total[code] = (total[code] || 0) + q;
        (by[code] = by[code] || {})[h.id] = q;
      }
    }
    usageMemo = { total, by };
    usageDirty = false;
    return usageMemo;
  }
  function freeFor(code, heroId) {
    const u = usage();
    const mine = ((u.by[code] || {})[heroId]) || 0;
    return (C[code].q || 0) - ((u.total[code] || 0) - mine);
  }

  // ------------------------------------------------------------- legality
  function matchesUnique(a, b) {  // RR p.45
    const ta = a.n, tb = b.n, sa = a.s || '', sb = b.s || '', ea = a.ae || '', eb = b.ae || '';
    if (ta === tb && !sa && !ea && !sb && !eb) return true;
    const L = [sa, ea].filter(Boolean), R = [sb, eb].filter(Boolean);
    const setB = [tb, sb, eb].filter(Boolean), setA = [ta, sa, ea].filter(Boolean);
    return L.some(x => setB.includes(x)) || R.some(x => setA.includes(x));
  }
  function legal(code, h, opt) {
    const c = C[code];
    if (!c || c.h || c.q == null) return { ok: false, why: 'Not a deck card' };
    const aspects = opt.split('+');
    if (c.tu && !(c.tu.includes(h.name) || c.tu.includes(h.ae))) return { ok: false, why: 'Team-Up for ' + c.tu.join(' & ') };
    if (c.u && matchesUnique(c, { n: h.name, ae: h.ae })) return { ok: false, why: 'Matches your identity (unique)' };
    if (c.rq && !c.rq.some(t => h.traits.includes(t))) return { ok: false, why: 'Needs the ' + c.rq.map(t => t.toUpperCase()).join(' or ') + ' trait' };
    if (c.hp && h.hp < c.hp) return { ok: false, why: 'Needs ' + c.hp + '+ printed hit points' };
    if (c.pn && !(c.pn.includes(h.name) || c.pn.includes(h.ae))) return { ok: false, why: 'Only for ' + c.pn.join(' / ') };
    if (c.f === 'basic' || aspects.includes(c.f)) return { ok: true, off: false };
    const r = h.rules.offaspect;
    if (r && (ASPECTS.includes(c.f) || c.f === 'pool')) {
      if (!r.types.includes(c.t)) return { ok: false, why: 'Off-aspect' };
      const tr = (c.tr || '').toLowerCase().split('.').map(s => s.trim());
      if (r.traits && !r.traits.some(t => tr.includes(t))) return { ok: false, why: 'Off-aspect' };
      if (r.resource === 'energy' && !(c.r || '').includes('E')) return { ok: false, why: 'Off-aspect' };
      return { ok: true, off: true };
    }
    return { ok: false, why: ANAME[c.f] + ' card — not in this aspect' };
  }
  function maxCopies(code, h) {
    const lim = C[code].l || 3;
    return h.rules.max_copies ? Math.min(lim, h.rules.max_copies) : lim;
  }
  function validate(h, d) {
    const issues = [];
    const size = deckSize(h, d);
    if (size < 40) issues.push({ lvl: 'bad', t: `Only ${size} cards — decks need at least 40 (RR p.50).` });
    if (size > 50) issues.push({ lvl: 'bad', t: `${size} cards — decks may have at most 50 (RR p.50).` });
    const per = { aggression: 0, justice: 0, leadership: 0, protection: 0 };
    let off = 0, offTitles = 0;
    const uniques = [];
    for (const [code, q] of Object.entries(d.cards)) {
      if (!q) continue;
      const c = C[code];
      const L = legal(code, h, d.opt);
      if (!L.ok) issues.push({ lvl: 'bad', code, t: `${c.n}: ${L.why}.` });
      if (q > maxCopies(code, h)) issues.push({ lvl: 'bad', code, t: `${c.n}: at most ${maxCopies(code, h)} cop${maxCopies(code, h) === 1 ? 'y' : 'ies'} per deck.` });
      if (ASPECTS.includes(c.f)) per[c.f] += q;
      if (L.off) { off += q; offTitles++; }
      if (c.u) uniques.push(code);
      const free = freeFor(code, h.id);
      if (q > free) {
        const others = Object.entries(usage().by[code] || {}).filter(([id]) => id !== h.id).map(([id, n]) => `${HERO[id].name} ×${n}`);
        issues.push({ lvl: 'warn', code, t: `${c.n}: the collection has ${c.q}, ${others.length ? 'also in ' + others.join(', ') : ''}.` });
      }
    }
    for (let i = 0; i < uniques.length; i++) for (let j = i + 1; j < uniques.length; j++) {
      if (matchesUnique(C[uniques[i]], C[uniques[j]])) issues.push({ lvl: 'bad', t: `${C[uniques[i]].n} and ${C[uniques[j]].n} match (unique) — only one may be in a deck.` });
    }
    const k = h.rules.kind;
    if (k === 'pair_equal') {
      const [a1, a2] = d.opt.split('+');
      if (per[a1] !== per[a2]) issues.push({ lvl: 'bad', t: `Spider-Woman needs equal ${ANAME[a1]} and ${ANAME[a2]} cards (now ${per[a1]} / ${per[a2]}).` });
    }
    if (k === 'all_equal') {
      const v = ASPECTS.map(a => per[a]);
      if (new Set(v).size !== 1) issues.push({ lvl: 'bad', t: `Adam Warlock needs an equal number of cards from all four aspects (now ${v.join(' / ')}).` });
    }
    const r = h.rules.offaspect;
    if (r && r.limit && off > r.limit) issues.push({ lvl: 'bad', t: `At most ${r.limit} off-aspect cards (now ${off}).` });
    if (r && r.titles && offTitles > r.titles) issues.push({ lvl: 'bad', t: `At most ${r.titles} off-aspect titles (now ${offTitles}).` });
    return issues;
  }

  // -------------------------------------------------------------- rebuild
  // Greedy rebuild with the copies that are still free after every other deck.
  // Community picks come first (by share of decks running 1/2/3 copies); any other
  // legal card with a free copy is kept as low-priority filler so a deck can always be finished.
  function rebuild(h, opt) {
    const rows = weights(h.id, opt);
    const need = h.nonSig;
    const free = code => freeFor(code, h.id);
    const listed = new Set(rows.map(r => r.code));
    const slots = [];
    for (const r of rows) {
      const lim = Math.min(maxCopies(r.code, h), Math.max(0, free(r.code)));
      for (let k = 0; k < lim; k++) slots.push({ code: r.code, k, v: r.p[k] || 0.001 * (3 - k), off: r.off, f: C[r.code].f });
    }
    for (const code of Object.keys(C)) {        // filler: legal, owned, not in the community list
      const c = C[code];
      if (listed.has(code) || c.h || !c.q) continue;
      const L = legal(code, h, opt);
      if (!L.ok) continue;
      const lim = Math.min(maxCopies(code, h), Math.max(0, free(code)));
      const base = (c.t === 'resource' ? 0.0009 : 0.0005) - (c.c || 0) * 0.00001;
      for (let k = 0; k < lim; k++) slots.push({ code, k, v: base - k * 0.0001, off: L.off, f: c.f });
    }
    slots.sort((a, b) => b.v - a.v);
    const offRule = h.rules.offaspect || {};
    const valueOf = trial => Object.entries(trial).reduce((s, [c, q]) => s + ((rows.find(r => r.code === c) || { p: [0.0005, 0, 0] }).p.slice(0, q).reduce((a, b) => a + b, 0)), 0);
    function pick(filter, count, into) {
      let n = 0;
      const offT = new Set(Object.keys(into).filter(c => legal(c, h, opt).off));
      let offN = Object.entries(into).filter(([c]) => legal(c, h, opt).off).reduce((s, [, q]) => s + q, 0);
      for (const s of slots) {
        if (n >= count) break;
        if (!filter(s)) continue;
        const have = into[s.code] || 0;
        if (have !== s.k) continue;
        if (s.off) {
          if (offRule.limit && offN >= offRule.limit) continue;
          if (offRule.titles && !offT.has(s.code) && offT.size >= offRule.titles) continue;
        }
        if (C[s.code].u && Object.keys(into).some(c => c !== s.code && C[c].u && matchesUnique(C[c], C[s.code]))) continue;
        into[s.code] = have + 1; n++;
        if (s.off) { offN++; offT.add(s.code); }
      }
      return n;
    }
    let cards = {};
    if (h.rules.kind === 'all_equal') {           // Adam Warlock: equal cards from all four aspects
      let best = null;
      for (const per of [6, 5, 4, 3, 2, 1]) {
        const trial = {};
        let ok = true;
        for (const a of ASPECTS) if (pick(s => s.f === a, per, trial) < per) ok = false;
        if (!ok) continue;
        if (pick(s => s.f === 'basic', need - 4 * per, trial) < need - 4 * per) continue;
        const val = valueOf(trial);
        if (!best || val > best.val) best = { val, trial };
      }
      cards = best ? best.trial : {};
    } else if (h.rules.kind === 'pair_equal') {   // Spider-Woman: equal cards from her two aspects
      const [a1, a2] = opt.split('+');
      let best = null;
      for (let each = 1; each <= Math.floor(need / 2); each++) {
        const trial = {};
        if (pick(s => s.f === a1, each, trial) < each || pick(s => s.f === a2, each, trial) < each) continue;
        if (pick(s => s.f === 'basic', need - 2 * each, trial) < need - 2 * each) continue;
        const val = valueOf(trial);
        if (!best || val > best.val) best = { val, trial };
      }
      cards = best ? best.trial : {};
    } else {
      pick(() => true, need, cards);
    }
    return { opt, cards };
  }

  // --------------------------------------------------------------- helpers
  const RES_SVG = {
    E: '<svg viewBox="0 0 24 24"><path d="M13 2L4 14h6l-1 8 9-12h-6z"/></svg>',
    M: '<svg viewBox="0 0 24 24"><path d="M9 3a4 4 0 00-4 4 3.5 3.5 0 00-2 6 3.5 3.5 0 003 5 3 3 0 005 2V4a3 3 0 00-2-1zm6 0a3 3 0 00-2 1v16a3 3 0 005-2 3.5 3.5 0 003-5 3.5 3.5 0 00-2-6 4 4 0 00-4-4z"/></svg>',
    P: '<svg viewBox="0 0 24 24"><path d="M7 5a2 2 0 014 0v1a2 2 0 014 0 2 2 0 014 1v6a8 8 0 01-8 8 7 7 0 01-7-7V9a2 2 0 013-1.7V5z"/></svg>',
    W: '<svg viewBox="0 0 24 24"><path d="M12 2l3 7h7l-5.5 4.5L18.5 21 12 16.5 5.5 21l2-7.5L2 9h7z"/></svg>',
  };
  const resIcons = r => r ? `<span class="res" title="${esc(resTitle(r))}">${r.split('').map(x => `<i class="ri ${x}">${RES_SVG[x]}</i>`).join('')}</span>` : '';
  function resTitle(r) {
    const n = { E: 'Energy', M: 'Mental', P: 'Physical', W: 'Wild' };
    return r.split('').map(x => n[x]).join(' + ') + ' resource';
  }
  const aspectPill = f => `<span class="pill a-${f}">${esc(ANAME[f] || f)}</span>`;
  function optLabel(opt) { return opt.split('+').map(a => ANAME[a]).join(' + '); }
  function optClass(opt) { const a = opt.split('+'); return a.length === 1 ? 'a-' + a[0] : (a.length === 4 ? 'multi' : 'pair'); }
  function optPills(opt) {
    const a = opt.split('+');
    if (a.length === 4) return '<span class="pill" style="background:linear-gradient(90deg,var(--agg),var(--jus),var(--lea),var(--pro));color:#111">All four aspects</span>';
    return a.map(aspectPill).join(' ');
  }
  function imgUrl(code) { const c = C[code]; return c && c.i ? IMG_BASE + c.i : null; }
  function cardLabel(code) { const c = C[code]; return c.n + (c.s ? ` (${c.s})` : ''); }
  const aeOf = h => (h.ae && h.ae !== h.name ? h.ae : '');
  const heroSub = h => [aeOf(h), h.packName].filter(Boolean).join(' · ');
  function toast(msg) {
    const t = $('#toast'); t.textContent = msg; t.hidden = false;
    clearTimeout(toast._t); toast._t = setTimeout(() => { t.hidden = true; }, 2600);
  }
  function download(name, text, type = 'text/plain') {
    const blob = new Blob([text], { type: type + ';charset=utf-8' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob); a.download = name; document.body.appendChild(a); a.click();
    setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 500);
  }
  async function copyText(text, msg) {
    try { await navigator.clipboard.writeText(text); toast(msg || 'Copied!'); }
    catch (e) { download('marvel-champions.txt', text); toast('Clipboard blocked — downloaded instead'); }
  }
  const slug = s => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  function packName(code) { return (PACK[code] || { name: code }).name; }
  function releaseKey(h) { return (PACK[h.pack] ? PACK[h.pack].pos : 999) * 1000 + parseInt(h.code, 10); }

  // ---------------------------------------------------------- physical pulls
  // Which box each physical copy comes from: a hero's own pack first, then oldest boxes.
  function pullPlan() {
    const u = usage();
    const perHero = {}, perPack = {};
    for (const [code, byHero] of Object.entries(u.by)) {
      const c = C[code];
      const left = {};
      for (const [p, q] of (c.pr || [])) if (PACK[p] && PACK[p].owned) left[p] = (left[p] || 0) + q;
      const needs = Object.entries(byHero).map(([id, q]) => ({ id, q }));
      const give = (id, p, q) => {
        (perHero[id] = perHero[id] || []).push({ code, pack: p, q });
        ((perPack[p] = perPack[p] || {})[id] = perPack[p][id] || []).push({ code, q });
      };
      for (const n of needs) {  // own box first
        const own = HERO[n.id].pack;
        if (left[own]) { const q = Math.min(left[own], n.q); if (q) { give(n.id, own, q); left[own] -= q; n.q -= q; } }
      }
      const order = Object.keys(left).sort((a, b) => PACK[a].pos - PACK[b].pos);
      for (const n of needs) {
        for (const p of order) {
          if (!n.q) break;
          const q = Math.min(left[p], n.q);
          if (q > 0) { give(n.id, p, q); left[p] -= q; n.q -= q; }
        }
        if (n.q > 0) give(n.id, '__short', n.q);
      }
    }
    return { perHero, perPack };
  }

  // ------------------------------------------------------------------ export
  function deckText(h, d, withPacks) {
    const lines = [];
    const size = deckSize(h, d);
    lines.push(`${h.name}${h.ae && h.ae !== h.name ? ' (' + h.ae + ')' : ''} — ${optLabel(d.opt)} — ${size} cards`);
    lines.push(`Built with the DFW Gaming Village Marvel Champions builder${d.custom ? ' (edited)' : ''} · ${location.origin}${location.pathname}#hero/${h.id}`);
    lines.push('');
    lines.push(`Hero cards (${sigCount(h)})`);
    for (const [code, q] of h.sig) lines.push(`${q}x ${cardLabel(code)}`);
    const pulls = withPacks ? (pullPlan().perHero[h.id] || []) : [];
    for (const t of TYPE_ORDER) {
      const rows = Object.entries(d.cards).filter(([code, q]) => q && C[code].t === t)
        .sort((a, b) => cardLabel(a[0]).localeCompare(cardLabel(b[0])));
      if (!rows.length) continue;
      lines.push('');
      lines.push(`${TYPE_NAME[t]} (${rows.reduce((s, r) => s + r[1], 0)})`);
      for (const [code, q] of rows) {
        let src = '';
        if (withPacks) {
          const ps = pulls.filter(p => p.code === code).map(p => p.pack === '__short' ? `MISSING ×${p.q}` : `${packName(p.pack)}${p.q > 1 ? ' ×' + p.q : ''}`);
          src = ps.length ? '  [' + ps.join(', ') + ']' : '';
        }
        lines.push(`${q}x ${cardLabel(code)} (${ANAME[C[code].f]})${src}`);
      }
    }
    if (h.ob) { lines.push(''); lines.push(`Obligation: ${C[h.ob] ? C[h.ob].n : h.ob} · Nemesis: ${(h.nemesis.minions || []).join(', ')}`); }
    return lines.join('\n');
  }
  function deckJson(h, d) {
    const slots = {};
    for (const [code, q] of h.sig) slots[code] = q;
    for (const [code, q] of Object.entries(d.cards)) if (q) slots[code] = (slots[code] || 0) + q;
    const meta = d.opt.includes('+') && d.opt.split('+').length === 2 ? { aspect: d.opt.split('+')[0], aspect2: d.opt.split('+')[1] } : { aspect: d.opt.split('+')[0] };
    return { name: `${h.name} — ${optLabel(d.opt)} (DFWGV)`, hero_code: h.code, hero_name: h.name, meta: JSON.stringify(meta), slots };
  }

  // ================================================================ routing
  const state = {
    view: 'heroes', id: null,
    heroQ: '', heroAspect: 'all', heroSort: 'release',
    vilQ: '', vilProd: 'all', vilFormat: 'all',
    editing: false, flipped: false, addQ: '', addType: 'all',
  };
  function parseHash() {
    const h = decodeURIComponent(location.hash.replace(/^#/, ''));
    const [path, qs] = h.split('?');
    const parts = (path || 'heroes').split('/');
    const params = new URLSearchParams(qs || '');
    return { view: parts[0] || 'heroes', id: parts[1] || null, params };
  }
  function go(hash) { if (location.hash !== '#' + hash) location.hash = hash; else render(); }
  window.addEventListener('hashchange', () => { state.editing = false; state.flipped = false; render(true); });

  function setTabs(view) {
    const map = { hero: 'heroes', villain: 'villains' };
    const t = map[view] || view;
    $$('.tabs a[data-tab]').forEach(a => {
      const on = a.dataset.tab === t;
      a.classList.toggle('active', on);
      a.setAttribute('aria-selected', on ? 'true' : 'false');
    });
  }
  function render(scrollTop) {
    const r = parseHash();
    state.view = r.view; state.id = r.id; state.params = r.params;
    setTabs(r.view);
    hidePop();
    if (r.view === 'hero' && HERO[r.id]) renderHero(HERO[r.id]);
    else if (r.view === 'villains') renderVillains();
    else if (r.view === 'villain') renderVillain(r.id, r.params);
    else if (r.view === 'night') renderNight();
    else if (r.view === 'collection') renderCollection();
    else renderHeroes();
    if (scrollTop) window.scrollTo({ top: Math.max(0, $('#app').offsetTop - 12), behavior: 'auto' });
  }

  // ============================================================ HEROES TAB
  function heroMatches(h) {
    const d = deckOf(h.id);
    if (state.heroAspect !== 'all') {
      const a = d.opt.split('+');
      if (state.heroAspect === 'multi' ? a.length < 2 : !a.includes(state.heroAspect)) return false;
    }
    if (state.heroQ) {
      const q = state.heroQ.toLowerCase();
      const hay = [h.name, h.ae, h.packName, h.traits.join(' '), optLabel(d.opt)].join(' ').toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  }
  function heroTile(h) {
    const d = deckOf(h.id);
    const issues = validate(h, d).filter(x => x.lvl === 'bad').length;
    const conflicts = validate(h, d).filter(x => x.lvl === 'warn').length;
    const a = d.opt.split('+');
    const bar = a.length === 4 ? '<span class="t-bar multi"></span>'
      : a.length === 2 ? `<span class="t-bar" style="background:linear-gradient(90deg,var(--${abbr(a[0])}) 0 50%,var(--${abbr(a[1])}) 50%)"></span>`
      : `<span class="t-bar a-${a[0]}"></span>`;
    const flag = issues ? '<span class="t-flag warn">Check deck</span>' : conflicts ? '<span class="t-flag warn">Over collection</span>' : d.custom ? '<span class="t-flag">Edited</span>' : '';
    return `<a class="tile" href="#hero/${h.id}" aria-label="${esc(h.name)} — ${esc(optLabel(d.opt))}">
      <img src="images/heroes/${h.id}.webp" alt="" loading="lazy" width="420" height="327">
      <span class="shade"></span>
      <span class="t-tag">${a.length === 4 ? '<span class="pill" style="background:#fff">All aspects</span>' : a.map(aspectPill).join(' ')}</span>
      ${flag}
      <span class="t-name">${esc(h.name)}</span>
      <span class="t-sub">${esc(heroSub(h))}</span>
      ${bar}
    </a>`;
  }
  function abbr(a) { return { aggression: 'agg', justice: 'jus', leadership: 'lea', protection: 'pro', pool: 'pool' }[a] || 'bas'; }

  function renderHeroes() {
    const list = HEROES.slice();
    if (state.heroSort === 'name') list.sort((a, b) => a.name.localeCompare(b.name) || a.ae.localeCompare(b.ae));
    else list.sort((a, b) => releaseKey(a) - releaseKey(b));
    const shown = list.filter(heroMatches);
    const counts = { all: HEROES.length, multi: 0 };
    for (const h of HEROES) { const a = deckOf(h.id).opt.split('+'); if (a.length > 1) counts.multi++; else counts[a[0]] = (counts[a[0]] || 0) + 1; }
    const chip = (k, label) => `<button class="chip ${state.heroAspect === k ? 'on' : ''}" data-aspect="${k}">${label}<span class="n">${counts[k] || 0}</span></button>`;
    let body = '';
    if (state.heroSort === 'release' && !state.heroQ && state.heroAspect === 'all') {
      let lastYear = null;
      for (const h of shown) {
        const y = String((PACK[h.pack] || {}).date || '').slice(0, 4);
        if (y !== lastYear) {
          const n = shown.filter(x => String((PACK[x.pack] || {}).date || '').slice(0, 4) === y).length;
          body += `<div class="group-h">${esc(y)} releases · ${n} hero${n > 1 ? 'es' : ''}</div>`;
          lastYear = y;
        }
        body += heroTile(h);
      }
    } else body = shown.map(heroTile).join('');
    const edited = Object.keys(store.edits).length;
    app.innerHTML = `
      <section class="panel" style="margin-bottom:18px">
        <h2 class="h-sec">Choose your hero <small>${HD.meta.decksAnalyzed.toLocaleString()} published decks analysed</small></h2>
        <p class="explain">Each hero comes with a pre-built 40-card deck in the aspect the community plays most (subject to the collection). All ${HEROES.length} decks can be sleeved at the same time without running out of any card. Open a hero to see why each card made the cut, switch aspects, tweak the list or export it.${edited ? ` <b>You have edited ${edited} deck${edited > 1 ? 's' : ''} in this browser.</b>` : ''}</p>
        <div class="toolbar">
          <input class="input search" id="heroQ" type="search" placeholder="Search heroes, alter-egos, traits…" value="${esc(state.heroQ)}" aria-label="Search heroes">
          <div class="seg" role="group" aria-label="Sort">
            <button data-sort="release" class="${state.heroSort === 'release' ? 'on' : ''}">Release order</button>
            <button data-sort="name" class="${state.heroSort === 'name' ? 'on' : ''}">A–Z</button>
          </div>
          <button class="btn small ghost" id="randHero">🎲 Random hero</button>
        </div>
        <div class="chips" role="group" aria-label="Filter by aspect">
          ${chip('all', 'All')}${chip('aggression', 'Aggression')}${chip('justice', 'Justice')}${chip('leadership', 'Leadership')}${chip('protection', 'Protection')}${chip('pool', "'Pool")}${chip('multi', 'Multi-aspect')}
          <span class="count" style="margin-left:auto">${shown.length} shown</span>
        </div>
      </section>
      <div class="hero-grid">${body || '<p class="muted">No heroes match.</p>'}</div>`;
    const q = $('#heroQ');
    q.addEventListener('input', () => { state.heroQ = q.value; const pos = q.selectionStart; renderHeroes(); const n = $('#heroQ'); n.focus(); n.setSelectionRange(pos, pos); });
    $$('[data-aspect]').forEach(b => b.addEventListener('click', () => { state.heroAspect = b.dataset.aspect; renderHeroes(); }));
    $$('[data-sort]').forEach(b => b.addEventListener('click', () => { state.heroSort = b.dataset.sort; renderHeroes(); }));
    $('#randHero').addEventListener('click', () => { const pool = shown.length ? shown : HEROES; go('hero/' + pool[Math.floor(Math.random() * pool.length)].id); });
  }

  // ---------------------------------------------------------- hero dossier
  function renderHero(h) {
    const d = deckOf(h.id);
    const issues = validate(h, d);
    const bad = issues.filter(x => x.lvl === 'bad'), warn = issues.filter(x => x.lvl === 'warn');
    const size = deckSize(h, d);
    const idx = HEROES.slice().sort((a, b) => releaseKey(a) - releaseKey(b));
    const i = idx.findIndex(x => x.id === h.id);
    const prev = idx[(i - 1 + idx.length) % idx.length], next = idx[(i + 1) % idx.length];
    const opts = optionList(h.id);
    const W = HD.weights[h.id][d.opt] || { share: 0, decks: 0 };
    const planOpt = HD.plan[h.id].opt;
    const optHtml = opts.map(o => {
      const a = o.key.split('+');
      const style = a.length === 2 ? `style="--a:var(--${abbr(a[0])});--b:var(--${abbr(a[1])})"` : '';
      return `<button class="opt ${optClass(o.key)} ${o.key === d.opt ? 'on' : ''}" data-opt="${o.key}" ${style}>
        <b>${esc(optLabel(o.key))}</b><span>${o.decks.toLocaleString()} deck${o.decks === 1 ? '' : 's'} · ${Math.round(o.share * 100)}%${o.key === planOpt ? ' · plan' : ''}</span>
        <span class="bar"><i style="width:${Math.max(3, Math.round(o.share * 100))}%"></i></span></button>`;
    }).join('');
    // deck sections
    const sig = h.sig.map(([code, q]) => row(code, q, { sig: true })).join('');
    let sections = `<div class="dsec sig"><h4>${esc(h.name)} cards <small>${sigCount(h)} · required</small></h4>${sig}</div>`;
    for (const t of TYPE_ORDER) {
      const rows = Object.entries(d.cards).filter(([code, q]) => q && C[code].t === t)
        .sort((a, b) => (C[a[0]].c ?? 99) - (C[b[0]].c ?? 99) || cardLabel(a[0]).localeCompare(cardLabel(b[0])));
      if (!rows.length) continue;
      sections += `<div class="dsec"><h4>${TYPE_NAME[t]} <small>${rows.reduce((s, r) => s + r[1], 0)}</small></h4>${rows.map(([code, q]) => row(code, q, {})).join('')}</div>`;
    }
    function row(code, q, o) {
      const c = C[code];
      const f = o.sig ? 'hero' : c.f;
      const pct = o.sig ? '' : pctOf(h.id, d.opt, code);
      const warnCls = issues.some(x => x.code === code) ? 'warn' : '';
      const edit = o.sig ? '' : `<span class="edit"><button class="iconbtn" data-minus="${code}" aria-label="Remove one ${esc(c.n)}">−</button><button class="iconbtn" data-plus="${code}" aria-label="Add one ${esc(c.n)}">+</button></span>`;
      return `<div class="drow ${warnCls}" data-card="${code}">
        <span class="q">${q}</span><span class="pip a-${f}"></span>
        <span class="nm">${esc(c.n)}${c.s ? `<small>${esc(c.s)}</small>` : ''}</span>
        <span class="meta">${c.c != null ? `<span class="cost" title="Cost">${c.c}</span>` : ''}${resIcons(c.r)}${pct != null && pct !== '' ? `<span class="pct" title="Share of published ${esc(h.name)} ${esc(optLabel(d.opt))} decks that run this card">${Math.round(pct * 100)}%</span>` : ''}${edit}</span>
      </div>`;
    }
    // stats: curve & mix & resources
    const all = Object.entries(d.cards).concat(h.sig.map(([c, q]) => [c, q]));
    const curve = [0, 0, 0, 0, 0, 0];
    const res = { E: 0, M: 0, P: 0, W: 0 };
    const mix = {};
    for (const [code, q] of all) {
      const c = C[code];
      if (c.c != null && c.t !== 'resource') curve[Math.min(5, c.c)] += q;
      for (const ch of (c.r || '')) res[ch] += q;
      mix[c.t] = (mix[c.t] || 0) + q;
    }
    const cmax = Math.max(1, ...curve);
    const curveHtml = curve.map((n, k) => `<div class="cc"><em>${n}</em><i style="height:${Math.round(n / cmax * 52) + 2}px"></i><span>${k === 5 ? '5+' : k}</span></div>`).join('');
    const mixHtml = TYPE_ORDER.filter(t => mix[t]).map(t => `<div><span class="lbl">${TYPE_NAME[t]}</span><b>${mix[t]}</b></div>`).join('');
    const resHtml = ['E', 'M', 'P', 'W'].map(k => `<div><span class="lbl">${resTitle(k).replace(' resource', '')}</span>${resIcons(k)} <b>${res[k]}</b></div>`).join('');
    const bursts = bad.length ? `<div class="burst bad"><div><b>${size}</b><span>fix deck</span></div></div>` : `<div class="burst"><div><b>${size}</b><span>cards</span></div></div>`;
    const heroCard = `images/cards/${h.code}.webp`, aeCard = `images/cards/${h.back}.webp`;
    const ob = h.ob && C[h.ob] ? C[h.ob].n : '—';
    const plan = HD.plan[h.id];
    app.innerHTML = `
      <div class="back-row">
        <a class="btn small ghost" href="#heroes">← All heroes</a>
        <span class="spacer"></span>
        <a class="btn small ghost" href="#hero/${prev.id}">‹ ${esc(prev.name)}</a>
        <a class="btn small ghost" href="#hero/${next.id}">${esc(next.name)} ›</a>
      </div>
      <section class="banner">
        <div class="b-art"><img src="images/heroes/${h.id}.webp" alt=""></div><span class="b-slash" aria-hidden="true"></span>
        <div class="b-in">
          <h2>${esc(h.name)}</h2>
          <p class="b-sub">${esc(heroSub(h))}</p>
          <div class="row">${optPills(d.opt)} ${d.custom ? '<span class="pill" style="background:#fff">Edited in this browser</span>' : '<span class="pill" style="background:var(--gold)">Collection plan</span>'}</div>
        </div>
      </section>
      <div class="dossier">
        <aside class="side">
          <button class="cardflip ${state.flipped ? 'flipped' : ''}" id="flip" aria-label="Flip identity card">
            <div class="cf-in"><img src="${heroCard}" alt="${esc(h.name)} hero card"><img class="back" src="${aeCard}" alt="${esc(h.ae)} alter-ego card" onerror="this.style.display='none'"></div>
            <span class="cf-hint">Tap to flip: hero ⇄ alter-ego</span>
          </button>
          <div class="panel">
            <div class="stats3">
              <div class="stat"><b>${h.hp}</b><span>Hit points</span></div>
              <div class="stat"><b>${h.hand[0] ?? '–'}</b><span>Hero hand</span></div>
              <div class="stat"><b>${h.hand[1] ?? '–'}</b><span>Alter-ego hand</span></div>
            </div>
            <dl class="kv" style="margin-top:12px">
              <dt>Traits</dt><dd>${esc(h.traits.map(t => t.replace(/\b\w/g, m => m.toUpperCase())).join(', ') || '—')}</dd>
              <dt>Obligation</dt><dd>${esc(ob)}</dd>
              <dt>Nemesis</dt><dd>${esc((h.nemesis.minions || []).join(', ') || '—')}${h.nemesis.scheme && h.nemesis.scheme.length ? ` <span class="dim">(${esc(h.nemesis.scheme.join(', '))})</span>` : ''}</dd>
              <dt>Box</dt><dd>${esc(h.packName)} <span class="dim">(${esc((PACK[h.pack] || {}).date || '')})</span></dd>
              ${h.perm.length ? `<dt>Permanent</dt><dd>${esc(h.perm.map(([c]) => C[c] ? C[c].n : c).join(', '))}</dd>` : ''}
            </dl>
            ${ruleNote(h)}
          </div>
        </aside>
        <div>
          <section class="panel no-print">
            <h3 class="h-sec">Aspect <small>${(h.decks || 0).toLocaleString()} published ${esc(h.name)} decks</small></h3>
            <div class="opt-grid">${optHtml}</div>
            <p class="explain" style="margin:10px 0 0">Bars show how often the community builds ${esc(h.name)} in each aspect. Switching rebuilds the list from cards that are still free in the collection.</p>
          </section>
          <section class="panel">
            <div class="summary">
              ${bursts}
              <div><div class="curve" aria-label="Cost curve">${curveHtml}</div><p class="explain" style="margin:6px 0 0">Cost curve (resource cards excluded)</p></div>
              <div class="mix">${mixHtml}${resHtml}</div>
            </div>
            ${bad.length ? `<div class="note red" style="margin-top:12px"><b>Deck problems</b><ul class="ul">${bad.map(x => `<li>${esc(x.t)}</li>`).join('')}</ul></div>` : ''}
            ${warn.length ? `<div class="note red" style="margin-top:12px"><b>Over the collection</b> — these copies are already in other decks:<ul class="ul">${warn.map(x => `<li>${esc(x.t)}</li>`).join('')}</ul></div>` : ''}
            ${!bad.length && !warn.length ? `<div class="note green" style="margin-top:12px">Legal ${size}-card deck. Every copy is free in the collection alongside the other ${HEROES.length - 1} decks.</div>` : ''}
          </section>
          <section class="panel ${state.editing ? 'editing' : ''}" id="deckpanel">
            <h3 class="h-sec">Deck list <small>% = share of ${esc(optLabel(d.opt))} decks running it</small></h3>
            <div class="actions no-print" style="margin-bottom:12px">
              <button class="btn small ${state.editing ? 'red' : ''}" id="editBtn">${state.editing ? '✓ Done editing' : '✎ Edit deck'}</button>
              <button class="btn small ghost" id="rebuildBtn" title="Rebuild from the community weights using free copies">↻ Rebuild</button>
              ${d.custom ? '<button class="btn small ghost" id="resetBtn">⟲ Reset to plan</button>' : ''}
              <span class="grow"></span>
              <button class="btn small blue" id="copyBtn">⧉ Copy list</button>
              <button class="btn small ghost" id="txtBtn">⬇ .txt</button>
              <button class="btn small ghost" id="jsonBtn" title="Deck file with MarvelCDB card codes (hero_code, aspect, slots)">⬇ Deck .json</button>
              <button class="btn small ghost" id="printBtn">🖨 Print</button>
            </div>
            <div class="deck">${sections}</div>
            ${state.editing ? addBox(h, d) : ''}
          </section>
          <section class="panel">
            <h3 class="h-sec">Pull list <small>which box each copy comes from</small></h3>
            ${pullHtml(h)}
          </section>
          <section class="panel no-print">
            <h3 class="h-sec">How this deck was chosen</h3>
            <p class="explain">Cards are ranked by how often published MarvelCDB ${esc(h.name)} decks in this aspect run 1, 2 or 3 copies (newer decks count more; heroes with few decks lean on the aspect-wide numbers). One optimisation then gave every hero a deck at once so that no card is used more times than the collection owns. The plan chose <b>${esc(optLabel(plan.opt))}</b>${plan.opt !== opts[0]?.key && opts[0] ? `; ${esc(optLabel(opts[0].key))} is played more often, but the collection-wide solve scored ${esc(optLabel(plan.opt))} higher once every other hero's needs for the same cards were counted` : ''}.</p>
            <p class="explain no-print">Want other takes? <a href="https://marvelcdb.com/decklists/find?hero=${encodeURIComponent(h.code)}" target="_blank" rel="noopener">Browse published ${esc(h.name)} decks on MarvelCDB ↗</a></p>
          </section>
        </div>
      </div>`;
    // events
    $('#flip').addEventListener('click', () => { state.flipped = !state.flipped; $('#flip').classList.toggle('flipped', state.flipped); });
    $$('[data-opt]').forEach(b => b.addEventListener('click', () => {
      const opt = b.dataset.opt;
      if (opt === d.opt) return;
      const nd = opt === HD.plan[h.id].opt ? planDeck(h.id) : rebuild(h, opt);
      setDeck(h.id, nd);
      renderHero(h);
      toast(`Rebuilt as ${optLabel(opt)} from free copies`);
    }));
    $('#editBtn').addEventListener('click', () => { state.editing = !state.editing; renderHero(h); });
    $('#rebuildBtn').addEventListener('click', () => { setDeck(h.id, rebuild(h, d.opt)); renderHero(h); toast('Rebuilt from free copies'); });
    const rb = $('#resetBtn'); if (rb) rb.addEventListener('click', () => { delete store.edits[h.id]; saveStore(); usageDirty = true; renderHero(h); toast('Back to the collection plan'); });
    $('#copyBtn').addEventListener('click', () => copyText(deckText(h, d, true), 'Deck list copied'));
    $('#txtBtn').addEventListener('click', () => download(`${slug(h.name + ' ' + h.ae)}-${slug(optLabel(d.opt))}.txt`, deckText(h, d, true)));
    $('#jsonBtn').addEventListener('click', () => download(`${slug(h.name + ' ' + h.ae)}-${slug(optLabel(d.opt))}.json`, JSON.stringify(deckJson(h, d), null, 2), 'application/json'));
    $('#printBtn').addEventListener('click', () => window.print());
    $$('[data-minus]').forEach(b => b.addEventListener('click', e => { e.stopPropagation(); edit(h, b.dataset.minus, -1); }));
    $$('[data-plus]').forEach(b => b.addEventListener('click', e => { e.stopPropagation(); edit(h, b.dataset.plus, +1); }));
    bindAdd(h);
    bindCardRows(app);
  }
  function ruleNote(h) {
    const r = h.rules;
    const t = [];
    if (r.kind === 'pair_equal') t.push('Chooses <b>two aspects</b> and must include an equal number of cards from each.');
    if (r.kind === 'all_equal') t.push('Uses <b>all four aspects</b> in equal numbers, and only one copy of any non-Adam Warlock card.');
    if (r.offaspect) {
      const o = r.offaspect;
      if (o.limit) t.push(`May include up to ${o.limit} ATTACK/THWART events from other aspects.`);
      else if (o.titles) t.push('May include the maximum copies of 3 S.H.I.E.L.D. supports from other aspects.');
      else if (o.resource) t.push('May include events with a printed energy resource from any aspect.');
      else if (o.types && o.types.includes('player_side_scheme')) t.push('May include player side schemes from any aspect.');
    }
    return t.length ? `<div class="note" style="margin-top:12px"><b>Deck-building rule:</b> ${t.join(' ')}</div>` : '';
  }
  function edit(h, code, delta) {
    const d = deckOf(h.id);
    const q = (d.cards[code] || 0) + delta;
    if (q <= 0) delete d.cards[code]; else d.cards[code] = q;
    setDeck(h.id, { opt: d.opt, cards: d.cards });
    renderHero(h);
  }
  function addBox(h, d) {
    return `<div class="addbox no-print">
      <h4 class="h-sec" style="font-size:17px">Add cards</h4>
      <div class="row"><input class="input search" id="addQ" type="search" placeholder="Search legal cards by name, trait or text…" value="${esc(state.addQ)}">
      <select class="select" id="addType"><option value="all">All types</option>${TYPE_ORDER.map(t => `<option value="${t}" ${state.addType === t ? 'selected' : ''}>${TYPE_NAME[t]}</option>`).join('')}</select></div>
      <div class="addlist" id="addList">${addList(h, d)}</div>
      <p class="explain">Green = copies still free in the collection. Community picks for this aspect are listed first.</p>
    </div>`;
  }
  function addList(h, d) {
    const q = state.addQ.trim().toLowerCase();
    const W = weights(h.id, d.opt);
    const rank = Object.fromEntries(W.map((r, i) => [r.code, i]));
    const codes = Object.keys(C).filter(code => {
      const c = C[code];
      if (c.h || c.q == null || !c.q) return false;
      if (state.addType !== 'all' && c.t !== state.addType) return false;
      if (q && !(c.n + ' ' + (c.s || '') + ' ' + (c.tr || '') + ' ' + (c.x || '')).toLowerCase().includes(q)) return false;
      return legal(code, h, d.opt).ok;
    }).sort((a, b) => (rank[a] ?? 999) - (rank[b] ?? 999) || C[a].n.localeCompare(C[b].n)).slice(0, 120);
    if (!codes.length) return '<p class="muted" style="padding:10px">No legal cards match.</p>';
    return codes.map(code => {
      const c = C[code];
      const free = freeFor(code, h.id) - (d.cards[code] || 0);
      const inDeck = d.cards[code] || 0;
      const canAdd = inDeck < maxCopies(code, h);
      const pct = pctOf(h.id, d.opt, code);
      return `<div class="drow" data-card="${code}"><span class="pip a-${c.f}"></span>
        <span class="nm">${esc(c.n)}${c.s ? `<small>${esc(c.s)}</small>` : ''} <small>${TYPE_ONE[c.t] || c.t}${pct != null ? ' · ' + Math.round(pct * 100) + '%' : ''}${inDeck ? ' · in deck ×' + inDeck : ''}</small></span>
        <span class="meta">${c.c != null ? `<span class="cost">${c.c}</span>` : ''}${resIcons(c.r)}</span>
        <span class="meta"><span class="free ${free > 0 ? '' : 'none'}">${free > 0 ? free + ' free' : 'in use'}</span><button class="iconbtn" data-add="${code}" ${canAdd ? '' : 'disabled'} aria-label="Add ${esc(c.n)}">+</button></span></div>`;
    }).join('');
  }
  function bindAdd(h) {
    const q = $('#addQ'); if (!q) return;
    const refresh = () => { $('#addList').innerHTML = addList(h, deckOf(h.id)); bindAddButtons(h); bindCardRows($('#addList')); };
    q.addEventListener('input', () => { state.addQ = q.value; refresh(); });
    $('#addType').addEventListener('change', e => { state.addType = e.target.value; refresh(); });
    bindAddButtons(h);
  }
  function bindAddButtons(h) {
    $$('[data-add]').forEach(b => b.addEventListener('click', e => {
      e.stopPropagation();
      const y = window.scrollY;
      edit(h, b.dataset.add, +1);
      window.scrollTo(0, y);
      const q = $('#addQ'); if (q) { q.focus(); }
    }));
  }
  function pullHtml(h) {
    const pulls = (pullPlan().perHero[h.id] || []);
    const byPack = {};
    for (const p of pulls) (byPack[p.pack] = byPack[p.pack] || []).push(p);
    const packs = Object.keys(byPack).sort((a, b) => (a === h.pack ? -1 : b === h.pack ? 1 : (PACK[a] ? PACK[a].pos : 999) - (PACK[b] ? PACK[b].pos : 999)));
    const rows = packs.map(p => {
      const items = byPack[p].sort((a, b) => cardLabel(a.code).localeCompare(cardLabel(b.code)));
      const n = items.reduce((s, x) => s + x.q, 0);
      return `<tr><td><b>${p === '__short' ? '<span style="color:var(--red)">Not enough copies</span>' : esc(packName(p))}</b>${p === h.pack ? ' <span class="tag opt">own box</span>' : ''}<br><span class="dim">${n} card${n > 1 ? 's' : ''}</span></td>
        <td>${items.map(x => `${x.q}× ${esc(cardLabel(x.code))}`).join(' · ')}</td></tr>`;
    }).join('');
    return `<p class="explain">Signature cards come from the ${esc(h.packName)} box. For the rest, copies from the hero's own box are used first, then the oldest boxes. The Collection tab has the same list for every box.</p>
      <div class="tblwrap"><table class="tbl"><thead><tr><th>Box</th><th>Cards</th></tr></thead><tbody>${rows || '<tr><td colspan="2" class="muted">No extra cards.</td></tr>'}</tbody></table></div>`;
  }

  // ------------------------------------------------------------ card popup
  const pop = $('#cardpop');
  function cardPopHtml(code) {
    const c = C[code];
    const url = imgUrl(code);
    const text = `<div class="ctext"><b>${esc(c.n)}</b><span class="dim">${esc(TYPE_ONE[c.t] || c.t)} · ${esc(ANAME[c.f] || c.f)}${c.c != null ? ' · cost ' + c.c : ''}</span><p style="margin:6px 0 0">${esc(c.x || '')}</p></div>`;
    return url ? `<img src="${url}" alt="${esc(c.n)}" onerror="this.outerHTML=this.nextElementSibling.outerHTML">${text.replace('class="ctext"', 'class="ctext" style="display:none"')}` : text;
  }
  function showPop(code, ev) {
    pop.innerHTML = cardPopHtml(code);
    const fb = pop.querySelector('.ctext[style]');
    if (fb) pop.querySelector('img').addEventListener('error', () => { fb.style.display = ''; });
    pop.hidden = false;
    movePop(ev);
  }
  function movePop(ev) {
    const w = 250, hgt = 360;
    let x = ev.clientX + 18, y = ev.clientY - hgt / 2;
    if (x + w > window.innerWidth - 8) x = ev.clientX - w - 18;
    y = Math.max(8, Math.min(y, window.innerHeight - hgt - 8));
    pop.style.left = x + 'px'; pop.style.top = y + 'px';
  }
  function hidePop() { pop.hidden = true; }
  function openSheet(code) {
    const c = C[code];
    const sheet = $('#sheet');
    const scrim = document.createElement('div'); scrim.className = 'scrim';
    const url = imgUrl(code);
    const inDecks = Object.entries(usage().by[code] || {}).map(([id, q]) => `${HERO[id].name}${HERO[id].ae !== HERO[id].name ? ' (' + HERO[id].ae + ')' : ''} ×${q}`);
    sheet.innerHTML = `<button class="iconbtn close" aria-label="Close">✕</button><div class="sh-in">
      ${url ? `<img src="${url}" alt="${esc(c.n)}" onerror="this.remove()">` : ''}
      <div class="ctext-card"><div class="ct-h">${esc(c.n)}${c.s ? ' — ' + esc(c.s) : ''}</div>
      <div class="dim" style="color:#555">${esc(TYPE_ONE[c.t] || c.t)} · ${esc(ANAME[c.f] || c.f)}${c.c != null ? ' · cost ' + c.c : ''}${c.tr ? ' · ' + esc(c.tr) : ''}</div>
      <p>${esc(c.x || '')}</p>${c.q != null ? `<p style="margin:0"><b>Owned:</b> ${c.q} · <b>In decks:</b> ${inDecks.length ? esc(inDecks.join(', ')) : 'none'}</p>` : ''}</div></div>`;
    sheet.hidden = false; document.body.appendChild(scrim);
    const close = () => { sheet.hidden = true; scrim.remove(); };
    scrim.addEventListener('click', close); sheet.querySelector('.close').addEventListener('click', close);
  }
  const canHover = window.matchMedia('(hover: hover)').matches;
  function bindCardRows(root) {
    $$('[data-card]', root).forEach(r => {
      const code = r.dataset.card;
      if (canHover) {
        r.addEventListener('mouseenter', e => showPop(code, e));
        r.addEventListener('mousemove', movePop);
        r.addEventListener('mouseleave', hidePop);
      }
      r.addEventListener('click', e => { if (e.target.closest('button')) return; hidePop(); openSheet(code); });
    });
  }

  // ========================================================== VILLAINS TAB
  function scnById(id) { return ENC ? ENC.scenarios.find(s => s.id === id) : null; }
  function msById(id) { return ENC ? (ENC.interchangeableMainSchemes || []).find(m => m.id === id) : null; }
  function setInfo(id) { return (ENC && ENC.sets[id]) || { name: id, cards: 0, enc: 0, comp: {} }; }
  function setImg(id) { const s = setInfo(id); return s.img ? s.img : null; }
  const NOT_ENC = ['villain', 'main_scheme', 'leader', 'event', 'upgrade', 'resource', 'support', 'ally', 'player_side_scheme'];
  function yearOf(product) { return String((PACK[product] || {}).date || '').slice(0, 4); }
  function villainTile(s) {
    const stg = (s.stats && s.stats.stages) || [];
    const first = stg[0];
    const hpTxt = first && first.hp != null ? `${first.stage ? 'Stage ' + first.stage + ': ' : ''}${first.hp}${first.perPlayer ? '×P' : ''} HP` : '';
    return `<a class="tile" href="#villain/${s.id}" aria-label="${esc(s.name)}">
        ${s.img ? `<img src="${s.img}" alt="" loading="lazy">` : ''}
        <span class="shade"></span>
        ${s.format !== 'standard' ? `<span class="t-flag">${esc(formatName(s.format))}</span>` : ''}
        ${hpTxt ? `<span class="t-hp" title="First villain stage hit points (×P = per player)">${esc(hpTxt)}</span>` : ''}
        <span class="t-name">${esc(s.name)}</span>
        <span class="t-sub">${esc(s.productName)}${s.campaignOrder ? ' · #' + s.campaignOrder : ''}</span>
      </a>`;
  }
  function renderVillains() {
    if (!ENC) { app.innerHTML = '<section class="panel"><h2 class="h-sec">Villains</h2><p class="muted">Scenario data is loading or missing.</p></section>'; return; }
    const prods = [];
    for (const s of ENC.scenarios) if (!prods.includes(s.product)) prods.push(s.product);
    const q = state.vilQ.toLowerCase();
    const shown = ENC.scenarios.filter(s => (state.vilProd === 'all' || s.product === state.vilProd) &&
      (state.vilFormat === 'all' || s.format === state.vilFormat) &&
      (!q || [s.name, s.villain, s.productName, s.campaign || ''].join(' ').toLowerCase().includes(q)));
    let body = '', last = null;
    const grouped = state.vilProd === 'all' && !q;
    for (const s of shown) {
      const y = yearOf(s.product);
      if (grouped && y !== last) {
        const n = shown.filter(x => yearOf(x.product) === y).length;
        body += `<div class="group-h">${esc(y)} releases · ${n} scenario${n > 1 ? 's' : ''}</div>`;
        last = y;
      }
      body += villainTile(s);
    }
    const modTiles = ENC.modularOrder.map(id => modTile(id, false, false)).join('');
    app.innerHTML = `
      <section class="panel" style="margin-bottom:18px">
        <h2 class="h-sec">Choose your villain <small>${ENC.scenarios.length} scenarios · ${ENC.modularOrder.length} modular sets</small></h2>
        <p class="explain">Pick a scenario to see its villain deck, main schemes and recommended modular sets from the official insert, then tune the encounter deck: expert, standard/expert set variants, heroic level, and extra or random modulars. Tiles show the first villain stage's hit points (×P = per player). Can't decide? Roll the dice.</p>
        <div class="toolbar">
          <input class="input search" id="vilQ" type="search" placeholder="Search villains, boxes, campaigns…" value="${esc(state.vilQ)}" aria-label="Search villains">
          <select class="select" id="vilProd" aria-label="Box"><option value="all">All boxes</option>${prods.map(p => `<option value="${p}" ${state.vilProd === p ? 'selected' : ''}>${esc(packName(p))}</option>`).join('')}</select>
          <select class="select" id="vilFormat" aria-label="Format"><option value="all">All formats</option>${['standard', 'multi-villain', 'leader', 'special'].map(f => `<option value="${f}" ${state.vilFormat === f ? 'selected' : ''}>${formatName(f)}</option>`).join('')}</select>
          <button class="btn small ghost" id="randVil">🎲 Random villain</button>
          <span class="count">${shown.length} shown</span>
        </div>
      </section>
      <div class="hero-grid v-grid">${body || '<p class="muted">No scenarios match.</p>'}</div>
      <section class="panel" style="margin-top:22px">
        <h2 class="h-sec">Modular encounter sets <small>tap one for its cards · swap any of these into a scenario</small></h2>
        <div class="m-grid">${modTiles}</div>
      </section>`;
    const qi = $('#vilQ');
    qi.addEventListener('input', () => { state.vilQ = qi.value; const pos = qi.selectionStart; renderVillains(); const n = $('#vilQ'); n.focus(); n.setSelectionRange(pos, pos); });
    $('#vilProd').addEventListener('change', e => { state.vilProd = e.target.value; renderVillains(); });
    $('#vilFormat').addEventListener('change', e => { state.vilFormat = e.target.value; renderVillains(); });
    $('#randVil').addEventListener('click', () => { const pool = shown.length ? shown : ENC.scenarios; go('villain/' + pool[Math.floor(Math.random() * pool.length)].id); });
    $$('[data-mod]').forEach(b => b.addEventListener('click', () => openSetSheet(b.dataset.mod)));
  }
  function formatName(f) { return { standard: 'Standard', 'multi-villain': 'Multi-villain', leader: 'Hero leaders', special: 'Special' }[f] || f; }
  function modTile(id, on, rec) {
    const s = setInfo(id);
    const n = s.enc || s.cards;
    return `<button class="mtile ${on ? 'on' : ''} ${rec ? 'rec' : ''}" data-mod="${id}" aria-pressed="${on}">
      ${s.img ? `<img src="${s.img}" alt="" loading="lazy">` : ''}<span class="shade"></span>
      ${rec ? '<span class="mt-rec">Recommended</span>' : ''}${s.difficulty ? `<span class="mt-diff" title="Official difficulty (Learn to Play p.23 / scenario insert)">Diff ${s.difficulty}</span>` : ''}
      <span class="mt-n">${esc(s.name)}</span><span class="mt-s">${n ? (s.approx ? '≈' : '') + n + ' card' + (n === 1 ? '' : 's') + ' · ' : ''}${esc(packName(s.product))}</span></button>`;
  }
  function compText(comp, encOnly) {
    const names = { minion: ['minion', 'minions'], treachery: ['treachery', 'treacheries'], attachment: ['attachment', 'attachments'], side_scheme: ['side scheme', 'side schemes'], environment: ['environment', 'environments'], obligation: ['obligation', 'obligations'], ally: ['ally', 'allies'], villain: ['villain', 'villains'], main_scheme: ['main scheme', 'main schemes'], upgrade: ['upgrade', 'upgrades'], event: ['event', 'events'], support: ['support', 'supports'], resource: ['resource', 'resources'], leader: ['leader', 'leaders'], player_side_scheme: ['player side scheme', 'player side schemes'] };
    return Object.entries(comp || {}).filter(([t]) => !encOnly || !NOT_ENC.includes(t))
      .map(([t, n]) => `${n} ${(names[t] || [t, t])[n === 1 ? 0 : 1]}`).join(' · ');
  }
  function openSetSheet(id) {
    const s = setInfo(id);
    const sheet = $('#sheet');
    const scrim = document.createElement('div'); scrim.className = 'scrim';
    const all = ENC.scenarios.concat(ENC.interchangeableMainSchemes || []);
    const recs = all.filter(x => (x.recommendedModulars || []).includes(id)).map(x => x.name);
    const reqs = all.filter(x => (x.requiredModulars || []).includes(id) || ((x.encounterSets || []).includes(id) && !(x.recommendedModulars || []).includes(id))).map(x => x.name);
    const n = s.enc || s.cards;
    sheet.innerHTML = `<button class="iconbtn close" aria-label="Close">✕</button><div class="sh-in">
      ${s.img ? `<img src="${s.img}" alt="">` : ''}
      <div class="ctext-card"><div class="ct-h">${esc(s.name)}</div>
      <div style="color:#555">${esc(packName(s.product))} · ${s.approx ? '≈' : ''}${n || '?'} encounter card${n === 1 ? '' : 's'}${s.difficulty ? ' · official difficulty ' + s.difficulty + '/5' : ''}</div>
      ${compText(s.comp, false) ? `<p>${esc(compText(s.comp, false))}</p>` : ''}
      ${recs.length ? `<p><b>Recommended for:</b> ${esc(recs.join(', '))}</p>` : ''}
      ${reqs.length ? `<p><b>Always part of:</b> ${esc(reqs.join(', '))}</p>` : ''}
      ${s.restrictions ? `<p><b>Note:</b> ${esc(s.restrictions)}</p>` : ''}
      ${(s.cardList || []).length ? `<p style="font-size:13px"><b>Cards:</b> ${esc(s.cardList.join(', '))}</p>` : ''}
      ${s.approx ? '<p style="font-size:13px">Fear No Evil card counts come from the Hall of Heroes card gallery (MarvelCDB has no encounter data for it yet).</p>' : ''}</div></div>`;
    sheet.hidden = false; document.body.appendChild(scrim);
    const close = () => { sheet.hidden = true; scrim.remove(); };
    scrim.addEventListener('click', close); sheet.querySelector('.close').addEventListener('click', close);
  }

  // ---------------------------------------------------- encounter builder
  function schemeOf(s, e) { return (s.mainSchemeOptions || []).length ? msById(e.ms || s.mainSchemeOptions[0]) : null; }
  function encDefaults(s) {
    const ms = (s.mainSchemeOptions || []).length ? msById(s.mainSchemeOptions[0]) : null;
    const mods = (s.recommendedModulars || []).concat(ms ? (ms.recommendedModulars || []) : []);
    return { mode: 'standard', std: s.standardSet || null, exp: s.expertSet || null,
      heroic: 0, skirmish: false, players: 2, mods: Array.from(new Set(mods)), ms: ms ? ms.id : null };
  }
  function encState(s, params) {
    const base = Object.assign(encDefaults(s), store.enc[s.id] || {});
    if (params && params.has('m')) base.mode = params.get('m') === 'expert' ? 'expert' : 'standard';
    if (params && params.has('p')) base.players = Math.max(1, Math.min(4, +params.get('p') || 2));
    if (params && params.has('h')) base.heroic = Math.max(0, Math.min(5, +params.get('h') || 0));
    if (params && params.has('mods')) base.mods = params.get('mods').split(',').filter(x => ENC.sets[x]);
    if (params && params.has('ms') && msById(params.get('ms'))) base.ms = params.get('ms');
    return base;
  }
  function saveEnc(s, e) { store.enc[s.id] = e; saveStore(); }
  function encounterDeck(s, e) {
    const rows = [], seen = new Set();
    let approx = false;
    const add = (id, tag) => {
      if (seen.has(id)) return; seen.add(id);
      const inf = setInfo(id);
      if (inf.approx) approx = true;
      rows.push({ id, name: inf.name, n: inf.enc != null ? inf.enc : (inf.cards || 0), approx: !!inf.approx, tag, comp: inf.comp });
    };
    const ms = schemeOf(s, e);
    const fixed = (s.encounterSets || []).concat(ms ? (ms.encounterSets || []) : []);
    const req = (s.requiredModulars || []).concat(ms ? (ms.requiredModulars || []) : []);
    const rec = (s.recommendedModulars || []).concat(ms ? (ms.recommendedModulars || []) : []);
    for (const id of fixed) if (!req.includes(id)) add(id, 'Scenario');
    for (const id of req) add(id, 'Required');
    for (const id of e.mods) add(id, rec.includes(id) ? 'Recommended' : 'Modular');
    if (e.std) add(e.std, 'Standard');
    if (e.mode === 'expert' && e.exp) add(e.exp, 'Expert');
    const obl = s.noObligations ? 0 : e.players;
    const total = rows.reduce((t, r) => t + (r.n || 0), 0) + obl;
    return { rows: rows.filter(r => r.n > 0 || r.tag !== 'Scenario'), total, approx, obl };
  }
  function stageToken(name) { const m = String(name).match(/\(([^)]+)\)\s*$/); return m ? m[1] : null; }
  function leaderBuildHtml(s) {
    const L = ENC && ENC.leaderCustomization;
    if (!L) return '';
    let side = null, pool = null;
    for (const [name, sd] of Object.entries(L.sides || {})) {
      if ((sd.leaders || []).includes(s.id)) { side = name; pool = sd; }
      else if (sd.synthezoidSmackdown && sd.synthezoidSmackdown.leader === s.id) { side = name; pool = sd.synthezoidSmackdown; }
    }
    const list = ids => (ids || []).map(id => esc(setInfo(id).name || id)).join(', ');
    return `<h4 class="h-sec" style="font-size:16px;margin-top:14px">Custom leader build</h4>
      <ol class="ul">${(L.steps || []).map(x => `<li>${esc(x)}</li>`).join('')}</ol>
      ${pool ? `<dl class="kv" style="margin-top:8px"><dt>Side</dt><dd>${esc(side.replace(/^./, c => c.toUpperCase()))}</dd>
        ${pool.modulars ? `<dt>Side modulars</dt><dd>${list(pool.modulars)}</dd>` : ''}
        ${pool.stage1 ? `<dt>Stage 1 schemes</dt><dd>${esc(pool.stage1.join(', '))}</dd>` : ''}
        ${pool.stage2 ? `<dt>Stage 2 schemes</dt><dd>${esc(pool.stage2.join(', '))}</dd>` : ''}</dl>
        ${pool.note ? `<p class="explain">${esc(pool.note)}</p>` : ''}` : ''}`;
  }
  function renderVillain(id, params) {
    const s = scnById(id);
    if (!s) { renderVillains(); return; }
    const e = encState(s, params);
    const ms = schemeOf(s, e);
    const deck = encounterDeck(s, e);
    const stages = (s.villainDeck || {})[e.mode] || [];
    const expStages = (s.villainDeck || {}).expert || [];
    const used = new Set(stages.map(stageToken).filter(Boolean));
    const idx = ENC.scenarios.findIndex(x => x.id === s.id);
    const prev = ENC.scenarios[(idx - 1 + ENC.scenarios.length) % ENC.scenarios.length], next = ENC.scenarios[(idx + 1) % ENC.scenarios.length];
    const hp = (s.stats && s.stats.stages) || [];
    const stageHtml = hp.length ? `<div class="stagebox">${hp.map(st => {
      const on = !used.size || used.has(st.stage);
      return `<div class="st ${on ? 'on' : 'off'}"><b>${esc(st.name)}</b><span>${st.hp != null ? (st.perPlayer ? `${st.hp} per player → <b>${st.hp * e.players}</b> HP` : `${st.hp} HP`) : ''}${st.sch != null ? ` · SCH ${st.sch}` : ''}${st.atk != null ? ` · ATK ${st.atk}` : ''}</span></div>`;
    }).join('')}</div><p class="explain" style="margin:6px 0 0">Stages used in ${e.mode} mode are highlighted; hit points shown for ${e.players} player${e.players > 1 ? 's' : ''}.</p>` : '';
    const rec = (s.recommendedModulars || []).concat(ms ? (ms.recommendedModulars || []) : []);
    const top = Array.from(new Set(e.mods.concat(rec)));
    const topGrid = top.map(mid => modTile(mid, e.mods.includes(mid), rec.includes(mid))).join('');
    const mf = (state.modFilter || '').toLowerCase();
    const allGrid = ENC.modularOrder.filter(mid => !top.includes(mid) && (!mf || (setInfo(mid).name + ' ' + packName(setInfo(mid).product)).toLowerCase().includes(mf)))
      .map(mid => modTile(mid, false, false)).join('');
    const setupNotes = (s.setupNotes || []).concat(ms ? (ms.setupNotes || []) : []);
    const special = (s.specialRules || []).concat(ms ? (ms.specialRules || []) : []);
    const mainSchemes = (s.mainSchemeDeck || []).length ? s.mainSchemeDeck : (ms ? ms.mainSchemeDeck || [] : []);
    const rulesHref = `../marvel-champions-setup/#scn=${encodeURIComponent(s.id)}&m=${e.mode}&p=${e.players}&h=${e.heroic}${e.skirmish ? '&sk=1' : ''}&mods=${e.mods.join(',')}&std=${e.std || ''}&exp=${e.exp || ''}`;
    app.innerHTML = `
      <div class="back-row">
        <a class="btn small ghost" href="#villains">← All villains</a><span class="spacer"></span>
        <a class="btn small ghost" href="#villain/${prev.id}">‹ ${esc(prev.name)}</a>
        <a class="btn small ghost" href="#villain/${next.id}">${esc(next.name)} ›</a>
      </div>
      <section class="banner">
        ${s.img ? `<div class="b-art"><img src="${s.img}" alt=""></div><span class="b-slash" aria-hidden="true"></span>` : ''}
        <div class="b-in">
          <h2>${esc(s.name)}</h2>
          <p class="b-sub">${esc(s.productName)}${s.campaign ? ' · ' + esc(s.campaign) + (s.campaignOrder ? ' campaign #' + s.campaignOrder : ' campaign') : ''}</p>
          <div class="row">${s.format !== 'standard' ? `<span class="pill a-encounter">${esc(formatName(s.format))}</span>` : ''}<span class="pill" style="background:var(--gold)">${deck.approx ? '≈' : ''}${deck.total} encounter cards</span></div>
        </div>
      </section>
      <div class="enc-grid">
        <div>
          <section class="panel">
            <h3 class="h-sec">Villain &amp; schemes</h3>
            ${(s.mainSchemeOptions || []).length ? `<div class="row" style="margin-bottom:10px"><label class="muted" for="msSel">Main scheme scenario</label><select class="select" id="msSel">${s.mainSchemeOptions.map(mid => { const m = msById(mid); return m ? `<option value="${mid}" ${ms && ms.id === mid ? 'selected' : ''}>${esc(m.name)}</option>` : ''; }).join('')}</select><span class="dim">Fear No Evil pairs each underling with one of five interchangeable scenarios.</span></div>` : ''}
            <dl class="kv"><dt>Villain deck</dt><dd>${esc(stages.join(' → ') || '—')}${e.skirmish ? ' <span class="dim">(skirmish: keep just one version)</span>' : ''}</dd>
            <dt>Main schemes</dt><dd>${esc(mainSchemes.join(' → ') || '—')}</dd>
            ${e.heroic ? `<dt>Heroic ${e.heroic}</dt><dd>Deal ${e.heroic} extra encounter card${e.heroic > 1 ? 's' : ''} to each player every villain phase (RR p.29).</dd>` : ''}</dl>
            ${stageHtml ? `<div style="margin-top:10px">${stageHtml}</div>` : ''}
            ${setupNotes.length ? `<h4 class="h-sec" style="font-size:16px;margin-top:14px">Setup</h4><ul class="ul">${setupNotes.map(x => `<li>${esc(x)}</li>`).join('')}</ul>` : ''}
            ${special.length ? `<h4 class="h-sec" style="font-size:16px;margin-top:14px">Special rules</h4><ul class="ul">${special.map(x => `<li>${esc(x)}</li>`).join('')}</ul>` : ''}
            ${[].concat(s.notes || []).length ? `<h4 class="h-sec" style="font-size:16px;margin-top:14px">Notes</h4><ul class="ul">${[].concat(s.notes).map(x => `<li>${esc(x)}</li>`).join('')}</ul>` : ''}
            ${s.format === 'leader' ? leaderBuildHtml(s) : ''}
            <p class="explain" style="margin-top:10px">Source: ${esc([s.src, ms && ms.src].filter(Boolean).join(' · '))}</p>
          </section>
          <section class="panel">
            <h3 class="h-sec">Tune the encounter</h3>
            <div class="row" style="margin-bottom:10px">
              <div class="seg" role="group" aria-label="Mode"><button data-mode="standard" class="${e.mode === 'standard' ? 'on' : ''}">Standard</button><button data-mode="expert" class="${e.mode === 'expert' ? 'on' : ''}">Expert</button></div>
              <div class="seg" role="group" aria-label="Players">${[1, 2, 3, 4].map(n => `<button data-players="${n}" class="${e.players === n ? 'on' : ''}">${n}P</button>`).join('')}</div>
            </div>
            <div class="row" style="margin-bottom:10px">
              <label class="muted" for="stdSel">Standard set</label>
              <select class="select" id="stdSel"><option value="">None</option>${(ENC.standardSets || []).map(x => `<option value="${x.id}" ${e.std === x.id ? 'selected' : ''}>${esc(x.name)}</option>`).join('')}</select>
              <label class="muted" for="expSel">Expert set</label>
              <select class="select" id="expSel" ${e.mode !== 'expert' ? 'disabled' : ''}><option value="">None</option>${(ENC.expertSets || []).map(x => `<option value="${x.id}" ${e.exp === x.id ? 'selected' : ''}>${esc(x.name)}</option>`).join('')}</select>
            </div>
            <div class="row" style="margin-bottom:12px">
              <label class="muted" for="heroicSel">Heroic level</label>
              <select class="select" id="heroicSel">${[0, 1, 2, 3, 4, 5].map(n => `<option value="${n}" ${e.heroic === n ? 'selected' : ''}>${n ? 'Heroic ' + n : 'Off'}</option>`).join('')}</select>
              <label class="row" style="gap:6px"><input type="checkbox" id="skirm" ${e.skirmish ? 'checked' : ''}> Skirmish (one villain version)</label>
            </div>
            <h4 class="h-sec" style="font-size:17px">Modular sets <small>${e.mods.length} chosen</small></h4>
            <div class="row" style="margin-bottom:10px">
              <button class="btn small ghost" id="recBtn">Recommended</button>
              <button class="btn small ghost" id="rand1">🎲 Random 1</button>
              <button class="btn small ghost" id="rand2">🎲 Random 2</button>
              <button class="btn small ghost" id="clrBtn">Clear</button>
            </div>
            ${s.modularChoice ? `<p class="note" style="margin:0 0 10px">This scenario picks modular sets by rule: choose ${esc(String(s.modularChoice.count || ''))} — ${esc(s.modularChoice.from || '')}.</p>` : ''}
            <div class="m-grid" id="modGrid">${topGrid || '<p class="muted">No modular sets chosen.</p>'}</div>
            <details class="pack" id="modBrowse" style="margin-top:12px" ${state.modBrowse ? 'open' : ''}><summary>Browse all modular sets<small>${ENC.modularOrder.length} sets</small></summary>
              <div class="pbody"><input class="input search" id="modQ" type="search" placeholder="Filter by name or box…" value="${esc(state.modFilter || '')}" style="width:100%;margin-bottom:10px">
              <div class="m-grid small" id="modAll">${allGrid || '<p class="muted">No sets match.</p>'}</div></div></details>
          </section>
        </div>
        <div class="enc-side">
          <section class="panel">
            <h3 class="h-sec">Encounter deck</h3>
            <div class="setlist">${deck.rows.map(r => `<div class="setrow">${setImg(r.id) ? `<img src="${setImg(r.id)}" alt="">` : '<span></span>'}<div><b>${esc(r.name)} <span class="tag ${r.tag === 'Required' || r.tag === 'Scenario' ? 'req' : r.tag === 'Recommended' ? 'rec' : 'opt'}">${esc(r.tag)}</span></b><span>${esc(compText(r.comp, true))}</span></div><span class="cnt">${r.approx ? '≈' : ''}${r.n}</span></div>`).join('')}
              <div class="setrow"><span></span><div><b>Hero obligations</b><span>${s.noObligations ? 'not used in this scenario' : '1 per player'}</span></div><span class="cnt">${deck.obl}</span></div></div>
            <div class="total-bar"><span class="muted">${/deck separately|decks separately|own encounter deck/i.test(setupNotes.join(' ')) ? 'Encounter cards (in separate villain decks)' : 'Encounter deck at setup'}</span><b>${deck.approx ? '≈' : ''}${deck.total} cards</b></div>
            <p class="explain">Villain stages and main schemes are separate decks and aren't counted; some cards are put into play during setup.${expStages.length && e.mode !== 'expert' ? ' Expert villain deck: ' + esc(expStages.join(' → ')) + '.' : ''}</p>
            <div class="actions" style="margin-top:12px">
              <a class="btn small red" href="${rulesHref}">Step-by-step setup ↗</a>
              <button class="btn small" id="toNight">★ Use for Game Night</button>
              <button class="btn small blue" id="copyEnc">⧉ Copy list</button>
              <button class="btn small ghost" id="linkEnc">🔗 Share link</button>
            </div>
          </section>
        </div>
      </div>`;
    const upd = patch => { Object.assign(e, patch); saveEnc(s, e); const y = window.scrollY; renderVillain(s.id); window.scrollTo(0, y); };
    $$('[data-mode]').forEach(b => b.addEventListener('click', () => upd({ mode: b.dataset.mode })));
    $$('[data-players]').forEach(b => b.addEventListener('click', () => upd({ players: +b.dataset.players })));
    $('#stdSel').addEventListener('change', ev => upd({ std: ev.target.value || null }));
    $('#expSel').addEventListener('change', ev => upd({ exp: ev.target.value || null }));
    $('#heroicSel').addEventListener('change', ev => upd({ heroic: +ev.target.value }));
    $('#skirm').addEventListener('change', ev => upd({ skirmish: ev.target.checked }));
    const msSel = $('#msSel');
    if (msSel) msSel.addEventListener('change', ev => {
      const old = schemeOf(s, e), nw = msById(ev.target.value);
      const oldRec = old ? (old.recommendedModulars || []) : [];
      const mods = e.mods.filter(m => !oldRec.includes(m)).concat(nw ? (nw.recommendedModulars || []) : []);
      upd({ ms: ev.target.value, mods: Array.from(new Set(mods)) });
    });
    $('#recBtn').addEventListener('click', () => upd({ mods: Array.from(new Set(rec)) }));
    $('#clrBtn').addEventListener('click', () => upd({ mods: [] }));
    const randomMods = n => {
      const req = (s.requiredModulars || []).concat(ms ? (ms.requiredModulars || []) : []);
      const pool = ENC.modularOrder.filter(x => !req.includes(x) && !setInfo(x).campaignOnly && !/only|not a modular|fixed part|scenario set/i.test(setInfo(x).restrictions || ''));
      const out = [];
      while (out.length < n && pool.length) out.push(pool.splice(Math.floor(Math.random() * pool.length), 1)[0]);
      return out;
    };
    $('#rand1').addEventListener('click', () => { upd({ mods: randomMods(1) }); toast('Random modular chosen'); });
    $('#rand2').addEventListener('click', () => { upd({ mods: randomMods(2) }); toast('Two random modulars chosen'); });
    $$('#modGrid [data-mod], #modAll [data-mod]').forEach(b => b.addEventListener('click', () => {
      const m = b.dataset.mod;
      const mods = e.mods.includes(m) ? e.mods.filter(x => x !== m) : e.mods.concat(m);
      upd({ mods });
    }));
    const mb = $('#modBrowse'); mb.addEventListener('toggle', () => { state.modBrowse = mb.open; });
    const mq = $('#modQ'); mq.addEventListener('input', () => { state.modFilter = mq.value; const pos = mq.selectionStart; const y = window.scrollY; renderVillain(s.id); window.scrollTo(0, y); const n = $('#modQ'); n.focus(); n.setSelectionRange(pos, pos); });
    $('#toNight').addEventListener('click', () => { store.night.scn = { id: s.id, enc: e }; saveStore(); go('night'); });
    $('#copyEnc').addEventListener('click', () => copyText(encText(s, e), 'Encounter list copied'));
    $('#linkEnc').addEventListener('click', () => copyText(location.origin + location.pathname + `#villain/${s.id}?m=${e.mode}&p=${e.players}&h=${e.heroic}&mods=${e.mods.join(',')}${e.ms ? '&ms=' + e.ms : ''}`, 'Link copied'));
  }
  function encText(s, e) {
    const deck = encounterDeck(s, e);
    const ms = schemeOf(s, e);
    const L = [];
    L.push(`${s.name}${ms ? ' — ' + ms.name : ''} — ${e.mode === 'expert' ? 'Expert' : 'Standard'}${e.heroic ? ' · Heroic ' + e.heroic : ''}${e.skirmish ? ' · Skirmish' : ''} · ${e.players} player${e.players > 1 ? 's' : ''}`);
    L.push(`${s.productName}${s.campaign ? ' (' + s.campaign + (s.campaignOrder ? ' #' + s.campaignOrder : '') + ')' : ''}`);
    L.push('');
    L.push(`Villain deck: ${((s.villainDeck || {})[e.mode] || []).join(', ')}`);
    L.push(`Main scheme deck: ${((s.mainSchemeDeck || []).length ? s.mainSchemeDeck : (ms ? ms.mainSchemeDeck || [] : [])).join(', ')}`);
    L.push('');
    L.push(`Encounter deck (${deck.approx ? '≈' : ''}${deck.total} cards):`);
    for (const r of deck.rows) L.push(`  • ${r.name} (${r.tag}) — ${r.approx ? '≈' : ''}${r.n} cards`);
    L.push(s.noObligations ? '  • (no hero obligations in this scenario)' : `  • Each hero's obligation — ${e.players}`);
    const setupNotes = (s.setupNotes || []).concat(ms ? (ms.setupNotes || []) : []);
    const special = (s.specialRules || []).concat(ms ? (ms.specialRules || []) : []);
    if (setupNotes.length) { L.push(''); L.push('Setup:'); setupNotes.forEach(x => L.push('  • ' + x)); }
    if (special.length) { L.push(''); L.push('Special rules:'); special.forEach(x => L.push('  • ' + x)); }
    return L.join('\n');
  }

  // ========================================================= GAME NIGHT TAB
  function renderNight() {
    const seats = store.night.seats.filter(id => HERO[id]);
    const sc = store.night.scn && scnById(store.night.scn.id);
    const e = sc ? Object.assign(encDefaults(sc), store.night.scn.enc || {}) : null;
    if (e) e.players = Math.max(1, seats.length || e.players);
    const seatHtml = [0, 1, 2, 3].map(i => {
      const id = seats[i];
      if (!id) return `<div class="seat"><span style="width:90px;height:70px;border:2px dashed var(--line-2);border-radius:8px;display:block"></span><div class="empty">Seat ${i + 1} — pick a hero below</div><span></span></div>`;
      const h = HERO[id], d = deckOf(id);
      const probs = validate(h, d).length;
      return `<div class="seat"><img src="images/heroes/${id}.webp" alt=""><div><b>${esc(h.name)}</b><div class="dim">${aeOf(h) ? esc(aeOf(h)) + ' · ' : ''}${optPills(d.opt)} ${probs ? '<span class="pill" style="background:var(--red);color:#fff">check deck</span>' : ''}</div></div>
        <span class="seat-x row"><a class="btn small ghost" href="#hero/${id}">Deck</a><button class="iconbtn" data-unseat="${id}" aria-label="Remove ${esc(h.name)}">✕</button></span></div>`;
    }).join('');
    const clash = [];
    for (let i = 0; i < seats.length; i++) for (let j = i + 1; j < seats.length; j++) {
      const a = HERO[seats[i]], b = HERO[seats[j]];
      if (matchesUnique({ n: a.name, ae: a.ae }, { n: b.name, ae: b.ae })) clash.push(`${a.name} and ${b.name} match — players can't choose matching identities (RR p.45).`);
    }
    const mini = HEROES.slice().sort((a, b) => a.name.localeCompare(b.name)).map(h => `<button class="mini ${seats.includes(h.id) ? 'on' : ''}" data-seat="${h.id}" ${!seats.includes(h.id) && seats.length >= 4 ? 'disabled' : ''} title="${esc(h.name + ' — ' + h.ae)}"><img src="images/heroes/${h.id}.webp" alt="" loading="lazy"><span>${esc(h.name)}</span></button>`).join('');
    let villainHtml = '<p class="muted">No villain yet — pick one on the Villains tab, or roll the dice.</p>';
    let setupHtml = '';
    if (sc) {
      const deck = encounterDeck(sc, e);
      villainHtml = `<div class="seat">${sc.img ? `<img src="${sc.img}" alt="">` : '<span></span>'}<div><b>${esc(sc.name)}</b><div class="dim">${esc(sc.productName)} · ${e.mode === 'expert' ? 'Expert' : 'Standard'}${e.heroic ? ' · Heroic ' + e.heroic : ''} · ${deck.approx ? '≈' : ''}${deck.total} encounter cards</div></div><a class="btn small ghost seat-x" href="#villain/${sc.id}">Tune</a></div>`;
      const steps = [];
      steps.push(`Each player takes their hero, sets hit points (${seats.map(id => `${HERO[id].name} ${HERO[id].hp}`).join(', ') || '—'}) and places the alter-ego side face up.`);
      steps.push('Choose a first player and give them the first player token.');
      steps.push(`Set aside each hero's obligation${seats.length ? ' (' + seats.map(id => C[HERO[id].ob] ? C[HERO[id].ob].n : '').filter(Boolean).join(', ') + ')' : ''} and nemesis set${seats.length ? ' (' + seats.map(id => (HERO[id].nemesis.minions || []).join('/')).join(', ') + ')' : ''}.`);
      steps.push('Shuffle each player deck; collect tokens and status cards.');
      const nms = schemeOf(sc, e);
      const nMain = (sc.mainSchemeDeck || []).length ? sc.mainSchemeDeck : (nms ? nms.mainSchemeDeck || [] : []);
      steps.push(`Villain deck: ${((sc.villainDeck || {})[e.mode] || []).join(' → ')}${e.skirmish ? ' (skirmish: keep only the chosen version)' : ''}. Main scheme deck: ${nMain.join(' → ')}${nms ? ' (' + nms.name + ')' : ''}.`);
      steps.push(`Encounter deck: ${deck.rows.map(r => r.name).join(', ')}${sc.noObligations ? ' (no obligations in this scenario)' : ` + the ${e.players} obligation${e.players > 1 ? 's' : ''}`} — ${deck.approx ? 'about ' : ''}${deck.total} cards.`);
      (sc.setupNotes || []).concat(nms ? (nms.setupNotes || []) : []).forEach(x => steps.push(x));
      steps.push('Put setup cards into play, resolve main scheme 1A setup, flip to 1B, then the villain\'s setup / when revealed.');
      steps.push(`Draw to hand size (alter-ego side: ${seats.map(id => `${HERO[id].name} ${HERO[id].hand[1] ?? HERO[id].hand[0]}`).join(', ') || '—'}), then mulligan.`);
      setupHtml = `<ol class="checklist">${steps.map(x => `<li>${esc(x)}</li>`).join('')}</ol>
        <div class="actions" style="margin-top:12px"><a class="btn small red" href="../marvel-champions-setup/#scn=${encodeURIComponent(sc.id)}&m=${e.mode}&p=${e.players}&h=${e.heroic}${e.skirmish ? '&sk=1' : ''}&mods=${e.mods.join(',')}">Full rules setup ↗</a><button class="btn small blue" id="copyNight">⧉ Copy game plan</button></div>`;
    }
    app.innerHTML = `
      <section class="panel" style="margin-bottom:18px">
        <h2 class="h-sec">Game night <small>heroes + villain = tonight's table</small></h2>
        <p class="explain">Seat up to four heroes and pick a villain. Every pre-built deck can be on the table at once — the collection plan guarantees it.</p>
        <div class="actions"><button class="btn small" id="rollHeroes">🎲 Random heroes</button><button class="btn small" id="rollVillain">🎲 Random villain</button><button class="btn small ghost" id="clearNight">Clear</button></div>
      </section>
      <div class="night-grid">
        <section class="panel"><h3 class="h-sec">Heroes <small>${seats.length}/4</small></h3>${seatHtml}
          ${clash.length ? `<div class="note red" style="margin-top:10px">${clash.map(esc).join('<br>')}</div>` : ''}
          <h4 class="h-sec" style="font-size:16px;margin-top:16px">Add a hero</h4><div class="mini-grid">${mini}</div></section>
        <section class="panel"><h3 class="h-sec">Villain</h3>${villainHtml}${setupHtml ? `<h4 class="h-sec" style="font-size:16px;margin-top:16px">Setup checklist</h4>${setupHtml}` : ''}</section>
      </div>`;
    $$('[data-seat]').forEach(b => b.addEventListener('click', () => {
      const id = b.dataset.seat;
      const s = store.night.seats.filter(x => HERO[x]);
      store.night.seats = s.includes(id) ? s.filter(x => x !== id) : s.concat(id).slice(0, 4);
      saveStore(); renderNight();
    }));
    $$('[data-unseat]').forEach(b => b.addEventListener('click', () => { store.night.seats = store.night.seats.filter(x => x !== b.dataset.unseat); saveStore(); renderNight(); }));
    $('#rollHeroes').addEventListener('click', () => {
      const n = Math.max(1, seats.length || 2);
      const pool = HEROES.slice(); const out = [];
      while (out.length < n && pool.length) {
        const h = pool.splice(Math.floor(Math.random() * pool.length), 1)[0];
        if (!out.some(id => matchesUnique({ n: HERO[id].name, ae: HERO[id].ae }, { n: h.name, ae: h.ae }))) out.push(h.id);
      }
      store.night.seats = out; saveStore(); renderNight();
    });
    $('#rollVillain').addEventListener('click', () => {
      if (!ENC) return;
      const pool = ENC.scenarios.filter(x => x.format === 'standard' || x.format === 'multi-villain');
      const pick = pool[Math.floor(Math.random() * pool.length)];
      store.night.scn = { id: pick.id, enc: encState(pick) }; saveStore(); renderNight();
    });
    $('#clearNight').addEventListener('click', () => { store.night = { seats: [], scn: null }; saveStore(); renderNight(); });
    const cn = $('#copyNight'); if (cn) cn.addEventListener('click', () => {
      const lines = ['Marvel Champions — game night', ''];
      seats.forEach((id, i) => { const h = HERO[id], d = deckOf(id); lines.push(`Player ${i + 1}: ${h.name} (${h.ae}) — ${optLabel(d.opt)}`); });
      lines.push(''); lines.push(encText(sc, e));
      copyText(lines.join('\n'), 'Game plan copied');
    });
  }

  // ======================================================== COLLECTION TAB
  function renderCollection() {
    const u = usage();
    let owned = 0, used = 0, over = 0;
    const spare = [], overList = [];
    for (const [code, c] of Object.entries(C)) {
      if (c.q == null || c.h) continue;
      owned += c.q;
      const t = u.total[code] || 0;
      used += Math.min(t, c.q);
      if (t > c.q) { over += t - c.q; overList.push(code); }
      if (c.q - t > 0) spare.push(code);
    }
    const edited = Object.keys(store.edits);
    const bad = HEROES.filter(h => validate(h, deckOf(h.id)).some(x => x.lvl === 'bad'));
    const perAsp = {};
    for (const h of HEROES) for (const a of deckOf(h.id).opt.split('+')) perAsp[a] = (perAsp[a] || 0) + 1;
    const { perPack } = pullPlan();
    const packOrder = PACKS.filter(p => perPack[p.code]).map(p => p.code);
    const packsHtml = packOrder.map(p => {
      const heroes = Object.keys(perPack[p]).sort((a, b) => HERO[a].name.localeCompare(HERO[b].name));
      const n = heroes.reduce((s, id) => s + perPack[p][id].reduce((t, x) => t + x.q, 0), 0);
      return `<details class="pack"><summary>${esc(packName(p))}<small>${n} cards → ${heroes.length} deck${heroes.length > 1 ? 's' : ''}</small></summary><div class="pbody"><div class="tblwrap"><table class="tbl"><tbody>
        ${heroes.map(id => `<tr><td style="width:180px"><a href="#hero/${id}"><b>${esc(HERO[id].name)}</b></a><br><span class="dim">${esc(aeOf(HERO[id]))}</span></td><td>${perPack[p][id].sort((a, b) => cardLabel(a.code).localeCompare(cardLabel(b.code))).map(x => `${x.q}× ${esc(cardLabel(x.code))}`).join(' · ')}</td></tr>`).join('')}
      </tbody></table></div></div></details>`;
    }).join('');
    const spareBy = {};
    for (const code of spare) (spareBy[C[code].f] = spareBy[C[code].f] || []).push(code);
    const spareHtml = ['basic', 'aggression', 'justice', 'leadership', 'protection', 'pool'].filter(f => spareBy[f]).map(f =>
      `<details class="pack"><summary><span class="pip a-${f}"></span> ${ANAME[f]}<small>${spareBy[f].reduce((s, c) => s + C[c].q - (u.total[c] || 0), 0)} spare copies</small></summary><div class="pbody">${spareBy[f].sort((a, b) => cardLabel(a).localeCompare(cardLabel(b))).map(c => `<span data-card="${c}" style="cursor:pointer">${C[c].q - (u.total[c] || 0)}× ${esc(cardLabel(c))}</span>`).join(' · ')}</div></details>`).join('');
    app.innerHTML = `
      <section class="panel">
        <h2 class="h-sec">The collection <small>one copy of every product except Cyclops &amp; Phoenix</small></h2>
        <div class="cstats">
          <div class="cstat"><b>${HEROES.length}</b><span>Hero decks</span></div>
          <div class="cstat"><b>${owned.toLocaleString()}</b><span>Player cards owned</span></div>
          <div class="cstat"><b>${used.toLocaleString()}</b><span>In hero decks</span></div>
          <div class="cstat"><b>${(owned - used).toLocaleString()}</b><span>Spare copies</span></div>
          <div class="cstat" style="${over ? 'border-color:var(--red)' : ''}"><b style="${over ? 'color:var(--red)' : ''}">${over}</b><span>Copies over the collection</span></div>
          <div class="cstat"><b>${edited.length}</b><span>Edited decks (this browser)</span></div>
        </div>
        <p class="explain" style="margin-top:12px">Aspects in use: ${Object.entries(perAsp).sort((a, b) => b[1] - a[1]).map(([a, n]) => `${aspectPill(a)} ×${n}`).join(' ')}</p>
        ${overList.length ? `<div class="note red"><b>Over the collection:</b> ${overList.map(c => `${esc(cardLabel(c))} (${u.total[c]}/${C[c].q}: ${Object.entries(u.by[c]).map(([id, q]) => esc(HERO[id].name) + ' ×' + q).join(', ')})`).join('; ')}</div>` : '<div class="note green">Every deck fits the collection at the same time.</div>'}
        ${bad.length ? `<div class="note red" style="margin-top:10px"><b>Decks that need attention:</b> ${bad.map(h => `<a href="#hero/${h.id}">${esc(h.name)}</a>`).join(', ')}</div>` : ''}
        <div class="actions" style="margin-top:14px">
          <button class="btn small blue" id="allTxt">⬇ All decks (.txt)</button>
          <button class="btn small ghost" id="allJson">⬇ All decks (.json)</button>
          <button class="btn small ghost" id="pullTxt">⬇ Pull sheets (.txt)</button>
          <button class="btn small ghost" id="exportEdits" ${edited.length ? '' : 'disabled'}>⬇ My edits</button>
          <label class="btn small ghost" style="cursor:pointer">⬆ Import edits<input type="file" id="importEdits" accept="application/json" hidden></label>
          <button class="btn small red" id="resetAll" ${edited.length ? '' : 'disabled'}>⟲ Reset all edits</button>
        </div>
      </section>
      <section class="panel">
        <h2 class="h-sec">Pull sheets by box <small>build every deck straight from the boxes</small></h2>
        <p class="explain">Open a box to see which cards go to which hero deck. Each hero's own box is used first for its cards, then the oldest boxes. Signature cards simply stay with their hero.</p>
        ${packsHtml}
      </section>
      <section class="panel">
        <h2 class="h-sec">Spare cards <small>copies not used by any deck</small></h2>
        ${spareHtml}
      </section>`;
    $('#allTxt').addEventListener('click', () => download('marvel-champions-all-decks.txt', HEROES.map(h => deckText(h, deckOf(h.id), true)).join('\n\n' + '='.repeat(60) + '\n\n')));
    $('#allJson').addEventListener('click', () => download('marvel-champions-all-decks.json', JSON.stringify(HEROES.map(h => deckJson(h, deckOf(h.id))), null, 1), 'application/json'));
    $('#pullTxt').addEventListener('click', () => {
      const L = ['Marvel Champions — pull sheets (DFW Gaming Village collection plan)', ''];
      for (const p of packOrder) {
        L.push(`== ${packName(p)} ==`);
        for (const id of Object.keys(perPack[p]).sort((a, b) => HERO[a].name.localeCompare(HERO[b].name))) {
          L.push(`  ${HERO[id].name} (${HERO[id].ae}): ` + perPack[p][id].map(x => `${x.q}x ${cardLabel(x.code)}`).join(', '));
        }
        L.push('');
      }
      download('marvel-champions-pull-sheets.txt', L.join('\n'));
    });
    const ex = $('#exportEdits'); ex.addEventListener('click', () => download('marvel-champions-my-edits.json', JSON.stringify({ edits: store.edits }, null, 1), 'application/json'));
    $('#importEdits').addEventListener('change', ev => {
      const f = ev.target.files[0]; if (!f) return;
      f.text().then(t => {
        try {
          const j = JSON.parse(t);
          const edits = j.edits || {};
          for (const [id, d] of Object.entries(edits)) if (HERO[id] && d && d.cards) store.edits[id] = { opt: d.opt, cards: d.cards };
          saveStore(); usageDirty = true; renderCollection(); toast('Edits imported');
        } catch (e) { toast('That file is not a builder export'); }
      });
    });
    const ra = $('#resetAll'); ra.addEventListener('click', () => { if (confirm('Reset every edited deck back to the collection plan?')) { store.edits = {}; saveStore(); usageDirty = true; renderCollection(); toast('All decks reset'); } });
    bindCardRows(app);
  }

  // ------------------------------------------------------------------ boot
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') { const s = $('#sheet'); if (!s.hidden) { s.hidden = true; const sc = $('.scrim'); if (sc) sc.remove(); } hidePop(); }
  });
  render(false);
})();
