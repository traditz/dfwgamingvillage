/* The DFWGV Arena page. A static page on GitHub Pages whose back end is the arena's Discord
   bot (tools/arena_ai/web_bridge.py in the mod repository), reached through the arena's own
   Firebase project, so nothing on the arena machine listens for connections and nothing here
   touches the site's planners. Sign-in is the arena's own Discord sign-in (arena/auth.js:
   Discord PKCE, the code exchanged and the token minted by the bot, uid "discord:<id>").
   The page writes a command document, the bot drops it into the agent's inbox as the chat
   line it already understands and writes the agent's reply back; profiles, the catalogue,
   the live state, the leaderboard and every talent tree are documents the bot publishes and
   anyone may read. */
import { signInWithDiscord, signOutUser, handleDiscordRedirect, onUser, ready as authReady, db as arenaDb } from "./auth.js?v=20260915c";
import { collection, doc, addDoc, getDoc, onSnapshot, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";

(function () {
  "use strict";
  const db = arenaDb;                     // null until arena/firebase-config.js is filled in
  const P = "arena";                      // the collections: arena_commands, arena_requests, arena_public, arena_profiles, arena_trees
  const CHANNEL = "dfwgv_arena";
  const DISCORD = document.querySelector(".arena-discord") ? document.querySelector(".arena-discord").href : "https://discord.gg/eShZjbqeZy";
  const ATTACK_WORD = { melee: "melee", ranged: "ranged", both: "both" };
  const ORDERS = [["hunt", "Hunt"], ["rage", "Rage"], ["coward", "Coward"], ["normal", "Calm"], ["revive", "Revive"], ["burn", "Burn"], ["poison", "Poison"],
                  ["freeze", "Freeze"], ["haste", "Haste"], ["regen", "Regen"], ["shield", "Shield"], ["grow", "Grow"], ["shrink", "Shrink"]];
  const WEAPONS = ["rockets", "grenades", "lasers", "shards", "pods", "lightning", "nails", "own"];
  const STRENGTHS = [50, 75, 100, 125, 150, 200];
  const TIER_COSTS_FALLBACK = [[12000, 15000, 18000], [21000, 24000, 27000], [30000, 36000], [48000]];   // damage from the monster's own pool; the catalogue's tier_costs win
  const TIER_UNLOCK = [0, 3, 6, 9];
  const BUDGET_FALLBACK = 10, RESPEC_FALLBACK = 200;
  const LADDER_FALLBACK = [[1, "Initiate", 125, ""], [2, "Handler", 375, ""], [3, "Adept", 875, ""], [4, "Expert", 1750, ""], [5, "Specialist", 3250, ""],
                           [6, "Master", 5750, ""], [7, "Grandmaster", 10000, ""], [8, "Paragon", 17500, ""], [9, "Legend", 30000, ""], [10, "Mythic", 55000, ""]];
  const GROUPS_FALLBACK = [{ key: "mastery", label: "Mastery milestones" }, { key: "combat", label: "Combat and rounds" }, { key: "collection", label: "Collection" }, { key: "feats", label: "Feats" }, { key: "hunts", label: "Hunts" }];
  const COMMAND_WAIT = 25000;

  const S = {
    viewer: null, me: null, cat: null, byName: {}, order: [], live: null,
    view: "watch", args: [], log: [], tree: null, treeName: null, profile: null, profileId: null, board: null, boardPeriod: "all",
    form: { name: "", count: 1, door: 0, strength: 100, variant: "", vanilla: false, role: "", q: "", shelf: "", onlyOwned: (function () { try { return localStorage.getItem("arena_only_owned") === "1"; } catch (e) { return false; } })() }, filter: { q: "", shelf: "", attack: "", threat: "", owned: false },
    busy: false, target: null, unsub: { state: null, profile: null, mine: null }, refreshed: {}, layout: "side",
  };
  try { if (localStorage.getItem("arena_layout") === "theatre") S.layout = "theatre"; } catch (e) {}
  const $ = (sel) => document.querySelector(sel);
  if (new URLSearchParams(location.search).get("debug") === "1") window.arena = { S: S, render: () => render(), chat: () => chat };
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const num = (n) => (n == null ? "?" : Number(n).toLocaleString());
  const myId = () => (S.viewer && String(S.viewer.uid || "").startsWith("discord:") ? S.viewer.uid.slice(8) : null);

  // ------------------------------------------------------------------ Firestore
  function pub(name) { return db ? doc(db, P + "_public", name) : null; }
  async function readDoc(ref) { if (!ref) return null; try { const s = await getDoc(ref); return s.exists() ? s.data() : null; } catch (e) { return null; } }
  /** A document the bot answers: written pending, watched until it is not. */
  function ask(col, data, wait) {
    return new Promise(async (resolve) => {
      let ref, un = null, done = false;
      const finish = (v) => { if (done) return; done = true; if (un) un(); resolve(v); };
      if (!db) return finish({ status: "failed", note: "the arena's sign-in is not set up yet" });
      try {
        ref = await addDoc(collection(db, P + col), Object.assign({}, data, { uid: S.viewer.uid, status: "pending", created: serverTimestamp() }));
      } catch (e) { return finish({ status: "failed", note: /permission/i.test(e.message) ? "The arena is for members of the DFWGV Arena Discord. Join it, then sign in again; it can take a minute after joining." : e.message }); }
      un = onSnapshot(ref, (snap) => { const d = snap.data(); if (d && d.status && d.status !== "pending" && d.status !== "sent") finish(d); }, (e) => finish({ status: "failed", note: e.message }));
      setTimeout(() => finish({ status: "failed", note: "the arena did not answer in time" }), wait || COMMAND_WAIT);
    });
  }
  function watchState(on) {
    if (!db) return;
    if (on && !S.unsub.state) {
      S.unsub.state = onSnapshot(pub("state"), (snap) => { S.live = snap.exists() ? snap.data() : null; if ((S.view === "watch" || S.view === "admin") && !(document.activeElement && document.activeElement.closest(".console, .adm-row"))) render(); }, () => { S.live = null; });
    } else if (!on && S.unsub.state) { S.unsub.state(); S.unsub.state = null; }
  }
  function watchProfile(id) {
    if (S.unsub.profile) { S.unsub.profile(); S.unsub.profile = null; }
    if (!db) { S.profile = { missing: true, error: "the arena's service is not set up yet" }; return; }
    S.profileId = id; S.profile = null;
    S.unsub.profile = onSnapshot(doc(db, P + "_profiles", id), (snap) => { S.profile = snap.exists() ? snap.data() : { missing: true }; if (S.view === "profile") render(); }, () => { S.profile = { missing: true, error: "the profile could not be read" }; render(); });
    if (S.viewer && myId() && !S.refreshed[id]) { S.refreshed[id] = true; ask("_requests", { kind: "profile", key: id }, 15000); }
  }
  function watchMine(id) {
    if (S.unsub.mine) { S.unsub.mine(); S.unsub.mine = null; }
    if (!id || !db) return;
    S.unsub.mine = onSnapshot(doc(db, P + "_profiles", id), (snap) => { if (S.me) { S.me.account = snap.exists() ? snap.data() : null; renderUser(); if (S.view === "watch") render(); } });
  }
  async function signedIn() {
    const id = myId();
    if (!id) { S.me = null; if (S.viewer) notice("The arena follows Discord accounts: sign out and sign in with Discord to play."); return; }
    const r = await ask("_requests", { kind: "me" }, 15000);
    if (r.status !== "done") {
      S.me = null;
      notice(r.note || "The arena could not confirm your account.", false, r.note && /Discord/.test(r.note));
      return;
    }
    S.me = { user: { id: id, name: r.result.name || S.viewer.name }, admin: !!r.result.admin, account: null };
    watchMine(id);
    notice("");
  }

  // ------------------------------------------------------------------ Twitch chat, read from the public chat stream, without the bot
  const CHAT_HIDE = ["dfwgv_arena"];          // logins whose lines stay out: the arena's own bot, already in the feed
  const chat = { ws: null, want: false, lines: [], timer: null, tries: 0 };
  function chatWant(on) { chat.want = on; if (on) chatConnect(); else chatClose(); }
  function chatConnect() {
    if (!chat.want || chat.ws) return;
    let ws;
    try { ws = new WebSocket("wss://irc-ws.chat.twitch.tv:443"); } catch (e) { return; }
    chat.ws = ws;
    ws.onopen = () => { chat.tries = 0; ws.send("CAP REQ :twitch.tv/tags twitch.tv/commands"); ws.send("NICK justinfan" + Math.floor(10000 + Math.random() * 89999)); ws.send("JOIN #" + CHANNEL); };
    ws.onmessage = (ev) => { for (const line of String(ev.data).split("\r\n")) if (line) chatLine(line); };
    ws.onclose = () => { if (chat.ws === ws) chat.ws = null; if (chat.want) { chat.tries++; clearTimeout(chat.timer); chat.timer = setTimeout(chatConnect, Math.min(30000, 1000 * Math.pow(2, chat.tries))); } };
    ws.onerror = () => { try { ws.close(); } catch (e) {} };
  }
  function chatClose() { clearTimeout(chat.timer); if (chat.ws) { const w = chat.ws; chat.ws = null; try { w.close(); } catch (e) {} } }
  function parseIrc(line) {
    let tags = {}, prefix = "", rest = line;
    if (rest.startsWith("@")) { const sp = rest.indexOf(" "); for (const kv of rest.slice(1, sp).split(";")) { const i = kv.indexOf("="); tags[kv.slice(0, i)] = kv.slice(i + 1); } rest = rest.slice(sp + 1); }
    if (rest.startsWith(":")) { const sp = rest.indexOf(" "); prefix = rest.slice(1, sp); rest = rest.slice(sp + 1); }
    const ci = rest.indexOf(" :");
    const params = (ci >= 0 ? rest.slice(0, ci) : rest).split(" ");
    return { tags, prefix, cmd: params[0], params: params.slice(1), trailing: ci >= 0 ? rest.slice(ci + 2) : "" };
  }
  function chatLine(line) {
    if (line.startsWith("PING")) { if (chat.ws) chat.ws.send("PONG :tmi.twitch.tv"); return; }
    const m = parseIrc(line);
    if (m.cmd === "PRIVMSG") {
      const login = m.prefix.split("!")[0].toLowerCase();
      if (CHAT_HIDE.includes(login)) return;
      chat.lines.push({ id: m.tags.id, login, name: m.tags["display-name"] || login, color: m.tags.color || "", badges: m.tags.badges || "", text: m.trailing, emotes: m.tags.emotes || "" });
      if (chat.lines.length > 150) chat.lines.splice(0, chat.lines.length - 150);
      chatRender();
    } else if (m.cmd === "ROOMSTATE" || m.cmd === "JOIN") { chat.joined = true; if (!chat.lines.length) chatRender(); }
    else if (m.cmd === "CLEARCHAT") { const who = m.trailing.toLowerCase(); chat.lines = who ? chat.lines.filter((l) => l.login !== who) : []; chatRender(); }
    else if (m.cmd === "CLEARMSG") { const id = m.tags["target-msg-id"]; chat.lines = chat.lines.filter((l) => l.id !== id); chatRender(); }
  }
  function chatHtml(l) {
    // Twitch's emotes tag gives code point ranges into the text; those become images
    const cps = Array.from(l.text), spans = [];
    if (l.emotes) for (const part of l.emotes.split("/")) { const [id, ranges] = part.split(":"); if (!ranges) continue; for (const r of ranges.split(",")) { const [a, b] = r.split("-").map(Number); if (!isNaN(a) && !isNaN(b)) spans.push([a, b, id]); } }
    spans.sort((x, y) => x[0] - y[0]);
    let out = "", i = 0;
    for (const [a, b, id] of spans) { if (a < i) continue; out += esc(cps.slice(i, a).join("")); out += '<img class="emote" src="https://static-cdn.jtvnw.net/emoticons/v2/' + encodeURIComponent(id) + '/default/dark/1.0" alt="' + esc(cps.slice(a, b + 1).join("")) + '">'; i = b + 1; }
    out += esc(cps.slice(i).join(""));
    const badge = /broadcaster/.test(l.badges) ? '<i class="b bc" title="the streamer"></i>' : /moderator/.test(l.badges) ? '<i class="b bm" title="a moderator"></i>' : "";
    return '<li>' + badge + '<span class="cn" style="color:' + esc(/^#[0-9a-fA-F]{6}$/.test(l.color) ? l.color : "#c8c8d0") + '">' + esc(l.name) + '</span> ' + out + "</li>";
  }
  function chatRender() {
    const ul = $("#twitch-chat");
    if (!ul) return;
    const stick = ul.scrollHeight - ul.scrollTop - ul.clientHeight < 60;
    ul.innerHTML = chat.lines.map(chatHtml).join("") || '<li class="arena-muted">' + (chat.joined ? "Connected. Nobody has said anything since you arrived." : "Connecting to the chat…") + "</li>";
    if (stick) ul.scrollTop = ul.scrollHeight;
  }

  // ------------------------------------------------------------------ data
  function ownsType(name) { const a = S.me && S.me.account; const m = S.byName[name]; return !!(m && (m.starter || (a && (a.unlocked || []).includes(name)))); }
  function ownsVariant(name, key) { const a = S.me && S.me.account; return !!(a && a.variants && a.variants[name] && a.variants[name].includes(key)); }
  function mergeData(bestiary, cat) {
    S.byName = {}; S.order = [];
    const rows = (cat && cat.monsters) || bestiary;
    for (const m of rows) {
      const b = bestiary.find((x) => x.name === m.name) || {};
      const row = Object.assign({}, b, m, { img: "arena/img/" + (m.key || b.key) + ".jpg", attack: b.attack || (m.ranged ? "ranged" : "melee"), health: b.health || 0 });
      S.byName[m.name] = row; S.order.push(row);
    }
  }
  function recentCount(kind) {
    // copies of this kind the viewer sent within the window (the profile carries them, the director prices by them)
    const a = S.me && S.me.account, win = (S.cat && S.cat.costs && S.cat.costs.multi_window) || 90, now = Date.now() / 1000;
    return ((a && a.recent) || []).filter((r) => r[1] === kind && now - r[0] <= win).length;
  }
  function releaseCost(m, strength, count, variant, door) {
    const f = (S.cat && S.cat.costs && S.cat.costs.strength && S.cat.costs.strength[String(strength)]) || 1;
    let c = Math.max(1, Math.floor(2 * m.threat * f + 0.5));
    if (door === 9) c *= 3;
    if (variant) c += (S.cat && S.cat.costs && S.cat.costs.variant_surcharge) || 2;
    // copies of one kind cost a tenth more each, the ones sent of late counted: the k-th copy is c * (1 + step * (k - 1))
    const step = (S.cat && S.cat.costs && S.cat.costs.multi_step) || 0.1;
    const already = recentCount((variant ? affix(variant) + " " : "") + m.name);
    let total = 0;
    for (let k = already + 1; k <= already + count; k++) total += c * (1 + step * (k - 1));
    // the viewer's mastery of the type takes its share off the total, rounded the way the agent rounds
    return Math.floor(total * (1 - discountFor(S.me && S.me.account, m.name)) + 0.5);
  }
  function affordableCount(m, strength, variant, door) {
    // "send all": the most copies the essence in hand buys at once, the copy tax and the mastery discount counted
    const a = S.me && S.me.account, max = costs().release_all_max || 20;
    if (!a || a.essence == null) return 0;
    let n = 0;
    while (n < max && releaseCost(m, strength, n + 1, variant, door) <= a.essence) n++;
    return n;
  }
  function groupWords(members) {
    const seen = [];
    members.forEach((d) => { if (!seen.includes(d)) seen.push(d); });
    return seen.map((d) => { const n = members.filter((x) => x === d).length; return n > 1 ? d + " x" + n : d; }).join(", ");
  }
  function groupCost(members, strength, door) {
    const counts = {};
    members.forEach((dn) => { counts[dn] = (counts[dn] || 0) + 1; });
    let total = 0;
    for (const dn of Object.keys(counts)) {
      const parts = dn.split(" ");
      let m = S.byName[dn], variant = "";
      if (!m && parts.length > 1) { m = S.byName[parts.slice(1).join(" ")]; variant = parts[0]; }
      if (m) total += releaseCost(m, strength, counts[dn], variant, door);
    }
    return total;
  }
  function memberWord(m) { const f = S.form; return (f.variant ? affix(f.variant) + " " : "") + m.name; }
  function groupAddRow(m) {
    // under the picked monster: put it (its count and variant as picked) into one of your groups, or a new one
    const a = S.me.account, groups = Object.keys((a && a.groups) || {});
    const max = (S.cat && S.cat.costs && S.cat.costs.group_max) || 6;
    const pick = S.form.group && groups.includes(S.form.group) ? S.form.group : (groups.length && S.form.group !== "*new" ? groups[0] : "*new");
    const opts = groups.map((n) => '<option value="' + esc(n) + '"' + (pick === n ? " selected" : "") + ">" + esc(n) + "</option>").join("") +
      (groups.length < max ? '<option value="*new"' + (pick === "*new" ? " selected" : "") + ">a new group…</option>" : "");
    const n = Math.max(1, S.form.count || 1);
    return '<div class="form-row group-add"><span class="segl">Group</span><select class="small" data-bind="groupPick" data-act="group-pick">' + opts + "</select>" +
      '<input type="text" data-bind="groupNewName" placeholder="name for a new group" maxlength="16" style="max-width:150px"' + (pick === "*new" ? "" : " hidden") + ">" +
      '<button class="small" data-act="group-add" data-name="' + esc(m.name) + '">Add ' + (n > 1 ? n + " × " : "") + esc(memberWord(m)) + "</button></div>";
  }
  function groupsPanel() {
    const a = S.me.account, groups = (a && a.groups) || {}, f = S.form;
    const door = f.door || (a && a.home_door) || 1;
    const max = (S.cat && S.cat.costs && S.cat.costs.group_members) || 8;
    const rows = Object.keys(groups).map((n) => '<div class="form-row"><b>' + esc(n) + '</b><span class="inline-note">' + esc(groupWords(groups[n])) + "</span>" +
      '<button class="small gold" data-act="group-send" data-name="' + esc(n) + '">Send · ' + groupCost(groups[n], f.strength, door) + " essence</button>" +
      '<button class="small" data-act="group-delete" data-name="' + esc(n) + '">Forget</button></div>').join("");
    return '<div class="panel"><h3>Groups</h3><p class="sub">Several monsters under one name, sent in together from the door and strength picked above. Up to ' + max + ' a group, a variant by its word (Frost Ogre), one boss to a group.</p><div class="form-row">' + walletChip(null) + '</div>' +
      (rows || '<p class="inline-note">No groups yet.</p>') +
      '<div class="form-row"><input type="text" data-bind="groupName" placeholder="name" maxlength="16" style="max-width:120px"><input type="text" data-bind="groupMembers" placeholder="Ogre x2, Grunt x3, Frost Knight" maxlength="200" style="flex:1;min-width:200px"><button class="small gold" data-act="group-save">Save group</button></div></div>';
  }
  function walletChip(cost) {
    // the essence in hand, right where it is spent; red when the pick costs more than that
    const a = S.me && S.me.account;
    if (!a) return '<span class="chip wallet" title="a new account starts with 25 essence">💧 <b>25</b> essence to start</span>';
    const low = cost != null && a.essence < cost;
    return '<span class="chip wallet' + (low ? " low" : "") + '" title="one back every minute; all of it back at each draft in rounds mode; a little with every kill">💧 <b>' + num(a.essence) + "</b>/" + a.cap + " essence" + (low ? " · not enough" : "") + "</span>";
  }
  function affix(vkey) { const v = ((S.cat && S.cat.variants) || []).find((x) => x.key === vkey); return v ? v.affix : vkey; }
  function costs() { return (S.cat && S.cat.costs) || {}; }
  function tierCosts() { const t = costs().tier_costs; return t && t.tier1 ? [t.tier1, t.tier2, t.tier3, t.tier4] : TIER_COSTS_FALLBACK; }
  function respecCost() { return costs().respec || RESPEC_FALLBACK; }
  function baseBudget() { return costs().budget || BUDGET_FALLBACK; }
  // the damage pool of one of the account's monsters (a type or a variant, by its name): what its copies dealt and did not spend
  function poolOf(p, build) { const d = ((p && p.damage) || {})[build]; return d ? (d.available != null ? d.available : Math.max(0, (d.earned || 0) - (d.spent || 0))) : 0; }
  function poolChip(p, build) {
    const parts = splitBuild(build), forVariants = parts && !parts.vkey;
    return '<span class="chip pool" title="the damage your ' + esc(build) + 's have dealt and not yet spent: it buys their talents' + (forVariants ? " and the variants of the type" : "") + '">💥 <b>' + num(poolOf(p, build)) + "</b> " + esc(build) + " damage</span>";
  }
  function poolChips(p) {
    const pools = Object.entries((p && p.damage) || {}).map(([b, d]) => [b, d && d.available != null ? d.available : Math.max(0, ((d || {}).earned || 0) - ((d || {}).spent || 0))]).sort((x, y) => y[1] - x[1]).slice(0, 3);
    return pools.map(([b, v]) => '<span class="chip" title="damage this monster dealt, unspent: it buys its talents and variants">💥 ' + esc(b) + " <b>" + num(v) + "</b></span>").join("");
  }
  function variantDamage(m) { return m.variant_damage != null ? m.variant_damage : m.variant; }
  function progressionLive() { return !!(S.cat && S.cat.progression); }

  // ------------------------------------------------------------------ mastery and achievements (the ladder and the badges come with the catalogue)
  function masteryOf(p, name) {
    const sb = name && !S.byName[name] ? splitBuild(name) : null;
    return (p && p.mastery && p.mastery[sb ? sb.base : name]) || null;
  }
  function discountFor(p, name) { const m = masteryOf(p, name); return (m && m.discount) || 0; }
  function budgetFor(p, build) {
    const b = p && p.talents && p.talents[build];
    if (b && b.budget) return b.budget;
    const m = masteryOf(p, build);
    return baseBudget() + ((m && m.talent_bonus) || 0);
  }
  function ladder() { const r = S.cat && S.cat.mastery && S.cat.mastery.ranks; return r ? r.map((x) => [x.rank, x.name, x.xp, x.perk || ""]) : LADDER_FALLBACK; }
  function starText(stars) { return stars ? (stars <= 3 ? "\u2605".repeat(stars) : "\u2605" + stars) : ""; }
  function rankPill(m) {
    if (!m || !m.rank) return "";
    return '<span class="mrank r' + Math.min(10, m.rank) + '" title="' + esc((m.name || "") + (m.stars ? " " + starText(m.stars) : "")) + '">' + (m.rank >= 10 ? "M" : m.rank) + "</span>" +
      (m.stars ? '<span class="stars">' + starText(m.stars) + "</span>" : "");
  }
  function badgeChip(b) { return b ? '<span class="chip badge-chip">' + rankPill(b) + " " + esc(b.type + " " + b.name) + "</span>" : ""; }
  function xpBar(m) {
    const span = Math.max(1, (m.next || 0) - (m.floor || 0));
    return '<div class="xpbar"><i style="width:' + Math.max(0, Math.min(100, Math.round(100 * ((m.xp || 0) - (m.floor || 0)) / span))) + '%"></i></div>';
  }
  function perkWords(m) {
    const out = [];
    if (m.discount) out.push("sends " + Math.round(m.discount * 100) + "% cheaper");
    if (m.talent_bonus) out.push("builds hold " + (baseBudget() + m.talent_bonus) + " points");
    if (m.soul_bonus) out.push("+" + m.soul_bonus + " soul a kill");
    if (m.sparkle) out.push(m.sparkle > 1 ? "Mythic sparkles" : "gold sparkles");
    return out;
  }
  function masteryBlock(p, name) {
    const m = masteryOf(p, name), lad = ladder();
    if (!m) return '<div class="mastery-block"><h3>Your mastery</h3><p class="inline-note">No XP with the ' + esc(name) + " yet. The essence you spend sending it in (its variants count) and every kill it makes earn XP; Initiate at " + num(lad[0][2]) + " XP.</p></div>";
    const next = lad.find((r) => r[0] === m.rank + 1), perks = perkWords(m);
    return '<div class="mastery-block"><h3>Your mastery</h3><div class="mhead">' + rankPill(m) + " <b>" + esc(m.name || "no rank yet") + '</b> <span class="inline-note">' + num(m.xp) + " XP · " + num(m.kills) + " kills</span></div>" + xpBar(m) +
      '<p class="inline-note">' + num(Math.max(0, m.next - m.xp)) + " XP to " + esc(m.next_name) + (next && next[3] ? ": " + esc(next[3]) : "") + "</p>" +
      (perks.length ? '<p class="perks">' + perks.map(esc).join(" · ") + "</p>" : "") + "</div>";
  }
  function masteryPanel(p, id, mine) {
    if (!p.progression) return "";
    const rows = Object.entries(p.mastery || {}).sort((a, b) => b[1].xp - a[1].xp);
    const tiles = rows.map(([t, m]) => {
      const mon = S.byName[t], isBadge = !!(p.badge && p.badge.type === t);
      return '<div class="mtile' + (isBadge ? " on" : "") + '">' + (mon ? '<img src="' + esc(mon.img) + '" alt="" loading="lazy">' : '<div class="noimg"></div>') +
        '<div class="mbody"><div class="mt"><b>' + esc(t) + "</b><span>" + rankPill(m) + '</span></div><div class="inline-note">' + esc(m.name || "unranked") + " · " + num(m.xp) + " XP · " + num(m.kills) + " kills</div>" + xpBar(m) +
        '<div class="inline-note">' + num(Math.max(0, m.next - m.xp)) + " to " + esc(m.next_name) + "</div>" +
        (mine && m.rank ? (isBadge ? '<span class="chip">your badge</span>' : '<button class="small" data-act="badge" data-name="' + esc(t) + '">Show as badge</button>') : "") + "</div></div>";
    }).join("");
    return '<div class="panel"><h3>Mastery</h3><p class="sub">' + (mine ? "Your" : "Their") + " rank with each monster, from the essence spent sending it in and the kills it makes; a variant counts for its monster. Ranks bring cheaper sends, more talent points, a soul more a kill and gold sparkles; past Mythic, stars." +
      (mine && p.badge && p.badge.picked ? ' <button class="small" data-act="badge-best">Use my best</button>' : "") + "</p>" +
      (tiles ? '<div class="mastery-grid">' + tiles + "</div>" : '<p class="inline-note">No mastery yet: every monster sent in starts one.</p>') + "</div>";
  }
  function achCard(x, earned, prog, hidden) {
    const on = !!earned[x.id], h = hidden[x.id], pr = prog[x.id];
    const name = on && h ? h.name : x.name, blurb = on && h ? h.blurb : x.blurb;
    const pct = pr ? Math.max(0, Math.min(100, Math.round(100 * pr[0] / Math.max(1, pr[1])))) : 0;
    return '<div class="ach ' + esc(x.tier) + (on ? "" : " locked") + (x.hidden && !on ? " hidden" : "") + '"><div class="medal">' + x.points + '</div><div class="ab"><b>' + esc(name) + "</b><small>" + esc(x.tier) + " · " + esc(blurb) + "</small>" +
      (on ? '<small class="when">earned ' + new Date(earned[x.id] * 1000).toLocaleDateString() + "</small>" : pr ? '<div class="prog"><i style="width:' + pct + '%"></i></div><small>' + num(pr[0]) + " / " + num(pr[1]) + "</small>" : "") + "</div></div>";
  }
  function huntBadges(p, items, earned, prog, hidden) {
    // one cell per monster type (its progress comes from the prey totals, not the progress list), then the tallies as ordinary cards
    const prey = p.prey || {};
    const cells = items.filter((x) => x.type).map((x) => {
      const have = Number(prey[x.type] || 0), on = !!earned[x.id];
      return { x: x, have: have, on: on, pct: on ? 100 : Math.max(0, Math.min(100, Math.round(100 * have / Math.max(1, x.need)))), mon: S.byName[x.type] };
    }).sort((a, b) => (b.on - a.on) || (b.pct - a.pct) || a.x.type.localeCompare(b.x.type));
    const got = cells.filter((c) => c.on).length, hunted = Object.values(prey).filter((n) => n > 0).length, needs = cells.map((c) => c.x.need);
    const grid = cells.map((c) => '<div class="hcell' + (c.on ? " on" : c.have ? "" : " none") + '" title="' + esc(c.x.name + ": " + c.x.blurb) + '">' + (c.mon ? '<img src="' + esc(c.mon.img) + '" alt="" loading="lazy">' : '<div class="noimg"></div>') +
      "<b>" + esc(c.x.type) + "</b><small>" + (c.on ? "earned" : num(c.have) + " / " + num(c.x.need)) + '</small><div class="prog"><i style="width:' + c.pct + '%"></i></div></div>').join("");
    return '<div class="badge-group hunts"><h4>Hunts <small>' + got + " of " + cells.length + " badges · " + hunted + ' types hunted</small></h4>' +
      '<p class="inline-note">A Hunter badge for every monster type your monsters kill enough of, from ' + num(Math.max.apply(null, needs)) + " of the weakest types down to " + num(Math.min.apply(null, needs)) + " of a boss (a variant killed counts for its type). The tallies below reward the breadth of the hunt.</p>" +
      '<div class="hunt-grid">' + grid + '</div><div class="badge-case">' + items.filter((x) => !x.type).map((x) => achCard(x, earned, prog, hidden)).join("") + "</div></div>";
  }
  function badgePanel(p) {
    const cat = (S.cat && S.cat.achievements) || [], a = p.achievements;
    if (!cat.length || !a) return "";
    const earned = a.earned || {}, prog = a.progress || {}, hidden = a.hidden || {};
    const groups = (S.cat && S.cat.achievement_groups) || GROUPS_FALLBACK;
    const html = groups.map((g) => {
      const items = cat.filter((x) => x.group === g.key);
      if (g.key === "hunts") return huntBadges(p, items, earned, prog, hidden);
      return '<div class="badge-group"><h4>' + esc(g.label) + " <small>" + items.filter((x) => earned[x.id]).length + " of " + items.length + '</small></h4><div class="badge-case">' + items.map((x) => achCard(x, earned, prog, hidden)).join("") + "</div></div>";
    }).join("");
    return '<div class="panel"><h3>Achievements <small class="inline-note">' + num(a.points) + " points · " + num(a.count) + " of " + cat.length + " badges</small></h3>" + html + "</div>";
  }
  function huntsPanel(p, id, mine) {
    // the prey log: one row per build that has killed, the busiest first, its victims by type
    if (!p.progression) return "";
    const rows = Object.entries(p.hunts || {}).map(([b, v]) => [b, v || {}, Object.values(v || {}).reduce((s, n) => s + (Number(n) || 0), 0)]).filter((r) => r[2] > 0).sort((a, b) => b[2] - a[2]);
    const body = rows.map(([b, v, total]) => {
      const sb = splitBuild(b), mon = sb && S.byName[sb.base];
      const victims = Object.entries(v).filter(([t]) => t !== "other").sort((x, y) => y[1] - x[1]);
      const chips = victims.slice(0, 6).map(([t, n]) => '<span class="chip">' + esc(t) + " ×" + num(n) + "</span>").join("");
      const all = victims.map(([t, n]) => esc(t) + " ×" + num(n)).join(" · ") + (v.other ? " · +" + num(v.other) + " of other types" : "");
      return '<div class="hrow">' + (mon ? '<img src="' + esc(mon.img) + '" alt="" loading="lazy">' : '<div class="noimg"></div>') + '<div class="hbody"><div class="mt"><b>' + esc(b) + "</b><span>" + num(total) + " kills · " + victims.length + (v.other ? "+" : "") + ' types</span></div><div class="chips">' + chips + "</div>" +
        (victims.length > 6 || v.other ? '<details><summary>all of them</summary><div class="inline-note">' + all + "</div></details>" : "") + "</div></div>";
    }).join("");
    return '<div class="panel"><h3>Prey</h3><p class="sub">' + (mine ? "What your monsters have killed" : "What their monsters have killed") + ", by the monster that made the kill (a variant keeps its own log) and the type it killed; a Frost Ogre killed counts as an Ogre. Every type has a hunt badge in the badge case below." +
      (p.hunts_more ? " " + p.hunts_more + " more builds with fewer kills are not shown." : "") + "</p>" + (body || '<p class="inline-note">Nothing yet: the log starts with the first kill.</p>') + "</div>";
  }
  function huntLine(a, name) {
    const have = Number((a.prey || {})[name] || 0), row = ((S.cat && S.cat.achievements) || []).find((x) => x.type === name);
    const on = !!(row && a.achievements && a.achievements.earned && a.achievements.earned[row.id]);
    return '<p class="inline-note hunt-line">Hunted: your monsters have killed ' + num(have) + " of these" + (row ? (on ? " · " + esc(row.name) + " earned" : " · " + esc(row.name) + " at " + num(row.need)) : "") + "</p>";
  }

  // ------------------------------------------------------------------ routing and rendering
  function route() {
    const parts = location.hash.replace(/^#/, "").split("/").map(decodeURIComponent);
    S.view = parts[0] || "watch"; S.args = parts.slice(1);
    if (!["watch", "bestiary", "profile", "top", "admin"].includes(S.view)) S.view = "watch";
  }
  function notice(text, ok, discord) {
    const n = $("#arena-notice");
    if (!text) { n.hidden = true; return; }
    n.hidden = false; n.className = "arena-notice" + (ok ? " ok" : "");
    n.innerHTML = esc(text) + (discord ? ' <a href="' + esc(DISCORD) + '" target="_blank" rel="noopener">Join the Discord</a>' : "");
  }
  function renderUser() {
    const u = $("#arena-user");
    if (S.me) {
      const a = S.me.account, lvl = a ? a.level : 1;
      u.innerHTML = '<div class="who"><b>' + esc(S.me.user.name) + (a && a.badge ? " " + rankPill(a.badge) : "") + '</b><small>level ' + lvl + (a ? " · " + num(a.essence) + "/" + a.cap + " essence · " + num(a.souls) + " souls" : " · new here") + "</small></div>" +
        '<button class="small" data-act="logout">Sign out</button>';
    } else if (S.viewer) {
      u.innerHTML = '<div class="who"><b>' + esc(S.viewer.name || "signed in") + '</b><small>' + (myId() ? "checking with the arena…" : "signed in with Google; the arena needs Discord") + "</small></div>" +
        '<button class="small" data-act="logout">Sign out</button>';
    } else {
      u.innerHTML = '<button class="discord" data-act="login">Sign in with Discord</button>';
    }
  }
  function render() {
    document.querySelectorAll("#arena-tabs a").forEach((a) => a.classList.toggle("on", a.dataset.tab === S.view));
    const admTab = document.querySelector('#arena-tabs a[data-tab="admin"]');
    if (admTab) admTab.hidden = !(S.me && S.me.admin);       // the link is a convenience: the arena itself checks who may use what it leads to
    renderUser();
    // the player is static markup in a grid cell beside #app; the body's classes pick the
    // layout (side by side, or a bigger stream with the commands under it) and shrink the
    // player on the other tabs. Nothing here ever redraws it.
    document.body.className = "view-" + S.view + " layout-" + S.layout;
    const toggle = $("#layout-toggle");
    if (toggle) { toggle.textContent = S.layout === "side" ? "Bigger stream" : "Commands beside the stream"; toggle.hidden = S.view !== "watch"; }
    const app = $("#app");
    const st = S.live, mons = (st && st.monsters) || [];
    if (S.view === "watch") {
      $("#watch-status").innerHTML = statusLine(st) + ctfBanner(st) + specialBanner(st);
      $("#watch-feed").innerHTML = feedList(st);
      app.innerHTML = panel(mons);
    } else if (S.view === "bestiary") {
      app.innerHTML = viewBestiary();
      const m = S.args[0] && S.order.find((x) => x.key === S.args[0]);
      if (m) ensureTree(S.args[1] || m.name);
    }
    else if (S.view === "profile") app.innerHTML = viewProfile();
    else if (S.view === "admin") app.innerHTML = viewAdmin();
    else app.innerHTML = viewTop();
    updateMinimap(S.view === "watch" ? st : null);
    watchState((S.view === "watch" || S.view === "admin") && !document.hidden);
    chatWant(S.view === "watch" && !document.hidden);
    if (S.view === "profile") ensureProfile();
    if (S.view === "top") ensureBoard();
  }

  // ------------------------------------------------------------------ watch & play
  function statusLine(st) {
    const on = !!(st && st.online), mons = (st && st.monsters) || [], rounds = st && st.rounds;
    return '<div class="status"><span><i class="dot' + (on ? " on" : "") + '"></i>' + (on ? "live" : "the arena is offline right now") + "</span>" +
      (on ? "<span>" + esc(st.mode === "ctf" ? "capture the flag" : (st.mode || "") + " mode") + "</span><span>round " + esc(st.round || "") + (rounds && rounds.phase ? " · " + esc(rounds.phase) + (rounds.seconds != null ? " " + Math.floor(rounds.seconds / 60) + ":" + String(rounds.seconds % 60).padStart(2, "0") : "") : "") + "</span><span>" + mons.length + " alive</span>" : "") + "</div>";
  }
  // ---- Capture the Flag: the match over the stream's status line, and a live map of the forts under it
  const CTF_MAP = { xMin: -2752, yMax: 1792, w: 5504, h: 3584, basement: -100, deck: 200, red: [-2560, 0], blue: [2560, 0] };      // tools/arena/ctf2fort.json
  function ctfLive() { const st = S.live; return !!(st && st.online && st.ctf); }
  function flagWord(w) { w = String(w || "home"); return w.startsWith("carry") ? "taken" : w.startsWith("drop") ? "on the floor" : "home"; }
  function mySide() {
    const c = S.live && S.live.ctf, me = S.me && S.me.account;
    if (!c || !me) return "";
    const sup = c.supporters || {};
    if ((sup.red || []).includes(me.name)) return "Red";
    if ((sup.blue || []).includes(me.name)) return "Blue";
    return me.home_door ? (me.home_door <= 4 ? "Red (your door " + me.home_door + ")" : "Blue (your door " + me.home_door + ")") : "";
  }
  function ctfBanner(st) {
    const c = st && st.online && st.ctf;
    if (!c) return st && st.online && st.mode === "ctf" ? '<div class="special ctf"><b>Capture the Flag</b><span>The game is moving to the forts; the first match opens in a moment.</span></div>' : "";
    const sc = c.score || [0, 0], fl = c.flags || {}, left = Math.floor((c.seconds || 0) / 60) + ":" + String((c.seconds || 0) % 60).padStart(2, "0");
    const phase = { warmup: "warm-up", play: "play", results: "results" }[c.phase] || c.phase, side = mySide();
    const hint = c.phase === "warmup" ? "Doors 1-4 fight for Red, 5-8 for Blue. Send your monsters in with an order; your first one picks your side for the match."
      : c.phase === "play" ? "A capture pays 100 souls to the owner of the monster that carries the flag home, and 25 to everyone else on its side."
        : (c.result && c.result.caption ? c.result.caption.toLowerCase() : "the next match opens in a moment") + ".";
    return '<div class="special ctf"><b>Capture the Flag · match ' + c.number + " · " + esc(phase) + " " + left + '</b>' +
      '<div class="ctf-score"><span class="red">Red <i>' + sc[0] + '</i><small>flag ' + flagWord(fl.red) + '</small></span><span class="to">first to ' + (c.to_win || 3) + '</span>' +
      '<span class="blue"><i>' + sc[1] + "</i> Blue<small>flag " + flagWord(fl.blue) + "</small></span></div><span>" + esc(hint) + (side ? " You: <b class=\"side\">" + esc(side) + "</b>." : "") +
      (c.bets ? " Pot " + c.pot + " in " + c.bets + (c.bets === 1 ? " bet" : " bets") + (c.bets_open ? "" : " (closed)") + "." : "") + "</span></div>";
  }
  function mapPos(x, y) { return [Math.max(0, Math.min(100, (x - CTF_MAP.xMin) / CTF_MAP.w * 100)), Math.max(0, Math.min(100, (CTF_MAP.yMax - y) / CTF_MAP.h * 100))]; }
  function updateMinimap(st) {
    // the dots are kept from one update to the next and only moved, so they glide (a CSS transition) instead of jumping
    const host = $("#ctf-map");
    if (!host) return;
    const c = st && st.online && st.ctf;
    if (!c) { host.hidden = true; return; }
    host.hidden = false;
    if (!host.firstChild) {
      host.innerHTML = '<div class="ctf-map-head"><h3>The forts, live</h3><span class="legend"><i class="mdot red"></i>Red <i class="mdot blue"></i>Blue <i class="mdot red low"></i>in the basement <i class="mdot blue carry"></i>has the flag</span></div>' +
        '<div class="ctf-map-box"><img src="arena/ctf2fort.png?v=20260921a" alt="A plan of the two forts: Red on the left, Blue on the right, the bridge and the moat between them"><div class="layer"></div></div>';
    }
    const layer = host.querySelector(".layer"), seen = {};
    const mons = (st.monsters || []).filter((m) => m.xy);
    const place = (id, cls, x, y, title) => {
      let el = layer.querySelector('[data-k="' + id + '"]');
      if (!el) { el = document.createElement("i"); el.dataset.k = id; layer.appendChild(el); }
      const p = mapPos(x, y);
      el.className = cls; el.style.left = p[0] + "%"; el.style.top = p[1] + "%"; el.title = title;
      seen[id] = 1;
    };
    const carriers = {};
    ["red", "blue"].forEach((t) => { const w = String((c.flags || {})[t] || ""); if (w.startsWith("carry:")) carriers[w.slice(6)] = t; });
    mons.forEach((m) => {
      const z = m.z || 0, team = m.door <= 4 ? "red" : "blue", mine = S.me && S.me.account && m.owner === S.me.account.name;
      place("m" + m.id, "mdot " + team + (z < CTF_MAP.basement ? " low" : z > CTF_MAP.deck ? " high" : "") + (carriers[m.id] ? " carry" : "") + (mine ? " mine" : ""), m.xy[0], m.xy[1],
        m.name + " #" + m.id + (m.owner ? " (" + m.owner + ")" : "") + " · " + (m.job || "") + (z < CTF_MAP.basement ? " · in the basement" : z > CTF_MAP.deck ? " · on the battlements" : ""));
    });
    ["red", "blue"].forEach((t) => {
      const w = String((c.flags || {})[t] || "home");
      let xy = CTF_MAP[t];
      if (w.startsWith("drop:")) xy = w.slice(5).split(",").map(Number);
      else if (w.startsWith("carry:")) { const m = mons.find((x) => String(x.id) === w.slice(6)); if (m) xy = m.xy; }
      place("f" + t, "mflag " + t + (w.startsWith("carry") ? " out" : w.startsWith("drop") ? " down" : ""), xy[0], xy[1], (t === "red" ? "Red" : "Blue") + "'s flag: " + flagWord(w));
    });
    layer.querySelectorAll("[data-k]").forEach((el) => { if (!seen[el.dataset.k]) el.remove(); });
  }
  function specialBanner(st) {
    const r = st && st.online && st.rounds;
    if (!r) return "";
    let h = "";
    if (r.special) {
      const s = r.special, score = s.score ? " · " + esc(s.a) + " " + s.score[0] + " : " + s.score[1] + " " + esc(s.b) : "";
      h += '<div class="special"><b>Special round · ' + esc(s.title) + "</b><span>" + esc(s.blurb) + score + "</span></div>";
    }
    if (r.vote && r.vote.options) {
      h += '<div class="special vote"><b>Vote the next round</b><span>' + (r.vote.seconds ? r.vote.seconds + " s left · " : "") + (S.me ? "pick one" : "sign in to vote, or type !vote 1, 2 or 3 in chat") + '</span><div class="vote-row">' +
        r.vote.options.map((o) => '<button data-act="vote" data-n="' + o.n + '" title="' + esc(o.blurb) + '"' + (S.me ? "" : " disabled") + ">" + o.n + " · " + esc(o.title) + " <i>" + o.votes + "</i></button>").join("") + "</div></div>";
    }
    return h;
  }
  function feedList(st) {
    return '<ul class="feed">' + ((st && st.feed) || []).slice().reverse().map((e) => '<li class="' + esc(e.kind) + '"><b>' + esc(e.kind) + "</b> " + esc(e.text) + "</li>").join("") + "</ul>";
  }
  function panel(mons) {
    if (!S.me) {
      return '<div class="panel sign-card"><h2>Play from here</h2><p>Sign in with Discord and your arena account comes with you: essence to send monsters in, souls to unlock the bestiary, the damage your monsters deal to build their talents and variants, and every kill counts. You need to be a member of the DFWGV Arena Discord.</p>' +
        '<button class="discord" data-act="login">Sign in with Discord</button><p class="inline-note">Not on the Discord yet? <a href="' + esc(DISCORD) + '" target="_blank" rel="noopener">Join the DFWGV Arena Discord</a>.</p></div>';
    }
    const a = S.me.account;
    const wallet = a ? '<div class="chips"><span class="chip">level <b>' + a.level + "</b></span><span class=\"chip\">essence <b>" + num(a.essence) + "</b>/" + a.cap + '</span><span class="chip">souls <b>' + num(a.souls) + "</b></span>" + (a.home_door ? '<span class="chip">door <b>' + a.home_door + "</b></span>" : "") + badgeChip(a.badge) + "</div>" :
      '<p class="inline-note">Your account starts the moment you send something in: 25 essence, the four starter monsters.</p>';
    return '<div class="panel"><h3>Your arena</h3>' + wallet + "</div>" + releaseForm() + groupsPanel() + ordersPanel(mons) + hazardsPanel(mons) + roundsPanel() + consolePanel();
  }
  function tileHtml(x, picked) {
    const ok = ownsType(x.name);
    return '<div class="tile' + (ok ? "" : " locked") + (x.name === picked ? " on" : "") + '" data-act="pick" data-name="' + esc(x.name) + '" title="' + esc(x.name + (ok ? "" : " · locked, " + x.unlock + " souls")) + '"><img src="' + esc(x.img) + '" alt="" loading="lazy">' + (ok ? "" : '<span class="lock">' + x.unlock + "</span>") + '<span class="n">' + esc(x.name) + "</span></div>";
  }
  function releaseForm() {
    // a toolbar (search, shelf, only unlocked), the shelf of tiles, and beside it the summon card: the
    // chosen monster, its options as pill rows, the cost, the Send in button with the essence in hand
    const f = S.form, a = S.me.account;
    const owned = S.order.filter((x) => ownsType(x.name));
    const m = S.byName[f.name] || null;
    const only = !!f.onlyOwned, q = (f.q || "").trim().toLowerCase();
    const shelves = (S.cat && S.cat.shelves) || [];
    const shelf = shelves.find((s) => s.label === f.shelf) || null;
    const list = S.order.filter((x) => (!only || ownsType(x.name)) && (!shelf || (shelf.sources || []).includes(x.source)) && (!q || x.name.toLowerCase().includes(q)));
    const toolbar = '<div class="send-tools"><input type="search" placeholder="Find a monster" value="' + esc(f.q || "") + '" data-bind="sendq" aria-label="Find a monster">' +
      '<select data-bind="sendShelf" aria-label="Shelf"><option value="">Every shelf</option>' + shelves.map((s) => '<option value="' + esc(s.label) + '"' + (f.shelf === s.label ? " selected" : "") + ">" + esc(s.label) + "</option>").join("") + "</select>" +
      '<label class="check"><input type="checkbox" data-act="only-owned"' + (only ? " checked" : "") + "> only unlocked</label></div>";
    const tiles = list.length ? list.map((x) => tileHtml(x, f.name)).join("") : '<p class="inline-note empty">Nothing matches. Clear the search or pick another shelf.</p>';
    const variants = m ? ((a && a.variants && a.variants[m.name]) || []) : [];
    const cost = m ? releaseCost(m, f.strength, f.count, f.variant, f.door || 1) : 0;
    const mm = m && a ? masteryOf(a, m.name) : null;
    const talents = m && a && a.talents && a.talents[f.variant ? affix(f.variant) + " " + m.name : m.name];
    const home = (a && a.home_door) || 0;
    const seg = (label, field, options, current, hint) => '<div class="opt"><span class="segl">' + label + (hint ? "<small>" + hint + "</small>" : "") + '</span><div class="seg" role="group">' +
      options.map((o) => '<button type="button" class="segb' + (String(o.v) === String(current) ? " on" : "") + '" data-act="set" data-field="' + field + '" data-value="' + esc(o.v) + '">' + esc(o.t) + "</button>").join("") + "</div></div>";
    const step = Math.round(((S.cat && S.cat.costs && S.cat.costs.multi_step) || 0.1) * 100), bossWait = (S.cat && S.cat.costs && S.cat.costs.boss_cooldown) || 30;
    let card, opts = "", foot = "";
    if (!m) {
      card = '<div class="summon-card empty"><div class="portrait ghost"></div><div class="who"><h4>Pick a monster</h4><p class="notes">Choose one from the shelf. ' + owned.length + " of " + S.order.length +
        ' types are unlocked; <a href="#bestiary">the bestiary</a> sells the rest for souls.</p></div></div>';
    } else {
      const ok = ownsType(m.name);
      card = '<div class="summon-card"><img class="portrait" src="' + esc(m.img) + '" alt=""><div class="who"><h4>' + esc(m.name) + "</h4>" +
        '<div class="meta">' + pips(m.threat) + "<span>threat " + m.threat + "</span><span>" + (ATTACK_WORD[m.attack] || "") + (m.fly ? ", flies" : "") + "</span><span>" + esc(m.source_label || m.source || "") + "</span></div>" +
        '<p class="notes">' + esc(m.notes) + "</p>" + (ok ? "" : '<p class="locked-note">Locked: ' + m.unlock + ' souls in <a href="#bestiary/' + esc(m.key) + '">the bestiary</a>.</p>') +
        (a && a.progression ? '<p class="mastery-line">' + (mm && mm.rank ? rankPill(mm) + " " + esc(m.name + " " + mm.name) + " · " : "") + num(mm ? mm.xp : 0) + " XP" +
          (mm && mm.discount ? " · " + Math.round(mm.discount * 100) + "% off every send" : "") + "</p>" : "") + "</div></div>";
      const ctf = ctfLive();
      opts = seg("How many", "count", [1, 2, 3, 4, 5].map((n) => ({ v: n, t: String(n) })), f.count, "copies cost " + step + "% more each") +
        (ctf ? seg("Door", "door", [{ v: 0, t: home ? "yours · " + home : "your side's" }].concat([1, 2, 3, 4, 5, 6, 7, 8].map((d) => ({ v: d, t: String(d) }))), f.door === 9 ? 0 : f.door, "1-4 Red · 5-8 Blue") +
          seg("Order", "role", [{ v: "", t: "auto" }, { v: "attack", t: "attack" }, { v: "defend", t: "defend" }, { v: "escort", t: "escort" }, { v: "mid", t: "hold the middle" }], f.role, "auto leaves it to the team's commander")
          : seg("Door", "door", [{ v: 0, t: home ? "yours · " + home : "emptiest" }].concat([1, 2, 3, 4, 5, 6, 7, 8].map((d) => ({ v: d, t: String(d) })), [{ v: 9, t: "all · lv 6" }]), f.door)) +
        seg("Strength", "strength", STRENGTHS.map((s) => ({ v: s, t: s + "%" })), f.strength, "150% and up is a champion") +
        (variants.length ? seg("Variant", "variant", [{ v: "", t: "plain" }].concat(variants.map((v) => ({ v: v, t: affix(v) }))), f.variant) : "") +
        (talents ? seg("Build", "vanilla", [{ v: "0", t: "your " + talents.points + "-point build" }, { v: "1", t: "vanilla" }], f.vanilla ? "1" : "0") : "");
      const lately = recentCount((f.variant ? affix(f.variant) + " " : "") + m.name);
      const summary = (f.count > 1 ? f.count + " × " : "") + (f.variant ? affix(f.variant) + " " : "") + m.name + " at " + f.strength + "%" +
        (f.door === 9 ? " from every door" : f.door ? " from door " + f.door : home ? " from door " + home : " from the emptiest door") +
        (lately ? " · " + lately + " sent lately, so each copy costs " + (step * lately) + "% more" : "");
      const allN = ok && a ? affordableCount(m, f.strength, f.variant, f.door) : 0;
      const allBtn = ok && a ? '<button class="big" data-act="release-all"' + (allN ? "" : " disabled") + ' title="as many as your essence buys at once, the copy tax counted; ' + ((costs().release_all_max || 20)) + ' at most">Send all I can' +
        (allN ? " · " + allN + " for " + releaseCost(m, f.strength, allN, f.variant, f.door) : "") + "</button>" : "";
      foot = '<div class="summon-foot"><div class="cost"><span class="k">Cost</span><b>' + cost + '</b><span class="unit">essence</span><small>' + esc(summary) + "</small></div>" +
        '<div class="actions"><button class="gold big" data-act="release"' + (ok ? "" : " disabled") + ">Send in</button>" + allBtn + walletChip(cost) + "</div>" +
        '<p class="fine">The crowd sends one boss every ' + bossWait + " s; copies of a kind cost " + step + "% more each for a minute and a half.</p>" +
        (ok ? groupAddRow(m) : "") + "</div>";
    }
    return '<div class="panel send"><div class="send-head"><h3>Send in a monster</h3><span class="count">' + owned.length + " of " + S.order.length + " unlocked</span></div>" + toolbar +
      '<div class="send-body"><div class="picker-col"><div class="picker">' + tiles + '</div></div><div class="summon">' + card + opts + foot + "</div></div></div>";
  }
  function ordersPanel(mons) {
    if (!mons.length) return '<div class="panel"><h3>Orders</h3><p class="inline-note">Nothing is alive on the floor right now.</p></div>';
    const costs = (S.cat && S.cat.costs && S.cat.costs.order) || {};
    const list = mons.map((x) => {
      const acts = ORDERS.map(([k, label]) => '<button class="small" data-act="order" data-order="' + k + '" data-id="' + x.id + '" title="' + (costs[k] || 0) + ' essence">' + label + "</button>").join("") +
        '<select class="small" data-act="weapon" data-id="' + x.id + '" title="' + (costs.weapon || 3) + ' essence, level 3"><option value="">weapon…</option>' + WEAPONS.map((w) => '<option value="' + w + '">' + w + "</option>").join("") + "</select>";
      return '<div class="mon"><b>' + esc(x.name) + "</b> #" + x.id + ' <span class="inline-note">door ' + x.door + (x.fx ? " · " + esc(x.fx) : "") + '</span><div class="hp"><i style="width:' + Math.max(0, Math.min(100, x.hp || 0)) + '%"></i></div><div class="acts">' + acts + "</div></div>";
    }).join("");
    return '<div class="panel"><h3>Orders</h3><p class="sub">Orders cost essence (' + Object.entries(costs).map(([k, v]) => k + " " + v).join(", ") + '). Hunt asks for a target next.</p>' + (S.me ? '<div class="form-row">' + walletChip(null) + '</div>' : '') +
      (S.target ? '<p class="inline-note">Hunt with #' + S.target + ": click the target below, or <button class=\"small\" data-act=\"untarget\">cancel</button></p>" : "") + '<div class="mon-list">' + list + "</div></div>";
  }
  function hazardsPanel(mons) {
    const hz = (S.cat && S.cat.costs && S.cat.costs.hazard) || { explosion: 3, lightning: 3, meteors: 4, seal: 2 };
    const targets = '<option value="0">the middle</option>' + [1, 2, 3, 4, 5, 6, 7, 8].map((d) => '<option value="' + d + '">door ' + d + "</option>").join("") + mons.map((x) => '<option value="' + x.id + '">' + esc(x.name) + " #" + x.id + "</option>").join("");
    return '<div class="panel"><h3>Hazards</h3><p class="sub">Level 2 unlocks them (meteors at level 3).</p><div class="form-row"><label>What<select data-bind="hazard"><option value="explosion">explosion · ' + hz.explosion + '</option><option value="lightning">lightning · ' + hz.lightning + '</option><option value="meteors">meteors · ' + hz.meteors + '</option></select></label><label>Where<select data-bind="hazardAt">' + targets + '</select></label><button data-act="hazard">Drop it</button></div>' +
      '<div class="form-row"><label>Seal a door<select data-bind="sealDoor">' + [1, 2, 3, 4, 5, 6, 7, 8].map((d) => '<option value="' + d + '">door ' + d + "</option>").join("") + '</select></label><button data-act="seal">Seal · ' + hz.seal + "</button></div></div>";
  }
  function roundsPanel() {
    const st = S.live, r = st && st.rounds;
    const bets = (S.cat && S.cat.costs && S.cat.costs.bet) || [2, 5, 10, 20];
    if (ctfLive()) {
      const c = st.ctf;
      return '<div class="panel"><h3>The match</h3><p class="sub">Match ' + c.number + " is in the " + esc(c.phase === "warmup" ? "warm-up" : c.phase) + ". Your home door picks your side (1-4 Red, 5-8 Blue); bet on the team you think wins." +
        (c.bets_open ? "" : " The bets are closed for this match.") + "</p>" +
        '<div class="form-row"><label>Door<select data-bind="joinDoor">' + [1, 2, 3, 4, 5, 6, 7, 8].map((d) => '<option value="' + d + '">door ' + d + (d <= 4 ? " · Red" : " · Blue") + "</option>").join("") + '</select></label><button data-act="join">Join this door</button></div>' +
        '<div class="form-row"><label>Bet on<select data-bind="betTeam"><option value="red">Red</option><option value="blue">Blue</option></select></label><label>Essence<select data-bind="betAmt">' + bets.map((b) => '<option value="' + b + '">' + b + "</option>").join("") +
        '</select></label><button data-act="bet-team"' + (c.bets_open ? "" : " disabled") + ">Place the bet</button></div>" +
        '<div class="form-row"><span class="segl">Order all my monsters<small>1 essence</small></span>' + [["attack", "Attack"], ["defend", "Defend"], ["escort", "Escort"], ["mid", "Hold the middle"], ["auto", "Auto"]].map(([k, l]) =>
          '<button class="small" data-act="ctf-order" data-role="' + k + '">' + l + "</button>").join("") + "</div></div>";
    }
    return '<div class="panel"><h3>Rounds</h3><p class="sub">' + (r && r.phase ? "Round " + esc(st.round) + " is in the " + esc(r.phase) + ". " : "") + "Join a door and its kills are yours; bet on the door you think takes the round.</p>" +
      '<div class="form-row"><label>Door<select data-bind="joinDoor">' + [1, 2, 3, 4, 5, 6, 7, 8].map((d) => '<option value="' + d + '">door ' + d + "</option>").join("") + '</select></label><button data-act="join">Join this door</button></div>' +
      '<div class="form-row"><label>Bet on<select data-bind="betDoor">' + [1, 2, 3, 4, 5, 6, 7, 8].map((d) => '<option value="' + d + '">door ' + d + "</option>").join("") + '</select></label><label>Essence<select data-bind="betAmt">' + bets.map((b) => '<option value="' + b + '">' + b + "</option>").join("") + '</select></label><button data-act="bet">Place the bet</button></div></div>';
  }
  function consolePanel() {
    const log = S.log.slice(-12).reverse().map((l) => '<li><span class="cmd">' + esc(l.text) + "</span>" + (l.reply ? '<span class="rep">' + esc(l.reply) + "</span>" : "") + (l.ack && !l.reply ? '<span class="rep">✓ ' + esc(l.ack) + "</span>" : "") + (l.note ? '<span class="rep warn">' + esc(l.note) + "</span>" : "") + "</li>").join("");
    return '<div class="panel"><h3>Console</h3><p class="sub">Any chat command works here: <code>!help</code> lists them. Plain text goes to the director.</p><form class="console" data-act="console"><input type="text" name="cmd" placeholder="!release Ogre 3 150" maxlength="200" autocomplete="off"><button class="gold" type="submit">Send</button></form><ul class="log">' + log + "</ul></div>";
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
      const btn = !signed ? "" : have ? '<a href="#bestiary/' + esc(m.key) + "/" + esc(v.affix + " " + m.name) + '"><button class="small">Build</button></a>' :
        '<button class="small" data-act="unlock" data-name="' + esc(m.name) + '" data-variant="' + esc(v.key) + '"' + (owned ? "" : ' disabled title="unlock the ' + esc(m.name) + ' first"') + ">Unlock · " + num(variantDamage(m)) + " damage</button>";
      return '<div class="variant' + (have ? " owned" : "") + '"><span class="vn">' + esc(v.affix + " " + m.name) + '</span><span class="vb">' + esc(v.blurb) + "</span>" + (have ? '<span class="inline-note">owned · </span>' : "") + btn + "</div>";
    }).join("");
    const unlockBtn = !signed ? '<button class="discord" data-act="login">Sign in to unlock</button>' : m.starter ? '<span class="chip">starter, always yours</span>' : owned ? '<span class="chip">unlocked for good</span>' :
      '<button class="gold" data-act="unlock" data-name="' + esc(m.name) + '">Unlock for ' + m.unlock + " souls</button>" + (a ? '<span class="inline-note"> you have ' + num(a.souls) + "</span>" : "");
    return '<div class="panel detail' + (signed && !owned ? " locked" : "") + '"><div><img src="' + esc(m.img) + '" alt="' + esc(m.name) + '"></div><div><h2>' + esc(m.name) + ' <small class="inline-note">' + esc(m.source_label || m.source) + "</small></h2><p>" + esc(m.notes) + "</p>" +
      '<div class="stats"><div class="stat"><div class="k">Threat</div><div class="v">' + m.threat + '</div></div><div class="stat"><div class="k">Fights</div><div class="v">' + ATTACK_WORD[m.attack] + (m.fly ? ", flies" : "") + '</div></div><div class="stat"><div class="k">Health</div><div class="v">' + (m.health || "?") + '</div></div><div class="stat"><div class="k">Hardest hit</div><div class="v">' + m.hit + '</div></div><div class="stat"><div class="k">Unlock</div><div class="v gold">' + (m.starter ? "free" : m.unlock + " souls") + '</div></div><div class="stat"><div class="k">Each variant</div><div class="v gold">' + num(variantDamage(m)) + " damage</div></div></div>" +
      (a && a.progression ? masteryBlock(a, m.name) + huntLine(a, m.name) : "") +
      '<div class="form-row">' + unlockBtn + ' <a href="#bestiary"><button class="small">Close</button></a></div>' +
      "<h3>Variants</h3><p class=\"sub\">Eight variants of every type, each with a talent tree and a damage pool of its own. The base monster comes first; a variant is bought with the damage your " + esc(m.name) + "s have dealt" + (a ? " (" + num(poolOf(a, m.name)) + " unspent so far)" : "") + ".</p><div class=\"variants\">" + variants + "</div></div></div>" +
      buildPanel((S.me && S.me.account) || { id: "", unlocked: [], variants: {}, talents: {}, souls: null }, S.args[1] || m.name, !!(S.me && S.me.account),
                 { preview: true, link: (name) => "#bestiary/" + esc(m.key) + "/" + esc(name) });
  }

  // ------------------------------------------------------------------ profile
  async function ensureProfile() {
    const id = S.args[0] || myId();
    if (!id) return;
    if (S.profileId !== id || !S.unsub.profile) watchProfile(id);
    ensureTree(S.args[1]);
  }
  async function ensureTree(build) {
    if (!build || S.treeName === build) return;
    S.treeName = build; S.tree = null;
    const t = await readDoc(doc(db, P + "_trees", build));
    if (S.treeName === build) { S.tree = t || { error: "no such build" }; render(); }
  }
  function viewProfile() {
    const id = S.args[0] || myId();
    if (!id) return '<div class="panel sign-card"><h2>Your profile</h2><p>Sign in with Discord to see your stats, the monsters you have unlocked and their talent trees.</p><button class="discord" data-act="login">Sign in with Discord</button></div>';
    const p = S.profile, mine = myId() === id;
    if (!p) return '<p class="arena-muted">Loading the profile…</p>';
    if (p.missing) return '<div class="panel"><h2>' + (mine ? "You have no arena account yet" : "No such account") + "</h2><p>" + (mine ? "It starts the moment you send a monster in or press anything on the Watch page." : esc(p.error || "Nobody has played under that id.")) + "</p></div>";
    const pct = Math.min(100, Math.round(100 * (p.glory - glory(p.level)) / Math.max(1, p.next_level_glory - glory(p.level))));
    const head = '<div class="panel profile-head"><div class="ph"><h2>' + (p.title ? '<span class="title">' + esc(p.title) + "</span>" : "") + esc(p.name) + '</h2><div class="inline-note">level ' + p.level + " · " + num(p.glory) + " glory · " + (p.next_level_glory - p.glory) + " to level " + (p.level + 1) + '</div><div class="level"><i style="width:' + pct + '%"></i></div>' +
      '<div class="chips" style="margin-top:8px"><span class="chip">essence <b>' + num(p.essence) + "</b>/" + p.cap + '</span><span class="chip">souls <b>' + num(p.souls) + "</b></span>" + (p.home_door ? '<span class="chip">door <b>' + p.home_door + "</b></span>" : "") + (p.streak ? '<span class="chip">streak <b>' + p.streak + "</b></span>" : "") + badgeChip(p.badge) + poolChips(p) + "</div></div>" +
      (mine ? '<div class="inline-note">Share this page: <code>' + esc(location.origin + location.pathname + "#profile/" + id) + "</code></div>" : "") + "</div>";
    const stats = '<div class="panel"><h3>Record</h3><div class="stats">' + [["Sent in", p.releases], ["Kills", p.kills], ["Lost", p.deaths], ["Orders", p.orders], ["Hazards", p.hazards], ["Champion kills", p.champion_kills], ["Boss kills", p.boss_kills], ["Round wins", p.round_wins], ["Bets won", p.bets_won], ["Upsets", p.upsets]].map(([k, v]) => '<div class="stat"><div class="k">' + k + '</div><div class="v">' + num(v) + "</div></div>").join("") + "</div>" +
      ((p.daily && p.daily.glory) || (p.weekly && p.weekly.glory) ? '<p class="inline-note">today: ' + num(p.daily.glory) + " glory, " + num(p.daily.kills) + " kills · this week: " + num(p.weekly.glory) + " glory, " + num(p.weekly.kills) + " kills</p>" : "") +
      (p.best && p.best.kills ? '<p class="inline-note">best monster: ' + esc(p.best.name) + " with " + p.best.kills + " kills</p>" : "") +
      ((p.favourites || []).length ? '<p class="inline-note">favourites: ' + p.favourites.map((f) => esc(f.name) + " ×" + f.count).join(", ") + "</p>" : "") +
      (!p.title && p.titles ? '<p class="inline-note">titles: ' + p.titles.map((t) => esc(t.title) + " for " + esc(t.for) + " (" + t.have + "/" + t.need + ")").join("; ") + "</p>" : "") + "</div>";
    const build = S.args[1];
    const tiles = S.order.map((m) => {
      const own = m.starter || (p.unlocked || []).includes(m.name);
      const pts = ((p.talents || {})[m.name] || {}).points || 0;
      const vs = ((p.variants || {})[m.name] || []).length;
      return '<a class="tile' + (own ? "" : " locked") + (build && build.endsWith(m.name) ? " on" : "") + '" href="#profile/' + esc(id) + "/" + esc(m.name) + '" title="' + esc(m.name + (own ? (pts ? " · " + pts + "-point build" : "") + (vs ? " · " + vs + " variants" : "") : " · locked, " + m.unlock + " souls")) + '"><img src="' + esc(m.img) + '" alt="" loading="lazy">' + (own ? (pts ? pips(Math.min(5, Math.ceil(pts / 2))) : "") : '<span class="lock">' + m.unlock + "</span>") + '<span class="n">' + esc(m.name) + "</span></a>";
    }).join("");
    const monsters = '<div class="panel"><h3>' + (mine ? "Your monsters" : "Monsters") + '</h3><p class="sub">' + (p.unlocked || []).length + " unlocked beyond the four starters · locked ones are greyed with their price · " + Object.keys(p.talents || {}).length + " builds. Click one for its talent tree and variants.</p><div class=\"picker\" style=\"max-height:none\">" + tiles + "</div></div>";
    return head + stats + masteryPanel(p, id, mine) + huntsPanel(p, id, mine) + badgePanel(p) + monsters + (build ? buildPanel(p, build, mine) : "");
  }
  function glory(level) { return 30 * (level - 1) * (level - 1); }
  /** What the agent would say about buying the next rank: the same rules, for the display; pool is the build's unspent damage (null: no test). */
  function canSpend(tree, ranks, tal, points, pool, budget) {
    const r = ranks[tal.key] || 0, cap = budget || baseBudget(), tc = tierCosts();
    if (r >= tal.ranks.length) return { why: "maxed" };
    if (points >= cap) return { why: "the build holds " + cap + " points" };
    if (points < TIER_UNLOCK[tal.tier]) return { why: "tier " + (tal.tier + 1) + " opens at " + TIER_UNLOCK[tal.tier] + " points" };
    const cost = tc[tal.tier][Math.min(r, tc[tal.tier].length - 1)];
    if (pool != null && pool < cost) return { why: num(cost) + " damage; the pool holds " + num(pool) };
    return { cost: cost };
  }
  function buildPanel(p, build, mine, opts) {
    opts = opts || {};
    const link = opts.link || ((name) => "#profile/" + esc(p.id) + "/" + esc(name));
    const parts = splitBuild(build);
    if (!parts) return "";
    const base = S.byName[parts.base], vkey = parts.vkey;
    const own = base.starter || (p.unlocked || []).includes(base.name);
    const haveVariant = !vkey || ((p.variants || {})[base.name] || []).includes(vkey);
    const canBuild = mine && own && haveVariant;
    const vs = (S.cat && S.cat.variants) || [];
    const selector = '<div class="variants">' + [{ key: "", affix: "" }].concat(vs).map((v) => {
      const have = v.key ? ((p.variants || {})[base.name] || []).includes(v.key) : own;
      const name = v.key ? v.affix + " " + base.name : base.name;
      const pts = ((p.talents || {})[name] || {}).points || 0;
      const inner = '<span class="vn">' + esc(name) + "</span>" + (v.blurb ? '<span class="vb">' + esc(v.blurb) + "</span>" : '<span class="vb">the base monster</span>') +
        (have ? '<span class="inline-note">' + (pts ? pts + "-point build" : "no points yet") + "</span>" : (mine && v.key ? '<button class="small" data-act="unlock" data-name="' + esc(base.name) + '" data-variant="' + esc(v.key) + '"' + (own ? "" : ' disabled title="unlock the base monster first"') + ">Unlock · " + num(variantDamage(base)) + " damage</button>" : '<span class="inline-note">locked</span>'));
      const clickable = have || opts.preview;
      return clickable ? '<a class="variant' + (have ? " owned" : "") + (name === build ? " on" : "") + '" href="' + link(name) + '">' + inner + "</a>" : '<div class="variant' + (name === build ? " on" : "") + '">' + inner + "</div>";
    }).join("") + "</div>";
    let tree = "";
    const t = S.tree;
    const ranks = ((p.talents || {})[build] || {}).ranks || {};
    const points = Object.values(ranks).reduce((a, b) => a + (parseInt(b, 10) || 0), 0);
    const summary = ((p.talents || {})[build] || {}).summary || "";
    const budget = budgetFor(p, build), tc = tierCosts();
    const pool = p && p.id ? poolOf(p, build) : null;          // the bestiary's preview stub has no account: no affordability test
    if (!t || S.treeName !== build) tree = '<p class="arena-muted">Loading the tree…</p>';
    else if (t.error) tree = '<p class="arena-muted">' + esc(t.error) + "</p>";
    else {
      const names = ["Tier one", "Tier two", "Tier three", "Capstone"];
      tree = '<div class="build-bar"><span class="pts"><b>' + points + "</b> of " + budget + " points</span>" + (mine && p.id ? poolChip(p, build) : "") + (summary ? '<span class="inline-note">' + esc(summary) + "</span>" : '<span class="inline-note">no points spent yet</span>') +
        (canBuild ? '<button class="small" data-act="respec" data-build="' + esc(build) + '"' + (points ? "" : " disabled") + ">Reset the build · " + respecCost() + " souls</button>" : "") + "</div>" +
        '<p class="inline-note">Ranks cost damage your ' + esc(build) + 's deal (tier one ' + tc[0].map(num).join("/") + ", tier two " + tc[1].map(num).join("/") + ", tier three " + tc[2].map(num).join("/") + ", the capstone " + tc[3].map(num).join("/") +
        "); tiers open at 0, 3, 6 and 9 points; a build holds " + baseBudget() + " points" + (progressionLive() ? ", up to " + (baseBudget() + 3) + " with its monster's mastery" : "") + ', so no tree can be filled.</p><div class="tree">' +
        t.tiers.map((tier, i) => {
          const open = points >= TIER_UNLOCK[i];
          return '<div class="tier' + (open ? "" : " shut") + '"><h4><span>' + names[i] + "</span><span>" + (open ? "open" : "opens at " + TIER_UNLOCK[i] + " points") + '</span></h4><div class="talents">' + (tier.talents || []).map((tal) => {
            const r = ranks[tal.key] || 0, max = tal.ranks.length, can = canSpend(t, ranks, tal, points, pool, budget);
            const cls = "talent" + (r >= max ? " maxed" : "") + (i === 3 ? " cap" : "");
            const btn = canBuild ? (can.cost != null ? '<button class="small gold" data-act="spend" data-build="' + esc(build) + '" data-key="' + esc(tal.key) + '">Buy rank ' + (r + 1) + " · " + num(can.cost) + " damage</button>" : '<span class="why">' + esc(can.why || "") + "</span>") : "";
            return '<div class="' + cls + '"><div class="tn"><span>' + esc(tal.name) + "</span><small>" + r + "/" + max + '</small></div><span class="tb">' + esc(tal.blurb) + "</span>" + btn + "</div>";
          }).join("") + "</div></div>";
        }).join("") + "</div>";
    }
    const intro = !mine ? "Sign in to build it; here is the tree as it stands." : !own ? "This monster is locked; here is the tree it would have. Unlock it to build it." : !haveVariant ? "You do not own this variant yet; here is its tree. Unlock it to build it." : "Pick the base or a variant; each has its own build (" + budget + " points for this one).";
    return '<div class="panel"><h3>' + esc(build) + '</h3><p class="sub">' + intro + "</p>" + selector + ((canBuild || opts.preview) ? tree : (own ? '<p class="inline-note">Unlock this variant to build it.</p>' : "")) +
      (mine && own ? '<div class="form-row"><a href="#watch"><button data-act="send-build" data-name="' + esc(base.name) + '" data-variant="' + esc(vkey || "") + '">Send this one in</button></a></div>' : "") + "</div>";
  }
  function splitBuild(build) {
    if (S.byName[build]) return { base: build, vkey: "" };
    for (const v of ((S.cat && S.cat.variants) || [])) if (build.startsWith(v.affix + " ") && S.byName[build.slice(v.affix.length + 1)]) return { base: build.slice(v.affix.length + 1), vkey: v.key };
    return null;
  }

  // ------------------------------------------------------------------ leaderboard
  async function ensureBoard() {
    if (S.board) return;
    const b = await readDoc(pub("leaderboard"));
    S.board = b || { all: [], day: [], week: [], error: "the leaderboard is not published yet" };
    render();
  }
  function viewTop() {
    const b = S.board;
    const kinds = [["all", "All time"], ["day", "Today"], ["week", "This week"]].concat(progressionLive() ? [["masters", "Masters"], ["achievements", "Achievements"]] : []).concat([["doors", "Doors"], ["games", "Games"]]);
    const tabs = '<div class="tabs2">' + kinds.map(([k, l]) => '<button class="' + (S.boardPeriod === k ? "on" : "") + '" data-act="period" data-period="' + k + '">' + l + "</button>").join("") + "</div>";
    if (!b) return '<div class="panel">' + tabs + '<p class="arena-muted">Loading…</p></div>';
    const who = (r, extra) => (r.id ? '<a href="#profile/' + esc(r.id) + '">' : "") + (r.title ? '<span class="title">' + esc(r.title) + "</span> " : "") + esc(r.name) + (r.id ? "</a>" : "") + (extra || "");
    let table;
    if (S.boardPeriod === "masters") {
      const rows = (b.masters || []).map((r) => '<tr><td class="num">' + r.rank + "</td><td>" + who(r) + "</td><td>" + rankPill({ rank: r.mastery_rank, stars: r.stars, name: r.rank_name }) + " " + esc(r.type + " " + r.rank_name) + '</td><td class="num">' + num(r.xp) + "</td></tr>").join("");
      table = rows ? '<table class="top-table"><thead><tr><th></th><th>Player</th><th>Best mastery</th><th>XP</th></tr></thead><tbody>' + rows + "</tbody></table>" : '<p class="arena-muted">Nobody holds a mastery rank yet.</p>';
    } else if (S.boardPeriod === "doors") {
      const w = b.door_wars;
      const wars = w ? '<p class="sub">Door Wars, week ' + esc(w.week) + ": " + (w.leader ? "door " + w.leader.door + " leads with " + num(w.leader.kills) + " kills" : "no kills yet this week") +
        (w.last_winner ? " · last week went to door " + w.last_winner.door + " with " + num(w.last_winner.kills) : "") + ". The week's winning door pays its regulars.</p>" : "";
      const rows = (b.doors || []).map((r) => '<tr><td class="num">' + r.rank + "</td><td>Door " + r.door + (r.weeks_won ? ' <span class="title">' + r.weeks_won + "× week</span>" : "") + '</td><td class="num">' + num(r.today) +
        '</td><td class="num">' + num(r.week) + '</td><td class="num">' + num(r.all) + '</td><td class="num">' + num(r.wins) + '</td><td class="num">' + (r.best ? num(r.best) + " <small>round " + r.best_round + "</small>" : "–") + "</td></tr>").join("");
      table = (b.doors || []).some((r) => r.all) ? wars + '<div class="table-wrap"><table class="top-table"><thead><tr><th></th><th>Door</th><th>Today</th><th>This week</th><th>All time</th><th>Rounds won</th><th>Best round</th></tr></thead><tbody>' + rows + "</tbody></table></div>" :
        '<p class="arena-muted">No door has a kill on the board yet.</p>';
    } else if (S.boardPeriod === "games") {
      const rows = (b.games || []).map((r) => '<tr><td class="num">' + r.rank + "</td><td>" + esc(r.name) + '</td><td class="num">' + num(r.today) + '</td><td class="num">' + num(r.week) + '</td><td class="num">' + num(r.all) +
        '</td><td class="num">' + num(r.clash_wins) + "</td></tr>").join("");
      table = rows ? '<p class="sub">Every kill counts for the game its killer comes from. Clash wins are crossover rounds a game has taken.</p><div class="table-wrap"><table class="top-table"><thead><tr><th></th><th>Game</th><th>Today</th><th>This week</th><th>All time</th><th>Clash wins</th></tr></thead><tbody>' + rows + "</tbody></table></div>" :
        '<p class="arena-muted">No kills on the board yet.</p>';
    } else if (S.boardPeriod === "achievements") {
      const rows = (b.achievements || []).map((r) => '<tr><td class="num">' + r.rank + "</td><td>" + who(r) + '</td><td class="num">' + num(r.points) + '</td><td class="num">' + num(r.count) + "</td></tr>").join("");
      table = rows ? '<table class="top-table"><thead><tr><th></th><th>Player</th><th>Points</th><th>Badges</th></tr></thead><tbody>' + rows + "</tbody></table>" : '<p class="arena-muted">Nobody has earned a badge yet.</p>';
    } else {
      const rows = (b[S.boardPeriod] || []).map((r) => '<tr><td class="num">' + r.rank + "</td><td>" + who(r, r.badge ? " " + rankPill(r.badge) : "") + '</td><td class="num">' + r.level + '</td><td class="num">' + num(r.glory) + '</td><td class="num">' + num(r.kills) + '</td><td class="num">' + num(r.releases) + "</td></tr>").join("");
      table = rows ? '<table class="top-table"><thead><tr><th></th><th>Player</th><th>Level</th><th>Glory</th><th>Kills</th><th>Sent in</th></tr></thead><tbody>' + rows + "</tbody></table>" : '<p class="arena-muted">Nobody on the board yet.</p>';
    }
    return '<div class="panel"><h2>Leaderboard</h2>' + tabs + (b.error ? '<p class="arena-muted">' + esc(b.error) + "</p>" : table) + "</div>";
  }

  // ------------------------------------------------------------------ admin: the rare rounds and events
  // Every control sends an admin command through the same path as the console; the arena checks the sender, so the page
  // only decides what to show. What it shows comes from the live state (the switches, the chances, the queue).
  function viewAdmin() {
    if (!(S.me && S.me.admin)) return '<div class="panel"><h2>Admin</h2><p class="arena-muted">This page is for the arena\'s admins. Sign in with an admin\'s Discord account.</p></div>';
    const st = S.live, sp = st && st.specials, r = st && st.rounds;
    const modeNow = st && st.online ? st.mode : "";
    const modeBtn = (m, label) => '<button class="switch' + (modeNow === m ? " on" : "") + '" data-act="adm" data-cmd="!mode ' + m + '"' + (modeNow === m ? " disabled" : "") + ">" + label + (modeNow === m ? " <b>ON AIR</b>" : "") + "</button>";
    const modePanel = st && st.online ? '<div class="panel"><h3>The show</h3><p class="sub">Only you change the mode, and it stays until you change it back, restarts included. Switching moves the game to the other map: about a minute of loading on the stream, and a round or a match in progress ends without a result (its bets are refunded).</p>' +
      '<div class="adm-switches">' + modeBtn("rounds", "The coliseum: rounds") + modeBtn("ctf", "Capture the Flag") + "</div>" +
      (st.ctf ? '<div class="form-row adm-row"><button data-act="adm" data-cmd="!match end">End this match now</button><label>Call a play for<select data-bind="admPlayTeam"><option value="red">Red</option><option value="blue">Blue</option></select></label>' +
        '<label>the play<select data-bind="admPlayCall"><option value="allin">all in</option><option value="turtle">turtle</option><option value="upper">over the bridge, the long way down</option><option value="lower">through the moat, the short way down</option></select></label>' +
        '<button data-act="adm-play">Call it (90 s)</button></div>' +
        // the director's fill: it keeps both sides at so many alive (the same kinds for both), for testing and for quiet hours
        '<p class="sub">The director\'s fill keeps both sides at a number alive, the same kinds for both. Now: <b>' +
        (st.ctf.fill ? esc(st.ctf.fill) + " a side, one every " + esc(Math.round(st.ctf.fill_every || 8)) + " s" : "off") + "</b></p>" +
        '<div class="adm-switches">' + [["off", "Off", 0], ["6", "6 a side", 6], ["10", "10 a side", 10], ["aggressive", "Aggressive: 14, one every 3 s", 14]].map(([arg, label, n]) =>
          '<button class="switch' + ((st.ctf.fill || 0) === n ? " on" : "") + '" data-act="adm" data-cmd="!ctf fill ' + arg + '">' + label + "</button>").join("") + "</div>" +
        // nobody playing: the director fields both sides by itself until a viewer sends a monster
        '<p class="sub">While nobody plays (no viewer\'s monster for two minutes) the director fields both sides by itself: <b>' +
        (st.ctf.idle_fill ? esc(st.ctf.idle_fill) + " a side, one every " + esc(Math.round(st.ctf.idle_fill_every || 3)) + " s" : "off") + "</b>" +
        (st.ctf.idle ? " · <b>filling now</b>" : "") + "</p>" +
        '<div class="adm-switches"><button class="switch' + (st.ctf.idle_fill ? " on" : "") + '" data-act="adm" data-cmd="!ctf idle on">On: 14 a side</button>' +
        '<button class="switch' + (st.ctf.idle_fill ? "" : " on") + '" data-act="adm" data-cmd="!ctf idle off">Off</button></div>' : "") + "</div>" : "";
    if (st && st.online && !sp) return '<div class="panel"><h2>Admin</h2></div>' + modePanel;
    if (!st || !st.online || !sp) return '<div class="panel"><h2>Admin</h2><p class="arena-muted">The arena is not reporting its specials right now (offline, or not in rounds mode).</p></div>';
    const sw = (flag, label, cmd) => '<button class="switch' + (sp.flags[flag] ? " on" : "") + '" data-act="adm" data-cmd="' + esc(cmd + (sp.flags[flag] ? " off" : " on")) + '">' + esc(label) + " <b>" + (sp.flags[flag] ? "ON" : "OFF") + "</b></button>";
    const q = sp.queue || {};
    const now = '<p class="sub">' + (r && r.phase ? "Round " + esc(st.round) + ", " + esc(r.phase) + ". " : "") + "This round: <b>" + esc(r && r.special ? r.special.title : "ordinary") + "</b>" + (r && r.vote ? " · a vote is open" : "") +
      " · next round: <b>" + esc(q.round || "left to chance") + "</b> · next battle's event: <b>" + esc(q.event || "left to chance") + "</b> · " + sp.since + " ordinary rounds since the last special.</p>";
    const switches = '<div class="panel"><h3>Switches</h3><p class="sub">Off means off at once: no rolls, no votes, the queue dropped. A special already running ends with its round.</p><div class="adm-switches">' +
      sw("enabled", "Everything", "!specials") + sw("mutators", "Mutators", "!specials mutators") + sw("clashes", "Crossover clashes", "!specials clashes") + sw("events", "Mid-round events", "!specials events") + sw("doorwars", "Door Wars", "!specials doorwars") + "</div>" +
      '<div class="form-row adm-row"><label>Special round, % of rounds<input type="number" id="adm-cr" min="0" max="100" step="1" value="' + sp.chance_round + '"></label><label>Event, % of rounds<input type="number" id="adm-ce" min="0" max="100" step="1" value="' + sp.chance_event +
      '"></label><button data-act="adm-chance">Set the chances</button><span class="arena-muted">at least ' + sp.cooldown + " ordinary rounds between special ones</span></div></div>";
    const item = (x, buttons) => '<li><div><b>' + esc(x.title) + "</b><span>" + esc(x.blurb) + '</span></div><div class="adm-btns">' + buttons + "</div></li>";
    const muts = (sp.catalogue.mutators || []).map((x) => item(x, '<button class="small" data-act="adm" data-cmd="!next ' + esc(x.name) + '">Next round</button>')).join("");
    const evs = (sp.catalogue.events || []).map((x) => item(x, '<button class="small" data-act="adm" data-cmd="!next ' + esc(x.name) + '">Next battle</button><button class="small red" data-act="adm" data-cmd="!event ' + esc(x.name) + '">Now</button>')).join("");
    // the clash picks live in the page's state: a state snapshot redraws this view, and the selects must not fall back
    const names = sp.catalogue.shelves || [], adm = S.adm || (S.adm = {});
    const pickA = names.includes(adm.a) ? adm.a : names[0], pickB = names.includes(adm.b) && adm.b !== pickA ? adm.b : names.find((s) => s !== pickA);
    const opts = (pick) => names.map((s) => "<option" + (s === pick ? " selected" : "") + ">" + esc(s) + "</option>").join("");
    const queue ='<div class="panel"><h3>Next round</h3>' + now + '<div class="form-row adm-row"><button data-act="adm" data-cmd="!next vote">Let the viewers vote</button><button data-act="adm" data-cmd="!next clear">Clear the queue</button></div>' +
      '<h4>Mutators</h4><ul class="adm-list">' + muts + "</ul>" +
      '<h4>Crossover clash</h4><div class="form-row adm-row"><label>Doors 1-4<select id="adm-ca" data-bind="admA">' + opts(pickA) + '</select></label><label>Doors 5-8<select id="adm-cb" data-bind="admB">' + opts(pickB) + '</select></label>' +
      '<button data-act="adm-clash">Queue this clash</button><button data-act="adm" data-cmd="!next clash">A random clash</button></div>' +
      '<h4>Mid-round events</h4><ul class="adm-list">' + evs + "</ul></div>";
    const pc = (v) => Math.round(v * 10) / 10 + "%";
    return '<div class="panel"><h2>Admin</h2><p class="sub">Rare rounds and events: left to chance, a special round comes up in about ' + pc(sp.chance_round) + " of rounds and never within " + sp.cooldown +
      " rounds of the last one, a mid-round event in about " + pc(sp.chance_event) + ". Queue anything for the next round here, or switch it all off.</p></div>" + modePanel +
      (modeNow === "ctf" ? '<div class="panel"><p class="sub">The special rounds below belong to the coliseum: they wait while Capture the Flag is on.</p></div>' : "") + switches + queue;
  }

  // ------------------------------------------------------------------ commands
  async function send(text) {
    if (!S.me) { notice("Sign in with Discord first.", false, true); return null; }
    if (S.busy) return null;
    S.busy = true; $("#app").classList.add("busy");
    const entry = { text: text, reply: null, ack: null, note: null };
    S.log.push(entry);
    const r = await ask("_commands", { text: text });
    entry.reply = r.reply || null; entry.ack = r.ack || null; entry.note = r.note || null;
    if (r.account && S.me) S.me.account = r.account;
    const em = /(\d+)\/(\d+) essence left/.exec(r.reply || "");
    if (em && S.me && S.me.account) { S.me.account.essence = parseInt(em[1], 10); S.me.account.cap = parseInt(em[2], 10); }
    const dm = /([\d,]+) damage left in the (.+?) pool/.exec(r.reply || "");
    if (dm && S.me && S.me.account) {
      const d = (S.me.account.damage = S.me.account.damage || {});
      d[dm[2]] = Object.assign({}, d[dm[2]] || {}, { available: parseInt(dm[1].replace(/,/g, ""), 10) });
    }
    renderUser();
    notice(r.reply || (r.ack ? "✓ " + r.ack : r.note), !!(r.reply || r.ack), r.note && /Discord/.test(r.note));
    S.busy = false; $("#app").classList.remove("busy");
    S.treeName = null;                       // the tree redraws from the refreshed profile
    render();
    return entry;
  }
  function bound(name) { const el = document.querySelector('[data-bind="' + name + '"]'); return el ? el.value : ""; }

  document.addEventListener("change", (ev) => {
    const el = ev.target.closest('[data-act="group-pick"]');
    if (!el) return;
    S.form.group = el.value;
    const box = document.querySelector('[data-bind="groupNewName"]');
    if (box) box.hidden = el.value !== "*new";
  });
  document.addEventListener("click", async (ev) => {
    const el = ev.target.closest("[data-act]");
    if (!el) return;
    const act = el.dataset.act;
    if (act === "login") { ev.preventDefault(); try { await signInWithDiscord(S.config && S.config.discord_client_id, S.config && S.config.redirect); } catch (e) { notice("Sign-in could not start: " + e.message); } return; }
    if (act === "logout") { S.me = null; S.viewer = null; S.profile = null; S.tree = null; watchMine(null); render(); try { await signOutUser(); } catch (e) {} return; }
    if (act === "pick") { S.form.name = el.dataset.name; S.form.variant = ""; render(); return; }
    if (act === "layout") { S.layout = S.layout === "side" ? "theatre" : "side"; try { localStorage.setItem("arena_layout", S.layout); } catch (e) {} render(); return; }
    if (act === "set") {
      const v = el.dataset.value, f = el.dataset.field;
      if (f === "count") S.form.count = parseInt(v, 10) || 1;
      else if (f === "door") S.form.door = parseInt(v, 10) || 0;
      else if (f === "strength") S.form.strength = parseInt(v, 10) || 100;
      else if (f === "variant") S.form.variant = v;
      else if (f === "vanilla") S.form.vanilla = v === "1";
      else if (f === "role") S.form.role = v;
      render(); return;
    }
    if (act === "open") { location.hash = "#bestiary/" + el.dataset.key; window.scrollTo({ top: 0, behavior: "smooth" }); return; }
    if (act === "period") { S.boardPeriod = el.dataset.period; render(); return; }
    if (act === "vote") { await send("!vote " + el.dataset.n); return; }
    if (act === "adm") { await send(el.dataset.cmd); return; }
    if (act === "adm-chance") { await send("!specials chance " + (parseFloat($("#adm-cr").value) || 0) + " " + (parseFloat($("#adm-ce").value) || 0)); return; }
    if (act === "adm-clash") {
      const a = $("#adm-ca").value, c = $("#adm-cb").value;
      if (a === c) { notice("Pick two different games for a clash.", false); return; }
      await send("!next " + a + " vs " + c); return;
    }
    if (act === "untarget") { S.target = null; render(); return; }
    if (act === "send-build") { S.form.name = el.dataset.name; S.form.variant = el.dataset.variant || ""; S.form.vanilla = false; return; }
    if (act === "release" || act === "release-all") {
      const f = S.form, m = S.byName[f.name];
      if (!m) return;
      // "!release Name [door] [strength] [xN|all] [variant] [vanilla]": the agent reads two trailing
      // numbers as door and strength, and a lone number of fifty or more as the strength; "all" sends as
      // many as the essence buys at once (the agent settles the count with the copy tax)
      let text = "!release " + m.name;
      if (f.door) text += " " + f.door + " " + f.strength;
      else if (f.strength !== 100) text += " " + f.strength;
      if (act === "release-all") text += " all";
      else if (f.count > 1) text += " x" + f.count;
      if (f.variant) text += " " + f.variant;
      if (f.vanilla) text += " vanilla";
      if (ctfLive() && f.role) text += " " + f.role;          // Capture the Flag: the order it goes out with
      await send(text); return;
    }
    if (act === "group-send") {
      const f = S.form, d = f.door || (S.me.account && S.me.account.home_door) || 0;
      await send("!group send " + el.dataset.name + (d ? " " + d + " " + f.strength : (f.strength !== 100 ? " " + f.strength : ""))); return;
    }
    if (act === "only-owned") { S.form.onlyOwned = !!el.checked; try { localStorage.setItem("arena_only_owned", el.checked ? "1" : "0"); } catch (e) {} render(); return; }
    if (act === "group-delete") { await send("!group delete " + el.dataset.name); return; }
    if (act === "group-add") {
      const a = S.me && S.me.account, m = S.byName[el.dataset.name];
      if (!a || !m) return;
      const groups = a.groups || {}, max = (S.cat && S.cat.costs && S.cat.costs.group_members) || 8;
      const pick = bound("groupPick"), n = Math.max(1, S.form.count || 1);
      let name = pick, members = [];
      if (!pick || pick === "*new" || !groups[pick]) { name = bound("groupNewName").trim().replace(/[^A-Za-z0-9_-]/g, "").slice(0, 16); if (!name) { notice("Name the new group first."); return; } }
      else members = groups[pick].slice();
      for (let i = 0; i < n; i++) members.push(memberWord(m));
      if (members.length > max) { notice("A group holds " + max + " monsters at most; " + name + " would have " + members.length + "."); return; }
      S.form.group = name;
      await send("!group save " + name + " " + groupWords(members)); return;
    }
    if (act === "group-save") {
      const n = bound("groupName").trim(), ms = bound("groupMembers").trim();
      if (!n || !ms) { notice("Give the group a name and its monsters, like: Ogre x2, Grunt x3, Frost Knight"); return; }
      await send("!group save " + n + " " + ms); return;
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
    if (act === "bet-team") { await send("!bet " + bound("betTeam") + " " + bound("betAmt")); return; }
    if (act === "ctf-order") { await send("!order mine " + el.dataset.role); return; }
    if (act === "adm-play") { await send("!play " + bound("admPlayTeam") + " " + bound("admPlayCall")); return; }
    if (act === "unlock") { await send("!unlock " + el.dataset.name + (el.dataset.variant ? " " + el.dataset.variant : "")); return; }
    if (act === "spend") { await send("!talent " + el.dataset.build + " " + el.dataset.key); return; }
    if (act === "respec") { if (confirm("Reset every point in " + el.dataset.build + " for " + respecCost() + " souls? Nothing is refunded.")) await send("!respec " + el.dataset.build); return; }
    if (act === "badge") { await send("!badge " + el.dataset.name); return; }
    if (act === "badge-best") { await send("!badge best"); return; }
  });
  document.addEventListener("change", (ev) => {
    const el = ev.target.closest("[data-bind], [data-act=weapon]");
    if (!el) return;
    if (el.dataset.act === "weapon") { if (el.value) send("!weapon " + el.dataset.id + " " + el.value); return; }
    const b = el.dataset.bind;
    if (b === "shelf") S.filter.shelf = el.value;
    else if (b === "attack") S.filter.attack = el.value;
    else if (b === "threat") S.filter.threat = el.value;
    else if (b === "owned") S.filter.owned = el.checked;
    else if (b === "sendShelf") S.form.shelf = el.value;
    else if (b === "admA" || b === "admB") { (S.adm || (S.adm = {}))[b === "admA" ? "a" : "b"] = el.value; return; }   // kept for the next redraw; nothing to redraw now
    else return;
    render();
  });
  document.addEventListener("input", (ev) => {
    const el = ev.target;
    if (el.dataset && el.dataset.bind === "q") { S.filter.q = el.value; const pos = el.selectionStart; render(); const n = document.querySelector('[data-bind="q"]'); if (n) { n.focus(); n.setSelectionRange(pos, pos); } }
    if (el.dataset && el.dataset.bind === "sendq") { S.form.q = el.value; const pos = el.selectionStart; render(); const n = document.querySelector('[data-bind="sendq"]'); if (n) { n.focus(); n.setSelectionRange(pos, pos); } }
  });
  document.addEventListener("submit", async (ev) => {
    const f = ev.target.closest('[data-act="console"]');
    if (!f) return;
    ev.preventDefault();
    const text = f.cmd.value.trim();
    if (text) { f.cmd.value = ""; await send(text); }
  });
  window.addEventListener("hashchange", () => { route(); render(); });
  document.addEventListener("visibilitychange", () => { watchState(S.view === "watch" && !document.hidden); chatWant(S.view === "watch" && !document.hidden); });

  // ------------------------------------------------------------------ start
  (async function start() {
    route();
    // the bot publishes the Discord application id and the registered redirect
    S.config = await readDoc(pub("config"));
    try { const r = await handleDiscordRedirect(S.config && S.config.redirect); if (r.handled && !r.ok) notice(r.error); } catch (e) { notice("Sign-in did not complete: " + e.message); }
    if (!authReady) notice("The arena's sign-in is not set up yet: the bestiary works, playing from here does not.");
    let bestiary = [];
    try { bestiary = await (await fetch("arena/bestiary.json")).json(); } catch (e) {}
    S.cat = await readDoc(pub("catalogue"));
    if (!S.cat) S.cat = { monsters: bestiary.map((b) => Object.assign({}, b, { id: 0 })), variants: [], shelves: [["Quake", ["quake"]], ["Quake mission packs and episodes", ["hipnotic", "rogue", "mg3"]], ["Quake 2", ["quake2"]], ["Hexen II", ["hexen2"]], ["Half-Life and Opposing Force", ["halflife", "opfor"]], ["Team Fortress", ["tf"]], ["Unreal", ["unreal"]], ["Doom", ["doom"]], ["Doom II", ["doom2"]], ["Doom 64", ["doom64"]], ["Heretic", ["heretic"]], ["Hexen", ["hexen"]], ["Duke Nukem 3D", ["duke"]], ["Shadow Warrior", ["sw"]], ["Blood", ["blood"]], ["Wolfenstein 3D", ["wolf"]], ["Spear of Destiny", ["sod"]], ["Arena originals", ["original"]], ["Arena kin", ["kin"]]].map(([l, s]) => ({ label: l, sources: s })), costs: {} };
    mergeData(bestiary, S.cat);
    render();
    onUser(async (who) => {
      S.viewer = who ? { uid: who.uid, name: who.name, provider: who.provider } : null;
      S.me = null; S.tree = null; watchMine(null);
      render();
      if (S.viewer) await signedIn();
      render();
    });
  })();
})();
