/* =============================================================================
   World of Warcraft: The Board Game — Components glossary data (standard v1; rendered by js/comp-widget.js)
   Sources: Base p.2 (components list) with pictures from the Component Overview, Base p.2–5;
   Shadow of War p.2 (list) with pictures from p.2–3; The Burning Crusade p.2–3 (list) with pictures
   from p.3–7. Gating:
   - The Burning Crusade's two Creature Reference Sheets replace the base sheets (TBC p.7–8, even without
     Outland); its Paladin/Shaman sheets replace the base single-sided sheets (TBC p.4, p.7 step 3 — part
     of the Outland setup, which "Playing Without Outland" replaces, TBC p.19).
   - Overlord-specific pieces (Kel'Thuzad Event cards, Overlord counters, Ragnaros token) show only for that
     Overlord (Base p.5, p.8; TBC p.4–5).
   - Shadow of War's card groups follow its five parts (it may be used in part, SoW p.2).
   - Outland-only pieces hide when playing Without Outland (TBC p.19); TBC's blue quests need Shadow of
     War's blue quests and the Outland board (TBC p.5).
   ============================================================================= */
window.AID_COMPONENTS = {
  sets: [
    { id: "base", name: "World of Warcraft: The Board Game", src: "Base p.2–5" },
    { id: "sow", name: "Shadow of War", src: "Shadow of War p.2–3", fig: "#ecd988", when: (c) => c.has("sow") },
    { id: "tbc", name: "The Burning Crusade", src: "The Burning Crusade p.2–7", fig: "#efd594", when: (c) => c.has("tbc") }
  ],
  items: [
    { set: "base", qty: "1", name: "Game board", note: "The seven areas of Lordaeron", img: "base-board.webp", w: 320, h: 214 },
    { set: "base", qty: "120", name: "Plastic creature figures", note: "Green / red / blue: Murlocs, Gnolls and Scarlet Crusaders 8/4/4 each; Ghouls and Wraiths 6/3/3; Naga, Giant Spiders and Worgen 4/2/2; Wildkin and Ogres 4/1/1; Doom Guards, Drakes and Infernals 2/1/1", img: "base-creatures.webp", w: 320, h: 218 },
    { set: "base", qty: "16", name: "Plastic character figures", note: "Eight Horde and eight Alliance characters", img: "base-char-figures.webp", w: 320, h: 195 },
    { set: "base", qty: "7", name: "Double-sided character sheets", note: "Horde character on the red side, Alliance on the blue side, same class", img: "base-char-sheets.webp", w: 320, h: 232 },
    { set: "base", qty: "2", name: "Single-sided character sheets", note: "The Shaman (Horde) and the Paladin (Alliance). With Outland, The Burning Crusade’s sheets replace them (TBC p.4)",
      img: "base-char-sheets.webp", w: 320, h: 232, when: (c) => !c.mod("outland") },
    { set: "base", qty: "63", name: "Character counters", note: "7 for each class", img: "base-counters.webp", w: 320, h: 104 },
    { set: "base", qty: "15", name: "Cardboard Stun tokens", img: "base-stun.webp", w: 169, h: 173 },
    { set: "base", qty: "15", name: "Cardboard Curse tokens", img: "base-curse.webp", w: 166, h: 176 },
    { set: "base", qty: "6", name: "Cardboard Bag tokens", note: "Holds up to 3 Item cards", img: "base-bag.webp", w: 252, h: 282 },
    { set: "base", qty: "6", name: "Cardboard Spellbook tokens", img: "base-spellbook.webp", w: 224, h: 312 },
    { set: "base", qty: "1", name: "Turn marker", img: "base-turn-marker.webp", w: 160, h: 157 },
    { set: "base", qty: "216", name: "Class cards", note: "For 9 distinct classes: 24 per class — 12 Power and 12 Talent cards", img: "base-class-cards.webp", w: 320, h: 175 },
    { set: "base", qty: "120", name: "Item cards", note: "Triangle, Square, Circle and Special Item (cup) decks", img: "base-item-cards.webp", w: 320, h: 157 },
    { set: "base", qty: "40", name: "Alliance Quest cards", note: "Grey, green, yellow and red decks", img: "base-quest-cards.webp", w: 320, h: 190 },
    { set: "base", qty: "40", name: "Horde Quest cards", note: "Grey, green, yellow and red decks", img: "base-quest-cards.webp", w: 320, h: 190 },
    { set: "base", qty: "47", name: "Event cards", img: "base-event-cards.webp", w: 320, h: 208 },
    { set: "base", qty: "5", name: "Kel’Thuzad Event cards", note: "Used only when Kel’Thuzad is the Overlord (Base p.8)",
      when: (c) => c.mod("ov-kt") },
    { set: "base", qty: "3", name: "Overlord sheets", note: "Kel’Thuzad, Nefarian and Lord Kazzak; a 4-character and a 6-character side", img: "base-overlord-sheets.webp", w: 320, h: 200 },
    { set: "base", qty: "58", name: "Energy tokens", note: "In 1’s and 3’s", img: "base-energy.webp", w: 291, h: 261 },
    { set: "base", qty: "58", name: "Health tokens", note: "In 1’s and 3’s", img: "base-health.webp", w: 294, h: 258 },
    { set: "base", qty: "138", name: "Gold tokens", note: "In 1’s and 3’s", img: "base-gold.webp", w: 320, h: 165 },
    { set: "base", qty: "40", name: "Hit tokens", img: "base-hit.webp", w: 121, h: 138 },
    { set: "base", qty: "20", name: "Armor tokens", img: "base-armor.webp", w: 130, h: 144 },
    { set: "base", qty: "21", name: "Eight-sided dice", note: "7 red (melee), 7 blue (magic and ranged) and 7 green (armor)", img: "base-dice.webp", w: 279, h: 93 },
    { set: "base", qty: "2", name: "Creature Reference Sheets", note: "Creature values on one side, a rules summary on the other",
      img: "base-creature-ref.webp", w: 245, h: 307, when: (c) => !c.has("tbc") },
    { set: "base", qty: "5", name: "Lord Kazzak Overlord counters", img: "base-overlord-counters.webp", w: 320, h: 118, when: (c) => c.mod("ov-kaz") },
    { set: "base", qty: "1", name: "Kel’Thuzad Overlord counter", img: "base-overlord-counters.webp", w: 320, h: 118, when: (c) => c.mod("ov-kt") },
    { set: "base", qty: "1", name: "Nefarian Overlord counter", img: "base-overlord-counters.webp", w: 320, h: 118, when: (c) => c.mod("ov-nef") },
    { set: "base", qty: "5", name: "Point of Interest tokens", img: "base-poi.webp", w: 234, h: 233 },
    { set: "base", qty: "6", name: "Alliance Quest tokens", img: "base-quest-token-alliance.webp", w: 242, h: 215 },
    { set: "base", qty: "6", name: "Horde Quest tokens", img: "base-quest-token-horde.webp", w: 242, h: 212 },
    { set: "base", qty: "8", name: "War tokens", note: "2 each of four different colors", img: "base-war.webp", w: 300, h: 233 },
    { set: "base", qty: "12", name: "Action tokens", note: "Two per player", img: "base-action.webp", w: 181, h: 178 },

    { set: "sow", qty: "90", name: "Power cards", note: "10 for each of the 9 classes", when: (c) => c.mod("sow-class") },
    { set: "sow", qty: "90", name: "Talent cards", note: "10 for each of the 9 classes", when: (c) => c.mod("sow-class") },
    { set: "sow", qty: "32", name: "Triangle Item cards", when: (c) => c.mod("sow-items") },
    { set: "sow", qty: "18", name: "Square Item cards", when: (c) => c.mod("sow-items") },
    { set: "sow", qty: "25", name: "Circle Item cards", when: (c) => c.mod("sow-items") },
    { set: "sow", qty: "20", name: "Special Item cards", when: (c) => c.mod("sow-items") },
    { set: "sow", qty: "103", name: "Bonus Item cards", note: "Green star backs; a fifth Item deck", img: "sow-item-cards.webp", w: 285, h: 181, when: (c) => c.mod("sow-items") },
    { set: "sow", qty: "25", name: "Blue Quest cards", img: "sow-blue-quests.webp", w: 320, h: 212, when: (c) => c.mod("sow-blue") },
    { set: "sow", qty: "26", name: "Event cards", when: (c) => c.mod("sow-events") },
    { set: "sow", qty: "39", name: "Destiny cards", note: "Some are specific to Kel’Thuzad, Lord Kazzak or Nefarian", img: "sow-destiny.webp", w: 320, h: 212, when: (c) => c.mod("sow-destiny") },

    { set: "tbc", name: "Outland game board", note: "The seven areas of Outland; carries its own Experience Track", img: "tbc-board.webp", w: 318, h: 320, when: (c) => c.mod("outland") },
    { set: "tbc", qty: "51", name: "Plastic creature figures", note: "Abominations, Arakkoas, Fungal Giants, Mo’arg, Shivan, Wrath Guards and Yeti: 1 green, 1 red, 1 purple, 1 blue each; Oozes and Ravagers: 2 green, 1 red, 1 purple, 1 blue each; plus 1 purple of each of the 13 base creature types", img: "tbc-creatures.webp", w: 320, h: 223 },
    { set: "tbc", qty: "2", name: "Plastic character figures", note: "Alliance Shaman (Draenei) and Horde Paladin (Blood Elf)", img: "tbc-char-figures.webp", w: 320, h: 249, when: (c) => c.mod("outland") },
    { set: "tbc", qty: "2", name: "Character sheets", note: "Replace the base game’s Shaman and Paladin sheets (TBC p.4)", img: "tbc-char-sheets.webp", w: 320, h: 169, when: (c) => c.mod("outland") },
    { set: "tbc", qty: "9", name: "Level 6 character sheet extensions", note: "1 for each of the 9 classes", img: "tbc-extension.webp", w: 121, h: 320, when: (c) => c.mod("outland") },
    { set: "tbc", qty: "14", name: "Character counters", note: "7 for each new character", img: "tbc-counters.webp", w: 320, h: 117, when: (c) => c.mod("outland") },
    { set: "tbc", qty: "15", name: "Poison tokens", img: "tbc-poison.webp", w: 260, h: 261 },
    { set: "tbc", qty: "1", name: "Ragnaros Overlord counter", img: "tbc-ragnaros-counter.webp", w: 221, h: 218, when: (c) => c.mod("ov-rag") },
    { set: "tbc", qty: "1", name: "Ragnaros token", note: "Tracks the progress of combat against Ragnaros", img: "tbc-ragnaros-token.webp", w: 160, h: 157, when: (c) => c.mod("ov-rag") },
    { set: "tbc", qty: "20", name: "Hit tokens", note: "Extra hit tokens; if you still run out, use gold tokens" },
    { set: "tbc", qty: "54", name: "Class cards", note: "6 for each of the 9 classes, all level 6", img: "tbc-class-cards.webp", w: 320, h: 177, when: (c) => c.mod("outland") },
    { set: "tbc", qty: "38", name: "Hexagon Item cards", note: "The orange Item deck", img: "tbc-item-cards.webp", w: 320, h: 157, when: (c) => c.mod("outland") },
    { set: "tbc", qty: "5", name: "Special Item cards", when: (c) => c.mod("outland") },
    { set: "tbc", qty: "44", name: "Alliance Quest cards", note: "Includes the new purple deck and Outland quests (green background; left out Without Outland)", img: "tbc-quest-cards.webp", w: 320, h: 199 },
    { set: "tbc", qty: "44", name: "Horde Quest cards", note: "Includes the new purple deck and Outland quests (green background; left out Without Outland)", img: "tbc-quest-cards.webp", w: 320, h: 199 },
    { set: "tbc", qty: "18", name: "Blue Quest cards", note: "Added to Shadow of War’s blue Quest deck when playing with the Outland board", img: "tbc-blue-quests.webp", w: 320, h: 189,
      when: (c) => c.mod("outland") && c.mod("sow-blue") },
    { set: "tbc", qty: "4", name: "Event cards", note: "Shuffled into the Event deck", img: "tbc-event-cards.webp", w: 320, h: 203 },
    { set: "tbc", qty: "6", name: "Flying Mount cards", note: "Gryphons (Alliance) and Windriders (Horde)", img: "tbc-flying-mounts.webp", w: 320, h: 111, when: (c) => c.mod("outland") },
    { set: "tbc", qty: "177", name: "Dungeon cards", note: "Boss, Minion, Item and Reward cards in each dungeon’s Stage decks", img: "tbc-dungeon-cards.webp", w: 320, h: 182, when: (c) => c.mod("outland") },
    { set: "tbc", qty: "4", name: "Dungeon tokens", note: "Mark the four Lordaeron dungeons", img: "tbc-dungeon-tokens.webp", w: 320, h: 92, when: (c) => c.mod("outland") },
    { set: "tbc", qty: "4", name: "Overlord sheets", note: "Kael’Thas, Lady Vashj and Illidan Stormrage (Outland Overlords) and Ragnaros", img: "tbc-overlord-sheets.webp", w: 320, h: 185 },
    { set: "tbc", qty: "9", name: "Eight-sided dice", note: "3 red, 3 blue and 3 green — the limit becomes 10 per colour", img: "tbc-dice.webp", w: 320, h: 102 },
    { set: "tbc", qty: "2", name: "Creature Reference Sheets", note: "Replace the base game’s sheets, even without Outland (TBC p.8)", img: "tbc-creature-ref.webp", w: 320, h: 235 }
  ]
};
