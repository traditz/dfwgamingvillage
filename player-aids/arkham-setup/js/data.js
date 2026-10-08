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
    description: "Each time an investigator gains a Unique Item — including starting equipment — they lose 1 Sanity; each time one gains an Exhibit Item, roll a die and on a failure they are Cursed (taking either from another investigator does not count). At the start of each Upkeep, before rolling to remove Curses, each Cursed investigator loses 1 Stamina. All Mask monsters gain 1 toughness, and each time a Mask monster is defeated add 1 doom token to the Ancient One’s doom track. If Nyarlathotep is the Ancient One and awakens, his combat modifier worsens by 1 and he gets 1 extra doom token for each Mask monster on the board. The Dark Pharaoh monster token enters the cup even without Nyarlathotep (Curse p.2 ‘The Herald’ variant; FAQ p.21)." },
  { id: "heraldLurker", name: "Herald: The Lurker at the Threshold", type: "herald", requires: "lurker",
    summary: "Unlocks Dark Pacts (Blood/Soul Pact, Bound Ally), Power tokens and the cruel Reckoning deck.",
    description: "Investigators may strike Dark Pacts with the Lurker for power — but Reckoning cards punish them. Uses the Lurker Herald sheet, the three Dark Pact decks, the Reckoning deck and Power tokens (Lurker p.1–2 ‘The Herald’ variant)." },
  { id: "heraldDunwich", name: "Herald: The Dunwich Horror", type: "herald", requiresAll: ["dunwich", "miskatonic"],
    summary: "The Dunwich Horror track starts with a token and fills faster as terror rises; the Horror adds doom more often when it moves.",
    description: "The Dunwich Horror track starts the game with 1 token and gains 1 more when the terror level reaches 3, 6 and 9 (on top of the usual vortex tokens), so the Horror appears sooner — and when it moves it adds a doom token on a 2–6 instead of 4–6. Requires the Dunwich game board. Uses the Dunwich Horror Herald sheet from Miskatonic Horror (Miskatonic p.4 ‘Dunwich Horror Herald’ variant)." },
  { id: "heraldGhroth", name: "Herald: Ghroth", type: "herald", requires: "kingsport",
    summary: "Kingsport Herald — his ‘Mystic’ ability triggers when a Mythos card is drawn. Follow the printed sheet.",
    description: "Ghroth prepares the way for the Ancient One. Place his Herald sheet to the LEFT of the Ancient One; the sheet indicates any other cards or tokens needed. His ‘Mystic’ ability is triggered by drawing a Mythos card and is resolved before any part of that card — but only when the card is being resolved in full (FAQ). Follow the printed sheet for his effects (Kingsport ‘Herald/Guardian’ variant, p.10; FAQ p.10)." },
  { id: "heraldTulzscha", name: "Herald: Tulzscha", type: "herald", requires: "kingsport",
    summary: "Kingsport Herald — adds a Cultist to the opening gate; its Elusive Cultists go after elder signs.",
    description: "Tulzscha, the Green Flame, prepares the way for the Ancient One. Place the Herald sheet to the LEFT of the Ancient One and put 1 extra Cultist (any monster treated as a Cultist, drawn at random) on the first open gate. Cultists are Elusive, and a Cultist adjacent to an elder sign token moves into that location when it moves (the Sky counts as adjacent to every location); what happens there is on the printed sheet. Follow the printed sheet (Kingsport ‘Herald/Guardian’ variant, p.10; FAQ p.31–32)." },
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
    description: "Hypnos, through the Visions of Hypnos deck, increases the rate at which Clue tokens appear and the odds of helpful encounters. Place to the right of the Ancient One. With Miskatonic Horror, shuffle in only its new Visions of Hypnos cards whose expansion icons are in play (Kingsport p.3, p.10; Miskatonic p.3). All Visions of Hypnos cards in play are discarded at the end of each Mythos Phase (FAQ p.32)." },
  { id: "guardianBast", name: "Guardian: Bast", type: "guardian", requires: "kingsport", excludes: ["guardianNodens", "guardianHypnos"],
    summary: "Tracks Bast’s favor with Bast tokens and the ‘Beloved of Bast’ cards.",
    description: "Bast aids investigators who earn her favor. Uses the 8 Bast tokens and the ‘Beloved of Bast’ cards. Place the Guardian sheet to the right of the Ancient One (Kingsport p.3–4, p.10). You become Beloved of Bast either by discarding a Bast token or simply by having the Foolishness Ally (FAQ p.32)." },

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
  { id: "noRelationships", name: "Play without Relationship cards", type: "variant", requires: "lurker", minPlayers: 2,
    summary: "Lurker’s Selective Variant: leave the Relationship cards in the box.",
    description: "Relationship cards are a standard part of every Lurker game with two or more players (Lurker p.1 setup steps 6 and 9). Lurker’s ‘Selective Variants’ rule lets you choose to play without them; if so, simply leave them in the box (Lurker p.2)." }
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
/*            heraldCount, guardian, institution, institutionCount }           */
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
  { ph: 1, exp: "kingsport", t: "Place the Kingsport Herald (Ghroth / Tulzscha)", when: c => c.mod("heraldGhroth") || c.mod("heraldTulzscha"), src: "Kingsport p.10 · p.4 · FAQ p.32",
    d: "Place the chosen Kingsport Herald sheet — Ghroth or Tulzscha — to the LEFT of the Ancient One; the sheet indicates any other cards or tokens it needs. Tulzscha puts 1 extra Cultist (any monster treated as a Cultist, drawn at random) on the first open gate. If Abhoth is the Ancient One, Tulzscha has nothing to influence (Abhoth removes all Cultists), so the FAQ recommends drawing a different Herald. Follow the printed sheet." },
  { ph: 1, exp: "innsmouth", t: "Place the Innsmouth Herald (Father Dagon / Mother Hydra)", when: c => c.mod("heraldDagon") || c.mod("heraldHydra"), src: "Innsmouth p.9–10 · FAQ p.39",
    d: "Place the chosen Innsmouth Herald sheet — Father Dagon or Mother Hydra (the Innsmouth rules have you select ONE Herald) — to the LEFT of the Ancient One; the sheet indicates any other cards or tokens it needs. With Father Dagon, if the additional Mythos card his sheet calls for is a Rumor, discard it and draw again. Follow the printed sheet." },

  { ph: 1, exp: "kingsport", t: "Place the Guardian sheet", when: c => c.guardian, src: "Kingsport p.6 (diagram 9) · p.10",
    d: "Place the chosen Guardian sheet to the RIGHT of the Ancient One. Set out any cards or tokens it names (e.g. the Blessings of Nodens or Visions of Hypnos deck, or the Bast tokens). Guardians help the investigators." },
  { ph: 1, exp: "miskatonic", t: "Place the Institution sheet", when: c => c.institution, src: "Miskatonic p.4 (step 5a) · p.1–2",
    d: "Place the chosen Institution sheet to the RIGHT of the Ancient One (or to the right of the Guardian, if one is in play), drawn at random or chosen. Set out what it uses: the 38 Agent tokens for the Bureau of Investigations, or the 3 Expedition markers and the 8 Miskatonic Student cards for Miskatonic University. For Organized Crime, follow the printed sheet." },

  { ph: 1, exp: "kingsport", t: "Watch for ‘one of each’ helper sheets", when: c => c.heraldCount > 1 || c.institutionCount > 1, src: "Kingsport p.10 · Innsmouth p.9 · Miskatonic p.4",
    d: "You can mix Heralds, Guardians and Institutions, but the rules recommend at most ONE of each type — including at most one Herald (Innsmouth Horror: select one Herald). You have more than one Herald or more than one Institution selected, so double-check that is intended." },

  /* ===================== Phase 2 — Build the Decks ======================== */
  { ph: 2, exp: "base", t: "Separate the card decks", src: "Core p.4–5 (step 6 & setup diagram)",
    d: "Sort the cards into their decks near the board: Common Item, Unique Item, Spell, Skill, Ally, the nine Arkham Location decks, the Gate deck, the Mythos deck, and the special-card decks (Blessing/Curse, Bank Loan, Retainer, Deputy, etc.)." },

  { ph: 2, exp: "dunwich", t: "Dunwich decks & condition cards", when: c => c.has("dunwich"), src: "Dunwich p.3–4 · FAQ p.24",
    d: "Place the Dunwich Location decks near the Dunwich board and the Dunwich Horror cards in a deck beside it. Shuffle the Injury and Madness decks and place them facedown next to the board (FAQ), and lay the Condition cards facedown in a row near the other Investigator cards. Sheldon Gang Membership and Rail Pass cards go with the Special cards. (New Common Item, Unique Item, Spell, Skill, Arkham Location, Mythos and Gate cards are shuffled into their base decks, and the 4 new gate markers are mixed in with the others unless you are using the Lurker Gate markers.)" },
  { ph: 2, exp: "kingsport", t: "Kingsport location & special decks", when: c => c.has("kingsport"), src: "Kingsport p.5–6 · Lurker p.1",
    d: "Place the four Kingsport Location decks near the Kingsport board, and put the new Captain of the White Ship and Changed cards with the Special cards. (New Arkham-neighborhood Location, Mythos and Gate cards are shuffled into their base decks, and the 4 new gate markers are mixed in with the others unless you are using the Lurker Gate markers.)" },
  { ph: 2, exp: "innsmouth", t: "Innsmouth location & Look decks", when: c => c.has("innsmouth"), src: "Innsmouth p.3–5, p.7",
    d: "Place the three Innsmouth Location decks near the Innsmouth board, and shuffle the Innsmouth Look cards into a deck beside it. (New Arkham-neighborhood Location, Mythos and Gate cards are shuffled into their base decks.)" },

  { ph: 2, exp: "dunwich", t: "Build the 11-card Ally deck (Dunwich)", when: c => c.has("dunwich") && !c.has("curse"), src: "Dunwich p.4 · FAQ p.15–16",
    d: "Only 11 Allies are used. First take out any Ally that is part of an investigator’s fixed possessions. Shuffle the rest and deal face up enough to make 11 in total, counting those fixed Allies. Return the others to the box. Players may look at which Allies will appear. Then turn the 11 face down and shuffle them; all Allies this game, including starting equipment, come from this deck." },
  { ph: 2, exp: "curse", t: "Build the 11-card Ally deck (Pharaoh)", when: c => c.has("curse"), src: "Curse p.2",
    d: "Only 11 Allies are used. Set aside any Ally that is a fixed possession, then deal Allies face up to a total of 11, return the rest to the box, let players peek, and shuffle the 11 face down." },
  { ph: 2, exp: "kingsport", t: "Build the 11-card Ally deck (Kingsport)", when: c => c.has("kingsport") && !c.has("curse") && !c.has("dunwich"), src: "Kingsport p.5 · FAQ p.15–16",
    d: "Only 11 Allies are used. First take out any Ally that is part of an investigator’s fixed possessions. Shuffle the rest and deal face up enough to make 11 in total, counting those fixed Allies. Return the others to the box. Players may look at which Allies will appear. Then turn the 11 face down and shuffle them; all Allies this game, including starting equipment, come from this deck." },

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

  { ph: 2, exp: "lurker", t: "Relationship deck", when: c => c.has("lurker") && c.p >= 2 && !c.mod("noRelationships"), src: "Lurker p.1 (step 6)",
    d: "In games with two or more players, shuffle the Relationship cards into a deck near the Investigator cards (they are dealt during Random Possessions)." },
  { ph: 2, exp: "lurker", t: "Dark Pact & Reckoning decks (Lurker Herald)", when: c => c.mod("heraldLurker"), src: "Lurker p.2 (‘The Herald’, step 6a)",
    d: "Separate the Dark Pact cards into Blood Pacts, Soul Pacts and Bound Allies (3 decks) by the Herald sheet, and shuffle the Reckoning deck next to the Mythos deck." },

  { ph: 2, exp: "miskatonic", t: "Integrate Miskatonic cross-expansion cards", when: c => c.has("miskatonic"), src: "Miskatonic p.3 (Integrating)",
    d: "Shuffle all the new Mythos cards into the Mythos deck. Of the new Skill, Gate and Dunwich/Kingsport/Innsmouth Location cards, shuffle in only those whose expansion icons match the expansions in play; return the rest to the box. Shuffle the per-expansion add-ons (Exhibit, Injury/Madness & Dunwich Horror, Cult Encounter, Innsmouth Look, Relationship, Blessings of Nodens, Epic Battle, Reckoning cards) into their decks only if you are using that expansion or module; otherwise box them. New Visions of Hypnos cards (Hypnos Guardian only) are filtered like the Skill/Gate cards: shuffle in only those whose expansion icons are in play." },

  { ph: 2, exp: "kingsport", t: "Set out Epic Battle cards", when: c => c.mod("epicBattle"), src: "Kingsport p.11 · p.6 · Miskatonic p.3",
    d: "Shuffle the green Epic Battle cards into a deck and the red ones into another (8 of each from Kingsport; with Miskatonic Horror, first add its new green cards to the green deck and its new red cards to the red deck). Place the green deck on top of the red. Find the 3 Ancient One Plot cards for this Ancient One, shuffle them and set them aside. Place the Epic Battle cards near the Ancient One sheet. (Not used with Azathoth.)" },
  { ph: 2, exp: "blackgoat", t: "Choose a Difficulty card", when: c => c.mod("difficulty"), src: "Black Goat p.2 (‘Difficulty Level Variants’)",
    d: "Choose one of the 5 Difficulty Level cards (two easier, two harder, one normal) and keep it in view for the whole game." },

  /* ===================== Phase 3 — Equip the Investigators ================ */
  { ph: 3, exp: "base", t: "Receive fixed possessions", src: "Core p.5 (step 7) · p.21",
    d: "Starting with the first player and going clockwise, each player receives everything listed in their investigator’s ‘Fixed Possessions’ area: money, Clue tokens and any named cards. The first player finds the named cards in the decks and hands them out." },

  { ph: 3, exp: "base", t: "Shuffle the investigator decks", src: "Core p.5 (step 8)",
    d: "Shuffle the Common Item, Unique Item, Spell and Skill decks and return them face down to their places." },

  { ph: 3, exp: "base", t: "Receive random possessions", src: "Core p.5 (step 9)",
    d: "Clockwise from the first player, each player draws the random possessions listed on their sheet (e.g. ‘2 Common Items, 1 Spell’) from the tops of the appropriate decks. Card-draw abilities (like Monterey Jack’s) do apply now." },
  { ph: 3, exp: "lurker", t: "Deal Relationship cards", when: c => c.has("lurker") && c.p >= 2 && !c.mod("noRelationships"), src: "Lurker p.1 (step 9) · p.2",
    d: "With 3+ players, as each player finishes their random possessions they also draw a Relationship card and place it between themselves and the player on their left. In a 2-player game, only the first player draws one (placed between the two players)." },

  { ph: 3, exp: "base", t: "Finish investigator setup (Sanity, Stamina, sliders)", src: "Core p.5 (step 10)",
    d: "Each player takes Sanity and Stamina tokens equal to their investigator’s values, and places a skill slider on each of the three skill tracks. During setup only, sliders may start on ANY stop (the focus limit is ignored for the initial placement)." },
  { ph: 3, exp: "curse", t: "Dark Pharaoh: Sanity for starting Unique Items", when: c => c.mod("heraldPharaoh"), src: "Curse p.2 (‘The Herald’ variant) · FAQ p.21",
    d: "The Dark Pharaoh sheet applies from the start: each investigator loses 1 Sanity for every Unique Item gained as starting equipment (fixed or random possessions). An investigator reduced to 0 Sanity this way goes insane before the first turn. For example, the FAQ rules that Monterey Jack facing Cthulhu starts at Arkham Asylum with 1 Sanity, discarding his Clue token and half his items." },

  /* ===================== Phase 4 — Monsters, Gates & First Mythos ========= */
  { ph: 4, exp: "base", t: "Create the monster cup", src: "Core p.5 (step 11) · Dunwich p.4, p.7",
    d: "Put the monster markers in an opaque cup and randomize them. Remove the ‘Mask’ monsters (five in the base game) UNLESS Nyarlathotep is the Ancient One (or a sheet tells you otherwise). Expansion Spawn monsters (red circle on the movement side) are also kept out of the cup unless an Ancient One sheet says otherwise — they enter play by special rules." },
  { ph: 4, exp: "blackgoat", t: "Build the hexagon cup (Black Goat Herald)", when: c => c.mod("heraldBlackGoat"), src: "Black Goat p.2 (‘The Herald’, step 11a) · FAQ p.35",
    d: "After the Mask monsters have been removed, set aside the hexagon-dimension monsters still in the cup as a second cup, the ‘hexagon cup’. The Bloated Woman (a hexagon Mask monster) goes in only if Nyarlathotep is the Ancient One. From the first gate in step 14 onward, every opening gate also gets 1 monster from the hexagon cup, on top of the normal draw. With five or more investigators (the reduced count when several expansion boards are in play), that means 3 monsters per gate: 2 normal and 1 hexagon." },
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
  src: "Core Rulebook p.18, p.20, p.24 · Dunwich p.5 · Kingsport p.6–7 · Innsmouth p.6 · Miskatonic p.2 (Player Reference sheets) · FAQ p.3, p.24–25",
  monsterLimit: p => p + 3,                 // monsters allowed in Arkham at once
  outskirtsLimit: p => Math.max(0, 8 - p),  // max monsters in the Outskirts
  gatesToAwaken: p => p <= 2 ? 8 : p <= 4 ? 7 : p <= 6 ? 6 : 5,  // open gates that awaken the Ancient One
  // Effective player count for in-game effects: −1 per expansion board beyond the first.
  effectivePlayers: (p, boards) => Math.max(1, p - Math.max(0, boards - 1)),
  notes: [
    "<b>Monster limit</b> = players + 3 (monsters moving in Arkham / the Sky). Reaching it sends new monsters to the Outskirts.",
    "<b>Outskirts limit</b> = 8 − players. When the Outskirts hold more than this, they empty and the terror level rises by 1.",
    "<b>Gates to awaken</b> the Ancient One: 8 at 1–2 players, 7 at 3–4, 6 at 5–6, 5 at 7–8 (also the ‘Too Many Gates’ table on the rulebook’s back page). It also awakens if the doom track fills, a new gate would open with no gate markers left, a monster must be drawn from an empty monster cup, or the terror level is 10 and the monsters in the Sky and Arkham’s neighbourhoods (not on expansion boards) equal twice the normal monster limit.",
    { t: "<b>Multiple boards:</b> for each expansion board beyond the first, count the players as one fewer (never below one) for the monster limit, the Outskirts limit, the gates-to-awaken number and how many monsters appear when a gate opens. Do not reduce it for card effects, successes against the Ancient One, or the gate trophies needed to win. If this would drop you below one, the rules recommend playing with more investigators.", when: c => c.boardCount >= 2 },
    { t: "<b>Dunwich + Innsmouth together:</b> add 1 to the gates-to-awaken number.", when: c => c.has("dunwich") && c.has("innsmouth") },
    "If the <b>terror level reaches 10</b>, Arkham is overrun: the monster limit is removed and all monsters in the Outskirts return to the cup.",
    { t: "Monsters on an <b>expansion board</b> (Dunwich / Kingsport / Innsmouth) do not count against the monster limit and do not go to the Outskirts. A monster that moves from an expansion board to the Sky becomes an Arkham monster: it counts against the limit and goes to the Outskirts if its arrival would exceed it.", when: c => c.boardCount >= 1 }
  ]
};

/* ---- Board / Location reference — the special mechanics each board adds.
   At a location you draw its encounter or use its printed special ability
   (Core p.22), so this reference covers the boards, their tracks, and the
   rules that govern them.                                                     */
AH.boards = [
  { id: "arkham", name: "Arkham (base board)", when: () => true, items: [
    "<b>Locations & streets.</b> Circular illustrations are locations; rectangular boxes are the nine neighbourhood street areas. Unstable locations (red diamond) are where gates and monsters appear.",
    "<b>The Sky</b> is a holding street area connected to every Arkham street; flying monsters there count against the monster limit.",
    "<b>The Outskirts</b> hold monsters that would exceed the monster limit. Up to 8 − players may wait there. When one more arrives than that limit allows, return ALL Outskirts monsters to the cup and raise the terror level by 1. (Core p.18 · FAQ p.12)",
    "<b>Gates</b> open at unstable locations, drawing any investigator there into the matching Other World (and delaying them). Close a gate by returning from its Other World and passing the check; <b>seal</b> it (spend 5 Clue tokens or an Elder Sign) so no gate can reopen there."
  ]},
  { id: "otherworlds", name: "Other Worlds", when: () => true, items: [
    "Reached by being drawn through a gate. You spend (normally) two turns there: left area, then right area. Then you return to ANY location with an open gate to that Other World and take an explored marker, which lets you try to close that gate. If no such gate is open, you are Lost in Time and Space. (Core p.7–8)",
    "Closing a gate returns all monsters of that gate’s dimension symbol to the cup and lets you claim it as a Gate trophy."
  ]},
  { id: "dunwich", name: "Dunwich board", when: c => c.has("dunwich"), items: [
    "<b>Travel between towns:</b> at the Train Station (Arkham) or a depot (train icon) elsewhere, spend $1 and 1 movement point to move to any other town’s station/depot.",
    "<b>‘In Arkham’</b> on cards also applies to Dunwich locations and streets. Dunwich streets are adjacent to the Sky.",
    "<b>Monster limit:</b> monsters in Dunwich don’t count against it and don’t go to the Outskirts. Instead, the <b>vortices</b> control them: investigators can never enter a vortex. A monster that enters one returns to the cup, raises the terror level by 1, and adds a Dunwich Horror token to its track (if fewer than 3 are there). (Dunwich p.5, p.7)",
    "<b>The Dunwich Horror:</b> when the 3rd Dunwich Horror token is placed, it appears in the <b>Sentinel Hill street area</b>. While it is in play, each time it moves there is a chance another doom token is added to the doom track. When you enter combat with it, shuffle the Dunwich Horror deck and draw a card for its abilities and most of its stats for that combat (its toughness is always 5). Defeating it empties the track and sets it aside (it returns if the track fills again), and the victor may search the Common Item, Unique Item, Skill, Spell or Ally deck for any 1 card. (Dunwich p.7–8)",
    "<b>Tasks</b> (Common Items) and <b>Missions</b> (Unique Items) list locations, streets or Other World areas to visit in order. For each one, end your movement there and stay through the Arkham Encounters Phase. For a Task, then put a Clue token (from the supply) on the card. For a Mission, you must still be there in the next turn’s Upkeep and pay the listed sacrifice to place the Clue. When every step has a Clue, take the Payoff / resolve the Effect and return the card to the box. Discarding or trading the card loses its Clues. (Dunwich p.5 · FAQ p.25)"
  ]},
  { id: "kingsport", name: "Kingsport board", when: c => c.has("kingsport"), items: [
    "Connected to Arkham by train (depot with a train icon); travel costs $1 and 1 movement point.",
    "Kingsport has <b>no unstable locations</b>, so no starting Clues and no gates open here normally.",
    "<b>‘In Arkham’</b> on cards also applies to Kingsport locations and streets. Monsters on the Kingsport board don’t count against the monster limit and don’t go to the Outskirts. Kingsport streets are adjacent to the Sky, and lost investigators may return to Kingsport (but not to the Kingsport Head). (Kingsport p.7)",
    "<b>The Kingsport Head</b> (The Causeway, Wireless Station, Strange High House in the Mist): entering The Causeway or Wireless Station ends your movement. You can’t move straight into any Head location by spell, item, the Patrol Wagon or returning from Lost in Time and Space — walk in from the Harborside streets via The Causeway. (Kingsport p.7 · FAQ p.30)",
    "<b>Rifts:</b> each Rift Track has 4 spaces, 2 beside each of two movement patterns. When a resolved Mythos card’s movement pattern matches a pattern beside a CLOSED rift, draw a rift-progress marker and place it face up in one of that pattern’s 2 spaces (if both are full, add nothing). When all 4 spaces are full, the rift OPENS at that card’s gate location, even onto an elder sign. If the card has no gate location, draw Mythos cards until one does and discard the extras. From the next turn, whenever the rift’s dimension symbol moves, the rift moves like a normal black-bordered monster and a monster from the cup is placed at its new location (subject to the monster limit). If the rift symbol’s colour (white/black) matches the background behind that symbol on the Mythos card, also add a doom token, even if the rift cannot move. (Kingsport p.8–9 · FAQ p.31–32)",
    "<b>Closing a rift:</b> each rift-progress marker shows a Kingsport location. Each encounter there (not a location special ability) investigates one such marker: discard it if its rift is still closed, or flip it face down if the rift is open. A closed location can’t be explored. When all 4 of an open rift’s markers are face down, the rift closes, returns to its track and its markers are discarded. (Kingsport p.10 · FAQ p.32)",
    "<b>Aquatic movement</b> (orange border): the 2 Aquatic markers make Arkham’s River Docks and Unvisited Isle aquatic locations (wave icon). When its symbol moves, an aquatic monster that begins in an aquatic location moves straight to another aquatic location with an investigator (if several, to the investigator with the lowest Sneak; the first player breaks ties). If there is none, or it is not in an aquatic location, it moves like a normal black-bordered monster. (Kingsport p.7–8)"
  ]},
  { id: "innsmouth", name: "Innsmouth board", when: c => c.has("innsmouth"), items: [
    "Connected to Arkham by train; <b>Devil Reef</b> and <b>Y’ha-nthlei</b> are reachable only by special means (e.g. renting a boat at Falcon Point).",
    "<b>Deep Ones Rising track:</b> add an uprising token whenever a gate is prevented from opening, or when a monster enters an Innsmouth <b>vortex</b> (also +1 terror, monster returned to cup). If it ever fills, the Ancient One awakens.",
    "<b>Feds Raid Innsmouth track:</b> during Upkeep, an investigator in an Innsmouth neighbourhood may spend Clue tokens onto the track spaces <b>matching the colour of the neighbourhood they are in</b>; filling all 6 spaces empties BOTH tracks.",
    "<b>‘In Arkham’</b> on cards also applies to Innsmouth locations and streets. Monsters on the Innsmouth board don’t count against the monster limit and don’t go to the Outskirts. Innsmouth streets are adjacent to the Sky, and lost investigators may return to Innsmouth (but not to Devil Reef or Y’ha-nthlei). (Innsmouth p.6 · FAQ p.38)",
    "<b>Arrested in Innsmouth:</b> you go to the Innsmouth Jail (not the Police Station), lose half your money (rounded down) and are delayed, even if you are normally immune to being delayed (if the arrest itself is prevented, you aren’t delayed). <b>Sawbone Alley</b> (a street area, not a location): other investigators can move there and follow its instructions to free someone held in the Jail. (Innsmouth p.6 · FAQ p.39)",
    "<b>Martial Law:</b> once at least half the Ancient One’s doom track is full, martial law is declared in Innsmouth for the rest of the game, even if doom later drops. Whenever you end your movement on an Innsmouth location or street showing an Awareness modifier (anything but a dash), make an Evade check at that modifier, before dealing with any monsters there, or be arrested and sent to the Innsmouth Jail. An open gate at the location overrides martial law. (Innsmouth p.6 · FAQ p.39)",
    "<b>Aquatic movement</b> (orange border): when its symbol moves, an aquatic monster that begins in an aquatic location (wave icon, incl. Arkham’s River Docks & Unvisited Isle) moves straight to another aquatic location containing an investigator (if several, to the investigator with the lowest Sneak; the first player breaks ties). Otherwise it moves like a normal black-bordered monster. (Innsmouth p.8)",
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
      "<b>II Movement:</b> in Arkham, spend movement points (= Speed) along yellow lines; ending your move on Clue tokens lets you take them (after dealing with any monsters there). In an Other World, move from the left area to the right, or from the right area back to any location with an open gate to that world (take an explored marker) — with no such gate you are Lost in Time and Space. You must evade or fight each monster when you try to leave its area or end your movement in it (even if you are delayed and don’t move) — except in the turn you return from an Other World, when monsters at that location may be ignored.",
      "<b>III & IV Encounters:</b> in an Arkham location with no gate, use its special ability or draw that neighbourhood’s location card and resolve your location’s entry (street areas have no encounters). In a location with an open gate you are drawn through to the first area of its Other World — unless you have an explored marker there, in which case you may try to close (or seal) it; no special ability while a gate is open. In an Other World, draw Gate cards until the colour matches one of its encounter symbols and resolve that world’s entry (or ‘Other’).",
      "<b>V Mythos:</b> the first player draws one Mythos card and resolves it in order: 1) at the location shown — nothing if it has an elder sign; a monster surge if it already has a gate; otherwise add a doom token to the doom track, open a gate (discard its Clues) and a monster appears; 2) a Clue token appears (not on a gate); 3) monsters with the listed symbols move; 4) the Headline / Environment / Rumor text resolves."
    ]},

    { h: "Skill Checks", items: [
      "Roll a number of dice equal to the relevant <b>skill ± the modifier</b> on the card/effect. Each <b>5 or 6</b> is a success (<b>Blessed</b>: 4–6; <b>Cursed</b>: 6 only — you can never be both: if you’re Blessed and become Cursed, discard the Blessing, and vice versa; you never hold more than one Bless or Curse card). If the modifier drops you to 0 or fewer dice, the check automatically fails (unless Clue tokens add successes).",
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
      "If <b>both</b> tracks are 0 at once, or either maximum is reduced to 0, the investigator is <b>devoured</b>: discard all your cards except unspent trophies, then draw a new investigator at random and set it up as at the start of the game — it enters play at the beginning of the next turn.",
      { t: "<b>Delayed</b> (marker on its side): in your next Movement Phase you get no movement points and don’t move — just stand the marker up. You may still trade, and must still evade or fight monsters in your area, but you can’t use items, abilities or spells to move. You can’t be ‘double delayed’. ‘Lose your next turn’ is harsher: skip every phase except Mythos.", src: "Core p.8, p.16 · FAQ p.5, p.13" },
      "<b>Arrested:</b> go to the Police Station’s Jail Cell, lose half your money (round down), and skip your next turn (you just stand up into the main Police Station area).",
      { t: "Arrested on the <b>Innsmouth board</b>: go to the Innsmouth Jail (not Arkham’s Police Station), lose half your money (round down) and are delayed — even if normally immune to being delayed (but not if the arrest itself is prevented). You may be stuck there for several turns; other investigators can help free you by moving to Sawbone Alley (a street area) and following its instructions.", when: c => c.has("innsmouth"), tag: "innsmouth", src: "Innsmouth p.6 · FAQ p.39" },
      { t: "<b>Lost in Time and Space:</b> you are delayed and lose your next turn (you may only stand your marker up in its Movement Phase); at the start of the following turn’s Upkeep Phase you may move to any location or street area in Arkham. You don’t pick up Clues where you arrive.", when: c => c.boardCount === 0, src: "Core p.17 · FAQ p.14" },
      { t: "<b>Lost in Time and Space:</b> you are delayed and lose your next turn (you may only stand your marker up in its Movement Phase); at the start of the following turn’s Upkeep Phase you may move to any location or street area in Arkham or in any other town whose board is in play. You don’t pick up Clues where you arrive.", when: c => c.boardCount >= 1, tag: c => ["dunwich", "kingsport", "innsmouth"].find(c.has), src: "Core p.17 · Dunwich p.5 · Kingsport p.7 · Innsmouth p.6 · FAQ p.14" },
      { t: "Lost investigators can’t return to a <b>Kingsport Head</b> location (The Causeway, Wireless Station, Strange High House in the Mist).", when: c => c.has("kingsport"), tag: "kingsport", src: "Kingsport p.7" },
      { t: "Lost investigators can’t return to <b>Y’ha-nthlei</b> or <b>Devil Reef</b> (you may return to Falcon Point and use its Boat Charter that turn).", when: c => c.has("innsmouth"), tag: "innsmouth", src: "Innsmouth p.6 · FAQ p.38" },
      "<b>Trading:</b> during the Movement Phase (before, during or after moving — even while delayed), investigators in the same location, street area or Other World area may trade money, Common & Unique Items and Spells (plus the Patrol Wagon, Deputy’s Revolver, Exhibit Items and Rail Passes) — but never during combat, and never Clue tokens, Allies, Skills or trophies. They may also trade in the final battle’s Refresh step.",
      { t: "<b>Injuries & Madness</b> (Dunwich): instead of losing half your items and Clues, you may take an <b>Injury</b> card (at 0 Stamina) or <b>Madness</b> card (at 0 Sanity) and restore that track to its maximum — you lose no items or Clue tokens but still move to the hospital/asylum or Lost in Time and Space. Injury/Madness cards are not items and can’t be discarded or traded. With <b>2+</b> Injury and/or Madness cards you may <b>retire</b>: skip your turn and draw a new investigator as if devoured (devour-triggered effects such as Glaaki’s don’t fire).", when: c => c.has("dunwich"), tag: "dunwich" },
      { t: "Holding <b>2 of the same</b> Injury or Madness card devours you.", when: c => c.has("dunwich"), tag: "dunwich", src: "Miskatonic p.3" },
      { t: "<b>Miskatonic Horror:</b> each new Injury card matches a Dunwich Madness card, and each new Madness card a Dunwich Injury card — holding a matched pair also devours you (Rita Young’s Resilient ability prevents this).", when: c => c.has("dunwich") && c.has("miskatonic"), tag: "miskatonic", src: "Miskatonic p.3" }
    ]},
    { h: "Gates, Closing & Sealing", items: [
      "When a gate opens on you, you are drawn to the matching Other World and <b>delayed</b>. After exploring, you return to the gate’s location with an explored marker. In the Arkham Encounters Phase, make a <b>Lore or Fight check (your choice)</b> using the number on the gate marker as the modifier to <b>close</b> it and take it as a Gate trophy. If you fail you may try again next turn, but leaving the location discards your explored marker.",
      "<b>Seal</b> a gate you have just closed by spending <b>5 Clue tokens</b>: place an unused doom token, elder-sign side up, on the location. No further gates can open and no monsters can appear there. Only gates on unstable locations can be sealed. A gate closed by an encounter or card effect goes to the bottom of the gate stack (no trophy) and can’t be sealed.",
      "The <b>Elder Sign Unique Item</b> closes AND seals with no roll and no Clues. Use it in the Arkham Encounters Phase while on the gate’s location with an explored marker, as if closing it: lose 1 Sanity and 1 Stamina (the seal still happens even if this knocks you out or drives you insane), move a doom token <b>off the Ancient One’s doom track</b> to serve as the seal, take the Gate trophy, and return the card to the box.",
      { t: "<b>Gate Bursts</b> (red gate location on a Mythos card): if the location has an elder sign token (a seal), the seal bursts — the token is removed and a gate/monster appear, but NO doom token is added and bursting the seal is not a monster surge. Whenever a gate burst is drawn, all flying monsters also move. If the location already has an open gate, it is a normal monster surge (FAQ p.26). Flying monsters move even if the burst is prevented (e.g. by Kate Winthrop).", when: c => ["dunwich", "kingsport", "blackgoat", "innsmouth", "lurker", "miskatonic"].some(c.has), tag: c => ["miskatonic", "lurker", "innsmouth", "blackgoat", "kingsport", "dunwich"].find(c.has) },
      { t: "<b>Alternate-gate</b> Mythos cards: the gate (and any burst) uses the upper location; the lower one is used only if the upper is on an expansion board not in play. A Clue token for a location on a board not in play is ignored. When a card offers two Clue locations, use the first if its board is in play, otherwise the second.", when: c => c.has("miskatonic"), tag: "miskatonic", src: "Miskatonic p.4" }
    ]},
    { h: "Monsters, the Limit & the Outskirts", items: [
      "<b>Monster limit</b> = players + 3. A new monster over the limit goes to the <b>Outskirts</b> instead.",
      "<b>Outskirts limit</b> = 8 − players. When the Outskirts overflow, return those monsters to the cup and raise the terror level by 1.",
      "<b>Terror level:</b> each point it rises, return one random unclaimed Ally to the box. At <b>3</b> the General Store closes (occupants to Rivertown), at <b>6</b> the Curiositie Shoppe (to Northside), at <b>9</b> Ye Olde Magick Shoppe (to Uptown). At <b>10</b> Arkham is overrun — the monster limit is removed and all monsters in the Outskirts return to the cup. The terror level never goes above 10 (each further rise adds a doom token instead) and never decreases.",
      { t: "With <b>5 or more investigators</b> (after any multi-board reduction), place <b>2 monsters</b> (not 1) each time a gate opens and a monster appears.", when: c => AH.playerRef.effectivePlayers(c.p, c.boardCount) >= 5 },
      { t: "<b>Monster surge:</b> when the Mythos card’s gate location already has an open gate, monsters appear equal to the <b>greater of</b> (open gates, players), divided as evenly as possible among all open gates — no gate may receive more monsters than the surge gate (the location shown on the Mythos card). If more monsters would be placed than the monster limit allows, decide where they will be placed BEFORE drawing any from the cup (the first player decides if you can’t agree); monsters over the limit go to the Outskirts." },
      { t: "Monsters on an <b>expansion board</b> never count against the monster limit and never go to the Outskirts.", when: c => c.boardCount >= 1, tag: c => ["dunwich", "kingsport", "innsmouth"].find(c.has) }
    ]},
    { h: "Winning & Losing", items: [
      "<b>Close the Gates:</b> the moment a player closes the <b>last</b> open gate on the board, the investigators win — provided their unspent <b>Gate trophies</b> (including the one just closed) total at least the number of players.",
      "<b>Seal the Gates:</b> the investigators win immediately when there are <b>6 or more Elder Sign tokens</b> on the board.",
      "<b>Banish the Ancient One:</b> if it awakens, the investigators can still win by defeating it in the final battle.",
      "The <b>Ancient One awakens</b> (→ final battle) if: the doom track fills; too many gates are open at once (see the Reference Table); a gate opens with no gate markers left; a monster should appear with none left in the cup; or the <b>terror level is 10 and the monsters in Arkham’s neighbourhoods and the Sky equal twice the normal monster limit</b> (e.g. 16 at 5 players; monsters on expansion boards don’t count — FAQ p.3).",
      { t: "The Ancient One also awakens immediately if the <b>Deep Ones Rising track</b> fills.", when: c => c.has("innsmouth"), tag: "innsmouth" },
      { t: "The Ancient One also awakens immediately if someone must draw a <b>Corruption</b> card and the Corruption deck is empty (it is never reshuffled).", when: c => c.has("blackgoat"), tag: "blackgoat" }
    ]},
    { h: "The Final Battle", items: [
      "When the Ancient One awakens: <b>fill its doom track</b> with doom tokens if not already full; every investigator Lost in Time and Space is devoured and <b>eliminated</b> (no replacement investigator); discard active Environment/Rumor cards; then resolve the Ancient One’s <b>Start of Battle</b> ability, if it has one. From now on no one collects money, gains Clues, or rolls for Retainers/Bank Loans.",
      "Each round: <b>1) Refresh</b> — refresh cards, use abilities, adjust sliders (like Upkeep), pass the First Player marker left, and trade equipment freely. <b>2) Investigators attack</b> — starting with the first player and going clockwise, each surviving player makes a Combat check against the Ancient One at its combat modifier. Combat spells refreshed in step 1 stop working and must be re-cast for each attack.",
      { t: "Successes are <b>cumulative across players and rounds</b>: for every full set of successes equal to the <b>number of players (including eliminated ones)</b>, remove one doom token. Leftover successes carry over. For example, 9 successes in the first round of a 4-player game remove 2 doom tokens, and 1 success carries over to the next round of combat. Remove the last doom token and the investigators win.", src: "Core p.22 · FAQ p.12–13" },
      "<b>3) The Ancient One attacks</b> per its sheet. Anyone reduced to 0 Sanity or Stamina is devoured — eliminated for good, with no replacement investigator. If everyone is devoured, the players lose.",
      { t: "<b>Epic Battle</b> replaces this flow: after each Refresh, draw an Epic Battle card and follow it for the round. ‘Sinister Plot’ cards bring in the Ancient One Plot cards; ‘The End of Everything’ loses the game immediately. (Not used with Azathoth.)", when: c => c.mod("epicBattle"), tag: "kingsport" },
      { t: "Miskatonic <b>Battle Events</b> resolve immediately; <b>Battle Conditions</b> stay face up for the rest of the game. After either, immediately draw another Epic Battle card.", when: c => c.mod("epicBattle") && c.has("miskatonic"), tag: "miskatonic", src: "Miskatonic p.4" },
      { t: "Once the final battle begins, investigators can no longer gain <b>Power tokens</b>, but may still spend them as their Blood or Soul Pact allows.", when: c => c.mod("heraldLurker"), tag: "lurker", src: "FAQ p.40–41" }
    ]}
  ],

  /* Module-specific play (gated by the active module / expansion). */
  modules: [
    { id: "personalStories", when: c => c.mod("personalStories"), h: "Personal Stories", tag: "innsmouth", items: [
      "Each investigator’s first Personal Story card acts like a private Rumor with a pass and a fail condition.",
      "When either condition is met, discard it and put the second card into play (pass or fail side up); its effect then lasts the rest of the game.",
      { t: "If the pass and fail conditions are met at the same moment, the player chooses which one triggers. A new investigator (after being devoured or retiring) whose condition is already met passes or fails it immediately.", src: "Innsmouth p.10 · FAQ p.37" }
    ]},
    { id: "innsmouthLook", when: c => c.has("innsmouth"), h: "The Innsmouth Look & Deep Ones", tag: "innsmouth", items: [
      { t: "Whenever a card tells you to draw <b>Innsmouth Look</b> cards, shuffle that deck and draw the listed number all at once. If the ‘Look’ card is among them, follow its instructions (it can turn you into a Deep One). Then return all the cards to the deck.", src: "Innsmouth p.7" },
      "Prevent the Deep Ones Rising track from filling by feeding the <b>Feds Raid Innsmouth</b> track with Clue tokens — filling it empties both tracks."
    ]},
    { id: "corruption", when: c => c.has("blackgoat"), h: "Cults & Corruption", tag: "blackgoat", items: [
      "An investigator with a <b>‘One of the Thousand’ Cult Membership</b> draws from the Cult Encounter deck at the Black Cave, the Unvisited Isle and the Woods instead of the normal location deck.",
      { t: "<b>Corruption cards</b> trigger (this is not optional) when both the dimension symbol and its background colour match a monster-movement symbol on a Mythos card drawn during the Mythos Phase. Resolve them right after monster movement. Whenever a gate is closed or sealed, every Corruption card in play with that gate’s dimension symbol is discarded and removed from the game. The Corruption deck is never reshuffled — if you must draw and it is empty, the Ancient One awakens.", src: "Black Goat p.2 · FAQ p.34" }
    ]},
    { id: "exhibit", when: c => c.has("curse"), h: "Ancient Whispers, Patrols & Exhibits", tag: "curse", items: [
      "An investigator who is in the <b>Ancient Whispers</b> street area during the Arkham Encounters Phase has an <b>Exhibit Encounter</b> (shuffle, draw, resolve, then move the marker as the card says). Only one Exhibit Encounter happens per turn. If a gate is in that street area, the investigator is drawn through it instead of having the Exhibit Encounter. The Ancient Whispers marker can never be removed from the board.",
      "If the marker didn’t move that phase, it moves in the Mythos Phase like a monster with the moon symbol.",
      "<b>Patrol markers:</b> leaving or ending movement in a patrolled street area requires a Sneak (+0) check or you are arrested. All Patrol markers are removed whenever the terror level rises.",
      "<b>Benefit / Detriment cards</b> are unique — only one investigator may hold each at a time."
    ]},
    { id: "kiy", when: c => c.has("kingyellow"), h: "The Act Deck", tag: c => c.has("miskatonic") ? "miskatonic" : "kingyellow", items: [
      { t: "Each ‘The Next Act Begins!’ Mythos card puts the top Act card into play. Acts I and II each list a way for the investigators to stop them; Act III cannot be stopped and, if it enters play, the investigators immediately lose.", src: "KiY p.1", when: c => !c.has("miskatonic") },
      { t: "With Miskatonic Horror, put King in Yellow’s 3 Act cards back in the box and use Miskatonic’s 4 Act cards instead. Stack them face down, top to bottom: Overture, Act I, Act II, Act III. Then turn the Overture face up and place it next to the Act deck. It starts in play and stays in play until another Act card sits on top of it. Keep the ‘The Next Act Begins!’ Mythos cards in the Mythos deck. Follow the Act cards’ own text. Once the last Act card has entered play, the investigators immediately lose. Per the FAQ, an Environment Mythos card drawn during the Mythos Phase triggers Act cards even if its ability isn’t activated, it is discarded and replaced, or it isn’t resolved. Immediately after each Mythos card drawn in the Mythos Phase, you always get a chance to return an Act card to the top of the Act deck.", src: "Miskatonic p.2–3 · FAQ p.42", when: c => c.has("miskatonic"), tag: "miskatonic" },
      { t: "<b>Touring Performance:</b> don’t shuffle a Location deck before an Arkham encounter. Take its top card, resolve it, then put it face up on the bottom. Only after going through the whole deck do you turn the cards face down and shuffle.", src: "KiY p.2", when: c => c.mod("kiyTouring"), tag: "kingyellow" }
    ]},
    { id: "lurkerPacts", when: c => c.mod("heraldLurker"), h: "Dark Pacts & Reckonings", tag: "lurker", items: [
      "Dark Pacts (Blood Pact, Soul Pact, Bound Ally) grant power via <b>Power tokens</b> but expose you to the <b>Reckoning</b> deck.",
      "Knocked-out or insane investigators keep their Dark Pacts and Power tokens; a <b>devoured</b> investigator loses them all.",
      { t: "If no Power tokens are left, effects that would give them are ignored; if there aren’t enough for everyone, the first player chooses who receives them first. Once the final battle begins you can no longer gain Power tokens, but you may still spend them as your Blood or Soul Pact allows (FAQ).", src: "Lurker p.2 · FAQ p.40–41" }
    ]},
    { id: "lurkerGatesPlay", when: c => c.mod("lurkerGates"), h: "Attribute Gate Markers", tag: "lurker", items: [
      "Each Lurker Gate marker adds an attribute: <b>Devouring</b> (devours an investigator it opens on), <b>Gate of Doom</b> (+1 doom if it opens on an investigator), <b>Endless</b> (reshuffled, never a trophy), <b>Monstrous / Blood / Madness</b> (penalty on a failed close), <b>Moving</b> (moves like a monster on its symbol), and <b>Split</b> (two Other Worlds).",
      { t: "<b>Moving gate:</b> when its dimension symbol moves, it moves like a normal monster (the first player orders several), even in the Mythos Phase it opened. It ignores investigators, never moves into a space that already has a gate or a vortex, and does not normally move into a location that could legally hold an elder sign. Moving onto an investigator pulls them through; moving away from one who explored it costs the explored token.", src: "Lurker p.2 · FAQ p.40" },
      { t: "<b>Split gate:</b> when drawn through, choose either Other World. Returning from either lets you close it (you needn’t explore both). Closing it returns monsters with EITHER dimension symbol in Arkham, the Sky and the Outskirts to the cup.", src: "Lurker p.2" },
      "A gate may only be <b>sealed</b> on an unstable location; a gate that ends up in a street or stable location can be closed but not sealed."
    ]},
    { id: "relationships", when: c => c.has("lurker") && c.p >= 2 && !c.mod("noRelationships"), h: "Relationships", tag: "lurker", items: [
      "Each player benefits from their own Relationship card and the one held by the player to their right (3+ players).",
      "A Relationship is lost only if its investigator or that investigator’s partner is devoured (or retires — FAQ); new ones are not drawn for replacement investigators."
    ]},
    { id: "institutions", when: c => c.institution, h: "Institutions", tag: "miskatonic", items: [
      "Institutions help investigators in exchange for resources gathered during the game; follow the chosen Institution sheet.",
      "You may combine Heralds, Guardians and Institutions, but generally use at most one of each."
    ]},
    { id: "dunwichHorror", when: c => c.mod("heraldDunwich"), h: "The Dunwich Horror (Herald)", tag: "miskatonic", items: [
      "The Dunwich Horror track starts with 1 token and gains another at terror 3, 6 and 9.",
      { t: "The Horror has both the circle and the moon dimension symbol, for movement only: it can’t be banished or pulled through a gate because of the extra symbol. If a Mythos card moves both circle and moon monsters, it moves for each symbol, white-background symbol first (FAQ). Each time it moves, it adds a doom token on a 2–6 (not 4–6).", src: "Miskatonic p.4 · FAQ p.42" },
      { t: "If Yog-Sothoth is the Ancient One and awakens while the Dunwich Horror is on the board, his combat modifier increases by 3 (to –8) and he gets 5 extra doom tokens on his doom track (17 in all).", src: "Miskatonic p.4" }
    ]},
    { id: "kiyHerald", when: c => c.mod("heraldKiY"), h: "The King in Yellow (Herald)", tag: "kingyellow", items: [
      "Whenever the terror level rises, choose: put a Yellow Sign token on the Ancient One’s doom track (it acts just like a doom token) or on the terror track in the space the terror marker just left. The Herald sheet gives the full effects.",
      "A Yellow Sign placed on the terror track makes the first player draw a Blight card and put it into play next to the Herald sheet. Once in play, a Blight can never be got rid of.",
      { t: "If a location encounter mentions by name a person on a Blight card in play, ignore the encounter and lose 1 Sanity or 1 Stamina (your choice). An encounter that doesn’t name the person, or uses the name for something else, is not ignored. Mythos cards are unaffected. If the Ancient One awakens, return the Herald sheet to the box.", src: "KiY p.2 · FAQ p.27 · Miskatonic p.3" }
    ]},
    { id: "bgHerald", when: c => c.mod("heraldBlackGoat"), h: "The Black Goat (Herald)", tag: "blackgoat", items: [
      "When a gate opens, draw its normal monster(s), then 1 more from the hexagon cup (5+ players: 2 normal + 1 hexagon). In a monster surge, half the monsters (round down) come from the hexagon cup, drawn alternately starting with the normal cup. Each monster surge also adds a doom token.",
      "Hexagon monsters are not removed from the board when a hexagon gate is closed. Hexagon monsters returned to the cup for any reason go back to the hexagon cup.",
      { t: "Defeating a hexagon monster draws a Corruption card. Dark Young move as normal monsters. If the cup you should draw from is empty, draw from the other one. Monsters drawn for any other reason (e.g. encounters) come from the normal cup.", src: "Black Goat p.2 · FAQ p.35" }
    ]},
    { id: "pharaohHerald", when: c => c.mod("heraldPharaoh"), h: "The Dark Pharaoh (Herald)", tag: "curse", items: [
      "Each time you gain a Unique Item (including starting equipment), lose 1 Sanity. Each time you gain an Exhibit Item, roll a die; on a failure you are Cursed. Taking either from another investigator doesn’t count.",
      "At the start of each Upkeep, before rolling to get rid of Curses, each Cursed investigator loses 1 Stamina, even on the first turn of the Curse.",
      { t: "All Mask monsters gain 1 toughness, and each Mask monster defeated adds a doom token. If Nyarlathotep is the Ancient One and awakens, his combat modifier worsens by 1 and he gets 1 extra doom token for each Mask monster on the board.", src: "Curse p.2 · FAQ p.21" }
    ]},
    { id: "guardians", when: c => c.mod("guardianHypnos") || c.mod("guardianBast"), h: "Guardians", tag: "kingsport", items: [
      { t: "<b>Hypnos:</b> all Visions of Hypnos cards in play are discarded at the end of each Mythos Phase.", src: "FAQ p.32", when: c => c.mod("guardianHypnos") },
      { t: "<b>Bast:</b> to become Beloved of Bast (when you are the First Player), either discard a Bast token or simply have the Foolishness Ally.", src: "FAQ p.32", when: c => c.mod("guardianBast") }
    ]}
  ]
};

/* ---- Contextual FAQ — official rulings surfaced for the active setup ------ */
/* Rulings from the Complete Arkham Horror FAQ & Errata and the rulebooks, each
   cited in `src`. when:(c)=>bool */
AH.faq = [
  { q: "How many Clue tokens does it cost to seal a gate?",
    a: "Five Clue tokens, spent after you close the gate. The Elder Sign Unique Item seals with no roll and no Clues — but you lose 1 Sanity and 1 Stamina, the card is used up, and a doom token is removed from the doom track to form the seal. Some Heralds/Blights change the Clue cost.",
    src: "Core p.17–18 · FAQ p.1 (Elder Sign errata) · KiY p.1 (Oliver Thomas Blight)" },
  { q: "Do monsters on the expansion boards count against the monster limit?",
    a: "No. Monsters on the Dunwich, Kingsport or Innsmouth boards never count against the Arkham monster limit and never go to the Outskirts. But the Sky is part of Arkham: a monster that moves from an expansion board into the Sky counts against the limit (and goes to the Outskirts if the limit is already reached).",
    src: "Dunwich p.5 · Kingsport p.7 · Innsmouth p.6 · FAQ p.12, p.25",
    when: c => c.boardCount >= 1 },
  { q: "Can the ‘Mask’ monsters ever be in the cup without Nyarlathotep?",
    a: "Only if a sheet tells you to. The Dark Pharaoh Herald, for example, adds the Dark Pharaoh monster regardless of the Ancient One.",
    src: "Core p.5 · Curse p.2 (step 11a)",
    when: c => c.mod("heraldPharaoh") },
  { q: "We’re using several Heralds/Guardians/Institutions — is that legal?",
    a: "Yes, any combination is allowed, but the rules say to generally limit yourselves to at most one Herald, one Guardian and one Institution (and Innsmouth Horror has you select one Herald).",
    src: "Kingsport p.10 · Innsmouth p.9 · Miskatonic p.4",
    when: c => c.heraldCount > 1 || c.institutionCount > 1 },
  { q: "Do the new Act cards from Miskatonic Horror remove the ‘The Next Act Begins!’ Mythos cards?",
    a: "No. When you use Miskatonic Horror’s Act deck (Overture–Act III), keep the ‘The Next Act Begins!’ Mythos cards in the Mythos deck.",
    src: "Miskatonic p.3 (step 4 note)",
    when: c => c.has("kingyellow") && c.has("miskatonic") },
  { q: "With the original (non-revised) Curse of the Dark Pharaoh and Miskatonic Horror, what do we use?",
    a: "Miskatonic Horror is built for the REVISED Curse. With the original edition, use only the new Exhibit Item cards and box the rest of the Pharaoh-icon Miskatonic cards.",
    src: "Miskatonic p.3 (step 2 note)",
    when: c => c.has("curse") && c.has("miskatonic") },
  { q: "Does an investigator drawn through a gate during an encounter also get delayed?",
    a: "Yes — being drawn through a gate that appears from an encounter (‘A gate appears!’) delays you just like a Mythos-Phase gate.",
    src: "FAQ p.2 · Core p.9" },
  { q: "What happens if we must draw a Corruption card but the deck is empty?",
    a: "The Ancient One immediately awakens. The Corruption deck is never reshuffled.",
    src: "Black Goat p.2",
    when: c => c.has("blackgoat") },
  { q: "Can a Moving gate end up somewhere it can’t be sealed?",
    a: "Yes. A gate can only be sealed on an unstable location; one in a street or a stable location can be closed but not sealed. Moving gates don’t normally move into locations that could hold an elder sign, so a gate that has moved can usually only be closed.",
    src: "Lurker p.2 · FAQ p.3, p.40",
    when: c => c.mod("lurkerGates") }
];

/* ---- TEACHING SCRIPT (read aloud, ~5 min; content per the AH 2nd Edition
   rulebook and expansion rulebooks — see the setup citations above) ---------- */
AH.teach = {
  intro: "Read this aloud — about five minutes. Sliders untouched until the end.",
  sections: [
    { h: "The pitch — and how we win", body: (c) => `
<p>It's 1926, and gates to other worlds are tearing open all over Arkham. Every open gate feeds the <b>doom track</b> of the Ancient One sleeping beneath the town. This is fully cooperative, and there are three ways to win: <b>close every gate</b> on the board while holding at least one unspent gate trophy per investigator, get <b>six gates sealed</b> at once — the clean win — or, if the Ancient One <b>awakens</b>… beat it in the final battle${c.mod("epicBattle") ? " (we're using the <b>Epic Battle</b> deck: each round, after we refresh, we draw a card that decides who attacks and how — and if ‘The End of Everything’ comes up, we lose)" : ""}. Plan for the seals. Pray you never need plan C.</p>` },

    { h: "The shape of a turn", body: (c) => { const two = AH.playerRef.effectivePlayers(c.p, c.boardCount) >= 5; return `
<p>Five phases, everyone in order: <b>Upkeep</b> — refresh cards and slide your <b>skill sliders</b>, tuning who your investigator is this turn; <b>Movement</b> — walk the streets, or move along your Other World; <b>Arkham Encounters</b> — draw the story card for your location; <b>Other World Encounters</b> — same, on the far side of a gate; and the <b>Mythos phase</b> — the game's turn: a Mythos card opens a new gate with ${two ? "two monsters" : "a monster"} (if a gate is already open there, every open gate spawns monsters instead), drops a Clue, moves monsters, and its Headline, Environment or Rumor changes the rules.</p>`; } },

    { h: "Skill checks — sliders and dice", body: (c) => `
<p>Everything is a <b>skill check</b>: roll dice equal to your skill plus the check's modifier — <b>5s and 6s are successes</b>, and one success passes unless the check lists a higher difficulty. Your six skills sit on three <b>sliders</b>, each a trade-off (speed against sneaking, fighting against will…), adjusted a little each Upkeep. <b>Clue tokens</b> are bonus dice — spend one after a roll to add a die — so burn them at the moments that matter, and they matter most at gates.</p>` },

    { h: "Gates — close them, seal them", body: (c) => { const two = AH.playerRef.effectivePlayers(c.p, c.boardCount) >= 5; return `
<p>A gate opens; ${two ? "two monsters come" : "a monster comes"} with it. Step onto the gate and you're <b>pulled through</b> to its Other World; survive two encounters there, come back, and you may <b>close</b> it with a Fight or Lore check — spend <b>five Clue tokens</b> as you do and it's <b>sealed</b> for good. Monsters must be fought or <b>evaded</b> on the way — only a monster you <b>defeat</b> becomes a trophy. Monster and gate trophies can be spent at certain locations, but only <b>unspent</b> gate trophies count toward the close-every-gate win. Closing a gate also sends every monster with its dimension symbol back to the cup. That's the core loop: gear up in Arkham, dive through a gate, come back, slam it shut.</p>
<p>Try to leave, or stop in, an area with a monster and you must <b>evade</b> it (a Sneak check modified by its Awareness — fail and it hits you for its combat damage and the fight is on) or <b>fight</b> it: first a <b>Horror check</b> on Will modified by its horror rating (fail and lose the Sanity shown), then <b>Combat checks</b> on Fight plus your weapons and spells (two hands' worth), modified by its combat rating. You need as many successes as its toughness in a single roll; every miss costs you its combat damage, and then you choose to fight on or flee. Spells must be cast first: pay their Sanity cost and pass a Lore check.</p>`; } },

    { h: "Doom, terror & going under", body: (c) => `
<p>Every new gate adds a <b>doom token</b>; the track filling is the loss timer — but the Ancient One also wakes at once if <b>${AH.playerRef.gatesToAwaken(AH.playerRef.effectivePlayers(c.p, c.boardCount)) + (c.has("dunwich") && c.has("innsmouth") ? 1 : 0)} gates are open together</b> (the Reference Table's number for this game), if a gate must open with no gate markers left or a monster must be drawn from an empty cup, or if terror is at 10 with twice the monster limit in Arkham and the Sky. Monsters flooding the streets raise the <b>terror level</b>, which strips allies and closes shops. Hit zero <b>Sanity or Stamina</b> and you discard half your items and half your Clues (rounded down) plus any Retainers, then come back with 1 point — in the Asylum or Hospital if you were in town, or <b>Lost in Time and Space</b>, losing a turn, if you were in an Other World. Hit both at once, or have a maximum drop to zero, and the investigator is <b>devoured</b>: take a fresh one and keep fighting — but once the Ancient One wakes there are no replacements: anyone Lost in Time and Space is devoured on the spot, and anyone devoured in the final battle is simply out.</p>` },

    { h: "This table's expansions", when: (c) => c.has("dunwich") || c.has("kingsport") || c.has("innsmouth") || c.has("curse") || c.has("kingyellow") || c.has("blackgoat") || c.has("lurker") || c.has("miskatonic"), body: (c) => {
      const bits = [];
      if (c.has("dunwich")) bits.push("<b>Dunwich</b> hangs a second town off the map — gates out there too, and the Dunwich Horror itself if monsters keep slipping into its vortices — and when you'd go insane or unconscious you may take a <b>Madness</b> or <b>Injury</b> card: you still go to the Asylum, Hospital or Lost in Time and Space, but you keep all your items and Clues and come back at full, and the card's penalty stays with you" + (c.has("miskatonic") ? " (hold a matching Miskatonic Injury-and-Madness pair and you're devoured)" : ""));
      if (c.has("kingsport")) bits.push("<b>Kingsport</b> adds a town where dimensional <b>rifts</b> creep open as Mythos cards fill its rift tracks — have encounters at the Kingsport locations shown on the rift progress markers to clear them, because an open rift wanders like a monster, spawns monsters and can add doom: an unglamorous, vital job");
      if (c.has("innsmouth")) bits.push("<b>Innsmouth</b> adds a hostile town where the Deep Ones rise: every gate a seal (or anything else) stops from opening, and every monster that wanders into an Innsmouth vortex, adds to the <b>Deep Ones Rising</b> track — if it fills, the Ancient One wakes. Spend Clues in Innsmouth's neighbourhoods during Upkeep on the <b>Feds Raid</b> track; six fills it and empties both. And once the doom track is half full, martial law means stopping on many Innsmouth spaces risks arrest" + (c.mod("personalStories") ? " — and everyone carries a <b>Personal Story</b>: your own subplot with a reward for finishing it and a price for failing" : ""));
      if (c.has("curse")) bits.push("<b>Curse of the Dark Pharaoh</b> tours a cursed exhibit through town: stand in the street with the <b>Ancient Whispers</b> marker during Arkham Encounters and you draw an Exhibit Encounter, and a street with a <b>Patrol</b> marker makes you pass a Sneak check to leave it or stop there — fail and you're arrested");
      if (c.has("kingyellow")) bits.push("<b>The King in Yellow</b> stages a play that should never be performed" + (c.mod("kiyTouring") ? " (a touring performance — its new cards sit on top of the decks, so the play dominates the early game; and we <b>don't shuffle location decks</b> — draw the top card, then put it face up on the bottom)" : " (a permanent engagement — its cards are simply shuffled into the decks)") + " — " + (c.has("miskatonic") ? "we use Miskatonic's four-card <b>Act deck</b> instead of the King in Yellow's: the Overture starts in play, ‘The Next Act Begins!’ cards stay in the Mythos deck, Environment Mythos cards drawn in the Mythos Phase can trigger the Acts too, and we get chances to send an Act back to the top of the deck" : "each ‘The Next Act Begins!’ card advances the <b>Act deck</b>; Acts I and II each list a way for us to stop them") + " — and if Act III enters play we lose on the spot");
      if (c.has("blackgoat")) bits.push("<b>The Black Goat</b> offers cult membership and charges corruption — closing a gate with a matching symbol sheds your Corruption, but if the Corruption deck ever runs out, the Ancient One wakes" + (c.mod("difficulty") ? ", and a <b>Difficulty card</b> is tuning this whole game" : ""));
      if (c.has("lurker")) bits.push("<b>The Lurker at the Threshold</b> " + (c.mod("heraldLurker") ? "deals in Dark Pacts — power now, price later" : "slips new horrors into the decks") + (c.has("lurker") && c.p >= 2 && !c.mod("noRelationships") ? ", and <b>Relationship</b> cards tie each of us to the player on our left" : "") + (c.has("lurker") && c.p >= 2 && c.mod("noRelationships") ? " (we're leaving its Relationship cards in the box this game)" : ""));
      const inst = [["instMisk", "Miskatonic University"], ["instBureau", "the Bureau of Investigations"], ["instOrgCrime", "Organized Crime"]].filter(([k]) => c.mod(k)).map(([, n]) => n);
      if (c.has("miskatonic")) bits.push("<b>Miskatonic Horror</b> threads extra cards through every other box" + (inst.length ? ", and " + inst.join(" and ") + (inst.length > 1 ? " offer" : " offers") + " help in exchange for resources — I'll read the sheet" + (inst.length > 1 ? "s" : "") : ""));
      const HG = { heraldKiY: "<b>The King in Yellow</b> is our Herald: each time terror rises we choose — a Yellow Sign on the doom track, or on the terror track, which puts a Blight into play for good", heraldBlackGoat: "<b>The Black Goat</b> is our Herald: every new gate also gets a monster from a second, hexagon cup, beating a hexagon monster draws Corruption, and every monster surge adds doom", heraldPharaoh: "<b>The Dark Pharaoh</b> is our Herald: every Unique Item you gain costs 1 Sanity, Exhibit Items can Curse you, and Mask monsters are tougher and add doom when beaten", heraldLurker: "<b>The Lurker</b> is our Herald", heraldDunwich: "<b>The Dunwich Horror</b> is our Herald: its track starts with a token and gains one at terror 3, 6 and 9, and when the Horror moves it adds doom on a 2–6", heraldGhroth: "<b>Ghroth</b> is our Herald", heraldTulzscha: "<b>Tulzscha</b> is our Herald", heraldDagon: "<b>Father Dagon</b> is our Herald", heraldHydra: "<b>Mother Hydra</b> is our Herald", guardianNodens: "<b>Nodens</b> is our Guardian — the Blessings of Nodens deck gives Blessed investigators an extra benefit", guardianHypnos: "<b>Hypnos</b> is our Guardian — Visions of Hypnos bring Clues out faster and make helpful encounters likelier", guardianBast: "<b>Bast</b> is our Guardian — Bast tokens track her favour, and Beloved of Bast cards can be earned" };
      const hg = Object.keys(HG).filter(k => c.mod(k)).map(k => HG[k]);
      const train = c.boardCount > 0 ? " To reach another town, ride the train: from Arkham's Train Station or any town's depot, $1 and one movement point takes you to another town's station or depot, and you can keep moving." : "";
      return `<p>${bits.join("; ")}.${train}${hg.length ? " " + hg.join(". ") + ". " + (c.heraldCount ? "Heralds make the game harder" : "") + (c.heraldCount && c.guardian ? " and " : "") + (c.guardian ? "Guardians help us" : "") + " — I'll read " + (hg.length > 1 ? "the sheets" : "the sheet") + " out." : ""}</p>`;
    }},

    { h: "Don't worry about these yet", body: (c) => {
      const later = ["monster movement symbols", "the shops", "blessing and curse dice"];
      if (c.mod("lurkerGates")) later.push("the Lurker's attribute gate markers");
      if (["dunwich", "kingsport", "blackgoat", "innsmouth", "lurker", "miskatonic"].some(c.has)) later.push("gate bursts (they can blow a seal open)");
      return `<p>I'll explain ${later.join(", ")} when they first matter. Opening advice: <b>clues before heroics</b> — a closed gate can open again, a sealed one normally can’t, so the team that wins is the one that seals, not the one that sightsees. And keep one eye on the terror level.</p>`;
    }}
  ]
};
