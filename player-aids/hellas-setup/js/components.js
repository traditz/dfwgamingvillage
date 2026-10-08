/* =============================================================================
   Lords of Hellas — Components glossary data (standard v1.1; rendered by js/comp-widget.js)
   Sources: Base p.3–4 (Game Components; Cards; Miniatures; Tokens) · Dark Ages p.2–7 (each module's own
   components, and the Kickstarter extras on p.7) · City of Steel p.2–4 · Apollo p.2–3 · Atlas p.2 · Kronos p.2–3.
   Pictures cropped from those pages. The Apollo and Atlas manuals print no page numbers: they are counted from
   the cover as p.1, as elsewhere on this page. The Solo Campaign book has no components list (it uses the core box).
   Gating: each god's parts follow its module; Simple modes hide the parts their rules say aren't used (Fleet;
   Warriors, Gates, Raise tokens and Underworld; Relics; Muses). Atlantis shows at 5–6 players and the City of
   Steel 6th-player parts at 6 (standard game), Army Upgrade with its module, Kronos parts only in the Kronos mode.
   Modes: the Persian Invasion tray (Xerxes' Board) shows only in the Solo Campaign; the Events deck is hidden in the
   Kronos mode and the Temple cards in the Solo Campaign, where their books say they aren't used, and the Solo
   Campaign keeps only the Events deck's Quest cards (Kronos p.2 · Solo Campaign p.2). The Solo Campaign's other
   unused pieces (Chimera and its tray, the other three Heroes and their boards, the red pieces) and its
   single-player-symbol decks are noted in solo. Kronos: the Quest tokens are hidden (its Quest cards have none, and
   the Events deck with the base Quests isn't used); its Blessing removals and Artifact limits are noted (Kronos p.2).
   ============================================================================= */
window.AID_COMPONENTS = {
  sets: [
    { id: "base", name: "Lords of Hellas", src: "Base p.3–4" },
    { id: "poseidon", name: "Poseidon (Dark Ages)", src: "Dark Ages p.2", when: (c) => c.mod("poseidon") || c.mod("poseidonS") },
    { id: "atlantis", name: "Atlantis — 5th player (Dark Ages)", src: "Dark Ages p.3", when: (c) => c.has("da") && c.mode === "standard" && c.p >= 5 },
    { id: "orichalkum", name: "Orichalkum and Constructs (Dark Ages)", src: "Dark Ages p.4", when: (c) => c.mod("orichalkum") },
    { id: "hades", name: "Hades (Dark Ages)", src: "Dark Ages p.4", when: (c) => c.mod("hades") || c.mod("hadesS") },
    { id: "hephaestus", name: "Hephaestus (Dark Ages)", src: "Dark Ages p.5", when: (c) => c.mod("hephaestus") || c.mod("hephaestusS") },
    { id: "heroesmonsters", name: "Heroes and Monsters (Dark Ages)", src: "Dark Ages p.6", when: (c) => c.mod("heroesmonsters") },
    { id: "combatcards", name: "Additional Combat Cards (Dark Ages)", src: "Dark Ages p.6", when: (c) => c.mod("combatcards") },
    { id: "chiron", name: "Chiron (Dark Ages)", src: "Dark Ages p.7", when: (c) => c.mod("chiron") },
    { id: "opportunity", name: "Opportunity Cards (Dark Ages)", src: "Dark Ages p.7", when: (c) => c.mod("opportunity") },
    { id: "daks", name: "Dark Ages: Kickstarter edition extras", src: "Dark Ages p.7", fig: "#d7dbdc", when: (c) => c.has("da") },
    { id: "cos", name: "City of Steel — 6th player", src: "City of Steel p.2–3", when: (c) => c.has("cos") && c.mode === "standard" && c.p === 6 },
    { id: "armyupgrade", name: "Army Upgrade (City of Steel)", src: "City of Steel p.4", when: (c) => c.mod("armyupgrade") },
    { id: "apollo", name: "Apollo — Lord of the Sun", src: "Apollo p.2–3", when: (c) => c.mod("apolloM") || c.mod("apolloS") },
    { id: "atlas", name: "Atlas", src: "Atlas p.2", when: (c) => c.mod("atlasO") || c.mod("atlasH") },
    { id: "kronos", name: "Kronos", src: "Kronos p.2–3", when: (c) => c.mode === "kronos" }
  ],
  items: [
    /* ---- Core box (Base p.3–4) ---- */
    { set: "base", name: "Map", img: "core-map.webp", w: 320, h: 214, when: (c) => c.mode === "standard" },
    { set: "base", name: "Map", note: "Solo Campaign: play on its back, the special solo map (Solo Campaign p.2)", img: "core-map.webp", w: 320, h: 214, when: (c) => c.mode === "solo" },
    { set: "base", name: "Map", note: "Kronos: play on its back, the alternative board used for the Solo Campaign (Kronos p.2)", img: "core-map.webp", w: 320, h: 214, when: (c) => c.mode === "kronos" },
    { set: "base", qty: "4", name: "Hero boards", img: "core-hero-boards.webp", w: 320, h: 221, when: (c) => c.mode !== "solo" },
    { set: "base", qty: "4", name: "Hero boards", note: "Solo Campaign: only Achilles’s Hero board is used (Solo Campaign p.2)", img: "core-hero-boards.webp", w: 320, h: 221, when: (c) => c.mode === "solo" },
    { set: "base", qty: "4", name: "Army boards", img: "core-army-boards.webp", w: 320, h: 231 },
    { set: "base", qty: "4", name: "Colored plastic rings", img: "core-rings.webp", w: 320, h: 129 },
    { set: "base", qty: "4", name: "Help trays", img: "core-help-trays.webp", w: 320, h: 231 },
    { set: "base", qty: "1", name: "Persian Invasion tray", note: "Xerxes’ Board, used in the Solo Campaign (Solo Campaign p.2)", when: (c) => c.mode === "solo", img: "core-persian-tray.webp", w: 246, h: 178 },
    { set: "base", qty: "7", name: "Monster trays", img: "core-monster-trays.webp", w: 320, h: 165, when: (c) => c.mode !== "solo" },
    { set: "base", qty: "7", name: "Monster trays", note: "Solo Campaign: Chimera’s tray isn’t used (Solo Campaign p.2)", img: "core-monster-trays.webp", w: 320, h: 165, when: (c) => c.mode === "solo" },
    { set: "base", name: "Events deck", note: "14 Monster cards, 9 Quest cards", when: (c) => c.mode === "standard", img: "core-events.webp", w: 320, h: 176 },
    { set: "base", name: "Events deck", note: "14 Monster cards, 9 Quest cards. Solo Campaign: only the Quest cards are used, without Capture Cretan Bull (Solo Campaign p.2)", when: (c) => c.mode === "solo", img: "core-events.webp", w: 320, h: 176 },
    { set: "base", qty: "18", name: "Monster Attack deck", note: "18 cards", img: "core-monster-attack.webp", w: 320, h: 180 },
    { set: "base", name: "Artifact deck", note: "10 Neutral Artifacts cards, 7 Monster Reward Artifact cards, 3 God’s Artifact cards", when: (c) => c.mode === "standard", img: "core-artifacts.webp", w: 320, h: 179 },
    { set: "base", name: "Artifact deck", note: "10 Neutral Artifacts cards, 7 Monster Reward Artifact cards, 3 God’s Artifact cards. Solo Campaign: only the cards with the single-player symbol are used (Solo Campaign p.2)", when: (c) => c.mode === "solo", img: "core-artifacts.webp", w: 320, h: 179 },
    { set: "base", name: "Artifact deck", note: "10 Neutral Artifacts cards, 7 Monster Reward Artifact cards, 3 God’s Artifact cards. In the Kronos mode, Neutral and Monster Artifacts aren’t used (Kronos p.2)", when: (c) => c.mode === "kronos", img: "core-artifacts.webp", w: 320, h: 179 },
    { set: "base", qty: "30", name: "Combat Cards deck", note: "30 cards", img: "core-combat.webp", w: 320, h: 183, when: (c) => c.mode !== "solo" },
    { set: "base", qty: "30", name: "Combat Cards deck", note: "30 cards. Solo Campaign: only the cards with the single-player symbol are used (Solo Campaign p.2)", img: "core-combat.webp", w: 320, h: 183, when: (c) => c.mode === "solo" },
    { set: "base", name: "Blessing cards", note: "12 Athena cards, 12 Zeus cards, 12 Hermes cards", img: "core-blessings.webp", w: 320, h: 122, when: (c) => c.mode === "standard" },
    { set: "base", name: "Blessing cards", note: "12 Athena cards, 12 Zeus cards, 12 Hermes cards. Solo Campaign: only the cards with the single-player symbol are used (Solo Campaign p.2)", img: "core-blessings.webp", w: 320, h: 122, when: (c) => c.mode === "solo" },
    { set: "base", name: "Blessing cards", note: "12 Athena cards, 12 Zeus cards, 12 Hermes cards. In the Kronos mode, 13 named Blessing cards are removed (Kronos p.2)", img: "core-blessings.webp", w: 320, h: 122, when: (c) => c.mode === "kronos" },
    { set: "base", qty: "5", name: "Temple cards", when: (c) => c.mode !== "solo", img: "core-temple-cards.webp", w: 320, h: 133 },
    { set: "base", qty: "4", name: "Help cards", img: "core-help-cards.webp", w: 267, h: 233 },
    { set: "base", qty: "1", name: "Monument Activation card", img: "core-monument-activation.webp", w: 227, h: 184 },
    { set: "base", qty: "4", name: "Heroes", note: "Heracles, Perseus, Achilles, Helen", img: "core-heroes.webp", w: 320, h: 112, when: (c) => c.mode !== "solo" },
    { set: "base", qty: "4", name: "Heroes", note: "Heracles, Perseus, Achilles, Helen. Solo Campaign: only Achilles is used (Solo Campaign p.2)", img: "core-heroes.webp", w: 320, h: 112, when: (c) => c.mode === "solo" },
    { set: "base", qty: "3", name: "Five-piece Monuments", note: "Zeus, Athena, Hermes", img: "core-monuments.webp", w: 320, h: 182, when: (c) => !(c.mod("poseidonS") || c.mod("hadesS") || c.mod("hephaestusS") || c.mod("apolloS")) },
    { set: "base", qty: "3", name: "Five-piece Monuments", note: "Zeus, Athena, Hermes. Each Simple-mode god’s Monument replaces one of these, which isn’t used: Poseidon replaces Athena (Attica), Hades or Hephaestus replaces Zeus (Thessaly), Apollo replaces Hermes (Acarnania) (Dark Ages p.2, p.4, p.5 · Apollo p.4)", img: "core-monuments.webp", w: 320, h: 182, when: (c) => c.mod("poseidonS") || c.mod("hadesS") || c.mod("hephaestusS") || c.mod("apolloS") },
    { set: "base", qty: "60", name: "Hoplites", note: "15 per player", img: "core-hoplites-priests.webp", w: 320, h: 79, when: (c) => c.mode !== "solo" },
    { set: "base", qty: "60", name: "Hoplites", note: "15 per player. Solo Campaign: the red ones aren’t used (Solo Campaign p.2)", img: "core-hoplites-priests.webp", w: 320, h: 79, when: (c) => c.mode === "solo" },
    { set: "base", qty: "16", name: "Priests", note: "4 per player", img: "core-hoplites-priests.webp", w: 320, h: 79, when: (c) => c.mode !== "solo" },
    { set: "base", qty: "16", name: "Priests", note: "4 per player. Solo Campaign: the red ones aren’t used (Solo Campaign p.2)", img: "core-hoplites-priests.webp", w: 320, h: 79, when: (c) => c.mode === "solo" },
    { set: "base", qty: "7", name: "Monsters", img: "core-monsters.webp", w: 320, h: 61, when: (c) => c.mode !== "solo" },
    { set: "base", qty: "7", name: "Monsters", note: "Solo Campaign: Chimera isn’t used (Solo Campaign p.2)", img: "core-monsters.webp", w: 320, h: 61, when: (c) => c.mode === "solo" },
    { set: "base", name: "Monster die", img: "core-die.webp", w: 176, h: 184 },
    { set: "base", qty: "60", name: "Control tokens", note: "15 per player", img: "core-control.webp", w: 320, h: 91, when: (c) => c.mode !== "solo" },
    { set: "base", qty: "60", name: "Control tokens", note: "15 per player. Solo Campaign: the red ones aren’t used (Solo Campaign p.2)", img: "core-control.webp", w: 320, h: 91, when: (c) => c.mode === "solo" },
    { set: "base", qty: "12", name: "Attribute tokens", note: "3 per player", img: "core-attribute.webp", w: 319, h: 224 },
    { set: "base", qty: "9", name: "Quest tokens", img: "core-quest-tokens.webp", w: 320, h: 127, when: (c) => c.mode !== "kronos" },
    { set: "base", qty: "8", name: "Temple tokens", note: "With plastic stands", img: "core-temples.webp", w: 320, h: 144, when: (c) => c.mode === "kronos" || (c.mode === "standard" && c.p >= 4) },
    { set: "base", qty: "8", name: "Temple tokens", note: "With plastic stands. 2–3 players: only the first 6 Temples are placed (Base p.6)", img: "core-temples.webp", w: 320, h: 144, when: (c) => c.mode === "standard" && c.p <= 3 },
    { set: "base", qty: "8", name: "Temple tokens", note: "With plastic stands. Solo Campaign: only 6 Temples are used, set on the Temple track; 2 are left over (Solo Campaign p.2 · Solo FAQ p.1)", img: "core-temples.webp", w: 320, h: 144, when: (c) => c.mode === "solo" },
    { set: "base", qty: "24", name: "Used Action tokens", note: "6 per player", img: "core-used-action.webp", w: 320, h: 164, when: (c) => c.mode !== "solo" },
    { set: "base", qty: "24", name: "Used Action tokens", note: "6 per player. Solo Campaign: all 24 are shuffled face down as the campaign’s clock and are never returned (Solo Campaign p.2)", img: "core-used-action.webp", w: 320, h: 164, when: (c) => c.mode === "solo" },
    { set: "base", qty: "5", name: "Glory tokens", note: "1 per Land color", img: "core-glory.webp", w: 320, h: 80 },
    { set: "base", qty: "15", name: "Monster Wound tokens", img: "core-wounds.webp", w: 320, h: 164 },
    { set: "base", qty: "1", name: "Oracle of Delphi token", note: "With plastic stand", img: "core-oracle.webp", w: 166, h: 196 },

    /* ---- Poseidon (Dark Ages p.2) ---- */
    { set: "poseidon", qty: "1", name: "Five-piece Poseidon Monument", img: "poseidon-monument.webp", w: 320, h: 312, when: (c) => !c.mod("poseidonS") },
    { set: "poseidon", qty: "1", name: "Five-piece Poseidon Monument", note: "Simple mode: replaces Athena’s Monument in Attica (Dark Ages p.2)", img: "poseidon-monument.webp", w: 320, h: 312, when: (c) => c.mod("poseidonS") },
    { set: "poseidon", qty: "1", name: "Poseidon Help card", note: "Use the side marked with a red corner (Dark Ages p.2)", img: "poseidon-help.webp", w: 320, h: 235, when: (c) => !c.mod("poseidonS") },
    { set: "poseidon", qty: "1", name: "Poseidon Help card", note: "Simple mode: use the side marked with a gray corner (Dark Ages p.2)", img: "poseidon-help.webp", w: 320, h: 235, when: (c) => c.mod("poseidonS") },
    { set: "poseidon", qty: "1", name: "Poseidon God’s Artifact", img: "poseidon-artifact.webp", w: 175, h: 236 },
    { set: "poseidon", qty: "10", name: "Poseidon Blessing cards", img: "poseidon-blessings.webp", w: 320, h: 140 },
    { set: "poseidon", qty: "1", name: "Fleet board", img: "poseidon-fleet-board.webp", w: 320, h: 166, when: (c) => !c.mod("poseidonS") },
    { set: "poseidon", qty: "6", name: "Fleet tokens", img: "poseidon-fleet-tokens.webp", w: 312, h: 153, when: (c) => !c.mod("poseidonS") },
    { set: "poseidon", qty: "7", name: "Port tokens", img: "poseidon-ports.webp", w: 320, h: 157 },

    /* ---- Atlantis, 5th player expansion (Dark Ages p.3) ---- */
    { set: "atlantis", qty: "1", name: "Atlantis board", img: "atlantis-board.webp", w: 320, h: 318 },
    { set: "atlantis", qty: "1", name: "Hero board", note: "Cleito", img: "atlantis-hero-board.webp", w: 320, h: 124 },
    { set: "atlantis", qty: "1", name: "Hero", note: "Cleito", img: "atlantis-cleito.webp", w: 304, h: 303 },
    { set: "atlantis", qty: "1", name: "Army board", img: "atlantis-army-board.webp", w: 320, h: 138 },
    { set: "atlantis", qty: "15", name: "Hoplites", img: "atlantis-hoplites.webp", w: 157, h: 199 },
    { set: "atlantis", qty: "4", name: "Priests", img: "atlantis-priests.webp", w: 106, h: 190 },
    { set: "atlantis", qty: "15", name: "Control tokens", img: "atlantis-control.webp", w: 111, h: 102 },
    { set: "atlantis", qty: "1", name: "Glory token", img: "atlantis-glory.webp", w: 108, h: 123 },
    { set: "atlantis", qty: "1", name: "Colored ring", img: "atlantis-ring.webp", w: 151, h: 86 },
    { set: "atlantis", qty: "3", name: "Attribute tokens", img: "atlantis-attribute.webp", w: 310, h: 135 },
    { set: "atlantis", qty: "3", name: "Monsters", note: "Siren, Cetus, Talos", img: "atlantis-monsters.webp", w: 320, h: 251 },
    { set: "atlantis", qty: "3", name: "Monster trays", note: "Siren, Cetus, Talos", img: "atlantis-trays.webp", w: 320, h: 153 },
    { set: "atlantis", qty: "4", name: "Event Monster cards", note: "2 Siren, 2 Cetus", img: "atlantis-events.webp", w: 320, h: 159 },
    { set: "atlantis", qty: "3", name: "Quest cards and Quest tokens", img: "atlantis-quests.webp", w: 320, h: 174 },
    { set: "atlantis", qty: "2", name: "Monster Reward Artifact cards", note: "Siren, Cetus", img: "atlantis-artifacts.webp", w: 312, h: 239 },
    { set: "atlantis", qty: "1", name: "Factory", img: "atlantis-factory.webp", w: 264, h: 303 },

    /* ---- Orichalkum and Constructs (Dark Ages p.4) ---- */
    { set: "orichalkum", qty: "14", name: "Orichalkum tokens", img: "orichalkum-tokens.webp", w: 315, h: 185 },
    { set: "orichalkum", qty: "10", name: "Construct cards", img: "orichalkum-constructs.webp", w: 314, h: 261 },

    /* ---- Hades (Dark Ages p.4) ---- */
    { set: "hades", qty: "1", name: "Five-piece Hades Monument", img: "hades-monument.webp", w: 192, h: 320, when: (c) => !c.mod("hadesS") },
    { set: "hades", qty: "1", name: "Five-piece Hades Monument", note: "Simple mode: replaces Zeus’s Monument in Thessaly (Dark Ages p.4)", img: "hades-monument.webp", w: 192, h: 320, when: (c) => c.mod("hadesS") },
    { set: "hades", qty: "6", name: "Warriors of Hades", img: "hades-warriors.webp", w: 266, h: 320, when: (c) => !c.mod("hadesS") },
    { set: "hades", qty: "6", name: "Gate of Hades tokens", img: "hades-gates.webp", w: 283, h: 128, when: (c) => !c.mod("hadesS") },
    { set: "hades", qty: "1", name: "Hades Help card", note: "Use the side marked with a red corner (Dark Ages p.4)", img: "hades-help.webp", w: 319, h: 242, when: (c) => !c.mod("hadesS") },
    { set: "hades", qty: "1", name: "Hades Help card", note: "Simple mode: use the side marked with a gray corner (Dark Ages p.4)", img: "hades-help.webp", w: 319, h: 242, when: (c) => c.mod("hadesS") },
    { set: "hades", qty: "1", name: "Hades God’s Artifact", img: "hades-artifact.webp", w: 172, h: 242 },
    { set: "hades", qty: "10", name: "Hades Blessing cards", img: "hades-blessings.webp", w: 320, h: 148 },
    { set: "hades", qty: "1", name: "Underworld board", img: "hades-underworld.webp", w: 319, h: 315, when: (c) => !c.mod("hadesS") },
    { set: "hades", qty: "6", name: "Raise tokens", img: "hades-raise.webp", w: 320, h: 175, when: (c) => !c.mod("hadesS") },

    /* ---- Hephaestus (Dark Ages p.5) ---- */
    { set: "hephaestus", qty: "1", name: "Five-piece Hephaestus Monument", img: "hephaestus-monument.webp", w: 275, h: 320, when: (c) => !c.mod("hephaestusS") },
    { set: "hephaestus", qty: "1", name: "Five-piece Hephaestus Monument", note: "Simple mode: replaces Zeus’s Monument in Thessaly (Dark Ages p.5)", img: "hephaestus-monument.webp", w: 275, h: 320, when: (c) => c.mod("hephaestusS") },
    { set: "hephaestus", qty: "1", name: "Hephaestus Help card", note: "Use the side marked with a red corner (Dark Ages p.5)", img: "hephaestus-help.webp", w: 320, h: 247, when: (c) => !c.mod("hephaestusS") },
    { set: "hephaestus", qty: "1", name: "Hephaestus Help card", note: "Simple mode: use the side marked with a gray corner (Dark Ages p.5)", img: "hephaestus-help.webp", w: 320, h: 247, when: (c) => c.mod("hephaestusS") },
    { set: "hephaestus", qty: "1", name: "Hephaestus God’s Artifact", img: "hephaestus-artifact.webp", w: 178, h: 249 },
    { set: "hephaestus", qty: "10", name: "Hephaestus Blessing cards", img: "hephaestus-blessings.webp", w: 320, h: 145 },
    { set: "hephaestus", qty: "13", name: "Relic cards", img: "hephaestus-relics.webp", w: 320, h: 174, when: (c) => !c.mod("hephaestusS") },
    { set: "hephaestus", qty: "5", name: "Neutral Artifact cards", img: "hephaestus-neutral.webp", w: 320, h: 136 },

    /* ---- Heroes and Monsters (Dark Ages p.6) ---- */
    { set: "heroesmonsters", qty: "2", name: "Heroes", note: "Cassandra, Odysseus", img: "hm-heroes.webp", w: 320, h: 178 },
    { set: "heroesmonsters", qty: "2", name: "Hero board", note: "Cassandra, Odysseus", img: "hm-hero-boards.webp", w: 320, h: 249 },
    { set: "heroesmonsters", qty: "2", name: "Monsters", note: "Typhon, Python", img: "hm-monsters.webp", w: 320, h: 169 },
    { set: "heroesmonsters", qty: "2", name: "Monster trays", note: "Typhon, Python", img: "hm-trays.webp", w: 320, h: 151 },
    { set: "heroesmonsters", qty: "4", name: "Event Monster cards", note: "2 Typhon, 2 Python", img: "hm-events.webp", w: 320, h: 155 },
    { set: "heroesmonsters", qty: "2", name: "Monster Reward Artifact cards", note: "Typhon, Python", img: "hm-artifacts.webp", w: 320, h: 200 },

    /* ---- Additional Combat Cards (Dark Ages p.6) ---- */
    { set: "combatcards", qty: "6", name: "Combat cards", img: "combat-cards.webp", w: 320, h: 237 },

    /* ---- Chiron (Dark Ages p.7) ---- */
    { set: "chiron", qty: "1", name: "Special Monster", note: "Chiron", img: "chiron-monster.webp", w: 311, h: 288 },
    { set: "chiron", qty: "1", name: "Monster tray", img: "chiron-tray.webp", w: 320, h: 221 },
    { set: "chiron", qty: "1", name: "Monster Reward Artifact card", img: "chiron-artifact.webp", w: 224, h: 282 },
    { set: "chiron", qty: "6", name: "Chiron’s Training cards", img: "chiron-training.webp", w: 282, h: 320 },
    { set: "chiron", qty: "2", name: "Event Monster cards", img: "chiron-events.webp", w: 313, h: 315 },

    /* ---- Opportunity Cards (Dark Ages p.7) ---- */
    { set: "opportunity", qty: "5", name: "Opportunity cards", img: "opportunity-cards.webp", w: 320, h: 178 },

    /* ---- Dark Ages: Kickstarter edition extras (Dark Ages p.7) ---- */
    { set: "daks", qty: "1", name: "Pandora’s Box with secret contents", note: "Only in Kickstarter edition sets. If you open it before a game, you must use its contents in that game; for experienced players only", img: "ks-pandora.webp", w: 320, h: 181 },
    { set: "daks", qty: "1", name: "Envelope with secret contents", note: "Only in Kickstarter edition sets. The first player to win 3 games opens it and introduces the rules inside", img: "ks-envelope.webp", w: 320, h: 224 },

    /* ---- City of Steel, 6th player expansion (City of Steel p.2–3) ---- */
    { set: "cos", qty: "1", name: "Troy board", img: "cos-troy-board.webp", w: 161, h: 320 },
    { set: "cos", qty: "1", name: "Walls of Troy", img: "cos-walls.webp", w: 320, h: 161 },
    { set: "cos", qty: "1", name: "Hero board", note: "Hector", img: "cos-hero-board.webp", w: 320, h: 122 },
    { set: "cos", qty: "1", name: "Hero", note: "Hector", img: "cos-hector.webp", w: 320, h: 305 },
    { set: "cos", qty: "1", name: "Army board", img: "cos-army-board.webp", w: 320, h: 138 },
    { set: "cos", qty: "15", name: "Hoplites", img: "cos-hoplites.webp", w: 145, h: 212 },
    { set: "cos", qty: "4", name: "Priests", img: "cos-priests.webp", w: 111, h: 209 },
    { set: "cos", qty: "1", name: "Control token", img: "cos-control.webp", w: 120, h: 102 },
    { set: "cos", qty: "1", name: "Glory token", img: "cos-glory.webp", w: 114, h: 132 },
    { set: "cos", qty: "1", name: "Colored ring", img: "cos-ring.webp", w: 154, h: 87 },
    { set: "cos", qty: "3", name: "Attribute tokens", img: "cos-attribute.webp", w: 307, h: 90 },
    { set: "cos", qty: "2", name: "Monsters", note: "Satyr, Arachne", img: "cos-monsters.webp", w: 297, h: 320 },
    { set: "cos", qty: "2", name: "Monster trays", note: "Satyr, Arachne", img: "cos-trays.webp", w: 320, h: 186 },
    { set: "cos", qty: "2", name: "Event Monster cards", note: "Printed as “2 Event Monster cards (2 Satyr, 2 Arachne)”; the picture shows four cards", img: "cos-events.webp", w: 320, h: 236 },
    { set: "cos", qty: "2", name: "Monster Reward Artifact cards", note: "Satyr, Arachne", img: "cos-artifacts.webp", w: 320, h: 193 },
    { set: "cos", qty: "3", name: "Quest cards and Quest tokens", img: "cos-quests.webp", w: 277, h: 320 },
    { set: "cos", qty: "2", name: "Temple cards", note: "For 6-player games", img: "cos-temple-cards.webp", w: 320, h: 219 },

    /* ---- Army Upgrade (City of Steel p.4) ---- */
    { set: "armyupgrade", qty: "6", name: "Army Upgrade boards", img: "upgrade-boards.webp", w: 320, h: 73 },
    { set: "armyupgrade", qty: "12", name: "Army Upgrade tokens", img: "upgrade-tokens.webp", w: 221, h: 102 },

    /* ---- Apollo — Lord of the Sun (Apollo p.2–3) ---- */
    { set: "apollo", qty: "1", name: "Five-piece Apollo Monument", img: "apollo-monument.webp", w: 218, h: 320, when: (c) => !c.mod("apolloS") },
    { set: "apollo", qty: "1", name: "Five-piece Apollo Monument", note: "Simple mode: replaces Hermes’s Monument in Acarnania (Apollo p.4)", img: "apollo-monument.webp", w: 218, h: 320, when: (c) => c.mod("apolloS") },
    { set: "apollo", qty: "1", name: "Apollo God’s Artifact", img: "apollo-artifact.webp", w: 173, h: 246 },
    { set: "apollo", qty: "10", name: "Apollo Blessing cards", img: "apollo-blessings.webp", w: 320, h: 192 },
    { set: "apollo", qty: "1", name: "Apollo Help card", note: "Use the side marked with a red corner (Apollo p.3)", img: "apollo-help.webp", w: 320, h: 238, when: (c) => !c.mod("apolloS") },
    { set: "apollo", qty: "1", name: "Apollo Help card", note: "Simple mode: use the side marked with a gray corner (Apollo p.4)", img: "apollo-help.webp", w: 320, h: 238, when: (c) => c.mod("apolloS") },
    { set: "apollo", qty: "6", name: "Muses", note: "Each player’s Muse is marked by the ring in their color (Apollo p.3)", img: "apollo-muses.webp", w: 148, h: 294, when: (c) => !c.mod("apolloS") },
    { set: "apollo", qty: "6", name: "Colored rings", img: "apollo-rings.webp", w: 245, h: 147, when: (c) => !c.mod("apolloS") },
    { set: "apollo", qty: "9", name: "Muses cards", img: "apollo-muse-cards.webp", w: 320, h: 115, when: (c) => !c.mod("apolloS") },

    /* ---- Atlas (Atlas p.2) ---- */
    { set: "atlas", qty: "1", name: "Atlas Monument", img: "atlas-monument.webp", w: 289, h: 320 },
    { set: "atlas", qty: "1", name: "Atlas board", note: "Two sides: the 0–15 Overload track and the Hesperides Garden (Atlas p.3–4)", img: "atlas-board.webp", w: 316, h: 316 },
    { set: "atlas", qty: "1", name: "Atlas Help card", img: "atlas-help.webp", w: 298, h: 218 },
    { set: "atlas", qty: "5", name: "Port tokens", img: "atlas-ports.webp", w: 319, h: 129 },
    { set: "atlas", qty: "1", name: "Overload token", img: "atlas-overload.webp", w: 144, h: 169, when: (c) => c.mod("atlasO") },
    { set: "atlas", qty: "1", name: "Atlas Bonus token", img: "atlas-bonus.webp", w: 120, h: 96, when: (c) => c.mod("atlasO") },
    { set: "atlas", qty: "15", name: "Golden Apple token", img: "atlas-apples.webp", w: 288, h: 129, when: (c) => c.mod("atlasH") },

    /* ---- Kronos (Kronos p.2; Atlantis Attribute tokens: Kronos p.3) ---- */
    { set: "kronos", qty: "1", name: "Kronos", img: "kronos-figure.webp", w: 320, h: 294 },
    { set: "kronos", qty: "1", name: "Kronos board", img: "kronos-board.webp", w: 320, h: 236 },
    { set: "kronos", qty: "1", name: "Anger Points counter", img: "kronos-anger.webp", w: 117, h: 123 },
    { set: "kronos", qty: "21", name: "Kronos Order cards", img: "kronos-orders.webp", w: 320, h: 173 },
    { set: "kronos", qty: "7", name: "Kronos Chain cards", img: "kronos-chains.webp", w: 320, h: 173 },
    { set: "kronos", qty: "3", name: "Kronos Event cards", img: "kronos-events.webp", w: 320, h: 170 },
    { set: "kronos", qty: "9", name: "Hero Special Ability tokens", img: "kronos-hero-tokens.webp", w: 320, h: 74 },
    { set: "kronos", qty: "1", name: "Current Player token", img: "kronos-current-player.webp", w: 154, h: 144 },
    { set: "kronos", qty: "3", name: "Attribute tokens (Atlantis 5th player)", note: "Not in the Kronos box: Kronos marks Might, Anger and Authority with the 5th player’s Attribute tokens from the Atlantis expansion (Dark Ages) (Kronos p.3)", img: "atlantis-attribute.webp", w: 310, h: 135 }
  ]
};
