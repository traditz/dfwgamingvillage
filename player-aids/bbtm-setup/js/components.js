/* =============================================================================
   Blood Bowl: Team Manager — Components glossary data (standard v1; rendered by js/comp-widget.js)
   Sources:
     Core Box      Rulebook p.3 (Component List) · p.3–4 (Component Overview pictures) ·
                   back cover (Cheating Token Quantities)
     Sudden Death  Sudden Death p.1 (Component List, Component Overview) · p.2 (more pictures,
                   Contract Token Quantities)
     Foul Play     Foul Play p.1 (Game Components, pictured with their counts) · p.2 (cheating tokens)
   The Legendary Edition rulebook has no components list, so it has no set here. The lists'
   "This Rulebook" / "This Rulesheet" lines are left out. Pictures are cropped from the pages above.

   Context c, dispatched by app.js renderAll(): the page's ctx() (has, p, season, opt …) plus
   c.mod(id) = optional rule on: "noSalary" | "scheduling" | "enchanted" | "corruptRef" | "stadiums".
   Gating, from the rulebooks: Enchanted Balls is optional and its tokens replace the base ball
   tokens (Sudden Death p.2, p.4); the Corrupt Ref and the Stadiums are optional rules (Foul Play p.3–4).
   ============================================================================= */
window.AID_COMPONENTS = {
  sets: [
    { id: "core", name: "Core Box", src: "Rulebook p.3–4" },
    { id: "sudden", name: "Sudden Death", src: "Sudden Death p.1–2", when: (c) => c.has("sudden") },
    { id: "foul", name: "Foul Play", src: "Foul Play p.1–2", when: (c) => c.has("foul") }
  ],
  items: [
    // ---- Core Box (Rulebook p.3 list; pictures p.3–4)
    { set: "core", qty: "72", name: "Starting Player cards", note: "12 per team", img: "core-starting-players.webp", w: 320, h: 186 },
    { set: "core", qty: "25", name: "OWA Star Player cards", img: "core-star-players.webp", w: 320, h: 186 },
    { set: "core", qty: "25", name: "CWC Star Player cards", img: "core-star-players.webp", w: 320, h: 186 },
    { set: "core", qty: "32", name: "Highlight cards", img: "core-highlights.webp", w: 320, h: 247 },
    { set: "core", qty: "14", name: "Spike! Magazine cards", img: "core-spike.webp", w: 320, h: 246 },
    { set: "core", qty: "30", name: "Team Upgrade cards", note: "Five per team (Rulebook p.4)", img: "core-team-upgrades.webp", w: 270, h: 212 },
    { set: "core", qty: "28", name: "Staff Upgrade cards", note: "Unless you play the No Salary Cap variant, seven of them go back in the box (FAQ p.1)", img: "core-staff-upgrades.webp", w: 270, h: 212 },
    { set: "core", qty: "18", name: "Team tokens", note: "3 per team", img: "core-team-tokens.webp", w: 320, h: 232 },
    { set: "core", qty: "30", name: "Cheating tokens", note: "Ejection (whistle) ×6; Star Power 0 ×4, 1 ×9, 2 ×4, 3 ×2; Fan Frenzy one flag ×4, two flags ×1 (Rulebook p.13, back cover)", img: "core-cheating-tokens.webp", w: 220, h: 226 },
    { set: "core", qty: "6", name: "Ball tokens", img: "core-ball-tokens.webp", w: 159, h: 176, when: (c) => !c.mod("enchanted") },
    { set: "core", qty: "1", name: "Golden coin marker", img: "core-golden-coin.webp", w: 183, h: 207 },
    { set: "core", qty: "4", name: "Scoreboards", note: "Each with 1 faceplate, 2 dials, and 2 plastic connectors", img: "core-scoreboards.webp", w: 320, h: 210 },
    { set: "core", qty: "2", name: "Six-sided tackle dice", img: "core-tackle-dice.webp", w: 228, h: 167 },

    // ---- Sudden Death (Sudden Death p.1 list; pictures p.1–2)
    { set: "sudden", qty: "36", name: "Starting Player cards", note: "12 per DSS team", img: "sd-starting-players.webp", w: 205, h: 208 },
    { set: "sudden", qty: "25", name: "Star Player cards", note: "The DSS Star Player deck (Sudden Death p.1)", img: "sd-star-players.webp", w: 202, h: 203 },
    { set: "sudden", qty: "15", name: "Highlight cards", img: "sd-highlights.webp", w: 253, h: 210 },
    { set: "sudden", qty: "8", name: "Spike! Magazine cards", note: "Three new headlines, the Far Albion Tournament, and replacements for the base game’s tournaments, which go back in the box (Sudden Death p.1–2)", img: "sd-spike.webp", w: 261, h: 216 },
    { set: "sudden", qty: "24", name: "Team Upgrade cards", note: "Six for each DSS team, plus one more card for each base-game team (Sudden Death p.1)", img: "sd-team-upgrades.webp", w: 212, h: 184 },
    { set: "sudden", qty: "14", name: "Staff Upgrade cards", img: "sd-staff-upgrades.webp", w: 191, h: 177 },
    { set: "sudden", qty: "6", name: "Blood tokens", note: "For the Black Fangs (Sudden Death p.1–2)", img: "sd-blood-tokens.webp", w: 140, h: 108 },
    { set: "sudden", qty: "12", name: "Enchanted ball tokens", note: "Optional Enchanted Balls rule: they replace the base game’s ball tokens (Sudden Death p.2, p.4)", img: "sd-enchanted-balls.webp", w: 208, h: 176, when: (c) => c.mod("enchanted") },
    { set: "sudden", qty: "15", name: "Contract tokens", note: "Worth 2 fans ×6, 3 ×4, 4 ×3, 5 ×2 (Sudden Death p.2)", img: "sd-contract-tokens.webp", w: 206, h: 191 },
    { set: "sudden", qty: "9", name: "Team tokens", note: "3 per DSS team", img: "sd-team-tokens.webp", w: 202, h: 200 },

    // ---- Foul Play (Foul Play p.1 Game Components, in the order pictured)
    { set: "foul", qty: "10", name: "Stadium cards", note: "Optional Stadiums rule (Foul Play p.4)", img: "fp-stadiums.webp", w: 314, h: 215, when: (c) => c.mod("stadiums") },
    { set: "foul", qty: "36", name: "Starting Player cards", note: "12 for each team", img: "fp-starting-players.webp", w: 190, h: 173 },
    { set: "foul", qty: "9", name: "Team tokens", note: "3 for each team", img: "fp-team-tokens.webp", w: 227, h: 184 },
    { set: "foul", qty: "8", name: "Cheating tokens", note: "Penalty ×4; Star Power 1 ×2, 2 ×1, 3 ×1 (Foul Play p.2)", img: "fp-cheating-tokens.webp", w: 248, h: 151 },
    { set: "foul", qty: "25", name: "Star Player cards", img: "fp-star-players.webp", w: 192, h: 177 },
    { set: "foul", qty: "4", name: "Spike! Magazine cards", note: "Include the “Goblin Tribal Leeg” tournament (Foul Play p.1)", img: "fp-spike.webp", w: 252, h: 185 },
    { set: "foul", qty: "1", name: "Corrupt ref and plastic stand", note: "Optional Corrupt Ref rule (Foul Play p.3)", img: "fp-corrupt-ref.webp", w: 193, h: 201, when: (c) => c.mod("corruptRef") },
    { set: "foul", qty: "6", name: "Disease tokens", img: "fp-disease-tokens.webp", w: 233, h: 138 },
    { set: "foul", qty: "14", name: "Staff Upgrade cards", img: "fp-staff-upgrades.webp", w: 215, h: 158 },
    { set: "foul", qty: "24", name: "Team Upgrade cards", note: "Include one card for each base-game team, left out when Sudden Death is also in play (Foul Play p.1)", img: "fp-team-upgrades.webp", w: 212, h: 157 },
    { set: "foul", qty: "20", name: "Penalty cards", img: "fp-penalty-cards.webp", w: 220, h: 165 },
    { set: "foul", qty: "1", name: "Scoreboard", note: "For a fifth manager (Foul Play p.2)", img: "fp-scoreboard.webp", w: 261, h: 156 }
  ]
};
