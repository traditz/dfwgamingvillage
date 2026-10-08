/* =============================================================================
   Runewars (Revised Edition) — Setup & Reference Utility · app logic
   Configurator: your copy (Revised Edition / original edition + Revised Gameplay sheet), sets (Banners of War),
   factions at the table (2–4; the player count follows), and variants (Exploration Tokens; Banners of War's
   Development Cards, Commanders of the Battlefield, Rise of the Free Cities — Road to Victory is shown locked on,
   because the Revised rulebook p.30 makes Victory cards mandatory).
   ============================================================================= */
(function () {
  "use strict";

  const state = {
    copy: "rev",
    exps: new Set(["core"]),
    facs: new Set(RW.factions.map(f => f.id)),
    mods: new Set()
  };

  const ctx = () => {
    const facs = RW.factions.filter(f => state.facs.has(f.id));
    return {
      has: (id) => state.exps.has(id),
      mod: (id) => state.mods.has(id),
      fac: (id) => state.facs.has(id),
      facs: facs,
      p: facs.length,
      copy: state.copy,
      orig: state.copy === "orig",
      mode: state.copy
    };
  };

  const $ = (s) => document.querySelector(s);
  const el = (tag, cls, html) => {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (html !== undefined) n.innerHTML = html;
    return n;
  };
  const resolve = (v, c) => (typeof v === "function" ? v(c) : v);

  function modAvailable(mod) {
    return state.exps.has(mod.requires);
  }

  function normalize() {
    state.exps.add("core");
    if (state.facs.size < 2) RW.factions.forEach(f => { if (state.facs.size < 2) state.facs.add(f.id); });
    for (const mod of RW.modules) {
      if (mod.locked) { state.mods.delete(mod.id); continue; }       // display-only
      if (state.mods.has(mod.id) && !modAvailable(mod)) state.mods.delete(mod.id);
    }
  }

  function renderCopies() {
    const box = $("#modes");
    box.innerHTML = "";
    for (const m of RW.copies) {
      const on = state.copy === m.id;
      const b = el("button", "mode-btn" + (on ? " on" : ""));
      b.type = "button";
      b.setAttribute("aria-pressed", on ? "true" : "false");
      b.innerHTML = "<b>" + m.name + "</b><span>" + m.blurb + "</span>";
      b.addEventListener("click", () => { state.copy = m.id; update(); });
      box.appendChild(b);
    }
  }

  function renderExpansions() {
    const box = $("#expansions");
    box.innerHTML = "";
    for (const e of RW.expansions) {
      const locked = e.id === "core";
      const on = state.exps.has(e.id);
      const b = el("button", "chip" + (on ? " on" : "") + (locked ? " lock" : ""));
      b.type = "button";
      b.setAttribute("aria-pressed", on ? "true" : "false");
      if (locked) b.setAttribute("aria-disabled", "true");
      b.innerHTML = "<b>" + e.short + "</b><span>" + e.year + "</span>";
      b.title = e.blurb;
      if (!locked) b.addEventListener("click", () => {
        state.exps.has(e.id) ? state.exps.delete(e.id) : state.exps.add(e.id);
        update();
      });
      box.appendChild(b);
    }
  }

  function renderFactions() {
    const box = $("#factions");
    box.innerHTML = "";
    for (const f of RW.factions) {
      const on = state.facs.has(f.id);
      const pinned = on && state.facs.size <= 2;        // two players minimum (Rules p.4)
      const b = el("button", "chip fac fac-" + f.color + (on ? " on" : "") + (pinned ? " pinned" : ""));
      b.type = "button";
      b.setAttribute("aria-pressed", on ? "true" : "false");
      b.innerHTML = "<b>" + f.name + "</b><span>" + f.color + "</span>";
      b.title = pinned ? "Runewars needs at least two players" : (on ? "Remove " : "Add ") + f.name;
      b.addEventListener("click", () => {
        if (on && state.facs.size <= 2) return;
        on ? state.facs.delete(f.id) : state.facs.add(f.id);
        update();
      });
      box.appendChild(b);
    }
    const n = state.facs.size;
    $("#pcount").textContent = n + " players";
  }

  function renderModules() {
    const box = $("#modules");
    box.innerHTML = "";
    let shown = 0;
    for (const mod of RW.modules) {
      if (!modAvailable(mod)) continue;
      shown++;
      const on = mod.locked || state.mods.has(mod.id);
      const b = el("button", "mod" + (on ? " on" : "") + (mod.locked ? " lock" : ""));
      b.type = "button";
      b.setAttribute("aria-pressed", on ? "true" : "false");
      if (mod.locked) b.setAttribute("aria-disabled", "true");
      b.innerHTML = "<span class='mod-name'>" + mod.name + (mod.requires === "bow" ? " <i class='mod-set'>Banners of War</i>" : "") + "</span><span class='mod-sum'>" + mod.summary + "</span>";
      b.title = mod.description + " (" + mod.src + ")";
      if (!mod.locked) b.addEventListener("click", () => {
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
    for (const phase of RW.phases) {
      const steps = phase.steps.filter(s => s.when(c));
      if (!steps.length) continue;
      const ph = el("div", "phase");
      ph.appendChild(el("h3", "phase-title", phase.title));
      for (const s of steps) {
        n++;
        const exp = resolve(s.exp, c);
        const meta = RW.expMeta[exp] || RW.expMeta.core;
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
    const open = new Set([...out.querySelectorAll("details[open] > summary")].map(s => s.textContent));
    out.innerHTML = "";
    for (const sec of RW.reference) {
      if (!sec.when(c)) continue;
      const d = el("details", "ref");
      d.appendChild(el("summary", null, sec.title));
      if (open.has(sec.title)) d.open = true;
      const body = el("div", "ref-body", resolve(sec.html, c));
      if (sec.src) body.appendChild(el("div", "src-line", resolve(sec.src, c)));
      d.appendChild(body);
      out.appendChild(d);
    }
  }

  function docVisible(x, c) {
    switch (x) {
      case "bow": return c.has("bow");
      default: return true; // rules, rg (Revised Gameplay), faq
    }
  }

  /* Rulebook search: rendered by js/search-widget.js (search standard v1). */
  window.AID_SEARCH = {
    index: RW.rulesIndex,
    visible: docVisible,
    hint: () => "Search this page, the rulebook, the Revised Gameplay sheet, FAQ 1.2 and — when selected — Banners of War. Type a word, a phrase or a question.",
    noMatch: () => "No matches on this page or in the selected sets' documents."
  };

  function renderTeach(c) {
    const box = $("#teach");
    if (!box || !RW.teach) return;
    const secs = RW.teach.sections
      .filter(s => !s.when || s.when(c))
      .map(s => ({ h: (typeof s.h === "function" ? s.h(c) : s.h), html: (typeof s.body === "function" ? s.body(c) : s.body) }))
      .filter(s => s.html);
    RW._teachText = secs.map(s =>
      s.h.toUpperCase() + "\n" +
      s.html.replace(/<li>/g, "• ").replace(/<\/li>/g, "\n").replace(/<\/p>\s*<p>/g, "\n\n").replace(/<\/p>\s*<ul>/g, "\n")
            .replace(/<[^>]+>/g, "").replace(/&amp;/g, "&").replace(/\n{3,}/g, "\n\n").trim()
    ).join("\n\n");
    box.innerHTML = "<div class='teach-top'><h3>📖 Teaching Script — this setup</h3><button type='button' class='teach-copy' id='teachCopy'>📋 Copy script</button></div>" +
      "<p class='teach-note'>" + RW.teach.intro + "</p>" +
      secs.map(s => "<h4>" + s.h + "</h4>" + s.html).join("");
    $("#teachCopy").addEventListener("click", () => {
      const b = $("#teachCopy"), t = b.textContent;
      navigator.clipboard.writeText(RW._teachText || "").then(
        () => { b.textContent = "✓ Script copied"; setTimeout(() => { b.textContent = t; }, 1600); },
        () => { b.textContent = "Copy failed"; setTimeout(() => { b.textContent = t; }, 1600); });
    });
  }

  function update() {
    normalize();
    const c = ctx();
    renderCopies();
    renderExpansions();
    renderFactions();
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
