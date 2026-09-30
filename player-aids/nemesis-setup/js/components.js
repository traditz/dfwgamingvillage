/* =============================================================================
   Nemesis — Components glossary data (standard format v1.1; rendered by js/comp-widget.js)
   Sources: Base p.2-3 (Game Elements) · Aftermath p.2 (Game Elements) · Carno p.2 (Components) ·
   Void p.2 (Game Elements) · FAQ v2.2 p.5-6. Pictures cropped from those pages; the Carnomorph list has
   no pictures of its tokens, so the Metagorger and Fleshbeast tokens use the Bag Development pictures
   (Carno p.7). Gating follows the rulebooks and this page's own ids (has / mode / race / mod):
   - Carnomorphs and Void Seeders show when that Intruder race is chosen. Their boards, Attack, Event and
     Weakness/Adaptation cards and miniatures take the place of the base Intruder ones (Carno p.3, p.5 ·
     Void p.3), so those base components are hidden for that race. The basic Help cards stay: they are
     dealt for player numbers and then exchanged (Carno p.3 · Void p.3 · Aftermath p.6).
   - Solo / Co-op use the Solo / Coop Objectives instead of the regular Objectives (Base p.27).
   - Playing as an Intruder: the Intruder Action cards (Base p.27).
   - Aftermath: Research Mission uses only the Aftermath Characters (Aftermath p.4); Epilogue uses
     Personal Requirements, the Aftermath Event deck and the Aftermath Help cards instead of the base
     Objectives, Events and Help cards (Aftermath p.3, p.6). Shuttle, Alerts, Aftermath Events and
     Aftermath Exploration tokens: Epilogue and Research Mission. Rooms "2" and their Crafted Items:
     the Aftermath Rooms module (and both Aftermath modes). Turrets: the Turrets module and Research
     Mission (Aftermath p.5, p.7). Traits: the Traits module and both Aftermath modes. Hourglass: its module.
   - The FAQ corrects Aftermath's Blue (Crafted) Item count from 9 to 6, and says the rulebook's picture
     of the Void Seeder tokens is wrong, so that item has no picture.
   ============================================================================= */
window.AID_COMPONENTS = {
  sets: [
    { id: "base", name: "Nemesis", src: "Base p.2-3" },
    { id: "aftermath", name: "Aftermath", src: "Aftermath p.2", when: (c) => c.has("aftermath") },
    { id: "carno", name: "Carnomorphs", src: "Carno p.2", fig: "#130000", when: (c) => c.race === "carno" },
    { id: "void", name: "Void Seeders", src: "Void p.2", fig: "#0a0a17", when: (c) => c.race === "void" }
  ],
  items: [
    /* ---- Nemesis: Base p.2 ---- */
    { set: "base", qty: "1", name: "Two-sided board", note: "Basic side (red arrow icon) and the harder alternative side (Base p.6, p.27)", img: "base-board.webp", w: 320, h: 219 },
    { set: "base", qty: "6", name: "Character boards", img: "base-character-boards.webp", w: 320, h: 267,
      when: (c) => c.mode !== "research" },
    { set: "base", qty: "11", name: "Room “1” tiles", img: "base-room1-tiles.webp", w: 320, h: 137 },
    { set: "base", qty: "9", name: "Room “2” tiles", img: "base-room2-tiles.webp", w: 320, h: 139 },
    { set: "base", qty: "1", name: "Scanner", img: "base-scanner.webp", w: 135, h: 187 },
    { set: "base", qty: "1", name: "Intruder board", img: "base-intruder-board.webp", w: 320, h: 204,
      when: (c) => c.race !== "carno" && c.race !== "void" },
    { set: "base", qty: "1", name: "Intruder bag", img: "base-intruder-bag.webp", w: 187, h: 181 },
    { set: "base", qty: "2", name: "D6 Combat dice", img: "base-dice.webp", w: 230, h: 142 },
    { set: "base", qty: "2", name: "D10 Noise dice", img: "base-dice.webp", w: 230, h: 142 },
    { set: "base", qty: "6", name: "Characters", note: "Miniatures: Captain, Pilot, Scientist, Scout, Soldier, Mechanic", img: "base-characters.webp", w: 320, h: 99,
      when: (c) => c.mode !== "research" },
    { set: "base", qty: "6", name: "Larvae", note: "Miniatures", img: "base-larvae.webp", w: 320, h: 58,
      when: (c) => c.race !== "carno" && c.race !== "void" },
    { set: "base", qty: "3", name: "Creepers", note: "Miniatures", img: "base-creepers.webp", w: 320, h: 91,
      when: (c) => c.race !== "carno" && c.race !== "void" },
    { set: "base", qty: "8", name: "Adult Intruders", note: "Miniatures: 4 different sculpts", img: "base-adults.webp", w: 320, h: 155,
      when: (c) => c.race !== "carno" && c.race !== "void" },
    { set: "base", qty: "2", name: "Breeders", note: "Miniatures", img: "base-breeders.webp", w: 254, h: 320,
      when: (c) => c.race !== "carno" && c.race !== "void" },
    { set: "base", qty: "1", name: "Queen", note: "Miniature", img: "base-queen.webp", w: 243, h: 320,
      when: (c) => c.race !== "carno" && c.race !== "void" },
    { set: "base", qty: "5", name: "Plastic card holders", note: "Inventories", img: "base-card-holders.webp", w: 320, h: 154 },
    { set: "base", qty: "6", name: "Colored plastic rings", img: "base-rings.webp", w: 233, h: 126 },

    /* ---- Nemesis: Base p.3 — markers and tokens ---- */
    { set: "base", qty: "2", name: "Room sheets", img: "base-room-sheets.webp", w: 320, h: 227 },
    { set: "base", qty: "18", name: "Status markers", img: "base-status-markers.webp", w: 320, h: 143 },
    { set: "base", qty: "50", name: "Ammo / Injury markers", img: "base-ammo-injury.webp", w: 320, h: 144 },
    { set: "base", qty: "30", name: "Noise markers", img: "base-noise-markers.webp", w: 316, h: 129 },
    { set: "base", qty: "8", name: "Fire markers", img: "base-fire-markers.webp", w: 306, h: 138 },
    { set: "base", qty: "12", name: "Door tokens", img: "base-door-tokens.webp", w: 263, h: 166 },
    { set: "base", qty: "8", name: "Malfunction markers", img: "base-malfunction.webp", w: 320, h: 128 },
    { set: "base", qty: "6", name: "Engine tokens", note: "3 Working, 3 Damaged", img: "base-engine-tokens.webp", w: 320, h: 125 },
    { set: "base", qty: "2", name: "Five Injury tokens", img: "base-five-injury.webp", w: 157, h: 81 },
    { set: "base", qty: "4", name: "Escape Pod tokens", img: "base-escape-pods.webp", w: 320, h: 146 },
    { set: "base", qty: "8", name: "Intruder Egg tokens", img: "base-eggs.webp", w: 300, h: 142 },
    { set: "base", qty: "20", name: "Exploration tokens", img: "base-exploration.webp", w: 320, h: 141 },
    { set: "base", qty: "27", name: "Intruder tokens", note: "8 Larvae, 12 Adult Intruders, 3 Creeper, 2 Breeder, 1 Queen, 1 Blank", img: "base-intruder-tokens.webp", w: 320, h: 140,
      when: (c) => c.race !== "carno" && c.race !== "void" },
    { set: "base", qty: "27", name: "Intruder tokens", note: "With Carnomorphs, the Intruder bag starts with 1 Blank and the Metagorger tokens (Carno p.3)", img: "base-intruder-tokens.webp", w: 320, h: 140,
      when: (c) => c.race === "carno" },
    { set: "base", qty: "1", name: "Blue Character Corpse token", img: "base-corpse-tokens.webp", w: 300, h: 153 },
    { set: "base", qty: "4", name: "Red Character Corpse tokens", img: "base-corpse-tokens.webp", w: 300, h: 153 },
    { set: "base", qty: "8", name: "Intruder Carcass tokens", img: "base-carcass-tokens.webp", w: 303, h: 136 },
    { set: "base", qty: "1", name: "First Player token", img: "base-first-player.webp", w: 145, h: 120 },
    { set: "base", qty: "1", name: "Depressurisation token", img: "base-depressurisation.webp", w: 74, h: 83 },

    /* ---- Nemesis: Base p.3 — cards ---- */
    { set: "base", qty: "60", name: "Action cards", note: "10 per Character", img: "base-action-cards.webp", w: 320, h: 145,
      when: (c) => c.mode !== "research" },
    { set: "base", qty: "18", name: "Objective cards", note: "9 Personal and 9 Corporate", img: "base-objectives.webp", w: 320, h: 150,
      when: (c) => c.mode !== "solo" && c.mode !== "coop" && c.mode !== "epilogue" },
    { set: "base", qty: "27", name: "Contamination cards", note: "They share a common back with the Action cards but form a separate deck", img: "base-contamination.webp", w: 320, h: 145 },
    { set: "base", qty: "20", name: "Intruder Attack cards", img: "base-intruder-attack.webp", w: 320, h: 145,
      when: (c) => c.race !== "carno" && c.race !== "void" },
    { set: "base", qty: "16", name: "Serious Wound cards", img: "base-serious-wounds.webp", w: 320, h: 145 },
    { set: "base", qty: "20", name: "Event cards", img: "base-events.webp", w: 320, h: 150,
      when: (c) => c.race !== "carno" && c.race !== "void" && c.mode !== "epilogue" && c.mode !== "research" },
    { set: "base", qty: "20", name: "Event cards", note: "Research Mission: only Lurking, Short Circuit, Hunt (direction 3), Scent of Prey, Damage, Life Support Failure, Eclosion and Damaging Fire, shuffled into the Aftermath Event deck (Aftermath p.7)", img: "base-events.webp", w: 320, h: 150,
      when: (c) => c.mode === "research" },
    { set: "base", qty: "5", name: "Help cards", img: "base-help-cards.webp", w: 320, h: 177,
      when: (c) => c.race !== "carno" && c.race !== "void" && c.mode !== "epilogue" },
    { set: "base", qty: "5", name: "Help cards", note: "Dealt at setup to set player numbers, then exchanged for the Carnomorph Help cards (Carno p.3)", img: "base-help-cards.webp", w: 320, h: 177,
      when: (c) => c.race === "carno" },
    { set: "base", qty: "5", name: "Help cards", note: "Dealt at setup to set player numbers, then exchanged for the Void Seeders Help cards (Void p.3)", img: "base-help-cards.webp", w: 320, h: 177,
      when: (c) => c.race === "void" },
    { set: "base", qty: "5", name: "Help cards", note: "Dealt at setup to set player numbers, then exchanged for the Aftermath Help cards (Aftermath p.6)", img: "base-help-cards.webp", w: 320, h: 177,
      when: (c) => c.mode === "epilogue" },
    { set: "base", qty: "8", name: "Intruder Weakness cards", img: "base-weakness.webp", w: 309, h: 178,
      when: (c) => c.race !== "carno" && c.race !== "void" },
    { set: "base", qty: "8", name: "Coordinates cards", img: "base-coordinates.webp", w: 320, h: 111 },
    { set: "base", qty: "30", name: "Green (Medical) Item cards", img: "base-items-green.webp", w: 320, h: 180 },
    { set: "base", qty: "30", name: "Yellow (Technical) Item cards", img: "base-items-yellow.webp", w: 320, h: 180 },
    { set: "base", qty: "30", name: "Red (Military) Item cards", img: "base-items-red.webp", w: 320, h: 182 },
    { set: "base", qty: "12", name: "Blue (Crafted) Item cards", img: "base-items-blue.webp", w: 320, h: 140 },
    { set: "base", qty: "6", name: "Character Starting Item (Weapon) cards", img: "base-starting-items.webp", w: 320, h: 139,
      when: (c) => c.mode !== "research" },
    { set: "base", qty: "12", name: "Character Quest Item cards", img: "base-quest-items.webp", w: 320, h: 108,
      when: (c) => c.mode !== "research" },
    { set: "base", qty: "6", name: "Character Draft cards", img: "base-draft-cards.webp", w: 320, h: 148 },
    { set: "base", qty: "7", name: "Solo / Coop Objective cards", note: "Advanced mode: drawn instead of the regular Objective cards in Solo and Co-op (Base p.27)", img: "base-solo-coop-objectives.webp", w: 320, h: 188,
      when: (c) => c.mode === "solo" || c.mode === "coop" },
    { set: "base", qty: "10", name: "Intruder Action cards", note: "Advanced mode: the Intruder Player Action deck, for Playing as an Intruder (Base p.27)", img: "base-intruder-action.webp", w: 320, h: 178,
      when: (c) => c.mod("intruderplayer") },
    { set: "base", qty: "1", name: "Cardboard box holder", note: "Not used in the game", img: "base-box-holder.webp", w: 320, h: 70 },
    { set: "base", qty: "10", name: "Promo cards", note: "Not used in the game", img: "base-promo-cards.webp", w: 320, h: 143 },

    /* ---- Aftermath: Aftermath p.2 ---- */
    { set: "aftermath", qty: "1", name: "Shuttle board", note: "Epilogue and Research Mission (Aftermath p.5-7)", img: "aft-shuttle.webp", w: 313, h: 312,
      when: (c) => c.mode === "epilogue" || c.mode === "research" },
    { set: "aftermath", qty: "5", name: "Character boards", note: "Each can replace the base Character of the same colour; Research Mission uses only these Characters (Aftermath p.3-4)", img: "aft-character-boards.webp", w: 320, h: 238 },
    { set: "aftermath", qty: "4", name: "Room tiles “2”", note: "Crafting, Server, Alarm and Turret Room (Aftermath p.5)", img: "aft-room-tiles.webp", w: 320, h: 179,
      when: (c) => c.mod("aftrooms") || c.mode === "epilogue" || c.mode === "research" },
    { set: "aftermath", qty: "5", name: "Characters + 1 Dog", note: "Miniatures: CEO, Android, Psychologist, Bounty Hunter, Convict, and Laika, the Bounty Hunter's dog (Aftermath p.4)", img: "aft-characters.webp", w: 320, h: 112 },
    { set: "aftermath", qty: "3", name: "Turrets", note: "Miniatures", img: "aft-turrets.webp", w: 295, h: 132,
      when: (c) => c.mod("turrets") || c.mode === "research" },
    { set: "aftermath", qty: "1", name: "Hourglass", img: "aft-hourglass.webp", w: 81, h: 131,
      when: (c) => c.mod("hourglass") },
    { set: "aftermath", qty: "1", name: "Catonaut", note: "Miniature", img: "aft-catonaut.webp", w: 144, h: 190 },
    { set: "aftermath", qty: "6", name: "New Blue (Crafted) Item cards", note: "The rulebook lists 9; the FAQ corrects it to 6 (FAQ v2.2 p.5). The new Crafted Items can only be made in the Crafting Room (Aftermath p.5)", img: "aft-items-blue.webp", w: 320, h: 149,
      when: (c) => c.mod("aftrooms") || c.mode === "epilogue" || c.mode === "research" },
    { set: "aftermath", qty: "6", name: "Character Starting Item cards", img: "aft-starting-items.webp", w: 312, h: 147 },
    { set: "aftermath", qty: "10", name: "Character Quest Item cards", img: "aft-quest-items.webp", w: 320, h: 118 },
    { set: "aftermath", qty: "53", name: "Action cards", img: "aft-action-cards.webp", w: 320, h: 146 },
    { set: "aftermath", qty: "13", name: "Personal Requirement cards", note: "Epilogue: 1 per player, instead of Objectives (Aftermath p.3, p.6)", img: "aft-personal-requirements.webp", w: 264, h: 150,
      when: (c) => c.mode === "epilogue" },
    { set: "aftermath", qty: "1", name: "Lucrative Offer card", note: "Epilogue (Aftermath p.6)", img: "aft-lucrative-offer.webp", w: 120, h: 140,
      when: (c) => c.mode === "epilogue" },
    { set: "aftermath", qty: "10", name: "Alert cards", note: "Epilogue and Research Mission (Aftermath p.5-7)", img: "aft-alerts.webp", w: 320, h: 150,
      when: (c) => c.mode === "epilogue" || c.mode === "research" },
    { set: "aftermath", qty: "11", name: "Trait cards", note: "5 for the Aftermath Characters, 6 for the Nemesis Characters", img: "aft-traits.webp", w: 320, h: 150,
      when: (c) => c.mod("traits") || c.mode === "epilogue" || c.mode === "research" },
    { set: "aftermath", qty: "2", name: '"Melted" Serious Wound cards', img: "aft-melted-wounds.webp", w: 248, h: 144 },
    { set: "aftermath", qty: "10", name: "Aftermath Event cards", note: "Epilogue: used instead of the base Event deck. Research Mission: shuffled with 8 base Events (Aftermath p.6-7)", img: "aft-events.webp", w: 320, h: 156,
      when: (c) => c.mode === "epilogue" || c.mode === "research" },
    { set: "aftermath", qty: "5", name: "Help cards", note: "Epilogue: they replace the basic Help cards once player numbers are set (Aftermath p.6)", img: "aft-help-cards.webp", w: 264, h: 152,
      when: (c) => c.mode === "epilogue" },
    { set: "aftermath", qty: "9", name: "Turret Status tokens", note: "3 ALL, 3 INTRUDER, 3 NONE", img: "aft-turret-status.webp", w: 190, h: 99,
      when: (c) => c.mod("turrets") || c.mode === "research" },
    { set: "aftermath", qty: "23", name: "Aftermath Exploration tokens", note: "Epilogue and Research Mission (Aftermath p.5)", img: "aft-exploration.webp", w: 320, h: 132,
      when: (c) => c.mode === "epilogue" || c.mode === "research" },
    { set: "aftermath", qty: "3", name: "Turret Exploration tokens", img: "aft-turret-exploration.webp", w: 130, h: 123,
      when: (c) => c.mod("turrets") || c.mode === "research" },

    /* ---- Carnomorphs: Carno p.2 (token pictures: Carno p.7) ---- */
    { set: "carno", qty: "1", name: "Carnomorph board", note: "Set up with 8 Egg tokens and 3 random Carnomorph Adaptation cards on its slots (Carno p.3)" },
    { set: "carno", qty: "5", name: "Help card", note: "Replace the basic Help cards once player numbers are set (Carno p.3)" },
    { set: "carno", qty: "8", name: "Red Metagorger tokens", img: "carno-metagorger-red-token.webp", w: 114, h: 117 },
    { set: "carno", qty: "2", name: "Blue Metagorger tokens", img: "carno-metagorger-blue-token.webp", w: 111, h: 111 },
    { set: "carno", qty: "1", name: "Fleshbeast token", img: "carno-fleshbeast-token.webp", w: 117, h: 117 },
    { set: "carno", qty: "4", name: "Intruder Carcass tokens" },
    { set: "carno", qty: "20", name: "Carnomorph Attack cards", note: "Used instead of the Intruder Attack cards (Carno p.3)" },
    { set: "carno", qty: "20", name: "Event cards", note: "The Carnomorph Event deck, used instead of the base Event cards (Carno p.3)" },
    { set: "carno", qty: "12", name: "Character Mutation cards" },
    { set: "carno", qty: "8", name: "Carnomorph Adaptation cards", note: "They replace the Intruder Weakness cards (Carno p.5)" },
    { set: "carno", qty: "8", name: "Metagorger miniatures", img: "carno-metagorgers.webp", w: 252, h: 155 },
    { set: "carno", qty: "8", name: "Shambler miniatures", img: "carno-shamblers.webp", w: 148, h: 145 },
    { set: "carno", qty: "3", name: "Fleshbeast miniatures", img: "carno-fleshbeasts.webp", w: 145, h: 147 },
    { set: "carno", qty: "1", name: "Butcher miniature", img: "carno-butcher.webp", w: 145, h: 144 },

    /* ---- Void Seeders: Void p.2 ---- */
    { set: "void", qty: "1", name: "Void Seeder board", note: "Set up with 5 Egg tokens and 3 random Void Seeder Weakness cards on its slots (Void p.3)", img: "void-board.webp", w: 320, h: 207 },
    { set: "void", qty: "17", name: "Void Seeder tokens", note: "1 blank, 16 Void Seeder. The rulebook's picture of these tokens is wrong; the tokens in the box are correct (FAQ v2.2 p.6)" },
    { set: "void", qty: "7", name: "Character Insanity", note: "Tokens: 1 in each player's colour goes in the Intruder bag (Void p.3)", img: "void-insanity.webp", w: 144, h: 144 },
    { set: "void", qty: "3", name: "'Lair' Exploration tokens", note: "Added to the Exploration tokens after 2 Slime and 2 Silence tokens are removed (Void p.3)", img: "void-lair-tokens.webp", w: 117, h: 108 },
    { set: "void", qty: "20", name: "Void Seeder Attack cards", note: "Replace the Intruder Attack deck (Void p.3)", img: "void-attack.webp", w: 320, h: 146 },
    { set: "void", qty: "20", name: "Void Seeder Event cards", note: "Replace the Event deck (Void p.3)", img: "void-events.webp", w: 320, h: 145 },
    { set: "void", qty: "20", name: "Panic cards", img: "void-panic.webp", w: 320, h: 152 },
    { set: "void", qty: "8", name: "Void Seeder weakness cards", img: "void-weakness.webp", w: 295, h: 176 },
    { set: "void", qty: "5", name: "Void Seeder help cards", note: "Replace the basic Help cards once player numbers are set (Void p.3)", img: "void-help.webp", w: 301, h: 166 },
    { set: "void", qty: "3", name: "Lairs", note: "Miniatures", img: "void-lairs.webp", w: 320, h: 107 },
    { set: "void", qty: "6", name: "Lurkers", note: "Miniatures", img: "void-lurkers.webp", w: 320, h: 124 },
    { set: "void", qty: "4", name: "Whisperers", note: "Miniatures", img: "void-whisperers.webp", w: 320, h: 181 },
    { set: "void", qty: "1", name: "Stalker", note: "Miniature", img: "void-stalker.webp", w: 215, h: 306 },
    { set: "void", qty: "1", name: "Despoiler", note: "Miniature", img: "void-despoiler.webp", w: 217, h: 312 }
  ]
};
