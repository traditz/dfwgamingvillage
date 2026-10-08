/* =============================================================================
   Twilight Imperium 4th Edition — Setup & Reference Utility · module file
   THUNDER'S EDGE (TE) + the TWILIGHT'S FALL game mode (TF)
   Sources (printed page numbers — PDF page = printed page + 0; each cover is p.1):
     TE  = te_rulebook_web.pdf (16 pp)                 — Thunder's Edge rulebook, 2025
     TF  = te_twilights_fall_rulebook_web.pdf (12 pp)  — Twilight's Fall rulebook, 2025
     LRR = Living Rules Reference v2.0 (09/22/20)      — cited where TE changes or relies on it
     PoK = Prophecy of Kings rulebook · Codex II / Codex IV = Twilight Codex vol. II / IV
     Wiki FAQ = TI4 Wiki FAQ snapshot 2026-09-29 (predates TE — TE wins over it)
   Precedence: TE/TF (newest) > Codex IV > Codex III > Codex II > LRR v2.0 > PoK > RR > LtP.
   Contract: defines ONE global, TI_TE = {sets, modes, modules, steps, reference, teach, notes}.
   Context c: c.has(setId) · c.p (3–8) · c.mode · c.mod(id). Galaxy builds of the core file are
   read through c.mod("gal-<id>") (core data.js: "c.mod('gal-<id>') is true for it").
   ============================================================================= */
var TI_TE = (function () {
  "use strict";

  /* ---------------- helpers (private) ---------------- */
  var MAPS = ["te-map-thunderdreaming", "te-map-subjugation", "te-map-redvsblue", "te-map-legendary"];
  /* Galaxy presets of the other files, which a TE map or the TE hyperlane board must not stack with:
     core (agent A) galaxy builds "gal-<id>", Codex (agent B) preset modules. */
  var OTHER_MAPS = ["gal-premade", "gal-large", "gal-alt", "gal-ltp", "rightCatSoup", "paxPresets"];
  /* a TE map is the only map source while it is on: it excludes the other map-type builds (core premade / large /
     alternate / Learn to Play builds, Codex presets, the other TE maps). The plain builds (deal, hyper4, hyper5) are
     NOT excluded: the core app drops a module that excludes every available build, and while a TE map is on the
     remaining plain build is shown as superseded (galaxyFrom "option") — core step 6 is replaced by the map. */
  var MAP_EXCLUDES = ["gal-premade", "gal-large", "gal-alt", "gal-ltp", "rightCatSoup", "paxPresets"];
  var GE_NAMES = { minorFactions: "Minor Factions", totalWar: "Total War", ageOfCommerce: "Age of Commerce", ageOfExploration: "Age of Exploration" };
  var PREMADE_PAGE = { 3: 13, 4: 13, 5: 14, 6: 14, 7: 15, 8: 15 };   /* PoK premade maps, PoK pp.13–15 */

  function tf(c) { return c.mode === "twilightsfall"; }
  /* every non-Twilight's-Fall game that isn't the base-only Learn to Play first game */
  function std(c) { return c.mode !== "twilightsfall" && c.mode !== "firstgame"; }
  function teMap(c) { for (var i = 0; i < MAPS.length; i++) { if (c.mod(MAPS[i])) return MAPS[i]; } return null; }
  /* Alliance variant: the "alliance" module (Codex file). With Thunder's Edge in play, TE's version (TE p.13)
     is the one shown — this file carries it complete; the Codex file shows Codex II's only without TE. */
  function alliance(c) { return c.has("te") && !!c.mod("alliance") && [4, 6, 8].indexOf(c.p) !== -1; }
  /* Codex IV galactic events module (Codex file); c.mod("galacticEvents") returns the chosen event id */
  function geOn(c) { return !!c.mod("galacticEvents"); }
  /* the Codex file's choice ids are "ge-<key>" ("ge-any" = draw or choose at the table) */
  function geChosen(c) {
    var v = c.mod("galacticEvents");
    if (typeof v === "string") { var k = v.replace(/^ge-/, ""); if (GE_NAMES[k]) return k; }
    for (var key in GE_NAMES) { if (c.mod("ge-" + key) === true) return key; }
    return null;
  }
  /* one spoken line per Codex IV event for the teach (Codex IV pp.15–16; without PoK, TE p.16) — the
     Codex file's own event teach is off while Thunder's Edge is on, so this is the only place it is taught */
  function geTeach(g, c) {
    var pok = c.has("pok");
    if (g === "minorFactions") return "the second ring holds the home systems of factions nobody is playing, each guarded by three neutral infantry, and their planets count as cultural, industrial and hazardous at once" +
      (pok ? "; take every planet in one and you take that faction’s alliance card." : ".");
    if (g === "totalWar") return "destroy another player’s units and you stack commodities equal to their cost — infantry and fighters one each — on a planet in your home system, and anyone can use an action to discard 10 of them for a victory point.";
    if (g === "ageOfCommerce") return "you can trade with anyone, not just neighbours; there’s no commodity cap — each refresh adds your full commodity value; and you can share non-faction technologies in a deal.";
    if (g === "ageOfExploration") return pok ? "relics need only two matching fragments, and anyone can exhaust Dark Energy Tap to add a random new tile beside a non-home edge system that holds their ships — red on a roll of 1 to 4, blue on 5 to 10."
      : "we’re playing without Prophecy of Kings, so we ignore whatever it says about Prophecy of Kings components.";
    return "";
  }
  /* a galaxy build other than "deal / build it" or the PoK 5-player hyperlanes, or a Codex preset */
  function otherBuild(c) { for (var i = 0; i < OTHER_MAPS.length; i++) { if (c.mod(OTHER_MAPS[i])) return true; } return false; }
  /* TE p.7 / p.12: hyperlane layouts for five players, and for four players with PoK */
  function hyperTE(c) { return c.p === 5 || (c.p === 4 && c.has("pok")); }
  function uses(c) { return c.has("te"); }
  function veiled(c) { return c.mod("tf-veiledheart"); }
  function num(n) { return ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight"][n] || String(n); }
  function joinSrc(a) { var out = []; for (var i = 0; i < a.length; i++) { if (a[i] && out.indexOf(a[i]) === -1) out.push(a[i]); } return out.join(" · "); }
  /* cite({TE:[4,6,7], LRR:["4–6"], PoK:[9]}) → "TE p.4, p.6–7 · LRR p.4–6 · PoK p.9"
     numbers are merged, sorted and runs compressed; strings are kept as written */
  var BOOKS = ["TE", "TF", "LRR", "PoK", "Codex II", "Codex IV"];
  function cite(spec) {
    var out = [];
    for (var b = 0; b < BOOKS.length; b++) {
      var list = spec[BOOKS[b]];
      if (!list || !list.length) continue;
      var nums = [], strs = [], parts = [];
      for (var i = 0; i < list.length; i++) {
        if (typeof list[i] === "number") { if (nums.indexOf(list[i]) === -1) nums.push(list[i]); }
        else if (list[i] && strs.indexOf(list[i]) === -1) strs.push(list[i]);
      }
      nums.sort(function (x, y) { return x - y; });
      for (var j = 0; j < nums.length; j++) {
        var k = j;
        while (k + 1 < nums.length && nums[k + 1] === nums[k] + 1) k++;
        parts.push(k > j ? nums[j] + "–" + nums[k] : String(nums[j]));
        j = k;
      }
      parts = parts.concat(strs);
      out.push(BOOKS[b] + " " + parts.map(function (x) { return "p." + x; }).join(", "));
    }
    if (spec.extra) out = out.concat(spec.extra);
    return out.join(" · ");
  }

  /* ---------------- premade maps (TE map appendix, pp.14–15) ----------------
     Read from the map pages at 380 dpi. Rings are listed clockwise, each starting at the space
     straight above Mecatol Rex (the top of the printed page). "H:" = a named home-system space,
     "M" = a red minor-faction space.                                                           */
  var MAPDATA = {
    "te-map-thunderdreaming": {
      name: "“Thunder Dreaming”", page: "TE p.14", pageNo: 14, players: 6, pok: false,
      centre: "<b>112</b> (Mecatol Rex)",
      rings: [
        ["35", "30", "98", "34", "113", "101"],
        ["109", "47", "37", "44", "110", "49", "27", "48", "38", "46", "28", "43"],
        ["H:Integrated Hacanamy", "42", "100", "H:Get That Guac", "40", "105", "H:I’m the Garbozia Man", "39", "111", "H:Tech Is the Best", "114", "99", "H:Ghost Bat Honeymoon", "29", "115", "H:Always Vote for Ixthian", "26", "107"]
      ]
    },
    "te-map-subjugation": {
      name: "“Subjugation”", page: "TE p.14", pageNo: 14, players: 6, pok: true,
      centre: "<b>112</b> (Mecatol Rex)",
      rings: [
        ["111", "35", "115", "105", "99", "106"],
        ["116", "M", "39", "M", "40", "M", "109", "M", "101", "M", "79", "M"],
        ["H:Research Station Alpha", "107", "68", "H:Bio-Contaminant Zone", "97", "117", "H:Lost Trade Nexus", "110", "114", "H:Research Station Omega", "75", "100", "H:New Frontier", "113", "98", "H:Lazax Imperial Memorial", "37", "77"]
      ]
    },
    "te-map-redvsblue": {
      name: "“Red vs Blue”", page: "TE p.15", pageNo: 15, players: 4, pok: true,
      centre: "Mecatol Rex (the map prints tile <b>18</b>, the base-game tile; with Thunder’s Edge integrated you use its replacement Mecatol Rex tile — TE p.4)",
      rings: [
        ["85A", "99", "31", "121A", "68", "100"],
        ["110", "87A", "40", "24", "39", "124A", "116", "123A", "97", "102", "41", "88A"],
        ["86A", "84A", "75", "H:If I Only Had A [blue tech icon]", "62", "111", "H:Once Upon A War Sun", "115", "119A", "122A", "120A", "113", "H:The Cheeky Rift", "109", "46", "H:Roll For Initiative", "76", "83A"]
      ]
    },
    "te-map-legendary": {
      name: "“Legendary”", page: "TE p.15", pageNo: 15, players: 6, pok: true,
      centre: "<b>112</b> (Mecatol Rex)",
      rings: [
        ["98", "115", "100", "116", "99", "97"],
        ["37", "104", "36", "21", "69", "64", "47", "26", "110", "42", "39", "106"],
        ["40", "H:You’re An (Entropic) Star", "114", "102", "H:Industry Games", "46", "101", "H:A Nice Slice", "43", "103", "H:When Life Gives You Lemox", "60", "113", "H:Galaxy Crossing", "19", "108", "H:#1 Hot New Station", "117"]
      ]
    }
  };

  function ringText(r) {
    var out = [];
    for (var i = 0; i < r.length; i++) {
      var t = r[i];
      if (t === "M") out.push("<b>minor faction</b>");
      else if (t.indexOf("H:") === 0) out.push("<i>home “" + t.slice(2) + "”</i>");
      else if (/A$/.test(t)) out.push(t + " <i>(hyperlane)</i>");
      else out.push(t);
    }
    return out.join(" · ");
  }

  /* the layout of a TE premade map, as <li> items */
  function mapItems(id, c, isTF) {
    var m = MAPDATA[id];
    var s = "<li>Build <b>" + m.name + "</b> exactly as printed on <b>" + m.page + "</b> instead of dealing and placing system tiles. Each ring below reads <b>clockwise</b>, starting from the space straight above Mecatol Rex (the top of the page):<ul>" +
      "<li><b>Centre:</b> " + m.centre + "</li>" +
      "<li><b>Ring 1:</b> " + ringText(m.rings[0]) + "</li>" +
      "<li><b>Ring 2:</b> " + ringText(m.rings[1]) + "</li>" +
      "<li><b>Ring 3:</b> " + ringText(m.rings[2]) + "</li></ul></li>";
    s += "<li>Home systems go on the named green spaces" + (isTF ? " — in Twilight’s Fall they are claimed as described in draft step ② and placed in step ③" : "") + ".</li>";
    if (id === "te-map-thunderdreaming") {
      s += "<li>Balanced, <b>ideal for six novice players</b>, showcases many new Thunder’s Edge tiles, and does <b>not</b> need Prophecy of Kings.</li>";
    } else if (id === "te-map-subjugation") {
      s += "<li>An amped-up game of the <b>“Minor Factions” galactic event</b> (Prophecy of Kings required). The six factions nobody chose (from the twelve pictured on TE p.14) are set up <b>at random</b> in the six red <b>minor faction</b> spaces.<ul>" +
        "<li><b>Council Keleres</b> as a minor faction: choose one of its three possible home systems at random.</li>" +
        "<li><b>The Firmament / Obsidian</b>: randomly choose which side of its home system to use — this decides whether Minor Factions grants the Firmament or the Obsidian alliance card.</li>" +
        "<li><b>Crimson Rebellion</b> as a minor faction: <b>The Sorrow</b> goes in the minor faction space and its home system is placed near the game board (TE p.16 — the same rule covers the Ghosts of Creuss, who aren’t among this map’s twelve).</li></ul></li>" +
        "<li><b>Minor Factions event rules</b> (as printed in Codex IV; Thunder’s Edge’s own card is the current wording — follow it if it differs):<ul>" +
        "<li>Place <b>3 neutral infantry</b> on each minor faction system’s planets, split as evenly as possible (Thunder’s Edge’s plastic neutral units; neutral infantry have combat 8).</li>" +
        "<li>Minor faction systems <b>don’t count as home systems</b>, and their planets have <b>all three traits</b> — cultural, industrial and hazardous.</li>" +
        "<li>When a player controls <b>every planet</b> in a minor faction system, they take that faction’s <b>alliance card</b> — from the deck or from whoever had it — place it in their play area and can use its ability.</li></ul></li>";
    } else if (id === "te-map-redvsblue") {
      s += "<li><b>Teams:</b> the <b>west</b> seats (“Roll For Initiative”, upper left, and “The Cheeky Rift”, lower left) against the <b>east</b> seats (“If I Only Had A [blue tech icon]”, upper right, and “Once Upon A War Sun”, lower right). The book calls it a <b>2v2 alliance mode deathmatch</b> — the team rules are the Alliance game variant (TE p.13)" + (alliance(c) ? "" : "; turn on <b>“Alliance game variant”</b> under Options to add its rules") + ".</li>" +
        "<li>Both hyperlane rings (83A–88A above Mecatol Rex, 119A–124A below it) must be <b>oriented exactly as pictured</b>. Each team has only <b>two kinds of technology specialties</b> nearby.</li>";
    } else if (id === "te-map-legendary") {
      s += "<li>An <b>off-balance six-player arena</b> that drives everyone to the centre: the systems equidistant from the home systems — all <b>legendary</b> — form ring 1. (The named home spaces each sit one space clockwise from the usual ring-3 corners.)</li>";
    }
    if (c.has("pok")) s += "<li><b>Wormhole nexus:</b> place it beside the board, gamma-only side faceup, with the 3 gamma wormhole tokens next to it.</li>";
    s += "<li><b>Set aside The Fracture</b>’s three tiles — they may come into play during the game.</li>";
    return s;
  }

  /* TE hyperlane rings (TE p.7), as an <li> */
  function hyperItem(c) {
    if (c.p === 5) {
      return "<li><b>Hyperlanes first:</b> place hyperlane tiles <b>119A–124A</b> as a ring of six around the ring-2 system directly <b>below</b> Mecatol Rex, oriented exactly as in the “Game Board Setup” diagram on TE p.7. The ring fills the ring-1 space below Mecatol Rex, two ring-2 spaces and three ring-3 spaces (including the bottom corner); the five home systems go at the other ring-3 corners.<ul>" +
        "<li>TE’s “Red vs Blue” map (p.15) shows this ring with its numbers: <b>121A</b> next to Mecatol Rex, <b>123A</b> upper left, <b>124A</b> upper right, <b>120A</b> lower left, <b>119A</b> lower right, <b>122A</b> at the bottom.</li>" +
        "<li>This is the same layout as the Prophecy of Kings five-player hyperlane board, built with Thunder’s Edge’s own tiles — PoK isn’t needed.</li></ul></li>";
    }
    return "<li><b>Hyperlanes first:</b> two mirror-image rings of six hyperlane spaces — one around the ring-2 system directly <b>above</b> Mecatol Rex and one around the ring-2 system directly <b>below</b> it — oriented exactly as in the “Game Board Setup” diagram on TE p.7. The four home systems go at the remaining ring-3 corners (upper left, upper right, lower left, lower right).<ul>" +
      "<li><b>Lower ring:</b> tiles <b>119A–124A</b> (TE p.7) — as numbered on TE’s “Red vs Blue” map: 121A next to Mecatol Rex, 123A upper left, 124A upper right, 120A lower left, 119A lower right, 122A at the bottom.</li>" +
      "<li><b>Upper ring:</b> TE p.7 names only 119A–124A, but this setup needs twelve hyperlane spaces and requires Prophecy of Kings. TE’s own four-player map “Red vs Blue” (p.15) builds the upper ring from PoK’s <b>83A–88A</b>: 85A next to Mecatol Rex, 88A lower left, 87A lower right, 83A upper left, 84A upper right, 86A at the top — Prophecy of Kings’ own hyperlane formation (PoK p.9) turned upside down.</li></ul></li>";
  }

  /* the standard galaxy build with Thunder's Edge rules, as <li> items (LRR p.4–5 + TE p.6–7) */
  function boardItems(c, isTF) {
    var pok = c.has("pok"), p = c.p, s = "";
    var deal = p === 3 ? "6 blue and 2 red" : p === 4 ? (hyperTE(c) ? "3 blue and 2 red" : "5 blue and 3 red") : p === 5 ? "3 blue and 2 red" : p === 6 ? "3 blue and 2 red" : "4 blue and 2 red";
    s += "<li>Place <b>Mecatol Rex</b> in the centre — Thunder’s Edge’s Mecatol Rex tile, the one with the <b>legendary planet icon</b>. The galaxy has " + (p >= 7 ? "<b>four</b>" : "<b>three</b>") + " rings around it" + (hyperTE(c) ? "" : "; home systems sit at set positions in the outer ring (LRR p.6 diagram)") + ".</li>";
    if (hyperTE(c)) s += hyperItem(c);
    else if (p === 7 && pok) s += "<li><b>Hyperlanes:</b> place tiles <b>83A–88A</b> exactly as in the seven-player diagram (LRR p.6).</li>";
    if (pok) s += "<li><b>Wormhole nexus:</b> beside the board, gamma-only side faceup, with the 3 gamma wormhole tokens next to it.</li>";
    s += "<li><b>Separate</b> the system tiles into a <b>blue-backed</b> and a <b>red-backed</b> pile (green-backed tiles are home systems). Thunder’s Edge’s new tiles are part of these piles.</li>";
    s += "<li><b>Deal</b> each player <b>" + deal + "</b> tiles facedown.</li>";
    if (p === 7 && pok) s += "<li>Before placing, the speaker draws <b>2 red and 3 blue</b> unused tiles and places them faceup adjacent to Mecatol Rex.</li>";
    if (p === 8 && pok) s += "<li>Before placing, the speaker draws <b>2 red and 2 blue</b> unused tiles and places them faceup adjacent to Mecatol Rex.</li>";
    s += "<li><b>Place — snake order:</b> " + (isTF ? "leave every seat’s home-system position <b>empty</b> (home systems are chosen afterwards); " : "first put the home systems roughly where they will connect; ") +
      "starting with the speaker and going clockwise, each player places 1 tile faceup in ring 1; the last player places a second tile and the order reverses back to the speaker, who places two; repeat until every dealt tile is placed.<ul>" +
      "<li>Fill each ring completely before starting the next.</li>" +
      "<li>No two <b>anomalies</b> side by side (Thunder’s Edge’s <b>entropic scars</b> are anomalies too), and no two systems with the <b>same wormhole type</b>, unless there is no other option.</li>" +
      (isTF ? "" : "<li>Then attach the home systems to the galaxy.</li>") + "</ul></li>";
    if (hyperTE(c) && p === 5) s += "<li>With hyperlanes, the five-player <b>bonus trade goods</b> for starting positions are <b>not given</b>.</li>";
    s += "<li><b>Set aside The Fracture</b>’s three tiles — they may come into play during the game.</li>";
    return s;
  }

  /* Twilight's Fall draft ③ when a core galaxy option other than "build it" was chosen (the core step 6
     that would show it is replaced in this mode), as <li> items — PoK p.12–15, LRR p.4–6 */
  function otherBuildItems(c) {
    var p = c.p, s = "", pok = c.has("pok");
    if (c.mod("gal-premade")) {
      s += "<li>Lay out the <b>" + p + "-player premade map on PoK p." + (PREMADE_PAGE[p] || 13) + "</b> instead of dealing tiles: every system tile by the number printed on it, any hyperlane tiles exactly as printed, and Thunder’s Edge’s Mecatol Rex tile in the centre. Leave the green home-system spaces empty for now — they are claimed as in draft step ②.</li>";
    } else if (c.mod("gal-large")) {
      s += "<li>Build the <b>large galaxy</b>: four rings around Mecatol Rex (Thunder’s Edge’s tile); each player is dealt <b>6 blue and 3 red</b> tiles; place them in snake order as normal, filling each ring before the next, and leave the home-system positions empty for now. The 14-point victory track is recommended.</li>";
    } else if (c.mod("gal-alt")) {
      s += "<li>Use the <b>alternate hyperlane</b> layout for " + num(p) + " players: place hyperlane tiles <b>" + (p === 7 ? "83B, 84B, 85B, 86B, 88B and 90B" : "83B, 85B, 87A, 88A, 89B and 90B") + "</b> exactly as in its diagram; each player is dealt <b>3 blue and 2 red</b> tiles. The rings follow the diagram’s non-standard shape — fill each completely before the next — and leave the home-system positions empty for now.</li>";
    } else {
      s += "<li>Build the galaxy layout you chose, following its diagram, and leave the home-system positions empty for now.</li>";
    }
    if (pok) s += "<li><b>Wormhole nexus:</b> beside the board, gamma-only side faceup, with the 3 gamma wormhole tokens next to it.</li>";
    s += "<li><b>Set aside The Fracture</b>’s three tiles — they may come into play during the game.</li>";
    return s;
  }
  function otherBuildSrc(c) {
    if (c.mod("gal-premade")) return cite({ PoK: [12, PREMADE_PAGE[c.p] || 13], LRR: [4], TE: [4, 6] });
    if (c.mod("gal-large")) return cite({ PoK: [12], LRR: ["4–5"], TE: [4, 6] });
    if (c.mod("gal-alt")) return cite({ PoK: [12], LRR: ["4–6"], TE: [4, 6] });
    return cite({ LRR: ["4–6"], TE: [6] });
  }

  /* page lists for the galaxy build: {TE:[...], LRR:[...], PoK:[...]} */
  function boardPages(c) {
    var s = { TE: [4, 6], LRR: ["4–6"], PoK: [] };
    if (hyperTE(c)) { s.TE.push(7, 12, 15); s.PoK.push(9); }   /* the text compares both layouts with PoK's hyperlane formation/board (PoK p.9) */
    if (c.p >= 7 && c.has("pok")) s.PoK.push(9);   /* 7–8 players: hyperlanes 83A–88A and the speaker's extra tiles, PoK p.9 */
    return s;
  }
  function boardSrc(c) { return cite(boardPages(c)); }

  /* ---------------- sets / modes / modules ---------------- */
  var sets = [
    { id: "te", name: "Thunder’s Edge", short: "Thunder’s Edge", year: "2025",
      blurb: "The second expansion: the Thunder’s Edge expedition and faction breakthroughs, The Fracture, six new factions (including the Council Keleres), space stations, entropic scars, neutral units, galactic events, the revised Codex cards — and the Twilight’s Fall game mode." }
  ];

  var modes = [
    { id: "twilightsfall", name: "Twilight’s Fall",
      blurb: "Thunder’s Edge’s game mode for advanced players: everyone is a Mahact King from a dark future. Faction cards only set your seat, home system and starting units; you splice together abilities, unit upgrades and genomes as you play. Eight new strategy cards, edicts instead of agendas, no technology deck.",
      requires: ["te"], src: "TF p.6–8, p.10" }
  ];

  var mapExcl = function (id) {
    var e = MAP_EXCLUDES.slice();
    for (var i = 0; i < MAPS.length; i++) { if (MAPS[i] !== id) e.push(MAPS[i]); }
    return e;
  };

  var modules = [
    { id: "tf-veiledheart", name: "Veiled Heart variant",
      summary: "Everything you splice stays facedown and secret until you reveal it",
      description: "An optional Twilight’s Fall variant for advanced players. All spliced cards and paradigms are gained facedown as secret information; cards drawn for splices (including the inaugural splice) are not revealed when drawn — they are passed along facedown. A facedown card’s effect is not active — its owner may reveal it at any time, even to interrupt another effect.",
      requires: ["te"], modes: ["twilightsfall"], excludes: [], minPlayers: 3, maxPlayers: 8, src: "TF p.11" },
    { id: "te-map-thunderdreaming", name: "Map: “Thunder Dreaming”",
      summary: "Balanced premade map for six novice players — no Prophecy of Kings needed",
      description: "From the Thunder’s Edge map appendix: a balanced six-player galaxy that showcases many new Thunder’s Edge tiles and does not require Prophecy of Kings. Setup shows its tile-by-tile layout.",
      requires: ["te"], modes: ["standard", "twilightsfall"], excludes: mapExcl("te-map-thunderdreaming"), minPlayers: 6, maxPlayers: 6, src: "TE p.14" },
    { id: "te-map-subjugation", name: "Map: “Subjugation”",
      summary: "Six players fight over the home systems of six minor factions (Minor Factions galactic event)",
      description: "From the Thunder’s Edge map appendix: an amped-up game of the “Minor Factions” galactic event, whose setup is built into this map (no separate Minor Factions option needed). Each player chooses from twelve pictured factions; the six unchosen factions’ home systems fill the six red minor-faction spaces at random. Requires Prophecy of Kings. Galactic events aren’t used in Twilight’s Fall, so this map is standard-game only.",
      requires: ["te", "pok"], modes: ["standard"], excludes: mapExcl("te-map-subjugation"), minPlayers: 6, maxPlayers: 6, src: "TE p.14 · TF p.6" },
    { id: "te-map-redvsblue", name: "Map: “Red vs Blue”",
      summary: "A 2v2 alliance deathmatch — west team against east team",
      description: "From the Thunder’s Edge map appendix: four players in two alliances, the two western seats against the two eastern seats, on a board with two hyperlane rings. Each team has only two kinds of technology specialties nearby. Requires Prophecy of Kings; choosing it switches on the Alliance game variant. Standard game only: the book designs it for the Alliance variant, whose rules are written for the standard setup (Twilight’s Fall has none).",
      requires: ["te", "pok"], modes: ["standard"], excludes: mapExcl("te-map-redvsblue"), forces: ["alliance"], minPlayers: 4, maxPlayers: 4, src: "TE p.13, p.15" },
    { id: "te-map-legendary", name: "Map: “Legendary”",
      summary: "Off-balance six-player arena: the ring around Mecatol Rex is all legendary systems",
      description: "From the Thunder’s Edge map appendix: an off-balance six-player arena that drives players toward the galactic centre — the systems equidistant from the home systems, all legendary, form the ring around Mecatol Rex. Requires Prophecy of Kings.",
      requires: ["te", "pok"], modes: ["standard", "twilightsfall"], excludes: mapExcl("te-map-legendary"), minPlayers: 6, maxPlayers: 6, src: "TE p.15" }
  ];

  /* ---------------- setup steps ---------------- */
  var steps = [
    /* ===== Thunder's Edge, standard game ===== */
    { id: "te-start", after: "start", exp: "te",
      when: function (c) { return uses(c) && std(c); },
      t: "Thunder’s Edge in the box — check before you set up",
      d: function (c) {
        var pok = c.has("pok");
        return "<ul>" +
          "<li><b>Strategy cards:</b> use Thunder’s Edge’s revised <b>Construction</b> and <b>Warfare</b> cards instead of the older ones.</li>" +
          "<li><b>Mecatol Rex:</b> use the Mecatol Rex system tile that has a <b>legendary planet icon</b>.</li>" +
          "<li><b>Codex content:</b> Thunder’s Edge includes the Twilight Codex gameplay content as revised cards (marked with the Codex icon). If you own an earlier Codex, replace all of its components with these; use Thunder’s Edge’s own <b>Alliance</b> and <b>Faction Reference</b> card sets, not the print-and-play ones. First time? The full add/replace list is in the reference (“Thunder’s Edge — what’s new”).</li>" +
          (pok ? "<li><b>Jol-Nar:</b> replace the “Ta Zern” leader with “Agnlan Oln”.</li>"
               : "<li><b>No Prophecy of Kings?</b> Remove all <b>leaders</b>, <b>mechs</b> and <b>exploration cards</b>, and the <b>“Cultural Exchange Program”</b> galactic event.</li>") +
          "<li>Combine Thunder’s Edge’s other new cards with their decks. Its system tiles are numbered <b>92–128</b>; shuffle its new red-backed and blue-backed tiles into their piles. Twilight’s Fall components aren’t used in a normal game.</li>" +
          "</ul>";
      },
      src: function () { return "TE p.4"; } },

    { id: "te-galactic-event", after: "lrr-setup-1", exp: "te",
      when: function (c) { return uses(c) && c.mode === "standard"; },   // events are standard-game only here: the Codex IV module is too, and the scenarios use fixed maps (Codex I p.12, Codex IV pp.15, 18)
      t: "Galactic event (optional)",
      d: function (c) {
        var g = geChosen(c);
        return "<ul>" +
          "<li>After the speaker is determined, the group may <b>choose</b> a galactic event card or <b>draw one at random</b> and put it into play" +
          (g ? " — you chose <b>" + GE_NAMES[g] + "</b> (its rules are under “Galactic events (Codex IV)”)" : (geOn(c) ? " — the Codex IV events are summarised under “Galactic events (Codex IV)”" : "")) + ".</li>" +
          "<li>Some galactic events further modify setup — read the card before you continue." + (c.mod("te-map-subjugation") ? " “Subjugation” is played with the <b>Minor Factions</b> event — put it into play; the map builds its setup (see “Create the game board”)." : (g === "minorFactions" ? " Minor Factions changes the galaxy build (see its step before the galaxy is created)." : "")) + "</li>" +
          "<li>Advanced groups may play with <b>more than one</b> galactic event.</li>" +
          (c.has("pok") ? "" : "<li><b>Without Prophecy of Kings:</b> “Cultural Exchange Program” is removed; “Wild, Wild Galaxy” and “Age of Exploration” can still be played — ignore their text about PoK components.</li>") +
          "</ul>";
      },
      src: function (c) { return cite({ TE: [6].concat(c.has("pok") ? [] : [4, 16]).concat(c.mod("te-map-subjugation") ? [14] : []), "Codex IV": geOn(c) ? ["15–16"] : [] }); } },

    { id: "te-alliance-allies", after: "lrr-setup-2", exp: "te",
      when: function (c) { return uses(c) && std(c) && alliance(c); },
      t: "Alliance variant — assign allies (Thunder’s Edge rules)",
      d: function (c) {
        return "<ul>" +
          "<li>Assign every player an <b>ally</b>: decide which pairs of players are allies (teams of two)." +
          (c.mod("te-map-redvsblue") ? " On “Red vs Blue” the teams are the two <b>western</b> seats (“Roll For Initiative”, “The Cheeky Rift”) against the two <b>eastern</b> seats — seat each pair on its side of the map." : "") + "</li>" +
          "<li>Each player takes the <b>Alliance reference card</b> matching their ally and places it in their play area.</li>" +
          "<li><b>Mahact Gene-Sorcerers:</b> their ally also places a command token from their reinforcements into the Mahact’s <b>fleet pool</b>.</li>" +
          "</ul>";
      },
      src: function (c) { return c.mod("te-map-redvsblue") ? "TE p.13, p.15" : "TE p.13"; } },

    { id: "te-subjugation-factions", after: "lrr-setup-2", exp: "te",
      when: function (c) { return uses(c) && c.mode === "standard" && c.mod("te-map-subjugation"); },
      t: "“Subjugation” — choose from twelve factions",
      d: function () {
        return "<ul>" +
          "<li>Each player chooses their faction from the <b>twelve factions pictured on TE p.14</b>. The book shows them only as faction symbols; matched against the symbols printed beside faction names elsewhere in the rulebooks, they are, in the book’s order:<ul>" +
          "<li><b>Top row:</b> The Arborec · The Barony of Letnev · The Sardakk N’orr · The Nekro Virus · The Nomad · The Titans of Ul</li>" +
          "<li><b>Bottom row:</b> The Crimson Rebellion · The Deepwrought Scholarate · The Firmament/Obsidian · Last Bastion · The Ral Nel Consortium · The Council Keleres</li>" +
          "<li><i>Identified from the symbols — check the picture on TE p.14 if in doubt. The Firmament/Obsidian is the one symbol not printed beside its name elsewhere (identified by elimination; TE p.14 names it and the Keleres as possible minor factions).</i></li></ul></li>" +
          "<li>The six factions nobody chooses become the <b>minor factions</b> — their home systems are set up at random in the map’s red spaces (see “Create the game board”).</li>" +
          "</ul>";
      },
      src: function () { return "TE p.14 · symbols matched on TE p.5–6, PoK p.7, LtP p.6, Codex I p.12, Codex III p.17, Codex IV p.17"; } },

    { id: "te-faction-components", after: "lrr-setup-3", exp: "te",
      when: function (c) { return uses(c) && std(c); },
      t: "Breakthroughs & extra faction components",
      d: function () {
        return "<ul>" +
          "<li>Each player also takes their faction’s <b>breakthrough</b> card.</li>" +
          "<li>These factions take extra components:<ul>" +
          "<li><b>Embers of Muaat:</b> 1 Avernus token</li>" +
          "<li><b>Nekro Virus:</b> 7 Assimilator Z tokens, 3 Helios tokens, 3 Helios cards</li>" +
          "<li><b>Empyrean:</b> 2 Void Tether tokens</li>" +
          "<li><b>Crimson Rebellion:</b> 1 Sever token, 7 Breach tokens</li>" +
          "<li><b>Deepwrought Scholarate:</b> 5 Ocean cards</li>" +
          "<li><b>The Firmament:</b> 5 Plot cards and all Obsidian components</li>" +
          "<li><b>Last Bastion:</b> its Galvanize tokens — all of them (the setup text on p.6 says 8, the component list on p.5 counts 7), 3 Helios tokens, 3 Helios cards</li></ul></li>" +
          "<li><b>Firmament Plot cards</b> may be looked at by everyone before the game begins; once it starts they are hidden information.</li>" +
          "</ul>";
      },
      src: function () { return "TE p.5–6, p.16"; } },

    { id: "te-color-tokens", after: "lrr-setup-4", exp: "te",
      when: function (c) { return uses(c) && std(c); },
      t: "Option: colour-based tokens",
      d: function () {
        return "<ul><li>Any player may use the <b>colour-based command and control tokens</b> from Twilight’s Fall instead of their faction-specific tokens — clearer on the board for novice players.</li></ul>";
      },
      src: function () { return "TE p.6"; } },

    { id: "te-alliance-commanders", after: "lrr-setup-4", exp: "te",
      when: function (c) { return uses(c) && std(c) && alliance(c) && c.has("pok"); },
      t: "Alliance variant — unlock commanders",
      d: function () {
        return "<ul><li>Each player <b>purges</b> their “Alliance” promissory note and flips their <b>commander</b> to its unlocked side — all commanders are unlocked at the start of the game.</li></ul>";
      },
      src: function () { return "TE p.13"; } },

    /* placed BEFORE "Create the game board" (anchor lrr-setup-5): that step places the hyperlanes first, and at
       four players it can only say "as in the TE diagram" — the table needs the tile numbers before it builds */
    { id: "te-hyperlane-tiles", after: "lrr-setup-5", exp: "te",
      when: function (c) { return uses(c) && c.mode === "standard" && hyperTE(c) && !teMap(c) && !otherBuild(c); },
      t: "Before you build: which hyperlane tiles go where (Thunder’s Edge)",
      d: function (c) {
        return "<ul><li>" + (c.p === 5
            ? "With Thunder’s Edge, five-player games <b>always use hyperlanes</b> — the five-player setup without them (4 blue and 2 red tiles each, and bonus trade goods for some seats) isn’t used."
            : "With Thunder’s Edge and Prophecy of Kings, four-player games <b>always use this hyperlane board</b> — it replaces the Living Rules Reference’s four-player setup (5 blue and 3 red tiles each).") +
          " In the next step, place these tiles first, before any system tiles:</li>" +
          hyperItem(c) +
          "<li>Mecatol Rex is Thunder’s Edge’s tile with the legendary planet icon; <b>entropic scars</b> count as anomalies when you place tiles.</li></ul>";
      },
      src: function (c) { return cite({ TE: [4, 7, 11, 12, 15], PoK: [9], LRR: c.p === 5 ? ["4–5"] : [4] }); } },

    { id: "te-board-map", after: "lrr-setup-6:replace", exp: "te",
      when: function (c) { return uses(c) && c.mode === "standard" && !!teMap(c); },
      t: "Create the game board — Thunder’s Edge premade map",
      d: function (c) {
        var id = teMap(c);
        return id ? "<ul>" + mapItems(id, c, false) + "</ul>" : "<ul><li>Choose a premade map.</li></ul>";
      },
      src: function (c) {
        var id = teMap(c), te = [6];
        if (id) te.push(MAPDATA[id].pageNo); else te.push(14, 15);
        if (id === "te-map-subjugation") te.push(10, 12, 16);
        if (id === "te-map-redvsblue") te.push(4, 13);
        return cite({ TE: te, LRR: c.has("pok") ? [4] : [], "Codex IV": id === "te-map-subjugation" ? [15] : [] });
      } },

    { id: "te-fracture-aside", after: "lrr-setup-6", exp: "te",
      when: function (c) { return uses(c) && std(c) && !(c.mode === "standard" && !!teMap(c)); },
      t: "Set aside The Fracture",
      d: function () {
        return "<ul><li>After the galaxy has been created, set aside the <b>three tiles that make up The Fracture</b> — they may come into play during the game.</li></ul>";
      },
      src: function () { return "TE p.6"; } },

    { id: "te-token", after: "lrr-setup-7", exp: "te",
      when: function (c) { return uses(c) && std(c); },
      t: "Thunder’s Edge token",
      d: function (c) {
        return "<ul><li>Place the <b>Thunder’s Edge token</b> in the common play area, <b>expedition side</b> (six slices) faceup. It is in play but off the board.</li>" +
          (c.has("pok") ? "<li><b>Frontier tokens:</b> a system that contains a <b>space station and no planets</b> also gets a frontier token.</li>" : "") + "</ul>";
      },
      src: function (c) { return c.has("pok") ? "TE p.6, p.8, p.16" : "TE p.6, p.8"; } },

    { id: "te-relics", after: "lrr-setup-8", exp: "te",
      when: function (c) { return uses(c) && std(c) && !c.has("pok"); },
      t: "Relic deck",
      d: function () {
        return "<ul><li>Shuffle the <b>relic deck</b> and place it in the common play area — Thunder’s Edge uses relics even without Prophecy of Kings (for example, gaining a planet card with a relic icon draws a relic).</li></ul>";
      },
      src: function () { return "TE p.6, p.10"; } },

    { id: "te-alliance-track", after: "lrr-setup-12", exp: "te",
      when: function (c) { return uses(c) && std(c) && alliance(c); },
      t: "Alliance variant — the 14-point track",
      d: function () {
        return "<ul><li>Use the <b>14</b> side of the victory point track. An alliance wins when <b>one ally has 14 victory points</b> and <b>the other has at least 10</b>.</li></ul>";
      },
      src: function () { return "TE p.13"; } },

    /* ===== Twilight's Fall ===== */
    { id: "tf-components", after: "start", exp: "twilightsfall",
      when: function (c) { return uses(c) && tf(c); },
      t: "Twilight’s Fall — components in and out",
      d: function (c) {
        return "<ul>" +
          "<li><b>Use:</b> 8 Mahact King faction sheets · 8 Twilight’s Fall strategy cards · 87 ability, 31 unit upgrade, 31 genome and 31 paradigm cards · 50 Twilight’s Fall action cards · 10 edicts · 16 King faction technologies · 2 Echo cards · 128 colour-based command tokens and 136 control tokens · the benediction token · 3 Singularity tokens (X, Y, Z) · the faction reference cards (for the starting draft).</li>" +
          "<li><b>Return to the box:</b> standard strategy cards, standard action cards, agendas, technologies, promissory notes, standard faction sheets, leaders, standard mechs, faction command and control tokens, breakthroughs, galactic events and the Thunder’s Edge token — plus the relics <b>“Maw of Worlds”</b>, <b>“Prophet’s Tears”</b> and <b>“The Quantumcore”</b>, and the secret objectives <b>“Betray a Friend”</b>, <b>“Dictate Policy”</b>, <b>“Drive the Debate”</b> and <b>“Strengthen Bonds”</b>.</li>" +
          (c.has("pok") ? "" : "<li><b>Without Prophecy of Kings</b>, also remove: the abilities “Distant Suns”, “Fabrication” and “Dimensional Tear”; the genomes “Brutal Genome” and “Curious Genome”; the paradigms “Forge Legend” and “Opening the Eye”; and all 3 mech unit upgrades.</li>") +
          "<li>All other components are compatible with this game mode.</li>" +
          "</ul>";
      },
      src: function () { return "TF p.6–7"; } },

    { id: "tf-draft-1", after: "lrr-setup-1:replace", exp: "twilightsfall",
      when: function (c) { return uses(c) && tf(c); },
      t: "Starting draft ① — deal faction cards",
      d: function () {
        return "<ul>" +
          "<li>Setup steps 1–6 are replaced by a <b>starting draft</b>. Nobody plays a standard faction — faction cards only decide your <b>seat</b>, <b>home system</b> and <b>starting units</b>.</li>" +
          "<li>Deal <b>three faction reference cards</b> to each player.</li>" +
          "<li>Each player keeps one facedown and passes the other two to the <b>left</b>; from the two cards they receive, each player keeps one facedown and passes the last card left again, where it is placed facedown.</li>" +
          "<li>Everyone ends up with <b>three facedown faction cards</b>.</li>" +
          "</ul>";
      },
      src: function () { return "TF p.7"; } },

    { id: "tf-draft-2", after: "lrr-setup-2:replace", exp: "twilightsfall",
      when: function (c) { return uses(c) && tf(c); },
      t: "Starting draft ② — seating order & speaker",
      d: function (c) {
        return "<ul>" +
          "<li>Each player chooses one of their faction cards; all reveal them <b>simultaneously</b>.</li>" +
          "<li>The <b>lowest priority number</b> (upper-right corner of the card, below the faction symbol) is the <b>speaker</b>. The next-lowest sits to the speaker’s <b>left</b>, and so on.</li>" +
          "<li><b>Using a premade map" + (teMap(c) || c.mod("gal-premade") ? " (you are)" : "") + ":</b> steps ② and ③ work slightly differently — after the speaker is determined, players claim home-system locations on the map one at a time: the player with the <b>lowest priority</b> (the <b>highest</b> priority number) first, then the next, and so on, <b>with the speaker choosing last</b>.<ul>" +
          "<li><i>The book has the “lowest priority player” claim first and the speaker last. The speaker holds the lowest priority number, so the claims can only run from the highest number down.</i></li></ul></li>" +
          "</ul>";
      },
      src: function () { return "TF p.7"; } },

    { id: "tf-draft-3", after: "lrr-setup-3:replace", exp: "twilightsfall",
      when: function (c) { return uses(c) && tf(c); },
      t: "Starting draft ③ — build the galaxy & choose home systems",
      d: function (c) {
        var id = teMap(c), board;
        if (id) board = mapItems(id, c, true);
        else if (otherBuild(c)) board = otherBuildItems(c);
        else board = boardItems(c, true);
        return "<ol>" +
          "<li><b>" + (id || c.mod("gal-premade") ? "Create the game board from the premade map:" : "Create the game board as normal:") + "</b><ul>" + board + "</ul></li>" +
          "<li>Then, beginning with the <b>speaker</b> and going <b>clockwise</b>, each player chooses one of their <b>remaining two</b> faction cards and places it faceup: that faction’s <b>home system</b> is yours. Place it in your home-system location.<ul>" +
          "<li><b>Council Keleres</b> chosen this way: draw a random unused faction card instead and use that faction’s home system.</li>" +
          "<li><b>Ghosts of Creuss</b> or <b>Crimson Rebellion</b> home system: also set up the <b>Creuss Gate</b> / <b>The Sorrow</b>, and take the matching <b>Echo</b> card (Echo of Sacrifice — Creuss; Echo of Divergence — Ahk Creuxx): <i>during your tactical actions, apply +1 to the move value of each of your ships that starts its movement in your home system.</i> It cannot be lost.</li></ul></li>" +
          "</ol>";
      },
      src: function (c) {
        var id = teMap(c);
        if (id) return cite({ TF: [7], TE: [6, MAPDATA[id].pageNo].concat(id === "te-map-redvsblue" ? [4, 13] : []), LRR: c.has("pok") ? [4] : [] });
        if (otherBuild(c)) return "TF p.7 · " + otherBuildSrc(c);
        var s = boardPages(c); s.TF = [7];
        return cite(s);
      } },

    { id: "tf-draft-4", after: "lrr-setup-4:replace", exp: "twilightsfall",
      when: function (c) { return uses(c) && tf(c); },
      t: "Starting draft ④ — choose your Mahact King",
      d: function (c) {
        return "<ul>" +
          "<li>Beginning with the player to the <b>right of the speaker</b> and going <b>counter-clockwise</b>, each player chooses a <b>Mahact King</b> faction sheet. Each King has a unique flagship and a unique mech.</li>" +
          "<li>Take the plastic units, Twilight’s Fall control tokens, Twilight’s Fall command tokens and the two Twilight’s Fall <b>faction technologies</b> (wavelength and antimatter) that match your sheet’s colour. You don’t own the technologies yet — you gain one by taking it instead of a card in a splice, or when an effect would give you a technology.</li>" +
          (c.has("pok") ? "" : "<li><b>Without Prophecy of Kings:</b> play with the side of the faction sheet that has no mech units. The pink and orange Kings can still be used by substituting an unused colour of plastic.</li>") +
          "<li>You’ll also need your colour’s <b>command sheet</b>: setup step 11 still places command tokens in your tactic, fleet and strategy pools (the draft text doesn’t list it).</li>" +
          "</ul>";
      },
      src: function () { return "TF p.7, p.10 · LRR p.4–5"; } },

    { id: "tf-draft-5", after: "lrr-setup-5:replace", exp: "twilightsfall",
      when: function (c) { return uses(c) && tf(c); },
      t: "Starting draft ⑤ — place starting units",
      d: function () {
        return "<ul>" +
          "<li>Use your <b>last faction card</b>: place the <b>starting units</b> shown on it in your home system.</li>" +
          "<li><b>Home planet cards:</b> the draft doesn’t mention them. Among the steps it replaces, LRR step 5 has each player take the planet cards for their home system’s planets, faceup.</li>" +
          "</ul>";
      },
      src: function () { return "TF p.8 · LRR p.4"; } },

    { id: "tf-draft-6", after: "lrr-setup-6:replace", exp: "twilightsfall",
      when: function (c) { return uses(c) && tf(c); },
      t: "Starting draft ⑥ — return faction cards",
      d: function () {
        return "<ul><li>Finally, return every faction card to the faction reference card deck. (The galaxy was built in draft step ③.)</li></ul>";
      },
      src: function () { return "TF p.8"; } },

    { id: "tf-frontier", after: "lrr-setup-7", exp: "te",
      when: function (c) { return uses(c) && tf(c) && c.has("pok"); },
      t: "Frontier tokens on space stations",
      d: function () {
        return "<ul><li>A system that contains a <b>space station and no planets</b> also gets a frontier token.</li></ul>";
      },
      src: function () { return "TE p.16"; } },

    { id: "tf-decks", after: "lrr-setup-8:replace", exp: "twilightsfall",
      when: function (c) { return uses(c) && tf(c); },
      t: "Shuffle the common decks (Twilight’s Fall)",
      d: function (c) {
        return "<ul>" +
          "<li>Shuffle the <b>Twilight’s Fall action cards</b> and the <b>edict cards</b> into two separate decks and place them near the game board. Standard action cards and agenda cards are not used.</li>" +
          "<li>Shuffle the <b>stage I</b>, <b>stage II</b> and <b>secret objective</b> decks separately (the four removed secret objectives stay out).</li>" +
          "<li>Shuffle the <b>relic deck</b> (three relics removed)" + (c.has("pok") ? " and each <b>exploration deck</b>" : "") + " and place " + (c.has("pok") ? "them" : "it") + " in the common play area.</li>" +
          "<li>Keep the <b>ability</b>, <b>unit upgrade</b>, <b>genome</b> and <b>paradigm</b> cards as separate shuffled decks — splices draw from, and shuffle back into, “their respective decks”.</li>" +
          "</ul>";
      },
      src: function (c) { return "TF p.6, p.8–9 · LRR p.5 · TE p.6"; } },

    { id: "tf-supply", after: "lrr-setup-9", exp: "twilightsfall",
      when: function (c) { return uses(c) && tf(c); },
      t: "Benediction & Singularity tokens",
      d: function () {
        return "<ul><li>Set the <b>benediction token</b> and the Twilight’s Fall <b>Singularity tokens</b> (X, Y, Z) aside near the game board.</li></ul>";
      },
      src: function () { return "TF p.6, p.8"; } },

    { id: "tf-strategy", after: "lrr-setup-10:replace", exp: "twilightsfall",
      when: function (c) { return uses(c) && tf(c); },
      t: "Gather the Twilight’s Fall strategy cards",
      d: function (c) {
        return "<ul><li>Place the <b>eight Twilight’s Fall strategy cards</b> faceup in the common play area: <b>1 Lux · 2 Noctis · 3 Tyrannus · 4 Civitas · 5 Amicus · 6 Calamitas · 7 Magus · 8 Aeterna</b>.</li>" +
          "<li>The standard strategy cards are not used." + (c.p <= 4 ? " With " + num(c.p) + " players each player still takes two strategy cards per round." : "") + "</li></ul>";
      },
      src: function (c) { return "TF p.8, p.10–11" + (c.p <= 4 ? " · LRR p.32" : ""); } },

    { id: "tf-starting", after: "lrr-setup-11:replace", exp: "twilightsfall",
      when: function (c) { return uses(c) && tf(c); },
      t: "Starting components (Twilight’s Fall)",
      d: function () {
        return "<ul><li>There are <b>no starting technologies</b>, and starting units were already placed during the draft.</li>" +
          "<li>Each player places <b>3</b> command tokens in their tactic pool, <b>3</b> in their fleet pool and <b>2</b> in their strategy pool.</li></ul>";
      },
      src: function () { return "TF p.8 · LRR p.5"; } },

    { id: "tf-inaugural-splice", after: "end", exp: "twilightsfall",
      when: function (c) { return uses(c) && tf(c); },
      t: "Step 13 — the inaugural splice",
      d: function (c) {
        return "<ol>" +
          "<li>Deal each player a hand of <b>3 ability</b>, <b>2 unit upgrade</b> and <b>2 genome</b> cards.</li>" +
          "<li>Each player keeps one card facedown, then passes the hand to the <b>right</b>. Repeat until everyone has <b>3 abilities, 2 unit upgrades and 2 genomes</b> facedown. You can’t keep a card type you already hold the maximum of; with nothing you may keep, pass the hand without choosing.</li>" +
          "<li>Look over your drafted cards and keep <b>2 abilities, 1 unit upgrade and 1 genome</b> — your starting cards. Your King’s <b>faction technologies</b> can be chosen now, at this final decision (not during the draft); taking one replaces taking a card.</li>" +
          "<li>Shuffle unchosen cards back into their decks. Then all players <b>reveal their starting cards simultaneously</b>." +
          (veiled(c) ? " <b>Veiled Heart:</b> don’t reveal — your starting cards stay facedown and secret, and their effects aren’t active until you reveal them." : "") + "</li>" +
          "</ol>";
      },
      src: function (c) { return "TF p.8, p.10" + (veiled(c) ? " · TF p.11" : ""); } },

    { id: "tf-play", after: "play:replace", exp: "twilightsfall",
      when: function (c) { return uses(c) && tf(c); },
      t: "Start round 1 — Twilight’s Fall",
      d: function (c) {
        return "<ul>" +
          "<li>Each round: <b>strategy phase → action phase → status phase → benediction phase</b>. The benediction phase replaces the agenda phase and happens even before anyone controls Mecatol Rex — whenever there is a <b>tyrant</b> (the benediction token’s holder); with no tyrant it is skipped.</li>" +
          "<li>Round 1 begins with the speaker choosing a Twilight’s Fall strategy card, then clockwise" + (c.p <= 4 ? "; with " + num(c.p) + " players everyone then picks a second card, again starting with the speaker" : "") + ".</li>" +
          "<li>Genomes ready during each status phase, with your other exhausted cards.</li>" +
          "<li>First time at the table? Open the Teaching script above.</li></ul>";
      },
      src: function () { return "TF p.9–10 · LRR p.19, p.32"; } }
  ];

  /* ---------------- rules reference ---------------- */
  var reference = [
    { id: "te-overview", title: "Thunder’s Edge — what’s new, integration & components",
      when: function (c) { return uses(c); },
      html: function (c) {
        return "<ul>" +
          "<li>The <b>second expansion</b>: the Thunder’s Edge <b>expedition</b>, faction-specific <b>breakthroughs</b>, and <b>The Fracture</b> — a hellish dimension overrun by the Vuil’raith in the eons past.</li>" +
          "<li><b>Six new factions</b>, including the Council Keleres (previously only in the Twilight Codices). Factions the rulebook names in its setup and components include the Crimson Rebellion, the Deepwrought Scholarate, the Firmament (which can become the Obsidian), Last Bastion and the Ral Nel Consortium.</li>" +
          "<li>Every card and sheet carries the <b>Thunder’s Edge icon</b>; new system tiles are numbered <b>92–128</b>.</li>" +
          "<li>All Twilight Codex gameplay content is included as <b>revised cards</b> marked with the Codex icon.</li>" +
          "<li>Also includes the <b>Twilight’s Fall</b> game mode (its components aren’t used in a normal game).</li></ul>" +
          "<h4>Integration (once, when you open the box)</h4><ol>" +
          "<li>Find the cards packed with the “Codex Cards” cover card.</li>" +
          "<li><b>No earlier Codex?</b> Add to your components: 20 action cards, 3 relics, 6 exploration cards, the Keleres faction sheet, mech, 5 leaders, promissory note and 2 faction technologies, and the “Custodia Vigilia” planet card and legendary planet ability card. Then use the other Codex cards to <b>replace</b> the matching base/PoK cards: 3 faction technologies, 8 “Magen Defense Grid”, 8 “X-89 Bacterial Weapon”, 3 secret objectives, 5 promissory notes, 1 mech and 6 leaders.</li>" +
          "<li><b>Own an earlier Codex?</b> Replace all of its components with the updated Thunder’s Edge versions.</li>" +
          "<li>Use Thunder’s Edge’s own <b>Alliance</b> and <b>Faction Reference</b> card sets (not the print-and-play ones).</li>" +
          "<li>Replace the <b>Construction</b> and <b>Warfare</b> strategy cards with the revised ones, and the <b>Mecatol Rex</b> tile with the one bearing a legendary planet icon.</li>" +
          "<li>" + (c.has("pok") ? "With Prophecy of Kings: replace Jol-Nar’s “Ta Zern” leader with “Agnlan Oln”." : "Without Prophecy of Kings: remove all leaders, mechs and exploration cards, and the “Cultural Exchange Program” galactic event.") + "</li>" +
          "<li>Combine the remaining new cards with their decks; shuffle the new red- and blue-backed tiles into their piles.</li></ol>" +
          "<h4>Components</h4><ul>" +
          "<li><b>Cards:</b> 7 faction sheets · 30 faction reference · 31 alliance reference · 30 breakthrough · 10 faction technology · 6 promissory note · 16 faction mechanic (5 Firmament Plot, 5 Deepwrought Ocean, 6 Helios) · 24 Prophecy of Kings (19 leaders, 5 mechs) · 74 Codex · 43 planet · 10 legendary planet ability · 10 relic · 20 action · 20 galactic event · 2 revised strategy cards · 1 reference card.</li>" +
          "<li><b>Board:</b> 33 system and hyperlane tiles · 3 Fracture system tiles · 63 plastic neutral units.</li>" +
          "<li><b>Tokens:</b> Thunder’s Edge (1) · ingress (7) · diplomacy (1) · commerce (5) · Avernus planet (1) · Nano-Forge attachment (1) · Empyrean Void Tether (2) · Nekro Z Assimilator (7) · Crimson Breach (7, double-sided) and Sever (1) · Bastion Galvanize (7 — the setup text on p.6 says 8) · Helios (6: 3 Nekro, 3 Bastion) · control (85) · command (80).</li></ul>";
      },
      src: function () { return "TE p.4–5"; } },

    { id: "te-strategy-cards", after: "ref-cards", title: "Revised strategy cards — Warfare & Construction (Thunder’s Edge)",
      when: function (c) { return uses(c) && std(c); },
      html: function () {
        return "<p>Thunder’s Edge replaces two strategy cards (TE p.4). The printed cards supersede the Living Rules Reference entries for Construction (§24) and Warfare (§99).</p>" +
          "<h4>6 Warfare — revised (text from the card shown on TE p.5)</h4><ul>" +
          "<li><b>Primary:</b> Perform a <b>tactical action</b> in any system <b>without placing a command token</b>, even if the system already has your command token in it; that system still counts as being activated. You may <b>redistribute</b> your command tokens before and after this action.</li>" +
          "<li><b>Secondary:</b> Spend 1 token from your strategy pool to use the <b>PRODUCTION</b> abilities of the units in your home system.</li>" +
          "<li>If the primary’s tactical action is <b>canceled</b>, or the resolving player’s turn is ended, the rest of the card is still resolved.</li>" +
          "<li><i>Was (LRR §99):</i> remove one of your command tokens from the board and gain it, then redistribute; secondary: PRODUCTION of one space dock in your home system.</li></ul>" +
          "<h4>4 Construction — revised</h4><ul>" +
          "<li>Use the Thunder’s Edge card — the rulebook only shows it partly hidden behind Warfare (TE p.5), so its full text isn’t reproduced here.</li></ul>" +
          "<p><i>Older rulings on Warfare’s secondary — the LRR FAQ answer that it can’t trigger the Arborec’s Letani Warriors (LRR p.43), and the Wiki FAQ answer on Agency Supply Network — were written for the old “one space dock” wording; the revised card uses the PRODUCTION abilities of the units in your home system.</i></p>";
      },
      src: function () { return "TE p.4–5, p.16 · LRR p.14–15, p.37, p.43 · Wiki FAQ (The Council Keleres)"; } },

    { id: "te-expedition", title: "The Thunder’s Edge expedition",
      when: function (c) { return uses(c) && std(c); },
      html: function () {
        return "<ul>" +
          "<li>Thunder’s Edge starts <b>in play, off the board</b>, expedition side (six “slices”) faceup.</li>" +
          "<li><b>At the end of your turn</b> you may commit to the expedition: choose an <b>unclaimed</b> slice, pay its cost, and place one of your <b>control tokens</b> on it.</li>" +
          "<li><b>The six costs</b> (one per slice): spend <b>5 resources</b> · spend <b>5 influence</b> · spend <b>3 trade goods</b> · discard <b>2 action cards</b> · discard <b>1 unscored secret objective</b> · exhaust <b>1 technology-specialty planet</b>.</li>" +
          "<li>A claimed slice can’t be claimed by anyone else — later contributors pay a different cost. You may claim several slices over the game, a different one each time.</li>" +
          "<li>The <b>first time</b> you claim a slice, you gain your faction’s <b>breakthrough</b>.</li></ul>" +
          "<h4>Completing the expedition</h4><ol>" +
          "<li>When all slices are claimed, the player who claimed the <b>final slice</b> flips Thunder’s Edge to its <b>planet side</b> and places it in a system of their choice that contains <b>no planet, no supernova and no printed wormhole</b>. It can’t be placed in The Fracture.</li>" +
          "<li>The player with the <b>most control tokens</b> on the expedition places <b>that many infantry</b> on Thunder’s Edge. Tie: the player who claimed the final slice chooses which tied player places them.</li>" +
          "<li>If that system has a <b>frontier token</b>, don’t remove it — it can still be explored as normal.</li></ol>";
      },
      src: function () { return "TE p.8, p.16"; } },

    { id: "te-breakthroughs", title: "Breakthroughs & synergy",
      when: function (c) { return uses(c) && std(c); },
      html: function () {
        return "<ul>" +
          "<li>A <b>breakthrough</b> is a faction-specific card, most often gained through the expedition (your first slice). It gives your faction a unique new ability and <b>synergy</b> between two technology colours.</li>" +
          "<li><b>Synergy:</b> a technology or technology specialty of either linked colour can count as the other colour for <b>researching technology</b> and for <b>technology-related objectives</b> — but only as one colour at any given time.</li>" +
          "<li><b>The Fracture roll:</b> whenever a player gains their breakthrough — from any source — while The Fracture is not in play, they roll one die. On a <b>1 or 10</b>, they put The Fracture into play.</li></ul>";
      },
      src: function () { return "TE p.8"; } },

    { id: "te-fracture", title: "The Fracture, ingress & egress",
      when: function (c) { return uses(c); },
      html: function (c) {
        return (tf(c) ? "<p><i>Twilight’s Fall doesn’t use breakthroughs or the Thunder’s Edge token (TF p.6), so here The Fracture only enters play through another ability — and its last ingress token goes to Mecatol Rex.</i></p>" : "") +
          "<h4>Coming into play</h4><ul>" +
          "<li>" + (tf(c) ? "An ability" : "A breakthrough roll of 1 or 10, or another ability,") + " brings it into play. That player places The Fracture along <b>any edge</b> of the board, as in TE p.9’s diagram (one for three players, one for four or more).</li>" +
          "<li>The Fracture is three tiles — a three-space tile and two two-space tiles. In the four-or-more diagram the three-space tile sits just beyond one home system, and the two-space tiles run along the outside of the board to just beyond the neighbouring home systems.</li>" +
          "<li>Then place the <b>neutral units</b> shown on the back of The Fracture’s tiles.</li></ul>" +
          "<h4>Ingress tokens</h4><ul>" +
          (tf(c) ? "" : "<li><b>Brought in by a breakthrough roll:</b> for <b>each synergy colour</b> on the roller’s breakthrough, they choose <b>three systems</b> containing a matching technology specialty (if able) and place an ingress token in each. At most one ingress per system, and at most six placed this way.</li>") +
          "<li><b>Brought in by another ability" + (tf(c) ? "" : ", or by a breakthrough without synergy (e.g. the Nekro Virus)") + ":</b> the player chooses <b>four planets</b> — each in a <b>different system</b>, each with a <b>different technology specialty</b> — and places an ingress token in each planet’s system. If fewer than four specialties are in play, the rest aren’t placed.</li>" +
          "<li><b>Finally</b> an ingress goes in the <b>Thunder’s Edge</b> system if it is in play — otherwise in the <b>Mecatol Rex</b> system (expedition not completed).</li></ul>" +
          "<h4>Moving in and out</h4><ul>" +
          "<li>Fracture systems are <b>not adjacent</b> to the board systems they touch, and each counts as being on the <b>edge</b> of the board.</li>" +
          "<li>A system with an <b>ingress</b> is adjacent to every Fracture system that contains an <b>egress</b>. Ingress systems are not adjacent to other ingress systems; egress systems are not adjacent to other egress systems.</li></ul>" +
          "<h4>Inside</h4><ul>" +
          "<li>Every Fracture planet has a <b>relic icon</b>. <b>Styx</b> is also a <b>legendary planet</b> (its card: gain 1 victory point when you gain it, lose 1 when you lose it).</li>" +
          (tf(c) ? "" : "<li>Thunder’s Edge can’t be placed in The Fracture; the Creuss hero <b>Riftwalker Meian</b> can’t swap Fracture systems (or the Ahk Creuxx system); the <b>Age of Exploration</b> event can’t place new tiles off Fracture tiles.</li>") + "</ul>";
      },
      src: function (c) { return "TE p.8–10, p.16" + (tf(c) ? " · TF p.6" : ""); } },

    { id: "te-relics-legendary", title: "Relics & legendary planets (Thunder’s Edge)",
      when: function (c) { return uses(c); },
      html: function (c) {
        return "<h4>Relics</h4><ul>" +
          "<li>When you gain a planet card <b>from the planet deck</b> that has a <b>relic icon</b>, or an effect tells you to draw a relic: draw the top card of the relic deck and place it faceup in your play area.</li>" +
          (c.has("pok") ? "" : "<li>Thunder’s Edge uses the relic deck even without Prophecy of Kings.</li><li>If the relic deck is empty, you don’t gain a relic. Relics can’t be traded.</li>") +
          "</ul><h4>Legendary planets</h4><ul>" +
          "<li>Many Thunder’s Edge planets are <b>legendary</b> (legendary icon). When you take control of one, also place its <b>legendary planet ability card</b> in your play area.</li>" +
          "<li>If you gain control of an <b>exhausted</b> legendary planet ability card, it stays exhausted.</li>" +
          (c.has("pok") ? "" : "<li>An ability card taken from the deck is <b>readied</b>. If a legendary planet’s planet card is purged, its ability card is purged too.</li>") +
          "<li>Thunder’s Edge’s <b>Mecatol Rex</b> system tile carries a legendary planet icon.</li>" +
          "<li>Example — <b>Styx</b> (in The Fracture), “A Song Like Marrow”: when you gain this card, gain 1 victory point; when you lose it, lose 1 victory point.</li></ul>";
      },
      src: function (c) { return c.has("pok") ? "TE p.4, p.9–10" : "TE p.4, p.6, p.9–10 · LRR §53 p.22, §73 p.28"; } },

    { id: "te-neutral", title: "Neutral units",
      when: function (c) { return uses(c); },
      html: function () {
        return "<ul>" +
          "<li>Non-player forces: they <b>engage you in combat</b> if you move units to the planet or space area they occupy.</li>" +
          "<li>Their combat rolls are made by <b>any player other than the active player</b>.</li>" +
          "<li><b>Hits</b> go to the units <b>lowest on the neutral unit reference card</b> first — e.g. neutral destroyers before neutral cruisers. From the card’s layout: in space, fighters → destroyers → cruisers → carriers → dreadnoughts → war suns → flagship; on the ground, infantry before mechs.</li>" +
          "<li>They always use their unit abilities when they can (Sustain Damage, Space Cannon…) but no other abilities; they take no turns and perform no other game function unless a rule or ability says so.</li>" +
          "<li>They count as <b>another player’s units</b> for abilities and effects — but there is no “neutral player”. Any decision needed for them is made by the <b>speaker</b>.</li></ul>" +
          "<h4>Neutral unit reference</h4><ul>" +
          "<li><b>Flagship</b> — combat 7 (2 dice) · move 1 · capacity 3 · Sustain Damage</li>" +
          "<li><b>War sun</b> — combat 3 (3 dice) · move 2 · capacity 6 · Sustain Damage · Bombardment 3 (×3)</li>" +
          "<li><b>Dreadnought</b> — combat 5 · move 2 · capacity 1 · Sustain Damage · Bombardment 5</li>" +
          "<li><b>Carrier</b> — combat 9 · move 2 · capacity 6</li>" +
          "<li><b>Cruiser</b> — combat 6 · move 3 · capacity 1</li>" +
          "<li><b>Destroyer</b> — combat 8 · move 2 · Anti-Fighter Barrage 6 (×3)</li>" +
          "<li><b>Fighter</b> — combat 8 · move 2</li>" +
          "<li><b>Mech</b> — combat 6 · Sustain Damage</li>" +
          "<li><b>Infantry</b> — combat 8</li>" +
          "<li><b>PDS</b> — Planetary Shield · Space Cannon 6</li>" +
          "<li><b>Space dock</b> — no values printed</li></ul>" +
          "<p><i>“2 dice / 3 dice” = the burst icons printed beside the combat value; roll one die per burst icon.</i></p>";
      },
      src: function () { return "TE p.10 · LRR p.13"; } },

    { id: "te-space-stations", title: "Space stations",
      when: function (c) { return uses(c); },
      html: function (c) {
        return "<ul>" +
          "<li>Some systems contain <b>space stations</b> (space station icon on the tile).</li>" +
          "<li><b>Control:</b> you gain a station — from the deck or from another player — when you are the <b>only player with ships</b> in its system. You don’t lose it if those ships move out.</li>" +
          "<li>Each station has a <b>planet card</b>: gained <b>exhausted</b>, spent and readied as if it were a planet.</li>" +
          "<li>But structures and ground forces can’t be placed on or committed to a station, and it doesn’t count as a planet for " + (tf(c) ? "" : "<b>voting</b>, ") + "<b>objectives</b> or <b>controlling a home system</b>.</li>" +
          "<li><b>+1 commodity value</b> for each station you control — put a <b>commerce token</b> in your commodity pool as a reminder.</li>" +
          "<li>Station controllers may <b>transact with each other</b> even if they aren’t neighbours.</li>" +
          "<li>Exhaust a station <b>at any time</b> to convert your commodities to trade goods.</li>" +
          (c.has("pok") ? "<li><b>Setup:</b> a system with a space station and no planets gets a frontier token.</li>" : "") +
          "</ul>";
      },
      src: function (c) { return c.has("pok") ? "TE p.10, p.16" : "TE p.10"; } },

    { id: "te-anomaly-planets", title: "Entropic scars, dual traits & specialties, purge",
      when: function (c) { return uses(c); },
      html: function (c) {
        return "<h4>Entropic scar (anomaly)</h4><ul>" +
          "<li>Unit abilities — <b>Sustain Damage, Production, Planetary Shield, Space Cannon, Bombardment, Deploy, Anti-Fighter Barrage</b> — can’t be used <b>by or against</b> units inside an entropic scar. Text abilities are unaffected.</li>" +
          "<li>Wormholes that would be placed inside an entropic scar are <b>discarded</b> instead.</li>" +
          "<li><b>Start of the status phase:</b> a player with ships in an entropic scar may spend a token from their <b>strategy pool</b> to gain one of their <b>faction-specific technologies</b>." +
          (tf(c) ? " <i>(Twilight’s Fall: gaining technology gives one of your King’s faction technologies — or 2 command tokens if you have both.)</i>" : "") + "</li></ul>" +
          "<h4>Dual planet traits</h4><ul><li>Count as having <b>both</b> traits." + (c.has("pok") ? " When exploring one, draw from the deck of <b>either</b> trait (not both)." : "") + "</li></ul>" +
          "<h4>Dual technology specialties</h4><ul><li>" + (tf(c) ? "Some planets have two technology specialties. <i>Twilight’s Fall has no researching, so Thunder’s Edge’s rule for them (exhaust the planet when researching to satisfy either or both prerequisites) doesn’t come up; how specialty planets count toward technology objectives is under “faction technology, specialties &amp; paradigms”.</i>"
            : "Exhaust the planet when researching to satisfy <b>either or both</b> prerequisites at once.") + "</li></ul>" +
          "<h4>Purge</h4><ul><li>A purged component is removed from the game and returned to the box." + (c.has("pok") ? "" : " It can never be used or brought back by any means, and it is purged even if its ability only partly resolved.") + "</li></ul>";
      },
      src: function (c) { return "TE p.10–11" + (c.has("pok") ? "" : " · LRR §70 p.27") + (tf(c) ? " · TF p.10" : ""); } },

    { id: "te-coexist", title: "Coexisting units",
      when: function (c) { return uses(c); },
      html: function () {
        return "<ul>" +
          "<li>Some effects let your units <b>coexist</b> with another player’s units on a planet: <b>no combat</b> is triggered.</li>" +
          "<li>The player whose units triggered coexistence <b>doesn’t gain or keep control</b> of the planet; if they controlled it, the player they now coexist with gains control of it, <b>exhausted</b>.</li>" +
          "<li>Coexisting <b>structures are always blockaded</b>. Units the coexisting player later places, produces or moves onto that planet coexist too.</li>" +
          "<li>If your coexisting units become the <b>only units</b> on the planet, you gain control of it.</li>" +
          "<li><b>Bombardment:</b> the bombarding player chooses which of their bombardment units target which player’s units, rolling against each player separately.</li>" +
          "<li><b>Attacking them:</b> units committed to the planet can start combat against coexisting units — even units they were already coexisting with. The active player may choose not to, leaving them coexisting; after winning a combat against the planet’s owner they may start separate combats against any coexisting player.</li>" +
          "<li><b>Ending it yourself:</b> activate the system and commit your coexisting units against the planet; win the ground combat to stop coexisting and gain control as normal.</li>" +
          "<li><b>Objectives:</b> a coexisting player counts as controlling the planet for scoring objectives — and for no other ability or effect.</li>" +
          "<li>Several players can coexist on one planet.</li></ul>";
      },
      src: function () { return "TE p.11, p.16"; } },

    { id: "te-hyperlanes", after: "ref-anomalies", title: "Hyperlanes (Thunder’s Edge layouts)",
      /* the TE layouts (4 players with PoK, 5 players) or "Red vs Blue" — not when a premade/other map replaces them */
      when: function (c) { return uses(c) && (!!c.mod("te-map-redvsblue") || ((std(c) || tf(c)) && hyperTE(c) && !teMap(c) && !otherBuild(c))); },
      html: function (c) {
        return "<ul>" +
          "<li>With Thunder’s Edge the galaxy uses hyperlane tiles with <b>five players</b>, or with <b>four players and Prophecy of Kings</b> (layouts on TE p.7)" + (c.mod("te-map-redvsblue") ? "; the “Red vs Blue” map has two hyperlane rings" : "") + ".</li>" +
          "<li>Each contiguous line across one or more hyperlane tiles is a <b>hyperlane</b>; the system tiles it connects are <b>adjacent for all purposes</b>.</li>" +
          "<li>Hyperlane tiles <b>are not systems</b>: they can’t hold units and can’t be targeted by effects or abilities.</li>" +
          "<li>They balance the starting positions, so five-player games give <b>no extra trade goods</b> for seat position.</li>" +
          "<li class=\"note flag\"><b>Sources disagree — board edge on hyperlane maps.</b> LRR §39.2 — followed here — puts a system on the edge of the board if any of its sides doesn’t touch another <b>system tile</b>, and hyperlane tiles are not systems (§44.2). The TI4 Wiki FAQ (Hyperlanes) reports the designer’s intent that a side touching a hyperlane tile doesn’t count as an edge.</li></ul>";
      },
      src: function () { return "TE p.7, p.12 · LRR §39 p.19, §44 p.20 · Wiki FAQ (Hyperlanes) — conflict flagged"; } },

    /* not in Twilight's Fall: TF p.6 boxes every use of the alliance cards (promissory notes, galactic events,
       breakthroughs) and the Diplomacy card; the draft steps cover the faction reference cards' role there */
    { id: "te-cards", title: "Faction & alliance reference cards, diplomacy token",
      when: function (c) { return uses(c) && !tf(c); },
      html: function (c) {
        return "<h4>Faction reference cards</h4><ul>" +
          "<li>A short summary of each faction’s capabilities, including those granted by Prophecy of Kings cards.</li>" +
          "<li>Also used to set up Twilight’s Fall and by galactic events that pick random factions.</li></ul>" +
          "<h4>Alliance reference cards</h4><ul>" +
          "<li>A reference for the Prophecy of Kings “Alliance” promissory note; also used in the Alliance game variant, some galactic events and the Yin Brotherhood’s breakthrough.</li>" +
          "<li>Gained for any reason <b>other than</b> an “Alliance” promissory note: place it in your play area — you can use its ability.</li></ul>" +
          (std(c) ? "<h4>Diplomacy token</h4><ul>" +
          "<li>A player aid for simple uses of the <b>Diplomacy</b> strategy card’s primary ability: it represents a command token from each player.</li>" +
          "<li>It can’t take a player above the component limit for command tokens, and shouldn’t be used with abilities that remove command tokens.</li></ul>" : "");
      },
      src: function () { return "TE p.12"; } },

    { id: "te-galactic-events", title: "Galactic events (Thunder’s Edge)",
      when: function (c) { return uses(c) && c.mode === "standard"; },   // events are standard-game only here: the Codex IV module is too, and the scenarios use fixed maps (Codex I p.12, Codex IV pp.15, 18)
      html: function (c) {
        return "<ul>" +
          "<li>Thunder’s Edge includes <b>20 galactic event cards</b>. They are optional and each contains the rules needed to play it.</li>" +
          "<li><b>When:</b> setup step 1, after the speaker is determined — choose one as a group or draw one at random. Some modify setup; advanced groups may play with more than one.</li>" +
          "<li>Events that need <b>random factions</b> use the faction reference cards; some events use <b>alliance reference cards</b> (a card gained this way goes in your play area and its ability is yours to use).</li>" +
          "<li>Example of a setup-changing event (pictured on TE p.6), <b>“Advent of the War Sun”</b>: at the end of setup every player except the Embers of Muaat gains the War Sun unit upgrade technology; the Muaat player purges their faction promissory note and places 1 additional war sun in their home system.</li>" +
          (c.has("pok") ? "" : "<li><b>Without Prophecy of Kings:</b> “Cultural Exchange Program” is removed; “Wild, Wild Galaxy” and “Age of Exploration” can be played — ignore the text that refers to PoK components.</li>") +
          "</ul><h4>Event clarifications</h4><ul>" +
          (geOn(c) ? "<li>The Codex IV events’ rules, with their Thunder’s Edge clarifications, are under “Galactic events (Codex IV)” and in the galactic-event setup steps.</li>" :
            "<li><b>Minor Factions:</b> TE p.7’s six-player example shows valid minor-faction positions (ring 2, off the lines between Mecatol Rex and the home systems). If the Ghosts of Creuss or Crimson Rebellion is a minor faction, the Creuss Gate / The Sorrow goes in the minor faction spot and the home system is placed near the board. Use Thunder’s Edge’s plastic neutral units for its neutral infantry (combat 8 on the neutral unit reference; rules on TE p.10). The “Subjugation” map is built for this event.</li>" +
            "<li><b>Age of Exploration:</b> new tiles can’t be placed off the Ghosts of Creuss home system, the Crimson Rebellion home system, the Wormhole Nexus, or any Fracture tile." + (c.has("pok") ? "" : " Playable without PoK (see above).") + "</li>") +
          "<li><b>Wild, Wild Galaxy:</b> a home system replaced by a supernova is still that player’s home system; if there are no planets in a player’s home system, they still control every planet in their home system and can score public objectives.</li>" +
          "<li>Galactic events are <b>not used</b> in Twilight’s Fall.</li></ul>";
      },
      src: function (c) { return "TE p.4–7, p.12, p.14, p.16 · TF p.6"; } },

    { id: "te-alliance", title: "Alliance game variant — Thunder’s Edge rules",
      when: function (c) { return uses(c) && std(c) && alliance(c); },
      html: function (c) {
        return "<p>Thunder’s Edge prints its own Alliance game variant (TE p.13); as the newest version it replaces the Codex II text. Items marked <b>TE</b> differ from Codex II.</p><ul>" +
          "<li>Teams of two against up to three other alliances — <b>four, six or eight players</b>.</li></ul>" +
          "<h4>Setup</h4><ul>" +
          "<li><b>Step 2:</b> assign allies; each player places the Alliance reference card for their ally in their play area. <b>TE:</b> the reference card is now taken here (Codex II: at “Choose Color”, with the purge), and the Mahact Gene-Sorcerers’ ally also places a command token from their reinforcements into the Mahact’s fleet pool.</li>" +
          "<li><b>Step 4" + (c.has("pok") ? "" : " (Prophecy of Kings only)") + ":</b> each player purges their “Alliance” promissory note and flips their commander to its unlocked side — all commanders start unlocked. <b>TE:</b> only when playing with Prophecy of Kings.</li></ul>" +
          "<h4>Transactions with your ally</h4><ul>" +
          "<li>Commodities you exchange with your ally <b>don’t convert</b> into trade goods.</li>" +
          "<li>You may receive your ally’s promissory notes (e.g. to pass on) but <b>can’t resolve</b> them.</li></ul>" +
          "<h4>Movement & control</h4><ul>" +
          "<li>Your ships may move through and into systems with your ally’s ships — no space combat.</li>" +
          "<li>Your ground forces may land on planets <b>your ally controls</b> — no ground combat, and you don’t gain control. <b>TE:</b> Codex II said planets containing your ally’s ground forces.</li>" +
          "<li>When an effect lets you redistribute command tokens, you may also exchange planet cards with your ally if the receiver has at least 1 ground force or structure on that planet (ready/exhausted state unchanged; “gain control” abilities don’t trigger).</li>" +
          "<li>When your ally activates a system, you may simultaneously perform a tactical action there (spend and place a tactic-pool token as normal).</li>" +
          "<li>If your ally allows it, you may <b>transport, support and commit</b> their fighters and ground forces using your units with capacity. <b>TE:</b> adds “support and commit”.</li></ul>" +
          "<h4>Combat & unit abilities</h4><ul>" +
          "<li>When you and your ally both have units in a combat roll or a unit-ability roll, you <b>may</b> both take part in the same roll; your rolls are combined and hits are assigned as normal. The allies decide together how hits against them are assigned; if they can’t agree, the active player assigns them.</li>" +
          "<li>Hits an opponent assigns against an allied pair may go to either ally’s units in any combination.</li></ul>" +
          "<h4>Abilities & effects</h4><ul>" +
          "<li>Your ally’s units count as <b>neither</b> your units nor other players’ units for abilities and effects.</li>" +
          "<li><b>TE:</b> abilities that trigger when a player activates a system containing another player’s units, planets or command tokens <b>don’t trigger</b> between allies.</li>" +
          "<li><b>TE:</b> your unit abilities (Space Cannon, Planetary Shield, etc.) <b>don’t affect your ally</b>.</li>" +
          "<li><b>TE:</b> <b>agent abilities can be used on your ally</b>.</li>" +
          "<li>Your ally’s planets count as your planets for resolving abilities, but you can’t exhaust them, and they don’t count for <b>scoring objectives</b> or the <b>“Imperial” victory point</b>. <b>TE:</b> Codex II said “other game effects (such as scoring objectives or unlocking leaders)”.</li></ul>" +
          "<h4>Elimination & winning</h4><ul>" +
          "<li>You can’t be eliminated while your ally controls a planet.</li>" +
          "<li>Play on the <b>14</b> side of the victory point track: an alliance wins when one ally has <b>14</b> victory points and the other at least <b>10</b>.</li></ul>";
      },
      src: function () { return "TE p.13 · Codex II p.13"; } },

    { id: "te-maps", after: "ref-galaxy", title: "Premade maps (Thunder’s Edge map appendix)",
      when: function (c) { return uses(c); },
      html: function (c) {
        return "<ul>" +
          "<li><b>“Thunder Dreaming”</b> — 6 players · no Prophecy of Kings needed · balanced, ideal for novices, full of new tiles (TE p.14).</li>" +
          "<li><b>“Subjugation”</b> — 6 players · Prophecy of Kings · an amped-up “Minor Factions” galactic event game: pick from twelve factions, the six left over become minor factions (TE p.14). Not for Twilight’s Fall (no galactic events there).</li>" +
          "<li><b>“Red vs Blue”</b> — 4 players · Prophecy of Kings · a 2v2 alliance deathmatch, west against east, with two hyperlane rings (TE p.15). Standard game only — its teams play by the Alliance variant (TE p.13).</li>" +
          "<li><b>“Legendary”</b> — 6 players · Prophecy of Kings · an off-balance arena: the legendary systems form ring 1 (TE p.15).</li>" +
          "<li>Choose one under Options to get its tile-by-tile layout in setup. In Twilight’s Fall, premade maps change draft steps ② and ③ (TF p.7).</li></ul>";
      },
      src: function () { return "TE p.13–15 · TF p.7"; } },

    { id: "te-clarifications", title: "Thunder’s Edge clarifications",
      when: function (c) { return uses(c); },
      html: function (c) {
        return "<h4>Rule change</h4><ul>" +
          "<li><b>Gravity rift:</b> a gravity rift can contribute its <b>movement bonus only once per ship</b> that passes through it — “a change from previous rulings” (the LRR said a rift can affect the same ship several times in one movement, §41.3). TE’s change speaks only to the movement bonus.</li></ul>" +
          "<h4>General</h4><ul>" +
          "<li><b>Abilities:</b> an ability that is still unresolved can’t be triggered again within a timing window that it generated itself.</li>" +
          (std(c) ? "<li><b>Warfare:</b> if the tactical action in its primary is canceled, or the resolving player’s turn is ended, the rest of the card is still resolved.</li>" +
            "<li><b>Thunder’s Edge (planet):</b> placed in a system with a frontier token? Leave the token; it can still be explored as normal.</li>" : "") +
          "<li><b>Space stations:</b> with Prophecy of Kings, a system with a space station and no planets gets a frontier token during setup.</li></ul>" +
          (tf(c) ? "<p><i>TE p.16’s faction clarifications (Keleres, Firmament/Obsidian, Crimson Rebellion, Deepwrought, the Creuss hero) are for standard faction sheets, technologies and leaders, which Twilight’s Fall returns to the box (TF p.6).</i></p>" :
          "<h4>Factions</h4><ul>" +
          "<li><b>Executive Order</b> (Keleres faction technology): agendas that refer to “This Agenda Phase” remain in play and resolve during that round’s agenda phase — or, if that round has none, the next agenda phase that is resolved.</li>" +
          "<li><b>Plot cards</b> (Firmament): hidden information once the game starts; players may look at them before the game begins.</li>" +
          "<li><b>Cronos and Tallin</b> (Firmament home system): when it flips, units on Cronos go to Cronos Hollow and units on Tallin to Tallin Hollow; units in the space area stay there.</li>" +
          "<li><b>Firmament/Obsidian technologies:</b> can’t be researched once the Firmament has become the Obsidian, but can be gained by effects that say “gain”.</li>" +
          "<li><b>Breaches</b> (Crimson Rebellion): at the component limit, inactive breaches may be moved from elsewhere; active breaches must be removed or flipped before they can be placed again.</li>" +
          "<li><b>Aello</b> (Deepwrought commander): once unlocked, any player may use it; the Deepwrought player can’t disallow it.</li>" +
          "<li><b>Coexist</b> (Deepwrought faction mechanic): multiple players can coexist on one planet.</li>" +
          "<li><b>Riftwalker Meian</b> (Creuss hero): can’t swap the Ahk Creuxx system or the systems of The Fracture.</li></ul>") +
          (std(c) ? "<p><i>Galactic-event clarifications are in “Galactic events (Thunder’s Edge)”.</i></p>" : "");
      },
      src: function (c) { return "TE p.16 · LRR p.19" + (tf(c) ? " · TF p.6" : ""); } },

    { id: "te-lrr-note", after: "ref-sources", title: "The Living Rules Reference & Thunder’s Edge",
      when: function (c) { return uses(c); },
      html: function () {
        return "<ul>" +
          "<li>Thunder’s Edge tells players with a question to check its clarifications or <b>consult the Living Rules Reference online</b> (fantasyflightgames.com, Twilight Imperium Fourth Edition product page).</li>" +
          "<li>The Living Rules Reference used for this page is <b>version 2.0 (09/22/20)</b> — it predates Thunder’s Edge. Where Thunder’s Edge changes a rule (the gravity rift bonus, the revised Warfare and Construction cards, the Alliance variant…), this page follows Thunder’s Edge.</li>" +
          "<li>Any later edition of the Living Rules Reference published online is <b>not</b> reflected here — check it for the newest rulings.</li></ul>";
      },
      src: function () { return "TE p.16 · LRR p.2"; } },

    /* ===== Twilight's Fall ===== */
    { id: "tf-overview", title: "Twilight’s Fall — how this mode differs",
      when: function (c) { return uses(c) && tf(c); },
      html: function (c) {
        return "<ul>" +
          "<li>A mode <b>for advanced players</b>, set in a possible dark future: each player controls a <b>Mahact King</b> and splices together a customised, rapidly changing faction.</li>" +
          "<li><b>Faction cards</b> only set your seat, home system and starting units (starting draft). Your King has a unique flagship" + (c.has("pok") ? " and mech" : " (and a unique mech, but without Prophecy of Kings you play the sheet’s side with no mech units)") + ".</li>" +
          "<li><b>Splices</b> — mostly started by the strategy cards — grant <b>abilities</b>, <b>unit upgrades</b> and <b>genomes</b>; <b>paradigms</b> come mainly from Aeterna.</li>" +
          "<li><b>No agenda phase</b>: the <b>benediction phase</b> (edicts, chosen by the tyrant) replaces it.</li>" +
          "<li><b>No technology deck</b>: abilities count as technologies, specialty planets help score technology objectives, and each King has two faction technologies.</li>" +
          "<li><b>Eight new strategy cards</b> (Lux, Noctis, Tyrannus, Civitas, Amicus, Calamitas, Magus, Aeterna) and <b>Twilight’s Fall action cards</b>.</li>" +
          "<li>Not used: standard strategy and action cards, agendas, technologies, promissory notes, standard faction sheets, leaders, standard mechs, faction command and control tokens, breakthroughs, galactic events, the Thunder’s Edge token (see setup).</li>" +
          "<li>Each King technology’s second ability is marked with the Prophecy of Kings icon — " + (c.has("pok") ? "active in this game (you play with PoK)" : "<b>inactive</b> in this game (no PoK)") + ".</li></ul>";
      },
      src: function () { return "TF p.6–11"; } },

    { id: "tf-splicing", title: "Splicing — abilities, unit upgrades & genomes",
      when: function (c) { return uses(c) && tf(c); },
      html: function (c) {
        return "<h4>The three splice decks</h4><ul>" +
          "<li><b>Abilities</b> alter your King’s core capabilities. Placed in your play area; each counts as a <b>technology of the colour</b> shown in its lower-right corner.</li>" +
          "<li><b>Unit upgrades</b> are laid over a unit on your faction sheet. Gain a second one for the same slot? Keep one and discard the other — except <b>mechs</b>, which can have several. They count as unit upgrade technologies with <b>no colour</b>.</li>" +
          "<li><b>Genomes</b> are the genetic material of the galaxy’s fallen species: placed faceup" + (veiled(c) ? " (Veiled Heart: facedown, like every spliced card)" : "") + " in your play area, <b>exhausted for an effect</b>, readied each round in the status phase.</li></ul>" +
          "<h4>Resolving a splice</h4><ol>" +
          "<li>The strategy card or effect that starts it names the <b>card type</b> and <b>who may participate</b>.</li>" +
          "<li>The initiating player draws and reveals <b>participants + 1</b> cards of that type" + (veiled(c) ? " (<b>Veiled Heart:</b> not revealed — they pass along facedown)" : "") + ", and keeps one.</li>" +
          "<li>The next participating player to their <b>right</b> keeps one, and so on until every participant has one.</li>" +
          "<li>Leftover cards are shuffled back into their deck. Not enough cards? Players who can’t take one get their command tokens and other costs refunded.</li>" +
          "<li>Instead of a card, a participant may gain one of their King’s <b>faction technologies</b>.</li></ol>" +
          "<h4>Discards</h4><ul><li>A discarded splice card is shuffled back into its deck; purged cards are not.</li></ul>";
      },
      src: function (c) { return "TF p.9–10" + (veiled(c) ? " · TF p.11" : ""); } },

    { id: "tf-technology", replace: "ref-tech", title: "Twilight’s Fall — faction technology, specialties & paradigms",
      when: function (c) { return uses(c) && tf(c); },
      html: function (c) {
        return "<h4>King technologies</h4><ul>" +
          "<li>Each King has two: a <b>wavelength</b> and an <b>antimatter</b> technology in their colour.</li>" +
          "<li>Gain one by taking it <b>instead of a card</b> when you take part in a splice (in the inaugural splice only at the final decision).</li>" +
          "<li>No prerequisites, <b>no colour</b>, and they can’t be lost.</li>" +
          "<li>Each has two abilities; the second is marked with the Prophecy of Kings icon and works only with PoK" + (c.has("pok") ? " (active in this game)" : " (inactive in this game)") + ".</li></ul>" +
          "<h4>Technology without a tech deck</h4><ul>" +
          "<li>Technology can’t be researched; <b>technology objectives</b> are met through ability cards.</li>" +
          "<li>When scoring objectives you may <b>exhaust planets with technology specialties</b>: each counts as one technology of that colour.</li>" +
          "<li>If an effect lets you <b>gain or research a technology</b>, you can take one of your King technologies instead; if you have both, you may gain <b>2 command tokens</b> instead.</li></ul>" +
          "<h4>Paradigms</h4><ul>" +
          "<li>Gained mainly through <b>Aeterna</b>: the fallen heroes of dying civilisations. Placed faceup" + (veiled(c) ? " (Veiled Heart: facedown)" : "") + " in your play area; generally <b>purged once used</b>.</li>" +
          "<li>Not splice cards: they <b>can’t be spliced, copied, exchanged or discarded</b> in any way.</li></ul>";
      },
      src: function (c) { return "TF p.9–10" + (veiled(c) ? " · TF p.11" : ""); } },

    { id: "tf-edicts", replace: "ref-agenda", title: "Benediction phase & edicts",
      when: function (c) { return uses(c) && tf(c); },
      html: function () {
        return "<ul>" +
          "<li>There is <b>no agenda phase</b> in Twilight’s Fall; the <b>benediction phase</b> replaces it — even if no one controls Mecatol Rex yet.</li>" +
          "<li>It is directed by the <b>tyrant</b>: the player holding the <b>benediction token</b> granted by the Tyrannus strategy card.</li>" +
          "<li>The tyrant draws <b>three edicts</b> and chooses <b>one</b> to resolve; unless an edict says otherwise, all three are then shuffled back into the edict deck.</li>" +
          "<li><b>No tyrant?</b> Skip the benediction phase.</li>" +
          "<li>Example edict, <b>“Bless”</b>: gain each of 1 command token, 2 action cards and 3 trade goods; then each other player chooses one of those to gain.</li></ul>";
      },
      src: function () { return "TF p.10"; } },

    { id: "tf-strategy-cards", replace: "ref-cards", title: "The Twilight’s Fall strategy cards",
      when: function (c) { return uses(c) && tf(c); },
      html: function () {
        return "<ol>" +
          "<li><b>Lux</b> — <i>Primary:</i> gain 3 command tokens; spend any amount of influence to gain 1 command token per 3 influence spent. <i>Secondary:</i> spend any amount of influence to gain 1 command token per 3 influence spent.</li>" +
          "<li><b>Noctis</b> — <i>Primary:</i> initiate a <b>genome splice</b>; ready up to 2 planets. <i>Secondary:</i> spend 1 strategy-pool token to participate in the genome splice.</li>" +
          "<li><b>Tyrannus</b> — <i>Primary:</i> choose a player other than the speaker — they gain the speaker token; choose a player other than the speaker or tyrant — they gain the <b>benediction token</b>; draw 2 action cards. <i>Secondary:</i> spend 1 strategy-pool token to draw 2 action cards.</li>" +
          "<li><b>Civitas</b> — <i>Primary:</i> either place 1 structure on a planet you control or use the PRODUCTION ability of 1 of your space docks; place 1 structure on a planet you control. <i>Secondary:</i> spend 1 strategy-pool token to place 1 structure on a planet you control.</li>" +
          "<li><b>Amicus</b> — <i>Primary:</i> gain 3 trade goods; replenish commodities; choose any number of other players — they use the secondary without spending a command token. <i>Secondary:</i> spend 1 strategy-pool token to replenish your commodities.</li>" +
          "<li><b>Calamitas</b> — <i>Primary:</i> initiate a <b>unit upgrade splice</b>; resolve the PRODUCTION abilities of your units in 1 system. <i>Secondary:</i> spend 1 strategy-pool token and 4 resources to either participate in the unit upgrade splice or use the PRODUCTION abilities of the units in your home system.</li>" +
          "<li><b>Magus</b> — <i>Primary:</i> initiate an <b>ability splice</b>; you may spend 3 resources and 3 influence to add 1 more ability to the pool — if you do, after each player has chosen it passes back to you and you take an additional ability. <i>Secondary:</i> spend 1 strategy-pool token and 3 resources or 3 influence to participate in the ability splice.</li>" +
          "<li><b>Aeterna</b> — <i>Primary:</i> immediately score 1 public objective if you fulfil its requirements, otherwise draw 1 <b>paradigm</b>; gain 1 victory point if you control Mecatol Rex, otherwise draw 1 secret objective. <i>Secondary:</i> spend 1 strategy-pool token to draw 1 secret objective or 1 paradigm.</li></ol>";
      },
      src: function () { return "TF p.10–11"; } },

    { id: "tf-capture-origin", title: "Twilight’s Fall — capture & faction origin",
      when: function (c) { return uses(c) && tf(c); },
      html: function () {
        return "<h4>Capture</h4><ul>" +
          "<li>A captured unit sits on the capturing player’s faction sheet until it is <b>returned</b>.</li>" +
          "<li>If at least one of your space docks is <b>blockaded</b>, you can’t capture units from the player blockading you.</li>" +
          "<li><b>Non-fighter ships and mechs:</b> placed on the capturer’s sheet; returned to the original owner’s reinforcements when the capturer agrees in a transaction, when an ability returns it (typically as a cost), or when the original owner blockades one of the capturer’s space docks.</li>" +
          "<li><b>Fighters and ground forces:</b> the unit goes back to its own reinforcements and the capturer puts a fighter or ground force <b>token from the supply</b> on their sheet instead. These belong to no player: never returned by transaction or blockade — only by an ability, and then to the supply.</li></ul>" +
          "<h4>Faction origin</h4><ul>" +
          "<li>Many Twilight’s Fall components have a <b>faction origin</b> — the standard faction they derive from — shown by the white icon in the card’s upper-right corner.</li>" +
          "<li>It has no effect on its own but may be referenced by other effects.</li></ul>";
      },
      src: function () { return "TF p.11"; } },

    { id: "tf-veiledheart", title: "Veiled Heart variant",
      when: function (c) { return uses(c) && tf(c) && veiled(c); },
      html: function () {
        return "<ul>" +
          "<li>All spliced cards and paradigms are gained <b>facedown</b> as secret information.</li>" +
          "<li>Cards drawn for splices — including the inaugural splice at setup — are <b>not revealed</b>: they stay secret and are passed to each successive player as they splice.</li>" +
          "<li>Facedown cards are not public information and their <b>effects are not active</b>.</li>" +
          "<li>You may reveal a facedown card <b>at any time</b>; its effect becomes active immediately — this can interrupt other game effects.</li></ul>";
      },
      src: function () { return "TF p.11"; } }
  ];

  /* ---------------- teaching-script inserts (module-file inserts go before the core "later") ---------------- */
  var teach = [
    /* Twilight's Fall — these replace core sections that don't hold in this mode (see notes) */
    { id: "tf-hook", replace: "hook", h: "Twilight’s Fall — who we are tonight",
      when: function (c) { return uses(c) && tf(c); },
      body: function (c) {
        return "<p>In this dark future each of us is a <b>Mahact King</b>, with a unique flagship" + (c.has("pok") ? " and mech" : "") + ", splicing a faction together as we go — the faction cards we drafted only set our seats, home systems and starting units. We still race to <b>" + (c.mod("vp14") ? "14" : "10") + " victory points</b> from objectives.</p>";
      } },
    { id: "tf-round", replace: "round", h: "The shape of a round",
      when: function (c) { return uses(c) && tf(c); },
      body: function (c) {
        return "<p>Rounds run as usual, except the agenda phase becomes the <b>benediction phase</b>; the new strategy cards set turn order" + (c.p <= 4 ? " (two each, with " + num(c.p) + " of us)" : "") + ", and the status phase also readies your genomes.</p>";
      } },
    { id: "tf-deals", replace: "diplomacy", h: "Deals and trade",
      when: function (c) { return uses(c) && tf(c); },
      body: function (c) {
        return "<p>Deals work as usual — trade goods and commodities" + (c.has("pok") ? " and relic fragments" : "") + " with your neighbours — but there are <b>no promissory notes</b> in this mode.</p>";
      } },
    { id: "tf-pok-leaders", replace: "pok-leaders", h: "Prophecy of Kings pieces in Twilight’s Fall",
      when: function (c) { return uses(c) && tf(c) && c.has("pok"); },
      body: function () {
        return "<p>With Prophecy of Kings: no leaders or standard mechs — your King’s <b>mech</b> is on its sheet and can take several unit upgrades — but exploration, relics and the Prophecy of Kings half of each King technology all work.</p>";
      } },
    { id: "tf-splice", after: "cards", h: "Splicing — the heart of Twilight’s Fall",
      when: function (c) { return uses(c) && tf(c); },
      body: function () {
        return "<p><b>Splicing</b> is the heart of it: whoever starts a splice reveals one card more than the number taking part, keeps one, and passes the rest to the right. <b>Abilities</b> count as technologies of their colour, <b>unit upgrades</b> cover a unit on your sheet, and <b>genomes</b> exhaust for an effect — or take one of your King’s two technologies instead of a card.</p>";
      } },
    { id: "tf-cards", replace: "cards", h: "The eight Twilight’s Fall strategy cards",
      when: function (c) { return uses(c) && tf(c); },
      body: function () {
        return "<p>The eight strategy cards are new: <b>Lux</b> gives command tokens; <b>Noctis</b>, <b>Calamitas</b> and <b>Magus</b> start genome, unit-upgrade and ability splices; <b>Tyrannus</b> hands out the speaker and <b>benediction</b> tokens; <b>Civitas</b> places structures; <b>Amicus</b> pays trade goods and commodities. <b>Aeterna</b> scores an objective or draws a paradigm — plus a point if you hold Mecatol Rex.</p>";
      } },
    { id: "tf-edicts", replace: "council", h: "No agendas — the tyrant and edicts",
      when: function (c) { return uses(c) && tf(c); },
      body: function () {
        return "<p>There’s no agenda phase or voting: in the <b>benediction phase</b> the <b>tyrant</b> — whoever holds the benediction token from Tyrannus — draws three edicts and resolves one, even before anyone takes Mecatol Rex. No tyrant, no benediction phase. Mecatol Rex still starts under the custodians: the first to land there pays six influence to remove their token and scores a point.</p>";
      } },
    { id: "tf-tech", after: "cards", h: "Technology without a tech deck",
      when: function (c) { return uses(c) && tf(c); },
      body: function () {
        return "<p>There’s no tech deck: abilities meet technology objectives, specialty planets can be exhausted to count as a technology when scoring, and any technology you’d gain becomes one of your King’s two — or two command tokens. <b>Paradigms</b>, mostly from Aeterna, are one-shot heroes you purge after use.</p>";
      } },
    { id: "tf-veiled", h: "Veiled Heart",
      when: function (c) { return uses(c) && tf(c) && veiled(c); },
      body: function () {
        return "<p>We’re playing <b>Veiled Heart</b>: everything we splice, and every paradigm, stays facedown and secret, and splice cards pass along unseen. A facedown card does nothing — but you can flip it at any moment, even to interrupt something.</p>";
      } },

    /* Thunder's Edge — standard game */
    { id: "te-expedition", h: "Thunder’s Edge — the expedition",
      when: function (c) { return uses(c) && std(c); },
      body: function () {
        return "<p>Thunder’s Edge adds a shared <b>expedition</b>: at the end of your turn you may pay one of its six costs to claim a slice, and each slice goes only once. Your first slice unlocks your faction’s <b>breakthrough</b>; the last one puts Thunder’s Edge on the board, with infantry from whoever holds the most slices.</p>";
      } },
    { id: "te-breakthrough", h: "Breakthroughs and The Fracture",
      when: function (c) { return uses(c) && std(c); },
      body: function () {
        return "<p>Breakthroughs add a faction power and <b>synergy</b> — two tech colours that can stand in for each other. But each new breakthrough rolls a die: on a 1 or 10, <b>The Fracture</b> opens beside the board, full of relics and guarded by neutral units.</p>";
      } },
    { id: "te-warfare", after: "cards", h: "Thunder’s Edge — the revised Warfare card",
      when: function (c) { return uses(c) && std(c); },
      body: function () {
        return "<p>Thunder’s Edge changes <b>Warfare</b>: its owner takes a tactical action anywhere <b>without placing a command token</b>, rearranging tokens before and after, and the secondary uses the production of your home system’s units. Construction is revised too — read the card.</p>";
      } },
    { id: "te-tiles", h: "Thunder’s Edge — new things on the map",
      when: function (c) { return uses(c); },
      body: function (c) {
        return "<p>Watch for new tiles: <b>entropic scars</b> switch off unit abilities inside them, and a <b>space station</b> is yours when only your ships are there — spend it like a planet, it raises your commodity value by one, and you can trade with any other station owner." +
          (c.has("pok") ? "" : " Two more things come with Thunder’s Edge even without Prophecy of Kings: gain a planet card with a <b>relic</b> icon and you draw a relic, and a <b>legendary</b> planet brings its ability card.") + "</p>";
      } },
    { id: "te-hyperlanes", replace: "galaxy", h: "Our galaxy — hyperlanes",
      when: function (c) { return uses(c) && hyperTE(c) && !teMap(c) && !otherBuild(c) && (c.mode === "standard" || tf(c)); },
      body: function (c) {
        return "<p>With " + num(c.p) + " of us the galaxy uses <b>hyperlanes</b>: any two systems joined by a hyperlane line are adjacent, and the hyperlane tiles themselves can’t hold anything." + (c.p === 5 ? " Because hyperlanes balance the seats, nobody got bonus trade goods for their starting position." : "") + "</p>";
      } },
    { id: "te-events", h: "Galactic events",
      when: function (c) { return uses(c) && c.mode === "standard"; },   // events are standard-game only here: the Codex IV module is too, and the scenarios use fixed maps (Codex I p.12, Codex IV pp.15, 18)
      body: function (c) {
        var g = geChosen(c), sub = !!c.mod("te-map-subjugation"), s;
        s = "<p>Thunder’s Edge also brings <b>galactic events</b>: optional cards chosen or drawn at setup that bend the rules for the whole game.";
        if (sub) s += " Tonight’s includes <b>Minor Factions</b> — it’s built into our map.";
        if (g && !(sub && g === "minorFactions")) s += " Tonight’s " + (sub ? "other event " : "") + "is <b>" + GE_NAMES[g] + "</b>: " + geTeach(g, c) + " I’ll read the card aloud now — it has the details.";
        else if (!g && geOn(c)) s += (sub ? " If we drew another event too, I’ll read that card aloud now" : " We’re playing with one tonight: I’ll read the card aloud now") + " — each card explains its own rules.";
        else if (!g && !sub) s += " If we’re using one, I’ll read it aloud now.";
        return s + "</p>";
      } },
    { id: "te-map-thunderdreaming", replace: "galaxy", h: "Our map: “Thunder Dreaming”",
      when: function (c) { return uses(c) && c.mod("te-map-thunderdreaming"); },
      body: function () {
        return "<p>We’re on <b>“Thunder Dreaming”</b>, a premade map from the Thunder’s Edge appendix — balanced for six newer players and packed with the new tiles, so nobody built it and every tile has its fixed place.</p>";
      } },
    { id: "te-map-subjugation", replace: "galaxy", h: "Our map: “Subjugation”",
      when: function (c) { return uses(c) && c.mod("te-map-subjugation"); },
      body: function () {
        return "<p>This is <b>“Subjugation”</b>, an amped-up Minor Factions game: the six factions nobody picked sit in the red spaces as <b>minor factions</b>, each guarded by three neutral infantry — control every planet in one and you take that faction’s alliance card.</p>";
      } },
    { id: "te-map-redvsblue", replace: "galaxy", h: "Our map: “Red vs Blue”",
      when: function (c) { return uses(c) && c.mod("te-map-redvsblue"); },
      body: function () {
        return "<p>It’s <b>“Red vs Blue”</b>: two against two — the two western seats against the two eastern seats — played as an alliance game, on a board with two hyperlane rings. Heads up: each team has only two kinds of technology specialty nearby.</p>";
      } },
    { id: "te-map-legendary", replace: "galaxy", h: "Our map: “Legendary”",
      when: function (c) { return uses(c) && c.mod("te-map-legendary"); },
      body: function () {
        return "<p>It’s <b>“Legendary”</b>, an off-balance six-player arena: the ring right around Mecatol Rex is all legendary planets, so the fight will be in the middle.</p>";
      } },
    { id: "te-alliance", h: "Alliances (Thunder’s Edge rules)",
      when: function (c) { return uses(c) && std(c) && alliance(c); },
      body: function (c) {
        return "<p>Tonight we play in <b>teams of two</b>: allies share systems without fighting, land on each other’s planets, carry and commit each other’s forces, join each other’s tactical actions and roll together — but your unit abilities never hit your ally" + (c.has("pok") ? ", and every commander starts unlocked" : "") + ". You can’t be eliminated while your partner holds a planet; to win, one of you needs <b>14</b> points and the other at least <b>10</b>.</p>";
      } },

    /* the "later" lists */
    { id: "te-later", h: "Thunder’s Edge — look these up when they happen",
      when: function (c) { return uses(c); },
      body: function (c) {
        return "<ul>" +
          "<li><b>Neutral units</b> — another player rolls for them, hits go to the unit lowest on their reference card first, and the speaker makes any choice for them.</li>" +
          "<li><b>Coexisting</b> units sharing a planet — no combat, special control rules.</li>" +
          "<li><b>Ingress and egress</b> tokens — how The Fracture connects to the galaxy.</li>" +
          "<li><b>Dual tech specialties</b> and dual planet traits.</li>" +
          (std(c) ? "<li>The <b>diplomacy token</b> — a shortcut for the Diplomacy card.</li>" : "") +
          "<li>One rule change: a <b>gravity rift</b> gives each ship its movement bonus only once.</li></ul>";
      } },
    { id: "tf-later", h: "Twilight’s Fall — look these up when they happen",
      when: function (c) { return uses(c) && tf(c); },
      body: function (c) {
        return "<ul>" +
          (c.has("pok") ? "" : "<li><b>Capturing</b> units — the reference has the return rules.</li>") +
          "<li>The <b>faction origin</b> icon in a card’s corner — it does nothing on its own.</li>" +
          "<li>A splice that <b>runs out of cards</b> — you get your tokens and costs back.</li>" +
          "<li>The second ability on each King technology, marked with the <b>Prophecy of Kings icon</b> — " + (c.has("pok") ? "it works in our game." : "it’s switched off in our game.") + "</li>" +
          "<li>The <b>Echo cards</b>, if someone took the Creuss or Crimson Rebellion home system.</li></ul>";
      } }
  ];

  /* ---------------- notes for the integrator ---------------- */
  var notes = [
    "SOURCES & PAGES: TE and TF citations are printed page numbers (PDF page index + 1; each cover is p.1). Maps (TE pp.14–15), the neutral unit card (TE p.10), the TF strategy card overview (TF pp.10–11), the Bless edict (TF p.10), the Advent of the War Sun event (TE p.6) and the revised Warfare card (TE p.5) were read from renders at 250–1200 dpi.",
    "WHAT TE REPLACES (the page shows the TE rule and cites both): (1) Construction and Warfare strategy cards are replaced (TE p.4). Revised Warfare, read from the card photo on TE p.5: primary = perform a tactical action in any system without placing a command token, even if it already has yours (it still counts as activated), redistributing command tokens before and after; secondary = spend 1 strategy token to use the PRODUCTION abilities of the units in your home system. Supersedes LRR §99 (p.37) and the LRR FAQ ruling that Warfare's secondary can't trigger Letani Warriors (p.43). Revised Construction is only partly visible (hidden behind Warfare) — the page says 'use the printed card'. CORE (agent A): ref-cards and the core teach 'cards' still describe the old Warfare, and ref-faction-rulings has the Letani ruling — gate them on !c.has('te') or point to te-strategy-cards. (2) Gravity rift movement bonus once per ship (TE p.16) vs LRR §41.3 p.19 — A's ref-anomalies already carries it. (3) Mecatol Rex tile -> the one with a legendary planet icon (TE p.4; numbered 112 on TE's maps). (4) Jol-Nar 'Ta Zern' -> 'Agnlan Oln' (with PoK). (5) Without PoK: remove leaders, mechs, exploration cards and the 'Cultural Exchange Program' event. (6) TE's revised Codex cards replace the Codex I–III print-and-play components, and TE's Alliance/Faction Reference sets replace Codex II's (TE p.4). (7) Five players: TE p.7/p.12 set the galaxy up with hyperlanes using TE's own tiles 119A–124A (same layout as the LRR/PoK five-player hyperlane board; PoK not needed). (8) Four players WITH PoK: TE's hyperlane board (3 blue + 2 red each, two hyperlane rings) replaces the LRR four-player deal (5 blue + 3 red).",
    "GALAXY (core c.galaxy / c.mod('gal-<id>')): the core builds the TE hyperlane boards itself (galaxy builds hyper4 and TE-aware hyper5; 'deal' unavailable at 5p and 4p+PoK when te is on), so this file does not replace setup step 6 for them. It adds te-hyperlane-tiles just BEFORE step 6 (anchor lrr-setup-5; audit 2 moved it there so the table knows the tile numbers before step 6 places the hyperlanes) (standard mode, te && (p===5 || p===4&&pok), no TE map/other build): the tile positions (read from TE's 'Red vs Blue' map) and, for four players, the second-ring tile question below. Teach te-hyperlanes and te-map-* carry replace:'galaxy'. MAPS: each te-map-* excludes the map-type core builds (gal-premade, gal-large, gal-alt, gal-ltp), the Codex presets (rightCatSoup, paxPresets) and the other TE maps. It deliberately does NOT exclude the plain builds gal-deal / gal-hyper4 / gal-hyper5: app.js normalize() deletes a module that excludes every available build (no alternative left — so a map excluding them could never be switched on). With a TE map on, te-board-map replaces step 6 (galaxyFrom 'option'), the remaining plain build is shown as superseded, and the core 'Our galaxy' teach is hidden — so only one map source is ever active. If the integrator changes normalize() to keep a module whose excludes cover every build, the plain builds can be added to MAP_EXCLUDES. In Twilight's Fall, draft step ③ builds the galaxy itself (standard build with TE rules, TE hyperlane layout, a TE map, or the core premade/large/alternate build) because core step 6 is replaced there.",
    "FOUR-PLAYER HYPERLANE TILES (open question for Joe): TE p.7 says its layouts always use 119A–124A, but the four-player diagram has TWO six-tile rings (12 hyperlane spaces) and 'is used only when also playing with PoK'. TE's own four-player map 'Red vs Blue' (p.15) builds the upper ring from PoK 83A–88A and the lower ring from 119A–124A; the page presents the setup that way and says so. Audit 1: RvB's upper ring is exactly PoK p.9's numbered 83A–88A formation (85A next to Mecatol, 86A far side, 87A/88A beside the ring's centre, 83A/84A outer) rotated 180°, and its lower ring maps 83A→119A … 88A→124A position for position — so the reading is well supported.",
    "INTERNAL TE CONFLICT: Last Bastion Galvanize tokens — 8 in the setup text (TE p.6), 7 in the component list (TE p.5); neither picture shows a count. The page shows both and says to take all of them.",
    "RED VS BLUE prints tile 18 (base-game Mecatol Rex) in the centre although TE's integration replaces that tile (the other three TE maps show TE's tile 112); the page notes it. The seat name 'If I Only Had A…' ends in the blue technology-specialty icon — written as '[blue tech icon]'.",
    "SUBJUGATION: TE p.14 lists its twelve factions only as faction SYMBOLS. Audit 1 matched each against symbols printed beside faction names elsewhere in the sources (LtP p.6; Codex I p.12; Codex IV p.17; PoK p.7 Titans sheet; TE p.5–6 Crimson/Deepwrought/Ral Nel/Last Bastion cards; Codex III p.17 Keleres note) — top row Arborec, Letnev, Sardakk N'orr, Nekro, Nomad, Titans of Ul; bottom row Crimson Rebellion, Deepwrought, Firmament/Obsidian (by elimination), Last Bastion, Ral Nel, Keleres — and te-subjugation-factions now names them, flagged as identified from the symbols. The map's Minor Factions setup is FOLDED INTO the map preset (te-board-map + te-subjugation-factions): red spaces at random, Keleres/Firmament/Creuss/Crimson rules (TE p.14, p.16), 3 neutral infantry per minor faction system, not home systems, all three traits, alliance card for controlling every planet (Codex IV p.15 wording, flagged as superseded by TE's printed card where it differs). No module-to-module requirement is needed. CODEX (agent B): gate ge-minor-factions (the dealt-galaxy Minor Factions setup) with && !c.mod('te-map-subjugation'), and have B's activePreset() treat TE maps as presets. Standard mode only (TF p.6 boxes galactic events).",
    "ALLIANCE VARIANT — TE's version is complete in this file and shows whenever te is on with the 'alliance' module (p = 4, 6 or 8): setup steps te-alliance-allies (after lrr-setup-2: allies, reference cards, Mahact fleet-pool token), te-alliance-commanders (after lrr-setup-4, PoK only: purge 'Alliance' notes, unlock commanders), te-alliance-track (after lrr-setup-12: 14-point track, 14 + 10 to win); reference te-alliance (setup, transactions, movement & control, combat & unit abilities, abilities & effects, elimination, winning — every TE p.13 rule, with the Codex II differences flagged); teach te-alliance (self-contained). Nothing is taken from Codex II. CODEX (agent B): gate alliance-pairs / alliance-cards / alliance-track / alliance-ref and B's 'Alliances' teach with !c.has('te'); make the 'alliance' module available with codex2 OR te (requires: [['codex2','te']]) since TE prints the variant. Differences TE makes (TE p.13 vs Codex II p.13): reference card taken at step 2; NEW Mahact note; purge/unlock only with PoK (Codex II mislabels it 'step 3 Choose Color' — LRR step 4); land on planets your ally CONTROLS (Codex II: 'that contain your ally's ground forces'); 'transport, support and commit' (Codex II: transport); NEW: activation triggers don't fire between allies; NEW: unit abilities don't affect your ally; NEW: agents can be used on your ally; ally planets don't count for objectives or the Imperial point (Codex II: objectives or unlocking leaders).",
    "GALACTIC EVENTS — one TE version for the generic parts: with te on, my te-galactic-event step (after lrr-setup-1: choose/draw after the speaker is determined, events may modify setup, several allowed, no-PoK rules; names the event chosen in B's 'galacticEvents' module) and te-events teach always show, and te-galactic-events (reference) carries TE's general rules and TE p.16 clarifications. What I RELY ON from agent B when codex4's module is also on: the four Codex IV event texts, which TE's rulebook doesn't print — keep B's ge-minor-factions (setup, already TE-aware; gate it off under te-map-subjugation) and galactic-events-ref (rules). B should gate ge-pick and its 'Galactic event' teach insert with !c.has('te') (my step/teach replace them). While B's module is on, te-galactic-events points to B's section instead of repeating the Minor Factions / Age of Exploration clarifications. TE vs Codex IV: event chosen at step 1 (TE p.6); Age of Exploration and Wild, Wild Galaxy playable WITHOUT PoK (TE p.16; Codex IV p.16 said Age of Exploration requires PoK — TE wins); Cultural Exchange Program removed without PoK (TE p.4); TE p.7 minor-faction example and TE p.16 Creuss/Crimson clarification; neutral forces are TE's plastic neutral units with the TE p.10 rules (Codex IV p.15: proxies, combat 8 — consistent). Galactic events aren't used in Twilight's Fall (TF p.6).",
    "TWILIGHT'S FALL ANCHORS: TF p.7 replaces setup steps 1–6 with a six-step draft, mapped one-to-one: tf-draft-1..6 = 'lrr-setup-1:replace' … 'lrr-setup-6:replace' (draft ③ builds the galaxy itself: standard build with TE rules, TE hyperlane layouts, TE maps, or the core premade/large/alternate builds, plus the Fracture set-aside). Also :replace 8 (TF decks), 10 (TF strategy cards), 11 (no starting tech) and 'play:replace' (round structure with the benediction phase); after 7 (space-station frontier token, PoK), after 9 (benediction/Singularity tokens), 'end' (step 13 inaugural splice — the final setup step, before 'Begin play'), 'start' (components in/out). Codex-file steps anchored after core steps 1–6 would still render after my replacements in TF mode — B's are all standard-mode gated.",
    "TWILIGHT'S FALL vs CORE CONTENT: my TF teach entries replace the core 'hook', 'round', 'cards', 'council', 'diplomacy' and 'pok-leaders' sections, and my TF reference entries replace 'ref-cards', 'ref-agenda' and 'ref-tech' (each only while its when(c) is true, per the core app's replace semantics). Still worth gating in core for TF mode: teach 'actions' ('your leaders' among component actions), reference 'ref-leaders', 'ref-mechs' (standard mechs) and the promissory-note parts of 'ref-diplomacy'.",
    "TWILIGHT'S FALL gaps, flagged on the page: (a) the draft doesn't mention home planet cards (LRR step 5, which it replaces) — tf-draft-5 says so; (b) the draft doesn't mention the command sheet, but step 11 still fills tactic/fleet/strategy pools — tf-draft-4 says so; (c) premade-map NOTE: 'the lowest priority player claims … with the speaker choosing last' although the speaker holds the lowest priority NUMBER (step 2) — the only consistent reading is 'lowest priority' = highest number, claims running down to the speaker; tf-draft-2 says so and flags the wording; (d) TF prints no player counts (8 Kings/colours; without PoK the pink and orange Kings use unused plastic) — no min/max on the mode; (e) TF's not-used list omits The Fracture tiles ('all other components are compatible'), so draft ③ keeps TE's 'set aside The Fracture' — in TF it can only enter through other abilities.",
    "VP TRACK IN TF: Twilight's Fall keeps setup step 12 (10- or 14-point track). The core 'vp14' option is limited to modes ['standard'] — allow it in 'twilightsfall' too (my TF hook reads c.mod('vp14')).",
    "MODES: TE setup additions show in every non-TF mode except the core 'firstgame' (base-only) — including B's Ordinian/Liberation scenarios if te is on (neither Codex scenario mentions TE); among those modes the 4/5-player TE hyperlane step and the TE map steps show in the standard mode only (Twilight's Fall builds both in draft ③). 'Red vs Blue' is offered in the standard game only (audit 1): TE p.15 makes it a 2v2 Alliance-variant map, and the Alliance variant (TE p.13, written against standard setup steps 2 and 4) is standard-only on this page.",
    "DUPLICATES WITH CORE: A's ref-anomalies (gravity rift), ref-abilities (TE ability-window clarification) and ref-sources (TE -> online LRR note) already mention TE; te-clarifications and te-lrr-note repeat them in TE context — keep one copy if preferred. te-relics (after lrr-setup-8) shows only WITHOUT PoK (A's step 8 already shuffles the relic deck with PoK).",
    "LIVING RULES REFERENCE: TE p.16 points players to the LRR online. The LRR in the sources is v2.0 (09/22/20), which predates TE; any later online LRR is not reflected. te-lrr-note says so on the page.",
    "FACTIONS: TE's six new factions, breakthroughs and faction mechanics appear only where the rulebook states rules (setup components, p.16 clarifications); link to the site's Faction Reference (../../ti.html) for sheets."
  ];

  return { sets: sets, modes: modes, modules: modules, steps: steps, reference: reference, teach: teach, notes: notes };
})();
