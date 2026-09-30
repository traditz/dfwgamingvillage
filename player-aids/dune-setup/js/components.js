/* =============================================================================
   Dune: Imperium & Uprising — Components glossary data (standard v1.1; rendered by js/comp-widget.js)
   Sources (printed page numbers = PDF pages): Base p.3 (Game Components) · Uprising p.3 (Game Components) and
   p.16 (CHOAM Module) · Rivals supplement p.1 and Six-Player supplement p.1 (Additional Game Components) · Rise of
   Ix p.2 · Immortality p.3 · Bloodlines p.2 (with its CHOAM Module box), p.6 (Tech Module) and p.8 (solo and
   two-player additions). Pictures cropped from those pages; the sets printed on the books' blue-grey panels
   carry that panel colour (fig).
   Gating: each game's own box shows only for that game (c.game). Parts "used only in a solo / two-player game"
   follow the player count (c.p); module parts follow the module (c.mod), except that the CHOAM Module must be used
   in a six-player game (Six-Player supplement p.2), so its parts also show at 6 players; the Control the Spice card
   follows Epic Game Mode. With the Tech Module and all of Rise of Ix the Ixian Embassy board isn't used (Bloodlines p.7), so
   it is hidden. Uprising-specific notes on Rise of Ix parts come from Uprising p.18.
   ============================================================================= */
window.AID_COMPONENTS = {
  sets: [
    { id: "base", name: "Dune: Imperium", src: "Base p.3", when: (c) => c.game === "imperium" },
    { id: "upr", name: "Dune: Imperium — Uprising", src: "Uprising p.3", when: (c) => c.game === "uprising" },
    { id: "choam", name: "CHOAM Module (Uprising)", src: "Uprising p.16", fig: "#b7bebd", when: (c) => c.game === "uprising" && (c.mod("choam") || c.p === 6) },
    { id: "rivals", name: "Rivals: solo and two-player games (Uprising)", src: "Rivals supplement p.1", fig: "#b7bebd", when: (c) => c.game === "uprising" && c.p <= 2 },
    { id: "six", name: "Six-player games (Uprising)", src: "Six-Player supplement p.1", when: (c) => c.game === "uprising" && c.p === 6 },
    { id: "ix", name: "Rise of Ix", src: "Rise of Ix p.2", when: (c) => c.has("ix") },
    { id: "imm", name: "Immortality", src: "Immortality p.3", when: (c) => c.has("imm") },
    { id: "bl", name: "Bloodlines", src: "Bloodlines p.2", when: (c) => c.has("bl") },
    { id: "blchoam", name: "Bloodlines: CHOAM Module", src: "Bloodlines p.2", fig: "#b7bebd", when: (c) => c.has("bl") && (c.mod("choam") || c.p === 6) },
    { id: "blsolo", name: "Bloodlines: solo and two-player games", src: "Bloodlines p.8", fig: "#b7bebd", when: (c) => c.has("bl") && c.p <= 2 },
    { id: "tech", name: "Tech Module (Bloodlines)", src: "Bloodlines p.6", fig: "#b7bebd", when: (c) => c.mod("tech") }
  ],
  items: [
    /* ---- Dune: Imperium (Base p.3) ---- */
    { set: "base", name: "Game board", img: "base-board.webp", w: 320, h: 320 },
    { set: "base", name: "Board Space Guide sheet", img: "base-board-guide.webp", w: 320, h: 316 },
    { set: "base", qty: "15", name: "Water tokens", img: "base-water.webp", w: 316, h: 306 },
    { set: "base", name: "Solari tokens", note: "4 large (worth 5), 20 small (worth 1)", img: "base-solari.webp", w: 286, h: 320 },
    { set: "base", name: "Spice tokens", note: "3 large (worth 5), 20 small (worth 1)", img: "base-spice.webp", w: 286, h: 320 },
    { set: "base", qty: "18", name: "Conflict cards", note: "4 Conflict I, 10 Conflict II, 4 Conflict III", img: "base-conflict.webp", w: 320, h: 119 },
    { set: "base", qty: "40", name: "Intrigue cards", img: "base-intrigue.webp", w: 185, h: 212 },
    { set: "base", name: "Mentat", img: "base-mentat.webp", w: 203, h: 193 },
    { set: "base", qty: "4", name: "Alliance tokens", img: "base-alliance.webp", w: 242, h: 202 },
    { set: "base", qty: "24", name: "Reserve cards", note: "8 Arrakis Liaison, 10 The Spice Must Flow, 6 Foldspace", img: "base-reserve.webp", w: 320, h: 146 },
    { set: "base", qty: "67", name: "Imperium Deck cards", img: "base-imperium.webp", w: 242, h: 320 },
    { set: "base", qty: "8", name: "Leaders", note: "With Turn Sequence guide on their backs", img: "base-leaders.webp", w: 320, h: 251 },
    { set: "base", name: "First Player marker", img: "base-first-player.webp", w: 203, h: 214 },
    { set: "base", qty: "4", name: "Baron Harkonnen tokens", note: "Used with the Baron Vladimir Harkonnen Leader", img: "base-baron.webp", w: 320, h: 148 },
    { set: "base", name: "10-card starting deck", note: "Each player takes one (Base p.5). Containing: Convincing Argument (2), Dagger (2), Diplomacy (1), Dune, the Desert Planet (2), Reconnaissance (1), Seek Allies (1), Signet Ring (1)", img: "base-starting-deck.webp", w: 320, h: 144 },
    { set: "base", qty: "16", name: "Cubes", note: "Per player color (only red is shown)", img: "base-cubes.webp", w: 273, h: 257 },
    { set: "base", qty: "2", name: "Discs", note: "1 Score marker, 1 Councilor token. Per player color", img: "base-discs.webp", w: 236, h: 124 },
    { set: "base", qty: "3", name: "Control markers", note: "Per player color", img: "base-control.webp", w: 264, h: 160 },
    { set: "base", qty: "3", name: "Agents", note: "Per player color", img: "base-agents.webp", w: 257, h: 175 },
    { set: "base", name: "Combat marker", note: "Per player color", img: "base-combat.webp", w: 154, h: 145 },
    { set: "base", qty: "31", name: "House Hagal cards", note: "Used only in a solo or two-player game", img: "base-hagal.webp", w: 306, h: 218, when: (c) => c.p <= 2 },
    { set: "base", name: "House Hagal rules sheet", note: "Used only in a solo or two-player game", img: "base-hagal-sheet.webp", w: 297, h: 294, when: (c) => c.p <= 2 },

    /* ---- Dune: Imperium — Uprising (Uprising p.3) ---- */
    { set: "upr", name: "Two-sided game board", img: "upr-board.webp", w: 319, h: 320 },
    { set: "upr", qty: "20", name: "Water", img: "upr-water.webp", w: 203, h: 288 },
    { set: "upr", name: "Solari", note: "8 large (worth 5), 20 small (worth 1)", img: "upr-solari.webp", w: 227, h: 285 },
    { set: "upr", name: "Spice", note: "7 large (worth 5), 20 small (worth 1)", img: "upr-spice.webp", w: 234, h: 285 },
    { set: "upr", name: "Sandworms", note: "4 plastic, 4 wood. Use either or both, as you prefer", img: "upr-sandworms.webp", w: 166, h: 276 },
    { set: "upr", name: "First Player marker", img: "upr-first-player.webp", w: 175, h: 175 },
    { set: "upr", qty: "4", name: "Alliance tokens", img: "upr-alliance.webp", w: 230, h: 203 },
    { set: "upr", name: "Shield Wall", img: "upr-shield-wall.webp", w: 181, h: 172 },
    { set: "upr", qty: "4", name: "Maker Hooks", img: "upr-maker-hooks.webp", w: 209, h: 153 },
    { set: "upr", qty: "18", name: "Reserve cards", note: "8 Prepare the Way, 10 The Spice Must Flow", img: "upr-reserve.webp", w: 320, h: 221 },
    { set: "upr", qty: "9", name: "Leaders", note: "Two-sided (including 1 used only with the CHOAM module)", img: "upr-leaders.webp", w: 320, h: 236 },
    { set: "upr", qty: "44", name: "Intrigue cards", note: "Including 4 used only with the CHOAM module", img: "upr-intrigue.webp", w: 138, h: 178 },
    { set: "upr", name: "Feyd token", note: "Used with the Feyd-Rautha Harkonnen Leader", img: "upr-feyd.webp", w: 99, h: 101 },
    { set: "upr", name: "Board Space Guide sheet", img: "upr-board-guide.webp", w: 291, h: 288 },
    { set: "upr", qty: "69", name: "Imperium Deck cards", note: "Including 4 used only with the CHOAM module", img: "upr-imperium.webp", w: 190, h: 237 },
    { set: "upr", qty: "16", name: "Conflict cards", note: "3 Conflict I, 9 Conflict II, 4 Conflict III", img: "upr-conflict.webp", w: 320, h: 121 },
    { set: "upr", qty: "5", name: "Objective cards", img: "upr-objective.webp", w: 138, h: 179 },
    { set: "upr", name: "10-card starting deck", note: "Each player takes one (Uprising p.5). Containing: Convincing Argument (2), Dagger (2), Diplomacy (1), Dune, the Desert Planet (2), Reconnaissance (1), Seek Allies (1), Signet Ring (1)", img: "upr-starting-deck.webp", w: 320, h: 159 },
    { set: "upr", qty: "16", name: "Cubes", note: "Per player color (only red is shown)", img: "upr-cubes.webp", w: 257, h: 245 },
    { set: "upr", qty: "2", name: "Discs", note: "1 Score marker, 1 Councilor token. Per player color", img: "upr-discs.webp", w: 212, h: 120 },
    { set: "upr", qty: "3", name: "Spies", note: "Per player color", img: "upr-spies.webp", w: 255, h: 111 },
    { set: "upr", qty: "3", name: "Control markers", note: "Per player color", img: "upr-control.webp", w: 200, h: 157 },
    { set: "upr", qty: "3", name: "Agents", note: "Per player color", img: "upr-agents.webp", w: 228, h: 169 },
    { set: "upr", name: "Combat marker", note: "Per player color", img: "upr-combat.webp", w: 132, h: 142 },

    /* ---- CHOAM Module (Uprising p.16) ---- */
    { set: "choam", name: "4 Imperium cards, 4 Intrigue cards, and Shaddam Corrino IV", note: "Marked with the module’s symbol; already counted in the Uprising box’s card and Leader totals (Uprising p.3, p.16). The module must be used in a six-player game (Six-Player supplement p.2)", img: "choam-cards.webp", w: 320, h: 243 },
    { set: "choam", qty: "20", name: "Contract tokens", img: "choam-contracts.webp", w: 320, h: 192 },
    { set: "choam", qty: "10", name: "Contract tokens with contrasting backs", note: "Used only with the <i>Rise of Ix</i> expansion: deal two to each player, who keeps one (Uprising p.16)", img: "choam-ix-contracts.webp", w: 320, h: 131, when: (c) => c.has("ix") && c.p !== 6 },
    { set: "choam", qty: "10", name: "Contract tokens with contrasting backs", note: "Used only with the <i>Rise of Ix</i> expansion. In a six-player game, deal two to each Ally; each keeps one and gives the other to their Commander, who keeps one of the two (Six-Player supplement p.7)", img: "choam-ix-contracts.webp", w: 320, h: 131, when: (c) => c.has("ix") && c.p === 6 },

    /* ---- Rivals: solo & two-player games (Rivals supplement p.1) ---- */
    { set: "rivals", qty: "37", name: "House Hagal cards", img: "rivals-hagal.webp", w: 240, h: 178 },
    { set: "rivals", qty: "10", name: "Rival cards", img: "rivals-rival-cards.webp", w: 182, h: 233 },

    /* ---- Six-player games (Six-Player supplement p.1) ---- */
    { set: "six", qty: "6", name: "Swordmaster Bonus tokens", img: "six-swordmaster.webp", w: 242, h: 145 },
    { set: "six", qty: "2", name: "Alliance tokens", note: "Great Houses and Fringe Worlds", img: "six-alliance.webp", w: 320, h: 165 },
    { set: "six", qty: "2", name: "Personal boards", note: "Emperor for the Shaddam player, Fremen for the Muad’Dib player", img: "six-boards.webp", w: 320, h: 186 },
    { set: "six", qty: "2", name: "10-card starting decks", note: "<b>Emperor player:</b> Convincing Argument, Corrino Might, Critical Shipments, Demand Results, Devastating Assault, Imperial Ornithopter (2), Imperial Tent, Seek Allies, Signet Ring. <b>Muad’Dib player:</b> Command Respect, Convincing Argument, Demand Attention, Desert Call, Limited Landsraad Access (2), Seek Allies, Signet Ring, Threaten Spice Production, Usul", img: "six-starting-decks.webp", w: 320, h: 169 },
    { set: "six", qty: "2", name: "Discs", note: "1 Score marker, 1 Councilor token. Light blue for the Muad’Dib player, gray for the Shaddam player", img: "six-discs.webp", w: 209, h: 123 },
    { set: "six", qty: "3", name: "Agent tokens", note: "Light blue for the Muad’Dib player, gray for the Shaddam player", img: "six-agents.webp", w: 316, h: 206 },
    { set: "six", name: "Faction cube", note: "Light blue for the Muad’Dib player, gray for the Shaddam player", img: "six-cube.webp", w: 105, h: 132 },
    { set: "six", qty: "3", name: "Spies", note: "Light blue for the Muad’Dib player, gray for the Shaddam player", img: "six-spies.webp", w: 270, h: 144 },

    /* ---- Rise of Ix (Rise of Ix p.2) ---- */
    { set: "ix", name: "CHOAM board overlay", img: "ix-choam-overlay.webp", w: 320, h: 111, when: (c) => c.game !== "uprising" },
    { set: "ix", name: "CHOAM board overlay", note: "With Uprising, keep it folded in half to cover only the board’s top-right corner (Uprising p.18)", img: "ix-choam-overlay.webp", w: 320, h: 111, when: (c) => c.game === "uprising" },
    { set: "ix", qty: "4", name: "Conflict cards", note: "2 Conflict I, 1 Conflict II, 1 Conflict III", img: "ix-conflict.webp", w: 320, h: 156, when: (c) => c.game !== "uprising" },
    { set: "ix", qty: "4", name: "Conflict cards", note: "2 Conflict I, 1 Conflict II, 1 Conflict III. With Uprising the book recommends leaving them out; Epic Game Mode needs one more Conflict III card, so add Economic Supremacy (Uprising p.18)", img: "ix-conflict.webp", w: 320, h: 156, when: (c) => c.game === "uprising" },
    { set: "ix", qty: "17", name: "Intrigue cards", img: "ix-intrigue.webp", w: 169, h: 209 },
    { set: "ix", qty: "18", name: "Tech tiles", img: "ix-tech.webp", w: 320, h: 185 },
    { set: "ix", name: "Ix board", img: "ix-board.webp", w: 320, h: 315, when: (c) => !c.mod("tech") },
    { set: "ix", name: "Ix board", note: "With the Tech Module, all the Tech tiles stack here and the Ixian Embassy isn’t used (Bloodlines p.7)", img: "ix-board.webp", w: 320, h: 315, when: (c) => c.mod("tech") },
    { set: "ix", qty: "4", name: "Snooper tokens", note: "Used with the Tessia Vernius Leader", img: "ix-snooper.webp", w: 320, h: 88 },
    { set: "ix", qty: "35", name: "Imperium Deck cards", img: "ix-imperium.webp", w: 224, h: 300 },
    { set: "ix", qty: "6", name: "Leaders", img: "ix-leaders.webp", w: 320, h: 215, when: (c) => c.game !== "uprising" },
    { set: "ix", qty: "6", name: "Leaders", note: "With Uprising, using Ilesa Ecaz requires the Foldspace cards from <i>Dune: Imperium</i> (Uprising p.18)", img: "ix-leaders.webp", w: 320, h: 215, when: (c) => c.game === "uprising" },
    { set: "ix", qty: "9", name: "House Hagal cards", note: "Used only in a solo or two-player game", img: "ix-hagal.webp", w: 227, h: 191, when: (c) => c.p <= 2 },
    { set: "ix", qty: "2", name: "Rival reference cards", note: "Used only in a solo or two-player game", img: "ix-rival-refs.webp", w: 227, h: 245, when: (c) => c.p <= 2 },
    { set: "ix", qty: "1", name: "Disc", note: "Freighter token. Per player color", img: "ix-freighter.webp", w: 166, h: 148 },
    { set: "ix", qty: "2", name: "Dreadnoughts", note: "Per player color", img: "ix-dreadnoughts.webp", w: 249, h: 145 },
    { set: "ix", qty: "1", name: "Starting card", note: "Control the Spice, used only in Epic Game mode: each player swaps one Dune, the Desert Planet in their starting deck for it (Rise of Ix p.10)", img: "ix-control-spice.webp", w: 169, h: 228, when: (c) => c.mod("epic") },

    /* ---- Immortality (Immortality p.3) ---- */
    { set: "imm", name: "Bene Tleilax board", img: "imm-board.webp", w: 320, h: 230 },
    { set: "imm", qty: "30", name: "Imperium Deck cards", img: "imm-imperium.webp", w: 218, h: 288 },
    { set: "imm", qty: "18", name: "Tleilaxu Deck cards", note: "Their backs are identical to Imperium cards", img: "imm-tleilaxu.webp", w: 221, h: 291 },
    { set: "imm", qty: "1", name: "Reserve card", note: "Reclaimed Forces", img: "imm-reclaimed.webp", w: 206, h: 288 },
    { set: "imm", name: "Research Station overlay", img: "imm-research-overlay.webp", w: 320, h: 202 },
    { set: "imm", qty: "15", name: "Intrigue cards", img: "imm-intrigue.webp", w: 160, h: 208 },
    { set: "imm", name: "Family Atomics token", note: "Each player takes one (Immortality p.5)", img: "imm-atomics.webp", w: 166, h: 166 },
    { set: "imm", qty: "2", name: "Starting cards", note: "Experimentation. Each player swaps the two Dune, the Desert Planet cards in their starting deck for these (Immortality p.5)", img: "imm-experimentation.webp", w: 208, h: 227 },
    { set: "imm", qty: "2", name: "Discs", note: "1 Research token, 1 Tleilaxu token. Per player color", img: "imm-discs.webp", w: 138, h: 139 },
    { set: "imm", qty: "4", name: "House Hagal cards", note: "Used only in a solo game", img: "imm-hagal.webp", w: 221, h: 184, when: (c) => c.p === 1 },

    /* ---- Bloodlines (Bloodlines p.2; its CHOAM Module box on p.2; solo and two-player additions p.8) ---- */
    { set: "bl", qty: "32", name: "Imperium Deck cards", note: "5 used only with the CHOAM Module, 2 used only with the Tech Module", img: "bl-imperium.webp", w: 184, h: 234 },
    { set: "bl", qty: "18", name: "Intrigue cards", note: "1 used only with the CHOAM Module, 2 used only with the Tech Module", img: "bl-intrigue.webp", w: 132, h: 175 },
    { set: "bl", qty: "9", name: "Leaders", note: "1 used only with the Tech Module", img: "bl-leaders.webp", w: 320, h: 214 },
    { set: "bl", qty: "2", name: "Conflict cards", note: "1 Conflict I, 1 Conflict II", img: "bl-conflict.webp", w: 285, h: 197 },
    { set: "bl", name: "Sardaukar Commanders", note: "7 plastic, 7 wood. Use only the type you prefer", img: "bl-sardaukar.webp", w: 320, h: 146 },
    { set: "bl", qty: "14", name: "Sardaukar Commander Skills", img: "bl-skills.webp", w: 320, h: 202 },
    { set: "bl", qty: "10", name: "Navigation cards", note: "Leader-specific: for Steersman Y’rkoon", img: "bl-navigation.webp", w: 320, h: 193 },
    { set: "bl", qty: "12", name: "Twisted Intrigue cards", note: "Leader-specific: for Piter De Vries, each marked with his image", img: "bl-twisted.webp", w: 300, h: 254 },
    { set: "bl", name: "Tuek’s Sietch board space", note: "Leader-specific: for Esmar Tuek", img: "bl-tueks-sietch.webp", w: 320, h: 192 },
    { set: "bl", name: "Tactics token", note: "Leader-specific: for Chani", img: "bl-tactics.webp", w: 90, h: 99 },
    { set: "blchoam", qty: "5", name: "Imperium cards", note: "Shuffle into the Imperium deck. These are the 5 of the 32 Imperium Deck cards used only with the CHOAM Module", img: "bl-choam-imperium.webp", w: 279, h: 285 },
    { set: "blchoam", qty: "8", name: "Contract tokens", note: "Shuffle into the existing contracts", img: "bl-contracts.webp", w: 318, h: 175 },
    { set: "blchoam", name: "Coercive Negotiation", note: "Shuffle into the Intrigue deck. This is the 1 of the 18 Intrigue cards used only with the CHOAM Module", img: "bl-coercive.webp", w: 153, h: 197 },
    { set: "blchoam", name: "CHOAM Transports", note: "If also using the Tech Module: shuffle into the other Tech tiles", img: "bl-choam-transports.webp", w: 224, h: 136, when: (c) => c.mod("tech") },
    { set: "blsolo", qty: "6", name: "House Hagal cards", note: "4 used only with the Tech Module (the Acquire Tech cards, solo only); the 2 Tuek’s Sietch cards only if a player uses Esmar Tuek", img: "bl-hagal.webp", w: 260, h: 199 },
    { set: "blsolo", qty: "6", name: "Rival cards", note: "1 used only with the Tech Module, in a solo game (Bloodlines p.6, p.8)", img: "bl-rival-cards.webp", w: 205, h: 242 },

    /* ---- Tech Module (Bloodlines p.6) ---- */
    { set: "tech", name: "Ixian Embassy board", img: "tech-embassy.webp", w: 153, h: 320, when: (c) => !c.has("ix") },
    { set: "tech", name: "2 Imperium cards, 2 Intrigue cards, and Kota Odax of Ix", note: "Marked with the Tech Module symbol; already counted in the Bloodlines box’s card and Leader totals (Bloodlines p.2, p.6)", img: "tech-cards.webp", w: 320, h: 256 },
    { set: "tech", qty: "18", name: "Tech tiles", img: "tech-tiles.webp", w: 320, h: 163 },
    { set: "tech", name: "4 House Hagal cards and 1 Rival card", note: "Used in a solo game only; already counted in the Bloodlines solo and two-player totals (Bloodlines p.6, p.8). Don’t use the 4 Acquire Tech House Hagal cards with <i>Rise of Ix</i> (Bloodlines p.8)", img: "tech-solo.webp", w: 320, h: 232, when: (c) => c.p === 1 }
  ]
};
