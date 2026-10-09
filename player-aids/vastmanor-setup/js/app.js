/* =============================================================================
   Vast: The Mysterious Manor — Setup & Reference Utility · app logic
   The configuration model (state → context) lives in data.js (VM.normalize / VM.makeCtx)
   so the Node harness can use exactly the same logic.
   ============================================================================= */
(function () {
  "use strict";

  var state = VM.defaultState();

  var $ = function (s) { return document.querySelector(s); };
  function el(tag, cls, html) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (html !== undefined) n.innerHTML = html;
    return n;
  }
  function resolve(v, c) { return typeof v === "function" ? v(c) : v; }
  function btn(cls, html, on, disabledWhy, onClick) {
    var b = el("button", cls + (on ? " on" : "") + (disabledWhy ? " off" : ""), html);
    b.type = "button";
    b.setAttribute("aria-pressed", on ? "true" : "false");
    if (disabledWhy) { b.title = disabledWhy; b.setAttribute("aria-disabled", "true"); }
    else if (onClick) b.addEventListener("click", onClick);
    return b;
  }

  /* ---- configurator ------------------------------------------------------- */
  function renderModes() {
    var box = $("#modes");
    box.innerHTML = "";
    VM.modes.forEach(function (m) {
      box.appendChild(btn("mode-btn", "<b>" + m.name + "</b><span>" + m.blurb + "</span>", state.mode === m.id, "", function () { state.mode = m.id; update(); }));
    });
  }

  function renderExpansions() {
    var box = $("#expansions");
    box.innerHTML = "";
    var core = btn("chip lock", "<b>Vast: The Mysterious Manor</b><span>Core game · always in play</span>", true, "", null);
    core.title = "The core game";
    box.appendChild(core);
    box.appendChild(btn("chip", "<b>The Haunted Hallways</b><span>Expansion · 2 roles, 4 Skeletons, miniatures</span>", state.hh, "", function () { state.hh = !state.hh; update(); }));
  }

  function renderHHOpts() {
    var group = $("#modules-group"), box = $("#modules");
    box.innerHTML = "";
    if (!state.hh) { group.hidden = true; return; }
    group.hidden = false;
    var opts = [
      { id: "aknight", name: "Armored Knight", sum: "Replaces the Paladin (hero role)", modes: ["multi"] },
      { id: "shadow", name: "Shadow Paladin", sum: "Replaces the Spider (monster role)", modes: ["multi"] },
      { id: "hhskel", name: "New Skeletons", sum: "4 Skeletons with their own gear, swapped in one-for-one", modes: ["multi", "solo", "cave"] },
      { id: "hhmini", name: "Miniatures", sum: "Can replace many of the Manor’s pieces (HH p.1)", modes: ["multi", "solo", "cave"] }
    ];
    opts.forEach(function (o) {
      if (o.modes.indexOf(state.mode) < 0) return;
      var why = VM.avail.hhOpt(state, o.id);
      box.appendChild(btn("mod", "<span class='mod-name'>" + o.name + "</span><span class='mod-sum'>" + o.sum + "</span>", state.hhOpts.has(o.id), why, function () {
        if (state.hhOpts.has(o.id)) state.hhOpts.delete(o.id); else state.hhOpts.add(o.id);
        update();
      }));
    });
  }

  function renderMixes() {
    var group = $("#mixes-group"), box = $("#mixes");
    box.innerHTML = "";
    group.hidden = state.mode !== "multi";
    if (state.mode !== "multi") return;
    [5, 4, 3, 2].forEach(function (p) {
      var row = el("div", "mix-row");
      row.appendChild(el("span", "mix-count", p + " players"));
      var wrap = el("div", "mix-btns");
      VM.mixes.filter(function (m) { return m.p === p; }).forEach(function (m) {
        var label = "<b>" + m.name + (m.star ? " <span class='star' aria-label='suggested for new players'>★</span>" : "") + "</b>" +
          "<span>" + (m.id === "m5" ? "The full game" : m.changes.length ? m.changes.length + " rule change" + (m.changes.length > 1 ? "s" : "") : "No rule changes") + "</span>";
        wrap.appendChild(btn("mix-btn", label, state.mix === m.id, "", function () { state.mix = m.id; update(); }));
      });
      row.appendChild(wrap);
      box.appendChild(row);
    });
  }

  function renderVisitors() {
    var group = $("#visitors-group"), box = $("#visitors");
    box.innerHTML = "";
    group.hidden = state.mode !== "multi";
    if (state.mode !== "multi") return;
    box.appendChild(btn("vis-btn", "<b>None</b><span>Manor roles only</span>", !state.vis, "", function () { state.vis = ""; update(); }));
    VM.visitors.forEach(function (v) {
      var why = VM.avail.visitor(state, v.id);
      box.appendChild(btn("vis-btn", "<b>" + VM.roleName(v.id) + "</b><span>replaces the " + VM.roleName(v.replaces) + "</span>", state.vis === v.id, why, function () { state.vis = v.id; update(); }));
    });
  }

  function renderTravelers() {
    var group = $("#travelers-group"), box = $("#travelers");
    box.innerHTML = "";
    group.hidden = state.mode !== "cave";
    if (state.mode !== "cave") return;
    VM.travelers.forEach(function (t) {
      if (t.hh && !state.hh) return;
      box.appendChild(btn("vis-btn", "<b>" + VM.roleName(t.id) + "</b><span>takes the " + t.cave + "’s seat</span>", state.trav === t.id, VM.avail.traveler(state, t.id), function () { state.trav = t.id; update(); }));
    });
  }

  function renderVariants(c) {
    var group = $("#variants-group"), box = $("#variants");
    box.innerHTML = "";
    var roles = VM.variantRoles.filter(function (r) { return c.has(r); });
    group.hidden = state.mode !== "multi" || !roles.length;
    if (group.hidden) return;
    roles.forEach(function (r) {
      var row = el("div", "var-row");
      row.appendChild(el("span", "var-role", VM.roleName(r)));
      var wrap = el("div", "var-btns");
      wrap.appendChild(btn("var-btn", "<b>Standard</b>", !state.diff[r], "", function () { state.diff[r] = ""; update(); }));
      VM.variants[r].forEach(function (v) {
        var b = btn("var-btn", "<b>" + v.name + "</b><span>" + v.lvl + "</span>", state.diff[r] === v.id, "", function () { state.diff[r] = v.id; update(); });
        b.title = v.t;
        wrap.appendChild(b);
      });
      row.appendChild(wrap);
      box.appendChild(row);
    });
  }

  function renderSolo() {
    var group = $("#solo-group"), box = $("#soloopts");
    box.innerHTML = "";
    group.hidden = state.mode !== "solo";
    if (state.mode !== "solo") return;
    var row = el("div", "var-row");
    row.appendChild(el("span", "var-role", "Difficulty"));
    var wrap = el("div", "var-btns");
    ["easy", "normal", "hard"].forEach(function (id) {
      var lv = VM.soloLevels[id];
      wrap.appendChild(btn("var-btn", "<b>" + lv.name + "</b><span>" + lv.skels + " Skeletons · " + lv.polts + " poltergeists · " + lv.terror + " Terror</span>", state.solo.level === id, VM.avail.soloLevel(state, id), function () { state.solo.level = id; update(); }));
    });
    row.appendChild(wrap);
    box.appendChild(row);
    var row2 = el("div", "var-row");
    row2.appendChild(el("span", "var-role", "Campaign"));
    var w2 = el("div", "var-btns");
    w2.appendChild(btn("var-btn", "<b>Single game</b>", !state.solo.campaign, "", function () { state.solo.campaign = false; update(); }));
    w2.appendChild(btn("var-btn", "<b>Campaign play</b><span>ranks set starting values</span>", state.solo.campaign, "", function () { state.solo.campaign = true; update(); }));
    row2.appendChild(w2);
    box.appendChild(row2);
    if (state.solo.campaign) {
      [["fl", "Fury & Light rank"], ["st", "Stability rank"], ["te", "Terror rank"]].forEach(function (k) {
        var r = el("div", "var-row");
        r.appendChild(el("span", "var-role", k[1].replace("&", "&amp;")));
        var w = el("div", "var-btns");
        [0, 1, 2, 3].forEach(function (n) {
          var val = VM.campaignRanks[n][k[0]];
          w.appendChild(btn("var-btn rank-btn", "<b>" + n + "</b><span>" + (k[0] === "fl" ? val + " each" : val) + "</span>", state.solo.ranks[k[0]] === n, "", function () { state.solo.ranks[k[0]] = n; update(); }));
        });
        r.appendChild(w);
        box.appendChild(r);
      });
    }
  }

  /* ---- setup, reference, teach --------------------------------------------- */
  function renderSetup(c) {
    var out = $("#setup");
    out.innerHTML = "";
    var n = 0;
    VM.phases.forEach(function (phase) {
      var steps = phase.steps.filter(function (s) { return s.when(c); });
      if (!steps.length) return;
      var ph = el("div", "phase");
      ph.appendChild(el("h3", "phase-title", phase.title));
      steps.forEach(function (s) {
        n++;
        var exp = resolve(s.exp, c);
        var meta = VM.expMeta[exp] || VM.expMeta.core;
        var step = el("div", "step");
        step.appendChild(el("div", "step-num", String(n)));
        var body = el("div", "step-body");
        var head = el("div", "step-head");
        head.appendChild(el("h4", null, resolve(s.t, c)));
        head.appendChild(el("span", "tag " + meta.cls, meta.name));
        body.appendChild(head);
        body.appendChild(el("div", "step-text", resolve(s.d, c)));
        body.appendChild(el("div", "src-line", resolve(s.src, c)));
        step.appendChild(body);
        ph.appendChild(step);
      });
      out.appendChild(ph);
    });
  }

  function renderReference(c) {
    var out = $("#reference");
    var open = {};
    out.querySelectorAll("details.ref").forEach(function (d) { if (d.open) open[d.getAttribute("data-key")] = true; });
    out.innerHTML = "";
    VM.reference.forEach(function (sec, i) {
      if (!sec.when(c)) return;
      var key = String(sec.title).replace(/\W+/g, "-").toLowerCase();
      var d = el("details", "ref");
      d.setAttribute("data-key", key);
      if (open[key]) d.open = true;
      d.appendChild(el("summary", null, sec.title));
      var body = el("div", "ref-body", resolve(sec.html, c));
      if (sec.src) body.appendChild(el("div", "src-line", resolve(sec.src, c)));
      d.appendChild(body);
      out.appendChild(d);
    });
  }

  function docVisible(x, c) {
    if (!c || typeof c.has !== "function") return true;
    switch (x) {
      case "lrP": case "ssP": return c.has("paladin");
      case "lrK": case "ssK": return c.has("skeletons") || c.has("solo");
      case "lrS": case "ssS": return c.has("spider");
      case "lrM": case "ssM": return c.has("manor");
      case "lrW": case "ssW": return c.has("warlock");
      case "lrsolo": return c.has("solo");
      case "lrtravel": return c.has("travel");
      case "hh": return c.has("hh");
      default: return true;   // lr: golden rules, setup, map, attacking, concepts, variants, mixes, key action reference
    }
  }

  /* Rulebook search: rendered by js/search-widget.js (search standard v1.1). */
  window.AID_SEARCH = {
    index: VM.rulesIndex,
    visible: docVisible,
    hint: function (c) {
      return "Search this page, the living rules" + (c && c.has && c.has("hh") ? ", the Haunted Hallways booklet" : "") +
        " and the setup sheets for the roles in play. Type a word, a phrase or a question.";
    },
    noMatch: function () { return "No matches on this page or in the sources for this setup."; },
    testQueries: ["skittish", "web", "how many hero cubes", "shift tile", "spawn die"]
  };

  function renderTeach(c) {
    var box = $("#teach");
    if (!box || !VM.teach) return;
    var secs = VM.teach.sections
      .filter(function (s) { return !s.when || s.when(c); })
      .map(function (s) { return { h: resolve(s.h, c), html: resolve(s.body, c) }; })
      .filter(function (s) { return s.html; });
    VM._teachText = secs.map(function (s) {
      return s.h.toUpperCase() + "\n" +
        s.html.replace(/<li>/g, "• ").replace(/<\/li>/g, "\n").replace(/<\/p>\s*<p>/g, "\n\n")
          .replace(/<[^>]+>/g, "").replace(/&amp;/g, "&").replace(/\n{3,}/g, "\n\n").trim();
    }).join("\n\n");
    box.innerHTML = "<div class='teach-top'><h3>📖 Teaching script — this setup</h3><button type='button' class='teach-copy' id='teachCopy'>📋 Copy script</button></div>" +
      "<p class='teach-note'>" + VM.teach.intro + "</p>" +
      secs.map(function (s) { return "<h4>" + s.h + "</h4>" + s.html; }).join("");
    $("#teachCopy").addEventListener("click", function () {
      var b = $("#teachCopy"), t = b.textContent;
      var done = function (msg) { b.textContent = msg; setTimeout(function () { b.textContent = t; }, 1600); };
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(VM._teachText || "").then(function () { done("✓ Script copied"); }, function () { done("Copy failed"); });
      else done("Copy failed");
    });
  }

  function update() {
    VM.normalize(state);
    var c = VM.makeCtx(state);
    renderModes();
    renderExpansions();
    renderMixes();
    renderHHOpts();
    renderVisitors();
    renderTravelers();
    renderVariants(c);
    renderSolo();
    renderSetup(c);
    renderReference(c);
    renderTeach(c);
    document.dispatchEvent(new CustomEvent("aid:config", { detail: c }));   // components glossary and rulebook search (js/comp-widget.js, js/search-widget.js)
  }

  document.addEventListener("DOMContentLoaded", function () {
    $("#teachBtn").addEventListener("click", function () {
      var p = $("#teach");
      p.hidden = !p.hidden;
      $("#teachBtn").setAttribute("aria-expanded", p.hidden ? "false" : "true");
      if (!p.hidden) p.scrollIntoView({ behavior: "smooth", block: "start" });
    });
    update();
  });
})();
