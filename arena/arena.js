/* The DFWGV Arena page. A static page on GitHub Pages talking to the arena's web service
   (tools/arena_web/arena_web.py in the mod repository), which is another front end on the
   same accounts the Discord and Twitch bots use: a Discord sign-in yields the Discord user
   id, and that id is the account key. Every action becomes a chat command the agent answers,
   so the rules live in one place. `?api=http://localhost:8090` points the page at a local service. */
(function () {
  "use strict";
  const params = new URLSearchParams(location.search);
  const API = (params.get("api") || "https://129-146-77-26.sslip.io").replace(/\/$/, "");
  const CHANNEL = "dfwgv_arena";
  const PARENTS = ["www.dfwgamingvillage.com", "dfwgamingvillage.com", "localhost", "127.0.0.1"];
  const ATTACK_WORD = { melee: "melee", ranged: "ranged", both: "both" };
  const ORDERS = [["hunt", "Hunt", "a target"], ["rage", "Rage", null], ["coward", "Coward", null], ["normal", "Calm", null], ["revive", "Revive", null],
                  ["burn", "Burn", null], ["poison", "Poison", null], ["freeze", "Freeze", null], ["haste", "Haste", null], ["regen", "Regen", null],
                  ["shield", "Shield", null], ["grow", "Grow", null], ["shrink", "Shrink", null]];
  const WEAPONS = ["rockets", "grenades", "lasers", "shards", "pods", "lightning", "nails", "own"];
  const STRENGTHS = [50, 75, 100, 125, 150, 200];

  const S = {
    token: null, me: null, cat: null, best: {}, byName: {}, order: [], live: null, config: null,
    view: "watch", args: [], log: [], tree: null, treeName: null, profile: null, profileId: null, board: null, boardPeriod: "all",
    form: { name: "", count: 1, door: 0, strength: 100, variant: "", vanilla: false }, filter: { q: "", shelf: "", attack: "", threat: "", owned: false },
    busy: false, apiDown: false, target: null,
  };
  const $ = (sel) => document.querySelector(sel);
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const num = (n) => (n == null ? "?" : Number(n).toLocaleString());

  // ------------------------------------------------------------------ the service
  async function api(path, opts) {
    const o = Object.assign({ headers: {} }, opts || {});
    if (S.token) o.headers.Authorization = "Bearer " + S.token;
    if (o.body && typeof o.body !== "string") { o.body = JSON.stringify(o.body); o.headers["Content-Type"] = "application/json"; }
    // a service that is down must fail fast, not leave the page on "loading" for a minute
    const ctl = new AbortController();
    const timer = setTimeout(() => ctl.abort(), path === "/api/command" ? 16000 : 8000);
    o.signal = ctl.signal;
    let r;
    try { r = await fetch(API + path, o); } catch (e) { S.apiDown = true; throw new Error("the arena's service is not reachable"); }
    finally { clearTimeout(timer); }
    S.apiDown = false;
    if (r.status === 401) { setToken(null); S.me = null; throw new Error("sign in first"); }
    if (!r.ok) throw new Error((await r.text()) || ("error " + r.status));
    return r.json();
  }
  function setToken(t) { S.token = t; try { t ? localStorage.setItem("arena_token", t) : localStorage.removeItem("arena_token"); } catch (e) {} }
  async function loadMe() {
    if (!S.token) { S.me = null; return; }
    try { S.me = await api("/api/me"); } catch (e) { S.me = null; }
  }

  // ------------------------------------------------------------------ data
  function ownsType(name) { const a = S.me && S.me.account; const m = S.byName[name]; return !!(m && (m.starter || (a && a.unlocked.includes(name)))); }
  function ownsVariant(name, key) { const a = S.me && S.me.account; return !!(a && a.variants[name] && a.variants[name].includes(key)); }
  function shelfOf(m) { const sh = (S.cat && S.cat.shelves) || []; for (const s of sh) if (s.sources.includes(m.source)) return s.label; return "Other"; }
  function mergeData(bestiary, cat) {
    S.byName = {}; S.order = [];
    const rows = (cat && cat.monsters) || bestiary;
    for (const m of rows) {
      const b = bestiary.find((x) => x.name === m.name) || {};
      const row = Object.assign({}, b, m, { img: "arena/img/" + (m.key || b.key) + ".jpg", attack: b.attack || (m.ranged ? "ranged" : "melee"), health: b.health || 0 });
      S.byName[m.name] = row; S.order.push(row);
    }
  }
  function releaseCost(m, strength, count, variant, door) {
    const f = (S.cat && S.cat.costs && S.cat.costs.strength && S.cat.costs.strength[String(strength)]) || 1;
    let c = Math.max(1, Math.floor(2 * m.threat * f + 0.5));
    if (door === 9) c *= 3;
    if (variant) c += (S.cat && S.cat.costs.variant_surcharge) || 2;
    return c * count;
  }

  // ------------------------------------------------------------------ routing and rendering
  function route() {
    const h = location.hash.replace(/^#/, "");
    if (h.startsWith("token=")) { setToken(h.slice(6)); history.replaceState(null, "", location.pathname + location.search + "#watch"); return route(); }
    if (h.startsWith("error=")) { notice(decodeURIComponent(h.slice(6))); history.replaceState(null, "", location.pathname + location.search + "#watch"); return route(); }
    const parts = h.split("/").map(decodeURIComponent);
    S.view = parts[0] || "watch"; S.args = parts.slice(1);
    if (!["watch", "bestiary", "profile", "top"].includes(S.view)) S.view = "watch";
  }
  function notice(text, ok) { const n = $("#arena-notice"); if (!text) { n.hidden = true; return; } n.hidden = false; n.textContent = text; n.className = "arena-notice" + (ok ? " ok" : ""); }
  function renderUser() {
    const u = $("#arena-user");
    if (S.me) {
      const a = S.me.account, lvl = a ? a.level : 1;
      u.innerHTML = (S.me.user.avatar ? '<img src="' + esc(S.me.user.avatar) + '" alt="">' : "") +
        '<div class="who"><b>' + esc(S.me.user.name) + '</b><small>level ' + lvl + (a ? " · " + num(a.essence) + "/" + a.cap + " essence · " + num(a.souls) + " souls" : " · new here") + "</small></div>" +
        '<button class="small" data-act="logout">Sign out</button>';
    } else {
      u.innerHTML = '<button class="discord" data-act="login">Sign in with Discord</button>' +
        (S.config && S.config.dev ? ' <button class="small" data-act="devlogin" title="a development service: signs anyone in as any id">Dev sign-in</button>' : "");
    }
  }
  function render() {
    document.querySelectorAll("#arena-tabs a").forEach((a) => a.classList.toggle("on", a.dataset.tab === S.view));
    renderUser();
    const app = $("#app");
    if (S.view === "watch") app.innerHTML = viewWatch();
    else if (S.view === "bestiary") app.innerHTML = viewBestiary();
    else if (S.view === "profile") app.innerHTML = viewProfile();
    else app.innerHTML = viewTop();
    if (S.view === "watch") ensureLive();
    if (S.view === "profile") ensureProfile();
    if (S.view === "top") ensureBoard();
  }

  // ------------------------------------------------------------------ watch & play
  function viewWatch() {
    const st = S.live && S.live.state, on = S.live && S.live.online;
    const mons = (st && st.monsters) || [];
    const rounds = st && st.rounds;
    const status = '<div class="status"><span><i class="dot' + (on ? " on" : "") + '"></i>' + (on ? "live" : (S.apiDown ? "the arena's service is not reachable" : "the arena is offline right now")) + "</span>" +
      (st ? "<span>" + esc(st.mode || "") + " mode</span><span>round " + esc(st.round || "") + (rounds && rounds.phase ? " · " + esc(rounds.phase) + (rounds.seconds != null ? " " + Math.floor(rounds.seconds / 60) + ":" + String(rounds.seconds % 60).padStart(2, "0") : "") : "") + "</span><span>" + mons.length + " alive</span>" : "") + "</div>";
    const feed = '<ul class="feed">' + ((S.live && S.live.feed) || []).slice().reverse().map((e) => {
      const t = e.caption || e.text || e.label || (e.kind === "round" ? "round " + e.number + ": " + e.phase : "");
      return t ? '<li class="' + esc(e.kind) + '"><b>' + esc(e.kind) + "</b> " + esc(t) + "</li>" : "";
    }).join("") + "</ul>";
    const player = '<div class="stream"><iframe src="https://player.twitch.tv/?channel=' + CHANNEL + PARENTS.map((p) => "&parent=" + p).join("") + '&muted=false" allowfullscreen title="The arena stream"></iframe></div>';
    return '<div class="grid2"><div>' + player + status + '<div class="panel" style="margin-top:14px"><h3>What just happened</h3>' + feed + "</div></div><div>" + panel(mons) + "</div></div>";
  }
  function panel(mons) {
    if (!S.me) {
      return '<div class="panel sign-card"><h2>Play from here</h2><p>Sign in with Discord and your arena account comes with you: essence to send monsters in, souls to unlock the bestiary and build talent trees, and every kill your monsters make counts.</p>' +
        '<button class="discord" data-act="login">Sign in with Discord</button><p class="inline-note">Not on the Discord yet? <a href="https://discord.gg/BMYyM88Shs" target="_blank" rel="noopener">Join the DFWGV server</a>.</p></div>';
    }
    const a = S.me.account;
    const wallet = a ? '<div class="chips"><span class="chip">level <b>' + a.level + "</b></span><span class=\"chip\">essence <b>" + num(a.essence) + "</b>/" + a.cap + '</span><span class="chip">souls <b>' + num(a.souls) + "</b></span>" + (a.home_door ? '<span class="chip">door <b>' + a.home_door + "</b></span>" : "") + "</div>" :
      '<p class="inline-note">Your account starts the moment you send something in: 25 essence, the four starter monsters.</p>';
    return '<div class="panel"><h3>Your arena</h3>' + wallet + "</div>" + releaseForm() + ordersPanel(mons) + hazardsPanel(mons) + roundsPanel() + consolePanel();
  }
  function releaseForm() {
    const f = S.form;
    const owned = S.order.filter((m) => ownsType(m.name));
    const m = S.byName[f.name] || null;
    const tiles = S.order.map((x) => {
      const ok = ownsType(x.name);
      return '<div class="tile' + (ok ? "" : " locked") + (x.name === f.name ? " on" : "") + '" data-act="pick" data-name="' + esc(x.name) + '" title="' + esc(x.name + (ok ? "" : " · locked, " + x.unlock + " souls")) + '"><img src="' + esc(x.img) + '" alt="" loading="lazy">' + (ok ? "" : '<span class="lock">' + x.unlock + "</span>") + '<span class="n">' + esc(x.name) + "</span></div>";
    }).join("");
    const variants = m ? ((S.me.account && S.me.account.variants[m.name]) || []) : [];
    const cost = m ? releaseCost(m, f.strength, f.count, f.variant, f.door || 1) : 0;
    const talents = m && S.me.account && S.me.account.talents[f.variant ? affix(f.variant) + " " + m.name : m.name];
    const home = (S.me.account && S.me.account.home_door) || 0;
    return '<div class="panel"><h3>Send in a monster</h3><p class="sub">' + owned.length + " of " + S.order.length + ' types unlocked · <a href="#bestiary">the bestiary</a> sells the rest for souls</p>' +
      '<div class="picker">' + tiles + "</div>" +
      (m ? '<div class="form-row" style="margin-top:10px"><b>' + esc(m.name) + '</b><span class="inline-note">threat ' + m.threat + " · " + esc(m.notes) + "</span></div>" : '<p class="inline-note">Pick a monster above.</p>') +
      '<div class="form-row"><label>How many<select data-bind="count">' + [1, 2, 3, 4, 5].map((n) => '<option value="' + n + '"' + (n === f.count ? " selected" : "") + ">" + n + "</option>").join("") + "</select></label>" +
      '<label>Door<select data-bind="door"><option value="0"' + (f.door === 0 ? " selected" : "") + ">" + (home ? "your door " + home : "the emptiest") + "</option>" + [1, 2, 3, 4, 5, 6, 7, 8].map((d) => '<option value="' + d + '"' + (d === f.door ? " selected" : "") + ">door " + d + "</option>").join("") + '<option value="9"' + (f.door === 9 ? " selected" : "") + ">every door (level 6)</option></select></label>" +
      '<label>Strength<select data-bind="strength">' + STRENGTHS.map((s) => '<option value="' + s + '"' + (s === f.strength ? " selected" : "") + ">" + s + "%</option>").join("") + "</select></label>" +
      (variants.length ? '<label>Variant<select data-bind="variant"><option value="">plain</option>' + variants.map((v) => '<option value="' + esc(v) + '"' + (v === f.variant ? " selected" : "") + ">" + esc(affix(v)) + "</option>").join("") + "</select></label>" : "") +
      (talents ? '<label>Build<select data-bind="vanilla"><option value="0"' + (!f.vanilla ? " selected" : "") + ">your " + talents.points + "-point build</option><option value=\"1\"" + (f.vanilla ? " selected" : "") + ">vanilla</option></select></label>" : "") +
      "</div>" +
      '<div class="form-row"><button class="gold" data-act="release"' + (m ? "" : " disabled") + ">Send in" + (m ? " · " + cost + " essence" : "") + "</button>" +
      (m && !ownsType(m.name) ? '<span class="inline-note">locked: ' + m.unlock + ' souls in <a href="#bestiary/' + esc(m.key) + '">the bestiary</a></span>' : "") + "</div></div>";
  }
  function affix(vkey) { const v = (S.cat && S.cat.variants || []).find((x) => x.key === vkey); return v ? v.affix : vkey; }
  function ordersPanel(mons) {
    if (!mons.length) return '<div class="panel"><h3>Orders</h3><p class="inline-note">Nothing is alive on the floor right now.</p></div>';
    const costs = (S.cat && S.cat.costs && S.cat.costs.order) || {};
    const list = mons.map((x) => {
      const acts = ORDERS.map(([k, label]) => '<button class="small" data-act="order" data-order="' + k + '" data-id="' + x.id + '" title="' + (costs[k] || 0) + ' essence">' + label + "</button>").join("") +
        '<select class="small" data-act="weapon" data-id="' + x.id + '" title="' + (costs.weapon || 3) + ' essence, level 3"><option value="">weapon…</option>' + WEAPONS.map((w) => '<option value="' + w + '">' + w + "</option>").join("") + "</select>";
      return '<div class="mon"><b>' + esc(x.name) + "</b> #" + x.id + ' <span class="inline-note">door ' + x.door + (x.fx ? " · " + esc(x.fx) : "") + '</span><div class="hp"><i style="width:' + Math.max(0, Math.min(100, x.hp || 0)) + '%"></i></div><div class="acts">' + acts + "</div></div>";
    }).join("");
    return '<div class="panel"><h3>Orders</h3><p class="sub">Orders cost essence (' + Object.entries(costs).map(([k, v]) => k + " " + v).join(", ") + '). Hunt asks for a target next.</p>' +
      (S.target ? '<p class="inline-note">Hunt with #' + S.target + ": click the target below, or <button class=\"small\" data-act=\"untarget\">cancel</button></p>" : "") + '<div class="mon-list">' + list + "</div></div>";
  }
  function hazardsPanel(mons) {
    const hz = (S.cat && S.cat.costs && S.cat.costs.hazard) || { explosion: 3, lightning: 3, meteors: 4, seal: 2 };
    const targets = '<option value="0">the middle</option>' + [1, 2, 3, 4, 5, 6, 7, 8].map((d) => '<option value="' + d + '">door ' + d + "</option>").join("") + mons.map((x) => '<option value="' + x.id + '">' + esc(x.name) + " #" + x.id + "</option>").join("");
    return '<div class="panel"><h3>Hazards</h3><p class="sub">Level 2 unlocks them (meteors at level 3).</p><div class="form-row"><label>What<select data-bind="hazard"><option value="explosion">explosion · ' + hz.explosion + '</option><option value="lightning">lightning · ' + hz.lightning + '</option><option value="meteors">meteors · ' + hz.meteors + '</option></select></label><label>Where<select data-bind="hazardAt">' + targets + '</select></label><button data-act="hazard">Drop it</button></div>' +
      '<div class="form-row"><label>Seal a door<select data-bind="sealDoor">' + [1, 2, 3, 4, 5, 6, 7, 8].map((d) => '<option value="' + d + '">door ' + d + "</option>").join("") + '</select></label><button data-act="seal">Seal · ' + hz.seal + "</button></div></div>";
  }
  function roundsPanel() {
    const st = S.live && S.live.state, r = st && st.rounds;
    const bets = (S.cat && S.cat.costs && S.cat.costs.bet) || [2, 5, 10, 20];
    return '<div class="panel"><h3>Rounds</h3><p class="sub">' + (r && r.phase ? "Round " + esc(st.round) + " is in the " + esc(r.phase) + ". " : "") + "Join a door and its kills are yours; bet on the door you think takes the round.</p>" +
      '<div class="form-row"><label>Door<select data-bind="joinDoor">' + [1, 2, 3, 4, 5, 6, 7, 8].map((d) => '<option value="' + d + '">door ' + d + "</option>").join("") + '</select></label><button data-act="join">Join this door</button></div>' +
      '<div class="form-row"><label>Bet on<select data-bind="betDoor">' + [1, 2, 3, 4, 5, 6, 7, 8].map((d) => '<option value="' + d + '">door ' + d + "</option>").join("") + '</select></label><label>Essence<select data-bind="betAmt">' + bets.map((b) => '<option value="' + b + '">' + b + "</option>").join("") + '</select></label><button data-act="bet">Place the bet</button></div></div>';
  }
  function consolePanel() {
    const log = S.log.slice(-12).reverse().map((l) => '<li><span class="cmd">' + esc(l.text) + "</span>" + (l.reply ? '<span class="rep">' + esc(l.reply) + "</span>" : "") + (l.ack && !l.reply ? '<span class="rep">✓ ' + esc(l.ack) + "</span>" : "") + (l.note ? '<span class="rep warn">' + esc(l.note) + "</span>" : "") + "</li>").join("");
    return '<div class="panel"><h3>Console</h3><p class="sub">Any chat command works here: <code>!help</code> lists them. Plain text goes to the director.</p><form class="console" data-act="console"><input type="text" name="cmd" placeholder="!release Ogre 3 150" maxlength="200" autocomplete="off"><button class="gold" type="submit">Send</button></form><ul class="log">' + log + "</ul></div>";
  }
  let liveTimer = null;
  function ensureLive() {
    if (liveTimer) return;
    const tick = async () => {
      if (S.view !== "watch") { clearInterval(liveTimer); liveTimer = null; return; }
      try { S.live = await api("/api/state"); } catch (e) { S.live = null; }
      if (S.view === "watch" && !document.activeElement.closest?.(".console")) render();
    };
    tick(); liveTimer = setInterval(tick, 6000);
  }

  // ------------------------------------------------------------------ bestiary
  function viewBestiary() {
    const f = S.filter, key = S.args[0];
    const detail = key ? bestiaryDetail(S.order.find((m) => m.key === key)) : "";
    const shelves = (S.cat && S.cat.shelves) || [];
    const q = f.q.trim().toLowerCase();
    const filters = '<div class="panel"><div class="filters"><input type="search" placeholder="Search a name or a trick" value="' + esc(f.q) + '" data-bind="q">' +
      '<select data-bind="shelf"><option value="">Every shelf</option>' + shelves.map((s) => '<option value="' + esc(s.label) + '"' + (f.shelf === s.label ? " selected" : "") + ">" + esc(s.label) + "</option>").join("") + "</select>" +
      '<select data-bind="attack"><option value="">Melee and ranged</option>' + ["melee", "ranged", "both"].map((a) => '<option value="' + a + '"' + (f.attack === a ? " selected" : "") + ">" + a + "</option>").join("") + "</select>" +
      '<select data-bind="threat"><option value="">Any threat</option>' + [1, 2, 3, 4, 5].map((t) => '<option value="' + t + '"' + (f.threat === String(t) ? " selected" : "") + ">threat " + t + "</option>").join("") + "</select>" +
      (S.me ? '<label class="inline-note"><input type="checkbox" data-bind="owned"' + (f.owned ? " checked" : "") + "> only mine</label>" : "") + "</div>" +
      '<p class="sub">' + (S.me ? "Unlocked types are in colour; a locked one shows its price in souls. Click a card for the details, its variants and the unlock button." : "Sign in to see which you own and to unlock more. Click a card for the details.") + "</p></div>";
    let out = filters + detail;
    for (const s of shelves) {
      const rows = S.order.filter((m) => s.sources.includes(m.source) && (!f.shelf || f.shelf === s.label) && (!f.attack || m.attack === f.attack) && (!f.threat || String(m.threat) === f.threat) &&
        (!f.owned || ownsType(m.name)) && (!q || (m.name + " " + m.notes + " " + (m.source_label || "")).toLowerCase().includes(q))).sort((a, b) => a.threat - b.threat || (b.boss - a.boss) || a.name.localeCompare(b.name));
      if (!rows.length) continue;
      out += '<div class="shelf"><h2>' + esc(s.label) + "</h2><small>" + rows.length + " types</small></div><div class=\"cards\">" + rows.map(card).join("") + "</div>";
    }
    return out;
  }
  function pips(t) { let s = '<span class="pips">'; for (let i = 0; i < 5; i++) s += '<i class="pip' + (i < t ? " on" : "") + '"></i>'; return s + "</span>"; }
  function card(m) {
    const owned = ownsType(m.name), signed = !!S.me;
    return '<article class="card' + (m.boss ? " boss" : "") + (signed && !owned ? " locked" : "") + '" data-act="open" data-key="' + esc(m.key) + '"><div class="shot"><img src="' + esc(m.img) + '" alt="' + esc(m.name) + '" loading="lazy"><div class="badges"><span class="badge ' + m.attack + '">' + ATTACK_WORD[m.attack] + "</span>" + (m.fly ? '<span class="badge fly">flies</span>' : "") + (m.boss ? '<span class="badge boss">boss</span>' : "") + (signed && !owned ? '<span class="badge lock">locked</span>' : "") + '</div><div class="threat">threat ' + pips(m.threat) + "</div></div>" +
      '<div class="body"><div class="name"><span>' + esc(m.name) + "</span><small>" + esc(m.source_label || m.source) + '</small></div><div class="price">' + (m.starter ? "starter, free" : (owned ? "unlocked" : "<b>" + m.unlock + "</b> souls to unlock")) + " · " + (m.health ? m.health + " hp · " : "") + "hits " + m.hit + "</div></div></article>";
  }
  function bestiaryDetail(m) {
    if (!m) return "";
    const owned = ownsType(m.name), signed = !!S.me, a = S.me && S.me.account;
    const vs = (S.cat && S.cat.variants) || [];
    const variants = vs.map((v) => {
      const have = ownsVariant(m.name, v.key);
      const btn = !signed ? "" : have ? '<a href="#profile/' + esc(S.me.user.id) + "/" + esc(v.affix + " " + m.name) + '"><button class="small">Build</button></a>' :
        '<button class="small" data-act="unlock" data-name="' + esc(m.name) + '" data-variant="' + esc(v.key) + '"' + (owned ? "" : ' disabled title="unlock the ' + esc(m.name) + ' first"') + ">Unlock · " + m.variant + " souls</button>";
      return '<div class="variant' + (have ? " owned" : "") + '"><span class="vn">' + esc(v.affix + " " + m.name) + '</span><span class="vb">' + esc(v.blurb) + "</span>" + (have ? '<span class="inline-note">owned · </span>' : "") + btn + "</div>";
    }).join("");
    const unlockBtn = !signed ? '<button class="discord" data-act="login">Sign in to unlock</button>' : m.starter ? '<span class="chip">starter, always yours</span>' : owned ? '<span class="chip">unlocked for good</span> <a href="#profile/' + esc(S.me.user.id) + "/" + esc(m.name) + '"><button class="small">Talent tree</button></a>' :
      '<button class="gold" data-act="unlock" data-name="' + esc(m.name) + '">Unlock for ' + m.unlock + " souls</button>" + (a ? '<span class="inline-note"> you have ' + num(a.souls) + "</span>" : "");
    return '<div class="panel detail' + (signed && !owned ? " locked" : "") + '"><div><img src="' + esc(m.img) + '" alt="' + esc(m.name) + '"></div><div><h2>' + esc(m.name) + ' <small class="inline-note">' + esc(m.source_label || m.source) + "</small></h2><p>" + esc(m.notes) + "</p>" +
      '<div class="stats"><div class="stat"><div class="k">Threat</div><div class="v">' + m.threat + '</div></div><div class="stat"><div class="k">Fights</div><div class="v">' + ATTACK_WORD[m.attack] + (m.fly ? ", flies" : "") + '</div></div><div class="stat"><div class="k">Health</div><div class="v">' + (m.health || "?") + '</div></div><div class="stat"><div class="k">Hardest hit</div><div class="v">' + m.hit + '</div></div><div class="stat"><div class="k">Unlock</div><div class="v gold">' + (m.starter ? "free" : m.unlock + " souls") + '</div></div><div class="stat"><div class="k">Each variant</div><div class="v gold">' + m.variant + " souls</div></div></div>" +
      '<div class="form-row">' + unlockBtn + ' <a href="#bestiary"><button class="small">Close</button></a></div>' +
      "<h3>Variants</h3><p class=\"sub\">Eight variants of every type, each with its own talent tree. The base monster comes first.</p><div class=\"variants\">" + variants + "</div></div></div>";
  }

  // ------------------------------------------------------------------ profile
  async function ensureProfile() {
    const id = S.args[0] || (S.me && S.me.user.id);
    if (!id) return;
    if (S.profileId !== id || !S.profile) {
      S.profileId = id; S.profile = null;
      try { S.profile = await api("/api/profile/" + encodeURIComponent(id)); } catch (e) { S.profile = { missing: true, error: e.message }; }
      render();
    }
    const build = S.args[1];
    if (build && (S.treeName !== build || !S.tree || S.tree.forId !== id)) {
      S.treeName = build; S.tree = null;
      try { S.tree = await api("/api/tree?name=" + encodeURIComponent(build) + "&key=" + encodeURIComponent(id)); S.tree.forId = id; } catch (e) { S.tree = { error: e.message }; }
      render();
    }
  }
  function viewProfile() {
    const id = S.args[0] || (S.me && S.me.user.id);
    if (!id) return '<div class="panel sign-card"><h2>Your profile</h2><p>Sign in with Discord to see your stats, the monsters you have unlocked and their talent trees.</p><button class="discord" data-act="login">Sign in with Discord</button></div>';
    const p = S.profile, mine = S.me && S.me.user.id === id;
    if (!p) return '<p class="arena-muted">Loading the profile…</p>';
    if (p.missing) return '<div class="panel"><h2>' + (mine ? "You have no arena account yet" : "No such account") + "</h2><p>" + (mine ? "It starts the moment you send a monster in or press anything on the Watch page." : esc(p.error)) + "</p></div>";
    const pct = Math.min(100, Math.round(100 * (p.glory - glory(p.level)) / Math.max(1, p.next_level_glory - glory(p.level))));
    const head = '<div class="panel profile-head">' + (mine && S.me.user.avatar ? '<img src="' + esc(S.me.user.avatar) + '" alt="">' : "") + '<div class="ph"><h2>' + (p.title ? '<span class="title">' + esc(p.title) + "</span>" : "") + esc(p.name) + '</h2><div class="inline-note">level ' + p.level + " · " + num(p.glory) + " glory · " + (p.next_level_glory - p.glory) + " to level " + (p.level + 1) + '</div><div class="level"><i style="width:' + pct + '%"></i></div>' +
      '<div class="chips" style="margin-top:8px"><span class="chip">essence <b>' + num(p.essence) + "</b>/" + p.cap + '</span><span class="chip">souls <b>' + num(p.souls) + "</b></span>" + (p.home_door ? '<span class="chip">door <b>' + p.home_door + "</b></span>" : "") + (p.streak ? '<span class="chip">streak <b>' + p.streak + "</b></span>" : "") + "</div></div>" +
      (mine ? '<div class="inline-note">Share this page: <code>' + esc(location.origin + location.pathname + "#profile/" + id) + "</code></div>" : "") + "</div>";
    const stats = '<div class="panel"><h3>Record</h3><div class="stats">' + [["Sent in", p.releases], ["Kills", p.kills], ["Lost", p.deaths], ["Orders", p.orders], ["Hazards", p.hazards], ["Champion kills", p.champion_kills], ["Boss kills", p.boss_kills], ["Round wins", p.round_wins], ["Bets won", p.bets_won], ["Upsets", p.upsets]].map(([k, v]) => '<div class="stat"><div class="k">' + k + '</div><div class="v">' + num(v) + "</div></div>").join("") + "</div>" +
      (p.daily && p.daily.glory || p.weekly && p.weekly.glory ? '<p class="inline-note">today: ' + num(p.daily.glory) + " glory, " + num(p.daily.kills) + " kills · this week: " + num(p.weekly.glory) + " glory, " + num(p.weekly.kills) + " kills</p>" : "") +
      (p.best && p.best.kills ? '<p class="inline-note">best monster: ' + esc(p.best.name) + " with " + p.best.kills + " kills</p>" : "") +
      (p.favourites.length ? '<p class="inline-note">favourites: ' + p.favourites.map((f) => esc(f.name) + " ×" + f.count).join(", ") + "</p>" : "") +
      (!p.title ? '<p class="inline-note">titles: ' + p.titles.map((t) => esc(t.title) + " for " + esc(t.for) + " (" + t.have + "/" + t.need + ")").join("; ") + "</p>" : "") + "</div>";
    const build = S.args[1];
    const tiles = S.order.map((m) => {
      const own = m.starter || p.unlocked.includes(m.name);
      const pts = (p.talents[m.name] || {}).points || 0;
      const vs = (p.variants[m.name] || []).length;
      return '<a class="tile' + (own ? "" : " locked") + (build && build.endsWith(m.name) ? " on" : "") + '" href="#profile/' + esc(id) + "/" + esc(m.name) + '" title="' + esc(m.name + (own ? (pts ? " · " + pts + "-point build" : "") + (vs ? " · " + vs + " variants" : "") : " · locked, " + m.unlock + " souls")) + '"><img src="' + esc(m.img) + '" alt="" loading="lazy">' + (own ? (pts ? pips(Math.min(5, Math.ceil(pts / 2))) : "") : '<span class="lock">' + m.unlock + "</span>") + '<span class="n">' + esc(m.name) + "</span></a>";
    }).join("");
    const monsters = '<div class="panel"><h3>' + (mine ? "Your monsters" : "Monsters") + '</h3><p class="sub">' + p.unlocked.length + " unlocked beyond the four starters · locked ones are greyed with their price · " + Object.keys(p.talents).length + " builds. Click one for its talent tree and variants.</p><div class=\"picker\" style=\"max-height:none\">" + tiles + "</div></div>";
    return head + stats + monsters + (build ? buildPanel(p, build, mine) : "");
  }
  function glory(level) { return 30 * (level - 1) * (level - 1); }
  function buildPanel(p, build, mine) {
    const parts = splitBuild(build);
    if (!parts) return "";
    const base = S.byName[parts.base], vkey = parts.vkey;
    const own = base.starter || p.unlocked.includes(base.name);
    const vs = (S.cat && S.cat.variants) || [];
    const selector = '<div class="variants">' + [{ key: "", affix: "" }].concat(vs).map((v) => {
      const have = v.key ? (p.variants[base.name] || []).includes(v.key) : own;
      const name = v.key ? v.affix + " " + base.name : base.name;
      const pts = (p.talents[name] || {}).points || 0;
      const inner = '<span class="vn">' + esc(name) + "</span>" + (v.blurb ? '<span class="vb">' + esc(v.blurb) + "</span>" : '<span class="vb">the base monster</span>') +
        (have ? '<span class="inline-note">' + (pts ? pts + "-point build" : "no points yet") + "</span>" : (mine && v.key ? '<button class="small" data-act="unlock" data-name="' + esc(base.name) + '" data-variant="' + esc(v.key) + '"' + (own ? "" : ' disabled title="unlock the base monster first"') + ">Unlock · " + base.variant + " souls</button>" : '<span class="inline-note">locked</span>'));
      return have ? '<a class="variant owned' + (name === build ? " on" : "") + '" href="#profile/' + esc(p.id) + "/" + esc(name) + '">' + inner + "</a>" : '<div class="variant' + (name === build ? " on" : "") + '">' + inner + "</div>";
    }).join("") + "</div>";
    let tree = "";
    const t = S.tree;
    if (!t || t.forId !== p.id) tree = '<p class="arena-muted">Loading the tree…</p>';
    else if (t.error) tree = '<p class="arena-muted">' + esc(t.error) + "</p>";
    else {
      const names = ["Tier one", "Tier two", "Tier three", "Capstone"];
      tree = '<div class="build-bar"><span class="pts"><b>' + t.points + "</b> of " + t.budget + " points" + (t.word ? " · " + esc(t.word) : "") + "</span>" + (t.summary ? '<span class="inline-note">' + esc(t.summary) + "</span>" : '<span class="inline-note">no points spent yet</span>') +
        (mine ? '<button class="small" data-act="respec" data-build="' + esc(build) + '"' + (t.points ? "" : " disabled") + ">Reset the build · " + t.respec + " souls</button>" : "") + "</div>" +
        '<p class="inline-note">Ranks cost souls (tier one 20/25/30, tier two 35/40/45, tier three 50/60, the capstone 80); tiers open at 0, 3, 6 and 9 points; a build holds ten points, so no tree can be filled.</p><div class="tree">' +
        t.tiers.map((tier, i) => {
          const open = t.points >= t.tier_unlock[i];
          return '<div class="tier' + (open ? "" : " shut") + '"><h4><span>' + names[i] + "</span><span>" + (open ? "open" : "opens at " + t.tier_unlock[i] + " points") + '</span></h4><div class="talents">' + tier.map((tal) => {
            const r = t.ranks[tal.key] || 0, max = tal.ranks.length, can = t.can[tal.key] || {};
            const cls = "talent" + (r >= max ? " maxed" : "") + (i === 3 ? " cap" : "");
            const btn = mine ? (r >= max ? '<span class="why">maxed</span>' : (can.cost != null ? '<button class="small gold" data-act="spend" data-build="' + esc(build) + '" data-key="' + esc(tal.key) + '">Buy rank ' + (r + 1) + " · " + can.cost + " souls</button>" : '<span class="why">' + esc(can.why || "") + "</span>")) : "";
            return '<div class="' + cls + '"><div class="tn"><span>' + esc(tal.name) + "</span><small>" + r + "/" + max + '</small></div><span class="tb">' + esc(tal.blurb) + "</span>" + btn + "</div>";
          }).join("") + "</div></div>";
        }).join("") + "</div>";
    }
    return '<div class="panel"><h3>' + esc(build) + '</h3><p class="sub">' + (own ? "Pick the base or a variant; each has its own ten-point build." : "This monster is locked: unlock it in the bestiary first.") + "</p>" + selector + (own && (!vkey || (p.variants[base.name] || []).includes(vkey)) ? tree : (own ? '<p class="inline-note">Unlock this variant to build it.</p>' : "")) +
      (mine && own ? '<div class="form-row"><a href="#watch"><button data-act="send-build" data-name="' + esc(base.name) + '" data-variant="' + esc(vkey || "") + '">Send this one in</button></a></div>' : "") + "</div>";
  }
  function splitBuild(build) {
    if (S.byName[build]) return { base: build, vkey: "" };
    for (const v of ((S.cat && S.cat.variants) || [])) if (build.startsWith(v.affix + " ") && S.byName[build.slice(v.affix.length + 1)]) return { base: build.slice(v.affix.length + 1), vkey: v.key };
    return null;
  }

  // ------------------------------------------------------------------ leaderboard
  async function ensureBoard() {
    if (S.board && S.board.period === (S.boardPeriod === "all" ? "all" : S.boardPeriod)) return;
    try { S.board = await api("/api/leaderboard" + (S.boardPeriod === "all" ? "" : "?period=" + S.boardPeriod)); } catch (e) { S.board = { period: S.boardPeriod, rows: [], error: e.message }; }
    render();
  }
  function viewTop() {
    const b = S.board;
    const tabs = '<div class="tabs2">' + [["all", "All time"], ["day", "Today"], ["week", "This week"]].map(([k, l]) => '<button class="' + (S.boardPeriod === k ? "on" : "") + '" data-act="period" data-period="' + k + '">' + l + "</button>").join("") + "</div>";
    if (!b) return '<div class="panel">' + tabs + '<p class="arena-muted">Loading…</p></div>';
    const rows = b.rows.map((r) => "<tr><td class=\"num\">" + r.rank + "</td><td>" + (r.id ? '<a href="#profile/' + esc(r.id) + '">' : "") + (r.title ? '<span class="title">' + esc(r.title) + "</span> " : "") + esc(r.name) + (r.id ? "</a>" : "") + '</td><td class="num">' + r.level + '</td><td class="num">' + num(r.glory) + '</td><td class="num">' + num(r.kills) + '</td><td class="num">' + num(r.releases) + "</td></tr>").join("");
    return '<div class="panel"><h2>Leaderboard</h2>' + tabs + (b.error ? '<p class="arena-muted">' + esc(b.error) + "</p>" : rows ? '<table class="top-table"><thead><tr><th></th><th>Player</th><th>Level</th><th>Glory</th><th>Kills</th><th>Sent in</th></tr></thead><tbody>' + rows + "</tbody></table>" : '<p class="arena-muted">Nobody on the board yet.</p>') + "</div>";
  }

  // ------------------------------------------------------------------ commands
  async function send(text) {
    if (!S.me) { notice("Sign in with Discord first."); return null; }
    if (S.busy) return null;
    S.busy = true; $("#app").classList.add("busy");
    const entry = { text: text, reply: null, ack: null, note: null };
    S.log.push(entry);
    try {
      const r = await api("/api/command", { method: "POST", body: { text: text } });
      entry.reply = r.reply; entry.ack = r.ack; entry.note = r.note;
      notice(r.reply || (r.ack ? "✓ " + r.ack : r.note), !!(r.reply || r.ack));
    } catch (e) { entry.note = e.message; notice(e.message); }
    S.busy = false; $("#app").classList.remove("busy");
    await loadMe();
    S.profile = null; S.tree = null;
    render();
    return entry;
  }
  function bound(name) { const el = document.querySelector('[data-bind="' + name + '"]'); return el ? el.value : ""; }

  document.addEventListener("click", async (ev) => {
    const el = ev.target.closest("[data-act]");
    if (!el) return;
    const act = el.dataset.act;
    if (act === "login") { ev.preventDefault(); location.href = API + "/api/auth/discord"; return; }
    if (act === "devlogin") {
      const id = prompt("Sign in as which account id? (a Discord user id, or anything on a development service)", "424242");
      if (!id) return;
      try { const r = await api("/api/dev-login", { method: "POST", body: { id: id, name: "dev " + id } }); setToken(r.token); await loadMe(); S.profile = null; render(); } catch (e) { notice(e.message); }
      return;
    }
    if (act === "logout") { try { await api("/api/logout", { method: "POST", body: {} }); } catch (e) {} setToken(null); S.me = null; S.profile = null; S.tree = null; render(); return; }
    if (act === "pick") { S.form.name = el.dataset.name; S.form.variant = ""; render(); return; }
    if (act === "open") { location.hash = "#bestiary/" + el.dataset.key; window.scrollTo({ top: 0, behavior: "smooth" }); return; }
    if (act === "period") { S.boardPeriod = el.dataset.period; S.board = null; render(); return; }
    if (act === "untarget") { S.target = null; render(); return; }
    if (act === "send-build") { S.form.name = el.dataset.name; S.form.variant = el.dataset.variant || ""; S.form.vanilla = false; return; }
    if (act === "release") {
      const f = S.form, m = S.byName[f.name];
      if (!m) return;
      // "!release Name [door] [strength] [xN] [variant] [vanilla]": the agent reads two trailing
      // numbers as door and strength, and a lone number of fifty or more as the strength
      let text = "!release " + m.name;
      if (f.door) text += " " + f.door + " " + f.strength;
      else if (f.strength !== 100) text += " " + f.strength;
      if (f.count > 1) text += " x" + f.count;
      if (f.variant) text += " " + f.variant;
      if (f.vanilla) text += " vanilla";
      await send(text); return;
    }
    if (act === "order") {
      const k = el.dataset.order, id = el.dataset.id;
      if (k === "hunt") {
        if (S.target && S.target !== id) { const t = S.target; S.target = null; await send("!hunt " + t + " " + id); return; }
        S.target = id; render(); return;
      }
      if (S.target) { const t = S.target; S.target = null; await send("!hunt " + t + " " + id); return; }
      await send("!" + k + " " + id); return;
    }
    if (act === "hazard") { const at = bound("hazardAt"); await send("!hazard " + bound("hazard") + (at && at !== "0" ? " " + at : "")); return; }
    if (act === "seal") { await send("!hazard seal " + bound("sealDoor")); return; }
    if (act === "join") { await send("!join " + bound("joinDoor")); return; }
    if (act === "bet") { await send("!bet " + bound("betDoor") + " " + bound("betAmt")); return; }
    if (act === "unlock") { await send("!unlock " + el.dataset.name + (el.dataset.variant ? " " + el.dataset.variant : "")); return; }
    if (act === "spend") { await send("!talent " + el.dataset.build + " " + el.dataset.key); return; }
    if (act === "respec") { if (confirm("Reset every point in " + el.dataset.build + " for " + ((S.tree && S.tree.respec) || 50) + " souls? Nothing is refunded.")) await send("!respec " + el.dataset.build); return; }
  });
  document.addEventListener("change", (ev) => {
    const el = ev.target.closest("[data-bind], [data-act=weapon]");
    if (!el) return;
    if (el.dataset.act === "weapon") { if (el.value) send("!weapon " + el.dataset.id + " " + el.value); return; }
    const b = el.dataset.bind;
    if (b === "count") S.form.count = parseInt(el.value, 10) || 1;
    else if (b === "door") S.form.door = parseInt(el.value, 10) || 0;
    else if (b === "strength") S.form.strength = parseInt(el.value, 10) || 100;
    else if (b === "variant") S.form.variant = el.value;
    else if (b === "vanilla") S.form.vanilla = el.value === "1";
    else if (b === "shelf") S.filter.shelf = el.value;
    else if (b === "attack") S.filter.attack = el.value;
    else if (b === "threat") S.filter.threat = el.value;
    else if (b === "owned") S.filter.owned = el.checked;
    else return;
    render();
  });
  document.addEventListener("input", (ev) => {
    const el = ev.target;
    if (el.dataset && el.dataset.bind === "q") { S.filter.q = el.value; const pos = el.selectionStart; render(); const n = document.querySelector('[data-bind="q"]'); if (n) { n.focus(); n.setSelectionRange(pos, pos); } }
  });
  document.addEventListener("submit", async (ev) => {
    const f = ev.target.closest('[data-act="console"]');
    if (!f) return;
    ev.preventDefault();
    const text = f.cmd.value.trim();
    if (text) { f.cmd.value = ""; await send(text); }
  });
  window.addEventListener("hashchange", () => { route(); render(); });

  // ------------------------------------------------------------------ start
  (async function start() {
    try { S.token = localStorage.getItem("arena_token"); } catch (e) {}
    route();
    let bestiary = [];
    try { bestiary = await (await fetch("arena/bestiary.json")).json(); } catch (e) {}
    try { S.config = await api("/api/config"); S.cat = await api("/api/catalogue"); } catch (e) { S.cat = null; notice("The arena's service is not reachable right now; the bestiary still works, signing in and playing will not."); }
    if (!S.cat) S.cat = { monsters: bestiary.map((b) => Object.assign({}, b, { id: 0 })), variants: [], shelves: [["Quake", ["quake"]], ["Quake mission packs and episodes", ["hipnotic", "rogue", "mg3"]], ["Quake 2", ["quake2"]], ["Hexen II", ["hexen2"]], ["Arena originals", ["original"]], ["Arena kin", ["kin"]]].map(([l, s]) => ({ label: l, sources: s })), costs: {} };
    mergeData(bestiary, S.cat);
    await loadMe();
    if (S.me && S.me.account && !S.form.name) S.form.name = "";
    render();
  })();
})();
