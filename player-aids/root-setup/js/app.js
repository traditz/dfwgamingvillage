/* =============================================================================
   Root — Setup & Reference Utility · app logic
   The configuration engine (RT.normalize, RT.ctx) and all content live in the data files;
   this file only renders the configurator, setup, reference and teaching script.
   ============================================================================= */
(function () {
  "use strict";

  var state = RT.defaultState();
  var lastNotes = [];

  var $ = function (s) { return document.querySelector(s); };
  function el(tag, cls, html) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (html !== undefined) n.innerHTML = html;
    return n;
  }
  function btn(cls, html, on, title, onClick, disabled) {
    var b = el("button", cls + (on ? " on" : "") + (disabled ? " off" : ""), html);
    b.type = "button";
    b.setAttribute("aria-pressed", on ? "true" : "false");
    if (title) b.title = title;
    if (disabled) b.disabled = true;
    else if (onClick) b.addEventListener("click", onClick);
    return b;
  }
  function toggleSet(set, v) { if (set.has(v)) set.delete(v); else set.add(v); }

  /* ---------- configurator ---------- */
  function renderExpansions() {
    var box = $("#expansions");
    box.innerHTML = "";
    var lastGroup = null;
    RT.sets.forEach(function (s) {
      if (lastGroup && s.group !== lastGroup) box.appendChild(el("span", "chip-sep", "Extras:"));
      lastGroup = s.group;
      var locked = s.id === "base";
      var b = btn("chip" + (locked ? " lock" : ""), "<b>" + s.short + "</b><span>" + s.year + "</span>", state.sets.has(s.id),
        s.blurb + " (" + s.src + ")", locked ? null : function () { toggleSet(state.sets, s.id); update(); });
      box.appendChild(b);
    });
  }

  function renderModes(c) {
    var box = $("#modes");
    box.innerHTML = "";
    var modes = [
      { id: "standard", name: "Standard Setup", blurb: "Law §5.1 — use it when anyone is new. Assign factions, draw three cards." },
      { id: "advanced", name: "Advanced Setup", blurb: "Law App. A — for experienced players: maps, decks, landmarks, hirelings, a faction draft, keep 3 of 5 cards." },
      { id: "walkthrough", name: "Walkthrough game", blurb: "Learn by playing: two scripted turns with the four base factions, read aloud from the booklet." }
    ];
    var corners = state.factions.filter(function (id) { return RT.F[id].corner; }).length;
    modes.forEach(function (m) {
      var blocked = m.id === "standard" && corners >= 5;
      box.appendChild(btn("mode-btn", "<b>" + m.name + "</b><span>" + m.blurb + "</span>", state.setup === m.id,
        blocked ? "Five or more factions that start in corner clearings must use the Advanced Setup (Law p.4 §5)" : m.blurb,
        function () { state.setup = m.id; update(); }, blocked));
    });
    var adv = $("#advopts");
    adv.innerHTML = "";
    if (state.setup === "advanced") {
      var cardsOk = state.sets.has("marauder");
      var mustCards = corners >= 5;
      adv.appendChild(el("span", "sublabel", "Factions:"));
      adv.appendChild(btn("subbtn", "Draft with faction setup cards", c.advCards,
        cardsOk ? "Deal setup cards and draft (Law §A.8.1–A.8.3; the cards come in Marauder and Homeland)" : "The faction setup cards come in the Marauder expansion",
        function () { state.advCards = true; update(); }, !cardsOk));
      adv.appendChild(btn("subbtn", "Choose and set up as in Standard Setup", !c.advCards,
        mustCards ? "Five or more corner-starting factions need the setup cards" : "Law §A.8: you may choose and set up factions as in the Standard Setup",
        function () { state.advCards = false; update(); }, mustCards));
    }
  }

  function renderPlayers(c) {
    var box = $("#players");
    box.innerHTML = "";
    for (var i = 2; i <= 6; i++) {
      (function (n) {
        var dis = c.walk && n !== 4;
        box.appendChild(btn("pbtn", String(n), c.p === n,
          dis ? "The walkthrough game uses all four base factions" : n + " factions at the table (reach " + RT.reach[n] + "+)",
          function () { state.seats = n; update(); }, dis));
      })(i);
    }
    if (c.walk) box.appendChild(el("span", "hint inline", "Fewer than four people? Some play two factions."));
    else if (c.anyBot) box.appendChild(el("span", "hint inline", c.humans + " human" + (c.humans === 1 ? "" : "s") + " + " + c.nbots + " bot" + (c.nbots === 1 ? "" : "s")));
  }

  function renderFactions(c) {
    var box = $("#factions");
    box.innerHTML = "";
    var full = state.factions.length >= state.seats;
    RT.factions.forEach(function (f) {
      if (!RT.factionAvailable(state, f.id) && !(c.walk && RT.baseFour.indexOf(f.id) >= 0)) return;
      var on = c.fac(f.id);
      var hb = RT.hirelingBlocks(state, f.id);
      var needFirst = f.id === "vagabond2" && !c.fac("vagabond");
      var dis = c.walk || (!on && (full || !!hb || needFirst));
      var why = c.walk ? "The walkthrough game uses the four base factions"
        : hb ? "Its hireling (" + hb.name + ") is in play (Law p.23 §A.6.5)"
        : needFirst ? "Add the Vagabond first — the second Vagabond board is for two-Vagabond games (Law §9.7)"
        : (!on && full) ? "Already " + state.seats + " factions — remove one or add a seat"
        : f.name + " — reach " + f.reach + (f.corner ? " · starts in a corner" : "") + " (Law " + f.sec + ")";
      if (!dis && (f.id === "knaves" && c.vb) ) why = "Choosing the Knaves removes the Vagabond (Law §18.2.1)";
      if (!dis && ((f.id === "vagabond") && c.fac("knaves"))) why = "Choosing the Vagabond removes the Knaves (Law §18.2.1)";
      var tag = c.bot(f.id) ? "<em class='botmark'>bot</em>" : "";
      var b = btn("fchip fx-" + f.id, "<b>" + f.short + "</b><span>reach " + f.reach + "</span>" + tag, on, why, function () {
        var i = state.factions.indexOf(f.id);
        if (i >= 0) {
          state.factions.splice(i, 1);
          if (f.id === "vagabond") { var j = state.factions.indexOf("vagabond2"); if (j >= 0) state.factions.splice(j, 1); }
          delete state.bots[f.id];
        } else state.factions.push(f.id);
        update();
      }, dis);
      box.appendChild(b);
    });

    var rb = $("#reachbar");
    var parts = [];
    if (c.walk) parts.push("Walkthrough: Marquise, Eyrie, Alliance and Vagabond.");
    else {
      parts.push("<b>" + c.nfac + " of " + c.p + "</b> chosen" + (c.need ? " — choose " + c.need + " more" : "") + ".");
      if (c.adv && c.advCards) parts.push("Advanced Setup drafts factions from dealt setup cards and doesn't use reach — pick the factions that end up in play to see their steps.");
      else parts.push("Reach <b>" + c.reach + "</b> · viable for " + c.p + ": <b>" + c.reachNeed + "+</b> " + (c.nfac ? (c.reach >= c.reachNeed ? "<span class='ok'>✓ viable</span>" : "<span class='warn'>below the viable sum</span>") : "") + " <span class='muted'>(Law p.5 §5.2; adventurous: any mix with 17+)</span>");
      if (c.corners >= 5) parts.push("<span class='warn'>" + c.corners + " factions start in corners — Advanced Setup required (Law p.4 §5).</span>");
    }
    rb.innerHTML = parts.join(" ");

    var ml = $("#mixlist");
    ml.innerHTML = "";
    var mixes = RT.mixes.filter(function (m) {
      if (m.f.length !== state.seats || !state.sets.has(m.set)) return false;
      if (!m.f.every(function (id) { return RT.factionAvailable(state, id); })) return false;
      if (m.bots && !Object.keys(m.bots).every(function (fid) { return state.sets.has(RT.B[m.bots[fid]].set); })) return false;
      if (m.hire && !state.sets.has("marauder")) return false;
      return true;
    });
    if (!mixes.length) ml.appendChild(el("p", "hint", "No suggested mix for " + state.seats + " factions in the books you own."));
    if (state.sets.has("riverfolk") && state.seats >= 4)   // Riverfolk p.8 "Scenarios — Competitive Mode, Four or more players"
      ml.appendChild(el("p", "hint", "Riverfolk p.8: with four or more players, take any three-player mix and add any remaining one, two or three factions."));
    mixes.forEach(function (m) {
      var label = (m.torch ? "<span class='torch' title='Recommended for new players'>★</span> " : "") +
        m.f.map(function (id) { return RT.F[id].short + (m.bots && m.bots[id] ? " (" + RT.B[m.bots[id]].name + ")" : ""); }).join(" · ") +
        (m.mode ? " — " + m.mode : "") +
        (m.hire ? " <span class='muted'>+ optional hirelings: " + m.hire.map(function (h) { return RT.H[h].name; }).join(", ") + "</span>" : "") +
        " <span class='mixsrc'>" + m.src + "</span>";
      var b = btn("mixbtn", label, false, m.note || "Apply this mix", function () {
        state.setup = state.setup === "walkthrough" ? "standard" : state.setup;
        state.factions = m.f.slice();
        state.bots = {};
        if (m.bots) Object.keys(m.bots).forEach(function (fid) { state.bots[fid] = { type: m.bots[fid], diff: "default", traits: false }; });
        state.botPref = m.bots && Object.keys(m.bots).some(function (fid) { return !RT.B[m.bots[fid]].rb; }) ? "mmorig" : "rb";
        if (m.coop) state.variants.add("coop"); else state.variants.delete("coop");
        if (m.hire) { state.hirelings = true; state.hirelingsDealt = m.hire.slice(); }
        else state.hirelingsDealt = state.hirelingsDealt.filter(function (h) {   // drop dealt hirelings that would block this mix (Law §A.6.5)
          return !RT.H[h].blocks.some(function (b) { return m.f.indexOf(b) >= 0; });
        });
        update();
      });
      ml.appendChild(b);
    });
  }

  function renderMaps(c) {
    var box = $("#maps");
    box.innerHTML = "";
    RT.maps.forEach(function (m) {
      if (!state.sets.has(m.set)) return;
      box.appendChild(btn("chip mapchip", "<b>" + m.name + "</b><span>" + RT.expMeta[m.set].name + "</span>", c.map === m.id,
        m.blurb + " (" + m.src + ")", function () { state.map = m.id; update(); }, c.walk && m.id !== "autumn"));
    });
  }

  function renderDecks(c) {
    var box = $("#decks");
    box.innerHTML = "";
    var n = 0;
    RT.decks.forEach(function (d) {
      if (!state.sets.has(d.set)) return;
      n++;
      box.appendChild(btn("chip", "<b>" + d.name + "</b><span>" + (d.id === "standard" ? "54 cards" : "replaces the base deck") + "</span>", c.deck === d.id,
        (!c.adv && d.id !== "standard") ? "Advanced Setup only (Law p.22 §A.2)" : d.blurb, function () { state.deck = d.id; update(); }, (c.walk || !c.adv) && d.id !== "standard"));
    });
    $("#deck-group").style.display = n > 1 ? "" : "none";
  }

  function renderModules(c) {
    var box = $("#modules");
    box.innerHTML = "";
    var mods = [];
    if (state.sets.has("marauder") || state.sets.has("hpacks")) mods.push({ id: "hirelings", name: "Hirelings", on: state.hirelings,
      sum: "Exactly three hirelings go to the leader first: the first player to reach 4, 8 and 12 points each takes one, and each is handed to another player when its control markers run out; their factions sit out", src: "Law App. H · Marauder p.12",
      click: function () { state.hirelings = !state.hirelings; } });
    if (state.sets.has("homeland") || state.sets.has("lpack")) mods.push({ id: "landmarks", name: "Landmarks", on: state.landmarks > 0,
      sum: "One or two landmarks dealt onto the map", src: "Law §A.5, App. L · Homeland p.18",
      click: function () { state.landmarks = state.landmarks > 0 ? 0 : 1; } });
    if (state.seats === 2 && !c.anyBot) mods.push({ id: "twogames", name: RT.variants[0].name, on: state.variants.has("twogames"),
      sum: RT.variants[0].summary, src: RT.variants[0].src, click: function () { toggleSet(state.variants, "twogames"); } });
    if (c.anyBot) mods.push({ id: "coop", name: RT.variants[1].name, on: state.variants.has("coop"),
      sum: RT.variants[1].summary, src: c.mmorig && !c.rb ? "Riverfolk p.8" : "Rootbotics p.3", click: function () { toggleSet(state.variants, "coop"); } });
    if (c.mmorig && state.variants.has("coop")) mods.push({ id: "campaign", name: RT.variants[2].name, on: state.variants.has("campaign"),
      sum: RT.variants[2].summary, src: RT.variants[2].src, click: function () { toggleSet(state.variants, "campaign"); } });
    mods.forEach(function (m) {
      box.appendChild(btn("mod", "<span class='mod-name'>" + m.name + "</span><span class='mod-sum'>" + m.sum + "</span>", m.on,
        m.sum + " (" + m.src + ")", function () { m.click(); update(); }, c.walk));
    });
    $("#modules-group").style.display = mods.length ? "" : "none";
  }

  function optRow(label) {
    var row = el("div", "optrow");
    row.appendChild(el("span", "optlabel", label));
    return row;
  }
  function selectEl(id, opts, val, onChange, label) {
    var s = el("select", "optsel");
    s.id = id;
    if (label) s.setAttribute("aria-label", label);
    opts.forEach(function (o) {
      var op = document.createElement("option");
      op.value = o.id; op.textContent = o.name;
      if (o.id === val) op.selected = true;
      s.appendChild(op);
    });
    s.addEventListener("change", function () { onChange(s.value); update(); });
    return s;
  }

  function renderOptions(c) {
    var box = $("#options");
    box.innerHTML = "";
    if (c.walk) { $("#options-group").style.display = "none"; return; }

    // Vagabond characters
    ["vagabond", "vagabond2"].forEach(function (seat) {
      if (!c.human(seat)) return;
      var row = optRow((seat === "vagabond" ? "Vagabond" : "Second Vagabond") + " character" + (c.advCards ? " (dealt at random — pick the one you got)" : ""));
      var other = seat === "vagabond" ? state.vchar.vagabond2 : state.vchar.vagabond;
      var opts = RT.vcharsAvail(state).filter(function (v) { return !(c.human("vagabond") && c.human("vagabond2")) || v.id !== other; })
        .map(function (v) { return { id: v.id, name: v.name + " — " + RT.itemList(v.items) }; });
      row.appendChild(selectEl("vchar-" + seat, opts, state.vchar[seat], function (v) { state.vchar[seat] = v; }, "Vagabond character"));
      box.appendChild(row);
    });

    // Knave Captains
    if (c.human("knaves")) {
      var row = optRow("Knave Captains — choose 3" + (c.advCards ? " of the 4 dealt" : "") + " (Homeland includes warriors for the Jailor, Gladiator and Cheat)");
      var wrap = el("div", "optchips");
      RT.captains.forEach(function (k) {
        var on = state.captains.indexOf(k.id) >= 0;
        wrap.appendChild(btn("ochip", k.name, on, k.name + ": starts with " + RT.itemList(k.items) + " (Law App. K " + k.sec + ")", function () {
          if (on) { if (state.captains.length > 1) state.captains = state.captains.filter(function (x) { return x !== k.id; }); }
          else { state.captains.push(k.id); if (state.captains.length > 3) state.captains.shift(); }
          update();
        }));
      });
      row.appendChild(wrap);
      box.appendChild(row);
    }

    // Bots
    c.facs.forEach(function (id) {
      var avail = RT.botsFor(state, id);
      if (!avail.length) return;
      var row = optRow(RT.F[id].name + ": played by");
      var wrap = el("div", "optchips");
      var cur = state.bots[id] ? state.bots[id].type : null;
      wrap.appendChild(btn("ochip", "a person", !cur, "A human player", function () { delete state.bots[id]; update(); }));
      avail.forEach(function (b) {
        var tip = b.rb ? b.name + " — Law of Rootbotics bot (" + b.src + ")"
          : b.name + " — the Riverfolk book's older Marquise bot (" + b.src + "); not combined with Law of Rootbotics bots";
        wrap.appendChild(btn("ochip", b.name, cur === b.id, tip, function () {
          var prev = state.bots[id] || {};
          state.bots[id] = { type: b.id, diff: prev.diff || "default", traits: !!prev.traits, vbot: prev.vbot };
          state.botPref = b.rb ? "rb" : "mmorig";
          update();
        }));
      });
      row.appendChild(wrap);
      if (cur && RT.B[cur].rb) {
        var sub = el("div", "optsub");
        sub.appendChild(el("span", "optlabel", "Difficulty"));
        sub.appendChild(selectEl("diff-" + id, RT.difficulties, state.bots[id].diff, function (v) { state.bots[id].diff = v; }, RT.B[cur].name + " difficulty (Rootbotics §3.3.1)"));
        var lab = el("label", "optcheck");
        var cb = document.createElement("input");
        cb.type = "checkbox"; cb.checked = !!state.bots[id].traits;
        cb.addEventListener("change", function () { state.bots[id].traits = cb.checked; update(); });
        lab.appendChild(cb);
        lab.appendChild(document.createTextNode(" with trait cards"));
        lab.title = "Any number of this bot's trait cards (Rootbotics §3.3.2); choose which at the table";
        sub.appendChild(lab);
        if (cur === "vagabot" || cur === "vagabot2") {
          var otherSeat = id === "vagabond" ? "vagabond2" : "vagabond";
          var vopts = RT.vagabotsAvail(state).filter(function (v) { return !(state.bots[otherSeat] && state.bots[otherSeat].vbot === v.id); });
          sub.appendChild(el("span", "optlabel", "Character"));
          sub.appendChild(selectEl("vbot-" + id, vopts, state.bots[id].vbot, function (v) { state.bots[id].vbot = v; }, "Vagabot character (Rootbotics §7.7)"));
        }
        row.appendChild(sub);
      }
      box.appendChild(row);
    });
    if (c.fac("riverfolk") && state.sets.has("clockwork2") && RT.rbFacs(c).some(function (fid) { return fid !== "riverfolk"; })) {
      var srow = optRow("Bot Services cards — how bots use the Riverfolk's services (Rootbotics §9.7)");
      var sw = el("div", "optchips");
      sw.appendChild(btn("ochip", "Basic Services", state.services === "basic", "Only the 3 Basic Services cards", function () { state.services = "basic"; update(); }));
      sw.appendChild(btn("ochip", "Basic + Advanced", state.services === "advanced", "Basic and the 8 Advanced Services cards", function () { state.services = "advanced"; update(); }));
      srow.appendChild(sw);
      box.appendChild(srow);
    }

    // Hirelings dealt
    if (c.hire && state.sets.has("marauder")) {
      var hrow = optRow("Hirelings dealt (optional, up to 3 — a dealt hireling's faction can't be played)");
      var hw = el("div", "optchips");
      RT.hirelings.forEach(function (h) {
        var on = state.hirelingsDealt.indexOf(h.id) >= 0;
        hw.appendChild(btn("ochip", h.name + (h.alt ? " / " + h.alt : ""), on, "Blocks: " + h.blocks.map(RT.fname).join(", ") + " (" + h.src + ")", function () {
          if (on) state.hirelingsDealt = state.hirelingsDealt.filter(function (x) { return x !== h.id; });
          else { state.hirelingsDealt.push(h.id); if (state.hirelingsDealt.length > 3) state.hirelingsDealt.shift(); }
          update();
        }));
      });
      hrow.appendChild(hw);
      box.appendChild(hrow);
    }

    // Landmarks
    if (state.landmarks > 0) {
      var lrow = optRow("Landmarks: how many, and which cards are in the pool (Law §A.5.1)");
      var lw = el("div", "optchips");
      [1, 2].forEach(function (n) {
        lw.appendChild(btn("ochip", n + " landmark" + (n > 1 ? "s" : ""), state.landmarks === n, "Play with " + n, function () { state.landmarks = n; update(); }));
      });
      RT.landmarks.forEach(function (l) {
        if (!state.sets.has(l.set)) return;
        if (state.map === "marsh" && state.seats >= 5 && l.set === "homeland") return;   // already on the map (Law p.28 §M.5.1.II)
        var on = state.lmPool.indexOf(l.id) >= 0;
        lw.appendChild(btn("ochip", l.name, on, on ? "In the pool — click to remove" : "Add to the pool", function () {
          if (on) state.lmPool = state.lmPool.filter(function (x) { return x !== l.id; }); else state.lmPool.push(l.id);
          update();
        }));
      });
      lrow.appendChild(lw);
      box.appendChild(lrow);
    }
    $("#options-group").style.display = box.children.length ? "" : "none";
  }

  /* ---------- setup, reference, teach ---------- */
  function renderSetup(c) {
    var out = $("#setup");
    out.innerHTML = "";
    RT.setupFor(c).forEach(function (ph) {
      var p = el("div", "phase");
      p.appendChild(el("h3", "phase-title", ph.title));
      ph.steps.forEach(function (s) {
        var meta = RT.expMeta[s.exp] || RT.expMeta.base;
        var step = el("div", "step");
        step.appendChild(el("div", "step-num", String(s.n)));
        var body = el("div", "step-body");
        var head = el("div", "step-head");
        head.appendChild(el("h4", null, s.t));
        head.appendChild(el("span", "tag " + meta.cls, meta.name));
        body.appendChild(head);
        body.appendChild(el("div", "step-text", s.d));
        body.appendChild(el("div", "src-line", s.src));
        step.appendChild(body);
        p.appendChild(step);
      });
      out.appendChild(p);
    });
  }

  function renderReference(c) {
    var out = $("#reference");
    var open = {};
    Array.prototype.forEach.call(out.querySelectorAll("details.ref"), function (d) { if (d.open) open[d.dataset.id] = true; });
    out.innerHTML = "";
    RT.referenceFor(c).forEach(function (sec) {
      var d = el("details", "ref");
      d.dataset.id = sec.id;
      if (open[sec.id]) d.open = true;
      d.appendChild(el("summary", null, sec.title));
      var body = el("div", "ref-body", sec.html);
      if (sec.src) body.appendChild(el("div", "src-line", sec.src));
      d.appendChild(body);
      out.appendChild(d);
    });
  }

  function docVisible(x, c) {
    switch (x) {
      case "riverfolk": case "underworld": case "marauder": case "homeland": return c.has(x);
      case "bots": return c.has("clockwork") || c.has("clockwork2");
      default: return true;   // law, ltp, walk
    }
  }

  /* Rulebook search: rendered by js/search-widget.js (search standard v1). */
  window.AID_SEARCH = {
    index: RT.rulesIndex,
    visible: docVisible,
    hint: function (c) {
      var books = ["the Law of Root", "the Learning to Play guide", "the Walkthrough"];
      ["riverfolk", "underworld", "marauder", "homeland"].forEach(function (x) { if (c.has(x)) books.push("the " + RT.expMeta[x].name + " guide"); });
      if (c.has("clockwork") || c.has("clockwork2")) books.push("the Law of Rootbotics");
      return "Search this page, " + RT.list(books) + ". Type a word, a phrase or a question.";
    },
    noMatch: function () { return "No matches on this page or in the rulebooks for your collection."; },
    testQueries: ["outrage", "ferry", "turmoil", "lost souls"]
  };

  function renderTeach(c) {
    var box = $("#teach");
    if (!box) return;
    var secs = RT.teachFor(c);
    RT._teachText = secs.map(function (s) {
      return s.h.toUpperCase() + "\n" +
        s.html.replace(/<li>/g, "• ").replace(/<\/li>/g, "\n").replace(/<\/p>\s*<p>/g, "\n\n")
          .replace(/<[^>]+>/g, "").replace(/&amp;/g, "&").replace(/\n{3,}/g, "\n\n").trim();
    }).join("\n\n");
    box.innerHTML = "<div class='teach-top'><h3>📖 Teaching Script — this game</h3><button type='button' class='teach-copy' id='teachCopy'>📋 Copy script</button></div>" +
      "<p class='teach-note'>" + RT.teach.intro + "</p>" +
      secs.map(function (s) { return "<h4>" + s.h + "</h4>" + s.html; }).join("");
    $("#teachCopy").addEventListener("click", function () {
      var b = $("#teachCopy"), t = b.textContent;
      var done = function (msg) { b.textContent = msg; setTimeout(function () { b.textContent = t; }, 1600); };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(RT._teachText || "").then(function () { done("✓ Script copied"); }, function () { done("Copy failed"); });
      } else done("Copy failed");
    });
  }

  function renderNotes() {
    var n = $("#cfgnotes");
    n.innerHTML = lastNotes.length ? "<p>" + lastNotes.join("</p><p>") + "</p>" : "";
  }

  function update() {
    lastNotes = RT.normalize(state);
    var c = RT.ctx(state);
    renderExpansions();
    renderModes(c);
    renderPlayers(c);
    renderFactions(c);
    renderMaps(c);
    renderDecks(c);
    renderModules(c);
    renderOptions(c);
    renderNotes();
    renderSetup(c);
    renderReference(c);
    renderTeach(c);
    document.dispatchEvent(new CustomEvent("aid:config", { detail: c }));   // components glossary and rulebook search (js/comp-widget.js, js/search-widget.js)
  }

  document.addEventListener("DOMContentLoaded", function () {
    $("#teachBtn").addEventListener("click", function () {
      var p = $("#teach");
      p.hidden = !p.hidden;
      if (!p.hidden) p.scrollIntoView({ behavior: "smooth", block: "start" });
    });
    update();
  });
})();
