/* =============================================================================
   The Great Wall — Components glossary data (standard v1.1; rendered by js/comp-widget.js)
   Sources: Core p.2 (Component List) · Black Powder p.2 · Stretch Goals p.2 · Ancient Beasts p.2 (the Ancient
   Beasts sheet prints no page numbers: its credits page counts as p.1, as elsewhere on this page). Pictures
   cropped from those pages. The fifth Clan's Clerks, Spearmen, Archers and Horsemen (Stretch Goals p.2) share one
   photo in which the figures overlap, so each is cropped to its own extent with the neighbouring figures painted
   out in the page's paper colour. The FAQ/Errata corrects no component counts.
   Gating by mode (Core p.11–14): the Reed Clan cards show in 2-player games and the Solo mode (which uses the Reed
   Clan); the co-op cards, Event cards and Emperor's Request cards only in Co-op mode, where the standard Horde
   cards and the Artifact cards stay in the box (Core p.14); the Solo cards only in Solo mode.
   Co-op also leaves out the expansions' Artifact cards (Black Powder, Rat: the Requests fill the Artifact slots) and
   their Horde cards (Black Powder, the 9 Genghis Khan Hordes): their books add them only to the basic Horde deck,
   and co-op uses the co-op Horde deck instead (Core p.14 · Black Powder p.3 · Stretch Goals p.3), as the page's
   setup does. Exception: the co-op Scenarios drop the Emperor's Requests (Stretch Goals p.6–7) and put the base and
   Ancient Chronicles Artifacts on the slots (Stretch Goals p.4).
   Stretch Goals parts follow their module (Genghis Khan, Ancient Chronicles, Rat). The 5th Player cards and the
   fifth Clan's colored components (Clerks, Soldiers, Player screen, Tea track and Honor markers: the set each
   player takes, Core p.5) show in 5-player games (Stretch Goals p.7).
   ============================================================================= */
window.AID_COMPONENTS = {
  sets: [
    { id: "core", name: "The Great Wall", src: "Core p.2" },
    { id: "bp", name: "Black Powder", src: "Black Powder p.2", when: (c) => c.has("bp") },
    { id: "sg", name: "Stretch Goals", src: "Stretch Goals p.2", when: (c) => c.has("sg") },
    { id: "ab", name: "Ancient Beasts", src: "Ancient Beasts p.2", when: (c) => c.has("ab") }
  ],
  items: [
    /* ---- Core box (Core p.2) ---- */
    { set: "core", qty: "1", name: "Game board", img: "core-board.webp", w: 214, h: 320 },
    { set: "core", qty: "32", name: "Clerks", note: "8 per Player", img: "core-clerks.webp", w: 267, h: 248 },
    { set: "core", qty: "40", name: "Spearmen", note: "10 per Player", img: "core-spearmen.webp", w: 286, h: 291 },
    { set: "core", qty: "16", name: "Archers", note: "4 per Player", img: "core-archers.webp", w: 316, h: 279 },
    { set: "core", qty: "8", name: "Horsemen", note: "2 per Player", img: "core-horsemen.webp", w: 320, h: 230 },
    { set: "core", qty: "24", name: "Horde cards", img: "core-horde.webp", w: 255, h: 163, when: (c) => c.mode !== "coop" },
    { set: "core", qty: "24", name: "Command cards", note: "In 4 colors", img: "core-command.webp", w: 193, h: 169 },
    { set: "core", qty: "1", name: "Reed Command card", note: "The Reed Clan plays in 2-player games and in the Solo mode (Core p.11–12)", img: "core-reed-command.webp", w: 184, h: 157, when: (c) => c.p <= 2 },
    { set: "core", qty: "20", name: "Tactic cards", img: "core-tactic.webp", w: 220, h: 169 },
    { set: "core", qty: "5", name: "Artifact cards", img: "core-artifact.webp", w: 245, h: 133, when: (c) => c.mode !== "coop" },
    { set: "core", qty: "5", name: "Artifact cards", note: "Co-op Scenarios don’t use the Emperor’s Requests, so these go on the Artifact slots, shuffled with the Ancient Chronicles Artifacts (Stretch Goals p.4, p.6–7)", img: "core-artifact.webp", w: 245, h: 133, when: (c) => c.mode === "coop" && c.mod("ac") },
    { set: "core", qty: "44", name: "Advisor cards", img: "core-advisor.webp", w: 252, h: 160 },
    { set: "core", qty: "13", name: "General cards", img: "core-general.webp", w: 258, h: 154 },
    { set: "core", qty: "2", name: "Reed Clan General cards", note: "The Reed Clan plays in 2-player games and in the Solo mode (Core p.11–12)", img: "core-reed-general.webp", w: 251, h: 154, when: (c) => c.p <= 2 },
    { set: "core", qty: "12", name: "Event cards", note: "Co-op mode: the Event deck (Core p.14)", img: "core-event.webp", w: 246, h: 175, when: (c) => c.mode === "coop" },
    { set: "core", qty: "12", name: "Emperor’s Request cards", note: "Co-op mode: they take the Artifact slots (Core p.14)", img: "core-request.webp", w: 255, h: 163, when: (c) => c.mode === "coop" && !c.mod("ac") },
    { set: "core", qty: "24", name: "Co-op Horde cards", note: "Co-op mode: they replace the standard Horde cards (Core p.14)", img: "core-coop-horde.webp", w: 276, h: 166, when: (c) => c.mode === "coop" },
    { set: "core", qty: "8", name: "Co-op General cards", note: "Shuffled in with the regular Generals (Core p.14)", img: "core-coop-general.webp", w: 252, h: 154, when: (c) => c.mode === "coop" },
    { set: "core", qty: "12", name: "Co-op Tactic cards", note: "Shuffled in with the regular Tactic cards (Core p.14)", img: "core-coop-tactic.webp", w: 254, h: 172, when: (c) => c.mode === "coop" },
    { set: "core", qty: "1", name: "Solo General card", note: "Qin Jiushao, the AI General (Core p.12)", img: "core-solo-general.webp", w: 252, h: 148, when: (c) => c.mode === "solo" },
    { set: "core", qty: "6", name: "Solo Command cards", note: "Qin Jiushao’s Solo Command deck (Core p.12)", img: "core-solo-command.webp", w: 202, h: 166, when: (c) => c.mode === "solo" },
    { set: "core", qty: "4", name: "Tea track markers", note: "In 4 colors", img: "core-tea.webp", w: 320, h: 93 },
    { set: "core", qty: "4", name: "Honor markers", note: "In 4 colors", img: "core-honor-markers.webp", w: 320, h: 98 },
    { set: "core", qty: "5", name: "Two-sided universal Honor tokens", img: "core-honor-tokens.webp", w: 320, h: 107 },
    { set: "core", qty: "50", name: "Wood tokens", img: "core-wood.webp", w: 254, h: 181 },
    { set: "core", qty: "50", name: "Stone tokens", img: "core-stone.webp", w: 227, h: 160 },
    { set: "core", qty: "50", name: "Gold tokens", img: "core-gold.webp", w: 251, h: 154 },
    { set: "core", qty: "50", name: "Chi tokens", img: "core-chi.webp", w: 245, h: 172 },
    { set: "core", qty: "30", name: "Wound markers", img: "core-wound.webp", w: 233, h: 129 },
    { set: "core", qty: "50", name: "Shame tokens", img: "core-shame.webp", w: 316, h: 157 },
    { set: "core", qty: "1", name: "Two-sided Time token", img: "core-time.webp", w: 215, h: 132 },
    { set: "core", qty: "4", name: "Player’s Screens", note: "1 per Player", img: "core-screens.webp", w: 320, h: 190 },
    { set: "core", qty: "9", name: "Barricade", img: "core-barricade.webp", w: 320, h: 187 },
    { set: "core", qty: "3", name: "1st Wall level", img: "core-wall1.webp", w: 320, h: 199 },
    { set: "core", qty: "3", name: "2nd Wall level", img: "core-wall2.webp", w: 297, h: 206 },
    { set: "core", qty: "3", name: "3rd Wall level", img: "core-wall3.webp", w: 258, h: 206 },
    { set: "core", qty: "2", name: "Stickers Sheet", img: "core-stickers.webp", w: 239, h: 221 },

    /* ---- Black Powder (Black Powder p.2) ---- */
    { set: "bp", qty: "15", name: "Special Soldier", note: "3 for each Clan", img: "bp-special-soldiers.webp", w: 320, h: 142 },
    { set: "bp", qty: "6", name: "War Machine", img: "bp-war-machines.webp", w: 320, h: 227 },
    { set: "bp", qty: "9", name: "Siege Engine", img: "bp-siege-engines.webp", w: 320, h: 266 },
    { set: "bp", qty: "6", name: "Snake Clan tokens", img: "bp-snake-tokens.webp", w: 233, h: 135 },
    { set: "bp", qty: "12", name: "Horde cards", img: "bp-horde.webp", w: 255, h: 156, when: (c) => c.mode !== "coop" },
    { set: "bp", qty: "3", name: "War Machine Help cards", img: "bp-wm-help.webp", w: 251, h: 142 },
    { set: "bp", qty: "6", name: "Artifact cards", img: "bp-artifact.webp", w: 243, h: 139, when: (c) => c.mode !== "coop" },
    { set: "bp", qty: "5", name: "Special Soldier Help cards", img: "bp-ss-help.webp", w: 267, h: 160 },
    { set: "bp", qty: "12", name: "War Machine Shot cards", img: "bp-shot.webp", w: 240, h: 157 },
    { set: "bp", qty: "12", name: "Advisor cards", img: "bp-advisor.webp", w: 245, h: 160 },
    { set: "bp", qty: "4", name: "General cards", img: "bp-general.webp", w: 288, h: 160 },
    { set: "bp", qty: "4", name: "Towers", img: "bp-towers.webp", w: 239, h: 214 },
    { set: "bp", qty: "8", name: "Stickers Sheet", img: "bp-stickers.webp", w: 224, h: 214 },

    /* ---- Stretch Goals (Stretch Goals p.2) ---- */
    { set: "sg", qty: "5", name: "Bannerman", note: "1 per Player. Genghis Khan expansion (Stretch Goals p.3)", img: "sg-bannermen.webp", w: 320, h: 265, when: (c) => c.mod("gk") },
    { set: "sg", qty: "8", name: "Clerks", note: "The fifth Clan’s, for a 5-player game", img: "sg-clerks.webp", w: 88, h: 304, when: (c) => c.p === 5 },
    { set: "sg", qty: "10", name: "Spearmen", note: "The fifth Clan’s, for a 5-player game", img: "sg-spearmen.webp", w: 132, h: 320, when: (c) => c.p === 5 },
    { set: "sg", qty: "4", name: "Archers", note: "The fifth Clan’s, for a 5-player game", img: "sg-archers.webp", w: 96, h: 320, when: (c) => c.p === 5 },
    { set: "sg", qty: "2", name: "Horsemen", note: "The fifth Clan’s, for a 5-player game", img: "sg-horsemen.webp", w: 150, h: 320, when: (c) => c.p === 5 },
    { set: "sg", qty: "1", name: "Genghis Khan", img: "sg-khan.webp", w: 147, h: 320, when: (c) => c.mod("gk") },
    { set: "sg", qty: "1", name: "Emperor’s Award", note: "The model placed on the active Emperor’s Award card (Stretch Goals p.3)", img: "sg-award.webp", w: 255, h: 295, when: (c) => c.mod("gk") },
    { set: "sg", qty: "1", name: "Rat", img: "sg-rat.webp", w: 200, h: 320, when: (c) => c.mod("rat") },
    { set: "sg", qty: "1", name: "Genghis Khan Horde card", img: "sg-khan-horde-card.webp", w: 251, h: 163, when: (c) => c.mod("gk") },
    { set: "sg", qty: "9", name: "Genghis Khan Horde cards", note: "3 new Horde types (Stretch Goals p.3)", img: "sg-khan-horde.webp", w: 301, h: 179, when: (c) => c.mod("gk") && c.mode !== "coop" },
    { set: "sg", qty: "6", name: "Genghis Khan Advisor cards", img: "sg-khan-advisor.webp", w: 249, h: 166, when: (c) => c.mod("gk") },
    { set: "sg", qty: "6", name: "Emperor’s Award cards", img: "sg-award-cards.webp", w: 202, h: 150, when: (c) => c.mod("gk") },
    { set: "sg", qty: "6", name: "Genghis Khan Skill cards", img: "sg-khan-skill.webp", w: 179, h: 166, when: (c) => c.mod("gk") },
    { set: "sg", qty: "5", name: "Genghis Khan Help cards", img: "sg-khan-help.webp", w: 199, h: 172, when: (c) => c.mod("gk") },
    { set: "sg", qty: "5", name: "Rat cards", img: "sg-rat-cards.webp", w: 215, h: 166, when: (c) => c.mod("rat") },
    { set: "sg", qty: "5", name: "Rat Artifact cards", img: "sg-rat-artifact.webp", w: 233, h: 166, when: (c) => c.mod("rat") && c.mode !== "coop" },
    { set: "sg", qty: "6", name: "Scenario cards", img: "sg-scenario.webp", w: 288, h: 184, when: (c) => c.mod("ac") },
    { set: "sg", qty: "4", name: "Ancient Chronicles General cards", img: "sg-ac-general.webp", w: 301, h: 181, when: (c) => c.mod("ac") },
    { set: "sg", qty: "8", name: "Ancient Chronicles Tactic cards", img: "sg-ac-tactic.webp", w: 221, h: 181, when: (c) => c.mod("ac") },
    { set: "sg", qty: "10", name: "Ancient Chronicles Advisor cards", img: "sg-ac-advisor.webp", w: 245, h: 175, when: (c) => c.mod("ac") },
    { set: "sg", qty: "10", name: "Ancient Chronicles Artifact cards", img: "sg-ac-artifact.webp", w: 246, h: 175, when: (c) => c.mod("ac") },
    { set: "sg", qty: "4", name: "5th Player General cards", img: "sg-5p-general.webp", w: 301, h: 181, when: (c) => c.p === 5 },
    { set: "sg", qty: "4", name: "5th Player Tactic cards", img: "sg-5p-tactic.webp", w: 221, h: 181, when: (c) => c.p === 5 },
    { set: "sg", qty: "4", name: "5th Player Advisor cards", img: "sg-5p-advisor.webp", w: 245, h: 169, when: (c) => c.p === 5 },
    { set: "sg", qty: "6", name: "5th Player Command cards", img: "sg-5p-command.webp", w: 214, h: 181, when: (c) => c.p === 5 },
    { set: "sg", qty: "1", name: "Tea track marker", note: "The fifth Clan’s, for a 5-player game", img: "sg-tea.webp", w: 159, h: 166, when: (c) => c.p === 5 },
    { set: "sg", qty: "1", name: "Honor marker", note: "The fifth Clan’s, for a 5-player game", img: "sg-honor.webp", w: 163, h: 166, when: (c) => c.p === 5 },
    { set: "sg", qty: "1", name: "Player screen", note: "The fifth Clan’s, for a 5-player game", img: "sg-screen.webp", w: 245, h: 194, when: (c) => c.p === 5 },
    { set: "sg", qty: "1", name: "Stickers Sheet", img: "sg-stickers.webp", w: 227, h: 224 },

    /* ---- Ancient Beasts (Ancient Beasts p.2) ---- */
    { set: "ab", qty: "4", name: "Ancient Beasts", img: "ab-beasts.webp", w: 168, h: 320 },
    { set: "ab", qty: "10", name: "Relic cards", img: "ab-relic.webp", w: 215, h: 114 },
    { set: "ab", qty: "8", name: "Tactic cards", note: "Shuffled into the Tactic deck (Ancient Beasts p.2)", img: "ab-tactic.webp", w: 176, h: 126 },
    { set: "ab", qty: "12", name: "Ancient Beast cards", note: "3 per Beast, one card for each Power level (Ancient Beasts p.2)", img: "ab-beast-cards.webp", w: 200, h: 129 },
    { set: "ab", qty: "12", name: "Advisor cards", note: "Shuffled into the Advisor deck (Ancient Beasts p.2)", img: "ab-advisor.webp", w: 209, h: 123 },
    { set: "ab", qty: "1", name: "Stickers Sheet", img: "ab-stickers.webp", w: 197, h: 181 }
  ]
};
