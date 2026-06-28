/* =============================================================================
   Arkham Horror (Second Edition) — Setup Utility
   Data model: expansions, optional modules (Heralds / Guardians / Institutions /
   variants), and a single precedence-aware setup sequence.

   The setup is ONE ordered list of steps that follows the base game's 14 numbered
   setup steps (Core Rulebook p.5). Each step is tagged with the expansion it comes
   from. Where a later source changes an earlier rule, the supersession is encoded
   in the step's `when` condition so only the most recent applicable ruling appears.
   Precedence (newest / most-authoritative wins):
       base < Dunwich < Curse < King in Yellow < Kingsport < Black Goat
            < Innsmouth < Lurker < Miskatonic < FAQ
   The Complete FAQ & Errata corrects every other source and always governs.
   ============================================================================= */

const AH = {};

/* ---- Expansions ---------------------------------------------------------- */
AH.expansions = [
  { id: "base",       name: "Arkham Horror (Base Game)", short: "Base", always: true, kind: "base",
    blurb: "The core game. Investigators race to seal the dimensional gates before the Ancient One awakens." },
  { id: "dunwich",    name: "The Dunwich Horror",        short: "Dunwich", kind: "big",
    blurb: "Big box. Adds the Dunwich game board, the Dunwich Horror monster & track, Injuries/Madness, Tasks & Missions." },
  { id: "curse",      name: "Curse of the Dark Pharaoh (Revised)", short: "Pharaoh", kind: "small",
    blurb: "Small box. Adds the Ancient Whispers marker, Exhibit Items & Encounters, Patrol markers, Benefits/Detriments." },
  { id: "kingyellow", name: "The King in Yellow",        short: "KiY", kind: "small",
    blurb: "Small box. A mind-shattering play tours Arkham — Act deck, Blights, and the King in Yellow Herald." },
  { id: "kingsport",  name: "Kingsport Horror",          short: "Kingsport", kind: "big",
    blurb: "Big box. Adds the Kingsport board, the Rift tracks, Guardians (Nodens, Hypnos, Bast) and the Epic Battle variant." },
  { id: "blackgoat",  name: "The Black Goat of the Woods", short: "Black Goat", kind: "small",
    blurb: "Small box. The Corruption deck, Cult Memberships & Cult Encounters, Gate Bursts, Difficulty cards and a Herald." },
  { id: "innsmouth",  name: "Innsmouth Horror",          short: "Innsmouth", kind: "big",
    blurb: "Big box. Adds the Innsmouth board, the Deep Ones Rising track, Personal Stories, the Innsmouth Look and aquatic monsters." },
  { id: "lurker",     name: "The Lurker at the Threshold", short: "Lurker", kind: "small",
    blurb: "Adds attribute Gate markers, Relationships, and the Lurker Herald with Dark Pacts, Reckonings and Power tokens." },
  { id: "miskatonic", name: "Miskatonic Horror",         short: "Miskatonic", kind: "integrator",
    blurb: "The expansion for expansions. Player-count reference sheets, Institutions, cross-expansion cards and the Dunwich Horror Herald." }
];

/* Display metadata for the source tag shown on every step. */
AH.expMeta = {
  base:       { name: "Base",       cls: "e-base" },
  dunwich:    { name: "Dunwich",    cls: "e-dun"  },
  curse:      { name: "Pharaoh",    cls: "e-cur"  },
  kingyellow: { name: "KiY",        cls: "e-kiy"  },
  kingsport:  { name: "Kingsport",  cls: "e-kgs"  },
  blackgoat:  { name: "Black Goat", cls: "e-bg"   },
  innsmouth:  { name: "Innsmouth",  cls: "e-inn"  },
  lurker:     { name: "Lurker",     cls: "e-lur"  },
  miskatonic: { name: "Miskatonic", cls: "e-misk" },
  faq:        { name: "FAQ",        cls: "e-faq"  }
};
AH.precedence = { base: 0, dunwich: 1, curse: 2, kingyellow: 3, kingsport: 4,
                  blackgoat: 5, innsmouth: 6, lurker: 7, miskatonic: 8, faq: 9 };

/* ---- Optional modules — Heralds, Guardians, Institutions and variants ------
   `type`     groups the chip and drives the "one of each kind" guidance.
   `requires` = expansion id, or array (any-of). `requiresAll` = array (all-of).
   `excludes` = other module ids that cannot be combined with this one.        */
AH.modules = [
  /* --- Play style: only meaningful for The King in Yellow's own cards --- */
  { id: "kiyTouring", name: "Touring Performance", type: "style", requires: "kingyellow", excludes: ["kiyPermanent"],
    summary: "KiY play style: the new cards are kept on top of their decks, so the early game is dominated by the play.",
    description: "A King in Yellow play style for EXPERIENCED players. New Spells/Items/Mythos/Gate/Location cards are placed on TOP of their decks (not shuffled in), and Location decks are not shuffled between encounters — so the strange events of the play come up first and fast (KiY rules, ‘Touring Performance’)." },
  { id: "kiyPermanent", name: "Permanent Performance", type: "style", requires: "kingyellow", excludes: ["kiyTouring"],
    summary: "KiY play style: the new cards are shuffled in, making the play a normal part of Arkham life.",
    description: "A King in Yellow play style: all the new cards are shuffled into their respective decks, so KiY content is spread evenly through the game (KiY rules, ‘Permanent Performance’). The Act deck is still used." },

  /* --- Heralds (placed LEFT of the Ancient One; make the game harder) --- */
  { id: "heraldKiY", name: "Herald: The King in Yellow", type: "herald", requires: "kingyellow",
    summary: "Yellow Sign tokens, the Blight deck and riot monsters raise the terror level faster.",
    description: "When the terror level rises, players add a Yellow Sign token to the doom track or the terror track; a token on the terror track triggers a Blight card. Uses the KiY Herald sheet, 10 Yellow Sign tokens, the Blight deck and the 3 riot monster markers (KiY ‘The Herald’ variant)." },
  { id: "heraldBlackGoat", name: "Herald: The Black Goat of the Woods", type: "herald", requires: "blackgoat",
    summary: "A second ‘hexagon’ monster cup floods every gate with extra monsters and feeds Corruption.",
    description: "Set aside the hexagon-symbol monsters as a second cup. Each gate spawns an extra hexagon monster; defeating one draws a Corruption card; monster surges add doom. Uses the Black Goat Herald sheet (Black Goat ‘The Herald’ variant)." },
  { id: "heraldPharaoh", name: "Herald: The Dark Pharaoh", type: "herald", requires: "curse",
    summary: "Unique Items cost Sanity, Exhibit Items can Curse you, and Mask monsters grow tougher.",
    description: "Gaining a Unique Item costs 1 Sanity; an Exhibit Item may Curse you; Cursed investigators lose Stamina each Upkeep; Mask monsters gain toughness and add doom when defeated. The Dark Pharaoh monster token enters the cup even without Nyarlathotep (Curse ‘The Herald’ variant)." },
  { id: "heraldLurker", name: "Herald: The Lurker at the Threshold", type: "herald", requires: "lurker",
    summary: "Unlocks Dark Pacts (Blood/Soul Pact, Bound Ally), Power tokens and the cruel Reckoning deck.",
    description: "Investigators may strike Dark Pacts with the Lurker for power — but Reckoning cards punish them. Uses the Lurker Herald sheet, the three Dark Pact decks, the Reckoning deck and Power tokens (Lurker ‘The Herald’ variant)." },
  { id: "heraldDunwich", name: "Herald: The Dunwich Horror", type: "herald", requiresAll: ["dunwich", "miskatonic"],
    summary: "The Dunwich Horror starts on the board and grows more dangerous as terror rises.",
    description: "The Dunwich Horror begins in play (1 token on its track; +1 at terror 3/6/9) and moves toward awakening the Ancient One. Requires the Dunwich game board. Uses the Dunwich Horror Herald sheet from Miskatonic Horror (Miskatonic ‘Dunwich Horror Herald’ variant)." },
  { id: "heraldKingsport", name: "Heralds: Kingsport (2 sheets)", type: "herald", requires: "kingsport",
    summary: "Kingsport Horror includes two additional Herald sheets that prepare the way for the Ancient One.",
    description: "Kingsport Horror provides two extra Herald sheets for the Herald/Guardian variant. Place the chosen Herald sheet to the left of the Ancient One and follow its printed rules (Kingsport ‘Herald/Guardian’ variant, p.10)." },

  /* --- Guardians (placed RIGHT of the Ancient One; help the investigators) --- */
  { id: "guardianNodens", name: "Guardian: Nodens", type: "guardian", requires: "kingsport", excludes: ["guardianHypnos", "guardianBast"],
    summary: "Aids Blessed investigators; with Miskatonic Horror adds the Blessings of Nodens deck.",
    description: "Nodens opposes the Ancient One and rewards Blessed investigators. Place the Guardian sheet to the right of the Ancient One. With Miskatonic Horror, shuffle the Blessings of Nodens deck (Kingsport Guardian; Miskatonic add-on)." },
  { id: "guardianHypnos", name: "Guardian: Hypnos", type: "guardian", requires: "kingsport", excludes: ["guardianNodens", "guardianBast"],
    summary: "Speeds up Clue tokens and helpful encounters; with Miskatonic adds the Visions of Hypnos deck.",
    description: "Hypnos increases the rate at which Clue tokens appear and the odds of helpful encounters. Place to the right of the Ancient One. With Miskatonic Horror, shuffle the Visions of Hypnos deck (Kingsport Guardian; Miskatonic add-on)." },
  { id: "guardianBast", name: "Guardian: Bast", type: "guardian", requires: "kingsport", excludes: ["guardianNodens", "guardianHypnos"],
    summary: "Tracks Bast’s favor with Bast tokens and the ‘Beloved of Bast’ cards.",
    description: "Bast aids investigators who earn her favor. Uses the 8 Bast tokens and the ‘Beloved of Bast’ cards. Place the Guardian sheet to the right of the Ancient One (Kingsport Guardian)." },

  /* --- Institutions (Miskatonic; placed RIGHT of the AO / Guardian) --- */
  { id: "instMisk", name: "Institution: Miskatonic University", type: "institution", requires: "miskatonic",
    summary: "Education via Miskatonic Student cards and fast travel via Expedition markers.",
    description: "Investigators may pursue an education (Miskatonic Student → Alumnus) and use the 3 Expedition markers to relocate the University to Dunwich, Kingsport or Innsmouth. Place the Institution sheet to the right of the Ancient One / Guardian (Miskatonic ‘Institution’ variant)." },
  { id: "instBureau", name: "Institution: Bureau of Investigations", type: "institution", requires: "miskatonic",
    summary: "Agent tokens watch street areas to keep monsters from roaming free.",
    description: "Uses the 38 Agent tokens, placed in street areas to suppress monsters. Place the Institution sheet to the right of the Ancient One / Guardian (Miskatonic ‘Institution’ variant)." },
  { id: "instOther", name: "Institution: (third sheet)", type: "institution", requires: "miskatonic",
    summary: "Miskatonic Horror includes a third Institution sheet with its own resource economy.",
    description: "Miskatonic Horror provides three Institution sheets in total; choose one (randomly or by agreement) and follow its printed rules. Place it to the right of the Ancient One / Guardian (Miskatonic ‘Institution’ variant)." },

  /* --- Other selectable variants --- */
  { id: "personalStories", name: "Personal Stories", type: "variant", requires: "innsmouth",
    summary: "Each investigator gets a two-card personal arc with its own pass/fail condition.",
    description: "After investigators are chosen, give each their two Personal Story cards and put the first in play. Meeting its pass or fail condition flips it to the second card for the rest of the game (Innsmouth ‘Personal Story’ variant). Can be used without the Innsmouth board." },
  { id: "epicBattle", name: "Epic Battle", type: "variant", requires: "kingsport",
    summary: "A more dramatic final battle when the Ancient One awakens (Epic Battle + Ancient One Plot cards).",
    description: "Shuffle the green Epic Battle deck on top of the red; set aside the three Ancient One Plot cards for the revealed Ancient One. Used only if the Ancient One awakens — not with Azathoth. Place the Epic Battle cards near the Ancient One sheet (Kingsport ‘Epic Battle’ variant, p.11)." },
  { id: "difficulty", name: "Difficulty Level card", type: "variant", requires: "blackgoat",
    summary: "Choose one of five Difficulty cards to make the game easier or harder. Works in any game.",
    description: "At the start of the game choose one of the five Difficulty Level cards (two easier, two harder, one normal). This variant can be used with any game of Arkham Horror (Black Goat ‘Difficulty Level Variants’)." },
  { id: "lurkerGates", name: "Lurker attribute Gate markers", type: "variant", requires: "lurker",
    summary: "Replace all Gate markers with the Lurker’s, each with an extra attribute (Devouring, Endless, Split…).",
    description: "The Lurker Gate markers replace ALL base/Dunwich/Kingsport Gate markers and add attributes such as Devouring, Gate of Doom, Endless, Monstrous, Moving and Split Gates. This is a selective variant — you may leave them out and still use the rest of Lurker (Lurker ‘Gate Markers’ / ‘Selective Variants’)." },
  { id: "lurkerRelationships", name: "Lurker Relationships", type: "variant", requires: "lurker", minPlayers: 2,
    summary: "Two-or-more-player games: each player gets a Relationship card with the player to their left.",
    description: "A selective Lurker variant for 2+ players. Each player draws a Relationship card describing the bond with their left-hand neighbour; it is kept until either investigator is devoured (Lurker ‘Relationship Cards’)." }
];

/* Module type metadata — order, label and where the sheet is placed. */
AH.moduleTypes = [
  { id: "style",       label: "King in Yellow play style", note: "Choose ONE play style for the King in Yellow cards." },
  { id: "herald",      label: "Heralds", note: "Placed LEFT of the Ancient One. They make the game harder. Use at most one Herald." },
  { id: "guardian",    label: "Guardians", note: "Placed RIGHT of the Ancient One. They help the investigators. Use at most one Guardian." },
  { id: "institution", label: "Institutions", note: "Placed RIGHT of the Ancient One / Guardian. Use at most one Institution." },
  { id: "variant",     label: "Other variants", note: "Optional modules that can be mixed freely." }
];

/* ---- THE UNIFIED SETUP SEQUENCE ------------------------------------------ */
/* Each step: { ph, exp, t, d, src, when }                                     */
/*   ph   = phase index (visual grouping)                                      */
/*   exp  = source expansion tag shown in parentheses                          */
/*   when = (c) => boolean, c = { has(exp), p (players), mod(id), anyBoard,
/*            heraldCount, guardian, institution }                             */
/* Steps render in array order; supersession is baked into `when`.             */
AH.phases = [
  "1 · Prepare the Playing Area",
  "2 · Investigators & the Ancient One",
  "3 · Build the Decks",
  "4 · Equip the Investigators",
  "5 · Monsters, Gates & the First Mythos"
];

AH.setup = [
  /* ===================== Phase 0 — Prepare the Playing Area ================ */
  { ph: 0, exp: "base", t: "Lay out the Arkham board", src: "Core p.5 (step 1)",
    d: "Unfold the Arkham board in the center of the table with room around the edges for sheets and decks. Place the dice and the token piles nearby and put the terror-track marker on ‘0’." },

  { ph: 0, exp: "dunwich", t: "Add the Dunwich board", when: c => c.has("dunwich"), src: "Dunwich p.4",
    d: "Place the Dunwich board above the Downtown area, lining up the Other Worlds along one edge. Put the Dunwich Horror monster marker and the Dunwich Horror tokens in a pile near it." },
  { ph: 0, exp: "kingsport", t: "Add the Kingsport board & Rift tracks", when: c => c.has("kingsport"), src: "Kingsport p.5",
    d: "Place the Kingsport board above the Downtown area (Other Worlds along one edge). Shuffle the 3 rift markers face down onto the three Rift Tracks, and shuffle the rift-progress markers into a face-down pile nearby. Kingsport has no unstable locations, so it gets no starting Clues." },
  { ph: 0, exp: "innsmouth", t: "Add the Innsmouth board & tracks", when: c => c.has("innsmouth"), src: "Innsmouth p.4",
    d: "Place the Innsmouth board above Downtown with the Deep Ones Rising track on the Other Worlds side. Place the 2 Aquatic markers on the Arkham board’s River Docks and Unvisited Isle, and set the uprising tokens beside the Innsmouth board." },
  { ph: 0, exp: "base", t: "Arrange multiple expansion boards", when: c => c.boardCount >= 2, src: "Innsmouth p.5 · Kingsport p.5",
    d: "With more than one expansion board, place them all above the Arkham board, lining up their Other Worlds / track edges along a single edge. It doesn’t matter which board sits closest to Arkham." },

  { ph: 0, exp: "curse", t: "Place the Ancient Whispers & Patrol markers", when: c => c.has("curse"), src: "Curse p.2",
    d: "Put the Ancient Whispers marker on the Miskatonic University street area and set the Patrol markers beside the board." },

  { ph: 0, exp: "base", t: "Place initial Clue tokens", src: "Core p.5 (step 2)",
    d: "Place one Clue token on every unstable location — those marked with a red diamond — on the Arkham board." },
  { ph: 0, exp: "dunwich", t: "Initial Clues in Dunwich", when: c => c.has("dunwich"), src: "Dunwich p.4",
    d: "Also place a Clue token on each unstable (red-diamond) location in Dunwich." },
  { ph: 0, exp: "innsmouth", t: "Initial Clues in Innsmouth", when: c => c.has("innsmouth"), src: "Innsmouth p.4",
    d: "Also place a Clue token on each unstable (red-diamond) location in Innsmouth." },

  { ph: 0, exp: "miskatonic", t: "Set out the Player Reference sheet", when: c => c.has("miskatonic"), src: "Miskatonic p.3 (step 1)",
    d: "Place the Player Reference sheet for your player count next to the board. It lists the gates-to-awaken number, the monster limit, the Outskirts limit, and how many monsters are drawn when a monster appears — adjusted for how many expansion boards are in play." },

  /* ===================== Phase 1 — Investigators & the Ancient One ========= */
  { ph: 1, exp: "base", t: "Choose the first player", src: "Core p.5 (step 3)",
    d: "Pick a first player at random and give them the First Player marker. It passes left at the end of every turn." },

  { ph: 1, exp: "base", t: "Determine investigators", src: "Core p.5 (step 4)",
    d: "Deal one random investigator sheet to each player (or agree to choose). Each player takes the matching investigator marker." },

  { ph: 1, exp: "innsmouth", t: "Deal Personal Stories", when: c => c.mod("personalStories"), src: "Innsmouth p.10",
    d: "Find the two Personal Story cards for each chosen investigator and give them to that player. Put the first card (story side, with pass/fail conditions) into play now." },

  { ph: 1, exp: "base", t: "Reveal the Ancient One", src: "Core p.5 (step 5)",
    d: "Shuffle the Ancient One sheets and reveal one at random (or choose). Resolve any ‘start of game’ ability now (e.g. Nyarlathotep’s Thousand Masks). Return the unused Ancient One sheets to the box." },

  { ph: 1, exp: "kingyellow", t: "Place the King in Yellow Herald", when: c => c.mod("heraldKiY"), src: "KiY ‘The Herald’ (step 5a)",
    d: "Place the King in Yellow Herald sheet to the LEFT of the Ancient One and put the 10 Yellow Sign tokens in its upper-left corner. (Can be used with any Ancient One.)" },
  { ph: 1, exp: "blackgoat", t: "Place the Black Goat Herald", when: c => c.mod("heraldBlackGoat"), src: "Black Goat ‘The Herald’ (step 5a)",
    d: "Place the Black Goat of the Woods Herald sheet to the LEFT of the Ancient One." },
  { ph: 1, exp: "curse", t: "Place the Dark Pharaoh Herald", when: c => c.mod("heraldPharaoh"), src: "Curse ‘The Herald’ (step 5a)",
    d: "Place the Dark Pharaoh Herald sheet to the LEFT of the Ancient One." },
  { ph: 1, exp: "lurker", t: "Place the Lurker Herald & Power tokens", when: c => c.mod("heraldLurker"), src: "Lurker ‘The Herald’ (step 5a)",
    d: "Place the Lurker at the Threshold Herald sheet to the LEFT of the Ancient One and put the Power tokens beside it." },
  { ph: 1, exp: "miskatonic", t: "Place the Dunwich Horror Herald", when: c => c.mod("heraldDunwich"), src: "Miskatonic p.3 (step 5a)",
    d: "Place the Dunwich Horror Herald sheet to the LEFT of the Ancient One and put 1 Dunwich Horror token on the Dunwich Horror track. (Requires the Dunwich game board.)" },
  { ph: 1, exp: "kingsport", t: "Place a Kingsport Herald", when: c => c.mod("heraldKingsport"), src: "Kingsport p.10",
    d: "Place the chosen Kingsport Herald sheet to the LEFT of the Ancient One and follow its printed setup instructions." },

  { ph: 1, exp: "kingsport", t: "Place the Guardian sheet", when: c => c.guardian, src: "Kingsport p.10 (step 9)",
    d: "Place the chosen Guardian sheet to the RIGHT of the Ancient One. Set out any tokens it names (e.g. Bast tokens). Guardians help the investigators." },
  { ph: 1, exp: "miskatonic", t: "Place the Institution sheet", when: c => c.institution, src: "Miskatonic p.3 (step 5a)",
    d: "Place the chosen Institution sheet to the RIGHT of the Ancient One (or to the right of the Guardian, if one is in play) and set out its tokens (Agent tokens / Expedition markers as appropriate)." },

  { ph: 1, exp: "base", t: "Watch for ‘one of each’ helper sheets", when: c => c.heraldCount > 1 || (c.guardian && c.institution && false), src: "Kingsport p.10 · Miskatonic p.4",
    d: "You can mix Heralds, Guardians and Institutions, but the rules recommend at most ONE of each kind. You currently have more than one Herald selected — double-check that is intended." },

  /* ===================== Phase 2 — Build the Decks ======================== */
  { ph: 2, exp: "base", t: "Separate the card decks", src: "Core p.5 (step 6)",
    d: "Sort the cards into their decks near the board: Common Item, Unique Item, Spell, Skill, Ally, the nine Arkham Location decks, the Gate deck, the Mythos deck, and the special-card decks (Blessing/Curse, Bank Loan, Retainer, Deputy, etc.)." },

  { ph: 2, exp: "dunwich", t: "Build the 11-card Ally deck (Dunwich)", when: c => c.has("dunwich") && !c.has("curse"), src: "Dunwich p.4",
    d: "Shuffle all Allies, deal 11 face up (keep any that are an investigator’s fixed possession), return the rest to the box, then shuffle those 11 face down. All Allies drawn this game come from this 11-card deck." },
  { ph: 2, exp: "curse", t: "Build the 11-card Ally deck (Pharaoh)", when: c => c.has("curse"), src: "Curse p.2",
    d: "Only 11 Allies are used. Set aside any Ally that is a fixed possession, then deal Allies face up to a total of 11, return the rest to the box, let players peek, and shuffle the 11 face down." },
  { ph: 2, exp: "kingsport", t: "Build the 11-card Ally deck (Kingsport)", when: c => c.has("kingsport") && !c.has("curse") && !c.has("dunwich"), src: "Kingsport p.5",
    d: "Shuffle all Allies, deal 11 face up (include any fixed-possession Ally), return the rest, then shuffle the 11 face down." },

  { ph: 2, exp: "curse", t: "Exhibit & Benefit/Detriment decks", when: c => c.has("curse"), src: "Curse p.2 (step 6)",
    d: "Place the 4 Benefit and 4 Detriment cards face up near the Special cards. Shuffle the Exhibit Items into a deck by the Unique Items, and shuffle the Exhibit Encounters into a deck by the Arkham Location decks." },

  { ph: 2, exp: "kingyellow", t: "King in Yellow decks (Touring)", when: c => c.has("kingyellow") && c.mod("kiyTouring"), src: "KiY ‘Touring Performance’ (step 6)",
    d: "Shuffle the new Spells / Common Items / Unique Items separately and place each on TOP of its base deck. Do the same for the new Mythos, Gate and Location cards (new cards on top). Place the Magical Effect cards by the Special cards." },
  { ph: 2, exp: "kingyellow", t: "King in Yellow decks (Permanent)", when: c => c.has("kingyellow") && !c.mod("kiyTouring"), src: "KiY ‘Permanent Performance’ (step 6)",
    d: "Shuffle the new Spells, Items, Mythos, Gate and Location cards INTO their respective decks. Place the Magical Effect cards by the Special cards." },
  { ph: 2, exp: "kingyellow", t: "Set up the Act deck", when: c => c.has("kingyellow") && !c.has("miskatonic"), src: "KiY (step 6c)",
    d: "Stack the 3 Act cards face down in numerical order (Act I on top, Act III on bottom) next to the Mythos deck. Each ‘The Next Act Begins!’ Mythos card flips the next Act into play; Act III destroys Arkham. (To play without this pressure, remove the six ‘The Next Act Begins!’ Mythos cards.)" },
  { ph: 2, exp: "miskatonic", t: "Set up the Act deck (Miskatonic version)", when: c => c.has("kingyellow") && c.has("miskatonic"), src: "Miskatonic p.3 (step 6)",
    d: "Use Miskatonic Horror’s 4 Act cards in place of King in Yellow’s. Stack them face down top-to-bottom: Overture, Act I, Act II, Act III. Flip the Overture face up beside the deck — it starts in play. (Keep the ‘The Next Act Begins!’ Mythos cards in the deck.)" },
  { ph: 2, exp: "kingyellow", t: "Prepare Blights & riot monsters (KiY Herald)", when: c => c.mod("heraldKiY"), src: "KiY ‘The Herald’ (step 6a)",
    d: "Shuffle the Blight deck face down by the Investigator decks and set the 3 riot monster markers beside it. With Miskatonic Horror, also shuffle in only the Blight cards whose expansion icons are in play (and only if at least one expansion board is used)." },

  { ph: 2, exp: "blackgoat", t: "Corruption, Cult & Cult Encounter decks", when: c => c.has("blackgoat"), src: "Black Goat p.2 (step 6)",
    d: "Stack the 16 green Corruption cards on top of the 16 red to form one Corruption deck near the Special cards. Place the 8 ‘One of the Thousand’ Cult Membership cards near the Special cards, and shuffle the Cult Encounter deck near the Arkham Location decks." },

  { ph: 2, exp: "lurker", t: "Relationship deck", when: c => c.mod("lurkerRelationships"), src: "Lurker p.2 (step 6)",
    d: "In games with two or more players, shuffle the Relationship cards into a deck near the Investigator cards (they are dealt during Random Possessions)." },
  { ph: 2, exp: "lurker", t: "Dark Pact & Reckoning decks (Lurker Herald)", when: c => c.mod("heraldLurker"), src: "Lurker ‘The Herald’ (step 6a)",
    d: "Separate the Dark Pact cards into Blood Pacts, Soul Pacts and Bound Allies (3 decks) by the Herald sheet, and shuffle the Reckoning deck next to the Mythos deck." },

  { ph: 2, exp: "miskatonic", t: "Integrate Miskatonic cross-expansion cards", when: c => c.has("miskatonic"), src: "Miskatonic p.2 (Integrating)",
    d: "Shuffle in only the Miskatonic cards whose expansion icons match the expansions in play; return the rest to the box. This includes the new Mythos, Gate, Skill and the Dunwich/Kingsport/Innsmouth Location cards, plus per-expansion add-ons (Injuries/Madness, Cult Encounters, Innsmouth Look, Relationships, Visions/Blessings, Epic Battle, Reckoning) for the modules you are using." },

  { ph: 2, exp: "kingsport", t: "Set out Epic Battle cards", when: c => c.mod("epicBattle"), src: "Kingsport p.11",
    d: "Shuffle the 8 green Epic Battle cards into a deck, then the 8 red, and place the green deck on top of the red. Find the 3 Ancient One Plot cards for this Ancient One, shuffle them, and set them aside. Place the Epic Battle cards near the Ancient One sheet. (Not used with Azathoth.) With Miskatonic Horror, shuffle in its new Battle Event / Battle Condition Epic Battle cards." },
  { ph: 2, exp: "blackgoat", t: "Choose a Difficulty card", when: c => c.mod("difficulty"), src: "Black Goat ‘Difficulty Variants’",
    d: "Choose one of the 5 Difficulty Level cards (two easier, two harder, one normal) and keep it in view for the whole game." },

  /* ===================== Phase 3 — Equip the Investigators ================ */
  { ph: 3, exp: "base", t: "Receive fixed possessions", src: "Core p.5 (step 7)",
    d: "Starting with the first player and going clockwise, each player takes the cards listed in their investigator’s ‘Fixed Possessions’ area." },

  { ph: 3, exp: "base", t: "Shuffle the investigator decks", src: "Core p.5 (step 8)",
    d: "Shuffle the Common Item, Unique Item, Spell and Skill decks and return them face down to their places." },

  { ph: 3, exp: "base", t: "Receive random possessions", src: "Core p.5 (step 9)",
    d: "Clockwise from the first player, each player draws the random possessions listed on their sheet (e.g. ‘2 Common Items, 1 Spell’) from the tops of the appropriate decks. Card-draw abilities (like Monterey Jack’s) do apply now." },
  { ph: 3, exp: "lurker", t: "Deal Relationship cards", when: c => c.mod("lurkerRelationships"), src: "Lurker p.2 (step 9)",
    d: "With 3+ players, as each player finishes their random possessions they also draw a Relationship card and place it between themselves and the player on their left. In a 2-player game, only the first player draws one (placed between the two players)." },

  { ph: 3, exp: "base", t: "Finish investigator setup (Sanity, Stamina, sliders)", src: "Core p.5 (step 10)",
    d: "Each player takes Sanity and Stamina tokens equal to their investigator’s values, and places a skill slider on each of the three skill tracks. During setup only, sliders may start on ANY stop (the focus limit is ignored for the initial placement)." },

  /* ===================== Phase 4 — Monsters, Gates & First Mythos ========= */
  { ph: 4, exp: "base", t: "Create the monster cup", src: "Core p.5 (step 11)",
    d: "Put the monster markers in an opaque cup and randomize them. Remove the five ‘Mask’ monsters UNLESS Nyarlathotep is the Ancient One (or a sheet tells you otherwise). Spawn monsters are never put in the cup — they enter play by special rules." },
  { ph: 4, exp: "blackgoat", t: "Build the hexagon cup (Black Goat Herald)", when: c => c.mod("heraldBlackGoat"), src: "Black Goat ‘The Herald’ (step 11a)",
    d: "Set aside all hexagon-dimension monsters as a second cup — the ‘hexagon cup’ — used by the Black Goat Herald." },
  { ph: 4, exp: "curse", t: "Add the Dark Pharaoh monster (Pharaoh Herald)", when: c => c.mod("heraldPharaoh"), src: "Curse ‘The Herald’ (step 11a)",
    d: "Place the Dark Pharaoh monster token in the cup, even if Nyarlathotep is not the Ancient One." },

  { ph: 4, exp: "lurker", t: "Replace the Gate markers (Lurker)", when: c => c.mod("lurkerGates"), src: "Lurker p.2 (Replace the Gate Markers)",
    d: "Return ALL base / Dunwich / Kingsport Gate markers to the box and use the Lurker Gate markers instead. Leave out the 3 markers connecting to Another Time / Lost Carcosa if Dunwich is not in play, and the 3 connecting to Unknown Kadath / Underworld if Kingsport is not in play. Shuffle the rest face down." },

  { ph: 4, exp: "base", t: "Shuffle Gate & Mythos decks and the Gate markers", src: "Core p.5 (step 12)",
    d: "Shuffle the Gate and Mythos decks and return them to the board. Shuffle the Gate markers (16 in the base game, more with expansions) into a face-down stack." },

  { ph: 4, exp: "base", t: "Place investigator markers on home locations", src: "Core p.5 (step 13)",
    d: "Each player places their investigator marker on the location named in their sheet’s ‘Home’ area. Remove all unused investigator sheets/markers and unused Ancient One sheets from play." },

  { ph: 4, exp: "base", t: "Draw & resolve the first Mythos card", src: "Core p.5 (step 14)",
    d: "The first player draws the top Mythos card and resolves it as a Mythos Phase: a gate and monster appear at the indicated unstable location, a clue may appear, and monsters move. If a Rumor is drawn, discard it and draw again until you get a non-Rumor." },
  { ph: 4, exp: "dunwich", t: "First Mythos with 5+ players", when: c => (c.has("dunwich") || c.has("kingsport")) && c.p >= 5, src: "Dunwich p.4 · Kingsport p.5 (step 14)",
    d: "With five or more players, place TWO monsters on the gate indicated by the first Mythos card instead of one." },
  { ph: 4, exp: "base", t: "Place the first doom token", src: "Core p.5 (step 14)",
    d: "Remember: after the first gate opens, place a doom token on the Ancient One’s doom track. The game has begun — the first turn starts with the first player." }
];

/* ---- Player-count reference: monster limit & Outskirts (Core p.18) -------- */
AH.playerRef = {
  src: "Core Rulebook p.18 · Miskatonic Player Reference sheets",
  monsterLimit: p => p + 3,          // monsters allowed in Arkham at once
  outskirtsLimit: p => Math.max(0, 8 - p),  // max monsters in the Outskirts
  notes: [
    "<b>Monster limit</b> = players + 3 (monsters moving in Arkham / the Sky). Reaching it sends new monsters to the Outskirts.",
    "<b>Outskirts limit</b> = 8 − players. When the Outskirts overflow, they empty and the terror level rises by 1.",
    "If the <b>terror level reaches 10</b>, Arkham is overrun: the monster limit is removed and the Outskirts are no longer used.",
    "The <b>number of open gates that awakens the Ancient One</b> depends on player count (and how many expansion boards are in play). It is printed on the Ancient One sheet and the Miskatonic Player Reference sheet — confirm it for your game.",
    "Monsters on an <b>expansion board</b> (Dunwich / Kingsport / Innsmouth) do not count against the monster limit and never go to the Outskirts."
  ]
};

/* ---- Board / Location reference — the special mechanics each board adds.
   Arkham locations have no fixed actions (you draw encounter cards), so this
   reference covers the boards, their tracks, and the rules that govern them.   */
AH.boards = [
  { id: "arkham", name: "Arkham (base board)", when: () => true, items: [
    "<b>Locations & streets.</b> Circular illustrations are locations; rectangular boxes are the nine neighbourhood street areas. Unstable locations (red diamond) are where gates and monsters appear.",
    "<b>The Sky</b> is a holding street area connected to every Arkham street; flying monsters there count against the monster limit.",
    "<b>The Outskirts</b> hold overflow monsters; when full they empty and raise the terror level.",
    "<b>Gates</b> open at unstable locations, drawing any investigator there into the matching Other World (and delaying them). Close a gate by returning from its Other World and passing the check; <b>seal</b> it (spend 5 Clue tokens or an Elder Sign) so no gate can reopen there."
  ]},
  { id: "otherworlds", name: "Other Worlds", when: () => true, items: [
    "Reached by being drawn through a gate. An investigator spends (normally) two encounters in an Other World, then returns to the gate’s location to attempt to close it.",
    "Closing a gate returns all monsters of that gate’s dimension symbol to the cup and lets you claim it as a Gate trophy."
  ]},
  { id: "dunwich", name: "Dunwich board", when: c => c.has("dunwich"), items: [
    "<b>Travel between towns:</b> at the Train Station (Arkham) or a depot (train icon) elsewhere, spend $1 and 1 movement point to move to any other town’s station/depot.",
    "<b>‘In Arkham’</b> on cards also applies to Dunwich locations and streets. Dunwich streets are adjacent to the Sky.",
    "<b>Monster limit:</b> monsters in Dunwich don’t count against it and never go to the Outskirts — their numbers are controlled by the <b>vortices</b>.",
    "<b>The Dunwich Horror:</b> a special monster tracked on the Dunwich Horror track; it can be fought with the Dunwich Horror cards.",
    "<b>Tasks & Missions</b> (Common/Unique Item cards) send you to a list of locations in order for a payoff."
  ]},
  { id: "kingsport", name: "Kingsport board", when: c => c.has("kingsport"), items: [
    "Connected to Arkham by train (depot with a train icon); travel costs $1 and 1 movement point.",
    "Kingsport has <b>no unstable locations</b>, so no starting Clues and no gates open here normally.",
    "<b>Rifts:</b> three Rift Tracks. When a Mythos card’s monster-movement pattern matches a Rift Track, draw a rift-progress marker onto that track. Rifts can spill monsters and other effects — see the rift markers.",
    "<b>Aquatic markers</b> sit on the Arkham River Docks and Unvisited Isle (shared with Innsmouth’s aquatic rules)."
  ]},
  { id: "innsmouth", name: "Innsmouth board", when: c => c.has("innsmouth"), items: [
    "Connected to Arkham by train; <b>Devil Reef</b> and <b>Y’ha-nthlei</b> are reachable only by special means (e.g. renting a boat at Falcon Point).",
    "<b>Deep Ones Rising track:</b> add an uprising token whenever a gate is prevented from opening, or when a monster enters an Innsmouth <b>vortex</b> (also +1 terror, monster returned to cup). If it ever fills, the Ancient One awakens.",
    "<b>Feds Raid Innsmouth track:</b> spend Clue tokens (matching the Factory District colour) to fill it; filling all 6 spaces empties BOTH tracks.",
    "<b>Aquatic movement</b> (orange-bordered monsters) moves between aquatic locations (wave icon, incl. Arkham’s River Docks & Unvisited Isle).",
    "<b>The Innsmouth Look:</b> drawn from the Innsmouth Look deck; too many can turn an investigator into a Deep One."
  ]}
];

/* ---- HOW TO PLAY — concise rules reference (Core + modules in play) ------- */
/* Items: plain string (always) OR { t, when?, tag?, src? }.                   */
AH.howToPlay = {
  core: [
    { h: "The Game Turn", items: [
      "Each turn has five phases, resolved by every player in clockwise order from the first player: <b>I Upkeep</b> · <b>II Movement</b> · <b>III Arkham Encounters</b> · <b>IV Other World Encounters</b> · <b>V Mythos</b>. The First Player marker then passes left.",
      "<b>I Upkeep:</b> refresh exhausted cards, perform card upkeep actions (Retainer, Bank Loan, Bless/Curse rolls — no roll the first turn you gain them), then adjust skill sliders up to your Focus.",
      "<b>II Movement:</b> in Arkham, spend movement points (= Speed) along yellow lines; in an Other World, move to the next area or return to Arkham.",
      "<b>III & IV Encounters:</b> in an Arkham location, draw that location’s encounter; in an Other World, resolve a Gate-card encounter for the world you are in.",
      "<b>V Mythos:</b> the first player draws one Mythos card — a gate & monster open at an unstable location, a clue may appear, monsters move, and the card’s event resolves."
    ]},
    { h: "Gates, Closing & Sealing", items: [
      "When a gate opens on you, you are drawn to the matching Other World and <b>delayed</b>. After exploring, return to the gate’s location and make the listed Lore or Fight check to <b>close</b> it (take a Gate trophy).",
      "<b>Seal</b> a closed gate by spending <b>5 Clue tokens</b> (or using an Elder Sign) — a sealed location can never open a gate again.",
      { t: "<b>Gate Bursts</b> (red gate location on a Mythos card): if the location is sealed with an Elder Sign, the seal bursts — the token is removed and a gate/monster appear, but NO doom token is added and it is not a monster surge. All flying monsters also move.", when: c => c.has("blackgoat") || c.has("lurker") || c.has("miskatonic"), tag: c => c.has("miskatonic") ? "miskatonic" : c.has("lurker") ? "lurker" : "blackgoat" }
    ]},
    { h: "Monsters, the Limit & the Outskirts", items: [
      "<b>Monster limit</b> = players + 3. A new monster over the limit goes to the <b>Outskirts</b> instead.",
      "<b>Outskirts limit</b> = 8 − players. When the Outskirts overflow, return those monsters to the cup and raise the terror level by 1.",
      "Raising the <b>terror level</b> closes shops and drives away Allies; at terror 10 Arkham is overrun (no monster limit, Outskirts unused).",
      { t: "<b>Monster surge:</b> when a Mythos card opens a gate at a location that already has an open gate, a monster appears at every open-gate location instead. Several expansion cards key off surges.", when: c => c.has("dunwich") || c.boardCount >= 1, tag: "dunwich" },
      { t: "Monsters on an <b>expansion board</b> never count against the monster limit and never go to the Outskirts.", when: c => c.boardCount >= 1, tag: "dunwich" }
    ]},
    { h: "Winning & Losing", items: [
      "<b>Investigators win</b> by sealing enough gates (the number on the Ancient One sheet), by closing every gate while at least one is sealed, or by defeating the Ancient One in the final battle.",
      "<b>They lose</b> if the doom track fills (the Ancient One awakens) and it then defeats them, or via certain ‘instant loss’ effects.",
      { t: "If the Ancient One awakens, the <b>Epic Battle</b> variant replaces the standard final battle with a deck of Epic Battle cards and Ancient One Plot cards (not with Azathoth).", when: c => c.mod("epicBattle"), tag: "kingsport" }
    ]}
  ],

  /* Module-specific play (gated by the active module / expansion). */
  modules: [
    { id: "personalStories", when: c => c.mod("personalStories"), h: "Personal Stories", tag: "innsmouth", items: [
      "Each investigator’s first Personal Story card acts like a private Rumor with a pass and a fail condition.",
      "When either condition is met, discard it and put the second card into play (pass or fail side up); its effect then lasts the rest of the game."
    ]},
    { id: "innsmouthLook", when: c => c.has("innsmouth"), h: "The Innsmouth Look & Deep Ones", tag: "innsmouth", items: [
      "Certain Innsmouth encounters give the <b>Innsmouth Look</b>; accumulating enough can transform an investigator into a Deep One (removed from play).",
      "Prevent the Deep Ones Rising track from filling by feeding the <b>Feds Raid Innsmouth</b> track with Clue tokens — filling it empties both tracks."
    ]},
    { id: "corruption", when: c => c.has("blackgoat"), h: "Cults & Corruption", tag: "blackgoat", items: [
      "An investigator with a <b>‘One of the Thousand’ Cult Membership</b> draws from the Cult Encounter deck at the Black Cave, the Unvisited Isle and the Woods instead of the normal location deck.",
      "<b>Corruption cards</b> trigger when a matching dimension symbol + background colour appears on the Mythos card (resolved after monster movement). Discarding a matching-dimension Corruption happens when its gate is closed; the Corruption deck is never reshuffled — if you must draw and it is empty, the Ancient One awakens."
    ]},
    { id: "exhibit", when: c => c.has("curse"), h: "Ancient Whispers, Patrols & Exhibits", tag: "curse", items: [
      "An investigator who is in the <b>Ancient Whispers</b> street area during the Arkham Encounters Phase has an <b>Exhibit Encounter</b> (shuffle, draw, resolve, then move the marker as the card says). Only one Exhibit Encounter happens per turn.",
      "If the marker didn’t move that phase, it moves in the Mythos Phase like a monster with the moon symbol.",
      "<b>Patrol markers:</b> leaving or ending movement in a patrolled street area requires a Sneak (+0) check or you are arrested. All Patrol markers are removed whenever the terror level rises.",
      "<b>Benefit / Detriment cards</b> are unique — only one investigator may hold each at a time."
    ]},
    { id: "kiy", when: c => c.has("kingyellow"), h: "The Act Deck", tag: c => c.has("miskatonic") ? "miskatonic" : "kingyellow", items: [
      "Each ‘The Next Act Begins!’ Mythos card advances the Act deck. Acts I and II list a way to stop the next Act; Act III cannot be stopped and, if it enters play, the investigators immediately lose.",
      { t: "With Miskatonic Horror, the Overture card starts in play and the new 4-card Act deck (Overture, Act I, II, III) is used in place of King in Yellow’s.", when: c => c.has("miskatonic"), tag: "miskatonic" }
    ]},
    { id: "lurkerPacts", when: c => c.mod("heraldLurker"), h: "Dark Pacts & Reckonings", tag: "lurker", items: [
      "Dark Pacts (Blood Pact, Soul Pact, Bound Ally) grant power via <b>Power tokens</b> but expose you to the <b>Reckoning</b> deck.",
      "Knocked-out or insane investigators keep their Dark Pacts and Power tokens; a <b>devoured</b> investigator loses them all.",
      "If no Power tokens are available, effects that would grant them are ignored."
    ]},
    { id: "lurkerGatesPlay", when: c => c.mod("lurkerGates"), h: "Attribute Gate Markers", tag: "lurker", items: [
      "Each Lurker Gate marker adds an attribute: <b>Devouring</b> (devours an investigator it opens on), <b>Gate of Doom</b> (+1 doom), <b>Endless</b> (reshuffled, never a trophy), <b>Monstrous / Blood / Madness</b> (penalty on a failed close), <b>Moving</b> (moves like a monster on its symbol), and <b>Split</b> (two Other Worlds).",
      "A gate may only be <b>sealed</b> on an unstable location; a gate that ends up in a street or stable location can be closed but not sealed."
    ]},
    { id: "relationships", when: c => c.mod("lurkerRelationships"), h: "Relationships", tag: "lurker", items: [
      "Each player benefits from their own Relationship card and the one held by the player to their right (3+ players).",
      "A Relationship is lost only if its investigator or that investigator’s partner is devoured; new ones are not drawn for replacement investigators."
    ]},
    { id: "institutions", when: c => c.institution, h: "Institutions", tag: "miskatonic", items: [
      "Institutions help investigators in exchange for resources gathered during the game; follow the chosen Institution sheet.",
      "You may combine Heralds, Guardians and Institutions, but generally use at most one of each."
    ]},
    { id: "dunwichHorror", when: c => c.mod("heraldDunwich"), h: "The Dunwich Horror (Herald)", tag: "miskatonic", items: [
      "The Dunwich Horror track starts with 1 token and gains another at terror 3, 6 and 9.",
      "The Horror has both circle and moon dimension symbols for movement only; when it moves it adds a doom token on a 2–6 (not 4–6).",
      "If Yog-Sothoth awakens while the Horror is on the board, his combat modifier and doom total increase sharply."
    ]}
  ]
};

/* ---- Contextual FAQ — official rulings surfaced for the active setup ------ */
/* Concise paraphrases of the Complete Arkham Horror FAQ & Errata. when:(c)=>bool */
AH.faq = [
  { q: "How many Clue tokens does it cost to seal a gate?",
    a: "Five Clue tokens, spent after you close the gate (or use an Elder Sign token, which seals for free). Some Heralds/Blights change this cost." },
  { q: "Do monsters on the expansion boards count against the monster limit?",
    a: "No. Monsters on the Dunwich, Kingsport or Innsmouth boards never count against the Arkham monster limit and never go to the Outskirts.",
    when: c => c.boardCount >= 1 },
  { q: "Can the ‘Mask’ monsters ever be in the cup without Nyarlathotep?",
    a: "Only if a sheet tells you to. The Dark Pharaoh Herald, for example, adds the Dark Pharaoh monster regardless of the Ancient One.",
    when: c => c.mod("heraldPharaoh") },
  { q: "We’re using several Heralds/Guardians/Institutions — is that legal?",
    a: "It’s allowed, but the rules recommend at most one of each kind. More than one Herald in particular can make the game brutally hard.",
    when: c => c.heraldCount > 1 || (c.guardian && c.institution) },
  { q: "Do the new Act cards from Miskatonic Horror remove the ‘The Next Act Begins!’ Mythos cards?",
    a: "No. When you use Miskatonic Horror’s Act deck (Overture–Act III), keep the ‘The Next Act Begins!’ Mythos cards in the Mythos deck.",
    when: c => c.has("kingyellow") && c.has("miskatonic") },
  { q: "With the original (non-revised) Curse of the Dark Pharaoh and Miskatonic Horror, what do we use?",
    a: "Miskatonic Horror is built for the REVISED Curse. With the original edition, use only the new Exhibit Item cards and box the rest of the Pharaoh-icon Miskatonic cards.",
    when: c => c.has("curse") && c.has("miskatonic") },
  { q: "Does an investigator drawn through a gate during an encounter also get delayed?",
    a: "Yes — being drawn through a gate that appears from an encounter (‘A gate appears!’) delays you just like a Mythos-Phase gate." },
  { q: "What happens if we must draw a Corruption card but the deck is empty?",
    a: "The Ancient One immediately awakens. The Corruption deck is never reshuffled.",
    when: c => c.has("blackgoat") },
  { q: "Can a Moving or Split gate end up somewhere it can’t be sealed?",
    a: "Yes. A gate may only be sealed on an unstable location; gates in streets or stable locations can be closed but not sealed.",
    when: c => c.mod("lurkerGates") }
];
