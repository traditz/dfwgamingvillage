/*
 * Local dev server for testing the site (and the Play Completion page in
 * particular) without deploying the Cloudflare Worker.
 *
 *   node scripts/dev-server.mjs        then open http://localhost:8080/play-completion.html
 *
 * It serves the static files from the repo root and implements the four BGG
 * proxy endpoints. It tries LIVE BoardGameGeek first; if BGG blocks the request
 * (it 401s some IPs) it falls back to the sample fixtures in scripts/fixtures/
 * so every feature is still demonstrable. The Top-100 scrape usually works from
 * a normal network, so that tab is typically real data.
 *
 * Zero dependencies — Node 18+ (uses built-in fetch).
 */
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join, extname, normalize } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const FIXTURES = join(__dirname, 'fixtures');
const PORT = Number(process.env.PORT) || 8080;
// When set, /api/* is forwarded to this deployed Worker (which can reach BGG
// from Cloudflare's network) instead of being answered locally. This is how you
// test real BGG usernames locally — see BGG-API.md.
//   BGG_PROXY_UPSTREAM=https://dfwgv-bgg-proxy-staging.<subdomain>.workers.dev node scripts/dev-server.mjs
const UPSTREAM = (process.env.BGG_PROXY_UPSTREAM || '').replace(/\/$/, '');
const BROWSER_UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36';

const MIME = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8', '.json': 'application/json; charset=utf-8',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.ico': 'image/x-icon',
  '.svg': 'image/svg+xml', '.xml': 'application/xml; charset=utf-8'
};

function decodeEntities(s) {
  return s.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"').replace(/&#39;/g, "'")
    .replace(/&#(\d+);/g, (_, c) => String.fromCodePoint(parseInt(c, 10)));
}

async function fixture(name) {
  return readFile(join(FIXTURES, name));
}

/* ---- endpoint handlers (mirror cloudflare/bgg-proxy/src/worker.js) ---- */

function username(params) {
  const u = params.get('username') || 'traditz';
  return /^[A-Za-z0-9_-]{1,32}$/.test(u) ? u : 'traditz';
}

async function bggCollection(params) {
  const want = params.get('want') === '1';
  const file = want ? 'collection-want.xml' : 'collection-own.xml';
  try {
    const url = `https://boardgamegeek.com/xmlapi2/collection?username=${username(params)}&stats=1&excludesubtype=boardgameexpansion&${want ? 'wanttoplay=1' : 'own=1'}`;
    const res = await fetch(url, { headers: { 'User-Agent': BROWSER_UA } });
    if (res.ok) return { type: 'xml', body: await res.text(), live: true };
  } catch { /* fall through to fixture */ }
  return { type: 'xml', body: await fixture(file), live: false };
}

async function bggPlays(params) {
  try {
    // The Worker walks every page; for local dev one page is plenty to prove out.
    const res = await fetch(`https://boardgamegeek.com/xmlapi2/plays?username=${username(params)}&page=1`, { headers: { 'User-Agent': BROWSER_UA } });
    if (res.ok) {
      const xml = await res.text();
      const games = {};
      for (const play of xml.match(/<play\b[^>]*>[\s\S]*?<\/play>/g) || []) {
        const q = parseInt((play.match(/\bquantity="(\d+)"/) || [])[1] || '1', 10);
        const item = play.match(/<item\b[^>]*\bobjectid="(\d+)"[^>]*>/);
        if (!item) continue;
        const id = item[1];
        const name = (play.match(/<item\b[^>]*\bname="([^"]*)"/) || [])[1] || '';
        const cm = play.match(/<comments>([\s\S]*?)<\/comments>/);
        if (!games[id]) games[id] = { id, name: decodeEntities(name), plays: 0, comments: [] };
        games[id].plays += q;
        if (cm && cm[1].trim()) games[id].comments.push(decodeEntities(cm[1]).trim());
      }
      if (Object.keys(games).length) return { type: 'json', body: JSON.stringify({ ok: true, games }), live: true };
    }
  } catch { /* fall through */ }
  return { type: 'json', body: await fixture('plays.json'), live: false };
}

async function bggThing(params) {
  const id = (params.get('id') || '').split(',')[0];
  try {
    const res = await fetch(`https://boardgamegeek.com/xmlapi2/thing?id=${encodeURIComponent(params.get('id') || '')}&stats=1`, { headers: { 'User-Agent': BROWSER_UA } });
    if (res.ok) return { type: 'xml', body: await res.text(), live: true };
  } catch { /* fall through */ }
  try {
    return { type: 'xml', body: await fixture(`thing-${id}.xml`), live: false };
  } catch {
    return { type: 'xml', body: '<?xml version="1.0"?><items></items>', live: false };
  }
}

async function bggTop() {
  try {
    const res = await fetch('https://boardgamegeek.com/browse/boardgame/page/1', {
      headers: { 'User-Agent': BROWSER_UA, Accept: 'text/html,application/xhtml+xml' }
    });
    if (res.ok) {
      const html = await res.text();
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
          id: link[1], name: decodeEntities(link[2]).trim(),
          year: year ? year[1] : 'N/A', image: img ? img[1] : '',
          geekRating: rc[0] ? rc[0][1] : 'N/A', avgRating: rc[1] ? rc[1][1] : 'N/A'
        });
      }
      if (games.length) return { type: 'json', body: JSON.stringify({ ok: true, count: games.length, games }), live: true };
    }
  } catch { /* fall through */ }
  return { type: 'json', body: await fixture('top.json'), live: false };
}

const API = {
  '/api/bgg-collection': bggCollection,
  '/api/bgg-plays': bggPlays,
  '/api/bgg-thing': bggThing,
  '/api/bgg-top': bggTop
};

/* --------------------------------- server -------------------------------- */

const server = createServer(async (req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`);

  if (url.pathname.startsWith('/api/')) {
    // Forward any API path to the deployed Worker when an upstream is configured.
    if (UPSTREAM) {
      try {
        const target = UPSTREAM + url.pathname + url.search;
        const upstreamRes = await fetch(target, { headers: { Origin: `http://localhost:${PORT}` } });
        const body = Buffer.from(await upstreamRes.arrayBuffer());
        console.log(`${url.pathname} -> upstream ${upstreamRes.status}`);
        res.writeHead(upstreamRes.status, {
          'Content-Type': upstreamRes.headers.get('content-type') || 'application/octet-stream',
          'Cache-Control': 'no-store'
        });
        res.end(body);
      } catch (err) {
        res.writeHead(502, { 'Content-Type': 'text/plain' });
        res.end(`upstream error: ${err.message}`);
      }
      return;
    }
    // No upstream: only the BGG endpoints have local fixture handlers.
    if (API[url.pathname]) {
      try {
        const out = await API[url.pathname](url.searchParams);
        console.log(`${url.pathname} -> ${out.live ? 'LIVE BGG' : 'fixture'}`);
        res.writeHead(200, { 'Content-Type': out.type === 'json' ? MIME['.json'] : MIME['.xml'], 'Cache-Control': 'no-store' });
        res.end(out.body);
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end(`dev-server error: ${err.message}`);
      }
      return;
    }
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end(`No local handler for ${url.pathname}. Set BGG_PROXY_UPSTREAM to proxy it.`);
    return;
  }

  // Static files (default to index.html), with a simple path-traversal guard.
  let path = decodeURIComponent(url.pathname);
  if (path === '/' || path === '') path = '/index.html';
  const filePath = normalize(join(ROOT, path));
  if (!filePath.startsWith(ROOT)) {
    res.writeHead(403); res.end('Forbidden'); return;
  }
  try {
    if ((await stat(filePath)).isDirectory()) throw new Error('dir');
    const body = await readFile(filePath);
    res.writeHead(200, { 'Content-Type': MIME[extname(filePath)] || 'application/octet-stream' });
    res.end(body);
  } catch {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not found');
  }
});

server.listen(PORT, () => {
  console.log(`\n  DFWGV dev server running:  http://localhost:${PORT}/play-completion.html\n`);
  if (UPSTREAM) {
    console.log(`  /api/* -> upstream Worker: ${UPSTREAM}`);
    console.log('  Real BGG data for any username.');
  } else {
    console.log('  Top-100 = live BGG when reachable; other tabs fall back to scripts/fixtures/.');
    console.log('  Set BGG_PROXY_UPSTREAM=<staging worker url> for real per-user data.');
  }
  console.log('  Ctrl+C to stop.\n');
});
