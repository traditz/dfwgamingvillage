/* =============================================================================
   Talisman (Revised 4th Edition) — Components glossary data (standard format v1.1; rendered by js/comp-widget.js)
   Sources (printed page numbers): Core pp.2–4 (Components list p.2, Component Overview pp.3–4) ·
   Dragon pp.3–4 · Dungeon p.3 · Highland p.3 · City pp.2–4 · Woodland p.3 · Cataclysm p.3 · Reaper p.1 ·
   Frostmarch p.1 · Sacred Pool p.1 · Blood Moon p.1 · Firelands p.1 · Nether Realm pp.2, 4 · Harbinger p.1 ·
   Deep Realms p.2 · Lost Realms p.1. Pictures are cropped from those pages; the Reaper rulesheet pictures no
   components, and the Frostmarch rulesheet pictures only its quest and ending cards.
   Gating: the Cataclysm board replaces the base game's board (Cataclysm p.4), so the base board is hidden.
   Alternative Ending cards are optional and show only when the Endgame is "Alternative Ending", except the
   Cataclysm's, which include "The Eternal Crown" used at every Cataclysm setup (Cataclysm pp.4, 6). The Dragon
   board overlay is hidden when the full Dragon can't be used (an Alternative Ending, or the Cataclysm board's
   Eternal Crown: Dragon p.15), matching this page's setup steps. Each rulebook's own "This Rulebook /
   Rulesheet" entry is left out.
   Standard v1.1: sets whose rulebook paper differs from the page's --comp-fig carry their own `fig` (the
   median corner colour of that set's crops).
   ============================================================================= */
window.AID_COMPONENTS = {
  sets: [
    { id: "base", name: "Base Game", src: "Core, pp.2–4" },
    { id: "dragon", name: "The Dragon", src: "Dragon, pp.3–4", fig: "#ede8df", when: (c) => c.has("dragon") },
    { id: "dungeon", name: "The Dungeon", src: "Dungeon, p.3", fig: "#ebebeb", when: (c) => c.has("dungeon") },
    { id: "highland", name: "The Highland", src: "Highland, p.3", fig: "#fefbef", when: (c) => c.has("highland") },
    { id: "city", name: "The City", src: "City, pp.2–4", fig: "#dbe4ea", when: (c) => c.has("city") },
    { id: "woodland", name: "The Woodland", src: "Woodland, p.3", fig: "#f2f5e7", when: (c) => c.has("woodland") },
    { id: "cataclysm", name: "The Cataclysm", src: "Cataclysm, p.3", fig: "#e6d8c9", when: (c) => c.has("cataclysm") },
    { id: "reaper", name: "The Reaper", src: "Reaper, p.1", when: (c) => c.has("reaper") },
    { id: "frostmarch", name: "The Frostmarch", src: "Frostmarch, p.1", when: (c) => c.has("frostmarch") },
    { id: "sacredpool", name: "The Sacred Pool", src: "Sacred Pool, p.1", when: (c) => c.has("sacredpool") },
    { id: "bloodmoon", name: "Blood Moon", src: "Blood Moon, p.1", when: (c) => c.has("bloodmoon") },
    { id: "firelands", name: "The Firelands", src: "Firelands, p.1", when: (c) => c.has("firelands") },
    { id: "netherrealm", name: "The Nether Realm", src: "Nether Realm, pp.2, 4", when: (c) => c.has("netherrealm") },
    { id: "harbinger", name: "The Harbinger", src: "Harbinger, p.1", when: (c) => c.has("harbinger") },
    { id: "deeprealms", name: "The Deep Realms", src: "Deep Realms, p.2", when: (c) => c.has("deeprealms") },
    { id: "lostrealms", name: "The Lost Realms", src: "Lost Realms, p.1", when: (c) => c.has("lostrealms") }
  ],
  items: [
    { set: "base", qty: "1", name: "Game board", img: "base-board.webp", w: 300, h: 211, when: (c) => !c.has("cataclysm") },
    { set: "base", qty: "104", name: "Adventure cards", img: "base-adventure.webp", w: 300, h: 194 },
    { set: "base", qty: "24", name: "Spell cards", img: "base-spells.webp", w: 300, h: 194 },
    { set: "base", qty: "40", name: "Strength counters", note: "8 large and 32 small red cones", img: "base-strength.webp", w: 180, h: 116 },
    { set: "base", qty: "40", name: "Craft counters", note: "8 large and 32 small blue cones", img: "base-craft.webp", w: 180, h: 108 },
    { set: "base", qty: "40", name: "Life counters", note: "8 large and 32 small green cones", img: "base-life.webp", w: 180, h: 111 },
    { set: "base", qty: "36", name: "Fate tokens", img: "base-fate.webp", w: 300, h: 174 },
    { set: "base", qty: "28", name: "Purchase cards", img: "base-purchase.webp", w: 300, h: 182 },
    { set: "base", qty: "4", name: "Talisman cards", img: "base-talisman.webp", w: 283, h: 267 },
    { set: "base", qty: "14", name: "Character cards", img: "base-characters.webp", w: 300, h: 160 },
    { set: "base", qty: "14", name: "Plastic character figures", img: "base-figures.webp", w: 300, h: 193 },
    { set: "base", qty: "4", name: "Toad cards", img: "base-toads.webp", w: 300, h: 183 },
    { set: "base", qty: "4", name: "Plastic Toad figures" },
    { set: "base", qty: "4", name: "Alignment cards", img: "base-alignment.webp", w: 300, h: 117 },
    { set: "base", qty: "30", name: "Gold coins", img: "base-gold.webp", w: 300, h: 118 },
    { set: "base", qty: "6", name: "Six-sided dice", img: "base-dice.webp", w: 300, h: 186 },

    { set: "dragon", qty: "1", name: "Double-sided board overlay", img: "dragon-overlay.webp", w: 246, h: 300, when: (c) => c.ending !== "alt" && !c.has("cataclysm") },
    { set: "dragon", qty: "168", name: "Dragon cards", note: "56 Varthrax cards, 56 Cadorus cards, 56 Grilipus cards", img: "dragon-cards.webp", w: 300, h: 117 },
    { set: "dragon", qty: "3", name: "Alternative Ending cards", note: "Optional. They can’t be used with the Dragon expansion in its entirety (Dragon, p.15)", img: "dragon-endings.webp", w: 300, h: 158, when: (c) => c.ending === "alt" },
    { set: "dragon", qty: "3", name: "Draconic Lord cards", note: "1 Varthrax, 1 Cadorus and 1 Grilipus Draconic Lord card", img: "dragon-lords.webp", w: 300, h: 159 },
    { set: "dragon", qty: "140", name: "Dragon tokens", note: "40 Varthrax Dragon Scales, 40 Cadorus Dragon Scales, 40 Grilipus Dragon Scales, 6 Dragon Strikes, 6 Dragon Rages, 8 Dragon Slumbers", img: "dragon-tokens.webp", w: 300, h: 177 },
    { set: "dragon", qty: "1", name: "Crown token", img: "dragon-crown.webp", w: 235, h: 300 },
    { set: "dragon", qty: "19", name: "Sleep tokens", img: "dragon-sleep.webp", w: 255, h: 258 },
    { set: "dragon", qty: "6", name: "Character cards", img: "dragon-characters.webp", w: 300, h: 157 },
    { set: "dragon", qty: "6", name: "Plastic character figures", img: "dragon-figures.webp", w: 300, h: 186 },

    { set: "dungeon", qty: "1", name: "Dungeon board", img: "dungeon-board.webp", w: 254, h: 300 },
    { set: "dungeon", qty: "128", name: "Dungeon cards", img: "dungeon-cards.webp", w: 300, h: 189 },
    { set: "dungeon", qty: "20", name: "Spell cards", img: "dungeon-spells.webp", w: 300, h: 188 },
    { set: "dungeon", qty: "10", name: "Adventure cards", img: "dungeon-adventure.webp", w: 300, h: 188 },
    { set: "dungeon", qty: "10", name: "Treasure cards", note: "Left in the game box until they are needed (Dungeon, p.4)", img: "dungeon-treasure.webp", w: 300, h: 186 },
    { set: "dungeon", qty: "5", name: "Character cards", img: "dungeon-characters.webp", w: 300, h: 156 },
    { set: "dungeon", qty: "5", name: "Plastic character figures", img: "dungeon-figures.webp", w: 300, h: 179 },

    { set: "highland", qty: "1", name: "Highland board", img: "highland-board.webp", w: 253, h: 300 },
    { set: "highland", qty: "142", name: "Highland cards", img: "highland-cards.webp", w: 300, h: 187 },
    { set: "highland", qty: "10", name: "Spell cards", img: "highland-spells.webp", w: 300, h: 188 },
    { set: "highland", qty: "12", name: "Adventure cards", img: "highland-adventure.webp", w: 300, h: 197 },
    { set: "highland", qty: "4", name: "Relic cards", note: "Left in the game box until they are needed (Highland, p.4)", img: "highland-relics.webp", w: 300, h: 188 },
    { set: "highland", qty: "3", name: "Alternative Ending cards", img: "highland-endings.webp", w: 300, h: 168, when: (c) => c.ending === "alt" },
    { set: "highland", qty: "6", name: "Character cards", img: "highland-characters.webp", w: 300, h: 163 },
    { set: "highland", qty: "6", name: "Plastic character figures", img: "highland-figures.webp", w: 300, h: 200 },

    { set: "city", qty: "1", name: "City board", img: "city-board.webp", w: 272, h: 300 },
    { set: "city", qty: "82", name: "City cards", img: "city-cards.webp", w: 300, h: 188 },
    { set: "city", qty: "12", name: "Armoury cards", img: "city-armoury.webp", w: 300, h: 188 },
    { set: "city", qty: "12", name: "Pet cards", img: "city-pets.webp", w: 300, h: 190 },
    { set: "city", qty: "16", name: "Magic Emporium cards", img: "city-emporium.webp", w: 300, h: 191 },
    { set: "city", qty: "16", name: "Potion cards", img: "city-potions.webp", w: 300, h: 187 },
    { set: "city", qty: "8", name: "Stables cards", img: "city-stables.webp", w: 300, h: 188 },
    { set: "city", qty: "18", name: "Wanted Poster cards", img: "city-wanted.webp", w: 300, h: 188 },
    { set: "city", qty: "4", name: "Neutral Alignment cards", note: "Left in the game box until they are needed (City, p.4)", img: "city-neutral.webp", w: 194, h: 252 },
    { set: "city", qty: "3", name: "Alternative Ending cards", img: "city-endings.webp", w: 300, h: 157, when: (c) => c.ending === "alt" },
    { set: "city", qty: "6", name: "Character cards", img: "city-characters.webp", w: 300, h: 158 },
    { set: "city", qty: "6", name: "Plastic character figures", img: "city-figures.webp", w: 300, h: 187 },

    { set: "woodland", name: "Woodland board", img: "woodland-board.webp", w: 298, h: 300 },
    { set: "woodland", qty: "103", name: "Woodland cards", img: "woodland-cards.webp", w: 300, h: 181 },
    { set: "woodland", qty: "10", name: "Adventure cards", img: "woodland-adventure.webp", w: 300, h: 181 },
    { set: "woodland", qty: "20", name: "Path cards", img: "woodland-paths.webp", w: 300, h: 174 },
    { set: "woodland", qty: "14", name: "Destiny cards", img: "woodland-destiny.webp", w: 300, h: 167 },
    { set: "woodland", qty: "5", name: "Spell cards", img: "woodland-spells.webp", w: 300, h: 167 },
    { set: "woodland", qty: "5", name: "Character figures", img: "woodland-figures.webp", w: 300, h: 177 },
    { set: "woodland", qty: "5", name: "Character cards", img: "woodland-characters.webp", w: 300, h: 151 },
    { set: "woodland", qty: "3", name: "Alternative Ending cards", img: "woodland-endings.webp", w: 300, h: 150, when: (c) => c.ending === "alt" },
    { set: "woodland", qty: "5", name: "Growth tokens", img: "woodland-growth.webp", w: 266, h: 245 },
    { set: "woodland", qty: "6", name: "Spider tokens", img: "woodland-spider.webp", w: 300, h: 193 },
    { set: "woodland", qty: "3", name: "Portal tokens", img: "woodland-portal.webp", w: 230, h: 198 },
    { set: "woodland", qty: "5", name: "Hidden Path tokens", img: "woodland-hidden-path.webp", w: 182, h: 169 },
    { set: "woodland", qty: "3", name: "Totem Spirit tokens", img: "woodland-totem.webp", w: 182, h: 216 },

    { set: "cataclysm", name: "Cataclysm board", note: "Replaces the main board provided in the base game (Cataclysm, p.4)", img: "cataclysm-board.webp", w: 300, h: 203 },
    { set: "cataclysm", qty: "40", name: "Denizen cards", img: "cataclysm-denizens.webp", w: 300, h: 187 },
    { set: "cataclysm", qty: "47", name: "Adventure cards", img: "cataclysm-adventure.webp", w: 300, h: 184 },
    { set: "cataclysm", qty: "25", name: "Remnant cards", img: "cataclysm-remnants.webp", w: 300, h: 176 },
    { set: "cataclysm", qty: "6", name: "Warlock Quest cards", img: "cataclysm-quests.webp", w: 300, h: 174 },
    { set: "cataclysm", qty: "10", name: "Spell cards", img: "cataclysm-spells.webp", w: 300, h: 169 },
    { set: "cataclysm", qty: "6", name: "Talisman cards", img: "cataclysm-talisman.webp", w: 300, h: 179 },
    { set: "cataclysm", qty: "24", name: "Purchase cards", img: "cataclysm-purchase.webp", w: 300, h: 176 },
    { set: "cataclysm", qty: "10", name: "Terrain cards", img: "cataclysm-terrain.webp", w: 300, h: 138 },
    { set: "cataclysm", qty: "5", name: "Character figures", img: "cataclysm-figures.webp", w: 300, h: 188 },
    { set: "cataclysm", qty: "5", name: "Character cards", img: "cataclysm-characters.webp", w: 300, h: 155 },
    { set: "cataclysm", qty: "4", name: "Alternative Ending cards", note: "Include “The Eternal Crown”, the default Cataclysm ending placed at setup (Cataclysm, pp.4, 6)", img: "cataclysm-endings.webp", w: 300, h: 151 },

    { set: "reaper", qty: "90", name: "Adventure cards" },
    { set: "reaper", qty: "26", name: "Spell cards" },
    { set: "reaper", qty: "12", name: "Warlock Quest cards", note: "Optional rule (Reaper, p.1)" },
    { set: "reaper", qty: "4", name: "Character cards" },
    { set: "reaper", qty: "4", name: "Plastic character figures" },
    { set: "reaper", qty: "1", name: "Grim Reaper card", note: "Optional rule (Reaper, p.1)" },
    { set: "reaper", qty: "1", name: "Grim Reaper figure", note: "Optional rule (Reaper, p.1)" },

    { set: "frostmarch", qty: "84", name: "Adventure cards" },
    { set: "frostmarch", qty: "20", name: "Spell cards" },
    { set: "frostmarch", qty: "24", name: "Warlock Quest cards", note: "Optional (Frostmarch, p.1)", img: "frostmarch-quests.webp", w: 285, h: 245 },
    { set: "frostmarch", qty: "3", name: "Alternative Ending cards", img: "frostmarch-endings.webp", w: 300, h: 212, when: (c) => c.ending === "alt" },
    { set: "frostmarch", qty: "4", name: "Character cards" },
    { set: "frostmarch", qty: "4", name: "Plastic character figures" },

    { set: "sacredpool", qty: "72", name: "Adventure cards", img: "sacredpool-adventure.webp", w: 300, h: 201 },
    { set: "sacredpool", qty: "16", name: "Spell cards", img: "sacredpool-spells.webp", w: 300, h: 207 },
    { set: "sacredpool", qty: "24", name: "Quest Reward cards", note: "Optional (Sacred Pool, p.2)", img: "sacredpool-rewards.webp", w: 300, h: 214 },
    { set: "sacredpool", qty: "12", name: "Stables cards", img: "sacredpool-stables.webp", w: 300, h: 204 },
    { set: "sacredpool", qty: "3", name: "Alternative Ending cards", img: "sacredpool-endings.webp", w: 300, h: 187, when: (c) => c.ending === "alt" },
    { set: "sacredpool", qty: "4", name: "Neutral Alignment cards", img: "sacredpool-neutral.webp", w: 300, h: 201 },
    { set: "sacredpool", qty: "4", name: "Character cards", img: "sacredpool-characters.webp", w: 300, h: 184 },
    { set: "sacredpool", qty: "4", name: "Plastic character figures", img: "sacredpool-figures.webp", w: 300, h: 159 },

    { set: "bloodmoon", qty: "111", name: "Adventure cards", img: "bloodmoon-adventure.webp", w: 300, h: 211 },
    { set: "bloodmoon", qty: "10", name: "Spell cards", img: "bloodmoon-spells.webp", w: 300, h: 185 },
    { set: "bloodmoon", qty: "1", name: "Time card", img: "bloodmoon-time.webp", w: 246, h: 174 },
    { set: "bloodmoon", qty: "6", name: "Lycanthrope cards", img: "bloodmoon-lycanthrope.webp", w: 300, h: 200 },
    { set: "bloodmoon", qty: "3", name: "Alternative Ending cards", img: "bloodmoon-endings.webp", w: 300, h: 188, when: (c) => c.ending === "alt" },
    { set: "bloodmoon", qty: "3", name: "Character cards", img: "bloodmoon-characters.webp", w: 300, h: 184 },
    { set: "bloodmoon", qty: "3", name: "Plastic character figures", img: "bloodmoon-figures.webp", w: 300, h: 126 },
    { set: "bloodmoon", qty: "1", name: "Werewolf card", img: "bloodmoon-werewolf-card.webp", w: 300, h: 249 },
    { set: "bloodmoon", qty: "1", name: "Werewolf figure", img: "bloodmoon-werewolf-figure.webp", w: 276, h: 291 },

    { set: "firelands", qty: "81", name: "Adventure cards", img: "firelands-adventure.webp", w: 300, h: 208 },
    { set: "firelands", qty: "19", name: "Spell cards", img: "firelands-spells.webp", w: 300, h: 208 },
    { set: "firelands", qty: "19", name: "Terrain cards", img: "firelands-terrain.webp", w: 300, h: 147 },
    { set: "firelands", qty: "3", name: "Alternative Ending cards", img: "firelands-endings.webp", w: 300, h: 189, when: (c) => c.ending === "alt" },
    { set: "firelands", qty: "4", name: "Character cards", img: "firelands-characters.webp", w: 300, h: 185 },
    { set: "firelands", qty: "4", name: "Plastic character figures", img: "firelands-figures.webp", w: 300, h: 119 },
    { set: "firelands", qty: "34", name: "Fireland tokens", img: "firelands-tokens.webp", w: 300, h: 214 },

    { set: "netherrealm", qty: "36", name: "Nether cards", note: "Used when playing with one of this expansion’s Alternative Ending cards (Nether Realm, p.2)", img: "netherrealm-cards.webp", w: 300, h: 203 },
    { set: "netherrealm", qty: "3", name: "Alternative Ending cards", img: "netherrealm-endings.webp", w: 300, h: 175, when: (c) => c.ending === "alt" },

    { set: "harbinger", qty: "3", name: "Character figures & 1 Harbinger figure", img: "harbinger-figures.webp", w: 300, h: 195 },
    { set: "harbinger", qty: "1", name: "Harbinger sheet", img: "harbinger-sheet.webp", w: 300, h: 202 },
    { set: "harbinger", qty: "32", name: "Omen cards", note: "Each game uses one Omen set of eight cards (Harbinger, p.2)", img: "harbinger-omens.webp", w: 300, h: 141 },
    { set: "harbinger", qty: "10", name: "Terrain cards", img: "harbinger-terrain.webp", w: 300, h: 144 },
    { set: "harbinger", qty: "75", name: "Harbinger cards", img: "harbinger-cards.webp", w: 300, h: 195 },
    { set: "harbinger", qty: "10", name: "Spell cards", img: "harbinger-spells.webp", w: 300, h: 204 },
    { set: "harbinger", qty: "3", name: "Character cards", img: "harbinger-characters.webp", w: 300, h: 173 },
    { set: "harbinger", qty: "2", name: "Alternative Ending cards", img: "harbinger-endings.webp", w: 300, h: 186, when: (c) => c.ending === "alt" },

    { set: "deeprealms", qty: "2", name: "Realm cards", img: "deeprealms-realms.webp", w: 300, h: 192 },
    { set: "deeprealms", qty: "20", name: "Bridge cards", img: "deeprealms-bridge.webp", w: 300, h: 207 },
    { set: "deeprealms", qty: "20", name: "Tunnel cards", img: "deeprealms-tunnel.webp", w: 300, h: 207 },

    { set: "lostrealms", qty: "2", name: "Realm cards", img: "lostrealms-realms.webp", w: 300, h: 189 },
    { set: "lostrealms", qty: "20", name: "Bridge cards", img: "lostrealms-bridge.webp", w: 300, h: 196 },
    { set: "lostrealms", qty: "20", name: "Tunnel cards", img: "lostrealms-tunnel.webp", w: 300, h: 197 },
    { set: "lostrealms", qty: "3", name: "Alternative Ending cards", img: "lostrealms-endings.webp", w: 300, h: 190, when: (c) => c.ending === "alt" },
    { set: "lostrealms", qty: "36", name: "Nether cards", note: "Used when playing with one of this expansion’s Alternative Ending cards (Lost Realms, p.2)", img: "lostrealms-nether.webp", w: 300, h: 201 },
    { set: "lostrealms", qty: "6", name: "Coloured base rings", img: "lostrealms-rings.webp", w: 300, h: 200 }
  ]
};
