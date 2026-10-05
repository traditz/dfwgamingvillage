/* =============================================================================
   Star Wars: Rebellion — Setup & Reference Utility · app logic
   ============================================================================= */
(function () {
  "use strict";

  const state = {
    exps: new Set(["base"]),
    mode: "std",          // "first" (Learn to Play first-game setup) | "std" (Rules Reference complete setup)
    players: 2,
    mods: new Set()
  };

  const ctx = () => ({
    has: (id) => state.exps.has(id),
    mode: state.mode,
    first: state.mode === "first",
    p: state.players,
    team: state.players >= 3,
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

  // Compatibility rules from the books:
  //  - Rise of the Empire's setup changes are written against the Rules Reference's complete setup (RotE p.1:
  //    "changes to setup (page 15 of the Rules Reference)"; its starting units replace parts II and III of step 8),
  //    so the Learn to Play first-game setup is base game only.
  //  - The expansion's options exist only with the expansion.
  function normalize() {
    state.exps.add("base");
    if (state.exps.has("rote") && state.mode === "first") state.mode = "std";
    for (const mod of SWR.modules) {
      if (state.mods.has(mod.id) && !state.exps.has(mod.requires)) state.mods.delete(mod.id);
    }
    if (state.players < 2) state.players = 2;
    if (state.players > 4) state.players = 4;
  }

  function renderExpansions() {
    const box = $("#expansions");
    box.innerHTML = "";
    for (const e of SWR.expansions) {
      const locked = e.id === "base";
      const on = state.exps.has(e.id);
      const b = el("button", "chip" + (on ? " on" : "") + (locked ? " lock" : ""));
      b.type = "button";
      b.setAttribute("aria-pressed", on ? "true" : "false");
      b.innerHTML = "<b>" + e.short + "</b><span>" + e.year + (locked ? " · always in play" : "") + "</span>";
      b.title = e.blurb;
      if (locked) b.setAttribute("aria-disabled", "true");
      else b.addEventListener("click", () => {
        if (state.exps.has(e.id)) state.exps.delete(e.id);
        else {
          state.exps.add(e.id);
          if (e.id === "rote" && state.mode === "first") state.mode = "std";
        }
        update();
      });
      box.appendChild(b);
    }
  }

  function renderModes() {
    const box = $("#modes");
    box.innerHTML = "";
    for (const m of SWR.modes) {
      const on = state.mode === m.id;
      const b = el("button", "mode-btn" + (on ? " on" : ""));
      b.type = "button";
      b.setAttribute("aria-pressed", on ? "true" : "false");
      const note = (m.id === "first" && state.exps.has("rote")) ? "<em class='mode-warn'>Selecting this turns off Rise of the Empire.</em>" : "";
      b.innerHTML = "<b>" + m.name + "</b><span>" + m.blurb + "</span>" + note;
      b.addEventListener("click", () => {
        state.mode = m.id;
        if (m.id === "first") state.exps.delete("rote");
        update();
      });
      box.appendChild(b);
    }
  }

  function renderPlayers() {
    const box = $("#players");
    box.innerHTML = "";
    for (const pl of SWR.players) {
      const on = state.players === pl.n;
      const b = el("button", "pbtn" + (on ? " on" : ""));
      b.type = "button";
      b.setAttribute("aria-pressed", on ? "true" : "false");
      b.setAttribute("aria-label", pl.n + " players: " + pl.label);
      b.title = pl.label;
      b.innerHTML = "<b>" + pl.n + "</b><span>" + pl.label + "</span>";
      b.addEventListener("click", () => { state.players = pl.n; update(); });
      box.appendChild(b);
    }
  }

  function modAvailable(mod) {
    return state.exps.has(mod.requires);
  }

  function renderModules() {
    const box = $("#modules");
    box.innerHTML = "";
    let shown = 0;
    for (const mod of SWR.modules) {
      if (!modAvailable(mod)) continue;
      shown++;
      const on = state.mods.has(mod.id);
      const b = el("button", "mod" + (on ? " on" : ""));
      b.type = "button";
      b.setAttribute("aria-pressed", on ? "true" : "false");
      b.innerHTML = "<span class='mod-name'>" + mod.name + "</span><span class='mod-sum'>" + mod.summary + "</span>";
      b.title = mod.description + " (" + mod.src + ")";
      b.addEventListener("click", () => {
        if (on) state.mods.delete(mod.id); else state.mods.add(mod.id);
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
    for (const phase of SWR.phases) {
      const steps = phase.steps.filter(s => s.when(c));
      if (!steps.length) continue;
      const ph = el("div", "phase");
      ph.appendChild(el("h3", "phase-title", phase.title));
      for (const s of steps) {
        n++;
        const exp = resolve(s.exp, c);
        const meta = SWR.expMeta[exp] || SWR.expMeta.base;
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
    for (const sec of SWR.reference) {
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

  function docVisible(x, c) {
    switch (x) {
      case "rote":
      case "faqrote": return c.has("rote");    // RotE rulesheet; FAQ pp.6–8 (its Rise of the Empire section)
      case "faqbase": return !c.has("rote");   // the general rulings on FAQ pp.7–8, which also apply without it
      default: return true; // ltp, rr, faq
    }
  }

  function doSearch() {
    const fold = (s) => s.replace(/[\u2018\u2019\u02BC]/g, "'").replace(/[\u201C\u201D]/g, "\"");   // curly quotes match straight ones
    const q = fold($("#rsearch").value.trim().toLowerCase());
    const out = $("#rresults");
    out.innerHTML = "";
    if (q.length < 3) {
      out.innerHTML = "<p class='rhint'>Type at least 3 characters to search the Learn to Play, the Rules Reference, the FAQ" + (state.exps.has("rote") ? " and the Rise of the Empire rulesheet" : "") + ".</p>";
      return;
    }
    const c = ctx();
    const hits = [];
    for (const pg of SWR.rulesIndex) {
      if (!docVisible(pg.x, c)) continue;
      const t = fold(pg.t.toLowerCase());
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
      snip = snip.replace(/&/g, "&amp;").replace(/</g, "&lt;");
      const rx = new RegExp("(" + q.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/[.*+?^${}()|[\]\\]/g, "\\$&").replace(/'/g, "['\u2018\u2019\u02BC]").replace(/"/g, "[\"\u201C\u201D]") + ")", "ig");
      snip = snip.replace(rx, "<mark>$1</mark>");
      const hit = el("div", "rhit");
      hit.appendChild(el("div", "rhit-src", pg.b + " — p." + pg.p));
      hit.appendChild(el("div", "rhit-text", snip));
      out.appendChild(hit);
    }
  }

  function renderTeach(c) {
    const box = $("#teach");
    if (!box || !SWR.teach) return;
    const secs = SWR.teach.sections
      .filter(s => !s.when || s.when(c))
      .map(s => ({ h: (typeof s.h === "function" ? s.h(c) : s.h), html: (typeof s.body === "function" ? s.body(c) : s.body) }))
      .filter(s => s.html);
    SWR._teachText = secs.map(s =>
      s.h.toUpperCase() + "\n" +
      s.html.replace(/<li>/g, "• ").replace(/<\/li>/g, "\n").replace(/<\/p>\s*<p>/g, "\n\n")
            .replace(/<[^>]+>/g, "").replace(/&amp;/g, "&").replace(/\n{3,}/g, "\n\n").trim()
    ).join("\n\n");
    box.innerHTML = "<div class='teach-top'><h3>📖 Teaching Script — this setup</h3><button type='button' class='teach-copy' id='teachCopy'>📋 Copy script</button></div>" +
      "<p class='teach-note'>" + SWR.teach.intro + "</p>" +
      secs.map(s => "<h4>" + s.h + "</h4>" + s.html).join("");
    $("#teachCopy").addEventListener("click", () => {
      const b = $("#teachCopy"), t = b.textContent;
      navigator.clipboard.writeText(SWR._teachText || "").then(
        () => { b.textContent = "✓ Script copied"; setTimeout(() => { b.textContent = t; }, 1600); },
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
    doSearch();
    document.dispatchEvent(new CustomEvent("aid:config", { detail: c }));   // components glossary (js/comp-widget.js)
  }

  document.addEventListener("DOMContentLoaded", () => {
    $("#rsearch").addEventListener("input", doSearch);
    $("#teachBtn").addEventListener("click", () => {
      const p = $("#teach");
      p.hidden = !p.hidden;
      $("#teachBtn").setAttribute("aria-expanded", p.hidden ? "false" : "true");
      if (!p.hidden) p.scrollIntoView({ behavior: "smooth", block: "start" });
    });
    update();
  });
})();
