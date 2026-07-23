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
  const ORG_KEY = 'dfwgvAdminOrg';

  const $ = (id) => document.getElementById(id);
  const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

  let snapshot = null;   // games-library.json
  let playsById = {};    // id -> total plays
  let top100 = [];       // [{rank,id,name,year,geekRating,...}]
  let wantList = [];     // want-to-play items
  let wishList = [];     // wishlist items
  let ownedIds = new Set();

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
      const [snapRes, topRes, playsRes] = await Promise.all([
        fetch('games-library.json'),
        fetch(`${WORKER}/api/bgg-top?count=100`),
        fetch(`${WORKER}/api/bgg-plays?username=${USERNAME}`)
      ]);
      snapshot = await snapRes.json();
      ownedIds = new Set(snapshot.games.map((g) => g.id));
      const top = await topRes.json();
      top100 = top.games || [];
      const plays = await playsRes.json();
      for (const [id, rec] of Object.entries(plays.games || {})) playsById[id] = rec.plays;
    } catch (err) {
      status.textContent = `Failed to load data: ${err.message}`;
      return;
    }
    status.textContent = '';
    renderProcurement();
    renderCuration();
    renderPricing();
    renderLetters();

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

  function renderProcurement() {
    const gaps = top100.filter((t) => !ownedIds.has(String(t.id)));
    const gapRows = gaps.map((t) => `
      <tr>
        <td>#${t.rank}</td>
        <td>${gameLink(t.id, t.name)} <span class="adm-dim">(${esc(t.year)})</span></td>
        <td>${esc(t.geekRating)}</td>
        <td><button type="button" class="adm-mini" data-price-id="${t.id}" data-price-name="${esc(t.name)}">Price</button></td>
      </tr>`).join('');

    // Coverage: owned games best at N, by weight band.
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

    const byPlays = snapshot.games.slice().sort((a, b) => (playsById[b.id] || 0) - (playsById[a.id] || 0)).slice(0, 12);
    const expRows = byPlays.map((g) => `
      <tr data-exp-row="${g.id}">
        <td>${gameLink(g.id, g.name)}</td>
        <td class="adm-dim">${playsById[g.id] || 0} plays · owns ${(g.exp || []).length} exp</td>
        <td><button type="button" class="adm-mini" data-exp-check="${g.id}">Find missing</button></td>
      </tr>
      <tr class="adm-exp-result" data-exp-result="${g.id}" hidden><td colspan="3"></td></tr>`).join('');

    $('adm-procure').innerHTML = `
      <div class="adm-panel"><h2>BGG Top 100 — not in the library (${gaps.length})</h2>
        <div class="adm-scroll"><table class="adm-table">
          <thead><tr><th>Rank</th><th>Game</th><th>Geek rating</th><th></th></tr></thead>
          <tbody>${gapRows}</tbody>
        </table></div>
      </div>
      <div class="adm-panel"><h2>Coverage gaps</h2>
        <p class="adm-dim">Owned games that are community-best at each player count. Red = thin (&lt;4), amber = moderate (&lt;9).</p>
        <div class="adm-scroll">${matrix}</div>
        <p class="adm-dim" style="margin-top:12px">Thinnest themes:</p>
        <p>${thinThemes}</p>
      </div>
      <div class="adm-panel" id="adm-queues"><h2>Acquisition queues</h2><p class="adm-dim">Loading BGG wishlist and want-to-play lists…</p></div>
      <div class="adm-panel"><h2>Missing expansions — most-played games</h2>
        <div class="adm-scroll"><table class="adm-table"><tbody>${expRows}</tbody></table></div>
      </div>`;
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
  }

  // Missing-expansion finder (one thing call per click).
  $('adm-procure').addEventListener('click', async (e) => {
    const btn = e.target.closest('[data-exp-check]');
    if (!btn) return;
    const id = btn.dataset.expCheck;
    const row = document.querySelector(`[data-exp-result="${id}"]`);
    const cell = row.querySelector('td');
    row.hidden = false;
    cell.textContent = 'Checking BGG…';
    try {
      const res = await fetch(`${WORKER}/api/bgg-thing?id=${id}`);
      const xml = new DOMParser().parseFromString(await res.text(), 'text/xml');
      const game = snapshot.games.find((g) => g.id === id);
      const ownedExp = new Set((game?.exp || []).map((x) => x.id));
      const missing = [...xml.querySelectorAll('link[type="boardgameexpansion"]:not([inbound])')]
        .map((l) => ({ id: l.getAttribute('id'), name: l.getAttribute('value') }))
        .filter((x) => !ownedExp.has(x.id));
      cell.innerHTML = missing.length
        ? missing.map((x) => gameLink(x.id, x.name)).join(' · ')
        : 'Every listed expansion is already owned. 🎉';
    } catch (err) {
      cell.textContent = `Lookup failed: ${err.message}`;
    }
  });

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
      <div class="adm-panel"><h2>Second-hand pricing</h2>
        <p class="adm-dim">Live listings from the BGG Marketplace, plus quick links to sold-price searches elsewhere. Type a game name (owned, wishlist, or Top 100).</p>
        <div class="adm-price-search">
          <input type="text" id="adm-price-input" placeholder="Search a game to price..." autocomplete="off">
          <div id="adm-price-suggest" class="adm-suggest" hidden></div>
        </div>
        <div id="adm-price-result"></div>
      </div>`;

    const input = $('adm-price-input');
    const suggest = $('adm-price-suggest');
    input.addEventListener('input', () => {
      const q = input.value.trim().toLowerCase();
      if (q.length < 2) { suggest.hidden = true; return; }
      const matches = knownGames().filter((g) => g.name.toLowerCase().includes(q)).slice(0, 8);
      suggest.innerHTML = matches.map((m) => `
        <button type="button" data-price-id="${m.id}" data-price-name="${esc(m.name)}">${esc(m.name)} <span class="adm-dim">${m.tag}</span></button>`).join('');
      suggest.hidden = matches.length === 0;
    });
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.adm-price-search')) suggest.hidden = true;
    });
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

    const usd = listings.filter((l) => l.currency === 'USD' && l.price > 0).map((l) => l.price).sort((a, b) => a - b);
    const median = usd.length ? usd[Math.floor(usd.length / 2)] : 0;
    const summary = usd.length
      ? `<div class="adm-price-stats">
          <div class="gl-stat"><span class="gl-stat-label">USD listings</span><span class="gl-stat-value">${usd.length}</span><span class="gl-stat-sub">of ${listings.length} total</span></div>
          <div class="gl-stat"><span class="gl-stat-label">Lowest</span><span class="gl-stat-value">$${usd[0].toFixed(0)}</span><span class="gl-stat-sub">USD</span></div>
          <div class="gl-stat"><span class="gl-stat-label">Median</span><span class="gl-stat-value">$${median.toFixed(0)}</span><span class="gl-stat-sub">USD</span></div>
          <div class="gl-stat"><span class="gl-stat-label">Highest</span><span class="gl-stat-value">$${usd[usd.length - 1].toFixed(0)}</span><span class="gl-stat-sub">USD</span></div>
        </div>`
      : `<p class="adm-dim">No current USD listings on the BGG Marketplace.</p>`;

    const rows = listings.sort((a, b) => a.price - b.price).slice(0, 25).map((l) => `
      <tr>
        <td>${l.price ? `${l.price.toFixed(2)} ${esc(l.currency)}` : '–'}</td>
        <td>${esc(l.condition)}</td>
        <td class="adm-dim">${esc(l.date)}</td>
        <td>${l.link ? `<a href="${esc(l.link)}" target="_blank" rel="noopener">listing ↗</a>` : ''}</td>
      </tr>`).join('');

    const q = encodeURIComponent(`${name} board game`);
    out.innerHTML = `
      <h3 class="adm-sub">${gameLink(id, name)}</h3>
      ${summary}
      ${listings.length ? `<div class="adm-scroll"><table class="adm-table">
        <thead><tr><th>Price</th><th>Condition</th><th>Listed</th><th></th></tr></thead>
        <tbody>${rows}</tbody></table></div>` : ''}
      <p class="adm-dim" style="margin-top:12px">Compare elsewhere:
        <a href="https://www.ebay.com/sch/i.html?_nkw=${q}&LH_Sold=1&LH_Complete=1" target="_blank" rel="noopener">eBay sold prices ↗</a> ·
        <a href="https://www.google.com/search?tbm=shop&q=${q}" target="_blank" rel="noopener">Google Shopping ↗</a> ·
        <a href="https://boardgamegeek.com/boardgame/${id}/marketplace" target="_blank" rel="noopener">full BGG market ↗</a>
      </p>`;
  }

  /* ================= letters ================= */

  const TONES = {
    formal: {
      label: 'Formal request',
      build: (f) => `Dear ${f.publisher} team,

My name is ${f.contact}, and I help run ${f.org}, a tabletop gaming community in ${f.region}. We host ${f.cadence} game nights with ${f.attendance} attendees, built around a free lending library of over ${f.libCount} games that members borrow and play at our events.

Your titles are already a meaningful part of our tables: we own ${f.count} ${f.publisher} ${f.count === 1 ? 'game' : 'games'}${f.topLine ? `, and ${f.topLine}` : '.'}

I'm writing to ask whether ${f.publisher} would consider supporting the community with a donation of games or expansions. Review copies, dinged-box stock, or overruns are all gratefully welcomed — donated titles go directly into the lending library, where they are taught, played, and shown to new players week after week. We are glad to credit ${f.publisher} on our website (${f.site}) and at our events.

If this is something you would consider, I would love to connect. Thank you for making games our community loves to play.

Warm regards,
${f.contact}
${f.org} — ${f.site}
${f.email}`
    },
    story: {
      label: 'Community story',
      build: (f) => `Hi ${f.publisher} folks,

I'm ${f.contact} from ${f.org}, a community game group in ${f.region}. Every ${f.cadence.replace(/ly$/, '')} we pack tables with ${f.attendance} players, and the heart of it is our traveling library — ${f.libCount}+ games that anyone can pull off the shelf and learn on the spot.

${f.topLine ? `Your games do serious work at those tables: ${f.topLine} ` : `We already own ${f.count} of your titles, and they earn their shelf space. `}There's nothing like watching a table of strangers become friends over a game.

Here's the ask: would ${f.publisher} donate a game or two (or a well-loved demo copy) to the library? Every donated game gets taught to new players constantly — it's the best kind of shelf presence — and we happily shout out our supporters on ${f.site} and at events.

Either way, thanks for what you make. It's the reason we all show up.

${f.contact}
${f.org} — ${f.site}
${f.email}`
    },
    event: {
      label: 'Event partnership',
      build: (f) => `Dear ${f.publisher} team,

I'm ${f.contact}, an organizer with ${f.org} in ${f.region}. We run ${f.cadence} game nights (${f.attendance} attendees) plus larger community events, all built around a free lending library of ${f.libCount}+ games.

We'd love to explore a partnership: ${f.publisher} titles featured in scheduled demo sessions, taught by experienced hosts, with your games as event prizes or library additions. We currently own ${f.count} of your ${f.count === 1 ? 'title' : 'titles'}${f.topLine ? ` — ${f.topLine}` : '.'}

A donated copy or prize-support package goes a long way here: library games are taught repeatedly to new players, and prize tables get photographed and shared across our community channels (${f.site}).

If a demo night or prize support sounds interesting, I'd be glad to set it up. Thank you for your time.

Best,
${f.contact}
${f.org} — ${f.site}
${f.email}`
    }
  };

  function orgDefaults() {
    let stored = {};
    try { stored = JSON.parse(localStorage.getItem(ORG_KEY)) || {}; } catch {}
    return {
      org: 'DFW Gaming Village', contact: '', email: '', site: 'dfwgamingvillage.com',
      region: 'the Dallas–Fort Worth area', cadence: 'weekly', attendance: '20–40', ...stored
    };
  }

  function renderLetters() {
    const pubCounts = new Map();
    for (const g of snapshot.games) for (const i of g.pub || []) pubCounts.set(i, (pubCounts.get(i) || 0) + 1);
    const pubs = [...pubCounts.entries()].sort((a, b) => b[1] - a[1]);
    const org = orgDefaults();

    $('adm-letters').innerHTML = `
      <div class="adm-panel"><h2>Donation letter drafts</h2>
        <p class="adm-dim">Pick a publisher — the letter is personalized with which of their games the library owns and how often they hit the table. Edit anything before sending.</p>
        <div class="adm-letter-grid">
          <label>Publisher
            <select id="adm-pub">${pubs.map(([i, n]) => `<option value="${i}">${esc(snapshot.publishers[i])} (${n} owned)</option>`).join('')}</select>
          </label>
          <label>Tone
            <select id="adm-tone">${Object.entries(TONES).map(([k, t]) => `<option value="${k}">${t.label}</option>`).join('')}</select>
          </label>
          <label>Your name<input type="text" id="adm-org-contact" value="${esc(org.contact)}" placeholder="Contact name"></label>
          <label>Your email<input type="text" id="adm-org-email" value="${esc(org.email)}" placeholder="you@example.com"></label>
          <label>Attendance<input type="text" id="adm-org-attendance" value="${esc(org.attendance)}"></label>
          <label>Cadence<input type="text" id="adm-org-cadence" value="${esc(org.cadence)}"></label>
        </div>
        <div id="adm-pub-games" class="adm-dim"></div>
        <textarea id="adm-letter" rows="22" spellcheck="false"></textarea>
        <div class="adm-letter-actions">
          <button type="button" id="adm-letter-copy">Copy letter</button>
          <span id="adm-letter-msg" class="adm-dim"></span>
        </div>
      </div>`;

    const regen = () => {
      const o = {
        ...orgDefaults(),
        contact: $('adm-org-contact').value.trim() || '[your name]',
        email: $('adm-org-email').value.trim() || '[your email]',
        attendance: $('adm-org-attendance').value.trim() || '20–40',
        cadence: $('adm-org-cadence').value.trim() || 'weekly'
      };
      try {
        localStorage.setItem(ORG_KEY, JSON.stringify({
          contact: $('adm-org-contact').value.trim(), email: $('adm-org-email').value.trim(),
          attendance: o.attendance, cadence: o.cadence
        }));
      } catch {}

      const pubIdx = parseInt($('adm-pub').value, 10);
      const theirs = snapshot.games.filter((g) => (g.pub || []).includes(pubIdx));
      const played = theirs.filter((g) => playsById[g.id] > 0)
        .sort((a, b) => (playsById[b.id] || 0) - (playsById[a.id] || 0)).slice(0, 3);
      const topLine = played.length
        ? `${played.map((g) => `${g.name} has hit our tables ${playsById[g.id]} ${playsById[g.id] === 1 ? 'time' : 'times'}`).join(', ')}.`
        : '';

      $('adm-pub-games').innerHTML = `Their games in the library: ${theirs.slice(0, 12).map((g) => esc(g.name)).join(' · ')}${theirs.length > 12 ? ` · +${theirs.length - 12} more` : ''}`;
      $('adm-letter').value = TONES[$('adm-tone').value].build({
        ...o,
        publisher: snapshot.publishers[pubIdx],
        count: theirs.length,
        libCount: Math.floor(snapshot.games.length / 100) * 100,
        topLine
      });
    };

    ['adm-pub', 'adm-tone', 'adm-org-contact', 'adm-org-email', 'adm-org-attendance', 'adm-org-cadence']
      .forEach((id) => $(id).addEventListener('input', regen));
    $('adm-letter-copy').addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText($('adm-letter').value);
        $('adm-letter-msg').textContent = 'Copied to clipboard.';
      } catch {
        $('adm-letter-msg').textContent = 'Copy failed — select the text manually.';
      }
      setTimeout(() => { $('adm-letter-msg').textContent = ''; }, 2500);
    });
    regen();
  }
});
