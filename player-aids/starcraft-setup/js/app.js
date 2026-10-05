/* =============================================================================
   StarCraft: The Board Game — Setup & Reference Utility · app logic
   ============================================================================= */
(function () {
  "use strict";

  const state = {
    exps: new Set(["base"]),
    players: 4,
    mode: "standard",
    mods: new Set(),
    facs: []            // factions marked as at the table, in the order chosen
  };

  // The context every data.js function receives. maybe(f) is true unless the full table is known and f isn't at it.
  const ctx = () => {
    const facs = SC.FAC_ORDER.filter((f) => state.facs.includes(f));
    const complete = facs.length === state.players;
    return {
      has: (id) => state.exps.has(id),
      p: state.players,
      mode: state.mode,
      mod: (id) => state.mods.has(id) || (id === "gc" && state.mode === "survival"),   // Survival follows all Galactic Conquest rules (BW p.11)
      facs,
      complete,
      fac: (id) => facs.includes(id),
      maybe: (id) => !complete || facs.includes(id),
      race: (r) => SC.FAC_ORDER.some((f) => SC.F[f].race === r && (!complete || facs.includes(f)))
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
  const sel = () => ({ has: (id) => state.exps.has(id), mode: state.mode, p: state.players });

  function normalize() {
    state.exps.add("base");
    if (!state.exps.has("bw")) state.mode = "standard";
    if (state.players < 2) state.players = 2;
    if (state.players > 6) state.players = 6;
    if (state.mode === "survival") state.mods.delete("gc");          // implied, shown locked on
    for (const mod of SC.modules) {
      if (state.mods.has(mod.id) && !SC.modAvailable(mod, sel())) state.mods.delete(mod.id);
    }
    // More Starting Planet Tokens and Larger Galaxy contradict each other on the third planet (BW p.11)
    if (state.mods.has("mspt") && state.mods.has("lg")) state.mods.delete("mspt");
    // no more factions than players
    while (state.facs.length > state.players) state.facs.pop();
  }

  function renderExpansions() {
    const box = $("#expansions");
    box.innerHTML = "";
    for (const e of SC.expansions) {
      const locked = e.id === "base";
      const on = state.exps.has(e.id);
      const b = el("button", "chip" + (on ? " on" : "") + (locked ? " lock" : ""));
      b.type = "button";
      b.setAttribute("aria-pressed", on ? "true" : "false");
      b.innerHTML = "<b>" + e.short + "</b><span>" + e.year + (locked ? " · always in play" : "") + "</span>";
      b.title = e.blurb;
      if (locked) b.setAttribute("aria-disabled", "true");
      else b.addEventListener("click", () => {
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
      const on = state.players === i;
      const b = el("button", "pbtn" + (on ? " on" : ""), String(i));
      b.type = "button";
      b.setAttribute("aria-pressed", on ? "true" : "false");
      b.setAttribute("aria-label", i + " players");
      b.addEventListener("click", () => { state.players = i; update(); });
      box.appendChild(b);
    }
  }

  function renderFactions() {
    const box = $("#factions");
    box.innerHTML = "";
    const full = state.facs.length >= state.players;
    for (const f of SC.FAC_ORDER) {
      const F = SC.F[f];
      const on = state.facs.includes(f);
      const blocked = !on && full;
      const b = el("button", "chip fac fac-" + f + (on ? " on" : "") + (blocked ? " off" : ""));
      b.type = "button";
      b.setAttribute("aria-pressed", on ? "true" : "false");
      b.innerHTML = "<b>" + F.name + "</b><span>" + F.race + " · " + F.color.toLowerCase() + "</span>";
      if (blocked) { b.disabled = true; b.title = "Already " + state.players + " factions for " + state.players + " players"; }
      else b.addEventListener("click", () => {
        if (on) state.facs = state.facs.filter((x) => x !== f);
        else state.facs.push(f);
        update();
      });
      box.appendChild(b);
    }
    const n = state.facs.length;
    $("#fac-count").textContent = n ? "(" + n + " of " + state.players + " marked)" : "(optional)";
  }

  function renderModes() {
    const box = $("#modes");
    box.innerHTML = "";
    for (const m of SC.modes) {
      const ok = !m.requires || state.exps.has(m.requires);
      const on = state.mode === m.id;
      const b = el("button", "mode-btn" + (on ? " on" : "") + (ok ? "" : " off"));
      b.type = "button";
      b.setAttribute("aria-pressed", on ? "true" : "false");
      b.innerHTML = "<b>" + m.name + "</b><span>" + m.blurb + "</span>";
      if (!ok) { b.disabled = true; b.title = "Needs Brood War"; }
      else {
        b.title = m.blurb + " (" + m.src + ")";
        b.addEventListener("click", () => { state.mode = m.id; update(); });
      }
      box.appendChild(b);
    }
  }

  function renderModules() {
    const box = $("#modules");
    box.innerHTML = "";
    let shown = 0;
    for (const mod of SC.modules) {
      if (mod.requires && !state.exps.has(mod.requires)) continue;        // Brood War options appear with Brood War
      if (mod.id === "fast" && state.mode !== "survival") continue;       // a Survival-only option
      shown++;
      const s = sel();
      const ok = SC.modAvailable(mod, s);
      const implied = mod.id === "gc" && state.mode === "survival";
      const on = state.mods.has(mod.id) || implied;
      const b = el("button", "mod" + (on ? " on" : "") + (ok ? "" : " off") + (implied ? " implied" : ""));
      b.type = "button";
      b.setAttribute("aria-pressed", on ? "true" : "false");
      b.innerHTML = "<span class='mod-group'>" + mod.group + "</span><span class='mod-name'>" + mod.name + "</span><span class='mod-sum'>" +
        (ok ? mod.summary : SC.modWhyNot(mod, s)) + "</span>";
      if (!ok) { b.disabled = true; b.title = SC.modWhyNot(mod, s); }
      else {
        b.title = mod.description + " (" + mod.src + ")";
        b.addEventListener("click", () => {
          if (state.mods.has(mod.id)) state.mods.delete(mod.id);
          else {
            if (mod.excludes) state.mods.delete(mod.excludes);
            state.mods.add(mod.id);
          }
          update();
        });
      }
      box.appendChild(b);
    }
    $("#modules-group").style.display = shown ? "" : "none";
  }

  function renderSetup(c) {
    const out = $("#setup");
    out.innerHTML = "";
    let n = 0;
    for (const phase of SC.phases) {
      const steps = phase.steps.filter((s) => s.when(c));
      if (!steps.length) continue;
      const ph = el("div", "phase");
      ph.appendChild(el("h3", "phase-title", phase.title));
      for (const s of steps) {
        n++;
        const exp = resolve(s.exp, c);
        const meta = SC.expMeta[exp] || SC.expMeta.base;
        const step = el("div", "step");
        step.appendChild(el("div", "step-num", String(n)));
        const body = el("div", "step-body");
        const head = el("div", "step-head");
        head.appendChild(el("h4", null, resolve(s.t, c)));
        head.appendChild(el("span", "tag " + meta.cls, meta.name));
        body.appendChild(head);
        body.appendChild(el("div", "step-text", resolve(s.d, c)));
        body.appendChild(el("div", "src-line", SC.cite(resolve(s.src, c))));
        step.appendChild(body);
        ph.appendChild(step);
      }
      out.appendChild(ph);
    }
  }

  function renderReference(c) {
    const out = $("#reference");
    const open = new Set([...out.querySelectorAll("details[open] > summary")].map((s) => s.textContent));
    out.innerHTML = "";
    for (const sec of SC.reference) {
      if (!sec.when(c)) continue;
      const d = el("details", "ref");
      const title = resolve(sec.title, c);
      d.appendChild(el("summary", null, title));
      if (open.has(title)) d.open = true;
      const body = el("div", "ref-body", resolve(sec.html, c));
      if (sec.src) body.appendChild(el("div", "src-line", SC.cite(resolve(sec.src, c))));
      d.appendChild(body);
      out.appendChild(d);
    }
  }

  function docVisible(x, c) {
    switch (x) {
      case "bw": return c.has("bw");
      default: return true; // base, faq, faq11
    }
  }

  function doSearch() {
    const fold = (s) => s.replace(/[\u2018\u2019\u02BC]/g, "'").replace(/[\u201C\u201D]/g, "\"");   // curly quotes match straight ones
    const q = fold($("#rsearch").value.trim().toLowerCase());
    const out = $("#rresults");
    out.innerHTML = "";
    if (q.length < 3) {
      out.innerHTML = "<p class='rhint'>Type at least 3 characters to search the core rulebook" + (state.exps.has("bw") ? ", the Brood War rulebook" : "") + " and the FAQs.</p>";
      return;
    }
    const c = ctx();
    const hits = [];
    for (const pg of SC.rulesIndex) {
      if (!docVisible(pg.x, c)) continue;
      const t = fold(pg.t.toLowerCase());
      const idx = t.indexOf(q);
      if (idx === -1) continue;
      hits.push({ pg, idx });
      if (hits.length >= 40) break;
    }
    if (!hits.length) {
      out.innerHTML = "<p class='rhint'>No matches in the selected documents.</p>";
      return;
    }
    for (const { pg, idx } of hits) {
      const start = Math.max(0, idx - 130);
      const end = Math.min(pg.t.length, idx + q.length + 200);
      let snip = (start > 0 ? "…" : "") + pg.t.slice(start, end) + (end < pg.t.length ? "…" : "");
      snip = snip.replace(/&/g, "&amp;").replace(/</g, "&lt;");
      const rx = new RegExp("(" + q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/'/g, "['\u2018\u2019\u02BC]").replace(/"/g, "[\"\u201C\u201D]") + ")", "ig");
      snip = snip.replace(rx, "<mark>$1</mark>");
      const hit = el("div", "rhit");
      hit.appendChild(el("div", "rhit-src", pg.b + " — p." + pg.p));
      hit.appendChild(el("div", "rhit-text", snip));
      out.appendChild(hit);
    }
  }

  function renderTeach(c) {
    const box = $("#teach");
    if (!box || !SC.teach) return;
    const secs = SC.teach.sections
      .filter((s) => !s.when || s.when(c))
      .map((s) => ({ h: resolve(s.h, c), html: resolve(s.body, c) }))
      .filter((s) => s.html);
    SC._teachText = secs.map((s) =>
      s.h.toUpperCase() + "\n" +
      s.html.replace(/<li>/g, "• ").replace(/<\/li>/g, "\n").replace(/<\/p>\s*<p>/g, "\n\n")
            .replace(/<[^>]+>/g, "").replace(/&amp;/g, "&").replace(/\n{3,}/g, "\n\n").trim()
    ).join("\n\n");
    box.innerHTML = "<div class='teach-top'><h3>📖 Teaching Script — this setup</h3><button type='button' class='teach-copy' id='teachCopy'>📋 Copy script</button></div>" +
      "<p class='teach-note'>" + SC.teach.intro + "</p>" +
      secs.map((s) => "<h4>" + s.h + "</h4>" + s.html).join("");
    $("#teachCopy").addEventListener("click", () => {
      const b = $("#teachCopy"), t = b.textContent;
      navigator.clipboard.writeText(SC._teachText || "").then(
        () => { b.textContent = "✓ Script copied"; setTimeout(() => { b.textContent = t; }, 1600); },
        () => { b.textContent = "Copy failed"; setTimeout(() => { b.textContent = t; }, 1600); });
    });
  }

  function update() {
    normalize();
    const c = ctx();
    renderExpansions();
    renderPlayers();
    renderFactions();
    renderModes();
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
