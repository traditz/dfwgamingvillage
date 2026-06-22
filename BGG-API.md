# BoardGameGeek (BGG) API integration

This site pulls live data (collection, plays, ratings, box art, the all-time
Top 100) from **BoardGameGeek**. The browser never calls BGG directly — every
request goes through a small **Cloudflare Worker proxy** that adds CORS headers,
caching, and input validation.

## Is there an API key?

**BGG's public XML API2 does not require an API key.** It is an open, keyless,
read-only endpoint (`https://boardgamegeek.com/xmlapi2/...`). You can fetch any
public user's collection or play history with no credentials.

The Worker still sends an `Authorization: Bearer ${BGG_TOKEN}` header on its
outbound calls. **`BGG_TOKEN` is the Worker's own optional secret, not a BGG
key** — BGG ignores it. It exists only so the proxy code has a single place to
hang a credential if BGG ever introduces one, and so the handlers can refuse to
run if the environment is misconfigured. If you don't want it, you can remove
the `if (!env.BGG_TOKEN)` guard in `handleBggCollection`.

## Where everything lives

| Thing | Location |
| --- | --- |
| Worker source | [`cloudflare/bgg-proxy/src/worker.js`](cloudflare/bgg-proxy/src/worker.js) |
| Worker config | [`cloudflare/bgg-proxy/wrangler.toml`](cloudflare/bgg-proxy/wrangler.toml) |
| Deployed proxy URL | `https://dfwgv-bgg-proxy.joemsprague.workers.dev` |
| BGG account read | username `traditz` (constant `DEFAULT_USERNAME` in the Worker, `BGG_USERNAME` in the page scripts) |
| Game Library page | [`games.html`](games.html) + [`bgg-collection.js`](bgg-collection.js) |
| Play Completion page | [`play-completion.html`](play-completion.html) + [`play-completion.js`](play-completion.js) |

## Worker endpoints

All are served from the proxy base URL above.

| Endpoint | Purpose | Upstream BGG call |
| --- | --- | --- |
| `GET /api/bgg-collection?username=&want=&includeexp=` | Owned collection (default) or want‑to‑play list (`want=1`); base games only unless `includeexp=1` | `xmlapi2/collection` |
| `GET /api/bgg-plays?username=` | All recorded plays aggregated into per‑game totals + comments (JSON) | `xmlapi2/plays` (paginated, walked server‑side) |
| `GET /api/bgg-thing?id=1,2,3` | Game details / expansion links for hydration (XML pass‑through) | `xmlapi2/thing` |
| `GET /api/bgg-top?count=100` | All‑time Top N, scraped from the public ranking page (JSON) | `browse/boardgame/page/N` (HTML) |

### Notes / gotchas

- **Top 100 is scraped, not an API.** BGG has no official "best games" endpoint,
  so `/api/bgg-top` parses the HTML of `browse/boardgame/page/N`. If BGG changes
  that page's markup, the regexes in `handleBggTop` may need updating. Results
  are cached for 6 hours.
- **Play counts** come from `/api/bgg-plays`, which walks up to 40 pages
  (≈4,000 plays). Bump `MAX_PAGES` in the Worker if the account exceeds that.
- **Expansion "played" detection is heuristic.** BGG does not reliably record
  which expansion was used in a play, so `play-completion.js` infers it from
  (a) the expansion having its own logged plays, or (b) the expansion's name
  appearing in a base game's play comments. Expect false negatives.
- **CORS allowlist** lives at the top of `worker.js` (`ALLOWED_ORIGINS`). Add an
  origin there to call the proxy from a new host (localhost:8080 is included for
  local testing).

## Testing locally (no deploy)

You can exercise the whole site — including Play Completion — without deploying
the Worker:

```sh
node scripts/dev-server.mjs
# then open http://localhost:8080/play-completion.html
```

`scripts/dev-server.mjs` is a zero-dependency Node server that serves the static
files and implements the four BGG endpoints. It tries **live BoardGameGeek
first**; if BGG blocks the request (its API 401s some IPs), it falls back to the
sample data in `scripts/fixtures/` so every feature still works. The Top-100
scrape usually succeeds from a normal network, so that tab is typically real.

`play-completion.js` auto-detects `localhost`/`127.0.0.1` and calls the
same-origin dev server there; in production it calls the deployed Worker. No code
changes are needed to switch between the two.

> The fixtures are crafted to demonstrate played vs. unplayed greying, play
> counts, Top-100 cross-referencing, and expansion-from-comments detection
> (e.g. Wingspan's European Expansion is flagged from a play comment).

## Deploying the Worker

The static site (the `.html`/`.js`/`.css` files) deploys automatically when this
repo updates. **The Worker is a separate deploy** and must be pushed manually
whenever `worker.js` changes:

```sh
cd cloudflare/bgg-proxy
npx wrangler login            # one-time, opens browser for Cloudflare auth
npx wrangler deploy           # publishes worker.js to dfwgv-bgg-proxy

# Optional: set/rotate the proxy's own secret
npx wrangler secret put BGG_TOKEN
```

> ⚠️ The Play Completion page needs the **new** endpoints (`/api/bgg-plays`,
> `/api/bgg-top`, `/api/bgg-thing`, and the `want=1` collection option). Until
> the Worker is redeployed with the updated `worker.js`, that page will load the
> collection but fail to show play counts or the Top 100.
