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
  // Game Night competitive (VS) mode: one hero list and one leader scenario per side; `add` = the team the hero grid fills
  store.night.vs = Object.assign({ on: false, add: 'registration', registration: [], resistance: [], scn: {} }, store.night.vs || {});
  store.enc = store.enc || {};
  // A leader's 4 basic cards are competitive-only (Civil War rulebook p.3). The first release still treated them as
  // deck cards, so Rebuild could use them as filler: drop them from saved edits and say so once the page is up.
  let strippedLeaderCards = 0;
  const dropLeaderCards = edits => {
    for (const d of Object.values(edits || {})) {
      if (!d || !d.cards) continue;
      for (const code of Object.keys(d.cards)) if (C[code] && C[code].ld) { strippedLeaderCards += d.cards[code] || 0; delete d.cards[code]; }
    }
  };
  dropLeaderCards(store.edits);
  if (strippedLeaderCards) saveStore();

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
      if (c.q != null && q > free) {
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
  setTimeout(() => { if (strippedLeaderCards) toast(`Removed ${strippedLeaderCards} competitive-only leader card${strippedLeaderCards > 1 ? 's' : ''} from your edited decks — use Rebuild to refill them`); }, 600);
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
      <p>${esc(c.x || '')}</p>${c.ld ? `<p style="margin:0 0 6px"><b>Competitive mode only:</b> a leader card, set aside at setup and earned by clearing Choosing Sides (${c.p === 'synthezoid' ? 'Synthezoid Smackdown rulebook p.3, 15' : 'Civil War rulebook p.3, 16'}).</p>` : ''}${c.q != null ? `<p style="margin:0"><b>Owned:</b> ${c.q} · <b>In decks:</b> ${inDecks.length ? esc(inDecks.join(', ')) : 'none'}</p>` : ''}</div></div>`;
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
  // ---- leaders & competitive (VS) mode — Civil War rulebook pp.3-6, 14-17, 20
  const leaderTitle = s => String(s.villain || s.name).replace(/\s*\(leader\)$/i, '');
  const foeSide = side => (side === 'registration' ? 'resistance' : 'registration');
  const sideName = side => side.charAt(0).toUpperCase() + side.slice(1);
  function vsSide(s) { return s && s.side && ENC && ENC.vs ? ENC.vs.sides[s.side] || null : null; }
  function leaderSchemes(s, e) {      // a leader scenario's chosen stage 1 and stage 2 main schemes
    const sd = vsSide(s);
    if (!sd) return null;
    const pre = s.vsSchemes || [];
    return {
      ms1: sd.stage1.find(x => x.code === e.ms1) || sd.stage1.find(x => x.code === pre[0]) || sd.stage1[0],
      ms2: sd.stage2.find(x => x.code === e.ms2) || sd.stage2.find(x => x.code === pre[1]) || sd.stage2[0],
    };
  }
  function mainSchemeList(s, e) {
    const ls = leaderSchemes(s, e);
    if (ls) return [ls.ms1.name + ' (stage 1)', ls.ms2.name + ' (stage 2)'];
    const ms = schemeOf(s, e);
    return (s.mainSchemeDeck || []).length ? s.mainSchemeDeck : (ms ? ms.mainSchemeDeck || [] : []);
  }
  // Setup-page link for this leader scenario in VS mode (the other side keeps the setup page's default)
  function vsSetupHref(s, e) {
    const k = s.side === 'registration' ? 'reg' : 'res';
    const p = new URLSearchParams({ vs: '1', t: String(e.players), m: e.mode });
    p.set(k, s.id); p.set(k + 'm', e.mods.join(',')); p.set(k + 's', [e.ms1 || '', e.ms2 || ''].join(','));
    return '../marvel-champions-setup/#' + p.toString();
  }
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
        <p class="explain">Pick a scenario to see its villain deck, main schemes and recommended modular sets from the official insert, then tune the encounter deck: expert, standard/expert set variants, heroic level, and extra or random modulars. Tiles show the first villain stage's hit points (×P = per player). Can't decide? Roll the dice. <b>Competitive (VS):</b> the Civil War and Synthezoid Smackdown leaders can also be played registration vs. resistance, 1v1 or 2v2 — open a leader and switch to VS, or use Game Night's VS mode.</p>
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
      heroic: 0, skirmish: false, players: 2, mods: Array.from(new Set(mods)), ms: ms ? ms.id : null,
      vs: false, ms1: (s.vsSchemes || [])[0] || null, ms2: (s.vsSchemes || [])[1] || null };
  }
  function encState(s, params) {
    const base = Object.assign(encDefaults(s), store.enc[s.id] || {});
    if (params && params.has('m')) base.mode = params.get('m') === 'expert' ? 'expert' : 'standard';
    if (params && params.has('p')) base.players = Math.max(1, Math.min(4, +params.get('p') || 2));
    if (params && params.has('h')) base.heroic = Math.max(0, Math.min(5, +params.get('h') || 0));
    if (params && params.has('mods')) base.mods = params.get('mods').split(',').filter(x => ENC.sets[x]);
    if (params && params.has('ms') && msById(params.get('ms'))) base.ms = params.get('ms');
    if (params && s.side) {
      if (params.has('vs')) base.vs = params.get('vs') === '1';
      if (params.get('ms1')) base.ms1 = params.get('ms1');
      if (params.get('ms2')) base.ms2 = params.get('ms2');
    }
    if (!s.side) base.vs = false;
    if (base.vs) { base.players = Math.max(1, Math.min(2, base.players)); base.heroic = 0; base.skirmish = false; }
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
    const std = e.vs && s.side && ENC.vs ? ENC.vs.pvpSet : e.std;     // competitive: Standard PvP replaces Standard (CW p.4, 14)
    if (std) add(std, 'Standard');
    if (e.mode === 'expert' && e.exp) add(e.exp, 'Expert');
    const obl = s.noObligations ? 0 : e.players;
    const total = rows.reduce((t, r) => t + (r.n || 0), 0) + obl;
    return { rows: rows.filter(r => r.n > 0 || r.tag !== 'Scenario'), total, approx, obl };
  }
  function stageToken(name) { const m = String(name).match(/\(([^)]+)\)\s*$/); return m ? m[1] : null; }
  function leaderBuildHtml(s) {
    const L = ENC && ENC.leaderCustomization;
    const sd = vsSide(s);
    if (!L || !sd) return '';
    const note = Object.values(L.sides || {}).map(x => x.synthezoidSmackdown && x.synthezoidSmackdown.note).find(Boolean);
    const ss = x => (x === 'synthezoid' ? ' (Synthezoid)' : '');
    return `<h4 class="h-sec" style="font-size:16px;margin-top:14px">Custom leader build</h4>
      <ol class="ul">${(L.steps || []).map(x => `<li>${esc(x)}</li>`).join('')}</ol>
      <dl class="kv" style="margin-top:8px"><dt>Side</dt><dd>${esc(sideName(s.side))} — leaders ${esc(sd.leaders.map(id => leaderTitle(scnById(id))).join(', '))}</dd>
        <dt>Side modulars</dt><dd>${esc(sd.modulars.map(id => setInfo(id).name + ss(setInfo(id).product)).join(', '))}</dd>
        <dt>Stage 1 schemes</dt><dd>${esc(sd.stage1.map(x => x.name + ss(x.product)).join(', '))}</dd>
        <dt>Stage 2 schemes</dt><dd>${esc(sd.stage2.map(x => x.name + ss(x.product)).join(', '))}</dd></dl>
      ${note ? `<p class="explain">${esc(note)}</p>` : ''}`;
  }
  function vsBoxHtml(s, e) {
    const n = e.players, L = leaderTitle(s);
    const cards = (s.vsCards || []).map(x => `<div class="vs-card" data-card="${esc(x.code)}" tabindex="0" role="button" aria-label="${esc(x.name)}">${imgUrl(x.code) ? `<img src="${imgUrl(x.code)}" alt="" loading="lazy" onerror="this.remove()">` : ''}<span>${esc(x.name)}</span></div>`).join('');
    return `<section class="panel vs-box ${esc(s.side)}">
      <h3 class="h-sec">Competitive (VS) <small>${n === 1 ? '1v1' : '2v2'} · ${esc(sideName(s.side))}</small></h3>
      <ul class="ul">
        <li>The <b>${esc(s.side)}</b> team builds this scenario; the <b>${foeSide(s.side)}</b> team fights ${esc(L)} in its own game area — and you fight the leader they built.</li>
        <li>No ${esc(L)} hero on the ${esc(s.side)} team; uniqueness only applies within a team.</li>
        <li><b>Choosing Sides</b> (Standard PvP) starts in the ${foeSide(s.side)} team's game area with ${4 * n} threat; until it's cleared, ${esc(L)} can't take more than 2 damage from each attack.</li>
      </ul>
      <h4 class="h-sec" style="font-size:16px;margin-top:12px">${esc(L)}'s basic cards <small>set aside at setup</small></h4>
      <div class="vs-cards">${cards}</div>
      <p class="explain">When the ${esc(s.side)} team clears the Choosing Sides in its own game area, it flips to Now It's Personal: its Action lets each player on the team add 2 of these cards to their hand, and they stay in that player's deck for the rest of the game. (Civil War rulebook p.16)</p>
      <div class="actions"><a class="btn small red" href="${vsSetupHref(s, e)}">Competitive setup, step by step ↗</a></div>
    </section>`;
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
    const sd = vsSide(s), ls = leaderSchemes(s, e);
    const browse = e.vs && sd ? sd.modulars : ENC.modularOrder;     // competitive: only this side's sets (CW p.5)
    const mf = (state.modFilter || '').toLowerCase();
    const allGrid = browse.filter(mid => !top.includes(mid) && (!mf || (setInfo(mid).name + ' ' + packName(setInfo(mid).product)).toLowerCase().includes(mf)))
      .map(mid => modTile(mid, false, false)).join('');
    let leaderNote = '';
    if (sd) {
      const own = e.mods.filter(m => sd.modulars.includes(m)), other = e.mods.filter(m => !sd.modulars.includes(m));
      const wrongSide = e.mods.filter(m => ENC.vs.sides[foeSide(s.side)].modulars.includes(m));
      if (wrongSide.length) leaderNote = `<p class="note red" style="margin:0 0 10px">You can't mix registration and resistance modular sets — remove ${esc(wrongSide.map(m => setInfo(m).name).join(', '))}. (Civil War rulebook p.4)</p>`;
      else if (e.vs && other.length) leaderNote = `<p class="note red" style="margin:0 0 10px">Competitive mode only allows ${esc(s.side)} modular sets — remove ${esc(other.map(m => setInfo(m).name).join(', '))}. (Civil War rulebook p.4–5)</p>`;
      else if (own.length < 3 || own.length > 4) leaderNote = `<p class="note ${e.vs ? 'red' : ''}" style="margin:0 0 10px">A custom leader scenario uses <b>3–4 ${esc(s.side)} modular sets</b> (${own.length} chosen)${e.vs ? '' : '; co-op games may also add sets from other products'}. (Civil War rulebook p.4–5)</p>`;
    }
    const setupNotes = (s.setupNotes || []).concat(ms ? (ms.setupNotes || []) : []);
    const special = (s.specialRules || []).concat(ms ? (ms.specialRules || []) : []);
    const mainSchemes = mainSchemeList(s, e);
    const rulesHref = e.vs ? vsSetupHref(s, e) : `../marvel-champions-setup/#scn=${encodeURIComponent(s.id)}&m=${e.mode}&p=${e.players}&h=${e.heroic}${e.skirmish ? '&sk=1' : ''}&mods=${e.mods.join(',')}&std=${e.std || ''}&exp=${e.exp || ''}${ls ? `&lms=${ls.ms1.code},${ls.ms2.code}` : ''}`;
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
          <div class="row">${s.format !== 'standard' ? `<span class="pill a-encounter">${esc(formatName(s.format))}</span>` : ''}${e.vs ? `<span class="pill vs-pill">VS · ${e.players === 1 ? '1v1' : '2v2'}</span>` : ''}<span class="pill" style="background:var(--gold)">${deck.approx ? '≈' : ''}${deck.total} encounter cards</span></div>
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
            ${sd ? `<div class="row" style="margin-bottom:10px"><div class="seg" role="group" aria-label="Game"><button data-vs="0" class="${e.vs ? '' : 'on'}">Co-op</button><button data-vs="1" class="${e.vs ? 'on' : ''}">VS · competitive</button></div><span class="dim">${e.vs ? 'Your team builds this scenario; the other team plays against it.' : 'Or play it competitively: two teams trade scenarios (Civil War rulebook p.14).'}</span></div>` : ''}
            <div class="row" style="margin-bottom:10px">
              <div class="seg" role="group" aria-label="Mode"><button data-mode="standard" class="${e.mode === 'standard' ? 'on' : ''}">Standard</button><button data-mode="expert" class="${e.mode === 'expert' ? 'on' : ''}">Expert</button></div>
              <div class="seg" role="group" aria-label="${e.vs ? 'Team size' : 'Players'}">${(e.vs ? [1, 2] : [1, 2, 3, 4]).map(n => `<button data-players="${n}" class="${e.players === n ? 'on' : ''}">${e.vs ? (n === 1 ? '1v1' : '2v2') : n + 'P'}</button>`).join('')}</div>
            </div>
            ${ls ? `<div class="row" style="margin-bottom:10px">
              <label class="muted" for="ms1Sel">Stage 1</label><select class="select" id="ms1Sel">${sd.stage1.map(x => `<option value="${esc(x.code)}" ${x.code === ls.ms1.code ? 'selected' : ''}>${esc(x.name)}${x.product === 'synthezoid' ? ' (Synthezoid)' : ''}</option>`).join('')}</select>
              <label class="muted" for="ms2Sel">Stage 2</label><select class="select" id="ms2Sel">${sd.stage2.map(x => `<option value="${esc(x.code)}" ${x.code === ls.ms2.code ? 'selected' : ''}>${esc(x.name)}${x.product === 'synthezoid' ? ' (Synthezoid)' : ''}</option>`).join('')}</select>
            </div>
            <p class="explain" style="margin:-4px 0 10px"><b>${esc(ls.ms1.name)}:</b> ${esc(ls.ms1.text)}<br><b>${esc(ls.ms2.name)}:</b> ${esc(ls.ms2.text)}</p>` : ''}
            <div class="row" style="margin-bottom:10px">
              <label class="muted" for="stdSel">Standard set</label>
              <select class="select" id="stdSel" ${e.vs ? 'disabled title="Competitive mode uses the Standard PvP set"' : ''}>${e.vs ? '<option>Standard PvP</option>' : `<option value="">None</option>${(ENC.standardSets || []).filter(x => x.id !== (ENC.vs && ENC.vs.pvpSet)).map(x => `<option value="${x.id}" ${e.std === x.id ? 'selected' : ''}>${esc(x.name)}</option>`).join('')}`}</select>
              <label class="muted" for="expSel">Expert set</label>
              <select class="select" id="expSel" ${e.mode !== 'expert' ? 'disabled' : ''}><option value="">None</option>${(ENC.expertSets || []).map(x => `<option value="${x.id}" ${e.exp === x.id ? 'selected' : ''}>${esc(x.name)}</option>`).join('')}</select>
            </div>
            <div class="row" style="margin-bottom:12px" ${e.vs ? 'hidden' : ''}>
              <label class="muted" for="heroicSel">Heroic level</label>
              <select class="select" id="heroicSel">${[0, 1, 2, 3, 4, 5].map(n => `<option value="${n}" ${e.heroic === n ? 'selected' : ''}>${n ? 'Heroic ' + n : 'Off'}</option>`).join('')}</select>
              <label class="row" style="gap:6px"><input type="checkbox" id="skirm" ${e.skirmish ? 'checked' : ''}> Skirmish (one villain version)</label>
            </div>
            <h4 class="h-sec" style="font-size:17px">Modular sets <small>${e.mods.length} chosen</small></h4>
            <div class="row" style="margin-bottom:10px">
              <button class="btn small ghost" id="recBtn">Recommended</button>
              ${sd ? `<button class="btn small ghost" id="randBuild" title="3-4 random ${esc(s.side)} sets and random main schemes (Civil War rulebook p.5)">🎲 Random build</button>` : `<button class="btn small ghost" id="rand1">🎲 Random 1</button>
              <button class="btn small ghost" id="rand2">🎲 Random 2</button>`}
              <button class="btn small ghost" id="clrBtn">Clear</button>
            </div>
            ${leaderNote}
            ${s.modularChoice ? `<p class="note" style="margin:0 0 10px">This scenario picks modular sets by rule: choose ${esc(String(s.modularChoice.count || ''))} — ${esc(s.modularChoice.from || '')}.</p>` : ''}
            <div class="m-grid" id="modGrid">${topGrid || '<p class="muted">No modular sets chosen.</p>'}</div>
            <details class="pack" id="modBrowse" style="margin-top:12px" ${state.modBrowse ? 'open' : ''}><summary>${e.vs && sd ? 'Browse the ' + esc(s.side) + ' modular sets' : 'Browse all modular sets'}<small>${browse.length} sets</small></summary>
              <div class="pbody"><input class="input search" id="modQ" type="search" placeholder="Filter by name or box…" value="${esc(state.modFilter || '')}" style="width:100%;margin-bottom:10px">
              <div class="m-grid small" id="modAll">${allGrid || '<p class="muted">No sets match.</p>'}</div></div></details>
          </section>
        </div>
        <div class="enc-side">
          <section class="panel">
            <h3 class="h-sec">Encounter deck</h3>
            <div class="setlist">${deck.rows.map(r => `<div class="setrow">${setImg(r.id) ? `<img src="${setImg(r.id)}" alt="">` : '<span></span>'}<div><b>${esc(r.name)} <span class="tag ${r.tag === 'Required' || r.tag === 'Scenario' ? 'req' : r.tag === 'Recommended' ? 'rec' : 'opt'}">${esc(r.tag)}</span></b><span>${esc(compText(r.comp, true))}</span></div><span class="cnt">${r.approx ? '≈' : ''}${r.n}</span></div>`).join('')}
              <div class="setrow"><span></span><div><b>Hero obligations</b><span>${s.noObligations ? 'not used in this scenario' : e.vs ? '1 per player on the team facing this scenario' : '1 per player'}</span></div><span class="cnt">${deck.obl}</span></div></div>
            <div class="total-bar"><span class="muted">${/deck separately|decks separately|own encounter deck/i.test(setupNotes.join(' ')) ? 'Encounter cards (in separate villain decks)' : 'Encounter deck at setup'}</span><b>${deck.approx ? '≈' : ''}${deck.total} cards</b></div>
            <p class="explain">Villain stages and main schemes are separate decks and aren't counted; some cards are put into play during setup.${expStages.length && e.mode !== 'expert' ? ' Expert villain deck: ' + esc(expStages.join(' → ')) + '.' : ''}</p>
            <div class="actions" style="margin-top:12px">
              <a class="btn small red" href="${rulesHref}">Step-by-step setup ↗</a>
              <button class="btn small" id="toNight">★ Use for Game Night</button>
              <button class="btn small blue" id="copyEnc">⧉ Copy list</button>
              <button class="btn small ghost" id="linkEnc">🔗 Share link</button>
            </div>
          </section>
          ${e.vs && sd ? vsBoxHtml(s, e) : ''}
        </div>
      </div>`;
    const vb = $('.vs-box'); if (vb) { bindCardRows(vb); $$('.vs-card', vb).forEach(el => el.addEventListener('keydown', ev => { if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); openSheet(el.dataset.card); } })); }
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
    const r1 = $('#rand1'); if (r1) r1.addEventListener('click', () => { upd({ mods: randomMods(1) }); toast('Random modular chosen'); });
    const r2 = $('#rand2'); if (r2) r2.addEventListener('click', () => { upd({ mods: randomMods(2) }); toast('Two random modulars chosen'); });
    $$('[data-vs]').forEach(b => b.addEventListener('click', () => { const on = b.dataset.vs === '1'; upd({ vs: on, players: on ? Math.min(2, e.players) : e.players }); }));
    const m1 = $('#ms1Sel'); if (m1) m1.addEventListener('change', ev => upd({ ms1: ev.target.value }));
    const m2 = $('#ms2Sel'); if (m2) m2.addEventListener('change', ev => upd({ ms2: ev.target.value }));
    const rb = $('#randBuild'); if (rb) rb.addEventListener('click', () => {
      // Random scenario creation (Civil War rulebook p.5): 3-4 of the side's modular sets and both main scheme stages at random
      const pool = sd.modulars.slice(), mods = [], n = 3 + Math.floor(Math.random() * 2);
      while (mods.length < n && pool.length) mods.push(pool.splice(Math.floor(Math.random() * pool.length), 1)[0]);
      const pick = a => a[Math.floor(Math.random() * a.length)].code;
      upd({ mods, ms1: pick(sd.stage1), ms2: pick(sd.stage2) }); toast('Random ' + s.side + ' build');
    });
    $$('#modGrid [data-mod], #modAll [data-mod]').forEach(b => b.addEventListener('click', () => {
      const m = b.dataset.mod;
      const mods = e.mods.includes(m) ? e.mods.filter(x => x !== m) : e.mods.concat(m);
      upd({ mods });
    }));
    const mb = $('#modBrowse'); mb.addEventListener('toggle', () => { state.modBrowse = mb.open; });
    const mq = $('#modQ'); mq.addEventListener('input', () => { state.modFilter = mq.value; const pos = mq.selectionStart; const y = window.scrollY; renderVillain(s.id); window.scrollTo(0, y); const n = $('#modQ'); n.focus(); n.setSelectionRange(pos, pos); });
    $('#toNight').addEventListener('click', () => {
      if (e.vs && s.side) { const V = store.night.vs; saveEnc(s, e); V.on = true; V.scn[s.side] = { id: s.id }; saveStore(); go('night'); return; }
      store.night.vs.on = false; store.night.scn = { id: s.id, enc: e }; saveStore(); go('night');
    });
    $('#copyEnc').addEventListener('click', () => copyText(encText(s, e), 'Encounter list copied'));
    $('#linkEnc').addEventListener('click', () => copyText(location.origin + location.pathname + `#villain/${s.id}?m=${e.mode}&p=${e.players}&h=${e.heroic}&mods=${e.mods.join(',')}${e.ms ? '&ms=' + e.ms : ''}${s.side ? `&vs=${e.vs ? 1 : 0}&ms1=${e.ms1 || ''}&ms2=${e.ms2 || ''}` : ''}`, 'Link copied'));
  }
  function encText(s, e) {
    const deck = encounterDeck(s, e);
    const ms = schemeOf(s, e);
    const L = [];
    L.push(`${s.name}${ms ? ' — ' + ms.name : ''} — ${e.mode === 'expert' ? 'Expert' : 'Standard'}${e.heroic ? ' · Heroic ' + e.heroic : ''}${e.skirmish ? ' · Skirmish' : ''} · ${e.vs ? 'Competitive (VS) ' + (e.players === 1 ? '1v1' : '2v2') : e.players + ' player' + (e.players > 1 ? 's' : '')}`);
    L.push(`${s.productName}${s.campaign ? ' (' + s.campaign + (s.campaignOrder ? ' #' + s.campaignOrder : '') + ')' : ''}`);
    L.push('');
    L.push(`Villain deck: ${((s.villainDeck || {})[e.mode] || []).join(', ')}`);
    L.push(`Main scheme deck: ${mainSchemeList(s, e).join(', ')}`);
    L.push('');
    L.push(`Encounter deck (${deck.approx ? '≈' : ''}${deck.total} cards):`);
    for (const r of deck.rows) L.push(`  • ${r.name} (${r.tag}) — ${r.approx ? '≈' : ''}${r.n} cards`);
    L.push(s.noObligations ? '  • (no hero obligations in this scenario)' : `  • Each hero's obligation — ${e.players}${e.vs ? ' (the team facing this scenario)' : ''}`);
    if (e.vs && s.side) {
      L.push('');
      L.push(`Competitive (VS): the ${sideName(s.side)} team builds this scenario; the ${foeSide(s.side)} team plays against it. No ${leaderTitle(s)} hero on the ${s.side} team.`);
      L.push(`Set aside ${leaderTitle(s)}'s basic cards (earned via Choosing Sides): ${(s.vsCards || []).map(x => x.name).join(', ')}`);
    }
    const setupNotes = (s.setupNotes || []).concat(ms ? (ms.setupNotes || []) : []);
    const special = (s.specialRules || []).concat(ms ? (ms.specialRules || []) : []);
    if (setupNotes.length) { L.push(''); L.push('Setup:'); setupNotes.forEach(x => L.push('  • ' + x)); }
    if (special.length) { L.push(''); L.push('Special rules:'); special.forEach(x => L.push('  • ' + x)); }
    return L.join('\n');
  }

  // ========================================================= GAME NIGHT TAB
  // ------------------------------------------------ Game Night: competitive (VS)
  const nightModeSeg = on => `<div class="seg" role="group" aria-label="Game"><button data-nmode="coop" class="${on ? '' : 'on'}">Co-op</button><button data-nmode="vs" class="${on ? 'on' : ''}">VS · competitive</button></div>`;
  function bindNightMode() {
    $$('[data-nmode]').forEach(b => b.addEventListener('click', () => { store.night.vs.on = b.dataset.nmode === 'vs'; saveStore(); renderNight(); }));
  }
  function vsNightTeams() {
    const V = store.night.vs;
    const T = {};
    for (const side of ['registration', 'resistance']) {
      const leaders = ENC.scenarios.filter(x => x.side === side);
      const saved = V.scn[side] && scnById(V.scn[side].id);
      const sc = saved && saved.side === side ? saved : leaders[0];
      const heroes = (V[side] || []).filter(id => HERO[id]).slice(0, 2);
      // The leader's own page is the single source of truth (Tune ↔ Game Night). A build that was only ever tuned
      // for co-op starts from the preconstructed sets, since co-op may hold sets that competitive mode bars.
      const stored = store.enc[sc.id];
      const e = encState(sc);
      if (!stored || !stored.vs) e.mods = (sc.recommendedModulars || []).slice();
      Object.assign(e, { vs: true, heroic: 0, skirmish: false, mode: V.mode === 'expert' ? 'expert' : 'standard' });
      // The collection has one Expert and one Expert II set; Expert II may replace Expert (The Hood insert p.2).
      e.exp = side === 'registration' ? 'expert' : 'expert_ii';
      T[side] = { side, s: sc, e, heroes, leader: leaderTitle(sc) };
    }
    const n = Math.max(1, T.registration.heroes.length, T.resistance.heroes.length);
    for (const t of Object.values(T)) t.e.players = n;
    return T;
  }
  function vsNightIssues(T) {
    const out = [];
    const a = T.registration.heroes.length, b = T.resistance.heroes.length;
    if (!a || !b) out.push('Seat at least one hero on each team.');
    else if (a !== b) out.push(`Teams play 1v1 or 2v2 — this table is ${a} vs ${b}. (Civil War rulebook p.14)`);
    for (const t of Object.values(T)) {
      for (const id of t.heroes) {
        if (HERO[id].name.toLowerCase() === t.leader.toLowerCase()) out.push(`${HERO[id].name} can't play on the ${t.side} team: players can't use an identity that shares a title with their own leader. (Civil War rulebook p.14)`);
      }
      if (t.heroes.length === 2) {
        const [x, y] = t.heroes.map(id => HERO[id]);
        if (matchesUnique({ n: x.name, ae: x.ae }, { n: y.name, ae: y.ae })) out.push(`${x.name} and ${y.name} match — teammates can't choose matching identities. (RR p.45)`);
      }
      for (const id of t.heroes) {
        const h = HERO[id], d = deckOf(id);
        const codes = h.sig.map(([code]) => code).concat(Object.keys(d.cards).filter(code => d.cards[code]));
        const clash = Array.from(new Set(codes)).filter(code => C[code] && C[code].u && C[code].t !== 'hero' && C[code].t !== 'alter_ego' && matchesUnique(C[code], { n: t.leader }));
        if (clash.length) out.push(`Heads-up: ${h.name}'s deck has ${clash.map(code => C[code].n + ' (' + (TYPE_ONE[C[code].t] || C[code].t).toLowerCase() + ')').join(', ')}, which matches the team's own ${t.leader} leader — the unique rule includes your leader, so it can't enter play while that leader is in play. (Civil War rulebook p.20, FAQ)`);
      }
      const pool = vsSide(t.s).modulars, own = t.e.mods.filter(m => pool.includes(m));
      if (own.length !== t.e.mods.length) out.push(`${t.leader}'s deck has sets from outside the ${t.side} side — competitive mode only allows ${t.side} sets. (Civil War rulebook p.5)`);
      else if (own.length < 3 || own.length > 4) out.push(`${t.leader}'s deck needs 3–4 ${t.side} modular sets (${own.length} chosen). (Civil War rulebook p.4)`);
    }
    return out;
  }
  function vsNightHref(T, n) {
    const p = new URLSearchParams({ vs: '1', t: String(n), m: T.registration.e.mode });
    for (const [k, t] of [['reg', T.registration], ['res', T.resistance]]) {
      p.set(k, t.s.id); p.set(k + 'm', t.e.mods.join(',')); p.set(k + 's', [t.e.ms1 || '', t.e.ms2 || ''].join(','));
    }
    return '../marvel-champions-setup/#' + p.toString();
  }
  function vsNightSteps(T, n) {
    const reg = T.registration, res = T.resistance;
    const heroList = t => t.heroes.map(id => `${HERO[id].name} (${HERO[id].hp} HP)`).join(' & ') || '(no heroes yet)';
    const area = (t, o) => {      // t's game area, facing o's scenario
      const ls = leaderSchemes(o.s, o.e), deck = encounterDeck(o.s, o.e);
      const st = ((o.s.stats && o.s.stats.stages) || []).find(x => x.name === ((o.s.villainDeck || {})[o.e.mode] || [])[0]);
      const obl = t.heroes.map(id => C[HERO[id].ob] ? C[HERO[id].ob].n : '').filter(Boolean);
      return `${sideName(t.side)} game area — fights ${st ? st.name : o.leader}${st && st.hp != null ? ` (${st.hp}×${n} = ${st.hp * n} HP)` : ''} · main schemes ${ls.ms1.name} → ${ls.ms2.name} · encounter deck: ${deck.rows.map(r => r.name).join(', ')}${obl.length ? ' + ' + obl.join(', ') : ''} — ${deck.approx ? 'about ' : ''}${deck.total} cards.`;
    };
    const setupOf = o => (o.s.setupNotes || []).filter(x => !/^Co-op:/i.test(x)).join(' ');
    return [
      `Registration: ${heroList(reg)} — led by ${reg.leader}. Resistance: ${heroList(res)} — led by ${res.leader}. Sit across the table; each half is a team's game area.`,
      `Each team sets aside its leader's 4 basic cards: ${reg.leader} — ${(reg.s.vsCards || []).map(x => x.name).join(', ')}; ${res.leader} — ${(res.s.vsCards || []).map(x => x.name).join(', ')}.`,
      `Trade scenarios: the registration team fights ${res.leader}, the resistance team fights ${reg.leader}.`,
      'Each player: identity alter-ego side up, set hit points, set aside obligation and nemesis set, shuffle the deck. Each team takes its own first player token; the registration team goes first every round.',
      area(reg, res),
      area(res, reg),
      `Setup in each area: the enemy team finds Choosing Sides and your team reveals it (${4 * n} threat; the enemy leader can't take more than 2 damage per attack while it's in play). Flip the main scheme to 1B${n > 1 ? ` (hinder: ${2 * n} threat)` : ''} and resolve its When Revealed${[reg, res].map(o => leaderSchemes(o.s, o.e).ms1).map(m => { const w = /When Revealed:\s*(.+?)(?:\s*If this stage is completed|$)/.exec(m.text || ''); return w ? ` (${m.name}: ${w[1]})` : ''; }).join('')}. Then each leader's setup: ${[setupOf(reg), setupOf(res)].filter(Boolean).join(' ') || '—'}`,
      ...(reg.e.mode === 'expert' ? ['Expert: each leader uses stages III and IV and each deck adds an Expert set — the collection has one Expert and one Expert II set, and Expert II may replace Expert (The Hood insert p.2), so the registration deck takes Expert and the resistance deck Expert II.'] : []),
      'Draw to alter-ego hand size and mulligan. Round: registration player phase → resistance player phase → registration villain phase → resistance villain phase.',
    ];
  }
  function renderNightVs() {
    const V = store.night.vs;
    const T = vsNightTeams();
    const n = Math.max(1, T.registration.heroes.length, T.resistance.heroes.length);
    const found = vsNightIssues(T);
    const issues = found.filter(x => !x.startsWith('Heads-up')), heads = found.filter(x => x.startsWith('Heads-up'));
    const seated = T.registration.heroes.concat(T.resistance.heroes);
    const teamPanel = t => {
      const seats = [0, 1].map(i => {
        const id = t.heroes[i];
        if (!id) return `<div class="seat"><span style="width:90px;height:70px;border:2px dashed var(--line-2);border-radius:8px;display:block"></span><div class="empty">${i === 0 ? 'Seat 1' : 'Seat 2 (for 2v2)'} — pick a hero below</div><span></span></div>`;
        const h = HERO[id], d = deckOf(id);
        return `<div class="seat"><img src="images/heroes/${id}.webp" alt=""><div><b>${esc(h.name)}</b><div class="dim">${aeOf(h) ? esc(aeOf(h)) + ' · ' : ''}${optPills(d.opt)}</div></div>
          <span class="seat-x row"><a class="btn small ghost" href="#hero/${id}">Deck</a><button class="iconbtn" data-vsunseat="${t.side}:${id}" aria-label="Remove ${esc(h.name)}">✕</button></span></div>`;
      }).join('');
      const deck = encounterDeck(t.s, t.e), ls = leaderSchemes(t.s, t.e);
      const tune = `#villain/${t.s.id}?vs=1&p=${n}&m=${t.e.mode}&mods=${t.e.mods.join(',')}&ms1=${t.e.ms1 || ''}&ms2=${t.e.ms2 || ''}`;
      return `<section class="panel vs-team-panel ${t.side}">
        <h3 class="h-sec"><span class="vs-side">${sideName(t.side)} team</span> <small>${t.heroes.length}/2 heroes</small></h3>${seats}
        <h4 class="h-sec" style="font-size:16px;margin-top:14px">Leader &amp; scenario <small>the ${foeSide(t.side)} team plays it</small></h4>
        <div class="seat">${t.s.img ? `<img src="${t.s.img}" alt="">` : '<span></span>'}<div><select class="select" data-vsleader="${t.side}" aria-label="${sideName(t.side)} leader">${ENC.scenarios.filter(x => x.side === t.side).map(x => `<option value="${x.id}" ${x.id === t.s.id ? 'selected' : ''}>${esc(leaderTitle(x))}</option>`).join('')}</select>
          <div class="dim" style="margin-top:4px">${t.e.mods.length} modular sets · ${ls ? esc(ls.ms1.name) + ' → ' + esc(ls.ms2.name) : ''} · ${deck.approx ? '≈' : ''}${deck.total} encounter cards</div></div>
          <a class="btn small ghost seat-x" href="${tune}">Tune</a></div>
      </section>`;
    };
    const mini = HEROES.slice().sort((a, b) => a.name.localeCompare(b.name)).map(h => {
      const on = seated.includes(h.id), full = (T[V.add].heroes.length >= 2);
      return `<button class="mini ${on ? 'on' : ''}" data-vsseat="${h.id}" ${!on && full ? 'disabled' : ''} title="${esc(h.name + ' — ' + h.ae)}"><img src="images/heroes/${h.id}.webp" alt="" loading="lazy"><span>${esc(h.name)}</span></button>`;
    }).join('');
    const ready = !issues.length;
    const steps = vsNightSteps(T, n);
    app.innerHTML = `
      <section class="panel" style="margin-bottom:18px">
        <h2 class="h-sec">Game night <small>registration vs. resistance</small></h2>
        <p class="explain">Competitive mode (Civil War rulebook p.14): <b>1v1 or 2v2</b>. Each team seats its heroes and builds a scenario for its own leader; the teams trade scenarios and race to defeat the enemy leader first. Every pre-built deck can be on the table at once.</p>
        <div class="actions">${nightModeSeg(true)}
          <div class="seg" role="group" aria-label="Mode"><button data-vsmode="standard" class="${V.mode !== 'expert' ? 'on' : ''}">Standard</button><button data-vsmode="expert" class="${V.mode === 'expert' ? 'on' : ''}">Expert</button></div>
          <button class="btn small" id="vsRollHeroes">🎲 Random heroes</button><button class="btn small" id="vsRollLeaders">🎲 Random leaders</button><button class="btn small ghost" id="clearNight">Clear</button></div>
      </section>
      <div class="night-grid vs-night">${teamPanel(T.registration)}${teamPanel(T.resistance)}</div>
      ${issues.length ? `<div class="note red" style="margin:14px 0">${issues.map(esc).join('<br>')}</div>` : ''}${heads.length ? `<div class="note" style="margin:14px 0">${heads.map(esc).join('<br>')}</div>` : ''}
      <section class="panel" style="margin-top:18px"><h3 class="h-sec">Add a hero <small>to the team below</small></h3>
        <div class="row" style="margin-bottom:10px"><div class="seg" role="group" aria-label="Add heroes to"><button data-vsadd="registration" class="${V.add === 'registration' ? 'on' : ''}">Registration team</button><button data-vsadd="resistance" class="${V.add === 'resistance' ? 'on' : ''}">Resistance team</button></div><span class="dim">Tap a seated hero to remove it.</span></div>
        <div class="mini-grid">${mini}</div></section>
      <section class="panel" style="margin-top:18px"><h3 class="h-sec">Competitive setup checklist <small>${n === 1 ? '1v1' : '2v2'} · ${V.mode === 'expert' ? 'expert' : 'standard'}</small></h3>
        ${ready ? '' : '<p class="note" style="margin:0 0 10px">Fix the notes above first — the checklist follows the table as it stands.</p>'}
        <ol class="checklist">${steps.map(x => `<li>${esc(x)}</li>`).join('')}</ol>
        <div class="actions" style="margin-top:12px"><a class="btn small red" href="${vsNightHref(T, n)}">Full competitive setup ↗</a><button class="btn small blue" id="copyNight">⧉ Copy game plan</button></div></section>`;
    bindNightMode();
    $$('[data-vsmode]').forEach(b => b.addEventListener('click', () => { V.mode = b.dataset.vsmode; saveStore(); renderNight(); }));
    $$('[data-vsadd]').forEach(b => b.addEventListener('click', () => { V.add = b.dataset.vsadd; saveStore(); renderNight(); }));
    $$('[data-vsseat]').forEach(b => b.addEventListener('click', () => {
      const id = b.dataset.vsseat;
      if (seated.includes(id)) { V.registration = (V.registration || []).filter(x => x !== id); V.resistance = (V.resistance || []).filter(x => x !== id); }
      else if ((V[V.add] || []).filter(x => HERO[x]).length < 2) V[V.add] = (V[V.add] || []).filter(x => HERO[x]).concat(id);
      saveStore(); renderNight();
    }));
    $$('[data-vsunseat]').forEach(b => b.addEventListener('click', () => { const [side, id] = b.dataset.vsunseat.split(':'); V[side] = (V[side] || []).filter(x => x !== id); saveStore(); renderNight(); }));
    $$('[data-vsleader]').forEach(sel => sel.addEventListener('change', ev => {
      const sc = scnById(ev.target.value);
      if (sc) { V.scn[sel.dataset.vsleader] = { id: sc.id }; saveStore(); renderNight(); }
    }));
    $('#vsRollHeroes').addEventListener('click', () => {
      const size = n > 1 || !seated.length ? 2 : 1;
      for (let tries = 0; tries < 50; tries++) {
        const pool = HEROES.slice(), picks = { registration: [], resistance: [] };
        for (const side of ['registration', 'resistance']) {
          while (picks[side].length < size && pool.length) {
            const h = pool.splice(Math.floor(Math.random() * pool.length), 1)[0];
            if (h.name.toLowerCase() === T[side].leader.toLowerCase()) continue;
            if (picks[side].some(id => matchesUnique({ n: HERO[id].name, ae: HERO[id].ae }, { n: h.name, ae: h.ae }))) continue;
            picks[side].push(h.id);
          }
        }
        if (picks.registration.length === size && picks.resistance.length === size) { V.registration = picks.registration; V.resistance = picks.resistance; break; }
      }
      saveStore(); renderNight();
    });
    $('#vsRollLeaders').addEventListener('click', () => {
      for (const side of ['registration', 'resistance']) {
        const names = T[side].heroes.map(id => HERO[id].name.toLowerCase());
        const all = ENC.scenarios.filter(x => x.side === side), ok = all.filter(x => !names.includes(leaderTitle(x).toLowerCase()));
        const list = ok.length ? ok : all, sc = list[Math.floor(Math.random() * list.length)];
        V.scn[side] = { id: sc.id };
      }
      saveStore(); renderNight();
    });
    $('#clearNight').addEventListener('click', () => { Object.assign(V, { registration: [], resistance: [], scn: {} }); saveStore(); renderNight(); });
    $('#copyNight').addEventListener('click', () => {
      const lines = ['Marvel Champions — game night (competitive, ' + (n === 1 ? '1v1' : '2v2') + ')', ''];
      for (const t of [T.registration, T.resistance]) {
        lines.push(`${sideName(t.side)} team (leader: ${t.leader})`);
        t.heroes.forEach(id => { const h = HERO[id], d = deckOf(id); lines.push(`  ${h.name} (${h.ae}) — ${optLabel(d.opt)}`); });
      }
      lines.push(''); steps.forEach((x, i) => lines.push(`${i + 1}. ${x}`));
      for (const t of [T.registration, T.resistance]) { lines.push(''); lines.push(encText(t.s, t.e)); }
      copyText(lines.join('\n'), 'Game plan copied');
    });
  }

  function renderNight() {
    if (store.night.vs.on && ENC && ENC.vs) { renderNightVs(); return; }
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
      const nMain = mainSchemeList(sc, e);
      steps.push(`Villain deck: ${((sc.villainDeck || {})[e.mode] || []).join(' → ')}${e.skirmish ? ' (skirmish: keep only the chosen version)' : ''}. Main scheme deck: ${nMain.join(' → ')}${nms ? ' (' + nms.name + ')' : ''}.`);
      steps.push(`Encounter deck: ${deck.rows.map(r => r.name).join(', ')}${sc.noObligations ? ' (no obligations in this scenario)' : ` + the ${e.players} obligation${e.players > 1 ? 's' : ''}`} — ${deck.approx ? 'about ' : ''}${deck.total} cards.`);
      (sc.setupNotes || []).concat(nms ? (nms.setupNotes || []) : []).forEach(x => steps.push(x));
      steps.push('Put setup cards into play, resolve main scheme 1A setup, flip to 1B, then the villain\'s setup / when revealed.');
      steps.push(`Draw to hand size (alter-ego side: ${seats.map(id => `${HERO[id].name} ${HERO[id].hand[1] ?? HERO[id].hand[0]}`).join(', ') || '—'}), then mulligan.`);
      setupHtml = `<ol class="checklist">${steps.map(x => `<li>${esc(x)}</li>`).join('')}</ol>
        <div class="actions" style="margin-top:12px"><a class="btn small red" href="../marvel-champions-setup/#scn=${encodeURIComponent(sc.id)}&m=${e.mode}&p=${e.players}&h=${e.heroic}${e.skirmish ? '&sk=1' : ''}&mods=${e.mods.join(',')}${leaderSchemes(sc, e) ? `&lms=${leaderSchemes(sc, e).ms1.code},${leaderSchemes(sc, e).ms2.code}` : ''}">Full rules setup ↗</a><button class="btn small blue" id="copyNight">⧉ Copy game plan</button></div>`;
    }
    app.innerHTML = `
      <section class="panel" style="margin-bottom:18px">
        <h2 class="h-sec">Game night <small>heroes + villain = tonight's table</small></h2>
        <p class="explain">Seat up to four heroes and pick a villain. Every pre-built deck can be on the table at once — the collection plan guarantees it.</p>
        <div class="actions">${ENC && ENC.vs ? nightModeSeg(false) : ''}<button class="btn small" id="rollHeroes">🎲 Random heroes</button><button class="btn small" id="rollVillain">🎲 Random villain</button><button class="btn small ghost" id="clearNight">Clear</button></div>
      </section>
      <div class="night-grid">
        <section class="panel"><h3 class="h-sec">Heroes <small>${seats.length}/4</small></h3>${seatHtml}
          ${clash.length ? `<div class="note red" style="margin-top:10px">${clash.map(esc).join('<br>')}</div>` : ''}
          <h4 class="h-sec" style="font-size:16px;margin-top:16px">Add a hero</h4><div class="mini-grid">${mini}</div></section>
        <section class="panel"><h3 class="h-sec">Villain</h3>${villainHtml}${setupHtml ? `<h4 class="h-sec" style="font-size:16px;margin-top:16px">Setup checklist</h4>${setupHtml}` : ''}</section>
      </div>`;
    bindNightMode();
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
    $('#clearNight').addEventListener('click', () => { store.night.seats = []; store.night.scn = null; saveStore(); renderNight(); });
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
          strippedLeaderCards = 0; dropLeaderCards(store.edits);
          saveStore(); usageDirty = true; renderCollection(); toast(strippedLeaderCards ? `Edits imported (left out ${strippedLeaderCards} competitive-only leader card${strippedLeaderCards > 1 ? 's' : ''})` : 'Edits imported');
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
