/* =============================================================================
   Sid Meier's Civilization: The Board Game — Setup & Reference Utility · app logic
   Configuration state, normalisation and the context object live in data.js
   (CV.defaultState / CV.normalize / CV.ctx) so the Node harness uses the same rules.
   ============================================================================= */
(function () {
  "use strict";

  const state = CV.defaultState();

  const $ = (s) => document.querySelector(s);
  const el = (tag, cls, html) => {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (html !== undefined) n.innerHTML = html;
    return n;
  };
  const resolve = (v, c) => (typeof v === "function" ? v(c) : v);
  const setName = (id) => (CV.expansions.find(e => e.id === id) || {}).short || id;

  function renderExpansions() {
    const box = $("#expansions");
    box.innerHTML = "";
    for (const e of CV.expansions) {
      const locked = e.id === "core";
      const on = state.exps.has(e.id);
      const b = el("button", "chip" + (on ? " on" : "") + (locked ? " lock" : ""));
      b.type = "button";
      b.setAttribute("aria-pressed", on ? "true" : "false");
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
    const [lo, hi] = CV.playerRange(state);
    for (let i = 2; i <= 5; i++) {
      const ok = i >= lo && i <= hi;
      const b = el("button", "pbtn" + (state.players === i ? " on" : "") + (ok ? "" : " off"), String(i));
      b.type = "button";
      b.setAttribute("aria-pressed", state.players === i ? "true" : "false");
      b.setAttribute("aria-label", i + " players");
      if (ok) b.addEventListener("click", () => { state.players = i; update(); });
      else { b.disabled = true; b.title = "5 players needs the Fame and Fortune expansion"; }
      box.appendChild(b);
    }
  }

  function renderCivs() {
    const box = $("#civs");
    box.innerHTML = "";
    const full = state.civs.size >= state.players;
    for (const e of CV.expansions) {
      if (!state.exps.has(e.id)) continue;
      const grp = el("div", "civ-group");
      grp.appendChild(el("div", "civ-set", e.short));
      const row = el("div", "civ-row");
      for (const v of CV.civs.filter(x => x.set === e.id)) {
        const on = state.civs.has(v.id);
        const avail = CV.civAvailable(state, v.id);
        const blocked = !on && (!avail || full);
        const b = el("button", "civ" + (on ? " on" : "") + (blocked ? " off" : ""), v.name);
        b.type = "button";
        b.setAttribute("aria-pressed", on ? "true" : "false");
        if (!avail) { b.disabled = true; b.title = "Returned to the box in the learning game (Core p.8)"; }
        else if (blocked) { b.title = "Every seat already has a civilization — deselect one first"; b.setAttribute("aria-disabled", "true"); }
        else b.title = on ? "Selected — click to return this seat to a random draw" : "Select " + v.name + " for one seat";
        if (avail) b.addEventListener("click", () => {
          if (state.civs.has(v.id)) state.civs.delete(v.id);
          else if (state.civs.size < state.players) state.civs.add(v.id);
          update();
        });
        row.appendChild(b);
      }
      grp.appendChild(row);
      box.appendChild(grp);
    }
    const n = state.civs.size, p = state.players;
    $("#civ-hint").textContent = "(" + n + " of " + p + " chosen" + (n < p ? " — the other " + (p - n === 1 ? "seat draws" : (p - n) + " seats draw") + " at random, Core p.8" : "") + ")";
  }

  function renderModules() {
    const box = $("#modules");
    box.innerHTML = "";
    let shown = 0;
    for (const m of CV.modules) {
      if (!CV.modAvailable(state, m)) continue;
      shown++;
      const on = state.mods.has(m.id);
      const forced = m.id === "invest" && state.civs.has("arabia");
      const b = el("button", "mod" + (on ? " on" : "") + (forced ? " lock" : ""));
      b.type = "button";
      b.setAttribute("aria-pressed", on ? "true" : "false");
      b.innerHTML = "<span class='mod-name'>" + m.name + "<span class='mod-set'>" + (m.requires === "core" ? m.set : setName(m.requires) + " · " + m.set) + "</span></span><span class='mod-sum'>" + m.summary + "</span>";
      b.title = forced ? "Required while the Arabs are in play (F&F p.13)" : m.description + " (" + m.src + ")";
      if (!forced) b.addEventListener("click", () => {
        state.mods.has(m.id) ? state.mods.delete(m.id) : state.mods.add(m.id);
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
    for (const phase of CV.phases) {
      const steps = phase.steps.filter(s => s.when(c));
      if (!steps.length) continue;
      const ph = el("div", "phase");
      ph.appendChild(el("h3", "phase-title", phase.title));
      for (const s of steps) {
        n++;
        const exp = resolve(s.exp, c);
        const meta = CV.expMeta[exp] || CV.expMeta.core;
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
    const open = new Set([...out.querySelectorAll("details.ref[open] > summary")].map(s => s.textContent));
    out.innerHTML = "";
    for (const sec of CV.reference) {
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

  /* which rulebook pages the search may show for this configuration */
  function docVisible(x, c) {
    switch (x) {
      case "ff": return c.has("ff");
      case "ww": return c.has("ww");
      default: return true;   // core, faq
    }
  }

  /* Rulebook search: rendered by js/search-widget.js (search standard v1.1).
     js/rules.js supplies CV.rulesIndex: one entry per printed page of the core rulebook, Fame and Fortune,
     Wisdom and Warfare and the FAQ v2.0; docVisible shows each expansion's pages only when that set is owned. */
  window.AID_SEARCH = {
    index: CV.rulesIndex,
    visible: docVisible,
    testQueries: ["blockade", "metropolis", "social policy", "can a scout enter a relic square?"],
    hint: (c) => "Search this page, the core rulebook" + (c.has("ff") ? ", Fame and Fortune" : "") + (c.has("ww") ? ", Wisdom and Warfare" : "") +
      " and the FAQ v2.0. Type a word, a phrase or a question.",
    noMatch: () => "No matches on this page or in the documents for this setup."
  };

  function renderTeach(c) {
    const box = $("#teach");
    if (!box || !CV.teach) return;
    const secs = CV.teach.sections
      .filter(s => !s.when || s.when(c))
      .map(s => ({ h: resolve(s.h, c), html: resolve(s.body, c) }))
      .filter(s => s.html);
    CV._teachText = secs.map(s =>
      s.h.toUpperCase() + "\n" +
      s.html.replace(/<li>/g, "• ").replace(/<\/li>/g, "\n").replace(/<\/p>\s*<p>/g, "\n\n")
            .replace(/<\/p>\s*<ul>/g, "\n").replace(/<[^>]+>/g, "").replace(/\n{3,}/g, "\n\n").trim()
    ).join("\n\n");
    box.innerHTML = "<div class='teach-top'><h3>📖 Teaching Script — this setup</h3><button type='button' class='teach-copy' id='teachCopy'>📋 Copy script</button></div>" +
      "<p class='teach-note'>" + CV.teach.intro + "</p>" +
      secs.map(s => "<h4>" + s.h + "</h4>" + s.html).join("");
    $("#teachCopy").addEventListener("click", () => {
      const b = $("#teachCopy"), t = b.textContent;
      const done = (msg) => { b.textContent = msg; setTimeout(() => { b.textContent = t; }, 1600); };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(CV._teachText || "").then(() => done("✓ Script copied"), () => done("Copy failed"));
      } else done("Copy failed");
    });
  }

  function update() {
    CV.normalize(state);
    const c = CV.ctx(state);
    renderExpansions();
    renderPlayers();
    renderCivs();
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
