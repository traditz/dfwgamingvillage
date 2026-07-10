/* =============================================================================
   Relic (FFG, Warhammer 40,000) — Setup Utility
   Data model: expansions, optional modes/variants, and a single
   precedence-aware setup sequence.

   The setup is ONE ordered list of steps that follows the base game's 12
   numbered setup steps (Core Rulebook p.4–5). Each step is tagged with the
   source it comes from. Where an expansion or game mode changes an earlier
   rule, the supersession is encoded in the step's `when` condition so only the
   applicable ruling appears.
   Precedence: base < Nemesis (2014) < Halls of Terra (2015).
   ============================================================================= */

const RL = {};

/* ---- Expansions ---------------------------------------------------------- */
RL.expansions = [
  { id: "base",    name: "Relic (Base Game)", short: "Base", always: true, kind: "base",
    blurb: "The core game (2–4 players). Battle threats across the Antian Sector, complete missions, claim a relic and brave the Warp Rift." },
  { id: "nemesis", name: "Relic: Nemesis", short: "Nemesis", kind: "big",
    blurb: "Adds 5–6 player support, apostate wargear & skill duels, 2 characters, 4 scenarios — and the Enemies of the Imperium mode with 4 playable nemeses." },
  { id: "halls",   name: "Relic: Halls of Terra", short: "Halls of Terra", kind: "big",
    blurb: "Adds the Sol System board (Sol tier + Imperial Palace tier), affiliations & Champion cards, the orange Threat deck, 3 characters, 3 scenarios and the Abraxis Synethi nemesis." }
];

/* Display metadata for the source tag shown on every step. */
RL.expMeta = {
  base:    { name: "Base",           cls: "e-base" },
  nemesis: { name: "Nemesis",        cls: "e-nem"  },
  halls:   { name: "Halls of Terra", cls: "e-hot"  }
};
RL.precedence = { base: 0, nemesis: 1, halls: 2 };

/* ---- Optional modes & variants -------------------------------------------
   `requires`  = expansion id (or array, any-of). `minPlayers` gates modes.   */
RL.modules = [
  { id: "eoti", name: "Enemies of the Imperium", type: "mode", requires: "nemesis", minPlayers: 3,
    summary: "1–2 players play a nemesis working against the Imperium, racing to 25 infamy.",
    description: "The Nemesis game mode: in a 3–4 player game one player, and in a 5–6 player game two players, take the role of a nemesis (Moarn Goreheart, Luxuria, Githellion Ath'ulwei, Specimen X — or Abraxis Synethi with Halls of Terra) instead of a character. A nemesis uses its own Nemesis deck plus the Imperium deck and wins by reaching 25 infamy. Required for the Dark Alliance and Shoulder to Shoulder scenarios (Nemesis rules, p.5)." },
  { id: "hallsCards", name: "Halls of Terra: cards only (no Sol board)", type: "variant", requires: "halls",
    summary: "Use the Halls of Terra cards, characters and scenarios without the Sol System board.",
    description: "Halls of Terra is meant to be used whole, but you may play with only some of its elements. If the Sol System board is not on the table, the Halls of Terra Mission cards must be removed from the game (or ignored when drawn) — they specifically interact with the Sol System board (Halls of Terra rules, p.3)." }
];

/* Module type metadata — order and label. */
RL.moduleTypes = [
  { id: "mode",    label: "Game modes",  note: "Structural modes that change who sits at the table." },
  { id: "variant", label: "Variants",    note: "Optional adjustments to how the expansions are used." }
];

/* ---- THE UNIFIED SETUP SEQUENCE ------------------------------------------ */
/* Each step: { ph, exp, t, d, src, when }                                     */
/*   ph   = phase index (visual grouping)                                      */
/*   exp  = source tag                                                         */
/*   when = (c) => boolean, c = { has(exp), p (players), mod(id), eoti,
/*            solBoard, nemCount }                                             */
RL.phases = [
  "1 · Board, Scenario & Decks",
  "2 · Characters & Nemeses",
  "3 · Prepare the Players",
  "4 · Begin the Game"
];

RL.setup = [
  /* ===================== Phase 0 — Board, Scenario & Decks ================= */
  { ph: 0, exp: "base", t: "Place the game board", src: "Core p.4 (step 1)",
    d: "Unfold the Relic game board and place it in the centre of the play area." },
  { ph: 0, exp: "halls", t: "Add the Sol System board", when: c => c.solBoard, src: "Halls of Terra p.3 (step 1)",
    d: "Place the Sol System board next to the Relic board so that the <b>Luna</b> space is adjacent to <b>Battlefleet Antias</b> and the <b>Titan</b> space is adjacent to the <b>Grey Knight Envoy</b>. The Sol System board is an extension of the Relic board and is treated as part of it for game effects." },
  { ph: 0, exp: "halls", t: "Cards only: pull the Sol System missions", when: c => c.has("halls") && !c.solBoard, src: "Halls of Terra p.3 (sidebar)",
    d: "You are playing without the Sol System board, so remove the Halls of Terra <b>Mission cards</b> from the game (or ignore them when drawn) — they specifically interact with the Sol System board. The rest of the expansion's cards, characters and scenarios work normally." },

  { ph: 0, exp: "nemesis", t: "Shuffle in the Nemesis cards & sheets", when: c => c.has("nemesis"), src: "Nemesis p.4",
    d: "Shuffle all Nemesis-icon <b>Wargear, Relic and Threat cards</b> into the matching base-game decks, and mix the new <b>character and scenario sheets</b> with the base-game sheets. The nemesis boards, nemesis tokens, nemesis sheets, Nemesis decks and Imperium deck are used only in the Enemies of the Imperium mode" + " — leave them in the box otherwise." },
  { ph: 0, exp: "halls", t: "Shuffle in the Halls of Terra cards & sheets", when: c => c.has("halls"), src: "Halls of Terra p.3",
    d: "Mix all Halls of Terra <b>Mission, Corruption, Relic and red/blue/yellow Threat cards</b> into the matching base-game decks, and mix the new <b>character and scenario sheets</b> with the base-game sheets. The <b>orange Threat cards stay separate</b> — they form their own deck. (The Abraxis Synethi nemesis sheet, its Nemesis deck, the nemesis piece and the Imperium tokens are used only with the Nemesis expansion's Enemies of the Imperium mode.)" },

  { ph: 0, exp: "base", t: "Choose the scenario", src: "Core p.4 (step 2)",
    d: "Shuffle the scenario sheets under the table, choose one at random and place it faceup on the scenario space in the centre of the board. One player reads it aloud so everyone knows this game's special rules and objective. For a first game, use <b>“The Mystery Beyond”</b>." },
  { ph: 0, exp: "nemesis", t: "Scenario pool note", when: c => c.has("nemesis") && !c.eoti, src: "Nemesis p.4–5",
    d: "The scenario is still drawn at random from all the mixed-in sheets — Nemesis adds four to the pool: <b>Hulk of the Wayward Warrior</b>, <b>Master Collector</b>, <b>Dark Alliance</b> and <b>Shoulder to Shoulder</b>. You are not using Enemies of the Imperium, so if <b>Dark Alliance</b> or <b>Shoulder to Shoulder</b> is drawn, set it aside and draw another — those two can only be played with that mode." },
  { ph: 0, exp: "nemesis", t: "Scenario pool note", when: c => c.eoti, src: "Nemesis p.4–5, 14",
    d: "The scenario is still drawn at random from all the mixed-in sheets — Nemesis adds four to the pool: <b>Hulk of the Wayward Warrior</b>, <b>Master Collector</b>, <b>Dark Alliance</b> and <b>Shoulder to Shoulder</b>. One restriction: <b>Dark Alliance</b> needs an even number of players (it supports six with three nemeses — the third nemesis player tracks Life, attribute, level and infamy on paper, since only two nemesis boards exist)." },

  { ph: 0, exp: "nemesis", t: "Decide who plays a nemesis", when: c => c.eoti, src: "Nemesis p.5 (General Setup)",
    d: "There is <b>one nemesis in a 3–4 player game</b> and <b>two in a 5–6 player game</b> (unless the scenario sheet says otherwise) — with your current player count that means <b>{NEM}</b>. Each player declares whether they want a nemesis or a character; if more players volunteer than allowed, the volunteers determine it randomly. The character players then handle the remaining setup steps while the nemeses set up their own boards." },

  { ph: 0, exp: "base", t: "Prepare the decks", src: "Core p.4 (step 3)",
    d: "Separate the cards into their decks — Corruption, Mission, Power, Relic, red Threat, blue Threat, yellow Threat and Wargear. Shuffle each deck and place it facedown near the game board, leaving room beside each for a faceup discard pile." },
  { ph: 0, exp: "halls", t: "Orange Threat deck & Champion cards", when: c => c.solBoard, src: "Halls of Terra p.3 (step 3)",
    d: "Shuffle the <b>orange Threat deck</b> and place it next to the three base-game Threat decks. Place the nine <b>Champion cards</b> near the board — they are not shuffled, and players may look at them at any time." },

  { ph: 0, exp: "base", t: "Prepare the token supplies", src: "Core p.4 (step 4)",
    d: "Place all charge tokens and influence tokens in separate supply piles where every player can reach them." },
  { ph: 0, exp: "halls", t: "Sort the affiliation tokens", when: c => c.solBoard, src: "Halls of Terra p.3 (step 4)",
    d: "Separate the 54 <b>affiliation tokens</b> by type and place them in distinct supply piles near the game board." },

  /* ===================== Phase 1 — Characters & Nemeses ==================== */
  { ph: 1, exp: "base", t: "Deal & choose characters", when: c => !c.eoti, src: "Core p.4 (step 5)",
    d: "Shuffle the character sheets facedown and deal <b>two to each player</b>. Each player secretly and simultaneously chooses one. Return all unused character sheets to the game box." },
  { ph: 1, exp: "base", t: "Deal & choose characters", when: c => c.eoti, src: "Core p.4 (step 5) · Nemesis p.6",
    d: "Shuffle the character sheets facedown and deal <b>two to each character player</b> (the nemesis players are dealt nemesis sheets instead — next step). Each player secretly and simultaneously chooses one. Return all unused character sheets to the game box." },
  { ph: 1, exp: "halls", t: "Add Abraxis Synethi to the nemesis pool", when: c => c.eoti && c.has("halls"), src: "Halls of Terra p.8",
    d: "Mix the <b>Abraxis Synethi</b> nemesis sheet from Halls of Terra with the four Nemesis-expansion nemesis sheets before dealing — five nemeses are now in the pool. Keep his Nemesis deck and plastic nemesis piece at hand in case he is chosen." },
  { ph: 1, exp: "nemesis", t: "Deal & choose nemeses", when: c => c.eoti, src: "Nemesis p.6 (step 1)",
    d: "Shuffle the nemesis sheets facedown and deal <b>two to each nemesis player</b>; each chooses one and returns the rest to the box. Nemeses are revealed at the same time as the characters. Each nemesis player takes the matching plastic nemesis piece." },

  { ph: 1, exp: "base", t: "Choose player colours", when: c => !c.eoti, src: "Core p.4 (step 6)",
    d: "Each player chooses one of the four player colours — <b>grey, brown, green or purple</b> — and takes the matching character board, plastic character base, character tokens and level peg." },
  { ph: 1, exp: "base", t: "Choose player colours", when: c => c.eoti, src: "Core p.4 (step 6)",
    d: "Each <b>character player</b> chooses one of the four player colours — <b>grey, brown, green or purple</b> — and takes the matching character board, plastic character base, character tokens and level peg." },
  { ph: 1, exp: "nemesis", t: "Fifth & sixth player colours", when: c => c.has("nemesis") && c.p >= 5 && !c.eoti, src: "Nemesis p.4",
    d: "Nemesis adds two extra player colours — <b>red and black</b> — with their own character boards, bases, level pegs and character tokens for the fifth and sixth players." },
  { ph: 1, exp: "nemesis", t: "Nemesis colours", when: c => c.eoti, src: "Nemesis p.6 (step 2)",
    d: "Each nemesis player chooses one of the two nemesis colours — <b>black or red</b> — and takes the matching nemesis board, plastic character base, nemesis tokens and level peg." },

  /* ===================== Phase 2 — Prepare the Players ===================== */
  { ph: 2, exp: "base", t: "Place character pieces", src: "Core p.4 (step 7)",
    d: "Each player attaches their plastic character piece to its base and places it on the <b>starting space</b> printed on their character sheet." },
  { ph: 2, exp: "base", t: "Prepare character boards", src: "Core p.4 (step 8)",
    d: "Slide the top of the character sheet into the character board and insert the level peg into the slot above the word <b>“Start”</b> on the level track. Players are level 0 until they gain their first level." },
  { ph: 2, exp: "halls", t: "Take your starting affiliation", when: c => c.solBoard, src: "Halls of Terra p.3 (step 8) · p.6",
    d: "Each player takes the <b>affiliation token</b> matching the affiliation printed near their character's name on the character sheet. (You can never hold more than one token of the same affiliation.)" },
  { ph: 2, exp: "base", t: "Set attributes & Life dials", src: "Core p.4 (step 9)",
    d: "Each player adjusts their dials to the starting <b>Strength, Willpower, Cunning and Life</b> values printed at the bottom of their character sheet. Attributes can never drop below their starting value." },
  { ph: 2, exp: "base", t: "Take starting influence", src: "Core p.4 (step 10)",
    d: "Each player takes <b>3 influence tokens</b> and places them in their play area." },
  { ph: 2, exp: "base", t: "Draw starting Power cards", src: "Core p.5 (step 11)",
    d: "Each player draws Power cards equal to the <b>power limit</b> printed below the “Start” space on their level track, keeping them facedown and hidden. You may look at your own Power cards at any time." },
  { ph: 2, exp: "base", t: "Draw a starting mission", src: "Core p.5 (step 12)",
    d: "Each player draws <b>one Mission card</b> and places it faceup in their play area — this is their active mission. If it requires an immediate action (such as placing character tokens on the board), do it now." },

  { ph: 2, exp: "nemesis", t: "Set up the nemesis boards & decks", when: c => c.eoti, src: "Nemesis p.6 (steps 3–5)",
    d: "While the characters set up, each nemesis player: shuffles their personal <b>Nemesis deck</b> and places it to the left of their nemesis board, leaving room for its discard pile directly above; attaches their nemesis piece to a <b>plastic character base</b> and places it on the <b>starting space</b> printed on the nemesis sheet; then slides the nemesis sheet into the nemesis board, inserts the level peg above <b>“Start”</b>, and attaches the <b>floating dial</b> matching the nemesis' attribute — red for Strength, blue for Willpower, yellow for Cunning. Also shuffle the shared <b>Imperium deck</b> and place it facedown near the game board — every nemesis draws from it." },
  { ph: 2, exp: "nemesis", t: "Set nemesis dials & infamy", when: c => c.eoti, src: "Nemesis p.6 (step 6)",
    d: "Each nemesis adjusts the attribute and Life dials to the starting values on the nemesis sheet, and sets the <b>infamy dial to 0</b>. The first nemesis to reach <b>25 infamy</b> wins the game." },
  { ph: 2, exp: "halls", t: "Place the Imperium tokens", when: c => c.eoti && c.solBoard, src: "Halls of Terra p.8–9",
    d: "Place <b>one Imperium token</b> on each space with a text box in the Mars and Holy Terra areas, and <b>two</b> on both the Titan and Luna spaces. (Palace Gates holds a movement box, not a text box — it gets none.) Imperium tokens act as temporary threat icons that affect only nemeses." },

  /* ===================== Phase 3 — Begin the Game ========================== */
  { ph: 3, exp: "base", t: "The oldest player begins", when: c => !c.eoti, src: "Core p.5",
    d: "The oldest player takes the first turn. Turns proceed clockwise around the play area until one player wins." },
  { ph: 3, exp: "nemesis", t: "Turn order with nemeses", when: c => c.eoti, src: "Nemesis p.9",
    d: "Each <b>character</b> takes a turn in clockwise order as normal; then, after every character has gone, each <b>nemesis</b> takes a turn in clockwise order. It is recommended that the nemesis players sit next to each other as a reminder." }
];

/* ---- Key-numbers reference table ------------------------------------------ */
RL.refRows = [
  { k: "Players supported",              v: "2–4",                             when: c => !c.has("nemesis"), src: "Core p.2" },
  { k: "Players supported",              v: "2–6 (5–6 use Nemesis red/black)", when: c => c.has("nemesis"),  src: "Nemesis p.4" },
  { k: "Nemeses at the table",           v: "1 with 3–4 players · 2 with 5–6", when: c => c.eoti,            src: "Nemesis p.5" },
  { k: "Starting influence",             v: "3",                               src: "Core p.4 (step 10)" },
  { k: "Trophy points per level",        v: "6 (excess above multiples of 6 is lost)", src: "Core p.11" },
  { k: "Completed missions per relic",   v: "3 → reveal 2 Relic cards, keep 1",        src: "Core p.11, 18" },
  { k: "Corruption threshold",           v: "6 Corruption cards → corrupted",          src: "Core p.17" },
  { k: "Attribute dials",                v: "min 1 · max 12 (never below starting value)", src: "Core p.6" },
  { k: "Life dial",                      v: "max 12 · at 0 you are vanquished",        src: "Core p.7" },
  { k: "Maximum level",                  v: "12 (further levels → 1 completed mission each)", src: "Core p.14" },
  { k: "Weapons / armour per battle",    v: "1 weapon + 1 armour (equipment unlimited)",      src: "Core p.18" },
  { k: "Charges spent per card",         v: "max 1 charge token per card per turn",           src: "Core p.19" },
  { k: "Nemesis maximum level",          v: "9 (further levels → 1 infamy each)", when: c => c.eoti, src: "Nemesis p.13" },
  { k: "Infamy to win",                  v: "25 (dial range 0–25)",              when: c => c.eoti, src: "Nemesis p.7, 11" },
  { k: "Nemesis tier crossing",          v: "1 infamy or discard 1 trophy / Might / arsenal", when: c => c.eoti, src: "Nemesis p.14" },
  { k: "Gateway arrow crossing",         v: "2 influence + all remaining movement points",    when: c => c.solBoard, src: "Halls of Terra p.4" },
  { k: "Affiliation token as influence", v: "discard 1 → gain 2 influence (not for forced losses)", when: c => c.solBoard, src: "Halls of Terra p.6" },
  { k: "Palace Gates movement box",      v: "3+ affiliations + all remaining movement points → Titanolith", when: c => c.solBoard, src: "Halls of Terra board" }
];
RL.refNotes = [
  "<b>Skill test:</b> roll 1 die + attribute + modifiers vs the target number; equal or greater passes. A natural <b>1 auto-fails</b> (all dice must be 1s if rolling several); a natural <b>6 explodes</b>.",
  "<b>Battle:</b> both sides roll 1 die and add their attribute + modifiers. Higher score wins; the loser loses 1 Life; a tie ends the Engagement phase with the enemy still on the space. Battle rolls of <b>6 explode</b> (no auto-fail).",
  "<b>Component counts:</b> 10 characters, 5 scenarios and 3 Threat decks in the base game; Nemesis adds 2 characters, 4 scenarios and 4 nemeses; Halls of Terra adds 3 characters, 3 scenarios, the orange Threat deck and 1 nemesis.",
  { t: "<b>Skill duel consequences</b> — Strength: loser loses 2 Life · Cunning: winner may steal 1 asset (not relics; charges transfer) · Willpower: winner looks at the loser's Power cards and takes 1 card <i>or</i> 3 influence. The winner may also steal 1 apostate asset (not relics).", when: c => c.has("nemesis") || c.has("halls") }
];

/* ---- Boards & notable-space reference ------------------------------------- */
RL.boards = [
  { id: "outer", name: "Relic board — Outer tier", when: () => true, items: [
    "Four areas of 3–5 spaces: <b>Hive World, Forge World, Death World and Maiden World</b>. Corner spaces belong to no area.",
    "<b>Grey Knight Envoy</b> (corner): buy Power cards for influence, and cross to the Middle tier by resolving its text box.",
    "<b>Battlefleet Antias</b> (corner): buy <b>Wargear cards</b> for their printed influence cost, and cross to the Middle tier.",
    "<b>St. Antias' Sanctuary</b> (corner): <b>vanquished players</b> respawn here; also a crossing point to the Middle tier.",
    "<b>Ultramar Emissary</b> (corner): the fourth corner space." + " In Enemies of the Imperium, nemeses may cross tiers from any of the four corners.",
    "Crossing to the Middle tier ends your Engagement phase immediately — you do not resolve the new space that turn."
  ]},
  { id: "middle", name: "Relic board — Middle tier", when: () => true, items: [
    "Four areas: <b>The Twilight Fringe, Devastated Reaches, Lost Front and Phantom Stars</b>.",
    "<b>Space Hulk</b>: a <b>movement box</b>, resolved the moment you enter (or start your Movement phase) there — and the nemeses' route back to the Outer tier. When you move from one tier to another, you may change your movement direction on entering the new tier.",
    "<b>Blackstone Fortress</b>: buy Power cards for influence.",
    "<b>Apothecarium Sepha</b> and <b>Antian Shrine World</b>: attempt to discard <b>Corruption cards</b>.",
    "<b>Webway Portal</b>: special movement — being moved directly to another space skips everything in between.",
    "<b>Guardian of the Rift</b>: a movement box and the only door to the Inner tier — you need a <b>relic</b> to pass."
  ]},
  { id: "inner", name: "Relic board — Inner tier & scenario space", when: () => true, items: [
    "No areas, no Threat cards. You move <b>one space per turn following the directional arrows</b> — movement die, movement points and movement abilities don't work here, and you can never go back (unless vanquished or corrupted).",
    "<b>Warp Rift</b> (first space): entering ends your Movement phase; its text box skips you ahead 1 space plus 1 per condition you meet (you resolve only the space you land on).",
    "Deeper spaces are brutal text boxes — e.g. <b>Crone World Yllen Satari</b> forces Corruption draws on the way to the centre.",
    "<b>Scenario space</b> (centre): landing here immediately triggers the scenario's <b>Confrontation</b>; you can no longer move, and you re-resolve the Confrontation every Engagement phase until you fulfil the win condition."
  ]},
  { id: "threat", name: "Threat decks", when: () => true, items: [
    "<b>Red</b> deck: mostly Strength enemies with the <b>Ork</b> trait.",
    "<b>Blue</b> deck: mostly Willpower enemies with the <b>Tyranid</b> trait.",
    "<b>Yellow</b> deck: mostly Cunning enemies with the <b>Eldar</b> trait.",
    { t: "<b>Orange</b> deck (Halls of Terra): enemies, encounters, assets and events themed on the Sol System; orange threat icons appear on some spaces in the Mars and Holy Terra areas and work exactly like the other colours. Orange cards carry an orange skull indicator by the trait box.", when: c => c.solBoard },
    "A card's colour is the deck it came from — with mixed backs, the coloured border on the <b>front</b> decides."
  ]},
  { id: "sol", name: "Sol System board — Sol tier", when: c => c.solBoard, items: [
    "Twelve green-shaded spaces forming their own movement loop; normal movement rules apply. Clockwise/anticlockwise effects treat each board as an independent loop.",
    "<b>Titan</b> and <b>Luna</b>: the only two access points to the Relic board, joined by <b>gateway arrows</b> (Titan ↔ Grey Knight Envoy, Luna ↔ Battlefleet Antias). Crossing costs <b>2 influence + all remaining movement points</b> and skips your Exploration and Engagement phases that turn.",
    "<b>Mars area</b> (also a Forge World area): five spaces whose text boxes grant affiliations, wargear and attribute rewards — e.g. the Fabricator General's Palace can reveal a Wargear card you acquire at no cost.",
    "<b>Holy Terra area</b> (also a Hive World area): five spaces including the <b>Scholastia Psykana</b> (Power cards / Willpower) and the <b>Palace Gates</b> — its movement box lets a player with <b>3+ affiliations</b> spend all remaining movement points to move to the Titanolith.",
    "Sol-tier text-box spaces reward <b>affiliations</b>; Titan's Chamber of Trials and Luna's Great Crossroads offer optional challenges and long-range travel."
  ]},
  { id: "palace", name: "Sol System board — Imperial Palace tier", when: c => c.solBoard, items: [
    "Five yellow-shaded spaces that work like the Inner tier: no movement roll, no Threat cards, arrow-directed movement; enter only through the Palace Gates. Every game effect that says “Inner tier” also means the Imperial Palace tier.",
    "<b>Titanolith</b>: landing here ends your Movement phase; its Engagement text box (<i>Petitioner's Plea</i>, test 8 on your highest printed attribute) decides which direction you may proceed next turn — fail and you lose 1 of that attribute and are sent back to the Palace Gates.",
    "<b>Eternity Gate</b> (<i>Cleanse and Purify</i>): lose 1 Life per Corruption card, then test 7 on your lowest printed attribute — pass to gain 1 of it and <b>discard all your Corruption cards</b>; fail and you're sent back to the Titanolith and your Engagement phase ends.",
    "<b>Administratum Archives</b> (<i>Cyclopean Bureaucracy</i>): test 5 using your <b>influence</b> instead of an attribute — fail and you lose an affiliation and are sent back to the Titanolith.",
    "<b>Senate of the High Lords of Terra</b> (<i>The High Lord's Favour</i>): roll 1 die, +1 per affiliation you choose to count — rewards scale up to 1 level and a Relic draw; then move to any Outer/Middle-tier space.",
    "<b>Sanctum Imperialis</b> (<i>The Emperor Provides</i>): gain the <b>Champion card</b> matching one of your affiliations; with 9 affiliations you may move straight to the Daemon World Braxas space in the Inner tier — otherwise move to any Outer/Middle-tier space.",
    "Nemeses cannot enter the Imperial Palace tier."
  ]}
];

/* ---- HOW TO PLAY — concise rules reference -------------------------------- */
/* Items: plain string (always) OR { t, when?, tag?, src? }.                   */
RL.howToPlay = {
  core: [
    { h: "The Game Turn", items: [
      { t: "Each turn the active player resolves four phases in order — then play passes clockwise (the oldest player goes first):", num: true, sub: [
        "<b>Movement</b> — roll 1 die and move <b>exactly</b> that many spaces, clockwise or anticlockwise. You cannot stay put, and cannot reverse once you start. (Inner tier: move 1 space along the arrows instead.)",
        "<b>Exploration</b> — for each threat icon on your space not already matched by a faceup Threat card of its colour, draw one card from that Threat deck onto your space. Threat icons printed on cards add to the count.",
        "<b>Engagement</b> — resolve the Threat cards on your space; if there are none, resolve your space's text box (“Choose One or End Engagement Phase” boxes are optional).",
        "<b>Experience</b> — spend trophies for levels, optionally trade 3 completed missions for a relic, draw a Mission card if you have no active mission, then discard down to your power and asset limits."
      ]},
      { t: "Threat cards on your space resolve in strict order:", num: true, sub: [
        "<b>Events</b> — resolve, then discard.",
        "<b>Enemies</b> — battle each one (losing ends your Engagement phase at once).",
        "<b>Encounters</b> — resolve each once; they stay on the space unless stated otherwise.",
        "<b>Assets</b> — take them all into your play area."
      ]},
      "Cards headed <b>“Special Timing”</b> state their own trigger instead. An enemy with one is still battled normally — the ability just has no effect during the battle."
    ]},
    { h: "Battles", items: [
      "The <b>battle form</b> matches the enemy's attribute colour: <b>red = Strength</b> · <b>blue = Willpower</b> · <b>yellow = Cunning</b>.",
      { t: "Battle sequence:", num: true, sub: [
        "<b>Determine the battle form.</b>",
        "<b>Prepare for battle</b> — declare battle bonuses (max 1 weapon + 1 armour).",
        "<b>Enemy battle roll</b> — made by the player to your left, who may not use their own die abilities.",
        "<b>Your battle roll</b> — rerolls and result-changing abilities happen now.",
        "<b>Determine battle scores</b> — die roll + attribute + modifiers, for each side.",
        "<b>Determine the result</b> — the higher battle score wins.",
        "<b>Apply the consequence</b> — see below."
      ]},
      { t: "The three outcomes:", sub: [
        "<b>Win</b> — take the enemy card as a <b>trophy</b>.",
        "<b>Lose</b> — lose 1 Life, suffer the enemy's printed penalty, and your Engagement phase ends (remaining Threat cards stay unresolved).",
        "<b>Tie</b> — no trophy, no Life lost; your Engagement phase ends and the enemy stays."
      ]},
      "<b>Multiple enemies</b> with the same attribute battle together — one enemy roll plus <i>all</i> their attribute values against your single score. Different attributes fight separate battles, in the order you choose.",
      "A roll of <b>6 explodes</b>: roll another die and add it — cumulatively, without limit. With several dice, each individual 6 explodes (a 5 and a 6 never combine).",
      "Scenario sheets can be battled too: the sheet counts as an enemy for abilities, but has no traits, is not a Threat card and can never be a trophy."
    ]},
    { h: "Skill Tests & Bonuses", items: [
      "“Test Strength 10” = roll 1 die + your Strength + modifiers. <b>Equal or higher passes</b>.",
      "A natural <b>1 automatically fails</b> (with several dice, only if every die shows a 1). A natural <b>6 explodes</b>, just like in battle.",
      "<b>Skill bonuses</b> (plain coloured circle) add to skill tests of that attribute only — declare before rolling.",
      "<b>Battle bonuses</b> (spiked circle) add to battle scores only — declare during Prepare for Battle. A <b>grey battle bonus</b> works in any battle form.",
      { t: "A <b>grey skill bonus</b> (Halls of Terra) can be added to any <i>attribute</i> skill test — but not to tests that don't test an attribute (like a test of your level or influence).", when: c => c.has("halls"), tag: "halls" }
    ]},
    { h: "Power Cards", items: [
      "One-shot hidden abilities. Playing them is always optional and unlimited per turn — but each card gives <b>either</b> its power number <b>or</b> its ability, never both, then is discarded.",
      "Immediately before any movement, battle or skill roll, you may play one and use its <b>power number as the die result</b>. It still counts as a die roll, and a 6 still explodes (you may even substitute the exploded roll). Only one power number per roll.",
      "Your <b>power limit</b> (printed under the level track) grows with levels; it is enforced only during the Discard Excess Cards step of your Experience phase.",
      "Buy more at the <b>Grey Knight Envoy</b> (Outer tier) or <b>Blackstone Fortress</b> (Middle tier): declare how many, pay all the influence, then draw."
    ]},
    { h: "Corruption", items: [
      { t: "When you draw a Corruption card, compare its <b>activation number</b> to your total Corruption cards (including the new one):", sub: [
        "<b>Higher</b> than your total → it stays <b>facedown</b> and inert (but still counts toward your total).",
        "<b>Equal or lower</b> → it <b>activates</b>: place it faceup and resolve it immediately; constant effects persist."
      ]},
      "The more Corruption you hold, the more likely new cards activate. Some are curses, some are gifts — the strongest abilities carry high activation numbers.",
      { t: "At <b>6 Corruption cards</b> (your corruption threshold) you are <b>corrupted</b> and must start a new character:", num: true, sub: [
        "Discard all Power cards, trophies and Corruption cards; return all influence.",
        "Retire the character — no player may use it for the rest of the game.",
        "Take a random unused character sheet (none left = you are eliminated); reset dials, level and starting space.",
        "Everything else — assets, missions, board tokens — carries over to the new character."
      ]},
      "You may choose to lose the game rather than start a new character.",
      "Shed Corruption at the <b>Apothecarium Sepha</b> or <b>Antian Shrine World</b> in the Middle tier.",
      { t: "With the Sol System board, the <b>Eternity Gate</b> can cleanse <i>all</i> your Corruption cards at once.", when: c => c.solBoard, tag: "halls" }
    ]},
    { h: "Missions & Relics", items: [
      "You always work on <b>one active mission</b> (faceup). Meet its objective — at any time, even off-turn — to claim the reward and flip it facedown as a <b>completed mission</b>.",
      "Gain a second Mission card somehow? Keep one, discard the rest. With no active mission, you draw one automatically in your Experience phase.",
      "During your Experience phase, spend <b>3 completed missions</b> → reveal the top 2 Relic cards, keep one, shuffle the other back.",
      "Some rewards grant a completed mission directly: draw it facedown; its reward text does not apply.",
      "<b>Relics</b> are powerful assets — and your ticket in: at least one relic is required to enter the Inner tier."
    ]},
    { h: "Wargear, Assets & Charges", items: [
      "<b>Wargear</b> (weapon / armour / equipment) is bought at <b>Battlefleet Antias</b> for the influence cost printed top-left. All Wargear cards are assets.",
      "<b>Assets</b> work only from your play area and count against your <b>asset limit</b> (enforced at the end of your Experience phase — voluntary discards happen then too).",
      "Weapons and armour work only in battle, never in skill tests: <b>max 1 weapon + 1 armour per battle</b>; equipment is unlimited.",
      "<b>Charges:</b> cards with charge icons arrive with that many charge tokens. Spend at most <b>1 charge per card per turn</b>; when the last token leaves a card, discard it. Effects can add tokens beyond the printed value.",
      "<b>Influence</b> is the currency: start with 3; earn more from battles, missions, level rewards, cards and text boxes."
    ]},
    { h: "Levels & Trophies", items: [
      "Beaten enemies become <b>trophies</b> worth their attribute value in trophy points. In your Experience phase, every <b>6 trophy points</b> spent = 1 level; excess above multiples of 6 is lost.",
      "On gaining a level, move the peg right and collect <b>every reward in the column</b> beneath it, top to bottom — attributes, Life, influence, Power cards, completed missions or your character's special reward.",
      "Maximum level is <b>12</b>; levelling past it grants a completed mission instead."
    ]},
    { h: "Vanquished, Eliminated & Missing Turns", items: [
      { t: "At <b>0 Life</b> you are <b>vanquished</b>:", num: true, sub: [
        "Discard all your Power cards and trophies.",
        "Return all your influence to the supply.",
        "Reset your Life dial to its starting value.",
        "Move your piece to <b>St. Antias' Sanctuary</b>."
      ]},
      "You keep assets, Corruption cards, missions and board tokens. If it happens on your turn, your turn ends.",
      "<b>Missing a turn:</b> tip your piece on its side; your current turn ends at once (skip the Experience phase and limit checks) and you skip all four phases of your next turn. Start/end-of-turn abilities don't trigger.",
      "<b>Eliminated</b> players (usually via scenario rules) remove their piece, discard everything, lose the game and can no longer affect — or be affected by — anything."
    ]},
    { h: "The Inner Tier & Winning", items: [
      "Enter from the <b>Guardian of the Rift</b> — a relic is required. Once inside you can never go back (except by being vanquished or corrupted).",
      "Move <b>1 space per turn along the arrows</b>; movement-modifying effects are dead. No Threat cards — every Engagement phase resolves your space's text box.",
      "The <b>Warp Rift</b> (first space) ends your Movement phase on entry; its box then skips you ahead 1 space, +1 per condition met (level, influence…) — skipped boxes are ignored, the landing box resolves.",
      "Reach the central <b>scenario space</b> and immediately resolve the scenario's <b>Confrontation</b> — then again every Engagement phase. The first player to satisfy the win condition wins.",
      { t: "In Enemies of the Imperium, a nemesis wins instead the moment its <b>infamy reaches 25</b>.", when: c => c.eoti, tag: "nemesis" }
    ]},
    { h: "Timing & Golden Rules", items: [
      "<b>Golden Rule:</b> when a card, sheet or text box conflicts with the rulebook, the card wins. Anything that says you <b>cannot</b> do something beats everything that says you can.",
      "<b>“May”</b> = optional; every other ability is mandatory.",
      "<b>Start</b>-of abilities resolve before everything else in that turn/phase/step; <b>end</b>-of abilities after everything else; <b>during</b> abilities whenever the owner likes in between. Ties are ordered by the active player.",
      "If an effect offers several valid options (including your highest/lowest attribute when tied), the active player chooses.",
      "<b>Special movement</b> granted by a card may still be used this Movement phase even if the card is discarded during the turn — and if you miss a turn, you may use it on your next Movement phase instead. (Mark it with a character token under your piece as a reminder.)",
      "An ability that moves you <b>directly</b> to another space (like the Webway Portal) skips every space in between.",
      "Empty deck? Reshuffle its discard pile. Nothing to reshuffle? That card type can't be drawn. Token supplies are unlimited — substitute anything handy."
    ]}
  ],

  /* Module-specific play (gated by the active expansions / modes). */
  modules: [
    { id: "duels", when: c => c.has("nemesis") || c.has("halls"), h: "Apostates & Skill Duels",
      tag: c => c.has("nemesis") ? "nemesis" : "halls", items: [
      "Everyone starts as a <b>devotee</b>; acquiring an asset with the <b>Apostate</b> trait (yellow-green hue) makes you an <b>apostate</b> — powerful, but fair game.",
      "If the active player ends their Movement phase on a space with an apostate, they may skip their normal Exploration <i>and</i> Engagement phases to fight a <b>skill duel</b> against one apostate there. The challenger can be anyone; the defender must be an apostate. No duels in the Inner tier.",
      { t: "Duel sequence:", num: true, sub: [
        "<b>Challenger picks the attribute</b> — this decides the consequences.",
        "<b>Challenger rolls</b> a skill test of that form vs target 2. Pass → the result (with all modifiers) becomes the <b>challenge value</b>. Fail → the duel ends with no effect.",
        "<b>Defender tests</b> the same attribute against the challenge value. Pass → the defender wins; fail → the challenger wins."
      ]},
      { t: "Consequences, by the chosen attribute:", sub: [
        "<b>Strength</b> — the loser loses 2 Life.",
        "<b>Cunning</b> — the winner may steal 1 of the loser's assets (not relics; charge tokens transfer with the card).",
        "<b>Willpower</b> — the winner looks at the loser's Power cards and takes 1 card <i>or</i> 3 influence."
      ]},
      "Whatever the form, the winner may <i>also</i> steal one of the loser's <b>apostate</b> assets (not relics)."
    ]},
    { id: "nemTurn", when: c => c.eoti, h: "The Nemesis Turn", tag: "nemesis", items: [
      "A nemesis is <b>not a player</b> and <b>not an enemy</b> — card text saying “player” or “enemy” never means a nemesis. Nemeses never read text boxes or vertical cards; characters never read horizontal cards.",
      { t: "The nemesis turn:", num: true, sub: [
        "<b>Movement</b> — normal die movement; never into the Inner tier.",
        "<b>Exploration</b> — on a space with a character it may declare a battle. Otherwise it draws <b>Imperium cards</b> to match the space's threat icons (colour ignored) — or, with no icons and no Imperium cards, draws 1 secret <b>Nemesis card</b>.",
        "<b>Engagement</b> — resolve the battle, the Imperium cards, or the drawn Nemesis card.",
        "<b>Experience</b> — spend trophies (6 points = 1 level; max level 9, then +1 infamy per level) and discard unwanted arsenal/Might cards. There is no hand limit."
      ]},
      { t: "<b>Imperium cards</b> resolve in strict order:", num: true, sub: [
        "<b>Events</b> — resolve, then discard.",
        "<b>Agents</b> — battle them; multiple agents always fight together. Beaten agents are trophies worth their attribute value.",
        "<b>Arsenal</b> — acquire into the nemesis' play area."
      ]},
      { t: "The <b>Nemesis deck</b> holds two kinds of cards:", sub: [
        "<b>Vertical</b> — mimic base-game types (enemy, encounter, corruption, asset). The bold <b>nemesis text</b> resolves once, when drawn; afterwards the card behaves as its printed type.",
        "<b>Horizontal</b> — nemesis-only: <b>Crisis</b> (resolve & discard) · <b>Might</b> (a hidden hand, the nemesis' Power cards — substitutable for its die rolls) · <b>Arsenal</b> (the nemesis' assets)."
      ]},
      "<b>Tier crossing:</b> ending movement on any of the four Outer-tier corners, a nemesis may spend 1 infamy or discard 1 trophy/Might/arsenal to jump to the nearest Middle-tier corner (skipping its Exploration & Engagement that turn); the Space Hulk movement box leads back out.",
      { t: "<b>Vanquished nemesis</b> (0 Life):", num: true, sub: [
        "Discard all its Might cards and trophies.",
        "Lose <b>half its infamy</b>, rounded up.",
        "Reset Life and return to its starting space — arsenal and board tokens stay."
      ]}
    ]},
    { id: "nemBattle", when: c => c.eoti, h: "Battles With a Nemesis", tag: "nemesis", items: [
      "A character ending their Movement phase on a nemesis' space may choose to battle it (and a nemesis may battle a character on its space during its own turn). The battle form is always the <b>nemesis' attribute</b>.",
      { t: "Sequence:", num: true, sub: [
        "Determine the battle form (the nemesis' attribute).",
        "Nemesis prepares for battle — bonuses; 1 weapon + 1 armour.",
        "Nemesis battle roll.",
        "Character prepares — anti-<i>enemy</i> effects don't work (a nemesis isn't an enemy). Skipped when battling an agent.",
        "Character battle roll — or agent battle roll, made by the player to the nemesis' left (no die abilities).",
        "Determine battle scores (including support bonuses).",
        "Determine the result.",
        "Apply the consequence."
      ]},
      "<b>Support bonuses:</b> the nemesis adds +1 per enemy Threat card on its space; a character adds +1 per agent Imperium card on theirs.",
      "Character vs nemesis: the <b>loser loses 1 Life</b>; a tie does nothing. A character who beats a nemesis immediately collects the <b>bounty</b> printed on its nemesis sheet.",
      "Nemesis vs agents: win → trophies + printed rewards; lose → 1 Life, penalties, Engagement ends; tie → the agents stay."
    ]},
    { id: "sol", when: c => c.solBoard, h: "Navigating the Sol System", tag: "halls", items: [
      "The Sol tier is a normal movement loop; each board is its own loop for clockwise/anticlockwise effects.",
      "<b>Gateway arrows</b> (Titan ↔ Grey Knight Envoy, Luna ↔ Battlefleet Antias): crossing costs <b>2 influence + all remaining movement points</b> and skips your Exploration and Engagement phases that turn. Can't pay? Can't cross.",
      "The <b>Imperial Palace tier</b> is entered only through the Palace Gates movement box (3+ affiliations). Inside, follow the arrows one space per turn — the Titanolith's text box sets your direction — and every rule referencing the Inner tier applies here too.",
      { t: "Nemeses move between the boards freely, <b>ignoring gateway arrows</b>, but can never enter the Imperial Palace tier. <b>Imperium tokens</b> on Sol-tier text-box spaces act as temporary threat icons for nemeses only: draw Imperium cards normally, then discard one token from the space (only if a card was actually drawn). A Sol text-box space with no tokens and no Imperium cards yields a Nemesis card draw.", when: c => c.eoti, tag: "nemesis" }
    ]},
    { id: "affiliations", when: c => c.solBoard, h: "Affiliations & Champion Cards", tag: "halls", items: [
      "Nine Imperial <b>affiliations</b> (Adepta Sororitas, Adeptus Arbites, Adeptus Astartes, Adeptus Astra Telepathica, Adeptus Mechanicus, Imperial Guard, Imperial Nobility, Inquisition, Officio Assassinorum). You start with your character's printed affiliation and can hold at most <b>one token of each</b> — gaining a duplicate is ignored.",
      "Whenever you may <b>spend</b> influence, you may discard affiliation tokens at <b>2 influence each</b> — but never to cover a forced influence <i>loss</i>.",
      "The <b>Sanctum Imperialis</b> grants a <b>Champion card</b> matching one of your affiliations: a permanent power that can never be forcibly discarded (nor can its matching token). Champion cards are open information; one of each exists."
    ]}
  ]
};

/* ---- Contextual FAQ — clarifications surfaced for the active setup --------- */
RL.faq = [
  { q: "Which die results explode, and does anything auto-fail?",
    a: "A natural 6 on any battle or skill roll explodes: roll another die and add it, cumulatively and without limit. When rolling several dice, each 6 explodes individually — a 5 and a 6 never combine. A natural 1 automatically fails a <b>skill test</b> only (and only if every die you rolled shows a 1); there is no auto-fail on battle rolls." },
  { q: "Can I use a Power card's number AND its ability?",
    a: "No — one or the other, then discard it. Used as a number, it substitutes for the die result before you roll, still counts as a die roll for abilities, and a power number of 6 explodes normally (you can even substitute a Power card for an exploded die's roll). Only one power number per roll, but there's no limit on Power cards per turn." },
  { q: "How many charges can I spend from one card?",
    a: "One charge token per card per turn, maximum. When the last charge token leaves a card, the card is discarded immediately." },
  { q: "Do I keep anything when I'm vanquished or corrupted?",
    a: "Vanquished: you lose Power cards, trophies and influence, but keep assets, Corruption cards, missions and any character tokens on the board. Corrupted: as above plus your Corruption cards are discarded and the character is retired for the entire game — the replacement character inherits everything that remains." },
  { q: "A deck ran out — what now?",
    a: "Shuffle its discard pile into a new facedown deck. If there's no discard pile either, that card type simply can't be drawn. Charge, influence and character token supplies are unlimited — substitute coins or anything handy." },
  { q: "What colour is a Threat card with a different back?",
    a: "The coloured border on the card's <b>front</b> decides its colour, not its back.",
    when: c => c.has("nemesis") || c.has("halls") },
  { q: "My weapon's exploding dice reduced me to 0 Life mid-battle (Neuro Disruptor / Scissorhand / Chaos Chain Axe) — who won?",
    a: "Nobody. You are vanquished and immediately sent to St. Antias' Sanctuary; the battle is treated as if it never happened — neither won nor lost — and all enemies remain on their space.",
    when: c => c.has("nemesis") },
  { q: "Does Kineblades count a Power card I just played?",
    a: "No. Kineblades adds +1 per Power card you <b>have</b>. A Power card substituted for your battle roll has been played — you no longer have it, so it doesn't count.",
    when: c => c.has("nemesis") },
  { q: "Can other players steal the Eversor Assassin's trophies?",
    a: "Yes — its trophies are also assets (for everyone). Win a Cunning skill duel against the Eversor Assassin and you may take one of its trophies as the stolen asset.",
    when: c => c.has("nemesis") },
  { q: "Is a nemesis a player? An enemy?",
    a: "Neither. Card text referring to a “player” skips nemeses entirely (e.g. “the player to your left” passes over a nemesis player), and abilities that target “enemies” — like evasion — can never be used against a nemesis.",
    when: c => c.eoti },
  { q: "The Imperial Guardsman agent makes me draw another Imperium card — every time?",
    a: "Yes. A nemesis must draw an additional Imperium card each time it resolves the Imperial Guardsman's special timing ability.",
    when: c => c.eoti },
  { q: "Where do Nemesis-deck cards go when discarded?",
    a: "Cards are always discarded to the pile matching their card <b>back</b>, not their front — so anything from a Nemesis deck goes back to that nemesis' own discard pile.",
    when: c => c.eoti },
  { q: "Luxuria handed a character a Corruption card — how is it tracked?",
    a: "Her Corruption cards have different backs than the Corruption deck's, so keep them near your other facedown Corruption cards or mark them with a character token as a reminder. (If Luxuria gives one to the Ultramarines Captain or the Canoness, that character flips it facedown.)",
    when: c => c.eoti },
  { q: "Does Githellion gain infamy when a corrupted player discards Corruption cards?",
    a: "No — Corruption cards discarded because a player was corrupted and starts a new character grant Githellion Ath'ulwei no infamy.",
    when: c => c.eoti },
  { q: "Moarn's Berserker Rage in Dark Alliance?",
    a: "Moarn Goreheart cannot move to a teammate's space in Dark Alliance, so Berserker Rage targets the closest eligible non-teammate character instead.",
    when: c => c.eoti },
  { q: "Master Collector: what happens to Inner-tier spaces holding character tokens?",
    a: "They're treated as if they don't exist: you can't place tokens there, they aren't counted when moving, and the Warp Rift's skip passes over them — e.g. a token on Crone World Yllen Satari plus 8 influence spent at the Warp Rift lands you directly on Daemon World Braxas.",
    when: c => c.has("nemesis") },
  { q: "Hulk of the Wayward Warrior: do scenario-deck trophies work normally?",
    a: "Trophies you collect from the Confrontation may be spent for levels as usual — when spent, return them to their normal discard piles or back onto the scenario deck, your choice. If the scenario deck is ever empty, you simply place a character token on the sheet during your Engagement phase.",
    when: c => c.has("nemesis") },
  { q: "I can't afford a gateway arrow — can I still cross to the Sol System board?",
    a: "No. Without 2 influence and at least the movement points remaining to spend, you cannot move between spaces connected by a gateway arrow. (Nemeses ignore gateway arrows entirely.)",
    when: c => c.solBoard },
  { q: "Can a grey skill bonus help on the Maze of Tzeentch?",
    a: "No — the grey skill bonus adds only to skill tests of an <b>attribute</b>. Tests of something else (your level, your influence) get no help from it.",
    when: c => c.has("halls") },
  { q: "Can affiliation tokens pay off a forced influence loss?",
    a: "No. Discarding an affiliation token for 2 influence works only when you may <b>spend</b> influence — never when a game effect forces you to lose it.",
    when: c => c.solBoard },
  { q: "Can anything make me discard my Champion card?",
    a: "No. Champion cards — and the affiliation tokens matching them — can never be forcibly discarded. If you're removed from the game, your Champion cards leave with you.",
    when: c => c.solBoard }
];


/* ---- TEACHING SCRIPT (read aloud, ~5 min; content per the Relic rulebook and
   expansion rulebooks — see the setup citations above) ----------------------- */
RL.teach = {
  intro: "Read this aloud — about five minutes. Servo-skulls down until the end.",
  sections: [
    { h: "The pitch — and how you win", body: (c) => `
<p>The Antian Sector is bleeding Chaos from a Warp rift, and each of us is an agent of the Imperium racing to be the one who seals it. The board is three concentric tiers. Grow strong in the <b>Outer</b> tier, prove yourself in the <b>Middle</b>, then breach the <b>Inner</b> tier and complete the <b>Scenario</b> at the center — that wins the game.</p>
<p>The toll gate: entering the Inner tier takes a <b>Relic</b>, and a Relic costs <b>three completed Missions</b>. Missions are the spine of your whole game — always have one running.</p>` },

    { h: "Your turn — move, fight, grow", body: (c) => `
<p>Roll a die and spend that many moves along your tier, clockwise or anticlockwise — you're choosing which space to <b>end</b> on, because then you draw <b>Threat cards</b> matching your space's colored icons: enemies, events, and loot.</p>
<p><b>Battles</b>: every enemy fights in one of three languages — <b>Strength</b>, <b>Willpower</b> or <b>Cunning</b>. Both sides roll a die and add their attribute; high score wins. Win and the enemy becomes a <b>trophy</b> worth points equal to its attribute. Lose and you take wounds. Choose fights your character's numbers can speak.</p>` },

    { h: "Levelling — the engine", body: (c) => `
<p>At the end of your turn, spend <b>six trophy points</b> to gain a <b>level</b>: levels raise your attributes and unlock your character's ability track. That's the loop — fight what you can beat, cash trophies, get bigger, fight bigger. <b>Wargear</b> and <b>Power cards</b> tilt the odds; <b>influence</b> is the currency that greases everything.</p>
<p>Two ways to fall: run out of <b>Life</b> and you're vanquished — you lose your gear and restart bruised. Collect too many <b>Corruption cards</b> (usually six) and Chaos takes you entirely: new character, from scratch. Some rewards are worth a little corruption. Some.</p>` },

    { h: "Enemies of the Imperium", when: (c) => c.eoti, body: () => `
<p>We're playing <b>Enemies of the Imperium</b>: one or more of us are <b>Nemeses</b> — playable villains with their own dark missions, racing the loyalists to the center. Same engine, opposite prayers.</p>` },

    { h: "The Nemesis expansion", when: (c) => c.has("nemesis") && !c.eoti, body: () => `
<p>With <b>Nemesis</b> in the mix: up to six players, <b>duels</b> when agents collide (apostate wargear changes hands), and nastier scenarios. Watch your back in shared spaces.</p>` },

    { h: "Halls of Terra", when: (c) => c.has("halls"), body: () => `
<p><b>Halls of Terra</b> adds the Sol board — a politically lethal detour toward the Imperial Palace with its own orange Threat deck, <b>affiliations</b> and Champions. Different dangers: fewer claws, more knives.</p>` },

    { h: "Don't worry about these yet", body: (c) => `
<p>I'll explain individual Power cards, scenario special rules and Wargear as they surface. Opening advice: never travel without an active <b>Mission</b>, and read the threat icons before you end your move — the board tells you exactly what kind of trouble each space sells.</p>` }
  ]
};
