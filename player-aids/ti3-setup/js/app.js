/* =============================================================================
   Twilight Imperium 3rd Edition — Setup & Reference Utility · app logic
   Configuration rules (player ranges, strategy-card deck, option compatibility) live in
   data.js (T3.normalize / T3.deckOf / T3.modBlock) so the test harness shares them.
   ============================================================================= */
(function () {
  "use strict";

  const state = {
    exps: new Set(["base"]),
    mode: "std",
    players: 6,
    mods: new Set(),
    scset: "orig",          // "orig" = the base game's eight; "var" = Shattered Empire's variant eight (SE p.9)
    swaps: new Set()        // slots swapped for their same-name counterpart (SE p.9); slot 8 in "orig" = Imperial II
  };
  const openRefs = new Set();
  let refInit = false;

  const ctx = () => T3.ctx(state);
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
    for (const e of T3.expansions) {
      const locked = e.id === "base";
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
    for (const m of T3.modes) {
      const on = state.mode === m.id;
      const ok = !m.requires || state.exps.has(m.requires);
      const b = el("button", "mode-btn" + (on ? " on" : "") + (ok ? "" : " off"));
      b.type = "button";
      b.setAttribute("aria-pressed", on ? "true" : "false");
      b.innerHTML = "<b>" + m.name + "</b><span>" + m.blurb + "</span>";
      if (ok) b.addEventListener("click", () => { state.mode = m.id; update(); });
      else { b.disabled = true; b.title = "Needs Shards of the Throne"; }
      box.appendChild(b);
    }
  }

  function renderPlayers() {
    const box = $("#players");
    box.innerHTML = "";
    const r = T3.playerRange(state);
    for (const i of [3, 4, 5, 6, 7, 8]) {
      const ok = i >= r[0] && i <= r[1];
      const on = state.players === i;
      const b = el("button", "pbtn" + (on ? " on" : "") + (ok ? "" : " off"), String(i));
      b.type = "button";
      b.setAttribute("aria-pressed", on ? "true" : "false");
      b.setAttribute("aria-label", i + " players");
      if (ok) b.addEventListener("click", () => { state.players = i; update(); });
      else {
        b.disabled = true;
        b.title = state.mode === "fote"
          ? (i === 3 ? "Fall of the Empire is for 4–6 players (SoT p.14)" : "Fall of the Empire goes up to 7 players only with Shattered Empire (SoT p.14)")
          : "7 and 8 players need Shattered Empire (SE p.8)";
      }
      box.appendChild(b);
    }
    $("#players-hint").textContent = state.mode === "fote" ? "(4–6; 7 with Shattered Empire)" : "(3–6; 7–8 need Shattered Empire)";
  }

  function renderStrategy(c) {
    const setBox = $("#scset");
    setBox.innerHTML = "";
    const canVar = state.exps.has("se") && state.mode !== "fote";
    setBox.style.display = canVar ? "" : "none";
    $("#sc-hint").textContent = canVar ? "— the original or Shattered Empire’s variant set; tap a card marked ⇄ to swap it for its same-name version (SE p.9)"
      : (state.mode === "fote" ? "— Fall of the Empire’s set (SoT p.14)" : "— the eight in play" + (state.exps.has("sot") ? " (Mercenaries and Political Intrigue replace a card)" : ""));
    if (canVar) {
      [["orig", "Original eight", "The base game’s black Strategy Cards (Base p.36–38)."],
       ["var", "Variant eight", "Shattered Empire’s white set: Leadership, Diplomacy II, Assembly, Production, Trade II, Warfare II, Technology II, Bureaucracy (SE p.9, p.14–16)."]].forEach((o) => {
        const on = state.scset === o[0];
        const b = el("button", "mode-btn" + (on ? " on" : ""));
        b.type = "button";
        b.setAttribute("aria-pressed", on ? "true" : "false");
        b.innerHTML = "<b>" + o[1] + "</b><span>" + o[2] + "</span>";
        b.addEventListener("click", () => { state.scset = o[0]; state.swaps.clear(); update(); });
        setBox.appendChild(b);
      });
    }
    const box = $("#slots");
    box.innerHTML = "";
    T3.slotDefs.forEach((s, i) => {
      const id = c.deck[i];
      const k = T3.scards[id];
      let alt = null, why = "";
      if (state.mode === "fote") why = "Fall of the Empire’s fixed set (SoT p.14)";
      else if (i === 4 && state.mods.has("mercs")) why = "Trade III replaces it while Mercenaries is on (SoT p.12)";
      else if (i === 2 && state.mods.has("intrigue")) why = "Political Intrigue uses " + k.name + " (SoT p.12)";
      else if (canVar && s.same) alt = state.scset === "var" ? (state.swaps.has(s.n) ? s.vari : s.orig) : (state.swaps.has(s.n) ? s.orig : s.vari);
      else if (canVar && s.n === 8 && state.scset === "orig") alt = state.swaps.has(8) ? "imperial" : "imperial2";
      else why = canVar ? "No same-name counterpart to swap with (SE p.9)" : "";
      const swapped = state.swaps.has(s.n);
      const b = el("button", "slot" + (alt ? " can" : "") + (swapped ? " swapped" : "") + (k.set !== "base" ? " set-" + k.set : ""));
      b.type = "button";
      b.innerHTML = "<span class='slot-n'>" + (i + 1) + "</span><span class='slot-name'>" + k.name + "</span>" +
        (alt ? "<span class='slot-swap'>⇄ " + T3.cardName(alt) + (alt === "imperial2" ? " (+ Age of Empire)" : "") + "</span>" : "");
      if (alt) {
        b.setAttribute("aria-pressed", swapped ? "true" : "false");
        b.setAttribute("aria-label", "Slot " + (i + 1) + ": " + k.name + ". Swap to " + T3.cardName(alt));
        b.title = "Swap for " + T3.cardName(alt) + (alt === "imperial2" ? " — Imperial II must be played with Age of Empire, which switches on too (SE p.9)" : " — same-name cards may be exchanged (SE p.9)");
        b.addEventListener("click", () => {
          if (state.swaps.has(s.n)) state.swaps.delete(s.n);
          else { state.swaps.add(s.n); if (s.n === 8) state.mods.add("aoe"); }
          update();
        });
      } else {
        b.disabled = true;
        b.classList.add("fixed");
        if (why) b.title = why;
      }
      box.appendChild(b);
    });
  }

  function renderModules() {
    const box = $("#modules");
    box.innerHTML = "";
    if (state.mode === "fote") {
      box.appendChild(el("p", "mods-note", "<b>Fall of the Empire</b> always uses <b>Mechanized Units</b> and all of Shards of the Throne’s new Action and Technology Cards; no other optional rule may be used (SoT p.15)."));
      return;
    }
    for (const g of T3.modGroups) {
      // Race-Specific Technologies is listed with Shattered Empire when it's in play, otherwise with Shards of the Throne
      if (g.id === "se" && !state.exps.has("se")) continue;
      const mods = T3.modules.filter((m) => m.grp === g.id || (m.id === "rst" && g.id === "sot" && !state.exps.has("se")));
      const shown = mods.filter((m) => !/^Needs /.test(T3.modBlock(m, state)));
      if (!shown.length) continue;
      const wrap = el("div", "mod-group");
      wrap.appendChild(el("p", "mod-group-h", g.name + " <span>" + g.src + "</span>"));
      const row = el("div", "mods");
      for (const mod of shown) {
        const block = T3.modBlock(mod, state);
        const on = state.mods.has(mod.id);
        const b = el("button", "mod" + (on ? " on" : "") + (block ? " off" : ""));
        b.type = "button";
        b.setAttribute("aria-pressed", on ? "true" : "false");
        b.innerHTML = "<span class='mod-name'>" + mod.name + "</span><span class='mod-sum'>" + mod.summary + "</span>";
        b.title = (block ? block + " — " : "") + mod.description + " (" + mod.src + ")";
        if (block) b.disabled = true;
        else b.addEventListener("click", () => {
          if (state.mods.has(mod.id)) state.mods.delete(mod.id);
          else {
            (mod.excludes || []).forEach((x) => state.mods.delete(x));
            (mod.needs || []).forEach((x) => state.mods.add(x));
            state.mods.add(mod.id);
          }
          update();
        });
        row.appendChild(b);
      }
      wrap.appendChild(row);
      box.appendChild(wrap);
    }
  }

  function renderSetup(c) {
    const out = $("#setup");
    out.innerHTML = "";
    let n = 0;
    for (const phase of T3.phases) {
      const steps = phase.steps.filter((s) => s.when(c));
      if (!steps.length) continue;
      const ph = el("div", "phase");
      ph.appendChild(el("h3", "phase-title", phase.title));
      for (const s of steps) {
        n++;
        const exp = resolve(s.exp, c);
        const meta = T3.expMeta[exp] || T3.expMeta.base;
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
    for (const sec of T3.reference) {
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
      case "se": case "faqse": return c.has("se");
      case "sot": case "faqsot": return c.has("sot");
      default: return true;   // base, faq, var
    }
  }

  /* Rulebook search: rendered by js/search-widget.js (search standard v1). */
  window.AID_SEARCH = {
    index: T3.rulesIndex,
    visible: docVisible,
    hint: (c) => "Search this page, the base rulebook" +
      (c.has("se") ? ", Shattered Empire" : "") + (c.has("sot") ? ", Shards of the Throne" : "") +
      ", the FAQ & errata and the variants sheet. Type a word, a phrase or a question.",
    noMatch: () => "No matches on this page or in the selected sets’ documents."
  };

  function renderTeach(c) {
    const box = $("#teach");
    if (!box || !T3.teach) return;
    const secs = T3.teach.sections
      .filter((s) => !s.when || s.when(c))
      .map((s) => ({ h: resolve(s.h, c), html: resolve(s.body, c) }))
      .filter((s) => s.html);
    T3._teachText = secs.map((s) =>
      s.h.toUpperCase() + "\n" +
      s.html.replace(/<li>/g, "• ").replace(/<\/li>/g, "\n").replace(/<\/p>\s*<p>/g, "\n\n")
            .replace(/<[^>]+>/g, "").replace(/&amp;/g, "&").replace(/\n{3,}/g, "\n\n").trim()
    ).join("\n\n");
    box.innerHTML = "<div class='teach-top'><h3>📖 Teaching Script — this setup</h3><button type='button' class='teach-copy' id='teachCopy'>📋 Copy script</button></div>" +
      "<p class='teach-note'>" + T3.teach.intro + "</p>" +
      secs.map((s) => "<h4>" + s.h + "</h4>" + s.html).join("");
    $("#teachCopy").addEventListener("click", () => {
      const b = $("#teachCopy"), t = b.textContent;
      const done = (msg) => { b.textContent = msg; setTimeout(() => { b.textContent = t; }, 1600); };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(T3._teachText || "").then(() => done("✓ Script copied"), () => done("Copy failed"));
      } else done("Copy failed");
    });
  }

  function update() {
    T3.normalize(state);
    const c = ctx();
    renderExpansions();
    renderModes();
    renderPlayers();
    renderStrategy(c);
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
