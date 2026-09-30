/* =============================================================================
   Nemesis: Retaliation — Components glossary data (standard format v1.1; rendered by js/comp-widget.js)
   Sources: Retaliation p.3-5 (Standard-sized cards · Small cards · Main components · Standees/models ·
   Markers and tokens; these pages carry no printed folio, p.6 is the first numbered page) ·
   Contractors sheet p.1 · Support Squad sheet p.2 · Insider p.2 · Sangrevores p.2 · Neoflesh p.3 ·
   Xyrians p.12. Pictures cropped from those pages (the Xyrians list pictures only its two tokens).
   Gating follows the rulebooks and this page's own ids (has / mode / race):
   - Sangrevores and Neoflesh Cult show when that alien race is chosen. Their Exploration, Attack, Event
     and Health decks, Intruder tokens, models and Intruder Help sheet are used in place of the
     Primeblood ones (Sangrevores p.2 · Neoflesh p.4), so those are hidden for that race. The base Intruder
     tokens stay listed with a note, since both setups put "1 Blank token" in the bag and neither list says it
     includes one. Sangrevores also
     place the Infection deck instead of the Contamination deck (Sangrevores p.2), and use the Noise
     markers as Shadow markers (Sangrevores p.3). Neoflesh Cult Help cards replace the standard Help
     cards (Neoflesh p.4).
   - Solo / Co-op uses the Solo/Coop cards instead of the Mission Task and Objective cards
     (Retaliation p.40).
   - Contractors, Support Squad, Insider and Xyrians show when selected.
   ============================================================================= */
window.AID_COMPONENTS = {
  sets: [
    { id: "base", name: "Nemesis: Retaliation", src: "Retaliation p.3-5" },
    { id: "contractors", name: "Contractors", src: "Contractors sheet p.1", fig: "#1e373c", when: (c) => c.has("contractors") },
    { id: "ss", name: "Support Squad", src: "Support Squad sheet p.2", fig: "#312e21", when: (c) => c.has("ss") },
    { id: "insider", name: "Insider", src: "Insider p.2", fig: "#31283c", when: (c) => c.has("insider") },
    { id: "sangre", name: "Sangrevores", src: "Sangrevores p.2", fig: "#3c2025", when: (c) => c.race === "sangre" },
    { id: "neoflesh", name: "Neoflesh Cult", src: "Neoflesh p.3", fig: "#362b1e", when: (c) => c.race === "neoflesh" },
    { id: "xyrians", name: "Xyrians", src: "Xyrians p.12", fig: "#27333f", when: (c) => c.has("xyrians") }
  ],
  items: [
    /* ---- Retaliation p.3: standard-sized cards ---- */
    { set: "base", qty: "5", name: "Help cards", img: "base-help-cards.webp", w: 319, h: 320,
      when: (c) => c.race !== "neoflesh" },
    { set: "base", qty: "6", name: "Character Draft cards", img: "base-draft-cards.webp", w: 311, h: 320 },
    { set: "base", qty: "60", name: "Action cards", note: "10 per Character", img: "base-action-cards.webp", w: 303, h: 320 },
    { set: "base", qty: "27", name: "Contamination cards", note: "They share a common back with the Action cards but form a separate deck", img: "base-contamination.webp", w: 320, h: 314,
      when: (c) => c.race !== "sangre" },
    { set: "base", qty: "8", name: "Mission Task cards", img: "base-mission-tasks.webp", w: 317, h: 320,
      when: (c) => c.mode !== "solocoop" },
    { set: "base", qty: "22", name: "Objective cards", note: "7 Mission Objectives and 15 Private Objectives", img: "base-objectives.webp", w: 300, h: 320,
      when: (c) => c.mode !== "solocoop" },
    { set: "base", qty: "12", name: "Solo/Coop Objective cards", note: "Solo / Co-op: draw 1 per Character instead of the Mission Task card; the Objective cards are not used (Retaliation p.40)", img: "base-solo-coop.webp", w: 320, h: 317,
      when: (c) => c.mode === "solocoop" },
    { set: "base", qty: "12", name: "Exploration cards", img: "base-exploration.webp", w: 317, h: 320,
      when: (c) => c.race !== "sangre" && c.race !== "neoflesh" },
    { set: "base", qty: "20", name: "Event cards", img: "base-events.webp", w: 309, h: 320,
      when: (c) => c.race !== "sangre" && c.race !== "neoflesh" },
    { set: "base", qty: "20", name: "Intruder Attack cards", img: "base-intruder-attack.webp", w: 320, h: 314,
      when: (c) => c.race !== "sangre" && c.race !== "neoflesh" },

    /* ---- Retaliation p.3: small cards ---- */
    { set: "base", qty: "90", name: "Item cards", note: "30 cards of each type", img: "base-items.webp", w: 320, h: 305 },
    { set: "base", qty: "7", name: "Character Item cards", img: "base-character-items.webp", w: 308, h: 320 },
    { set: "base", qty: "24", name: "Support Equipment cards", img: "base-support-equipment.webp", w: 320, h: 311 },
    { set: "base", qty: "27", name: "Serious Wound cards", img: "base-serious-wounds.webp", w: 320, h: 266 },
    { set: "base", qty: "6", name: "Robot cards", img: "base-robot-cards.webp", w: 320, h: 286 },
    { set: "base", qty: "12", name: "Queen Health cards", img: "base-queen-health.webp", w: 320, h: 289,
      when: (c) => c.race !== "sangre" && c.race !== "neoflesh" },

    /* ---- Retaliation p.4: main components ---- */
    { set: "base", qty: "3", name: "Round track border pieces", img: "base-round-track.webp", w: 320, h: 208 },
    { set: "base", qty: "3", name: "Section border pieces", img: "base-section-borders.webp", w: 320, h: 244 },
    { set: "base", qty: "23", name: "Room tiles", note: "3 “A”, 3 “B”, 4 “C”, 13 “?”", img: "base-room-tiles.webp", w: 317, h: 320 },
    { set: "base", qty: "40", name: "Corridor tiles", note: "10 each of values 1, 2, 3 and 4", img: "base-corridors.webp", w: 320, h: 228 },
    { set: "base", qty: "5", name: "Character boards", img: "base-character-boards.webp", w: 320, h: 222 },
    { set: "base", qty: "6", name: "Character tiles", img: "base-character-tiles.webp", w: 320, h: 205 },
    { set: "base", qty: "1", name: "Scanner", img: "base-scanner.webp", w: 316, h: 218 },
    { set: "base", qty: "1", name: "Intruder bag", img: "base-intruder-bag.webp", w: 185, h: 224 },
    { set: "base", qty: "5", name: "Numbered Backpack card holders", img: "base-backpacks.webp", w: 320, h: 198 },
    { set: "base", qty: "1", name: "Room Help sheet", img: "base-help-sheets.webp", w: 320, h: 241 },
    { set: "base", qty: "1", name: "Objective Help sheet", img: "base-help-sheets.webp", w: 320, h: 241 },
    { set: "base", qty: "6", name: "Colored plastic rings", img: "base-rings.webp", w: 297, h: 163 },
    { set: "base", qty: "1", name: "Intruder Help sheet", img: "base-intruder-help.webp", w: 276, h: 190,
      when: (c) => c.race !== "sangre" && c.race !== "neoflesh" },
    { set: "base", qty: "2", name: "Six-sided Burst dice", img: "base-dice.webp", w: 297, h: 176 },
    { set: "base", qty: "2", name: "Eight-sided Shoot dice", img: "base-dice.webp", w: 297, h: 176 },
    { set: "base", qty: "2", name: "Ten-sided Noise dice", img: "base-dice.webp", w: 297, h: 176 },

    /* ---- Retaliation p.4-5: standees/models (miniatures or standees, depending on your version) ---- */
    { set: "base", qty: "6", name: "Characters", note: "Models: miniatures or standees, depending on your version of the game", img: "base-characters.webp", w: 320, h: 208 },
    { set: "base", qty: "8", name: "Drones in 4 poses", img: "base-drones.webp", w: 320, h: 260,
      when: (c) => c.race !== "sangre" && c.race !== "neoflesh" },
    { set: "base", qty: "1", name: "Robot", img: "base-robot.webp", w: 316, h: 207 },
    { set: "base", qty: "36", name: "Adults in 6 poses", img: "base-adults.webp", w: 320, h: 296,
      when: (c) => c.race !== "sangre" && c.race !== "neoflesh" },
    { set: "base", qty: "6", name: "Larvae", img: "base-larvae.webp", w: 320, h: 229,
      when: (c) => c.race !== "sangre" && c.race !== "neoflesh" },
    { set: "base", qty: "1", name: "Queen", img: "base-queen.webp", w: 320, h: 299,
      when: (c) => c.race !== "sangre" && c.race !== "neoflesh" },

    /* ---- Retaliation p.5: markers and tokens ---- */
    { set: "base", qty: "9", name: "Fire markers", img: "base-fire.webp", w: 294, h: 136 },
    { set: "base", qty: "14", name: "Malfunction markers", img: "base-malfunction.webp", w: 315, h: 136 },
    { set: "base", qty: "30", name: "Noise markers", img: "base-noise.webp", w: 300, h: 136,
      when: (c) => c.race !== "sangre" },
    { set: "base", qty: "30", name: "Noise markers", note: "With Sangrevores they are called Shadow markers, with their own rules (Sangrevores p.3)", img: "base-noise.webp", w: 300, h: 136,
      when: (c) => c.race === "sangre" },
    { set: "base", qty: "30", name: "Universal markers", img: "base-universal.webp", w: 320, h: 129 },
    { set: "base", qty: "1", name: "Round marker", img: "base-round-marker.webp", w: 153, h: 157 },
    { set: "base", qty: "5", name: "Egg tokens", img: "base-eggs.webp", w: 258, h: 157 },
    { set: "base", qty: "1", name: "Autodestruction token", img: "base-autodestruction-lander.webp", w: 218, h: 157 },
    { set: "base", qty: "1", name: "Lander token", img: "base-autodestruction-lander.webp", w: 218, h: 157 },
    { set: "base", qty: "20", name: "Secure tokens", img: "base-secure.webp", w: 254, h: 172 },
    { set: "base", qty: "14", name: "Door tokens", note: "With standee bases", img: "base-doors.webp", w: 306, h: 193 },
    { set: "base", qty: "5", name: "Data tokens", img: "base-data.webp", w: 258, h: 193 },
    { set: "base", qty: "1", name: "Hibernatorium token", img: "base-hibernatorium-token.webp", w: 276, h: 138 },
    { set: "base", qty: "3", name: "Life Support tokens", img: "base-life-support.webp", w: 320, h: 192 },
    { set: "base", qty: "1", name: "Undiscovered Hibernatorium tile", img: "base-undiscovered-hib.webp", w: 320, h: 222 },
    { set: "base", qty: "80", name: "Tactical Gear tokens", note: "20 Ammo, 20 Grenades, 20 Oxygen, 20 Medpack", img: "base-tactical-gear.webp", w: 215, h: 221 },
    { set: "base", qty: "2", name: "Anti-Aircraft tokens", img: "base-anti-aircraft.webp", w: 227, h: 242 },
    { set: "base", qty: "5", name: "Suffocating tokens", img: "base-suffocating.webp", w: 298, h: 270 },
    { set: "base", qty: "1", name: "Starting Player token", img: "base-starting-player.webp", w: 227, h: 245 },
    { set: "base", qty: "40", name: "Intruder tokens", note: "1 Blank, 9 Queens, 8 Drones, 16 Adults, 6 Larvae", img: "base-intruder-tokens.webp", w: 303, h: 224,
      when: (c) => c.race !== "sangre" && c.race !== "neoflesh" },
    { set: "base", qty: "40", name: "Intruder tokens", note: "1 Blank, 9 Queens, 8 Drones, 16 Adults, 6 Larvae. With Sangrevores the Intruder bag takes 1 Blank token and Sangrevore tokens (Sangrevores p.2)", img: "base-intruder-tokens.webp", w: 303, h: 224,
      when: (c) => c.race === "sangre" },
    { set: "base", qty: "40", name: "Intruder tokens", note: "1 Blank, 9 Queens, 8 Drones, 16 Adults, 6 Larvae. With the Neoflesh Cult the Intruder bag takes 1 Blank token and Neoflesh Cult tokens (Neoflesh p.4)", img: "base-intruder-tokens.webp", w: 303, h: 224,
      when: (c) => c.race === "neoflesh" },
    { set: "base", qty: "5", name: "Oxygen counters", note: "And 5 sets of Oxygen counter pins, to be assembled with the Character boards", img: "base-oxygen-counters.webp", w: 320, h: 272 },

    /* ---- Contractors: Contractors sheet p.1 ---- */
    { set: "contractors", qty: "60", name: "Action cards", note: "5 per Contractor", img: "con-action-cards.webp", w: 310, h: 307 },
    { set: "contractors", qty: "12", name: "Small Contractor Draft cards", img: "con-draft-cards.webp", w: 320, h: 282 },
    { set: "contractors", qty: "24", name: "Character Item cards", note: "2 per Contractor", img: "con-character-items.webp", w: 303, h: 248 },
    { set: "contractors", qty: "6", name: "Double-sided Character tiles", img: "con-character-tiles.webp", w: 320, h: 197 },

    /* ---- Support Squad: Support Squad sheet p.2 ---- */
    { set: "ss", qty: "2", name: "Character models and standees", img: "ss-characters.webp", w: 320, h: 183 },
    { set: "ss", qty: "1", name: "UAV model and standee", img: "ss-uav.webp", w: 255, h: 227 },
    { set: "ss", qty: "2", name: "Character Draft cards", img: "ss-draft-cards.webp", w: 298, h: 204 },
    { set: "ss", qty: "2", name: "Character Item cards", img: "ss-character-items.webp", w: 297, h: 218 },
    { set: "ss", qty: "20", name: "Action cards", img: "ss-action-cards.webp", w: 313, h: 295 },

    /* ---- Insider: Insider p.2 ---- */
    { set: "insider", qty: "1", name: "Insider model and standee", img: "ins-insider.webp", w: 320, h: 309 },
    { set: "insider", qty: "1", name: "Insider card", img: "ins-insider-card.webp", w: 320, h: 260 },
    { set: "insider", qty: "55", name: "Story cards", note: "Placed Room-name side up; do not shuffle (Insider p.2)", img: "ins-story-cards.webp", w: 320, h: 317 },

    /* ---- Sangrevores: Sangrevores p.2 ---- */
    { set: "sangre", qty: "13", name: "Tainted Blood cards", img: "san-tainted-blood.webp", w: 295, h: 306 },
    { set: "sangre", qty: "18", name: "Infection cards", note: "Placed instead of the Contamination deck (Sangrevores p.2)", img: "san-infection.webp", w: 316, h: 306 },
    { set: "sangre", qty: "20", name: "Sangrevore Attack cards", img: "san-attack.webp", w: 290, h: 320 },
    { set: "sangre", qty: "12", name: "Sangrevore Exploration cards", img: "san-exploration.webp", w: 311, h: 320 },
    { set: "sangre", qty: "20", name: "Sangrevore Event cards", img: "san-events.webp", w: 293, h: 320 },
    { set: "sangre", qty: "13", name: "Shadow cards", img: "san-shadow.webp", w: 314, h: 320 },
    { set: "sangre", qty: "12", name: "Sangrevore King Health cards", img: "san-king-health.webp", w: 258, h: 218 },
    { set: "sangre", qty: "1", name: "Sangrevore Help sheet", img: "san-help-sheet.webp", w: 320, h: 192 },
    { set: "sangre", qty: "33", name: "Sangrevore tokens", note: "The Intruder bag starts with 1 Blank, 2 Blood Specter and 3 random Ghoul tokens, plus 1 Ghoul per Character (Sangrevores p.2)", img: "san-tokens.webp", w: 306, h: 218 },
    { set: "sangre", qty: "1", name: "King", img: "san-king.webp", w: 320, h: 276 },
    { set: "sangre", qty: "8", name: "Blood Specters in 4 poses", img: "san-specters.webp", w: 320, h: 250 },
    { set: "sangre", qty: "36", name: "Ghouls in 6 poses", img: "san-ghouls.webp", w: 320, h: 226 },

    /* ---- Neoflesh Cult: Neoflesh p.3 ---- */
    { set: "neoflesh", qty: "20", name: "Neoflesh Cult Event cards", img: "neo-events.webp", w: 320, h: 311 },
    { set: "neoflesh", qty: "12", name: "Neoflesh Cult Exploration cards", img: "neo-exploration.webp", w: 320, h: 320 },
    { set: "neoflesh", qty: "5", name: "Neoflesh Cult Help cards", note: "Replace the standard Help cards (Neoflesh p.4)", img: "neo-help-cards.webp", w: 311, h: 320 },
    { set: "neoflesh", qty: "20", name: "Neoflesh Cult Attack cards", img: "neo-attack.webp", w: 310, h: 320 },
    { set: "neoflesh", qty: "12", name: "Neoflesh Cult Queen Health cards", img: "neo-queen-health.webp", w: 306, h: 276 },
    { set: "neoflesh", qty: "6", name: "Neoflesh Cult Skill cards", img: "neo-skills.webp", w: 320, h: 273 },
    { set: "neoflesh", qty: "36", name: "Neoflesh Cult Intruder tokens", note: "The Intruder bag starts with 1 Blank, 2 Twitchling and 3 random Adult tokens, plus 1 Adult per Character (Neoflesh p.4)", img: "neo-tokens.webp", w: 315, h: 230 },
    { set: "neoflesh", qty: "3", name: "Body tokens", img: "neo-body-tokens.webp", w: 288, h: 270 },
    { set: "neoflesh", qty: "1", name: "Motherbrain", img: "neo-motherbrain.webp", w: 320, h: 213 },
    { set: "neoflesh", qty: "5", name: "Cultists in 2 poses", img: "neo-cultists.webp", w: 279, h: 248 },
    { set: "neoflesh", qty: "9", name: "Ironclads", img: "neo-ironclads.webp", w: 320, h: 214 },
    { set: "neoflesh", qty: "9", name: "Slashers", img: "neo-slashers.webp", w: 303, h: 242 },
    { set: "neoflesh", qty: "9", name: "Crawlmines", img: "neo-crawlmines.webp", w: 320, h: 239 },
    { set: "neoflesh", qty: "9", name: "Firespitters", img: "neo-firespitters.webp", w: 288, h: 264 },
    { set: "neoflesh", qty: "10", name: "Twitchlings in 2 poses", img: "neo-twitchlings.webp", w: 320, h: 247 },
    { set: "neoflesh", qty: "1", name: "Dead Neoflesh Cultists tile", img: "neo-dead-cultists-tile.webp", w: 320, h: 127 },
    { set: "neoflesh", qty: "1", name: "Absorbed Bodies tile", img: "neo-absorbed-bodies.webp", w: 320, h: 127 },
    { set: "neoflesh", qty: "1", name: "Neoflesh Cult Intruder Help sheet", img: "neo-help-sheet.webp", w: 320, h: 202 },

    /* ---- Xyrians: Xyrians p.12 ---- */
    { set: "xyrians", qty: "3", name: "Xyrian models" },
    { set: "xyrians", qty: "3", name: "Trace tokens", img: "xyr-trace-token.webp", w: 154, h: 185 },
    { set: "xyrians", qty: "1", name: "Xyrian token", img: "xyr-xyrian-token.webp", w: 151, h: 161 },
    { set: "xyrians", qty: "1", name: "Available Allegiance token" },
    { set: "xyrians", qty: "3", name: "Injury tokens" },
    { set: "xyrians", qty: "10", name: "Xyrian Activation cards" },
    { set: "xyrians", qty: "3", name: "Xyrian Event cards", note: "1 random card is shuffled into the Event deck (Xyrians p.3)" },
    { set: "xyrians", qty: "3", name: "Xyrian Exploration cards", note: "All 3 are shuffled into the Exploration deck (Xyrians p.3)" },
    { set: "xyrians", qty: "1", name: "Xyrian Help card" },
    { set: "xyrians", qty: "1", name: "Xyrian Phase card" },
    { set: "xyrians", qty: "3", name: "Xyrian Status cards" },
    { set: "xyrians", qty: "3", name: "Xyrian Item cards" },
    { set: "xyrians", qty: "1", name: "Allegiance card" }
  ]
};
