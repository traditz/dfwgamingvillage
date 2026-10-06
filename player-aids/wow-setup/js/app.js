/* =============================================================================
   World of Warcraft: The Board Game — Setup & Reference Utility · app logic
   ============================================================================= */
(function () {
  "use strict";

  const SOW_PARTS = ["sow-class", "sow-items", "sow-blue", "sow-events", "sow-destiny"];

  const state = {
    exps: new Set(["base"]),
    tbcMode: "outland",
    players: 6,
    ov: "kt",
    mods: new Set(),
    party: { A: [], H: [] }
  };

  const chars = () => (state.players >= 5 ? 6 : 4);
  const outland = () => state.exps.has("tbc") && state.tbcMode === "outland";

  const ctx = () => {
    const tbc = state.exps.has("tbc"), sow = state.exps.has("sow"), out = outland();
    const n = chars() / 2;
    const party = { A: state.party.A.slice(0, n), H: state.party.H.slice(0, n) };
    return {
      has: (id) => state.exps.has(id),
      mod: (id) => (id === "outland" ? out : id === "nool" ? (tbc && !out)
        : (typeof id === "string" && id.indexOf("ov-") === 0) ? state.ov === id.slice(3) : state.mods.has(id)),
      p: state.players,
      chars: chars(),
      ov: state.ov,
      tbc, sow, outland: out, nool: tbc && !out,
      party,
      cls: (id) => (party.A.includes(id) ? "A" : party.H.includes(id) ? "H" : null),
      anyCls: party.A.some(Boolean) || party.H.some(Boolean)
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

  /* ---- availability rules (all from the rulebooks) ---------------------- */
  function ovAvailable(o) {
    if (outland()) return !!o.outland;                 // TBC p.7 step 5: an Outland Overlord must be chosen
    if (o.outland) return false;                       // TBC p.19: no Outland Overlord without Outland
    if (o.id === "rag") return state.exps.has("tbc");  // Ragnaros needs TBC (Playing Without Outland, TBC p.19)
    return true;
  }
  function ovReason(o) {
    if (outland() && !o.outland) return "With Outland in play, one of the three Outland Overlords must be chosen (The Burning Crusade p.7)";
    if (o.outland) return "Outland Overlords need The Burning Crusade with Outland (The Burning Crusade p.7, p.19)";
    if (o.id === "rag") return "Ragnaros needs The Burning Crusade, played without Outland (The Burning Crusade p.7, p.19)";
    return "";
  }
  function modAvailable(m) {
    if (!state.exps.has(m.requires)) return false;
    if (m.needs && !state.mods.has(m.needs)) return false;
    if (m.id === "dto" && outland()) return false;     // TBC p.18 already removes the turn limit
    return true;
  }
  function classAllowed(id, f) {
    if (outland()) return true;                        // TBC p.4, p.7: both factions may field Paladin and Shaman
    const k = WW.classes.find((x) => x.id === id);
    return !k.baseFaction || k.baseFaction === f;      // Base p.3, p.7: Paladin Alliance, Shaman Horde
  }

  function normalize() {
    state.exps.add("base");
    if (state.players < 2) state.players = 2;
    if (state.players > 6) state.players = 6;
    if (!["outland", "nool"].includes(state.tbcMode)) state.tbcMode = "outland";
    const cur = WW.overlords.find((o) => o.id === state.ov);
    if (!cur || !ovAvailable(cur)) state.ov = (WW.overlords.find(ovAvailable) || WW.overlords[0]).id;
    for (let pass = 0; pass < 2; pass++) {
      for (const m of WW.modules) if (state.mods.has(m.id) && !modAvailable(m)) state.mods.delete(m.id);
    }
    // party: trim to the character count, no duplicates, faction locks
    const n = chars() / 2, seen = new Set();
    for (const f of ["A", "H"]) {
      const arr = state.party[f].slice(0, n);
      while (arr.length < n) arr.push(null);
      for (let i = 0; i < n; i++) {
        const id = arr[i];
        if (!id) continue;
        if (seen.has(id) || !classAllowed(id, f)) arr[i] = null;
        else seen.add(id);
      }
      state.party[f] = arr;
    }
  }

  /* ---- configurator ---------------------------------------------------- */
  function renderExpansions() {
    const box = $("#expansions");
    box.innerHTML = "";
    for (const e of WW.expansions) {
      const locked = e.id === "base", on = state.exps.has(e.id);
      const b = el("button", "chip" + (on ? " on" : "") + (locked ? " lock" : ""));
      b.type = "button";
      b.setAttribute("aria-pressed", on ? "true" : "false");
      b.innerHTML = "<b>" + e.short + "</b><span>" + e.year + (locked ? " · always in play" : "") + "</span>";
      b.title = e.blurb;
      if (!locked) b.addEventListener("click", () => {
        if (on) { state.exps.delete(e.id); if (e.id === "sow") SOW_PARTS.forEach((p) => state.mods.delete(p)); }
        else { state.exps.add(e.id); if (e.id === "sow") SOW_PARTS.forEach((p) => state.mods.add(p)); }
        update();
      });
      box.appendChild(b);
    }
  }

  function renderTbcModes() {
    const grp = $("#tbcmode-group");
    grp.hidden = !state.exps.has("tbc");
    const box = $("#tbcmodes");
    box.innerHTML = "";
    for (const m of WW.tbcModes) {
      const on = state.tbcMode === m.id;
      const b = el("button", "mode-btn" + (on ? " on" : ""));
      b.type = "button";
      b.setAttribute("aria-pressed", on ? "true" : "false");
      b.innerHTML = "<b>" + m.name + "</b><span>" + m.blurb + "</span>";
      b.addEventListener("click", () => { state.tbcMode = m.id; update(); });
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
    $("#teamline").textContent = WW.teams[state.players];
  }

  function renderOverlords() {
    const box = $("#overlords");
    box.innerHTML = "";
    for (const o of WW.overlords) {
      const ok = ovAvailable(o), on = state.ov === o.id;
      if (!ok && o.tbc && !state.exps.has("tbc")) continue;   // hide expansion Overlords until their set is on
      const b = el("button", "chip ov" + (on ? " on" : "") + (ok ? "" : " off"));
      b.type = "button";
      b.setAttribute("aria-pressed", on ? "true" : "false");
      if (!ok) b.setAttribute("aria-disabled", "true");
      b.innerHTML = "<b>" + o.name + "</b><span>" + (o.tbc ? "The Burning Crusade" : "Base game") + "</span>";
      b.title = ok ? o.blurb : ovReason(o);
      if (ok) b.addEventListener("click", () => { state.ov = o.id; update(); });
      box.appendChild(b);
    }
    $("#ovhint").textContent = outland()
      ? "With Outland, choose an Outland Overlord (The Burning Crusade p.7)."
      : state.exps.has("tbc") ? "Without Outland: a base Overlord or Ragnaros (The Burning Crusade p.19)." : "Choose by consensus or randomly (Base p.8).";
  }

  function renderModules() {
    const box = $("#modules");
    box.innerHTML = "";
    let shown = 0;
    for (const m of WW.modules) {
      if (!modAvailable(m)) continue;
      shown++;
      const on = state.mods.has(m.id);
      const b = el("button", "mod" + (on ? " on" : ""));
      b.type = "button";
      b.setAttribute("aria-pressed", on ? "true" : "false");
      b.innerHTML = "<span class='mod-name'>" + m.name + "</span><span class='mod-sum'>" + m.summary + "</span>";
      b.title = m.description + " (" + m.src + ")";
      b.addEventListener("click", () => {
        if (on) state.mods.delete(m.id); else state.mods.add(m.id);
        update();
      });
      box.appendChild(b);
    }
    $("#modules-group").style.display = shown ? "" : "none";
  }

  function renderParty() {
    const box = $("#party");
    box.innerHTML = "";
    const n = chars() / 2;
    const taken = new Set([...state.party.A, ...state.party.H].filter(Boolean));
    for (const f of ["A", "H"]) {
      const col = el("div", "party-col party-" + f);
      col.appendChild(el("div", "party-head", f === "A" ? "Alliance" : "Horde"));
      for (let i = 0; i < n; i++) {
        const cur = state.party[f][i] || "";
        const sel = el("select", "party-sel");
        sel.setAttribute("aria-label", (f === "A" ? "Alliance" : "Horde") + " character " + (i + 1) + " class");
        sel.appendChild(new Option("— class not chosen —", ""));
        for (const k of WW.classes) {
          const opt = new Option(k.name + (!outland() && k.baseFaction && k.baseFaction !== f ? " (other faction only)" : ""), k.id);
          if ((taken.has(k.id) && k.id !== cur) || !classAllowed(k.id, f)) opt.disabled = true;
          if (k.id === cur) opt.selected = true;
          sel.appendChild(opt);
        }
        sel.addEventListener("change", () => { state.party[f][i] = sel.value || null; update(); });
        col.appendChild(sel);
      }
      box.appendChild(col);
    }
    const tools = el("div", "party-tools");
    const fg = el("button", "party-btn", "Fill with the first-game heroes");
    fg.type = "button";
    if (chars() !== 6) { fg.disabled = true; fg.title = "The book’s first-game line-up is six characters (Base p.40)"; }
    else fg.title = "Druid, Warlock, Hunter for the Alliance; Warrior, Mage, Priest for the Horde (Base p.40)";
    fg.addEventListener("click", () => {
      state.party.A = WW.firstGame.A.map((e) => e.cls);
      state.party.H = WW.firstGame.H.map((e) => e.cls);
      update();
    });
    const clr = el("button", "party-btn", "Clear");
    clr.type = "button";
    clr.addEventListener("click", () => { state.party = { A: [], H: [] }; update(); });
    tools.appendChild(fg);
    tools.appendChild(clr);
    box.appendChild(tools);
    $("#partyhint").textContent = outland()
      ? "Optional. With The Burning Crusade’s sheets either faction may field the Paladin and the Shaman; each class once per game."
      : "Optional. Paladin: Alliance only; Shaman: Horde only; each class once per game (Base p.7). Picking classes adds class notes to the reference.";
  }

  /* ---- setup, reference, teach ---------------------------------------- */
  function renderSetup(c) {
    const out = $("#setup");
    out.innerHTML = "";
    let n = 0;
    for (const phase of WW.phases) {
      const steps = phase.steps.filter((s) => s.when(c));
      if (!steps.length) continue;
      const ph = el("div", "phase");
      ph.appendChild(el("h3", "phase-title", phase.title));
      for (const s of steps) {
        n++;
        const exp = resolve(s.exp, c);
        const meta = WW.expMeta[exp] || WW.expMeta.base;
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
    const open = new Set([...out.querySelectorAll("details[open] > summary")].map((s) => s.textContent));
    out.innerHTML = "";
    for (const sec of WW.reference) {
      if (!sec.when(c)) continue;
      const d = el("details", "ref");
      const title = resolve(sec.title, c);
      d.appendChild(el("summary", null, title));
      if (open.has(title)) d.open = true;
      const body = el("div", "ref-body", resolve(sec.html, c));
      if (sec.src) body.appendChild(el("div", "src-line", resolve(sec.src, c)));
      d.appendChild(body);
      out.appendChild(d);
    }
  }

  function docVisible(x, c) {
    switch (x) {
      case "sow": return c.has("sow");
      case "faqsow": return c.has("sow");      // FAQ p.3's Shadow of War errata
      case "tbc": return c.has("tbc");
      case "faqtbc": return c.has("tbc");
      default: return true; // base, faq
    }
  }

  /* Rulebook search: rendered by js/search-widget.js (search standard v1). */
  window.AID_SEARCH = {
    index: WW.rulesIndex,
    visible: docVisible,
    hint: () => "Search this page, every selected rulebook and the FAQ. Type a word, a phrase or a question.",
    noMatch: () => "No matches on this page or in the selected sets’ rulebooks."
  };

  function renderTeach(c) {
    const box = $("#teach");
    if (!box || !WW.teach) return;
    const secs = WW.teach.sections
      .filter((s) => !s.when || s.when(c))
      .map((s) => ({ h: resolve(s.h, c), html: resolve(s.body, c) }))
      .filter((s) => s.html);
    WW._teachText = secs.map((s) =>
      s.h.toUpperCase() + "\n" +
      s.html.replace(/<li>/g, "• ").replace(/<\/li>/g, "\n").replace(/<\/p>\s*<p>/g, "\n\n")
        .replace(/<[^>]+>/g, "").replace(/\n{3,}/g, "\n\n").trim()
    ).join("\n\n");
    box.innerHTML = "<div class='teach-top'><h3>📖 Teaching script — this setup</h3><button type='button' class='teach-copy' id='teachCopy'>📋 Copy script</button></div>" +
      "<p class='teach-note'>" + WW.teach.intro + "</p>" +
      secs.map((s) => "<h4>" + s.h + "</h4>" + s.html).join("");
    $("#teachCopy").addEventListener("click", () => {
      const b = $("#teachCopy"), t = b.textContent;
      const done = (msg) => { b.textContent = msg; setTimeout(() => { b.textContent = t; }, 1600); };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(WW._teachText || "").then(() => done("✓ Script copied"), () => done("Copy failed"));
      } else done("Copy failed");
    });
  }

  function update() {
    normalize();
    const c = ctx();
    renderExpansions();
    renderTbcModes();
    renderPlayers();
    renderOverlords();
    renderModules();
    renderParty();
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
