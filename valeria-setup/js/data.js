/* =============================================================================
   Valeria: Card Kingdoms — Setup & Reference Utility
   Data model: base game (2nd Edition), the four big expansions, the
   mini-expansion packs, three ways to play, and a filtered setup sequence.

   Sources: the 2nd Edition rulebook (2021), the Flames & Frost and
   Shadowvale rulesheets, the Crimson Seas rulebook, the Darksworn rulebook,
   and the Combined Expansions Setup Guide v5 for the mini-packs.
   ============================================================================= */

const VC = {};

/* ---- Sets ------------------------------------------------------------------ */
VC.expansions = [
  { id: "base", name: "Valeria: Card Kingdoms (2nd Edition)", short: "Base Game", year: 2021, kind: "base",
    blurb: "The dice-driven tableau builder: roll, harvest with your Citizens, then slay Monsters, recruit Citizens and build Domains to out-score your rival Dukes. 1–5 players." },
  { id: "ff", name: "Flames & Frost", short: "Flames & Frost", year: 2016, kind: "exp",
    blurb: "The Demon of Loth awakens monsters of fire and ice: five new Monster Areas (Desert, Glacier, Oasis, Tundra, Volcano), new Citizens, Domains, Dukes — and Event cards hidden in the Exhausted stack." },
  { id: "cs", name: "Crimson Seas", short: "Crimson Seas", year: 2019, kind: "exp",
    blurb: "The Island board: Sail with Maps to buy Goods in Araby and Tomes in Nae Aerie, raid Exekratys, rescue Nobles from Amarynth. Adds the Coxswain starter, Wardens, Monster Events and five sea Monster Areas." },
  { id: "sv", name: "Shadowvale", short: "Shadowvale", year: 2021, kind: "exp",
    blurb: "Werewolves and vampires in the night: five new Monster Areas (Sewer, Necropolis, Woods, Den, Crypt), monster-hunting Citizens, more Events, and Wardens built in." },
  { id: "ds", name: "Darksworn", short: "Darksworn", year: 2021, kind: "exp",
    blurb: "A fully cooperative, story-driven saga played through Books: defend the walls, pray to Aquila for Blessings, complete Tasks, and survive the Shades. A different game mode entirely." },
  { id: "minis", name: "Mini-expansions & promos", short: "Mini-Expansions", year: 0, kind: "exp",
    blurb: "The small packs: King's Guard, Undead Samurai, Agents, Peasants & Knights, Wardens, Relics, Ward Towers, Shade Events, Fire Temple, Kaharian, Gnoll Pack, Margrave Park, promo Dukes and Domains. Toggle the ones you own below." }
];

VC.expMeta = {
  base:  { name: "Base Game",      cls: "e-base" },
  ff:    { name: "Flames & Frost", cls: "e-ff"   },
  cs:    { name: "Crimson Seas",   cls: "e-cs"   },
  sv:    { name: "Shadowvale",     cls: "e-sv"   },
  ds:    { name: "Darksworn",      cls: "e-ds"   },
  minis: { name: "Mini-Expansion", cls: "e-mini" },
  combo: { name: "Combined Guide", cls: "e-combo"},
  mode:  { name: "Game Mode",      cls: "e-mode" }
};

/* ---- Ways to play ------------------------------------------------------------ */
VC.modes = [
  { id: "standard", name: "Competitive", requires: null,
    blurb: "The classic race for the throne — most Victory Points wins. 2–5 players (5 needs the 5-player cards).",
    src: "Base Rulebook p.2–7" },
  { id: "solo", name: "Solo vs the Dark Lord", requires: null,
    blurb: "One player against a traitorous virtual Duke. Monster stacks strike back based on your dice.",
    src: "Base Rulebook p.14–15" },
  { id: "darksworn", name: "Darksworn Co-op Saga", requires: "ds",
    blurb: "Fully cooperative and story-driven: play through the Books of the Darksworn Saga (or the Dungeon Delve), defending Valeria's walls together.",
    src: "Darksworn Rulebook p.2–13" }
];

/* ---- Modules & variants -------------------------------------------------------
   requires: expansion id. modes: which play modes it applies to (null = all). */
VC.modules = [
  { id: "monsterevents", name: "Monster Event cards", requires: "base", modes: ["standard"],
    summary: "Shuffle 1 Monster Event per player into the Exhausted stack — dice-triggered mayhem that becomes slayable.",
    description: "Setup: take 2 Exhausted cards per player, then shuffle 1 facedown Monster Event card per player on top of that stack (you may pre-select favorites). Cardboard resource tokens go by the Center Stacks. Rolled Activation Numbers trigger the event at the end of the Roll Phase (never twice on doubles). Revealed events sit faceup in the exhausted slot and can be slain — replace a slain event with an Exhausted card from the BOTTOM of the stack. The slot still counts as exhausted for end-game checks; slain events score like Monsters.",
    src: "Base Rulebook p.12 (also Crimson Seas p.10–12)" },
  { id: "events", name: "Event cards (Flames & Frost / Shadowvale)", requires: "ff", modes: ["standard"],
    summary: "Shuffle 1 Event per player into the Exhausted stack; resolve when revealed.",
    description: "Shadowvale wording: take 1 Exhausted card per player and 1 facedown Event card per player, shuffle them together into the Exhausted stack (you may pre-select events). When an Event is revealed, place it in the open slot and follow its text before the next action or phase — actions it grants are free. Multiple affected players resolve in turn order from the active player. The slot counts as exhausted for the end-game trigger.",
    src: "Shadowvale rules p.1–2 · Flames & Frost rulesheet" },
  { id: "mixed", name: "Mixed Citizens variant", requires: "base", modes: ["standard"],
    summary: "Each Citizen stack is a shuffled mix of both types for that number — facedown surprises.",
    description: "For each Activation Number, shuffle all Citizen types with that number together and deal 4 facedown + 1 faceup (5 facedown + 1 faceup with 5 players). Facedown Citizens stay secret until the card above them is taken.",
    src: "Base Rulebook p.13" },
  { id: "noduke", name: "No Duke variant", requires: "base", modes: ["standard"],
    summary: "Skip secret Dukes; everyone scores a fixed rubric plus majority bonuses.",
    description: "Deal no Duke cards. At game end, everyone additionally scores: 1 VP per Worker and Soldier icon, 2 VP per Shadow and Holy icon (on Citizens and Domains), 1 VP per 3 leftover Resources, and 7 VP each for the most Citizens, most Monsters and most Domains (ties: 3 VP each).",
    src: "Base Rulebook p.13" },
  { id: "wardens", name: "Wardens (Monster Reinforcements)", requires: "minis", modes: ["standard", "solo"],
    summary: "One extra Monster slots in above each Boss — placed regardless of Strength.",
    description: "Each Warden belongs to the Monster Area on its card. During setup place the Warden directly above the Boss (below all other Monsters), ignoring its Strength value. The mini-pack covers base + Flames & Frost areas; later sets (Crimson Seas, Shadowvale) include their own Wardens automatically.",
    src: "Crimson Seas p.5 · Shadowvale rules · Combined Guide" },
  { id: "agents", name: "Agents", requires: "minis", modes: ["standard"],
    summary: "A row of hireable Agents above the Monster stacks; using one is an action.",
    description: "Setup: shuffle the Agent deck above the left-most Monster stack and reveal 4 Agents, one above each other Monster stack. As an action, use a faceup Agent's ability, then return it to the bottom of the deck and refill the row.",
    src: "Combined Guide (Agents, Exp. #3)" },
  { id: "kingsguard", name: "King's Guard", requires: "minis", modes: ["standard"],
    summary: "An Event that opens a recruitable King's Guard stack.",
    description: "Replace one Exhausted card with the King's Guard Event (or shuffle it in with the Events variant). When revealed, place the King's Guard Citizen stack on top of it — players may now Recruit a King's Guard normally. The stack counts as exhausted for end-game checks.",
    src: "Combined Guide (King's Guard, Exp. #1)" },
  { id: "samurai", name: "Undead Samurai", requires: "minis", modes: ["standard"],
    summary: "Play it as a Monster stack — or as an ambush Event that floods the stacks.",
    description: "Either use it as a normal Monster stack (normal rules, no Warden exists for it in the pack), or as an Event: when its Event card is drawn, remove it and shuffle the Undead Samurai Lord into the Exhausted stack. When the Lord is later drawn, each player in turn order places an Undead Samurai Monster on an unexhausted center stack. Slaying the Lord removes all remaining Samurai from the game. Don't use the Event if it's already a stack.",
    src: "Combined Guide (Undead Samurai, Exp. #2)" },
  { id: "relics", name: "Relics", requires: "minis", modes: ["standard"],
    summary: "Deal 2 Relics to each player at setup; keep 1 faceup.",
    description: "During setup deal two Relic cards to each player; each keeps one faceup and discards the other from the game. Relics are either ongoing (“When you…”) or action-triggered (“As an action…”).",
    src: "Combined Guide (Relics, Exp. #6)" },
  { id: "wardtowers", name: "Ward Towers", requires: "minis", modes: ["standard"],
    summary: "The 5th Domain stack becomes the Towers — banner-building for shared slay discounts.",
    description: "Create only 4 normal Domain stacks (3 cards each) and place the Ward Towers faceup as the 5th; give each player 6 matching Banner tokens. As a Build a Domain action with 4 matching Role icons, pay 9 of the exact resource shown (Magic may NOT augment) to place a Banner. When a Tower's 3 slots fill, banners return flipped to their 5-VP side and the Tower's ongoing slay discount activates for everyone. The stack exhausts when the last Tower is built. Tomes may help pay.",
    src: "Combined Guide (Ward Towers, Exp. #7)" },
  { id: "morestacks", name: "Extra Monster stacks (Fire Temple · Kaharian · Gnoll Pack)", requires: "minis", modes: ["standard", "solo"],
    summary: "Three more Monster Areas to mix and match.",
    description: "Fire Temple (Exp. #13) and Kaharian (Exp. #12) are used as normal Monster stacks; the Gnoll Pack (Knoll region) likewise. Build them like any other Area stack.",
    src: "Combined Guide" },
  { id: "margrave", name: "Margrave Park starter", requires: "minis", modes: ["standard"],
    summary: "An alternate 3rd starter card in place of the Herald.",
    description: "Give each player a Margrave starter instead of the Herald. Its bonus triggers on doubles or when none of your Citizens activated. NOT compatible with Crimson Seas (the Coxswain takes that slot).",
    src: "Combined Guide (Margrave Park)" },
  { id: "promos", name: "Promo Dukes & Domains", requires: "minis", modes: ["standard"],
    summary: "Duke Mico, the Man vs Meeple Dukes, The Tower, and the Promo Pack Domains.",
    description: "Shuffle promo Duke cards in before dealing two Dukes each. The Tower and the Promo Pack Domains (Coliseum, Jousting Field, Ullamalizatli) shuffle in with the other Domains before building the stacks.",
    src: "Combined Guide" }
];

/* ---- helpers ------------------------------------------------------------------ */
VC.help = {
  usesEvents: (c) => c.mod("events") || c.mod("kingsguard") || (c.mod("samurai")),
  starter3: (c) => c.has("cs") ? "Coxswain" : (c.mod("margrave") ? "Margrave" : "Herald")
};

/* ---- THE SETUP SEQUENCE -------------------------------------------------------- */
VC.phases = [
  /* ================= STANDARD & SOLO ================= */
  { title: "Build the Center Stacks",
    steps: [
      { exp: "base",
        t: "Choose and build the five Monster stacks",
        d: (c) => {
          const bits = ["Pick <b>5 Monster Areas</b> from any set you own and stack each with the <b>lowest Strength on top</b> and the <b>Boss on the bottom</b>. Arrange the five stacks in the top row from lowest Strength (left) to highest (right)."];
          const areas = ["Hills, Ruins, Forest, Swamp, Caverns, Barrens, Valley and Mountains (base)"];
          if (c.has("ff")) areas.push("Desert, Glacier, Oasis, Tundra and Volcano (Flames & Frost)");
          if (c.has("cs")) areas.push("The Deep, Skerry, Dark Waters, Cutthroats and Gloom Gyre (Crimson Seas)");
          if (c.has("sv")) areas.push("Sewer, Necropolis, Woods, Den and Crypt (Shadowvale)");
          if (c.mod("morestacks")) areas.push("Fire Temple, Kaharian and the Gnoll Pack (mini-packs)");
          bits.push("Areas available: " + areas.join("; ") + ".");
          bits.push(c.p === 5 ? "With <b>5 players</b>, each stack holds <b>6 cards</b> — include the cards marked with the 5-player icon." : "Remove the cards marked with the <b>5-player icon</b> — each stack holds 5 cards.");
          if (c.has("cs") || c.has("sv") || c.mod("wardens")) bits.push("<b>Wardens:</b> place each stack's Warden directly <b>above the Boss</b> (below everything else), regardless of its Strength value.");
          bits.push("First game? The rulebook recommends Hills, Ruins, Forest, Valley and Mountains.");
          return bits.join("<br>");
        },
        src: (c) => "Base Rulebook p.2" + ((c.has("cs") || c.has("sv") || c.mod("wardens")) ? " · Crimson Seas p.5" : ""),
        when: (c) => c.mode !== "darksworn" },
      { exp: "base",
        t: "Build the ten Citizen stacks",
        d: (c) => {
          let d = "Row two: Citizen stacks with Activation Numbers <b>1, 2, 3, 4, 5</b>. Row three: <b>6, 7, 8, 9/10, 11/12</b>. Each stack is <b>" + (c.p === 5 ? "six" : "five") + " copies of the same Citizen</b> — pick one Citizen type per number from any set. Return the rest to the box.";
          if (c.mod("mixed")) d += "<br><b>Mixed Citizens variant:</b> instead, shuffle all Citizen types sharing an Activation Number together and deal " + (c.p === 5 ? "5" : "4") + " facedown + 1 faceup per stack. Facedown cards stay hidden until the card above them is taken.";
          d += "<br>First game? The rulebook recommends Cleric, Merchant, Mercenary, Archer, Peasant / Knight, Rogue, Champion, Paladin, Butcher.";
          if (c.has("cs")) d += "<br>Note: the Hydromancer (1), Engineer (2) and Smuggler (7) reference Crimson Seas components — best used only when the Island board is on the table.";
          return d;
        },
        src: (c) => "Base Rulebook p.2, p.13" + (c.has("cs") ? " · Combined Guide" : ""),
        when: (c) => c.mode !== "darksworn" },
      { exp: "base",
        t: "Build the five Domain stacks",
        d: (c) => {
          let d = "Shuffle all Domains" + (c.mod("promos") ? " (promo Domains — The Tower, Coliseum, Jousting Field, Ullamalizatli — shuffled in)" : "") + " and build <b>five stacks</b> in the bottom row: deal <b>" + (c.p === 5 ? "three" : "two") + " facedown</b> then <b>one faceup</b> on each. Return unused Domains to the box.";
          if (c.mod("wardtowers")) d = d.replace("five stacks", "FOUR stacks") + "<br><b>Ward Towers:</b> the Ward Towers go faceup as the 5th stack, and each player takes 6 matching Banner tokens.";
          if (!c.has("cs")) d += "<br><b>Not using Crimson Seas?</b> Leave out the Domains tied to it: Barbarossa Castle, Brigand's Bay, Browncoat's Sanctum, Daak Harbour, Dampiar's Workshop, Murat Reis, Port of Drake, Solo's Haven and Tabula Tower.";
          return d;
        },
        src: (c) => "Base Rulebook p.2, p.13" + (!c.has("cs") || c.mod("wardtowers") ? " · Combined Guide" : ""),
        when: (c) => c.mode !== "darksworn" },
      { exp: (c) => c.mod("monsterevents") || VC.help.usesEvents(c) ? (c.mod("events") ? "sv" : "base") : "base",
        t: "Prepare the Exhausted stack",
        d: (c) => {
          const bits = [];
          if (!c.mod("monsterevents") && !VC.help.usesEvents(c)) {
            bits.push("Take <b>2 Exhausted cards per player</b> and stack them above the Monster row. Return the rest to the box.");
          } else {
            bits.push("Take <b>2 Exhausted cards per player</b>" + (VC.help.usesEvents(c) ? " — or, using the Events wording, 1 Exhausted + 1 Event per player —" : "") + " for the stack above the Monster row.");
            if (c.mod("events")) bits.push("<b>Events:</b> shuffle <b>1 facedown Event card per player</b> into the stack (pre-select any favorites)." + (c.mod("samurai") ? " Skip the Undead Samurai Event if the Samurai are already a Monster stack." : ""));
            if (c.mod("monsterevents")) bits.push("<b>Monster Events:</b> shuffle <b>1 facedown Monster Event per player</b> and place them <b>on top</b> of the Exhausted stack; set the cardboard resource tokens near the Center Stacks.");
            if (c.mod("kingsguard")) bits.push("<b>King's Guard:</b> its Event card replaces one Exhausted card (or joins the Event shuffle).");
          }
          bits.push("Whenever an action empties a center stack, finish the action, then cover the empty slot with the top Exhausted card. When exhausted slots equal <b>twice the player count</b>, the final round triggers.");
          return bits.join("<br>");
        },
        src: (c) => {
          const s = ["Base Rulebook p.3, p.5"];
          if (c.mod("monsterevents")) s.push("p.12");
          if (c.mod("events")) s.push("Shadowvale rules");
          if (c.mod("kingsguard") || c.mod("samurai")) s.push("Combined Guide");
          return s.join(" · ");
        },
        when: (c) => c.mode !== "darksworn" }
    ] },

  { title: "Player Setup",
    steps: [
      { exp: "base",
        t: "Boards, tokens and starters",
        d: (c) => {
          const third = VC.help.starter3(c);
          let d = "Each player takes a <b>player board</b> and its four wooden tokens: Strength and Victory Points on <b>0</b>, <b>Magic on 1</b>, <b>Gold on 2</b>. Put the +10 markers within reach. Each player takes <b>3 Starter cards</b> — 1 Starter Peasant, 1 Starter Knight, and 1 Starter <b>" + third + "</b>" + (c.has("cs") ? " (Crimson Seas: the Coxswain replaces the Herald, plus <b>2 Map tokens</b> each)" : "") + " — and a Reference card.";
          if (c.mod("margrave") && c.has("cs")) d += "<br><b>Conflict:</b> Margrave Park can't be combined with Crimson Seas — the Coxswain wins.";
          if (c.mod("relics")) d += "<br><b>Relics:</b> deal 2 Relic cards to each player; keep one faceup, remove the other from the game.";
          return d;
        },
        src: (c) => "Base Rulebook p.3" + (c.has("cs") ? " · Crimson Seas p.2 · Combined Guide" : "") + (c.mod("relics") ? " · Combined Guide" : ""),
        when: (c) => c.mode !== "darksworn" },
      { exp: "base",
        t: "Deal the secret Dukes",
        d: (c) => {
          if (c.mod("noduke")) return "<b>No Duke variant:</b> skip the Dukes entirely — the alternate scoring rubric in the reference below applies instead.";
          let d = "Shuffle all Duke cards" + (c.mod("promos") ? " (promo Dukes included)" : "") + " and deal <b>2 to each player</b>. Each secretly keeps <b>1</b> facedown by their board (peek anytime) and returns the other.";
          if (c.mode === "solo") d += "<br><b>Solo:</b> after picking yours, place one random Duke facedown above the Monster stacks — that traitor is the <b>Dark Lord</b>, scoring at game end from surviving Monsters and everything he captures.";
          return d;
        },
        src: (c) => c.mode === "solo" ? "Base Rulebook p.3, p.14" : "Base Rulebook p.3" + (c.mod("noduke") ? ", p.13" : ""),
        when: (c) => c.mode !== "darksworn" },
      { exp: "cs",
        t: "Set up the Island board",
        d: "Place the <b>Island board</b> above the center stacks. Shuffle the <b>Goods</b> facedown and put 3 faceup in Araby's slots (rest facedown as supply). Same for the <b>Tomes</b>: 3 faceup in Nae Aerie. Put <b>2 Strength, 2 Magic and 2 Gold</b> in the white circle on <b>Exekratys</b>. Shuffle the <b>Nobles</b> and place 3 faceup in Amarynth. Remaining <b>Map tokens</b> form a bank pile above the board (Maps are not a Resource).",
        src: "Crimson Seas p.2",
        when: (c) => c.mode !== "darksworn" && c.has("cs") },
      { exp: "minis",
        t: "Set up the Agents row",
        d: "Shuffle the <b>Agent deck</b> above the left-most Monster stack and reveal <b>4 Agents</b>, one above each of the other four Monster stacks.",
        src: "Combined Guide (Agents)",
        when: (c) => c.mode === "standard" && c.mod("agents") },
      { exp: "base",
        t: "Choose the first player",
        d: (c) => {
          let d = "Randomly select the first player; give them the <b>Starting player token</b> (Valeria seal) and the two dice.";
          if (c.p === 5) d += "<br><b>5 players:</b> give the second Game token, <b>Resting side up</b> (night scene), to the player on the first player's right. The Resting player doesn't harvest, isn't targeted by negative effects, and isn't considered in play. The token passes <b>left</b> at the end of every turn, so it always sits with the player to the Active player's right.";
          return d;
        },
        src: (c) => "Base Rulebook p.3" + (c.p === 5 ? ", p.13" : ""),
        when: (c) => c.mode !== "darksworn" }
    ] },

  /* ================= DARKSWORN ================= */
  { title: "Darksworn Setup (Book One shown)",
    steps: [
      { exp: "ds",
        t: "Story board, Book and Number tiles",
        d: "Place the <b>Story board</b> at the top of the play area with <b>1 Achievement token per player</b> on it. Unwrap the current Book (<b>Book One: The Prophesy</b> to begin) and slot it into the right side of the board's book illustration. Place the five <b>Number tiles</b> (2–6) left to right above where the Monster row will be. When play begins, the starting player flips the Book's cover card into the far-left slot — read and follow its setup and rules; the cover's rules apply for the whole Book.",
        src: "Darksworn p.2, p.8",
        when: (c) => c.mode === "darksworn" },
      { exp: "ds",
        t: "Monster row, deck and Walls",
        d: (c) => "Choose <b>5 Monster Areas</b> from any set (recommended first game: Hills, Ruins, Forest, Valley, Mountains). Remove all cards with the <b>5-player, Warden and Boss</b> icons. Shuffle the remaining 20 Monsters; deal <b>5 faceup</b> as the Monster row (one under each Number tile) and set the rest to the right as the <b>Monster deck</b>. Randomly shuffle <b>" + (c.book || 1) + " Shade Monster" + ((c.book || 1) > 1 ? "s" : "") + "</b> into the deck — one per Book number, plus any Shades reserved in the tuck box from earlier Books. Place a <b>Wall tile</b> (full wall faceup) below each of the 5 Monsters. Harder game? Pick Areas with higher Strength/Magic costs.",
        src: "Darksworn p.2, p.12–13",
        when: (c) => c.mode === "darksworn" },
      { exp: "ds",
        t: "Citizens, Aquila board and Blessings",
        d: (c) => "Build the ten Citizen stacks (one type per Activation Number; recommended: Cleric, Merchant, Mercenary, Wizard, Peasant, Knight, Rogue, Champion, Paladin, Butcher) with <b>" + Math.min(c.p + 2, 6) + " cards per stack</b> (players + 2, max 6). Place the <b>Aquila board</b> below the Citizen stacks. Shuffle the <b>Blessing cards</b>; deal <b>3 faceup</b> onto the open-scroll slots with the deck beside them (the last slot is the discard).",
        src: "Darksworn p.2–3",
        when: (c) => c.mode === "darksworn" },
      { exp: "ds",
        t: "Player setup and first player",
        d: (c) => "Each player takes <b>1 Explorer, 1 Peasant, 1 Knight and 1 Reference card</b> — no other starter with a consolation trigger is used. Everyone starts with <b>2 Gold, 1 Magic and 1 Victory Point</b>" + ((c.book || 1) > 1 ? " — in later Books, start with VP equal to the Book number instead" : "") + ". (Dungeon Delve: 2 Gold, 2 Strength, 2 Magic, 2 VP, and all 9 Shades in the deck.) Randomly pick the first player and hand them the dice.",
        src: "Darksworn p.3, p.13",
        when: (c) => c.mode === "darksworn" }
    ] }
];

/* ---- REFERENCE SECTIONS -------------------------------------------------------- */
VC.reference = [
  { id: "turn", title: "Turn Structure",
    when: () => true,
    html: (c) => {
      if (c.mode === "darksworn") return `
<ol>
<li><b>Roll Phase</b> — the Active player rolls both dice and announces the results (each die and the sum all count).</li>
<li><b>Harvest Phase</b> — unchanged from the base game: everyone harvests from activated Citizens (left side for the Active player, right side for the rest); doubles activate twice.</li>
<li><b>Action Phase</b> — 2 actions from: Slay a Monster (discarded, not kept — you gain its printed VP immediately plus rewards; a Citizen reward may rescue a captured Citizen from the oubliette; a Domain reward becomes 5 Gold), Recruit a Citizen, Gain a Resource, <b>Pray to Aquila</b> (8 VP to place a fresh Wall, or pay a Blessing's VP cost for its effect), <b>Share Resources</b> (pay any amount of one Resource; another player gains half as many, rounded up, of a Resource of their choice), <b>Engage the Book</b> (pay a Task's full cost at once — Magic may augment — to place an Achievement token and take its reward; the Task completes when it holds one token per player). No Build a Domain in Darksworn. Don't refill emptied Monster slots mid-phase.</li>
<li><b>Monster Phase</b> — resolve the (possibly Blessing-modified) dice against the Number tiles in ascending order: each activated column's Monster attacks — a full Wall flips to damaged; a damaged Wall falls to the Aquila board; no Wall means the Active player must <b>Discard a Citizen</b> from that column's stacks to the oubliette. Then resolve activated <b>Shades</b> in ascending order (some ignore Walls, Discard or Banish). Finally a rolled/summed <b>6</b> checks Shades then triggers the Book's instructions. If a Discard/Banish ever finds no valid Citizen, <b>you lose immediately</b>.</li>
<li><b>End Phase</b> — if the Task holds all Achievement tokens, clear them and turn the page (read it!). Reaching the Book's final page wins the game. Refill Blessings to 3 and the Monster row to 5 (shuffling discards into new decks as needed), then pass the dice left.</li>
</ol>
<p class="src-line">Darksworn p.8–12</p>`;
      let solo = c.mode === "solo";
      return `
<ol>
<li><b>Roll Phase</b> — the Active player rolls both dice${solo ? " (you roll each round)" : ""}. Each die value <i>and the sum</i> will activate matching Citizens. Roll-Phase Domains may modify dice now (each once per Roll Phase), before anything else triggers.${c.has("cs") ? " <b>Crimson Seas:</b> for every 6 rolled (including a summed 6), place 1 Resource from your supply onto Exekratys." : ""}${c.mod("monsterevents") ? " <b>Monster Events:</b> a rolled Activation Number triggers the event now (once, even on doubles)." : ""}</li>
<li><b>Harvest Phase</b> — every player harvests from each activated Citizen: the <b>left (sun) power</b> if you're the Active player, the <b>right (moon) power</b> otherwise. Doubles activate each matching card <b>twice</b>. Resolve your cards in any order and spend as you go — except a <b>Thief-style “take from a player” card resolves first</b>. ${c.has("cs") ? "<b>Coxswain:</b> activates when none of your Citizens did, or on doubles (never both) — the old any-1-Resource consolation rule is gone." : "<b>Herald:</b> if no Citizen of yours activated — or the roll was doubles — gain any 1 Resource (both true at once: gain twice). If your Citizens activated but you couldn't or wouldn't use them, no Herald."}${solo ? " Solo: harvest LEFT-side powers; “take from a player” effects just gain from the bank." : ""}</li>
<li><b>Action Phase</b> — the Active player takes <b>exactly 2 actions</b> (repeats allowed, one finished before the next): Slay a Monster, Recruit a Citizen, Gain a Resource, Build a Domain${c.has("cs") ? ", Sail, Gain a Map" : ""}${c.mod("agents") ? ", Engage an Agent" : ""}.</li>
${solo ? "<li><b>Monsters Phase</b> — each die (not the sum) activates the Monster stack in that position (1 = left-most … 5 = right-most; 6 = your choice of unexhausted stack; doubles activate twice; exhausted stacks whiff). An activated stack captures a Citizen from its column for the Dark Lord — if both Citizen stacks are empty, a Domain; if the whole column is empty, you lose immediately. Harder game: also activate for a summed 2–6, and/or an exhausted rolled stack lets the Dark Lord attack the column directly.</li><li><b>Second Harvest Phase</b> — harvest the RIGHT-side powers of your activated Citizens, including any recruited this turn.</li>" : ""}
<li><b>End Phase</b> — check the end conditions; otherwise pass the dice left.${c.has("cs") ? " Flip your used (facedown) Tomes faceup — the very last thing you do." : ""}${c.p === 5 ? " Pass the Resting token left too — it always sits right of the Active player." : ""}</li>
</ol>
<p class="src-line">Base Rulebook p.4–5${solo ? ", p.14" : ""}${c.has("cs") ? " · Crimson Seas p.5" : ""}</p>`;
    } },

  { id: "actions", title: "The Actions",
    when: (c) => c.mode !== "darksworn",
    html: (c) => `
<ul>
<li><b>Slay a Monster</b> — pay the top card's Strength (Magic may augment, but spend <b>at least 1 Strength</b>; a printed Magic cost is additional). Take the card into your Victory stack and its rewards immediately. Citizen-card rewards ignore the “+” surcharge.${c.has("cs") ? " Crimson Seas Monsters with a “+” cost 1 more per copy of that Monster you already own." : ""}${c.mod("wardtowers") ? " Completed Ward Towers discount every player's slays." : ""}</li>
<li><b>Recruit a Citizen</b> — pay the Gold base cost <b>+1 Gold per copy of the same name you already have</b> (Magic may augment; spend at least 1 Gold). The Citizen doesn't activate the turn it's recruited.</li>
<li><b>Gain a Resource</b> — take any 1 Strength, Gold or Magic.</li>
<li><b>Build a Domain</b> — your tableau must show the Domain's required <b>Role icons</b> (Starter Peasant/Knight have none${c.has("cs") ? "; rescued Nobles' Role icons count" : ""}). Pay the Gold (Magic may augment, ≥1 Gold), take the Domain, resolve its reward — bonus actions it grants are free. Reveal the next Domain in the stack.</li>
${c.has("cs") ? `<li><b>Gain a Map</b> — take 1 Map token from the bank.</li>
<li><b>Sail</b> — pay 1 Map, visit one island: <b>Araby</b> buy any number of the faceup Goods at their slot prices; <b>Nae Aerie</b> same for Tomes; <b>Exekratys</b> take ALL of one Resource type piled there; <b>Amarynth</b> rescue 1 Noble for 9 of any one Resource +1 per Noble you already have. Then refresh the island (slide tokens down cheaper, refill; draw a new Noble).</li>` : ""}
${c.mod("agents") ? "<li><b>Engage an Agent</b> — use a faceup Agent's ability, return it to the bottom of the deck, refill the row.</li>" : ""}
${c.mod("wardtowers") ? "<li><b>Build a Banner (Ward Towers)</b> — with 4 matching Role icons, pay exactly 9 of the shown resource (no Magic augmentation; Tomes allowed) to place a Banner on the Tower.</li>" : ""}
</ul>
<p class="src-line">Base Rulebook p.6–7${c.has("cs") ? " · Crimson Seas p.6–7" : ""}${c.mod("agents") || c.mod("wardtowers") ? " · Combined Guide" : ""}</p>` },

  { id: "resources", title: "Resources, Magic & Icons",
    when: () => true,
    html: (c) => `
<ul>
<li><b>Magic augments</b> Strength or Gold as long as at least one of the real resource is spent. Victory Points are <b>not</b> a Resource${c.mode === "darksworn" ? " (but Praying to Aquila spends them)" : ""}.</li>
<li>Track values past 10 with the <b>+10 markers</b>; they're not a component limit.</li>
<li><b>Operator icons</b>: <i>plus</i> (both sides), <i>or</i> (choose one), <i>per</i> (multiply), <i>≤</i> (take up to the limit — Citizens taken this way ignore the “+” surcharge), <i>paid-to-gain</i> (left goes to the bank for the right), <i>taken-from</i> (left comes from the right), <i>opponent of your choice</i>, <i>any die</i>${c.has("ff") || c.has("cs") || c.has("sv") ? ", <i>banish</i> (remove from the game — never a Starter)" : ""}${c.mode === "darksworn" ? ", <i>discard</i> (Citizens go to the oubliette; Monsters to the Monster discard), <i>return</i> (a captured Citizen back to its stack — this can un-exhaust it)" : ""}.</li>
<li><b>Wild</b>: that many of ONE Resource of your choice — never mixed.</li>
<li>Card text beats the rulebook when they conflict. A Role icon overlapping a Citizen-card icon restricts the effect to Citizen cards.</li>
<li>Tableau limits: none — except always exactly 1 Starter Peasant, 1 Starter Knight, 1 Starter ${VC.help.starter3(c)}${c.mod("noduke") ? "" : ", and 1 Duke"}.</li>
${c.has("cs") ? "<li><b>Tomes</b>: flip facedown anytime to pay as the pictured Resource (works like the real token, may be augmented by Magic/Magic Tomes; never taken by opponents, never converts to a bank Resource). Flip used Tomes faceup at the very end of your turn.</li>" : ""}
</ul>
<p class="src-line">Base Rulebook p.7–8, p.16${c.has("cs") ? " · Crimson Seas p.4, p.9" : ""}${c.mode === "darksworn" ? " · Darksworn p.4" : ""}</p>` },

  { id: "cards", title: "Citizens, Monsters, Domains & Dukes",
    when: (c) => c.mode !== "darksworn",
    html: (c) => `
<ul>
<li><b>Citizens</b>: Activation Number top-left (two numbers = either activates); Role icon top-right (Worker, Soldier, Shadow, Holy); two Harvest powers — sun side on your turn, moon side otherwise. Powers referencing names or Roles count your tableau <i>and</i> Victory stack at that moment; name references include Starters with the same name.</li>
<li><b>Monsters</b>: eight base Areas${c.has("ff") ? " + five Flames & Frost Areas" : ""}${c.has("cs") ? " + five Crimson Seas sea Areas" : ""}${c.has("sv") ? " + five Shadowvale Areas" : ""}; every card in a stack shares the Area icon. Types: Boss, Minion, Beast, Titan${c.has("cs") || c.has("sv") || c.mod("wardens") ? ", Warden (sits above the Boss regardless of Strength)" : ""}${c.mode === "darksworn" ? ", Shade" : ""}. Bosses reward per slain Monster of their Area. End-game VP is the mid-right number — never tracked on your board.</li>
<li><b>Domains</b>: meet the Role icons, pay the Gold. One-time rewards happen on build; ongoing powers say when they fire (simultaneous powers resolve in your chosen order). VP mid-right at game end.</li>
<li><b>Dukes</b>: secret, chosen 1-of-2 at setup, scored at the end. Duke scoring on Role icons counts Citizens <b>and</b> Domains${c.has("cs") ? " <b>and</b> Nobles" : ""}; Resource-scoring Dukes total ALL leftover Resources and divide.</li>
${c.has("cs") ? "<li><b>Nobles</b> (Amarynth): a Role icon up top that works like a Citizen's, plus end-game VP conditions printed below.</li><li><b>Goods</b> (Araby): end-game set scoring per type — 1/2/3/4/5/6 of a kind = <b>2/4/7/12/18/25 VP</b>.</li>" : ""}
</ul>
<p class="src-line">Base Rulebook p.8–11${c.has("cs") ? " · Crimson Seas p.8–9 · Combined Guide" : ""}</p>` },

  { id: "endgame", title: "Ending the Game & Scoring",
    when: (c) => c.mode !== "darksworn",
    html: (c) => {
      if (c.mode === "solo") return `
<ul>
<li><b>Win immediately</b> by slaying every Monster. <b>Lose immediately</b> if a Monster attacks a column with no Citizen or Domain cards left to capture.</li>
<li>Otherwise the game ends when <b>any five stacks are exhausted</b>: score your Monsters + Domains + Duke, then reveal the Dark Lord and score his surviving Center-Stack Monsters, captured Citizens/Domains, and his Duke against those spoils. Beat his total or share Valeria's fate.</li>
</ul>
<p class="src-line">Base Rulebook p.15</p>`;
      return `
<ul>
<li><b>End triggers</b> (checked in the End Phase): all Monsters slain; all Domains built; exhausted slots = <b>2× player count</b>${c.has("cs") ? "; or Goods, Tomes or Nobles can no longer refill their 3 island slots" : ""}. Play continues until everyone has had <b>equal turns</b>.</li>
<li><b>Score</b>: VP on slain Monsters + built Domains + your player board + your Duke${c.mod("noduke") ? " (No Duke variant: the fixed rubric instead — 1 VP per Worker/Soldier icon, 2 per Shadow/Holy, 1 per 3 leftover Resources, and 7 VP majorities for Citizens/Monsters/Domains, 3 on ties)" : ""}${c.has("cs") ? " + Goods sets + Noble conditions + <b>1 VP per Tome</b> (faceup or facedown)" : ""}.</li>
<li><b>Tiebreak</b>: fewest cards in tableau; still tied, share the throne.</li>
${c.mod("monsterevents") || VC.help.usesEvents(c) ? "<li>Slain Monster Events score like normal Monsters, including their icons for Dukes" + (c.has("cs") ? " and Nobles" : "") + ".</li>" : ""}
</ul>
<p class="src-line">Base Rulebook p.5${c.has("cs") ? " · Crimson Seas p.6, p.8–9 · Combined Guide" : ""}</p>`;
    } },

  { id: "events", title: "Events & Monster Events",
    when: (c) => c.mode !== "darksworn" && (c.mod("monsterevents") || VC.help.usesEvents(c)),
    html: (c) => `
<ul>
${c.mod("events") ? "<li><b>Event cards</b> reveal from the Exhausted stack: place the Event in the open slot and resolve its text before the next action or phase — granted actions are free; multiple players resolve in turn order. The slot still counts as exhausted. <i>Flip a Citizen</i> effects: a facedown Citizen doesn't activate and doesn't count for Domains, but flips back up to score at the end.</li>" : ""}
${c.mod("monsterevents") ? "<li><b>Monster Events</b> trigger at the end of a Roll Phase matching their Activation Number (never twice on doubles); once revealed they sit in a slot and can be <b>slain</b> (printed cost + any resource tokens piled on). Replace a slain event from the <b>bottom</b> of the Exhausted stack. Clarifications — <i>Leviathan</i>: +1 Strength token per rolled 6, max 10. <i>Ghost Ship</i>: each Roll Phase the Active player feeds it 1 Gold; the slayer takes the pile. <i>Giants of Ostendaar</i> (5): banish a faceup Domain. <i>Flaming Devourer</i> (4): banish a center-stack Citizen. <i>Skeleton Army</i> (3): flip an opponent's Citizen facedown for the rest of the game (it still scores). <i>Pirate Blockade</i>: rolled values (and the sum) can't be gained as Citizens this turn.</li>" : ""}
${c.mod("samurai") ? "<li><b>Undead Samurai Event</b>: shuffles the Samurai Lord into the Exhausted stack; when the Lord appears, players seed Samurai onto unexhausted stacks in turn order. Slay the Lord to banish the rest.</li>" : ""}
${c.mod("kingsguard") ? "<li><b>King's Guard</b>: when revealed, its Citizen stack goes on top and becomes recruitable; the slot still counts as exhausted.</li>" : ""}
</ul>
<p class="src-line">Base Rulebook p.12 · Shadowvale rules · Crimson Seas p.10–12 · Combined Guide</p>` },

  { id: "darksworn-ref", title: "Darksworn: Walls, Blessings, Shades & the Book",
    when: (c) => c.mode === "darksworn",
    html: () => `
<ul>
<li><b>Walls</b> absorb attacks: full → damaged → falls to the Aquila board. Rebuild via Pray to Aquila (8 VP) onto any Monster without a Wall.</li>
<li><b>Blessings</b> (Aquila board): pay the printed VP for the effect right of the arrow (the conversion Blessing is free); discard used Blessings and refill to 3 in the End Phase.</li>
<li><b>Shades</b> have Activation Conditions: <i>Instant</i> (on entering the row), <i>Wild die</i> (their Number tile's value), or a printed die value (doubles trigger twice). Some ignore Walls entirely.</li>
<li><b>The Book</b>: the cover's back rules apply all Book; page rules apply while faceup. The “important” icon can mean permanent saga rules — read carefully. A 6 (die or sum) activates the Book after Shades. <b>Tasks</b> need one Achievement token per player (each placement = one Engage the Book action, any mix of players); rewards go to the player who places the token.</li>
<li><b>Slain Monsters are discarded, not kept</b> — their VP goes straight to your board. Captured Citizens sit in the oubliette; Return effects (and some Task rewards) send them home, potentially un-exhausting stacks.</li>
<li><b>Win</b>: turn the Book's final page. <b>Lose</b>: any Discard/Banish finds no valid Citizen. Losing means reassembling the Book (cards are lettered/numbered) and trying again.</li>
<li><b>The Saga</b>: winning banks specified cards in the tuck box for future Books. Book N: shuffle in N random Shades (+ reserved ones) and start with N VP each. <b>Dungeon Delve</b> is a standalone Book: all 9 Shades, start 2 Gold/2 Strength/2 Magic/2 VP; only the Radiant tokens from Book One carry in.</li>
</ul>
<p class="src-line">Darksworn p.4–13</p>` },

  { id: "clarif", title: "Card Clarifications",
    when: (c) => c.mode !== "darksworn",
    html: (c) => `
<ul>
<li><b>Thief</b>: up to 3 Gold <i>or</i> 3 Magic (no mixing) from one player, resolved before all other Harvest cards.</li>
<li><b>Bane Spider</b>: 3 Gold, or a Knight from the stacks — no Knight left means the Gold.</li>
<li><b>Orc Warrior / Wraith</b>: free Citizen ≤3 / ≤2 Gold — ignore the “+”.</li>
<li><b>Palace of the Dawn</b>: −1 to a die (never to zero; stacking with other Domains fine). <b>Foxgrove Palisade</b>: 2 Gold sets a die to 6. <b>The Desert Orchid</b>: set a die to 1 for 1 Gold per Holy Citizen (zero Holy = free).</li>
<li><b>Gargan's Embrace</b>: 1 VP whenever the dice are or become doubles — multiple triggers per roll possible.</li>
<li><b>Nest of the Weaver Woman / Watcher on the Water</b>: return a Citizen/Monster to its stack — this can un-exhaust the slot and genuinely extend the game.</li>
<li><b>Purloiner's Perch</b>: steal a random slain Monster (shuffle their stack facedown); no rewards, just the card.</li>
${c.has("sv") ? "<li><b>Blood Moon Palace</b>: 2 Magic rerolls BOTH dice, before or after other dice Domains. <b>Opera House</b>: +1 Magic once per Harvest Phase in which you gained any Magic. <b>Laborium / Cursed Cavern</b>: flipped Citizens stay inactive but score at the end (Cursed Cavern flips one of everyone's, including yours). <b>Ancient Tomb</b>: its Strength tokens raise the Monster's cost for whoever slays it. <b>Raven's Outpost</b>: triggers only on opponents' slays. <b>Dragoon</b>: a free Slay during the Harvest Phase — Action-Phase triggers (like Raven's Outpost) don't fire on it.</li>" : ""}
${c.has("ff") ? "<li><b>Betrayal of Bonds</b> (F&F): the flipped Citizen is dead weight until end-game scoring.</li>" : ""}
</ul>
<p class="src-line">Base Rulebook p.15–16${c.has("sv") ? " · Shadowvale rules" : ""}${c.has("ff") ? " · Flames & Frost rulesheet" : ""}</p>` }
];


/* ---- TEACHING SCRIPT (read aloud, ~5 min; content per the 2E rulebook, the
   expansion rulesheets and the Combined Guide — see references) -------------- */
VC.teach = {
  intro: "Read this aloud — about five minutes. Dice down until the end.",
  sections: [
    { h: "The pitch — and how you win", when: (c) => c.mode !== "darksworn", body: (c) => `
<p>We are dukes defending Valeria — by getting rich doing it. Most <b>Victory Points</b> wins: points come from <b>slain Monsters</b>, <b>built Domains</b>, points banked on your board, and your secret <b>Duke card</b>'s bonus.</p>
<p>The game ends when all the Monsters are dead, all the Domains built, or enough card stacks run empty — then equal turns and we count.</p>` },

    { h: "The pitch — hold the walls together", when: (c) => c.mode === "darksworn", body: () => `
<p>This is <b>Darksworn</b> — fully cooperative and story-driven. We play through a <b>Book</b>: complete its Tasks to turn pages, and win by reaching the final page. We lose the moment a Monster attack demands a Citizen we can't give. Walls fall, Shades stalk the row, and the Book itself strikes on every 6.</p>` },

    { h: "The dice work for everyone", body: (c) => `
<p>Here's the engine: the active player rolls two dice, and <b>every player harvests</b> — each die, <i>and their sum</i>, activates Citizens with those numbers in front of you. Active player takes the sun-side bonus, everyone else the moon side; doubles trigger twice. You are never idle in this game — every roll is your roll.</p>
<p>No Citizen fired? Your consolation card feeds you a resource anyway.</p>` },

    { h: "Your two actions — and why", body: (c) => {
      if (c.mode === "darksworn") return `
<p>On your turn, two actions: <b>Slay a Monster</b> (its points are yours instantly, and it stops attacking that column), <b>Recruit a Citizen</b> (grow everyone's engine — yours most), <b>Gain a Resource</b>, <b>Pray to Aquila</b> (spend hard-won points for fresh Walls or Blessings), <b>Share Resources</b> (half lands with a friend, rounded up), or <b>Engage the Book</b> (pay a Task's full cost to plant your Achievement token — Tasks need one token per player, so everyone pulls).</p>`;
      return `
<p>On your turn, two actions, any mix: <b>Slay a Monster</b> — pay its Strength (Magic tops up), take the card, its rewards, and its points; <b>Recruit a Citizen</b> — pay Gold for a stronger engine (each copy you already own costs +1); <b>Build a Domain</b> — match the Role icons in your tableau, pay Gold, gain powers and points; or <b>Gain a Resource</b> when you're short. Monsters are tempo, Citizens are income, Domains are the payoff.</p>`;
    }},

    { h: "The secret Duke", when: (c) => c.mode !== "darksworn" && !c.mod("noduke"), body: () => `
<p>Your <b>Duke card</b> is hidden and scores at the end — most reward collecting certain Role icons or hoarding a resource. Peek at it whenever you like, build toward it quietly, and don't let your purchases give you away.</p>` },

    { h: "Solo — the Dark Lord", when: (c) => c.mode === "solo", body: () => `
<p>Your rival is the <b>Dark Lord</b>: after your actions, each die activates the Monster stack in that position, and it <b>kidnaps a Citizen</b> from that column for his hoard — empty columns lose Domains, and a bare column loses you the game on the spot. Then you harvest again (moon side). At the end, he scores everything he's captured plus every Monster you left alive. Kill fast; he profits from your patience.</p>` },

    { h: "Events in the stacks", when: (c) => c.mode !== "darksworn" && (c.mod("monsterevents") || c.mod("events") || c.mod("kingsguard") || c.mod("samurai")), body: (c) => `
<p>Some of the <b>Exhausted cards</b> covering emptied stacks are booby-trapped: <b>Events</b> resolve the moment they're revealed${c.mod("monsterevents") ? ", and <b>Monster Events</b> lurk with an Activation Number — roll it and they act, until someone slays them like any Monster" : ""}. Emptying a stack is still how the game ends, so treat every reveal as a small ceremony.</p>` },

    { h: "Darksworn — the round's dark half", when: (c) => c.mode === "darksworn", body: () => `
<p>After your actions come the <b>Monsters</b>: each rolled number attacks its column — a full Wall cracks, a cracked Wall falls, no Wall costs us a Citizen to the oubliette. <b>Shades</b> resolve next, and any 6 wakes <b>the Book</b>. Rescue captured Citizens with Monster rewards and Task rewards; rebuild Walls through Aquila. Guard the weak columns — that's the entire war.</p>` },

    { h: "Don't worry about these yet", body: (c) => {
      const later = [];
      if (c.mode === "darksworn") { later.push("individual Blessing and Shade cards", "the Book's page rules"); }
      else { later.push("individual card powers"); if (c.mod("wardens")) later.push("Wardens"); if (c.mod("wardtowers")) later.push("Ward Tower banners"); if (c.mod("agents")) later.push("the Agent row"); if (c.p === 5) later.push("the Resting player"); }
      return `<p>I'll explain ${later.join(", ")} as they come up. Opening advice: buy Citizens with numbers the table is missing — 6, 7 and 8 fire constantly, and a number nobody owns is a wasted roll for everyone.</p>`;
    }}
  ]
};
