/* =============================================================================
   Dune: Imperium & Dune: Imperium — Uprising · Setup & Reference Utility · data
   All content sourced from the official rulebooks and FAQ (see citations).
   ============================================================================= */
var DI = {};

DI.expMeta = {
  base:  { name: "Imperium",      cls: "tag-base" },
  ix:    { name: "Rise of Ix",    cls: "tag-ix" },
  imm:   { name: "Immortality",   cls: "tag-imm" },
  upr:   { name: "Uprising",      cls: "tag-upr" },
  bl:    { name: "Bloodlines",    cls: "tag-bl" },
  choam: { name: "CHOAM Module",  cls: "tag-choam" },
  tech:  { name: "Tech Module",   cls: "tag-tech" },
  epic:  { name: "Epic Mode",     cls: "tag-epic" },
  faq:   { name: "FAQ",           cls: "tag-faq" }
};

DI.games = [
  { id: "imperium", name: "Dune: Imperium", blurb: "The original 2020 game — the Mentat, The Great Flat, Foldspace. Expands with Rise of Ix and Immortality." },
  { id: "uprising", name: "Dune: Imperium — Uprising", blurb: "The 2023 standalone sequel — Spies, sandworms, Objectives and a 6-player team mode. Expands with Bloodlines." }
];

DI.expansions = [
  { id: "base", games: ["imperium"], short: "Dune: Imperium", year: "2020", blurb: "The core game. Always in play." },
  { id: "upr",  games: ["uprising"], short: "Uprising (core)", year: "2023", blurb: "The standalone sequel. Always in play." },
  { id: "ix",   games: ["imperium", "uprising"], short: "Rise of Ix",  year: "2021", blurb: "Ix board, Tech tiles, dreadnoughts, the Shipping track, 6 Leaders, Epic Game Mode. Compatible with Uprising (Uprising p.18)." },
  { id: "imm",  games: ["imperium", "uprising"], short: "Immortality", year: "2022", blurb: "Bene Tleilax board, research track, specimens, Tleilaxu cards and Graft. Compatible with Uprising (Uprising p.18)." },
  { id: "bl",   games: ["uprising"], short: "Bloodlines",    year: "2024", blurb: "Sardaukar Commanders and Skills, 8 Leaders, new cards, plus the optional Tech Module." }
];

DI.modules = [
  { id: "choam", games: ["uprising"], requires: "upr", name: "CHOAM Module", summary: "Contracts mini-expansion (included in the Uprising box)",
    description: "Adds 20 CHOAM contracts, 4 Intrigue and 4 Imperium cards, and the Shaddam Corrino IV Leader. Recommended after your first game.", src: "Uprising p.16" },
  { id: "tech", games: ["uprising"], requires: "bl", name: "Tech Module", summary: "Ixian Embassy & 18 Tech tiles (included in the Bloodlines box)",
    description: "Adds the Ixian Embassy board, 18 Tech tiles, 2 Intrigue and 2 Imperium cards, and the Kota Odax of Ix Leader.", src: "Bloodlines p.6" },
  { id: "epic", games: ["imperium", "uprising"], requires: "ix", name: "Epic Game Mode", summary: "Longer, more intense game — play to 12 VP",
    description: "Play to 12 Victory Points. No Conflict I cards, Control the Spice starting card, 1 starting Intrigue card, 5 starting troops. In Uprising, add Economic Supremacy as the fifth Conflict III card.", src: "Rise of Ix p.10 · Uprising p.18" },
  { id: "goto11", games: ["imperium"], requires: "imm", name: "“Go to 11” variant", summary: "Suggested longer game with Immortality — play to 11 VP",
    description: "With Immortality's extra deck-building options, veteran groups may play to 11 VP (in a 4-player game, start at 0 and play to 10).", src: "Immortality p.12" }
];

/* =============================================================================
   SETUP PHASES
   c = { game, has(exp), p, mod(id) }
   ============================================================================= */
DI.phases = [
  {
    title: "Game Board & General Supply",
    steps: [
      { when: (c) => c.game === "imperium", exp: "base",
        t: "Place the game board and the Mentat",
        d: "<ul><li>Place the game board in the center of your play area.</li><li>Place the <b>Mentat</b> token on the Mentat space of the board.</li></ul>",
        src: "Base p.4" },
      { when: (c) => c.game === "uprising", exp: "upr",
        t: (c) => c.p === 6 ? "Place the game board — 6-player side" : "Place the game board and the Shield Wall",
        d: (c) => c.p === 6
          ? "<ul><li>Use the <b>reverse side</b> of the game board. The Emperor and Fremen Factions are replaced by the <b>Great Houses</b> and <b>Fringe Worlds</b> Factions, and extra board spaces are added.</li><li>Place the <b>Shield Wall token</b> in the marked area below the Spice Refinery space.</li><li>There is no Mentat in Uprising.</li></ul>"
          : "<ul><li>Place the game board with the standard side face up.</li><li>Place the <b>Shield Wall token</b> in the marked area below the Spice Refinery board space.</li><li>There is no Mentat in Uprising.</li></ul>",
        src: (c) => c.p === 6 ? "Uprising p.4 · Supplements (6P) p.8" : "Uprising p.4" },
      { when: () => true, exp: (c) => c.game === "uprising" ? "upr" : "base",
        t: "Place the four Alliance tokens",
        d: "<ul><li>Place the four <b>Alliance tokens</b> on the marked areas of the Factions' Influence tracks: Emperor, Spacing Guild, Bene Gesserit, and Fremen." +
           "</li></ul><p class='inline-note'>6-player game: the reverse board uses Great Houses and Fringe Worlds in place of Emperor and Fremen; place Alliance tokens on all four tracks shown.</p>",
        src: "Base p.4 · Uprising p.4" },
      { when: (c) => c.has("ix"), exp: "ix",
        t: "Rise of Ix — CHOAM overlay, Ix board & Tech tiles",
        d: (c) => c.game === "uprising"
          ? "<ul><li>Keep the <b>CHOAM board overlay folded in half</b> and cover only the top-right corner of the Uprising board — this creates the CHOAM section and covers the <b>Assembly Hall</b> and <b>Gather Support</b> spaces, leaving the rest of the Landsraad unchanged.</li>" +
            "<li>Place the <b>Ix board</b> next to the game board.</li>" +
            "<li>Shuffle the <b>18 Tech tiles</b> face down, divide them into <b>three stacks of 6</b>, place them on the three spaces of the Ix board, and turn the top tile of each stack face up.</li>" +
            "<li><b>Observation posts:</b> the CHOAM overlay and Ix board predate Uprising — play as if each has one post: one connecting <b>Interstellar Shipping and Smuggling</b>, the other connecting <b>Tech Negotiation and Dreadnought</b>.</li></ul>"
          : "<ul><li>Place the <b>CHOAM board overlay</b> on top of the upper-right corner of the game board (covering the original Landsraad and CHOAM sections).</li><li>Place the <b>Ix board</b> next to the game board.</li><li>Shuffle the <b>18 Tech tiles</b> face down, divide them into <b>three stacks of 6</b>, place the stacks on the three spaces of the Ix board, and turn the top tile of each stack face up.</li></ul>",
        src: (c) => c.game === "uprising" ? "Rise of Ix p.3 · Uprising p.18" : "Rise of Ix p.3" },
      { when: (c) => c.has("imm"), exp: "imm",
        t: "Immortality — Bene Tleilax board & Research Station overlay",
        d: (c) => "<ul><li>Place the <b>Bene Tleilax board</b> above where the Imperium Row will be. (You may position it anywhere convenient — keep the Imperium and Tleilaxu Rows close together.)</li><li>Place <b>2 spice</b> from the bank on the <b>fourth space of the Tleilaxu track</b>.</li><li>Place the <b>Reclaimed Forces</b> card to the left of the Bene Tleilax board.</li><li>Place the <b>Research Station overlay</b> on top of the Research Station space of the game board." +
          (c.game === "uprising" ? " (Uprising's Research Station differs from the original, but you should <b>still cover it</b> with the overlay.)" : "") + "</li></ul>",
        src: (c) => c.game === "uprising" ? "Immortality p.4–5 · Uprising p.18" : "Immortality p.4–5" },
      { when: (c) => c.game === "uprising" && c.mod("choam"), exp: "choam",
        t: "CHOAM Module — contracts",
        d: "<ul><li>Shuffle the <b>20 contracts</b> face down.</li><li>Flip <b>two face up</b> and place them on the marked spaces beneath the Landsraad Council.</li><li>Place the remaining 18 face down in the bank.</li></ul>",
        src: "Uprising p.16" },
      { when: (c) => c.game === "uprising" && c.has("bl"), exp: "bl",
        t: "Bloodlines — Sardaukar Commanders & Skills",
        d: (c) => "<ul><li>Take the <b>7 Sardaukar Commanders</b> you prefer (wood or plastic — not both; they are meant to be limited).</li>" +
           "<li>Place five on the board, one each on: <b>Sardaukar, Dutiful Service, Deliver Supplies, High Council,</b> and <b>Gather Support</b> (leave room for an Agent on each space).</li>" +
           (c.has("ix")
            ? "<li><b>With Rise of Ix</b>, the CHOAM overlay covers Gather Support" + (c.p === 4 ? " and Assembly Hall" : "") + ": place that Sardaukar Commander on <b>Dreadnought</b> instead" + (c.p === 4 ? ", and the 4-player game's sixth Commander on <b>Tech Negotiation</b>" : "") + ".</li>"
            : (c.p === 4 ? "<li><b>4-player game:</b> place a sixth Sardaukar Commander on the <b>Assembly Hall</b> space.</li>" : "<li>Return the sixth Sardaukar Commander to the box (it is used only in 4-player games).</li>")) +
           "<li>Place the final Sardaukar Commander in the <b>bank</b> (used with the Sardaukar Standard Imperium card).</li>" +
           "<li>Shuffle the <b>14 Sardaukar Commander Skills</b> face down, place the stack near the board, and deal <b>four face up</b>.</li></ul>",
        src: (c) => c.has("ix") ? "Bloodlines p.3, p.7" : "Bloodlines p.3" },
      { when: (c) => c.game === "uprising" && c.mod("tech"), exp: "tech",
        t: "Tech Module — Ixian Embassy & Tech tiles",
        d: (c) => "<ul><li>Place the <b>Ixian Embassy board</b> next to the game board.</li>" +
           (c.mod("choam") ? "" : "<li>Playing <b>without</b> the CHOAM Module: exclude the <b>CHOAM Transports</b> Tech tile.</li>") +
           "<li>Shuffle the <b>18 Tech tiles</b> face down, divide them into <b>three stacks of 6</b> (as evenly as possible if any were excluded), place them on the three spaces of the Ixian Embassy board, and turn the top tile of each stack face up.</li></ul>",
        src: "Bloodlines p.6" },
      { when: () => true, exp: (c) => c.game === "uprising" ? "upr" : "base",
        t: "Create the bank",
        d: (c) => c.game === "uprising"
          ? "<ul><li>Create a bank next to the game board with the <b>Solari, spice,</b> and remaining <b>water</b> tokens.</li><li>Add the <b>sandworms</b> you prefer (wood, plastic, or both — they are not limited; substitute if you run out).</li><li>Add the <b>4 Maker Hooks tokens</b> to the bank.</li></ul>"
          : "<ul><li>Create a bank next to the game board with the <b>Solari, spice,</b> and remaining <b>water</b> tokens. (They aren't meant to be limited — substitute if you run out.)</li></ul>",
        src: (c) => c.game === "uprising" ? "Uprising p.5" : "Base p.5" }
    ]
  },
  {
    title: "Conflict, Intrigue & Imperium Decks",
    steps: [
      { when: (c) => !c.mod("epic"), exp: (c) => c.game === "uprising" ? "upr" : "base",
        t: "Build the 10-card Conflict Deck",
        d: (c) => {
          let extra = "";
          if (c.game === "imperium" && c.has("ix")) extra = "<li><b>Rise of Ix:</b> add the new Conflict cards to the pool before building the deck. You will now have unused Conflict III cards — return all unused Conflict cards to the box without looking at them.</li>";
          if (c.game === "uprising" && c.has("ix")) extra += "<li><b>Rise of Ix:</b> it is recommended <b>not</b> to add the Ix Conflict cards to Uprising — matching battle icons gets harder. (You may if you wish.)</li>";
          if (c.game === "uprising" && c.has("bl")) extra += "<li><b>Bloodlines:</b> add the new Conflict cards to the pool before building the deck, then build it the same way. Return unused cards to the box without looking at them.</li>";
          return "<ul><li>Separate the Conflict cards by their backs: <b>Conflict I, II, III</b>.</li>" + extra +
            "<li>Shuffle the <b>Conflict III</b> cards and place <b>four</b> face down in the marked area of the board.</li>" +
            "<li>Shuffle the <b>Conflict II</b> cards and deal <b>five</b> face down on top of them.</li>" +
            "<li>Shuffle the <b>Conflict I</b> cards and deal <b>one</b> face down on top.</li>" +
            "<li>The deck is 10 cards: 1× Conflict I on top, 5× Conflict II, then 4× Conflict III on the bottom. Return unused Conflict cards to the box without looking at them.</li></ul>";
        },
        src: (c) => {
          const s = [c.game === "uprising" ? "Uprising p.4" : "Base p.4"];
          if (c.has("ix")) s.push(c.game === "uprising" ? "Uprising p.18" : "Rise of Ix p.3");
          if (c.game === "uprising" && c.has("bl")) s.push("Bloodlines p.3");
          return s.join(" · ");
        } },
      { when: (c) => c.mod("epic"), exp: "epic",
        t: "Build the Epic Conflict Deck (no Conflict I)",
        d: (c) => "<ul><li>Do <b>not</b> use any Conflict I cards.</li>" +
          (c.game === "uprising" ? "<li>Uprising has only four Conflict III cards — add <b>Economic Supremacy</b> from Rise of Ix as the fifth.</li>" : "") +
          "<li>Shuffle and place <b>5 random Conflict III</b> cards face down, then <b>5 random Conflict II</b> cards on top of them.</li><li>Return unused Conflict cards to the box without looking at them.</li></ul>",
        src: (c) => c.game === "uprising" ? "Rise of Ix p.10 · Uprising p.18" : "Rise of Ix p.10" },
      { when: () => true, exp: (c) => c.game === "uprising" ? "upr" : "base",
        t: "Shuffle the Intrigue Deck",
        d: (c) => {
          const adds = [];
          if (c.has("ix")) adds.push("<b>17</b> Rise of Ix Intrigue cards");
          if (c.has("imm")) adds.push("<b>15</b> Immortality Intrigue cards");
          if (c.mod("choam")) adds.push("<b>4</b> CHOAM Module Intrigue cards");
          if (c.has("bl")) adds.push("<b>15</b> Bloodlines Intrigue cards");
          if (c.mod("tech")) adds.push("<b>2</b> Tech Module Intrigue cards");
          return "<ul>" + (adds.length ? "<li>Shuffle in the " + adds.join(", the ") + ".</li>" : "") +
            "<li>Shuffle the Intrigue Deck and place it face down along the edge of the game board.</li></ul>";
        },
        src: (c) => {
          const s = [c.game === "uprising" ? "Uprising p.4" : "Base p.4"];
          if (c.has("ix")) s.push("Rise of Ix p.3");
          if (c.has("imm")) s.push("Immortality p.5");
          if (c.game === "uprising" && c.mod("choam")) s.push("Uprising p.16");
          if (c.game === "uprising" && c.has("bl")) s.push("Bloodlines p.3");
          if (c.game === "uprising" && c.mod("tech")) s.push("Bloodlines p.6");
          return s.join(" · ");
        } },
      { when: () => true, exp: (c) => c.game === "uprising" ? "upr" : "base",
        t: "Shuffle the Imperium Deck & deal the Imperium Row",
        d: (c) => {
          const adds = [];
          if (c.has("ix")) adds.push("<b>35</b> Rise of Ix Imperium cards");
          if (c.has("imm")) adds.push("<b>30</b> Immortality Imperium cards");
          if (c.mod("choam")) adds.push("<b>4</b> CHOAM Module Imperium cards");
          if (c.has("bl")) adds.push("<b>25</b> Bloodlines Imperium cards");
          if (c.mod("tech")) adds.push("<b>2</b> Tech Module Imperium cards");
          return "<ul>" + (adds.length ? "<li>Shuffle in the " + adds.join(", the ") + " <b>before</b> forming the Row.</li>" : "") +
            "<li>Shuffle the Imperium Deck and place it face down.</li><li>Deal <b>5 cards face up</b> from it to form the <b>Imperium Row</b>.</li></ul>";
        },
        src: (c) => {
          const s = [c.game === "uprising" ? "Uprising p.4" : "Base p.4"];
          if (c.has("ix")) s.push("Rise of Ix p.3");
          if (c.has("imm")) s.push("Immortality p.4");
          if (c.game === "uprising" && c.mod("choam")) s.push("Uprising p.16");
          if (c.game === "uprising" && c.has("bl")) s.push("Bloodlines p.3");
          if (c.game === "uprising" && c.mod("tech")) s.push("Bloodlines p.6");
          return s.join(" · ");
        } },
      { when: () => true, exp: (c) => c.game === "uprising" ? "upr" : "base",
        t: "Place the Reserve cards",
        d: (c) => c.game === "uprising"
          ? "<ul><li>Next to the Imperium Row, place the Reserve cards in two stacks: <b>Prepare the Way</b> and <b>The Spice Must Flow</b>.</li><li>There are <b>no Foldspace cards</b> in Uprising.</li></ul>"
          : "<ul><li>Next to the Imperium Row, place the Reserve cards in three stacks: <b>Arrakis Liaison</b>, <b>The Spice Must Flow</b>, and <b>Foldspace</b>.</li></ul>",
        src: (c) => c.game === "uprising" ? "Uprising p.4–5" : "Base p.4" },
      { when: (c) => c.game === "imperium" && c.has("imm"), exp: "imm",
        t: "Immortality — Tleilaxu Deck & Row",
        d: "<ul><li>Shuffle the <b>Tleilaxu Deck</b> and place it face down above the Imperium Deck.</li><li>Deal <b>two cards face up</b> next to Reclaimed Forces to create the <b>Tleilaxu Row</b> above the Imperium Row.</li></ul>",
        src: "Immortality p.4" }
    ]
  },
  {
    title: "Leaders & Player Components",
    steps: [
      { when: (c) => c.game === "imperium", exp: "base",
        t: "Each player takes a Leader",
        d: (c) => "<ul><li>Each player takes a <b>Leader card</b> and places it in front of them (choose or deal at random)." +
          (c.has("ix") ? " Rise of Ix adds <b>6 new Leaders</b> — any combination of new and old may be used.</li>" : "</li>") +
          "<li>Leaders show <b>1–3 icons</b> after their names — more icons means more strategic complexity. <b>First game?</b> Each player should pick a 1-icon Leader: Paul Atreides, Glossu “The Beast” Rabban, Earl Memnon Thorvald, or Count Ilban Richese.</li></ul>",
        src: (c) => c.has("ix") ? "Base p.4 · Rise of Ix p.3" : "Base p.4" },
      { when: (c) => c.game === "uprising", exp: "upr",
        t: "Each player takes a Leader",
        d: (c) => "<ul><li>Each player takes a <b>Leader</b> (choose or select at random).</li>" +
          "<li>Leaders show <b>1–3 icons</b> after their names — more icons means more strategic complexity. For your first game, each player should choose a <b>1-icon</b> Leader.</li>" +
          "<li>Do <b>not</b> use <b>Shaddam Corrino IV</b> unless you are using the CHOAM Module." + (c.mod("choam") ? " (You are — he is available.)" : "") + "</li>" +
          (c.has("ix") ? "<li><b>Rise of Ix:</b> its <b>6 Leaders</b> may be used — but <b>Ilesa Ecaz</b> requires the Foldspace cards from the original Dune: Imperium (she alone may acquire them).</li>" : "") +
          (c.has("bl") ? "<li><b>Bloodlines:</b> add the <b>8 new Leaders</b>; any combination of new and existing Leaders may be chosen.</li>" : "") +
          (c.mod("tech") ? "<li><b>Tech Module:</b> a player may choose <b>Kota Odax of Ix</b> as their Leader.</li>" : "") +
          "</ul>",
        src: (c) => {
          const s = ["Uprising p.4"];
          if (c.has("ix")) s.push("Uprising p.18");
          if (c.has("bl")) s.push("Bloodlines p.3");
          if (c.mod("tech")) s.push("Bloodlines p.6");
          return s.join(" · ");
        } },
      { when: () => true, exp: (c) => c.game === "uprising" ? "upr" : "base",
        t: "Starting deck & water",
        d: (c) => {
          let deck = "<li>Each player takes a <b>10-card starting deck</b>, shuffles it, and places it face down to the left of their Leader.</li>";
          if (c.has("imm")) deck += "<li><b>Immortality:</b> each player removes the two copies of <b>Dune, the Desert Planet</b> from their starting deck (return them to the box) and replaces them with two copies of <b>Experimentation</b>.</li>";
          if (c.mod("epic")) deck += c.has("imm")
            ? "<li><b>Epic + Immortality:</b> do <b>not</b> replace a starting card with Control the Spice. Instead, each player places their <b>Control the Spice</b> card in their <b>discard pile</b> at the start of the game.</li>"
            : "<li><b>Epic Game Mode:</b> each player removes one copy of <b>Dune, the Desert Planet</b> and replaces it with one copy of <b>Control the Spice</b>.</li>";
          return "<ul>" + deck + "<li>Each player takes <b>1 water</b> and places it in their supply.</li></ul>";
        },
        src: (c) => {
          const s = [c.game === "uprising" ? "Uprising p.5" : "Base p.5"];
          if (c.has("imm")) s.push("Immortality p.5");
          if (c.mod("epic")) s.push(c.has("imm") ? "Rise of Ix p.10 · Immortality p.12" : "Rise of Ix p.10");
          return s.join(" · ");
        } },
      { when: (c) => c.p !== 6, exp: (c) => c.game === "uprising" ? "upr" : "base",
        t: "Player pieces — Agents, markers, cubes & troops",
        d: (c) => "<ul><li>Place <b>two Agents</b> of your color on your Leader. Set your third Agent (your <b>Swordmaster</b>) next to the game board.</li>" +
          "<li>Place one disc on the <b>Score track</b>: on the <b>1</b> space in a 4-player game, otherwise on <b>0</b>.</li>" +
          "<li>Place your <b>Combat marker</b> on the <b>0</b> space of the Combat track.</li>" +
          "<li>Place <b>four cubes</b>, one each, on the bottom spaces of the four Factions' Influence tracks.</li>" +
          "<li>Your other <b>12 cubes are troops</b>: place <b>" + (c.game === "imperium" && c.mod("epic") ? "5 (Epic Game Mode)" : "3") + "</b> in the circular garrison nearest you, and the rest in your supply.</li>" +
          (c.game === "uprising" ? "<li>Take your <b>3 Spies</b> and place them in your supply.</li>" : "") +
          (c.has("ix") ? "<li><b>Rise of Ix:</b> place your <b>two dreadnoughts</b> in your supply and your extra disc as a <b>Freighter</b> on the bottom space of the Shipping track.</li>" : "") +
          (c.has("imm") ? "<li><b>Immortality:</b> take your two new discs — place one as a <b>Tleilaxu token</b> on the leftmost space of the Tleilaxu track and one as a <b>research token</b> on the leftmost space of the research track. Take a <b>Family Atomics token</b> into your supply.</li>" : "") +
          (c.mod("epic") ? "<li><b>Epic Game Mode:</b> each player draws <b>1 Intrigue card</b>. (A Viscount Hundro Moritani player waits until all players have drawn, then uses the Intelligence ability.)</li>" : "") +
          "</ul>",
        src: (c) => {
          const s = [c.game === "uprising" ? "Uprising p.5" : "Base p.5"];
          if (c.has("ix")) s.push("Rise of Ix p.3");
          if (c.has("imm")) s.push("Immortality p.4–5");
          if (c.mod("epic")) s.push("Rise of Ix p.10");
          return s.join(" · ");
        } },
      { when: (c) => c.p === 6, exp: "upr",
        t: "Six-player game — teams, Commanders & seating",
        d: "<ul><li>Form <b>two teams of three</b>, each led by a Commander: <b>Muad'Dib</b> or <b>Shaddam Corrino IV</b>. The other four Leaders pair up as <b>Allies</b>.</li>" +
          "<li><b>Recommended teams:</b> Muad'Dib with Gurney Halleck, Lady Jessica, Staban Tuek; Shaddam with Feyd-Rautha Harkonnen, Lady Margot Fenring, Princess Irulan. Lady Amber Metulli can play on either side.</li>" +
          "<li>Commanders sit opposite each other — Muad'Dib at the bottom of the board (“on Arrakis”), Shaddam at the top (“at the Landsraad”). Allies sit so play alternates between teams clockwise.</li>" +
          "<li>Each Commander takes their <b>personal board</b>: Muad'Dib the Fremen board, Shaddam the Emperor board. Commanders use the special <b>Muad'Dib / Shaddam starting decks</b> and arrow-marked Agent tokens.</li>" +
          "<li>Commanders do <b>not</b> take troops, Combat markers, Control markers, or normal Agents — they do take Spies and two discs. Allies set up normally (Agents, Swordmaster, Score marker on 0, Combat marker, Influence cubes, 3 garrison troops, 3 Spies, 1 water).</li>" +
          "<li>Set the <b>6 Swordmaster Bonus tokens</b> near the board.</li></ul>",
        src: "Supplements (6P) p.7–9" },
      { when: (c) => c.game === "imperium", exp: "base",
        t: "Determine the first player",
        d: "<ul><li>Randomly determine a first player; they take the <b>First Player marker</b>.</li></ul>",
        src: "Base p.5" },
      { when: (c) => c.game === "uprising", exp: "upr",
        t: "Deal Objectives & determine the first player",
        d: (c) => "<ul><li>Shuffle the <b>Objective cards</b>. Some are marked <b>“1-3P”</b> or <b>“4/6P”</b> — omit any that don't match your player count" +
          (c.p >= 4 ? " (keep the 4/6P ones)" : " (keep the 1-3P ones)") + ".</li>" +
          "<li>Each player draws <b>one Objective</b> at random and places it <b>face up</b> in their supply.</li>" +
          "<li>The player whose Objective shows the <b>First Player marker</b> takes that marker.</li></ul>",
        src: "Uprising p.5" }
    ]
  },
  {
    title: "Solo & Two-Player — Rivals & House Hagal",
    steps: [
      { when: (c) => c.game === "imperium" && c.p === 1, exp: "base",
        t: "Solo — set up two Rivals & choose difficulty",
        d: (c) => "<ul><li>Choose a <b>difficulty</b>: <b>Mercenary</b> (novice — you start with +1 Solari and +1 spice; Rivals have no garrison troops and 1 Intrigue card; Rival Swordmasters 5 Conflict cards down), <b>Sardaukar</b> (veteran — 5 Solari token on the Mentat space; Rivals start with 3 garrison troops and 1 Intrigue card; Swordmasters 4 cards down), or <b>Mentat</b> (expert — as Sardaukar but no Rival Intrigue card and Swordmasters 3 cards down). <b>Kwisatz Haderach</b> (expert+): as Mentat, and you can't gain a Swordmaster.</li>" +
          "<li>Choose <b>two Leaders</b> as Rivals — they use only their Signet Ring ability. Rivals can't play Paul Atreides or Helena Richese. (First solo game: Memnon Thorvald and Glossu “The Beast” Rabban are recommended.)</li>" +
          "<li>For each Rival: a cube on the bottom of each Influence track, garrison troops per difficulty (rest in supply), two Agents in its supply, and its <b>Swordmaster inserted into the Conflict Deck</b> with the difficulty's number of cards on top of it.</li>" +
          "<li>If the difficulty calls for it, place a <b>5 Solari token</b> on the Mentat space — it costs 5 Solari this game.</li>" +
          "<li>Remove all cards marked <b>“2P”</b> from the House Hagal deck (the Reshuffle card and three Arrakeen cards), shuffle it, and place it near the Rivals.</li>" +
          "<li>You and your Rivals each start with <b>1 water</b> plus any difficulty extras. The Rival on your left takes the First Player marker.</li>" +
          (c.has("ix") ? "<li><b>Rise of Ix:</b> remove the two <b>Hall of Oratory</b> and two <b>Rally Troops</b> cards from the House Hagal deck; shuffle in the new House Hagal cards, but remove the two <b>Interstellar Shipping</b> cards marked “2P”.</li>" : "") +
          (c.has("imm") ? "<li><b>Immortality:</b> remove the three original <b>Carthag</b> cards from the House Hagal deck; shuffle in the 4 new House Hagal cards (three Carthag, one Research Station). Place <b>Tleilaxu tokens</b> for each Rival at the start of the Tleilaxu track — Rivals don't use the research track.</li>" : "") +
          "</ul>",
        src: (c) => {
          const s = ["Base p.20"];
          if (c.has("ix")) s.push("Rise of Ix p.8");
          if (c.has("imm")) s.push("Immortality p.13");
          return s.join(" · ");
        } },
      { when: (c) => c.game === "imperium" && c.p === 2, exp: "base",
        t: "Two players — set up House Hagal (spoiler)",
        d: (c) => "<ul><li>A third, automated player — <b>House Hagal</b> — competes as a spoiler. It doesn't collect resources, build a deck, earn rewards, or score Victory Points; it only occupies board spaces and contests Conflicts.</li>" +
          "<li>Choose a color for House Hagal. Place one of its cubes on the bottom space of each of the four Influence tracks and the rest in its supply — it starts with <b>no troops in its garrison</b>.</li>" +
          "<li>Remove the three <b>Arrakeen</b> cards marked <b>“1P”</b> from the House Hagal deck, shuffle the rest, and place the deck and House Hagal's <b>three Agents</b> near its supply.</li>" +
          "<li>After <b>each of the First Player's Agent turns</b>, House Hagal takes an Agent turn (while it has Agents remaining): reveal House Hagal cards until one shows an unoccupied space.</li>" +
          (c.has("ix") ? "<li><b>Rise of Ix:</b> remove the two <b>Hall of Oratory</b> and two <b>Rally Troops</b> cards; shuffle in the new House Hagal cards, but remove the four cards marked <b>“1P”</b> (two Dreadnought, two Tech Negotiation). The Rival ignores Tech tiles completely in a two-player game.</li>" : "") +
          (c.has("imm") ? "<li><b>Immortality:</b> remove the three original <b>Carthag</b> cards and shuffle in the 4 new House Hagal cards. The solo-only Tleilaxu rules don't apply to two-player games.</li>" : "") +
          "</ul>",
        src: (c) => {
          const s = ["Base p.19"];
          if (c.has("ix")) s.push("Rise of Ix p.8–9");
          if (c.has("imm")) s.push("Immortality p.13");
          return s.join(" · ");
        } },
      { when: (c) => c.game === "uprising" && c.p <= 2, exp: "upr",
        t: (c) => c.p === 1 ? "Solo — set up two Rivals" : "Two players — set up one shared Rival",
        d: (c) => "<ul>" +
          (c.p === 1
            ? "<li>Choose <b>two Rival cards</b> as opponents. The lower a Rival's Swordmaster value, the harder it is — for your first solo game, Rivals with Swordmaster values of <b>8 or higher</b> are recommended.</li>" +
              "<li>Choose a <b>difficulty</b>: <b>Mercenary</b> (novice — Rivals start with no garrison troops; you start with an Intrigue card), <b>Sardaukar</b> (veteran — no adjustments), <b>Mentat</b> (expert — use the Brutal Escalation, Expert Deployment, and Smart Politics variants), or <b>Kwisatz Haderach</b> (expert+ — as Mentat, and you can't gain a Swordmaster).</li>"
            : "<li>Choose <b>one Rival card</b> as a shared opponent. (First two-player game: the <b>Streamlined Rivals</b> variant is recommended — use Lady Amber Metulli or Glossu “The Beast” Rabban, who can't win the game.)</li>") +
          "<li>For each Rival: choose a color; a cube on the bottom of each Influence track; <b>3 troops in its garrison</b> (except in a solo Mercenary game) and the rest in its supply; <b>two Agents</b> in its supply and its Swordmaster next to the board; <b>3 Spies and 1 water</b> in its supply.</li>" +
          "<li>Shuffle the <b>House Hagal deck</b> and place it near the Rival(s)." + (c.p === 1 ? " For a solo game, first remove the <b>“Reshuffle”</b> card (marked “2P”)." : "") + "</li>" +
          (c.p === 1
            ? "<li><b>Objectives:</b> you and your Rivals each start with one Objective card, distributed randomly as in a multiplayer game.</li>"
            : "<li><b>Objectives:</b> give the <b>Ornithopter</b> Objective to the Rival and randomly distribute the other two. The Rival never has the First Player marker — it always acts between the two human players.</li>") +
          (c.has("bl") ? "<li><b>Bloodlines:</b> shuffle in the 6 new House Hagal cards — but use the two <b>Tuek's Sietch</b> cards only if a player uses the Esmar Tuek Leader, and the four <b>Acquire Tech</b> cards only in a solo game with the Tech Module. The new Rival cards add more Rival options" + (c.mod("tech") ? " (Kota Odax of Ix: solo + Tech Module only)" : "") + ".</li>" : "") +
          ((c.has("ix") || c.has("imm")) ? "<li><b>Note:</b> the Rise of Ix and Immortality solo rules were written for the original game's House Hagal deck; the Uprising Rivals supplement doesn't cover combining them. Check <b>duneimperium.com/FAQ</b> for current guidance before mixing them into solo/2-player Uprising.</li>" : "") +
          "</ul>",
        src: (c) => {
          const s = ["Supplements (Rivals) p.3"];
          if (c.has("bl")) s.push("Bloodlines p.8");
          return s.join(" · ");
        } }
    ]
  },
  {
    title: "Begin Play",
    steps: [
      { when: () => true, exp: (c) => c.game === "uprising" ? "upr" : "base",
        t: "Start Round 1",
        d: (c) => "<ul><li><b>Round Start:</b> reveal the top card of the Conflict Deck and place it face up beside the deck.</li>" +
          "<li>Each player draws <b>five cards</b> from their own deck to form their hand.</li>" +
          "<li>Beginning with the First Player and going clockwise, take Agent turns (or a Reveal turn) as described in the reference below.</li>" +
          (c.game === "imperium" ? "<li>A Baron Vladimir Harkonnen player secretly chooses their two “Masterstroke” Factions after all setup, before the first round begins (FAQ).</li>" : "") +
          "</ul>",
        src: (c) => c.game === "uprising" ? "Uprising p.8" : (c.game === "imperium" ? "Base p.6 · FAQ p.1" : "Base p.6") }
    ]
  }
];

/* =============================================================================
   RULES REFERENCE
   ============================================================================= */
DI.reference = [
  {
    title: "Objective, Endgame & Tiebreakers",
    when: () => true,
    html: (c) => {
      const target = c.mod("epic") ? "12" : (c.game === "imperium" && c.mod("goto11") ? "11 (4P: start at 0 and play to 10)" : "10");
      return "<ul><li>Gain <b>Victory Points</b> (VP); track them on the Score track. You can score more than 12 VP even though the track ends at 12 (FAQ).</li>" +
        "<li><b>End of the game:</b> at the end of a round (during the Recall phase), if any player has <b>" + target + "+ VP</b>, or if the <b>Conflict Deck is empty</b>, the Endgame is triggered.</li>" +
        "<li>Players may then play <b>Endgame Intrigue cards</b>. Most VP wins.</li>" +
        "<li><b>Tiebreakers, in order:</b> most spice → most Solari → most water → most garrisoned troops. If still tied, the player who most recently took a Reveal turn wins (FAQ)." +
        (c.game === "uprising" && c.mod("tech") ? " The <b>Chaumurky</b> Tech tile beats all of these between tied players (FAQ)." : "") + "</li>" +
        (c.game === "uprising" ? "<li><b>Wild battle icons (Endgame):</b> match a wild icon with any other battle icon in your supply" + (c.has("bl") ? " — including a second wild icon (Bloodlines)" : "") + "; flip the pair face down and gain 1 VP.</li>" : "") +
        (c.p === 6 ? "<li><b>6-player:</b> each player keeps their own Score marker; a <b>team's score is the sum</b> of its three players' scores. Endgame triggers as usual.</li>" : "") +
        "</ul>";
    },
    src: (c) => c.game === "uprising" ? "Uprising p.6, p.15 · Bloodlines p.5 · FAQ" : "Base p.5, p.12 · FAQ"
  },
  {
    title: "Round Structure — the Five Phases",
    when: () => true,
    html: (c) => "<ol><li><b>Round Start</b> — reveal a new Conflict card; each player draws five cards." +
      ((c.game === "imperium" && c.has("ix")) || (c.game === "uprising" && c.mod("tech")) ? " Turn any used (face-down) Tech tiles face up." : "") + "</li>" +
      "<li><b>Player Turns</b> — clockwise from the First Player, each player takes one turn at a time: <b>Agent turns</b> until they run out of Agents (or choose to stop), then one <b>Reveal turn</b>. After your Reveal turn, your turns are skipped for the rest of the phase.</li>" +
      "<li><b>Combat</b> — players with units in the Conflict may play Combat Intrigue cards; then resolve rewards by strength.</li>" +
      "<li><b>Makers</b> — place 1 bonus spice from the bank on each <b>Maker space without an Agent</b>: " +
      (c.game === "uprising" ? "Deep Desert, Hagga Basin, Imperial Basin" + (c.p === 6 ? ", Habbanya Erg" : "") : "The Great Flat, Hagga Basin, Imperial Basin") + ".</li>" +
      "<li><b>Recall</b> — check for the Endgame. Otherwise: recall all Agents" +
      (c.game === "imperium" ? " (the Mentat returns to its space, or goes to the winner of a Sort Through the Chaos Conflict)" : "") +
      "; pass the First Player marker clockwise; begin a new round.</li></ol>",
    src: (c) => c.game === "uprising" ? "Uprising p.8, p.15" : "Base p.6, p.11–12"
  },
  {
    title: "Agent Turns",
    when: () => true,
    html: (c) => "<ul><li>Play <b>one card</b> from your hand and send one Agent to an <b>unoccupied</b> board space whose icon matches an <b>Agent icon</b> on the card. A card with no Agent icons can't be played on an Agent turn.</li>" +
      "<li>Pay the space's <b>costs</b> (before resolving effects — if you can't pay, you can't go) and meet its <b>requirements</b> (e.g. spaces requiring 2 Influence with a Faction).</li>" +
      "<li>Gain the <b>board space effects</b> plus the card's <b>Agent box</b> effects, in any order. Faction spaces also give <b>1 Influence</b> with that Faction.</li>" +
      "<li><b>Arrow effects (cost → effect)</b> are optional, and can be paid <b>only once</b> per turn (FAQ). Effects without “you may” or an arrow are mandatory (FAQ).</li>" +
      "<li><b>Combat spaces</b> (desert art + crossed swords): you may deploy <b>any units recruited this turn</b> plus <b>up to two units from your garrison</b> to the Conflict.</li>" +
      (c.game === "imperium"
        ? "<li><b>Mentat space:</b> pay 2 Solari to take the Mentat as an extra Agent this round (it returns during Recall). Agent icons: Emperor, Spacing Guild, Bene Gesserit, Fremen, Landsraad, City, Spice Trade.</li>"
        : "<li><b>Eight Agent icons:</b> Emperor, Spacing Guild, Bene Gesserit, Fremen, Landsraad, City, Spice Trade, and <b>Spy</b>. The Spy icon sends an Agent to any space connected to an observation post where you have a Spy. There is no Mentat in Uprising.</li>") +
      (c.game === "imperium" && c.has("ix") ? "<li><b>Infiltration icons (Rise of Ix):</b> these special Agent icons may send an Agent to a space an enemy Agent already occupies (optional).</li>" : "") +
      "<li>You may play <b>Plot Intrigue cards</b> at any point during your own Agent or Reveal turns.</li></ul>",
    src: (c) => c.game === "uprising" ? "Uprising p.9–10 · FAQ" : "Base p.7–8 · FAQ"
  },
  {
    title: "Reveal Turn, Persuasion & Acquiring Cards",
    when: () => true,
    html: (c) => "<ul><li><b>Reveal</b> all cards remaining in your hand; gain the effects of their <b>Reveal boxes</b> in any order (not the boxes of cards played earlier on Agent turns).</li>" +
      "<li>Spend <b>Persuasion</b> to acquire cards from the <b>Imperium Row</b> or the <b>Reserve</b> stacks — pool it from multiple sources, split a single source, buy any number of cards. Unspent Persuasion is lost.</li>" +
      "<li>Acquired cards go to your <b>discard pile</b>. The Row is refilled to 5 immediately, so you may buy the replacement too.</li>" +
      "<li><b>Strength:</b> each troop in the Conflict = <b>2</b>" +
      (c.game === "uprising" ? ", each sandworm = <b>3</b>" : "") + (c.has("ix") ? ", each dreadnought = <b>3</b>" : "") +
      ", each sword revealed = <b>1</b>. With no units in the Conflict your strength is 0. Set your Combat marker accordingly" +
      (c.game === "uprising" ? " — at any point while resolving Reveal effects, updating as needed (Uprising change)" : " after revealing, before Clean Up") + ".</li>" +
      "<li>If you <b>draw</b> a card during your Reveal turn, immediately reveal and use it this turn; cards drawn after your Reveal turn are kept for next round (FAQ).</li>" +
      "<li><b>Clean Up:</b> put all cards played and revealed this round into your discard pile.</li>" +
      (c.game === "uprising" && c.has("bl") ? "<li><b>Command (Bloodlines):</b> “Command (6+)” Reveal effects trigger only if you generate 6 or more Persuasion that Reveal turn.</li>" : "") +
      "</ul>",
    src: (c) => c.game === "uprising" ? (c.has("bl") ? "Uprising p.12–13 · Bloodlines p.5 · FAQ" : "Uprising p.12–13 · FAQ") : "Base p.9–10 · FAQ"
  },
  {
    title: "Combat & Conflict Rewards",
    when: () => true,
    html: (c) => "<ul><li>In turn order, each player with at least one unit in the Conflict may play any number of <b>Combat Intrigue cards</b> or pass. Combat resolves once all involved players <b>pass consecutively</b>.</li>" +
      "<li><b>Rewards by strength:</b> highest wins the Conflict and takes the first reward; second-highest takes the second; in a " + (c.p === 6 ? "4- or 6-player" : "4-player") + " game the third-highest takes the third reward. 0 strength gets nothing.</li>" +
      "<li><b>Tie for first:</b> tied players each take the <b>second</b> reward; no one wins the Conflict card. (With 4+ players, if exactly two tie for first, the rest compete for the third reward.) <b>Tie for second:</b> tied players each take the third reward.</li>" +
      "<li>“<b>When you win a Conflict</b>” effects can't be used on a tie (FAQ).</li>" +
      (c.game === "uprising"
        ? "<li><b>Battle icons:</b> the winner takes the Conflict card; if another face-up Conflict or Objective card in their supply shows the <b>same battle icon</b> (Crysknife, Desert Mouse, Ornithopter), flip both face down and gain <b>1 VP</b>.</li>" +
          "<li><b>Sandworm doubling:</b> with a sandworm in the Conflict, <b>double the rewards you take</b> (not control of a location, not battle icons; pay optional costs twice to gain twice).</li>" +
          "<li><b>Control locations:</b> some Conflicts grant control of <b>Arrakeen, Spice Refinery, or Imperial Basin</b> — the controller gains 1 Solari (Arrakeen/Spice Refinery) or 1 spice (Imperial Basin) whenever anyone sends an Agent there, plus one free troop deployed when a Conflict for that space is revealed while they control it.</li>"
        : "<li><b>Control locations:</b> some Conflicts grant control of <b>Arrakeen, Carthag, or Imperial Basin</b> — the controller gains 1 Solari (Arrakeen/Carthag) or 1 spice (Imperial Basin) whenever anyone sends an Agent there, plus one free troop deployed when a Conflict for that space is revealed while they control it.</li>") +
      "<li><b>After rewards:</b> troops return to their owners' <b>supplies</b> (not garrisons); Combat markers reset to 0" +
      (c.game === "uprising" ? "; sandworms return to the bank" : "") +
      (c.has("ix") ? "; <b>dreadnoughts survive</b> — a loser's dreadnoughts return to their garrison, and the winner's must take control of a location (see the Rise of Ix section)" : "") + ".</li></ul>",
    src: (c) => c.game === "uprising" ? (c.has("ix") ? "Uprising p.14–15 · Rise of Ix p.6 · FAQ" : "Uprising p.14–15 · FAQ") : (c.has("ix") ? "Base p.10–11 · Rise of Ix p.6 · FAQ" : "Base p.10–11 · FAQ")
  },
  {
    title: "Factions, Influence & Alliances",
    when: () => true,
    html: (c) => "<ul><li>Send an Agent to a Faction's space (or use card effects) to advance your cube on its <b>Influence track</b>.</li>" +
      "<li>Reaching <b>2 Influence</b> = 1 VP (lost again if you drop below 2). You can score it again if you drop and re-climb — moving up only (FAQ).</li>" +
      "<li>Reaching <b>4 Influence</b> = the bonus shown (kept even if you drop back). The <b>first</b> player to 4 also takes the <b>Alliance token</b> (1 VP).</li>" +
      "<li>An opponent who rises <b>higher</b> on that track takes the Alliance token (and its VP) from you. You also lose it if you fall to 3 or lower — it goes to a player at 4+, or back to the board (FAQ).</li>" +
      (c.game === "uprising" ? "<li>Reaching 2 Influence also unlocks Faction perks: new board spaces for the Emperor (Imperial Privilege), Spacing Guild (Shipping), and Fremen (Sietch Tabr); stronger Bene Gesserit cards.</li>" : "") +
      (c.has("imm") ? "<li><b>The Bene Tleilax are not a Faction</b> — “gain Influence with any Faction” effects can't advance the Tleilaxu track (FAQ).</li>" : "") +
      (c.p === 6 ? "<li><b>6-player:</b> Commanders have no cubes on the main tracks — whichever Ally has the most Influence with a Faction gives the Commander that amount. The reverse board replaces Emperor/Fremen with <b>Great Houses</b> and <b>Fringe Worlds</b>; Commanders also have personal-board Influence tracks whose bonuses benefit the whole team.</li>" : "") +
      "</ul>",
    src: (c) => c.game === "uprising" ? (c.p === 6 ? "Uprising p.7 · Supplements (6P) p.9–10 · FAQ" : "Uprising p.7 · FAQ") : "Base p.8 · FAQ"
  },
  {
    title: "Spies & Observation Posts",
    when: (c) => c.game === "uprising",
    html: (c) => "<ul><li><b>Place a Spy</b> (Spy icon on a card or space) on an unoccupied <b>observation post</b>; each post connects to one or more board spaces. If your supply is empty, you may first recall one of your Spies for no effect.</li>" +
      "<li><b>Infiltrate:</b> recall your Spy from a connected post to send your Agent to a space <b>occupied by another player's Agent</b>.</li>" +
      "<li><b>Gather Intelligence:</b> when you send an Agent to a space, recall your Spy from a connected post to <b>draw a card</b> — decide immediately after placing the Agent, before any effects (FAQ/rulebook).</li>" +
      "<li>One Spy can't do both in the same turn; two different Spies on different posts of the same space can (e.g. Research Station).</li>" +
      "<li><b>Spy Agent icon:</b> send an Agent to any space connected to a post where you have a Spy — the Spy <b>stays</b>.</li>" +
      "<li>To recall a Spy to Infiltrate or Gather Intelligence you must still play a card for your Agent turn (FAQ).</li>" +
      (c.has("bl") ? "<li><b>Deep Cover (Bloodlines):</b> this Spy icon may place your Spy on a post occupied by <b>opponents'</b> Spies (never where you already have one).</li>" : "") +
      "</ul>",
    src: (c) => c.has("bl") ? "Uprising p.11 · Bloodlines p.5 · FAQ" : "Uprising p.11 · FAQ"
  },
  {
    title: "Sandworms, Maker Hooks & the Shield Wall",
    when: (c) => c.game === "uprising",
    html: () => "<ul><li><b>Maker Hooks:</b> take the token at <b>Sietch Tabr</b> (requires 2 Fremen Influence) and place it on your garrison. You never “spend” it (FAQ).</li>" +
      "<li><b>Summon a sandworm</b> (sandworm icon, usually requiring Maker Hooks): take one from the bank and deploy it <b>directly to the Conflict</b> — never to a garrison. Each sandworm is <b>3 strength</b> and <b>doubles your Conflict rewards</b>.</li>" +
      "<li><b>Shield Wall:</b> while its token is on the board, no sandworms can be summoned to a Conflict at <b>Arrakeen, Spice Refinery, or Imperial Basin</b>.</li>" +
      "<li>The <b>Shield Wall detonation icon</b> lets you (optionally) remove the token from the game — for the rest of the game, sandworms may join any Conflict.</li>" +
      "<li>After Combat, sandworms return to the bank.</li></ul>",
    src: () => "Uprising p.10, p.14 · FAQ"
  },
  {
    title: "CHOAM Module — Contracts",
    when: (c) => c.game === "uprising" && c.mod("choam"),
    html: () => "<ul><li>The <b>contract icon</b> (e.g. Accept Contract, Dutiful Service) means: take one of the two face-up contracts into your supply, then flip a replacement from the bank. If none remain, the icon gives <b>2 Solari</b> instead.</li>" +
      "<li><b>Completing contracts:</b> most name a board space — complete them by sending an Agent there. <b>Harvest</b>: send an Agent to a Maker space and gain the shown amount of spice that turn (from all sources). <b>Immediate</b>: completes as soon as taken. <b>Acquire The Spice Must Flow</b>: completes when you next acquire that card.</li>" +
      "<li>Completing a contract is <b>mandatory</b> when its condition is fulfilled; multiple contracts for the same space all complete with one Agent (FAQ).</li>" +
      "<li>You must have the contract <b>before</b> sending the Agent — taking a contract for the space you visited this turn completes on a future visit.</li>" +
      "<li>When you complete one: announce it, gain the rewards, flip it face down, and keep it (cards can refer to “completed contracts”).</li>" +
      "<li><b>Shaddam Corrino IV</b> is only used with the CHOAM Module.</li></ul>",
    src: () => "Uprising p.16 · FAQ"
  },
  {
    title: "Rise of Ix — Tech Tiles, Shipping Track & Dreadnoughts",
    when: (c) => c.has("ix"),
    html: (c) => "<ul><li><b>Acquire Tech</b> (icon): buy one face-up Tech tile from the top of any Ix-board stack, paying its <b>spice</b> cost; the next tile is revealed. Discount icons reduce the cost by 1–2 spice.</li>" +
      "<li><b>Tech Negotiation</b> (space): Acquire Tech at a 1-spice discount, <b>or</b> place a troop from your supply on Ix as a <b>Negotiator</b>. When acquiring Tech later, return any number of Negotiators for 1 spice off each. You can't mix Solari and spice for costs (Ix clarifications).</li>" +
      "<li>Tiles with the <b>flip icon</b> work once per round — flip face down to use, face up at Round Start. Errata: they may be used during an Agent <b>or</b> Reveal turn.</li>" +
      "<li><b>Shipping track:</b> the Freighter icon lets you <b>advance</b> your Freighter one space up, or <b>recall</b> it to the bottom and collect the rewards of its space and every space below: tech discount 2 / two troops + 1 Influence with any Faction / choice of 5 Solari with <b>Dividends</b> (each opponent gains 1 Solari) or 2 spice.</li>" +
      "<li><b>Dreadnoughts:</b> commission via the dreadnought icon into your garrison (max 2 at a time; deploy it if commissioned while sending an Agent to a Combat space). Each is a <b>unit</b> worth <b>3 strength</b> and <b>survives combat</b> — if you don't win, it returns to your garrison.</li>" +
      "<li><b>Dreadnought control:</b> when you <b>win</b> a Conflict with at least one dreadnought in it, you <b>must</b> place one on the flag below a location where Control markers can be placed — <b>" + (c.game === "uprising" ? "Arrakeen, Spice Refinery, or Imperial Basin" : "Arrakeen, Carthag, or Imperial Basin") + "</b> (a space without a dreadnought), covering any Control marker there. You gain that location's control bonuses until the end of the <b>next</b> Combat phase, when the dreadnought returns to your garrison.</li>" +
      "<li>A deployed dreadnought lets you count swords and play Combat Intrigue even with no troops in the Conflict (FAQ).</li>" +
      (c.game === "uprising" ? "<li><b>In Uprising:</b> the Ix and CHOAM boards play as if they have one observation post each (Interstellar Shipping/Smuggling and Tech Negotiation/Dreadnought).</li>" : "") + "</ul>",
    src: (c) => c.game === "uprising" ? "Rise of Ix p.4–6, p.10, p.12 · Uprising p.18 · FAQ" : "Rise of Ix p.4–6, p.10, p.12 · FAQ"
  },
  {
    title: "Immortality — Research, Specimens, Tleilaxu Cards & Graft",
    when: (c) => c.has("imm"),
    html: () => "<ul><li><b>Research track:</b> each Research icon advances your research token one space <b>rightward</b> (often choosing up-right or down-right; never straight up/down or left), gaining the space's bonus.</li>" +
      "<li><b>Genetic markers:</b> reaching the first marker's column activates marked card effects and lets you put acquired Tleilaxu cards <b>on top of your deck</b>. After the second (end of track), Research icons instead let you <b>draw a card</b>.</li>" +
      "<li><b>Specimens:</b> the specimen icon moves a troop from your supply into the <b>Axolotl tanks</b>. Spend specimens to buy <b>Tleilaxu cards</b> from the Tleilaxu Row (they go to your discard pile) or to pay card costs. You may return specimens to your supply at any time.</li>" +
      "<li><b>Tleilaxu Row:</b> always two cards plus <b>Reclaimed Forces</b>, which is never removed — “acquiring” it means choosing to recruit two troops <i>or</i> advance your Tleilaxu token. Tleilaxu cards can't be acquired by effects that target the Imperium Row or modify Persuasion costs.</li>" +
      "<li><b>Tleilaxu track:</b> each Tleilaxu icon advances your token one space, gaining any bonus reached. Everyone gains 1 VP at the marked space — the first player there also takes the 2 spice placed during setup. The Bene Tleilax are <b>not</b> a Faction (FAQ).</li>" +
      "<li><b>Graft:</b> a Graft card can't be played alone on an Agent turn — play exactly <b>two cards</b> (two Grafts, or one Graft + one normal). Use an Agent icon from either card; both cards count as having “sent” the Agent; gain both Agent boxes plus the space, in any order.</li>" +
      "<li><b>Family Atomics:</b> once per game, during your turn, spend your token to wipe the entire Imperium Row and deal five new cards.</li></ul>",
    src: () => "Immortality p.6–12 · FAQ"
  },
  {
    title: "Bloodlines — Sardaukar Commanders & New Rules",
    when: (c) => c.game === "uprising" && c.has("bl"),
    html: (c) => "<ul><li><b>Acquiring:</b> when you send an Agent to a space holding a Sardaukar Commander, you may pay <b>2 Solari</b> to acquire and immediately recruit it — and choose a face-up <b>Sardaukar Commander Skill</b> (no duplicates of one you already have; a replacement Skill is dealt).</li>" +
      "<li>A Sardaukar Commander is a <b>troop worth 2 strength</b>: garrison it or deploy it (Combat space rules apply); it returns to <b>your supply</b> after Combat.</li>" +
      "<li><b>From your supply:</b> once per turn (Agent or Reveal), pay 2 Solari to recruit one Sardaukar Commander from your supply (no new Skill).</li>" +
      "<li><b>Skills:</b> while you have <b>any</b> Sardaukar Commander in the Conflict, all your Skills are active — each works <b>once per round</b> (Reveal bonus or combat strength), no matter how many Commanders are deployed.</li>" +
      "<li><b>Combat icon:</b> deploy units as if you'd sent an Agent to a Combat space (units recruited this turn + up to two from garrison — max two from garrison per turn even with two icons).</li>" +
      "<li><b>Wild battle icons:</b> at Endgame, match a wild icon with any other battle icon (or another wild) for 1 VP per pair.</li>" +
      (c.mod("tech") ? "<li><b>Tech Module:</b> during a turn in which you send an Agent, you may acquire one face-up Tech tile for its spice cost. A <b>High Council seat</b> gives 1 spice off every tile; a <b>Tech Discount icon</b> gives 1 off one tile (stacks with the Council discount, not with other discount icons). Flip-icon tiles work once per round; they flip face up each Round Start.</li>" : "") +
      "</ul>",
    src: (c) => c.mod("tech") ? "Bloodlines p.4–7" : "Bloodlines p.4–5"
  },
  {
    title: "Solo & Two-Player — How Rivals Behave",
    when: (c) => c.p <= 2,
    html: (c) => c.game === "imperium"
      ? "<ul><li>On a Rival's Agent turn, reveal House Hagal cards until one shows an <b>unoccupied</b> space; the Rival's Agent goes there. It ignores the space's costs and effects — it gains only what its card shows (Influence, its Leader's Signet ability, troops).</li>" +
        "<li>On a Combat space (or any Harvest Spice card) it also deploys <b>up to two garrison troops</b> to the Conflict.</li>" +
        "<li><b>Combat bonus:</b> when Combat begins, each Rival with units in the Conflict reveals a House Hagal card and adds its <b>sword icons</b> to its strength.</li>" +
        (c.p === 1
          ? "<li><b>Solo:</b> Rivals gain first/second-place Conflict rewards — VP, Influence, resources, Control, even the Mentat. Their <b>Swordmasters</b> emerge from the Conflict deck at the difficulty's depth. Once a Rival has its Swordmaster, it spends accumulated resources to <b>buy VP</b> (see the chart on Base p.20); it wins if it reaches 10 VP.</li>" +
            (c.has("ix") ? "<li><b>Rise of Ix (solo):</b> Rivals prefer deploying dreadnoughts, always advance their Freighter to the second space then recall, and buy marked <b>Rival Tech tiles</b> (most expensive affordable; hoarding spice). Expert deployment: a Rival won't deploy for Conflict I/II if already leading by 4+ strength (FAQ).</li>" : "")
          : "<li><b>Two players:</b> House Hagal is a pure spoiler — no resources, deck, rewards, or VP. It acts after each of the First Player's Agent turns while it has Agents. It can never claim control of a board space, but if it wins a Conflict for a space another player controls, that player's Control marker is <b>removed</b>.</li>") +
        "</ul>"
      : "<ul><li>On a Rival's Agent turn, reveal House Hagal cards until one shows an <b>unoccupied</b> space. The Rival ignores the space's costs/effects and gains only what its card shows: Influence, troops, Spies, its <b>Signet Ring</b> or <b>Scheme</b> ability.</li>" +
        "<li>When a Rival's Hagal card shows two spaces, use only the one matching current conditions; if it's occupied, reveal a new card (FAQ).</li>" +
        "<li>Combat-space cards also deploy up to two garrison troops. <b>Combat bonus:</b> at the start of Combat, each Rival with units in the Conflict reveals a Hagal card and adds its swords.</li>" +
        "<li>Rivals collect Conflict rewards like players (including <b>sandworm doubling</b> and battle-icon VP), win Control, and take an Alliance when able. They never take contracts — contract rewards become 2 Solari.</li>" +
        "<li><b>Spies & Schemes:</b> Rivals never Infiltrate or Gather Intelligence; when a Rival places its third Spy, recall the other two and trigger its <b>Scheme</b>.</li>" +
        "<li>A Rival first hoards resources equal to its <b>Swordmaster value</b> to buy its Swordmaster, then spends resources to <b>buy VP</b>. A Rival reaching 10 VP can win the game.</li>" +
        (c.has("bl") ? "<li><b>Bloodlines:</b> a Rival with its Swordmaster spends 2 Solari for Sardaukar Commanders (worth <b>4 strength</b> for it, no Skills; removed from the game after the Conflict). With Streamlined Rivals it removes them from the board instead." + (c.mod("tech") ? " With the Tech Module (solo), Rivals buy marked Tech tiles at 1 spice off once they have their Swordmaster." : "") + "</li>" : "") +
        "</ul>",
    src: (c) => c.game === "imperium"
      ? (c.has("ix") ? "Base p.19–20 · Rise of Ix p.8–9 · FAQ" : "Base p.19–20 · FAQ")
      : (c.has("bl") ? "Supplements (Rivals) p.3–6 · Bloodlines p.8–9 · FAQ" : "Supplements (Rivals) p.3–6 · FAQ")
  },
  {
    title: "Six-Player Team Game",
    when: (c) => c.p === 6,
    html: () => "<ul><li>Two teams of three: a <b>Commander</b> (Muad'Dib or Shaddam Corrino IV) plus two <b>Allies</b>. Team score = sum of the three players' scores.</li>" +
      "<li><b>Commanders</b> have no troops, Combat markers, or Control markers, and never win Conflict rewards. On each turn they <b>activate an Ally</b> (chosen by the arrow on the Agent token used, or freely on a Reveal turn) who receives everything the Commander can't use: units, Influence, swords.</li>" +
      "<li><b>Shared Influence:</b> a Commander's Influence with each Faction equals their <b>highest-Influence Ally's</b>. Personal-board Influence tracks (Fremen for Muad'Dib, Emperor for Shaddam) give team-wide bonuses.</li>" +
      "<li><b>Allies fight separately</b> — team strengths don't combine, so all three Conflict rewards are in play.</li>" +
      "<li><b>Swordmasters</b> are once per game: after a round in which you used it, return it to the box. Earning it also grants a <b>Swordmaster Bonus token</b> — +2 swords on every Reveal turn thereafter.</li>" +
      "<li><b>Shaddam's Throne Row:</b> Shaddam can move Imperium Row cards to a private row only his team may buy from (replaced from the deck immediately).</li>" +
      "<li><b>New icons:</b> Team reward (each teammate gains it), Reinforce (3 troops split between the two Allies), Trade (swap one type of trade good with a teammate).</li>" +
      "<li><b>Board changes:</b> reverse side with Great Houses & Fringe Worlds Factions, new spaces (Carthag, Hardy Warriors, Desert Mastery, Military Support, Economic Support, Controversial Technology), <b>Habbanya Erg</b> as a fourth Maker space, and the Sardaukar space costing 3 spice instead of 4.</li></ul>",
    src: () => "Supplements (6P) p.7–14"
  },
  {
    title: "Combining Imperium & Uprising Products",
    when: (c) => c.game === "uprising" || c.has("ix") || c.has("imm"),
    html: (c) => c.game === "uprising"
      ? "<ul><li><b>Uprising + Rise of Ix:</b> keep the CHOAM overlay folded in half, covering only the top-right corner (Assembly Hall and Gather Support). Treat the Ix/CHOAM boards as having one observation post each (Interstellar Shipping/Smuggling and Tech Negotiation/Dreadnought). Skip the Ix Conflict cards (for Epic mode, add Economic Supremacy as the extra Conflict III). With the CHOAM Module, use the 10 special Rise of Ix contracts: deal two to each player at setup; each keeps one face up and returns the other.</li>" +
        "<li><b>Uprising + Immortality:</b> still cover the Research Station with its overlay; other rules as printed.</li>" +
        "<li><b>Uprising + original Imperium cards:</b> skip the original Conflict cards (battle-icon matching suffers); remove <b>Calculated Hire</b> (and <b>Sort Through the Chaos</b> if using old Conflicts) since Uprising has no Mentat; blend Intrigue/Imperium cards as you like.</li>" +
        (c.has("bl") ? "<li><b>Bloodlines + original Imperium:</b> place the five Sardaukar Commanders on Conspire, Wealth, Foldspace, High Council, and Rally Troops (4P: sixth on Hall of Oratory); exclude the two “Fierce” Skills, the new Conflict cards, all CHOAM components, 5 listed Intrigue and 7 listed Imperium cards, and the Count Hasimir Fenring, Gaius Helen Mohiam, and Liet Kynes Leaders.</li>" : "") +
        (c.mod("tech") ? "<li><b>Tech Module + Rise of Ix:</b> to use only Ix's Tech tiles with the Embassy, exclude Detonation Devices and Troop Transports and shuffle the other 16 in. To use all of Rise of Ix, use the Ix board instead of the Embassy (Tech Negotiation discounts, no Council-seat discount)" + (c.has("bl") ? "; the CHOAM overlay covers two Sardaukar spaces — place those Commanders on Dreadnought (and Tech Negotiation in 4P) instead" : "") + ".</li>" : "") +
        "</ul>"
      : "<ul><li>Uprising is compatible with all previous Dune: Imperium products — see Uprising p.18 for full guidance when mixing this content into Uprising.</li>" +
        "<li>When adding Imperium cards to Uprising: there is no Mentat, so remove <b>Calculated Hire</b> and <b>Sort Through the Chaos</b>; skip the old Conflict cards to keep battle-icon matching easy.</li></ul>",
    src: (c) => c.game === "uprising" ? (c.has("bl") ? "Uprising p.18 · Bloodlines p.3, p.7" : "Uprising p.18") : "Uprising p.18"
  },
  {
    title: "Key Rulings — Errata & FAQ (2025-01-13)",
    when: () => true,
    html: (c) => "<ul>" +
      "<li><b>Errata — Missionaria Protectiva</b> is a Bene Gesserit card (first English printing omits the Faction); only two copies belong in the Imperium deck.</li>" +
      (c.has("ix") ? "<li><b>Errata — Rise of Ix rulebook:</b> flip-icon Tech tiles work during an Agent <b>or</b> Reveal turn (p.4); solo/2P setup removes the two Hall of Oratory and two Rally Troops House Hagal cards (p.8).</li>" : "") +
      "<li><b>Optional vs. mandatory:</b> effects are mandatory unless a card says “you may”, uses an arrow (cost → effect), or is the black-X trash icon. Intrigue card costs must be paid.</li>" +
      "<li><b>Paying costs:</b> an arrow cost can be paid only once per turn for its effect.</li>" +
      "<li><b>Recruiting:</b> troops always come from your <b>supply</b>; on a Combat space, anything recruited that turn (cards, Intrigue, Tech, Shipping) may be deployed, but never more than two from your garrison.</li>" +
      "<li><b>The Spice Must Flow:</b> you keep its VP even if the card is later trashed.</li>" +
      "<li><b>Discard</b> always means from your <b>hand</b> unless stated otherwise.</li>" +
      "<li><b>Intrigue:</b> play Plot cards only on your own turns; an exhausted Intrigue deck is reshuffled from its discards.</li>" +
      (c.game === "imperium" ? "<li><b>Carryall:</b> base harvest is 1 spice (Imperial Basin), 2 (Hagga Basin), 3 (The Great Flat).</li>" : "<li><b>Carryall:</b> base harvest is 1 spice (Imperial Basin), 2 (Hagga Basin / Habbanya Erg), 4 (Deep Desert).</li>") +
      (c.has("imm") ? "<li><b>Graft rulings:</b> Ghola copies the entire Agent box of its partner (including “trash this card”); Kwisatz Haderach grafted still sends only one Agent; Usurp may target a card in your hand; Beguiling Pheromones' trash can't double as another effect's trash cost.</li>" : "") +
      (c.game === "uprising" ? "<li><b>Reaching 2 Influence</b> triggers “when you reach” abilities even when jumping past it, and can trigger again after dropping and re-climbing (upward moves only).</li>" : "") +
      (c.game === "uprising" && c.mod("choam") ? "<li><b>Shaddam Corrino IV:</b> his “Emperor of the Known Universe” restriction applies immediately when his Signet Ring sends an Agent, for that turn only.</li>" : "") +
      "<li>Latest rulings: <b>duneimperium.com/FAQ</b>.</li></ul>",
    src: () => "FAQ & Errata (2025-01-13)"
  }
];

/* =============================================================================
   TEACHING SCRIPT
   ============================================================================= */
DI.teach = {
  intro: "A ~5-minute teach for the exact game and sets selected above. Read it aloud, or hit Copy and tweak. Rules content is drawn from the rulebooks and FAQ cited in the setup steps.",
  sections: [
    {
      h: "The hook — and how you win",
      body: (c) => "<p>" + (c.game === "uprising"
        ? "We're rival leaders in the Dune universe just after Muad'Dib's rise — fighting over spice, armies, and the favor of the Imperium's great Factions. Uprising mixes deck-building with worker placement: your cards decide where your Agents can go, and where your Agents go shapes what your deck becomes."
        : "We're leaders of the Great Houses of the Landsraad, scheming for control of Arrakis. Dune: Imperium mixes deck-building with worker placement: your cards decide where your Agents can go, and where your Agents go shapes what your deck becomes.") + "</p>" +
        "<p>First to <b>" + (c.mod("epic") ? "12" : (c.game === "imperium" && c.mod("goto11") ? "11" : "10")) + " Victory Points</b> at the end of a round wins — or, if the ten-round Conflict deck runs out, whoever has the most. VP come from winning Conflicts, climbing Faction Influence tracks, and a handful of cards" + (c.game === "uprising" ? " and Objectives" : "") + ". Ties break on spice, then Solari, then water, then garrisoned troops.</p>"
    },
    {
      h: "The shape of a round",
      body: (c) => "<p>Each round: flip a <b>Conflict card</b> — that's the prize we're fighting over — and everyone draws a fresh <b>five-card hand</b>. Then, clockwise, we take turns until everyone is done: you'll take <b>Agent turns</b> while you have Agents, then one big <b>Reveal turn</b>. After that come <b>Combat</b>, a little spice trickling onto the desert (<b>Makers</b>), and <b>Recall</b>, where Agents come home and the first player passes on.</p>"
    },
    {
      h: "Agent turns — where and why",
      body: (c) => "<p>On an Agent turn you play <b>one card</b> and send an Agent to an <b>empty</b> board space matching an icon on that card. You get the space's effect <i>and</i> the card's Agent-box effect. Spaces do four broad things:</p>" +
        "<ul><li><b>Make money</b> — spice from the desert Maker spaces, Solari from trade. Spice is the engine: it buys" + (c.game === "imperium" && c.has("ix") ? " Tech," : "") + " influence and the best cards.</li>" +
        "<li><b>Build your army</b> — recruit troops; at a <b>Combat space</b> (crossed swords) you also deploy fresh recruits plus up to two from your garrison. Deploy only when you mean to fight: units in the garrison score nothing.</li>" +
        "<li><b>Climb Factions</b> — the four Factions each give a VP at 2 Influence and a bonus plus an <b>Alliance VP</b> for the first to 4. Alliances can be stolen — watch your back.</li>" +
        "<li><b>Improve your deck</b> — draw, trash weak starters, gather <b>Intrigue cards</b> (secret one-shots for turns, combat, or endgame).</li></ul>" +
        (c.game === "uprising" ? "<p>Uprising's twist: <b>Spies</b>. Place them on observation posts; later recall one to <b>Infiltrate</b> — following an opponent into an occupied space — or to draw a card as you land somewhere. The Spy icon also opens up any space your Spy watches. Blocking is weaker here; tempo is king.</p>" : "") +
        (c.game === "imperium" ? "<p>One extra worker is up for grabs each round: the <b>Mentat</b>, for 2 Solari. And your <b>Swordmaster</b> — a permanent third Agent — is the single best purchase in the game; grab it early at the Swordmaster space for 8 Solari.</p>" : "<p>Your <b>Swordmaster</b> — a permanent third Agent — is one of the strongest buys in the game: 8 Solari, dropping to 6 once anyone has theirs.</p>")
    },
    {
      h: "The Reveal turn — buying cards and setting strength",
      body: (c) => "<p>When you're out of Agents (or done placing), flip your remaining hand face up. Those cards give <b>Persuasion</b> — your buying power for new cards from the Imperium Row — and <b>swords</b>. Persuasion doesn't carry over, so spend it. Bought cards go to your discard pile and show up when you reshuffle.</p>" +
        "<p>Your <b>strength</b> for this round's Conflict = 2 per troop" + (c.game === "uprising" ? ", 3 per sandworm" : (c.has("ix") ? ", 3 per dreadnought" : "")) + " you have deployed, plus 1 per sword revealed — but with no units in the fight, you're at zero, swords or not.</p>"
    },
    {
      h: "Combat — the knife fight",
      body: (c) => "<p>Once everyone has revealed, we resolve the Conflict: <b>Combat Intrigue cards</b> go around until everyone passes in a row — expect surprises — then rewards go out by strength: winner takes the top prize, runner-up the second" + (c.p >= 4 ? ", third place the third" : "") + ". Tie for first and <i>everyone</i> tied drops to the second reward — nobody wins the card.</p>" +
        (c.game === "uprising"
          ? "<p>Two Uprising wrinkles: the winner keeps the Conflict card, and matching its <b>battle icon</b> with another card you've won (or your Objective) is a quiet extra VP. And <b>sandworms</b>: earn <b>Maker Hooks</b> from the Fremen at Sietch Tabr, then summon a worm straight into the fight — 3 strength and it <b>doubles your rewards</b>. The <b>Shield Wall</b> blocks worms from the three city Conflicts until someone blows it up. Someone always blows it up.</p>"
          : "<p>Some Conflicts award <b>control</b> of Arrakeen, Carthag, or Imperial Basin — a steady drip of Solari or spice every time anyone visits. Small, but it adds up.</p>")
    },
    { when: (c) => c.has("ix"),
      h: "Rise of Ix — Tech, shipping & dreadnoughts",
      body: () => "<p>Three additions. <b>Tech tiles</b>: buy them with spice from the Ix board for permanent abilities — Tech Negotiation even lets you park troops as Negotiators for discounts. <b>The Shipping track</b>: nudge your Freighter up, then recall it to cash in every space you've climbed — troops, Influence, and a 5-Solari Dividends payout. <b>Dreadnoughts</b>: 3-strength warships that <b>survive combat</b> and can occupy a city to control it. Max two, and they make your garrison genuinely scary.</p>" },
    { when: (c) => c.has("imm"),
      h: "Immortality — the Bene Tleilax",
      body: () => "<p>Two new tracks. <b>Research</b>: research icons walk your token right along a web of bonuses; genetic markers unlock stronger card effects and let you put Tleilaxu buys on top of your deck. <b>The Tleilaxu track</b> pays out as you embrace their darker gifts. New currency: <b>specimens</b> — your own troops sent to the Axolotl tanks — buy <b>Tleilaxu cards</b>, which are bought with bodies instead of Persuasion. And <b>Graft</b> cards let you play <i>two</i> cards on one Agent turn, combining both effects. Once per game your <b>Family Atomics</b> token nukes the whole Imperium Row for a fresh five.</p>" },
    { when: (c) => c.mod("epic"),
      h: "Epic Game Mode",
      body: (c) => "<p>We're playing the long game: <b>12 VP</b> to win, tougher Conflicts from the start (no Conflict I cards), and everyone begins with <b>Control the Spice</b> " + (c.has("imm") ? "in their discard pile" : "in their deck") + ", an Intrigue card, and five garrison troops. Expect bigger armies earlier.</p>" },
    { when: (c) => c.game === "imperium" && c.mod("goto11"),
      h: "“Go to 11” variant",
      body: () => "<p>One tweak tonight: we play to <b>11 VP</b> (in a 4-player game, start at 0 and play to 10) — a slightly longer game to let the Tleilaxu engines come online.</p>" },
    { when: (c) => c.game === "uprising" && c.mod("choam"),
      h: "CHOAM contracts",
      body: () => "<p>We're using the <b>CHOAM Module</b>: contract icons let you grab one of the two face-up <b>contracts</b> — a promise like “send an Agent to Sietch Tabr” or “harvest 4 spice in a turn”. Fulfil it and it pays out automatically. Take contracts for places you were going anyway; they're nearly free money. This module also unlocks <b>Shaddam Corrino IV</b> as a Leader.</p>" },
    { when: (c) => c.game === "uprising" && c.has("bl"),
      h: "Bloodlines — Sardaukar Commanders",
      body: (c) => "<p>Five board spaces start with a <b>Sardaukar Commander</b> on them. Visit one and pay <b>2 Solari</b> to recruit it — it's a normal 2-strength troop that comes home to your supply after battle, and buying it also grants a permanent <b>Skill</b> that fires once a round whenever you have a Commander in the fight. Later you can re-recruit one from your supply for 2 Solari, once per turn. Cheap muscle plus a growing engine.</p>" +
        (c.mod("tech") ? "<p>We're also using the <b>Tech Module</b>: with an Agent turn you may buy a <b>Tech tile</b> from the Ixian Embassy with spice — permanent abilities, and a High Council seat gives a standing discount.</p>" : "") },
    { when: (c) => c.p <= 2,
      h: (c) => c.p === 1 ? "Solo — your Rivals" : "Two players — the automated third seat",
      body: (c) => c.game === "imperium"
        ? (c.p === 1
          ? "<p>You face <b>two Rival Leaders</b> run by the House Hagal deck: they grab spaces, climb tracks, and fight hard in Conflicts, and once their Swordmaster emerges from the Conflict deck they start converting resources into VP. If a Rival hits 10 VP, they can beat you. I'll drive them — you just play your game.</p>"
          : "<p>A dummy third player, <b>House Hagal</b>, acts after each of the first player's Agent turns — it blocks spaces and muscles into Conflicts but scores nothing. Think of it as terrain that hates you both.</p>")
        : (c.p === 1
          ? "<p>You face <b>two Rivals</b> driven by the House Hagal deck. They ignore board effects but gain what their cards show, hoard resources for their Swordmaster, then buy VP — a Rival reaching 10 VP can win. They even ride sandworms and steal Alliances, so guard your leads.</p>"
          : "<p>A shared automated <b>Rival</b> sits between us, driven by the House Hagal deck — it occupies spaces, contests every Conflict, and can genuinely win unless we're using a Streamlined Rival. It acts after the first player each round.</p>") },
    { when: (c) => c.p === 6,
      h: "Six players — the war for the throne",
      body: () => "<p>This is a <b>team game</b>: Muad'Dib and his three against Shaddam and his. Commanders don't fight — instead every Commander turn <b>activates an Ally</b>, who receives the troops, Influence, and swords. Allies fight Conflicts separately, so all three rewards are live every round. Your team's score is the <b>sum</b> of all three players — coordinate who chases which prize, trade goods with the Trade icon, and remember your Swordmaster works <b>once per game</b> here, but leaves behind a permanent +2 swords token.</p>" },
    {
      h: "Don't worry about these until they come up",
      body: (c) => {
        const items = [];
        items.push("<li><b>Exact tie rules in Combat</b> — I'll adjudicate; roughly, ties push everyone down a reward.</li>");
        if (c.game === "uprising") items.push("<li><b>Alliance stealing details</b> and losing the token when you drop below 4 Influence.</li>");
        else items.push("<li><b>Alliance stealing</b> — passing someone on a track takes their token.</li>");
        items.push("<li><b>Trashing cards</b> — thinning your deck is strong; the icons will tell you when you may.</li>");
        if (c.game === "uprising") items.push("<li><b>The 2-Influence unlock spaces</b> (Imperial Privilege, Shipping, Sietch Tabr) — they'll matter mid-game.</li>");
        if (c.game === "imperium") items.push("<li><b>The Mentat returning</b> and control bonuses — I'll flag them.</li>");
        if (c.has("ix")) items.push("<li><b>Freighter reward stacking</b> — when you recall, I'll walk you through the payout.</li>");
        if (c.has("imm")) items.push("<li><b>Graft edge cases</b> (Ghola, Kwisatz Haderach) — FAQ has them; ask when you draw one.</li>");
        if (c.game === "uprising" && c.has("bl")) items.push("<li><b>Command (6+) effects and wild battle icons</b> — they read themselves when they appear.</li>");
        if (c.game === "uprising" && c.mod("choam")) items.push("<li><b>Harvest contracts</b> — the spice count includes every source that turn.</li>");
        if (c.game === "uprising" && c.mod("tech")) items.push("<li><b>Tech discount stacking</b> — Council seat + one discount icon, never two icons.</li>");
        items.push("<li><b>Endgame Intrigue cards</b> — hold them; they fire after the last round.</li>");
        return "<ul>" + items.join("") + "</ul>";
      }
    }
  ]
};
