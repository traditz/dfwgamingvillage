/* =============================================================================
   Clank! A Deck-Building Adventure — Setup & Reference Utility · data
   All content sourced from the official rulebooks and the FAQ & Rules Updates
   (August 18, 2025) — see citations.
   ============================================================================= */
var CK = {};

CK.expMeta = {
  base:     { name: "Clank!",        cls: "tag-base" },
  sunken:   { name: "Sunken Tr.",    cls: "tag-sunken" },
  mummy:    { name: "Mummy's Curse", cls: "tag-mummy" },
  goldsilk: { name: "Gold & Silk",   cls: "tag-goldsilk" },
  apelords: { name: "Ape Lords",     cls: "tag-apelords" },
  party:    { name: "Adv. Party",    cls: "tag-party" },
  faq:      { name: "FAQ",           cls: "tag-faq" },
  mod:      { name: "Expansions",    cls: "tag-mod" }
};

CK.expansions = [
  { id: "base",     short: "Clank! (base game)", year: "2016", blurb: "The original deck-building dungeon heist, with a double-sided board. Always in play." },
  { id: "sunken",   short: "Sunken Treasures", year: "2017", blurb: "A flooded double-sided board, SCUBA, the Goldfish, and 35 Dungeon Deck cards." },
  { id: "mummy",    short: "The Mummy's Curse", year: "2018", blurb: "A pyramid double-sided board, the wandering Mummy, Curses, and 40 Dungeon Deck cards." },
  { id: "goldsilk", short: "Expeditions: Gold and Silk", year: "2018", blurb: "Two new boards: the Dwarven Mine and the Spider Queen's Lair. No new cards." },
  { id: "apelords", short: "Expeditions: Temple of the Ape Lords", year: "2019", blurb: "Two new boards: the Jungle and the rotating-gear Temple, plus a mini-campaign. No new cards." },
  { id: "party",    short: "Adventuring Party", year: "2021", blurb: "5–6 players on any board, six unique characters, and 35 new Dungeon Deck cards." }
];

CK.boards = [
  { id: "front",  requires: "base", name: "Dragon Keep (front)", blurb: "The classic board — recommended for your first game." },
  { id: "back",   requires: "base", name: "Dragon Keep (back)", blurb: "A different dungeon with traveling merchants scattered throughout." },
  { id: "sunken", requires: "sunken", name: "Sunken Treasures", blurb: "Flooded rooms and underwater tunnels (either side)." },
  { id: "mummy",  requires: "mummy", name: "The Mummy's Curse", blurb: "Four zones stalked by the Mummy (either side)." },
  { id: "mine",   requires: "goldsilk", name: "Dwarven Mine", blurb: "Mine veins of gold; elevators to the Depths." },
  { id: "spider", requires: "goldsilk", name: "Spider Queen's Lair", blurb: "Webs, webbed rooms and the Queen's Web Cache." },
  { id: "jungle", requires: "apelords", name: "Jungle", blurb: "Ape-aratus tokens and the Bronze Guardian." },
  { id: "temple", requires: "apelords", name: "Temple of the Ape Lords", blurb: "Nine rotating gears reshape the tunnels." }
];

CK.modules = [
  { id: "chars", requires: "party", name: "Characters", summary: "Six unique thieves with custom starting decks",
    description: "Each player takes a character board and its 10-card custom deck (three unique cards) — usable at any player count, but don't mix characters with regular starting decks.", src: "Adventuring Party p.2, p.5" },
  { id: "campaign", requires: "apelords", name: "Mini-Campaign", summary: "Two games: Jungle, then Temple",
    description: "Play the Jungle side, award 20/10/5-point Campaign tokens by score, then play the Temple side keeping your Campaign token and collected ape-aratus tokens.", src: "Ape Lords p.4" }
];

/* =============================================================================
   SETUP PHASES — c = { has(exp), p, board, mod(id) }
   ============================================================================= */
CK.phases = [
  {
    title: "Board & Tokens",
    steps: [
      { when: () => true, exp: (c) => ({front:"base",back:"base",sunken:"sunken",mummy:"mummy",mine:"goldsilk",spider:"goldsilk",jungle:"apelords",temple:"apelords"})[c.board],
        t: (c) => "Place the board — " + CK.boards.find(b => b.id === c.board).name,
        d: (c) => {
          switch (c.board) {
            case "front": return "<ul><li>Place the board with the <b>front</b> side up — recommended for your first game. The Market is a group of spaces near the center of the dungeon.</li></ul>";
            case "back": return "<ul><li>Place the board with the <b>back</b> side up. Here the Market is not a single area — traveling merchants are found on spaces scattered throughout the dungeon.</li></ul>";
            case "sunken": return "<ul><li>Place the <b>Sunken Treasures</b> board, either side up. Many rooms are <b>flooded</b>; tunnels between two flooded rooms carry the underwater icon, and some tunnels carry Clank! icons (the splash of diving in).</li></ul>";
            case "mummy": return "<ul><li>Place the <b>Mummy's Curse</b> board, either side up. Each side is divided into <b>four zones</b> (three in the Depths, one above), each with its own symbol on a Mummy-marker space (not connected to any room). Place the <b>Mummy marker</b> on the space of the zone whose symbol is the <b>long-necked animal</b> glyph (shown in the Mummy rulebook's Setup, p.2).</li><li>Place the <b>pyramid die</b> next to the board and the <b>Supreme Monkey Idol</b> on its marked space.</li><li><i>Optional ambience:</i> use the Croxobek Dragon marker.</li></ul>";
            case "mine": return "<ul><li>Place the <b>Gold and Silk</b> board with the <b>Dwarven Mine</b> side up. Note the entrance flag is toward the <b>right side</b> of the board.</li><li>Place the three <b>Mining Bonus tokens</b> (20/10/5) in their spaces below the Clank! area.</li><li><i>Optional ambience:</i> use the Spider marker as the Dragon marker and the miner pawns.</li></ul>";
            case "spider": return "<ul><li>Place the <b>Gold and Silk</b> board with the <b>Spider Queen's Lair</b> side up.</li><li>Return the usual <b>7-point Artifact</b> to the box — this board uses the new <b>8-point Artifact</b> instead.</li><li>Shuffle the <b>12 Web tokens</b> face down (hiding their values) and place one at random on each web space.</li><li><i>Optional ambience:</i> use the Spider marker as the Dragon marker.</li></ul>";
            case "jungle": return "<ul><li>Place the <b>Temple of the Ape Lords</b> board with the <b>Jungle</b> side up.</li><li>Return the usual <b>30-point Artifact</b> to the box — both sides of this board use the new <b>33-point Artifact</b> instead.</li><li>Place three <b>ape-aratus tokens</b> face up on the Bronze Guardian (one cog, one monkey wrench, one banana). Shuffle the remaining 15 face down and place one at random <b>face up</b> on each marked tunnel space.</li><li><i>Optional ambience:</i> use the Boss marker and jungle-trek pawns.</li></ul>";
            case "temple": return "<ul><li>Place the <b>Temple of the Ape Lords</b> board with the <b>Temple</b> side up.</li><li>Return the usual <b>30-point Artifact</b> to the box — both sides of this board use the new <b>33-point Artifact</b> instead.</li><li>Sort the nine <b>gear tokens</b> face down by number of sides; shuffle the three-sided and four-sided groups. Place all nine on their spaces (three- and four-sided in random locations) in random orientations, then flip them face up.</li><li>Shuffle the 18 <b>ape-aratus tokens</b> face down and deal <b>three to each player</b> (kept hidden); return the rest to the box unseen" + (c.mod("campaign") ? " — <b>Mini-Campaign game 2:</b> instead, players keep the ape-aratus tokens collected in the Jungle game (face up), and each player keeps the Campaign token they won there" : "") + ".</li><li>Shuffle the eight <b>Rotation of Numerous Gears (RNG)</b> tokens face down; place one on each marked Rage Track space and stack the other four on the marked space above the track.</li><li><i>Optional ambience:</i> use the Boss marker and jungle-trek pawns.</li></ul>";
          }
        },
        src: (c) => ({front:"Base p.2, p.10",back:"Base p.2, p.10",sunken:"Sunken p.1–2",mummy:"Mummy p.1–2",mine:"Gold & Silk p.1",spider:"Gold & Silk p.1–2",jungle:"Ape Lords p.1–2",temple:(c.mod("campaign") ? "Ape Lords p.1–4" : "Ape Lords p.1–3")})[c.board] },
      { when: () => true, exp: (c) => { const k = [c.p >= 5 ? "party" : "", c.board === "spider" ? "goldsilk" : (c.board === "jungle" || c.board === "temple") ? "apelords" : ""].filter(Boolean); return k.length > 1 ? "mod" : (k[0] || "base"); },
        t: "Place the Artifacts",
        d: (c) => {
          let d = "<ul>";
          if (c.p >= 5) {
            d += "<li><b>Adventuring Party:</b> add its five Artifacts to the original seven." + (c.p === 5 ? " With <b>5 players</b>, shuffle all twelve face down and exclude two at random (return them to the box unseen)." : "") + "</li>" +
              "<li>Place all Artifacts on their spaces (<b>" + (c.p === 5 ? "10" : "12") + "</b> Artifacts): identical values are stacked in the same space, original <b>gold on top</b>, new silver below.</li>";
          } else {
            d += "<li>Place the seven <b>Artifacts</b> (valued 5 to 30) face up on the spaces marked with the corresponding numbers.</li>" +
              (c.p === 3 ? "<li><b>3 players:</b> before placing, shuffle the Artifacts face down and return <b>one</b> at random to the box.</li>" : "") +
              (c.p === 2 ? "<li><b>2 players:</b> before placing, shuffle the Artifacts face down and return <b>two</b> at random to the box.</li>" : "");
          }
          if (c.board === "spider") d += "<li>This board uses the <b>8-point Artifact</b> in place of the 7-point one" + (c.p >= 5 ? " (a silver artifact with no matching space goes on the closest value, higher value on top)" : "") + ".</li>";
          if (c.board === "jungle" || c.board === "temple") d += "<li>This board uses the <b>33-point Artifact</b> in place of the 30-point one" + (c.p >= 5 ? " (a silver artifact with no matching space goes on the closest value, higher value on top)" : "") + ".</li>";
          return d + "</ul>";
        },
        src: (c) => {
          const s = [c.p >= 5 ? "Adventuring Party p.2" : "Base p.2"];
          if (c.board === "spider") s.push("Gold & Silk p.2");
          if (c.board === "jungle" || c.board === "temple") s.push("Ape Lords p.2");
          return s.join(" · ");
        } },
      { when: () => true, exp: (c) => (c.p >= 5 || c.has("sunken") || c.board === "mummy") ? "mod" : "base",
        t: "Place the Secrets",
        d: (c) => {
          const mixes = [];
          if (c.has("sunken")) mixes.push("Sunken Treasures (Potion of Heroism major; Potion of Strength and Treasure minors)");
          if (c.board === "mummy") mixes.push("The Mummy's Curse (Mummy's Treasure and Mummy's Chalice majors; two Scarab minors)");
          return "<ul>" +
            (mixes.length ? "<li>Mix in the Secrets from " + mixes.join(" and ") + " before shuffling.</li>" : "") +
            "<li>Shuffle the <b>Major Secrets</b> face down and place one at random on each Major Secret space; return extras to the box unseen.</li>" +
            (c.p >= 5
              ? "<li><b>Adventuring Party (5–6 players):</b> add its new minor secrets, shuffle all <b>Minor Secrets</b>, and place them face down <b>in the Bank</b> — none on the board. Entering a minor-secret space draws one at random from the Bank (one per room per turn; an empty Bank yields nothing).</li>"
              : "<li>Shuffle the <b>Minor Secrets</b> face down and place <b>two</b> at random on each Minor Secret space; return extras to the box unseen.</li>") +
            "</ul>";
        },
        src: (c) => {
          const s = ["Base p.2"];
          if (c.has("sunken")) s.push("Sunken p.1");
          if (c.board === "mummy") s.push("Mummy p.2");
          if (c.p >= 5) s.push("Adventuring Party p.2–3");
          return s.join(" · ");
        } },
      { when: () => true, exp: (c) => (c.p >= 5 || c.has("sunken") || c.has("mummy") || c.has("goldsilk") || c.has("party") || c.board === "jungle" || c.board === "temple") ? "mod" : "base",
        t: "Set up the Market",
        d: (c) => {
          const useBoard = c.has("sunken") || c.has("mummy") || c.p >= 5;
          let d = "<ul><li>Place the Market Items " + (useBoard ? "on the <b>Market Board</b> beside the game board — this becomes your Market area" : "on the Market area of the board") + ": two <b>Master Keys</b>, two <b>Backpacks</b>, and three <b>Crowns</b> (valued 10, 9, and 8).</li>";
          if (!useBoard && c.has("goldsilk")) d += "<li><b>Gold and Silk:</b> you may place the Market Items on its <b>Market Board</b> beside the game board instead.</li>";
          if (c.board === "sunken") d += "<li><b>Sunken Treasures board:</b> add the two <b>SCUBA</b> tokens.</li>";
          if (c.has("mummy")) d += "<li><b>The Mummy's Curse:</b> add the two <b>Ankhs</b> (whichever board you use).</li>";
          if (c.board === "jungle" || c.board === "temple") d += "<li><b>Ape Lords board:</b> add the two <b>Time Winders</b>.</li>";
          if (c.p >= 5) d += "<li><b>Adventuring Party:</b> add its extra Backpack, Crown and Master Key, plus the three <b>Invisibility Cloaks</b>.</li>";
          else if (c.has("party")) d += "<li><b>Adventuring Party (optional at 2–4 players):</b> you may add <b>two</b> Invisibility Cloaks (not all three).</li>";
          return d + "</ul>";
        },
        src: (c) => {
          const s = ["Base p.2"];
          if (c.has("sunken")) s.push("Sunken p.1");
          if (c.has("mummy")) s.push("Mummy p.2");
          if (c.has("goldsilk")) s.push("Gold & Silk p.1");
          if (c.board === "jungle" || c.board === "temple") s.push("Ape Lords p.2");
          if (c.has("party")) s.push("Adventuring Party p.2");
          return s.join(" · ");
        } },
      { when: () => true, exp: (c) => { const x = [c.p >= 5 ? "party" : "", c.has("mummy") ? "mummy" : "", c.has("goldsilk") ? "goldsilk" : ""].filter(Boolean); return x.length > 1 ? "mod" : (x[0] || "base"); },
        t: "Monkey Idols, Mastery, Bank & the Dragon",
        d: (c) => "<ul><li>Place the three <b>Monkey Idols</b> on the Monkey Shrine room" + (c.board === "mummy" ? " (the Supreme Monkey Idol is already on its own space)" : "") + ".</li>" +
          "<li>Place one <b>Mastery token per player</b> near the dungeon entrance.</li>" +
          "<li>Place the <b>Gold</b> (1s and 5s" + (c.has("goldsilk") || c.p >= 5 ? ", plus the extra Gold from " + [c.has("goldsilk") ? "Gold and Silk" : "", c.p >= 5 ? "Adventuring Party" : ""].filter(Boolean).join(" and ") : "") + ") in a Bank next to the board. Gold is not limited." + (c.has("party") && c.p <= 4 ? " You may also add Adventuring Party's extra Gold." : "") + (c.has("mummy") ? " <b>The Mummy's Curse</b> (whichever board you use): also place the <b>24 Curse tokens</b> in the Bank (not limited — substitute if you run out)." : "") + "</li>" +
          (c.p >= 5
            ? "<li><b>Adventuring Party:</b> place the <b>side board</b> (extra Rage Track and Health Meters for the fifth and sixth players) against the bottom edge of the game board, and place the <b>Dragon marker</b> on the <b>first space</b> of the side board's Rage Track. (Optional ambience: the Hexavultus boss marker.)</li>"
            : "<li>Place the <b>Dragon marker</b> on the Rage Track: <b>first</b> space with 4 players, <b>second</b> with 3, <b>third</b> with 2.</li>") +
          "<li>Place the <b>24 dragon cubes</b> (black) in the <b>Dragon Bag</b> next to the board.</li></ul>",
        src: (c) => ["Base p.2", c.has("mummy") ? "Mummy p.2" : "", c.has("goldsilk") ? "Gold & Silk p.1" : "", c.p >= 5 ? "Adventuring Party p.2–3" : "Adventuring Party p.2"].filter(Boolean).join(" · ") }
    ]
  },
  {
    title: "Reserve & Dungeon Deck",
    steps: [
      { when: () => true, exp: (c) => (c.board === "sunken" || c.board === "mummy" || c.p >= 5) ? "mod" : "base",
        t: "Create the Reserve",
        d: (c) => "<ul><li>Place the <b>Goblin</b> monster card in the Reserve next to the board, along with the piles of <b>Mercenary, Explore,</b> and <b>Secret Tome</b> cards" + (c.p >= 5 ? " (add the four extra copies of each from Adventuring Party)" : "") + ".</li>" +
          (c.board === "sunken" ? "<li><b>Sunken Treasures board:</b> add the <b>Goldfish</b> monster card next to the Goblin — like the Goblin, it isn't discarded when defeated and can be fought repeatedly.</li>" : "") +
          (c.board === "mummy" ? "<li><b>Mummy's Curse board:</b> add the <b>Mummy</b> monster card next to the Goblin.</li>" : "") + "</ul>",
        src: (c) => {
          const s = ["Base p.2"];
          if (c.board === "sunken") s.push("Sunken p.1");
          if (c.board === "mummy") s.push("Mummy p.2");
          if (c.p >= 5) s.push("Adventuring Party p.3");
          return s.join(" · ");
        } },
      { when: () => true, exp: (c) => (c.has("sunken") || c.has("mummy") || c.has("party")) ? "mod" : "base",
        t: "Build the Dungeon Deck & deal the Dungeon Row",
        d: (c) => {
          const adds = [];
          if (c.has("sunken")) adds.push("<b>35</b> Sunken Treasures cards");
          if (c.has("mummy")) adds.push("<b>40</b> Mummy's Curse cards");
          if (c.has("party") && c.p >= 5) adds.push("<b>35</b> Adventuring Party cards");
          return "<ul>" +
            (adds.length ? "<li>Shuffle in the " + adds.join(", the ") + ".</li>" : "") +
            (c.has("party") && c.p <= 4 ? "<li><b>Adventuring Party (optional at 2–4 players):</b> you may also shuffle in its <b>35</b> Dungeon cards — they're designed with more players in mind.</li>" : "") +
            (adds.length > 1 || (adds.length === 1 && (c.has("sunken") || c.has("mummy"))) ? "<li><b>FAQ recommendation:</b> avoid mixing cards from more than one expansion at once, and consider removing cards that reference features your board doesn't have (flooded rooms, Curses, etc.). You're still free to mix as you like (e.g. Adventuring Party with Sunken Treasures at 5–6 players). Every expansion card carries a <b>watermark</b> for sorting: waves (Sunken), pyramid (Mummy), “VI” (Adventuring Party).</li>" : "") +
            "<li>Shuffle the <b>Dungeon Deck</b> and deal <b>six cards</b> face up as the Dungeon Row. Replace any showing the <b>Dragon Attack symbol</b> until none do, shuffling replacements back in.</li>" +
            "<li>Leave room for a Dungeon discard pile.</li>" +
            "<li><b>FAQ:</b> if any of the six starting cards have <b>Arrive</b> text, carry it out before the first player takes a turn — once everyone has their Clank! cubes and the first player is chosen (below).</li></ul>";
        },
        src: (c) => {
          const s = ["Base p.2"];
          if (c.has("sunken")) s.push("Sunken p.1");
          if (c.has("mummy")) s.push("Mummy p.2");
          if (c.has("party")) s.push("Adventuring Party p.3");
          s.push("FAQ p.1" + (c.has("sunken") || c.has("mummy") ? ", p.3" : ""));
          return s.join(" · ");
        } }
    ]
  },
  {
    title: "Players & First Turn",
    steps: [
      { when: () => true, exp: (c) => (c.mod("chars") || c.p >= 5) ? "party" : "base",
        t: "Player colors, decks & pawns",
        d: (c) => "<ul><li>Each player takes <b>30 Clank! cubes</b> of their color as a personal supply and the matching <b>pawn</b>.</li>" +
          (c.mod("chars")
            ? "<li><b>Characters:</b> each player picks one of the six characters, taking its character board, any special tokens, and its <b>custom 10-card starting deck</b> (three unique cards each). Characters should only play against other characters.</li>"
            : "<li>Each player takes a <b>10-card starting deck</b>: 6 Burgle, 2 Stumble, 1 Sidestep, 1 Scramble" + (c.p >= 5 ? " (the fifth and sixth players use the two identical decks from Adventuring Party)" : "") + ".</li>") +
          "<li>Each player places their pawn <b>just outside the dungeon</b> at the entrance" + (c.board === "mine" ? " (on this board, toward the right side)" : "") + ", shuffles their deck, and draws <b>five cards</b>.</li></ul>",
        src: (c) => (c.mod("chars") ? "Base p.2 · Adventuring Party p.2, p.5" : (c.p >= 5 ? "Base p.2 · Adventuring Party p.2" : "Base p.2")) + (c.board === "mine" ? " · Gold & Silk p.1" : "") },
      { when: () => true, exp: (c) => c.p >= 5 ? "party" : "base",
        t: "First player & starting Clank!",
        d: (c) => "<ul><li>The <b>sneakiest player</b> goes first (or choose randomly); play proceeds clockwise.</li>" +
          "<li>Starting Clank! in the Clank! area: first player <b>3</b>, second <b>2</b>, third <b>1</b>, fourth <b>0</b>." +
          (c.p >= 5 ? " The fifth and sixth players also place <b>0</b> Clank!, but the fifth takes <b>1 Gold</b> and the sixth takes <b>2 Gold</b> from the Bank.</li>" : "</li>") + "</ul>",
        src: (c) => c.p >= 5 ? "Base p.2 · Adventuring Party p.3" : "Base p.2" }
    ]
  }
];

/* =============================================================================
   RULES REFERENCE
   ============================================================================= */
CK.reference = [
  {
    title: "Your Turn — Cards & Resources",
    when: () => true,
    html: (c) => "<ul><li>Start each turn with five cards; you <b>must play them all</b>, in any order, into your play area, and carry out all their text.</li>" +
      "<li>Cards make three pooled resources — <b>Skill</b> (acquire cards, use devices), <b>Swords</b> (fight monsters, reduce tunnel damage), <b>Boots</b> (movement) — plus <b>Gold</b>, <b>Clank!</b>, and card draws. Resources pool and split freely across actions; unspent resources are wasted.</li>" +
      "<li>Take actions before, between, or after card plays — each as often as you can pay for it.</li>" +
      "<li><b>Clank!:</b> add cubes from your supply to the Clank! area; negative Clank! removes your cubes (or credits Clank! you'd make later this turn). Leftover negative Clank! is lost. With no cubes left in your supply you can't take voluntary tunnel damage — but you also can't be forced to add Clank!.</li>" +
      "<li>Card effects apply regardless of play order (Swagger counts Clank! made before you played it — and Clank! you later remove with negative Clank!; The Mountain King sees a Crown bought later).</li>" +
      "<li>Draws always come from <b>your own deck</b>; reshuffle your discard pile when empty (cards in your play area are not included).</li>" +
      (c.has("party") ? "<li><b>React (Adventuring Party):</b> when a React card's condition occurs during an opponent's turn (or between turns), you may play it to your play area and immediately draw a replacement. Its resources and text wait until your next turn.</li>" +
        "<li><b>Arrive Choice (Adventuring Party):</b> each player decides whether to take what the card offers — or, if it offers two options, must choose one of them — starting with the player about to begin their turn (or, if it arrives mid-turn, the player taking their turn).</li>" : "") + "</ul>",
    src: (c) => c.has("party") ? "Base p.4, p.6–7, p.10 · Adventuring Party p.4 · FAQ p.1–2, p.4" : "Base p.4, p.6–7, p.10 · FAQ p.1–2, p.4"
  },
  {
    title: "Actions",
    when: () => true,
    html: (c) => "<ul><li><b>Acquire a card</b> (Skill): blue banners from the Dungeon Row, yellow banners from the Reserve; the card goes to your discard pile. The Reserve is limited and can run out.</li>" +
      "<li><b>Use a Device</b> (Skill): purple banners; carry out the USE text immediately; the card goes to the Dungeon discard pile.</li>" +
      "<li><b>Fight a Monster</b> (Swords): red banners; gain the DEFEAT text; the card goes to the Dungeon discard pile. The <b>Goblin</b>" + (c.board === "sunken" ? " (and the <b>Goldfish</b>)" : "") + " in the Reserve stays put and can be fought repeatedly.</li>" +
      "<li><b>Buy from the Market</b> (7 Gold, in a Market room): as many purchases as you can afford, including duplicates. All items are available from any Market room.</li>" +
      "<li><b>Move through a tunnel</b> (Boots): 1 Boot each; <b>footprints</b> = 2 Boots; <b>monster icons</b> deal that much damage (each Sword spent prevents 1); <b>lock icons</b> need a <b>Master Key</b>; arrow tunnels are one-way; tunnels off the board edge wrap around to the opposite side.</li>" +
      "<li><b>Room tokens</b> (secrets, Monkey Idols): take <b>one</b> when you enter a room — exit and re-enter for another. Picking one up doesn't end your movement." + (c.p >= 5 ? " <b>5–6 players:</b> minor secrets aren't on the board — when you enter a minor-secret space, take one at random from the Bank and reveal it; only one minor secret per room per turn (re-enter on a later turn for another)." : " With two minor secrets, pick one at random before revealing (FAQ).") + "</li>" +
      "<li><b>Take an Artifact</b> (rules update): taking an Artifact is an <b>action</b> you may take any time you're in its room — not only on entry. You can't hold two (a Backpack allows one more" + (c.p >= 5 ? ", but never two from the same room" : "") + "); taking one advances the <b>Rage Track</b>.</li>" +
      "<li><b>Crystal Caves:</b> entering one (by any means) stops your Boots for the rest of the turn. <b>Teleport</b> effects move you to any adjacent room without Boots, ignoring tunnel monsters, locks and one-way arrows. <b>Fountain of Healing</b> (heal 1 damage) / <b>Treasure rooms:</b> gain the reward on every entry, even in the same turn.</li>" +
      "<li><b>Trash:</b> remove a card from your discard pile or play area from the game entirely — the best fate for weak starters.</li></ul>",
    src: (c) => "Base p.6, p.10, p.12" + (c.board === "sunken" ? " · Sunken p.1" : "") + (c.p >= 5 ? " · Adventuring Party p.3" : "") + " · FAQ (2025-08-18) p.1–4"
  },
  {
    title: "Clank!, Dragon Attacks & Health",
    when: () => true,
    html: (c) => "<ul><li><b>End of turn:</b> discard your play area, draw five, then refill the Dungeon Row to six (the Row refills at the end of <b>every</b> player's turn). Newly revealed cards resolve their <b>Arrive</b> text first; then, if any <b>newly revealed</b> card shows the Dragon Attack symbol, the dragon attacks — once, no matter how many symbols.</li>" +
      "<li><b>Dragon Attack:</b> all Clank! area cubes go into the Dragon Bag; draw cubes equal to the Rage Track number, +1 per <b>Danger</b> card in the Row. Black cubes are set aside; your colored cubes are damage on your <b>Health Meter</b> (10 spaces). Undrawn cubes stay in the bag.</li>" +
      "<li>The <b>Rage Track</b> advances whenever an Artifact is picked up and whenever a <b>Dragon Egg</b> is found" + (c.board === "temple" ? ". On the Temple board, reaching an RNG space rotates gears — and at maximum rage, further increases reveal RNG tokens from the stack instead" : "") + ".</li>" +
      "<li>Players still outside the dungeon early in the game can be damaged if their cubes are drawn (FAQ).</li>" +
      "<li>Dragon-attack damage uses the cubes drawn from the bag; tunnel-monster damage you choose to take uses cubes from your <b>supply</b> — and you can't choose it if it would fill your Health Meter. <b>Healing</b> returns your cube from the meter to your supply. A full meter <b>knocks you out</b>: with an Artifact and out of the <b>Depths</b>, the townsfolk rescue you and your points count; otherwise you score nothing.</li>" +
      "<li>You can't leave the dungeon (or be rescued) without an Artifact. If the Dungeon Deck ever runs out, the game ends immediately — everyone still inside is knocked out (FAQ).</li></ul>",
    src: (c) => "Base p.7–8, p.10" + (c.board === "temple" ? " · Ape Lords p.3" : "") + " · FAQ (2025-08-18) p.2–3"
  },
  {
    title: "The Countdown Track, Game End & Scoring",
    when: () => true,
    html: () => "<ul><li>Escaped or knocked-out players stop taking normal turns, add no Clank!, and are unaffected by cards that affect all players (their drawn cubes count as black).</li>" +
      "<li>The <b>first</b> player to leave the dungeon or get knocked out puts their pawn on the <b>Countdown Track</b>. Each of their turns advances it one space: spaces 2–4 trigger instant Dragon Attacks with <b>+1 / +2 / +3</b> extra cubes; the fifth space <b>knocks out everyone</b> still in the dungeon. (Later leavers don't use the track. Row-triggered attacks don't get the extra cubes — FAQ.)</li>" +
      "<li><b>Escape bonus:</b> leaving the dungeon entirely earns a <b>Mastery token</b> (+20 points). Leaving doesn't have to be the last thing you do on your turn; your Clank! stays in the area (FAQ).</li>" +
      "<li><b>Game end:</b> once <b>all</b> players are out of the dungeon or knocked out, the game ends (the Countdown's fifth space forces this).</li>" +
      "<li><b>Score</b> (if you escaped, or were knocked out with an Artifact outside the Depths): Artifact value + all tokens + Gold + points on your cards. Most points wins; ties go to the most valuable Artifact.</li></ul>",
    src: () => "Base p.8–9 · FAQ (2025-08-18) p.2–3"
  },
  {
    title: "Token & Market Reference",
    when: () => true,
    html: (c) => "<ul><li><b>Major Secrets:</b> Potion of Greater Healing (heal 2), Greater Skill Boost (+5 Skill), Greater Treasure (5 Gold), Flash of Brilliance (draw 3), Chalice (7 pts; not an Artifact)" + (c.has("sunken") ? "; Potion of Heroism (+1 Boot, +1 Sword, heal 1)" : "") + (c.board === "mummy" ? "; Mummy's Treasure (5 Gold) and Mummy's Chalice (7 pts) — each also rolls the pyramid die" : "") + ".</li>" +
      "<li><b>Minor Secrets:</b> Potion of Healing (heal 1), Potion of Swiftness (+1 Boot), Potion of Strength (+2 Swords) — potions are kept until used on your turn; Skill Boost (+2 Skill), Treasure (2 Gold), Magic Spring (<b>rules update:</b> trash a card from your discard pile or play area <i>by</i> the end of the turn), Dragon Egg (3 pts; Rage +1)" + (c.board === "mummy" ? "; Scarab (3 pts; roll the pyramid die)" : "") + (c.p >= 5 ? "; Potion of Stealth (on your turn: −1 Clank! for you, +1 for each opponent; usable even if you have no Clank! to remove)" : "") + ".</li>" +
      "<li><b>Market items (7 Gold each):</b> Master Key (use locked tunnels; 5 pts), Backpack (carry an additional Artifact; 5 pts" + (c.p >= 5 ? "; never two from the same room" : "") + "), Crown (points as shown; best available first)" + (c.board === "sunken" ? ", SCUBA (5 pts; see Sunken Treasures)" : "") + (c.has("mummy") ? ", Ankh (heal 1 when bought; 7 pts)" : "") + ((c.board === "jungle" || c.board === "temple") ? ", Time Winder (remove three of your cubes from the Dragon Bag when bought; 5 pts)" : "") + (c.p >= 5 || c.has("party") ? ", Invisibility Cloak (ignore monsters in tunnels; 5 pts)" : "") + ".</li>" +
      "<li><b>Monkey Idols:</b> 5 pts each, from the Monkey Shrine — you pick one up on <b>every</b> entry (FAQ)" + (c.board === "mummy" ? "; the Supreme Monkey Idol is worth 10 pts and is otherwise a normal Monkey Idol" : "") + ".</li></ul>",
    src: (c) => {
      const s = ["Base p.1–2, p.6, p.12"];
      if (c.has("sunken")) s.push("Sunken p.2");
      if (c.has("mummy")) s.push("Mummy p.4");
      if (c.board === "jungle" || c.board === "temple") s.push("Ape Lords p.2");
      if (c.has("party") || c.p >= 5) s.push("Adventuring Party p.2–3");
      s.push("FAQ p.1, p.3");
      return s.join(" · ");
    }
  },
  {
    title: "Sunken Treasures — Swimming & SCUBA",
    when: (c) => c.has("sunken"),
    html: (c) => "<ul>" +
      (c.board === "sunken"
        ? "<li><b>Swimming:</b> if you begin your turn in a <b>flooded room</b>, you must enter a non-flooded room at some point that turn or take 1 damage at its end. <b>SCUBA</b> (7 Gold, 5 pts) avoids this. (If you must take the damage with no cubes left, you're knocked out.)</li>" +
          "<li><b>Underwater tunnels</b> (between two flooded rooms): 2 Boots — or 1 with SCUBA.</li>" +
          "<li><b>Clank! tunnels:</b> moving through adds Clank! per icon (the splash). Teleporting doesn't; with no cubes left, you move free.</li>" +
          "<li><b>Treasure rooms:</b> gain the shown Gold on every entry.</li>" +
          "<li><b>Goldfish</b> (Reserve): fight it repeatedly, like the Goblin.</li>"
        : "<li>The Sunken Treasures <b>board</b> isn't in play — its cards, Market Board and Secrets still are. Flooded-room rules apply only on its board.</li>") +
      "<li><b>“When you discard this” cards:</b> trigger only when discarded <b>during</b> your turn (e.g. to Sleight of Hand) — not at end-of-turn cleanup, and not when acquired.</li></ul>",
    src: (c) => "Sunken p.1–2 · FAQ p.2" + (c.board === "sunken" ? ", p.4" : "")
  },
  {
    title: "The Mummy's Curse — Curses & the Mummy",
    when: (c) => c.has("mummy"),
    html: (c) => "<ul><li><b>Curses:</b> each is <b>−2 points</b> at game end. Curses can be removed from yourself (never an opponent), returning them to the Bank. Curse tokens aren't limited — if the Bank runs out, use any substitute.</li>" +
      (c.board === "mummy"
        ? "<li><b>Curse tunnels:</b> moving through one gives you a Curse per Curse icon.</li>" +
          "<li><b>The Mummy</b> can be fought only when its marker is in the <b>zone</b> containing your room. Two ways to defeat it: <b>2 Swords</b> → 4 Gold but take a Curse; <b>3 Swords</b> → remove <b>half your Curses</b> (rounded up).</li>" +
          "<li>After each defeat, roll the <b>pyramid die</b> and move the Mummy to the rolled zone. If it <b>moves</b>, every player in a room of its new zone takes a Curse. (Some cards' Arrive text also rolls the die.) You may defeat it more than once per turn — if you can follow it.</li>"
        : "<li>The Mummy's Curse <b>board</b> (and the Mummy itself) isn't in play — its cards, Ankhs and Curse tokens still are, but its Secrets are used only with its board.</li>") +
      "</ul>",
    src: (c) => c.board === "mummy" ? "Mummy p.2–3" : "Mummy p.2"
  },
  {
    title: "Gold and Silk — Mine & Spider's Lair",
    when: (c) => c.has("goldsilk"),
    html: (c) => "<ul>" +
      (c.board === "mine"
        ? "<li><b>Mining:</b> in a room touching a gold vein, spend <b>2 Skill</b> to take the shown Gold and cover the vein with one of your Clank! cubes (no cube, no mining; each vein mines once). After mining, <b>no more Boots</b> this turn (teleports still work).</li>" +
          "<li><b>Mining Bonus:</b> at game end, most veins mined takes the <b>20-point</b> token, second most <b>10</b>, third <b>5</b> (ties: deepest vein wins). You must have mined at least once <i>and</i> have a score to claim one.</li>" +
          "<li><b>Elevators:</b> pay <b>1 Gold</b> to the bank each time you ride one to or from the Depths.</li>"
        : "") +
      (c.board === "spider"
        ? "<li><b>Web tokens:</b> to move through one, spend <b>a Sword or one extra Boot</b>; take the token face down — its hidden points are yours at game end, and the passage is clear for everyone after.</li>" +
          "<li><b>Webbed rooms:</b> the gold/secret/Monkey Idol inside must be “cut loose” by spending <b>a Sword</b> when you first enter; otherwise exit and re-enter to try again. (Cards that take tokens from adjacent rooms skip the Sword — FAQ.)</li>" +
          "<li><b>The Queen's Web Cache:</b> spend <b>8 Skill</b> to take any one of the eight treasures (gold, healing used immediately, Boots/Swords for this turn, often a Secret Tome from the Reserve if any remain), marking it with one of your Clank! cubes (no cube, no treasure). Each treasure is claimed once per game.</li>"
        : "") +
      ((c.board !== "mine" && c.board !== "spider") ? "<li>Neither Gold and Silk board is selected — this expansion adds no cards, so beyond its extra Gold (and optional Market Board) it has no effect on other boards.</li>" : "") +
      "</ul>",
    src: (c) => c.board === "spider" ? "Gold & Silk p.2 · FAQ p.4" : "Gold & Silk p.1"
  },
  {
    title: "Temple of the Ape Lords — Jungle & Temple",
    when: (c) => c.has("apelords"),
    html: (c) => "<ul>" +
      ((c.board === "jungle" || c.board === "temple") ? "<li><b>Time Winder</b> (Market, 7 Gold): on purchase, immediately remove <b>three of your cubes</b> from the Dragon Bag; worth 5 pts.</li>" : "") +
      (c.board === "jungle"
        ? "<li><b>Clank! tunnels</b> (vines): add 1 Clank! per icon when moving (not when teleporting).</li>" +
          "<li><b>Ape-aratus tokens:</b> moving along a marked tunnel <b>with Boots</b> (not teleporting) takes its token. The <b>Bronze Guardian</b> is a monster printed on the board (other effects treat it as a monster and a monster card, e.g. Garignar's carnage reward): 3 Swords defeats it for one of its three tokens (no reward once they're gone).</li>" +
          "<li><b>Scoring:</b> score each token type (cog, monkey wrench, banana) separately by how many of it you collected: 1 → 1, 2 → 4, 3 → 9, 4 → 16, 5 → 25, 6 → 36 pts (the table above the Bronze Guardian).</li>"
        : "") +
      (c.board === "temple"
        ? "<li><b>Gears</b> reshape the tunnels; a tunnel that doesn't line up with the gear is a dead end (not even teleports). Branching gear tunnels depend on your direction of travel — you can't change direction on a gear.</li>" +
          "<li><b>Rotating gears:</b> as an action while adjacent to a gear, turn one of your <b>ape-aratus tokens</b> with the matching symbol face up (then to the box) to set that gear to any orientation. Each token is used once; unused tokens score nothing.</li>" +
          "<li><b>RNG tokens:</b> when the Boss marker reaches a Rage Track space with one, reveal it and rotate the indicated gears one turn clockwise (all three gears with that symbol, all nine, or none). If rage would increase while the marker is already on the top space (five cubes), reveal one from the stack above the track instead. Return each resolved RNG token to the box.</li>"
        : "") +
      (c.mod("campaign") ? "<li><b>Mini-Campaign:</b> play the Jungle, award Campaign tokens by final score (20/10/5; knocked out in the Depths = none), then play the Temple keeping your Campaign token and your collected ape-aratus tokens (face up). Add the Campaign token to your final score; unused ape-aratus tokens score nothing.</li>" : "") +
      ((c.board !== "jungle" && c.board !== "temple") ? "<li>Neither Ape Lords board is selected — this expansion adds boards only (no cards), so it has no effect on other boards.</li>" : "") +
      "</ul>",
    src: (c) => c.board === "jungle" ? "Base p.6 · Ape Lords p.2" + (c.mod("campaign") ? ", p.4" : "") + " · FAQ p.1" : (c.board === "temple" ? (c.mod("campaign") ? "Base p.6 · Ape Lords p.2–4" : "Base p.6 · Ape Lords p.2–3") : (c.mod("campaign") ? "Ape Lords p.1, p.4" : "Ape Lords p.1"))
  },
  {
    title: "Adventuring Party — 5 & 6 Players & Characters",
    when: (c) => c.p >= 5 || c.mod("chars"),
    html: (c) => "<ul>" +
      (c.p >= 5 ? "<li><b>Artifacts:</b> many rooms hold two (gold on top, silver below); the first claimant takes gold. In scoring ties between same-value artifacts, gold wins. A Backpack never allows two artifacts from the same room.</li>" +
        "<li><b>Minor secrets</b> come face down from the Bank when you enter a minor-secret space (one per room per turn).</li>" +
        "<li>The <b>side board</b> adds Health Meters for the fifth and sixth players and the Rage Track used for the game.</li>" : "") +
      (c.mod("chars") ? "<li><b>Characters:</b> six thieves, each with a character board and a 10-card custom deck containing three unique cards (e.g. Agnet's conscription tokens put acquired companions on top of her deck; D'allan's cards reward his displayed “Finds”). Play characters only against other characters.</li>" +
        "<li><b>Character powers:</b> <b>Agnet</b>: 4 conscription tokens; when you acquire a companion you may spend one (to the box) to put it on top of your deck. <b>D'allan</b>: your first dragon egg, artifact, crown and monkey idol go on your board as “Finds” for Collection/Competition/Exhibit. <b>Garignar</b>: the first time each turn you defeat a Monster card (even the Goblin, or the Bronze Guardian per the FAQ; not monsters in tunnels), advance the carnage token one space clockwise and take that reward. <b>Lenara</b>: hold at most 10 mana; on your turn cast each spell at most once: Transfigure (3: discard a card, then draw a card), Duplicate (5: copy a card in your play area), Levitate (7: acquire a card without paying its Skill cost, into your hand). <b>Whiskers</b>: if all three behavior tokens are face down when you end your turn (before refilling the Row), you must cause a Dragon Attack of exactly four cubes (ignoring the Rage Track and any extra danger); your own cubes return to your supply without damage. Then draw your hand, flip the tokens face up, and refill the Row. <b>MonkeyBot Prime</b>: when damaged in a Dragon Attack, remove the leftmost cogwheel (only one per attack; not for other damage; never replaced); each turn you get every reward revealed.</li>" : "") +
      "<li><b>New card terms:</b> <b>React</b> (when its condition occurs during an opponent's turn, or for some cards between turns while the Row refills, you may play it from your hand to your play area, now or later that turn, and immediately draw a replacement; its resources and text resolve on your next turn. Played on your own turn it works normally but draws no extra card) and <b>Arrive Choice</b> (when it arrives in the Row, each player chooses whether to take what it offers, starting with the player about to begin their turn, or the active player if it arrives mid-turn; if the card offers two options, each player must choose one).</li></ul>",
    src: (c) => c.p >= 5 ? (c.mod("chars") ? "Adventuring Party p.2–7 · FAQ p.1" : "Adventuring Party p.2–4") : "Adventuring Party p.2, p.4–7 · FAQ p.1"
  },
  {
    title: "Key Rulings — FAQ & Rules Updates (2025-08-18)",
    when: () => true,
    html: (c) => "<ul><li><b>Rules update — Taking an Artifact:</b> an action during your turn while in the room, not an on-entry pickup (lets you buy a Backpack first, or come back for it later).</li>" +
      "<li><b>Rules update — Magic Spring:</b> trash a card <i>by</i> the end of the turn (it may be one you draw after finding the secret).</li>" +
      "<li>The Dungeon Row refills at the end of <b>every</b> player's turn; cards trigger a Dragon Attack only on the turn they arrive.</li>" +
      "<li><b>Setup Arrive text</b> on the initial Row resolves before the first turn.</li>" +
      "<li><b>“If you have X”</b> effects trigger once, no matter how many X you have.</li>" +
      "<li><b>Discarding</b> is from your unplayed hand; you can dodge a discard cost by playing that card last — but then you don't get its benefit.</li>" +
      "<li><b>Market:</b> buying is a normal action — any number of items per turn. Tokens sitting in a Market room are free to take.</li>" +
      "<li><b>Leaving the dungeon</b> can happen mid-turn, and your Clank! stays in the area. Cards teleporting you to an “adjacent room” can take you out of the dungeon.</li>" +
      "<li><b>Exhausted Dungeon Deck:</b> the game ends immediately; everyone still inside is knocked out (scoring only if they'd count normally).</li>" +
      "<li><b>Expansion mixing:</b> officially free-form, but the FAQ recommends one expansion's cards at a time, sorted by watermark.</li>" +
      "<li>A <b>Dragon Egg</b> is not an Artifact.</li>" +
      "<li><b>Secret Tome</b> does nothing when you draw and play it (a great card to discard).</li>" +
      "<li><b>Swagger</b> gives 1 Skill for each Clank! you make this turn, even Clank! you later remove with negative Clank!.</li>" +
      "<li><b>Secrets and Monkey Idols</b> are picked up when you first enter the room; any other actions there (such as buying from a Market) happen afterward.</li>" +
      "<li>Your first damage cube goes <b>on</b> the heart-icon space of your Health Meter, not next to it.</li>" +
      "<li>Latest rulings: <b>direwolfdigital.com/clank</b>.</li></ul>",
    src: () => "FAQ & Rules Updates (2025-08-18) p.1–4 · Mummy p.4"
  }
];

/* =============================================================================
   TEACHING SCRIPT
   ============================================================================= */
CK.teach = {
  intro: "A ~5-minute teach for the exact sets and board selected above. Read it aloud, or hit Copy and tweak. Rules content is drawn from the rulebooks and FAQ cited in the setup steps.",
  sections: [
    {
      h: "The hook — and how you win",
      body: (c) => "<p>We're thieves creeping into " + ({front:"Dragon Keep",back:"Dragon Keep",sunken:"a half-drowned ruin",mummy:"the pyramids of the Ancients",mine:"an abandoned dwarven mine",spider:"the Spider Queen's castle",jungle:"a jungle hiding a lost temple",temple:"the Temple of the Ape Lords"}[c.board]) + " to steal an <b>Artifact</b> from under a sleeping dragon. Two goals: get an Artifact and get out alive, and score more than everyone else — your Artifact plus treasure, Gold, and the cards you bought.</p>" +
        "<p>The catch is noise. Careless cards make <b>Clank!</b> — cubes of your color that pile up in one shared pool. When the dragon attacks, cubes are drawn blind from a bag: black ones are harmless, <i>yours</i> are damage. And remember: if you're knocked out without an Artifact, or down in the <b>Depths</b>, you score <b>zero</b>. Escape artists beat corpses.</p>"
    },
    {
      h: "The shape of a turn",
      body: () => "<p>You hold five cards and <b>must play them all</b>, any order. They make three currencies: <b>Skill</b> buys cards for your deck, <b>Swords</b> fight monsters, <b>Boots</b> move you. Spend everything — nothing carries over. Then discard, draw five, refill the card row… and if a new card shows the <b>Dragon Attack</b> symbol, the bag comes out.</p>"
    },
    {
      h: "The actions — and why you take them",
      body: (c) => "<ul><li><b>Buy cards</b> from the row with Skill — this is your engine; a lean deck of strong cards wins games. Trash your Stumbles whenever you can.</li>" +
        "<li><b>Fight monsters</b> with Swords for gold and favors (the Goblin in the Reserve is an all-you-can-beat buffet for 2 Swords a swing).</li>" +
        "<li><b>Move</b> with Boots: some tunnels need two, locked ones need a <b>Master Key</b>, and monster tunnels bite unless you flash a Sword per monster.</li>" +
        "<li><b>Loot rooms</b>: one secret or Monkey Idol per visit; the <b>Market</b> sells keys, backpacks and crowns for 7 Gold.</li>" +
        "<li><b>Grab an Artifact</b>: on your turn, any time you're in its room. You carry only one (a Backpack from the Market allows a second). The moment you take it, the dragon's <b>rage rises</b>, and you can't put it back. Deep ones are worth more; the cheap, easy-to-reach ones are for cowards with plans.</li></ul>"
    },
    {
      h: "The dragon — the heart of it",
      body: () => "<p>Every attack, the whole Clank! pool goes into the bag and we draw as many cubes as the <b>Rage Track</b> shows, plus one for each <b>Danger</b> card in the row. Your cubes = damage on your 10-space health meter. Fill it and you're out. Rage climbs with every stolen Artifact (and every Dragon Egg found), so the endgame accelerates all by itself.</p>" +
        "<p>Timing the exit is the real game: making it out banks a <b>+20 Mastery token</b>, and the <i>first</i> thief out (or knocked out) spends their turns on the <b>Countdown Track</b>, hammering everyone still inside with bonus attacks — and its fifth space ends the game outright. Escaping early isn't quitting; it's a weapon.</p>"
    },
    { when: (c) => c.board === "sunken",
      h: "This board — Sunken Treasures",
      body: () => "<p>Much of this dungeon is <b>underwater</b>. Start your turn in a flooded room and you must surface somewhere dry by turn's end or take damage. Tunnels between flooded rooms cost <b>two Boots</b> — unless you've bought <b>SCUBA</b> at the market, which fixes both problems and scores 5. Splashy tunnels add Clank!, treasure rooms pay gold every visit, and a <b>Goldfish</b> joins the Goblin as a repeatable punching bag. Watch for cards that reward you <i>when discarded</i>.</p>" },
    { when: (c) => c.board === "mummy",
      h: "This board — The Mummy's Curse",
      body: () => "<p>A <b>Mummy</b> roams the four zones of this pyramid, and <b>Curses</b> (−2 points each) drip from cursed tunnels. If the Mummy's in your zone, fight it: <b>2 Swords</b> pays 4 Gold but curses you; <b>3 Swords</b> cleanses <b>half your Curses, rounded up</b>. Then the pyramid die sends it wandering — cursing anyone in the zone it enters. The market sells <b>Ankhs</b> (heal on purchase, 7 points), and a <b>Supreme Monkey Idol</b> worth 10 waits somewhere in the sands.</p>" },
    { when: (c) => c.board === "mine",
      h: "This board — the Dwarven Mine",
      body: () => "<p>The walls here are literally money: stand by a <b>gold vein</b>, spend <b>2 Skill</b>, and dig it out — but mining ends your walking for the turn, and each vein pays only once. At game end the most industrious miners split <b>20/10/5-point bonuses</b> (deepest digger wins ties). Two <b>elevators</b> run straight to the Depths for 1 Gold a ride — fast in, fast out. The entrance is on the right edge, so recalibrate your instincts.</p>" },
    { when: (c) => c.board === "spider",
      h: "This board — the Spider Queen's Lair",
      body: () => "<p>Everything here is wrapped in silk. <b>Webs</b> block passages until someone spends a Sword or an extra Boot — and the web you cut is a <b>hidden-value trophy</b> you keep. Rooms with webbed treasure need a Sword on entry to cut the prize loose. And in the corner sits the <b>Queen's Web Cache</b>: eight one-time treasures at <b>8 Skill</b> apiece for whoever gets rich in Skill first. The 7-point artifact is an 8-pointer tonight.</p>" },
    { when: (c) => c.board === "jungle",
      h: "This board — the Jungle",
      body: (c) => "<p>On the way to the temple, tunnels carry <b>ape-aratus tokens</b> — cogs, wrenches, bananas — and you pocket one every time you <i>walk</i> (not teleport) through. Each kind scores by how many of it you hold — piling up one kind pays best — and the <b>Bronze Guardian</b> holds three more for anyone with 3 Swords. Vine tunnels splash Clank!, and the market's <b>Time Winder</b> quietly fishes three of your cubes back out of the dragon bag — one of the best defensive buys in the game. The big artifact is a 33-pointer here.</p>" +
        (c.mod("campaign") ? "<p>This is game one of our <b>mini-campaign</b>: final scores here award <b>20/10/5-point Campaign tokens</b> (nothing for anyone knocked out in the Depths), and every ape-aratus token you collect comes with you to the Temple as your gear-turning toolkit.</p>" : "") },
    { when: (c) => c.board === "temple",
      h: "This board — the Temple",
      body: (c) => "<p>The temple's tunnels run across <b>nine rotating gears</b> — if the paths don't line up, that way is simply sealed, even to teleports. " + (c.mod("campaign") ? "You each hold the <b>ape-aratus tokens</b> you collected in the Jungle, face up" : "You each hold three secret <b>ape-aratus tokens</b>") + ". From a room next to a gear, spend one with the matching symbol to spin that gear <i>any way you like</i>. Each token works once, and unused ones score nothing here. The dragon has opinions too: when its rage hits marked spaces, <b>RNG tokens</b> spin gears clockwise for everyone. Open your own doors, close theirs. The Time Winder (market) pulls three of your cubes from the bag, and the top artifact is worth 33.</p>" +
        (c.mod("campaign") ? "<p>This is game two of our <b>mini-campaign</b>: keep your Campaign token points, and the ape-aratus tokens you gathered in the Jungle are your toolkit tonight — unused ones score nothing.</p>" : "") },
    { when: (c) => c.p >= 5,
      h: "Five or six thieves",
      body: () => "<p>With the Adventuring Party rules: many artifact rooms hold <b>two artifacts</b> (first come takes the gold one, which also wins scoring ties; even with a Backpack, nobody takes both from one room). Minor secrets are drawn blind from the Bank, only one per room per turn, so you come back on a later turn for another. The fifth and sixth players start with 1 and 2 Gold. The bag fills <i>fast</i> at this count — plan your exit a turn earlier than feels brave.</p>" },
    { when: (c) => c.has("party"),
      h: "Adventuring Party content",
      body: (c) => "<p>" + (c.p >= 5 ? "We're using Adventuring Party's cards. Look for" : "If we've shuffled in Adventuring Party's cards (optional at this player count), look for") + " <b>React</b> cards: when the condition happens during another player's turn (or, for some cards, between turns as the Dungeon Row refills), you may play the card from your hand to your play area and draw a replacement at once. Its resources and text wait until your next turn, when you get them along with the rest of your cards. Also look for <b>Arrive Choice</b> cards that make everyone pick their poison. The market may also stock <b>Invisibility Cloaks</b>: ignore tunnel monsters, 5 points.</p>" },
    { when: (c) => c.mod("chars"),
      h: "Characters",
      body: () => "<p>Everyone plays a unique <b>character</b> tonight. Your 10-card starting deck is 5 Burgles, 2 Stumbles and three signature cards (no Sidestep or Scramble), plus a character board with a personal power. Read your three cards before we start; they're your whole identity. Characters only play against other characters, so it's a fair fight.</p>" },
    {
      h: "Don't worry about these until they come up",
      body: (c) => {
        const items = [];
        items.push("<li><b>Individual secrets and market items</b> — read them as they appear; there's a reference on the page.</li>");
        items.push("<li><b>Crystal Caves</b> — they just stop your Boots for the turn.</li>");
        items.push("<li><b>The Countdown Track</b> — it runs itself once the first player escapes or falls.</li>");
        items.push("<li><b>Negative Clank! bookkeeping</b> — remove your cubes, bank the rest for this turn.</li>");
        if (c.board === "sunken") items.push("<li><b>Discard-trigger timing</b>: only when you discard the card during your turn, not at turn's end or on acquiring it.</li>");
        else if (c.has("sunken")) items.push("<li><b>Sunken Treasures cards</b>: they're shuffled into the Dungeon Deck. Many say “when you discard this.” You get that only by discarding the card during your turn (e.g. to Sleight of Hand), never when your played cards go to the discard pile at turn's end or when you acquire it.</li>");
        if (c.board === "mummy") items.push("<li><b>Pyramid-die wanderings</b> — roll and follow; curses land on whoever's in the new zone.</li>");
        else if (c.has("mummy")) items.push("<li><b>Curse tokens</b> — −2 points each at game end; read any card that mentions them as it comes up. The market's <b>Ankhs</b> heal 1 when bought and score 7.</li>");
        if (c.board === "temple") items.push("<li><b>Gear edge cases</b> — no direction changes mid-gear; dead ends are dead even to teleports.</li>");
        if (c.has("goldsilk") && c.board !== "mine" && c.board !== "spider") items.push("<li><b>Gold and Silk</b>: its rules belong to its own two boards. Tonight it only adds Gold to the Bank (and, if you like, its Market Board).</li>");
        if (c.has("apelords") && c.board !== "jungle" && c.board !== "temple") items.push("<li><b>Temple of the Ape Lords</b>: its 33-point Artifact, Time Winders and ape-aratus tokens are used only on its own board, so it changes nothing tonight.</li>");
        if (c.has("party")) items.push("<li><b>React windows</b>: any time during an opponent's turn once the condition happens, even later in that turn, and for some cards between turns as the Row refills. You can't React on your own turn; play the card then and you get its effects as normal, just no extra card.</li>");
        items.push("<li><b>End-of-turn order</b> — discard, draw five, refill the row, check for an attack. It becomes automatic.</li>");
        return "<ul>" + items.join("") + "</ul>";
      }
    }
  ]
};
