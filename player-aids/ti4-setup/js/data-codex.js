/* =============================================================================
   Twilight Imperium 4th Edition — Setup & Reference Utility · Twilight Codex module
   Volumes I–IV. Defines one global, TI_CODEX (see TI4_PLAN.md "Module-file contract").
   Every claim is sourced from the Codex PDFs, cross-checked against the Living Rules
   Reference v2.0 (09/22/20), the Thunder's Edge rulebook (2025) where it revises Codex
   content, and — for clarifications only — the TI4 Wiki FAQ snapshot ([OFFICIAL] answers).
   Page numbers are the printed page numbers. Card effects are paraphrased, not reprinted.
   Precedence (newest wins): TE (2025) > Codex IV (2025) > Codex III (2022) > Codex II (2021)
   > LRR v2.0 (09/22/20) > Codex I (2020, which only summarises LRR updates).
   ============================================================================= */
var TI_CODEX = (function () {
  "use strict";

  /* ---------------------------------------------------------------- helpers */
  var FACTION_REF = "../../ti.html";
  var S3 = Math.sqrt(3);

  function has(c, id) { return !!(c && typeof c.has === "function" && c.has(id)); }
  function modv(c, id) { return (c && typeof c.mod === "function") ? c.mod(id) : false; }
  function on(c, id) { return !!modv(c, id); }
  function std(c) { return !!c && (!c.mode || c.mode === "standard"); }
  function te(c) { return has(c, "te"); }
  function pok(c) { return has(c, "pok"); }
  function join() {
    var a = [];
    for (var i = 0; i < arguments.length; i++) { if (arguments[i]) a.push(arguments[i]); }
    return a.join(" · ");
  }
  function li(x) { return "<li>" + x + "</li>"; }
  function ul(items) {
    var a = items.filter(Boolean);
    return a.length ? "<ul>" + a.map(li).join("") + "</ul>" : "";
  }
  function p(x) { return "<p>" + x + "</p>"; }
  function h(x) { return "<h4>" + x + "</h4>"; }
  function num(n) { return ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight"][n] || String(n); }
  function esc(s) { return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/'/g, "&#39;"); }
  function f1(x) { return (Math.round(x * 10) / 10).toString(); }

  /* ------------------------------------------------------ option predicates */
  /* galactic event choices: module choice ids are "ge-<key>" (choice ids share one namespace in the app) */
  var GE_KEYS = ["any", "minorFactions", "totalWar", "ageOfCommerce", "ageOfExploration"];
  var GE_NAMES = {
    any: "Draw or choose at the table",
    minorFactions: "Minor Factions",
    totalWar: "Total War",
    ageOfCommerce: "Age of Commerce",
    ageOfExploration: "Age of Exploration"
  };
  /* choice ids as the app sees them (one shared namespace): "ge-<key>" — agent C's file reads the same ids */
  function geId(k) { return "ge-" + k; }
  function tf(c) { return !!c && c.mode === "twilightsfall"; }          /* Thunder's Edge: Twilight's Fall mode */
  function relicsOk(c) { return pok(c) || te(c); }                        /* relic deck: PoK, or TE (TE p.6 step 8) */
  function geCommerce(c) { return typeof TI !== "undefined" && typeof TI.geEvent === "function" && !!TI.geEvent(c, "ageOfCommerce"); } /* Age of Commerce galactic event (Codex IV p.16; core helper) */
  var TE_MAPS = ["te-map-thunderdreaming", "te-map-subjugation", "te-map-redvsblue", "te-map-legendary"];
  function teMapOn(c) { for (var i = 0; i < TE_MAPS.length; i++) { if (on(c, TE_MAPS[i])) return TE_MAPS[i]; } return null; }
  /* The module is offered with Codex III or Thunder's Edge (TE p.4 includes the Keleres, revised). The TE
     rulebook prints no Keleres sheet, so the texts here are Codex III's, with "TE's sheet wins" caveats. */
  function keleresOn(c) { return std(c) && on(c, "keleres") && (has(c, "codex3") || te(c)); }
  function keleresExp(c) { return has(c, "codex3") ? "codex3" : "te"; }
  /* Alliance variant: this file renders Codex II's version; with Thunder's Edge in play, agent C's
     te-alliance-* content renders TE's revision (TE p.13, newest) instead */
  function allianceOn(c) { return std(c) && on(c, "alliance") && has(c, "codex2") && !te(c) && [4, 6, 8].indexOf(c.p) >= 0; }
  function geOn(c) { return std(c) && on(c, "galacticEvents") && has(c, "codex4"); }
  /* which Codex IV galactic event is selected ("any" when the module is on without a specific choice).
     Works whether c.mod("galacticEvents") returns the choice id or c.mod(<choice id>) is true. */
  function geChoice(c) {
    if (!geOn(c)) return null;
    var v = modv(c, "galacticEvents");
    for (var i = 0; i < GE_KEYS.length; i++) {
      var id = geId(GE_KEYS[i]);
      if (v === id || (typeof v !== "string" && modv(c, id) === true)) return GE_KEYS[i];
    }
    return "any";
  }
  function geHas(c, id) { var g = geChoice(c); return !!g && (g === "any" || g === id); }
  function rcsOn(c) { return std(c) && on(c, "rightCatSoup") && has(c, "codex1") && c.p === 6; }
  function lib(c) { return !!c && c.mode === "liberation"; }
  function ord(c) { return !!c && c.mode === "ordinian"; }

  /* ------------------------------------------------------------ map data */
  /* Tile positions read from the PDF text layer (map badges), converted to axial hex
     coordinates [q, r] around each map's centre space (flat-topped hexes, north up),
     and verified by redrawing every map and comparing it with the printed diagram.
     Kinds: t system tile · h hyperlane tile · H named home position · S a scenario's
     faction home-system tile · M Mecatol Rex / the scenario's centre system. */
  var MAPS = {
    ordinian: [[-3,0,"6","S"],[-3,1,"34","t"],[-3,2,"41","t"],[-3,3,"8","S"],[-2,-1,"20","t"],[-2,0,"40","t"],[-2,1,"30","t"],[-2,2,"38","t"],[-2,3,"39","t"],[-1,-2,"23","t"],[-1,-1,"22","t"],[-1,0,"36","t"],[-1,1,"33","t"],[-1,2,"24","t"],[-1,3,"44","t"],[0,-3,"10","S"],[0,-2,"19","t"],[0,-1,"32","t"],[0,0,"42","M"],[0,1,"47","t"],[0,2,"27","t"],[0,3,"5","S"],[1,-3,"50","t"],[1,-2,"37","t"],[1,-1,"43","t"],[1,0,"25","t"],[1,1,"29","t"],[1,2,"31","t"],[2,-3,"26","t"],[2,-2,"28","t"],[2,-1,"21","t"],[2,0,"48","t"],[2,1,"35","t"],[3,-3,"4","S"],[3,-2,"49","t"],[3,-1,"45","t"],[3,0,"17","S"]],
    liberation: [[-3,0,"57","S"],[-3,1,"45","t"],[-3,2,"65","t"],[-3,3,"17","S"],[-2,-1,"64","t"],[-2,0,"22","t"],[-2,1,"26","t"],[-2,2,"27","t"],[-2,3,"34","t"],[-1,-2,"46","t"],[-1,-1,"75","t"],[-1,0,"70","t"],[-1,1,"48","t"],[-1,2,"72","t"],[-1,3,"41","t"],[0,-3,"01","S"],[0,-2,"68","t"],[0,-1,"21","t"],[0,0,"Ordinian","M"],[0,1,"63","t"],[0,2,"30","t"],[0,3,"53","S"],[1,-3,"74","t"],[1,-2,"60","t"],[1,-1,"35","t"],[1,0,"49","t"],[1,1,"66","t"],[1,2,"29","t"],[2,-3,"67","t"],[2,-2,"78","t"],[2,-1,"76","t"],[2,0,"25","t"],[2,1,"31","t"],[3,-3,"08","S"],[3,-2,"62","t"],[3,-1,"79","t"],[3,0,"14","S"]],
    rightCatSoup: [[-3,0,"Empyrealis","H"],[-3,1,"36","t"],[-3,2,"35","t"],[-3,3,"Pyroclast","H"],[-2,-1,"46","t"],[-2,0,"49","t"],[-2,1,"29","t"],[-2,2,"43","t"],[-2,3,"25","t"],[-1,-2,"30","t"],[-1,-1,"28","t"],[-1,0,"24","t"],[-1,1,"40","t"],[-1,2,"34","t"],[-1,3,"48","t"],[0,-3,"Northswain","H"],[0,-2,"19","t"],[0,-1,"44","t"],[0,0,"Mecatol Rex","M"],[0,1,"41","t"],[0,2,"38","t"],[0,3,"Gravitas Rex","H"],[1,-3,"42","t"],[1,-2,"21","t"],[1,-1,"47","t"],[1,0,"22","t"],[1,1,"39","t"],[1,2,"37","t"],[2,-3,"26","t"],[2,-2,"32","t"],[2,-1,"45","t"],[2,0,"50","t"],[2,1,"27","t"],[3,-3,"Eternia","H"],[3,-2,"23","t"],[3,-1,"20","t"],[3,0,"Animus","H"]],
    threesCompany: [[-3,0,"75","t"],[-3,1,"63","t"],[-2,-1,"45","t"],[-2,0,"85B","h"],[-2,1,"19","t"],[-2,2,"A Brilliant Folly","H"],[-1,-1,"22","t"],[-1,0,"91A","h"],[-1,1,"42","t"],[-1,2,"61","t"],[-1,3,"79","t"],[0,-2,"A Terrible Gambit","H"],[0,-1,"41","t"],[0,0,"Mecatol Rex","M"],[0,1,"84B","h"],[0,2,"83B","h"],[0,3,"67","t"],[1,-2,"20","t"],[1,-1,"86B","h"],[1,0,"40","t"],[1,1,"23","t"],[1,2,"66","t"],[2,-3,"65","t"],[2,-2,"88B","h"],[2,-1,"21","t"],[2,0,"A Legendary Scheme","H"],[3,-3,"68","t"],[3,-2,"44","t"]],
    chokepoint: [[-3,0,"49","t"],[-3,1,"50","t"],[-3,2,"77","t"],[-3,3,"90B","h"],[-2,-1,"Incrementum","H"],[-2,0,"63","t"],[-2,1,"26","t"],[-2,2,"45","t"],[-2,3,"Chrysus","H"],[-1,-2,"25","t"],[-1,-1,"69","t"],[-1,0,"83B","h"],[-1,1,"84B","h"],[-1,2,"38","t"],[-1,3,"74","t"],[0,-3,"85A","h"],[0,-2,"65","t"],[0,-1,"68","t"],[0,0,"Mecatol Rex","M"],[0,1,"89A","h"],[0,2,"66","t"],[0,3,"86A","h"],[1,-3,"43","t"],[1,-2,"72","t"],[1,-1,"91A","h"],[1,0,"88B","h"],[1,1,"35","t"],[1,2,"39","t"],[2,-3,"Ignis Solum","H"],[2,-2,"62","t"],[2,-1,"64","t"],[2,0,"67","t"],[2,1,"Arma","H"],[3,-3,"87B","h"],[3,-2,"48","t"],[3,-1,"47","t"],[3,0,"46","t"]],
    raceForMecatol: [[-3,0,"35","t"],[-3,1,"75","t"],[-3,2,"64","t"],[-3,3,"Coronox","H"],[-2,-1,"44","t"],[-2,0,"Pyrexia","H"],[-2,1,"39","t"],[-2,2,"30","t"],[-2,3,"74","t"],[-1,-2,"65","t"],[-1,-1,"43","t"],[-1,0,"91B","h"],[-1,1,"84B","h"],[-1,2,"72","t"],[-1,3,"47","t"],[0,-3,"Mecatol Rex","M"],[0,-2,"88A","h"],[0,-1,"87A","h"],[0,0,"68","t"],[0,1,"Spartania","H"],[0,2,"25","t"],[0,3,"67","t"],[1,-3,"66","t"],[1,-2,"80","t"],[1,-1,"89B","h"],[1,0,"83B","h"],[1,1,"21","t"],[1,2,"77","t"],[2,-3,"45","t"],[2,-2,"Acidious","H"],[2,-1,"40","t"],[2,0,"33","t"],[2,1,"71","t"],[3,-3,"38","t"],[3,-2,"76","t"],[3,-1,"26","t"],[3,0,"Epidemia","H"]],
    neighbor: [[-3,0,"65","t"],[-3,1,"24","t"],[-3,2,"31","t"],[-3,3,"26","t"],[-2,-1,"60","t"],[-2,0,"Optimus Primor","H"],[-2,1,"45","t"],[-2,2,"For Everra Mine","H"],[-2,3,"48","t"],[-1,-2,"35","t"],[-1,-1,"43","t"],[-1,0,"33","t"],[-1,1,"76","t"],[-1,2,"68","t"],[-1,3,"49","t"],[0,-3,"64","t"],[0,-2,"Beta Hole Sun","H"],[0,-1,"22","t"],[0,0,"Mecatol Rex","M"],[0,1,"38","t"],[0,2,"Mine for Everra","H"],[0,3,"40","t"],[1,-3,"21","t"],[1,-2,"42","t"],[1,-1,"75","t"],[1,0,"63","t"],[1,1,"80","t"],[1,2,"37","t"],[2,-3,"61","t"],[2,-2,"PDS Paradise","H"],[2,-1,"44","t"],[2,0,"Lor Hopeless","H"],[2,1,"19","t"],[3,-3,"39","t"],[3,-2,"73","t"],[3,-1,"36","t"],[3,0,"66","t"]],
    magisMadness: [[-4,0,"24","t"],[-4,1,"72","t"],[-4,2,"47","t"],[-4,3,"Final Frontier","H"],[-4,4,"59","t"],[-3,-1,"Ambassador","H"],[-3,0,"49","t"],[-3,1,"79","t"],[-3,2,"61","t"],[-3,3,"35","t"],[-3,4,"41","t"],[-2,-2,"28","t"],[-2,-1,"64","t"],[-2,0,"74","t"],[-2,1,"76","t"],[-2,2,"46","t"],[-2,3,"78","t"],[-2,4,"40","t"],[-1,-3,"91B","h"],[-1,-2,"45","t"],[-1,-1,"75","t"],[-1,0,"Why Can't I Hold All","H"],[-1,1,"69","t"],[-1,2,"68","t"],[-1,3,"Mecatol Rex","M"],[-1,4,"39","t"],[0,-4,"29","t"],[0,-3,"Non Euclidean","H"],[0,-2,"62","t"],[0,-1,"70","t"],[0,0,"85A","h"],[0,1,"83A","h"],[0,2,"65","t"],[0,3,"19","t"],[0,4,"77","t"],[1,-4,"80","t"],[1,-3,"88B","h"],[1,-2,"42","t"],[1,-1,"84A","h"],[1,0,"Mountain Fortress","H"],[1,1,"34","t"],[1,2,"48","t"],[1,3,"38","t"],[2,-4,"50","t"],[2,-3,"26","t"],[2,-2,"90B","h"],[2,-1,"36","t"],[2,0,"27","t"],[2,1,"43","t"],[2,2,"The Floor Is Lava","H"],[3,-4,"67","t"],[3,-3,"44","t"],[3,-2,"37","t"],[3,-1,"66","t"],[3,0,"25","t"],[3,1,"73","t"],[4,-4,"33","t"],[4,-3,"Pain Train","H"],[4,-2,"22","t"],[4,-1,"87B","h"],[4,0,"86A","h"]],
    junkYardDoggo: [[-4,0,"28","t"],[-4,1,"38","t"],[-4,2,"Exert","H"],[-4,3,"35","t"],[-4,4,"23","t"],[-3,-1,"Exalt","H"],[-3,0,"30","t"],[-3,1,"70","t"],[-3,2,"20","t"],[-3,3,"69","t"],[-3,4,"Exterminate","H"],[-2,-2,"33","t"],[-2,-1,"32","t"],[-2,0,"26","t"],[-2,1,"48","t"],[-2,2,"64","t"],[-2,3,"36","t"],[-2,4,"72","t"],[-1,-3,"83A","h"],[-1,-2,"88A","h"],[-1,-1,"25","t"],[-1,0,"43","t"],[-1,1,"77","t"],[-1,2,"31","t"],[-1,3,"74","t"],[-1,4,"37","t"],[0,-4,"85A","h"],[0,-3,"Excel","H"],[0,-2,"86A","h"],[0,-1,"47","t"],[0,0,"46","t"],[0,1,"41","t"],[0,2,"34","t"],[0,3,"73","t"],[0,4,"Exploit","H"],[1,-4,"84A","h"],[1,-3,"87A","h"],[1,-2,"39","t"],[1,-1,"Mecatol Rex","M"],[1,0,"50","t"],[1,1,"21","t"],[1,2,"19","t"],[1,3,"27","t"],[2,-4,"68","t"],[2,-3,"76","t"],[2,-2,"40","t"],[2,-1,"49","t"],[2,0,"79","t"],[2,1,"62","t"],[2,2,"61","t"],[3,-4,"Explore","H"],[3,-3,"75","t"],[3,-2,"66","t"],[3,-1,"65","t"],[3,0,"24","t"],[3,1,"Exchange","H"],[4,-4,"67","t"],[4,-3,"78","t"],[4,-2,"Expand","H"],[4,-1,"42","t"],[4,0,"59","t"]]
  };

  var MAP_META = {
    ordinian: { book: "Codex I", page: "p.12", centreText: "tile <b>42</b> — the Ordinian nebula, where the Coatl starts",
      homes: { "10": "Arc Prime / Wren Terra", "4": "Muaat", "17": "Creuss Gate", "5": "Nestphar", "8": "Mordai II", "6": "[0.0.0]" } },
    liberation: { book: "Codex IV", page: "p.18", centreText: "the <b>Ordinian</b> system tile (a nebula)",
      homes: { "01": "Jord", "08": "Mordai II", "14": "Archon Ren / Archon Tau", "53": "Arcturus", "17": "Creuss Gate", "57": "Naazir / Rokha" } },
    rightCatSoup: { book: "Codex I", page: "p.13", centreText: "<b>Mecatol Rex</b> ({MR})" },
    threesCompany: { book: "Codex II", page: "p.14", centreText: "<b>Mecatol Rex</b> ({MR})" },
    chokepoint: { book: "Codex II", page: "p.15", centreText: "<b>Mecatol Rex</b> ({MR})" },
    raceForMecatol: { book: "Codex II", page: "p.16", centreText: "tile <b>68</b> (Mecatol Rex is at the top edge of the map)" },
    neighbor: { book: "Codex II", page: "p.17", centreText: "<b>Mecatol Rex</b> ({MR})" },
    magisMadness: { book: "Codex II", page: "p.18", centreText: "hyperlane tile <b>85A</b> (Mecatol Rex is three spaces below it, one column to the left)" },
    junkYardDoggo: { book: "Codex II", page: "p.19", centreText: "tile <b>46</b> (Mecatol Rex touches it on its upper right)" }
  };

  var DIRS = [[1, 0], [0, 1], [-1, 1], [-1, 0], [0, -1], [1, -1]];
  function hexDist(q, r) { return Math.max(Math.abs(q), Math.abs(r), Math.abs(q + r)); }
  function ringCells(k) {
    if (!k) return [[0, 0]];
    var out = [], q = 0, r = -k;
    for (var d = 0; d < 6; d++) {
      for (var i = 0; i < k; i++) { out.push([q, r]); q += DIRS[d][0]; r += DIRS[d][1]; }
    }
    return out;
  }
  function cellIndex(key) {
    var at = {}, maxR = 0;
    MAPS[key].forEach(function (c) { at[c[0] + "," + c[1]] = c; maxR = Math.max(maxR, hexDist(c[0], c[1])); });
    return { at: at, maxR: maxR };
  }
  function cellText(key, c) {
    var k = c[3], meta = MAP_META[key];
    if (k === "H") return "<b>" + esc(c[2]) + "</b> (home)";
    if (k === "S") return "<b>" + c[2] + "</b> (" + esc(meta.homes[c[2]]) + " — home)";
    if (k === "M") return c[2] === "Mecatol Rex" ? "<b>Mecatol Rex</b>" : "<b>" + c[2] + "</b> (centre)";
    if (k === "h") return c[2] + " (hyperlane)";
    return c[2];
  }
  function tileLists(key) {
    var sys = [], hyp = [];
    MAPS[key].forEach(function (c) {
      if (c[3] === "t" || c[3] === "S") sys.push(c[2]);
      if (c[3] === "h") hyp.push(c[2]);
    });
    var byNum = function (a, b) { return parseInt(a, 10) - parseInt(b, 10) || (a < b ? -1 : 1); };
    return { sys: sys.sort(byNum), hyp: hyp.sort(byNum) };
  }
  /* a scenario map's non-home, non-centre system tiles (players bring their own home systems) */
  function scenarioTiles(key) {
    return MAPS[key].filter(function (c) { return c[3] === "t"; }).map(function (c) { return c[2]; })
      .sort(function (a, b) { return parseInt(a, 10) - parseInt(b, 10); });
  }
  /* Mecatol Rex's tile number: Thunder's Edge replaces base tile 18 with its legendary Mecatol Rex tile (TE p.4), numbered 112 on TE's maps (TE p.14) */
  function mrTile(c) { return te(c) ? "tile 112 — Thunder's Edge's replacement for tile 18" : "tile 18"; }
  function wrap(label, max) {
    var words = String(label).split(" "), lines = [], cur = "";
    words.forEach(function (w) {
      if (cur && (cur + " " + w).length > max) { lines.push(cur); cur = w; } else { cur = cur ? cur + " " + w : w; }
    });
    if (cur) lines.push(cur);
    return lines;
  }
  /* Inline SVG hex diagram (no external image). Uses currentColor so it follows the page theme. */
  function mapSvg(key, title) {
    var cells = MAPS[key], R = 30, pad = 4, xs = [], ys = [];
    cells.forEach(function (c) { xs.push(1.5 * R * c[0]); ys.push(S3 * R * (c[1] + c[0] / 2)); });
    var minX = Math.min.apply(null, xs) - R - pad, maxX = Math.max.apply(null, xs) + R + pad;
    var minY = Math.min.apply(null, ys) - S3 * R / 2 - pad, maxY = Math.max.apply(null, ys) + S3 * R / 2 + pad;
    var w = maxX - minX, hgt = maxY - minY;
    var STY = {
      t: "fill='none' stroke='currentColor' stroke-opacity='0.55' stroke-width='1.3'",
      h: "fill='currentColor' fill-opacity='0.05' stroke='currentColor' stroke-width='1.4' stroke-dasharray='4 3'",
      H: "fill='currentColor' fill-opacity='0.14' stroke='currentColor' stroke-width='2.6'",
      S: "fill='currentColor' fill-opacity='0.14' stroke='currentColor' stroke-width='2.6'",
      M: "fill='currentColor' fill-opacity='0.28' stroke='currentColor' stroke-width='2.6'"
    };
    var out = "<svg class='cx-map' xmlns='http://www.w3.org/2000/svg' viewBox='" + f1(minX) + " " + f1(minY) + " " + f1(w) + " " + f1(hgt) +
      "' role='img' aria-label='" + esc(title) + "' style='display:block;width:100%;max-width:" + Math.round(w * 1.3) + "px;height:auto;margin:0.6em auto'>";
    cells.forEach(function (c, i) {
      var x = xs[i], y = ys[i], k = c[3], pts = [];
      for (var a = 0; a < 6; a++) {
        var ang = Math.PI / 3 * a;
        pts.push(f1(x + (R - 1.6) * Math.cos(ang)) + "," + f1(y + (R - 1.6) * Math.sin(ang)));
      }
      out += "<polygon class='cx-hex cx-" + k + "' points='" + pts.join(" ") + "' " + STY[k] + "></polygon>";
      var lines, size, weight = "700";
      if (k === "t" || k === "h") { lines = [c[2]]; size = 15; weight = k === "h" ? "400" : "700"; }
      else if (k === "S") { lines = [c[2]]; size = 15; }
      else if (k === "M") { lines = c[2] === "Mecatol Rex" ? ["Mecatol", "Rex"] : [c[2]]; size = c[2].length > 6 ? 10 : 12; }
      else {
        lines = wrap(c[2], 11);
        var longest = Math.max.apply(null, lines.map(function (s) { return s.length; }));
        size = Math.min(10.5, Math.floor(500 / (longest * 0.6)) / 10); /* keep long names inside the hex */
      }
      var lh = size * 1.1, y0 = y - (lines.length - 1) * lh / 2;
      out += "<text x='" + f1(x) + "' y='" + f1(y0) + "' text-anchor='middle' dominant-baseline='central' font-size='" + size +
        "' font-weight='" + weight + "' fill='currentColor'>";
      lines.forEach(function (ln, j) {
        out += "<tspan x='" + f1(x) + "' y='" + f1(y0 + j * lh) + "'>" + esc(ln) + "</tspan>";
      });
      out += "</text>";
    });
    out += "</svg>";
    return out;
  }
  function useSvg() { return !(TI_CODEX && TI_CODEX.options && TI_CODEX.options.svgMaps === false); }
  /* Diagram + legend + exact text layout (rings, clockwise from the top). */
  function mapBlock(key, title, c) {
    var meta = MAP_META[key], idx = cellIndex(key), hasHyp = tileLists(key).hyp.length > 0, rows = [];
    for (var k = 1; k <= idx.maxR; k++) {
      var names = ringCells(k).map(function (qr) { var c = idx.at[qr[0] + "," + qr[1]]; return c ? cellText(key, c) : "—"; });
      rows.push("<b>Ring " + k + "</b> (" + (6 * k) + " spaces): " + names.join(", "));
    }
    var legend = "Heavy outline = home position · " + (meta.centreText.indexOf("{MR}") >= 0 ? "shaded centre = Mecatol Rex" : (key === "ordinian" || key === "liberation" ? "shaded centre = the scenario's centre system" : "shaded hex = Mecatol Rex (not the centre on this map)")) +
      (hasHyp ? " · dashed = hyperlane tile — turn it exactly as drawn on " + meta.book + " " + meta.page + " (rotation can't be shown here)" : "") + ".";
    var sizes = [];
    for (var j = 1; j <= idx.maxR; j++) sizes.push(j === 1 ? "Ring 1 is the 6 spaces touching it" : "ring " + j + " the next " + (6 * j));
    return (useSvg() ? mapSvg(key, title) + "<p class='cx-map-legend'><small>" + legend + "</small></p>" : "") +
      "<details class='cx-maptext'><summary>Map as text — rings around the centre</summary>" +
      p("Centre space: " + meta.centreText.replace("{MR}", mrTile(c)) + ". " + sizes.join(", ") + "; each ring is listed <b>clockwise, starting with the space directly above the centre</b> (— = no tile there).") +
      ul(rows) + "</details>";
  }

  /* --------------------------------------------------- galaxy presets */
  var PRESETS = [
    { id: "threesCompany", map: "threesCompany", players: 3, page: "p.14", name: "“Three's Company”", author: "Rex “Wekker” Hearn",
      notes: ["Much tighter than a normal three-player map. Study the hyperlanes — they add a lot of movement options.",
        "Your slice: the three systems next to your home plus the asteroid field to its right.",
        "The other two systems in each “wing” — including the triple-planet system and the legendary planets — are equidistant between two home systems.",
        "Control objectives are hard here but achievable; Mecatol, Mallice and Mirage are key to winning."] },
    { id: "chokepoint", map: "chokepoint", players: 4, page: "p.15", name: "“Chokepoint”", author: "Matthew Pana",
      notes: ["Mecatol Rex is hidden behind a chokepoint instead of being easy to reach — will the table gang up on whoever holds it, or fight over the legendary planets and Everra?",
        "<b>Arma</b> and <b>Chrysus</b> are four systems from Mecatol, so they get better neighbouring systems and share Hope's End. Arma has Bereg/Lirta IV next door and a gravity rift that threatens the galaxy.",
        "<b>Ignis Solum</b>: red and yellow technology skips and a supernova shielding it from Incrementum (the designer suggests Muaat) — but watch Arma's gravity rift.",
        "<b>Chrysus</b>: the most resources, little influence nearby; its blue skip invites an early Gravity Drive.",
        "<b>Incrementum</b>: by far the most influence plus a green skip (good for token-hungry factions such as Xxcha or Titans) — keep the beta wormhole blocked, or Arma can rift straight into your home system."] },
    { id: "raceForMecatol", map: "raceForMecatol", players: 5, page: "p.16", name: "“Race for Mecatol”", author: "Jacob Turner",
      notes: ["Hyperlanes make the special planets easy to take — and easy to lose.",
        "The asteroid field and supernova at the top shield most factions but limit expansion; Muaat and Saar will like hiding there.",
        "Short on territory, the top and bottom positions will likely fight each other; the middle position has empty space and anomalies and may be the most flexible seat.",
        "The galaxy is a little disjointed; the wormholes tie it together."] },
    { id: "neighbor", map: "neighbor", players: 6, page: "p.17", name: "“Won't You Be My Neighbor?”", author: "Daniel Young",
      notes: ["Every home system sits in the <b>second ring</b> to force interaction; anomalies between home systems guard against round-one eliminations.",
        "Apart from two slices with six non-home planets each, no control objective can be met without entering another player's space.",
        "Each player is adjacent to three planets of one type and must venture out for a fourth; a third technology specialty could get bloody.",
        "Wrap-around wormholes mean neighbours keep knocking even after a Support for the Throne swap."] },
    { id: "magisMadness", map: "magisMadness", players: 7, page: "p.18", name: "“Magi's Madness”", author: "Paul Brown",
      notes: ["Non-standard player and Mecatol Rex positions: every home system has a three-tile path and a four-tile path to Mecatol Rex.",
        "Four players on one half are in each other's faces; the three on the other half fight over the two legendary planets.",
        "<b>Ambassador</b>: a wormhole to the other half and easy alpha-wormhole access. <b>Non Euclidean</b>: odd hyperlanes and anomalies. <b>Pain Train</b>: next stop, Mecatol Rex. <b>Why Can't I Hold All</b>: lots of territory, three hungry neighbours. <b>Mountain Fortress</b>: snug. <b>Final Frontier</b>: empty space. <b>The Floor Is Lava</b>: hazardous planets and a supernova.",
        "Designer's suggestion: a simple snake draft of factions and home positions (the centre seats are strong for some factions), then determine the speaker randomly."] },
    { id: "junkYardDoggo", map: "junkYardDoggo", players: 8, page: "p.19", name: "“Junk Yard Doggo”", author: "Phillip Henning",
      notes: ["Deliberately mean and stacked against you — <b>not recommended for new or casual players</b>.",
        "Best used as a learning tool for map balance and for rebalancing the table through diplomacy, trades and play.",
        "The designer's goal: win from each of the eight starts."] }
  ];
  var RCS = { id: "rightCatSoup", map: "rightCatSoup", players: 6, page: "p.13", name: "“Right Cat Soup”", author: "Christopher Chick",
    notes: ["<b>Empyrealis</b> is unusual but has two equidistant systems to leap for (28 and 29) while its neighbours take their own nearby systems — and plenty of empty space.",
      "<b>Animus</b> sits near two green technology specialties: an early Hyper Metabolism pays off for factions that burn through command tokens; it has few other expansion options.",
      "<b>Gravitas Rex</b> looks great (Abyz/Fria and Arinam/Meer, plenty of resources) but must fight early to hold its systems.",
      "<b>Eternia</b> is a quiet corner with a wormhole — “Ghosts of Creuss, anyone?”",
      "Empyrealis jumping quickly to the equidistant systems pushes <b>Pyroclast</b> away."] };

  function codex2Preset(c) {
    if (!std(c) || !on(c, "paxPresets") || !has(c, "codex2") || !pok(c)) return null;
    if (c.p === 6 && rcsOn(c)) return null;
    var v = modv(c, "paxPresets"), i, P;
    for (i = 0; i < PRESETS.length; i++) {
      P = PRESETS[i];
      if (P.players === c.p && (v === P.id || (typeof v !== "string" && modv(c, P.id) === true))) return P;
    }
    for (i = 0; i < PRESETS.length; i++) { if (PRESETS[i].players === c.p) return PRESETS[i]; }
    return null;
  }
  function activePreset(c) { return rcsOn(c) ? RCS : codex2Preset(c); }
  /* any fixed map in play: a Codex preset, one of Thunder's Edge's premade maps (agent C), or the core
     "premade" build (a Prophecy of Kings premade map, PoK pp.12–15) — none of them deals system tiles */
  function fixedMap(c) { return !!activePreset(c) || (te(c) && !!teMapOn(c)) || (!!c && c.galaxy === "premade"); }
  function presetBook(P) { return P === RCS ? "Codex I" : "Codex II"; }

  function presetStepHtml(c, P) {
    var L = tileLists(P.map), homes = [], mr = "";
    /* home positions listed clockwise from the top of the map */
    MAPS[P.map].forEach(function (x) {
      if (x[3] !== "H") return;
      var px = 1.5 * x[0], py = S3 * (x[1] + x[0] / 2), a = Math.atan2(px, -py);
      homes.push({ n: x[2], a: a < 0 ? a + 2 * Math.PI : a });
    });
    homes = homes.sort(function (u, v) { return u.a - v.a; }).map(function (u) { return u.n; });
    if (P.id === "raceForMecatol") mr = "Mecatol Rex sits at the <b>top edge</b> of this galaxy, not in the centre — the custodians token goes on it there.";
    if (P.id === "magisMadness") mr = "Mecatol Rex is <b>not in the centre</b> — it sits in the lower half of the galaxy; the custodians token goes on it there.";
    if (P.id === "junkYardDoggo") mr = "Mecatol Rex is <b>off-centre</b> — the space up and to the right of the centre tile (46); the custodians token goes on it there.";
    return ul([
      "Build the galaxy <b>exactly as shown</b> instead of dealing and placing system tiles" + (pok(c) ? " — the same way the Prophecy of Kings premade maps replace standard board setup (PoK p.12)" : "") + ".",
      mr,
      "Home positions (" + homes.length + ", clockwise from the top): " + homes.map(function (x) { return "<b>" + esc(x) + "</b>"; }).join(", ") + ". Each player's home system goes in a position near their seat (LRR p.4)" + (P.id === "magisMadness" ? "; or use the designer's snake draft (see the preset notes in the Rules Reference)" : "") + ".",
      "System tiles to pull (" + L.sys.length + "): " + L.sys.join(", ") + ", plus Mecatol Rex (" + mrTile(c) + ").",
      L.hyp.length ? "Hyperlane tiles (" + L.hyp.length + "): " + L.hyp.join(", ") + " — each must be <b>turned exactly as drawn</b> on " + presetBook(P) + " " + P.page + "." : "",
      pok(c) ? "Place the <b>wormhole nexus</b> beside the board, gamma-only side up, with the 3 gamma wormhole tokens next to it, as in every Prophecy of Kings setup (LRR p.4)." : "",
      P.players === 5 ? "No starting trade goods for seat position: the LRR gives them only in five-player games that <b>don't</b> use hyperlanes (LRR p.5), and this map uses them." : "",
      geHas(c, "minorFactions") ? "Minor Factions is selected: that event assumes the standard dealt-tile galaxy, and no rulebook says how to combine it with a Codex preset map." : ""
    ]) + mapBlock(P.map, presetBook(P) + " galaxy preset " + P.name.replace(/[“”]/g, "") + " — hex map with tile numbers", c);
  }

  /* ------------------------------------------------ Alliance variant text */
  function allianceRules(c, opts) {
    var T = te(c), o = opts || {};
    var trans = [
      "Commodities you exchange with your ally <b>stay commodities</b> — they don't convert to trade goods.",
      "You may receive your ally's promissory notes in a transaction (to pass on, say) but you <b>can't resolve</b> them."
    ];
    var move = [
      "Your ships may move through and into systems containing your ally's ships — <b>no space combat</b>.",
      T ? "Your ground forces may land on planets <b>controlled by your ally</b> — no ground combat, and you don't gain control."
        : "Your ground forces may land on planets containing your ally's ground forces — no ground combat, and you don't gain control.",
      "Whenever a game effect lets a player redistribute command tokens, they may also <b>swap planet cards</b> with their ally, provided the receiving player has at least 1 ground force or structure on that planet. Ready/exhausted state is kept, and “gain control” abilities don't trigger.",
      "When your ally activates a system, you may <b>simultaneously perform a tactical action</b> in that system with them — spend and place a token from your own tactic pool as normal.",
      T ? "If your ally allows it, you may <b>transport, support and commit</b> their fighters and ground forces using your units with capacity."
        : "If your ally allows it, you may <b>transport</b> their fighters and ground forces using your units with capacity."
    ];
    var fight = [
      "In a combat roll or unit-ability roll where both allies have units present, both <b>can</b> take part: their <b>rolls are combined</b> and hits are assigned as normal.",
      "Hits produced against the allied pair: the allies <b>decide together</b> how to assign them; if they can't agree, the <b>active player</b> decides.",
      "Hits an opponent assigns against the pair may go on either ally's units, in any combination."
    ];
    var abil = [
      "Your ally's units count as <b>neither your units nor another player's units</b> for game effects and abilities.",
      T ? "Abilities that trigger when a player activates a system containing another player's units, planets or command tokens <b>don't trigger</b> between allies." : "",
      T ? "Your unit abilities (space cannon, planetary shield and so on) <b>don't affect your ally</b>." : "",
      T ? "Agent abilities <b>can</b> be used on your ally." : "",
      T ? "Your ally's planets count as yours when resolving abilities, but you <b>can't exhaust</b> them, and they don't count for scoring objectives or the “Imperial” victory point."
        : "Your ally's planets count as yours when resolving abilities, but you <b>can't exhaust</b> them, and they don't count for other game effects (such as scoring objectives or unlocking leaders)."
    ];
    var out = h("Transactions") + ul(trans) + h("Movement and control") + ul(move) + h("Combat and unit abilities") + ul(fight) + h("Abilities and effects") + ul(abil);
    if (!o.noEnd) {
      out += h("Elimination") + ul(["A player <b>can't be eliminated</b> while their ally controls a planet."]) +
        h("Winning") + ul(["Play on the <b>14</b> side of the victory point track. An alliance wins when one ally has <b>14</b> victory points and the other has <b>at least 10</b>."]);
    }
    return out;
  }
  function allianceSrc(c) { return te(c) ? "TE p.13 (revises Codex II p.13)" : "Codex II p.13"; }

  /* ------------------------------------------------------------------ SETS */
  var sets = [
    { id: "codex1", name: "Twilight Codex Volume I: Ordinian", short: "Codex I", year: "2020",
      blurb: "Web-published print-and-play: a summary of rules updates, Omega replacement cards (3 faction technologies, 2 basic technologies, 5 promissory notes), 20 new action cards, the Ordinian scenario and the “Right Cat Soup” six-player map." },
    { id: "codex2", name: "Twilight Codex Volume II: Affinity", short: "Codex II", year: "2021",
      blurb: "Faction and Alliance reference cards, three relics, the Alliance game variant (teams of two) and six community galaxy presets for 3–8 players." },
    { id: "codex3", name: "Twilight Codex Volume III: Vigil", short: "Codex III", year: "2022",
      blurb: "A new faction — the Council Keleres — plus Omega reworks of Xxcha, Yin and Naalu leaders, the Naalu mech and three secret objectives, and six frontier exploration cards. (Checked against FFG's v2.1 file; the book itself prints no version number.)" },
    { id: "codex4", name: "Twilight Codex Volume IV: Liberation", short: "Codex IV", year: "2025",
      blurb: "Three relics, the first four galactic events (Minor Factions, Total War, Age of Commerce, Age of Exploration) and the six-player Liberation of Ordinian scenario." }
  ];

  /* ----------------------------------------------------------------- MODES */
  var modes = [
    { id: "ordinian", name: "Ordinian (Codex I scenario)", requires: ["codex1"], minPlayers: 6, maxPlayers: 6,
      blurb: "Six factions fight for the crippled Argent flagship Coatl, adrift in the Ordinian nebula at the centre of a fixed map; Mecatol Rex isn't used. Controlling the repaired Coatl is worth a victory point. First to 10 wins.",
      src: "Codex I p.12" },
    { id: "liberation", name: "Liberation of Ordinian (Codex IV scenario)", requires: ["codex4", "pok"], minPlayers: 6, maxPlayers: 6,
      blurb: "Exactly six players with Prophecy of Kings. The allied Federation of Sol and Xxcha Kingdom (the Salient Sun task force) fight to free Nekro-held Ordinian at the centre of a fixed map; they need 12 and 10 victory points, everyone else 10.",
      src: "Codex IV pp.17–18" }
  ];

  /* --------------------------------------------------------------- MODULES */
  var modules = [
    { id: "keleres", name: "Council Keleres in play", requires: [["codex3", "te"]], modes: ["standard"], excludes: [], minPlayers: 3, maxPlayers: 8,
      summary: "A player is the Council Keleres, who borrow the home system of an unplayed Mentak, Xxcha or Argent faction.",
      description: "Adds the Keleres setup steps (the Tribunii choice, borrowed home system and hero, starting units and technology) and a faction reference, from Codex III; Thunder's Edge includes a revised Keleres, whose sheet wins where it differs. Full faction sheets live in the Faction Reference.",
      src: "Codex III pp.16–20 · TE p.4" },
    { id: "alliance", name: "Alliance game variant", requires: [["codex2", "te"]], modes: ["standard"], excludes: [], minPlayers: 4, maxPlayers: 8, playerCounts: [4, 6, 8],
      summary: "Teams of two (4, 6 or 8 players). An alliance wins when one ally has 14 victory points and the other at least 10.",
      description: "Allies share space without combat, fight together, trade on special terms and (with Prophecy of Kings) start with every commander unlocked. Codex II introduced it; Thunder's Edge revises it — with Thunder's Edge in play, its version (TE p.13) is the one shown.",
      src: "Codex II p.13 · TE p.13" },
    { id: "galacticEvents", name: "Galactic events (Codex IV)", requires: ["codex4"], modes: ["standard"], excludes: [], minPlayers: 3, maxPlayers: 8,
      summary: "Optional cards that change the rules for the whole game: Minor Factions, Total War, Age of Commerce, Age of Exploration.",
      description: "Pick one at random or choose one; advanced groups may use several. Minor Factions also changes galaxy setup.",
      choices: GE_KEYS.map(function (k) { return { id: geId(k), name: GE_NAMES[k] }; }),
      src: "Codex IV pp.15–16" },
    { id: "rightCatSoup", name: "Galaxy preset: “Right Cat Soup” (6 players)", requires: ["codex1"], modes: ["standard"], excludes: ["paxPresets", "gal-large", "gal-alt", "gal-premade", "gal-ltp", "te-map-thunderdreaming", "te-map-subjugation", "te-map-redvsblue", "te-map-legendary"], minPlayers: 6, maxPlayers: 6,
      summary: "A community-designed six-player map from Codex I, built only from base-game tiles.",
      description: "Replaces dealing and placing system tiles with a fixed layout: six named home positions around Mecatol Rex.",
      src: "Codex I p.13" },
    { id: "paxPresets", name: "Codex II galaxy preset (one per player count)", requires: ["codex2", "pok"], modes: ["standard"], excludes: ["rightCatSoup", "gal-large", "gal-alt", "gal-premade", "gal-ltp", "te-map-thunderdreaming", "te-map-subjugation", "te-map-redvsblue", "te-map-legendary"], minPlayers: 3, maxPlayers: 8,
      summary: "Fixed community maps: “Three's Company” (3), “Chokepoint” (4), “Race for Mecatol” (5), “Won't You Be My Neighbor?” (6), “Magi's Madness” (7), “Junk Yard Doggo” (8).",
      description: "Replaces dealing and placing system tiles with the preset for your player count. They use Prophecy of Kings tiles (numbered 52–91, PoK p.6), including hyperlanes.",
      choices: PRESETS.map(function (P) { return { id: P.id, name: P.name, summary: P.players + " players · by " + P.author, players: P.players, minPlayers: P.players, maxPlayers: P.players, src: "Codex II " + P.page }; }),
      src: "Codex II pp.14–19" }
  ];

  /* ----------------------------------------------------------------- STEPS */
  var steps = [
    /* ---------- Codex components (integration, before setup) ---------- */
    { id: "codex1-cards", after: "start", exp: "codex1",
      when: function (c) { return has(c, "codex1") && !tf(c); },
      t: "Codex I cards: Omega replacements and new action cards",
      d: function (c) {
        return ul([
          "<b>Omega Initiative</b> — these <b>replace</b> the cards of the same name and type:" + ul([
            "Faction technologies: <b>Wormhole Generator Ω</b> (Ghosts of Creuss), <b>Yin Spinner Ω</b> (Yin Brotherhood), <b>Magmus Reactor Ω</b> (Embers of Muaat).",
            "Basic technologies <b>Magen Defense Grid Ω</b> and <b>X-89 Bacterial Weapon Ω</b> — swap the copy in <b>every</b> colour's technology deck (each colour has its own deck: LRR p.4, step 4).",
            "Promissory notes: <b>War Funding Ω</b> (Letnev), <b>Greyfire Mutagen Ω</b> (Yin), <b>Stymie Ω</b> (Arborec), <b>Acquiescence Ω</b> (Winnu), <b>Cybernetic Enhancements Ω</b> (L1Z1X)."
          ]),
          "<b>Ixthian Artifacts</b> — shuffle the <b>20 new action cards</b> (17 titles; War Machine ×4) into the action deck.",
          "Tip: sleeve every card of a type alike, so nobody can spot a Codex card before drawing it; components that are never shuffled or hidden, like technologies, don't need it.",
          te(c) ? "<b>With Thunder's Edge:</b> its 74 “Codex Cards” are revised printings of all of this — use them and set the print-and-play cards aside. Where wording differs, the TE card wins (e.g. TE's Acquiescence only waives <i>spending</i> a command token)." : ""
        ]);
      },
      src: function (c) { return join("Codex I pp.4, 8–11", "LRR p.4", te(c) ? "TE pp.4–5" : ""); } },

    { id: "codex2-cards", after: "start", exp: "codex2",
      when: function (c) { return has(c, "codex2") && !tf(c); },
      t: "Codex II cards: reference cards and relics",
      d: function (c) {
        return ul([
          relicsOk(c) ? "<b>Relics:</b> shuffle <b>JR-XS455-O</b>, <b>Dynamis Core</b> and <b>Nano-Forge</b> into the relic deck."
            : "<b>Relics:</b> <b>JR-XS455-O</b>, <b>Dynamis Core</b> and <b>Nano-Forge</b> go in the relic deck, which comes with Prophecy of Kings or Thunder's Edge. Without either, there is no relic deck, so leave them out.",
          "<b>Faction reference cards</b> — a new card type summarising each faction; useful for drafting factions and for new players.",
          "<b>Alliance reference cards</b> — a new mini-card type, kept apart from other decks: whoever receives a faction's “Alliance” promissory note takes its card to see that faction's commander ability.",
          te(c) ? "<b>With Thunder's Edge:</b> use TE's own complete sets of Faction and Alliance reference cards — the Codex print-and-play versions are not used. TE's Codex cards include 3 relics and TE adds a Nano-Forge attachment token; use TE's printings where you have them." : ""
        ]);
      },
      src: function (c) { return join("Codex II pp.11–12", relicsOk(c) ? "" : "LRR p.5", te(c) ? "TE pp.4–5" : ""); } },

    { id: "codex3-cards", after: "start", exp: "codex3",
      when: function (c) { return has(c, "codex3") && !tf(c); },
      t: "Codex III cards: Omega leaders, secret objectives and exploration cards",
      d: function (c) {
        return ul([
          "<b>Omega Initiative</b> — replace the same-named cards:" + ul([
            "Xxcha hero <b>Political Data Nexus Ω</b> (Xxekir Grom).",
            "Yin agent <b>Brother Milor Ω</b>, commander <b>Brother Omar Ω</b> and hero <b>Quantum Dissemination Ω</b> (Dannel of the Tenth).",
            "Naalu agent <b>Z'eu Ω</b>, commander <b>M'aban Ω</b> and mech <b>Iconoclast Ω</b>.",
            "Secret objectives <b>Turn Their Fleets to Dust Ω</b>, <b>Make an Example of Their World Ω</b> and <b>Fight With Precision Ω</b>."
          ]),
          pok(c) ? "" : "Without Prophecy of Kings, skip the Ω leaders and mech — they replace Prophecy of Kings cards (Codex III p.13) — but still use the three Ω secret objectives.",
          pok(c) ? "<b>Ixthian Artifacts:</b> shuffle the <b>6 new frontier exploration cards</b> (Dead World; Minor, standard and Major Entropic Field; Keleres Ship ×2) into the frontier exploration deck."
            : "<b>Ixthian Artifacts:</b> Codex III's 6 new frontier exploration cards join the frontier exploration deck, a Prophecy of Kings component — leave them out without it.",
          "<b>New faction:</b> the <b>Council Keleres</b> join the faction pool — turn on “Council Keleres in play” if someone takes them.",
          te(c) ? "<b>With Thunder's Edge:</b> TE contains revised printings of all of these (6 leaders, 1 mech, 3 secret objectives, 6 exploration cards and the Keleres components) — use TE's cards." : ""
        ]);
      },
      src: function (c) { return join("Codex III pp.13–16", te(c) ? "TE p.4" : ""); } },

    { id: "codex4-cards", after: "start", exp: "codex4",
      when: function (c) { return has(c, "codex4") && !tf(c); },
      t: "Codex IV cards: relics and galactic events",
      d: function (c) {
        return ul([
          (relicsOk(c) ? "<b>Relics:</b> shuffle <b>Circlet of the Void</b>, <b>Book of Latvinia</b> and <b>Neuraloop</b> into the relic deck — they replace nothing."
            : "<b>Relics:</b> <b>Circlet of the Void</b>, <b>Book of Latvinia</b> and <b>Neuraloop</b> go in the relic deck (they replace nothing), which comes with Prophecy of Kings or Thunder's Edge. Without either, leave them out.") +
            (lib(c) ? " In Liberation of Ordinian, Circlet of the Void and Neuraloop instead start with the Naaz-Rokha and Nomad players (step 11)." : ""),
          "<b>Galactic event cards</b> (a new card type): Minor Factions, Total War, Age of Commerce and Age of Exploration — used only if you play with galactic events" + (geOn(c) ? " (you are — see the galactic events step)" : "") + ".",
          te(c) ? "<b>With Thunder's Edge:</b> TE says it includes all Codex gameplay content in revised form; its 20-card galactic event deck includes Minor Factions and Age of Exploration. Use TE's printings where you have them." : ""
        ]);
      },
      src: function (c) { return join("Codex IV pp.14–16", relicsOk(c) ? "" : "LRR p.5", lib(c) ? "Codex IV p.18" : "", te(c) ? "TE pp.4–5, 16" : ""); } },

    /* ---------- Twilight's Fall (Thunder's Edge mode): which Codex components still apply ---------- */
    { id: "codex-tf", after: "start",
      exp: function (c) { var ids = ["codex1", "codex2", "codex3", "codex4"]; for (var i = 0; i < ids.length; i++) { if (has(c, ids[i])) return ids[i]; } return "codex1"; },
      when: function (c) { return tf(c) && (has(c, "codex1") || has(c, "codex2") || has(c, "codex3") || has(c, "codex4")); },
      t: "Twilight Codex cards in Twilight's Fall",
      d: function (c) {
        var relics = [];
        if (has(c, "codex2")) relics.push("JR-XS455-O, Dynamis Core and Nano-Forge (Codex II)");
        if (has(c, "codex4")) relics.push("Circlet of the Void, Book of Latvinia and Neuraloop (Codex IV)");
        /* list only what the selected volumes contain: Codex I = Ω technologies/promissory notes + action cards,
           Codex III = Ω leaders/mech, Codex IV = galactic events (Codex II has none of these) */
        var out = [];
        if (has(c, "codex1")) out.push("Codex I's Omega technologies, Omega promissory notes and 20 action cards");
        if (has(c, "codex3")) out.push("Codex III's Omega leaders and mech");
        if (has(c, "codex4")) out.push("Codex IV's galactic events");
        var boxed = "Twilight's Fall returns standard action cards, technologies, promissory notes, leaders, standard mechs and galactic events to the box before setup";
        return ul([
          out.length > 1 ? boxed + ", so these are <b>not used</b>:" + ul(out) : boxed + (out.length ? ", so " + out[0] + " are <b>not used</b>." : "."),
          has(c, "codex2") ? "Codex II's print-and-play faction and Alliance reference cards aren't used either — Thunder's Edge has its own sets (TE p.4)." : "",
          relics.length ? "Relics are still used — Twilight's Fall boxes only Maw of Worlds, Prophet's Tears and The Quantumcore — so the Codex relics can join the relic deck: " + relics.join("; ") + ". Use Thunder's Edge's printings where you have them." : "",
          has(c, "codex3") ? "Also still compatible: Codex III's secret objectives <b>Turn Their Fleets to Dust</b>, <b>Make an Example of Their World</b> and <b>Fight With Precision</b>" +
            (pok(c) ? ", and its six frontier exploration cards." : ".") : ""
        ]);
      },
      src: function (c) { return join("TF p.6", "TE p.4", has(c, "codex1") ? "Codex I pp.8–11" : "", has(c, "codex2") ? "Codex II pp.11–12" : "", has(c, "codex3") ? "Codex III pp.13–15" : "", has(c, "codex4") ? "Codex IV pp.14–16" : ""); } },

    /* ---------- Galactic events (Codex IV) ---------- */
    { id: "ge-pick", after: "lrr-setup-1", exp: "codex4",
      when: function (c) { return geOn(c) && !te(c); },
      t: "Galactic events: choose the event",
      d: function (c) {
        var g = geChoice(c);
        return ul([
          g === "any" ? "As a group, <b>draw one event at random</b> or <b>choose one</b> ahead of time; advanced groups can play with several at once." :
            "You chose <b>" + GE_NAMES[g] + "</b>. (Events can also be drawn at random, and advanced groups can combine several.)",
          te(c) ? "Thunder's Edge places this choice right after the speaker is determined; its galactic event deck has 20 cards (it names Minor Factions and Age of Exploration among them), and some events modify setup further." : "",
          "Read the event card aloud — its rules are printed on the card (Codex IV pp.15–16) and summarised in the Rules Reference.",
          geHas(c, "minorFactions") ? "<b>Minor Factions</b> changes how the galaxy is built — see the Minor Factions step just before the galaxy is created." : ""
        ]);
      },
      src: function (c) { return join("Codex IV pp.15–16", te(c) ? "TE pp.5–6, 12" : ""); } },

    { id: "ge-minor-factions", after: "lrr-setup-5", exp: "codex4",
      when: function (c) { return geHas(c, "minorFactions") && !(te(c) && on(c, "te-map-subjugation")); },
      t: "Minor Factions: before you build the galaxy",
      d: function (c) {
        var any = geChoice(c) === "any";
        return (any ? p("<b>Only if the Minor Factions event is in play.</b>") : "") + ul([
          "When dealing system tiles (step 6, substep ii), deal each player <b>1 fewer blue tile</b>.",
          "Before building the galaxy, shuffle the <b>faction reference cards</b> of every faction nobody is playing and deal <b>1 to each player</b>" + (has(c, "codex2") || te(c) ? "." : " (these cards come from Codex II's print-and-play file or Thunder's Edge)."),
          "In speaker order, each player places that faction's <b>home system in the second ring, equidistant from players' home systems</b>, then puts <b>3 neutral infantry</b> on its planets, split as evenly as possible.",
          "These are <b>minor faction systems</b> — they don't count as home systems.",
          "Six-player example: the six minor faction systems fill every other second-ring space — the six that are not in line between Mecatol Rex and a home system.",
          te(c) ? "Neutral infantry: use Thunder's Edge's plastic neutral units; the neutral unit reference card gives infantry combat 8 (who rolls for them and hit order: TE p.10)." : "Neutral infantry: use proxy components or figures; they have a <b>combat value of 8</b>. Codex IV doesn't say who rolls for them; Thunder's Edge's later neutral-unit rules have any player other than the active player roll (TE p.10).",
          te(c) ? "If the <b>Ghosts of Creuss</b> or <b>Crimson Rebellion</b> are dealt as a minor faction, put the Creuss Gate or the Sorrow in the minor-faction space and set the home system beside the board."
            : "If the <b>Ghosts of Creuss</b> are dealt as a minor faction, put the Creuss Gate in the minor-faction space and set their home system beside the board (a later clarification, TE p.16).",
          pok(c) ? "" : "Without Prophecy of Kings, play the event but ignore its paragraph that grants a faction's alliance card.",
          fixedMap(c) ? "You also chose a fixed premade map: this event assumes the standard dealt-tile galaxy (it changes how tiles are dealt), and the rulebooks don't say how to combine it with the map you chose" +
            (te(c) ? " — Thunder's Edge's “Subjugation” map is the one premade map built for this event (TE p.14)." : ".") : ""
        ]);
      },
      src: function (c) { return join("Codex IV p.15", te(c) ? (fixedMap(c) ? "TE pp.5, 7, 10, 14, 16" : "TE pp.5, 7, 10, 16") : "TE pp.10, 16"); } },

    /* ---------- Council Keleres (Codex III) ---------- */
    { id: "keleres-tribunii", after: "lrr-setup-2", exp: keleresExp,
      when: function (c) { return keleresOn(c); },
      t: "Council Keleres: the Tribunii choice",
      d: function (c) {
        return ul([
          "The Keleres player chooses <b>one faction that no one is playing</b> from: <b>the Mentak Coalition</b>, <b>the Xxcha Kingdom</b> or <b>the Argent Flight</b> (faction ability “The Tribunii”). Since it must be unplayed, choose once the other factions are known.",
          pok(c) ? "" : "Without Prophecy of Kings only the Mentak and Xxcha are options: the Argent Flight's components come in that expansion (PoK p.7).",
          "That choice gives the Keleres their <b>home system</b>, their <b>command tokens and control markers</b>" + (pok(c) ? ", and their <b>hero</b> for this game (next step)." : "."),
          te(c) ? "<b>With Thunder's Edge:</b> TE includes the Keleres in revised form (TE p.4)" + (pok(c) ? " and they still have three possible home systems (TE p.14)" : "") + ". The TE rulebook doesn't print their sheet, so these steps follow Codex III — where your TE faction sheet differs, the sheet wins." : ""
        ]);
      },
      src: function (c) { return join("Codex III p.18", pok(c) ? "" : "PoK p.7", te(c) ? (pok(c) ? "TE pp.4, 14" : "TE p.4") : ""); } },

    { id: "keleres-components", after: "lrr-setup-3", exp: keleresExp,
      when: function (c) { return keleresOn(c); },
      t: "Council Keleres: faction components",
      d: function (c) {
        return ul([
          "Keleres components: faction sheet; faction technologies <b>Agency Supply Network</b> and <b>I.I.H.Q. Modernization</b>; promissory note <b>Keleres Rider</b>; mech <b>Omniopiares</b>; agent <b>Xander Alexin Victori III</b>; commander <b>Suffi An</b>.",
          pok(c) ? "Hero: only the Tribunii for your choice — <b>Kuuasi Aun Jalatai</b> (Argent Flight), <b>Odlynn Myrr</b> (Xxcha) or <b>Harka Leeds</b> (Mentak). The other two go back in the box with the other unused faction components." : "",
          "From the chosen faction: its <b>home system tile</b>, <b>command tokens</b> and <b>control markers</b>. That is the Keleres home system this game, so in step 5 the Keleres take its planet cards.",
          "Set the <b>Custodia Vigilia</b> planet card and its legendary planet ability card aside — the Keleres gain them only by researching I.I.H.Q. Modernization.",
          pok(c) ? "" : "Without Prophecy of Kings, leave out the mech and all leaders (agent, commander and heroes) — they are Prophecy of Kings component types (PoK p.10)" + (te(c) ? "; Thunder's Edge says to remove leaders and mechs when Prophecy of Kings isn't used (TE p.4)." : "."),
          te(c) ? "<b>With Thunder's Edge:</b> TE reprints the Keleres with revised components (faction sheet, mech, 5 leaders, promissory note, 2 faction technologies and the Custodia Vigilia cards), including a faction technology named <b>Executive Order</b> that Codex III doesn't have. Use TE's sheet and cards; where they differ from the names above, TE wins." : "",
          "Faction sheet details: <a href='" + FACTION_REF + "'>Faction Reference</a>."
        ]);
      },
      src: function (c) { return join("Codex III pp.16–18", "LRR p.4", pok(c) ? "" : "PoK p.10", te(c) ? "TE pp.4, 16" : ""); } },

    { id: "keleres-start", after: "lrr-setup-11", exp: keleresExp,
      when: function (c) { return keleresOn(c); },
      t: "Council Keleres: starting units and technology",
      d: function (c) {
        return ul([
          "Starting units, in the borrowed home system: <b>2 carriers, 1 cruiser, 2 fighters, 2 infantry, 1 space dock</b>.",
          "Starting technology: <b>choose 2 non-faction technologies owned by other players</b>.",
          "Choose <b>after every other player</b> has chosen their starting technologies. If only one such technology exists among the other factions, the Keleres get just that one (Wiki FAQ).",
          te(c) ? "With Thunder's Edge, check these against the back of your TE faction sheet — the sheet wins where it differs." : ""
        ]);
      },
      src: function (c) { return join("Codex III p.19", "Wiki FAQ (The Council Keleres)", te(c) ? "TE p.4" : ""); } },

    /* ---------- Alliance game variant (Codex II; TE revision) ---------- */
    { id: "alliance-pairs", after: "lrr-setup-2", exp: "codex2",
      when: function (c) { return allianceOn(c); },
      t: "Alliance variant: pair up allies",
      d: function (c) {
        return ul([
          "Every player is also assigned an <b>ally</b>: split the table into <b>" + num(c.p / 2) + " pairs</b>. Any faction, seat or ally drafting method works" + (te(c) ? "." : ", and so do premade maps for 4, 6 or 8 players."),
          te(c) ? "Each player takes the <b>Alliance reference card</b> of their ally's faction and places it in their play area." : "",
          te(c) ? "<b>Mahact Gene-Sorcerers:</b> their ally also places a command token from their reinforcements in the Mahact's fleet pool." : ""
        ]);
      },
      src: function (c) { return allianceSrc(c); } },

    { id: "alliance-cards", after: "lrr-setup-4", exp: "codex2",
      when: function (c) { return allianceOn(c) && (!te(c) || pok(c)); },
      t: "Alliance variant: alliance cards and commanders",
      d: function (c) {
        if (te(c)) {
          return ul([
            "Each player <b>purges</b> their “Alliance” promissory note and flips their <b>commander</b> to its unlocked side — <b>all commanders start unlocked</b>. (Thunder's Edge makes this step Prophecy of Kings only.)"
          ]);
        }
        if (!pok(c)) {
          return ul([
            "<b>Without Prophecy of Kings, skip this step.</b> It purges “Alliance” promissory notes and unlocks commanders — both Prophecy of Kings components (PoK p.10) — and an Alliance reference card only shows an ally's commander ability (Codex II p.11).",
            "Thunder's Edge's later version of the variant likewise limits purging “Alliance” notes and unlocking commanders to games with Prophecy of Kings, but it moves taking your ally's Alliance reference card to step 2 for every game (TE p.13).",
            "Codex II numbers this as step 3, “Choose Color”; in the Living Rules Reference, Choose Color is step 4."
          ]);
        }
        return ul([
          "Each player <b>purges</b> their “Alliance” promissory note, then takes the <b>Alliance reference card</b> of their ally's faction and places it in their play area.",
          "Each player flips their <b>commander</b> to its unlocked side — <b>all commanders start unlocked</b>.",
          "The Mahact Gene-Sorcerers have no “Alliance” promissory note, but they do have an Alliance reference card.",
          "Codex II numbers this as step 3, “Choose Color”; in the Living Rules Reference, Choose Color is step 4 — the step that hands out your colour's promissory notes and leader sheet."
        ]);
      },
      src: function (c) { return join(allianceSrc(c), te(c) ? "" : "LRR p.4", pok(c) ? "PoK p.8" : "Codex II p.11 · PoK p.10 · TE p.13"); } },

    { id: "alliance-track", after: "lrr-setup-12", exp: "codex2",
      when: function (c) { return allianceOn(c); },
      t: "Alliance variant: how an alliance wins",
      d: function () {
        return ul(["An alliance wins when one ally has <b>14</b> victory points and the other has <b>at least 10</b> — which is why the variant plays on the <b>14</b> side of the victory point track."]);
      },
      src: function (c) { return allianceSrc(c); } },

    /* ---------- Galaxy presets ---------- */
    { id: "preset-rcs", after: "lrr-setup-6:replace", exp: "codex1",
      when: function (c) { return rcsOn(c); },
      t: "Create the galaxy: “Right Cat Soup” preset (6 players)",
      d: function (c) { return presetStepHtml(c, RCS); },
      src: function (c) { return join("Codex I p.13", "LRR p.4", pok(c) ? "PoK p.12" : "", te(c) ? "TE pp.4, 14" : ""); } },

    /* ---------- Scenario: Ordinian (Codex I) ---------- */
    { id: "ord-factions", after: "lrr-setup-2:replace", exp: "ordinian",
      when: function (c) { return ord(c); },
      t: "Choose factions (Ordinian scenario)",
      d: function (c) {
        return ul([
          c.p !== 6 ? "<b>This scenario is built for six players</b> — its fixed map holds all six listed factions' home systems (the scenario doesn't state a player count)." : "",
          "Each player chooses from: <b>the Arborec</b>, <b>the Ghosts of Creuss</b>, <b>the Nekro Virus</b>, <b>the Embers of Muaat</b>, <b>the L1Z1X Mindnet</b>, <b>the Barony of Letnev</b>.",
          c.p === 6 ? "Player count: the scenario doesn't state one. Its fixed map has exactly six home systems, one for each listed faction, so this page sets it up for <b>six players</b>." : "",
          "Place your faction sheet in your play area as usual."
        ]);
      },
      src: function () { return "Codex I p.12 · LRR p.4"; } },

    { id: "ord-nekro-tech", after: "lrr-setup-3", exp: "ordinian",
      when: function (c) { return ord(c); },
      t: "Nekro Virus: assimilated Argent technologies",
      d: function () {
        return ul([
          "The Nekro Virus player does <b>not</b> take <b>Valefar Assimilator X</b> or <b>Y</b>.",
          "Instead they use <b>???_EXCEPTION_NO_ID_???</b> and <b>????_REDACTED_????</b>, assimilated from the Argent Flight (texts in the Rules Reference)."
        ]);
      },
      src: function () { return "Codex I p.12"; } },

    { id: "ord-board", after: "lrr-setup-6:replace", exp: "ordinian",
      when: function (c) { return ord(c); },
      t: "Create the galaxy (Ordinian map)",
      d: function (c) {
        return ul([
          "Build the galaxy <b>exactly as shown</b>. <b>Mecatol Rex is not used</b>: the nebula (tile 42) is the centre.",
          "Home systems sit in the ring-3 corners: <b>10</b> (Arc Prime / Wren Terra) at the top, then clockwise <b>4</b> (Muaat), <b>17</b> (Creuss Gate), <b>5</b> (Nestphar), <b>8</b> (Mordai II), <b>6</b> ([0.0.0]). The Ghosts of Creuss home system (51) is drawn off the board beside the Creuss Gate.",
          "System tiles to pull (" + scenarioTiles("ordinian").length + "): " + scenarioTiles("ordinian").join(", ") + ", plus the central nebula (42). The six home systems are the players' own.",
          pok(c) ? "Wormhole nexus: the scenario doesn't mention it; standard Prophecy of Kings setup places it beside the board (LRR p.4)." : ""
        ]) + mapBlock("ordinian", "Codex I Ordinian scenario map — hex map with tile numbers", c);
      },
      src: function (c) { return join("Codex I p.12", pok(c) ? "LRR p.4" : ""); } },

    { id: "ord-tokens", after: "lrr-setup-7:replace", exp: "ordinian",
      when: function (c) { return ord(c); },
      t: "Place the Coatl (custodians token)",
      d: function (c) {
        return ul([
          "Place the <b>custodians token</b> on the central nebula with its <b>“6” side faceup</b>. It represents the Argent flagship <b>Coatl</b>; the standard custodians token rules are <b>not</b> used (see the Rules Reference).",
          pok(c) ? "As normal: a frontier token on each system with no planets (return the rest), and attachment tokens beside the board." : ""
        ]);
      },
      src: function (c) { return join("Codex I p.12", pok(c) ? "LRR p.5" : ""); } },

    { id: "ord-start", after: "lrr-setup-11", exp: "ordinian",
      when: function (c) { return ord(c); },
      t: "Nekro Virus: extra starting forces",
      d: function () {
        return ul([
          "In addition to their normal starting units, the Nekro Virus player places <b>the Alastor</b> (flagship), <b>2 dreadnoughts</b> and <b>2 fighters</b> from reinforcements in the <b>central nebula</b>.",
          "The Nekro Virus also <b>begins with both assimilated technologies in play</b>, as if they were Nekro faction technologies."
        ]);
      },
      src: function () { return "Codex I p.12"; } },

    /* ---------- Scenario: Liberation of Ordinian (Codex IV) ---------- */
    { id: "lib-speaker", after: "lrr-setup-1:replace", exp: "liberation",
      when: function (c) { return lib(c); },
      t: "Determine speaker (Liberation)",
      d: function () { return ul(["The player who chooses the <b>Nekro Virus</b> in the next step is the <b>speaker</b>."]); },
      src: function () { return "Codex IV p.17"; } },

    { id: "lib-factions", after: "lrr-setup-2:replace", exp: "liberation",
      when: function (c) { return lib(c); },
      t: "Assign factions (Liberation)",
      d: function (c) {
        return ul([
          c.p !== 6 ? "<b>This scenario requires exactly six players</b> (and Prophecy of Kings) — you have " + c.p + " selected." : "Requires exactly <b>six players</b> and <b>Prophecy of Kings</b>" + (pok(c) ? "." : " — which you haven't selected."),
          "Each player chooses one of: <b>Xxcha Kingdom</b>, <b>Federation of Sol</b>, <b>Ghosts of Creuss</b>, <b>Naaz-Rokha Alliance</b>, <b>Nekro Virus</b> (the speaker), <b>Nomad</b>.",
          "The <b>Federation of Sol</b> and <b>Xxcha Kingdom</b> are allies — the Salient Sun joint task force.",
          "Place your faction sheet in your play area as usual."
        ]);
      },
      src: function () { return "Codex IV pp.17–18 · LRR p.4"; } },

    { id: "lib-components", after: "lrr-setup-3", exp: "liberation",
      when: function (c) { return lib(c); },
      t: "Scenario components (Liberation)",
      d: function (c) {
        return ul([
          "<b>Xxcha and Sol</b> gain the <b>F.S.S. Orlando</b> hero card; both of them must agree to use it.",
          "Codex IV also has Xxcha and Sol resolve the Alliance variant's setup step 3 (Codex II) here. But the “Alliance” promissory note comes with your colour in step 4, and step 4 also seats your leaders on the leader sheet — so do that alliance setup right after step 4 (below).",
          "<b>Ghosts of Creuss:</b> replace your three leaders with the three <b>Unknown</b> leaders — agent <b>Forlorn Shadow</b>, commander <b>Wistful Soul</b>, hero <b>Wayward Riftwalker</b>.",
          "<b>Nekro Virus:</b> don't take <b>Valefar Assimilator X</b> or <b>Y</b>; use the assimilated technologies <b>???_NULL_REFERENCE_???</b> and <b>???_ERROR_ERROR_???</b> instead.",
          "<i>Not covered: Codex IV doesn't say whether the Nekro start with these two technologies in play. Codex I's Ordinian scenario explicitly starts its Nekro with theirs in play; Liberation's starting-components step doesn't mention them — agree on it before you start.</i>"
        ]);
      },
      src: function () { return join("Codex IV p.17", "Codex II p.13", "LRR p.4", "Codex I p.12"); } },

    { id: "lib-color", after: "lrr-setup-4", exp: "liberation",
      when: function (c) { return lib(c); },
      t: "Colour and the Salient Sun alliance (Liberation)",
      d: function (c) {
        return ul([
          "The <b>Ghosts of Creuss</b> must choose <b>red</b>.",
          "<b>Xxcha and Sol</b> now resolve the Alliance variant's setup step 3 (Codex II), as Codex IV's step 3 asks: each <b>purges</b> their “Alliance” promissory note, takes the other's <b>Alliance reference card</b>" + (te(c) ? " (Thunder's Edge's set)" : "") + " into their play area, and flips their <b>commander</b> to its unlocked side."
        ]);
      },
      src: function (c) { return join("Codex IV p.17", "Codex II p.13", "PoK p.8", te(c) ? "TE pp.4, 13" : ""); } },

    { id: "lib-board", after: "lrr-setup-6:replace", exp: "liberation",
      when: function (c) { return lib(c); },
      t: "Create the galaxy (Liberation map)",
      d: function (c) {
        return ul([
          "Build the galaxy <b>exactly as shown</b>, with the <b>Ordinian</b> system tile in the centre. <b>Mecatol Rex is not used.</b>",
          "Home systems sit in the ring-3 corners: <b>01</b> (Jord) at the top, then clockwise <b>08</b> (Mordai II), <b>14</b> (Archon Ren / Archon Tau), <b>53</b> (Arcturus), <b>17</b> (Creuss Gate), <b>57</b> (Naazir / Rokha).",
          "System tiles to pull (" + scenarioTiles("liberation").length + "): " + scenarioTiles("liberation").join(", ") + ", plus the Ordinian system tile. The six home systems are the players' own.",
          "Wormhole nexus: the scenario doesn't mention it; standard Prophecy of Kings setup places it beside the board (LRR p.4)."
        ]) + mapBlock("liberation", "Codex IV Liberation of Ordinian map — hex map with tile numbers", c);
      },
      src: function () { return "Codex IV p.18 · LRR p.4"; } },

    { id: "lib-tokens", after: "lrr-setup-7:replace", exp: "liberation",
      when: function (c) { return lib(c); },
      t: "Game board tokens (Liberation)",
      d: function () {
        return ul([
          "<b>Do not place the custodians token.</b>",
          "As normal: a frontier token on each system with no planets (return the rest), and attachment tokens beside the board."
        ]);
      },
      src: function () { return "Codex IV p.18 · LRR p.5"; } },

    { id: "lib-start", after: "lrr-setup-11", exp: "liberation",
      when: function (c) { return lib(c); },
      t: "Extra starting components (Liberation)",
      d: function () {
        return ul([
          "<b>Nekro Virus:</b> takes the <b>Ordinian</b> planet card and its legendary planet card (<b>Barren Husk</b>), gains <b>1 extra command token in the fleet pool</b>, and places <b>2 dreadnoughts, 2 carriers, 4 fighters and 4 infantry</b> in the Ordinian system.",
          "<b>Ghosts of Creuss:</b> place <b>1 cruiser, 1 carrier and 2 infantry</b> in the Creuss Gate.",
          "<b>Naaz-Rokha Alliance:</b> gains the <b>Circlet of the Void</b> relic.",
          "<b>Nomad:</b> gains the <b>Neuraloop</b> relic."
        ]);
      },
      src: function () { return "Codex IV p.18"; } },

    { id: "lib-objective", after: "lrr-setup-12", exp: "liberation",
      when: function (c) { return lib(c); },
      t: "Liberate Ordinian objective",
      d: function () {
        return ul([
          "Place the <b>Liberate Ordinian</b> objective card <b>faceup</b> next to the other stage I objectives.",
          "Its stage I side (scored in the action phase, 1 VP): <b>win a combat against the Nekro Virus</b>. It flips to its stage II side later (Rules Reference)."
        ]);
      },
      src: function () { return "Codex IV p.18"; } }
  ];

  /* one step per Codex II preset (static titles); each replaces LRR step 6 */
  PRESETS.forEach(function (P) {
    steps.push({ id: "preset-" + P.id, after: "lrr-setup-6:replace", exp: "codex2",
      when: function (c) { var Q = codex2Preset(c); return !!Q && Q.id === P.id; },
      t: "Create the galaxy: " + P.name + " preset (" + P.players + " players)",
      d: function (c) { return presetStepHtml(c, P); },
      src: function (c) { return join("Codex II " + P.page, "PoK p.12", P.players === 5 ? "LRR pp.4–5" : "LRR p.4", te(c) ? "TE pp.4, 14" : ""); } });
  });

  /* ------------------------------------------------------------- REFERENCE */
  var reference = [
    { id: "codex-rules-updates", title: "Twilight Codex rules updates — are they still current?",
      when: function (c) { return has(c, "codex1"); },
      html: function (c) {
        return p("Codex I lists five updates published in the Living Rules Reference. All five are already in <b>LRR v2.0 (09/22/20)</b>, the rules text this page follows — nothing here overrides it:") + ul([
          tf(c) ? "<i>Its Diplomacy and Hyper Metabolism updates don't apply in Twilight's Fall, which returns the standard strategy cards and technologies to the box (TF p.6).</i>" : "",
          tf(c) ? "" : "<b>Diplomacy</b> (strategy card): the primary ability readies <b>any two</b> of your exhausted planets instead of every planet in the chosen system — LRR 32.2 (the LRR changelog lists Diplomacy errata in v1.1, 02/03/18, and v1.3, 05/04/20). Prophecy of Kings includes the revised card.",
          tf(c) ? "" : "<b>Hyper Metabolism</b> (technology): gain <b>3</b> command tokens in the status phase instead of 2 — errata added in LRR v1.1 (02/03/18) and printed in the LRR's errata section (p.40); matches the Wiki Errata.",
          "<b>Gravity rifts:</b> roll for each ship <b>as it leaves or passes through</b> the rift, not in the destination; on 1–3 the ship is <b>removed</b> to reinforcements, not destroyed, so “when destroyed” abilities don't trigger — LRR 41.2 and 31.2 (added v1.1 02/03/18, corrected v1.2 06/12/19).",
          "<b>Later change (Thunder's Edge, 2025):</b> a gravity rift adds its +1 move bonus to a ship only <b>once</b> — “a change from previous rulings”. For the move bonus this replaces LRR 41.3 (a rift can affect the same ship several times in one move).",
          "<b>Retreating with ground forces:</b> you no longer move them into the space area during “Announce Retreats”; a retreating ship simply <b>transports ground forces from planets in its system</b> as normal — LRR 78.4, 78.7 and 95.1 (corrected in v1.2, 06/12/19). The Wiki FAQ confirms any effect that moves a ship lets it transport units from its system.",
          "<b>Rerolls in combat:</b> roll <b>all</b> your dice first, then decide which, if any, to reroll — LRR 74.3 and 78.5e (v1.3, 05/04/20)."
        ]) + p("Precedence used here (newest wins): Thunder's Edge (2025) › Codex IV (2025) › Codex III (2022) › Codex II (2021) › LRR v2.0 (09/22/20) › Codex I (2020 — it summarises LRR changes)." +
          (tf(c) ? "" : " The Omega cards below are not in the LRR; Thunder's Edge reprints them in revised form."));
      },
      src: function (c) { return tf(c) ? "Codex I p.14 · LRR pp.2–3, 16, 19, 28–30, 36 · TE p.16 · TF p.6 · Wiki FAQ (Unit Transportation)"
        : "Codex I p.14 · LRR pp.2–3, 16, 19, 28–30, 36, 40 · PoK p.6 · TE p.16 · Wiki Errata · Wiki FAQ (Unit Transportation)"; } },

    { id: "codex1-card-texts", title: "Codex I: Omega cards and Ixthian action cards",
      when: function (c) { return has(c, "codex1") && !tf(c); },
      html: function (c) {
        return p("The Omega Initiative reworks existing components “for usability and balance”; each Ω card <b>replaces</b> the card of the same name and type. Effects in brief:") +
          h("Technologies") + ul([
            "<b>Wormhole Generator Ω</b> (Creuss; blue, 2 blue prerequisites) — Action: exhaust to place or move a Creuss wormhole token into a system containing a planet you control, or a non-home system without other players' ships.",
            "<b>Yin Spinner Ω</b> (Yin; green, 2 green) — after you produce units, place up to 2 infantry from reinforcements on any planet you control or in any space area containing your ships.",
            "<b>Magmus Reactor Ω</b> (Muaat; red, 2 red) — your ships can move into supernovas; each supernova containing your units has PRODUCTION 5 as if it were one of your units.",
            "<b>Magen Defense Grid Ω</b> (red, 1 red) — at the start of a ground combat on a planet with your structures, you may produce 1 hit on 1 of your opponent's ground forces.",
            "<b>X-89 Bacterial Weapon Ω</b> (green, 3 green) — after your units bombard a planet, if at least 1 opposing infantry was destroyed, you may destroy all of that opponent's infantry there. Planetary Shield stops it, because it needs a bombardment to happen (Wiki FAQ)."
          ]) + h("Promissory notes (each returns to its owner after use)") + ul([
            "<b>War Funding Ω</b> (Letnev) — after both players roll in a space combat: reroll all of your opponent's dice and/or any number of your own. Combat rolls only — not anti-fighter barrage (Wiki FAQ).",
            "<b>Greyfire Mutagen Ω</b> (Yin) — at the start of a ground combat against 2 or more ground forces not controlled by the Yin player: replace 1 of your opponent's infantry with 1 of yours from reinforcements.",
            "<b>Stymie Ω</b> (Arborec) — after another player moves ships into a system containing your units: place 1 of that player's command tokens from their reinforcements in any non-home system.",
            "<b>Acquiescence Ω</b> (Winnu) — when the Winnu player resolves a strategic action: you may resolve the secondary without spending or placing a command token." + (te(c) ? " <i>TE's printing only waives spending the token.</i>" : ""),
            "<b>Cybernetic Enhancements Ω</b> (L1Z1X) — when you gain command tokens in the status phase: gain 1 more."
          ]) + h("Ixthian action cards (20)") + p("Insider Information, Plagiarize, Master Plan, Rally, Scramble Frequency, Forward Supply Base, Fighter Conscription, Blitz, Harness Energy, Hack Election, Reflective Shielding, Impersonation, Solar Flare, Sanction, Counterstroke, Ghost Squad, War Machine ×4.") +
          h("Official clarifications (Wiki FAQ)") + ul([
            "<b>Impersonation</b> can be played even at your secret-objective limit — draw, then return a secret and shuffle the deck.",
            "<b>Reflective Shielding</b> hits are assigned immediately, unless played during the normal Assign Hits step, where they join that step's hits.",
            "<b>Counterstroke</b> can't be played against the Mahact commander Il Na Viroset.",
            "<b>Ghost Squad</b> can't move the Titans' Hel-Titans (structures can't move).",
            "<b>Master Plan</b> works after a tactical action granted by the Naalu agent Z'eu Ω."
          ]) + (te(c) ? p("<b>With Thunder's Edge</b>, use its revised printings of all these cards (no Ω; marked with the Codex icon).") : "");
      },
      src: function (c) { return join("Codex I pp.3, 8–11", "Wiki FAQ (Units & Unit Abilities; Objectives; Action Cards; The Barony of Letnev; The Mahact Gene-Sorcerers; The Naalu Collective; The Titans of Ul)", te(c) ? "TE pp.4–5" : ""); } },

    { id: "codex2-card-texts", title: "Codex II: relics and reference cards",
      when: function (c) { return has(c, "codex2"); },
      html: function (c) {
        return ul([
          "<b>JR-XS455-O</b> (Lost Titan Prototype) — an extra <b>agent</b>: Action: exhaust and choose a player; they may spend 3 resources to place a structure on a planet they control, or else gain 1 trade good. Like other agents it can be lent to others, and it interacts with the Yssaril agent and the Nomad's Temporal Command Suite.",
          "<b>Nano-Forge</b> — Action: attach it to a non-legendary, non-home planet you control: +2 resources, +2 influence, and the planet becomes <b>legendary</b>. Once attached, the action can't be used again.",
          "<b>Dynamis Core</b> — while in your play area your commodity value is <b>+2</b>; Action: purge it to gain trade goods equal to your printed commodity value +2. If that leaves you above your maximum commodities, discard down (Wiki FAQ)." + (geCommerce(c) ? " During the <b>Age of Commerce</b> galactic event there is no commodity maximum, so you keep them (Codex IV p.16)." : ""),
          tf(c) ? "" : "<b>Faction reference cards</b> — each shows a complexity rating (green simple, yellow medium, red for experienced players), the faction's commodity value, starting units and technology, and a summary of its abilities and faction components.",
          tf(c) ? "" : "<b>Alliance reference cards</b> — show a faction's commander ability for whoever holds its “Alliance” promissory note; also used by the Alliance game variant" + (te(c) ? " and, with Thunder's Edge, by some galactic events: when you gain one for any reason other than an “Alliance” promissory note, place it in your play area and use its ability (TE p.12)" : "") + "."
        ]) + (tf(c) ? p("<i>Twilight's Fall: only these relics apply — reference cards come from Thunder's Edge (TF p.6, TE p.4).</i>") : (te(c) ? p("With Thunder's Edge, use TE's reference card sets instead of the print-and-play cards. TE's Codex cards also include 3 revised relics (TE p.4), and TE adds a Nano-Forge attachment token (TE p.5); use TE's printings of these relics where you have them.") : "")) +
          (relicsOk(c) ? "" : p("<i>The relics need a relic deck, which comes with Prophecy of Kings or Thunder's Edge — without either they stay in the box.</i>"));
      },
      src: function (c) { return join("Codex II pp.11–12", "Wiki FAQ (Exploration)", te(c) ? "TE pp.4–5, 12" : "", tf(c) ? "TF p.6" : "", geCommerce(c) ? "Codex IV p.16" : ""); } },

    { id: "codex3-card-texts", title: "Codex III: Omega leaders, secret objectives and exploration cards",
      when: function (c) { return has(c, "codex3"); },
      html: function (c) {
        return (tf(c) ? p("<i>Twilight's Fall returns leaders and standard mechs to the box (TF p.6) — only the secret objectives" + (pok(c) ? " and exploration cards" : "") + " below apply.</i>")
          : !pok(c) ? p("<i>Without Prophecy of Kings only the three Ω secret objectives below are used: the Ω leaders and mech replace Prophecy of Kings cards (Codex III p.13), and exploration is a Prophecy of Kings component.</i>")
          : (p("Each Ω card replaces its counterpart of the same name. What changed, as the Codex describes it, plus the new effect in brief:") +
          h("Xxcha") + ul([
            "<b>Political Data Nexus Ω</b> (hero, “Voice of the Council”) — reworked to help in and out of the agenda phase, reducing the old card's wild swings: when you exhaust planets, add each planet's resources and influence together and treat the total as both. Wiki FAQ: spend the combined value as resources <i>or</i> influence, not both; hero unlocks are checked only after the whole score-objectives step; abilities that use a planet's “resource value” (e.g. Uprising) use the printed value."
          ]) + h("Yin Brotherhood — the first faction with all three leaders reworked") + ul([
            "<b>Brother Milor Ω</b> (agent) — now covers ground combat too: after a player's unit is destroyed, exhaust to let that player place 2 fighters in that system (a ship) or 2 infantry on that planet (a ground force). With the Nekro or Naalu flagship abilities the owner chooses fighters or infantry (Wiki FAQ).",
            "<b>Brother Omar Ω</b> (commander) — counts as a green prerequisite; when you research a technology another player owns, you may return 1 of your infantry to reinforcements to ignore its prerequisites.",
            "<b>Quantum Dissemination Ω</b> (hero, Dannel of the Tenth) — the Greyfire mutagen turned to nastier ends: Action: commit up to 3 infantry from reinforcements to any non-home planets and resolve invasions there; no one can use space cannon against them; then purge."
          ]) + "<ul><li class=\"note flag\"><b>Sources disagree:</b> Brother Milor Ω's printed trigger has no phase limit (followed here); the Wiki FAQ reports an official answer that it can be used only in the action phase.</li><li class=\"note flag\"><b>Sources disagree:</b> Quantum Dissemination Ω as printed resolves invasions (followed here); the Wiki FAQ reports an official answer that it should resolve only ground combats, not full invasion steps, with Parley playable on one of those planets.</li></ul>" + h("Naalu Collective") + ul([
            "<b>Z'eu Ω</b> (agent) — a full operative now: Action: exhaust to let a player take a tactical action in a non-home system without placing a command token; the system still counts as activated. Wiki FAQ: that player is the active player for it, but it isn't their turn (no Fleet Logistics); Master Plan and Minister of War still work.",
            "<b>M'aban Ω</b> (commander) — at any time, look at your neighbours' promissory note hands and the top and bottom agenda cards. Not when Covert Legislation is revealed before the speaker draws, and not to interrupt the Politics primary (Wiki FAQ).",
            "<b>Iconoclast Ω</b> (mech) — other players can't use anti-fighter barrage against your units in its system; Sustain Damage; cost 2, combat 6."
          ]))) + h("Secret objectives (action phase, 1 VP) — adjusted to match expectations and work with more cards") + ul([
            "<b>Turn Their Fleets to Dust Ω</b> — destroy the last of a player's non-fighter ships in the active system during the space cannon offense step.",
            "<b>Make an Example of Their World Ω</b> — destroy the last of a player's ground forces on a planet during the bombardment step.",
            "<b>Fight With Precision Ω</b> — destroy the last of a player's fighters in the active system during the anti-fighter barrage step.",
            pok(c) && !tf(c) ? "Secrets are scored “after”: e.g. Turn Their Fleets to Dust is scored before the Yin agent triggers (Wiki FAQ)."
              : "Secrets are scored “after” the event that fulfils them (Wiki FAQ)."
          ]) + (pok(c) ? h("Frontier exploration cards (6)") + ul([
            "Dead World — draw 1 relic.",
            "Minor Entropic Field — 1 command token and 1 trade good; Entropic Field — 1 and 2; Major Entropic Field — 1 and 3.",
            "Keleres Ship (×2) — gain 2 command tokens."
          ]) : "") + (te(c) ? p("<b>With Thunder's Edge</b>, use its revised printings of these cards.") : "");
      },
      src: function (c) { return join(pok(c) ? "Codex III pp.13–15" : "Codex III pp.13–14", tf(c) || !pok(c) ? "Wiki FAQ (Objectives)" : "Wiki FAQ (The Xxcha Kingdom; The Yin Brotherhood; The Naalu Collective; Objectives)", te(c) ? "TE p.4" : "", tf(c) ? "TF p.6" : ""); } },

    { id: "codex4-card-texts", title: "Codex IV: relics",
      when: function (c) { return has(c, "codex4"); },
      html: function (c) {
        return ul([
          "<b>Circlet of the Void</b> — your units don't roll for gravity rifts, and you ignore the movement effects of other anomalies; Action: exhaust to explore a frontier token in a system without other players' ships (no Dark Energy Tap needed).",
          "<b>Book of Latvinia</b> — when you gain it, research up to 2 technologies that have no prerequisites; Action: purge it — if you control planets with <b>all 4</b> technology specialties, gain 1 victory point; otherwise gain the speaker token.",
          "<b>Neuraloop</b> — when a public objective is revealed, you may purge one of your relics to discard that objective and replace it with a random objective from <b>any</b> objective deck; the new objective is public, even if it is a secret objective."
        ]) + (lib(c) ? p("Liberation of Ordinian hands Circlet of the Void to the Naaz-Rokha and Neuraloop to the Nomad at setup.") : "") +
          (te(c) ? p("Thunder's Edge's Codex cards include 3 relics without naming them; if yours match these, use the TE printings.") : "") +
          (relicsOk(c) ? "" : p("<i>The relics need a relic deck, which comes with Prophecy of Kings or Thunder's Edge — without either they stay in the box.</i>"));
      },
      src: function (c) { return join("Codex IV p.14", lib(c) ? "Codex IV p.18" : "", te(c) ? "TE p.4" : ""); } },

    { id: "keleres-ref", title: "The Council Keleres",
      when: function (c) { return keleresOn(c); },
      html: function (c) {
        return (te(c) ? p("<b>Thunder's Edge</b> reprints this faction with revised components (e.g. a faction technology named Executive Order). The texts below are Codex III's — follow the TE faction sheet and cards where they differ.") : "") +
          h("Faction abilities") + ul([
            "<b>The Tribunii</b> — setup: take the home system, command tokens and control markers of an unplayed Mentak, Xxcha or Argent Flight, plus the matching hero" +
              (pok(c) ? "." : " (without Prophecy of Kings: Mentak or Xxcha only, and no hero)."),
            "<b>Council Patronage</b> — at the start of every strategy phase, replenish your commodities, then gain 1 trade good. Commodity value <b>2</b>.",
            "<b>Law's Order</b> — at the start of your turn you may spend 1 influence: treat all laws as blank until the end of your turn. Wiki FAQ: the laws are blank for <b>all</b> players during that turn."
          ]) + h("Units") + ul([
            "Flagship <b>Artemiris</b> — other players must spend <b>2 influence</b> to activate its system. Sustain Damage; cost 8, combat 7 (×2), move 1, capacity 6.",
            pok(c) ? "Mech <b>Omniopiares</b> — other players must spend <b>1 influence</b> to commit ground forces to its planet (each mech is a separate payment — Wiki FAQ). Sustain Damage; cost 2, combat 6." : ""
          ]) + (pok(c) ? h("Leaders") + ul([
            "Agent <b>Xander Alexin Victori III</b> — at any time, exhaust to let any player spend commodities as if they were trade goods (it lasts for that one spend — Wiki FAQ).",
            "Commander <b>Suffi An</b> — unlock: spend 1 trade good after playing an action card that has a component action. Then: after you perform a component action, you may perform an additional action.",
            "Heroes (unlock: 3 scored objectives; only the one matching your Tribunii choice): <b>Kuuasi Aun Jalatai</b> (Argent) — at the start of a space combat round in a system containing a planet you control, place your flagship and up to 2 cruisers/destroyers there from reinforcements. <b>Odlynn Myrr</b> (Xxcha) — after an agenda is revealed, cast up to 6 extra votes and predict the outcome aloud; gain 1 trade good and 1 command token for each player who votes otherwise. <b>Harka Leeds</b> (Mentak) — Action: reveal action cards until you find 3 with component actions; draw those and shuffle the rest back. Each hero is then purged."
          ]) : p("<i>Without Prophecy of Kings the Keleres play without their mech and leaders (agent, commander and heroes) — those component types come with that expansion (PoK p.10).</i>")) +
          h("Technologies, promissory note and Custodia Vigilia") + ul([
            "<b>Agency Supply Network</b> (yellow, 2 yellow prerequisites) — when you resolve one of your PRODUCTION abilities, you may resolve another of your PRODUCTION abilities in any system (that extra use doesn't retrigger it). Wiki FAQ: it must be a different unit; Sarween Tools applies to each use.",
            "<b>I.I.H.Q. Modernization</b> (yellow, 1 yellow) — you are neighbours with every player who has units or controls planets in or adjacent to the Mecatol Rex system; gain the <b>Custodia Vigilia</b> planet card (2 resources, 3 influence) and its legendary ability. You can't lose them; no X or Y assimilator token can go on this technology.",
            "<b>Custodia Vigilia</b> (legendary) — while you control Mecatol Rex it gains SPACE CANNON 5 and PRODUCTION 3; gain 2 command tokens when another player scores a victory point using Imperial (only Imperial's point for controlling Mecatol Rex — Wiki FAQ). Wiki FAQ: it isn't on the board, is gained exhausted, counts as a planet for objectives and agendas that fit, can be explored and take Terraform (not Nano-Forge), holds no units, and the Keleres can't be eliminated while they control it; its PRODUCTION counts as a unit (Sarween Tools).",
            "<b>Keleres Rider</b> (promissory note) — after an agenda is revealed: you can't vote on it; predict an outcome aloud — if right, draw 1 action card and gain 2 trade goods. Then return it."
          ]) + p("Full faction sheet and card art: <a href='" + FACTION_REF + "'>Faction Reference</a>.");
      },
      src: function (c) { return join("Codex III pp.16–20", "Wiki FAQ (The Council Keleres)", pok(c) ? "" : "PoK p.10", te(c) ? "TE pp.4, 16" : ""); } },

    { id: "alliance-ref", title: "Alliance game variant",
      when: function (c) { return allianceOn(c); },
      html: function (c) {
        var intro = p("Teams of two against up to three other alliances; <b>4, 6 or 8 players</b>." + (te(c) ? " This is Thunder's Edge's revised version." : " Works with premade maps for those counts and any faction, seat or ally drafting method."));
        var diff = te(c) ? h("What Thunder's Edge changed from Codex II") + ul([
          "The Alliance reference card is taken in step 2; purging “Alliance” notes and unlocking commanders (step 4) now applies only with Prophecy of Kings.",
          "The Mahact's ally puts a command token in the Mahact's fleet pool.",
          "Ground forces may land on planets your ally <b>controls</b>; you may also <b>support and commit</b> your ally's fighters and ground forces, not just transport them.",
          "New: activation triggers don't fire between allies; your unit abilities don't affect your ally; agents can be used on your ally.",
          "Ally planets don't count for scoring objectives or the “Imperial” point (Codex II said “such as scoring objectives or unlocking leaders”)."
        ]) : p("<i>Thunder's Edge (2025) publishes a revised version of this variant (TE p.13); select Thunder's Edge to see it.</i>");
        return intro + allianceRules(c) + diff;
      },
      src: function (c) { return te(c) ? "TE p.13 · Codex II p.13" : "Codex II p.13"; } },

    { id: "galactic-events-ref", title: "Galactic events (Codex IV)",
      when: function (c) { return geOn(c); },
      html: function (c) {
        var parts = [p("Optional cards picked during setup — one at random, one chosen, or several for advanced groups. Complexity is shown on each card (1–3 bars)." +
          (te(c) ? " Thunder's Edge adds more events to the deck; they're covered with Thunder's Edge." : ""))];
        if (geHas(c, "minorFactions")) {
          parts.push(h("Minor Factions (complexity 2)") + ul([
            "Setup: 1 fewer blue tile each. Before creating the galaxy, shuffle the reference cards of the factions nobody is playing and deal 1 to each player. In speaker order, each player places that faction's home system in the second ring, equidistant from players' home systems, then places 3 neutral infantry (combat 8) on its planets, split as evenly as possible. These minor faction systems are not home systems.",
            "When a player controls <b>every planet</b> in a minor faction system, they take that faction's <b>alliance card</b> — from the deck or from whoever had it." + (te(c) ? " Place it in your play area; you can use its ability (TE p.12)." : " The Codex calls this gaining the faction's abilities."),
            "Planets in minor faction systems have <b>all three traits</b> — cultural, industrial and hazardous.",
            "Needs Prophecy of Kings; without it, ignore the alliance-card paragraph."
          ]));
        }
        if (geHas(c, "totalWar")) {
          parts.push(h("Total War (complexity 3)") + ul([
            "When you destroy another player's units — or produce hits that destroy them — place commodities from the supply equal to their <b>combined cost</b> on a planet you control in your home system (infantry and fighters count <b>1 each</b>).",
            "Gain control of a home planet that holds commodities, and you move them to a planet you control in your own home system.",
            "New action for everyone: <b>discard 10 commodities</b> from planets in your home system to gain <b>1 victory point</b>."
          ]));
        }
        if (geHas(c, "ageOfCommerce")) {
          parts.push(h("Age of Commerce (complexity 1)") + ul([
            "Players <b>don't have to be neighbours</b> to transact.",
            "<b>No maximum commodities</b>: when you replenish, gain commodities equal to your commodity value.",
            "Non-faction technologies can be <b>shared in a transaction</b>: the receiver gains it from their own deck; the giver keeps it."
          ]));
        }
        if (geHas(c, "ageOfExploration")) {
          parts.push(h("Age of Exploration (complexity 2)") + ul([
            "Relics need only <b>2 matching fragments</b> instead of 3; the Naaz-Rokha's FABRICATION ability and BLACK MARKET FORGERY promissory note don't need matching fragments.",
            "New action for everyone: exhaust <b>Dark Energy Tap</b>, choose a non-home edge system containing your ships and roll 1 die — <b>1–4</b> draw a random unused red tile, <b>5–10</b> a random unused blue tile. Place it adjacent to that system so it touches at least 2 non-home systems; put a frontier token in it if it has no planets.",
            "Codex IV says this event requires Prophecy of Kings; Thunder's Edge (2025) later allows it without Prophecy of Kings by ignoring text about Prophecy of Kings components (TE p.16).",
            te(c) ? "New tiles can't be placed off the Ghosts of Creuss or Crimson Rebellion home systems, the Wormhole Nexus or any Fracture tiles (TE p.16)."
              : "New tiles can't be placed off the Ghosts of Creuss home system" + (pok(c) ? " or the Wormhole Nexus" : "") + " (a later clarification, TE p.16)."
          ]));
        }
        return parts.join("");
      },
      src: function (c) { return join("Codex IV pp.15–16", te(c) ? "TE pp.6, 10, 12, 16" : (geHas(c, "ageOfExploration") ? "TE p.16" : "")); } },

    { id: "preset-notes", title: "Galaxy preset: designer notes",
      when: function (c) { return !!activePreset(c); },
      html: function (c) {
        var P = activePreset(c);
        return p("<b>" + P.name + "</b> — " + P.players + "-player galaxy preset by " + P.author + " (" + presetBook(P) + " “The Nexus”, community content). Layout: see “Create the galaxy” in Setup.") + ul(P.notes) +
          (P.id === "threesCompany" ? p("<i>Codex II's contents page lists this map as “Three's a Crowd”; the map page itself is titled “Three's Company”.</i>") : "");
      },
      src: function (c) { var P = activePreset(c); return P ? presetBook(P) + " " + P.page + (P.id === "threesCompany" ? " · Codex II p.3" : "") : "Codex II"; } },

    { id: "ordinian-ref", title: "Ordinian scenario: the Coatl",
      when: function (c) { return ord(c); },
      html: function () {
        return p("Players fight for control of the disabled Argent Flight flagship <b>Coatl</b> (the custodians token) in the Ordinian nebula at the centre of the galaxy. As in a standard game, the game ends when a player gains their <b>10th victory point</b>. The standard custodians token rules are not used.") +
          ul([
            "<b>Control:</b> you <b>gain</b> control of the Coatl if you are the <b>only</b> player with ships in its system, and you keep it until you no longer have ships in its system.",
            "No player can use <b>space cannon</b> against ships in the Coatl's system.",
            "<b>Repair:</b> it starts damaged. At the start of your turn, if you control it, you may spend <b>6 resources</b> to repair it — flip it to its “1 Victory Point” side. Once repaired, the <b>agenda phase</b> is added to the game, and controlling the Coatl is worth <b>1 victory point</b>.",
            "<b>Moving:</b> the repaired Coatl counts as a ship with move 1 for the movement step only; its controller can move it like one of their ships. It never takes part in combat, can't retreat and can't be destroyed.",
            "Effects that refer to <b>Mecatol Rex</b> or its system refer to the Coatl's system instead.",
            "<b>Home system:</b> if the Coatl is in your home system it is worth <b>1 more</b> victory point to you, and you cast <b>6 extra votes</b> on each agenda."
          ]) + h("The Nekro Virus's assimilated technologies") + ul([
            "<b>???_EXCEPTION_NO_ID_???</b> (yellow, 1 yellow prerequisite) — other players can't move ships through systems containing your structures; each planet with your structures has PRODUCTION 1 as if it were a unit.",
            "<b>????_REDACTED_????</b> (Nekro destroyer upgrade, 2 red prerequisites) — when it uses anti-fighter barrage, each 9 or 10 also destroys 1 opposing infantry in the active system's space area. Anti-Fighter Barrage 6 (×3); cost 1, combat 7, move 2, capacity 1."
          ]);
      },
      src: function () { return "Codex I p.12"; } },

    { id: "liberation-ref", title: "Liberation of Ordinian: special rules and winning",
      when: function (c) { return lib(c); },
      html: function (c) {
        return p("The Nekro Virus has devoured Ordinian. The remnants of the Salient Sun joint task force — the <b>Federation of Sol</b> and the <b>Xxcha Kingdom</b> — hope to win the galactic rim's hearts and minds by liberating it, while opportunists circle. Six players, Prophecy of Kings required.") +
          h("Special rules") + ul([
            "Sol and Xxcha are <b>allied</b> using the Alliance game variant's rules, but they need different victory points (below).",
            "Both Sol and Xxcha must <b>agree</b> to use the <b>F.S.S. Orlando</b>.",
            "Effects that refer to <b>Mecatol Rex</b> or its system refer to <b>Ordinian</b> and its system.",
            "After the <b>first stage II objective</b> is revealed, flip <b>Liberate Ordinian</b> to its stage II side (<b>Control Ordinian</b>) and remove all tokens from it. Points scored from the stage I side are kept, but the stage I objective can no longer be scored.",
            "<i>Not covered by the scenario: when the agenda phase begins. No custodians token is placed, and the agenda phase is normally added only once a player removes that token from Mecatol Rex (LRR 8.1, 27.4, 81.8) — read literally, it would never start. Agree on it before you start.</i>"
          ]) + h("Winning — the game ends when either") + ul([
            "one of the Sol/Xxcha allies has <b>12</b> victory points and the other has <b>10</b>, or",
            "any other player has <b>10</b> victory points.",
            "<i>The scenario doesn't say which side of the victory point track to use. The 10-space side can't show 12 points, and the Alliance variant it borrows from plays on the 14-space side (Codex II p.13).</i>"
          ]) + h("Scenario cards") + ul([
            "<b>F.S.S. Orlando</b> (hero, “Apollo Protocol”) — unlocks when <b>the Nekro Virus has 5 victory points</b>; its ability is on the card's other side (not shown in the Codex).",
            "<b>Unknown</b> leaders (Ghosts of Creuss) — agent <b>Forlorn Shadow</b>: Action: exhaust and choose a player; they may swap the positions of 2 of their ships in any systems, transporting units as they swap. Commander <b>Wistful Soul</b> unlocks when you resolve a combat with another player; hero <b>Wayward Riftwalker</b> unlocks at 3 scored objectives (their abilities aren't shown in the Codex).",
            "<b>???_NULL_REFERENCE_???</b> (Nekro; yellow, 1 yellow prerequisite) — when one of your ships is destroyed, you may produce a ship of the same type at a space dock in your home system.",
            "<b>???_ERROR_ERROR_???</b> (Nekro; red, 1 red prerequisite) — three separate actions, each by exhausting it: place 1 PDS on a planet you control; repair all your damaged units; discard 1 action card to draw 1.",
            "<b>Ordinian</b> planet card (0 resources, 0 influence) and legendary ability <b>Barren Husk</b> — you may exhaust it when you pass to draw 1 action card and gain 1 command token.",
            "<b>Liberate Ordinian</b> objective — stage I side: win a combat against the Nekro Virus (action phase, 1 VP). The stage II side (Control Ordinian) isn't printed in the Codex.",
            "Relics <b>Circlet of the Void</b> (Naaz-Rokha) and <b>Neuraloop</b> (Nomad) — see “Codex IV: relics”."
          ]) + h("Alliance rules for Sol and Xxcha") +
          (te(c) ? p("<i>The scenario points to Codex II's alliance rules; Thunder's Edge later revised that variant (TE p.13), and the revised text is shown here.</i>") : "") +
          allianceRules(c, { noEnd: true }) + ul(["A player <b>can't be eliminated</b> while their ally controls a planet."]);
      },
      src: function (c) { return join("Codex IV pp.17–18", "Codex II p.13", "LRR pp.5, 10, 15, 31", te(c) ? "TE p.13" : ""); } }
  ];

  /* ----------------------------------------------------------------- TEACH */
  /* slot: "hook" = belongs with the opening hook/win condition (scenarios);
           "insert" = short insert for a selected set/option (teaching-script section 5);
           "later" = items for the "don't worry about these until they come up" list. */
  var teach = [
    { id: "codex-ordinian-hook", slot: "hook", h: "The scenario: Ordinian",
      when: function (c) { return ord(c); },
      body: function () {
        return p("Tonight is the Ordinian scenario. The Argent Flight's flagship, the <b>Coatl</b>, drifts crippled in the Ordinian nebula at the centre of the galaxy — there's no Mecatol Rex. Whoever is the only player with ships in its system controls it. Control it at the start of your turn and you can spend 6 resources to repair it; from then on it's worth a victory point to whoever holds it, it can move one system, and the agenda phase joins the game. Drag it into your own home system and it's worth another point and six extra votes.");
      } },
    { id: "codex-liberation-hook", slot: "hook", h: "The scenario: Liberation of Ordinian",
      when: function (c) { return lib(c); },
      body: function () {
        return p("This is the Liberation of Ordinian. The Nekro Virus has devoured Ordinian, the world at the centre of our galaxy, and holds it with a big fleet — there's no Mecatol Rex tonight, and anything that mentions Mecatol Rex means Ordinian. Sol and the Xxcha are allied as the Salient Sun task force: they win together when one of them reaches <b>12</b> points and the other <b>10</b>. Everyone else plays alone and wins at <b>10</b>.");
      } },
    { id: "codex-liberation", slot: "insert", h: "Liberation: how it plays",
      when: function (c) { return lib(c); },
      body: function () {
        return p("There's an extra stage I objective, <b>Liberate Ordinian</b>: win a combat against the Nekro Virus. When the first stage II objective comes out it flips to <b>Control Ordinian</b> — points already scored stay, but the first side is gone. Sol and Xxcha play by the alliance rules: they share space without fighting, can join each other's tactical actions, can roll together in combat and can't be eliminated while the partner holds a planet. They also share a hero, the <b>F.S.S. Orlando</b>, which unlocks when the Nekro reach 5 points — and both must agree to use it.") +
          p("The Creuss play with three mysterious <b>Unknown</b> leaders and must be red; the Nekro hold Ordinian with a big fleet, and their Valefar Assimilators are swapped for two strange assimilated technologies; the Naaz-Rokha hold the <b>Circlet of the Void</b>, which skips gravity-rift rolls, ignores other anomalies' movement effects and explores frontier tokens from afar; and the Nomad hold the <b>Neuraloop</b>, which lets them purge a relic to swap out a public objective as it's revealed.");
      } },
    { id: "codex-ordinian", slot: "insert", h: "Ordinian: the Coatl and the Nekro",
      when: function (c) { return ord(c); },
      body: function () {
        return p("A few Coatl details: nobody can fire space cannon at ships in its system, and it never fights, retreats or dies — it just changes hands. The Nekro Virus starts parked on it with the Alastor, two dreadnoughts and two fighters, and begins with two technologies assimilated from the Argent: one stops you moving ships through systems with Nekro structures and lets those planets produce, the other upgrades their destroyers to shred infantry during anti-fighter barrage.");
      } },
    { id: "codex1-cards", slot: "insert", h: "Twilight Codex I cards",
      when: function (c) { return has(c, "codex1"); },
      body: function (c) {
        if (tf(c)) return p("Codex I's cards — its Omega technologies and promissory notes and its twenty action cards — stay in the box in Twilight's Fall, along with every other standard technology, promissory note and action card.");
        return p(te(c)
          ? "We're using the Codex cards that come with Thunder's Edge — they carry the Codex icon. They replace a few faction technologies, Magen Defense Grid and X-89 Bacterial Weapon, and five promissory notes, and there are twenty extra action cards in the deck. If a card looks unfamiliar, that's why."
          : "We're mixing in Codex I. Cards marked <b>Ω</b> are Omega versions that replace the old ones: three faction technologies, Magen Defense Grid and X-89 Bacterial Weapon, and five promissory notes. There are also twenty new action cards in the deck. If you're unsure which wording applies, the Ω card is the one we use.");
      } },
    { id: "codex2-cards", slot: "insert", h: "Twilight Codex II cards",
      when: function (c) { return has(c, "codex2"); },
      body: function (c) {
        if (tf(c)) return p("From Codex II, only its three relics join us in Twilight's Fall: <b>JR-XS455-O</b>, an extra agent you can lend out to help someone build a structure; <b>Dynamis Core</b>, which raises your commodity value by 2; and <b>Nano-Forge</b>, which makes one of your non-home, non-legendary planets legendary and adds 2 resources and 2 influence.");
        /* TE p.4: Thunder's Edge's own reference-card sets replace the print-and-play ones; "Alliance" notes are PoK */
        var refs = te(c)
          ? "Thunder's Edge's faction reference cards stand in for Codex II's print-and-play ones — glance at them any time to see what everyone does" +
            (pok(c) ? " — and its alliance reference cards show what a borrowed commander does." : ".")
          : "Codex II " + (relicsOk(c) ? "also " : "") + "gives us faction reference cards — glance at them any time to see what everyone does" +
            (pok(c) ? " — and alliance reference cards, so whoever holds an “Alliance” note knows what the borrowed commander does." : ".");
        return p((relicsOk(c) ? "Codex II adds three relics: <b>JR-XS455-O</b>, an extra agent you can lend out to help someone build a structure; <b>Dynamis Core</b>, which raises your commodity value by 2; and <b>Nano-Forge</b>, which makes one of your non-home, non-legendary planets legendary and adds 2 resources and 2 influence. " : "") + refs);
      } },
    { id: "codex3-cards", slot: "insert", h: "Twilight Codex III cards",
      when: function (c) { return has(c, "codex3"); },
      body: function (c) {
        if (tf(c)) return p("Codex III's reworked leaders and mech sit this mode out, but its three secret objectives are in the deck — each is about destroying the last of a player's units in a particular combat step" + (pok(c) ? " — and its six frontier exploration cards can pay out relics, trade goods and command tokens." : "."));
        return p((pok(c) ? "Codex III reworks some leaders — the Xxcha hero, all three Yin leaders, and the Naalu agent and commander — plus the Naalu mech and three secret objectives about destroying the last of a player's units in a particular combat step. "
            : "From Codex III we use three reworked secret objectives about destroying the last of a player's units in a particular combat step — its reworked leaders and mech need Prophecy of Kings. ") +
          (pok(c) ? "The frontier exploration deck has six new cards, so exploring empty space can pay out relics, trade goods and command tokens. " : "") +
          (keleresOn(c) ? "" : "And there's a new faction available, the Council Keleres.")).replace(/\s+<\/p>$/, "</p>");
      } },
    { id: "codex4-cards", slot: "insert", h: "Twilight Codex IV cards",
      when: function (c) { return has(c, "codex4"); },
      body: function (c) {
        if (tf(c)) return p("Codex IV's galactic events aren't used in Twilight's Fall, but its three relics can turn up: <b>Circlet of the Void</b> skips gravity-rift rolls, ignores other anomalies' movement effects and explores frontier tokens from afar; the <b>Book of Latvinia</b> can be purged for a victory point if you control planets with all four technology specialties — otherwise you take the speaker token; and <b>Neuraloop</b> lets you purge one of your relics to swap out a public objective as it's revealed.");
        if (!relicsOk(c)) return p(geOn(c) ? "Codex IV's relics need a relic deck, which comes with Prophecy of Kings or Thunder's Edge, so tonight Codex IV brings only its galactic event — more on that in a moment."
          : "Codex IV's relics need a relic deck, which comes with Prophecy of Kings or Thunder's Edge, so they stay in the box tonight.");
        return p(lib(c) ? "The third Codex IV relic, the <b>Book of Latvinia</b>, can turn up in the relic deck: when you gain it, research up to two technologies with no prerequisites; later, purge it for a victory point if you control planets with all four technology specialties — otherwise you take the speaker token."
          : "Three new relics are in the relic deck: <b>Circlet of the Void</b> skips gravity-rift rolls, ignores other anomalies' movement effects and explores frontier tokens from afar; the <b>Book of Latvinia</b> lets you research up to two technologies with no prerequisites when you gain it, and later you can purge it for a victory point if you control planets with all four technology specialties — otherwise you take the speaker token; and <b>Neuraloop</b> lets you purge one of your relics to swap out a public objective as it's revealed — even for a secret one.");
      } },
    { id: "codex-keleres", slot: "insert", h: "The Council Keleres",
      when: function (c) { return keleresOn(c); },
      body: function (c) {
        return p("One of you is the <b>Council Keleres</b>, the Galactic Council's own agents. They borrowed the home system of a faction nobody is playing — " +
          (pok(c) ? "Mentak, Xxcha or Argent — and that choice also decided their hero." : "Mentak or Xxcha.") + " Every strategy phase they refill their commodities and take a trade good. At the start of their turn they can pay 1 influence to switch off every law until their turn ends. It costs you 2 influence to activate a system with their flagship" + (pok(c) ? ", and 1 influence per mech to land troops where their mechs are." : ".") + " They started with two technologies copied from the rest of us.");
      } },
    { id: "codex-alliance", slot: "insert", h: "Alliances",
      when: function (c) { return allianceOn(c); },
      body: function (c) {
        return p("Tonight we play in <b>teams of two</b>. Allies move through and into each other's systems without a fight, land ground forces " + (te(c) ? "on each other's planets" : "where the other already has ground forces") + " without fighting or taking the planet, and can jump into each other's tactical actions by spending their own tactic token. When you're both in a combat you can roll together, and you decide together who takes the hits. Commodities you give your ally stay commodities, and you can pass your ally's promissory notes on but never play them." +
          (pok(c) ? " Every commander starts <b>unlocked</b>." : "") +
          (te(c) ? " Your space cannon and other unit abilities never hit your ally, and agents can be used on your ally." : "") +
          " A player can't be eliminated while their partner holds a planet. To win, one of you needs <b>14</b> points and the other at least <b>10</b>.");
      } },
    { id: "codex-galactic-event", slot: "insert", h: "Galactic event",
      when: function (c) { return geOn(c) && !te(c); },
      body: function (c) {
        var g = geChoice(c), s = [];
        if (g === "any") s.push("We're playing with a <b>galactic event</b> — a card that bends the rules for the whole game. We drew it at the start of setup; I'll read it aloud now. Codex IV's four are:");
        if (geHas(c, "minorFactions")) s.push((g === "any" ? "<b>Minor Factions</b> — " : "Tonight's galactic event is <b>Minor Factions</b>. ") + "The second ring holds the home systems of factions nobody is playing, each guarded by three neutral infantry. " +
          (pok(c) ? "Take every planet in one and you take that faction's alliance card and its ability — and those planets count as cultural, industrial and hazardous at once."
            : "Their planets count as cultural, industrial and hazardous at once; without Prophecy of Kings we skip the part where conquering one earns its alliance card."));
        if (geHas(c, "totalWar")) s.push((g === "any" ? "<b>Total War</b> — " : "Tonight's galactic event is <b>Total War</b>. ") + "Destroy someone's units and you stack commodities equal to their cost — infantry and fighters count one each — on a planet in your home system. Capture a home planet and you take its stack. Anyone can use an action to cash in 10 of those commodities for a victory point.");
        if (geHas(c, "ageOfCommerce")) s.push((g === "any" ? "<b>Age of Commerce</b> — " : "Tonight's galactic event is <b>Age of Commerce</b>. ") + "You can trade with anyone, not just neighbours; there's no commodity cap — each refresh adds your commodity value; and you can share non-faction technologies in a deal: the other player gains it from their own deck and you keep yours.");
        if (geHas(c, "ageOfExploration")) s.push((g === "any" ? "<b>Age of Exploration</b> — " : "Tonight's galactic event is <b>Age of Exploration</b>. ") + "Relics take only two matching fragments. And anyone with Dark Energy Tap can exhaust it to roll and add a brand-new random tile off the edge next to a non-home edge system with their ships — red on 1 to 4, blue on 5 to 10." +
          (pok(c) ? "" : " Without Prophecy of Kings we skip whatever needs its components — the later Thunder's Edge ruling."));
        return s.map(p).join("");
      } },
    { id: "codex-rightcatsoup", slot: "insert", h: "The map: “Right Cat Soup”",
      when: function (c) { return rcsOn(c); },
      body: function () {
        return p("We're on <b>Right Cat Soup</b>, a community six-player map from Codex I, with named home positions: Northswain, Eternia, Animus, Gravitas Rex, Pyroclast and Empyrealis. The designer's tips: Empyrealis has two equidistant systems to leap for and lots of empty space; Animus sits by two green technology specialties; Gravitas Rex is rich but must fight early to hold its systems; and Eternia is a quiet corner with a wormhole.");
      } },
    { id: "codex-preset", slot: "insert", h: "The map: Codex II preset",
      when: function (c) { return !!codex2Preset(c); },
      body: function (c) {
        var P = codex2Preset(c);
        var line = {
          threesCompany: "It's much tighter than a normal three-player map and the hyperlanes add a lot of routes — each slice is the three systems beside your home plus the asteroid field to its right, and Mecatol, Mallice and Mirage decide the game.",
          chokepoint: "Mecatol Rex is tucked away behind a chokepoint, so ask yourselves whether you'll gang up on whoever sits there or fight over the legendary planets and Everra. Arma and Chrysus are four systems from Mecatol but share Hope's End and have better neighbours; Incrementum should keep its beta wormhole blocked.",
          raceForMecatol: "Mecatol Rex is at the top edge; hyperlanes make the special planets easy to take and easy to lose, the top asteroid field and supernova shelter but hem you in, and the wormholes tie it all together.",
          neighbor: "Every home system is in the second ring, so you're all close; anomalies between homes stop round-one knockouts, and wrap-around wormholes keep everyone knocking on each other's doors.",
          magisMadness: "Mecatol Rex isn't in the centre: every home has a three-tile and a four-tile path to it. Four of you are crammed on one half, and the other three fight over the two legendary planets.",
          junkYardDoggo: "It's deliberately mean and stacked — a map for experienced players who want to rebalance it through diplomacy and trades."
        }[P.id];
        return p("We're on the Codex II preset <b>" + P.name + "</b> for " + num(P.players) + " players. " + line + (P.id === "magisMadness" ? " The designer suggests snake-drafting factions and home positions, then picking the speaker at random." : ""));
      } },
    { id: "codex-later", slot: "later", h: "Don't worry about these until they come up",
      when: function (c) { return laterItems(c).length > 0; },
      body: function (c) { return ul(laterItems(c)); } }
  ];
  function laterItems(c) {
    return [
      (has(c, "codex1") || has(c, "codex3")) && !tf(c) ? (te(c) ? "Exact wording of the revised Codex cards (marked with the Codex icon) — read them when they're played; the Codex notes in this page's rules reference cover them." : "Exact wording of the Omega (Ω) cards — read them when they're played; the Codex notes in this page's rules reference have the clarifications.") : "",
      keleresOn(c) ? "The Keleres' <b>Custodia Vigilia</b> — a planet off the board that their I.I.H.Q. Modernization technology grants." : "",
      allianceOn(c) || lib(c) ? "Swapping planet cards with your ally when an effect lets you redistribute command tokens." : "",
      geHas(c, "ageOfExploration") ? "Exactly where a new Age of Exploration tile may go — it must touch at least two non-home systems." : "",
      geHas(c, "totalWar") ? "Moving Total War commodities when a home planet changes hands." : "",
      lib(c) ? "What the Orlando and the Unknown commander and hero do — we'll read them when they unlock." : "",
      ord(c) ? "How the repaired Coatl moves — one system, during the movement step only." : ""
    ].filter(Boolean);
  }

  /* ----------------------------------------------------------------- NOTES */
  var notes = [
    "PRECEDENCE & DATES: TE (2025; newer than Codex IV — TE p.4 says it includes all Codex gameplay content in revised form and TE p.16 names Codex IV's Minor Factions/Age of Exploration events; the TE rulebook's text layer prints no date, but TF prints © 2025) > Codex IV (© 2025) > Codex III (© 2022; the source file is FFG's v2.1, but the book prints no version, so the set name omits it — audit 2) > Codex II (© 2021) > LRR v2.0 (09/22/20) > Codex I (© 2020, published before PoK). LRR changelog dates used: v1.1 02/03/18, v1.2 06/12/19, v1.3 05/04/20, v2.0 09/22/20 (LRR pp.2–3).",
    "CODEX I RULES UPDATES (Codex I p.14): all five (Diplomacy primary, Hyper Metabolism, gravity rifts, retreating with ground forces, rerolls) are already in LRR v2.0 — 32.2 (p.16), errata v1.1 + Wiki Errata, 41.2/31.2 (pp.16, 19), 78.4/78.7/95.1 (pp.29–30, 36), 74.3/78.5e (pp.28, 30). No conflict with the core LRR text. One LATER change: TE p.16 limits a gravity rift's +1 move bonus to once per ship ('a change from previous rulings'), which conflicts with LRR 41.3 — the core gravity-rift reference should show the TE ruling; my codex-rules-updates section states it.",
    "OMEGA CARDS are not in the LRR or the Wiki Errata. Wiki FAQ [OFFICIAL] clarifications used: X-89 Ω vs Planetary Shield; War Funding Ω combat rolls only; Political Data Nexus Ω (one or the other, unlock timing, printed value); Brother Milor Ω (flagship choice; action-phase-only flagged as Sources disagree); Quantum Dissemination Ω (ground combats/Parley flagged as Sources disagree); Z'eu Ω; M'aban Ω; Turn Their Fleets to Dust scoring; Impersonation; Reflective Shielding; Counterstroke; Ghost Squad; Master Plan; Dynamis Core; Council Keleres (starting-tech order, Custodia Vigilia, Omniopiares, Agency Supply Network, Law's Order, Xander). No [UNOFFICIAL] answers used. (Core data.js repeats some of these as codex/te-gated rulings — fine, just don't add more copies.)",
    "THUNDER'S EDGE and the Codex: TE p.4 ships 74 revised 'Codex Cards' (20 action cards, 3 relics, 6 exploration cards, Keleres sheet/mech/5 leaders/PN/2 techs/Custodia Vigilia; replacing 3 faction techs, 8 Magen Defense Grid, 8 X-89, 3 secret objectives, 5 PNs, 1 mech, 6 leaders) and its own Faction/Alliance reference card sets (Codex print-and-play ones not used). My set steps just say 'use TE's printings' when c.has('te'); C's te-start step covers the physical swap. Visible TE wording change: Acquiescence drops 'or place' (TE p.5). TE's Keleres has a faction tech 'Executive Order' (TE p.16) absent from Codex III — my Keleres content warns that TE's sheet wins. The relic deck exists with PoK or TE (TE p.6 step 8), so relic lines check either.",
    "ALLIANCE VARIANT — SPLIT WITH C: the 'alliance' module (id kept; requires any-of [['codex2','te']]) is shared. My alliance-* steps, alliance-ref and 'Alliances' teach render Codex II's version and are gated !c.has('te'); with Thunder's Edge in play, C's te-alliance-* steps/reference/teach render TE p.13 (newest) — C gates them on c.has('te') && c.mod('alliance'). Liberation of Ordinian (mode, not the module) keeps its own inline alliance rules in my liberation-ref (TE p.13 wording when te).",
    "GALACTIC EVENTS — SPLIT WITH C: my 'galacticEvents' module (requires codex4) owns the Codex IV event texts. With te on, C's te-galactic-event step and te-events teach are the pick step/teach (TE p.6), so my ge-pick step and 'Galactic event' teach are gated !c.has('te'). My ge-minor-factions setup step (TE-aware: TE pp.7, 10, 16) and galactic-events-ref stay in both cases; ge-minor-factions is also gated off when C's 'te-map-subjugation' map is on (that map builds Minor Factions in). Choice ids (read by C too): 'ge-any' (default = all four shown), 'ge-minorFactions', 'ge-totalWar', 'ge-ageOfCommerce', 'ge-ageOfExploration'.",
    "COUNCIL KELERES: module 'keleres' requires any-of [['codex3','te']] (TE p.4 includes a revised Keleres). keleresOn() renders the Keleres steps/reference/teach with Codex III OR Thunder's Edge (audit 1: before, a TE-only table could switch the module on and get no Keleres content or teach). The TE rulebook doesn't print the Keleres sheet, so the texts are Codex III's and every Keleres step and the reference say TE's sheet wins when te is on; step tags use keleresExp() (codex3, else te). Without PoK: no leaders/mech (PoK p.10, TE p.4) and no Argent Flight (PoK p.7).",
    "CHOICES (matches core app.js): c.mod('galacticEvents') returns the selected choice id (above); c.mod('paxPresets') returns 'threesCompany' | 'chokepoint' | 'raceForMecatol' | 'neighbor' | 'magisMadness' | 'junkYardDoggo'. My code also accepts c.mod('<choice id>') === true, and falls back sensibly on plain true. Preset choices carry minPlayers = maxPlayers, so the app offers only the preset for the current player count (exactly one Codex II preset per count 3–8). 'rightCatSoup' (Codex I, 6p, base tiles only) is a separate module.",
    "GALAXY — ONE MAP SOURCE: both preset modules replace 'lrr-setup-6' (galaxyFrom becomes 'option') and exclude each other, the four TE maps (te-map-thunderdreaming, -subjugation, -redvsblue, -legendary) and the map-defining core builds gal-large, gal-alt, gal-premade, gal-ltp. They deliberately do NOT exclude gal-deal, gal-hyper5 or gal-hyper4: the app's normalize() turns off a module that excludes every available build (e.g. 5p + TE offers only hyper5/premade), and those plain 'build it' builds are exactly the step-6 content the preset replaces; C's te-board-hyperlanes already yields to my presets (its OTHER_MAPS). The scenario modes (ordinian, liberation) also replace step 6; core notes keyed only on c.galaxy (step 12's large-galaxy 14-point note) should also check c.galaxyFrom !== 'option'.",
    "TWILIGHT'S FALL (TF p.6 boxes standard action cards, technologies, promissory notes, leaders, standard mechs, galactic events): codex1–4-cards steps are gated c.mode !== 'twilightsfall'; in that mode a single codex-tf step says what's out and what still applies (Codex II/IV relics — TF boxes only Maw of Worlds, Prophet's Tears and The Quantumcore — and Codex III's secret objectives and frontier exploration cards). Codex I card reference hidden in TF; Codex II/III references trimmed to the TF-compatible parts; teach inserts have TF wording. All my modules and scenario modes are standard-only.",
    "PLAYER COUNTS: alliance is only valid at 4, 6 or 8 players (playerCounts:[4,6,8], read by the app; my when() also checks). Modes carry minPlayers/maxPlayers 6. Liberation states 'requires six players and PoK' (Codex IV p.17). Codex I's Ordinian scenario does NOT state a count — 6 is inferred from its fixed map with six home systems and six listed factions; its step says so.",
    "ANCHORS: presets and both scenarios use 'lrr-setup-6:replace' (they re-include the PoK wormhole-nexus instruction, LRR p.4); scenarios also replace the steps the books replace (Liberation 1, 2, 6, 7; Ordinian 2, 6, 7) and add after 3/4/11/12. Minor Factions setup is anchored after lrr-setup-5 because it happens during step 6 (deal 1 fewer blue tile; place minor factions before building). Codex component integration uses 'start'; the codex-tf step's exp is a function (first selected codex set). Alliance 'Choose Color' content (purge the “Alliance” note, ally's reference card, flip commander) sits after lrr-setup-4 in BOTH the variant and Liberation: the note is a colour promissory note and the leader sheet (leaders placed slot-icon side up) both arrive in step 4 (LRR p.4, PoK p.8). Codex IV lists it under its step 3, so lib-components points ahead to lib-color (audit 2).",
    "MAPS: every map (Codex I pp.12–13, Codex II pp.14–19, Codex IV p.18) was read from the PDF text-layer badge coordinates, converted to hex coordinates and verified by redrawing and comparing with the printed diagrams; the node harness re-checks every ring listing. Each preset/scenario step renders an inline SVG (currentColor; classes cx-map, cx-hex, cx-t/h/H/S/M; legend p.cx-map-legend) plus a <details class='cx-maptext'> exact ring listing. Hyperlane ROTATION cannot be conveyed in text — the steps say to turn them as drawn on the cited page. Set TI_CODEX.options.svgMaps = false to drop the SVGs (the text listing stays). Audit 2 re-derived every map independently from the PDF badge positions (all tiles, hyperlane A/B sides, home and Mecatol positions match) and made Mecatol Rex's tile number TE-aware: with Thunder's Edge it is TE's legendary tile 112, which replaces tile 18 (TE pp.4, 14) — mrTile(c).",
    "TEACH: ids codex-*; slot 'hook' (scenario hooks, placed after the core hook by the app), slot 'insert' (before 'later'), slot 'later' (its <li> items merge into the core 'don't worry' list). Coverage: every set (codex1–4, incl. TF wording), module (keleres, alliance and galacticEvents without te — C covers them with te —, rightCatSoup, paxPresets + each preset) and mode (ordinian, liberation) produces text when selected — verified by the harness.",
    "SCENARIO MODES vs CORE TEACH: in 'ordinian' and 'liberation' the core 'council' teach section (first to land on Mecatol Rex pays six influence to the custodians, then the agenda phase starts) doesn't fit. Ordinian: the Coatl replaces the custodians token and the agenda phase is added when the Coatl is repaired (my hook says so). Liberation: no custodians token is placed and the scenario never says when the agenda phase begins (LRR 8.1/27.4 tie it to removing that token) — my reference and teach flag it as a table decision. Suggest the core hides or adapts 'council' when TI.isScenario(c).",
    "SOURCE QUIRKS: Codex II's contents page calls the 3-player map 'Three's a Crowd' but the map page (p.14) says 'Three's Company' (used the latter). Codex II numbers the alliance 'Choose Color' step as 3; LRR/TE call it step 4 (anchored after lrr-setup-4). Liberation doesn't say which VP-track side to use, doesn't show the F.S.S. Orlando / Unknown commander and hero abilities or the Control Ordinian objective text, and (unlike Codex I) doesn't say the Nekro start with their swapped technologies in play — all stated as such. Codex III pp.10–12 and Codex IV pp.19–33 are Genesys RPG material and ads — skipped.",
    "LRR CURRENCY: TE p.16 tells players to consult 'the Living Rules Reference online'; the folder holds LRR v2.0 (09/22/20). A newer online LRR may exist but is not in the folder (C's te-lrr-note covers this).",
    "SEARCH (core rules.js): index all four Codex PDFs as Codex I–IV; Codex III pp.10–12 and Codex IV pp.19–33 are RPG/ads if you want cleaner hits."
  ];

  return {
    sets: sets,
    modes: modes,
    modules: modules,
    steps: steps,
    reference: reference,
    teach: teach,
    notes: notes,
    options: { svgMaps: true }
  };
})();
