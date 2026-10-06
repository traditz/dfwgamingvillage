/* =============================================================================
   Twilight Imperium 2nd Edition — Setup & Reference Utility · app logic
   ============================================================================= */
(function () {
  "use strict";

  const state = {
    exps: new Set(["core"]),
    players: 6,
    galaxy: "std",
    mods: new Set()
  };
  const openRefs = new Set();   // reference sections the reader has opened (kept across re-renders)
  let refInit = false;

  const ctx = () => ({
    has: (id) => state.exps.has(id),
    p: state.players,
    mod: (id) => state.mods.has(id),
    galaxy: state.galaxy,
    big: state.galaxy !== "std"
  });

  const $ = (s) => document.querySelector(s);
  const el = (tag, cls, html) => {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (html !== undefined) n.innerHTML = html;
    return n;
  };
  const resolve = (v, c) => (typeof v === "function" ? v(c) : v);
  const PLAYERS = [2, 3, 4, 5, 6];   // two to six players (Rules p.3–5 §4.0–6.0)

  // A module is available when its set is in play and any module it builds on is on
  // (Face-down Leaders is an option of the Leaders rule — Hope's End p.3 §2.3).
  function modAvailable(mod) {
    if (!state.exps.has(mod.requires)) return false;
    if (mod.needs && !state.mods.has(mod.needs)) return false;
    return true;
  }
  // The Hope's End constellations need the expansion, and the sheet recommends them only for 6 players
  // (each shows six home systems) — Hope's End p.2.
  function galaxyAvailable(g) {
    return !g.requires || state.exps.has(g.requires);
  }

  function normalize() {
    state.exps.add("core");
    if (state.players < 2) state.players = 2;
    if (state.players > 6) state.players = 6;
    let changed = true;
    while (changed) {            // repeat: "needs" chains (face-down Leaders needs Leaders)
      changed = false;
      for (const mod of T2.modules) {
        if (state.mods.has(mod.id) && !modAvailable(mod)) { state.mods.delete(mod.id); changed = true; }
      }
    }
    const g = T2.galaxies.find(x => x.id === state.galaxy);
    if (!g || !galaxyAvailable(g)) state.galaxy = "std";
    if (state.galaxy !== "std" && state.players !== 6) state.galaxy = "std";
  }

  function renderExpansions() {
    const box = $("#expansions");
    box.innerHTML = "";
    for (const e of T2.expansions) {
      const locked = e.id === "core";
      const on = state.exps.has(e.id);
      const b = el("button", "chip" + (on ? " on" : "") + (locked ? " lock" : ""));
      b.type = "button";
      b.setAttribute("aria-pressed", on ? "true" : "false");
      b.innerHTML = "<b>" + e.short + "</b><span>" + e.year + (locked ? " · always in play" : "") + "</span>";
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
    for (const i of PLAYERS) {
      const on = state.players === i;
      const b = el("button", "pbtn" + (on ? " on" : ""), String(i));
      b.type = "button";
      b.setAttribute("aria-pressed", on ? "true" : "false");
      b.setAttribute("aria-label", i + " players");
      b.addEventListener("click", () => {
        state.players = i;
        if (i !== 6) state.galaxy = "std";      // the larger galaxies are for six players
        update();
      });
      box.appendChild(b);
    }
  }

  function renderGalaxies() {
    const box = $("#modes");
    box.innerHTML = "";
    for (const g of T2.galaxies) {
      const ok = galaxyAvailable(g);
      const on = state.galaxy === g.id;
      const b = el("button", "mode-btn" + (on ? " on" : "") + (ok ? "" : " off"));
      b.type = "button";
      b.setAttribute("aria-pressed", on ? "true" : "false");
      b.innerHTML = "<b>" + g.name + "</b><span>" + g.blurb + "</span>";
      if (ok) {
        b.title = g.blurb + " (" + g.src + ")";
        b.addEventListener("click", () => {
          state.galaxy = g.id;
          if (g.id !== "std") state.players = 6;
          update();
        });
      } else {
        b.disabled = true;
        b.title = "Needs the Hope's End expansion (" + g.src + ")";
      }
      box.appendChild(b);
    }
  }

  function renderModules() {
    const box = $("#modules");
    box.innerHTML = "";
    let shown = 0;
    for (const mod of T2.modules) {
      if (!modAvailable(mod)) continue;
      shown++;
      const on = state.mods.has(mod.id);
      const b = el("button", "mod" + (on ? " on" : ""));
      b.type = "button";
      b.setAttribute("aria-pressed", on ? "true" : "false");
      b.innerHTML = "<span class='mod-name'>" + mod.name + "</span><span class='mod-sum'>" + mod.summary + "</span>";
      b.title = mod.description + " (" + mod.src + ")";
      b.addEventListener("click", () => {
        state.mods.has(mod.id) ? state.mods.delete(mod.id) : state.mods.add(mod.id);
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
    for (const phase of T2.phases) {
      const steps = phase.steps.filter(s => s.when(c));
      if (!steps.length) continue;
      const ph = el("div", "phase");
      ph.appendChild(el("h3", "phase-title", phase.title));
      for (const s of steps) {
        n++;
        const exp = resolve(s.exp, c);
        const meta = T2.expMeta[exp] || T2.expMeta.core;
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
    for (const sec of T2.reference) {
      if (!sec.when(c)) continue;
      if (!refInit && sec.open) openRefs.add(sec.title);
      const d = el("details", "ref");
      if (openRefs.has(sec.title)) d.open = true;
      d.appendChild(el("summary", null, sec.title));
      const body = el("div", "ref-body", resolve(sec.html, c));
      if (sec.src) body.appendChild(el("div", "src-line", resolve(sec.src, c)));
      d.appendChild(body);
      d.addEventListener("toggle", () => { d.open ? openRefs.add(sec.title) : openRefs.delete(sec.title); });
      out.appendChild(d);
    }
    refInit = true;
  }

  function docVisible(x, c) {
    return x === "he" ? c.has("he") : true;   // rules, faq
  }

  /* Rulebook search: rendered by js/search-widget.js (search standard v1). */
  window.AID_SEARCH = {
    index: T2.rulesIndex,
    visible: docVisible,
    hint: (c) => "Search this page, " +
      (c.has("he") ? "the rulebook, the FAQ and the Hope's End rules" : "the rulebook and the FAQ") +
      ". Type a word, a phrase or a question.",
    noMatch: () => "No matches on this page or in the selected sets’ documents."
  };

  function renderTeach(c) {
    const box = $("#teach");
    if (!box || !T2.teach) return;
    const secs = T2.teach.sections
      .filter(s => !s.when || s.when(c))
      .map(s => ({ h: resolve(s.h, c), html: resolve(s.body, c) }))
      .filter(s => s.html);
    T2._teachText = secs.map(s =>
      s.h.toUpperCase() + "\n" +
      s.html.replace(/<li>/g, "• ").replace(/<\/li>/g, "\n").replace(/<\/p>\s*<p>/g, "\n\n")
            .replace(/<[^>]+>/g, "").replace(/\n{3,}/g, "\n\n").trim()
    ).join("\n\n");
    box.innerHTML = "<div class='teach-top'><h3>📖 Teaching Script — this setup</h3><button type='button' class='teach-copy' id='teachCopy'>📋 Copy script</button></div>" +
      "<p class='teach-note'>" + T2.teach.intro + "</p>" +
      secs.map(s => "<h4>" + s.h + "</h4>" + s.html).join("");
    $("#teachCopy").addEventListener("click", () => {
      const b = $("#teachCopy"), t = b.textContent;
      const done = (msg) => { b.textContent = msg; setTimeout(() => { b.textContent = t; }, 1600); };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(T2._teachText || "").then(() => done("✓ Script copied"), () => done("Copy failed"));
      } else done("Copy failed");
    });
  }

  function update() {
    normalize();
    const c = ctx();
    renderExpansions();
    renderPlayers();
    renderGalaxies();
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
