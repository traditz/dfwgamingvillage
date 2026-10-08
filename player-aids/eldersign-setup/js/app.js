/* =============================================================================
   Elder Sign — Setup & Reference Utility · app logic
   Renders the configurator (sets, mode, players, modules), the filtered
   setup sequence and the reference sections, and registers the rulebook search
   (rendered by js/search-widget.js).
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

  /* ---- rulebook search: rendered by js/search-widget.js (search standard v1) ---- */
  /* Each document belongs to a set; the FAQ (and any unlisted document) counts as base, so it and the
     Rules of Play are always searched, and an expansion's rules only when that set is selected. */
  const bookOfSet = { base: "base", faq: "base", uf: "uf", goa: "goa", ooi: "ooi", gc: "gc", ootd: "ootd", ootp: "ootp" };
  window.AID_SEARCH = {
    index: ES.rulesIndex,
    visible: (x, c) => {
      const s = bookOfSet[x] || "base";
      return s === "base" || c.has(s);
    },
    label: (pg) => (pg.x === "gc" ? { loc: "card " + pg.p + "/5" } : {}),
    hint: () => "Search this page, the Rules of Play, the FAQ and the selected expansions' rulebooks. Type a word, a phrase or a question.",
    noMatch: () => "No matches on this page, in the Rules of Play, the FAQ or the selected expansions' rulebooks."
  };

  /* ---- master update ---- */

  function renderTeach(c) {
    const box = $("#teach");
    if (!box || !ES.teach) return;
    const secs = ES.teach.sections
      .filter(s => !s.when || s.when(c))
      .map(s => ({ h: (typeof s.h === "function" ? s.h(c) : s.h), html: (typeof s.body === "function" ? s.body(c) : s.body) }))
      .filter(s => s.html);
    ES._teachText = secs.map(s =>
      s.h.toUpperCase() + "\n" +
      s.html.replace(/<li>/g, "\u2022 ").replace(/<\/p>\s*<p>/g, "\n\n")
            .replace(/<[^>]+>/g, "").replace(/\n{3,}/g, "\n\n").trim()
    ).join("\n\n");
    box.innerHTML = "<div class='teach-top'><h3>\uD83D\uDCD6 Teaching Script \u2014 this setup</h3><button type='button' class='teach-copy' id='teachCopy'>\uD83D\uDCCB Copy script</button></div>" +
      "<p class='teach-note'>" + ES.teach.intro + "</p>" +
      secs.map(s => "<h4>" + s.h + "</h4>" + s.html).join("");
    $("#teachCopy").addEventListener("click", () => {
      const b = $("#teachCopy"), t = b.textContent;
      navigator.clipboard.writeText(ES._teachText || "").then(
        () => { b.textContent = "\u2713 Script copied"; setTimeout(() => { b.textContent = t; }, 1600); },
        () => { b.textContent = "Copy failed"; setTimeout(() => { b.textContent = t; }, 1600); });
    });
  }

  function update() {
    normalize();
    const c = ctx();
    renderExpansions();
    renderModes();
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
