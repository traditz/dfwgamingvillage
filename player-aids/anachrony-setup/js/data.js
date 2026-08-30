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
    description: "Experiment cards and the Doomsday track let the Paths delay, hasten or fully mitigate the Impact. Not compatible with Pioneers, Guardians, Fractures of Time or Hypersync.", src: "Classic p.3–5 · Solo p.19" },
  { id: "pioneers", requires: "classic", name: "Pioneers of New Earth", summary: "Upgrade Exosuits and go on Adventures in the Outback",
    description: "Adventure board and cards, Exosuit Upgrade boards, and the Adventure, Power Upgrade and Sensor Upgrade Actions.", src: "Classic p.6–9" },
  { id: "guardians", requires: "classic", name: "Guardians of the Council", summary: "Enlist Path-independent giant Exosuits that need no Workers",
    description: "Guardian board with 6 enlistable Guardians that act as Geniuses and have private Capital Action spaces.", src: "Classic p.9–11" },
  { id: "vanom", requires: "fot", name: "Variable Anomalies", summary: "Anomalies with unique effects — playable with or without the main Fractures module",
    description: "Replaces the base Anomalies with unique tiles and adds the Anomaly Remover tile to each player.", src: "Fractures p.13–14" },
  { id: "neu", requires: "fi", name: "Neutronide Buildings", summary: "4 buildings that scale with your Power Plants",
    description: "Shuffle buildings 119, 219, 319 and 419 into their stacks — they get stronger the more Power Plants you have.", src: "Future Imperfect p.2, p.4" },
  { id: "hs", requires: "fi", name: "Hypersync Future Actions", summary: "Warp in Capital Actions from the future",
    description: "Take Construct/Recruit/Research now without an Exosuit, then send an Exosuit to the past to synchronize. Not compatible with Doomsday.", src: "Future Imperfect p.4–7" },
  { id: "ql", requires: "fi", name: "Quantum Loops", summary: "A stronger Warp tile paid back with Breakthroughs",
    description: "Each player gains a Quantum Warp tile that grants powerful Quantum Loop card effects.", src: "Future Imperfect p.7–8" },
  { id: "ic", requires: "fi", name: "Intrigues of the Council", summary: "Missions and a player-built Agenda grid replace Endgame Conditions",
    description: "Council Chamber board, secret Missions, Agenda tiles, and the Negotiate Action. The game ends after the 6th Era.", src: "Future Imperfect p.8–12" },
  { id: "alt", requires: "base", name: "Alternate Timeline (variant)", summary: "Crimson Timeline sides with Warp slot bonuses & penalties",
    description: "Warp tiles are placed in marked slot order and trigger bonuses or penalties.", src: "Essential p.20" },
  { id: "draft", requires: "base", name: "Starting Asset Draft (variant)", summary: "Draft your starting assets instead of the printed ones",
    description: "Fixed starter set plus a 4-card asset draft; lowest card sum is First Player.", src: "Essential p.20 · Fractures p.15" },
  { id: "egdraft", requires: "base", name: "Endgame Condition Draft (variant)", summary: "Draft the 5 Endgame Condition cards",
    description: "Players pick Endgame Conditions from dealt hands instead of drawing 5 at random. (Not used with Intrigues of the Council.)", src: "Essential p.20" },
  { id: "chronossus", requires: "base", name: "Chronossus (solo opponent)", summary: "The module-compatible solo boss — instead of the Chronobot",
    description: "A more human-like solo opponent with an Energy Pool and Action tiles. Required when playing solo with any expansion content.", src: "Solo p.8–13" }
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
          (c.p === 2 && !c.mod("guardians") ? "<li><i>Optional 2-player variant (tougher game):</i> cover the right World Council space with a “Hex Unavailable” tile.</li>" : "") +
          (c.p === 2 && c.mod("guardians") ? "<li><b>Guardians (2 players):</b> cover the right World Council Hex space with a Hex Unavailable tile — it cannot be used.</li>" : "") +
          (c.p === 2 && c.mod("hs") ? "<li><b>Hypersync (2 players):</b> cover the right World Council Action space with a Hex Unavailable tile.</li>" : "") +
          "</ul>",
        src: (c) => {
          const s = ["Essential p.5"];
          if (c.p === 2 && c.mod("guardians")) s.push("Classic p.9");
          if (c.p === 2 && c.mod("hs")) s.push("Future Imperfect p.4");
          return s.join(" · ");
        } },
      { when: () => true, exp: "base",
        t: "Recruit & Mine pools, building stacks",
        d: (c) => "<ul><li>Shuffle the <b>11 Recruit pool cards</b> and <b>11 Mine pool cards</b> into two face-down decks next to the Main board.</li>" +
          "<li>Separate the buildings into four stacks by type — <b>Power Plants, Factories, Life Supports, Labs</b> — and shuffle each separately. These are the primary stacks; the top building of each is available to Construct.</li>" +
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
            ? "<li><b>Variable Anomalies:</b> leave the base Anomalies in the box. Shuffle the new Anomalies into a face-up primary stack" + (c.has("fot") ? " and start a secondary stack (like the buildings)" : "") + ". Give each player an <b>Anomaly Remover tile</b>.</li>"
            : "<li>Place the <b>Anomalies</b> in a face-up stack.</li>") +
          "<li>Place the <b>Paradox die</b> and Paradox tokens next to the Anomalies.</li>" +
          "<li>Place all Resources on the top-right of the board and all Water on the top-left. Place Workers, Energy Cores and Breakthroughs across the board from the buildings, and the Victory Point tokens within reach.</li>" +
          (c.has("fot") ? "<li><b>Fractures of Time:</b> create a supply of <b>Flux Cores</b> next to the Energy Cores and of <b>Operators</b> next to the other Workers.</li>" : "") +
          "</ul>",
        src: (c) => {
          const s = ["Essential p.5"];
          if (c.mod("vanom")) s.push("Fractures p.13");
          if (c.has("fot")) s.push("Fractures p.4");
          return s.join(" · ");
        } },
      { when: () => true, exp: (c) => c.mod("doomsday") || c.has("fot") || c.mod("ic") ? "mod" : "base",
        t: "Lay out the Timeline & the Impact tile",
        d: (c) => {
          if (c.has("fot")) return "<ul><li><b>Fractures of Time Timeline:</b> there are only <b>three pre-Impact Eras and two post-Impact Eras</b>, plus <b>Era Zero</b> (its own Timeline tile, not counted as a pre-Impact Era).</li>" +
            "<li>Place the Impact tile after the third (non-Zero) Era tile.</li>" +
            (c.mod("ic") ? "<li><b>Intrigues of the Council:</b> the combination of Fractures and Intrigues is an expert combo — see the Future Imperfect rulebook for Timeline adjustments.</li>" : "") + "</ul>";
          let d = "<ul><li>Arrange the <b>Timeline tiles</b> in a straight line left to right below the Main board.</li>";
          if (c.mod("doomsday")) d += "<li><b>Doomsday:</b> place the Impact tile between the <b>fifth and sixth</b> Timeline tiles (instead of the fourth and fifth). Place a random <b>face-up Level 1 Experiment</b> below the first Timeline tile and a face-down one below each other tile; return leftover Level 1 Experiments to the box unseen.</li>";
          else d += "<li>Place the <b>Impact tile</b> between the fourth and fifth Timeline tiles.</li>";
          if (c.mod("ic")) d += "<li><b>Intrigues of the Council:</b> place only <b>2</b> Timeline tiles after the Impact instead of 3 — the game ends after the 6th Era.</li>";
          return d + "</ul>";
        },
        src: (c) => {
          const s = [];
          if (c.has("fot")) s.push("Fractures p.4");
          else s.push("Essential p.5");
          if (c.mod("doomsday")) s.push("Classic p.3");
          if (c.mod("ic")) s.push("Future Imperfect p.9");
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
            "<li>Shuffle all <b>Superprojects</b> and place one face down above each of the seven Timeline tiles (none above the Impact tile). Flip the <b>leftmost</b> one face up. Return the rest to the box.</li>" +
            "<li>Place each player's <b>Focus marker</b> (a Path marker) below the leftmost Timeline tile.</li></ul>";
        },
        src: (c) => {
          const s = [c.has("fot") ? "Fractures p.4" : "Essential p.5"];
          if (c.mod("ql")) s.push("Future Imperfect p.7");
          if (c.mod("ic")) s.push("Future Imperfect p.9");
          return s.join(" · ");
        } },
      { when: () => true, exp: (c) => c.mod("ic") ? "mod" : "base",
        t: (c) => c.mod("ic") ? "Endgame scoring — Agenda grid instead of Condition cards" : "Endgame Condition cards",
        d: (c) => {
          if (c.mod("ic")) return "<ul><li><b>Intrigues of the Council:</b> leave <b>all Endgame Condition cards in the box</b> — endgame scoring uses the Council's Agenda grid instead (set up below).</li></ul>";
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
          const s = ["Essential p.5"];
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
        d: "<ul><li>Place the <b>Adventure board</b> next to the Main board. Shuffle the Adventure cards into two face-down decks by their backs (<b>5+ Power</b> and <b>10+ Power</b>) and place them on the board with the <b>Adventure die</b> and reference card.</li>" +
          "<li>After Paths are chosen, give each player their Path's <b>Exosuit Upgrade board</b> (the Path of Dominance starts with Power 2; Power Upgrade is a Free Action costing 1 Water for the Path of Salvation).</li></ul>",
        src: "Classic p.6, p.8" },
      { when: (c) => c.mod("guardians"), exp: "mod",
        t: "Guardians — Guardian board",
        d: "<ul><li>Place the <b>Guardian board</b> next to the Main board with a Guardian Exosuit marker (or miniature) on each of its <b>6 Hex spots</b>.</li></ul>",
        src: "Classic p.9" },
      { when: (c) => c.has("fot"), exp: "fot",
        t: "Fractures — Valley board, Operators & Technologies",
        d: (c) => "<ul><li>Place the <b>Valley board</b> near the Main board, using the side matching your player count" + (c.p === 2 ? " (cover the top-right marked hex space with 2 players)" : "") + ". Place an <b>Operator</b> on each Operator slot on its left side.</li>" +
          "<li>Shuffle the <b>Technology cards</b> into a face-up primary deck near the buildings, then flip the top card beside it to start the secondary deck.</li></ul>",
        src: "Fractures p.4" },
      { when: (c) => c.mod("hs"), exp: "mod",
        t: "Hypersync — Hypersync board & tiles",
        d: "<ul><li>Place the <b>Hypersync board</b> near the Timeline and set the <b>3 Supercharge tiles</b> aside — they are added at Impact.</li>" +
          "<li>Each player takes their Path's <b>3 Hypersync tiles</b>.</li></ul>",
        src: "Future Imperfect p.4" },
      { when: (c) => c.mod("ql"), exp: "mod",
        t: "Quantum Loops — cards & Quantum Warp tiles",
        d: "<ul><li>Shuffle the <b>8 Quantum Loop cards</b>, reveal <b>3</b> face up next to the Main board, and keep the other 5 as a face-down draw deck. (If Time Wave Neutralizer or Time Loop Amplifier appears in the starting offer, replace it and reshuffle it into the deck.)</li>" +
          "<li>Each player adds the <b>Quantum Warp</b> tile to their pool of Warp tiles.</li></ul>",
        src: "Future Imperfect p.7" },
      { when: (c) => c.mod("ic"), exp: "mod",
        t: "Intrigues — Council Chamber, Agendas & Missions",
        d: "<ul><li>Place the <b>Council Chamber board</b> next to the Main board.</li>" +
          "<li>Remove Objective tiles tied to modules/expansions not in play. Separate Agenda tiles into <b>Objectives</b> (dark blue) and <b>Values</b> (yellow) and shuffle them into two face-down piles below the board.</li>" +
          "<li>Give each player their <b>Agenda Benefits card</b>, a <b>Mission standee</b>, and their own shuffled 8-card <b>Mission deck</b> (matched by the arrow on the back). Set the <b>Emergency Missions</b> aside until after the Impact.</li></ul>",
        src: "Future Imperfect p.9" }
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
            "<li>Deal " + (c.p === 2 ? "8" : c.p === 3 ? "5" : "4") + " Starting Asset cards to each player; pick one and pass the rest right until everyone has four. Everyone gains their four cards' assets; the lowest card-number sum is First Player.</li></ul>";
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
        d: (c) => "<ul><li>Each player picks one of the <b>two Leader cards</b> available to their Path" + (c.has("fot") ? " — Fractures adds a <b>third Leader</b> to every Path" : "") + " and places it on the designated spot of their Path board.</li></ul>",
        src: (c) => c.has("fot") ? "Essential p.6 · Fractures p.5" : "Essential p.6" },
      { when: (c) => !c.mod("draft"), exp: "base",
        t: "First Player & starting Water",
        d: "<ul><li>Give each player their <b>Player banner</b>. The player who most recently had a <b>“déjà vu”</b> is First Player — place their banner next to the World Council spaces.</li>" +
          "<li>Clockwise from the First Player, players receive <b>0 / 1 / 1 / 2</b> extra Water.</li></ul>",
        src: "Essential p.6" }
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
        d: "<ul><li>Set up a <b>2-player game</b> with the Chronossus as one player, using the <b>Chronossus side</b> of the Solo board. It gets its 6 Exosuits and 8 Warp tiles — no starting assets, Workers or Focus marker.</li>" +
          "<li>Leave the Endgame Condition cards in the box; instead shuffle the <b>Solo Objective cards</b> and reveal <b>3</b> — you score points for the highest level you reach on each.</li>" +
          "<li>Place the <b>Chronossus board</b> with the 4 Command tokens on their marked positions, and Action tiles <b>C01A / C02A / C03A</b> on its empty spaces (assign randomly in later games). Playing with modules swaps in different Action tiles — see the reference table on Solo p.19.</li>" +
          "<li>Fill its <b>Energy Pool</b> (an opaque container) with 5 Energy Core and 5 Exhausted Energy Core tokens.</li>" +
          "<li>The Chronossus is First Player in Era 1; you receive 1 extra Water. You may use the A or B side of your board.</li></ul>",
        src: "Solo p.8–9, p.19" }
    ]
  },
  {
    title: "Begin Play",
    steps: [
      { when: (c) => c.has("fot"), exp: "fot",
        t: "Era Zero, then Era 1",
        d: "<ul><li>Before Era 1, perform a <b>Warp Phase only</b> (“Era Zero”), placing Warp tiles on the Era Zero tile. You may <b>not</b> warp an Exosuit during Era Zero.</li>" +
          "<li>Then begin Era 1 in full — including a Preparation Phase (shift building stacks and the Technology deck, reveal the next Superproject) and a <b>Paradox Phase</b> (not skipped, unlike the base game).</li>" +
          "<li>Check: before the first Action, three Superprojects should be face up, with two buildings in each secondary stack and two Technologies in the secondary deck.</li></ul>",
        src: "Fractures p.6" },
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
    html: (c) => "<ol><li><b>Preparation</b> — reveal the next Superproject, shift the building stacks (top of each primary stack moves to its secondary stack)" + (c.has("fot") ? ", shift the Technology deck and Anomaly stacks the same way" : "") + ", then deal a new Recruit pool card (4 Workers) and Mine pool card (5 Resources; after the Impact, the topmost is always a Neutronium).</li>" +
      "<li><b>Paradox</b> — skipped in Era 1" + (c.has("fot") ? " (but not when playing Fractures, because of Era Zero)" : "") + ". For each Timeline tile with Warp tiles, the player(s) with the most on it roll the Paradox die (0/1/2 Paradoxes).</li>" +
      "<li><b>Power up</b> — in turn order, place up to <b>6 Exosuits</b> on your board's Hex slots, paying <b>1 Energy Core</b> for each of the three bottom slots used; then gain <b>1 Water per empty Hex slot</b>.</li>" +
      "<li><b>Warp</b> — secretly choose <b>0–2 Warp tiles</b>; all reveal simultaneously and place them on the present Timeline tile, immediately receiving the shown assets from the supply. Warping a Worker costs 1 Water (it arrives Active); warped Exosuits go on your Hex slots.</li>" +
      "<li><b>Action rounds</b> — clockwise from the First Player: any number of Free Actions, then place one Worker (on your board, or in an Exosuit on the Main board) and take the Action — or pass for the rest of the Era.</li>" +
      "<li><b>Clean up</b> — retrieve Workers (Motivated ones return Active, others Tired) and empty Exosuits (back to your supply, unpowered); check for the Impact (end of Era 4" + (c.mod("doomsday") ? " — variable with Doomsday" : "") + (c.has("fot") ? "; end of Era 3 with Fractures" : "") + ") and for game end; move Focus markers to the next Era's tile.</li></ol>",
    src: (c) => c.has("fot") ? "Essential p.7–11 · Fractures p.6" : "Essential p.7–11"
  },
  {
    title: "Paradoxes & Anomalies",
    when: () => true,
    html: (c) => "<ul><li>Receiving your <b>third Paradox token</b> (by any means) immediately causes an <b>Anomaly</b>: stop rolling, return all your Paradox tokens, " + (c.mod("vanom") ? "choose one of the two visible Anomalies (turn order if several players gain one)" : "take an Anomaly tile") + " and place it on the <b>leftmost free building spot</b> of your board (your choice of row if tied; on top of a building if full — that building is blocked until the Anomaly is removed).</li>" +
      (c.mod("vanom")
        ? "<li><b>Variable Anomalies:</b> you do <b>not</b> get the base game's free Warp-tile retrieval when gaining an Anomaly — only if the tile shows the retrieve icon and its Before/After-Impact condition matches. Most new Anomalies have their own positive or negative effects; some act like buildings.</li>" +
          "<li><b>Removing (Variable):</b> place a Worker on your <b>Anomaly Remover tile</b> and pay the cost shown on the Anomaly, then remove any one of your Anomalies from the game.</li>"
        : "<li>When you gain an Anomaly you may retrieve <b>one of your Warp tiles</b> from any Timeline tile (after all Paradox rolls resolve).</li>" +
          "<li><b>Removing:</b> as an Action, place a Worker on the Anomaly and spend <b>2 identical Resources + 2 Water</b> or <b>1 Neutronium + 2 Water</b>; the Anomaly and the Worker both return to the supply, freeing the spot.</li>") +
      "<li>Each Anomaly still on your board at game end is worth <b>−3 VP</b>" + (c.mod("vanom") ? " (−2 VP per Glitch with Fractures scoring; Variable Anomaly values are printed on the tiles)" : "") + ".</li>" +
      "<li>If everyone prefers predictability, you may skip the Paradox die and simply take 1 Paradox whenever you would roll.</li></ul>",
    src: (c) => c.mod("vanom") ? "Essential p.8–9 · Fractures p.14" : "Essential p.8–9"
  },
  {
    title: "Workers, Exosuits & Action Spaces",
    when: () => true,
    html: (c) => "<ul><li><b>Four Worker types:</b> Engineers, Scientists, Administrators, Geniuses" + (c.has("fot") ? ", plus Operators (Fractures)" : "") + ". A <b>Genius</b> may be placed as any type — but may NOT be spent as another type for costs, sent back for Worker Warp tiles, or used for Evacuation conditions.</li>" +
      (c.has("fot") ? "<li>An <b>Operator</b> can be placed anywhere except Genius-only spaces (and a Genius can't go on Operator-only spaces), but gains no Worker-type placement bonuses (no Construct discount, no Genius recruiting, only 3 Water at Purify Water).</li>" : "") +
      "<li><b>Hex spaces</b> (Main board): require a Worker in a powered-up <b>Exosuit</b>; one use per Era. <b>Hex pool spaces:</b> unlimited placements (still need Exosuits). <b>Worker spaces</b> (your board): no Exosuit needed; once per Era each.</li>" +
      "<li>Some spaces restrict Worker types, give type bonuses, cost Water/Resources, or keep the Worker <b>Motivated</b> (returns Active in Clean up).</li>" +
      "<li><b>Free Actions</b> (buildings, Superprojects, Force Workers, some Leaders): once per Era each, any number on your turn, marked with Path markers.</li></ul>",
    src: (c) => c.has("fot") ? "Essential p.11–12 · Fractures p.6" : "Essential p.11–12"
  },
  {
    title: "Main Board Actions",
    when: () => true,
    html: (c) => "<ul><li><b>Construct</b> (Capital): build a face-up building from any primary/secondary stack top onto the leftmost empty spot of its row, paying that spot's cost — or build the <b>Superproject in Focus</b>, paying the costs on the project itself (Workers for Superproject costs may come from Active or Tired). No Administrators; an Engineer saves 1 Titanium.</li>" +
      "<li><b>Recruit</b> (Capital): take a Worker from the Recruit pool into your Active column, with a bonus by type — Scientist: 2 Water · Engineer: 1 Energy Core · Administrator: 1 VP · Genius: any one of those. No Scientists; an Engineer may not select a Genius" + (c.has("fot") ? " (nor may an Operator)" : "") + ".</li>" +
      "<li><b>Research</b> (Capital): set one Research die to any face, roll the other, and take a Breakthrough matching shape + icon (“?” = any icon; you can't set the die to “?”). Scientists only.</li>" +
      "<li>Capital Action spaces: upper free, middle costs 1 Water, lower costs 2 Water (4-player games only).</li>" +
      "<li><b>World Council:</b> copy a Capital Action that has <b>no free spaces</b> (Worker rules of the copied Action apply; space features don't). Left space: pay 2 Water and become <b>First Player</b> — you may place there just for that even if Capital spaces remain" + (c.mod("guardians") ? ". With Guardians, you may also enlist a Guardian here (see below)" : "") + ".</li>" +
      "<li><b>Mine Resource:</b> take 1 Resource from the Mine pool, plus Uranium / Gold / Titanium depending on the space used" + (c.has("fot") ? " (with Fractures, the right-side bonus Resources are not used)" : "") + ". An Engineer stays Motivated.</li>" +
      "<li><b>Purify Water</b> (pool): take 3 Water (+1 if a Scientist).</li>" +
      "<li><b>Trade with Nomads</b> (pool): one exchange — 3 Water ↔ 1 Energy Core; 1 Energy Core ↔ 1 Neutronium; 1 Neutronium ↔ any 2 of Ti/U/Au; any 2 of Ti/U/Au ↔ 3 Water. An Administrator trades twice.</li>" +
      "<li><b>Evacuation</b> (pool; post-Impact only): once per game each, if you meet your Path board's condition — score the printed VP (max 30; later spots suffer the −3 marker), plus bonus VP for the assets your Path board names.</li></ul>",
    src: () => "Essential p.12–15"
  },
  {
    title: "Player Board Actions & Time Travel",
    when: () => true,
    html: (c) => "<ul><li><b>Supply:</b> pay the Water cost shown under your Morale position, move all Tired Workers to Active, then <b>gain 1 Morale</b> (at max: gain the VP shown instead). An Administrator stays Motivated.</li>" +
      "<li><b>Force Workers</b> (Free Action): move all Tired Workers to Active, then <b>lose 1 Morale</b> (at minimum: lose a Worker instead).</li>" +
      "<li><b>Power Plants — Time Travel:</b> activate to (1) move your <b>Focus</b> to a past Timeline tile within the plant's range (never ending in the current Era); (2) optionally pay one of your own Warp tiles on the Focused tile — spend the shown Resource/Water/Worker (from Active)/powered-up Exosuit and take the tile back; (3) if you did both, advance your <b>Time Travel track</b> one step (endgame VP).</li>" +
      "<li>Warp tiles removed any other way (retrieve abilities, Anomaly compensation) do <b>not</b> advance the Time Travel track. Present-Era Warp tiles can't be paid back via Power Plants.</li>" +
      "<li><b>Buildings & Superprojects</b> provide Worker Actions, Free Actions, passive abilities, or one-time effects. Superprojects of earlier Eras can still be built while they are in Focus.</li>" +
      (c.mod("hs") ? "<li><b>Hypersync tiles</b> are not Warp tiles: retrieve them by placing an Exosuit on the matching Hypersync Action space while your Focus is on that tile (+2 VP, no Time Travel advance; Scientist for Research, Administrator for Recruit, Engineer for Construct, Genius anywhere).</li>" : "") +
      "</ul>",
    src: (c) => c.mod("hs") ? "Essential p.16–17 · Future Imperfect p.6" : "Essential p.16–17"
  },
  {
    title: "The Impact & Collapsing Capital",
    when: () => true,
    html: (c) => "<ul><li>The Impact occurs in the Clean up phase of the <b>4th Era</b>" + (c.mod("doomsday") ? " by default — with Doomsday the Trajectory dice move it each Era, Seal Fate can trigger it immediately, and Save Earth can prevent it entirely (game ends at once, with no Evacuation)" : "") + (c.has("fot") ? " (3rd Era with Fractures)" : "") + ".</li>" +
      "<li>Flip the <b>Evacuation tile</b> to its B side, revealing the Evacuation Action, and place the <b>−3 VP marker</b> on its 2nd/3rd/4th spot for 2/3/4 players.</li>" +
      "<li>Cover two of the three top-row Exosuit Hex slots on each Player board with <b>Hex Unavailable</b> tiles — no power-ups or Water income there.</li>" +
      "<li>Place random <b>Collapsing Capital tiles</b> on the Capital Actions' Hexes (2/2/3 per Action for 2/3/4 players): they grant bonus effects, but in the Clean up phase each tile an Exosuit is retrieved from flips to <b>Hex Unavailable</b>" + (c.has("fot") ? ". Fractures adds 9 stronger tiles stacked on top of face-down base tiles" : "") + ".</li>" +
      "<li>In post-Impact Eras the Mine pool's topmost Resource is always <b>Neutronium</b>." + (c.mod("hs") ? " With Hypersync, the 3 Supercharge tiles are added to the Hypersync spaces for extra rewards." : "") + "</li>" +
      "<li>The World Council can still copy Capital Actions once they have no free (uncovered) spaces.</li></ul>",
    src: (c) => {
      const s = ["Essential p.18"];
      if (c.mod("doomsday")) s.push("Classic p.5");
      if (c.has("fot")) s.push("Fractures p.12");
      if (c.mod("hs")) s.push("Future Imperfect p.7");
      return s.join(" · ");
    }
  },
  {
    title: "Game End & Scoring",
    when: () => true,
    html: (c) => "<ul><li>The game ends when <b>all Collapsing Capital tiles have flipped</b> to Hex Unavailable (end of that Era) or after the <b>7th Era</b>" + (c.mod("ic") ? " (6th Era with Intrigues of the Council)" : "") + (c.mod("doomsday") ? " — or immediately if Save Earth tops out (Doomsday)" : "") + ".</li>" +
      "<li><b>Untangle the Continuum:</b> pay back every outstanding Warp tile you can (Workers from Active, Exosuits powered up; no Time Travel advances). Each unpaid Warp tile is <b>−2 VP</b>" + (c.mod("hs") ? "; unpaid Hypersync tiles are −4 VP" : "") + (c.mod("ql") ? "; an unpaid Quantum Warp is −4 VP" : "") + ".</li>" +
      (c.mod("ic")
        ? "<li><b>Agenda grid (Intrigues):</b> score each complete Objective+Value row — whoever meets the Objective scores the Value (possibly negative); ties score in full. Incomplete rows score nothing.</li>"
        : "<li><b>Endgame Conditions:</b> 3 VP for each of the five cards you satisfy (ties all score in full).</li>") +
      "<li><b>Final scoring:</b> buildings, Superprojects, Time Travel track, Morale, VP tokens, minus Anomalies (−3 each) and Timeline penalties. Breakthroughs: 1 VP each, +2 VP per set of three different <b>shapes</b>" + (c.has("fot") ? "; plus Fracture Device progress and Technology card bonuses, −2 VP per Glitch in play (Breakthroughs on the Upgrade tile score nothing)" : "") + ".</li>" +
      "<li><b>Tiebreakers:</b> most Water, then most total Resources; otherwise victory is shared.</li></ul>",
    src: (c) => {
      const s = ["Essential p.19"];
      if (c.has("fot")) s.push("Fractures p.12");
      if (c.mod("hs") || c.mod("ql") || c.mod("ic")) s.push("Future Imperfect p.7–12");
      return s.join(" · ");
    }
  },
  {
    title: "Doomsday Module",
    when: (c) => c.mod("doomsday"),
    html: () => "<ul><li><b>Experiment Action</b> (Hex pool, any Worker): claim the Experiment card <b>in Focus</b> if you meet its condition and pay its cost. Gain its VP, then move the <b>Save Earth</b> tracker up (Paths of Harmony/Dominance) or the <b>Seal Fate</b> tracker down (Salvation/Progress) — collecting any VP printed beside the new spot for your Path.</li>" +
      "<li>Each Preparation phase, flip the Level 1 Experiment below the next Era's tile and deal Level 2 Experiments below empty tiles.</li>" +
      "<li><b>Check for Impact:</b> roll the two Trajectory dice, add the (+)/(−) symbols beside both trackers' positions — more (+): Impact moves 1 Era later; more (−): 1 Era earlier (never behind the current Era).</li>" +
      "<li><b>Seal Fate at the bottom:</b> no roll — place the Impact tile after the current Era and resolve it immediately. <b>Save Earth at the top:</b> the Impact is fully mitigated and the game ends at once — no Evacuation.</li>" +
      "<li>No more tracker movement after the Impact or once either tracker reaches its final slot (Experiments still score VP).</li></ul>",
    src: () => "Classic p.3–5"
  },
  {
    title: "Pioneers of New Earth Module",
    when: (c) => c.mod("pioneers"),
    html: () => "<ul><li><b>Adventure Action</b> (Hex pool, any Worker): total your <b>Exosuit Power</b>; take the topmost free Power slot by the Adventure space (its modifier applies; −3 if none free); choose the <b>5+ deck (1 Water)</b> or <b>10+ deck (2 Water)</b>; draw the top card plus one per Breakthrough on your Exosuit Upgrade board and keep one; roll the Adventure die and add it; meet the card's Power for the <b>Success</b> box, otherwise resolve <b>Failure</b> (card goes to the bottom of the deck).</li>" +
      "<li>Resolve multi-asset results top to bottom; losses you can't pay are skipped.</li>" +
      "<li><b>Power Upgrade</b> (on your Exosuit Upgrade board): place a Resource on a slot — a permanent Power increase by the slot's value. Dominance: Engineers only (and starts the game at Power 2); Harmony/Progress: any Worker; Salvation: a Free Action costing 1 Water, no Worker.</li>" +
      "<li><b>Sensor Upgrade:</b> pay the shown cost, place one of your Breakthroughs (max 3, one of each <b>shape</b>) on the board, gain 2 VP — each Breakthrough there adds an extra Adventure card to your draws (Scientist-only for Harmony/Dominance/Progress; any Worker for Salvation). Harmony instead gains +2 permanent Power per Breakthrough, not the 2 VP.</li>" +
      "<li>In Clean up, also retrieve Path markers from the Power slots.</li></ul>",
    src: () => "Classic p.6–9"
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
    html: () => "<ul><li><b>Era Zero:</b> a Warp-only phase before Era 1 (no Exosuit warps). The Timeline has 3 pre-Impact and 2 post-Impact Eras.</li>" +
      "<li><b>Operators:</b> hired from the Valley (Assimilate), placeable almost anywhere, but gain no type-specific bonuses.</li>" +
      "<li><b>Blinking:</b> as an Action, move 1 Flux Core onto the leftmost empty Fracture Device space, then move one of your placed, occupied Exosuits to a <b>different Action</b> and take it. If the Worker isn't an Operator, roll the Flux and Glitch dice — a Flux number above your visible empty Device spaces adds a <b>Glitch</b> where the Glitch die shows. You can Blink <b>into</b> the Valley but never <b>off</b> it (or off other side boards).</li>" +
      "<li><b>Glitches</b> (−2 VP each at game end) block what they cover: Time Travel track (no advances), Paradox track (Anomalies come sooner), Exosuit slots, buildings, Endgame Conditions, and Supply/Force Workers restrictions.</li>" +
      "<li><b>Valley board:</b> <b>Assimilate</b> — hire an Operator, or spend 2 Gold/Uranium for a Technology card (permanent abilities; some have extra costs). <b>Extract</b> — gain 2 Flux Cores or 2 Energy Cores (Scientist: +1 Flux Core; Engineer: +1 Energy Core; no Administrators; Operators get no bonus). <b>Valley Capital</b> — copy a full Valley Action (like the World Council).</li>" +
      "<li><b>Upgrade Fracture Device</b> (Free Action or Operator-only space, 2 Water + 2 VP version): place a Breakthrough with a <b>new icon</b> on the Upgrade tile and slide it right — more Flux capacity, fewer Glitches, and endgame VP for the highest uncovered value. The Operator retrieve from Worker spaces: only Factories, Life Supports, Labs and Supply/Force Workers.</li></ul>",
    src: () => "Fractures p.6–12"
  },
  {
    title: "Future Imperfect Modules",
    when: (c) => c.mod("neu") || c.mod("hs") || c.mod("ql") || c.mod("ic"),
    html: (c) => "<ul>" +
      (c.mod("neu") ? "<li><b>Neutronide Buildings:</b> four buildings (119/219/319/419) whose effects scale with the number of <b>Power Plants</b> you have.</li>" : "") +
      (c.mod("hs") ? "<li><b>Hypersync:</b> on your turn, instead of placing an Exosuit, place one of your 3 <b>Hypersync tiles</b> above the current Era's tile and take the tile's Capital Action without an Exosuit (Construct at −1 Titanium; Recruit from the supply, limited to types on this Era's Recruit card). Max 1 pending tile per Era. Hypersync tiles count as Warp tiles for Paradox checks, and the player with the most in play makes one extra Paradox roll. Retrieve them via the Hypersync board (+2 VP); unpaid tiles are −4 VP at game end.</li>" : "") +
      (c.mod("ql") ? "<li><b>Quantum Loops:</b> in the Warp phase you may place your <b>Quantum Warp</b> tile instead of a normal one, taking a face-up <b>Quantum Loop card</b> and resolving it immediately (turn order if contested). Pay it back through a Power Plant by spending the <b>Breakthrough</b> shown on your card (advances Time Travel; the card returns to the offer). Unpaid at game end: −4 VP.</li>" : "") +
      (c.mod("ic") ? "<li><b>Intrigues of the Council:</b> each Power Up phase draw 2 <b>Mission cards</b>, keep 1 hidden. Reveal it as a Free Action: all 3 conditions met → pick 2 rewards; 2 met → 1 reward; fewer → lose 1 VP token (also the default if never revealed). The <b>Negotiate</b> Action (Council Chamber, a Capital Action) draws Agenda tiles — Objectives (left column) and Values (right column) — which you place on the <b>Agenda grid</b> for benefits; complete rows score at game end (override unlocked tiles for 2 Water each; matching-icon pairs lock). Your <b>Agenda Benefits card</b> gives four Free Actions powered by spending Agenda tiles (3 uses per Era for the first three).</li>" : "") +
      "</ul>",
    src: () => "Future Imperfect p.4–12"
  },
  {
    title: "Solo — Chronobot & Chronossus",
    when: (c) => c.p === 1,
    html: (c) => c.mod("chronossus")
      ? "<ul><li>The <b>Chronossus</b> plays by Chronobot-style rules with additions. In the Power Up phase it draws 3 tokens from its <b>Energy Pool</b>: it powers up 3+X Exosuits pre-Impact / 2+X post-Impact, where X = unexhausted Energy Cores drawn (one exhausted token returns, the rest leave the game).</li>" +
        "<li>On its turn, roll the <b>AI die</b>; it performs the Action above/below the matching Command token (possibly an <b>Action tile</b>), then the token advances along its matching-color arrow.</li>" +
        "<li>Failed Actions give it <b>1 VP</b>. It rolls Paradoxes last; an Anomaly makes it remove a Warp tile instead of taking real penalties (max 3 Anomalies).</li>" +
        "<li>Its Warp phase places Warp tiles equal to a Paradox-die roll. Exosuit Actions get checked against its board priorities.</li>" +
        "<li><b>Objectives:</b> you score the highest level reached on each of the 3 Solo Objective cards. Beat its score to win.</li>" +
        "<li><b>Modules:</b> the Chronossus supports Doomsday, Pioneers, Guardians, Fractures, Hypersync and Quantum Loops via extra Action tiles and per-module rules — but Doomsday can't combine with Pioneers, Guardians, Fractures or Hypersync, and Fractures can't combine with Guardians (Solo p.19).</li></ul>"
      : "<ul><li>The <b>Chronobot</b> (base game only) always powers up 6 Exosuits pre-Impact / 3 post-Impact, spending nothing. Its Warp phase places Warp tiles equal to a Paradox-die roll (it gains nothing for them).</li>" +
        "<li>On its turn, roll the <b>AI die</b> and perform the Action above/below the matching Command token, then advance the token. If an Action has no free spaces it takes <b>1 VP</b> instead; if it can't be performed, it places the Exosuit (blocking) and takes 1 VP.</li>" +
        "<li>Construct: it takes the highest-VP building of the rolled type (secondary stack if tied; max 3 per type). Superprojects cost it a Breakthrough and it grabs the highest-VP face-up one.</li>" +
        "<li>After it runs out of Exosuits it takes a Time Travel Action, then passes. If you pass first, it finishes to a minimum of <b>3 Actions</b>. It never Evacuates.</li>" +
        "<li>It scores no Warp-tile penalties; Breakthroughs score it 1 VP each +2 per shape set. Beat its total to win.</li></ul>",
    src: (c) => c.mod("chronossus") ? "Solo p.8–13, p.19" : "Solo p.4–7"
  },
  {
    title: "Variants & Module Compatibility",
    when: () => true,
    html: (c) => "<ul>" +
      (c.mod("alt") ? "<li><b>Alternate Timeline:</b> Timeline tiles use their crimson sides. Warp tiles are revealed and placed <b>in player order</b> onto the next empty slots (arrow order); slot symbols give bonuses (Morale, VP, extra asset, remove Paradox) or penalties (lose Morale, gain Paradox). A doubled asset slot still costs only one asset to pay back later.</li>" : "") +
      (c.mod("egdraft") ? "<li><b>Endgame Condition Draft:</b> players draft their five shared Endgame Condition cards instead of random selection.</li>" : "") +
      (c.mod("draft") ? "<li><b>Starting Asset Draft:</b> fixed starter kit plus a pick-and-pass draft of four Asset cards; lowest card sum starts.</li>" : "") +
      "<li><b>Compatibility:</b> Doomsday does not combine with Pioneers (not recommended, Classic p.9) nor with Fractures of Time, Guardians or Hypersync (Solo p.19; no supported combination). Fractures + Guardians is not a supported solo combination. Most other modules mix freely — the rulebooks recommend no more than two or three at once.</li>" +
      (c.has("fot") && c.mod("pioneers") ? "<li><b>Fractures + Pioneers:</b> after the Era Zero Warp phase, each player may spend 1 Ti/U/Au for a free Power Upgrade.</li>" : "") +
      "</ul>",
    src: (c) => {
      const s = [];
      if (c.mod("alt") || c.mod("egdraft") || c.mod("draft")) s.push("Essential p.20");
      s.push("Classic p.9 · Fractures p.15 · Solo p.19");
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
      body: (c) => "<p>It's the 26th century. New Earth is rebuilding after a cataclysm, and each of us leads one of humanity's ideological <b>Paths</b>. We know exactly one thing about the future: at the end of the " + (c.has("fot") ? "third" : "fourth") + " Era, an <b>asteroid hits</b>, and the World Capital starts collapsing. The winner is the Path with the most <b>Victory Points</b> when the dust settles — points come from buildings and Superprojects, Breakthroughs, Morale, Time Travel, Endgame goals, and evacuating the Capital before the end.</p>" +
        "<p>The twist that makes Anachrony unique: <b>time travel</b>. You can borrow resources and workers from your own future — and then, eras later, you have to actually send them back to close the loop, or the timeline punishes you.</p>"
    },
    {
      h: "The shape of an Era",
      body: () => "<p>The game plays over up to seven rounds called <b>Eras</b>. Each Era: we reveal what's available (<b>Preparation</b>), the timeline bites anyone abusing it (<b>Paradox</b>), we <b>power up Exosuits</b>, we <b>Warp</b> in goods from the future, then we alternate <b>placing workers</b> until everyone passes, and finally <b>clean up</b>. That's it — six phases, and the rhythm becomes natural after one round.</p>"
    },
    {
      h: "Exosuits and your Workers",
      body: () => "<p>Your workforce is four specialist types — <b>Engineers, Scientists, Administrators</b>, and flexible <b>Geniuses</b>. On your own Player board they work as-is, but the world outside is hostile: to use the shared <b>Main board</b> a Worker must ride an <b>Exosuit</b>, and you decide each Era how many suits to power up — the bottom slots cost Energy Cores, and every slot you leave empty pays you Water. That power-up decision is the quiet engine of the whole game: suits you don't power are income, suits you do power are reach.</p>"
    },
    {
      h: "Warping — borrowing from your future self",
      body: () => "<p>Each Era you may secretly commit up to <b>two Warp tiles</b>: resources, Water, Workers, even an Exosuit, delivered instantly from the future. The catch: the tile sits on the Timeline until you <b>pay it back</b> — you'll use a <b>Power Plant</b> to focus on a past Era and send the goods back through the rift, which also advances your Time Travel track for points. Ignore your debts and you'll roll for <b>Paradoxes</b>; three Paradoxes spawn an <b>Anomaly</b> that squats on your board for −3 points until you pay to remove it. Unpaid tiles at game end are −2 each. Borrow boldly — but with a plan.</p>"
    },
    {
      h: "The Actions — and why you take them",
      body: (c) => "<ul><li><b>Construct</b> buildings (your engine: more power, more income, more actions) or the era's <b>Superproject</b> (big points and powers).</li>" +
        "<li><b>Recruit</b> new Workers, <b>Research</b> Breakthroughs (they unlock Superprojects and score sets), and <b>Mine</b> for the metals that pay for everything.</li>" +
        "<li><b>Purify Water</b> and <b>Trade with Nomads</b> keep the economy liquid — Water is your action currency.</li>" +
        "<li>The <b>World Council</b> copies a Capital Action that's full — and its left seat steals <b>First Player</b>.</li>" +
        "<li>On your own board, <b>Supply</b> refreshes your Tired workers and buys Morale (endgame points); <b>Force Workers</b> refreshes them for free but costs Morale. Manage that dial.</li></ul>" +
        "<p>Everything funnels toward one moment: the <b>Impact</b>. After Era " + (c.has("fot") ? "3" : "4") + " the Capital starts dying — Capital Actions get one-shot <b>Collapsing tiles</b>, and once they're all used up the game ends. Post-Impact, the <b>Evacuation</b> action opens: once per game, if you meet your Path's condition, it's worth up to 30 points. Time it well; it's usually the biggest single score in the game.</p>"
    },
    { when: (c) => c.mod("doomsday"),
      h: "Doomsday module",
      body: () => "<p>We control the asteroid tonight. The new <b>Experiment</b> action scores points and nudges the <b>Doomsday track</b> — Harmony and Dominance push to <b>save Earth</b>, Salvation and Progress push to <b>seal its fate</b>. The trackers make the Impact arrive later, sooner, or — if Save Earth tops out — never: the game just ends, no Evacuation at all. Watch the dice each Era; the Impact date is now a battlefield.</p>" },
    { when: (c) => c.mod("pioneers"),
      h: "Pioneers of New Earth module",
      body: () => "<p>Your Exosuits can now be <b>upgraded</b> — spend resources for permanent <b>Power</b>, mount Breakthroughs as sensors — and sent on <b>Adventures</b> into the Outback: pick the easy or hard deck, add a die roll to your Power, and either cash in the Success rewards or eat the Failure. It's push-your-luck with an engine behind it: upgrade first, adventure later.</p>" },
    { when: (c) => c.mod("guardians"),
      h: "Guardians of the Council module",
      body: () => "<p>Six giant <b>Guardians</b> can be enlisted at the World Council. They're expensive — including a permanently assigned Worker — but they act <b>without</b> Workers, count as a Genius everywhere, and get a private action space nobody can block. A late-game Guardian is a fourth arm nobody else has.</p>" },
    { when: (c) => c.has("fot"),
      h: "Fractures of Time",
      body: (c) => "<p>This expansion adds the <b>Amethynia Valley</b> and a fifth faction, the <b>Path of Unity</b>. The Valley hires <b>Operators</b> — jack-of-all-trades workers — and sells permanent <b>Technologies</b>. The headline mechanic is <b>Blinking</b>: spend a <b>Flux Core</b> to teleport an already-placed Exosuit to a second action in the same Era — double duty from one worker. Overdo it and you collect <b>Glitches</b>, frozen zones worth −2 each that jam your board. Upgrade your <b>Fracture Device</b> with Breakthroughs to blink more safely. Also: the game is one Era shorter on each side of the Impact, and there's an <b>Era Zero</b> warp before we start — you can borrow from the future before your first turn.</p>" +
        (c.mod("vanom") ? "<p>We're also using <b>Variable Anomalies</b>: each Anomaly is unique — some even useful — and removing one goes through your Anomaly Remover tile.</p>" : "") },
    { when: (c) => c.mod("neu") || c.mod("hs") || c.mod("ql") || c.mod("ic"),
      h: "Future Imperfect modules",
      body: (c) => (c.mod("neu") ? "<p><b>Neutronide Buildings:</b> four new buildings that grow stronger with every Power Plant you own — build them if you're going wide on energy.</p>" : "") +
        (c.mod("hs") ? "<p><b>Hypersync:</b> once per Era you can take a Capital Action <b>without an Exosuit</b> by promising to synchronize it later — place a Hypersync tile, then in a later Era send an Exosuit back to that point to retrieve it for 2 VP. Leave it hanging and it's −4. It's warping, but for actions.</p>" : "") +
        (c.mod("ql") ? "<p><b>Quantum Loops:</b> everyone gets one extra-strong <b>Quantum Warp</b> tile that grants a powerful loop card — but you pay it back with a specific <b>Breakthrough</b>, not goods.</p>" : "") +
        (c.mod("ic") ? "<p><b>Intrigues of the Council:</b> the endgame goals are now <b>player-built</b>. Secret <b>Missions</b> each Era reward positioning; the <b>Negotiate</b> action collects Agenda tiles you place on the Council's grid — pairing an Objective (“most Water”) with a Value (“7 points”). You're literally writing the scoring conditions, so lobby for the categories you're winning. The game ends after Era 6.</p>" : "") },
    { when: (c) => c.p === 1,
      h: (c) => c.mod("chronossus") ? "Solo — the Chronossus" : "Solo — the Chronobot",
      body: (c) => c.mod("chronossus")
        ? "<p>You face the <b>Chronossus</b>, a die-driven boss that powers up a semi-random number of suits from its Energy Pool, takes actions off a rotating command wheel, blocks spaces, wins buildings, and banks a point every time you deny it. You score three shared <b>Solo Objectives</b> by tiers; beat its total to win.</p>"
        : "<p>You face the <b>Chronobot</b>: an efficient die-driven rival that always powers six suits, blocks the spaces you wanted, and takes a point whenever it fails. No Endgame Conditions in solo — just beat its score. It never evacuates; you should.</p>" },
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
        items.push("<li><b>Worker-type restrictions per action</b> — the icons on the spaces will tell you; Geniuses fit anywhere.</li>");
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
