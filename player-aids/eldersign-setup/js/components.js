/* =============================================================================
   Elder Sign — Components glossary data (standard format v1; rendered by js/comp-widget.js)
   Sources (printed pages): Base p.2 (Components list) and p.2–3 (Component Descriptions, the pictures) ·
   Unseen Forces p.1 (Component List + Component Overview; only its new kinds of component are pictured) ·
   Gates of Arkham p.1 · Omens of Ice p.1 · Grave Consequences card 1/5 · Omens of the Deep p.1 ·
   Omens of the Pharaoh p.1. The "This Rulebook"/"This Rulesheet" lines are left out. Each rulebook is
   printed on a different paper colour, so each set has its own picture-panel colour (fig, standard v1.1).
   Gating:
   - A game mode's setup replaces the Adventure deck, the Mythos deck and the entrance sheet (GoA p.2,
     OoI p.2, OotD p.2, OotP p.2), so the museum's own decks and entrance show only in the Classic Museum
     mode; Unseen Forces' Entrance cards replace the base entrance sheet (UF p.1–2).
   - Omens of Ice, Omens of the Deep and Omens of the Pharaoh each name their mode-only pieces and say that
     "all other content found in this expansion can be played with the base game or any other game mode"
     (OoI p.5, OotD p.6, OotP p.2). Only the named pieces are gated to their mode (Adventure and Mythos
     decks, entrance card, Track card / Scenario card, the Expedition side of the scenario sheet); their
     special adventures, supply, day, amulet, omen and expedition tokens are "other content" and show in
     every mode. The mode entrance cards replace all other entrance cards (OoI p.3, OotD p.3, OotP p.3).
   - Gates of Arkham has no such statement. Its p.2 list of pieces to combine with the base game leaves out
     the Streets of Arkham setup pieces (Arkham Adventures, Mythos, Events, entrance, gates; seals go only
     on Arkham Adventures, p.3), so those show only in that mode. GoA Skills and Memberships stay in every
     mode: FAQ p.4 restricts only the Luck and Wanderlust skills, OotD p.2 shuffles in Skill cards from
     other expansions, and GoA items grant memberships.
   - Master Mythos cards and the three Grave Consequences decks show only with their module; Relics and
     the scenario sheet show in the Lightless Pyramid or with The Exhibit (OotP p.4).
   ============================================================================= */
window.AID_COMPONENTS = {
  sets: [
    { id: "base", name: "Elder Sign", src: "Base p.2–3", fig: "#cecdbd" },
    { id: "uf", name: "Unseen Forces", src: "Unseen Forces p.1", fig: "#c5c5b2", when: (c) => c.has("uf") },
    { id: "goa", name: "Gates of Arkham", src: "Gates of Arkham p.1", fig: "#d0c9b2", when: (c) => c.has("goa") },
    { id: "ooi", name: "Omens of Ice", src: "Omens of Ice p.1", fig: "#bacec3", when: (c) => c.has("ooi") },
    { id: "gc", name: "Grave Consequences", src: "Grave Consequences card 1/5", fig: "#d6d6c7", when: (c) => c.has("gc") },
    { id: "ootd", name: "Omens of the Deep", src: "Omens of the Deep p.1", fig: "#c3d7d5", when: (c) => c.has("ootd") },
    { id: "ootp", name: "Omens of the Pharaoh", src: "Omens of the Pharaoh p.1", fig: "#c7b79a", when: (c) => c.has("ootp") }
  ],
  items: [
    /* ---- base game (Base p.2 list; pictures p.2–3) ---- */
    { set: "base", name: "Clock", img: "base-clock.webp", w: 266, h: 253 },
    { set: "base", name: "Cardboard clock hand", img: "base-clock-hand.webp", w: 96, h: 182 },
    { set: "base", qty: "1", name: "Plastic connector (for the clock hand)" },
    { set: "base", qty: "6", name: "Green dice", img: "base-green-die.webp", w: 95, h: 111 },
    { set: "base", qty: "1", name: "Yellow die", img: "base-yellow-die.webp", w: 96, h: 114 },
    { set: "base", qty: "1", name: "Red die", img: "base-red-die.webp", w: 105, h: 111 },
    { set: "base", qty: "1", name: "Entrance reference sheet", img: "base-entrance-sheet.webp", w: 273, h: 190,
      when: (c) => c.mode === "museum" && !c.has("uf") },
    { set: "base", qty: "16", name: "Investigator cards", img: "base-investigators.webp", w: 320, h: 178 },
    { set: "base", qty: "8", name: "Ancient One cards", img: "base-ancient-ones.webp", w: 320, h: 174 },
    { set: "base", qty: "48", name: "Adventure cards", img: "base-adventures.webp", w: 251, h: 242,
      when: (c) => c.mode === "museum" },
    { set: "base", qty: "8", name: "Other World Adventure cards", img: "base-other-worlds.webp", w: 279, h: 243 },
    { set: "base", qty: "12", name: "Common Item cards", img: "base-common-items.webp", w: 215, h: 183 },
    { set: "base", qty: "12", name: "Unique Item cards", img: "base-unique-items.webp", w: 212, h: 183 },
    { set: "base", qty: "12", name: "Spell cards", img: "base-spells.webp", w: 215, h: 183 },
    { set: "base", qty: "8", name: "Ally cards", img: "base-allies.webp", w: 227, h: 193 },
    { set: "base", qty: "32", name: "Mythos cards", img: "base-mythos.webp", w: 230, h: 197,
      when: (c) => c.mode === "museum" },
    { set: "base", qty: "16", name: "Investigator markers", img: "base-investigator-markers.webp", w: 123, h: 123 },
    { set: "base", qty: "30", name: "Sanity tokens", img: "base-sanity.webp", w: 105, h: 130 },
    { set: "base", qty: "30", name: "Stamina tokens", img: "base-stamina.webp", w: 114, h: 147 },
    { set: "base", qty: "15", name: "Clue tokens", img: "base-clues.webp", w: 89, h: 148 },
    { set: "base", qty: "22", name: "Monster markers", img: "base-monsters.webp", w: 316, h: 181 },
    { set: "base", qty: "5", name: "Mask monster markers", img: "base-mask-monsters.webp", w: 316, h: 182 },
    { set: "base", qty: "12", name: "Doom tokens", img: "base-doom.webp", w: 123, h: 129 },
    { set: "base", qty: "17", name: "Elder Sign tokens", img: "base-elder-signs.webp", w: 163, h: 166 },

    /* ---- Unseen Forces (p.1; only the new kinds of component are pictured) ---- */
    { set: "uf", qty: "1", name: "White die", img: "uf-white-die.webp", w: 142, h: 133 },
    { set: "uf", qty: "1", name: "Black die", img: "uf-black-die.webp", w: 139, h: 132 },
    { set: "uf", qty: "4", name: "Ancient One cards" },
    { set: "uf", qty: "8", name: "Investigator cards" },
    { set: "uf", qty: "40", name: "Adventure cards", when: (c) => c.mode === "museum" },
    { set: "uf", qty: "2", name: "Other World cards" },
    { set: "uf", qty: "4", name: "Entrance cards", note: "Replace the base game’s entrance sheet (Unseen Forces p.1–2)",
      img: "uf-entrance-cards.webp", w: 268, h: 266, when: (c) => c.mode === "museum" },
    { set: "uf", qty: "8", name: "Replacement cards",
      note: "Always used: they replace the base game’s cards of the same name — 1 Adventure, 4 Other World and 3 Investigator cards (Unseen Forces p.2 · FAQ p.4)" },
    { set: "uf", qty: "8", name: "Blessed/Cursed cards", img: "uf-blessed-cursed.webp", w: 218, h: 205 },
    { set: "uf", qty: "12", name: "Common Item cards" },
    { set: "uf", qty: "12", name: "Unique Item cards" },
    { set: "uf", qty: "12", name: "Spell cards" },
    { set: "uf", qty: "3", name: "Ally cards" },
    { set: "uf", qty: "20", name: "Mythos cards", when: (c) => c.mode === "museum" },
    { set: "uf", qty: "9", name: "Master Mythos cards", note: "Optional: used only with the Master Mythos option (Unseen Forces p.2, p.4)",
      img: "uf-master-mythos.webp", w: 221, h: 233, when: (c) => c.mod("master") },
    { set: "uf", qty: "8", name: "Investigator markers" },
    { set: "uf", qty: "7", name: "Sanity tokens" },
    { set: "uf", qty: "7", name: "Stamina tokens" },
    { set: "uf", qty: "6", name: "Doom tokens" },
    { set: "uf", qty: "12", name: "Monster markers" },
    { set: "uf", qty: "1", name: "Mask monster marker" },
    { set: "uf", qty: "3", name: "Children of Abhoth monster markers", note: "Used only when Abhoth is the Ancient One (Unseen Forces p.1)",
      img: "uf-children-of-abhoth.webp", w: 320, h: 207 },

    /* ---- Gates of Arkham (p.1) ---- */
    { set: "goa", qty: "78", name: "Arkham Adventure cards", note: "Streets of Arkham game mode: they replace the Adventure deck (Gates of Arkham p.2)",
      img: "goa-arkham-adventures.webp", w: 258, h: 285, when: (c) => c.mode === "streets" },
    { set: "goa", qty: "8", name: "Other World cards", note: "Ancient Egypt, Far Side of the Moon and The Vaults of Zin are used only in the Streets of Arkham game mode (FAQ p.4)",
      img: "goa-other-worlds.webp", w: 258, h: 288 },
    { set: "goa", qty: "4", name: "Ancient One cards", img: "goa-ancient-ones.webp", w: 288, h: 233 },
    { set: "goa", qty: "8", name: "Investigator cards", img: "goa-investigators.webp", w: 304, h: 245 },
    { set: "goa", qty: "8", name: "Investigator markers", img: "goa-investigator-markers.webp", w: 221, h: 171 },
    { set: "goa", qty: "8", name: "Membership cards (double-sided)", img: "goa-memberships.webp", w: 185, h: 172 },
    { set: "goa", qty: "30", name: "Mythos cards", note: "Streets of Arkham game mode: they replace the Mythos deck (Gates of Arkham p.2)",
      img: "goa-mythos.webp", w: 190, h: 183, when: (c) => c.mode === "streets" },
    { set: "goa", qty: "5", name: "Common Item cards", img: "goa-common-items.webp", w: 191, h: 184 },
    { set: "goa", qty: "5", name: "Unique Item cards", img: "goa-unique-items.webp", w: 193, h: 190 },
    { set: "goa", qty: "5", name: "Ally cards", img: "goa-allies.webp", w: 199, h: 193, when: (c) => !c.has("ootp") },
    { set: "goa", qty: "5", name: "Ally cards", note: "With Omens of the Pharaoh, the Calvin Wright Ally card is no longer used: its Calvin Wright investigator replaces it (Omens of the Pharaoh p.5)",
      img: "goa-allies.webp", w: 199, h: 193, when: (c) => c.has("ootp") },
    { set: "goa", qty: "5", name: "Spell cards", img: "goa-spells.webp", w: 197, h: 190 },
    { set: "goa", qty: "12", name: "Skill cards", note: "Luck and Wanderlust are used only in the Streets of Arkham game mode (FAQ p.4)",
      img: "goa-skills.webp", w: 197, h: 187 },
    { set: "goa", qty: "25", name: "Event cards", img: "goa-events.webp", w: 205, h: 191, when: (c) => c.mode === "streets" },
    { set: "goa", qty: "1", name: "“Streets of Arkham” entrance card", note: "Replaces the entrance sheet in the Streets of Arkham game mode (Gates of Arkham p.2–3)",
      img: "goa-streets-entrance.webp", w: 270, h: 160, when: (c) => c.mode === "streets" },
    { set: "goa", qty: "6", name: "Gate markers with plastic stands", img: "goa-gate-markers.webp", w: 300, h: 157,
      when: (c) => c.mode === "streets" },
    { set: "goa", qty: "2", name: "Doom tokens", img: "goa-doom.webp", w: 163, h: 136 },
    { set: "goa", qty: "3", name: "Sanity tokens", img: "goa-sanity.webp", w: 163, h: 172 },
    { set: "goa", qty: "3", name: "Stamina tokens", img: "goa-stamina.webp", w: 154, h: 172 },
    { set: "goa", qty: "9", name: "Monster markers", img: "goa-monsters.webp", w: 233, h: 145 },
    { set: "goa", qty: "6", name: "Seal markers", img: "goa-seal-markers.webp", w: 126, h: 136, when: (c) => c.mode === "streets" },

    /* ---- Omens of Ice (p.1) ---- */
    { set: "ooi", qty: "60", name: "Alaskan Adventure cards", note: "Alaska Expedition game mode: they replace the Adventure deck (Omens of Ice p.2)",
      img: "ooi-alaskan-adventures.webp", w: 242, h: 292, when: (c) => c.mode === "alaska" },
    { set: "ooi", qty: "4", name: "Special Adventure cards", img: "ooi-special-adventures.webp", w: 242, h: 292 },
    { set: "ooi", qty: "3", name: "Ancient One cards", img: "ooi-ancient-ones.webp", w: 320, h: 245 },
    { set: "ooi", qty: "8", name: "Investigator cards", img: "ooi-investigators.webp", w: 300, h: 233 },
    { set: "ooi", qty: "1", name: "Reference card", img: "ooi-reference.webp", w: 202, h: 280 },
    { set: "ooi", qty: "30", name: "Alaskan Mythos cards", note: "Alaska Expedition game mode: they replace the Mythos deck (Omens of Ice p.2)",
      img: "ooi-alaskan-mythos.webp", w: 194, h: 205, when: (c) => c.mode === "alaska" },
    { set: "ooi", qty: "5", name: "Common Item cards", img: "ooi-common-items.webp", w: 193, h: 205 },
    { set: "ooi", qty: "5", name: "Unique Item cards", img: "ooi-unique-items.webp", w: 193, h: 205 },
    { set: "ooi", qty: "5", name: "Ally cards", img: "ooi-allies.webp", w: 194, h: 205 },
    { set: "ooi", qty: "5", name: "Spell cards", img: "ooi-spells.webp", w: 194, h: 205 },
    { set: "ooi", qty: "1", name: "“Expedition Camp” entrance card", note: "Replaces the entrance sheet and all other entrance cards in the Alaska Expedition game mode (Omens of Ice p.2–3)",
      img: "ooi-expedition-camp.webp", w: 304, h: 178, when: (c) => c.mode === "alaska" },
    { set: "ooi", qty: "28", name: "Storm markers", img: "ooi-storm-markers.webp", w: 172, h: 143 },
    { set: "ooi", qty: "2", name: "Supply tokens", img: "ooi-supply-tokens.webp", w: 157, h: 119 },
    { set: "ooi", qty: "1", name: "Day token", img: "ooi-day-token.webp", w: 98, h: 102 },
    { set: "ooi", qty: "12", name: "Monster markers", img: "ooi-monsters.webp", w: 291, h: 143 },
    { set: "ooi", qty: "8", name: "Investigator markers", img: "ooi-investigator-markers.webp", w: 159, h: 155 },
    { set: "ooi", qty: "1", name: "Track card", note: "Summer side (more forgiving) or Winter side (more challenging) faceup (Omens of Ice p.2)",
      img: "ooi-track-card.webp", w: 310, h: 179, when: (c) => c.mode === "alaska" },

    /* ---- Grave Consequences (card 1/5): three optional decks ---- */
    { set: "gc", qty: "15", name: "Epitaph cards", img: "gc-epitaph.webp", w: 90, h: 132, when: (c) => c.mod("epitaph") },
    { set: "gc", qty: "20", name: "Epic Battle cards", img: "gc-epic-battle.webp", w: 89, h: 132, when: (c) => c.mod("epicbattle") },
    { set: "gc", qty: "15", name: "Phobia cards", img: "gc-phobia.webp", w: 90, h: 132, when: (c) => c.mod("phobia") },

    /* ---- Omens of the Deep (p.1) ---- */
    { set: "ootd", qty: "60", name: "Pacific Adventure cards", note: "R'lyeh Rising game mode: they replace the Adventure deck (Omens of the Deep p.2)",
      img: "ootd-pacific-adventures.webp", w: 245, h: 293, when: (c) => c.mode === "rlyeh" },
    { set: "ootd", qty: "4", name: "Special Adventure cards", img: "ootd-special-adventures.webp", w: 258, h: 293 },
    { set: "ootd", qty: "3", name: "Ancient One cards", img: "ootd-ancient-ones.webp", w: 320, h: 245 },
    { set: "ootd", qty: "8", name: "Investigator cards", img: "ootd-investigators.webp", w: 291, h: 229 },
    { set: "ootd", qty: "40", name: "Staged Mythos cards", note: "R'lyeh Rising game mode: a Stage I Ocean deck replaces the Mythos deck, with the Stage II R'lyeh deck set aside (Omens of the Deep p.2)",
      img: "ootd-staged-mythos.webp", w: 194, h: 213, when: (c) => c.mode === "rlyeh" },
    { set: "ootd", qty: "12", name: "Skill cards", img: "ootd-skills.webp", w: 194, h: 206 },
    { set: "ootd", qty: "3", name: "Common Item cards", img: "ootd-common-items.webp", w: 193, h: 206 },
    { set: "ootd", qty: "3", name: "Unique Item cards", img: "ootd-unique-items.webp", w: 193, h: 206 },
    { set: "ootd", qty: "3", name: "Ally cards", img: "ootd-allies.webp", w: 193, h: 206 },
    { set: "ootd", qty: "3", name: "Spell cards", img: "ootd-spells.webp", w: 193, h: 206 },
    { set: "ootd", qty: "1", name: "“The Ultima Thule” entrance card", note: "Replaces the entrance sheet and all other entrance cards in the R'lyeh Rising game mode (Omens of the Deep p.2–3)",
      img: "ootd-ultima-thule.webp", w: 298, h: 178, when: (c) => c.mode === "rlyeh" },
    { set: "ootd", qty: "3", name: "Broken amulet tokens", img: "ootd-amulet-tokens.webp", w: 151, h: 129 },
    { set: "ootd", qty: "1", name: "Omen token", img: "ootd-omen-token.webp", w: 111, h: 105 },
    { set: "ootd", qty: "5", name: "Mission markers", img: "ootd-missions.webp", w: 239, h: 120 },
    { set: "ootd", qty: "15", name: "Monster markers", note: "The 15 Deep One Legion monster markers: set aside as the Deep One Legion stockpile, kept separate from the monster cup (Omens of the Deep p.2)",
      img: "ootd-monsters.webp", w: 260, h: 142 },
    { set: "ootd", qty: "8", name: "Investigator markers", img: "ootd-investigator-markers.webp", w: 157, h: 157 },
    { set: "ootd", qty: "1", name: "Scenario card", note: "Two sides: the Dark Waters track and the Amulet of R'lyeh track (Omens of the Deep p.3)",
      img: "ootd-scenario-card.webp", w: 289, h: 180, when: (c) => c.mode === "rlyeh" },

    /* ---- Omens of the Pharaoh (p.1) ---- */
    { set: "ootp", qty: "50", name: "Egyptian Adventure cards", note: "Lightless Pyramid game mode: a Stage I “Cairo” and a Stage II “Dashur” deck replace the Adventure deck (Omens of the Pharaoh p.2)",
      img: "ootp-egyptian-adventures.webp", w: 242, h: 293, when: (c) => c.mode === "pyramid" },
    { set: "ootp", qty: "8", name: "Special Adventure cards", note: "Dark Pharaoh and Hidden Chamber special adventures (Omens of the Pharaoh p.4)",
      img: "ootp-special-adventures.webp", w: 263, h: 293 },
    { set: "ootp", qty: "3", name: "Ancient One cards", img: "ootp-ancient-ones.webp", w: 301, h: 227 },
    { set: "ootp", qty: "6", name: "Investigator cards", img: "ootp-investigators.webp", w: 298, h: 230, when: (c) => !c.has("goa") },
    { set: "ootp", qty: "6", name: "Investigator cards", note: "Calvin Wright replaces the Gates of Arkham Calvin Wright Ally card, which is no longer used (Omens of the Pharaoh p.5)",
      img: "ootp-investigators.webp", w: 298, h: 230, when: (c) => c.has("goa") },
    { set: "ootp", qty: "16", name: "Relic cards", note: "Outside the Lightless Pyramid, used only with The Exhibit (Omens of the Pharaoh p.4)",
      img: "ootp-relics.webp", w: 206, h: 206, when: (c) => c.mode === "pyramid" || c.mod("exhibit") },
    { set: "ootp", qty: "30", name: "Egyptian Mythos cards", note: "Lightless Pyramid game mode: they replace the Mythos deck (Omens of the Pharaoh p.2)",
      img: "ootp-egyptian-mythos.webp", w: 200, h: 215, when: (c) => c.mode === "pyramid" },
    { set: "ootp", qty: "4", name: "Ally cards", img: "ootp-allies.webp", w: 209, h: 206 },
    { set: "ootp", qty: "1", name: "Cairo/Dashur entrance card", note: "Replaces the entrance sheet and all other entrance cards in the Lightless Pyramid game mode (Omens of the Pharaoh p.2–3)",
      img: "ootp-entrance.webp", w: 307, h: 177, when: (c) => c.mode === "pyramid" },
    { set: "ootp", qty: "8", name: "Expedition tokens", img: "ootp-expedition-tokens.webp", w: 160, h: 133 },
    { set: "ootp", qty: "8", name: "Monster markers", note: "Including 7 mask monsters", img: "ootp-monsters.webp", w: 251, h: 135 },
    { set: "ootp", qty: "6", name: "Investigator markers", img: "ootp-investigator-markers.webp", w: 157, h: 160 },
    { set: "ootp", qty: "1", name: "Double-sided scenario sheet", note: "“The Expedition” side is used only in the Lightless Pyramid; “The Exhibit” brings Relics into other game modes (Omens of the Pharaoh p.2, p.4)",
      img: "ootp-scenario-sheet.webp", w: 320, h: 186, when: (c) => c.mode === "pyramid" || c.mod("exhibit") }
  ]
};
