/* =============================================================================
   Western Legends — Setup & Reference Utility · app logic
   Data: js/data.js (config, setup), js/data-ref.js (reference), js/data-teach.js
   (teaching script). Compatibility rules live in WL.normalize / WL.variantStatus.
   ============================================================================= */
(function () {
  "use strict";

  const state = {
    sets: new Set(["core", "au", "bm"]),
    p: 4,
    len: 20,
    mode: "std",
    vars: new Set(["altpoker"])
  };

  const $ = (s) => document.querySelector(s);
  const el = (tag, cls, html) => {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (html !== undefined) n.innerHTML = html;
    return n;
  };
  const resolve = (v, c) => (typeof v === "function" ? v(c) : v);

  function renderSets() {
    const box = $("#expansions");
    box.innerHTML = "";
    for (const s of WL.sets) {
      const locked = s.id === "core";
      const on = state.sets.has(s.id);
      const b = el("button", "chip" + (on ? " on" : "") + (locked ? " lock" : ""));
      b.type = "button";
      b.setAttribute("aria-pressed", on ? "true" : "false");
      b.innerHTML = "<b>" + s.short + "</b><span>" + s.abbr + "</span>";
      b.title = s.blurb;
      if (!locked) b.addEventListener("click", () => {
        on ? state.sets.delete(s.id) : state.sets.add(s.id);
        update();
      });
      box.appendChild(b);
    }
  }

  function renderPlayers() {
    const box = $("#players");
    box.innerHTML = "";
    for (let i = 2; i <= 6; i++) {
      const on = state.p === i;
      const b = el("button", "pbtn" + (on ? " on" : ""), String(i));
      b.type = "button";
      b.setAttribute("aria-pressed", on ? "true" : "false");
      if (i === 2) b.title = state.mode === "border" ? "2 players: Who Runs Border Town? plays without the Man in Black" : "2 players: adds the Man in Black";
      b.addEventListener("click", () => { state.p = i; update(); });
      box.appendChild(b);
    }
  }

  function renderLengths() {
    const box = $("#lengths");
    box.innerHTML = "";
    for (const l of WL.lengths) {
      const on = state.len === l.n;
      const b = el("button", "pbtn" + (on ? " on" : ""), l.n + " LP<small>" + l.name + "</small>");
      b.type = "button";
      b.setAttribute("aria-pressed", on ? "true" : "false");
      b.addEventListener("click", () => { state.len = l.n; update(); });
      box.appendChild(b);
    }
  }

  function renderModes() {
    const box = $("#modes");
    box.innerHTML = "";
    for (const m of WL.modes) {
      const why = WL.modeBlock(m, state.sets);
      const on = state.mode === m.id;
      const b = el("button", "mode-btn" + (on ? " on" : "") + (why ? " off" : ""));
      b.type = "button";
      b.setAttribute("aria-pressed", on ? "true" : "false");
      b.innerHTML = "<b>" + m.name + "</b><span>" + m.blurb + "</span>" + (why ? "<span class='why'>" + why + "</span>" : "");
      b.title = m.src;
      if (why) b.setAttribute("aria-disabled", "true");
      else b.addEventListener("click", () => { state.mode = m.id; update(); });
      box.appendChild(b);
    }
  }

  function renderVariants() {
    const box = $("#modules");
    box.innerHTML = "";
    for (const vr of WL.variants) {
      const s = WL.variantStatus(vr, state);
      const b = el("button", "mod" + (s.on ? " on" : "") + (!s.avail ? " off" : "") + (s.locked ? " locked" : ""));
      b.type = "button";
      b.setAttribute("aria-pressed", s.on ? "true" : "false");
      b.innerHTML = "<span class='mod-name'>" + vr.name + "</span><span class='mod-sum'>" + vr.summary + "</span>" +
        (s.why ? "<span class='why'>" + s.why + "</span>" : "");
      b.title = vr.src;
      if (s.locked) b.setAttribute("aria-disabled", "true");
      else b.addEventListener("click", () => {
        state.vars.has(vr.id) ? state.vars.delete(vr.id) : state.vars.add(vr.id);
        update();
      });
      box.appendChild(b);
    }
  }

  /* A setup step's text plus any variant/mode hooks that apply to it. */
  function stepParts(s, c) {
    const hooks = (WL.stepHooks || []).filter(h => h.step === s.id && h.when(c));
    if (hooks.some(h => h.hide)) return null;
    let d = resolve(s.d, c);
    let src = resolve(s.src, c);
    for (const h of hooks) {
      if (h.html) d += resolve(h.html, c);
      if (h.src) src += " · " + resolve(h.src, c);
    }
    return { d, src };
  }

  function renderSetup(c) {
    const out = $("#setup");
    out.innerHTML = "";
    let n = 0;
    for (const phase of WL.phases) {
      const steps = phase.steps.filter(s => s.when(c)).map(s => ({ s, parts: stepParts(s, c) })).filter(x => x.parts);
      if (!steps.length) continue;
      const ph = el("div", "phase");
      ph.appendChild(el("h3", "phase-title", phase.title));
      if (phase.note) ph.appendChild(el("p", "phase-note", phase.note));
      for (const { s, parts } of steps) {
        n++;
        const exp = resolve(s.exp, c);
        const meta = WL.expMeta[exp] || WL.expMeta.core;
        const step = el("div", "step");
        step.id = "step-" + s.id;
        step.appendChild(el("div", "step-num", String(n)));
        const body = el("div", "step-body");
        const head = el("div", "step-head");
        head.appendChild(el("h4", null, resolve(s.t, c)));
        head.appendChild(el("span", "tag " + meta.cls, meta.name));
        body.appendChild(head);
        body.appendChild(el("div", "step-text", parts.d));
        body.appendChild(el("div", "src-line", parts.src));
        step.appendChild(body);
        ph.appendChild(step);
      }
      out.appendChild(ph);
    }
  }

  function renderReference(c) {
    const out = $("#reference");
    const open = new Set(Array.from(out.querySelectorAll("details.ref[open]")).map(d => d.dataset.id));
    const filters = {};   // keep what was typed in the Legends/items lookups across re-renders
    out.querySelectorAll(".lk-filter").forEach(f => { if (f.value) filters[f.dataset.lk] = f.value; });
    out.innerHTML = "";
    for (const sec of WL.reference) {
      if (!sec.when(c)) continue;
      const d = el("details", "ref");
      d.dataset.id = sec.id;
      d.id = "ref-" + sec.id;
      if (open.has(sec.id)) d.open = true;
      d.appendChild(el("summary", null, resolve(sec.title, c)));
      const body = el("div", "ref-body", resolve(sec.html, c));
      if (sec.src) body.appendChild(el("div", "src-line", resolve(sec.src, c)));
      d.appendChild(body);
      out.appendChild(d);
    }
    out.querySelectorAll(".lk-filter").forEach(f => { if (filters[f.dataset.lk]) { f.value = filters[f.dataset.lk]; lookupFilter(f); } });
  }

  /* Legends / items lookup (js/data-legends.js): every word typed must appear in an entry's name,
     set, type or ability text. One match opens it. */
  function lookupFilter(input) {
    const list = document.querySelector("[data-lk-list='" + input.dataset.lk + "']");
    if (!list) return;
    const words = input.value.toLowerCase().replace(/[“”"’']/g, "").split(/\s+/).filter(Boolean);
    const items = Array.from(list.querySelectorAll(".lk-item"));
    let n = 0, last = null;
    for (const it of items) {
      const ok = words.every(w => it.dataset.k.indexOf(w) >= 0);
      it.hidden = !ok;
      if (ok) { n++; last = it; }
    }
    if (n === 1 && words.length) last.open = true;
    const cnt = input.parentNode.querySelector(".lk-count");
    if (cnt) cnt.textContent = (words.length ? n + " of " + items.length + " " : items.length + " ") + cnt.dataset.noun + (words.length && !n ? ": no match" : "");
  }

  /* links from setup steps to a reference section: open it and scroll to it */
  function openRef(id) {
    const d = document.getElementById("ref-" + id);
    if (!d) return false;
    d.open = true;
    d.scrollIntoView({ behavior: "smooth", block: "start" });
    const s = d.querySelector("summary");
    if (s) s.focus({ preventScroll: true });
    return true;
  }

  /* One source document: the Complete Rules is always visible. */
  function docVisible(x, c) {
    switch (x) {
      default: return true; // rules
    }
  }

  /* Rulebook search: rendered by js/search-widget.js (search standard v1.1). */
  window.AID_SEARCH = {
    index: WL.rulesIndex,
    visible: docVisible,
    hint: () => "Search this page and every page of the Western Legends Complete Rules. Type a word, a phrase or a question.",
    noMatch: () => "No matches on this page or in the Complete Rules."
  };

  function renderTeach(c) {
    const box = $("#teach");
    if (!box || !WL.teach) return;
    const secs = WL.teach.sections
      .filter(s => !s.when || s.when(c))
      .map(s => ({ h: resolve(s.h, c), html: resolve(s.body, c) }))
      .filter(s => s.html);
    WL._teachText = secs.map(s =>
      s.h.toUpperCase() + "\n" +
      s.html.replace(/<li>/g, "• ").replace(/<\/li>/g, "\n").replace(/<\/p>\s*<p[^>]*>/g, "\n\n")
            .replace(/<[^>]+>/g, "").replace(/\n{3,}/g, "\n\n").trim()
    ).join("\n\n");
    box.innerHTML = "<div class='teach-top'><h3>📖 Teaching Script — this setup</h3><button type='button' class='teach-copy' id='teachCopy'>📋 Copy script</button></div>" +
      "<p class='teach-note'>" + WL.teach.intro + "</p>" +
      secs.map(s => "<h4>" + s.h + "</h4>" + s.html).join("");
    $("#teachCopy").addEventListener("click", () => {
      const b = $("#teachCopy"), t = b.textContent;
      const done = (msg) => { b.textContent = msg; setTimeout(() => { b.textContent = t; }, 1600); };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(WL._teachText || "").then(() => done("✓ Script copied"), () => done("Copy failed"));
      } else done("Copy failed");
    });
  }

  function update() {
    WL.normalize(state);
    const c = WL.ctx(state);
    renderSets();
    renderPlayers();
    renderLengths();
    renderModes();
    renderVariants();
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
    document.addEventListener("input", (e) => { if (e.target.classList && e.target.classList.contains("lk-filter")) lookupFilter(e.target); });
    document.addEventListener("click", (e) => {
      const a = e.target.closest && e.target.closest("a.ref-link[data-ref]");
      if (a && openRef(a.dataset.ref)) e.preventDefault();
    });
    update();
  });
})();
