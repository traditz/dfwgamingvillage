/* =============================================================================
   A Game of Thrones: The Board Game (Second Edition) — Setup & Reference Utility · app logic
   Configuration logic (normalize, context) lives in GT.cfg (js/data.js) so the Node
   harness evaluates exactly what the page renders.
   ============================================================================= */
(function () {
  "use strict";

  const state = {
    sets: new Set(["core"]),
    players: 6,
    houses: [],          // Mother of Dragons: player Houses in the order picked
    opts: new Set()
  };

  const $ = (s) => document.querySelector(s);
  const el = (tag, cls, html) => {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (html !== undefined) n.innerHTML = html;
    return n;
  };
  const resolve = (v, c) => (typeof v === "function" ? v(c) : v);

  function renderExpansions() {
    const box = $("#expansions");
    box.innerHTML = "";
    for (const e of GT.expansions) {
      const locked = e.id === "core";
      const b = el("button", "chip" + (state.sets.has(e.id) ? " on" : "") + (locked ? " lock" : ""));
      b.type = "button";
      b.setAttribute("aria-pressed", state.sets.has(e.id) ? "true" : "false");
      b.innerHTML = "<b>" + e.short + "</b><span>" + e.year + "</span>";
      b.title = e.blurb;
      if (!locked) b.addEventListener("click", () => {
        state.sets.has(e.id) ? state.sets.delete(e.id) : state.sets.add(e.id);
        update();
      });
      box.appendChild(b);
    }
  }

  function renderPlayers(c) {
    const box = $("#players");
    box.innerHTML = "";
    $("#players-hint").textContent = GT.ui.playersHint(c);
    const [lo, hi] = GT.cfg.playerRange(state.sets);
    for (let i = 3; i <= 8; i++) {
      const ok = i >= lo && i <= hi;
      const b = el("button", "pbtn" + (state.players === i ? " on" : "") + (ok ? "" : " off"), String(i));
      b.type = "button";
      b.setAttribute("aria-pressed", state.players === i ? "true" : "false");
      if (ok) b.addEventListener("click", () => { state.players = i; update(); });
      else { b.title = GT.ui.playerTitle(i, c); b.setAttribute("aria-disabled", "true"); }
      box.appendChild(b);
    }
  }

  function renderHouses(c) {
    const box = $("#houses");
    box.innerHTML = "";
    $("#houses-hint").textContent = GT.ui.housesHint(c);
    const mod = c.has("mod");
    for (const h of GT.houses) {
      if (h.set === "mod" && !mod) continue;
      const st = GT.ui.houseState(h.id, c);
      const on = c.house(h.id);
      // Mother of Dragons: tap the Houses at the table; the player count follows (GT.cfg.toggleHouse)
      const clickable = mod && GT.cfg.canToggleHouse(state, h.id);
      const b = el("button", "chip house" + (on ? " on" : "") + (st === "Vassal" ? " vassal" : "") + (mod ? "" : (on ? " lock" : " off")));
      b.type = "button";
      b.setAttribute("aria-pressed", on ? "true" : "false");
      b.innerHTML = "<b>" + h.name + "</b><span>" + st + "</span>";
      b.title = GT.ui.houseTitle(h.id, c);
      if (clickable) b.addEventListener("click", () => { GT.cfg.toggleHouse(state, h.id); update(); });
      else b.setAttribute("aria-disabled", "true");
      box.appendChild(b);
    }
    const note = $("#vassal-note");
    note.innerHTML = GT.ui.vassalNote(c);
    note.hidden = !mod;
  }

  function renderModules() {
    const box = $("#modules");
    box.innerHTML = "";
    for (const mod of GT.options) {
      if (mod.requires && !state.sets.has(mod.requires)) continue;
      const on = state.opts.has(mod.id);
      const b = el("button", "mod" + (on ? " on" : ""));
      b.type = "button";
      b.setAttribute("aria-pressed", on ? "true" : "false");
      b.innerHTML = "<span class='mod-name'>" + mod.name + "</span><span class='mod-sum'>" + mod.summary + "</span>";
      b.title = mod.description + " (" + mod.src + ")";
      b.addEventListener("click", () => {
        on ? state.opts.delete(mod.id) : state.opts.add(mod.id);
        update();
      });
      box.appendChild(b);
    }
  }

  function renderSetup(c) {
    const out = $("#setup");
    out.innerHTML = "";
    let n = 0;
    for (const phase of GT.phases) {
      if (phase.when && !phase.when(c)) continue;
      const steps = phase.steps.filter(s => s.when(c));
      if (!steps.length) continue;
      const ph = el("div", "phase");
      ph.appendChild(el("h3", "phase-title", resolve(phase.title, c)));
      for (const s of steps) {
        n++;
        const exp = resolve(s.exp, c);
        const meta = GT.expMeta[exp] || GT.expMeta.core;
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
    for (const sec of GT.reference) {
      if (!sec.when(c)) continue;
      const d = el("details", "ref");
      const title = resolve(sec.title, c);
      if (open.has(title)) d.open = true;
      d.appendChild(el("summary", null, title));
      const body = el("div", "ref-body", resolve(sec.html, c));
      if (sec.src) body.appendChild(el("div", "src-line", resolve(sec.src, c)));
      d.appendChild(body);
      out.appendChild(d);
    }
  }

  /* Documents the rulebook search may show for this configuration */
  function docVisible(x, c) {
    switch (x) {
      case "mod": return c.has("mod");
      default: return true;   // rules, faq
    }
  }

  /* Rulebook search: rendered by js/search-widget.js (search standard v1.1). Index: js/rules.js. */
  const BOOK = { rules: "Rules", mod: "Mother of Dragons (MoD)", faq: "FAQ v2.0" };
  window.AID_SEARCH = {
    index: GT.rulesIndex || [],
    visible: docVisible,
    label: (pg) => ({ book: BOOK[pg.x] || pg.b }),
    precedence: { faq: 2, mod: 1, rules: 0 },   // the newest ruling wins a tie (FAQ v2.0 > Mother of Dragons > Rules)
    testQueries: ["retreat", "messenger raven", "ship transport", "vassal", "loyalty token"],
    hint: (c) => "Search this page, the rulebook" + (c.has("mod") ? ", the Mother of Dragons book" : "") + " and the FAQ v2.0. Type a word, a phrase or a question.",
    noMatch: (c) => "No matches on this page or in the documents for this setup" + (c.has("mod") ? "." : " (the Mother of Dragons book is searched only when that set is selected).")
  };

  function renderTeach(c) {
    const box = $("#teach");
    if (!box || !GT.teach) return;
    const secs = GT.teach.sections
      .filter(s => !s.when || s.when(c))
      .map(s => ({ h: resolve(s.h, c), html: resolve(s.body, c) }))
      .filter(s => s.html);
    GT._teachText = secs.map(s =>
      s.h.toUpperCase() + "\n" +
      s.html.replace(/<li>/g, "• ").replace(/<\/p>\s*<p>/g, "\n\n").replace(/<\/li>\s*/g, "\n")
            .replace(/<[^>]+>/g, "").replace(/&amp;/g, "&").replace(/\n{3,}/g, "\n\n").trim()
    ).join("\n\n");
    box.innerHTML = "<div class='teach-top'><h3>📖 Teaching Script — this setup</h3><button type='button' class='teach-copy' id='teachCopy'>📋 Copy script</button></div>" +
      "<p class='teach-note'>" + GT.teach.intro + "</p>" +
      secs.map(s => "<h4>" + s.h + "</h4>" + s.html).join("");
    $("#teachCopy").addEventListener("click", () => {
      const b = $("#teachCopy"), t = b.textContent;
      navigator.clipboard.writeText(GT._teachText || "").then(
        () => { b.textContent = "✓ Script copied"; setTimeout(() => { b.textContent = t; }, 1600); },
        () => { b.textContent = "Copy failed"; setTimeout(() => { b.textContent = t; }, 1600); });
    });
  }

  function update() {
    GT.cfg.normalize(state);
    const c = GT.cfg.ctx(state);
    renderExpansions();
    renderPlayers(c);
    renderHouses(c);
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
