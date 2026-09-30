/* =============================================================================
   Warcraft: The Board Game — Setup & Reference Utility · data
   Sources (the only sources used), newest ruling wins:
     • Rulebook (Sept 2003), 12 pp.                 → "Rules p.N"  (printed "Page N" = PDF page N;
                                                       p.1 cover, p.12 back cover)
     • FAQ & Errata (Dec 2003), 2 pp.                → "FAQ p.N"    (no printed numbers: PDF page)
     • Expansion Set rulebook (Oct 2004), 8 pp.      → "Expansion p.N" (printed = PDF page)
       Everything in it applies only when the Expansion Set is selected, including its "Rule Changes
       and Clarifications" (p.3): the book presents them as part of the Expansion's rules (the same
       section holds the three-player main game, which needs Expansion board pieces) and never extends
       them to games without it. Base-only configurations use the rulebook as corrected by the FAQ.
     • Simultaneous card play: base game = FAQ p.2 (player whose turn it is first, then clockwise), which
       is newer than, and replaces, the rulebook's battle order (Rules p.9: defender first); with the
       Expansion Set = Expansion p.6 (play order from the first player), which replaces both.
     • Online scenarios, one page each (no page numbers):
         Orcs for Sale (FFG's first online scenario, by Kevin Wilson)   → "Orcs for Sale sheet"
         Gold Rush (the first player-submitted scenario, by Matthew M. Monin)
                                                                         → "Gold Rush sheet (player-submitted)"
         The Plague of the Scourge (fan-submitted, by L. Seuren; image-only PDF, read visually)
                                                                         → "Plague of the Scourge sheet (fan-submitted)"
     • Scenario Creation Guide (Dec 2003), 4 pp.     → "Scenario Guide p.N" (no printed numbers: PDF page)
   ============================================================================= */
var WC = {};

WC.expMeta = {
  core:   { name: "Base Game",       cls: "tag-core" },
  exp:    { name: "Expansion Set",   cls: "tag-exp" },
  faq:    { name: "FAQ & Errata",    cls: "tag-faq" },
  scen:   { name: "Scenario",        cls: "tag-scen" },
  online: { name: "Online Scenario", cls: "tag-online" },
  opt:    { name: "Optional Rule",   cls: "tag-opt" },
  gap:    { name: "Not in the Books", cls: "tag-gap" }
};

WC.expansions = [
  { id: "core", short: "Warcraft: The Board Game", year: "2003",
    blurb: "The base game: 13 double-sided board pieces, the four races, the main game for 2 or 4 players and four rulebook scenarios. Always in play." },
  { id: "exp", short: "Expansion Set", year: "2004",
    blurb: "16 more board pieces (with water), race-coloured Outposts, 120 new experience cards with mana, heroes, creeps, the three-player main game, seven optional rules and four new scenarios." }
];

/* ---------------------------------------------------------------------------
   Races (Rules p.2)
   --------------------------------------------------------------------------- */
WC.R = {
  hu:  { name: "Human Alliance",      short: "Human",     color: "blue",
         blurb: "versatile, with equally good melee, ranged and flying units" },
  orc: { name: "Orcish Horde",        short: "Orc",       color: "red",
         blurb: "the most powerful melee units, but poor flying units" },
  ud:  { name: "Undead Scourge",      short: "Undead",    color: "purple",
         blurb: "a balanced, versatile army that specialises in no one unit type" },
  ne:  { name: "Night Elf Sentinels", short: "Night Elf", color: "green",
         blurb: "the most powerful ranged units, but poor melee units" }
};
WC.RACE_ORDER = ["hu", "orc", "ud", "ne"];
WC.PLURAL = { hu: "Humans", orc: "Orcs", ud: "Undead", ne: "Night Elves" };
/* One teaching sentence per race (Rules p.2). */
WC.RACE_TEACH = {
  hu: "The <b>Human Alliance</b> is one of the most versatile races, with equally good melee, ranged and flying units.",
  orc: "The <b>Orcish Horde</b> has the most powerful melee units, but poor flying units.",
  ud: "The <b>Undead Scourge</b> is a balanced, versatile army that specialises in no one unit type.",
  ne: "The <b>Night Elf Sentinels</b> have the most powerful ranged units, but poor melee units."
};

/* ---------------------------------------------------------------------------
   Helpers
   --------------------------------------------------------------------------- */
WC.ul = (items) => "<ul>" + items.filter(Boolean).map(i => "<li>" + i + "</li>").join("") + "</ul>";
/* Join citations with " · ", merging parts that cite the same document ("Rules p.3 · Rules p.5" -> "Rules p.3, p.5"). */
WC.src = (...parts) => {
  const order = [], pages = {};
  parts.filter(Boolean).join(" · ").split(" · ").forEach(part => {
    const m = part.match(/^(Rules|FAQ|Expansion|Scenario Guide) (p\..+)$/);
    const doc = m ? m[1] : part;
    if (!pages[doc]) { pages[doc] = []; order.push(doc); }
    if (m) m[2].split(", ").forEach(tok => { if (pages[doc].indexOf(tok) === -1) pages[doc].push(tok); });
  });
  const first = (tok) => parseInt(tok.replace("p.", ""), 10);
  const inside = (tok, list) => list.some(o => { const r = o.match(/^p\.(\d+)–(\d+)$/); const n = first(tok);
    return o !== tok && r && !/–/.test(tok) && n >= +r[1] && n <= +r[2]; });
  return order.map(doc => {
    const toks = pages[doc];
    if (!toks.length) return doc;
    const kept = toks.filter(t => !inside(t, toks)).sort((a, b) => first(a) - first(b));
    return doc + " " + kept.join(", ");
  }).join(" · ");
};
WC.and = (a) => a.length <= 1 ? (a[0] || "") : a.slice(0, -1).join(", ") + " and " + a[a.length - 1];
WC.rn = (ids) => WC.and(ids.map(id => WC.R[id].short));
WC.word = (n) => ({ 2: "two", 3: "three", 4: "four" })[n] || String(n);
WC.val = (v, c) => (typeof v === "function" ? v(c) : v);

/* Board diagrams in images/boards/ (cropped from the PDFs by crop_boards.py): [width, height] */
WC.boardDims = {
  "altar.webp": [480, 483], "captives.webp": [441, 390], "dragon.webp": [480, 602], "elements.webp": [413, 611],
  "elfgate.webp": [473, 500], "goldrush.webp": [480, 512], "main-2p.webp": [467, 438], "main-3p.webp": [460, 522],
  "main-4p-faq.webp": [480, 453], "necro.webp": [474, 343], "nordrassil.webp": [473, 498], "orcsale.webp": [480, 659],
  "plague.webp": [480, 483], "skull.webp": [480, 512], "tree.webp": [326, 241]
};
WC.fig = function (file, alt, cap) {
  const d = WC.boardDims[file];
  return "<figure class='board-fig'><a href='images/boards/" + file + "' target='_blank' rel='noopener' title='Open the diagram full size'>" +
    "<img src='images/boards/" + file + "' width='" + d[0] + "' height='" + d[1] + "' loading='lazy' alt='" + alt + "'></a>" +
    "<figcaption>" + cap + "</figcaption></figure>";
};

/* ---------------------------------------------------------------------------
   Scenarios (the configurator's "modes")
   Every field may be a value or a function of the configuration c.
   --------------------------------------------------------------------------- */
WC.SCEN_ORDER = ["main", "elfgate", "necro", "captives", "nordrassil", "altar", "skull", "dragon", "elements", "orcsale", "goldrush", "plague"];
WC.GROUPS = [
  { id: "Rulebook", label: "From the rulebook" },
  { id: "Expansion", label: "From the Expansion Set rulebook" },
  { id: "Online", label: "Online scenarios (published on the FFG website)" }
];

WC.S = {
  main: {
    name: "The Main Game", group: "Rulebook", tag: "core",
    blurb: "Build an economy, raise an army and race for victory points — 15 alone, or 30 as teams of two.",
    origin: "the scenario the rulebook teaches",
    races: (c) => c.p === 2 ? c.races : (c.p === 3 ? ["hu", "orc", "ne"] : ["hu", "orc", "ud", "ne"]),
    src: (c) => c.p === 3 ? "Rules p.2–9 · Expansion p.3" : "Rules p.2–9",
    img: (c) => c.p === 2 ? "main-2p.webp" : (c.p === 3 ? "main-3p.webp" : "main-4p-faq.webp"),
    imgCap: (c) => c.p === 2 ? "Two-Player Game (Rules p.5)" : (c.p === 3 ? "Three-Player Setup (Expansion p.3)" : "Four-Player Game — the FAQ’s corrected diagram (FAQ p.1)"),
    imgSrc: (c) => c.p === 2 ? "Rules p.3–5 · Scenario Guide p.2 · FAQ p.1" : (c.p === 3 ? "Expansion p.3" : "Rules p.3–4 · FAQ p.1"),
    boardNotes: (c) => {
      if (c.p === 4) return [
        "Place the <b>13 cyan board pieces (1–13)</b> as the four-player diagram shows, then press them together so there are no gaps.",
        "<b>FAQ correction:</b> use the corrected diagram shown here. The rulebook’s original swapped the graphics for pieces <b>6 and 8</b>, and for pieces <b>5 and 9</b>.",
        "Town spaces: <b>Night Elf</b> on piece 2, <b>Orc</b> on 3, <b>Human</b> on 10 and <b>Undead</b> on 12, as the rulebook’s original diagram labels them. The corrected diagram has no labels."
      ];
      if (c.p === 3) return [
        "Build the board exactly as the Three-Player Setup diagram shows; it mixes base-game pieces with Expansion pieces 26, 27 and 29.",
        "The diagram marks <b>Night Elf, Orc and Human</b> Town spaces, so the page seats those three races. The Expansion says the three-player game is played exactly like the two-player game (whose races are chosen at random), but this board has no Undead Town space and the book doesn’t say how to seat the Undead."
      ];
      /* The diagram's two Towns are on the Orc (3) and Undead (12) pieces; a Human or Night Elf player uses his
         own Town piece, flipped to magenta, in the place of the race that isn't playing (Rules p.3, p.5). */
      const flip = c.races.filter(r => r === "hu" || r === "ne");
      const unused = ["orc", "ud"].filter(r => c.races.indexOf(r) === -1);
      const TP = { hu: "Human Town piece (<b>10</b>)", ne: "Night Elf Town piece (<b>2</b>)", orc: "Orc piece (3)", ud: "Undead piece (12)" };
      return [
        "Set up the board as the Two-Player diagram shows. Its two Town spaces are on the <b>Orc</b> Town piece (<b>3</b>, left) and the <b>Undead</b> Town piece (<b>12</b>, right), cyan side up.",
        flip.length === 2
          ? "You’re using the <b>Humans and Night Elves</b>: put the Human (<b>10</b>) and Night Elf (<b>2</b>) Town pieces where the diagram shows the Orc and Undead pieces, one each. Flip each from its <b>cyan</b> side to its <b>magenta</b> side so its Town space sits where the diagram shows one."
          : (flip.length === 1
            ? "You’re using the <b>" + WC.PLURAL[flip[0]] + "</b>: put the " + TP[flip[0]] + " where the diagram shows the unused " + TP[unused[0]] + ", flipped from its <b>cyan</b> side to its <b>magenta</b> side so its Town space sits where the diagram shows it."
            : "The rulebook’s Town-piece flip applies only to the Humans and Night Elves, so the Orcs and Undead use their own pieces, 3 and 12, as shown."),
        "<b>Page’s reading of the diagram:</b> the piece marked <b>10</b>, below piece 3, can’t be piece 10. That is the Human Town piece, which has a Town on both sides, and the marked piece shows only a forest and a 1-point objective: the graphics of the <b>Cyan 11</b> wedge piece in the four-player diagram. Use Cyan 11 there. The FAQ corrects the same mislabel in The Captives, but not here."
      ];
    },
    res: { g: 5, w: 5 }, resSrc: "Rules p.3",
    first: "random", firstSrc: "Rules p.3",
    win: (c) => {
      const w = [];
      if (c.p === 4) w.push("The first <b>team</b> to hold <b>" + (c.mod("vp20") ? "20" : "30") + " victory points</b> at the end of either teammate’s turn wins" + (c.mod("vp20") ? " (Strategic Four-Player Game — the normal target is 30)" : "") + ".");
      else w.push("The first player to hold <b>15 victory points</b> at the end of his turn wins.");
      w.push("Or be the last " + (c.p === 4 ? "team" : "player") + " standing. A player is eliminated when his Town is captured: the second time enemy units still hold it after all Move Steps" + (c.p === 4 ? ", and his teammate goes with him" : "") + ".");
      return w;
    },
    winSrc: (c) => c.p === 3 ? "Expansion p.3 · Rules p.5, p.9" : (c.p === 4 && c.mod("vp20") ? "Rules p.2, p.5, p.9 · FAQ p.2" + (c.has("exp") ? " · Expansion p.3" : "") : "Rules p.2, p.5, p.9")
  },

  elfgate: {
    name: "The Elf Gate", group: "Rulebook", tag: "scen", players: [3], races: ["hu", "orc", "ud"], neutral: "ne",
    blurb: "Humans, Orcs and Undead race for a gate guarded by neutral Night Elves. Hold space D with few enemies around it.",
    origin: "a rulebook scenario",
    src: "Rules p.10 · FAQ p.1",
    img: "elfgate.webp", imgCap: "The Elf Gate Scenario (Rules p.10) — flip the Cyan 4 piece to Magenta 4 (FAQ p.1)", imgSrc: "Rules p.10 · FAQ p.1",
    boardNotes: [
      "Set up the board as The Elf Gate diagram shows.",
      "<b>FAQ correction:</b> the diagram shows the <b>Cyan 4</b> piece. Flip it to its <b>Magenta 4</b> side, oriented so its graphics and number are upright. This adds a goldmine between the Orc and Human players."
    ],
    tokens: [
      "Place a <b>complete depletion marker</b> (cross side up) on every Goldmine and Forest space <b>except</b> those next to Town spaces.",
      "Neutral Night Elves: put <b>2 ranged units and 1 melee unit</b> on each of spaces <b>A, B and C</b>, and <b>3 flying units</b> on space <b>D</b>.",
      "The Night Elves begin play upgraded to <b>level 2</b>, so their unit tiles show Level 2 on top."
    ],
    tokensSrc: "Rules p.10",
    res: { g: 5, w: 5 }, resSrc: "Rules p.10",
    first: "random", firstSrc: "Rules p.10",
    remove: "Remove the <b>3 Victory Point cards</b> from each player’s experience deck before shuffling (victory points don’t decide this scenario).",
    removeSrc: "FAQ p.1",
    rules: [
      "Goldmines and Forests <b>next to Towns never deplete</b>: ignore a rolled 3 when harvesting there.",
      "The Night Elf units are <b>neutral and never move</b>. When you fight them, the <b>player to your left</b> rolls for them, but may not play cards for them.",
      "Night Elf units that are killed <b>leave play for good</b> — they defend the gate."
    ],
    rulesSrc: "Rules p.10",
    win: [
      "At the end of your turn, have <b>at least one unit in space D</b> while there are <b>fewer than 3 enemy units in total</b> (Night Elves included) in all the spaces adjacent to D.",
      "Or the other two players have been eliminated."
    ],
    winSrc: "Rules p.10"
  },

  necro: {
    name: "March of the Necromancers", group: "Rulebook", tag: "scen", players: [2], races: ["hu", "ud"],
    blurb: "Two Necromancers raise an Undead army from the countryside; the Humans must stop them before the region falls.",
    origin: "a rulebook scenario",
    src: "Rules p.10 · FAQ p.1",
    img: "necro.webp", imgCap: "March of the Necromancers Scenario (Rules p.10)", imgSrc: "Rules p.10",
    boardNotes: ["Set up the board as the March of the Necromancers diagram shows."],
    tokens: [
      "Place the special tokens on spaces <b>A to E</b> as the diagram shows.",
      "Place the two <b>Necromancer tokens</b> where the diagram shows them. They are the Undead player’s starting units."
    ],
    tokensSrc: "Rules p.10",
    town: "The <b>Undead player has no Town interface, stockpiles or buildings</b>. The Human player sets up his Town interface normally.",
    res: "The <b>Humans</b> receive <b>5 wood and 5 gold</b>. The Undead player has no stockpile.", resSrc: "Rules p.10",
    units: "Humans: <b>3 workers and 3 melee units</b> in their Town space. Undead: the <b>2 Necromancer tokens</b> in the spaces the diagram shows.",
    unitsSrc: "Rules p.10",
    first: "ud", firstSrc: "Rules p.10",
    remove: "Remove the <b>3 Victory Point cards</b> from each player’s experience deck, and the <b>2 Summon Building</b> cards from the Undead deck, before shuffling.",
    removeSrc: "FAQ p.1",
    rules: [
      "<b>Playing Undead, when he harvests:</b> with a Necromancer on <b>A</b> he may place a free Undead <b>melee</b> unit on A at once; on <b>B</b>, a free <b>ranged</b> unit on B; on <b>C</b>, a free <b>flying</b> unit on C. Stacking limits apply.",
      "<b>When he upgrades:</b> with a Necromancer on <b>D or E</b> he may upgrade one of his unit types for free, or two types if he has Necromancers on both.",
      "The Undead player <b>can’t train or construct</b> in his Spend Step.",
      "A special space (A–E) that loses its token, destroyed by the Humans, no longer has any ability.",
      "<b>Playing Humans:</b> a normal turn, except that the Goldmine and Forest spaces <b>adjacent to the Human Town never deplete</b>.",
      "<b>Necromancers follow the rules for workers:</b> they move 2 spaces, and are killed if they’re alone with enemy units at the end of a Move Step. The two Necromancers can’t share a space.",
      "If the Human player is in a space with a special token (A–E) at the end of a Move Step, that token is destroyed."
    ],
    rulesSrc: "Rules p.10",
    win: [
      "<b>Undead:</b> eliminate the Human player by occupying his Town space, as in the main game.",
      "<b>Humans:</b> kill both Necromancers, or destroy all the special tokens on spaces A, B and C."
    ],
    winSrc: "Rules p.10"
  },

  captives: {
    name: "The Captives", group: "Rulebook", tag: "scen", players: [2], races: ["orc", "ne"],
    blurb: "The Orcs hold Tyrande Whisperwind and the Night Elves hold Thrall. First to bring its own leader home wins.",
    origin: "a rulebook scenario",
    src: "Rules p.10–11 · FAQ p.1",
    img: "captives.webp", imgCap: "The Captives Scenario (Rules p.11) — the piece labelled Cyan 10 is Cyan 11 (FAQ p.1)", imgSrc: "Rules p.11 · FAQ p.1",
    boardNotes: [
      "Set up the board as The Captives diagram shows.",
      "<b>FAQ correction:</b> the piece labelled <b>Cyan 10</b> on the diagram is really the <b>Cyan 11</b> piece."
    ],
    tokens: [
      "Place the <b>4 wall tokens</b> as the diagram shows.",
      "Place the <b>2 captive tokens</b>, Orc and Night Elf sides up, on spaces <b>A and B</b> as shown."
    ],
    tokensSrc: "Rules p.11",
    res: null, resSrc: "Rules p.11",
    units: "Each player: <b>3 workers and 3 melee units</b> on his Town.",
    unitsSrc: "Rules p.11",
    first: null, firstSrc: "Rules p.11",
    remove: "Remove the <b>3 Victory Point cards</b> from each player’s experience deck before shuffling.",
    removeSrc: "FAQ p.1",
    rules: [
      "<b>Walls</b> can’t be crossed by melee or ranged units. A melee or ranged unit on one side of a wall can’t take part, as a flanking unit, in a battle on the other side.",
      "A wall affects only the edge of the space it’s on. Movement and flanking through the space’s other edges are unaffected.",
      "<b>Captives:</b> any unit may take a captive of its own race along when it moves. A captive can’t move unless a unit of its race goes with it."
    ],
    rulesSrc: "Rules p.11",
    win: [
      "Move the captive of <b>your</b> race onto your Town space, rescuing your leader.",
      "Or eliminate the other player."
    ],
    winSrc: "Rules p.11"
  },

  nordrassil: {
    name: "Nordrassil, the World Tree", group: "Rulebook", tag: "scen", players: [4], races: ["hu", "orc", "ud", "ne"],
    blurb: "Humans, Orcs and Night Elves hold the World Tree against the Undead until Furion’s spell is complete.",
    origin: "a rulebook scenario",
    src: "Rules p.11 · FAQ p.1",
    img: "nordrassil.webp", imgCap: "Nordrassil, the World Tree Scenario (Rules p.11)", imgSrc: "Rules p.11",
    boardNotes: ["Set up the board as the Nordrassil diagram shows. The empty areas inside the board are impassable."],
    tokens: [
      "Place the <b>Nordrassil token</b> on space <b>A</b>.",
      "Outposts: <b>Human on B</b>, <b>Orc on C</b>, <b>Night Elf on D</b>, and <b>Undead on E and F</b>.",
      "Each player starts with the assortment of units the diagram shows, in the spaces it shows."
    ],
    tokensSrc: "Rules p.11",
    res: "none", resSrc: "Rules p.11",
    units: "Each player starts with the <b>assortment of units shown on the diagram</b>, placed where it shows them.",
    unitsSrc: "Rules p.11",
    tiles: "All unit types for all players begin play <b>upgraded to their most powerful form</b>.",
    first: "ne", firstSrc: "Rules p.11",
    remove: "Remove the <b>3 Victory Point cards</b> from each player’s experience deck, plus the <b>2 Summon Building</b> cards (Undead), the <b>2 Renew</b> cards (Night Elf), the <b>2 Call to Arms</b> cards (Human) and the <b>2 Pillage</b> cards (Orc), before shuffling. The FAQ notes this makes the game somewhat easier for the Allies.",
    removeSrc: "FAQ p.1",
    rules: [
      "<b>Teams:</b> the Human, Orc and Night Elf players are one team against the Undead player, and follow the main game’s team-play rules.",
      "<b>Playing Undead:</b> he doesn’t play the Harvest, Deploy or Spend Steps. A killed Undead unit isn’t removed: place it at once on the nearest Undead Outpost or Town space, ignoring stacking limits. Once it moves off, stacking limits apply again.",
      "<b>Playing the Allies:</b> they don’t play the Harvest or Deploy Steps. At the end of each turn the Night Elf player draws 1 experience card for Furion’s progress; it is set aside and can’t be played.",
      "The Human, Orc and Night Elf <b>Outposts count as their Towns</b>.",
      "The empty areas inside the board are impassable. The Allies may move into and through space A."
    ],
    rulesSrc: "Rules p.11",
    win: [
      "<b>Undead:</b> eliminate the Night Elf Outpost, or end his turn with a unit on space A.",
      "<b>Allies:</b> the Night Elf player draws the last card from his experience deck, completing Furion’s enchantment."
    ],
    winSrc: "Rules p.11"
  },

  altar: {
    name: "The Altar of Flame", group: "Expansion", tag: "exp", requires: "exp", players: [2], races: ["hu", "ud"], heroNote: true,
    blurb: "Humans and Undead race for an altar that lets its holder take control of enemy units.",
    origin: "an Expansion Set scenario",
    src: "Expansion p.7",
    img: "altar.webp", imgCap: "The Altar of Flame Scenario (Expansion p.7)", imgSrc: "Expansion p.7",
    boardNotes: ["Set up the board as The Altar of Flame diagram shows."],
    tokens: ["Place the special token shown in the diagram on space <b>A</b>. It is the Altar of Flame."],
    tokensSrc: "Expansion p.7",
    res: { g: 5, w: 5 }, resSrc: "Expansion p.7",
    first: null, firstSrc: "Expansion p.7",
    rules: [
      "With at least one unit in space A, at the beginning of your Move Step you may try to take control of one enemy <b>non-hero</b> unit: choose it and roll a die. On a <b>1 or 2</b>, you may remove it from the board and replace it with one of your own units of the same type from your reserves.",
      "You can’t choose a unit type you have none of in your reserves (no flying unit in reserve, no flying target).",
      "You may move the new unit normally; if it ends its move with enemy units, combat is resolved as normal."
    ],
    rulesSrc: "Expansion p.7",
    win: [
      "At the end of the turn, have <b>3 units in space A</b>.",
      "Or your opponent loses his Town space and is eliminated."
    ],
    winSrc: "Expansion p.7"
  },

  skull: {
    name: "Skull of Storms", group: "Expansion", tag: "exp", requires: "exp", players: [2], races: ["orc", "hu"], heroNote: true,
    blurb: "Orcs and Humans fight for an ancient Night Elf shrine that calls down lightning.",
    origin: "an Expansion Set scenario",
    src: "Expansion p.7",
    img: "skull.webp", imgCap: "Skull of Storms Scenario (Expansion p.7)", imgSrc: "Expansion p.7",
    boardNotes: ["Set up the board as the Skull of Storms diagram shows."],
    tokens: ["Place the <b>skull shrine token</b> on the center space (<b>A</b>)."],
    tokensSrc: "Expansion p.7",
    res: { g: 5, w: 5 }, resSrc: "Expansion p.7",
    first: null, firstSrc: "Expansion p.7",
    rules: [
      "During your <b>Harvest Step</b>, if you have at least one unit in the shrine space, you may call down lightning. Choose a target space (not a Town space) occupied by enemy units.",
      "Add up the Strength of all your units in the shrine space and roll <b>1 die for every 3 Strength</b>. Each <b>1 or 2</b> inflicts 1 casualty on the units in the target space; your opponent applies them as he sees fit."
    ],
    rulesSrc: "Expansion p.7",
    win: [
      "At the end of the turn, control at least <b>13 victory points</b>.",
      "Or your opponent loses his Town space and is eliminated."
    ],
    winSrc: "Expansion p.7"
  },

  dragon: {
    name: "Dragon Rise", group: "Expansion", tag: "exp", requires: "exp", players: [4], races: ["hu", "orc", "ud", "ne"], creeps: true, heroNote: true,
    blurb: "Orcs and Undead escort a dragon hatchling to its mother; Humans and Night Elves must kill one of the beasts.",
    origin: "an Expansion Set scenario",
    src: "Expansion p.7–8",
    img: "dragon.webp", imgCap: "Dragon Rise Scenario (Expansion p.8)", imgSrc: "Expansion p.7–8",
    boardNotes: ["Set up the board as the Dragon Rise diagram shows."],
    tokens: ["This scenario uses 2 creep tokens: put the <b>hatchling</b> on space <b>A</b> and the <b>dragon</b> on space <b>B</b>."],
    tokensSrc: "Expansion p.7",
    unitsSrc: "Expansion p.7",
    res: { g: 5, w: 5 }, resSrc: "Expansion p.7",
    first: null, firstSrc: "Expansion p.7",
    rules: [
      "<b>Teams:</b> the Night Elf and Human players against the Orc and Undead players.",
      "Orc and Undead units don’t have to stop when they enter the hatchling’s or dragon’s space, and don’t have to battle them.",
      "Any Orc or Undead unit may take the hatchling token along when it moves. The hatchling can’t move without an Orc or Undead unit.",
      "Night Elf and Human units follow the normal creep rules: they must end their move when they enter the hatchling’s or dragon’s space. If enemy units are there too, they battle those first; after that battle, or if there is none, they must battle the creeps."
    ],
    rulesSrc: "Expansion p.7–8",
    win: [
      "<b>Orc &amp; Undead:</b> at the end of the turn the hatchling is in space B and both the hatchling and the dragon are still in play. Or the Human or the Night Elf player loses his Town space and is eliminated.",
      "<b>Human &amp; Night Elf:</b> kill the hatchling or the dragon. Or the Orc or the Undead player loses his Town space and is eliminated."
    ],
    winSrc: "Expansion p.8"
  },

  elements: {
    name: "Battle of the Elements", group: "Expansion", tag: "exp", requires: "exp", players: [4], races: ["hu", "orc", "ud", "ne"], creeps: true, heroNote: true,
    blurb: "All four races, each for itself, race for four elemental artifacts guarded by creeps.",
    origin: "an Expansion Set scenario",
    src: "Expansion p.8",
    img: "elements.webp", imgCap: "Battle of the Elements Scenario (Expansion p.8)", imgSrc: "Expansion p.8",
    boardNotes: ["Set up the board as the Battle of the Elements diagram shows."],
    tokens: [
      "Place the <b>earth, air, fire and water</b> element tokens as the diagram shows.",
      "Without looking at them, place <b>2 random 1-point creeps</b> face down on each element space."
    ],
    tokensSrc: "Expansion p.8",
    res: { g: 5, w: 5 }, resSrc: "Expansion p.8",
    units: "Each player: <b>3 workers and 3 melee units</b> in his Town space.",
    unitsSrc: "Expansion p.8",
    first: null, firstSrc: "Expansion p.8",
    rules: [
      "Four players and no teams: all four factions race for the artifacts, and each victory condition is your own.",
      "When your units enter a space holding several creep tokens, reveal them all at once. They attack as allies, and the player controlling them decides how to split the casualties among them. Each creep token is worth its usual experience points.",
      "Any unit may take one or more element tokens along when it moves. Element tokens can’t move without a unit.",
      "If your units <b>begin and end</b> your Move Step in the same space as an element token, they gain an ability until the end of the turn: <b>Water — Heal</b>, <b>Earth — Raise Dead</b>, <b>Air — Slow Poison</b>, <b>Fire — Bloodlust</b>."
    ],
    rulesSrc: "Expansion p.8",
    win: [
      "At the end of the turn, have <b>3 of the element tokens</b> in the same space as your units.",
      "Or the <b>player to your left</b> loses his Town space and is eliminated."
    ],
    winSrc: "Expansion p.8"
  },

  orcsale: {
    name: "Orcs for Sale", group: "Online", tag: "online", players: [3], races: ["hu", "ud", "ne"],
    blurb: "Humans, Undead and Night Elves fight over a valley where renegade Orc bands sell their services.",
    origin: "the first online scenario, designed by Kevin Wilson",
    src: "Orcs for Sale sheet",
    img: "orcsale.webp", imgCap: "Orcs for Sale Scenario (Orcs for Sale sheet)", imgSrc: "Orcs for Sale sheet",
    boardNotes: ["Set up the board as the Orcs for Sale diagram shows."],
    tokens: [
      "Set up the <b>Orc unit tiles</b> to one side of the board, upgraded to their most powerful forms.",
      "Next to them place <b>3 Orc melee, 4 Orc ranged and 4 Orc flying</b> units. These are the mercenary reserves."
    ],
    tokensSrc: "Orcs for Sale sheet",
    res: { g: 8, w: 4 }, resSrc: "Orcs for Sale sheet",
    first: null, firstSrc: "Orcs for Sale sheet",
    rules: [
      "The <b>2-point objective spaces are the mercenary camps</b>. If you have at least one unit or worker on one, you may recruit mercenaries in your Spend Step <b>instead of</b> training, constructing or upgrading.",
      "Each mercenary costs <b>4 gold</b>: pay, take the Orc unit from the mercenary reserves and place it on your Town interface. Mercenaries deploy like your normal units but use the abilities on the Orc unit tiles.",
      "A mercenary must always be accompanied by one of your regular units. A mercenary in a space without a regular unit of its controller disbands at once and returns to the mercenary reserves.",
      "Recruiting a type with none left in the reserves means bribery: choose a mercenary of that type already on the board, remove it from play and place it on your Town interface."
    ],
    rulesSrc: "Orcs for Sale sheet",
    win: [
      "At the end of your turn, control <b>12 or more victory points</b>.",
      "Or the other two players have been eliminated."
    ],
    winSrc: "Orcs for Sale sheet"
  },

  goldrush: {
    name: "Gold Rush", group: "Online", tag: "online", players: [2], races: ["hu", "orc"],
    blurb: "Humans and Orcs race for a gold-rich valley on a divided, mountainous map. Player-submitted.",
    origin: "the first player-submitted scenario, designed by Matthew M. Monin",
    src: "Gold Rush sheet (player-submitted)",
    img: "goldrush.webp", imgCap: "Gold Rush Scenario (Gold Rush sheet, player-submitted)", imgSrc: "Gold Rush sheet (player-submitted)",
    boardNotes: ["Set up the board as the Gold Rush diagram shows."],
    res: { g: 5, w: 5 }, resSrc: "Gold Rush sheet (player-submitted)",
    first: null, firstSrc: "Gold Rush sheet (player-submitted)",
    rules: [
      "No special rules beyond the map. The sheet notes that the divided map makes flying units a strong strategy, while an early melee push can destroy an opponent before he gets established."
    ],
    rulesSrc: "Gold Rush sheet (player-submitted)",
    win: [
      "At the end of your turn, control <b>12 or more victory points</b>.",
      "Or the other player has been eliminated."
    ],
    winSrc: "Gold Rush sheet (player-submitted)"
  },

  plague: {
    name: "The Plague of the Scourge", group: "Online", tag: "online", players: [3], races: ["hu", "orc", "ne"],
    blurb: "Humans, Orcs and Night Elves race to buy the three ingredients of a plague cure from goblin shops. Fan-submitted.",
    origin: "a fan-submitted scenario, designed by L. Seuren",
    src: "Plague of the Scourge sheet (fan-submitted)",
    img: "plague.webp", imgCap: "The Plague of the Scourge Scenario (sheet, fan-submitted)", imgSrc: "Plague of the Scourge sheet (fan-submitted)",
    boardNotes: ["Set up the board as The Plague of the Scourge diagram shows."],
    tokens: [
      "Place the three special tokens that show the <b>melee (footman), ranged and flying</b> units as the diagram shows. They are the goblin merchants’ shops.",
      "Remove the Victory Point cards from each player’s experience deck and make <b>3 piles</b>, each with <b>1 Victory Point card of each participating race</b>.",
      "Put one pile at the <b>right</b> side of the board, by the <b>flying</b>-unit token; one to the <b>left</b> of the board, by the <b>footman</b> token; and one <b>below</b> the board, by the <b>ranged</b>-unit token. They are the three shops’ inventories."
    ],
    tokensSrc: "Plague of the Scourge sheet (fan-submitted)",
    res: { g: 5, w: 5 }, resSrc: "Plague of the Scourge sheet (fan-submitted)",
    first: null, firstSrc: "Plague of the Scourge sheet (fan-submitted)",
    rules: [
      "With one of your units on a shop token during the Spend Step, you may, <b>in addition to your normal Spend action</b>, buy your own Victory Point card from that shop’s pile for <b>4 gold</b>. It is one of the three ingredients of the potion.",
      "Each shop holds only one of your cards, so you must visit all three merchants."
    ],
    rulesSrc: "Plague of the Scourge sheet (fan-submitted)",
    win: [
      "At the end of <b>any Step</b>, have a total of <b>9 victory points</b> and all <b>3 Victory Point cards</b> of your colour.",
      "Or the other two players have been eliminated."
    ],
    winSrc: "Plague of the Scourge sheet (fan-submitted)"
  }
};

/* Player counts a scenario allows. The main game: 2 or 4; 3 needs the Expansion Set (Expansion p.3). */
WC.playersFor = (id, has) => id === "main" ? (has("exp") ? [2, 3, 4] : [2, 4]) : WC.S[id].players;
WC.scenAvailable = (id, has) => !WC.S[id].requires || has(WC.S[id].requires);
/* Teams (Rules p.3, p.9; Rules p.11; Expansion p.7). */
WC.teamsFor = (id, p) => id === "main" ? (p === 4 ? [["hu", "ne"], ["orc", "ud"]] : null)
  : (id === "nordrassil" ? [["hu", "orc", "ne"], ["ud"]] : (id === "dragon" ? [["ne", "hu"], ["orc", "ud"]] : null));
/* Creep rules in play: the Creeps option, Heroes (which require creeps — Expansion p.5), or a scenario built on creeps. */
WC.creepRules = (c) => c.mod("creeps") || c.mod("heroes") || !!WC.S[c.scen].creeps;
/* Standard creep placement (Expansion p.4). Dragon Rise and Battle of the Elements already include creeps:
   they place the normal creeps only "if you are using heroes" (Expansion p.7–8). */
WC.stdCreeps = (c) => WC.S[c.scen].creeps ? c.mod("heroes") : (c.mod("creeps") || c.mod("heroes"));

/* ---------------------------------------------------------------------------
   Optional rules. requires: set id; avail(c): extra availability; excludes: rival options.
   --------------------------------------------------------------------------- */
WC.modules = [
  { id: "vp20", requires: "core", name: "Strategic Four-Player Game (20 VP)",
    avail: (c) => c.scen === "main" && c.p === 4,
    summary: "Teams play to 20 victory points instead of 30",
    description: "The four-player main game was designed to end in an elimination. For a likelier victory-point win, play to 20 instead of 30. Offered by the FAQ and again as the Expansion Set’s Option 1.",
    src: "FAQ p.2 · Expansion p.3" },
  { id: "racial", requires: "exp", name: "Option 2 · Racial abilities",
    summary: "Each race gains its own inherent special ability",
    description: "Humans: Cooperative Building. Night Elves: Ancients (a moving Town and Outposts). Orcs: Protective Burrows. Undead: Undead Resource Gathering.",
    src: "Expansion p.3–4" },
  { id: "creeps", requires: "exp", name: "Option 3 · Creeps",
    avail: (c) => !WC.S[c.scen].creeps,
    summary: "Neutral creeps guard the 1- and 2-point objective spaces",
    description: "Face-down creep markers on the objective spaces. They fight anyone who enters and are worth experience points to heroes.",
    src: "Expansion p.4" },
  { id: "heroes", requires: "exp", name: "Option 4 · Heroes",
    summary: "One hero per race, levelled up with creep kills; abilities cost mana",
    description: "Needs the new experience cards (for mana) and creeps (to level up), so it turns Creeps on with it.",
    src: "Expansion p.4–6" },
  { id: "research", requires: "exp", name: "Option 5 · Spell research",
    summary: "No card draws from battles: research spells with gold instead",
    description: "Battles no longer give cards. When you train, pay 1 or 2 gold to place research tokens on your worker building; draw that many cards at your next Deploy Step.",
    src: "Expansion p.6" },
  { id: "drain", requires: "exp", name: "Option 6 · Draining resources", excludes: ["hidden"],
    summary: "No resource die: every mine and forest holds 20 and pays 2 per worker",
    description: "Each Goldmine starts with 20 gold and each Forest with 20 wood; each worker collects 2 per Harvest until the space is empty. Hidden resources plays this same Harvest with a different setup of the resource spaces, so the page offers one or the other (the book itself doesn’t forbid combining options).",
    src: "Expansion p.6" },
  { id: "hidden", requires: "exp", name: "Option 7 · Hidden resources", excludes: ["drain"],
    summary: "No resource die: face-down tokens hide how much each space holds",
    description: "Each resource space gets a face-down hidden resource token (20 each on the mine and forest beside your Town); each worker collects 2 per Harvest. It is Draining resources’ Harvest with a different setup of the resource spaces, so the page offers one or the other (the book itself doesn’t forbid combining options).",
    src: "Expansion p.6" }
];

WC.modAvailable = function (mod, c) {
  if (!c.has(mod.requires)) return false;
  if (mod.avail && !mod.avail(c)) return false;
  return true;
};

/* ---------------------------------------------------------------------------
   Rules the books leave open for a configuration (shown as a setup step and reported).
   --------------------------------------------------------------------------- */
WC.gaps = function (c) {
  const g = [];
  const expOpts = ["racial", "creeps", "heroes", "research", "drain", "hidden"].filter(m => c.mod(m));
  if (c.scen === "necro" && expOpts.length)
    g.push({ t: "March of the Necromancers gives the Undead player no Town interface, stockpiles or buildings and lets him neither train nor construct. The books don’t say how the Expansion Set’s optional rules apply to that side. Agree on it before play.", src: "Rules p.10" });
  if (c.scen === "nordrassil" && expOpts.length)
    g.push({ t: "In Nordrassil the Undead player skips the Harvest, Deploy and Spend Steps, the Allies skip Harvest and Deploy, and the Allies’ Outposts are their Towns. The books don’t say how the Expansion Set’s optional rules fit this scenario. Agree on it before play.", src: "Rules p.11" });
  if ((c.mod("drain") || c.mod("hidden")) && (c.scen === "elfgate" || c.scen === "necro"))
    g.push({ t: (c.scen === "elfgate"
        ? "This scenario’s depletion rules (every Goldmine and Forest not next to a Town starts completely depleted; those next to Towns never deplete) are"
        : "This scenario’s rule that the Goldmines and Forests next to the Human Town never deplete is") +
      " written for the resource die. The books don’t say how " + (c.scen === "elfgate" ? "they combine" : "it combines") + " with " + (c.mod("drain") ? "Draining" : "Hidden") + " resources.", src: "Rules p.10 · Expansion p.6" });
  if (c.has("exp") && (WC.S[c.scen].remove || c.scen === "plague"))
    g.push({ t: "This scenario removes or reuses cards by name from the base game’s experience decks, and was written before the Expansion Set’s new decks replaced them. The books don’t say how it maps onto the new decks. Check your decks, and agree before play.",
      src: (c.scen === "plague" ? "Plague of the Scourge sheet (fan-submitted)" : "FAQ p.1") + " · Expansion p.2" });
  return g;
};

/* ---------------------------------------------------------------------------
   How to win, for the configuration (setup, reference and teach all use it)
   --------------------------------------------------------------------------- */
WC.win = (c) => WC.val(WC.S[c.scen].win, c);
WC.winSrc = (c) => WC.val(WC.S[c.scen].winSrc, c);

/* Base-game experience cards the FAQ removes from the decks in a rulebook scenario (FAQ p.1). */
WC.removedCards = function (c) {
  const r = {};
  if (["elfgate", "necro", "captives", "nordrassil"].indexOf(c.scen) !== -1) r["Victory Point"] = true;
  if (c.scen === "necro" || c.scen === "nordrassil") r["Summon Building"] = true;
  if (c.scen === "nordrassil") { r["Renew"] = true; r["Call to Arms"] = true; r["Pillage"] = true; }
  return r;
};

/* =============================================================================
   SETUP PHASES — c = { has(set), p, mode/scen (scenario id), races[], race(id), teams, mod(id) }
   Order follows the rulebook's Game Setup steps 1–7 (Rules p.3), with the Expansion Set's
   insertions where its options put them (creeps, resources and the Tree of Eternity "after the
   game board is set up"; heroes during steps 2–4; Expansion p.3–6).
   ============================================================================= */
WC.phases = [
  {
    title: "Scenario & Races",
    steps: [
      { when: () => true, exp: (c) => WC.S[c.scen].tag,
        t: "Scenario, players & races",
        d: (c) => {
          const S = WC.S[c.scen];
          const items = [];
          items.push("<b>" + S.name + "</b>: " + S.origin + ", for <b>" + c.p + " players</b>.");
          if (c.scen === "main" && c.p === 2)
            items.push("Randomly choose <b>two races</b>, or let each player choose if everyone agrees; the other two races aren’t used. This game: <b>" + WC.rn(c.races) + "</b>.");
          else items.push("Races: <b>" + WC.rn(c.races) + "</b>" + (S.neutral ? ", with the <b>Night Elves as a neutral force</b> that no one plays" : "") + ". Decide who plays which randomly, or by choice if everyone agrees.");
          if (c.teams) items.push("Teams: " + c.teams.map(t => "<b>" + WC.rn(t) + "</b>").join(" against ") + ".");
          items.push("<b>How to win:</b>" + WC.ul(WC.win(c)));
          return WC.ul(items);
        },
        src: (c) => c.scen === "main"
          ? WC.src("Rules p.2–3, p.5, p.9", c.p === 3 ? "Expansion p.3" : null, c.p === 4 && c.mod("vp20") ? "FAQ p.2" : null,
              c.p === 4 && c.mod("vp20") && c.has("exp") ? "Expansion p.3" : null)
          : WC.src(WC.val(WC.S[c.scen].src, c), "Rules p.3") }
    ]
  },
  {
    title: "1 · Create the Game Board",
    steps: [
      { when: () => true, exp: (c) => (c.scen === "main" && c.p === 4) ? "faq" : WC.S[c.scen].tag,
        t: "Build the board",
        d: (c) => {
          const S = WC.S[c.scen];
          const file = WC.val(S.img, c);
          return WC.fig(file, "Board setup diagram: " + S.name, WC.val(S.imgCap, c)) +
            WC.ul(WC.val(S.boardNotes, c).concat([
              "Each board piece is double-sided, with a colour and number code on each side, such as “Cyan 7” or “Magenta 2”. Tap the diagram to open it full size."
            ]));
        },
        src: (c) => WC.src(WC.val(WC.S[c.scen].imgSrc, c), "Rules p.2") },
      { when: (c) => !!WC.S[c.scen].tokens, exp: (c) => WC.S[c.scen].tag,
        t: (c) => c.scen === "orcsale" ? "Set out the mercenary reserves" : (c.scen === "plague" ? "Set up the goblin shops" : "Place the scenario pieces"),
        d: (c) => WC.ul(WC.val(WC.S[c.scen].tokens, c)),
        src: (c) => WC.val(WC.S[c.scen].tokensSrc, c) },
      { when: (c) => WC.stdCreeps(c), exp: "opt",
        t: "Creeps",
        d: (c) => WC.ul([
          WC.S[c.scen].heroNote && c.mod("heroes") ? "This scenario says: if you are using heroes, place creeps by the normal creep rules." : null,
          "Separate the creep markers into two face-down piles, the <b>1-point</b> creeps and the <b>2-point</b> creeps, and shuffle each pile.",
          "Without looking, put <b>1 random 1-point creep</b> face down on each objective space marked with <b>1 victory point</b>, and <b>1 random 2-point creep</b> on each objective space marked with <b>2</b>.",
          "Objective spaces marked with <b>3 or 4</b> victory points get no creep.",
          "Put the remaining creep markers back in the box unseen; they aren’t used this game."
        ]),
        src: (c) => WC.src("Expansion p.4", WC.S[c.scen].heroNote && c.mod("heroes") ? WC.val(WC.S[c.scen].src, c) : null) },
      { when: (c) => c.mod("drain"), exp: "opt",
        t: "Draining resources: stock every resource space",
        d: WC.ul([
          "On each <b>Goldmine</b> space place one 10-gold token and two 5-gold tokens: <b>20 gold</b>.",
          "On each <b>Forest</b> space place one 10-wood token and two 5-wood tokens: <b>20 wood</b>."
        ]),
        src: "Expansion p.6" },
      { when: (c) => c.mod("hidden"), exp: "opt",
        t: "Hidden resources: stock every resource space",
        d: WC.ul([
          "Each player takes <b>one 20-gold and one 20-wood</b> hidden resource token and places them <b>face up</b> on the mine and forest spaces directly adjacent to his Town space.",
          "Shuffle the remaining hidden resource tokens face down. Without looking, place one on <b>every other resource space</b> on the board.",
          "Return any leftover tokens to the box unseen."
        ]),
        src: "Expansion p.6" },
      { when: (c) => c.mod("racial") && c.race("ne"), exp: "opt",
        t: "Night Elves: the Tree of Eternity",
        d: WC.fig("tree.webp", "Tree of Eternity setup diagram", "Tree of Eternity Setup (Expansion p.3)") +
          WC.ul([
            "After the board is built, the Night Elf player places the clear single-space board piece (<b>magenta 22</b>) on his Town space, then the <b>Tree of Eternity</b> token (<b>cyan 23</b>) on top of it.",
            "The space holding the Tree is the Night Elf Town space from now on; the covered original Town space is a clear space."
          ]),
        src: "Expansion p.3" }
    ]
  },
  {
    title: "2–4 · Towns, Resources & Starting Units",
    steps: [
      { when: () => true, exp: (c) => (c.has("exp") || c.mod("heroes") || c.mod("research")) ? "exp" : "core",
        t: "Set up your Town",
        d: (c) => {
          const S = WC.S[c.scen];
          return WC.ul([
            "Each player takes his race’s <b>Town interface, experience cards, unit tiles, units and markers</b> and places them in front of him, as the Town Setup diagram shows.",
            "Sort your <b>unit, building, Outpost and worker reserves</b> into separate piles near your Town interface. Keep space for your gold and wood stockpiles; new buildings come into play beside the Town interface.",
            "Your Town interface already has a <b>worker building</b> and a <b>melee building</b> printed on it.",
            S.town || null,
            c.has("exp") ? "<b>Expansion Set:</b> use the new race-coloured <b>Outpost markers</b>, which replace the base game’s. Each player takes his race’s <b>Player Reference Sheet</b>." : null,
            c.mod("heroes") ? "<b>Heroes:</b> take your race’s <b>hero marker, hero building, summoned creature markers</b> and all four sets of <b>hero cards</b> (12 cards). Add the hero building to your Town, completed side up, and the summoned creatures to your unit reserves. Put all the <b>wound tokens</b> in a central pile." : null,
            c.mod("research") ? "<b>Spell research:</b> place your race’s <b>2 research tokens</b> with your unit reserves." : null
          ]);
        },
        src: (c) => WC.src("Rules p.3–4, p.6", WC.S[c.scen].town ? "Rules p.10" : null,
          c.has("exp") ? "Expansion p.2–3" : null, c.mod("heroes") ? "Expansion p.4" : null, c.mod("research") ? "Expansion p.6" : null) },
      { when: (c) => c.mod("heroes"), exp: "opt",
        t: "Choose your hero",
        d: WC.ul([
          "Each race has <b>4 heroes</b>, each with its own set of 3 hero cards. Secretly choose one and take one of its cards; everyone reveals at the same time.",
          "Return the three unused sets (9 cards) to the box.",
          "Stack your hero’s 3 cards in Level order, <b>Level 1 on top</b>, and place them near your unit tiles.",
          "Heroes need the Expansion Set’s new experience cards, which carry the mana their abilities cost, and creeps, which are how they level up."
        ]),
        src: "Expansion p.4–5" },
      { when: () => true, exp: (c) => WC.S[c.scen].res === null ? "gap" : WC.S[c.scen].tag,
        t: "Starting resources",
        d: (c) => {
          const S = WC.S[c.scen];
          const r = S.res;
          const items = [];
          if (r === "none") items.push("<b>No resource stockpiles</b> in this scenario.");
          else {
            items.push("Separate the gold and wood tokens into two piles.");
            if (r === null) items.push("<b>Not in the books:</b> this scenario doesn’t state starting resources. The page uses the main game’s default, <b>5 gold and 5 wood</b> each; agree on it before play.");
            else if (typeof r === "string") items.push(r);
            else items.push("Each player receives <b>" + r.g + " gold and " + r.w + " wood</b>.");
            if (c.has("exp")) items.push("<b>Expansion Set:</b> you may add the 5- and 10-value gold and wood tokens to the piles.");
            items.push("Keep your resources in plain sight, and answer honestly if anyone asks how many you have.");
          }
          return WC.ul(items);
        },
        src: (c) => WC.src(WC.val(WC.S[c.scen].resSrc, c), WC.S[c.scen].res === null ? "Rules p.3" : null,
          WC.S[c.scen].res !== "none" ? "Rules p.5" : null, c.has("exp") && WC.S[c.scen].res !== "none" ? "Expansion p.2" : null) },
      { when: () => true, exp: (c) => WC.S[c.scen].tag,
        t: "Place starting units",
        d: (c) => {
          const S = WC.S[c.scen];
          return WC.ul([
            S.units || "Each player puts <b>3 melee units and 3 workers</b> from his reserves on his Town space.",
            c.mod("heroes") ? "<b>Heroes:</b> put your hero marker in the same space as your starting units; if they start in two or more spaces, any of those. Heroes don’t count against stacking limits." : null
          ]);
        },
        src: (c) => WC.src(WC.S[c.scen].unitsSrc || (c.scen === "main" ? "Rules p.3" : WC.val(WC.S[c.scen].src, c).split(" · ")[0]), c.mod("heroes") ? "Expansion p.5" : null) }
    ]
  },
  {
    title: "5–7 · Unit Tiles, Cards & First Player",
    steps: [
      { when: () => true, exp: (c) => WC.S[c.scen].tiles ? "scen" : "core",
        t: "Arrange the unit tiles",
        d: (c) => WC.ul([
          "Stack your unit tiles in <b>three stacks by type</b> (ranged, flying and melee), in Level order with <b>Level 1 on top</b>.",
          "The top tile of each stack gives the Strength and special ability of <b>all</b> your units of that type.",
          WC.S[c.scen].tiles ? "<b>This scenario:</b> " + WC.S[c.scen].tiles : null
        ]),
        src: (c) => WC.src("Rules p.3", WC.S[c.scen].tiles ? "Rules p.11" : null) },
      { when: () => true, exp: (c) => WC.S[c.scen].remove ? "faq" : (c.has("exp") ? "exp" : "core"),
        t: "Draw experience cards",
        d: (c) => {
          const S = WC.S[c.scen];
          return WC.ul([
            S.remove ? "<b>FAQ errata:</b> " + S.remove : null,
            c.scen === "plague" ? "Your Victory Point cards are already out of your deck, in the shops." : null,
            c.has("exp") ? "<b>Expansion Set:</b> each race uses its new experience deck, which replaces the base game’s. Each card also shows its <b>mana</b>." : null,
            "Each player shuffles his experience deck and draws <b>3 cards</b>. You may look at your own hand.",
            c.mod("research") ? "Spell research doesn’t change this: you still start with 3 cards." : null
          ]);
        },
        src: (c) => WC.src("Rules p.3", WC.S[c.scen].removeSrc || null, c.scen === "plague" ? "Plague of the Scourge sheet (fan-submitted)" : null,
          c.has("exp") ? "Expansion p.2" : null, c.mod("research") ? "Expansion p.6" : null) },
      { when: () => true, exp: (c) => WC.S[c.scen].first === "ud" || WC.S[c.scen].first === "ne" ? "scen" : (WC.S[c.scen].first === null ? "gap" : "core"),
        t: "Choose the first player",
        d: (c) => {
          const f = WC.S[c.scen].first;
          return WC.ul([
            f === "ud" ? "The <b>Undead player</b> begins the game as the first player."
              : (f === "ne" ? "The <b>Night Elf player</b> begins the game as the first player."
              : (f === "random" ? "Select one player <b>at random</b> to be the first player."
              : "<b>Not in the books:</b> this scenario doesn’t say who goes first. The page uses the main game’s default: choose one player <b>at random</b>.")),
            "The game is now ready to begin with Step 1, Move."
          ]);
        },
        src: (c) => WC.src(WC.val(WC.S[c.scen].firstSrc, c), WC.S[c.scen].first === null ? "Rules p.3" : null) }
    ]
  },
  {
    title: "Before You Start",
    steps: [
      { when: (c) => WC.gaps(c).length > 0, exp: "gap",
        t: "What the books leave open",
        d: (c) => WC.ul(WC.gaps(c).map(x => x.t)),
        src: (c) => WC.src(...WC.gaps(c).map(x => x.src)) }
    ]
  }
];

/* =============================================================================
   RULES REFERENCE
   ============================================================================= */
WC.costTable = function (c) {
  const rows = [
    ["Melee unit", "1 gold + 1 wood", "printed on the melee buildings (Rules p.6)"],
    ["Flying unit", "as printed on the flying building", "the rulebook’s Orc example pays 2 gold + 2 wood; the text gives no general cost, and the pictured tiles are too small to read (Rules p.3, p.7)"],
    ["Ranged unit", "as printed on the ranged building", "the rulebook text doesn’t state it (Rules p.3, p.6)"],
    ["Worker", "as printed on your Town interface", "the rulebook text doesn’t state it (Rules p.6)"],
    ["Building or Outpost", "2 gold + 2 wood each", "also printed on the Town interface (Rules p.7)"],
    ["Upgrade one unit type", "2 gold + 2 wood", "once per type per Spend Step (Rules p.7)"]
  ];
  if (c.mod("racial") && c.race("hu")) rows.push(["Human Cooperative Building", "3 gold + 3 wood and 2 workers each", "complete at once (Expansion p.3)"]);
  if (c.mod("heroes")) rows.push(["Re-training a hero", "1 gold + 1 wood per level", "on your hero building (Expansion p.6)"]);
  if (c.mod("research")) rows.push(["Spell research", "1 or 2 gold", "1 research token per gold (Expansion p.6)"]);
  if (c.scen === "orcsale") rows.push(["Orc mercenary", "4 gold each", "instead of your Spend option (Orcs for Sale sheet)"]);
  if (c.scen === "plague") rows.push(["Your Victory Point card at a shop", "4 gold", "in addition to your Spend option (Plague of the Scourge sheet (fan-submitted))"]);
  return "<table class='ref-table'><thead><tr><th>What</th><th>Cost</th><th>Note</th></tr></thead><tbody>" +
    rows.map(r => "<tr><td>" + r[0] + "</td><td><b>" + r[1] + "</b></td><td>" + r[2] + "</td></tr>").join("") + "</tbody></table>";
};

WC.racialText = {
  hu: "<b>Human Alliance — Cooperative Building.</b> In your Spend Step you have a fourth option: build <b>complete</b> buildings and Outposts by assigning <b>2 workers</b> and paying <b>3 gold + 3 wood</b> each, instead of 1 worker and 2 + 2. They come into play at once and are never under construction. Afterwards you may still take a second, normal Spend option (train, construct or upgrade), but not with those 2 workers.",
  ne: "<b>Night Elf Sentinels — Ancients.</b> Your Town is the <b>Tree of Eternity</b>, which can move up to <b>one space per turn</b> in your Move Step. It can’t move into a mountain, water, Town or Outpost space or a space with an enemy worker or unit, and can’t leave a space with enemy units. It doesn’t count against stacking, and wherever it stands is the Night Elf Town space. Each of your <b>Outposts may also move one space</b> in your Move Step, under the same limits, and doesn’t count against stacking. Cards and abilities that move units (Cripple, Fast, Town Portal, Mass Teleport) don’t affect the Tree or your Outposts.",
  orc: "<b>Orcish Horde — Protective Burrows.</b> During the Move Step, your <b>Town and Outposts can attack as ranged units with Strength 2</b> when they’re in the battlefield or a flank of a battle that has at least one actual participating Orc unit. Each rolls <b>one extra attack per Orc worker</b> in its space; an Outpost with 2 workers rolls 3 attacks. Towns, Outposts and workers still can’t be taken as casualties.",
  ud: "<b>Undead Scourge — Undead Resource Gathering.</b> In your Harvest Step you may harvest wood from any Forest where you have <b>3 melee units</b>; together they count as one worker and may break the worker stacking limit. In your Spend Step you <b>don’t assign workers</b> to construction: you still need one worker in your Town per building, and one in the space of each Outpost, but they stay free. The building or Outpost completes at your next Deploy Step even if those workers move, harvest or are killed."
};

WC.reference = [
  {
    title: "Turn Sequence", open: true,
    when: () => true,
    html: (c) => WC.ul([
      "Each turn has four steps: <b>1 · Move</b>, <b>2 · Harvest</b>, <b>3 · Deploy</b>, <b>4 · Spend</b> (train, construct <i>or</i> upgrade).",
      "During each step, every player takes that step in turn, starting with the <b>first player</b> and going clockwise. When everyone has finished, the next step begins.",
      "After the Spend Step the turn ends. The player to the left of the first player becomes the new first player, and a new turn begins.",
      c.scen === "nordrassil" ? "<b>Nordrassil:</b> the Undead player skips the Harvest, Deploy and Spend Steps, and the Allies skip Harvest and Deploy. The Night Elf player draws 1 set-aside card at the end of each turn." : null,
      c.scen === "necro" ? "<b>March of the Necromancers:</b> the Undead player can’t train or construct in his Spend Step." : null
    ]),
    src: (c) => WC.src("Rules p.4, p.7, p.12", c.scen === "nordrassil" ? "Rules p.11" : null, c.scen === "necro" ? "Rules p.10" : null)
  },
  {
    title: "Step 1 · Move",
    when: () => true,
    html: (c) => "<h4>Movement</h4>" + WC.ul([
      "Each of your units and workers may move <b>once</b>: melee and ranged units <b>1 space</b>, flying units and workers up to <b>2 spaces</b>, in any direction.",
      "<b>Stacking:</b> at the end of your Move Step you may have at most <b>3 of your units</b> and <b>3 of your workers</b> in one space. The two limits are separate, and only your own pieces count, so you may move 3 units into a space holding 3 enemy units." + (c.teams ? " In a team game, your teammate’s pieces do count toward your limits." : ""),
      "<b>Unit encounters:</b> a unit moving more than one space, a flyer or a unit on a Fast card, must stop as soon as it enters a space with an enemy unit, worker or Outpost.",
      "<b>Workers</b> can’t move into a space with enemy units, workers or Outposts unless one of your units is already there, even one that just moved in this turn.",
      "<b>Mountains:</b> only flying units may enter." + (c.has("exp") ? " <i>Expansion Set clarification:</i> an ability such as Raise Dead may place or summon other units there, but once such a unit leaves the mountain it can’t re-enter." : ""),
      c.has("exp") ? "<b>Water</b> (Expansion Set): only flying units may enter, and only to pass through. They can’t end their movement there." : null,
      c.mod("heroes") ? "<b>Heroes</b> move 2 spaces but can’t enter mountain or water spaces. Like other units they stop on entering a space with an enemy unit, worker or Outpost, and they don’t count against stacking limits." : null,
      WC.creepRules(c) ? "<b>Creeps</b> are always enemy units. A unit that enters a creep’s space must stop; a face-down creep is turned face up. Workers can’t enter a creep’s space unless you already have a unit there." : null,
      c.mod("racial") && c.race("ne") ? "<b>Night Elves (Ancients):</b> the Tree of Eternity and each Night Elf Outpost may move one space in the Night Elf Move Step (see Racial Abilities)." : null
    ]) + "<h4>After moving</h4>" + WC.ul([
      "Every space with at least one of your units and at least one enemy unit becomes a <b>battle</b>. You resolve all your battles, in any order you choose, before your Move Step ends. Moving onto an enemy worker alone doesn’t start a battle.",
      "Once your battles are resolved, <b>workers and Outposts</b> in spaces with enemy units are destroyed.",
      "<b>Captured Towns:</b> when all players have finished their Move Steps and all battles are resolved, a player whose Town space holds enemy units puts a <b>partial depletion marker</b> on it, which can never be removed. If one is already there, that player" + (c.teams ? " and his teammates are" : " is") + " <b>eliminated</b>: remove their workers, units and Outposts. If only one player or team is left, it wins."
    ]),
    src: (c) => WC.src("Rules p.4–5, p.9", c.has("exp") ? "Expansion p.2, p.3" : null, c.mod("heroes") ? "Expansion p.5" : null, WC.creepRules(c) ? "Expansion p.4" : null,
      c.mod("racial") && c.race("ne") ? "Expansion p.3–4" : null)
  },
  {
    title: "Battle — Who Fights & How",
    when: () => true,
    html: (c) => WC.ul([
      "A battle happens when units of two different players" + (c.teams ? " (or teams)" : "") + " share a space at the end of a player’s Move Step. That space is the <b>battlefield</b>; <b>every</b> adjacent space is a <b>flank</b>" + (c.has("exp") ? ", whether or not it holds any units" : "") + ".",
      "<b>All</b> units of the two players" + (c.teams ? " and their teammates" : "") + " in the battlefield and the flanks take part. Other players’ units in the flanks don’t.",
      c.mod("research") ? "<b>Spell research:</b> nobody draws cards when a battle begins or for winning it." : "When a battle begins, every player with a participating unit <b>draws 1 experience card</b>. When your deck runs out, shuffle your discard pile into a new deck.",
      "The <b>attacker</b> is the player whose Move Step triggered the battle; the <b>defender</b> is the player being attacked." + (c.teams ? " Teammates with participating units share those roles." : "")
    ]) + "<h4>Each round</h4><ol>" +
      "<li><b>Ranged units attack.</b> Both sides attack at once; casualties are removed; effects that last “for a phase” end.</li>" +
      "<li><b>Flying units attack</b>, the same way.</li>" +
      "<li><b>Melee units attack</b>, the same way. <b>Flying units can’t be chosen as casualties in the melee phase</b>; if a player has only flyers left, his remaining melee casualties are ignored.</li>" +
      "<li>Effects that last “for a round” end, and a new round begins with ranged attacks. Repeat until the battle ends.</li></ol>" +
      "<h4>Attacking</h4>" + WC.ul([
        "Roll <b>one battle die per unit</b> of the attacking type you have in the battle, counting the battlefield and the flanks. With more units than dice, note the results and roll again for the rest.",
        "Every die that rolls <b>equal to or less than your units’ Strength</b> (on the top unit tile) inflicts <b>1 casualty</b>.",
        "Flying units in a mountain fight normally. If the battlefield itself is a mountain, flank units still take part.",
        "<b>Several battles:</b> the moving player chooses the order. Units in two adjacent battlefields can fight in both, since each is in the other’s flank.",
        c.mod("heroes") ? "<b>Heroes</b> attack in the phase of their unit type and normally roll <b>1 die</b>. <b>Summoned creatures</b> and <b>creeps</b> roll the number of dice printed on their markers." : (WC.creepRules(c) ? "<b>Creeps</b> roll the number of dice printed on their markers, in the phase of their unit type." : null),
        c.mod("racial") && c.race("orc") ? "<b>Orcs (Protective Burrows):</b> in the Move Step, an Orc Town or Outpost in the battlefield or a flank may attack as ranged units with Strength 2 when at least one Orc unit is actually participating (see Racial Abilities)." : null
      ]),
    src: (c) => WC.src("Rules p.8–9", c.has("exp") ? "Expansion p.3" : null, c.mod("research") ? "Expansion p.6" : null, (c.mod("heroes") || WC.creepRules(c)) ? "Expansion p.2, p.4–5" : null, c.mod("racial") && c.race("orc") ? "Expansion p.4" : null)
  },
  {
    title: "Battle — Casualties, Winning & Cards",
    when: () => true,
    html: (c) => "<h4>Casualties</h4>" + WC.ul([
      "For each casualty you receive, remove <b>one of your participating units</b>, from the battlefield or a flank, and return it to your reserves. <b>You choose</b> which. Workers can never be casualties.",
      "The <b>defender removes the first casualty</b>, then the attacker, alternating until all are removed. Cards that reduce casualties must be played before the first casualty is removed.",
      "It often makes sense to remove your cheapest, weakest units first. Taking casualties from the <b>battlefield</b> ends a battle sooner; it’s the only way to “retreat” besides the Town Portal card. Taking them from a flank that holds enemy units can stop a second battle from happening there.",
      c.mod("heroes") ? "<b>Heroes</b> aren’t removed when given a casualty: place a <b>wound token</b> on the hero’s card instead. With wounds at least equal to its Life, it is killed: return the marker to your reserves and discard its wounds. <b>Summoned creatures</b> are killed as soon as they’re taken as a casualty." : null,
      WC.creepRules(c) ? "<b>Creeps</b> lose one die per casualty; with no dice left they are killed. A creep that survives gets its dice back after the battle." : null
    ]) + "<h4>Ending the battle</h4>" + WC.ul([
      "The battle continues until the <b>battlefield</b> holds units of only one race, or none. Flank units don’t count.",
      "The <b>winner</b>, the last player with units in the battlefield, immediately draws <b>1 experience card</b>" + (c.mod("research") ? ", except with Spell research" : "") + ".",
      "If the battle ends with no units in the battlefield, there is <b>no winner</b>: nobody draws the extra card, and any unit taken by a Devour card is killed."
    ]) + "<h4>Playing cards in battle</h4>" + WC.ul([
      "You may play cards during a battle only if you have <b>at least one unit participating</b> in it.",
      c.has("exp")
        ? "<b>Timing conflicts (Expansion Set):</b> if more than one player wants to use a card or hero ability at the same time, go in <b>play order, starting with the first player</b> and continuing clockwise. A player may decide not to use his card after seeing an earlier one."
        : "<b>Two players want to play at the same time?</b> When timing matters, the <b>player whose turn it is</b> plays one card first (in a battle, that’s the attacker, whose Move Step started it), then each player clockwise plays one, round and round until everyone has played all he wants (FAQ, December 2003).",
      c.has("exp")
        ? "<i>Older orders, now replaced:</i> the rulebook had the defender play first, with the attacker free to change his mind; the FAQ then had the player whose turn it is go first."
        : "<i>Rulebook order, replaced by the newer FAQ ruling:</i> the defender played first, and the attacker could then change his mind" + (c.teams ? "; in team play, each defender, then each attacker" : "") + "."
    ]),
    src: (c) => WC.src("Rules p.8–9", "FAQ p.2", c.has("exp") ? "Expansion p.3, p.6" : null, c.mod("heroes") ? "Expansion p.5" : null, WC.creepRules(c) ? "Expansion p.4" : null)
  },
  {
    title: "Unit Special Abilities",
    when: () => true,
    html: (c) => (c.has("exp") ? "<p class='callout'><b>Expansion Set:</b> each race’s <b>Player Reference Sheet</b> has updated versions of these abilities, which <b>replace</b> the base game’s. The Expansion rulebook doesn’t reprint them, so read your sheet. Below are the base-game texts with the FAQ’s revision.</p>" : "") +
      WC.ul([
        c.has("exp") ? "The icon on a unit tile or creep marker shows its special ability, if any. The top unit tile gives it to all your units of that type." : "The icon on a unit tile shows its special ability, if any. The top unit tile gives it to all your units of that type.",
        "<b>Area Attack:</b> a unit with this ability that rolls a <b>1</b> for its attack inflicts <b>2 casualties</b> instead of 1.",
        "<b>Heal</b> (revised by the FAQ): if you have a unit with Heal in the battle, each die your opponent rolls showing a <b>1</b> (not counting modifiers) inflicts <b>one fewer casualty</b>: 0 normally, or 1 with Area Attack. The 1 still counts as a hit and keeps its other effects, so it still triggers Raise Dead. The rulebook’s older Heal, reducing your casualties by 1 each phase, no longer applies.",
        "<b>Slow Poison:</b> at the start of each round, choose one phase for each unit with this ability you have in the battle. In those phases your units attack and deal casualties <b>first</b> instead of simultaneously. With <b>3 or more</b> such units, you attack first in every phase.",
        "<b>Bloodlust:</b> in a phase where you are already rolling at least one attack, roll <b>1 extra attack</b> if you have a unit with this ability in the battle.",
        "<b>Raise Dead:</b> if you have a unit with this ability in the battle, each <b>1</b> you roll also lets you add <b>one melee unit</b> from your reserves to the battlefield, as well as causing its casualty. You may ignore stacking limits while placing them; when the battle ends, return any over the limit to your reserves. It still triggers if the casualty is prevented.",
        c.has("exp") ? "<b>“Natural” rolls</b> (Expansion Set clarification): an ability triggered by a roll of 1, or any other number, works only if the die itself shows that number. Modifiers such as Faerie Fire don’t trigger it; a 2 modified to a 1 doesn’t trigger Heal." : null
      ]),
    src: (c) => WC.src("Rules p.3, p.12", "FAQ p.1–2", c.has("exp") ? "Expansion p.2–3" : null)
  },
  {
    title: "Step 2 · Harvest",
    when: () => true,
    html: (c) => {
      let h = "";
      if (c.mod("drain") || c.mod("hidden")) {
        h += "<p class='callout'><b>" + (c.mod("drain") ? "Draining resources" : "Hidden resources") + " is in play:</b> don’t roll the resource die. Each worker collects <b>2</b> of the space’s resource per Harvest Step; see that section below. The die rules here don’t apply.</p>";
      } else {
        h += "<h4>Rolling for resources</h4>" + WC.ul([
          "For each <b>Goldmine</b> where you have at least one worker, roll the <b>resource die once per worker</b> there and take that many <b>gold</b> tokens each time. Then do the same for each <b>Forest</b>, taking <b>wood</b>.",
          "Up to <b>3 workers</b> may harvest one space. Roll <b>one at a time</b>; once a roll leaves the space completely depleted, you make no more rolls there.",
          "<b>Depletion:</b> each time you roll a <b>3</b>, place a depletion token on the space, <b>partial</b> side up (a single line). If it is already partial, turn it to the <b>complete</b> side (a cross). A completely depleted space produces nothing more; the roll that depletes it still pays.",
          "If a resource pile runs out, keep track of the extra with coins or on paper."
        ]);
      }
      h += "<h4>Also</h4>" + WC.ul([
        "Keep your resources in plain sight, and answer honestly if asked how many you have.",
        "You can still harvest from a space with an Outpost, but the worker building that Outpost can’t harvest until it’s complete.",
        c.scen === "elfgate" ? "<b>The Elf Gate:</b> Goldmines and Forests next to Towns never deplete; ignore a rolled 3 there." : null,
        c.scen === "necro" ? "<b>March of the Necromancers:</b> the Goldmines and Forests next to the Human Town never deplete. When the Undead player harvests, each Necromancer on A, B or C lets him place a free unit there." : null,
        c.scen === "skull" ? "<b>Skull of Storms:</b> with a unit in the shrine space, you may call down lightning during your Harvest Step." : null,
        c.scen === "nordrassil" ? "<b>Nordrassil:</b> nobody plays the Harvest Step." : null,
        c.mod("racial") && c.race("ud") ? "<b>Undead:</b> 3 Undead melee units in a Forest may harvest wood as one worker (see Racial Abilities)." : null,
        (c.mod("drain") || c.mod("hidden")) ? "The Night Elf <b>Renew</b> card adds <b>10 wood</b> to a Forest space instead of its normal effect." : null
      ]);
      return h;
    },
    src: (c) => WC.src("Rules p.3, p.5", "FAQ p.2", (c.mod("drain") || c.mod("hidden")) ? "Expansion p.6" : null,
      (c.scen === "elfgate" || c.scen === "necro") ? "Rules p.10" : null, c.scen === "skull" ? "Expansion p.7" : null, c.scen === "nordrassil" ? "Rules p.11" : null,
      c.mod("racial") && c.race("ud") ? "Expansion p.4" : null)
  },
  {
    title: "Step 3 · Deploy",
    when: () => true,
    html: (c) => WC.ul([
      "Whatever you bought in a Spend Step comes into play in your <b>next</b> Deploy Step." + (c.mod("racial") && c.race("hu") ? " (The Humans’ Cooperative Building is the exception: those buildings and Outposts come into play at once.)" : ""),
      "<b>Units and workers in training:</b> take them off their buildings and place them on your <b>Town space and/or an Outpost space</b>. You may deploy into your own Town while enemy units occupy it; then no units or workers, whoever owns them, may leave that space, and the battle is fought in the Move Step as normal.",
      "<b>Buildings under construction:</b> turn them face up and return their workers to your Town space.",
      "<b>Outposts under construction:</b> turn them face up on the board. The worker steps off into the same space, free to move, harvest or build again. Units and workers may deploy onto an Outpost completed in the same Deploy Step.",
      "<b>Stacking limits apply.</b> A unit or worker with nowhere legal to go stays in training. If returning a building’s worker would break the worker limit in your Town, the building stays under construction; those workers can’t go to an Outpost instead.",
      "You may always choose <b>not</b> to complete a unit, worker, building or Outpost yet.",
      c.mod("research") ? "<b>Spell research:</b> remove your research tokens from your worker building and draw that many experience cards." : null,
      c.mod("heroes") ? "<b>Heroes:</b> a re-trained hero deploys like any unit, at the level it had when it was killed unless you trained it lower." : null,
      c.scen === "nordrassil" ? "<b>Nordrassil:</b> nobody plays the Deploy Step." : null
    ]),
    src: (c) => WC.src("Rules p.6", "FAQ p.2", c.mod("research") ? "Expansion p.6" : null, c.mod("heroes") ? "Expansion p.6" : null, c.scen === "nordrassil" ? "Rules p.11" : null,
      c.mod("racial") && c.race("hu") ? "Expansion p.3" : null)
  },
  {
    title: "Step 4 · Spend — Train, Construct or Upgrade",
    when: () => true,
    html: (c) => "<p>Choose <b>one</b> of the three options, or none. You may not spend on more than one" +
      (c.mod("racial") && c.race("hu") ? " (the Humans’ Cooperative Building is the exception)" : "") +
      (c.scen === "plague" ? "; buying at a goblin shop is extra" : "") + ".</p>" + WC.costTable(c) +
      "<h4>Option 1 · Train units and workers</h4>" + WC.ul([
        "Pick a <b>completed</b> building of the right type with no unit already training on it, pay the cost printed on it, and put the unit from your reserves on top of the building.",
        "Workers train only on the <b>worker building printed on your Town interface</b>: one at a time. You can never build another worker building.",
        "Train as many as your buildings and resources allow, up to your components: <b>10 melee, 7 ranged, 4 flying units and 8 workers</b> in play.",
        c.mod("research") ? "<b>Spell research:</b> when you train, you may also pay <b>1 or 2 gold</b> and put that many research tokens on your worker building instead of a worker. Up to 2 at a time, and not while a worker is training there." : null,
        c.mod("heroes") ? "<b>Heroes:</b> a killed hero is re-trained on your <b>hero building</b> for <b>1 gold + 1 wood per level</b>. It returns at its former level, or you may train it lower to save resources and lose those levels for good." : null
      ]) +
      "<h4>Option 2 · Construct buildings and Outposts</h4>" + WC.ul([
        "<b>Building:</b> take a worker off your Town space, pay 2 gold + 2 wood, and put the building tile face down next to your Town interface with the worker on it. It completes in your next Deploy Step.",
        c.mod("racial") && c.race("ud") ? "<b>Undead:</b> you don’t assign the worker; it must be in your Town, but stays free (see Racial Abilities)." : null,
        "<b>Outpost:</b> you need a worker in the chosen space. Pay 2 gold + 2 wood and put the Outpost face down there with that worker on it. If the worker does anything before the Outpost is complete (moves, harvests, fights, is killed), the Outpost is destroyed.",
        "Outposts can be built anywhere a worker can reach: every space except mountains" + (c.has("exp") ? " and water" : "") + ".",
        c.has("exp") ? "<b>Rebuilding an Outpost</b> (Expansion Set): with both your Outposts on the board, you may destroy one to reconstruct it in another space. Move the marker there face down, under construction." : null,
        "Limits: <b>2 melee, 3 ranged and 3 flying buildings, and 2 Outposts</b>, the tiles and markers you have.",
        !c.has("exp") && c.race("ud") && !WC.removedCards(c)["Summon Building"] ? "The Undead <b>Summon Building</b> card lets you start a Town building (not an Outpost) without using a worker." : null
      ]) +
      "<h4>Option 3 · Upgrade</h4>" + WC.ul([
        "Each unit tile lists the buildings you need to upgrade that type to its next level. If you have at least that many, pay <b>2 gold + 2 wood</b> and move the top tile to the <b>bottom</b> of its stack. Every unit of that type on the board improves at once.",
        "Upgrade as many types as you can afford, but <b>each type only once per Spend Step</b>.",
        "A <b>victory point symbol</b> instead of a requirement means the type is fully upgraded and worth <b>1 VP</b>, up to 3 VP for melee, ranged and flying.",
        "Choose carefully: it’s hard to build enough to upgrade everything to the top."
      ]) +
      ((c.scen === "orcsale" || c.scen === "plague" || c.scen === "necro") ? "<h4>This scenario</h4>" + WC.ul([
        c.scen === "orcsale" ? "Recruit Orc mercenaries (4 gold each) at a mercenary camp <b>instead of</b> training, constructing or upgrading." : null,
        c.scen === "plague" ? "With a unit on a shop token, buy your Victory Point card there for 4 gold <b>in addition to</b> your normal Spend option." : null,
        c.scen === "necro" ? "The Undead player can’t train or construct; Necromancers on D and E give him free upgrades." : null
      ]) : ""),
    src: (c) => WC.src("Rules p.2–3, p.6–7, p.12", "FAQ p.2", c.has("exp") ? "Expansion p.2, p.3" : null,
      c.mod("racial") ? "Expansion p.3–4" : null, (c.mod("heroes") || c.mod("research")) ? "Expansion p.6" : null,
      c.scen === "orcsale" ? "Orcs for Sale sheet" : null, c.scen === "plague" ? "Plague of the Scourge sheet (fan-submitted)" : null, c.scen === "necro" ? "Rules p.10" : null)
  },
  {
    title: "Victory Points & Winning",
    when: () => true,
    html: (c) => "<h4>This game</h4>" + WC.ul(WC.win(c)) +
      "<h4>Where victory points come from</h4>" + WC.ul([
        (c.has("exp")
          ? "<b>Experience:</b> Victory Point cards. Each base-game deck has <b>3</b>; the Expansion rulebook doesn’t list the cards in its new decks, which replace them, so check yours."
          : "<b>Experience:</b> each experience deck has <b>3 Victory Point cards</b>.") +
          " Hold one as long as you like; once played face up in front of you, it is worth 1 VP.",
        "<b>Upgrades:</b> each of your three unit types is worth 1 VP when fully upgraded.",
        "<b>Board control:</b> spaces showing a VP value score for any player with units in them at the end of the turn. <b>Town spaces are worth 3</b>, objective spaces 1 or 2. Holding your own Town, at least one unit in it, keeps you at 3 VP or more.",
        c.teams ? "<b>Teams:</b> a space scores only once, even when both teammates have units in it." : null,
        (c.scen === "elfgate" || c.scen === "necro" || c.scen === "captives" || c.scen === "nordrassil" || c.scen === "dragon" || c.scen === "elements" || c.scen === "altar")
          ? "<b>This scenario</b> isn’t won on victory points." + (WC.S[c.scen].remove ? " The Victory Point cards are removed from the decks." : "") : null
      ]) + "<h4>Elimination</h4>" + WC.ul([
        "A Town space still occupied by enemy units after everyone’s Move Step gets a permanent partial depletion marker. The second time, that player" + (c.teams ? " and his teammates are" : " is") + " eliminated, and his workers, units and Outposts are removed.",
        "If only one player or team is left, the game ends and that player or team wins."
      ]),
    src: (c) => WC.src("Rules p.2, p.5, p.9", c.teams ? "FAQ p.2" : null, WC.winSrc(c).indexOf("Rules p.2") === 0 ? null : WC.winSrc(c),
      c.mod("vp20") ? "FAQ p.2" : null, c.mod("vp20") && c.has("exp") ? "Expansion p.3" : null, WC.S[c.scen].removeSrc || null,
      c.has("exp") ? "Expansion p.2" : null)
  },
  {
    title: "Team Play",
    when: (c) => !!c.teams,
    html: (c) => "<p>Teams: " + c.teams.map(t => "<b>" + WC.rn(t) + "</b>").join(" against ") + ".</p>" + WC.ul([
      "<b>Resource sharing:</b> teammates may ask each other for resources at any time, but needn’t give them.",
      "<b>Friendly units and stacking:</b> you may move into spaces with your teammate’s units without a battle, but your teammate’s units and workers count toward your limits of 3 units and 3 workers in a space.",
      "<b>Battle and casualties:</b> your teammate’s units may join your battles if your teammate wants; he rolls for his own units. You and your teammate decide together how to split casualties.",
      "<b>Cards:</b> you may show your cards to your teammate, but never give him any. You can play cards in a battle only if you have a participating unit.",
      "<b>Scoring:</b> each space scores only once for a team.",
      "Eliminating one player also eliminates his teammates."
    ]),
    src: (c) => WC.src("Rules p.5, p.9", "FAQ p.2", c.scen === "nordrassil" ? "Rules p.11" : null, c.scen === "dragon" ? "Expansion p.7" : null)
  },
  {
    title: "This Scenario — Special Rules",
    when: (c) => c.scen !== "main",
    html: (c) => {
      const S = WC.S[c.scen];
      return "<p><b>" + S.name + "</b>: " + S.origin + ".</p><h4>Special rules</h4>" + WC.ul(WC.val(S.rules, c)) +
        "<h4>Victory</h4>" + WC.ul(WC.win(c));
    },
    src: (c) => WC.src(WC.val(WC.S[c.scen].rulesSrc, c), WC.winSrc(c) !== WC.val(WC.S[c.scen].rulesSrc, c) ? WC.winSrc(c) : null)
  },
  {
    title: "Experience Cards",
    when: () => true,
    html: (c) => {
      let h = WC.ul([
        "You start with <b>3 cards</b>. " + (c.mod("research") ? "With Spell research you draw only through research, not from battles." : "You draw <b>1</b> when a battle you have units in begins, and <b>1 more</b> for winning a battle."),
        "When your deck runs out, shuffle your discard pile into a new deck.",
        "Play a card whenever its text allows. In a battle, you need at least one participating unit.",
        "You may play <b>several copies of the same card</b> at once, and their effects may stack. <b>Fast</b> normally doesn’t, since it limits movement to 3; <b>Cripple</b> stacks down to 0; <b>Envenomed Spears</b> doesn’t, since you must keep the second roll.",
        c.has("exp")
          ? "<b>Two players want to play at the same moment?</b> Go in play order from the first player, clockwise; each may decline after seeing earlier plays (Expansion p.6). This replaces the FAQ’s order and the rulebook’s defender-first battle order."
          : "<b>Two players want to play at the same moment?</b> When timing matters, the player whose turn it is plays one card first, then each player clockwise plays one, round and round until everyone has played all he wants (FAQ). In a battle the player whose turn it is is the attacker; this newer ruling replaces the rulebook’s battle order, where the defender played first."
      ]);
      const gone = WC.removedCards(c);
      const card = (name, text) => "<b>" + name + ":</b> " + text + (gone[name] ? " <i>Not in the decks in this scenario (FAQ errata).</i>" : "") +
        (name === "Victory Point" && c.scen === "plague" ? " <i>In this scenario your Victory Point cards start in the goblin shops.</i>" : "");
      if (c.has("exp")) {
        h += "<h4>Expansion Set cards</h4>" + WC.ul([
          "The Expansion’s <b>120 new experience cards</b> replace the base game’s decks. They work the same way, add new race-specific effects, and each shows its <b>mana</b>. The rulebook doesn’t list their texts, so read each card.",
          "<b>Mana</b> pays for hero abilities. You discard cards to pay; a card discarded for mana has no other effect.",
          "<b>Timing words</b> in italics at the start of a card or ability: <b>Start of</b> a turn, round, phase or step means before anything else happens then. <b>End of</b> means after everything else in it is resolved; End of Battle comes after the winner is known. <b>Before Casualties</b> means after the phase’s attacks are rolled, before casualties are assigned. <b>Response</b> means triggered by the event it names. <b>Always</b> means always active once gained."
        ]);
      } else {
        h += "<h4>Card abilities by race</h4>" +
          "<p><b>Humans</b></p>" + WC.ul([
            card("Call to Arms", "when an enemy unit moves onto a space with your workers, those workers count as melee units until the end of that Move Step."),
            card("Dispel Magic", "in battle, cancel a card that was just played, before its effect resolves."),
            card("Invisibility", "in battle, before casualties are removed, reduce a player’s casualties by 1."),
            card("Polymorph", "in battle, at the start of a round, one participating enemy unit can’t attack this round. It can do anything else: use its abilities, be chosen as a casualty.")
          ]) + "<p><b>Orcs</b></p>" + WC.ul([
            card("Devour", "in battle, at the start of a round, remove one enemy melee or ranged unit from the battle until it ends. It is killed if you win the battle, or if the battle has no winner; otherwise it stays where it was."),
            card("Ensnare", "in battle, at the start of the melee phase: for the rest of the battle your opponent can take his flying units as casualties in the melee phase."),
            card("Envenomed Spears", "in battle, before rolling your attacks for a phase: re-roll any misses this phase, keeping the second result."),
            card("Pillage", "in battle, after an enemy removes a unit as a casualty: take that unit’s cost in gold and wood from him. If he can’t pay a resource in full, take all he has of it.")
          ]) + "<p><b>Night Elves</b></p>" + WC.ul([
            card("Faerie Fire", "in battle, before rolling your attacks for a phase: subtract 1 from each attack you roll this phase. A 2 modified to a 1 doesn’t count as a 1 for your opponent’s Heal (FAQ)."),
            card("Marksmanship", "in battle, just before your opponent removes a casualty you caused this phase: you choose it, within the normal casualty rules."),
            card("Moon Glaive", "in battle, after rolling your attacks for a phase: roll one extra attack at your units’ Strength for each hit you scored."),
            card("Renew", "at the start of your Harvest Step, remove a partial or complete depletion marker from one Forest space.")
          ]) + "<p><b>Undead</b></p>" + WC.ul([
            card("Cripple", "at the start of an opponent’s Move Step, choose a space: enemy units and workers there move 1 less space this turn, to a minimum of 0."),
            card("Curse", "in battle, after your opponent rolls his attacks for a phase: roll a die for each hit he scored; each 3 or less prevents one casualty."),
            card("Summon Building", "in your Spend Step, start constructing a building in your Town (not an Outpost) without using a worker."),
            card("Web", "in battle, at the start of the melee phase: for the rest of the battle your opponent can take his flying units as casualties in the melee phase.")
          ]) + "<p><b>All races</b></p>" + WC.ul([
            card("Fast", "at the start of your Move Step, choose a space: your units and workers there may move up to 2 extra spaces this turn, to a maximum of 3. A unit must still stop on entering a space with an enemy unit, worker or Outpost."),
            card("Resources", "at the start of your Spend Step, take 2 gold or 2 wood as though you had just harvested them."),
            card("Town Portal", "at the end of any player’s Move Step, before battles: move all your units from one space to your Town or an Outpost space. Units over the stacking limit go to adjacent spaces, and you can’t leave any behind."),
            card("Victory Point", "hold it until you choose to play it in front of you; then it is worth 1 VP.")
          ]);
      }
      return h;
    },
    src: (c) => WC.src("Rules p.3, p.8–9, p.12", c.has("exp") ? null : "FAQ p.1", "FAQ p.2", c.has("exp") ? "Expansion p.2, p.5–6" : null, c.mod("research") ? "Expansion p.6" : null,
      !c.has("exp") && c.scen === "plague" ? "Plague of the Scourge sheet (fan-submitted)" : null)
  },
  {
    title: "Expansion Set — What Changes",
    when: (c) => c.has("exp"),
    html: (c) => WC.ul([
      "<b>16 new board pieces</b>, with a new space type: <b>water</b>. Only flying units may enter it, and only to pass through.",
      "<b>Outposts:</b> the new race-coloured Outpost markers replace the base game’s.",
      "<b>Experience cards:</b> 120 new cards replace the base decks, and each carries <b>mana</b> for hero abilities.",
      "<b>Player Reference Sheets:</b> one per race, with updated special abilities that replace the base game’s, and the race’s inherent ability for the Racial Abilities option.",
      "<b>Resource tokens:</b> 5- and 10-value gold and wood tokens, which you may add to the piles; Draining resources uses them.",
      "<b>Quest tokens:</b> six more for scenarios, including the Night Elves’ <b>Tree of Eternity</b>.",
      "<b>Three-player main game:</b> played like the two-player game on the Three-Player Setup board, to 15 VP.",
      "<b>Seven optional rules</b>, each self-contained and usable alone or combined: the Strategic Four-Player Game, Racial abilities, Creeps, Heroes, Spell research, Draining resources and Hidden resources. Heroes need the new cards and Creeps. Hidden resources is Draining resources’ Harvest with a different setup, so this page offers one or the other.",
      "<b>Rule changes and clarifications</b>, applied throughout this page while the Expansion Set is selected: “natural” rolls, rebuilding Outposts, placing units in mountains, flanks and battles without a winner.",
      "<b>Timing (Appendix 1):</b> timing words on cards and hero abilities, and a new order for simultaneous plays, starting with the first player."
    ]),
    src: "Expansion p.2–3, p.6"
  },
  {
    title: "Racial Abilities",
    when: (c) => c.mod("racial"),
    html: (c) => WC.ul(c.races.map(r => WC.racialText[r])) +
      (WC.S[c.scen].neutral ? "<p>The neutral Night Elves in The Elf Gate aren’t a player’s race, so the Night Elf ability isn’t used.</p>" : ""),
    src: (c) => c.races.some(r => r === "orc" || r === "ud" || r === "ne") ? "Expansion p.3–4" : "Expansion p.3"
  },
  {
    title: "Creeps",
    when: (c) => WC.creepRules(c),
    html: (c) => WC.ul([
      "Creeps are neutral creatures that fight anyone. Each marker shows its <b>Strength</b>, its number of <b>dice</b>, its <b>unit type</b> (which decides the phase it attacks in) and its special ability. The back shows its <b>experience points</b>, 1 or 2.",
      "Creeps are always <b>enemy units</b>. A unit entering a creep’s space must stop, and a face-down creep is revealed; it stays face up until killed. Workers can’t enter a creep’s space unless you already have a unit there.",
      "<b>Battling creeps:</b> the <b>player to your left</b> rolls the creep’s dice, but draws no card and uses no cards or hero abilities for it. You still draw a card before the battle, and another if you win" + (c.mod("research") ? ", except with Spell research" : "") + ".",
      "Each casualty costs the creep <b>one die</b>. Lost dice return after the battle if it survives; with no dice left it is killed.",
      "<b>Experience:</b> if your hero is in the <b>battlefield</b> when a creep dies, take its marker face down. In a team game, every allied hero in the battlefield gets the full experience. If only non-hero units killed it, or your hero was only in a flank, the marker goes back to the box.",
      c.scen === "elements" ? "<b>Battle of the Elements:</b> several creeps in one space are all revealed and fight as allies; their controller splits the casualties." : null,
      c.scen === "dragon" ? "<b>Dragon Rise:</b> the hatchling and dragon are creeps. Night Elf and Human units follow the normal creep rules; Orc and Undead units don’t have to stop for them or battle them." : null
    ]),
    src: (c) => WC.src("Expansion p.2, p.4", c.scen === "elements" ? "Expansion p.8" : null, c.scen === "dragon" ? "Expansion p.7–8" : null)
  },
  {
    title: "Heroes",
    when: (c) => c.mod("heroes"),
    html: () => "<h4>The hero card</h4>" + WC.ul([
      "Each hero card shows its <b>type</b>, its <b>Level</b> (1 to 3), its <b>Strength</b>, its <b>Life</b> and its <b>special abilities</b>. Stars before an ability’s name are its <b>mana cost</b>."
    ]) + "<h4>Moving and fighting</h4>" + WC.ul([
      "A hero moves <b>2 spaces</b>, but can’t enter mountain or water spaces. It stops on entering a space with an enemy unit, worker or Outpost, and doesn’t count against stacking limits.",
      "A hero attacks in the phase of its unit type, normally rolling <b>1 die</b> at its Strength.",
      "A casualty assigned to a hero gives it a <b>wound token</b>, which stays until the hero dies (or is somehow healed). With wounds at least equal to its Life it is killed: return the marker to your reserves and discard its wounds.",
      "If your hero is in the battlefield when an enemy hero dies, it gains <b>2 experience points</b>: take an unused 2-point creep marker."
    ]) + "<h4>Abilities and mana</h4>" + WC.ul([
      "Pay an ability’s mana by <b>discarding experience cards</b> with that much mana. Excess mana is wasted.",
      "Each ability can be used <b>once per battle</b> unless it says otherwise, only at the time in italics on the card, and during a battle only if the hero is participating.",
      "<b>Summoned creatures:</b> place the marker where the ability says, usually the hero’s space. They don’t count against stacking, attack like units, and die as soon as they’re taken as a casualty. They vanish if their hero dies. Most leave right after the battle they were summoned in; a few stay and move with their hero, as its card says."
    ]) + "<h4>Leveling up</h4>" + WC.ul([
      "Heroes gain experience from creeps killed while they’re in the <b>battlefield</b>.",
      "<b>Once per turn, at the end of any player’s Move Step</b>, with at least 2 experience points (one 2-point creep or two 1-point creeps), you may level up. Discard the 2 points to the box, then move the top hero card to the bottom of the stack with its text still visible. The new card gives Level, Strength and Life, and earlier abilities stay in effect.",
      "Leveling up doesn’t heal. A Level 3 hero gains no more experience, so creep markers it helps kill go back to the box. A killed hero loses any unspent experience.",
      "Leveling up isn’t upgrading: no buildings needed, no resources spent."
    ]) + "<h4>Re-training</h4>" + WC.ul([
      "Heroes start in play, so you need the hero building only to re-train a killed hero: <b>1 gold + 1 wood per level</b>, with the Train option, on your hero building. It deploys in your Town or at an Outpost.",
      "It comes back at the level it died at. You may train it lower to save resources, but the levels are lost until earned again."
    ]),
    src: "Expansion p.2, p.4–6"
  },
  {
    title: "Spell Research",
    when: (c) => c.mod("research"),
    html: () => WC.ul([
      "Players <b>don’t draw cards</b> when a battle begins or for winning one. You still start with 3 cards.",
      "Each player keeps his race’s <b>2 research tokens</b> with his unit reserves.",
      "In your Spend Step, if you choose to train, you may also research: pay <b>1 or 2 gold</b> and put that many research tokens on your <b>worker building</b> in place of a worker. At most 2 at a time, and never while training a worker.",
      "In your Deploy Step, remove the tokens and <b>draw that many experience cards</b>."
    ]),
    src: "Expansion p.6"
  },
  {
    title: "Draining Resources",
    when: (c) => c.mod("drain"),
    html: () => WC.ul([
      "Each Goldmine starts with <b>20 gold</b> and each Forest with <b>20 wood</b>, in 10- and 5-value tokens.",
      "In your Harvest Step, <b>don’t roll</b>: collect <b>2 resources per worker</b> from the space, making change from the piles.",
      "A space with no resource tokens left is <b>depleted</b>; no depletion token is needed.",
      "The Night Elf <b>Renew</b> card adds <b>10 wood</b> to a Forest space instead of its normal effect."
    ]),
    src: "Expansion p.6"
  },
  {
    title: "Hidden Resources",
    when: (c) => c.mod("hidden"),
    html: () => WC.ul([
      "Every resource space starts with a hidden resource token. Your own adjacent mine and forest hold a face-up <b>20</b>; the others are face down.",
      "In your Harvest Step, <b>don’t roll</b>. With at least one worker on a space with a hidden token, reveal it if needed and discard it to the box. Place that many resources in the space, gold or wood by space type, then collect <b>2 per worker</b>.",
      "From then on each worker there collects 2 per Harvest Step. An empty space is <b>depleted</b>; no depletion token is needed.",
      "The Night Elf <b>Renew</b> card adds <b>10 wood</b> to a Forest space instead of its normal effect."
    ]),
    src: "Expansion p.6"
  },
  {
    title: "Key Rulings — FAQ & Clarifications",
    when: () => true,
    html: (c) => "<h4>FAQ &amp; Errata (December 2003)</h4>" + WC.ul([
      "<b>Heal</b> has been revised: see Unit Special Abilities.",
      "<b>Board diagrams:</b> the four-player main-game diagram is replaced by a corrected one (pieces 6/8 and 5/9 were swapped). In The Elf Gate, flip Cyan 4 to Magenta 4. In The Captives, the piece labelled Cyan 10 is Cyan 11.",
      "<b>Scenario setup:</b> remove the 3 Victory Point cards from every deck in The Elf Gate, March of the Necromancers, The Captives and Nordrassil. Also remove the 2 Summon Building cards (Undead) in March of the Necromancers; and in Nordrassil the 2 Summon Building, 2 Renew, 2 Call to Arms and 2 Pillage cards.",
      "<b>Retreat?</b> No. The only way out besides Town Portal is taking your casualties from the battlefield so the battle ends sooner.",
      "<b>Both sides wiped out in the same phase?</b> No winner: nobody draws the extra card, and units taken by Devour are killed.",
      "<b>Deploying into your own occupied Town</b> is allowed; nobody may leave the space, and the battle is fought in the Move Step.",
      "<b>Outposts</b> can be built anywhere a worker can reach, every space except mountains" + (c.has("exp") ? " (and the Expansion’s water, which workers can’t enter)" : "") + ". A space with an Outpost can still be harvested, but not by the worker building it.",
      c.teams ? "<b>Team scoring:</b> a space occupied by both teammates scores once." : null,
      "<b>Multiple copies</b> of one card may be played together: Fast doesn’t normally stack, Cripple stacks to 0, Envenomed Spears doesn’t stack.",
      c.has("exp") ? null : "<b>Simultaneous cards:</b> the player whose turn it is plays one first, then clockwise, until everyone is done. In a battle that player is the attacker, so this newer ruling replaces the rulebook’s defender-first order.",
      "<b>Polymorphed units</b> can do anything but attack that round. <b>Raise Dead</b> still triggers if the casualty is prevented.",
      c.p === 4 && c.scen === "main" ? "<b>Four-player target:</b> the main game was designed to end in an elimination. For a likelier VP win, play to 20; the Strategic Four-Player Game option." : null
    ]) + (c.has("exp") ? "<h4>Rule changes &amp; clarifications (Expansion Set rulebook, October 2004)</h4><p>Part of the Expansion Set’s rules, so they apply while it is selected.</p>" + WC.ul([
      "<b>“Natural” rolls:</b> abilities that trigger on a roll of 1, or any other number, need the die itself to show it; modified rolls don’t count.",
      "<b>Rebuilding Outposts:</b> with both your Outposts on the board, you may destroy one to reconstruct it elsewhere, face down and under construction.",
      "<b>Mountains:</b> units that can’t enter mountains can still be placed or summoned there by abilities such as Raise Dead, but can’t re-enter once they leave.",
      "<b>Flanks:</b> every space adjacent to a battlefield is a flank, even an empty one. Some cards and hero abilities care.",
      "<b>Winning a battle:</b> you win if you are the last player with units in the battlefield. A battle can end with no winner, and then nobody draws the winner’s card."
    ]) + "<h4>Timing (Expansion Set, Appendix 1)</h4>" + WC.ul([
      "<b>Timing conflicts:</b> simultaneous card or hero-ability uses go in play order from the first player, clockwise; each may decline after seeing earlier ones. This replaces the FAQ’s “player whose turn it is goes first” and the rulebook’s “defender first”."
    ]) : ""),
    src: (c) => WC.src("FAQ p.1–2", c.has("exp") ? "Expansion p.3, p.6" : "Rules p.9")
  },
  {
    title: "Board Pieces at a Glance",
    when: () => true,
    html: (c) => WC.ul([
      "Each board piece is <b>double-sided</b>, cyan and magenta, with a colour and number code on each side. Each base-game piece holds two or more spaces.",
      "<b>Space types:</b> <b>Town</b> (your units and workers enter play here; worth 3 VP while you hold it), <b>Forest</b> (harvest wood), <b>Goldmine</b> (harvest gold), <b>Mountain</b> (flying units only), <b>Objective</b> (its VP count for anyone with units there) and <b>Clear</b> (no effect)" + (c.has("exp") ? ", plus the Expansion’s <b>water</b> (flyers pass through only)" : "") + "."
    ]) + "<h4>The 13 base pieces (Scenario Creation Guide)</h4>" + WC.ul([
      "<b>Town pieces 2, 3, 10 and 12</b> each hold one race’s Town space: in a corner on one side, in the middle of an edge on the other. Each side also has 1 forest, 1 goldmine and 1 mountain. In the four-player main game the Night Elf Town is on 2, Orc on 3, Human on 10 and Undead on 12.",
      "<b>Center piece 7:</b> the cyan “feast” side has 3 forests, 3 goldmines and a 2-point objective. The magenta “famine” side has 3 mountains around a 4-point objective, the elf gate.",
      "<b>Diamond pieces 6 and 8:</b> cyan, a goldmine and a 1-point objective (the bandit camp). Magenta: 6 has a forest and another 1-point objective, 8 a goldmine and a mountain.",
      "<b>Wedge pieces 4 and 11:</b> cyan, a forest and a 1-point objective. The magenta side adds a goldmine.",
      "<b>Strip pieces 1 and 13:</b> cyan, a 2-point objective. Magenta: 1 has the set’s longest mountain chain (4 mountains), 13 is blank.",
      "<b>Small pieces 5 and 9:</b> cyan, a 2-point objective; magenta, nothing.",
      c.has("exp") ? "<b>Expansion pieces</b> add water spaces. <b>Magenta 22</b> is the clear single-space piece and <b>cyan 23</b> the Tree of Eternity, both used by the Night Elf racial ability." : null
    ]),
    src: (c) => WC.src("Rules p.2, p.4", "Scenario Guide p.2", c.has("exp") ? "Expansion p.2–3" : null)
  },
  {
    title: "Designing Your Own Scenario",
    when: () => true,
    html: () => "<p>From the designer’s Scenario Creation Guide, for groups inventing their own.</p><h4>A scenario’s format</h4>" + WC.ul([
      "<b>Title</b> and a little <b>story</b>: why are the races fighting, and what is each trying to do?",
      "<b>Players</b> and <b>Races</b>.",
      "<b>Special Tokens Required:</b> stick to the quest tokens that come with the game.",
      "<b>Setup:</b> a board diagram showing each piece’s orientation and where special tokens and units start, plus starting resources, pre-upgraded units, special pools or decks, and cards removed from the race decks.",
      "<b>Starting Units</b>, including those in Town spaces; <b>Playing &lt;Race&gt;</b> for rules that apply to one race; <b>Special Rules</b> for everyone; <b>Victory Conditions</b>; and <b>Scenario Designed By</b>."
    ]) + "<h4>The designer’s rules of thumb</h4>" + WC.ul([
      "His standard start is <b>3 melee units and 3 workers</b>: one for gold, one for wood, one to build. Don’t start players with units they can’t build without first adding the building.",
      "If victory points don’t matter, remove the <b>VP cards</b> from the experience decks or give them another use. Check any cards affected by actions you disallow.",
      "<b>Quest tokens:</b> unit-type tokens are sources of units; captives and walls use The Captives’ rules; graveyards, Necromancers and Nordrassil make good objectives or markers.",
      "<b>Victory points:</b> for a bloody game, set the target near <b>9</b> (your Town + 3 VP cards + 3 upgrades) plus about <b>50%</b> of the board’s points, and <b>9 more per extra teammate</b>. For a likelier VP win, about <b>5</b> (+5 per teammate) plus <b>35%</b>. Remember that a 4-player board ties up 12 VP in Towns.",
      "Keep resource access fair between the Towns, focus on fun over cleverness, and playtest."
    ]),
    src: "Scenario Guide p.1–4"
  }
];

/* =============================================================================
   TEACHING SCRIPT
   ============================================================================= */
WC.teach = {
  intro: "A ~5-minute teach for the exact scenario, races and options selected above. Read it aloud, or hit Copy and tweak. Every rule in it comes from the rulebooks, FAQ and scenario sheets cited in the setup steps.",
  sections: [
    {
      h: "The hook — and how you win",
      body: (c) => {
        const S = WC.S[c.scen];
        const races = "<p>" + c.races.map(r => WC.RACE_TEACH[r]).join(" ") + "</p>";
        let hook;
        switch (c.scen) {
          case "main":
            hook = "<p>Tonight we play the main game of <b>Warcraft</b>. Each of us leads one of the races of Azeroth: <b>" + WC.rn(c.races) + "</b>. We’ll mine gold, cut wood, raise buildings and armies, and fight over the valuable spaces on a map built from hexagon pieces.</p>" +
              (c.p === 4
                ? "<p>We play as two teams, <b>Humans and Night Elves against Orcs and Undead</b>. The first team to hold <b>" + (c.mod("vp20") ? "20" : "30") + " victory points</b> at the end of either teammate’s turn wins." + (c.mod("vp20") ? " We’re playing the Strategic Four-Player Game: <b>20 victory points</b> instead of 30, so a team can win without wiping anyone out." : "") + "</p>"
                : "<p>The first of us to hold <b>15 victory points</b> at the end of his own turn wins." + (c.p === 3 ? " This three-player version comes with the Expansion Set’s board pieces." : "") + "</p>") +
              "<p>Points come from three places: the " + (c.has("exp") ? "" : "three ") + "victory point cards in your experience deck, fully upgrading a unit type, and holding scoring spaces. Your own Town is worth 3. There’s a faster way to win too: capture Towns. If enemy units are still in your Town after everyone has moved, it gets a permanent scar. A second time, and you’re out" + (c.teams ? ", along with your teammate" : "") + ".</p>";
            break;
          case "elfgate":
            hook = "<p>Tonight is <b>The Elf Gate</b>. Humans, Orcs and Undead race for a magic gate that moves armies across the world. A small, neutral <b>Night Elf</b> garrison guards it: it never moves, and the player on your left rolls for it when you attack. To win, end your turn with a unit on the gate, <b>space D</b>, while fewer than <b>three enemy units</b>, Night Elves included, stand in all the spaces around it. Or be the last of us standing. Victory points don’t count tonight, so the victory point cards are out of the decks.</p>";
            break;
          case "necro":
            hook = "<p>Tonight is <b>March of the Necromancers</b>. The Undead player has no town, no buildings and no stockpile, just <b>two Necromancers</b> roaming the countryside, raising free Undead units from the unit tokens at A, B and C and free upgrades at D and E. The Humans must <b>kill both Necromancers</b> or <b>destroy the tokens at A, B and C</b>. The Undead win by taking the Human Town.</p>";
            break;
          case "captives":
            hook = "<p>Tonight is <b>The Captives</b>. The Orcs hold the Night Elf leader Tyrande, and the Night Elves hold Thrall. Walls block melee and ranged units along certain edges. March a unit to your captive, escort it home to <b>your own Town</b>, and you win. Eliminating the other side works too.</p>";
            break;
          case "nordrassil":
            hook = "<p>Tonight is <b>Nordrassil, the World Tree</b>. Humans, Orcs and Night Elves team up against one Undead player. Every unit starts fully upgraded, and nobody has any resources. The Undead win by eliminating the Night Elf Outpost or by ending his turn with a unit on the Tree at <b>space A</b>. The Allies win when the Night Elf player draws the <b>last card of his experience deck</b>: Furion finishing his spell. He draws one extra, unplayable card every turn.</p>";
            break;
          case "altar":
            hook = "<p>Tonight is <b>The Altar of Flame</b>, from the Expansion Set: Humans against Undead, racing for an altar in no man’s land. With a unit on the altar, at the start of your Move Step you may try to steal an enemy unit: a <b>1 or 2</b> on a die swaps it for one of yours. End a turn with <b>three units on the altar</b>, or take the enemy Town, and you win.</p>";
            break;
          case "skull":
            hook = "<p>Tonight is <b>Skull of Storms</b>, from the Expansion Set: Orcs against Humans, fighting for a shrine in the middle of a lake. Units on the shrine can <b>call down lightning</b> in the Harvest Step: one die per 3 Strength there, and every 1 or 2 is a casualty in the target space. First to <b>13 victory points</b> at the end of a turn, or to take the enemy Town, wins.</p>";
            break;
          case "dragon":
            hook = "<p>Tonight is <b>Dragon Rise</b>, from the Expansion Set. Orcs and Undead team up to escort a dragon <b>hatchling</b> to its mother; Humans and Night Elves must kill the hatchling or the <b>dragon</b>. The Orcs and Undead win if the hatchling is in <b>space B</b> at the end of a turn with both dragons alive. Either side also wins by eliminating one enemy player.</p>";
            break;
          case "elements":
            hook = "<p>Tonight is <b>Battle of the Elements</b>, from the Expansion Set: all four races, each for itself, scrambling for four elemental artifacts guarded by creeps. Hold <b>three element tokens</b> with your units at the end of a turn to win, or knock out the player on your left.</p>";
            break;
          case "orcsale":
            hook = "<p>Tonight is <b>Orcs for Sale</b>, an official online scenario. Humans, Undead and Night Elves fight over a valley where renegade orc bands sell their swords at the <b>mercenary camps</b>. First to <b>12 victory points</b> at the end of his own turn wins, or be the last one standing.</p>";
            break;
          case "goldrush":
            hook = "<p>Tonight is <b>Gold Rush</b>, a player-submitted scenario published online: Humans against Orcs over a divided, mountainous map with a rich valley. First to <b>12 victory points</b> at the end of his own turn wins, or wipe out the other side. Flyers are strong here, and so is an early melee rush.</p>";
            break;
          default: // plague
            hook = "<p>Tonight is <b>The Plague of the Scourge</b>, a fan-submitted scenario published online. The Undead have infested the cities with a rare plague, and Humans, Orcs and Night Elves race to buy the three ingredients of a cure from <b>goblin shops</b>. You win at the end of <b>any step</b> if you have <b>9 victory points</b> and all three of your own victory point cards, or when both rivals are eliminated.</p>";
        }
        return hook + races;
      }
    },
    {
      h: "The shape of a turn",
      body: (c) => "<p>Every turn has four steps: <b>Move, Harvest, Deploy, Spend</b>. We all take the Move Step one after another, starting with the first player and going clockwise. Then we all Harvest, then Deploy, then Spend. Then the first-player role passes one seat to the left.</p>" +
        (c.scen === "nordrassil" ? "<p>Tonight some of us skip steps: the Undead player only moves and fights, and the Allies skip Harvest and Deploy.</p>" : "")
    },
    {
      h: "Your four steps — and why you take them",
      body: (c) => "<p><b>Move.</b> Each unit and worker may move once: melee and ranged units one space, flyers and workers up to two. Only flyers go into mountains" + (c.has("exp") ? ", and they can only fly over water" : "") + ". End your move with at most three of your own units and three of your own workers in a space. Move into enemy units and a battle starts once you’ve finished moving. Workers can’t walk in on enemies unless your units are already there, and any worker or Outpost left alone with enemy units is destroyed.</p>" +
        ((c.mod("drain") || c.mod("hidden"))
          ? "<p><b>Harvest.</b> Each worker on a goldmine or forest collects <b>2</b> gold or wood from it, until the space runs dry.</p>"
          : "<p><b>Harvest.</b> For each worker on a goldmine or forest, roll the resource die and take that much gold or wood. Roll a <b>3</b> and the space starts running dry; a second 3 exhausts it, so plan to move on.</p>") +
        "<p><b>Deploy.</b> Everything you paid for last turn arrives now: units and workers appear in your Town or at an Outpost, and new buildings and Outposts are finished.</p>" +
        "<p><b>Spend.</b> This is the big decision. Each turn you pick <b>one</b>: train units and workers, construct buildings and Outposts, or upgrade unit types. A melee unit costs 1 gold and 1 wood; buildings, Outposts and each upgrade cost 2 gold and 2 wood. More buildings let you train more at once and unlock upgrades, and an upgrade improves every unit of that type on the board at once.</p>"
    },
    {
      h: "Battle — the heart of the game",
      body: (c) => "<p>Battles decide Warcraft. The space you moved into is the <b>battlefield</b>. Every space around it is a <b>flank</b>, and all of both sides’ units there join in, so where you stand matters. " +
        (c.mod("research") ? "" : "Everyone fighting draws an experience card. ") +
        "Then <b>ranged units shoot, flyers attack, and melee units attack</b>. In each phase you roll one die per unit of that type, and every roll <b>equal to or under your Strength</b>, shown on your top unit tile, is a hit. Whoever is hit picks his own casualties, defender first. Melee attacks can’t hit flyers. Rounds repeat until only one side has units left in the battlefield itself; taking your casualties from the battlefield is how you cut your losses. " +
        (c.mod("research") ? "" : "The winner draws another card. ") +
        "Your experience cards are spells and tricks: play them when their text says.</p>"
    },
    { when: (c) => c.scen !== "main",
      h: (c) => "This scenario — " + WC.S[c.scen].name,
      body: (c) => {
        const S = WC.S[c.scen];
        const map = {
          elfgate: "Remember: every goldmine and forest that isn’t next to a Town starts completely depleted, and the ones next to our Towns never run dry. The Night Elves never move, and every one of them we kill is gone for good.",
          necro: "Necromancers move like workers: two spaces, and they die if caught alone with Human units. If Human units end a move on one of the tokens at A to E, that token is destroyed. The Undead player can’t train or construct. The Humans’ own goldmines and forests next to their Town never run dry.",
          captives: "A captive only moves with a unit of its own race. Walls stop melee and ranged units, and their flanking, across that edge, but flyers ignore them.",
          nordrassil: "The Allies’ Outposts count as their Towns. Killed Undead units come straight back at the nearest Undead Outpost or Town, and the empty areas inside the board are impassable.",
          altar: "Heroes can’t be stolen, and you can only steal a type you still have in your reserves.",
          skull: "Lightning can’t target a Town space, and the other player chooses which of his units take the casualties.",
          dragon: "Orc and Undead units walk past the hatchling and dragon and can carry the hatchling. Human and Night Elf units must stop and fight them, after any enemy units there.",
          elements: "Units that begin and end your move with an element token gain its power until the end of the turn: water gives Heal, earth Raise Dead, air Slow Poison and fire Bloodlust.",
          orcsale: "Park a unit or worker on a 2-point camp and you may spend your Spend Step hiring orcs at 4 gold each. They must always stay with one of your own units or they walk off, and if the mercenary reserve has none of the type you want left, you can bribe one away from a rival.",
          goldrush: "No special rules: just the map. Mountains split the board, so watch the resource spaces and where your flyers can reach.",
          plague: "With a unit on a shop during the Spend Step you may buy your own victory point card there for 4 gold, on top of your normal Spend. Each shop has one card for each of us."
        };
        return "<p>" + map[c.scen] + "</p>" + (S.remove ? "<p>Our decks have been trimmed per the FAQ, so some cards aren’t in them tonight.</p>" : "");
      }
    },
    { when: (c) => !!c.teams,
      h: "Playing as a team",
      body: (c) => "<p>Teammates: " + c.teams.map(t => WC.rn(t)).join(" against ") + ". Share resources when asked, if you like. Move through each other freely, but together you still count toward the limit of three units and three workers in a space. Fight side by side: each of us rolls for his own units, and the team decides together who takes casualties. You may show your cards to your teammate but never give them. A scoring space counts once for the team.</p>"
    },
    { when: (c) => c.has("exp"),
      h: "The Expansion Set",
      body: (c) => "<p>We’re using the <b>Expansion Set</b>: new board pieces, including <b>water</b> that flyers can only pass over, race-coloured Outposts, and new experience decks. Each new card also carries <b>mana</b>, which matters only for heroes. Your Player Reference Sheet has the updated unit abilities; they replace the old ones. When two of us want to play a card at the same moment, we go in play order from the first player.</p>"
    },
    { when: (c) => c.mod("racial"),
      h: "Racial abilities",
      body: (c) => {
        const t = {
          hu: "The <b>Humans</b> can use <b>Cooperative Building</b>: two workers and 3 gold plus 3 wood build something instantly, and they still get a normal Spend option afterwards.",
          ne: "The <b>Night Elf</b> Town is the <b>Tree of Eternity</b>, which walks one space a turn, and their Outposts can move too.",
          orc: "The <b>Orcs</b> have <b>Protective Burrows</b>: their Town and Outposts shoot at Strength 2 in nearby battles when an Orc unit is fighting, plus one attack per Orc worker there.",
          ud: "The <b>Undead</b> can <b>harvest wood with three melee units</b> in a forest, and never tie up a worker to build."
        };
        return "<p>Each race has its own racial ability tonight. " + c.races.map(r => t[r]).join(" ") + "</p>";
      }
    },
    { when: (c) => WC.creepRules(c),
      h: "Creeps",
      body: (c) => "<p><b>Creeps</b> are neutral monsters" + (WC.stdCreeps(c) ? ", sitting face down on the 1- and 2-point objective spaces" : "") + (c.scen === "dragon" ? "; tonight the hatchling and the dragon are creeps for Humans and Night Elves" : "") + (c.scen === "elements" ? "; tonight they guard the element tokens" : "") + ". Walk in and you must stop and fight them, and the player on your left rolls for them. Each hit strips one of their dice, and if they survive they heal. They’re worth experience to heroes.</p>"
    },
    { when: (c) => c.mod("heroes"),
      h: "Heroes",
      body: () => "<p>Each of us picked one of four <b>heroes</b>. A hero moves two spaces, doesn’t count toward stacking, and takes wounds instead of dying until its Life runs out. Heroes level up by being in the battlefield when creeps, or enemy heroes, die: two experience points buy a level, once per turn at the end of any Move Step, and every level adds abilities. Abilities cost <b>mana</b>: discard experience cards with enough mana to pay. Some heroes summon creatures. A killed hero can be re-trained on your hero building.</p>"
    },
    { when: (c) => c.mod("research"),
      h: "Spell research",
      body: () => "<p><b>Spell research</b> is on: battles give no free cards. Instead, when you train you may also pay 1 or 2 gold to place research tokens on your worker building. Each draws a card at your next Deploy Step, but not while you train a worker.</p>"
    },
    { when: (c) => c.mod("drain"),
      h: "Draining resources",
      body: () => "<p><b>Draining resources</b> is on: no resource die. Every goldmine and forest starts with 20, and each worker takes 2 per Harvest until the space is empty.</p>"
    },
    { when: (c) => c.mod("hidden"),
      h: "Hidden resources",
      body: () => "<p><b>Hidden resources</b> is on: no resource die. Each resource space hides a face-down token saying how much it holds; the first worker to harvest there reveals it. Each worker takes 2 per Harvest. The mine and forest beside your Town hold 20 each.</p>"
    },
    {
      h: "Don’t worry about these until they come up",
      body: (c) => WC.ul([
        "<b>Unit special abilities</b> such as Area Attack, Heal, Slow Poison, Bloodlust and Raise Dead: read the tile when an upgrade reveals one.",
        "<b>Each experience card’s exact text:</b> read it when you draw it.",
        "<b>Deploy details:</b> stacking limits can hold a unit back, and you may always delay finishing something.",
        c.has("exp") ? "<b>Rebuilding Outposts:</b> with both on the board, you may knock one down to rebuild it elsewhere." : null,
        "<b>Town Portal and Fast:</b> they bend movement; the card explains how.",
        c.has("exp") ? "<b>Timing words</b> on the new cards, like Start of, End of, Before Casualties and Response: we’ll check the reference when one comes up." : null,
        c.mod("heroes") ? "<b>Summoned creatures:</b> the hero card says how long each one stays." : null
      ])
    }
  ]
};
