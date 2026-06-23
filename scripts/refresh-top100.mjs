/*
 * Refreshes the bundled all-time Top-100 snapshot used by the BGG proxy worker.
 *
 *   node scripts/refresh-top100.mjs
 *
 * BGG has no official top-list API, and its browse page blocks Cloudflare's
 * network (so the worker can't scrape it live). This script scrapes the page
 * from your machine and writes cloudflare/bgg-proxy/src/top100.json, which the
 * worker imports and serves. Re-run it periodically (e.g. monthly) and redeploy
 * the worker (`cd cloudflare/bgg-proxy && npx wrangler deploy`).
 *
 * BGG rate-limits repeated requests; the script retries with backoff.
 */
import { writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, '..', 'cloudflare', 'bgg-proxy', 'src', 'top100.json');
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36';
// The browse page only yields tiny 64x64 thumbnails, so we upgrade box art via
// the thing API. BGG's API blocks this machine's IP, but the deployed worker can
// reach it — so we hydrate through the worker's /api/bgg-thing endpoint.
const WORKER = process.env.BGG_PROXY_UPSTREAM || 'https://dfwgv-bgg-proxy.joemsprague.workers.dev';

function decodeEntities(s) {
  return s.replace(/&amp;/g, '&').replace(/&#39;/g, "'")
    .replace(/&#(\d+);/g, (_, c) => String.fromCodePoint(parseInt(c, 10)));
}

function parseRows(html) {
  const games = [];
  for (const row of html.match(/<tr[^>]*id=['"]row_['"][\s\S]*?<\/tr>/g) || []) {
    const link = row.match(/\/boardgame\/(\d+)\/[^"]*"\s+class=['"]primary['"]\s*>([^<]+)<\/a>/);
    if (!link) continue;
    const rank = row.match(/<a name="(\d+)"><\/a>/);
    const year = row.match(/<span[^>]*class=['"]smallerfont dull['"][^>]*>\(([^)]+)\)<\/span>/);
    const img = row.match(/<img[^>]+\ssrc="([^"]+)"/);
    const rc = [...row.matchAll(/<td[^>]*class=['"]collection_bggrating['"][^>]*>\s*([\d.]+|N\/A)/g)];
    games.push({
      rank: rank ? parseInt(rank[1], 10) : games.length + 1,
      id: link[1],
      name: decodeEntities(link[2]).trim(),
      year: year ? year[1] : 'N/A',
      image: img ? img[1] : '',
      geekRating: rc[0] ? rc[0][1] : 'N/A',
      avgRating: rc[1] ? rc[1][1] : 'N/A'
    });
  }
  return games;
}

async function fetchPage(page) {
  for (let attempt = 1; attempt <= 4; attempt++) {
    const res = await fetch(`https://boardgamegeek.com/browse/boardgame/page/${page}`, {
      headers: { 'User-Agent': UA, 'Accept-Language': 'en-US,en;q=0.9', Accept: 'text/html,application/xhtml+xml' }
    });
    const html = await res.text();
    const games = parseRows(html);
    if (res.ok && games.length >= 100) return games;
    console.log(`  page ${page} attempt ${attempt}: status ${res.status}, ${games.length} rows — retrying`);
    await new Promise((r) => setTimeout(r, attempt * 15000));
  }
  throw new Error(`Could not fetch page ${page} (BGG kept blocking).`);
}

// Replace the tiny browse thumbnails with proper-sized thing-API thumbnails.
async function upgradeBoxArt(games) {
  const ids = games.map((g) => g.id);
  const byId = {};
  for (let i = 0; i < ids.length; i += 20) {
    const batch = ids.slice(i, i + 20).join(',');
    const res = await fetch(`${WORKER}/api/bgg-thing?id=${batch}`);
    if (!res.ok) {
      console.log(`  thing batch ${i / 20 + 1} failed: ${res.status} — keeping browse thumbnails`);
      continue;
    }
    const xml = await res.text();
    for (const m of xml.matchAll(/<item\b[^>]*\bid="(\d+)"[\s\S]*?<\/item>/g)) {
      const thumb = (m[0].match(/<thumbnail>([^<]+)<\/thumbnail>/) || [])[1];
      const image = (m[0].match(/<image>([^<]+)<\/image>/) || [])[1];
      if (thumb || image) byId[m[1]] = thumb || image;
    }
    await new Promise((r) => setTimeout(r, 400));
  }
  let upgraded = 0;
  for (const g of games) {
    if (byId[g.id]) { g.image = byId[g.id]; upgraded++; }
  }
  console.log(`  upgraded box art for ${upgraded}/${games.length} games`);
}

const games = await fetchPage(1); // page 1 = ranks 1–100
await upgradeBoxArt(games);
const out = {
  ok: true,
  count: games.length,
  generatedAt: new Date().toISOString().slice(0, 10),
  source: 'boardgamegeek.com/browse/boardgame page 1',
  games
};
await writeFile(OUT, JSON.stringify(out, null, 2));
console.log(`Wrote ${games.length} games to ${OUT}`);
console.log(`  #1: ${games[0].name} (${games[0].geekRating})  …  #100: ${games[99].name}`);
console.log('Now redeploy: cd cloudflare/bgg-proxy && npx wrangler deploy');
