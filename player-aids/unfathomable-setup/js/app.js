/* =============================================================================
   Unfathomable — Setup & Reference Utility · app logic
   ============================================================================= */
(function () {
  "use strict";

  const state = {
    exps: new Set(["core"]),
    mode: "standard",
    players: 4,
    mods: new Set()
  };
  const openRefs = new Set();   // reference sections the reader has opened (kept across re-renders)
  let refInit = false;

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
  const PLAYERS = [3, 4, 5, 6];   // Unfathomable is for three to six players (Learn to Play p.2)

  function normalize() {
    state.exps.add("core");
    if (state.players < 3) state.players = 3;
    if (state.players > 6) state.players = 6;
    // Drop modules that are no longer available (repeat: "needs" chains, e.g. balance needs preludes)
    let changed = true;
    while (changed) {
      changed = false;
      const c = ctx();
      for (const mod of UF.modules) {
        if (state.mods.has(mod.id) && !UF.modAvailable(mod, c, state.mods)) { state.mods.delete(mod.id); changed = true; }
      }
    }
    // Mutually exclusive pairs: keep the first one listed
    for (const mod of UF.modules) {
      if (state.mods.has(mod.id) && mod.excludes) mod.excludes.forEach(x => state.mods.delete(x));
    }
  }

  function renderExpansions() {
    const box = $("#expansions");
    box.innerHTML = "";
    for (const e of UF.expansions) {
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

  function renderModes() {
    const box = $("#modes");
    box.innerHTML = "";
    for (const m of UF.modes) {
      const on = state.mode === m.id;
      const b = el("button", "mode-btn" + (on ? " on" : ""));
      b.type = "button";
      b.setAttribute("aria-pressed", on ? "true" : "false");
      b.innerHTML = "<b>" + m.name + "</b><span>" + m.blurb + "</span>";
      b.addEventListener("click", () => { state.mode = m.id; update(); });
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
      b.addEventListener("click", () => { state.players = i; update(); });
      box.appendChild(b);
    }
  }

  function renderModules() {
    const box = $("#modules");
    box.innerHTML = "";
    const c = ctx();
    let shown = 0;
    for (const mod of UF.modules) {
      if (!UF.modAvailable(mod, c, state.mods)) continue;
      shown++;
      const on = state.mods.has(mod.id);
      const b = el("button", "mod" + (on ? " on" : ""));
      b.type = "button";
      b.setAttribute("aria-pressed", on ? "true" : "false");
      b.innerHTML = "<span class='mod-name'>" + mod.name + "</span><span class='mod-sum'>" + mod.summary + "</span>";
      b.title = mod.description + " (" + mod.src + ")";
      b.addEventListener("click", () => {
        if (state.mods.has(mod.id)) state.mods.delete(mod.id);
        else {
          if (mod.excludes) mod.excludes.forEach(x => state.mods.delete(x));
          state.mods.add(mod.id);
        }
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
    for (const phase of UF.phases) {
      const steps = phase.steps.filter(s => s.when(c));
      if (!steps.length) continue;
      const ph = el("div", "phase");
      ph.appendChild(el("h3", "phase-title", phase.title));
      for (const s of steps) {
        n++;
        const exp = resolve(s.exp, c);
        const meta = UF.expMeta[exp] || UF.expMeta.core;
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
    for (const sec of UF.reference) {
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
      case "fta":
      case "ufaq-fta": return c.has("fta");
      default: return true; // ltp, rr, ufaq
    }
  }

  function doSearch() {
    const q = $("#rsearch").value.trim().toLowerCase();
    const out = $("#rresults");
    out.innerHTML = "";
    if (q.length < 3) {
      out.innerHTML = "<p class='rhint'>Type at least 3 characters to search the Learn to Play, the Rules Reference" +
        (state.exps.has("fta") ? ", the From the Abyss rulebook" : "") + " and the Unofficial FAQ.</p>";
      return;
    }
    const c = ctx();
    const hits = [];
    for (const pg of UF.rulesIndex) {
      if (!docVisible(pg.x, c)) continue;
      const t = pg.t.toLowerCase();
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
      const lower = raw.toLowerCase();
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
      const hit = el("div", "rhit" + (pg.s === "u" ? " rhit-ufaq" : ""));
      hit.appendChild(el("div", "rhit-src", pg.b + (pg.p ? " — p." + pg.p : (pg.sec ? " — " + pg.sec : ""))));
      hit.appendChild(el("div", "rhit-text", snip));
      out.appendChild(hit);
    }
  }

  function renderTeach(c) {
    const box = $("#teach");
    if (!box || !UF.teach) return;
    const secs = UF.teach.sections
      .filter(s => !s.when || s.when(c))
      .map(s => ({ h: (typeof s.h === "function" ? s.h(c) : s.h), html: (typeof s.body === "function" ? s.body(c) : s.body) }))
      .filter(s => s.html);
    UF._teachText = secs.map(s =>
      s.h.toUpperCase() + "\n" +
      s.html.replace(/<li>/g, "• ").replace(/<\/li>/g, "\n").replace(/<\/p>\s*<p>/g, "\n\n")
            .replace(/<[^>]+>/g, "").replace(/\n{3,}/g, "\n\n").trim()
    ).join("\n\n");
    box.innerHTML = "<div class='teach-top'><h3>📖 Teaching Script — this setup</h3><button type='button' class='teach-copy' id='teachCopy'>📋 Copy script</button></div>" +
      "<p class='teach-note'>" + UF.teach.intro + "</p>" +
      secs.map(s => "<h4>" + s.h + "</h4>" + s.html).join("");
    $("#teachCopy").addEventListener("click", () => {
      const b = $("#teachCopy"), t = b.textContent;
      const done = (msg) => { b.textContent = msg; setTimeout(() => { b.textContent = t; }, 1600); };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(UF._teachText || "").then(() => done("✓ Script copied"), () => done("Copy failed"));
      } else done("Copy failed");
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
