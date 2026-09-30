/* =============================================================================
   Abyss — Components glossary data (standard format v1; rendered by js/comp-widget.js)
   Source: the base rulebook's "Contents & Setup" (p.2–3): the boxed contents (Exploration cards, Lords,
   Locations, Monster tokens, with their counts and pictures) plus the pieces its setup steps name and
   picture (game board, Threat token and track, the ten Key tokens, Pearls, plastic cups; no count is
   printed for those except the Keys). Pictures cropped from those two pages; the game board's picture is
   joined from the two halves of the p.2–3 spread.
   No components list: the Kraken, Leviathan and De Profundis (Outcasts) rulebooks, so those sets are left
   out. Leviathan's changes to base components (Leviathan p.2): the Threat track stays in the box (so the
   Threat track and its token are hidden with Leviathan, and the game board's note says so), and the Tamer
   Lord returns to the box.
   ============================================================================= */
window.AID_COMPONENTS = {
  sets: [
    { id: "base", name: "Abyss", src: "Base rulebook p.2–3" }
  ],
  items: [
    { set: "base", name: "Game board", img: "base-board.webp", w: 320, h: 263, when: (c) => !c.has("leviathan") },
    { set: "base", name: "Game board", note: "With Leviathan, leave the Threat track in the box and assemble the Border board to the right of the main board instead (Leviathan p.2)",
      img: "base-board.webp", w: 320, h: 263, when: (c) => c.has("leviathan") },
    { set: "base", qty: "71", name: "Exploration cards", note: "65 Allies & 6 Monsters", img: "base-exploration.webp", w: 320, h: 119 },
    { set: "base", qty: "35", name: "Lords", img: "base-lords.webp", w: 320, h: 185, when: (c) => !c.has("leviathan") },
    { set: "base", qty: "35", name: "Lords", note: "With Leviathan, return the Tamer to the box (Leviathan p.2)",
      img: "base-lords.webp", w: 320, h: 185, when: (c) => c.has("leviathan") },
    { set: "base", qty: "20", name: "Locations", img: "base-locations.webp", w: 320, h: 202 },
    { set: "base", qty: "20", name: "Monster tokens", note: "2 of value 4, 9 of value 3, and 9 of value 2", img: "base-monster-tokens.webp", w: 320, h: 67 },
    { set: "base", name: "Threat token", img: "base-threat-token.webp", w: 95, h: 93, when: (c) => !c.has("leviathan") },
    { set: "base", name: "Threat track", img: "base-threat-track.webp", w: 95, h: 320, when: (c) => !c.has("leviathan") },
    { set: "base", qty: "10", name: "Key tokens", img: "base-key-tokens.webp", w: 320, h: 320 },
    { set: "base", name: "Pearls", img: "base-pearl.webp", w: 71, h: 72 },
    { set: "base", name: "Plastic cups" }
  ]
};
