/*
 * Builds the enriched game-library snapshot used by the Game Library dashboard.
 *
 *   node scripts/refresh-library.mjs
 *
 * The collection API alone has no weight/mechanics/ratings, and hydrating
 * ~1,200 games through the thing API is far too slow to do per visitor. This
 * script walks the whole owned collection through the deployed worker (which
 * holds the BGG token), hydrates every game via /api/bgg-thing in batches, and
 * writes games-library.json at the repo root. The page loads that single static
 * file, so visitors cost zero BGG calls for the base library.
 *
 * Re-run whenever the collection changes (the page also detects new games at
 * runtime and hydrates just those, so an occasional run is enough).
 */
import { writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, '..', 'games-library.json');
const WORKER = process.env.BGG_PROXY_UPSTREAM || 'https://dfwgv-bgg-proxy.joemsprague.workers.dev';
const USERNAME = process.env.BGG_USERNAME || 'traditz';
const BATCH_SIZE = 20; // ids per /api/bgg-thing call (BGG rejects larger id lists)

function decodeEntities(s) {
  return s
    .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"').replace(/&#39;/g, "'")
    .replace(/&#(\d+);/g, (_, c) => String.fromCodePoint(parseInt(c, 10)));
}

async function fetchText(url, attempts = 4) {
  for (let attempt = 1; attempt <= attempts; attempt++) {
    const res = await fetch(url);
    if (res.ok && res.status !== 202) return res.text();
    if (res.status === 202) {
      console.log('  BGG is preparing the collection, waiting 5s…');
      await new Promise((r) => setTimeout(r, 5000));
      attempt--; // 202 is not a failure, just "come back later"
      continue;
    }
    console.log(`  ${url.slice(WORKER.length)} attempt ${attempt}/${attempts}: status ${res.status}`);
    if (attempt < attempts) await new Promise((r) => setTimeout(r, attempt * 5000));
  }
  throw new Error(`Gave up on ${url}`);
}

// 1. Owned collection, twice: base games only, then including expansions.
//    Owned expansion ids are the difference of the two id sets — the collection
//    API mislabels expansions as subtype="boardgame", so the subtype attribute
//    cannot be trusted. lastmodified is BGG's "when did this enter/last change
//    in the collection" stamp — our best proxy for "recently added".
console.log(`Fetching owned collection for ${USERNAME}…`);
const baseXml = await fetchText(`${WORKER}/api/bgg-collection?username=${USERNAME}`);
const baseAdded = new Map(); // base game id -> yyyy-mm-dd added
for (const m of baseXml.matchAll(/<item[^>]*\bobjectid="(\d+)"[\s\S]*?<\/item>/g)) {
  if (!baseAdded.has(m[1])) {
    baseAdded.set(m[1], ((m[0].match(/\blastmodified="([^"]+)"/) || [])[1] || '').slice(0, 10));
  }
}
console.log(`Fetching collection with expansions…`);
const expXml = await fetchText(`${WORKER}/api/bgg-collection?username=${USERNAME}&includeexp=1`);
const ownedExpansions = new Set(
  [...expXml.matchAll(/<item[^>]*\bobjectid="(\d+)"/g)].map((m) => m[1]).filter((id) => !baseAdded.has(id))
);
const ids = [...baseAdded.keys()];
if (ids.length === 0) throw new Error('Collection came back empty — aborting so we do not clobber the snapshot.');
console.log(`  ${ids.length} base games, ${ownedExpansions.size} expansions owned`);

// 2. Hydrate every game via the thing API (weight, mechanics, rating, best-with).
const mechanicsIndex = new Map();  // name -> index into the mechanics dictionary
const categoriesIndex = new Map(); // name -> index into the categories dictionary
const games = [];

function parseThingItem(itemXml, id) {
  const attr = (re) => (itemXml.match(re) || [])[1];
  const num = (re) => parseFloat(attr(re) || '') || 0;
  const mech = [];
  for (const m of itemXml.matchAll(/<link type="boardgamemechanic" id="\d+" value="([^"]*)"/g)) {
    const name = decodeEntities(m[1]);
    if (!mechanicsIndex.has(name)) mechanicsIndex.set(name, mechanicsIndex.size);
    mech.push(mechanicsIndex.get(name));
  }
  const cat = [];
  for (const m of itemXml.matchAll(/<link type="boardgamecategory" id="\d+" value="([^"]*)"/g)) {
    const name = decodeEntities(m[1]);
    if (!categoriesIndex.has(name)) categoriesIndex.set(name, categoriesIndex.size);
    cat.push(categoriesIndex.get(name));
  }
  // Owned expansions that BGG links to this base game.
  const exp = [];
  for (const tag of itemXml.match(/<link type="boardgameexpansion"[^>]*>/g) || []) {
    if (/\binbound="true"/.test(tag)) continue; // inbound = this item IS the expansion
    const expId = (tag.match(/\bid="(\d+)"/) || [])[1];
    if (expId && ownedExpansions.has(expId)) {
      exp.push({ id: expId, name: decodeEntities((tag.match(/\bvalue="([^"]*)"/) || [])[1] || '') });
    }
  }
  // "Best with 4 players" / "Best with 2–4 players" → "4" / "2–4"
  const bestWith = (attr(/<result name="bestwith" value="Best with ([^"]+?) players?"/) || '').trim();
  return {
    id,
    name: decodeEntities(attr(/<name type="primary"[^>]*value="([^"]*)"/) || 'Unknown'),
    year: parseInt(attr(/<yearpublished value="(-?\d+)"/) || '0', 10) || 0,
    thumb: attr(/<thumbnail>([^<]*)<\/thumbnail>/) || '',
    minP: num(/<minplayers value="(\d+)"/) || 1,
    maxP: num(/<maxplayers value="(\d+)"/) || 1,
    time: num(/<playingtime value="(\d+)"/),
    weight: Math.round(num(/<averageweight value="([\d.]+)"/) * 100) / 100,
    rating: Math.round(num(/<average value="([\d.]+)"/) * 10) / 10,
    bestWith,
    added: baseAdded.get(id) || '',
    mech,
    cat,
    exp
  };
}

for (let i = 0; i < ids.length; i += BATCH_SIZE) {
  const batch = ids.slice(i, i + BATCH_SIZE);
  const xml = await fetchText(`${WORKER}/api/bgg-thing?id=${batch.join(',')}`);
  const items = [...xml.matchAll(/<item type="[^"]*" id="(\d+)"[\s\S]*?<\/item>\s*(?=<item |<\/items>)/g)];
  for (const m of items) games.push(parseThingItem(m[0], m[1]));
  console.log(`  hydrated ${Math.min(i + BATCH_SIZE, ids.length)}/${ids.length}`);
  await new Promise((r) => setTimeout(r, 800)); // BGG 429s aggressive callers

}

const missing = ids.length - games.length;
if (missing > 0) console.log(`  warning: ${missing} games returned no thing data and were skipped`);
if (games.length < ids.length * 0.9) throw new Error('More than 10% of games failed to hydrate — aborting.');

games.sort((a, b) => a.name.localeCompare(b.name));

// 3. Write the snapshot — one game per line keeps git diffs readable.
const mechanics = [...mechanicsIndex.keys()];
const categories = [...categoriesIndex.keys()];
const head = JSON.stringify({
  generatedAt: new Date().toISOString().slice(0, 10),
  username: USERNAME,
  count: games.length,
  mechanics,
  categories
});
const body = games.map((g) => '    ' + JSON.stringify(g)).join(',\n');
await writeFile(OUT, `${head.slice(0, -1)},\n  "games": [\n${body}\n  ]\n}\n`);
console.log(`Wrote ${games.length} games (${mechanics.length} mechanics, ${categories.length} categories) to ${OUT}`);
