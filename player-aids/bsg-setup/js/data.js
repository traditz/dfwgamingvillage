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
    summary: "Pegasus occupation mode. Once the fleet travels 7 distance it settles on New Caprica and is occupied — a desperate resistance phase.",
    description: "Uses the New Caprica Objective Card instead of Kobol. After the fleet travels 7 or more distance the game enters the New Caprica phase: characters move to the New Caprica board for the occupation/resistance phase, with its own Crisis deck and Title cards." },

  { id: "ionianNebula", name: "Ionian Nebula", requires: "exodus", players: [3, 6], exp: "exodus",
    summary: "Exodus endgame. A Crossroads phase forces every character to a reckoning that can eliminate a player.",
    description: "Uses the Ionian Nebula Objective Card in place of Kobol. Trauma tokens accumulate and, at the Crossroads phase, drive Crossroads-card decisions and ‘The Trial/Boxing the Line,’ which can eliminate a player — an unforgettable trial." },

  { id: "earth", name: "Search for Home (Earth)", requires: "daybreak", players: [3, 7], exp: "daybreak",
    summary: "Daybreak's climax. Scout missions aboard Demetrius and the Rebel Basestar to find Earth.",
    description: "Uses the Earth Objective Card and the Search for Home option: the Demetrius and Rebel Basestar boards, Mission cards and scouting. Supports up to 7 players (one must be a Cylon Leader at 7)." }
];

/* ---- Optional modules layered on top of a chosen objective --------------- */
BSG.options = [
  { id: "cylonLeaders", name: "Cylon Leaders", requires: ["pegasus", "daybreak"], minPlayers: 4,
    summary: "A player openly plays a Cylon Leader with secret Agenda/Motive cards — not fully human, not fully Cylon.",
    description: "Introduced in Pegasus. One player may take a Cylon Leader with Hostile/Sympathetic Agendas (Pegasus) or Motive cards (Daybreak overrides). Never in a 3-player game; one player must be a Cylon Leader at 7 (Pegasus p.18; Daybreak p.4)." },

  { id: "conflictedLoyalties", name: "Conflicted Loyalties", requires: "exodus",
    summary: "Adds Personal Goal and Final Five Loyalty cards — humans may carry hidden agendas of their own.",
    description: "Exodus option. Adds Personal Goal and 'Final Five' Loyalty cards to the deck, blurring who is truly loyal (Exodus p.10–11)." },

  { id: "cylonFleet", name: "Cylon Fleet", requires: "exodus",
    summary: "The Cylon Fleet board and Pursuit track — a relentless basestar chase, plus the CAG title.",
    description: "Exodus option. Adds the Cylon Fleet board, Pursuit marker, CAG / Alternate Admiral titles, Viper Mark VIIs, extra raiders and the 'CAG Chooses' cards (Exodus p.12–15)." },

  { id: "sympatheticCylon", name: "Sympathetic Cylon (variant)", requires: "pegasus", disabledBy: "daybreak", disabledByOption: "cylonLeaders", onlyPlayers: [4, 6],
    summary: "Optional Pegasus variant using the 'You Are a Sympathetic Cylon' loyalty card.",
    description: "A game variant from Pegasus (p.18). It replaces the Sympathizer, so it only applies in 4- or 6-player games. NOT usable with a Cylon Leader (a Cylon Leader game uses no Sympathizer), and Daybreak explicitly disables it (Daybreak p.16)." }
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
    src: "Base p.6 (counts) · Pegasus p.6 / p.11 / p.18",
    rows:   { 3: [1, 5], 4: [1, 6], 5: [2, 8], 6: [2, 9] },                       // no Cylon Leader = base counts + new Pegasus cards
    clRows: { 4: [1, 5, "Sympathetic"], 5: [1, 7, "Hostile"], 6: [2, 8, "Sympathetic"], 7: [2, 10, "Hostile"] },
    sympathizerAt: [4, 6]
  },
  exodus: {
    src: "Exodus p.6 / p.22 (unofficial v4.4 p.9)",
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
      "Add one extra ‘You Are Not a Cylon’ for each original Gaius Baltar in play (not the Daybreak alternate Baltar) — and deal that Baltar player a second Loyalty card at setup (Exodus p.6; Daybreak p.6).",
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
  { ph: 0, exp: "base", t: "Place Game Board", src: "Base p.5 · v4.4 (unofficial) p.3",
    d: "Place the board at the center of the table. Set food and fuel dials to 8, morale to 10, population to 12." },

  { ph: 0, exp: "daybreak", t: "Location Overlays", when: c => c.has("daybreak"), src: "Daybreak p.4, p.16 · v4.4 (unofficial) p.12",
    d: "Lay the Colonial One overlay and the Cylon locations overlay on the base board (‘…Destroyed’ / ‘Hub Destroyed’ sides facedown). Read them — locations have changed. If Pegasus is in play, its Cylon locations overlay is NOT used (return it to the box)." },

  { ph: 0, exp: "pegasus", t: "Cylon Overlay", when: c => c.has("pegasus") && !c.has("daybreak"), src: "Pegasus p.6 · v4.4 (unofficial) p.7",
    d: "Place the Pegasus Cylon Overlay over the core board's Cylon locations." },

  { ph: 0, exp: "pegasus", t: "Pegasus Battlestar Board", when: c => c.has("pegasus"), src: "Pegasus p.5, p.6 · v4.4 (unofficial) p.7",
    d: "Place the Pegasus game board to the right of the core board, aligning the bottom edges. Use the two plastic basestars in place of the core basestar tokens (never both); damage tokens go beside the model." },

  { ph: 0, exp: "base", t: "Set Up Tokens & Ships", src: "Base p.5 · v4.4 (unofficial) p.3",
    d: "Put 8 vipers and 4 raptors in the Viper & Raptor Reserves. Place the fleet token at the start of the Jump Preparation track. Place all other tokens facedown and the plastic ships beside the board." },

  { ph: 0, exp: "daybreak", t: "Centurion & Assault Raptor Figures", when: c => c.has("daybreak"), src: "Daybreak p.4, p.11 · FAQ p.9 · v4.4 (unofficial) p.12",
    d: "Replace the base centurion markers with the centurion figures. Put 1 assault raptor figure in the Reserves; place the rest beside the board. This assault raptor can't be one of the vipers placed in the ‘Set Up Ships’ step, though Apollo may start the game piloting it." },

  { ph: 0, exp: "exodus", t: "Additional Nuke Token", when: c => c.has("exodus"), src: "Exodus p.5 · v4.4 (unofficial) p.9",
    d: "Place the extra Exodus nuke token beside the board (a possible 3rd nuke later). Humans still start with only 2." },

  { ph: 0, exp: "pegasus", t: "Scar & Pegasus Damage Tokens", when: c => c.has("pegasus"), src: "Pegasus p.6 · v4.4 (unofficial) p.7",
    d: "Place the Scar token and the Pegasus Damage tokens beside the board. Keep the Pegasus damage tokens separate from the Galactica damage tokens." },

  { ph: 0, exp: "exodus", t: "Cylon Fleet Board", when: c => c.opt("cylonFleet"), src: "Exodus p.12, p.24 · v4.4 (unofficial) p.9",
    d: "Place the Cylon Fleet board to the left of the main board and put the Cylon Pursuit marker on the Start space of the Pursuit track. Remove every Cylon-attack card from the Crisis and Super Crisis decks — including those among any expansion Crisis/Super Crisis cards you shuffle in below — and box them (keep the ‘CAG Chooses’ cards in). Return 2 vipers from the Reserves to the box, place the 4 Viper Mark VIIs in the Damaged Vipers box, and add the 4 new Cylon raiders to the ship pool." },

  { ph: 0, exp: "exodus", t: "Mining Asteroid Card (Pegasus + Cylon Fleet)", when: c => c.opt("cylonFleet") && c.has("pegasus"), src: "Exodus p.22 · v4.4 (unofficial) p.15",
    d: "Remove the ‘Mining Asteroid’ Destination card from the Destination deck before setup (Combining Pegasus & Exodus with the Cylon Fleet option)." },

  { ph: 0, exp: "exodus", t: "Ionian Nebula Tokens", when: c => c.obj === "ionianNebula", src: "Exodus p.16 · v4.4 (unofficial) p.9",
    d: "Replace the core basestar damage tokens with the Exodus alternate basestar damage tokens. Place the trauma tokens facedown and randomized; draw 2 and, without looking, place one facedown on Sickbay and one on the Brig. Shuffle the Crossroads cards. (Players draw their trauma tokens and the Ally cards are set out once characters are chosen — see ‘Trauma Tokens & Ally Cards’ below.)" },

  { ph: 0, exp: "pegasus", t: "New Caprica Board & Occupation Forces", when: c => c.obj === "newCaprica", src: "Pegasus p.6, p.13, p.18",
    d: "Set the New Caprica board aside with the Occupation Forces tokens — they are not used until the New Caprica phase begins (after the fleet travels 7 or more distance)." },

  { ph: 0, exp: "pegasus", t: "No New Caprica — Leave Its Components in the Box", when: c => c.has("pegasus") && c.obj !== "newCaprica", src: "Pegasus p.4, p.6, p.18",
    d: "Leave the New Caprica board, New Caprica Crisis cards, occupation forces tokens, New Caprica Objective Card and the Pegasus President/Admiral Title cards in the box." },

  { ph: 0, exp: "exodus", t: "Box Conflicted Loyalties Cards", when: c => c.has("exodus") && !c.opt("conflictedLoyalties"), src: "Exodus p.5",
    d: "Not using Conflicted Loyalties: return the Personal Goal and Final Five Loyalty cards to the box." },

  { ph: 0, exp: "exodus", t: "Box Cylon Fleet Components", when: c => c.has("exodus") && !c.opt("cylonFleet"), src: "Exodus p.5",
    d: "Not using the Cylon Fleet: return the Cylon Fleet board, Cylon pursuit marker, CAG and Alternate Admiral Title cards, viper mark VIIs and the extra raiders to the box." },

  { ph: 0, exp: "exodus", t: "Box Ionian Nebula Components", when: c => c.has("exodus") && c.obj !== "ionianNebula", src: "Exodus p.5",
    d: "Not using the Ionian Nebula: return the trauma tokens, ally tokens, alternate basestar damage tokens, Ally cards, Crossroads cards and Ionian Nebula Objective Card to the box." },

  { ph: 0, exp: "daybreak", t: "Box Search for Home Components", when: c => c.has("daybreak") && c.obj !== "earth", src: "Daybreak p.4",
    d: "Not using Search for Home: return the Earth Objective Card, Mission cards, basestar allegiance marker, and the Demetrius and Rebel Basestar boards to the box." },

  { ph: 0, exp: "daybreak", t: "Box Motive & Infiltration Cards", when: c => c.has("daybreak") && !c.opt("cylonLeaders"), src: "Daybreak p.5",
    d: "No Cylon Leader: return the Infiltration Reference Card and Motive cards to the box." },

  { ph: 0, exp: "daybreak", t: "Demetrius Board (Search for Home)", when: c => c.obj === "earth", src: "Daybreak p.14",
    d: "Place the Demetrius board to the left of the main board. Leave room for the Rebel Basestar board — but do NOT place the Rebel Basestar board or the basestar allegiance marker until the ‘Cylon Civil War’ Mission card instructs you to." },

  /* ---------- Phase 1: Characters & Titles ---------- */
  { ph: 1, exp: "base", t: "Determine First Player", src: "Base p.5 · v4.4 (unofficial) p.3",
    d: "Randomly choose the first player and give them the current player token. They choose a character first and take the first turn." },

  { ph: 1, exp: "pegasus", t: "Add Pegasus Characters", when: c => c.has("pegasus") && c.opt("cylonLeaders"), src: "Pegasus p.6 · v4.4 (unofficial) p.7",
    d: "Before anyone chooses, add the 7 Pegasus character sheets (including Cylon Leaders) to the available pool." },
  { ph: 1, exp: "pegasus", t: "Add Pegasus Characters", when: c => c.has("pegasus") && !c.opt("cylonLeaders"), src: "Pegasus p.6, p.10, p.18 · v4.4 (unofficial) p.7",
    d: "Before anyone chooses, add the 4 new Pegasus human character sheets to the pool. Return the 3 Cylon Leader character sheets to the box — no Cylon Leader is used this game (never in a 3-player game). Also return the Agenda decks, unless you are playing the Sympathetic Cylon variant, which uses the Sympathetic Agenda deck and the Infiltration Reference Card." },

  { ph: 1, exp: "exodus", t: "Add Exodus Characters", when: c => c.has("exodus"), src: "Exodus p.5 · v4.4 (unofficial) p.9",
    d: "Before anyone chooses, add the 4 Exodus character sheets and tokens (with piloting token) to the pool." },

  { ph: 1, exp: "daybreak", t: "Add Daybreak Characters", when: c => c.has("daybreak") && c.opt("cylonLeaders"), src: "Daybreak p.4–5 · v4.4 (unofficial) p.12",
    d: "Before anyone chooses, add the Daybreak character sheets. These include alternate versions of Lee, Zarek, Helo and Baltar — only one version of each may be in play, but count both versions when judging the most plentiful type." },
  { ph: 1, exp: "daybreak", t: "Add Daybreak Characters", when: c => c.has("daybreak") && !c.opt("cylonLeaders"), src: "Daybreak p.4–5 · v4.4 (unofficial) p.12",
    d: "Before anyone chooses, add the Daybreak character sheets. These include alternate versions of Lee, Zarek, Helo and Baltar — only one version of each may be in play, but count both versions when judging the most plentiful type. Leave the Cylon Leader sheets out — no Cylon Leader is used this game (Cylon Leaders can never be chosen at 3 players)." },

  { ph: 1, exp: "base", t: "Choose & Place Characters", src: "Base p.5 · v4.4 (unofficial) p.3",
    d: "With all expansion characters now in the pool, clockwise from the first player each chooses a character of the most plentiful type (political leader, military leader, or pilot; support characters are unrestricted). Take the sheet, token and piloting token if any; place the token on the location named on the sheet." },

  { ph: 1, exp: "exodus", t: "Trauma Tokens & Ally Cards", when: c => c.obj === "ionianNebula", src: "Exodus p.16",
    d: "Each player draws 3 trauma tokens and looks at them secretly — reveal and replace any disaster token, then return the disaster tokens facedown to the pool and re-randomize. Shuffle the Ally cards and place the top 3 faceup; if one shows a character a player has chosen, return it to the box and keep drawing. Put a facedown trauma token on each Ally card and place each matching ally token in the location listed on its card." },
  { ph: 1, exp: "daybreak", t: "Ally Cards with Daybreak", when: c => c.obj === "ionianNebula" && c.has("daybreak"), src: "Daybreak p.17",
    d: "With Daybreak: an Ally card is also returned if a player chose either version of that character; Athena is not Boomer — keep the Boomer Ally card unless someone chose Boomer." },

  { ph: 1, exp: "daybreak", t: "Miracle Tokens", when: c => c.has("daybreak"), src: "Daybreak p.4 · v4.4 (unofficial) p.12",
    d: "Give each player 1 miracle token, placed on their character sheet after they choose. Remaining tokens form a supply pile." },

  { ph: 1, exp: "daybreak", t: "Cylon Leader (Daybreak rules)", when: c => c.opt("cylonLeaders") && c.has("daybreak"), src: "Daybreak p.4–5, p.8, p.16 · FAQ p.5",
    d: "One player may take a Cylon Leader, using Daybreak's Cylon Leader rules: they take the Infiltration Reference Card and draw Motive cards. Pegasus Agenda cards and Infiltration card are NOT used. A Cylon Leader draws only <b>2</b> Skill cards at the start of the game (from their own skill set), not 3 — except a Cylon Leader who begins the game Infiltrating (e.g. Athena), who draws 3. Never at 3 players; one player must be a Cylon Leader at 7." },

  { ph: 1, exp: "pegasus", t: "Cylon Leader (Pegasus rules)", when: c => c.opt("cylonLeaders") && c.has("pegasus") && !c.has("daybreak"), src: "Pegasus p.10–11, p.18 · FAQ p.5",
    d: "One player may take a Cylon Leader (at 7 players one player must), with an Agenda card drawn by player count: Sympathetic at 4 or 6, Hostile at 5 or 7. A Cylon Leader draws only <b>2</b> Skill cards at the start of the game (from their own skill set), not 3. Never in a 3-player game." },

  { ph: 1, exp: "base", t: "Distribute Title Cards", src: "Base p.5, p.28 · FAQ p.1 (errata, 3-5-15) · Pegasus p.6, p.8 · Exodus p.5, p.9 · Daybreak p.13",
    d: "President → the chosen character highest in the President line of succession: <b>Roslin, then Baltar, then Zarek</b> (corrected by the official FAQ/errata — rulebook p.5 misprinted this order), continuing down the line on Base p.28 if none of them is in play. Admiral → highest in the Admiral line: Adama, then Tigh, then Helo, continuing down Base p.28. With any expansion, use the revised lines of succession instead (see Reference Charts) — e.g. Helena Cain is first for Admiral, and with Daybreak the alternate Lee Adama ranks above Zarek for President. The Admiral takes the 2 nuke tokens; the President shuffles the Quorum deck and draws 1 Quorum card. If Pegasus or Exodus is in play, shuffle their new Quorum cards into the Quorum deck before the President draws (see the expansion card steps under ‘Cards, Decks &amp; Objective’)." },

  { ph: 1, exp: "pegasus", t: "New Caprica Title Cards", when: c => c.obj === "newCaprica", src: "Pegasus p.4",
    d: "Use the Pegasus President and Admiral Title cards in place of the core Title cards." },

  { ph: 1, exp: "exodus", t: "CAG & Alternate Admiral Titles", when: c => c.opt("cylonFleet") && !c.has("daybreak"), src: "Exodus p.12, p.14 · v4.4 (unofficial) p.9",
    d: "Give the CAG Title to the character highest in the CAG Line of Succession, and the Alternate Admiral Title to the character highest in the Admiral Line of Succession. Return the core-game Admiral Title card to the box. For the Alternate Admiral, use the Revised Lines of Succession chart under Reference Charts. CAG Line of Succession (Exodus p.14; * = Pegasus): 1 Lee ‘Apollo’ Adama, 2 Kara ‘Starbuck’ Thrace, 3 Louanne ‘Kat’ Katraine*, 4 Sharon ‘Boomer’ Valerii, 5 Samuel T. Anders, 6 Karl ‘Helo’ Agathon, 7 William Adama, 8 Helena Cain*, 9 Saul Tigh, 10 Felix Gaeta, 11 Anastasia ‘Dee’ Dualla*, 12 ‘Chief’ Galen Tyrol, 13 Callandra ‘Cally’ Tyrol, 14 Tom Zarek, 15 Ellen Tigh*, 16 Gaius Baltar, 17 Tory Foster, 18 Laura Roslin." },
  { ph: 1, exp: "exodus", t: "CAG & Alternate Admiral Titles", when: c => c.opt("cylonFleet") && c.has("daybreak"), src: "Exodus p.12, p.14 · Daybreak p.18 · v4.4 (unofficial) p.9",
    d: "Give the CAG Title to the character highest in the CAG Line of Succession, and the Alternate Admiral Title to the character highest in the Admiral Line of Succession. Return the core-game Admiral Title card to the box. For the Alternate Admiral, use the Revised Lines of Succession chart under Reference Charts. CAG Line of Succession (Daybreak p.18, all expansions): 1 Lee ‘Apollo’ Adama (Original), 2 Kara ‘Starbuck’ Thrace, 3 Louanne ‘Kat’ Katraine, 4 Karl ‘Helo’ Agathon (Alternate), 5 Sharon ‘Boomer’ Valerii, 6 Brendan ‘Hot Dog’ Costanza, 7 Samuel T. Anders, 8 Lee Adama (Alternate), 9 Karl ‘Helo’ Agathon (Original), 10 William Adama, 11 Helena Cain, 12 Saul Tigh, 13 Felix Gaeta, 14 Anastasia ‘Dee’ Dualla, 15 Louis Hoshi, 16 Tom Zarek (Alternate), 17 ‘Chief’ Galen Tyrol, 18 Callandra ‘Cally’ Tyrol, 19 Sherman ‘Doc’ Cottle, 20 Tom Zarek (Original), 21 Ellen Tigh, 22 Gaius Baltar (Alternate), 23 Gaius Baltar (Original), 24 Tory Foster, 25 Romo Lampkin, 26 Laura Roslin." },

  /* ---------- Phase 2: Cards, Decks & Objective ---------- */
  { ph: 2, exp: "base", t: "Set Up Skill Decks", src: "Base p.5 · v4.4 (unofficial) p.3",
    d: "Separate the Skill cards into 5 decks by type, shuffle each, and place them facedown under their matching colored regions." },

  { ph: 2, exp: "pegasus", t: "Pegasus Skill Cards", when: c => c.has("pegasus"), src: "Pegasus p.4, p.6 · v4.4 (unofficial) p.7",
    d: "Shuffle the new Pegasus Skill cards — including the 7 replacement ‘Investigative Committee’ Politics cards — into their respective decks. Remove the core game's ‘Investigative Committee’ Politics cards and return them to the box." },

  { ph: 2, exp: "exodus", t: "Exodus Skill Cards", when: c => c.has("exodus"), src: "Exodus p.5 · v4.4 (unofficial) p.9",
    d: "Shuffle the new Exodus Skill cards into their respective decks." },

  { ph: 2, exp: "daybreak", t: "Daybreak Skill Cards", when: c => c.has("daybreak"), src: "Daybreak p.5 · v4.4 (unofficial) p.12",
    d: "Shuffle the new Daybreak Skill cards into their respective decks." },

  { ph: 2, exp: "daybreak", t: "Treachery Deck", when: c => c.has("daybreak"), src: "Daybreak p.5, p.16",
    d: "Shuffle the Daybreak Treachery deck and place it to the right of the Engineering deck. If Pegasus is in play, its Treachery cards are NOT mixed in — return the Pegasus Treachery cards (and Agenda / Sympathetic Cylon cards) to the box." },

  { ph: 2, exp: "pegasus", t: "Treachery Deck", when: c => c.has("pegasus") && !c.has("daybreak"), src: "Pegasus p.6 · v4.4 (unofficial) p.7",
    d: "Shuffle the Pegasus Treachery cards and place them below the area marked for them on the Pegasus board." },

  { ph: 2, exp: "base", t: "Set Up Other Card Decks", src: "Base p.5 · v4.4 (unofficial) p.3",
    d: "Shuffle the Quorum, Crisis, Super Crisis and Destination decks and place them by the board." },

  { ph: 2, exp: "pegasus", t: "Pegasus Crisis / Quorum / Destination / Super Crisis", when: c => c.has("pegasus"), src: "Pegasus p.6 · v4.4 (unofficial) p.7",
    d: "Shuffle the new Pegasus Crisis, Destination, Quorum and Super Crisis cards into their decks." },

  { ph: 2, exp: "pegasus", t: "New Caprica Crisis Cards", when: c => c.obj === "newCaprica", src: "Pegasus p.6",
    d: "Shuffle the New Caprica Crisis cards and set them aside — they are used only during the New Caprica phase (not in a ‘No New Caprica’ game)." },

  { ph: 2, exp: "exodus", t: "Exodus Crisis / Quorum / Super Crisis / Destination", when: c => c.has("exodus"), src: "Exodus p.5 · v4.4 (unofficial) p.9",
    d: "Shuffle the new Exodus cards into their decks. If NOT using the Cylon Fleet option, return the 'CAG Chooses' Crisis and Super Crisis cards to the box." },

  { ph: 2, exp: "daybreak", t: "Daybreak Crisis & Mutiny Deck", when: c => c.has("daybreak"), src: "Daybreak p.5 · v4.4 (unofficial) p.12",
    d: "Shuffle the new Daybreak Crisis cards into the Crisis deck. Shuffle the Mutiny deck and place it facedown next to the Crisis deck." },

  { ph: 2, exp: "daybreak", t: "Remove Cylon-Attack Cards (Cylon Fleet)", when: c => c.has("daybreak") && c.opt("cylonFleet"), src: "Daybreak p.17 · v4.4 (unofficial) p.15",
    d: "Using Exodus's Cylon Fleet option with Daybreak: also return every Cylon-attack Crisis card from Daybreak to the box, with all the other Cylon-attack cards." },

  { ph: 2, exp: "daybreak", t: "Motive Cards", when: c => c.opt("cylonLeaders") && c.has("daybreak"), src: "Daybreak p.5",
    d: "Shuffle the Motive deck and set it next to the board for the Cylon Leader. (If no Cylon Leader is chosen, box the Motive cards and Infiltration Reference Card.)" },

  { ph: 2, exp: "pegasus", t: "Agenda Cards", when: c => c.opt("cylonLeaders") && c.has("pegasus") && !c.has("daybreak"), src: "Pegasus p.6, p.10",
    d: "Separate the Agenda cards into Sympathetic and Hostile decks for the Cylon Leader." },

  /* Objective card — exactly one, defined by the selected mode. */
  { ph: 2, exp: "base", t: "Objective Card — Kobol", when: c => c.obj === "kobol", src: "Base p.5 · v4.4 (unofficial) p.3",
    d: "Place the Kobol Objective Card faceup next to the Destination deck." },
  { ph: 2, exp: "pegasus", t: "Objective Card — New Caprica", when: c => c.obj === "newCaprica", src: "Pegasus p.6",
    d: "Place the New Caprica Objective Card next to the Destination deck and return the Kobol Objective Card to the box." },
  { ph: 2, exp: "exodus", t: "Objective Card — Ionian Nebula", when: c => c.obj === "ionianNebula", src: "Exodus p.16",
    d: "Place the Ionian Nebula Objective Card next to the Destination deck and return the Kobol Objective Card to the box. Keep the shuffled Crossroads cards set aside — they are not used until the Crossroads phase." },
  { ph: 2, exp: "daybreak", t: "Objective Card — Earth (Search for Home)", when: c => c.obj === "earth", src: "Daybreak p.4, p.14",
    d: "Shuffle the Mission deck and place it next to the Demetrius board. Place the Earth Objective Card next to the Destination deck (it defines the sleeper-agent phase and victory) and return the Kobol Objective Card to the box." },

  /* ---------- Phase 3: Loyalty & Final Steps ---------- */
  /* Loyalty deck — single governing version (precedence baked into when). */
  { ph: 3, exp: "daybreak", t: "Set Up Loyalty Deck", when: c => c.has("daybreak"), src: "Daybreak p.6–7, p.16",
    d: "Build the Loyalty deck using Daybreak's 'Creating the Loyalty Deck' Chart (p.6–7) — this governs even when combined with other expansions. The chart decides whether the 'You Are a Mutineer' card is included for this player count / Cylon Leader combination (see the exact composition in the Loyalty Deck panel below). Deal one card facedown to each player — except a Cylon Leader, who is dealt 2 Motive cards instead. Deal an additional Loyalty card to a player who chose the original Gaius Baltar." },

  { ph: 3, exp: "daybreak", t: "Keep the 'You Are Not a Cylon' Deck", when: c => c.has("daybreak") && c.has("exodus"), src: "Daybreak p.17 · FAQ p.8 (errata, 3-5-15)",
    d: "Errata: do NOT return the unused 'You Are Not a Cylon' cards to the box. Place that deck next to the Loyalty deck (kept clearly separate) — Exodus effects such as executions draw from it." },
  { ph: 3, exp: "exodus", t: "Set Up Loyalty Deck", when: c => c.has("exodus") && !c.has("daybreak"), src: "Exodus p.6, p.22 · v4.4 (unofficial) p.9",
    d: "Build the Loyalty deck using the Exodus chart. With a Cylon Leader, use the Exodus + Cylon Leader mix (Exodus p.22). With Conflicted Loyalties, first shuffle the chosen Personal Goal / Final Five cards into the 'You Are Not a Cylon' deck (the counts don't change). Deal one card facedown to each player (not to a Cylon Leader, who takes an Agenda card instead). Place the remaining 'You Are Not a Cylon' deck beside the Loyalty deck, kept separate. A player with Gaius Baltar is dealt a second Loyalty card." },
  { ph: 3, exp: "pegasus", t: "Set Up Loyalty Deck", when: c => c.has("pegasus") && !c.has("exodus") && !c.has("daybreak"), src: "Base p.6 · Pegasus p.6, p.7, p.11, p.18 · FAQ p.4 (errata)",
    d: "Build the Loyalty deck with the new Pegasus Loyalty cards added to the core ones, using the base counts — or, with a Cylon Leader, the Pegasus Cylon Leader mix (p.11; 7 players: p.18). Deal one card facedown to each player (not to a Cylon Leader, who takes an Agenda card instead). In play, use Pegasus's revised 'Handing Off Excess Loyalty Cards' rules (p.7) — per the FAQ errata, a Cylon who reveals once the fleet has traveled 7+ distance keeps his excess Loyalty cards." },
  { ph: 3, exp: "base", t: "Set Up Loyalty Deck", when: c => !c.has("pegasus") && !c.has("exodus") && !c.has("daybreak"), src: "Base p.6 · v4.4 (unofficial) p.3",
    d: "Build the base Loyalty deck for your player count (see the Loyalty Deck panel) and deal one card facedown to each player." },

  { ph: 3, exp: "exodus", t: "Conflicted Loyalties Cards", when: c => c.opt("conflictedLoyalties"), src: "Exodus p.10 · v4.4 (unofficial) p.9",
    d: "Choose to use the Personal Goal cards, the Final Five cards, or both; return the rest to the box. During the Organize Loyalty Cards step, shuffle the chosen cards into the ‘You Are Not a Cylon’ pile, then build the deck normally. This does NOT change the card count — some ‘You Are Not a Cylon’ cards are now secretly Personal Goal / Final Five cards (both count as ‘You Are Not a Cylon’ for team purposes)." },

  { ph: 3, exp: "pegasus", t: "Sympathetic Cylon (variant)", when: c => c.opt("sympatheticCylon"), src: "Pegasus p.18",
    d: "Pegasus game variant: use the ‘You Are a Sympathetic Cylon’ card in place of the ‘You Are a Sympathizer’ card when building the Loyalty deck (4- or 6-player games). Even though no Cylon Leader is in play, do NOT return the Sympathetic Agenda deck to the box: a human who receives this card in the Sleeper phase reveals it, becomes a revealed Cylon, draws a Sympathetic Agenda (no Super Crisis Card), and may Infiltrate from the Human Fleet location as if he were a Cylon Leader." },

  { ph: 3, exp: "base", t: "Receive Skills", src: "Base p.5 · v4.4 (unofficial) p.3",
    d: "Every player except the starting player draws 3 Skill cards total from those allowed by their Receive Skills step. The starting player draws at the start of their first turn instead." },

  /* Destiny deck — Treachery inclusion superseded by latest Treachery source. */
  { ph: 3, exp: "daybreak", t: "Create Destiny Deck", when: c => c.has("daybreak"), src: "Daybreak p.5",
    d: "Deal 2 Skill cards of each type plus 2 Treachery cards (12 cards total) facedown onto the Destiny deck space and shuffle thoroughly." },
  { ph: 3, exp: "pegasus", t: "Create Destiny Deck", when: c => c.has("pegasus") && !c.has("daybreak"), src: "Pegasus p.6",
    d: "Deal 2 Skill cards of each type plus 2 Treachery cards (12 cards total) facedown onto the Destiny deck space and shuffle thoroughly." },
  { ph: 3, exp: "base", t: "Create Destiny Deck", when: c => !c.has("pegasus") && !c.has("daybreak"), src: "Base p.5 · v4.4 (unofficial) p.3",
    d: "Deal 2 Skill cards of each type (10 cards total) facedown onto the Destiny deck space and shuffle thoroughly." },

  { ph: 3, exp: "base", t: "Set Up Ships", src: "Base p.5 · v4.4 (unofficial) p.3",
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
    caption: "Revised Lines of Succession — Admiral & President title order with all expansion characters (official: Daybreak p.13; same relative order as Pegasus p.8 / Exodus p.9). Image from the unofficial v4.4 fan rules summary, p.16." }
];

/* Combined Combat Reference — merges the unique content of v4.4 p.6 (base) and
   p.14 (Daybreak/Cylon Fleet). The Attack Table always uses p.14 (image, with
   icons); the surrounding rules are merged text. Sections tagged "fleet" only
   apply when the Cylon Fleet board is in play. */
BSG.combat = {
  attackTableImg: "images/charts/combat-attack-table-p14.png",
  attackTableNote: "Attack Table (D8) — image from the unofficial v4.4 fan summary p.14; official tables: Base p.24 &amp; p.32 · Exodus p.24 (Cylon Fleet) · Daybreak p.20. Regardless of the roll, discard the nuke token after use (with Exodus, place it beside the board instead of in the box — Exodus p.8 · FAQ p.6 errata).",
  sections: [
    { h: "Activating a Viper", items: [
      "When you activate a viper, choose one: <b>Launch a Viper</b>, <b>Move a Viper</b>, or <b>Attack with a Viper</b>.",
      { t: "Viper Mark VIIs may move <b>2</b> space areas instead of 1 (they start the game in the Damaged Vipers box).", fleet: true },
      { t: "Instead of moving or attacking, a viper may <b>escort a civilian ship to safety</b>: choose 1 civilian ship in the viper's space area and shuffle it back into the pile of unused civilian ships.", fleet: true },
      { t: "<b>Nukes (Cylon Fleet):</b> the Admiral targets a <b>space area</b>, not a basestar: 1–2 damage a basestar there twice; 3–6 destroy a basestar; 7 destroy a basestar + 3 raiders; 8 destroy <b>every</b> ship in the area (incl. vipers and civilian ships). The Admiral chooses among several basestars; with no valid target the nuke still goes beside the board (Exodus p.15).", fleet: true },
      { t: "<b>Assault raptors (Daybreak):</b> treated as vipers, not raptors, for all game effects. When an effect says to launch, damage, destroy, place or activate a viper, the player taking the action (otherwise the current player) may pick an assault raptor. Assault raptors are never damaged: an attack destroys one on a 7–8, and one chosen as a viper to be damaged is destroyed. Attacking a basestar, an assault raptor damages it on 7–8. In the Remove Ships step of a jump, a pilot in an assault raptor may stay in their space area; the current player may keep unmanned ones in place (Daybreak p.11, p.20).", when: c => c.has("daybreak") }
    ]},
    { h: "Cylon Ship Activation", items: [
      { icon: "cs-raider", t: "<b>Activate Raiders:</b> each raider carries out only the first action it can — 1) Attack a Viper (unmanned if able, else a piloted viper); 2) Destroy a Civilian Ship (current player chooses); 3) Move 1 area toward the nearest civilian ship (if tied, clockwise around Galactica); 4) Attack Galactica. If no raiders are in play, 2 raiders launch from each basestar." },
      { icon: "cs-launch", t: "<b>Launch Raiders:</b> each basestar launches 3 raiders." },
      { icon: "cs-heavy", t: "<b>Activate Heavy Raiders &amp; Centurions:</b> heavy raiders move toward the nearest area with a viper-launch icon. If a heavy raider starts its move on a launch-icon space, remove it and place a centurion on the start of the Boarding Party track. Each time heavy raiders are activated after that, each centurion moves 1 space toward the Humans Lose space. If no heavy raiders are in play, one launches from each basestar." },
      { icon: "cs-basestar", t: "<b>Activate Basestars:</b> the current player rolls a D8 for each basestar to find out if Galactica is damaged." }
    ]},
    { h: "Cylon Fleet — when “nothing happens”", fleet: true, items: [
      { icon: "cs-raider", t: "<b>Raiders:</b> if no raiders or basestars are on the main board, put 1 raider on the Cylon Fleet board and advance Cylon pursuit 1 space." },
      { icon: "cs-launch", t: "<b>Launch Raiders / Activate Basestars:</b> if no basestars are on the main board, put 1 basestar on the Cylon Fleet board and advance pursuit 1 space. A basestar on the main board with a Disabled Hangar/Disabled Weapons token still counts — nothing is placed and pursuit does not advance (FAQ p.7)." },
      { icon: "cs-heavy", t: "<b>Heavy Raiders / Centurions:</b> if no heavy raiders, centurions, or basestars are on the main board, put 1 heavy raider on the Cylon Fleet board and advance pursuit 1 space." },
      "<b>Placing on the Cylon Fleet board:</b> the current player rolls a die (modifiable) and places the ship in the matching Cylon space area. If every ship of that type is already on either board, instead move all ships in the highest-numbered Cylon space area that holds that type to the matching main-board area (Exodus p.13–14)."
    ]},
    { h: "Cylon Pursuit Track", fleet: true, items: [
      "<b>Civilian ship(s) space:</b> the CAG places 1 or 2 civilian ships (one at a time) on the main board, each in a space area without a civilian ship if able — if every area has one, any area (Exodus p.14).",
      "<b>Auto Attack space:</b> move all Cylon ships from space areas on the Cylon Fleet board to the corresponding areas on the main board, then move the pursuit marker to the Start space."
    ]},
    { h: "Damage Tokens", items: [
      { icon: "dt-damage-location", t: "<b>Galactica — Damage Location:</b> placed on the matching location; characters there go to Sickbay. Characters may still move in, but the location's action can't be used until it is repaired (by an Engineering card). The repaired token then goes back to the unused pile, randomized. 6+ damaged Galactica locations at once = the Cylons win (Base p.25)." },
      { icon: "dt-lost-resource", t: "<b>Lost Resource:</b> lose the listed resources, then remove the token from the game." },
      { icon: "dt-critical-hit", t: "<b>Basestar — Critical Hit:</b> counts as 2 damage tokens (3 destroy the basestar)." },
      { icon: "dt-disabled-hangar", t: "<b>Disabled Hangar:</b> may not launch raiders/heavy raiders." },
      { icon: "dt-disabled-weapons", t: "<b>Disabled Weapons:</b> may not attack Galactica." },
      { icon: "dt-structural-damage", t: "<b>Structural Damage:</b> attacks vs. the basestar get +2." },
      { t: "<b>Pegasus damage:</b> each time Galactica would be damaged, the current player may draw a Pegasus damage token instead. If all 4 Pegasus locations are damaged at once, Pegasus is destroyed — characters aboard go to Sickbay and no one may move to Pegasus for the rest of the game (Pegasus p.9).", when: c => c.has("pegasus") },
      { t: "<b>Ionian Nebula — alternate basestar tokens</b> (replace the core set; the 4 core types work as above): <b>Collateral Damage</b> — destroy up to 3 raiders in the basestar's area; <b>Damage to Personnel</b> — each Cylon player draws 2 trauma tokens. Each counts as 1 damage token (Exodus p.18).", when: c => c.obj === "ionianNebula" }
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
  _handoffTag:   c => (c.has("exodus") && c.has("daybreak")) ? "daybreak" : c.has("exodus") ? "exodus" : "pegasus",

  core: [
    { h: "Turn Sequence", items: [
      "<b>1. Receive Skills</b> — draw the Skill cards listed on your character sheet (choose the split for multi-skill characters). No hand limit while drawing.",
      { t: "<b>2. Movement</b> — move to one location; moving to a location on a different ship (Galactica, Colonial One, and any other ship board in play) costs 1 Skill card. A pilot may instead move their viper to an adjacent space area, or discard 1 Skill card to land: return the viper to the Reserves and move to a location on a ship. Landing is a move, never an action.", src: "Base p.10 · Pegasus p.9 · Daybreak p.14–15 · FAQ p.3" },
      { t: "<b>3. Action</b> — take ONE: activate your location, use an ‘Action:’ on your character sheet, play a Skill / Title / Quorum card action, activate your viper (move or attack), reveal a ‘You Are a Cylon’ card to use its action, or do nothing.", src: "Base p.9–10" },
      { t: "Playing a <b>Mutiny card</b> also uses your action.", when: c => c.has("daybreak"), tag: "daybreak", src: "Daybreak p.5" },
      { t: "A Cylon Leader may use an action printed on their character sheet instead of their location's action (or an Action on a Treachery card).", when: c => c.opt("cylonLeaders") && !c.has("daybreak"), tag: "pegasus", src: "Pegasus p.11" },
      { t: "A Cylon Leader may use an action printed on their character sheet instead of the action on their current location.", when: c => c.opt("cylonLeaders") && c.has("daybreak"), tag: "daybreak", src: "Daybreak p.8, p.16" },
      "<b>4. Crisis</b> — draw and resolve the top Crisis card (Cylon attack, skill check, or event).",
      "<b>5. Activate Cylon Ships</b> — resolve the activation icon on the Crisis card (see the Combat Reference).",
      "<b>6. Prepare for Jump</b> — if the Crisis shows the jump icon, advance the Jump-Prep track; the fleet jumps when the marker reaches the end.",
      { t: "If the Mutineer resolves one or more ‘prepare for jump’ icons during this step of his turn, he draws 1 Mutiny card (only one, however many icons).", when: c => c.has("daybreak") && BSG.loyalty.compute(c).mutineer, tag: "daybreak", src: "Daybreak p.6 · FAQ p.9" },
      { t: "This also applies when the Pegasus ‘Engine Room’ was activated that turn, even if his Crisis card shows no icon.", when: c => c.has("daybreak") && c.has("pegasus") && BSG.loyalty.compute(c).mutineer, tag: "daybreak", src: "FAQ p.9" },
      "A <b>revealed Cylon</b> skips steps 4–5 (draws no Crisis card) and instead acts against the fleet; step 6 is also skipped in the base game only (see Revealed Cylons).",
      "Discard down to your hand limit (10 Skill cards) at the end of any turn.",
      { t: "The President's <b>Quorum hand limit is 10</b>: if he holds more than 10 Quorum cards at the end of any player's turn, he discards down to 10.", when: c => c.has("pegasus") || c.has("exodus") || c.has("daybreak"), tag: c => c.has("daybreak") ? "daybreak" : c.has("exodus") ? "exodus" : "pegasus", src: "Pegasus p.8 · Exodus p.8 · Daybreak p.12 · FAQ p.8 (errata)" }
    ]},

    { h: "Skill Checks", items: [
      "A check lists a <b>difficulty</b> and one or more required skill <b>colors</b>. Two Destiny-deck cards start a facedown pile; then, starting left of the current player (ending with the current player), each player secretly adds any number of Skill cards. The current player shuffles the pile and splits it into matching-color and non-matching piles.",
      { t: "Text on Skill cards played into a check is ignored; only strength and color count. <b>Final strength</b> = matching total − non-matching total. Meet or beat the difficulty to <b>pass</b>. Some checks list a partial-pass value between the pass and fail results. Afterwards, discard all the cards played.", src: "Base p.16" },
      { t: "After the last Destiny card is used, the current player rebuilds it (2 of each skill type — 10 cards, shuffled).", when: c => !c.has("pegasus") && !c.has("daybreak") },
      { t: "After the last Destiny card is used, the current player rebuilds it with 2 of each skill type <b>including 2 Treachery</b> (12 cards) — this applies during setup and every rebuild.", when: c => c.has("pegasus") || c.has("daybreak"), tag: c => BSG.howToPlay._treacheryTag(c) },
      { t: "<b>Treachery</b> cards count as <b>negative</b> strength in a check unless the check or location specifically counts Treachery positive (e.g. the Airlock, Resistance HQ).", when: c => c.has("pegasus"), tag: c => BSG.howToPlay._treacheryTag(c) },
      { t: "<b>Treachery</b> cards count as <b>negative</b> strength in all skill checks unless a card or location says otherwise.", when: c => c.has("daybreak") && !c.has("pegasus"), tag: "daybreak", src: "Daybreak p.10" },
      { t: "Human players may not use any text ability on Treachery cards; only Cylon players may. Reckless Skill Check abilities still trigger whoever played the card.", when: c => c.has("pegasus") && !c.has("daybreak"), tag: "pegasus", src: "Pegasus p.10" },
      { t: "<b>Reckless</b> checks: a Reckless Skill card (e.g. ‘Jury Rigged’) is played before any cards are added to a check, at most 1 per check, and makes that check Reckless. Some Treachery cards have a Reckless Skill Check ability: when such a card is revealed in a Reckless check, its text is not ignored and the ability triggers, whether a human player, a Cylon player or the Destiny deck added it. Each Reckless Skill Check ability triggers only once per check.", when: c => c.has("pegasus") && !c.has("daybreak"), tag: "pegasus", src: "Pegasus p.9–10" },
      { t: "<b>Skill Check Abilities</b> — a Skill card with the ability icon resolves its text whenever it’s in a check, no matter who played it; the current player resolves them in any order, never the same ability twice.", when: c => c.has("exodus") || c.has("daybreak"), tag: c => BSG.howToPlay._abilityTag(c) },
      { t: "If a Crisis/Super Crisis lists a <b>‘consequence’</b> result, resolve it whenever at least one Skill card with the skill-check-ability icon was played into its check — whether the check passed or failed.", when: c => c.has("exodus") || c.has("daybreak"), tag: "exodus" },
      { t: "<b>Reckless</b> checks (Pegasus + Daybreak): after abilities resolve, flip the top Treachery card — strength &gt; 0 is discarded; strength 0 flips another and both abilities resolve. A check that had ‘Restore Order’ played before it can’t be made Reckless, and ‘Restore Order’ can’t be played before a check already made Reckless.", when: c => c.has("pegasus") && c.has("daybreak"), tag: "daybreak" }
    ]},

    { h: "Crisis Cards", items: [
      "Draw and resolve the top Crisis card: a <b>Cylon attack</b> (follow its steps), a <b>skill check</b>, or an <b>event</b>. Some cards give a choice to the current player, the President, or the Admiral.",
      "Then activate Cylon ships by the card’s icon and check its Prepare-for-Jump icon.",
      "A <b>revealed Cylon</b> may ignore a Crisis card’s negative effects (no discarding cards, no being sent to Sickbay/Brig).",
      { t: "A Cylon player may also ignore a Crisis effect that would execute them, unless the card specifically says to execute a Cylon player (e.g. ‘Resistance Bombing’).", when: c => c.has("pegasus"), tag: "pegasus", src: "Pegasus p.7" },
      { t: "With the <b>Cylon Fleet</b>, all Cylon attack cards are removed from the Crisis and Super Crisis decks (including Daybreak's, if used), and the ‘CAG Chooses’ cards are added. An activation that would normally do ‘nothing’ instead places 1 Cylon ship on the Cylon Fleet board (a raider, heavy raider or basestar, depending on the activation, in the area matching a die roll) and advances the Pursuit track 1 space (see the Combat Reference).", when: c => c.opt("cylonFleet"), tag: "exodus", src: "Exodus p.12–13 · Daybreak p.17" }
    ]},

    { h: "Jumping, Distance & Destinations", items: [
      "The fleet jumps when the Jump-Prep marker reaches the <b>Auto-Jump</b> space, or when a player uses <b>FTL Control</b> (only while the fleet marker is on a blue space of the track; roll a die: on <b>1–6</b> lose the population shown on the fleet’s Jump-Prep space).",
      { t: "To jump: remove all ships from the board. Vipers return to the Reserves and their pilots move to the ‘Hangar Deck’. Civilian ships are shuffled back into the unused pile. Centurions stay on the Boarding Party track. The <b>Admiral</b> then draws 2 Destination cards, chooses 1 (the other goes to the bottom of the deck) and resolves it, and the fleet token returns to the start of the Jump-Prep track. Distance accumulates on the Destination cards beside the Objective card.", src: "Base p.13, p.25" },
      { t: "<b>Assault raptors</b> are an exception to removing ships. A character piloting one may stay in their space area, and the current player may keep any unmanned assault raptor in its space area instead of returning it to the Reserves.", when: c => c.has("daybreak"), tag: "daybreak", src: "Daybreak p.11" },
      { t: "<b>Cylon Fleet exception:</b> when the fleet jumps, civilian ships <b>stay</b> in their space areas, and Cylon ships move to the corresponding Cylon Fleet board areas instead of being removed.", when: c => c.opt("cylonFleet"), tag: "exodus" },
      "The <b>distance to win</b> is set by your Objective card (shown in the mode card above).",
      { t: "Passed <b>Mission</b> cards that show a distance number also count toward your total distance.", when: c => c.obj === "earth", tag: "daybreak" }
    ]},

    { h: "Movement & Locations", items: [
      "Humans may never move to Cylon locations; a revealed Cylon may only move to/among Cylon locations.",
      { t: "<b>Hazardous</b> locations (yellow-striped border) can’t be entered by normal movement — only when a card or effect sends you there.", when: c => c.has("pegasus") || c.has("daybreak"), tag: c => BSG.howToPlay._hazardTag(c) },
      { t: "<b>Movement abilities</b> are used during your Movement step instead of moving (not on another player’s turn, and only one per turn).", when: c => c.has("pegasus"), tag: "pegasus" },
      { t: "An effect that prohibits actions of a type also prohibits Movement abilities of that type (e.g. while ‘Hornet’s Nest’ is in play, no actions or Movement abilities on Piloting cards).", when: c => c.has("pegasus") && c.has("daybreak"), tag: "daybreak", src: "Daybreak p.16" },
      { t: "The Daybreak <b>overlays</b> change several locations — e.g. activating ‘Caprica’ no longer skips Prepare for Jump, and the ‘Resurrection Ship’ is hazardous. Read the overlays before playing.", when: c => c.has("daybreak"), tag: "daybreak" }
    ]},

    /* Execution exists only with Pegasus and/or Exodus (Pegasus p.12, Exodus p.7;
       Daybreak only adjusts it when combined — p.16–17; FAQ p.9). */
    { h: "Execution", items: [
      { t: "When your character is executed: <b>Discard Cards</b>: discard your hand of Skill cards and any Quorum cards played on your character (Quorum cards in your hand are unaffected). Then <b>Prove Loyalty</b>: if you hold any ‘You Are a Cylon’ card, reveal one (you do <b>not</b> take its action) and proceed as a Cylon. If all your cards are ‘You Are Not a Cylon,’ reveal them and proceed as a human. A Cylon Leader has no Loyalty cards to reveal and goes straight to the Cylon step (a Pegasus Agenda card is not revealed). An executed Cylon Leader, or a revealed Cylon executed on New Caprica, does not discard their Super Crisis cards (FAQ).", when: c => c.has("pegasus") || c.has("exodus") },
      { t: "<b>Human:</b> lose 1 morale and return your character sheet and token to the box (that character can’t be used again). Then choose a new character of any type and place it in its starting location. If you have already used a once-per-game ability, the new character’s once-per-game ability is not available (each player uses only one per game, however many characters they play). If no character is available, the humans lose.", when: c => c.has("pegasus") || c.has("exodus") },
      { t: "The new character may not be a Cylon Leader. If <b>Boomer</b> is executed before the Sleeper phase, her player is immediately dealt a new Loyalty card. Special picks: <b>Boomer</b> chosen before the Sleeper phase shuffles 1 ‘You Are Not a Cylon’ card into the Loyalty deck; chosen after it, she starts in the Brig (in Detention if the replaced character was executed on a New Caprica location). <b>Helo</b> counts as stranded on his player’s next turn. <b>Apollo</b> immediately launches in a viper as its pilot (on the Hangar Deck if no vipers are in the Reserves). <b>Baltar</b> chosen before the Sleeper phase adds 1 ‘You Are Not a Cylon’ card to the Loyalty deck, shuffles, and deals his player 1 Loyalty card; chosen after it, he can’t use ‘Cylon Detector’.", when: c => c.has("pegasus") && !c.has("exodus"), tag: "pegasus", src: "Pegasus p.12" },
      { t: "<b>Cylon:</b> move to the Resurrection Ship and follow the revealed-Cylon procedure (but you do not draw a Super Crisis card).", when: c => c.has("pegasus") || c.has("exodus") },
      { t: "<b>End Turn:</b> if the executed character was the current player’s, that player’s turn ends, whether they proved human or Cylon.", when: c => c.has("exodus"), tag: "exodus", src: "Exodus p.8" },
      { t: "A revealed-Cylon executee gives their remaining facedown Loyalty cards to a human player of their choice.", when: c => c.has("pegasus") || (c.has("exodus") && c.has("daybreak")), tag: c => BSG.howToPlay._handoffTag(c) },
      { t: "A revealed-Cylon executee reveals just one ‘You Are a Cylon’ card and keeps their other Loyalty cards facedown.", when: c => c.has("exodus") && !c.has("pegasus") && !c.has("daybreak"), tag: "exodus" },
      { t: "A human executee also discards their Loyalty cards (and, with Ionian Nebula, all their trauma tokens — the new character then draws 3 trauma tokens, replacing any disaster token; an executee proven to be a Cylon keeps their trauma tokens, Exodus p.17), then adds 1 ‘You Are Not a Cylon’ card to the Loyalty deck and draws 1 new Loyalty card (kept hidden); if the new character’s starting location is unavailable, it starts in Sickbay; several characters (Boomer, Helo, Apollo, Baltar, Anders) have special post-execution effects. (A Cylon Leader ignores effects that add-and-draw Loyalty cards.)", when: c => c.has("exodus"), tag: "exodus" },
      { t: "During ‘Discard Cards’ also discard Mutiny cards and miracle tokens; the new character gains no miracle token. If the executee was the Mutineer, the ‘You Are a Mutineer’ card is kept or passed per the reveal; the alternate Tom Zarek draws a Mutiny card.", when: c => c.has("daybreak") && (c.has("pegasus") || c.has("exodus")), tag: "daybreak" }
    ]},

    { h: "Revealed Cylons & Infiltration", items: [
      "On revealing as a Cylon: discard down to <b>3 Skill cards</b>, lose any Titles, move to the Resurrection Ship, take a <b>Super Crisis</b> card, and end your turn (you draw no more Crisis cards).",
      { t: "<b>Handing off excess Loyalty cards:</b> when a Cylon player reveals, they look at all their facedown Loyalty cards and give them to one human player of their choice (just before the End Turn step of revealing). If the fleet has traveled <b>7 or more distance</b>, they keep them instead (FAQ errata). Likewise, a Cylon player who receives Loyalty cards in the Sleeper Agent phase looks at all their facedown Loyalty cards and gives them to one human player of their choice. A Cylon who receives a ‘You Are a Sympathizer’ or ‘You Are a Sympathetic Cylon’ card does not reveal it. The human they pass it to must immediately reveal it as if it had been dealt to them.", when: c => c.has("pegasus") && !c.has("daybreak"), tag: "pegasus", src: "Pegasus p.7 · FAQ p.4" },
      { t: "<b>Handing off excess Loyalty cards:</b> when a Cylon player reveals, they give all their facedown Loyalty cards to one human player of their choice, during the End Turn step of revealing. A Cylon player who receives Loyalty cards in the Sleeper Agent phase looks at all their facedown Loyalty cards and gives them to one human player of their choice. If Galactica has traveled <b>7 or more distance</b>, the Cylon keeps their facedown Loyalty cards, but still gives a ‘You Are a Mutineer’ card to a human player of their choice. A Cylon who receives the ‘You Are a Mutineer’ card does not reveal it. The human they give it to must immediately reveal it as if it had been dealt to them.", when: c => c.has("daybreak"), tag: "daybreak", src: "Daybreak p.12" },
      { t: "On revealing, also discard all your Mutiny cards and your miracle token in the Discard step; revealed Cylons can’t gain miracle tokens or draw/play Mutiny cards, and all abilities on a revealed Cylon’s character sheet are ignored. If the Mutineer reveals as a Cylon, they give the ‘You Are a Mutineer’ card to a human player of their choice at any distance traveled. That player draws 1 Mutiny card and gives each of their Title cards to the next in the line of succession (no extra Loyalty card).", when: c => c.has("daybreak"), tag: "daybreak", src: "Daybreak p.5–6, p.12" },
      { t: "A revealed Cylon’s turn: draw 2 Skill cards of any type(s), move only among Cylon locations, and use Cylon location actions — skipping the Crisis / Activate-Ships / Prepare-for-Jump steps.", when: c => !c.has("pegasus") && !c.has("exodus") && !c.has("daybreak") },
      { t: "A revealed Cylon’s turn: draw 2 Skill cards of any type — but <b>max 1 per Skill deck</b> — move only among Cylon locations, and use Cylon location actions; no Crisis card is drawn and there is no Activate-Ships step. <b>Prepare for Jump is no longer skipped</b>: if a Crisis card the Cylon resolves (e.g. via ‘Caprica’) shows the jump icon, the fleet advances.", when: c => c.has("pegasus") || c.has("exodus") || c.has("daybreak"), tag: c => c.has("daybreak") ? "daybreak" : c.has("exodus") ? "exodus" : "pegasus" },
      { t: "A <b>Cylon Leader</b> is treated as a revealed Cylon EXCEPT while Infiltrating (then they act as a human). They may never hold the President, Admiral, or CAG title.", when: c => c.opt("cylonLeaders"), tag: c => c.has("daybreak") ? "daybreak" : "pegasus" },
      { t: "<b>Infiltrate</b> by activating the (revised) Human Fleet location, then moving to any Galactica location; while infiltrating, draw a Crisis card at the end of your turn. End infiltration by returning to the Resurrection Ship.", when: c => c.opt("cylonLeaders"), tag: c => c.has("daybreak") ? "daybreak" : "pegasus" }
    ]},

    { h: "Titles &amp; Line of Succession", items: [
      { t: "If the President or Admiral is revealed as a Cylon, the title goes to the <b>highest</b> player in that title's line of succession. If the <b>Admiral</b> (but not the President) is sent to the <b>Brig</b>, the next player in line claims the Admiral title; an Admiral who later leaves the Brig doesn't automatically reclaim it. A President in the Brig keeps the title and all its abilities.", when: c => !c.has("pegasus"), src: "Base p.28 · FAQ p.1 (errata)" },
      { t: "If the President or Admiral is revealed as a Cylon, the title goes to the <b>highest</b> player in that title's line of succession. If the <b>Admiral</b> (but not the President) is sent to the <b>Brig</b>, the highest player in line claims the Admiral title; an Admiral who later leaves the Brig doesn't automatically reclaim it. A President in the Brig keeps the title and all its abilities.", when: c => c.has("pegasus"), tag: "pegasus", src: "Pegasus p.8" },
      "If every human is in the Brig, the Admiral is the character in the Brig who is highest in the line of succession; if one of them leaves the Brig, he immediately becomes Admiral (official FAQ p.2).",
      { t: "With any expansion, use the revised lines of succession (Reference Charts).", when: c => c.has("pegasus") || c.has("exodus") || c.has("daybreak"), src: "Pegasus p.8 · Exodus p.9 · Daybreak p.13" },
      { t: "If the President or Admiral is <b>executed</b>, the title changes hands after the new character is chosen and goes to the highest player in line (the new character included). A new character who is higher in line than the current President or Admiral does not automatically gain that title.", when: c => c.has("pegasus"), tag: "pegasus", src: "Pegasus p.8, p.12" },
      { t: "If the President or Admiral is <b>executed</b>, the title changes hands after the new character is chosen.", when: c => c.has("exodus") && !c.has("pegasus"), tag: "exodus", src: "Exodus p.8" },
      { t: "The <b>CAG</b> title passes to the highest character in the CAG line of succession if the CAG is revealed as a Cylon or sent to the Brig; a CAG who later leaves the Brig doesn't automatically reclaim it.", when: c => c.opt("cylonFleet"), tag: "exodus", src: "Exodus p.14" }
    ]},

    { h: "Winning &amp; Losing", items: [
      "<b>Humans win</b> by travelling the distance on the Objective card and then making a final jump with every resource above 0.",
      "<b>Cylons win</b> by reducing any resource (food, fuel, morale, population) to 0, by destroying Galactica (<b>6 or more</b> Galactica locations damaged at the same time), or when a boarding centurion reaches the end of the Boarding Party track.",
      "<b>Sleeper Agent phase</b> — partway through the game (the Objective card sets exactly when) each player is dealt <b>1 more Loyalty card</b> from the deck, so a loyal human can secretly become a Cylon.",
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
      "Played with the <b>New Caprica Objective card</b> (Pegasus). Once the humans have traveled <b>7 or more distance</b>, the game enters the New Caprica phase: characters move to the New Caprica board for the occupation phase, which uses its own New Caprica Crisis deck.",
      "Cylons hold humanity prisoner (Occupation Forces, Detention) while humans run a resistance; the Pegasus President & Admiral titles gain occupation-phase abilities. Until Galactica returns to orbit no one may leave the New Caprica locations; after that, humans move between New Caprica and Galactica/Pegasus (Cylons: New Caprica ↔ Cylon locations) by discarding a Skill card. Colonial One is off-limits for the rest of the game.",
      "Galactica returns to orbit when the fleet marker reaches Auto Jump (the Jump track is then no longer used); at any point after that, the Admiral may (as an action) <b>order Galactica to leave</b>, ending the game.",
      "<b>Humans win</b> if — after destroying civilian ships still on New Caprica and executing humans left there — no resource is at 0. <b>Cylons win</b> if a resource hits 0, at least 6 Galactica locations are damaged, or a centurion reaches the end of the Boarding Party track.",
      "<b>Phase setup (Pegasus p.13):</b> leave centurions and any Destination-placed Cylon ships where they are (unaffected until Galactica returns); humans (including anyone in the Brig) move to <b>Resistance HQ</b>, Cylons to <b>Occupation Authority</b>; stack all surviving civilian ships on <b>Locked Civilian Ships</b>; shuffle the New Caprica Crisis deck and box the normal Crisis deck; <b>reset the fleet marker to Start</b> on the Jump track.",
      "<b>Before Galactica returns (Pegasus p.14–16):</b> ignore Cylon ship activation icons and evacuation icons (prepare-for-jump icons still count); ignore effects that place, destroy or move ships around Galactica or centurions; Galactica/Pegasus locations can't be damaged or repaired. Preparing a ship moves the top Locked ship to the bottom of the Prepared stack. <b>When Galactica returns (p.17):</b> place a basestar + 4 raiders in each of the two space areas above Galactica, launch 2 vipers into each viper-launch area; from then on, each evacuation icon moves the top Prepared ship to a viper-launch area.",
      "Until Galactica returns to orbit, anyone who would go to the <b>Resurrection Ship</b> (revealing or executed) goes to the <b>Medical Center</b> instead; anything that would send a character on New Caprica to the <b>Brig</b> sends them to <b>Detention</b> instead (Brig-related abilities and Quorum effects apply to Detention there), and — per FAQ errata — anything that would send them to <b>Sickbay</b> sends them to the <b>Medical Center</b>.",
      "In <b>Detention</b> you may not use Loyalty-card reveal actions (as in the Brig), but an Admiral sent to Detention <i>keeps</i> the title. <b>Cylon players can't be sent to Detention</b> (Pegasus p.14), and forced-movement effects (e.g. ‘move to Sickbay’) don't move a character out of Detention (FAQ p.4). When the President (only the President, FAQ p.5) plays a Quorum card while on New Caprica, roll a die: on <b>3 or less</b> the President goes to Detention.",
      { t: "<b>With Daybreak:</b> when the phase begins, return all assault raptors in space areas to the Reserves (their pilots go to Resistance HQ) and, if it isn't already, flip the Colonial One overlay to its ‘Colonial One Destroyed’ side. No civilian ships may be placed in space areas until Galactica returns to orbit; after that they may be, but ships on the Locked or Prepared Civilian Ships stacks can't be moved off them unless a game effect allows it.", when: c => c.has("daybreak"), tag: "daybreak", src: "Daybreak p.17" },
      { t: "<b>With the Cylon Fleet option:</b> when Galactica returns to orbit, place the Cylon ships using the Cylon Fleet ‘Placing Cylon Ships on the Main Game Board’ steps. Civilian ships don't stay in space during New Caprica setup; after Galactica returns, vipers may escort civilian ships as usual.", when: c => c.opt("cylonFleet"), tag: "exodus", src: "Exodus p.22" }
    ]},
    ionianNebula: { items: [
      "Played with the <b>Ionian Nebula Objective card</b> (Exodus). Each player starts with 3 secret <b>Trauma tokens</b> (benevolent or antagonistic; any disaster token drawn at setup is replaced). You gain more by starting your turn in Sickbay or the Brig (take the token there, then refill it from the pool) and from card effects. Drawing a <b>disaster</b> token during play: reveal it; a human is <b>executed</b>, a Cylon draws 2 more tokens; disaster tokens then go back into the pool. (Exodus p.16–17)",
      "<b>Allies</b> drawn from the Ally deck may help or harm the fleet; each carries a hidden trauma token that decides which result applies when a player ends their movement on its location.",
      "At <b>8 or more distance</b> the current turn is interrupted for the <b>Crossroads phase</b> (Exodus p.18–20): (1) <b>Battle of the Ionian Nebula</b>: place a basestar + 4 raiders in each of the two space areas above Galactica (with the Cylon Fleet option, use its ‘Placing Cylon Ships on the Main Game Board’ steps), launch 2 vipers into each viper-launch area, and move the fleet marker to Start. (2) Each player is dealt a <b>Crossroads card</b> and secretly plays one trauma token beside it to choose its result (no tokens: choose either result); starting with the current player and going clockwise, reveal and resolve them. (3) <b>The Trial / Boxing the Line</b>: everyone reveals trauma; humans (including unrevealed Cylons) discard benevolent tokens and Cylons discard antagonistic ones; anyone left with 2 or fewer discards them; the player with the most remaining is <b>eliminated</b>. Ties: among humans, the President picks one; among Cylons, every tied Cylon; between humans and Cylons, every tied Cylon plus the tied human (the President picks if several humans tied). An eliminated player has lost, whichever side wins (FAQ p.7).",
      "Standard win/loss otherwise applies (reach the distance and final-jump with resources above 0).",
      { t: "<b>With Daybreak:</b> an Ally card for a character whose alternate version was chosen is returned to the box (keep drawing). Athena and ‘Boomer’ are different characters, so choosing Athena does not remove the Boomer Ally.", when: c => c.has("daybreak"), tag: "daybreak", src: "Daybreak p.17" }
    ]},
    earth: { items: [
      "Played with the <b>Earth Objective card</b> and the Search for Home option (Daybreak): once the humans have traveled <b>10 distance</b> (passed Missions with a distance number count toward it), they win on the next jump. (Daybreak p.14–15)",
      "Scout by activating the <b>Bridge</b> on Demetrius to reveal the top <b>Mission card</b> to the Active Mission space, then resolve its skill check. It stays there until the next jump, so <b>only one Mission per jump</b>. Character/card abilities that affect Crisis cards or skill checks (e.g. Investigative Committee, Restore Order, Declare Emergency, Support the People, Command Authority) do NOT apply to Mission checks, and skill-check abilities on played cards aren't resolved; card-limit effects (Brig, being a Cylon player) still apply. (Daybreak p.14 · FAQ p.9)",
      "Some passed Missions count as <b>extra distance</b> (shown by a number on the card). The Demetrius and (later, via the ‘Cylon Civil War’ Mission) Rebel Basestar boards grant powerful actions; the basestar allegiance marker decides who may use the Rebel Basestar.",
      "Supports up to 7 players (one must be a Cylon Leader at 7). The Earth Objective card sets the sleeper-agent timing and final victory."
    ]}
  },

  /* Module-specific play (gated by the active option / expansion). */
  modules: [
    { id: "cylonLeaders", when: c => c.opt("cylonLeaders"), h: "Cylon Leaders", items: [
      { t: "A Cylon Leader is <b>known to be a Cylon</b> from the start. Instead of a Loyalty card they receive ONE secret <b>Agenda</b> card — Hostile or Sympathetic, drawn by player count — that sets whether they win with the humans or the Cylons.", when: c => c.has("pegasus") && !c.has("daybreak"), tag: "pegasus" },
      { t: "A Cylon Leader is <b>known to be a Cylon</b> from the start. Instead of Loyalty cards they receive secret <b>Motive</b> cards — 2 at setup and 2 more during the Sleeper phase (4 total) — which set their true allegiance and can let them win with EITHER side.", when: c => c.has("daybreak"), tag: "daybreak" },
      { t: "They draw only <b>2</b> Skill cards at the start of the game (from their own skill set), have always-on character abilities, and may never be President, Admiral or CAG.", when: c => !c.has("daybreak"), tag: "pegasus" },
      { t: "They draw only <b>2</b> Skill cards during setup (from their own skill set; Athena starts the game Infiltrating, so she draws 3), have always-on character abilities, and may never be President, Admiral or CAG.", when: c => c.has("daybreak"), tag: "daybreak" },
      "<b>When NOT Infiltrating</b>, a Cylon Leader is treated as a revealed Cylon: they may only move to / among the <b>Cylon locations</b> and use Cylon location actions.",
      { t: "<b>To Infiltrate</b> — activate the revised <b>‘Human Fleet’</b> Cylon location, then move from there to any Galactica location. While Infiltrating they act as a human: move only to human-available locations (never Cylon locations), draw a Crisis card at the end of their turn, draw 1 extra Skill card at Receive Skills (3 total), use Skill-card text abilities (but not Treachery), and play at most 2 Skill cards per check (1 while in the Brig).", when: c => !c.has("daybreak"), tag: "pegasus", src: "Pegasus p.11" },
      { t: "<b>To Infiltrate</b> — activate the revised <b>‘Human Fleet’</b> Cylon location, then move from there to any Galactica location. While Infiltrating they act as a human: move only to human-available locations (never Cylon locations), draw a Crisis card at the end of their turn, draw 1 extra Skill card at Receive Skills (3 total), use Skill-card text abilities, and play at most 2 Skill cards per check (1 while in the Brig).", when: c => c.has("daybreak"), tag: "daybreak", src: "Daybreak p.8, p.10, p.16" },
      { t: "<b>To stop Infiltrating</b>: return to the <b>‘Resurrection Ship’</b> as an action (if used in the Brig or in Detention, they then discard down to 3 Skill cards). They are then no longer Infiltrating and go back to moving among the Cylon locations. Returning to the Resurrection Ship for <i>any</i> reason, including being executed, ends Infiltration. When Infiltration ends, discard any Quorum cards they were given, without effect.", when: c => !c.has("daybreak"), tag: "pegasus" },
      { t: "<b>To stop Infiltrating</b>: return to the <b>‘Resurrection Ship’</b> as an action (if used in the Brig, they then discard down to 3 Skill cards). They are then no longer Infiltrating and go back to moving among the Cylon locations. Returning to the Resurrection Ship for <i>any</i> reason, including being executed, ends Infiltration. When Infiltration ends, discard any Quorum cards they were given (without effect) and any Mutiny cards; they keep their miracle token.", when: c => c.has("daybreak"), tag: "daybreak" },
      { t: "<b>Winning:</b> the Cylon Leader wins with the side named on their <b>Agenda</b> card, but only if <b>every</b> condition listed on it is met by the end of the game. (Infiltrating does not change their allegiance.)", when: c => c.has("pegasus") && !c.has("daybreak"), tag: "pegasus" },
      { t: "<b>Winning:</b> reveal a <b>Motive</b> card any time its condition is currently met (even at game end, based on the final state). To win with the winning side, at game end you must have revealed <b>at least 2</b> Motives matching that side AND have <b>no more than 1</b> unrevealed Motive. A leader showing 2 human + 2 Cylon Motives can win alongside <i>either</i> side. (Infiltrating does not change their allegiance.)", when: c => c.has("daybreak"), tag: "daybreak" },
      { t: "‘Reveal this card if the game is over’ Motives are revealed only after the end-of-game steps: with <b>New Caprica</b>, after the civilian ships on New Caprica are destroyed and the humans left there are executed; with <b>Personal Goals</b>, after the resource reductions for unrevealed Personal Goals.", when: c => c.has("daybreak") && (c.obj === "newCaprica" || c.opt("conflictedLoyalties")), tag: "daybreak", src: "Daybreak p.17" },
      { t: "<b>Ionian Nebula:</b> an Infiltrating Cylon Leader encounters Allies exactly like a human. At the start of the Crossroads phase, the leader resolves ‘The Trial / Boxing the Line’ as a human if Infiltrating, otherwise as a Cylon.", when: c => c.obj === "ionianNebula", tag: "exodus", src: "Exodus p.22" }
    ]},
    { id: "conflictedLoyalties", when: c => c.opt("conflictedLoyalties"), h: "Conflicted Loyalties", items: [
      "Choose to use the <b>Personal Goal</b> cards, the <b>Final Five</b> cards, or both; return the rest to the box. (Personal Goals make the game much harder for humans — recommended for experienced players.)",
      "<b>How it changes Loyalty-deck creation:</b> during the <b>Organize Loyalty Cards</b> step, shuffle the chosen Personal Goal / Final Five cards into the <b>‘You Are Not a Cylon’ pile</b>, then build the deck with the normal chart. This does <b>NOT change how many cards are dealt</b> — some ‘You Are Not a Cylon’ cards are now secretly Personal Goal / Final Five cards. Both types count as ‘You Are Not a Cylon’ when deciding whether a player is human or Cylon.",
      "<b>Personal Goal:</b> reveal it as an action only when <i>all</i> its conditions are currently true. If revealed at <b>6 or less</b> distance, add the top ‘You Are Not a Cylon’ card to the Loyalty deck, reshuffle, and draw a new (hidden) Loyalty card; at <b>7 or more</b> distance, draw nothing. Each <i>unrevealed</i> Personal Goal held by a human at game end reduces a resource — if that drops one to 0, the Cylons win. (A revealed Cylon’s unrevealed Personal Goal does not reduce a resource.)",
      "<b>Final Five:</b> the card reads ‘You Are Not a Cylon,’ but the character is one of the Final Five models. It works as a Not-a-Cylon card <b>unless</b> the player also holds a ‘You Are a Cylon’ card — then they are treated as a Cylon. If anyone looks at another player’s Final Five card they must immediately reveal it and return it (the owner resolves its text, then re-hides it). If a Final Five card is revealed by an execution, its owner resolves the card’s text and then returns the card to the box. A Final-Five human (no ‘You Are a Cylon’ card) who is executed is not resurrected: the character is out of play and the execution resolves as a human (lose morale, choose a new character). Revealed Cylons are unaffected by Final Five card abilities."
    ]},
    { id: "cylonFleet", when: c => c.opt("cylonFleet"), h: "Cylon Fleet", items: [
      "Adds the Cylon Fleet board with the <b>Basestar Bridge</b> (a Cylon location) and a <b>Pursuit track</b>.",
      "When an activation finds nothing on the main board, it feeds the Cylon Fleet board instead (Exodus p.13): <b>activate raiders</b> with no raiders or basestars on the main board places 1 raider; <b>activate heavy raiders/centurions</b> with no heavy raiders, centurions or basestars places 1 heavy raider; <b>launch raiders</b> or <b>activate basestars</b> with no basestars places 1 basestar. The current player rolls a die and places the ship in the matching Cylon space area. If no ship of that type is left to place, instead move all ships in the highest-numbered Cylon space area holding one of that type to the matching main-board space area. Either way, then advance the pursuit marker 1 space (other effects can also advance it). (FAQ: if the only basestar on the main board has a disabled hangar or disabled weapons token, nothing is placed and the marker does not advance.) When the marker reaches <b>Auto Attack</b>, move all Cylon ships from the Cylon Fleet board to the corresponding space areas on the main board, then return the marker to the start space.",
      "<b>When the fleet jumps:</b> move all Cylon ships on the main board to the corresponding Cylon Fleet board areas, and remove <b>all basestar damage tokens</b>, randomly mixing them back into the unused pile (FAQ errata — this reversed an older ruling). Civilian ships are not removed.",
      "The <b>CAG</b> title (its own line of succession) is in play; at Civilian-ship pursuit spaces the CAG places civilian ships, and an Infiltrating Cylon Leader may never become CAG.",
      { t: "With Search for Home also in play: while the basestar allegiance marker shows its Cylon side, Cylon players may discard a Skill card to travel between the <b>Basestar Bridge</b> and any Rebel Basestar location.", when: c => c.obj === "earth", tag: "daybreak" }
    ]},
    { id: "mutinyCards", when: c => c.has("daybreak"), h: "Mutiny Cards", items: [
      "<b>Mutiny cards</b> are drawn when an effect tells you to (keep them hidden) and played as actions to help humanity, at the risk of the Brig. If you already have a Mutiny card and draw a second, you immediately move to the <b>Brig</b> (unless told otherwise); in the Brig you keep only 1 and discard the rest. Revealed Cylons can never draw, play or be chosen to draw Mutiny cards (a hidden Cylon who reveals discards them all); a Cylon Leader draws and uses them only while Infiltrating."
    ]},
    { id: "mutiny", when: c => c.has("daybreak") && BSG.loyalty.compute(c).mutineer, h: "The Mutineer", items: [
      "This setup includes the <b>‘You Are a Mutineer’</b> Loyalty card (a human loyalist working against the fleet’s leadership). It counts as ‘You Are Not a Cylon’ for deciding human vs Cylon, so the Mutineer’s other Loyalty card(s) still decide their side. Whoever is dealt it facedown (setup or Sleeper phase) must reveal it immediately and draw an extra Loyalty card. <i>Anyone</i> who receives it draws 1 Mutiny card and gives each of their Title cards to the next in the line of succession. A player handed it by another player draws no extra Loyalty card. After the Sleeper Agent phase, if the card is in the deck and still unrevealed, the current player chooses a human player to draw 1 more Loyalty card (if that card is the Mutineer, they draw no extra Loyalty card).",
      "The <b>Mutineer</b> does not go to the Brig on a second Mutiny card. Only on drawing a <b>third</b> do they move to the Brig (unless told otherwise), and in the Brig they keep 2. During the Prepare for Jump step of the Mutineer’s turn, if their Crisis card has the jump icon, they draw a Mutiny card."
    ]},
    { id: "sympatheticCylon", when: c => c.opt("sympatheticCylon"), h: "Sympathetic Cylon (variant)", items: [
      "Replaces the Sympathizer with the ‘You Are a Sympathetic Cylon’ card: a human who receives it during the Sleeper phase immediately becomes a <b>revealed Cylon</b> and draws a Sympathetic Agenda.",
      "The Sympathetic Cylon must meet every condition on their Agenda card to win. They do <b>not</b> receive a Super Crisis card, but may Infiltrate from the Human Fleet location as if they were a Cylon Leader. While Infiltrating they have no Skill set: at Receive Skills they draw 3 Skill cards of any type, each from a different Skill type. (Not used when Daybreak is in play.)"
    ]}
  ]
};

/* ---- Contextual FAQ — official rulings, surfaced for the active setup ---- */
/* q/a are concise paraphrases of the official BSG FAQ. when: (c)=>bool. */
BSG.faq = [
  { q: "Who gets the President title at setup? (rulebook misprint)",
    a: "Errata: the base rulebook p.5 listed Roslin, Zarek, Baltar; the official FAQ (p.1) corrects it to <b>Laura Roslin, Gaius Baltar, Tom Zarek</b>, as on p.28. The full line of succession is on Base p.28, or with expansions the revised lines (Pegasus p.8 · Exodus p.9 · Daybreak p.13 — Daybreak puts the alternate Lee Adama between Baltar and Zarek)." },
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
  { q: "Besides the normal reveal steps, what else does a player lose on revealing as a Cylon?",
    a: "The normal steps (discard down to 3 Skill cards, lose any Titles) are under Revealed Cylons &amp; Infiltration. In addition, per the official FAQ (p.2): they can no longer be targeted by Executive Order or Quorum cards, their 'keep in play' Quorum cards are discarded, and a viper they were piloting returns to the Reserves." },
  { q: "If FTL Control is damaged, can the fleet still advance and Auto-Jump?",
    a: "Yes to both — the fleet marker still advances on the Jump-Prep track and the fleet can still Auto-Jump." },
  { q: "A revealed Cylon receives the Sympathizer card?",
    a: "They may first give it to any other player, who then immediately resolves it.",
    when: c => BSG.loyalty.compute(c).sympathizer && !c.has("pegasus") },
  { q: "A revealed Cylon is dealt the Sympathizer (or Sympathetic Cylon) card?",
    a: "They don't reveal it. With Pegasus, a revealed Cylon who receives Loyalty cards in the Sleeper phase looks at them and gives them all to one human player of their choice, who must immediately reveal the Sympathizer / Sympathetic Cylon card as if it had been dealt to them (Pegasus p.7).",
    when: c => BSG.loyalty.compute(c).sympathizer && c.has("pegasus") },
  { q: "An unrevealed Cylon receives the Sympathizer card?",
    a: "They follow the card. If it sends them to the Brig they stay an unrevealed Cylon (and may reveal later); otherwise they may pass their other Loyalty cards.",
    when: c => BSG.loyalty.compute(c).sympathizer && !c.opt("sympatheticCylon") },
  { q: "What exactly happens when a human receives the Sympathizer card?",
    a: "Reveal it immediately. If <b>any</b> resource is in the red zone (half or lower) you go to the <b>Brig</b> and the card counts as ‘You Are Not a Cylon.’ If every resource is above half, you become a <b>revealed Cylon</b> for the rest of the game — but you get <b>no Super Crisis card</b> and may <b>never activate the ‘Cylon Fleet’ location</b> or play Super Crisis cards.",
    when: c => BSG.loyalty.compute(c).sympathizer && !c.opt("sympatheticCylon") },
  { q: "How many Skill cards does a Cylon Leader draw at the start of the game?",
    a: "Two — they can never exceed their skill set. (Three if they begin the game Infiltrating, like Athena.)",
    when: c => c.opt("cylonLeaders"), tag: "pegasus" },
  { q: "Can an Infiltrating Cylon Leader be given the 'Assign Vice President' Quorum card?",
    a: "No. They may receive other Quorum cards (e.g. Assign Mission Specialist / Arbitrator), but discard any Quorum cards they were given, without effect, when their Infiltration ends.",
    when: c => c.opt("cylonLeaders"), tag: "pegasus" },
  { q: "Can a character in the Brig or Detention use Movement abilities?",
    a: "<b>Yes</b> — per the official FAQ (p.4). Normal movement is still restricted, but Movement abilities (e.g. on Pegasus Skill cards) may be used. Detention only exists on New Caprica.",
    when: c => c.has("pegasus"), tag: "pegasus" },
  { q: "A Cylon Leader (or a revealed Cylon on the New Caprica board) is executed — do they discard their Super Crisis cards?",
    a: "No (official FAQ p.5, newest revision).",
    when: c => (c.opt("cylonLeaders") && (c.has("pegasus") || c.has("exodus"))) || c.obj === "newCaprica", tag: "pegasus" },
  { q: "Errata: 'Executive Order'",
    a: "It should include: “Limit of 1 ‘Executive Order’ card may be used per turn.” (official FAQ p.1)" },
  { q: "Errata: nuke numbers on the Admiral title card",
    a: "Early printings show incorrect nuke numbers; use the rulebook's Attack Table (Base p.32): 1–2 damaged twice, 3–6 destroyed, 7–8 destroyed + 3 raiders in the same area (official FAQ p.1).",
    when: c => !c.opt("cylonFleet") },
  { q: "Errata: Caprica Six's 'Intimate' (newest revision)",
    a: "“Intimate – Movement: Draw 1 Skill Card at random from another player’s hand. Then, that player draws 1 card from the Skill deck of your choice (it may be from outside his Skill set).” (official FAQ p.4)",
    when: c => c.has("pegasus") && c.opt("cylonLeaders"), tag: "pegasus" },
  { q: "Errata: Kat's 'Stim Junkie'",
    a: "“At the end of your Action step, if you are in the same location or space area that you were in at the start of your turn, you are moved to ‘Sickbay.’” (FAQ p.4) It does not move her out of the Brig (Pegasus p.18).",
    when: c => c.has("pegasus"), tag: "pegasus" },
  { q: "Errata: 'Unwelcome Faces' Crisis card",
    a: "First option: “The Admiral must discard all of his skill cards and then choose a character to send to the ‘Brig.’” (FAQ p.6)",
    when: c => c.has("exodus"), tag: "exodus" },
  { q: "Errata: Helena Cain Ally card",
    a: "Benevolent result: “You may choose another character to be executed. You cannot choose a revealed Cylon.” (FAQ p.6)",
    when: c => c.obj === "ionianNebula", tag: "exodus" },
  { q: "Errata: Doc Cottle's 'Treatment' (newest revision)",
    a: "“Treatment – Action: Choose another human player and draw 2 Skill Cards from his Skill set. Then, give him 2 Skill Cards from your hand.” (FAQ p.8)",
    when: c => c.has("daybreak"), tag: "daybreak" },
  { q: "Errata: 'Weapons Armed' Mutiny card",
    a: "“Action: Destroy a raptor to gain an assault raptor. Then, launch 2 raiders from each basestar and discard this card.” (FAQ p.8)",
    when: c => c.has("daybreak"), tag: "daybreak" },
  { q: "Can Athena activate the Hangar Deck while in the Brig?",
    a: "No (errata to Daybreak p.10, FAQ p.8).",
    when: c => c.has("daybreak") && c.opt("cylonLeaders"), tag: "daybreak" }
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
  { b: "galactica", n: "FTL Control", a: "Jump the fleet if the fleet marker is on a blue space of the Jump-Prep track. Roll a die; on 1–6 lose the population shown on the fleet's current Jump-Prep space." },
  { b: "galactica", n: "Weapons Control", a: "Attack one Cylon ship with Galactica. Roll to hit:<ul class=\"loc-sub rolls\"><li>Raider — hit on <b>3–8</b></li><li>Heavy raider — hit on <b>7–8</b></li><li>Basestar — hit on <b>5–8</b></li></ul>" },
  { b: "galactica", n: "Command", a: "Make up to 2 unmanned-viper activations — the same viper may be activated twice, e.g. launch then attack (FAQ p.3). Each activation can:<ul class=\"loc-sub\"><li>Launch a viper from the Reserves into a space area with a viper launch icon, or</li><li>Move an unmanned viper to an adjacent area, or</li><li>Attack with it (raider <b>3–8</b>, heavy raider <b>7–8</b>, basestar <b>8</b> = damaged) — Base p.24–25.</li></ul>" },
  { b: "galactica", n: "Communications", a: "Look at the backs of 2 civilian ships; you may then move them to adjacent area(s). Only you may look." },
  { b: "galactica", n: "Admiral's Quarters", a: "Choose a character; pass a <b>7</b> (Leadership/Tactics) skill check to send them to the Brig (Base p.18). (You can't choose a character already in the Brig or a revealed Cylon — FAQ p.2. Brigged characters add only 1 card to skill checks; a hidden Cylon in the Brig may still reveal, but can't use his Loyalty card's special ability — Base p.29.)" },
  { b: "galactica", n: "Research Lab", a: "Draw 1 Engineering or 1 Tactics Skill card." },
  { b: "galactica", n: "Research Lab", a: "<i>Unofficial house variant from Joe's ‘BSG Locations (Updated)’ sheet — not in the Daybreak rulebook or any official FFG source:</i> instead, pass a 10 (Purple/Blue) check to gain a miracle token.", when: c => c.has("daybreak") },
  { b: "galactica", n: "Hangar Deck", a: "Launch yourself in a viper; you may then take 1 more action (Base p.8, p.26–27). If no vipers are in the Reserves, you may move one from any space area to the Reserves to pilot it (Base p.28)." },
  { b: "galactica", n: "Armory", a: "Attack a Centurion on the Boarding Party track (destroyed on 7–8)." },
  { b: "galactica", n: "Sickbay", a: "Draw only 1 Skill card at your Receive Skills step. A character can (and should) move out of Sickbay during their Movement step. Hazard location — you can never move here voluntarily, only when sent (Base p.8)." },
  { b: "galactica", n: "Brig", a: "You may not move, draw Crisis cards, or add more than 1 card to skill checks. Action: pass a <b>7</b> (Politics/Tactics) skill check to move to any location on Galactica. Hazard location — you can never move here voluntarily, only when sent (Base p.8)." },

  /* ---- COLONIAL ONE — ORIGINAL (no Mutiny cards) ---- */
  { b: "colonial", n: "Press Room", a: "Draw 2 Politics Skill cards.", when: c => !c.has("daybreak") },
  { b: "colonial", n: "President's Office", a: "If you are the President, draw 1 Quorum card, then either:<ul class=\"loc-sub\"><li>Draw 1 additional Quorum card, or</li><li>Play 1 Quorum card from your hand.</li></ul>", when: c => !c.has("daybreak") },
  { b: "colonial", n: "Administration", a: "Choose a character, then pass a 5 (Yellow/Green) check to give them the President Title. A revealed Cylon may not be given the Title.", when: c => !c.has("daybreak") },

  /* ---- COLONIAL ONE — MUTINY version (Daybreak overlay) ---- */
  { b: "colonial", n: "Quorum Chamber", a: "If you are the President, draw 1 Quorum card, then either:<ul class=\"loc-sub\"><li>Draw 1 additional Quorum card, or</li><li>Play 1 Quorum card from your hand.</li></ul>", when: c => c.has("daybreak"), tag: "daybreak" },
  { b: "colonial", n: "Press Room", a: "Choose a player to draw 1 Mutiny card (they do NOT move to the Brig); they keep 1 Mutiny card and discard the rest. You may then discard a Mutiny card.", when: c => c.has("daybreak"), tag: "daybreak" },
  { b: "colonial", n: "President's Office", a: "Draw 2 Politics Skill cards.", when: c => c.has("daybreak"), tag: "daybreak" },
  { b: "colonial", n: "Administration", a: "Draw 1 Mutiny card. If the President has any Mutiny cards, choose a player to gain the President Title. (If 'Accept Prophecy' is in play, the President may discard it to keep the Title.)", when: c => c.has("daybreak"), tag: "daybreak" },
  { b: "colonial", n: "Colonial One Destroyed", a: "The overlay starts with its ‘Colonial One Destroyed’ side facedown (Daybreak p.4). If it is flipped (e.g. ‘Bomb on Colonial 1’ fails), all characters on Colonial One go to Sickbay and these locations are gone (Daybreak p.11). With the New Caprica objective, it is flipped at the start of the New Caprica phase if not already (Daybreak p.17).", when: c => c.has("daybreak"), tag: "daybreak" },
  { b: "colonial", n: "Note", a: "Moving between Galactica and Colonial One, in either direction, costs 1 Skill card discard (Base p.8, p.10)." },   // core rule (Base p.8, p.10)

  /* ---- CYLON LOCATIONS (always; revealed Cylon only) ---- */
  { b: "cylon", n: "Caprica", a: "Choose one:<ul class=\"loc-sub\"><li>Play 1 of your Super Crisis cards.</li><li>Draw 2 Crisis cards, resolve 1, and discard the other.</li></ul><span class=\"loc-after\">During that Crisis there are no Activate-Cylon-Ships or Prepare-for-Jump steps.</span>", when: c => !c.has("pegasus") && !c.has("exodus") && !c.has("daybreak") },
  { b: "cylon", n: "Caprica", a: "Choose one:<ul class=\"loc-sub\"><li>Play 1 of your Super Crisis cards.</li><li>Draw 2 Crisis cards, resolve 1, and discard the other.</li></ul><span class=\"loc-after\">During that Crisis there is no Activate-Cylon-Ships step, but you DO still Prepare for Jump (Exodus p.9).</span>", when: c => c.has("exodus") && !c.has("pegasus") && !c.has("daybreak"), tag: "exodus" },
  { b: "cylon", n: "Caprica", a: "Choose one:<ul class=\"loc-sub\"><li>Play 1 of your Super Crisis cards.</li><li>Draw 2 Crisis cards, resolve 1, and place the other on the bottom of the Crisis deck.</li></ul><span class=\"loc-after\">During that Crisis there is no Activate-Cylon-Ships step, but you DO still Prepare for Jump (Pegasus p.7; Daybreak p.4, p.12).</span>", when: c => c.has("pegasus") || c.has("daybreak"), tag: c => c.has("daybreak") ? "daybreak" : "pegasus" },
  { b: "cylon", n: "Cylon Fleet", a: "Choose one:<ul class=\"loc-sub\"><li>Activate all Cylon ships of one type, or</li><li>Launch 2 raiders and 1 heavy raider from each basestar.</li></ul><span class=\"loc-after\">Activating heavy raiders advances the Centurions 1 step on the Boarding Party track, even if none are on the board.</span>" },
  { b: "cylon", n: "Cylon Fleet", a: "Cylon Fleet option: activating a ship type counts as resolving that activation icon, so it can place ships on the Cylon Fleet board and advance the Pursuit track. The launch option uses only basestars on the main board and never places ships on the Cylon Fleet board or advances Pursuit (FAQ p.7).", when: c => c.opt("cylonFleet"), tag: "exodus" },
  { b: "cylon", n: "Sympathizer note", a: "A Sympathizer who became a revealed Cylon may never activate the Cylon Fleet location or play Super Crisis cards — including Caprica's Super Crisis option (Base p.19).", when: c => BSG.loyalty.compute(c).sympathizer && !c.opt("sympatheticCylon") },
  { b: "cylon", n: "Human Fleet", a: "Look at any player's hand and steal 1 Skill card (put it in your hand). Then roll a die — on <b>5+</b> damage Galactica.", when: c => !c.has("pegasus") && !c.has("daybreak") },
  { b: "cylon", n: "Human Fleet", a: "Look at the top card of the Crisis or Destination deck and place it on the top or bottom of that deck. Then draw 2 Skill cards.", when: c => c.has("pegasus") || c.has("daybreak"), tag: c => c.has("daybreak") ? "daybreak" : "pegasus" },
  { b: "cylon", n: "Human Fleet", a: "Cylon Leader option: instead, Infiltrate — move to any Galactica location and play as a human (Pegasus p.11; Daybreak p.8).", when: c => c.cyl, tag: c => c.has("daybreak") ? "daybreak" : "pegasus" },
  { b: "cylon", n: "Human Fleet", a: "Revealed Sympathetic Cylon option: instead, Infiltrate — move to any Galactica location and play as a human, as if he were a Cylon Leader (Pegasus p.18).", when: c => c.opt("sympatheticCylon"), tag: "pegasus" },
  { b: "cylon", n: "Resurrection Ship", a: "You may discard your Super Crisis card to draw a new one. Then, if distance is 7 or less, give your unrevealed Loyalty card(s) to any player.", when: c => !c.has("pegasus") && !c.has("daybreak") },
  { b: "cylon", n: "Resurrection Ship", a: "Hazardous: you can't move here voluntarily, only when sent (Pegasus p.8–9). While here, draw only 1 Skill card at your Draw-Skills step. Action: draw 1 Super Crisis card. (Facedown Loyalty cards are handed off under ‘Handing Off Excess Loyalty Cards’, Pegasus p.7, instead of at this location.)", when: c => c.has("pegasus") && !c.has("daybreak"), tag: "pegasus" },
  { b: "cylon", n: "Resurrection Ship", a: "Hazardous: you can't move here as normal movement, only when sent (Daybreak p.4, p.12). While here, draw only 1 Skill card at your Draw-Skills step. Action: draw 1 Super Crisis card.", when: c => c.has("daybreak"), tag: "daybreak" },
  { b: "cylon", n: "Hub Destroyed", a: "Only after an effect flips the Cylon Locations overlay to its ‘Hub Destroyed’ side (it starts facedown); it then replaces the Resurrection Ship — tokens there move here, and anything referring to the Resurrection Ship uses this location (Daybreak p.4, p.11). At your Draw-Skills step, discard all your Super Crisis cards and draw no Skill cards. Action: discard 3 Skill cards to draw 1 Super Crisis card and move to the Cylon Fleet location.", when: c => c.has("daybreak"), tag: "daybreak" },

  /* ---- VIPERS IN SPACE (always) ---- */
  { b: "vipers", n: "Activating an unmanned viper", a: "Choose one:<ul class=\"loc-sub\"><li>Launch a viper from the Reserves, or</li><li>Move a deployed viper to an adjacent space area, or</li><li>Attack a Cylon ship with a viper in the same space area.</li></ul>" },
  { b: "vipers", n: "Viper pilot in space", a: "Choose one:<ul class=\"loc-sub\"><li>Move to an adjacent space area, or</li><li>Attack a Cylon ship in your space area.</li></ul>" },
  { b: "vipers", n: "Any viper activation", a: "Cylon Fleet option: instead of moving or attacking, escort 1 civilian ship in the viper's space area to safety — shuffle it back into the pile of unused civilian ships.", when: c => c.opt("cylonFleet"), tag: "exodus" },
  { b: "vipers", n: "Viper Mark VII", a: "When piloted or activated, a Mark VII may move <b>2</b> space areas instead of 1 (move to an adjacent area, then optionally 1 more). Attacked: damaged on 6–7, destroyed on 8 (Exodus p.15; Daybreak p.20).", when: c => c.opt("cylonFleet"), tag: "exodus" },
  { b: "vipers", n: "Assault raptors", a: "Treated as vipers (not raptors) for all game effects. Any effect that launches, activates, places, damages or destroys a viper may use one, including Command. An assault raptor damages a basestar on <b>7–8</b> (a viper needs 8). Assault raptors can't be damaged: one attacked is destroyed on 7–8, and one chosen to be damaged is destroyed (Daybreak p.11, p.20).", when: c => c.has("daybreak"), tag: "daybreak" },

  /* ---- PEGASUS BATTLESTAR (Pegasus in play) ---- */
  { b: "pegasus", n: "Pegasus CIC", a: "Choose a basestar and roll a die:<ul class=\"loc-sub rolls\"><li><b>1–3</b> — damage Pegasus</li><li><b>4–6</b> — damage the basestar</li><li><b>7–8</b> — damage the basestar twice</li></ul>" },
  { b: "pegasus", n: "Airlock", a: "Choose a character and pass a skill check to execute them. Treachery, Politics and Tactics count positive; target is 12+ (or 8 if the character is in the Brig)." },
  { b: "pegasus", n: "Main Batteries", a: "Choose a space area and roll a die:<ul class=\"loc-sub rolls\"><li><b>1</b> — destroy 1 civilian ship</li><li><b>2–3</b> — damage 1 viper</li><li><b>4–6</b> — destroy 2 raiders</li><li><b>7–8</b> — destroy 4 raiders</li></ul><span class=\"loc-after\">Scar can be one of the destroyed raiders only on a 7–8 (FAQ p.5).</span>" },
  { b: "pegasus", n: "Engine Room", a: "Discard 2 Skill cards to treat the next Crisis card drawn this turn as if it had a 'Prepare for Jump' icon." },
  { b: "pegasus", n: "Note", a: "Pegasus is a separate ship: moving between Pegasus and Galactica or Colonial One costs 1 Skill card discard (Pegasus p.9)." },

  /* ---- CYLON FLEET BOARD — Basestar Bridge (Cylon Fleet option) ---- */
  { b: "cylonfleet", n: "Basestar Bridge", a: "Revealed Cylons only (humans can never move here or activate it); no Skill-card discard to move between here and the other Cylon locations (Exodus p.12; Daybreak p.17). Choose 2 different abilities and resolve them one at a time (Exodus p.12):<ul class=\"loc-sub\"><li>The CAG must place 1 civilian ship (following all placement rules).</li><li>Roll a die: 1–3 decrease the Jump track by 1; 4–8 increase the Pursuit track by 1.</li><li>Place 1 basestar or 3 raiders in any 1 area of this Cylon basestar region.</li><li>Roll a die: if the result is less than the number of raiders on the main board, draw 2 Galactica damage tokens and resolve 1.</li></ul><span class=\"loc-after\">If both basestars are already on the main or Cylon Fleet board, placing a basestar does nothing (FAQ p.7).</span>" },
  { b: "cylonfleet", n: "Rebel Basestar link", a: "While the basestar allegiance marker shows the Cylon side, Cylons may move between the Basestar Bridge and any Rebel Basestar location by discarding 1 Skill card (Daybreak p.17).", when: c => c.opt("cylonFleet") && c.has("daybreak") && c.obj === "earth", tag: "daybreak" },

  /* ---- NEW CAPRICA (New Caprica objective, Occupation phase) ---- */
  { b: "newcaprica", n: "Attack Occupation Forces (Human)", a: "Roll a die; on 5+ destroy an occupation force in your location. You may discard a 'Maximum Firepower' Skill card to reroll the attack die." },
  { b: "newcaprica", n: "Detain a Human (Cylon)", a: "If you're in a location with a human character and an occupation force, roll a die:<ul class=\"loc-sub rolls\"><li><b>1–3</b> — move the human to Detention</li><li><b>4–7</b> — move the human to the Medical Center</li><li><b>8+</b> — nothing happens (FAQ errata)</li></ul>" },
  { b: "newcaprica", n: "Medical Center", a: "You may only draw 1 Skill card during your Receive Skills step." },
  { b: "newcaprica", n: "Detention", a: "You may not move or add more than 2 cards to skill checks. Action: pass a 9 (Yellow/Purple) check to move to any New Caprica location (FAQ)." },
  { b: "newcaprica", n: "Resistance HQ (Human)", a: "Choose a character on New Caprica (human or Cylon), then pass a 7 (Green/Purple/Brown) check to execute them." },
  { b: "newcaprica", n: "Occupation Authority", a: "<ul class=\"loc-sub roles\"><li><span class=\"role-h\">Human</span> (if President): draw 1 Quorum card, then you may play 1 Quorum card.</li><li><span class=\"role-c\">Cylon</span>: activate the occupation forces (each token moves 1 space right), then place 1 occupation force on this location.</li></ul>" },
  { b: "newcaprica", n: "Breeder's Canyon", a: "<ul class=\"loc-sub roles\"><li><span class=\"role-h\">Human</span>: reduce the highest resource by 1 to advance the fleet marker 1 space up the Jump track.</li><li><span class=\"role-c\">Cylon</span>: draw and resolve the top Crisis card, then skip the Prepare-for-Jump step this turn.</li></ul>" },
  { b: "newcaprica", n: "Shipyard", a: "<ul class=\"loc-sub roles\"><li><span class=\"role-h\">Human</span>: prepare or evacuate 1 civilian ship; then, if Galactica is in orbit, you may move to any Galactica location. (Ships can only be evacuated after Galactica returns to orbit.)</li><li><span class=\"role-c\">Cylon</span>: look at the top ship of the Locked Civilian Ship stack and place it on top or bottom.</li></ul>" },

  /* ---- DEMETRIUS (Search for Home) ---- */
  { b: "demetrius", n: "Bridge", a: "If there is no Mission card on the 'Active Mission' space, activate the top card of the Mission deck. (Do not draw a Crisis card this turn.)" },
  { b: "demetrius", n: "Tactical Plot", a: "Look at the top card of the Mission deck and place it on the top or bottom of the deck." },
  { b: "demetrius", n: "Captain's Cabin", a: "Choose any skill type; each player, including Cylon players, draws 1 Skill card of that type." },

  /* ---- REBEL BASESTAR (Search for Home) ---- */
  { b: "rebel", n: "Hybrid Tank", a: "Discard a Miracle Token or a Super Crisis card to look at the top 5 Crisis cards, then place them back on top of the deck in any order." },
  { b: "rebel", n: "Datastream", a: "Discard a Miracle Token or a Super Crisis card to search 1 Skill deck and its discard pile and take any 3 cards; then shuffle the discard pile into the deck." },
  { b: "rebel", n: "Raider Bay", a: "Discard a Miracle Token or a Super Crisis card to choose a space area; place either 2 raiders or 4 unmanned vipers in that area and activate them." },
];

/* ---- Reckless skill checks (Daybreak) — focused rules reference ---------- */
/* Source: Pegasus p.9 (Reckless Skill cards) & Daybreak p.16 ("Combining
   Pegasus and Daybreak"). Shown only when both are in play; the Daybreak
   Treachery deck governs Reckless checks. */
BSG.reckless = {
  when: c => c.has("pegasus") && c.has("daybreak"),
  src: "Pegasus p.9 · Daybreak p.16",
  intro: "A Pegasus Reckless Skill card (e.g. ‘Jury Rigged’) played before any cards are added makes a skill check <b>Reckless</b> (max 1 per check). With Pegasus and Daybreak combined, after the check's skill-check abilities are resolved, turn the top card of the Treachery deck faceup and apply its strength:",
  outcomes: [
    { k: "Strength > 0", t: "Discard that Treachery card and continue resolving the check. Do <b>not</b> resolve its skill-check ability, and do <b>not</b> include its strength in the total." },
    { k: "Strength = 0", t: "Turn the <b>next</b> Treachery card faceup as well. Resolve the skill-check abilities on <b>both</b> cards (even if that ability already resolved during this check), then discard both. Do <b>not</b> include either card's strength in the total." }
  ],
  notes: [
    "<b>‘Restore Order’ timing:</b> if a ‘Restore Order’ card is played before a check, that check cannot then be made Reckless; likewise ‘Restore Order’ cannot be played before a check that has already been made Reckless. If two or more players want to play a card at once, the current player chooses who goes first.",
    "With both Pegasus and Daybreak, the Pegasus Treachery cards go back in the box — the flipped cards come from the Daybreak Treachery deck, and these Daybreak rulings apply."
  ]
};


/* ---- TEACHING SCRIPT ------------------------------------------------------
   A concise, spoken-word teach for the exact selected configuration.
   Read aloud at the table (~5 minutes core + selected module inserts).
   Ordered by teaching best practice: hook & win conditions first, then the
   turn loop, then the heart of the game (skill checks & hidden loyalty),
   then only the modules actually in play. All claims mirror the audited
   rules content above (rulebooks + official FAQ).
   Sections: { h, when?, body(c) } — body returns HTML ("" to skip).       */
BSG.teach = {
  intro: "Read this aloud — about five minutes. Deal nothing until the end; just let everyone look at the board.",
  sections: [

    { h: "The pitch — and how we win", body: (c) => {
      const dist = { kobol: "travel <b>8 distance</b> and then survive one final jump",
                     newCaprica: "reach the distance on the New Caprica objective and escape the occupation",
                     ionianNebula: "travel <b>8 distance</b>, survive the Crossroads, and make the final jump",
                     earth: "travel <b>10 distance</b> and then make one final jump to Earth" }[c.obj];
      let out = `<p>We are the last of humanity, running from the Cylons aboard the battlestar Galactica. This is a cooperative game — we survive together by jumping the fleet from crisis to crisis until we ${dist}.</p>
<p><b>Except it isn't cooperative.</b> Some of us are secretly Cylons. They win by breaking the fleet: if <b>food, fuel, morale or population is at zero at the end of any turn</b>, if <b>six of Galactica's locations are damaged at once</b>, or if <b>Centurions storm the ship</b>, the Cylons win. Those four resource dials are the clock this whole game runs on — every decision is about spending them slower than the Cylons can drain them.</p>`;
      if (c.cyl) out += `<p>One more thing: one of us is playing a <b>Cylon Leader</b> — openly a Cylon from the start, sitting right there. Their true agenda is secret; they might even need us to win. I'll explain them in a minute.</p>`;
      return out;
    }},

    { h: "Who you really are", body: (c) => {
      const L = BSG.loyalty.compute(c);
      let out = `<p>In a moment everyone${c.cyl ? " except our Cylon Leader" : ""} gets a facedown <b>Loyalty card</b>: “You Are Not a Cylon” — or “You Are a Cylon.” You never show it. Halfway through the game comes the <b>Sleeper Agent phase</b>: everyone${c.cyl ? " except the Cylon Leader" : ""} gets a <b>second</b> Loyalty card. So even if you're loyal now, you might wake up a Cylon later — which means <i>nobody</i> stays above suspicion.</p>`;
      const bits = [];
      if (L.sympathizer && !c.opt("sympatheticCylon")) bits.push("this player count also includes the <b>Sympathizer</b> — usually dealt in the Sleeper phase and revealed immediately: if any resource is already in the red zone they go to the Brig and the card counts as “You Are Not a Cylon” (a hidden Cylon who gets it stays a hidden Cylon); if the fleet is healthy they defect and finish the game as a revealed Cylon — though a weaker one: no Super Crisis card and no use of the Cylon Fleet location");
      if (L.mutineer) bits.push("this player count includes the <b>Mutineer</b> card — it counts as “You Are Not a Cylon”: whoever is dealt it reveals it at once, draws an extra Loyalty card (so the Mutineer could still turn out to be a Cylon), hands any titles down the line and draws a Mutiny card — and from then on draws Mutiny cards more often, going to the Brig only on a third one");
      if (bits.length) out += `<p>One wrinkle: ${bits.join("; ")}.</p>`;
      return out;
    }},

    { h: "The shape of a turn", body: (c) => `
<p>On your turn: <b>draw your Skill cards</b>, <b>move</b> somewhere, and take <b>one action</b>. Then — and this is the engine of the game — you <b>draw a Crisis card</b>, which hits the fleet with a Cylon attack, a skill check, or a hard choice. Many Crisis cards also tick the <b>Jump Preparation track</b>; when it fills, the fleet jumps and we bank distance toward winning. So every single turn: one useful thing from you, one bad thing from the game. The fleet stays afloat only if our actions outrun the crises.</p>`
    },

    { h: "Your action — where the game gives you a choice", body: (c) => {
      let out = `<p>Your action is your agency, so here's the menu: <b>activate the location you're standing on</b> — fire Galactica's guns, launch vipers, draw extra Skill cards, accuse someone at Admiral's Quarters (a skill check) to send them to the Brig; <b>play an action from a Skill card</b> — repair damage, or the best ones let another player move and act, or peek at what's coming; or if you're a pilot, <b>fly your viper</b> — shooting down raiders and protecting the civilian ships that carry our population.</p>
<p>${c.opt("cylonFleet") ? "Three titles are in play" : "Two titles are in play"}: the <b>President</b> plays Quorum cards (political powers), and the <b>Admiral</b> holds the nukes and picks our destination each jump${c.opt("cylonFleet") ? "; the <b>CAG</b> comes with the Cylon Fleet (more on that below)" : ""}. Titles make you powerful — and a prime suspect.</p>`;
      if (c.has("pegasus")) out += `<p>The <b>Pegasus</b> board is a second battlestar with four more locations (the Airlock among them). Moving to it costs a Skill card like any ship change, and when Galactica would be damaged we may damage Pegasus instead — if all four of its locations are damaged at the same time, Pegasus is destroyed.</p>`;
      if (c.has("daybreak")) out += `<p>Everyone also starts with a <b>miracle token</b> — spend it to use the “Once per game” ability on your character sheet (some effects can give you a new one; revealing as a Cylon discards it). There is a perfect moment for it. Wait for that one.</p>
<p>We also start with one <b>assault raptor</b> in the Reserves — it counts as a viper for everything, is better at attacking basestars, and a pilot flying it can stay out in space when we jump. A few cards can give us more.</p>`;
      if (c.obj === "earth") out += `<p>In this mode the Demetrius rides alongside: activating its <b>Bridge</b> launches a <b>Mission card</b> — a risky scouting check that can shortcut our distance to Earth — and on that turn we skip the Crisis card. One mission per jump.</p>`;
      return out;
    }},

    { h: "Skill checks — the heart of the game", body: (c) => {
      let out = `<p>Many crises are <b>skill checks</b>: the card names a difficulty and which skill colors help. Two random cards from the <b>Destiny deck</b> start the pile; then, going around the table, <b>everyone secretly</b> slides in any number of cards — matching colors add, wrong colors <b>subtract</b>. The pile is shuffled and we reveal: meet or beat the difficulty or suffer the consequences.</p>
<p>Hear what that means: a hidden Cylon can <b>poison a check</b> with wrong-colored cards, and the Destiny deck gives them cover — “that negative card? Destiny, I swear.” Reading who threw a check is how you catch a Cylon; it's the whole game in miniature.</p>`;
      if (c.has("pegasus") || c.has("daybreak")) out += `<p>There are also <b>Treachery cards</b> in the mix — they're almost always negative in a check${c.has("daybreak") ? "" : ", and humans can't use their actions"}. Two sit in every Destiny deck, so one revealed might be bad luck — or someone put it there on purpose.</p>`;
      if (c.has("exodus") || c.has("daybreak")) out += `<p>And some Skill cards carry <b>skill check abilities</b> — text that fires from inside the pile no matter who played the card. Checks in this set do more than pass or fail.</p>`;
      return out;
    }},

    { h: "Being a Cylon", body: (c) => `
<p>If your Loyalty card says you're a Cylon: congratulations, play it slow. Sabotage checks, waste actions convincingly, steer the fleet gently toward a cliff. When the humans get close — or the Brig gets close to you — <b>reveal</b>: play your card's one-time sting, then move to the <b>Cylon locations</b> and openly run the attack from there with a Super Crisis card in hand.</p>
<p>For the humans, the counter-tools are the <b>Brig</b> — a suspected Cylon locked up can barely help checks and can't hurt you when revealed — ${(c.has("pegasus")) ? "the <b>Airlock</b> to execute a suspect (an executed human costs 1 morale and returns as a new character; an executed Cylon is exposed but gets no Super Crisis card), " : ""}and simple table-talk. Accusations are part of the game. Make them.</p>`
    },

    { h: "Cylon Leaders", when: (c) => c.opt("cylonLeaders") || c.cyl, body: (c) => {
      if (c.has("daybreak")) return `<p>Our <b>Cylon Leader</b> plays openly as a Cylon but draws secret <b>Motive cards</b> — two now, two at the Sleeper phase — which decide whether they win with us, against us, or either way. They can <b>Infiltrate</b> the fleet to work among us (and be treated as human), or fight from the Cylon locations. Trust them exactly as far as their Motives allow — which you can't see.</p>`;
      const L = BSG.loyalty.compute(c);
      return `<p>Our <b>Cylon Leader</b> plays openly as a Cylon but holds a secret <b>${L.agenda ? L.agenda + " " : ""}Agenda</b>${L.agenda ? ` (at this player count it always comes from the ${L.agenda} deck)` : " — Hostile or Sympathetic —"} with conditions they must all meet to win. They may <b>Infiltrate</b> the fleet and work among us, or attack from the Cylon locations. Helpful today, catastrophic tomorrow: their Agenda decides.</p>`;
    }},

    { h: "Conflicted Loyalties", when: (c) => c.opt("conflictedLoyalties"), body: () => `
<p>Some “You Are Not a Cylon” cards secretly aren't clean: <b>Personal Goals</b> give loyal humans private conditions — fail yours and it bleeds a resource at game end — and a <b>Final Five</b> card means peeking at someone's loyalty can burn the peeker. Short version: this game, even the humans have secrets.</p>`
    },

    { h: "The Cylon Fleet board", when: (c) => c.opt("cylonFleet"), body: () => `
<p>The Cylon fleet is always out there: when a Cylon activation would fizzle, ships build up on the <b>Cylon Fleet board</b> and the <b>Pursuit track</b> ticks up — and when it fills, everything out there <b>jumps in on top of us at once</b>. Space stays dangerous all game, and the <b>CAG</b> title (our lead pilot) decides where the civilian ships fly.</p>`
    },

    { h: "Sympathetic Cylon", when: (c) => c.opt("sympatheticCylon"), body: () => `
<p>We're using the <b>Sympathetic Cylon</b> variant: in the Sleeper phase, a human who receives the Sympathetic Cylon card must reveal it at once and becomes an open Cylon — no Super Crisis card, may Infiltrate from the Human Fleet like a Cylon Leader, and draws a Sympathetic Agenda whose conditions decide whether they win. Don't shoot them on sight; think about what their Agenda might need instead.</p>`
    },

    { h: "This mode's twist", when: (c) => c.obj !== "kobol", body: (c) => {
      if (c.obj === "newCaprica") return `<p>This is the <b>New Caprica</b> game: at some point the fleet settles on a planet — and the Cylons find us. The game moves to the New Caprica board: humans run a resistance under occupation while Galactica returns to orbit for a desperate evacuation. Every civilian ship still on the ground when we leave is gone. It gets darker before it gets better.</p>`;
      if (c.obj === "ionianNebula") return `<p>This is the <b>Ionian Nebula</b> game: everyone starts with three hidden <b>Trauma tokens</b> and picks up more from hardships such as starting a turn in Sickbay or the Brig — and a human who later draws a disaster trauma token is executed on the spot. <b>Allies</b> also appear around the fleet — helpful or scarring. At 8 distance comes the <b>Crossroads</b>: every character is judged on the trauma they carry, and whoever is left carrying the most can be eliminated outright. Take care of your people; it matters at the end.</p>`;
      return `<p>This is the <b>Search for Home</b>: distance 10 is a long way, so we scout. <b>Mission cards</b> from the Demetrius are high-stakes checks that award extra distance and unlock the <b>Rebel Basestar</b> — Cylons who might fight beside us. The fastest route to Earth runs through the riskiest missions.</p>`;
    }},

    { h: "Don't worry about these yet", body: (c) => {
      const later = ["exact Cylon-ship movement (there's a chart)"];
      if (c.has("pegasus") || c.has("exodus")) later.unshift("execution details");   // no execution in base-only / Daybreak-only games
      if (c.has("daybreak")) later.push("Mutiny cards");
      if (c.has("pegasus")) later.push("Reckless checks");                          // Reckless Skill cards come from Pegasus
      if (c.has("pegasus") || c.has("daybreak")) later.push("Treachery card abilities");
      if (c.opt("cylonLeaders") || c.cyl) later.push("Infiltration mechanics");
      if (c.obj === "newCaprica") later.push("the occupation-phase locations");
      if (c.obj === "ionianNebula") later.push("individual Trauma effects");
      if (c.obj === "earth") later.push("the Rebel Basestar locations");
      return `<p>I'll explain ${later.join(", ")} when they first come up — none of them matter until they do.</p>
<p>Last thing. Statistically, someone at this table is already a Cylon${c.p >= 5 ? " — maybe two" : ""}. They know who they are. Watch the checks, watch who benefits… and good hunting. <i>So say we all.</i></p>`;
    }}
  ]
};
