/* =============================================================================
   Scythe — Setup & Reference Utility · app logic
   Spoiler gates: Rise of Fenris modules (standard mode) and the campaign
   (one episode at a time; rewards only after "episode over"). The rulebook
   search hides gated pages until the matching gate is open.
   ============================================================================= */
(function () {
  "use strict";

  const state = {
    exps: new Set(["core"]),
    mode: "standard",
    players: 3,
    opts: new Set(),        // modboard, mbvar, air, airadv, res, firstgame, delay, matorder
    mods: new Set(),        // Rise of Fenris modules (+ deshard, mpautoma)
    triumph: "std",         // std | war | peace | tiles (standard mode)
    modOpen: false,         // Rise of Fenris modules gate
    campOpen: false,        // campaign gate
    ep: "",                 // chosen episode id
    rewards: false,         // episode over: show rewards & outcome
    boxc: false,            // Episode 5: Box C opened
    prev2: "2a"             // which Episode 2 was played (for Ep 3-7)
  };
  const openRefs = new Set();

  const $ = (s) => document.querySelector(s);
  const el = (tag, cls, html) => {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (html !== undefined) n.innerHTML = html;
    return n;
  };
  const resolve = (v, c) => (typeof v === "function" ? v(c) : v);
  const btn = (cls, html, on, handler, title) => {
    const b = el("button", cls + (on ? " on" : ""), html);
    b.type = "button";
    b.setAttribute("aria-pressed", on ? "true" : "false");
    if (title) b.title = title;
    if (handler) b.addEventListener("click", handler);
    return b;
  };

  /* ---------------- context ---------------- */
  function ctx() {
    const has = (id) => state.exps.has(id);
    const camp = state.mode === "campaign" && has("rof") && state.campOpen;
    const ep = camp && state.ep ? SY.episodeById(state.ep) : null;
    const epi = ep ? ep.idx : -1;
    const modOpen = state.mode === "standard" && has("rof") && state.modOpen;
    const act = (id) => {
      // RoF p.3: the semi-official variant is for 3 or more players (seats), any number of them Automas
      if (id === "mpautoma") return (modOpen || camp) && state.mods.has("mpautoma") && state.players >= 3 && !(modOpen && state.mods.has("desolation"));
      if (state.mode === "standard") {
        if (!modOpen) return false;
        if (id === "war" || id === "peace" || id === "tiles") return trium() === id;
        if (id === "deshard") return state.mods.has("desolation") && state.mods.has("deshard");
        return state.mods.has(id);
      }
      if (!ep) return false;
      switch (id) {
        case "war": case "rivals": return ep.id === "2a" || (ep.id === "7" && state.prev2 === "2b");
        case "peace": case "alliances": return ep.id === "2b" || (ep.id === "7" && state.prev2 === "2a");
        case "tiles": case "tesla": return ep.id === "8a";
        case "madtesla": return ep.id === "8b";
        case "mechmods": return epi >= 4 || (epi >= 2 && state.prev2 === "2a");
        case "inframods": return epi >= 4 || (epi >= 2 && state.prev2 === "2b");
        case "vesna": return epi >= 3;
        case "fenris": return epi >= 5;
        default: return false;
      }
    };
    const trium = () => {
      if (state.mode === "standard") return !modOpen ? "std" : (state.mods.has("desolation") ? "tiles" : state.triumph);
      if (!ep) return "std";
      if (act("war")) return "war";
      if (act("peace")) return "peace";
      if (act("tiles")) return "tiles";
      return "std";
    };
    const coop = act("desolation");
    const wgOk = state.mode === "standard" ? true : !!(ep && ep.wg);
    const opt = (id) => {
      if (!state.opts.has(id)) return false;
      if (id === "mbvar") return has("mb") && state.opts.has("modboard");
      if (id === "modboard") return has("mb");
      if (id === "airadv") return has("wg") && state.opts.has("air") && wgOk;
      if (id === "air" || id === "res") return has("wg") && wgOk && !(id === "res" && coop);
      return true;
    };
    const solo = state.players === 1 && !coop;
    return {
      has, mode: state.mode, p: state.players, camp, ep, epId: ep ? ep.id : "", epi,
      modOpen, act, opt, triumph: trium(), coop, solo,
      automa: solo || act("mpautoma"),
      air: opt("air"), res: opt("res"),
      board: opt("modboard") ? "mod" : "std",
      rewards: !!ep && state.rewards, boxc: !!ep && ep.id === "5" && state.boxc, prev2: state.prev2
    };
  }

  /* ---------------- normalize ---------------- */
  function playerRange() { return [1, state.exps.has("ifa") ? 7 : 5]; }

  function normalize() {
    state.exps.add("core");
    const [lo, hi] = playerRange();
    if (state.players < lo) state.players = lo;
    if (state.players > hi) state.players = hi;
    if (!state.exps.has("rof")) { state.mode = "standard"; }
    if (!state.exps.has("mb")) { state.opts.delete("modboard"); state.opts.delete("mbvar"); }
    if (!state.opts.has("modboard")) state.opts.delete("mbvar");
    if (!state.exps.has("wg")) { state.opts.delete("air"); state.opts.delete("airadv"); state.opts.delete("res"); }
    if (!state.opts.has("air")) state.opts.delete("airadv");
    // Rise of Fenris module compatibility (RoF p.46, p.50-51)
    if (state.mods.has("desolation")) {
      state.triumph = "tiles";                 // Desolation uses the Triumph Tiles
      state.mods.delete("rivals");             // no Rivals, Mad Tesla, resolution tiles
      state.mods.delete("madtesla");
      state.mods.delete("mpautoma");           // the Automa doesn't support Desolation
      state.opts.delete("res");
    } else state.mods.delete("deshard");
    if (state.triumph === "peace") state.mods.delete("rivals");   // Rivals incompatible with Peace
    if (state.players < 3) state.mods.delete("mpautoma");
    // Campaign bookkeeping
    if (state.ep === "2a" || state.ep === "2b") state.prev2 = state.ep;
    if (state.ep !== "5") state.boxc = false;
  }

  /* ---------------- configurator ---------------- */
  function renderExpansions() {
    const box = $("#expansions");
    box.innerHTML = "";
    for (const e of SY.expansions) {
      const locked = e.id === "core";
      const on = state.exps.has(e.id);
      const b = btn("chip" + (locked ? " lock" : ""), "<b>" + e.short + "</b><span>" + e.year + "</span>", on,
        locked ? null : () => {
          if (on) state.exps.delete(e.id);
          else {
            state.exps.add(e.id);
            if (e.id === "mb") state.opts.add("modboard");
          }
          update();
        }, e.blurb);
      if (locked) b.setAttribute("aria-disabled", "true");
      box.appendChild(b);
    }
  }

  function renderModes() {
    const box = $("#modes");
    box.innerHTML = "";
    for (const m of SY.modes) {
      const ok = !m.requires || state.exps.has(m.requires);
      const b = btn("mode-btn" + (ok ? "" : " off"), "<b>" + m.name + "</b><span>" + (ok ? m.blurb : "Needs The Rise of Fenris.") + "</span>",
        state.mode === m.id, ok ? () => { state.mode = m.id; update(); } : null);
      if (!ok) { b.disabled = true; }
      box.appendChild(b);
    }
  }

  function renderPlayers() {
    const box = $("#players");
    box.innerHTML = "";
    const [lo, hi] = playerRange();
    for (let i = 1; i <= 7; i++) {
      const ok = i >= lo && i <= hi;
      const title = i === 1 ? "Solo: against the Automa (separate rulebook, not covered) or Desolation (Rise of Fenris)" : (!ok ? "6–7 players need Invaders from Afar's extra player mats" : i + " players");
      const b = btn("pbtn" + (ok ? "" : " off"), String(i), state.players === i, ok ? () => { state.players = i; update(); } : null, title);
      if (!ok) b.disabled = true;
      b.setAttribute("aria-label", i + (i === 1 ? " player" : " players") + (ok ? "" : " (needs Invaders from Afar)"));
      box.appendChild(b);
    }
    const note = $("#players-note");
    if (note) {
      const c = ctx();
      note.innerHTML = state.players === 1
        ? (c.coop ? "Solo Desolation: no Automa needed." : "Solo means playing against the <b>Automa</b>, whose rules are in its own rulebook — <b>not covered on this page</b>." + (state.exps.has("rof") && state.mode === "standard" ? (state.modOpen ? " Rise of Fenris's Desolation module can also be played solo, without an Automa." : " The Rise of Fenris's cooperative module can also be played solo (open its modules below).") : ""))
        : (state.exps.has("ifa") ? "" : "6–7 players need Invaders from Afar (its 2 extra factions and player mats 2a and 3a)." + (state.exps.has("mb") ? " The Modular Board supports up to 7 players, but only with those." : ""));
    }
  }

  function renderOptions() {
    const box = $("#options");
    box.innerHTML = "";
    const c = ctx();
    const groups = [
      { id: "board", label: "Modular Board", show: state.exps.has("mb") },
      { id: "wg", label: "The Wind Gambit", show: state.exps.has("wg") },
      { id: "var", label: "Variants", show: true }
    ];
    for (const g of groups) {
      if (!g.show) continue;
      const wrap = el("div", "opt-group");
      wrap.appendChild(el("div", "opt-label", g.label));
      const row = el("div", "mods");
      let items = SY.options.filter((o) => o.group === g.id);
      if (g.id === "board") items = [{ id: "modboard", name: "Play on the modular board", summary: "Random layout and faction draft (otherwise the standard board)", src: "Modular Board p.2" }].concat(items);
      for (const o of items) {
        if (o.needs && !state.opts.has(o.needs)) continue;
        if (o.id === "mbvar" && !state.opts.has("modboard")) continue;
        let disabled = false, why = "";
        if (g.id === "wg" && state.mode === "campaign") {
          if (!c.ep) { disabled = true; why = "Choose an episode first"; }
          else if (!c.ep.wg) { disabled = true; why = "Not allowed in " + c.ep.name.split(":")[0]; }
        }
        if (o.id === "res" && c.coop) { disabled = true; why = "Not used with Desolation"; }
        const on = state.opts.has(o.id) && !disabled;
        const sum = disabled ? why : (o.id === "res" && state.mode === "campaign" ? "Only the Doomsday Clock or Backup Plan tile" : o.summary);
        const b = btn("mod" + (disabled ? " off" : ""), "<span class='mod-name'>" + o.name + "</span><span class='mod-sum'>" + sum + "</span>", on,
          disabled ? null : () => { state.opts.has(o.id) ? state.opts.delete(o.id) : state.opts.add(o.id); update(); }, o.src);
        if (disabled) b.disabled = true;
        row.appendChild(b);
      }
      wrap.appendChild(row);
      box.appendChild(wrap);
    }
  }

  function renderRof() {
    const group = $("#modules-group");
    const box = $("#modules");
    const gateNote = $("#rof-note");
    box.innerHTML = "";
    const show = state.exps.has("rof") && state.mode === "standard";
    group.hidden = !show;
    if (!show) return;
    if (!state.modOpen) {
      gateNote.innerHTML = "<b>Spoiler gate.</b> The Rise of Fenris module list names content that its campaign reveals as you play; the book itself warns to read it only if you've finished the campaign or are skipping it (RoF p.50). Playing the campaign? Choose <b>Rise of Fenris campaign</b> above instead.";
      box.appendChild(btn("gate-btn", "I've finished the campaign or I'm skipping it — show the modules", false, () => { state.modOpen = true; update(); }));
      return;
    }
    gateNote.innerHTML = "Mix and match freely (RoF p.50–51). Compatibility the book states is applied automatically: Desolation uses the Triumph Tiles and excludes Rivals, Mad Tesla, resolution tiles and the Automa; Rivals and the Peace track exclude each other. <button type='button' class='link-btn' id='rofHide'>Hide the modules</button>";
    $("#rofHide").addEventListener("click", () => { state.modOpen = false; update(); });
    // Triumph Track choice
    const trow = el("div", "opt-group");
    trow.appendChild(el("div", "opt-label", "Triumph Track"));
    const tr = el("div", "mods");
    for (const t of SY.triumphs) {
      const locked = state.mods.has("desolation") && t.id !== "tiles";
      const b = btn("mod radio" + (locked ? " off" : ""), "<span class='mod-name'>" + t.name + "</span><span class='mod-sum'>" + (locked ? "Desolation uses the Triumph Tiles" : t.summary) + "</span>",
        state.triumph === t.id, locked ? null : () => {
          state.triumph = t.id;
          if (t.id === "peace") state.mods.delete("rivals");
          update();
        }, t.src);
      if (locked) b.disabled = true;
      tr.appendChild(b);
    }
    trow.appendChild(tr);
    box.appendChild(trow);
    const mrow = el("div", "opt-group");
    mrow.appendChild(el("div", "opt-label", "Modules"));
    const mr = el("div", "mods");
    for (const m of SY.modules) {
      if (m.needs && !state.mods.has(m.needs)) continue;
      let why = "";
      if (m.id === "rivals" && state.triumph === "peace") why = "Not with the Peace track — picking it switches the track back";
      if ((m.id === "rivals" || m.id === "madtesla" || m.id === "mpautoma") && state.mods.has("desolation")) why = "Not used with Desolation";
      if (m.id === "mpautoma" && state.players < 3) why = "Needs 3+ seats (set the player count)";
      const hard = why && (state.mods.has("desolation") || m.id === "mpautoma");
      const on = state.mods.has(m.id);
      const b = btn("mod" + (hard ? " off" : ""), "<span class='mod-name'>" + m.name + "</span><span class='mod-sum'>" + (why || m.summary) + "</span>", on,
        hard ? null : () => {
          if (on) state.mods.delete(m.id);
          else {
            state.mods.add(m.id);
            if (m.id === "rivals" && state.triumph === "peace") state.triumph = "std";
            if (m.id === "desolation") state.opts.delete("res");
          }
          update();
        }, m.src);
      if (hard) b.disabled = true;
      mr.appendChild(b);
    }
    mrow.appendChild(mr);
    box.appendChild(mrow);
  }

  function renderCampaign() {
    const group = $("#camp-group");
    const box = $("#campaign");
    box.innerHTML = "";
    const show = state.mode === "campaign" && state.exps.has("rof");
    group.hidden = !show;
    if (!show) return;
    if (!state.campOpen) {
      box.appendChild(el("p", "warn", "<b>Spoiler warning.</b> The Rise of Fenris asks campaign players not to look ahead: don't open or look through tuckboxes A–E or punchboards 1–6, and don't read an episode's outcome or rewards until it ends (RoF p.2–3). This page shows only the episode you pick, and its rewards only once you say the episode is over. The rulebook search also stays out of episode pages until you open this gate."));
      box.appendChild(btn("gate-btn", "We're playing the campaign — open the gate", false, () => { state.campOpen = true; update(); }));
      return;
    }
    const top = el("div", "camp-top", "<span>Campaign gate open.</span>");
    const closeB = btn("link-btn", "Close the gate", false, () => { state.campOpen = false; state.ep = ""; state.rewards = false; state.boxc = false; update(); });
    top.appendChild(closeB);
    box.appendChild(top);
    box.appendChild(el("div", "opt-label", "Episode"));
    const grid = el("div", "ep-grid");
    grid.id = "episodes";
    // Titles show only for the chosen episode and the ones before it, so the list itself spoils nothing.
    const sel = state.ep ? SY.episodeById(state.ep) : null;
    for (const e of SY.episodes) {
      const label = e.name.split(":")[0];
      const known = !!sel && (e.idx < sel.idx || e.id === sel.id);
      grid.appendChild(btn("ep-btn", "<b>" + label + "</b>" + (known ? "<span>" + e.name.split(": ")[1] + "</span>" : ""), state.ep === e.id,
        () => { if (state.ep !== e.id) { state.ep = e.id; state.rewards = false; state.boxc = false; } update(); }, known ? e.name + " · " + e.date : label));
    }
    box.appendChild(grid);
    if (!state.ep) return;
    const c = ctx();
    const flags = el("div", "mods camp-flags");
    if (c.epi >= 2) {
      const w = el("div", "seg", "<span class='seg-label'>Episode 2 was</span>");
      for (const id of ["2a", "2b"]) {
        w.appendChild(btn("seg-btn", id === "2a" ? "War (2a)" : "Peace (2b)", state.prev2 === id, () => { state.prev2 = id; update(); }));
      }
      flags.appendChild(w);
    }
    if (state.ep === "5") {
      flags.appendChild(btn("mod", "<span class='mod-name'>Box C has been opened</span><span class='mod-sum'>Shows the Box C rules (RoF p.28)</span>", state.boxc, () => { state.boxc = !state.boxc; update(); }));
    }
    flags.appendChild(btn("mod", "<span class='mod-name'>Episode over — show rewards</span><span class='mod-sum'>Outcome and rewards: read only after the game ends</span>", state.rewards, () => { state.rewards = !state.rewards; update(); }));
    if (state.players >= 3) {
      flags.appendChild(btn("mod", "<span class='mod-name'>Automas at the table</span><span class='mod-sum'>Semi-official multiplayer Automa (RoF p.48–49)</span>", state.mods.has("mpautoma"), () => { state.mods.has("mpautoma") ? state.mods.delete("mpautoma") : state.mods.add("mpautoma"); update(); }));
    }
    box.appendChild(flags);
  }

  /* ---------------- content ---------------- */
  function renderSetup(c) {
    const out = $("#setup");
    out.innerHTML = "";
    let n = 0;
    for (const phase of SY.phases) {
      const steps = phase.steps.filter((s) => s.when(c));
      if (!steps.length) continue;
      const ph = el("div", "phase");
      ph.appendChild(el("h3", "phase-title", resolve(phase.title, c)));
      for (const s of steps) {
        n++;
        const exp = resolve(s.exp, c);
        const meta = SY.expMeta[exp] || SY.expMeta.core;
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
    for (const sec of SY.reference) {
      if (!sec.when(c)) continue;
      const d = el("details", "ref");
      if (openRefs.has(sec.title)) d.open = true;
      d.addEventListener("toggle", () => { d.open ? openRefs.add(sec.title) : openRefs.delete(sec.title); });
      d.appendChild(el("summary", null, sec.title));
      const body = el("div", "ref-body", resolve(sec.html, c));
      if (sec.src) body.appendChild(el("div", "src-line", resolve(sec.src, c)));
      d.appendChild(body);
      out.appendChild(d);
    }
  }

  /* search visibility by document key (see build_rules_scythe.py) */
  // An episode's pages open once you reach it. Of the two Episode 2 branches, only the one
  // you played opens, until Episode 7 switches on the other branch's rules (RoF p.34).
  // Episode 8a/8b are alternatives: only the chosen one opens.
  function reached(id, c) {
    const e = SY.episodeById(id);
    if (!e || !c.ep) return false;
    if (e.id === c.epId) return true;
    if (e.idx >= c.epi) return false;
    if (e.idx === 1) return e.id === c.prev2 || c.epi >= 6;
    return true;
  }
  function past(id, c) {
    const e = SY.episodeById(id);
    if (!e || !c.ep) return false;
    if (e.id === c.epId) return c.rewards;
    return reached(id, c);
  }
  function docVisible(x, c) {
    if (x === "core" || x === "qrg" || x === "for") return true;
    if (x === "ifa" || x === "wg" || x === "mb") return c.has(x);
    if (!c.has("rof")) return false;
    if (x === "rofsafe") return true;
    // Modular Board p.2 step 3b names/counts the Rise of Fenris factions: only once both are revealed
    if (x === "mbrof") return c.has("mb") && (c.modOpen || SY.revealed(c, "fenris"));
    // RoF p.48-49 (multiplayer Automa variant, no spoilers): with the module gate or with Automas at the table
    if (x === "rofmp") return c.modOpen || c.act("mpautoma");
    if (x === "rofmod") return c.modOpen;
    if (x.indexOf("mod@") === 0) return c.modOpen || (c.camp && reached(x.slice(4), c));
    if (x === "mods:mech") return c.modOpen || SY.revealed(c, "mechmods") || (c.camp && c.automa && !!c.ep && (c.epi >= 2 || (c.epi === 1 && c.rewards)));
    if (x === "mods:infra") return c.modOpen || SY.revealed(c, "inframods");
    if (x === "vesna") return c.modOpen || SY.revealed(c, "vesna");
    if (x === "fenris") return c.modOpen || SY.revealed(c, "fenris");
    if (x === "madtesla") return c.modOpen || (c.camp && c.epId === "8b");
    if (x === "boxc") return c.camp && !!c.ep && (c.boxc || c.epi >= 5);
    if (x === "end") return c.camp && (c.epId === "8a" || c.epId === "8b") && c.rewards;
    if (x.indexOf("ep:") === 0) return c.camp && reached(x.slice(3), c);
    if (x.indexOf("epr:") === 0) return c.camp && past(x.slice(4), c);
    return false;
  }

  function doSearch() {
    const q = $("#rsearch").value.trim().toLowerCase();
    const out = $("#rresults");
    out.innerHTML = "";
    if (q.length < 3) {
      out.innerHTML = "<p class='rhint'>Type at least 3 characters to search the rulebooks for the sets selected above.</p>";
      return;
    }
    const c = ctx();
    const hits = [];
    // Say what is hidden without saying whether it matched (a count would leak spoilers).
    const gated = !c.has("rof") ? "" : c.camp
      ? " Rise of Fenris pages for episodes you haven't reached (and rewards not yet unlocked) are left out."
      : (c.modOpen ? " Rise of Fenris campaign episode pages are left out (open the campaign gate to include them)."
                   : " Rise of Fenris campaign and module pages are left out until you open a spoiler gate above.");
    for (const pg of SY.rulesIndex) {
      if (!docVisible(pg.x, c)) continue;
      const t = pg.t.toLowerCase();
      const idx = t.indexOf(q);
      if (idx === -1) continue;
      hits.push({ pg, idx });
      if (hits.length >= 40) break;
    }
    if (!hits.length) {
      out.innerHTML = "<p class='rhint'>No matches in the selected sets' documents." + gated + "</p>";
      return;
    }
    const rx = new RegExp("(" + q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + ")", "ig");
    for (const { pg, idx } of hits) {
      const start = Math.max(0, idx - 130);
      const end = Math.min(pg.t.length, idx + q.length + 200);
      let snip = (start > 0 ? "…" : "") + pg.t.slice(start, end) + (end < pg.t.length ? "…" : "");
      snip = snip.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(rx, "<mark>$1</mark>");
      const hit = el("div", "rhit" + (pg.x === "for" ? " fan" : ""));
      hit.appendChild(el("div", "rhit-src", pg.b + " — p." + pg.p));
      hit.appendChild(el("div", "rhit-text", snip));
      out.appendChild(hit);
    }
    if (gated) out.appendChild(el("p", "rhint", gated.trim()));
  }

  function renderTeach(c) {
    const box = $("#teach");
    if (!box || !SY.teach) return;
    const secs = SY.teach.sections
      .filter((s) => !s.when || s.when(c))
      .map((s) => ({ h: resolve(s.h, c), html: resolve(s.body, c) }))
      .filter((s) => s.html);
    SY._teachText = secs.map((s) =>
      s.h.toUpperCase() + "\n" +
      s.html.replace(/<li>/g, "• ").replace(/<\/li>/g, "\n").replace(/<\/p>\s*<p>/g, "\n\n")
        .replace(/<[^>]+>/g, "").replace(/&amp;/g, "&").replace(/\n{3,}/g, "\n\n").trim()
    ).join("\n\n");
    box.innerHTML = "<div class='teach-top'><h3>📖 Teaching script — this setup</h3><button type='button' class='teach-copy' id='teachCopy'>📋 Copy script</button></div>" +
      "<p class='teach-note'>" + SY.teach.intro + "</p>" +
      secs.map((s) => "<h4>" + s.h + "</h4>" + s.html).join("");
    $("#teachCopy").addEventListener("click", () => {
      const b = $("#teachCopy"), t = b.textContent;
      const done = (msg) => { b.textContent = msg; setTimeout(() => { b.textContent = t; }, 1600); };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(SY._teachText || "").then(() => done("✓ Script copied"), () => done("Copy failed"));
      } else done("Copy not available");
    });
  }

  function update() {
    normalize();
    renderExpansions();
    renderModes();
    renderPlayers();
    renderOptions();
    renderRof();
    renderCampaign();
    const c = ctx();
    renderSetup(c);
    renderReference(c);
    renderTeach(c);
    doSearch();
  }

  // expose a read-only hook for the test harness
  SY._debug = { state, ctx, normalize, docVisible };

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
