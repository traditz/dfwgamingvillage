/* =============================================================================
   Twilight Imperium 4th Edition — Setup & Reference Utility · app logic

   MODULE FILES. js/data-codex.js (global TI_CODEX) and js/data-te.js (global TI_TE) are optional;
   the page works without them. Each may define {sets, modes, modules, steps, reference, teach, notes}.
   Merge semantics (what the integrator can rely on):
   · sets     → extra "Sets in play" chips after Base + PoK, in file order (codex, then te); ids already
                present are ignored. Optional: requires (turning the set on turns those on; losing one
                turns this set off), maxPlayers (raises the player cap; PoK = 8).
   · modes    → extra buttons under "Game mode / scenario" after Standard and First game. Clicking a mode
                turns on the sets in its requires. Optional: minPlayers/maxPlayers, baseOnly. If a
                required set is turned off, the mode falls back to Standard.
   · modules  → option cards after the core options, shown only when requires holds, the current mode
                is in modes (null/absent = every mode), minPlayers ≤ p ≤ maxPlayers and p is in
                playerCounts (if given). Turning one on turns off everything in its excludes (module ids
                or core galaxy builds "gal-<id>") and anything whose excludes names it (an optional
                when(c) can hide a module too — the core "vp14" option uses it); a newly chosen
                galaxy build turns off modules that exclude it. choices:[{id,name,summary?,minPlayers?,
                maxPlayers?,playerCounts?,requires?}] makes a one-of module: while it is on,
                c.mod(moduleId) returns the selected choice id (a truthy string) and c.mod(choiceId) is
                true; the first available choice is the default.
   · requires → on sets, modes, modules and choices: every entry must be selected; an entry that is an
                array means any-of, e.g. requires: ["pok", ["codex2", "te"]].
   · steps    → inserted by `after`:
                "lrr-setup-N"          after core setup step N (0 = PoK box prep, 1–12 = LRR Complete Setup)
                "lrr-setup-N:replace"  replaces core step N while the module step's when(c) is true.
                                       If several are active, replacements that depend on a selected
                                       option or mode win over ones that depend only on the selected
                                       sets (e.g. a preset map beats Thunder's Edge's default
                                       hyperlane board); the survivors all show, in file order.
                "start"                box prep: right after core card lrr-setup-0 (before step 1)
                "end"                  after step 12 and everything anchored to it, before "Begin play"
                "play"                 after the closing "Begin play" card
                "<module step id>"     after that module step (declared earlier in load order)
                Unknown anchors are placed at "end" and reported in TI._errors. Steps sharing an
                anchor keep file order (codex file first). A step joins the phase of its anchor.
                exp = a set or mode id (tag label = set.short / mode.name).
   · reference→ appended after the core sections in file order; after:"<id>" / replace:"<id>" position
                one (replace only while its when(c) is true). Core ids: TI.reference[].id.
   · teach    → inserted before the core "later" (don't-worry) section in file order; slot:"hook" goes
                right after the core hook; after:"<id>" / replace:"<id>" as for reference; slot:"later"
                (or an id ending in "later") merges its <li> items into the core don't-worry list.
                Core ids: TI.teach.sections[].id.
   Context c (for every when/d/src/html/body): has(setId), p, mode, mod(id), galaxy (core build id), and
   galaxyFrom — null, "set" (a module step replaces setup step 6 because of the selected sets alone,
   e.g. Thunder's Edge hyperlanes) or "option" (a selected option/mode supplies the map).
   Errors inside module functions are caught (the item renders empty) and collected in TI._errors.
   ============================================================================= */
(function () {
  "use strict";

  /* ---------------- utilities ---------------- */
  const errors = (TI._errors = TI._errors || []);
  function logErr(where, e) {
    const msg = where + ": " + (e && e.message ? e.message : String(e));
    if (errors.indexOf(msg) === -1) errors.push(msg);
    try { console.error("[TI4] " + msg); } catch (x) { /* no console */ }
  }
  const isFn = (v) => typeof v === "function";
  function val(v, c, where, fb) {
    if (!isFn(v)) return v === undefined || v === null ? fb : v;
    try { const r = v(c); return r === undefined || r === null ? fb : r; } catch (e) { logErr(where, e); return fb; }
  }
  function test(fn, c, where) {
    if (fn === undefined || fn === null) return true;
    if (!isFn(fn)) return !!fn;
    try { return !!fn(c); } catch (e) { logErr(where, e); return false; }
  }
  const arr = (v) => (Array.isArray(v) ? v : v === undefined || v === null ? [] : [v]);
  /* requires: every entry must hold; an entry that is itself an array means "any of these" */
  const reqOk = (reqs, has) => arr(reqs).every((r) => (Array.isArray(r) ? r.some((x) => has(x)) : has(r)));
  const reqList = (reqs) => arr(reqs).map((r) => (Array.isArray(r) ? r[0] : r));   // sets to switch on
  const isLater = (t) => !!t && (t.slot === "later" || /(^|-)later$/.test(t.id || ""));

  /* ---------------- module files ---------------- */
  function readModuleFiles() {
    const out = [];
    try { if (typeof TI_CODEX !== "undefined" && TI_CODEX) out.push({ key: "codex", obj: TI_CODEX }); } catch (e) { /* absent */ }
    try { if (typeof TI_TE !== "undefined" && TI_TE) out.push({ key: "te", obj: TI_TE }); } catch (e) { /* absent */ }
    return out;
  }

  /* slots: core items with optional replacers / befores / afters placed by module items */
  function makeSlots(items, keyOf) {
    return items.map((it) => ({ key: keyOf(it), item: it, origin: "core", replacers: [], befores: [], afters: [], tail: [] }));
  }
  function findSlot(slots, key, last) {
    const hits = slots.filter((s) => s.key === key);
    return hits.length ? (last ? hits[hits.length - 1] : hits[0]) : null;
  }

  function buildModel(files) {
    const M = {
      files: files.map((f) => f.key),
      sets: [], modes: [], modules: [], expMeta: Object.assign({}, TI.expMeta), notes: [],
      stepSlots: null, stepStart: [], stepEnd: [], refSlots: null, refTail: [], teachSlots: null
    };
    const has = (list, id) => list.some((x) => x.id === id);
    TI.sets.forEach((s) => M.sets.push(Object.assign({ origin: "core" }, s)));
    TI.modes.forEach((m) => M.modes.push(Object.assign({ origin: "core" }, m)));
    TI.modules.forEach((m) => M.modules.push(Object.assign({ origin: "core" }, m)));

    for (const f of files) {
      const o = f.obj || {};
      for (const s of arr(o.sets)) {
        if (!s || !s.id || has(M.sets, s.id)) continue;
        M.sets.push(Object.assign({ origin: f.key }, s));
        if (!M.expMeta[s.id]) M.expMeta[s.id] = { name: s.short || s.name || s.id, cls: /^codex/.test(s.id) ? "tag-codex" : (s.id === "te" ? "tag-te" : "tag-mod") };
      }
      for (const m of arr(o.modes)) {
        if (!m || !m.id || has(M.modes, m.id)) continue;
        M.modes.push(Object.assign({ origin: f.key }, m));
        if (!M.expMeta[m.id]) M.expMeta[m.id] = { name: m.name || m.id, cls: "tag-mode" };
      }
      for (const m of arr(o.modules)) {
        if (!m || !m.id || has(M.modules, m.id)) continue;
        M.modules.push(Object.assign({ origin: f.key }, m));
      }
      for (const n of arr(o.notes)) M.notes.push("[" + f.key + "] " + n);
    }

    /* ---- setup steps ---- */
    const steps = [];
    TI.phases.forEach((ph, pi) => ph.steps.forEach((s) => steps.push(Object.assign({ _phase: pi }, s))));
    M.stepSlots = makeSlots(steps, (s) => s.anchor || s.id);
    const nodeById = {};
    for (const f of files) {
      for (const s of arr((f.obj || {}).steps)) {
        if (!s) continue;
        const node = { item: s, origin: f.key, afters: [] };
        const after = String(s.after === undefined ? "end" : s.after);
        const replace = /:replace$/.test(after);
        const anchor = after.replace(/:replace$/, "");
        let placed = true;
        if (anchor === "start") M.stepStart.push(node);
        else if (anchor === "end") M.stepEnd.push(node);
        else if (findSlot(M.stepSlots, anchor)) {
          if (replace) M.stepSlots.filter((sl) => sl.key === anchor).forEach((sl) => sl.replacers.push(node));
          else findSlot(M.stepSlots, anchor, true).afters.push(node);
        } else if (!replace && nodeById[anchor]) nodeById[anchor].afters.push(node);
        else placed = false;
        if (!placed) { M.stepEnd.push(node); logErr("module " + f.key + " step " + (s.id || "?"), "unknown anchor '" + after + "' — placed at end"); }
        if (s.id) nodeById[s.id] = node;
      }
    }

    /* ---- reference ---- */
    M.refSlots = makeSlots(TI.reference, (r) => r.id);
    for (const f of files) {
      for (const r of arr((f.obj || {}).reference)) {
        if (!r) continue;
        const node = { item: r, origin: f.key, afters: [] };
        const rs = r.replace && findSlot(M.refSlots, r.replace);
        const as = r.after && findSlot(M.refSlots, r.after);
        if (rs) rs.replacers.push(node);
        else if (as) as.afters.push(node);
        else M.refTail.push(node);
      }
    }

    /* ---- teaching script ---- */
    M.teachSlots = makeSlots(TI.teach.sections, (t) => t.id);
    M.teachLater = [];   // module "don't worry" lists, merged into the core "later" list
    const later = findSlot(M.teachSlots, "later");
    const hook = findSlot(M.teachSlots, "hook");
    for (const f of files) {
      for (const t of arr((f.obj || {}).teach)) {
        if (!t) continue;
        const node = { item: t, origin: f.key, afters: [] };
        const rs = t.replace && findSlot(M.teachSlots, t.replace);
        const as = t.after && findSlot(M.teachSlots, t.after);
        if (rs) rs.replacers.push(node);
        else if (as) as.afters.push(node);
        else if (isLater(t) && later) M.teachLater.push(node);
        else if (t.slot === "hook" && hook) hook.afters.push(node);
        else if (later) later.befores.push(node);
        else M.teachSlots.push({ key: "", item: null, origin: f.key, replacers: [], befores: [node], afters: [], tail: [] });
      }
    }
    return M;
  }

  /* flatten slots for a context: [{item, origin, phase}] in display order.
     extra: {start, startAfter, end, endAfter} — "start" nodes go right after the slot keyed startAfter
     (the core box-prep card) or first if there is none; "end" nodes after the last slot keyed endAfter. */
  function flatten(slots, c, label, extra) {
    const out = [];
    const done = new Set();
    const push = (node, phase) => {
      if (test(node.item.when, c, label + " when " + (node.item.id || ""))) out.push({ item: node.item, origin: node.origin, phase });
      for (const a of node.afters || []) push(a, phase);
    };
    const startAt = extra && extra.startAfter && slots.some((s) => s.key === extra.startAfter) ? extra.startAfter : null;
    if (!startAt) (extra && extra.start || []).forEach((n) => push(n, slots.length && slots[0].item ? slots[0].item._phase : 0));
    for (const sl of slots) {
      const phase = sl.item ? sl.item._phase : 0;
      for (const b of sl.befores) push(b, phase);
      let reps = sl.replacers.filter((n) => test(n.item.when, c, label + " when " + (n.item.id || "")));
      if (extra && extra.optionLevel && reps.some(extra.optionLevel)) reps = reps.filter(extra.optionLevel);
      if (reps.length) {
        for (const n of reps) if (!done.has(n)) { done.add(n); out.push({ item: n.item, origin: n.origin, phase }); (n.afters || []).forEach((a) => push(a, phase)); }
      } else if (sl.item && test(sl.item.when, c, label + " when " + (sl.item.id || ""))) {
        out.push({ item: sl.item, origin: sl.origin, phase });
      }
      for (const a of sl.afters) push(a, phase);
      if (startAt && startAt === sl.key && !findLaterKey(slots, sl)) (extra.start || []).forEach((n) => push(n, phase));
      if (extra && extra.endAfter === sl.key && !findLaterKey(slots, sl)) (extra.end || []).forEach((n) => push(n, phase));
    }
    if (extra && !slots.some((s) => s.key === extra.endAfter)) (extra.end || []).forEach((n) => push(n, slots.length ? slots[slots.length - 1].item._phase : 0));
    return out;
  }
  function findLaterKey(slots, sl) { const i = slots.indexOf(sl); return slots.slice(i + 1).some((s) => s.key === sl.key); }

  let M = buildModel(readModuleFiles());

  /* ---------------- state & context ---------------- */
  const state = {
    sets: new Set(["base", "pok"]),
    mode: "standard",
    players: 6,
    galaxy: "deal",
    mods: new Set(),
    choice: {},          // moduleId -> choiceId
    order: []            // module toggle order (latest last) for conflict resolution
  };

  /* c.mod(id): true for an option that is on; for a module with choices, returns the selected choice id
     (a truthy string); true for the selected choice's own id; true for "gal-<current galaxy build>".
     c.galaxyFrom: null (core build), "set" (a module step replaces setup step 6 for the selected sets
     alone, e.g. Thunder's Edge hyperlanes) or "option" (a selected option or mode supplies the map). */
  function ctxFrom(st, plain) {
    const c = {
      has: (id) => st.sets.has(id),
      p: st.players,
      mode: st.mode,
      galaxy: st.galaxy,
      mod: (id) => {
        if (st.mods.has(id)) {
          const m = M.modules.find((x) => x.id === id);
          return m && m.choices && st.choice[id] ? st.choice[id] : true;
        }
        if (id === "gal-" + st.galaxy) return true;
        for (const mid of Object.keys(st.choice)) if (st.mods.has(mid) && st.choice[mid] === id) return true;
        return false;
      }
    };
    if (!plain) Object.defineProperty(c, "galaxyFrom", { enumerable: true, get: () => galaxyFrom(st) });
    return c;
  }
  const ctx = () => ctxFrom(state);

  /* the same selections with every option off and the Standard mode: a replacement still active
     there depends only on the selected sets ("set-level"); otherwise it comes from an option/mode */
  const bareCtx = (st) => ctxFrom(Object.assign({}, st, { mods: new Set(), choice: {}, mode: "standard" }), true);
  function optionLevelTest(st) {
    const bare = bareCtx(st);
    return (node) => !test(node.item.when, bare, "replacer when " + (node.item.id || ""));
  }
  function galaxyFrom(st) {
    const c = ctxFrom(st, true), opt = optionLevelTest(st);
    const activeIn = (cc) => {
      const a = [];
      M.stepSlots.filter((s) => s.key === "lrr-setup-6").forEach((s) => s.replacers.forEach((n) => { if (test(n.item.when, cc, "galaxy replacer " + (n.item.id || ""))) a.push(n); }));
      return a;
    };
    const active = activeIn(c);
    if (!active.length) return null;
    /* Twilight's Fall replaces step 6 only to fold the galaxy build into its starting draft, which creates the
       game board "as normal" with the build chosen here (TF p.7). There the galaxy comes from an option only if
       a selected option would supply the map in a standard game (e.g. a Thunder's Edge premade map). */
    if (tfModeOn(c)) return activeIn(ctxFrom(Object.assign({}, st, { mode: "standard" }), true)).some(opt) ? "option" : null;
    return active.some(opt) ? "option" : "set";
  }

  const setById = (id) => M.sets.find((s) => s.id === id);
  const modeById = (id) => M.modes.find((m) => m.id === id);

  function maxPlayers() {
    let hi = 6;
    for (const s of M.sets) if (state.sets.has(s.id)) hi = Math.max(hi, s.id === "pok" ? 8 : (s.maxPlayers || 6));
    return hi;
  }
  function playerRange() {
    let lo = 3, hi = maxPlayers();
    const m = modeById(state.mode);
    if (m) { if (m.minPlayers) lo = Math.max(lo, m.minPlayers); if (m.maxPlayers) hi = Math.min(hi, m.maxPlayers); }
    return [lo, Math.max(lo, hi)];
  }

  function galaxyOptions(c) { return TI.galaxy.filter((g) => test(g.avail, c, "galaxy avail " + g.id)); }

  function choiceAvail(ch, c) {
    if (!ch) return false;
    if (ch.minPlayers && c.p < ch.minPlayers) return false;
    if (ch.maxPlayers && c.p > ch.maxPlayers) return false;
    if (Array.isArray(ch.playerCounts) && ch.playerCounts.indexOf(c.p) === -1) return false;
    if (ch.requires && !reqOk(ch.requires, c.has)) return false;
    if (ch.when && !test(ch.when, c, "choice when " + ch.id)) return false;
    return true;
  }
  function modAvailable(m, c) {
    if (!m) return false;
    if (m.requires && !reqOk(m.requires, c.has)) return false;
    if (Array.isArray(m.modes) && m.modes.indexOf(c.mode) === -1) return false;
    if (m.minPlayers && c.p < m.minPlayers) return false;
    if (m.maxPlayers && c.p > m.maxPlayers) return false;
    if (Array.isArray(m.playerCounts) && m.playerCounts.indexOf(c.p) === -1) return false;
    if (m.when && !test(m.when, c, "module when " + m.id)) return false;   // optional availability test
    if (m.choices && !arr(m.choices).some((ch) => choiceAvail(ch, c))) return false;
    return true;
  }
  const excl = (m) => arr(m && m.excludes);
  function conflicts(a, b) { // module objects or galaxy ids ("gal-x")
    const ida = typeof a === "string" ? a : a.id, idb = typeof b === "string" ? b : b.id;
    const ea = typeof a === "string" ? [] : excl(a), eb = typeof b === "string" ? [] : excl(b);
    return ea.indexOf(idb) !== -1 || eb.indexOf(ida) !== -1;
  }

  function normalize() {
    state.sets.add("base");
    // set dependencies (optional `requires` on module-file sets)
    for (let pass = 0; pass < 3; pass++) {
      for (const s of M.sets) {
        if (!state.sets.has(s.id) || !s.requires) continue;
        if (!reqOk(s.requires, (r) => state.sets.has(r))) state.sets.delete(s.id);
      }
    }
    // mode must be valid for the selected sets
    let mode = modeById(state.mode);
    if (!mode) { state.mode = "standard"; mode = modeById("standard"); }
    if (mode.requires && !reqOk(mode.requires, (r) => state.sets.has(r))) { state.mode = "standard"; mode = modeById("standard"); }
    if (mode.baseOnly) for (const s of [...state.sets]) if (s !== "base") state.sets.delete(s);
    // players
    const [lo, hi] = playerRange();
    if (state.players < lo) state.players = lo;
    if (state.players > hi) state.players = hi;
    // galaxy
    let c = ctx();
    const gOpts = galaxyOptions(c).map((g) => g.id);
    if (gOpts.indexOf(state.galaxy) === -1) state.galaxy = TI.defaultGalaxy(c);
    if (gOpts.indexOf(state.galaxy) === -1) state.galaxy = gOpts[0] || "deal";
    c = ctx();
    // modules: availability, choices, exclusions (latest toggle wins)
    for (const id of [...state.mods]) {
      const m = M.modules.find((x) => x.id === id);
      if (!modAvailable(m, c)) state.mods.delete(id);
    }
    const on = [...state.mods].sort((a, b) => state.order.lastIndexOf(b) - state.order.lastIndexOf(a)); // newest first
    const keep = [];
    for (const id of on) {
      const m = M.modules.find((x) => x.id === id);
      if (keep.some((k) => conflicts(M.modules.find((x) => x.id === k), m))) { state.mods.delete(id); continue; }
      keep.push(id);
    }
    // a selected module that excludes the current galaxy wins over the default galaxy choice
    for (const id of keep) {
      const m = M.modules.find((x) => x.id === id);
      if (excl(m).indexOf("gal-" + state.galaxy) !== -1) {
        const alt = galaxyOptions(ctx()).map((g) => g.id).find((g) => excl(m).indexOf("gal-" + g) === -1);
        if (alt) state.galaxy = alt; else state.mods.delete(id);
      }
    }
    c = ctx();
    for (const m of M.modules) {
      if (!m.choices || !state.mods.has(m.id)) continue;
      const avail = arr(m.choices).filter((ch) => choiceAvail(ch, c));
      if (!avail.some((ch) => ch.id === state.choice[m.id])) state.choice[m.id] = avail.length ? avail[0].id : undefined;
    }
  }

  /* ---------------- DOM helpers ---------------- */
  const $ = (s) => document.querySelector(s);
  const el = (tag, cls, html) => {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (html !== undefined) n.innerHTML = html;
    return n;
  };
  function button(cls, html, on, handler, title) {
    const b = el("button", cls, html);
    b.type = "button";
    if (on !== null && on !== undefined) b.setAttribute("aria-pressed", on ? "true" : "false");
    if (title) b.title = title;
    if (handler) b.addEventListener("click", handler);
    return b;
  }
  const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

  /* ---------------- configurator ---------------- */
  function renderSets() {
    const box = $("#expansions");
    box.innerHTML = "";
    const first = modeById(state.mode) && modeById(state.mode).baseOnly;
    for (const s of M.sets) {
      const locked = s.id === "base";
      const on = state.sets.has(s.id);
      const b = button("chip" + (on ? " on" : "") + (locked ? " lock" : ""), "<b>" + esc(s.short || s.name || s.id) + "</b><span>" + esc(s.year || "") + "</span>", on,
        locked ? null : () => {
          if (state.sets.has(s.id)) {
            state.sets.delete(s.id);
            for (const d of M.sets) if (d.requires && !reqOk(d.requires, (r) => state.sets.has(r))) state.sets.delete(d.id);
          } else {
            state.sets.add(s.id);
            reqList(s.requires).forEach((r) => { if (!reqOk([r], (x) => state.sets.has(x))) state.sets.add(r); });
            if (first) state.mode = "standard";
          }
          update();
        }, (s.blurb || "") + (locked ? " (always in play)" : first ? " — selecting it leaves the Learn to Play first game" : ""));
      if (locked) b.setAttribute("aria-disabled", "true");
      box.appendChild(b);
    }
  }

  function renderModes() {
    const box = $("#modes");
    box.innerHTML = "";
    for (const m of M.modes) {
      const on = state.mode === m.id;
      const missing = arr(m.requires).filter((r) => !reqOk([r], (x) => state.sets.has(x))).map((r) => (setById(Array.isArray(r) ? r[0] : r) || { short: String(r) }).short || String(r));
      const why = m.baseOnly && [...state.sets].some((s) => s !== "base") ? "Base game only — turns off the other sets" : (missing.length ? "Turns on: " + missing.join(", ") : "");
      const b = button("mode-btn" + (on ? " on" : ""), "<b>" + esc(m.name) + "</b><span>" + esc(m.blurb || "") + "</span>" + (why && !on ? "<span class=\"why\">" + esc(why) + "</span>" : ""), on, () => {
        state.mode = m.id;
        arr(m.requires).forEach((r) => {
          if (reqOk([r], (x) => state.sets.has(x))) return;
          const id = Array.isArray(r) ? r[0] : r;
          state.sets.add(id);
          reqList((setById(id) || {}).requires).forEach((q) => state.sets.add(q));
        });
        update();
      }, m.src ? "Source: " + m.src : "");
      box.appendChild(b);
    }
  }

  function renderPlayers() {
    const box = $("#players");
    box.innerHTML = "";
    const [lo, hi] = playerRange();
    for (let i = 3; i <= 8; i++) {
      const ok = i >= lo && i <= hi;
      const on = state.players === i;
      const b = button("pbtn" + (on ? " on" : "") + (ok ? "" : " off"), String(i), on, ok ? () => { state.players = i; update(); } : null,
        ok ? i + " players" : (i > maxPlayers() ? i + " players needs Prophecy of Kings" : i + " players isn’t available in this mode"));
      if (!ok) { b.disabled = true; b.setAttribute("aria-disabled", "true"); }
      box.appendChild(b);
    }
  }

  function renderGalaxy(c) {
    const box = $("#galaxy");
    box.innerHTML = "";
    const from = c.galaxyFrom;
    box.classList.toggle("superseded", from === "option");
    if (from === "option") box.appendChild(el("p", "note galaxy-note", "The selected game mode or option supplies this game’s galaxy — see setup step “Create the game board”. The build chosen here isn’t used."));
    for (const g of galaxyOptions(c)) {
      const on = state.galaxy === g.id;
      box.appendChild(button("mode-btn" + (on ? " on" : ""), "<b>" + esc(val(g.name, c, "galaxy name", g.id)) + "</b><span>" + esc(val(g.blurb, c, "galaxy blurb", "")) + "</span>", on,
        () => {
          state.galaxy = g.id;
          for (const id of [...state.mods]) { const m = M.modules.find((x) => x.id === id); if (excl(m).indexOf("gal-" + g.id) !== -1) state.mods.delete(id); }
          update();
        }, g.src ? "Source: " + g.src : ""));
    }
  }

  function toggleModule(m) {
    if (state.mods.has(m.id)) { state.mods.delete(m.id); }
    else {
      for (const id of [...state.mods]) { const o = M.modules.find((x) => x.id === id); if (conflicts(o, m)) state.mods.delete(id); }
      if (excl(m).indexOf("gal-" + state.galaxy) !== -1) {
        const alt = galaxyOptions(ctx()).map((g) => g.id).find((g) => excl(m).indexOf("gal-" + g) === -1);
        if (alt) state.galaxy = alt;
      }
      state.mods.add(m.id);
      state.order.push(m.id);
    }
    update();
  }

  function renderModules(c) {
    const box = $("#modules");
    box.innerHTML = "";
    let shown = 0;
    for (const m of M.modules) {
      if (!modAvailable(m, c)) continue;
      shown++;
      const on = state.mods.has(m.id);
      const title = (m.description || "") + (m.src ? " (" + m.src + ")" : "");
      const b = button("mod" + (on ? " on" : ""), "<span class='mod-name'>" + esc(m.name) + "</span><span class='mod-sum'>" + esc(m.summary || "") + "</span>", on, () => toggleModule(m), title);
      if (m.choices && on) {
        const wrap = el("div", "mod-wrap");
        wrap.appendChild(b);
        const cw = el("div", "mod-choices");
        cw.setAttribute("role", "group");
        cw.setAttribute("aria-label", m.name + " — choose one");
        for (const ch of arr(m.choices)) {
          if (!choiceAvail(ch, c)) continue;
          const con = state.choice[m.id] === ch.id;
          cw.appendChild(button("mod-choice" + (con ? " on" : ""), esc(ch.name || ch.id), con, () => { state.choice[m.id] = ch.id; update(); }, ch.summary || ch.description || ""));
        }
        wrap.appendChild(cw);
        box.appendChild(wrap);
      } else box.appendChild(b);
    }
    $("#modules-group").style.display = shown ? "" : "none";
  }

  /* ---------------- setup ---------------- */
  function stepList(c) {
    return flatten(M.stepSlots, c, "step", { start: M.stepStart, startAfter: "lrr-setup-0", end: M.stepEnd, endAfter: "lrr-setup-12", optionLevel: optionLevelTest(state) });
  }
  function renderSetup(c) {
    const out = $("#setup");
    out.innerHTML = "";
    const list = stepList(c);
    let n = 0, cur = null, ph = null;
    for (const it of list) {
      if (it.phase !== cur) {
        cur = it.phase;
        ph = el("div", "phase");
        ph.appendChild(el("h3", "phase-title", esc((TI.phases[cur] || {}).title || "")));
        out.appendChild(ph);
      }
      const s = it.item;
      n++;
      const exp = val(s.exp, c, "step exp " + (s.id || ""), it.origin === "core" ? "base" : "opt");
      const meta = M.expMeta[exp] || { name: exp, cls: "tag-mod" };
      const step = el("div", "step");
      if (s.id) step.id = "step-" + s.id;
      step.appendChild(el("div", "step-num", String(n)));
      const body = el("div", "step-body");
      const head = el("div", "step-head");
      head.appendChild(el("h4", null, val(s.t, c, "step title " + (s.id || ""), "")));
      head.appendChild(el("span", "tag " + meta.cls, esc(meta.name)));
      body.appendChild(head);
      body.appendChild(el("div", "step-text", val(s.d, c, "step body " + (s.id || ""), "")));
      const src = val(s.src, c, "step src " + (s.id || ""), "");
      if (src) body.appendChild(el("div", "src-line", esc(src)));
      step.appendChild(body);
      ph.appendChild(step);
    }
  }

  /* ---------------- reference ---------------- */
  function refList(c) {
    const core = flatten(M.refSlots.map((s) => Object.assign({}, s, { item: s.item ? Object.assign({ _phase: 0 }, s.item) : s.item })), c, "reference");
    const tail = [];
    for (const n of M.refTail) if (test(n.item.when, c, "reference when " + (n.item.id || ""))) tail.push({ item: n.item, origin: n.origin });
    return core.concat(tail);
  }
  function renderReference(c) {
    const out = $("#reference");
    const open = new Set([...out.querySelectorAll("details[open]")].map((d) => d.dataset.id));
    out.innerHTML = "";
    for (const it of refList(c)) {
      const r = it.item;
      const d = el("details", "ref");
      d.dataset.id = r.id || "";
      if (open.has(d.dataset.id)) d.open = true;
      const tag = it.origin !== "core" && r.exp && M.expMeta[val(r.exp, c, "ref exp", "")] ? " <span class=\"tag " + M.expMeta[val(r.exp, c, "ref exp", "")].cls + "\">" + esc(M.expMeta[val(r.exp, c, "ref exp", "")].name) + "</span>" : "";
      d.appendChild(el("summary", null, esc(val(r.title, c, "ref title " + (r.id || ""), "")) + tag));
      const body = el("div", "ref-body", val(r.html, c, "ref html " + (r.id || ""), ""));
      const src = val(r.src, c, "ref src " + (r.id || ""), "");
      if (src) body.appendChild(el("div", "src-line", esc(src)));
      d.appendChild(body);
      out.appendChild(d);
    }
  }

  /* ---------------- teaching script ---------------- */
  function teachList(c) {
    const secs = flatten(M.teachSlots.map((s) => Object.assign({}, s, { item: s.item ? Object.assign({ _phase: 0 }, s.item) : s.item })), c, "teach")
      .map((it) => ({ h: val(it.item.h, c, "teach h " + (it.item.id || ""), ""), html: val(it.item.body, c, "teach body " + (it.item.id || ""), ""), origin: it.origin, id: it.item.id }))
      .filter((s) => s.html);
    /* module "don't worry" lists (slot:"later", or an id ending in "later") join the core list */
    const extra = [];
    for (const n of M.teachLater || []) {
      if (!test(n.item.when, c, "teach when " + (n.item.id || ""))) continue;
      const body = String(val(n.item.body, c, "teach body " + (n.item.id || ""), ""));
      const lis = body.match(/<li>[\s\S]*?<\/li>/g);
      if (lis) extra.push(lis.join(""));
      else if (body.trim()) extra.push("<li>" + body.replace(/<\/?p>/g, "") + "</li>");
    }
    const last = secs[secs.length - 1];
    if (extra.length) {
      if (last && last.id === "later" && /<\/ul>\s*$/.test(last.html)) last.html = last.html.replace(/<\/ul>\s*$/, extra.join("") + "</ul>");
      else secs.push({ h: "Don’t worry about these until they come up", html: "<ul>" + extra.join("") + "</ul>", origin: "module", id: "later" });
    }
    return secs;
  }
  function teachText(secs) {
    return secs.map((s) =>
      String(s.h).toUpperCase() + "\n" +
      String(s.html).replace(/<li>/g, "• ").replace(/<\/li>/g, "\n").replace(/<\/p>\s*<p>/g, "\n\n")
        .replace(/<[^>]+>/g, "").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, "\"")
        .replace(/\n{3,}/g, "\n\n").trim()
    ).join("\n\n");
  }
  function renderTeach(c) {
    const box = $("#teach");
    if (!box) return;
    const secs = teachList(c);
    TI._teachText = teachText(secs);
    box.innerHTML = "<div class='teach-top'><h3>📖 Teaching Script — this setup</h3><button type='button' class='teach-copy' id='teachCopy'>📋 Copy script</button></div>" +
      "<p class='teach-note'>" + TI.teach.intro + "</p>" +
      secs.map((s) => "<h4>" + s.h + "</h4>" + s.html).join("");
    $("#teachCopy").addEventListener("click", () => {
      const b = $("#teachCopy"), t = b.textContent;
      const done = (msg) => { b.textContent = msg; setTimeout(() => { b.textContent = t; }, 1600); };
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(TI._teachText || "").then(() => done("✓ Script copied"), () => done("Copy failed"));
      else done("Copy failed");
    });
  }

  /* ---------------- rulebook search ---------------- */
  function tfModeOn(c) {
    const m = modeById(c.mode);
    return !!m && m.id !== "standard" && /twilight.?s.?fall|twilightsfall/i.test(m.id + " " + (m.name || ""));
  }
  function docVisible(x, c) {
    switch (x) {
      case "lrr": case "rr": case "ltp": case "errata": case "wiki": return true;
      case "pok": case "wiki-pok": return c.has("pok");
      case "wiki-base-only": return !c.has("pok");
      case "codex1": case "codex2": case "codex3": case "codex4": case "te": return c.has(x);
      case "wiki-codex1": return c.has("codex1") || c.has("te");
      case "wiki-codex2": return c.has("codex2") || c.has("te");
      case "wiki-codex3": return c.has("codex3") || c.has("te");
      case "wiki-codex3-pok": return c.has("pok") && (c.has("codex3") || c.has("te"));   // Ω leaders need PoK (TE p.4)
      case "wiki-pok-te": return c.has("pok") || c.has("te");                            // hyperlanes: PoK or TE maps
      case "tf": return tfModeOn(c) || c.has("tf");
      default: return true;
    }
  }
  function doSearch() {
    const input = $("#rsearch"), out = $("#rresults");
    const raw = input.value.trim();
    const q = raw.toLowerCase();
    out.innerHTML = "";
    if (q.length < 3) {
      out.innerHTML = "<p class='rhint'>Type at least 3 characters to search every rulebook for the selected sets and mode, plus the errata and the TI4 Wiki FAQ.</p>";
      return;
    }
    const c = ctx();
    const words = q.split(/\s+/).filter((w) => w.length > 1);
    const hits = [], loose = [];
    for (const pg of TI.rulesIndex || []) {
      if (!docVisible(pg.x, c)) continue;
      const t = pg.t.toLowerCase();
      const idx = t.indexOf(q);
      if (idx !== -1) hits.push({ pg, idx, len: q.length });
      else if (words.length > 1 && words.every((w) => t.indexOf(w) !== -1)) loose.push({ pg, idx: t.indexOf(words[0]), len: words[0].length });
    }
    const all = hits.concat(loose).slice(0, 60);
    if (!all.length) {
      out.innerHTML = "<p class='rhint'>No matches in the documents for the selected sets and mode.</p>";
      return;
    }
    out.appendChild(el("p", "rhint", all.length + (hits.length + loose.length > all.length ? "+" : "") + " matching page" + (all.length === 1 ? "" : "s") + (loose.length && !hits.length ? " (all words, not the exact phrase)" : "") + "."));
    const rxWords = (hits.length ? [q] : words).map((w) => w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
    const rx = new RegExp("(" + rxWords.join("|") + ")", "ig");
    for (const { pg, idx, len } of all) {
      const start = Math.max(0, idx - 130);
      const end = Math.min(pg.t.length, idx + len + 220);
      let snip = (start > 0 ? "…" : "") + pg.t.slice(start, end) + (end < pg.t.length ? "…" : "");
      snip = esc(snip).replace(rx, "<mark>$1</mark>");
      const hit = el("div", "rhit");
      hit.appendChild(el("div", "rhit-src", esc(pg.b) + (pg.p !== null && pg.p !== undefined ? " <span class='rhit-page'>— p." + esc(pg.p) + "</span>" : "")));
      hit.appendChild(el("div", "rhit-text", snip));
      out.appendChild(hit);
    }
  }

  /* ---------------- main ---------------- */
  function update() {
    normalize();
    const c = ctx();
    renderSets();
    renderModes();
    renderPlayers();
    renderGalaxy(c);
    renderModules(c);
    renderSetup(c);
    renderReference(c);
    renderTeach(c);
    doSearch();
    document.dispatchEvent(new CustomEvent("aid:config", { detail: c }));   // components glossary (js/comp-widget.js)
  }

  TI._debug = {
    state, ctx, ctxFrom, normalize, buildModel, readModuleFiles,
    setModel: (m) => { M = m; }, getModel: () => M,
    stepList, refList, teachList, teachText, docVisible, galaxyOptions, modAvailable, choiceAvail, playerRange
  };

  if (typeof document !== "undefined" && document.addEventListener) {
    document.addEventListener("DOMContentLoaded", () => {
      $("#rsearch").addEventListener("input", doSearch);
      $("#teachBtn").addEventListener("click", () => {
        const p = $("#teach");
        p.hidden = !p.hidden;
        $("#teachBtn").setAttribute("aria-expanded", p.hidden ? "false" : "true");
        const still = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        if (!p.hidden) p.scrollIntoView({ behavior: still ? "auto" : "smooth", block: "start" });
      });
      update();
    });
  }
})();
