/* =============================================================================
   Warcraft: The Board Game — Setup & Reference Utility · app logic
   ============================================================================= */
(function () {
  "use strict";

  const state = {
    exps: new Set(["core"]),
    players: 2,
    scen: "main",
    pick: ["hu", "orc"],     // the two races of a two-player main game, in click order
    mods: new Set()
  };
  const openRefs = new Set();   // reference sections the reader has opened (kept across re-renders)
  let refInit = false;

  const has = (id) => state.exps.has(id);
  const sortRaces = (a) => WC.RACE_ORDER.filter(r => a.indexOf(r) !== -1);

  function racesInPlay() {
    if (state.scen === "main") {
      if (state.players === 2) return sortRaces(state.pick);
      if (state.players === 3) return ["hu", "orc", "ne"];   // the Three-Player Setup diagram's Towns (Expansion p.3)
      return WC.RACE_ORDER.slice();
    }
    return sortRaces(WC.S[state.scen].races);
  }

  const ctx = () => {
    const races = racesInPlay();
    return {
      has: has,
      p: state.players,
      mode: state.scen,
      scen: state.scen,
      races: races,
      race: (id) => races.indexOf(id) !== -1,
      teams: WC.teamsFor(state.scen, state.players),
      mod: (id) => state.mods.has(id)
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

  /* Default scenario for a player count: the main game where it allows that count, else The Elf Gate
     (the rulebook's three-player game without the Expansion Set — Rules p.3). */
  function defaultScenFor(p) {
    return WC.playersFor("main", has).indexOf(p) !== -1 ? "main" : "elfgate";
  }

  function normalize() {
    state.exps.add("core");
    if (!WC.scenAvailable(state.scen, has)) state.scen = "main";
    const allowed = WC.playersFor(state.scen, has);
    if (allowed.indexOf(state.players) === -1) {
      if (state.scen === "main") state.scen = defaultScenFor(state.players);
      if (WC.playersFor(state.scen, has).indexOf(state.players) === -1) state.players = WC.playersFor(state.scen, has)[0];
    }
    // two-player main game: exactly two different races
    state.pick = state.pick.filter((r, i, a) => WC.RACE_ORDER.indexOf(r) !== -1 && a.indexOf(r) === i).slice(-2);
    for (const r of WC.RACE_ORDER) if (state.pick.length < 2 && state.pick.indexOf(r) === -1) state.pick.push(r);
    // options: availability, then Heroes needs Creeps (Expansion p.5), then exclusions
    let c = ctx();
    for (const mod of WC.modules) if (state.mods.has(mod.id) && !WC.modAvailable(mod, c)) state.mods.delete(mod.id);
    c = ctx();
    const creepsMod = WC.modules.find(m => m.id === "creeps");
    if (state.mods.has("heroes") && WC.modAvailable(creepsMod, c)) state.mods.add("creeps");
    for (const mod of WC.modules) if (state.mods.has(mod.id) && mod.excludes) mod.excludes.forEach(x => state.mods.delete(x));
  }

  function renderExpansions() {
    const box = $("#expansions");
    box.innerHTML = "";
    for (const e of WC.expansions) {
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

  function renderPlayers() {
    const box = $("#players");
    box.innerHTML = "";
    for (const i of [2, 3, 4]) {
      const on = state.players === i;
      const b = el("button", "pbtn" + (on ? " on" : ""), String(i));
      b.type = "button";
      b.setAttribute("aria-pressed", on ? "true" : "false");
      b.setAttribute("aria-label", i + " players");
      if (i === 3 && !has("exp")) b.title = "Three players: The Elf Gate or an online scenario (the three-player main game needs the Expansion Set)";
      b.addEventListener("click", () => {
        state.players = i;
        if (WC.playersFor(state.scen, has).indexOf(i) === -1) state.scen = defaultScenFor(i);
        update();
      });
      box.appendChild(b);
    }
  }

  function renderModes() {
    const box = $("#modes");
    box.innerHTML = "";
    for (const g of WC.GROUPS) {
      const ids = WC.SCEN_ORDER.filter(id => WC.S[id].group === g.id);
      box.appendChild(el("p", "mode-group", g.label));
      for (const id of ids) {
        const S = WC.S[id];
        const avail = WC.scenAvailable(id, has);
        const counts = WC.playersFor(id, has);
        const fits = counts.indexOf(state.players) !== -1;
        const on = state.scen === id;
        const b = el("button", "mode-btn" + (on ? " on" : "") + (avail ? "" : " off") + (avail && !fits ? " other-count" : ""));
        b.type = "button";
        b.setAttribute("aria-pressed", on ? "true" : "false");
        const races = id === "main" ? "any races" : WC.rn(sortRaces(S.races));
        b.innerHTML = "<b>" + S.name + "</b><span>" + S.blurb + "</span>" +
          "<span class='mode-meta'>" + counts.join(" or ") + " players · " + races + "</span>";
        if (!avail) {
          b.title = "Needs the Expansion Set";
          b.disabled = true;
        } else b.addEventListener("click", () => {
          state.scen = id;
          if (counts.indexOf(state.players) === -1) state.players = counts[0];
          update();
        });
        box.appendChild(b);
      }
    }
  }

  function renderRaces(c) {
    const box = $("#races");
    const note = $("#races-note");
    box.innerHTML = "";
    const pickable = state.scen === "main" && state.players === 2;
    for (const r of WC.RACE_ORDER) {
      const inPlay = c.race(r);
      const neutral = WC.S[state.scen].neutral === r;
      if (!pickable && !inPlay && !neutral) continue;
      const b = el("button", "chip race race-" + r + (inPlay ? " on" : "") + (pickable ? "" : " lock"));
      b.type = "button";
      b.setAttribute("aria-pressed", inPlay ? "true" : "false");
      b.innerHTML = "<b>" + WC.R[r].name + "</b><span>" + (neutral ? "neutral · not a player" : WC.R[r].color) + "</span>";
      b.title = WC.R[r].name + ": " + WC.R[r].blurb;
      if (pickable) b.addEventListener("click", () => {
        if (state.pick.indexOf(r) !== -1) return;         // keep exactly two: clicking a new race replaces the older pick
        state.pick = [state.pick[state.pick.length - 1], r];
        update();
      });
      else b.disabled = true;
      box.appendChild(b);
    }
    if (pickable) {
      const rnd = el("button", "chip rnd", "<b>🎲 Random pair</b><span>Rules p.3</span>");
      rnd.type = "button";
      rnd.title = "Randomly choose two races (Rules p.3)";
      rnd.addEventListener("click", () => {
        const pool = WC.RACE_ORDER.slice();
        const a = pool.splice(Math.floor(Math.random() * pool.length), 1)[0];
        const b2 = pool[Math.floor(Math.random() * pool.length)];
        state.pick = [a, b2];
        update();
      });
      box.appendChild(rnd);
    }
    note.textContent = pickable
      ? "Two-player main game: pick the two races in play, or roll them at random. Tap a race to swap it in."
      : (state.scen === "main" && state.players === 3
        ? "The page’s reading: the Three-Player Setup diagram marks Night Elf, Orc and Human Town spaces, so those three races play (Expansion p.3). The book doesn’t say how to seat the Undead."
        : (c.teams ? "Set by this scenario. Teams: " + c.teams.map(t => WC.rn(t)).join(" vs ") + "." : "Set by this scenario."));
  }

  function renderModules() {
    const box = $("#modules");
    box.innerHTML = "";
    const c = ctx();
    let shown = 0;
    for (const mod of WC.modules) {
      if (!WC.modAvailable(mod, c)) continue;
      shown++;
      const on = state.mods.has(mod.id);
      const b = el("button", "mod" + (on ? " on" : ""));
      b.type = "button";
      b.setAttribute("aria-pressed", on ? "true" : "false");
      b.innerHTML = "<span class='mod-name'>" + mod.name + "</span><span class='mod-sum'>" + mod.summary + "</span>";
      b.title = mod.description + " (" + mod.src + ")";
      b.addEventListener("click", () => {
        if (state.mods.has(mod.id)) {
          state.mods.delete(mod.id);
          if (mod.id === "creeps") state.mods.delete("heroes");      // heroes need creeps (Expansion p.5)
        } else {
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
    for (const phase of WC.phases) {
      const steps = phase.steps.filter(s => s.when(c));
      if (!steps.length) continue;
      const ph = el("div", "phase");
      ph.appendChild(el("h3", "phase-title", phase.title));
      for (const s of steps) {
        n++;
        const exp = resolve(s.exp, c);
        const meta = WC.expMeta[exp] || WC.expMeta.core;
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
    for (const sec of WC.reference) {
      if (!sec.when(c)) continue;
      if (!refInit && sec.open) openRefs.add(sec.title);
      const d = el("details", "ref");
      if (openRefs.has(sec.title)) d.open = true;
      d.appendChild(el("summary", null, resolve(sec.title, c)));
      const body = el("div", "ref-body", resolve(sec.html, c));
      if (sec.src) body.appendChild(el("div", "src-line", resolve(sec.src, c)));
      d.appendChild(body);
      d.addEventListener("toggle", () => { d.open ? openRefs.add(sec.title) : openRefs.delete(sec.title); });
      out.appendChild(d);
    }
    refInit = true;
  }

  /* Search visibility: rulebook, FAQ and Scenario Guide always; the Expansion Set rulebook when it is
     selected; each online scenario sheet only when that scenario is being played. */
  function docVisible(x, c) {
    switch (x) {
      case "exp": return c.has("exp");
      case "sc1": return c.scen === "orcsale";
      case "sc2": return c.scen === "goldrush";
      case "sc3": return c.scen === "plague";
      default: return true; // core, faq, guide
    }
  }

  function doSearch() {
    const fold = (s) => s.replace(/[‘’ʼ]/g, "'").replace(/[“”]/g, "\"");   // curly quotes match straight ones
    const q = fold($("#rsearch").value.trim().toLowerCase());
    const out = $("#rresults");
    out.innerHTML = "";
    const c = ctx();
    if (q.length < 3) {
      out.innerHTML = "<p class='rhint'>Type at least 3 characters to search the rulebook, the FAQ &amp; Errata, the Scenario Creation Guide" +
        (c.has("exp") ? ", the Expansion Set rulebook" : "") +
        (["orcsale", "goldrush", "plague"].indexOf(c.scen) !== -1 ? " and this scenario’s sheet" : "") + ".</p>";
      return;
    }
    const hits = [];
    for (const pg of WC.rulesIndex) {
      if (!docVisible(pg.x, c)) continue;
      const t = fold(pg.t.toLowerCase());
      const idx = t.indexOf(q);
      if (idx === -1) continue;
      hits.push({ pg, idx });
      if (hits.length >= 40) break;
    }
    if (!hits.length) {
      out.innerHTML = "<p class='rhint'>No matches in the documents for this setup.</p>";
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
    if (!box || !WC.teach) return;
    const secs = WC.teach.sections
      .filter(s => !s.when || s.when(c))
      .map(s => ({ h: resolve(s.h, c), html: resolve(s.body, c) }))
      .filter(s => s.html);
    WC._teachText = secs.map(s =>
      s.h.toUpperCase() + "\n" +
      s.html.replace(/<li>/g, "• ").replace(/<\/li>/g, "\n").replace(/<\/p>\s*<p>/g, "\n\n")
            .replace(/<[^>]+>/g, "").replace(/&amp;/g, "&").replace(/\n{3,}/g, "\n\n").trim()
    ).join("\n\n");
    box.innerHTML = "<div class='teach-top'><h3>📖 Teaching Script — this setup</h3><button type='button' class='teach-copy' id='teachCopy'>📋 Copy script</button></div>" +
      "<p class='teach-note'>" + WC.teach.intro + "</p>" +
      secs.map(s => "<h4>" + s.h + "</h4>" + s.html).join("");
    $("#teachCopy").addEventListener("click", () => {
      const b = $("#teachCopy"), t = b.textContent;
      const done = (msg) => { b.textContent = msg; setTimeout(() => { b.textContent = t; }, 1600); };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(WC._teachText || "").then(() => done("✓ Script copied"), () => done("Copy failed"));
      } else done("Copy failed");
    });
  }

  function update() {
    normalize();
    const c = ctx();
    renderExpansions();
    renderPlayers();
    renderModes();
    renderRaces(c);
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
