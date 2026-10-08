/* =============================================================================
   The Great Wall — Setup & Reference Utility · data
   All content sourced from the official rulebooks and the FAQ/Errata
   (see citations). Errata corrections are applied throughout.
   ============================================================================= */
var GW = {};

GW.expMeta = {
  core: { name: "Core Box",       cls: "tag-core" },
  bp:   { name: "Black Powder",   cls: "tag-bp" },
  sg:   { name: "Stretch Goals",  cls: "tag-sg" },
  ab:   { name: "Ancient Beasts", cls: "tag-ab" },
  faq:  { name: "FAQ",            cls: "tag-faq" },
  mod:  { name: "Module",         cls: "tag-mod" }
};

GW.expansions = [
  { id: "core", short: "The Great Wall", year: "2021", blurb: "The core box: four Clans, three Wall Sections, the Mongol Horde — plus the Reed Clan (2P), solo and co-op modes. Always in play." },
  { id: "bp",   short: "Black Powder", year: "2021", blurb: "Towers, three kinds of War Machine, Special Soldiers for every Clan, and four new Horde types — three of them siege engines that attack the Wall itself." },
  { id: "sg",   short: "Stretch Goals Box", year: "2021", blurb: "Genghis Khan, the Ancient Chronicles scenarios, the 5th player components, and the Rat mini-expansion." },
  { id: "ab",   short: "Ancient Beasts", year: "2021", blurb: "Four legendary beasts with upgradable passive powers, moved after an Upgrade or by Relic cards." }
];

GW.modes = [
  { id: "standard", name: "Standard game", blurb: "Competitive defense of the Wall — most Honor at the end wins. 2 players adds the automated Reed Clan." },
  { id: "coop", name: "Co-op mode", blurb: "Fulfill the Emperor's Requests together before shame or time defeats you all." },
  { id: "solo", name: "Solo mode", blurb: "One General against the AI rival Qin Jiushao — and the Reed Clan underfoot." }
];

GW.modules = [
  { id: "gk", requires: "sg", name: "Genghis Khan", summary: "The Khan himself joins the assault — in a competitive game, defeating him ends the game after that Year",
    description: "A tougher game with the Genghis Khan Horde card, Skill cards, Bannermen and Emperor's Awards. Not compatible with Ancient Chronicles.", src: "Stretch Goals p.3" },
  { id: "ac", requires: "sg", name: "Ancient Chronicles (Scenarios)", summary: "Six scenarios that rewrite the game — play them pure",
    description: "Scenario cards with their own setup and rules. Cannot be combined with any other expansion content.", src: "Stretch Goals p.4" },
  { id: "rat", requires: "sg", name: "Rat mini-expansion", summary: "A lucky Rat wanders the Locations paying out Gold",
    description: "Rat Artifacts, the Rat deck and the Rat miniature. Usable in any mode (except Ancient Chronicles).", src: "Stretch Goals p.7 · FAQ errata" }
];

/* =============================================================================
   SETUP PHASES — c = { has(exp), p, mode, mod(id) }
   ============================================================================= */
GW.phases = [
  {
    title: "Board & General Supplies",
    steps: [
      { when: (c) => c.mod("ac"), exp: "mod",
        t: "Ancient Chronicles — choose a Scenario",
        d: (c) => "<ul><li><b>Before anything else</b>, choose a Scenario, read its card and perform the extra setup steps on its setup side, then do the standard setup below (re-check the card's steps when you finish — Stretch Goals setup step 19). The card's other side holds its special rules.</li>" +
          (c.mode === "coop" ? "<li><b>Co-op:</b> choose <b>Siege of Diaoyucheng</b> or <b>Red Turban Rebellion</b>, the two co-op Scenarios. They use the co-op rules and setup <b>without the Emperor's Requests</b>; the goal is to survive to the end of the game.</li>"
            : "<li>Choose one of the standard-game Scenarios: <i>Freezing Weather</i>, <i>Great Famine</i>, <i>Emperor's Visit</i> or <i>Hungry Ghost Festival</i> (the player with the most Honor wins). <b>Siege of Diaoyucheng</b> and <b>Red Turban Rebellion</b> are co-op only.</li>") +
          "<li>Ancient Chronicles cannot be combined with any other expansion content.</li></ul>",
        src: "Stretch Goals p.4, p.6–7" },
      { when: () => true, exp: "core",
        t: "Main board, Shame pool & Time track",
        d: (c) => {
          let d = "<ul><li>Place the main board with the side matching your player count face up" + (c.p <= 3 ? " (the 2–3 player side)" : " (the 4–5 player side)") + ".</li>";
          if (c.p <= 2) d += "<li><b>" + (c.p === 1 ? "Solo" : "2-player") + ":</b> place a Barricade in each Horde slot of the <b>leftmost Wall Section</b> — it isn't used, and these Barricades are never discarded.</li>";
          d += "<li>Prepare the <b>Shame token pool</b>: " + (c.p === 1 ? "<b>10</b> Shame tokens (solo)" : c.p === 2 ? "<b>20</b> Shame tokens (2 players — FAQ)" : "10 per player (<b>" + (10 * c.p) + "</b>)") + ". Create supplies for Wood, Stone, Gold, Chi, Wound, Shame and Honor tokens, with the Wall levels nearby.</li>";
          d += "<li>Place the <b>Time token</b> " + (c.p <= 2 ? "on the <b>3-player starting slot</b> (the only starting slot on the 2–3 player side — " + (c.p === 2 ? "a 2-player game is set up as a 3-player game" : "solo uses the same side") + "), " : "in the slot matching your player count, ") +
            ((c.has("bp") || c.mode === "coop") ? "<b>+1 side up</b> (Black Powder/co-op — it reminds you to add one extra Horde card at setup and each Spring — FAQ)" : "empty side up") +
            (c.p === 5 ? ", on the <b>2nd slot</b> (a 5-player game lasts at most 4 Years)" : "") + ".</li></ul>";
          return d;
        },
        src: (c) => {
          const s = ["Core p.5"];
          if (c.p <= 2 || c.p >= 4) s.push("Core p.6");
          if (c.p <= 2) s.push(c.p === 1 ? "Core p.12" : "Core p.11");
          if (c.p === 2) s.push("FAQ #22");
          if (c.mode === "coop") s.push("Core p.14");
          if (c.has("bp")) s.push("Black Powder p.3");
          if (c.has("bp") || c.mode === "coop") s.push("FAQ #16");
          if (c.p === 5) s.push("Stretch Goals p.7");
          return s.join(" · ");
        } },
      { when: () => true, exp: (c) => (c.mode === "coop" || c.mod("gk") || c.mod("ac") || c.mod("rat")) ? "mod" : "core",
        t: (c) => c.mode === "coop" ? (c.mod("ac") ? "Artifacts (Ancient Chronicles co-op Scenario)" : "Emperor's Requests (co-op)") : "Artifacts",
        d: (c) => {
          if (c.mode === "coop" && c.mod("ac")) return "<ul><li>The co-op Scenarios (<i>Siege of Diaoyucheng</i>, <i>Red Turban Rebellion</i>) don't use the <b>Emperor's Requests</b>.</li><li>Shuffle the <b>Ancient Chronicles Artifacts</b> with the base <b>Artifact cards</b> and place <b>3</b> face up at random on the Artifact slots, as normal; return the rest to the box. Their effects are active <b>all game</b>, not just at scoring.</li>" +
            (c.mod("gk") ? "<li><b>Genghis Khan:</b> draw 1 random <b>Emperor's Award</b> card, place it near the board with the Emperor's Award model on it.</li>" : "") + "</ul>";
          if (c.mode === "coop") return "<ul><li>Artifact cards are <b>not used</b>. Shuffle the <b>Emperor's Request cards</b> into a face-down deck near the board" + (c.p === 2 ? " — with 2 players, first remove <i>Taunt them and prevail</i>, <i>Warriors for Emperor's guard</i>, <i>Glory belongs to the Emperor</i> and <i>Royal escort for Emperor's officials</i>" : "") + ".</li><li>Draw " + (c.p === 2 ? "<b>2</b> Requests (the third slot is unused)" : "<b>3</b> Requests") + " and place them on the Artifact slots.</li>" +
            (c.mod("gk") ? "<li><b>Genghis Khan:</b> draw 1 random <b>Emperor's Award</b> card, place it near the board with the Emperor's Award model on it.</li>" : "") + "</ul>";
          const mixes = [];
          if (c.mod("ac")) mixes.push("the Ancient Chronicles Artifacts (their effects are active <b>all game</b>, not just at scoring)");
          if (c.has("bp")) mixes.push("the Black Powder Artifacts");
          if (c.mod("rat")) mixes.push("the Rat Artifacts");
          return "<ul>" + (mixes.length ? "<li>Shuffle in " + mixes.join(" and ") + ".</li>" : "") +
            "<li>Shuffle the <b>Artifact cards</b> and place <b>3</b> face up at random on the Artifact slots (top-left of the board); return the rest to the box. Artifacts score extra Honor at the end of the game.</li>" +
            (c.mod("gk") ? "<li><b>Genghis Khan:</b> draw 1 random <b>Emperor's Award</b> card, place it near the board with the Emperor's Award model on it.</li>" : "") + "</ul>";
        },
        src: (c) => {
          if (c.mode === "coop" && c.mod("ac")) return "Core p.14 · Stretch Goals " + (c.mod("gk") ? "p.3–4" : "p.4") + ", p.6–7";
          if (c.mode === "coop") return c.mod("gk") ? "Core p.14 · Stretch Goals p.3" : "Core p.14";
          const s = ["Core p.5"];
          if (c.has("bp")) s.push("Black Powder p.2");
          if (c.mod("ac")) s.push("Stretch Goals p.4");
          if (c.mod("rat")) s.push("Stretch Goals p.7");
          if (c.mod("gk")) s.push("Stretch Goals p.3");
          return s.join(" · ");
        } }
    ]
  },
  {
    title: "Clans, Hordes & Decks",
    steps: [
      { when: () => true, exp: (c) => (c.has("bp") || c.mod("gk")) ? "mod" : "core",
        t: "Choose Clans & take components",
        d: (c) => "<ul><li>Each player chooses a Clan and takes its colored components: <b>6 Command cards, 8 Clerks, 16 Soldiers</b> (10 Spearmen, 4 Archers, 2 Horsemen), a Player Screen, an Honor marker and a Tea track marker.</li>" +
          (c.has("bp") ? "<li><b>Black Powder:</b> each player also takes their Clan's <b>Special Soldiers</b> (each Clan's are different).</li>" : "") +
          (c.mod("gk") ? "<li><b>Genghis Khan:</b> each player also takes their Clan's <b>Bannerman</b>.</li>" : "") +
          (c.mode === "solo" ? "<li><b>Solo:</b> take the <b>Reed Clan</b> Command and General cards and assign one unused Clan's components to the <b>Reed Clan</b> (Tea marker, 3 Clerks, all Spearmen) and another unused Clan's to <b>Qin Jiushao</b> (8 Clerks, all Soldiers, Tea marker, Honor marker, and the 6 <b>Solo Command cards</b> shuffled as his deck). Place 2 of his Horsemen and 2 Spearmen as <b>level-1 Overseers</b>, one in each of the 4 Production Locations.</li>" : "") +
          (c.p === 2 ? "<li><b>2 players:</b> take the <b>Reed Clan</b> Command and General cards, place them between you; assign an unused Clan's Tea marker, <b>3 Clerks</b> and all Spearmen to the Reed Clan. Box the rest.</li>" : "") + "</ul>",
        src: (c) => {
          const s = ["Core p.5"];
          if (c.has("bp")) s.push("Black Powder p.3");
          if (c.mod("gk")) s.push("Stretch Goals p.3");
          if (c.mode === "solo") s.push("Core p.11–12");
          if (c.p === 2) s.push("Core p.11");
          return s.join(" · ");
        } },
      { when: () => true, exp: (c) => (c.has("bp") || c.mod("gk") || c.mode === "coop") ? "mod" : "core",
        t: "Build the Horde deck & place the first Hordes",
        d: (c) => {
          let d = "<ul>";
          if (c.mode === "coop") d += "<li><b>Co-op:</b> the standard Horde cards stay in the box — shuffle the <b>co-op Horde cards</b> as the Horde deck.</li>";
          else {
            if (c.has("bp")) d += "<li><b>Black Powder:</b> remove <b>3 Horde card types</b> at random from the basic deck (9 cards), then add the <b>4 new types</b> (12 cards).</li>";
            if (c.mod("gk")) d += "<li><b>Genghis Khan:</b> remove <b>2 Horde card types</b> at random (6 cards), then add the <b>3 new types</b> (9 cards).</li>";
            d += "<li>Shuffle all Horde cards into the <b>Horde deck</b> at the top of the board.</li>";
          }
          if (c.p <= 2) d += "<li><b>" + (c.p === 1 ? "Solo" : "2-player") + ":</b> first remove every Horde card showing the <b>leftmost Wall Section</b> on its back.</li>";
          if (c.has("bp") || c.mode === "coop") d += "<li>Draw <b>players + 1</b> Horde cards and place them on the Wall Sections as normal.</li>";
          else if (c.mod("gk")) d += "<li>Draw Horde cards equal to the <b>number of players</b> and place them as normal.</li>";
          else if (c.p >= 3) d += "<li>Place 1 Horde card in each <b>first-row slot</b>" + (c.p === 4 ? "; with 4 players add 1 more card per the Invasion indicator on the back of the next Horde card" : "") + (c.p === 5 ? "; with 5 players add <b>2</b> more cards per the Invasion indicators" : "") + ".</li>";
          else d += "<li>Draw 1 Horde card for each of the 2 available Wall Sections.</li>";
          if (c.mod("gk")) d += "<li>Place the <b>Genghis Khan Horde card</b> above the board, draw <b>2 Genghis Khan Skill cards</b> to flank it, and place the Khan's miniature on the Wall Section shown by the Invasion indicator on top of the Horde deck.</li>";
          return d + "</ul>";
        },
        src: (c) => {
          const s = ["Core p.5"];
          if (c.mode === "coop") s.push("Core p.14");
          if (c.has("bp")) s.push("Black Powder p.3");
          if (c.mod("gk")) s.push("Stretch Goals p.3");
          if (c.p <= 2) s.push(c.p === 1 ? "Core p.12" : "Core p.11");
          if (c.p === 5) s.push("Stretch Goals p.7");
          return s.join(" · ");
        } },
      { when: () => true, exp: (c) => c.has("bp") ? "bp" : "core",
        t: (c) => c.has("bp") ? "Walls, Towers & War Machines (no Barricades)" : "Place the Barricades",
        d: (c) => c.has("bp")
          ? "<ul><li><b>Black Powder:</b> do <b>not</b> place Barricades. Instead, place a <b>1st-level Wall</b> in each Section and set the <b>4 Towers</b> beside the Wall Sections.</li>" +
            "<li>After Generals are chosen (setup step 18): each player <b>Upgrades 3 Overseers to level 1</b> in 3 Production Locations of their choosing (Advisor abilities that trigger on Upgrades apply — FAQ #17)" + (c.p === 5 ? " — except a player whose General is <b>Bi Sheng</b>, who skips this Upgrade (FAQ, General cards)" : "") + ".</li>" +
            "<li>Then in Tea order each player places <b>1 War Machine</b> on a Wall Section — each of the three types must be placed once; the other three models wait beside the board with their Help cards. Shuffle the <b>Rocket Shot deck</b>.</li></ul>"
          : "<ul><li>Place <b>" + (c.p <= 2 ? "6 Barricades — one on each Barricade slot of the 2 available Wall Sections" : "9 Barricades, one on each Barricade slot of all Wall Sections") + "</b>.</li></ul>",
        src: (c) => c.has("bp") ? "Black Powder p.3 · FAQ #17" + (c.p === 5 ? " · FAQ (General cards)" : "") :(c.p === 1 ? "Core p.12" : c.p === 2 ? "Core p.11" : "Core p.5") },
      { when: () => true, exp: (c) => (c.mod("ac") || c.mode === "coop" || c.p === 5 || c.has("ab")) ? "mod" : "core",
        t: "Tactic deck, Generals & Advisors",
        d: (c) => {
          const tac = [];
          if (c.has("ab")) tac.push("Ancient Beasts");
          if (c.mod("ac")) tac.push("Ancient Chronicles");
          if (c.p === 5) tac.push("5th Player");
          if (c.mode === "coop") tac.push("co-op");
          const adv = [];
          if (c.has("bp")) adv.push("Black Powder");
          if (c.mod("gk")) adv.push("Genghis Khan");
          if (c.has("ab")) adv.push("Ancient Beasts");
          if (c.mod("ac")) adv.push("Ancient Chronicles");
          if (c.p === 5) adv.push("5th Player");
          return "<ul><li>Shuffle the <b>Tactic deck</b>" + (tac.length ? " (adding the " + tac.join(", ") + " Tactic cards)" : "") + " into its slot on the board.</li>" +
            "<li>Shuffle the <b>General cards</b>" + (c.mode === "coop" ? " (co-op Generals included)" : "") + (c.has("bp") ? " (Black Powder Generals included)" : "") + (c.mod("ac") ? " (Ancient Chronicles Generals included)" : "") + (c.p === 5 ? " (5th Player Generals included)" : "") + " and deal <b>2</b> face down to each player. Everyone keeps <b>1 General</b> and boxes the other.</li>" +
            "<li>Shuffle the <b>Advisor cards</b>" + (adv.length ? " (adding the " + adv.join(", ") + " Advisors)" : "") + (c.mod("rat") ? " (the Rat adds no Advisors, despite its setup step 11 — FAQ errata)" : "") + " and deal <b>2</b> face down to each player. Each player makes one their face-up <b>Active Advisor</b> and slides the other face down under their General as a <b>Supporting Advisor</b> (its back icon showing) — Supporting Advisors power your General's ability.</li>" +
            "<li>Place the Advisor deck by the Advisor track and fill the track's <b>4 slots</b> face up.</li></ul>";
        },
        src: (c) => {
          const s = ["Core p.5"];
          if (c.mode === "coop") s.push("Core p.14");
          if (c.has("bp")) s.push("Black Powder p.2–3");
          if (c.mod("gk")) s.push("Stretch Goals p.3");
          if (c.p === 5 || c.mod("rat")) s.push("Stretch Goals p.7");
          if (c.has("ab")) s.push("Ancient Beasts p.2");
          if (c.mod("ac")) s.push("Stretch Goals p.4");
          if (c.mod("rat")) s.push("FAQ errata");
          return s.join(" · ");
        } }
    ]
  },
  {
    title: "Final Steps",
    steps: [
      { when: () => true, exp: (c) => c.p === 5 ? "sg" : "core",
        t: "Clerks, starting Resources, Honor & Tea",
        d: (c) => "<ul><li>Each player places <b>" + (c.p === 5 ? "4" : "3") + " Clerks</b> in the Clerk space of the board (the other " + (c.p === 5 ? "4" : "5") + " form their pool)." + (c.p === 2 ? " Also place 1 <b>Reed Clan Clerk</b> in each of the Lumber Mill, Quarry and Gold Mine (FAQ errata)." : "") + (c.mode === "solo" ? " Also place 1 <b>Reed Clan Clerk</b> in each of the Lumber Mill, Quarry and Gold Mine." : "") + "</li>" +
          "<li>Each player takes the <b>starting Resources</b> and draws the <b>Tactic cards</b> shown at the bottom of their General card, keeping them behind their Screen (Resources, decks and hands are the game's only hidden information). <b>Errata:</b> Yang Ye's correct Setup line is 2 Wood, 4 Stone, 3 Gold, 7 Chi, 2 Tactic cards, starting Tea 55 (FAQ errata) — use 55 when stacking the Tea markers too.</li>" +
          (c.has("bp") ? "<li><b>Errata:</b> Shen Kuo's setup is 4 Wood, 5 Stone, 3 Gold, 4 Chi, 1 Tactic card, Tea <b>26</b> (FAQ errata).</li>" : "") +
          (c.p === 5 ? "<li><b>Errata:</b> Su Dongpo's setup is 4 Wood, 6 Stone, 4 Gold, 6 Chi, 2 Tactic cards, Tea <b>98</b> (FAQ errata).</li>" : "") +
          "<li>All Honor markers start at <b>0</b>" + (c.mode === "solo" ? " (place Qin Jiushao's there too — or at 50, or give him a 100-Honor token, for higher difficulty)" : "") + ".</li>" +
          "<li>Stack the <b>Tea track markers</b> by each General's starting Tea value (printed, or as corrected by the FAQ errata) — highest on top" + (c.p === 2 ? "; the Reed Clan goes at the bottom" : "") + (c.mode === "solo" ? ". Solo: you are always on top, Qin Jiushao second, the Reed Clan last" : "") + ".</li></ul>",
        src: (c) => {
          const s = ["Core p.5"];
          if (c.p === 5) s.push("Stretch Goals p.7");
          if (c.p === 2) s.push("Core p.11");
          if (c.mode === "solo") s.push("Core p.12–13");
          s.push("FAQ errata");
          return s.join(" · ");
        } },
      { when: (c) => c.mode === "solo", exp: "core",
        t: "Solo — Qin Jiushao's card & Location track",
        d: "<ul><li>Place the <b>Qin Jiushao</b> (solo) General card by his components — your own 2 random General cards are dealt as usual. Place 1 unit of each Resource and 1 Wound marker <b>randomly</b> in the slots of his card's <b>Location track</b> (1 per slot) — he always chases the lowest (rightmost) Resource; the Wound marker stands for the Barracks.</li>" +
          "<li>Draw 2 random Advisor cards and slide them under his card as his first <b>Supporting Advisors</b>.</li></ul>",
        src: "Core p.12" },
      { when: (c) => c.has("ab"), exp: "ab",
        t: "Ancient Beasts — Beasts & Relics",
        d: (c) => "<ul><li>Shuffle the <b>Relic deck</b>, place it near the board and reveal its first card.</li>" +
          "<li>Sort the <b>Ancient Beast cards</b> into 4 piles of 3, face up in descending order (level 1 on top).</li>" +
          "<li>In Tea order, players place the 4 <b>Ancient Beast miniatures</b> on the board in the areas their cards allow" + (c.p === 3 ? " (3 players: the first player places the first and last Beast)" : "") + (c.p === 2 ? " (2 players: the first player places the first and third Beast, the second player the second and last — FAQ errata)" : "") + ".</li></ul>",
        src: (c) => c.p === 2 ? "Ancient Beasts p.2 · FAQ errata" : "Ancient Beasts p.2" },
      { when: (c) => c.mod("rat"), exp: "mod",
        t: "Rat — deck & miniature",
        d: "<ul><li>Shuffle the <b>Rat deck</b>, place it near the board and reveal 1 Rat card.</li><li>The highest player on the Tea track places the <b>Rat miniature</b> in one chosen Location.</li></ul>",
        src: "Stretch Goals p.7" },
      { when: (c) => c.mode === "coop", exp: "core",
        t: "Co-op — Events",
        d: "<ul><li>Shuffle the <b>co-op Event cards</b> into a face-down deck near the board. One is revealed at the end of each Winter (after the Request step — FAQ errata); their passive effects stay for the whole game.</li></ul>",
        src: "Core p.14 · FAQ errata" },
      { when: () => true, exp: "core",
        t: "Begin — Year 1 starts with Fall",
        d: "<ul><li>The first Year <b>skips Spring and Summer</b> — begin with Fall: everyone secretly picks a Command card, reveals simultaneously, and places them on the Command track in Tea order.</li></ul>",
        src: "Core p.5, p.10" }
    ]
  }
];

/* =============================================================================
   RULES REFERENCE
   ============================================================================= */
GW.reference = [
  {
    title: "Flow of the Game — the Four Seasons",
    when: () => true,
    html: (c) => "<ol><li><b>Spring</b> — advance the Time track; place new Horde cards per the number above the Time token" + ((c.has("bp") || c.mode === "coop") ? " <b>+1</b> (Black Powder/co-op)" : "") + "; refresh the Advisor track (discard the 2 leftmost, slide, refill" + (c.mode === "solo" ? " — solo: one of the discarded two becomes a Qin Jiushao Supporting Advisor" : "") + ").</li>" +
      "<li><b>Summer</b> — Overseer Income (each Overseer pays the Resources above its slot); optionally discard Shame tokens at <b>2 Chi each</b>" + (c.mode === "coop" ? " (co-op: instead lose <b>10 Honor</b> per token, either immediately when received or now)" : "") + "; discard the Command track; then in Tea order each player either <b>Reclaims</b> all their discarded Command cards or takes <b>2 Honor per card</b> left in their discard" + (c.mode === "coop" ? " (co-op: no Reclaiming step — you Reclaim 1 card only when you build a Wall part)" : "") + ".</li>" +
      "<li><b>Fall</b> — all players secretly choose 1 Command card, reveal simultaneously, and slot them on the <b>Command track</b> in Tea order" + (c.mode === "coop" ? " (co-op: you agree the card order together instead)" : "") + ". Each card then resolves in track order: the <b>Active player</b> runs their card's effects (the framed middle effect is for all <i>other</i> players), then the <b>Activation step</b> (full Regular Locations and occupied Special Locations fire, in an order the Active player chooses, each resolved in Tea order" + (c.mode === "coop" ? " — co-op: in an order the players agree" : "") + "), then a <b>Horde Defeat check</b>.</li>" +
      "<li><b>Winter</b> — the <b>Firing phase</b> (Archers" + (c.has("bp") ? ", Bombers and Crossbowmen" : "") + " in Firing spots shoot, left to right, in Tea order; then a Horde Defeat check), the <b>Assault phase</b> (each Wall Section compares Defense + 2 per Barricade against the total Offensive Power of its Hordes — lower Defense means a <b>Breach</b>), Barricades are discarded, " + (c.mode === "coop" && !c.mod("ac") ? "players may fulfil Emperor's Requests (<b>Request fulfillment step</b>), the <b>End Game check</b> runs, then the <b>Emperor's Request step</b> (1 Shame token each per unfulfilled Request; refill the empty slots) and the <b>Event step</b> (reveal 1 Event — FAQ errata)" : c.mode === "coop" ? "the <b>End Game check</b> runs, then the <b>Event step</b> (reveal 1 Event — FAQ errata; this Scenario uses no Emperor's Requests)" : "and the <b>End Game check</b> runs") + ".</li></ol>",
    src: (c) => {
      const s = [c.mode === "coop" ? "Core p.10–11, p.14 · FAQ errata" : "Core p.10–11"];
      if (c.mode === "coop" && c.mod("ac")) s.push("Stretch Goals p.6–7");
      if (c.mode === "solo") s.push("Core p.13");
      if (c.has("bp")) s.push("Black Powder p.3–4 · FAQ #16");
      return s.join(" · ");
    }
  },
  {
    title: "Clerks, Locations & Activation",
    when: () => true,
    html: (c) => "<ul><li>You start with " + (c.p === 5 ? "4" : "5") + " Clerks in your pool (" + (c.p === 5 ? "4" : "3") + " more are on the board's Clerk space, hireable at the Embassy). Command cards <b>Move</b> Clerks into Locations — you may also relocate Clerks already on the board, but never out of a full Regular Location.</li>" +
      "<li><b>Regular Locations</b> (red spots) Activate only when <b>every</b> Clerk slot is filled; <b>Special Locations</b> (green spots) Activate with 1+ Clerks, any number allowed.</li>" +
      "<li>On Activation each player resolves <b>all</b> their Clerks there (in Tea order" + (c.mode === "coop" ? " — in co-op you choose the order together; Tea order only breaks ties for claiming Hordes" : "") + "), then Clerks return to their pools — except at the <b>Emperor's Embassy</b>, where Clerks resolve one at a time. Receiving a Location's effect is optional.</li>" +
      "<li><b>Shame icon Locations:</b> if only one player has Clerks there when it Activates, that player takes a Shame token; with two or more Clans present, nobody does.</li>" +
      "<li><b>Advanced Activation</b> (from cards/Advisors): may fire a Regular Location that isn't full, and never hands out the Shame-icon token.</li></ul>",
    src: (c) => ["Core p.7", c.p === 5 ? "Stretch Goals p.7" : null, c.mode === "coop" ? "Core p.14" : null].filter(Boolean).join(" · ")
  },
  {
    title: "The Locations",
    when: () => true,
    html: (c) => "<ul><li><b>Production Locations</b> (Lumber Mill – Wood, Quarry – Stone, Gold Mine – Gold, Temple – Chi): each Clerk gathers 1 Resource; an <b>Overseer</b> adds its level if you gathered at least 1. Then each player with a Clerk there may <b>Upgrade one Overseer one level</b> (pay the next slot's cost; your first placement uses a Soldier from your pool — it never comes back). Then each gatherer may <b>Donate</b> exactly 1 of that Resource to the Warehouse for <b>2 Honor</b> (no Chi Donations). One Overseer per player per Location, one Upgrade per Activation (FAQ #8).</li>" +
      "<li><b>Barracks:</b> each Clerk Recruits 1 Soldier (Spearman 2 Stone + 1 Wood · Archer 2 Chi + 1 Wood · Horseman 3 Gold + 1 Wood" + (c.has("bp") ? " · your Clan's Special Soldier: Warrior Monk 2 Wood + 1 Chi · Bomber 1 Wood + 1 Gold + 1 Chi · Flamethrower 3 Wood + 1 Chi · Crossbowman 2 Gold + 2 Chi · Tank 2 Wood + 2 Stone + 2 Gold" : "") + (c.mod("gk") ? " · Bannerman 2 Gold + 1 Wood" : "") + "); fresh recruits may immediately <b>Attack</b> any Wall Section or go to a Rest Zone. Multiple recruits resolve simultaneously.</li>" +
      "<li><b>Builders' Encampment:</b> per Clerk, build a <b>Barricade</b> in a Wall Section holding fewer than 3 (2 of Wood/Stone/Gold in any mix; +2 Honor) or a <b>Wall part</b> (cost printed on the current level; Honor = the cost: 5/10/15)" + (c.has("bp") ? " or a <b>War Machine</b> (+4 Honor, and you may Shoot with it at once)" : "") + ". <b>Warehouse Resources must be spent first</b> — they're free but grant no extra Honor.</li>" +
      "<li><b>Emperor's Embassy</b> (Clerks resolve individually): hire a <b>Clerk</b> for 2 Gold, or hire an <b>Advisor</b> for Gold equal to your total Advisor count after hiring; the track refills between hires.</li>" +
      "<li><b>Tea House:</b> everyone with Clerks there moves up 1 step in the Tea stack (in prior Tea order); fill <b>all</b> its slots alone and you jump straight to the top.</li>" +
      "<li><b>Logistics Center:</b> per Clerk, Move any number of Soldiers from one Wall Section to another (Rest Zone→Rest Zone, Firing spot→Firing spot, Firing spot→Rest Zone — never Rest Zone→Firing spot, and never as an Attack).</li>" +
      "<li><b>War Academy:</b> per Clerk, draw 1 Tactic card (hand limit 5).</li>" +
      "<li><b>Warehouse:</b> holds Donated Resources for anyone's Walls and Barricades; Clerks can't go there" + (c.mod("ac") ? " (except in the Emperor's Visit Scenario)" : "") + ".</li></ul>",
    src: (c) => {
      const s = ["Core p.7–9"];
      if (c.has("bp")) s.push("Black Powder p.3–4");
      if (c.mod("gk")) s.push("Stretch Goals p.3");
      if (c.mod("ac")) s.push("Stretch Goals p.5");
      s.push("FAQ");
      return s.join(" · ");
    }
  },
  {
    title: "Soldiers — Attack & Wounding",
    when: () => true,
    html: (c) => "<ul><li>Soldiers Attack when freshly Recruited (any Wall Section), when placed from a Rest Zone (same Section only), or — for Archers — when Firing. Soldiers already on Horde cards can't Attack or Move (FAQ #5). A covered <b>Vital spot</b> = a Wound; covering a spot with a Soldier pays that spot's printed reward.</li>" +
      "<li><b>Spearmen</b> go on the <b>first-row</b> Horde card only, one free Vital spot each.</li>" +
      "<li><b>Horsemen</b> go on <b>any</b> Horde card in the Section, covering <b>2 adjacent</b> free Vital spots (never diagonal).</li>" +
      "<li><b>Archers</b> occupy Wall <b>Firing spots</b>; when they Attack (or Fire in Winter) they place a <b>Wound marker</b> on any Vital spot of any Horde in the Section. Wound-marker Wounds pay no reward.</li>" +
      (c.has("bp") ? "<li><b>Special Soldiers (Black Powder):</b> Warrior Monk (Monkey — any Horde card, 1 spot) · Bomber (Panda — Fires, then may drop onto the first row like a Spearman) · Flamethrower (Dragon — first row; Wounds each orthogonally adjacent <b>empty</b> spot, FAQ #12) · Crossbowman (Snake — Fires; its Wounds are <b>Snake Clan tokens</b>, which count as your Soldiers when a Horde is Defeated, can't die, and protect you from Breach Shame) · Tank (Turtle — first row, covers up to 4 spots, may cover Wound markers but not Soldiers/Snake tokens, immune to War Machines). Bombers and Crossbowmen in Firing spots earn no 2-Honor Defeat bonus but die like Archers in a Breach (errata).</li>" : "") +
      (c.mod("gk") ? "<li><b>Bannermen (Genghis Khan):</b> follow Spearman rules; if yours is on a Wall Section at the start of Winter, you may Attack with <b>2 Soldiers</b> there right before the Shooting step. Bannermen count as Soldiers (FAQ #36) but not as Special Soldiers (FAQ #14), and they aren't Spearmen — so they can't Attack Genghis Khan (FAQ #37).</li>" : "") + "</ul>",
    src: (c) => {
      const s = ["Core p.9–10"];
      if (c.has("bp")) s.push("Black Powder p.4 · FAQ");
      if (c.mod("gk")) s.push("Stretch Goals p.3 · FAQ");
      return s.join(" · ");
    }
  },
  {
    title: "Defeating Hordes, Lethality & Saving",
    when: (c) => true,
    html: (c) => "<ul><li>A Horde is <b>Defeated</b> when every Vital spot holds a Soldier or Wound marker. Then: every player with a Soldier on it gets <b>2 Honor</b>; every Archer in that Section's Firing spots pays its owner <b>2 Honor</b>; the player covering the <b>most spots with Soldiers</b> (Wound markers don't count; Tea order breaks ties) <b>claims the card</b> face down — if nobody has a Soldier on it, it is discarded unclaimed; Hordes behind it move up.</li>" +
      "<li><b>Lethality</b> (printed by the Time token) tells each player how many of their Soldiers on that card are <b>Killed</b> — pay <b>2 Chi per Soldier</b> to <b>Save</b> one instead (Saved and surviving Soldiers go to the Rest Zone; Killed ones to your pool — FAQ #2). Removed Soldiers leave Wound markers behind.</li>" +
      (c.mode === "coop" ? "<li><b>Co-op:</b> you gain a claimed Horde card's printed Honor <b>immediately</b> when it is Defeated (FAQ #3); Shame tokens can't be placed on Horde cards.</li>"
        : "<li>Claimed Horde cards score their printed Honor at game end — unless a <b>Shame token</b> was parked on them.</li>") +
      (c.mod("gk") ? "<li><b>Genghis Khan:</b> whoever claims a Defeated Horde may send <b>1 surviving Soldier</b> from it (not a Bannerman) onto the Khan's Vital spots — from any Section — earning <b>6 Honor per spot</b>. Only Spearmen and Horsemen can Wound him (no Archers, no Wound markers); those Soldiers stay there forever. Cover every active spot on his card and both Skill cards (spots numbered above your player count are inactive) and he is Defeated" + (c.mode === "coop" ? " (in co-op this doesn't end the game — the win conditions are unchanged)" : " — finish the Year, then score") + ".</li>" : "") + "</ul>",
    src: (c) => (c.mode === "coop" ? "Core p.6, p.10, p.14" : "Core p.6, p.10") + (c.mod("gk") ? " · Stretch Goals p.3" : "") + " · FAQ"
  },
  {
    title: "Winter — Firing, Assault & Breach",
    when: () => true,
    html: (c) => "<ul><li><b>Firing:</b> left to right, every Archer" + (c.has("bp") ? " (and Bomber/Crossbowman)" : "") + " in a Firing spot Attacks a Horde in its Section, in Tea order (Rest Zone Archers don't Fire; you can't decline — FAQ #39). Then a Horde Defeat check.</li>" +
      "<li><b>Assault:</b> per Section, Defense (Wall value + 2 per Barricade) vs the sum of the Hordes' Offensive Power (mind their abilities" + (c.has("bp") ? " — errata: a first-row <b>Ladders</b> card automatically Breaches its Section, Killing every Soldier there, <b>even in the Rest Zone</b> (Saving allowed), and discarding its War Machines" : "") + "). Defense ≥ Power holds; otherwise the Wall is <b>Breached</b>.</li>" +
      "<li><b>Breach:</b> per Horde card there, everyone without a Soldier on it takes a <b>Shame token</b>; each card kills Lethality-many of each player's Soldiers on it (Save for 2 Chi each; survivors stay); all <b>Archers</b> on the Section are Killed; Rest Zones are safe" + (c.has("bp") ? " (Ladders excepted)" : "") + ".</li>" +
      "<li>All Barricades are discarded after the Assault" + (c.p <= 2 ? " — except those blocking the unused leftmost Section, which stay all game" : "") + ".</li>" +
      (c.has("bp") ? "<li><b>Wall destruction (Black Powder):</b> Battering Rams swap one row closer after each Assault and, while in the first row, destroy 1 Wall level after the Assault — including the Assault after which they arrive (FAQ #20); Rams in the first and second rows of one Section don't swap, and only 1 level is destroyed (FAQ #29); Trebuchets bombard from the third row each Year. Destroyed levels dump Firing-spot Soldiers into the Rest Zone. If <b>all</b> Wall levels are ever destroyed, everyone <b>loses immediately</b>.</li>" : "") +
      (c.has("bp") ? "<li><b>Towers:</b> put a Spearman in a Tower when you build a Wall level or claim a Defeated Horde next to it (you may evict a rival's — it returns to their pool). At the end of the Assault: <b>+2 Honor</b> per unbreached adjacent Section, a <b>Shame token</b> per breached one; a Breach clears adjacent Towers (Spearmen return to pools — FAQ #19). Placing a Tower Spearman also lets you <b>Shoot</b> an adjacent War Machine.</li>" : "") +
      (c.mod("gk") ? "<li><b>Genghis Khan Skills (Khan's Section only):</b> errata — <b>No retreat</b> reads “During each Assault phase all Soldiers on all Horde cards in this Wall Section are Killed.”</li>" : "") + "</ul>",
    src: (c) => (c.p <= 2 ? "Core p.10–12" : "Core p.10–11") + (c.has("bp") ? " · Black Powder p.3–4" : "") + (c.mod("gk") ? " · Stretch Goals p.3 · FAQ & errata" : " · FAQ")
  },
  {
    title: "Shame, Raids & the Tea Track",
    when: () => true,
    html: (c) => "<ul><li>A <b>Shame token</b> goes under one of your pool Soldiers (that Soldier is frozen; <b>−5 Honor</b> at game end) or onto a claimed Horde card's Shame slot (that card scores nothing, but costs nothing). Can't place it? Remove it and lose 5 Honor at once." + (c.mode === "standard" ? " Due a token but the pool is empty? Lose 5 Honor at once instead." : "") + " Buy them off in Summer for 2 Chi each." +
      (c.mode === "coop" ? " <b>Co-op:</b> Horde-card Shame slots are off-limits and Chi can't buy Shame off — instead lose <b>10 Honor</b> per token, when you receive it or in Summer." : "") + "</li>" +
      "<li><b>Raid:</b> a Horde card that can't fit on a full Section is discarded and <b>players-many</b> Shame tokens leave the pool (human players only — FAQ #4). When the pool empties, the game ends after the next Winter" + (c.mode === "coop" ? " — in co-op, an empty pool when someone must take a token is an <b>immediate loss</b>" : "") + (c.mode === "solo" ? " — in solo, an empty pool means <b>you lose</b>" : "") + ".</li>" +
      "<li>The <b>Tea track</b> orders everything: Command placement, other-player card effects, Location resolution, tie-breaks, and the final-scoring tiebreaker. The Tea House reshuffles it" + (c.mode === "coop" ? ". Co-op: players choose their own order except for claiming Hordes, which still uses Tea order" : "") + ".</li>" +
      "<li><b>Tactic cards</b> play from hand at the moment printed on them (one at a time; the seven timing windows are enumerated in FAQ #40); pay the Chi cost to use the <b>Boosted</b> lower half. Hand limit 5.</li></ul>",
    src: (c) => "Core p.6–7, p.9" + (c.mode === "coop" ? ", p.14" : "") + (c.mode === "solo" ? ", p.13" : "") + " · FAQ"
  },
  {
    title: "End of the Game & Scoring",
    when: () => true,
    html: (c) => c.mode === "coop" && c.mod("ac")
      ? "<ul><li><b>Ancient Chronicles co-op Scenario:</b> the Emperor's Requests aren't used. <b>Win</b> by surviving to the end of the last Year:<ul>" +
        "<li><b>Siege of Diaoyucheng:</b> the Fortress's Defense never drops below 1 — each Winter it falls by the Shame tokens beside the Scenario card, and Defense 0 is an immediate loss.</li>" +
        "<li><b>Red Turban Rebellion:</b> any Breach is an immediate loss. The game is 1 Year shorter (the Shame token on the Time track marks it).</li></ul></li>" +
        "<li><b>Lose</b> (both): a player must take a Shame token and the pool is empty" + (c.has("bp") ? ", or all Wall levels are destroyed (Black Powder)" : "") + ".</li>" +
        "<li>Each Winter a new co-op <b>Event</b> is revealed (end of Winter — FAQ errata); Event passives persist.</li></ul>"
      : c.mode === "coop"
      ? "<ul><li><b>Win:</b> fulfill the required Emperor's Requests — <b>6/7/9/9</b> for 2/3/4/5 players — checked each Winter. Requests are paid whole, at the Request-fulfillment step only, each player covering their own share; <b>Sacrificed</b> pieces leave the game.</li>" +
        "<li>Each Winter after the End Game check: everyone takes 1 Shame token per unfulfilled Request on the board, empty Request slots refill, and a new <b>Event</b> is revealed (end of Winter — FAQ errata); Event passives persist.</li>" +
        "<li><b>Lose:</b> a Shame token is due and the pool is empty (immediately), or the game ends at an End Game check with the Time token on the last slot and the Requests unfulfilled" + (c.has("bp") ? ", or all Wall levels are destroyed (Black Powder)" : "") + ". The wall-building end condition doesn't apply.</li></ul>"
      : "<ul><li><b>End Game check</b> (each Winter): the 3 Walls are built to maximum level — or just <b>2 Walls in a 3-player game</b> (at 2 players only 2 Sections exist at all) — or the Shame pool is empty, or the Time token reaches the last slot" + (c.mod("gk") ? ", or <b>Genghis Khan is Defeated</b> (finish the Year first)" : "") + (c.has("bp") ? ". All Wall levels destroyed = everyone loses (Black Powder)" : "") + ".</li>" +
        "<li><b>Final Honor:</b> current Honor − <b>5 per Shame token</b> under your Soldiers (never below 0 from this) + claimed Horde cards without Shame tokens + the 3 Artifacts' bonuses. Most Honor wins; Tea order breaks ties.</li>" +
        (c.mode === "solo" ? "<li><b>Solo:</b> beat Qin Jiushao's total. He scores 20 Honor per Artifact automatically. If the Shame pool empties, you lose outright.</li>" : "") + "</ul>",
    src: (c) => {
      const s = [c.mode === "coop" ? "Core p.14 · FAQ" : (c.mode === "solo" ? "Core p.11, p.13" : "Core p.11")];
      if (c.mode === "coop" && c.mod("ac")) s.push("Stretch Goals p.6–7");
      if (c.mod("gk") && c.mode !== "coop") s.push("Stretch Goals p.3");
      if (c.has("bp")) s.push("Black Powder p.4");
      return s.join(" · ");
    }
  },
  {
    title: "Black Powder — War Machines",
    when: (c) => c.has("bp"),
    html: () => "<ul><li>War Machines sit in Wall-Section Rest Zones (FAQ #26), max <b>2 per Section</b>. Build them at the Builders' Encampment (+4 Honor, and you may Shoot with it at once; Warehouse Resources spend first — FAQ #9); also Shoot one adjacent machine whenever you place a Tower Spearman.</li>" +
      "<li><b>Ballista</b> (4 Wood; free Shot): 2 Wounds per the <b>Ballista</b> Shot card (errata) on one Horde in its Section. <b>Cannon</b> (2 Stone + 2 Wood; 2 Stone per Shot): +1 Honor and Wounds per the Cannon Shot card. <b>Rocket Launcher</b> (4 Gold; 1 Resource of any type per Shot): +2 Honor, draw a Rocket card and deal all its Wounds (reshuffle the Rocket deck when empty — FAQ #33).</li>" +
      "<li>Machine Wounds on already-Wounded or missing spots are wasted; a Soldier on a hit spot is <b>Killed</b> (Save as usual) — hitting another player's Soldier costs the shooter <b>1 Shame token</b> per Shot (even if it's Saved, and however many are hit). Snake Clan tokens and Tanks are immune. A machine can't Shoot when its Section has no Horde card (FAQ).</li></ul>",
    src: () => "Black Powder p.3–4 · FAQ & errata"
  },
  {
    title: "Genghis Khan — Awards & the Khan",
    when: (c) => c.mod("gk"),
    html: () => "<ul><li>The Khan's miniature stands on the Section shown by the Horde deck's Invasion indicator, moving there each Spring. His two <b>Skill cards</b> punish only that Section (e.g. “Let them fear us!” makes Attacking the Khan cost 2 Chi — but not when you Attack him from another Section, FAQ #25); a Skill with all active spots covered switches off.</li>" +
      "<li><b>Errata — “No retreat” Skill:</b> during each Assault phase, all Soldiers on all Horde cards in the Khan's Wall Section are Killed.</li>" +
      "<li>His card and Skills count as <b>separate cards</b> — one Horseman can't straddle two of them (FAQ #24).</li>" +
      "<li><b>Emperor's Award:</b> whoever last built a Wall part holds the Award miniature and enjoys the effect of the game's single Award card (drawn at setup).</li>" +
      "<li>Co-op victory conditions are unchanged — the Khan is an extra threat, not the goal, there.</li></ul>",
    src: () => "Stretch Goals p.3 · FAQ & errata"
  },
  {
    title: "Ancient Beasts & Relics",
    when: (c) => c.has("ab"),
    html: () => "<ul><li>Four Beasts stand on the board with <b>passive powers</b>; each has 3 levels. At the start of their turn, the Active player may pay a Beast's printed Upgrade cost (errata: the second Ao card — orange head, green snake — costs 3 Chi) to <b>Upgrade</b> it one level — and may then move it to any area its card allows.</li>" +
      "<li>The revealed <b>Relic card</b> offers a second way to move Beasts (each Relic has its own rule; only one is active). At the end of Summer, after Reclaiming, a new Relic covers the old one.</li>" +
      "<li>FAQ rulings: Yinglong (final) — Donate <i>up to</i> once per Clerk there (#27); White Tiger (final) — Saving costs 1 Chi less in total, not per Soldier (#28); Ao (final) — only your own Resources, not the Warehouse's, count toward its Wall-building Honor (#32).</li></ul>",
    src: () => "Ancient Beasts p.2 · FAQ #27, #28, #32 & errata"
  },
  {
    title: "The Rat",
    when: (c) => c.mod("rat"),
    html: () => "<ul><li>When a Location holding the <b>Rat</b> Activates, every player with a Clerk there gets <b>1 Gold</b>.</li>" +
      "<li>Each Fall after the Horde Defeat check, whoever meets the active Rat card's condition (Tea order breaks ties) <b>must</b> move the Rat to a different Location — never the Warehouse (errata). Each Summer after Reclaiming, reveal a new Rat card (reshuffle the deck if it runs out — errata).</li>" +
      "<li><b>Errata — Zhaoyao Jing (Rat Artifact):</b> 3 Honor for each Soldier in <i>all</i> Wall Sections with the highest <i>built</i> Wall.</li></ul>",
    src: () => "Stretch Goals p.7 · FAQ errata"
  },
  {
    title: "Ancient Chronicles — the Six Scenarios",
    when: (c) => c.mod("ac"),
    html: () => "<ul><li><b>Freezing Weather:</b> the Production track modifies each Overseer's yield, both in the Summer Income step and whenever a Production Location Activates. Each player must send the Emperor 4 of each Resource (Gold, Stone, Wood, Chi): in Fall, after your Horde Defeat check, you may remove 4 of one type from your pool from the game at once and place a Clerk from your pool on that Resource's slot of the card (errata). At game end, before Final Honor Scoring, each of your Clerks there scores 12 Honor. In a Breach you may remove 1 of your Resources from play instead of taking Shame, and a Raid removes 2 of each Resource from the supply instead of Shame tokens (Shame only covers a shortfall).</li>" +
      "<li><b>Great Famine:</b> each player marks their own Food on the <b>Food track</b> with a Clerk, under a shared capacity marker (the Wound marker). Breaches and Raids give and remove <b>no Shame</b>: instead capacity drops 1 step per Breaching/Raiding Horde card. Every Winter after the Assault, each of your Soldiers, Overseers and Clerks on the board eats 1 Food, or goes back to your pool. Capacity at 5 or lower = immediate loss for everyone. At the <b>Market</b>, each Clerk lets you pay Gold equal to the current Lethality for +2 Food.</li>" +
      "<li><b>Emperor's Visit:</b> each Winter the Emperor demands the shown Resource — 10 Honor if you can show enough, a Shame token if not; Clerks sent to the Warehouse steer which Resource he'll demand next (most Clerks decides, must move the marker — errata).</li>" +
      "<li><b>Hungry Ghost Festival:</b> each Winter after the Assault, take 1 Shame token from the pool per Horde row holding at least 1 Horde card (max 3). Starting from the top of the Tea track, players place each one on a Location, which becomes <b>Haunted</b>. Its Clerks go back to their pools, and no Clerk may be Moved there. The Barracks and Tea House can't be Haunted. Each time you Defeat a Horde, you may discard 1 Haunting token from any Location. All of them are discarded at the start of the next Assault phase (errata). Discarded Haunting tokens go back to the Shame pool. Every Killed Soldier is removed from the game <b>permanently</b>.</li>" +
      "<li><b>Siege of Diaoyucheng (co-op only, no Emperor's Requests):</b> defend the Diaoyu Fortress. Each Raid adds 1 Shame token beside the Scenario card, on top of the normal Raid effects. Each Night (Winter, after the Assault), Defense drops 1 per token there, minus 1 per Archer in the Fortress. Those Archers then move to Rest Zones their owners choose. To fill the 3 Fortress Firing spots, pay 1 Wood per Archer: either a newly Recruited Archer from the Barracks, or, per Clerk in the Logistics Center, 1 Archer from any Wall or Rest Zone (FAQ #30). Fortress Archers Fire first, at a first-row Horde in any Section, but never through Advisors or Attack Order. At the Builders' Encampment, each of your Clerks may instead pay 3 non-Chi Resources, your own only, for +1 Defense. Each Clerk takes either this action or its normal one (FAQ #31, #34). Defense 0 = instant loss.</li>" +
      "<li><b>Red Turban Rebellion (co-op only, no Emperor's Requests):</b> survive a game 1 Year shorter where <b>any Breach loses instantly</b>. Gold Overseers can't be Upgraded. Each Spring choose Peace or War. Peace: together pay 3 Gold per Horde card removed from the Invasion, minimum 3 Gold, never below 1 Horde. War: free, and each player Hires 1 Clerk from the Emperor's Embassy. Whenever a Production Location Activates, whoever has the most Clerks there (Tea breaks ties) sends one to the Embassy. Each Raid also sends 1 Clerk from each player's pool to the Embassy. In the Summer Income step you may lose 20 Honor to Hire a Clerk from the Embassy.</li>" +
      "<li>Scenarios add their own Artifacts/Tactics/Generals/Advisors and <b>cannot be combined</b> with the other expansions.</li></ul>",
    src: () => "Stretch Goals p.4–7 · FAQ & errata"
  },
  {
    title: "The Reed Clan — 2 Players & Solo",
    when: (c) => c.p === 2 || c.mode === "solo",
    html: (c) => "<ul><li>The Reed Clan is an automated third Clan: no Honor, Shame or Resources; it never Saves Soldiers, always discards claimed Hordes, and its Spearmen never rest (they return to its pool).</li>" +
      "<li>It keeps exactly <b>3 Clerks</b> on the board, max 1 per Location, and they <b>stay</b> in place after Activations. Its Clerks are Moved in Tea order by the current <b>Overlord</b> — the Active player (or the top Tea player when the Reed Clan itself is active).</li>" +
      "<li>It plays its single Command card every Fall, slotting first whenever it out-ranks the humans on the Tea track.</li>" +
      "<li>On Activation its Clerk: Donates its Resource (Mill/Quarry/Mine) · lets the <b>Active player</b> discard one of their own Shame tokens (Temple; no effect if the Reed Clan is the Active player) · discards an Advisor from the track (Embassy) · builds a free Barricade (Encampment) · Recruits a Spearman that the Overlord Attacks with (Barracks) · nothing (Academy/Logistics) · normal (Tea House). A lone Reed Clerk on a Special Location doesn't Activate it.</li>" +
      "<li>Your <b>Betrayal</b> card can't copy the Reed Clan's Command card (FAQ #35). It never counts as a player for Raids (FAQ #4)" + (c.mode === "coop" ? ", nor for the number of Emperor's Requests or for Requests that make every player discard Resources or Sacrifice units (FAQ #38)" : "") + ".</li></ul>",
    src: (c) => "Core p.11–12 · FAQ #4, #35" + (c.mode === "coop" ? ", #38" : "")
  },
  {
    title: "Solo — Qin Jiushao",
    when: (c) => c.mode === "solo",
    html: () => "<ul><li>Each Fall Qin Jiushao plays the top card of his own 6-card <b>Solo Command deck</b> (his cards have different effects — you still benefit from any track bonuses they grant) and always takes the first free Command slot.</li>" +
      "<li>His <b>Location track</b> drives him: he always chases the lowest (rightmost) Resource (the Wound marker = the Barracks). On his own turn he Moves Clerks as his Command card says; whenever Clerks are Moved during your or the Reed Clan's turn, he Moves <b>2</b> Clerks, one to each Location of the <b>2 lowest</b> tokens. If a Location is full, the Clerk goes to the next Location in track order; if all his Clerks are already on the board, he takes one from his highest Location. He only ever uses Production Locations and the Barracks.</li>" +
      "<li>On his turn, Locations holding his Clerks Activate <b>first</b>, in Location-track order from <b>Highest to Lowest</b> (errata to Core p.13); you choose the order of the rest. If more than one Location is viable for a single Activation (e.g. his Despotism card), he Activates the Lowest. He picks his Clerks up after an Activation, as a player does (FAQ #7). Whenever a Location holding his Clerks Activates, its token jumps to the top of the track and the other tokens slide one space right.</li>" +
      "<li>He never takes Shame, never uses Active Advisors, never Saves or rests Soldiers, and spends no Resources of his own (Warehouse only — though when his Work Harder card builds a Wall, any shortfall after emptying the Warehouse is assumed paid, FAQ #15). He gains Honor like a normal player from every other source, but gets <b>nothing</b> in the Overseer Income step (FAQ #6) and never Donates. Production Activations pay him <b>Honor = Overseer level × his Clerks</b>. The Barracks Recruit him <b>1 free Spearman per Clerk</b> there. Each one Attacks in the Section the Invasion indicator points to; if it can't, it tries the other Section, and if it can't Attack there either it isn't Recruited. His Archers go to a Firing spot in the indicated Section, or aren't Recruited. He always Wounds the Horde card closest to the Wall, filling Vital spots top-to-bottom, then left-to-right, and every Wound he deals is worth <b>2 Honor</b> flat. When he builds a Wall, it goes on the indicated Section (the other one if that Section is fully built), paid from the Warehouse, and he gains the Honor.</li>" +
      "<li>In Spring one of the two discarded Advisors slides under his card as a Supporting Advisor. As Overlord he runs the Reed Clan with his own logic but gains nothing from it. Your <b>Betrayal</b> card may copy his Command card (resolved as your same-named card — FAQ #35).</li>" +
      "<li>He scores 20 Honor per Artifact at game end. Beat his Honor total to win; an empty Shame pool is your loss.</li></ul>",
    src: () => "Core p.12–13 · FAQ & errata"
  },
  {
    title: "Key Rulings — FAQ & Errata",
    when: () => true,
    html: (c) => "<ul><li>Card effects are <b>optional</b> unless stated; “when you X ⟶” triggers mean “at least one X”, once per event; unowned components in card text mean <b>yours</b>.</li>" +
      "<li>Tactic cards play at their printed windows, often outside your own turn (FAQ #1, #40 lists all seven timings).</li>" +
      "<li>Attack Order commits <b>all</b> your Soldiers in the Rest Zones you attack from (FAQ #11); Firing is mandatory when instructed (FAQ #39).</li>" +
      "<li>When a Horde is Defeated, Saved Soldiers <b>and</b> survivors (those beyond the Lethality count) go to the Rest Zone; only Killed Soldiers return to your pool (FAQ #2).</li>" +
      "<li>Every Horde card's Vital grid is 2×6 (FAQ #23). Raids count human players only (FAQ #4).</li>" +
      "<li>One Overseer Upgrade per Location Activation (FAQ #8); the Boosted “Restless” Tactic upgrades two <b>different</b> Overseers (FAQ #21).</li>" +
      "<li><b>Errata highlights:</b> the co-op Event step happens at the end of <b>Winter</b>; the Betrayal card's alternate effect Moves up to 2 of your Clerks to 1–2 Locations; Shame tokens freeze Soldiers in your <b>pool</b>; “highest Wall” effects mean your highest built level across your Walls (FAQ #18).</li>" +
      "<li>“<b>+1</b>” on the Time token only marks the extra Horde card at setup and each Spring — not Lethality (FAQ #16).</li></ul>",
    src: () => "FAQ & Errata"
  }
];

/* =============================================================================
   TEACHING SCRIPT
   ============================================================================= */
GW.teach = {
  intro: "A ~5-minute teach for the exact sets and mode selected above. Read it aloud, or hit Copy and tweak. Rules content is drawn from the rulebooks and FAQ cited in the setup steps.",
  sections: [
    {
      h: "The hook — and how you win",
      body: (c) => c.mode === "coop" && c.mod("ac")
        ? "<p>The Mongol Horde is at the Great Wall and, for once, we're on the same side. Tonight's <b>Scenario</b> replaces the Emperor's Requests: we win by <b>surviving to the end of the last Year</b>, and its card tells us exactly what we must never let happen. If anyone must take a Shame token when the pool is empty, we all lose on the spot. Each Winter ends with a new <b>Event</b> card — any one-time effect on it resolves at once, and its passive effect stays for the rest of the game.</p>"
        : c.mode === "coop"
        ? "<p>The Mongol Horde is at the Great Wall and, for once, we're on the same side. The Emperor sends <b>Requests</b> — costly demands, " + (c.p === 2 ? "two at a time (the third Artifact slot sits empty with two players)," : "one per Artifact slot,") + " that can only be paid at the end of each Year; when a Request asks all of us to pay, each of us must meet it <b>in full on our own</b> — nobody can chip in Resources or Soldiers for a partner. Fulfill <b>" + ({2:"six",3:"seven",4:"nine",5:"nine"}[c.p] || "the required number of") + "</b> of them and we win. But every unfulfilled Request breeds <b>Shame</b> each year, and if anyone must take a Shame token when the pool is empty — we all lose on the spot. Time is against us too, and each Winter ends with a new <b>Event</b> card — any one-time effect on it resolves at once, and its passive effect stays for the rest of the game.</p>"
        : c.mode === "solo"
        ? "<p>You are a Song general holding the Great Wall — against the Horde in front and the flawless bureaucrat <b>Qin Jiushao</b> beside you. He earns Honor with machine-like efficiency and pays for nothing; you must finish with <b>more Honor</b> than him. But watch the Shame pool: it holds only <b>10</b> tokens in solo, and if it ever runs dry the game ends and <b>you lose</b>. The wretched <b>Reed Clan</b> shuffles between you both — and only you can profit from commanding it; Qin never does.</p>"
        : "<p>We are rival generals of the Song dynasty, sharing one Great Wall against the Mongol Horde — cooperating just enough to survive, competing for <b>Honor</b>. Honor comes from slaying Hordes, building the Wall, donations, and clever cards; <b>Shame</b> (−5 each) comes from letting the Wall fall while your soldiers sat at home. When the Walls are finished, the years run out, or the Empire's shame is complete, the most honorable general wins" + (c.mod("gk") ? " — or end it early by bringing down <b>Genghis Khan himself</b>" : "") + ".</p>"
    },
    {
      h: "The shape of a Year",
      body: (c) => "<p>Each Year has four seasons. <b>Spring:</b> new Horde cards mass in front of the Wall. <b>Summer:</b> your Overseers pay income, " +
        (c.mode === "coop" ? "and you may shed Shame at 10 Honor a token (in co-op there's no buying it off with Chi, and there's no Summer reclaim: each time you build a Wall part, you may take back just 1 spent Command card)." : "you may launder Shame with Chi, and you choose — take back your spent Command cards, or milk them for Honor.") + " <b>Fall</b> is the real game: everyone secretly picks one <b>Command card</b>, we reveal together, order them on the track, and take turns — your card moves your <b>Clerks</b>, every full Location on the board fires for everyone with workers there, and wounded Hordes fall. <b>Winter:</b> the archers loose their volleys, and then the Horde <b>assaults</b>. (Year one skips straight to Fall" + (c.p === 5 ? "; with five of us the Time token starts on its 2nd slot, so the game lasts at most four Years" : "") + ".)</p>"
    },
    {
      h: "Clerks — the economy",
      body: (c) => "<p>Clerks are your bureaucrats. Command cards push them into <b>Locations</b>: the four Production sites (wood, stone, gold and <b>Chi</b> — your magic-slash-morale currency), the <b>Barracks</b> to recruit, the <b>Builders' Encampment</b> for walls and barricades, the <b>Embassy</b> for more Clerks and Advisors, the <b>Tea House</b> to jump the initiative queue, and more. The trick: most Locations only fire when <b>completely full</b> — often thanks to <i>other people's</i> Clerks — and everyone with workers there profits. It's a worker-placement game where you constantly complete your rivals' plans, and they yours.</p>" +
        "<p>Park an <b>Overseer</b> at a Production site for passive income, <b>Donate</b> to the Warehouse for Honor (it makes Wall-building cheaper for everyone), and mind the <b>Tea track</b> — it breaks every tie in the game. One warning: if your Clerks are the only color in a Location marked with the <b>Shame icon</b> when it Activates, you take a Shame token. Bring company (any second Clerk color there cancels it), or fire it with an Advanced Activation when a card lets you.</p>"
    },
    {
      h: "Soldiers and the Horde",
      body: (c) => "<p>Each Horde card is a grid of <b>Vital spots</b>. Cover them all and it dies. <b>Spearmen</b> pin the front card, <b>Horsemen</b> leap onto any card covering two spots, <b>Archers</b> shoot from Wall slots leaving anonymous wound markers" + (c.has("bp") ? ", and your Clan's <b>Special Soldier</b> bends those rules its own way" : "") + ". Covering spots with bodies pays rewards and decides who <b>claims</b> the kill — but when the beast falls, <b>Lethality</b> kills soldiers on it unless you Save them with Chi. Glory is rented, not owned.</p>"
    },
    {
      h: "Winter — the assault",
      body: (c) => "<p>Whatever survives your archers <b>assaults the Wall</b>: each Section adds its Wall's Defense value and +2 per Barricade against the Hordes' total power. Hold, and nothing happens. Fail, and the <b>Breach</b> hands a <b>Shame token</b> to everyone who didn't have a soldier on each attacking card — that's the game's central bargain: defense is a public good, and shirkers are named. " +
        (c.mode === "coop" ? "Shame freezes a soldier in your pool; in co-op you can't bury it on a Horde card — shed it by giving up 10 Honor instead.</p>" : "Shame freezes a soldier in your pool and costs 5 Honor at the end; you can bury it on a claimed Horde card instead, throwing away that trophy's points.</p>") + (c.has("bp") ? "<p>And in Black Powder the Horde brings <b>siege engines</b>: rams and trebuchets that demolish Wall levels, and Ladders that breach automatically. If the whole Wall ever falls, everyone loses. Answer with your own <b>War Machines</b> — ballistae, cannons and rocket launchers.</p>" : "") },
    { when: (c) => c.has("bp"),
      h: "Black Powder",
      body: () => "<p>No barricades to start — instead every Section begins with a level-1 Wall, and four <b>Towers</b> stand between them. A Spearman in a Tower earns 2 Honor per neighboring Section that holds each Winter (and shame for each that falls) — and posting one lets you <b>fire an adjacent War Machine</b>. You can also <b>build War Machines</b> at the Builders' Encampment — Ballista 4 Wood, Cannon 2 Stone + 2 Wood, Rocket Launcher 4 Gold, at most two per Section — for 4 Honor and an immediate Shot. Your Clan also gets a unique <b>Special Soldier</b>, from the Turtle Clan's four-spot Tank to the Snake Clan's shame-proof Crossbowmen. Everyone starts with three level-1 Overseers, so the engines run hot from turn one.</p>" },
    { when: (c) => c.mod("gk"),
      h: "Genghis Khan",
      body: (c) => "<p>The Khan himself rides the front" + (c.mode === "coop" ? " — our win conditions don't change, but his Skills make every Year harder" : ", and killing him is now the game's crowning move") + ". Only <b>flesh wounds count</b> — Spearmen and Horsemen, no arrows — and the only way in is <b>momentum</b>: each time you claim a defeated Horde, one surviving soldier may charge from it onto the Khan's card or one of his two <b>Skill cards</b>, 6 Honor a spot. Those Skill cards curse whichever Section he's haunting, until every one of their active spots is covered and they go quiet for good." + (c.mode === "coop" ? "" : " Cover every spot and he falls; we finish the Year, then count Honor.") + " Each of us also gets a <b>Bannerman</b> (2 Gold + 1 Wood to recruit): it fights like a Spearman but can't charge the Khan, and if it's on a Wall Section when Winter begins you may Attack with 2 Soldiers there before the archers fire. Meanwhile the <b>Emperor's Award</b> follows whoever built the Wall last — one more reason to lay bricks.</p>" },
    { when: (c) => c.has("ab"),
      h: "Ancient Beasts",
      body: () => "<p>Four legendary <b>Beasts</b> roam the board, each granting a passive power described on its card. At the start of your turn you can pay to <b>upgrade</b> one — making it stronger for everyone — and then drag it somewhere that suits <i>you</i>. The revealed <b>Relic</b> offers a second lever for moving them. Fight over where the Beasts stand; it matters more than it sounds.</p>" },
    { when: (c) => c.mod("rat"),
      h: "The Rat",
      body: () => "<p>A lucky <b>Rat</b> squats in one Location and pays 1 Gold to everyone working there when it fires. Each Fall, whoever meets the Rat card's condition must shoo it somewhere new. Cheap, cheerful, and worth chasing.</p>" },
    { when: (c) => c.mod("ac"),
      h: "Ancient Chronicles",
      body: (c) => "<p>Tonight is a <b>Scenario</b>: a card that rewrites the rules — " + (c.mode === "coop" ? "a fortress under night-siege, or a rebellion holding out for reinforcements" : "a freezing year of failed harvests, a famine with a shrinking larder, an imperial inspection, or haunted workhouses") + ". We'll read its card before we start; expect new rules, and in some Scenarios a new way for all of us to lose. Scenarios play pure — no other expansion content joins them." + (c.mode === "coop" ? " If it's Siege of Diaoyucheng or Red Turban Rebellion, forget the Emperor's Requests — we win simply by surviving to the end." : "") + "</p>" },
    { when: (c) => c.p === 2 && c.mode !== "solo",
      h: "Two players — the Reed Clan",
      body: () => "<p>A third, automated <b>Reed Clan</b> wedges its three clerks into the Locations between us. Whoever is the active player becomes its <b>Overlord</b>, steering those clerks — usually to complete Locations at just the right moment, sometimes to jam yours. It never scores; it only tilts the table.</p>" },
    { when: (c) => c.mode === "solo",
      h: "Your rival — Qin Jiushao",
      body: () => "<p>Qin runs on rails: his own Command deck, a track that tells him which Resource he craves, free recruits, and 2 Honor for every wound he lands. He can't be starved — he pays for nothing — so beat him on <b>tempo</b>: claim the Hordes he softens, keep the Tea track, and remember your <b>Betrayal</b> card can copy his order of the turn.</p>" },
    {
      h: "Don't worry about these until they come up",
      body: (c) => {
        const items = [];
        items.push("<li><b>Individual Horde abilities</b> — read each card as it arrives; they're the spice.</li>");
        items.push("<li><b>Tactic card timing windows</b> — each card says when; I'll referee the first few.</li>");
        items.push("<li><b>Advanced Activation</b> — some cards fire half-empty Locations; it'll say so.</li>");
        items.push("<li><b>Exact Embassy pricing</b> — Advisors cost as many Gold as you'll then own.</li>");
        if (c.has("bp")) items.push("<li><b>War Machine Shot cards</b> — each machine's card shows where its wounds land (Rockets draw a random one); wounds on already-wounded or missing spots are wasted, and a wound on a Soldier Kills it (it can be Saved). Hit another player's Soldier and you take 1 Shame token for that Shot, even if they Save it. Tanks and Snake Clan tokens are immune.</li>");
        if (c.mod("gk")) items.push("<li><b>The Khan's numbered spots</b> — some only activate at higher player counts.</li>");
        if (c.mode === "coop" && !c.mod("ac")) items.push("<li><b>Request wording</b> — payments are all-at-once, at the year-end step only.</li>");
        items.push("<li><b>End-game timing</b> — conditions are only checked at the end of Winter" + ((c.mode === "coop" || c.has("bp") || c.mod("ac")) ? " (the instant losses aside)" : "") + ".</li>");
        return "<ul>" + items.join("") + "</ul>";
      }
    }
  ]
};
