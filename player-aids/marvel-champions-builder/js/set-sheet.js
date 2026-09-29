/* =============================================================================
   Marvel Champions — encounter-set sheet (DFW Gaming Village)
   Shared by the builder and the Rules & Setup page: MCSetSheet.open(setId, opts)
   shows a set's description, what it adds at a glance, where it's used, and every
   card (image, stats, boost, text, flip side). Card data (window.MCS, mc-sets.js)
   loads the first time a sheet opens; set names and art come from window.MCE.
   opts.action = { label, onClick } adds a button (e.g. add/remove the set).
   ============================================================================= */
(function () {
  'use strict';
  const me = document.currentScript && document.currentScript.src;
  const BASE = me ? me.replace(/set-sheet\.js(\?.*)?$/, '') : 'js/';
  const VER = (me && (me.match(/[?&]v=([^&#]+)/) || [])[1]) || '1';
  const ROOT = BASE.replace(/js\/$/, '');            // the builder folder (set art lives in images/sets)
  const IMG = 'https://marvelcdb.com/bundles/cards/';
  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));
  const TYPE = {
    villain: ['Villain', 'Villain stages'], leader: ['Leader', 'Leader stages'], main_scheme: ['Main scheme', 'Main schemes'],
    minion: ['Minion', 'Minions'], side_scheme: ['Side scheme', 'Side schemes'], treachery: ['Treachery', 'Treacheries'],
    attachment: ['Attachment', 'Attachments'], environment: ['Environment', 'Environments'], obligation: ['Obligation', 'Obligations'],
    ally: ['Ally', 'Allies'], upgrade: ['Upgrade', 'Upgrades'], support: ['Support', 'Supports'], event: ['Event', 'Events'],
    resource: ['Resource', 'Resources'], player_side_scheme: ['Player side scheme', 'Player side schemes'], evidence: ['Evidence', 'Evidence'],
  };
  const ORDER = ['villain', 'leader', 'main_scheme', 'minion', 'side_scheme', 'treachery', 'attachment', 'environment', 'obligation', 'evidence', 'ally', 'upgrade', 'support', 'event', 'resource', 'player_side_scheme'];
  // not shuffled into the encounter deck (separate decks, or player cards)
  const NOT_ENC = ['villain', 'leader', 'main_scheme', 'ally', 'upgrade', 'support', 'event', 'resource', 'player_side_scheme'];
  const KEYWORDS = ['Guard', 'Patrol', 'Quickstrike', 'Retaliate', 'Surge', 'Toughness', 'Villainous', 'Hinder', 'Incite', 'Peril', 'Teamwork', 'Ranged', 'Piercing', 'Overkill', 'Steady', 'Stalwart', 'Permanent', 'Victory', 'Assault'];
  const ICONS = ['Acceleration', 'Crisis', 'Hazard', 'Amplify'];
  const LAND = ['main_scheme', 'side_scheme', 'player_side_scheme'];
  const imgUrl = i => (!i ? '' : /^https?:/.test(i) ? i : IMG + i);

  let loading = null;
  function load() {
    if (window.MCS) return Promise.resolve(window.MCS);
    if (!loading) {
      loading = new Promise((resolve, reject) => {
        const s = document.createElement('script');
        s.src = BASE + 'mc-sets.js?v=' + VER;
        s.onload = () => (window.MCS ? resolve(window.MCS) : reject(new Error('no data')));
        s.onerror = () => { loading = null; reject(new Error('load failed')); };
        document.head.appendChild(s);
      });
    }
    return loading;
  }

  let sheet = null, scrim = null, lastFocus = null;
  function close() {
    if (!sheet) return;
    sheet.hidden = true; sheet.classList.remove('set-sheet');
    if (scrim) { scrim.remove(); scrim = null; }
    const lb = document.querySelector('.ss-light'); if (lb) lb.remove();
    document.removeEventListener('keydown', onKey);
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }
  function onKey(e) {
    if (e.key !== 'Escape') return;
    const lb = document.querySelector('.ss-light');
    if (lb) lb.remove(); else close();
  }
  function lightbox(src, alt) {
    const d = document.createElement('div');
    d.className = 'ss-light'; d.setAttribute('role', 'dialog'); d.setAttribute('aria-label', alt || 'Card');
    d.innerHTML = `<img src="${esc(src)}" alt="${esc(alt || '')}"><span class="ss-light-x">Tap anywhere to close</span>`;
    d.addEventListener('click', () => d.remove());
    document.body.appendChild(d);
  }

  function scenariosUsing(id) {
    const ENC = window.MCE;
    if (!ENC) return { recs: [], reqs: [] };
    const all = ENC.scenarios.concat(ENC.interchangeableMainSchemes || []);
    return {
      recs: all.filter(x => (x.recommendedModulars || []).includes(id)).map(x => x.name),
      reqs: all.filter(x => (x.requiredModulars || []).includes(id) || ((x.encounterSets || []).includes(id) && !(x.recommendedModulars || []).includes(id))).map(x => x.name),
    };
  }
  function glance(cards) {
    const n = {}, kw = new Set(), icons = new Set();
    for (const c of cards) {
      if (!NOT_ENC.includes(c.t)) n[c.t] = (n[c.t] || 0) + (c.q || 1);
      const text = String(c.x || '').replace(/<[^>]+>/g, ' ');
      for (const k of KEYWORDS) if (new RegExp('(^|[.;:)]\\s*|\\s)' + k + '\\b').test(text) && !new RegExp('(gains?|loses?|with|without|no) ' + k, 'i').test(text)) kw.add(k);
      for (const k of ICONS) if ((c.s || '').includes(k)) icons.add(k);
    }
    const counts = ORDER.filter(t => n[t]).map(t => `${n[t]} ${TYPE[t][n[t] === 1 ? 0 : 1].toLowerCase()}`);
    return { counts, kw: [...kw], icons: [...icons] };
  }
  function cardHtml(c) {
    const img = imgUrl(c.i), land = LAND.includes(c.t);
    const boost = c.b != null || c.bs ? `<span class="ss-boost" title="Boost icons${c.bs ? ' and a Boost ability' : ''}">Boost ${c.bs && !c.b ? '' : c.b || 0}${c.bs ? '★' : ''}</span>` : '';
    const back = c.bk ? `<div class="ss-back"><b>Flip side — ${esc(c.bk.n)}</b>${c.bk.t && TYPE[c.bk.t] ? ` <span class="ss-type">${TYPE[c.bk.t][0]}</span>` : ''}${c.bk.s ? `<div class="ss-st">${esc(c.bk.s)}</div>` : ''}${c.bk.x ? `<div class="ss-x">${c.bk.x}</div>` : ''}</div>` : '';
    return `<div class="ss-card${land ? ' land' : ''}">
      ${img ? `<button type="button" class="ss-thumb" data-full="${esc(img)}" aria-label="Enlarge ${esc(c.n)}"><img src="${esc(img)}" alt="" loading="lazy" onerror="this.closest('.ss-thumb').remove()"></button>` : '<span></span>'}
      <div class="ss-body">
        <div class="ss-cn"><b>${esc(c.n)}</b>${(c.q || 1) > 1 ? ` <span class="ss-q">×${c.q}</span>` : ''}</div>
        <div class="ss-type">${esc(TYPE[c.t] ? TYPE[c.t][0] : c.t || '')}${c.tr ? ' · ' + esc(c.tr) : ''}</div>${c.fr ? `<div class="ss-type">Printed on the back of ${esc(c.fr)}</div>` : ''}
        ${c.s || boost ? `<div class="ss-st">${esc(c.s || '')}${c.s && boost ? ' · ' : ''}${boost}</div>` : ''}
        ${c.x ? `<div class="ss-x">${c.x}</div>` : ''}${back}
      </div></div>`;
  }
  function cardsHtml(data) {
    if (data.cards && data.cards.length) {
      const groups = {};
      for (const c of data.cards) (groups[c.t] = groups[c.t] || []).push(c);
      const keys = ORDER.filter(t => groups[t]).concat(Object.keys(groups).filter(t => !ORDER.includes(t)));
      return keys.map(t => {
        const n = groups[t].reduce((s, c) => s + (c.q || 1), 0);
        return `<div class="ss-group"><h5>${esc(TYPE[t] ? TYPE[t][n === 1 ? 0 : 1] : t)} <small>${n}</small></h5>${groups[t].map(cardHtml).join('')}</div>`;
      }).join('');
    }
    if (data.gallery && data.gallery.length) {
      return `<div class="ss-gallery">${data.gallery.map(u => `<button type="button" class="ss-thumb" data-full="${esc(u)}" aria-label="Enlarge card"><img src="${esc(u)}" alt="" loading="lazy"></button>`).join('')}</div>`;
    }
    return '<p class="muted">No card list is available for this set.</p>';
  }

  function open(id, opts) {
    opts = opts || {};
    const ENC = window.MCE || {};
    const info = (ENC.sets && ENC.sets[id]) || { name: id };
    lastFocus = document.activeElement;
    sheet = document.getElementById('sheet');
    if (!sheet) { sheet = document.createElement('div'); sheet.id = 'sheet'; sheet.className = 'sheet'; document.body.appendChild(sheet); }
    sheet.classList.add('set-sheet');
    sheet.setAttribute('role', 'dialog'); sheet.setAttribute('aria-modal', 'true'); sheet.setAttribute('aria-label', info.name + ' — encounter set');
    const product = (ENC.products && ENC.products[info.product]) || info.product || '';
    const n = info.enc != null ? info.enc : info.cards;
    const { recs, reqs } = scenariosUsing(id);
    const kv = [];
    if (info.use) kv.push(['Used', esc(info.use)]);
    if (recs.length) kv.push(['Recommended for', esc(recs.join(', '))]);
    if (reqs.length) kv.push([info.kind === 'modular' ? 'Always part of' : 'Part of', esc(reqs.join(', '))]);
    if (info.restrictions) kv.push(['Note', esc(info.restrictions)]);
    const head = `<button class="iconbtn close" aria-label="Close">✕</button><div class="sh-in">
      <div class="ss-head">${info.img ? `<div class="ss-art"><img src="${esc(ROOT + info.img)}" alt=""></div>` : ''}
        <div><h3 class="ss-name">${esc(info.name)}</h3>
        <div class="ss-meta">${esc(product)}${n ? ` · ${info.approx ? '≈' : ''}${n} encounter card${n === 1 ? '' : 's'}` : ''}${info.copies > 1 ? ` · ${info.copies} copies owned, one per team` : ''}${info.difficulty ? ` · <span class="ss-diff" title="Official difficulty">Difficulty ${esc(info.difficulty)}</span>` : ''}</div></div></div>
      <div id="ssDesc"></div>
      ${kv.length ? `<dl class="kv ss-kv">${kv.map(([k, v]) => `<dt>${k}</dt><dd>${v}</dd>`).join('')}</dl>` : ''}
      ${opts.action ? `<div class="ss-actions"><button type="button" class="btn small ${opts.action.cls || ''}" id="ssAction">${esc(opts.action.label)}</button></div>` : ''}
      <div id="ssCards"><p class="muted">Loading the cards…</p></div></div>`;
    sheet.innerHTML = head;
    sheet.hidden = false; sheet.scrollTop = 0;
    if (!scrim) { scrim = document.createElement('div'); scrim.className = 'scrim'; scrim.addEventListener('click', close); document.body.appendChild(scrim); }
    sheet.querySelector('.close').addEventListener('click', close);
    sheet.querySelector('.close').focus();
    document.addEventListener('keydown', onKey);
    const act = sheet.querySelector('#ssAction');
    if (act) act.addEventListener('click', () => { close(); opts.action.onClick(); });
    load().then(M => {
      if (sheet.hidden) return;
      const data = M[id] || {};
      const g = glance(data.cards || []);
      const chips = [].concat(g.counts.map(x => `<span class="ss-chip">${esc(x)}</span>`),
        g.kw.map(k => `<span class="ss-chip kw" title="Keyword">${esc(k)}</span>`),
        g.icons.map(k => `<span class="ss-chip ic" title="Scheme icon">${esc(k)}</span>`));
      sheet.querySelector('#ssDesc').innerHTML = (data.desc ? `<p class="ss-desc">${esc(data.desc)}</p>` : '') +
        (chips.length ? `<div class="ss-chips">${chips.join('')}</div>` : '') +
        (data.approx ? '<p class="ss-note">Fear No Evil isn\'t on MarvelCDB yet: these cards come from the Hall of Heroes scans.</p>' : '');
      sheet.querySelector('#ssCards').innerHTML = `<h4 class="ss-h">What's in it</h4>${cardsHtml(data)}`;
      sheet.querySelectorAll('.ss-thumb').forEach(b => b.addEventListener('click', () => lightbox(b.dataset.full, b.getAttribute('aria-label'))));
    }).catch(() => { if (!sheet.hidden) sheet.querySelector('#ssCards').innerHTML = '<p class="muted">The card list couldn\'t be loaded. Check the connection and try again.</p>'; });
  }

  window.MCSetSheet = { open, close, load };
})();
