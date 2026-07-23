/*
 * Library Admin dashboard (unlisted, token-gated).
 *
 * Tools for library expansion, procurement, and curation:
 *  - Procurement: Top-100 gaps, coverage-gap matrix, BGG wishlist / want-to-play
 *    queues, missing-expansion finder
 *  - Curation: cull candidates (uses play data), saturated mechanics, lowest-rated
 *  - Pricing: BGG Marketplace (second-hand) listings + external market links
 *  - Letters: publisher donation-request drafting engine
 *
 * The token is verified against the worker (/api/admin-verify, same secret as
 * the analytics dashboard). All BGG data is public; the token gates the tooling.
 */
document.addEventListener('DOMContentLoaded', function () {
  const WORKER = 'https://dfwgv-bgg-proxy.joemsprague.workers.dev';
  const USERNAME = 'traditz';
  const TOKEN_KEY = 'dfwgvAdminToken';

  const $ = (id) => document.getElementById(id);
  const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

  let snapshot = null;   // games-library.json
  let candidates = null; // candidates.json (Top 1000, enriched)
  let hotHistory = {};   // date -> [{id,rank,name}] (worker KV, daily cron)
  let playsById = {};    // id -> total plays
  let top100 = [];       // [{rank,id,name,year,geekRating,...}]
  let hotList = [];      // BGG Hotness [{rank,id,name,year}]
  let wantList = [];     // want-to-play items
  let wishList = [];     // wishlist items
  let ownedIds = new Set();
  let ownedNames = new Set(); // normalized names — catches other editions of owned games
  let publisherByGame = new Map(); // game id -> {id, name} (hydrated on demand)

  // "7 Wonders (Second Edition)" and "7 Wonders" are the same shelf presence:
  // strip trailing parentheticals and punctuation before comparing names.
  const normName = (s) => String(s || '').toLowerCase().replace(/\s*\([^)]*\)\s*$/, '').replace(/[^a-z0-9]+/g, ' ').trim();

  // Owned by id, or owned as a different edition/printing under another BGG id.
  const isOwnedGame = (id, name) => ownedIds.has(String(id)) || ownedNames.has(normName(name));

  /* ================= token gate ================= */

  async function verifyToken(token) {
    try {
      const res = await fetch(`${WORKER}/api/admin-verify`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return res.ok;
    } catch { return false; }
  }

  async function tryUnlock(token, silent) {
    if (!token) return;
    $('adm-gate-msg').textContent = 'Checking…';
    if (await verifyToken(token)) {
      localStorage.setItem(TOKEN_KEY, token);
      $('adm-gate').hidden = true;
      $('adm-app').hidden = false;
      loadData();
    } else {
      $('adm-gate-msg').textContent = silent ? '' : 'Invalid token.';
      localStorage.removeItem(TOKEN_KEY);
    }
  }

  $('adm-token-btn').addEventListener('click', () => tryUnlock($('adm-token').value.trim(), false));
  $('adm-token').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') tryUnlock($('adm-token').value.trim(), false);
  });
  const saved = localStorage.getItem(TOKEN_KEY);
  if (saved) tryUnlock(saved, true);

  /* ================= tabs ================= */

  document.querySelector('.adm-tabs').addEventListener('click', (e) => {
    const btn = e.target.closest('[data-tab]');
    if (!btn) return;
    document.querySelectorAll('.adm-tabs [data-tab]').forEach((b) => b.classList.toggle('active', b === btn));
    document.querySelectorAll('.adm-tab').forEach((s) => { s.hidden = s.id !== `adm-${btn.dataset.tab}`; });
  });

  /* ================= data loading ================= */

  async function fetchCollectionXml(extra) {
    // BGG answers 202 while it builds a list; retry a few times, then give up.
    for (let attempt = 0; attempt < 4; attempt++) {
      const res = await fetch(`${WORKER}/api/bgg-collection?username=${USERNAME}${extra}`);
      if (res.status === 202) { await new Promise((r) => setTimeout(r, 4000)); continue; }
      if (!res.ok) return [];
      const xml = new DOMParser().parseFromString(await res.text(), 'text/xml');
      return [...xml.querySelectorAll('item')].map((item) => ({
        id: item.getAttribute('objectid'),
        name: item.querySelector('name')?.textContent || 'Unknown',
        year: item.querySelector('yearpublished')?.textContent || '',
        thumb: item.querySelector('thumbnail')?.textContent || '',
        rating: parseFloat(item.querySelector('stats rating average')?.getAttribute('value')) || 0,
        priority: parseInt(item.querySelector('status')?.getAttribute('wishlistpriority') || '0', 10)
      }));
    }
    return [];
  }

  async function loadData() {
    const status = $('adm-status');
    status.textContent = 'Loading library data…';
    try {
      const [snapRes, topRes, playsRes, hotRes] = await Promise.all([
        fetch('games-library.json'),
        fetch(`${WORKER}/api/bgg-top?count=100`),
        fetch(`${WORKER}/api/bgg-plays?username=${USERNAME}`),
        fetch(`${WORKER}/api/bgg-hot`)
      ]);
      snapshot = await snapRes.json();
      ownedIds = new Set(snapshot.games.map((g) => g.id));
      ownedNames = new Set(snapshot.games.map((g) => normName(g.name)));
      const top = await topRes.json();
      top100 = top.games || [];
      const plays = await playsRes.json();
      for (const [id, rec] of Object.entries(plays.games || {})) playsById[id] = rec.plays;
      const hotXml = new DOMParser().parseFromString(await hotRes.text(), 'text/xml');
      hotList = [...hotXml.querySelectorAll('item')].map((item) => ({
        id: item.getAttribute('id'),
        rank: parseInt(item.getAttribute('rank'), 10) || 0,
        name: item.querySelector('name')?.getAttribute('value') || 'Unknown',
        year: item.querySelector('yearpublished')?.getAttribute('value') || ''
      }));
    } catch (err) {
      status.textContent = `Failed to load data: ${err.message}`;
      return;
    }
    // Optional inputs — the dashboard degrades gracefully without them.
    try {
      const res = await fetch('candidates.json');
      if (res.ok) candidates = await res.json();
    } catch {}
    try {
      const res = await fetch(`${WORKER}/api/hot-history`);
      if (res.ok) hotHistory = await res.json();
    } catch {}
    status.textContent = '';
    renderProcurement();
    renderSuggestions();
    renderCuration();
    renderPricing();
    hydratePublishers().catch(() => {});

    // Wishlist / want-to-play load slowly on BGG's side — fill in when ready.
    fetchCollectionXml('&wishlist=1').then((items) => { wishList = items; renderQueues(); });
    fetchCollectionXml('&want=1').then((items) => { wantList = items; renderQueues(); });
  }

  const bestNums = (bestWith) => {
    const nums = new Set();
    for (const part of (bestWith || '').split(',')) {
      const m = part.trim().match(/^(\d+)(?:\s*[–-]\s*(\d+))?\+?$/);
      if (!m) continue;
      const hi = m[2] ? parseInt(m[2], 10) : parseInt(m[1], 10);
      for (let n = parseInt(m[1], 10); n <= hi; n++) nums.add(n);
    }
    return nums;
  };

  const gameLink = (id, name) => `<a href="https://boardgamegeek.com/boardgame/${id}" target="_blank" rel="noopener">${esc(name)}</a>`;

  /* ================= procurement ================= */

  const pubCell = (gameId) => `<td class="adm-pub" data-pub-for="${gameId}"><span class="adm-dim">…</span></td>`;

  function computeCoverage() {
    const bands = [
      { label: 'Light (<2)', test: (w) => w > 0 && w < 2 },
      { label: 'Medium (2–3)', test: (w) => w >= 2 && w < 3 },
      { label: 'Heavy (3+)', test: (w) => w >= 3 }
    ];
    const cols = [1, 2, 3, 4, 5, 6, 7, 8];
    const cells = bands.map((band) => cols.map((n) => snapshot.games.filter((g) => {
      if (!band.test(g.weight)) return false;
      const best = bestNums(g.bestWith);
      return n === 8 ? [...best].some((b) => b >= 8) : best.has(n);
    }).length));
    return { bands, cols, cells };
  }

  function renderProcurement() {
    const gaps = top100.filter((t) => !isOwnedGame(t.id, t.name));
    const gapRows = gaps.map((t) => `
      <tr>
        <td>#${t.rank}</td>
        <td>${gameLink(t.id, t.name)} <span class="adm-dim">(${esc(t.year)})</span></td>
        <td>${esc(t.geekRating)}</td>
        ${pubCell(t.id)}
        <td><button type="button" class="adm-mini" data-price-id="${t.id}" data-price-name="${esc(t.name)}">Price</button></td>
      </tr>`).join('');

    const hotGaps = hotList.filter((h) => !isOwnedGame(h.id, h.name));
    const hotRows = hotGaps.map((h) => `
      <tr>
        <td>#${h.rank}</td>
        <td>${gameLink(h.id, h.name)} <span class="adm-dim">${h.year ? `(${esc(h.year)})` : ''}</span></td>
        ${pubCell(h.id)}
        <td><button type="button" class="adm-mini" data-price-id="${h.id}" data-price-name="${esc(h.name)}">Price</button></td>
      </tr>`).join('');

    // Coverage: owned games best at N, by weight band.
    const { bands, cols, cells } = computeCoverage();
    const matrix = `
      <table class="adm-table adm-matrix">
        <thead><tr><th>Best at →</th>${cols.map((c) => `<th>${c === 8 ? '8+' : c}</th>`).join('')}</tr></thead>
        <tbody>${bands.map((band, i) => `
          <tr><th>${band.label}</th>${cells[i].map((n) => `
            <td class="${n < 4 ? 'adm-cell-low' : n < 9 ? 'adm-cell-mid' : ''}">${n}</td>`).join('')}
          </tr>`).join('')}
        </tbody>
      </table>`;

    const catCounts = new Map();
    for (const g of snapshot.games) for (const i of g.cat || []) catCounts.set(i, (catCounts.get(i) || 0) + 1);
    const thinThemes = [...catCounts.entries()].sort((a, b) => a[1] - b[1]).slice(0, 10)
      .map(([i, n]) => `<span class="adm-chip">${esc(snapshot.categories[i])} · ${n}</span>`).join(' ');

    // The missing-expansions panel fills asynchronously — see analyzeExpansions().

    $('adm-procure').innerHTML = `
      <div class="adm-panel"><h2>Suggested acquisitions</h2>
        <p class="adm-dim">Top-1000 games rated 7.0+, not owned, scored on quality (35%), library gap-fill (25%), your community's taste from play data (25%), and sustained BGG hotness (15%). Reasons shown per game.</p>
        <div id="adm-suggest-out"></div>
      </div>
      <div class="adm-panel"><h2>BGG Top 100 — not in the library (${gaps.length})</h2>
        <p class="adm-dim">Publisher links go to the BGG company page, which lists each publisher's website and contact details.</p>
        <div class="adm-scroll"><table class="adm-table">
          <thead><tr><th>Rank</th><th>Game</th><th>Geek rating</th><th>Publisher</th><th></th></tr></thead>
          <tbody>${gapRows}</tbody>
        </table></div>
      </div>
      <div class="adm-panel"><h2>Trending on BGG — not in the library (${hotGaps.length} of ${hotList.length})</h2>
        <p class="adm-dim">BGG's live Hotness list — what the community is buzzing about right now. Refreshes hourly.</p>
        <div class="adm-scroll"><table class="adm-table">
          <thead><tr><th>Hot</th><th>Game</th><th>Publisher</th><th></th></tr></thead>
          <tbody>${hotRows}</tbody>
        </table></div>
      </div>
      <div class="adm-panel"><h2>Coverage gaps</h2>
        <p class="adm-dim">Owned games that are community-best at each player count. Red = thin (&lt;4), amber = moderate (&lt;9).</p>
        <div class="adm-scroll">${matrix}</div>
        <p class="adm-dim" style="margin-top:12px">Thinnest themes:</p>
        <p>${thinThemes}</p>
      </div>
      <div class="adm-panel" id="adm-queues"><h2>Acquisition queues</h2><p class="adm-dim">Loading BGG wishlist and want-to-play lists…</p></div>
      <div class="adm-panel"><h2>Missing expansions</h2>
        <p class="adm-dim">Library games with expansions on BGG that the library doesn't own, ranked by how much the game gets played. Games with no expansions (or with every expansion owned) are excluded.</p>
        <div id="adm-exp-out"><p class="adm-dim">Analyzing the most-played games…</p></div>
      </div>`;

    analyzeExpansions().catch((err) => {
      const el = $('adm-exp-out');
      if (el) el.innerHTML = `<p class="adm-dim">Expansion analysis failed: ${esc(err.message)}</p>`;
    });
  }

  /**
   * For the top-played library games, pull each game's full expansion list
   * from BGG and keep only those with expansions the library lacks.
   */
  async function analyzeExpansions() {
    const SCAN = 40; // two batched thing calls
    const top = snapshot.games.slice()
      .sort((a, b) => (playsById[b.id] || 0) - (playsById[a.id] || 0) || b.rating - a.rating)
      .slice(0, SCAN);
    const results = [];
    let failedBatches = 0;
    for (let i = 0; i < top.length; i += 20) {
      const batch = top.slice(i, i + 20);
      const res = await fetch(`${WORKER}/api/bgg-thing?id=${batch.map((g) => g.id).join(',')}`);
      if (!res.ok) { failedBatches++; continue; }
      const xml = new DOMParser().parseFromString(await res.text(), 'text/xml');
      for (const item of xml.querySelectorAll('item')) {
        const game = snapshot.games.find((g) => g.id === item.getAttribute('id'));
        if (!game) continue;
        const owned = new Set((game.exp || []).map((x) => x.id));
        const all = [...item.querySelectorAll('link[type="boardgameexpansion"]:not([inbound])')]
          .map((l) => ({ id: l.getAttribute('id'), name: l.getAttribute('value') }));
        const missing = all.filter((x) => !owned.has(x.id));
        if (all.length && missing.length) {
          results.push({ game, ownedCount: owned.size, total: all.length, missing });
        }
      }
    }

    const el = $('adm-exp-out');
    if (!el) return;
    const warning = failedBatches
      ? `<p class="adm-dim">BGG did not answer ${failedBatches === 2 ? 'the expansion lookups' : 'part of the expansion lookup'} (likely rate-limiting) — reload the page to retry.${results.length ? ' Partial results below.' : ''}</p>`
      : '';
    if (!results.length) {
      el.innerHTML = warning || '<p class="adm-dim">The most-played games have every available expansion. 🎉</p>';
      return;
    }
    el.innerHTML = `${warning}
      <div class="adm-scroll"><table class="adm-table">
        <thead><tr><th>Game</th><th>Owned</th><th>Missing expansions</th></tr></thead>
        <tbody>${results.map((r) => `
          <tr>
            <td>${gameLink(r.game.id, r.game.name)}<br><span class="adm-dim">${playsById[r.game.id] || 0} plays</span></td>
            <td class="adm-dim">${r.ownedCount} of ${r.total}</td>
            <td>${r.missing.map((x) => gameLink(x.id, x.name)).join(' · ')}</td>
          </tr>`).join('')}
        </tbody>
      </table></div>
      <p class="adm-dim" style="margin-top:8px">Scanned the ${SCAN} most-played library games — ${results.length} have unowned expansions. BGG counts promos and small packs as expansions, so totals run high.</p>`;
  }

  function renderQueues() {
    const el = $('adm-queues');
    if (!el) return;
    const PRIORITY = { 1: 'Must have', 2: 'Love to have', 3: 'Like to have', 4: 'Thinking about', 5: "Don't buy" };
    const listTable = (items, withPriority) => items.length ? `
      <div class="adm-scroll"><table class="adm-table">
        <thead><tr><th>Game</th><th>Rating</th>${withPriority ? '<th>Priority</th>' : ''}<th></th></tr></thead>
        <tbody>${items.map((i) => `
          <tr>
            <td>${gameLink(i.id, i.name)} <span class="adm-dim">(${esc(i.year)})</span></td>
            <td>${i.rating ? i.rating.toFixed(1) : '–'}</td>
            ${withPriority ? `<td>${PRIORITY[i.priority] || '–'}</td>` : ''}
            <td><button type="button" class="adm-mini" data-price-id="${i.id}" data-price-name="${esc(i.name)}">Price</button></td>
          </tr>`).join('')}
        </tbody>
      </table></div>` : '<p class="adm-dim">Empty — add games on boardgamegeek.com and they appear here.</p>';

    el.innerHTML = `
      <h2>Acquisition queues</h2>
      <h3 class="adm-sub">BGG wishlist (${wishList.length})</h3>
      ${listTable(wishList.slice().sort((a, b) => (a.priority || 9) - (b.priority || 9)), true)}
      <h3 class="adm-sub">Want-to-play (${wantList.length})</h3>
      ${listTable(wantList, false)}`;
    renderSuggestions(); // refresh "on your BGG lists" chips
  }

  /**
   * The acquisition engine: score every unowned Top-1000 candidate rated 7.0+
   * on four transparent signals and show WHY each game scored what it did.
   */
  function renderSuggestions() {
    const out = $('adm-suggest-out');
    if (!out) return;
    if (!candidates) {
      out.innerHTML = '<p class="adm-dim">Candidate pool not built yet — run <code>node scripts/refresh-candidates.mjs</code> and commit candidates.json.</p>';
      return;
    }

    const cov = computeCoverage();
    const catCounts = new Map();
    for (const g of snapshot.games) for (const i of g.cat || []) {
      catCounts.set(snapshot.categories[i], (catCounts.get(snapshot.categories[i]) || 0) + 1);
    }
    const thinThemes = new Set([...catCounts.entries()].sort((a, b) => a[1] - b[1]).slice(0, 10).map((e) => e[0]));

    // Taste = what the community actually plays, weighted by play counts.
    const mechPlays = new Map();
    const catPlays = new Map();
    for (const g of snapshot.games) {
      const p = playsById[g.id] || 0;
      if (!p) continue;
      for (const i of g.mech || []) mechPlays.set(snapshot.mechanics[i], (mechPlays.get(snapshot.mechanics[i]) || 0) + p);
      for (const i of g.cat || []) catPlays.set(snapshot.categories[i], (catPlays.get(snapshot.categories[i]) || 0) + p);
    }

    // Momentum = days on the Hotness list over the recorded window (≤30 days).
    const dates = Object.keys(hotHistory).sort().slice(-30);
    const recordedDays = Math.max(1, dates.length);
    const hotDays = new Map();
    for (const d of dates) for (const g of hotHistory[d] || []) hotDays.set(String(g.id), (hotDays.get(String(g.id)) || 0) + 1);

    const queueIds = new Set(wishList.concat(wantList).map((i) => i.id));
    const pool = candidates.games.filter((c) => !isOwnedGame(c.id, c.name) && c.rating >= 7);

    let maxTaste = 0;
    const scored = pool.map((c) => {
      const mechNames = (c.mech || []).map((i) => candidates.mechanics[i]);
      const catNames = (c.cat || []).map((i) => candidates.categories[i]);
      const quality = Math.min(1, Math.max(0, (c.rating - 7) / 1.5));

      const band = c.weight >= 3 ? 2 : c.weight >= 2 ? 1 : 0;
      let gap = 0;
      let gapWhy = '';
      for (const n of bestNums(c.bestWith)) {
        const col = Math.min(n, 8);
        const count = cov.cells[band][col - 1];
        const s = count < 4 ? 1 : count < 9 ? 0.5 : 0;
        if (s > gap) { gap = s; gapWhy = `fills best-at-${col === 8 ? '8+' : col} · ${cov.bands[band].label.toLowerCase()}`; }
      }
      const thinCat = catNames.find((n) => thinThemes.has(n));
      if (gap < 0.6 && thinCat) { gap = 0.6; gapWhy = `thin theme: ${thinCat}`; }

      let tasteRaw = 0;
      const contrib = [];
      for (const n of mechNames) {
        const w = mechPlays.get(n) || 0;
        tasteRaw += w;
        if (w) contrib.push([n, w]);
      }
      for (const n of catNames) tasteRaw += (catPlays.get(n) || 0) * 0.5;
      maxTaste = Math.max(maxTaste, tasteRaw);

      return {
        c, quality, gap, gapWhy, tasteRaw,
        tasteWhy: contrib.sort((a, b) => b[1] - a[1]).slice(0, 2).map((x) => x[0]).join(', '),
        hotN: hotDays.get(String(c.id)) || 0
      };
    });

    const rows = scored.map((s) => {
      const taste = maxTaste ? s.tasteRaw / maxTaste : 0;
      const momentum = Math.min(1, s.hotN / Math.min(recordedDays, 30));
      s.score = Math.round(100 * (0.35 * s.quality + 0.25 * s.gap + 0.25 * taste + 0.15 * momentum));
      s.taste = taste;
      s.momentum = momentum;
      return s;
    }).sort((a, b) => b.score - a.score).slice(0, 40);

    out.innerHTML = `
      <div class="adm-scroll"><table class="adm-table">
        <thead><tr><th>Score</th><th>Game</th><th>Publisher</th><th></th></tr></thead>
        <tbody>${rows.map((s) => `
          <tr>
            <td><strong>${s.score}</strong></td>
            <td>
              ${gameLink(s.c.id, s.c.name)} <span class="adm-dim">(${s.c.year || '–'}) · BGG #${s.c.rank}</span><br>
              <span class="adm-chip">★ ${s.c.rating.toFixed(1)}</span>
              ${s.gap ? `<span class="adm-chip">${esc(s.gapWhy)}</span>` : ''}
              ${s.taste > 0.25 && s.tasteWhy ? `<span class="adm-chip">taste: ${esc(s.tasteWhy)}</span>` : ''}
              ${s.hotN ? `<span class="adm-chip">hot ${s.hotN}/${Math.min(recordedDays, 30)} days</span>` : ''}
              ${queueIds.has(String(s.c.id)) ? '<span class="adm-chip">on your BGG lists</span>' : ''}
            </td>
            <td>${s.c.pubName ? `
              <a href="https://boardgamegeek.com/boardgamepublisher/${s.c.pubId}" target="_blank" rel="noopener" title="BGG company page — website and contact info">${esc(s.c.pubName)}</a>
              <a class="adm-dim" href="https://www.google.com/search?q=${encodeURIComponent(`${s.c.pubName} board game publisher contact`)}" target="_blank" rel="noopener" title="Search for contact details">🔎</a>` : '–'}
            </td>
            <td><button type="button" class="adm-mini" data-price-id="${s.c.id}" data-price-name="${esc(s.c.name)}">Price</button></td>
          </tr>`).join('')}
        </tbody>
      </table></div>
      <p class="adm-dim" style="margin-top:8px">${pool.length.toLocaleString()} candidates scored (Top 1000, rating ≥ 7.0, not owned) · candidates refreshed ${esc(candidates.generatedAt)} · hotness history: ${recordedDays} day${recordedDays === 1 ? '' : 's'} recorded</p>`;
  }

  /**
   * Fill every publisher cell in the procurement tables. BGG's thing data
   * carries publisher id + name (the primary publisher is listed first);
   * the BGG company page for that id is where website/contact info lives.
   */
  async function hydratePublishers() {
    const cells = [...document.querySelectorAll('[data-pub-for]')];
    const need = [...new Set(cells.map((c) => c.dataset.pubFor))].filter((id) => !publisherByGame.has(id));
    for (let i = 0; i < need.length; i += 20) {
      try {
        const res = await fetch(`${WORKER}/api/bgg-thing?id=${need.slice(i, i + 20).join(',')}`);
        if (!res.ok) continue;
        const xml = new DOMParser().parseFromString(await res.text(), 'text/xml');
        for (const item of xml.querySelectorAll('item')) {
          const link = item.querySelector('link[type="boardgamepublisher"]');
          if (link) {
            publisherByGame.set(item.getAttribute('id'), {
              id: link.getAttribute('id'),
              name: link.getAttribute('value')
            });
          }
        }
      } catch { /* leave those cells as-is; retried on next tab render */ }
      fillPublisherCells();
    }
    fillPublisherCells();
  }

  function fillPublisherCells() {
    for (const cell of document.querySelectorAll('[data-pub-for]')) {
      const pub = publisherByGame.get(cell.dataset.pubFor);
      if (!pub) continue;
      cell.innerHTML = `
        <a href="https://boardgamegeek.com/boardgamepublisher/${pub.id}" target="_blank" rel="noopener" title="BGG company page — website and contact info">${esc(pub.name)}</a>
        <a class="adm-dim" href="https://www.google.com/search?q=${encodeURIComponent(`${pub.name} board game publisher contact`)}" target="_blank" rel="noopener" title="Search for contact details">🔎</a>`;
    }
  }

  /* ================= curation ================= */

  function renderCuration() {
    const yearAgo = new Date(Date.now() - 365 * 24 * 3600 * 1000).toISOString().slice(0, 10);
    const cull = snapshot.games
      .filter((g) => g.rating > 0 && !(playsById[g.id] > 0) && g.added && g.added < yearAgo)
      .sort((a, b) => a.rating - b.rating)
      .slice(0, 40);
    const cullRows = cull.map((g) => `
      <tr>
        <td>${gameLink(g.id, g.name)} <span class="adm-dim">(${g.year || '–'})</span></td>
        <td>${g.rating.toFixed(1)}</td>
        <td>${g.weight ? g.weight.toFixed(1) : '–'}</td>
        <td>0</td>
        <td class="adm-dim">${g.added}</td>
        <td><button type="button" class="adm-mini" data-price-id="${g.id}" data-price-name="${esc(g.name)}">Resale</button></td>
      </tr>`).join('');

    const mechCounts = new Map();
    for (const g of snapshot.games) for (const i of g.mech || []) mechCounts.set(i, (mechCounts.get(i) || 0) + 1);
    const saturated = [...mechCounts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 8).map(([i, n]) => {
      const weakest = snapshot.games
        .filter((g) => (g.mech || []).includes(i) && g.rating > 0)
        .sort((a, b) => a.rating - b.rating).slice(0, 5);
      return `<div class="adm-sat">
        <h3 class="adm-sub">${esc(snapshot.mechanics[i])} <span class="adm-dim">— ${n} games; weakest:</span></h3>
        <p>${weakest.map((g) => `${gameLink(g.id, g.name)} <span class="adm-dim">${g.rating.toFixed(1)}</span>`).join(' · ')}</p>
      </div>`;
    }).join('');

    const lowest = snapshot.games.filter((g) => g.rating > 0).sort((a, b) => a.rating - b.rating).slice(0, 20);
    const lowRows = lowest.map((g) => `
      <tr>
        <td>${gameLink(g.id, g.name)} <span class="adm-dim">(${g.year || '–'})</span></td>
        <td>${g.rating.toFixed(1)}</td>
        <td>${playsById[g.id] || 0}</td>
      </tr>`).join('');

    $('adm-curate').innerHTML = `
      <div class="adm-panel"><h2>Cull candidates (${cull.length})</h2>
        <p class="adm-dim">Owned over a year, zero recorded plays, sorted by BGG rating. Least defensible shelf space first.</p>
        <div class="adm-scroll"><table class="adm-table">
          <thead><tr><th>Game</th><th>Rating</th><th>Weight</th><th>Plays</th><th>Added</th><th></th></tr></thead>
          <tbody>${cullRows}</tbody>
        </table></div>
      </div>
      <div class="adm-panel"><h2>Saturated mechanics</h2>
        <p class="adm-dim">Where the library is over-invested — the weakest games in each crowded mechanic are natural cut candidates.</p>
        ${saturated}
      </div>
      <div class="adm-panel"><h2>Lowest-rated in the library</h2>
        <div class="adm-scroll"><table class="adm-table">
          <thead><tr><th>Game</th><th>Rating</th><th>Plays</th></tr></thead>
          <tbody>${lowRows}</tbody>
        </table></div>
      </div>`;
  }

  /* ================= pricing ================= */

  function knownGames() {
    const seen = new Map();
    for (const g of snapshot.games) seen.set(g.id, { id: g.id, name: g.name, tag: 'owned' });
    for (const t of top100) if (!seen.has(String(t.id))) seen.set(String(t.id), { id: String(t.id), name: t.name, tag: 'top 100' });
    for (const i of wishList.concat(wantList)) if (!seen.has(i.id)) seen.set(i.id, { id: i.id, name: i.name, tag: 'wishlist' });
    return [...seen.values()];
  }

  function renderPricing() {
    $('adm-price').innerHTML = `
      <div class="adm-panel"><h2>Game pricing</h2>
        <p class="adm-dim">Second-hand (BGG Marketplace) and new-retail (US stores) pricing for <strong>any</strong> game — owned or not. Results beyond the library come from a live BGG search.</p>
        <div class="adm-price-search">
          <input type="text" id="adm-price-input" placeholder="Search any game to price..." autocomplete="off">
          <div id="adm-price-suggest" class="adm-suggest" hidden></div>
        </div>
        <div id="adm-price-result"></div>
      </div>`;

    const input = $('adm-price-input');
    const suggest = $('adm-price-suggest');
    let searchSeq = 0;

    const showSuggestions = (local, remote) => {
      const seen = new Set();
      const merged = [];
      for (const m of local.concat(remote)) {
        if (seen.has(m.id)) continue;
        seen.add(m.id);
        merged.push(m);
        if (merged.length >= 10) break;
      }
      suggest.innerHTML = merged.map((m) => `
        <button type="button" data-price-id="${m.id}" data-price-name="${esc(m.name)}">${esc(m.name)}${m.year ? ` <span class="adm-dim">(${esc(m.year)})</span>` : ''} <span class="adm-dim">${m.tag}</span></button>`).join('');
      suggest.hidden = merged.length === 0;
    };

    const remoteSearch = debounce(async (q, seq) => {
      try {
        const res = await fetch(`${WORKER}/api/bgg-search?q=${encodeURIComponent(q)}`);
        if (!res.ok || seq !== searchSeq) return;
        const xml = new DOMParser().parseFromString(await res.text(), 'text/xml');
        const remote = [...xml.querySelectorAll('item')].map((item) => ({
          id: item.getAttribute('id'),
          name: item.querySelector('name')?.getAttribute('value') || 'Unknown',
          year: item.querySelector('yearpublished')?.getAttribute('value') || '',
          tag: 'BGG'
        }));
        if (seq !== searchSeq || $('adm-price-input').value.trim().toLowerCase() !== q) return;
        const local = knownGames().filter((g) => g.name.toLowerCase().includes(q)).slice(0, 5);
        showSuggestions(local, remote);
      } catch { /* keep whatever suggestions are showing */ }
    }, 400);

    input.addEventListener('input', () => {
      const q = input.value.trim().toLowerCase();
      if (q.length < 2) { suggest.hidden = true; return; }
      const local = knownGames().filter((g) => g.name.toLowerCase().includes(q)).slice(0, 8);
      showSuggestions(local, []); // instant local results; BGG results replace shortly
      searchSeq++;
      remoteSearch(q, searchSeq);
    });
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.adm-price-search')) suggest.hidden = true;
    });
  }

  function debounce(fn, ms) {
    let t;
    return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), ms); };
  }

  // Any "Price"/"Resale" button anywhere jumps to the pricing tab for that game.
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-price-id]');
    if (!btn) return;
    document.querySelector('.adm-tabs [data-tab="price"]').click();
    $('adm-price-input').value = btn.dataset.priceName;
    $('adm-price-suggest').hidden = true;
    priceGame(btn.dataset.priceId, btn.dataset.priceName);
  });

  async function priceGame(id, name) {
    const out = $('adm-price-result');
    out.innerHTML = `<p class="adm-dim">Fetching BGG Marketplace listings for ${esc(name)}…</p>`;
    let listings = [];
    try {
      const res = await fetch(`${WORKER}/api/bgg-thing?id=${id}&marketplace=1`);
      const xml = new DOMParser().parseFromString(await res.text(), 'text/xml');
      listings = [...xml.querySelectorAll('marketplacelistings listing')].map((l) => {
        const val = (sel, attr) => l.querySelector(sel)?.getAttribute(attr || 'value') || '';
        return {
          date: (val('listdate') || l.querySelector('listdate')?.textContent || '').slice(0, 16),
          price: parseFloat(val('price')) || 0,
          currency: l.querySelector('price')?.getAttribute('currency') || '',
          condition: val('condition') || '–',
          link: l.querySelector('link')?.getAttribute('href') || ''
        };
      });
    } catch (err) {
      out.innerHTML = `<p class="adm-dim">Marketplace lookup failed: ${esc(err.message)}</p>`;
      return;
    }

    // US filter: BGG's feed has no seller location, so USD currency is the
    // closest available proxy — non-USD listings are hidden entirely.
    const total = listings.length;
    const usdListings = listings.filter((l) => l.currency === 'USD' && l.price > 0);
    const hidden = total - usdListings.length;
    const usd = usdListings.map((l) => l.price).sort((a, b) => a - b);
    const median = usd.length ? usd[Math.floor(usd.length / 2)] : 0;
    const summary = usd.length
      ? `<div class="adm-price-stats">
          <div class="gl-stat"><span class="gl-stat-label">USD listings</span><span class="gl-stat-value">${usd.length}</span><span class="gl-stat-sub">${hidden ? `${hidden} non-USD hidden` : 'all listings'}</span></div>
          <div class="gl-stat"><span class="gl-stat-label">Lowest</span><span class="gl-stat-value">$${usd[0].toFixed(0)}</span><span class="gl-stat-sub">USD</span></div>
          <div class="gl-stat"><span class="gl-stat-label">Median</span><span class="gl-stat-value">$${median.toFixed(0)}</span><span class="gl-stat-sub">USD</span></div>
          <div class="gl-stat"><span class="gl-stat-label">Highest</span><span class="gl-stat-value">$${usd[usd.length - 1].toFixed(0)}</span><span class="gl-stat-sub">USD</span></div>
        </div>`
      : `<p class="adm-dim">No current USD listings on the BGG Marketplace${hidden ? ` (${hidden} non-USD hidden)` : ''}.</p>`;

    const rows = usdListings.sort((a, b) => a.price - b.price).slice(0, 25).map((l) => `
      <tr>
        <td>$${l.price.toFixed(2)}</td>
        <td>${esc(l.condition)}</td>
        <td class="adm-dim">${esc(l.date)}</td>
        <td>${l.link ? `<a href="${esc(l.link)}" target="_blank" rel="noopener">listing ↗</a>` : ''}</td>
      </tr>`).join('');

    const q = encodeURIComponent(`${name} board game`);
    out.innerHTML = `
      <h3 class="adm-sub">${gameLink(id, name)} <span class="adm-dim">— second-hand (BGG Marketplace)</span></h3>
      ${summary}
      ${usdListings.length ? `<div class="adm-scroll"><table class="adm-table">
        <thead><tr><th>Price</th><th>Condition</th><th>Listed</th><th></th></tr></thead>
        <tbody>${rows}</tbody></table></div>` : ''}
      <div id="adm-retail"><p class="adm-dim" style="margin-top:12px">Checking retailer prices…</p></div>
      <div class="adm-price-links">
        <a class="adm-price-link" href="https://www.ebay.com/sch/i.html?_nkw=${q}&LH_Sold=1&LH_Complete=1&LH_PrefLoc=1" target="_blank" rel="noopener">
          <strong>eBay — sold prices ↗</strong>
          <span class="adm-dim">Actual US sale prices (best market signal; eBay has no public price API)</span>
        </a>
        <a class="adm-price-link" href="https://www.google.com/search?tbm=shop&q=${q}" target="_blank" rel="noopener">
          <strong>Google Shopping ↗</strong>
          <span class="adm-dim">Current new-copy retail prices across stores</span>
        </a>
        <a class="adm-price-link" href="https://boardgamegeek.com/boardgame/${id}/marketplace" target="_blank" rel="noopener">
          <strong>Full BGG market ↗</strong>
          <span class="adm-dim">All listings including non-USD</span>
        </a>
      </div>`;

    loadRetail(id);
  }

  /**
   * New-copy retail aggregate across US stores, via BoardGamePrices.com
   * (proxied through the worker — their API has no CORS). Their free API
   * includes prices and stock but not store names; the linked page shows
   * which retailer each offer is from.
   */
  async function loadRetail(eid) {
    const el = $('adm-retail');
    if (!el) return;
    try {
      const res = await fetch(`${WORKER}/api/retail-prices?eid=${eid}`);
      const data = await res.json();
      const items = data.items || [];
      if (!items.length) {
        el.innerHTML = '<p class="adm-dim" style="margin-top:12px">No retail listings — BoardGamePrices.com does not index this title.</p>';
        return;
      }
      // eid returns one item per language edition; the English/US one is the
      // edition with US in-stock offers.
      const best = items
        .map((it) => ({ it, us: (it.prices || []).filter((p) => p.country === 'US' && p.stock === 'Y') }))
        .sort((a, b) => b.us.length - a.us.length)[0];
      const pageLink = `<a href="${esc(best.it.url)}" target="_blank" rel="noopener">BoardGamePrices.com ↗</a>`;
      if (!best.us.length) {
        el.innerHTML = `<p class="adm-dim" style="margin-top:12px">No US retailers have new copies in stock right now — ${pageLink} tracks it.</p>`;
        return;
      }
      const products = best.us.map((p) => +p.product || +p.price).sort((a, b) => a - b);
      const delivered = best.us.map((p) => +p.price).sort((a, b) => a - b);
      const avg = products.reduce((a, b) => a + b, 0) / products.length;
      el.innerHTML = `
        <h3 class="adm-sub">New retail (US, in stock)</h3>
        <div class="adm-price-stats">
          <div class="gl-stat"><span class="gl-stat-label">Retailers</span><span class="gl-stat-value">${best.us.length}</span><span class="gl-stat-sub">with stock</span></div>
          <div class="gl-stat"><span class="gl-stat-label">Lowest</span><span class="gl-stat-value">$${products[0].toFixed(0)}</span><span class="gl-stat-sub">item price</span></div>
          <div class="gl-stat"><span class="gl-stat-label">Average</span><span class="gl-stat-value">$${avg.toFixed(0)}</span><span class="gl-stat-sub">item price</span></div>
          <div class="gl-stat"><span class="gl-stat-label">Lowest delivered</span><span class="gl-stat-value">$${delivered[0].toFixed(0)}</span><span class="gl-stat-sub">incl. shipping</span></div>
        </div>
        <p class="adm-dim">Store names for each offer are on ${pageLink} · prices via <a href="https://boardgameprices.com" target="_blank" rel="noopener">BoardGamePrices.com</a></p>`;
    } catch (err) {
      el.innerHTML = `<p class="adm-dim" style="margin-top:12px">Retail price lookup failed: ${esc(err.message)}</p>`;
    }
  }

});
