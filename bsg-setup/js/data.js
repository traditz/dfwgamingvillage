/* =============================================================================
   Battlestar Galactica — Setup Utility
   Data model: expansions, objectives (modes), optional modules, and a single
   precedence-aware setup sequence.

   The setup is ONE ordered list of steps. Each step is tagged with the
   expansion it comes from. Where a later expansion supersedes an earlier rule,
   the supersession is encoded in the step's `when` condition so that only the
   most recent applicable ruling appears. Release precedence (newest wins):
       Base  <  Pegasus  <  Exodus  <  Daybreak
   Cross-expansion rules grounded in: Exodus p.22, Daybreak p.16–18.
   ============================================================================= */

const BSG = {};

/* ---- Expansions ---------------------------------------------------------- */
BSG.expansions = [
  { id: "base",     name: "Base Game",  short: "Base",     always: true,
    blurb: "Battlestar Galactica: The Board Game. The foundation every mode builds on." },
  { id: "pegasus",  name: "Pegasus",    short: "Pegasus",
    blurb: "Adds the Pegasus battlestar, Cylon Leaders, Treachery cards and the New Caprica occupation phase." },
  { id: "exodus",   name: "Exodus",     short: "Exodus",
    blurb: "Adds Conflicted Loyalties, the pursuing Cylon Fleet, and the Ionian Nebula endgame — combinable in any mix." },
  { id: "daybreak", name: "Daybreak",   short: "Daybreak",
    blurb: "Adds Mutiny, board overlays, Cylon Leader motives and the Search for Home race to Earth (up to 7 players)." }
];

/* Display metadata for the source tag shown on every step. */
BSG.expMeta = {
  base:     { name: "Base",     cls: "e-base" },
  pegasus:  { name: "Pegasus",  cls: "e-peg"  },
  exodus:   { name: "Exodus",   cls: "e-exo"  },
  daybreak: { name: "Daybreak", cls: "e-day"  }
};
BSG.precedence = { base: 0, pegasus: 1, exodus: 2, daybreak: 3 };

/* ---- Objectives = the 'spine' of a mode. Exactly one per game. ----------- */
BSG.objectives = [
  { id: "kobol", name: "Kobol (Standard)", requires: "base", players: [3, 6], exp: "base",
    summary: "The classic search for Earth via the Kobol map. Win by travelling 8 distance and jumping once more.",
    description: "The default win condition from the base game. Humans win by reaching the distance on the Kobol Objective Card and making a final jump; Cylons win by draining any resource to zero, destroying Galactica, or boarding it with Centurions." },

  { id: "newCaprica", name: "New Caprica", requires: "pegasus", players: [3, 6], exp: "pegasus",
    summary: "Pegasus occupation mode. The fleet may be forced down to New Caprica for a desperate resistance phase.",
    description: "Uses the New Caprica Objective Card instead of Kobol. Mid-game the fleet can be captured and characters moved to the New Caprica board for the occupation/resistance phase, with its own Crisis deck and Title cards." },

  { id: "ionianNebula", name: "Ionian Nebula", requires: "exodus", players: [3, 6], exp: "exodus",
    summary: "Exodus endgame. A Crossroads phase forces every character to a reckoning that can flip loyalties.",
    description: "Uses the Ionian Nebula Objective Card in place of Kobol. Trauma tokens accumulate and, at the Crossroads phase, drive Crossroads-card decisions that may add or change loyalties — an unforgettable trial." },

  { id: "earth", name: "Search for Home (Earth)", requires: "daybreak", players: [3, 7], exp: "daybreak",
    summary: "Daybreak's climax. Scout missions aboard Demetrius and the Rebel Basestar to find Earth.",
    description: "Uses the Earth Objective Card and the Search for Home option: the Demetrius and Rebel Basestar boards, Mission cards and scouting. Supports up to 7 players (one must be a Cylon Leader at 7)." }
];

/* ---- Optional modules layered on top of a chosen objective --------------- */
BSG.options = [
  { id: "cylonLeaders", name: "Cylon Leaders", requires: ["pegasus", "daybreak"], minPlayers: 4,
    summary: "A player openly plays a Cylon Leader with secret Agenda/Motive cards — not fully human, not fully Cylon.",
    description: "Introduced in Pegasus. One player may take a Cylon Leader with Hostile/Sympathetic Agendas (Pegasus) or Motive cards (Daybreak overrides). Never in a 3-player game; required for one player at 7 (Daybreak)." },

  { id: "conflictedLoyalties", name: "Conflicted Loyalties", requires: "exodus",
    summary: "Adds Personal Goal and Final Five Loyalty cards — humans may carry hidden agendas of their own.",
    description: "Exodus option. Adds Personal Goal and 'Final Five' Loyalty cards to the deck, blurring who is truly loyal (Exodus p.10–11)." },

  { id: "cylonFleet", name: "Cylon Fleet", requires: "exodus",
    summary: "The Cylon Fleet board and Pursuit track — a relentless basestar chase, plus the CAG title.",
    description: "Exodus option. Adds the Cylon Fleet board, Pursuit marker, CAG / Alternate Admiral titles, Viper Mark VIIs, extra raiders and the 'CAG Chooses' cards (Exodus p.12–15)." },

  { id: "sympatheticCylon", name: "Sympathetic Cylon (variant)", requires: "pegasus", disabledBy: "daybreak", disabledByOption: "cylonLeaders", onlyPlayers: [4, 6],
    summary: "Optional Pegasus variant using the 'You Are a Sympathetic Cylon' loyalty card.",
    description: "A Selective Variant from Pegasus (p.18). It replaces the Sympathizer, so it only applies in 4- or 6-player games. NOT usable with a Cylon Leader (a Cylon Leader game uses no Sympathizer), and Daybreak explicitly disables it (Daybreak p.16)." }
];

/* The Seven Player Game is a variant (Pegasus p.18), extended by Exodus (p.22)
   and superseded by Daybreak (p.16). It always requires a Cylon Leader, so it is
   modelled through the player count (7) rather than a separate chip. */
BSG.sevenPlayer = {
  requiresCylonLeader: true,
  note: "Seven Player Game variant: one player MUST play a Cylon Leader, and each player should expect a longer wait between turns. The Sympathizer / Sympathetic Cylon is not used."
};

/* ---- Loyalty deck — exact per-setup composition -------------------------- */
/* Charts transcribed from the rulebooks:                                     */
/*   Base     p.6                                                             */
/*   Pegasus  p.6 (no leader) + p.11/p.18 (Cylon Leader)                       */
/*   Exodus   p.6 / v4.4 p.9 (no leader) + Exodus p.22 (Cylon Leader)          */
/*   Daybreak p.6–7 "Creating the Loyalty Deck" Chart (incl. the Mutineer)     */
/* Rows: [youAreACylon, youAreNotACylon, thirdFlag]                            */
/*   - Daybreak third flag = Mutineer included? (true/false)                   */
/*   - Pegasus/Exodus CL third flag = Agenda type dealt to the Cylon Leader    */
BSG.loyaltyCharts = {
  base: {
    src: "Base rulebook p.6",
    rows:   { 3: [1, 5], 4: [1, 6], 5: [2, 8], 6: [2, 9] },
    sympathizerAt: [4, 6]
  },
  pegasus: {
    src: "Pegasus p.6 / p.11 / p.18",
    rows:   { 3: [1, 5], 4: [1, 6], 5: [2, 8], 6: [2, 9] },                       // no Cylon Leader = base counts + new Pegasus cards
    clRows: { 4: [1, 5, "Sympathetic"], 5: [1, 7, "Hostile"], 6: [2, 8, "Sympathetic"], 7: [2, 10, "Hostile"] },
    sympathizerAt: [4, 6]
  },
  exodus: {
    src: "Exodus p.6 / p.22 (v4.4 p.9)",
    rows:   { 3: [1, 6], 4: [1, 7], 5: [2, 9], 6: [2, 10] },                      // base + 1 You-Are-Not
    clRows: { 4: [1, 6, "Sympathetic"], 5: [1, 8, "Hostile"], 6: [2, 9, "Sympathetic"], 7: [2, 11, "Hostile"] },
    sympathizerAt: [4, 6]
  },
  daybreak: {
    src: "Daybreak p.6–7 Loyalty Chart",
    rows:   { 3: [1, 5, false], 4: [1, 7, true], 5: [2, 8, false], 6: [2, 10, true] },
    clRows: { 4: [1, 5, false], 5: [1, 7, true], 6: [2, 8, false], 7: [2, 10, true] },
    usesMotive: true   // Cylon Leader uses Motive cards; no Agenda, no Sympathizer
  }
};

BSG.loyalty = {
  /* Compute the exact Loyalty-deck composition for a setup.
     c = { has(exp), p (players), cyl (Cylon Leader in play?) } */
  compute(c) {
    const gov = c.has("daybreak") ? "daybreak"
              : c.has("exodus")   ? "exodus"
              : c.has("pegasus")  ? "pegasus" : "base";
    const chart = BSG.loyaltyCharts[gov];
    const cl = !!c.cyl;
    const row = (cl && chart.clRows && chart.clRows[c.p]) ? chart.clRows[c.p] : chart.rows[c.p];

    const out = { gov, src: chart.src, players: c.p, cl,
                  cylon: 0, not: 0, notBase: 0, mutineer: false, sympathizer: false,
                  agenda: null, motive: false, extras: [], total: 0, valid: !!row };
    if (!row) return out;

    out.cylon   = row[0];
    out.not     = row[1];
    out.notBase = row[1];   // chart value before deterministic modifiers

    if (gov === "daybreak") {
      out.mutineer = row[2] === true;
      if (cl) out.motive = true;                       // Cylon Leader draws Motive cards
    } else if (cl) {
      out.agenda = row[2] || null;                     // Pegasus/Exodus Cylon Leader Agenda
    }

    // Sympathizer: only when NOT using a Cylon Leader, never in Daybreak.
    if (gov !== "daybreak" && !cl && chart.sympathizerAt && chart.sympathizerAt.includes(c.p))
      out.sympathizer = true;

    // Deterministic +1 modifier: Daybreak adds one "You Are Not a Cylon" if Exodus is in play.
    if (gov === "daybreak" && c.has("exodus")) { out.not += 1; out.extras.push("Exodus in play"); }

    out.total = out.cylon + out.not + (out.mutineer ? 1 : 0) + (out.sympathizer ? 1 : 0);
    return out;
  },

  /* Character-dependent adjustments the app can't know automatically. */
  charNotes() {
    const notes = [
      "Add one extra ‘You Are Not a Cylon’ for each original Gaius Baltar in play (not the Daybreak alternate Baltar).",
      "Add one extra ‘You Are Not a Cylon’ for each Sharon “Boomer” Valerii in play."
    ];
    return notes;
  }
};

/* ---- THE UNIFIED SETUP SEQUENCE ------------------------------------------ */
/* Each step: { ph, exp, t, d, when }                                         */
/*   ph   = phase index (visual grouping)                                     */
/*   exp  = source expansion tag shown in parentheses                         */
/*   when = (c) => boolean, c = { has(exp), p, obj, opt(id) }                  */
/* Steps render in array order; supersession is baked into `when`.            */
BSG.phases = ["Board & Components", "Characters & Titles", "Cards, Decks & Objective", "Loyalty & Final Steps"];

BSG.setup = [
  /* ---------- Phase 0: Board & Components ---------- */
  { ph: 0, exp: "base", t: "Place Game Board", src: "Base p.5 · v4.4 p.3",
    d: "Place the board at the center of the table. Set food and fuel dials to 8, morale to 10, population to 12." },

  { ph: 0, exp: "daybreak", t: "Location Overlays", when: c => c.has("daybreak"), src: "Daybreak p.4 · v4.4 p.12",
    d: "Lay the Colonial One overlay and the Cylon locations overlay on the base board (‘…Destroyed’ / ‘Hub Destroyed’ sides facedown). Read them — locations have changed. If Pegasus is in play, its Cylon locations overlay is NOT used (return it to the box)." },

  { ph: 0, exp: "pegasus", t: "Cylon Overlay", when: c => c.has("pegasus") && !c.has("daybreak"), src: "Pegasus p.6 · v4.4 p.7",
    d: "Place the Pegasus Cylon Overlay over the core board's Cylon locations." },

  { ph: 0, exp: "pegasus", t: "Pegasus Battlestar Board", when: c => c.has("pegasus"), src: "Pegasus p.6 · v4.4 p.7",
    d: "Place the Pegasus game board to the right of the core board, aligning the bottom edges." },

  { ph: 0, exp: "base", t: "Set Up Tokens & Ships", src: "Base p.5 · v4.4 p.3",
    d: "Put 8 vipers and 4 raptors in the Viper & Raptor Reserves. Place the fleet token at the start of the Jump Preparation track. Place all other tokens facedown and the plastic ships beside the board." },

  { ph: 0, exp: "daybreak", t: "Centurion & Assault Raptor Figures", when: c => c.has("daybreak"), src: "Daybreak p.4 · v4.4 p.12",
    d: "Replace the base centurion markers with the centurion figures. Put 1 assault raptor figure in the Reserves; place the rest beside the board." },

  { ph: 0, exp: "exodus", t: "Additional Nuke Token", when: c => c.has("exodus"), src: "Exodus p.5 · v4.4 p.9",
    d: "Place the extra Exodus nuke token beside the board (a possible 3rd nuke later). Humans still start with only 2." },

  { ph: 0, exp: "pegasus", t: "Scar & Pegasus Damage Tokens", when: c => c.has("pegasus"), src: "Pegasus p.6 · v4.4 p.7",
    d: "Place the Scar token and the Pegasus Damage tokens beside the board. Keep the Pegasus damage tokens separate from the Galactica damage tokens." },

  { ph: 0, exp: "exodus", t: "Cylon Fleet Board", when: c => c.opt("cylonFleet"), src: "Exodus p.12 · v4.4 p.9",
    d: "Place the Cylon Fleet board by the main board and put the Cylon Pursuit marker on the Start space of the Pursuit track. Remove all Cylon-attack cards from the Crisis and Super Crisis decks and box them (the Cylon Fleet board drives Cylon attacks instead). Return 2 vipers from the Reserves to the box, place the 4 Viper Mark VIIs in the Damaged Vipers box, and add the 4 new Cylon raiders to the ship pool." },

  { ph: 0, exp: "exodus", t: "Mining Asteroid Card (Pegasus + Cylon Fleet)", when: c => c.opt("cylonFleet") && c.has("pegasus"), src: "Exodus p.22 · v4.4 p.15",
    d: "Remove the ‘Mining Asteroid’ Destination card from the Destination deck before setup (Combining Pegasus & Exodus with the Cylon Fleet option)." },

  { ph: 0, exp: "exodus", t: "Ionian Nebula Tokens", when: c => c.obj === "ionianNebula", src: "Exodus p.16 · v4.4 p.9",
    d: "Replace the core basestar damage tokens with the Exodus alternate basestar damage tokens. Place the trauma tokens facedown and randomized; draw 2 and, without looking, place one facedown on Sickbay and one on the Brig. Shuffle the Crossroads cards. Shuffle the Ally cards, place the top 3 faceup (return any that represent a chosen character), put a facedown trauma token on each, and place each matching ally token in its listed location." },

  { ph: 0, exp: "pegasus", t: "New Caprica Board & Occupation Forces", when: c => c.obj === "newCaprica", src: "Pegasus p.6, p.13",
    d: "Set the New Caprica board aside with the Occupation Forces tokens — they are not used until the New Caprica phase is triggered mid-game. (In a ‘No New Caprica’ game with Pegasus, return the New Caprica board and Occupation Forces to the box instead.)" },

  { ph: 0, exp: "daybreak", t: "Demetrius Board (Search for Home)", when: c => c.obj === "earth", src: "Daybreak p.14",
    d: "Place the Demetrius board to the left of the main board. Leave room for the Rebel Basestar board — but do NOT place the Rebel Basestar board or the basestar allegiance marker until the ‘Cylon Civil War’ Mission card instructs you to." },

  /* ---------- Phase 1: Characters & Titles ---------- */
  { ph: 1, exp: "base", t: "Determine First Player", src: "Base p.5 · v4.4 p.3",
    d: "Randomly choose the first player and give them the current player token. They choose a character first and take the first turn." },

  { ph: 1, exp: "pegasus", t: "Add Pegasus Characters", when: c => c.has("pegasus"), src: "Pegasus p.6 · v4.4 p.7",
    d: "Before anyone chooses, add the 7 Pegasus character sheets (including Cylon Leaders) to the available pool." },

  { ph: 1, exp: "exodus", t: "Add Exodus Characters", when: c => c.has("exodus"), src: "Exodus p.5 · v4.4 p.9",
    d: "Before anyone chooses, add the 4 Exodus character sheets and tokens (with piloting token) to the pool." },

  { ph: 1, exp: "daybreak", t: "Add Daybreak Characters", when: c => c.has("daybreak"), src: "Daybreak p.4–5 · v4.4 p.12",
    d: "Before anyone chooses, add the Daybreak character sheets. These include alternate versions of Lee, Zarek, Helo and Baltar — only one version of each may be in play, but count both versions when judging the most plentiful type." },

  { ph: 1, exp: "base", t: "Choose & Place Characters", src: "Base p.5 · v4.4 p.3",
    d: "With all expansion characters now in the pool, clockwise from the first player each chooses a character of the most plentiful type (political leader, military leader, or pilot; support characters are unrestricted). Take the sheet, token and piloting token if any; place the token on the location named on the sheet." },

  { ph: 1, exp: "daybreak", t: "Miracle Tokens", when: c => c.has("daybreak"), src: "Daybreak p.4 · v4.4 p.12",
    d: "Give each player 1 miracle token, placed on their character sheet after they choose. Remaining tokens form a supply pile." },

  { ph: 1, exp: "daybreak", t: "Cylon Leader (Daybreak rules)", when: c => c.opt("cylonLeaders") && c.has("daybreak"), src: "Daybreak p.5, p.8 · FAQ",
    d: "One player may take a Cylon Leader, using Daybreak's Cylon Leader rules: they take the Infiltration Reference Card and draw Motive cards. Pegasus Agenda cards and Infiltration card are NOT used. A Cylon Leader draws only <b>2</b> Skill cards at the start of the game (from their own skill set), not 3 — except a Cylon Leader who begins the game Infiltrating (e.g. Athena), who draws 3. Never at 3 players; one player must be a Cylon Leader at 7." },

  { ph: 1, exp: "pegasus", t: "Cylon Leader (Pegasus rules)", when: c => c.opt("cylonLeaders") && c.has("pegasus") && !c.has("daybreak"), src: "Pegasus p.10–11 · FAQ",
    d: "One player may take a Cylon Leader with a Hostile or Sympathetic Agenda (drawn per player count). A Cylon Leader draws only <b>2</b> Skill cards at the start of the game (from their own skill set), not 3. Never in a 3-player game." },

  { ph: 1, exp: "base", t: "Distribute Title Cards", src: "Base p.5 · v4.4 p.3",
    d: "President → first available of Roslin, Zarek, Baltar. Admiral → first available of Adama, Tigh, Helo. The Admiral takes the 2 nuke tokens; the President shuffles the Quorum deck and draws 1 Quorum card." },

  { ph: 1, exp: "pegasus", t: "New Caprica Title Cards", when: c => c.obj === "newCaprica", src: "Pegasus p.6",
    d: "Use the Pegasus President and Admiral Title cards in place of the core Title cards." },

  { ph: 1, exp: "exodus", t: "CAG & Alternate Admiral Titles", when: c => c.opt("cylonFleet"), src: "Exodus p.12, p.14 · v4.4 p.9",
    d: "Give the CAG Title to the character highest in the CAG Line of Succession, and the Alternate Admiral Title to the character highest in the Admiral Line of Succession. Return the core-game Admiral Title card to the box." },

  /* ---------- Phase 2: Cards, Decks & Objective ---------- */
  { ph: 2, exp: "base", t: "Set Up Skill Decks", src: "Base p.5 · v4.4 p.3",
    d: "Separate the Skill cards into 5 decks by type, shuffle each, and place them facedown under their matching colored regions." },

  { ph: 2, exp: "pegasus", t: "Pegasus Skill Cards", when: c => c.has("pegasus"), src: "Pegasus p.6 · v4.4 p.7",
    d: "Add the new Pegasus Skill cards to their decks. Remove the core 'Investigative Committee' Politics cards (return to box)." },

  { ph: 2, exp: "exodus", t: "Exodus Skill Cards", when: c => c.has("exodus"), src: "Exodus p.5 · v4.4 p.9",
    d: "Shuffle the new Exodus Skill cards into their respective decks." },

  { ph: 2, exp: "daybreak", t: "Daybreak Skill Cards", when: c => c.has("daybreak"), src: "Daybreak p.5 · v4.4 p.12",
    d: "Shuffle the new Daybreak Skill cards into their respective decks." },

  { ph: 2, exp: "daybreak", t: "Treachery Deck", when: c => c.has("daybreak"), src: "Daybreak p.5, p.16",
    d: "Shuffle the Daybreak Treachery deck and place it to the right of the Engineering deck. If Pegasus is in play, its Treachery cards are NOT mixed in — return the Pegasus Treachery cards (and Agenda / Sympathetic Cylon cards) to the box." },

  { ph: 2, exp: "pegasus", t: "Treachery Deck", when: c => c.has("pegasus") && !c.has("daybreak"), src: "Pegasus p.6 · v4.4 p.7",
    d: "Shuffle the Pegasus Treachery cards and place them below the area marked for them on the Pegasus board." },

  { ph: 2, exp: "base", t: "Set Up Other Card Decks", src: "Base p.5 · v4.4 p.3",
    d: "Shuffle the Quorum, Crisis, Super Crisis and Destination decks and place them by the board." },

  { ph: 2, exp: "pegasus", t: "Pegasus Crisis / Quorum / Destination / Super Crisis", when: c => c.has("pegasus"), src: "Pegasus p.6 · v4.4 p.7",
    d: "Shuffle the new Pegasus Crisis, Destination, Quorum and Super Crisis cards into their decks." },

  { ph: 2, exp: "pegasus", t: "New Caprica Crisis Cards", when: c => c.obj === "newCaprica", src: "Pegasus p.6",
    d: "Shuffle the New Caprica Crisis cards and set them aside — they are used only during the New Caprica phase (not in a ‘No New Caprica’ game)." },

  { ph: 2, exp: "exodus", t: "Exodus Crisis / Quorum / Super Crisis / Destination", when: c => c.has("exodus"), src: "Exodus p.5 · v4.4 p.9",
    d: "Shuffle the new Exodus cards into their decks. If NOT using the Cylon Fleet option, return the 'CAG Chooses' Crisis and Super Crisis cards to the box." },

  { ph: 2, exp: "daybreak", t: "Daybreak Crisis & Mutiny Deck", when: c => c.has("daybreak"), src: "Daybreak p.5 · v4.4 p.12",
    d: "Shuffle the new Daybreak Crisis cards into the Crisis deck. Shuffle the Mutiny deck and place it facedown next to the Crisis deck." },

  { ph: 2, exp: "daybreak", t: "Remove Cylon-Attack Cards (Cylon Fleet)", when: c => c.has("daybreak") && c.opt("cylonFleet"), src: "Daybreak p.17 · v4.4 p.15",
    d: "When combining Daybreak's Cylon Fleet play, return all Cylon-attack Crisis cards from the Daybreak expansion to the box." },

  { ph: 2, exp: "daybreak", t: "Motive Cards", when: c => c.opt("cylonLeaders") && c.has("daybreak"), src: "Daybreak p.5",
    d: "Shuffle the Motive deck and set it next to the board for the Cylon Leader. (If no Cylon Leader is chosen, box the Motive cards and Infiltration Reference Card.)" },

  { ph: 2, exp: "pegasus", t: "Agenda Cards", when: c => c.opt("cylonLeaders") && c.has("pegasus") && !c.has("daybreak"), src: "Pegasus p.6, p.10",
    d: "Separate the Agenda cards into Sympathetic and Hostile decks for the Cylon Leader." },

  /* Objective card — exactly one, defined by the selected mode. */
  { ph: 2, exp: "base", t: "Objective Card — Kobol", when: c => c.obj === "kobol", src: "Base p.5 · v4.4 p.3",
    d: "Place the Kobol Objective Card faceup next to the Destination deck." },
  { ph: 2, exp: "pegasus", t: "Objective Card — New Caprica", when: c => c.obj === "newCaprica", src: "Pegasus p.6",
    d: "Place the New Caprica Objective Card next to the Destination deck and return the Kobol Objective Card to the box." },
  { ph: 2, exp: "exodus", t: "Objective Card — Ionian Nebula", when: c => c.obj === "ionianNebula", src: "Exodus p.16",
    d: "Place the Ionian Nebula Objective Card in place of Kobol, and set out the Ally cards and Crossroads cards for the Crossroads phase." },
  { ph: 2, exp: "daybreak", t: "Objective Card — Earth (Search for Home)", when: c => c.obj === "earth", src: "Daybreak p.14",
    d: "Shuffle the Mission deck and place it next to the Demetrius board. Place the Earth Objective Card next to the Destination deck (it defines the sleeper-agent phase and victory) and return the Kobol Objective Card to the box." },

  /* ---------- Phase 3: Loyalty & Final Steps ---------- */
  /* Loyalty deck — single governing version (precedence baked into when). */
  { ph: 3, exp: "daybreak", t: "Set Up Loyalty Deck", when: c => c.has("daybreak"), src: "Daybreak p.6–7",
    d: "Build the Loyalty deck using Daybreak's 'Creating the Loyalty Deck' Chart (p.6–7) — this governs even when combined with other expansions. The chart decides whether the 'You Are a Mutineer' card is included for this player count / Cylon Leader combination (see the exact composition in the Loyalty Deck panel below). Deal one card facedown to each player." },
  { ph: 3, exp: "exodus", t: "Set Up Loyalty Deck", when: c => c.has("exodus") && !c.has("daybreak"), src: "Exodus p.6, p.22 · v4.4 p.9",
    d: "Build the Loyalty deck using the Exodus chart. With a Cylon Leader, use the Exodus + Cylon Leader mix (Exodus p.22). With Conflicted Loyalties, add the Personal Goal / Final Five cards. Deal one card facedown to each player." },
  { ph: 3, exp: "pegasus", t: "Set Up Loyalty Deck", when: c => c.has("pegasus") && !c.has("exodus") && !c.has("daybreak"), src: "Base p.6 + Pegasus p.7",
    d: "Build the Loyalty deck from the base counts plus the new Pegasus Loyalty cards, using Pegasus's revised 'Handing Off Excess Loyalty Cards' rules. Deal one card facedown to each player." },
  { ph: 3, exp: "base", t: "Set Up Loyalty Deck", when: c => !c.has("pegasus") && !c.has("exodus") && !c.has("daybreak"), src: "Base p.6 · v4.4 p.3",
    d: "Build the base Loyalty deck for your player count (see the Loyalty Deck panel) and deal one card facedown to each player." },

  { ph: 3, exp: "exodus", t: "Conflicted Loyalties Cards", when: c => c.opt("conflictedLoyalties"), src: "Exodus p.10 · v4.4 p.9",
    d: "Choose to use the Personal Goal cards, the Final Five cards, or both; return the rest to the box. During the Organize Loyalty Cards step, shuffle the chosen cards into the ‘You Are Not a Cylon’ pile, then build the deck normally. This does NOT change the card count — some ‘You Are Not a Cylon’ cards are now secretly Personal Goal / Final Five cards (both count as ‘You Are Not a Cylon’ for team purposes)." },

  { ph: 3, exp: "pegasus", t: "Sympathetic Cylon (variant)", when: c => c.opt("sympatheticCylon"), src: "Pegasus p.18",
    d: "Selective Variant: use the ‘You Are a Sympathetic Cylon’ card in place of the ‘You Are a Sympathizer’ card when building the Loyalty deck (4- or 6-player games)." },

  { ph: 3, exp: "base", t: "Receive Skills", src: "Base p.5 · v4.4 p.3",
    d: "Every player except the starting player draws 3 Skill cards total from those allowed by their Receive Skills step. The starting player draws at the start of their first turn instead. (A Cylon Leader draws only 2; see above.)" },

  /* Destiny deck — Treachery inclusion superseded by latest Treachery source. */
  { ph: 3, exp: "daybreak", t: "Create Destiny Deck", when: c => c.has("daybreak"), src: "Daybreak p.5",
    d: "Deal 2 Skill cards of each type plus 2 Treachery cards (12 cards total) facedown onto the Destiny deck space and shuffle thoroughly." },
  { ph: 3, exp: "pegasus", t: "Create Destiny Deck", when: c => c.has("pegasus") && !c.has("daybreak"), src: "Pegasus p.6",
    d: "Deal 2 Skill cards of each type plus 2 Treachery cards (12 cards total) facedown onto the Destiny deck space and shuffle thoroughly." },
  { ph: 3, exp: "base", t: "Create Destiny Deck", when: c => !c.has("pegasus") && !c.has("daybreak"), src: "Base p.5 · v4.4 p.3",
    d: "Deal 2 Skill cards of each type (10 cards total) facedown onto the Destiny deck space and shuffle thoroughly." },

  { ph: 3, exp: "base", t: "Set Up Ships", src: "Base p.5 · v4.4 p.3",
    d: "Place 1 basestar and 3 raiders in front of Galactica. Place 2 vipers below Galactica and 2 civilian ships behind it (see the Ship Setup diagram)." }
];

/* ---- Diagrams shown for whatever is in play ------------------------------ */
/* Relevant charts & diagrams, each shown only when it applies to the setup.
   group: "setup" (placement) or "reference" (play aids). when: (c)=>bool. */
BSG.diagrams = [
  { src: "images/charts/ship-setup.png?v=3", group: "setup", when: () => true,
    caption: "Starting ship layout — 1 basestar + 3 raiders in front, 2 vipers below, 2 civilians behind (base p.5)" },
  { src: "images/base-board-08.png", group: "setup", when: () => true, tall: true,
    caption: "Game Board Breakdown — where each deck, dial and space goes (base p.8)" },
  { src: "images/charts/new-caprica-board.png", group: "setup", when: c => c.obj === "newCaprica", tall: true,
    caption: "New Caprica Board Setup — character & civilian-ship placement for the occupation phase (Pegasus p.13)" },

  { src: "images/charts/lines-of-succession-v44p16.png", group: "reference", tall: true,
    when: c => c.has("pegasus") || c.has("exodus") || c.has("daybreak"),
    caption: "Revised Lines of Succession — Admiral & President title order with expansion characters (v4.4 p.16)" }
];

/* Combined Combat Reference — merges the unique content of v4.4 p.6 (base) and
   p.14 (Daybreak/Cylon Fleet). The Attack Table always uses p.14 (image, with
   icons); the surrounding rules are merged text. Sections tagged "fleet" only
   apply when the Cylon Fleet board is in play. */
BSG.combat = {
  attackTableImg: "images/charts/combat-attack-table-p14.png",
  attackTableNote: "Attack Table from v4.4 p.14 (includes the assault raptor and nuke results).",
  sections: [
    { h: "Activating a Viper", items: [
      "When you activate a viper, choose one: <b>Launch a Viper</b>, <b>Move a Viper</b>, or <b>Attack with a Viper</b>.",
      "Viper Mark VIIs may move <b>2</b> space areas instead of 1.",
      "Instead of moving or attacking, a viper may <b>escort a civilian ship to safety</b>: choose 1 civilian ship in the viper's space area and shuffle it back into the pile of unused civilian ships."
    ]},
    { h: "Cylon Ship Activation", items: [
      { icon: "cs-raider", t: "<b>Activate Raiders:</b> each raider carries out only the first action it can — 1) Attack a Viper (unmanned if able, else a piloted viper); 2) Destroy a Civilian Ship (current player chooses); 3) Move 1 area toward the nearest civilian ship (if tied, clockwise around Galactica); 4) Attack Galactica. If no raiders are in play, 2 raiders launch from each basestar." },
      { icon: "cs-launch", t: "<b>Launch Raiders:</b> each basestar launches 3 raiders." },
      { icon: "cs-heavy", t: "<b>Activate Heavy Raiders &amp; Centurions:</b> heavy raiders move toward the nearest area with a viper-launch icon. If a heavy raider starts its move on a launch-icon space, remove it and place a centurion on the start of the Boarding Party track. Thereafter each centurion moves 1 space toward the Humans Lose space. If no heavy raiders are in play, one launches from each basestar." },
      { icon: "cs-basestar", t: "<b>Activate Basestars:</b> the current player rolls a D8 for each basestar to find out if Galactica is damaged." }
    ]},
    { h: "Cylon Fleet — when “nothing happens”", fleet: true, items: [
      { icon: "cs-raider", t: "<b>Raiders:</b> if no raiders or basestars are on the main board, put 1 raider on the Cylon Fleet board and advance Cylon pursuit 1 space." },
      { icon: "cs-launch", t: "<b>Launch Raiders / Activate Basestars:</b> if no basestars are on the main board, put 1 basestar on the Cylon Fleet board and advance pursuit 1 space." },
      { icon: "cs-heavy", t: "<b>Heavy Raiders / Centurions:</b> if no heavy raiders, centurions, or basestars are on the main board, put 1 heavy raider on the Cylon Fleet board and advance pursuit 1 space." }
    ]},
    { h: "Cylon Pursuit Track", fleet: true, items: [
      "<b>Civilian ship(s) space:</b> the CAG places 1 or 2 civilian ships on the main board in space areas that don't already have a civilian ship.",
      "<b>Auto Attack space:</b> move all Cylon ships from space areas on the Cylon Fleet board to the corresponding areas on the main board, then move the pursuit marker to the Start space."
    ]},
    { h: "Damage Tokens", items: [
      { icon: "dt-damage-location", t: "<b>Galactica — Damage Location:</b> 6 damaged locations destroy Galactica; characters there go to Sickbay." },
      { icon: "dt-lost-resource", t: "<b>Lost Resource:</b> lose the listed resources, then remove the token from the game." },
      { icon: "dt-critical-hit", t: "<b>Basestar — Critical Hit:</b> counts as 2 damage tokens (3 destroy the basestar)." },
      { icon: "dt-disabled-hangar", t: "<b>Disabled Hangar:</b> may not launch raiders/heavy raiders." },
      { icon: "dt-disabled-weapons", t: "<b>Disabled Weapons:</b> may not attack Galactica." },
      { icon: "dt-structural-damage", t: "<b>Structural Damage:</b> attacks vs. the basestar get +2." }
    ]}
  ]
};

/* ---- HOW TO PLAY — rules reference (concise summaries from all rulebooks) -
   Items: plain string (always shown) OR { t, when?, tag?, src? }.
   `tag` (an expansion id, or a function (c)=>id) marks WHICH expansion's version
   governs where rules overlap — only the applicable version is shown.          */
BSG.howToPlay = {
  /* dynamic governing-source helpers for overlapping rules */
  _treacheryTag: c => c.has("daybreak") ? "daybreak" : "pegasus",
  _hazardTag:    c => c.has("daybreak") ? "daybreak" : "pegasus",
  _abilityTag:   c => c.has("daybreak") ? "daybreak" : "exodus",
  _handoffTag:   c => c.has("daybreak") ? "daybreak" : c.has("exodus") ? "exodus" : "pegasus",

  core: [
    { h: "Turn Sequence", items: [
      "<b>1. Receive Skills</b> — draw the Skill cards listed on your character sheet (choose the split for multi-skill characters). No hand limit while drawing.",
      "<b>2. Movement</b> — move to one location; moving between ships (Galactica ↔ Colonial One ↔ Pegasus) costs 1 Skill card. A pilot may instead move their viper in space, or land it.",
      "<b>3. Action</b> — take ONE: activate your location, play a Skill / Title / Quorum card action, pilot a viper (move or attack), or reveal a ‘You Are a Cylon’ card to use its action.",
      { t: "A Cylon Leader may use the action printed on their character sheet (or a Treachery action) instead of a location action.", when: c => c.opt("cylonLeaders"), tag: "pegasus" },
      "<b>4. Crisis</b> — draw and resolve the top Crisis card (Cylon attack, skill check, or event).",
      "<b>5. Activate Cylon Ships</b> — resolve the activation icon on the Crisis card (see the Combat Reference).",
      "<b>6. Prepare for Jump</b> — if the Crisis shows the jump icon, advance the Jump-Prep track; the fleet jumps when the marker reaches the end.",
      { t: "If the Mutineer’s Crisis has the jump icon, they draw a Mutiny card during this step.", when: c => c.has("daybreak") && BSG.loyalty.compute(c).mutineer, tag: "daybreak" },
      "A <b>revealed Cylon</b> skips steps 4–6 and instead acts against the fleet (see Revealed Cylons).",
      "Discard down to your hand limit (10 Skill cards) at the end of any turn."
    ]},

    { h: "Skill Checks", items: [
      "A check lists a <b>difficulty</b> and one or more required skill <b>colors</b>. Starting left of the current player, each player secretly adds any number of Skill cards to a pile; the current player adds the 2 Destiny-deck cards, shuffles, and splits into matching-color and non-matching piles.",
      "<b>Final strength</b> = matching total − non-matching total. Meet or beat the difficulty to <b>pass</b>; some checks list a partial-pass value between the pass and fail results.",
      "After the last Destiny card is used, the current player rebuilds it (2 of each skill type, shuffled).",
      { t: "<b>Treachery</b> cards count as <b>negative</b> strength in a check (they only count positive at the Airlock / Resistance HQ). Human players may not play Treachery card-<i>actions</i>.", when: c => c.has("pegasus") || c.has("daybreak"), tag: c => BSG.howToPlay._treacheryTag(c) },
      { t: "<b>Skill Check Abilities</b> — a Skill card with the ability icon resolves its text whenever it’s in a check, no matter who played it; the current player resolves them in any order, never the same ability twice.", when: c => c.has("exodus") || c.has("daybreak"), tag: c => BSG.howToPlay._abilityTag(c) },
      { t: "If a Crisis/Super Crisis lists a <b>‘consequence’</b> result, resolve it whether the check passed or failed.", when: c => c.has("exodus") || c.has("daybreak"), tag: "exodus" },
      { t: "<b>Reckless</b> checks (Daybreak): after abilities resolve, flip the top Treachery card — strength &gt; 0 is discarded; strength 0 flips another and both abilities resolve. A ‘Restore Order’ card can’t make a Reckless check, and vice-versa.", when: c => c.has("daybreak"), tag: "daybreak" }
    ]},

    { h: "Crisis Cards", items: [
      "Draw and resolve the top Crisis card: a <b>Cylon attack</b> (follow its steps), a <b>skill check</b>, or an <b>event</b>. Some cards give a choice to the current player, the President, or the Admiral.",
      "Then activate Cylon ships by the card’s icon and check its Prepare-for-Jump icon.",
      "A <b>revealed Cylon</b> may ignore a Crisis card’s negative effects (no discarding cards, no being sent to Sickbay/Brig).",
      { t: "With the <b>Cylon Fleet</b>, the ‘CAG Chooses’ cards are in the deck and Cylon attacks are driven from the Cylon Fleet board; ‘nothing happens’ activations advance the Pursuit track.", when: c => c.opt("cylonFleet"), tag: "exodus" }
    ]},

    { h: "Jumping, Distance & Destinations", items: [
      "The fleet jumps when the Jump-Prep marker reaches the <b>Auto-Jump</b> space, or when a player uses <b>FTL Control</b> (roll a D8; a low roll loses population).",
      "To jump: remove all ships from the board, draw 2 Destination cards and keep 1 (resolve it), then reset the Jump-Prep track. Distance accumulates on the Destination cards beside the Objective card.",
      "The <b>distance to win</b> is set by your Objective card (shown in the mode card above).",
      { t: "Passed <b>Mission</b> cards that show a distance number also count toward your total distance.", when: c => c.obj === "earth", tag: "daybreak" }
    ]},

    { h: "Movement & Locations", items: [
      "Humans may never move to Cylon locations; a revealed Cylon may only move to/among Cylon locations.",
      { t: "<b>Hazardous</b> locations (yellow-striped border) can’t be entered by normal movement — only when a card or effect sends you there.", when: c => c.has("pegasus") || c.has("daybreak"), tag: c => BSG.howToPlay._hazardTag(c) },
      { t: "<b>Movement abilities</b> are used during your Movement step instead of moving (not on another player’s turn, and only one per turn).", when: c => c.has("pegasus") || c.has("daybreak"), tag: "pegasus" },
      { t: "The Daybreak <b>overlays</b> change several locations — e.g. activating ‘Caprica’ no longer skips Prepare for Jump, and the ‘Resurrection Ship’ is hazardous. Read the overlays before playing.", when: c => c.has("daybreak"), tag: "daybreak" }
    ]},

    { h: "Execution", items: [
      "When your character is executed: discard your Skill cards (Quorum cards are unaffected), then <b>Prove Loyalty</b> — if you hold any ‘You Are a Cylon’ card, reveal one and proceed as a Cylon; if all your cards are ‘You Are Not a Cylon,’ reveal them and proceed as a human.",
      "<b>Human:</b> lose 1 morale, return your character to the box, discard your Loyalty cards, then choose a new available character. If no character is available, the humans lose.",
      "<b>Cylon:</b> move to the Resurrection Ship and follow the revealed-Cylon procedure (but you do not draw a Super Crisis card).",
      { t: "A revealed-Cylon executee gives their remaining facedown Loyalty cards to a human player of their choice.", when: c => c.has("pegasus") || c.has("exodus") || c.has("daybreak"), tag: c => BSG.howToPlay._handoffTag(c) },
      { t: "Also add 1 ‘You Are Not a Cylon’ card to the Loyalty deck and draw 1 new Loyalty card (kept hidden); several characters (Boomer, Helo, Apollo, Baltar, Anders) have special post-execution effects.", when: c => c.has("exodus") && !c.has("daybreak"), tag: "exodus" },
      { t: "During ‘Discard Cards’ also discard Mutiny cards and miracle tokens; the new character gains no miracle token. If the executee was the Mutineer, the ‘You Are a Mutineer’ card is kept or passed per the reveal; the alternate Tom Zarek draws a Mutiny card.", when: c => c.has("daybreak"), tag: "daybreak" }
    ]},

    { h: "Revealed Cylons & Infiltration", items: [
      "On revealing as a Cylon: discard down to the hand limit, lose any Titles, move to the Resurrection Ship, take a <b>Super Crisis</b> card, and end your turn (you draw no more Crisis cards).",
      "A revealed Cylon’s turn: draw 2 Skill cards of any type (max 1 per deck), move only among Cylon locations, and use Cylon location actions — skipping the Crisis / Activate-Ships / Prepare-for-Jump steps.",
      { t: "A <b>Cylon Leader</b> is treated as a revealed Cylon EXCEPT while Infiltrating (then they act as a human). They may never hold the President, Admiral, or CAG title.", when: c => c.opt("cylonLeaders"), tag: "pegasus" },
      { t: "<b>Infiltrate</b> by moving to the (revised) Human Fleet location; while infiltrating, draw a Crisis card at the end of your turn. End infiltration by returning to the Resurrection Ship.", when: c => c.opt("cylonLeaders"), tag: "pegasus" }
    ]},

    { h: "Winning &amp; Losing", items: [
      "<b>Humans win</b> by travelling the distance on the Objective card and then making a final jump with every resource above 0.",
      "<b>Cylons win</b> by reducing any resource (food, fuel, morale, population) to 0, by destroying Galactica (enough damage tokens), or by overrunning it with boarding Centurions.",
      "<b>Sleeper Agent phase</b> — partway through the game the remaining Loyalty cards are dealt out (the Objective card sets exactly when), so a loyal human can secretly become a Cylon.",
      { t: "A <b>Cylon Leader</b> wins or loses by their Agenda / Motive cards — a Motive-driven leader can win alongside either side.", when: c => c.opt("cylonLeaders"), tag: c => c.has("daybreak") ? "daybreak" : "pegasus" },
      { t: "Each unrevealed <b>Personal Goal</b> held by a human at game end reduces a resource.", when: c => c.opt("conflictedLoyalties"), tag: "exodus" }
    ]}
  ],

  /* Mode-specific play, keyed by objective id. */
  modes: {
    kobol: { items: [
      "Standard game: reach <b>8 distance</b>, then win on the next jump if all resources are above 0.",
      "The Sleeper Agent phase occurs at distance 4.",
      "Cylons win by draining a resource to 0, destroying Galactica, or boarding it with Centurions."
    ]},
    newCaprica: { items: [
      "Played with the <b>New Caprica Objective card</b> (Pegasus). Mid-game the fleet can be forced down to New Caprica: characters move to the New Caprica board for the occupation phase, which uses its own New Caprica Crisis deck.",
      "Cylons hold humanity prisoner (Occupation Forces, Detention) while humans run a resistance; the Pegasus President & Admiral titles gain occupation-phase abilities. During the phase, players move between New Caprica and Galactica/Pegasus by discarding a Skill card.",
      "Once Galactica returns to orbit and resumes jumping, the Admiral may (as an action) <b>order Galactica to leave</b>, ending the game.",
      "<b>Humans win</b> if — after destroying civilian ships still on New Caprica and executing humans left there — no resource is at 0. <b>Cylons win</b> if a resource hits 0 or at least 6 Galactica locations are damaged."
    ]},
    ionianNebula: { items: [
      "Played with the <b>Ionian Nebula Objective card</b> (Exodus). Characters accumulate <b>Trauma tokens</b> (benevolent, antagonistic, or disaster symbols) from locations, Allies and events.",
      "<b>Allies</b> drawn from the Ally deck may help or harm the fleet; some carry hidden trauma tokens.",
      "After <b>8 distance</b> the game enters the <b>Crossroads phase</b>: each character faces ‘The Trial / Boxing the Line,’ where their accumulated trauma decides who keeps fighting — and loyalties can be added or flipped.",
      "Standard win/loss otherwise applies (reach the distance and final-jump with resources above 0)."
    ]},
    earth: { items: [
      "Played with the <b>Earth Objective card</b> and the Search for Home option (Daybreak): humans must travel <b>10 distance</b>.",
      "Scout by activating the <b>Bridge</b> to reveal a <b>Mission card</b> to the Active Mission space, then resolve its skill check. Note: character/card skill-check abilities (Investigative Committee, Restore Order, Declare Emergency, etc.) do NOT affect Mission checks.",
      "Some passed Missions count as <b>extra distance</b> (shown by a number on the card). The Demetrius and (later, via the ‘Cylon Civil War’ Mission) Rebel Basestar boards grant powerful actions; the basestar allegiance marker decides who may use the Rebel Basestar.",
      "Supports up to 7 players (one must be a Cylon Leader at 7). The Earth Objective card sets the sleeper-agent timing and final victory."
    ]}
  },

  /* Module-specific play (gated by the active option / expansion). */
  modules: [
    { id: "cylonLeaders", when: c => c.opt("cylonLeaders"), h: "Cylon Leaders", items: [
      { t: "A Cylon Leader is <b>known to be a Cylon</b> from the start. Instead of a Loyalty card they receive ONE secret <b>Agenda</b> card — Hostile or Sympathetic, drawn by player count — that sets whether they win with the humans or the Cylons.", when: c => c.has("pegasus") && !c.has("daybreak"), tag: "pegasus" },
      { t: "A Cylon Leader is <b>known to be a Cylon</b> from the start. Instead of Loyalty cards they receive secret <b>Motive</b> cards — 2 at setup and 2 more during the Sleeper phase (4 total) — which set their true allegiance and can let them win with EITHER side.", when: c => c.has("daybreak"), tag: "daybreak" },
      "They draw only <b>2</b> Skill cards at the start (from their own skill set; an Infiltrator draws 3, and Athena begins the game Infiltrating so draws 3), have always-on character abilities, and may never be President, Admiral or CAG.",
      "<b>When NOT Infiltrating</b>, a Cylon Leader is treated as a revealed Cylon: they may only move to / among the <b>Cylon locations</b> and use Cylon location actions.",
      { t: "<b>To Infiltrate</b> — activate the revised <b>‘Human Fleet’</b> Cylon location, then move from there to any Galactica location. While Infiltrating they act as a human: move only to human-available locations (never Cylon locations), draw a Crisis card at the end of their turn, draw 1 extra Skill card at Receive Skills (3 total), use Skill-card text abilities (but not Treachery), and play at most 2 Skill cards per check (1 while in the Brig).", tag: c => c.has("daybreak") ? "daybreak" : "pegasus" },
      { t: "<b>To stop Infiltrating</b> — return to the <b>‘Resurrection Ship’</b> as an action (if in the Brig, first discard down to 3 Skill cards). They are then no longer Infiltrating and go back to moving among the Cylon locations. Returning to the Resurrection Ship for <i>any</i> reason — including being executed — ends Infiltration.", tag: c => c.has("daybreak") ? "daybreak" : "pegasus" },
      { t: "<b>Winning:</b> the Cylon Leader wins with the side named on their <b>Agenda</b> card, but only if <b>every</b> condition listed on it is met by the end of the game. (Infiltrating does not change their allegiance.)", when: c => c.has("pegasus") && !c.has("daybreak"), tag: "pegasus" },
      { t: "<b>Winning:</b> reveal a <b>Motive</b> card any time its condition is currently met (even at game end, based on the final state). To win with the winning side, at game end you must have revealed <b>at least 2</b> Motives matching that side AND have <b>no more than 1</b> unrevealed Motive. A leader showing 2 human + 2 Cylon Motives can win alongside <i>either</i> side. (Infiltrating does not change their allegiance.)", when: c => c.has("daybreak"), tag: "daybreak" }
    ]},
    { id: "conflictedLoyalties", when: c => c.opt("conflictedLoyalties"), h: "Conflicted Loyalties", items: [
      "Choose to use the <b>Personal Goal</b> cards, the <b>Final Five</b> cards, or both; return the rest to the box. (Personal Goals make the game much harder for humans — recommended for experienced players.)",
      "<b>How it changes Loyalty-deck creation:</b> during the <b>Organize Loyalty Cards</b> step, shuffle the chosen Personal Goal / Final Five cards into the <b>‘You Are Not a Cylon’ pile</b>, then build the deck with the normal chart. This does <b>NOT change how many cards are dealt</b> — some ‘You Are Not a Cylon’ cards are now secretly Personal Goal / Final Five cards. Both types count as ‘You Are Not a Cylon’ when deciding whether a player is human or Cylon.",
      "<b>Personal Goal:</b> reveal it as an action only when <i>all</i> its conditions are currently true. If revealed at <b>6 or less</b> distance, add the top ‘You Are Not a Cylon’ card to the Loyalty deck, reshuffle, and draw a new (hidden) Loyalty card; at <b>7 or more</b> distance, draw nothing. Each <i>unrevealed</i> Personal Goal held by a human at game end reduces a resource — if that drops one to 0, the Cylons win. (A revealed Cylon’s unrevealed Personal Goal does not reduce a resource.)",
      "<b>Final Five:</b> the card reads ‘You Are Not a Cylon,’ but the character is one of the Final Five models. It works as a Not-a-Cylon card <b>unless</b> the player also holds a ‘You Are a Cylon’ card — then they are treated as a Cylon. If anyone looks at another player’s Final Five card they must immediately reveal it and return it (the owner resolves its text, then re-hides it). A Final-Five human (no ‘You Are a Cylon’ card) who is executed is removed from play and resolves the execution as a human."
    ]},
    { id: "cylonFleet", when: c => c.opt("cylonFleet"), h: "Cylon Fleet", items: [
      "Adds the Cylon Fleet board with the <b>Basestar Bridge</b> (a Cylon location) and a <b>Pursuit track</b>.",
      "Cylon ‘nothing happens’ activations and certain effects advance the Cylon pursuit marker; when it reaches the end, Cylon ships jump from the Cylon Fleet board to the corresponding areas around Galactica.",
      "The <b>CAG</b> title (its own line of succession) is in play; at Civilian-ship pursuit spaces the CAG places civilian ships, and an Infiltrating Cylon Leader may never become CAG.",
      { t: "With Search for Home also in play: while the basestar allegiance marker shows its Cylon side, Cylon players may discard a Skill card to travel between the <b>Basestar Bridge</b> and any Rebel Basestar location.", when: c => c.obj === "earth", tag: "daybreak" }
    ]},
    { id: "mutiny", when: c => c.has("daybreak") && BSG.loyalty.compute(c).mutineer, h: "The Mutineer", items: [
      "This setup includes the <b>‘You Are a Mutineer’</b> Loyalty card: the Mutineer is a human loyalist working against the fleet’s leadership, and reveals immediately upon receiving the card (and draws an extra Loyalty card and a Mutiny card).",
      "<b>Mutiny cards</b> are drawn and played as actions to help humanity — but holding a second Mutiny card sends you to the <b>Brig</b> (the Mutineer may hold two before going). Cylon players cannot draw or play Mutiny cards."
    ]},
    { id: "sympatheticCylon", when: c => c.opt("sympatheticCylon"), h: "Sympathetic Cylon (variant)", items: [
      "Replaces the Sympathizer with the ‘You Are a Sympathetic Cylon’ card: a human who receives it during the Sleeper phase immediately becomes a <b>revealed Cylon</b> and draws a Sympathetic Agenda.",
      "The Sympathetic Cylon must meet every condition on their Agenda card to win, and may Infiltrate like a Cylon Leader. (Not used when Daybreak is in play.)"
    ]}
  ]
};

/* ---- Contextual FAQ — official rulings, surfaced for the active setup ---- */
/* q/a are concise paraphrases of the official BSG FAQ. when: (c)=>bool. */
BSG.faq = [
  { q: "Multiple Cylon-ship activation icons on one Crisis card?",
    a: "Resolve each one separately, in left-to-right order." },
  { q: "Can a die roll end up above 8 or below 1?",
    a: "No — after all modifiers, anything over 8 counts as 8 and anything under 1 counts as 1." },
  { q: "A Skill deck (and its discard pile) runs out of cards?",
    a: "No one can draw that Skill type until some of those cards are discarded back." },
  { q: "Launch a viper from Command, then move or attack with it the same turn?",
    a: "Yes — there's no limit to how many times an unmanned viper can be activated in a turn." },
  { q: "What can you do while in the Brig?",
    a: "Any actions you like — only your movement and your participation in skill checks (1 card per check) are restricted." },
  { q: "You're in the Brig and a card sends you to Sickbay?",
    a: "You are NOT moved (this changed from earlier rulings)." },
  { q: "Send someone to the Brig/Sickbay who's already there — or a revealed Cylon?",
    a: "No — you also can't choose Helo before he's on the board." },
  { q: "What does a player lose on revealing as a Cylon?",
    a: "They can no longer be targeted by Executive Order or Quorum cards, their 'keep in play' Quorum cards are discarded, and a piloted viper returns to the Reserves." },
  { q: "Is FTL Control still usable while damaged?",
    a: "Yes — the fleet can still advance the Jump-Prep track and Auto-Jump." },
  { q: "A revealed Cylon receives the Sympathizer card?",
    a: "They may first give it to any other player, who then immediately resolves it.",
    when: c => BSG.loyalty.compute(c).sympathizer },
  { q: "An unrevealed Cylon receives the Sympathizer card?",
    a: "They follow the card. If it sends them to the Brig they stay an unrevealed Cylon (and may reveal later); otherwise they may pass their other Loyalty cards.",
    when: c => BSG.loyalty.compute(c).sympathizer },
  { q: "How many Skill cards does a Cylon Leader draw at the start of the game?",
    a: "Two — they can never exceed their skill set. (Three if they begin the game Infiltrating, like Athena.)",
    when: c => c.opt("cylonLeaders"), tag: "pegasus" },
  { q: "Can an Infiltrating Cylon Leader be given the 'Assign Vice President' Quorum card?",
    a: "No. They may receive other Quorum cards (e.g. Assign Mission Specialist / Arbitrator), but discard any Quorum cards they were given, without effect, when their Infiltration ends.",
    when: c => c.opt("cylonLeaders"), tag: "pegasus" },
  { q: "Can a character in the Brig or Detention use Movement abilities?",
    a: "No — movement is restricted in those locations, so Movement abilities can't be used from them.",
    when: c => c.obj === "newCaprica", tag: "pegasus" }
];

/* ---- Location reference — what each board location does, filtered to the
   boards in your setup, with the Daybreak-overlay versions where they differ.
   Concise functional summaries (exact wording is printed on each board). ---- */

/* ============================================================================
   LOCATION REFERENCE
   Source: consolidated BSG location reference (Base / Pegasus / Exodus / Daybreak),
   transcribed from the user-supplied "BSG Locations (Updated)" sheet.
   Display conditions are baked in per board / per location:
     - Colonial One splits into an ORIGINAL version (no Mutiny cards) and a
       MUTINY version that the Daybreak overlay uses.
     - Cylon locations show base text always, with Daybreak-overlay variants
       tagged and gated.
   ========================================================================== */
BSG.locationBoards = [
  { id: "galactica",  name: "Galactica",                          when: () => true },
  { id: "colonial",   name: "Colonial One",                       when: () => true },
  { id: "cylon",      name: "Cylon Locations (revealed Cylon only)", when: () => true },
  { id: "vipers",     name: "Vipers in Space",                    when: () => true },
  { id: "pegasus",    name: "Pegasus Battlestar",                 when: c => c.has("pegasus") },
  { id: "cylonfleet", name: "Cylon Fleet Board — Basestar Bridge", when: c => c.opt("cylonFleet") },
  { id: "newcaprica", name: "New Caprica (during Occupation)",    when: c => c.obj === "newCaprica" },
  { id: "demetrius",  name: "Demetrius (Search for Home)",        when: c => c.obj === "earth" },
  { id: "rebel",      name: "Rebel Basestar (Search for Home)",   when: c => c.obj === "earth" },
];

BSG.locations = [
  /* ---- GALACTICA (always) ---- */
  { b: "galactica", n: "FTL Control", a: "Jump the fleet if the Jump-Prep track isn't in the red zone. Roll a die; on 1–6 lose the population shown on the fleet's current Jump-Prep space." },
  { b: "galactica", n: "Weapons Control", a: "Attack one Cylon ship with Galactica. Roll to hit:<ul class=\"loc-sub rolls\"><li>Raider — hit on <b>3–8</b></li><li>Heavy raider — hit on <b>7–8</b></li><li>Basestar — hit on <b>5–8</b></li></ul>" },
  { b: "galactica", n: "Command", a: "Activate up to two unmanned vipers. Each activation can:<ul class=\"loc-sub\"><li>Launch a viper from a launch zone, or</li><li>Move an unmanned viper to an adjacent area, or</li><li>Fire its weapons (raider <b>3–8</b>, heavy raider <b>7–8</b>, basestar <b>8</b>).</li></ul>" },
  { b: "galactica", n: "Communications", a: "Look at the backs of 2 civilian ships; you may then move them to adjacent area(s). Only you may look." },
  { b: "galactica", n: "Admiral's Quarters", a: "Choose a character; pass the listed skill check to send them to the Brig. (Brigged characters add only 1 card to checks, and a Cylon there does no damage when revealed.)" },
  { b: "galactica", n: "Research Lab", a: "Draw 1 Engineering or 1 Tactics Skill card." },
  { b: "galactica", n: "Research Lab", a: "Variant: instead, pass a 10 (Purple/Blue) check to gain a Miracle Token.", when: c => c.has("daybreak"), tag: "daybreak" },
  { b: "galactica", n: "Hangar Deck", a: "Launch yourself in a viper, then take 1 more action. You must be here to use a 'Repair' Skill-card action on damaged vipers." },
  { b: "galactica", n: "Armory", a: "Attack a Centurion on the Boarding Party track (destroyed on 7–8)." },
  { b: "galactica", n: "Sickbay", a: "Draw only 1 Skill card at your Receive Skills step. A character can (and should) move out of Sickbay during their Movement step." },
  { b: "galactica", n: "Brig", a: "You may not move, draw Crisis cards, or add more than 1 card to skill checks. Action: pass the listed skill check to move to any location." },

  /* ---- COLONIAL ONE — ORIGINAL (no Mutiny cards) ---- */
  { b: "colonial", n: "Press Room", a: "Draw 2 Politics Skill cards.", when: c => !c.has("daybreak") },
  { b: "colonial", n: "President's Office", a: "If you are the President, draw 1 Quorum card, then either:<ul class=\"loc-sub\"><li>Draw 1 additional Quorum card, or</li><li>Play 1 Quorum card from your hand.</li></ul>", when: c => !c.has("daybreak") },
  { b: "colonial", n: "Administration", a: "Choose a character, then pass a 5 (Yellow/Green) check to give them the President Title. A revealed Cylon may not be given the Title.", when: c => !c.has("daybreak") },

  /* ---- COLONIAL ONE — MUTINY version (Daybreak overlay) ---- */
  { b: "colonial", n: "Quorum Chamber", a: "If you are the President, draw 1 Quorum card, then either:<ul class=\"loc-sub\"><li>Draw 1 additional Quorum card, or</li><li>Play 1 Quorum card from your hand.</li></ul>", when: c => c.has("daybreak"), tag: "daybreak" },
  { b: "colonial", n: "Press Room", a: "Choose a player to draw 1 Mutiny card (they do NOT move to the Brig); they keep 1 Mutiny card and discard the rest. You may then discard a Mutiny card.", when: c => c.has("daybreak"), tag: "daybreak" },
  { b: "colonial", n: "President's Office", a: "Draw 2 Politics Skill cards.", when: c => c.has("daybreak"), tag: "daybreak" },
  { b: "colonial", n: "Administration", a: "Draw 1 Mutiny card. If the President has any Mutiny cards, choose a player to gain the President Title. (If 'Accept Prophecy' is in play, the President may discard it to keep the Title.)", when: c => c.has("daybreak"), tag: "daybreak" },
  { b: "colonial", n: "Note", a: "A character moving from Galactica to Colonial One must discard a Skill card.", when: c => c.has("daybreak"), tag: "daybreak" },

  /* ---- CYLON LOCATIONS (always; revealed Cylon only) ---- */
  { b: "cylon", n: "Caprica", a: "Choose one:<ul class=\"loc-sub\"><li>Play 1 of your Super Crisis cards.</li><li>Draw 2 Crisis cards, resolve 1, and discard the other.</li></ul><span class=\"loc-after\">During that Crisis there are no Activate-Cylon-Ships or Prepare-for-Jump steps.</span>", when: c => !c.has("daybreak") },
  { b: "cylon", n: "Caprica", a: "Choose one:<ul class=\"loc-sub\"><li>Play 1 of your Super Crisis cards.</li><li>Draw 2 Crisis cards, resolve 1, and discard the other.</li></ul><span class=\"loc-after\">During that Crisis there is no Activate-Cylon-Ships step, but you DO still Prepare for Jump.</span>", when: c => c.has("daybreak"), tag: "daybreak" },
  { b: "cylon", n: "Cylon Fleet", a: "Choose one:<ul class=\"loc-sub\"><li>Activate all Cylon ships of one type, or</li><li>Launch 2 raiders and 1 heavy raider from each basestar.</li></ul><span class=\"loc-after\">Activating heavy raiders advances the Centurions 1 step on the Boarding Party track, even if none are on the board.</span>" },
  { b: "cylon", n: "Human Fleet", a: "Choose one:<ul class=\"loc-sub\"><li>Look at any player's hand and steal 1 Skill card, then roll a die — <b>5+</b> damages Galactica.</li><li>Look at the top Crisis or Destination card and place it on the top or bottom of that deck, then draw 2 Skill cards.</li></ul>" },
  { b: "cylon", n: "Human Fleet", a: "Cylon Leader option: instead, Infiltrate Galactica.", when: c => c.opt("cylonLeaders"), tag: "daybreak" },
  { b: "cylon", n: "Resurrection Ship", a: "You may discard your Super Crisis card to draw a new one. Then, if distance is 7 or less, give your unrevealed Loyalty card(s) to any player.", when: c => !c.has("daybreak") },
  { b: "cylon", n: "Resurrection Ship", a: "While here, draw only 1 Skill card at your Draw-Skills step. Action: draw 1 Super Crisis card.", when: c => c.has("daybreak"), tag: "daybreak" },
  { b: "cylon", n: "Hub Destroyed", a: "At your Draw-Skills step, discard all your Super Crisis cards and draw no Skill cards. Action: discard 3 Skill cards to draw 1 Super Crisis card and move to the Cylon Fleet location.", when: c => c.has("daybreak"), tag: "daybreak" },

  /* ---- VIPERS IN SPACE (always) ---- */
  { b: "vipers", n: "Activating an unmanned viper", a: "Choose one:<ul class=\"loc-sub\"><li>Launch a viper from the Reserves, or</li><li>Move a deployed viper to an adjacent space area, or</li><li>Attack a Cylon ship with a viper in the same space area.</li></ul>" },
  { b: "vipers", n: "Viper pilot in space", a: "Choose one:<ul class=\"loc-sub\"><li>Move to an adjacent space area, or</li><li>Attack a Cylon ship in your space area.</li></ul>" },
  { b: "vipers", n: "Viper pilot in space", a: "Also: escort a civilian ship to safety (reserves).", when: c => c.opt("cylonFleet") || c.has("exodus"), tag: "exodus" },

  /* ---- PEGASUS BATTLESTAR (Pegasus in play) ---- */
  { b: "pegasus", n: "Pegasus CIC", a: "Choose a basestar and roll a die:<ul class=\"loc-sub rolls\"><li><b>1–3</b> — damage Pegasus</li><li><b>4–6</b> — damage the basestar</li><li><b>7–8</b> — damage the basestar twice</li></ul>" },
  { b: "pegasus", n: "Airlock", a: "Choose a character and pass a skill check to execute them. Treachery, Politics and Tactics count positive; target is 12+ (or 8 if the character is in the Brig)." },
  { b: "pegasus", n: "Main Batteries", a: "Choose a space area and roll a die:<ul class=\"loc-sub rolls\"><li><b>1</b> — destroy 1 civilian ship</li><li><b>2–3</b> — damage 1 viper</li><li><b>4–6</b> — destroy 2 raiders</li><li><b>7–8</b> — destroy 4 raiders</li></ul>" },
  { b: "pegasus", n: "Engine Room", a: "Discard 2 Skill cards to treat the next Crisis card drawn this turn as if it had a 'Prepare for Jump' icon." },

  /* ---- CYLON FLEET BOARD — Basestar Bridge (Cylon Fleet option) ---- */
  { b: "cylonfleet", n: "Basestar Bridge", a: "Choose 2 of the following:<ul class=\"loc-sub\"><li>The CAG must place 1 civilian ship (following all placement rules).</li><li>Roll a die: 1–3 decrease the Jump track by 1; 4–8 increase the Pursuit track by 1.</li><li>Place 1 basestar or 3 raiders in any 1 area of this Cylon basestar region.</li><li>Roll a die: if the result is less than the number of raiders on the main board, draw 2 Galactica damage tokens and resolve 1.</li></ul>" },

  /* ---- NEW CAPRICA (New Caprica objective, Occupation phase) ---- */
  { b: "newcaprica", n: "Attack Occupation Forces (Human)", a: "Roll a die; on 5+ destroy an occupation force in your location. You may discard a 'Maximum Firepower' Skill card to reroll the attack die." },
  { b: "newcaprica", n: "Detain a Human (Cylon)", a: "If you're in a location with a human character and an occupation force, roll a die:<ul class=\"loc-sub rolls\"><li><b>1–3</b> — move the human to Detention</li><li><b>4–7</b> — move the human to the Medical Center</li></ul>" },
  { b: "newcaprica", n: "Medical Center", a: "You may only draw 1 Skill card during your Receive Skills step." },
  { b: "newcaprica", n: "Detention", a: "You may not move or add more than 2 cards to skill checks. Action: pass a 9 (Yellow/Purple) check to move to any location." },
  { b: "newcaprica", n: "Resistance HQ (Human)", a: "Choose a character on New Caprica (human or Cylon), then pass a 7 (Green/Purple/Brown) check to execute them." },
  { b: "newcaprica", n: "Occupation Authority", a: "<ul class=\"loc-sub roles\"><li><span class=\"role-h\">Human</span> (if President): draw 1 Quorum card, then you may play 1 Quorum card.</li><li><span class=\"role-c\">Cylon</span>: activate 1 occupation force, then place 1 occupation force on this location.</li></ul>" },
  { b: "newcaprica", n: "Breeder's Canyon", a: "<ul class=\"loc-sub roles\"><li><span class=\"role-h\">Human</span>: reduce the highest resource by 1 to advance the fleet marker 1 space up the Jump track.</li><li><span class=\"role-c\">Cylon</span>: draw and resolve the top Crisis card, then skip the Prepare-for-Jump step this turn.</li></ul>" },
  { b: "newcaprica", n: "Shipyard", a: "<ul class=\"loc-sub roles\"><li><span class=\"role-h\">Human</span>: prepare or evacuate 1 civilian ship (if you evacuate, you may then move to any Galactica location).</li><li><span class=\"role-c\">Cylon</span>: look at the top ship of the Locked Civilian Ship stack and place it on top or bottom.</li></ul>" },

  /* ---- DEMETRIUS (Search for Home) ---- */
  { b: "demetrius", n: "Bridge", a: "If there is no Mission card on the 'Active Mission' space, activate the top card of the Mission deck. (Do not draw a Crisis card this turn.)" },
  { b: "demetrius", n: "Tactical Plot", a: "Look at the top card of the Mission deck and place it on the top or bottom of the deck." },
  { b: "demetrius", n: "Captain's Cabin", a: "Choose any skill type; each player, including Cylon players, draws 1 Skill card of that type." },

  /* ---- REBEL BASESTAR (Search for Home) ---- */
  { b: "rebel", n: "Hybrid Tank", a: "Discard a Miracle Token or a Super Crisis card to look at the top 5 Crisis cards, then place them back on top of the deck in any order." },
  { b: "rebel", n: "Datastream", a: "Discard a Miracle Token or a Super Crisis card to search 1 Skill deck and its discard pile and take any 3 cards; then shuffle the discard pile into the deck." },
  { b: "rebel", n: "Raider Bay", a: "Discard a Miracle Token or a Super Crisis card to choose a space area; place either 2 raiders or 4 unmanned vipers in that area and activate them." },
];
