/* =============================================================================
   Terraforming Mars — Setup & Reference Utility · MarsBot Automa module
   Defines one global, TM_AUTOMA = { sets, modes, modules, steps, reference, teach, notes }
   (TM_PLAN.md "Module-file contract"; app.js merges it).

   Sources (cited with PRINTED page numbers; in all three Automa books folio = PDF page):
     Automa A — core MarsBot rules (file dated 08-15-2023; folios on pp.2–11, cover and credits unnumbered)
     Automa B — Adding Corporations (08-15-2023; folios pp.1–4)
     Automa C — Adding Expansions (11-14-2023; folios pp.1–16)
   All three print "© 2024 Indie Game Studios". The Base and expansion rulebooks are used only for
   cross-references: Base and Turmoil print folios (= PDF page); Venus, Colonies, Prelude, Prelude 2 and
   M&A print none, so they are cited by PDF page; the map wraps are single sheets ("H&E wrap" etc.).
   Precedence: Automa C (newest) adjusts Automa A/B for expansion play. Where a 2024 map wrap or the
   M&A rulebook names or defines a milestone/award differently from Automa C, the page uses the
   printed tile name and flags the difference (see notes).
   Not covered by the books (the page says so and invents nothing): Amazonis Planitia (no MarsBot board,
   reference card or Corporate Competition card) and Prelude played without its Prelude cards.
   Icon-based values (tracks, tags) were read from 200+ dpi renders of every page (audit 1c, Sept 2026).
   ============================================================================= */
var TM_AUTOMA = (function () {
  "use strict";

  /* ------------------------------------------------------------ context helpers */
  function has(c, id) { try { return !!(c && typeof c.has === "function" && c.has(id)); } catch (e) { return false; } }
  function modv(c, id) { try { return c && typeof c.mod === "function" ? c.mod(id) : false; } catch (e) { return false; } }
  function on(c, id) { return !!modv(c, id); }
  /* c.choice(moduleId) per the contract; falls back to c.mod(moduleId) returning the choice id (TI4 style) */
  function choiceOf(c, id) {
    var v = null;
    try { if (c && typeof c.choice === "function") v = c.choice(id); } catch (e) { v = null; }
    if (!v) { var m = modv(c, id); if (typeof m === "string") v = m; }
    return v || null;
  }
  function am(c) { return !!c && c.mode === "automa"; }
  function venus(c) { return has(c, "venus"); }
  function colonies(c) { return has(c, "colonies"); }
  function turmoil(c) { return has(c, "turmoil"); }
  function prelude(c) { return has(c, "prelude") || has(c, "prelude2"); }
  function prelude2(c) { return has(c, "prelude2"); }
  /* Prelude cards in use (A option "prelude-nocards" = Prelude without its Prelude cards, Prelude p.2) */
  function pcards(c) { return prelude(c) && !on(c, "prelude-nocards"); }
  /* Prelude without its Prelude cards: the Automa books don't mention this variant, so the page shows both the
     standard MarsBot figures and Automa C p.1's Prelude ones and lets the players choose */
  function pnc(c) { return prelude(c) && on(c, "prelude-nocards"); }
  function ma(c) { return has(c, "ma"); }
  function corps(c) { return on(c, "mb-corps"); }
  function draft(c) { return on(c, "draft"); }                 /* A's Draft variant option id */

  var LEVELS = ["normal", "easy", "hard", "brutal"];
  var LEVEL_NAMES = { normal: "Normal", easy: "Easy", hard: "Hard", brutal: "Brutal" };
  function level(c) {
    var v = choiceOf(c, "mb-difficulty");
    var k = v ? String(v).replace(/^mb-/, "") : "normal";
    return LEVELS.indexOf(k) >= 0 ? k : "normal";
  }
  function easy(c) { return level(c) === "easy"; }
  function hard(c) { var l = level(c); return l === "hard" || l === "brutal"; }
  function brutal(c) { return level(c) === "brutal"; }
  function failMC(c) { return easy(c) ? 3 : 5; }
  /* Turmoil "Increasing the Difficulty" (Automa C p.7): tr7 | del1 | del2, or null */
  function tmHarder(c) {
    if (!turmoil(c) || !on(c, "mb-turmoil-harder")) return null;
    var v = choiceOf(c, "mb-turmoil-harder");
    var k = v ? String(v).replace(/^mb-tm-/, "") : "tr7";
    return ["tr7", "del1", "del2"].indexOf(k) >= 0 ? k : "tr7";
  }
  function mbStartTR(c) { if (!turmoil(c)) return 20; return tmHarder(c) === "tr7" ? 13 : 10; }
  function lossGen(c) { return pcards(c) ? 18 : 20; }
  /* "generation <b>20</b>", or both figures for Prelude without Prelude cards */
  function lossHtml(c) { return pnc(c) ? "<b>20</b> (<b>18</b> if you use MarsBot's Prelude changes; see <i>Prelude</i>)" : "<b>" + lossGen(c) + "</b>"; }

  /* ------------------------------------------------------------ maps and MarsBot boards */
  var MAP_NAMES = { tharsis: "Tharsis", hellas: "Hellas", elysium: "Elysium", cimmeria: "Terra Cimmeria",
    utopia: "Utopia Planitia", vastitas: "Vastitas Borealis", amazonis: "Amazonis Planitia" };
  function mapId(c) { var m = c && c.map; return (m && Object.prototype.hasOwnProperty.call(MAP_NAMES, m)) ? m : "tharsis"; }
  function mapName(c) { return MAP_NAMES[mapId(c)]; }
  function amz(c) { return mapId(c) === "amazonis"; }
  /* MarsBot board + board reference card in use: the map's own (Automa A p.3, C p.8); with the M&A tiles, Tharsis
     "regardless of which board you are using" (Automa C p.13). The box has boards for six maps and none for Amazonis
     Planitia (Automa A p.2, C p.8), so without the M&A tiles there is no board there: boardId is null. */
  function boardId(c) { if (ma(c)) return "tharsis"; return amz(c) ? null : mapId(c); }
  function boardName(c) { var b = boardId(c); return b ? MAP_NAMES[b] : ""; }
  function noBoard(c) { return amz(c) && !ma(c); }
  var SIX_MAPS = "Tharsis, Hellas, Elysium, Terra Cimmeria, Utopia Planitia and Vastitas Borealis";

  /* which track each tag advances (Automa A p.3 board diagram and pp.7–9 icons; Automa C p.8 pairings) */
  var BIO = "plant/microbe/animal";
  var PAIRS = {
    tharsis: { building: "building", space: "space", event: "event", science: "science", energy: "energy/Jovian", jovian: "energy/Jovian",
      earth: "Earth/city", city: "Earth/city", plant: BIO, microbe: BIO, animal: BIO },
    hellas: { building: "building", space: "space", event: "event", science: "science/Jovian", energy: "energy", jovian: "science/Jovian",
      earth: "Earth/city", city: "Earth/city", plant: BIO, microbe: BIO, animal: BIO },
    cimmeria: { building: "building", space: "space", event: "event", science: "science/city", energy: "energy", jovian: "Earth/Jovian",
      earth: "Earth/Jovian", city: "science/city", plant: BIO, microbe: BIO, animal: BIO },
    vastitas: { building: "building", space: "space", event: "event", science: "science/microbe", energy: "energy/city", jovian: "Earth/Jovian",
      earth: "Earth/Jovian", city: "energy/city", plant: "plant/animal", microbe: "science/microbe", animal: "plant/animal" }
  };
  PAIRS.utopia = PAIRS.tharsis;
  PAIRS.elysium = PAIRS.hellas;
  /* with no MarsBot board (Amazonis without the M&A tiles), the generic track names Automa A p.5 and C p.4 print */
  var GENERIC_TRK = { building: "building", space: "space", event: "event", science: "science", energy: "energy", jovian: "Jovian",
    earth: "Earth", city: "city", plant: "plant", microbe: "microbe", animal: "animal" };
  function trk(c, tag) { var b = boardId(c); return (b ? PAIRS[b][tag] : GENERIC_TRK[tag]) + " track"; }
  function cap(s) { return s.charAt(0).toUpperCase() + s.slice(1); }

  /* track table rows: [track, tags, production decrease that moves it back (Automa A pp.4–5)] */
  var ROWS = {
    tharsis: [["Building", "building", "steel"], ["Space", "space", "titanium"], ["Event", "event", "M€"], ["Science", "science", "—"],
      ["Energy / Jovian", "energy (power), Jovian", "energy"], ["Earth / City", "Earth, city", "heat"], ["Plant / Microbe / Animal", "plant, microbe, animal", "plants"]],
    hellas: [["Building", "building", "steel"], ["Space", "space", "titanium"], ["Event", "event", "M€"], ["Science / Jovian", "science, Jovian", "—"],
      ["Energy", "energy (power)", "energy"], ["Earth / City", "Earth, city", "heat"], ["Plant / Microbe / Animal", "plant, microbe, animal", "plants"]],
    cimmeria: [["Building", "building", "steel"], ["Space", "space", "titanium"], ["Event", "event", "M€"], ["Science / City", "science, city", "—"],
      ["Energy", "energy (power)", "energy"], ["Earth / Jovian", "Earth, Jovian", "heat"], ["Plant / Microbe / Animal", "plant, microbe, animal", "plants"]],
    vastitas: [["Building", "building", "steel"], ["Space", "space", "titanium"], ["Event", "event", "M€"], ["Science / Microbe", "science, microbe", "—"],
      ["Energy / City", "energy (power), city", "energy"], ["Earth / Jovian", "Earth, Jovian", "heat"], ["Plant / Animal", "plant, animal", "plants"]]
  };
  ROWS.utopia = ROWS.tharsis;
  ROWS.elysium = ROWS.hellas;
  var PAIR_CHANGES = {
    hellas: "Jovian tags go on the science track, not the energy track as on Tharsis.",
    elysium: "Jovian tags go on the science track, not the energy track as on Tharsis.",
    cimmeria: "Jovian tags go on the Earth track (not energy), and city tags on the science track (not Earth).",
    vastitas: "Microbe tags go on the science track (not plant/animal), city tags on the energy track (not Earth), and Jovian tags on the Earth track (not energy)."
  };

  /* ------------------------------------------------------------ HTML helpers */
  function li(x) { return "<li>" + x + "</li>"; }
  function ul(items) { var a = items.filter(Boolean); return a.length ? "<ul>" + a.map(li).join("") + "</ul>" : ""; }
  function ol(items) { var a = items.filter(Boolean); return a.length ? "<ol>" + a.map(li).join("") + "</ol>" : ""; }
  function p(x) { return x ? "<p>" + x + "</p>" : ""; }
  function h(x) { return "<h4>" + x + "</h4>"; }
  function note(x) { return x ? "<p class='inline-note'>" + x + "</p>" : ""; }
  /* rows: arrays of cells, or {cells:[...], cls:"is-current"}; the first cell is the row header */
  function tbl(head, rows, cls) {
    var body = rows.filter(Boolean).map(function (r) {
      var cells = Array.isArray(r) ? r : r.cells;
      var rc = Array.isArray(r) ? "" : (r.cls ? " class='" + r.cls + "'" : "");
      return "<tr" + rc + ">" + cells.map(function (x, i) { return i === 0 ? "<th scope='row'>" + x + "</th>" : "<td>" + x + "</td>"; }).join("") + "</tr>";
    }).join("");
    return "<div class='tbl-wrap'><table class='tbl" + (cls ? " " + cls : "") + "'><thead><tr>" +
      head.map(function (x) { return "<th scope='col'>" + x + "</th>"; }).join("") + "</tr></thead><tbody>" + body + "</tbody></table></div>";
  }
  /* citations: merge "Automa C p.2", "Automa C pp.4–5" … into "Automa C pp.2, 4–5", keeping first-mention order of books */
  function join() {
    var parts = [], order = [], pages = {};
    for (var i = 0; i < arguments.length; i++) { if (arguments[i]) parts = parts.concat(String(arguments[i]).split(" · ")); }
    parts.forEach(function (s) {
      s = s.trim();
      if (!s) return;
      var m = s.match(/^(.*?)(?: pp?\.(.+))?$/), label = m[1];
      if (!pages[label]) { pages[label] = []; order.push(label); }
      if (m[2]) m[2].split(/,\s*/).forEach(function (t) { if (pages[label].indexOf(t) < 0) pages[label].push(t); });
    });
    function inRange(n, r) { var b = r.split("–").map(Number); return r.indexOf("–") > 0 && n >= b[0] && n <= b[1]; }
    return order.map(function (label) {
      var a = pages[label].slice().sort(function (x, y) { return parseInt(x, 10) - parseInt(y, 10) || x.length - y.length; });
      a = a.filter(function (t) { return t.indexOf("–") > 0 || !a.some(function (r) { return inRange(parseInt(t, 10), r); }); });
      if (!a.length) return label;
      return label + ((a.length > 1 || a[0].indexOf("–") > 0) ? " pp." : " p.") + a.join(", ");
    }).join(" · ");
  }
  function listAnd(a) { a = a.filter(Boolean); return a.length < 2 ? (a[0] || "") : a.slice(0, -1).join(", ") + " and " + a[a.length - 1]; }

  /* ------------------------------------------------------------ milestones & awards data */
  /* Tharsis — Automa A pp.7–9 */
  function thMilestones(c) {
    return [
      ["Terraformer", "Unchanged: reaches 35 TR." + (turmoil(c) && mapId(c) === "tharsis" && !ma(c) ? " With Turmoil's 26 TR tile, which the Automa books don't mention, this page reads “unchanged” as 26 TR." : "")],
      ["Mayor", "Unchanged: has placed 3 city tiles."],
      ["Gardener", "Unchanged: has placed 3 greenery tiles."],
      ["Builder", "Building track has reached space 8."],
      ["Planner", venus(c) ? "Space 4 on every track except Venus." : "Space 4 on every track."]
    ];
  }
  var TH_AWARDS = [
    ["Landlord", "Unchanged: number of owned tiles in play."],
    ["Banker", "Building track + event track."],
    ["Scientist", "Science track."],
    ["Thermalist", "Energy/Jovian track + 5."],
    ["Miner", "Space track + 5."]
  ];
  var TH_HELP = [
    ["Landlord", "Place a greenery tile, raising oxygen and TR as normal; all MarsBot placement rules and tiebreakers apply."],
    ["Banker", "Advance the building or event track, whichever is less advanced (building if tied)."],
    ["Scientist", "Advance the science track."],
    ["Thermalist", "Advance the energy/Jovian track."],
    ["Miner", "Advance the space track."]
  ];
  var VENUS_NOTE = " (MarsBot's Venus track comes with Venus Next.)";
  /* Hellas, Elysium, Terra Cimmeria, Utopia Planitia, Vastitas Borealis — Automa C pp.9–10, 12 */
  var MAPDATA = {
    hellas: {
      ms: function (c) { return [
        ["Diversifier", venus(c) ? "Space 3 on 7 of its 8 tracks (Venus can stand in for one)." : "At least space 3 on every track."],
        ["Tactician", "Has at least 35 M€."],
        ["Polar Explorer", "Unchanged: owns 3 tiles on the two bottom rows."],
        ["Energizer", "Energy track at space 6 or higher."],
        ["Rim Settler", "Science/Jovian track at space 6 or higher."]
      ]; },
      aw: [
        ["Cultivator", "Unchanged: greenery tiles."],
        ["Magnate", "Unchanged: green cards in MarsBot's played pile."],
        ["Space Baron", "Space track."],
        ["Excentric", "Every 5 M€ counts as 1 resource. (Automa C and MarsBot's Hellas reference card spell it “Eccentric”.)"],
        ["Contractor", "Building track."]
      ],
      help: [
        ["Cultivator", "Place a greenery tile and raise oxygen 1 step."],
        ["Magnate", "Reveal project cards until a green card turns up; resolve it and discard the rest."],
        ["Space Baron", "Advance the space track."],
        ["Excentric", "<b>You</b> must remove your highest-scoring animal/microbe cube from a card in your tableau, if possible."],
        ["Contractor", "Advance the building track."]
      ]
    },
    elysium: {
      ms: function (c) { return [
        ["Generalist", venus(c) ? "Space 2 on every track except Venus." : "At least space 2 on every track."],
        ["Specialist", "Any one track at space 10 or higher."],
        ["Ecologist", "Plant/microbe/animal (bio) track at space 4 or higher."],
        ["Tycoon", "Unchanged: 15 green/blue cards in MarsBot's played pile."],
        ["Legend", "Unchanged: 5 red cards in MarsBot's played pile."]
      ]; },
      aw: [
        ["Celebrity", "As usual (cards costing 20 M€ or more), but MarsBot counts its events; you don't count yours."],
        ["Industrialist", "Energy track + 5. Your value: your steel, your steel production and your energy production (not your energy, which can't be kept)."],
        ["Desert Settler", "Unchanged: tiles in the four bottom rows."],
        ["Estate Dealer", "Unchanged: tiles next to ocean tiles."],
        ["Benefactor", "Its TR − 15."]
      ],
      help: [
        ["Celebrity", "Reveal project cards until one costing 20 M€ or more; resolve it and discard the rest."],
        ["Industrialist", "Advance the energy track."],
        ["Desert Settler", "Place a greenery tile in the Southern Region and raise oxygen 1 step; impossible if it can't legally place one there."],
        ["Estate Dealer", "Place a greenery tile next to an ocean and raise oxygen 1 step; impossible if it can't legally place one there."],
        ["Benefactor", "MarsBot raises its TR 2 steps."]
      ]
    },
    cimmeria: {
      ms: function (c) { return [
        ["Planetologist", "Earth/Jovian track + Venus track together at 5 or higher." + (venus(c) ? "" : VENUS_NOTE)],
        ["Architect", "Science/city track at space 6 or higher."],
        ["Coastguard", "Unchanged: 3 tiles next to ocean tiles."],
        ["Forester", "Plant/microbe/animal track at space 10 or higher."],
        ["Fundraiser", "Event track at space 10 or higher. (Automa C and MarsBot's Terra Cimmeria reference card call it “Financier”.)"]
      ]; },
      aw: [
        ["Electrician", "Energy track."],
        ["Founder", "Unchanged, but the Neural Instance tile counts as a special tile for MarsBot (not for you)."],
        ["Mogul", "Its most advanced track's space × 2."],
        ["Zoologist", "Plant/microbe/animal track + 5."],
        ["Forecaster", "Every 7 M€ counts as 1 card with a requirement."]
      ],
      help: [
        ["Electrician", "Advance the energy track."],
        ["Founder", "Place a city tile (usual restrictions) next to a special tile, the Neural Instance included; impossible if it can't legally do so."],
        ["Mogul", "Advance its most advanced track (the topmost of any tied ones)."],
        ["Zoologist", "Advance the plant/microbe/animal track, as if an animal tag was resolved."],
        ["Forecaster", "Reveal project cards until one with a requirement; resolve it. This helper doesn't cost MarsBot the 5 M€."]
      ]
    },
    utopia: {
      ms: function (c) { return [
        ["Manager", "3 or more MarsBot bonus cards have been destroyed. (Automa C and MarsBot's Utopia Planitia reference card call it “Specialist”.)"],
        ["Pioneer", "Unchanged: 3 colonies in play."],
        ["Trader", "Energy/Jovian, Earth/city and Venus tracks all at space 2 or higher." + (venus(c) ? "" : VENUS_NOTE)],
        ["Metallurgist", "Building track + space track together at 7 or higher."],
        ["Researcher", "Science track at space 4 or higher."]
      ]; },
      aw: [
        ["Suburbian", "Unchanged: tiles along the map's edge."],
        ["Investor", "Earth/city track."],
        ["Botanist", "Plant/microbe/animal track − 2."],
        ["Incorporator", "As usual (cards costing 10 M€ or less), but MarsBot counts its events; you don't count yours."],
        ["Metropolist", "Unchanged: city tiles."]
      ],
      help: [
        ["Suburbian", "Place a greenery tile on an edge space and raise oxygen 1 step; impossible if it can't legally place one there."],
        ["Investor", "Advance the Earth track (Earth/city)."],
        ["Botanist", "Advance the plant track (plant/microbe/animal)."],
        ["Incorporator", "Reveal project cards until one costing 10 M€ or less; resolve it and discard the other revealed cards."],
        ["Metropolist", "Place a city tile."]
      ]
    },
    vastitas: {
      ms: function () { return [
        ["Agronomist", "Plant/animal track at space 4 or higher."],
        ["Engineer", "Earth/Jovian track + energy/city track together at 10 or higher."],
        ["Spacefarer", "Space track at space 5 or higher."],
        ["Geologist", "Unchanged: 3 tiles on or next to volcanic areas."],
        ["Farmer", "Science/microbe track or plant/animal track at space 6 or higher."]
      ]; },
      aw: [
        ["Traveller", "Earth/Jovian track + 5."],
        ["Landscaper", "Unchanged: largest group of connected tiles."],
        ["Highlander", "Unchanged: tiles not next to ocean."],
        ["Promoter", "Event track."],
        ["Blacksmith", "Building track or space track, whichever is more advanced."]
      ],
      help: [
        ["Traveller", "Advance the Jovian track (Earth/Jovian)."],
        ["Landscaper", "Place a greenery tile and raise oxygen 1 step."],
        ["Highlander", "Place a greenery tile not next to an ocean or an ocean-reserved space, and raise oxygen 1 step; impossible if it can't legally place one there."],
        ["Promoter", "Advance the event track."],
        ["Blacksmith", "Advance the building or space track, whichever is more advanced."]
      ]
    }
  };

  /* Milestones & Awards expansion — Automa C pp.13–16 (MarsBot always uses the Tharsis board) */
  function maMilestones(c) {
    return [
      ["Briber", "Has 20 M€ or more — and loses 12 M€ when it claims this."],
      ["Builder", "Building track has reached space 7."],
      ["Coastguard", "Owns 4+ tiles next to ocean tiles. (The M&A tile asks players for 3 — M&A p.2.)"],
      ["Diversifier", "Space 3 reached on 7 or more tracks."],
      ["Ecologist", "Plant/microbe/animal track has reached space 4."],
      ["Energizer", "Energy/Jovian track has reached space 6."],
      ["Engineer", "Energy/Jovian track + Earth/city track together at 10 or more."],
      ["Farmer", "Plant/microbe/animal track has reached space 7."],
      ["Forester", "Plant/microbe/animal track has reached space 6."],
      ["Fundraiser", "Event track has reached space 8."],
      ["Gardener", "As usual: owns 3+ greeneries."],
      ["Generalist", "Space 2 reached on every track except Venus."],
      ["Geologist", "As usual: owns 3 tiles on or next to volcanic sites. For MarsBot's tile placement, volcanic sites and the spaces next to them count 1 extra placement-bonus icon."],
      ["Hydrologist", "As usual: has placed 4 oceans. Keep track of your oceans and MarsBot's separately."],
      ["Landshaper", "Owns 1+ city and 1+ greenery, and its building track has reached space 5."],
      ["Legend", "As usual: 4 red cards in its played pile."],
      ["Lobbyist", "Controls the Chairman and at least 2 Party Leaders."],
      ["Mayor", "As usual: owns 3+ cities."],
      ["Merchant", "Space 2 reached on every track except Venus."],
      ["Metallurgist", "Building track + space track together at 9 or more."],
      ["Philantropist", "As usual: 5 cards with non-negative VP in its played pile. (Automa C spells it “Filantrope”.)"],
      ["Pioneer", "As usual: owns 4 colonies. Put a cube on spaces 7 and 10 of its space track and space 8 of its energy/Jovian track; when MarsBot reaches one, it loses 5 M€, builds a colony as in the MarsBot Colonies rules, and the cube is removed."],
      ["Planetologist", "Space 3 reached on two of these: energy/Jovian, Earth/city, Venus tracks."],
      ["Planner", "Space 4 reached on every track except Venus."],
      ["Producer", "Any three tracks (not Venus) together at 16 or more."],
      ["Researcher", "Science track has reached space 4."],
      ["Rim Settler", "Energy/Jovian track has reached space 5."],
      ["Spacefarer", "Space track has reached space 4."],
      ["Sponsor", "3 cards costing 20 M€ or more in its played pile — events included."],
      ["Tactician", "Has 30 M€ or more."],
      ["Terraformer", "<b>Not supported against the automa</b> — leave this tile out."],
      ["Terran", "Earth/city track has reached space 5."],
      ["Thawer", "As usual: has raised the temperature 5 times. Keep track of your raises and MarsBot's separately."],
      ["Trader", "Space 2 reached on the plant/microbe/animal, Earth/city and Venus tracks." + (venus(c) ? "" : VENUS_NOTE)],
      ["Tycoon", "As usual: 10 blue and green cards in its played pile."]
    ];
  }
  var MA_AWARDS = [
    ["Administrator", "Cards without tags in its played pile, + 2."],
    ["Banker", "Building track + event track."],
    ["Benefactor", "Its TR − 15."],
    ["Biologist", "Plant/microbe/animal track + 5."],
    ["Botanist", "Plant/microbe/animal track − 2."],
    ["Celebrity", "Cards costing 20 M€ or more in its played pile — events included."],
    ["Collector", "Number of its tracks that have reached space 3."],
    ["Constructor", "As usual: cities and colonies owned. Place the same colony cubes as for Pioneer (space track 7 and 10, energy/Jovian track 8)."],
    ["Contractor", "Building track."],
    ["Cultivator", "As usual: greeneries owned."],
    ["Electrician", "Energy/Jovian track."],
    ["Estate Dealer", "As usual: tiles owned next to ocean."],
    ["Excentric", "Every 5 M€ counts as 1. (Automa C p.14 prints “5 MC = 1 requirement”; the tile counts resources on cards — M&A p.4 — and Hellas's version rates MarsBot at 5 M€ = 1 resource, Automa C p.9.)"],
    ["Forecaster", "Every 7 M€ counts as 1 card with a requirement."],
    ["Founder", "As usual, but the Neural Instance counts as a special tile for MarsBot. For its tile placement, spaces next to special tiles (the Neural Instance included) count 1 extra placement-bonus icon."],
    ["Highlander", "As usual: tiles not next to ocean. For its tile placement, the “next to oceans” tiebreaker ranks below “most placement bonus”."],
    ["Incorporator", "Cards costing 10 M€ or less in its played pile — events included."],
    ["Industrialist", "Energy/Jovian track + 5. (Automa C has no Industrialist; this is its “Supplier”, the one award on its list that isn't an M&A tile.)"],
    ["Investor", "Earth/city track."],
    ["Landlord", "As usual: tiles owned on the board."],
    ["Landscaper", "As usual: largest group of connected tiles."],
    ["Magnate", "As usual: green cards (M&A p.4). (Automa C's note says “blue and green cards”.)"],
    ["Manufacturer", "Building track + energy/Jovian track."],
    ["Metropolist", "As usual: cities owned."],
    ["Miner", "Space track + 5."],
    ["Mogul", "Its highest track space × 2."],
    ["Politician", "Always 5."],
    ["Promoter", "Event track."],
    ["Scientist", "Science track."],
    ["Space Baron", "Space track."],
    ["Suburbian", "As usual: tiles along the map's edge. For its tile placement, edge spaces count 1 extra placement-bonus icon."],
    ["Thermalist", "Energy/Jovian track + 5."],
    ["Traveller", "Energy/Jovian track or Earth/city track, whichever is higher, + 5."],
    ["Visionary", "Its lowest track space × 2 (second-lowest with Venus Next)."],
    ["Zoologist", "Plant/microbe/animal track + 5."]
  ];
  var MA_HELP = [
    ["Administrator", "Reveal project cards until one without a tag; resolve it, and MarsBot gains an extra 5 M€."],
    ["Banker", "Advance the building or event track, whichever is less advanced (building if tied)."],
    ["Benefactor", "MarsBot raises its TR 2 steps."],
    ["Biologist", "Advance the microbe track (plant/microbe/animal)."],
    ["Botanist", "Advance the plant track (plant/microbe/animal)."],
    ["Celebrity", "Reveal project cards until one costing 20 M€ or more; resolve it."],
    ["Collector", "Advance its least advanced track."],
    ["Constructor", "Place a city tile."],
    ["Contractor", "Advance the building track."],
    ["Cultivator", "Place a greenery tile and raise oxygen 1 step."],
    ["Electrician", "Advance the energy track (energy/Jovian)."],
    ["Estate Dealer", "Place a greenery tile next to an ocean and raise oxygen 1 step."],
    ["Excentric", "<b>You</b> must lose 1 animal or 1 microbe (the highest-scoring one if you have several)."],
    ["Forecaster", "Reveal project cards until one with a requirement; resolve it, and MarsBot gains 5 M€."],
    ["Founder", "Place a city tile next to a special tile."],
    ["Highlander", "Place a greenery tile not next to an ocean and raise oxygen 1 step."],
    ["Incorporator", "Reveal project cards until one costing 10 M€ or less; resolve it."],
    ["Industrialist", "Advance the energy track (energy/Jovian). (Listed as “Supplier” in Automa C.)"],
    ["Investor", "Advance the Earth track (Earth/city)."],
    ["Landlord", "Place a greenery tile and raise oxygen 1 step."],
    ["Landscaper", "Place a greenery tile and raise oxygen 1 step."],
    ["Magnate", "Reveal project cards until a green card; resolve it."],
    ["Manufacturer", "Advance the building or energy track, whichever is less advanced (building if tied)."],
    ["Metropolist", "Place a city tile."],
    ["Miner", "Advance the space track."],
    ["Mogul", "Advance its most advanced track."],
    ["Politician", "No helper action for this award."],
    ["Promoter", "Advance the event track."],
    ["Scientist", "Advance the science track."],
    ["Space Baron", "Advance the space track."],
    ["Suburbian", "Place a greenery tile on the map's edge and raise oxygen 1 step."],
    ["Thermalist", "Advance the energy track (energy/Jovian)."],
    ["Traveller", "Advance the Jovian or Earth track, whichever is more advanced (energy/Jovian or Earth/city)."],
    ["Visionary", "Advance its least advanced track, not counting Venus."],
    ["Zoologist", "Advance the animal track (plant/microbe/animal)."]
  ];
  /* Amazonis Planitia's own milestones and awards (A&V wrap): the Automa books rate none of them for MarsBot */
  var AMZ_MS = ["Terran", "Landshaper", "Merchant", "Sponsor", "Lobbyist"];
  var AMZ_AW = ["Collector", "Innovator", "Constructor", "Manufacturer", "Physicist"];
  var HOVERLORD = ["Hoverlord", "Unchanged: has 7 floater resources. In a “leftmost” tie, count Hoverlord as last."];
  var VENUPHILE = ["Venuphile", "Venus track. In a “leftmost” tie, count Venuphile as last."];

  /* rows for the map's milestones / awards / helper actions; Amazonis Planitia without the M&A tiles has none
     (only Venus Next's Hoverlord and Venuphile, which Automa C pp.2–3 rate on any map) */
  function msRows(c) {
    var b = mapId(c), rows;
    if (ma(c)) rows = maMilestones(c);
    else if (b === "amazonis") rows = [];
    else if (b === "tharsis") rows = thMilestones(c);
    else rows = MAPDATA[b].ms(c);
    if (venus(c)) rows = rows.concat([HOVERLORD]);
    return rows;
  }
  function awRows(c) {
    var b = mapId(c), rows;
    if (ma(c)) rows = MA_AWARDS;
    else if (b === "amazonis") rows = [];
    else if (b === "tharsis") rows = TH_AWARDS;
    else rows = MAPDATA[b].aw;
    if (venus(c)) rows = rows.concat([VENUPHILE]);
    return rows;
  }
  function helpRows(c) {
    var b = mapId(c), rows;
    if (ma(c)) rows = MA_HELP;
    else if (b === "amazonis") rows = [];
    else if (b === "tharsis") rows = TH_HELP;
    else rows = MAPDATA[b].help;
    if (venus(c)) rows = rows.concat([["Venuphile", "Advance the Venus track."]]);
    return rows;
  }
  /* which Corporate Competition card is in the bonus deck: B08 Tharsis (Automa A p.3), B09–B13 the five other
     MarsBot maps (Automa C p.8), B14 the M&A tiles (Automa C p.13); none exists for Amazonis Planitia (null) */
  function ccCard(c) {
    if (ma(c)) return { n: "B14", name: "Corporate Competition", which: "the M&A version, with the M&A icon" };
    if (amz(c)) return null;
    if (mapId(c) === "tharsis") return { n: "B08", name: "Corporate Competition", which: "Tharsis" };
    return { n: "B09–B13", name: "Corporate Competition", which: "the " + mapName(c) + " card, replacing B08" };
  }
  var NO_AMZ_CC = "There's no Amazonis Planitia version: the box has B08 for Tharsis, B09–B13 for the five other MarsBot maps and B14 for the Milestones & Awards tiles, and the Automa books don't say what to use on this map.";

  /* tile-placement tiebreakers (Automa A p.9; Automa C p.10) */
  var RANDOM_TIE = "Random: flip a project card and count its cost through the tied spaces, starting top-left and going right, then row by row, looping as needed; place the tile on the last space counted, then discard the card.";
  var TIES = {
    tharsis: ["Next to as many oceans as possible.", "Covers the most placement-bonus icons.", RANDOM_TIE],
    hellas: ["Next to as many oceans as possible.", "In the Polar Region (the bottom two rows).", "Covers the most reward icons.", RANDOM_TIE],
    elysium: ["Next to as many oceans as possible.", "Covers the most reward icons.", "In the Southern Region (the bottom four rows).", RANDOM_TIE],
    cimmeria: ["Next to as many oceans as possible.", "Next to one or more special tiles (the Neural Instance included).", "Covers the most reward icons.", RANDOM_TIE],
    utopia: ["Next to as many oceans as possible.", "Covers the most reward icons; edge spaces count 1 extra icon.", RANDOM_TIE],
    vastitas: ["Covers the most reward icons; volcanic spaces and the spaces next to them count 1 extra icon.", "An edge space if possible, otherwise next to as many oceans as possible.", RANDOM_TIE]
  };
  var TIE_SUMMARY = {
    hellas: "oceans, then the Polar Region, then bonus icons",
    elysium: "oceans, then bonus icons, then the Southern Region",
    cimmeria: "oceans, then special tiles, then bonus icons",
    utopia: "oceans, then bonus icons with edge spaces counting extra",
    vastitas: "bonus icons with volcanic areas counting extra, then edge spaces"
  };
  /* which tiebreaker list to show: the map's own (Automa A p.9 Tharsis, C p.10 the five other maps); with the M&A tiles
     Tharsis's, flagged, since C p.13 moves MarsBot to its Tharsis board and reference card; none for Amazonis (null) */
  function tieId(c) { if (ma(c)) return "tharsis"; return amz(c) ? null : mapId(c); }

  /* ------------------------------------------------------------ bonus cards */
  function lobbyistsText(c) {
    if (venus(c)) {
      return "Only the first that applies (MarsBot gains TR as usual for every raise):" + ol([
        "Temperature 1–2 steps from a bonus step or its maximum → raise it 2 steps; <b>destroy</b> this card.",
        "Oxygen 1–2 steps from a bonus step or its maximum → place 1 greenery (raising oxygen for it), then raise oxygen 1 more step; <b>destroy</b> this card.",
        "Venus 1–2 steps from a bonus step or its maximum → raise Venus 2 steps (the card is <b>not</b> destroyed).",
        "Otherwise advance the Martian global parameter furthest from completion (ties: oxygen, then an ocean, then temperature)."
      ]);
    }
    return "Only the first that applies (MarsBot gains TR as usual for every raise):" + ol([
      "Temperature 1–2 steps from a bonus step or its maximum → raise it 2 steps; <b>destroy</b> this card.",
      "Oxygen 1–2 steps from a bonus step or its maximum → place 1 greenery (raising oxygen for it), then raise oxygen 1 more step; <b>destroy</b> this card.",
      "An empty ocean-reserved space next to at least 2 ocean tiles → place an ocean there; <b>destroy</b> this card.",
      "Otherwise advance the global parameter furthest from completion (ties: oxygen, then an ocean, then temperature)."
    ]);
  }
  var EC_CITY = "MarsBot places a city next to any mix of at least 2 greenery/ocean tiles (ties: next to the most such tiles, then the placement tiebreakers), following the usual city rules";
  var COLONY_RANDOM = "a random colony tile where it has no colony: flip a project card and count through the eligible tiles up to its cost, looping if needed; place the colony on the last tile, then discard the card";
  function bonusDeckRows(c) {
    var cc = ccCard(c), vc = venus(c) || colonies(c);
    return [
      ["B01", "Meteor Shower", "You must remove 5 plants (as many as you have, if fewer). If you removed at least 3, or a card or ability stopped the removal, <b>destroy</b> this card."],
      ["B02", "Invasive Species", "You must remove your highest-scoring animal/microbe cube from a card in your tableau, if you can. MarsBot gains " + (vc ? "2 M€ and 1 floater (Venus Next or Colonies in play)" : "5 M€") + " either way."],
      ["B03", "Research and Development", "MarsBot draws 1 project card and resolves it immediately."],
      ["B04", "Overachievement", "MarsBot tries to claim a milestone. If that fails and it's generation 6 or later, it tries to fund an award. If either works, <b>destroy</b> this card; otherwise MarsBot gains 5 M€."],
      colonies(c)
        ? ["—", "Expedited Construction (Colonies version)", "Only the first that applies:" + ol([EC_CITY + "; then <b>destroy</b> this card.",
            "If MarsBot has 0 or 1 colonies, it places one on " + COLONY_RANDOM + ". It gains 2 resources in that tile's storage area on its shipping board. The card is <b>not</b> destroyed.",
            "No effect."])]
        : ["B05", "Expedited Construction", EC_CITY + ". If it places a city, <b>destroy</b> this card; otherwise no effect."],
      [venus(c) ? "B15" : "B06", venus(c) ? "Lobbyists (Venus Next version)" : "Lobbyists", lobbyistsText(c)],
      ["B07", "Local Neural Instance", "MarsBot places its Neural Instance tile on a space next to no tiles: not an edge space, and not on or next to any reserved space (ocean or named-city spaces); the usual tiebreakers apply. If it can't, it draws and resolves a project card instead. Then <b>destroy</b> this card."],
      cc ? [cc.n, cc.name + " (" + cc.which + ")", "If MarsBot has at least 5 M€, it helps itself on the closest funded award (see Corporate Competition). If a helper action resolves, MarsBot loses 5 M€ and the card is discarded; if none does, draw another bonus card and resolve it, discarding both."]
        : ["—", "Corporate Competition (no Amazonis Planitia version)", NO_AMZ_CC, "missing"],
      colonies(c) ? ["B17", "Outer System Foothold", "MarsBot places a colony on " + COLONY_RANDOM + ". It gains 2 resources in that tile's storage area. Then draw a card from the <b>bonus</b> deck (reshuffle the discards if needed, but not this card) and discard it without resolving it."] : null
    ].filter(Boolean);
  }
  function actionOnlyRows(c) {
    return [
      venus(c) ? ["B16", "Government Intervention", "Only the first that applies: on an <b>even-numbered</b> generation, or once Venus is complete → advance the Martian global parameter furthest from completion (ties: oxygen, then an ocean, then temperature); otherwise raise Venus 1 step. MarsBot gets <b>no TR and no M€</b> bonuses from this card, even when it sets off another raise."] : null,
      colonies(c) ? ["B18", "Shipping Lines", "From generation 2 (never in the first action deck), shuffle it into each new action deck after the Research phase. Pick the colony tile with the most advanced track (ties: one where MarsBot has a colony, then random as for colony placement). MarsBot loses 1 M€ and trades there."] : null,
      colonies(c) ? ["B19", "Extended Shipping Lines", "As Shipping Lines: a second trade each generation once MarsBot has unlocked its second trade fleet."] : null,
      turmoil(c) ? ["B20", "Party Politics", "If MarsBot has a delegate in its reserve, it places one in the party the priority list picks (see Turmoil) and you check Party Leader and Dominance. Then, if it still has a reserve delegate and 5+ M€, flip a project card (and discard it): if its cost divides evenly by 3, MarsBot pays 5 M€ and places a second delegate the same way."] : null
    ].filter(Boolean);
  }

  /* MarsBot's first action deck (Automa A p.3; C pp.1–2, 6; A p.11 Brutal) */
  function firstDeck(c) {
    var n = brutal(c) ? 4 : 3, items = ["<b>" + n + " project cards</b> dealt at setup"];
    if (pcards(c)) items.push("<b>3 more project cards</b> (Prelude)");
    items.push("<b>1 bonus card</b> from its bonus deck");
    if (venus(c)) items.push("<b>Government Intervention</b>");
    if (turmoil(c)) items.push("<b>Party Politics</b>");
    return { items: items, total: n + (pcards(c) ? 3 : 0) + 1 + (venus(c) ? 1 : 0) + (turmoil(c) ? 1 : 0) };
  }

  var SRC = { A: "Automa A", B: "Automa B", C: "Automa C" };
  function boardSrc(c) { return ma(c) ? "Automa C p.13" : (amz(c) ? "Automa A p.2 · Automa C p.8" : (mapId(c) !== "tharsis" ? "Automa C p.8" : "")); }

  /* =================================================================== SETS */
  var sets = [
    { id: "automa", name: "Automa: MarsBot solo opponent", short: "Automa", year: "2024",
      blurb: "MarsBot, an automated opponent for one player: MarsBot boards for six maps, bonus and corporation cards, and rules for Prelude 1–2, Venus Next, Colonies, Turmoil, the Hellas, Elysium, Utopia Planitia, Terra Cimmeria and Vastitas Borealis maps and the Milestones & Awards tiles." }
  ];

  /* ================================================================== MODES */
  var modes = [
    { id: "automa", name: "Versus MarsBot", requires: ["automa"], minPlayers: 1, maxPlayers: 1,
      blurb: "One player against MarsBot, which acts as the second player in a two-player setup: you start on 20 TR, with milestones and awards in play. Beat MarsBot's score to win; a tie goes to MarsBot.",
      src: "Automa A pp.2–3, 10" }
  ];

  /* ================================================================ MODULES */
  var modules = [
    { id: "mb-difficulty", name: "MarsBot difficulty", requires: ["automa"], modes: ["automa"], excludes: [], minPlayers: 1, maxPlayers: 1,
      summary: "Normal is the default; Easy, Hard and Brutal change a few rules.",
      description: "Easy: MarsBot ignores its advance-tracker icons, Failed Actions pay 3 M€ and its award values are 5 lower. Hard: it scores 1 VP per played card with a non-negative VP icon, and on its first turn of each generation it buys a milestone for 8 M€ if it meets enough of them. Brutal: both Hard changes, plus 4 project cards to start and all 4 kept each research phase. You may also mix individual changes to taste.",
      choices: [
        { id: "mb-normal", name: "Normal", summary: "The default rules." },
        { id: "mb-easy", name: "Easy", summary: "No advance-tracker icons; Failed Actions pay 3 M€; award values − 5." },
        { id: "mb-hard", name: "Hard", summary: "1 VP per played card with a non-negative VP icon; on its first turn each generation, if it has 8 M€ and meets enough milestones, it claims one for 8 M€." },
        { id: "mb-brutal", name: "Brutal", summary: "Hard, plus 4 starting project cards and it keeps all 4 each research phase." }
      ],
      default: "mb-normal",
      src: "Automa A p.11" },
    { id: "mb-corps", name: "MarsBot corporations", requires: ["automa"], modes: ["automa"], excludes: [], minPlayers: 1, maxPlayers: 1,
      summary: "MarsBot plays a random MarsBot corporation (Automa B).",
      description: "After you play your corporation, MarsBot draws a random MarsBot corporation. Its card can show starting tags, a Setup box, an ongoing Effect, a per-generation box and a Draft Priority (which makes the Draft variant compulsory). It makes MarsBot harder, so consider a lower difficulty at first.",
      src: "Automa B pp.1–4" },
    { id: "mb-turmoil-harder", name: "Tougher MarsBot in Turmoil", requires: ["automa", "turmoil"], modes: ["automa"], excludes: [], minPlayers: 1, maxPlayers: 1,
      summary: "Make MarsBot harder to predict on the Terraforming Committee.",
      description: "Pick one: reduce MarsBot's starting TR by 7 instead of 10, or place 1 (or 2) MarsBot delegates in random parties during setup.",
      choices: [
        { id: "mb-tm-tr7", name: "Starting TR − 7 (not − 10)", summary: "MarsBot starts on 13 TR." },
        { id: "mb-tm-del1", name: "1 delegate in a random party", summary: "Placed after the neutral delegates." },
        { id: "mb-tm-del2", name: "2 delegates in random parties", summary: "The same procedure, done twice." }
      ],
      src: "Automa C p.7" }
  ];

  /* ================================================================== STEPS */
  var steps = [
    /* ---- overview (before step 1) ---- */
    { id: "mb-intro", after: "start", exp: "automa",
      when: function (c) { return am(c); },
      t: "You vs MarsBot: a two-player setup",
      d: function (c) {
        var lvl = level(c);
        return ul([
          "MarsBot is an automated second player. Set up a normal <b>two-player game</b> with the MarsBot changes shown in the steps below. You may use the <b>Corporate Era</b> cards.",
          "Because it's a two-player setup, you start on <b>20 TR</b> and milestones and awards are in play; the Base solo variant's rules (14 TR, no milestones or awards, 14 generations) don't apply.",
          "To win you must <b>beat MarsBot's score</b>; a tie goes to MarsBot. If the game enters generation " + lossHtml(c) + (pcards(c) ? " (Prelude)" : "") + ", you lose immediately.",
          "Difficulty: <b>" + LEVEL_NAMES[lvl] + "</b>" + (lvl === "normal" ? " (the default)." : " (see Difficulty levels in the reference).") +
            (corps(c) ? " MarsBot corporations make it harder, so consider a lower level while you learn them." : ""),
          "From the MarsBot box you need:" + ul([
            noBoard(c) ? "the board holder and the clear cubes (the box has <b>no MarsBot board for Amazonis Planitia</b>; see the next steps);"
              : "the board holder and the <b>" + boardName(c) + " MarsBot board</b>, with the clear cubes;",
            noBoard(c) ? "the <b>final scoring reference card</b> (there's no Amazonis Planitia board reference card either);"
              : "the <b>" + boardName(c) + " board reference card</b> and the <b>final scoring reference card</b>;",
            "the MarsBot bonus cards and the <b>Neural Instance tile</b>" + (venus(c) || colonies(c) || corps(c) ? ";" : "."),
            venus(c) ? "the <b>Venus Next MarsBot board</b>" + (colonies(c) || corps(c) ? ";" : ".") : "",
            colonies(c) ? "the <b>Colonies shipping board</b>" + (corps(c) ? ";" : ".") : "",
            corps(c) ? "the <b>MarsBot corporation cards</b>, plus the white and black cubes if its corporation calls for them." : ""
          ])
        ]);
      },
      src: function (c) { return join("Automa A pp.2–3, 10", "Base pp.7, 13", prelude(c) ? "Automa C p.1" : "", noBoard(c) ? "Automa C p.8" : "", corps(c) ? "Automa B p.1" : ""); } },

    /* ---- Amazonis Planitia: not covered ---- */
    { id: "mb-amazonis", after: "base-setup-1", exp: "automa",
      when: function (c) { return am(c) && amz(c); },
      t: "Amazonis Planitia: not covered by the MarsBot rules",
      d: function (c) {
        return ul([
          "The MarsBot box has MarsBot boards, board reference cards and Corporate Competition cards for six maps only: <b>" + SIX_MAPS + "</b>. None of the three Automa books mentions Amazonis Planitia.",
          ma(c)
            ? "With the Milestones &amp; Awards tiles, part of this is covered: MarsBot uses its <b>Tharsis board and reference card</b> “regardless of which board you are using”, its bonus deck takes Corporate Competition B14, and every tile except Terraformer (not supported) is rated for it (Automa C pp.13–16)."
            : "So the books give MarsBot <b>no board, no milestone or award ratings, no Corporate Competition card and no tile-placement tiebreakers</b> for this map.",
          "The books also don't mention Amazonis's <b>longer global parameters</b> or its <b>wild-resource and delegate bonus spaces</b>.",
          "This page gives MarsBot's general rules and marks each point the books leave open. For a game the rules fully cover, choose one of the six maps above."
        ]);
      },
      src: function (c) { return join("Automa A p.2", "Automa C p.8", ma(c) ? "Automa C pp.13–16" : "", "A&V wrap"); } },

    /* ---- Milestones & Awards tiles ---- */
    { id: "mb-ma", after: "ma-setup", exp: "automa",
      when: function (c) { return am(c) && ma(c); },
      t: "Milestones & Awards tiles against MarsBot",
      d: function (c) {
        return ul([
          "MarsBot plays on its <b>Tharsis MarsBot board with the Tharsis reference card</b>, whatever map you use, and its bonus deck takes <b>Corporate Competition (B14)</b>, the one with the M&A icon.",
          "When you pick the 5 milestones, <b>leave out Terraformer</b>: it isn't supported against the automa.",
          "The book recommends not using milestones or awards that MarsBot measures the same or nearly the same way in one game. For example, Energizer and Rim Settler both use its energy/Jovian track.",
          "To keep the pressure on, it also recommends MarsBot's <b>Hard milestone rule</b>: on its first turn of each generation, MarsBot buys a milestone for 8 M€ if it meets enough of them" + (hard(c) ? ". It's already on at your difficulty." : ". You can add it to any difficulty."),
          "How MarsBot qualifies for each tile: see <i>Milestones &amp; awards</i> in the reference."
        ]);
      },
      src: function () { return "Automa C pp.13–15 · Automa A p.11"; } },

    /* ---- MarsBot's board and play area ---- */
    { id: "mb-board", after: "base-setup-2", exp: "automa",
      when: function (c) { return am(c); },
      t: "MarsBot's board",
      d: function (c) {
        return ul([
          noBoard(c)
            ? "Set out the <b>MarsBot board holder</b>. The box has <b>no MarsBot board for Amazonis Planitia</b> (it has one for each of " + SIX_MAPS + "), and the books don't say which board to use here."
            : "Set out the <b>MarsBot board holder</b> and slide in the <b>" + boardName(c) + " MarsBot board</b>" + (ma(c) && mapId(c) !== "tharsis" ? ". With the M&A tiles it's always the Tharsis board, whatever the map." : "."),
          noBoard(c)
            ? "Set out the <b>final scoring reference card</b>. There's no Amazonis Planitia board reference card, the card that normally holds <b>MarsBot's M€ supply</b>."
            : "Next to it, set out the <b>" + boardName(c) + " board reference card</b> and the <b>final scoring reference card</b>. The board reference card holds <b>MarsBot's M€ supply</b>.",
          "Place a <b>clear cube on the 0 space of every track</b>.",
          venus(c) ? "<b>Venus Next:</b> place the <b>Venus Next MarsBot board</b> next to the MarsBot board, with a clear cube on its 0 space." : "",
          colonies(c) ? "<b>Colonies:</b> place the <b>MarsBot Colonies shipping board</b> beside the MarsBot board." : "",
          "Set aside the <b>Neural Instance tile</b>. MarsBot places it with a bonus card.",
          "Return the MarsBot components you aren't using to the box."
        ]);
      },
      src: function (c) { return join("Automa A p.3", boardSrc(c), venus(c) ? "Automa C p.2" : "", colonies(c) ? "Automa C p.4" : ""); } },

    /* ---- the bonus deck ---- */
    { id: "mb-bonus-deck", after: "base-setup-2", exp: "automa",
      when: function (c) { return am(c); },
      t: "MarsBot's bonus deck",
      d: function (c) {
        var all = bonusDeckRows(c), aside = actionOnlyRows(c);
        var rows = all.filter(function (r) { return !r[3]; });
        var line = function (r) { return (r[0] === "—" ? "" : "<b>" + r[0] + "</b> ") + r[1]; };
        return (rows.length < all.length
          ? p("The <b>MarsBot bonus deck</b> includes a Corporate Competition card for the map in play. " + NO_AMZ_CC + " The rest of the deck, shuffled facedown next to MarsBot's board:")
          : p("Shuffle these <b>" + rows.length + " cards</b> facedown next to MarsBot's board. This is the <b>MarsBot bonus deck</b>:")) +
          ul(rows.map(line)) +
          (colonies(c) ? note("Automa C p.4 numbers the Colonies Expedited Construction “B16”, the number Automa A p.6 and C p.2 give Government Intervention, so pick it by name: it's the Expedited Construction that isn't B05.") : "") +
          (aside.length ? p("Set these aside. They go into MarsBot's <b>action deck</b> each generation, not into the bonus deck:") +
            ul(aside.map(function (r) { return "<b>" + r[0] + "</b> " + r[1]; })) : "") +
          p("Return every other MarsBot bonus card to the box" + (corps(c)
            ? ". Keep the corporation-specific bonus cards out until MarsBot's corporation is drawn; then keep only the ones it mentions."
            : ", including the corporation-specific ones."));
      },
      src: function (c) {
        return join("Automa A p.3", venus(c) ? "Automa C p.2" : "", colonies(c) ? "Automa C p.4" : "", turmoil(c) ? "Automa C p.6" : "",
          (mapId(c) !== "tharsis" && !ma(c)) ? "Automa C p.8" : "", (ma(c) || amz(c)) ? "Automa C p.13" : "", corps(c) ? "Automa B p.1" : "");
      } },

    /* ---- Prelude 2: Recession ---- */
    { id: "mb-recession", after: "base-setup-3", exp: "automa",
      when: function (c) { return am(c) && prelude2(c); },
      t: "Prelude 2: take out Recession",
      d: function () {
        return ul(["Remove the Prelude card <b>Recession</b> from the Prelude deck before you draw your Prelude cards. It isn't supported against MarsBot."]);
      },
      src: function () { return "Automa C p.1"; } },

    /* ---- players: first player, MarsBot's colour and TR ---- */
    { id: "mb-players", after: "base-setup-4", exp: "automa",
      when: function (c) { return am(c); },
      t: "MarsBot takes a seat",
      d: function (c) {
        var tr = mbStartTR(c);
        return ul([
          "<b>You are the starting player</b>: take the first player marker.",
          "Choose a <b>colour for MarsBot</b>. Put one of its player markers on the <b>" + tr + " TR</b> space of the game board and keep the rest next to its board." +
            (turmoil(c) ? " Turmoil lowers MarsBot's starting TR by " + (20 - tr) + (tmHarder(c) === "tr7" ? " (the tougher option; normally 10)" : "") + "; you still start on 20." : ""),
          "MarsBot has no production: it <b>skips the production phase</b>, and effects that lower its production move its trackers back instead (see <i>Your turn against MarsBot</i>)."
        ]);
      },
      src: function (c) { return join("Automa A pp.3–5", turmoil(c) ? "Automa C pp.6–7" : ""); } },

    /* ---- corporations: yours only ---- */
    { id: "mb-corporations", after: "base-setup-5", exp: "automa",
      when: function (c) { return am(c); },
      t: "Corporations: only yours",
      d: function (c) {
        return ul([
          "Only you are dealt corporations. MarsBot doesn't get a corporation card" + (corps(c)
            ? " from this deck: it draws a MarsBot corporation after you've played yours (see below)."
            : ". Once you know the game, you can give it a MarsBot corporation (Automa B)."),
          corps(c) && pcards(c) ? "<b>Prelude:</b> with a MarsBot corporation, you choose your 2 Prelude cards (of the " + (on(c, "p2-extended") ? 6 : 4) + " dealt) only after MarsBot's corporation has been drawn (see <i>MarsBot's corporation</i>), not together with your corporation and project cards." : "",
          "Promo: the corporation <b>Mons Insurance</b> can't be used against MarsBot."
        ]);
      },
      src: function (c) { return join("Automa A pp.3, 11", corps(c) ? "Automa B p.1" : "", corps(c) && pcards(c) && on(c, "p2-extended") ? "Prelude 2 p.3" : ""); } },

    /* ---- MarsBot's first action deck ---- */
    { id: "mb-action-deck", after: "base-setup-6", exp: "automa",
      when: function (c) { return am(c); },
      t: "MarsBot's action deck",
      d: function (c) {
        var extra = [pcards(c) ? "3 project cards after you pick your Preludes" : "", venus(c) ? "Government Intervention" : "", turmoil(c) ? "Party Politics" : ""].filter(Boolean);
        return ul([
          "Instead of 10 project cards, deal MarsBot <b>" + (brutal(c) ? 4 : 3) + " project cards facedown</b> next to its bonus deck" + (brutal(c) ? " (Brutal: 4 instead of 3)" : "") + ". MarsBot never pays for its cards.",
          "Shuffle <b>1 card from the MarsBot bonus deck</b> into them. This is MarsBot's <b>action deck</b>: it resolves one card on each of its turns.",
          extra.length ? "More cards join it before the first turn: " + listAnd(extra) + " (see <i>Before the first turn</i>)." : "",
          pnc(c) ? "Prelude without Prelude cards: the books don't say whether MarsBot still gets Prelude's 3 extra project cards (see <i>Prelude</i>)." : ""
        ]);
      },
      src: function (c) { return join("Automa A pp.3–4", brutal(c) ? "Automa A p.11" : "", prelude(c) ? "Automa C p.1" : "", venus(c) ? "Automa C p.2" : "", turmoil(c) ? "Automa C p.6" : ""); } },

    /* ---- MarsBot corporation (Automa B) ---- */
    { id: "mb-corp", after: "base-setup-7", exp: "automa",
      when: function (c) { return am(c) && corps(c); },
      t: "MarsBot's corporation",
      d: function (c) {
        return ol([
          "After you've chosen and played your corporation" + (pcards(c) ? ", but before you choose and play your Prelude cards," : ",") + " <b>draw a random MarsBot corporation</b>. If it's the same corporation you're playing, draw another.",
          "If it mentions <b>black or white cubes</b>, set aside the 6 cubes of those colours from the MarsBot box next to its card.",
          "Resolve its <b>Setup</b> box now.",
          "Resolve its <b>starting tags</b> as if they were on a card MarsBot revealed during play. Its ongoing <b>Effect</b> already applies. If this or the Setup box triggers an “any player” effect on your corporation (for example MarsBot places a city while you're Tharsis Republic), resolve it.",
          "Return to the box the <b>corporation-specific bonus cards</b> it doesn't mention.",
          pcards(c) ? "Now choose and play your Prelude cards." : "Then go on to the first generation."
        ]) + ul([
          "If its card shows a <b>Draft Priority</b>, you <b>must use the Draft variant</b> this game: MarsBot drafts by that priority (see <i>MarsBot corporations</i>)." + (draft(c) ? "" : " Turn the Draft variant on if it does."),
          "Special cubes or M€ its setup puts on MarsBot's tracks trigger its effect when the tracker reaches them."
        ]);
      },
      src: function () { return "Automa B pp.1–3"; } },

    /* ---- Prelude ---- */
    { id: "mb-prelude", after: "prelude-setup", exp: "automa",
      when: function (c) { return am(c) && prelude(c); },
      t: "Prelude: MarsBot's changes",
      d: function (c) {
        if (pnc(c)) return ul([
          "You're playing Prelude <b>without its Prelude cards</b> (a Prelude variant). <b>The Automa books don't mention this variant.</b>",
          "Their Prelude setup and game-end changes are:" + ul([
            "MarsBot gets <b>3 extra project cards</b> for its starting action deck, instead of Prelude cards;",
            "you <b>lose if the game enters generation 18</b> before the game-end trigger, and MarsBot's leftover M€ scores on the <b>Prelude column</b> of the final scoring card."
          ]),
          "The books don't say whether these apply when no Prelude cards are used, so agree before you start. Where it matters, this page shows the standard MarsBot figures (generation 20, the Base column) and the Prelude ones side by side.",
          "Their gameplay change is about project cards, not Prelude cards: whenever MarsBot resolves a project card with a <b>wild tag</b>, it advances its least-advanced track (topmost if tied)."
        ]);
        return ul([
          "MarsBot gets <b>no Prelude cards</b>. After you've picked your Prelude cards and corporation, give MarsBot <b>3 extra project cards</b> for its starting action deck.",
          "Prelude shortens the game against MarsBot: you <b>lose immediately if the game enters generation 18</b> before the game-end trigger, and MarsBot's leftover M€ is worth more, sooner (see <i>Game end</i>).",
          prelude2(c) ? "Prelude 2: <b>Recession</b> stays out of the Prelude deck." : ""
        ]);
      },
      src: function (c) { return pnc(c) ? "Automa C p.1 · Automa A pp.3, 10 · Prelude p.2" : "Automa C p.1"; } },

    /* ---- Venus Next ---- */
    { id: "mb-venus", after: "venus-setup", exp: "automa",
      when: function (c) { return am(c) && venus(c); },
      t: "Venus Next: MarsBot's changes",
      d: function () {
        return ul([
          "MarsBot gets its <b>Venus Next board</b> (a clear cube on 0), and its bonus deck uses the Venus Next <b>Lobbyists (B15)</b> instead of B06: see <i>MarsBot's board</i> and <i>MarsBot's bonus deck</i>.",
          "Set aside <b>Government Intervention (B16)</b>. From the first generation on, shuffle it into every new MarsBot action deck.",
          "<b>Don't carry out Solar Phase step 2</b> (World Government Terraforming): Government Intervention does that job. MarsBot can't be used with Venus Next without that card, even though a multiplayer game may skip the step as a variant.",
          "<b>Hoverlord</b> and <b>Venuphile</b> are in play as usual. MarsBot qualifies for Hoverlord with 7 floaters, and its Venuphile value is its Venus track."
        ]);
      },
      src: function () { return "Automa C pp.2–3 · Venus p.3"; } },

    /* ---- Colonies ---- */
    { id: "mb-colonies", after: "colonies-setup", exp: "automa",
      when: function (c) { return am(c) && colonies(c); },
      t: "Colonies: set up for two, with MarsBot's fleet",
      d: function (c) {
        return ul([
          "Set up Colonies as for a <b>two-player game</b> (5 Colony tiles), not with the Colonies solo rules, but put the marker of <b>every</b> tile on its highlighted second step, <b>Titan, Enceladus and Miranda</b> included.",
          "Put <b>one trade fleet for you and one for MarsBot</b> on the Trade Fleets tile.",
          "Put MarsBot's <b>second trade fleet on space 9 of its " + trk(c, "energy") + "</b>. It unlocks when the tracker gets there.",
          "MarsBot's <b>shipping board</b> sits beside its board. Its bonus deck takes the Colonies <b>Expedited Construction</b> and <b>Outer System Foothold (B17)</b>. <b>Shipping Lines</b> and <b>Extended Shipping Lines (B18–B19)</b> are set aside for its action deck."
        ]);
      },
      src: function () { return "Automa C p.4 · Colonies pp.2–3"; } },

    /* ---- Turmoil ---- */
    { id: "mb-turmoil", after: "turmoil-setup", exp: "automa",
      when: function (c) { return am(c) && turmoil(c); },
      t: "Turmoil: MarsBot's delegates and TR",
      d: function (c) {
        var hx = tmHarder(c);
        return ul([
          "Set up Turmoil normally, but leave <b>all 7 of MarsBot's delegates in the reserve</b>: none goes in the lobby.",
          "MarsBot starts on <b>" + mbStartTR(c) + " TR</b> (" + (hx === "tr7" ? "20 − 7, the tougher option" : "20 − 10") + "). You start on 20 as usual.",
          "Set aside <b>Party Politics (B20)</b>: it's shuffled into MarsBot's starting action deck and into every new one.",
          (hx === "del1" || hx === "del2") ? "<b>Tougher MarsBot:</b> " + (hx === "del2" ? "2 of its delegates start" : "1 of its delegates starts") + " in a random party, picked by flipping a project card, so you place " + (hx === "del2" ? "them" : "it") + " once the project deck is shuffled (see <i>Turmoil: MarsBot's starting delegates</i>)." : "",
          (mapId(c) === "tharsis" && !ma(c)) ? "On Tharsis, Turmoil's 26 TR <b>Terraformer</b> tile replaces the printed milestone as usual. The Automa books don't mention this tile: they rate MarsBot's Terraformer as “unchanged” (Automa A p.8 adds “reaching 35 TR”, the printed requirement), so this page applies the tile's 26 TR to MarsBot too." : ""
        ]);
      },
      src: function (c) { return join("Automa C pp.6–7", (mapId(c) === "tharsis" && !ma(c)) ? "Turmoil p.2 · Automa A p.8" : ""); } },

    /* ---- Turmoil, tougher option: MarsBot's random starting delegates. The party is picked by flipping a project card
       (Automa C p.7), so this waits until the project deck is shuffled (base setup step 3); the neutral delegates it
       must follow were placed in the Turmoil setup before that. ---- */
    { id: "mb-turmoil-delegates", after: "base-setup-3", exp: "automa",
      when: function (c) { var hx = tmHarder(c); return am(c) && (hx === "del1" || hx === "del2"); },
      t: "Turmoil: MarsBot's starting delegates",
      d: function (c) {
        return ul([
          "Tougher MarsBot option: flip a card from the project deck to pick a random party, and put <b>1 MarsBot delegate</b> from its reserve there. It may take the Party Leader seat." +
            (tmHarder(c) === "del2" ? " Then do it <b>a second time</b>." : ""),
          "This comes after the neutral delegates, which you placed in the Turmoil setup."
        ]);
      },
      src: function () { return "Automa C p.7"; } },

    /* ---- before the first turn ---- */
    { id: "mb-start", after: "end", exp: "automa",
      when: function (c) { return am(c); },
      t: "Before the first turn: MarsBot's full action deck",
      d: function (c) {
        var fd = firstDeck(c);
        return ul([
          "MarsBot's first action deck is <b>" + fd.total + " cards</b>: " + listAnd(fd.items) + ". Shuffle them facedown.",
          pnc(c) ? "If you've agreed to use MarsBot's Prelude changes, add its <b>3 extra project cards</b> (see <i>Prelude</i>)." : "",
          colonies(c) ? "<b>Shipping Lines</b> isn't in it yet: it joins after the Research phase from generation 2." : "",
          corps(c) ? "Resolve any <b>“Before Action Phase”</b> box on MarsBot's corporation now, before the first action phase." : "",
          "Generation 1 has no player order or research phase: <b>you take the first turn</b>, then you and MarsBot alternate.",
          hard(c) ? "On MarsBot's first turn of every generation, check the <b>Hard milestone rule</b> first (see <i>MarsBot's turn</i>)." : ""
        ]);
      },
      src: function (c) {
        return join("Automa A pp.3–5", "Base p.7", prelude(c) ? "Automa C p.1" : "", venus(c) ? "Automa C p.2" : "", colonies(c) ? "Automa C p.4" : "",
          turmoil(c) ? "Automa C p.6" : "", corps(c) ? "Automa B p.3" : "", hard(c) ? "Automa A p.11" : "");
      } }
  ];

  /* ============================================================== REFERENCE */
  /* the plain statement shown wherever a map-specific MarsBot rule doesn't exist for Amazonis Planitia */
  function amzNote(c, what) {
    return noBoard(c) ? note("Not covered: " + what + " The Automa books cover six maps (" + SIX_MAPS + ") and never mention Amazonis Planitia (Automa A p.2; Automa C p.8).") : "";
  }
  function trackRows(c) {
    var rows = ROWS[boardId(c)].map(function (r) { return [r[0], r[1], r[2]]; });
    if (venus(c)) rows.push(["Venus (Venus Next board)", "Venus", "—"]);
    return rows;
  }

  var reference = [
    /* ---- MarsBot's turn ---- */
    { id: "mb-ref-marsbot-turn", title: "MarsBot's turn",
      when: function (c) { return am(c); },
      html: function (c) {
        return p("If MarsBot has cards left in its action deck, it resolves <b>one card per turn</b>: flip the top card. When its deck is empty, it <b>passes</b> for the rest of the generation.") +
          h("A project card") + ol([
            "Ignore its abilities, effects and restrictions, and MarsBot doesn't pay for it.",
            "For each tag in its top-right corner, <b>left to right, one at a time</b>, advance the matching track one space (see <i>MarsBot's board</i>)." +
              (venus(c) ? " A Venus tag advances its Venus track." : "") + (prelude(c) ? " A wild tag advances its least-advanced track (topmost if tied)." : ""),
            "If a tracker lands on an action icon, MarsBot does that action at once (see <i>Track actions</i>). It can set off more advances.",
            "If a tracker is already at the end of its track, or the card has <b>no tags</b>, it's a <b>Failed Action</b>: MarsBot gains " + failMC(c) + " M€.",
            "Put the card in MarsBot's <b>played pile</b>."
          ]) +
          h("A bonus card") + ol([
            "Resolve its effect if possible. If not, it is <b>not</b> a Failed Action; the card says if MarsBot gets anything else.",
            "Lettered options: check them from the top and resolve only the <b>first one that works</b>.",
            "Put it in the bonus card discard pile, unless it was <b>destroyed</b>: a destroyed card goes back to the box and never returns."
          ]) +
          (hard(c) ? h("Hard milestone rule (" + LEVEL_NAMES[level(c)] + ")") +
            p("On MarsBot's <b>first turn of each generation</b>, if it has at least 8 M€ and one of these holds, it claims a milestone and loses 8 M€, then takes its turn as normal:") + ul([
              "no milestone is claimed yet and it meets 3 or more milestones;",
              "1 milestone is claimed and it meets 2 or more;",
              "2 milestones are claimed and it meets any milestone."
            ]) : "") +
          (colonies(c) ? p("<b>Colonies:</b> whenever MarsBot has 5 or more resources in one storage area of its shipping board during its turn, remove 5 and advance the indicated track one space. The Titan/floater area doesn't count.") : "") +
          (corps(c) ? p("<b>Corporation cubes:</b> when a tracker reaches a space with a cube or M€ from its corporation, resolve the corporation's effect first, then the printed icon, unless the card says otherwise. Moving back up a regressed track doesn't retrigger it.") : "");
      },
      src: function (c) {
        return join("Automa A pp.5–6", prelude(c) ? "Automa C p.1" : "", venus(c) ? "Automa C p.2" : "", colonies(c) ? "Automa C p.4" : "", (hard(c) || easy(c)) ? "Automa A p.11" : "", corps(c) ? "Automa B p.3" : "");
      } },

    /* ---- Your turn against MarsBot ---- */
    { id: "mb-ref-your-turn", title: "Your turn against MarsBot",
      when: function (c) { return am(c); },
      html: function (c) {
        return p("Take your turns as usual, with these exceptions:") + ul([
          "<b>“Remove” resources from any player</b>: remove them from MarsBot's M€ supply, as if they were that resource.",
          "<b>“Steal” resources</b>: you may take them from MarsBot's M€ supply, as if they were that resource.",
          "<b>“Decrease” a player's production</b>: move MarsBot's matching tracker <b>back one space</b> (table below).",
          "<b>No second triggers:</b> put one of MarsBot's player markers on the space a tracker moved back from. Ignore that track's actions until it advances to that space again, then remove the marker.",
          "<b>Counting what other or all players have</b> (tags, events and so on): use MarsBot's track positions, not its played cards. For events, use its event track. Always use the tracker's current position, even after a regression."
        ]) + tbl(["You decrease its…", "MarsBot moves back its…"], [
          ["Steel production", "building track"],
          ["Titanium production", "space track"],
          ["M€ production", "event track"],
          ["Energy production", trk(c, "energy")],
          ["Heat production", trk(c, "earth")],
          ["Plant production", trk(c, "plant")]
        ]) + (corps(c) ? note("Ecoline and Ecotec: if your card destroys or steals plants from your opponent, you may take them from the plants on MarsBot's corporation card. Any excess is lost, and you can't also take from its M€ supply (Automa B p.4).") : "");
      },
      src: function (c) { return join("Automa A pp.4–5", corps(c) ? "Automa B p.4" : ""); } },

    /* ---- A generation against MarsBot ---- */
    { id: "mb-ref-generation", title: "A generation against MarsBot",
      when: function (c) { return am(c); },
      html: function (c) {
        var np = brutal(c) ? 4 : 3;
        var research = draft(c)
          ? "<b>Drafting</b> (this game):" + ol([
              "Draw two piles of 4 project cards. Take one; give MarsBot the other.",
              "Pick 1 card from your pile to keep. From MarsBot's pile give it 1 card " + (corps(c) ? "by its corporation's Draft Priority: the best-matching card, at random among equal matches, and at random if none match (see <i>MarsBot corporations</i>); at random if its corporation has no Draft Priority" : "at random") + ".",
              "Swap piles and repeat until you've each kept 4.",
              brutal(c) ? "Brutal: MarsBot keeps all 4." : (corps(c)
                ? "Shuffle MarsBot's 4 and discard 1 to the project discard pile. With a Draft Priority, reveal them one by one instead: set aside matches and discard the first card that doesn't match (if all match, discard none)."
                : "Shuffle MarsBot's 4 and discard 1 to the project discard pile."),
              "Shuffle a bonus card into its cards: this is its new action deck. You choose which of your 4 to buy, as usual."
            ])
          : "<b>Not drafting</b> (this game): you draw 4 cards to buy as usual; MarsBot's new action deck is <b>" + np + " project cards + 1 bonus card</b>" + (brutal(c) ? " (Brutal: 4 project cards)" : "") + "." +
            (corps(c) ? " If MarsBot's corporation shows a Draft Priority, you must draft instead." : "");
        var floaters = "";
        if (venus(c) || colonies(c)) {
          floaters = "<b>Floaters:</b> at the end of the Research phase, if " +
            (venus(c) ? "the Hoverlord milestone can no longer be claimed and MarsBot has 5 or more floaters"
              : "MarsBot has 5 or more floaters in its Titan storage area (without Venus Next it acts as if Hoverlord were gone)") +
            ", it spends 5 to " + (brutal(c) ? "gain a 5th card from the project deck (Brutal)" : (draft(c) ? "keep its 4th drafted card instead of discarding it" : "gain a 4th card from the project deck")) + ".";
        }
        var extras = [venus(c) ? "Government Intervention" : "", turmoil(c) ? "Party Politics" : "", colonies(c) ? "Shipping Lines (and Extended Shipping Lines once its second fleet is unlocked)" : ""].filter(Boolean);
        return ol([
          "<b>Player order</b> (from generation 2): pass the first player marker between you and MarsBot, as in a two-player game.",
          "<b>Research</b> (from generation 2): MarsBot builds a new action deck and pays nothing for it. " + research +
            ul([
              floaters,
              "If MarsBot's bonus deck is empty, shuffle its bonus discard pile to form a new one, never including destroyed cards.",
              extras.length ? "Then shuffle in " + listAnd(extras) + "." : ""
            ]),
          "<b>Action</b>: alternate turns until you have both passed. MarsBot resolves one card a turn and passes when its deck is empty.",
          "<b>Production</b>: yours as usual; MarsBot skips it.",
          (venus(c) || colonies(c) || turmoil(c)) ? "<b>Solar phase</b>: step 1, the game-end check, as usual." +
            (venus(c) ? " Step 2, World Government Terraforming, is <b>not</b> carried out: Government Intervention replaces it." : "") +
            (colonies(c) ? " Step 3, colony production, as usual: trade fleets, MarsBot's included, return." : "") +
            (turmoil(c) ? " Step 4, Turmoil, with MarsBot's changes (see <i>Turmoil against MarsBot</i>)." : "") : ""
        ]);
      },
      src: function (c) {
        return join("Automa A pp.4–5", brutal(c) ? "Automa A p.11" : "", corps(c) ? "Automa B p.2" : "", venus(c) ? "Automa C pp.2–3" : "",
          colonies(c) ? "Automa C p.4" : "", turmoil(c) ? "Automa C p.6" : "",
          venus(c) ? "Venus p.3" : "", colonies(c) ? "Colonies p.3" : "", turmoil(c) ? "Turmoil p.7" : "");
      } },

    /* ---- MarsBot's board: tags and tracks ---- */
    { id: "mb-ref-board", title: "MarsBot's board: which tag moves which track",
      when: function (c) { return am(c); },
      html: function (c) {
        var b = boardId(c);
        return p("Each tag on a card MarsBot resolves advances the track showing that tag." + (b ? " The " + boardName(c) + " MarsBot board:" : "")) +
          (b ? tbl(["Track", "Tags that advance it", "Production decrease that moves it back"], trackRows(c)) : "") +
          (b && PAIR_CHANGES[b] ? note("Different from Tharsis: " + PAIR_CHANGES[b]) : "") +
          (ma(c) && mapId(c) !== "tharsis" ? note("With the M&A tiles MarsBot uses its Tharsis board on every map (Automa C p.13).") : "") +
          amzNote(c, "there's no MarsBot board for Amazonis Planitia, so the books don't say which tags share a track on this map.") +
          ul([
            prelude(c) ? "<b>Wild tag</b> (Prelude): advance the least-advanced track, the topmost if tied." : "",
            "“Topmost” (tracks) means as printed on your MarsBot board; “leftmost” (milestones and awards) means as laid out on the game board."
          ]);
      },
      src: function (c) { return join("Automa A pp.3–5", boardSrc(c), venus(c) ? "Automa C p.2" : "", prelude(c) ? "Automa C p.1" : ""); } },

    /* ---- track actions ---- */
    { id: "mb-ref-track-actions", title: "MarsBot board track actions",
      when: function (c) { return am(c); },
      html: function (c) {
        var fl = venus(c) ? "Put a resource token on the floater storage area to the right of its Venus track."
          : (colonies(c) ? "Put a resource token in the Titan storage area of its Colonies shipping board." : "Ignore it (needs Venus Next or Colonies).");
        return p("When a tracker lands on an icon, MarsBot does that action at once. If it <b>can't</b>, it takes a <b>Failed Action</b> (" + failMC(c) + " M€). An icon for an expansion you aren't using is simply <b>ignored</b>, with no Failed Action.") +
          tbl(["Icon", "Action", "What MarsBot does"], [
            ["Red arrow", "Advance tracker", easy(c) ? "<b>Easy: ignore it.</b>" : "Move this tracker to the next space; that may set off another action."],
            ["Another track's tag", "Advance another track", "Advance the track with that tag; that may set off another action."],
            ["Orange TR icon", "Gain TR", "Gain the number of TR the icon shows."],
            ["Black “M” banner", "Claim milestone", "Claim, for free, an unclaimed milestone it qualifies for. If it qualifies for several: 1) one you also qualify for, 2) the one you're closest to, 3) the leftmost" + (venus(c) ? " (Hoverlord counts as last)" : "") + ". Failed Action if 3 are claimed or it qualifies for none."],
            ["Gold “A” disc", "Fund award", "Fund, for free, the award it's <b>most ahead of you</b> on (ties: the leftmost" + (venus(c) ? ", with Venuphile last" : "") + "). Failed Action if 3 are funded or it isn't ahead of you on any."],
            ["Thermometer", "Raise temperature", "Raise the temperature 1 step."],
            ["Green hex with a tree", "Place a greenery (+ raise oxygen)", "Place a greenery tile with its player marker, then raise oxygen 1 step (see <i>Where MarsBot places tiles</i>)."],
            ["Blue hex with a drop", "Place ocean", "Place an ocean tile on an ocean-reserved space."],
            ["Grey hex with a skyline", "Place a city", "Place a city tile with its player marker."],
            ["Venus “V” gauge", "Raise Venus 1 step", venus(c) ? "Raise Venus 1 step and gain 1 TR as normal. Failed Action if Venus is maxed." : "Ignore it (needs Venus Next)."],
            ["Cloud on a yellow square (floater)", "Gain floater", fl],
            ["Dark triangle with a dome (colony)", "Place a colony (Utopia Planitia board)", colonies(c) ? "Place a colony the way Outer System Foothold and Expedited Construction do, gaining 2 resources in that tile's storage area." : "Ignore it (needs Colonies)."]
          ]) +
          h("For awards") + ul([
            "For awards that count leftover resources (Thermalist, Miner and so on), MarsBot compares its value with your current resources <b>plus your production</b>.",
            easy(c) ? "Easy: MarsBot's award values are all 5 lower." : ""
          ]);
      },
      src: function (c) { return join("Automa A pp.8–9", easy(c) ? "Automa A p.11" : "", venus(c) ? "Automa C p.2" : "", colonies(c) ? "Automa C p.4" : "", "Automa C p.8"); } },

    /* ---- tile placement ---- */
    { id: "mb-ref-placement", title: "Where MarsBot places tiles",
      when: function (c) { return am(c); },
      html: function (c) {
        var m = mapId(c), tid = tieId(c), ties = tid ? TIES[tid] : null;
        var special = [];
        if (m === "hellas") special.push("<b>South Pole</b> (ocean bonus, −6 M€): if oceans remain and MarsBot has 6+ M€, this hex ranks above other 2-bonus hexes (otherwise the same for other tiebreakers). If MarsBot places there, it doesn't gain the 2 resources: it places an ocean (+1 TR) and loses 6 M€. Otherwise it counts as a hex without rewards, and placing there gains or costs nothing.");
        if (m === "cimmeria") special.push("<b>MSL Curiosity</b> (colony, −5 M€): " + (colonies(c)
          ? "if a colony tile without a MarsBot colony is available and MarsBot has 5+ M€, this hex ranks above other 2-bonus hexes but below 3-resource ones (otherwise the same for other tiebreakers). If MarsBot places there, it doesn't gain the 2 resources: it places a colony (the Expedited Construction method, gaining 2 matching resources) and loses 5 M€. Otherwise it counts as a hex without rewards, and placing there gains or costs nothing."
          : "without Colonies this hex is empty, for MarsBot and for you."));
        if (m === "vastitas") {
          special.push("<b>North Pole</b> (temperature bonus, −4 M€): if the temperature isn't maxed and MarsBot has 4+ M€, this hex ranks above other 2-bonus hexes (otherwise the same for other tiebreakers). If MarsBot places there, it doesn't gain the 2 resources: it raises the temperature (+1 TR) and loses 4 M€. Otherwise it counts as a hex without rewards, and placing there gains or costs nothing.");
          special.push("<b>Viking 1 and 2</b> (delegate bonus): " + (turmoil(c) ? "you gain the delegate when you place there; MarsBot gains 1 M€, as for any other bonus." : "without Turmoil these hexes are empty for MarsBot's tiebreakers and give it nothing."));
        }
        return h("Placement rules") + ul([
          "<b>Greenery:</b> next to as many of MarsBot's own cities as possible, and as few of yours, following the usual greenery rules (next to its own tiles when possible; never on reserved spaces). Then the tiebreakers.",
          "<b>City:</b> next to as much existing greenery as possible, following the usual city rules (not next to another city; never on reserved spaces). Then the tiebreakers.",
          "<b>Ocean:</b> any ocean-reserved space, by the tiebreakers.",
          "For cities and greeneries, the tiebreakers come <b>after</b> these adjacency conditions."
        ]) +
          (ties ? h("Tiebreakers (" + MAP_NAMES[tid] + ")") + ol(ties)
            : h("Tiebreakers") + p("The books give tiebreaker lists for Tharsis (Automa A p.9) and for the five other MarsBot maps (Automa C p.10), but none for Amazonis Planitia.")) +
          (ma(c) && m !== "tharsis" ? note("With the M&A tiles, MarsBot uses its Tharsis board and reference card on every map (Automa C p.13). The per-map lists are printed “on player aids for each individual board” (Automa C p.10), and the books don't say whether " +
            (amz(c) ? "this Tharsis list then applies on Amazonis Planitia, which has no list of its own."
              : "this Tharsis list or " + mapName(c) + "'s own applies here (" + mapName(c) + ": " + TIE_SUMMARY[m] + ")." + (special.length ? " Its special hexes are listed below either way." : ""))) : "") +
          (ma(c) ? note("M&A tiles can adjust these: with Geologist, volcanic spaces and their neighbours count 1 extra icon; with Founder, spaces next to special tiles (Neural Instance included) do; with Suburbian, edge spaces do; with Highlander, “next to oceans” ranks below “most placement bonus” (Automa C pp.13–15).") : "") +
          h("What MarsBot gains") + ul([
            "<b>Next to an ocean:</b> MarsBot gains 2 M€. Unlike the Base rule (2 M€ for each adjacent ocean), the Automa rule doesn't say “per ocean”.",
            "<b>Placement-bonus icons</b> (plants, steel, titanium, cards and so on): 1 M€ per icon covered instead of the printed rewards.",
            "<b>Temperature steps with heat production</b> (−24 °C and −20 °C): 2 M€ instead of the heat production.",
            "A temperature or oxygen step that gives <b>another terraforming action</b>: MarsBot resolves it at once, or takes a Failed Action if it can't.",
            "Every global parameter MarsBot raises gives it <b>TR as normal</b>."
          ]) +
          (special.length ? h("Special hexes on " + mapName(c)) + ul(special) : "") +
          (amz(c) ? note("Not covered: the Automa books never mention Amazonis Planitia's wild-resource or delegate bonus spaces. The general rule above (1 M€ per placement-bonus icon covered, instead of the printed reward) is all they say about placement bonuses.") : "");
      },
      src: function (c) {
        var m = mapId(c);
        return join("Automa A p.9", "Base p.5", m === "tharsis" ? "" : (amz(c) ? "Automa C p.10" : "Automa C pp.10–11"), ma(c) ? "Automa C pp.13–15" : "", amz(c) ? "A&V wrap" : "");
      } },

    /* ---- failed actions ---- */
    { id: "mb-ref-failed", title: "Failed actions",
      when: function (c) { return am(c); },
      html: function (c) {
        return p("When MarsBot tries to take an action or resolve a project card but can't, it takes a <b>Failed Action</b> and gains <b>" + failMC(c) + " M€</b>" + (easy(c) ? " (Easy: 3 M€ instead of 5)" : "") + ". For example:") + ul([
          "It resolves a project card with no tags.",
          "A tracker lands on an action it can't take, such as raise temperature when the temperature is maxed.",
          "It must advance a track that's already at its end.",
          "Claim milestone: 3 milestones are claimed, or it meets none.",
          "Fund award: 3 awards are funded, or it isn't ahead of you on any.",
          "Its temperature or oxygen raise reaches a bonus step that gives another terraforming action, and it can't take that action.",
          venus(c) ? "Raise Venus when Venus is maxed." : "",
          colonies(c) ? "A colony on Europa when no ocean can be placed." : ""
        ]) + p("<b>Not</b> Failed Actions: a bonus card it can't resolve, and an icon for an expansion you aren't using, which is simply ignored.");
      },
      src: function (c) { return join("Automa A pp.5–6, 8", easy(c) ? "Automa A p.11" : "", venus(c) ? "Automa C p.2" : "", colonies(c) ? "Automa C p.5" : ""); } },

    /* ---- bonus cards ---- */
    { id: "mb-ref-bonus", title: "MarsBot bonus cards",
      when: function (c) { return am(c); },
      html: function (c) {
        var deck = bonusDeckRows(c).map(function (r) { return [r[0], "<b>" + r[1] + "</b>", r[2]]; });
        var only = actionOnlyRows(c).map(function (r) { return [r[0], "<b>" + r[1] + "</b>", r[2]]; });
        return h("In the bonus deck") + tbl(["No.", "Card", "Effect"], deck) +
          (only.length ? h("Shuffled into the action deck, not the bonus deck") + tbl(["No.", "Card", "Effect"], only) : "") +
          ul([
            "<b>Destroy</b> = remove it from play: back in the box for the rest of the game.",
            "An empty bonus deck is rebuilt from the bonus discard pile, never including destroyed cards.",
            "Card anatomy: name, a use-case reminder icon, image, number, effect, a beginning-of-round effect (cards shuffled into the action deck every round) and the use case (which board, expansion or corporation it's for).",
            corps(c) ? "Corporation-specific bonus cards come with the MarsBot corporation that mentions them; resolve them as printed." : "",
            colonies(c) ? "Automa C p.4 numbers the Colonies Expedited Construction “B16”, the number Automa A p.6 and C p.2 give Government Intervention, so identify it by name." : ""
          ]);
      },
      src: function (c) {
        return join("Automa A pp.3–4, 6–7", venus(c) ? "Automa C pp.2–3" : "", colonies(c) ? "Automa C pp.4–5" : "", turmoil(c) ? "Automa C p.6" : "",
          (mapId(c) !== "tharsis" && !ma(c)) ? "Automa C p.8" : "", (ma(c) || amz(c)) ? "Automa C p.13" : "", corps(c) ? "Automa B p.1" : "");
      } },

    /* ---- Corporate Competition helpers ---- */
    { id: "mb-ref-cc", title: "Corporate Competition: helper actions",
      when: function (c) { return am(c); },
      html: function (c) {
        var cc = ccCard(c);
        if (!cc) return p("<b>Not covered.</b> " + NO_AMZ_CC + " So the books give no helper actions for Amazonis Planitia's awards.") +
          p("How the card works on the other maps: if MarsBot has at least 5 M€, it tries to help itself on the closest funded award with that award's helper action; if one resolves, it loses 5 M€, and if none does, it draws another bonus card and resolves it.");
        return p("<b>" + cc.name + " (" + cc.n + ", " + cc.which + ")</b>: if MarsBot has at least 5 M€, it tries to help itself on the <b>closest funded award</b>:") + ul([
          "The closest is the funded award you lead by the smallest margin, or are tied on. If MarsBot leads every funded award, it's the one it leads by the smallest margin.",
          "It skips awards whose helper action is impossible and tries the next closest.",
          "If a helper action resolved, MarsBot <b>loses 5 M€</b> and the card is discarded. If none did, draw another bonus card and resolve it, discarding both."
        ]) + tbl(["Award", "Helper action"], helpRows(c));
      },
      src: function (c) {
        var m = mapId(c);
        return join("Automa A p.7", ma(c) ? "Automa C pp.13, 16" : ((m !== "tharsis" && !amz(c)) ? "Automa C pp.8, 12" : ""), noBoard(c) ? "Automa C pp.8, 13" : "", venus(c) ? "Automa C p.3" : "");
      } },

    /* ---- milestones & awards ---- */
    { id: "mb-ref-ma", title: "Milestones & awards: how MarsBot measures up",
      when: function (c) { return am(c); },
      html: function (c) {
        var label = ma(c) ? "Milestones & Awards tiles (on MarsBot's Tharsis board)" : mapName(c);
        var ms = msRows(c), aw = awRows(c);
        return h("Claiming and funding") + ul([
          "MarsBot claims milestones and funds awards <b>for free</b>, when an “M” or “A” track icon or a bonus card tells it to." + (hard(c) ? " (The Hard milestone rule is the exception: that purchase costs it 8 M€.)" : ""),
          "<b>Milestone:</b> an unclaimed one it qualifies for. If several: 1) one you also qualify for, 2) the one you're closest to, 3) the leftmost" + (venus(c) ? ", with Hoverlord counting as last" : "") + ".",
          "<b>Award:</b> the one it's most ahead of you on (ties: the leftmost" + (venus(c) ? ", with Venuphile last" : "") + "). For awards that count leftover resources, your value is your resources plus your production.",
          "<b>Final scoring:</b> 5 VP to the award winner and, in a two-player game, <b>no second place</b>. Ties are friendly: both get the 5 VP.",
          easy(c) ? "<b>Easy:</b> MarsBot's award values are 5 lower." : "",
          "“Leftmost” means as laid out on the game board (with the M&amp;A tiles, the tiles' left-to-right positions). The Automa books don't define it further."
        ]) +
          (noBoard(c) ? h("Milestones and awards: Amazonis Planitia") +
            p("<b>Not covered:</b> there's no board reference card for Amazonis Planitia, and the Automa books never mention this map, so they don't rate the milestones (" + listAnd(AMZ_MS) + ") or awards (" + listAnd(AMZ_AW) + ") printed on it for MarsBot." +
              (venus(c) ? " Venus Next's Hoverlord and Venuphile are rated on any map (below)." : "")) : "") +
          (ms.length ? h("Milestones: " + (noBoard(c) ? "Venus Next" : label)) + tbl(["Milestone", "MarsBot qualifies when…"], ms) : "") +
          (aw.length ? h("Awards: " + (noBoard(c) ? "Venus Next" : label)) + tbl(["Award", "MarsBot's value"], aw) : "") +
          (ma(c) ? note("Choose the 5 + 5 tiles as usual, but leave out Terraformer. With Venus Next, Hoverlord and Venuphile are added as normal (M&A p.1).") : "");
      },
      src: function (c) {
        var m = mapId(c);
        return join("Automa A pp.8–9", (m === "hellas" || m === "cimmeria" || m === "utopia") && !ma(c) ? "Automa A p.2" : "",
          ma(c) ? "Automa C pp.13–15 · M&A pp.1–4" : ((m !== "tharsis" && !amz(c)) ? "Automa C pp.9–10" : ""),
          noBoard(c) ? "Automa A p.2 · Automa C p.8 · A&V wrap" : "", venus(c) ? "Automa C pp.2–3" : "", "Base p.11",
          (m === "hellas" || m === "elysium") && !ma(c) ? "H&E wrap" : "", (m === "utopia" || m === "cimmeria") && !ma(c) ? "U&C wrap" : "",
          m === "vastitas" && !ma(c) ? "A&V wrap" : "", turmoil(c) && m === "tharsis" && !ma(c) ? "Turmoil p.2" : "");
      } },

    /* ---- game end ---- */
    { id: "mb-ref-end", title: "Game end and MarsBot's score",
      when: function (c) { return am(c); },
      html: function (c) {
        /* the final scoring reference card: Base column (Automa A p.10) and Prelude column (Automa C p.1) */
        var RATE = ["1 VP per 8 M€", "1 VP per 7 M€", "1 VP per 6 M€", "1 VP per 5 M€", "1 VP per 4 M€", "1 VP per 3 M€", "1 VP per 2 M€", "1 VP per 1 M€", "<b>MarsBot instantly wins</b>"];
        var BASE = ["Up to 12", "13", "14", "15", "16", "17", "18", "19", "20"], PREL = ["Up to 10", "11", "12", "13", "14", "15", "16", "17", "18"];
        var head = pnc(c) ? ["Generation (standard)", "Generation (Prelude changes)", "MarsBot's leftover M€"] : ["Game ended in generation", "MarsBot's leftover M€"];
        var rows = RATE.map(function (r, i) { return pnc(c) ? [BASE[i], PREL[i], r] : [(pcards(c) ? PREL : BASE)[i], r]; });
        return ul([
          "<b>Instant loss:</b> if the game enters generation " + lossHtml(c) + (pcards(c) ? " before the game-end trigger (Prelude)" : "") + ", you lose.",
          "Otherwise, once all three global parameters are maxed, <b>finish the generation</b>. Both of you may then place final greenery tiles in turn order, as usual.",
          "MarsBot places one final greenery for <b>each track whose next space is a greenery action</b>: move that tracker forward and do the greenery action."
        ]) + h("MarsBot's score: as usual, except") + ol([
          noBoard(c)
            ? "<b>Awards:</b> the books don't rate Amazonis Planitia's own awards for MarsBot, since it has no board reference card" + (venus(c) ? "; Venuphile is its Venus track, as on any map" : "") + (easy(c) ? " (5 lower on Easy)" : "") + ". See <i>Milestones &amp; awards</i>."
            : "<b>Awards:</b> rated by " + (ma(c) ? "Automa C's list for the Milestones &amp; Awards tiles" : "the " + boardName(c) + " board reference card") + " (see <i>Milestones &amp; awards</i>)" + (easy(c) ? ", 5 lower on Easy" : "") + ".",
          hard(c) ? "<b>Cards:</b> 1 VP for each card in its played pile with a <b>non-negative VP icon</b> (" + LEVEL_NAMES[level(c)] + "); no other VP from its cards." : "<b>No VP from the cards it played.</b>",
          "<b>Neural Instance:</b> 1 VP for each space next to its Neural Instance tile that <b>you don't occupy</b> (empty, or holding one of its tiles). No tile in play, no VP.",
          "<b>Leftover M€:</b> VP by the generation the game ended in, with fractions rounded down (table).",
          turmoil(c) ? "<b>Turmoil:</b> you and MarsBot each score 1 VP per Party Leader and 1 VP for the Chairman." : ""
        ]) + tbl(head, rows) +
          (pnc(c) ? note("Prelude without Prelude cards: the Automa books don't say which column applies (see <i>Prelude against MarsBot</i>). Use the one you agreed on.") : "") +
          p("<b>You win only if you beat MarsBot's score. A tie is a win for MarsBot.</b>") +
          (pcards(c) ? "" : note("Example (Automa A p.10): you finish terraforming in generation 14 and MarsBot has 24 M€: 1 VP per 6 M€, so it gains 4 VP. Had it been generation 16, it would gain 6 VP."));
      },
      src: function (c) { return join("Automa A p.10", "Base p.12", prelude(c) ? "Automa C p.1" : "", ma(c) ? "Automa C pp.13–15" : "", noBoard(c) ? "Automa C p.8" : "", hard(c) || easy(c) ? "Automa A p.11" : "", turmoil(c) ? "Automa C p.7" : ""); } },

    /* ---- difficulty ---- */
    { id: "mb-ref-difficulty", title: "MarsBot difficulty levels",
      when: function (c) { return am(c); },
      html: function (c) {
        var cur = level(c);
        function row(k, txt) {
          var r = { cells: [LEVEL_NAMES[k] + (k === cur ? " <b>(this game)</b>" : ""), txt] };
          if (k === cur) r.cls = "is-current";
          return r;
        }
        return tbl(["Level", "Changes"], [
          row("easy", ul(["Ignore the <b>Advance Tracker</b> (red arrow) icons.", "Failed Actions give MarsBot <b>3 M€</b> instead of 5.", "MarsBot's award values are <b>5 lower</b>."])),
          row("normal", "The default: the rules as written."),
          row("hard", ul(["MarsBot gains <b>1 VP for each card</b> in its played pile with a non-negative VP icon.",
            "On its <b>first turn each generation</b>, with at least 8 M€, it claims a milestone and loses 8 M€ if: none is claimed and it meets 3+; 1 is claimed and it meets 2+; or 2 are claimed and it meets any. Then it takes its turn as normal."])),
          row("brutal", ul(["Both Hard changes.", "MarsBot starts with <b>4 project cards</b> instead of 3 and <b>keeps all 4</b> cards it gets in each Research phase."]))
        ]) + ul([
          "You needn't use every change of a level: pick the ones you want and scale the difficulty to taste.",
          corps(c) ? "MarsBot corporations make it harder, so consider a lower level while you learn them (Automa B p.1)." : "",
          ma(c) ? "With the M&A tiles, the book recommends the Hard milestone rule to keep the pressure on (Automa C p.13)." : "",
          turmoil(c) ? "Turmoil has its own ways to toughen MarsBot (see <i>Turmoil against MarsBot</i>)." : ""
        ]);
      },
      src: function (c) { return join("Automa A p.11", corps(c) ? "Automa B p.1" : "", ma(c) ? "Automa C p.13" : "", turmoil(c) ? "Automa C p.7" : ""); } },

    /* ---- MarsBot corporations ---- */
    { id: "mb-ref-corps", title: "MarsBot corporations",
      when: function (c) { return am(c) && corps(c); },
      html: function () {
        return h("Card anatomy") + ol(["Corporation name.", "Logo.", "<b>Starting tags</b>, resolved when the card is played at the start of the game.", "<b>Draft Priority</b>.",
          "<b>Setup</b>, resolved when the card is played.", "<b>Effect</b>, an ability MarsBot has all game.", "<b>Round Start / Before Action Phase</b>, effects that happen every generation.", "Card number."]) +
          h("Draft Priority") + p("If MarsBot's corporation has one, you <b>must use the Draft variant</b>, and from generation 2 MarsBot drafts like this:") + ol([
            "Draw two piles of 4. Take one; give MarsBot the other. Pick 1 card from your pile to keep.",
            "From MarsBot's pile, give it the card that matches its Draft Priority. If several match equally, pick one of them at random; if none match, pick any at random.",
            "A card with more matching tags beats one with fewer. With several priorities separated by “>”, only the first counts unless no card matches it; a card with the first and the second tag beats one with just the first, and a card with the first tag twice beats both.",
            "The wild tag never matches a Draft Priority.",
            "Swap piles and repeat until you've each kept 4.",
            "Shuffle MarsBot's 4 cards and reveal them one at a time: set aside each card with a matching tag, and discard the first card without one. If all 4 match, it discards none.",
            "Shuffle a bonus card into them: its action deck is 4 cards, occasionally 5. You choose which of your cards to buy as usual."
          ]) + note("Examples (Automa B p.2): Celestic takes a card with two Venus tags first, then one Venus tag, then a Jovian tag, else random. Saturn Systems takes space + Jovian over Jovian alone, and Jovian alone over space alone.") +
          h("Special cases") + ul([
            "<b>Credicor:</b> takes the most expensive card from each pile (random among ties). At the discard step it keeps the most expensive and discards one of the others; if all 4 cost the same, it discards none.",
            "<b>Aridor:</b> set its priority at the start of each draft. The book's example: with the power and Venus tracks on space 3 and every other track on 4+, the priority is power, because power sits higher on MarsBot's board than Venus. That priority is used for both picking and discarding, and re-evaluated only the next generation.",
            "<b>Spire:</b> takes the card with the most tags (random among ties). At the discard step it keeps the card(s) with the most tags and discards one of the others; if all 4 tie, it discards none."
          ]) +
          h("Every generation") + ul([
            "Boxes marked <b>“Round Start”</b> or <b>“Before Action Phase”</b> are resolved at that time. “Before Action Phase” boxes also resolve after setup, before the first action phase."
          ]) +
          h("Special cubes on MarsBot's tracks") + ul([
            "Some corporations put M€, white cubes or black cubes on track spaces at setup. When a tracker reaches one, resolve the corporation's effect <b>before and in addition to</b> the printed icon, unless the card says otherwise.",
            "If you regress a track, advancing again doesn't retrigger a corporation trigger that already fired."
          ]) +
          h("Corporation FAQ") + ul([
            "<b>Ecoline, Ecotec:</b> if your cards destroy or steal plants from your opponent, you may take them from the plants on MarsBot's corporation card. Any excess is lost, and you can't also take from its M€ supply.",
            "<b>Saturn Systems:</b> triggers only when you or MarsBot play a card with a Jovian tag, not when a tracker advances by a track effect. Your Prelude with a Jovian tag triggers it; your corporation's tag doesn't, because your corporation is played before MarsBot's. If you're Saturn Systems and MarsBot's corporation has a Jovian starting tag, your ability triggers.",
            "<b>Pharmacy Union, Splice</b> (promos): if you play one and MarsBot's starting corporation, or any track or bonus effect, gives it a microbe advance (not plant or animal), resolve your effect as for a card with a microbe tag. If MarsBot plays one, your Prelude's microbe tag triggers it, but your corporation's tag doesn't.",
            "<b>Aphrodite, Lakefront Resorts:</b> they override Government Intervention's “no M€”. Aphrodite gains 2 M€ when that card raises Venus; Lakefront Resorts places a white cube or advances the building track when it places an ocean. MarsBot still gets no TR from it.",
            "<b>Pristar:</b> Government Intervention doesn't trigger its ability.",
            "<b>Utopia Investments:</b> regressed tracks don't retrigger their icons on later advances, and neither do tracks you push back with production-reduction effects. To remember, put one of MarsBot's player markers on each space a track regresses from."
          ]);
      },
      src: function () { return "Automa B pp.1–4"; } },

    /* ---- Venus Next ---- */
    { id: "mb-ref-venus", title: "Venus Next against MarsBot",
      when: function (c) { return am(c) && venus(c); },
      html: function (c) {
        return ul([
          "<b>Venus tags</b> advance MarsBot's Venus track (Venus Next MarsBot board). It works exactly like its other tracks.",
          "<b>Raise Venus</b> icon: raise Venus 1 step and gain 1 TR as normal; Failed Action if Venus is maxed.",
          "<b>Gain Floater</b> icon: put a resource token on the floater storage area to the right of its Venus track.",
          "<b>Floaters buy cards:</b> at the end of the Research phase, if Hoverlord can no longer be claimed and MarsBot has 5+ floaters, it spends 5. Drafting: it keeps its 4th drafted card instead of discarding it. Not drafting: it gains a 4th card from the project deck. Brutal: it gains a 5th card.",
          "<b>Government Intervention (B16)</b> goes into every new action deck, the first included. Only the first that applies: on an even generation, or once Venus is complete, it advances the Martian parameter furthest from completion (ties: oxygen, ocean, temperature); otherwise it raises Venus 1 step. MarsBot gets no TR and no M€ bonuses from it, even for knock-on raises.",
          "<b>Solar Phase step 2</b> (World Government Terraforming) is never carried out: Government Intervention replaces it.",
          "<b>Milestones and awards:</b> Hoverlord means 7 floaters and Venuphile is its Venus track; each counts as last in a “leftmost” tie. Planner (Tharsis) and Generalist (Elysium) skip the Venus track; Diversifier (Hellas) needs 7 of the 8 tracks.",
          "<b>Bonus cards:</b> Lobbyists B15 replaces B06; every Corporate Competition gains a Venuphile helper (advance the Venus track); Invasive Species gives MarsBot 2 M€ and 1 floater instead of 5 M€.",
          corps(c) ? "<b>Aphrodite, Lakefront Resorts, Pristar:</b> see <i>MarsBot corporations</i> for how they interact with Government Intervention." : "",
          "<b>Sponsored Academies:</b> if you play it, MarsBot gains 1 M€ instead of the free card."
        ]) + note("Not covered by the Automa books: what MarsBot gets when it raises Venus onto its 8% card-draw bonus step.");
      },
      src: function (c) { return join("Automa C pp.2–3", "Automa A pp.6, 11", corps(c) ? "Automa B p.4" : "", "Venus p.2"); } },

    /* ---- Colonies ---- */
    { id: "mb-ref-colonies", title: "Colonies against MarsBot",
      when: function (c) { return am(c) && colonies(c); },
      html: function (c) {
        return h("MarsBot's colonies and trades") + ul([
          "MarsBot builds colonies through " + listAnd(["its bonus cards (Expedited Construction, Outer System Foothold)",
            mapId(c) === "utopia" && !ma(c) ? "the colony icon on its Utopia Planitia board" : "",
            mapId(c) === "cimmeria" ? "the MSL Curiosity hex" : "",
            ma(c) ? "the Pioneer/Constructor cubes, if those tiles are in play" : ""]) + ". It picks " + COLONY_RANDOM + ".",
          "<b>Placing a colony:</b> ignore the tile's placement reward. MarsBot gains <b>2 resources</b> in that tile's storage area on its shipping board (11 areas, one per colony tile).",
          "<b>MarsBot trading</b> (Shipping Lines, Extended Shipping Lines): it picks the tile with the most advanced track (ties: one with its colony, then random), loses 1 M€ and trades. Ignore the trade income: it gains 2 resources in that tile's storage area, +1 if it has a colony there. Your colonies on that tile get their colony bonus as usual.",
          "<b>You trading:</b> trade income and colony bonuses as normal. If MarsBot has a colony on that tile, it gains 1 resource in that storage area.",
          "Both of you observe <b>one trade fleet per colony tile</b>.",
          "<b>5 resources in one area</b> during MarsBot's turn: remove them and advance the indicated track 1 space (not the Titan/floater area)."
        ]) + h("Special colony tiles") + ul([
          "<b>Europa:</b> a MarsBot colony there places an ocean instead (gaining 1 TR as usual), or is a Failed Action if it can't. Trading there raises its TR 1 step (it still loses 1 M€). Its colony bonus is 1 M€. No resources ever go in Europa's area.",
          "<b>Titan:</b> its storage area is used only without Venus Next, for floaters. MarsBot spends floaters only by the Research-phase floater rule.",
          "<b>Pluto:</b> MarsBot gains science resources in that area, not cards.",
          "Resources in the Ceres, Luna, Io, Enceladus, Ganymede, Callisto, Miranda and Triton areas count as that resource type for your cards: you may steal or remove them as usual."
        ]) + h("Fleets and its action deck") + ul([
          "<b>Shipping Lines</b> is shuffled into MarsBot's action deck after each Research phase, from generation 2.",
          "<b>Second trade fleet:</b> when its " + trk(c, "energy") + " reaches space 9, resolve that space and move the fleet to the Trade Fleets tile, marked with a MarsBot player marker. From the next generation, <b>Extended Shipping Lines</b> joins too, so it trades twice per generation.",
          venus(c) ? "Floaters follow the Venus Next rules." : "Without Venus Next, <b>Gain Floater</b> puts a token in the Titan storage area, and at the end of the Research phase MarsBot spends 5 floaters as if Hoverlord were no longer available (see <i>A generation against MarsBot</i>)."
        ]) + note("Galilean Waystation: your M€ production rises 1 step per Jovian tag you have plus half (rounded down) MarsBot's " + trk(c, "jovian") + " position (Automa A p.11).");
      },
      src: function (c) {
        return join("Automa C pp.4–6", "Automa A p.11", mapId(c) === "utopia" && !ma(c) ? "Automa C p.8" : "", mapId(c) === "cimmeria" ? "Automa C p.11" : "", ma(c) ? "Automa C pp.13–14" : "");
      } },

    /* ---- Turmoil ---- */
    { id: "mb-ref-turmoil", title: "Turmoil against MarsBot",
      when: function (c) { return am(c) && turmoil(c); },
      html: function (c) {
        var hx = tmHarder(c);
        return ul([
          "You play Turmoil exactly as its rules say. MarsBot <b>ignores the ruling party's policy</b>.",
          "<b>Party Politics (B20)</b> is shuffled into MarsBot's action deck after each Research phase and is in its starting deck."
        ]) + h("Party Politics: where its delegate goes") + p("If MarsBot has a delegate in its reserve, it places 1 in a delegate area, then check whether the Party Leader or the Dominant party changes. Narrow the parties down in this order until one is left:") + ol([
          "a party where 1 delegate would make MarsBot Party Leader <b>and</b> make that party Dominant;",
          "a party where 1 delegate would make MarsBot Party Leader;",
          "a party where MarsBot is already Party Leader and 1 delegate would make it Dominant;",
          "a party where <b>you</b> have the fewest delegates (zero counts; your Party Leader counts);",
          "a party where MarsBot has the fewest delegates (zero counts; its Party Leader counts);",
          "the next party clockwise from the Dominance marker."
        ]) + p("Then, if it still has a delegate in reserve and at least 5 M€, flip a project card (and discard it). If its cost is <b>divisible by 3</b>, MarsBot spends 5 M€ and places a second delegate the same way.") +
          h("Turmoil phase (Solar Phase step 4)") + ol([
            "<b>TR revision:</b> you lose 1 TR as normal; <b>MarsBot doesn't</b>.",
            "<b>Global event:</b> resolve it normally, influence included, but it affects <b>only you</b>. Any first-player choices are yours. For <i>Revolution</i> and <i>Election</i>, resolve the solo version instead of comparing yourself with MarsBot.",
            "<b>New government:</b> as normal, but MarsBot ignores the ruling bonus, <b>gains 1 TR if it becomes Chairman</b>, and never gets a delegate in the lobby.",
            "<b>Changing times:</b> as normal."
          ]) +
          h("Game end") + p("You and MarsBot each score <b>1 VP per Party Leader</b> and <b>1 VP for the Chairman</b>.") +
          h("Tougher MarsBot (optional)") + ul([
            "Reduce its starting TR by <b>7 instead of 10</b>." + (hx === "tr7" ? " <b>(this game)</b>" : ""),
            "After placing the neutral delegates at setup, flip a project card to pick a random party and place <b>1 MarsBot delegate</b> there; it may take the Party Leader seat. For more challenge, do it a second time." + (hx === "del1" ? " <b>(this game: once)</b>" : (hx === "del2" ? " <b>(this game: twice)</b>" : ""))
          ]);
      },
      src: function () { return "Automa C pp.6–7 · Turmoil p.7"; } },

    /* ---- Prelude ---- */
    { id: "mb-ref-prelude", title: "Prelude against MarsBot",
      when: function (c) { return am(c) && prelude(c); },
      html: function (c) {
        return ul([
          pcards(c) ? "MarsBot gets <b>3 extra project cards</b> for its starting action deck instead of Prelude cards, dealt after you pick your Preludes and corporation." : "",
          "<b>Wild tag</b> on a card MarsBot resolves: advance its least-advanced track, the topmost if tied.",
          pcards(c) ? "<b>Shorter clock:</b> if the game enters generation <b>18</b> before the game-end trigger, you lose immediately, and MarsBot's leftover M€ uses the Prelude column of the final scoring card (see <i>Game end</i>)." : "",
          pnc(c) ? "<b>Without Prelude cards</b> (this game): <b>not covered</b>. The Automa books don't mention this variant, so they don't say whether MarsBot's other Prelude changes apply: 3 extra project cards instead of Prelude cards, and the shorter game (you lose on entering generation 18, and MarsBot's M€ scores on the Prelude column). Agree before you start." : "",
          prelude2(c) ? "<b>Prelude 2:</b> Recession isn't supported against MarsBot; keep it out of the Prelude deck." : "",
          corps(c) ? (pcards(c) ? "MarsBot's corporation is drawn after you play your corporation and before you choose and play your Preludes. " : "") + "A wild tag never matches a Draft Priority." : ""
        ]);
      },
      src: function (c) { return join("Automa C p.1", "Automa A p.3", pnc(c) ? "Prelude p.2" : "", corps(c) ? "Automa B pp.1–2" : ""); } },

    /* ---- FAQ ---- */
    { id: "mb-ref-faq", title: "MarsBot FAQ: specific cards",
      when: function (c) { return am(c); },
      html: function (c) {
        return ul([
          "<b>Asteroid Deflection System</b> (promo): blocks Meteor Shower from making you remove plants.",
          "<b>Galilean Waystation</b> (Colonies): your M€ production rises 1 step per Jovian tag you have, plus half (rounded down) of MarsBot's " + trk(c, "jovian") + " position.",
          "<b>Lawsuit</b> (promo): you steal 3 resources from MarsBot and the card goes into MarsBot's played pile, but MarsBot doesn't resolve its icons or lose points for it.",
          "<b>Protected Habitat:</b> blocks Meteor Shower and Invasive Species from making you remove resources.",
          "<b>Sponsored Academies</b> (Venus Next): if you play it, MarsBot gains 1 M€ instead of the free card.",
          "<b>St. Joseph of Cupertino Mission</b> (promo): if you put a cathedral on one of MarsBot's cities, it pays 2 M€ if it can, and instead of drawing a card it advances its least-advanced track (topmost if tied).",
          "<b>Toll Station:</b> your M€ production rises by MarsBot's space track position.",
          "<b>Mons Insurance</b> (promo corporation): can't be used against MarsBot."
        ]);
      },
      src: function () { return "Automa A p.11"; } },

    /* ---- Amazonis ---- */
    { id: "mb-ref-amazonis", title: "Amazonis Planitia and MarsBot",
      when: function (c) { return am(c) && amz(c); },
      html: function (c) {
        return p("<b>Not covered by the Automa books.</b> The MarsBot box has MarsBot boards, board reference cards and Corporate Competition cards for six maps: " + SIX_MAPS + ". None of the three Automa books mentions Amazonis Planitia.") +
          h("What the books cover on this map") + ul([
            "MarsBot's general rules: its turn, your turn against it, the generation, track actions, tile placement conditions and what it gains, failed actions, the bonus cards, difficulty and game end.",
            venus(c) || colonies(c) || turmoil(c) || prelude(c) || corps(c) ? "The rules for the expansions and options you've selected, which don't depend on the map." : "",
            ma(c) ? "With the Milestones &amp; Awards tiles: MarsBot's Tharsis board and reference card “regardless of which board you are using”, Corporate Competition B14, and the rating of every tile except Terraformer, which isn't supported (Automa C pp.13–16)." : ""
          ]) +
          h("What they don't cover") + ul([
            ma(c) ? "" : "Which MarsBot board and board reference card to use: none exists for Amazonis Planitia.",
            ma(c) ? "" : "How MarsBot rates Amazonis's milestones (" + listAnd(AMZ_MS) + ") and awards (" + listAnd(AMZ_AW) + ").",
            ma(c) ? "" : "Which Corporate Competition card goes in MarsBot's bonus deck, and its helper actions.",
            ma(c) ? "Whether the Tharsis tiebreakers apply here (there's no Amazonis list)." : "MarsBot's tile-placement tiebreakers on this map.",
            "The map's wild-resource and delegate bonus spaces, which they never mention. Their general rule is 1 M€ per placement-bonus icon covered, instead of the printed reward (Automa A p.9).",
            "Amazonis's longer global parameters: the books' generation limit and leftover-M€ table don't mention them."
          ]);
      },
      src: function (c) { return join("Automa A pp.2, 9", "Automa C p.8", ma(c) ? "Automa C pp.13–16" : "", "A&V wrap"); } }
  ];

  /* ================================================================== TEACH */
  var SCORE_EX = {
    tharsis: "on Tharsis, Banker is its building and event tracks added together",
    hellas: "on Hellas, Space Baron is simply its space track",
    elysium: "on Elysium, Benefactor is its TR minus 15",
    cimmeria: "on Terra Cimmeria, Mogul is its best track doubled",
    utopia: "on Utopia Planitia, Botanist is its plant track minus 2",
    vastitas: "on Vastitas Borealis, Promoter is its event track"
  };
  var MAP_TEACH = {
    hellas: "On <b>Hellas</b>, MarsBot's board puts Jovian tags with science and gives energy its own track. Its tiles favour the polar rows, and the South Pole when it can pay 6 M€ for that ocean.",
    elysium: "On <b>Elysium</b>, MarsBot's board puts Jovian tags with science and gives energy its own track. For Benefactor its TR counts 15 less, and it counts its events for Celebrity.",
    cimmeria: "On <b>Terra Cimmeria</b>, MarsBot's board puts Jovian tags with Earth and cities with science. Its tiles like to sit next to special tiles, and its Neural Instance counts as special for Founder.",
    utopia: "On <b>Utopia Planitia</b>, MarsBot's board pairs tags as on Tharsis, plus a place-a-colony action that works only with Colonies. Its Manager milestone counts its destroyed bonus cards.",
    vastitas: "On <b>Vastitas Borealis</b>, MarsBot's board puts microbes with science, cities with energy and Jovian tags with Earth. Its tiles favour the North Pole when it can pay 4 M€ for that temperature step."
  };

  var teach = [
    { id: "mb-hook", slot: "hook", h: "Tonight: you against MarsBot",
      when: function (c) { return am(c); },
      body: function (c) {
        return p("<b>MarsBot</b> raises parameters, places tiles and chases milestones and awards like a real rival, but it plays from a small deck and a board of tracks. You win only by <b>beating its score</b>, since ties go to MarsBot, and if the game reaches generation " +
          (pnc(c) ? "20, or 18 if we use MarsBot's Prelude changes," : lossGen(c) + ",") + " you lose.");
      } },
    /* mb-turn and mb-deck follow the core "shape of a generation" section (app.js teach anchor) */
    { id: "mb-turn", slot: "insert", after: "shape", h: "How MarsBot takes a turn",
      when: function (c) { return am(c); },
      body: function (c) {
        var tags = [venus(c) ? "Venus tags move its Venus track" : "", prelude(c) ? "a wild tag moves its least-advanced track, the top one if tied" : ""].filter(Boolean);
        return p("On MarsBot's turn, flip the top card of its action deck. Ignore a project card's text: each tag moves one of its tracks forward a space" + (tags.length ? " (" + listAnd(tags) + ")" : "") +
          ", and when a tracker lands on an icon, MarsBot does it: raises the temperature, places a greenery, ocean or city, gains TR, or takes a milestone or award for free. A card with no tags, or an action it can't take, is a <b>Failed Action</b>, worth " + failMC(c) + " M€ to it. Bonus cards do what they say.");
      } },
    { id: "mb-deck", slot: "insert", after: "shape", h: "MarsBot's deck is its clock",
      when: function (c) { return am(c); },
      body: function (c) {
        var extra = [venus(c) ? "Government Intervention" : "", turmoil(c) ? "Party Politics" : "", colonies(c) ? "Shipping Lines (from generation 2)" : ""].filter(Boolean);
        return p("Each generation it gets " + (brutal(c) ? "four" : "three") + " project cards and one bonus card" + (extra.length ? ", plus " + listAnd(extra) : "") +
          ", and it passes when they run out. It never pays for cards and has no production: its money comes from Failed Actions and bonuses.");
      } },
    { id: "mb-interact", slot: "insert", h: "Your cards against MarsBot",
      when: function (c) { return am(c); },
      body: function () {
        return p("Your cards still work on it. Removing or stealing resources takes its M€. Cutting its production pushes the matching track back, steel to building, heat to Earth and so on, and it won't redo those icons. Cards that count other players' tags or events use its track positions.");
      } },
    { id: "mb-score", slot: "insert", h: "How MarsBot scores",
      when: function (c) { return am(c); },
      body: function (c) {
        var rates = ma(c) ? "Most of its award values come from its tracks, the rest as usual, from its M€, TR or played cards, or a fixed value, tile by tile, as this page lists."
          : (noBoard(c) ? "On Amazonis Planitia the MarsBot books don't rate the awards at all; more on that in a moment."
            : "Its reference card rates its awards: " + SCORE_EX[mapId(c)] + ".");
        return p("MarsBot scores TR, tiles, milestones and awards, but " + (hard(c) ? "from its cards only a point for each one whose VP icon isn't negative" : "nothing for its cards") +
          ". Its <b>Neural Instance</b> tile scores a point per neighbouring space you don't hold, and its leftover M€ is worth 1 VP per 8, more if the game runs past generation " +
          (pcards(c) ? "10" : (pnc(c) ? "12, or 10 with the Prelude changes" : "12")) + ". " + rates + " With two of you, awards have no second place.");
      } },
    { id: "mb-difficulty", slot: "insert", h: "Difficulty",
      when: function (c) { return am(c) && (on(c, "mb-difficulty") || level(c) !== "normal"); },
      body: function (c) {
        var l = level(c);
        if (l === "easy") return p("We're on <b>Easy</b>: no red advance arrows, Failed Actions pay 3 M€, and its award values are 5 lower.");
        if (l === "hard") return p("We're on <b>Hard</b>: it scores a point for each of its cards whose VP icon isn't negative, and on its first turn each generation it buys a milestone for 8 M€ if it meets enough of them.");
        if (l === "brutal") return p("We're on <b>Brutal</b>: Hard's rules, plus it starts with four project cards and keeps all four each generation.");
        return p("MarsBot is on its <b>Normal</b> level.");
      } },
    { id: "mb-corps", slot: "insert", h: "MarsBot's corporation",
      when: function (c) { return am(c) && corps(c); },
      body: function () {
        return p("MarsBot has a <b>corporation</b>: starting tags that moved its tracks at setup, an ongoing effect, and maybe a box it resolves every generation. If it shows a <b>draft priority</b>, we must draft, and it takes the matching cards.");
      } },
    { id: "mb-draft", slot: "insert", h: "Drafting against MarsBot",
      when: function (c) { return am(c) && draft(c); },
      body: function (c) {
        return p("We <b>draft</b> from two piles of four: you keep one card, MarsBot keeps " + (corps(c) ? "its draft-priority match or a random one" : "a random one") +
          ", then you swap, until each of you has four. " + (brutal(c) ? "On Brutal it keeps all four" : (corps(c) ? "Then it flips its drafted cards one by one and discards the first that misses its priority, keeping all four if they all match" : "Then it discards one at random")) + ", and a bonus card joins them.");
      } },
    { id: "mb-prelude", slot: "insert", h: "Prelude against MarsBot",
      when: function (c) { return am(c) && prelude(c); },
      body: function (c) {
        if (pnc(c)) return p("We're using <b>Prelude</b> without its Prelude cards, and the MarsBot books don't cover that. So before we start, we agree whether to use MarsBot's Prelude changes: three extra project cards for it, and a shorter clock, where reaching generation 18 loses and its M€ is worth more sooner. Either way, a wild tag on a card it resolves moves its least-advanced track, the top one if tied.");
        return p("With <b>Prelude</b>, MarsBot takes three extra project cards instead of Preludes, and wild tags move its least-advanced track (the top one if tied). The clock is shorter: generation 18 loses, and its M€ is worth more sooner." +
          (prelude2(c) ? " Prelude 2's <b>Recession</b> stays in the box." : ""));
      } },
    { id: "mb-venus", slot: "insert", h: "Venus Next against MarsBot",
      when: function (c) { return am(c) && venus(c); },
      body: function () {
        return p("With <b>Venus Next</b>, Venus tags move MarsBot's Venus track. Each generation it gets <b>Government Intervention</b>: on even generations, or once Venus is done, it raises the Martian parameter furthest behind, otherwise Venus, with no TR for MarsBot. That replaces the World Government step. Once Hoverlord is gone, it can spend five floaters on an extra card.");
      } },
    { id: "mb-colonies", slot: "insert", h: "Colonies against MarsBot",
      when: function (c) { return am(c) && colonies(c); },
      body: function (c) {
        return p("With <b>Colonies</b>, bonus cards found MarsBot's colonies, and from generation 2 <b>Shipping Lines</b> trades once a generation. Instead of the usual rewards it stores resources on its shipping board, and every five in one area move a track" + (venus(c) ? "" : ", except floaters: they collect on Titan, and if it has five at the end of a Research phase it spends them on an extra card") + ". At space 9 of its " + trk(c, "energy") + " it gets a second fleet, and from the next generation Extended Shipping Lines joins its deck too, so it trades twice a generation.");
      } },
    { id: "mb-turmoil", slot: "insert", h: "Turmoil against MarsBot",
      when: function (c) { return am(c) && turmoil(c); },
      body: function (c) {
        var hx = tmHarder(c);
        return p("With <b>Turmoil</b>, MarsBot starts on " + mbStartTR(c) + " TR, ignores policies and ruling bonuses, and never loses TR in the revision. Its <b>Party Politics</b> card places delegates to grab party leaders and dominance. Global events hit only you. Party leaders and the chairman score a point each, for both of you." +
          (hx === "tr7" ? " We've made it tougher: it starts on 13 TR instead of 10." : "") +
          (hx === "del1" ? " We've made it tougher: it starts with a delegate in a random party." : "") +
          (hx === "del2" ? " We've made it tougher: it starts with two delegates in random parties." : ""));
      } },
    { id: "mb-map", slot: "insert", h: "MarsBot on this map",
      when: function (c) { return am(c) && !ma(c) && !!MAP_TEACH[mapId(c)]; },
      body: function (c) { return p(MAP_TEACH[mapId(c)]); } },
    /* mb-ma follows the core "Milestones & Awards tiles" section, while the tiles are being read out */
    { id: "mb-ma", slot: "insert", after: "ma", h: "Milestones & Awards tiles against MarsBot",
      when: function (c) { return am(c) && ma(c); },
      body: function (c) {
        return p("Against MarsBot, the tiles work a little differently. MarsBot plays on its Tharsis board" + (mapId(c) !== "tharsis" ? ", even on " + mapName(c) : "") +
          ", and it qualifies for most tiles by its tracks, for the rest as usual or by its M€, TR, played cards or delegates; this page lists how. <b>Terraformer</b> isn't supported against it, so it stays out of the game.");
      } },
    { id: "mb-amazonis", slot: "insert", h: "Amazonis Planitia",
      when: function (c) { return am(c) && amz(c); },
      body: function (c) {
        return p("A warning about <b>Amazonis Planitia</b>: the MarsBot books don't cover it. There's no MarsBot board, reference card or Corporate Competition card for this map" +
          (ma(c) ? ", but with the Milestones &amp; Awards tiles MarsBot uses its Tharsis board anyway, and every tile except Terraformer is rated for it. Still open: its tiebreakers, the map's longer parameters, and the wild-resource and delegate spaces, which the books never mention."
            : ", so the books don't say how MarsBot's tracks, milestones, awards and tile placement work here, and they never mention the wild-resource and delegate spaces.") +
          " We agree how to handle that before we start.");
      } },
    { id: "mb-later", slot: "later", h: "MarsBot: don't worry about these yet",
      when: function (c) { return am(c); },
      body: function (c) {
        return ul([
          "Exactly where MarsBot puts a tile: a tiebreak list, then a flipped card.",
          "Tracks pushed back and moving forward again: a marker shows where they re-arm.",
          "Corporate Competition's helper actions and where the Neural Instance may go.",
          "Odd cards like Lawsuit or Toll Station: see the MarsBot FAQ.",
          colonies(c) ? "Europa, Titan and Pluto quirks for MarsBot's colonies." : "",
          turmoil(c) ? "Party Politics' priority list for MarsBot's delegates." : ""
        ]);
      } }
  ];

  /* ================================================================== NOTES */
  var notes = [
    "ANCHORS this file relies on: 'start', 'end' (= just before base-setup-8 'Start the game'), base-setup-1 … base-setup-7, 'ma-setup', 'prelude-setup', 'venus-setup', 'colonies-setup', 'turmoil-setup'. Steps sharing an anchor rely on file order (mb-board before mb-bonus-deck). With A's order (1, ma, venus, 2, turmoil, colonies, 3–7, prelude, 8) this gives: mb-intro › 1 › mb-amazonis › ma › mb-ma › venus › mb-venus › 2 › mb-board › mb-bonus-deck › turmoil › mb-turmoil › colonies › mb-colonies › 3 › mb-recession › mb-turmoil-delegates › 4 › mb-players › 5 › mb-corporations › 6 › mb-action-deck › 7 › mb-corp › prelude › mb-prelude › mb-start › 8. (mb-turmoil-delegates sits after step 3 because its random party is picked by flipping a project card, Automa C p.7, and the project deck is built in step 3.)",
    "OPTION IDS read from A: c.mod('draft') (Draft variant, Base p.13) and c.mod('prelude-nocards') (Prelude without Prelude cards, Prelude p.2). Nothing else of A's options is read.",
    "NOT COVERED (Prelude without Prelude cards, audit 1c): Automa C p.1's Prelude section (3 extra project cards instead of Prelude cards, the wild-tag rule, the generation-18 limit and the Prelude M€ column) doesn't mention Prelude p.2's no-Prelude-cards variant, and only its setup step 2 is worded around Prelude cards. The page no longer picks a reading by analogy with Prelude p.3's solo rule: pnc(c) shows a 'not covered' statement and both sets of figures (lossHtml, the two-column M€ table, the optional 3 extra cards) and asks the players to agree. The wild-tag rule is shown whenever Prelude is in play.",
    "FOR A (automa mode, A's own text): the Titan/Enceladus/Miranda start and the Turmoil TR loss ('MarsBot never loses it') are now automa-aware in data.js (checked in audit 2c). Still open for data.js (audit 2c): with MarsBot corporations and Prelude, Automa B p.1 moves your Prelude choice to after MarsBot's corporation is drawn, but base-setup-6/7 tell you to choose your 2 Preludes together with your corporation. mb-corporations (after step 5) carries the instruction meanwhile.",
    "IDS defined here: module 'mb-difficulty' (one-of choices mb-normal [first = default; module off also = Normal], mb-easy, mb-hard, mb-brutal); module 'mb-corps'; module 'mb-turmoil-harder' (requires turmoil; choices mb-tm-tr7, mb-tm-del1, mb-tm-del2). Choices are read with c.choice(id), falling back to c.mod(id) returning the choice id.",
    "TWO-PLAYER SETUP: Automa A p.3 'Set the game up as a two-player game'; Automa C p.4 Colonies 'as if playing a two-player game'. In automa mode c.p = 1 (one human), but A's player-count content must behave as 2 players: Colonies 5 tiles (Colonies p.2), awards give no 2nd place (Base pp.11–12), and the Base solo, Venus solo, Colonies solo and Turmoil solo rules must NOT appear. You start on 20 TR with milestones and awards (Automa A p.3; C p.6).",
    "VENUS VARIANT: Automa C p.3 says MarsBot can't be used with Venus Next without Government Intervention, and Solar Phase step 2 is not carried out. If A exposes Venus p.3's 'skip World Government Terraforming' variant, hide or exclude it in automa mode (my mb-venus step says step 2 is skipped anyway).",
    "M&A: Automa C p.14 marks the Terraformer milestone 'NOT SUPPORTED AGAINST THE AUTOMA'. If A draws random M&A milestones, exclude Terraformer in automa mode. Automa C p.13 also says to use the Tharsis MarsBot board and reference card 'regardless of which board you are using', so with 'ma' this file shows Tharsis tracks on any map. For tiebreakers it shows the Tharsis list (A p.9) plus a note that the books don't say whether that or the map's own list (C p.10, printed 'on player aids for each individual board') applies; the map's special-hex rules (C p.11) are still shown because they describe hexes on the game board.",
    "AMAZONIS (audit 1c): no Automa book mentions Amazonis Planitia; the box has boards, board reference cards and Corporate Competition cards for six maps (Automa A p.2, C p.8). The former Tharsis/M&A 'unofficial stand-ins' are removed: without the M&A tiles, boardId/ccCard/tieId are null and every map-specific item (track table, milestone/award ratings, Corporate Competition card and helpers, tiebreakers, bonus-space gains) says plainly that the books don't cover it; generic MarsBot rules still show, with the generic track names of A p.5 / C p.4. With the M&A tiles, C p.13's Tharsis board and reference card apply on any map, as for the other maps. The map stays selectable in automa mode. Audit 2c: the books never mention Amazonis's wild-resource or delegate bonus spaces, but MarsBot's general placement-bonus rule (1 M€ per icon covered, A p.9) is not map-specific, so the page cites it next to the 'never mention' statement instead of calling the gain wholly uncovered. Eight of Amazonis's ten milestone/award names are also M&A tiles that C pp.13–15 rates (on the Tharsis board, for the M&A expansion); the page doesn't point to those ratings as a stand-in.",
    "FOLIOS: all three Automa books print folio = PDF page (A: folios on pp.2–11, cover p.1 and credits p.12 unnumbered; B: 1–4; C: 1–16). Base also prints folio = PDF page (p.7 Setup, p.11 awards, p.12 Game end, p.13 Variants), not PDF−1 as TM_PLAN guessed. Turmoil prints 2–7 = PDF page. Venus, Colonies, Prelude, Prelude 2 and M&A print NO folios; this file cites their PDF page (Venus pp.2–3, Colonies pp.2–3, M&A pp.1–4).",
    "CONFLICT (card numbers): Automa C p.4 calls the Colonies Expedited Construction 'B16', but Automa A p.6 (card image) and C p.2 give B16 to Government Intervention (Venus). The page names the Colonies card without a number and says so. B03 (Research and Development) and B07 (Local Neural Instance) are inferred from the ordered B01–B08 list on Automa A pp.6–7. Visibly printed: B01 (A p.3 picture), B06 (A p.2 picture), B05, B06, B08, B14–B20 (C text), B16 (A p.6 picture). B02 and B04 appear only in the hidden text layer of the overlapped card photos on A p.2 (audit 2c, 600–1000 dpi renders); they match the list order.",
    "CONFLICT (names, Automa C 11-2023 vs the 2024 wraps and M&A): Utopia Planitia 'Specialist' (C p.10) = the wrap's MANAGER (U&C wrap); Terra Cimmeria 'Financier' (C p.9) = the wrap's FUNDRAISER; M&A 'Supplier' (C pp.15–16) = the M&A tile INDUSTRIALIST (M&A p.4, the only M&A award missing from C, rated energy track + 5 like Elysium's Industrialist); M&A 'Filantrope' = PHILANTROPIST (M&A p.3); Hellas 'Eccentric' = the wrap's 'Excentric'; Utopia 'Suburban' = 'Suburbian'. The page uses the printed tile names and notes the Automa spelling.",
    "CONFLICT (values): (1) M&A Coastguard: Automa C p.13 says MarsBot needs '4+ tiles adjacent to ocean tiles', while the M&A tile asks players for 3 (M&A p.2), and C p.9 calls Terra Cimmeria's Coastguard (3 tiles, U&C wrap) 'Unchanged'. The page shows Automa's 4+ for M&A with the M&A figure noted. (2) M&A Magnate: C p.15 'As usual (blue and green cards)', but M&A p.4 and C p.9 (Hellas) say green cards. The page follows 'As usual' = green and flags the note. (3) M&A Excentric: C p.14 '5 MC = 1 requirement', but the tile counts resources on cards (M&A p.4) and Hellas's Excentric is '5 MC = 1 resource' (C p.9). MarsBot's number is the same either way; flagged. (4) The stacked reference-card photos on Automa A p.2 carry a hidden text layer that differs from C in places (Cimmeria Coast Guard 'Owns 4+ tiles', Hellas Space Baron 'Science track space'); that text is covered by the overlapping cards and not printed visibly, and the one readable card (Vastitas Borealis) matches C p.10. The page follows C pp.9–10.",
    "AMBIGUITIES shown on the page as such: (1) ocean adjacency. Automa A p.9 says MarsBot 'gains 2 MC' if adjacent to an ocean, while the Base rule is 2 M€ per adjacent ocean (Base p.5). The page quotes the Automa wording and notes the difference. (2) Venus 8% card-draw bonus step when MarsBot raises Venus: not covered. (3) Terra Cimmeria Planetologist, Utopia Trader and M&A Trader/Planetologist use MarsBot's Venus track, which exists only with Venus Next. The page shows the rule plus a neutral note. (4) Turmoil on Tharsis: A p.8 says MarsBot's Terraformer is 'Unchanged (35 TR)'; with Turmoil's 26 TR tile (Turmoil p.2), 'unchanged' is read as 26 TR, and the page now says that the Automa books don't mention the tile and that 26 TR is its reading (audit 2c). (5) Prelude without Prelude cards: the wild-tag rule concerns project cards, which stay in that variant, so it is shown as applying; only the 3 extra cards and the generation-18 clock are left for the players to agree (audit 2c).",
    "TEACH: slot 'hook' = mb-hook; mb-turn and mb-deck carry after:'shape' (right after the core 'shape of a generation' section); mb-ma carries after:'ma' (right after the core Milestones & Awards section, while the tiles are read out); the other inserts (mb-interact, mb-score, mb-difficulty, mb-corps, mb-draft, mb-prelude, mb-venus, mb-colonies, mb-turmoil, mb-map, mb-amazonis) go before the core 'later' list in that order; slot 'later' = mb-later (a <ul> merged into the core don't-worry list). In automa mode, A's core teach should not promise 'highest score wins' ties by M€ (MarsBot wins ties, Automa A p.10).",
    "HTML: tables are <div class='tbl-wrap'><table class='tbl'> with <th scope='col'> headers and <th scope='row'> first cells. The selected difficulty row has class 'is-current' plus a text label '(this game)'. Notes use <p class='inline-note'>. A needs CSS for .tbl-wrap{overflow-x:auto} and basic .tbl styling. Tables are 2–3 columns, but the M&A tables are 35 rows each.",
    "SEARCH (A's rules.js): index the Automa books with their printed page = PDF page; skip Automa A p.1 (cover) and p.12 (credits)."
  ];

  return { sets: sets, modes: modes, modules: modules, steps: steps, reference: reference, teach: teach, notes: notes };
})();
