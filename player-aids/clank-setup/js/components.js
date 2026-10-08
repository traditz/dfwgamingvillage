/* =============================================================================
   Clank! A Deck-Building Adventure — Components glossary data (standard v1.1; rendered by js/comp-widget.js)
   Sources (component lists): Base p.1 · Sunken p.1 · Mummy p.1 · Gold & Silk p.1 · Ape Lords p.1 · Adventuring
   Party p.1 (the FAQ has no component list). Pictures cropped from those pages. Base, Sunken, Mummy, Gold & Silk and
   Ape Lords print no page numbers and are cited by PDF page (cover/components page = p.1). Adventuring Party's printed
   page numbers (2–8) equal its PDF pages, and its unnumbered components page is p.1.
   Board gating (c.board): each game board shows only when chosen. Components the rulebooks tie to a board show only
   with it: Sunken — Goldfish card, SCUBA (Sunken p.1); Mummy — marker, card, pyramid die, Supreme Monkey Idol and its
   secrets (Mummy p.2); Dwarven Mine — Mining Bonus tokens (Gold & Silk p.1); Spider Queen's Lair — Web tokens and the
   8-point artifact that replaces the 7-point one (Gold & Silk p.2); Jungle/Temple — Time Winders, ape-aratus tokens and
   the 33-point artifact that replaces the 30 (Ape Lords p.2); Temple only — gear and RNG tokens (Ape Lords p.1, p.3).
   Everything else in a selected set shows with any board, as its rulebook says ("whether you use a new board or one of
   the original boards"). Adventuring Party: 5–6-player components at 5–6 players; cards, Invisibility Cloaks and Gold
   also at 2–4 (Adventuring Party p.2–3); character decks replace the regular starting decks (Adventuring Party p.5).
   ============================================================================= */
window.AID_COMPONENTS = {
  sets: [
    { id: "base", name: "Clank! A Deck-Building Adventure", src: "Base p.1" },
    { id: "sunken", name: "Sunken Treasures", src: "Sunken p.1", when: (c) => c.has("sunken") },
    { id: "mummy", name: "The Mummy’s Curse", src: "Mummy p.1", when: (c) => c.has("mummy") },
    { id: "goldsilk", name: "Expeditions: Gold and Silk", src: "Gold & Silk p.1", when: (c) => c.has("goldsilk") },
    { id: "apelords", name: "Expeditions: Temple of the Ape Lords", src: "Ape Lords p.1", when: (c) => c.has("apelords") },
    { id: "party", name: "Adventuring Party", src: "Adventuring Party p.1", when: (c) => c.has("party") }
  ],
  items: [
    { set: "base", name: "Double-sided game board", img: "base-game-board.webp", w: 320, h: 314, when: (c) => c.board === "front" || c.board === "back" },
    { set: "base", qty: "100", name: "Dungeon Deck cards", img: "base-dungeon-deck.webp", w: 320, h: 216 },
    { set: "base", name: "Reserve cards", note: "15 Mercenary, 15 Explore, 12 Secret Tome, 1 Goblin", img: "base-reserve-cards.webp", w: 320, h: 163 },
    { set: "base", qty: "4", name: "10-card starting decks", note: "Each containing 6 Burgle, 2 Stumble, 1 Sidestep, 1 Scramble", img: "base-starting-decks.webp", w: 320, h: 159, when: (c) => !c.mod("chars") },
    { set: "base", qty: "120", name: "Clank! cubes", note: "30 of each player color", img: "base-clank-cubes.webp", w: 288, h: 270 },
    { set: "base", qty: "4", name: "Player pawns", img: "base-pawns.webp", w: 320, h: 94 },
    { set: "base", qty: "7", name: "Artifacts", img: "base-artifacts.webp", w: 215, h: 199 },
    { set: "base", qty: "11", name: "Major secrets", img: "base-major-secrets.webp", w: 217, h: 181 },
    { set: "base", qty: "18", name: "Minor secrets", img: "base-minor-secrets.webp", w: 175, h: 178 },
    { set: "base", qty: "2", name: "Master Keys", img: "base-master-keys.webp", w: 148, h: 150 },
    { set: "base", qty: "3", name: "Crowns", note: "Valued 10, 9 and 8 (Base p.2)", img: "base-crowns.webp", w: 166, h: 156 },
    { set: "base", qty: "2", name: "Backpacks", img: "base-backpacks.webp", w: 154, h: 150 },
    { set: "base", qty: "3", name: "Monkey Idols", img: "base-monkey-idols.webp", w: 172, h: 147 },
    { set: "base", qty: "4", name: "Mastery tokens", note: "One for each player (Base p.2)", img: "base-mastery-tokens.webp", w: 187, h: 138 },
    { set: "base", name: "Gold", note: "Valued 1 and 5 (Base p.2)", img: "base-gold.webp", w: 314, h: 147 },
    { set: "base", name: "Dragon marker", img: "base-dragon-marker.webp", w: 183, h: 273 },
    { set: "base", qty: "24", name: "Dragon cubes", img: "base-dragon-cubes.webp", w: 128, h: 123 },
    { set: "base", name: "Dragon bag", img: "base-dragon-bag.webp", w: 242, h: 320 },
    { set: "sunken", name: "Double-sided game board", note: "Replaces the original game board when you play on it (Sunken p.1)", img: "sunken-game-board.webp", w: 320, h: 317, when: (c) => c.board === "sunken" },
    { set: "sunken", qty: "35", name: "Dungeon Deck cards", note: "Used with any board (Sunken p.1)", img: "sunken-dungeon-cards.webp", w: 320, h: 218 },
    { set: "sunken", name: "Goldfish card", note: "Sunken Treasures board: goes in the Reserve next to the Goblin (Sunken p.1)", img: "sunken-goldfish.webp", w: 194, h: 258, when: (c) => c.board === "sunken" },
    { set: "sunken", qty: "2", name: "SCUBA", note: "Sunken Treasures board: placed with the other Market Items (Sunken p.1)", img: "sunken-scuba.webp", w: 154, h: 148, when: (c) => c.board === "sunken" },
    { set: "sunken", qty: "1", name: "Major secret", note: "Potion of Heroism. Mixed in with any board (Sunken p.1)", img: "sunken-major-secret.webp", w: 157, h: 156 },
    { set: "sunken", qty: "2", name: "Minor secrets", note: "Potion of Strength and Treasure. Mixed in with any board (Sunken p.1)", img: "sunken-minor-secrets.webp", w: 191, h: 120 },
    { set: "sunken", name: "Market Board", note: "Used with any board: all Market items go on it (Sunken p.1)", img: "sunken-market-board.webp", w: 320, h: 150 },
    { set: "mummy", name: "Double-sided game board", img: "mummy-game-board.webp", w: 320, h: 318, when: (c) => c.board === "mummy" },
    { set: "mummy", qty: "40", name: "Dungeon Deck cards", note: "Used with any board (Mummy p.2)", img: "mummy-dungeon-cards.webp", w: 320, h: 229 },
    { set: "mummy", name: "Mummy marker", img: "mummy-mummy-marker.webp", w: 147, h: 169, when: (c) => c.board === "mummy" },
    { set: "mummy", qty: "2", name: "Ankhs", note: "Market items, used with any board (Mummy p.2)", img: "mummy-ankhs.webp", w: 153, h: 147 },
    { set: "mummy", qty: "2", name: "Major secrets", note: "Mummy’s Treasure and Mummy’s Chalice. Used with a Mummy’s Curse board (Mummy p.2)", img: "mummy-major-secrets.webp", w: 233, h: 159, when: (c) => c.board === "mummy" },
    { set: "mummy", qty: "2", name: "Minor secrets", note: "Two Scarabs. Used with a Mummy’s Curse board (Mummy p.2)", img: "mummy-minor-secrets.webp", w: 188, h: 126, when: (c) => c.board === "mummy" },
    { set: "mummy", name: "Market Board", note: "Used with any board: all Market items go on it (Mummy p.2)", img: "mummy-market-board.webp", w: 320, h: 146 },
    { set: "mummy", name: "Mummy card", note: "Goes in the Reserve next to the Goblin (Mummy p.2)", img: "mummy-mummy-card.webp", w: 261, h: 190, when: (c) => c.board === "mummy" },
    { set: "mummy", name: "Pyramid die", img: "mummy-pyramid-die.webp", w: 151, h: 135, when: (c) => c.board === "mummy" },
    { set: "mummy", qty: "24", name: "Curse tokens", note: "Used with any board. Not limited: substitute if you run out (Mummy p.2)", img: "mummy-curse-tokens.webp", w: 320, h: 298 },
    { set: "mummy", name: "The Supreme Monkey Idol", note: "Worth 10 points (Mummy p.4)", img: "mummy-supreme-idol.webp", w: 160, h: 157, when: (c) => c.board === "mummy" },
    { set: "mummy", name: "Dragon marker", note: "Optional: may replace the original Dragon marker (Mummy p.1)", img: "mummy-dragon-marker.webp", w: 166, h: 208 },
    { set: "goldsilk", name: "Double-sided game board", note: "Dwarven Mine and Spider Queen’s Lair", img: "goldsilk-game-board.webp", w: 320, h: 312, when: (c) => c.board === "mine" || c.board === "spider" },
    { set: "goldsilk", name: "Spider marker", note: "Optional: may replace the original Dragon marker (Gold & Silk p.1)", img: "goldsilk-spider-marker.webp", w: 239, h: 233 },
    { set: "goldsilk", name: "Market Board", note: "You may place market items here during setup (Gold & Silk p.1)", img: "goldsilk-market-board.webp", w: 320, h: 137 },
    { set: "goldsilk", name: "8-point artifact", note: "Spider Queen’s Lair: replaces the 7-point artifact (Gold & Silk p.2)", img: "goldsilk-8pt-artifact.webp", w: 152, h: 148, when: (c) => c.board === "spider" },
    { set: "goldsilk", qty: "3", name: "Mining Bonus tokens", note: "Dwarven Mine: 20, 10 and 5 points (Gold & Silk p.1)", img: "goldsilk-mining-bonus.webp", w: 320, h: 113, when: (c) => c.board === "mine" },
    { set: "goldsilk", name: "Gold", note: "Adds to your existing tokens to increase the size of the bank (Gold & Silk p.1)", img: "goldsilk-gold.webp", w: 320, h: 96 },
    { set: "goldsilk", qty: "12", name: "Web tokens", note: "Spider Queen’s Lair (Gold & Silk p.2)", img: "goldsilk-web-tokens.webp", w: 320, h: 113, when: (c) => c.board === "spider" },
    { set: "goldsilk", qty: "4", name: "Player pawns", note: "Optional: may replace the original player pawns (Gold & Silk p.1)", img: "goldsilk-pawns.webp", w: 320, h: 81 },
    { set: "apelords", name: "Double-sided game board", note: "Jungle side and Temple side", img: "apelords-game-board.webp", w: 318, h: 320, when: (c) => c.board === "jungle" || c.board === "temple" },
    { set: "apelords", qty: "2", name: "Time Winders", note: "Market items, used on both sides of this board (Ape Lords p.2)", img: "apelords-time-winders.webp", w: 154, h: 151, when: (c) => c.board === "jungle" || c.board === "temple" },
    { set: "apelords", qty: "8", name: "Rotation of Numerous Gears (RNG) tokens", note: "Used only on the Temple side of the board", img: "apelords-rng-tokens.webp", w: 273, h: 243, when: (c) => c.board === "temple" },
    { set: "apelords", qty: "18", name: "Ape-aratus tokens", note: "6 cogs, 6 monkey wrenches and 6 bananas", img: "apelords-ape-aratus.webp", w: 320, h: 112, when: (c) => c.board === "jungle" || c.board === "temple" },
    { set: "apelords", name: "Boss marker", note: "Optional: may replace the original Dragon Marker (Ape Lords p.1)", img: "apelords-boss-marker.webp", w: 320, h: 234 },
    { set: "apelords", qty: "4", name: "Player pawns", note: "Optional: may replace the original player pawns (Ape Lords p.1)", img: "apelords-pawns.webp", w: 320, h: 79 },
    { set: "apelords", name: "33-point artifact", note: "Replaces the 30-point artifact on both sides of this board (Ape Lords p.2)", img: "apelords-33pt-artifact.webp", w: 210, h: 224, when: (c) => c.board === "jungle" || c.board === "temple" },
    { set: "apelords", qty: "9", name: "Gear tokens", note: "4 three-sided, 4 four-sided, 1 five-sided. Used only on the Temple side of the board", img: "apelords-gear-tokens.webp", w: 320, h: 89, when: (c) => c.board === "temple" },
    { set: "apelords", qty: "3", name: "Campaign tokens", note: "Used only for the Mini-Campaign", img: "apelords-campaign-tokens.webp", w: 320, h: 230, when: (c) => c.mod("campaign") },
    { set: "party", qty: "35", name: "Dungeon Deck cards", note: "Usable with any player count (Adventuring Party p.3)", img: "party-dungeon-cards.webp", w: 320, h: 267 },
    { set: "party", qty: "12", name: "Reserve cards", note: "4 Mercenary, 4 Explore, 4 Secret Tome", img: "party-reserve-cards.webp", w: 320, h: 213, when: (c) => c.p >= 5 },
    { set: "party", qty: "2", name: "Regular 10-card starting decks", note: "For the fifth and sixth players, identical to the others (Adventuring Party p.2)", img: "party-regular-decks.webp", w: 320, h: 124, when: (c) => c.p >= 5 && !c.mod("chars") },
    { set: "party", qty: "6", name: "10-card Character starting decks", note: "Characters module: each replaces a player’s regular starting deck (Adventuring Party p.5)", img: "party-character-decks.webp", w: 320, h: 151, when: (c) => c.mod("chars") },
    { set: "party", qty: "6", name: "Player pawns", img: "party-pawns.webp", w: 320, h: 227, when: (c) => c.p >= 5 },
    { set: "party", qty: "6", name: "Character boards", note: "Characters module (Adventuring Party p.5)", img: "party-character-boards.webp", w: 320, h: 193, when: (c) => c.mod("chars") },
    { set: "party", qty: "60", name: "Clank! cubes", note: "30 in two new player colors", img: "party-clank-cubes.webp", w: 245, h: 141, when: (c) => c.p >= 5 },
    { set: "party", name: "Side board", note: "Holds the new Rage Track and the fifth and sixth players’ Health Meters (Adventuring Party p.2)", img: "party-side-board.webp", w: 320, h: 42, when: (c) => c.p >= 5 },
    { set: "party", qty: "18", name: "Minor secrets", note: "With 5–6 players all minor secrets go face down in the Bank, none on the board (Adventuring Party p.2)", img: "party-minor-secrets.webp", w: 166, h: 123, when: (c) => c.p >= 5 },
    { set: "party", qty: "5", name: "Artifacts", note: "Silver versions, stacked under the gold originals of the same value (Adventuring Party p.2)", img: "party-artifacts.webp", w: 172, h: 129, when: (c) => c.p >= 5 },
    { set: "party", qty: "1 each", name: "Backpack, Crown and Master Key", img: "party-market-items.webp", w: 239, h: 151, when: (c) => c.p >= 5 },
    { set: "party", qty: "3", name: "Invisibility Cloaks", note: "With 4 or fewer players you may use two, not all three (Adventuring Party p.2)", img: "party-cloaks.webp", w: 172, h: 98 },
    { set: "party", qty: "2", name: "Mastery tokens", img: "party-mastery-tokens.webp", w: 166, h: 121, when: (c) => c.p >= 5 },
    { set: "party", name: "Market Board", note: "Becomes your Market area (Adventuring Party p.2)", img: "party-market-board.webp", w: 320, h: 155, when: (c) => c.p >= 5 },
    { set: "party", name: "Gold", note: "Gold is not limited: you may add it with any player count (Adventuring Party p.2)", img: "party-gold.webp", w: 282, h: 196 },
    { set: "party", name: "Boss marker", note: "Optional: may replace the Dragon marker (Adventuring Party p.2)", img: "party-boss-marker.webp", w: 319, h: 255, when: (c) => c.p >= 5 },
    { set: "party", name: "Character tokens", note: "4 Conscription, 1 Carnage, 10 Mana, 7 Cogwheel, 3 Behavior", img: "party-character-tokens.webp", w: 320, h: 60, when: (c) => c.mod("chars") }
  ]
};
