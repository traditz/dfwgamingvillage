/* =============================================================================
   Vast: The Crystal Caverns — Setup & Reference Utility · app logic
   ============================================================================= */
(function () {
  "use strict";

  const BASE = ["knight", "goblins", "dragon", "cave", "thief"];
  const FF = ["vileghoul", "unicorn", "caveghost", "ghoul", "ghost"];

  const state = {
    roles: new Set(["knight", "goblins", "dragon", "cave"]),   // the rulebook's first-game recommendation
    mods: new Set(),
    lvl: {},
    opt: { kt: 5, gg: 5, vt: 6, kSolo: "A", kShadow: "C", dSolo: "medium", hSolo: "easy", gSolo: "medium", vSolo: "medium",
           shadowLvl: "medium", shadowHunter: "", uHunter: "" }
  };

  // roles that can attack the Shadow / Nightmare Unicorn (Unicorn p.3, p.6) — only they can take the hunter goal
  const HUNTERS = ["knight", "goblins", "vileghoul", "dragon", "thief", "ghoul"];

  const lvlOf = (r) => (state.roles.has(r) && state.lvl[r] !== undefined ? state.lvl[r] : 2);

  function ctx() {
    const S = { roles: state.roles, mods: state.mods, lvl: state.lvl, opt: state.opt };
    const v = VC.variant(S);
    const has = (id) => {
      if (id === "core") return true;
      if (id === "ffghost") return state.roles.has("ghost") || state.roles.has("caveghost");
      if (id === "ffghoul") return state.roles.has("ghoul") || state.roles.has("vileghoul");
      if (id === "ffunicorn") return state.roles.has("unicorn") || state.mods.has("shadow");
      return state.roles.has(id);
    };
    const anyDiff = v.players.some((r) => lvlOf(r) !== 2);
    const derived = {
      solo: v.n === 1,
      inf: !!v.inf,
      varcards: !!(v.flare.size || v.pp || v.inf || v.ash || v.aid === "I"),
      diffcore: BASE.some((r) => state.roles.has(r) && lvlOf(r) !== 2),
      diffghost: ["ghost", "caveghost"].some((r) => state.roles.has(r) && lvlOf(r) !== 2),
      diffghoul: ["ghoul", "vileghoul"].some((r) => state.roles.has(r) && lvlOf(r) !== 2),
      diffunicorn: state.roles.has("unicorn") && lvlOf("unicorn") !== 2,
      crowdedcard: state.mods.has("crowded") && v.n >= 4
    };
    const c = {
      has,
      mod: (id) => (id in derived ? derived[id] : state.mods.has(id)),
      lvl: lvlOf,
      opt: state.opt,
      v,
      n: v.n,
      p: v.n,
      ff: FF.some((r) => state.roles.has(r)) || state.mods.has("shadow"),
      anyDiff,
      caveRemove: [2, 1, 0, 0, 0][lvlOf(state.roles.has("caveghost") ? "caveghost" : "cave")] *
        (state.roles.has("cave") || state.roles.has("caveghost") ? 1 : 0)
    };
    return c;
  }

  const $ = (s) => document.querySelector(s);
  const el = (tag, cls, html) => {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (html !== undefined) n.innerHTML = html;
    return n;
  };
  const resolve = (v, c) => (typeof v === "function" ? v(c) : v);

  /* ---- configuration rules the books state ---------------------------------- */
  function exclusiveOf(id) {
    return VC.exclusive.filter((p) => p[0] === id || p[1] === id).map((p) => (p[0] === id ? p[1] : p[0]));
  }
  function modAvailable(m, c) {
    switch (m.id) {
      case "shadow": return !state.roles.has("unicorn");
      case "crowded": return c.v.n >= 4;
      case "faq1": return c.v.noCave && c.v.n >= 4;
      case "skitter": return state.roles.has("ghoul") || state.roles.has("vileghoul");
      case "simple": return state.roles.has("unicorn");
      case "focused": return state.roles.has("ghost") && lvlOf("ghost") !== 4;
      default: return true;
    }
  }
  function normalize() {
    for (const [a, b] of VC.exclusive) if (state.roles.has(a) && state.roles.has(b)) state.roles.delete(a);
    if (state.roles.has("unicorn")) state.mods.delete("shadow");
    const c = ctx();
    for (const m of VC.mods) if (state.mods.has(m.id) && !modAvailable(m, c)) state.mods.delete(m.id);
    if (state.opt.shadowHunter && (!state.roles.has(state.opt.shadowHunter) || !HUNTERS.includes(state.opt.shadowHunter))) state.opt.shadowHunter = "";
    if (state.opt.uHunter && (!state.roles.has(state.opt.uHunter) || !HUNTERS.includes(state.opt.uHunter) || !c.v.alongside)) state.opt.uHunter = "";
  }

  /* ---- configurator ------------------------------------------------------------ */
  function roleChip(id) {
    const r = VC.role[id];
    const on = state.roles.has(id);
    const b = el("button", "chip" + (on ? " on" : ""));
    b.type = "button";
    b.setAttribute("aria-pressed", on ? "true" : "false");
    b.innerHTML = "<b>" + r.short + "</b><span>" + r.blurb + "</span>";
    const ex = exclusiveOf(id).filter((o) => state.roles.has(o));
    b.title = (ex.length ? "Selecting swaps out the " + ex.map((o) => VC.role[o].short).join(" and ") + ". " : "") + r.name + " (" + r.src + ")";
    b.addEventListener("click", () => {
      if (on) state.roles.delete(id);
      else {
        exclusiveOf(id).forEach((o) => state.roles.delete(o));
        if (id === "unicorn") state.mods.delete("shadow");
        state.roles.add(id);
      }
      update();
    });
    return b;
  }

  function renderRoles() {
    const a = $("#roles-base"), b = $("#roles-ff");
    a.innerHTML = ""; b.innerHTML = "";
    BASE.forEach((id) => a.appendChild(roleChip(id)));
    FF.forEach((id) => b.appendChild(roleChip(id)));
  }

  function renderPresets() {
    const box = $("#presets");
    box.innerHTML = "";
    const presets = [
      { label: "First game: all but the Thief", roles: ["knight", "goblins", "dragon", "cave"] },
      { label: "All five roles", roles: BASE },
      { label: "Clear", roles: [] }
    ];
    presets.forEach((p) => {
      const same = p.roles.length === state.roles.size && p.roles.every((r) => state.roles.has(r));
      const btn = el("button", "preset" + (same ? " on" : ""), p.label);
      btn.type = "button";
      btn.setAttribute("aria-pressed", same ? "true" : "false");
      btn.addEventListener("click", () => { state.roles = new Set(p.roles); update(); });
      box.appendChild(btn);
    });
  }

  function renderStatus(c) {
    const box = $("#status");
    const v = c.v;
    if (!v.valid) { box.className = "status bad"; box.innerHTML = v.invalid; return; }
    const star = v.layers.length && v.layers.every((l) => l.star);
    box.className = "status";
    box.innerHTML = "<b>" + v.n + (v.n === 1 ? " player" : " players") + "</b> · " + v.players.map((r) => VC.role[r].short).join(", ") +
      (v.shadow ? " + Shadow Unicorn" : "") + (star ? " <span class='star'>★ first-game recommendation</span>" : "") +
      "<br><span class='status-var'>" + v.layers.map((l) => l.name).join(" → ") + "</span>";
  }

  /* segmented choice */
  function seg(label, key, options, note) {
    const wrap = el("div", "choice");
    wrap.appendChild(el("div", "choice-label", label + (note ? " <span class='hint'>" + note + "</span>" : "")));
    const g = el("div", "seg");
    g.setAttribute("role", "group");
    g.setAttribute("aria-label", label.replace(/<[^>]+>/g, ""));
    options.forEach(([val, text]) => {
      const on = state.opt[key] === val;
      const b = el("button", "seg-btn" + (on ? " on" : ""), text);
      b.type = "button";
      b.setAttribute("aria-pressed", on ? "true" : "false");
      b.addEventListener("click", () => { state.opt[key] = val; update(); });
      g.appendChild(b);
    });
    wrap.appendChild(g);
    return wrap;
  }

  function renderChoices(c) {
    const box = $("#choices");
    box.innerHTML = "";
    const v = c.v;
    if (!v.valid) { $("#choices-group").hidden = true; return; }
    if (v.kt) box.appendChild(seg("Knight vs. Thief: Crystals the Knight must smash", "kt", [[5, "5"], [6, "6"]], "(agree before the game — the Thief needs the same number of Treasures)"));
    if (v.gvGhost) box.appendChild(seg("Goblins vs. Ghost: Crystals the Goblins must smash", "gg", [[4, "4"], [5, "5"]], "(the Ghost locks one more Artifact)"));
    if (v.vgThief) box.appendChild(seg("Vile Ghoul vs. Thief: Treasures the Thief must stash", "vt", [[5, "5"], [6, "6"]], "(the Vile Ghoul smashes one more Crystal)"));
    if (v.inf === "solo") box.appendChild(seg("Knight solo: Goblin Infestation level", "kSolo", [["A", "Easy — Normal Goblins (A)"], ["B", "Medium — Tough Goblins (B)"], ["C", "Hard — Monsters (C)"]]));
    if (v.inf === "shadow") box.appendChild(seg("Knight vs. Shadow Unicorn: Goblin Infestation level", "kShadow", [["A", "Normal Goblins (A)"], ["B", "Tough Goblins (B)"], ["C", "Monsters (C) — recommended"]]));
    if (v.hunger === "solo") box.appendChild(seg("Dragon solo difficulty", "dSolo", [["easy", "Easy — all 4 Hunger cubes"], ["medium", "Medium — 2 cubes"], ["hard", "Hard — none"]]));
    if (v.ghostMode === "solo" && !v.shadow) box.appendChild(seg("Ghost solo difficulty", "hSolo", [["easy", "Easy — the whole Possession deck"], ["medium", "Medium — 3 Possession cards; lose if 2 Ghost tiles collapse"], ["hard", "Hard — 3 Possession cards; lose if any Ghost tile collapses"]], "(all levels: you also lose if 5 Crystal tiles collapse)"));
    if (v.ghoulSolo) box.appendChild(seg("Ghoul solo difficulty", "gSolo", [["easy", "Easy — 7 Fury or 5 Crystals"], ["medium", "Medium — 8 / 6"], ["hard", "Hard — 9 / 7"]]));
    if (v.vgSolo) box.appendChild(seg("Vile Ghoul solo difficulty", "vSolo", [["easy", "Easy — 5 Crystals"], ["medium", "Medium — 6"], ["hard", "Hard — 7"]]));
    if (v.shadow) {
      box.appendChild(seg("Shadow Unicorn: what provokes a Rampage", "shadowLvl", [["easy", "Easy — angry actions"], ["medium", "Medium — Moves and angry actions"], ["hard", "Hard — any action"]]));
      if (v.shadow === "multi") box.appendChild(seg("Shadow Unicorn hunter", "shadowHunter", [["", "Nobody"]].concat(v.players.filter((r) => HUNTERS.includes(r)).map((r) => [r, VC.role[r].short])), "(if everyone agrees, one player's goal becomes killing him)"));
    }
    if (v.alongside) box.appendChild(seg("Unicorn vs. Dragon: who hunts the Nightmare Unicorn?", "uHunter", [["", "Nobody"]].concat(v.players.filter((r) => HUNTERS.includes(r)).map((r) => [r, VC.role[r].short])), "(optional, if everyone agrees)"));
    $("#choices-group").hidden = !box.children.length;
  }

  function renderLevels(c) {
    const box = $("#levels");
    box.innerHTML = "";
    const v = c.v;
    if (!v.valid) { $("#levels-group").hidden = true; return; }
    $("#levels-group").hidden = false;
    v.players.forEach((r) => {
      const row = el("div", "lvl-row");
      const id = "lvl-" + r;
      row.appendChild(el("label", "lvl-name", VC.role[r].short));
      row.lastChild.setAttribute("for", id);
      const s = el("select", "lvl-sel");
      s.id = id;
      VC.levels[r].forEach((nm, i) => {
        const o = el("option", null, nm + " — " + VC.levelWord[i]);
        o.value = String(i);
        if (lvlOf(r) === i) o.selected = true;
        s.appendChild(o);
      });
      s.addEventListener("change", () => { state.lvl[r] = Number(s.value); update(); });
      row.appendChild(s);
      box.appendChild(row);
    });
    const sp = el("div", "speed");
    [["Shorter game: everyone Easy", 1], ["Everyone Standard", 2], ["Longer game: everyone Hard", 3]].forEach(([t, L]) => {
      const all = v.players.every((r) => lvlOf(r) === L);
      const b = el("button", "preset" + (all ? " on" : ""), t);
      b.type = "button";
      b.setAttribute("aria-pressed", all ? "true" : "false");
      b.addEventListener("click", () => { v.players.forEach((r) => { state.lvl[r] = L; }); update(); });
      sp.appendChild(b);
    });
    box.appendChild(sp);
  }

  function renderModules(c) {
    const box = $("#modules");
    box.innerHTML = "";
    for (const m of VC.mods) {
      if (!modAvailable(m, c)) continue;
      const on = state.mods.has(m.id);
      const b = el("button", "mod" + (on ? " on" : ""));
      b.type = "button";
      b.setAttribute("aria-pressed", on ? "true" : "false");
      b.innerHTML = "<span class='mod-name'>" + m.name + "</span><span class='mod-sum'>" + m.summary + "</span>";
      b.title = m.description + " (" + m.src + ")";
      b.addEventListener("click", () => { on ? state.mods.delete(m.id) : state.mods.add(m.id); update(); });
      box.appendChild(b);
    }
  }

  /* ---- setup, reference, teach ---------------------------------------------------- */
  function renderSetup(c) {
    const out = $("#setup");
    out.innerHTML = "";
    if (!c.v.valid) {
      out.appendChild(el("p", "status bad", c.v.invalid));
      return;
    }
    let n = 0;
    for (const phase of VC.phases) {
      const steps = phase.steps.filter((s) => s.when(c));
      if (!steps.length) continue;
      const ph = el("div", "phase");
      ph.appendChild(el("h3", "phase-title", phase.title));
      for (const s of steps) {
        n++;
        const exp = resolve(s.exp, c);
        const meta = VC.expMeta[exp] || VC.expMeta.core;
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
    const open = new Set(Array.from(out.querySelectorAll("details[open] > summary")).map((s) => s.textContent));
    out.innerHTML = "";
    for (const sec of VC.reference) {
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
      case "ghost": return c.has("ffghost") || c.mod("crowded");
      case "ghoul": return c.has("ffghoul");
      case "unicorn": return c.has("ffunicorn");
      default: return true;   // rules, faq
    }
  }

  /* Rulebook search: rendered by js/search-widget.js (search standard v1). */
  window.AID_SEARCH = {
    index: VC.rulesIndex,
    visible: docVisible,
    hint: (c) => "Search this page, the Crystal Caverns rulebook and the FAQ" +
      (c.has("ffghost") || c.mod("crowded") ? ", the Ghost rulebook" : "") + (c.has("ffghoul") ? ", the Ghoul rulebook" : "") + (c.has("ffunicorn") ? ", the Unicorn rulebook" : "") +
      ". Type a word, a phrase or a question.",
    noMatch: () => "No matches on this page or in the rulebooks for the roles you've selected.",
    testQueries: ["collapse", "grit", "skitter", "possession"]
  };

  function renderTeach(c) {
    const box = $("#teach");
    if (!box || !VC.teach) return;
    const secs = VC.teach.sections
      .filter((s) => !s.when || s.when(c))
      .map((s) => ({ h: (typeof s.h === "function" ? s.h(c) : s.h), html: (typeof s.body === "function" ? s.body(c) : s.body) }))
      .filter((s) => s.html);
    VC._teachText = secs.map((s) =>
      s.h.toUpperCase() + "\n" +
      s.html.replace(/<li>/g, "• ").replace(/<\/li>/g, "\n").replace(/<\/p>\s*<p>/g, "\n\n")
        .replace(/<[^>]+>/g, "").replace(/&amp;/g, "&").replace(/\n{3,}/g, "\n\n").trim()
    ).join("\n\n");
    box.innerHTML = "<div class='teach-top'><h3>📖 Teaching Script — this setup</h3><button type='button' class='teach-copy' id='teachCopy'>📋 Copy script</button></div>" +
      "<p class='teach-note'>" + VC.teach.intro + "</p>" +
      secs.map((s) => "<h4>" + s.h + "</h4>" + s.html).join("");
    $("#teachCopy").addEventListener("click", () => {
      const b = $("#teachCopy"), t = b.textContent;
      const done = (msg) => { b.textContent = msg; setTimeout(() => { b.textContent = t; }, 1600); };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(VC._teachText || "").then(() => done("✓ Script copied"), () => done("Copy failed"));
      } else done("Copy failed");
    });
  }

  function update() {
    normalize();
    const c = ctx();
    renderRoles();
    renderPresets();
    renderStatus(c);
    renderChoices(c);
    renderLevels(c);
    renderModules(c);
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

  VC._debug = { state, ctx, update };
})();
