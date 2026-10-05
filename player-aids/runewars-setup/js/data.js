/* =============================================================================
   Runewars (Revised Edition) — Setup & Reference Utility · data
   Sources (all in the game folder; citations use PRINTED page numbers, which equal the PDF page numbers in all four):
     Rules            — Runewars Revised Edition rulebook (©2012, PDF Jan 2013), 40 pp.
     Revised Gameplay — "Revised Edition Gameplay Changes" (updated 5/24/2013), 2 pp.: the changes needed to play the
                        revised edition with an ORIGINAL-edition copy; it overrides the original rulebook and Banners of War.
     BoW              — Banners of War expansion rules (©2011, written for the original edition), 12 pp.
     FAQ 1.2          — original-edition Errata and FAQ 1.2 (February 1, 2010), 1 p.
   Precedence: newest wins — Revised Gameplay > Rules > BoW > FAQ 1.2. FAQ entries are used only where the revised rules
   haven't absorbed or changed them (see the "Rulings & Precedence" reference section).
   ============================================================================= */
var RW = {};

RW.expMeta = {
  core: { name: "Runewars",        cls: "tag-core" },
  bow:  { name: "Banners of War",  cls: "tag-bow" },
  var:  { name: "Variant",         cls: "tag-var" },
  orig: { name: "Original copy",   cls: "tag-orig" },
  faq:  { name: "FAQ",             cls: "tag-faq" }
};

/* Which physical copy is on the table (Revised Gameplay p.1: "the rule changes required to play the revised edition of
   Runewars with a copy of the original edition"). The rules played are the revised rules either way. */
RW.copies = [
  { id: "rev", name: "Revised Edition copy",
    blurb: "The Revised Edition box and its rulebook. Victory cards are in the box." },
  { id: "orig", name: "Original-edition copy",
    blurb: "An original-edition box played with the revised rules: the Revised Gameplay sheet's card changes apply, and without Banners of War a unit stands in for the Victory card." }
];

RW.expansions = [
  { id: "core", short: "Runewars", year: "Base game", blurb: "Two to four factions, seven years, and the race for six dragon runes. Always in play." },
  { id: "bow",  short: "Banners of War", year: "Expansion", blurb: "Two new unit types per faction, Tactical Fate cards, the Garrison Order, map tiles 10–12 and the Lost City, plus three optional variants." }
];

/* The four factions (Rules p.4 component list; colors and names from Rules p.4, p.17, p.20; Banners of War units BoW p.2, p.6;
   defensive developments Rules p.33). */
RW.factions = [
  { id: "daqan",  name: "Daqan Lords",        art: "the ",        short: "Daqan",  color: "blue",
    units: "8 Bowmen, 16 Footmen, 8 Knights, 4 Siege Engines",
    bowUnits: "8 Novice Wizards, 4 Rocs",
    defName: "Reinforced Walls", defText: "+2 strength when determining the winner of the battle." },
  { id: "elf",    name: "Latari Elves",       art: "the ",       short: "Elves",  color: "green",
    units: "16 Archers, 4 Pegasus Riders, 8 Sorceresses, 8 Warriors",
    bowUnits: "8 Leonx Riders, 4 Forest Guardians",
    defName: "Protective Wards", defText: "forces the opponent to retreat one of his standing units immediately before calculating final strength." },
  { id: "waiqar", name: "Waiqar the Undying", art: "", short: "Waiqar", color: "purple",
    units: "4 Dark Knights, 8 Necromancers, 16 Reanimates, 8 Skeleton Archers",
    bowUnits: "8 Vampires, 4 Great Wyrms",
    defName: "Cursed Tomb", defText: "immediately before calculating final strength, the defender may discard it to force his opponent to rout three of his figures (it may be built again later)." },
  { id: "uthuk",  name: "Uthuk Y'llan",       art: "the ",       short: "Uthuk",  color: "red",
    units: "16 Berserkers, 4 Chaos Lords, 8 Flesh Rippers, 8 Warlocks",
    bowUnits: "8 Blood Sisters, 4 Obscenes",
    defName: "Hungry Spawn", defText: "immediately before calculating final strength, the defender may discard it to deal his opponent four damage, assigned by the normal damage rules (it may be built again later)." }
];

RW.modules = [
  { id: "explore", requires: "core", name: "Exploration Tokens", summary: "Facedown tokens in every area for heroes to uncover",
    description: "The base game's optional variant: heroes flip exploration tokens during the Quest Phase — events, locations and destructible locations. With Banners of War, its 8 exploration tokens join them.", src: "Rules p.37 · BoW p.11" },
  { id: "dev", requires: "bow", name: "Development Cards", summary: "Buy permanent faction upgrades with Harvest's Supremacy Bonus",
    description: "Eight Development cards per faction, bought with resources when you resolve Harvest's Supremacy Bonus. Brings capital strongholds, Waiqar's Reanimate tokens and the Daqan peasant tokens.", src: "BoW p.9" },
  { id: "cmd", requires: "bow", name: "Commanders of the Battlefield", summary: "A hero leads your army with a Commander card",
    description: "Each player starts with two heroes and makes one of them a commander, whose Commander card helps his units in battle.", src: "BoW p.10" },
  { id: "rotfc", requires: "bow", name: "Rise of the Free Cities", summary: "Richer alternate cities, three of them worth a dragon rune",
    description: "The alternate city tokens replace the base game's cities; three carry a dragon rune, and you need one more dragon rune to win.", src: "BoW p.11" },
  { id: "rtv", requires: "bow", locked: true, name: "Road to Victory", summary: "Always in force: the revised rules made Victory cards standard",
    description: "Banners of War's fourth option is now part of the core rules: playing with Victory cards is mandatory, not optional.", src: "Rules p.30" }
];

/* helpers */
/* Join citations, merging repeats of the same document: ("Rules p.7", "BoW p.5", "BoW p.9") -> "Rules p.7 · BoW p.5, p.9".
   A page or range already inside another range of the same document is dropped. */
RW.cite = function () {
  var order = [], pages = {};
  var span = function (seg) { var r = seg.split("–").map(Number); return [r[0], r[1] || r[0]]; };
  Array.prototype.slice.call(arguments).filter(Boolean).forEach(function (s) {
    s.split(" · ").forEach(function (part) {
      var m = part.match(/^(.*?) p\.(.+)$/);
      if (!m) { if (!(part in pages)) { order.push(part); pages[part] = null; } return; }
      if (!(m[1] in pages)) { order.push(m[1]); pages[m[1]] = []; }
      m[2].split(/,\s*p\./).forEach(function (seg) { if (pages[m[1]].indexOf(seg) < 0) pages[m[1]].push(seg); });
    });
  });
  return order.map(function (l) {
    if (pages[l] === null) return l;
    var segs = pages[l].filter(function (seg, i, all) {
      var a = span(seg);
      return !all.some(function (o, j) { var b = span(o); return j !== i && o !== seg && b[0] <= a[0] && a[1] <= b[1]; });
    }).sort(function (x, y) { return span(x)[0] - span(y)[0]; });
    var runs = [];                                   // merge touching pages into ranges: p.9, p.10 -> p.9–10
    segs.forEach(function (seg) {
      var a = span(seg), last = runs[runs.length - 1];
      if (last && a[0] <= last[1] + 1) last[1] = Math.max(last[1], a[1]); else runs.push(a);
    });
    return l + " p." + runs.map(function (r) { return r[0] === r[1] ? String(r[0]) : r[0] + "–" + r[1]; }).join(", p.");
  }).join(" · ");
};
RW.num = function (n) { return ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight"][n] || String(n); };
RW.facList = function (c) { return c.facs.map(function (f) { return f.name; }); };
RW.andList = function (a) { return a.length <= 1 ? a.join("") : a.slice(0, -1).join(", ") + " and " + a[a.length - 1]; };
RW.runesToWin = function (c) { return c.mod("rotfc") ? 7 : 6; };
/* The Victory marker: a Victory card, or — original-edition copy without Banners of War — an unused unit (Revised Gameplay p.2). */
RW.vMark = function (c) { return (c.orig && !c.has("bow")) ? "an unused unit of his faction" : "his faction's Victory card"; };

/* =============================================================================
   SETUP PHASES — c = { has(set), mod(id), p, orig, copy, fac(id), facs[] }
   ============================================================================= */
RW.phases = [
  {
    title: "Before Your First Game",
    steps: [
      { when: () => true, exp: "core",
        t: "Assemble the resource dials (first game only)",
        d: (c) => "<ul><li>Each faction sheet has <b>three resource dials</b> — food, wood and ore — and each faction has its own arrows and washers.</li>" +
          "<li>For each dial, in this order:<ol>" +
          "<li>Push one side of a plastic connector through the hole from the <b>back</b> of the faction sheet.</li>" +
          "<li>Fit one of the faction's <b>resource arrows</b> onto it, on the front of the sheet.</li>" +
          "<li>Add one of the faction's <b>resource washers</b> on top of the arrow.</li>" +
          "<li>Snap on the other half of the connector, as tightly as possible.</li></ol></li>" +
          "<li>Skip this step if your sheets are already assembled.</li></ul>",
        src: "Rules p.7, p.14" }
    ]
  },
  {
    title: "Players & Factions",
    steps: [
      { when: () => true, exp: "core",
        t: "Choose the first player (setup step 1)",
        d: "<ul><li>Shuffle the <b>Fate deck</b> and deal one card to each player.</li>" +
          "<li>The player with the <b>highest number</b> (printed bottom center; every Fate card has a unique number from 1 to 30) is the <b>first player</b>.</li></ul>",
        src: "Rules p.7, p.21" },
      { when: () => true, exp: (c) => c.has("bow") ? "bow" : (c.orig ? "orig" : "core"),
        t: "Choose factions and take their components (setup step 2)",
        d: (c) => {
          let d = "<ul><li>Starting with the first player and going <b>clockwise</b>, each player chooses a faction. Its components are marked with its color and/or symbol:<ul>" +
            "<li>faction sheet, home realm map tile and plastic figures;</li>" +
            (c.orig ? "<li>activation tokens, stronghold tokens and development tokens;</li><li>Order cards.</li></ul></li>"
                    : "<li>4 activation tokens, 4 stronghold tokens and 5 development tokens;</li><li>8 Order cards and 1 Victory card.</li></ul></li>");
          d += "<li>The figures at this table" + (c.orig ? " (counts from the Revised Edition component list)" : "") + ":<ul>" +
            c.facs.map(f => "<li><b>" + f.name + "</b> (" + f.color + "): " + f.units +
            (c.has("bow") ? "; with Banners of War also " + f.bowUnits : "") + ".</li>").join("") + "</ul></li>";
          if (c.has("bow")) d += "<li><b>Banners of War:</b> each player also takes his faction's pieces from the expansion:<ul>" +
            "<li>its <b>reinforcement sheet</b> — place it to the <b>right</b> of your faction sheet so the initiative numbers line up;</li>" +
            "<li>its 12 new units and its <b>Garrison</b> Order card;</li>" +
            "<li>any other components for the faction (the expansion adds 1 activation token and 1 development token per faction" +
            (c.orig ? ", and 1 Victory card per faction" : "") + ").</li></ul></li>";
          if (c.mod("dev")) d += "<li><b>Development Cards:</b> each player keeps his faction's <b>8 Development cards</b> and its <b>capital stronghold token</b> at hand.</li>";
          if (c.mod("cmd")) d += "<li><b>Commanders of the Battlefield:</b> each player takes his <b>commander tokens</b> (8 in the box).</li>";
          if (c.orig) d += c.has("bow")
            ? "<li><b>Original-edition copy:</b> the Victory cards come from Banners of War — the Revised Gameplay sheet says to use its Road to Victory rules (Victory cards) when you have the expansion.</li>"
            : "<li><b>Original-edition copy:</b> there are no Victory cards. To claim victory you will place <b>an unused unit of your faction</b> on a Season deck instead (see Rules Reference › How You Win).</li>";
          return d + "</ul>";
        },
        src: (c) => RW.cite("Rules p.4, p.7", c.has("bow") && "BoW p.2, p.4–6", c.mod("dev") && "BoW p.9", c.mod("cmd") && "BoW p.10", c.orig && "Revised Gameplay p.1–2") }
    ]
  },
  {
    title: "Build the Game Board (setup step 3)",
    steps: [
      { when: () => true, exp: (c) => c.has("bow") ? "bow" : "core",
        t: "Deal the Setup Quests (board step 1)",
        d: (c) => "<ul>" +
          (c.has("bow") ? "<li><b>Banners of War:</b> first shuffle the expansion's Setup Quests for map tiles <b>10, 11 and 12</b> into the Setup Quest cards.</li>" : "") +
          "<li>Separate out all the <b>Setup Quest</b> cards (labelled “Setup Quest”), shuffle them, and deal <b>two faceup</b> to each player — " + (2 * c.p) + " cards for " + RW.num(c.p) + " players.</li>" +
          "<li>They decide which map tiles each player places. Afterwards they are shuffled into the Quest deck (setup step 4).</li></ul>",
        src: (c) => RW.cite("Rules p.7–8, p.26", c.has("bow") && "BoW p.5") },
      { when: () => true, exp: (c) => c.orig ? "orig" : (c.has("bow") ? "bow" : "core"),
        t: "Take and assemble your map tiles (board step 2)",
        d: (c) => "<ul><li>Each player takes the map tiles matching the areas listed on his two Setup Quest cards.</li>" +
          (c.orig ? "<li><b>Puzzle-fit tiles</b> (in the Revised Edition box, areas <b>5, 6 and 8</b>): if a tile comes in two pieces, join the two pieces that share an area number before placing it.</li>"
                  : "<li><b>Puzzle-fit tiles:</b> areas <b>5, 6 and 8</b> each come in two pieces. Join the two pieces that share an area number before placing the tile, and take them apart again to fit them back in the box.</li>") +
          (c.has("bow") ? "<li><b>Banners of War:</b> a player dealt one of its Setup Quests takes that map tile (10, 11 or 12) from the expansion.</li>" : "") +
          (c.orig ? "<li><b>Original-edition copy:</b> the mountain pieces are held in their map tiles by their bottom lip only while the tile lies flat on the table. Store them separately after the game; gluing them in is optional but makes the box harder to pack (FAQ 1.2).</li>" : "") + "</ul>",
        src: (c) => RW.cite("Rules p.8, p.39", c.has("bow") && "BoW p.5", c.orig && "FAQ 1.2 p.1") },
      { when: () => true, exp: (c) => c.has("bow") ? "bow" : "core",
        t: "Place the map tiles (board step 3)",
        d: (c) => "<ul><li>Starting with the first player and going <b>clockwise</b>, each player places one of his tiles at a time in the center of the play area, until everyone has placed both.</li>" +
          "<li>Each new tile must have <b>two of its areas</b> (hexes) touching <b>at least two different areas</b> of tiles already placed.</li>" +
          "<li>A mountain (red) or water (blue) border may never touch another <b>parallel</b> mountain or water border.</li>" +
          "<li>The board may end up with holes (missing hexes). Figures can never move across them, even if flying.</li>" +
          (c.has("bow") ? "<li><b>Map tile 12</b> (Banners of War) is a single area with a yellow border:<ul>" +
            "<li>If it is placed <b>first</b>, the next tile must have two different areas touching two sides of tile 12.</li>" +
            "<li>If it is placed <b>later</b>, two sides of its area must touch at least two different areas of tiles already placed.</li>" +
            "<li>Its yellow border may not touch a parallel red or blue border. It has no other effect.</li></ul></li>" : "") + "</ul>",
        src: (c) => RW.cite("Rules p.8–9, p.18", c.has("bow") && "BoW p.5") },
      { when: () => true, exp: (c) => c.orig ? "orig" : "core",
        t: "Place the home realm setup markers (board step 4)",
        d: (c) => "<ul><li>The first player takes <b>" + RW.num(c.p) + "</b> home realm setup markers (one per player) and places them one at a time, each adjacent to the <b>edge</b> of the board.</li>" +
          "<li>Each marker must touch <b>at least three non-colored</b> area borders (not red or blue).</li>" +
          "<li>Each marker must have <b>at least three areas between it</b> and every other marker.</li>" +
          "<li>If the markers can't be placed this way, players take back their map tiles and return to board step 3.</li>" +
          (c.orig ? "<li><b>Original-edition copy:</b> this replaces the original rulebook's distance. The Revised Gameplay sheet words it as “three or more areas away from each other (instead of the old minimum of four)”; the Revised rulebook's example counts three areas between markers.</li>" : "") + "</ul>",
        src: (c) => RW.cite("Rules p.8–9", c.orig && "Revised Gameplay p.1") },
      { when: () => true, exp: (c) => c.orig ? "orig" : "core",
        t: "Place the rune tokens (board step 5)",
        d: (c) => "<ul><li>Starting with the first player and going <b>counterclockwise</b>, each player takes <b>1 dragon rune</b> token and <b>1 false rune</b> token.</li>" +
          "<li>He looks at them and secretly places them <b>facedown</b> in any two areas of his choice.</li>" +
          "<li>They can't go in an area that already contains a dragon rune, or in an area <b>adjacent to a home realm setup marker</b>. A rune token can never be placed in an area that already holds a rune token.</li>" +
          "<li>That puts " + RW.num(c.p) + " dragon runes and " + RW.num(c.p) + " false runes on the board.</li>" +
          (c.orig ? "<li><b>Original-edition copy:</b> rune tokens are <b>not</b> placed in the home realms during setup step 8, as the original rulebook had it; this step replaces that. The Revised Gameplay sheet says to do it “immediately after placing map tiles”, but its own rule text forbids areas adjacent to a home realm setup marker — so the markers must already be down, as in the Revised rulebook's order.</li>" : "") + "</ul>",
        src: (c) => RW.cite("Rules p.8–9, p.30", c.orig && "Revised Gameplay p.1") },
      { when: () => true, exp: "core",
        t: "Place the home realm map tiles (board step 6)",
        d: "<ul><li>Starting with the player to the <b>left</b> of the first player and going clockwise (so the first player places last), each player chooses one home realm setup marker.</li>" +
          "<li>He replaces it with his home realm map tile so that two areas of his home realm cover the marker's space. Any orientation is allowed, but tile placement rules still apply (no parallel mountain or water borders touching).</li>" +
          "<li>Home realm areas may <b>never</b> be adjacent to areas of another home realm. If that happens, remove all home realm setup markers, rune tokens and home realms and repeat board steps 4–6.</li></ul>",
        src: "Rules p.8–9" },
      { when: () => true, exp: "faq",
        t: "Place the neutral units (board step 7)",
        d: "<ul><li>In each area with a <b>neutral unit icon</b>, place the type and number of neutral units it shows.</li>" +
          "<li><b>FAQ 1.2 erratum:</b> areas <b>6D</b> and <b>3C</b> should each list <b>1 Giant</b>, not 2. Only area <b>2A</b> starts with 2 Giants. If your tiles show 2 Giants in 6D or 3C, place 1.</li></ul>",
        src: "Rules p.8, p.19 · FAQ 1.2 p.1" },
      { when: () => true, exp: (c) => c.mod("rotfc") ? "var" : (c.has("bow") ? "bow" : "core"),
        t: "Place the city tokens (board step 8)",
        d: (c) => "<ul>" +
          (c.mod("rotfc") ? "<li><b>Rise of the Free Cities:</b> use the <b>8 alternate city tokens</b> instead of the base game's city tokens.</li>" : "") +
          "<li>Randomize the city tokens and place one <b>faceup</b> on each city space (marked with the image from the back of the city tokens).</li>" +
          "<li>Return the unused city tokens to the box.</li>" +
          (c.has("bow") ? "<li><b>The Lost City</b> token is never placed during setup; it is double-sided as a reminder. Set it aside until a Quest card or effect places it on map tile 12.</li>" : "") + "</ul>",
        src: (c) => RW.cite("Rules p.8", c.has("bow") && "BoW p.5", c.mod("rotfc") && "BoW p.11") },
      { when: (c) => c.mod("explore"), exp: "var",
        t: "Exploration Tokens variant — place the tokens",
        d: (c) => "<ul>" + (c.has("bow") ? "<li><b>Banners of War:</b> add its 8 exploration tokens to the base game's.</li>" : "") +
          "<li>Place one random exploration token <b>facedown</b> in each area except home realms:<ul>" +
          "<li>a token with <b>“1”</b> on its back in each area adjacent to a home realm;</li>" +
          "<li>a token with <b>“2+”</b> on its back in every other non-home-realm area.</li></ul></li></ul>",
        src: (c) => RW.cite("Rules p.37", c.has("bow") && "BoW p.11") }
    ]
  },
  {
    title: "Decks, Forces & Starting Hands (setup steps 4–12)",
    steps: [
      { when: () => true, exp: (c) => c.has("bow") ? "bow" : "core",
        t: "Build the Quest deck (setup step 4)",
        d: (c) => "<ul>" + (c.has("bow") ? "<li><b>Banners of War:</b> its Quest cards are shuffled into the Quest deck.</li>" : "") +
          "<li>Remove every Quest card that refers to areas on map tiles <b>not used</b> this game, and return them to the box.</li>" +
          "<li>Shuffle the rest together with every player's two <b>Setup Quest</b> cards to form the Quest deck.</li></ul>",
        src: (c) => RW.cite("Rules p.7", c.has("bow") && "BoW p.5") },
      { when: () => true, exp: "core",
        t: "Set starting resources (setup step 5)",
        d: "<ul><li>Each player turns each of his three dials so its arrow points to the <b>red highlighted number</b> on that dial — the resources his home realm provides.</li></ul>",
        src: "Rules p.7, p.14" },
      { when: () => true, exp: (c) => c.has("bow") ? "bow" : "core",
        t: "Place your stronghold and starting forces (setup step 6)",
        d: (c) => "<ul><li>Starting with the first player and going clockwise, each player:<ol>" +
          "<li>places <b>one stronghold token</b> in any area of his home realm;</li>" +
          "<li><b>recruits</b> units using <b>all three</b> resource dials — on each dial, the unit pictured on the current space and on every lower space;</li>" +
          "<li>places those units in any areas of his home realm, <b>at most 8 units</b> per area.</li></ol></li>" +
          (c.has("bow") ? "<li><b>Banners of War:</b> each new unit may be recruited <b>in place of</b> the base unit pictured on your reinforcement sheet. For example, Daqan wood can recruit a Novice Wizard in place of a Bowman, and an Elf Leonx Rider replaces a Warrior.</li>" : "") + "</ul>",
        src: (c) => RW.cite("Rules p.7, p.18, p.35", c.has("bow") && "BoW p.6") },
      { when: () => true, exp: (c) => c.mod("cmd") ? "var" : (c.has("bow") ? "bow" : "core"),
        t: (c) => c.mod("cmd") ? "Starting heroes and commanders (setup step 7)" : "Receive your starting hero (setup step 7)",
        d: (c) => "<ul>" + (c.has("bow") ? "<li><b>Banners of War:</b> shuffle its 8 Hero cards in with the base game's.</li>" : "") +
          "<li>Shuffle the <b>good</b> and the <b>evil</b> Hero cards into separate decks.</li>" +
          "<li>Deal each player <b>" + (c.mod("cmd") ? "two Hero cards" : "one Hero card") + "</b> from the deck matching his faction's alignment — the banner on the faction sheet: white is good, black is evil.</li>" +
          "<li>Each player places the matching hero figure" + (c.mod("cmd") ? "s" : "") + " in any area of his home realm.</li>" +
          (c.mod("cmd") ? "<li><b>Commanders of the Battlefield:</b> shuffle the Commander cards and deal each player <b>one</b>. He chooses one of his heroes to be his <b>commander</b>, places the Commander card faceup next to that Hero card, and slides one of his commander tokens under the matching figure.</li>" : "") +
          "<li>Then shuffle all undealt Hero cards into a <b>single Hero deck</b>.</li></ul>",
        src: (c) => RW.cite("Rules p.7, p.20, p.25", c.has("bow") && "BoW p.4–5", c.mod("cmd") && "BoW p.10") },
      { when: () => true, exp: (c) => c.has("bow") ? "bow" : "core",
        t: "Shuffle and place the card decks (setup step 8)",
        d: (c) => {
          let d = "<ul>";
          if (c.has("bow")) d += "<li><b>Banners of War:</b> first shuffle its Objective (3 good, 3 evil), Reward (9), Season (3 per season) and Tactics (32) cards into the matching decks. Its Tactics include the dual-purpose <b>Tactical Fate</b> cards.</li>";
          d += "<li>Shuffle each of these separately and place them next to the board:<ul>" +
            "<li>Fate deck, Quest deck, Reward deck, Tactics deck and Hero deck;</li>" +
            "<li>the two Objective decks (good and evil);</li>" +
            "<li>the four Season decks: spring (green flower), summer (yellow sun), fall (orange leaf) and winter (blue snowflake).</li></ul></li>" +
            "<li>Place the <b>three Title cards</b> faceup near the decks. Title cards are never shuffled." +
            (c.has("bow") ? " Banners of War adds a fourth title to vie for, <b>Guildmaster of Merchants</b>." : "") + "</li>";
          if (c.mod("cmd")) d += "<li><b>Commanders of the Battlefield:</b> the undealt Commander cards form the <b>Commander deck</b>.</li>";
          if (c.has("bow") && !c.mod("cmd")) d += "<li><b>Lieutenant General:</b> this Tactics card is used only with Commanders of the Battlefield. Whoever draws it discards it and draws a new Tactics card.</li>";
          if (c.mod("dev")) d += "<li><b>Development Cards:</b> each faction's 8 Development cards stay with their player, ready to buy.</li>";
          return d + "</ul>";
        },
        src: (c) => RW.cite("Rules p.7, p.11, p.36", c.has("bow") && "BoW p.4–5, p.7–8", c.mod("cmd") && "BoW p.10", c.mod("dev") && "BoW p.9") },
      { when: (c) => c.orig, exp: "orig",
        t: "Original-edition copy — apply the card changes",
        d: "<ul><li>Play these original-edition components with the revised wording:<ul>" +
          "<li><b>“Threatened Home Realms”</b> (Season card): each player moves <b>1 rune token</b> out of his home realm, not 2.</li>" +
          "<li><b>“Mobilize”</b> and <b>“Conquer”</b> (Order cards): they also move <b>heroes</b>, not just units. (The sheet calls the second card “Conquest”; the Rules and Banners of War call it Conquer.)</li>" +
          "<li><b>“Ambush”</b> (Tactics card): can only be played during the <b>Quest Phase</b>.</li>" +
          "<li><b>Latari Elves' Sorceress</b> (faction sheet): its ability reads <i>“Your opponent must retreat one unit of your choice from the battle.”</i></li></ul></li>" +
          "<li>Don't use the original rulebook's <b>Epic Play</b> variant — it is not compatible with these rules.</li>" +
          "<li>The sheet's map setup, game length, victory and combat changes are already part of the steps and reference on this page.</li></ul>",
        src: "Revised Gameplay p.1" },
      { when: () => true, exp: (c) => c.has("bow") ? "bow" : "core",
        t: "Set out markers and tokens (setup step 9)",
        d: (c) => "<ul><li>Make piles within reach of everyone: the <b>battle marker</b>, <b>defeated hero markers</b>, <b>damage tokens</b>, <b>influence tokens</b> and <b>training tokens</b>.</li>" +
          "<li>Place all <b>rune tokens faceup</b> beside each other in two piles: false runes and dragon runes.</li>" +
          (c.has("bow") ? "<li><b>Banners of War:</b> its 10 rune tokens (5 dragon, 5 false), 15 training tokens and 8 defeated hero markers join the same piles. Keep the <b>desolation/cryomancy</b> tokens nearby for card effects. The <b>“3” supplemental influence tokens</b> are each worth three influence; swap them in if normal influence tokens run short.</li>" : "") +
          (c.mod("dev") ? "<li><b>Development Cards:</b> Waiqar's 8 <b>Reanimate tokens</b> and the Daqan's 3 <b>peasant tokens</b> are gained only by buying “Lands of Blight” and “Support of the People”.</li>" : "") + "</ul>",
        src: (c) => RW.cite("Rules p.7", c.has("bow") && "BoW p.2, p.8", c.mod("dev") && "BoW p.9") },
      { when: () => true, exp: "core",
        t: "Starting Tactics cards and influence (setup step 10)",
        d: "<ul><li>Each player takes the number of <b>Tactics cards</b> and <b>influence tokens</b> printed on the bottom corner of his faction sheet.</li>" +
          "<li>Hand limit: 10 Tactics cards.</li></ul>",
        src: "Rules p.7, p.20, p.31" },
      { when: () => true, exp: "core",
        t: "Draw starting Quests (setup step 11)",
        d: "<ul><li>Each player draws <b>two Quest cards</b> into his hand. Hand limit: 3 Quest cards.</li></ul>",
        src: "Rules p.7, p.26" },
      { when: () => true, exp: "core",
        t: "Draw Objective cards (setup step 12)",
        d: "<ul><li>Each player draws <b>one Objective card</b> from the deck matching his faction's alignment, looks at it, and places it <b>facedown</b> in his play area.</li>" +
          "<li>It stays secret until you discard it to receive a dragon rune. You never draw a replacement.</li></ul>",
        src: "Rules p.7, p.31" }
    ]
  },
  {
    title: "Begin the Game",
    steps: [
      { when: () => true, exp: "core",
        t: "Year 1 begins with spring",
        d: (c) => "<ul><li>The game lasts <b>seven years</b> of four seasons each: spring, summer, fall, winter.</li>" +
          "<li>The first player draws and resolves the top card of the <b>spring</b> Season deck. Then everyone chooses an Order card.</li>" +
          "<li>Nobody has a revealed Order card yet, so anything done “in play order” this season goes to the player with the most influence, then the highest starting influence.</li>" +
          "<li>Every Order card's <b>Supremacy Bonus</b> is available each spring, because no other Order cards are in play.</li>" +
          "<li>A player who controls <b>" + RW.num(RW.runesToWin(c)) + " dragon runes</b> may stake a claim during his turn with " + RW.vMark(c) + ". Otherwise the most dragon runes after the seventh winter wins.</li></ul>",
        src: (c) => RW.cite("Rules p.11–12, p.30, p.37", c.mod("rotfc") && "BoW p.11", c.orig && !c.has("bow") && "Revised Gameplay p.2") }
    ]
  }
];

/* =============================================================================
   RULES REFERENCE
   ============================================================================= */
RW.reference = [
  {
    title: "How You Win — Dragon Runes & Victory Cards",
    when: () => true,
    html: (c) => {
      const unit = c.orig && !c.has("bow");
      const vm = unit ? "unit" : "Victory card";
      const n = RW.num(RW.runesToWin(c));
      return "<h4>At the end of the seventh year</h4><ul>" +
        "<li>The game ends at the <b>end of the seventh winter</b>. Flip every rune token on the board faceup: the player who controls the <b>most dragon runes</b> wins.</li>" +
        "<li>Tied? The tied player with the most influence tokens wins; if still tied, the one with the highest starting influence.</li></ul>" +
        "<h4>Winning early — the " + vm + "</h4><ol>" +
        "<li><b>Claim:</b> at any point during your turn, if you control <b>" + n + " dragon runes</b>, reveal dragon runes until you have proven it. They stay faceup.</li>" +
        "<li>Place " + (unit ? "<b>one unused unit of your faction</b>" : "your faction's <b>Victory card facedown</b>") + " on top of the <b>current season's</b> Season deck. In summer, put it on top of the unrevealed summer Season cards.</li>" +
        "<li><b>One year later</b>, at that season's Resolve Season Card step, it is resolved <b>before</b> a Season card is drawn. If you still control enough dragon runes (revealing tokens as needed), you " + (unit ? "<b>win</b> immediately" : "read the card aloud and <b>win</b>") + ". If not, take it back and the season goes on as normal.</li></ol><ul>" +
        "<li>At most <b>one</b> " + vm + " per Season deck. If someone has already placed one this season, anyone else with enough dragon runes must wait until his turn next season.</li>" +
        "<li>Nothing can be placed on a Season deck during the <b>seventh year</b>: it could never resolve.</li>" +
        (unit ? "<li>The unit can't be taken off the deck until the next season. While you have a unit on a Season deck, you can't place another.</li>" : "") +
        (unit ? "<li>This is the Revised Gameplay sheet's version of Banners of War's Road to Victory variant, which the revised rules made standard.</li></ul>"
              : "<li>Victory cards are <b>mandatory</b> in the revised rules. In Banners of War they were the optional Road to Victory variant.</li></ul>") +
        "<h4>Dragon runes you control</h4><ul>" +
        "<li>Every dragon rune <b>token</b> in an area you control. Players acquire them by conquering areas with rune tokens, and from Reward, Objective, Season and Title cards.</li>" +
        (c.mod("explore") ? "<li><b>Dragon Throne</b> exploration token: the controller of its area has one additional dragon rune.</li>" : "") +
        (c.mod("rotfc") ? "<li><b>Rise of the Free Cities:</b> each of the three city tokens with a printed dragon rune gives its area's controller one more dragon rune. It counts only toward winning and can't be targeted by effects that target rune tokens.</li>" : "") +
        (c.has("bow") ? "<li><b>The Lost City</b>, once found, gives the controller of its area a dragon rune (it counts only toward winning, as in Rise of the Free Cities). A desolation or cryomancy token in a city's area switches off its dragon rune until removed.</li>" : "") +
        "</ul>";
    },
    src: (c) => RW.cite("Rules p.7, p.11, p.30", c.orig && "Revised Gameplay p.1–2", c.has("bow") && "BoW p.5, p.8, p.11", c.mod("explore") && "Rules p.37")
  },
  {
    title: "A Season, Step by Step",
    when: () => true,
    html: (c) => "<p>The game lasts <b>seven years</b>. Each year is four seasons — spring, summer, fall, winter — and each season has three steps:</p><ol>" +
      "<li><b>Resolve a Season card.</b> If a " + ((c.orig && !c.has("bow")) ? "unit" : "Victory card") + " is on top of this season's deck, resolve it first. Then the first player draws the top card of this season's deck and resolves its <b>primary ability</b> (the text), then its <b>secondary ability</b> (the icons at the bottom).</li>" +
      "<li><b>Choose Order cards.</b> Each player places one Order card from his hand facedown in his play area: his <b>active</b> Order card.</li>" +
      "<li><b>Resolve Order cards.</b> Everyone flips at once. The <b>lowest number</b> goes first. On a tie, the player with the most influence goes first, then the one with the highest starting influence. Each player resolves his primary ability, then his Supremacy Bonus if he may.</li></ol><ul>" +
      "<li>Secondary abilities resolve in standard play order: the lowest Order card <i>from the previous season</i> first.</li>" +
      "<li>All four Season decks share <b>one discard pile</b>; the <b>current season</b> is the top card of that pile.</li>" +
      "<li>Your <b>turn</b> is the resolution of your Order card: “during your turn” means right before, during or right after it. The Quest Phase is no one's turn.</li></ul>",
    src: (c) => RW.cite("Rules p.11–12, p.15, p.30, p.37", c.orig && !c.has("bow") && "Revised Gameplay p.2")
  },
  {
    title: "Season Cards — the Secondary Abilities",
    when: () => true,
    html: (c) => "<ul>" +
      "<li><b>Spring:</b> each player removes all his activation tokens from the board and returns all his Order cards to his hand. Then every routed figure stands up, neutral units and heroes included." +
      (c.has("bow") ? " <b>Banners of War:</b> also remove one cryomancy token from each area." : "") + "</li>" +
      "<li><b>Summer:</b> a <b>Quest Phase</b>. Each hero may heal, train or move, and after moving may duel or attempt a Quest (see Heroes).</li>" +
      "<li><b>Fall:</b> shuffle the Fate discard pile back into the Fate deck. Then each player chooses to receive <b>2 influence</b> or draw <b>1 Tactics card</b>.</li>" +
      "<li><b>Winter:</b> in each area, a player may have at most as many units as his <b>food dial's current space</b>. Excess units are destroyed (owner's choice). Allied neutral units count; heroes don't. Afterwards the limit is 8 again.</li>" +
      "<li><b>Winter</b> also lets everyone ignore <b>water (blue) borders</b> until the end of the season.</li></ul>" +
      "<p><i>Example (Rules p.11): seven Uthuk units share an area and the Uthuk food dial is on 5 — two of them are destroyed. Moving them out before winter, or more food, would have saved them.</i></p>",
    src: (c) => RW.cite("Rules p.11, p.22, p.40", c.has("bow") && "BoW p.8")
  },
  {
    title: "The Order Cards & the Supremacy Bonus",
    when: () => true,
    html: (c) => "<ul>" +
      "<li>Every player has the same hand of <b>" + (c.has("bow") ? "nine Order cards — the eight below plus Garrison" : "eight Order cards") + "</b>. A resolved card stays <b>faceup</b> in your play area until spring returns it, and you play one each season — four a year.</li>" +
      "<li><b>Supremacy Bonus:</b> after the primary ability, you also get the bonus <b>if this is the highest-numbered Order card in your play area</b>. Play low numbers early in the year. Fortify has no bonus.</li></ul>" +
      "<div class='tbl-wrap'><table class='rtable'><thead><tr><th>#</th><th>Order</th><th>Primary ability</th><th>Supremacy Bonus</th></tr></thead><tbody>" +
      (c.has("bow") ? "<tr><td>0</td><td><b>Garrison</b> <i>(BoW)</i></td><td>When defending in battle this season, gain +2 strength.</td><td>Recruit 2 triangle units of your faction; place them at any strongholds you control.</td></tr>" : "") +
      "<tr><td>1</td><td><b>Strategize</b></td><td>Move any of your units and heroes to adjacent <b>friendly or empty</b> areas. Do not activate the areas.</td><td>Draw Tactics cards as allowed by your resources: one per Tactics card image at or below each dial's arrow.</td></tr>" +
      "<tr><td>2</td><td><b>Mobilize</b></td><td>Activate an area and move any of your units and heroes to it from up to 2 areas away.</td><td>Resolve the card a second time, as long as you do not start a second battle.</td></tr>" +
      "<tr><td>3</td><td><b>Conquer</b></td><td>Activate an area and move any of your units and heroes to it from up to 2 areas away.</td><td>During battle, reduce the strength of the opponent's stronghold by 3.</td></tr>" +
      "<tr><td>4</td><td><b>Harvest</b></td><td>Reset your resource dials based on the areas you control.</td><td>Gain the bonuses of your developments. Then you may lose 1 wood to build a development at a friendly stronghold." + (c.mod("dev") ? " <b>Development Cards:</b> you may also buy one Development card." : "") + "</td></tr>" +
      "<tr><td>5</td><td><b>Recruit</b></td><td>Recruit units based on 1 of your resource types.</td><td>Recruit units based on a second resource type.</td></tr>" +
      "<tr><td>6</td><td><b>Rally Support</b></td><td>For each city you control: neutral units, Tactics cards, influence or Quest cards.</td><td>Spend up to 3 influence to draw that many Hero cards; keep 1, shuffle the rest back." + (c.mod("cmd") ? " <b>Commanders:</b> or draw that many Commander cards instead." : "") + "</td></tr>" +
      "<tr><td>7</td><td><b>Acquire Power</b></td><td>Gain influence as provided by your resources.</td><td>Claim a Title card by spending more influence than is on it; remove that influence and place yours on it.</td></tr>" +
      "<tr><td>8</td><td><b>Fortify</b></td><td>Any of, once each: build a stronghold (lose 1 ore and 1 wood); repair one (lose 1 ore); move rune tokens between 2 friendly areas.</td><td>None — it is always your highest card.</td></tr>" +
      "</tbody></table></div>" +
      "<ul><li>One Mobilize can start only <b>one battle</b>. You may attempt diplomacy and fight one battle, but you can't move units into an area if it would cause a second battle that turn. So if you already fought and the bonus's diplomacy draws the red symbol, you must retreat.</li>" +
      (c.has("bow") ? "<li>Garrison is numbered 0, so under the same rule its Supremacy Bonus works only when no other Order card is faceup in your play area — in practice, as your first Order of the year.</li>" : "") +
      (c.orig ? "<li><b>Original-edition copy:</b> your Mobilize and Conquer cards also move <b>heroes</b>.</li>" : "") + "</ul>",
    src: (c) => RW.cite("Rules p.12–14, p.33–36", c.has("bow") && "BoW p.8", c.mod("dev") && "BoW p.9", c.mod("cmd") && "BoW p.10", c.orig && "Revised Gameplay p.1")
  },
  {
    title: "Resource Dials, Harvest & Recruit",
    when: () => true,
    html: (c) => "<h4>The dials</h4><ul>" +
      "<li>Three dials track your <b>food</b>, <b>wood</b> and <b>ore</b>. They start on the red numbers.</li>" +
      "<li>Dials change <b>only</b> when a card or ability says so, so they often don't match what your areas produce.</li>" +
      "<li>Most spaces show a <b>unit</b>, a <b>Tactics card</b> or an <b>influence</b> icon. You gain them only when told to — Recruit, Strategize's bonus, Acquire Power — counting the current space <b>and every lower space</b>. Gaining them never lowers a dial.</li>" +
      "<li>Your <b>food</b> dial also caps the units in each area every winter.</li></ul>" +
      "<h4>Harvest (4)</h4><ul>" +
      "<li>Total the food, wood and ore of the areas you control, and set each dial to match. Dials can go <b>up or down</b>.</li>" +
      "<li><b>Supremacy:</b> collect resources, influence or Tactics cards from <b>all</b> your developments on the board. Then you may lower wood by 1 to place <b>one</b> development token in a friendly area with a stronghold (not if wood is at 0).</li>" +
      (c.has("bow") ? "<li><b>Guildmaster of Merchants</b> (Title): +2 resources of any one type each time you resolve Harvest; you may pick a different type each time.</li>" : "") +
      (c.mod("dev") ? "<li><b>Development Cards:</b> in the Supremacy Bonus you may also buy one of your faction's Development cards.</li>" : "") + "</ul>" +
      "<h4>Recruit (5)</h4><ul>" +
      "<li>Choose food, wood or ore. Gain the unit pictured on that dial's current space and on <b>each lower space</b>.</li>" +
      "<li>Place them in any areas containing your strongholds, split as you like. Over <b>8 units</b> in an area? Destroy units there down to 8 at once (heroes aren't units).</li>" +
      "<li>Recruiting costs <b>no resources</b>.</li>" +
      "<li><b>Supremacy:</b> recruit again with a second resource type.</li>" +
      "<li>All units of a type already in play? You may destroy one of yours of that type in any friendly area before recruiting.</li>" +
      (c.has("bow") ? "<li><b>Banners of War:</b> each new unit may be recruited in place of the base unit shown on your reinforcement sheet.</li>" : "") +
      "</ul><p><i>Example (Rules p.35): recruiting with his wood dial, the Daqan player gains two Bowmen — one from the “1” space and one from the “3” space. Spaces without a unit, and spaces above the arrow, give nothing.</i></p>",
    src: (c) => RW.cite("Rules p.11, p.14, p.31, p.33–35", c.has("bow") && "BoW p.6, p.8", c.mod("dev") && "BoW p.9")
  },
  {
    title: "Fortify, Strongholds & Developments",
    when: () => true,
    html: (c) => "<h4>Fortify (8) — any or all, once each, in any order</h4><ul>" +
      "<li><b>Build a stronghold:</b> lower wood and ore by 1 each. Place one of your stronghold tokens, undamaged (“5”) side up, in an area you control with no stronghold or city. Not if wood or ore is at 0." + (c.has("bow") ? " Never on map tile 12." : "") + "</li>" +
      "<li><b>Repair a stronghold:</b> lower ore by 1 to flip one of your damaged strongholds to its undamaged side. Not if ore is at 0.</li>" +
      "<li><b>Move rune tokens:</b> choose two areas you control and pick up their rune tokens. Randomize them, look, and place each facedown in one of the two areas, one per area. With one token and one empty area, this moves the token — even into your home realm. Revealed tokens in those two areas go facedown; no others do.</li></ul>" +
      "<h4>Strongholds</h4><ul>" +
      "<li>A stronghold lets you <b>recruit</b> there, holds <b>one development</b>, and adds its <b>printed strength</b> (5 undamaged) when you defend there. Conquer's bonus cuts it by 3.</li>" +
      "<li>One of your plastic units (even routed) or one of your strongholds makes an area yours.</li>" +
      "<li>Out of tokens? You may destroy one of your strongholds or developments to build it elsewhere. A development left without a stronghold is destroyed.</li>" +
      (c.mod("dev") ? "<li><b>Capital</b> (Development Cards): strength 7 undamaged and room for two developments; see Development Cards.</li>" : "") + "</ul>" +
      "<h4>Developments</h4><ul>" +
      "<li>Built with Harvest's bonus. Limit <b>one per stronghold</b>; destroyed if the stronghold is destroyed or taken.</li>" +
      "<li><b>Resources:</b> +1 to one dial at each Harvest bonus; it must be a resource the area provides.</li>" +
      "<li><b>Diplomat:</b> +2 influence at each Harvest bonus.</li>" +
      "<li><b>Training Ground:</b> +1 Tactics card at each Harvest bonus.</li>" +
      "<li><b>Defensive bonus</b> (each faction has its own): the defender uses it in a battle in this area, just before strength is counted (battle step 6a):<ul>" +
      RW.factions.map(f => "<li" + (c.fac(f.id) ? "" : " class='dim'") + "><b>" + f.defName + "</b> (" + f.short + "): " + f.defText + "</li>").join("") + "</ul></li></ul>",
    src: (c) => RW.cite("Rules p.15, p.21, p.31, p.33, p.35–36", c.has("bow") && "BoW p.5", c.mod("dev") && "BoW p.9")
  },
  {
    title: "Rally Support, Cities & Title Cards",
    when: () => true,
    html: (c) => "<h4>Rally Support (6)</h4><ul>" +
      "<li>For <b>each city you control</b>, choose one benefit printed on that city:<ul>" +
      "<li><b>Neutral units</b> of the class and number shown, placed in the area and allied to you (not if none of that class are available);</li>" +
      "<li><b>Tactics cards</b>, as many as printed;</li>" +
      "<li><b>Influence</b>, as much as printed;</li>" +
      "<li><b>Quest cards</b>, as many as printed — then discard down to three.</li></ul></li>" +
      "<li><b>Supremacy:</b> spend up to 3 influence to draw that many Hero cards. Keep one, shuffle the rest back, and place its figure at one of your strongholds. A fourth hero means one of yours deserts.</li>" +
      (c.mod("cmd") ? "<li><b>Commanders:</b> instead of Hero cards, you may pay up to 3 influence to draw that many Commander cards (see Commanders).</li>" : "") +
      (c.mod("rotfc") ? "<li><b>Rise of the Free Cities:</b> the alternate cities give more Tactics cards and influence; three also give a dragon rune.</li>" : "") +
      (c.has("bow") ? "<li><b>Desolation or cryomancy</b> in a city's area: the city provides none of its printed icons for Rally Support.</li>" : "") + "</ul>" +
      "<h4>Acquire Power (7) and Title cards</h4><ul>" +
      "<li>Gain one influence for each influence icon at or below each dial's arrow.</li>" +
      "<li><b>Supremacy:</b> spend <b>more</b> influence than is on a Title card to take it. Remove its old influence and put the influence you spent on it. The more you spend, the harder it is to take away.</li>" +
      "<li>Influence on Title cards is <b>spent</b>: it can't be bid or used for anything else.</li>" +
      "<li>Title cards are never shuffled and have one owner at a time; whoever takes one moves it to his play area. There are three" + (c.has("bow") ? ", plus Guildmaster of Merchants" : "") + ".</li>" +
      "<li>The holder of <b>Primarch of the Wizards' Council</b> decides all influence-bid ties.</li>" +
      (c.has("bow") ? "<li><b>Guildmaster of Merchants:</b> +2 resources of any one type each time you resolve Harvest, and you may ignore resource loss caused by a Season card's primary ability.</li>" : "") + "</ul>",
    src: (c) => RW.cite("Rules p.25, p.31, p.36", c.has("bow") && "BoW p.8", c.mod("cmd") && "BoW p.10", c.mod("rotfc") && "BoW p.11")
  },
  {
    title: "Key Terms — Areas, Control & Figures",
    when: () => true,
    html: () => "<h4>Areas</h4><ul>" +
      "<li><b>Controlled area:</b> holds at least one plastic unit of your color (routed ones count) and/or one of your strongholds.</li>" +
      "<li><b>Home realm:</b> your faction's three starting areas. You always control them unless <b>enemy units or an enemy stronghold</b> are there. Home realm areas are never empty.</li>" +
      "<li><b>Friendly area:</b> an area you control, including your home realm while no enemy controls it. <b>Enemy area:</b> controlled by another player.</li>" +
      "<li><b>Empty area:</b> a non-home-realm area with zero units and zero strongholds. It may hold a city.</li>" +
      "<li><b>Neutral area:</b> holds neutral units and isn't controlled by a player. <b>Uncontrolled area:</b> not controlled by any player — every neutral and empty area.</li>" +
      "<li><b>Contested area:</b> where a battle or duel is under way. The defender keeps control of it during a battle.</li>" +
      "<li><b>Activated area:</b> holds your activation token. Your units can't leave it except by retreating.</li></ul>" +
      "<h4>Figures and players</h4><ul>" +
      "<li><b>Figures</b> means units and heroes. <b>Units</b> never includes heroes unless a card says so.</li>" +
      "<li><b>Enemy units</b> belong to another player, including neutral units allied to him. Neutral units are always enemy units unless allied with you.</li>" +
      "<li><b>Routed:</b> tipped over. A routed figure can't move, start a duel, attempt a Quest or attack in battle. <b>Standing:</b> not routed. Every figure stands up in spring.</li>" +
      "<li><b>Fast:</b> moves up to 3 areas instead of 2 with Mobilize or Conquer, and no other way. <b>Flying:</b> ignores mountain and water borders.</li>" +
      "<li><b>Current player:</b> the player resolving his Order card. There is none during the Quest Phase.</li></ul>",
    src: "Rules p.15, p.17, p.19"
  },
  {
    title: "Movement & Activation",
    when: () => true,
    html: (c) => "<h4>Strategize (1)</h4><ul>" +
      "<li>Move any of your units and heroes into <b>adjacent</b> areas that are friendly or empty (no unallied neutral or enemy units). Each figure must end in or next to the area it started in.</li>" +
      "<li>No areas are activated, so these figures may move again this year — unless they moved into an area that was already activated. Units that start in an activated area can't leave it, but may move into one.</li></ul>" +
      "<h4>Mobilize (2) and Conquer (3)</h4><ul>" +
      "<li>First place an <b>activation token</b> in the area you will move into. Then move any of your units and heroes into it from <b>up to 2 areas away</b> (fast units and heroes: 3), from any number of areas.</li>" +
      "<li>Units may only pass <b>through</b> friendly or empty areas (activated ones are fine). Heroes may pass through enemy areas.</li>" +
      "<li>Enemy units in the area: you must <b>battle</b>. Only unallied neutral units: <b>battle or diplomacy</b>.</li></ul>" +
      "<h4>Activation tokens</h4><ul>" +
      "<li>You can never move units <b>out</b> of an area holding your activation token, except by retreating. You may recruit or move units <b>into</b> it.</li>" +
      "<li>You can't activate an area that already holds your activation token. They are all removed in spring.</li>" +
      "<li>Retreating, questing and Strategize place no activation token. Heroes ignore activation tokens.</li></ul>" +
      "<h4>Heroes</h4><ul>" +
      "<li>Heroes move with Strategize, Mobilize or Conquer, and up to 2 areas in the Quest Phase. They pass through enemy and neutral areas, start no battles (they may duel), and may leave activated areas. Routed heroes can't move.</li>" +
      (c.mod("cmd") ? "<li><b>Commanders</b> move like units with Strategize, Mobilize and Conquer; they can't leave activated areas or move while routed, even in the Quest Phase.</li>" : "") + "</ul>" +
      "<h4>Borders and limits</h4><ul>" +
      "<li><b>Mountain (red)</b> and <b>water (blue)</b> borders are impassable, except: <b>flying</b> figures ignore them (but flying units still can't move over enemy or neutral areas); in <b>winter</b> water borders don't count; and cards such as “Mountain Pass”. Every other border is open, whatever the art shows.</li>" +
      (c.has("bow") ? "<li><b>Cryomancy</b> token: units ignore the water borders of that area as though it were winter.</li>" : "") +
      "<li>Holes in the board can never be crossed, even flying.</li>" +
      "<li><b>8 units</b> per area, allied neutrals included. Go over and you destroy down to 8 — unless you are starting a battle in an enemy or neutral area. If you win, the excess retreats to a single area. Bringing more than 8 into a neutral area rules out diplomacy.</li>" +
      (c.mod("explore") ? "<li><b>Exploration tokens:</b> a Magic Portal links to every faceup portal for 1 influence; a Dungeon stops a hero's Quest Phase move" + (c.has("bow") ? "; a Flooded Area acts as if all six borders were water" : "") + ".</li>" : "") + "</ul>",
    src: (c) => RW.cite("Rules p.15–18", c.has("bow") && "BoW p.8", c.mod("cmd") && "BoW p.10", c.mod("explore") && "Rules p.37", c.mod("explore") && c.has("bow") && "BoW p.11")
  },
  {
    title: "Neutral Units & Diplomacy",
    when: () => true,
    html: () => "<h4>Diplomacy — after moving into an area holding only unallied neutral units</h4><ol>" +
      "<li><b>Spend</b> 1 to 6 influence. With no influence you can't attempt diplomacy.</li>" +
      "<li><b>Draw</b> that many Fate cards — always the full number.</li>" +
      "<li><b>Choose one</b> and resolve the <b>destiny symbol</b> at its top center:<ul>" +
      "<li><b>Gold symbol:</b> all neutral units there <b>ally</b> with you and stay alongside your units.</li>" +
      "<li><b>Silver symbol:</b> all the neutral units retreat to one adjacent area and are routed, even if already routed. The player to your left picks among legal areas; with none, they are destroyed.</li>" +
      "<li><b>Red symbol:</b> you must start a battle there, or retreat all your units from the area into one adjacent area.</li></ul></li></ol>" +
      "<ul><li>Battle or diplomacy is against <b>every</b> neutral unit in the area at once.</li>" +
      "<li>The Fate discard pile is open to everyone: check which symbols are gone before you try.</li></ul>" +
      "<h4>Allied units</h4><ul>" +
      "<li>Neutral units sharing an area with your units are <b>allied</b>: they move and fight as yours, and count toward the 8-unit limit and the winter food limit.</li>" +
      "<li>Allied units in an area you don't control (except during a battle) become ordinary neutral units again.</li>" +
      "<li>If your last faction unit dies in a battle, your allies stay allied until it ends and may retreat with you.</li>" +
      "<li>Allies may move without your units if they end in a friendly area.</li>" +
      "<li>Neutral units placed or moved into a player's area by a Tactics card ally with him; moved into an empty or neutral area, they are no longer allied.</li>" +
      "<li>Decisions for allied units are made by their ally. For unallied ones, the player to the current player's left decides.</li></ul>" +
      "<h4>Fighting unallied neutrals</h4><ul>" +
      "<li>The player to the attacker's <b>left</b> controls them for the battle: he places them in initiative rows beside his faction sheet and makes all their decisions, but can't play Tactics cards.</li></ul>",
    src: "Rules p.15, p.18–19, p.25"
  },
  {
    title: "Battle — Step by Step",
    when: () => true,
    html: (c) => "<ol>" +
      "<li><b>Place the battle marker:</b> the current player puts it in the contested area.</li>" +
      "<li><b>Place units next to faction sheets</b> in the rows matching their initiative. Heroes and routed units stay in the area. Routed units can't fight and are destroyed if forced to retreat.</li>" +
      "<li><b>Declare supporting heroes</b>, attacker first (see Heroes).</li>" +
      "<li><b>Start-of-battle abilities:</b> the attacker uses any “start of battle” or “during your turn” Tactics cards and abilities now, then the defender" + (c.mod("cmd") ? ". Commander card abilities used “at the start of battle” go here too" : "") + ".</li>" +
      "<li><b>Rounds of combat:</b> initiative 1, then 2, 3, 4 and 5 (see Rounds of Combat).</li>" +
      "<li><b>Tally strength:</b><ol type='a'>" +
      "<li><i>Fortifications:</i> the defender may use a defensive development in the area" + (c.mod("dev") ? ", or a Development card he has" : "") + ".</li>" +
      "<li><i>Count units:</i> each side counts its <b>standing units, plus routed hexagon units</b>.</li>" +
      "<li><i>Stronghold:</i> the defender adds his stronghold's printed strength" + (c.mod("dev") ? " (a capital: 7 undamaged)" : "") + ".</li></ol></li>" +
      "<li><b>Resolution:</b> the higher strength wins; <b>ties go to the defender</b>.<ol type='a'>" +
      "<li><i>Damage or conquer the stronghold:</i> if the attacker won, he removes the stronghold and may replace it with one of his own, damaged side up (if all of his are in play, he may destroy one of them to do so)" + (c.mod("dev") ? ". An enemy <b>capital</b> may be replaced with one of his strongholds, never with his own capital" : "") + ". If the defender won but standing enemy units are present, the defender flips his stronghold to its damaged side.</li>" +
      "<li><i>Heal:</i> both sides remove all damage tokens from their units.</li>" +
      "<li><i>Retreat:</i> the loser retreats all his participating units, routed. His units that stayed in the area without fighting are destroyed. Units routed in this battle may retreat.</li>" +
      "<li><i>Replace units:</i> the winner returns his surviving units to the area (routed ones stay routed) and removes the battle marker.</li></ol></li></ol>" +
      "<h4>Modifiers to remember</h4><ul>" +
      "<li>Conquer's Supremacy Bonus: the defender's stronghold counts 3 less.</li>" +
      (c.has("bow") ? "<li>Garrison (Order 0): +2 strength when defending this season.</li>" : "") +
      (c.mod("explore") && c.has("bow") ? "<li>Defensible Area exploration token: +1 strength to the defender.</li>" : "") +
      "<li>A battle still happens against a stronghold with no units in it; only Tally Strength and Resolution matter then (FAQ 1.2).</li></ul>" +
      (c.has("bow") ? "<p class='inline-note'>Banners of War prints its own “Revised Steps of Battle” for the original rules. The Revised rulebook's order is used here, with the expansion's additions — " + (c.mod("cmd") ? "Commander cards, " : "") + "Tactical Fate cards" + (c.mod("dev") ? ", Development cards and capitals" : "") + " — in their places.</p>" : ""),
    src: (c) => RW.cite("Rules p.21, p.33, p.40", "FAQ 1.2 p.1", c.has("bow") && "BoW p.8, p.12", c.mod("dev") && "BoW p.9", c.mod("cmd") && "BoW p.10", c.mod("explore") && c.has("bow") && "BoW p.11")
  },
  {
    title: "Rounds of Combat, Routs & Damage",
    when: () => true,
    html: (c) => "<h4>Each round (one initiative number)</h4><ol>" +
      (c.has("bow") ? "<li><b>Tactical Fate cards</b> (Banners of War): before drawing for a unit type, the attacker and then the defender announce any Tactical Fate cards they will play for it.</li>" : "") +
      "<li><b>Attacker draws:</b> he chooses one of his unit types with this initiative that hasn't drawn yet. He draws one Fate card per unit of that type" + (c.has("bow") ? " (one fewer per Tactical Fate card played)" : "") + " and reads the section matching its <b>base shape</b>.</li>" +
      "<li><b>Defender draws</b> the same way.</li>" +
      "<li><b>Special abilities:</b> both reveal special-ability icons. The attacker, then the defender, resolves his unit's ability once per icon.</li>" +
      "<li><b>Routs:</b> both reveal rout icons. Starting with the attacker, each deals that many routs; for each, the opponent tips over one of his units.</li>" +
      "<li><b>Damage:</b> both reveal damage icons. Starting with the attacker, each deals that much damage; the opponent assigns it.</li></ol>" +
      "<ul><li>Discard the Fate cards and repeat for any other unit types with this initiative that are still standing and haven't drawn. Then move to the next initiative.</li>" +
      "<li><b>Who assigns first:</b> in the rout and damage steps the <b>defender</b> assigns his routs and damage before the attacker chooses where his go (Revised Gameplay).</li>" +
      "<li><b>Concurrent attack rule:</b> a unit type that has already drawn resolves all its cards, even if those units are destroyed or routed before they resolve. A type that hasn't drawn yet may be wiped out first — so choose which type attacks first.</li></ul>" +
      "<h4>Routs and damage</h4><ul>" +
      "<li><b>Rout:</b> tip over an <b>undamaged standing</b> unit, whatever its health. Only if all your standing units are damaged do you rout a damaged one.</li>" +
      "<li><b>Damage:</b> one token at a time, and it must go on a <b>previously damaged</b> unit if you have one (standing or routed). Otherwise any standing unit; if none stand, a routed unit.</li>" +
      "<li>A unit with damage equal to its <b>health</b> (the heart on the sheet) is destroyed and returns to your unused units. An effect that destroys a unit during combat must take a standing unit if able.</li>" +
      "<li>All damage tokens come off at the end of the battle.</li></ul>" +
      "<h4>Base shapes and Fate cards</h4><ul>" +
      "<li>Each Fate card has a destiny symbol, four sections (triangle, rectangle, hexagon, circle) and a unique number from 1 to 30.</li>" +
      "<li>A section shows a <b>special ability</b> icon, a <b>rout</b> flag with a number, a <b>damage</b> icon with a number, or nothing (a <b>miss</b>).</li>" +
      "<li><b>Triangle</b> units are the most common: they miss 40% of the time and deal at most 1 damage.</li>" +
      "<li><b>Circle</b> units trigger specials twice as often; heroes use the circle section in duels.</li>" +
      "<li><b>Rectangle</b> units often have more health, hit more often and usually deal up to 2.</li>" +
      "<li><b>Hexagon</b> units are large and very powerful, and count their strength even when routed.</li></ul>" +
      (c.has("bow") ? "<h4>Tactical Fate cards</h4><ul><li>A Tactical Fate card played this way resolves its Fate symbols like a Fate card, then goes to the Tactics discard pile; its text is ignored. It can't be used in the season it was drawn.</li></ul>" : "") +
      "<h4>Rulings (FAQ 1.2)</h4><ul>" +
      "<li>A unit forced to retreat mid-battle (such as by the Sorceress) leaves the battle at once, following the normal retreat rules: it draws no Fate cards and doesn't count for strength.</li>" +
      "<li>A Daqan Siege Tower's +2 strength still counts if it is later destroyed or routed. (The faction sheet calls it Siege Tower; the component list calls the figures Siege Engines.)</li>" +
      "<li>Same initiative, both specials: the attacker's resolves first. A Berserker routed by an attacking Pegasus Rider can't use its ability, which needs it standing.</li>" +
      "<li>Reanimates created by a Necromancer stay after the battle. A Necromancer can't destroy your own Reanimates elsewhere to make them.</li>" +
      "<li>“Destroy 2▲ or 1■” (▲ = triangle units, ■ = rectangle units) when you have 1▲ and 1■: you must destroy the 1■, the only option you can fully meet. With only 1▲ there, destroy it — fulfil as much as possible.</li></ul>",
    src: (c) => RW.cite("Rules p.19, p.21–22", "Revised Gameplay p.1", "FAQ 1.2 p.1", c.has("bow") && "BoW p.7, p.12")
  },
  {
    title: "Retreats",
    when: () => true,
    html: () => "<ul>" +
      "<li>All retreating figures move together to <b>one</b> adjacent area, and a retreating figure is <b>always routed</b>.</li>" +
      "<li><b>Player units:</b> an adjacent friendly area; if none, an adjacent empty area; if none, they are destroyed.</li>" +
      "<li><b>Unallied neutral units:</b> the player to the current player's left picks an adjacent uncontrolled area; if none, they are destroyed.</li>" +
      "<li><b>Heroes:</b> any adjacent area — but a hero who supported the battle goes where his owner's units went, if possible.</li>" +
      "<li>Retreats obey movement restrictions: no crossing red or blue borders — except that water (blue) borders don't count in winter, and flying units ignore both.</li>" +
      "<li>More than 8 units in the area after retreating (routed ones count)? Destroy down to 8.</li>" +
      "<li><b>Tactical Retreat</b> with more than 8 attacking units: the attacker may retreat his extra units as if he had won the battle (FAQ 1.2).</li></ul>",
    src: "Rules p.18, p.22 · FAQ 1.2 p.1"
  },
  {
    title: "Heroes — Gaining, Supporting & the Quest Phase",
    when: () => true,
    html: (c) => "<h4>Heroes</h4><ul>" +
      "<li>Heroes are <b>not units</b>. A Hero card shows alignment (white good, green neutral, black evil), ability, strength, agility and wisdom, health, and a circle base for duels.</li>" +
      "<li>A new hero's card goes faceup in your play area and its figure at one of your strongholds. You may control at most <b>three heroes</b>" + (c.mod("cmd") ? " (commanders don't count)" : "") + ". Gain a fourth and you choose one to desert, even one that normally can't.</li>" +
      "<li>Heroes may look at rune tokens in the area they stand in, including enemy areas.</li></ul>" +
      "<h4>Supporting a battle (battle step 3)</h4><ul>" +
      "<li>Attacker first, each player may place any of his <b>standing</b> heroes in the contested area next to a <b>different</b> friendly unit type.</li>" +
      "<li>When that type draws Fate cards, draw <b>one extra</b>, look, and discard one without effect.</li>" +
      "<li>Lose the battle and your supporting heroes are <b>routed</b> and retreat with your units — or, with no units retreating, all to one area. Heroes who didn't support stay put.</li></ul>" +
      "<h4>The Quest Phase (summer)</h4><ul>" +
      "<li>Starting with the lowest Order card from the previous season, each player does <b>one</b> action with <b>each</b> of his heroes:<ul>" +
      "<li><b>Move</b> up to 2 areas, through enemy and neutral areas, without activating anything; then he may <b>duel</b> or <b>attempt a Quest</b>. Not if routed.</li>" +
      "<li><b>Heal:</b> remove all his damage. Only in a friendly area.</li>" +
      "<li><b>Train:</b> +1 to two attributes or +2 to one, marked with training tokens. Each attribute may have only one training token (+2 at most). A Quest that says “train” gives +1.</li></ul></li>" +
      "<li>Heroes quest, duel and resolve exploration tokens only in the Quest Phase, never through Order cards.</li>" +
      "<li>The Quest Phase is not part of anyone's turn.</li>" +
      (c.mod("cmd") ? "<li><b>Commanders</b> can't attempt Quests but may move, duel, train or heal, and can receive and use Reward cards.</li>" : "") +
      (c.mod("explore") ? "<li><b>Exploration tokens:</b> after a moving hero stops, flip any exploration token in his area and resolve it before he duels or quests.</li>" : "") + "</ul>",
    src: (c) => RW.cite("Rules p.16, p.25–26, p.30, p.40", c.mod("cmd") && "BoW p.10", c.mod("explore") && "Rules p.37")
  },
  {
    title: "Quests, Rewards & Duels",
    when: () => true,
    html: (c) => "<h4>Quests</h4><ul>" +
      "<li>Hand limit <b>3 Quest cards</b>. A hero who used the Move action and stands in an area named on one of your Quest cards may attempt it: reveal the card and follow it. One Quest per hero per Quest Phase; routed heroes can't.</li>" +
      "<li><b>Attribute test:</b> draw Fate cards equal to the hero's attribute, choose one, and use its destiny symbol on the Quest card.</li>" +
      "<li><b>“Receive reward”:</b> the hero takes the top Reward card facedown under his Hero card. Discard the completed Quest and draw a new one. A failed Quest stays in your hand unless it says to discard it.</li>" +
      "<li><b>Duel Quests:</b> the player to your left controls the neutral unit. It uses its special ability when it draws one in its base-shape section. Defeat it to complete the Quest; the unit goes back to the pile either way.</li></ul>" +
      "<h4>Reward cards</h4><ul>" +
      "<li>Kept facedown and secret until used; once flipped they stay faceup.</li>" +
      "<li>Trade them freely between your heroes in the same area during your turn or a Quest Phase action — even while passing through.</li>" +
      "<li>In a duel a hero may use any number of Reward cards, but at most one <b>Weapon</b> and one <b>Armor</b>; the same one can be used repeatedly.</li></ul>" +
      "<h4>Duels (Quest Phase only)</h4><ol>" +
      "<li><b>Declare the defender:</b> one enemy hero in your hero's area.</li>" +
      "<li><b>Start-of-duel abilities:</b> attacker, then defender.</li>" +
      "<li><b>Four rounds:</b> each draws one Fate card (attacker first) and resolves its <b>circle</b> section:<ul>" +
      "<li>Special ability: deal 1 damage, or use one Reward card's ability.</li>" +
      "<li>Rout flag: prevent that much damage this round. It doesn't rout anyone.</li>" +
      "<li>Damage: the other hero takes that much.</li>" +
      "<li>Blank: nothing. All duel damage is simultaneous.</li></ul></li>" +
      "<li><b>End</b> after four rounds, or when a hero is defeated (finish that round). Damage stays on surviving heroes; nobody retreats.</li></ol><ul>" +
      "<li>A hero who starts a duel can't attempt a Quest that phase. Routed heroes can't start duels, but can be dragged into one and then fight as if standing.</li>" +
      (c.has("bow") ? "<li>Tactical Fate cards may also replace Fate draws in a duel.</li>" : "") + "</ul>" +
      "<h4>Defeat and desertion</h4><ul>" +
      "<li>Damage ≥ health: the hero is <b>defeated</b>; his figure and card go back in the box.</li>" +
      "<li>Defeated in a duel: the winner gives all the loser's Reward cards to his heroes in that area.</li>" +
      "<li>Defeated any other way, or both at once: his Reward cards go beside the board under a numbered <b>defeated hero marker</b>, and the matching marker is placed in that area. Any hero there during his controller's turn may take them.</li>" +
      "<li><b>Desertion</b> (usually a hero whose alignment doesn't match, when a Season card says so): remove the figure, shuffle his card back into the Hero deck, and discard his Reward cards faceup by the Reward deck.</li></ul>",
    src: (c) => RW.cite("Rules p.25–28", c.has("bow") && "BoW p.7")
  },
  {
    title: "Rune Tokens — Receiving, Looking, Revealing",
    when: () => true,
    html: (c) => "<h4>“Receive one dragon rune”</h4><ol>" +
      "<li>You may discard up to <b>two false rune</b> tokens from areas you control.</li>" +
      "<li>Take <b>one dragon rune and one false rune</b> token and randomize them.</li>" +
      "<li>Look, and place each <b>facedown</b> in a friendly or uncontrolled area with no rune token. A token with no legal area goes faceup back to its pile.</li></ol><ul>" +
      "<li>Cards that <b>place</b> or <b>move</b> rune tokens don't add false runes unless they say so.</li>" +
      "<li>A rune token can never go in an area that already holds one.</li></ul>" +
      "<h4>Looking</h4><ul><li>You may look at rune tokens in areas you control or where you have a hero, at any time. Never show them — but you may tell the truth, or lie, about them.</li></ul>" +
      "<h4>Revealing</h4><ul>" +
      "<li>Told to reveal a rune token: flip one in an area you control. If it must be a dragon rune, you can't reveal a false one.</li>" +
      "<li>Revealed tokens stay faceup until a Fortify moves them — and then only the tokens in its two areas go facedown.</li>" +
      (c.has("bow") ? "<li><b>Banners of War:</b> to trigger a card effect by revealing, you must reveal tokens that aren't already faceup. With all your tokens revealed, you can't trigger it.</li>" : "") +
      "<li>Everyone sees rune tokens only when one is revealed, and at the end of the game.</li></ul>" +
      "<h4>Rulings (FAQ 1.2)</h4><ul>" +
      "<li><b>Power for the Pious:</b> in effect, every player except the lowest bidder gets one dragon rune token, and the lowest bidder chooses where each is placed.</li>" +
      "<li><b>Threatened Home Realms:</b> resolved in standard play order. A rune token with no legal area to move to stays in its home realm area.</li></ul>",
    src: (c) => RW.cite("Rules p.30, p.32, p.36", c.has("bow") && "BoW p.8", "FAQ 1.2 p.1")
  },
  {
    title: "Influence Bids, Objectives & Tactics Cards",
    when: () => true,
    html: (c) => "<h4>Influence bids (called by Season cards)</h4><ol>" +
      "<li><b>Declare</b> out loud how many influence tokens you have. You may also discuss the bid and promise — or lie about — how much you are going to bid.</li>" +
      "<li><b>Hide and select:</b> secretly put your bid in a closed fist.</li>" +
      "<li><b>Reveal</b> together; the Season card says who wins.</li>" +
      "<li><b>Discard</b> everything bid — winners and losers alike.</li></ol><ul>" +
      "<li><b>Ties</b> (even at zero): the holder of Primarch of the Wizards' Council picks the winner. Otherwise the tied player with the most unspent influence picks, then the highest starting influence.</li>" +
      "<li>“Wizards' Council” has no effect of its own; other cards refer to it.</li></ul>" +
      "<h4>Objective cards</h4><ul><li>One per player, kept secret. If you fulfil it at any point during your turn, you may discard it to receive one dragon rune (with its false rune). No replacement is drawn.</li></ul>" +
      "<h4>Tactics cards</h4><ul>" +
      "<li>You start with your faction sheet's number and gain more from Strategize, Rally Support and Season cards.</li>" +
      "<li>Play each at the moment it states. “During your turn” is right before, during or right after resolving your Order card.</li>" +
      "<li>You can't play a Tactics card in the <b>same season you drew it</b>.</li>" +
      "<li>Battle and duel cards need your units or hero taking part.</li>" +
      "<li>Hand limit <b>10</b>: discard down at once.</li>" +
      (c.has("bow") ? "<li><b>Tactical Fate</b> cards (Banners of War) can be played for their text, or as Fate cards in a battle or duel.</li>" : "") +
      (c.has("bow") && !c.mod("cmd") ? "<li><b>Lieutenant General</b> is used only with Commanders of the Battlefield: if drawn, discard it and draw a new card.</li>" : "") +
      (c.orig ? "<li><b>Original-edition copy:</b> “Ambush” can only be played during the Quest Phase.</li>" : "") + "</ul>",
    src: (c) => RW.cite("Rules p.15, p.31", c.has("bow") && "BoW p.7, p.10", c.orig && "Revised Gameplay p.1")
  },
  {
    title: "Limits, Elimination & Play Order",
    when: () => true,
    html: (c) => "<h4>Play order (whenever it matters)</h4><ol>" +
      "<li>The lowest current Order card goes first.</li>" +
      "<li>On a tie, or with no revealed Order cards: the most influence tokens.</li>" +
      "<li>Still tied: the highest starting influence.</li></ol>" +
      "<h4>Limits</h4><ul>" +
      "<li>At any time: <b>1</b> Objective card, <b>3</b> Hero cards" + (c.mod("cmd") ? " (commanders don't count)" : "") + ", <b>3</b> Quest cards, <b>10</b> Tactics cards; <b>8</b> units per area.</li>" +
      "<li>Run out of activation tokens, damage tokens, defeated hero markers, influence or training tokens? Use coins or beads. Everything else is limited to what's in the box.</li>" +
      "<li>A deck that runs out is reshuffled from its discard pile.</li>" +
      "<li>You may destroy your own pieces only to recruit a unit type that is all in play, or to build a stronghold or development when none are left — plus when unit limits force it.</li></ul>" +
      "<h4>Player elimination</h4><ul>" +
      "<li>Control <b>zero areas</b> and you are out: your heroes leave the board, and your Tactics, Quest, Reward and Hero cards are shuffled into their decks.</li>" +
      "<li>Your Title cards return to the common area with their influence still on them, until someone takes them with Acquire Power.</li></ul>" +
      "<h4>Frequently overlooked</h4><ul>" +
      "<li>Dials change only when told to.</li>" +
      "<li>After a Quest reward, discard the Quest and draw a new one.</li>" +
      "<li>Heroes quest, duel and explore only in the summer Quest Phase.</li>" +
      "<li>Lower Order cards resolve first.</li></ul>",
    src: (c) => RW.cite("Rules p.31, p.37, p.40", c.mod("cmd") && "BoW p.10")
  },
  {
    title: "Exploration Tokens (variant)",
    when: (c) => c.mod("explore"),
    html: (c) => "<ul>" +
      "<li>After a hero ends his move in a Quest Phase Move action, flip any exploration token in his area and resolve it <b>before</b> he duels or quests. Not when a hero retreats into the area.</li>" +
      "<li><b>Events</b> (yellow arrow) are discarded after use. <b>Locations</b> stay, with ongoing effects. <b>Destructible locations</b> stay too, but a player controlling the area with <b>at least six units</b> during his turn may discard them.</li></ul>" +
      "<div class='tbl-wrap'><table class='rtable'><thead><tr><th>Token</th><th>Type</th><th>Effect</th></tr></thead><tbody>" +
      "<tr><td><b>Dragon Throne</b></td><td>Destructible location</td><td>Stays faceup. The area's controller has one additional dragon rune; a rune token may also be placed here.</td></tr>" +
      "<tr><td><b>Village</b></td><td>Destructible location</td><td>Stays faceup. The area produces +1 of the resource shown.</td></tr>" +
      "<tr><td><b>Magic Portal</b></td><td>Destructible location</td><td>Stays faceup. Anyone moving units or heroes may spend 1 influence to treat this area as adjacent to every other faceup Magic Portal.</td></tr>" +
      "<tr><td><b>Dungeon</b></td><td>Location</td><td>A hero entering it in the Quest Phase moves no further that phase (he may still duel or quest).</td></tr>" +
      "<tr><td><b>Temple</b></td><td>Location</td><td>A hero ending his Quest Phase action here: his controller gains 2 influence.</td></tr>" +
      "<tr><td><b>Hall of Kellos</b></td><td>Location</td><td>A hero ending his Quest Phase action here: his controller draws 1 Tactics card.</td></tr>" +
      "<tr><td><b>Traveling Merchant</b></td><td>Event</td><td>Pay 3 influence for this hero to receive 1 Reward card. Discard the token, paid or not.</td></tr>" +
      "<tr><td><b>Raiding Party</b></td><td>Event</td><td>The hero takes 1 damage. If neutral or enemy units are here, he also discards 1 Reward card or takes 1 more damage.</td></tr>" +
      "<tr><td><b>Scroll of Sight</b></td><td>Event</td><td>Look at all facedown rune and exploration tokens in one area.</td></tr>" +
      "<tr><td><b>Training</b></td><td>Event</td><td>The hero may raise one attribute by 1 (still at most one training token per attribute).</td></tr>" +
      (c.has("bow") ? "<tr><td><b>Flooded Area</b> <i>(BoW)</i></td><td>Location</td><td>Stays faceup for the rest of the game. When revealed, the player to the left moves the hero up to two areas (units unaffected). Figures without Flying can't enter or leave except in winter or with a cryomancy token there — as if all six borders were water.</td></tr>" +
        "<tr><td><b>Defensible Area</b> <i>(BoW)</i></td><td>Destructible location</td><td>Stays faceup. The defender gains +1 strength when the winner of a battle here is determined.</td></tr>" : "") +
      "</tbody></table></div>",
    src: (c) => RW.cite("Rules p.37", c.has("bow") && "BoW p.11")
  },
  {
    title: "Banners of War — the Expansion's Standing Rules",
    when: (c) => c.has("bow"),
    html: (c) => "<p>These rules always apply with Banners of War. Its variants are optional (see the configurator).</p>" +
      "<h4>New units</h4><ul>" +
      "<li>Each faction gains two unit types, described on its <b>reinforcement sheet</b>, which sits to the right of the faction sheet with the initiative numbers lined up:<ul>" +
      RW.factions.map(f => "<li" + (c.fac(f.id) ? "" : " class='dim'") + "><b>" + f.short + ":</b> " + f.bowUnits + ".</li>").join("") + "</ul></li>" +
      "<li>Each is recruited <b>in place of</b> the base unit pictured on the sheet. The sheet also shows its base shape, health, special ability and initiative.</li></ul>" +
      "<h4>Tactical Fate cards</h4><ul>" +
      "<li>Tactics cards with Fate symbols at the bottom. Play one for its text as usual — <b>or</b> in a battle or duel instead of drawing a Fate card.</li>" +
      "<li>Announce it before drawing for a unit type and draw one fewer Fate card per Tactical Fate card. Its symbols resolve like a Fate card, its text is ignored, and then it goes to the Tactics discard pile.</li>" +
      "<li>Not usable in the season it was drawn.</li></ul>" +
      "<h4>Garrison Order card (0)</h4><ul><li>When defending in battle this season, +2 strength (at Tally Strength). <b>Supremacy:</b> recruit 2 triangle units of your faction at any strongholds you control.</li></ul>" +
      "<h4>Guildmaster of Merchants (Title card)</h4><ul><li>+2 resources of any one type each time you resolve Harvest (a different type each time if you like), and you may ignore resource loss from a Season card's primary ability.</li></ul>" +
      "<h4>Desolation and cryomancy tokens</h4><ul>" +
      "<li><b>Desolation:</b> when placed, the area's controller immediately gains the resources the area provides. Never in a home realm, or where a desolation or cryomancy token already is. It stays until a card or ability removes it.</li>" +
      "<li><b>Cryomancy:</b> units ignore that area's water borders as in winter (adjacent areas are unaffected). Never in a home realm or with a desolation token; several may share an area. Each spring, remove one from each area.</li>" +
      "<li>While either is in an area, it has <b>no resource icons</b>, and a city there gives nothing to Rally Support and no dragon rune. Rune and exploration tokens there are unaffected.</li></ul>" +
      "<h4>Map tile 12 and the Lost City</h4><ul>" +
      "<li>Strongholds may not be built on tile 12.</li>" +
      "<li>A Quest that places the Lost City puts it on tile 12 with its blue water border over the yellow one. If tile 12 has a desolation or cryomancy token, don't place the city: remove those tokens instead.</li>" +
      "<li>The Lost City is a city in every way, and can be destroyed and found again later. It adds resource icons to the area and gives its controller a dragon rune. Banners of War points to Rise of the Free Cities' rules for that rune: it counts only toward winning, and effects that target rune tokens can't touch it. If an effect would place the city while it's already out, ignore the effect.</li></ul>" +
      "<h4>Also</h4><ul>" +
      "<li><b>Supplemental influence:</b> a “3” token is worth three influence; swap them in if normal tokens run short.</li>" +
      "<li><b>Revealing rune tokens</b> to trigger a card (such as “Game of Power”) requires tokens not already revealed.</li>" +
      "<li>Every Banners of War card carries the expansion's icon on its front, so it can be sorted out afterwards.</li></ul>",
    src: "BoW p.4–8, p.11 · Rules p.30"
  },
  {
    title: "Development Cards (variant)",
    when: (c) => c.mod("dev"),
    html: (c) => "<h4>Buying</h4><ul>" +
      "<li>When you resolve <b>Harvest's Supremacy Bonus</b>, you may buy <b>one</b> of your faction's 8 Development cards as well as building the normal development token — either, both or neither.</li>" +
      "<li>Pay its cost by lowering your dials at once. You can't buy one you can't fully afford.</li>" +
      "<li>Place it faceup next to your faction sheet. Its abilities are <b>permanent</b> and can't be lost.</li>" +
      "<li>In battle, a defender may use a Development card at the Fortifications step.</li></ul>" +
      "<h4>Capital stronghold (one Development card per faction)</h4><ul>" +
      "<li>Replaces one of your home realm strongholds; a development token there moves to the capital. It goes in undamaged, even if the stronghold was damaged.</li>" +
      "<li>Holds <b>two</b> development tokens; strength <b>7</b> while undamaged.</li>" +
      "<li>If destroyed, the next time you build a stronghold in your home realm with Fortify, you may build the capital instead, for <b>2 ore and 1 wood</b>.</li>" +
      "<li>Only ever in your own home realm. Conquering an enemy capital, you may replace it with one of your strongholds — never your capital.</li></ul>" +
      "<h4>Faction tokens</h4><ul>" +
      "<li" + (c.fac("waiqar") ? "" : " class='dim'") + "><b>Waiqar — “Lands of Blight”:</b> gain 8 <b>Reanimate tokens</b>. They are plastic Reanimates in every way: recruited normally, subject to unit limits and the winter food limit. Swap a token and a plastic Reanimate at any time.</li>" +
      "<li" + (c.fac("daqan") ? "" : " class='dim'") + "><b>Daqan — “Support of the People”:</b> gain 3 <b>peasant tokens</b>. When you move all your units out of an area, you may leave an unused peasant token there and it stays a friendly area you control. You can't move one in from another area. Any activation token placed there (even yours) removes it; removed peasants can be reused.</li></ul>",
    src: "BoW p.9, p.12"
  },
  {
    title: "Commanders of the Battlefield (variant)",
    when: (c) => c.mod("cmd"),
    html: () => "<ul>" +
      "<li><b>Setup:</b> two Hero cards each and one Commander card. Choose one hero as your <b>commander</b>: his Commander card goes next to his Hero card and a commander token under his figure.</li>" +
      "<li>A commander is still a hero, not a unit. He can't attempt Quests, but he moves, duels, trains, heals and uses Reward cards normally.</li>" +
      "<li>Commanders <b>don't count</b> toward the three-hero limit, so you may have four heroes.</li>" +
      "<li><b>Moving:</b> like units with Strategize, Mobilize or Conquer. He can't leave an activated area, or move while routed, even in the Quest Phase.</li></ul>" +
      "<h4>In battle</h4><ul>" +
      "<li>A <b>standing</b> commander in the area where your units battle gives them his Commander card's ability.</li>" +
      "<li>Lose, and he retreats with your units as if he were a unit.</li>" +
      "<li>In a contested area he can't be targeted by unit special abilities. He takes damage only if his Commander card allows it and you choose to.</li>" +
      "<li>A defeated commander is removed like any defeated hero, and his Commander card is discarded.</li></ul>" +
      "<h4>New Commander cards and new commanders</h4><ul>" +
      "<li><b>Rally Support's bonus:</b> instead of Hero cards, pay up to 3 influence to draw that many Commander cards. Keep one to replace your current card — or keep your old one. The rest go to the bottom of the Commander deck. You may never hold more than one Commander card, unless Lieutenant General (below) is in play.</li>" +
      "<li><b>Start of the Quest Phase:</b> you may hand the Commander card to another friendly hero at one of your strongholds. The old commander becomes a normal hero.</li>" +
      "<li>If your only commander was defeated: at the start of a Quest Phase, draw a new Commander card and give it to a hero at one of your strongholds.</li>" +
      "<li><b>Lieutenant General</b> (Tactics, played during your turn): it stays in play — draw an additional Commander card and control a <b>second</b> commander (up to five heroes). If either commander is defeated, discard his Commander card and Lieutenant General. Rally Support still lets you keep only one drawn Commander card.</li></ul>",
    src: "BoW p.10, p.12"
  },
  {
    title: "Rise of the Free Cities (variant)",
    when: (c) => c.mod("rotfc"),
    html: () => "<ul>" +
      "<li>The <b>alternate city tokens</b> replace the base game's city tokens. They give more Tactics cards and influence through Rally Support.</li>" +
      "<li>Three of them show a <b>dragon rune</b>: the controller of that area controls one more dragon rune.<ul>" +
      "<li>It counts only toward winning, and effects that target rune tokens can't touch it.</li>" +
      "<li>A rune token may still be placed there, so one area can be worth two dragon runes.</li></ul></li>" +
      "<li><b>You need one more dragon rune to win:</b> seven to claim victory with your Victory card.</li>" +
      "<li>A desolation or cryomancy token in a city's area switches off its dragon rune until removed.</li></ul>",
    src: "BoW p.8, p.11"
  },
  {
    title: "Original-Edition Copy — the Revised Gameplay Changes",
    when: (c) => c.orig,
    html: (c) => "<p>The Revised Gameplay sheet lists every rule change needed to play the revised edition with an original-edition copy. Its rules override the original rulebook and Banners of War. Everything on this page already follows the revised rules; this is the checklist.</p>" +
      "<h4>Map setup</h4><ul>" +
      "<li>Home realm setup markers: three or more areas apart (the original rulebook said four).</li>" +
      "<li>Rune tokens: placed during board setup (board step 5, once the home realm setup markers are down), not in the home realms during setup step 8.</li></ul>" +
      "<h4>Winning</h4><ul>" +
      "<li>The game ends after the <b>seventh</b> year (not the sixth), or when a player's victory claim succeeds.</li>" +
      "<li>Six dragon runes no longer win at once: prove them, then still hold six a year later." + (c.has("bow") ? " With Banners of War, use its Road to Victory rules and Victory cards." : " Without Banners of War, a unit on the Season deck stands in for the Victory card.") + "</li></ul>" +
      "<h4>Combat</h4><ul>" +
      "<li>Routed hexagon units count as standing units at Tally Strength.</li>" +
      "<li>Heroes can support units in battle (draw an extra Fate card, discard one).</li>" +
      "<li>The defender assigns his routs and damage before the attacker does.</li></ul>" +
      "<h4>Card changes</h4><ul>" +
      "<li><b>Threatened Home Realms</b> (Season): move 1 rune token, not 2.</li>" +
      "<li><b>Mobilize</b> and <b>Conquer</b> (Order; the sheet says “Conquest”): move heroes too.</li>" +
      "<li><b>Ambush</b> (Tactics): Quest Phase only.</li>" +
      "<li><b>Latari Elves' Sorceress:</b> <i>“Your opponent must retreat one unit of your choice from the battle.”</i></li></ul>" +
      "<h4>Not compatible</h4><ul><li>The original rulebook's <b>Epic Play</b> variant.</li></ul>" +
      "<h4>Your box (FAQ 1.2)</h4><ul><li>It holds <b>24 Quest cards</b> and <b>8 Hell Hound</b> figures — the original rulebook's list says 23 and 4.</li><li>The mountain pieces sit in their map tiles only while the tiles lie flat; store them separately.</li></ul>" +
      "<p class='inline-note'>The Components section lists the Revised Edition box only for a Revised Edition copy: the sources here don't list the original box.</p>",
    src: "Revised Gameplay p.1–2 · FAQ 1.2 p.1"
  },
  {
    title: "Rulings & Precedence — Which Source Wins",
    when: () => true,
    html: (c) => "<p><b>Newest wins:</b> Revised Gameplay sheet (May 2013) › Revised rulebook (©2012) › Banners of War (2011) › FAQ 1.2 (Feb 2010).</p>" +
      "<h4>FAQ 1.2 (written for the original edition)</h4><ul>" +
      "<li><b>Still applies</b>, and appears in the sections above: the 6D/3C Giant erratum; a battle against an empty stronghold; mid-battle retreats; Necromancer Reanimates; Siege Tower strength; Pegasus Rider against Berserker; “destroy 2▲ or 1■”; Power for the Pious; Threatened Home Realms; Tactical Retreat with more than 8 units.</li>" +
      "<li><b>Absorbed by the Revised rulebook</b> (its text now says the same):<ul>" +
      "<li>24 Quest cards and 8 Hell Hounds (Rules p.4);</li>" +
      "<li>home realm control (p.15; see Key Terms) and allied units (p.19; see Neutral Units &amp; Diplomacy);</li>" +
      "<li>recruiting with all three resources at setup (p.7);</li>" +
      "<li>moving through friendly activated areas (p.17);</li>" +
      "<li>all-zero bid ties (p.31);</li>" +
      "<li>failed Quests stay in hand (p.26).</li></ul></li>" +
      "<li><b>Original box only:</b> the mountain pieces" + (c.orig ? " (see board step 2)" : "; the Revised Edition component list has none") + ".</li></ul>" +
      "<h4>Revised Gameplay sheet</h4><ul>" +
      "<li>Written for original-edition copies. Its rules — map setup, seven years, victory claims, hero support, routed hexagons, defender assigns first, Mobilize and Conquer moving heroes — are already in the Revised rulebook.</li>" +
      "<li>Its card wording (Threatened Home Realms, Ambush, the Sorceress) is shown for original copies" + (c.orig ? " (see Original-Edition Copy)" : ", which you can select in the configurator") + ".</li>" +
      "<li>The one rule it adds is the unit that stands in for a Victory card, for copies without Banners of War.</li>" +
      "<li><b>Three places where the sheet's wording differs from the Rules, followed here as the Rules have them:</b><ul>" +
        "<li>The sheet's “Conquest” Order card is the one the Rules (p.14, p.33) and Banners of War (p.10) call <b>Conquer</b>, the name this page uses.</li>" +
        "<li>Home realm setup markers “three or more areas away from each other” (the sheet) and “at least three areas between” (Rules p.8–9) describe the same count; the Rules' example counts the three areas between markers.</li>" +
        "<li>The sheet places rune tokens “immediately after placing map tiles”, but the rule text it quotes forbids areas adjacent to a home realm setup marker, so the markers must already be down. The tokens go in at board step 5, as the Rules order it.</li></ul></li></ul>" +
      (c.has("bow") ? "<h4>Banners of War under the revised rules</h4><ul>" +
        "<li><b>Road to Victory</b> is no longer optional: Victory cards are mandatory (Rules p.30).</li>" +
        "<li>The game lasts <b>seven</b> years; read the expansion's “sixth and final year” example as the seventh.</li>" +
        "<li>Battles follow the Revised rulebook's steps — supporting heroes, routed hexagons — with the expansion's additions slotted in.</li>" +
        "<li>The expansion's note about the base game's Epic Game variant doesn't apply: the revised rules have no Epic variant.</li>" +
        (c.mod("dev") ? "<li><b>Conquered capitals:</b> BoW p.12 says the winner “may not replace an enemy capital stronghold with one of his own”; p.9 spells it out — he may replace it with one of his strongholds, never with his capital. This page follows p.9.</li>" : "") + "</ul>" : ""),
    src: (c) => RW.cite("FAQ 1.2 p.1", "Revised Gameplay p.1–2", "Rules p.4, p.7–9, p.14–15, p.17, p.19, p.26, p.30–31, p.33", "BoW p.10", c.has("bow") && "BoW p.8, p.11–12", c.mod("dev") && "BoW p.9")
  }
];

/* =============================================================================
   TEACHING SCRIPT (~5 minutes, read aloud) — written from the rulebooks cited in the setup and reference.
   ============================================================================= */
RW.teach = {
  intro: "A five-minute teach for the exact table configured above. Read it aloud, or copy it and adjust. Every rule in it comes from the rulebooks cited in the setup steps.",
  sections: [
    {
      h: "The hook — and how you win",
      body: (c) => {
        const n = RW.num(RW.runesToWin(c));
        const unit = c.orig && !c.has("bow");
        return "<p>Terrinoth is up for grabs, and the prize is the <b>dragon runes</b>. We each start with a three-area home realm and spread out from there: conquering land, recruiting armies, hiring heroes.</p>" +
          "<p>The runes sit on the board as <b>facedown tokens</b>, and most real dragon runes arrive paired with a <b>false</b> one. Only the player who controls an area, or has a hero in it, may peek at its token.</p>" +
          "<p>After <b>seven years</b> every token flips, and the most dragon runes wins. Or end it early: during your turn, reveal <b>" + n + " dragon runes</b> you control and put " +
          (unit ? "<b>an unused unit of your faction</b>" : "your <b>Victory card</b>") + " on top of this season's deck. Still holding " + n + " when that season comes back next year? You win. Everyone else gets a year to take them off you.</p>";
      }
    },
    {
      h: "Who's at the table",
      body: (c) => "<p>Tonight it's " + RW.andList(c.facs.map(f => f.art + "<b>" + f.name + "</b> in " + f.color)) + ". " +
        "Your faction sheet is your army: three resource dials, your starting Tactics cards and influence, and your unit types, each with its base shape, health, special ability and initiative row" +
        (c.has("bow") ? ". With Banners of War, a reinforcement sheet beside it adds two more unit types." : ".") + "</p>"
    },
    {
      h: "The shape of a year",
      body: () => "<p>A year is <b>spring, summer, fall and winter</b>, and every season has three steps.</p>" +
        "<p><b>First</b>, the first player draws that season's <b>Season card</b>: an event, then a seasonal effect. Spring takes our Orders back into hand and stands routed figures up. Summer is the <b>Quest Phase</b> for heroes. Fall gives each of us two influence or a Tactics card. Winter is harsh: in each area you keep only as many units as your <b>food dial</b> shows — but the rivers freeze, so water borders stop blocking.</p>" +
        "<p><b>Second</b>, we each secretly choose one <b>Order card</b>. <b>Third</b>, we reveal together and resolve from the lowest number up; ties go to whoever has more influence.</p>"
    },
    {
      h: "Orders — what you can do, and why",
      body: (c) => "<p>You hold " + (c.has("bow") ? "nine" : "eight") + " Order cards — one per season, and used ones only come back in spring, so you use <b>four a year</b>.</p><ul>" +
        "<li><b>1 Strategize:</b> shuffle troops into neighboring friendly or empty areas.</li>" +
        "<li><b>2 Mobilize</b> and <b>3 Conquer:</b> activate an area and march in from up to two areas away — to attack, or to parley with neutral monsters.</li>" +
        "<li><b>4 Harvest:</b> reset your dials to what your land produces.</li>" +
        "<li><b>5 Recruit:</b> turn one dial into fresh units at your strongholds.</li>" +
        "<li><b>6 Rally Support:</b> cash in the cities you hold.</li>" +
        "<li><b>7 Acquire Power:</b> influence, and a shot at the Title cards.</li>" +
        "<li><b>8 Fortify:</b> build or repair strongholds, and move rune tokens to safer ground.</li></ul>" +
        "<p>The twist is the <b>Supremacy Bonus</b> at the bottom: you only get it if that card is the <b>highest-numbered Order you have faceup</b>. So you climb through the year, low numbers first. And units in an area you activated are stuck there until spring.</p>"
    },
    {
      h: "The central mechanic — dials, not income",
      body: () => "<p>This trips everyone up: your <b>food, wood and ore dials don't update by themselves</b>. <b>Harvest</b> resets them to what your areas produce; building spends from them.</p>" +
        "<p>Each dial's spaces are printed with units, Tactics cards and influence. <b>Recruit</b> gives you every unit at or below the arrow on one dial, and that costs nothing. So conquering rich land does nothing until you Harvest — and a high dial is an engine you can run again and again.</p>"
    },
    {
      h: "Battles and diplomacy",
      body: () => "<p>Move into an enemy area and you fight. Units line up beside the faction sheets in <b>initiative rows one to five</b>. Each round, each side picks a unit type in that row and draws <b>one Fate card per unit</b>, reading the section that matches its base shape.</p>" +
        "<p>Special abilities fire first, then routs — tip over a healthy unit — then damage, which goes first on units already hurt. After five rounds, count your standing units (routed hexagons count too); a defender adds his stronghold. Higher total wins, <b>ties go to the defender</b>, and the loser retreats routed. A standing hero can <b>support</b> one unit type: an extra card, discard one.</p>" +
        "<p>March in on <b>neutral monsters</b> and you may fight or try <b>diplomacy</b>: spend one to six influence, draw that many Fate cards and pick one. Gold means they join you, silver sends them fleeing, red means fight or back off.</p>"
    },
    {
      h: "Heroes and quests",
      body: (c) => "<p>Heroes aren't units; " + (c.mod("cmd") ? "you start with two and can hold three, plus your commander" : "you start with one and can hold three") + ". In each summer's <b>Quest Phase</b>, every hero heals, trains, or moves up to two areas — straight through enemy land — and then may duel an enemy hero or attempt one of your Quest cards. Quests test strength, agility or wisdom: draw that many Fate cards and pick one. Rewards come facedown — weapons, armor, even dragon runes.</p>"
    },
    { when: (c) => c.has("bow"),
      h: "Banners of War",
      body: (c) => "<p>Each faction gets two new unit types on a <b>reinforcement sheet</b>, recruited in place of a base unit. Some new Tactics cards are <b>Tactical Fate</b> cards: play them for their text, or in a fight instead of drawing a Fate card. Everyone also gets a ninth Order, <b>Garrison</b>, number zero: +2 strength when you defend this season.</p>" +
        "<p>Watch for <b>desolation</b> and <b>cryomancy</b> tokens, which strip an area's resources, and the <b>Lost City</b>, a Quest's prize worth a dragon rune. <b>Guildmaster of Merchants</b> is a fourth Title to fight over.</p>"
    },
    { when: (c) => c.mod("dev"),
      h: "Development cards",
      body: () => "<p>When you take <b>Harvest's Supremacy Bonus</b>, you may also buy one of your faction's eight <b>Development cards</b> with resources from your dials — permanent upgrades, including your <b>capital</b> stronghold.</p>"
    },
    { when: (c) => c.mod("cmd"),
      h: "Commanders of the Battlefield",
      body: () => "<p>You each start with <b>two heroes</b> and make one your <b>commander</b>. He can't quest, but he marches with your armies, and his Commander card helps your units in battle. He doesn't count toward the three-hero limit.</p>"
    },
    { when: (c) => c.mod("rotfc"),
      h: "Rise of the Free Cities",
      body: () => "<p>The cities are richer, and three carry a <b>dragon rune</b> for whoever holds them — so it takes <b>seven</b> dragon runes to claim victory.</p>"
    },
    { when: (c) => c.mod("explore"),
      h: "Exploration tokens",
      body: () => "<p>Every area outside the home realms hides a facedown <b>exploration token</b>. When a hero ends his Quest Phase move on one, flip it and resolve it before he duels or quests. Some are one-off events; others stay, like the <b>Dragon Throne</b>, worth a dragon rune.</p>"
    },
    { when: (c) => c.orig,
      h: "Our original-edition box",
      body: (c) => "<p>We're playing the revised rules from an original box, so a few components read differently: <b>Threatened Home Realms</b> moves one rune token, not two; <b>Mobilize</b> and <b>Conquer</b> move heroes too; <b>Ambush</b> is Quest Phase only; and the Elf <b>Sorceress</b> makes the opponent retreat a unit of the Elf player's choice." +
        (c.has("bow") ? "" : " There are no Victory cards, so you claim victory with an unused unit of your faction.") + "</p>"
    },
    {
      h: "Don't worry about these until they come up",
      body: (c) => {
        const items = [
          "<li><b>Influence bids</b> — Season cards call them; everything bid is lost.</li>",
          "<li><b>Title cards</b> and your secret <b>Objective card</b> — read them when they matter.</li>",
          "<li><b>Developments</b> — Harvest's bonus builds them, including your faction's defensive one.</li>",
          "<li><b>Duels</b> — up to four quick rounds; defeat a hero and take his Rewards.</li>",
          "<li><b>Tactics card timing</b> — each card says when, never in the season you drew it.</li>",
          "<li><b>Victory claims</b> — nobody can put " + ((c.orig && !c.has("bow")) ? "a unit" : "a Victory card") + " on a Season deck in the seventh year, because it could never resolve.</li>"
        ];
        if (c.has("bow") && !c.mod("cmd")) items.push("<li><b>Lieutenant General</b> — without Commanders, discard it and draw again.</li>");
        if (c.mod("explore")) items.push("<li><b>Each exploration token's text</b> — read it when it flips.</li>");
        return "<ul>" + items.join("") + "</ul>";
      }
    }
  ]
};
