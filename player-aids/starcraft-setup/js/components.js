/* =============================================================================
   StarCraft: The Board Game — Components glossary data (standard v1.1; rendered by js/comp-widget.js)
   Sources: Base p.3 (Components list) with pictures from its Component Overview, p.3–7 (the standard and special
   order tokens are cropped from the labelled pictures on p.20); BW p.2 (Component list) with pictures from its
   Component Breakdown, p.2–4 (the installation tokens are cropped from the labelled pictures on BW p.9).
   With Brood War, its Faction Sheets replace the core ones (BW p.6), so the core sheets are hidden; the core building
   tokens, Combat and Technology cards it partly replaces carry a note instead (BW p.5). Scenario item tokens show only
   in the Scenario game mode; Arcturus Mengsk's and the Protoss tokens hide when a full table without them is marked.
   ============================================================================= */
window.AID_COMPONENTS = {
  sets: [
    { id: "base", name: "StarCraft: The Board Game", src: "Base p.3–7" },
    { id: "bw", name: "Brood War", src: "BW p.2–4", fig: "#dfe5ea", when: (c) => c.has("bw") }
  ],
  items: [
    { set: "base", qty: "180", name: "Plastic figures", img: "base-figures.webp", w: 320, h: 185,
      note: "2 sets per race (one per faction). Each set has 3 of every unit, except 6 Marines, 6 Zealots, 9 Zerglings and 6 Hydralisks" },
    { set: "base", qty: "12", name: "Planet tiles", img: "base-planets.webp", w: 320, h: 169 },
    { set: "base", qty: "15", name: "Normal navigation routes", img: "base-nav-routes.webp", w: 227, h: 248 },
    { set: "base", qty: "12", name: "Z-axis navigation routes", note: "6 major ends and 6 minor ends", img: "base-z-axis.webp", w: 320, h: 243 },
    { set: "base", qty: "1", name: "Conquest point track", img: "base-cp-track.webp", w: 320, h: 117 },
    { set: "base", qty: "6", name: "Conquest point markers", note: "The back of each is marked +15", img: "base-cp-markers.webp", w: 320, h: 122 },
    { set: "base", qty: "6", name: "Faction Sheets", img: "base-faction-sheets.webp", w: 320, h: 180, when: (c) => !c.has("bw") },
    { set: "base", qty: "6", name: "Reference sheets", img: "base-ref-sheets.webp", w: 320, h: 128 },
    { set: "base", qty: "1", name: "First player token", img: "base-first-player.webp", w: 309, h: 310 },
    { set: "base", qty: "36", name: "Standard order tokens", note: "6 per faction (silver): Build, Mobilize, Research", img: "base-orders.webp", w: 320, h: 99 },
    { set: "base", qty: "18", name: "Special order tokens", note: "3 per faction (gold)", img: "base-special-orders.webp", w: 320, h: 99 },
    { set: "base", qty: "36", name: "Base tokens", note: "6 per faction", img: "base-bases.webp", w: 320, h: 158 },
    { set: "base", qty: "90", name: "Worker tokens", note: "15 per faction", img: "base-workers.webp", w: 320, h: 130 },
    { set: "base", qty: "42", name: "Transport tokens", note: "7 per faction", img: "base-transports.webp", w: 320, h: 79 },
    { set: "base", qty: "40", name: "Building tokens", note: "6 for each Zerg and Protoss faction, and 8 for each Terran faction", img: "base-buildings.webp", w: 320, h: 268,
      when: (c) => !c.has("bw") },
    { set: "base", qty: "40", name: "Building tokens", note: "6 for each Zerg and Protoss faction, and 8 for each Terran faction. With Brood War, store the Terran Barracks II–III and Starport I–III and the Protoss Gateway II–III and Robotics Facility I (BW p.5).", img: "base-buildings.webp", w: 320, h: 268,
      when: (c) => c.has("bw") },
    { set: "base", qty: "38", name: "Module tokens", note: "4 for each Zerg faction, 7 for each Protoss faction, and 8 for each Terran faction", img: "base-modules.webp", w: 320, h: 129 },
    { set: "base", qty: "12", name: "Starting planet tokens", img: "base-planet-tokens.webp", w: 320, h: 109 },
    { set: "base", qty: "20", name: "Depletion tokens", note: "Depleted side (red) and partially depleted side (yellow)", img: "base-depletion.webp", w: 320, h: 143 },
    { set: "base", qty: "26", name: "Resource cards", note: "Normal side and partially depleted side", img: "base-resource-cards.webp", w: 320, h: 228 },
    { set: "base", qty: "108", name: "Combat cards", note: "18 per faction", img: "base-combat-cards.webp", w: 320, h: 164, when: (c) => !c.has("bw") },
    { set: "base", qty: "108", name: "Combat cards", note: "18 per faction. With Brood War, some are stored and new ones added: each Combat deck becomes 20 cards (BW p.5).", img: "base-combat-cards.webp", w: 320, h: 164, when: (c) => c.has("bw") },
    { set: "base", qty: "126", name: "Technology cards", note: "22 for each Zerg faction, 20 for each Protoss faction, and 21 for each Terran faction", img: "base-tech-cards.webp", w: 320, h: 164, when: (c) => !c.has("bw") },
    { set: "base", qty: "126", name: "Technology cards", note: "22 for each Zerg faction, 20 for each Protoss faction, and 21 for each Terran faction. With Brood War, some are stored and replaced (BW p.5).", img: "base-tech-cards.webp", w: 320, h: 164, when: (c) => c.has("bw") },
    { set: "base", qty: "70", name: "Event cards", note: "25 Stage I, 25 Stage II and 20 Stage III Event cards", img: "base-event-cards.webp", w: 320, h: 166 },

    { set: "bw", qty: "48", name: "Plastic figures", img: "bw-figures.webp", w: 320, h: 203,
      note: "2 sets per race, 3 of each unit: Medics, Valkyries · Dark Templars, Dark Archons, Corsairs · Lurkers, Devourers, Infested Terrans" },
    { set: "bw", qty: "18", name: "Clear plastic stands", note: "For the flying units" },
    { set: "bw", qty: "36", name: "Zerg Combat and Technology cards", note: "17 Green, 19 Purple", img: "bw-combat-tech.webp", w: 320, h: 222 },
    { set: "bw", qty: "34", name: "Terran Combat and Technology cards", note: "17 Red, 17 Blue", img: "bw-combat-tech.webp", w: 320, h: 222 },
    { set: "bw", qty: "34", name: "Protoss Combat and Technology cards", note: "17 Orange, 17 Yellow", img: "bw-combat-tech.webp", w: 320, h: 222 },
    { set: "bw", qty: "42", name: "Leadership cards", note: "7 per faction", img: "bw-leadership.webp", w: 320, h: 221 },
    { set: "bw", qty: "7", name: "Event cards", img: "bw-event-resource.webp", w: 320, h: 216 },
    { set: "bw", qty: "12", name: "Resource cards", img: "bw-event-resource.webp", w: 320, h: 216 },
    { set: "bw", qty: "6", name: "Faction Sheets", note: "Replace the core Faction Sheets (BW p.6)", img: "bw-faction-sheets.webp", w: 320, h: 142 },
    { set: "bw", qty: "6", name: "Planet tiles", img: "bw-planets.webp", w: 320, h: 156 },
    { set: "bw", qty: "6", name: "Starting planet tokens", img: "bw-planets.webp", w: 320, h: 156 },
    { set: "bw", qty: "18", name: "Module tokens", note: "3 per faction", img: "bw-modules.webp", w: 320, h: 214 },
    { set: "bw", qty: "6", name: "Defend order tokens", note: "1 per faction", img: "bw-defend-orders.webp", w: 320, h: 142 },
    { set: "bw", qty: "18", name: "Building tokens", note: "5 for each Terran faction, 4 for each Protoss faction", img: "bw-buildings.webp", w: 320, h: 134 },
    { set: "bw", qty: "4", name: "Mind control tokens", note: "2 for each Protoss faction", img: "bw-mind-control.webp", w: 320, h: 162,
      when: (c) => !c.maybe || c.maybe("tassadar") || c.maybe("aldaris") },
    { set: "bw", qty: "7", name: "Hero tokens", img: "bw-heroes.webp", w: 320, h: 210 },
    { set: "bw", qty: "30", name: "Resource tokens", note: "Minerals and gas", img: "bw-resource-tokens.webp", w: 320, h: 142 },
    { set: "bw", qty: "2", name: "Special conquest point tokens", note: "For the Arcturus Mengsk faction", img: "bw-special-cp.webp", w: 320, h: 262,
      when: (c) => !c.maybe || c.maybe("mengsk") },
    { set: "bw", qty: "1", name: "Star order token", note: "For the Arcturus Mengsk faction", img: "bw-star-order.webp", w: 230, h: 206,
      when: (c) => !c.maybe || c.maybe("mengsk") },
    { set: "bw", qty: "12", name: "Guard tokens", img: "bw-guard.webp", w: 320, h: 244 },
    { set: "bw", qty: "5", name: "Navigation routes" },
    { set: "bw", qty: "4", name: "Infested Command Center installations", img: "bw-icc.webp", w: 320, h: 155 },
    { set: "bw", qty: "1", name: "Warp Gate installation", img: "bw-warp-gate.webp", w: 243, h: 240 },
    { set: "bw", qty: "1", name: "Overmind installation", img: "bw-overmind.webp", w: 243, h: 240 },
    { set: "bw", qty: "1", name: "Cerebrate installation", img: "bw-cerebrate.webp", w: 243, h: 240 },
    { set: "bw", qty: "3", name: "Scenario item tokens", note: "Psi Emitter, Khalis Crystal, Uraj Crystal (BW p.12)", img: "bw-scenario-items.webp", w: 320, h: 221,
      when: (c) => c.mode === "scenario" }
  ]
};
