# BoardGameGeek (BGG) API integration

This site pulls live data (collection, plays, ratings, box art, the all-time
Top 100) from **BoardGameGeek**. The browser never calls BGG directly — every
request goes through a small **Cloudflare Worker proxy** that adds CORS headers,
caching, and input validation.

## Is there an API key?

**Yes — a real token is required.** Empirically, BGG's API now rejects
unauthenticated requests with `401 Unauthorized`. The Worker authenticates by
sending `Authorization: Bearer ${BGG_TOKEN}` on its outbound calls, and that
token must be valid:

- The **production Worker** (`dfwgv-bgg-proxy`) has a valid `BGG_TOKEN` stored as
  a Cloudflare **secret**, which is why it returns real data.
- A Worker (or local request) **without** the real token gets `401` from BGG.

Cloudflare secrets are **write-only** — you cannot read `BGG_TOKEN` back out of
the production Worker. To stand up another environment (e.g. staging) you must
set the real token again:

```sh
npx wrangler secret put BGG_TOKEN --config wrangler.staging.toml
```

> The `wrangler.staging.toml` in this repo ships with a **placeholder** token in
> `[vars]` purely so the worker boots; it will get `401` from BGG until you
> replace it with the real token via `wrangler secret put` (a secret overrides
> the var). Keep the real token out of source control.

## Where everything lives

| Thing | Location |
| --- | --- |
| Worker source | [`cloudflare/bgg-proxy/src/worker.js`](cloudflare/bgg-proxy/src/worker.js) |
| Worker config | [`cloudflare/bgg-proxy/wrangler.toml`](cloudflare/bgg-proxy/wrangler.toml) |
| Deployed proxy URL | `https://dfwgv-bgg-proxy.joemsprague.workers.dev` |
| BGG account read | username `traditz` (constant `DEFAULT_USERNAME` in the Worker, `BGG_USERNAME` in the page scripts) |
| Game Library page | [`games.html`](games.html) + [`game-library.js`](game-library.js) + [`games-library.json`](games-library.json) |
| Play Completion page | [`play-completion.html`](play-completion.html) + [`play-completion.js`](play-completion.js) |

## Worker endpoints

All are served from the proxy base URL above.

| Endpoint | Purpose | Upstream BGG call |
| --- | --- | --- |
| `GET /api/bgg-collection?username=&want=&includeexp=` | Owned collection (default) or want‑to‑play list (`want=1`); base games only unless `includeexp=1` | `xmlapi2/collection` |
| `GET /api/bgg-plays?username=` | All recorded plays aggregated into per‑game totals + comments (JSON) | `xmlapi2/plays` (paginated, walked server‑side) |
| `GET /api/bgg-thing?id=1,2,3` | Game details / expansion links for hydration (XML pass‑through) | `xmlapi2/thing` |
| `GET /api/bgg-top?count=100` | All‑time Top N, scraped from the public ranking page (JSON) | `browse/boardgame/page/N` (HTML) |

### The Game Library snapshot (`games-library.json`)

The Game Library dashboard does **not** hit BGG per visitor. It loads a
pre-built snapshot, `games-library.json`, which enriches every owned game with
the thing-API data the collection feed lacks (complexity weight, mechanics,
categories/themes, average rating, community "best with" player count), plus the collection's
`lastmodified` date (the "recently added" sort) and the owned expansions
matched to each base game. Owned expansion ids are computed by diffing the
collection with and without `includeexp=1` — the collection API mislabels
expansions' `subtype`, so the attribute can't be used. Rebuild with:

```sh
node scripts/refresh-library.mjs
```

The script walks the owned collection through the deployed worker and hydrates
each game via `/api/bgg-thing` in batches of 20 (BGG rejects larger id lists),
so it takes a couple of minutes for ~1,200 games. Re-run it when the collection
changes — but staleness is soft: once a day per browser, the page diffs the live
collection (bases **and** expansions) against the snapshot, hydrates only the
new items client-side, and caches that delta in `localStorage`. New base games
and newly acquired expansions therefore appear without a rebuild; a rebuild is
only needed to refresh drifting data on existing games (ratings, weights,
mechanics/themes, best-with).

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
files and implements the four BGG endpoints. Because BGG now requires the auth
token (and blocks unauthenticated IPs with `401`), the dev server falls back to
the sample data in `scripts/fixtures/` so every feature still works offline.

`play-completion.js` auto-detects `localhost`/`127.0.0.1` and calls the
same-origin dev server there; in production it calls the deployed Worker. No code
changes are needed to switch between the two.

### Testing real BGG usernames locally

The fixtures return the same data for any username. To exercise **real** per-user
data locally, point the dev server at a **deployed Worker** that holds the valid
`BGG_TOKEN` (the calls then originate from Cloudflare, which is authorized):

```sh
BGG_PROXY_UPSTREAM=https://dfwgv-bgg-proxy.joemsprague.workers.dev \
  node scripts/dev-server.mjs
```

With `BGG_PROXY_UPSTREAM` set, the dev server forwards `/api/*` to that Worker
instead of using fixtures. Note: the **production** Worker only gains the new
endpoints (`bgg-plays`, `bgg-top`, `bgg-thing`, `want=1`) once `worker.js` is
redeployed — until then, point at a staging Worker that has the real token set
(see "Is there an API key?").

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
