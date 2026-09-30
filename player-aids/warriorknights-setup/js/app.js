/* =============================================================================
   Warrior Knights — Setup & Reference Utility · app logic
   ============================================================================= */
(function () {
  "use strict";

  const state = {
    exps: new Set(["base"]),
    players: 4,
    mods: new Set(),      // Crown and Glory variants (fg, mis, king) and optional rules (openpm, heirs, …)
    len: "std"            // game length: std | short | long | long15 (base only)
  };
  const openRefs = new Set();   // reference sections the reader has opened (kept across re-renders)
  let refInit = false;
  const PLAYERS = [2, 3, 4, 5, 6];   // two to six Barons (Rules p.19)

  const ctx = () => ({
    has: (id) => state.exps.has(id),
    p: state.players,
    mod: (id) => state.mods.has(id),
    len: state.len
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
    state.exps.add("base");
    if (state.players < 2) state.players = 2;
    if (state.players > 6) state.players = 6;
    // Crown and Glory variants need the expansion
    for (const mod of WK.modules) {
      if (state.mods.has(mod.id) && !state.exps.has(mod.requires)) state.mods.delete(mod.id);
    }
    // The King has its own three lengths (C&G p.4); the base game has four (Rules p.19)
    const ids = WK.lengths(ctx()).map((l) => l.id);
    if (ids.indexOf(state.len) === -1) state.len = state.len === "long15" ? "long" : "std";
  }

  function renderExpansions() {
    const box = $("#expansions");
    box.innerHTML = "";
    for (const e of WK.expansions) {
      const locked = e.id === "base";
      const on = state.exps.has(e.id);
      const b = el("button", "chip" + (on ? " on" : "") + (locked ? " lock" : ""));
      b.type = "button";
      b.setAttribute("aria-pressed", on ? "true" : "false");
      b.innerHTML = "<b>" + e.short + "</b><span>" + e.year + (locked ? " · always in play" : "") + "</span>";
      b.title = e.blurb;
      if (!locked) b.addEventListener("click", () => {
        if (state.exps.has(e.id)) state.exps.delete(e.id);
        else {
          state.exps.add(e.id);
          // first time the expansion goes on with no variant chosen, start with For Glory (the main variant)
          if (e.id === "cg" && !WK.modules.some((m) => state.mods.has(m.id))) state.mods.add("fg");
        }
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
      b.setAttribute("aria-label", i + " Barons");
      b.addEventListener("click", () => { state.players = i; update(); });
      box.appendChild(b);
    }
  }

  function toggleButton(mod, box) {
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

  function renderModules() {
    const box = $("#modules");
    box.innerHTML = "";
    let shown = 0;
    for (const mod of WK.modules) {
      if (!state.exps.has(mod.requires)) continue;
      shown++;
      toggleButton(mod, box);
    }
    $("#modules-group").style.display = shown ? "" : "none";
  }

  function renderVariants() {
    const box = $("#options");
    box.innerHTML = "";
    for (const v of WK.variants) toggleButton(v, box);
  }

  function renderLengths(c) {
    const box = $("#modes");
    box.innerHTML = "";
    for (const l of WK.lengths(c)) {
      const on = state.len === l.id;
      const b = el("button", "mode-btn" + (on ? " on" : ""));
      b.type = "button";
      b.setAttribute("aria-pressed", on ? "true" : "false");
      b.innerHTML = "<b>" + l.name + "</b><span>" + l.blurb + "</span>";
      b.addEventListener("click", () => { state.len = l.id; update(); });
      box.appendChild(b);
    }
    const hint = $("#len-hint");
    if (hint) hint.textContent = c.mod("might")
      ? "— under Might Is Right the pool no longer ends the game"
      : (WK.king(c) ? "— The King's own lengths (C&G p.4)" : "— the Influence pool's size (Rules p.5, p.19)");
  }

  function renderSetup(c) {
    const out = $("#setup");
    out.innerHTML = "";
    let n = 0;
    for (const phase of WK.phases) {
      const steps = phase.steps.filter((s) => s.when(c));
      if (!steps.length) continue;
      const ph = el("div", "phase");
      ph.appendChild(el("h3", "phase-title", phase.title));
      for (const s of steps) {
        n++;
        const exp = resolve(s.exp, c);
        const meta = WK.expMeta[exp] || WK.expMeta.base;
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
    for (const sec of WK.reference) {
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
    switch (x) {
      case "cg": return c.has("cg");
      default: return true; // rules, faq
    }
  }

  function doSearch() {
    const fold = (s) => s.replace(/[‘’ʼ]/g, "'").replace(/[“”]/g, "\"");   // curly quotes match straight ones
    const q = fold($("#rsearch").value.trim().toLowerCase());
    const out = $("#rresults");
    out.innerHTML = "";
    if (q.length < 3) {
      out.innerHTML = "<p class='rhint'>Type at least 3 characters to search the rulebook, the FAQ" +
        (state.exps.has("cg") ? " and the Crown and Glory rules" : "") + ".</p>";
      return;
    }
    const c = ctx();
    const hits = [];
    for (const pg of WK.rulesIndex) {
      if (!docVisible(pg.x, c)) continue;
      const t = fold(pg.t.toLowerCase());
      const idx = t.indexOf(q);
      if (idx === -1) continue;
      hits.push({ pg, idx });
      if (hits.length >= 40) break;
    }
    if (!hits.length) {
      out.innerHTML = "<p class='rhint'>No matches in the selected sets’ documents.</p>";
      return;
    }
    const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    const highlight = (raw) => {
      const lower = fold(raw.toLowerCase());
      let html = "", i = 0, j;
      while ((j = lower.indexOf(q, i)) !== -1) {
        html += esc(raw.slice(i, j)) + "<mark>" + esc(raw.slice(j, j + q.length)) + "</mark>";
        i = j + q.length;
      }
      return html + esc(raw.slice(i));
    };
    for (const { pg, idx } of hits) {
      const start = Math.max(0, idx - 130);
      const end = Math.min(pg.t.length, idx + q.length + 200);
      const snip = (start > 0 ? "…" : "") + highlight(pg.t.slice(start, end)) + (end < pg.t.length ? "…" : "");
      const hit = el("div", "rhit");
      hit.appendChild(el("div", "rhit-src", esc(pg.b) + " — p." + pg.p));
      hit.appendChild(el("div", "rhit-text", snip));
      out.appendChild(hit);
    }
  }

  function renderTeach(c) {
    const box = $("#teach");
    if (!box || !WK.teach) return;
    const secs = WK.teach.sections
      .filter((s) => !s.when || s.when(c))
      .map((s) => ({ h: (typeof s.h === "function" ? s.h(c) : s.h), html: (typeof s.body === "function" ? s.body(c) : s.body) }))
      .filter((s) => s.html);
    WK._teachText = secs.map((s) =>
      s.h.toUpperCase() + "\n" +
      s.html.replace(/<li>/g, "• ").replace(/<\/li>/g, "\n").replace(/<\/p>\s*<p>/g, "\n\n")
            .replace(/<[^>]+>/g, "").replace(/&amp;/g, "&").replace(/\n{3,}/g, "\n\n").trim()
    ).join("\n\n");
    box.innerHTML = "<div class='teach-top'><h3>📖 Teaching Script — this setup</h3><button type='button' class='teach-copy' id='teachCopy'>📋 Copy script</button></div>" +
      "<p class='teach-note'>" + WK.teach.intro + "</p>" +
      secs.map((s) => "<h4>" + s.h + "</h4>" + s.html).join("");
    $("#teachCopy").addEventListener("click", () => {
      const b = $("#teachCopy"), t = b.textContent;
      const done = (msg) => { b.textContent = msg; setTimeout(() => { b.textContent = t; }, 1600); };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(WK._teachText || "").then(() => done("✓ Script copied"), () => done("Copy failed"));
      } else done("Copy failed");
    });
  }

  function update() {
    normalize();
    const c = ctx();
    renderExpansions();
    renderPlayers();
    renderModules();
    renderLengths(c);
    renderVariants();
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
