/*
 * VFM Dashboard (unlisted). Every item on the Virtual Flea Market geeklists the
 * VFM Discord bot watches: box art, BGG game data, condition, status and the
 * asking price vs. GeekMarket's 12-month median, plus insights and sellers.
 * The bot pushes snapshots to the DFWGV Worker; this page reads them with the
 * private key from its link (vfm-dashboard.html#k=KEY). The key is kept in
 * this browser's localStorage and removed from the address bar.
 */
(() => {
  'use strict';

  const params = new URLSearchParams(location.search);
  const WORKER = params.get('worker') || 'https://dfwgv-bgg-proxy.joemsprague.workers.dev';
  const KEY_STORE = 'vfmDashKey';
  const PREFS_STORE = 'vfmDashPrefs.v2';
  const VISIT_STORE = 'vfmDashLastVisit.v1';
  const REFRESH_MS = 2 * 60 * 1000;
  const PAGE = 60;
  const STATUS = { 0: 'Available', 1: 'Likely claimed', 2: 'Sold' };
  const TIERS = [
    { k: 'great', label: 'Great deal', hint: '25%+ below', color: '#f5c542' },
    { k: 'good', label: 'Good price', hint: '10–25% below', color: '#34d399' },
    { k: 'fair', label: 'Fair price', hint: 'within 10%', color: '#9aa1ad' },
    { k: 'above', label: 'Above market', hint: '10%+ above', color: '#f87171' },
    { k: 'auction', label: 'Auction', hint: 'starting bid', color: '#7aa7ff' },
    { k: 'none', label: 'No market data', hint: '', color: '#4b5262' },
  ];
  const TIER = Object.fromEntries(TIERS.map((t) => [t.k, t]));
  const CONDITIONS = ['New', 'Like new', 'Very good', 'Good', 'Played'];
  const DEFAULT_PREFS = {
    list: null, tab: 'listings', view: 'grid', sort: 'deal', search: '', seller: '',
    status: '0', deal: [], min: '', max: '', rating: 0, players: '', weight: [], cond: [],
    newOnly: false, noExp: false, noAuction: false, extrasOnly: false,
  };

  const $ = (id) => document.getElementById(id);
  const store = {
    get(k) { try { return localStorage.getItem(k); } catch { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch { /* private mode */ } },
    del(k) { try { localStorage.removeItem(k); } catch { /* ignore */ } },
  };
  const loadJson = (k, fallback) => { try { return JSON.parse(store.get(k)) ?? fallback; } catch { return fallback; } };

  const prefs = { ...DEFAULT_PREFS, ...loadJson(PREFS_STORE, {}) };
  const savePrefs = () => store.set(PREFS_STORE, JSON.stringify(prefs));
  let key = null;
  let lists = [];
  let snap = null;
  let items = [];
  let shown = PAGE;
  let lastVisit = null;
  let refreshTimer = null;

  // ---------- formatting ----------
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const money = (v, dec) => {
    if (v == null || Number.isNaN(v)) return '—';
    const d = dec ?? (Number.isInteger(v) ? 0 : 2);
    return '$' + v.toLocaleString(undefined, { minimumFractionDigits: d, maximumFractionDigits: d });
  };
  const compactMoney = (v) => (v >= 10000 ? '$' + (v / 1000).toFixed(v >= 100000 ? 0 : 1) + 'k' : money(Math.round(v), 0));
  const pct = (v) => (v == null ? '—' : `${v > 0 ? '+' : ''}${Math.round(v)}%`);
  const nowS = () => Date.now() / 1000;
  const ago = (ts) => {
    const s = Math.max(0, nowS() - ts);
    if (s < 60) return 'just now';
    if (s < 3600) return `${Math.round(s / 60)}m ago`;
    if (s < 86400) return `${Math.round(s / 3600)}h ago`;
    return `${Math.round(s / 86400)}d ago`;
  };
  const duration = (s) => {
    if (s == null) return '—';
    if (s < 3600) return `${Math.max(1, Math.round(s / 60))}m`;
    if (s < 86400) return `${(s / 3600).toFixed(s < 36000 ? 1 : 0)}h`;
    return `${(s / 86400).toFixed(1)}d`;
  };
  const dateTime = (ts) => new Date(ts * 1000).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
  const median = (arr) => {
    if (!arr.length) return null;
    const a = [...arr].sort((x, y) => x - y), m = a.length >> 1;
    return a.length % 2 ? a[m] : (a[m - 1] + a[m]) / 2;
  };
  const safeImg = (url) => (typeof url === 'string' && /^https:\/\/cf\.geekdo-images\.com\//.test(url) ? url : null);
  const icon = (name) => ({
    users: '<svg class="i" viewBox="0 0 24 24"><circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0M16 4.5a3.5 3.5 0 0 1 0 7M21.5 20a6.5 6.5 0 0 0-4-6"/></svg>',
    clock: '<svg class="i" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
    weight: '<svg class="i" viewBox="0 0 24 24"><path d="M6 8h12l2 12H4L6 8zM9 8a3 3 0 0 1 6 0"/></svg>',
    chat: '<svg class="i" viewBox="0 0 24 24"><path d="M4 5h16v11H9l-5 4V5z"/></svg>',
    user: '<svg class="i" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></svg>',
    star: '<svg class="i" viewBox="0 0 24 24"><path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z"/></svg>',
    ext: '<svg class="i" viewBox="0 0 24 24"><path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/></svg>',
  }[name]);

  // ---------- data ----------
  const tierOf = (it) => {
    if (it.a) return 'auction';
    if (it.d == null) return 'none';
    if (it.d <= -25) return 'great';
    if (it.d <= -10) return 'good';
    if (it.d < 10) return 'fair';
    return 'above';
  };
  // A rating from a handful of votes (unreleased games) isn't meaningful for ranking.
  const MIN_VOTES = 50;
  const trustedRating = (it) => (it.r && (it.rc || 0) >= MIN_VOTES ? it.r : null);
  // Market stats come from the last 12 months, or the last 3 years when a game
  // had fewer than 3 sales in the past year (m[4] === 36).
  const isOlder = (it) => (it.mx ? it.mx[5] === 36 : !!(it.m && it.m[4] === 36));
  // What the asking price is compared with: the GeekMarket value of all parts
  // when the listing includes extras (it.mx), otherwise the game's own median.
  const reference = (it) => (it.mx ? { median: it.mx[0], low: it.mx[1], high: it.mx[2] } : it.m ? { median: it.m[0], low: it.m[1], high: it.m[2] } : null);
  const extrasCount = (it) => (it.xt ? it.xt.length : 0);
  const windowLabel = (it) => (isOlder(it) ? '3 yr' : '12 mo');
  const weightClass = (w) => (w == null ? null : w < 2 ? 'light' : w < 3.5 ? 'medium' : 'heavy');
  function prepare(raw) {
    return raw.map((it) => ({
      ...it,
      _tier: tierOf(it),
      _sav: reference(it) && it.p != null && !it.a ? reference(it).median - it.p : null,
      _value: trustedRating(it) && it.d != null ? trustedRating(it) * (1 - it.d / 100) : null,
      _tr: trustedRating(it),
      _lc: `${it.n} ${it.s}`.toLowerCase(),
      _new: lastVisit != null && it.t > lastVisit,
      _wc: weightClass(it.w),
    }));
  }

  async function api(path) {
    const res = await fetch(WORKER + path, { headers: { Authorization: `Bearer ${key}` }, cache: 'no-store' });
    if (res.status === 401) throw Object.assign(new Error('That key was not accepted.'), { auth: true });
    if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error || `Request failed (${res.status})`);
    return res.json();
  }

  // ---------- key / gate ----------
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
    $('app').hidden = true;
    $('gate').hidden = false;
    $('gate-msg').textContent = message || '';
  }

  async function start(withKey) {
    key = withKey;
    try {
      lists = (await api('/api/vfm-dash')).lists || [];
    } catch (e) {
      if (e.auth) store.del(KEY_STORE);
      showGate(e.message);
      return;
    }
    $('gate').hidden = true;
    $('app').hidden = false;
    if (!lists.length) {
      $('list-title').textContent = 'VFM Dashboard';
      $('results').innerHTML = '<p class="empty-note">No geeklists yet. The bot sends its first update a few minutes after it starts.</p>';
      return;
    }
    $('list-select').innerHTML = lists.map((l) => `<option value="${esc(l.id)}">${esc(l.title)}</option>`).join('');
    document.querySelector('.title-wrap').classList.toggle('multi', lists.length > 1);
    if (!lists.some((l) => l.id === prefs.list)) prefs.list = lists[0].id;
    $('list-select').value = prefs.list;
    await loadList();
    clearInterval(refreshTimer);
    refreshTimer = setInterval(() => { if (!document.hidden) loadList(true); }, REFRESH_MS);
  }

  async function loadList(quiet) {
    try {
      snap = await api(`/api/vfm-dash?list=${encodeURIComponent(prefs.list)}`);
    } catch (e) {
      if (e.auth) { store.del(KEY_STORE); showGate(e.message); return; }
      if (!quiet) $('results').innerHTML = `<p class="empty-note">${esc(e.message)}</p>`;
      return;
    }
    if (lastVisit === null) lastVisit = loadJson(VISIT_STORE, {})[prefs.list] ?? null;
    items = prepare(snap.items || []);
    if (!quiet) shown = PAGE;
    renderAll();
  }

  function rememberVisit() {
    if (!prefs.list) return;
    const visits = loadJson(VISIT_STORE, {});
    visits[prefs.list] = Math.floor(nowS());
    store.set(VISIT_STORE, JSON.stringify(visits));
  }

  // ---------- filtering ----------
  function matches(it, skip) {
    if (skip !== 'status' && prefs.status !== 'all' && String(it.st) !== prefs.status) return false;
    if (skip !== 'deal' && prefs.deal.length && !prefs.deal.includes(it._tier)) return false;
    if (prefs.search && !it._lc.includes(prefs.search.toLowerCase())) return false;
    if (prefs.seller && it.s !== prefs.seller) return false;
    const min = prefs.min === '' ? null : Number(prefs.min), max = prefs.max === '' ? null : Number(prefs.max);
    if ((min != null || max != null) && it.p == null) return false;
    if (min != null && it.p < min) return false;
    if (max != null && it.p > max) return false;
    if (prefs.rating > 0 && !(it._tr >= prefs.rating)) return false;
    if (prefs.players) {
      const n = Number(prefs.players);
      if (!it.pm || !(it.pm[0] <= n && (n >= 6 ? it.pm[1] >= 6 : it.pm[1] >= n))) return false;
    }
    if (prefs.weight.length && !prefs.weight.includes(it._wc)) return false;
    if (prefs.cond.length && !prefs.cond.includes(it.c)) return false;
    if (prefs.newOnly && !it._new) return false;
    if (prefs.noExp && it.x) return false;
    if (prefs.noAuction && it.a) return false;
    if (prefs.extrasOnly && !extrasCount(it)) return false;
    return true;
  }
  const by = (f, desc) => (a, b) => {
    const x = f(a), y = f(b);
    if (x == null || y == null) return (x == null) - (y == null);
    return desc ? y - x : x - y;
  };
  const SORTS = {
    deal: by((i) => i.d), savings: by((i) => i._sav, true), value: by((i) => i._value, true),
    'price-asc': by((i) => i.p), 'price-desc': by((i) => i.p, true),
    rating: by((i) => i._tr, true), rank: by((i) => i.rk), weight: by((i) => i.w, true),
    comments: by((i) => i.cc || null, true), newest: by((i) => i.t, true), oldest: by((i) => i.t),
    name: (a, b) => a.n.localeCompare(b.n),
  };
  const filtered = () => items.filter((it) => matches(it)).sort(SORTS[prefs.sort] || SORTS.deal);

  // ---------- render: shell ----------
  function renderAll() {
    $('list-title').textContent = snap.title;
    $('bgg-link').href = snap.url;
    renderLive();
    renderKpis();
    renderFilterControls();
    renderTabs();
    if (prefs.tab === 'listings') renderResults();
    if (prefs.tab === 'insights') renderInsights();
    if (prefs.tab === 'sellers') renderSellers();
  }

  function renderLive() {
    const el = $('live');
    const age = snap.updated ? nowS() - snap.updated : null;
    el.className = 'live ' + (age != null && age < 30 * 60 ? 'ok' : 'stale');
    $('live-text').textContent = snap.updated ? `Updated ${ago(snap.updated)}` : 'Waiting for data';
    el.title = snap.updated ? `Last update from the bot: ${dateTime(snap.updated)}` : '';
  }

  function renderKpis() {
    const avail = items.filter((i) => i.st === 0);
    const claimed = items.filter((i) => i.st === 1).length;
    const sold = items.filter((i) => i.st === 2);
    const newHour = items.filter((i) => nowS() - i.t < 3600).length;
    const value = avail.reduce((sum, i) => sum + (i.p || 0), 0);
    const great = avail.filter((i) => i._tier === 'great').length, good = avail.filter((i) => i._tier === 'good').length;
    const vsMarket = median(avail.filter((i) => i.d != null).map((i) => i.d));
    const sellTimes = sold.filter((i) => i.sa > 0 && i.sa >= i.t).map((i) => i.sa - i.t);
    const total = items.length || 1;
    const k = (label, value, sub, extra = '') => `<div class="kpi"><div class="kpi-label">${label}</div><div class="kpi-value">${value}</div><div class="kpi-sub">${sub}</div>${extra}</div>`;
    $('kpis').innerHTML = [
      k('Available', avail.length.toLocaleString(), newHour ? `<span class="up">+${newHour}</span> posted in the last hour` : `${items.length.toLocaleString()} listed in total`),
      k('Listed value', compactMoney(value), `avg ${money(avail.length ? value / avail.length : null, 0)} per item`),
      k('Sell-through', `${Math.round((sold.length / total) * 100)}%`, `${sold.length.toLocaleString()} sold · ${claimed} claimed`,
        `<div class="kpi-bar"><span style="width:${(sold.length / total) * 100}%;background:var(--sold)"></span><span style="width:${(claimed / total) * 100}%;background:var(--claimed)"></span></div>`),
      k('Deals available', (great + good).toLocaleString(), `${great} great · ${good} good`),
      k('Typical vs. market', vsMarket == null ? '—' : pct(vsMarket), 'median asking price vs. GeekMarket'),
      k('Time to sell', duration(median(sellTimes)), sellTimes.length ? `median of ${sellTimes.length} sales tracked` : 'tracked as items sell'),
    ].join('');
    $('tab-count-listings').textContent = avail.length.toLocaleString();
    $('tab-count-sellers').textContent = new Set(items.map((i) => i.s)).size.toLocaleString();
  }

  function renderTabs() {
    document.querySelectorAll('.tab').forEach((t) => t.classList.toggle('on', t.dataset.tab === prefs.tab));
    document.querySelectorAll('.panel').forEach((p) => { p.hidden = p.dataset.panel !== prefs.tab; });
  }

  // ---------- render: filters ----------
  function renderFilterControls() {
    document.querySelectorAll('#f-status button').forEach((b) => b.classList.toggle('on', b.dataset.v === prefs.status));
    const base = items.filter((it) => matches(it, 'deal'));
    $('f-deal').innerHTML = TIERS.map((t) => {
      const n = base.filter((i) => i._tier === t.k).length;
      return `<label class="check"><input type="checkbox" value="${t.k}" ${prefs.deal.includes(t.k) ? 'checked' : ''}>
        <span class="pill ${t.k === 'none' ? 'neutral' : t.k}" style="padding:1px 8px">${t.label}</span><span class="cnt">${n}</span></label>`;
    }).join('');
    $('f-min').value = prefs.min; $('f-max').value = prefs.max;
    $('f-rating').value = prefs.rating;
    $('f-rating-out').textContent = prefs.rating > 0 ? `${prefs.rating}+` : 'Any';
    $('f-players').value = prefs.players;
    document.querySelectorAll('#f-weight button').forEach((b) => b.classList.toggle('on', prefs.weight.includes(b.dataset.v)));
    document.querySelectorAll('#f-cond button').forEach((b) => b.classList.toggle('on', prefs.cond.includes(b.dataset.v)));
    $('f-new').checked = prefs.newOnly; $('f-noexp').checked = prefs.noExp; $('f-noauction').checked = prefs.noAuction; $('f-extras').checked = prefs.extrasOnly;
    $('search').value = prefs.search; $('sort').value = prefs.sort;
    document.querySelectorAll('.view-toggle button').forEach((b) => b.classList.toggle('on', b.dataset.view === prefs.view));
    renderActiveFilters();
  }

  function renderActiveFilters() {
    const chips = [];
    const add = (label, clear) => chips.push({ label, clear });
    if (prefs.seller) add(`Seller: ${prefs.seller}`, { seller: '' });
    if (prefs.search) add(`“${prefs.search}”`, { search: '' });
    prefs.deal.forEach((d) => add(TIER[d].label, { deal: prefs.deal.filter((x) => x !== d) }));
    if (prefs.min !== '' || prefs.max !== '') add(`${prefs.min !== '' ? money(Number(prefs.min)) : '$0'} – ${prefs.max !== '' ? money(Number(prefs.max)) : 'any'}`, { min: '', max: '' });
    if (prefs.rating > 0) add(`Rating ${prefs.rating}+`, { rating: 0 });
    if (prefs.players) add(`${prefs.players}${prefs.players === '6' ? '+' : ''} players`, { players: '' });
    prefs.weight.forEach((w) => add(w[0].toUpperCase() + w.slice(1), { weight: prefs.weight.filter((x) => x !== w) }));
    prefs.cond.forEach((c) => add(c, { cond: prefs.cond.filter((x) => x !== c) }));
    if (prefs.newOnly) add('New since last visit', { newOnly: false });
    if (prefs.noExp) add('No expansions', { noExp: false });
    if (prefs.noAuction) add('No auctions', { noAuction: false });
    if (prefs.extrasOnly) add('Includes extras', { extrasOnly: false });
    $('active-filters').innerHTML = chips.map((c, i) => `<span class="af">${esc(c.label)}<button type="button" data-i="${i}" aria-label="Remove filter">×</button></span>`).join('');
    $('active-filters').querySelectorAll('button').forEach((b) => b.addEventListener('click', () => update(chips[Number(b.dataset.i)].clear)));
  }

  // ---------- render: listings ----------
  function dealPill(it) {
    if (it._tier === 'none') return '';
    if (it._tier === 'auction') return '<span class="pill auction">Auction</span>';
    const t = TIER[it._tier];
    return `<span class="pill ${t.k}">${t.k === 'great' ? '🔥 ' : ''}${Math.abs(Math.round(it.d))}% ${it.d < 0 ? 'below' : 'above'}</span>`;
  }
  function gauge(it) {
    const ref = reference(it);
    if (!ref || it.p == null || it.a) return '';
    const { median: med, low, high } = ref;
    const lo = Math.min(low, it.p), hi = Math.max(high, it.p);
    if (hi <= lo) return '';
    const pos = (v) => ((v - lo) / (hi - lo)) * 100;
    return `<div class="gauge" title="Typical ${money(Math.round(low))}–${money(Math.round(high))} · ${it.mx ? 'parts value' : 'median'} ${money(med)} · asking ${money(it.p)}">
      <span class="range" style="left:${pos(low)}%;width:${Math.max(1, pos(high) - pos(low))}%"></span>
      <span class="median" style="left:${pos(med)}%"></span><span class="ask" style="left:${pos(it.p)}%"></span></div>`;
  }
  const art = (it, cls = 'art') => {
    const src = safeImg(it.img);
    return src ? `<img class="${cls}" src="${esc(src)}" alt="" loading="lazy" referrerpolicy="no-referrer">` : `<div class="${cls} empty">${esc((it.n || '?')[0])}</div>`;
  };
  const players = (it) => (it.pm ? (it.pm[0] && it.pm[1] && it.pm[0] !== it.pm[1] ? `${it.pm[0]}–${it.pm[1]}` : `${it.pm[0] || it.pm[1]}`) : null);
  function facts(it) {
    const f = [];
    if (it.r) f.push(`<span title="BGG rating">${icon('star')}${it.r.toFixed(1)}</span>`);
    if (players(it)) f.push(`<span title="Players">${icon('users')}${players(it)}</span>`);
    if (it.tm) f.push(`<span title="Play time">${icon('clock')}${it.tm}m</span>`);
    if (it.w) f.push(`<span title="Complexity (1–5)">${icon('weight')}${it.w.toFixed(1)}</span>`);
    if (it.y) f.push(`<span>${it.y}</span>`);
    return f.join('');
  }

  const olderTag = (it) => (isOlder(it) ? ' <span class="pill neutral" title="Fewer than 3 sales in the last year, so this uses the last 3 years" style="padding:0 6px;font-size:11px">3 yr</span>' : '');
  function marketRow(it) {
    if (it.mx) {
      const base = it.m ? `game ${money(it.m[0])} + ` : '';
      return `<div><div class="market-row">Parts value <b>${money(it.mx[0])}</b> · ${base}${it.mx[3]} of ${it.mx[4]} extras priced${olderTag(it)}</div>${gauge(it)}</div>`;
    }
    if (!it.m) return '';
    return `<div><div class="market-row">GeekMarket median <b>${money(it.m[0])}</b> · ${it.m[3]} sales${olderTag(it)}</div>${gauge(it)}</div>`;
  }

  function card(it) {
    const tags = [it._new ? '<span class="pill new">New</span>' : '', extrasCount(it) ? `<span class="pill extras" title="${esc(it.xt.map((x) => x[1]).join(', '))}">+${extrasCount(it)} extra${extrasCount(it) === 1 ? '' : 's'}</span>` : '',
      it.c ? `<span class="pill neutral">${esc(it.c)}</span>` : '', it.x ? '<span class="pill neutral">Expansion</span>' : ''].join('');
    return `<article class="card item${it.st === 2 ? ' is-sold' : ''}" tabindex="0" data-id="${esc(it.i)}">
      ${it.st ? `<span class="status-tag s${it.st}">${STATUS[it.st]}</span>` : ''}
      <div class="item-top">${art(it)}<div style="min-width:0">
        <p class="item-name" style="${it.st ? 'padding-right:84px' : ''}">${esc(it.n)}</p>
        <div class="facts">${facts(it)}</div></div></div>
      <div class="price-line"><span class="price">${esc(it.pt)}</span>${it.op ? `<span class="was">${esc(it.op)}</span>` : ''}${dealPill(it)}${tags}</div>
      ${marketRow(it)}
      <div class="item-foot"><span>${icon('user')}${esc(it.s)}</span><span>${it.cc ? `${icon('chat')}${it.cc} · ` : ''}${ago(it.t)}</span></div>
    </article>`;
  }

  const COLUMNS = [
    { label: 'Game', sort: 'name' }, { label: 'Price', sort: 'price-asc', num: true }, { label: 'Median', num: true },
    { label: 'vs. market', sort: 'deal', num: true }, { label: 'Rating', sort: 'rating', num: true }, { label: 'Rank', sort: 'rank', num: true },
    { label: 'Weight', sort: 'weight', num: true }, { label: 'Players' }, { label: 'Condition' }, { label: 'Seller' },
    { label: 'Posted', sort: 'newest' }, { label: 'Status' },
  ];
  function table(rows) {
    const head = COLUMNS.map((c) => `<th class="${c.num ? 'num' : ''} ${c.sort && prefs.sort.startsWith(c.sort.split('-')[0]) ? 'sorted' : ''}" ${c.sort ? `data-sort="${c.sort}"` : ''}>${c.label}</th>`).join('');
    const body = rows.map((it) => `<tr data-id="${esc(it.i)}" class="${it.st === 2 ? 'is-sold' : ''}">
      <td><div class="t-game">${art(it)}<span>${esc(it.n)}</span>${it._new ? '<span class="pill new">New</span>' : ''}</div></td>
      <td class="num"><b>${esc(it.pt)}</b></td><td class="num">${reference(it) ? money(reference(it).median) + (it.mx ? ` <span class="muted" title="Parts value: game + ${extrasCount(it)} extras">+${extrasCount(it)}</span>` : '') : '—'}</td>
      <td class="num">${it._tier === 'none' ? '—' : dealPill(it)}</td><td class="num">${it.r ? it.r.toFixed(1) : '—'}</td>
      <td class="num">${it.rk ? '#' + it.rk.toLocaleString() : '—'}</td><td class="num">${it.w ? it.w.toFixed(1) : '—'}</td>
      <td>${players(it) || '—'}</td><td>${esc(it.c || '—')}</td><td>${esc(it.s)}</td><td>${ago(it.t)}</td>
      <td>${it.st ? `<span class="status-tag s${it.st}" style="position:static">${STATUS[it.st]}</span>` : '<span class="muted">Available</span>'}</td></tr>`).join('');
    return `<div class="card table-card"><div class="table-wrap"><table class="data"><thead><tr>${head}</tr></thead><tbody>${body}</tbody></table></div></div>`;
  }

  function renderResults() {
    const rows = filtered();
    $('result-count').textContent = `${rows.length.toLocaleString()} of ${items.length.toLocaleString()} items`;
    if (!rows.length) {
      $('results').innerHTML = '<div class="card"><p class="empty-note">Nothing matches these filters.</p></div>';
      return;
    }
    const page = rows.slice(0, shown);
    $('results').innerHTML = prefs.view === 'table' ? table(page) : `<div class="grid">${page.map(card).join('')}</div>`;
    $('results').querySelectorAll('th[data-sort]').forEach((th) => th.addEventListener('click', () => {
      let s = th.dataset.sort;
      if (s === 'price-asc' && prefs.sort === 'price-asc') s = 'price-desc';
      update({ sort: s });
    }));
  }

  // ---------- render: drawer ----------
  function openDrawer(id) {
    const it = items.find((x) => x.i === id);
    if (!it) return;
    const itemUrl = `https://boardgamegeek.com/geeklist/${encodeURIComponent(snap.id)}/item/${encodeURIComponent(it.i)}#item${encodeURIComponent(it.i)}`;
    const others = items.filter((x) => x.s === it.s && x.i !== it.i).sort(SORTS.deal).slice(0, 8);
    const dl = (pairs) => `<dl class="d-grid">${pairs.filter(([, v]) => v != null && v !== '').map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join('')}</dl>`;
    const t = TIER[it._tier];
    $('drawer-body').innerHTML = `
      <div class="d-hero">${art(it)}<div style="min-width:0">
        <h2>${esc(it.n)}</h2>
        <div class="facts" style="margin-top:6px">${facts(it)}</div>
        <div class="d-links">
          <a class="btn sm" href="${esc(itemUrl)}" target="_blank" rel="noopener">Geeklist item ${icon('ext')}</a>
          ${it.g ? `<a class="btn ghost sm" href="https://boardgamegeek.com/boardgame/${encodeURIComponent(it.g)}" target="_blank" rel="noopener">BGG page ${icon('ext')}</a>` : ''}
        </div></div></div>
      <div class="d-section">
        <div class="d-status s${it.st}">● ${STATUS[it.st]}${it.sn ? ` <span class="muted" style="font-weight:400">· ${esc(it.sn)}</span>` : ''}</div>
        <div class="d-price" style="margin-top:8px"><span class="price">${esc(it.pt)}</span>${it.op ? `<span class="was">${esc(it.op)}</span>` : ''}${dealPill(it)}</div>
        ${reference(it) ? `<p class="muted" style="margin:6px 0 0;font-size:13px">${t.k === 'auction' ? 'Auction: the price is a starting bid.' : it.d != null ? `${t.label}: ${Math.abs(Math.round(it.d))}% ${it.d < 0 ? 'below' : 'above'} ${it.mx ? `the GeekMarket value of its parts (the game plus ${extrasCount(it)} extra${extrasCount(it) === 1 ? '' : 's'})` : `the GeekMarket ${isOlder(it) ? '3-year ' : ''}median`}${it._sav > 0 ? `, about ${money(Math.round(it._sav), 0)} under` : ''}.` : 'Several prices in this post, so no single comparison.'}</p>
          ${gauge(it)}
          ${it.mx
            ? `<div class="d-market"><div><b>${money(it.mx[0])}</b><span>Parts value</span></div><div><b>${it.m ? money(it.m[0]) : '—'}</b><span>Game alone</span></div><div><b>${money(Math.round(it.mx[1]), 0)}–${money(Math.round(it.mx[2]), 0)}</b><span>Typical range</span></div><div><b>${it.mx[3]}/${it.mx[4]}</b><span>Extras priced</span></div></div>`
            : `<div class="d-market"><div><b>${money(it.m[0])}</b><span>Median</span></div><div><b>${money(Math.round(it.m[1]), 0)}</b><span>Typical low</span></div><div><b>${money(Math.round(it.m[2]), 0)}</b><span>Typical high</span></div><div><b>${it.m[3]}</b><span>Sales (${windowLabel(it)})</span></div></div>`}
          ${isOlder(it) ? `<p class="muted" style="margin:8px 0 0;font-size:12px">${it.mx ? 'Some parts had fewer than 3 sales in the last year, so their values use the last 3 years.' : 'Fewer than 3 sales in the last year, so this uses the last 3 years.'} Older prices may differ from today&rsquo;s market.</p>` : ''}`
          : '<p class="muted" style="margin:6px 0 0;font-size:13px">No GeekMarket sales data for this game yet.</p>'}
      </div>
      ${extrasCount(it) ? `<div class="d-section"><h3>Included extras</h3><ul class="parts">
        ${it.xt.map(([id, name, med]) => `<li><a href="https://boardgamegeek.com/boardgame/${encodeURIComponent(id)}" target="_blank" rel="noopener">${esc(name)}</a><span>${med != null ? money(med) : '<span class="muted">no sales data</span>'}</span></li>`).join('')}
        ${it.mx ? `<li class="total"><span>Parts value${it.m ? ` (game ${money(it.m[0])} + extras)` : ''}</span><span>${money(it.mx[0])}</span></li>` : ''}</ul>
        <p class="muted" style="margin:8px 0 0;font-size:12px">Found from the items the seller linked or named in the post. Bundles often sell for a little less than their parts bought separately${it.mx && it.mx[3] < it.mx[4] ? ', and extras without sales data aren\u2019t counted, so the real value may be higher' : ''}.</p></div>` : ''}
      <div class="d-section"><h3>Listing</h3>${dl([
        ['Seller', `<a href="https://boardgamegeek.com/user/${encodeURIComponent(it.s)}" target="_blank" rel="noopener">${esc(it.s)}</a>`],
        ['Posted', `${dateTime(it.t)} (${ago(it.t)})`], ['Condition', esc(it.c || 'Not stated')],
        ['Comments', it.cc || 0], ['Type', it.a ? 'Auction' : 'Set price'],
        it.st === 2 ? ['Sold', it.sa > 0 ? `${dateTime(it.sa)} · after ${duration(it.sa - it.t)}` : 'Before tracking began'] : [null, null],
      ])}</div>
      <div class="d-section"><h3>Game</h3>${dl([
        ['BGG rating', it.r ? `${it.r.toFixed(2)} (${(it.rc || 0).toLocaleString()} ratings)` : null],
        ['BGG rank', it.rk ? '#' + it.rk.toLocaleString() : null], ['Complexity', it.w ? `${it.w.toFixed(2)} / 5` : null],
        ['Players', players(it)], ['Play time', it.tm ? `${it.tm} min` : null], ['Published', it.y],
        ['Kind', it.x ? 'Expansion' : 'Base game'],
      ])}</div>
      ${others.length ? `<div class="d-section"><h3>More from ${esc(it.s)}</h3><ul class="rank-list">${others.map((o) => `<li data-id="${esc(o.i)}">${art(o)}<div style="min-width:0"><div class="nm">${esc(o.n)}</div><div class="meta">${o.st ? STATUS[o.st] : o.d != null ? pct(o.d) + ' vs. market' : ''}</div></div><div class="val">${esc(o.pt)}</div></li>`).join('')}</ul>
        <button type="button" class="btn ghost sm" style="margin-top:10px" data-seller="${esc(it.s)}">Show all from this seller</button></div>` : ''}`;
    $('drawer').classList.add('open');
    $('drawer').setAttribute('aria-hidden', 'false');
    $('drawer-backdrop').hidden = false;
    $('drawer').scrollTop = 0;
  }
  function closeDrawer() {
    $('drawer').classList.remove('open');
    $('drawer').setAttribute('aria-hidden', 'true');
    $('drawer-backdrop').hidden = true;
  }

  // ---------- render: insights ----------
  function barList(rows, total) {
    return `<div class="bar-list">${rows.map((r) => `<div class="bar-row"><span>${esc(r.label)}</span><div class="track"><div class="fill" style="width:${total ? (r.n / total) * 100 : 0}%;background:${r.color}"></div></div><span class="n">${r.n.toLocaleString()}</span></div>`).join('')}</div>`;
  }
  function columnChart(buckets, series, labelEvery) {
    const W = 640, H = 200, pad = { l: 30, r: 6, t: 8, b: 22 };
    const max = Math.max(1, ...buckets.flatMap((b) => series.map((s) => b[s.key])));
    const bw = (W - pad.l - pad.r) / buckets.length;
    const y = (v) => H - pad.b - (v / max) * (H - pad.t - pad.b);
    const ticks = [0, Math.ceil(max / 2), max];
    let out = ticks.map((t) => `<line class="grid-line" x1="${pad.l}" x2="${W - pad.r}" y1="${y(t)}" y2="${y(t)}"/><text x="${pad.l - 6}" y="${y(t) + 4}" text-anchor="end">${t}</text>`).join('');
    buckets.forEach((b, i) => {
      const inner = bw * 0.8, each = inner / series.length;
      series.forEach((s, j) => {
        const v = b[s.key];
        if (v) out += `<rect x="${pad.l + i * bw + bw * 0.1 + j * each}" y="${y(v)}" width="${Math.max(1, each - 1)}" height="${H - pad.b - y(v)}" rx="2" fill="${s.color}"><title>${esc(b.label)}: ${v} ${s.name.toLowerCase()}</title></rect>`;
      });
      if (i % labelEvery === 0) out += `<text x="${pad.l + i * bw + bw / 2}" y="${H - 6}" text-anchor="middle">${esc(b.short)}</text>`;
    });
    return `<svg class="chart" viewBox="0 0 ${W} ${H}" role="img">${out}</svg>`;
  }
  function activityChart() {
    const recent = items.filter((i) => nowS() - i.t < 48 * 3600).length;
    const hourly = recent >= 5;
    const span = hourly ? 3600 : 86400;
    const end = Math.ceil(nowS() / span) * span;
    const first = Math.min(...items.map((i) => i.t));
    const count = hourly ? 48 : Math.min(60, Math.max(7, Math.ceil((end - first) / span)));
    const buckets = Array.from({ length: count }, (_, k) => {
      const startTs = end - (count - k) * span, d = new Date(startTs * 1000);
      return {
        start: startTs, listed: 0, sold: 0,
        label: hourly ? d.toLocaleString(undefined, { weekday: 'short', hour: 'numeric' }) : d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
        short: hourly ? d.toLocaleTimeString(undefined, { hour: 'numeric' }) : d.toLocaleDateString(undefined, { month: 'numeric', day: 'numeric' }),
      };
    });
    const at = (ts) => { const k = count - Math.ceil((end - ts) / span); return k >= 0 && k < count ? buckets[k] : null; };
    items.forEach((i) => { const b = at(i.t); if (b) b.listed++; if (i.sa > 0) { const s = at(i.sa); if (s) s.sold++; } });
    return { html: columnChart(buckets, [{ key: 'listed', name: 'Listed', color: '#f5c542' }, { key: 'sold', name: 'Sold', color: '#f87171' }], hourly ? 6 : Math.ceil(count / 10)), hourly };
  }
  function scatter() {
    const pts = items.filter((i) => i.st !== 2 && i._tr && i.d != null);
    if (pts.length < 3) return '<p class="empty-note">Appears once ratings and GeekMarket prices are gathered.</p>';
    const W = 640, H = 300, pad = { l: 40, r: 10, t: 10, b: 30 };
    const xMin = Math.max(4, Math.floor(Math.min(...pts.map((p) => p.r)))), xMax = Math.min(10, Math.ceil(Math.max(...pts.map((p) => p.r))));
    const yLo = -80, yHi = 100;
    const x = (v) => pad.l + ((v - xMin) / Math.max(1, xMax - xMin)) * (W - pad.l - pad.r);
    const y = (v) => pad.t + ((Math.max(yLo, Math.min(yHi, v)) - yLo) / (yHi - yLo)) * (H - pad.t - pad.b);
    let out = '';
    for (let v = xMin; v <= xMax; v++) out += `<line class="grid-line" x1="${x(v)}" x2="${x(v)}" y1="${pad.t}" y2="${H - pad.b}"/><text x="${x(v)}" y="${H - 10}" text-anchor="middle">${v}</text>`;
    [-75, -50, -25, 0, 25, 50, 100].forEach((v) => { out += `<line class="grid-line" x1="${pad.l}" x2="${W - pad.r}" y1="${y(v)}" y2="${y(v)}" ${v === 0 ? 'style="stroke:#3a4150"' : ''}/><text x="${pad.l - 6}" y="${y(v) + 4}" text-anchor="end">${v > 0 ? '+' : ''}${v}%</text>`; });
    out += `<text x="${pad.l + 6}" y="${pad.t + 12}" style="fill:#f5c542">Cheaper than market ↑</text><text x="${W - pad.r}" y="${H - 34}" text-anchor="end">Higher rated →</text>`;
    pts.forEach((p) => { out += `<circle class="pt" data-id="${esc(p.i)}" cx="${x(p.r).toFixed(1)}" cy="${y(p.d).toFixed(1)}" r="4.5" fill="${TIER[p._tier].color}" fill-opacity="0.8"><title>${esc(p.n)} · ${esc(p.pt)} · ${pct(p.d)} · ★${p.r.toFixed(1)}</title></circle>`; });
    return `<svg class="chart" viewBox="0 0 ${W} ${H}" role="img">${out}</svg>`;
  }
  function rankList(rows, val) {
    if (!rows.length) return '<p class="empty-note">Nothing here yet.</p>';
    return `<ul class="rank-list">${rows.map((it) => `<li data-id="${esc(it.i)}">${art(it)}<div style="min-width:0"><div class="nm">${esc(it.n)}</div><div class="meta">${esc(it.s)} · ${esc(it.pt)}</div></div><div class="val">${val(it)}</div></li>`).join('')}</ul>`;
  }
  function renderInsights() {
    const avail = items.filter((i) => i.st === 0);
    const live = items.filter((i) => i.st !== 2);
    const tierRows = TIERS.map((t) => ({ label: t.label, n: avail.filter((i) => i._tier === t.k).length, color: t.color }));
    const bins = [[0, 10], [10, 20], [20, 30], [30, 50], [50, 75], [75, 100], [100, Infinity]];
    const priceRows = bins.map(([a, b]) => ({ label: b === Infinity ? `$${a}+` : `$${a}–${b}`, n: avail.filter((i) => i.p != null && i.p >= a && i.p < b).length, color: '#f5c542' }));
    const condRows = [...CONDITIONS, null].map((c) => ({ label: c || 'Not stated', n: avail.filter((i) => (i.c || null) === c).length, color: c ? '#7aa7ff' : '#4b5262' }));
    const weightRows = [['light', 'Light (<2)'], ['medium', 'Medium (2–3.5)'], ['heavy', 'Heavy (3.5+)'], [null, 'Unknown']].map(([k, label]) => ({ label, n: avail.filter((i) => i._wc === k).length, color: k ? '#34d399' : '#4b5262' }));
    const discounts = avail.filter((i) => i.d != null).sort(SORTS.deal).slice(0, 8);
    const hot = live.filter((i) => i.cc).sort(SORTS.comments).slice(0, 8);
    const groups = {};
    live.forEach((i) => { (groups[i.g || i.n] = groups[i.g || i.n] || []).push(i); });
    const multi = Object.values(groups).filter((g) => g.length > 1).sort((a, b) => b.length - a.length).slice(0, 8)
      .map((g) => ({ ...g.sort(SORTS['price-asc'])[0], _copies: g.length }));
    const act = activityChart();
    $('insights').innerHTML = `
      <div class="card chart-card span-8"><h3>Listing activity</h3><p class="sub">${act.hourly ? 'Items listed and sold per hour, last 48 hours' : 'Items listed and sold per day'}</p>${act.html}
        <div class="legend"><span><i style="background:#f5c542"></i>Listed</span><span><i style="background:#f87171"></i>Sold (tracked since the bot started)</span></div></div>
      <div class="card chart-card span-4"><h3>Deal mix</h3><p class="sub">Available items vs. GeekMarket median</p>${barList(tierRows, avail.length)}</div>
      <div class="card chart-card span-8"><h3>Value map</h3><p class="sub">BGG rating vs. asking price compared with GeekMarket. Top right is the sweet spot: well rated and cheap. Click a dot for details.</p>${scatter()}</div>
      <div class="card chart-card span-4"><h3>Biggest discounts</h3><p class="sub">Available, furthest below the median</p>${rankList(discounts, (i) => `<span style="color:${TIER[i._tier].color}">${pct(i.d)}</span>`)}</div>
      <div class="card chart-card span-4"><h3>Price ranges</h3><p class="sub">Available items by asking price</p>${barList(priceRows, avail.length)}</div>
      <div class="card chart-card span-4"><h3>Condition</h3><p class="sub">Available items, from the post's condition line</p>${barList(condRows, avail.length)}</div>
      <div class="card chart-card span-4"><h3>Complexity</h3><p class="sub">Available items by BGG weight</p>${barList(weightRows, avail.length)}</div>
      <div class="card chart-card span-6"><h3>Most talked about</h3><p class="sub">Unsold items with the most comments</p>${rankList(hot, (i) => `${icon('chat')} ${i.cc}`)}</div>
      <div class="card chart-card span-6"><h3>Most copies listed</h3><p class="sub">Unsold games with more than one copy, cheapest shown</p>${rankList(multi, (i) => `${i._copies} copies`)}</div>`;
  }

  // ---------- render: sellers ----------
  let sellerSort = 'listings';
  function renderSellers() {
    const map = {};
    items.forEach((i) => {
      const s = (map[i.s] = map[i.s] || { name: i.s, listings: 0, avail: 0, claimed: 0, sold: 0, value: 0, deals: [] });
      s.listings++;
      if (i.st === 0) { s.avail++; s.value += i.p || 0; } else if (i.st === 1) s.claimed++; else s.sold++;
      if (i.d != null) s.deals.push(i.d);
    });
    const rows = Object.values(map).map((s) => ({ ...s, through: s.sold / s.listings, avgDeal: s.deals.length ? s.deals.reduce((a, b) => a + b, 0) / s.deals.length : null }));
    const keys = { listings: (s) => s.listings, avail: (s) => s.avail, sold: (s) => s.sold, through: (s) => s.through, value: (s) => s.value, avgDeal: (s) => (s.avgDeal == null ? null : -s.avgDeal) };
    rows.sort(by(keys[sellerSort], true));
    const cols = [['Seller', null], ['Listings', 'listings'], ['Available', 'avail'], ['Sold', 'sold'], ['Sell-through', 'through'], ['Listed value', 'value'], ['Avg vs. market', 'avgDeal']];
    $('sellers').innerHTML = `<div class="table-wrap"><table class="data"><thead><tr>${cols.map(([l, k]) => `<th class="${k ? 'num' : ''} ${k === sellerSort ? 'sorted' : ''}" ${k ? `data-k="${k}"` : ''}>${l}</th>`).join('')}</tr></thead><tbody>
      ${rows.map((s) => `<tr data-seller="${esc(s.name)}"><td><b>${esc(s.name)}</b></td><td class="num">${s.listings}</td><td class="num">${s.avail}</td><td class="num">${s.sold}</td>
        <td class="num">${Math.round(s.through * 100)}%</td><td class="num">${money(Math.round(s.value), 0)}</td>
        <td class="num">${s.avgDeal == null ? '—' : `<span style="color:${s.avgDeal <= -10 ? 'var(--good)' : s.avgDeal >= 10 ? 'var(--above)' : 'var(--muted)'}">${pct(s.avgDeal)}</span>`}</td></tr>`).join('')}
      </tbody></table></div>`;
    $('sellers').querySelectorAll('th[data-k]').forEach((th) => th.addEventListener('click', () => { sellerSort = th.dataset.k; renderSellers(); }));
  }

  // ---------- events ----------
  function update(change, keepPage) {
    Object.assign(prefs, change);
    savePrefs();
    if (!keepPage) shown = PAGE;
    if (snap) renderAll();
  }
  const toggleIn = (arr, v) => (arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);

  document.querySelectorAll('.tab').forEach((t) => t.addEventListener('click', () => update({ tab: t.dataset.tab })));
  $('f-status').addEventListener('click', (e) => { const b = e.target.closest('button'); if (b) update({ status: b.dataset.v }); });
  $('f-deal').addEventListener('change', (e) => { if (e.target.value) update({ deal: toggleIn(prefs.deal, e.target.value) }); });
  $('f-min').addEventListener('change', (e) => update({ min: e.target.value }));
  $('f-max').addEventListener('change', (e) => update({ max: e.target.value }));
  $('f-rating').addEventListener('input', (e) => { $('f-rating-out').textContent = Number(e.target.value) > 0 ? `${e.target.value}+` : 'Any'; });
  $('f-rating').addEventListener('change', (e) => update({ rating: Number(e.target.value) }));
  $('f-players').addEventListener('change', (e) => update({ players: e.target.value }));
  $('f-weight').addEventListener('click', (e) => { const b = e.target.closest('button'); if (b) update({ weight: toggleIn(prefs.weight, b.dataset.v) }); });
  $('f-cond').addEventListener('click', (e) => { const b = e.target.closest('button'); if (b) update({ cond: toggleIn(prefs.cond, b.dataset.v) }); });
  $('f-new').addEventListener('change', (e) => update({ newOnly: e.target.checked }));
  $('f-noexp').addEventListener('change', (e) => update({ noExp: e.target.checked }));
  $('f-noauction').addEventListener('change', (e) => update({ noAuction: e.target.checked }));
  $('f-extras').addEventListener('change', (e) => update({ extrasOnly: e.target.checked }));
  $('clear-filters').addEventListener('click', () => update({ status: '0', deal: [], min: '', max: '', rating: 0, players: '', weight: [], cond: [], newOnly: false, noExp: false, noAuction: false, extrasOnly: false, search: '', seller: '' }));
  let searchTimer;
  $('search').addEventListener('input', (e) => { clearTimeout(searchTimer); searchTimer = setTimeout(() => update({ search: e.target.value.trim() }), 150); });
  $('sort').addEventListener('change', (e) => update({ sort: e.target.value }));
  document.querySelectorAll('.view-toggle button').forEach((b) => b.addEventListener('click', () => update({ view: b.dataset.view })));
  $('filters-toggle').addEventListener('click', () => $('filters').classList.toggle('open'));
  $('list-select').addEventListener('change', (e) => { rememberVisit(); prefs.list = e.target.value; prefs.seller = ''; lastVisit = null; savePrefs(); loadList(); });
  $('refresh').addEventListener('click', () => loadList(true));
  $('gate-form').addEventListener('submit', (e) => { e.preventDefault(); const k = $('gate-key').value.trim(); if (k) { store.set(KEY_STORE, k); start(k); } });

  // Open an item from anywhere (cards, rows, lists, chart dots).
  document.addEventListener('click', (e) => {
    const sellerBtn = e.target.closest('[data-seller]');
    if (sellerBtn && (sellerBtn.tagName === 'BUTTON' || sellerBtn.tagName === 'TR')) {
      closeDrawer();
      update({ seller: sellerBtn.dataset.seller, tab: 'listings', status: 'all' });
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    if (e.target.closest('a')) return;
    const el = e.target.closest('[data-id]');
    if (el && el.closest('#app, #drawer')) openDrawer(el.dataset.id);
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeDrawer();
    if (e.key === 'Enter' && e.target.matches?.('.item')) openDrawer(e.target.dataset.id);
  });
  $('drawer-close').addEventListener('click', closeDrawer);
  $('drawer-backdrop').addEventListener('click', closeDrawer);

  // Load more cards as you scroll.
  new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && snap && prefs.tab === 'listings' && shown < filtered().length) { shown += PAGE; renderResults(); }
  }, { rootMargin: '600px' }).observe($('sentinel'));

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) rememberVisit();
    else if (key && snap) loadList(true);
  });
  window.addEventListener('pagehide', rememberVisit);
  setInterval(() => { if (snap) renderLive(); }, 30000);

  const initial = readKey();
  if (initial) start(initial); else showGate();
})();
