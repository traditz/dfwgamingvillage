/*
 * Builds candidates.json — BGG's Top 1000 ranked games, enriched — used by the
 * Library Admin "Suggested acquisitions" engine.
 *
 *   node scripts/refresh-candidates.mjs
 *
 * Like the Top-100 snapshot, the rank pages must be scraped from a residential
 * IP (BGG 403s datacenter ranges), so run this locally — it's wired into the
 * same monthly scheduled task as the Top-100 refresh. Enrichment (weight,
 * best-with, mechanics, themes, publisher) goes through the deployed worker's
 * thing endpoint. Ownership is NOT baked in; the dashboard filters against the
 * current library at load time, so this survives collection changes.
 */
import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, '..', 'candidates.json');
const WORKER = process.env.BGG_PROXY_UPSTREAM || 'https://dfwgv-bgg-proxy.joemsprague.workers.dev';
const PAGES = 10; // 100 ranked games per browse page → Top 1000
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36';

function decodeEntities(s) {
  return s.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"').replace(/&#39;/g, "'")
    .replace(/&#(\d+);/g, (_, c) => String.fromCodePoint(parseInt(c, 10)));
}

function parseRows(html) {
  const games = [];
  for (const row of html.match(/<tr[^>]*id=['"]row_['"][\s\S]*?<\/tr>/g) || []) {
    const link = row.match(/\/boardgame\/(\d+)\/[^"]*"\s+class=['"]primary['"]\s*>([^<]+)<\/a>/);
    if (!link) continue;
    const rank = row.match(/<a name="(\d+)"><\/a>/);
    games.push({
      rank: rank ? parseInt(rank[1], 10) : 0,
      id: link[1],
      name: decodeEntities(link[2]).trim()
    });
  }
  return games;
}

async function fetchPage(page) {
  const MAX_ATTEMPTS = 6;
  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    const res = await fetch(`https://boardgamegeek.com/browse/boardgame/page/${page}`, {
      headers: { 'User-Agent': UA, 'Accept-Language': 'en-US,en;q=0.9', Accept: 'text/html,application/xhtml+xml' }
    });
    const games = parseRows(await res.text());
    if (res.ok && games.length >= 90) return games;
    console.log(`  page ${page} attempt ${attempt}/${MAX_ATTEMPTS}: status ${res.status}, ${games.length} rows — retrying`);
    if (attempt < MAX_ATTEMPTS) await new Promise((r) => setTimeout(r, attempt * 20000));
  }
  throw new Error(`Could not fetch page ${page} (BGG kept blocking).`);
}

// 1. Ranked id list — scraped from the browse pages, or (when BGG's bot
//    protection blocks the plain fetch) supplied as an ordered id array via
//    CANDIDATES_IDS_FILE, harvested from the pages in a real browser.
const ranked = [];
if (process.env.CANDIDATES_IDS_FILE) {
  const ids = JSON.parse(await readFile(process.env.CANDIDATES_IDS_FILE, 'utf8'));
  ranked.push(...ids.map((id, i) => ({ rank: i + 1, id: String(id), name: '' })));
  console.log(`  using ${ranked.length} pre-harvested ids from ${process.env.CANDIDATES_IDS_FILE}`);
} else {
  for (let page = 1; page <= PAGES; page++) {
    ranked.push(...await fetchPage(page));
    console.log(`  page ${page}/${PAGES}: ${ranked.length} games so far`);
    await new Promise((r) => setTimeout(r, 2500));
  }
}

// 2. Enrich through the worker's thing endpoint.
const mechanicsIndex = new Map();
const categoriesIndex = new Map();
const publishersIndex = new Map();
const byId = new Map(ranked.map((g) => [g.id, g]));
const games = [];

function idx(map, name) {
  if (!map.has(name)) map.set(name, map.size);
  return map.get(name);
}

const ids = [...byId.keys()];
for (let i = 0; i < ids.length; i += 20) {
  const batch = ids.slice(i, i + 20);
  let xml = '';
  for (let attempt = 1; attempt <= 4; attempt++) {
    const res = await fetch(`${WORKER}/api/bgg-thing?id=${batch.join(',')}`);
    if (res.ok) { xml = await res.text(); break; }
    console.log(`  thing batch ${i / 20 + 1} attempt ${attempt}: status ${res.status}`);
    await new Promise((r) => setTimeout(r, attempt * 5000));
  }
  for (const m of xml.matchAll(/<item type="[^"]*" id="(\d+)"[\s\S]*?<\/item>\s*(?=<item |<\/items>)/g)) {
    const item = m[0];
    const base = byId.get(m[1]);
    if (!base) continue;
    const attr = (re) => (item.match(re) || [])[1];
    const num = (re) => parseFloat(attr(re) || '') || 0;
    const links = (type, map, cap) => [...item.matchAll(new RegExp(`<link type="${type}" id="\\d+" value="([^"]*)"`, 'g'))]
      .slice(0, cap || 99).map((l) => idx(map, decodeEntities(l[1])));
    const pubTag = item.match(/<link type="boardgamepublisher" id="(\d+)" value="([^"]*)"/);
    games.push({
      ...base,
      name: base.name || decodeEntities(attr(/<name type="primary"[^>]*value="([^"]*)"/) || 'Unknown'),
      year: parseInt(attr(/<yearpublished value="(-?\d+)"/) || '0', 10) || 0,
      thumb: attr(/<thumbnail>([^<]*)<\/thumbnail>/) || '',
      minP: num(/<minplayers value="(\d+)"/) || 1,
      maxP: num(/<maxplayers value="(\d+)"/) || 1,
      time: num(/<playingtime value="(\d+)"/),
      weight: Math.round(num(/<averageweight value="([\d.]+)"/) * 100) / 100,
      rating: Math.round(num(/<average value="([\d.]+)"/) * 10) / 10,
      bestWith: (attr(/<result name="bestwith" value="Best with ([^"]+?) players?"/) || '').trim(),
      mech: links('boardgamemechanic', mechanicsIndex),
      cat: links('boardgamecategory', categoriesIndex),
      pubId: pubTag ? pubTag[1] : '',
      pubName: pubTag ? decodeEntities(pubTag[2]) : ''
    });
  }
  if ((i / 20) % 10 === 0) console.log(`  enriched ${Math.min(i + 20, ids.length)}/${ids.length}`);
  await new Promise((r) => setTimeout(r, 800));
}

if (games.length < ids.length * 0.9) throw new Error('More than 10% of candidates failed to enrich — aborting.');
games.sort((a, b) => a.rank - b.rank);

const head = JSON.stringify({
  generatedAt: new Date().toISOString().slice(0, 10),
  count: games.length,
  mechanics: [...mechanicsIndex.keys()],
  categories: [...categoriesIndex.keys()]
});
const body = games.map((g) => '    ' + JSON.stringify(g)).join(',\n');
await writeFile(OUT, `${head.slice(0, -1)},\n  "games": [\n${body}\n  ]\n}\n`);
console.log(`Wrote ${games.length} candidates to ${OUT}`);
