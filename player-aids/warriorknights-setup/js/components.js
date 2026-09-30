/* =============================================================================
   Warrior Knights — Components glossary data (standard v1; rendered by js/comp-widget.js)
   Sources:
     Rules p.2 (Components list) and the Component Overview pictures on Rules p.2–5. The FAQ errata (FAQ p.1)
     corrects five counts in the list — 93 crowns, 44 Influence, 24 casualty tokens (all −100s), 18 single-sided
     breach tokens, 44 Agenda cards — and the corrected counts are shown, with the change noted.
     C&G p.1 (Component List). Crown and Glory has no pictured components page; its pictures are the captioned
     component illustrations beside the rules on C&G p.2–4 (Garrison token/card, Town Levy card, Knowledge token,
     Advancement card, Scholar token, new Fate card, Riot token, Mission card, King token, King's Army card).
     Items the sheet doesn't picture are listed without a picture.
   Gating: Crown and Glory items appear only with the variant that uses them (For Glory, Missions, The King —
     C&G p.1, p.4). For Glory replaces the original Fate deck (C&G p.1, p.3), so the base Fate cards are hidden then,
     and it swaps three of the eight Neutral Action cards (C&G p.1).
   The rulebook itself ("This Rulebook (24 pages)") is not listed as a component here.
   ============================================================================= */
window.AID_COMPONENTS = {   // standard v1.1 (per-set picture panel colour: the C&G sheet is printed on darker paper)
  sets: [
    { id: "base", name: "Warrior Knights", src: "Rules p.2–5 · FAQ p.1" },
    { id: "cg", name: "Crown and Glory", src: "C&G p.1–4", fig: "#e4e1cd", when: (c) => c.has("cg") }
  ],
  items: [
    { set: "base", qty: "1", name: "Game board", note: "18 Kingdom cities and 6 overseas cities, three expedition tracks, the Mercenary Track, and the Action card and Special Phase areas", img: "base-board.webp", w: 313, h: 320 },
    { set: "base", qty: "24", name: "Plastic Nobles", note: "In 6 colors: 4 per Baron, each on a square, circle, triangle or star base", img: "base-nobles.webp", w: 320, h: 149 },
    { set: "base", qty: "24", name: "Plastic cities", note: "Mark the cities that have not been razed", img: "base-cities.webp", w: 270, h: 215 },
    { set: "base", qty: "6", name: "Stronghold cards", note: "One per Baron: his name, color, crest and stronghold strength", img: "base-stronghold-cards.webp", w: 320, h: 118 },
    { set: "base", qty: "6", name: "Stronghold tokens", note: "1 per Baron — the rulebook also calls them stronghold markers", img: "base-stronghold-markers.webp", w: 273, h: 273 },
    { set: "base", qty: "24", name: "Noble cards", note: "4 per Baron, with an unexhausted and an exhausted side", img: "base-noble-cards.webp", w: 320, h: 134 },
    { set: "base", qty: "24", name: "Regular Troops cards", note: "4 per Baron", img: "base-regular-troops.webp", w: 320, h: 133 },
    { set: "base", qty: "66", name: "Mercenary Troop cards", note: "Nationality at the bottom left", img: "base-mercenaries.webp", w: 320, h: 143 },
    { set: "base", qty: "24", name: "Fate cards", img: "base-fate.webp", w: 320, h: 181,
      when: (c) => !(c.has("cg") && c.mod("fg")) },
    { set: "base", qty: "36", name: "Event cards", note: "Red, green or blue backs", img: "base-events.webp", w: 320, h: 175 },
    { set: "base", qty: "44", name: "Agenda cards", note: "FAQ errata: 44, not the 45 in the rulebook's list (FAQ p.1)", img: "base-agendas.webp", w: 320, h: 141 },
    { set: "base", qty: "12 per Baron", name: "Baron Action cards", note: "The list counts 80 Action cards: 12 per Baron and 8 Neutral", img: "base-baron-actions.webp", w: 320, h: 177 },
    { set: "base", qty: "8", name: "Neutral Action cards", img: "base-neutral-actions.webp", w: 320, h: 181,
      when: (c) => !(c.has("cg") && c.mod("fg")) },
    { set: "base", qty: "8", name: "Neutral Action cards", note: "For Glory: Uncertain Times, Muster Troops and Upgrade Defenses are taken out and replaced by the expansion's versions (C&G p.1)", img: "base-neutral-actions.webp", w: 320, h: 181,
      when: (c) => c.has("cg") && c.mod("fg") },
    { set: "base", qty: "93", name: "Crown tokens", note: "In 1s and 5s. FAQ errata: 93, not 78 (FAQ p.1)", img: "base-crowns.webp", w: 320, h: 216 },
    { set: "base", qty: "40", name: "Vote tokens", note: "In 1s and 3s", img: "base-votes.webp", w: 320, h: 158 },
    { set: "base", qty: "36", name: "Faith tokens", img: "base-faith.webp", w: 212, h: 205 },
    { set: "base", qty: "44", name: "Influence tokens", note: "In 1s, 3s and 5s. FAQ errata: 44, not 40 (FAQ p.1)", img: "base-influence.webp", w: 320, h: 82 },
    { set: "base", qty: "24", name: "Casualty tokens", note: "All −100s. FAQ errata: 24, not 28 in 1s and 2s (FAQ p.1)", img: "base-casualty.webp", w: 154, h: 199 },
    { set: "base", qty: "18", name: "Breach tokens", note: "Single-sided. FAQ errata: 18, not 21 double-sided (FAQ p.1)", img: "base-breach.webp", w: 193, h: 193 },
    { set: "base", qty: "48", name: "Baron markers", note: "8 for each Baron", img: "base-baron-markers.webp", w: 154, h: 178 },
    { set: "base", qty: "3", name: "Expedition markers", note: "Pictured as expedition tokens", img: "base-expedition.webp", w: 181, h: 185 },
    { set: "base", qty: "12", name: "Siege markers", img: "base-siege.webp", w: 199, h: 224 },
    { set: "base", qty: "72", name: "Control markers", note: "12 for each Baron; double-sided — unfortified and fortified", img: "base-control-markers.webp", w: 320, h: 186 },
    { set: "base", qty: "1", name: "Chairman of the Assembly token", img: "base-chairman.webp", w: 195, h: 320 },
    { set: "base", qty: "1", name: "Head of the Church token", img: "base-head-church.webp", w: 195, h: 320 },

    { set: "cg", qty: "48", name: "Fate cards", note: "The new blue-backed Fate deck: replaces the original Fate deck (C&G p.1, p.3)", img: "cg-fate.webp", w: 230, h: 218,
      when: (c) => c.mod("fg") },
    { set: "cg", qty: "44", name: "Advancement cards", img: "cg-advancements.webp", w: 245, h: 230,
      when: (c) => c.mod("fg") },
    { set: "cg", qty: "20", name: "Event cards", note: "Shuffled into the Event deck",
      when: (c) => c.mod("fg") },
    { set: "cg", qty: "25", name: "Agenda cards", note: "Shuffled into the Agenda deck",
      when: (c) => c.mod("fg") },
    { set: "cg", qty: "18", name: "Baron Action cards", note: "3 in each Baron color: Forced March and two Enrich Mind",
      when: (c) => c.mod("fg") },
    { set: "cg", qty: "7", name: "Neutral Action cards", note: "3 replacements (Uncertain Times, Muster Forces, Upgrade Defenses) and 4 new (two Research, A Pressing Agenda, Assemble Troops) (C&G p.1, p.3)",
      when: (c) => c.mod("fg") },
    { set: "cg", qty: "12", name: "Mercenary cards", note: "A Leader and a Herald for each of the six nationalities",
      when: (c) => c.mod("fg") },
    { set: "cg", qty: "8", name: "Garrison cards", img: "cg-garrison-cards.webp", w: 245, h: 230,
      when: (c) => c.mod("fg") },
    { set: "cg", qty: "18", name: "Town Levy cards", note: "Each names a Kingdom city and shows a mini-map of it", img: "cg-town-levies.webp", w: 245, h: 227,
      when: (c) => c.mod("fg") },
    { set: "cg", qty: "8", name: "Garrison tokens", img: "cg-garrison-tokens.webp", w: 105, h: 118,
      when: (c) => c.mod("fg") },
    { set: "cg", qty: "10", name: "Riot tokens", img: "cg-riot.webp", w: 105, h: 110,
      when: (c) => c.mod("fg") },
    { set: "cg", qty: "19", name: "Knowledge tokens", img: "cg-knowledge.webp", w: 108, h: 114,
      when: (c) => c.mod("fg") },
    { set: "cg", qty: "1", name: "Scholar token", img: "cg-scholar.webp", w: 245, h: 93,
      when: (c) => c.mod("fg") },
    { set: "cg", qty: "10", name: "Mission cards", note: "Used with the Missions variant", img: "cg-missions.webp", w: 227, h: 215,
      when: (c) => c.mod("mis") },
    { set: "cg", qty: "6", name: "King's Army cards", note: "Used with The King variant", img: "cg-kings-army.webp", w: 233, h: 224,
      when: (c) => c.mod("king") },
    { set: "cg", qty: "1", name: "King token", note: "Used with The King variant", img: "cg-king-token.webp", w: 178, h: 163,
      when: (c) => c.mod("king") }
  ]
};
