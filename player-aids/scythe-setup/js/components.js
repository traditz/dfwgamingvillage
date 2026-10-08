/* =============================================================================
   Scythe — Components glossary data (standard v1; rendered by js/comp-widget.js)
   Sources, with printed page numbers (the Modular Board rules have none, so PDF pages, as elsewhere here):
     Core p.2 (Global Components) and p.3 (Faction Components) · Invaders from Afar p.2 ·
     The Wind Gambit p.2 · Modular Board p.2 (Components box). Pictures cropped from those pages;
     each note cites the page it comes from.
   The Rise of Fenris has no components list: its rulebook keeps its contents hidden for the campaign
   (campaign players must not open or look through its tuckboxes and punchboards, RoF p.2), so it has no set
   here and nothing below names or pictures Rise of Fenris content.
   Faction components are per faction; each row is pictured with one faction's piece (Nordic; Togawa), except
   Invaders' cardboard tokens (both factions' tokens differ, so both are shown) and the core mech and character
   (Saxony: on Core p.3 the Nordic character's spear overlaps the Nordic mech, so neither crops cleanly).
   Pictures leave out the book's "4 x"-style count labels. The airship picture shows 3 of the 7.
   Gating (c = the page's context, see app.js):
     - The Wind Gambit: airship pieces only with the airship module (c.air), resolution tiles only with the
       resolution module (c.res).
     - Modular Board: the board, hex and home base tiles only when playing on it (c.board === "mod"); its 8
       structure bonus tiles in every game (Modular Board p.3).
     - Quick-start cards only with the First game option, as in the setup steps (Core p.9).
     - Spoiler gates: the context carries the page's gate state (c.modOpen, c.camp, c.ep, c.rewards, and
       c.spoil(docKey) = the rulebook search's gate). Only the inactive home base tile uses it: Modular Board p.2
       (step 3b) leaves it out for Rise of Fenris owners, which the Modular board setup step applies only once
       the module gate is open with the new factions in play; the glossary follows that step exactly.
   ============================================================================= */
window.AID_COMPONENTS = {
  sets: [
    { id: "core", name: "Scythe", src: "Core p.2–3" },
    { id: "ifa", name: "Invaders from Afar", src: "Invaders p.2", when: (c) => c.has("ifa") },
    { id: "wg", name: "The Wind Gambit", src: "Wind Gambit p.2", when: (c) => c.has("wg") },
    { id: "mb", name: "Modular Board", src: "Modular Board p.2", when: (c) => c.has("mb") }
  ],
  items: [
    /* ---- Core p.2: global components ---- */
    { set: "core", qty: "1", name: "Quick-reference guide", img: "core-quick-reference.webp", w: 157, h: 205 },
    { set: "core", qty: "5", name: "Player mats", img: "core-player-mats.webp", w: 320, h: 156 },
    { set: "core", qty: "1", name: "Game board", img: "core-game-board.webp", w: 292, h: 224 },
    { set: "core", qty: "80", name: "Resource tokens", note: "20 each of food, metal, wood and oil: wooden, or realistic in the Collector’s and Art Connoisseur Editions", img: "core-resources.webp", w: 319, h: 160 },
    { set: "core", qty: "80", name: "Cardboard coins", img: "core-coins.webp", w: 320, h: 193 },
    { set: "core", qty: "12", name: "Multiplier tokens", note: "Resources are unlimited: use one when you run short (Core p.4, p.13)", img: "core-multipliers.webp", w: 239, h: 125 },
    { set: "core", qty: "12", name: "Encounter tokens", note: "Setup uses 11 on the standard board: one on each encounter symbol (Core p.6)", img: "core-encounter-tokens.webp", w: 135, h: 120 },
    { set: "core", qty: "6", name: "Structure bonus tiles", note: "One drawn at random each game (Core p.6)", img: "core-structure-bonus.webp", w: 282, h: 191 },
    { set: "core", qty: "42", name: "Combat cards (yellow)", img: "core-combat-cards.webp", w: 234, h: 230 },
    { set: "core", qty: "23", name: "Objective cards (beige)", img: "core-objective-cards.webp", w: 320, h: 225 },
    { set: "core", qty: "28", name: "Encounter cards (green)", img: "core-encounter-cards.webp", w: 320, h: 218 },
    { set: "core", qty: "12", name: "Factory cards (purple)", img: "core-factory-cards.webp", w: 233, h: 234 },
    { set: "core", qty: "2", name: "Power Dials", note: "Assemble with the enclosed plastic rivets (Core p.22)", img: "core-power-dials.webp", w: 320, h: 221 },
    { set: "core", qty: "5", name: "Riverwalk cards", note: "One per player: which factions can cross into each home territory once Riverwalk is unlocked (Core p.9)", img: "core-riverwalk-cards.webp", w: 273, h: 175 },
    { set: "core", qty: "5", name: "Quick-start cards", note: "First game: one per player; units on one side, concepts and your first five turns on the other (Core p.9)", img: "core-quick-start.webp", w: 288, h: 187,
      when: (c) => typeof c.opt === "function" && c.opt("firstgame") },
    { set: "core", name: "Promo items", note: "Bought separately: see the note on Core p.32" },

    /* ---- Core p.3: faction components (per faction) ---- */
    { set: "core", qty: "1", name: "Faction Mat", note: "Per faction, in its colour: Nordic blue, Saxony black, Polania white, Crimea yellow, Rusviet red (Nordic pictured)", img: "core-faction-mat.webp", w: 288, h: 126 },
    { set: "core", qty: "1", name: "Action token", note: "Per faction", img: "core-action-token.webp", w: 81, h: 114 },
    { set: "core", qty: "1", name: "Popularity token", note: "Per faction", img: "core-popularity-token.webp", w: 93, h: 82 },
    { set: "core", qty: "1", name: "Power token", note: "Per faction", img: "core-power-token.webp", w: 108, h: 83 },
    { set: "core", qty: "6", name: "Star tokens", note: "Per faction", img: "core-star-tokens.webp", w: 96, h: 85 },
    { set: "core", qty: "4", name: "Structure tokens", note: "Per faction", img: "core-structures.webp", w: 259, h: 146 },
    { set: "core", qty: "4", name: "Recruit tokens", note: "Per faction", img: "core-recruits.webp", w: 82, h: 86 },
    { set: "core", qty: "4", name: "Mech miniatures", note: "Per faction (Saxony pictured)", img: "core-mechs.webp", w: 150, h: 168 },
    { set: "core", qty: "1", name: "Character miniature", note: "Per faction (Saxony pictured)", img: "core-character.webp", w: 190, h: 205 },
    { set: "core", qty: "8", name: "Workers", note: "Per faction", img: "core-workers.webp", w: 79, h: 92 },
    { set: "core", qty: "6", name: "Technology cubes", note: "Per faction", img: "core-tech-cubes.webp", w: 96, h: 97 },

    /* ---- Invaders from Afar p.2 (counts only where printed) ---- */
    { set: "ifa", name: "Box", img: "ifa-box.webp", w: 270, h: 122 },
    { set: "ifa", name: "Punchboard", note: "Includes the Crimea and Polania ability tokens for 6–7 players (Invaders p.3)", img: "ifa-punchboard.webp", w: 215, h: 119 },
    { set: "ifa", qty: "2", name: "Player mats", note: "Numbered 2a and 3a; shuffled in for every game (Invaders p.1, p.3)", img: "ifa-player-mats.webp", w: 201, h: 82 },
    { set: "ifa", qty: "2", name: "Plastic bags" },
    { set: "ifa", qty: "1", name: "Custom plastic insert" },
    { set: "ifa", name: "Faction Mat", note: "Per faction: Togawa purple, Albion green; mixed in for every game (Invaders p.1). Togawa pictured", img: "ifa-faction-mat.webp", w: 230, h: 97 },
    { set: "ifa", name: "Action token", note: "Per faction", img: "ifa-action-token.webp", w: 78, h: 99 },
    { set: "ifa", name: "Popularity token", note: "Per faction", img: "ifa-popularity-token.webp", w: 87, h: 78 },
    { set: "ifa", name: "Power token", note: "Per faction", img: "ifa-power-token.webp", w: 99, h: 77 },
    { set: "ifa", qty: "6", name: "Star tokens", note: "Per faction", img: "ifa-star-tokens.webp", w: 82, h: 80 },
    { set: "ifa", name: "Structure tokens", note: "Per faction", img: "ifa-structures.webp", w: 193, h: 123 },
    { set: "ifa", qty: "4", name: "Recruit tokens", note: "Per faction", img: "ifa-recruits.webp", w: 77, h: 87 },
    { set: "ifa", qty: "4", name: "Mech miniatures", note: "Per faction", img: "ifa-mechs.webp", w: 97, h: 112 },
    { set: "ifa", name: "Character miniature", note: "Per faction", img: "ifa-character.webp", w: 144, h: 126 },
    { set: "ifa", qty: "8", name: "Workers", note: "Per faction", img: "ifa-workers.webp", w: 78, h: 74 },
    { set: "ifa", qty: "6", name: "Technology cubes", note: "Per faction", img: "ifa-tech-cubes.webp", w: 66, h: 71 },
    { set: "ifa", name: "Cardboard tokens", note: "Togawa: 4 Trap tokens, armed and disarmed sides (Invaders p.6). Albion: 4 Flag tokens (Invaders p.4)", img: "ifa-cardboard-tokens.webp", w: 320, h: 91 },

    /* ---- The Wind Gambit p.2 ---- */
    { set: "wg", qty: "1", name: "Achievement sheet", img: "wg-achievement-sheet.webp", w: 189, h: 304 },
    { set: "wg", qty: "1", name: "Box", img: "wg-box.webp", w: 320, h: 175 },
    { set: "wg", qty: "8", name: "Resolution tiles", note: "Resolution module: draw 1 at random; it decides when and how the game ends (Wind Gambit p.6)", img: "wg-resolution-tiles.webp", w: 320, h: 183,
      when: (c) => !!c.res && !c.camp },
    { set: "wg", qty: "8", name: "Resolution tiles", note: "Campaign: use only the Doomsday Clock or Backup Plan tile (Rise of Fenris p.24)", img: "wg-resolution-tiles.webp", w: 320, h: 183,
      when: (c) => !!c.res && !!c.camp },
    { set: "wg", qty: "16", name: "Airship tiles", note: "Aggressive (red) and passive (green), with different backs: reveal 1 of each (Wind Gambit p.3)", img: "wg-airship-tiles.webp", w: 320, h: 231,
      when: (c) => !!c.air },
    { set: "wg", qty: "7", name: "Airship miniatures", note: "Each player takes the one in their faction’s colour (Wind Gambit p.3). 3 of the 7 pictured", img: "wg-airships.webp", w: 256, h: 320,
      when: (c) => !!c.air },
    { set: "wg", qty: "7", name: "Clear plastic stands", when: (c) => !!c.air },

    /* ---- Modular Board p.2 (PDF page) ---- */
    { set: "mb", name: "Double-sided board", img: "mb-board.webp", w: 239, h: 181, when: (c) => c.board === "mod" },
    { set: "mb", qty: "4", name: "Double-sided hex tiles", img: "mb-hex-tiles.webp", w: 320, h: 85, when: (c) => c.board === "mod" },
    { set: "mb", qty: "7", name: "Home base tiles", img: "mb-home-bases.webp", w: 320, h: 58, when: (c) => c.board === "mod" },
    { set: "mb", qty: "1", name: "Inactive home base tile", img: "mb-inactive-base.webp", w: 111, h: 105,
      when: (c) => c.board === "mod" && !(c.modOpen && typeof c.act === "function" && (c.act("vesna") || c.act("fenris"))) },
    { set: "mb", qty: "8", name: "Structure bonus tiles", note: "Shuffled in with the core tiles for every game, on either board (Modular Board p.3)", img: "mb-structure-bonus.webp", w: 320, h: 194 }
  ]
};
