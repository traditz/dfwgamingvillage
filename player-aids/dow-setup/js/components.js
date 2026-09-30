/* =============================================================================
   Dead of Winter — Components glossary data (standard format v1; rendered by js/comp-widget.js)
   Sources: Rulebook p.2 (Components list) and p.2–5 (card anatomy, Additional Components, Game Board)
   · Long Night rules p.2 (Components list) and p.2–5 · WC rulebook p.2 (Components list), p.3
   (New Components) and p.6 (Collection List). Pictures are cropped from those pages, with the card-anatomy
   callout numbers removed; items those pages don't picture have none.
   Gating (page context from app.js ctx()):
   - Long Night modules: Improvements, Bandits and Raxxon components only with their module
     (Long Night rules p.17–18). Remove mature crossroads hides the Adult Only crossroads cards.
   - Co-op / 2 players (c.coopRules): no secret objectives are assigned and no one is exiled, so the
     secret, betrayal and exiled objective cards are left out (Rulebook p.15).
   - Warring Colonies variant (c.wc) follows the Collection List (WC rulebook p.6): from Dead of Winter
     the board, standees, dice, survivor and item cards, non-betrayal objectives except Justice and the
     named crossroads; from The Long Night the board, location boards except Raxxon and Bandit Hideout,
     dice, all tokens except the Improvements module's, standees, survivor cards, starter item cards
     only, non-betrayal objectives except Us or Them and the named crossroads. So the base game's
     location cards and tokens are left out, and the Warring Colonies main objectives, reference sheets
     and crisis deck are used instead of the other sets' (p.4, p.6). No betrayal objectives and no
     exile vote (p.4, p.9). The first player tokens serve as the colony leader tokens (p.4). Variant-only
     WC components appear only in the variant; Lone Wolf components only with a Lone Wolf (c.loneWolf).
   - Standard games with Warring Colonies: its crosshairs-marked cards are only for the variant (p.2).
   ============================================================================= */
window.AID_COMPONENTS = {
  sets: [
    { id: "base", name: "Dead of Winter: A Crossroads Game", src: "Rulebook p.2–5", when: (c) => c.has("base") },
    { id: "longnight", name: "Dead of Winter: The Long Night", src: "Long Night rules p.2–5", when: (c) => c.has("longnight") },
    { id: "wc", name: "Dead of Winter: Warring Colonies", src: "WC rulebook p.2–3", when: (c) => c.has("wc") }
  ],
  items: [
    /* ---- Dead of Winter: A Crossroads Game (Rulebook p.2) ---- */
    { set: "base", qty: "10", name: "Dual-sided main objective cards", img: "base-main-objective.webp", w: 257, h: 320, when: (c) => !c.wc },
    { set: "base", qty: "24", name: "Secret objective cards", img: "base-secret-objective.webp", w: 320, h: 253, when: (c) => !c.wc && !c.coopRules },
    { set: "base", qty: "24", name: "Secret objective cards", note: "Warring Colonies variant: all except Justice (WC rulebook p.6)", img: "base-secret-objective.webp", w: 320, h: 253, when: (c) => c.wc },
    { set: "base", qty: "10", name: "Betrayal secret objective cards", when: (c) => !c.wc && !c.coopRules },
    { set: "base", qty: "10", name: "Exiled secret objective cards", when: (c) => !c.wc && !c.coopRules },
    { set: "base", qty: "30", name: "Survivor cards", img: "base-survivor.webp", w: 298, h: 320, when: (c) => !c.wc },
    { set: "base", qty: "30", name: "Survivor cards", note: "Warring Colonies variant: you may remove Anneleigh Chan (WC rulebook p.6)", img: "base-survivor.webp", w: 298, h: 320, when: (c) => c.wc },
    { set: "base", qty: "5", name: "Player reference sheets", img: "base-player-ref.webp", w: 320, h: 206, when: (c) => !c.wc },
    { set: "base", qty: "1", name: "First player token", img: "base-first-player.webp", w: 88, h: 320, when: (c) => !c.wc },
    { set: "base", qty: "1", name: "First player token", note: "In the Warring Colonies variant the first player tokens serve as the colony leader tokens (WC rulebook p.4)", img: "base-first-player.webp", w: 88, h: 320, when: (c) => c.wc },
    { set: "base", qty: "25", name: "Starting item cards" },
    { set: "base", qty: "20", name: "Police Station item deck cards", img: "base-item-police.webp", w: 296, h: 320 },
    { set: "base", qty: "20", name: "Grocery Store item deck cards" },
    { set: "base", qty: "20", name: "School item deck cards" },
    { set: "base", qty: "20", name: "Gas Station item deck cards" },
    { set: "base", qty: "20", name: "Library item deck cards" },
    { set: "base", qty: "20", name: "Hospital item deck cards" },
    { set: "base", qty: "20", name: "Crisis cards", img: "base-crisis.webp", w: 292, h: 320, when: (c) => !c.wc },
    { set: "base", qty: "80", name: "Crossroads cards", note: "Some have mature themes and carry the mature symbol; players may remove them before the game (Rulebook p.4)", img: "base-crossroads.webp", w: 300, h: 320, when: (c) => !c.wc },
    { set: "base", qty: "80", name: "Crossroads cards", note: "Warring Colonies variant: only the ones named on the Collection List, as optional (recommended) extras (WC rulebook p.6–7)", img: "base-crossroads.webp", w: 300, h: 320, when: (c) => c.wc },
    { set: "base", qty: "25", name: "Wound tokens", note: "One side is a regular wound, the other a frostbite wound (Rulebook p.4)", img: "base-wound.webp", w: 126, h: 233, when: (c) => !c.wc },
    { set: "base", qty: "20", name: "Helpless survivor tokens", img: "base-helpless.webp", w: 123, h: 133, when: (c) => !c.wc },
    { set: "base", qty: "20", name: "Food tokens", img: "base-food.webp", w: 114, h: 135, when: (c) => !c.wc },
    { set: "base", qty: "20", name: "Noise tokens", img: "base-noise.webp", w: 117, h: 126, when: (c) => !c.wc },
    { set: "base", qty: "20", name: "Barricade tokens", img: "base-barricade.webp", w: 123, h: 129, when: (c) => !c.wc },
    { set: "base", qty: "6", name: "Starvation tokens", img: "base-starvation.webp", w: 114, h: 132, when: (c) => !c.wc },
    { set: "base", qty: "2", name: "Track markers" },
    { set: "base", qty: "30", name: "Zombie standees", img: "base-zombie-standee.webp", w: 136, h: 320 },
    { set: "base", qty: "30", name: "Zombie tokens", note: "Use if you run out of standees (Rulebook p.2)", when: (c) => !c.wc },
    { set: "base", qty: "30", name: "Survivor standees", img: "base-survivor-standee.webp", w: 115, h: 320 },
    { set: "base", qty: "60", name: "Plastic standee stands" },
    { set: "base", qty: "1", name: "Colony board", img: "base-colony-board.webp", w: 320, h: 189 },
    { set: "base", qty: "6", name: "Location cards", img: "base-location.webp", w: 197, h: 320, when: (c) => !c.wc },
    { set: "base", qty: "30", name: "Action dice", img: "base-action-dice.webp", w: 111, h: 199 },
    { set: "base", qty: "1", name: "Exposure die", img: "base-exposure-die.webp", w: 151, h: 166 },

    /* ---- Dead of Winter: The Long Night (Long Night rules p.2) ---- */
    { set: "longnight", qty: "8", name: "Dual-sided main objective cards", img: "ln-main-objective.webp", w: 256, h: 320, when: (c) => !c.wc },
    { set: "longnight", qty: "24", name: "Secret objective cards", img: "ln-secret-objective.webp", w: 320, h: 253, when: (c) => !c.wc && !c.coopRules },
    { set: "longnight", qty: "24", name: "Secret objective cards", note: "Warring Colonies variant: all except Us or Them (WC rulebook p.6)", img: "ln-secret-objective.webp", w: 320, h: 253, when: (c) => c.wc },
    { set: "longnight", qty: "11", name: "Betrayal secret objective cards", when: (c) => !c.wc && !c.coopRules },
    { set: "longnight", qty: "5", name: "Exiled secret objective cards", when: (c) => !c.wc && !c.coopRules },
    { set: "longnight", qty: "20", name: "Survivor cards", img: "ln-survivor.webp", w: 295, h: 320, when: (c) => !c.wc },
    { set: "longnight", qty: "20", name: "Survivor cards", note: "Warring Colonies variant: you may remove Blue, Melissa Gupta and Jamie Gilmour (WC rulebook p.6)", img: "ln-survivor.webp", w: 295, h: 320, when: (c) => c.wc },
    { set: "longnight", qty: "5", name: "Player reference sheets", img: "ln-player-ref.webp", w: 320, h: 207, when: (c) => !c.wc },
    { set: "longnight", qty: "1", name: "First player token", img: "ln-first-player.webp", w: 88, h: 320, when: (c) => !c.wc },
    { set: "longnight", qty: "1", name: "First player token", note: "In the Warring Colonies variant the first player tokens serve as the colony leader tokens (WC rulebook p.4)", img: "ln-first-player.webp", w: 88, h: 320, when: (c) => c.wc },
    { set: "longnight", qty: "25", name: "Starting item cards" },
    { set: "longnight", qty: "20", name: "Police Station item deck cards", img: "ln-item-police.webp", w: 271, h: 320, when: (c) => !c.wc },
    { set: "longnight", qty: "20", name: "Grocery Store item deck cards", when: (c) => !c.wc },
    { set: "longnight", qty: "20", name: "School item deck cards", when: (c) => !c.wc },
    { set: "longnight", qty: "20", name: "Gas Station item deck cards", when: (c) => !c.wc },
    { set: "longnight", qty: "20", name: "Library item deck cards", when: (c) => !c.wc },
    { set: "longnight", qty: "20", name: "Hospital item deck cards", when: (c) => !c.wc },
    { set: "longnight", qty: "20", name: "Raxxon item deck cards", note: "Raxxon module (Long Night rules p.18)", when: (c) => c.mod("raxxon") },
    { set: "longnight", qty: "22", name: "Crisis cards", img: "ln-crisis.webp", w: 291, h: 320, when: (c) => !c.wc },
    { set: "longnight", qty: "10", name: "Improvement cards", note: "Improvements module (Long Night rules p.17)", when: (c) => c.mod("improvements") },
    { set: "longnight", qty: "12", name: "Raxxon experiment cards", note: "Raxxon module (Long Night rules p.18)", when: (c) => c.mod("raxxon") },
    { set: "longnight", qty: "6", name: "Raxxon pill side effect cards", note: "Raxxon module (Long Night rules p.18)", when: (c) => c.mod("raxxon") },
    { set: "longnight", qty: "61", name: "Crossroads cards", img: "ln-crossroads.webp", w: 297, h: 320, when: (c) => !c.wc },
    { set: "longnight", qty: "61", name: "Crossroads cards", note: "Warring Colonies variant: only the ones named on the Collection List, as optional (recommended) extras (WC rulebook p.6–7)", img: "ln-crossroads.webp", w: 297, h: 320, when: (c) => c.wc },
    { set: "longnight", qty: "9", name: "Adult only crossroads cards", note: "Players may remove mature-themed crossroads cards before the game (Long Night rules p.4, p.6)", when: (c) => !c.wc && !c.mod("mature") },
    { set: "longnight", qty: "9", name: "Adult only crossroads cards", note: "Warring Colonies variant: only the ones named on the Collection List, as optional (recommended) extras (WC rulebook p.6–7)", when: (c) => c.wc && !c.mod("mature") },
    { set: "longnight", qty: "25", name: "Wound tokens", note: "One side is a regular wound, the other a frostbite wound (Long Night rules p.4)", img: "ln-wound.webp", w: 123, h: 230 },
    { set: "longnight", qty: "20", name: "Helpless survivor tokens", note: "One side is a normal helpless survivor, the other an unruly helpless survivor (Long Night rules p.4)", img: "ln-helpless.webp", w: 136, h: 217 },
    { set: "longnight", qty: "20", name: "Food tokens", img: "ln-food.webp", w: 110, h: 135 },
    { set: "longnight", qty: "20", name: "Noise tokens", img: "ln-noise.webp", w: 132, h: 203 },
    { set: "longnight", qty: "20", name: "Barricade tokens", note: "One side is a normal barricade, the other an explosive trap (Long Night rules p.4)", img: "ln-barricade.webp", w: 132, h: 194 },
    { set: "longnight", qty: "6", name: "Starvation tokens", img: "ln-starvation.webp", w: 117, h: 139 },
    { set: "longnight", qty: "20", name: "Bandit standees", note: "Bandits module (Long Night rules p.17)", when: (c) => c.mod("bandits") },
    { set: "longnight", qty: "2", name: "Track markers" },
    { set: "longnight", qty: "30", name: "Zombie standees", img: "ln-zombie-standee.webp", w: 137, h: 320 },
    { set: "longnight", qty: "19", name: "Raxxon experiment standees", note: "Raxxon module: its special zombies (Long Night rules p.18)", when: (c) => c.mod("raxxon") },
    { set: "longnight", qty: "20", name: "Zombie tokens", note: "Use if you run out of standees (Long Night rules p.2)" },
    { set: "longnight", qty: "20", name: "Survivor standees", img: "ln-survivor-standee.webp", w: 114, h: 320 },
    { set: "longnight", qty: "100", name: "Plastic standee stands" },
    { set: "longnight", qty: "1", name: "Colony board", img: "ln-colony-board.webp", w: 320, h: 190 },
    { set: "longnight", qty: "9", name: "Location cards", note: "Raxxon and the Bandits’ Hideout are added only with their modules (Long Night rules p.6, p.17–18)", img: "ln-location.webp", w: 186, h: 320, when: (c) => !c.wc },
    { set: "longnight", qty: "9", name: "Location cards", note: "Warring Colonies variant: all except Raxxon and the Bandit Hideout (WC rulebook p.6)", img: "ln-location.webp", w: 186, h: 320, when: (c) => c.wc },
    { set: "longnight", qty: "30", name: "Action dice", img: "ln-action-dice.webp", w: 117, h: 209 },
    { set: "longnight", qty: "1", name: "Exposure die", img: "ln-exposure-die.webp", w: 130, h: 138 },
    { set: "longnight", qty: "12", name: "Despair tokens", img: "ln-despair.webp", w: 132, h: 139 },
    { set: "longnight", qty: "12", name: "Advancement tokens", note: "Improvements module (Long Night rules p.17)", img: "ln-advancement.webp", w: 130, h: 132, when: (c) => c.mod("improvements") },
    { set: "longnight", qty: "10", name: "Improvement tokens", note: "Improvements module (Long Night rules p.17)", when: (c) => c.mod("improvements") },

    /* ---- Dead of Winter: Warring Colonies (WC rulebook p.2) ---- */
    { set: "wc", qty: "50", name: "Crossroads cards", note: "Any marked with the crosshairs symbol are only for the Warring Colonies variant (WC rulebook p.2)", when: (c) => !c.wc },
    { set: "wc", qty: "50", name: "Crossroads cards", when: (c) => c.wc },
    { set: "wc", qty: "11", name: "Crisis cards", note: "Any marked with the crosshairs symbol are only for the Warring Colonies variant (WC rulebook p.2)", when: (c) => !c.wc },
    { set: "wc", qty: "11", name: "Crisis cards", note: "Used instead of the base game’s and The Long Night’s crisis cards in the Warring Colonies variant (WC rulebook p.4, p.6)", when: (c) => c.wc },
    { set: "wc", qty: "4", name: "Main objective cards", note: "Used instead of the base game’s and The Long Night’s main objectives in the Warring Colonies variant (WC rulebook p.4)", when: (c) => c.wc },
    { set: "wc", qty: "10", name: "Player reference sheets", note: "Used instead of the base game’s and The Long Night’s reference sheets in the Warring Colonies variant (WC rulebook p.4)", when: (c) => c.wc },
    { set: "wc", qty: "15", name: "Survivor cards", note: "Any marked with the crosshairs symbol are only for the Warring Colonies variant (WC rulebook p.2)", when: (c) => !c.wc },
    { set: "wc", qty: "15", name: "Survivor cards", when: (c) => c.wc },
    { set: "wc", qty: "43", name: "Random item cards", note: "Random Items module: remove the crosshairs-marked cards first (WC rulebook p.15)", when: (c) => !c.wc && c.mod("randomitems") },
    { set: "wc", qty: "43", name: "Random item cards", note: "Warring Colonies variant: 5 are added to each location’s item deck (WC rulebook p.4)", when: (c) => c.wc },
    { set: "wc", qty: "8", name: "Lone Wolf secret objectives", note: "Lone Wolf variant (WC rulebook p.14)", img: "wc-lone-wolf-objective.webp", w: 287, h: 217, when: (c) => c.loneWolf },
    { set: "wc", qty: "14", name: "Lone Wolf mission cards", note: "Lone Wolf variant (WC rulebook p.14)", img: "wc-lone-wolf-mission.webp", w: 221, h: 292, when: (c) => c.loneWolf },
    { set: "wc", qty: "10", name: "Tactics cards", note: "A 5-card set for each colony leader (WC rulebook p.3–4)", img: "wc-tactics.webp", w: 261, h: 320, when: (c) => c.wc },
    { set: "wc", qty: "33", name: "Bullet tokens", img: "wc-bullet.webp", w: 93, h: 203, when: (c) => c.wc },
    { set: "wc", qty: "15", name: "Survivor standees" },
    { set: "wc", qty: "1", name: "Lone Wolf Den location", note: "Lone Wolf variant (WC rulebook p.14)", img: "wc-lone-wolf-den.webp", w: 203, h: 320, when: (c) => c.loneWolf },
    { set: "wc", qty: "1", name: "Combat tracker", img: "wc-combat-tracker.webp", w: 320, h: 70, when: (c) => c.wc },
    { set: "wc", qty: "1", name: "Lone Wolf morale tracker", note: "Lone Wolf variant (WC rulebook p.14)", when: (c) => c.loneWolf },
    { set: "wc", qty: "15", name: "Plastic standee stands" },
    { set: "wc", qty: "1", name: "Sand timer", img: "wc-sand-timer.webp", w: 89, h: 300, when: (c) => c.wc },
    { set: "wc", qty: "2", name: "Combat dice", img: "wc-combat-dice.webp", w: 132, h: 148, when: (c) => c.wc }
  ]
};
