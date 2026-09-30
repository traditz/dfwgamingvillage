/* =============================================================================
   Relic — Components glossary data (standard format v1; rendered by js/comp-widget.js)
   Sources: Core p.3 (Component List) and p.3–4 (Component Overview) · Nemesis p.2 (Components)
   · Halls of Terra p.2 (Components). Pictures are cropped from those pages.
   Gating (page context from app.js ctx()):
   - Enemies of the Imperium mode (c.mod("eoti")): the nemesis boards, tokens, sheets, pieces,
     floating dials, Nemesis cards and Imperium cards are only used in that mode (Nemesis p.4, p.6);
     Halls of Terra's nemesis components likewise (Halls of Terra p.8).
   - Halls of Terra without the Sol System board (c.solBoard false, the "cards only" variant): the
     board and the Halls of Terra Mission cards are left out (Halls of Terra p.3); so are the orange
     Threat cards, drawn only for the orange threat icons on Sol System spaces (p.6), the Champion
     cards, gained only at the Sanctum Imperialis space (p.8), and the Imperium tokens, placed only
     on Sol tier spaces (p.8–9).
   ============================================================================= */
window.AID_COMPONENTS = {
  sets: [
    { id: "base", name: "Relic", src: "Core p.3–4" },
    { id: "nemesis", name: "Relic: Nemesis", src: "Nemesis p.2", when: (c) => c.has("nemesis") },
    { id: "halls", name: "Relic: Halls of Terra", src: "Halls of Terra p.2", when: (c) => c.has("halls") }
  ],
  items: [
    /* ---- Relic (Core p.3 Component List; pictures from the Component Overview, p.3–4) ---- */
    { set: "base", qty: "10", name: "Plastic character pieces", img: "core-pieces.webp", w: 320, h: 237 },
    { set: "base", qty: "4", name: "Plastic character bases", img: "core-pieces.webp", w: 320, h: 237 },
    { set: "base", qty: "4", name: "Plastic level pegs", img: "core-peg.webp", w: 65, h: 68 },
    { set: "base", qty: "16", name: "Plastic dial connectors" },
    { set: "base", qty: "16", name: "Dials", note: "4 Strength, 4 Willpower, 4 Cunning and 4 Life dials", img: "core-dials.webp", w: 320, h: 100 },
    { set: "base", qty: "4", name: "Six-sided dice", img: "core-dice.webp", w: 203, h: 209 },
    { set: "base", qty: "1", name: "Game board", img: "core-board.webp", w: 313, h: 221 },
    { set: "base", qty: "40", name: "Character tokens", img: "core-char-tokens.webp", w: 260, h: 230 },
    { set: "base", qty: "55", name: "Charge tokens", img: "core-charge.webp", w: 269, h: 195 },
    { set: "base", qty: "55", name: "Influence tokens", img: "core-influence.webp", w: 285, h: 192 },
    { set: "base", qty: "4", name: "Character boards", img: "core-char-boards.webp", w: 320, h: 184 },
    { set: "base", qty: "10", name: "Character sheets", img: "core-char-sheets.webp", w: 279, h: 224 },
    { set: "base", qty: "5", name: "Scenario sheets", img: "core-scenario.webp", w: 279, h: 227 },
    { set: "base", qty: "30", name: "Corruption cards", img: "core-corruption.webp", w: 282, h: 206 },
    { set: "base", qty: "24", name: "Mission cards", img: "core-mission.webp", w: 282, h: 204 },
    { set: "base", qty: "36", name: "Power cards", img: "core-power.webp", w: 282, h: 204 },
    { set: "base", qty: "18", name: "Relic cards", img: "core-relic.webp", w: 282, h: 210 },
    { set: "base", qty: "68", name: "Red Threat cards", img: "core-threat.webp", w: 282, h: 199 },
    { set: "base", qty: "68", name: "Blue Threat cards", img: "core-threat.webp", w: 282, h: 199 },
    { set: "base", qty: "68", name: "Yellow Threat cards", img: "core-threat.webp", w: 282, h: 199 },
    { set: "base", qty: "24", name: "Wargear cards", img: "core-wargear.webp", w: 282, h: 205 },

    /* ---- Relic: Nemesis (Nemesis p.2) ---- */
    { set: "nemesis", qty: "2", name: "Plastic character pieces", img: "nem-pieces.webp", w: 270, h: 231 },
    { set: "nemesis", qty: "4", name: "Plastic nemesis pieces", note: "Enemies of the Imperium mode (Nemesis p.4, p.6)", img: "nem-nemesis-pieces.webp", w: 320, h: 186, when: (c) => c.mod("eoti") },
    { set: "nemesis", qty: "2", name: "Plastic character bases", note: "In the two new player colours, red and black (Nemesis p.4)", img: "nem-bases.webp", w: 242, h: 181 },
    { set: "nemesis", qty: "7", name: "Relic cards", img: "nem-relic.webp", w: 320, h: 264 },
    { set: "nemesis", qty: "9", name: "Threat cards", img: "nem-threat.webp", w: 320, h: 264 },
    { set: "nemesis", qty: "24", name: "Wargear cards", img: "nem-wargear.webp", w: 320, h: 267 },
    { set: "nemesis", qty: "50", name: "Imperium cards", note: "Enemies of the Imperium mode (Nemesis p.4)", img: "nem-imperium.webp", w: 320, h: 186, when: (c) => c.mod("eoti") },
    { set: "nemesis", qty: "60", name: "Nemesis cards", note: "Enemies of the Imperium mode (Nemesis p.4)", img: "nem-nemesis-cards.webp", w: 320, h: 186, when: (c) => c.mod("eoti") },
    { set: "nemesis", qty: "4", name: "Scenario sheets", img: "nem-scenario.webp", w: 320, h: 252 },
    { set: "nemesis", qty: "2", name: "Character sheets", img: "nem-char-sheets.webp", w: 320, h: 251 },
    { set: "nemesis", qty: "4", name: "Nemesis sheets", note: "Enemies of the Imperium mode (Nemesis p.4)", img: "nem-nemesis-sheets.webp", w: 284, h: 320, when: (c) => c.mod("eoti") },
    { set: "nemesis", qty: "2", name: "Character boards and plastic level pegs", note: "In the two new player colours, red and black (Nemesis p.4)", img: "nem-boards.webp", w: 320, h: 165 },
    { set: "nemesis", qty: "2", name: "Nemesis boards", note: "Enemies of the Imperium mode (Nemesis p.4)", img: "nem-nemesis-boards.webp", w: 320, h: 133, when: (c) => c.mod("eoti") },
    { set: "nemesis", qty: "6", name: "Floating dials", note: "Enemies of the Imperium mode: attached to the nemesis boards (Nemesis p.3, p.6)", img: "nem-floating-dials.webp", w: 264, h: 200, when: (c) => c.mod("eoti") },
    { set: "nemesis", qty: "20", name: "Character tokens", note: "In the two new player colours, red and black (Nemesis p.4)", img: "nem-char-tokens.webp", w: 236, h: 203 },
    { set: "nemesis", qty: "20", name: "Nemesis tokens", note: "Enemies of the Imperium mode (Nemesis p.4)", img: "nem-nemesis-tokens.webp", w: 236, h: 203, when: (c) => c.mod("eoti") },

    /* ---- Relic: Halls of Terra (Halls of Terra p.2) ---- */
    { set: "halls", qty: "1", name: "Sol System game board", img: "hot-sol-board.webp", w: 320, h: 170, when: (c) => c.solBoard },
    { set: "halls", qty: "3", name: "Plastic character pieces", img: "hot-pieces.webp", w: 320, h: 199 },
    { set: "halls", qty: "3", name: "Character sheets", img: "hot-char-sheets.webp", w: 320, h: 259 },
    { set: "halls", qty: "12", name: "Blue, red, and yellow Threat cards", img: "hot-threat.webp", w: 320, h: 282 },
    { set: "halls", qty: "5", name: "Corruption cards", img: "hot-corruption.webp", w: 320, h: 298 },
    { set: "halls", qty: "10", name: "Mission cards", note: "Used only with the Sol System board (Halls of Terra p.3)", img: "hot-mission.webp", w: 320, h: 298, when: (c) => c.solBoard },
    { set: "halls", qty: "4", name: "Relic cards", img: "hot-relic.webp", w: 320, h: 270 },
    { set: "halls", qty: "9", name: "Champion cards", note: "Gained at the Sanctum Imperialis space (Halls of Terra p.8)", img: "hot-champion.webp", w: 320, h: 289, when: (c) => c.solBoard },
    { set: "halls", qty: "40", name: "Orange Threat cards", note: "A separate deck, drawn for the orange threat icons in the Mars and Holy Terra areas (Halls of Terra p.3, p.6)", img: "hot-orange-threat.webp", w: 320, h: 279, when: (c) => c.solBoard },
    { set: "halls", qty: "3", name: "Scenario sheets", img: "hot-scenario.webp", w: 320, h: 252 },
    { set: "halls", qty: "54", name: "Affiliation tokens", img: "hot-affiliation.webp", w: 298, h: 181 },
    { set: "halls", qty: "1", name: "Nemesis sheet", note: "Nemesis component: only with Relic: Nemesis in the Enemies of the Imperium mode (Halls of Terra p.8)", img: "hot-nemesis-sheet.webp", w: 215, h: 248, when: (c) => c.has("nemesis") && c.mod("eoti") },
    { set: "halls", qty: "1", name: "Plastic nemesis piece", note: "Nemesis component: only with Relic: Nemesis in the Enemies of the Imperium mode (Halls of Terra p.8)", img: "hot-nemesis-piece.webp", w: 237, h: 175, when: (c) => c.has("nemesis") && c.mod("eoti") },
    { set: "halls", qty: "9", name: "Imperium tokens", note: "Nemesis component: placed on Sol tier spaces in the Enemies of the Imperium mode (Halls of Terra p.8–9)", img: "hot-imperium-tokens.webp", w: 169, h: 124, when: (c) => c.has("nemesis") && c.mod("eoti") && c.solBoard },
    { set: "halls", qty: "15", name: "Nemesis cards", note: "Nemesis component: only with Relic: Nemesis in the Enemies of the Imperium mode (Halls of Terra p.8)", img: "hot-nemesis-cards.webp", w: 306, h: 188, when: (c) => c.has("nemesis") && c.mod("eoti") }
  ]
};
