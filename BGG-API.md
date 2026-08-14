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
| `GET /api/retail-prices?eid=` | US new-copy retail prices for a BGG id (admin dashboard) | BoardGamePrices.com `/api/info` (not BGG; no store names on the free tier) |
| `GET /api/bgg-hot` | BGG Hotness list (XML pass-through, 1h cache) | `xmlapi2/hot` |
| `GET /api/bgg-search?q=` | Game search (XML pass-through, 6h cache) | `xmlapi2/search` |
| `GET /api/hot-history` | Daily Hotness snapshots, last 60 days (JSON) | Worker KV, filled by a daily cron (`scheduled` handler, 06:00 UTC) |

The admin dashboard's "Suggested acquisitions" engine also reads
`candidates.json` — BGG's Top 1000 with thing-API enrichment, built by
`node scripts/refresh-candidates.mjs`. Like the Top-100 scrape it must run from
a residential IP, so it's part of the same monthly local scheduled task
(`scripts/update-top100.ps1`).

## AI features (worker)

All need the `ANTHROPIC_API_KEY` worker secret (model: `claude-sonnet-5`);
all admin endpoints are token-gated with the same admin token as the rest.

- **Daily Discord digest** — a 14:00 UTC cron gathers watchlist price movement
  (vs 14-day range and targets), hotness streaks, and unowned high-rated
  candidates, has Claude write a ≤1500-char pricing/procurement brief
  (deliberately terse on quiet days), and posts it via `ALERT_WEBHOOK`.
  Manual trigger: `POST /api/digest` (the dashboard's "Post AI digest now"
  button); `GET /api/digest` returns the last digest.
- **Publisher donation letters** — `POST /api/draft-letter`: the dashboard
  sends the game, its publisher, and which of that publisher's titles the
  library owns (with play counts); Claude drafts a tailored 220–320-word
  donation request. "Letter" buttons live on every procurement suggestion row;
  output opens in an editable copy-ready modal.
- **Deep price analysis** — `POST /api/price-analysis {id, name}`: the worker
  gathers the full BGG Marketplace picture (genuine-listing filtering
  included), live US retail offers, the eBay sold baseline, our tracked KV
  price history (historic low + date, averages, target), and reference links
  (eBay sold search, BoardGamePrices item page); Claude writes a
  best-buys/market/history/verdict brief, returns it to the dashboard modal,
  and posts it to the Discord webhook. "Analyze" buttons live on watchlist
  rows and pricing results.

### eBay price data

eBay blocks direct scraping (Akamai challenges even real browsers), so the
worker gets eBay data two ways:

- **Sold-sale baseline via 130point.com** — `fetchEbaySold()` queries
  130point's free sold-listing lookup (which republishes real eBay sale
  prices, including hidden best-offer amounts) and parses per-sale
  price/date/type with the same relevance filtering as marketplace listings.
  Results are cached in the `ebay-sold` KV key for 72h. Note their eBay feed
  is **historical** (currently ends ~Mar 2026) — it's used as a "what copies
  actually sell for" baseline in digests, alerts, and analyses, always
  labeled with its data-through date. Works from Cloudflare's datacenter IPs
  (verified).
- **Live asking prices via the official eBay Browse API** — `fetchEbayLive()`
  activates only when the `EBAY_CLIENT_ID` / `EBAY_CLIENT_SECRET` worker
  secrets are set (free developer account at developer.ebay.com, instant
  approval; uses the client-credentials OAuth flow, tokens cached in KV per
  scope). Until then it silently returns nothing and all features degrade
  gracefully. Once keys exist, eBay becomes a **third price channel** (`e`,
  alongside retail `r` and BGG Marketplace `m`): the 6-hourly check records
  the cheapest genuine live US ask into the KV price history, eBay prices
  count toward manual targets and drop alerts, and the digest/analysis get
  a day-by-day eBay ask series that grows richer over time.
- **Official 90-day sold history via the Marketplace Insights API** —
  `fetchEbaySoldOfficial()` is wired but dormant: eBay gates this API behind
  a limited-release application (developer.ebay.com → Buy APIs production
  access request). Once approved, set the `EBAY_INSIGHTS` var/secret to `1`
  and it silently replaces the 130point baseline with fresh official sold
  data (`source: "ebay-official-90d"`).

### Scaling: the free-plan subrequest budget

Cloudflare's free plan allows ~50 subrequests per invocation, so no single
invocation is allowed to do unbounded per-game work. The pattern everywhere
is **slice + self-chain**: an invocation processes a fixed slice, then
`fetch`es the worker's own URL (token-authorized with the admin secret) to
continue in a fresh invocation. The price check runs 10 games per hop
(`/api/cron-prices?start=N`), the intel job 4 games per hop
(`/api/cron-intel?hops=N`, max 7 hops per cron), and the digest never
fetches per game at all — it assembles KV-staged data plus chunked (20-id)
batched BGG calls. The watchlist cap is 150; at that size a 6-hourly sweep
is ~15 chained price invocations, intel cycles the full list roughly daily,
and the digest spotlights the ~15 games with real signals while summarizing
the rest in one "Quiet" line.

### Watched-game intelligence

Beyond prices, the crons build market/buzz intelligence per watched game:

- **Sold-copy detection (`bgg-sold` KV)** — the 6-hourly check tracks BGG
  Marketplace listing links; a tracked listing that vanishes is recorded as
  a probable sale (price/condition/date, 60 kept per game). Over time this
  is our own fresh second-hand sold-price history — surfaced in alerts
  ("BGG sales we detected"), the digest, and analyses.
- **Supply/demand + popularity (`market-stats` KV)** — the daily digest's
  batched thing call adds `stats=1`: owned/trading/wanting/wishing/usersrated
  snapshots (120 days kept) → want-per-trade-copy ratio and 30-day
  owner/rating growth.
- **OOP early warning** — daily history now records retail offer counts
  (`rc`)/marketplace counts (`mc`); the digest sees the 14-day offer-count
  series and is told to flag shrinking availability + rising used prices.
- **Expansion/edition radar (`known-links` KV)** — new
  expansion/implementation links on a watched game = announcement, surfaced
  in the digest's Signals section.
- **Forum chatter** — `fetchForumChatter()` reads each watched game's
  News/General/Crowdfunding forums (forum ids cached 7 days in
  `forum-cache`) and keyword-filters threads from the last 14 days for
  reprint/OOP/restock/price talk; fed to the digest and analyses with
  thread links.
- **Reddit deal-sniping (`checkRedditDeals`)** — 6-hourly scan of
  r/boardgamedeals and r/BoardGameExchange for posts naming watched games;
  new matches post a purple Discord embed and feed the digest. Needs the
  free `REDDIT_CLIENT_ID`/`REDDIT_CLIENT_SECRET` secrets (script app at
  reddit.com/prefs/apps). Facebook Marketplace/groups are NOT integrable
  (no API, login-walled, ToS) — Reddit BST is the accessible analog.
- **YouTube review radar (`fetchRecentVideos`)** — last-7-days coverage per
  watched game in the digest. Needs the free `YOUTUBE_API_KEY` secret
  (Google Cloud console, YouTube Data API v3).
- **BGG community auction tracking (`runAuctionSweep`)** — BGG auctions are
  GeekLists ("Auction & Trade" category; bids happen in item comments).
  Discovery uses the site's internal JSON feed
  (`/api/geeklists?page=N` — reachable from the worker with the BGG token,
  unlike the 403-blocked HTML browse pages; its `category` param is
  ignored, so lists are filtered by /auction/i in the title). Each 6-hourly
  sweep checks up to 6 tracked lists via `xmlapi/geeklist/{id}?comments=1`
  (202 = queued, retried next sweep), extracts the current high bid and any
  BIN for watched games, alerts Discord (orange 🔨 embed) on new finds, and
  feeds live auctions into the digest. When a list closes (title says
  CLOSED/ENDED, or no edits for 4+ days) the final high bid is recorded
  into `bgg-sold` as a real community sale ("auction final bid").

A weekly cloud routine ("DFWGV library pipeline health", Mondays 12:00 UTC,
managed at claude.ai/code/routines) independently checks snapshot freshness,
the GitHub Action, worker endpoints, and BGG scrape-blocking, committing safe
in-repo fixes.

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
