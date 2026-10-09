/* =============================================================================
   Vast: The Mysterious Manor — Components glossary data (standard v1; rendered by js/comp-widget.js)
   Sources: the core game has no components page among this page's sources (the living rules leave it out),
   so the core sets list the pieces named, with their printed counts, in LR › Setup (map and shared supplies)
   and in each role's setup sheet. Haunted Hallways has its own components list (HH p.1).
   Counts appear only where the source prints a number. Pictures: the living rules' own pictures of the
   map, the tiles, the breach and force wall markers and three role figures (no others exist in the sources).
   Gating: a role's set shows when that role is at the table (in solo, only the pieces the Paladin's
   Journey uses); Haunted Hallways sets show with the matching option.
   Role mixes: twin items note the cards a mix returns to the box, and the Expand spell the Spider is handed
   (LR › Player Counts and Role Mixes); the mix lists mirror VM.removesPaladinCards / removesGear / spiderExpand.
   ============================================================================= */
window.AID_COMPONENTS = {
  sets: [
    { id: "map", name: "The Manor map and shared pieces", src: "LR › Setup", when: function (c) { return c.has("map"); } },
    { id: "paladin", name: "The Paladin", src: "Setup Sheet › Paladin (PDF p.1)", when: function (c) { return c.has("paladin"); } },
    { id: "skeletons", name: "The Skeletons", src: "Setup Sheet › Skeletons (PDF p.3)", when: function (c) { return c.has("skeletons") || c.has("solo"); } },
    { id: "spider", name: "The Spider", src: "Setup Sheet › Spider (PDF p.5)", when: function (c) { return c.has("spider") || c.has("solo"); } },
    { id: "manor", name: "The Manor", src: "Setup Sheet › Manor (PDF p.7)", when: function (c) { return c.has("manor"); } },
    { id: "warlock", name: "The Warlock", src: "Setup Sheet › Warlock (PDF p.9)", when: function (c) { return c.has("warlock"); } },
    { id: "hhsp", name: "Haunted Hallways — Shadow Paladin", src: "Haunted Hallways p.1", when: function (c) { return c.has("shadow"); } },
    { id: "hhak", name: "Haunted Hallways — Armored Knight", src: "Haunted Hallways p.1", when: function (c) { return c.has("aknight"); } },
    { id: "hhsk", name: "Haunted Hallways — Skeletons", src: "Haunted Hallways p.1", when: function (c) { return c.has("hhskel") || (c.has("solo") && c.solo.level === "hard"); } },
    { id: "hhmi", name: "Haunted Hallways — Miniatures", src: "Haunted Hallways p.1", when: function (c) { return c.has("hhmini"); } }
  ],
  items: [
    /* map & shared supplies — LR › Setup › 1–2 */
    { set: "map", name: "Map board", note: "Crypts (square spaces) ringed by the grounds; the grounds hold the numbered Spawns", img: "map-board.webp", w: 246, h: 320 },
    { set: "map", qty: "1", name: "Starting Pit tile", note: "Marked “S”; face up on the center space" },
    { set: "map", qty: "4", name: "Armory tiles", note: "Crossed swords; facedown on their four matching spaces" },
    { set: "map", qty: "1", name: "Entrance tile", note: "Marked “E”; face up above the staircase" },
    { set: "map", qty: "45", name: "Other tiles", note: "Shuffled facedown into a stack", img: "map-tiles.webp", w: 274, h: 209 },
    { set: "map", name: "Poltergeist figures", note: "Shared supply" },
    { set: "map", name: "Treasure markers", note: "Shared supply" },
    { set: "map", name: "Breach markers", note: "Shared supply", img: "map-breach.webp", w: 181, h: 90 },
    { set: "map", name: "Force wall markers", note: "Shared supply", img: "map-forcewall.webp", w: 182, h: 91 },
    { set: "map", name: "Spawn die", note: "The visiting Goblins roll it to place each Tribe on a Spawn", src: "LR › Traveling Between Vast Games › Visiting the Manor › Goblins in the Manor", when: function (c) { return c.has("goblins"); } },

    /* Paladin — Setup Sheet › Paladin */
    { set: "paladin", name: "Paladin board" },
    { set: "paladin", name: "Paladin figure", img: "paladin-figure.webp", w: 228, h: 320 },
    { set: "paladin", name: "Health cube" },
    { set: "paladin", name: "Grit dial" },
    { set: "paladin", qty: "8", name: "Light tokens", note: "Their backs are lamp tokens" },
    { set: "paladin", qty: "5", name: "Fury tokens" },
    { set: "paladin", name: "Pillar of light figure" },
    { set: "paladin", qty: "7", name: "Hero cubes" },
    { set: "paladin", qty: "7", name: "Treasure cards", when: function (c) { return !(c.mode === "multi" && ["m3psm", "m3psw", "m2ps"].indexOf(c.mix) >= 0); } },
    { set: "paladin", qty: "7", name: "Treasure cards", note: "Role mix: the Armor treasure returns to the box", src: "LR › Player Counts and Role Mixes", when: function (c) { return c.mode === "multi" && ["m3psm", "m3psw", "m2ps"].indexOf(c.mix) >= 0; } },
    { set: "paladin", name: "Illuminate and Vigor favor cards", note: "Start face up near the Paladin", when: function (c) { return !c.has("solo"); } },
    { set: "paladin", qty: "7", name: "Favor cards", note: "The rest of the favor deck", when: function (c) { return !c.has("solo") && ["m3psm", "m3psw", "m2ps"].indexOf(c.mix) < 0; } },
    { set: "paladin", qty: "7", name: "Favor cards", note: "The rest of the favor deck. Role mix: Disdain and Radiant Lamps return to the box", src: "LR › Player Counts and Role Mixes", when: function (c) { return c.mode === "multi" && (c.mix === "m3psm" || c.mix === "m3psw"); } },
    { set: "paladin", qty: "7", name: "Favor cards", note: "The rest of the favor deck. Role mix: Radiant Lamps returns to the box", src: "LR › Player Counts and Role Mixes", when: function (c) { return c.mode === "multi" && c.mix === "m2ps"; } },
    { set: "paladin", name: "Illuminate, Vigor and Disdain favor cards", note: "Solo: all three start face up near the Paladin", when: function (c) { return c.has("solo"); } },
    { set: "paladin", qty: "6", name: "Favor cards", note: "The rest of the favor deck (solo)", when: function (c) { return c.has("solo"); } },

    /* Skeletons — Setup Sheet › Skeletons (solo uses only the cards, figures, die and Stability dial) */
    { set: "skeletons", name: "Skeletons board", when: function (c) { return !c.has("solo"); } },
    { set: "skeletons", name: "Stability dial" },
    { set: "skeletons", qty: "2", name: "Cackling skulls tokens", when: function (c) { return !c.has("solo"); } },
    { set: "skeletons", qty: "4", name: "Pit markers", when: function (c) { return !c.has("solo"); } },
    { set: "skeletons", qty: "15", name: "Gear cards", when: function (c) { return !c.has("solo") && !(c.mode === "multi" && ["m3ksw", "m3ksm"].indexOf(c.mix) >= 0); } },
    { set: "skeletons", qty: "15", name: "Gear cards", note: "Role mix: Shield, Kukri, Pauldrons and Poison return to the box", src: "LR › Player Counts and Role Mixes", when: function (c) { return c.mode === "multi" && ["m3ksw", "m3ksm"].indexOf(c.mix) >= 0; } },
    { set: "skeletons", qty: "5", name: "Skeleton cards" },
    { set: "skeletons", name: "Spawn die" },
    { set: "skeletons", name: "Skeleton figures", img: "skeletons-figure.webp", w: 213, h: 320 },

    /* Spider — Setup Sheet › Spider (solo uses only the Terror dial and a blood token) */
    { set: "spider", qty: "3", name: "Form boards", note: "Giant Spider, Sorcerer, Spiderlings", when: function (c) { return !c.has("solo"); } },
    { set: "spider", qty: "12", name: "Power cards", when: function (c) { return !c.has("solo"); } },
    { set: "spider", qty: "15", name: "Blood tokens" },
    { set: "spider", qty: "10", name: "Web tokens", when: function (c) { return !c.has("solo"); } },
    { set: "spider", name: "Terror dial" },
    { set: "spider", name: "Giant Spider figure", when: function (c) { return !c.has("solo"); } },
    { set: "spider", name: "Sorcerer figure", when: function (c) { return !c.has("solo"); } },
    { set: "spider", qty: "5", name: "Spiderling figures", when: function (c) { return !c.has("solo"); } },
    { set: "spider", qty: "3", name: "Egg figures", when: function (c) { return !c.has("solo"); } },
    { set: "spider", name: "Expand spell card", note: "The Warlock’s spell; the Spider begins with it (role mix)", src: "LR › Player Counts and Role Mixes", when: function (c) { return c.mode === "multi" && ["m3pks", "m2ps", "m2ks"].indexOf(c.mix) >= 0; } },

    /* Manor — Setup Sheet › Manor */
    { set: "manor", name: "Manor board" },
    { set: "manor", qty: "6", name: "Portent cubes" },
    { set: "manor", qty: "3", name: "Omen cubes" },
    { set: "manor", name: "Wraith figure", img: "manor-wraith.webp", w: 320, h: 266 },
    { set: "manor", name: "Seals cube" },
    { set: "manor", qty: "13", name: "Ritual cards" },

    /* Warlock — Setup Sheet › Warlock */
    { set: "warlock", name: "Warlock board" },
    { set: "warlock", name: "Warlock figure" },
    { set: "warlock", qty: "20", name: "Curse markers" },
    { set: "warlock", qty: "5", name: "Magic cubes" },
    { set: "warlock", name: "Spells cube" },
    { set: "warlock", qty: "10", name: "Spell cards" },
    { set: "warlock", name: "Poltergeist figures", note: "The Warlock brings them to the Cave", src: "LR › Traveling Between Vast Games › Visiting the Cave › Warlock in the Cave", when: function (c) { return c.has("cave"); } },
    { set: "warlock", name: "Force wall markers", note: "The Warlock brings them to the Cave (he can still bring them into play with Enclose)", img: "map-forcewall.webp", w: 182, h: 91, src: "LR › Traveling Between Vast Games › Visiting the Cave › Warlock in the Cave", when: function (c) { return c.has("cave"); } },

    /* Haunted Hallways — HH p.1 Components */
    { set: "hhsp", qty: "1", name: "Player board and setup sheet" },
    { set: "hhsp", qty: "1", name: "Shadow Paladin figure" },
    { set: "hhsp", qty: "20", name: "Ruin cubes" },
    { set: "hhsp", qty: "1", name: "Health cube" },
    { set: "hhsp", qty: "5", name: "Ice tokens" },
    { set: "hhsp", qty: "16", name: "Power cards" },
    { set: "hhsp", qty: "12", name: "Chain cards" },

    { set: "hhak", qty: "1", name: "Player board and setup sheet" },
    { set: "hhak", qty: "1", name: "Armored Knight figure" },
    { set: "hhak", qty: "7", name: "Hero cubes" },
    { set: "hhak", qty: "1", name: "Health cube" },
    { set: "hhak", qty: "1", name: "Grit cube" },
    { set: "hhak", qty: "3", name: "Javelin tokens" },
    { set: "hhak", qty: "3", name: "Armor tokens" },
    { set: "hhak", qty: "10", name: "Sidequest cards" },
    { set: "hhak", qty: "7", name: "Artifact cards" },

    { set: "hhsk", qty: "4", name: "Skeleton figures", note: "Replace base Skeletons one-for-one, in any combination", when: function (c) { return c.has("hhskel"); } },
    { set: "hhsk", qty: "1", name: "Skeleton figure and its Skeleton card", note: "Solo Hard: added as the 6th Skeleton", src: "LR › The Paladin’s Journey (Solo) › Difficulty · Haunted Hallways p.1", when: function (c) { return !c.has("hhskel"); } },
    { set: "hhsk", qty: "12", name: "Gear cards", when: function (c) { return !c.has("solo") && !(c.mode === "multi" && ["m3ksw", "m3ksm"].indexOf(c.mix) >= 0); } },
    { set: "hhsk", qty: "12", name: "Gear cards", note: "Role mix: the Iron Spike (Smashy) returns to the box", src: "LR › Player Counts and Role Mixes", when: function (c) { return !c.has("solo") && (c.mode === "multi" && ["m3ksw", "m3ksm"].indexOf(c.mix) >= 0); } },
    { set: "hhsk", qty: "4", name: "Skeleton cards", when: function (c) { return c.has("hhskel"); } },

    { set: "hhmi", qty: "1", name: "Shadow Paladin", note: "These miniatures can replace many of the pieces of The Mysterious Manor" },
    { set: "hhmi", qty: "1", name: "Armored Knight" },
    { set: "hhmi", qty: "4", name: "Skeletons" },
    { set: "hhmi", qty: "6", name: "Force walls" },
    { set: "hhmi", qty: "9", name: "Poltergeists" },
    { set: "hhmi", qty: "10", name: "Treasures" },
    { set: "hhmi", qty: "10", name: "Webs" },
    { set: "hhmi", qty: "3", name: "Eggs" },
    { set: "hhmi", qty: "1", name: "Pillar of light" }
  ]
};
