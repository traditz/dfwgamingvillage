/* =============================================================================
   Eldritch Horror — Setup & Reference Utility · app logic
   ============================================================================= */
(function () {
  "use strict";

  const state = {
    exps: new Set(["base"]),
    ao: null,               // ancient one id or null = "group decides"
    players: 4,
    mods: new Set()
  };

  const ctx = () => ({
    has: (id) => state.exps.has(id),
    ao: EH.ancientOnes.find(a => a.id === state.ao) || null,
    p: state.players,
    mod: (id) => state.mods.has(id)
  });

  const $ = (s) => document.querySelector(s);
  const el = (tag, cls, html) => {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (html !== undefined) n.innerHTML = html;
    return n;
  };
  const resolve = (v, c) => (typeof v === "function" ? v(c) : v);

  function normalize() {
    const ao = EH.ancientOnes.find(a => a.id === state.ao);
    if (ao && !state.exps.has(ao.set)) state.ao = null;
    for (const mod of EH.modules) {
      if (state.mods.has(mod.id) && !state.exps.has(mod.requires)) state.mods.delete(mod.id);
    }
    // campaign implies personal stories; choose-prelude and no-prelude are exclusive
    if (state.mods.has("campaign")) state.mods.add("stories");
    if (state.mods.has("noPrelude")) state.mods.delete("choosePrelude");
  }

  function renderExpansions() {
    const box = $("#expansions");
    box.innerHTML = "";
    for (const e of EH.expansions) {
      const b = el("button", "chip" + (state.exps.has(e.id) ? " on" : "") + (e.id === "base" ? " lock" : ""));
      b.type = "button";
      b.innerHTML = "<b>" + e.short + "</b><span>" + e.year + "</span>";
      b.title = e.blurb;
      if (e.id !== "base") b.addEventListener("click", () => {
        state.exps.has(e.id) ? state.exps.delete(e.id) : state.exps.add(e.id);
        update();
      });
      box.appendChild(b);
    }
  }

  function renderAOs() {
    const box = $("#aos");
    box.innerHTML = "";
    const any = el("button", "ao-btn" + (state.ao === null ? " on" : ""));
    any.type = "button";
    any.innerHTML = "<b>Decide at the table</b><span>Generic steps — resolve whichever sheet you pick.</span>";
    any.addEventListener("click", () => { state.ao = null; update(); });
    box.appendChild(any);
    for (const a of EH.ancientOnes) {
      if (!state.exps.has(a.set)) continue;
      const b = el("button", "ao-btn" + (state.ao === a.id ? " on" : ""));
      b.type = "button";
      b.innerHTML = "<b>" + a.name + "</b><span class='tag " + EH.expMeta[a.set].cls + "'>" + EH.expMeta[a.set].name + "</span>";
      b.title = a.notes;
      b.addEventListener("click", () => { state.ao = a.id; update(); });
      box.appendChild(b);
    }
  }

  function renderPlayers() {
    const box = $("#players");
    box.innerHTML = "";
    for (let i = 1; i <= 8; i++) {
      const b = el("button", "pbtn" + (state.players === i ? " on" : ""), String(i));
      b.type = "button";
      b.addEventListener("click", () => { state.players = i; update(); });
      box.appendChild(b);
    }
  }

  function renderModules() {
    const box = $("#modules");
    box.innerHTML = "";
    let shown = 0;
    for (const mod of EH.modules) {
      if (!state.exps.has(mod.requires)) continue;
      shown++;
      const on = state.mods.has(mod.id);
      const b = el("button", "mod" + (on ? " on" : ""));
      b.type = "button";
      b.innerHTML = "<span class='mod-name'>" + mod.name + "</span><span class='mod-sum'>" + mod.summary + "</span>";
      b.title = mod.description + " (" + mod.src + ")";
      b.addEventListener("click", () => {
        on ? state.mods.delete(mod.id) : state.mods.add(mod.id);
        update();
      });
      box.appendChild(b);
    }
    $("#modules-group").style.display = shown ? "" : "none";
  }

  function renderSetup(c) {
    const out = $("#setup");
    out.innerHTML = "";
    let n = 0;
    for (const phase of EH.phases) {
      const steps = phase.steps.filter(s => s.when(c));
      if (!steps.length) continue;
      const ph = el("div", "phase");
      ph.appendChild(el("h3", "phase-title", phase.title));
      if (phase.note) ph.appendChild(el("p", "phase-note", phase.note));
      for (const s of steps) {
        n++;
        const exp = resolve(s.exp, c);
        const meta = EH.expMeta[exp] || EH.expMeta.base;
        const step = el("div", "step");
        step.appendChild(el("div", "step-num", String(n)));
        const body = el("div", "step-body");
        const head = el("div", "step-head");
        head.appendChild(el("h4", null, s.t));
        head.appendChild(el("span", "tag " + meta.cls, meta.name));
        body.appendChild(head);
        body.appendChild(el("div", "step-text", resolve(s.d, c)));
        body.appendChild(el("div", "src-line", resolve(s.src, c)));
        step.appendChild(body);
        ph.appendChild(step);
      }
      out.appendChild(ph);
    }
  }

  function renderReference(c) {
    const out = $("#reference");
    out.innerHTML = "";
    for (const sec of EH.reference) {
      if (!sec.when(c)) continue;
      const d = el("details", "ref");
      d.appendChild(el("summary", null, sec.title));
      d.appendChild(el("div", "ref-body", resolve(sec.html, c)));
      out.appendChild(d);
    }
  }

  function doSearch() {
    const q = $("#rsearch").value.trim().toLowerCase();
    const out = $("#rresults");
    out.innerHTML = "";
    if (q.length < 3) {
      out.innerHTML = "<p class='rhint'>Type at least 3 characters to search the rulebook, every selected expansion, and the Ultimate FAQ.</p>";
      return;
    }
    const c = ctx();
    const hits = [];
    for (const pg of EH.rulesIndex) {
      const set = pg.x === "faq" ? "base" : pg.x;
      if (set !== "base" && !c.has(set)) continue;
      const t = pg.t.toLowerCase();
      const idx = t.indexOf(q);
      if (idx === -1) continue;
      hits.push({ pg, idx });
      if (hits.length >= 40) break;
    }
    if (!hits.length) {
      out.innerHTML = "<p class='rhint'>No matches in the selected sets' documents.</p>";
      return;
    }
    for (const { pg, idx } of hits) {
      const start = Math.max(0, idx - 130);
      const end = Math.min(pg.t.length, idx + q.length + 200);
      let snip = (start > 0 ? "…" : "") + pg.t.slice(start, end) + (end < pg.t.length ? "…" : "");
      snip = snip.replace(/</g, "&lt;");
      const rx = new RegExp("(" + q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + ")", "ig");
      snip = snip.replace(rx, "<mark>$1</mark>");
      const hit = el("div", "rhit");
      hit.appendChild(el("div", "rhit-src", pg.b + " — p." + pg.p));
      hit.appendChild(el("div", "rhit-text", snip));
      out.appendChild(hit);
    }
  }

  function update() {
    normalize();
    const c = ctx();
    renderExpansions();
    renderAOs();
    renderPlayers();
    renderModules();
    renderSetup(c);
    renderReference(c);
    doSearch();
  }

  document.addEventListener("DOMContentLoaded", () => {
    $("#rsearch").addEventListener("input", doSearch);
    update();
  });
})();
