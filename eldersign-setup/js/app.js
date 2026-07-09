/* =============================================================================
   Elder Sign — Setup & Reference Utility · app logic
   Renders the configurator (sets, mode, players, modules), the filtered
   setup sequence, the reference sections, and the rulebook search.
   ============================================================================= */
(function () {
  "use strict";

  /* ---- state ---- */
  const state = {
    exps: new Set(["base"]),
    mode: "museum",
    players: 4,
    mods: new Set()
  };

  const ctx = () => ({
    has: (id) => state.exps.has(id),
    mode: state.mode,
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

  /* ---- sanity-check the config after any change ---- */
  function normalize() {
    // mode requires its expansion
    const m = ES.modes.find(x => x.id === state.mode);
    if (m && m.requires && !state.exps.has(m.requires)) state.mode = "museum";
    // modules require their expansion + a compatible mode
    for (const mod of ES.modules) {
      if (!state.mods.has(mod.id)) continue;
      if (!state.exps.has(mod.requires)) state.mods.delete(mod.id);
      else if (mod.modes && !mod.modes.includes(state.mode)) state.mods.delete(mod.id);
    }
  }

  /* ---- configurator ---- */
  function renderExpansions() {
    const box = $("#expansions");
    box.innerHTML = "";
    for (const e of ES.expansions) {
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

  function renderModes() {
    const box = $("#modes");
    box.innerHTML = "";
    for (const m of ES.modes) {
      const avail = !m.requires || state.exps.has(m.requires);
      const b = el("button", "mode-btn" + (state.mode === m.id ? " on" : "") + (avail ? "" : " off"));
      b.type = "button";
      b.innerHTML = "<b>" + m.name + "</b><span>" + (avail ? m.blurb : "Needs " + ES.expMeta[m.requires].name) + "</span>";
      if (avail) b.addEventListener("click", () => { state.mode = m.id; update(); });
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
    for (const mod of ES.modules) {
      if (!state.exps.has(mod.requires)) continue;
      if (mod.modes && !mod.modes.includes(state.mode)) continue;
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

  /* ---- setup steps ---- */
  function renderSetup(c) {
    const out = $("#setup");
    out.innerHTML = "";
    let n = 0;
    for (const phase of ES.phases) {
      const steps = phase.steps.filter(s => s.when(c));
      if (!steps.length) continue;
      const ph = el("div", "phase");
      ph.appendChild(el("h3", "phase-title", phase.title));
      if (phase.note) ph.appendChild(el("p", "phase-note", phase.note));
      for (const s of steps) {
        n++;
        const exp = resolve(s.exp, c);
        const meta = ES.expMeta[exp] || ES.expMeta.base;
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

  /* ---- reference ---- */
  function renderReference(c) {
    const out = $("#reference");
    out.innerHTML = "";
    for (const sec of ES.reference) {
      if (!sec.when(c)) continue;
      const d = el("details", "ref");
      d.appendChild(el("summary", null, sec.title));
      d.appendChild(el("div", "ref-body", resolve(sec.html, c)));
      out.appendChild(d);
    }
  }

  /* ---- rulebook search ---- */
  const bookOfSet = { base: "base", faq: "base", uf: "uf", goa: "goa", ooi: "ooi", gc: "gc", ootd: "ootd", ootp: "ootp" };
  function doSearch() {
    const q = $("#rsearch").value.trim().toLowerCase();
    const out = $("#rresults");
    out.innerHTML = "";
    if (q.length < 3) {
      out.innerHTML = "<p class='rhint'>Type at least 3 characters to search every rulebook and the FAQ.</p>";
      return;
    }
    const c = ctx();
    const hits = [];
    for (const pg of ES.rulesIndex) {
      const set = bookOfSet[pg.x] || "base";
      if (set !== "base" && !c.has(set)) continue;
      const t = pg.t.toLowerCase();
      let idx = t.indexOf(q);
      if (idx === -1) continue;
      hits.push({ pg, idx });
      if (hits.length >= 40) break;
    }
    if (!hits.length) {
      out.innerHTML = "<p class='rhint'>No matches in the selected sets' rulebooks.</p>";
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

  /* ---- master update ---- */
  function update() {
    normalize();
    const c = ctx();
    renderExpansions();
    renderModes();
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
