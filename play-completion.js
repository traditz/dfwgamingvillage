/*
 * Play Completion
 * ----------------
 * Cross-references the DFW Gaming Village BGG account's recorded plays against
 * three game sets (owned collection, want-to-play, all-time Top 100) so visitors
 * can see what has and hasn't been played. Played games are highlighted with a
 * play count; unplayed games are greyed out. Each card can be expanded to show
 * which of a game's expansions have been played, inferred from play comments.
 *
 * All BGG access goes through the Cloudflare Worker proxy (see BGG-API.md).
 */
document.addEventListener('DOMContentLoaded', function () {
  // In local dev (served from localhost) the API is same-origin, handled by
  // scripts/dev-server.mjs. In production it's the deployed Cloudflare Worker.
  const PROD_PROXY = 'https://dfwgv-bgg-proxy.joemsprague.workers.dev';
  const IS_LOCAL = ['localhost', '127.0.0.1'].includes(location.hostname);
  const PROXY_BASE = IS_LOCAL ? '' : PROD_PROXY;
  const DEFAULT_USERNAME = 'traditz';
  const USERNAME_RE = /^[A-Za-z0-9_-]{1,32}$/;

  // Active BGG account being viewed; changed via the username field.
  let bggUsername = DEFAULT_USERNAME;

  // Per-id play data: { id: { plays, comments[] } }. Loaded once, reused by every tab.
  let playsById = {};
  let playsLoaded = false;

  // Cache of fetched game sets so switching tabs doesn't refetch.
  const tabCache = { collection: null, want: null, top: null };
  // Cache of fetched expansion lists per base-game id.
  const expansionCache = {};

  let activeTab = 'collection';

  const els = {
    container: document.getElementById('game-container'),
    search: document.getElementById('pc-search'),
    sort: document.getElementById('pc-sort'),
    show: document.getElementById('pc-show'),
    tabs: Array.from(document.querySelectorAll('.pc-tab')),
    summary: document.getElementById('pc-summary'),
    userForm: document.getElementById('pc-user-form'),
    username: document.getElementById('pc-username')
  };

  /* ------------------------------------------------------------------ helpers */

  function num(value, digits = 1) {
    const n = parseFloat(value);
    return Number.isFinite(n) ? n.toFixed(digits) : 'N/A';
  }

  function playsFor(id) {
    return playsById[id] ? playsById[id].plays : 0;
  }

  async function fetchXml(url) {
    let response = await fetch(url);
    while (response.status === 202) {
      // BGG is preparing the data; back off and retry.
      await new Promise((r) => setTimeout(r, 4000));
      response = await fetch(url);
    }
    if (!response.ok) throw new Error(`Request failed (${response.status}): ${url}`);
    const text = await response.text();
    return new DOMParser().parseFromString(text, 'text/xml');
  }

  /* ------------------------------------------------------------------ loaders */

  // Aggregate every recorded play, keyed by BGG id.
  async function loadPlays() {
    if (playsLoaded) return;
    const url = `${PROXY_BASE}/api/bgg-plays?username=${encodeURIComponent(bggUsername)}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Plays request failed (${response.status})`);
    const data = await response.json();
    playsById = data.games || {};
    playsLoaded = true;
  }

  // Owned collection (want === true loads the want-to-play list instead).
  async function loadCollection(want) {
    const url = `${PROXY_BASE}/api/bgg-collection?username=${encodeURIComponent(bggUsername)}${want ? '&want=1' : ''}`;
    const xml = await fetchXml(url);
    return Array.from(xml.querySelectorAll('item')).map((item) => {
      const stats = item.querySelector('stats');
      const rating = stats ? stats.querySelector('rating') : null;
      const geek = rating ? rating.querySelector('bayesaverage') : null;
      const avg = rating ? rating.querySelector('average') : null;
      return {
        id: item.getAttribute('objectid'),
        name: item.querySelector('name')?.textContent || 'Unknown',
        year: item.querySelector('yearpublished')?.textContent || 'N/A',
        image: item.querySelector('thumbnail')?.textContent || item.querySelector('image')?.textContent || '',
        rating: geek?.getAttribute('value') || avg?.getAttribute('value') || 'N/A',
        rank: null
      };
    });
  }

  // All-time Top 100, scraped + cached by the Worker.
  async function loadTop() {
    const response = await fetch(`${PROXY_BASE}/api/bgg-top?count=100`);
    if (!response.ok) throw new Error(`Top-100 request failed (${response.status})`);
    const data = await response.json();
    return (data.games || []).map((g) => ({
      id: String(g.id),
      name: g.name,
      year: g.year,
      image: g.image,
      rating: g.geekRating,
      rank: g.rank
    }));
  }

  async function loadTab(tab) {
    if (tabCache[tab]) return tabCache[tab];
    let games;
    if (tab === 'collection') games = await loadCollection(false);
    else if (tab === 'want') games = await loadCollection(true);
    else games = await loadTop();
    tabCache[tab] = games;
    return games;
  }

  /* ----------------------------------------------------------------- sorting */

  function sortGames(games, key) {
    const sorted = games.slice();
    const byName = (a, b) => a.name.localeCompare(b.name);
    switch (key) {
      case 'name':
        sorted.sort(byName);
        break;
      case 'year':
        sorted.sort((a, b) => (parseInt(b.year, 10) || 0) - (parseInt(a.year, 10) || 0) || byName(a, b));
        break;
      case 'rating':
        sorted.sort((a, b) => (parseFloat(b.rating) || 0) - (parseFloat(a.rating) || 0) || byName(a, b));
        break;
      case 'plays':
        sorted.sort((a, b) => playsFor(b.id) - playsFor(a.id) || byName(a, b));
        break;
      case 'played':
        sorted.sort((a, b) => (playsFor(b.id) > 0) - (playsFor(a.id) > 0) || byName(a, b));
        break;
      case 'rank':
        sorted.sort((a, b) => (a.rank || 9999) - (b.rank || 9999));
        break;
      default:
        sorted.sort(byName);
    }
    return sorted;
  }

  /* --------------------------------------------------------------- rendering */

  function cardHtml(game) {
    const plays = playsFor(game.id);
    const played = plays > 0;
    const rankBadge = game.rank ? `<span class="pc-rank">#${game.rank}</span>` : '';
    const playsBadge = played
      ? `<span class="pc-plays played">${plays} play${plays === 1 ? '' : 's'}</span>`
      : `<span class="pc-plays unplayed">Not played</span>`;
    return `
      <div class="game-card ${played ? 'played' : 'unplayed'}" data-id="${game.id}" data-name="${escapeAttr(game.name)}">
        ${rankBadge}
        <a href="https://boardgamegeek.com/boardgame/${game.id}" target="_blank" rel="noopener">
          <img src="${game.image}" alt="Box art for ${escapeAttr(game.name)}" loading="lazy" />
          <h3>${escapeHtml(game.name)} <span class="pc-year">(${game.year})</span></h3>
        </a>
        <div class="pc-meta">
          <span class="pc-rating">★ ${num(game.rating)}</span>
          ${playsBadge}
        </div>
        <button class="pc-expand" type="button" data-id="${game.id}" aria-expanded="false">
          ▸ Expansions played
        </button>
        <div class="pc-expansions" hidden></div>
      </div>`;
  }

  function render() {
    const games = tabCache[activeTab] || [];
    const query = (els.search.value || '').toLowerCase();
    const show = els.show.value; // all | played | unplayed

    let filtered = games.filter((g) => g.name.toLowerCase().includes(query));
    if (show === 'played') filtered = filtered.filter((g) => playsFor(g.id) > 0);
    else if (show === 'unplayed') filtered = filtered.filter((g) => playsFor(g.id) === 0);

    filtered = sortGames(filtered, els.sort.value);

    const playedCount = games.filter((g) => playsFor(g.id) > 0).length;
    els.summary.textContent = games.length
      ? `${playedCount} of ${games.length} played (${Math.round((playedCount / games.length) * 100)}%)`
      : '';

    if (!filtered.length) {
      els.container.innerHTML = '<p>No games match your filters.</p>';
      return;
    }
    els.container.innerHTML = filtered.map(cardHtml).join('');
  }

  /* -------------------------------------------------------------- expansions */

  // Fetch a base game's expansions and flag which were played. "Played" means
  // the expansion has its own recorded plays, OR its name appears in one of the
  // base game's play comments (the only signal BGG exposes for many users).
  async function loadExpansions(baseId) {
    if (expansionCache[baseId]) return expansionCache[baseId];

    const xml = await fetchXml(`${PROXY_BASE}/api/bgg-thing?id=${encodeURIComponent(baseId)}`);
    const links = Array.from(xml.querySelectorAll('link[type="boardgameexpansion"]'));
    const comments = (playsById[baseId]?.comments || []).join(' \n ').toLowerCase();

    const expansions = links.map((link) => {
      const id = link.getAttribute('id');
      const name = link.getAttribute('value') || 'Unknown expansion';
      const ownPlays = playsFor(id);
      const inComments = isNamedInComments(name, comments);
      return { id, name, plays: ownPlays, played: ownPlays > 0 || inComments, viaComment: inComments && ownPlays === 0 };
    });

    expansions.sort((a, b) => (b.played - a.played) || a.name.localeCompare(b.name));
    expansionCache[baseId] = expansions;
    return expansions;
  }

  // Loose name match: drop the base-game prefix when present (BGG names
  // expansions like "Wingspan: European Expansion") and look for the remainder.
  function isNamedInComments(expansionName, comments) {
    if (!comments) return false;
    const cleaned = expansionName.split(':').pop().trim().toLowerCase();
    const probe = cleaned.length >= 4 ? cleaned : expansionName.toLowerCase();
    return probe.length >= 4 && comments.includes(probe);
  }

  function expansionListHtml(expansions) {
    if (!expansions.length) return '<p class="pc-exp-empty">No expansions listed on BGG.</p>';
    const playedItems = expansions.filter((e) => e.played);
    const header = `<p class="pc-exp-count">${playedItems.length} of ${expansions.length} expansions played</p>`;
    const items = expansions
      .map((e) => {
        const tag = e.plays > 0 ? `${e.plays} play${e.plays === 1 ? '' : 's'}`
          : e.viaComment ? 'noted in comments' : 'not played';
        return `<li class="${e.played ? 'exp-played' : 'exp-unplayed'}">
          <a href="https://boardgamegeek.com/boardgameexpansion/${e.id}" target="_blank" rel="noopener">${escapeHtml(e.name)}</a>
          <span class="exp-tag">${tag}</span>
        </li>`;
      })
      .join('');
    return `${header}<ul class="pc-exp-list">${items}</ul>`;
  }

  async function toggleExpansions(button) {
    const card = button.closest('.game-card');
    const panel = card.querySelector('.pc-expansions');
    const expanded = button.getAttribute('aria-expanded') === 'true';

    if (expanded) {
      panel.hidden = true;
      button.setAttribute('aria-expanded', 'false');
      button.innerHTML = '▸ Expansions played';
      return;
    }

    button.setAttribute('aria-expanded', 'true');
    button.innerHTML = '▾ Expansions played';
    panel.hidden = false;
    if (!panel.dataset.loaded) {
      panel.innerHTML = '<p class="pc-exp-loading">Loading expansions…</p>';
      try {
        const expansions = await loadExpansions(button.dataset.id);
        panel.innerHTML = expansionListHtml(expansions);
      } catch (err) {
        panel.innerHTML = `<p class="pc-exp-empty">Couldn't load expansions (${escapeHtml(err.message)}).</p>`;
      }
      panel.dataset.loaded = '1';
    }
  }

  /* --------------------------------------------------------------- escaping */

  function escapeHtml(str) {
    return String(str).replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));
  }
  function escapeAttr(str) {
    return String(str).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  }

  /* ----------------------------------------------------------------- events */

  async function switchTab(tab) {
    activeTab = tab;
    els.tabs.forEach((t) => t.classList.toggle('active', t.dataset.tab === tab));

    // Top 100 can sort by rank; the others can't — keep the menu honest.
    els.sort.querySelector('option[value="rank"]').hidden = tab !== 'top';
    if (tab === 'top' && els.sort.value === 'name') els.sort.value = 'rank';
    if (tab !== 'top' && els.sort.value === 'rank') els.sort.value = 'name';

    els.container.innerHTML = '<p>Loading…</p>';
    try {
      await loadTab(tab);
      render();
    } catch (err) {
      els.container.innerHTML = `<p style="color:#ff8a8a">Failed to load: ${escapeHtml(err.message)}</p>`;
    }
  }

  els.tabs.forEach((tab) => tab.addEventListener('click', () => switchTab(tab.dataset.tab)));
  els.search.addEventListener('input', render);
  els.sort.addEventListener('change', render);
  els.show.addEventListener('change', render);
  els.container.addEventListener('click', (e) => {
    const button = e.target.closest('.pc-expand');
    if (button) toggleExpansions(button);
  });
  els.userForm.addEventListener('submit', (e) => {
    e.preventDefault();
    submitUsername();
  });

  /* ------------------------------------------------------------ user switch */

  // Clear everything that depends on the viewed user. The Top-100 list itself is
  // global, so it's kept; its played/unplayed state recomputes from new plays.
  function resetUserData() {
    playsById = {};
    playsLoaded = false;
    tabCache.collection = null;
    tabCache.want = null;
    for (const key in expansionCache) delete expansionCache[key];
  }

  async function loadForUser(name) {
    bggUsername = name;
    resetUserData();
    els.username.value = name;

    // Keep the URL shareable / reload-safe (?user=name).
    const url = new URL(location.href);
    url.searchParams.set('user', name);
    history.replaceState(null, '', url);

    els.container.innerHTML = `<p>Loading play history for “${escapeHtml(name)}” from BoardGameGeek…</p>`;
    try {
      await loadPlays(); // Needed before any tab can compute played/unplayed.
      await switchTab(activeTab);
    } catch (err) {
      els.container.innerHTML =
        `<p style="color:#ff8a8a">Failed to load data for “${escapeHtml(name)}”. ${escapeHtml(err.message)}</p>` +
        `<p style="color:#ccc;font-size:small">Check the username, or the BGG proxy may need to be redeployed with the new endpoints.</p>`;
    }
  }

  function submitUsername() {
    const name = els.username.value.trim();
    if (!USERNAME_RE.test(name)) {
      els.container.innerHTML =
        '<p style="color:#ff8a8a">Please enter a valid BoardGameGeek username (letters, numbers, underscores or hyphens).</p>';
      return;
    }
    loadForUser(name);
  }

  /* -------------------------------------------------------------- bootstrap */

  const startUser = (new URLSearchParams(location.search).get('user') || '').trim();
  loadForUser(USERNAME_RE.test(startUser) ? startUser : DEFAULT_USERNAME);
});
