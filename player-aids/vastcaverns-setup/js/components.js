/* =============================================================================
   Vast: The Crystal Caverns — Components glossary data (standard v1.1; rendered by js/comp-widget.js)
   Sources: Rules p.3 (Components, by role, plus Extras) · Ghost p.1 · Ghoul p.1 · Unicorn p.1 (Components).
   Pictures cropped from those pages. Each role's pieces show only while that role is in play; the Dragon die,
   Cave tiles, Crystal and Treasure tokens are used in every game. Extras appear with the variant that uses them.
   * = the rulebook's "same quantity wooden version included"; † = "plastic gems included".
   ============================================================================= */
window.AID_COMPONENTS = {
  sets: [
    { id: "core", name: "Vast: The Crystal Caverns", src: "Rules p.3", fig: "#fefefe" },
    { id: "ghost", name: "The Fearsome Foes — Ghost", src: "Ghost p.1", fig: "#c7c9dd", when: (c) => c.has("ffghost") || c.mod("crowdedcard") },
    { id: "ghoul", name: "The Fearsome Foes — Ghoul", src: "Ghoul p.1", fig: "#fad9c4", when: (c) => c.has("ffghoul") },
    { id: "unicorn", name: "The Fearsome Foes — Unicorn", src: "Unicorn p.1", fig: "#c2b2b0", when: (c) => c.has("ffunicorn") }
  ],
  items: [
    /* the Knight */
    { set: "core", qty: "1", name: "Knight board", img: "core-knight-board.webp", w: 320, h: 249, when: (c) => c.has("knight") },
    { set: "core", qty: "3", name: "Bomb tokens", img: "core-bomb-tokens.webp", w: 99, h: 95, when: (c) => c.has("knight") },
    { set: "core", qty: "7", name: "Hero cubes (yellow)", img: "core-hero-cubes.webp", w: 74, h: 41, when: (c) => c.has("knight") },
    { set: "core", qty: "10", name: "Sidequest cards", img: "core-sidequests.webp", w: 320, h: 132, when: (c) => c.has("knight") },
    { set: "core", qty: "1", name: "Knight piece", note: "Same quantity wooden version included", img: "core-knight-piece.webp", w: 99, h: 135, when: (c) => c.has("knight") },
    { set: "core", qty: "2", name: "Health & Grit markers (red)", note: "Shown on the Knight board", img: "core-health-grit-markers.webp", w: 80, h: 81, when: (c) => c.has("knight") },
    /* the Goblins */
    { set: "core", qty: "1", name: "Goblin board", img: "core-goblin-board.webp", w: 320, h: 255, when: (c) => c.has("goblins") },
    { set: "core", qty: "12", name: "Goblin discs (green)", img: "core-goblin-discs.webp", w: 320, h: 116, when: (c) => c.has("goblins") },
    { set: "core", qty: "4", name: "Strength discs (red)", img: "core-strength-discs.webp", w: 120, h: 126, when: (c) => c.has("goblins") },
    { set: "core", qty: "10", name: "War cards", img: "core-war-cards.webp", w: 114, h: 160, when: (c) => c.has("goblins") },
    { set: "core", qty: "10", name: "Monster cards", note: "Their bottom Ambush text is used only with the Goblin Infestation card, when no one plays the Goblins (FAQ p.11)", img: "core-monster-cards.webp", w: 114, h: 147, when: (c) => c.has("goblins") || c.mod("inf") },
    { set: "core", qty: "10", name: "Secrets cards", img: "core-secrets-cards.webp", w: 114, h: 151, when: (c) => c.has("goblins") },
    { set: "core", qty: "3", name: "Goblin Tribe pieces", note: "Fangs, Bones and Eye. Same quantity wooden version included", img: "core-tribe-pieces.webp", w: 318, h: 81, when: (c) => c.has("goblins") },
    { set: "core", qty: "1", name: "Rage token", note: "Shown on the Goblin board", img: "core-rage-token.webp", w: 89, h: 87, when: (c) => c.has("goblins") },
    /* the Dragon */
    { set: "core", qty: "1", name: "Dragon board", img: "core-dragon-board.webp", w: 320, h: 247, when: (c) => c.has("dragon") },
    { set: "core", qty: "1", name: "Shriek token", img: "core-shriek-token.webp", w: 66, h: 65, when: (c) => c.has("dragon") },
    { set: "core", qty: "1", name: "Flamewall token", note: "Same quantity wooden version included", img: "core-flamewall-token.webp", w: 80, h: 74, when: (c) => c.has("dragon") },
    { set: "core", qty: "1", name: "Dragon die", note: "Listed with the Dragon; various effects make other players roll it too (Rules p.5)", img: "core-dragon-die.webp", w: 53, h: 56 },
    { set: "core", qty: "18", name: "Power cards", img: "core-power-cards.webp", w: 320, h: 135, when: (c) => c.has("dragon") },
    { set: "core", qty: "2", name: "Dragon pieces (Slumbering/Awakened)", note: "Same quantity wooden version included", img: "core-dragon-pieces.webp", w: 319, h: 150, when: (c) => c.has("dragon") },
    { set: "core", qty: "14", name: "Sloth cubes (dark red)", note: "Shown on the Dragon board: Greed 4, Hunger 4, Pride 4 + 1 + 1", img: "core-sloth-cubes.webp", w: 320, h: 181, when: (c) => c.has("dragon") },
    { set: "core", qty: "1", name: "Eaten Goblins marker (green)", note: "Shown on the Dragon board", img: "core-eaten-goblins-marker.webp", w: 68, h: 72, when: (c) => c.has("dragon") },
    { set: "core", qty: "1", name: "Health marker (red)", note: "Shown on the Dragon board", img: "core-dragon-health-marker.webp", w: 74, h: 77, when: (c) => c.has("dragon") },
    { set: "core", qty: "3", name: "Dragon Gem tokens", note: "Shown on the Dragon board", img: "core-dragon-gems.webp", w: 111, h: 105, when: (c) => c.has("dragon") },
    /* the Cave */
    { set: "core", qty: "1", name: "Cave board", img: "core-cave-board.webp", w: 320, h: 249, when: (c) => c.has("cave") },
    { set: "core", qty: "52", name: "Cave tiles", note: "15 Ambush, 9 Crystal, 15 Event, 6 Treasure Room, 6 Vault, 1 Entrance (Rules p.2)", img: "core-cave-tiles.webp", w: 320, h: 81 },
    { set: "core", qty: "36", name: "Omen tokens + draw bag", img: "core-omen-tokens.webp", w: 264, h: 285, when: (c) => c.has("cave") || c.has("caveghost") },
    { set: "core", qty: "9", name: "Crystal tokens", note: "Plastic gems included", img: "core-crystal-tokens.webp", w: 89, h: 72 },
    { set: "core", qty: "12", name: "Treasure tokens", note: "10 are used without a Thief (Rules p.12). Same quantity wooden version included", img: "core-treasure-tokens.webp", w: 72, h: 69 },
    { set: "core", qty: "3", name: "Rockslide tokens", note: "Same quantity wooden version included", img: "core-rockslide-tokens.webp", w: 80, h: 63, when: (c) => c.has("cave") || c.has("caveghost") },
    { set: "core", qty: "10", name: "Event tokens", note: "Left in the box when there's no Knight (Rules p.12)", img: "core-event-tokens.webp", w: 56, h: 55, when: (c) => c.has("knight") },
    { set: "core", qty: "15", name: "Event cards", img: "core-event-cards.webp", w: 120, h: 178, when: (c) => c.has("knight") },
    { set: "core", qty: "7", name: "Treasure cards", img: "core-treasure-cards.webp", w: 120, h: 169, when: (c) => c.has("knight") },
    { set: "core", qty: "1", name: "Cave Reference card", note: "Replaced by Alone in the Dark in solo games (Rules p.18), except solo against the Shadow Unicorn (Unicorn p.5)", img: "core-cave-reference.webp", w: 120, h: 163, when: (c) => !c.mod("solo") || c.mod("shadow") },
    /* the Thief */
    { set: "core", qty: "1", name: "Thief board", img: "core-thief-board.webp", w: 320, h: 253, when: (c) => c.has("thief") },
    { set: "core", qty: "3", name: "Stat tokens", img: "core-stat-tokens.webp", w: 150, h: 65, when: (c) => c.has("thief") },
    { set: "core", qty: "1", name: "Action die", img: "core-action-die.webp", w: 53, h: 56, when: (c) => c.has("thief") },
    { set: "core", qty: "6", name: "Vault tokens", note: "Same quantity wooden version included", img: "core-vault-tokens.webp", w: 108, h: 102, when: (c) => c.has("thief") },
    { set: "core", qty: "5", name: "Action cubes", img: "core-action-cubes.webp", w: 111, h: 74, when: (c) => c.has("thief") },
    { set: "core", qty: "1", name: "Thief piece", note: "Same quantity wooden version included", img: "core-thief-piece.webp", w: 132, h: 126, when: (c) => c.has("thief") },
    { set: "core", qty: "1", name: "Loot Drop token", note: "Shown on the Thief board", img: "core-loot-drop-token.webp", w: 93, h: 91, when: (c) => c.has("thief") },
    /* Extras */
    { set: "core", qty: "8", name: "Terrain tiles", note: "Canyon, Lake, Magma, Mushroom Forest, 3 Pits, River (Rules p.16)", img: "core-terrain-tiles.webp", w: 218, h: 206, when: (c) => c.mod("terrain") },
    { set: "core", qty: "2", name: "Monster tokens", note: "Ogre and Troll, used with Goblin Infestation (Rules p.17–18 · FAQ p.11–12)", img: "core-monster-tokens.webp", w: 87, h: 99, when: (c) => c.mod("inf") },
    { set: "core", qty: "5", name: "Role Variant cards", note: "Flare, Past Plunder, Goblin Infestation, Ash Dragon, Alone in the Dark (Rules p.17–18)", img: "core-role-variant-cards.webp", w: 117, h: 160, when: (c) => c.mod("varcards") },
    { set: "core", qty: "25", name: "Difficulty Variant cards", note: "Five levels for each base role (Rules p.19)", img: "core-difficulty-cards.webp", w: 117, h: 160, when: (c) => c.mod("diffcore") },

    /* Fearsome Foes — Ghost */
    { set: "ghost", qty: "3", name: "Ghost pieces (standee, meeple, miniature)", img: "ghost-pieces.webp", w: 263, h: 129, when: (c) => c.has("ffghost") },
    { set: "ghost", qty: "1", name: "Ghost board", img: "ghost-board.webp", w: 320, h: 247, when: (c) => c.has("ghost") },
    { set: "ghost", qty: "1", name: "Cave Ghost board", img: "ghost-caveghost-board.webp", w: 320, h: 65, when: (c) => c.has("caveghost") },
    { set: "ghost", qty: "9", name: "Possession cards", img: "ghost-possession-cards.webp", w: 114, h: 154, when: (c) => c.has("ffghost") },
    { set: "ghost", qty: "6", name: "Artifact tokens", note: "Left in the box with the Cave Ghost (Ghost p.6)", img: "ghost-artifacts.webp", w: 245, h: 105, when: (c) => c.has("ghost") },
    { set: "ghost", qty: "6", name: "Ghost tiles", img: "ghost-tiles.webp", w: 111, h: 111, when: (c) => c.has("ffghost") },
    { set: "ghost", qty: "1", name: "Focus cube", img: "ghost-focus-cube.webp", w: 38, h: 41, when: (c) => c.has("ghost") },
    { set: "ghost", qty: "5", name: "Difficulty Variant cards", img: "ghost-difficulty-cards.webp", w: 114, h: 154, when: (c) => c.mod("diffghost") },
    { set: "ghost", qty: "1", name: "Reference card (“Blocking the Ghost”)", img: "ghost-reference-card.webp", w: 114, h: 154, when: (c) => c.has("ghost") },
    { set: "ghost", qty: "1", name: "Variant card (“Crowded House”)", img: "ghost-crowded-house.webp", w: 114, h: 154, when: (c) => c.mod("crowdedcard") },

    /* Fearsome Foes — Ghoul */
    { set: "ghoul", qty: "3", name: "Ghoul pieces (standee, meeple, miniature)", img: "ghoul-pieces.webp", w: 282, h: 142 },
    { set: "ghoul", qty: "1", name: "Ghoul board", img: "ghoul-board.webp", w: 320, h: 247, when: (c) => c.has("ghoul") },
    { set: "ghoul", qty: "1", name: "Vile Ghoul board", img: "ghoul-vile-board.webp", w: 320, h: 57, when: (c) => c.has("vileghoul") },
    { set: "ghoul", qty: "3", name: "Ghoul dice", img: "ghoul-dice.webp", w: 96, h: 77 },
    { set: "ghoul", qty: "13", name: "Terror cards", img: "ghoul-terror-cards.webp", w: 114, h: 154 },
    { set: "ghoul", qty: "9", name: "Ghoul discs", img: "ghoul-discs.webp", w: 123, h: 84 },
    { set: "ghoul", qty: "1", name: "Fury cube", note: "Not used by the Vile Ghoul (Ghoul p.7)", img: "ghoul-fury-cube.webp", w: 38, h: 38, when: (c) => c.has("ghoul") },
    { set: "ghoul", qty: "5", name: "Difficulty Variant cards", img: "ghoul-difficulty-cards.webp", w: 114, h: 154, when: (c) => c.mod("diffghoul") },
    { set: "ghoul", qty: "1", name: "Ghoul Reference card (“Attacking the Ghoul”)", img: "ghoul-reference-card.webp", w: 114, h: 154 },

    /* Fearsome Foes — Unicorn */
    { set: "unicorn", qty: "3", name: "Unicorn pieces (standee, meeple, miniature)", img: "unicorn-pieces.webp", w: 320, h: 138 },
    { set: "unicorn", qty: "24", name: "Unicorn cards", img: "unicorn-cards.webp", w: 114, h: 153 },
    { set: "unicorn", qty: "1", name: "Nightmare Unicorn board", img: "unicorn-nightmare-board.webp", w: 320, h: 248, when: (c) => c.has("unicorn") },
    { set: "unicorn", qty: "1", name: "Shadow Unicorn board", img: "unicorn-shadow-board.webp", w: 320, h: 81, when: (c) => c.mod("shadow") },
    { set: "unicorn", qty: "2", name: "Tracking cubes", img: "unicorn-tracking-cubes.webp", w: 71, h: 41 },
    { set: "unicorn", qty: "21", name: "Unicorn cubes", img: "unicorn-cubes.webp", w: 138, h: 71 },
    { set: "unicorn", qty: "5", name: "Difficulty Variant cards", img: "unicorn-difficulty-cards.webp", w: 114, h: 153, when: (c) => c.mod("diffunicorn") },
    { set: "unicorn", qty: "1", name: "Unicorn Reference card (“Attacking the Unicorn”)", img: "unicorn-reference-card.webp", w: 114, h: 153 }
  ]
};
