/* =============================================================================
   Horus Heresy — Components glossary data (standard format v1; rendered by js/comp-widget.js)
   Sources: Rules p.3 (Components list) with the FAQ p.1 erratum (58 activation markers, not 57).
   Pictures are cropped from the rulebook's Component Descriptions (Rules p.3–9) and, for the
   figures, its Playing Piece Assembly Table (Rules p.10–11). The Space Marines and Chaos Space
   Marines pictures put the table's legion figures side by side. The game board picture uses the
   rulebook's own embedded board art (p.3) without its caption overlays and outline frames; the
   bases picture keeps the book's "Rank I–IV" labels on purpose. The Scenario Guide booklet is a
   rules booklet, so it is left out; the two reference sheets have no picture in the rulebook.
   The game has no expansions or modules, so nothing here is gated.
   ============================================================================= */
window.AID_COMPONENTS = {
  sets: [
    { id: "core", name: "Horus Heresy", src: "Rules p.3 · FAQ p.1" }
  ],
  items: [
    { set: "core", name: "Game board", note: "Main map board (Terra and the Vengeful Spirit), strategic map and record-keeping tracks",
      img: "core-board.webp", w: 320, h: 218 },
    { set: "core", qty: "3", name: "Factories", img: "core-factory.webp", w: 320, h: 142 },
    { set: "core", qty: "6", name: "Fortresses", img: "core-fortress.webp", w: 306, h: 163 },
    { set: "core", qty: "1", name: "Palace", note: "Seven areas (Rules p.4)", img: "core-palace.webp", w: 320, h: 123 },
    { set: "core", qty: "12", name: "Space Marines (gray)", note: "Pictured: Blood Angels, Imperial Fists and White Scars, each with its legion designator",
      img: "core-space-marines.webp", w: 320, h: 140 },
    { set: "core", qty: "24", name: "Imperial Armies (gray)", img: "core-imperial-army.webp", w: 184, h: 206 },
    { set: "core", qty: "12", name: "Imperial Tank Divisions (gray)", img: "core-imperial-tank.webp", w: 184, h: 191 },
    { set: "core", qty: "3", name: "Adeptus Custodes (gray)", img: "core-custodes.webp", w: 184, h: 221 },
    { set: "core", qty: "3", name: "Adeptus Arbites (gray)", img: "core-arbites.webp", w: 184, h: 221 },
    { set: "core", qty: "3", name: "Adeptus Mechanicus (gray)", img: "core-mechanicus.webp", w: 184, h: 254 },
    { set: "core", qty: "3", name: "Imperial Titans (gray)", img: "core-imperial-titan.webp", w: 252, h: 320 },
    { set: "core", qty: "16", name: "Chaos Space Marines", note: "4 red, 4 green, 4 blue, 4 purple. Pictured: World Eaters, Death Guard, Thousand Sons, Emperor’s Children",
      img: "core-chaos-space-marines.webp", w: 320, h: 109 },
    { set: "core", qty: "4", name: "Chaos Titans", note: "1 red, 1 green, 1 blue, 1 purple", img: "core-chaos-titan.webp", w: 235, h: 320 },
    { set: "core", qty: "8", name: "Chaos Thunderhawk Flights", note: "2 red, 2 green, 2 blue, 2 purple", img: "core-thunderhawk.webp", w: 211, h: 211 },
    { set: "core", qty: "8", name: "Chaos Cultists", note: "2 red, 2 green, 2 blue, 2 purple", img: "core-cultists.webp", w: 181, h: 212 },
    { set: "core", qty: "8", name: "Chaos Warbands", note: "2 red, 2 green, 2 blue, 2 purple", img: "core-warband.webp", w: 178, h: 203 },
    { set: "core", qty: "8", name: "Daemon Hordes", note: "2 red, 2 green, 2 blue, 2 purple", img: "core-daemon-horde.webp", w: 199, h: 233 },
    { set: "core", qty: "60", name: "Gray Imperial bases", note: "24 rank I, 18 rank II, 12 rank III, 6 rank IV. Pictured: the four rank shapes (the rulebook shows them in black)",
      img: "core-bases.webp", w: 320, h: 105 },
    { set: "core", qty: "64", name: "Black Traitor bases", note: "16 rank I, 20 rank II, 24 rank III, 4 rank IV. Pictured: the four rank shapes",
      img: "core-bases.webp", w: 320, h: 105 },
    { set: "core", qty: "6", name: "Defense lasers", img: "core-defense-laser.webp", w: 199, h: 239 },
    { set: "core", qty: "2", name: "Reference sheets", note: "One per player: his Heroes’ and special units’ abilities" },
    { set: "core", qty: "32", name: "Bombardment cards", note: "Pictured: back and two faces", img: "core-bombardment.webp", w: 320, h: 133 },
    { set: "core", qty: "30", name: "Event cards", note: "Pictured: back and face", img: "core-events.webp", w: 320, h: 214 },
    { set: "core", qty: "40", name: "Imperial order cards", note: "Pictured: face and back", img: "core-orders-imperial.webp", w: 298, h: 320 },
    { set: "core", qty: "40", name: "Traitor order cards", note: "Pictured: face and back", img: "core-orders-traitor.webp", w: 297, h: 320 },
    { set: "core", qty: "32", name: "Imperial combat cards", note: "Pictured: face and back", img: "core-combat-imperial.webp", w: 285, h: 320 },
    { set: "core", qty: "32", name: "Traitor combat cards", note: "Pictured: face and back", img: "core-combat-traitor.webp", w: 273, h: 320 },
    { set: "core", qty: "8", name: "Imperial Hero combat cards", note: "Pictured: face and back", img: "core-hero-combat-imperial.webp", w: 265, h: 320 },
    { set: "core", qty: "8", name: "Traitor Hero combat cards", note: "Pictured: face and back", img: "core-hero-combat-traitor.webp", w: 267, h: 320 },
    { set: "core", qty: "10", name: "Hero markers and bases", note: "Pictured: the Emperor, the Fabricator General and Horus", img: "core-hero-markers.webp", w: 320, h: 137 },
    { set: "core", qty: "10", name: "Hero damage markers", img: "core-hero-damage.webp", w: 320, h: 102 },
    { set: "core", qty: "28", name: "Legion designators", note: "One design per legion: Blood Angels, Imperial Fists, White Scars, Death Guard, Emperor’s Children, Thousand Sons, World Eaters",
      img: "core-legion-designators.webp", w: 280, h: 320 },
    { set: "core", qty: "2", name: "Initiative markers", note: "1 Imperial, 1 Traitor", img: "core-initiative.webp", w: 320, h: 197 },
    { set: "core", qty: "36", name: "Damage tokens", note: "21 1-point, 10 2-point, 5 3-point", img: "core-damage-tokens.webp", w: 320, h: 68 },
    { set: "core", qty: "58", name: "Activation markers", note: "29 Imperial, 29 Traitor. Pictured: Imperial activation side and rout side, then Traitor activation side and rout side. The FAQ corrects the rulebook’s 57 (28 Imperial).",
      img: "core-activation.webp", w: 320, h: 78, src: "Rules p.3 · FAQ p.1" },
    { set: "core", qty: "6", name: "Fortification markers", img: "core-fortification.webp", w: 320, h: 281 },
    { set: "core", qty: "12", name: "Breach markers", img: "core-breach.webp", w: 320, h: 146 },
    { set: "core", qty: "1", name: "Combat iteration token", img: "core-iteration.webp", w: 270, h: 252 },
    { set: "core", qty: "10", name: "Special tokens", note: "Their use varies by scenario", img: "core-special.webp", w: 215, h: 190 }
  ]
};
