/* =============================================================================
   Talisman (Revised 4th Edition) — Setup Utility & Reference — application logic
   Configurator (expansions + players + endgame + variants) -> live, source-tagged
   setup sequence, plus a grounded game reference & FAQ.
   ============================================================================= */
const state = {
  sources: new Set(["base"]),   // base always on
  players: 4,
  ending: "crown",              // crown | alt
  options: new Set(),           // faster-play variants
  tab: "setup"
};

const $  = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const el = (t, c, h) => { const n = document.createElement(t); if (c) n.className = c; if (h != null) n.innerHTML = h; return n; };
const esc = s => String(s).replace(/[&<>]/g, m => ({ "&":"&amp;","<":"&lt;",">":"&gt;" }[m]));
const srcTag = id => { const s = TAL.sources[id]; return s ? `<span class="etag ${s.cls}">${esc(s.short)}</span>` : ""; };

/* ---- Config helpers ------------------------------------------------------ */
const hasSrc = id => id === "base" || state.sources.has(id);

/* Active corner boards (those that physically attach to the main board). */
function activeCorners() { return Object.keys(TAL.cornerBoards).filter(hasSrc); }
/* Which expansions are contributing Alternative Ending Cards right now. */
function activeAltPool() { return TAL.altEndingSources.filter(hasSrc); }
/* Cataclysm replaces the main board. */
function boardMode() { return hasSrc("cataclysm") ? "cataclysm" : "main"; }

/* Faster-play variants (id, name, desc, optional req predicate). */
const OPTIONS = [
  { id:"easyCmd",   name:"Easier Command Spell",  desc:"Command Spell triggers on more results (5p: 3–6, 6p: 2–6, 7p+: automatic)." },
  { id:"fastSC",    name:"Faster Strength/Craft", desc:"Lower the trophy threshold for a counter from 7 to 6 (or 5)." },
  { id:"startBonus",name:"Starting Bonus",        desc:"Each character takes one extra Strength or Craft at the start." },
  { id:"bloodbath", name:"Talisman Bloodbath",    desc:"Use only one Talisman card; a killed character is out of the game." },
  { id:"sudden",    name:"Sudden Death",          desc:"First character to reach the Crown of Command wins outright." },
  { id:"inherit",   name:"Inherited Items",       desc:"A new character inherits the killed character's Objects, gold & Followers." },
  { id:"evadeUnf",  name:"Evade Unfriendlies",    desc:"Allow evading unfriendly cards/spaces at the table's discretion." }
];

/* Build the context object every `when` predicate consumes. */
function ctx() {
  return {
    has: hasSrc,
    p: state.players,
    ending: endingAvailable("alt") ? state.ending : "crown",
    boardMode: boardMode(),
    corners: activeCorners(),
    altPool: activeAltPool(),
    opt: id => state.options.has(id)
  };
}

function endingAvailable(id) {
  const e = TAL.endings.find(x => x.id === id);
  if (!e) return false;
  // Use a minimal probe (only `has` is needed) to avoid recursing into ctx().
  return !e.req || e.req({ has: hasSrc });
}

/* Drop selections that became invalid after a config change. */
function pruneState() {
  if (state.players < 2) state.players = 2;
  if (state.players > 6) state.players = 6;
  if (state.ending === "alt" && !endingAvailable("alt")) state.ending = "crown";
}

/* ---- Configurator -------------------------------------------------------- */
function renderConfig() {
  // Source chips — two blocks (boards, small)
  const drawBlock = (mountId, ids, heading) => {
    const wrap = $(mountId); wrap.innerHTML = "";
    wrap.appendChild(el("div", "src-head", heading));
    const chips = el("div", "chips");
    ids.forEach(id => {
      const s = TAL.sources[id], on = hasSrc(id);
      const chip = el("button", "chip" + (on ? " on" : "") + (s.always ? " locked" : "") + " " + s.cls + "-chip");
      chip.innerHTML = `<span class="chip-name">${esc(s.name)}</span><span class="chip-tag ${s.cls}">${esc(s.short)}</span>`;
      chip.title = s.blurb;
      if (!s.always) chip.onclick = () => { on ? state.sources.delete(id) : state.sources.add(id); pruneState(); renderAll(); };
      chips.appendChild(chip);
    });
    wrap.appendChild(chips);
  };
  drawBlock("#sourcesBoards", ["base", ...TAL.boardSources], "Base game & boards");
  drawBlock("#sourcesSmall", TAL.smallSources, "Card & figure expansions");

  // Players
  const pl = $("#players"); pl.innerHTML = "";
  for (let p = 2; p <= 6; p++) {
    const b = el("button", "pbtn" + (state.players === p ? " on" : ""), String(p));
    b.onclick = () => { state.players = p; renderAll(); };
    pl.appendChild(b);
  }

  // Endgame
  const en = $("#endings"); en.innerHTML = "";
  TAL.endings.forEach(e => {
    const avail = !e.req || endingAvailable(e.id);
    const on = (state.ending === e.id || (e.id === "crown" && !endingAvailable("alt"))) && avail;
    const chip = el("button", "chip ending" + (on ? " on" : "") + (avail ? "" : " disabled"));
    chip.innerHTML = `<span class="chip-name">${esc(e.name)}</span><span class="chip-sub">${esc(e.sub)}</span>`;
    chip.title = avail ? e.desc : e.desc + "  (Add an expansion that supplies Alternative Ending Cards to enable this.)";
    if (avail) chip.onclick = () => { state.ending = e.id; renderAll(); };
    en.appendChild(chip);
  });

  // Faster-play variants
  const op = $("#options"); op.innerHTML = "";
  OPTIONS.forEach(o => {
    const on = state.options.has(o.id);
    const chip = el("button", "chip small" + (on ? " on" : ""));
    chip.innerHTML = `<span class="chip-name">${esc(o.name)}</span>`;
    chip.title = o.desc;
    chip.onclick = () => { on ? state.options.delete(o.id) : state.options.add(o.id); renderAll(); };
    op.appendChild(chip);
  });
}

/* ---- Setup output -------------------------------------------------------- */
function renderSetup() {
  const c = ctx();
  const steps = TAL.setup.filter(s => !s.when || s.when(c));
  const wrap = $("#setupSteps");

  // Header / legend
  const activeNames = ["Base Game"].concat(TAL.sourceOrder.filter(id => id !== "base" && hasSrc(id)).map(id => TAL.sources[id].name));
  const endName = c.ending === "alt" ? "an Alternative Ending" : (c.boardMode === "cataclysm" ? "the Eternal Crown" : "the Crown of Command");
  $("#setupMeta").textContent = `${steps.length} steps`;
  $("#setupLegend").innerHTML =
    `Setup for <b>${esc(state.players)} players</b> using <b>${esc(activeNames.join(", "))}</b>, ending on <b>${esc(endName)}</b>` +
    (c.boardMode === "cataclysm" ? ` on the <b>Cataclysm board</b>` : ``) +
    `. Each step is tagged with its source and cites a rulesheet; steps appear only when they apply to your table.`;

  let n = 0, html = "";
  TAL.phases.forEach((phName, pi) => {
    const ps = steps.filter(s => s.ph === pi).sort((a, b) => a.order - b.order);
    if (!ps.length) return;
    html += `<section class="setup-block"><h3>${esc(phName)}</h3><ol class="ustep">`;
    ps.forEach(s => {
      n++;
      const d = typeof s.d === "function" ? s.d(c) : s.d;
      html += `<li><span class="snum">${n}</span><div class="sbody">
          <span class="st">${esc(s.t)}</span> ${srcTag(s.src)} <span class="ssrc">${esc(s.page)}</span>
          <div class="sd">${esc(d)}</div>
        </div></li>`;
    });
    html += `</ol></section>`;
  });
  wrap.innerHTML = html;

  // Variant reminders chosen by the player
  const chosenOpts = OPTIONS.filter(o => state.options.has(o.id));
  const callouts = TAL.setupCallouts.filter(co => co.when(c));
  let notes = "";
  if (chosenOpts.length || callouts.length) {
    notes += `<div class="callouts"><h3>Notes for this configuration</h3>`;
    chosenOpts.forEach(o => { notes += `<div class="callout"><span class="etag s-var">Variant</span> <b>${esc(o.name)}</b><p>${esc(o.desc)}</p></div>`; });
    callouts.forEach(co => { notes += `<div class="callout">${srcTag(co.src)} <b>${esc(co.t)}</b><p>${esc(co.d)}</p></div>`; });
    notes += `</div>`;
  }
  $("#setupNotes").innerHTML = notes;
}

/* ---- Reference ----------------------------------------------------------- */
function renderReference() {
  const R = TAL.reference;
  const order = [R.turn, R.regions, R.combat, R.stats, R.cards, R.spells, R.inner, R.golden, R.faster];
  $("#refNav").innerHTML = order.map(s => `<a href="#${s.id}" class="jn">${esc(s.title)}</a>`).join("")
    + `<a href="#ref-faq" class="jn">FAQ</a>`;

  let h = "";

  const stepsCard = (s) => `<section class="ref-card" id="${s.id}"><h2>${esc(s.title)}</h2>
    <p class="ref-intro">${esc(s.intro)}</p>
    <ol class="flow-list">${s.steps.map(x => `<li><b>${esc(x.h)}</b> — ${esc(x.t)}</li>`).join("")}</ol>
    ${s.flow ? `<div class="flow-strip">${s.flow.map(f => `<span>${esc(f)}</span>`).join("<i>›</i>")}</div>` : ""}
    ${s.notes ? `<ul class="bullet">${s.notes.map(b => `<li>${esc(b)}</li>`).join("")}</ul>` : ""}</section>`;

  const itemsCard = (s, extra = "") => `<section class="ref-card" id="${s.id}"><h2>${esc(s.title)}</h2>
    <p class="ref-intro">${esc(s.intro)}</p>${extra}
    <ul class="def-list">${s.items.map(i => `<li><span class="dk">${esc(i.k)}</span><span class="dt">${esc(i.t)}</span></li>`).join("")}</ul>
    ${s.notes ? `<ul class="bullet">${s.notes.map(b => `<li>${esc(b)}</li>`).join("")}</ul>` : ""}</section>`;

  h += stepsCard(R.turn);
  h += itemsCard(R.regions);
  h += stepsCard(R.combat);
  h += itemsCard(R.stats);
  h += itemsCard(R.cards);

  // Spells (with table)
  const tbl = `<table class="ref-table"><tbody>${R.spells.table.map((row, ri) =>
    `<tr>${row.map(cell => ri === 0 ? `<th>${esc(cell)}</th>` : `<td>${esc(cell)}</td>`).join("")}</tr>`).join("")}</tbody></table>`;
  h += `<section class="ref-card" id="${R.spells.id}"><h2>${esc(R.spells.title)}</h2>
    <p class="ref-intro">${esc(R.spells.intro)}</p>${tbl}
    <ul class="bullet">${R.spells.notes.map(b => `<li>${esc(b)}</li>`).join("")}</ul></section>`;

  h += itemsCard(R.inner);
  h += itemsCard(R.golden);
  h += itemsCard(R.faster);

  // FAQ
  h += `<section class="ref-card" id="ref-faq"><h2>FAQ &amp; Rules Clarifications</h2>
    <div class="faq-list">${TAL.faq.map(f =>
      `<details class="faq-item"><summary>${esc(f.q)}</summary><div class="faq-a">${esc(f.a)}</div></details>`).join("")}</div></section>`;

  $("#refBody").innerHTML = h;
}

/* ---- Tabs & boot --------------------------------------------------------- */
function renderAll() { renderConfig(); renderSetup(); renderTeach(); }

function switchTab(tab) {
  state.tab = tab;
  $$(".tab").forEach(b => b.classList.toggle("on", b.dataset.tab === tab));
  $$(".view").forEach(v => v.classList.toggle("on", v.id === "view-" + tab));
  if (tab === "reference") renderReference();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

document.addEventListener("DOMContentLoaded", () => {
  renderAll();
  $("#tabs").addEventListener("click", e => { const b = e.target.closest(".tab"); if (b) switchTab(b.dataset.tab); });
});


/* ---- Teaching script panel ------------------------------------------------ */
function renderTeach() {
  const box = document.getElementById("teach");
  if (!box || !TAL.teach) return;
  const c = ctx();
  const secs = TAL.teach.sections
    .filter(s => !s.when || s.when(c))
    .map(s => ({ h: (typeof s.h === "function" ? s.h(c) : s.h), html: (typeof s.body === "function" ? s.body(c) : s.body) }))
    .filter(s => s.html);
  TAL._teachText = secs.map(s =>
    s.h.toUpperCase() + "\n" +
    s.html.replace(/<li>/g, "\u2022 ").replace(/<\/p>\s*<p>/g, "\n\n")
          .replace(/<[^>]+>/g, "").replace(/\n{3,}/g, "\n\n").trim()
  ).join("\n\n");
  box.innerHTML = "<div class='teach-top'><h3>\uD83D\uDCD6 Teaching Script \u2014 this setup</h3><button type='button' class='teach-copy' id='teachCopy'>\uD83D\uDCCB Copy script</button></div>" +
    "<p class='teach-note'>" + TAL.teach.intro + "</p>" +
    secs.map(s => "<h4>" + s.h + "</h4>" + s.html).join("");
  document.getElementById("teachCopy").addEventListener("click", () => {
    const b = document.getElementById("teachCopy"), t = b.textContent;
    navigator.clipboard.writeText(TAL._teachText || "").then(
      () => { b.textContent = "\u2713 Script copied"; setTimeout(() => { b.textContent = t; }, 1600); },
      () => { b.textContent = "Copy failed"; setTimeout(() => { b.textContent = t; }, 1600); });
  });
}
(function () {
  const b = document.getElementById("teachBtn");
  if (b) b.addEventListener("click", () => {
    const p = document.getElementById("teach");
    p.hidden = !p.hidden;
    if (!p.hidden) p.scrollIntoView({ behavior: "smooth", block: "start" });
  });
})();
