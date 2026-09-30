/* =============================================================================
   Battlestar Galactica — Components glossary data (standard v1; rendered by js/comp-widget.js)
   Sources: each rulebook's Component List and the pictures that follow it —
     Base p.2 (Component List) · p.2–4 (Component Breakdown)
     Pegasus p.2 (Component List) · p.2–5 (Component Breakdown)
     Exodus p.2 (Component List) · p.2–4 (Component Breakdown)
     Daybreak p.2 (Component List) · p.2–4 (Component Overview)
   Counts and names are the lists' own; the lists give the game boards no count, so neither does this.
   The lists' "This Rulebook" lines are left out. Plastic character stands and connectors are not
   pictured in the books, so they have no picture here. Pictures are cropped from the pages above.

   Context c, dispatched by app.js renderAll():
     c.has(id)  expansion on: "base" | "pegasus" | "exodus" | "daybreak"
     c.mod(id)  module in play: "cylonLeaders" (always at 7 players) | "conflictedLoyalties" |
                "cylonFleet" | "sympatheticCylon"
     c.mode     objective of the setup card picked: "kobol" | "newCaprica" | "ionianNebula" | "earth",
                or "" until one is picked (every objective's pieces show until then)
   Gating, from the rulebooks:
     - Objective pieces show for their objective only. Each other objective card replaces Kobol
       (Pegasus p.5 · Exodus p.4 · Daybreak p.4); New Caprica uses its own President and Admiral title
       cards (Pegasus p.4); the Ionian Nebula uses its own basestar damage tokens (Exodus p.16).
     - Cylon Fleet pieces show only with that option; its Alternate Admiral replaces the core Admiral
       title card (Exodus p.5, p.12). Agenda, Motive and Infiltration cards show only with a Cylon
       Leader (Pegasus p.18 · Daybreak p.5); Pegasus's Agenda and Infiltration cards also serve the
       Sympathetic Cylon variant, whose Sympathetic Cylon may Infiltrate like a Cylon Leader (Pegasus p.18).
     - Pegasus's plastic basestars replace the basestar tokens (Pegasus p.5); Daybreak's centurion
       figures replace the centurion markers (Daybreak p.4); with Daybreak, Pegasus's Cylon locations
       overlay, Infiltration Reference Card, Treachery and Agenda cards go back in the box (Daybreak p.16).
   ============================================================================= */
window.AID_COMPONENTS = (function () {
  "use strict";
  const newCaprica = (c) => !c.mode || c.mode === "newCaprica";
  const ionian = (c) => !c.mode || c.mode === "ionianNebula";
  const earth = (c) => !c.mode || c.mode === "earth";
  const fleet = (c) => c.mod("cylonFleet");
  const leader = (c) => c.mod("cylonLeaders");

  return {
    sets: [
      { id: "base", name: "Base Game", src: "Base p.2–4" },
      { id: "pegasus", name: "Pegasus", src: "Pegasus p.2–5", when: (c) => c.has("pegasus") },
      { id: "exodus", name: "Exodus", src: "Exodus p.2–4", when: (c) => c.has("exodus") },
      { id: "daybreak", name: "Daybreak", src: "Daybreak p.2–4", when: (c) => c.has("daybreak") }
    ],
    items: [
      // ---- Base Game (Base p.2 list; pictures p.2–4)
      { set: "base", name: "Game board", img: "base-board.webp", w: 319, h: 320 },
      { set: "base", qty: "10", name: "Character sheets", img: "base-character-sheets.webp", w: 320, h: 198 },
      { set: "base", qty: "4", name: "Resource dials", img: "base-dials.webp", w: 320, h: 313 },
      { set: "base", qty: "10", name: "Character tokens", img: "base-character-tokens.webp", w: 231, h: 227 },
      { set: "base", qty: "4", name: "Piloting tokens", img: "base-piloting-tokens.webp", w: 245, h: 221 },
      { set: "base", qty: "2", name: "Nuke tokens", img: "base-nuke-tokens.webp", w: 206, h: 177 },
      { set: "base", qty: "12", name: "Civilian ship tokens", img: "base-civilian-ships.webp", w: 320, h: 243 },
      { set: "base", qty: "2", name: "Basestars", img: "base-basestars.webp", w: 320, h: 177, when: (c) => !c.has("pegasus") },
      { set: "base", qty: "4", name: "Centurion markers", img: "base-centurion-markers.webp", w: 154, h: 194, when: (c) => !c.has("daybreak") },
      { set: "base", qty: "4", name: "Basestar damage tokens", img: "base-basestar-damage.webp", w: 203, h: 294, when: (c) => c.mode !== "ionianNebula" },
      { set: "base", qty: "8", name: "Galactica damage tokens", img: "base-galactica-damage.webp", w: 224, h: 301 },
      { set: "base", qty: "1", name: "Fleet marker", img: "base-fleet-marker.webp", w: 197, h: 193 },
      { set: "base", qty: "1", name: "Current player token", img: "base-current-player.webp", w: 240, h: 227 },
      { set: "base", qty: "70", name: "Crisis cards", img: "base-crisis.webp", w: 320, h: 289 },
      { set: "base", qty: "16", name: "Loyalty cards", img: "base-loyalty.webp", w: 320, h: 270 },
      { set: "base", qty: "17", name: "Quorum cards", img: "base-quorum.webp", w: 320, h: 305 },
      { set: "base", qty: "5", name: "Super Crisis cards", img: "base-super-crisis.webp", w: 320, h: 262 },
      { set: "base", qty: "1", name: "President title card", img: "base-titles.webp", w: 320, h: 308, when: (c) => c.mode !== "newCaprica" },
      { set: "base", qty: "1", name: "Admiral title card", img: "base-titles.webp", w: 320, h: 308, when: (c) => c.mode !== "newCaprica" && !c.mod("cylonFleet") },
      { set: "base", qty: "21", name: "Leadership skill cards", img: "base-skills.webp", w: 306, h: 264 },
      { set: "base", qty: "21", name: "Tactics skill cards", img: "base-skills.webp", w: 306, h: 264 },
      { set: "base", qty: "21", name: "Politics skill cards", img: "base-skills.webp", w: 306, h: 264 },
      { set: "base", qty: "21", name: "Piloting skill cards", img: "base-skills.webp", w: 306, h: 264 },
      { set: "base", qty: "21", name: "Engineering skill cards", img: "base-skills.webp", w: 306, h: 264 },
      { set: "base", qty: "22", name: "Destination cards", img: "base-destinations.webp", w: 294, h: 258 },
      { set: "base", qty: "1", name: "Kobol objective card", img: "base-kobol.webp", w: 294, h: 261, when: (c) => !c.mode || c.mode === "kobol" },
      { set: "base", qty: "1", name: "Eight-sided die", img: "base-die.webp", w: 123, h: 127 },
      { set: "base", qty: "8", name: "Vipers", img: "base-vipers.webp", w: 227, h: 132 },
      { set: "base", qty: "4", name: "Raptors", img: "base-raptors.webp", w: 183, h: 130 },
      { set: "base", qty: "16", name: "Cylon raiders", img: "base-raiders.webp", w: 178, h: 124 },
      { set: "base", qty: "4", name: "Cylon heavy raiders", img: "base-heavy-raiders.webp", w: 224, h: 118 },
      { set: "base", qty: "4", name: "Plastic connectors (for resource dials)" },
      { set: "base", qty: "10", name: "Plastic character stands" },

      // ---- Pegasus (Pegasus p.2 list; pictures p.2–5)
      { set: "pegasus", name: "Pegasus game board", img: "peg-board.webp", w: 320, h: 218 },
      { set: "pegasus", name: "New Caprica game board", note: "Only used with the New Caprica objective card (Pegasus p.3)", img: "peg-new-caprica-board.webp", w: 320, h: 225, when: newCaprica },
      { set: "pegasus", qty: "7", name: "Character sheets", note: "Four new human characters and three Cylon Leaders (Pegasus p.3)", img: "peg-character-sheets.webp", w: 320, h: 207 },
      { set: "pegasus", qty: "7", name: "Character tokens", img: "peg-character-tokens.webp", w: 228, h: 245 },
      { set: "pegasus", qty: "1", name: "Piloting token", note: "For Louanne “Kat” Katraine (Pegasus p.3)", img: "peg-piloting-token.webp", w: 205, h: 212 },
      { set: "pegasus", qty: "4", name: "Occupation forces tokens", note: "Only used on the New Caprica game board (Pegasus p.3)", img: "peg-occupation-forces.webp", w: 214, h: 214, when: newCaprica },
      { set: "pegasus", qty: "4", name: "Pegasus damage tokens", note: "One for each Pegasus location (Pegasus p.3)", img: "peg-damage-tokens.webp", w: 243, h: 285 },
      { set: "pegasus", qty: "1", name: "Scar token", img: "peg-scar.webp", w: 193, h: 196 },
      { set: "pegasus", qty: "1", name: "Cylon locations overlay", note: "Covers the Cylon locations of the core game board (Pegasus p.3)", img: "peg-cylon-overlay.webp", w: 320, h: 189, when: (c) => !c.has("daybreak") },
      { set: "pegasus", qty: "20", name: "Crisis cards", img: "peg-crisis.webp", w: 320, h: 283 },
      { set: "pegasus", qty: "30", name: "New Caprica crisis cards", note: "Used in the New Caprica phase (Pegasus p.3)", img: "peg-new-caprica-crisis.webp", w: 320, h: 270, when: newCaprica },
      { set: "pegasus", qty: "3", name: "Loyalty cards", note: "Include the “You Are a Sympathetic Cylon” card, only for the Sympathetic Cylon variant (Pegasus p.4); with Daybreak it goes back in the box (Daybreak p.16)", img: "peg-loyalty.webp", w: 320, h: 285 },
      { set: "pegasus", qty: "12", name: "Agenda cards", note: "Hostile and Sympathetic decks for a Cylon Leader (Pegasus p.4); the Sympathetic Cylon variant draws from the Sympathetic deck (Pegasus p.18)", img: "peg-agendas.webp", w: 178, h: 320, when: (c) => (c.mod("cylonLeaders") || c.mod("sympatheticCylon")) && !c.has("daybreak") },
      { set: "pegasus", qty: "9", name: "Quorum cards", img: "peg-quorum.webp", w: 320, h: 301 },
      { set: "pegasus", qty: "5", name: "Super Crisis cards", img: "peg-super-crisis.webp", w: 320, h: 291 },
      { set: "pegasus", qty: "1", name: "Admiral title card", note: "New Caprica objective: replaces the core game’s Admiral title card (Pegasus p.4)", img: "peg-titles.webp", w: 320, h: 277, when: newCaprica },
      { set: "pegasus", qty: "1", name: "President title card", note: "New Caprica objective: replaces the core game’s President title card (Pegasus p.4)", img: "peg-titles.webp", w: 320, h: 277, when: newCaprica },
      { set: "pegasus", qty: "1", name: "Infiltration reference card", note: "Used by a Cylon Leader who is Infiltrating (Pegasus p.4); in the Sympathetic Cylon variant, the Sympathetic Cylon may Infiltrate as if he were a Cylon Leader (Pegasus p.18)", img: "peg-infiltration.webp", w: 320, h: 279, when: (c) => (c.mod("cylonLeaders") || c.mod("sympatheticCylon")) && !c.has("daybreak") },
      { set: "pegasus", qty: "5", name: "Leadership skill cards", img: "peg-skills.webp", w: 319, h: 278 },
      { set: "pegasus", qty: "5", name: "Tactics skill cards", img: "peg-skills.webp", w: 319, h: 278 },
      { set: "pegasus", qty: "12", name: "Politics skill cards", note: "Five new cards and seven replacement “Investigative Committee” cards; the core game’s Investigative Committee cards go back in the box (Pegasus p.4, p.6)", img: "peg-skills.webp", w: 319, h: 278 },
      { set: "pegasus", qty: "5", name: "Piloting skill cards", img: "peg-skills.webp", w: 319, h: 278 },
      { set: "pegasus", qty: "5", name: "Engineering skill cards", img: "peg-skills.webp", w: 319, h: 278 },
      { set: "pegasus", qty: "26", name: "Treachery skill cards", img: "peg-treachery.webp", w: 303, h: 272, when: (c) => !c.has("daybreak") },
      { set: "pegasus", qty: "5", name: "Destination cards", img: "peg-destinations.webp", w: 303, h: 254 },
      { set: "pegasus", qty: "1", name: "New Caprica objective card", note: "Replaces the Kobol objective card (Pegasus p.5)", img: "peg-new-caprica-objective.webp", w: 303, h: 263, when: newCaprica },
      { set: "pegasus", qty: "2", name: "Plastic basestars", note: "Replace the core game’s basestar tokens (Pegasus p.5)", img: "peg-basestars.webp", w: 320, h: 198 },
      { set: "pegasus", qty: "7", name: "Plastic character stands" },

      // ---- Exodus (Exodus p.2 list; pictures p.2–4)
      { set: "exodus", name: "Cylon Fleet game board", note: "Cylon Fleet option only (Exodus p.2)", img: "exo-cylon-fleet-board.webp", w: 320, h: 311, when: fleet },
      { set: "exodus", qty: "4", name: "Character sheets", img: "exo-character-sheets.webp", w: 320, h: 204 },
      { set: "exodus", qty: "4", name: "Character tokens", img: "exo-character-tokens.webp", w: 223, h: 233 },
      { set: "exodus", qty: "1", name: "Piloting token", note: "For Samuel T. Anders (Exodus p.3)", img: "exo-piloting-token.webp", w: 215, h: 234 },
      { set: "exodus", qty: "1", name: "Nuke token", note: "A third nuke token, placed beside the board: the humans still start with two (Exodus p.3, p.5)", img: "exo-nuke-token.webp", w: 191, h: 199 },
      { set: "exodus", qty: "38", name: "Trauma tokens", note: "Ionian Nebula only (Exodus p.3)", img: "exo-trauma-tokens.webp", w: 270, h: 320, when: ionian },
      { set: "exodus", qty: "35", name: "Ally tokens", note: "Ionian Nebula only; each matches an Ally card (Exodus p.3)", img: "exo-ally-tokens.webp", w: 312, h: 278, when: ionian },
      { set: "exodus", qty: "6", name: "Alternate basestar damage tokens", note: "Ionian Nebula only: they replace the core game’s basestar damage tokens (Exodus p.3, p.16)", img: "exo-alt-basestar-damage.webp", w: 318, h: 181, when: ionian },
      { set: "exodus", qty: "1", name: "Cylon pursuit marker", note: "Cylon Fleet option only (Exodus p.3)", img: "exo-pursuit-marker.webp", w: 200, h: 181, when: fleet },
      { set: "exodus", qty: "40", name: "Crisis cards", note: "Without the Cylon Fleet option, the “CAG Chooses” cards go back in the box (Exodus p.5)", img: "exo-crisis.webp", w: 320, h: 289 },
      { set: "exodus", qty: "35", name: "Ally cards", note: "Ionian Nebula only (Exodus p.3)", img: "exo-ally-cards.webp", w: 320, h: 249, when: ionian },
      { set: "exodus", qty: "20", name: "Loyalty cards", note: "Include the Personal Goal and Final Five cards, used only with the Conflicted Loyalties option (Exodus p.4–5)", img: "exo-loyalty.webp", w: 320, h: 309 },
      { set: "exodus", qty: "7", name: "Crossroads cards", note: "Ionian Nebula only (Exodus p.4)", img: "exo-crossroads.webp", w: 320, h: 295, when: ionian },
      { set: "exodus", qty: "3", name: "Quorum cards", img: "exo-quorum.webp", w: 320, h: 296 },
      { set: "exodus", qty: "3", name: "Super Crisis cards", note: "Without the Cylon Fleet option, the “CAG Chooses” cards go back in the box (Exodus p.5)", img: "exo-super-crisis.webp", w: 320, h: 286 },
      { set: "exodus", qty: "1", name: "CAG title card", note: "Cylon Fleet option only (Exodus p.4)", img: "exo-cag.webp", w: 320, h: 319, when: fleet },
      { set: "exodus", qty: "1", name: "Alternate Admiral title card", note: "Cylon Fleet option: replaces the core game’s Admiral title card (Exodus p.4, p.12)", img: "exo-alt-admiral.webp", w: 320, h: 305, when: fleet },
      { set: "exodus", qty: "4", name: "Leadership skill cards", img: "exo-skills.webp", w: 276, h: 239 },
      { set: "exodus", qty: "4", name: "Tactics skill cards", img: "exo-skills.webp", w: 276, h: 239 },
      { set: "exodus", qty: "4", name: "Politics skill cards", img: "exo-skills.webp", w: 276, h: 239 },
      { set: "exodus", qty: "4", name: "Piloting skill cards", img: "exo-skills.webp", w: 276, h: 239 },
      { set: "exodus", qty: "4", name: "Engineering skill cards", img: "exo-skills.webp", w: 276, h: 239 },
      { set: "exodus", qty: "7", name: "Destination cards", img: "exo-destinations.webp", w: 300, h: 260 },
      { set: "exodus", qty: "1", name: "Ionian Nebula objective card", note: "Replaces the Kobol objective card (Exodus p.4)", img: "exo-ionian-nebula.webp", w: 300, h: 261, when: ionian },
      { set: "exodus", qty: "4", name: "Viper Mark VIIs", note: "Cylon Fleet option only; they start damaged, and two core vipers go back in the box (Exodus p.12)", img: "exo-viper-mk7.webp", w: 236, h: 135, when: fleet },
      { set: "exodus", qty: "4", name: "Cylon raiders", note: "Cylon Fleet option only (Exodus p.4)", img: "exo-raiders.webp", w: 223, h: 126, when: fleet },
      { set: "exodus", qty: "4", name: "Plastic character stands" },

      // ---- Daybreak (Daybreak p.2 list; pictures p.2–4)
      { set: "daybreak", name: "Demetrius game board", note: "Search for Home only (Daybreak p.2, p.4)", img: "day-demetrius.webp", w: 320, h: 249, when: earth },
      { set: "daybreak", name: "Rebel Basestar game board", note: "Search for Home only (Daybreak p.2, p.4)", img: "day-rebel-basestar.webp", w: 320, h: 221, when: earth },
      { set: "daybreak", qty: "12", name: "Character sheets", note: "New humans and Cylon Leaders, plus alternate versions of Lee Adama, Tom Zarek, Karl “Helo” Agathon and Gaius Baltar (Daybreak p.2, p.5)", img: "day-character-sheets.webp", w: 320, h: 244 },
      { set: "daybreak", qty: "1", name: "Cylon locations overlay", note: "Replaces the base game’s Cylon locations (Daybreak p.3); with Pegasus, Pegasus’s overlay goes back in the box (Daybreak p.16)", img: "day-cylon-overlay.webp", w: 320, h: 207 },
      { set: "daybreak", qty: "1", name: "Colonial One overlay", note: "Replaces the base game’s Colonial One locations (Daybreak p.3)", img: "day-colonial-one-overlay.webp", w: 320, h: 168 },
      { set: "daybreak", qty: "12", name: "Character tokens", img: "day-character-tokens.webp", w: 294, h: 320 },
      { set: "daybreak", qty: "4", name: "Piloting tokens", img: "day-piloting-tokens.webp", w: 172, h: 178 },
      { set: "daybreak", qty: "10", name: "Miracle tokens", img: "day-miracle-tokens.webp", w: 197, h: 190 },
      { set: "daybreak", qty: "1", name: "Basestar allegiance marker", note: "Search for Home only (Daybreak p.4)", img: "day-allegiance-marker.webp", w: 302, h: 320, when: earth },
      { set: "daybreak", qty: "30", name: "Crisis cards", note: "With the Cylon Fleet option, their Cylon attack cards go back in the box (Daybreak p.17)", img: "day-crisis.webp", w: 270, h: 281 },
      { set: "daybreak", qty: "2", name: "Loyalty cards", note: "The “You Are a Mutineer” card, which replaces the base game’s “You Are a Sympathizer” card, and one more “You Are Not a Cylon” card (Daybreak p.3, p.6)", img: "day-loyalty.webp", w: 276, h: 268 },
      { set: "daybreak", qty: "22", name: "Mutiny cards", img: "day-mutiny.webp", w: 276, h: 285 },
      { set: "daybreak", qty: "8", name: "Mission cards", note: "Search for Home only (Daybreak p.3–4)", img: "day-missions.webp", w: 288, h: 301, when: earth },
      { set: "daybreak", qty: "14", name: "Motive cards", note: "Dealt to a Cylon Leader (Daybreak p.5–6); with Pegasus, Pegasus’s Agenda cards go back in the box (Daybreak p.16)", img: "day-motives.webp", w: 288, h: 272, when: leader },
      { set: "daybreak", qty: "1", name: "Infiltration reference card", note: "Used by a Cylon Leader who is Infiltrating (Daybreak p.3); with Pegasus, Pegasus’s card goes back in the box (Daybreak p.16)", img: "day-infiltration.webp", w: 285, h: 284, when: leader },
      { set: "daybreak", qty: "5", name: "Politics skill cards", img: "day-skills.webp", w: 245, h: 224 },
      { set: "daybreak", qty: "5", name: "Leadership skill cards", img: "day-skills.webp", w: 245, h: 224 },
      { set: "daybreak", qty: "5", name: "Tactics skill cards", img: "day-skills.webp", w: 245, h: 224 },
      { set: "daybreak", qty: "5", name: "Piloting skill cards", img: "day-skills.webp", w: 245, h: 224 },
      { set: "daybreak", qty: "5", name: "Engineering skill cards", img: "day-skills.webp", w: 245, h: 224 },
      { set: "daybreak", qty: "26", name: "Treachery skill cards", note: "With Pegasus, Pegasus’s Treachery cards go back in the box: never combine the two decks (Daybreak p.16)", img: "day-treachery.webp", w: 208, h: 203 },
      { set: "daybreak", qty: "1", name: "Earth objective card", note: "Search for Home only: replaces the Kobol objective card (Daybreak p.4, p.14)", img: "day-earth.webp", w: 208, h: 188, when: earth },
      { set: "daybreak", qty: "4", name: "Centurions", note: "Replace the base game’s centurion markers (Daybreak p.4)", img: "day-centurions.webp", w: 141, h: 197 },
      { set: "daybreak", qty: "4", name: "Assault raptors", img: "day-assault-raptors.webp", w: 175, h: 148 },
      { set: "daybreak", qty: "12", name: "Plastic character stands" }
    ]
  };
})();
