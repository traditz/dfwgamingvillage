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
    description: "A King in Yellow play style for EXPERIENCED players. New Spells/Items/Mythos/Gate/Location cards are placed on TOP of their decks (not shuffled in), and Location decks are not shuffled between encounters — so the strange events of the play come up first and fast (KiY p.2, ‘Touring Performance’)." },
  { id: "kiyPermanent", name: "Permanent Performance", type: "style", requires: "kingyellow", excludes: ["kiyTouring"],
    summary: "KiY play style: the new cards are shuffled in, making the play a normal part of Arkham life.",
    description: "A King in Yellow play style: all the new cards are shuffled into their respective decks, so KiY content is spread evenly through the game (KiY p.2, ‘Permanent Performance’). The Act deck is still used." },

  /* --- Heralds (placed LEFT of the Ancient One; make the game harder) --- */
  { id: "heraldKiY", name: "Herald: The King in Yellow", type: "herald", requires: "kingyellow",
    summary: "Each terror rise costs a Yellow Sign token — on the doom track, or on the terror track where it brings a Blight into play.",
    description: "When the terror level rises, players add a Yellow Sign token to the doom track or the terror track; a token on the terror track triggers a Blight card. Uses the KiY Herald sheet, 10 Yellow Sign tokens, the Blight deck and the 3 riot monster markers (KiY p.2 ‘The Herald’ variant)." },
  { id: "heraldBlackGoat", name: "Herald: The Black Goat of the Woods", type: "herald", requires: "blackgoat",
    summary: "A second ‘hexagon’ monster cup floods every gate with extra monsters and feeds Corruption.",
    description: "Set aside the hexagon-symbol monsters as a second cup. Each gate spawns an extra hexagon monster; defeating one draws a Corruption card; monster surges add doom. Uses the Black Goat Herald sheet (Black Goat p.2 ‘The Herald’ variant)." },
  { id: "heraldPharaoh", name: "Herald: The Dark Pharaoh", type: "herald", requires: "curse",
    summary: "Unique Items cost Sanity, Exhibit Items can Curse you, and Mask monsters grow tougher.",
    description: "Gaining a Unique Item costs 1 Sanity; an Exhibit Item may Curse you; Cursed investigators lose Stamina each Upkeep; Mask monsters gain toughness and add doom when defeated. The Dark Pharaoh monster token enters the cup even without Nyarlathotep (Curse p.2 ‘The Herald’ variant)." },
  { id: "heraldLurker", name: "Herald: The Lurker at the Threshold", type: "herald", requires: "lurker",
    summary: "Unlocks Dark Pacts (Blood/Soul Pact, Bound Ally), Power tokens and the cruel Reckoning deck.",
    description: "Investigators may strike Dark Pacts with the Lurker for power — but Reckoning cards punish them. Uses the Lurker Herald sheet, the three Dark Pact decks, the Reckoning deck and Power tokens (Lurker p.1–2 ‘The Herald’ variant)." },
  { id: "heraldDunwich", name: "Herald: The Dunwich Horror", type: "herald", requiresAll: ["dunwich", "miskatonic"],
    summary: "The Dunwich Horror track starts with a token and fills faster as terror rises; the Horror adds doom more often when it moves.",
    description: "The Dunwich Horror track starts the game with 1 token and gains 1 more when the terror level reaches 3, 6 and 9 (on top of the usual vortex tokens), so the Horror appears sooner — and when it moves it adds a doom token on a 2–6 instead of 4–6. Requires the Dunwich game board. Uses the Dunwich Horror Herald sheet from Miskatonic Horror (Miskatonic p.4 ‘Dunwich Horror Herald’ variant)." },
  { id: "heraldGhroth", name: "Herald: Ghroth", type: "herald", requires: "kingsport",
    summary: "Kingsport Herald — his ‘Mystic’ ability triggers when a Mythos card is drawn. Follow the printed sheet.",
    description: "Ghroth, the Harbinger, prepares the way for the Ancient One. Place his Herald sheet to the LEFT of the Ancient One; the sheet indicates any other cards or tokens needed. His ‘Mystic’ ability is triggered by drawing a Mythos card and is resolved before any part of that card — but only when the card is being resolved in full (FAQ). Follow the printed sheet for his effects (Kingsport ‘Herald/Guardian’ variant, p.10; FAQ p.10)." },
  { id: "heraldTulzscha", name: "Herald: Tulzscha", type: "herald", requires: "kingsport",
    summary: "Kingsport Herald — adds a Cultist to the opening gate; its Elusive Cultists go after elder signs.",
    description: "Tulzscha, a pillar of green flame at Azathoth’s court, prepares the way for the Ancient One. Place the Herald sheet to the LEFT of the Ancient One and put 1 extra Cultist (any monster treated as a Cultist, drawn at random) on the first open gate. Its Cultists become Elusive and move toward elder-sign tokens; what they do there is on the printed sheet. Follow the printed sheet (Kingsport ‘Herald/Guardian’ variant, p.10; FAQ p.31–32)." },
  { id: "heraldDagon", name: "Herald: Father Dagon", type: "herald", requires: "innsmouth",
    summary: "An Innsmouth Herald — his sheet calls for an additional Mythos card (redraw Rumors, per FAQ). Follow the printed sheet.",
    description: "Father Dagon, who rules the Deep Ones alongside Mother Hydra, prepares the way for the Ancient One. Place his Herald sheet to the LEFT of the Ancient One; the sheet indicates any other cards or tokens needed. If the additional Mythos card his sheet calls for is a Rumor, discard it and draw again until it isn’t (FAQ). The Innsmouth rules have you select ONE Herald. Follow the printed sheet for his effects (Innsmouth ‘Herald’ variant, p.9–10; FAQ p.39)." },
  { id: "heraldHydra", name: "Herald: Mother Hydra", type: "herald", requires: "innsmouth",
    summary: "An Innsmouth Herald that makes the game harder. Follow the printed sheet.",
    description: "Mother Hydra, who rules the Deep Ones alongside Father Dagon, prepares the way for the Ancient One. Place her Herald sheet to the LEFT of the Ancient One; the sheet indicates any other cards or tokens needed. The Innsmouth rules have you select ONE Herald. Follow the printed sheet for her effects (Innsmouth ‘Herald’ variant, p.9–10)." },

  /* --- Guardians (placed RIGHT of the Ancient One; help the investigators) --- */
  { id: "guardianNodens", name: "Guardian: Nodens", type: "guardian", requires: "kingsport", excludes: ["guardianHypnos", "guardianBast"],
    summary: "Aids Blessed investigators through the Blessings of Nodens deck (Miskatonic Horror adds more cards to it).",
    description: "Nodens opposes the Ancient One and rewards Blessed investigators. Place the Guardian sheet to the right of the Ancient One and use the Blessings of Nodens deck, which gives Blessed investigators an additional benefit. With Miskatonic Horror, shuffle its new Blessings of Nodens cards into that deck (Kingsport p.3, p.10; Miskatonic p.3)." },
  { id: "guardianHypnos", name: "Guardian: Hypnos", type: "guardian", requires: "kingsport", excludes: ["guardianNodens", "guardianBast"],
    summary: "Speeds up Clue tokens and helpful encounters through the Visions of Hypnos deck (Miskatonic Horror adds more cards).",
    description: "Hypnos, through the Visions of Hypnos deck, increases the rate at which Clue tokens appear and the odds of helpful encounters. Place to the right of the Ancient One. With Miskatonic Horror, shuffle in only its new Visions of Hypnos cards whose expansion icons are in play (Kingsport p.3, p.10; Miskatonic p.3)." },
  { id: "guardianBast", name: "Guardian: Bast", type: "guardian", requires: "kingsport", excludes: ["guardianNodens", "guardianHypnos"],
    summary: "Tracks Bast’s favor with Bast tokens and the ‘Beloved of Bast’ cards.",
    description: "Bast aids investigators who earn her favor. Uses the 8 Bast tokens and the ‘Beloved of Bast’ cards. Place the Guardian sheet to the right of the Ancient One (Kingsport p.3–4, p.10)." },

  /* --- Institutions (Miskatonic; placed RIGHT of the AO / Guardian) --- */
  { id: "instMisk", name: "Institution: Miskatonic University", type: "institution", requires: "miskatonic",
    summary: "Education via Miskatonic Student cards and fast travel via Expedition markers.",
    description: "Investigators may pursue an education (Miskatonic Student → Alumnus), and the 3 Expedition markers — University specialists relocated to Dunwich, Kingsport or Innsmouth — let investigators travel between cities quickly and access the University’s rare books. Place the Institution sheet to the right of the Ancient One / Guardian (Miskatonic p.1–2, p.4 ‘Institution’ variant)." },
  { id: "instBureau", name: "Institution: Bureau of Investigations", type: "institution", requires: "miskatonic",
    summary: "Agent tokens watch street areas to keep monsters from roaming free.",
    description: "Uses the 38 Agent tokens, placed in street areas to suppress monsters. Place the Institution sheet to the right of the Ancient One / Guardian (Miskatonic p.2, p.4 ‘Institution’ variant)." },
  { id: "instOrgCrime", name: "Institution: Organized Crime", type: "institution", requires: "miskatonic",
    summary: "The third Miskatonic Institution sheet — help in exchange for resources. Follow the printed sheet.",
    description: "Like every Institution, it provides valuable help to investigators, often in exchange for resources paid to it; its specific rules are on the printed sheet. Place the Institution sheet to the right of the Ancient One / Guardian and follow its printed rules (Miskatonic p.2, p.4 ‘Institution’ variant)." },

  /* --- Other selectable variants --- */
  { id: "personalStories", name: "Personal Stories", type: "variant", requires: "innsmouth",
    summary: "Each investigator gets a two-card personal arc with its own pass/fail condition.",
    description: "After investigators are chosen, give each their two Personal Story cards and put the first in play. Meeting its pass or fail condition flips it to the second card for the rest of the game (Innsmouth p.10 ‘Personal Story’ variant). Can be used without the Innsmouth board (Innsmouth p.2)." },
  { id: "epicBattle", name: "Epic Battle", type: "variant", requires: "kingsport",
    summary: "A more dramatic final battle when the Ancient One awakens (Epic Battle + Ancient One Plot cards).",
    description: "Shuffle the green Epic Battle deck on top of the red; set aside the three Ancient One Plot cards for the revealed Ancient One. Used only if the Ancient One awakens — not with Azathoth. Place the Epic Battle cards near the Ancient One sheet (Kingsport ‘Epic Battle’ variant, p.11)." },
  { id: "difficulty", name: "Difficulty Level card", type: "variant", requires: "blackgoat",
    summary: "Choose one of five Difficulty cards to make the game easier or harder. Works in any game.",
    description: "At the start of the game choose one of the five Difficulty Level cards (two easier, two harder, one normal). This variant can be used with any game of Arkham Horror (Black Goat p.2 ‘Difficulty Level Variants’)." },
  { id: "lurkerGates", name: "Lurker attribute Gate markers", type: "variant", requires: "lurker",
    summary: "Replace all Gate markers with the Lurker’s, each with an extra attribute (Devouring, Endless, Split…).",
    description: "The Lurker Gate markers replace ALL base/Dunwich/Kingsport Gate markers and add attributes such as Devouring, Gate of Doom, Endless, Monstrous, Moving and Split Gates. This is a selective variant — you may leave them out and still use the rest of Lurker (Lurker p.1–2 ‘Gate Markers’ / ‘Selective Variants’)." },
  { id: "lurkerRelationships", name: "Lurker Relationships", type: "variant", requires: "lurker", minPlayers: 2,
    summary: "Two-or-more-player games: each player gets a Relationship card with the player to their left (2 players: only one card).",
    description: "A selective Lurker variant for 2+ players. Each player draws a Relationship card describing the bond with their left-hand neighbour (in a 2-player game only the first player draws one); it is kept until either investigator is devoured or retires (Lurker p.1–2 ‘Relationship Cards’; FAQ p.40)." }
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
  { ph: 0, exp: "kingsport", t: "Add the Kingsport board & Rift tracks", when: c => c.has("kingsport"), src: "Kingsport p.5–6",
    d: "Place the Kingsport board above the Downtown area (Other Worlds along one edge). Shuffle the 3 rift markers face down onto the three Rift Tracks, and shuffle the rift-progress markers into a face-down pile nearby. Place the 2 Aquatic markers on the Arkham board’s River Docks and Unvisited Isle. Kingsport has no unstable locations, so it gets no starting Clues. (The first Mythos card in step 14 can already add a rift-progress marker if its movement pattern matches a Rift Track.)" },
  { ph: 0, exp: "innsmouth", t: "Add the Innsmouth board & tracks", when: c => c.has("innsmouth"), src: "Innsmouth p.4",
    d: "Place the Innsmouth board above Downtown with the Deep Ones Rising track on the Other Worlds side. Place the 2 Aquatic markers on the Arkham board’s River Docks and Unvisited Isle, and set the uprising tokens beside the Innsmouth board." },
  { ph: 0, exp: "faq", t: "Arrange multiple expansion boards", when: c => c.boardCount >= 2, src: "Kingsport p.6 · Innsmouth p.6 · FAQ p.24",
    d: "With more than one expansion board, place them all above the Arkham board, lining up their Other Worlds / track edges along a single edge. It doesn’t matter which board sits closest to Arkham." },
  { ph: 0, exp: "faq", t: "Reduce the effective player count (multiple boards)", when: c => c.boardCount >= 2, src: "Kingsport p.6 · Innsmouth p.6 · FAQ p.24, p.29, p.36",
    d: "For each expansion board beyond the first, count the number of players as <b>one less</b> (never below one) — but <b>only</b> for the monster limit, the Outskirts limit, the gates-to-awaken number, and how many monsters are drawn when a gate opens. It does <b>not</b> apply to card effects (such as Rumors), to the successes needed against the Ancient One, or to the gate trophies needed to win by closing all gates. The Reference Table below shows your effective player count." },
  { ph: 0, exp: "innsmouth", t: "Extra gate to awaken (Dunwich + Innsmouth)", when: c => c.has("dunwich") && c.has("innsmouth"), src: "Innsmouth p.6 · FAQ p.25",
    d: "When the Dunwich and Innsmouth boards are used together, increase the number of open gates required to awaken the Ancient One by one." },

  { ph: 0, exp: "curse", t: "Place the Ancient Whispers & Patrol markers", when: c => c.has("curse"), src: "Curse p.1",
    d: "Put the Ancient Whispers marker on the Miskatonic University street area and set the Patrol markers beside the board." },

  { ph: 0, exp: "base", t: "Place initial Clue tokens", src: "Core p.5 (step 2)",
    d: "Place one Clue token on every unstable location — those marked with a red diamond — on the Arkham board." },
  { ph: 0, exp: "dunwich", t: "Initial Clues in Dunwich", when: c => c.has("dunwich"), src: "Dunwich p.4",
    d: "Also place a Clue token on each unstable (red-diamond) location in Dunwich." },
  { ph: 0, exp: "innsmouth", t: "Initial Clues in Innsmouth", when: c => c.has("innsmouth"), src: "Innsmouth p.5",
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

  { ph: 1, exp: "kingyellow", t: "Place the King in Yellow Herald", when: c => c.mod("heraldKiY"), src: "KiY p.2 (‘The Herald’, step 5a) · p.1",
    d: "Place the King in Yellow Herald sheet to the LEFT of the Ancient One and put the 10 Yellow Sign tokens in its upper-left corner. (Can be used with any Ancient One.)" },
  { ph: 1, exp: "blackgoat", t: "Place the Black Goat Herald", when: c => c.mod("heraldBlackGoat"), src: "Black Goat p.2 (‘The Herald’, step 5a)",
    d: "Place the Black Goat of the Woods Herald sheet to the LEFT of the Ancient One." },
  { ph: 1, exp: "curse", t: "Place the Dark Pharaoh Herald", when: c => c.mod("heraldPharaoh"), src: "Curse p.2 (‘The Herald’, step 5a)",
    d: "Place the Dark Pharaoh Herald sheet to the LEFT of the Ancient One." },
  { ph: 1, exp: "lurker", t: "Place the Lurker Herald & Power tokens", when: c => c.mod("heraldLurker"), src: "Lurker p.2 (‘The Herald’, step 5a)",
    d: "Place the Lurker at the Threshold Herald sheet to the LEFT of the Ancient One and put the Power tokens beside it." },
  { ph: 1, exp: "miskatonic", t: "Place the Dunwich Horror Herald", when: c => c.mod("heraldDunwich"), src: "Miskatonic p.4 (step 5a)",
    d: "Place the Dunwich Horror Herald sheet to the LEFT of the Ancient One and put 1 Dunwich Horror token on the Dunwich Horror track. (Requires the Dunwich game board.)" },
  { ph: 1, exp: "kingsport", t: "Place the Kingsport Herald (Ghroth / Tulzscha)", when: c => c.mod("heraldGhroth") || c.mod("heraldTulzscha"), src: "Kingsport p.10 · FAQ p.32",
    d: "Place the chosen Kingsport Herald sheet — Ghroth or Tulzscha — to the LEFT of the Ancient One; the sheet indicates any other cards or tokens it needs. Tulzscha puts 1 extra Cultist (any monster treated as a Cultist, drawn at random) on the first open gate. Follow the printed sheet." },
  { ph: 1, exp: "innsmouth", t: "Place the Innsmouth Herald (Father Dagon / Mother Hydra)", when: c => c.mod("heraldDagon") || c.mod("heraldHydra"), src: "Innsmouth p.9–10 · FAQ p.39",
    d: "Place the chosen Innsmouth Herald sheet — Father Dagon or Mother Hydra (the Innsmouth rules have you select ONE Herald) — to the LEFT of the Ancient One; the sheet indicates any other cards or tokens it needs. With Father Dagon, if the additional Mythos card his sheet calls for is a Rumor, discard it and draw again. Follow the printed sheet." },

  { ph: 1, exp: "kingsport", t: "Place the Guardian sheet", when: c => c.guardian, src: "Kingsport p.6 (diagram 9) · p.10",
    d: "Place the chosen Guardian sheet to the RIGHT of the Ancient One. Set out any cards or tokens it names (e.g. the Blessings of Nodens or Visions of Hypnos deck, or the Bast tokens). Guardians help the investigators." },
  { ph: 1, exp: "miskatonic", t: "Place the Institution sheet", when: c => c.institution, src: "Miskatonic p.4 (step 5a)",
    d: "Place the chosen Institution sheet to the RIGHT of the Ancient One (or to the right of the Guardian, if one is in play) and set out its tokens (Agent tokens / Expedition markers as appropriate)." },

  { ph: 1, exp: "kingsport", t: "Watch for ‘one of each’ helper sheets", when: c => c.heraldCount > 1, src: "Kingsport p.10 · Innsmouth p.9 · Miskatonic p.4",
    d: "You can mix Heralds, Guardians and Institutions, but the rules recommend at most ONE of each type — including at most one Herald (Innsmouth Horror: select one Herald). You have more than one Herald selected, so double-check that is intended." },

  /* ===================== Phase 2 — Build the Decks ======================== */
  { ph: 2, exp: "base", t: "Separate the card decks", src: "Core p.5 (step 6)",
    d: "Sort the cards into their decks near the board: Common Item, Unique Item, Spell, Skill, Ally, the nine Arkham Location decks, the Gate deck, the Mythos deck, and the special-card decks (Blessing/Curse, Bank Loan, Retainer, Deputy, etc.)." },

  { ph: 2, exp: "dunwich", t: "Dunwich decks & condition cards", when: c => c.has("dunwich"), src: "Dunwich p.3–4 · FAQ p.24",
    d: "Place the Dunwich Location decks near the Dunwich board and the Dunwich Horror cards in a deck beside it. Shuffle the Injury and Madness decks and place them facedown next to the board (FAQ), and lay the Condition cards facedown in a row near the other Investigator cards. Sheldon Gang Membership and Rail Pass cards go with the Special cards. (New Common/Unique/Spell/Skill cards are shuffled into their base decks.)" },
  { ph: 2, exp: "kingsport", t: "Kingsport location & special decks", when: c => c.has("kingsport"), src: "Kingsport p.5–6",
    d: "Place the four Kingsport Location decks near the Kingsport board, and put the new Captain of the White Ship and Changed cards with the Special cards. (New Arkham-neighborhood Location, Mythos and Gate cards are shuffled into their base decks, and the new gate markers mixed in.)" },
  { ph: 2, exp: "innsmouth", t: "Innsmouth location & Look decks", when: c => c.has("innsmouth"), src: "Innsmouth p.4–5",
    d: "Place the three Innsmouth Location decks near the Innsmouth board, and shuffle the Innsmouth Look cards into a deck beside it. (New Arkham-neighborhood Location, Mythos and Gate cards are shuffled into their base decks, and the new gate markers mixed in.)" },

  { ph: 2, exp: "dunwich", t: "Build the 11-card Ally deck (Dunwich)", when: c => c.has("dunwich") && !c.has("curse"), src: "Dunwich p.4",
    d: "Shuffle all Allies, deal 11 face up (keep any that are an investigator’s fixed possession), return the rest to the box, then shuffle those 11 face down. All Allies drawn this game come from this 11-card deck." },
  { ph: 2, exp: "curse", t: "Build the 11-card Ally deck (Pharaoh)", when: c => c.has("curse"), src: "Curse p.2",
    d: "Only 11 Allies are used. Set aside any Ally that is a fixed possession, then deal Allies face up to a total of 11, return the rest to the box, let players peek, and shuffle the 11 face down." },
  { ph: 2, exp: "kingsport", t: "Build the 11-card Ally deck (Kingsport)", when: c => c.has("kingsport") && !c.has("curse") && !c.has("dunwich"), src: "Kingsport p.5",
    d: "Shuffle all Allies, deal 11 face up (include any fixed-possession Ally), return the rest, then shuffle the 11 face down." },

  { ph: 2, exp: "curse", t: "Exhibit & Benefit/Detriment decks", when: c => c.has("curse"), src: "Curse p.1 (step 6)",
    d: "Place the 4 Benefit and 4 Detriment cards face up near the Special cards. Shuffle the Exhibit Items into a deck by the Unique Items, and shuffle the Exhibit Encounters into a deck by the Arkham Location decks." },

  { ph: 2, exp: "kingyellow", t: "King in Yellow decks (Touring)", when: c => c.has("kingyellow") && c.mod("kiyTouring"), src: "KiY p.2 (‘Touring Performance’, step 6)",
    d: "Shuffle the new Spells / Common Items / Unique Items separately and place each on TOP of its base deck. Do the same for the new Mythos, Gate and Location cards (new cards on top). Place the Magical Effect cards by the Special cards." },
  { ph: 2, exp: "kingyellow", t: "King in Yellow decks (Permanent)", when: c => c.has("kingyellow") && !c.mod("kiyTouring"), src: "KiY p.2 (‘Permanent Performance’, step 6)",
    d: "Shuffle the new Spells, Items, Mythos, Gate and Location cards INTO their respective decks. Place the Magical Effect cards by the Special cards." },
  { ph: 2, exp: "kingyellow", t: "Set up the Act deck", when: c => c.has("kingyellow") && !c.has("miskatonic"), src: "KiY p.2 (step 6c) · p.1",
    d: "Stack the 3 Act cards face down in numerical order (Act I on top, Act III on bottom) next to the Mythos deck. Each ‘The Next Act Begins!’ Mythos card flips the next Act into play; Act III destroys Arkham. (To play without this pressure, remove the six ‘The Next Act Begins!’ Mythos cards.)" },
  { ph: 2, exp: "miskatonic", t: "Set up the Act deck (Miskatonic version)", when: c => c.has("kingyellow") && c.has("miskatonic"), src: "Miskatonic p.3 (step 6)",
    d: "Use Miskatonic Horror’s 4 Act cards in place of King in Yellow’s. Stack them face down top-to-bottom: Overture, Act I, Act II, Act III. Flip the Overture face up beside the deck — it starts in play. (Keep the ‘The Next Act Begins!’ Mythos cards in the deck.)" },
  { ph: 2, exp: "kingyellow", t: "Prepare Blights & riot monsters (KiY Herald)", when: c => c.mod("heraldKiY"), src: "KiY p.2 (‘The Herald’, step 6a) · Miskatonic p.1, p.3",
    d: "Shuffle the Blight deck face down by the Investigator decks and set the 3 riot monster markers beside it. With Miskatonic Horror, also shuffle in only the Blight cards whose expansion icons are in play (and only if at least one expansion board is used)." },

  { ph: 2, exp: "blackgoat", t: "Corruption, Cult & Cult Encounter decks", when: c => c.has("blackgoat"), src: "Black Goat p.1 (step 6) · FAQ p.34",
    d: "Shuffle the 16 green and the 16 red Corruption cards into two separate stacks, then place the green stack on top of the red to form one Corruption deck near the Special cards. Place the 8 ‘One of the Thousand’ Cult Membership cards near the Special cards, and shuffle the Cult Encounter deck near the Arkham Location decks." },

  { ph: 2, exp: "lurker", t: "Relationship deck", when: c => c.mod("lurkerRelationships"), src: "Lurker p.1 (step 6)",
    d: "In games with two or more players, shuffle the Relationship cards into a deck near the Investigator cards (they are dealt during Random Possessions)." },
  { ph: 2, exp: "lurker", t: "Dark Pact & Reckoning decks (Lurker Herald)", when: c => c.mod("heraldLurker"), src: "Lurker p.2 (‘The Herald’, step 6a)",
    d: "Separate the Dark Pact cards into Blood Pacts, Soul Pacts and Bound Allies (3 decks) by the Herald sheet, and shuffle the Reckoning deck next to the Mythos deck." },

  { ph: 2, exp: "miskatonic", t: "Integrate Miskatonic cross-expansion cards", when: c => c.has("miskatonic"), src: "Miskatonic p.3 (Integrating)",
    d: "Shuffle all the new Mythos cards into the Mythos deck. Of the new Skill, Gate and Dunwich/Kingsport/Innsmouth Location cards, shuffle in only those whose expansion icons match the expansions in play; return the rest to the box. Shuffle the per-expansion add-ons (Exhibit, Injury/Madness & Dunwich Horror, Cult Encounter, Innsmouth Look, Relationship, Visions/Blessings, Epic Battle, Reckoning cards) into their decks only if you are using that expansion or module; otherwise box them." },

  { ph: 2, exp: "kingsport", t: "Set out Epic Battle cards", when: c => c.mod("epicBattle"), src: "Kingsport p.11 · p.6 · Miskatonic p.3",
    d: "Shuffle the 8 green Epic Battle cards into a deck, then the 8 red, and place the green deck on top of the red. Find the 3 Ancient One Plot cards for this Ancient One, shuffle them, and set them aside. Place the Epic Battle cards near the Ancient One sheet. (Not used with Azathoth.) With Miskatonic Horror, shuffle in its new Battle Event / Battle Condition Epic Battle cards." },
  { ph: 2, exp: "blackgoat", t: "Choose a Difficulty card", when: c => c.mod("difficulty"), src: "Black Goat p.2 (‘Difficulty Level Variants’)",
    d: "Choose one of the 5 Difficulty Level cards (two easier, two harder, one normal) and keep it in view for the whole game." },

  /* ===================== Phase 3 — Equip the Investigators ================ */
  { ph: 3, exp: "base", t: "Receive fixed possessions", src: "Core p.5 (step 7)",
    d: "Starting with the first player and going clockwise, each player takes the cards listed in their investigator’s ‘Fixed Possessions’ area." },

  { ph: 3, exp: "base", t: "Shuffle the investigator decks", src: "Core p.5 (step 8)",
    d: "Shuffle the Common Item, Unique Item, Spell and Skill decks and return them face down to their places." },

  { ph: 3, exp: "base", t: "Receive random possessions", src: "Core p.5 (step 9)",
    d: "Clockwise from the first player, each player draws the random possessions listed on their sheet (e.g. ‘2 Common Items, 1 Spell’) from the tops of the appropriate decks. Card-draw abilities (like Monterey Jack’s) do apply now." },
  { ph: 3, exp: "lurker", t: "Deal Relationship cards", when: c => c.mod("lurkerRelationships"), src: "Lurker p.1 (step 9) · p.2",
    d: "With 3+ players, as each player finishes their random possessions they also draw a Relationship card and place it between themselves and the player on their left. In a 2-player game, only the first player draws one (placed between the two players)." },

  { ph: 3, exp: "base", t: "Finish investigator setup (Sanity, Stamina, sliders)", src: "Core p.5 (step 10)",
    d: "Each player takes Sanity and Stamina tokens equal to their investigator’s values, and places a skill slider on each of the three skill tracks. During setup only, sliders may start on ANY stop (the focus limit is ignored for the initial placement)." },

  /* ===================== Phase 4 — Monsters, Gates & First Mythos ========= */
  { ph: 4, exp: "base", t: "Create the monster cup", src: "Core p.5 (step 11) · Dunwich p.4, p.7",
    d: "Put the monster markers in an opaque cup and randomize them. Remove the ‘Mask’ monsters (five in the base game) UNLESS Nyarlathotep is the Ancient One (or a sheet tells you otherwise). Expansion Spawn monsters (red circle on the movement side) are also kept out of the cup unless an Ancient One sheet says otherwise — they enter play by special rules." },
  { ph: 4, exp: "blackgoat", t: "Build the hexagon cup (Black Goat Herald)", when: c => c.mod("heraldBlackGoat"), src: "Black Goat p.2 (‘The Herald’, step 11a)",
    d: "Set aside all hexagon-dimension monsters as a second cup — the ‘hexagon cup’ — used by the Black Goat Herald." },
  { ph: 4, exp: "curse", t: "Add the Dark Pharaoh monster (Pharaoh Herald)", when: c => c.mod("heraldPharaoh"), src: "Curse p.2 (‘The Herald’, step 11a)",
    d: "Place the Dark Pharaoh monster token in the cup, even if Nyarlathotep is not the Ancient One." },

  { ph: 4, exp: "lurker", t: "Replace the Gate markers (Lurker)", when: c => c.mod("lurkerGates"), src: "Lurker p.1 (Replace the Gate Markers) · p.2",
    d: "Return ALL base / Dunwich / Kingsport Gate markers to the box and use the Lurker Gate markers instead. Leave out the 3 markers connecting to Another Time / Lost Carcosa if Dunwich is not in play, and the 3 connecting to Unknown Kadath / Underworld if Kingsport is not in play. Shuffle the rest face down." },

  { ph: 4, exp: "base", t: "Shuffle Gate & Mythos decks and the Gate markers", src: "Core p.5 (step 12)",
    d: "Shuffle the Gate and Mythos decks and return them to the board. Shuffle the Gate markers (16 in the base game, more with expansions) into a face-down stack." },

  { ph: 4, exp: "base", t: "Place investigator markers on home locations", src: "Core p.5 (step 13)",
    d: "Each player places their investigator marker on the location named in their sheet’s ‘Home’ area. Remove all unused investigator sheets/markers and unused Ancient One sheets from play." },

  { ph: 4, exp: "base", t: "Draw & resolve the first Mythos card", src: "Core p.5 (step 14) · FAQ p.2",
    d: "The first player draws the top Mythos card and resolves it as a Mythos Phase: a gate and monster appear at the indicated unstable location, a clue may appear, and monsters move. If a Rumor — or any Mythos card with no gate — is drawn, discard it and draw again until a gate-opening card comes up." },
  { ph: 4, exp: "base", t: "First Mythos with 5+ investigators", when: c => AH.playerRef.effectivePlayers(c.p, c.boardCount) >= 5, src: "Core p.5 (step 14) · p.10 · FAQ p.24",
    d: "With five or more investigators, place TWO monsters on the gate from the first Mythos card instead of one. (This is a core rule — 2 monsters appear every time a gate opens at 5+ investigators. With several expansion boards, use the reduced player count for this.)" },
  { ph: 4, exp: "base", t: "Place the first doom token", src: "Core p.5 (step 14)",
    d: "Remember: after the first gate opens, place a doom token on the Ancient One’s doom track. The game has begun — the first turn starts with the first player." }
];

/* ---- Player-count reference: monster limit & Outskirts (Core p.18) -------- */
AH.playerRef = {
  src: "Core Rulebook p.18, p.20, p.24 · Miskatonic p.2 (Player Reference sheets) · FAQ p.3, p.24",
  monsterLimit: p => p + 3,                 // monsters allowed in Arkham at once
  outskirtsLimit: p => Math.max(0, 8 - p),  // max monsters in the Outskirts
  gatesToAwaken: p => p <= 2 ? 8 : p <= 4 ? 7 : p <= 6 ? 6 : 5,  // open gates that awaken the Ancient One
  // Effective player count for in-game effects: −1 per expansion board beyond the first.
  effectivePlayers: (p, boards) => Math.max(1, p - Math.max(0, boards - 1)),
  notes: [
    "<b>Monster limit</b> = players + 3 (monsters moving in Arkham / the Sky). Reaching it sends new monsters to the Outskirts.",
    "<b>Outskirts limit</b> = 8 − players. When the Outskirts hold more than this, they empty and the terror level rises by 1.",
    "<b>Gates to awaken</b> the Ancient One: 8 at 1–2 players, 7 at 3–4, 6 at 5–6, 5 at 7–8 (also the ‘Too Many Gates’ table on the rulebook’s back page). It also awakens if the doom track fills, the gate markers or monster cup run out, or the terror level is 10 with monsters equal to twice the monster limit.",
    "<b>Multiple boards:</b> for each expansion board beyond the first, treat the player count as one lower for all of the above and for how many monsters appear when a gate opens — but not for card effects, successes against the Ancient One, or the gate trophies needed to win.",
    "<b>Dunwich + Innsmouth together:</b> add 1 to the gates-to-awaken number.",
    "If the <b>terror level reaches 10</b>, Arkham is overrun: the monster limit is removed and all monsters in the Outskirts return to the cup.",
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
    "<b>The Dunwich Horror:</b> when 3 Dunwich Horror tokens are on its track, it appears at <b>Sentinel Hill</b>. Fighting it draws from the Dunwich Horror deck for its abilities each combat; defeating it removes the tokens and lets you search a Common/Unique/Skill/Spell/Ally deck for any 1 card to keep.",
    "<b>Tasks & Missions</b> (Common/Unique Item cards) send you to a list of locations in order for a payoff."
  ]},
  { id: "kingsport", name: "Kingsport board", when: c => c.has("kingsport"), items: [
    "Connected to Arkham by train (depot with a train icon); travel costs $1 and 1 movement point.",
    "Kingsport has <b>no unstable locations</b>, so no starting Clues and no gates open here normally.",
    "<b>Rifts:</b> each Mythos card whose monster-movement pattern matches a Rift Track adds a rift-progress marker to it. When all <b>4</b> spaces fill, the rift OPENS at the gate location shown on that card (even onto an elder sign). An open rift moves like a monster on its dimension symbol, dropping a monster at each new location (subject to the monster limit) — and adds a doom token if it moved along an arrow matching its own symbol’s colour.",
    "<b>Closing a rift:</b> each rift-progress marker shows a Kingsport location. After an encounter there, discard one such marker (if its rift is still closed) or flip one face down (if open). When all 4 of an open rift’s markers are face down, the rift closes and returns to its track.",
    "<b>Aquatic markers</b> sit on the Arkham River Docks and Unvisited Isle (shared with Innsmouth’s aquatic rules)."
  ]},
  { id: "innsmouth", name: "Innsmouth board", when: c => c.has("innsmouth"), items: [
    "Connected to Arkham by train; <b>Devil Reef</b> and <b>Y’ha-nthlei</b> are reachable only by special means (e.g. renting a boat at Falcon Point).",
    "<b>Deep Ones Rising track:</b> add an uprising token whenever a gate is prevented from opening, or when a monster enters an Innsmouth <b>vortex</b> (also +1 terror, monster returned to cup). If it ever fills, the Ancient One awakens.",
    "<b>Feds Raid Innsmouth track:</b> during Upkeep, an investigator in an Innsmouth neighbourhood may spend Clue tokens onto the track spaces <b>matching the colour of the neighbourhood they are in</b>; filling all 6 spaces empties BOTH tracks.",
    "<b>Martial Law:</b> when HALF the Ancient One’s doom track is full, martial law is declared in Innsmouth for the rest of the game — ending your movement on an Innsmouth location or street with an Awareness modifier requires an Evade check at that modifier or you are arrested (sent to the Innsmouth Jail).",
    "<b>Aquatic movement</b> (orange border): when its symbol comes up, an aquatic monster at an aquatic location (wave icon, incl. Arkham’s River Docks & Unvisited Isle) moves to any other aquatic location containing an investigator — otherwise it moves normally.",
    "<b>The Innsmouth Look:</b> when instructed, shuffle the Innsmouth Look deck and draw the listed number of cards — if the ‘Look’ card comes up, follow its instructions (it can transform you into a Deep One). Then return all the cards to the deck."
  ]}
];

/* ---- HOW TO PLAY — concise rules reference (Core + modules in play) ------- */
/* Items: plain string (always) OR { t, when?, tag?, src? }.                   */
AH.howToPlay = {
  core: [
    { h: "The Game Turn", items: [
      "Each turn has five phases, resolved by every player in clockwise order from the first player: <b>I Upkeep</b> · <b>II Movement</b> · <b>III Arkham Encounters</b> · <b>IV Other World Encounters</b> · <b>V Mythos</b>. The First Player marker then passes left.",
      "<b>I Upkeep:</b> refresh exhausted cards, perform card upkeep actions (Retainer, Bank Loan, Bless/Curse rolls — no roll the first turn you gain them), then adjust skill sliders a number of stops up to your Focus.",
      "<b>II Movement:</b> in Arkham, spend movement points (= Speed) along yellow lines; in an Other World, move from the left area to the right, or from the right area back to a matching gate in Arkham. You must evade or fight monsters when you try to leave their area or end your movement in it (even if you don’t move).",
      "<b>III & IV Encounters:</b> in an Arkham location, use its special ability or draw that location’s encounter; if you’re on a gate you’ve Explored, you may try to close it. In an Other World, draw Gate cards until the colour matches and resolve that entry.",
      "<b>V Mythos:</b> the first player draws one Mythos card — a gate & monster open at an unstable location (or a monster surge if it already has a gate), a clue may appear, monsters move, and the card’s event (Headline / Environment / Rumor) resolves."
    ]},

    { h: "Skill Checks", items: [
      "Roll a number of dice equal to the relevant <b>skill ± the modifier</b> on the card/effect. Each <b>5 or 6</b> is a success (<b>Blessed</b>: 4–6; <b>Cursed</b>: 6 only). If the modifier drops you to 0 or fewer dice, the check automatically fails (unless Clue tokens add successes).",
      "The <b>difficulty</b> is the number of successes needed (default 1). Partial successes only matter where a card says so.",
      "After any check (pass or fail) you may spend <b>Clue tokens</b> one at a time — each gives one extra die, and you get the die even if modifiers had dropped you below 0 dice."
    ]},

    { h: "Encounters — Evade & Combat", items: [
      "<b>Evade</b> a monster with a Sneak check modified by its <b>Awareness</b> (upper-right). Pass → you may move on or stay; fail → lose Stamina equal to the icons and begin combat. Multiple monsters are evaded one at a time.",
      "<b>Combat</b> is one <b>Horror check</b> first (Will, modified by the monster’s <b>Horror</b> rating, lower-left; fail → lose Sanity), then each round choose <b>Flee</b> (an Evade check) or <b>Fight</b>.",
      "<b>Fight</b> = a Combat check (Fight, modified by the monster’s <b>Combat</b> rating, lower-right) with difficulty equal to its <b>Toughness</b>. Use weapons/spells up to <b>2 hand icons</b>. Pass → take the monster as a trophy; fail → lose Stamina equal to the icons, then choose Flee/Fight again.",
      "<b>Cast a spell</b> by paying its Sanity cost and making a Lore check at the spell’s casting modifier; on a fail it has no effect but still uses its hands."
    ]},

    { h: "Health, Statuses & Being Devoured", items: [
      "If <b>Sanity or Stamina hits 0</b>: discard half your items, half your Clues (round down), and all Retainers, then restore that track to 1. In Arkham you go to Arkham Asylum (Sanity) or St. Mary’s Hospital (Stamina); in an Other World you are Lost in Time and Space. No encounters that turn.",
      "If <b>both</b> tracks are 0 at once, or either maximum is reduced to 0, the investigator is <b>devoured</b>: discard everything except unspent trophies and draw a new investigator.",
      "<b>Arrested:</b> go to the Police Station’s Jail Cell, lose half your money (round down), and skip your next turn (you just stand up into the main Police Station area).",
      { t: "Arrested in <b>Innsmouth</b>: go to the Innsmouth Jail instead — this delays you even if you are normally immune to being delayed.", when: c => c.has("innsmouth"), tag: "innsmouth" },
      { t: "<b>Lost in Time and Space:</b> you are delayed; next turn you may only stand up, and the turn after you may return to any location or street in Arkham" + " (never the Kingsport Head locations, Devil Reef or Y’ha-nthlei).", when: c => c.has("kingsport") || c.has("innsmouth"), tag: c => c.has("kingsport") ? "kingsport" : "innsmouth" },
      { t: "<b>Lost in Time and Space:</b> you are delayed; next turn you may only stand up, and the turn after you may return to any location or street area in Arkham.", when: c => !c.has("kingsport") && !c.has("innsmouth") },
      "<b>Trading:</b> during the Movement Phase (before, during or after moving — even while delayed), investigators in the same location, street area or Other World area may trade money, Common & Unique Items and Spells (plus the Patrol Wagon, Deputy’s Revolver, Exhibit Items and Rail Passes) — but never during combat, and never Clue tokens, Allies, Skills or trophies. They may also trade in the final battle’s Refresh step.",
      { t: "<b>Injuries & Madness</b> (Dunwich): instead of discarding items, you may draw an <b>Injury</b> card (0 Stamina) or <b>Madness</b> card (0 Sanity) and restore that track to full — you keep your items but still move to the hospital/asylum/Lost. With <b>2+</b> Injury/Madness cards you may retire. (Miskatonic Horror: holding an Injury and its matching Madness — or vice-versa — devours you.)", when: c => c.has("dunwich"), tag: c => c.has("miskatonic") ? "miskatonic" : "dunwich" }
    ]},
    { h: "Gates, Closing & Sealing", items: [
      "When a gate opens on you, you are drawn to the matching Other World and <b>delayed</b>. After exploring, return to the gate’s location and make the listed Lore or Fight check to <b>close</b> it (take a Gate trophy).",
      "<b>Seal</b> a closed gate by spending <b>5 Clue tokens</b> after closing it — place an unused doom token on the location as an elder sign; a sealed location can’t open new gates.",
      "The <b>Elder Sign Unique Item</b> closes AND seals with no roll and no Clues: return the card to the box, take the Gate trophy, move a doom token <b>off the Ancient One’s doom track</b> to serve as the seal, and lose 1 Sanity and 1 Stamina.",
      { t: "<b>Gate Bursts</b> (red gate location on a Mythos card): if the location has an elder sign token (a seal), the seal bursts — the token is removed and a gate/monster appear, but NO doom token is added and bursting the seal is not a monster surge. Whenever a gate burst is drawn, all flying monsters also move.", when: c => ["dunwich", "kingsport", "blackgoat", "innsmouth", "lurker", "miskatonic"].some(c.has), tag: c => ["miskatonic", "lurker", "innsmouth", "blackgoat", "kingsport", "dunwich"].find(c.has) }
    ]},
    { h: "Monsters, the Limit & the Outskirts", items: [
      "<b>Monster limit</b> = players + 3. A new monster over the limit goes to the <b>Outskirts</b> instead.",
      "<b>Outskirts limit</b> = 8 − players. When the Outskirts overflow, return those monsters to the cup and raise the terror level by 1.",
      "<b>Terror level:</b> each point it rises, return one random unclaimed Ally to the box. At <b>3</b> the General Store closes (occupants to Rivertown), at <b>6</b> the Curiositie Shoppe (to Northside), at <b>9</b> Ye Olde Magick Shoppe (to Uptown). At <b>10</b> Arkham is overrun — the monster limit is removed and all monsters in the Outskirts return to the cup. The terror level never goes above 10 (each further rise adds a doom token instead) and never decreases.",
      { t: "With <b>5 or more investigators</b> (after any multi-board reduction), place <b>2 monsters</b> (not 1) each time a gate opens and a monster appears.", when: c => AH.playerRef.effectivePlayers(c.p, c.boardCount) >= 5 },
      { t: "<b>Monster surge:</b> when the Mythos card’s gate location already has an open gate, monsters appear equal to the <b>greater of</b> (open gates, players), divided as evenly as possible among all open gates — no gate may receive more monsters than the surge gate (the location shown on the Mythos card). Overflow goes to the Outskirts." },
      { t: "Monsters on an <b>expansion board</b> never count against the monster limit and never go to the Outskirts.", when: c => c.boardCount >= 1, tag: c => ["dunwich", "kingsport", "innsmouth"].find(c.has) }
    ]},
    { h: "Winning & Losing", items: [
      "<b>Close the Gates:</b> the moment a player closes the <b>last</b> open gate on the board, the investigators win — provided their unspent <b>Gate trophies</b> (including the one just closed) total at least the number of players.",
      "<b>Seal the Gates:</b> the investigators win immediately when there are <b>6 or more Elder Sign tokens</b> on the board.",
      "<b>Banish the Ancient One:</b> if it awakens, the investigators can still win by defeating it in the final battle.",
      "The <b>Ancient One awakens</b> (→ final battle) if: the doom track fills; too many gates are open at once (see the Reference Table); a gate opens with no gate markers left; a monster should appear with none left in the cup; or the <b>terror level is 10 and monsters in play equal twice the monster limit</b>.",
      { t: "With some expansions the Ancient One also awakens if the <b>Deep Ones Rising track</b> fills or a required <b>Corruption</b> card can’t be drawn.", when: c => c.has("innsmouth") || c.has("blackgoat"), tag: c => c.has("innsmouth") ? "innsmouth" : "blackgoat" }
    ]},
    { h: "The Final Battle", items: [
      "When the Ancient One awakens: <b>fill its doom track</b> with doom tokens if not already full, devour every investigator Lost in Time and Space, and discard active Environment/Rumor cards. From now on no one collects money, gains Clues, or rolls for Retainers/Bank Loans.",
      "Each round: <b>1) Refresh</b> — refresh cards, use abilities, adjust sliders (like Upkeep), pass the First Player marker left, and trade equipment freely. <b>2) Investigators attack</b> — each surviving player makes a Combat check against the Ancient One at its combat modifier.",
      "Successes are <b>cumulative across players and rounds</b>: every time the total reaches the <b>number of players (including eliminated ones)</b>, remove one doom token and reset to zero. Remove the last doom token and the investigators win.",
      "<b>3) The Ancient One attacks</b> per its sheet. Anyone reduced to 0 Sanity or Stamina is devoured — eliminated for good, with no replacement investigator. If everyone is devoured, the players lose.",
      { t: "<b>Epic Battle</b> replaces this flow: after each Refresh, draw an Epic Battle card and follow it for the round. ‘Sinister Plot’ cards bring in the Ancient One Plot cards; ‘The End of Everything’ loses the game immediately. (Not used with Azathoth.)", when: c => c.mod("epicBattle"), tag: "kingsport" }
    ]}
  ],

  /* Module-specific play (gated by the active module / expansion). */
  modules: [
    { id: "personalStories", when: c => c.mod("personalStories"), h: "Personal Stories", tag: "innsmouth", items: [
      "Each investigator’s first Personal Story card acts like a private Rumor with a pass and a fail condition.",
      "When either condition is met, discard it and put the second card into play (pass or fail side up); its effect then lasts the rest of the game."
    ]},
    { id: "innsmouthLook", when: c => c.has("innsmouth"), h: "The Innsmouth Look & Deep Ones", tag: "innsmouth", items: [
      "Certain Innsmouth encounters make you draw from the <b>Innsmouth Look</b> deck (shuffle, draw the listed number, then return them). If the ‘Look’ card is drawn you follow its instructions — it can transform you into a Deep One.",
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
      "Each ‘The Next Act Begins!’ Mythos card advances the Act deck. Acts I and II each list a way for the investigators to stop them; Act III cannot be stopped and, if it enters play, the investigators immediately lose.",
      { t: "With Miskatonic Horror, the Overture card starts in play and the new 4-card Act deck (Overture, Act I, II, III) is used in place of King in Yellow’s.", when: c => c.has("miskatonic"), tag: "miskatonic" }
    ]},
    { id: "lurkerPacts", when: c => c.mod("heraldLurker"), h: "Dark Pacts & Reckonings", tag: "lurker", items: [
      "Dark Pacts (Blood Pact, Soul Pact, Bound Ally) grant power via <b>Power tokens</b> but expose you to the <b>Reckoning</b> deck.",
      "Knocked-out or insane investigators keep their Dark Pacts and Power tokens; a <b>devoured</b> investigator loses them all.",
      "If no Power tokens are available, effects that would grant them are ignored."
    ]},
    { id: "lurkerGatesPlay", when: c => c.mod("lurkerGates"), h: "Attribute Gate Markers", tag: "lurker", items: [
      "Each Lurker Gate marker adds an attribute: <b>Devouring</b> (devours an investigator it opens on), <b>Gate of Doom</b> (+1 doom if it opens on an investigator), <b>Endless</b> (reshuffled, never a trophy), <b>Monstrous / Blood / Madness</b> (penalty on a failed close), <b>Moving</b> (moves like a monster on its symbol), and <b>Split</b> (two Other Worlds).",
      "A gate may only be <b>sealed</b> on an unstable location; a gate that ends up in a street or stable location can be closed but not sealed."
    ]},
    { id: "relationships", when: c => c.mod("lurkerRelationships"), h: "Relationships", tag: "lurker", items: [
      "Each player benefits from their own Relationship card and the one held by the player to their right (3+ players).",
      "A Relationship is lost only if its investigator or that investigator’s partner is devoured (or retires — FAQ); new ones are not drawn for replacement investigators."
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
    a: "Five Clue tokens, spent after you close the gate. The Elder Sign Unique Item seals with no roll and no Clues — but you lose 1 Sanity and 1 Stamina, the card is used up, and a doom token is removed from the doom track to form the seal. Some Heralds/Blights change the Clue cost." },
  { q: "Do monsters on the expansion boards count against the monster limit?",
    a: "No. Monsters on the Dunwich, Kingsport or Innsmouth boards never count against the Arkham monster limit and never go to the Outskirts. But the Sky is part of Arkham: a monster that moves from an expansion board into the Sky counts against the limit (and goes to the Outskirts if the limit is already reached).",
    when: c => c.boardCount >= 1 },
  { q: "Can the ‘Mask’ monsters ever be in the cup without Nyarlathotep?",
    a: "Only if a sheet tells you to. The Dark Pharaoh Herald, for example, adds the Dark Pharaoh monster regardless of the Ancient One.",
    when: c => c.mod("heraldPharaoh") },
  { q: "We’re using several Heralds/Guardians/Institutions — is that legal?",
    a: "It’s allowed, but the rules recommend at most one of each kind (Innsmouth Horror says to select one Herald). Stacking several Heralds can make the game brutally hard.",
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

/* ---- TEACHING SCRIPT (read aloud, ~5 min; content per the AH 2nd Edition
   rulebook and expansion rulebooks — see the setup citations above) ---------- */
AH.teach = {
  intro: "Read this aloud — about five minutes. Sliders untouched until the end.",
  sections: [
    { h: "The pitch — and how we win", body: (c) => `
<p>It's 1926, and gates to other worlds are tearing open all over Arkham. Every open gate feeds the <b>doom track</b> of the Ancient One sleeping beneath the town. This is fully cooperative, and there are three ways to win: <b>close every gate</b> on the board while holding enough gate trophies, get <b>six gates sealed</b> at once — the clean win — or, if the doom track fills and the thing <b>awakens</b>… beat it in the final battle${c.mod("epicBattle") ? " (we're using the <b>Epic Battle</b> deck, so that fight has real structure — and real teeth)" : ""}. Plan for the seals. Pray you never need plan C.</p>` },

    { h: "The shape of a turn", body: (c) => `
<p>Five phases, everyone in order: <b>Upkeep</b> — refresh cards and slide your <b>skill sliders</b>, tuning who your investigator is this turn; <b>Movement</b> — walk the streets, or move along your Other World; <b>Arkham Encounters</b> — draw the story card for your location; <b>Other World Encounters</b> — same, on the far side of a gate; and the <b>Mythos phase</b> — the game's turn: a new gate bursts open, a monster spawns, and the headlines change the rules.</p>` },

    { h: "Skill checks — sliders and dice", body: (c) => `
<p>Everything is a <b>skill check</b>: roll dice equal to your skill plus the check's modifier — <b>5s and 6s are successes</b>. Your six skills sit on three <b>sliders</b>, each a trade-off (speed against sneaking, fighting against will…), adjusted a little each Upkeep. <b>Clue tokens</b> are bonus dice — spend one after a roll to add a die — so burn them at the moments that matter, and they matter most at gates.</p>` },

    { h: "Gates — close them, seal them", body: (c) => `
<p>A gate opens; a monster comes with it. Step onto the gate and you're <b>pulled through</b> to its Other World; survive two encounters there, come back, and you may <b>close</b> it with a Fight or Lore check — spend <b>five Clue tokens</b> as you do and it's <b>sealed</b> for good. Monsters must be fought or <b>evaded</b> on the way; trophies from both can be cashed in at certain locations, and gate trophies count toward the win. That's the core loop: gear up in Arkham, dive through a gate, come back, slam it shut.</p>` },

    { h: "Doom, terror & going under", body: (c) => `
<p>Every new gate adds a <b>doom token</b>; the track filling is the loss timer. Monsters flooding the streets raise the <b>terror level</b>, which strips allies and closes shops. Hit zero <b>Sanity or Stamina</b> and you wake up in the Asylum or Hospital, lighter by half your stuff — hit both, or bottom out your maximums, and the investigator is <b>devoured</b>: take a fresh one and keep fighting.</p>` },

    { h: "This table's expansions", when: (c) => c.has("dunwich") || c.has("kingsport") || c.has("innsmouth") || c.has("curse") || c.has("kingyellow") || c.has("blackgoat") || c.has("lurker") || c.has("miskatonic"), body: (c) => {
      const bits = [];
      if (c.has("dunwich")) bits.push("<b>Dunwich</b> hangs a second town off the map — gates out there too, and the Dunwich Horror itself if monsters keep slipping into its vortices");
      if (c.has("kingsport")) bits.push("<b>Kingsport</b> adds a town where <b>rifts</b> creep open unless someone patrols it — an unglamorous, vital job");
      if (c.has("innsmouth")) bits.push("<b>Innsmouth</b> adds a hostile town where the Deep Ones rise and the locals notice you noticing them" + (c.mod("personalStories") ? " — and everyone carries a <b>Personal Story</b>: your own subplot with a reward for finishing it and a price for failing" : ""));
      if (c.has("curse")) bits.push("<b>Curse of the Dark Pharaoh</b> tours a cursed exhibit through town");
      if (c.has("kingyellow")) bits.push("<b>The King in Yellow</b> stages a play that should never be performed" + (c.mod("kiyTouring") ? " (a touring performance — its new cards sit on top of the decks, so the play dominates the early game)" : c.mod("kiyPermanent") ? " (a permanent engagement — it never leaves)" : "") + " — each ‘The Next Act Begins!’ card advances the <b>Act deck</b>, and if the final Act enters play we lose on the spot");
      if (c.has("blackgoat")) bits.push("<b>The Black Goat</b> offers cult membership and charges corruption" + (c.mod("difficulty") ? ", and a <b>Difficulty card</b> is tuning this whole game" : ""));
      if (c.has("lurker")) bits.push("<b>The Lurker at the Threshold</b> " + (c.mod("heraldLurker") ? "deals in Dark Pacts — power now, price later" : "slips new horrors into the decks") + (c.mod("lurkerRelationships") ? ", and <b>Relationship</b> cards tie each of us to the player on our left" : ""));
      if (c.has("miskatonic")) bits.push("<b>Miskatonic Horror</b> threads extra cards through every other box" + (c.institution ? ", and an <b>Institution</b> is open for membership — read its sheet" : ""));
      return `<p>${bits.join("; ")}.${(c.heraldCount || c.guardian) ? " Heralds sharpen the Ancient One; Guardians blunt it — their sheets are in play and I'll read them out." : ""}</p>`;
    }},

    { h: "Don't worry about these yet", body: (c) => {
      const later = ["monster movement symbols", "the shops", "blessing and curse dice"];
      if (c.mod("lurkerGates")) later.push("the Lurker's attribute gate markers");
      if (["dunwich", "kingsport", "blackgoat", "innsmouth", "lurker", "miskatonic"].some(c.has)) later.push("gate bursts (they can blow a seal open)");
      return `<p>I'll explain ${later.join(", ")} when they first matter. Opening advice: <b>clues before heroics</b> — a closed gate can open again, a sealed one normally can’t, so the team that wins is the one that seals, not the one that sightsees. And keep one eye on the terror level.</p>`;
    }}
  ]
};
