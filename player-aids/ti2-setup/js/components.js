/* =============================================================================
   Twilight Imperium 2nd Edition — Components glossary data (standard format v1; rendered by js/comp-widget.js)
   Sources: Rules p.3 §3.0 "Game Contents and Assembly" (the list and its pictures; the rulebook prints no page
   numbers, so p.N counts from the cover) — plus two counters that §3.0 lists without a picture, pictured where the
   rules describe them: Number Counters (Rules p.6 §7.4) and the Distant Suns Domain Counters (Rules p.18 §10.2,
   shown only with the Distant Suns option). Hope's End p.1 §1.1 "Hope's End Contents" lists the expansion's
   components without pictures; its Leader and Shock Troop counters appear only with those options.
   The plastic units are pictured without a count: §3.0 gives only "18 Sprues of Plastic Playing Pieces".
   Per the standard, the rulebook itself ("One set on game rules" in §3.0) is left out.
   ============================================================================= */
window.AID_COMPONENTS = {
  sets: [
    { id: "core", name: "Twilight Imperium 2nd Edition", src: "Rules p.3 §3.0" },
    { id: "he", name: "Hope's End", src: "Hope's End p.1 §1.1", when: (c) => c.has("he") }
  ],
  items: [
    { set: "core", qty: "39", name: "Mapboard hexagonal pieces", note: "Mecatol Rex, 6 home systems (yellow borders) and 32 system tiles (Rules p.3 §4.0, §5.0)",
      img: "core-mapboard-hexes.webp", w: 320, h: 194 },
    { set: "core", qty: "78", name: "Action cards", img: "core-action-cards.webp", w: 172, h: 205 },
    { set: "core", qty: "34", name: "Political cards", img: "core-political-cards.webp", w: 163, h: 205 },
    { set: "core", qty: "1", name: "Galactic Progression Chart" },
    { set: "core", qty: "17", name: "Sheets of game counters", note: "Gold, Control Markers, Technology Chits, Number Counters, Distant Suns Counters and 6 Race charts" },
    { set: "core", name: "Race counters", note: "Each race is provided with 11 control markers (Rules p.6 §7.1)",
      img: "core-race-counters.webp", w: 227, h: 227 },
    { set: "core", name: "Number counters", note: "Triangular counters placed under a unit to show how many stand there (Rules p.6 §7.4)",
      img: "core-number-counters.webp", w: 190, h: 205, src: "Picture: Rules p.6 §7.4" },
    { set: "core", name: "Distant Suns domain counters", note: "Used only with the Distant Suns option (Rules p.18 §10.2)",
      img: "core-domain-counters.webp", w: 320, h: 166, src: "Picture: Rules p.18 §10.2", when: (c) => c.mod("ds") },
    { set: "core", qty: "6", name: "Plastic stands (for the 6 race charts)", img: "core-race-stands.webp", w: 312, h: 245 },
    { set: "core", qty: "1", name: "10-sided die" },
    { set: "core", qty: "18", name: "Sprues of plastic playing pieces", note: "Cruisers, Dreadnoughts, Carriers, Ground Forces, P.D.S. and Fighters — pictured below" },
    { set: "core", name: "Dreadnought", img: "core-dreadnought.webp", w: 208, h: 99 },
    { set: "core", name: "Carrier", img: "core-carrier.webp", w: 196, h: 104 },
    { set: "core", name: "Cruiser", img: "core-cruiser.webp", w: 111, h: 87 },
    { set: "core", name: "Fighter unit", img: "core-fighter.webp", w: 117, h: 99 },
    { set: "core", name: "Ground Force", img: "core-ground-force.webp", w: 145, h: 132 },
    { set: "core", name: "P.D.S.", img: "core-pds.webp", w: 87, h: 99 },
    { set: "core", name: "Spacedock", img: "core-spacedock.webp", w: 148, h: 111 },

    { set: "he", qty: "28", name: "Political cards", note: "You may mix these into your decks (the sheet says “feel free to”); some are Event cards (Hope's End p.3 §2.4). Cards needing an optional rule carry its keyword in the lower left-hand corner." },
    { set: "he", qty: "28", name: "Action cards", note: "You may mix these into your decks; cards needing an optional rule carry its keyword in the lower left-hand corner." },
    { set: "he", qty: "2", name: "Race stands", note: "The Mentak Coalition and the Yssaril Tribes" },
    { set: "he", qty: "22", name: "Control markers", note: "For the two new races" },
    { set: "he", qty: "58", name: "Deed cards", note: "Perforated; one for each planet in TI2 and Hope's End" },
    { set: "he", qty: "24", name: "Leader counters", note: "Three for each of the eight races (Hope's End p.2 §2.3)", when: (c) => c.mod("leaders") },
    { set: "he", qty: "8", name: "Shock Troop counters", note: "Slide over a Ground Force's flag (Hope's End p.2 §2.2)", when: (c) => c.mod("shock") },
    { set: "he", qty: "4", name: "New technologies", note: "Shown with the other 20 in the technology flow-chart (Hope's End p.4)" },
    { set: "he", qty: "13", name: "New hexes", note: "Including the 2 home systems for the Yssaril Tribes and the Mentak Coalition" }
  ]
};
