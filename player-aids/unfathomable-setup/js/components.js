/* =============================================================================
   Unfathomable — Components glossary data (standard format v1; rendered by js/comp-widget.js)
   Sources: Learn to Play p.3 (Components) · From the Abyss p.2 (Components) and p.3 (Expansion
   Components: Add / Remove / Replace). Pictures cropped from those pages. With From the Abyss in play,
   its updated title cards and reference sheets replace the base game's (From the Abyss p.3), so the base
   versions are hidden. Prelude cards appear only with the Preludes option.
   ============================================================================= */
window.AID_COMPONENTS = {
  sets: [
    { id: "core", name: "Unfathomable", src: "Learn to Play p.3" },
    { id: "fta", name: "From the Abyss", src: "From the Abyss p.2–3", when: (c) => c.has("fta") }
  ],
  items: [
    { set: "core", qty: "1", name: "Game board", img: "core-board.webp", w: 320, h: 220 },
    { set: "core", qty: "4", name: "Resource dials with plastic connectors", img: "core-dials.webp", w: 227, h: 209 },
    { set: "core", qty: "1", name: "Standard 8-sided die", img: "core-die.webp", w: 135, h: 129 },
    { set: "core", qty: "22", name: "Monster figures", note: "1 Mother Hydra, 1 Father Dagon, 20 Deep Ones", img: "core-monsters.webp", w: 320, h: 277 },
    { set: "core", qty: "10", name: "Character standees", img: "core-standees.webp", w: 144, h: 221 },
    { set: "core", qty: "1", name: "Travel track token", img: "core-travel-token.webp", w: 135, h: 187 },
    { set: "core", qty: "1", name: "Ritual track token", img: "core-ritual-token.webp", w: 144, h: 185 },
    { set: "core", qty: "10", name: "Character sheets", img: "core-character-sheets.webp", w: 320, h: 219 },
    { set: "core", qty: "3", name: "Traitor reference sheets", img: "core-traitor-refs.webp", w: 320, h: 216, when: (c) => !c.has("fta") },
    { set: "core", qty: "6", name: "Player reference sheets", img: "core-player-refs.webp", w: 320, h: 219, when: (c) => !c.has("fta") },
    { set: "core", qty: "1", name: "Captain title card", img: "core-captain.webp", w: 178, h: 257, when: (c) => !c.has("fta") },
    { set: "core", qty: "1", name: "Keeper of the Tome title card", img: "core-keeper.webp", w: 175, h: 257, when: (c) => !c.has("fta") },
    { set: "core", qty: "10", name: "Feat cards", img: "core-feats.webp", w: 252, h: 218 },
    { set: "core", qty: "20", name: "Spell cards", img: "core-spells.webp", w: 252, h: 212 },
    { set: "core", qty: "20", name: "Waypoint cards", img: "core-waypoints.webp", w: 255, h: 212 },
    { set: "core", qty: "20", name: "Item cards", img: "core-items.webp", w: 258, h: 224 },
    { set: "core", qty: "9", name: "Ship damage cards", img: "core-ship-damage.webp", w: 252, h: 224 },
    { set: "core", qty: "126", name: "Skill cards", note: "21 each of 6 types", img: "core-skills.webp", w: 255, h: 224 },
    { set: "core", qty: "14", name: "Loyalty cards", img: "core-loyalty.webp", w: 320, h: 273 },
    { set: "core", qty: "70", name: "Mythos cards", img: "core-mythos.webp", w: 320, h: 311 },
    { set: "core", qty: "9", name: "Passenger tokens", img: "core-passengers.webp", w: 132, h: 129 },
    { set: "core", qty: "4", name: "Traitor rings", img: "core-traitor-rings.webp", w: 242, h: 212 },
    { set: "core", qty: "1", name: "Current player token", img: "core-current-player.webp", w: 310, h: 239 },
    { set: "fta", qty: "3", name: "Horror figures", note: "1 Shoggoth, 1 Drowned Spirit, 1 Grasping Tendril", img: "fta-horror-figures.webp", w: 320, h: 118 },
    { set: "fta", qty: "4", name: "Horror cards", img: "fta-horror-cards.webp", w: 320, h: 269 },
    { set: "fta", qty: "1", name: "Horror token", img: "fta-horror-token.webp", w: 129, h: 191 },
    { set: "fta", qty: "12", name: "Ally cards", img: "fta-allies.webp", w: 255, h: 215 },
    { set: "fta", qty: "8", name: "Character standees", img: "fta-standees.webp", w: 139, h: 230 },
    { set: "fta", qty: "8", name: "Character sheets", img: "fta-character-sheets.webp", w: 320, h: 218 },
    { set: "fta", qty: "8", name: "Feat cards", img: "fta-feats.webp", w: 255, h: 215 },
    { set: "fta", qty: "11", name: "Item cards", note: "10 new item cards, plus an updated Jam Tin Grenade that replaces the base game’s (From the Abyss p.3)", img: "fta-items.webp", w: 255, h: 215 },
    { set: "fta", qty: "35", name: "Skill cards", note: "23 boon cards + 2 each of 6 types", img: "fta-skills.webp", w: 254, h: 215 },
    { set: "fta", qty: "10", name: "Waypoint cards", img: "fta-waypoints.webp", w: 246, h: 215 },
    { set: "fta", qty: "10", name: "Spell cards", img: "fta-spells.webp", w: 254, h: 215 },
    { set: "fta", qty: "2", name: "Ship damage cards", img: "fta-ship-damage.webp", w: 255, h: 215 },
    { set: "fta", qty: "15", name: "Prelude cards", note: "Used with the Preludes option (From the Abyss p.3, p.9)", img: "fta-preludes.webp", w: 320, h: 270, when: (c) => c.mod("prelude") },
    { set: "fta", qty: "72", name: "Mythos cards", img: "fta-mythos.webp", w: 320, h: 262 },
    { set: "fta", qty: "8", name: "Character-specific mythos cards", note: "Kept out of the mythos deck: each player takes the one that matches their character (From the Abyss p.3)", img: "fta-char-mythos.webp", w: 320, h: 260 },
    { set: "fta", qty: "1", name: "Captain title card", note: "Updated version: replaces the base game’s (From the Abyss p.3)", img: "fta-captain.webp", w: 176, h: 261 },
    { set: "fta", qty: "1", name: "Keeper of the Tome title card", note: "Updated version: replaces the base game’s (From the Abyss p.3)", img: "fta-keeper.webp", w: 178, h: 261 },
    { set: "fta", qty: "3", name: "Expansion reference sheets", img: "fta-expansion-refs.webp", w: 320, h: 227 },
    { set: "fta", qty: "6", name: "Player reference sheets", note: "Updated versions: replace the base game’s (From the Abyss p.3)", img: "fta-player-refs.webp", w: 320, h: 230 },
    { set: "fta", qty: "3", name: "Traitor reference sheets", note: "Updated versions: replace the base game’s (From the Abyss p.3)", img: "fta-traitor-refs.webp", w: 320, h: 225 },
    { set: "fta", qty: "2", name: "Overlay tiles", note: "The boon and ally overlay tiles, placed on the board’s edge beside the treachery and item card labels (From the Abyss p.3)", img: "fta-overlays.webp", w: 249, h: 288 }
  ]
};
