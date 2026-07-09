/* =============================================================================
   Nemesis — Setup & Reference Utility · app logic
   ============================================================================= */
(function () {
  "use strict";

  const state = {
    exps: new Set(["base"]),
    mode: "standard",
    race: "intruders",
    players: 4,
    mods: new Set()
  };

  const ctx = () => ({
    has: (id) => state.exps.has(id),
    mode: state.mode,
    race: state.race,
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

  function playerRange() {
    if (state.mode === "solo") return [1, 1];
    return [2, 5];
  }

  function modeAvailable(m) {
    return !m.requires || state.exps.has(m.requires);
  }

  function raceAvailable(r) {
    if (r.requires && !state.exps.has(r.requires)) return false;
    // Aftermath modes are written for the base Intruder race
    if ((state.mode === "epilogue" || state.mode === "research") && r.id !== "intruders") return false;
    return true;
  }

  function normalize() {
    const m = NM.modes.find(x => x.id === state.mode);
    if (m && !modeAvailable(m)) state.mode = "standard";
    const r = NM.races.find(x => x.id === state.race);
    if (r && !raceAvailable(r)) state.race = "intruders";
    const [lo, hi] = playerRange();
    if (state.players < lo) state.players = lo;
    if (state.players > hi) state.players = hi;
    for (const mod of NM.modules) {
      if (!state.mods.has(mod.id)) continue;
      if (!state.exps.has(mod.requires)) { state.mods.delete(mod.id); continue; }
      if (mod.modes && !mod.modes.includes(state.mode)) { state.mods.delete(mod.id); continue; }
      if (mod.minP && state.players < mod.minP) { state.mods.delete(mod.id); continue; }
    }
  }

  function renderExpansions() {
    const box = $("#expansions");
    box.innerHTML = "";
    for (const e of NM.expansions) {
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
    for (const m of NM.modes) {
      const avail = modeAvailable(m);
      const b = el("button", "mode-btn" + (state.mode === m.id ? " on" : "") + (avail ? "" : " off"));
      b.type = "button";
      b.innerHTML = "<b>" + m.name + "</b><span>" + (avail ? m.blurb : "Requires the Aftermath expansion") + "</span>";
      if (avail) b.addEventListener("click", () => { state.mode = m.id; update(); });
      box.appendChild(b);
    }
  }

  function renderRaces() {
    const box = $("#races");
    box.innerHTML = "";
    for (const r of NM.races) {
      const avail = raceAvailable(r);
      let why = r.blurb;
      if (!avail) {
        why = (r.requires && !state.exps.has(r.requires))
          ? "Requires the " + r.name + " expansion"
          : "Aftermath modes use the base Intruder race";
      }
      const b = el("button", "mode-btn race-btn" + (state.race === r.id ? " on" : "") + (avail ? "" : " off"));
      b.type = "button";
      b.innerHTML = "<b>" + r.name + "</b><span>" + why + "</span>";
      if (avail) b.addEventListener("click", () => { state.race = r.id; update(); });
      box.appendChild(b);
    }
  }

  function renderPlayers() {
    const box = $("#players");
    box.innerHTML = "";
    const [lo, hi] = playerRange();
    for (let i = 1; i <= 5; i++) {
      const ok = i >= lo && i <= hi;
      const b = el("button", "pbtn" + (state.players === i ? " on" : "") + (ok ? "" : " off"), String(i));
      b.type = "button";
      if (ok) b.addEventListener("click", () => { state.players = i; update(); });
      else b.title = i === 1 ? "1 player = Solo mode" : "Multiplayer modes need 2+ players";
      box.appendChild(b);
    }
  }

  function renderModules() {
    const box = $("#modules");
    box.innerHTML = "";
    let shown = 0;
    for (const mod of NM.modules) {
      if (!state.exps.has(mod.requires)) continue;
      if (mod.modes && !mod.modes.includes(state.mode)) continue;
      if (mod.minP && state.players < mod.minP) continue;
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
    for (const phase of NM.phases) {
      const steps = phase.steps.filter(s => s.when(c));
      if (!steps.length) continue;
      const ph = el("div", "phase");
      ph.appendChild(el("h3", "phase-title", phase.title));
      for (const s of steps) {
        n++;
        const exp = resolve(s.exp, c);
        const meta = NM.expMeta[exp] || NM.expMeta.base;
        const step = el("div", "step");
        step.appendChild(el("div", "step-num", String(n)));
        const body = el("div", "step-body");
        const head = el("div", "step-head");
        head.appendChild(el("h4", null, resolve(s.t, c)));
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
    for (const sec of NM.reference) {
      if (!sec.when(c)) continue;
      const d = el("details", "ref");
      d.appendChild(el("summary", null, resolve(sec.title, c)));
      const body = el("div", "ref-body", resolve(sec.html, c));
      if (sec.src) body.appendChild(el("div", "src-line", resolve(sec.src, c)));
      d.appendChild(body);
      out.appendChild(d);
    }
  }

  function doSearch() {
    const q = $("#rsearch").value.trim().toLowerCase();
    const out = $("#rresults");
    out.innerHTML = "";
    if (q.length < 3) {
      out.innerHTML = "<p class='rhint'>Type at least 3 characters to search every selected rulebook and the FAQ.</p>";
      return;
    }
    const c = ctx();
    const hits = [];
    for (const pg of NM.rulesIndex) {
      const set = (pg.x === "faq" || pg.x === "rooms") ? "base" : pg.x;
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
    renderModes();
    renderRaces();
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
