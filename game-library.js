/*
 * Game Library dashboard.
 *
 * Loads the pre-built games-library.json snapshot (see
 * scripts/refresh-library.mjs) so visitors cost zero BGG calls, then once a day
 * per browser diffs the live collection and hydrates only the new games via the
 * worker's /api/bgg-thing endpoint. Filters, sorting, stats, and charts all run
 * client-side; the full control state round-trips through the URL so a filtered
 * view can be shared as a link.
 */
document.addEventListener('DOMContentLoaded', function () {
  const WORKER = 'https://dfwgv-bgg-proxy.joemsprague.workers.dev';
  const USERNAME = 'traditz';
  const DELTA_KEY = 'dfwgvLibraryDelta.v4'; // v4: adds expPatches/removedExpIds/ignoredExpIds
  const VIEW_KEY = 'dfwgvLibraryView';     // 'grid' | 'list' — personal pref, not URL state
  const CHARTS_KEY = 'dfwgvLibraryCharts'; // '1' visible | '0' hidden
  const REFRESH_MS = 24 * 60 * 60 * 1000; // re-check the live collection daily
  const REDUCED_MOTION = window.matchMedia('(prefers-reduced-motion: reduce)');

  let mechanics = [];  // dictionary: index -> name
  let categories = []; // dictionary: index -> name
  let allGames = [];   // merged snapshot + delta
  let cards = new Map(); // game id -> rendered card element

  const state = {
    q: '', players: '', time: '', weight: '', rating: '', exp: false,
    mechs: new Set(), // mechanic names (names, not indexes — stable across snapshot rebuilds)
    cats: new Set(),  // category (theme) names
    sort: 'name', dir: 'asc'
  };

  const $ = (id) => document.getElementById(id);
  const debounce = (fn, ms) => {
    let t;
    return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), ms); };
  };

  /* ---------------- data loading ---------------- */

  /** Shimmer placeholders shown until the snapshot arrives. */
  function renderSkeleton() {
    $('gl-stats').innerHTML = Array.from({ length: 4 }, () =>
      '<div class="gl-stat gl-skel-tile"><span class="gl-skel gl-skel-sm"></span><span class="gl-skel gl-skel-lg"></span><span class="gl-skel gl-skel-sm"></span></div>').join('');
    $('gl-charts').innerHTML = Array.from({ length: 6 }, () =>
      '<div class="gl-chart"><span class="gl-skel gl-skel-sm"></span><span class="gl-skel gl-skel-chart"></span></div>').join('');
    $('game-container').innerHTML = Array.from({ length: 10 }, () =>
      '<div class="game-card gl-skel-card"><span class="gl-skel gl-skel-img"></span><span class="gl-skel gl-skel-sm"></span><span class="gl-skel gl-skel-sm"></span></div>').join('');
  }

  async function loadLibrary() {
    const container = $('game-container');
    renderSkeleton();
    let snapshot;
    try {
      const res = await fetch('games-library.json');
      if (!res.ok) throw new Error(`games-library.json responded ${res.status}`);
      snapshot = await res.json();
    } catch (error) {
      console.error('Error loading library snapshot:', error);
      container.innerHTML = "<p class='no-results'>Failed to load the game library. Please try again later.</p>";
      return;
    }

    mechanics = snapshot.mechanics.slice();
    categories = (snapshot.categories || []).slice();
    allGames = snapshot.games.slice();
    applyDelta(readDelta());
    $('gl-updated').textContent = `updated ${snapshot.generatedAt}`;

    readStateFromUrl();
    buildPickers();
    writeControlsFromState();
    buildAllCards();
    update();

    checkForNewGames(snapshot).catch((e) => console.warn('Library freshness check failed:', e));
  }

  function readDelta() {
    try {
      return JSON.parse(localStorage.getItem(DELTA_KEY)) || null;
    } catch { return null; }
  }

  function applyDelta(delta) {
    if (!delta) return;
    const known = new Set(allGames.map((g) => g.id));
    const removed = new Set(delta.removedIds || []);
    const toIndexes = (names, dict) => (names || []).map((name) => {
      let i = dict.indexOf(name);
      if (i === -1) { dict.push(name); i = dict.length - 1; }
      return i;
    });
    for (const game of delta.added || []) {
      if (known.has(game.id)) continue;
      // Delta games store mechanic/category names; translate to dictionary indexes.
      game.mech = toIndexes(game.mechNames, mechanics);
      game.cat = toIndexes(game.catNames, categories);
      allGames.push(game);
    }
    allGames = allGames.filter((g) => !removed.has(g.id));

    // Patch expansion lists: expansions bought (or sold) since the snapshot.
    const removedExp = new Set(delta.removedExpIds || []);
    const patches = delta.expPatches || {};
    for (const g of allGames) {
      let exp = g.exp || [];
      if (removedExp.size) exp = exp.filter((e) => !removedExp.has(e.id));
      const patch = patches[g.id];
      if (patch) {
        const have = new Set(exp.map((e) => e.id));
        exp = exp.concat(patch.filter((e) => !have.has(e.id)));
      }
      g.exp = exp;
    }
  }

  /**
   * Once a day: pull the live collection id list, hydrate games the snapshot
   * does not know about, and remember games that left the collection.
   */
  async function checkForNewGames(snapshot) {
    const delta = readDelta() || { checkedAt: 0, added: [], removedIds: [] };
    if (Date.now() - delta.checkedAt < REFRESH_MS) return;

    // Two fetches: base-only, then with expansions. Owned expansion ids are the
    // difference — the collection API mislabels expansions' subtype, so the
    // attribute cannot be used to tell them apart.
    const parseItems = async (url) => {
      const res = await fetch(url);
      if (!res.ok || res.status === 202) return null; // 202 = BGG "come back later" — try next visit
      return [...new DOMParser().parseFromString(await res.text(), 'text/xml').querySelectorAll('item')];
    };
    const baseItems = await parseItems(`${WORKER}/api/bgg-collection?username=${USERNAME}`);
    const allItems = await parseItems(`${WORKER}/api/bgg-collection?username=${USERNAME}&includeexp=1`);
    if (!baseItems || !allItems || baseItems.length === 0) return;

    const liveIds = new Set();    // base games only
    const addedDates = new Map(); // base game id -> yyyy-mm-dd
    for (const item of baseItems) {
      liveIds.add(item.getAttribute('objectid'));
      addedDates.set(item.getAttribute('objectid'), (item.querySelector('status')?.getAttribute('lastmodified') || '').slice(0, 10));
    }
    const ownedExpIds = new Set(
      allItems.map((i) => i.getAttribute('objectid')).filter((id) => !liveIds.has(id))
    );

    const snapshotIds = new Set(snapshot.games.map((g) => g.id));
    const keptAdded = (delta.added || []).filter((g) => liveIds.has(g.id) && !snapshotIds.has(g.id));
    const knownIds = new Set([...snapshotIds, ...keptAdded.map((g) => g.id)]);
    const newIds = [...liveIds].filter((id) => !knownIds.has(id));
    const hydrated = newIds.length ? await hydrateGames(newIds, addedDates, ownedExpIds) : [];

    // Expansion diff: an expansion id we've never attributed to a base game is
    // hydrated once (cheap — its data names its base games) and stored as a
    // patch. Ids whose base game isn't owned are remembered so they aren't
    // re-fetched every day.
    const knownExp = new Set();
    for (const g of snapshot.games) for (const e of g.exp || []) knownExp.add(e.id);
    for (const g of keptAdded.concat(hydrated)) for (const e of g.exp || []) knownExp.add(e.id);
    const expPatches = {};
    for (const [baseId, list] of Object.entries(delta.expPatches || {})) {
      const kept = list.filter((e) => ownedExpIds.has(e.id) && liveIds.has(baseId));
      if (kept.length) {
        expPatches[baseId] = kept;
        kept.forEach((e) => knownExp.add(e.id));
      }
    }
    const ignored = new Set((delta.ignoredExpIds || []).filter((id) => ownedExpIds.has(id)));
    const newExpIds = [...ownedExpIds].filter((id) => !knownExp.has(id) && !ignored.has(id));
    for (const ex of newExpIds.length ? await hydrateExpansions(newExpIds) : []) {
      let attributed = false;
      for (const baseId of ex.baseIds) {
        if (!liveIds.has(baseId)) continue;
        (expPatches[baseId] = expPatches[baseId] || []).push({ id: ex.id, name: ex.name });
        attributed = true;
      }
      if (!attributed) ignored.add(ex.id);
    }

    const next = {
      checkedAt: Date.now(),
      added: keptAdded.concat(hydrated),
      removedIds: [...snapshotIds].filter((id) => !liveIds.has(id)),
      expPatches,
      removedExpIds: [...knownExp].filter((id) => !ownedExpIds.has(id)),
      ignoredExpIds: [...ignored]
    };
    localStorage.setItem(DELTA_KEY, JSON.stringify(next));

    const changed = newIds.length > 0 || newExpIds.length > 0
      || JSON.stringify(next.removedIds) !== JSON.stringify(delta.removedIds || [])
      || JSON.stringify(next.removedExpIds) !== JSON.stringify(delta.removedExpIds || []);
    if (changed) {
      allGames = snapshot.games.slice();
      applyDelta(next);
      buildAllCards();
      buildPickers();
      update();
    }
  }

  /** Fetch just-acquired expansions to learn which owned base games they belong to. */
  async function hydrateExpansions(ids) {
    const out = [];
    for (let i = 0; i < ids.length; i += 20) {
      const res = await fetch(`${WORKER}/api/bgg-thing?id=${ids.slice(i, i + 20).join(',')}`);
      if (!res.ok) continue;
      const xml = new DOMParser().parseFromString(await res.text(), 'text/xml');
      for (const item of xml.querySelectorAll('item')) {
        out.push({
          id: item.getAttribute('id'),
          name: item.querySelector('name[type="primary"]')?.getAttribute('value') || '',
          // On an expansion, inbound expansion links point at its base game(s).
          baseIds: [...item.querySelectorAll('link[type="boardgameexpansion"][inbound="true"]')].map((l) => l.getAttribute('id'))
        });
      }
    }
    return out;
  }

  async function hydrateGames(ids, addedDates, ownedExpIds) {
    const games = [];
    for (let i = 0; i < ids.length; i += 20) {
      const res = await fetch(`${WORKER}/api/bgg-thing?id=${ids.slice(i, i + 20).join(',')}`);
      if (!res.ok) continue;
      const xml = new DOMParser().parseFromString(await res.text(), 'text/xml');
      for (const item of xml.querySelectorAll('item')) {
        const attr = (sel, name) => item.querySelector(sel)?.getAttribute(name || 'value') || '';
        const bestWith = (attr('poll-summary result[name="bestwith"]').match(/Best with (.+?) players?$/) || [])[1] || '';
        const exp = [...item.querySelectorAll('link[type="boardgameexpansion"]:not([inbound])')]
          .filter((l) => ownedExpIds.has(l.getAttribute('id')))
          .map((l) => ({ id: l.getAttribute('id'), name: l.getAttribute('value') }));
        games.push({
          id: item.getAttribute('id'),
          name: attr('name[type="primary"]'),
          year: parseInt(attr('yearpublished'), 10) || 0,
          thumb: item.querySelector('thumbnail')?.textContent || '',
          minP: parseInt(attr('minplayers'), 10) || 1,
          maxP: parseInt(attr('maxplayers'), 10) || 1,
          time: parseInt(attr('playingtime'), 10) || 0,
          weight: Math.round(parseFloat(attr('statistics ratings averageweight')) * 100) / 100 || 0,
          rating: Math.round(parseFloat(attr('statistics ratings average')) * 10) / 10 || 0,
          bestWith,
          added: (addedDates && addedDates.get(item.getAttribute('id'))) || new Date().toISOString().slice(0, 10),
          exp,
          mechNames: [...item.querySelectorAll('link[type="boardgamemechanic"]')].map((l) => l.getAttribute('value')),
          catNames: [...item.querySelectorAll('link[type="boardgamecategory"]')].map((l) => l.getAttribute('value'))
        });
      }
    }
    return games;
  }

  /* ---------------- URL state ---------------- */

  function readStateFromUrl() {
    const p = new URLSearchParams(location.search);
    state.q = p.get('q') || '';
    state.players = p.get('players') || '';
    state.time = p.get('time') || '';
    state.weight = p.get('weight') || '';
    state.rating = p.get('rating') || '';
    state.exp = p.get('exp') === '1';
    state.mechs = new Set((p.get('mech') || '').split('|').filter(Boolean));
    state.cats = new Set((p.get('cat') || '').split('|').filter(Boolean));
    state.sort = ['name', 'added', 'rating', 'weight', 'time', 'year'].includes(p.get('sort')) ? p.get('sort') : 'name';
    state.dir = p.get('dir') === 'desc' ? 'desc' : 'asc';
  }

  function writeStateToUrl() {
    const p = new URLSearchParams();
    if (state.q) p.set('q', state.q);
    if (state.players) p.set('players', state.players);
    if (state.time) p.set('time', state.time);
    if (state.weight) p.set('weight', state.weight);
    if (state.rating) p.set('rating', state.rating);
    if (state.exp) p.set('exp', '1');
    if (state.mechs.size) p.set('mech', [...state.mechs].join('|'));
    if (state.cats.size) p.set('cat', [...state.cats].join('|'));
    if (state.sort !== 'name' || state.dir !== 'asc') { p.set('sort', state.sort); p.set('dir', state.dir); }
    const qs = p.toString();
    history.replaceState(null, '', qs ? `?${qs}` : location.pathname);
  }

  function writeControlsFromState() {
    $('gl-search').value = state.q;
    $('gl-players').value = state.players;
    $('gl-time').value = state.time;
    $('gl-weight').value = state.weight;
    $('gl-rating').value = state.rating;
    $('gl-sort').value = state.sort;
    $('gl-exp-toggle').setAttribute('aria-pressed', String(state.exp));
    syncDirButton();
    syncPickerButtons();
  }

  /* ---------------- filtering + sorting ---------------- */

  function parseRange(value) {
    const [lo, hi] = value.split('-').map(Number);
    return { lo, hi };
  }

  function filteredGames() {
    const q = state.q.toLowerCase();
    const players = parseInt(state.players, 10);
    const time = state.time ? parseRange(state.time) : null;
    const weight = state.weight ? parseRange(state.weight) : null;
    const rating = state.rating ? parseRange(state.rating) : null;
    const mechIdx = new Set([...state.mechs].map((name) => mechanics.indexOf(name)).filter((i) => i !== -1));
    const catIdx = new Set([...state.cats].map((name) => categories.indexOf(name)).filter((i) => i !== -1));

    return allGames.filter((g) => {
      if (q && !g.name.toLowerCase().includes(q)) return false;
      if (!isNaN(players) && (players < g.minP || players > g.maxP)) return false;
      if (time && (g.time < time.lo || g.time > time.hi)) return false;
      if (weight && (g.weight < weight.lo || g.weight >= weight.hi)) return false;
      if (rating && (g.rating < rating.lo || g.rating >= rating.hi)) return false;
      if (state.exp && !(g.exp || []).length) return false;
      for (const i of mechIdx) if (!g.mech.includes(i)) return false;
      for (const i of catIdx) if (!(g.cat || []).includes(i)) return false;
      return true;
    });
  }

  function sortGames(games) {
    const dir = state.dir === 'desc' ? -1 : 1;
    const key = state.sort;
    return games.slice().sort((a, b) => {
      if (key === 'name') return dir * a.name.localeCompare(b.name);
      // 'added' is a yyyy-mm-dd string, so lexical comparison sorts by date.
      if (key === 'added') {
        const diff = (a.added || '').localeCompare(b.added || '');
        return diff !== 0 ? dir * diff : a.name.localeCompare(b.name);
      }
      const diff = (a[key] || 0) - (b[key] || 0);
      return diff !== 0 ? dir * diff : a.name.localeCompare(b.name);
    });
  }

  /* ---------------- rendering ---------------- */

  // "4" / "2, 4" / "4–5" → the set of counts BGG's community calls best.
  function parseBestNums(bestWith) {
    const nums = new Set();
    for (const part of (bestWith || '').split(',')) {
      const m = part.trim().match(/^(\d+)(?:\s*[–-]\s*(\d+))?\+?$/);
      if (!m) continue;
      const hi = m[2] ? parseInt(m[2], 10) : parseInt(m[1], 10);
      for (let n = parseInt(m[1], 10); n <= hi; n++) nums.add(n);
    }
    return nums;
  }

  function buildAllCards() {
    cards.clear();
    for (const g of allGames) {
      g.bestNums = parseBestNums(g.bestWith);
      const el = document.createElement('div');
      el.className = 'game-card';
      const players = g.minP === g.maxP ? String(g.minP) : `${g.minP}–${g.maxP}`;
      const exp = g.exp || [];
      const stat = (value, label, title) => `
        <div class="gc-stat"${title ? ` title="${escapeHtml(title)}"` : ''}>
          <span class="gc-val">${value}</span>
          <span class="gc-key">${label}</span>
        </div>`;
      el.innerHTML = `
        <a href="https://boardgamegeek.com/boardgame/${g.id}" target="_blank" rel="noopener">
          <img src="${g.thumb}" alt="Box art for ${escapeHtml(g.name)}" loading="lazy" />
          <h3>${escapeHtml(g.name)}${g.year ? ` (${g.year})` : ''}</h3>
        </a>
        <div class="gc-meta">
          ${stat(players, g.bestWith ? `best ${escapeHtml(g.bestWith)}` : 'players', `${players} players${g.bestWith ? ` — best with ${g.bestWith}` : ''}`)}
          ${stat(g.time ? `${g.time}m` : '–', 'time', g.time ? `${g.time} minutes` : 'Playtime unknown')}
          ${stat(g.weight ? g.weight.toFixed(1) : '–', 'wt', g.weight ? `Complexity ${g.weight.toFixed(2)} / 5` : 'Complexity unknown')}
          ${stat(g.rating ? g.rating.toFixed(1) : '–', 'rating', g.rating ? `BGG rating ${g.rating.toFixed(1)} / 10` : 'Unrated')}
        </div>
        ${exp.length ? `
        <button type="button" class="gc-exp-btn" aria-expanded="false">
          <span class="gc-exp-chev">&#9656;</span> ${exp.length} expansion${exp.length === 1 ? '' : 's'}
        </button>
        <div class="gc-exp" hidden>
          ${exp.map((e) => `<a href="https://boardgamegeek.com/boardgame/${e.id}" target="_blank" rel="noopener">${escapeHtml(e.name)}</a>`).join('')}
        </div>` : ''}`;
      if (exp.length) el.classList.add('gc-expandable');
      cards.set(g.id, el);
    }
  }

  // One delegated handler: clicking a card (anywhere except its links) or its
  // expansion button toggles the owned-expansions list. Also hosts the
  // empty-state clear button.
  $('game-container').addEventListener('click', (e) => {
    if (e.target.id === 'gl-empty-clear') { $('gl-reset').click(); return; }
    const card = e.target.closest('.game-card.gc-expandable');
    if (!card || e.target.closest('a')) return;
    const btn = card.querySelector('.gc-exp-btn');
    const list = card.querySelector('.gc-exp');
    list.hidden = !list.hidden;
    btn.setAttribute('aria-expanded', String(!list.hidden));
    btn.querySelector('.gc-exp-chev').innerHTML = list.hidden ? '&#9656;' : '&#9662;';
  });

  function escapeHtml(s) {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  function update() {
    const games = sortGames(filteredGames());
    renderStats(games);
    if (!$('gl-charts').hidden) renderCharts(games);
    renderChips(games);
    renderCards(games);
    writeStateToUrl();
  }

  /* ---------------- active-filter chips ---------------- */

  function renderChips(games) {
    const optText = (id, value) => {
      const opt = [...$(id).options].find((o) => o.value === value);
      return opt ? opt.text : value;
    };
    const chips = [];
    const chip = (kind, value, label) => chips.push({ kind, value, label });
    if (state.q) chip('q', '', `“${state.q}”`);
    if (state.players) chip('players', '', `${state.players} players`);
    if (state.time) chip('time', '', optText('gl-time', state.time));
    if (state.weight) chip('weight', '', optText('gl-weight', state.weight));
    if (state.rating) chip('rating', '', `Rated ${optText('gl-rating', state.rating)}`);
    if (state.exp) chip('exp', '', 'Has expansions');
    for (const m of state.mechs) chip('mech', m, m);
    for (const c of state.cats) chip('cat', c, c);

    if (chips.length === 0) {
      $('gl-chips').innerHTML = '';
      return;
    }
    $('gl-chips').innerHTML = chips.map((c) => `
      <button type="button" class="gl-chip" data-kind="${c.kind}" data-value="${escapeHtml(c.value)}"
              title="Remove this filter">${escapeHtml(c.label)}<span aria-hidden="true"> ✕</span></button>`).join('')
      + `<span class="gl-chip-count">${games.length.toLocaleString()} of ${allGames.length.toLocaleString()} games</span>`;
  }

  $('gl-chips').addEventListener('click', (e) => {
    const chipEl = e.target.closest('.gl-chip');
    if (!chipEl) return;
    const { kind, value } = chipEl.dataset;
    if (kind === 'q') state.q = '';
    else if (kind === 'players') state.players = '';
    else if (kind === 'time') state.time = '';
    else if (kind === 'weight') state.weight = '';
    else if (kind === 'rating') state.rating = '';
    else if (kind === 'exp') state.exp = false;
    else if (kind === 'mech') state.mechs.delete(value);
    else if (kind === 'cat') state.cats.delete(value);
    syncPickerCheckboxes();
    writeControlsFromState();
    update();
  });

  function renderCards(games) {
    const container = $('game-container');
    if (games.length === 0) {
      container.textContent = '';
      container.insertAdjacentHTML('beforeend', `
        <div class="gl-empty">
          <p class="gl-empty-dice" aria-hidden="true">&#127922;</p>
          <p>No games match your filters.</p>
          <button type="button" id="gl-empty-clear">Clear all filters</button>
        </div>`);
      return;
    }
    // Gold-highlight the "best N" label on games that are community-best at
    // the player count being filtered for.
    const wanted = parseInt(state.players, 10);
    const frag = document.createDocumentFragment();
    for (const g of games) {
      const el = cards.get(g.id);
      el.classList.toggle('gc-best', !isNaN(wanted) && g.bestNums.has(wanted));
      frag.appendChild(el);
    }
    container.textContent = '';
    container.appendChild(frag);
  }

  const prevStatValues = [null, null, null, null];

  function renderStats(games) {
    const avg = (values) => values.length ? values.reduce((a, b) => a + b, 0) / values.length : 0;
    const median = (values) => {
      if (!values.length) return 0;
      const s = values.slice().sort((a, b) => a - b);
      return s[Math.floor(s.length / 2)];
    };
    const weights = games.filter((g) => g.weight > 0).map((g) => g.weight);
    const times = games.filter((g) => g.time > 0).map((g) => g.time);
    const ratings = games.filter((g) => g.rating > 0).map((g) => g.rating);
    const tiles = [
      { label: 'Games', num: games.length, fmt: (n) => Math.round(n).toLocaleString(), sub: games.length === allGames.length ? 'in the library' : `of ${allGames.length.toLocaleString()}` },
      { label: 'Avg complexity', num: weights.length ? avg(weights) : null, fmt: (n) => n.toFixed(2), sub: 'weight / 5' },
      { label: 'Median playtime', num: times.length ? median(times) : null, fmt: (n) => String(Math.round(n)), sub: 'minutes' },
      { label: 'Avg BGG rating', num: ratings.length ? avg(ratings) : null, fmt: (n) => n.toFixed(1), sub: 'out of 10' }
    ];
    $('gl-stats').innerHTML = tiles.map((t) => `
      <div class="gl-stat">
        <span class="gl-stat-label">${t.label}</span>
        <span class="gl-stat-value">${t.num === null ? '–' : t.fmt(t.num)}</span>
        <span class="gl-stat-sub">${t.sub}</span>
      </div>`).join('');

    // Count the values up/down from their previous reading (a cheap 4-element
    // rAF tween; disabled for prefers-reduced-motion).
    if (!REDUCED_MOTION.matches) {
      const els = $('gl-stats').querySelectorAll('.gl-stat-value');
      tiles.forEach((t, i) => {
        const from = prevStatValues[i];
        if (t.num !== null && from !== null && from !== t.num) tween(els[i], from, t.num, t.fmt);
      });
    }
    tiles.forEach((t, i) => { prevStatValues[i] = t.num; });
  }

  function tween(el, from, to, fmt) {
    const start = performance.now();
    const DURATION = 280;
    const step = (now) => {
      const p = Math.min(1, (now - start) / DURATION);
      const eased = 1 - (1 - p) * (1 - p);
      el.textContent = fmt(from + (to - from) * eased);
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  /* ---------------- charts ---------------- */

  function renderCharts(games) {
    // Each bucket's `value` is the exact value the matching filter control
    // uses, so clicking a bar just sets that control.
    const timeBuckets = [
      { label: '≤30', value: '1-30', test: (g) => g.time > 0 && g.time <= 30 },
      { label: '31–60', value: '31-60', test: (g) => g.time > 30 && g.time <= 60 },
      { label: '61–90', value: '61-90', test: (g) => g.time > 60 && g.time <= 90 },
      { label: '91–120', value: '91-120', test: (g) => g.time > 90 && g.time <= 120 },
      { label: '2 hr+', value: '121-9999', test: (g) => g.time > 120 }
    ];
    const weightBuckets = [
      { label: '<1.5', value: '0-1.5', test: (g) => g.weight > 0 && g.weight < 1.5 },
      { label: '1.5–2', value: '1.5-2', test: (g) => g.weight >= 1.5 && g.weight < 2 },
      { label: '2–2.5', value: '2-2.5', test: (g) => g.weight >= 2 && g.weight < 2.5 },
      { label: '2.5–3', value: '2.5-3', test: (g) => g.weight >= 2.5 && g.weight < 3 },
      { label: '3–3.5', value: '3-3.5', test: (g) => g.weight >= 3 && g.weight < 3.5 },
      { label: '3.5+', value: '3.5-6', test: (g) => g.weight >= 3.5 }
    ];
    const ratingBuckets = [
      { label: '<6', value: '1-6', test: (g) => g.rating > 0 && g.rating < 6 },
      { label: '6–7', value: '6-7', test: (g) => g.rating >= 6 && g.rating < 7 },
      { label: '7–7.5', value: '7-7.5', test: (g) => g.rating >= 7 && g.rating < 7.5 },
      { label: '7.5–8', value: '7.5-8', test: (g) => g.rating >= 7.5 && g.rating < 8 },
      { label: '8+', value: '8-10', test: (g) => g.rating >= 8 }
    ];
    const playerBuckets = [1, 2, 3, 4, 5, 6, 7].map((n) => (
      { label: String(n), value: String(n), test: (g) => g.minP <= n && g.maxP >= n }
    )).concat([{ label: '8+', value: '8', test: (g) => g.maxP >= 8 }]);

    const columns = (buckets) => buckets.map((b) => ({ label: b.label, value: b.value, count: games.filter(b.test).length }));

    const topOf = (field, dict) => {
      const counts = new Map();
      for (const g of games) for (const i of g[field] || []) counts.set(i, (counts.get(i) || 0) + 1);
      return [...counts.entries()]
        .sort((a, b) => b[1] - a[1]).slice(0, 8)
        .map(([i, count]) => ({ label: dict[i], value: dict[i], count }));
    };

    $('gl-charts').innerHTML = [
      columnChart('Playtime', columns(timeBuckets), 'games', 'time', state.time),
      columnChart('Complexity (weight)', columns(weightBuckets), 'games', 'weight', state.weight),
      columnChart('Plays at player count', columns(playerBuckets), 'games', 'players', state.players),
      columnChart('BGG rating', columns(ratingBuckets), 'games', 'rating', state.rating),
      rowChart('Top mechanics', topOf('mech', mechanics), 'games', 'mech', state.mechs),
      growthChart(games)
    ].join('');
  }

  /**
   * Cumulative games-in-library over time, from the collection's added dates.
   * Reflects the current filters like every other chart. Time-true x axis.
   */
  let growthPoints = []; // kept for the hover tooltip

  function growthChart(games) {
    const dated = games.filter((g) => g.added).map((g) => g.added).sort();
    growthPoints = [];
    if (dated.length < 2) {
      return `<div class="gl-chart gl-chart-growth"><h3>Library growth</h3><p class="no-results">Not enough data</p></div>`;
    }
    // Collapse to one cumulative point per distinct date.
    let cum = 0;
    for (const date of dated) {
      cum++;
      if (growthPoints.length && growthPoints[growthPoints.length - 1].date === date) {
        growthPoints[growthPoints.length - 1].count = cum;
      } else {
        growthPoints.push({ date, count: cum });
      }
    }
    const t0 = Date.parse(growthPoints[0].date);
    const t1 = Date.parse(growthPoints[growthPoints.length - 1].date);
    const span = Math.max(1, t1 - t0);
    const max = cum;
    const pts = growthPoints.map((p) => {
      p.x = (Date.parse(p.date) - t0) / span; // 0..1, reused by the tooltip
      return `${(p.x * 100).toFixed(2)},${(38 - p.count / max * 34).toFixed(2)}`;
    });
    const line = `M${pts.join(' L')}`;
    const midYear = new Date((t0 + t1) / 2).getFullYear();
    return `
      <div class="gl-chart gl-chart-growth">
        <h3>Library growth</h3>
        <div class="gl-growth-wrap">
          <svg class="gl-growth" viewBox="0 0 100 40" preserveAspectRatio="none" aria-label="Cumulative games over time">
            <path class="gl-growth-area" d="${line} L100,40 L0,40 Z"></path>
            <path class="gl-growth-line" pathLength="1" d="${line}" vector-effect="non-scaling-stroke"></path>
          </svg>
          <span class="gl-growth-total">${cum.toLocaleString()}</span>
          <div class="gl-growth-tip" hidden></div>
        </div>
        <div class="gl-growth-x">
          <span>${growthPoints[0].date.slice(0, 4)}</span>
          <span>${midYear}</span>
          <span>${growthPoints[growthPoints.length - 1].date.slice(0, 4)}</span>
        </div>
      </div>`;
  }

  function columnChart(title, cols, unit, chartKey, activeValue) {
    const max = Math.max(1, ...cols.map((c) => c.count));
    const body = cols.map((c) => {
      const active = activeValue === c.value;
      return `
      <button type="button" class="gl-col${active ? ' active' : ''}" aria-pressed="${active}"
              data-chart="${chartKey}" data-value="${c.value}"
              title="${escapeHtml(`${c.label}: ${c.count} ${unit} — click to ${active ? 'clear this filter' : 'filter'}`)}">
        <span class="gl-col-value">${c.count || ''}</span>
        <span class="gl-col-bar" style="height:${c.count ? Math.max(3, Math.round(c.count / max * 110)) : 0}px"></span>
        <span class="gl-col-label">${c.label}</span>
      </button>`;
    }).join('');
    return `<div class="gl-chart"><h3>${title}</h3><div class="gl-cols">${body}</div></div>`;
  }

  function rowChart(title, rows, unit, chartKey, activeSet) {
    const max = Math.max(1, ...rows.map((r) => r.count));
    const body = rows.length ? rows.map((r) => {
      const active = activeSet.has(r.value);
      return `
      <button type="button" class="gl-row${active ? ' active' : ''}" aria-pressed="${active}"
              data-chart="${chartKey}" data-value="${escapeHtml(r.value)}"
              title="${escapeHtml(`${r.label}: ${r.count} ${unit} — click to ${active ? 'remove this mechanic filter' : 'filter'}`)}">
        <span class="gl-row-label">${escapeHtml(r.label)}</span>
        <span class="gl-row-track"><span class="gl-row-bar" style="width:${Math.max(2, Math.round(r.count / max * 100))}%"></span></span>
        <span class="gl-row-value">${r.count}</span>
      </button>`;
    }).join('') : "<p class='no-results'>No data</p>";
    return `<div class="gl-chart gl-chart-wide"><h3>${title}</h3><div class="gl-rows">${body}</div></div>`;
  }

  /* ---------------- mechanics + themes pickers ---------------- */

  const PICKERS = [
    { prefix: 'gl-mech', label: 'Mechanics', dict: () => mechanics, field: 'mech', set: () => state.mechs },
    { prefix: 'gl-cat', label: 'Themes', dict: () => categories, field: 'cat', set: () => state.cats }
  ];

  function buildPickers() {
    for (const picker of PICKERS) {
      const dict = picker.dict();
      const selected = picker.set();
      const counts = new Map();
      for (const g of allGames) for (const i of g[picker.field] || []) counts.set(i, (counts.get(i) || 0) + 1);
      const names = dict
        .map((name, i) => ({ name, count: counts.get(i) || 0 }))
        .filter((m) => m.count > 0)
        .sort((a, b) => a.name.localeCompare(b.name));

      $(`${picker.prefix}-list`).innerHTML = names.map((m) => `
        <label class="gl-mech-item" data-name="${escapeHtml(m.name)}">
          <input type="checkbox" value="${escapeHtml(m.name)}" ${selected.has(m.name) ? 'checked' : ''}>
          <span>${escapeHtml(m.name)}</span>
          <span class="gl-mech-count">${m.count}</span>
        </label>`).join('');

      $(`${picker.prefix}-list`).querySelectorAll('input').forEach((box) => {
        box.addEventListener('change', () => {
          if (box.checked) picker.set().add(box.value);
          else picker.set().delete(box.value);
          syncPickerButtons();
          update();
        });
      });
    }
  }

  function syncPickerButtons() {
    for (const picker of PICKERS) {
      const n = picker.set().size;
      $(`${picker.prefix}-btn`).textContent = n ? `${picker.label} (${n})` : picker.label;
    }
  }

  function syncPickerCheckboxes() {
    for (const picker of PICKERS) {
      const selected = picker.set();
      $(`${picker.prefix}-list`).querySelectorAll('input').forEach((box) => {
        box.checked = selected.has(box.value);
      });
    }
  }

  function syncDirButton() {
    const btn = $('gl-dir');
    btn.textContent = state.dir === 'asc' ? '↑' : '↓';
    btn.title = state.dir === 'asc' ? 'Ascending — click for descending' : 'Descending — click for ascending';
  }

  /* ---------------- wiring ---------------- */

  // Chart bars are filter toggles: clicking one applies the matching filter,
  // clicking it again clears it.
  $('gl-charts').addEventListener('click', (e) => {
    const bar = e.target.closest('[data-chart]');
    if (!bar) return;
    const { chart, value } = bar.dataset;
    if (chart === 'time') state.time = state.time === value ? '' : value;
    else if (chart === 'weight') state.weight = state.weight === value ? '' : value;
    else if (chart === 'rating') state.rating = state.rating === value ? '' : value;
    else if (chart === 'players') state.players = state.players === value ? '' : value;
    else if (chart === 'mech' || chart === 'cat') {
      const set = chart === 'mech' ? state.mechs : state.cats;
      if (set.has(value)) set.delete(value);
      else set.add(value);
      syncPickerCheckboxes();
    }
    writeControlsFromState();
    update();
  });

  // Hover readout for the growth line (nearest point to the cursor).
  $('gl-charts').addEventListener('mousemove', (e) => {
    const svg = e.target.closest('.gl-growth');
    const tip = svg && svg.parentElement.querySelector('.gl-growth-tip');
    if (!tip || growthPoints.length === 0) return;
    const rect = svg.getBoundingClientRect();
    const ratio = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
    let nearest = growthPoints[0];
    for (const p of growthPoints) {
      if (Math.abs(p.x - ratio) < Math.abs(nearest.x - ratio)) nearest = p;
    }
    tip.textContent = `${nearest.date} · ${nearest.count.toLocaleString()} games`;
    tip.hidden = false;
    tip.style.left = `${Math.min(rect.width - 10, Math.max(10, nearest.x * rect.width))}px`;
  }, { passive: true });
  $('gl-charts').addEventListener('mouseleave', () => {
    const tip = document.querySelector('.gl-growth-tip');
    if (tip) tip.hidden = true;
  });

  const debouncedUpdate = debounce(update, 150);

  $('gl-search').addEventListener('input', (e) => { state.q = e.target.value.trim(); debouncedUpdate(); });
  $('gl-players').addEventListener('input', (e) => { state.players = e.target.value; debouncedUpdate(); });
  $('gl-time').addEventListener('change', (e) => { state.time = e.target.value; update(); });
  $('gl-weight').addEventListener('change', (e) => { state.weight = e.target.value; update(); });
  $('gl-rating').addEventListener('change', (e) => { state.rating = e.target.value; update(); });

  $('gl-sort').addEventListener('change', (e) => {
    state.sort = e.target.value;
    state.dir = state.sort === 'name' ? 'asc' : 'desc'; // sensible default per key
    syncDirButton();
    update();
  });
  $('gl-dir').addEventListener('click', () => {
    state.dir = state.dir === 'asc' ? 'desc' : 'asc';
    syncDirButton();
    update();
  });

  for (const picker of PICKERS) {
    $(`${picker.prefix}-btn`).addEventListener('click', () => {
      const panel = $(`${picker.prefix}-panel`);
      const willOpen = panel.hidden;
      document.querySelectorAll('.gl-picker-panel').forEach((p) => { p.hidden = true; });
      panel.hidden = !willOpen;
    });
    $(`${picker.prefix}-search`).addEventListener('input', (e) => {
      const q = e.target.value.toLowerCase();
      $(`${picker.prefix}-list`).querySelectorAll('.gl-mech-item').forEach((item) => {
        item.hidden = !item.dataset.name.toLowerCase().includes(q);
      });
    });
    $(`${picker.prefix}-clear`).addEventListener('click', () => {
      picker.set().clear();
      syncPickerCheckboxes();
      syncPickerButtons();
      update();
    });
  }
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.gl-picker')) {
      document.querySelectorAll('.gl-picker-panel').forEach((p) => { p.hidden = true; });
    }
  });

  $('gl-exp-toggle').addEventListener('click', () => {
    state.exp = !state.exp;
    $('gl-exp-toggle').setAttribute('aria-pressed', String(state.exp));
    update();
  });

  /* ---------------- view + charts preferences (localStorage) ---------------- */

  function applyView(view) {
    $('game-container').classList.toggle('gl-list', view === 'list');
    $('gl-view-grid').setAttribute('aria-pressed', String(view !== 'list'));
    $('gl-view-list').setAttribute('aria-pressed', String(view === 'list'));
    try { localStorage.setItem(VIEW_KEY, view); } catch {}
  }
  $('gl-view-grid').addEventListener('click', () => applyView('grid'));
  $('gl-view-list').addEventListener('click', () => applyView('list'));

  function applyChartsVisible(visible) {
    $('gl-charts').hidden = !visible;
    const btn = $('gl-charts-toggle');
    btn.setAttribute('aria-expanded', String(visible));
    btn.innerHTML = visible ? 'Hide charts &#9652;' : 'Show charts &#9662;';
    try { localStorage.setItem(CHARTS_KEY, visible ? '1' : '0'); } catch {}
  }
  $('gl-charts-toggle').addEventListener('click', () => {
    const showing = $('gl-charts').hidden; // about to show?
    applyChartsVisible(showing);
    if (showing) update(); // charts were not re-rendered while hidden
  });

  try {
    if (localStorage.getItem(VIEW_KEY) === 'list') applyView('list');
    if (localStorage.getItem(CHARTS_KEY) === '0') applyChartsVisible(false);
  } catch {}

  $('gl-share').addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(location.href);
      $('gl-share').textContent = 'Copied!';
    } catch {
      $('gl-share').textContent = location.href.length > 40 ? 'Copy failed' : 'Copy failed';
    }
    setTimeout(() => { $('gl-share').textContent = 'Copy link'; }, 1600);
  });

  $('gl-reset').addEventListener('click', () => {
    state.q = ''; state.players = ''; state.time = ''; state.weight = ''; state.rating = ''; state.exp = false;
    state.mechs.clear(); state.cats.clear(); state.sort = 'name'; state.dir = 'asc';
    writeControlsFromState();
    syncPickerCheckboxes();
    update();
  });

  loadLibrary();
});
