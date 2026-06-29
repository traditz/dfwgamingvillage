/* =============================================================================
   Blood Bowl: Team Manager — Setup Utility & Reference — application logic
   ============================================================================= */
const state = {
  sources: new Set(["core"]),     // core always on
  players: 3,
  season: "standard",             // standard | abbrev | extended
  options: new Set(),
  tab: "setup",
  teamFilter: new Set(["core","sudden","foul","legendary"]),
  teamQuery: ""
};

const $  = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const el = (t, c, h) => { const n = document.createElement(t); if (c) n.className = c; if (h != null) n.innerHTML = h; return n; };
const esc = s => String(s).replace(/[&<>]/g, m => ({ "&":"&amp;","<":"&lt;",">":"&gt;" }[m]));
const srcTag = id => { const s = BBTM.sources[id]; return `<span class="etag ${s.cls}">${s.short}</span>`; };

/* ---- Config helpers ------------------------------------------------------ */
const hasSrc = id => id === "core" || state.sources.has(id);
const maxPlayers = () => hasSrc("foul") ? 5 : 4;

const OPTIONS = [
  { id:"noSalary",   name:"No Salary Cap",          req:null,     desc:"Shuffle every Staff Upgrade into the deck, including the premium ones." },
  { id:"scheduling", name:"Scheduling Limitations", req:null,     desc:"Reveal only enough highlights for total matchups to equal the manager count." },
  { id:"enchanted",  name:"Enchanted Balls",        req:"sudden", desc:"Replace base balls with Enchanted Balls (Star Power / fans / skill effects)." },
  { id:"corruptRef", name:"The Corrupt Ref",        req:"foul",   desc:"A roaming ref that forces faceup cheating tokens and hands out penalties." }
];
const SEASONS = [
  { id:"abbrev",   name:"Abbreviated", sub:"4 weeks" },
  { id:"standard", name:"Standard",    sub:"5 weeks" },
  { id:"extended", name:"Extended",    sub:"6 weeks" }
];

function ctx() {
  return {
    has: hasSrc,
    p: state.players,
    season: state.players === 2 ? "twoPlayer" : state.season,
    opt: id => state.options.has(id),
    teamsFrom: src => hasSrc(src),
    teamPlayed: id => { const t = BBTM.teams.find(x => x.id === id); return t ? hasSrc(BBTM.leagues.find(l => l.id === t.league).source) : false; }
  };
}

function pruneState() {
  if (state.players > maxPlayers()) state.players = maxPlayers();
  if (state.players < 2) state.players = 2;
  OPTIONS.forEach(o => { if (o.req && !hasSrc(o.req)) state.options.delete(o.id); });
}

/* ---- Configurator -------------------------------------------------------- */
function renderConfig() {
  const sc = $("#sources"); sc.innerHTML = "";
  BBTM.sourceOrder.forEach(id => {
    const s = BBTM.sources[id], on = hasSrc(id);
    const chip = el("button", "chip" + (on ? " on" : "") + (s.always ? " locked" : ""));
    chip.innerHTML = `<span class="chip-name">${s.name}</span><span class="chip-tag ${s.cls}">${s.short}</span>`;
    chip.title = s.blurb;
    if (!s.always) chip.onclick = () => { on ? state.sources.delete(id) : state.sources.add(id); pruneState(); renderAll(); };
    sc.appendChild(chip);
  });

  const pl = $("#players"); pl.innerHTML = "";
  for (let p = 2; p <= maxPlayers(); p++) {
    const b = el("button", "pbtn" + (state.players === p ? " on" : ""), String(p));
    b.onclick = () => { state.players = p; renderAll(); };
    pl.appendChild(b);
  }
  if (!hasSrc("foul")) {
    const note = el("span", "pbtn ghost", "5");
    note.title = "A fifth manager needs the Foul Play expansion.";
    pl.appendChild(note);
  }

  const se = $("#season"); se.innerHTML = "";
  SEASONS.forEach(s => {
    const on = state.season === s.id && state.players !== 2;
    const chip = el("button", "chip season" + (on ? " on" : "") + (state.players === 2 ? " disabled" : ""));
    chip.innerHTML = `<span class="chip-name">${s.name}</span><span class="chip-sub">${s.sub}</span>`;
    if (state.players !== 2) chip.onclick = () => { state.season = s.id; renderAll(); };
    se.appendChild(chip);
  });
  if (state.players === 2) se.appendChild(el("span", "muted inline", "Two-manager games use a fixed tournament-only deck."));

  const op = $("#options"); op.innerHTML = "";
  OPTIONS.forEach(o => {
    if (o.req && !hasSrc(o.req)) return;
    const on = state.options.has(o.id);
    const chip = el("button", "chip small" + (on ? " on" : ""));
    chip.innerHTML = `<span class="chip-name">${o.name}</span>${o.req ? `<span class="chip-tag ${BBTM.sources[o.req].cls}">${BBTM.sources[o.req].short}</span>` : ""}`;
    chip.title = o.desc;
    chip.onclick = () => { on ? state.options.delete(o.id) : state.options.add(o.id); renderAll(); };
    op.appendChild(chip);
  });
}

/* ---- Setup output -------------------------------------------------------- */
function renderSetup() {
  const c = ctx();
  const steps = BBTM.setup.filter(s => !s.when || s.when(c)).sort((a, b) => a.order - b.order);
  const wrap = $("#setupSteps"); wrap.innerHTML = "";

  const active = ["Core Box"].concat(BBTM.sourceOrder.filter(id => id !== "core" && hasSrc(id)).map(id => BBTM.sources[id].name));
  const seasonName = state.players === 2 ? "two managers" : `${state.players} managers · ${SEASONS.find(s => s.id === state.season).name.toLowerCase()} season`;
  $("#setupMeta").textContent = `${steps.length} steps`;
  $("#setupLegend").innerHTML = `Setup for <b>${esc(seasonName)}</b> with <b>${esc(active.join(", "))}</b>. Each step is tagged with its source and cites a rulebook page; expansion steps are inserted in sequence.`;

  let n = 0, html = "";
  BBTM.setupPhases.forEach((phName, pi) => {
    const ps = steps.filter(s => s.ph === pi);
    if (!ps.length) return;
    html += `<section class="setup-block"><h3>${phName}</h3><ol class="ustep">`;
    ps.forEach(s => {
      n++;
      const d    = typeof s.d === "function" ? s.d(c) : s.d;
      const note = s.note ? (typeof s.note === "function" ? s.note(c) : s.note) : "";
      html += `<li><span class="snum">${n}</span><div class="sbody">
          <span class="st">${esc(s.t)}</span> ${srcTag(s.src)} <span class="ssrc">${esc(s.page)}</span>
          <div class="sd">${esc(d)}</div>
          ${note ? `<div class="snote">${esc(note)}</div>` : ""}
        </div></li>`;
    });
    html += `</ol></section>`;
  });
  wrap.innerHTML = html;

  const callouts = BBTM.setupCallouts.filter(co => co.when(c));
  $("#setupNotes").innerHTML = callouts.length
    ? `<div class="callouts"><h3>Notes for this configuration</h3>${callouts.map(co =>
        `<div class="callout">${srcTag(co.src)} <b>${esc(co.t)}</b><p>${esc(co.d)}</p></div>`).join("")}</div>`
    : "";
}

/* ---- Reference ----------------------------------------------------------- */
function renderReference() {
  const R = BBTM.reference;
  const order = [R.rounds, R.skills, R.tackle, R.winner, R.mechanics, R.abilities, R.winning, R.faq];

  $("#refNav").innerHTML = order.map(s => `<a href="#${s.id}" class="jn">${s.title}</a>`).join("");

  let h = "";

  // Rounds
  h += `<section class="ref-card" id="${R.rounds.id}"><h2>${R.rounds.title}</h2><p class="ref-intro">${R.rounds.intro}</p>
    <div class="phase-grid">${R.rounds.phases.map(p =>
      `<div class="phase-col"><h4>${p.h}</h4><ul>${p.items.map(i => `<li>${esc(i)}</li>`).join("")}</ul></div>`).join("")}</div></section>`;

  // Skills
  h += `<section class="ref-card" id="${R.skills.id}"><h2>${R.skills.title}</h2><p class="ref-intro">${R.skills.intro}</p>
    <ul class="def-list">${R.skills.items.map(s =>
      `<li><span class="dk">${esc(s.k)}</span> ${srcTag(s.tag)}<span class="dt">${esc(s.t)}</span></li>`).join("")}</ul>
    <p class="ref-foot">${esc(R.skills.downed)}</p></section>`;

  // Tackle
  h += `<section class="ref-card" id="${R.tackle.id}"><h2>${R.tackle.title}</h2><p class="ref-intro">${R.tackle.intro}</p>
    <div class="mini-grid">${R.tackle.dice.map(d => `<div class="mini"><b>${esc(d.c)}</b><span>${esc(d.d)}</span></div>`).join("")}</div>
    <div class="two-col">
      <div><h4>Results</h4><ul class="def-list">${R.tackle.results.map(r => `<li><span class="dk">${esc(r.k)}</span><span class="dt">${esc(r.t)}</span></li>`).join("")}</ul></div>
      <div><h4>Player States</h4><ul class="def-list">${R.tackle.states.map(r => `<li><span class="dk">${esc(r.k)}</span><span class="dt">${esc(r.t)}</span></li>`).join("")}</ul></div>
    </div></section>`;

  // Winner & payouts
  h += `<section class="ref-card" id="${R.winner.id}"><h2>${R.winner.title}</h2><p class="ref-intro">${R.winner.intro}</p>
    <ul class="bullet">${R.winner.bullets.map(b => `<li>${esc(b)}</li>`).join("")}</ul>
    <h4>Payout icons</h4><ul class="def-list">${R.winner.icons.map(i => `<li><span class="dk">${esc(i.k)}</span><span class="dt">${esc(i.t)}</span></li>`).join("")}</ul></section>`;

  // Mechanics
  h += `<section class="ref-card" id="${R.mechanics.id}"><h2>${R.mechanics.title}</h2>
    <ul class="def-list">${R.mechanics.items.map(m =>
      `<li>${srcTag(m.src)}<span class="dk">${esc(m.h)}</span><span class="dt">${esc(m.t)}</span></li>`).join("")}</ul></section>`;

  // Abilities
  h += `<section class="ref-card" id="${R.abilities.id}"><h2>${R.abilities.title}</h2><p class="ref-intro">${R.abilities.intro}</p>
    <ul class="def-list cols">${R.abilities.items.map(a => `<li><span class="dk">${esc(a[0])}</span><span class="dt">${esc(a[1])}</span></li>`).join("")}</ul></section>`;

  // Winning
  h += `<section class="ref-card" id="${R.winning.id}"><h2>${R.winning.title}</h2><p class="ref-intro">${R.winning.intro}</p>
    <ul class="bullet">${R.winning.ties.map(t => `<li>${esc(t)}</li>`).join("")}</ul></section>`;

  // FAQ
  h += `<section class="ref-card" id="${R.faq.id}"><h2>${R.faq.title}</h2>
    <div class="faq-list">${R.faq.items.map(f =>
      `<details class="faq-item"><summary>${esc(f.q)}</summary><div class="faq-a">${esc(f.a)}</div></details>`).join("")}</div></section>`;

  $("#refBody").innerHTML = h;
}

/* ---- Teams & Leagues ----------------------------------------------------- */
function diffPips(diff) {
  const d = BBTM.difficulty[diff];
  let pips = "";
  for (let i = 1; i <= 4; i++) pips += `<span class="pip${i <= d.pips ? " on" : ""}"></span>`;
  return `<span class="diff ${d.cls}" title="Difficulty: ${d.label} (as printed in the Legendary rulebook)">
      <span class="pips">${pips}</span><span class="diff-label">${d.label}</span></span>`;
}

function teamMatches(t, q) {
  if (!q) return true;
  const league = BBTM.leagues.find(l => l.id === t.league);
  const hay = [t.name, t.race, t.style, t.difficulty, league.name, league.code, league.division,
    (t.special || []).map(s => s.name + " " + s.text).join(" "), t.blurb].join(" ").toLowerCase();
  return q.toLowerCase().split(/\s+/).filter(Boolean).every(tok => hay.includes(tok));
}

function renderTeams() {
  // difficulty legend
  $("#diffLegend").innerHTML = "Difficulty: " + ["Low","Medium","High","Very High"].map(diffPips).join("");

  // filters
  const ff = $("#teamFilters"); ff.innerHTML = "";
  BBTM.sourceOrder.forEach(id => {
    const s = BBTM.sources[id], on = state.teamFilter.has(id);
    const chip = el("button", "chip small filter" + (on ? " on" : ""));
    chip.innerHTML = `<span class="chip-tag ${s.cls}">${s.short}</span><span class="chip-name">${s.name}</span>`;
    chip.onclick = () => { on ? state.teamFilter.delete(id) : state.teamFilter.add(id); renderTeams(); };
    ff.appendChild(chip);
  });

  const q = state.teamQuery;
  const wrap = $("#leagues"); wrap.innerHTML = "";
  let shown = 0;

  BBTM.leagues.forEach(lg => {
    if (!state.teamFilter.has(lg.source)) return;
    const teams = BBTM.teams.filter(t => t.league === lg.id && teamMatches(t, q));
    if (!teams.length) return;
    shown += teams.length;

    const s = BBTM.sources[lg.source];
    const sec = el("section", "league");
    sec.innerHTML = `
      <div class="league-head ${s.cls}-edge">
        <div class="lh-main">
          <span class="lcode ${s.cls}">${lg.code}</span>
          <h2>${esc(lg.name)}</h2>
        </div>
        <div class="lh-meta">
          <span class="etag ${s.cls}">${esc(s.name)}</span>
          ${lg.official ? `<span class="meta-pill">TMU subdivision · ${esc(lg.division)}</span>` : `<span class="meta-pill ghost">Unofficial league</span>`}
        </div>
        <p class="league-blurb">${esc(lg.blurb)}</p>
      </div>
      <div class="team-grid">${teams.map(teamCard).join("")}</div>`;
    wrap.appendChild(sec);
  });

  if (!shown) wrap.innerHTML = `<p class="muted pad">No teams match “${esc(q)}” in the selected leagues.</p>`;
}

function teamCard(t) {
  const special = (t.special || []).map(sp =>
    `<div class="sp-rule"><b>${esc(sp.name)}</b> — ${esc(sp.text)}</div>`).join("");
  return `<article class="team-card">
      <div class="tc-top">
        <div class="tc-icon"><img loading="lazy" src="images/teams/${t.id}.png" alt="${esc(t.name)} emblem"></div>
        <div class="tc-id">
          <h3>${esc(t.name)}</h3>
          <div class="tc-sub"><span class="race">${esc(t.race)}</span> · <span class="style">${esc(t.style)}</span></div>
          ${diffPips(t.difficulty)}
        </div>
      </div>
      <p class="tc-blurb">${esc(t.blurb)}</p>
      ${special ? `<div class="tc-special">${special}</div>` : ""}
    </article>`;
}

/* ---- Tabs & boot --------------------------------------------------------- */
function renderAll() { renderConfig(); renderSetup(); }

function switchTab(tab) {
  state.tab = tab;
  $$(".tab").forEach(b => b.classList.toggle("on", b.dataset.tab === tab));
  $$(".view").forEach(v => v.classList.toggle("on", v.id === "view-" + tab));
  if (tab === "reference") renderReference();
  if (tab === "teams") renderTeams();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

document.addEventListener("DOMContentLoaded", () => {
  renderAll();
  $("#tabs").addEventListener("click", e => { const b = e.target.closest(".tab"); if (b) switchTab(b.dataset.tab); });
  const ts = $("#teamSearch");
  ts.addEventListener("input", () => { state.teamQuery = ts.value.trim(); renderTeams(); });
});
