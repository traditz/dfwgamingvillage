/* =============================================================================
   Lords of Hellas — Setup & Reference Utility · app logic
   ============================================================================= */
(function () {
  "use strict";

  const state = {
    exps: new Set(["base"]),
    mode: "standard",
    players: 3,
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

  function playerRange() {
    if (state.mode === "solo") return [1, 1];
    if (state.mode === "kronos") return [2, 4];
    let hi = 4;
    if (state.exps.has("da")) hi = 5;             // Atlantis (5th player) is in Dark Ages
    if (state.exps.has("da") && state.exps.has("cos")) hi = 6;
    return [2, hi];
  }

  function normalize() {
    state.exps.add("base");
    // mode requires its set
    const m = LH.modes.find(x => x.id === state.mode);
    if (!m || !state.exps.has(m.requires)) state.mode = "standard";
    // clamp players
    const [lo, hi] = playerRange();
    if (state.players < lo) state.players = lo;
    if (state.players > hi) state.players = hi;
    // modules: standard mode only, and require their set
    for (const mod of LH.modules) {
      if (!state.mods.has(mod.id)) continue;
      if (state.mode !== "standard" || !state.exps.has(mod.requires)) state.mods.delete(mod.id);
    }
    // 5-6 players require Poseidon (full or Simple) for Atlantis
    if (state.mode === "standard" && state.players >= 5 && !state.mods.has("poseidon") && !state.mods.has("poseidonS")) {
      // if the free Messenia Monument slot is taken, fall back to Simple mode
      const messeniaTaken = LH.modules.some(x => x.group === "messenia" && state.mods.has(x.id));
      state.mods.add(messeniaTaken ? "poseidonS" : "poseidon");
    }
  }

  function renderExpansions() {
    const box = $("#expansions");
    box.innerHTML = "";
    for (const e of LH.expansions) {
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

  function renderModes() {
    const box = $("#modes");
    box.innerHTML = "";
    for (const m of LH.modes) {
      const avail = state.exps.has(m.requires);
      const b = el("button", "mode-btn" + (state.mode === m.id ? " on" : "") + (avail ? "" : " off"));
      b.type = "button";
      b.innerHTML = "<b>" + m.name + "</b><span>" + (avail ? m.blurb : "Requires the Kronos expansion") + "</span>";
      if (avail) b.addEventListener("click", () => { state.mode = m.id; update(); });
      box.appendChild(b);
    }
  }

  function renderPlayers() {
    const box = $("#players");
    box.innerHTML = "";
    const [lo, hi] = playerRange();
    for (let i = 1; i <= 6; i++) {
      const ok = i >= lo && i <= hi;
      const b = el("button", "pbtn" + (state.players === i ? " on" : "") + (ok ? "" : " off"), String(i));
      b.type = "button";
      if (ok) b.addEventListener("click", () => { state.players = i; update(); });
      else if (i === 5) b.title = "5 players requires the Atlantis expansion (Dark Ages) + Poseidon";
      else if (i === 6) b.title = "6 players requires City of Steel (+ Atlantis and Poseidon)";
      else if (i === 1) b.title = "1 player is the Solo Campaign mode";
      box.appendChild(b);
    }
  }

  function renderModules() {
    const box = $("#modules");
    box.innerHTML = "";
    let shown = 0;
    if (state.mode === "standard") {
      for (const mod of LH.modules) {
        if (!state.exps.has(mod.requires)) continue;
        shown++;
        const on = state.mods.has(mod.id);
        const b = el("button", "mod" + (on ? " on" : ""));
        b.type = "button";
        b.innerHTML = "<span class='mod-name'>" + mod.name + "</span><span class='mod-sum'>" + mod.summary + "</span>";
        b.title = mod.description + " (" + mod.src + ")";
        b.addEventListener("click", () => {
          if (on) state.mods.delete(mod.id);
          else {
            // click-time exclusivity: shared Monument slots & full/simple pairs
            if (mod.group) {
              for (const other of LH.modules) {
                if (other.id !== mod.id && other.group === mod.group) state.mods.delete(other.id);
              }
            }
            for (const ex of (mod.excludes || [])) state.mods.delete(ex);
            for (const other of LH.modules) {
              if ((other.excludes || []).includes(mod.id)) state.mods.delete(other.id);
            }
            state.mods.add(mod.id);
          }
          update();
        });
        box.appendChild(b);
      }
    }
    $("#modules-group").style.display = shown ? "" : "none";
  }

  function renderSetup(c) {
    const out = $("#setup");
    out.innerHTML = "";
    let n = 0;
    for (const phase of LH.phases) {
      const steps = phase.steps.filter(s => s.when(c));
      if (!steps.length) continue;
      const ph = el("div", "phase");
      ph.appendChild(el("h3", "phase-title", phase.title));
      for (const s of steps) {
        n++;
        const exp = resolve(s.exp, c);
        const meta = LH.expMeta[exp] || LH.expMeta.base;
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
    for (const sec of LH.reference) {
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
      case "da": return c.has("da");
      case "kronos": return c.has("kronos");
      case "cos": return c.has("cos");
      case "apollo": return c.has("apollo");
      case "atlas": return c.has("atlas");
      case "solo": case "solofaq": return c.mode === "solo";
      default: return true; // base, faq
    }
  }

  function doSearch() {
    const q = $("#rsearch").value.trim().toLowerCase();
    const out = $("#rresults");
    out.innerHTML = "";
    if (q.length < 3) {
      out.innerHTML = "<p class='rhint'>Type at least 3 characters to search every selected rulebook and the FAQ.</p>";
      return;
    }
    const c = ctx();
    const hits = [];
    for (const pg of LH.rulesIndex) {
      if (!docVisible(pg.x, c)) continue;
      const t = pg.t.toLowerCase();
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
    if (!box || !LH.teach) return;
    const secs = LH.teach.sections
      .filter(s => !s.when || s.when(c))
      .map(s => ({ h: (typeof s.h === "function" ? s.h(c) : s.h), html: (typeof s.body === "function" ? s.body(c) : s.body) }))
      .filter(s => s.html);
    LH._teachText = secs.map(s =>
      s.h.toUpperCase() + "\n" +
      s.html.replace(/<li>/g, "• ").replace(/<\/p>\s*<p>/g, "\n\n")
            .replace(/<[^>]+>/g, "").replace(/\n{3,}/g, "\n\n").trim()
    ).join("\n\n");
    box.innerHTML = "<div class='teach-top'><h3>📖 Teaching Script — this setup</h3><button type='button' class='teach-copy' id='teachCopy'>📋 Copy script</button></div>" +
      "<p class='teach-note'>" + LH.teach.intro + "</p>" +
      secs.map(s => "<h4>" + s.h + "</h4>" + s.html).join("");
    $("#teachCopy").addEventListener("click", () => {
      const b = $("#teachCopy"), t = b.textContent;
      navigator.clipboard.writeText(LH._teachText || "").then(
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
