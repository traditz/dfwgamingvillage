/* =============================================================================
   Horus Heresy — Setup & Reference Utility · app logic
   Configurator: scenario & sides (Rules p.12) with the scenario itself for two experienced players
   (Scenario Guide p.2–10), playing pieces (p.10–11), seat (a view filter that marks one side's tasks),
   and the rulebook's optional table aids (p.15, p.19, p.20).
   ============================================================================= */
(function () {
  "use strict";

  const state = {
    mode: "first",          // first | mentor | veteran
    scen: "bab",            // bab | hu | hta | ffb | lug | cha — chosen only when mode is "veteran"
    pieces: "assemble",     // assemble | ready
    seat: "both",           // both | imp | trt
    mods: new Set()         // rotate | pending | tuck
  };
  const openRefs = new Set();   // reference sections the reader has opened (kept across re-renders)

  const ctx = () => ({
    mode: state.mode,
    scen: state.mode === "veteran" ? state.scen : "bab",   // first games play Brother Against Brother (Rules p.12)
    first: state.pieces === "assemble",
    seat: state.seat,
    mod: (id) => state.mods.has(id),
    has: (id) => id === "core"    // one box, no expansions (used by the components glossary)
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
    if (!HH.modes.some(m => m.id === state.mode)) state.mode = "first";
    if (!HH.scenarios.some(m => m.id === state.scen)) state.scen = "bab";
    if (!HH.pieces.some(m => m.id === state.pieces)) state.pieces = "assemble";
    if (!HH.seats.some(m => m.id === state.seat)) state.seat = "both";
    for (const id of [...state.mods]) if (!HH.modules.some(m => m.id === id)) state.mods.delete(id);
  }

  // One-of-N option cards (scenario & sides, pieces, seat)
  function renderChoice(boxSel, list, key) {
    const box = $(boxSel);
    box.innerHTML = "";
    for (const m of list) {
      const on = state[key] === m.id;
      const b = el("button", "mode-btn" + (on ? " on" : ""));
      b.type = "button";
      b.setAttribute("aria-pressed", on ? "true" : "false");
      b.innerHTML = "<b>" + m.name + "</b><span>" + m.blurb + "</span>";
      b.addEventListener("click", () => { state[key] = m.id; update(); });
      box.appendChild(b);
    }
  }

  function renderModules() {
    const box = $("#modules");
    box.innerHTML = "";
    for (const mod of HH.modules) {
      const on = state.mods.has(mod.id);
      const b = el("button", "mod" + (on ? " on" : ""));
      b.type = "button";
      b.setAttribute("aria-pressed", on ? "true" : "false");
      b.innerHTML = "<span class='mod-name'>" + mod.name + "</span><span class='mod-sum'>" + mod.summary + " (" + mod.src + ")</span>";
      b.title = mod.description;
      b.addEventListener("click", () => {
        state.mods.has(mod.id) ? state.mods.delete(mod.id) : state.mods.add(mod.id);
        update();
      });
      box.appendChild(b);
    }
    $("#modules-group").style.display = HH.modules.length ? "" : "none";
  }

  function renderSetup(c) {
    const out = $("#setup");
    out.innerHTML = "";
    let n = 0;
    for (const phase of HH.phases) {
      const steps = phase.steps.filter(s => s.when(c));
      if (!steps.length) continue;
      const ph = el("div", "phase");
      ph.appendChild(el("h3", "phase-title", resolve(phase.title, c)));
      for (const s of steps) {
        n++;
        const who = resolve(s.who, c);
        const meta = HH.tagMeta[who] || HH.tagMeta.both;
        const step = el("div", "step");
        step.appendChild(el("div", "step-num", String(n)));
        const body = el("div", "step-body");
        const head = el("div", "step-head");
        head.appendChild(el("h4", null, resolve(s.t, c)));
        const you = (who === "imp" || who === "trt") && c.seat === who;
        head.appendChild(el("span", "tag " + meta.cls, meta.name + (you ? " · you" : "")));
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
    for (const sec of HH.reference) {
      if (!sec.when(c)) continue;
      const d = el("details", "ref");
      if (openRefs.has(sec.title)) d.open = true;
      d.appendChild(el("summary", null, sec.title));
      const body = el("div", "ref-body", resolve(sec.html, c));
      if (sec.src) body.appendChild(el("div", "src-line", resolve(sec.src, c)));
      d.appendChild(body);
      d.addEventListener("toggle", () => { d.open ? openRefs.add(sec.title) : openRefs.delete(sec.title); });
      out.appendChild(d);
    }
  }

  function docVisible(x) {
    return x === "rules" || x === "faq" || x === "scen";   // every document applies to every configuration
  }

  /* Rulebook search: rendered by js/search-widget.js (search standard v1). */
  window.AID_SEARCH = {
    index: HH.rulesIndex,
    visible: docVisible,
    hint: () => "Search this page, the rulebook, the Scenario Guide and the FAQ and Errata. Type a word, a phrase or a question.",
    noMatch: () => "No matches on this page or in the rulebook, the Scenario Guide or the FAQ."
  };

  function renderTeach(c) {
    const box = $("#teach");
    if (!box || !HH.teach) return;
    const secs = HH.teach.sections
      .filter(s => !s.when || s.when(c))
      .map(s => ({ h: resolve(s.h, c), html: resolve(s.body, c) }))
      .filter(s => s.html);
    HH._teachText = secs.map(s =>
      s.h.toUpperCase() + "\n" +
      s.html.replace(/<li>/g, "• ").replace(/<\/li>/g, "\n").replace(/<\/p>\s*<p>/g, "\n\n")
            .replace(/<[^>]+>/g, "").replace(/\n{3,}/g, "\n\n").trim()
    ).join("\n\n");
    box.innerHTML = "<div class='teach-top'><h3>📖 Teaching Script — this setup</h3><button type='button' class='teach-copy' id='teachCopy'>📋 Copy script</button></div>" +
      "<p class='teach-note'>" + HH.teach.intro + "</p>" +
      secs.map(s => "<h4>" + s.h + "</h4>" + s.html).join("");
    $("#teachCopy").addEventListener("click", () => {
      const b = $("#teachCopy"), t = b.textContent;
      const done = (msg) => { b.textContent = msg; setTimeout(() => { b.textContent = t; }, 1600); };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(HH._teachText || "").then(() => done("✓ Script copied"), () => done("Copy failed"));
      } else done("Copy failed");
    });
  }

  function update() {
    normalize();
    const c = ctx();
    document.body.setAttribute("data-seat", state.seat);
    renderChoice("#modes", HH.modes, "mode");
    renderChoice("#scens", HH.scenarios, "scen");
    $("#scen-group").hidden = state.mode !== "veteran";
    renderChoice("#pieces", HH.pieces, "pieces");
    renderChoice("#seats", HH.seats, "seat");
    renderModules();
    renderSetup(c);
    renderReference(c);
    renderTeach(c);
    document.dispatchEvent(new CustomEvent("aid:config", { detail: c }));   // components glossary and rulebook search (js/comp-widget.js, js/search-widget.js)
  }

  document.addEventListener("DOMContentLoaded", () => {
    $("#teachBtn").addEventListener("click", () => {
      const p = $("#teach");
      p.hidden = !p.hidden;
      $("#teachBtn").setAttribute("aria-expanded", p.hidden ? "false" : "true");
      if (!p.hidden) p.scrollIntoView({ behavior: "smooth", block: "start" });
    });
    update();
  });
})();
