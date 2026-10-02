/*
 * VFM Dashboard (unlisted). Shows every item on the Virtual Flea Market
 * geeklists the VFM Discord bot watches, with box art, BGG rating/rank and the
 * asking price vs. GeekMarket's 12-month median. The bot pushes snapshots to
 * the DFWGV Worker; this page reads them with the private key from its link
 * (vfm-dashboard.html#k=KEY). The key is kept in this browser's localStorage
 * and removed from the address bar.
 */
(() => {
  'use strict';

  const params = new URLSearchParams(location.search);
  const WORKER = params.get('worker') || 'https://dfwgv-bgg-proxy.joemsprague.workers.dev';
  const KEY_STORE = 'vfmDashKey';
  const PREFS_STORE = 'vfmDashPrefs.v1';
  const REFRESH_MS = 2 * 60 * 1000;
  const PAGE = 120;
  const STATUS_LABEL = { 0: 'Available', 1: 'Likely claimed', 2: 'Sold' };

  const $ = (id) => document.getElementById(id);
  const store = {
    get(k) { try { return localStorage.getItem(k); } catch { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch { /* private mode */ } },
    del(k) { try { localStorage.removeItem(k); } catch { /* ignore */ } },
  };

  let key = null;
  let lists = [];
  let snapshot = null;
  let shown = PAGE;
  let refreshTimer = null;
  const prefs = Object.assign(
    { list: null, status: '0', sort: 'deal', search: '', max: '', dealsOnly: false, hideAuctions: false },
    JSON.parse(store.get(PREFS_STORE) || '{}')
  );
  const savePrefs = () => store.set(PREFS_STORE, JSON.stringify(prefs));

  // ---- helpers ----
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const money = (v) => (v == null ? '' : '$' + (Number.isInteger(v) ? v.toLocaleString() : v.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })));
  const ago = (ts) => {
    const s = Math.max(0, Date.now() / 1000 - ts);
    if (s < 90) return 'just now';
    if (s < 3600) return `${Math.round(s / 60)} min ago`;
    if (s < 86400 * 2) return `${Math.round(s / 3600)} h ago`;
    return `${Math.round(s / 86400)} days ago`;
  };
  const safeImg = (url) => (typeof url === 'string' && /^https:\/\/cf\.geekdo-images\.com\//.test(url) ? url : null);
  const verdict = (d) => {
    if (d == null) return null;
    if (d <= -25) return { cls: 'great', label: '🔥 Great deal' };
    if (d <= -10) return { cls: 'good', label: 'Good price' };
    if (d < 10) return { cls: 'fair', label: 'Fair price' };
    return { cls: 'above', label: 'Above market' };
  };
  const savings = (it) => (it.m && it.p != null && !it.a ? it.m[0] - it.p : null);

  async function api(path) {
    const res = await fetch(WORKER + path, { headers: { Authorization: `Bearer ${key}` }, cache: 'no-store' });
    if (res.status === 401) throw Object.assign(new Error('That key was not accepted.'), { auth: true });
    if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error || `Request failed (${res.status})`);
    return res.json();
  }

  // ---- key handling ----
  function readKey() {
    const fromHash = new URLSearchParams(location.hash.slice(1)).get('k');
    if (fromHash) {
      store.set(KEY_STORE, fromHash);
      history.replaceState(null, '', location.pathname + location.search);
      return fromHash;
    }
    return store.get(KEY_STORE);
  }

  function showGate(message) {
    $('vfm-app').hidden = true;
    $('vfm-gate').hidden = false;
    $('vfm-gate-msg').textContent = message || '';
  }

  async function start(withKey) {
    key = withKey;
    try {
      const index = await api('/api/vfm-dash');
      lists = index.lists || [];
    } catch (e) {
      if (e.auth) store.del(KEY_STORE);
      showGate(e.message);
      return;
    }
    $('vfm-gate').hidden = true;
    $('vfm-app').hidden = false;
    if (!lists.length) {
      $('vfm-title').textContent = 'VFM Dashboard';
      $('vfm-count').textContent = 'No geeklists yet. The bot sends its first update a few minutes after it starts.';
      return;
    }
    const pick = $('vfm-list');
    pick.innerHTML = lists.map((l) => `<option value="${esc(l.id)}">${esc(l.title)}</option>`).join('');
    $('vfm-list-pick').hidden = lists.length < 2;
    if (!lists.some((l) => l.id === prefs.list)) prefs.list = lists[0].id;
    pick.value = prefs.list;
    await loadList();
    clearInterval(refreshTimer);
    refreshTimer = setInterval(() => { if (!document.hidden) loadList(true); }, REFRESH_MS);
  }

  async function loadList(quiet) {
    try {
      snapshot = await api(`/api/vfm-dash?list=${encodeURIComponent(prefs.list)}`);
    } catch (e) {
      if (e.auth) { store.del(KEY_STORE); showGate(e.message); return; }
      if (!quiet) $('vfm-count').textContent = e.message;
      return;
    }
    if (!quiet) shown = PAGE;
    render();
  }

  // ---- filtering / sorting ----
  function filtered() {
    const q = prefs.search.trim().toLowerCase();
    const max = prefs.max === '' ? null : Number(prefs.max);
    const items = snapshot.items.filter((it) => {
      if (prefs.status !== 'all' && String(it.st) !== prefs.status) return false;
      if (prefs.hideAuctions && it.a) return false;
      if (prefs.dealsOnly && !(it.d != null && it.d <= -10)) return false;
      if (max != null && !(it.p != null && it.p <= max)) return false;
      if (q && !(`${it.n} ${it.s}`.toLowerCase().includes(q))) return false;
      return true;
    });
    // Numeric sort with missing values always last, in either direction.
    const by = (f, desc) => (a, b) => {
      const x = f(a), y = f(b);
      if (x == null || y == null) return (x == null) - (y == null);
      return desc ? y - x : x - y;
    };
    const sorters = {
      deal: by((i) => i.d),
      savings: by(savings, true),
      'price-asc': by((i) => i.p),
      'price-desc': by((i) => i.p, true),
      rating: by((i) => i.r, true),
      rank: by((i) => i.rk),
      newest: by((i) => i.t, true),
      oldest: by((i) => i.t),
      name: (a, b) => a.n.localeCompare(b.n),
    };
    return items.sort(sorters[prefs.sort] || sorters.deal);
  }

  // ---- rendering ----
  function gauge(it) {
    if (!it.m || it.p == null || it.a) return '';
    const [median, low, high] = it.m;
    const lo = Math.min(low, it.p), hi = Math.max(high, it.p);
    if (hi <= lo) return '';
    const pos = (v) => ((v - lo) / (hi - lo)) * 100;
    return `<div class="vfm-gauge" title="Typical range ${money(Math.round(low))}–${money(Math.round(high))}, median ${money(median)}">
      <span class="range" style="left:${pos(low)}%;width:${pos(high) - pos(low)}%"></span>
      <span class="median" style="left:${pos(median)}%"></span>
      <span class="ask" style="left:${pos(it.p)}%"></span></div>`;
  }

  function card(it) {
    const v = verdict(it.d);
    const img = safeImg(it.img);
    const itemUrl = `https://boardgamegeek.com/geeklist/${encodeURIComponent(snapshot.id)}/item/${encodeURIComponent(it.i)}#item${encodeURIComponent(it.i)}`;
    const badges = [];
    if (it.st !== 0) badges.push(`<span class="vfm-badge status-${it.st}" title="${esc(it.sn || '')}">${STATUS_LABEL[it.st]}</span>`);
    if (it.a) badges.push('<span class="vfm-badge auction">Auction</span>');
    if (v) badges.push(`<span class="vfm-badge ${v.cls}">${v.label} · ${Math.abs(Math.round(it.d))}% ${it.d < 0 ? 'below' : 'above'}</span>`);
    const market = it.m
      ? `<p class="vfm-meta">GeekMarket median <b>${money(it.m[0])}</b> · typical ${money(Math.round(it.m[1]))}–${money(Math.round(it.m[2]))} · ${it.m[3]} sales</p>${gauge(it)}`
      : '';
    const rating = it.r ? `★ ${it.r.toFixed(2)}${it.rc ? ` (${it.rc.toLocaleString()})` : ''}` : '';
    const rank = it.rk ? `#${it.rk.toLocaleString()} BGG` : '';
    return `<article class="vfm-card${it.st === 2 ? ' sold' : it.st === 1 ? ' claimed' : ''}">
      ${img ? `<img class="vfm-art" src="${esc(img)}" alt="" loading="lazy" referrerpolicy="no-referrer">` : '<div class="vfm-art none">?</div>'}
      <div>
        <p class="vfm-name"><a href="${esc(itemUrl)}" target="_blank" rel="noopener">${esc(it.n)}</a></p>
        <p class="vfm-meta">${esc(it.s)} · posted ${ago(it.t)}${it.g ? ` · <a href="https://boardgamegeek.com/boardgame/${encodeURIComponent(it.g)}" target="_blank" rel="noopener">BGG page</a>` : ''}</p>
        <div class="vfm-price-row"><span class="vfm-price">${esc(it.pt)}</span>${it.op ? `<span class="vfm-old">${esc(it.op)}</span>` : ''}${badges.join('')}</div>
        ${market}
        ${rating || rank ? `<p class="vfm-meta">${[rating, rank].filter(Boolean).join(' · ')}</p>` : ''}
      </div>
    </article>`;
  }

  function render() {
    if (!snapshot) return;
    $('vfm-title').textContent = snapshot.title;
    $('vfm-list-link').href = snapshot.url;
    $('vfm-updated').textContent = snapshot.updated ? `updated ${ago(snapshot.updated)}` : '';
    const all = snapshot.items;
    const count = (f) => all.filter(f).length;
    const stats = [
      [count((i) => i.st === 0), 'available'],
      [count((i) => i.st === 0 && i.d != null && i.d <= -25), 'great deals'],
      [count((i) => i.st === 0 && i.d != null && i.d > -25 && i.d <= -10), 'good prices'],
      [count((i) => i.st === 1), 'likely claimed'],
      [count((i) => i.st === 2), 'sold'],
      [all.length, 'items total'],
    ];
    $('vfm-stats').innerHTML = stats.map(([n, l]) => `<div class="vfm-stat"><b>${n.toLocaleString()}</b><span>${l}</span></div>`).join('');

    const items = filtered();
    $('vfm-count').textContent = `${items.length.toLocaleString()} item${items.length === 1 ? '' : 's'} match`;
    $('vfm-grid').innerHTML = items.slice(0, shown).map(card).join('');
    $('vfm-more').hidden = items.length <= shown;
  }

  // ---- controls ----
  function syncControls() {
    $('vfm-search').value = prefs.search;
    $('vfm-sort').value = prefs.sort;
    $('vfm-max').value = prefs.max;
    $('vfm-deals-only').checked = prefs.dealsOnly;
    $('vfm-hide-auctions').checked = prefs.hideAuctions;
    document.querySelectorAll('#vfm-status button').forEach((b) => b.classList.toggle('on', b.dataset.status === prefs.status));
  }
  const update = (change) => { Object.assign(prefs, change); savePrefs(); shown = PAGE; syncControls(); render(); };

  let searchTimer;
  $('vfm-search').addEventListener('input', (e) => { clearTimeout(searchTimer); searchTimer = setTimeout(() => update({ search: e.target.value }), 150); });
  $('vfm-sort').addEventListener('change', (e) => update({ sort: e.target.value }));
  $('vfm-max').addEventListener('input', (e) => update({ max: e.target.value }));
  $('vfm-deals-only').addEventListener('change', (e) => update({ dealsOnly: e.target.checked }));
  $('vfm-hide-auctions').addEventListener('change', (e) => update({ hideAuctions: e.target.checked }));
  $('vfm-status').addEventListener('click', (e) => { const b = e.target.closest('button'); if (b) update({ status: b.dataset.status }); });
  $('vfm-more').addEventListener('click', () => { shown += PAGE; render(); });
  $('vfm-list').addEventListener('change', (e) => { prefs.list = e.target.value; savePrefs(); loadList(); });
  $('vfm-key-btn').addEventListener('click', () => { const k = $('vfm-key').value.trim(); if (k) { store.set(KEY_STORE, k); start(k); } });
  $('vfm-key').addEventListener('keydown', (e) => { if (e.key === 'Enter') $('vfm-key-btn').click(); });
  document.addEventListener('visibilitychange', () => { if (!document.hidden && key && snapshot) loadList(true); });

  syncControls();
  const initial = readKey();
  if (initial) start(initial); else showGate();
})();
