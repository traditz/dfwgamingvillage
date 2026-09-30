/* =============================================================================
   Warcraft: The Board Game — Components glossary data (standard v1; rendered by js/comp-widget.js)
   Sources: Rules p.2 (Components list; pictures on p.2–3) · Expansion p.2 (Components list; pictures
   on p.2–3). Pictures cropped from those pages with comp_crop.py.
   Replacements (Expansion p.2): the Expansion Set's race-coloured Outpost markers and its 120 new
   experience cards replace the base game's, so the base versions are hidden when it is selected.
   Option gating (Expansion p.4–6): hero pieces with Heroes; creeps with Creeps, Heroes or the two
   scenarios built on creeps (Dragon Rise, Battle of the Elements); research tokens with Spell
   research; hidden resource tokens with Hidden resources.
   The rulebooks picture no dice (base) and no Player Reference Sheets (Expansion).
   ============================================================================= */
window.AID_COMPONENTS = {
  sets: [
    { id: "core", name: "Warcraft: The Board Game", src: "Rules p.2–3" },
    { id: "exp", name: "Expansion Set", src: "Expansion p.2–3", when: (c) => c.has("exp") }
  ],
  items: [
    { set: "core", qty: "13", name: "Board pieces",
      note: "Double-sided, cyan and magenta. Pictured: the four races’ Town spaces and the Goldmine, Mountain, Objective and Forest spaces",
      img: "core-board-spaces.webp", w: 320, h: 249 },
    { set: "core", qty: "40", name: "Wooden melee unit markers", note: "10 per race", img: "core-melee.webp", w: 176, h: 172 },
    { set: "core", qty: "28", name: "Wooden ranged unit markers", note: "7 per race", img: "core-ranged.webp", w: 175, h: 135 },
    { set: "core", qty: "16", name: "Wooden flying unit markers", note: "4 per race", img: "core-flying.webp", w: 178, h: 184 },
    { set: "core", qty: "4", name: "Town interfaces", note: "1 per race. Pictured: the Orc Town interface", img: "core-town-interface.webp", w: 320, h: 255 },
    { set: "core", qty: "8", name: "Outpost markers", note: "2 per race", img: "core-outposts.webp", w: 320, h: 106,
      when: (c) => !c.has("exp") },
    { set: "core", qty: "32", name: "Building tiles", note: "8 per race: melee, ranged and flying unit buildings", img: "core-buildings.webp", w: 320, h: 129 },
    { set: "core", qty: "32", name: "Worker markers", note: "8 per race; the worker icon stands for a worker in the rules", img: "core-workers.webp", w: 320, h: 84 },
    { set: "core", qty: "36", name: "Unit tiles", note: "9 per race, for melee, ranged and flying units", img: "core-unit-tiles.webp", w: 320, h: 141 },
    { set: "core", qty: "84", name: "Experience cards", note: "21 per race", img: "core-xp-cards.webp", w: 320, h: 174,
      when: (c) => !c.has("exp") },
    { set: "core", qty: "100", name: "Resource tokens", note: "50 gold, 50 wood", img: "core-resources.webp", w: 294, h: 153 },
    { set: "core", qty: "18", name: "Depletion tokens", note: "Partial on one side, complete on the other", img: "core-depletion.webp", w: 297, h: 153 },
    { set: "core", qty: "14", name: "Quest tokens", note: "For the scenarios: the Scenario Guide names the unit-type tokens, captives, walls, graveyards, Necromancers and Nordrassil (Scenario Guide p.3)", img: "core-quest.webp", w: 320, h: 220 },
    { set: "core", qty: "4", name: "Battle dice" },
    { set: "core", qty: "1", name: "Resource die" },

    { set: "exp", qty: "16", name: "Board pieces", note: "Adds the water space: flying units may pass through it but not end their move there. Pictured: a water space", img: "exp-water.webp", w: 209, h: 239 },
    { set: "exp", qty: "4", name: "Hero building tiles", note: "1 per race", img: "exp-hero-building.webp", w: 193, h: 169,
      when: (c) => c.mod("heroes") },
    { set: "exp", qty: "8", name: "Outpost markers", note: "2 per race, coloured by race; they replace the base game’s Outposts (Expansion p.2)", img: "exp-outposts.webp", w: 166, h: 185 },
    { set: "exp", qty: "4", name: "Wooden hero unit markers", note: "1 per race", img: "exp-hero-marker.webp", w: 108, h: 105,
      when: (c) => c.mod("heroes") },
    { set: "exp", qty: "24", name: "Creep markers", note: "16 level 1 creeps, 8 level 2 creeps. Front: Strength, dice, type and ability; back: experience points",
      img: "exp-creep.webp", w: 233, h: 233,
      when: (c) => c.mod("creeps") || c.mod("heroes") || c.mode === "dragon" || c.mode === "elements" },
    { set: "exp", qty: "27", name: "Summoned creature markers", note: "Border colour shows the race: Human blue, Orc red, Night Elf green, Undead purple",
      img: "exp-summoned.webp", w: 320, h: 180,
      when: (c) => c.mod("heroes") },
    { set: "exp", qty: "8", name: "Research tokens", note: "2 per race", img: "exp-research.webp", w: 157, h: 145,
      when: (c) => c.mod("research") },
    { set: "exp", qty: "48", name: "Hero cards", note: "12 per race: 4 heroes with 3 cards each", img: "exp-hero-card.webp", w: 199, h: 320,
      when: (c) => c.mod("heroes") },
    { set: "exp", qty: "42", name: "Wound tokens", img: "exp-wound.webp", w: 141, h: 159,
      when: (c) => c.mod("heroes") },
    { set: "exp", qty: "120", name: "Experience cards", note: "Each also shows its mana; they replace the base game’s experience cards (Expansion p.2)", img: "exp-xp-cards.webp", w: 320, h: 189 },
    { set: "exp", qty: "54", name: "Resource tokens", note: "9 10-gold, 9 10-wood, 18 5-gold and 18 5-wood tokens", img: "exp-resources.webp", w: 320, h: 70 },
    { set: "exp", qty: "18", name: "Hidden resource tokens", note: "9 mine tokens, 9 forest tokens", img: "exp-hidden.webp", w: 320, h: 89,
      when: (c) => c.mod("hidden") },
    { set: "exp", qty: "6", name: "Quest tokens", note: "Including the Night Elf Tree of Eternity token", img: "exp-quest.webp", w: 320, h: 147 },
    { set: "exp", qty: "4", name: "Player reference sheets", note: "1 per race" }
  ]
};
