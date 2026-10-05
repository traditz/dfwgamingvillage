/* =============================================================================
   Star Wars: Rebellion — Components glossary data (standard v1; rendered by js/comp-widget.js)
   Sources: LtP p.3 (Component List, pictured) · RotE p.1 (Component List, text only).
   The rulebooks themselves ("1 Rules Reference and 1 Learn to Play Booklet", "This rulesheet") are left out.
   Rise of the Empire removes all of the original tactic cards (RotE p.1), so the base tactic cards are hidden when
   it is selected; it also swaps four base cards for same-named replacements (noted on the base items).
   Pictures: base game cropped from LtP p.3. The RotE list has no pictures; its green dice, target marker and
   leader (Jabba the Hutt) are cropped from the illustrations on the same printed side (RotE p.1).
   ============================================================================= */
window.AID_COMPONENTS = {
  sets: [
    { id: "base", name: "Star Wars: Rebellion", src: "LtP p.3" },
    { id: "rote", name: "Rise of the Empire", src: "RotE p.1", fig: "#e4e4e4", when: (c) => c.has("rote") }
  ],
  items: [
    { set: "base", qty: "1", name: "Game board (split in 2 halves)", img: "base-board.webp", w: 320, h: 162 },
    { set: "base", qty: "15", name: "Objective cards", img: "base-objectives.webp", w: 320, h: 315 },
    { set: "base", qty: "25", name: "Leaders with plastic stands", note: "12 Imperial, 13 Rebel", img: "base-leaders.webp", w: 320, h: 265 },
    { set: "base", qty: "3", name: "Destroyed system markers", img: "base-destroyed.webp", w: 298, h: 300 },
    { set: "base", qty: "2", name: "Faction sheets", note: "1 Imperial, 1 Rebel", img: "base-faction-sheets.webp", w: 320, h: 240 },
    { set: "base", qty: "68", name: "Mission cards", note: "39 Imperial, 29 Rebel", img: "base-missions.webp", w: 320, h: 267,
      when: (c) => !c.has("rote") },
    { set: "base", qty: "68", name: "Mission cards", note: "39 Imperial, 29 Rebel. Rise of the Empire replaces <i>Sabotage</i> and both <i>Construct Super Star Destroyer</i> cards with its own versions (RotE p.1).",
      img: "base-missions.webp", w: 320, h: 267, when: (c) => c.has("rote") },
    { set: "base", qty: "27", name: "Subjugation/Imperial loyalty markers", img: "base-imperial-loyalty.webp", w: 203, h: 129 },
    { set: "base", qty: "12", name: "Rebel loyalty markers", img: "base-rebel-loyalty.webp", w: 136, h: 129 },
    { set: "base", qty: "32", name: "Damage markers", note: "24 single, 8 double", img: "base-damage.webp", w: 252, h: 178 },
    { set: "base", qty: "1", name: "Time marker", img: "base-time-marker.webp", w: 108, h: 108 },
    { set: "base", qty: "1", name: "Reputation marker", img: "base-reputation-marker.webp", w: 117, h: 108 },
    { set: "base", qty: "31", name: "Probe cards", img: "base-probes.webp", w: 294, h: 257 },
    { set: "base", qty: "7", name: "Attachment rings", img: "base-rings.webp", w: 320, h: 183 },
    { set: "base", qty: "10", name: "Sabotage markers", img: "base-sabotage.webp", w: 194, h: 120 },
    { set: "base", qty: "10", name: "Custom dice", note: "5 black, 5 red", img: "base-dice.webp", w: 320, h: 186 },
    { set: "base", qty: "30", name: "Tactic cards", note: "15 ground, 15 space", img: "base-tactics.webp", w: 320, h: 232,
      when: (c) => !c.has("rote") },
    { set: "base", qty: "34", name: "Action cards", note: "16 Imperial, 18 Rebel", img: "base-actions.webp", w: 320, h: 229,
      when: (c) => !c.has("rote") },
    { set: "base", qty: "34", name: "Action cards", note: "16 Imperial, 18 Rebel. Rise of the Empire replaces <i>Son of Skywalker</i> and <i>Good Intel</i> with its own versions (RotE p.1).",
      img: "base-actions.webp", w: 320, h: 229, when: (c) => c.has("rote") },
    { set: "base", qty: "153", name: "Plastic miniatures", note: "89 Imperial, 64 Rebel. Imperial: 24 TIE Fighters, 8 Assault Carriers, 8 Star Destroyers, 2 Super Star Destroyers, 2 Death Stars, 1 Death Star Under Construction, 30 Stormtroopers, 10 AT-STs, 4 AT-ATs. Rebel: 8 X-wings, 12 Y-wings, 4 Corellian Corvettes, 4 Rebel Transports, 3 Mon Cala Cruisers, 21 Rebel Troopers, 6 Airspeeders, 3 Shield Generators, 3 Ion Cannons (RR p.14).",
      img: "base-miniatures.webp", w: 320, h: 186 },

    { set: "rote", qty: "44", name: "Mission cards", note: "24 Imperial, 20 Rebel" },
    { set: "rote", qty: "12", name: "Objective cards" },
    { set: "rote", qty: "32", name: "Advanced tactic cards", note: "16 Imperial, 16 Rebel. They replace all of the base game's tactic cards (RotE p.1)." },
    { set: "rote", qty: "16", name: "Action cards", note: "8 Imperial, 8 Rebel" },
    { set: "rote", qty: "8", name: "Leaders with stands", img: "rote-leaders.webp", w: 215, h: 294 },
    { set: "rote", qty: "2", name: "Attachment rings" },
    { set: "rote", qty: "5", name: "Target markers", img: "rote-target-markers.webp", w: 209, h: 181 },
    { set: "rote", qty: "3", name: "Green dice", img: "rote-green-dice.webp", w: 276, h: 172 },
    { set: "rote", qty: "2", name: "Unit reference sheets" },
    { set: "rote", qty: "36", name: "Plastic figures", note: "18 Imperial, 18 Rebel" }
  ]
};
