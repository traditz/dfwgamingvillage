/* =============================================================================
   Anachrony (Essential Edition) — Setup & Reference Utility · data
   All content sourced from the official rulebooks (see citations).
   ============================================================================= */
var AN = {};

AN.expMeta = {
  base:    { name: "Essential",     cls: "tag-base" },
  classic: { name: "Classic Exp.",  cls: "tag-classic" },
  fot:     { name: "Fractures",     cls: "tag-fot" },
  fi:      { name: "Future Imp.",   cls: "tag-fi" },
  solo:    { name: "Solo",          cls: "tag-solo" },
  mod:     { name: "Module",        cls: "tag-mod" }
};

AN.expansions = [
  { id: "base",    short: "Essential Edition",     year: "2019", blurb: "The core game: four Paths, Exosuits, Time Travel and the Impact. Always in play." },
  { id: "classic", short: "Classic Expansion Pack", year: "2020", blurb: "Three modules: Doomsday, Pioneers of New Earth, and Guardians of the Council." },
  { id: "fot",     short: "Fractures of Time",     year: "2020", blurb: "The Path of Unity, the Amethynia Valley, Blinking, Glitches — plus the Variable Anomalies module." },
  { id: "fi",      short: "Future Imperfect",      year: "2022", blurb: "Four modules: Neutronide Buildings, Hypersync Future Actions, Quantum Loops, Intrigues of the Council." }
];

AN.modules = [
  { id: "doomsday", requires: "classic", name: "Doomsday Module", summary: "Experiments shift the Impact — or prevent it entirely",
    description: "Experiment cards and the Doomsday track let the Paths delay, hasten or fully mitigate the Impact. Not supported with Fractures of Time or Intrigues of the Council, and not recommended with Pioneers; solo (Chronossus) also excludes Pioneers, Guardians and Hypersync.", src: "Classic p.3–5, p.9 · Fractures p.15 · Future Imperfect p.13 · Solo p.19" },
  { id: "pioneers", requires: "classic", name: "Pioneers of New Earth", summary: "Upgrade Exosuits and go on Adventures in the Outback",
    description: "Adventure board and cards, Exosuit Upgrade boards, and the Adventure, Power Upgrade and Sensor Upgrade Actions.", src: "Classic p.6–9" },
  { id: "guardians", requires: "classic", name: "Guardians of the Council", summary: "Enlist Path-independent giant Exosuits that need no Workers",
    description: "Guardian board with 6 enlistable Guardians that act as Geniuses and have private Capital Action spaces.", src: "Classic p.9–11" },
  { id: "vanom", requires: "fot", name: "Variable Anomalies", summary: "Anomalies with unique effects (the rulebook also allows it without the main Fractures module; this page always pairs it with Fractures)",
    description: "Replaces the base Anomalies with unique tiles and adds the Anomaly Remover tile to each player.", src: "Fractures p.13–14" },
  { id: "neu", requires: "fi", name: "Neutronide Buildings", summary: "4 buildings that scale with your Power Plants",
    description: "Shuffle buildings 119, 219, 319 and 419 into their stacks — they get stronger the more Power Plants you have.", src: "Future Imperfect p.2, p.4" },
  { id: "hs", requires: "fi", name: "Hypersync Future Actions", summary: "Warp in Capital Actions from the future",
    description: "Take Construct/Recruit/Research now without an Exosuit, then send an Exosuit to the past to synchronize. Combines with any other module (solo only: not with Doomsday).", src: "Future Imperfect p.4–7 · Solo p.19" },
  { id: "ql", requires: "fi", name: "Quantum Loops", summary: "A stronger Warp tile paid back with Breakthroughs",
    description: "Each player gains a Quantum Warp tile that grants powerful Quantum Loop card effects.", src: "Future Imperfect p.7–8" },
  { id: "ic", requires: "fi", name: "Intrigues of the Council", summary: "Missions and a player-built Agenda grid replace Endgame Conditions",
    description: "Council Chamber board, secret Missions, Agenda tiles, and the Negotiate Action. The game ends after the 6th Era (the 5th with Fractures of Time). Not combinable with Doomsday, and not supported in solo.", src: "Future Imperfect p.8–13 · Solo p.3" },
  { id: "alt", requires: "base", name: "Alternate Timeline (variant)", summary: "Crimson Timeline sides with Warp slot bonuses & penalties",
    description: "Warp tiles are placed in marked slot order and trigger bonuses or penalties.", src: "Essential p.20" },
  { id: "draft", requires: "base", name: "Starting Asset Draft (variant)", summary: "Draft your starting assets instead of the printed ones",
    description: "Fixed starter set plus a 4-card asset draft; lowest card sum is First Player (tie: lowest-numbered card).", src: "Essential p.20 · Fractures p.15" },
  { id: "egdraft", requires: "base", name: "Endgame Condition Draft (variant)", summary: "Draft the 5 Endgame Condition cards",
    description: "Players pick Endgame Conditions from dealt hands instead of drawing 5 at random. (Not used with Intrigues of the Council.)", src: "Essential p.20" },
  { id: "chronossus", requires: "base", name: "Chronossus (solo opponent)", summary: "The module-compatible solo boss — instead of the Chronobot",
    description: "A more human-like solo opponent with an Energy Pool and Action tiles. Required when playing solo with any expansion content (Intrigues of the Council is not supported solo).", src: "Solo p.3–4, p.8–13" }
];

/* =============================================================================
   SETUP PHASES — c = { has(exp), p, mod(id) }
   ============================================================================= */
AN.phases = [
  {
    title: "Main Board & Supply",
    steps: [
      { when: () => true, exp: "base",
        t: "Place the Main board",
        d: (c) => "<ul><li>Place the Main board in the middle of the table." + (c.p <= 2 || c.p === 3 ? " With 2 or 3 players, use the side with only <b>two</b> Hex slots for the Research, Recruit and Construct spots.</li>" : " With 4 players, use the side with three Hex slots for the Capital Actions.</li>") +
          "<li>Place the two <b>Research dice</b> on their spots, and the <b>Evacuation Action tile</b> on its space with the <b>A (intact)</b> side up.</li>" +
          (c.p === 2 && !c.mod("guardians") && !c.mod("hs") ? "<li><i>Optional 2-player variant (tougher game):</i> cover the right World Council space with a “Hex Unavailable” tile.</li>" : "") +
          (c.p <= 2 && c.mod("guardians") ? "<li><b>Guardians (" + (c.p === 1 ? "solo" : "2 players") + "):</b> cover the right World Council Hex space with a Hex Unavailable tile — it cannot be used.</li>" : "") +
          (c.p <= 2 && c.mod("hs") ? "<li><b>Hypersync (" + (c.p === 1 ? "solo" : "2 players") + "):</b> cover the right World Council Action space with a Hex Unavailable tile.</li>" : "") +
          "</ul>",
        src: (c) => {
          const s = ["Essential p.5"];
          if (c.p <= 2 && c.mod("guardians")) s.push("Classic p.9");
          if (c.p <= 2 && c.mod("hs")) s.push("Future Imperfect p.4");
          if (c.p === 1 && c.mod("guardians")) s.push("Solo p.16");
          if (c.p === 1 && c.mod("hs")) s.push("Solo p.17");
          return s.join(" · ");
        } },
      { when: () => true, exp: "base",
        t: "Recruit & Mine pools, building stacks",
        d: (c) => "<ul><li>Shuffle the <b>11 Recruit pool cards</b> and <b>11 Mine pool cards</b> into two face-down decks next to the Main board.</li>" +
          "<li>Separate the buildings into four stacks by type — <b>Power Plants, Factories, Life Supports, Labs</b> — and shuffle each separately. These are the primary stacks: place them <b>face up</b> next to the Main board; the top building of each is available to Construct.</li>" +
          (c.has("fot") ? "<li><b>Fractures of Time:</b> before stacking, replace buildings <b>215, 301–304, 313, 314 and 403</b> with their expansion versions, and shuffle in the new buildings (<b>116–118, 216–218, 316–318, 416–418</b>). Then start a <b>secondary stack</b> for each type by placing the top tile face up beside the primary stack.</li>" : "") +
          (c.mod("neu") ? "<li><b>Neutronide Buildings:</b> shuffle buildings <b>119, 219, 319 and 419</b> into their respective stacks.</li>" : "") +
          (c.mod("ic") ? "<li><b>Intrigues of the Council:</b> shuffle buildings <b>120, 220, 320 and 420</b> into their respective stacks.</li>" : "") +
          "</ul>",
        src: (c) => {
          const s = ["Essential p.5"];
          if (c.has("fot")) s.push("Fractures p.4");
          if (c.mod("neu")) s.push("Future Imperfect p.4");
          if (c.mod("ic")) s.push("Future Imperfect p.9");
          return s.join(" · ");
        } },
      { when: () => true, exp: (c) => c.mod("vanom") ? "mod" : "base",
        t: "Anomalies, Paradox die & general supply",
        d: (c) => "<ul>" +
          (c.mod("vanom")
            ? "<li><b>Variable Anomalies:</b> leave the base Anomalies in the box. Shuffle the new Anomalies into a face-up primary stack" + (c.has("fot") ? " and start a secondary stack (like the buildings)" : "") + ". " + (c.p === 1 ? "Take an <b>Anomaly Remover tile</b> (the Chronossus gets none and ignores the Anomalies' unique effects)." : "Give each player an <b>Anomaly Remover tile</b>.") + "</li>"
            : "<li>Place the <b>Anomalies</b> in a face-up stack.</li>") +
          "<li>Place the <b>Paradox die</b> and Paradox tokens next to the Anomalies.</li>" +
          "<li>Place all Resources on the top-right of the board and all Water on the top-left. Place Workers, Energy Cores and Breakthroughs across the board from the buildings, and the Victory Point tokens within reach.</li>" +
          (c.has("fot") ? "<li><b>Fractures of Time:</b> create a supply of <b>Flux Cores</b> next to the Energy Cores and of <b>Operators</b> next to the other Workers.</li>" : "") +
          "</ul>",
        src: (c) => {
          const s = ["Essential p.5"];
          if (c.mod("vanom")) s.push("Fractures p.13");
          if (c.has("fot")) s.push("Fractures p.4");
          if (c.p === 1 && c.mod("vanom")) s.push("Solo p.18");
          return s.join(" · ");
        } },
      { when: () => true, exp: (c) => c.mod("doomsday") || c.has("fot") || c.mod("ic") ? "mod" : "base",
        t: "Lay out the Timeline & the Impact tile",
        d: (c) => {
          if (c.has("fot")) return "<ul><li><b>Fractures of Time Timeline:</b> there are only <b>three pre-Impact Eras and two post-Impact Eras</b>, plus <b>Era Zero</b> (its own Timeline tile, not counted as a pre-Impact Era).</li>" +
            "<li>Place the Impact tile after the third (non-Zero) Era tile.</li>" +
            (c.mod("alt") ? "<li><b>Alternate Timeline:</b> after laying out the Timeline, turn each Timeline tile to its alternate (crimson) side.</li>" : "") +
            (c.mod("ic") ? "<li><b>Intrigues of the Council:</b> no further Timeline change — with Fractures the game ends after <b>Era 5</b>, and Emergency Missions are drawn at the start of Era 4.</li>" : "") + "</ul>";
          let d = "<ul><li>Arrange the <b>Timeline tiles</b> in a straight line left to right below the Main board.</li>";
          if (c.mod("doomsday")) d += "<li><b>Doomsday:</b> place the Impact tile between the <b>fifth and sixth</b> Timeline tiles (instead of the fourth and fifth). Place a random <b>face-up Level 1 Experiment</b> below the first Timeline tile and a face-down one below each other tile; return leftover Level 1 Experiments to the box unseen.</li>";
          else d += "<li>Place the <b>Impact tile</b> between the fourth and fifth Timeline tiles.</li>";
          if (c.mod("ic")) d += "<li><b>Intrigues of the Council:</b> place only <b>2</b> Timeline tiles after the Impact instead of 3 — the game ends after the 6th Era.</li>";
          if (c.mod("alt")) d += "<li><b>Alternate Timeline:</b> after laying out the Timeline, turn each Timeline tile to its alternate (crimson) side.</li>";
          return d + "</ul>";
        },
        src: (c) => {
          const s = [];
          if (c.has("fot")) s.push("Fractures p.4");
          else s.push(c.mod("alt") ? "Essential p.5, p.20" : "Essential p.5");
          if (c.has("fot") && c.mod("alt")) s.push("Essential p.20");
          if (c.mod("doomsday")) s.push("Classic p.3");
          if (c.mod("ic")) s.push(c.has("fot") ? "Future Imperfect p.13" : "Future Imperfect p.9");
          return s.join(" · ");
        } },
      { when: () => true, exp: (c) => c.mod("ql") || c.mod("ic") ? "mod" : (c.has("fot") ? "fot" : "base"),
        t: "Superprojects & Focus markers",
        d: (c) => {
          let pool = "";
          if (c.mod("ql")) pool += "<li><b>Quantum Loops:</b> remove one random base Superproject and shuffle in <b>Multiverse Hub</b>.</li>";
          if (c.mod("ic")) pool += "<li><b>Intrigues of the Council:</b> remove one random base Superproject and shuffle in <b>World Council Surveillance</b>.</li>";
          if (c.has("fot")) return "<ul>" + pool +
            "<li>Pick <b>six</b> random Superprojects face down: <b>two from Fractures of Time and four from the base game</b>; shuffle them unseen.</li>" +
            "<li>Place one face down above each Timeline tile; turn the ones for <b>Era Zero and Era 1</b> face up.</li>" +
            "<li>Place <b>3 VP</b> on the last Era's Superproject — whoever builds it claims them.</li>" +
            "<li>Place each player's <b>Focus marker</b> below <b>Era 1</b> (not Era Zero). Do not place Resources on the right side of the Mine Action.</li></ul>";
          return "<ul>" + pool +
            "<li>Shuffle all <b>Superprojects</b> and place one face down above each of the " + (c.mod("ic") ? "six" : "seven") + " Timeline tiles (none above the Impact tile). Flip the <b>leftmost</b> one face up. Return the rest to the box.</li>" +
            "<li>Place each player's <b>Focus marker</b> (a Path marker) below the leftmost Timeline tile.</li></ul>";
        },
        src: (c) => {
          const s = [c.has("fot") ? "Fractures p.4" : "Essential p.5"];
          if (c.mod("ql")) s.push("Future Imperfect p.7");
          if (c.mod("ic")) s.push("Future Imperfect p.9");
          return s.join(" · ");
        } },
      { when: () => true, exp: (c) => c.mod("ic") ? "mod" : (c.p === 1 ? "solo" : "base"),
        t: (c) => c.mod("ic") ? "Endgame scoring — Agenda grid instead of Condition cards" : "Endgame Condition cards",
        d: (c) => {
          if (c.mod("ic")) return "<ul><li><b>Intrigues of the Council:</b> leave <b>all Endgame Condition cards in the box</b> — endgame scoring uses the Council's Agenda grid instead (set up below).</li></ul>";
          if (c.p === 1) return "<ul><li><b>Solo:</b> leave <b>all Endgame Condition cards in the box</b> (see Solo Setup below).</li></ul>";
          const adds = [];
          if (c.mod("doomsday")) adds.push("“Most Completed Experiments” (Doomsday)");
          if (c.mod("pioneers")) adds.push("“Most Successful Adventures” (Pioneers)");
          if (c.mod("guardians")) adds.push("“Most Guardians” (Guardians)");
          if (c.has("fot")) adds.push("the two Fractures of Time cards");
          if (c.mod("vanom")) adds.push("the Variable Anomalies card");
          return "<ul>" + (adds.length ? "<li>Add to the card pool: " + adds.join(", ") + ".</li>" : "") +
            (c.mod("egdraft")
              ? "<li><b>Endgame Condition Draft:</b> deal 4 cards each (2P — keep two each) or 2 cards each (3–4P — keep one each), then add one more from the undealt cards (two in a 3-player game) for a total of five.</li>"
              : "<li>Randomly choose <b>5 Endgame Condition cards</b> and place them face up above the Main board. Each is worth 3 VP to every player who meets it at game end.</li>") + "</ul>";
        },
        src: (c) => {
          if (c.mod("ic")) return "Future Imperfect p.9";
          if (c.p === 1) return c.mod("chronossus") ? "Solo p.8" : "Solo p.4";
          const s = ["Essential p.5, p.19"];
          if (c.mod("doomsday")) s.push("Classic p.3");
          if (c.mod("pioneers")) s.push("Classic p.6");
          if (c.mod("guardians")) s.push("Classic p.9");
          if (c.has("fot")) s.push("Fractures p.4");
          if (c.mod("vanom")) s.push("Fractures p.13");
          if (c.mod("egdraft")) s.push("Essential p.20");
          return s.join(" · ");
        } }
    ]
  },
  {
    title: "Module Boards",
    steps: [
      { when: (c) => c.mod("doomsday"), exp: "mod",
        t: "Doomsday — Doomsday board & Experiments",
        d: "<ul><li>Place the <b>Doomsday board</b> next to the Main board (treat it as part of it). Place the <b>Trajectory dice</b> on their slots and the <b>Save Earth</b> and <b>Seal Fate</b> trackers on their starting positions.</li>" +
          "<li>Shuffle all <b>Level 2 Experiment cards</b> into a face-down stack next to the board.</li></ul>",
        src: "Classic p.3" },
      { when: (c) => c.mod("pioneers"), exp: "mod",
        t: "Pioneers — Adventure board & Exosuit Upgrade boards",
        d: (c) => "<ul><li>Place the <b>Adventure board</b> next to the Main board. Shuffle the Adventure cards into two face-down decks by their backs (<b>5+ Power</b> and <b>10+ Power</b>) and place them on the board with the <b>Adventure die</b>; put the Adventure reference card within reach of all players.</li>" +
          "<li>After Paths are chosen, give each player their Path's <b>Exosuit Upgrade board</b> (the Path of Dominance starts with Power 2; Power Upgrade is a Free Action costing 1 Water for the Path of Salvation)" + (c.has("fot") ? ". The Path of Unity uses the <b>Paladin Exosuit Upgrade tile</b> (starts at Power 1)" : "") + "." + (c.p === 1 ? " The Chronossus gets the <b>Chronossus Exosuit Upgrade board</b>, A side up (starting Power 2; the B side, Power 3, is a harder option)." : "") + "</li></ul>",
        src: (c) => "Classic p.6, p.8" + (c.has("fot") ? " · Fractures p.19" : "") + (c.p === 1 ? " · Solo p.15" : "") },
      { when: (c) => c.mod("guardians"), exp: "mod",
        t: "Guardians — Guardian board",
        d: "<ul><li>Place the <b>Guardian board</b> next to the Main board with a Guardian Exosuit marker (or miniature) on each of its <b>6 Hex spots</b>.</li></ul>",
        src: "Classic p.9" },
      { when: (c) => c.has("fot"), exp: "fot",
        t: "Fractures — Valley board, Operators & Technologies",
        d: (c) => "<ul><li>Place the <b>Valley board</b> near the Main board, using the side matching your player count" + (c.p === 2 ? " (cover the top-right marked hex space with 2 players)" : c.p === 1 ? " (solo: set it up as for 2 players, covering the top-right marked hex space)" : "") + ". Place an <b>Operator</b> on each Operator slot on its left side.</li>" +
          "<li>Shuffle the <b>Technology cards</b> into a face-up primary deck near the buildings, then flip the top card beside it to start the secondary deck.</li></ul>",
        src: (c) => c.p === 1 ? "Fractures p.4 · Solo p.11" : "Fractures p.4" },
      { when: (c) => c.mod("hs"), exp: "mod",
        t: "Hypersync — Hypersync board & tiles",
        d: (c) => "<ul><li>Place the <b>Hypersync board</b> next to the Main board, using the side for your player count" + (c.p === 1 ? " (solo: the 2-player side)" : "") + ", and set the <b>3 Supercharge tiles</b> aside — they are added at Impact.</li>" +
          "<li>Each player takes their Path's <b>3 Hypersync tiles</b>." + (c.p === 1 ? " The Chronossus uses the 3 <b>Solo Hypersync tiles</b>, placed next to its board." : "") + "</li></ul>",
        src: (c) => c.p === 1 ? "Future Imperfect p.4 · Solo p.17" : "Future Imperfect p.4" },
      { when: (c) => c.mod("ql"), exp: "mod",
        t: "Quantum Loops — cards & Quantum Warp tiles",
        d: (c) => "<ul><li>Shuffle the <b>8 Quantum Loop cards</b>, reveal <b>3</b> face up next to the Main board, and keep the other 5 as a face-down draw deck. (If Time Wave Neutralizer or Time Loop Amplifier appears in the starting offer, replace it and reshuffle it into the deck.)" + (c.p === 1 ? " <b>Solo:</b> keep the face-up cards in a <b>row</b>, adding new ones closest to the draw deck (the Chronossus removes the one farthest from it)." : "") + "</li>" +
          "<li>Each player adds the <b>Quantum Warp</b> tile to their pool of Warp tiles.</li></ul>",
        src: (c) => c.p === 1 ? "Future Imperfect p.7 · Solo p.18" : "Future Imperfect p.7" },
      { when: (c) => c.mod("ic"), exp: "mod",
        t: "Intrigues — Council Chamber, Agendas & Missions",
        d: (c) => "<ul><li>Place the <b>Council Chamber board</b> next to the Main board.</li>" +
          "<li>Remove Objective tiles tied to modules/expansions not in play. Separate Agenda tiles into <b>Objectives</b> (dark blue) and <b>Values</b> (yellow) and shuffle them into two face-down piles below the board.</li>" +
          "<li>Give each player their <b>Agenda Benefits card</b>, a <b>Mission standee</b>, and their own shuffled 8-card <b>Mission deck</b> (matched by the arrow on the back)" + (c.has("fot") ? " — with Fractures, each player randomly removes 2 cards from it" : "") + ". Set the <b>Emergency Missions</b> aside until after the Impact.</li></ul>",
        src: (c) => c.has("fot") ? "Future Imperfect p.9, p.13" : "Future Imperfect p.9" }
    ]
  },
  {
    title: "Player Setup",
    steps: [
      { when: () => true, exp: (c) => c.has("fot") ? "fot" : "base",
        t: "Choose Paths, board sides & components",
        d: (c) => "<ul><li>Each player picks a <b>Path</b> — Harmony, Dominance, Progress or Salvation" + (c.has("fot") ? ", or the new <b>Path of Unity</b> (Fractures)" : "") + " — and takes its Player board. All players use the same side: symmetric <b>A</b> (recommended first) or asymmetric <b>B</b>.</li>" +
          "<li>Take your color's components: <b>6 Exosuits, 9 Warp tiles, 8 Path markers</b>, and the <b>Morale and Time Travel markers</b>.</li>" +
          "<li>Place your <b>Path board</b> in front of you with a <b>randomly chosen side</b> up — each side has a different Evacuation condition.</li></ul>",
        src: (c) => c.has("fot") ? "Essential p.6 · Fractures p.5" : "Essential p.6" },
      { when: () => true, exp: (c) => c.mod("draft") ? "mod" : "base",
        t: (c) => c.mod("draft") ? "Starting assets — draft variant" : "Starting assets & Workers",
        d: (c) => {
          if (c.mod("draft")) return "<ul><li><b>Starting Asset Draft:</b> instead of the printed starting assets, each player receives 2 Scientists (Active), 1 Engineer (Active), " + (c.has("fot") ? "1 Operator (Tired), 1 Energy Core, 1 Flux Core and 2 Water — and shuffle the four new Asset cards into the deck (Fractures)" : "2 Energy Cores and 2 Water") + ".</li>" +
            "<li>Deal " + (c.p === 2 ? "8" : c.p === 3 ? "5" : "4") + " Starting Asset cards to each player; pick one and pass the rest right until everyone has four. Everyone gains their four cards' assets and returns the rest to the box. Add up the numbers on the bottom of your four cards: the <b>lowest sum</b> is First Player in the first Era (tie: the player with the <b>lowest-numbered card</b>).</li></ul>";
          return "<ul><li>Each player takes the starting Resources, Water, Energy Cores and Workers shown on their <b>Path board</b> (the Path of Progress gets its starting Breakthrough at random). Place starting Workers in the Active and Tired columns as indicated, and set the Morale and Time Travel markers to their starting positions.</li>" +
            (c.has("fot") ? "<li><b>Fractures:</b> every Path except Unity loses <b>1 Energy Core</b> and gains <b>1 Flux Core and 1 Tired Operator</b>. (Unity starts with what its Path board shows.)</li>" : "") + "</ul>";
        },
        src: (c) => {
          const s = ["Essential p.6"];
          if (c.mod("draft")) { s.length = 0; s.push("Essential p.20"); if (c.has("fot")) s.push("Fractures p.15"); }
          else if (c.has("fot")) s.push("Fractures p.5");
          return s.join(" · ");
        } },
      { when: (c) => c.has("fot"), exp: "fot",
        t: "Fractures — Fracture Device & Glitches",
        d: "<ul><li>Each player takes their Path's <b>Fracture Device board</b> (all players on the same A/B side) and covers its 4 rightmost spaces with the <b>Fracture Device Upgrade tile</b>. (On B sides, place any shown rewards on their Flux spaces.)</li>" +
          "<li>Add the new <b>Flux Core Warp tile</b> to your pool of Warp tiles.</li>" +
          "<li>Place <b>1 Glitch marker</b> on one of the bottom Exosuit spaces of your Player board (that space starts unavailable) and <b>1 Glitch marker</b> on the first space of your Fracture Device. Keep the remaining 6 Glitch markers nearby.</li></ul>",
        src: "Fractures p.5" },
      { when: () => true, exp: (c) => c.has("fot") ? "fot" : "base",
        t: "Choose Leaders",
        d: (c) => "<ul><li>Each player picks one of the " + (c.has("fot") ? "<b>three Leader cards</b> available to their Path (Fractures adds a third Leader to each original Path; Unity has three of its own)" : "<b>two Leader cards</b> available to their Path") + " and places it on the designated spot of their Path board.</li></ul>",
        src: (c) => c.has("fot") ? "Essential p.6 · Fractures p.5" : "Essential p.6" },
      { when: (c) => c.p !== 1, exp: "base",
        t: "First Player & starting Water",
        d: (c) => "<ul><li>Give each player their <b>Player banner</b>. " + (c.mod("draft")
            ? "The First Player is decided by the Starting Asset Draft (above) — place their banner next to the World Council spaces.</li>"
            : "The player who most recently had a <b>“déjà vu”</b> is First Player — place their banner next to the World Council spaces.</li>") +
          "<li>Clockwise from the First Player, players receive <b>0 / 1 / 1 / 2</b> extra Water." + (c.mod("draft") ? " (The Starting Asset Draft rules don't say whether this Water still applies; agree before play.)" : "") + "</li></ul>",
        src: (c) => c.mod("draft") ? "Essential p.6, p.20" : "Essential p.6" }
    ]
  },
  {
    title: "Solo Setup",
    steps: [
      { when: (c) => c.p === 1 && !c.mod("chronossus"), exp: "solo",
        t: "Set up the Chronobot (base game only)",
        d: "<ul><li>Set up a <b>2-player game</b> with the Chronobot as one player, using the <b>Chronobot side</b> of the Solo board. It gets its 6 Exosuits and 8 Warp tiles — no starting assets or Workers, and no Focus marker.</li>" +
          "<li>Leave <b>all Endgame Condition cards in the box</b>.</li>" +
          "<li>Place the <b>Chronobot board</b> next to the Main board with the 4 <b>Command tokens</b> on their marked positions.</li>" +
          "<li>The Chronobot's banner starts on the <b>First Player</b> spot; you receive <b>1 extra Water</b> for going second. You may use the A or B side of your Player board.</li>" +
          "<li><i>Harder game options:</i> cover the right World Council space with a Hex Unavailable tile; skip your Leader power; advance the token off Reboot immediately; give the bot an extra turn after you pass; or raise its minimum Actions from 3 to 6.</li></ul>",
        src: "Solo p.4, p.7" },
      { when: (c) => c.p === 1 && c.mod("chronossus"), exp: "solo",
        t: "Set up the Chronossus",
        d: (c) => {
          const objs = [];
          if (c.has("fot")) objs.push("“Technology Cards”", "“Flux on Track”");
          if (c.mod("doomsday")) objs.push("“Completed Experiments”");
          if (c.mod("pioneers")) objs.push("“Successful Adventures”");
          if (c.mod("guardians")) objs.push("“Guardians”");
          // Action tiles per module (Solo p.8, p.11, p.13–17, reference table p.19). Variable Anomalies,
          // Quantum Loops, Alternate Timelines and Neutronide don't change the tiles (Solo p.3, p.19).
          const F = c.has("fot"), D = c.mod("doomsday"), P = c.mod("pioneers"), G = c.mod("guardians"), H = c.mod("hs");
          const n = [F, D, P, G, H].filter(Boolean).length;
          const C10 = "; C10A replaces the printed “Recruit Genius or Research” space", C13 = "; C13A covers the Time Travel space";
          const tiles = n >= 3 || (P && H) ? "the rulebook gives no Action-tile layout for this combination (the Solo p.19 table covers only single modules and the pairs Fractures + Pioneers, Fractures + Hypersync, Guardians + Hypersync and Guardians + Pioneers; Solo p.19 recommends combining no more than two or three modules)"
            : F && P ? "C05A (I) / C14A (II) / C09A (III)" + C10
            : F && H ? "C12A (I) / C04A (II) / C05A (III)" + C13
            : G && H ? "C12A (I) / C11A (II) / C03A (III)" + C13
            : G && P ? "C03A (I) / C09A (II) / C11A (III)" + C10
            : F ? "C04A (I) / C05A (II) / C06A (III) (harder option: C14A instead of C04A, Solo p.13)"
            : D ? "C07A (I) / C08A (II) / C03A (III)"
            : P ? "C03A (I) / C09A (II) / C02A (III)" + C10
            : G ? "C02A (I) / C11A (II) / C03A (III)"
            : H ? "C12A (I) / C02A (II) / C03A (III)" + C13
            : "C01A (I) / C02A (II) / C03A (III) (for later games you may assign these 3 tiles randomly)";
          return "<ul><li>Set up a <b>2-player game</b> with the Chronossus as one player, using the <b>Chronossus side</b> of the Solo board. It gets its 6 Exosuits and 8 Warp tiles — no starting assets, Workers or Focus marker.</li>" +
          "<li>Leave the Endgame Condition cards in the box; instead shuffle the <b>Solo Objective cards</b>" + (objs.length ? " (first adding the module card" + (objs.length > 1 ? "s " : " ") + objs.join(", ") + ")" : "") + " and reveal <b>3</b> — you score points for the highest level you reach on each.</li>" +
          "<li>Place the <b>Chronossus board</b> next to the Main board. Place the 4 Command tokens on their marked positions, and these Action tiles (A side up) on the board's numbered empty spaces: " + tiles + ".</li>" +
          "<li>Fill its <b>Energy Pool</b> (an opaque container) with 5 Energy Core and 5 Exhausted Energy Core tokens.</li>" +
          (F ? "<li><b>Fractures:</b> fill a second container, the <b>Flux Pool</b>, with 1 Flux Core and all 3 Empty Flux Casing tokens. The Chronossus does not use a Fracture Device.</li>" : "") +
          (P ? "<li><b>Pioneers:</b> give the Chronossus its <b>Chronossus Exosuit Upgrade board</b>, A side up.</li>" : "") +
          (D ? "<li><b>Doomsday:</b> for your first few games, the Planned Experiments variant is suggested.</li>" : "") +
          (c.mod("vanom") ? "<li><b>Variable Anomalies:</b> the Chronossus gets no Anomaly Remover tile.</li>" : "") +
          (c.mod("ql") ? "<li><b>Quantum Loops:</b> keep the Quantum Loop cards in a row, adding new ones closest to the draw deck.</li>" : "") +
          "<li>The Chronossus is First Player in Era 1; you receive 1 extra Water. You may use the A or B side of your board.</li>" +
          "<li><i>Harder game options</i> (each module adds its own, Solo p.13–18):<ul><li>cover the right World Council space with a Hex Unavailable tile;</li><li>flip some or all Action tiles to their B side;</li><li>swap the tiles on spaces I and III;</li><li>add 1/2/3 Energy Cores to the Energy Pool;</li><li>it powers up 1 extra Exosuit each Era for free (above its maximum it gains 2 VP per excess Energy Core drawn instead);</li><li>each leftover non-exhausted Energy Core scores it 1 VP;</li><li>play with fewer (or no) Solo Objectives;</li><li>it gains 2 VP per Failed Action;</li><li>on Research it takes a Breakthrough shape it does not already have.</li></ul></li></ul>";
        },
        src: (c) => {
          const s = ["Solo p.8–10"];
          if (c.has("fot")) s.push("p.11");
          if (c.mod("doomsday")) s.push("p.14");
          if (c.mod("pioneers")) s.push("p.15");
          if (c.mod("guardians")) s.push("p.16");
          if (c.mod("hs")) s.push("p.17");
          if (c.mod("vanom") || c.mod("ql")) s.push("p.18");
          s.push("p.19");
          return s.join(", ");
        } }
    ]
  },
  {
    title: "Begin Play",
    steps: [
      { when: (c) => c.has("fot"), exp: "fot",
        t: "Era Zero, then Era 1",
        d: (c) => "<ul><li>Before Era 1, perform a <b>Warp Phase only</b> (“Era Zero”), placing Warp tiles on the Era Zero tile. You may <b>not</b> warp an Exosuit during Era Zero.</li>" +
          (c.mod("pioneers") ? "<li><b>Fractures + Pioneers:</b> after the Era Zero Warp Phase, each player may spend 1 Titanium, Uranium or Gold to upgrade their Exosuit Power as though they had taken a Power Upgrade Action.</li>" : "") +
          "<li>Then begin Era 1 in full — including a Preparation Phase (shift building stacks and the Technology deck, reveal the next Superproject) and a <b>Paradox Phase</b> (not skipped, unlike the base game).</li>" +
          "<li>Check: before the first Action, three Superprojects should be face up, with two buildings in each secondary stack and two Technologies in the secondary deck.</li></ul>",
        src: (c) => c.mod("pioneers") ? "Fractures p.6, p.15" : "Fractures p.6" },
      { when: (c) => !c.has("fot"), exp: "base",
        t: "Start Era 1",
        d: "<ul><li>Begin the first Era with the <b>Preparation phase</b>: reveal the Superproject above the next Timeline tile, shift the building stacks, and deal this Era's Recruit and Mine pools from their decks.</li>" +
          "<li>The <b>Paradox phase is skipped in the first Era</b>. Continue with Power Up, Warp, Action rounds, and Clean up.</li></ul>",
        src: "Essential p.7–8" }
    ]
  }
];

/* =============================================================================
   RULES REFERENCE
   ============================================================================= */
AN.reference = [
  {
    title: "An Era — the Six Phases",
    when: () => true,
    html: (c) => "<ol><li><b>Preparation</b> — reveal the next Superproject, shift the building stacks (top of each primary stack moves to its secondary stack)" + (c.has("fot") ? ", shift the Technology deck" + (c.mod("vanom") ? " and the Anomaly stacks" : "") + " the same way" : "") + ", then clear any leftover Workers and Resources from the Recruit and Mine pools and deal a new Recruit pool card (4 Workers" + (c.has("fot") ? "; also place an Operator on each empty Valley slot" : "") + ") and Mine pool card (5 Resources; after the Impact, the topmost is always a Neutronium)" + (c.has("fot") ? " — with Fractures, no Resources go on the right side of the Mine Action" : "; then place a Uranium, a Gold and a Titanium on their slots next to the Mine Hex spaces") + "." + (c.mod("ql") ? " With Quantum Loops, refill the Quantum Loop offer to 3 face-up cards (the offer may grow above 3 — don't discard extras)." : "") + "</li>" +
      "<li><b>Paradox</b> — skipped in Era 1" + (c.has("fot") ? " (but not when playing Fractures, because of Era Zero)" : "") + ". For each Timeline tile with Warp tiles, the player(s) with the most on it roll the Paradox die (0/1/2 Paradoxes).</li>" +
      "<li><b>Power up</b> — in turn order, place up to <b>6 Exosuits</b> on your board's Hex slots, paying <b>1 Energy Core</b> for each of the three bottom slots used; then gain <b>1 Water per empty Hex slot</b>.</li>" +
      "<li><b>Warp</b> — secretly choose <b>0–2 Warp tiles</b>; all reveal simultaneously and place them on the present Timeline tile, immediately receiving the shown assets from the supply. Warping a Worker costs 1 Water (it arrives Active); warped Exosuits go on your Hex slots.</li>" +
      "<li><b>Action rounds</b> — clockwise from the First Player: any number of Free Actions, then place one Worker (on your board, or in an Exosuit on the Main board) and take the Action — or pass for the rest of the Era.</li>" +
      "<li><b>Clean up</b> — retrieve Workers (Motivated ones return Active, others Tired) and empty Exosuits from the Main board (back to your supply, unpowered), and take your Path markers off your Free Action slots; check for the Impact (end of Era " + (c.mod("doomsday") ? "5 by default — the Trajectory dice move it with Doomsday" : "4") + (c.has("fot") ? "; end of Era 3 with Fractures" : "") + ") and for game end; return any unused Exosuits still on your board's Hex slots to your supply (they must be powered up again); move Focus markers to the next Era's tile.</li></ol>",
    src: (c) => {
      const s = ["Essential p.7–11"];
      if (c.mod("doomsday")) s.push("Classic p.3, p.5");
      if (c.has("fot")) s.push(c.mod("vanom") ? "Fractures p.4, p.6, p.14" : "Fractures p.4, p.6");
      if (c.mod("ql")) s.push("Future Imperfect p.7");
      return s.join(" · ");
    }
  },
  {
    title: "Paradoxes & Anomalies",
    when: () => true,
    html: (c) => "<ul><li>Receiving your <b>third Paradox token</b> (by any means) immediately causes an <b>Anomaly</b>: stop rolling, return all your Paradox tokens, " + (c.mod("vanom") ? "choose one of the two visible Anomalies (turn order if several players gain one)" : "take an Anomaly tile") + " and place it on the <b>leftmost free building spot</b> of your board (your choice of row if tied; on top of a building if full — that building is blocked until the Anomaly is removed).</li>" +
      (c.has("fot") ? "<li><b>Fractures:</b> each Glitch on your Paradox track (max 2) fills a Paradox space, so the Anomaly comes after fewer Paradoxes; placing a Glitch there triggers an Anomaly at once if no empty spaces remain.</li>" : "") +
      (c.mod("vanom")
        ? "<li><b>Variable Anomalies:</b> you do <b>not</b> get the base game's free Warp-tile retrieval when gaining an Anomaly — only if the tile shows the retrieve icon and its Before/After-Impact condition matches. Most new Anomalies have their own positive or negative effects; some act like buildings.</li>" +
          "<li><b>Removing (Variable):</b> place any Worker on your <b>Anomaly Remover tile</b> and pay the cost shown on that tile (1 Water less than the base game), then remove any one of your Anomalies from the game. The Worker dies when retrieved in Clean up, so you can remove only one Anomaly per Era this way.</li>"
        : "<li>When you gain an Anomaly you may retrieve <b>one of your Warp tiles</b> from any Timeline tile (after all Paradox rolls resolve).</li>" +
          "<li><b>Removing:</b> as an Action, place a Worker on the Anomaly and spend <b>2 Titanium/Uranium/Gold + 2 Water</b> or <b>1 Neutronium + 2 Water</b>; the Anomaly and the Worker both return to the supply, freeing the spot.</li>") +
      "<li>Each Anomaly still on your board at game end is worth <b>−3 VP</b>" + (c.mod("vanom") ? " (Variable Anomalies: the penalty printed on each tile instead)" : "") + ".</li>" +
      "<li>If everyone prefers predictability, you may skip the Paradox die and simply take 1 Paradox whenever you would roll.</li></ul>",
    src: (c) => c.mod("vanom") ? "Essential p.8–9 · Fractures p.3, p.10, p.14" : c.has("fot") ? "Essential p.8–9, p.17 · Fractures p.10" : "Essential p.8–9, p.17"
  },
  {
    title: "Workers, Exosuits & Action Spaces",
    when: () => true,
    html: (c) => "<ul><li><b>Four Worker types:</b> Engineers, Scientists, Administrators, Geniuses" + (c.has("fot") ? ", plus Operators (Fractures)" : "") + ". A <b>Genius</b> may be placed as any type — but may NOT be spent as another type for costs, sent back for Worker Warp tiles, or used for Evacuation conditions.</li>" +
      (c.has("fot") ? "<li>An <b>Operator</b> can be placed anywhere except Genius-only spaces (and a Genius can't go on Operator-only spaces), but gains no Worker-type placement bonuses (no Construct discount, no Genius recruiting, only 3 Water at Purify Water).</li>" : "") +
      "<li><b>Hex spaces</b> (Main board): require a Worker in a powered-up <b>Exosuit</b>; one use per Era. <b>Hex pool spaces:</b> unlimited placements (still need Exosuits). <b>Worker spaces</b> (your board): no Exosuit needed; once per Era each.</li>" +
      "<li>Some spaces restrict Worker types, give type bonuses, cost Water/Resources, or keep the Worker <b>Motivated</b> (returns Active in Clean up).</li>" +
      "<li><b>Free Actions</b> (buildings, Superprojects, Force Workers, some Leaders): once per Era each, any number on your turn, marked with Path markers.</li></ul>",
    src: (c) => c.has("fot") ? "Essential p.10–12 · Fractures p.6" : "Essential p.10–12"
  },
  {
    title: "Main Board Actions",
    when: () => true,
    html: (c) => "<ul><li><b>Construct</b> (Capital): build a face-up building from any primary/secondary stack top onto the leftmost empty spot of its row, paying that spot's cost — or build the <b>Superproject in Focus</b> on the two leftmost horizontally adjacent free spots of a row (your choice if tied), ignoring the spots' costs and paying the costs on the project itself, including Breakthroughs (Workers for Superproject costs may come from Active or Tired). No Administrators; an Engineer saves 1 Titanium.</li>" +
      "<li><b>Recruit</b> (Capital): take a Worker from the Recruit pool into your Active column, with a bonus by type — Scientist: 2 Water · Engineer: 1 Energy Core · Administrator: 1 VP · Genius: any one of those. No Scientists; an Engineer may not select a Genius" + (c.has("fot") ? " (nor may an Operator)" : "") + ".</li>" +
      "<li><b>Research</b> (Capital): set one Research die to any face, roll the other, and take a Breakthrough matching shape + icon (“?” = any icon; you can't set the die to “?”). Scientists only.</li>" +
      "<li>Capital Action spaces: upper free, middle costs 1 Water, lower costs 2 Water (4-player games only).</li>" +
      "<li><b>World Council:</b> copy a Capital Action that has <b>no free spaces</b> (Worker rules of the copied Action apply; space features don't). Two spaces: <b>left</b> — pay 2 Water and become <b>First Player</b> (you may place there just for that, even if Capital spaces remain); <b>right</b> — pay 1 Water" + (c.mod("guardians") ? ". With Guardians, you may also enlist a Guardian here (see below)" : "") + ".</li>" +
      "<li><b>Mine Resource:</b> take 1 Resource from the Mine pool, plus Uranium / Gold / Titanium depending on the space used" + (c.has("fot") ? " (with Fractures, these are no longer placed on the right side — take the matching Resource straight from the supply)" : "") + ". An Engineer stays Motivated.</li>" +
      "<li><b>Purify Water</b> (pool): take 3 Water (+1 if a Scientist).</li>" +
      "<li><b>Trade with Nomads</b> (pool): one exchange — 3 Water ↔ 1 Energy Core; 1 Energy Core ↔ 1 Neutronium; 1 Neutronium ↔ any 2 of Ti/U/Au; any 2 of Ti/U/Au ↔ 3 Water. An Administrator trades twice.</li>" +
      "<li><b>Evacuation</b> (pool; post-Impact only): once per game each, if you meet your Path board's condition — place a Path marker on the uppermost free slot and score your Path board's base VP plus the bonus VP for the assets it names (you keep the assets); if your marker is on the −3 spot, score 3 less (min. 0). The Evacuation scores at most <b>30 VP</b> in total.</li></ul>",
    src: (c) => {
      const s = ["Essential p.12–15"];
      if (c.mod("guardians")) s.push("Classic p.10");
      if (c.has("fot")) s.push("Fractures p.6, p.8");
      return s.join(" · ");
    }
  },
  {
    title: "Player Board Actions & Time Travel",
    when: () => true,
    html: (c) => "<ul><li><b>Supply:</b> pay the Water cost shown under your Morale position, move all Tired Workers to Active, then <b>gain 1 Morale</b> (at max: gain the VP shown instead). An Administrator stays Motivated.</li>" +
      "<li><b>Force Workers</b> (Free Action): move all Tired Workers to Active, then <b>lose 1 Morale</b> (at minimum: lose a Worker instead).</li>" +
      "<li><b>Power Plants — Time Travel:</b> activate to (1) move your <b>Focus</b> to a past Timeline tile within the plant's range, counted back from the current Era's tile and ignoring the Impact tile (ranges don't add up; never ending in the current Era); (2) optionally pay one of your own Warp tiles on the Focused tile — spend the shown Resource/Water/Worker (from Active)/powered-up Exosuit and take the tile back; (3) if you did both, advance your <b>Time Travel track</b> one step (endgame VP).</li>" +
      "<li>Warp tiles removed any other way (retrieve abilities, Anomaly compensation) do <b>not</b> advance the Time Travel track. Present-Era Warp tiles can't be paid back via Power Plants.</li>" +
      "<li><b>Buildings & Superprojects</b> provide Worker Actions, Free Actions, passive abilities, or one-time effects. Superprojects of earlier Eras can still be built while they are in Focus.</li>" +
      (c.mod("hs") ? "<li><b>Hypersync tiles</b> count as Warp tiles when checking who has the most on a Timeline tile (a player with no Warp tile there still doesn't roll) and for effects that count Warp tiles on the Timeline, but can't be taken back by 'retrieve' effects. To retrieve one, while your Focus is on a past Timeline tile holding it, place an Exosuit (with a Worker) on the matching Hypersync Action space (+2 VP, no Time Travel advance; Scientist for Research, Administrator for Recruit, Engineer for Construct, Genius anywhere" + (c.has("fot") ? "; with Fractures an Operator may retrieve any of them, even by Blinking onto the Hypersync board (never off it)" : "") + (c.p === 4 ? "; 4 players: a fourth space copies any occupied Hypersync space for 2 Water, with that space's Worker restriction" : "") + ").</li>" : "") +
      "</ul>",
    src: (c) => c.mod("hs") ? "Essential p.16–17, p.19 · Future Imperfect p.5–7" : "Essential p.16–17, p.19"
  },
  {
    title: "The Impact & Collapsing Capital",
    when: () => true,
    html: (c) => "<ul><li>The Impact occurs in the Clean up phase of the <b>" + (c.mod("doomsday") ? "5th" : "4th") + " Era</b>" + (c.mod("doomsday") ? " by default with Doomsday (Impact tile set up after the 5th Timeline tile) — the Trajectory dice roll can move it one Era later or earlier each Era; if Seal Fate is on its bottom spot at Check for Impact, the Impact is placed after the current Era and resolved at once; and Save Earth can prevent it entirely (the game ends, with no Evacuation)" : "") + (c.has("fot") ? " (3rd Era with Fractures)" : "") + ".</li>" +
      "<li>Flip the <b>Evacuation tile</b> to its B side, revealing the Evacuation Action, and place the <b>−3 VP marker</b> on its 2nd/3rd/4th spot for 2/3/4 players" + (c.p === 1 ? " (solo: the 2nd spot, as a 2-player game)" : "") + ".</li>" +
      "<li>Cover two of the three top-row Exosuit Hex slots on each Player board with <b>Hex Unavailable</b> tiles — no power-ups or Water income there.</li>" +
      "<li>Place random <b>Collapsing Capital tiles</b> on the Capital Actions' Hexes (2/2/3 per Action for 2/3/4 players" + (c.p === 1 ? "; solo: 2" : "") + "): they grant bonus effects, but in the Clean up phase each tile an Exosuit is retrieved from flips to <b>Hex Unavailable</b>" + (c.has("fot") ? ". Fractures: place the base tiles face down, then add 2/3/4 random tiles from the 9 new ones (2/3/4 players" + (c.p === 1 ? "; solo: 2" : "") + ") face up on top, top to bottom of their Action; flip uncovered base tiles face up. A vacated new tile is removed, revealing the tile beneath. Blinking away from a Collapsing Capital tile counts the same as retrieving an Exosuit from it (remove the top new tile, or flip the last tile unavailable)" : "") + ".</li>" +
      (c.mod("ic") ? "<li><b>Intrigues:</b> add Collapsing Capital tiles to the Council Chamber the same way, and deal each player 2 <b>Emergency Missions</b> — one for each of the last two Eras.</li>" : "") +
      "<li>In post-Impact Eras the Mine pool's topmost Resource is always <b>Neutronium</b>." + (c.mod("hs") ? " With Hypersync, the 3 Supercharge tiles are added to the Hypersync spaces for extra rewards." : "") + "</li>" +
      "<li>The World Council can still copy Capital Actions once they have no free (uncovered) spaces.</li></ul>",
    src: (c) => {
      const s = ["Essential p.18"];
      if (c.mod("doomsday")) s.push("Classic p.3, p.5");
      if (c.has("fot")) s.push("Fractures p.4, p.12");
      if (c.mod("hs")) s.push("Future Imperfect p.7");
      if (c.mod("ic")) s.push(c.has("fot") ? "Future Imperfect p.12–13" : "Future Imperfect p.12");
      if (c.p === 1) s.push(c.mod("chronossus") ? "Solo p.8, p.10" : "Solo p.4, p.7");
      return s.join(" · ");
    }
  },
  {
    title: "Game End & Scoring",
    when: () => true,
    html: (c) => "<ul><li>" + (c.mod("ic")
        ? "With Intrigues of the Council the game always ends after the <b>" + (c.has("fot") ? "5th" : "6th") + " Era</b>, regardless of the Collapsing Capital tiles."
        : "The game ends when <b>all Collapsing Capital tiles have flipped</b> to Hex Unavailable (end of that Era) or after the <b>" + (c.has("fot") ? "5th Era</b> (the last Era with Fractures)" : "7th Era</b>") + (c.mod("doomsday") ? " — or, with Doomsday, at the Check for Impact of the Era in which the Save Earth tracker is on its topmost spot (the Impact is fully mitigated; no Evacuation)" : "") + ".") + "</li>" +
      "<li><b>Untangle the Continuum:</b> pay back every outstanding Warp tile you can (Workers from Active, Exosuits powered up; no Time Travel advances). Each unpaid Warp tile is <b>−2 VP</b>" + (c.mod("hs") ? "; Hypersync tiles can't be paid back here — each one left is −4 VP" : "") + (c.mod("ql") ? "; your Quantum Warp can be paid back here by spending the Breakthrough shown on your Quantum Loop card — if it stays, it is −4 VP instead of −2" : "") + ".</li>" +
      (c.mod("ic")
        ? "<li><b>Agenda grid (Intrigues):</b> score each complete Objective+Value row — whoever meets the Objective scores the Value (possibly negative); ties score in full. Incomplete rows score nothing. Then each Agenda tile left in your reserve scores 1 VP per locked row with the same icon." + (c.has("fot") ? " With Fractures, a row with your Glitch marker beside it can't give you positive VP (negative values still apply)." : "") + "</li>"
        : c.p === 1
          ? (c.mod("chronossus") ? "<li><b>Solo Objectives</b> (no Endgame Condition cards in solo): score the highest level you reached on each of the 3 revealed Solo Objective cards.</li>" : "<li>No Endgame Condition cards are used against the Chronobot.</li>")
          : "<li><b>Endgame Conditions:</b> 3 VP for each of the five cards you satisfy (ties all score in full)." + (c.has("fot") ? " With Fractures, you can't score a card carrying your Glitch marker; its 3 VP go to the next-ranked player who has no Glitch on it (possibly no one)." : "") + "</li>") +
      "<li><b>Final scoring:</b> buildings, Superprojects, Time Travel track, Morale, VP tokens, minus Anomalies (" + (c.mod("vanom") ? "their printed penalties" : "−3 each") + ") and Timeline penalties. Breakthroughs: 1 VP each, +2 VP per set of three different <b>shapes</b>" + (c.has("fot") ? "; plus Fracture Device progress and Technology card bonuses, −2 VP per Glitch in play (Breakthroughs on the Fracture Device Upgrade tile neither score nor count toward shape sets)" : "") + ".</li>" +
      (c.p === 1
        ? "<li><b>Winning:</b> you win only with more VP than the " + (c.mod("chronossus") ? "Chronossus" : "Chronobot") + "; otherwise (a tie included) you lose. It takes no penalty for Warp tiles left on the Timeline and scores 1 VP per Breakthrough +2 per complete shape set.</li></ul>"
        : "<li><b>Tiebreakers:</b> most Water, then most total Resources; otherwise victory is shared.</li></ul>"),
    src: (c) => {
      const s = [c.mod("vanom") ? "Essential p.19" : "Essential p.9, p.19"];
      if (c.mod("doomsday")) s.push("Classic p.5");
      if (c.has("fot")) s.push(c.mod("vanom") ? "Fractures p.3–4, p.11–12" : "Fractures p.4, p.11–12");
      const fi = [];
      if (c.mod("hs")) fi.push("p.7");
      if (c.mod("ql")) fi.push("p.8");
      if (c.mod("ic")) fi.push(c.has("fot") ? "p.12–13" : "p.12");
      if (fi.length) s.push("Future Imperfect " + fi.join(", "));
      if (c.p === 1) s.push(c.mod("chronossus") ? "Solo p.8–10" : "Solo p.4, p.7");
      return s.join(" · ");
    }
  },
  {
    title: "Doomsday Module",
    when: (c) => c.mod("doomsday"),
    html: (c) => "<ul><li><b>Experiment Action</b> (Hex pool, any Worker): claim the Experiment card <b>in Focus</b> if you meet its condition and pay its cost. Gain its VP, and you may move the <b>Save Earth</b> tracker up (Paths of Harmony/Dominance) or the <b>Seal Fate</b> tracker down (Salvation/Progress) — collecting any VP printed beside the new spot for your Path.</li>" +
      "<li>Each Preparation phase, flip the Level 1 Experiment below the next Era's tile and deal Level 2 Experiments below empty tiles.</li>" +
      "<li><b>Check for Impact:</b> roll the two Trajectory dice, add the (+)/(−) symbols beside both trackers' positions — more (+): Impact moves 1 Era later; more (−): 1 Era earlier (never behind the current Era).</li>" +
      "<li><b>Seal Fate at the bottom:</b> no roll — place the Impact tile after the current Era and resolve it immediately. <b>Save Earth at the top</b> (at Check for Impact): the Impact's damage is completely mitigated and the game is over — proceed to Ending the Game; there is no Evacuation.</li>" +
      "<li>No more tracker movement after the Impact or once either tracker reaches its final slot (Experiments still score VP).</li>" +
      "<li><b>Optional — Planned Experiments</b> (for players familiar with Doomsday): keep the Level 2 stack face up; whenever an Experiment is claimed, replace it at once with the top Level 2 card (until the stack runs out); don't deal Level 2 cards in the Preparation phase." + (c.p === 1 ? " Recommended for your first games against the Chronossus." : "") + "</li></ul>",
    src: (c) => "Classic p.3–5" + (c.p === 1 ? " · Solo p.14" : "")
  },
  {
    title: "Pioneers of New Earth Module",
    when: (c) => c.mod("pioneers"),
    html: (c) => "<ul><li><b>Adventure Action</b> (Hex pool, any Worker): total your <b>Exosuit Power</b>; take the topmost free Power slot by the Adventure space (its modifier applies; −3 if none free); choose the <b>5+ deck (1 Water)</b> or <b>10+ deck (2 Water)</b>; draw the top card plus one per Breakthrough on your Exosuit Upgrade board and keep one; roll the Adventure die and add it; meet the card's Power for the <b>Success</b> box, otherwise resolve <b>Failure</b> (card goes to the bottom of the deck).</li>" +
      "<li>Resolve multi-asset results top to bottom; if a Failure takes an asset you don't have enough of, spend what you have (nothing if none) and keep resolving.</li>" +
      "<li><b>Power Upgrade</b> (on your Exosuit Upgrade board): place a Resource on a slot — a permanent Power increase by the slot's value. Dominance: Engineers only (and starts the game at Power 2); Harmony/Progress: any Worker; Salvation: a Free Action costing 1 Water, no Worker.</li>" +
      "<li><b>Sensor Upgrade:</b> pay the shown cost, place one of your Breakthroughs (max 3, one of each <b>shape</b>) on the board, gain 2 VP — each Breakthrough there adds an extra Adventure card to your draws (Scientist-only for Harmony/Dominance/Progress; any Worker for Salvation). Harmony instead gains +2 permanent Power per Breakthrough, not the 2 VP.</li>" +
      (c.has("fot") ? "<li><b>Path of Unity (Paladin Exosuit Upgrade tile, Fractures):</b> starts at Power 1. Power Upgrade: place 1 T/U/G for +2 Power (max 4 per game) or 1 Flux Core for +3 (max 1 per game). Sensor Upgrade: Scientist only, spend 1 Water to place a Breakthrough (max one of each shape), then receive 1 Flux Core.</li>" : "") +
      "<li>In Clean up, also retrieve Path markers from the Power slots.</li></ul>",
    src: (c) => "Classic p.6–9, p.13" + (c.has("fot") ? " · Fractures p.19" : "")
  },
  {
    title: "Guardians of the Council Module",
    when: (c) => c.mod("guardians"),
    html: () => "<ul><li><b>Enlist:</b> when you take a World Council Action, you may also enlist a Guardian — pay its cost (always at least one Worker, permanently assigned) and mark its slot with a Path marker. You may use a World Council space just to enlist (no copied Action; the left space still makes you First Player).</li>" +
      "<li><b>Guardians</b> power up like regular Exosuits (same cost) but need <b>no Workers</b> and always count as a <b>Genius</b> when taking Actions.</li>" +
      "<li>They may use normal Main board spaces <b>or</b> the Guardian-board space marked with your Path marker: pay 1 Water there to take any Capital Action — no one else may ever use your marked space.</li>" +
      "<li>The 6-Exosuit power-up limit still applies per phase, though Guardians can push your total used Exosuits above 6 in an Era via mid-Era power-ups.</li></ul>",
    src: () => "Classic p.9–11"
  },
  {
    title: "Fractures of Time — Valley, Blinking & Glitches",
    when: (c) => c.has("fot"),
    html: (c) => "<ul><li><b>Era Zero:</b> a Warp-only phase before Era 1 (no Exosuit warps). The Timeline has 3 pre-Impact and 2 post-Impact Eras.</li>" +
      "<li><b>Operators:</b> hired from the Valley (Assimilate), placeable almost anywhere, but gain no type-specific bonuses.</li>" +
      "<li><b>Blinking:</b> as an Action (needs an empty Fracture Device space; on a B-side Device you must also pay that space's extra cost), move 1 Flux Core onto the leftmost empty space. If the Worker in the chosen Exosuit isn't an Operator, roll the Flux and Glitch dice: a Flux number above your visible empty Device spaces adds a <b>Glitch</b> where the Glitch die shows. Then move one of your placed, occupied Exosuits to a space of a <b>different Action</b> (Worker restrictions still apply) and take it. Afterwards retrieve the Worker at once, as in Clean up (Motivated spaces return it Active); the empty Exosuit stays there and can't Blink again this Era. You can Blink <b>into</b> the Valley but never <b>off</b> it, nor from one Valley space to another, nor off other side boards.</li>" +
      "<li><b>Glitches</b> (−2 VP each at game end) block what they cover: Time Travel track (no advances), Paradox track (Anomalies come sooner), Exosuit slots, buildings, " + (c.mod("ic") ? "Agenda grid rows (2 Glitches beside 2 rows; you score no positive VP from those rows, negatives still apply)," : c.p === 1 ? "Solo Objectives (2 Glitches on 2 of them, max 1 each; you don't score those)," : "Endgame Conditions (2 Glitches on 2 different cards; you can't score them, so their VP passes to the next-ranked player),") + " and Fracture Device spaces.</li>" +
      "<li><b>Valley board:</b> <b>Assimilate</b> — hire an Operator, or spend 2 Gold/Uranium for a Technology card (permanent abilities; some have extra costs); no Engineers; Administrator: +1 Flux Core; Scientist: the Technology costs 1 Gold/Uranium less. <b>Extract</b> — gain 2 Flux Cores or 2 Energy Cores (Scientist: +1 Flux Core; Engineer: +1 Energy Core; no Administrators; Operators get no bonus). <b>Valley Capital</b> — copy a full Valley Action (like the World Council).</li>" +
      "<li><b>Upgrade Fracture Device</b> (Free Action or Operator-only space, 2 Water + 2 VP version): place a Breakthrough with a <b>new icon</b> on the Upgrade tile and slide it right — more Flux capacity, fewer Glitches, and endgame VP for the highest uncovered value.</li>" +
      "<li><b>Recall</b> (Free Action): place 2 Flux Cores on your Device and retrieve up to 3 Workers/Free Action markers — only from Factories, Life Supports, Labs and Supply/Force Workers — then roll the Flux and Glitch dice. Operator-only spaces: <b>Remove Flux Cores</b> (up to 2 rightmost) and <b>Remove Glitches</b> (pay 2 Water, up to 2).</li>" +
      "<li><i>The Upgrade, Remove Flux Cores and Remove Glitches spaces above are the A-side Device. B sides (Fractures p.22): <b>Harmony</b> — one Remove Flux Core & Glitch Action replaces both (2 Water: remove 3 Flux Cores OR 3 Glitches), and its Upgrade Action option may also remove 1 Flux Core; <b>Salvation</b> — Remove Glitch is free, Engineer-only (kept Motivated), removes 1 Glitch; <b>Progress</b> — the Upgrade Action costs 3 Water and gives 3 VP; Remove Flux Core is a Free Action costing 1 Water; <b>Dominance</b> — no Free Action Upgrade; an extra Genius-only Upgrade space (kept Motivated) gives only 1 VP; <b>Unity</b> — the Free Action Upgrade costs 1 Neutronium and gives a random Breakthrough (roll both dice).</i></li></ul>",
    src: (c) => "Fractures p.4, p.6–12, p.22" + (c.mod("ic") ? " · Future Imperfect p.13" : "") + (c.p === 1 ? " · Solo p.13" : "")
  },
  {
    title: "Future Imperfect Modules",
    when: (c) => c.mod("neu") || c.mod("hs") || c.mod("ql") || c.mod("ic"),
    html: (c) => "<ul>" +
      (c.mod("neu") ? "<li><b>Neutronide Buildings:</b> four buildings (119/219/319/419) whose effects scale with the number of <b>Power Plants</b> you have.</li>" : "") +
      (c.mod("hs") ? "<li><b>Hypersync:</b> on your turn, instead of placing an Exosuit, place one of your 3 <b>Hypersync tiles</b> above the current Era's tile and take the tile's Capital Action without an Exosuit (Construct at −1 Titanium; Recruit from the supply, limited to types on this Era's Recruit card). Max 1 pending tile per Era. In the Paradox phase a Hypersync tile counts as a Warp tile when checking who has the most on a Timeline tile, but a player with no Warp tile on that tile never rolls for it. Then the player(s) with the most Hypersync tiles in play make one extra Paradox roll, unless they already gained an Anomaly this Paradox phase. Retrieve them via the Hypersync board (+2 VP)" + (c.has("fot") ? "; with Fractures, Operators may also retrieve them, including by Blinking onto the Hypersync board (never off it)" : "") + "; unpaid tiles are −4 VP at game end.</li>" : "") +
      (c.mod("ql") ? "<li><b>Quantum Loops:</b> in the Warp phase you may place your <b>Quantum Warp</b> tile instead of a normal one, taking a face-up <b>Quantum Loop card</b> and resolving it immediately (turn order if contested). Pay it back through a Power Plant by spending the <b>Breakthrough</b> shown on your card (advances Time Travel; the card returns to the offer). Unpaid at game end: −4 VP.</li>" : "") +
      (c.mod("ic") ? "<li><b>Intrigues of the Council:</b> each Power Up phase draw 2 <b>Mission cards</b>, keep 1 hidden. Reveal it as a Free Action: all 3 conditions met → pick 2 rewards; 2 met → 1 reward; fewer → lose 1 VP token (also the default if never revealed). The <b>Negotiate</b> Action (Council Chamber; a Capital Action, so World Council can copy it once it is full, without the space modifiers): draw 2 Agenda tiles and keep 1, splitting draws between the Objective and Value piles as you like. Top space: keep +1. Middle: draw +2. Bottom: draw +1, pay 1 Water, not at 2P. Worker bonuses stack with these: Administrator may place 1 Agenda at once; Scientist keeps +1; Engineer draws +2; Genius picks one. You can never keep more than you drew. Objectives go in the left column, Values in the right. When an effect lets you place one on the <b>Agenda grid</b> (Administrator on Negotiate, Mission rewards, the World Council Surveillance Superproject, some Council Chamber Collapsing tiles), you gain that row's benefit; complete rows score at game end (override unlocked tiles for 2 Water per tile already there; matching-icon pairs lock). Your <b>Agenda Benefits card</b> gives three Free Actions that each cost an Agenda tile (3 uses per Era in total), plus the Free Action that reveals your Mission.</li>" : "") +
      "</ul>",
    src: (c) => {
      // pages per module: Neutronide p.4 + appendix p.13; Hypersync p.4–7; Quantum Loops p.7–8; Intrigues p.8–15
      const pg = new Set(), add = (a, b) => { for (let i = a; i <= b; i++) pg.add(i); };
      if (c.mod("neu")) { add(4, 4); add(13, 13); }
      if (c.mod("hs")) add(4, 7);
      if (c.mod("ql")) add(7, 8);
      if (c.mod("ic")) add(8, 15);
      const n = [...pg].sort((a, b) => a - b), out = [];
      for (let i = 0; i < n.length; i++) {
        let j = i; while (j + 1 < n.length && n[j + 1] === n[j] + 1) j++;
        out.push(j > i ? "p." + n[i] + "–" + n[j] : "p." + n[i]); i = j;
      }
      return "Future Imperfect " + out.join(", ");
    }
  },
  {
    title: "Solo — Chronobot & Chronossus",
    when: (c) => c.p === 1,
    html: (c) => c.mod("chronossus")
      ? "<ul><li>The <b>Chronossus</b> plays by Chronobot-style rules with additions. In the Power Up phase it draws 3 tokens from its <b>Energy Pool</b> (or as many as are left): it powers up 3+X Exosuits pre-Impact (<b>max 6</b>) / 2+X post-Impact (<b>max 4</b>), where X = non-exhausted Energy Cores drawn. Then return 1 drawn Exhausted Energy Core to the pool and remove the other drawn tokens from the game.</li>" +
        "<li>On its turn, roll the <b>AI die</b>; it performs the Action above/below the matching Command token (possibly an <b>Action tile</b>), then the token advances along its matching-color arrow.</li>" +
        "<li>Failed Actions give it <b>1 VP</b> (if it failed for lack of free spaces, it also discards an active Exosuit). It rolls Paradoxes last. When it gains an Anomaly it stops rolling and removes one of its Warp tiles from the Timeline tile where it has the most (oldest if tied). If it already has 3 Anomalies, it gains none and removes no Warp tile.</li>" +
        "<li>Its Warp phase places Warp tiles equal to a Paradox-die roll. If a Command token lands on an <b>Autoleap</b> (!) space, that Action resolves at once and the token advances again.</li>" +
        "<li><b>Passing:</b> once it is out of Exosuits, it passes the next time it would need to place one. Its Command token does not advance when it passes. The Action Rounds Phase ends once you have both passed (Solo p.10).</li>" +
        "<li><b>Gaining Energy Cores:</b> add 1 non-exhausted Energy Core to its Energy Pool at the end of that Action. It never gains Exhausted Energy Cores (Solo p.10).</li>" +
        "<li><b>Actions</b> follow the Chronobot's general rules (Solo p.5–6, p.10):<ul>" +
          "<li>it uses only empty Exosuits, never Workers;</li>" +
          "<li>it ignores everything printed on Action spaces and Collapsing Capital tiles, never pays costs, and cannot place on face-down Collapsing Capital tiles;</li>" +
          "<li>it always takes the topmost free Capital space;</li>" +
          "<li>if the rolled Capital Action has no free space, it places on a World Council space instead (the First Player spot if possible);</li>" +
          "<li>if two tokens are already on the next position, move the top one on first;</li>" +
          "<li>Construct, Recruit, Research, Mine Resource, Time Travel and Remove Anomaly work as for the Chronobot (Solo p.5–6).</li></ul></li>" +
        "<li><b>Objectives:</b> you score the highest level reached on each of the 3 Solo Objective cards. Beat its score to win.</li>" +
        "<li><b>End of game:</b> it loses no VPs for its Warp tiles and scores 1 VP per Breakthrough +2 per complete shape set. You add your Solo Objective points. You win only with more points than it has (Solo p.10).</li>" +
        (c.has("fot") ? "<li><b>Fractures:</b><ul>" +
          "<li>It puts a free Energy Core from the supply into every Exosuit it places on the Main board.</li>" +
          "<li>Before each Exosuit Action, check for a Blink-ready Exosuit (on the Main board, holding an Energy Core, not on the Action being attempted) and a non-empty Flux Pool. If both, draw 1 Flux Pool token.</li>" +
          "<li>A Flux Core is discarded and it Blinks. It blinks the Exosuit on an Action matching another Command token (the smaller number first), otherwise the bottom-left-most one. That Exosuit's Energy Core returns to the supply.</li>" +
          "<li>An Empty Flux Casing is set aside, and it returns to the Flux Pool at Clean Up.</li>" +
          "<li>It never rolls the Flux or Glitch dice and never gets Glitches. A full Valley Action sends it to the Valley Capital space.</li>" +
          "<li><b>Assimilate:</b> roll the shape die. Circle: recruit an Operator (+1 Flux Core). Triangle: take a Technology card (secondary stack preferred). Square: whichever it has fewer of (Operator if tied). With no Operator left it is a Failed Action. Operators are wildcards in its Worker collection.</li>" +
          "<li><b>Extract:</b> both effects, 2 Flux Cores into the Flux Pool and 2 Energy Cores into the Energy Pool.</li>" +
          "<li>It passes when it doesn't Blink and has no Exosuits left.</li>" +
          "<li>Game end: 3 VP per Technology.</li>" +
          "<li>A “2 Public Objectives” Glitch roll puts Glitches on 2 of your Solo Objectives (max 1 each; a Glitched objective scores nothing).</li>" +
          "<li>Technology 511: draw 2 unused Solo Objectives and put 1 into play (Solo p.11–13).</li></ul></li>" : "") +
        (c.mod("doomsday") ? "<li><b>Doomsday, Experiment:</b> it places an Exosuit on the Experiment hex pool space.<ul>" +
          "<li>Step 1: it takes the leftmost available Experiment of the tile's level that has a Path marker on it and discards the marker. If the tracks aren't locked, it moves the marker opposing yours and takes any printed VP.</li>" +
          "<li>Step 2: it puts a Path marker on a face-up Experiment without one (not the one under the next Era). Level 1 comes first, then the furthest in the past.</li>" +
          "<li>When you take an Experiment with its marker, move the marker to a later face-up Experiment without one (up to the present), or discard it (Solo p.14).</li></ul></li>" : "") +
        (c.mod("pioneers") ? "<li><b>Pioneers, Adventure:</b> it places an Exosuit on the Adventure hex pool space and a Path marker on the highest available strength bonus.<ul>" +
          "<li>Its power = 2 (A side) or 3 (B side), plus the value of each slot holding a Resource (A side: Titanium +2, Uranium +3, Gold +3, Neutronium +4), plus +2 (A) / +3 (B) per VP token on its Upgrade board, plus the strength bonus.</li>" +
          "<li>At 9+ it draws 2 from the 10+ deck, otherwise 2 from the 5+ deck. Roll the Adventure die. It takes the highest-requirement card it meets and gains its benefit; if it meets neither, 1 VP.</li>" +
          "<li>Water → 1 VP per 2 (round up). Morale → 2 VP each. A choice of Research/Recruit/Construct → Research. Ongoing (purple) cards → 3 VP + 1 Energy Core.</li>" +
          "<li>Then Power Upgrade: of the Resources that still have a free slot on its board, it moves the one it has most of (ties: Titanium > Gold > Uranium > Neutronium); if it can't, it puts a supply VP token there, which counts for power but not as VP (Solo p.15).</li></ul></li>" : "") +
        (c.mod("guardians") ? "<li><b>Guardians:</b><ul>" +
          "<li>It powers up Guardians first, then its own Exosuits, and places Guardians last.</li>" +
          "<li>If a Capital Action (Research, Recruit, Construct) has no spaces left, including the World Council, it places a Guardian on the reserved Guardian space and performs it. This is not a Failed Action.</li>" +
          "<li><b>Acquire Guardian</b> (pre-Impact): it places an Exosuit on the World Council space (First Player if possible) and recruits the leftmost available Guardian for free.</li>" +
          "<li>If that space is taken, it spends a Worker (the type it has most of; ties: Scientist > Engineer > Administrator > Genius) for a Guardian without placing an Exosuit.</li>" +
          "<li>Otherwise, or after the Impact, 1 VP (Solo p.16).</li></ul></li>" : "") +
        (c.mod("hs") ? "<li><b>Hypersync:</b><ul>" +
          "<li>If a Capital Action has no spaces left (including the World Council), it places a Solo Hypersync tile on the current Era and performs the Action. It may have max 1 per Era and max 3 pending; otherwise it is a Failed Action.</li>" +
          "<li>C12A also gives it 1 Energy Core. After the Impact it ignores Supercharge tiles.</li>" +
          "<li><b>Hypersync/Time Travel (C13A):</b> with a pending tile, it sends an Exosuit to a random available Hypersync Action space (shape die), retrieves its oldest pending tile and scores 2 VP; its Time Travel marker doesn't advance.</li>" +
          "<li>Otherwise it takes a normal Time Travel Action. If neither is possible, Failed Action (Solo p.17).</li></ul></li>" : "") +
        (c.mod("ql") ? "<li><b>Quantum Loops:</b> whenever it places at least 1 Warp tile, roll the AI die. On a 4, remove the Quantum Loop card farthest from the draw deck from play. If you gain Cosmic Data Leak, draw 2 unused Solo Objectives and put them into play (Solo p.18).</li>" : "") +
        (c.mod("alt") ? "<li><b>Alternate Timelines:</b> decide your warp first, then roll for it. Tiles go down in turn order. It ignores penalty slots and takes 2 VP instead of any positive reward (Solo p.18).</li>" : "") +
        (c.mod("vanom") ? "<li><b>Variable Anomalies:</b> it ignores Anomaly effects. It picks an Anomaly that lets it retrieve a Warp tile (if both or neither do, the smaller VP penalty) and always removes the one with the largest VP penalty (Solo p.18).</li>" : "") +
        "<li><b>Modules:</b> the Chronossus supports Doomsday, Pioneers, Guardians, Fractures, Hypersync, Quantum Loops, Variable Anomalies, Alternate Timelines and Neutronide buildings via extra Action tiles and per-module rules — but Doomsday can't combine with Pioneers, Guardians, Fractures or Hypersync, and Fractures can't combine with Guardians (Solo p.19). Intrigues of the Council is not supported solo (Solo p.3).</li></ul>"
      : "<ul><li>The <b>Chronobot</b> (base game only) always powers up 6 Exosuits pre-Impact / 4 post-Impact, spending nothing. Its Warp phase places Warp tiles equal to a Paradox-die roll (it gains nothing for them).</li>" +
        "<li>On its turn, roll the <b>AI die</b>, perform the Action above/below the Command token with that number, then advance that token (if two tokens are already on the next position, move the top one on first).</li>" +
        "<li>It uses only empty Exosuits (no Workers), ignores printed costs and Collapsing-tile text, can't use face-down Collapsing tiles, and always takes the topmost free Capital space. If the rolled Capital Action is full, it goes to a <b>World Council</b> space instead (First Player spot if possible).</li>" +
        "<li><b>Failed Actions:</b> if no space is available it places nothing and takes <b>1 VP</b>; if it can place but can't perform the Action, it places the Exosuit (blocking) and takes 1 VP.</li>" +
        "<li><b>Paradox:</b> it rolls last. If it gains an Anomaly it stops rolling, then removes one Warp tile from the Timeline tile where it has the most (oldest if tied). If it already has 3 Anomalies, it gains none and removes no Warp tile.</li>" +
        "<li><b>Construct:</b> it takes the highest-VP building of the rolled type (secondary stack if tied; max 3 per type).</li>" +
        "<li><b>Construct Superproject:</b> it discards a Breakthrough (one of whichever it has most of; random if tied), then takes the highest-VP face-up Superproject from the Present or any past Era (oldest if tied). With no Breakthrough, or already 3 Superprojects, it blocks a Construct space and takes 1 VP.</li>" +
        "<li><b>Recruit:</b> it takes a Worker type it does not yet have, by the priority Genius > Administrator > Engineer > Scientist. If that type is unavailable, it takes an available type by the same priority. It gets no Recruit bonus but takes 1 VP. Once it has all 4 types, it discards one of each for 5 VP.</li>" +
        "<li><b>Recruit Genius/Research:</b> it Recruits a Genius (+1 VP) if one is available, even if it already has one; otherwise it Researches.</li>" +
        "<li><b>Research:</b> roll only the shape die and take any Breakthrough of that shape.</li>" +
        "<li><b>Mine Resource:</b> it picks the 2 Resources it wants most, preferring types it does not have, with ties broken Neutronium > Uranium > Gold > Titanium. It uses the topmost Mine space that gives them. Once it has all 4 types, it discards one of each for 5 VP.</li>" +
        "<li><b>Time Travel:</b> it places no Exosuit. It removes one Warp tile from the past Timeline tile where it has the most (oldest if tied), and advances 1 step on the Time Travel track if it removed one. With no Warp tiles left on the Timeline it is a Failed Action (1 VP).</li>" +
        "<li><b>Remove Anomaly:</b> it discards 2 Resource cubes of the types it has most of (ties: Titanium > Gold > Uranium > Neutronium; 1 Neutronium counts as 2 cubes), then removes 1 Anomaly. With no Anomaly, or not enough Resources, it is a Failed Action (1 VP).</li>" +
        "<li><b>Reboot:</b> it does nothing. This is not a Failed Action and gives no VP.</li>" +
        "<li>Once out of Exosuits it takes a Time Travel Action on its next turn (if able), then passes. If you pass first, the Action Rounds end <b>immediately</b>, unless it has taken fewer than <b>3 Actions</b>; then it keeps taking turns until it has 3. It never Evacuates.</li>" +
        "<li>It scores no Warp-tile penalties; Breakthroughs score it 1 VP each +2 per shape set. Beat its total to win.</li></ul>",
    src: (c) => c.mod("chronossus") ? "Solo p.3, p.5–6, p.8–19" : "Solo p.4–7"
  },
  {
    title: "Variants & Module Compatibility",
    when: () => true,
    html: (c) => "<ul>" +
      (c.mod("alt") ? "<li><b>Alternate Timeline:</b> Timeline tiles use their crimson sides. Warp tiles are revealed and placed <b>in player order</b> onto the next empty slots (arrow order); slot symbols give bonuses (Morale, VP, extra asset, remove Paradox) or penalties (lose Morale, gain Paradox). A doubled asset slot still costs only one asset to pay back later.</li>" : "") +
      (c.mod("egdraft") ? "<li><b>Endgame Condition Draft:</b> instead of drawing 5 at random, deal 4 cards each at 2P (each keeps 2) or 2 each at 3–4P (each keeps 1), reveal the picks, then add one card from the undealt cards (two at 3P) for five in total.</li>" : "") +
      (c.mod("draft") ? "<li><b>Starting Asset Draft:</b> fixed starter kit plus a pick-and-pass draft of four Asset cards; the lowest card sum is First Player (tie: the player with the lowest-numbered card).</li>" : "") +
      "<li><b>Compatibility:</b> Fractures of Time is not supported with Doomsday or Guardians (Fractures p.15). Intrigues of the Council can't be combined with Doomsday, and isn't suggested together with both Pioneers and Fractures (Future Imperfect p.13). Pioneers is not recommended with Doomsday (Classic p.9). Solo (Chronossus): Doomsday also can't combine with Pioneers, Guardians or Hypersync, and Intrigues is not supported (Solo p.3, p.19). Other modules mix freely — each one adds complexity, and the solo rulebook recommends no more than two or three at once.</li>" +
      (c.has("fot") && c.mod("pioneers") ? "<li><b>Fractures + Pioneers:</b> after the Era Zero Warp phase, each player may spend 1 Ti/U/Au for a free Power Upgrade.</li>" : "") +
      (c.mod("hs") && c.mod("alt") ? "<li><b>Hypersync + Alternate Timeline:</b> placing a Hypersync tile never triggers Warp-slot effects (it sits above the Timeline tile).</li>" : "") +
      (c.mod("hs") && c.has("fot") ? "<li><b>Hypersync + Fractures:</b> you may Blink onto the Hypersync board but not off it; Operators may retrieve Hypersync tiles (including when Blinking onto the board).</li>" : "") +
      (c.mod("hs") ? "<li><b>Hypersync:</b> for any effect that counts Warp tiles on the Timeline (e.g. Variable Anomalies), Hypersync tiles count as Warp tiles.</li>" : "") +
      (c.mod("ql") && c.mod("alt") ? "<li><b>Quantum Loops + Alternate Timeline:</b> a Quantum Warp on a ×2 slot has no additional effect.</li>" : "") +
      (c.mod("ql") && c.mod("ic") ? "<li><b>Quantum Loops + Intrigues:</b> Cosmic Data Leak draws two Endgame Condition cards left in the box; score 3 VP for each one whose condition you meet at game end (you still score the Agenda board).</li>" : "") +
      (c.mod("ic") && c.has("fot") ? "<li><b>Intrigues + Fractures:</b> Glitches that would go on Endgame Condition cards go instead next to two Agenda-grid rows that don't already have your Glitch markers (only one if only one row is eligible); you score no positive VP from such a row (negative values still apply). You can't Blink away from the Council Chamber Action, and abilities that let you Blink away from the Valley board don't apply to it. Covert Operations HQ (511) works unchanged: draw two Endgame Condition cards left in the box, keep one, and score 3 VP if you meet it.</li>" : "") +
      (c.mod("ic") && c.mod("guardians") ? "<li><b>Intrigues + Guardians:</b> your Guardian on the Guardian-only Action space qualifies for the “Have an Exosuit on the World Council Action space” Mission condition.</li>" : "") +
      "</ul>",
    src: (c) => {
      const s = [];
      if (c.mod("alt") || c.mod("egdraft") || c.mod("draft")) s.push("Essential p.20");
      s.push("Classic p.9 · Fractures p.15 · Future Imperfect " + (c.mod("hs") ? "p.7, " : "") + (c.mod("ql") && (c.mod("alt") || c.mod("ic")) ? "p.8, " : "") + "p.13 · Solo p.3, p.19");
      return s.join(" · ");
    }
  }
];

/* =============================================================================
   TEACHING SCRIPT
   ============================================================================= */
AN.teach = {
  intro: "A ~5-minute teach for the exact sets and modules selected above. Read it aloud, or hit Copy and tweak. Rules content is drawn from the rulebooks cited in the setup steps.",
  sections: [
    {
      h: "The hook — and how you win",
      body: (c) => "<p>It's the 26th century. New Earth is rebuilding after a cataclysm, and each of us leads one of humanity's ideological <b>Paths</b>. We know exactly one thing about the future: at the end of the " + (c.has("fot") ? "third" : c.mod("doomsday") ? "fifth" : "fourth") + " Era" + (c.mod("doomsday") ? " — unless we change it" : "") + ", an <b>asteroid hits</b>, and the World Capital starts collapsing. " + (c.p === 1 ? "You win by scoring more <b>Victory Points</b> than the solo opponent" : "The winner is the Path with the most <b>Victory Points</b>") + " when the dust settles — points come from buildings and Superprojects, Breakthroughs, Morale, Time Travel, " + (c.p === 1 ? (c.mod("chronossus") ? "Solo Objectives, " : "") : "Endgame goals, ") + "and evacuating the Capital before the end.</p>" +
        "<p>The twist that makes Anachrony unique: <b>time travel</b>. You can borrow resources and workers from your own future — and then, eras later, you have to actually send them back to close the loop, or the timeline punishes you.</p>"
    },
    {
      h: "The shape of an Era",
      body: (c) => "<p>The game plays over " + (c.has("fot") ? "up to five rounds called <b>Eras</b>, after a warp-only Era Zero" : c.mod("ic") ? "six rounds called <b>Eras</b>" : "up to seven rounds called <b>Eras</b>") + ". Each Era: we reveal what's available (<b>Preparation</b>), the timeline bites anyone abusing it (<b>Paradox</b>), we <b>power up Exosuits</b>, we <b>Warp</b> in goods from the future, then we alternate <b>placing workers</b> until everyone passes, and finally <b>clean up</b>. That's it — six phases, and the rhythm becomes natural after one round.</p>"
    },
    {
      h: "Exosuits and your Workers",
      body: () => "<p>Your workforce is four specialist types — <b>Engineers, Scientists, Administrators</b>, and flexible <b>Geniuses</b>. On your own Player board they work as-is, but the world outside is hostile: to use the shared <b>Main board</b> a Worker must ride an <b>Exosuit</b>, and you decide each Era how many suits to power up — the bottom slots cost Energy Cores, and every slot you leave empty pays you Water. That power-up decision is the quiet engine of the whole game: suits you don't power are income, suits you do power are reach.</p>"
    },
    {
      h: "Warping — borrowing from your future self",
      body: (c) => "<p>Each Era you may secretly commit up to <b>two Warp tiles</b>: resources, Water, Workers, even an Exosuit, delivered instantly from the future. The catch: the tile sits on the Timeline until you <b>pay it back</b> — you'll use a <b>Power Plant</b> to focus on a past Era and send the goods back through the rift, which also advances your Time Travel track for points. Ignore your debts and you'll roll for <b>Paradoxes</b>; three Paradoxes spawn an <b>Anomaly</b> that squats on your board for " + (c.mod("vanom") ? "its printed penalty (−2 to −6)" : "−3 points") + " until you pay to remove it. Unpaid tiles at game end are −2 each. Borrow boldly — but with a plan.</p>"
    },
    {
      h: "The Actions — and why you take them",
      body: (c) => "<ul><li><b>Construct</b> buildings (your engine: more power, more income, more actions) or the <b>Superproject</b> in your Focus (this Era's by default; Time Travel can aim you at an earlier one) — big points and powers.</li>" +
        "<li><b>Recruit</b> new Workers, <b>Research</b> Breakthroughs (they unlock Superprojects and score sets), and <b>Mine</b> for the metals that pay for everything.</li>" +
        "<li><b>Purify Water</b> and <b>Trade with Nomads</b> keep the economy liquid — Water is your action currency.</li>" +
        "<li>The <b>World Council</b> copies a Capital Action that's full — and its left seat steals <b>First Player</b>.</li>" +
        "<li>On your own board, <b>Supply</b> refreshes your Tired workers and buys Morale (endgame points); <b>Force Workers</b> refreshes them for free but costs Morale. Manage that dial.</li></ul>" +
        "<p>Everything funnels toward one moment: the <b>Impact</b>. After Era " + (c.has("fot") ? "3" : c.mod("doomsday") ? "5 (unless Doomsday moves it)" : "4") + " the Capital starts dying — Capital Actions get one-shot <b>Collapsing tiles</b>, " + (c.mod("ic") ? "and the game ends after Era " + (c.has("fot") ? "5" : "6") + " no matter what." : "and once they're all used up the game ends.") + " Post-Impact, the <b>Evacuation</b> action opens: once per game, if you meet your Path's condition, it's worth up to 30 points. Time it well.</p>"
    },
    { when: (c) => c.mod("doomsday"),
      h: "Doomsday module",
      body: () => "<p>We control the asteroid tonight. The new <b>Experiment</b> action scores points and nudges the <b>Doomsday track</b> — Harmony and Dominance push to <b>save Earth</b>, Salvation and Progress push to <b>seal its fate</b>. The trackers make the Impact arrive later, sooner, or — if Save Earth tops out — never: the game just ends, no Evacuation at all. Watch the dice each Era; the Impact date is now a battlefield.</p>" },
    { when: (c) => c.mod("pioneers"),
      h: "Pioneers of New Earth module",
      body: () => "<p>Your Exosuits can now be <b>upgraded</b> — spend resources for permanent <b>Power</b>, mount Breakthroughs as sensors — and sent on <b>Adventures</b> into the Outback: pick the easy or hard deck, add a die roll to your Power, and either cash in the Success rewards or eat the Failure. It's push-your-luck with an engine behind it: upgrade first, adventure later.</p>" },
    { when: (c) => c.mod("guardians"),
      h: "Guardians of the Council module",
      body: () => "<p>Six giant <b>Guardians</b> can be enlisted at the World Council. They're expensive — including a permanently assigned Worker — and you still power them up like any Exosuit. But they act <b>without</b> Workers, count as a Genius everywhere, and get a private action space (1 Water for a Capital Action) that nobody can block. A late-game Guardian is a fourth arm nobody else has.</p>" },
    { when: (c) => c.has("fot"),
      h: "Fractures of Time",
      body: (c) => "<p>This expansion adds the <b>Amethynia Valley</b> and a fifth faction, the <b>Path of Unity</b>. The Valley hires <b>Operators</b> — workers who can go on any space except Genius-only ones, but never get worker-type bonuses — and sells permanent <b>Technologies</b>. The headline mechanic is <b>Blinking</b>: spend a <b>Flux Core</b> to teleport an already-placed Exosuit to a second action in the same Era — double duty from one worker. Overdo it and you collect <b>Glitches</b>, frozen zones worth −2 each that jam your board. Two ways to blink more safely: Blink with an <b>Operator</b> in the Exosuit — they skip the Flux and Glitch dice entirely — or upgrade your <b>Fracture Device</b> with Breakthroughs. On the standard A-side Device, Operators are also the only workers who can use its <b>Remove Glitches</b> and <b>Remove Flux Cores</b> spaces. Also: the game is one Era shorter on each side of the Impact, and there's an <b>Era Zero</b> warp before we start — you can borrow anything but an Exosuit before your first turn, and the Paradox phase runs from Era 1.</p>" +
        (c.mod("vanom") ? "<p>We're also using <b>Variable Anomalies</b>: each Anomaly is unique — some even useful — and removing one goes through your Anomaly Remover tile.</p>" : "") },
    { when: (c) => c.mod("neu") || c.mod("hs") || c.mod("ql") || c.mod("ic"),
      h: "Future Imperfect modules",
      body: (c) => (c.mod("neu") ? "<p><b>Neutronide Buildings:</b> four new buildings that grow stronger with every Power Plant you own — build them if you're going wide on Power Plants.</p>" : "") +
        (c.mod("hs") ? "<p><b>Hypersync:</b> once per Era you can take a Capital Action <b>without an Exosuit</b> by promising to synchronize it later — place a Hypersync tile above this Era's Timeline tile. In a later Era, while your Focus is on that past Era, send an Exosuit with the matching Worker (or a Genius) to the Hypersync board to retrieve it for 2 VP. Leave it hanging and it's −4. Watch the Paradox phase too: a pending Hypersync tile counts toward who has the most Warp tiles on its Era, and whoever has the most Hypersync tiles out makes one extra Paradox roll. It's warping, but for actions.</p>" : "") +
        (c.mod("ql") ? "<p><b>Quantum Loops:</b> everyone gets one extra-strong <b>Quantum Warp</b> tile that grants a powerful loop card — but you pay it back with a specific <b>Breakthrough</b>, not goods, and if it's still on the Timeline at the end it's −4, not −2.</p>" : "") +
        (c.mod("ic") ? "<p><b>Intrigues of the Council:</b> the endgame goals are now <b>player-built</b>. The <b>Negotiate</b> action draws Agenda tiles. Secret <b>Missions</b> each Era reward positioning, and completing one can let you place a tile on the Council's grid — so can sending an Administrator to Negotiate. Each row pairs an Objective (“most Water”) with a Value (“7 points”). You're literally writing the scoring conditions, so lobby for the categories you're winning. The game ends after Era " + (c.has("fot") ? "5" : "6") + ".</p>" : "") },
    { when: (c) => c.p === 1,
      h: (c) => c.mod("chronossus") ? "Solo — the Chronossus" : "Solo — the Chronobot",
      body: (c) => c.mod("chronossus")
        ? "<p>You face the <b>Chronossus</b>, a die-driven boss that powers up a semi-random number of suits from its Energy Pool, takes actions off a rotating command wheel, blocks spaces, wins buildings, and banks a point every time you deny it. Only you score the three revealed <b>Solo Objectives</b>, by tier; beat its total to win.</p>"
        : "<p>You face the <b>Chronobot</b>: an efficient die-driven rival that powers six suits every Era before the Impact (four after), blocks the spaces you wanted, and takes a point whenever it fails. No Endgame Conditions in solo — just beat its score. It never evacuates; you should.</p>" },
    { when: (c) => c.mod("alt") || c.mod("draft") || c.mod("egdraft"),
      h: "Variants tonight",
      body: (c) => "<ul>" +
        (c.mod("alt") ? "<li><b>Alternate Timeline:</b> warp slots now carry bonuses and penalties, and we place warp tiles in player order — watch what slot you'll land on.</li>" : "") +
        (c.mod("draft") ? "<li><b>Starting Asset Draft:</b> we draft our starting goods instead of using the printed ones.</li>" : "") +
        (c.mod("egdraft") ? "<li><b>Endgame Condition Draft:</b> we pick the five endgame goals ourselves.</li>" : "") + "</ul>" },
    {
      h: "Don't worry about these until they come up",
      body: (c) => {
        const items = [];
        items.push("<li><b>Worker-type restrictions per action</b> — the icons on the spaces will tell you; Geniuses fit anywhere" + (c.has("fot") ? " except Operator-only spaces" : "") + ".</li>");
        items.push("<li><b>Motivated vs Tired</b> — some spaces return your worker fresh; I'll point them out.</li>");
        items.push("<li><b>Exact Impact bookkeeping</b> (Collapsing Capital tiles, Hex Unavailable) — I'll run it when it happens.</li>");
        items.push("<li><b>Untangling the Continuum</b> at game end — pay your time debts; we'll walk through it.</li>");
        if (c.has("fot")) items.push("<li><b>Glitch die details</b> — roll and follow the icon; the reference has the list.</li>");
        if (c.mod("ic")) items.push("<li><b>Agenda grid locking and overrides</b> — it reads itself once tiles hit the table.</li>");
        if (c.mod("doomsday")) items.push("<li><b>Trajectory dice math</b> — just count plus and minus symbols each Era.</li>");
        if (c.mod("pioneers")) items.push("<li><b>Individual Adventure cards</b> — resolve top to bottom when drawn.</li>");
        items.push("<li><b>Evacuation scoring details</b> — when the Impact hits, check your Path board's condition and ratio.</li>");
        return "<ul>" + items.join("") + "</ul>";
      }
    }
  ]
};
