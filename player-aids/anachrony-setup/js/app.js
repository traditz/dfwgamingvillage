/* =============================================================================
   Anachrony — Setup & Reference Utility · app logic
   ============================================================================= */
(function () {
  "use strict";

  const state = {
    exps: new Set(["base"]),
    players: 3,
    mods: new Set()
  };

  const ctx = () => ({
    has: (id) => state.exps.has(id),
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

  // Module pairs the rulebooks rule out: [a, b, soloOnly]. Intrigues + Doomsday in every mode
  // (Future Imperfect p.13); Doomsday + Pioneers / Guardians / Hypersync in solo only (Solo p.19).
  const PAIRS = [
    ["doomsday", "ic", false],
    ["doomsday", "pioneers", true],
    ["doomsday", "guardians", true],
    ["doomsday", "hs", true]
  ];

  function dropConflicts(id) {
    for (const [a, b, soloOnly] of PAIRS) {
      if (soloOnly && state.players !== 1) continue;
      if (id === a) state.mods.delete(b);
      else if (id === b) state.mods.delete(a);
    }
  }

  function normalize() {
    state.exps.add("base");
    const solo = state.players === 1;
    for (const mod of AN.modules) {
      if (state.mods.has(mod.id) && !modAvailable(mod)) state.mods.delete(mod.id);
    }
    for (const [a, b, soloOnly] of PAIRS) {
      if ((!soloOnly || solo) && state.mods.has(a) && state.mods.has(b)) state.mods.delete(a);
    }
    // Intrigues replaces Endgame Condition cards entirely
    if (state.mods.has("ic")) state.mods.delete("egdraft");
    // The Chronobot is base-game only (Solo p.4): any expansion module in play needs the Chronossus
    if (solo && (state.exps.has("fot") || AN.modules.some(m => m.requires !== "base" && state.mods.has(m.id)))) {
      state.mods.add("chronossus");
    }
  }

  function renderExpansions() {
    const box = $("#expansions");
    box.innerHTML = "";
    for (const e of AN.expansions) {
      const locked = e.id === "base";
      const b = el("button", "chip" + (state.exps.has(e.id) ? " on" : "") + (locked ? " lock" : ""));
      b.type = "button";
      b.innerHTML = "<b>" + e.short + "</b><span>" + e.year + "</span>";
      b.title = e.blurb;
      if (!locked) b.addEventListener("click", () => {
        state.exps.has(e.id) ? state.exps.delete(e.id) : state.exps.add(e.id);
        update();
      });
      box.appendChild(b);
    }
  }

  function renderPlayers() {
    const box = $("#players");
    box.innerHTML = "";
    for (let i = 1; i <= 4; i++) {
      const b = el("button", "pbtn" + (state.players === i ? " on" : ""), String(i));
      b.type = "button";
      b.addEventListener("click", () => { state.players = i; update(); });
      box.appendChild(b);
    }
  }

  function modAvailable(mod) {
    const solo = state.players === 1;
    if (!state.exps.has(mod.requires)) return false;
    if (mod.id === "chronossus" && !solo) return false;
    // Fractures of Time is not supported with Doomsday or Guardians (Fractures p.15)
    if (state.exps.has("fot") && (mod.id === "doomsday" || mod.id === "guardians")) return false;
    // Solo: Intrigues is unsupported (Solo p.3); Endgame Condition cards stay in the box (Solo p.4, p.8)
    if (solo && (mod.id === "ic" || mod.id === "egdraft")) return false;
    return true;
  }

  function renderModules() {
    const box = $("#modules");
    box.innerHTML = "";
    let shown = 0;
    for (const mod of AN.modules) {
      if (!modAvailable(mod)) continue;
      shown++;
      const on = state.mods.has(mod.id);
      const b = el("button", "mod" + (on ? " on" : ""));
      b.type = "button";
      b.innerHTML = "<span class='mod-name'>" + mod.name + "</span><span class='mod-sum'>" + mod.summary + "</span>";
      b.title = mod.description + " (" + mod.src + ")";
      b.addEventListener("click", () => {
        if (on) state.mods.delete(mod.id);
        else { dropConflicts(mod.id); state.mods.add(mod.id); }
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
    for (const phase of AN.phases) {
      const steps = phase.steps.filter(s => s.when(c));
      if (!steps.length) continue;
      const ph = el("div", "phase");
      ph.appendChild(el("h3", "phase-title", phase.title));
      for (const s of steps) {
        n++;
        const exp = resolve(s.exp, c);
        const meta = AN.expMeta[exp] || AN.expMeta.base;
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
    for (const sec of AN.reference) {
      if (!sec.when(c)) continue;
      const d = el("details", "ref");
      d.appendChild(el("summary", null, sec.title));
      const body = el("div", "ref-body", resolve(sec.html, c));
      if (sec.src) body.appendChild(el("div", "src-line", resolve(sec.src, c)));
      d.appendChild(body);
      out.appendChild(d);
    }
  }

  function docVisible(x, c) {
    switch (x) {
      case "classic": return c.has("classic");
      case "fot": return c.has("fot");
      case "fi": return c.has("fi");
      case "solo": return c.p === 1;
      default: return true;
    }
  }

  /* Rulebook search: rendered by js/search-widget.js (search standard v1). */
  window.AID_SEARCH = {
    index: AN.rulesIndex,
    visible: docVisible,
    hint: () => "Search this page and every selected rulebook. Type a word, a phrase or a question.",
    noMatch: () => "No matches on this page or in the selected sets' documents."
  };

  function renderTeach(c) {
    const box = $("#teach");
    if (!box || !AN.teach) return;
    const secs = AN.teach.sections
      .filter(s => !s.when || s.when(c))
      .map(s => ({ h: (typeof s.h === "function" ? s.h(c) : s.h), html: (typeof s.body === "function" ? s.body(c) : s.body) }))
      .filter(s => s.html);
    AN._teachText = secs.map(s =>
      s.h.toUpperCase() + "\n" +
      s.html.replace(/<li>/g, "• ").replace(/<\/p>\s*<p>/g, "\n\n")
            .replace(/<[^>]+>/g, "").replace(/\n{3,}/g, "\n\n").trim()
    ).join("\n\n");
    box.innerHTML = "<div class='teach-top'><h3>📖 Teaching Script — this setup</h3><button type='button' class='teach-copy' id='teachCopy'>📋 Copy script</button></div>" +
      "<p class='teach-note'>" + AN.teach.intro + "</p>" +
      secs.map(s => "<h4>" + s.h + "</h4>" + s.html).join("");
    $("#teachCopy").addEventListener("click", () => {
      const b = $("#teachCopy"), t = b.textContent;
      navigator.clipboard.writeText(AN._teachText || "").then(
        () => { b.textContent = "✓ Script copied"; setTimeout(() => { b.textContent = t; }, 1600); },
        () => { b.textContent = "Copy failed"; setTimeout(() => { b.textContent = t; }, 1600); });
    });
  }

  function update() {
    normalize();
    const c = ctx();
    renderExpansions();
    renderPlayers();
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
      if (!p.hidden) p.scrollIntoView({ behavior: "smooth", block: "start" });
    });
    update();
  });
})();
