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
  // a module's requires is one set id or an array meaning "any of these"
  const modAvailable = (mod) => [].concat(mod.requires).some(id => state.exps.has(id));

  function normalize() {
    const ao = EH.ancientOnes.find(a => a.id === state.ao);
    if (ao && !state.exps.has(ao.set)) state.ao = null;
    for (const mod of EH.modules) {
      if (state.mods.has(mod.id) && !modAvailable(mod)) state.mods.delete(mod.id);
    }
    // campaign implies personal stories; choose-prelude and no-prelude are exclusive
    if (state.mods.has("campaign")) state.mods.add("stories");
    if (state.mods.has("noPrelude")) state.mods.delete("choosePrelude");
    // staged and insane difficulty build the Mythos deck in incompatible ways
    if (state.mods.has("staged") && state.mods.has("insane")) state.mods.delete("staged");
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
    any.innerHTML = "<b>Decide at the table</b><span>" + (state.mods.has("campaign") ? "Generic steps — use the sheet your campaign determined." : "Generic steps — resolve whichever sheet you pick.") + "</span>";
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
      if (!modAvailable(mod)) continue;
      shown++;
      const on = state.mods.has(mod.id);
      const b = el("button", "mod" + (on ? " on" : ""));
      b.type = "button";
      b.innerHTML = "<span class='mod-name'>" + mod.name + "</span><span class='mod-sum'>" + mod.summary + "</span>";
      b.title = mod.description + " (" + mod.src + ")";
      b.addEventListener("click", () => {
        if (on) { state.mods.delete(mod.id); } else { state.mods.add(mod.id); if (mod.id === "staged") state.mods.delete("insane"); if (mod.id === "insane") state.mods.delete("staged"); }
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

  /* Rulebook search: rendered by js/search-widget.js (search standard v1). The Ultimate FAQ counts as base,
     so it and the base rulebook are always searched; an expansion's rules only when that set is selected. */
  window.AID_SEARCH = {
    index: EH.rulesIndex,
    visible: (x, c) => {
      const set = x === "faq" ? "base" : x;
      return set === "base" || c.has(set);
    },
    hint: () => "Search this page, the rulebook, every selected expansion, and the Ultimate FAQ. Type a word, a phrase or a question.",
    noMatch: () => "No matches on this page or in the selected sets' documents."
  };


  function renderTeach(c) {
    const box = $("#teach");
    if (!box || !EH.teach) return;
    const secs = EH.teach.sections
      .filter(s => !s.when || s.when(c))
      .map(s => ({ h: (typeof s.h === "function" ? s.h(c) : s.h), html: (typeof s.body === "function" ? s.body(c) : s.body) }))
      .filter(s => s.html);
    EH._teachText = secs.map(s =>
      s.h.toUpperCase() + "\n" +
      s.html.replace(/<li>/g, "\u2022 ").replace(/<\/p>\s*<p>/g, "\n\n")
            .replace(/<[^>]+>/g, "").replace(/\n{3,}/g, "\n\n").trim()
    ).join("\n\n");
    box.innerHTML = "<div class='teach-top'><h3>\uD83D\uDCD6 Teaching Script \u2014 this setup</h3><button type='button' class='teach-copy' id='teachCopy'>\uD83D\uDCCB Copy script</button></div>" +
      "<p class='teach-note'>" + EH.teach.intro + "</p>" +
      secs.map(s => "<h4>" + s.h + "</h4>" + s.html).join("");
    $("#teachCopy").addEventListener("click", () => {
      const b = $("#teachCopy"), t = b.textContent;
      navigator.clipboard.writeText(EH._teachText || "").then(
        () => { b.textContent = "\u2713 Script copied"; setTimeout(() => { b.textContent = t; }, 1600); },
        () => { b.textContent = "Copy failed"; setTimeout(() => { b.textContent = t; }, 1600); });
    });
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
