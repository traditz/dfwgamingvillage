/* =============================================================================
   Clank! Catacombs — Setup & Reference Utility · app logic
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

  function normalize() {
    state.exps.add("base");
    if (state.players >= 5 && !state.exps.has("party")) state.players = 4;
    for (const mod of CC.modules) {
      if (state.mods.has(mod.id) && !state.exps.has(mod.requires)) state.mods.delete(mod.id);
    }
  }

  function renderExpansions() {
    const box = $("#expansions");
    box.innerHTML = "";
    for (const e of CC.expansions) {
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
    for (let i = 2; i <= 6; i++) {
      const ok = i <= 4 || state.exps.has("party");
      const b = el("button", "pbtn" + (state.players === i ? " on" : "") + (ok ? "" : " off"), String(i));
      b.type = "button";
      if (ok) b.addEventListener("click", () => { state.players = i; update(); });
      else b.title = "5–6 players requires Adventuring Party";
      box.appendChild(b);
    }
  }

  function renderModules() {
    const box = $("#modules");
    box.innerHTML = "";
    let shown = 0;
    for (const mod of CC.modules) {
      if (!state.exps.has(mod.requires)) continue;
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

  function renderSetup(c) {
    const out = $("#setup");
    out.innerHTML = "";
    let n = 0;
    for (const phase of CC.phases) {
      const steps = phase.steps.filter(s => s.when(c));
      if (!steps.length) continue;
      const ph = el("div", "phase");
      ph.appendChild(el("h3", "phase-title", phase.title));
      for (const s of steps) {
        n++;
        const exp = resolve(s.exp, c);
        const meta = CC.expMeta[exp] || CC.expMeta.base;
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
    for (const sec of CC.reference) {
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
      case "uw": return c.has("uw");
      case "lairs": return c.has("lairs");
      case "party": return c.has("party");
      default: return true;
    }
  }

  function doSearch() {
    const q = $("#rsearch").value.trim().toLowerCase();
    const out = $("#rresults");
    out.innerHTML = "";
    if (q.length < 3) {
      out.innerHTML = "<p class='rhint'>Type at least 3 characters to search the selected expansion rulebooks. (The core Catacombs rulebook is a scanned document — its rules are covered by the reference sections above.)</p>";
      return;
    }
    const c = ctx();
    const hits = [];
    for (const pg of CC.rulesIndex) {
      if (!docVisible(pg.x, c)) continue;
      const t = pg.t.toLowerCase();
      const idx = t.indexOf(q);
      if (idx === -1) continue;
      hits.push({ pg, idx });
      if (hits.length >= 40) break;
    }
    if (!hits.length) {
      out.innerHTML = "<p class='rhint'>No matches in the selected expansions' documents. (The core rulebook is a scanned document and can't be text-searched — see the reference sections above.)</p>";
      return;
    }
    for (const { pg, idx } of hits) {
      const start = Math.max(0, idx - 130);
      const end = Math.min(pg.t.length, idx + q.length + 200);
      let snip = (start > 0 ? "…" : "") + pg.t.slice(start, end) + (end < pg.t.length ? "…" : "");
      snip = snip.replace(/</g, "&lt;");
      const rx = new RegExp("(" + q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + ")", "ig");
      snip = snip.replace(rx, "<mark>$1</mark>");
      const hit = el("div", "rhit");
      hit.appendChild(el("div", "rhit-src", pg.b + " — p." + pg.p));
      hit.appendChild(el("div", "rhit-text", snip));
      out.appendChild(hit);
    }
  }

  function renderTeach(c) {
    const box = $("#teach");
    if (!box || !CC.teach) return;
    const secs = CC.teach.sections
      .filter(s => !s.when || s.when(c))
      .map(s => ({ h: (typeof s.h === "function" ? s.h(c) : s.h), html: (typeof s.body === "function" ? s.body(c) : s.body) }))
      .filter(s => s.html);
    CC._teachText = secs.map(s =>
      s.h.toUpperCase() + "\n" +
      s.html.replace(/<li>/g, "• ").replace(/<\/p>\s*<p>/g, "\n\n")
            .replace(/<[^>]+>/g, "").replace(/\n{3,}/g, "\n\n").trim()
    ).join("\n\n");
    box.innerHTML = "<div class='teach-top'><h3>📖 Teaching Script — this setup</h3><button type='button' class='teach-copy' id='teachCopy'>📋 Copy script</button></div>" +
      "<p class='teach-note'>" + CC.teach.intro + "</p>" +
      secs.map(s => "<h4>" + s.h + "</h4>" + s.html).join("");
    $("#teachCopy").addEventListener("click", () => {
      const b = $("#teachCopy"), t = b.textContent;
      navigator.clipboard.writeText(CC._teachText || "").then(
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
    doSearch();
  }

  document.addEventListener("DOMContentLoaded", () => {
    $("#rsearch").addEventListener("input", doSearch);
    $("#teachBtn").addEventListener("click", () => {
      const p = $("#teach");
      p.hidden = !p.hidden;
      if (!p.hidden) p.scrollIntoView({ behavior: "smooth", block: "start" });
    });
    update();
  });
})();
