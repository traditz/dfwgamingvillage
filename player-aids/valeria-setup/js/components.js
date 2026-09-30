/* =============================================================================
   Valeria: Card Kingdoms — Components glossary data (standard format v1; rendered by js/comp-widget.js)
   Sources (printed pages): Base Rulebook p.2 ("Game Material", pictured) · Crimson Seas p.2 ("Components",
   a text list: no pictures) · Darksworn Rulebook p.2 ("Contents", a text list: no pictures).
   No components list: the Flames & Frost and Shadowvale rulesheets and the Combined Expansions Setup Guide
   (mini-expansions), so those sets are left out.
   Darksworn's lines "1 Story and 1 Aquila Board" and "5 Number and 5 Wall Tiles" are split into one entry
   per component. Crimson Seas prints "Coxwain" in its list and "Coxswain" in its setup; the list's spelling
   is kept.
   Gating: Monster Event cards (base and Crimson Seas) show only with the Monster Event module (Base Rulebook
   p.12 · Crimson Seas p.10); Darksworn's contents are only for the Darksworn co-op saga, so that set shows
   only in that way to play.
   The Darksworn saga has its own setup (Darksworn p.2–3): it deals no Dukes and builds no Domain stacks or
   Exhausted stack; it removes the Buy a Domain action, turns Domain rewards into 5 Gold, adds no Exhausted
   card to an emptied Monster slot, uses no starter but the Explorer, Peasant and Knight, and replaces the
   base game's End Phase, ending and scoring (Darksworn p.3, p.8, p.11–12). So in that mode the base Dukes, Domains and Exhausted
   cards are hidden, and so are Crimson Seas' pieces, which only its add-on to the base game setup brings in
   (Crimson Seas p.2); its Citizens and Monsters stay, since Darksworn may use Monster Areas from the
   expansions (Darksworn p.2). The No Duke variant deals no Dukes (Base Rulebook p.13).
   ============================================================================= */
window.AID_COMPONENTS = {
  sets: [
    { id: "base", name: "Valeria: Card Kingdoms", src: "Base Rulebook p.2" },
    { id: "cs", name: "Crimson Seas", src: "Crimson Seas p.2", when: (c) => c.has("cs") },
    { id: "ds", name: "Darksworn", src: "Darksworn Rulebook p.2", when: (c) => c.has("ds") && c.mode === "darksworn" }
  ],
  items: [
    /* ---- base game (Base Rulebook p.2, "Game Material") ---- */
    { set: "base", qty: "108", name: "Citizens", note: "In 18 decks", img: "base-citizens.webp", w: 243, h: 212 },
    { set: "base", qty: "48", name: "Monsters", note: "In 8 decks", img: "base-monsters.webp", w: 241, h: 212 },
    { set: "base", qty: "24", name: "Domains", img: "base-domains.webp", w: 233, h: 212, when: (c) => c.mode !== "darksworn" },
    { set: "base", qty: "10", name: "Dukes", img: "base-dukes.webp", w: 237, h: 223,
      when: (c) => c.mode !== "darksworn" && !c.mod("noduke") },
    { set: "base", qty: "15", name: "Starters", note: "1 Starter Peasant, 1 Starter Knight and 1 Starter Herald per player (Base Rulebook p.3)",
      img: "base-starters.webp", w: 239, h: 226 },
    { set: "base", qty: "5", name: "Reference", img: "base-reference.webp", w: 239, h: 226 },
    { set: "base", qty: "10", name: "Exhausted", img: "base-exhausted.webp", w: 239, h: 224, when: (c) => c.mode !== "darksworn" },
    { set: "base", qty: "6", name: "Monster Events", note: "Used in the Monster Event variant (Base Rulebook p.12)",
      img: "base-monster-events.webp", w: 239, h: 224, when: (c) => c.mod("monsterevents") },
    { set: "base", qty: "35", name: "Dividers", img: "base-dividers.webp", w: 212, h: 163 },
    { set: "base", qty: "2", name: "Double-sided game tokens", note: "Starting / Resting", img: "base-game-tokens.webp", w: 147, h: 116 },
    { set: "base", qty: "2", name: "Six-sided dice", img: "base-dice.webp", w: 136, h: 129 },
    { set: "base", qty: "51", name: "“+10” markers", img: "base-plus10-markers.webp", w: 114, h: 84 },
    { set: "base", qty: "20", name: "Wood tokens", note: "5 Strength, 5 Gold, 5 Magic, 5 Victory", img: "base-wood-tokens.webp", w: 320, h: 62 },
    { set: "base", qty: "32", name: "Cardboard tokens", note: "Left out of your first game; the Monster Event variant uses them (Base Rulebook p.3, p.12)",
      img: "base-cardboard-tokens.webp", w: 269, h: 75 },
    { set: "base", qty: "5", name: "Player boards", img: "base-player-boards.webp", w: 320, h: 118 },

    /* ---- Crimson Seas (p.2; the list has no pictures) ---- */
    { set: "cs", qty: "1", name: "Island board", when: (c) => c.mode !== "darksworn" },
    { set: "cs", qty: "24", name: "Goods tokens", when: (c) => c.mode !== "darksworn" },
    { set: "cs", qty: "24", name: "Tome tokens", when: (c) => c.mode !== "darksworn" },
    { set: "cs", qty: "20", name: "Map tokens", when: (c) => c.mode !== "darksworn" },
    { set: "cs", qty: "5", name: "Coxwain starter cards",
      note: "The Coxswain: 1 per player, and in the 2nd Edition each player’s 3rd starter instead of the Herald (Crimson Seas p.2 · Combined Guide p.1)",
      when: (c) => c.mode !== "darksworn" },
    { set: "cs", qty: "16", name: "Noble cards", when: (c) => c.mode !== "darksworn" },
    { set: "cs", qty: "60", name: "Citizen cards" },
    { set: "cs", qty: "10", name: "Domain cards", when: (c) => c.mode !== "darksworn" },
    { set: "cs", qty: "35", name: "Monster cards" },
    { set: "cs", qty: "6", name: "Monster Event cards", note: "Used with the Monster Event rules, which can be played without the rest of Crimson Seas (Crimson Seas p.10)",
      when: (c) => c.mod("monsterevents") },

    /* ---- Darksworn (Darksworn Rulebook p.2, "Contents"; no pictures) ---- */
    { set: "ds", qty: "1", name: "Story board" },
    { set: "ds", qty: "1", name: "Aquila board" },
    { set: "ds", qty: "5", name: "Number tiles" },
    { set: "ds", qty: "5", name: "Wall tiles" },
    { set: "ds", qty: "5", name: "Achievement tokens" },
    { set: "ds", qty: "6", name: "Darksworn Saga books" },
    { set: "ds", qty: "1", name: "Dungeon Delve book" },
    { set: "ds", qty: "5", name: "Reference cards" },
    { set: "ds", qty: "5", name: "Explorer cards", note: "Each player starts with 1 Explorer, 1 Peasant, 1 Knight and 1 Reference card (Darksworn Rulebook p.3)" },
    { set: "ds", qty: "9", name: "Shade Monster cards" },
    { set: "ds", qty: "12", name: "Blessing cards" },
    { set: "ds", qty: "1", name: "Tuck box" }
  ]
};
