/* =============================================================================
   Terraforming Mars — Setup & Reference Utility · app logic

   MODULE FILE. js/data-automa.js (global TM_AUTOMA) is optional; the page works without it.
   It may define {sets, modes, modules, steps, reference, teach, notes}. Merge semantics:
   · sets      → extra "Sets in play" chips; an id already defined here (e.g. "automa") is skipped.
   · modes     → a mode whose id already exists here ("automa") is MERGED: the module file's fields
                 (blurb, minPlayers, maxPlayers, requires, src …) override the core fallback.
                 New ids are added after the core modes.
   · modules   → option cards after the core options, shown when requires holds (an array entry
                 inside requires means any-of), the mode is in modes (null/absent = every mode) and
                 minPlayers ≤ p ≤ maxPlayers. Turning one on turns off anything in its excludes (and
                 anything whose excludes names it). choices:[{id,name,summary}] makes a one-of option:
                 c.choice(id) returns the selected choice id (the first available one by default).
   · steps     → [{id, after, when(c), exp, t, d(c), src(c)}], placed by `after`:
                   "base-setup-N"          after Base setup step N (1–8) and what is already anchored there
                   "base-setup-N:replace"  instead of step N while the module step's when(c) is true
                   "start"                 before step 1
                   "end"                   after everything else, just before step 8 ("Start the game")
                   "play"                  after step 8
                   "<step id>"             after that step (core expansion steps: ma-setup, venus-setup,
                                           turmoil-setup, colonies-setup, solo-cities, prelude-setup —
                                           or a module step declared earlier)
                 Unknown anchors go to "end" and are reported in TM._errors. A step joins its anchor's
                 phase. exp = a set or mode id for the source tag.
   · reference → [{id, title, when(c), html(c), src(c)}] appended after the core sections, or placed
                 with after:"<id>" / replace:"<id>" (core ids: TM.reference[].id).
   · teach     → [{id, slot, h, when(c), body(c)}]: slot "hook" = right after the core hook; "insert"
                 (default) = before the core "later" list; "later" = its <li> items join the core list.
   Context c: has(setId), p (human players), mode, map, mod(id) → boolean, choice(id) → choice id | null.
   Errors inside data functions are caught (the item renders empty) and collected in TM._errors.
   ============================================================================= */
(function () {
  "use strict";

  /* ---------------- utilities ---------------- */
  const errors = (TM._errors = TM._errors || []);
  function logErr(where, e) {
    const msg = where + ": " + (e && e.message ? e.message : String(e));
    if (errors.indexOf(msg) === -1) errors.push(msg);
    try { console.error("[TM] " + msg); } catch (x) { /* no console */ }
  }
  const isFn = (v) => typeof v === "function";
  function val(v, c, where, fb) {
    if (!isFn(v)) return v === undefined || v === null ? fb : v;
    try { const r = v(c); return r === undefined || r === null || r === false ? fb : r; } catch (e) { logErr(where, e); return fb; }
  }
  function test(fn, c, where) {
    if (fn === undefined || fn === null) return true;
    if (!isFn(fn)) return !!fn;
    try { return !!fn(c); } catch (e) { logErr(where, e); return false; }
  }
  const arr = (v) => (Array.isArray(v) ? v : v === undefined || v === null ? [] : [v]);
  /* requires: every entry must hold; an entry that is itself an array means "any of these" */
  const reqOk = (reqs, has) => arr(reqs).every((r) => (Array.isArray(r) ? r.some((x) => has(x)) : has(r)));
  const reqList = (reqs) => arr(reqs).map((r) => (Array.isArray(r) ? r[0] : r));
  const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

  /* ---------------- module file ---------------- */
  function readModuleFiles() {
    const out = [];
    try { if (typeof TM_AUTOMA !== "undefined" && TM_AUTOMA) out.push({ key: "automa", obj: TM_AUTOMA }); } catch (e) { /* absent */ }
    return out;
  }

  const slot = (key, item, phase) => ({ key, item, phase, replacers: [], afters: [], befores: [] });

  function buildModel(files) {
    const M = {
      files: files.map((f) => f.key), sets: [], modes: [], modules: [], expMeta: Object.assign({}, TM.expMeta), notes: [],
      stepSlots: [], stepStart: [], stepEnd: [], stepPlay: [], refSlots: [], refTail: [], teachSlots: [], teachLater: []
    };
    const find = (list, id) => list.find((x) => x.id === id);
    TM.sets.forEach((s) => M.sets.push(Object.assign({ origin: "core" }, s)));
    TM.modes.forEach((m) => M.modes.push(Object.assign({ origin: "core" }, m)));
    TM.modules.forEach((m) => M.modules.push(Object.assign({ origin: "core" }, m)));

    for (const f of files) {
      const o = f.obj || {};
      for (const s of arr(o.sets)) {
        if (!s || !s.id || find(M.sets, s.id)) continue;
        M.sets.push(Object.assign({ origin: f.key }, s));
        if (!M.expMeta[s.id]) M.expMeta[s.id] = { name: s.short || s.name || s.id, cls: "tag-automa" };
      }
      for (const m of arr(o.modes)) {
        if (!m || !m.id) continue;
        const have = find(M.modes, m.id);
        if (have) Object.assign(have, m, { origin: "core+" + f.key });
        else M.modes.push(Object.assign({ origin: f.key }, m));
        if (!M.expMeta[m.id]) M.expMeta[m.id] = { name: m.name || m.id, cls: "tag-automa" };
      }
      for (const m of arr(o.modules)) {
        if (!m || !m.id || find(M.modules, m.id)) continue;
        M.modules.push(Object.assign({ origin: f.key }, m));
      }
      for (const n of arr(o.notes)) M.notes.push("[" + f.key + "] " + n);
    }

    /* ---- setup steps ---- */
    TM.phases.forEach((ph, pi) => ph.steps.forEach((s) => M.stepSlots.push(slot(s.id, s, pi))));
    const nodeById = {};
    for (const f of files) {
      for (const s of arr((f.obj || {}).steps)) {
        if (!s) continue;
        const node = { item: s, origin: f.key, afters: [] };
        const after = String(s.after === undefined || s.after === null ? "end" : s.after);
        const replace = /:replace$/.test(after);
        const anchor = after.replace(/:replace$/, "");
        const sl = M.stepSlots.find((x) => x.key === anchor);
        let placed = true;
        if (anchor === "start" && !replace) M.stepStart.push(node);
        else if (anchor === "end" && !replace) M.stepEnd.push(node);
        else if (anchor === "play" && !replace) M.stepPlay.push(node);
        else if (sl) { if (replace) sl.replacers.push(node); else sl.afters.push(node); }
        else if (!replace && nodeById[anchor]) nodeById[anchor].afters.push(node);
        else placed = false;
        if (!placed) { M.stepEnd.push(node); logErr("module " + f.key + " step " + (s.id || "?"), "unknown anchor '" + after + "' — placed at end"); }
        if (s.id) nodeById[s.id] = node;
      }
    }

    /* ---- reference ---- */
    M.refSlots = TM.reference.map((r) => slot(r.id, r, 0));
    for (const f of files) {
      for (const r of arr((f.obj || {}).reference)) {
        if (!r) continue;
        const node = { item: r, origin: f.key, afters: [] };
        const rs = r.replace && M.refSlots.find((x) => x.key === r.replace);
        const as = r.after && M.refSlots.find((x) => x.key === r.after);
        if (rs) rs.replacers.push(node);
        else if (as) as.afters.push(node);
        else M.refTail.push(node);
      }
    }

    /* ---- teaching script ---- */
    M.teachSlots = TM.teach.sections.map((t) => slot(t.id, t, 0));
    const hook = M.teachSlots.find((x) => x.key === "hook");
    const later = M.teachSlots.find((x) => x.key === "later");
    for (const f of files) {
      for (const t of arr((f.obj || {}).teach)) {
        if (!t) continue;
        const node = { item: t, origin: f.key, afters: [] };
        const rs = t.replace && M.teachSlots.find((x) => x.key === t.replace);
        const as = t.after && M.teachSlots.find((x) => x.key === t.after);
        if (rs) rs.replacers.push(node);
        else if (as) as.afters.push(node);
        else if (t.slot === "later" && later) M.teachLater.push(node);
        else if (t.slot === "hook" && hook) hook.afters.push(node);
        else if (later) later.befores.push(node);
        else M.teachSlots.push({ key: "", item: null, phase: 0, replacers: [], afters: [], befores: [node] });
      }
    }
    return M;
  }

  /* flatten slots for a context → [{item, origin, phase}] in display order */
  function flatten(slots, c, label, extra) {
    const out = [];
    const push = (node, phase) => {
      if (test(node.item.when, c, label + " when " + (node.item.id || ""))) out.push({ item: node.item, origin: node.origin, phase });
      for (const a of node.afters || []) push(a, phase);
    };
    if (extra && slots.length) (extra.start || []).forEach((n) => push(n, slots[0].phase));
    let prevPhase = slots.length ? slots[0].phase : 0;
    for (const sl of slots) {
      const phase = sl.phase;
      if (extra && extra.endBefore === sl.key) (extra.end || []).forEach((n) => push(n, prevPhase));
      for (const b of sl.befores) push(b, phase);
      const reps = sl.replacers.filter((n) => test(n.item.when, c, label + " when " + (n.item.id || "")));
      if (reps.length) {
        for (const n of reps) { out.push({ item: n.item, origin: n.origin, phase }); (n.afters || []).forEach((a) => push(a, phase)); }
      } else if (sl.item && test(sl.item.when, c, label + " when " + (sl.item.id || ""))) {
        out.push({ item: sl.item, origin: "core", phase });
      }
      for (const a of sl.afters) push(a, phase);
      if (extra && extra.playAfter === sl.key) (extra.play || []).forEach((n) => push(n, phase));
      prevPhase = phase;
    }
    if (extra && !slots.some((s) => s.key === extra.endBefore)) (extra.end || []).forEach((n) => push(n, prevPhase));
    if (extra && !slots.some((s) => s.key === extra.playAfter)) (extra.play || []).forEach((n) => push(n, prevPhase));
    return out;
  }

  let M = buildModel(readModuleFiles());

  /* ---------------- state & context ---------------- */
  const state = {
    sets: new Set(["base"]),
    mode: "standard",
    players: 3,
    map: "tharsis",
    mods: new Set(),
    choice: {},          // moduleId -> choiceId
    order: []            // option toggle order (latest last) for conflict resolution
  };

  function ctxFrom(st) {
    return {
      has: (id) => st.sets.has(id),
      p: st.players,
      mode: st.mode,
      map: st.map,
      mod: (id) => st.mods.has(id),
      choice: (id) => (st.mods.has(id) && st.choice[id] ? st.choice[id] : null)
    };
  }
  const ctx = () => ctxFrom(state);

  const setById = (id) => M.sets.find((s) => s.id === id);
  const modeById = (id) => M.modes.find((m) => m.id === id);
  const modById = (id) => M.modules.find((m) => m.id === id);
  const mapById = (id) => TM.maps.find((m) => m.id === id);

  function playerRange(st) {
    st = st || state;
    const m = modeById(st.mode) || {};
    const lo = m.minPlayers || 1, hi = m.maxPlayers || 5;
    return [lo, Math.max(lo, hi)];
  }

  /* map availability: its set is in play. (No rulebook bars a map from a mode: the MarsBot books cover six maps and
     say nothing about Amazonis Planitia; the MarsBot module states that plainly for Amazonis.) */
  function mapStatus(mp, st) {
    st = st || state;
    if (!st.sets.has(mp.set)) return { ok: false, hidden: true };
    if (mp.when && !test(mp.when, ctxFrom(st), "map when " + mp.id)) return { ok: false, why: mp.whenWhy || "" };
    return { ok: true };
  }

  function choiceAvail(ch, c) {
    if (!ch) return false;
    if (ch.minPlayers && c.p < ch.minPlayers) return false;
    if (ch.maxPlayers && c.p > ch.maxPlayers) return false;
    if (ch.requires && !reqOk(ch.requires, c.has)) return false;
    if (ch.modes && arr(ch.modes).indexOf(c.mode) === -1) return false;
    if (ch.when && !test(ch.when, c, "choice when " + ch.id)) return false;
    return true;
  }
  function modAvailable(m, c) {
    if (!m) return false;
    if (m.requires && !reqOk(m.requires, c.has)) return false;
    if (Array.isArray(m.modes) && m.modes.indexOf(c.mode) === -1) return false;
    if (m.minPlayers && c.p < m.minPlayers) return false;
    if (m.maxPlayers && c.p > m.maxPlayers) return false;
    if (m.when && !test(m.when, c, "module when " + m.id)) return false;
    if (m.choices && !arr(m.choices).some((ch) => choiceAvail(ch, c))) return false;
    return true;
  }
  const isForced = (m, c) => !!(m && m.forced && modAvailable(m, c) && test(m.forced, c, "module forced " + m.id));
  const excl = (m) => arr(m && m.excludes);
  const conflicts = (a, b) => !!a && !!b && a.id !== b.id && (excl(a).indexOf(b.id) !== -1 || excl(b).indexOf(a.id) !== -1);

  function normalize(st) {
    st = st || state;
    st.sets.add("base");
    for (let pass = 0; pass < 3; pass++) {
      for (const s of M.sets) if (st.sets.has(s.id) && s.requires && !reqOk(s.requires, (r) => st.sets.has(r))) st.sets.delete(s.id);
    }
    let mode = modeById(st.mode);
    if (!mode || (mode.requires && !reqOk(mode.requires, (r) => st.sets.has(r)))) { st.mode = "standard"; mode = modeById("standard"); }
    const [lo, hi] = playerRange(st);
    if (st.players < lo) st.players = lo;
    if (st.players > hi) st.players = hi;
    if (!mapById(st.map) || !mapStatus(mapById(st.map), st).ok) st.map = "tharsis";
    let c = ctxFrom(st);
    for (const id of [...st.mods]) if (!modAvailable(modById(id), c)) st.mods.delete(id);
    /* an option switched on only because the configuration forced it (e.g. the Corporate Era in solo) switches off
       again once it is no longer forced — leaving solo must not silently keep the Corporate Era's setup */
    st.autoOn = st.autoOn || new Set();
    for (const id of [...st.autoOn]) if (!isForced(modById(id), c)) { st.mods.delete(id); st.autoOn.delete(id); }
    for (const m of M.modules) if (isForced(m, c) && !st.mods.has(m.id)) { st.mods.add(m.id); st.autoOn.add(m.id); }
    /* exclusions: forced options first, then the most recently toggled wins */
    const on = [...st.mods].sort((a, b) => (isForced(modById(b), c) - isForced(modById(a), c)) || (st.order.lastIndexOf(b) - st.order.lastIndexOf(a)));
    const keep = [];
    for (const id of on) {
      const m = modById(id);
      if (keep.some((k) => conflicts(modById(k), m))) { st.mods.delete(id); continue; }
      keep.push(id);
    }
    c = ctxFrom(st);
    for (const m of M.modules) {
      if (!m.choices || !st.mods.has(m.id)) continue;
      const avail = arr(m.choices).filter((ch) => choiceAvail(ch, c));
      if (!avail.some((ch) => ch.id === st.choice[m.id])) st.choice[m.id] = avail.length ? avail[0].id : undefined;
    }
    return st;
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

  /* ---------------- configurator ---------------- */
  function renderSets() {
    const box = $("#expansions");
    box.innerHTML = "";
    for (const s of M.sets) {
      const locked = s.id === "base";
      const on = state.sets.has(s.id);
      const b = button("chip" + (on ? " on" : "") + (locked ? " lock" : ""), "<b>" + esc(s.short || s.name || s.id) + "</b><span>" + esc(s.year || s.tag || "") + "</span>", on,
        locked ? null : () => {
          if (state.sets.has(s.id)) {
            state.sets.delete(s.id);
            for (const d of M.sets) if (d.requires && !reqOk(d.requires, (r) => state.sets.has(r))) state.sets.delete(d.id);
          } else {
            state.sets.add(s.id);
            reqList(s.requires).forEach((r) => state.sets.add(r));
          }
          update();
        }, (s.blurb || "") + (locked ? " (always in play)" : ""));
      if (locked) b.setAttribute("aria-disabled", "true");
      box.appendChild(b);
    }
  }

  function renderModes() {
    const box = $("#modes");
    box.innerHTML = "";
    for (const m of M.modes) {
      const on = state.mode === m.id;
      const missing = arr(m.requires).filter((r) => !reqOk([r], (x) => state.sets.has(x))).map((r) => (setById(Array.isArray(r) ? r[0] : r) || { short: String(r) }).short);
      const why = missing.length ? "Turns on: " + missing.join(", ") : "";
      const b = button("mode-btn" + (on ? " on" : ""), "<b>" + esc(m.name) + "</b><span>" + esc(m.blurb || "") + "</span>" + (why && !on ? "<span class='why'>" + esc(why) + "</span>" : ""), on, () => {
        state.mode = m.id;
        reqList(m.requires).forEach((r) => { state.sets.add(r); reqList((setById(r) || {}).requires).forEach((q) => state.sets.add(q)); });
        const [lo, hi] = playerRange();
        if (state.players < lo || state.players > hi) state.players = m.id === "standard" ? 3 : lo;
        update();
      }, m.src ? "Source: " + m.src : "");
      box.appendChild(b);
    }
  }

  function renderPlayers() {
    const box = $("#players");
    box.innerHTML = "";
    const [lo, hi] = playerRange();
    for (let i = 1; i <= 5; i++) {
      const ok = i >= lo && i <= hi;
      const on = state.players === i;
      const b = button("pbtn" + (on ? " on" : "") + (ok ? "" : " off"), String(i), on, ok ? () => { state.players = i; update(); } : null,
        ok ? i + (i === 1 ? " player" : " players") : (i === 1 ? "1 player: choose the Solo game or Versus MarsBot" : i + " players: the standard game (2–5 players)"));
      if (!ok) { b.disabled = true; b.setAttribute("aria-disabled", "true"); }
      box.appendChild(b);
    }
  }

  function renderMaps() {
    const box = $("#maps");
    box.innerHTML = "";
    for (const mp of TM.maps) {
      const stt = mapStatus(mp);
      if (stt.hidden) continue;
      const on = state.map === mp.id;
      const b = button("mode-btn map-btn" + (on ? " on" : "") + (stt.ok ? "" : " off"),
        "<b>" + esc(mp.name) + "</b><span>" + esc(mp.blurb) + "</span>" + (stt.ok ? "" : "<span class='why'>Not available with these choices</span>"), on,
        stt.ok ? () => { state.map = mp.id; update(); } : null, stt.ok ? mp.box + " — source: " + mp.src : stt.why);
      if (!stt.ok) { b.disabled = true; b.setAttribute("aria-disabled", "true"); }
      box.appendChild(b);
    }
  }

  function toggleModule(m) {
    const c = ctx();
    if (isForced(m, c)) return;
    if (state.mods.has(m.id)) state.mods.delete(m.id);
    else {
      for (const id of [...state.mods]) if (conflicts(modById(id), m) && !isForced(modById(id), c)) state.mods.delete(id);
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
      const forced = isForced(m, c);
      const title = (forced && m.forcedWhy ? m.forcedWhy + " " : "") + (m.description || "") + (m.src ? " (" + m.src + ")" : "");
      const b = button("mod" + (on ? " on" : "") + (forced ? " lock" : ""), "<span class='mod-name'>" + esc(m.name) + (forced ? " <span class='mod-lock'>(set by your choices)</span>" : "") + "</span><span class='mod-sum'>" + esc(m.summary || "") + "</span>", on, forced ? null : () => toggleModule(m), title);
      if (forced) b.setAttribute("aria-disabled", "true");
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
    return flatten(M.stepSlots, c, "step", { start: M.stepStart, end: M.stepEnd, endBefore: "base-setup-8", play: M.stepPlay, playAfter: "base-setup-8" });
  }
  function renderSetup(c) {
    const out = $("#setup");
    out.innerHTML = "";
    if (c.mode === "automa" && M.files.indexOf("automa") === -1) {
      out.appendChild(el("p", "note flag", "The MarsBot rules module (js/data-automa.js) isn’t loaded, so MarsBot’s own setup steps are missing below — see the MarsBot rulebook (Automa A p.3)."));
    }
    const list = stepList(c);
    let n = 0, cur = null, ph = null;
    for (const it of list) {
      if (it.phase !== cur) {
        cur = it.phase;
        ph = el("div", "phase");
        ph.appendChild(el("h3", "phase-title", esc((TM.phases[cur] || {}).title || "")));
        out.appendChild(ph);
      }
      const s = it.item;
      n++;
      const exp = val(s.exp, c, "step exp " + (s.id || ""), it.origin === "core" ? "base" : "automa");
      const meta = M.expMeta[exp] || { name: exp, cls: "tag-automa" };
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
    const core = flatten(M.refSlots, c, "reference");
    const tail = [];
    for (const n of M.refTail) {
      if (test(n.item.when, c, "reference when " + (n.item.id || ""))) tail.push({ item: n.item, origin: n.origin });
      for (const a of n.afters || []) if (test(a.item.when, c, "reference when " + (a.item.id || ""))) tail.push({ item: a.item, origin: a.origin });
    }
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
      const exp = it.origin !== "core" ? val(r.exp, c, "ref exp " + (r.id || ""), it.origin) : null;
      const tag = exp && M.expMeta[exp] ? " <span class='tag " + M.expMeta[exp].cls + "'>" + esc(M.expMeta[exp].name) + "</span>" : "";
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
    const secs = flatten(M.teachSlots, c, "teach")
      .map((it) => ({ h: val(it.item.h, c, "teach h " + (it.item.id || ""), ""), html: String(val(it.item.body, c, "teach body " + (it.item.id || ""), "")), origin: it.origin, id: it.item.id }))
      .filter((s) => s.html.trim());
    const extra = [];
    for (const n of M.teachLater) {
      if (!test(n.item.when, c, "teach when " + (n.item.id || ""))) continue;
      const body = String(val(n.item.body, c, "teach body " + (n.item.id || ""), ""));
      const lis = body.match(/<li>[\s\S]*?<\/li>/g);
      if (lis) extra.push(lis.join(""));
      else if (body.trim()) extra.push("<li>" + body.replace(/<\/?p>/g, "") + "</li>");
    }
    if (extra.length) {
      const last = secs.find((s) => s.id === "later");
      if (last && /<\/ul>\s*$/.test(last.html)) last.html = last.html.replace(/<\/ul>\s*$/, extra.join("") + "</ul>");
      else secs.push({ h: "Don’t worry about these until they come up", html: "<ul>" + extra.join("") + "</ul>", origin: "module", id: "later" });
    }
    return secs;
  }
  function teachText(secs) {
    return secs.map((s) =>
      String(s.h).toUpperCase() + "\n" +
      String(s.html).replace(/<\/p>/g, "\n\n").replace(/<(ul|ol)\b[^>]*>/g, "\n").replace(/<li>/g, "• ").replace(/<\/li>/g, "\n")
        .replace(/<[^>]+>/g, "").replace(/[ \t]*\n[ \t]*/g, "\n").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, "\"")
        .replace(/\n{3,}/g, "\n\n").trim()
    ).join("\n\n");
  }
  function renderTeach(c) {
    const box = $("#teach");
    if (!box) return;
    const secs = teachList(c);
    TM._teachText = teachText(secs);
    box.innerHTML = "<div class='teach-top'><h3>📖 Teaching Script — this setup</h3><button type='button' class='teach-copy' id='teachCopy'>📋 Copy script</button></div>" +
      "<p class='teach-note'>" + TM.teach.intro + "</p>" +
      secs.map((s) => "<h4>" + s.h + "</h4>" + s.html).join("");
    $("#teachCopy").addEventListener("click", () => {
      const b = $("#teachCopy"), t = b.textContent;
      const done = (msg) => { b.textContent = msg; setTimeout(() => { b.textContent = t; }, 1600); };
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(TM._teachText || "").then(() => done("✓ Script copied"), () => done("Copy failed"));
      else done("Copy failed");
    });
  }

  /* ---------------- rulebook search ---------------- */
  function docVisible(x, c) {
    switch (x) {
      case "base": return true;
      case "he": case "av": case "uc": case "ma":
      case "venus": case "prelude2": case "colonies": case "turmoil": return c.has(x);
      case "prelude": return c.has("prelude") || (c.mode === "solo" && c.mod("tr-solo"));
      case "automaA": case "automaB": case "automaC": return c.has("automa");
      default: return true;
    }
  }
  /* Rendered by js/search-widget.js (search standard v1): this page's own answers first, then the ranked
     rulebook pages that docVisible allows; map names and "back cover" show as the page labels. (Guarded so
     app.js still loads in Node for TM._debug harnesses.) */
  if (typeof window !== "undefined") {
    window.AID_SEARCH = {
      index: TM.rulesIndex || [],
      visible: docVisible,
      hint: () => "Search this page, the base rulebook, the map boxes and the rulebooks for the sets selected above. Type a word, a phrase or a question.",
      noMatch: () => "No matches on this page or in the rulebooks for the selected sets."
    };
  }

  /* ---------------- main ---------------- */
  function update() {
    normalize();
    const c = ctx();
    renderSets();
    renderModes();
    renderPlayers();
    renderMaps();
    renderModules(c);
    renderSetup(c);
    renderReference(c);
    renderTeach(c);
    document.dispatchEvent(new CustomEvent("aid:config", { detail: c }));   // components glossary and rulebook search (js/comp-widget.js, js/search-widget.js)
  }

  TM._debug = {
    state, ctx, ctxFrom, normalize, buildModel, readModuleFiles,
    setModel: (m) => { M = m; }, getModel: () => M,
    stepList, refList, teachList, teachText, docVisible, modAvailable, choiceAvail, playerRange, mapStatus, isForced
  };

  if (typeof document !== "undefined" && document.addEventListener) {
    document.addEventListener("DOMContentLoaded", () => {
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
