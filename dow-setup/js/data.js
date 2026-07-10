/* =============================================================================
   Dead of Winter — Setup & Reference Utility
   Data model: game sets (base / The Long Night / Warring Colonies), optional
   modules & variants, and a single precedence-aware setup sequence.

   The setup is ONE ordered list of steps that follows the base game's 14
   numbered setup steps (Rulebook p.6-7). Each step is tagged with the set it
   comes from. The Long Night restates the base rules with modifications, so
   when it is in play its wording governs. The Warring Colonies variant
   (colony vs colony, 4-11 players) replaces the standard setup and round
   order entirely; its steps live in the same phase list, filtered by `when`.
   ============================================================================= */

const DW = {};

/* ---- Game sets ------------------------------------------------------------ */
DW.expansions = [
  { id: "base", name: "Dead of Winter: A Crossroads Game", short: "Base Game", kind: "base",
    blurb: "The 2014 original. A colony of survivors, a main objective, secret objectives, possible betrayers, crossroads cards, and a brutal winter. 2-5 players." },
  { id: "longnight", name: "Dead of Winter: The Long Night", short: "The Long Night", kind: "base",
    blurb: "Standalone expansion — playable on its own or combined with the base game. Adds the Graveyard, despair, unruly helpless survivors, explosive traps, the first-player vote, and three optional modules: Improvements, Bandits, and Raxxon. 2-5 players." },
  { id: "wc", name: "Dead of Winter: Warring Colonies", short: "Warring Colonies", kind: "expansion",
    blurb: "Expansion (needs Base and/or Long Night). Adds cross-compatible crossroads, crisis and survivor cards plus the Random Items module — and, if you own BOTH other sets, the colony-vs-colony Warring Colonies variant for 4-11 players." }
];

/* Display metadata for the source tag shown on every step. Modules, scenarios
   and variants get their own tags — they never hide behind their parent set. */
DW.expMeta = {
  base:         { name: "Base Game",  cls: "e-base" },
  longnight:    { name: "Long Night", cls: "e-ln"   },
  wc:           { name: "Warring Colonies", cls: "e-wc" },
  variant:      { name: "Variant",    cls: "e-var"  },
  improvements: { name: "Improvements Module", cls: "e-mod" },
  bandits:      { name: "Bandits Module",      cls: "e-mod" },
  raxxon:       { name: "Raxxon Module",       cls: "e-mod" },
  scenario:     { name: "Scenario",            cls: "e-mod" },
  randomitems:  { name: "Random Items Module", cls: "e-mod" },
  lonewolf:     { name: "Lone Wolf",           cls: "e-mod" },
  quickplay:    { name: "Quick Play",          cls: "e-mod" }
};
DW.precedence = { base: 0, longnight: 1, wc: 2 };

/* ---- Optional modules & variants -------------------------------------------
   `type`     groups the chip in the configurator.
   `requires` = set id, or array (any-of). `requiresAll` = array (all-of).
   `excludes` = other module ids turned OFF when this one is turned on.
   `implies`  = other module ids turned ON  when this one is turned on.
   `minPlayers` = minimum player count for the module to be available.        */
DW.modules = [
  /* --- Game mode --- */
  { id: "wcvariant", name: "Warring Colonies variant (colony vs colony)", type: "mode",
    requires: "wc", requiresAll: ["base", "longnight", "wc"], minPlayers: 4,
    excludes: ["coop", "betrayer", "hardcore", "elimination", "improvements", "bandits", "raxxon", "chimpcode", "banditblitz", "randomitems"],
    summary: "4-11 players. Two colonies share the same town and clash over resources and territory.",
    description: "The full team-vs-team mega-game. Requires components from BOTH Dead of Winter and The Long Night (see the Collection List, Warring Colonies rulebook p.6). Two colonies, simultaneous turns with a sand timer, colony combat with tactics cards and bullets, and no betrayers. With an odd player count one player is the Lone Wolf. 4-11 players." },

  /* --- The Long Night modules --- */
  { id: "improvements", name: "Improvements", type: "lnmodule", requires: "longnight", excludes: ["wcvariant"],
    summary: "Build colony improvements by placing advancement tokens; completed improvements grant ongoing effects.",
    description: "Adds the improvement deck plus the crisis, survivor, crossroads and objective cards marked with the hammer icon. Draw 4 improvements face up near the colony; items and game effects add advancement tokens, and an improvement with enough tokens becomes active (Long Night rules p.17)." },
  { id: "bandits", name: "Bandits", type: "lnmodule", requires: "longnight", excludes: ["wcvariant"],
    summary: "Hostile NPC bandits appear from crisis cards, occupy survivor spaces, and steal from search decks.",
    description: "Adds the Bandits' Hideout location, bandit standees, and the cards marked with the bandit icon. Bandits are placed by crisis cards, count as survivors when adding zombies, and scavenge a card from their location's search deck each round. Attack them like a survivor with attack value 4 (Long Night rules p.17)." },
  { id: "raxxon", name: "Raxxon", type: "lnmodule", requires: "longnight", excludes: ["wcvariant"],
    summary: "The Raxxon Pharmaceutical facility: great loot, pill side effects, and terrifying special zombies.",
    description: "Adds the Raxxon location with its own search deck, the Raxxon experiments deck (Audio Logs side up), the side effect deck, and the cards marked with the skull-and-crossbones icon. Searching at Raxxon forces an exposure roll; failing to match the containment code unleashes special zombies (Long Night rules p.18)." },

  /* --- The Long Night introductory scenarios --- */
  { id: "chimpcode", name: "Scenario: The Chimp and the Code", type: "scenario", requires: "longnight",
    implies: ["raxxon"], excludes: ["banditblitz", "wcvariant", "coop"],
    summary: "Story-driven intro to the Raxxon module (Special Objectives R1-R3). Learn the rules as you play.",
    description: "The recommended first taste of Raxxon. Uses Special Objective cards R1-R3 instead of a normal main objective, with read-aloud story sections. Raxxon starts fully barricaded; Blue and Emma Han are set aside during setup (Long Night rules p.20-21)." },
  { id: "banditblitz", name: "Scenario: Bandit Blitz", type: "scenario", requires: "longnight",
    implies: ["bandits"], excludes: ["chimpcode", "wcvariant", "coop"],
    summary: "Story-driven intro to the Bandits module (Special Objectives B1-B3) with the unique Bandit Betrayal.",
    description: "The recommended first taste of Bandits. Uses Special Main Objective cards B1-B3 with read-aloud story sections and a special exile phase. The betrayal secret objective dealt is the unique BANDIT BETRAYAL card (Long Night rules p.22-23)." },

  /* --- Warring Colonies modules --- */
  { id: "randomitems", name: "Random Items module", type: "wcmodule", requires: "wc", excludes: ["wcvariant"],
    summary: "Seed 5 random item cards into each location deck for more variety in standard games.",
    description: "For standard (non-Warring-Colonies-variant) games: remove the crosshairs-marked cards from the Random Items deck, shuffle it, then add 5 cards to each location's item deck and reshuffle (Warring Colonies rulebook p.15). In the Warring Colonies variant this already happens during setup." },
  { id: "quickplay", name: "Quick Play (WC)", type: "wcmodule", requires: "wc", requiresAll: ["base", "longnight", "wc"],
    summary: "Warring Colonies only: ONE shared 2-minute timer for the whole simultaneous actions step.",
    description: "Speeds up the Warring Colonies variant: after both players have moved their survivors, flip the sand timer — both players have 2 minutes TOTAL to complete all actions (Warring Colonies rulebook p.15). Select the Warring Colonies variant to use this." },

  /* --- Standard-game variants (base & Long Night rulebooks p.15) --- */
  { id: "coop", name: "Co-op variant", type: "variant", requires: ["base", "longnight"],
    excludes: ["betrayer", "hardcore", "wcvariant", "chimpcode", "banditblitz"],
    summary: "Fully cooperative: hardcore objective side, no secret objectives, no exile votes.",
    description: "Play cooperatively: use the hardcore side of the main objective and do not assign secret objectives — everyone's only goal is the main objective. No votes to exile. During setup remove every card showing the non-co-op symbol (bottom right corner). Playing with exactly 2 players always uses these rules (Rulebook p.15)." },
  { id: "betrayer", name: "Betrayer variant", type: "variant", requires: ["base", "longnight"], excludes: ["coop", "wcvariant"],
    summary: "Deal only 1 non-betrayal secret objective per player, greatly raising the odds of a betrayer.",
    description: "During setup, set aside only 1 non-betrayal secret objective per player (instead of 2) before adding the 1 betrayal card — a much higher chance someone at the table is working against the colony (Rulebook p.15)." },
  { id: "hardcore", name: "Hardcore variant", type: "variant", requires: ["base", "longnight"], excludes: ["coop", "wcvariant"],
    summary: "Play the normal game, but use the hardcore side of the main objective.",
    description: "For a greater challenge, play the standard (secret objectives) game but use the hardcore side of the main objective card (Rulebook p.15)." },
  { id: "elimination", name: "Player Elimination variant", type: "variant", requires: ["base", "longnight"], excludes: ["wcvariant"],
    summary: "Lose your last survivor and you're out of the game — no replacement survivor.",
    description: "If a player's last remaining survivor would be killed or otherwise lost, remove all cards in their hand from the game; that player is out. (Normally they would draw a fresh survivor and continue.) (Rulebook p.15)." },
  { id: "mature", name: "Remove mature crossroads", type: "variant", requires: ["base", "longnight", "wc"],
    summary: "Set aside the crossroads cards with mature themes (marked with the mature symbol).",
    description: "Some crossroads cards have mature themes — sex, language, suicide, alcohol use, etc. — and are marked with the mature symbol. Remove them from the crossroads deck before play if your group prefers (Rulebook p.6). The Long Night also packs its 9 adult-only crossroads separately." }
];

/* Module type metadata — order and label in the configurator. */
DW.moduleTypes = [
  { id: "mode",     label: "Game mode", note: "Default is the standard game with secret objectives & a possible betrayer." },
  { id: "lnmodule", label: "Long Night modules", note: "Mix in any combination — each adds its own cards and rules." },
  { id: "scenario", label: "Long Night intro scenarios", note: "Story-driven teaching scenarios. Pick at most one; it replaces the main objective." },
  { id: "wcmodule", label: "Warring Colonies extras", note: "Random Items works in standard games; Quick Play needs the Warring Colonies variant." },
  { id: "variant",  label: "Variants", note: "Optional rule tweaks from the rulebooks." }
];

/* ---- THE UNIFIED SETUP SEQUENCE ------------------------------------------ */
/* Each step: { ph, exp, t, d, src, when }
     ph   = phase index (visual grouping)
     exp  = source set tag (string or (c)=>string)
     when = (c) => boolean, with c = { has(set), p, mod(id), wc, loneWolf,
              coopRules, twoPlayer, combined, lnRules }                        */
DW.phases = [
  "1 · Board & Locations",
  "2 · Main Objective",
  "3 · Secret Objectives",
  "4 · Decks & Item Cards",
  "5 · Survivors & First Player",
  "6 · Modules & Final Touches"
];

/* Tag helper: prefer the Long Night wording tag when it's on the table. */
const _core = c => (c.has("longnight") ? "longnight" : "base");

DW.setup = [
  /* ======================= STANDARD GAME ================================== */
  /* -- Phase 0: Board & Locations -- */
  { ph: 0, exp: "base", when: c => !c.wc && !c.has("longnight"), src: "Rulebook p.6 (step 1)",
    t: "Lay out the colony & the 6 locations",
    d: "Place the colony board in the center of the play area and arrange the 6 location cards around it (Police Station, Grocery Store, School, Library, Hospital, Gas Station) — as shown on p.7 or however best fits your table." },
  { ph: 0, exp: "longnight", when: c => !c.wc && c.has("longnight"), src: "Long Night rules p.6 (step 1)",
    t: "Lay out the colony, the 6 locations & the Graveyard",
    d: "Place the colony board in the center and arrange the 6 standard location cards and the <b>Graveyard</b> around it. The Graveyard just organizes dead survivors' cards and standees — it has no gameplay effect beyond certain crossroads cards. (Raxxon and the Bandits' Hideout are added only by their modules — see phase 6.)" },
  { ph: 0, exp: "longnight", when: c => !c.wc && c.combined, src: "Long Night rules p.16 (Preparing for the Long Night)",
    t: "Combining Base + Long Night: pick your components",
    d: "Any cards and components from both sets may be mixed as desired. Start from the cards marked with the set icon you're basing the game on, then add what you like from the other box. <b>Whenever location search decks are combined from more than one set, shuffle each location's cards together and deal 20 facedown to form that location's deck; remove the undealt cards from the game.</b> Note this can swing difficulty — curate to taste." },
  { ph: 0, exp: _core, when: c => !c.wc, src: "Rulebook p.6 (step 2)",
    t: "Hand out player reference sheets",
    d: "Each player takes a player reference sheet. It holds your group leader (face up), your secret objective (face down), your following, and your unused/used action dice pools." },

  { ph: 0, exp: "wc", when: c => c.wc, src: "Warring Colonies rulebook p.4 (steps 1-2)",
    t: "Collect components & lay out TWO colonies",
    d: "Gather the items on the <b>Collection List</b> (WC rulebook p.6) from your Dead of Winter and Long Night sets and combine them with the Warring Colonies contents. Place <b>2 colony boards</b>, the 6 location boards and the Graveyard around the table, then place the <b>Combat Tracker</b> so the yellow and blue sides each face a colony. Do not use Raxxon, the Bandits' Hideout, or Improvements-module tokens." },
  { ph: 0, exp: "wc", when: c => c.wc, src: "Warring Colonies rulebook p.4 (step 3)",
    t: "Hand out the Warring Colonies reference sheets",
    d: "Each player takes one of the NEW reference sheets from the Warring Colonies set — the round order and available actions have changed (no Attack-a-Survivor, Attract, Move-a-Survivor or Vote-to-Exile actions; new Colony Combat, bullets and Elect Colony Leader steps)." },
  { ph: 0, exp: "wc", when: c => c.wc, src: "Warring Colonies rulebook p.4 (step 5)",
    t: "Split into two colonies" + "",
    d: "Divide evenly into teams, each team sitting around its own colony board. With an odd number of players, one player is the <b>Lone Wolf</b> (see phase 6)." },

  /* -- Phase 1: Main Objective -- */
  { ph: 1, exp: _core, when: c => !c.wc && !c.mod("chimpcode") && !c.mod("banditblitz"), src: "Rulebook p.6 (step 3)",
    t: "Choose the main objective",
    d: c => `Pick a standard main objective together or draw 1 at random, place it on its space on the colony board, and follow its printed SET UP box (starting morale, starting round, zombies to add). ${c.has("longnight") ? "First game of The Long Night? The rulebook suggests <b>Tribute</b>." : "First game? The rulebook suggests <b>We Need More Samples</b>."}` },
  { ph: 1, exp: "variant", when: c => !c.wc && (c.mod("hardcore") || c.coopRules) && !c.mod("chimpcode") && !c.mod("banditblitz"), src: "Rulebook p.15 (Variants)",
    t: c => c.twoPlayer && !c.mod("coop") ? "2-player rules: use the HARDCORE side of the main objective"
          : "Use the HARDCORE side of the main objective",
    d: c => c.twoPlayer && !c.mod("coop")
      ? "The rulebook requires 2-player games to use the co-op rules, so flip the main objective to its hardcore side — that's the side co-op is balanced around."
      : c.mod("coop")
      ? "Your game uses co-op rules, so flip the main objective to its hardcore side — that's the side co-op is balanced around."
      : "Hardcore variant: flip the main objective to its hardcore side for a tougher setup (lower starting morale/rounds, more zombies)." },
  { ph: 1, exp: "scenario", when: c => c.mod("chimpcode"), src: "Long Night rules p.20",
    t: "Scenario setup — The Chimp and the Code",
    d: "Instead of a normal main objective, use <b>Special Objective card R1</b>. Set up as a Raxxon-module game with these changes: place barricades on EVERY entrance and survivor space at Raxxon (survivors may not move there yet); do NOT use the pill or containment-code rules yet; remove <b>Blue</b> and <b>Emma Han</b> from the survivor deck and set them aside. One player reads the opening story aloud — the scenario tells you when each Raxxon rule comes online (R1 → R2 → R3)." },
  { ph: 1, exp: "scenario", when: c => c.mod("banditblitz"), src: "Long Night rules p.22",
    t: "Scenario setup — Bandit Blitz",
    d: "Instead of a normal main objective, use <b>Special Main Objective card B1</b>. Set up as a Bandits-module game, but when building the secret objective stack use the unique <b>BANDIT BETRAYAL</b> card as the 1 betrayal objective (you may read it aloud before shuffling it in). One player reads the opening story aloud; apply only the Reveal Crisis, Bandits Scavenge and Adding Zombies bandit rules until the story unlocks the rest (B1 → B2 → B3)." },
  { ph: 1, exp: "wc", when: c => c.wc, src: "Warring Colonies rulebook p.4 (step 4)",
    t: "Choose a Warring Colonies main objective",
    d: "Pick one of the 4 Warring Colonies main objectives (or draw randomly) and place it near the play area — <b>both colonies share the same main objective</b>. Follow its SET UP box (e.g. Divide and Conquer: morale 4, round track 4, a barricade at each non-colony location, 12 zombies at each colony, 3 bullets in each supply)." },

  /* -- Phase 2: Secret Objectives -- */
  { ph: 2, exp: _core, when: c => !c.wc && !c.coopRules && !c.mod("betrayer") && !c.mod("banditblitz"), src: "Rulebook p.6 (step 4)",
    t: "Build & deal the secret objectives",
    d: c => `Shuffle the non-betrayal secret objectives and set aside <b>2 per player</b> face down (${2 * c.p} cards). Shuffle the betrayal secret objectives and add <b>1</b> of them face down. Shuffle the ${2 * c.p + 1} set-aside cards together and deal 1 to each player; return the rest to the box unseen. You may NOT reveal your secret objective. There may or may not be a betrayer at your table.` },
  { ph: 2, exp: "variant", when: c => !c.wc && c.mod("betrayer") && !c.coopRules, src: "Rulebook p.15 (Betrayer variant)",
    t: "Betrayer variant: deal riskier objectives",
    d: c => `Set aside only <b>1</b> non-betrayal secret objective per player (${c.p} cards) plus 1 betrayal card, shuffle, and deal 1 to each player — the odds of a betrayer are now much higher.` },
  { ph: 2, exp: "scenario", when: c => c.mod("banditblitz"), src: "Long Night rules p.22",
    t: "Deal secret objectives with the BANDIT BETRAYAL",
    d: c => `As normal, set aside 2 non-betrayal secret objectives per player (${2 * c.p} cards) — but the 1 betrayal card added is the unique <b>BANDIT BETRAYAL</b>. Shuffle and deal 1 to each player. The bandit betrayer needs Special Objective B2 completed to win, so they'll help the colony get at least that far.` },
  { ph: 2, exp: "variant", when: c => !c.wc && c.coopRules, src: "Rulebook p.15 (Co-op / 2-player variants)",
    t: c => c.twoPlayer && !c.mod("coop") ? "2-player rules: co-op — no secret objectives" : "Co-op: no secret objectives",
    d: c => (c.twoPlayer && !c.mod("coop") ? "<b>The rulebook requires that 2-player games use the co-op rules — this isn't optional.</b> " : "") +
       "Do not assign secret objectives — every player's only objective is the main objective. There is no betrayer and no voting to exile. During setup, remove from the game every card showing the non-co-op symbol in its bottom right corner." },
  { ph: 2, exp: "wc", when: c => c.wc, src: "Warring Colonies rulebook p.4 (step 6)",
    t: "Deal Warring Colonies secret objectives",
    d: "Shuffle the (crosshairs-marked) secret objective cards and deal 1 to each player; return the rest to the box unseen. You cannot reveal yours. <b>There are no betrayal secret objectives in the Warring Colonies variant</b> — the enemy is across the table. (Per the Collection List, the 'Justice' and 'Us or Them' objectives are removed.)" },

  /* -- Phase 3: Decks & Item Cards -- */
  { ph: 3, exp: _core, when: c => !c.wc, src: "Rulebook p.6 (steps 5-6)",
    t: "Build the crisis, survivor, exile & crossroads decks",
    d: c => "Shuffle the crisis cards onto their space on the colony board. Shuffle the survivor deck, the exiled-objective deck and the crossroads deck and place them beside the board." +
       (c.mod("mature") ? " You chose to <b>remove the mature-themed crossroads</b> (marked with the mature symbol) — set them aside now." : " (Crossroads cards with mature themes are marked with a symbol; remove them first if your group prefers.)") },
  { ph: 3, exp: _core, when: c => !c.wc, src: "Rulebook p.6 (step 7)",
    t: "Deal starting items",
    d: c => c.twoPlayer
      ? "2-player variant: shuffle the starter item cards and deal <b>7</b> to each player (instead of 5). Return the rest to the box."
      : "Shuffle all the starter item cards and deal <b>5</b> to each player. Return the rest to the box." },
  { ph: 3, exp: _core, when: c => !c.wc, src: "Rulebook p.6 (step 8)",
    t: "Build each location's item deck",
    d: c => "Separate the remaining item cards by the location printed at their bottom, shuffle each deck, and place it on its location card." +
       (c.combined ? " <b>Combined sets:</b> where a location has cards from both boxes, shuffle them together and deal 20 facedown as that location's deck; remove the undealt cards." : "") },
  { ph: 3, exp: "randomitems", when: c => !c.wc && c.mod("randomitems"), src: "Warring Colonies rulebook p.15 (Random Items module)",
    t: "Random Items module: spice up the decks",
    d: "Remove all crosshairs-marked cards from the Random Items deck and shuffle it. Add <b>5 random item cards to each location's item deck</b>, then reshuffle those decks." },
  { ph: 3, exp: "wc", when: c => c.wc, src: "Warring Colonies rulebook p.4 (steps 7-11)",
    t: "Build the decks: crisis, survivors, crossroads, items & tactics",
    d: c => `Shuffle the <b>Warring Colonies crisis deck</b> (a joint crisis both colonies contribute to) and place it centrally. Shuffle the survivor deck and the crossroads deck${c.mod("mature") ? " (mature-marked crossroads removed)" : ""}. Deal <b>${c.p === 11 ? "4" : "5"} starter items</b> to each player${c.p === 11 ? " (11-player game: 4 each)" : ""}. Build each location's item deck, add <b>5 Random Item cards to each</b>, and shuffle. Place a set of <b>5 tactics cards at each colony</b>. The optional crossroads list on p.6 adds variety at the cost of setup time.` },

  /* -- Phase 4: Survivors & First Player -- */
  { ph: 4, exp: _core, when: c => !c.wc, src: "Rulebook p.7 (steps 9-12)",
    t: "Draft survivors & pick group leaders",
    d: c => (c.twoPlayer
      ? "2-player variant: deal <b>4 survivor cards</b> to each player; each keeps <b>3</b> and returns the rest. Re-shuffle the survivor deck."
      : "Deal <b>4 survivor cards</b> to each player; each keeps <b>2</b> and returns the rest. Re-shuffle the survivor deck.") +
      " Each player makes one kept survivor her <b>group leader</b> (face up on the reference sheet); the other(s) go to her following below the sheet. Add every drafted survivor's standee to the dashed circles in the colony's Colony Occupants section." },
  { ph: 4, exp: _core, when: c => !c.wc, src: "Rulebook p.7 (steps 13-14)",
    t: "Tokens within reach; highest influence goes first",
    d: "Separate the remaining standees and tokens within easy reach of all players. The player whose <b>group leader has the highest influence value</b> takes the first player token and the first turn. Use the blue marker for morale and the red marker for rounds, set from the main objective." },
  { ph: 4, exp: "wc", when: c => c.wc, src: "Warring Colonies rulebook p.5 (step 12)",
    t: "Draft survivors & pick group leaders",
    d: c => (c.p <= 5
      ? "4-5 player game: deal <b>5 survivor cards</b> to each player; each keeps <b>3</b>."
      : "Deal <b>4 survivor cards</b> to each player; each keeps <b>2</b>.") +
      " Re-shuffle the survivor deck. Each player makes one kept survivor her group leader and places the rest in her following, then places her survivor standees in <b>her own colony</b>. (Per the Collection List you may remove Anneleigh Chan, Blue, Melissa Gupta and Jamie Gilmour.)" },
  { ph: 4, exp: "wc", when: c => c.wc, src: "Warring Colonies rulebook p.5 (steps 14-15)",
    t: "Tokens within reach; elect the first colony leaders",
    d: "Separate the remaining standees and tokens within reach. In each colony, the player whose group leader has the <b>highest influence among that colony's leaders</b> takes their colony's <b>colony leader token</b> (the first player tokens) and takes the first turn. Colony leaders play tactics cards and bid bullets in combat, and are re-elected every round." },

  /* -- Phase 5: Modules & Final Touches -- */
  { ph: 5, exp: "improvements", when: c => !c.wc && c.mod("improvements"), src: "Long Night rules p.17 (Improvements module)",
    t: "Improvements module setup",
    d: "Add the crisis, survivor, crossroads and objective cards marked with the <b>hammer icon</b> to their decks. Shuffle the improvements deck and draw <b>4 improvement cards face up</b> in a row near the colony. During play, advancement tokens accumulate on them; an improvement with tokens ≥ its printed number becomes active — mark it in the center of the colony blueprint." },
  { ph: 5, exp: "bandits", when: c => !c.wc && c.mod("bandits"), src: "Long Night rules p.17 (Bandits module)",
    t: "Bandits module setup",
    d: "Add the cards marked with the <b>bandit icon</b> to their decks. Add the <b>Bandits' Hideout</b> location to the play area (it has NO search deck) and place the bandit standees near it. Crisis cards now show bandit placement numbers; if you use base-game crisis cards without them, place 2 bandits at random locations when such a crisis is revealed (or skip placement for an easier game)." },
  { ph: 5, exp: "raxxon", when: c => !c.wc && c.mod("raxxon"), src: "Long Night rules p.18 (Raxxon module)",
    t: "Raxxon module setup",
    d: "Add the cards marked with the <b>skull-and-crossbones icon</b> to their decks. Add the <b>Raxxon location</b> and set up its search deck normally. Shuffle the <b>Raxxon experiments deck</b> and place it on Raxxon with the Audio Logs side face up (anyone may read the top card's Audio Log at any time). Place the <b>side effect deck</b> nearby — it is not shuffled and may be examined freely. Keep the special zombie standees handy." },
  { ph: 5, exp: "variant", when: c => !c.wc && c.mod("elimination"), src: "Rulebook p.15 (Player Elimination variant)",
    t: "Player Elimination in effect",
    d: "Agree before starting: if a player's last remaining survivor would be killed or otherwise lost, they remove their hand from the game and are OUT — they do not draw a replacement survivor." },
  { ph: 5, exp: "lonewolf", when: c => c.wc && c.loneWolf, src: "Warring Colonies rulebook p.14 (Lone Wolf)",
    t: "Lone Wolf setup (odd player count)",
    d: c => `With ${c.p} players, one player is the <b>Lone Wolf</b>. Place the <b>Lone Wolf Den</b> in front of them; they randomly take 1 of the 8 Lone Wolf secret objectives and follow its setup. Shuffle the Lone Wolf mission deck near the Den and draw <b>3 mission cards</b>. The Lone Wolf is always dealt <b>5 survivors and keeps 3</b>, placed at the Den. Lone Wolf morale starts at <b>4</b> (max 5).${c.p === 11 ? " <b>11-player game:</b> the Lone Wolf does not use a player reference sheet." : ""}` },
  { ph: 5, exp: "quickplay", when: c => c.wc && c.mod("quickplay"), src: "Warring Colonies rulebook p.15 (Quick Play)",
    t: "Quick Play in effect",
    d: "After both active players have moved their survivors each turn, flip the sand timer immediately — both players share <b>2 minutes TOTAL</b> for the whole simultaneous actions step. Unfinished actions are lost." },
  { ph: 5, exp: _core, when: c => true, src: "Rulebook p.8",
    t: "Begin round 1",
    d: c => c.wc
      ? "Start the Player Turns Phase: reveal the top card of the joint crisis deck, everyone rolls action dice (1 + 1 per survivor you control), then " + (c.loneWolf ? "the Lone Wolf takes their whole turn first, followed by " : "") + "the colony leaders taking the first simultaneous turns."
      : "Start the Player Turns Phase: reveal the top card of the crisis deck, everyone rolls action dice (1 + 1 per survivor you control — 3 dice to start), then the first player takes the first turn. Remember: the player to your right draws a crossroads card at the start of your turn." }
];

/* ---- HOW TO PLAY — core loop + conditional rules -------------------------- */
DW.howToPlay = {
  core: [
    { h: "Round order", items: [
      { t: `Each round has 2 phases, played in order:
        <div class="sub-title">Player Turns Phase</div>
        <ol class="sub"><li>Reveal Crisis</li><li>Roll Action Dice</li><li>Player Turns</li></ol>
        <div class="sub-title">Colony Phase</div>
        <ol class="sub"><li>Pay Food</li><li>Check Waste</li><li>Resolve Crisis</li><li>Add Zombies</li><li>Check Main Objective</li><li>Move Round Tracker</li><li>Pass First Player Token</li></ol>`,
        tag: _core, src: "Rulebook p.8, p.12", when: c => !c.wc },
      { t: "Roll Action Dice: discard leftover dice, then each player rolls <b>1 die + 1 per survivor they control</b> (3 to start). Dice belong to your group, not to a specific survivor — several dice can drive one survivor.", tag: _core, src: "Rulebook p.8", when: c => !c.wc },
      { t: "On your turn, the player to your right draws a crossroads card for you and watches for its trigger. Take as many actions as you can/wish, then play passes left.", tag: _core, src: "Rulebook p.8", when: c => !c.wc },
      { t: `The Warring Colonies round order (new steps in bold):
        <div class="sub-title">Player Turns Phase</div>
        <ol class="sub"><li>Reveal Crisis (a joint crisis for both colonies)</li><li>Roll Action Dice</li><li>Player Turns</li></ol>
        <div class="sub-title">Colony Phase</div>
        <ol class="sub"><li>Pay Food</li><li><b>Colony Combat</b></li><li>Check Waste</li><li>Resolve Crisis</li><li><b>Add 2 Bullets</b></li><li>Add Zombies</li><li>Check Main Objective</li><li>Move Round Trackers</li><li><b>Elect Colony Leaders</b></li></ol>`,
        tag: "wc", src: "WC rulebook p.7", when: c => c.wc },
      { t: `Turns are <b>simultaneous</b>: one player from each colony (starting with the leaders) takes a turn at the same time, in 4 parts completed in order:
        <ol class="sub">
          <li><b>Draw Crossroads Cards</b> — the teammate to each active player's right draws one for them (triggered cards do NOT stop play).</li>
          <li><b>Move Survivors</b> — the lower-morale colony's player moves 1 survivor or passes, then the other; alternate until both pass. Each survivor moves at most once. Requests are allowed during this step.</li>
          <li><b>Simultaneous Actions</b> — the first player to finish flips the 2-minute sand timer; the other must finish within it or lose the remaining actions. A bitten result is set on its side and resolved at the end of the step.</li>
          <li><b>Resolve Crossroads Cards</b> — resolve triggered cards starting with the higher-morale colony (roll a die to break ties). If several survivors met a trigger, the active player picks which one it applies to.</li>
        </ol>`,
        tag: "wc", src: "WC rulebook p.8-9", when: c => c.wc }
    ]},
    { h: "Actions that require an action die", items: [
      { t: c => `<b>Attack</b> — spend a die ≥ the attacking survivor's attack value; target a zombie${c.wc ? "" : " or a survivor"} at the same location.
        <ul class="sub">
          <li><b>Zombie:</b> it is killed and removed — then roll for exposure on the attacker.</li>
          ${c.wc ? "" : "<li><b>Survivor:</b> roll the spent die — if the result is ≤ the TARGET's attack value, the target takes 1 wound and you take a random card from that player's hand. No exposure roll.</li>"}
          <li>You may attack repeatedly (a new die each time), but never your own survivors or helpless survivors.</li>
        </ul>`, tag: _core, src: "Rulebook p.8-9" },
      { t: c => `<b>Search</b> — anywhere except the colony: spend a die ≥ the survivor's search value, then:
        <ol class="sub">
          <li>Draw 1 card from the location's item deck and look at it.</li>
          <li>Either add it to your hand (ending the search), or <b>make noise</b> — place a noise token on an empty noise space (max 4 per location) to draw and look at another card.${c.wc ? " <b>Warring Colonies: only 1 noise may be made per search action.</b>" : ""}</li>
          <li>When you stop (or run out of noise spaces), keep exactly 1 drawn card; the rest go to the bottom of that deck.</li>
        </ol>`, tag: _core, src: "Rulebook p.9-10" },
      { t: "<b>Barricade</b> — spend any die to place a barricade token on an empty entrance space at the survivor's location.", tag: _core, src: "Rulebook p.10" },
      { t: "<b>Clean Waste</b> — with a survivor at the colony, spend any die to remove the top 3 cards of the waste pile from the game.", tag: _core, src: "Rulebook p.10" },
      { t: "<b>Attract</b> — spend any die to move 2 zombies from any location to empty entrance spaces at the survivor's location.", tag: _core, src: "Rulebook p.10", when: c => !c.wc },
      { t: "<b>Survivor abilities</b> with a number (e.g. 4+) need a die of that value or higher each time they're used; abilities may repeat in a turn unless the card says otherwise.", tag: _core, src: "Rulebook p.10" },
      { t: "Warring Colonies removes the <b>Attack-a-Survivor</b> and <b>Attract</b> actions entirely; movement happens in its own turn step instead of as an action. A survivor sharing an enemy colony entrance with a zombie may attack that zombie.", tag: "wc", src: "WC rulebook p.9-10", when: c => c.wc }
    ]},
    { h: "Actions that do not require a die", items: [
      { t: "<b>Play a card</b> (your turn only) — to the waste pile; every 10 waste cards costs 1 morale at Check Waste. <b>Equip</b> cards attach to a survivor instead and can only leave by hand-off or being added to a crisis.", tag: _core, src: "Rulebook p.10" },
      { t: "<b>Add a card to the crisis</b> — face down from hand (or unequip into it). Matching symbols help prevent the crisis (+1 point); every non-matching card is −1. Multi-food cards still count as 1 card here.", tag: _core, src: "Rulebook p.11", when: c => !c.wc },
      { t: "In Warring Colonies the crisis is <b>joint</b> and contributions are played <b>face up</b> — only matching cards may be added; the crisis cannot be sabotaged.", tag: "wc", src: "WC rulebook p.10", when: c => c.wc },
      { t: "<b>Move a survivor</b> — each of your survivors may move once per turn, to any location with an empty survivor space; roll for exposure after each move.", tag: _core, src: "Rulebook p.11", when: c => !c.wc },
      { t: "<b>Spend food tokens</b> — remove tokens from the supply; each one gives +1 to any single unused die you control.", tag: _core, src: "Rulebook p.11" },
      { t: "<b>Request</b> — ask other players for item cards; anything given must be revealed and immediately played (never into the crisis).", tag: _core, src: "Rulebook p.11" },
      { t: "<b>Hand off</b> — pass an equipped item to another survivor at the same location. A once-per-round ability already used this round stays used.", tag: _core, src: "Rulebook p.11" },
      { t: "<b>Vote to exile</b> — once per turn, name another player (never yourself); everyone votes thumbs up/down simultaneously (count down from 3). The first player breaks ties.", tag: _core, src: "Rulebook p.11, p.15", when: c => !c.wc && !c.coopRules },
      { t: "Co-op rules: there is no voting to exile.", tag: "variant", src: "Rulebook p.15", when: c => !c.wc && c.coopRules }
    ]},
    { h: "Exposure & the bite", items: [
      { t: `Roll the exposure die immediately after a survivor <b>moves</b> or <b>kills a zombie</b>. The faces:
        <ul class="sub">
          <li><b>Blank</b> — nothing happens.</li>
          <li><b>Wound</b> — the survivor takes 1 wound token.</li>
          <li><b>Frostbite</b> — 1 frostbite wound; at the start of each of your turns, every frostbitten survivor you control takes another wound.</li>
          <li><b>Bitten</b> — the survivor is killed and the bite spreads.</li>
        </ul>`, tag: _core, src: "Rulebook p.11" },
      { t: `Bite spread: it jumps to the <b>lowest-influence survivor at the same location</b> (after a move, at the destination). That survivor's controller chooses:
        <ul class="sub">
          <li><b>Option 1:</b> kill the survivor — the spread stops.</li>
          <li><b>Option 2:</b> roll the exposure die — blank means they live and the spread stops; anything else kills them and it spreads again.</li>
        </ul>
        It continues until someone picks Option 1, a blank is rolled, or no survivors remain at the location.`, tag: _core, src: "Rulebook p.11" },
      { t: c => "A survivor with <b>3+ wounds is killed</b> — frostbite" + (c.has("longnight") ? " and despair" : "") + " tokens count toward the 3. Any survivor death costs the colony 1 morale.", tag: _core, src: "Rulebook p.14" }
    ]},
    { h: "Crossroads cards", items: [
      { t: "The drawer keeps the card secret and reads it all aloud only if its italicized trigger happens during your turn; you then pick one option (if you can't meet one, you must take the other). Untriggered cards go to the bottom of the deck.", tag: _core, src: "Rulebook p.12" },
      { t: "Action-based triggers fire <b>after</b> the action resolves (unless the card says otherwise). If a crossroads makes you search a deck for a card, shuffle that deck afterwards.", tag: _core, src: "Rulebook p.12" }
    ]},
    { h: "Colony phase details", items: [
      { t: `<b>Pay Food</b>: remove 1 food per 2 survivors in the colony (round up) — helpless survivors count; survivors out at locations feed themselves. If there isn't enough food, do this in order:
        <ol class="sub">
          <li>Remove NO food tokens.</li>
          <li>Add a starvation token to the food supply.</li>
          <li>Lose 1 morale for EVERY starvation token in the supply (they accumulate and never leave).</li>
        </ol>`, tag: _core, src: "Rulebook p.12" },
      { t: "<b>Check Waste</b>: lose 1 morale per 10 cards in the waste pile (round down).", tag: _core, src: "Rulebook p.12" },
      { t: "<b>Resolve Crisis</b>: shuffle & reveal the contributed cards; matching symbol +1, non-matching −1. Total < number of non-exiled players → the crisis hits. Total ≥ players → prevented; beating it by 2+ gains 1 morale.", tag: _core, src: "Rulebook p.12" },
      { t: "<b>Add Zombies</b>: 1 per 2 survivors at the colony (round up, helpless count), and 1 per survivor at each other location. Then resolve noise tokens one at a time.", tag: _core, src: "Rulebook p.12" },
      { t: "Noise (base rules): roll an action die per noise token — a 3 or lower adds a zombie there.", tag: "base", src: "Rulebook p.12", when: c => !c.has("longnight") },
      { t: "Noise (Long Night): flip each noise token like a coin — the “!!!” side adds a zombie there.", tag: "longnight", src: "Long Night rules p.13", when: c => c.has("longnight") },
      { t: "Zombies fill colony entrances in numbered order, one at a time (1, 2, 3 … then back to 1). No empty space but a barricade? The barricade is destroyed and that zombie is removed. No space and no barricade? <b>Overrun</b>: the zombie is removed and the lowest-influence survivor at the colony dies (helpless if only helpless remain). Non-colony locations work the same with a single entrance.", tag: _core, src: "Rulebook p.13" },
      { t: "First player token passes to the RIGHT at the end of the round.", tag: "base", src: "Rulebook p.13", when: c => !c.has("longnight") && !c.wc },
      { t: "First player vote (Long Night): before the token passes, any player may call a vote to keep it where it is; if the vote passes, the current first player keeps it.", tag: "longnight", src: "Long Night rules p.16", when: c => c.has("longnight") && !c.wc },
      { t: "Elect Colony Leaders (WC): each colony votes by pointing on a count of 3 — no voting for yourself, no abstaining; current leader breaks ties. The winner takes the colony leader token for next round.", tag: "wc", src: "WC rulebook p.13", when: c => c.wc }
    ]},
    { h: "Zombies & killing", items: [
      { t: "Any attacked zombie dies. Whoever kills a zombie (attack or card effect) rolls exposure for the killing survivor. At the colony you choose which entrance's zombie dies.", tag: _core, src: "Rulebook p.13" },
      { t: "Out of zombie standees? Use the zombie tokens.", tag: _core, src: "Rulebook p.13" }
    ]},
    { h: "Survivors: adding, dying, leaders", items: [
      { t: "New survivors join at the colony; they can act on your turn but give no extra die until the next Roll Action Dice step. If the colony's survivor spaces are full, effects that would add survivors (including helpless ones) can't be triggered.", tag: _core, src: "Rulebook p.14" },
      { t: c => "Deaths: overrun, 3+ wounds, bitten, or card effects. Equipped cards return to their owner's hand if the survivor dies at the colony; elsewhere they're shuffled into that location's item deck. Lose your group leader and you promote one from your following; lose your LAST survivor and you discard your hand from the game" + (c.mod("elimination") ? " — and with Player Elimination in play, you are OUT of the game" : ", draw a new survivor and continue") + ".", tag: _core, src: "Rulebook p.14" },
      { t: "“Remove from the game” is NOT killing — no morale is lost unless the card says so.", tag: _core, src: "Rulebook p.14" }
    ]},
    { h: "Exile", items: [
      { t: "An exiled player immediately draws an exiled secret objective (replacing their goal), and moves all their colony survivors out to non-colony locations (free move, roll exposure as normal).", tag: _core, src: "Rulebook p.14", when: c => !c.wc && !c.coopRules },
      { t: `New rules for the exiled player:
        <ul class="sub">
          <li>Cannot add cards to a crisis.</li>
          <li>Helpless survivor tokens they'd add to the colony are not added.</li>
          <li>Survivor item cards they play arrive at a non-colony location of their choice.</li>
          <li>Cannot spend food tokens — but may play food CARDS as +1 to a die each (instead of the card's effect).</li>
          <li>Cannot vote.</li>
          <li>The colony loses no morale when their survivors die.</li>
          <li>Cards they play are removed from the game instead of going to the waste pile.</li>
        </ul>`, tag: _core, src: "Rulebook p.14", when: c => !c.wc && !c.coopRules },
      { t: "If there are ever 2 exiled players and neither had a betrayal objective, <b>morale immediately drops to 0</b>.", tag: _core, src: "Rulebook p.14", when: c => !c.wc && !c.coopRules }
    ]},
    { h: "Winning & losing", items: [
      { t: "The game ends immediately when morale hits 0 or the round tracker hits 0 (do NOT check the main objective), or when the main objective is completed.", tag: _core, src: "Rulebook p.14" },
      { t: "You win only if YOUR secret objective is complete when the game ends (it usually includes the main objective). Multiple winners are possible; so is everyone losing.", tag: _core, src: "Rulebook p.14", when: c => !c.wc && !c.coopRules },
      { t: "Co-op rules: everyone wins together by completing the (hardcore) main objective.", tag: "variant", src: "Rulebook p.15", when: c => !c.wc && c.coopRules },
      { t: "Warring Colonies: you still must complete your own secret objective, which usually includes your colony completing the main objective. If a colony's morale hits 0, its players have lost but keep playing until the next Check Main Objective step; a 0-morale colony's morale can never rise again. Both at 0 then → both lose.", tag: "wc", src: "WC rulebook p.13", when: c => c.wc }
    ]},
    { h: "Card text & timing", items: [
      { t: "A card effect that contradicts the rulebook wins. If two effects seem simultaneous, the first player picks the order. Cards can't interrupt an effect in progress — e.g. medicine can't save a survivor taking their 3rd wound.", tag: _core, src: "Rulebook p.15" },
      { t: "“Roll a die” = roll a spare action die. Any effect that searches a whole item deck ends with shuffling that deck.", tag: "longnight", src: "Long Night rules p.15", when: c => c.has("longnight") }
    ]}
  ],

  /* Conditional rule blocks appended after the core when their test passes. */
  modules: [
    { h: "The Long Night — always-on rules", tag: "longnight", when: c => c.has("longnight") && !c.wc, items: [
      { t: "<b>Despair</b> tokens are wounds that no wound-healing effect can remove — only effects that explicitly remove despair.", src: "Long Night rules p.16" },
      { t: "<b>Unruly helpless survivors</b> (flipped token) count as TWO helpless survivors for Pay Food and Add Zombies. The active player may calm one by discarding a medicine card to the waste pile without using its effect.", src: "Long Night rules p.16" },
      { t: "<b>Explosive traps</b> work like barricades, but when destroyed by a zombie being added they also remove ALL zombies already at that entrance.", src: "Long Night rules p.16" },
      { t: "<b>Random locations</b>: roll a d6; the location with that number is chosen (the colony and 7+ locations can never be chosen randomly).", src: "Long Night rules p.16" },
      { t: "<b>Event item cards</b> are removed from the game when played instead of going to the waste pile.", src: "Long Night rules p.10" },
      { t: "The <b>Graveyard</b> stores dead survivors' cards & standees; it only matters to certain crossroads cards.", src: "Long Night rules p.16" },
      { t: "<b>Multi-use items</b>: if one effect belongs to a module you're not using, only the other effect is available. Without the Bandits module, ignore the bandit strip on crisis cards.", src: "Long Night rules p.16" }
    ]},
    { h: "Improvements module", tag: "improvements", when: c => c.mod("improvements") && !c.wc, items: [
      { t: "4 improvement cards sit face up near the colony. Items and other effects place <b>advancement tokens</b> on them.", src: "Long Night rules p.17" },
      { t: "When an improvement's tokens ≥ its printed number, its ongoing effect switches ON — place the card (or its token) in the center of the colony blueprint.", src: "Long Night rules p.17" }
    ]},
    { h: "Bandits module", tag: "bandits", when: c => c.mod("bandits") && !c.wc, items: [
      { t: "<b>Placing</b>: when a crisis is revealed, place bandits at the locations shown on its bandit strip (no space → that bandit isn't placed). Bandits occupy survivor spaces.", src: "Long Night rules p.17" },
      { t: "<b>Fighting</b>: attack a bandit like a survivor with attack value 4 — succeed and the bandit is removed. (No exposure roll; it's a survivor-style attack.)", src: "Long Night rules p.17" },
      { t: "<b>Zombies</b>: each bandit counts as a survivor for Add Zombies. If a location is overrun and holds no survivors, remove all bandits there.", src: "Long Night rules p.17" },
      { t: "<b>Scavenge</b>: after Add Zombies, each bandit draws 1 card from its location's search deck onto the Bandits' Hideout, face up.", src: "Long Night rules p.17" },
      { t: "<b>Hideout</b>: interact with the Bandits' Hideout per its location card (it has no search deck of its own).", src: "Long Night rules p.17" },
      { t: "<b>Leader of the bandits</b>: an exiled player who was NOT the betrayer becomes the bandits' leader and chooses where crisis-placed bandits go.", src: "Long Night rules p.17" }
    ]},
    { h: "Raxxon module", tag: "raxxon", when: c => c.mod("raxxon") && !c.wc, items: [
      { t: "<b>Searching at Raxxon</b>: after any search there, roll for exposure on the searching survivor.", src: "Long Night rules p.18" },
      { t: "<b>Pills</b>: choose a survivor to take the pill, roll a die and follow the card; if instructed, search the side effect deck and equip the side effect — it can never be unequipped.", src: "Long Night rules p.18" },
      { t: `<b>Containment code</b>: during your turn, while you control a survivor at Raxxon, you may place unused action dice on the location. At the start of the colony phase, if 2 dice there match the code on the top experiment card's Audio Log, all players vote — the most popular option takes effect:
        <ul class="sub">
          <li><b>Thumbs up</b> — discard the top experiment card without triggering its placement.</li>
          <li><b>Thumbs down</b> — the first player picks one location (the colony included): it gets 3 fewer zombies this Add Zombies step, but the experiment is released.</li>
        </ul>`, src: "Long Night rules p.18" },
      { t: "<b>Code failure (or thumbs down)</b>: place the special zombies listed on the Audio Log (rolling placement per zombie), then flip the card to its encounter side for all to see. If a special zombie has no entrance space, trigger explosive traps, remove barricades or trigger an overrun as usual — but the zombie itself is not placed and the experiment card is discarded.", src: "Long Night rules p.18" },
      { t: "<b>Special zombies</b> can only die to a regular attack (no items/abilities/traps), can't be moved except by their encounter card, and MUST be targeted before ordinary zombies, survivors or bandits at the same location. After attacking one (exposure as normal), if your survivor still lives, roll a die and apply the encounter card's effect. When the last special zombie of a type dies, discard its encounter card.", src: "Long Night rules p.18" }
    ]},
    { h: "Warring Colonies — combat", tag: "wc", when: c => c.wc, items: [
      { t: `During Colony Combat, resolve a combat at every location holding survivors from both colonies, one at a time in this order:
        <ol class="sub">
          <li>The colony with lower morale (roll a die to break a tie).</li>
          <li>The remaining colony.</li>
          <li>All other locations, in numerical order.</li>
        </ol>`, src: "WC rulebook p.10" },
      { t: `Each combat, both colony LEADERS simultaneously resolve 4 steps:
        <ol class="sub">
          <li><b>Play tactics</b> — each secretly plays 1 of their 5 tactics cards; reveal simultaneously and resolve.</li>
          <li><b>Add survivors & weapons</b> — +1 combat strength per friendly survivor at the location, then +1 more per friendly survivor with 1 or more cards equipped (the reference sheets depict weapons).</li>
          <li><b>Bid bullets</b> — each secretly picks a number of bullets from their supply, reveals in a fist: +1 strength per bullet bid; ALL bid bullets are then discarded.</li>
          <li><b>Roll combat dice</b> — each rolls a combat die and applies its effect immediately.</li>
        </ol>`, src: "WC rulebook p.10-11" },
      { t: `Combat die faces:
        <ul class="sub">
          <li><b>Strength</b> — add the number shown to your combat strength.</li>
          <li><b>Wounds</b> — immediately place that many wounds on a single enemy survivor in this combat.</li>
          <li><b>Zombies</b> — add that many zombies immediately after resolving any wounds.</li>
        </ul>`, src: "WC rulebook p.11" },
      { t: "The lower total loses: the defeated leader distributes wounds among friendly survivors at that location equal to the strength difference (track it on the Combat Tracker). If a player's last survivor would die in combat, wait until the end of the colony combat step to draw the replacement.", src: "WC rulebook p.11" },
      { t: "If both leaders play ON GUARD, the combat ends immediately with no further effect.", src: "WC rulebook p.3" },
      { t: "<b>Don't leave home unguarded</b>: after the combat step, if enemy survivors are at your colony and no friendly (non-helpless) survivors are, lose 1 morale per enemy survivor there — combat or not.", src: "WC rulebook p.11" },
      { t: "A survivor who dies at the ENEMY colony forfeits their equipped cards to the enemy colony leader, who immediately re-equips them to friendly survivors at that colony (or removes them from the game if none).", src: "WC rulebook p.11" }
    ]},
    { h: "Warring Colonies — bullets, movement & the enemy colony", tag: "wc", when: c => c.wc, items: [
      { t: "The crisis-deck space on each colony board is now that colony's <b>bullet supply</b>; the colony gains 2 bullets each round (Add 2 Bullets step).", src: "WC rulebook p.3, p.13" },
      { t: "Moving to the enemy colony: place your survivor on any empty ZOMBIE ENTRANCE space there. Entrance-to-entrance moves are allowed (roll exposure as normal).", src: "WC rulebook p.8" },
      { t: "Moving to a full location: return one of your own survivors home free, or spend 1 bullet (2 if the target has a weapon equipped) to bounce an ENEMY survivor back to their colony — never the other active player's survivor. No exposure rolls for the bounced survivor.", src: "WC rulebook p.8" },
      { t: "Enemy survivors at your entrances DON'T count for Pay Food but DO count for Add Zombies. If a zombie would be placed at a full entrance holding a survivor, that lowest-influence survivor takes 1 wound and is returned to its colony instead (no exposure roll).", src: "WC rulebook p.10, p.13" },
      { t: "Card text refers only to YOUR colony's players and survivors unless stated otherwise (“in play”, “any player”, “a survivor” = yours). Anita Wallace, Eric Parker, Nadia Rivers and Derek Yoshida's abilities work only on/for friendly players.", src: "WC rulebook p.13" },
      { t: "Bite spreads and zombie overruns ignore colony allegiance — they work exactly as in the standard game.", src: "WC rulebook p.13" }
    ]},
    { h: "Lone Wolf", tag: "lonewolf", when: c => c.wc && c.loneWolf, items: [
      { t: "The Lone Wolf takes their whole turn FIRST each round, before the simultaneous turns, with no time limit.", src: "WC rulebook p.14" },
      { t: "The Lone Wolf Den is a mini-colony: only Lone Wolf survivors may enter, zombies never spawn there, Pay Food is normal, and Check Waste costs 1 morale per <b>5</b> waste cards (not 10). Lone Wolf morale starts at 4, caps at 5, and 0 morale removes the Lone Wolf from the game.", src: "WC rulebook p.14-15" },
      { t: "Lone Wolf survivors can move to entrances at BOTH colonies. Bounced from a full location, they return to the Den (owner's choice of location if the Den is full). The Lone Wolf CAN move a survivor to a full location, but must spend an action die to return a survivor there to its colony (returning a Lone Wolf survivor costs no die). The Lone Wolf can't collect bullets, ignores helpless survivors, and may feed cards to the joint crisis while ignoring its morale effects.", src: "WC rulebook p.14" },
      { t: "Combat at a Lone Wolf location: before it starts, run away — all Lone Wolf survivors return one by one to the Den (or a location of choice if the Den is full), rolling exposure as normal — or pick a colony to fight for; those survivors count for that side and can be assigned wounds (retreating survivors also return to the Den).", src: "WC rulebook p.15" },
      { t: "<b>Missions</b>: start with 3 mission cards; completing one raises morale per the card and immediately draws a replacement. Once per round at turn start, the Lone Wolf may discard a mission to draw a new one. When the mission pile runs out, no more can be drawn. The Lone Wolf wins if their secret objective is complete at game end.", src: "WC rulebook p.15" }
    ]},
    { h: "Standard-game variants in play", when: c => !c.wc && (c.coopRules || c.mod("betrayer") || c.mod("hardcore") || c.mod("elimination")), items: [
      { t: "Co-op: hardcore objective side, no secret objectives, no exile votes, non-co-op-marked cards removed.", tag: "variant", src: "Rulebook p.15", when: c => c.coopRules },
      { t: "2-player: co-op rules + 7 starting items each and 4-keep-3 survivor draft.", tag: "variant", src: "Rulebook p.15", when: c => c.twoPlayer },
      { t: "Betrayer variant: only 1 non-betrayal objective per player is in the deal — trust no one.", tag: "variant", src: "Rulebook p.15", when: c => c.mod("betrayer") },
      { t: "Hardcore variant: the hardcore objective side, with normal secret objectives.", tag: "variant", src: "Rulebook p.15", when: c => c.mod("hardcore") },
      { t: "Player Elimination: your last survivor dying knocks you out of the game.", tag: "variant", src: "Rulebook p.15", when: c => c.mod("elimination") }
    ]}
  ]
};

/* ---- Locations reference --------------------------------------------------- */
DW.boards = [
  { name: "The Colony", when: c => true, items: [
    "Home base. Holds the morale track, round track, food supply, main objective, waste pile, crisis deck & contributions, and the Colony Occupants survivor spaces.",
    "6 numbered entrances — zombies fill them in numbered order; barricades and (Long Night) explosive traps go on entrance spaces.",
    "You cannot SEARCH at the colony; Clean Waste requires a survivor here.",
    "Zombies arrive here every round: 1 per 2 survivors present (helpless count)."
  ]},
  { name: "The 6 town locations", when: c => true, items: [
    c => "Police Station, Grocery Store, School, Library, Hospital, Gas Station — each has survivor spaces, ONE zombie entrance, a 20-card item deck" + (c.wc || c.mod("randomitems") ? " (25 with the 5 Random Item cards mixed in)" : "") + " and 4 noise spaces.",
    "The row of item symbols printed on each location card shows, from left to right, what you're most likely to find when searching there — check the card before you commit a die.",
    "Zombies arrive each round: 1 per survivor present, plus noise-token spawns.",
    "A survivor dying at a non-colony location shuffles their equipped cards into that location's item deck."
  ]},
  { name: "Graveyard", when: c => c.has("longnight"), items: [
    "Looks like a location but is only an organizer for dead survivors' cards & standees.",
    "No gameplay effect except through certain crossroads cards — you can't move there, search there, and zombies ignore it."
  ]},
  { name: "Raxxon Pharmaceutical", when: c => c.mod("raxxon") && !c.wc, items: [
    "A full location with its own search deck — the best loot in the game, at a price: every search here ends with an exposure roll.",
    "Hosts the Raxxon experiments deck (Audio Logs face up — read the top card any time) and the browsable side effect deck.",
    "Park 2 unused action dice here matching the containment code to give the colony a vote on containing this round's experiment.",
    "Pill items make a chosen survivor roll a die — side effect cards equip permanently."
  ]},
  { name: "Bandits' Hideout", when: c => c.mod("bandits") && !c.wc, items: [
    "A special location with NO search deck — everything the bandits scavenge piles up here face up.",
    "Interact with it by following the instructions printed on the location card.",
    "An exiled non-betrayer becomes leader of the bandits and directs where crisis-placed bandits go."
  ]},
  { name: "Two colonies & the Combat Tracker", when: c => c.wc, items: [
    "Each team has its own full colony board; the crisis space doubles as that colony's bullet supply.",
    "The Combat Tracker sits between them (yellow/blue sides facing each colony) and tracks the strength difference during each combat, starting at 0.",
    "Both colonies share the town's 6 locations, the Graveyard and one joint crisis."
  ]},
  { name: "Lone Wolf Den", when: c => c.wc && c.loneWolf, items: [
    "The Lone Wolf's private mini-colony: food supply, waste pile and its own 0-5 morale track.",
    "Only Lone Wolf survivors may move here; zombies can never be added here.",
    "Counts as a colony for Lone Wolf survivor abilities and crossroads cards.",
    "Waste bites harder here: 1 morale per 5 cards in the waste pile."
  ]}
];

/* ---- Common rulings (curated from the rulebooks) --------------------------- */
DW.faq = [
  { q: "Do helpless survivors eat food and attract zombies?",
    a: "Yes to both. Helpless survivor tokens count as survivors when paying food (1 food per 2 survivors at the colony, rounded up) and when adding zombies to the colony. <i>(Rulebook p.12)</i>" },
  { q: "Do survivors out at locations need food?",
    a: "No — only survivors in the colony count for Pay Food. Survivors elsewhere are considered to be foraging for themselves. <i>(Rulebook p.12)</i>" },
  { q: "What exactly kills a survivor?",
    a: "Reaching 3+ wound tokens (frostbite — and in The Long Night, despair — count), a bitten exposure result, an entrance overrun choosing them, or a card effect. Every survivor death (helpless included) costs 1 morale. <i>(Rulebook p.14)</i>" },
  { q: "Does attacking another survivor trigger an exposure roll?",
    a: "No. The exposure die is only rolled after moving or after killing a zombie — never when attacking a survivor. <i>(Rulebook p.8)</i>" },
  { q: "Can I heal a survivor about to take their third wound?",
    a: "No. Cards cannot interrupt an effect in progress — medicine can only be played after a wound lands, so the third wound kills before it could be removed. <i>(Rulebook p.15)</i>" },
  { q: "How do starvation tokens work?",
    a: "If you can't pay the full food cost, you remove NO food, add 1 starvation token to the supply, and then lose 1 morale for EVERY starvation token there — they accumulate and never leave. <i>(Rulebook p.12)</i>" },
  { q: "The crisis needs how many points?",
    a: "The point total (matching cards +1, non-matching −1) must equal or exceed the number of NON-EXILED players. Beat it by 2 or more and the colony gains 1 morale. <i>(Rulebook p.12)</i>" },
  { q: "A food card that adds 3 food — how much is it worth in the crisis?",
    a: "It counts as 1 card with 1 food symbol. Multi-token food cards still only count once when contributed to a crisis. <i>(Rulebook p.11)</i>" },
  { q: "What can't an exiled player do?",
    a: "Add cards to a crisis, add helpless survivors, spend food tokens (they may play food cards as +1 die each instead), or vote. Their played cards leave the game instead of hitting the waste pile, their dead survivors cost no morale, and survivors they add arrive at non-colony locations. <i>(Rulebook p.14)</i>", when: c => !c.wc },
  { q: "What if two players get exiled?",
    a: "If ever 2 exiled players are both non-betrayers, morale immediately drops to 0 and the game ends. <i>(Rulebook p.14)</i>", when: c => !c.wc },
  { q: "Morale or the round track hit 0 — do we still check the objective?",
    a: "No. The game ends immediately and you do NOT check whether the main objective was completed. Each player only wins if their secret objective is done. <i>(Rulebook p.14)</i>" },
  { q: "Can I unequip an item?",
    a: "Only by handing it off to a survivor at the same location or by adding it to the crisis. If the carrier dies at the colony the cards return to your hand; anywhere else they're shuffled into that location's item deck. <i>(Rulebook p.10, 14)</i>" },
  { q: "Can a requested card go into the crisis?",
    a: "No. A card given via Request must be revealed and immediately played — it can never be added to the crisis. <i>(Rulebook p.11)</i>" },
  { q: "How does noise turn into zombies?",
    a: c => c.has("longnight")
      ? "The Long Night way: during Add Zombies, flip each noise token like a coin — every “!!!” face adds a zombie at that location. (The base game instead rolled a die per token, spawning on 3 or lower.) <i>(Long Night rules p.13)</i>"
      : "During Add Zombies, remove each noise token one at a time and roll an action die for it — on 3 or lower, add a zombie to that location. <i>(Rulebook p.12)</i>" },
  { q: "When do new survivors give me an extra die?",
    a: "Not until the next Roll Action Dice step. The survivor can act this turn (using your existing dice), but the extra die arrives next round. <i>(Rulebook p.14)</i>" },
  { q: "Frostbite vs despair vs wounds?",
    a: "Frostbite is a wound that also deals 1 extra wound to that survivor at the start of each of your turns. Despair (Long Night) is a wound that healing can't touch — only effects that explicitly remove despair work. All of them count toward the 3-wound death threshold.", when: c => c.has("longnight") },
  { q: "How tough is a bandit?",
    a: "Attack it exactly like a survivor whose attack value is 4: spend a die equal to or higher than YOUR survivor's attack value, then roll that spent die — a result of 4 or less removes the bandit. No exposure roll (it's a survivor-style attack). Bandits count as survivors for zombie spawns, and each one steals a search-deck card to the Hideout every round. <i>(Long Night rules p.17, p.8)</i>", when: c => c.mod("bandits") && !c.wc },
  { q: "Can my flamethrower kill a Raxxon special zombie?",
    a: "No — special zombies only die to a regular attack action. Items, abilities and explosive traps that kill zombies don't affect them, and they must be targeted before anything else at their location. <i>(Long Night rules p.18)</i>", when: c => c.mod("raxxon") && !c.wc },
  { q: "Who takes wounds when a combat is lost?",
    a: "The defeated colony leader distributes wounds among FRIENDLY survivors at that location equal to the final difference in combat strength — their choice of how to split them. <i>(WC rulebook p.11)</i>", when: c => c.wc },
  { q: "Can I sabotage the joint crisis?",
    a: "No. Crisis contributions are face up and only matching cards may be added — there is no way to sabotage a Warring Colonies crisis. <i>(WC rulebook p.10)</i>", when: c => c.wc },
  { q: "My colony hit 0 morale — am I out?",
    a: "Your colony has lost, but keep playing until the next Check Main Objective step (your survivors can still spoil things). A colony at 0 morale can never raise it again. <i>(WC rulebook p.13)</i>", when: c => c.wc },
  { q: "Do enemy survivors at my entrances cost me food?",
    a: "No for Pay Food, yes for Add Zombies. And if a zombie would spawn into a full entrance occupied by a survivor, the lowest-influence survivor there takes 1 wound and is bounced home instead. <i>(WC rulebook p.10, 13)</i>", when: c => c.wc }
];

/* ---- Reference numbers ------------------------------------------------------ */
DW.playerRef = {
  src: "Rulebook p.6-8, 15 · Long Night rules p.6-8 · WC rulebook p.4-5, 14-15",
  stdRows: p => ({
    dice: "3 each (1 + 1 per survivor)",
    items: p === 2 ? "7 each *" : "5 each",
    draft: p === 2 ? "Deal 4, keep 3 *" : "Deal 4, keep 2",
    pool: p === 2 ? "None *" : `${2 * p} non-betrayal + 1 betrayal`,
    crisis: `${p} points (non-exiled players)`
  }),
  twoPlayerNote: "* The rulebook requires 2-player games to use the co-op rules: 7 starting items, keep 3 survivors, and no secret objectives (Rulebook p.15).",
  notes: [
    "Action dice: every player rolls 1 + 1 per survivor controlled, re-rolled fresh each round.",
    "Crisis target = the number of NON-EXILED players; beat it by 2+ for a bonus morale.",
    "Every 10 cards in the waste pile costs 1 morale.",
    "Max 4 noise tokens per location per round.",
    "Morale and round tracks are set by the main objective card."
  ]
};

/* Warring Colonies seating chart for 4-11 players. */
DW.wcSeating = {
  4:  { teams: "2 vs 2",  lw: false }, 5:  { teams: "2 vs 2",  lw: true },
  6:  { teams: "3 vs 3",  lw: false }, 7:  { teams: "3 vs 3",  lw: true },
  8:  { teams: "4 vs 4",  lw: false }, 9:  { teams: "4 vs 4",  lw: true },
  10: { teams: "5 vs 5",  lw: false }, 11: { teams: "5 vs 5",  lw: true }
};


/* ---- TEACHING SCRIPT (read aloud, ~5 min; content per the base, Long Night
   and Warring Colonies rulebooks — see the setup citations above) ----------- */
DW.teach = {
  intro: "Read this aloud — about five minutes. Keep your secret objective facedown.",
  sections: [
    { h: "The pitch — and how you win", body: (c) => `
<p>We're a colony of survivors in a zombie winter. The colony has a shared <b>main objective</b> on the table — but each of us also has a <b>secret objective</b>, and here's the rule that changes everything: <b>you only win if YOUR secret objective is complete when the game ends</b>. Most secret objectives want the colony to succeed. One of us might be holding a <b>betrayal</b> card that wants it to burn.</p>
<p>The game ends three ways: the main objective is completed, <b>morale</b> hits zero, or the <b>round tracker</b> runs out. Then everyone checks their card — it's entirely possible the colony “wins” and half of us still lose.</p>` },

    { h: "The shape of a round", body: (c) => `
<p>Each round: reveal the <b>crisis</b> — this round's shared tax, paid in item cards. Everyone rolls their <b>action dice</b> — one per survivor you control, plus one. Then turns: on yours, spend dice on actions anywhere on the board. After everyone's gone, the <b>colony phase</b> collects the bills: feed the colony, count the waste, resolve the crisis, and add zombies to every location with survivors in it.</p>` },

    { h: "Your dice — and what they buy", body: (c) => `
<p>Dice are your action currency, and the roll matters: <b>attack</b> and <b>search</b> need a die equal to or above that survivor's printed value. Attack kills a zombie where a survivor stands; <b>search</b> digs item cards out of a location's deck — the location decides what you find: medicine at the hospital, food at the grocery store, guns at the police station. Any die moves a survivor, barricades a door, cleans waste, or attracts zombies elsewhere.</p>
<p>Free moves that cost no dice: play cards, hand items off, <b>spend food to pump a die up</b>, request help — and <b>vote to exile</b> someone the table stops trusting.</p>` },

    { h: "Exposure — the coldest rule in the game", body: (c) => `
<p>Every time a survivor <b>moves between locations</b> or <b>kills a zombie</b>, roll the <b>exposure die</b>. Most faces are fine. Some wound. One gives <b>frostbite</b> — a wound that keeps wounding every turn until treated. And one face is a <b>bite</b>: that survivor dies <i>immediately</i>, and the bite spreads to the next survivor at that location, whose owner must kill them or gamble the die again. Every trip outside the colony is this bet. Travel with fuel cards when you can; they skip the roll.</p>` },

    { h: "Crossroads — don't read ahead", body: (c) => `
<p>At the start of your turn, the player on your right draws a <b>Crossroads card</b> and silently watches you. If you trip its trigger — enter a location, play a card, sometimes just exist — they interrupt and read you a story with a choice. Don't ask, don't peek. It's the best part of the game.</p>` },

    { h: "Morale, crises & the colony phase", body: (c) => `
<p>The colony phase is where games are lost: <b>feed everyone</b> or take starvation tokens that bleed morale every round. Ten cards in the <b>waste pile</b> costs morale too — so contributing cards to the crisis isn't charity, it's sanitation. The <b>crisis</b> itself is a blind vote: cards contributed facedown, matching symbols help, wrong symbols <i>sabotage</i> — and nobody knows who threw the wrench. Sound familiar? That's your betrayer-detection kit.</p>` },

    { h: "The Long Night", when: (c) => c.has("longnight"), body: () => `
<p>We're playing with <b>The Long Night</b>: the <b>Raxxon</b> pharmaceutical site spawns horrors best left contained, <b>bandits</b> raid locations and carry off the loot, and colony <b>improvements</b> let us build something that lasts. Zombies can also grow <b>despair</b>-driven upgrades. Same winter, more knives.</p>` },

    { h: "Warring Colonies", when: (c) => c.wc, body: () => `
<p>This is <b>Warring Colonies</b>: two colonies, one winter, not enough of anything. Each team runs its own board and races (or raids) the other — with <b>direct conflict</b> rules for when survivors meet${""}. The betrayal paranoia now has a zip code: the other table.</p>` },

    { h: "Don't worry about these yet", body: (c) => {
      const later = ["individual location decks", "helpless survivors", "exile details"];
      if (c.has("longnight")) later.push("Raxxon's experiments");
      return `<p>I'll explain ${later.join(", ")} when they come up. Opening advice: watch what people <i>contribute to the crisis</i> — generosity is loud, sabotage is quiet — and never let the food supply hit zero twice.</p>`;
    }}
  ]
};
