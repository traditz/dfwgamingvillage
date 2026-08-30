/* =============================================================================
   Lords of Hellas — Setup & Reference Utility · data
   All content sourced from the official rulebooks and FAQs (see citations).
   ============================================================================= */
var LH = {};

LH.expMeta = {
  base:   { name: "Core Box",      cls: "tag-base" },
  da:     { name: "Dark Ages",     cls: "tag-da" },
  kronos: { name: "Kronos",        cls: "tag-kronos" },
  cos:    { name: "City of Steel", cls: "tag-cos" },
  apollo: { name: "Apollo",        cls: "tag-apollo" },
  atlas:  { name: "Atlas",         cls: "tag-atlas" },
  solo:   { name: "Solo",          cls: "tag-solo" },
  faq:    { name: "FAQ",           cls: "tag-faq" },
  mod:    { name: "Module",        cls: "tag-mod" }
};

LH.expansions = [
  { id: "base",   short: "Lords of Hellas", year: "2018", blurb: "The core box: four Heroes, three Monuments, seven Monsters — and the Solo Campaign board on the back. Always in play." },
  { id: "da",     short: "Dark Ages Expansion Pack", year: "2018", blurb: "Poseidon, Hades, Hephaestus, Orichalkum & Constructs, the Atlantis 5th-player board, Heroes & Monsters, Chiron, Opportunity Cards and more." },
  { id: "cos",    short: "City of Steel", year: "2018", blurb: "The Troy board and Hector for 6-player games, plus the Army Upgrade module. Requires Poseidon and Atlantis for 6 players." },
  { id: "apollo", short: "Apollo — Lord of the Sun", year: "2019", blurb: "The Apollo Monument and the Muses." },
  { id: "atlas",  short: "Atlas", year: "2019", blurb: "The Atlas Monument with two optional modes: Overload and the Hesperides Garden." },
  { id: "kronos", short: "Kronos", year: "2019", blurb: "An alternate 2–4 player mode: one player is the titan Kronos, the rest are Heroes trying to stop him." }
];

LH.modes = [
  { id: "standard", requires: "base", name: "Standard game", blurb: "The competitive base game for 2–6 players — first to any victory condition wins." },
  { id: "kronos", requires: "kronos", name: "Kronos Rebellion", blurb: "One player frees the titan; the other Heroes team up to stop him. 2–4 players, alternate board." },
  { id: "solo", requires: "base", name: "Solo Campaign", blurb: "The two-act Persian Invasion for 1 player, on the back of the game board." }
];

/* Modules. group: click-time mutual exclusion.
   "messenia" — full god expansions & Atlas share the board's single free Monument slot.
   "zeus" — Simple modes that replace the Zeus Monument.                              */
LH.modules = [
  { id: "poseidon", requires: "da", group: "messenia", name: "Poseidon", summary: "Ports, Sea battles and the Fleet Attribute",
    description: "Adds the Poseidon Monument in Messenia, Port tokens, and the Fleet Attribute. For experienced players — use one full god expansion at a time.", src: "Dark Ages p.2" },
  { id: "poseidonS", requires: "da", group: "athena", excludes: ["poseidon"], name: "Poseidon (Simple mode)", summary: "Poseidon replaces Athena — no Fleet rules",
    description: "The Poseidon Monument replaces Athena in Attica; Ports are placed but Fleet rules aren't used. Usable in any game.", src: "Dark Ages p.2" },
  { id: "hades", requires: "da", group: "messenia", name: "Hades", summary: "Warriors of Hades, the Underworld and Resurrection",
    description: "Adds the Hades Monument in Messenia, the Underworld board, the Raise Attribute, Warriors of Hades and Gates of Hades. For experienced players.", src: "Dark Ages p.4" },
  { id: "hadesS", requires: "da", group: "zeus", excludes: ["hades"], name: "Hades (Simple mode)", summary: "Hades replaces Zeus — no Underworld rules",
    description: "The Hades Monument replaces Zeus in Thessaly; Warriors, Raise, Gates and the Underworld board aren't used. Usable in any game.", src: "Dark Ages p.4" },
  { id: "hephaestus", requires: "da", group: "messenia", name: "Hephaestus", summary: "Reforge Combat Cards into permanent Relics",
    description: "Adds the Hephaestus Monument in Messenia, the Relic deck and Reforging. For experienced players.", src: "Dark Ages p.5" },
  { id: "hephaestusS", requires: "da", group: "zeus", excludes: ["hephaestus"], name: "Hephaestus (Simple mode)", summary: "Hephaestus replaces Zeus — no Relic rules",
    description: "The Hephaestus Monument replaces Zeus in Thessaly; Relics aren't used. Usable in any game.", src: "Dark Ages p.5" },
  { id: "apolloM", requires: "apollo", group: "messenia", name: "Apollo — Lord of the Sun", summary: "The Muses walk the Lands",
    description: "Adds the Apollo Monument in Messenia and the Muses. For experienced players.", src: "Apollo p.3" },
  { id: "apolloS", requires: "apollo", group: "hermes", excludes: ["apolloM"], name: "Apollo (Simple mode)", summary: "Apollo replaces Hermes — no Muse rules",
    description: "The Apollo Monument replaces Hermes in Acarnania; Muses aren't used. Usable in any game.", src: "Apollo p.4" },
  { id: "atlasO", requires: "atlas", group: "messenia", excludes: ["atlasH"], name: "Atlas: Overload", summary: "A doomsday timer the players feed with Hoplites",
    description: "Atlas stands in Messenia holding the Overload track — when it hits 0 the game ends and the most Hoplites on Atlas wins. For experienced players.", src: "Atlas p.3" },
  { id: "atlasH", requires: "atlas", group: "messenia", excludes: ["atlasO"], name: "Atlas: Hesperides Garden", summary: "Send Hoplites to Atlas for Golden Apples",
    description: "Atlas stands in Messenia holding 15 Golden Apples — spend them for Army Strength, healing or temporary Attributes. For experienced players.", src: "Atlas p.4" },
  { id: "orichalkum", requires: "da", name: "Orichalkum & Constructs", summary: "A resource that recharges Artifacts and buys Constructs",
    description: "Orichalkum tokens appear in City Regions; spend them to recharge Artifacts or use one-shot Construct cards. Combinable with Poseidon and Atlantis.", src: "Dark Ages p.4" },
  { id: "heroesmonsters", requires: "da", name: "Heroes & Monsters", summary: "Cassandra & Odysseus, Typhon & Python",
    description: "Two extra Heroes and two extra Monsters. Usable in any game.", src: "Dark Ages p.6" },
  { id: "combatcards", requires: "da", name: "Additional Combat Cards", summary: "Six new cards shuffled into the Combat deck",
    description: "Usable in any game; recommended when adding the Heroes & Monsters beasts.", src: "Dark Ages p.6" },
  { id: "chiron", requires: "da", name: "Chiron", summary: "A friendly-ish centaur offering Training Quests",
    description: "Chiron appears like a Monster; his Training Quests award permanent Combat-Card-like Training cards. Usable in any game.", src: "Dark Ages p.7" },
  { id: "opportunity", requires: "da", name: "Opportunity Cards", summary: "One-shot event offers anyone can grab",
    description: "Shuffled into the Events deck; a face-up Opportunity waits on the deck until someone uses it. Usable in any game.", src: "Dark Ages p.7" },
  { id: "armyupgrade", requires: "cos", name: "Army Upgrade", summary: "Asymmetric army powers earned during play",
    description: "Each player's army color has an Upgrade board; earn up to two upgrades via Blessing Drafts or by controlling the most Cities. Usable in any game.", src: "City of Steel p.4" }
];

const M_GOD = { poseidon: "Poseidon", hades: "Hades", hephaestus: "Hephaestus", apolloM: "Apollo" };

/* =============================================================================
   SETUP PHASES — c = { has(exp), p, mode, mod(id) }
   ============================================================================= */
LH.phases = [
  {
    title: "Main Board & Monuments",
    steps: [
      { when: (c) => c.mode === "standard", exp: "base",
        t: "Set up the main board & Monument foundations",
        d: (c) => {
          let gods = ["<b>Zeus</b> in Thessaly", "<b>Athena</b> in Attica", "<b>Hermes</b> in Acarnania"];
          if (c.mod("hadesS")) gods[0] = "<b>Hades</b> in Thessaly (replacing Zeus)";
          if (c.mod("hephaestusS")) gods[0] = "<b>Hephaestus</b> in Thessaly (replacing Zeus)";
          if (c.mod("poseidonS")) gods[1] = "<b>Poseidon</b> in Attica (replacing Athena)";
          if (c.mod("apolloS")) gods[2] = "<b>Apollo</b> in Acarnania (replacing Hermes)";
          let d = "<ul><li>Unfold the main board (standard side up).</li>" +
            "<li>Place the <b>first level</b> of each Monument in its Region — " + gods.join(", ") + " — and put each God's <b>Artifact card</b> underneath.</li>";
          const full = Object.keys(M_GOD).find(id => c.mod(id));
          if (full) d += "<li><b>" + M_GOD[full] + ":</b> place its Monument (first level) in <b>Messenia</b> — the board's free Monument slot — with its God's Artifact card underneath, and take its Help card (red-corner side).</li>";
          if (c.mod("poseidonS") || c.mod("hadesS") || c.mod("hephaestusS") || c.mod("apolloS")) d += "<li>Take the Help card for each <b>Simple-mode</b> god, using the <b>gray-corner</b> side.</li>";
          if (c.mod("atlasO")) d += "<li><b>Atlas: Overload:</b> place the Atlas Monument in <b>Messenia</b> with the Atlas board on his hands (0–15 track side up) and the Overload token on space <b>15</b>.</li>";
          if (c.mod("atlasH")) d += "<li><b>Atlas: Hesperides Garden:</b> place the Atlas Monument in <b>Messenia</b> with the Atlas board on his hands (Garden side up) and <b>15 Golden Apple tokens</b> on it.</li>";
          return d + "</ul>";
        },
        src: (c) => {
          const s = ["Base p.6"];
          if (c.mod("poseidon") || c.mod("poseidonS")) s.push("Dark Ages p.2");
          if (c.mod("hades") || c.mod("hadesS")) s.push("Dark Ages p.4");
          if (c.mod("hephaestus") || c.mod("hephaestusS")) s.push("Dark Ages p.5");
          if (c.mod("apolloM") || c.mod("apolloS")) s.push("Apollo p.3–4");
          if (c.mod("atlasO") || c.mod("atlasH")) s.push("Atlas p.3–4");
          return s.join(" · ");
        } },
      { when: (c) => c.mode === "standard" && (c.mod("poseidon") || c.mod("poseidonS")), exp: "mod",
        t: "Poseidon — place the Ports",
        d: (c) => "<ul><li>Place 1 <b>Port token</b> (at random, number side down) in each of: <b>Acarnania, Thessaly, Attica, Messenia and Laconia</b>.</li>" +
          (c.p >= 5 ? "<li><b>5–6 players:</b> add a Port in <b>North Atlantis</b> (Atlantis board).</li>" : "") +
          (c.p === 6 ? "<li><b>6 players:</b> add a Port in <b>Lesbos</b> (City of Steel board).</li>" : "") +
          (c.mod("poseidon") ? "<li>Place the <b>Fleet board</b> nearby with each player's Fleet token on value <b>1</b>.</li>" : "<li><i>Simple mode:</i> Fleet components and rules are not used.</li>") + "</ul>",
        src: () => "Dark Ages p.2" },
      { when: (c) => c.mode === "standard" && c.mod("hades"), exp: "mod",
        t: "Hades — Underworld board",
        d: "<ul><li>Place the <b>Underworld board</b> nearby with each player's <b>Raise token</b> on value <b>1</b>. Killed Hoplites will go to the Underworld and can return via the <b>Resurrection</b> Regular Action.</li></ul>",
        src: "Dark Ages p.4" },
      { when: (c) => c.mode === "standard" && c.mod("atlasO"), exp: "mod",
        t: "Atlas: Overload — Ports",
        d: (c) => "<ul>" + (c.mod("poseidon") || c.mod("poseidonS") ? "<li>Poseidon's Ports are already in play — Atlas Overload uses Regions with Ports for sending Hoplites.</li>" : "<li>Place 5 <b>Port tokens</b> randomly (number side down) in: <b>Messenia, Crete, Acarnania, Boeotia and Chalkidiki</b>, then flip them so the numbers are visible.</li>") + "<li>The Atlas victory condition is an <b>additional</b> victory condition.</li></ul>",
        src: () => "Atlas p.3" },
      { when: (c) => c.mode === "standard" && c.mod("atlasH"), exp: "mod",
        t: "Atlas: Hesperides Garden — Ports",
        d: (c) => "<ul>" + (c.mod("poseidon") || c.mod("poseidonS") ? "<li>Poseidon's Ports are already in play — the Garden uses Regions with Ports for sending Hoplites.</li>" : "<li>Place 5 <b>Port tokens</b> randomly (numbers don't matter in this mode) in: <b>Messenia, Crete, Acarnania, Boeotia and Chalkidiki</b>.</li>") + "</ul>",
        src: () => "Atlas p.4" },
      { when: (c) => c.mode === "standard" && c.p >= 5, exp: "da",
        t: "Atlantis — the 5th-player board",
        d: "<ul><li>Place the <b>Atlantis board</b> on the lower-right side of the main board. Its Sea Trails connect to the corresponding Regions of the main board (and the City of Steel board, if used) and work both ways.</li>" +
          "<li>The <b>Factory</b> (a special Temple) can later be built by whoever controls the <b>Inner Circle</b> Region — putting <b>Talos</b> into play under that player's control.</li></ul>",
        src: "Dark Ages p.3" },
      { when: (c) => c.mode === "standard" && c.p === 6, exp: "cos",
        t: "City of Steel — the 6th-player board",
        d: "<ul><li>You must also set up the <b>Poseidon and Atlantis</b> expansions to play City of Steel.</li>" +
          "<li>Place the <b>City of Steel board</b> on the upper-right side of the main board, directly above the Atlantis board. Its Sea Trails connect to the main board and Atlantis board, both ways.</li>" +
          "<li><b>Troy</b> is a super-city: its controller holds up to <b>5</b> Combat Cards, may Recruit 1 Hoplite in each controlled Region of the Troad, and every Hoplite in Troy counts as Fortified. City/Sparta rules also apply to Troy.</li></ul>",
        src: "City of Steel p.3" }
    ]
  },
  {
    title: "Decks, Temples & Starting Events",
    steps: [
      { when: (c) => c.mode === "standard", exp: (c) => (c.mod("heroesmonsters") || c.mod("chiron") || c.mod("opportunity") || c.mod("combatcards") || c.p >= 5) ? "mod" : "base",
        t: "Shuffle the decks",
        d: (c) => {
          const ev = [];
          if (c.mod("heroesmonsters")) ev.push("the Typhon & Python Monster cards (Heroes & Monsters)");
          if (c.mod("chiron")) ev.push("the Chiron Monster cards");
          if (c.mod("opportunity")) ev.push("the Opportunity cards");
          if (c.p >= 5) ev.push("the Atlantis Monster & Quest cards");
          if (c.p === 6) ev.push("the City of Steel Monster & Quest cards");
          return "<ul>" + (ev.length ? "<li>First shuffle into the <b>Events Deck</b>: " + ev.join(", ") + ".</li>" : "") +
            (c.mod("combatcards") ? "<li>Shuffle the <b>6 additional Combat Cards</b> (Dark Ages) into the Combat deck.</li>" : "") +
            "<li>Shuffle the <b>Events Deck</b> (Monster and Quest cards), the <b>Monster Attack Deck</b>, and the <b>Combat Cards Deck</b>, and place them on the board.</li>" +
            (c.mod("chiron") ? "<li><b>Chiron:</b> create a face-down deck of his <b>6 Training Cards</b> — used when Chiron appears.</li>" : "") + "</ul>";
        },
        src: (c) => {
          const s = ["Base p.6"];
          if (c.mod("heroesmonsters") || c.mod("combatcards")) s.push("Dark Ages p.6");
          if (c.mod("chiron") || c.mod("opportunity")) s.push("Dark Ages p.7");
          if (c.p >= 5) s.push("Dark Ages p.3");
          if (c.p === 6) s.push("City of Steel p.3");
          return s.join(" · ");
        } },
      { when: (c) => c.mode === "standard", exp: (c) => c.mod("hephaestus") ? "mod" : "base",
        t: "Prepare Artifacts & the Blessing deck",
        d: (c) => {
          const gods = ["Zeus", "Athena", "Hermes"];
          if (c.mod("hadesS")) gods[0] = "Hades"; if (c.mod("hephaestusS")) gods[0] = "Hephaestus";
          if (c.mod("poseidonS")) gods[1] = "Poseidon";
          if (c.mod("apolloS")) gods[2] = "Apollo";
          const full = Object.keys(M_GOD).find(id => c.mod(id));
          if (full) gods.push(M_GOD[full]);
          return "<ul><li>Set aside the <b>Monster Artifact</b> cards next to their Monsters. Shuffle the remaining <b>Neutral Artifacts</b>" + (c.mod("hephaestus") || c.mod("hephaestusS") ? " (including the 5 Neutral Artifacts from the Hephaestus expansion)" : "") + " into a deck on the board.</li>" +
            "<li>Shuffle the <b>Blessing Cards</b> of the gods whose Monuments are in the game — <b>" + gods.join(", ") + "</b> — into one deck on the map.</li></ul>";
        },
        src: (c) => {
          const s = ["Base p.6"];
          if (c.mod("poseidon") || c.mod("poseidonS")) s.push("Dark Ages p.2");
          if (c.mod("hades") || c.mod("hadesS")) s.push("Dark Ages p.4");
          if (c.mod("hephaestus") || c.mod("hephaestusS")) s.push("Dark Ages p.5");
          if (c.mod("apolloM") || c.mod("apolloS")) s.push("Apollo p.3–4");
          return s.join(" · ");
        } },
      { when: (c) => c.mode === "standard", exp: "base",
        t: "Other components, Temples & Temple Card",
        d: (c) => "<ul><li>Place the <b>Monster Die</b>, Monster Wound markers, Glory Tokens, Quest Tokens, Monster miniatures, Monument parts, Monument Activation cards and Monster Trays next to the board.</li>" +
          "<li>Choose one random <b>Temple Card</b> and put it in its place on the board" + (c.p === 6 ? " — with 6 players, use one of the two <b>6-player Temple Cards</b> from City of Steel" : "") + ". Place the <b>Temples</b> and <b>Oracle of Delphi</b> stands on it (only the first <b>6</b> Temples in 2–3 player games).</li>" +
          (c.mod("orichalkum") ? "<li><b>Orichalkum:</b> place 1 <b>Orichalkum token</b> in each Region with a City — but none in Sparta" + (c.p === 6 ? " or Troy" : "") + ".</li>" : "") + "</ul>",
        src: (c) => {
          const s = ["Base p.6"];
          if (c.p === 6) s.push("City of Steel p.2");
          if (c.mod("orichalkum")) s.push("Dark Ages p.4");
          return s.join(" · ");
        } },
      { when: (c) => c.mode === "standard", exp: (c) => c.mod("orichalkum") ? "mod" : "base",
        t: "Prepare starting events",
        d: (c) => "<ul><li>Draw <b>7 cards</b> from the Events Deck and resolve them in order:</li>" +
          "<li><b>Quest cards:</b> place the card in a Quest Slot and its Quest Token in the indicated Region. Once three Quests are out, ignore further Quest cards (they still count toward the 7).</li>" +
          "<li><b>Monster cards:</b> place the Monster's miniature in the indicated Region, with its Monster Tray and assigned Artifact beside the board. If the Monster is already out, ignore the card and draw a replacement.</li>" +
          "<li>Shuffle the resolved Event cards back into the Events Deck (Quests on the slots stay).</li>" +
          (c.mod("orichalkum") ? "<li><b>Orichalkum:</b> draw <b>3 Construct cards</b> and set them face up next to the board.</li>" : "") + "</ul>",
        src: (c) => c.mod("orichalkum") ? "Base p.6 · Dark Ages p.4" : "Base p.6" }
    ]
  },
  {
    title: "Heroes & Players",
    steps: [
      { when: (c) => c.mode === "standard" && c.mod("armyupgrade"), exp: "mod",
        t: "Army Upgrade — choose army colors first",
        d: "<ul><li><b>Before selecting Heroes</b>, players choose their army color by picking one of the six <b>Army Upgrade boards</b>, starting with the first player and going <b>counter-clockwise</b>. Each player takes two <b>Upgrade tokens</b>.</li></ul>",
        src: "City of Steel p.4" },
      { when: (c) => c.mode === "standard", exp: (c) => (c.p >= 5 || c.mod("heroesmonsters")) ? "mod" : "base",
        t: "Pick Heroes & starting positions",
        d: (c) => {
          const pool = ["Helen", "Achilles", "Heracles", "Perseus"];
          if (c.mod("heroesmonsters")) pool.push("Cassandra", "Odysseus");
          if (c.p >= 5) pool.push("Cleito (Atlantis)");
          if (c.p === 6) pool.push("Hector (City of Steel)");
          return "<ul><li>Every player draws <b>1 Combat Card</b> (kept secret) and takes a <b>Help Tray</b>. Decide a starting player.</li>" +
            "<li>Heroes available: <b>" + pool.join(", ") + "</b>. The starting player picks a Hero and an Army board, takes that color's components (Hoplites, Priests, Control Tokens, colored ring), puts the ring on the Hero's base, takes <b>6 Used Action Tokens</b> and <b>3 Attribute Tokens</b> set to <b>1</b> on Leadership, Strength and Speed, and resolves the Hero's <b>starting bonus</b>.</li>" +
            "<li>They place their Hero with <b>2 Hoplites</b> in any Region (Quest/Monster Regions allowed — FAQ); if its Population Strength is 2 or less, they place their Control Token.</li>" +
            "<li>Continuing <b>counter-clockwise</b>, each next player does the same — but may not start in a Region holding another Hero. The <b>last player to place begins the game</b>; turns then run clockwise.</li></ul>";
        },
        src: (c) => {
          const s = ["Base p.8"];
          if (c.mod("heroesmonsters")) s.push("Dark Ages p.6");
          if (c.p >= 5) s.push("Dark Ages p.3");
          if (c.p === 6) s.push("City of Steel p.2");
          s.push("FAQ");
          return s.join(" · ");
        } },
      { when: (c) => c.mode === "standard" && c.mod("hades"), exp: "mod",
        t: "Hades — Warriors & Gates",
        d: "<ul><li>When choosing their Hero, each player also takes 1 <b>Warrior of Hades</b> and places it in any Region (before deploying Hoplites and Hero).</li>" +
          "<li>After all Heroes are placed, each player places 1 <b>Gate of Hades</b> in their Hero's starting Region.</li></ul>",
        src: "Dark Ages p.4" },
      { when: (c) => c.mode === "standard" && (c.mod("hephaestus") || c.mod("apolloM")), exp: "mod",
        t: (c) => [c.mod("hephaestus") ? "Hephaestus — Relics" : "", c.mod("apolloM") ? "Apollo — Muses" : ""].filter(Boolean).join(" · "),
        d: (c) => "<ul>" +
          (c.mod("hephaestus") ? "<li>After placing Heroes and drawing starting Combat Cards: set aside the <b>Lightning</b> cards as a face-up deck, then draw <b>3 Relic cards</b> face up above the Quest slots.</li>" : "") +
          (c.mod("apolloM") ? "<li>After placing Heroes and drawing starting Combat Cards: draw <b>2 Muse cards</b> and place them face up near the Muse deck. Each player has a Muse miniature (marked with their ring) waiting in their pool.</li>" : "") + "</ul>",
        src: (c) => [c.mod("hephaestus") ? "Dark Ages p.5" : "", c.mod("apolloM") ? "Apollo p.3–4" : ""].filter(Boolean).join(" · ") }
    ]
  },
  {
    title: "Kronos Rebellion Setup",
    steps: [
      { when: (c) => c.mode === "kronos", exp: "kronos",
        t: "Board & shared setup",
        d: "<ul><li>Use the <b>alternate board</b> (the back of the regular board, also used by the Solo Campaign).</li>" +
          "<li>Shuffle the <b>Monster Attack</b> and <b>Combat Cards</b> decks onto the board.</li>" +
          "<li>Prepare the <b>Blessing deck</b> after removing these 13 cards: Hero's Wrath, Ambush, Response Force, Bluff, Hermes Temple, No Attrition, Always Prepared, Unbroken Morale, Cunning Tactician, Athena's Gift, Heroic Presence, Restrictive Maneuver, Stalwart Defence.</li>" +
          "<li>Place the Glory Tokens on the <b>Neutral</b> space of their Population Attitude tracks.</li>" +
          "<li>Place <b>all Temples and the Oracle of Delphi</b> in their Regions — every Temple starts built.</li>" +
          "<li>Place the base level of the <b>Zeus, Hermes and Athena</b> Monuments in their Regions, with the God's Artifacts next to them.</li>" +
          "<li>Place the <b>3 Kronos Quest cards</b> in the Quest Slots (they have no tokens or rewards).</li>" +
          "<li><b>Not used in this mode:</b> Neutral Artifacts, Monster Artifacts, and Events.</li></ul>",
        src: "Kronos p.2" },
      { when: (c) => c.mode === "kronos", exp: "kronos",
        t: "The Kronos player",
        d: "<ul><li>Set up the <b>Kronos board</b>: an Attribute token on the first space of <b>Might, Anger and Authority</b> (Kronos uses the Atlantis 5th-player tokens).</li>" +
          "<li>Place the <b>Anger Points counter</b> on <b>10</b> with 2 Heroes, or <b>11</b> with 3.</li>" +
          "<li>Give the Kronos player the face-up <b>Kronos Wrath</b> card; they choose <b>3 more Chain cards</b>, placed face down beside it.</li>" +
          "<li>Kronos places his miniature in <b>Locris, Euboea, or Messenia</b>, and sets that Land's Population Attitude to <b>Hostile</b>.</li>" +
          "<li>The Kronos player shuffles the <b>Kronos Order deck</b> and draws 3 (hand limit 5).</li></ul>",
        src: "Kronos p.2–3" },
      { when: (c) => c.mode === "kronos", exp: "kronos",
        t: "The Hero players",
        d: "<ul><li>Each Hero player picks a Hero and covers its printed ability with one of the nine <b>Hero Special Ability tokens</b> (starting bonuses are ignored entirely in this mode).</li>" +
          "<li>Each places their Hero in a Region of their choice with <b>3 Hoplites</b> (2 Heroes in play) or <b>2 Hoplites</b> (3 Heroes).</li>" +
          "<li>The first Hero player takes the <b>Current Player token</b>. <b>Kronos always takes the first Turn</b>, and takes a Turn after every Hero's Turn.</li>" +
          "<li><i>1 vs 1:</i> one player is Kronos, the other controls two Heroes.</li></ul>",
        src: "Kronos p.3" }
    ]
  },
  {
    title: "Solo Campaign Setup",
    steps: [
      { when: (c) => c.mode === "solo", exp: "solo",
        t: "General setup — the Persian Invasion",
        d: "<ul><li>Use the <b>solo map</b> on the back of the board. Place the three <b>fully built</b> Monuments (Zeus, Athena, Hermes) on their spaces, with their God's Artifacts beside the map. Place the <b>Oracle of Delphi</b> in Phocis and <b>6 Temples</b> on the Temple track.</li>" +
          "<li>Use only the cards bearing the <b>single-player symbol</b> from the Combat, Blessing and Artifact decks. Separate the Quest cards from the Events deck (exclude <b>Capture Cretan Bull</b>); set out Monsters and Trays (exclude <b>Chimera</b>).</li>" +
          "<li>You play <b>Achilles</b> (blue ring, blue Hoplites/Priests/Control Tokens, 3 Attribute tokens). <b>Yellow</b> pieces are your Allies; <b>green</b> Hoplites are Persians (each worth 2 strength) and green Priests are <b>Xerxes' Spies</b>.</li>" +
          "<li>Set up <b>Xerxes' board</b>: green tokens on the first spaces of the Invasion and Mobilization tracks; four Spies on Command Track slots 2–5.</li>" +
          "<li>Shuffle all <b>24 Used Action Tokens</b> face down into a pile — they are the campaign's clock and are never returned.</li>" +
          "<li>Set the Glory Tokens to <b>Neutral</b> on every Land's Population Attitude track. Events (other than the selected Quests), Chimera, the other Heroes, red pieces and Temple Cards are not used.</li></ul>",
        src: "Solo Campaign p.2" },
      { when: (c) => c.mode === "solo", exp: "solo",
        t: "Prologue",
        d: "<ul><li>Place <b>2 Persian Hoplites</b> in Chalkidiki; set the Invasion and Mobilization markers to 0.</li>" +
          "<li>Place a blue Control Token in <b>Laconia</b> and a yellow one in <b>Messenia</b>. Achilles starts in Laconia with <b>2 blue Hoplites</b>. Draw <b>1 Combat Card</b> (yes, you get one — Solo FAQ).</li>" +
          "<li>Draw 2 Used Action Tokens and consult <b>Table A</b> to place two random Monsters (a repeat adds a Persian Hoplite in Chalkidiki instead). Draw 3 more for <b>Table B</b> to select this campaign's Quests (repeats add Persian Hoplites). Remove the drawn tokens from the game.</li></ul>",
        src: "Solo Campaign p.5 · Solo FAQ" }
    ]
  },
  {
    title: "Begin Play",
    steps: [
      { when: (c) => c.mode === "standard", exp: "base",
        t: "Start the first Turn",
        d: "<ul><li>The last player who placed their Hero begins; turns proceed <b>clockwise</b>.</li><li>On your Turn: any <b>Regular Actions</b> (each at most once), then exactly one <b>Special Action</b>.</li></ul>",
        src: "Base p.8–9" },
      { when: (c) => c.mode === "kronos", exp: "kronos",
        t: "Start — Kronos moves first",
        d: "<ul><li>The Kronos player takes the first Turn, then Turns alternate: Kronos → Hero 1 → Kronos → Hero 2 → …</li></ul>",
        src: "Kronos p.3" },
      { when: (c) => c.mode === "solo", exp: "solo",
        t: "Start Act I",
        d: "<ul><li>Each Turn: <b>Player Phase</b> (4 Regular Actions + 1 Special Action) then <b>Events Phase</b> — flip the Used Action Token you just spent and read the matching numbered <b>Script</b> for the current Act.</li></ul>",
        src: "Solo Campaign p.3" }
    ]
  }
];

/* =============================================================================
   RULES REFERENCE
   ============================================================================= */
LH.reference = [
  {
    title: "Victory Conditions",
    when: (c) => c.mode === "standard",
    html: (c) => "<ul><li><b>Warlord of Hellas:</b> control <b>2 Lands</b> (a Land = all Regions of one color). 3 players: the blue Land doesn't count. 2 players: you need <b>3</b> Lands.</li>" +
      "<li><b>Favored of the Gods:</b> control <b>5 Regions with Temples</b>" + (c.p >= 5 ? " (the Factory counts as a Temple)" : "") + ".</li>" +
      "<li><b>Monster Slayer:</b> slay <b>3 Monsters</b>.</li>" +
      "<li><b>King of Kings:</b> when the <b>first</b> Monument is fully built, its builder takes the Monument Activation Card with 3 of their Used Action Tokens on it; each of their Special Actions removes one. When the last comes off, whoever controls that Monument's Region <b>wins</b>. Only the first-completed Monument counts; ignored in 2-player games (FAQ).</li>" +
      (c.mod("atlasO") ? "<li><b>Atlas: Overload (additional):</b> when the Overload token reaches 0 the game ends immediately — most Hoplites on the Atlas Monument wins (ties go to the Atlas Bonus token holder).</li>" : "") +
      "<li>The game <b>ends immediately</b> when any player meets a condition — all conditions stay live all game.</li></ul>",
    src: (c) => c.mod("atlasO") ? "Base p.5 · Atlas p.3 · FAQ" : "Base p.5 · FAQ"
  },
  {
    title: "Your Turn — Regular Actions",
    when: (c) => c.mode !== "solo",
    html: (c) => "<ul><li>Take any of these, in any order, <b>each at most once</b> per Turn; then end with one Special Action.</li>" +
      "<li><b>Use Artifacts:</b> use any number of your charged Artifacts <b>at once</b> (one Regular Action — you can't split them around other actions). Used Artifacts recharge when anyone performs Build Monument.</li>" +
      "<li><b>Hoplite Movement:</b> move up to <b>Leadership</b> Hoplites, each one Region (no Hoplite moves twice). You may <b>Fortify</b> one Hoplite in each controlled City/Sparta (+1/+2 Army Strength defending there; one Fortified Hoplite per City — FAQ; Fortified die last). Entering a Region with enemy Hoplites starts a <b>Battle</b>; entering an enemy-controlled but empty Region takes control with even 1 Hoplite. Resolve all moves, then fight Battles in the order the mover chooses.</li>" +
      "<li><b>Hero Movement:</b> move your Hero up to <b>Speed</b> Regions — Heroes ignore Hoplites, enemy Heroes and Monsters, but can't act in Regions they pass through. Ending on a Quest Token may start the <b>Quest</b>; on a Quest you move 1 Quest Step per turn instead.</li>" +
      "<li><b>Prayer:</b> send 1 Priest (max 1 per Turn) from your Priest Pool to any Monument with a free spot: permanently raise that God's <b>Attribute</b> by 1 and use the <b>God Power</b> of the Monument's current level. The Priest stays until the next Build Monument.</li>" +
      (c.mod("hades") ? "<li><b>Resurrection (Hades):</b> take up to <b>Raise</b> of your Hoplites from the Underworld board and place them in a Region with a <b>Gate of Hades</b> (this can start a Battle) or your supply.</li>" : "") +
      (c.mod("apolloM") ? "<li><b>Muse Movement (Apollo):</b> move your Muse up to your Hero's Speed.</li>" : "") +
      (c.p >= 5 ? "<li><b>Talos (Atlantis):</b> the Inner Circle's controller may take 1 extra Talos Regular Action — move Talos 1 Region or use its Region Attack.</li>" : "") +
      (c.mod("orichalkum") ? "<li><b>Orichalkum (start of Turn):</b> spend tokens to recharge that many Artifacts, or pay a face-up <b>Construct</b> card's cost to use it (once ever; refilled to 3 in the Event Phase).</li>" : "") +
      (c.mod("opportunity") ? "<li><b>Opportunity (start of Turn):</b> you may use the face-up Opportunity card on the Events deck, then draw a new Event card. Unused Opportunities are discarded at the next Event Phase.</li>" : "") + "</ul>",
    src: (c) => {
      const s = ["Base p.9 · FAQ"];
      if (c.mod("hades")) s.push("Dark Ages p.4");
      if (c.mod("apolloM")) s.push("Apollo p.4");
      if (c.p >= 5) s.push("Dark Ages p.3");
      if (c.mod("orichalkum") || c.mod("opportunity")) s.push("Dark Ages p.4, p.7");
      return s.join(" · ");
    }
  },
  {
    title: "Special Actions",
    when: (c) => c.mode !== "solo",
    html: (c) => "<ul><li>End your Turn with <b>one</b> Special Action and cover it with a Used Action Token — it stays locked until anyone performs <b>Build Monument</b>.</li>" +
      "<li><b>Recruit:</b> up to 2 Hoplites in every controlled City Region (4 in Sparta" + (c.p === 6 ? "; Troy's controller may also Recruit 1 in each controlled Troad Region" : "") + "); one may arrive already Fortified. 15 Hoplites per player, ever — none may be removed to re-place.</li>" +
      "<li><b>March:</b> move any number of Hoplites from one Region to one neighboring Region (even Hoplites that already moved; not Fortified ones).</li>" +
      "<li><b>Build Temple:</b> in a controlled Region with a Shrine — place a Temple and add 1 Priest to your pool (max 4 Priests). The <b>Oracle of Delphi</b> grants the Temple Card's extra reward. A red <b>“Draft”</b> frame under the Temple slot triggers a Blessing Draft.</li>" +
      "<li><b>Prepare:</b> choose any two (repeats allowed): heal 1 Injury · draw a Combat Card · recruit 1 Hoplite where your Hero stands (not while on a Quest, and not into a Region with enemy Hoplites — but an empty enemy Region works and flips control).</li>" +
      "<li><b>Usurp:</b> with the Glory Token matching your Hero's Region's Land: take control instantly, recruit 1 Hoplite (may be Fortified), enemy Hoplites withdraw with no losses. You keep the Glory Token.</li>" +
      "<li><b>Hunt:</b> fight a Monster sharing your Hero's Region (see Hunts).</li>" +
      "<li><b>Build Monument:</b> add a level to <b>any</b> Monument (ownership irrelevant — FAQ). All Priests leave all Monuments to their owners' supplies (not pools); <b>you</b> gain 1 Priest per Temple you control (Oracle counts). Then everyone removes Used Action Tokens and recharges Artifacts, and you run the <b>Monster Phase</b> and <b>Event Phase</b>. Usable even with other actions still open. In a <b>2-player game</b>, first repeat one of your used Special Actions.</li></ul>",
    src: (c) => c.p === 6 ? "Base p.10, p.15 · City of Steel p.3 · FAQ" : "Base p.10, p.15 · FAQ"
  },
  {
    title: "Monster Phase & Event Phase",
    when: (c) => c.mode === "standard",
    html: (c) => "<ul><li><b>Monster Phase</b> (run by the Build Monument player): roll the Monster Die for each Monster on the map, in an order of their choosing — <b>Nothing</b> / <b>Region Attack</b> (per its Tray) / <b>Move</b> (roller picks the adjacent Region) / <b>Move or Action</b> (roller decides). The roller makes any extra decisions.</li>" +
      "<li><b>Event Phase:</b> draw 1 Event card. <b>Quest:</b> goes to a free Quest Slot with its token (discard if all 3 slots are full). <b>Monster:</b> if it's on the map it <b>Evolves</b> (permanently, until slain); if unslain and absent, it spawns in the shown Region; if slain, discard and draw again. A Monster can Evolve twice only if it was out from the start of the game (FAQ).</li>" +
      (c.mod("opportunity") ? "<li><b>Opportunity cards</b> drawn here sit face up on the Events deck until someone uses one at the start of their Turn (drawing a replacement Event), or it's discarded at the next Event Phase.</li>" : "") +
      (c.mod("chiron") ? "<li><b>Chiron</b> arrives like a Monster; when he appears, place a <b>Training Card</b> on the first free Quest slot (bumping a Hero-less Quest if needed). Completed Trainings are permanent Combat-Card-like cards, recharged like Artifacts; if Chiron is killed, discard the current Training card.</li>" : "") +
      (c.mod("orichalkum") ? "<li><b>Constructs:</b> refill the face-up Construct offer to 3 during the Event Phase.</li>" : "") +
      (c.mod("hephaestus") ? "<li><b>Relics:</b> refill the face-up Relic offer to 3 during the Event Phase (the Lightning deck is always available).</li>" : "") + "</ul>",
    src: (c) => {
      const s = ["Base p.11 · FAQ"];
      if (c.mod("opportunity") || c.mod("chiron") || c.mod("orichalkum")) s.push("Dark Ages p.4, p.7");
      if (c.mod("hephaestus")) s.push("Dark Ages p.5");
      return s.join(" · ");
    }
  },
  {
    title: "Battles",
    when: () => true,
    html: (c) => "<ul><li>A Battle starts whenever two players' Hoplites share a Region; all Hoplites there fight. The defender may play one Combat Card (resolve its effect, add its Strength), then the attacker, alternating until both pass (passing is final).</li>" +
      "<li><b>Army Strength</b> = 1 per Hoplite + played card values + Fortification (+1 City / +2 Sparta) + Blessings, Artifacts and Hero abilities" + (c.mod("poseidon") ? " + your <b>Fleet</b> value in Port Regions (capped by your Hoplites in the Battle)" : "") + ". Highest wins; <b>defender wins ties</b>.</li>" +
      "<li><b>Casualty symbols</b> on cards you played kill that many of <b>your own</b> Hoplites after the Battle (you can't play cards whose total Casualties exceed your Hoplites in the fight).</li>" +
      "<li>The loser kills one extra Hoplite and <b>withdraws</b> together to one neighboring Region without enemy presence (attacker: back where they came from); if impossible, all die. Fortified Hoplites die last. The winner takes control; an attacker left with no Hoplites (<b>Pyrrhic victory</b>) doesn't.</li>" +
      "<li><b>Hand limit:</b> 4 Combat Cards (unlimited during a Hunt; trim to 4 right after).</li>" +
      "<li>Heroes never fight Battles alone — they only add bonuses (FAQ).</li>" +
      (c.mod("hades") ? "<li><b>Warriors of Hades:</b> join any Army of their Region's controller (+1 Strength each, move freely with it, kill 1 enemy Hoplite before the Battle when attacking, raise Population Strength by 1, can't die, always stay in the Battle Region).</li>" : "") +
      (c.mod("atlasH") ? "<li><b>Golden Apples:</b> once per Battle, spend 1 Apple instead of playing a Combat Card for +1 Army Strength.</li>" : "") + "</ul>",
    src: (c) => {
      const s = ["Base p.13 · FAQ"];
      if (c.mod("poseidon")) s.push("Dark Ages p.2");
      if (c.mod("hades")) s.push("Dark Ages p.4");
      if (c.mod("atlasH")) s.push("Atlas p.4");
      return s.join(" · ");
    }
  },
  {
    title: "Hunts, Monsters & Injuries",
    when: () => true,
    html: (c) => "<ul><li>Use the <b>Hunt</b> Special Action with your Hero in the Monster's Region; draw Combat Cards equal to your <b>Strength</b>.</li>" +
      "<li><b>1. Hero attacks:</b> discard Combat Cards matching the Monster Tray's <b>Wound symbols</b> to place Wound markers — you must inflict at least one or the Hunt ends. Multiple Wounds (even a one-round kill) are allowed.</li>" +
      "<li><b>2. Monster attacks:</b> the player to your left draws two Monster Attack cards and picks one" + (c.mode === "solo" ? " (solo: draw the top card)" : "") + ". <b>Defend</b> — play Combat Cards totalling at least the attack value, then draw 2 Combat Cards — or <b>take it</b> (resolve the card, draw 1). Repeat from step 1.</li>" +
      "<li><b>Injuries</b> flip an Attribute token to value 1 until healed (Prepare, or Artifacts like Ambrosia). A fourth Injury ends the Hunt; an unsuccessful Hunt adds one more Injury. You may also end your own Hunt voluntarily (FAQ).</li>" +
      "<li><b>Wounds stay</b> on the Monster for the next hunter.</li>" +
      "<li><b>Rewards:</b> slaying = a <b>Glory Token</b> of the Land (stolen from its holder if needed), the Monster miniature (3 = victory), and <b>one</b> reward: the Monster's Artifact <i>or</i> a Priest/Neutral-Artifact from a marked Wound you dealt this Hunt. Failing still pays one marked-Wound reward. Killing a Monster with a Blessing/Artifact outside a Hunt gives only the Glory Token and the miniature.</li></ul>",
    src: () => "Base p.12–13 · FAQ"
  },
  {
    title: "Quests, Blessings, Artifacts & Glory",
    when: (c) => c.mode !== "kronos",
    html: (c) => "<ul><li><b>Quests:</b> end a Hero Movement on the Quest Token meeting any <b>Step's</b> requirement (requirements matter only for starting — FAQ) to board the Quest card. Each later turn, move 1 Step instead of moving your Hero (you can't abandon it; you're not “in” any Region while questing). Reaching Step 3 completes it: return to the token's Region (no move this turn), take the reward, the Land's <b>Glory Token</b>, and remove the token. Rivals can hop on at a higher Step and beat you to it.</li>" +
      "<li><b>Blessings:</b> a “Draft” Temple slot triggers a draft — builder draws players+1 cards, keeps one, passes right. Permanent, public.</li>" +
      "<li><b>Artifacts:</b> permanent, public, one use per charge; recharge on every Build Monument. <b>God's Artifacts</b> follow control of their Monument's Region (arriving charged). Timed Artifacts may be used outside your Use Artifacts action when their timing says so (FAQ).</li>" +
      "<li><b>Glory Tokens</b> are stealable prizes (slaying that Land's Monster or questing there takes it from a rival) and fuel <b>Usurp</b>.</li>" +
      (c.mod("armyupgrade") ? "<li><b>Army Upgrades:</b> upgrade during a Blessing Draft (instead of taking a card) or after any Build Monument (most Cities controlled; Sparta/Troy count double; ties share). First upgrade must be the top option; max 2 per game.</li>" : "") +
      (c.mod("hephaestus") ? "<li><b>Relics (Hephaestus):</b> Pray at the Hephaestus Monument to <b>Reforge</b> — discard a Combat Card with the matching symbol for its Relic. Relics fight like Combat Cards but stay with you, recharging like Artifacts (they aren't Artifacts and don't count against the hand limit). <b>Lightning</b> Relics need no discard, are one-shot, and you may hold only one.</li>" : "") +
      (c.mod("apolloM") ? "<li><b>Muses (Apollo):</b> Praying at Apollo's Monument picks one of the two face-up Muse cards; your Muse enters at your Hero's Region (1 Muse, 1 card max). Each Muse has a Land-wide power, and in your Muse's Region you may <b>Usurp without a Glory Token</b> (removing the Muse; not against a player holding that Land's Glory Token).</li>" : "") +
      (c.mod("atlasH") ? "<li><b>Golden Apples (Atlas):</b> send a Hoplite from a Port Region to Atlas during Hoplite Movement for 1 Apple; each Build Monument pays 1 Apple to everyone with a Hoplite on Atlas (+1 to the biggest garrison, no tie bonus), then clears the Hoplites. Spend at the start of your Turn: heal 1 Injury, or +1 to an Attribute for the turn.</li>" : "") +
      (c.mod("atlasO") ? "<li><b>Overload (Atlas):</b> each Build Monument: send up to 1 Hoplite per Port Region to Atlas (in Port-number order), award the <b>Atlas Bonus token</b> (+1 to an Attribute) to the biggest garrison, then draw 2 Combat Cards and advance the Overload token by their total minus 1 per Hoplite on Atlas (never backward). A Hero ending a move at Atlas may leave the board to pull the token back by their Strength (returning after the next Build Monument).</li>" : "") + "</ul>",
    src: (c) => {
      const s = ["Base p.14–15 · FAQ"];
      if (c.mod("armyupgrade")) s.push("City of Steel p.4");
      if (c.mod("hephaestus")) s.push("Dark Ages p.5");
      if (c.mod("apolloM")) s.push("Apollo p.3–4");
      if (c.mod("atlasO") || c.mod("atlasH")) s.push("Atlas p.3–4");
      return s.join(" · ");
    }
  },
  {
    title: "God Powers at the Monuments",
    when: (c) => c.mode === "standard",
    html: (c) => {
      let d = "<ul><li>Praying uses the God Power of the Monument's <b>current level</b> and permanently raises that God's related <b>Hero Attribute</b> by 1 — all God Powers and their Attributes are listed on your <b>Help Tray</b>.</li>" +
        "<li>The FAQ confirms the base gods' powers: <b>Zeus</b> (level 2+) draws Combat Cards; <b>Athena</b> (level 2+) Recruits Hoplites (normal Recruit rules — they may arrive Fortified); <b>Hermes</b> (level 2+) moves an Army — real movement, not teleport: it triggers Battles and Monster effects along the way, and you choose how many Hoplites move.</li>";
      if (c.mod("poseidon") || c.mod("poseidonS")) d += "<li><b>Poseidon</b> (each Prayer also raises Fleet in the full expansion): levels II–V additionally Recruit Hoplites in one controlled <b>Port</b> Region (amounts per the Help card).</li>";
      if (c.mod("hades") || c.mod("hadesS")) d += "<li><b>Hades:</b> deal Wounds to a chosen Monster — level II deals one Wound of a shown type, III one Wound of either of two types, IV–V both Wounds (per the Help card).</li>";
      if (c.mod("hephaestus") || c.mod("hephaestusS")) d += "<li><b>Hephaestus:</b> Reforge a Combat Card at every level; levels II–V also draw 1–3 Artifact cards, keeping and using one.</li>";
      if (c.mod("apolloM") || c.mod("apolloS")) d += "<li><b>Apollo:</b> draw a Muse in your Hero's Region; levels II–V also choose 1–3 times between healing an Injury and killing a Hoplite on the board.</li>";
      if (c.mod("poseidonS") || c.mod("hadesS") || c.mod("hephaestusS") || c.mod("apolloS")) d += "<li><b>Simple modes</b> use the <b>gray-corner</b> side of their god's Help card for the exact powers at each level.</li>";
      return d + "<li>A Priest occupies a Monument spot until the next Build Monument; no free spot, no Prayer there.</li></ul>";
    },
    src: (c) => {
      const s = ["Base p.9"];
      if (c.mod("poseidon") || c.mod("poseidonS") || c.mod("hades") || c.mod("hadesS")) s.push("Dark Ages p.2, p.4");
      if (c.mod("hephaestus") || c.mod("hephaestusS")) s.push("Dark Ages p.5");
      if (c.mod("apolloM") || c.mod("apolloS")) s.push("Apollo p.2");
      return s.join(" · ");
    }
  },
  {
    title: "Poseidon — Ports & the Fleet",
    when: (c) => c.mode === "standard" && (c.mod("poseidon") || c.mod("poseidonS")),
    html: (c) => "<ul><li><b>Port Regions</b> are all connected to each other — but: Monsters can't move Port-to-Port; Hoplite Movement can't use Ports; <b>Hero Movement, March and Hermes' God Power</b> can (each Port hop counts as 1 Region).</li>" +
      (c.mod("poseidon") ? "<li><b>Fleet</b> (a 5th basic Attribute, max 5): add your Fleet value to your Army Strength in any Battle in a Port Region — capped by the number of your Hoplites in that Battle.</li>" : "<li><i>Simple mode:</i> Ports are in play, but the Fleet Attribute is not used.</li>") + "</ul>",
    src: () => "Dark Ages p.2"
  },
  {
    title: "Hades — the Underworld",
    when: (c) => c.mode === "standard" && c.mod("hades"),
    html: () => "<ul><li>All killed Hoplites (any cause) go to the <b>Underworld board</b>.</li>" +
      "<li><b>Raise</b> (a 5th basic Attribute, max 5) powers the <b>Resurrection</b> Regular Action: return up to Raise Hoplites from the Underworld to a Region with a <b>Gate of Hades</b> (Battles allowed) or to your supply.</li>" +
      "<li><b>Warriors of Hades</b> are not Hoplites: they can't die, aren't affected by Hoplite effects, add +1 Population Strength to their Region, and fight for whoever controls their Region (+1 Strength; attacking armies with one kill an enemy Hoplite pre-Battle; they never withdraw).</li></ul>",
    src: () => "Dark Ages p.4"
  },
  {
    title: "Atlantis, Talos & the Factory (5–6 players)",
    when: (c) => c.mode === "standard" && c.p >= 5,
    html: (c) => "<ul><li><b>Atlantis</b> (5th player) requires Poseidon; <b>City of Steel</b> (6th) requires both. New Sea Trails link the side boards to the main map, both ways.</li>" +
      "<li><b>The Factory:</b> the Inner Circle's controller may Build Temple there. It counts as a Temple (Priests, Favored of the Gods) — and puts <b>Talos</b> into play in the Inner Circle.</li>" +
      "<li><b>Talos</b> is a Monster controlled by whoever holds the Inner Circle: its controller can't Hunt it, gets a <b>Talos Regular Action</b> each turn (move 1 Region or Region Attack), and in each Monster Phase takes another Talos action instead of rolling for it. Its slayer may use <b>any level of any Monument</b>, even unbuilt.</li>" +
      "<li><b>Cleito</b> (Atlantis Hero): starts with 1 Priest; may heal 1 Injury instead of Hero Movement. <b>Hector</b> (City of Steel): starts with 2 Leadership; his Fortified Hoplites get an extra +1.</li>" +
      (c.p === 6 ? "<li><b>Troy:</b> its controller holds 5 Combat Cards, Recruits 1 per controlled Troad Region, and all Hoplites in Troy count as Fortified.</li>" : "") + "</ul>",
    src: (c) => c.p === 6 ? "Dark Ages p.3 · City of Steel p.2–3" : "Dark Ages p.3"
  },
  {
    title: "Kronos Rebellion — How It Plays",
    when: (c) => c.mode === "kronos",
    html: () => "<ul><li><b>Kronos wins</b> by setting Population Attitude to Hostile in 5 Lands, or destroying all 3 Monuments. <b>Heroes win</b> by killing Kronos, controlling 3 Lands, or killing every Monster (after completing “Closing of Tartar Gates”).</li>" +
      "<li><b>Kronos' Turn:</b> one Action paid in <b>Anger Points</b> — Monster Movement (1: move Authority-many Monsters 1 Region), Region Attack (2 or 3 by Monster; +1 kill per Attitude level below Neutral), Terror (1 + 1 per 2 Hoplites in the Land: drop the Land's Attitude and strip Control Tokens from Hoplite-less Regions), Destroy Temple (4: remove a Temple where a Monster stands unopposed — Kronos raises an Attribute; Temples can't be rebuilt), Play Order Card (0/2: spawn or command Monsters). The <b>Kronos Wrath</b> card allows a second Action.</li>" +
      "<li><b>Attributes:</b> Might (added to Kronos' Monster Attack cards), Anger (Anger Points gained per Build Monument), Authority (Monsters moved per Monster Movement).</li>" +
      "<li><b>Chains:</b> broken by raising an Attribute to 3, or by holding 8+ Anger at a Build Monument (resetting Anger). Broken Chains reveal Active/Passive powers — and add their Wound symbols to Kronos. Breaking the last Chain unlocks the <b>Final Actions</b> (Kronos Movement/Terror/Destroy Monument, cost 4).</li>" +
      "<li><b>Hunting Kronos:</b> only after the “Blessing of Rea” Quest. He starts at 8 Wound symbols (board + Wrath card); dealing all Wounds on a Broken Chain card destroys it and its powers. His special attack ends the Hunt, deals 1 Injury and teleports the Hero anywhere. He's immune to Monster-targeting abilities.</li>" +
      "<li><b>Hero changes:</b> no Build Temple action; Hoplites of different Heroes coexist (never combine for control); Hunt rewards shift Population Attitude and draw Blessings (a drawn Blessing may be discarded for a Priest); Build Monument skips Monster/Event Phases — instead Kronos gains Anger, may Break a Chain at 8+, draws Orders, and refreshes Chains. Only God's Artifacts exist. Destroying the Oracle lets Kronos drop any Attitude one step.</li></ul>",
    src: () => "Kronos p.2–4"
  },
  {
    title: "Solo Campaign — the Persian Invasion",
    when: (c) => c.mode === "solo",
    html: () => "<ul><li><b>Two Acts:</b> gather allies and stall the vanguard in Act I; face Xerxes' full invasion in Act II. Your 24 Used Action Tokens are the clock — each Special Action flips one and triggers its numbered <b>Script</b>.</li>" +
      "<li><b>Armies:</b> blue = your Spartans, yellow = Allies (command them normally), green = Persians — each green Hoplite counts as <b>2</b> (strength and Population Strength).</li>" +
      "<li><b>Actions:</b> Build Monument is replaced by <b>Pass</b> (clear your Used Action Tokens and recharge Artifacts — but Priests stay on Monuments and you gain none). Recruit yields 1 Hoplite per City (2 in Sparta), colored by the Region's Control Token; Prepare recruits yellow. No Blessing Drafts — Blessings come from slaying Monsters. You can't Usurp the northernmost Land.</li>" +
      "<li><b>Battles vs Persia:</b> field armies add 2 Strength per green Hoplite; conquered Regions (green Control Token) defend at the <b>Persian Invasion Track</b> value. Persian card draws equal their <b>Command</b> value — highest value counts, effects ignored. Draws favor the defender. You can't retreat into Persian Regions.</li>" +
      "<li><b>Population Attitude</b> per Land: quests and monster-slaying move it up (at Neutral you claim the Glory Token; a second claim flips the Land's yellow tokens to blue); Monster terror and Persian meddling move it down (at Hostile you strip your yellow tokens).</li>" +
      "<li><b>Monsters</b> never touch Persians; their Region Attacks simply kill 1 Hoplite. Slaying one lets you pick 1 of 2 Blessings and raise Attitude.</li>" +
      "<li><b>Win:</b> Victory Counter reaches 0 (Act II), survive the last token with more Regions than Persia, or remove every Persian Control Token. <b>Lose:</b> Persians control 2 full Lands, a Monument is destroyed, or their 13th Control Token is placed.</li></ul>",
    src: () => "Solo Campaign p.2–5, p.11 · Solo FAQ"
  },
  {
    title: "Key Rulings — FAQ v1.0",
    when: (c) => c.mode !== "solo",
    html: (c) => "<ul><li><b>Control:</b> taking a neutral Region needs Hoplites ≥ its Population Strength (any movement does it; Heroes don't count); taking an enemy's <b>empty</b> Region needs just 1 Hoplite, ignoring Population Strength.</li>" +
      "<li><b>Fortify:</b> 1 Hoplite per City; not in the same action that moved it in (March or a later action can).</li>" +
      "<li><b>King of Kings:</b> only the first-completed Monument counts; the countdown's end crowns whoever controls that Region first, even later; the Activation Card never changes hands; a token comes off even for free Build Monuments.</li>" +
      "<li><b>Hunts:</b> shuffle the Monster Attack deck for each new Hunt; you may play multiple Combat Cards per round and end your own Hunt voluntarily; one reward per Hunt (plus Glory and the miniature when slaying).</li>" +
      "<li><b>Quests:</b> Step requirements apply only when boarding; questing Heroes aren't in any Region (no Prepare-recruit, no Usurp); Priests spent for Quests must come from your <b>pool</b> — not from Monuments; two Heroes can share a Quest Step.</li>" +
      "<li><b>Battles:</b> a second Battle can happen in the same Region if a different action triggers it; if Blessings kill the last enemy Hoplite first, no Battle happens; Phalanx counts only your own Hoplites.</li>" +
      "<li><b>Hermes' God Power</b> is real movement, not teleport — it triggers Battles and Monster effects along the way, and you choose how many Hoplites move.</li>" +
      "<li><b>Timing duels</b> (e.g. Harpe vs Caduceus): the active player decides who resolves first.</li>" +
      "<li><b>Blessings</b> like Shoot to Kill, Exile and Hero's Wrath work once, and only on your own Turn.</li></ul>",
    src: () => "FAQ v1.0 (2018-03-27)"
  }
];

/* =============================================================================
   TEACHING SCRIPT
   ============================================================================= */
LH.teach = {
  intro: "A ~5-minute teach for the exact sets and mode selected above. Read it aloud, or hit Copy and tweak. Rules content is drawn from the rulebooks and FAQs cited in the setup steps.",
  sections: [
    {
      h: "The hook — and how you win",
      body: (c) => c.mode === "kronos"
        ? "<p>The titan <b>Kronos</b> has stirred beneath Hellas — and one of us is playing him. Kronos wins by turning <b>five Lands hostile</b> or smashing all <b>three Monuments</b>; the rest of us are Heroes who win by <b>killing Kronos</b>, controlling <b>three Lands</b>, or — after closing the Tartar Gates — slaying <b>every monster</b> he commands. It's asymmetric and it's a knife fight: the titan grows stronger with every Temple he burns.</p>"
        : c.mode === "solo"
        ? "<p>This is the <b>Persian Invasion</b> — a two-act solo campaign. You are Achilles: in Act I you rally allies and slow Xerxes' vanguard; in Act II the Great King himself lands with the largest army the ancient world has seen. Your clock is a bag of 24 tokens — every action you take flips one and triggers a story <b>Script</b>. Win by driving the invasion counter to zero, outlasting the clock with more of Greece than Persia holds, or throwing every Persian banner into the sea.</p>"
        : "<p>Strange gods have descended on Bronze-Age Greece, and we are the Heroes carving up what's left. The twist: there are <b>four ways to win, and the first to any of them ends the game instantly</b> — control <b>2 Lands</b> (" + (c.p === 2 ? "3 in our two-player game" : "whole color groups of regions") + "), control <b>5 Temples</b>, slay <b>3 Monsters</b>, or hold the Region of the first finished <b>Monument</b> when its countdown ends. Every rival is racing a different clock, so watch what everyone is building toward — the game is won by the player nobody blocked.</p>"
    },
    {
      h: "The shape of a turn",
      body: (c) => c.mode === "kronos"
        ? "<p>Kronos moves <b>first and between every Hero's turn</b>, spending <b>Anger Points</b> on one action — marching monsters, region attacks, terror, burning Temples, or playing Order cards. Heroes play normal turns: Regular Actions, then one Special Action. Every time a Hero builds a Monument level, Kronos feeds on it — gaining Anger and possibly <b>breaking a Chain</b>, which unlocks new powers but also exposes more of him to your blades.</p>"
        : "<p>On your turn you take any of your <b>Regular Actions</b> — each once: move your <b>Hero</b> (Speed), move <b>Hoplites</b> (Leadership), send a <b>Priest to pray</b>, use your Artifacts" + (c.mod("hades") ? ", resurrect the dead" : "") + " — then end with exactly one <b>Special Action</b>, which locks behind a token until someone performs <b>Build Monument</b>. That's the engine of the whole game: actions run out, and the player who builds a Monument level resets everyone… while feeding the endgame.</p>"
    },
    { when: (c) => c.mode !== "kronos",
      h: "Your Hero and your army",
      body: (c) => "<p>Your Hero has three Attributes: <b>Leadership</b> moves Hoplites, <b>Speed</b> moves the Hero, <b>Strength</b> draws Combat Cards for monster hunts" + (c.mod("poseidon") ? ", plus <b>Fleet</b> for sea battles" : "") + (c.mod("hades") ? ", plus <b>Raise</b> for resurrection" : "") + ". The only way to grow them is <b>Prayer</b>: park a Priest at a Monument, permanently raise that god's Attribute, and fire the god's power at the Monument's current level. Priests come from building <b>Temples</b> — so the temple game and the hero game are the same game.</p>" +
        "<p>Your <b>Hoplites</b> hold Regions: match a Region's Population Strength to control it, or slip one soldier into an enemy Region left unguarded. Cities recruit; <b>Sparta</b> recruits double and fortifies harder.</p>" },
    { when: (c) => c.mode !== "kronos",
      h: "Battles and hunts",
      body: (c) => "<p><b>Battles</b> are quick and mean: 1 Strength per Hoplite, then alternate Combat Cards until both sides pass — defender wins ties, big cards kill your own troops as <b>Casualties</b>, and the loser retreats and bleeds one extra. <b>Hunts</b> are your monster-slaying mini-game: draw cards equal to Strength, match the <b>Wound symbols</b> on the beast's tray, survive its counterattacks. Even failed hunts can pay, wounds persist between hunters — and the killing blow steals the <b>Glory Token</b>, which fuels <b>Usurp</b>: flipping a whole Region to you without a fight.</p>" },
    { when: (c) => c.mode === "standard",
      h: "The Build Monument clock",
      body: () => "<p>One Special Action rules them all: <b>Build Monument</b>. It adds a level to any Monument (making its god's Prayer stronger), returns everyone's Priests, hands the builder a Priest per Temple they control, unlocks everyone's used actions, recharges Artifacts — and then the <b>monsters move</b> and a new <b>Event</b> lands. When any Monument finishes, a three-turn countdown starts: hold its Region at zero and you're King of Kings. Time your builds; every one of them is a gift to the whole table.</p>" },
    { when: (c) => c.mode === "standard" && (c.mod("poseidon") || c.mod("poseidonS")),
      h: "Poseidon",
      body: (c) => "<p><b>Ports</b> knit the coasts together — Heroes and Marching armies can hop Port-to-Port as one step" + (c.mod("poseidon") ? ", and the new <b>Fleet</b> Attribute adds up to its value to any Battle at a Port (never more than your Hoplites there). Poseidon's Prayer builds Fleet and recruits at the docks" : " (Simple mode: Poseidon replaces Athena, no Fleet rules)") + ".</p>" },
    { when: (c) => c.mode === "standard" && (c.mod("hades") || c.mod("hadesS")),
      h: "Hades",
      body: (c) => c.mod("hades")
        ? "<p>The dead don't leave the game — they go to the <b>Underworld</b>, and the <b>Resurrection</b> action pulls up to your <b>Raise</b> value back out through your <b>Gate of Hades</b>. Everyone also commands a <b>Warrior of Hades</b>: an unkillable giant that fights for whoever controls its Region — +1 strength, and attacking with one executes an enemy Hoplite before the fight. Hades' own Prayer wounds monsters from afar.</p>"
        : "<p>Hades replaces Zeus tonight (Simple mode): no Underworld bookkeeping — his gray-corner Help card lists his powers, built around <b>wounding monsters from afar</b>.</p>" },
    { when: (c) => c.mode === "standard" && (c.mod("hephaestus") || c.mod("hephaestusS")),
      h: "Hephaestus",
      body: (c) => c.mod("hephaestus")
        ? "<p>Pray at the forge to <b>Reforge</b>: trade a Combat Card for its matching <b>Relic</b> — the same card, but permanent, recharging like an Artifact instead of being discarded. <b>Lightning</b> bolts are free to take, one at a time, and thrown away when used. The forge god's higher levels also hand out Artifacts.</p>"
        : "<p>Hephaestus replaces Zeus tonight (Simple mode): the Relic rules stay in the box — his gray-corner Help card lists his simplified forge powers.</p>" },
    { when: (c) => c.mode === "standard" && (c.mod("apolloM") || c.mod("apolloS")),
      h: "Apollo",
      body: (c) => c.mod("apolloM")
        ? "<p>Pray to Apollo and a <b>Muse</b> joins you — a wandering enchantress whose power blankets the whole <b>Land</b> she stands in, from cheaper conquests to stolen Glory. Better yet, in her Region you may <b>Usurp without a Glory Token</b>, burning the Muse. One Muse each, choose from two face-up cards, swap when you pray again.</p>"
        : "<p>Apollo replaces Hermes tonight (Simple mode): no Muse miniatures — his gray-corner Help card lists his powers of healing and harm.</p>" },
    { when: (c) => c.mode === "standard" && (c.mod("atlasO") || c.mod("atlasH")),
      h: "Atlas",
      body: (c) => c.mod("atlasO")
        ? "<p><b>Atlas is buckling.</b> Every Monument built loads his shoulders: two Combat Cards are drawn and their total pushes the <b>Overload track</b> toward zero — minus one for every Hoplite we've sent to prop him up. If it hits zero the game ends <b>immediately</b> and whoever contributed the most Hoplites wins. Heroes can even leave the board to shove the track back. It's a doomsday timer everyone can bribe.</p>"
        : "<p>Atlas holds the <b>Hesperides Garden</b>: ferry Hoplites from Port Regions to his Monument and harvest <b>Golden Apples</b> — spend one for +1 in a Battle, a heal, or a temporary Attribute boost. Fifteen apples, never more; when they're gone, they're gone.</p>" },
    { when: (c) => c.mode === "standard" && c.mod("orichalkum"),
      h: "Orichalkum & Constructs",
      body: () => "<p><b>Orichalkum</b> nuggets sit in every City Region — end your Hero's move on one to pocket it. Spend them at the start of your turn to <b>recharge Artifacts</b> without waiting for a Monument, or to buy one of the three face-up <b>Constructs</b>: one-shot war machines like the Trojan Horse. First come, first served.</p>" },
    { when: (c) => c.mode === "standard" && (c.mod("heroesmonsters") || c.mod("chiron") || c.mod("opportunity") || c.mod("combatcards")),
      h: "Extra content in the box tonight",
      body: (c) => "<ul>" +
        (c.mod("heroesmonsters") ? "<li><b>Heroes & Monsters:</b> Cassandra (extra Blessing peeks) and Odysseus (city infiltrator) join the Hero pool; <b>Typhon</b> and <b>Python</b> prowl the events deck.</li>" : "") +
        (c.mod("chiron") ? "<li><b>Chiron:</b> a centaur who appears like a monster but offers <b>Training Quests</b> — complete one for a permanent combat trick. You can also just kill him. Your call.</li>" : "") +
        (c.mod("opportunity") ? "<li><b>Opportunity cards:</b> face-up offers on the events deck — first player to bite at the start of their turn gets the deal.</li>" : "") +
        (c.mod("combatcards") ? "<li><b>Extra Combat Cards</b> spice the deck — watch for Sudden Strike and Final Charge.</li>" : "") + "</ul>" },
    { when: (c) => c.mode === "standard" && c.mod("armyupgrade"),
      h: "Army Upgrades",
      body: () => "<p>Your army color matters tonight: each has an <b>Upgrade board</b> with unique powers. Earn up to <b>two upgrades</b> — by skipping a pick in a Blessing Draft, or by controlling the most Cities when a Monument gets built (Sparta and Troy count double). Top power first, then choose.</p>" },
    { when: (c) => c.mode === "standard" && c.p >= 5,
      h: (c) => c.p === 6 ? "Atlantis & Troy — six players" : "Atlantis — five players",
      body: (c) => "<p>The map grows: <b>Atlantis</b> floats off the coast, wired to the mainland by sea trails. Its Inner Circle hides the <b>Factory</b> — a buildable Temple that awakens <b>Talos</b>, a bronze colossus obeying whoever holds the Circle. Expect him on your border.</p>" +
        (c.p === 6 ? "<p>And to the east, <b>Troy</b>: its ruler holds five Combat Cards, recruits across the Troad, and every defender inside counts as fortified. The City of Steel is the best castle on the map — and everyone knows it.</p>" : "") },
    {
      h: "Don't worry about these until they come up",
      body: (c) => {
        const items = [];
        if (c.mode === "standard") {
          items.push("<li><b>Individual God Powers</b> — they're on your Help Tray; read them when you pray.</li>");
          items.push("<li><b>Monster trays and evolutions</b> — each beast explains itself when it appears.</li>");
          items.push("<li><b>Exact withdraw rules</b> — loser retreats together to a free neighbor; I'll adjudicate.</li>");
          items.push("<li><b>The 4-card hand limit</b> — it pauses during hunts and snaps back after.</li>");
          if (c.p === 2) items.push("<li><b>Two-player tweaks</b> — 3 Lands to win, no King of Kings, and a bonus repeat action before Build Monument.</li>");
        }
        if (c.mode === "kronos") {
          items.push("<li><b>Kronos' individual Order and Chain cards</b> — read them as they hit the table.</li>");
          items.push("<li><b>Population Attitude tracks</b> — they move when quests, kills and terror say so.</li>");
        }
        if (c.mode === "solo") {
          items.push("<li><b>The Script Book</b> — every flipped token reads you one paragraph; that's the campaign.</li>");
          items.push("<li><b>Spying Phase and Mobilization</b> — the Scripts drive them; just follow along.</li>");
        }
        items.push("<li><b>Quest step requirements</b> — printed on the card; they only matter when you board it.</li>");
        return "<ul>" + items.join("") + "</ul>";
      }
    }
  ]
};
