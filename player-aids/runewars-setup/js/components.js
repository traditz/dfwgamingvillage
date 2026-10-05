/* =============================================================================
   Runewars (Revised Edition) — Components glossary data (standard v1.1; rendered by js/comp-widget.js)
   Sources: Rules p.4 (Component List) and p.4–6 (Component Breakdown pictures) · BoW p.2–3 (Component List) and
   p.3–4 (Component Breakdown pictures); BoW's exploration tokens are pictured from BoW p.11 and its supplemental
   influence token from BoW p.8 (audit, Oct 2026).
   Counts and names exactly as the component lists print them. Gates:
     - the Revised Edition list shows only for a Revised Edition copy (the sources don't list the original box);
     - exploration tokens need the Exploration Tokens variant (Rules p.37; BoW p.11);
     - alternate city tokens need Rise of the Free Cities and then replace the base city tokens (BoW p.3, p.11);
     - capital, Reanimate and peasant tokens and the Development cards need Development Cards (BoW p.3–4, p.9);
     - commander tokens and Commander cards need Commanders of the Battlefield (BoW p.3–4, p.10).
   BoW items its breakdown doesn't picture reuse the base book's picture of the same component type.
   The plastic-figure pictures are clean cut-outs of each figure (extract_figs.py), because the books
   photograph them overlapping.
   ============================================================================= */
window.AID_COMPONENTS = {
  sets: [
    { id: "core", name: "Runewars Revised Edition", src: "Rules p.4–6", when: (c) => !c.orig },
    { id: "bow", name: "Banners of War", src: "BoW p.2–4", when: (c) => c.has("bow") }
  ],
  items: [
    /* ---- Runewars Revised Edition (Rules p.4) ---- */
    { set: "core", qty: "40", name: "Beige plastic neutral units", note: "8 Beastmen, 4 Dragons, 4 Giants, 8 Hell Hounds, 8 Razorwings, 8 Sorcerers", img: "core-neutral-units.webp", w: 320, h: 154 },
    { set: "core", qty: "36", name: "Blue plastic Daqan units", note: "8 Bowmen, 16 Footmen, 8 Knights, 4 Siege Engines", img: "core-daqan-units.webp", w: 138, h: 131 },
    { set: "core", qty: "36", name: "Green plastic Elf units", note: "16 Archers, 4 Pegasus Riders, 8 Sorceresses, 8 Warriors", img: "core-elf-units.webp", w: 111, h: 124 },
    { set: "core", qty: "36", name: "Purple plastic Waiqar units", note: "4 Dark Knights, 8 Necromancers, 16 Reanimates, 8 Skeleton Archers", img: "core-waiqar-units.webp", w: 189, h: 175 },
    { set: "core", qty: "36", name: "Red plastic Uthuk units", note: "16 Berserkers, 4 Chaos Lords, 8 Flesh Rippers, 8 Warlocks", img: "core-uthuk-units.webp", w: 148, h: 136 },
    { set: "core", qty: "12", name: "Grey plastic heroes", img: "core-heroes.webp", w: 320, h: 270 },
    { set: "core", qty: "16", name: "Activation tokens", note: "4 per faction", img: "core-activation.webp", w: 211, h: 230 },
    { set: "core", qty: "1", name: "Battle marker", img: "core-battle-marker.webp", w: 252, h: 236 },
    { set: "core", qty: "7", name: "City tokens", img: "core-cities.webp", w: 320, h: 259, when: (c) => !c.mod("rotfc") },
    { set: "core", qty: "26", name: "Damage tokens", img: "core-damage.webp", w: 205, h: 203 },
    { set: "core", qty: "8", name: "Defeated hero markers", img: "core-defeated-hero.webp", w: 263, h: 178 },
    { set: "core", qty: "20", name: "Development tokens", note: "5 per faction", img: "core-development.webp", w: 264, h: 227 },
    { set: "core", qty: "35", name: "Exploration tokens", note: "Used with the Exploration Tokens variant (Rules p.37)", img: "core-exploration.webp", w: 320, h: 214, when: (c) => c.mod("explore") },
    { set: "core", qty: "4", name: "Home realm setup markers", img: "core-home-markers.webp", w: 320, h: 212 },
    { set: "core", qty: "40", name: "Influence tokens", img: "core-influence.webp", w: 257, h: 221 },
    { set: "core", qty: "13", name: "Map tiles", note: "3 of which are split into 2 puzzle-fit pieces", img: "core-map-tiles.webp", w: 320, h: 277 },
    { set: "core", qty: "12", name: "Resource arrows", note: "3 per faction", img: "core-arrows-washers.webp", w: 309, h: 320 },
    { set: "core", qty: "12", name: "Resource washers", note: "3 per faction", img: "core-arrows-washers.webp", w: 309, h: 320 },
    { set: "core", qty: "38", name: "Rune tokens", note: "21 dragon runes, 17 false runes", img: "core-runes.webp", w: 295, h: 234 },
    { set: "core", qty: "16", name: "Stronghold tokens", note: "4 per faction", img: "core-strongholds.webp", w: 239, h: 203 },
    { set: "core", qty: "24", name: "Training tokens", img: "core-training.webp", w: 249, h: 123 },
    { set: "core", qty: "4", name: "Faction sheets", img: "core-faction-sheets.webp", w: 310, h: 320 },
    { set: "core", qty: "4", name: "Reference sheets", note: "Neutral units and diplomacy on the front, exploration tokens on the back", img: "core-reference-sheets.webp", w: 233, h: 263 },
    { set: "core", qty: "32", name: "Order cards", note: "8 per faction", img: "core-orders.webp", w: 320, h: 246 },
    { set: "core", qty: "24", name: "Quest cards", img: "core-quests.webp", w: 320, h: 229 },
    { set: "core", qty: "30", name: "Fate cards", img: "core-fate.webp", w: 320, h: 255 },
    { set: "core", qty: "12", name: "Hero cards", img: "core-heroes-cards.webp", w: 297, h: 258 },
    { set: "core", qty: "8", name: "Evil objective cards", img: "core-objectives.webp", w: 320, h: 269 },
    { set: "core", qty: "8", name: "Good objective cards", img: "core-objectives.webp", w: 320, h: 269 },
    { set: "core", qty: "25", name: "Reward cards", img: "core-rewards.webp", w: 320, h: 282 },
    { set: "core", qty: "8", name: "Spring season cards", img: "core-seasons.webp", w: 320, h: 260 },
    { set: "core", qty: "8", name: "Summer season cards", img: "core-seasons.webp", w: 320, h: 260 },
    { set: "core", qty: "8", name: "Fall season cards", img: "core-seasons.webp", w: 320, h: 260 },
    { set: "core", qty: "8", name: "Winter season cards", img: "core-seasons.webp", w: 320, h: 260 },
    { set: "core", qty: "50", name: "Tactics cards", img: "core-tactics.webp", w: 320, h: 234 },
    { set: "core", qty: "3", name: "Title cards", img: "core-titles.webp", w: 320, h: 239 },
    { set: "core", qty: "4", name: "Victory cards", note: "1 per faction", img: "core-victory.webp", w: 264, h: 258 },
    { set: "core", qty: "12", name: "Sets of plastic dial connectors", img: "core-connectors.webp", w: 239, h: 142 },

    /* ---- Banners of War (BoW p.2–3) ---- */
    { set: "bow", qty: "12", name: "Blue plastic human units", note: "8 Novice Wizards, 4 Rocs", img: "bow-daqan-units.webp", w: 90, h: 140 },
    { set: "bow", qty: "12", name: "Green plastic elf units", note: "8 Leonx Riders, 4 Forest Guardians", img: "bow-elf-units.webp", w: 154, h: 182 },
    { set: "bow", qty: "12", name: "Red plastic Uthuk units", note: "8 Blood Sisters, 4 Obscenes", img: "bow-uthuk-units.webp", w: 152, h: 188 },
    { set: "bow", qty: "12", name: "Purple plastic undead units", note: "8 Vampires, 4 Great Wyrms", img: "bow-waiqar-units.webp", w: 140, h: 157 },
    { set: "bow", qty: "8", name: "Grey plastic heroes", img: "bow-heroes.webp", w: 320, h: 232 },
    { set: "bow", qty: "4", name: "Activation tokens", note: "1 per faction", img: "core-activation.webp", w: 211, h: 230 },
    { set: "bow", qty: "8", name: "Alternate city tokens", note: "Used with Rise of the Free Cities: they replace the base game's city tokens (BoW p.11)", img: "bow-alt-cities.webp", w: 320, h: 223, when: (c) => c.mod("rotfc") },
    { set: "bow", qty: "8", name: "Exploration tokens", note: "Added to the base game's when you use the Exploration Tokens variant: Flooded Area and Defensible Area (BoW p.11)", img: "bow-exploration.webp", w: 320, h: 160, when: (c) => c.mod("explore") },
    { set: "bow", qty: "5", name: "Supplemental influence tokens", note: "Each worth 3 influence (BoW p.8)", img: "bow-supp-influence.webp", w: 264, h: 267 },
    { set: "bow", qty: "4", name: "Development tokens", note: "1 for each faction", img: "core-development.webp", w: 264, h: 227 },
    { set: "bow", qty: "3", name: "Map tiles", note: "Ranging from 1 hex to 4 hexes: tiles 10, 11 and 12", img: "bow-map-tiles.webp", w: 284, h: 320 },
    { set: "bow", qty: "10", name: "Rune tokens", note: "5 dragon runes, 5 false runes", img: "core-runes.webp", w: 295, h: 234 },
    { set: "bow", qty: "4", name: "Capital stronghold tokens", note: "1 for each faction; used with Development Cards (BoW p.9)", img: "bow-capitals.webp", w: 320, h: 181, when: (c) => c.mod("dev") },
    { set: "bow", qty: "15", name: "Training tokens", img: "core-training.webp", w: 249, h: 123 },
    { set: "bow", qty: "1", name: "Lost City token", note: "Not placed at setup; a Quest card or game effect brings it out on map tile 12 (BoW p.5)", img: "bow-lost-city.webp", w: 270, h: 306 },
    { set: "bow", qty: "8", name: "Commander tokens", note: "Used with Commanders of the Battlefield (BoW p.10)", img: "bow-commander-tokens.webp", w: 227, h: 203, when: (c) => c.mod("cmd") },
    { set: "bow", qty: "6", name: "Desolation/Cryomancy tokens", img: "bow-desolation.webp", w: 218, h: 169 },
    { set: "bow", qty: "8", name: "Reanimate tokens", note: "Waiqar's, from the “Lands of Blight” Development card (BoW p.9)", img: "bow-reanimate.webp", w: 206, h: 203, when: (c) => c.mod("dev") },
    { set: "bow", qty: "3", name: "Peasant tokens", note: "Daqan's, from the “Support of the People” Development card (BoW p.9)", img: "bow-peasant.webp", w: 209, h: 203, when: (c) => c.mod("dev") },
    { set: "bow", qty: "4", name: "Reinforcement sheets", note: "1 for each faction; placed to the right of the faction sheet", img: "bow-reinforcement.webp", w: 270, h: 294 },
    { set: "bow", qty: "8", name: "Defeated hero markers", img: "core-defeated-hero.webp", w: 263, h: 178 },
    { set: "bow", qty: "17", name: "Quest cards", img: "bow-quests.webp", w: 320, h: 295 },
    { set: "bow", qty: "4", name: "Garrison Order cards", note: "1 for each faction", img: "bow-garrison.webp", w: 320, h: 311 },
    { set: "bow", qty: "1", name: "Title card", note: "Guildmaster of Merchants", img: "bow-title.webp", w: 294, h: 300 },
    { set: "bow", qty: "8", name: "Hero cards", img: "bow-hero-cards.webp", w: 294, h: 282 },
    { set: "bow", qty: "3", name: "Evil objective cards", img: "bow-objectives.webp", w: 282, h: 276 },
    { set: "bow", qty: "3", name: "Good objective cards", img: "bow-objectives.webp", w: 282, h: 276 },
    { set: "bow", qty: "9", name: "Reward cards", img: "bow-rewards.webp", w: 282, h: 269 },
    { set: "bow", qty: "3", name: "Spring season cards", img: "bow-seasons.webp", w: 269, h: 282 },
    { set: "bow", qty: "3", name: "Summer season cards", img: "bow-seasons.webp", w: 269, h: 282 },
    { set: "bow", qty: "3", name: "Fall season cards", img: "bow-seasons.webp", w: 269, h: 282 },
    { set: "bow", qty: "3", name: "Winter season cards", img: "bow-seasons.webp", w: 269, h: 282 },
    { set: "bow", qty: "32", name: "Tactics cards", note: "Including the Tactical Fate cards (BoW p.7)", img: "bow-tactics.webp", w: 257, h: 295 },
    { set: "bow", qty: "4", name: "Victory cards", note: "1 for each faction. The Revised Edition box has its own set too (Rules p.4); the revised rules use Victory cards in every game (Rules p.30)", img: "bow-victory.webp", w: 288, h: 282, when: (c) => !c.orig },
    { set: "bow", qty: "4", name: "Victory cards", note: "1 for each faction. With an original-edition copy these are the Victory cards you claim victory with (Revised Gameplay p.2)", img: "bow-victory.webp", w: 288, h: 282, when: (c) => c.orig },
    { set: "bow", qty: "32", name: "Development cards", note: "8 for each faction; used with Development Cards (BoW p.9)", img: "bow-development.webp", w: 288, h: 282, when: (c) => c.mod("dev") },
    { set: "bow", qty: "10", name: "Commander cards", note: "Used with Commanders of the Battlefield (BoW p.10)", img: "bow-commander-cards.webp", w: 294, h: 288, when: (c) => c.mod("cmd") }
  ]
};
