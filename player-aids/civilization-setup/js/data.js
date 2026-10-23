/* =============================================================================
   Sid Meier's Civilization: The Board Game — Setup & Reference Utility · data
   Namespace CV. All content is sourced from the four documents in the game
   folder, cited by PRINTED page number:
     Core  = civilization-rules.pdf (32 pp.; printed page = PDF page; p.1 cover, pp.29–31 credits/ads)
     F&F   = civ-fame-and-fortune-rules.pdf (printed pp.2–16 = PDF pp.1–15)
     W&W   = Wisdom and Warfare rulebook (printed pp.2–12 = PDF pp.2–12; p.1 cover)
     FAQ   = Civilization FAQ_v2.0.pdf (version 2.0, updated 6/17/13; printed pp.1–6)
   Precedence: FAQ v2.0 > the expansion rulebooks (for their own content and the
   core rules they change) > the core rulebook. FAQ errata are applied throughout.

   BUILD STAGES: stage "core" built the core game; stage "expansions" added Fame and
   Fortune (c.has("ff"), modules gp / invest / advarabia / advgreece, 5 players) and
   Wisdom and Warfare (c.has("ww")) at the hooks the core stage left. Expansion
   rule changes are gated exactly: F&F p.7–8 and W&W p.6–7 say their rules apply
   whenever the expansion is used; the great person and investment rules only when
   those decks are chosen (F&F p.7). Stage "finish" added the rulebook icons (CV.ic,
   images/icons), js/components.js (Components glossary) and js/rules.js (search index).
   ============================================================================= */
var CV = {};

CV.expMeta = {
  core: { name: "Core Game",          cls: "tag-core" },
  ff:   { name: "Fame and Fortune",   cls: "tag-ff" },
  ww:   { name: "Wisdom and Warfare", cls: "tag-ww" },
  faq:  { name: "FAQ v2.0",           cls: "tag-faq" },
  var:  { name: "Variant",            cls: "tag-var" }
};

CV.expansions = [
  { id: "core", short: "Civilization", year: "Core game · 2010",
    blurb: "The core game: six civilizations, 2–4 players, the market board, 14 neutral map tiles. Always in play." },
  { id: "ff", short: "Fame and Fortune", year: "Expansion · 2011",
    blurb: "Four new civilizations (Arabs, Greeks, Indians, Spanish), metropolises, the great person and investment decks, relics, new wonders, techs and huts/villages, and the components for a fifth player." },
  { id: "ww", short: "Wisdom and Warfare", year: "Expansion · 2013",
    blurb: "Six new civilizations (Aztecs, English, French, Japanese, Mongols, Zulu), social policies, a replacement set of unit cards and government cards, building programs, city-states, Shipyards and relics." }
];

/* Civilizations. Core entries hold what the sources print: the setup bonus (Core p.11),
   the starting government (Core p.11–12), anything printed on the sample Russian sheet
   (Core p.7) and the FAQ rulings about each civilization's abilities (FAQ p.2–3, p.6).
   The rulebooks do not reprint the other civilizations' sheets, so their special
   abilities and starting techs are read from the sheet itself. */
CV.civs = [
  { id: "america", set: "core", name: "America", people: "the Americans",
    bonus: (c) => "Gains a random <b>great person</b>. Place it in the outskirts of your capital <b>at the end of setup</b>" +
      (c.mod("learn") ? " (first game: the rulebook recommends the grassland square next to your capital)" : " (for a first game, the rulebook recommends the grassland square next to the capital)") + "." +
      (c.mod("gp") ? " <b>Great person deck:</b> America draws a great person card at the start of the game, just as though it had gained a great person during the game, and takes the marker matching the card (F&F p.6, p.11)." : ""),
    gov: "Despotism",
    tech: null,
    abil: [
      "<b>FAQ:</b> America cannot split the 2 production gained when spending 3 trade between two city actions."
    ],
    src: "Core p.11 · FAQ p.2" },
  { id: "china", set: "core", name: "China", people: "the Chinese",
    bonus: () => "Starts with <b>City Walls in its capital</b>: place the capital marker <b>walled side up</b> instead of unwalled.",
    gov: "Despotism",
    tech: null,
    abil: [
      "<b>FAQ:</b> when the Chinese win a battle in which they have at least two army figures present, the winner’s loss of figures for killed units happens <b>first</b>; only then may the Chinese use their ability to save a killed unit."
    ],
    src: "Core p.11 · FAQ p.2" },
  { id: "egypt", set: "core", name: "Egypt", people: "the Egyptians",
    bonus: (c) => ((c.has("ff") || c.has("ww")) ? "Receives a <b>random ancient wonder</b>: the <b>top card of the wonder deck</b> once the deck is built (General Setup 3D), before the top four cards are turned face up for the market." : "Receives a <b>random ancient wonder</b>, taken from the market during the wonder deck step (General Setup 3D).") + " Its marker must go in the outskirts of your capital" +
      " (for a first game, the rulebook recommends the grassland square by the capital).",
    gov: "Despotism",
    tech: null,
    abil: [
      "<b>FAQ:</b> Egypt’s ability to build unlocked buildings for free as an action <b>cannot be combined</b> with Engineering’s ability to split production in a single city management action.",
      "<b>FAQ:</b> Egypt <b>can</b> use its special ability to build a wall — walls are considered buildings."
    ],
    adv: { mod: "advegypt", text: "<b>Advanced Egypt</b> (variant selected): the Egyptians’ wonders <b>cannot be obsoleted</b>.", src: "FAQ p.6" },
    src: "Core p.8, p.11 · FAQ p.2" },
  { id: "germany", set: "core", name: "Germany", people: "the Germans",
    bonus: () => "Starts with <b>two extra infantry units</b> from the market board, added to your standing forces (5 units in all).",
    gov: "Despotism",
    tech: null,
    abil: [
      "<b>FAQ:</b> if the Germans research a tech that unlocks a level 3 or 4 unit and later research a tech that unlocks the level 2 unit of the same type, they <b>still get</b> the free unit and resource.",
      "<b>FAQ:</b> the German special ability <b>also applies</b> when the Germans acquire the tech by means other than research."
    ],
    src: "Core p.11 · FAQ p.2" },
  { id: "rome", set: "core", name: "Rome", people: "the Romans",
    bonus: () => "Begins the game governed by <b>Republic</b> instead of Despotism (Player Setup 5).",
    gov: "Republic",
    tech: null,
    abil: [],
    src: "Core p.11–12" },
  { id: "russia", set: "core", name: "Russia", people: "the Russians",
    bonus: () => "Takes the <b>white Russian army figure</b> and adds it to their figures; places it on the map with the other starting figures (Player Setup 3). Begins governed by <b>Communism</b> instead of Despotism (Player Setup 5).",
    gov: "Communism",
    tech: "Communism (level III), as printed on the sample Russian sheet",
    abil: [
      "<b>Sheet (sample shown in Core p.7, small print):</b> the Russians start with 2 armies, and their stacking limit is increased by 1. Once per turn, the Russians may move an army or scout into an enemy city and sacrifice that figure to research a tech known by that civilization for free. Armies sacrificed this way cannot also attack.",
      "<b>FAQ:</b> the Russian player <b>can rebuild</b> the white army figure if it is destroyed.",
      "<b>FAQ:</b> a government unlocked by a tech gained with the Russians’ ability during the Movement Phase may be adopted at the next Start of Turn <b>without Anarchy</b>."
    ],
    src: "Core p.7, p.11–12 · FAQ p.2–3" },
  /* Fame and Fortune civilizations — setup bonuses F&F p.6; ability rulings F&F p.9, p.12–13 and FAQ p.2–3, p.5–6.
     Starting governments other than Despotism are only those F&F p.6 / W&W p.5 list (Greece, Japan).
     A starting tech is given only where the bonus text names it ("due to their Mathematics technology"). */
  { id: "arabia", set: "ff", name: "Arabia", people: "the Arabs",
    bonus: (c) => "Gains one of each type of market resource token: <b>1 incense, 1 iron, 1 silk and 1 wheat</b>. Due to their <b>Mathematics</b> tech, Arabia’s <b>artillery</b> military marker starts the game at <b>rank 2</b>." +
      (c.mod("invest") ? "" : " <b>The Arabs need the investment deck</b> — one of their abilities depends on it, so it must be used whenever they play (F&F p.13)."),
    gov: "Despotism",
    tech: "Mathematics — named in Arabia’s setup bonus (F&F p.6)",
    abil: [
      "<b>Investments required:</b> when playing with the Arabs, the investment deck must be used, as one of their civilization abilities depends upon it (F&F p.13).",
      "<b>FAQ:</b> culture event cards such as “A Gift From Afar” <b>count as spending a resource</b> for the Arabs’ special ability.",
      "<b>FAQ:</b> if the Arabs invest two coins for free from the <b>Seven Cities of Gold</b> relic, they <b>also advance two spaces</b> on the culture track due to their special ability."
    ],
    adv: { mod: "advarabia", text: "<b>Advanced Arabia</b> (variant selected): the Arabs gain only <b>1 culture per resource token spent</b>, instead of 2.", src: "FAQ p.6" },
    src: "F&F p.6, p.13 · FAQ p.3, p.5" },
  { id: "greece", set: "ff", name: "Greece", people: "the Greeks",
    bonus: () => "Begins the game governed by <b>Democracy</b> instead of Despotism. Due to <b>Democracy</b>, Greece’s <b>infantry</b> military marker starts the game at <b>rank 2</b>.",
    gov: "Democracy",
    tech: "Democracy — named in Greece’s setup bonus (F&F p.6)",
    abil: [
      "<b>School of Confucius relic:</b> F&F’s note has the Greeks draw two great people and keep one, then draw two more and keep one. <b>FAQ errata:</b> the relic gives one great person, not two — so the Greeks draw two and keep one, once.",
    ],
    gpAbil: "<b>Great person deck:</b> when the Greeks draw a great person, they draw until they have <b>two valid great person cards</b> to choose between (F&F p.12).",
    adv: { mod: "advgreece", text: "<b>Advanced Greece</b> (variant selected): instead of allowing them to retain trade, the Greeks’ first special ability reads: “After the Greeks research or learn a tech, gain 1 culture for each player who does not currently know or is researching that tech.” Best used in a two-player game (FAQ).", src: "FAQ p.6" },
    src: "F&F p.6, p.9 · FAQ p.5" },
  { id: "india", set: "ff", name: "India", people: "the Indians",
    bonus: () => "Starts the game with a <b>metropolis</b> instead of a normal capital. The metropolis must occupy <b>two of the four center squares</b> of India’s home map tile and <b>cannot be placed diagonally</b> (see Metropolises).",
    gov: "Despotism",
    tech: null,
    abil: [
      "<b>FAQ:</b> culture event cards such as “A Gift From Afar” <b>count as spending a resource</b> for the Indians’ special ability.",
      "<b>FAQ:</b> when the Indians devote a city to the arts, they <b>count any resources a scout is sending</b> to that city and gain extra culture for them."
    ],
    src: "F&F p.6, p.10 · FAQ p.3, p.5" },
  { id: "spain", set: "ff", name: "Spain", people: "the Spanish",
    bonus: () => "Takes the <b>white Spanish scout</b> figure and adds it to their figures; places it on the map with the other starting figures (Player Setup 3). Like Russia’s white army, it raises how many figures Spain can have on the map — but Spain’s <b>stacking limit still starts at 2</b>, so it may not put all three starting figures in one square.",
    gov: "Despotism",
    tech: null,
    abil: [
      "<b>FAQ:</b> the Spanish player <b>can rebuild</b> the white scout figure if it is destroyed."
    ],
    src: "F&F p.3, p.6 · FAQ p.2" },
  /* Wisdom and Warfare civilizations — setup bonuses W&W p.5; social policy maximum W&W p.10; Zulu and city-states W&W p.10 */
  { id: "aztecs", set: "ww", name: "The Aztecs", people: "the Aztecs",
    bonus: () => "No special setup bonus other than their starting tech. Their home tile has only <b>three</b> starting options for the capital, because one of its four center squares is a <b>water</b> square.",
    gov: "Despotism",
    tech: null,
    abil: [],
    src: "W&W p.5" },
  { id: "english", set: "ww", name: "The English", people: "the English",
    bonus: () => "No special setup bonus other than their starting tech.",
    gov: "Despotism",
    tech: null,
    abil: [],
    src: "W&W p.5" },
  { id: "french", set: "ww", name: "The French", people: "the French",
    bonus: () => "Begin the game with an <b>additional social policy</b>: their social policy maximum is <b>increased by one</b> (2 at the start, with one city).",
    gov: "Despotism",
    tech: null,
    abil: [],
    src: "W&W p.5, p.10" },
  { id: "japanese", set: "ww", name: "The Japanese", people: "the Japanese",
    bonus: () => "Begin the game governed by <b>Feudalism</b> instead of Despotism. Due to <b>Chivalry</b>, Japan’s <b>mounted</b> military marker starts the game at <b>rank 2</b>.",
    gov: "Feudalism",
    tech: "Chivalry — named in Japan’s setup bonus (W&W p.5)",
    abil: [],
    src: "W&W p.5" },
  { id: "mongols", set: "ww", name: "The Mongols", people: "the Mongols",
    bonus: () => "Start with <b>two extra mounted units</b> from the market board, added to their standing forces. Due to <b>Horseback Riding</b>, the Mongols’ <b>travel speed starts at 3</b>.",
    gov: "Despotism",
    tech: "Horseback Riding — named in the Mongols’ setup bonus (W&W p.5)",
    abil: [],
    src: "W&W p.5" },
  { id: "zulu", set: "ww", name: "The Zulu", people: "the Zulu",
    bonus: () => "Start with <b>two extra artillery units</b> from the market board, added to their standing forces.",
    gov: "Despotism",
    tech: null,
    abil: [
      "<b>City-states:</b> if the Zulu explore a city-state by building a city, the city-state is immediately destroyed and the Zulu receive <b>3 culture</b> (W&W p.10)."
    ],
    src: "W&W p.5, p.10" }
];

/* Variants and modules. `requires` = the set that must be owned. `civ` = only offered while
   that civilization can be in play. Compatibility rules are only those the books state:
   - Learning game: Egypt, Rome and the wonders go back in the box (Core p.8).
   - Arabs in play → the investment deck must be used (F&F p.13).
   - 5 players needs the fifth-player components in Fame and Fortune (F&F p.2, p.4–5). */
CV.modules = [
  { id: "learn", requires: "core", name: "Learning game", set: "Core p.8",
    summary: "Recommended first game: no Egypt, Rome or wonders; stop when someone builds a third city — no winner.",
    description: "Return Egypt, Rome and the wonders (cards and markers) to the box and ignore the wonder rules. Play until a player builds their third city; there are no winners or losers.", src: "Core p.8" },
  { id: "advsetup", requires: "core", name: "Advanced Setup", set: "FAQ p.6",
    summary: "Each player draws two civilizations and keeps one, choosing in turn order.",
    description: "Each player draws two civilization sheets at random instead of one, then selects which to play in turn order when the first player is selected (General Setup 9). Needs two undrawn civilization sheets for each player drawing.", src: "FAQ p.6, Core p.3" },
  { id: "advtie", requires: "core", name: "Advanced Tiebreaker", set: "FAQ p.6",
    summary: "A non-military victory finishes the turn; then the best Victory Score among the winners wins.",
    description: "Military victory still ends the game at once. A culture, economic or tech victory lets the rest of the turn play out, then every player who completed a non-military victory compares Victory Score.", src: "FAQ p.6" },
  { id: "advegypt", requires: "core", civ: "egypt", name: "Advanced Egypt", set: "FAQ p.6",
    summary: "The Egyptians’ wonders cannot be obsoleted.",
    description: "Advanced civilization variant for experienced players: Egypt is no longer countered by Monarchy.", src: "FAQ p.6" },
  /* Fame and Fortune modules: the two advanced civilizations (FAQ p.6) and the optional great person and
     investment decks (F&F p.5 steps 7–8, p.11, p.13). Wisdom and Warfare has no optional modules: all of
     its rules apply whenever it is used (W&W p.6–7). */
  { id: "advarabia", requires: "ff", civ: "arabia", name: "Advanced Arabia", set: "FAQ p.6",
    summary: "The Arabs gain 1 culture per resource token spent, instead of 2.",
    description: "Advanced civilization variant: it becomes harder for Arabia to win a culture victory.", src: "FAQ p.6" },
  { id: "advgreece", requires: "ff", civ: "greece", name: "Advanced Greece", set: "FAQ p.6",
    summary: "The Greeks’ first ability gains 1 culture per player who does not currently know or is researching the tech, instead of retaining trade.",
    description: "Advanced civilization variant: Greece scales with the number of players; best used in a two-player game.", src: "FAQ p.6" },
  { id: "gp", requires: "ff", name: "Great person deck", set: "F&F p.11",
    summary: "Recruit specific great people from history; each great person marker comes with a card.",
    description: "All players agree at the start whether to use it; otherwise return the deck to the box.", src: "F&F p.5, p.11" },
  { id: "invest", requires: "ff", name: "Investment deck", set: "F&F p.13",
    summary: "Invest one coin token per turn in investment cards for lasting abilities. Required if the Arabs play.",
    description: "All players agree at the start whether to use it; it must be used when the Arabs are in play.", src: "F&F p.5, p.13" }
];

/* =============================================================================
   CONFIGURATION STATE — shared by app.js and the Node harness
   state = { exps:Set, players:n, civs:Set (chosen civilizations), mods:Set }
   ============================================================================= */
CV.defaultState = () => ({ exps: new Set(["core"]), players: 4, civs: new Set(), mods: new Set() });

CV.civById = (id) => CV.civs.find(v => v.id === id);
CV.modById = (id) => CV.modules.find(m => m.id === id);

CV.playerRange = (st) => [2, st.exps.has("ff") ? 5 : 4];

/* a civilization is "available" when its set is owned and the learning game hasn't boxed it */
CV.civAvailable = (st, id) => {
  const v = CV.civById(id);
  if (!v || !st.exps.has(v.set)) return false;
  if (st.mods.has("learn") && (id === "egypt" || id === "rome")) return false;   // Core p.8
  return true;
};
/* a civilization "may be in play" when chosen, or when a seat is still drawn at random from it */
CV.civMay = (st, id) => st.civs.has(id) || (CV.civAvailable(st, id) && st.civs.size < st.players);

CV.modAvailable = (st, m) => {
  if (!st.exps.has(m.requires)) return false;
  if (m.civ && !CV.civMay(st, m.civ)) return false;
  // Advanced Setup needs two undrawn sheets per drawing player (FAQ p.6; Core p.3: 6 core sheets; Core p.8: learning game boxes Egypt and Rome)
  if (m.id === "advsetup") {
    const chosen = CV.civs.filter(v => st.civs.has(v.id)).length;
    const open = st.players - chosen;
    const pool = CV.civs.filter(v => !st.civs.has(v.id) && CV.civAvailable(st, v.id)).length;
    if (open > 0 && pool < 2 * open) return false;
  }
  return true;
};

CV.normalize = (st) => {
  st.exps.add("core");
  const [lo, hi] = CV.playerRange(st);
  if (st.players < lo) st.players = lo;
  if (st.players > hi) st.players = hi;
  // chosen civilizations must be available; never more than one per player
  for (const id of [...st.civs]) if (!CV.civAvailable(st, id)) st.civs.delete(id);
  while (st.civs.size > st.players) st.civs.delete([...st.civs].pop());
  // modules need their set (and, for advanced civilizations, a chance of that civilization)
  for (const m of CV.modules) if (st.mods.has(m.id) && !CV.modAvailable(st, m)) st.mods.delete(m.id);
  // the Arabs need the investment deck (F&F p.13)
  if (st.civs.has("arabia")) st.mods.add("invest");
  return st;
};

CV.ctx = (st) => {
  const chosen = CV.civs.filter(v => st.civs.has(v.id)).map(v => v.id);
  const open = st.players - chosen.length;
  const pool = open > 0 ? CV.civs.filter(v => !st.civs.has(v.id) && CV.civAvailable(st, v.id)).map(v => v.id) : [];
  return {
    has: (id) => st.exps.has(id),
    p: st.players,
    mod: (id) => st.mods.has(id),
    civ: (id) => st.civs.has(id),          // chosen in the configurator
    may: (id) => st.civs.has(id) || pool.includes(id),   // chosen, or could be drawn for an open seat
    civs: chosen,
    open: open,
    pool: pool
  };
};

/* small helpers for text */
CV.civName = (c, id) => "<b>" + CV.civById(id).name + "</b>" + (c.civ(id) ? "" : " <i>(if in play)</i>");
CV.anyMay = (c, ids) => ids.some(id => c.may(id));
CV.joinSrc = (arr) => arr.filter(Boolean).join(" · ");

/* Rulebook icons (icons standard v1; css/icons.css). Every call names its file literally, e.g. CV.ic.inl("trade", "Trade").
   Icons are cropped from Core p.4–7, p.18, p.20, p.32; F&F p.4, p.8, p.16; W&W p.3, p.9, p.12. */
CV.ic = {
  img: (f, alt, cls) => "<img class=\"aid-ic" + (cls ? " " + cls : "") + "\" src=\"images/icons/" + f + ".webp\" alt=\"" + alt + "\" title=\"" + alt + "\">",
  inl: (f, alt) => CV.ic.img(f, alt, "aid-ic-inline"),
  /* an inline icon kept on one line with the word(s) it labels */
  w: (f, alt, words) => "<span class=\"ic-nb\">" + CV.ic.inl(f, alt) + (words ? " " + words : "") + "</span>",
  pair: (f, name) => "<span class=\"aid-pair\">" + CV.ic.img(f, name) + "<span>" + name + "</span></span>",
  li: (f, name, text) => "<li>" + CV.ic.img(f, name) + "<span><b>" + name + "</b> — " + text + "</span></li>"
};

/* map layouts (Core p.9, "Map Setup by Number of Players"). Grid in half-tile columns.
   h = home tile (face up) with the diagram's arrow; n = neutral tile dealt face down. */
CV.mapLayouts = {
  2: { cols: 4, tiles: [
        [1, 1, "n"], [1, 3, "h", "↓"],
        [2, 1, "n"], [2, 3, "n"],
        [3, 1, "n"], [3, 3, "n"],
        [4, 1, "h", "↑"], [4, 3, "n"] ],
       text: "2 tiles wide × 4 tiles tall (8 tiles). Home tiles: <b>top-right</b> (arrow pointing down from the top edge) and <b>bottom-left</b> (arrow pointing up from the bottom edge). The other <b>6</b> tiles are neutral, face down.",
       home: 2, neutral: 6 },
  3: { cols: 8, tiles: [
        [1, 4, "h", "↓"],
        [2, 3, "n"], [2, 5, "n"],
        [3, 2, "n"], [3, 4, "n"], [3, 6, "n"],
        [4, 1, "h", "→"], [4, 3, "n"], [4, 5, "n"], [4, 7, "h", "←"] ],
       text: "A stepped pyramid of 1, 2, 3 and 4 tiles from top to bottom (10 tiles). One home tile alone at the <b>top</b> (arrow pointing down); the other two at the <b>ends of the bottom row</b> (arrows pointing in from the left and right edges). The other <b>7</b> tiles are neutral, face down.",
       home: 3, neutral: 7 },
  4: { cols: 8, tiles: [
        [1, 1, "h", "↓"], [1, 3, "n"], [1, 5, "n"], [1, 7, "h", "↓"],
        [2, 1, "n"], [2, 3, "n"], [2, 5, "n"], [2, 7, "n"],
        [3, 1, "n"], [3, 3, "n"], [3, 5, "n"], [3, 7, "n"],
        [4, 1, "h", "↑"], [4, 3, "n"], [4, 5, "n"], [4, 7, "h", "↑"] ],
       text: "A 4 × 4 square (16 tiles). A home tile in <b>each corner</b> (top corners: arrow pointing down from the top edge; bottom corners: arrow pointing up from the bottom edge). The other <b>12</b> tiles are neutral, face down.",
       home: 4, neutral: 12 },
  /* Five players (F&F p.6, "Five-Player Map Setup"). Tile positions measured from the diagram's
     placed images; rows AND columns are in half-tile units here (half: true) because the rows
     are staggered by half a tile. hole = [row, col, rowSpan, colSpan]. */
  5: { cols: 14, rows: 9, half: true, tiles: [
        [1, 7, "n"],
        [2, 5, "n"], [2, 9, "n"],
        [3, 7, "h", "↓"],
        [4, 1, "h", "→"], [4, 3, "n"], [4, 5, "n"], [4, 9, "n"], [4, 11, "n"], [4, 13, "h", "←"],
        [6, 1, "n"], [6, 3, "n"], [6, 5, "n"], [6, 9, "n"], [6, 11, "n"], [6, 13, "n"],
        [8, 2, "n"], [8, 4, "h", "↑"], [8, 6, "n"], [8, 8, "n"], [8, 10, "h", "↑"], [8, 12, "n"] ],
       hole: [5, 7, 3, 2],
       text: "22 tiles around a <b>hole in the center</b>; some rows are offset by half a tile, as the diagram shows. From the top:<ul>" +
         "<li>a single neutral tile at the top center, with two neutral tiles half a tile lower on either side of it;</li>" +
         "<li>a <b>home tile</b> in the center column below the top tile (arrow pointing down), directly above the hole;</li>" +
         "<li>a row of six tiles with the hole in the middle: a <b>home tile at each end</b> (arrows pointing in from the left and right edges) and two neutral tiles on each side;</li>" +
         "<li>a row of six neutral tiles, the hole still in the middle;</li>" +
         "<li>a bottom row of six tiles, shifted half a tile: neutral, <b>home</b> (arrow pointing up), neutral, neutral, <b>home</b> (arrow pointing up), neutral.</li></ul>" +
         "That is <b>5</b> home tiles and <b>17</b> neutral tiles, face down.",
       home: 5, neutral: 17 }
};
CV.mapHtml = (p) => {
  const L = CV.mapLayouts[p];
  if (!L) return "";
  const dir = { "↓": "arrow pointing down", "↑": "arrow pointing up", "→": "arrow pointing right", "←": "arrow pointing left" };
  const rowPos = (r) => L.half ? r + " / span 2" : String(r);
  const cells = L.tiles.map(t => "<span class=\"t " + t[2] + "\" style=\"grid-row:" + rowPos(t[0]) + ";grid-column:" + t[1] + " / span 2\"" +
    (t[2] === "h" ? " title=\"Home tile, face up — " + dir[t[3]] + "\">H" + t[3] : " title=\"Neutral tile, face down\">N") + "</span>").join("") +
    (L.hole ? "<span class=\"t hole\" style=\"grid-row:" + L.hole[0] + " / span " + L.hole[2] + ";grid-column:" + L.hole[1] + " / span " + L.hole[3] + "\" title=\"The hole in the center of the map — cannot be moved through\"></span>" : "");
  const tpl = L.half ? "grid-template-columns:repeat(" + L.cols + ",15px);grid-template-rows:repeat(" + L.rows + ",15px)" : "grid-template-columns:repeat(" + L.cols + ",20px)";
  return "<div class=\"map-wrap\"><div class=\"map-grid" + (L.half ? " half" : "") + "\" role=\"img\" aria-label=\"" + p + "-player map layout: " + L.home + " home tiles and " + L.neutral + " neutral tiles" + (L.hole ? " around a hole in the center" : "") + "\" style=\"" + tpl + "\">" + cells + "</div>" +
    "<ul class=\"map-legend\"><li><b>H</b> = a player’s home tile, face up; the arrow shows its orientation in the diagram.</li><li><b>N</b> = a neutral tile, dealt face down.</li>" +
    (L.hole ? "<li>Dashed outline = the <b>hole</b> in the center: nothing can move through it.</li>" : "") + "</ul></div>";
};

/* =============================================================================
   SETUP PHASES — c = CV.ctx(state): { has(set), p, mod(id), civ(id), may(id), civs, open, pool }
   ============================================================================= */
CV.phases = [
  {
    title: "Before You Begin",
    steps: [
      { when: () => true, exp: "core",
        t: "First time out of the box",
        d: "<ul><li>Carefully punch out the cardboard components.</li>" +
          "<li>Assemble each <b>civilization sheet</b> with its <b>trade dial</b> (large outer dial), <b>economy dial</b> (small inner dial) and a <b>plastic connector</b>.</li>" +
          "<li><b>The Golden Rule:</b> when an ability or card conflicts with the rules, the ability or card takes priority.</li></ul>",
        src: "Core p.7–8" },
      { when: (c) => c.mod("learn"), exp: "var",
        t: "Learning game (recommended for a first game)",
        d: "<ul><li>Return <b>Egypt</b>, <b>Rome</b> and the <b>wonders</b> (both cards and markers) to the box, and ignore the rules for wonders this game.</li>" +
          "<li>Otherwise play as normal <b>until a player builds their third city</b>. At that point the game ends — there are <b>no winners or losers</b>; the point is to learn the game.</li>" +
          "<li>If time allows and the players wish, start a new game afterwards with Egypt, Rome and the wonders added back in.</li></ul>",
        src: "Core p.8" },
      { when: (c) => c.has("ff"), exp: "ff",
        t: "Incorporate Fame and Fortune",
        d: (c) => "<p>Before setting up the core game (Expansion Setup, steps 1–8):</p><ol>" +
          "<li><b>New civilizations:</b> assemble the four new civilization sheets (Arabia, Greece, India, Spain) with their trade dials, economy dials and plastic connectors, and add them to the core sheets. Add the four new <b>culture level markers</b> to the core ones.</li>" +
          "<li><b>New tech cards, military reference cards and metropolis markers:</b> add the <b>four new tech cards</b> to each player’s tech deck; add the <b>metropolis marker</b> to each player’s city markers; place a <b>military reference card</b> with each player’s setup card.</li>" +
          "<li><b>New map tiles, huts, villages and relics:</b> add the 4 new home map tiles to the core ones and shuffle the 7 new neutral tiles in with the other neutral tiles. Add the new hut (10) and village (5) markers to the core markers. The 3 <b>relic markers</b> may be stored with the hut and village markers — all are used when exploring.</li>" +
          "<li><b>New wonders and culture events:</b> " + (c.mod("learn") ? "shuffle the 10 new culture event cards into the culture event deck. The 9 new wonder cards and their markers go back in the box with the core wonders, because the learning game doesn’t use wonders (Core p.8)." : "shuffle the 9 new wonder cards and 10 new culture event cards into their decks; the new wonder markers join the core ones. The wonder deck must now be <b>built before each game</b> (General Setup 3D).") + "</li>" +
          "<li><b>Replacement cards:</b> remove the old <b>“Flight”</b> and <b>“Angkor Wat”</b> cards and replace them with the new cards from this expansion.</li>" +
          "<li><b>Fifth player components:</b> separate out the fifth player’s plastic figures, cards and markers" + (c.p === 5 ? " — you are playing with five, so use them (five-player map, F&F p.6)" : " (used only in a five-player game)") + ".</li>" +
          "<li><b>Great person deck:</b> " + (c.mod("gp") ? "you are using it — see General Setup 6 and the Great Person Deck reference (F&F p.11)." : "not used this game — return the great person deck to the box.") + "</li>" +
          "<li><b>Investments:</b> " + (c.mod("invest") ? "you are using them — see General Setup 2 and the Investment Deck reference (F&F p.13)." : "not used this game — return the investment cards and markers to the box" + (c.may("arabia") ? " (but if the Arabs play, the investment deck must be used — F&F p.13)" : "") + ".") + "</li></ol>" +
          "<ul><li>Also add the 23 <b>five-point culture tokens</b> to the culture token pool and keep the 8 new <b>disaster markers</b> (forest on one side, water on the other — for the “Flood” culture event and the Ecology tech) with the core disaster markers.</li>" +
          "<li>All Fame and Fortune rules supersede the core rules whenever you play with this expansion; if you don’t use the great person or investment decks, disregard their rules.</li></ul>",
        src: (c) => CV.joinSrc(["F&F p.2–5, p.7–8", c.mod("learn") && "Core p.8", c.mod("gp") && "F&F p.11", (c.mod("invest") || c.may("arabia")) && "F&F p.13"]) },
      { when: (c) => c.has("ww"), exp: "ww",
        t: "Incorporate Wisdom and Warfare",
        d: (c) => "<p>Before playing (Incorporating This Expansion, steps 1–8):</p><ol>" +
          "<li><b>Assemble civilizations:</b> assemble the six new civilization sheets (the Aztecs, English, French, Japanese, Mongols and Zulu) as in the core rulebook and add them to the other sheets (each civilization has its own culture level marker — W&W p.2).</li>" +
          "<li><b>Add and remove tech cards:</b> add the new tech cards to each player’s tech deck and <b>remove the old “Metal Casting” and “Railroad”</b> techs. The book calls these “the six new tech cards”: 4 new techs plus a replacement Metal Casting and a replacement Railroad per player." + (c.has("ff") ? "" : " <b>Without Fame and Fortune, ignore the purple tech cards.</b>") + "</li>" +
          "<li><b>Wonders and culture events:</b> " + (c.mod("learn") ? "shuffle the 12 new culture event cards into their decks. The 6 new wonder cards and their markers stay in the box with the other wonders, because the learning game doesn’t use wonders (Core p.8)." : "shuffle the 6 new wonders and 12 new culture events into the appropriate decks; the 6 new wonder markers join the others.") + "</li>" +
          "<li><b>Map tiles, huts, villages and relics:</b> add the 6 new home map tiles to the other home tiles; shuffle the 6 new neutral tiles in with the other neutral tiles; add the 5 hut and 5 village markers to the others. The 2 <b>relic markers</b> may be stored with the hut and village markers.</li>" +
          "<li><b>Separate the 5 city-state markers</b> from the rest of the markers.</li>" +
          "<li><b>Shipyards and market overlay:</b> add the 5 Shipyard markers and the market board overlay to the rest of the buildings.</li>" +
          "<li><b>Replace unit and government cards:</b> " + (c.has("ff") ? "remove the core unit cards and <b>all</b> government cards (the core game’s and Fame and Fortune’s fifth-player set) and use the new ones (the new set also replaces the combat bonus cards — W&W p.2–3)." : "remove the core unit and government cards and use the new ones (the new set also replaces the combat bonus cards — W&W p.3).") + " The new units are still separated by type in General Setup and are <b>not compatible</b> with the original units.</li>" +
          "<li><b>Replace Fame and Fortune cards:</b> " + (c.has("ff") ? "remove the old <b>“Leonidas”</b> card from the great person deck and the <b>“Endowment for the Arts”</b> card from each investment deck, and replace them with the new cards from this expansion." : "you don’t own Fame and Fortune, so ignore the replacement “Leonidas” and “Endowment for the Arts” cards.") + "</li></ol>" +
          "<ul><li>Replacement small cards for the core game and Fame and Fortune are marked with an <b>R</b>.</li>" +
          "<li>All Wisdom and Warfare rules supersede the core rules and must be used whenever you play with this expansion.</li></ul>",
        src: (c) => CV.joinSrc(["W&W p.2–4, p.7, p.12", c.mod("learn") && "Core p.8"]) }
    ]
  },
  {
    title: "General Setup",
    steps: [
      { when: () => true, exp: (c) => c.mod("advsetup") ? "var" : "core",
        rb: "General Setup 1",
        t: "Choose civilizations and colors",
        d: (c) => {
          let d = "<ul>";
          if (c.mod("advsetup")) d += "<li><b>Advanced Setup:</b> each player draws <b>two</b> civilization sheets at random instead of one. Each player selects which of their two civilizations to play <b>in turn order once the first player is selected</b> (General Setup 9).</li>";
          else d += "<li>Each player draws a <b>civilization sheet at random</b> and places it face up in front of them. Optionally, players may <b>select</b> their civilizations instead, if all players agree.</li>";
          if (c.mod("learn")) d += "<li><b>Learning game:</b> Egypt and Rome are already back in the box.</li>";
          if (c.civs.length) {
            d += "<li><b>Already agreed:</b> " + c.civs.map(id => CV.civById(id).name).join(", ") +
              (c.open > 0 ? "; the other " + (c.open === 1 ? "player draws" : c.open + " players draw") + (c.mod("advsetup") ? " as above" : " at random") + " from the remaining sheets" : "") + ".</li>";
          }
          const pool = [c.has("ff") && "Fame and Fortune’s four (Arabia, Greece, India, Spain)", c.has("ww") && "Wisdom and Warfare’s six (the Aztecs, English, French, Japanese, Mongols, Zulu)"].filter(Boolean);
          if (pool.length) d += "<li>The sheet pool holds the core sheets" + (c.mod("learn") ? " (minus Egypt and Rome)" : "") + " plus " + pool.join(" and ") + ".</li>";
          if (c.may("arabia") && !c.mod("invest")) d += "<li><b>If the Arabs are drawn</b>, the investment deck must be used (F&F p.13) — select “Investment deck” above to update this setup.</li>";
          d += "<li>Return any unused civilization sheets to the box.</li>";
          d += "<li>Each player then chooses a <b>player color</b>" + (c.p === 5 ? " — the fifth player uses the Fame and Fortune fifth-player components" : "") + ".</li>";
          return d + "</ul>";
        },
        src: (c) => CV.joinSrc(["Core p.8", c.mod("learn") && "Core p.8 (learning game)", c.mod("advsetup") && "FAQ p.6", c.has("ff") && "F&F p.5", c.may("arabia") && !c.mod("invest") && "F&F p.13", c.has("ww") && "W&W p.4"]) },
      { when: () => true, exp: "core",
        rb: "General Setup 2",
        t: "Distribute player components",
        d: (c) => "<ul><li>Each player takes, in their player color:<ul>" +
            "<li><b>8 plastic figures</b>: 6 armies (flags) and 2 scouts (wagons)</li>" +
            "<li><b>3 city markers</b>: 1 capital and 2 cities" + (c.has("ff") ? ", plus <b>1 metropolis marker</b> (Fame and Fortune)" : "") + "</li>" +
            "<li><b>4 military tech markers</b> (placed in General Setup 3B; each player has 7 in all — the other 3 are set aside)</li>" +
            "<li><b>1 deck of tech cards</b>: 36 in the core game" + (c.has("ff") ? ", plus Fame and Fortune’s 4" : "") + (c.has("ww") ? ", plus Wisdom and Warfare’s 4 (its Metal Casting and Railroad replace the old ones)" : "") + "</li></ul></li>" +
          "<li>Each player also receives <b>1 reference sheet</b>, <b>1 setup card</b> and <b>1 deck of 4 government cards</b>" + (c.has("ww") ? " — the Wisdom and Warfare <b>replacement</b> government cards" : "") + ".</li>" +
          (c.has("ff") ? "<li><b>Fame and Fortune:</b> each player’s <b>military reference card</b> goes with their setup card (it lists the battle hand size and combat bonus modifiers and the loot a winner can claim).</li>" : "") +
          (c.p === 5 ? "<li><b>Five players:</b> the fifth player’s set comes from Fame and Fortune — 6 armies and 2 scouts, 3 city markers, 7 military tech markers, 1 setup card, 4 government cards, 36 tech cards and a reference sheet (plus that player’s share of each expansion’s per-player cards)." + (c.has("ww") ? " With Wisdom and Warfare, the fifth player too uses the replacement government cards and the replacement “Metal Casting” and “Railroad” techs (W&W p.2–4)." : "") + "</li>" : "") +
          (c.mod("invest") ? "<li><b>Investment deck:</b> give each player their deck of <b>four investment cards</b>.</li>" :
            (c.may("arabia") ? "<li><b>If the Arabs are in play</b>, the investment deck must be used: give each player their deck of four investment cards (select “Investment deck” above for its rules).</li>" : "")) +
          (c.has("ww") ? "<li><b>Wisdom and Warfare:</b> each player receives <b>one deck of social policy cards</b> (four double-sided cards).</li>" : "") +
          "</ul>",
        src: (c) => CV.joinSrc(["Core p.3, p.8", c.has("ff") && "F&F p.2–5", (c.mod("invest") || c.may("arabia")) && "F&F p.13", c.has("ww") && "W&W p.2, p.4–5, p.10"]) },
      { when: () => true, exp: "core",
        rb: "General Setup 3A",
        t: "Market board — unit cards and standing forces",
        d: (c) => "<ul><li>Place the <b>market board</b> at one end of the table (setup diagram, Core p.9).</li>" +
          "<li>Sort the unit cards by type — <b>artillery, infantry, mounted and aircraft</b> (15, 15, 15 and 8 cards). Shuffle each deck and place it on its marked space.</li>" +
          "<li>Give each player <b>one artillery, one infantry and one mounted unit</b>, face down in a single pile near the player: their <b>standing forces</b>." +
          (() => {
            const x = [c.may("germany") && CV.civName(c, "germany") + " two extra infantry", c.may("mongols") && CV.civName(c, "mongols") + " two extra mounted", c.may("zulu") && CV.civName(c, "zulu") + " two extra artillery"].filter(Boolean);
            return x.length ? " Extra starting units from the market board (Player Setup 2): " + x.join("; ") + "." : "";
          })() + "</li>" +
          (c.has("ww") ? "<li><b>Wisdom and Warfare:</b> use only the <b>replacement unit cards</b> (15 artillery, 15 infantry, 15 mounted, 8 aircraft) and replacement combat bonus cards — the core combat cards stay in the box. Sort them by type exactly as above; the two sets are not compatible.</li>" : "") +
          "</ul>",
        src: (c) => CV.joinSrc(["Core p.3, p.8–9", c.may("germany") && "Core p.11", c.has("ww") && "W&W p.2–4", (c.may("mongols") || c.may("zulu")) && "W&W p.5"]) },
      { when: () => true, exp: "core",
        rb: "General Setup 3B",
        t: "Military tech markers",
        d: (c) => "<ul><li>Each player takes their <b>lower-ranked</b> military tech markers (one stripe on one side, two stripes on the other) for <b>artillery, infantry and mounted</b> units and places each in the area below the matching unit deck, <b>one-stripe side up</b> (rank 1).</li>" +
          (() => {
            const x = [c.may("arabia") && CV.civName(c, "arabia") + " — <b>artillery</b>", c.may("greece") && CV.civName(c, "greece") + " — <b>infantry</b>", c.may("japanese") && CV.civName(c, "japanese") + " — <b>mounted</b>"].filter(Boolean);
            return x.length ? "<li><b>Starting at rank 2</b> (two-stripe side up — rank 2 is the back of the rank 1 marker): " + x.join("; ") + ".</li>" : "";
          })() +
          "<li>Each player places their <b>aircraft</b> military marker below the aircraft unit deck with the <b>star side face down</b>.</li>" +
          "<li>Set the other military tech markers aside for now (rank 3 and the starred rank 4 are the two sides of each type’s second marker).</li></ul>",
        src: (c) => CV.joinSrc(["Core p.8, p.21", (c.may("arabia") || c.may("greece")) && "F&F p.6", c.may("japanese") && "W&W p.5"]) },
      { when: () => true, exp: "core",
        rb: "General Setup 3C",
        t: "Building markers",
        d: (c) => "<ul><li>Sort the building markers by type and place them on their indicated spaces of the market.</li>" +
          "<li>A building with an <b>arrow</b> next to its name is an upgraded building, printed on the <b>back</b> of the un-upgraded building’s marker.</li>" +
          (c.has("ww") ? "<li><b>Wisdom and Warfare:</b> first place the <b>market board overlay</b> on the market board so it covers the “Harbor” space. The overlay has spaces for both <b>Harbors</b> and the new <b>Shipyards</b> (5 markers) — Shipyards are not an upgraded form of Harbors.</li>" : "") +
          "</ul>",
        src: (c) => CV.joinSrc(["Core p.8", c.has("ww") && "W&W p.2–3, p.5"]) },
      { when: () => true, exp: (c) => c.mod("learn") ? "var" : "core",
        rb: (c) => c.mod("learn") ? "General Setup 3D–3E" : "General Setup 3D",
        t: (c) => c.mod("learn") ? "Wonders — not used in the learning game" : "Wonder deck and market",
        d: (c) => {
          if (c.mod("learn")) return "<ul><li><b>Learning game:</b> skip the wonder deck and wonder marker steps — the wonder cards and markers stay in the box.</li></ul>";
          let d = "<ul>";
          if (c.has("ff") || c.has("ww")) {
            d += "<li><b>Build the wonder deck</b> — with " + (c.has("ff") && c.has("ww") ? "both expansions’" : c.has("ff") ? "Fame and Fortune’s" : "Wisdom and Warfare’s") + " extra wonders this replaces the core procedure:<ol>" +
              "<li>Shuffle the <b>modern</b> wonders and deal <b>four</b> of them face down into a deck. Return the remaining modern wonders to the box <b>without looking</b> at them.</li>" +
              "<li>Repeat with the <b>medieval</b> wonders, dealing four on top of the modern wonders.</li>" +
              "<li>Repeat with the <b>ancient</b> wonders, dealing four on top of the medieval wonders.</li></ol></li>";
            if (c.may("egypt")) d += "<li>" + CV.civName(c, "egypt") + " receives the <b>top card</b> of the wonder deck once it is built.</li>";
            d += "<li>Then turn the <b>top four cards</b> face up and place them in the wonder market spaces.</li>";
          } else {
            d += "<li>Shuffle the <b>ancient, medieval and modern</b> wonders separately (4 of each).</li>" +
              "<li>Place the <b>modern</b> wonders face down on the top space of the wonder market, then the <b>medieval</b> wonders face down on top of them.</li>" +
              "<li>Place the <b>ancient</b> wonders <b>face up</b> in the four market spaces below the wonder deck.</li>";
            if (c.may("egypt")) d += "<li><b>Exception — " + CV.civById("egypt").name + (c.civ("egypt") ? "" : ", if playing") + ":</b> Egypt receives one of the ancient wonders <b>at random</b> before the rest go to the market. Then draw one medieval wonder and place it in the market to replace the missing ancient wonder.</li>";
          }
          d += "<li><b>Errata (FAQ" + (c.has("ff") ? ", F&F p.7" : "") + (c.has("ww") ? ", W&W p.6" : "") + "):</b> each time a wonder is bought from the market, draw the next wonder from the deck and place it face up in the market, with its wonder marker.</li>";
          return d + "</ul>";
        },
        src: (c) => c.mod("learn") ? "Core p.8, p.10" : CV.joinSrc(["Core p.3, p.8", "FAQ p.1", c.has("ff") && "F&F p.5, p.7", c.has("ww") && "W&W p.5–6"]) },
      { when: (c) => !c.mod("learn"), exp: "core",
        rb: "General Setup 3E",
        t: "Wonder markers",
        d: (c) => "<ul><li>For each of the four face-up wonder cards in the market spaces, find its matching <b>wonder marker</b> and place it in the space next to the card.</li>" +
          ((c.has("ff") || c.has("ww")) ? "<li>The expansion wonder markers are kept with the core ones.</li>" : "") + "</ul>",
        src: (c) => CV.joinSrc(["Core p.10", c.has("ff") && "F&F p.3", c.has("ww") && "W&W p.2–4"]) },
      { when: () => true, exp: "core",
        rb: "General Setup 3F",
        t: "Culture event decks",
        d: (c) => "<ul><li>Separate the culture event cards into <b>ancient</b> (one column on the back), <b>medieval</b> (two columns) and <b>modern</b> (three columns) decks.</li>" +
          "<li>Shuffle each deck separately and place it face down on its space below the culture track, at the bottom of the market board.</li>" +
          ((c.has("ff") || c.has("ww")) ? "<li>The expansions’ new culture event cards (" + [c.has("ff") && "10 from Fame and Fortune", c.has("ww") && "12 from Wisdom and Warfare"].filter(Boolean).join(", ") + ") are shuffled into their decks (Before You Begin).</li>" : "") +
          "</ul>",
        src: (c) => CV.joinSrc(["Core p.10", c.has("ff") && "F&F p.2, p.5", c.has("ww") && "W&W p.2, p.4"]) },
      { when: () => true, exp: "core",
        rb: "General Setup 3G",
        t: "Culture level markers",
        d: "<ul><li>Each player takes the <b>culture level marker</b> showing their leader and places it on the <b>start space</b> of the culture track.</li></ul>",
        src: "Core p.10" },
      { when: () => true, exp: "core",
        rb: "General Setup 4",
        t: "Market resources",
        d: (c) => "<ul><li>Place <b>one of each market resource token per player</b> near the market board: <b>" + c.p + " wheat, " + c.p + " silk, " + c.p + " incense and " + c.p + " iron</b>.</li>" +
          (c.p < 4 ? "<li>Return the extra market resource tokens to the box.</li>" : c.p === 4 ? "<li>With four players all 16 market resource tokens are used.</li>" : "") +
          (c.p === 5 ? "<li><b>Five players:</b> the fifth set of 4 market resource tokens comes with Fame and Fortune’s fifth-player markers.</li>" : "") +
          "<li>Spy and uranium can’t be harvested from the map: spies come from huts and villages, uranium only (and rarely) from villages.</li></ul>",
        src: (c) => CV.joinSrc(["Core p.6, p.10", c.p === 5 && "F&F p.2, p.4"]) },
      { when: () => true, exp: (c) => c.p === 5 ? "ff" : "core",
        rb: "General Setup 5",
        t: "Build the map",
        d: (c) => {
          let d = "<ul><li>Each player takes their <b>home map tile</b> (their leader is pictured on its back) and places it <b>face up in front of them</b>, oriented as the map diagram shows. Return unused home tiles to the box.</li>";
          d += "<li>One player shuffles the <b>neutral map tiles</b> and deals them out <b>face down</b> to form the rest of the map, as the diagram shows. Return unused neutral tiles to the box <b>without looking at them</b>.</li>";
          if (c.has("ff") || c.has("ww")) {
            const nNeutral = 14 + (c.has("ff") ? 7 : 0) + (c.has("ww") ? 6 : 0);
            d += "<li>The expansion home tiles are with the core ones, and the expansion neutral tiles are already shuffled in: <b>" + nNeutral + " neutral tiles</b> in all (core 14" + (c.has("ff") ? " + Fame and Fortune 7" : "") + (c.has("ww") ? " + Wisdom and Warfare 6" : "") + "). Some of the new neutral tiles hold a <b>relic</b> square (see Relics).</li>";
          }
          if (c.p <= 4) {
            d += "<li><b>" + c.p + " players</b> (Core p.9): " + CV.mapLayouts[c.p].text + "</li></ul>" + CV.mapHtml(c.p);
            d += "<p class=\"inline-note\">" + (c.has("ff") || c.has("ww") ? "" : "The core game has 14 neutral tiles. ") + "The rulebook’s text for this step refers to “the diagram on page 4”; the map diagrams are on page 9.</p>";
          } else {
            d += "<li><b>Five players</b> (Fame and Fortune “Five-Player Map Setup”, F&F p.6): " + CV.mapLayouts[5].text + "</li>" +
              "<li>As in the core game, the arrows show tile orientation.</li>" +
              "<li><b>The hole in the center</b> cannot be moved through in any way, and is considered adjacent to the <b>inside</b> edge of the map rather than the outside (so, for example, the great person Galileo cannot move figures next to the hole).</li></ul>" + CV.mapHtml(5);
          }
          return d;
        },
        src: (c) => CV.joinSrc(["Core p.9–10", c.p === 5 && "F&F p.6", c.has("ff") && "F&F p.2–3, p.5", c.has("ww") && "W&W p.2–4"]) },
      { when: () => true, exp: "core",
        rb: "General Setup 6",
        t: "Shuffle the random markers",
        d: (c) => "<ul>" + (c.mod("gp")
            ? "<li><b>Great person deck:</b> do <b>not</b> shuffle the great person markers face down. Turn them <b>face up</b> and sort them by type — <b>artist, builder, general, humanitarian, industrialist and scientist</b>. Then shuffle the <b>great person deck</b> and place it face down near the markers.</li>"
            : "<li>Place the <b>great person markers</b> face down near the market board and mix them up, keeping them face down.</li>") +
          "<li>" + (c.mod("gp") ? "Place" : "Repeat for") + " the <b>hut markers</b>, then the <b>village markers</b>, face down in separate mixed piles" +
            (c.has("ff") || c.has("ww") ? " — the expansion huts and villages (" + [c.has("ff") && "Fame and Fortune: 10 huts, 5 villages", c.has("ww") && "Wisdom and Warfare: 5 huts, 5 villages"].filter(Boolean).join("; ") + ") are mixed in with the core 20 huts and 10 villages" : "") + ".</li>" +
          ((c.has("ff") || c.has("ww")) ? "<li>Keep the <b>relic markers</b> (" + [c.has("ff") && "Atlantis, School of Confucius, Seven Cities of Gold", c.has("ww") && "Ark of the Covenant, Attila’s Village"].filter(Boolean).join("; ") + ") with them: each is placed on its square when the tile showing that relic is discovered.</li>" : "") +
          "</ul>",
        src: (c) => CV.joinSrc([(c.has("ff") || c.has("ww")) ? "Core p.3, p.10" : "Core p.10", c.mod("gp") && "F&F p.11", c.has("ff") && "F&F p.2, p.5, p.9", c.has("ww") && "W&W p.2, p.4, p.11"]) },
      { when: () => true, exp: "core",
        rb: "General Setup 7",
        t: "Form the token banks",
        d: (c) => "<ul><li>Place the <b>culture</b>, <b>wound</b> and <b>coin</b> tokens next to the market board in three separate stockpiles.</li>" +
          (c.has("ff") ? "<li><b>Fame and Fortune:</b> the 23 <b>five-point culture tokens</b> join the culture tokens. Keep the 15 <b>fortification/caravan markers</b> within reach (used when figures are disbanded)" + (c.mod("invest") ? ", and the 23 <b>investment markers</b>" : (c.may("arabia") ? ", and — if the Arabs are in play — the 23 <b>investment markers</b> (the investment deck must be used)" : "")) + ".</li>" : "") +
          (c.has("ww") ? "<li><b>Wisdom and Warfare:</b> keep the 7 <b>building program markers</b> within reach.</li>" : "") +
          "</ul>",
        src: (c) => CV.joinSrc(["Core p.10", c.has("ff") && "F&F p.2, p.4, p.8" + ((c.mod("invest") || c.may("arabia")) ? ", p.13" : ""), c.has("ww") && "W&W p.2–3, p.7"]) },
      { when: () => true, exp: "core",
        rb: "General Setup 8",
        t: "Place special cards and markers",
        d: (c) => "<ul><li>Place the <b>combat bonus cards</b>" + (c.has("ww") ? " (the Wisdom and Warfare replacements)" : "") + " and the <b>Space Flight</b> tech card face up near the market board, along with the <b>disaster markers</b>" + (c.has("ff") ? " — the core grassland/desert markers and Fame and Fortune’s forest/water markers" : "") + ".</li>" +
          (c.has("ww") ? "<li><b>Wisdom and Warfare:</b> place the 5 <b>city-state markers</b> in a pile near the market board and <b>shuffle</b> them (face down).</li>" : "") + "</ul>",
        src: (c) => CV.joinSrc(["Core p.10", c.has("ff") && "F&F p.4", c.has("ww") && "W&W p.3, p.5, p.9"]) },
      { when: () => true, exp: (c) => c.mod("advsetup") ? "var" : "core",
        rb: "General Setup 9",
        t: "Select the first player",
        d: (c) => "<ul><li>Choose a player to go first — the player who can trace their family history back the farthest, or at random — and give them the <b>first player marker</b>.</li>" +
          (c.mod("advsetup") ? "<li><b>Advanced Setup:</b> now, in turn order starting with the first player, each player selects which of their two drawn civilizations to play.</li>" : "") +
          "<li>Then each player sets up their own civilization (Player Setup, below).</li></ul>",
        src: (c) => CV.joinSrc(["Core p.10", c.mod("advsetup") && "FAQ p.6"]) }
    ]
  },
  {
    title: "Player Setup — each player",
    steps: [
      { when: () => true, exp: "core",
        rb: "Player Setup 1",
        t: "Place your capital",
        d: (c) => "<ul><li>Choose one of the <b>four center squares</b> of your home map tile and place your <b>capital</b> city marker there, <b>unwalled side up</b>" + (c.may("china") ? " (" + CV.civName(c, "china") + ": walled side up — Player Setup 2)" : "") + ".</li>" +
          "<li>" + (c.mod("learn") ? "First game: the rulebook advises the square with the " + CV.ic.w("capital-start", "Recommended capital space for beginners", "<b>starting arrow</b>") + " (the recommended capital space)." : "For a player’s first game the rulebook advises the square with the " + CV.ic.w("capital-start", "Recommended capital space for beginners", "<b>starting arrow</b>") + " (the recommended capital space).") + "</li>" +
          "<li>That square is the <b>city center</b>; the eight squares around it are the capital’s <b>city outskirts</b>.</li>" +
          (c.may("india") ? "<li>" + CV.civName(c, "india") + " places its <b>metropolis marker</b> instead of a capital: it must occupy <b>two</b> of the four center squares of India’s home tile, side by side — <b>not diagonally</b>. Both squares are the city center; the <b>10</b> squares around it are its outskirts.</li>" : "") +
          (c.may("aztecs") ? "<li>" + CV.civName(c, "aztecs") + ": only <b>three</b> legal capital squares — one of the four center squares of the Aztec home tile is <b>water</b>.</li>" : "") +
          (c.has("ww") ? "<li><b>Social policy (Wisdom and Warfare):</b> each civilization starts with a social policy maximum of <b>1</b> (one built city) and adopts its first social policy now: choose one of your four social policy cards and place it with the side you want face up." +
            (c.may("french") ? " " + CV.civName(c, "french") + " start with a maximum of <b>2</b> and adopt <b>two</b> (each from a different card)." : "") + "</li>" : "") +
          "</ul>",
        src: (c) => CV.joinSrc(["Core p.7, p.10", c.may("china") && "Core p.11", c.may("india") && "F&F p.6, p.10", c.may("aztecs") && "W&W p.5", c.has("ww") && "W&W p.10"]) },
      { when: () => true, exp: "core",
        rb: "Player Setup 2",
        t: "Gain civilization bonuses",
        d: (c) => {
          const line = (id) => {
            const v = CV.civById(id);
            let s = "<li><b>" + v.name + ":</b> " + v.bonus(c);
            if (v.adv && c.mod(v.adv.mod)) s += " " + v.adv.text;
            return s + "</li>";
          };
          let d = "<p>Each player checks their civilization sheet for any starting bonus:</p><ul>";
          if (c.civs.length) d += c.civs.map(line).join("");
          d += "</ul>";
          if (c.open > 0) {
            d += "<p>" + (c.civs.length ? "For the " + (c.open === 1 ? "player" : c.open + " players") + " drawing at random — whichever of these turns up:" : "Whichever civilizations are drawn:") + "</p><ul>" + c.pool.map(line).join("") + "</ul>";
          }
          return d;
        },
        src: (c) => {
          const s = ["Core p.11"];
          if (c.may("egypt")) s.push("Core p.8");
          if (c.may("egypt") && c.has("ff")) s.push("F&F p.5");
          if ((c.may("egypt") && c.mod("advegypt")) || (c.may("arabia") && c.mod("advarabia")) || (c.may("greece") && c.mod("advgreece"))) s.push("FAQ p.6");
          if (CV.anyMay(c, ["arabia", "greece", "india", "spain"]) || (c.may("america") && c.mod("gp"))) s.push("F&F p.6");
          if (c.may("arabia") && !c.mod("invest")) s.push("F&F p.13");
          if (CV.anyMay(c, ["aztecs", "english", "french", "japanese", "mongols", "zulu"]) || (c.may("egypt") && c.has("ww"))) s.push("W&W p.5");
          return s.join(" · ");
        } },
      { when: () => true, exp: "core",
        rb: "Player Setup 3",
        t: "Place your figures",
        d: (c) => "<ul><li>Place <b>one army</b> and <b>one scout</b> (separately or together) in one or two of your capital’s <b>outskirts</b> squares.</li>" +
          "<li>Figures <b>cannot be placed in water</b> squares at the start of the game.</li>" +
          (c.may("russia") ? "<li>" + CV.civName(c, "russia") + " also places the <b>white Russian army</b> figure (its stacking limit starts at 3).</li>" : "") +
          (c.may("spain") ? "<li>" + CV.civName(c, "spain") + " also places the <b>white Spanish scout</b> figure. Spain’s stacking limit is still <b>2</b>, so its three figures can’t all start in the same square.</li>" : "") +
          (c.may("india") ? "<li>" + CV.civName(c, "india") + ": the “capital’s outskirts” are the 10 squares around its metropolis.</li>" : "") +
          "</ul>",
        src: (c) => CV.joinSrc(["Core p.11", c.may("russia") && "Core p.7", (c.may("spain") || c.may("india")) && "F&F p.6, p.10"]) },
      { when: () => true, exp: "core",
        rb: "Player Setup 4",
        t: "Learn your starting tech",
        d: (c) => "<ul><li>Look at the <b>bottom of your civilization sheet</b> for your starting tech, find that card in your tech deck and place it <b>face up</b> in front of you, leaving plenty of room around it.</li>" +
          "<li>Your starting tech always goes in the <b>bottom row</b> of your tech pyramid, whatever its level. If another player learns that tech, it is still its normal level for them.</li>" +
          (c.may("russia") ? "<li>" + CV.civName(c, "russia") + ": starting tech <b>Communism</b> (level III), as printed on the sample Russian sheet (Core p.7).</li>" : "") +
          (() => {
            const x = [["arabia", "Mathematics"], ["greece", "Democracy"], ["japanese", "Chivalry"], ["mongols", "Horseback Riding"]].filter(a => c.may(a[0]));
            return x.length ? "<li>Named in the expansions’ setup bonuses: " + x.map(a => CV.civName(c, a[0]) + " — <b>" + a[1] + "</b>").join("; ") + ".</li>" : "";
          })() +
          "<li>The rulebooks do not list the other civilizations’ starting techs — read them from the sheet.</li></ul>",
        src: (c) => CV.joinSrc(["Core p.11, p.21", c.may("russia") && "Core p.7", CV.anyMay(c, ["arabia", "greece"]) && "F&F p.6", CV.anyMay(c, ["japanese", "mongols"]) && "W&W p.5"]) },
      { when: () => true, exp: "core",
        rb: "Player Setup 5",
        t: "Set your starting government",
        d: (c) => "<ul><li>Stack your four government cards with the <b>Despotism/Republic</b> card on top, <b>Despotism side up</b>, and place the stack on the indicated space of your civilization sheet.</li>" +
          (() => {
            const x = [c.may("rome") && CV.civName(c, "rome") + " begins as a <b>Republic</b>", c.may("russia") && CV.civName(c, "russia") + " begins governed by <b>Communism</b>",
              c.may("greece") && CV.civName(c, "greece") + " begins governed by <b>Democracy</b>", c.may("japanese") && CV.civName(c, "japanese") + " begin governed by <b>Feudalism</b>"].filter(Boolean);
            return x.length ? "<li><b>Exceptions:</b> " + x.join("; ") + ". Place that government card, correct side up, on top of the stack instead of Despotism.</li>" : "";
          })() +
          "<li>Each government card has a different government on each side — check the backs if you can’t find yours.</li>" +
          (c.has("ww") ? "<li><b>Wisdom and Warfare:</b> these are the <b>replacement</b> government cards (marked R); the core government cards stay in the box.</li>" : "") +
          "</ul>",
        src: (c) => CV.joinSrc(["Core p.12", c.may("greece") && "F&F p.6", c.has("ww") && "W&W p.4, p.12", c.may("japanese") && "W&W p.5"]) },
      { when: () => true, exp: "core",
        rb: "Player Setup 6",
        t: "Set your trade dial",
        d: (c) => "<ul><li>Count all the " + CV.ic.w("trade", "Trade", "<b>trade symbols</b>") + " in the eight outskirts squares of your capital and set your <b>trade dial</b> (the large outer dial) to that total." +
          (c.may("india") ? " " + CV.civName(c, "india") + " counts the <b>10</b> outskirts squares of its metropolis." : "") + "</li>" +
          "<li>You still collect trade again on the first turn of the game.</li></ul>",
        src: (c) => CV.joinSrc(["Core p.7, p.12", c.may("india") && "F&F p.10"]) },
      { when: () => true, exp: "core",
        rb: "Player Setup 7",
        t: "Set your economy dial",
        d: "<ul><li>Set your <b>economy dial</b> (the small inner dial) to <b>0</b>.</li>" +
          "<li>If you already have a coin from a map square or a great person, set it to your number of coins instead.</li></ul>",
        src: "Core p.12" },
      { when: () => true, exp: "core",
        rb: "Player Setup 8",
        t: "Place your unbuilt figures",
        d: (c) => "<ul><li>Place <b>one city marker</b>, your <b>remaining five army figures</b> and your <b>remaining scout</b> beside your civilization sheet — they are ready to be built.</li>" +
          "<li>Set your <b>other city marker</b> aside until you learn <b>Irrigation</b>; then add it to your available items.</li>" +
          (c.has("ff") ? "<li><b>Metropolis marker:</b> it stays with your city markers until you learn <b>Agriculture</b>, when it replaces your capital marker (see Metropolises)" + (c.may("india") ? "; " + CV.civName(c, "india") + " already has its metropolis on the map" : "") + ".</li>" : "") +
          (c.may("america") ? "<li>" + CV.civName(c, "america") + ": now place the starting great person in the capital’s outskirts" + (c.mod("learn") ? " (first game: the rulebook recommends the grassland square next to the capital)" : "") +
            (c.mod("gp") ? " — with the great person deck, America draws a great person card and takes the matching marker" : "") + ".</li>" : "") +
          "</ul>",
        src: (c) => CV.joinSrc(["Core p.12", c.may("america") && "Core p.11", c.has("ff") && ("F&F p.5" + (c.may("india") ? ", p.6" : "") + ", p.10"), c.may("america") && c.mod("gp") && "F&F p.11"]) }
    ]
  },
  {
    title: "Begin Play",
    steps: [
      { when: () => true, exp: "core",
        t: "The first turn",
        d: (c) => "<ul><li>Play turns of five phases — <b>Start of Turn, Trade, City Management, Movement, Research</b> — beginning with the first player and going clockwise (Trade may be done by everyone at once; Research always is).</li>" +
          "<li>On the <b>first turn</b> the first player marker is <b>not</b> passed; from the second turn on it passes one player to the left at the start of each turn.</li>" +
          (c.mod("learn") ? "<li><b>Learning game:</b> the game ends as soon as a player builds their <b>third city</b> (which needs the Irrigation tech).</li>" : "<li>The game ends the moment a player achieves any of the four victories — culture, tech, economic or military" + (c.mod("advtie") ? " (with the <b>Advanced Tiebreaker</b>, a non-military victory lets the rest of the turn play out first)" : "") + ".</li>") +
          (c.has("ww") ? "<li><b>Wisdom and Warfare:</b> City Management now offers a fourth city action, <b>start a building program</b>.</li>" : "") +
          "</ul>",
        src: (c) => CV.joinSrc(["Core p.2, p.12", !c.mod("learn") && "Core p.21–23", c.mod("learn") && "Core p.8, p.13", c.mod("advtie") && "FAQ p.6", c.has("ww") && "W&W p.7"]) }
    ]
  }
];


/* each step's rulebook step label (rb) is appended to its citation */
CV.phases.forEach(ph => ph.steps.forEach(st => {
  if (!st.rb) return;
  const src0 = st.src, rb = st.rb;
  st.src = (c) => (typeof src0 === "function" ? src0(c) : src0) + " · " + (typeof rb === "function" ? rb(c) : rb);
}));

/* =============================================================================
   RULES REFERENCE
   ============================================================================= */
CV.reference = [
  {
    title: "How to Win — the Four Victories",
    when: () => true,
    html: (c) => (c.mod("learn") ? "<p class=\"callout\"><b>Learning game:</b> nobody wins — the game simply ends when a player builds their third city.</p>" : "") +
      (c.mod("learn") ? "<p>In the full game, the first player to achieve any one of these wins at once:</p><ul>" : c.mod("advtie") ? "<p>The four victories (with the <b>Advanced Tiebreaker</b>, only a military victory wins at once — a culture, economic or tech victory lets the turn finish and is then scored; see below):</p><ul>" : "<p>The first player to achieve any one of these wins at once:</p><ul>") +
      "<li><b>Culture victory</b> — advance your culture level marker into the " + CV.ic.w("space-culture-victory", "Culture Victory space", "<b>Culture Victory</b> space") + " at the end of the culture track (spend culture, and trade higher up the track).</li>" +
      "<li><b>Tech victory</b> — research <b>Space Flight</b>, the only level V tech. It needs at least five level I, four level II, three level III and two level IV techs below it: <b>15 techs minimum</b>.</li>" +
      "<li><b>Economic victory</b> — have <b>15 coins</b> on your economy dial." + (c.mod("invest") ? " <b>Investments do not count</b> toward the 15 coins (F&F p.13)." : "") + "</li>" +
      "<li><b>Military victory</b> — <b>conquer one other player’s capital</b>.</li></ul>" +
      "<h4>Ties and timing (FAQ)</h4><ul>" +
      "<li>If several players complete a tech victory on the same turn, the player <b>first in turn order</b> wins — unless you play the Advanced Tiebreaker.</li>" +
      "<li>A coin total updates the moment a scout moves onto or off a coin square, or a blockading figure leaves one — this can trigger an economic victory immediately (unless you play the Advanced Tiebreaker, when the turn is played out first).</li></ul>" +
      (c.mod("advtie") ? "<h4>Advanced Tiebreaker (variant selected)</h4><ul>" +
        "<li>A <b>military</b> victory still ends the game immediately and that player wins.</li>" +
        "<li>A <b>culture, economic or tech</b> victory: the rest of the turn is played out. Then every player who completed a non-military victory calculates a <b>Victory Score</b>: learned techs + spaces advanced on the culture track + coins + wonders (obsoleted wonders count; destroyed ones don’t).</li>" +
        "<li>Highest Victory Score wins; tied players <b>share</b> the victory.</li>" +
        "<li>When a player reaches the Culture Victory space under this variant, they gain one culture event card from the <b>third</b> (modern) deck.</li></ul>" : "") +
      "<h4>Paths at a glance</h4>" + (c.mod("learn") ? "<p class=\"inline-note\">Wonders (Stonehenge, the Statue of Liberty, the Panama Canal, Himeji Samurai Castle) are not used in the learning game (Core p.8).</p>" : "") + "<ul>" +
      "<li><b>Culture:</b> culture icons, devoting cities to the arts; later, trade too. Culture buildings (e.g. from Theology), incense abilities (e.g. Currency) and culture wonders such as Stonehenge help.</li>" +
      "<li><b>Tech:</b> trade icons and extra research (e.g. culture events). Trade buildings (Code of Laws), trade abilities (Horseback Riding) and the Statue of Liberty help.</li>" +
      "<li><b>Economic:</b> coins from map squares, buildings (e.g. Banks) and tech tasks — Pottery, Code of Laws, Printing Press, Democracy; the Panama Canal helps.</li>" +
      "<li><b>Military:</b> units, upgrades (e.g. Gunpowder), stacking limit (e.g. Biology), combat bonuses (e.g. Academies); Himeji Samurai Castle helps.</li></ul>",
    src: (c) => CV.joinSrc(["Core p.2, p.21–23, p.26", "FAQ p.2", c.mod("advtie") && "FAQ p.6", c.mod("learn") && "Core p.8", c.mod("invest") && "F&F p.13"])
  },
  {
    title: "Turn Overview — the Five Phases",
    when: () => true,
    html: (c) => "<p>Each game turn has five phases, in this order. In each phase the <b>first player</b> acts first, then play continues clockwise.</p><ol>" +
      "<li><b>Start of Turn</b> — pass the first player marker one player to the left (not on the first turn). In order, each player performs start-of-turn actions (usually from wonders or culture event cards" + (c.has("ww") ? ", and social policies" : "") + (c.mod("invest") ? "; investing a coin" : "") + "), builds new cities and may change government.</li>" +
      "<li><b>Trade</b> — each player collects trade from all their cities, then players may negotiate and trade. <i>May be done by everyone simultaneously.</i></li>" +
      "<li><b>City Management</b> — in turn, each player takes <b>one action with each city</b>: produce an item, devote to the arts, " + (c.has("ww") ? "harvest a resource, or <b>start a building program</b> (Wisdom and Warfare)" : "or harvest a resource") + ".</li>" +
      "<li><b>Movement</b> — in turn, each player moves each figure up to their <b>travel speed</b> (starts at 2). Movement can cause battles and reveal face-down map tiles.</li>" +
      "<li><b>Research</b> — each player may learn <b>one</b> new tech by spending trade. <i>Always done by every player simultaneously.</i></li></ol>",
    src: (c) => CV.joinSrc(["Core p.12", c.mod("invest") && "F&F p.13", c.has("ww") && "W&W p.7, p.10"])
  },
  {
    title: "1. Start of Turn — New Cities & Governments",
    when: () => true,
    html: (c) => "<p>Players act in turn order; each does all their start-of-turn actions before the next player.</p><ul>" +
      "<li>Perform any <b>start of turn actions</b> (usually on wonders or culture event cards).</li>" +
      "<li><b>Build new cities</b> and <b>change governments</b> (below).</li>" +
      "<li>Place any <b>great people held in reserve</b> on your civilization sheet into the outskirts of any of your cities.</li>" +
      "<li>Declare which city each of your <b>scouts</b> is sending its square to this turn (Scout Gathering).</li></ul>" +
      "<h4>Building new cities</h4><ul>" +
      "<li>Allowed when you have fewer built cities than your maximum: <b>two</b> normally, <b>three</b> once you know <b>Irrigation</b>. You may build one or more, without exceeding the maximum.</li>" +
      "<li>You need a <b>scout</b> (representing settlers) in each square where you place a city.</li>" +
      "<li>The square must meet <b>all</b> of these:<ul>" +
        "<li>not a <b>water</b> square;</li>" +
        "<li><b>eight revealed squares</b> adjacent to it — not on the edge of the map or next to a face-down tile;</li>" +
        "<li>not adjacent to a <b>hut or village</b> marker (fair game once the marker is gone);</li>" +
        "<li>not adjacent to an <b>enemy figure</b> (army or scout) — friendly figures may be adjacent, or in the square;</li>" +
        "<li>at least <b>three squares from any other city marker</b>, diagonals included — outskirts may not overlap.</li>" +
        ((c.has("ff") || c.has("ww")) ? "<li>not adjacent to a <b>relic marker</b> still on the map (" + [c.has("ff") && "F&F p.9", c.has("ww") && "W&W p.11"].filter(Boolean).join("; ") + ");</li>" : "") +
        (c.has("ww") ? "<li>not adjacent to a <b>city-state</b> (W&W p.10). A city <b>may</b> be built in the same square as a city-state: the city-state is destroyed and you receive <b>3 culture</b>.</li>" : "") +
        "</ul></li>" +
      "<li>Sacrifice the scout (return it to your sheet) and place a city marker, <b>unwalled side up</b>. Move any other friendly figures in that square to an adjacent square where they can legally end movement.</li>" +
      "<li>The new city produces trade this turn and gets an action in City Management.</li>" +
      (c.has("ww") ? "<li><b>Social policies:</b> your social policy maximum equals your number of built cities" + (c.may("french") ? " (+1 for the French)" : "") + ", so a new city means you must <b>immediately adopt</b> a new social policy; losing a city means returning one (see Social Policies).</li>" : "") +
      "<li>The <b>city center never generates anything</b>; only the eight outskirts squares provide icons and resources" + (c.has("ff") ? " (ten for a metropolis)" : "") + ".</li></ul>" +
      "<h4>Changing governments</h4><ul>" +
      "<li>After you unlock a government by learning a tech in the Research Phase, you may switch to it during the <b>next turn’s Start of Turn</b>: put that card, correct side up, on top of your government deck.</li>" +
      "<li>That direct switch is your <b>only chance</b>. Changing to a government on any other turn requires going through <b>Anarchy</b> first: your <b>capital takes no action</b> that turn. During the next turn’s Start of Turn you may change from Anarchy to any government you know.</li>" +
      "<li>Ongoing benefits of a government last only while you are ruled by it.</li>" +
      "<li><b>FAQ:</b> a government unlocked by a tech gained during the Movement Phase (e.g. by conquering a city, or the Russians’ ability) may be adopted at the next Start of Turn without Anarchy.</li>" +
      "<li><b>FAQ:</b> a government unlocked during the Start of Turn Phase (e.g. by a culture event card) may be adopted <b>immediately in that same phase</b> without Anarchy — even if the card came from a player later in turn order.</li>" +
      "<li><b>FAQ:</b> a capital that loses its action to Anarchy <b>still collects trade</b>.</li>" +
      (c.has("ff") ? "<li><b>Immune to anarchy</b> (Fame and Fortune term): a player who is immune to anarchy never needs to change to Anarchy — culture events can’t force them to — and may switch directly to a new government even if they didn’t learn it on the previous turn.</li>" : "") +
      "</ul>" +
      ((c.has("ff") || c.has("ww")) ? "<h4>Expansion start-of-turn actions</h4><ul>" +
        (c.has("ff") ? "<li><b>Metropolis growth:</b> if your capital couldn’t grow into a metropolis when you learned Agriculture, you <b>must</b> grow it during the Start of Turn Phase of the first later turn on which it becomes possible.</li>" +
          "<li><b>Teacher</b> hut marker: reveal and discard it during the Start of Turn Phase to <b>learn a level I tech for free</b>.</li>" +
          "<li><b>Atlantis</b> relic: the player who removed it learns a <b>free tech of their choice</b> at the start of the next turn (needs a legal space in their pyramid).</li>" : "") +
        (c.has("ff") && c.mod("invest") ? "<li><b>Invest a coin:</b> each player may invest <b>one (and only one)</b> coin token per turn, during the start of the turn (see Investment Deck).</li>" +
          "<li><b>Seven Cities of Gold</b> relic: the player who removed it <b>invests two coins for free</b> at the start of the next turn — two investment markers, no coin tokens lost.</li>" : "") +
        (c.has("ww") ? "<li><b>Social policies:</b> each “Start of Turn” ability on a social policy card can be used <b>once per turn</b>; if a card has two abilities, each can be used once (e.g. Expansionism: gain 1 trade for each of your cities and 1 for each of your city-states).</li>" : "") +
        "</ul>" : ""),
    src: (c) => CV.joinSrc(["Core p.12–14, p.18, p.26", "FAQ p.3", c.has("ff") && "F&F p.5, p.8–10" + (c.mod("invest") ? ", p.13" : ""), c.has("ww") && "W&W p.10–11"])
  },
  {
    title: "2. Trade — Collecting & Negotiating",
    when: () => true,
    html: "<h4>Collecting trade</h4><ul>" +
      "<li>Total the " + CV.ic.w("trade", "Trade", "<b>trade symbols</b>") + " in the outskirts of <b>all</b> your cities and advance your trade dial by that amount — to a <b>maximum of 27</b>.</li>" +
      "<li>Trade may be <b>saved</b> from turn to turn.</li>" +
      "<li>When moving the dial, count the spaces marked <b>I, II, III, IV and V</b> like any other space (3 trade from “3” lands on “I”, not “7”).</li>" +
      "<li>Scouts can gather trade from the square they occupy; an outskirts square holding an <b>enemy figure</b> produces no trade for you (blockade).</li></ul>" +
      "<h4>Trade vs. production</h4><div class=\"tbl-wrap\"><table class=\"ref-tbl\"><thead><tr><th>" + CV.ic.w("trade", "Trade", "Trade") + "</th><th>" + CV.ic.w("production", "Production", "Production") + "</th></tr></thead><tbody>" +
      "<tr><td>Pooled from all of a civilization’s cities</td><td>Spent from only one city at a time</td></tr>" +
      "<tr><td>Can be saved on the trade dial</td><td>Cannot be saved — unspent production is lost</td></tr>" +
      "<tr><td>May be converted to production (rushing: 3 trade = +1 production)</td><td>Cannot be converted to trade</td></tr>" +
      "<tr><td>Mainly spent to research techs</td><td>Produces figures, units, buildings and wonders</td></tr></tbody></table></div>" +
      "<h4>Negotiating and trading</h4><ul>" +
      "<li>After trade is collected, players may negotiate and exchange any or all of: <b>non-binding promises</b>, <b>points of trade</b>, <b>unspent culture tokens</b>, <b>resource tokens</b> (from the market or from huts/villages), and <b>culture event cards</b>.</li>" +
      "<li>Nothing else may be given or traded unless a card or ability allows it.</li>" +
      "<li>If a trade puts you over your culture hand size, discard down at once.</li></ul>",
    src: "Core p.7, p.14–15"
  },
  {
    title: "3. City Management — City Actions",
    when: () => true,
    html: (c) => "<p>In turn order, each player takes <b>one action with each city</b>, choosing one of these. Several of your cities may take the same action (FAQ).</p>" +
      "<h4>A. Produce a figure, unit, building or wonder</h4><ul>" +
      "<li>Produce <b>one item</b> costing no more than the " + CV.ic.w("production", "Production", "<b>production symbols</b>") + " in that city’s outskirts. The whole cost comes from that one city — cities never combine production — and excess production is wasted.</li>" +
      "<li><b>Rushing:</b> for every <b>3 trade</b> you remove from your dial, one city gains <b>+1 production</b> this turn. As often as you can afford.</li>" +
      "<li><b>Engineering exception:</b> once per turn, when you spend a city’s production you may split it however you wish to buy <b>two items</b> instead of one (Engineering card, shown Core p.22)." + (c.may("egypt") ? " <b>FAQ:</b> this can’t be combined with Egypt’s ability to build unlocked buildings for free in a single city management action." : "") + "</li>" +
      "<li><b>Figures:</b> army <b>4</b>, scout <b>6</b> — only if you have an unbuilt figure of that type. Place it in that city’s outskirts, not in water unless a tech lets your figures end movement in water (e.g. Sailing, Steam Power, Flight), and within your stacking limit.</li>" +
      "<li><b>Units:</b> draw a random card from that unit deck into your standing forces. Cost by your current rank: rank 1 <b>5</b>, rank 2 <b>7</b>, rank 3 <b>9</b>, rank 4 <b>11</b>; aircraft <b>12</b> (needs Flight). An empty deck can’t be produced from until units return to it.</li>" +
      "<li><b>Buildings:</b> need a tech that unlocks them; cost is on the tech and the market board. Place in that city’s outskirts on allowed terrain (see Buildings). Limited by the markers available.</li>" +
      (c.mod("learn") ? "<li><b>Wonders:</b> not used in the learning game.</li>" : "<li><b>Wonders:</b> any face-up wonder in the market; the card gives its cost and a lower cost if you know the listed tech.</li>") +
      "<li><b>FAQ:</b> a production bonus from a tech or culture event can be used in only one action — even if the city gets an extra action (Atomic Theory, “Ada Lovelace”).</li>" +
      (c.has("ff") ? "<li>" + CV.ic.w("fortification-caravan", "Fortification/caravan marker", "<b>Caravan</b>") + " (Fame and Fortune): when you take a build action in a city with a caravan marker, you may discard the marker to have the city produce <b>2 extra production</b> that turn.</li>" +
        "<li>" + CV.ic.w("ff-friendly-workers", "Friendly Workers", "<b>Friendly Workers</b>") + " village marker: reveal and discard it during City Management to have one of your cities produce <b>4 extra production</b> that turn.</li>" : "") +
      (c.has("ww") ? "<li>" + CV.ic.w("building-program", "Building program marker", "<b>Building program</b>") + " (Wisdom and Warfare): a city with a building program marker <b>must</b> use it when it produces — see D below.</li>" +
        "<li>" + CV.ic.w("shipyard", "Shipyard marker", "<b>Shipyard</b>") + " (Wisdom and Warfare): a new building unlocked by the level I tech <b>Navy</b>; water squares only, and <b>limited</b> (star on the marker), so it counts as the city’s one limited building. It is <b>not</b> an upgraded Harbor.</li>" : "") +
      "</ul>" +
      "<h4>B. Devote to the arts</h4><ul>" +
      "<li>Collect <b>1 culture token</b> plus <b>1 per</b> " + CV.ic.w("culture", "Culture", "<b>culture icon</b>") + " in that city’s outskirts" + (c.has("ff") ? " — a <b>metropolis</b> collects a base of <b>2</b> instead of 1" : "") + ".</li>" +
      "<li>At any point in your City Management Phase you may spend culture to advance on the culture track (see Culture).</li></ul>" +
      "<h4>C. Harvest a resource</h4><ul>" +
      "<li>If a square in the outskirts shows a resource icon, take <b>one</b> token of that resource from the market and put it on your civilization sheet.</li>" +
      "<li>Not possible if the market has none of that resource left. <b>One resource per action</b>, even with two icons of it.</li>" +
      "<li><b>FAQ:</b> nobody may harvest the <b>same resource icon twice</b> in a turn, even with different cities — except through Atomic Theory.</li>" +
      (c.has("ff") && !c.mod("learn") ? "<li><b>FAQ (Fame and Fortune):</b> the <b>Angkor Wat</b> wonder’s ability may be used to have <b>any</b> city harvest two resources as its action.</li>" : "") +
      "</ul>" +
      (c.has("ww") ? "<h4>D. Start a building program (Wisdom and Warfare)</h4><ul>" +
        "<li>Place a " + CV.ic.w("building-program", "Building program marker", "<b>building program marker</b>") + " on the city. A city can’t have more than one at a time.</li>" +
        "<li>The marker stays until the city is <b>destroyed</b> or is next used to <b>produce</b> a figure, unit, building or wonder.</li>" +
        "<li>The next time that city produces, discard the marker and <b>double the production in its outskirts</b> for that action. A city <b>must</b> use its marker when it produces.</li>" +
        "<li>Production from other sources (culture event cards, governments) is <b>not</b> doubled. Excess production after the action is wasted.</li>" +
        "<li><i>Example (W&W p.7):</i> a city with 9 production in its outskirts starts a building program; next turn it doubles to 18 and builds the Statue of Zeus (15) — the other 3 are wasted.</li></ul>" : "") +
      "<h4>Scouts and blockades</h4><ul>" +
      "<li>A scout can add its square’s icons to one of your cities for the turn; an outskirts square holding an enemy figure gives you nothing (see Scouts — Gathering & Blockades).</li></ul>",
    src: (c) => CV.joinSrc(["Core p.7, p.15–18, p.22", "FAQ p.2–3", c.has("ff") && "F&F p.8, p.10", c.has("ff") && !c.mod("learn") && "FAQ p.5", c.has("ww") && "W&W p.3, p.7"])
  },
  {
    title: "Production Costs at a Glance",
    when: () => true,
    html: (c) => "<div class=\"tbl-wrap\"><table class=\"ref-tbl\"><thead><tr><th>Item</th><th>" + CV.ic.w("production", "Production", "Production cost") + "</th><th>Notes</th></tr></thead><tbody>" +
      "<tr><td>Army figure</td><td>4</td><td>Needs an unbuilt army figure</td></tr>" +
      "<tr><td>Scout figure</td><td>6</td><td>Needs an unbuilt scout figure</td></tr>" +
      "<tr><td>Unit, rank 1</td><td>5</td><td>Artillery, infantry or mounted</td></tr>" +
      "<tr><td>Unit, rank 2</td><td>7</td><td>Price follows your military tech marker</td></tr>" +
      "<tr><td>Unit, rank 3</td><td>9</td><td></td></tr>" +
      "<tr><td>Unit, rank 4</td><td>11</td><td></td></tr>" +
      "<tr><td>Aircraft unit</td><td>12</td><td>Needs Flight. <b>Errata:</b> the cost is 12, as on the market board and reference sheet; original-printing Flight cards are wrong</td></tr>" +
      "<tr><td>Granary</td><td>5</td><td>Unlocked by Pottery</td></tr>" +
      "<tr><td>Aqueduct (upgraded Granary)</td><td>8</td><td>Unlocked by Engineering</td></tr>" +
      "<tr><td>Trading Post</td><td>7</td><td>Unlocked by Code of Laws (card shown Core p.21)</td></tr>" +
      "<tr><td>Market</td><td>7</td><td>Unlocked by Currency (card shown Core p.22)</td></tr>" +
      (c.has("ww") ? "<tr><td>Harbor</td><td>7</td><td>As shown on the Wisdom and Warfare market board overlay</td></tr>" +
        "<tr><td>Shipyard</td><td>5</td><td>Wisdom and Warfare overlay; unlocked by Navy (level I); water only; limited (star): one limited building per city</td></tr>" : "") +
      (c.mod("learn") ? "" : "<tr><td>Colossus (wonder)</td><td>15, or 10 with Metalworking</td><td>Each wonder card lists its own cost and discount tech</td></tr>") +
      "<tr><td>Rushing</td><td>3 trade → +1</td><td>One city, this turn only</td></tr>" +
      (c.has("ff") ? "<tr><td>Caravan marker</td><td>+2</td><td>Discard on a build action in that city</td></tr>" : "") +
      (c.has("ww") ? "<tr><td>Building program</td><td>× 2</td><td>Doubles the city’s outskirts production on its next produce action</td></tr>" : "") +
      "</tbody></table></div>" +
      "<p class=\"inline-note\">Other building costs are printed on the tech card that unlocks each building and on the market board; the rulebooks don’t reprint them.</p>",
    src: (c) => CV.joinSrc(["Core p.7, p.15–17, p.21–22", "FAQ p.1", c.has("ff") && "F&F p.8", c.has("ww") && "W&W p.3, p.7"])
  },
  {
    title: "Buildings, City Walls & Wonders",
    when: () => true,
    html: (c) => "<h4>Where buildings may go</h4><div class=\"tbl-wrap\"><table class=\"ref-tbl\"><thead><tr><th>Building (basic / upgraded)</th><th>Terrain allowed</th></tr></thead><tbody>" +
      "<tr><td>Harbor</td><td>Water</td></tr>" +
      (c.has("ww") ? "<tr><td>Shipyard (Wisdom and Warfare; not an upgraded Harbor)</td><td>Water only — <b>limited</b> (star on the marker; counts as the city’s one limited building)</td></tr>" : "") +
      "<tr><td>Trading Post</td><td>Desert</td></tr>" +
      "<tr><td>Workshop / Iron Mine</td><td>Mountain</td></tr>" +
      "<tr><td>Library / University</td><td>Grassland</td></tr>" +
      "<tr><td>Granary / Aqueduct</td><td>Grassland</td></tr>" +
      "<tr><td>Market / Bank</td><td rowspan=\"3\">Any terrain except water — <b>limited</b> (one per city)</td></tr>" +
      "<tr><td>Temple / Cathedral</td></tr>" +
      "<tr><td>Barracks / Academy</td></tr></tbody></table></div>" +
      "<ul><li>A building goes in the outskirts of the city that produced it. Any number of a non-limited type may go in one city, given suitable terrain.</li>" +
      "<li>A placed building’s icons <b>completely replace</b> the square’s icons (a Temple on a forest: two culture icons and no production).</li>" +
      "<li>A water square with a Harbor is <b>still water</b> for movement.</li>" +
      "<li><b>Limited buildings</b> (star in the corner): a city may hold only <b>one</b> limited building in total (a Market blocks a Temple there)." + (c.has("ww") ? " With Wisdom and Warfare the <b>Shipyard</b> is also limited (star on its marker), so a city with a Shipyard can’t also hold a Market/Bank, Temple/Cathedral or Barracks/Academy." : "") + "</li>" +
      "<li>Supply is limited to the markers; when all of a type are built, no more until one is destroyed.</li>" +
      "<li>Combat bonuses: <b>+2</b> per Barracks, <b>+4</b> per Academy you have built. Some buildings, e.g. Banks, give coins.</li>" +
      (c.has("ff") ? "<li><b>Basic building</b> (Fame and Fortune term): a building that is not upgraded — a Granary is basic, an Aqueduct is not.</li>" : "") +
      "</ul>" +
      "<h4>Upgrading buildings</h4><ul>" +
      "<li>Learning a tech that unlocks an upgraded building (arrow beside its name) <b>flips all your matching basic buildings</b> at once (Engineering turns Granaries into Aqueducts).</li>" +
      "<li>From then on you can only produce the upgraded, more expensive version (Aqueduct 8, not Granary 5).</li>" +
      "<li>You don’t need the basic building’s tech to learn the upgrade’s tech.</li></ul>" +
      "<h4>City Walls</h4><ul>" +
      "<li>Unlocked by <b>Masonry</b>. Treated like any other building but located in the <b>city center</b>: flip the city marker to its walled side. One per city.</li>" +
      "<li>Defending a walled city: <b>+4</b> combat bonus, and the <b>attacker must play the first unit</b>.</li></ul>" +
      (c.mod("learn") ? "<h4>Wonders</h4><p><b>Learning game:</b> wonders are not used.</p>" :
      "<h4>Wonders</h4><ul>" +
      "<li>Any player may use a city action to produce a <b>face-up wonder in the market</b>; the entire cost from one city (rushing, resource abilities and some culture events can boost it).</li>" +
      "<li>Place the card face up in front of you and the marker in that city’s outskirts. <b>Errata (FAQ):</b> then draw the next wonder from the deck into the market, with its marker.</li>" +
      "<li>Wonders go on any terrain except water, <b>one per city</b>; a city may hold one wonder <b>and</b> one limited building.</li>" +
      "<li>Wonders are <b>not buildings</b> — abilities that affect buildings don’t affect wonders unless they say so.</li>" +
      "<li><b>FAQ:</b> a wonder marker covers <b>every</b> icon of its square, like buildings and great people.</li>" +
      "<li>A blockaded wonder’s ability can’t be used and its culture isn’t collected.</li></ul>" +
      "<h4>Obsoleting wonders</h4><ul>" +
      "<li>Some techs (<b>Monarchy</b> and <b>Gunpowder</b>) let you obsolete a wonder: turn its card face down; its ability is gone for the rest of the game, but its marker <b>still produces culture</b>.</li>" +
      "<li><b>Errata (FAQ):</b> you may instead obsolete a wonder <b>still in the market</b>: discard it and its marker, then draw a replacement into the market.</li>" +
      (c.may("egypt") && c.mod("advegypt") ? "<li><b>Advanced Egypt:</b> the Egyptians’ wonders cannot be obsoleted.</li>" : "") +
      "</ul>" +
      (c.has("ff") ? "<h4>Wonder rulings (FAQ — Fame and Fortune section)</h4><ul>" +
        "<li><b>Angkor Wat:</b> its ability may have <b>any</b> city harvest two resources as its action.</li>" +
        "<li><b>Brandenburg Gate:</b> an enemy figure moving through its owner’s outskirts <b>can</b> be stopped there by abilities such as Communism, but must move out of those outskirts as soon as possible (unless it is blockading the Brandenburg Gate).</li>" +
        "<li><b>Brandenburg Gate:</b> enemy figures may move <b>through</b> its owner’s outskirts as long as they don’t end there. The owner’s cities can still be attacked (a city center is not part of its outskirts), but the enemy figure can’t attack other figures in those outskirts, since it would end its movement there.</li>" +
        "<li><b>Pyramids</b> obsoleted or blockaded: nothing happens if your current government is unlocked by normal means; otherwise you immediately enter <b>Anarchy</b>, and at the next Start of Turn may switch to any government unlocked by normal means (if the Pyramids are still obsoleted or blockaded).</li></ul>" : "")) +
      "<h4>Replacing buildings and wonders</h4><ul>" +
      "<li>You may place a new building or wonder over one of <b>your own</b> (either kind over either kind), if the new one is legal there once the old is removed.</li>" +
      "<li>A replaced building returns to the market; a replaced wonder’s card and marker go <b>back to the box</b> and can’t be rebuilt.</li>" +
      "<li>A replaced great person goes to reserve on your civilization sheet instead.</li></ul>",
    src: (c) => CV.joinSrc(["Core p.16–17, p.22–23, p.27", !c.mod("learn") && "FAQ p.1, p.4", c.has("ff") && !c.mod("learn") && "FAQ p.5–6", c.mod("advegypt") && "FAQ p.6", c.mod("learn") && "Core p.8", c.has("ff") && "F&F p.5", c.has("ww") && "W&W p.3"])
  },
  {
    title: "Culture Track, Culture Events & Great People",
    when: () => true,
    html: (c) => "<h4>Spending culture</h4><ul>" +
      "<li>At any point in your City Management Phase, spend culture tokens to move your culture level marker up the track.</li>" +
      "<li>Pay the cost printed on the market board for the space you are <b>entering</b>, move one space, then claim that space’s reward.</li>" +
      "<li>Higher up the track, a space costs <b>trade as well as culture</b>; pay both in full (trade from your dial).</li>" +
      "<li>Advance as many spaces per turn as you can afford; several markers may share a space.</li>" +
      (c.has("ff") ? "<li>" + CV.ic.w("culture-five", "Five-point culture token", "<b>Five-point culture tokens</b>") + " (Fame and Fortune) are in the culture pool, so large amounts are easy to collect.</li>" : "") +
      (c.mod("invest") ? "<li><b>Endowment for the Arts</b> investment (FAQ errata text): 1 marker: +1 culture hand size; 2 markers: +1 culture hand size and pay <b>1 less culture</b> to advance on the culture track; 4 markers: +1 culture hand size and pay <b>2 less culture</b>." + (c.has("ww") ? " (Use the Wisdom and Warfare replacement card.)" : "") + "</li>" : "") +
      (c.has("ww") ? "<li><b>Ark of the Covenant</b> relic: the player who removes it receives <b>two free advances</b> on the culture track.</li>" : "") +
      "</ul>" +
      "<h4>The three kinds of space</h4><ul class=\"aid-icons\">" +
      CV.ic.li("space-culture-event", "Culture event space", "draw a card from the culture event deck pictured on the space, in secret.") +
      CV.ic.li("space-great-person", "Great people space", (c.mod("gp") ? "gain a great person: with the great person deck, draw a <b>great person card</b> and take the matching face-up marker" : "draw a random great person marker from the face-down pile") + "; place it now or hold it in reserve.") +
      CV.ic.li("space-culture-victory", "Culture Victory space", c.mod("learn") ? "no winner in the learning game (it ends when someone builds a third city)." : c.mod("advtie") ? "you complete a culture victory: <b>Advanced Tiebreaker</b> — draw one culture event card from the third (modern) deck, the rest of the turn is played out, and Victory Scores decide among players who completed a non-military victory (see How to Win)." : "you win at once.") + "</ul>" +
      "<h4>Culture event cards</h4><ul>" +
      "<li>Each card has a title, a <b>timing</b> (the phase when it may be played) and an effect.</li>" +
      "<li><b>Culture hand size</b> starts at <b>2</b> and can be raised by tech (e.g. Pottery). Over the limit, discard down <b>immediately</b>, before any card can be played. You start with no cards.</li>" +
      "<li>Play a card only in the phase it names; resolve it, then discard it <b>face up to the bottom</b> of its deck. An exhausted deck is turned over and shuffled.</li>" +
      "<li><b>FAQ:</b> “Bread and Circuses” may cancel another “Bread and Circuses”, a “Jousting Tourney” or a “Primetime TV”; the two cancel each other and the original card resolves as if never cancelled.</li>" +
      "<li><b>FAQ:</b> “A Gift from Afar” or “Exchange of Ideas” can be cancelled with “Bread and Circuses” only by the player it directly targets.</li>" +
      "<li><b>FAQ:</b> “Drought”, “Deforestation” or “Flooding” may target a square with a hut, village or great person marker — put the disaster marker underneath it. (Disaster markers show grassland on one side and desert on the other" + (c.has("ff") ? "; Fame and Fortune’s show forest and water, for the “Flood” culture event and the Ecology tech" : "") + ".)</li>" +
      (c.has("ww") ? "<li><b>Two-phase cards</b> (Wisdom and Warfare): several new culture event cards have two effects, each tied to a different phase. Choose which phase you are playing the card in — you <b>cannot resolve both</b> effects.</li>" +
        "<li><b>“Roaming Horde”</b> (Wisdom and Warfare): makes barbarians attack another player’s army figure or city. The player who played it becomes the <b>barbarian player</b> and controls the barbarian units, which use <b>rank II</b> units instead of rank I. If the attacked player wins, they receive <b>no rewards</b>.</li>" : "") +
      "</ul>" +
      "<h4>Great people</h4><ul>" +
      "<li>Six kinds (18 markers):<p class=\"aid-icon-row\">" + CV.ic.pair("gp-artist", "Artist") + " " + CV.ic.pair("gp-builder", "Builder") + " " + CV.ic.pair("gp-general", "General") + " " + CV.ic.pair("gp-humanitarian", "Humanitarian") + " " + CV.ic.pair("gp-industrialist", "Industrialist") + " " + CV.ic.pair("gp-scientist", "Scientist") + "</p> Gained mainly from the culture track" + (c.may("america") ? ", from villages, and America’s starting bonus" : " and from villages") + ".</li>" +
      "<li>Work much like buildings: place immediately in the outskirts of any of your cities, on any terrain except water; on a building or wonder, it replaces it.</li>" +
      "<li>Or hold in <b>reserve</b> on your civilization sheet and place during any Start of Turn Phase. Great people off the map have no effect.</li>" +
      "<li>If a great person is replaced (by a building, wonder or another great person), it returns to <b>reserve</b> rather than being discarded.</li>" +
      "<li>Each " + CV.ic.w("gp-general", "Great General", "<b>Great General</b>") + " on the map gives <b>+4</b> combat bonus.</li>" +
      (c.mod("gp") ? "<li><b>Great person deck in use:</b> whenever you gain a great person, draw a <b>great person card</b> and take the matching marker (see Great Person Deck).</li>" : "") +
      (c.has("ff") ? "<li><b>School of Confucius</b> relic: the player who removes it gains <b>one</b> great person (FAQ errata — F&F printed two).</li>" : "") +
      "</ul>",
    src: (c) => CV.joinSrc(["Core p.5–6, p.17–18, p.20, p.23", "FAQ p.3", c.mod("learn") && "Core p.8", c.mod("advtie") && "FAQ p.6", c.has("ff") && "F&F p.4, p.9 · FAQ p.5", c.mod("invest") && "F&F p.13", c.mod("gp") && "F&F p.11–12", c.has("ww") && "W&W p.9, p.11"])
  },
  {
    title: "4. Movement — Figures, Water & Exploring",
    when: () => true,
    html: (c) => "<ul><li>In turn, move <b>each</b> of your figures one at a time, up to your <b>travel speed</b> (starts at <b>2</b>; raised by techs such as Horseback Riding" + (c.may("mongols") ? "; the Mongols’ starts at 3" : "") + "). <b>No diagonal moves.</b> Finish one figure’s move before starting another.</li>" +
      "<li><b>Groups:</b> figures that <b>begin</b> the Movement Phase in the same square may move together (extra strength in battle, scouts escorted) — or separately.</li>" +
      "<li><b>Stacking limit:</b> never more of your figures (armies and scouts combined) in one square than your stacking limit — starts at <b>2</b>; raised by techs such as Masonry" + (c.may("russia") ? "; Russia’s starts at 3" : "") + ".</li></ul>" +
      "<h4>Water</h4><ul>" +
      "<li>At the start, figures <b>cannot enter</b> water squares.</li>" +
      "<li><b>Navigation:</b> figures may cross water but may not <b>end</b> a move in water.</li>" +
      "<li>Higher techs such as <b>Sailing</b> let figures move through and end in water, and be placed in water when produced.</li>" +
      "<li><b>FAQ:</b> if an opponent stops your Navigation figure in water with the Communism tech’s resource ability, it stays there.</li></ul>" +
      "<h4>Unexplored map tiles</h4><ul>" +
      "<li>Face-down tiles effectively don’t exist: no figure may move onto or across them, and no tech or culture event can affect them.</li>" +
      "<li><b>Discover</b> a tile by spending <b>one square of movement</b> with a figure <b>orthogonally adjacent</b> to it: turn it face up, oriented so the " + CV.ic.w("map-entry-side", "Map tile entry side", "arrow at its edge") + " points <b>away from the tile the figure is on</b>.</li>" +
      "<li>Then draw a random <b>hut marker</b> for each " + CV.ic.w("map-hut", "Hut (peaceful)", "hut icon") + " and a random <b>village marker</b> for each " + CV.ic.w("map-village", "Village (aggressive)", "village icon") + " on the tile, and place them face down without looking.</li></ul>" +
      "<h4>Huts and villages</h4><ul>" +
      "<li><b>Scouts can’t enter</b> a hut or village square.</li>" +
      "<li>An <b>army</b> entering one must <b>stop</b> and explore it (see Huts, Villages & Barbarians).</li></ul>" +
      "<h4>Enemy figures</h4><ul>" +
      "<li>Scouts can’t enter a square with enemy figures.</li>" +
      "<li>An army entering a square with enemy figures <b>stops</b>:<ul>" +
        "<li>only enemy <b>scouts</b> there — they are killed and you collect loot as though you had won a battle;</li>" +
        "<li>at least one enemy <b>army</b> — a battle;</li>" +
        "<li>armies <b>and</b> scouts — a battle; the loser’s scouts there die with its armies.</li></ul></li>" +
      "<li>Scouts are killed immediately whenever an army attacks them, unless a friendly army escorts them.</li></ul>" +
      "<h4>Cities</h4><ul>" +
      "<li>Your figures may move <b>through</b> your own city centers but may not end there.</li>" +
      "<li>Scouts may enter enemy outskirts but <b>not enemy city centers</b>.</li>" +
      "<li>Armies may enter enemy outskirts; entering an enemy <b>city center</b> attacks the city.</li>" +
      (c.has("ff") ? "<li><b>Disbanding</b> (Fame and Fortune): you may move a figure into one of your own city centers and remove it from the board to <b>fortify</b> the city (army) or send a <b>caravan</b> (scout) — see Disbanding, Fortifying & Caravans. Figures may still move through friendly city centers without ending there.</li>" +
        "<li><b>Metropolis:</b> a metropolis that extends into water doesn’t count as water for movement — its owner can use it as a bridge.</li>" : "") +
      "</ul>" +
      ((c.has("ff") || c.has("ww")) ? "<h4>Relics</h4><ul>" +
        (c.has("ff") ? "<li>F&F p.9 says no <b>scout</b> may enter a relic square unless accompanied by one or more armies (not even under a <b>Republic</b>); <b>FAQ v2.0 (Fame and Fortune FAQ) answers that a scout may end its movement on a Fame and Fortune relic</b> (Atlantis, School of Confucius, Seven Cities of Gold), but it cannot take the relic marker — only armies claim relics.</li>" +
          (c.has("ww") ? "<li><b>Wisdom and Warfare’s relics</b> (Ark of the Covenant, Attila’s Village) follow W&W p.11: no <b>scout</b> may enter them unless accompanied by one or more armies (not even with the <b>Pacifism</b> social policy).</li>" : "") :
          "<li>No <b>scout</b> may enter a relic square unless accompanied by one or more armies (not even with the <b>Pacifism</b> social policy).</li>") +
        "<li>When one or more <b>armies end their movement</b> on a relic square, their owner removes the relic marker and gains its one-time ability (see Relics). Figures may move <b>through</b> a relic square without ending there.</li></ul>" : "") +
      (c.has("ww") ? "<h4>City-states (Wisdom and Warfare)</h4><ul>" +
        "<li>You <b>control</b> a city-state while you have a figure on its square; move away and you lose its bonuses (the city-state stays).</li>" +
        "<li>An army garrisoned there can be attacked; the garrison gets a <b>+4</b> defensive bonus. A scout there that is attacked is removed without a battle, as normal.</li></ul>" : "") +
      (c.p === 5 ? "<h4>Five-player map</h4><ul><li>The <b>hole in the center</b> of the map cannot be moved through in any way; it counts as adjacent to the map’s <b>inside</b> edge, not the outside.</li></ul>" : ""),
    src: (c) => CV.joinSrc(["Core p.7, p.15–16, p.19–20", "FAQ p.3", c.may("mongols") && "W&W p.5", c.has("ff") && "F&F p.8–10 · FAQ p.5", c.p === 5 && "F&F p.6", c.has("ww") && "W&W p.9–11"])
  },
  {
    title: "Huts, Villages & Barbarians",
    when: () => true,
    html: (c) => "<ul><li>Huts (peaceful) and villages (aggressive) are minor civilizations placed face down as tiles are discovered. Core game: <b>20 hut</b> and <b>10 village</b> markers" +
      (c.has("ff") || c.has("ww") ? "; " + [c.has("ff") && "Fame and Fortune adds 10 huts and 5 villages", c.has("ww") && "Wisdom and Warfare adds 5 huts and 5 villages"].filter(Boolean).join("; ") : "") + ".</li></ul>" +
      "<h4>Hut</h4><ul>" +
      "<li>" + CV.ic.w("hut-marker", "Hut marker") + " Peacefully absorbed: take the marker, look at it and keep it face down on your civilization sheet.</li>" +
      "<li>Its back shows a resource" + (c.has("ff") || c.has("ww") ? " (or one of the new effects below)" : "") + "; spend it like a market resource token, but it goes <b>back to the box</b> when spent, not to the market.</li></ul>" +
      "<h4>Village — fight the barbarians</h4><ol>" +
      "<li>The player to the <b>invader’s left</b> becomes the <b>barbarian player</b> and draws <b>one artillery, one infantry and one mounted</b> unit (if a deck runs out, they make up the difference from another deck of their choice). Keep these barbarians separate from their own units.</li>" +
      "<li>Battle: the barbarian player <b>defends</b> using only the barbarian units, which are always <b>rank 1</b> (Archer, Spearman, Horseman).</li>" +
      "<li><b>Invader wins:</b> take the " + CV.ic.w("village-marker", "Village marker", "village marker") + " and look at it. A " + CV.ic.w("village-great-person", "Great person village", "<b>great person</b> icon") + ": discard the marker and gain a " + (c.mod("gp") ? "great person (draw a great person card)" : "random great person") + ". Otherwise it shows a <b>resource</b>: keep it face down — it works like a hut marker" + (c.has("ff") || c.has("ww") ? " (or one of the new effects below)" : "") + ".</li>" +
      "<li><b>Invader loses:</b> the army (or the whole group that entered) is killed and returned to your sheet — no other penalty.</li></ol>" +
      "<h4>Notes</h4><ul><li>" + CV.ic.w("spy", "Spy", "<b>Spies</b>") + " come from huts and villages; " + CV.ic.w("uranium", "Uranium", "<b>uranium</b>") + " only from villages, and only rarely.</li>" +
      "<li><b>Tip (rulebook):</b> attack barbarians with an advantage — extra or upgraded units, a group of armies, or a trick such as Metalworking plus an iron token.</li>" +
      (c.has("ww") ? "<li><b>Roaming Horde</b> culture event (Wisdom and Warfare): barbarians attack another player’s army or city, run by the player who played the card, with <b>rank II</b> units; the attacked player gets no rewards for winning.</li>" : "") +
      "</ul>" +
      (c.has("ff") ? "<h4>New hut and village effects (Fame and Fortune)</h4>" +
        "<p class=\"inline-note\">New huts: 2 Friendly Barbarian, 1 Native Art, 1 Teacher and 6 resources (1 incense, 1 iron, 1 silk, 1 spy, 2 wheat). New villages: 1 Friendly Workers, 1 Native Art, 1 Wealth and 2 resources (1 spy, 1 uranium).</p><ul class=\"aid-icons\">" +
        CV.ic.li("ff-friendly-barbarian", "Friendly Barbarian", "immediately reveal and discard it, then either build one <b>unlocked unit for free</b> (add it to your standing forces) or build a <b>figure for free</b> and place it in the square where the marker was (within your stacking limit). <b>FAQ:</b> a figure gained this way can’t move until the next turn.") +
        CV.ic.li("ff-friendly-workers", "Friendly Workers", "reveal and discard it during City Management to have one of your cities produce <b>4 extra production</b> that turn.") +
        CV.ic.li("ff-native-art", "Native Art", "immediately reveal and discard it, then gain <b>3 or 6 culture tokens</b>, as shown on the marker.") +
        CV.ic.li("ff-teacher", "Teacher", "keep it. Reveal and discard it during the Start of Turn Phase to <b>learn a level I tech for free</b>.") +
        CV.ic.li("ff-wealth", "Wealth", "immediately reveal and discard it, then gain <b>one coin token</b> on your civilization sheet.") + "</ul>" : "") +
      (c.has("ww") ? "<h4>New hut and village effects (Wisdom and Warfare)</h4><ul class=\"aid-icons\">" +
        CV.ic.li("ww-city-state", "City-state", "draw the top city-state marker and place it on the square the hut or village was on (see City-States).") +
        CV.ic.li("ww-wealth", "Wealth", "immediately reveal and discard it, then gain <b>one coin token</b> on your civilization sheet.") + "</ul>" +
        "<p class=\"inline-note\">Wisdom and Warfare’s 5 huts and 5 villages carry these two effects; the book doesn’t say how they are split between huts and villages.</p>" : ""),
    src: (c) => CV.joinSrc(["Core p.3, p.6, p.19–20, p.23", c.has("ff") && "F&F p.2, p.8, p.16 · FAQ p.5", c.mod("gp") && "F&F p.11", c.has("ww") && "W&W p.2, p.9, p.12"])
  },
  {
    title: "5. Research — Trade Cost & the Tech Pyramid",
    when: () => true,
    html: (c) => "<p>Every player researches at the same time; each may learn <b>one</b> tech. Choose a card, place it <b>face down</b> in your pyramid, then everyone reveals together. A tech applies only to the player who learned it.</p>" +
      "<h4>Minimum trade to research</h4><div class=\"tbl-wrap\"><table class=\"ref-tbl\"><thead><tr><th>Tech level</th><th>I</th><th>II</th><th>III</th><th>IV</th><th>V</th></tr></thead><tbody>" +
      "<tr><td>Trade needed (marked on the dial)</td><td>6</td><td>11</td><td>16</td><td>21</td><td>26</td></tr></tbody></table></div>" +
      "<ul><li>Researching spends <b>all</b> your trade, however much you had — except that you <b>keep 1 trade per coin</b> you have. Coins never add trade.</li>" +
      "<li>Example: 18 trade, level II tech → dial to 0; with 4 coins you keep 4.</li>" +
      "<li><b>FAQ:</b> a coin icon on the tech you are researching counts when you reduce your trade dial.</li>" +
      "<li><b>FAQ:</b> the Porcelain Tower’s owner needs <b>5 less trade</b> to research (level I with 1+, level II with 6+, and so on).</li></ul>" +
      "<h4>The tech pyramid</h4><ul>" +
      "<li><b>Level I</b> techs may always be placed: they form the bottom row (with your starting tech, whatever its level).</li>" +
      "<li>Each <b>level II</b> tech must sit above <b>two level I</b> techs; each level III above two level II; and so on up to level V.</li>" +
      "<li><b>Space Flight</b> is the only level V tech and wins the game: at least 5 level I, 4 level II, 3 level III and 2 level IV techs first (15 techs in all).</li></ul>" +
      ((c.has("ff") || c.has("ww")) ? "<h4>Other ways to gain techs (expansions)</h4><ul>" +
        (c.has("ff") ? "<li><b>Teacher</b> hut: discard at Start of Turn to learn a level I tech for free.</li>" +
          "<li><b>Atlantis</b> relic: learn a free tech of your choice at the start of the next turn.</li>" : "") +
        (c.has("ww") ? "<li>Some <b>social policies</b> trade trade for techs — e.g. Rationalism: at Start of Turn, spend 6 trade to learn a level I tech; spend 11 trade to learn a level II tech.</li>" : "") +
        "<li>A tech gained this way still needs a <b>legal space</b> in your pyramid.</li>" +
        (c.mod("gp") ? "<li><b>FAQ — researching vs. learning:</b> researching happens only in the Research Phase by spending trade. Learning a tech through a culture card or investments (e.g. Public Education) is not researching, so “Archimedes” gives no culture for it.</li>" : "") +
        "</ul>" : ""),
    src: (c) => CV.joinSrc(["Core p.11, p.20–22 · FAQ p.3–4", c.has("ff") && "F&F p.8–9", c.mod("gp") && "FAQ p.5", c.has("ww") && "W&W p.10"])
  },
  {
    title: "Tech Card Abilities & Icons",
    when: () => true,
    html: "<p>A tech card has a name, an icon, a level and one to three abilities. The back cover summarises the icons:</p><ul class=\"aid-icons ic-lg\">" +
      CV.ic.li("tech-unlock-building", "Unlock Building", "you may build the pictured building for the listed production cost.") +
      CV.ic.li("tech-upgrade-building", "Upgrade Building", "grey arrow left of the building’s name: build it for the listed cost, and all your buildings of that type (see market board) upgrade to it.") +
      CV.ic.li("tech-unlock-government", "Unlock Government", "you may change to that government: free on the turn after unlocking it, otherwise via Anarchy.") +
      CV.ic.li("tech-upgrade-unit", "Upgrade Unit", "all unit cards of the shown type go to the listed rank. Units never decrease in rank, and ranks may be skipped.") +
      CV.ic.li("tech-culture-hand", "Increase Culture Hand Size", "+1 culture hand size; several such techs add up.") +
      CV.ic.li("tech-gain-coin", "Gain Coin", "you gain one coin when you learn the tech.") +
      CV.ic.li("tech-constant", "Constant Ability", "a permanent ability, usable as often as you like unless stated otherwise.") +
      CV.ic.li("tech-resource", "Resource Ability", "spend the pictured resource to use the ability in the stated phase. <b>Each resource ability only once per turn</b>, however many tokens you have (but Currency and Chivalry, say, may each be used once).") +
      "</ul>" +
      "<p>Resources that may appear on a tech card:</p>" +
      "<p class=\"aid-icon-row\">" + CV.ic.pair("incense", "Incense") + " " + CV.ic.pair("iron", "Iron") + " " + CV.ic.pair("silk", "Silk") + " " + CV.ic.pair("spy", "Spy") + " " + CV.ic.pair("uranium", "Uranium") + " " + CV.ic.pair("wheat", "Wheat") + " " + CV.ic.pair("any-resource", "Any resource") + "</p>" +
      "<ul><li>The <b>?</b> icon means any resource of the player’s choice.</li></ul>" +
      "<h4>Unlocking and upgrading</h4><ul>" +
      "<li>At the start all figures, the three basic unit types (artillery, infantry, mounted) and Despotism are unlocked; everything else needs a tech.</li>" +
      "<li><b>Upgrading units:</b> unless you already have a better rank of that type, place or flip your military tech marker below that unit deck (rank 2 is the back of the rank 1 marker; rank 3 and starred rank 4 share a second marker).</li>" +
      "<li>All your units of that type upgrade immediately; new ones cost the new, higher price (Knights cost 7, not 5).</li></ul>",
    src: "Core p.20–22, p.32"
  },
  {
    title: "Techs Shown or Named in the Rulebooks",
    when: () => true,
    html: (c) => "<p>The rulebooks don’t list every tech. These are the ones whose effects they show or describe; read the rest from the cards.</p><ul>" +
      "<li><b>Pottery</b> (I) — unlocks Granary (5); +1 culture hand size; a City Management resource ability, shown with two “?” (any resource) icons: add 1 coin token to this tech (max 4).</li>" +
      "<li><b>Code of Laws</b> (I) — unlocks Republic and the Trading Post (7); once per turn, after you win a battle, add 1 coin token to this tech (max 4).</li>" +
      "<li><b>Currency</b> (I) — unlocks the Market (7); City Management: spend 1 incense to gain 3 culture.</li>" +
      "<li><b>Chivalry</b> (II) — unlocks Feudalism; mounted units to rank 2 (Knights); City Management resource ability: gain 5 culture.</li>" +
      "<li><b>Engineering</b> (II) — unlocks the Aqueduct (8, upgrades Granaries); once per turn, when spending a city’s production, split it to buy two items instead of one.</li>" +
      "<li><b>Masonry</b> — City Walls; raises the stacking limit.</li>" +
      "<li><b>Irrigation</b> — your third city marker (maximum three cities).</li>" +
      "<li><b>Horseback Riding</b> — raises travel speed" + (c.has("ww") ? " to <b>3</b> (W&W p.5, Mongols)" : "") + "; has a trade-producing ability.</li>" +
      "<li><b>Navigation</b> — figures cross water but can’t end there. <b>Sailing</b>, <b>Steam Power</b>, <b>Flight</b> — figures may end in water (Sailing also raises travel speed).</li>" +
      "<li><b>Flight</b> — unlocks aircraft (cost 12 — errata).</li>" +
      "<li><b>Monarchy</b>, <b>Gunpowder</b> — obsolete a wonder; Gunpowder upgrades units.</li>" +
      "<li><b>Biology</b> — raises the stacking limit; a once-per-battle ability. <b>Animal Husbandry</b> — a once-per-battle ability. (FAQ: usable in each battle, never twice in one.)</li>" +
      "<li><b>Metalworking</b> — battle resource ability (the rulebook pairs it with an iron token): FAQ — used before playing a unit, that unit deals 3 extra wounds to the enemy unit in its front, and the boost lasts the whole battle. Also the Colossus’s discount tech.</li>" +
      "<li><b>Mathematics</b> — a battle resource ability (once per turn, even over several battles — FAQ)" + (c.has("ff") ? "; upgrades <b>artillery</b> to rank 2 (F&F p.6, Arabia)" : "") + ".</li>" +
      "<li><b>Theology</b> — unlocks a culture-producing building.</li>" +
      "<li><b>Printing Press</b>, <b>Democracy</b> — coin tokens for completing tasks. (FAQ: “(max 4)” on techs such as Democracy, Code of Laws or Pottery means at most four coin tokens on the card at once.)" + (c.has("ff") ? " F&F p.6: due to Democracy, Greece’s <b>infantry</b> starts the game at rank 2." : "") + "</li>" +
      "<li><b>Computers</b> — an ability based on how many coins you have.</li>" +
      "<li><b>Writing</b> — resource ability that cancels <b>city actions only</b> (FAQ); the cancelled player gets back resources, trade and any culture card spent, but that city takes no other action.</li>" +
      "<li><b>Mass Media</b> — cancels a resource ability; the cancelled ability still counts as used this turn (FAQ). It can’t target a United Nations owner (FAQ).</li>" +
      "<li><b>Communism</b> (tech) — resource ability that stops a figure’s movement; may stop your own army (FAQ).</li>" +
      "<li><b>Atomic Theory</b> — uranium abilities: an extra City Management action with all your cities (icons may be reused — FAQ), and destroying a city (allowed under Democracy — FAQ). With two uranium both can be used in one turn.</li>" +
      "<li><b>Combustion</b> — destroys buildings, but only after you win the battle there (FAQ).</li>" +
      "<li><b>Railroad</b> — <b>Errata:</b> the card should have a coin icon. <b>Metal Casting</b> — <b>Errata:</b> the card should not have a coin icon." + (c.has("ww") ? " (Wisdom and Warfare replaces both cards.)" : "") + "</li>" +
      "<li><b>Space Flight</b> (V) — wins the game; only one copy.</li></ul>" +
      (c.has("ff") ? "<h4>Techs named in Fame and Fortune (it adds 4 new tech cards per player)</h4><ul>" +
        "<li><b>Agriculture</b> — introduced by this expansion: your capital grows into a <b>metropolis</b> (see Metropolises).</li>" +
        "<li><b>Ecology</b> — its effects are shown with the new forest/water disaster markers.</li>" +
        "<li><b>Flight</b> — Fame and Fortune includes replacement Flight cards for the early-printing ones.</li></ul>" : "") +
      (c.has("ww") ? "<h4>Techs named in Wisdom and Warfare (4 new per player, plus replacement Metal Casting and Railroad)</h4><ul>" +
        "<li><b>Navy</b> (level I) — unlocks the <b>Shipyard</b> building.</li>" +
        "<li><b>Bureaucracy</b> (level II) — lets you <b>switch</b> a currently adopted social policy (see Social Policies).</li></ul>" : "") +
      ((c.has("ff") || c.has("ww")) ? "<p class=\"inline-note\">Of the techs above, the rulebooks call only " + [c.has("ff") && "Agriculture (F&F p.10)", c.has("ww") && "Navy (W&W p.3) and Bureaucracy (W&W p.10)"].filter(Boolean).join(", ") + " new" + (c.has("ff") ? "; Flight is a core tech whose early-printing cards Fame and Fortune replaces (F&F p.3)" : "") + ". Read the other new tech cards from the cards.</p>" : ""),
    src: (c) => CV.joinSrc(["Core p.5, p.12–23, p.25–27 · FAQ p.1–4", c.has("ff") && "F&F p.3–6, p.10", c.has("ww") && "W&W p.3–5, p.10"])
  },
  {
    title: "Combat — Step by Step",
    when: () => true,
    html: (c) => "<p>A battle happens when an army enters a square with a <b>village</b>, an <b>enemy army</b> or an <b>enemy city</b>. The mover is the <b>attacker</b>; against a village, the player to the attacker’s left defends with barbarians.</p>" +
      "<p class=\"callout\"><b>Armies vs. units:</b> armies are the plastic figures that move on the map; <b>units</b> are the square cards that fight. You need both — an army with no units is extremely unlikely to win, and units can’t act outside your cities without an army.</p>" +
      "<h4>1. Assemble the battle force</h4><ul>" +
      "<li>Each side shuffles its standing forces and draws <b>battle hand size</b> cards at random. Base hand size <b>3</b>, plus:<ul>" +
        "<li><b>+2</b> for each friendly army in the square beyond the first;</li>" +
        "<li><b>+1</b> if governed by <b>Fundamentalism</b>;</li>" +
        "<li><b>+3</b> if defending a city or capital.</li></ul></li>" +
      "<li>Use only the side of each unit card matching your rank for that type (" + (c.has("ww") ? "each Wisdom and Warfare card has four sides, one per military rank" : "1, 2, 3 stripes; star = rank 4") + "). Keep your hand secret.</li>" +
      (c.has("ww")
        ? "<li><b>Wisdom and Warfare units:</b> each side shows a <b>strength</b> (how many wounds the unit deals when it attacks) and a <b>health</b> (how many wounds it can take before it is killed). Card anatomy (W&W p.8): strength top left, health top right, trump symbol, unit name, military rank, unit type. Example card: Horseman 2/2, Knight 3/3, Cavalry 4/4, Tank 5/5 (strength/health).</li>"
        : "<li>Rank 1 units have strength 1–3 (average 2), +1 per rank up to rank 4. Keep enough units to fill your hand — but too many dilutes the ones you want.</li>") +
      "</ul>" +
      "<h4>2. Combat bonuses</h4><ul>" +
      "<li><b>+2</b> per Barracks you have built; <b>+4</b> per Academy; <b>+4</b> per " + CV.ic.w("gp-general", "Great General", "Great General") + " on the map.</li>" +
      "<li>Defending a " + CV.ic.w("city-city", "City marker, +6", "<b>non-capital city +6</b>") + "; a " + CV.ic.w("city-capital", "Capital marker, +12", "<b>capital +12</b>") + "; a <b>walled</b> city or capital <b>+4 more</b> (stacks).</li>" +
      (c.has("ff") ? "<li><b>Fame and Fortune:</b> defending a <b>fortified</b> city <b>+2 more</b>; defending a <b>metropolis +2 more</b> (on top of the capital’s +12).</li>" : "") +
      (c.has("ww") ? "<li><b>Wisdom and Warfare:</b> an army garrisoned in a <b>city-state</b> gets a <b>+4</b> defensive bonus when attacked.</li>" : "") +
      (c.mod("invest") ? "<li><b>Investments</b> can add combat bonuses — e.g. “Military-Industrial Complex”: +4 with 2 markers, +8 with 4 (only the highest active ability counts).</li>" : "") +
      (c.mod("gp") ? "<li><b>“Leonidas”</b> (FAQ errata text): <i>Battle:</i> each time you are the defender in a battle with fewer units in your battle force than your opponent, your combat bonus is increased by 8 until the end of the battle." + (c.has("ww") ? " (Use the Wisdom and Warfare replacement card.)" : "") + "</li>" : "") +
      "<li>The side with the higher total takes a combat bonus card set to the <b>difference</b> (+12 vs +8 → +4). Rule of thumb: +4 ≈ one unit.</li>" +
      (c.has("ff") ? "<li>Fame and Fortune’s <b>military reference card</b> lists the hand size and combat bonus modifiers.</li>" : "") +
      "<li><b>FAQ:</b> a scout gathering a Barracks, Academy or General square can’t send its combat bonus home. An army that leaves a blockaded Barracks square to attack the city center un-blockades it — the defender gets the Barracks bonus.</li></ul>" +
      "<h4>3. Engage in battle</h4><ul>" +
      "<li>Players alternate <b>battle turns</b>, starting with the <b>defender</b> — except against a <b>walled city</b>, where the <b>attacker plays first</b>.</li>" +
      "<li><b>Battle turn (FAQ errata):</b> 1. opportunity to use an ability; 2. play a unit; 3. opportunity to use an ability; 4. turn ends. Only the player taking their battle turn may use abilities or play units. After playing your last unit you take no more battle turns. You may still use tech resource abilities on your turn with no units left (FAQ).</li>" +
      "<li>Each unit played either <b>starts a new front</b> or <b>attacks an existing enemy front</b>. A front never holds more than one unit per side.</li>" +
      (c.has("ww")
        ? "<li><b>Engaged units (Wisdom and Warfare):</b> you can’t attack a front that already has <b>two units engaged</b> on it. If every front is engaged from both sides, you must start a new front.</li>" +
          "<li><b>Attacking a front:</b> the two units deal wounds equal to their <b>strength</b> to each other. A unit that has suffered wounds equal to its <b>health</b> is killed at once — return it face up to the bottom of the unit deck it came from. Survivors keep their wound tokens. A wounded unit still deals its full strength. <i>Example (W&W p.8):</i> a Rifleman (strength 3, health 5) attacks a Pikeman (3/3): the Pikeman dies, the Rifleman takes 3 wounds.</li>"
        : "<li><b>Attacking a front:</b> the two units deal wounds equal to their <b>strength</b> to each other. A unit with wounds equal to its strength dies (face up to the bottom of its deck); survivors keep wound tokens until the battle ends. A wounded unit still deals its full strength.</li>") +
      "<li><b>Trumps:</b> <b>infantry trumps mounted</b>, <b>mounted trumps artillery</b>, <b>artillery trumps infantry</b>. A unit that trumps the unit it attacks or is attacked by deals its damage <b>first</b>; if that kills, the trumped unit deals nothing." + (c.has("ww") ? " (Each Wisdom and Warfare card side shows a trump symbol.)" : "") + "</li>" +
      "<li><b>Aircraft</b> (Flight" + (c.has("ww") ? "" : "; strength 5–7") + ") can’t trump or be trumped.</li>" +
      "<li><b>Battle abilities</b> (tech resource abilities) are used before or after attacking a front, never during. <b>FAQ:</b> you can heal a unit only on your own battle turn.</li></ul>" +
      "<h4>4. Resolve the battle</h4><ul>" +
      (c.has("ww")
        ? "<li><b>Wisdom and Warfare:</b> once both players have played all their battle forces, the battle is over. <b>Before removing wound tokens</b>, each side adds up the <b>health</b> of all its surviving units, <b>subtracts</b> the total wounds on them, and adds its combat bonus card (if it has it). <b>Highest total wins; ties go to the defender.</b></li>" +
          "<li><i>Example (W&W p.9):</i> Player A: surviving health 10 − 7 wounds + a +2 combat bonus card (Great General +4 vs Player B’s Barracks +2) = 5; Player B: health 4 − 3 wounds = 1. Player A wins.</li>"
        : "<li>Remove all wounds from survivors. Each side totals the <b>strength of its surviving units</b> plus its combat bonus card. <b>Highest total wins; ties go to the defender.</b></li>") +
      "<li><b>FAQ:</b> a side with no units in the battle can still win on its combat bonus.</li>" +
      "<li>The <b>winner</b> loses one army figure in the square for every <b>two</b> of its units killed — but never its last army there.</li>" +
      (c.has("ff") ? "<li><b>Fortified city</b> (Fame and Fortune): if it successfully defends itself, its fortification marker is discarded.</li>" : "") +
      "<li>Then loot (next section). If the game goes on, surviving units return to their owners’ standing forces; killed units go face up to the bottom of their decks (reshuffle when you reach them).</li></ul>",
    src: (c) => CV.joinSrc(["Core p.4–5, p.16, p.20, p.23–26", "FAQ p.1–2, p.4", c.has("ff") && "F&F p.3, p.8, p.10", c.mod("gp") && "FAQ p.5", c.mod("gp") && c.has("ww") && "W&W p.3–4", c.mod("invest") && "F&F p.13", c.has("ww") && "W&W p.8–10"])
  },
  {
    title: "After the Battle — Losses & Loot (FAQ errata)",
    when: () => true,
    html: (c) => "<p class=\"callout\"><b>Errata:</b> the FAQ v2.0 loot system <b>replaces</b> the core rulebook’s “Winner’s Loot” choices (Core p.25). The loser’s losses stay the same.</p>" +
      "<h4>What the loser loses</h4><ul>" +
      "<li><b>Figures in the square:</b> all the loser’s figures there are killed (they can be built again later).</li>" +
      "<li><b>Defending a non-capital city:</b> the city is destroyed — its marker returns to its owner’s sheet, its buildings return to the market, and its wonders and great people go to the box, out of the game. The winner’s figures stay in the city-center square.</li>" +
      "<li><b>Defending their capital:</b> the winner wins the game with a <b>military victory</b>.</li></ul>" +
      "<h4>Loot the winner gains</h4><ul>" +
      "<li>Loser had one or more figures in the square: <b>1 loot</b>.</li>" +
      "<li>Loser was defending a non-capital city: <b>2 loot</b>.</li></ul>" +
      "<p>Spend loot immediately; buy as many effects as you can afford, repeats allowed (2 loot = one 2-loot effect, two different 1-loot effects, or one 1-loot effect twice).</p>" +
      "<div class=\"tbl-wrap\"><table class=\"ref-tbl\"><thead><tr><th>Cost</th><th>Effect</th></tr></thead><tbody>" +
      "<tr><td>1 loot</td><td>Steal up to 3 points of trade from the loser’s trade dial</td></tr>" +
      "<tr><td>1 loot</td><td>Steal up to 3 culture tokens from the loser</td></tr>" +
      "<tr><td>1 loot</td><td>Steal any one resource token (face-down hut and village tokens may be chosen, unseen)</td></tr>" +
      "<tr><td>1 loot</td><td>Force the loser to discard a coin token of the winner’s choice</td></tr>" +
      "<tr><td>2 loot</td><td>Learn one of the loser’s techs you don’t know, without paying trade (you need a legal pyramid space)</td></tr>" +
      "<tr><td>2 loot</td><td>Steal one of the loser’s culture event cards (choosing by card backs only)</td></tr>" +
      "<tr><td>2 loot</td><td>Steal one of the loser’s coin tokens and place it on your civilization sheet</td></tr></tbody></table></div>" +
      "<ul><li>An army that moves onto <b>only enemy scouts</b> kills them and collects loot as though it had won a battle (the “figures in the square” case).</li>" +
      "<li>Beating barbarians in a village gives the village marker instead (no loot); losing to them costs only the army or group.</li>" +
      "<li><b>Tip:</b> the first player to conquer a capital wins — don’t weaken a rival too much while other armies are near their capital.</li>" +
      (c.mod("invest") ? "<li><b>Investments:</b> the two coin-token loot effects <b>cannot affect investments</b> (Fame and Fortune’s wording of the table).</li>" : "") +
      (c.has("ww") ? "<li><b>Roaming Horde:</b> a player who beats barbarians sent by this culture event receives <b>no rewards</b>.</li>" : "") +
      (c.has("ff") || c.has("ww") ? "<li>" + [c.has("ff") && "Fame and Fortune (p.7)", c.has("ww") && "Wisdom and Warfare (p.6)"].filter(Boolean).join(" and ") + " reprint" + (c.has("ff") && c.has("ww") ? "" : "s") + " this same loot table.</li>" : "") +
      "</ul>",
    src: (c) => CV.joinSrc(["FAQ p.1", "Core p.20, p.25", c.has("ff") && "F&F p.7" + (c.mod("invest") ? ", p.13" : ""), c.has("ww") && "W&W p.6, p.9"])
  },
  {
    title: "Coins & the Economy",
    when: () => true,
    html: (c) => "<ul><li>" + CV.ic.w("coin", "Coin", "Coins") + " come <b>printed</b> on building markers, map squares and some tech cards" + (c.has("ww") ? "" : " (<b>FAQ errata:</b> Railroad should show a coin; Metal Casting should not), and on the <b>Feudalism</b> government card (kept only while you are ruled by Feudalism)") + ", or as <b>coin tokens</b> placed on tech cards (e.g. Code of Laws) for completing tasks" + (c.has("ff") || c.has("ww") ? " — the <b>Wealth</b> hut/village marker gives a coin token on your civilization sheet" : "") + ".</li>" +
      "<li>Gaining a coin advances your economy dial; losing one turns it back.</li></ul>" +
      "<h4>What coins do</h4><ul>" +
      "<li>When you <b>research</b>, keep 1 trade per coin. Coins protect trade <b>only</b> when researching — not when rushing production or losing trade in battle — and never add trade.</li>" +
      (c.mod("learn") ? "<li><b>15 coins</b> would be an economic victory in a full game — the learning game has no winner.</li>" : "<li><b>15 coins</b> = " + (c.mod("advtie") ? "economic victory; with the <b>Advanced Tiebreaker</b> the rest of the turn is played out, then Victory Score decides (FAQ p.6)." : "immediate economic victory.") + "</li>") +
      "<li>Some techs (e.g. Computers) give abilities based on your coins.</li></ul>" +
      "<h4>Coins on the map</h4><ul>" +
      "<li>Kept only while you control the square — in one of your cities’ outskirts, or gathered by your scout.</li>" +
      "<li>Lost while an enemy figure blockades the square, and lost if the building that grants it is destroyed.</li></ul>" +
      "<h4>Coin tokens</h4><ul>" +
      "<li>Like map coins, but a task’s card can hold only a limited number of coin tokens. <b>FAQ:</b> “(max 4)” means at most four coin tokens on that card <b>at one time</b>; if one is removed, the task can refill it.</li>" +
      "<li>The core rulebook says coin tokens “cannot be lost”; <b>FAQ v2.0 loot</b> lets a battle winner force the loser to discard one, or steal one. The FAQ is newer and wins.</li>" +
      (c.mod("learn") ? "" : "<li><b>FAQ:</b> the Panama Canal’s coin tokens go on its card; they can’t be gathered by an enemy scout or stolen, and don’t count on your dial or toward economic victory while the wonder is blockaded.</li>") +
      (c.has("ff") ? "<li><b>FAQ errata:</b> the <b>Seven Cities of Gold</b> relic square should show <b>2 production and 1 coin</b>.</li>" : "") +
      "</ul>" +
      (c.mod("invest") ? "<h4>Investing coins (Fame and Fortune)</h4><ul>" +
        "<li>Only <b>coin tokens</b> may be invested — never coins printed on the map, tech cards or buildings.</li>" +
        "<li>Investing lowers your coins by one; investments <b>don’t count</b> toward the 15 coins of an economic victory, but other players can’t make you discard them (see Investment Deck).</li></ul>" : ""),
    src: (c) => CV.joinSrc(["Core p.6–7" + (c.has("ww") ? "" : ", p.14") + ", p.22, p.26 · FAQ p.1–4", c.mod("learn") && "Core p.8", c.mod("advtie") && !c.mod("learn") && "FAQ p.6", c.has("ff") && "F&F p.8" + (c.mod("invest") ? ", p.13" : "") + " · FAQ p.5", c.has("ww") && "W&W p.12"])
  },
  {
    title: "Scouts — Gathering & Blockades",
    when: () => true,
    html: (c) => "<h4>Scout gathering</h4><ul>" +
      "<li>Each turn, starting the turn <b>after</b> it was placed, a scout gathers the contents of its square.</li>" +
      "<li>During Start of Turn, declare which of your cities the scout is <b>sending</b> the square to. All its icons — trade, production, culture, coins and resources — count as part of that city’s outskirts for the rest of the turn.</li>" +
      "<li><b>FAQ:</b> a scout may gather from a square in another city’s outskirts, even one with a building or wonder; the original city then can’t use those icons.</li>" +
      "<li><b>FAQ:</b> scouts send everything home <b>except combat bonuses</b>.</li></ul>" +
      "<h4>Blockades</h4><ul>" +
      "<li>An outskirts square holding one or more <b>enemy figures</b> (scouts or armies) gives its owner no production, trade, culture, coins or resources — even with a building or great person on it.</li>" +
      "<li>A blockaded <b>wonder</b>: its card ability can’t be used and its marker’s culture isn’t collected.</li>" +
      "<li>Buildings, wonders, great people and scouts <b>can’t be placed</b> in a blockaded square. An army <b>can</b> be placed there, which starts a battle at once with the blockader defending (FAQ: also when it is produced by a city action).</li>" +
      "<li>An enemy scout may gather a blockaded square for <b>its own</b> city (e.g. a forest: +2 production to the scout’s city, −2 to the blockaded city).</li>" +
      (c.mod("gp") ? "<li><b>FAQ — blockaded great people:</b> you can use a great person card’s ability only if you have at least one <b>unblockaded</b> great person marker of that type; while all of them are blockaded, the card can’t be used.</li>" : "") +
      (c.has("ww") ? "<li><b>City-states:</b> a city-state you control counts as part of your <b>capital’s outskirts</b> (see City-States).</li>" : "") +
      "</ul>",
    src: (c) => CV.joinSrc(["Core p.26–27 · FAQ p.2", c.mod("gp") && "FAQ p.5", c.has("ww") && "W&W p.9"])
  },
  {
    title: "Governments",
    when: () => true,
    html: (c) => {
      const starts = [c.may("rome") && "Rome with Republic", c.may("russia") && "Russia with Communism", c.may("greece") && "Greece with Democracy", c.may("japanese") && "the Japanese with Feudalism"].filter(Boolean);
      return "<p>Each double-sided government card shows one government per side. Your civilization sheet shows your starting government. Only Despotism is unlocked at the start; the rest are unlocked by techs (see Start of Turn for changing)." +
      (starts.length ? " Exceptions — starting with another government unlocked and in play: " + starts.join("; ") + "." : "") + "</p>" +
      (c.has("ww") ? "<p class=\"callout\"><b>Wisdom and Warfare</b> replaces <b>all</b> government cards with its own set (4 per player, marked R). Read your governments from those cards; social policies (below) add to them.</p>" : "") +
      "<ul>" +
      "<li><b>Despotism</b> — the usual starting government (on the Despotism/Republic card).</li>" +
      "<li><b>Republic</b> — has ongoing abilities while you are ruled by it; unlocked by Code of Laws." + (c.may("rome") ? " Rome starts with it." : "") + "</li>" +
      "<li><b>Democracy</b> — a government (FAQ p.3 rules on play “under Democracy”)" + (c.may("greece") ? "; Greece begins governed by it (F&F p.6)" : "") + ". <b>FAQ:</b> under Democracy you may still use Atomic Theory’s resource ability to destroy a city — attacking a city means moving an army figure onto a city tile.</li>" +
      "<li><b>Monarchy</b> — a government card (pictured among the government cards, Core p.5); the rulebooks don’t describe it, so read the card.</li>" +
      "<li><b>Feudalism</b> — gives a coin while you are ruled by it; unlocked by Chivalry." + (c.may("japanese") ? " The Japanese start with it (W&W p.5)." : "") + " <b>FAQ:</b> even under Feudalism you can’t harvest the same resource icon twice in one turn with different cities (only Atomic Theory allows reuse) (FAQ p.3).</li>" +
      "<li><b>Fundamentalism</b> — +1 battle hand size.</li>" +
      "<li><b>Communism</b> — on the sample Russian sheet (Core p.7, small print): each of your cities generates 2 extra production; your capital produces 1 less culture when devoted to the arts." + (c.may("russia") ? " Russia starts with it." : "") + "</li>" +
      "<li><b>Anarchy</b> — the transitional government: your capital takes no action that turn (it still collects trade — FAQ). Next turn, change to any government you know.</li></ul>" +
      "<p class=\"inline-note\">The rulebooks don’t reprint the government cards; for anything not listed here, read the card." +
        (c.has("ww") ? " The descriptions above come from the core rulebook’s mentions of the original cards; Wisdom and Warfare doesn’t describe its replacement cards, so read them." : "") + "</p>" +
      (c.has("ff") || c.has("ww") ? "<ul>" +
        (c.has("ff") ? "<li><b>Immune to anarchy</b> (Fame and Fortune): never needs to change to Anarchy (culture events can’t force it) and may switch directly to a new government, even one not learned on the previous turn.</li>" : "") +
        (c.has("ff") && !c.mod("learn") ? "<li><b>FAQ — Pyramids</b> obsoleted or blockaded: if your current government isn’t unlocked by normal means, you immediately enter Anarchy (see Buildings, City Walls & Wonders).</li>" : "") +
        (c.has("ww") ? "<li><b>Social policies</b> (Wisdom and Warfare) expand the role of government — see Social Policies.</li>" : "") +
        "</ul>" : "");
    },
    src: (c) => CV.joinSrc(["Core p.5, p.7, p.12, p.14, p.21, p.23", "FAQ p.3", c.has("ff") && "F&F p.5", c.may("greece") && "F&F p.6", c.has("ff") && !c.mod("learn") && "FAQ p.6", c.has("ww") && "W&W p.2–4, p.10, p.12", c.may("japanese") && "W&W p.5"])
  },
  {
    title: "Civilizations in Play",
    when: () => true,
    html: (c) => {
      const ids = c.civs.concat(c.pool);
      if (!ids.length) return "<p>No civilizations available.</p>";
      let h = "<p>" + (c.open === 0 ? "The civilizations you selected:" : c.civs.length ? "Selected civilizations first, then those that may be drawn for the open seats:" : "Every civilization that may be drawn:") + "</p>";
      h += "<p class=\"inline-note\">The rulebooks print each civilization’s setup bonus and the FAQ rulings about its ability; the full ability text and starting tech are on the civilization sheet. Only Russia’s sheet is reproduced legibly (Core p.7); the sheets pictured with the components (Core p.3, F&F p.2, W&W p.2) are too small to read.</p>";
      for (const id of ids) {
        const v = CV.civById(id);
        h += "<h4>" + v.name + (c.civ(id) ? "" : " <i>(may be drawn)</i>") + "</h4><ul>" +
          "<li><b>Setup:</b> " + v.bonus(c) + "</li>" +
          (v.gov ? "<li><b>Starting government:</b> " + v.gov + "</li>" : "") +
          (v.tech ? "<li><b>Starting tech:</b> " + v.tech + "</li>" : "") +
          v.abil.map(a => "<li>" + a + "</li>").join("") +
          (v.gpAbil && c.mod("gp") ? "<li>" + v.gpAbil + "</li>" : "") +
          (v.adv && c.mod(v.adv.mod) ? "<li>" + v.adv.text + "</li>" : "") +
          "</ul>";
      }
      return h;
    },
    src: (c) => {
      const s = ["Core p.7–8, p.11–12", "FAQ p.2–3"];
      const ids = c.civs.concat(c.pool);
      if (ids.some(id => CV.civById(id).adv && c.mod(CV.civById(id).adv.mod))) s.push("FAQ p.6");
      const ff = ids.filter(id => CV.civById(id).set === "ff");
      if (ids.includes("egypt") && c.has("ff")) s.push("F&F p.5");
      if (ff.length || (ids.includes("america") && c.mod("gp"))) s.push("F&F p.6" + (ff.includes("greece") ? ", p.9" : "") + (ids.includes("india") ? ", p.10" : "") + (ff.includes("greece") && c.mod("gp") ? ", p.12" : "") + (ff.includes("arabia") ? ", p.13" : ""));
      if (ff.some(id => ["arabia", "greece", "india"].includes(id))) s.push("FAQ p.5");
      if (ids.some(id => CV.civById(id).set === "ww")) s.push("W&W p.5" + (ids.includes("french") || ids.includes("zulu") ? ", p.10" : "")); else if (ids.includes("egypt") && c.has("ww")) s.push("W&W p.5");
      return s.join(" · ");
    }
  },
  {
    title: "Map Tiles, Terrain & Icons",
    when: () => true,
    html: (c) => "<ul><li>Each map tile has <b>16 squares</b>. Home tiles (6 in the core game" + (c.has("ff") ? ", +4 Fame and Fortune" : "") + (c.has("ww") ? ", +6 Wisdom and Warfare" : "") + ") show their civilization’s leader on the back; the neutral tiles (14 in the core game" + (c.has("ff") ? ", +7 Fame and Fortune" : "") + (c.has("ww") ? ", +6 Wisdom and Warfare" : "") + ") are laid out face down at random.</li>" +
      "<li>Each square may contain one or more icons and/or resources that it provides to players.</li></ul>" +
      "<h4>Terrain</h4>" +
      "<p class=\"aid-icon-row\">" + CV.ic.pair("terrain-mountain", "Mountain") + " " + CV.ic.pair("terrain-forest", "Forest") + " " + CV.ic.pair("terrain-grassland", "Grassland") + " " + CV.ic.pair("terrain-desert", "Desert") + " " + CV.ic.pair("terrain-water", "Water") + "</p>" +
      "<ul><li>Terrain decides where buildings may go (see Buildings, City Walls & Wonders).</li></ul>" +
      "<h4>Natural wonders</h4>" +
      "<p>Squares that provide <b>culture</b> in addition to their terrain type’s normal icons:</p>" +
      "<p class=\"aid-icon-row\">" + CV.ic.pair("wonder-mountain", "Mountain") + " " + CV.ic.pair("wonder-forest", "Forest") + " " + CV.ic.pair("wonder-grassland", "Grassland") + " " + CV.ic.pair("wonder-desert", "Desert") + " " + CV.ic.pair("wonder-water", "Water") + "</p>" +
      "<h4>Icons a square may contain</h4><ul class=\"aid-icons\">" +
      CV.ic.li("trade", "Trade", "commerce and scientific progress. Collected from every city’s outskirts in the Trade Phase onto the trade dial; mainly spent to research techs.") +
      CV.ic.li("production", "Production", "a city’s industry. Spent by one city at a time to produce figures, units, buildings or wonders; it can’t be saved.") +
      CV.ic.li("culture", "Culture", "a city devoted to the arts collects 1 culture token plus 1 per culture icon in its outskirts.") +
      CV.ic.li("coin", "Coin", "advances your economy dial while you control the square (see Coins & the Economy).") +
      "</ul>" +
      "<h4>Resources a square may contain</h4>" +
      "<p class=\"aid-icon-row\">" + CV.ic.pair("wheat", "Wheat") + " " + CV.ic.pair("silk", "Silk") + " " + CV.ic.pair("incense", "Incense") + " " + CV.ic.pair("iron", "Iron") + "</p>" +
      "<ul><li>Two more resources are <b>never</b> found on the map: " + CV.ic.w("spy", "Spy", "<b>spy</b>") + " (from huts and villages) and " + CV.ic.w("uranium", "Uranium", "<b>uranium</b>") + " (only from villages, and only rarely).</li></ul>" +
      "<h4>Other map symbols</h4><ul class=\"aid-icons\">" +
      CV.ic.li("map-hut", "Hut (peaceful)", "when the tile is discovered, draw a random hut marker and place it face down on this square without looking at it.") +
      CV.ic.li("map-village", "Village (aggressive)", "when the tile is discovered, draw a random village marker and place it face down on this square without looking at it.") +
      CV.ic.li("capital-start", "Recommended capital space for beginners", "the starting arrow on a home tile.") +
      CV.ic.li("map-entry-side", "Map tile entry side", "the arrow at a tile’s edge, used to orient a tile when it is discovered (see Movement).") +
      "</ul>" +
      "<h4>City markers</h4>" +
      "<p class=\"aid-icon-row\">" + CV.ic.pair("city-capital", "Capital +12") + " " + CV.ic.pair("city-city", "City +6") + " " + CV.ic.pair("city-walled-capital", "Walled capital +16") + " " + CV.ic.pair("city-walled-city", "Walled city +10") + "</p>" +
      "<ul><li>Each marker shows its defensive combat bonus; the walled version is on the back.</li>" +
      (c.has("ff") ? "<li><b>Metropolis marker</b> (Fame and Fortune): a metropolis adds <b>+2</b> when defending; its two sides show " + CV.ic.w("metropolis-14", "Metropolis marker, +14 side", "+14") + " and " + CV.ic.w("metropolis-18", "Metropolis marker, +18 side", "+18") + ".</li>" : "") +
      ((c.has("ff") || c.has("ww")) ? "<li><b>Relic squares</b> on some expansion neutral tiles: " + [c.has("ff") && "Atlantis (water), School of Confucius (mountain), Seven Cities of Gold (forest — FAQ errata: 2 production, 1 coin)", c.has("ww") && "Ark of the Covenant (desert), Attila’s Village (grassland)"].filter(Boolean).join("; ") + ". See Relics.</li>" : "") +
      (c.may("aztecs") ? "<li>The <b>Aztec</b> home tile has a water square among its four center squares (three legal capital squares).</li>" : "") +
      (c.has("ww") ? "<li>" + CV.ic.w("city-state-marker", "City-state marker", "<b>City-state markers</b>") + " are placed where a City-state hut or village was found.</li>" : "") +
      (c.p === 5 ? "<li><b>Five-player map:</b> the hole in the center counts as the map’s inside edge and can’t be crossed.</li>" : "") +
      "</ul>",
    src: (c) => CV.joinSrc(["Core p.4, p.6–7, p.10, p.14, p.16–17, p.19, p.23, p.26, p.32", c.has("ff") && "F&F p.2–3, p.9–10, p.16 · FAQ p.5", c.p === 5 && "F&F p.6", c.has("ww") && "W&W p.3, p.9, p.11", c.may("aztecs") && "W&W p.5"])
  },
  {
    title: "Variants",
    when: () => true,
    html: (c) => {
      const on = (id) => c.mod(id) ? " <b>(selected)</b>" : "";
      let h = "<p>Agree on any variants before setting up. The advanced setup and tiebreaker variants remove some randomness; the advanced civilization variants are for experienced players.</p><ul>";
      h += "<li><b>Learning game</b>" + on("learn") + " — Egypt, Rome and the wonders stay in the box; play until a player builds their third city; no winners or losers. (Core p.8)</li>";
      h += "<li><b>Advanced Setup</b>" + on("advsetup") + " — each player draws two civilizations and chooses one in turn order when the first player is selected (General Setup 9). (FAQ p.6)</li>";
      h += "<li><b>Advanced Tiebreaker</b>" + on("advtie") + " — a non-military victory lets the turn finish; Victory Score decides among the winners (see How to Win). (FAQ p.6)</li>";
      if (!c.mod("learn")) h += "<li><b>Advanced Egypt</b>" + on("advegypt") + " — the Egyptians’ wonders cannot be obsoleted. (FAQ p.6)</li>";
      if (c.has("ff")) {
        h += "<li><b>Advanced Arabia</b>" + on("advarabia") + " — the Arabs gain only 1 culture per resource token spent, instead of 2; harder for Arabia to win a culture victory. (FAQ p.6)</li>";
        h += "<li><b>Advanced Greece</b>" + on("advgreece") + " — instead of retaining trade, the Greeks’ first ability gains 1 culture for each player who does not currently know or is researching the tech they research or learn; it scales with the number of players and is best used in a two-player game. (FAQ p.6)</li>";
        h += "</ul><h4>Fame and Fortune optional decks</h4><ul>";
        h += "<li><b>Great person deck</b>" + on("gp") + " — recruit specific great people from history: gaining a great person draws a card that names it. All players agree at the start; otherwise return the deck to the box. (F&F p.5, p.11)</li>";
        h += "<li><b>Investment deck</b>" + on("invest") + " — invest one coin token per turn in investment cards for lasting abilities. All players agree at the start — but it <b>must</b> be used when the Arabs play. (F&F p.5, p.13)</li>";
      }
      h += "</ul>";
      if (c.has("ww")) h += "<p class=\"inline-note\">Wisdom and Warfare has no optional modules: all of its rules are used whenever it is in play (W&W p.6–7).</p>";
      return h;
    },
    src: (c) => CV.joinSrc(["Core p.8", "FAQ p.6", c.has("ff") && "F&F p.5, p.11, p.13", c.has("ww") && "W&W p.6–7"])
  },
  {
    title: "FAQ v2.0 — Errata & Rulings",
    when: () => true,
    html: (c) => "<p class=\"callout\"><b>Precedence:</b> the FAQ v2.0 (updated 6/17/13) is the newest official ruling and overrides the core rulebook" + (c.has("ff") ? " and the Fame and Fortune rulebook" : "") + "; its errata are applied throughout this page.</p>" +
      "<h4>Errata (FAQ p.1)</h4><ul>" +
      "<li><b>Aircraft</b> cost <b>12</b>, as on the market board and reference sheet; the original-printing Flight cards are wrong." + (c.has("ff") ? " (Fame and Fortune includes replacement Flight cards — F&F p.3, p.5.)" : "") + "</li>" +
      "<li><b>Railroad</b> should have a coin icon; <b>Metal Casting</b> should not." + (c.has("ww") ? " (Wisdom and Warfare replaces both cards — W&W p.3–4.)" : "") + "</li>" +
      "<li><b>Wonder market:</b> after each wonder is bought, draw the next one into the market with its marker.</li>" +
      "<li><b>Obsoleting:</b> a tech may obsolete a wonder still in the market (discard it and its marker; replace it).</li>" +
      "<li><b>Battle turns:</b> players alternate battle turns, starting with the defender (the attacker plays first against a walled city). Only the player taking their battle turn may use abilities or play units: 1. opportunity to use an ability; 2. play a unit; 3. opportunity to use an ability; 4. turn ends. After playing your last unit you take no more battle turns.</li>" +
      "<li><b>Loot:</b> the loot system replaces the core winner’s-loot choices (see After the Battle).</li></ul>" +
      "<h4>General (FAQ p.2)</h4><ul>" +
      "<li>Several cities may take the same city action in one turn.</li>" +
      "<li>Simultaneous tech victories: first in turn order wins (or use the Advanced Tiebreaker).</li>" +
      "<li>A production bonus can only be used once, even across an extra city action.</li></ul>" +
      "<h4>Scouts and blockading (FAQ p.2)</h4><ul>" +
      "<li>Scouts may gather another city’s outskirts square (even with a building or wonder); that city loses it.</li>" +
      "<li>Coin totals update immediately as scouts or blockaders move (including a blockader leaving the square with someone’s 15th coin) — this can win the game" + (c.mod("advtie") ? " (with the Advanced Tiebreaker, the turn is then played out and scored)" : "") + ".</li>" +
      "<li>Scouts send everything home except combat bonuses.</li>" +
      "<li>An army built into a blockaded outskirts square fights immediately.</li>" +
      "<li>Leaving a blockaded Barracks to attack the city center restores the Barracks to the defender for that battle.</li></ul>" +
      "<h4>Governments (FAQ p.3)</h4><ul>" +
      "<li>Government unlocked during Movement → adopt next Start of Turn without Anarchy.</li>" +
      "<li>Government unlocked during Start of Turn → adopt in the same phase without Anarchy, whatever the turn order.</li>" +
      "<li>A capital in Anarchy still collects trade.</li>" +
      "<li>No player may harvest the same resource icon twice in a turn, even with different cities (Feudalism included), except through Atomic Theory.</li></ul>" +
      "<h4>Culture event cards (FAQ p.3)</h4><ul>" +
      "<li>“Bread and Circuses” can cancel another “Bread and Circuses”, “Jousting Tourney” or “Primetime TV”; they cancel out and the original card resolves.</li>" +
      "<li>Only the directly targeted player may cancel “A Gift from Afar” or “Exchange of Ideas” with “Bread and Circuses”.</li>" +
      (c.has("ff") ? "<li>Culture event cards such as “A Gift From Afar” count as spending a resource for the Arabs’ and Indians’ abilities.</li>" : "") +
      "<li>“Drought”, “Deforestation” or “Flooding” may target a square with a hut, village or great person — the disaster marker goes underneath.</li></ul>" +
      "<h4>Technologies (FAQ p.3–4)</h4><ul>" +
      "<li>A coin icon on the tech being researched counts when reducing the trade dial.</li>" +
      "<li>“(max 4)” = at most four coin tokens on the card at once.</li>" +
      "<li>Atomic Theory may destroy a city while under Democracy (attacking a city means moving an army onto it); its extra actions may reuse icons; two uranium allow both abilities.</li>" +
      "<li>Writing cancels city actions only; the cancelled player gets back the resources and trade spent (and any culture event card, e.g. “A Gift from Afar”, used in the action), but cannot take any other action with that city.</li>" +
      "<li>A resource ability cancelled by Mass Media is still used for the turn.</li>" +
      "<li>Communism’s ability can stop a Navigation figure in water, and can stop your own army.</li>" +
      "<li>Combustion destroys buildings only after the battle is won.</li></ul>" +
      "<h4>Combat (FAQ p.4)</h4><ul>" +
      "<li>Animal Husbandry and Biology: once per battle, in as many battles as you fight.</li>" +
      "<li>Metalworking and Mathematics resource abilities: once per turn, even over several battles.</li>" +
      "<li>Metalworking: use it before playing a unit — that unit gets +3 strength for the whole battle: it deals 3 extra wounds (a strength 1 unit deals 4)" + (c.has("ww") ? "" : " and is harder to kill") + ".</li>" +
      "<li>Heal only on your own battle turn. Resource abilities may be used with no units left. A combat bonus alone can win.</li></ul>" +
      "<h4>Wonders (FAQ p.4)</h4><ul>" +
      "<li>Porcelain Tower: research with 5 less trade.</li>" +
      "<li>Panama Canal: coin tokens on the card; safe from scouts and theft; don’t count while blockaded.</li>" +
      "<li>United Nations: protects its owner, their units, figures, buildings, outskirts, coins and culture cards from being targeted by culture cards against their will; Mass Media can’t target its owner — the UN prevents, rather than cancels.</li>" +
      "<li>Wonder markers cover all icons of their square.</li></ul>" +
      "<h4>Civilizations (FAQ p.2)</h4><ul><li>See Civilizations in Play" + (c.has("ff") ? " (the Spanish can rebuild their white scout, like the Russians’ white army)" : "") + ".</li></ul>" +
      (c.has("ff") || c.has("ww") ? "<p class=\"inline-note\">" + [c.has("ff") && "Fame and Fortune (p.7)", c.has("ww") && "Wisdom and Warfare (p.6)"].filter(Boolean).join(" and ") + " reprint" + (c.has("ff") && c.has("ww") ? "" : "s") + " the wonder-market, obsoleting and loot errata as rules changes; the FAQ wording is used here.</p>" : "") +
      (c.has("ff") ? "<h4>Fame and Fortune errata (FAQ p.5)</h4><ul>" +
        "<li><b>School of Confucius</b> relic: gain <b>one</b> great person, instead of two.</li>" +
        "<li><b>Seven Cities of Gold</b> relic square: should show <b>2 production, 1 coin</b>.</li>" +
        (c.mod("gp") ? "<li><b>“Leonidas”</b> great person card should read: “Battle: Each time you are the defender in a battle with fewer units in your battle force than your opponent, your combat bonus is increased by 8 until the end of the battle.”" + (c.has("ww") ? " (Wisdom and Warfare includes a replacement card.)" : "") + "</li>" : "") +
        (c.mod("invest") ? "<li><b>Endowment for the Arts</b> investment card should read: 1 marker: +1 culture hand size. 2 markers: +1 culture hand size; pay 1 less culture to advance on the culture track. 4 markers: +1 culture hand size; pay 2 less culture to advance." + (c.has("ww") ? " (Wisdom and Warfare includes replacement cards.)" : "") + "</li>" : "") +
        "</ul>" +
        "<h4>Fame and Fortune FAQ (FAQ p.5–6)</h4><ul>" +
        "<li><b>Agriculture:</b> a capital can’t grow into a metropolis so that its outskirts contain a hut or village token.</li>" +
        "<li><b>Friendly Barbarian:</b> a figure gained from it can’t move until the next turn.</li>" +
        "<li><b>Fortifications and caravans:</b> you may disband an army in a city that already has a fortification (or a scout where there is already a caravan), but you gain no extra marker or bonus. You may replace a fortification with a caravan and vice versa — the city then loses the old marker’s effect.</li>" +
        "<li><b>Arabs:</b> two free investments from the Seven Cities of Gold also advance them two culture spaces.</li>" +
        "<li><b>Indians:</b> devoting a city to the arts counts resources a scout is sending to that city.</li>" +
        (c.mod("gp") ? "<li><b>Great person cards:</b> a card’s ability needs at least one unblockaded marker of its type. “Marie Curie”: discard to spend any resource in place of uranium. “Georgy Zhukov”: its damage happens immediately when one of your units is killed, before your opponent can use an ability after playing a unit. “Archimedes”: no culture for techs <i>learned</i> (culture card, Public Education investments) — only researching counts.</li>" : "") +
        "<li><b>Relics:</b> figures may move through a relic without ending there; a scout may end its movement on a Fame and Fortune relic but cannot take the marker.</li>" +
        (c.mod("learn") ? "" : "<li><b>Wonders:</b> Angkor Wat works for any city’s harvest action; Brandenburg Gate and Pyramids rulings are in Buildings, City Walls & Wonders.</li>") +
        "</ul>" : ""),
    src: (c) => CV.joinSrc(["FAQ p.1–4", c.has("ff") && "FAQ p.5–6 · F&F p.7", c.has("ww") && "W&W p.6"])
  },
  {
    title: "Key Terms",
    when: () => true,
    html: (c) => "<ul>" +
      "<li><b>Battle force / battle hand size</b> — the unit cards drawn at random from your standing forces at the start of a battle, and how many you draw.</li>" +
      "<li><b>Blockade</b> — an enemy figure in one of your outskirts squares stops you using it.</li>" +
      "<li><b>City center / outskirts</b> — the city’s own square (produces nothing) / the eight squares around it that generate its trade, production, culture and resources.</li>" +
      "<li><b>Discovering</b> — turning a map tile face up by spending movement with an adjacent figure.</li>" +
      "<li><b>Front</b> — an area of a battle holding at most one unit from each side; units in the same front attack each other.</li>" +
      "<li><b>Limited building</b> — a building marked with a star; one per city in total.</li>" +
      "<li><b>Stacking limit</b> — the maximum number of your figures in one square.</li>" +
      "<li><b>Standing forces</b> — the deck of unit cards you have built.</li>" +
      "<li><b>Travel speed</b> — how many squares each of your figures may move per turn.</li>" +
      "<li><b>Trump</b> — a unit that trumps another strikes first.</li>" +
      "<li><b>Unlocked</b> — able to be produced (units, buildings) or adopted (governments).</li>" +
      "<li><b>Wounds</b> — damage on a unit during battle; all heal at the end of every battle.</li>" +
      (c.has("ff") ? "<li><b>Basic building</b> (F&F) — a building that is not upgraded.</li>" +
        "<li><b>Caravan / fortification</b> (F&F) — the two sides of the marker placed on a city center when a scout / army is disbanded there.</li>" +
        "<li><b>Disbanding</b> (F&F) — voluntarily removing a figure in one of your own city centers.</li>" +
        "<li><b>Expansion square</b> (F&F) — the square a capital grows into when it becomes a metropolis.</li>" +
        "<li><b>Immune to anarchy</b> (F&F) — never needs to change to Anarchy; may switch directly to a new government.</li>" +
        "<li><b>Metropolis</b> (F&F) — a two-square capital with ten outskirts squares.</li>" +
        "<li><b>Relic</b> — a special map square with a one-time reward for the first army to end its move there.</li>" : (c.has("ww") ? "<li><b>Relic</b> — a special map square with a one-time reward for the first army to end its move there.</li>" : "")) +
      (c.mod("invest") ? "<li><b>Investment</b> (F&F) — a coin token turned into an investment marker on an investment card.</li>" : "") +
      (c.has("ww") ? "<li><b>Building program</b> (W&W) — the fourth city action: doubles the city’s outskirts production on its next produce action.</li>" +
        "<li><b>City-state</b> (W&W) — a marker placed where a City-state hut or village reward was found; whoever has a figure on its square controls it.</li>" +
        "<li><b>Engaged</b> (W&W) — a front with two units on it; it can’t be attacked again.</li>" +
        "<li><b>Health / strength</b> (W&W) — wounds a unit can take / wounds it deals.</li>" +
        "<li><b>Social policy maximum</b> (W&W) — your number of built cities" + (c.may("french") ? " (+1 for the French)" : "") + ": how many social policies you hold.</li>" : "") +
      "</ul>",
    src: (c) => CV.joinSrc(["Core p.28", c.has("ff") && "F&F p.5, p.8–10" + (c.mod("invest") ? ", p.13" : ""), c.has("ww") && "W&W p.7–11"])
  }
];

/* Expansion reference sections, inserted after "Map Tiles, Terrain & Icons" (before Variants). */
CV.expansionReference = [
  {
    title: "Fame and Fortune — What Changes",
    when: (c) => c.has("ff"),
    html: (c) => "<p class=\"callout\">All the rules in Fame and Fortune <b>supersede</b> the core rules and are always used when playing with it. If you don’t use the great person or investment decks, disregard their rules.</p><ul>" +
      "<li><b>Four new civilizations</b> — Arabia, Greece, India, Spain (see Civilizations in Play).</li>" +
      "<li><b>Metropolises</b> — the new Agriculture tech grows your capital (see Metropolises).</li>" +
      "<li><b>Disbanding, fortifying and caravans</b> — see the section below.</li>" +
      "<li><b>Relics</b> — Atlantis, School of Confucius, Seven Cities of Gold on new neutral tiles (see Relics).</li>" +
      "<li><b>New huts and villages</b> — Friendly Barbarian, Friendly Workers, Native Art, Teacher, Wealth (see Huts, Villages & Barbarians).</li>" +
      "<li><b>New techs, wonders and culture events</b> — 4 techs per player, 9 wonders (" + (c.mod("learn") ? "not used in the learning game" : "so the wonder deck is built each game") + "), 10 culture events.</li>" +
      "<li><b>Rules changes</b> — the wonder market refill, obsoleting wonders in the market and the loot table (the FAQ errata; see After the Battle).</li>" +
      "<li><b>New terms</b> — basic building; immune to anarchy.</li>" +
      "<li>" + CV.ic.w("culture-five", "Five-point culture token", "<b>Five-point culture tokens</b>") + ", forest/water disaster markers and military reference cards.</li>" +
      "<li>" + CV.ic.w("ff-expansion-icon", "Fame and Fortune expansion icon", "<b>Expansion icon</b>") + " — when necessary, Fame and Fortune components are marked with it on their front, to tell them from core game components.</li>" +
      "<li><b>Fifth player</b> — components and a five-player map" + (c.p === 5 ? " (in use: see Five-Player Game)" : "") + ".</li>" +
      "<li><b>Optional:</b> the great person deck" + (c.mod("gp") ? " (in use)" : " (not in use)") + " and the investment deck" + (c.mod("invest") ? " (in use)" : " (not in use)") + ".</li></ul>",
    src: "F&F p.2–8"
  },
  {
    title: "Metropolises",
    when: (c) => c.has("ff"),
    html: (c) => "<p>The <b>Agriculture</b> tech lets a player grow their capital into a metropolis" + (c.may("india") ? "; India starts with one" : "") + ".</p>" +
      "<h4>Benefits</h4><ul>" +
      "<li><b>Two extra outskirts squares</b>: both squares under the marker are the city center; the <b>10</b> squares around it are the outskirts.</li>" +
      "<li>Devoted to the arts, it produces a base of <b>2 culture</b> instead of 1.</li>" +
      "<li><b>+2 combat bonus</b> when defending it.</li>" +
      "<li>It may extend partly into <b>water</b> and doesn’t count as water for movement — its owner can use it as a bridge.</li></ul>" +
      "<h4>Growing a capital into a metropolis</h4><ul>" +
      "<li>When you learn Agriculture, your capital <b>immediately</b> grows, if possible: remove the capital marker and place your " + CV.ic.w("metropolis-14", "Metropolis marker", "metropolis marker") + ".</li>" +
      "<li>The marker covers the capital’s square plus one of its <b>four orthogonally adjacent</b> squares — the <b>expansion square</b>.</li>" +
      "<li>The expansion square must not contain <b>enemy figures</b>. Friendly figures there move at once to an adjacent square where they may legally end movement.</li>" +
      "<li>A wonder, great person or building in the expansion square is <b>overbuilt</b>, as in the core rules (e.g. a Harbor returns to the market).</li>" +
      "<li>The expansion square may be <b>water</b>; it then stops counting as water for movement.</li>" +
      "<li>The new outskirts may not overlap another city’s outskirts, extend off the map or into unexplored territory — nor, <b>FAQ</b>, contain a hut or village token.</li>" +
      "<li>If it <b>can</b> grow when you learn Agriculture, it <b>must</b>. If it can’t, it must grow during the Start of Turn Phase of any later turn on which it becomes possible.</li></ul>" +
      (c.may("india") ? "<p><b>India:</b> its metropolis starts on two of the four center squares of its home tile, not diagonally.</p>" : ""),
    src: (c) => CV.joinSrc(["F&F p.4, p.10–11, p.16 · FAQ p.5", c.may("india") && "F&F p.6"])
  },
  {
    title: "Disbanding, Fortifying & Caravans",
    when: (c) => c.has("ff"),
    html: "<ul><li><b>Disbanding:</b> move an army or scout into the <b>city center</b> of one of your own cities, then remove it from the board. It is voluntary — figures may still move through friendly city centers without ending there.</li></ul>" +
      "<h4>Army → fortify the city</h4><ul>" +
      "<li>Place a " + CV.ic.w("fortification-caravan", "Fortification/caravan marker", "fortification/caravan marker") + " on the city center, <b>fortification side up</b>.</li>" +
      "<li>Defending a fortified city gives <b>+2 combat bonus</b>.</li>" +
      "<li>If the fortified city successfully defends itself, <b>discard</b> the fortification (if it loses, the city is destroyed).</li></ul>" +
      "<h4>Scout → send a caravan</h4><ul>" +
      "<li>Place the marker on the city center, <b>caravan side up</b>.</li>" +
      "<li>When you take a <b>build action</b> in that city, you may discard the caravan to produce <b>2 extra production</b> that turn.</li></ul>" +
      "<h4>Limits</h4><ul>" +
      "<li>A city may hold only <b>one</b> fortification or caravan marker, never both.</li>" +
      "<li><b>FAQ:</b> you may still disband an army in an already-fortified city (or a scout where there’s already a caravan), but gain no extra marker or bonus.</li>" +
      "<li><b>FAQ:</b> you may replace a fortification with a caravan, or a caravan with a fortification; the city loses the old marker’s benefit.</li></ul>",
    src: "F&F p.4, p.8–9 · FAQ p.5"
  },
  {
    title: "Relics",
    when: (c) => c.has("ff") || c.has("ww"),
    html: (c) => "<p>Some expansion neutral tiles hold a <b>relic</b> square. When such a tile is discovered, place the matching relic marker on its square.</p>" +
      "<h4>While the relic marker is on the map</h4><ul>" +
      "<li>The square can’t be built in or altered by any culture event, tech or other effect (such as “Deforestation”).</li>" +
      "<li>No city may be built <b>adjacent</b> to it.</li>" +
      (c.has("ff") ? "<li>F&F p.9 says no scout may enter a relic square unless accompanied by one or more armies (not even under a Republic); <b>FAQ v2.0 (Fame and Fortune FAQ) answers that a scout may end its movement on a Fame and Fortune relic</b> (Atlantis, School of Confucius, Seven Cities of Gold), but it cannot take the relic marker — only armies claim relics.</li>" +
        (c.has("ww") ? "<li><b>Wisdom and Warfare’s relics</b> (Ark of the Covenant, Attila’s Village) follow W&W p.11: no scout may enter them unless accompanied by one or more armies (not even with the Pacifism social policy).</li>" : "") :
        "<li>No scout may enter it unless accompanied by one or more armies (not even with the Pacifism social policy).</li>") +
      "<li>Figures may move <b>through</b> the square without ending their movement.</li></ul>" +
      "<h4>Claiming a relic</h4><ul>" +
      "<li>When one or more <b>armies end their movement</b> on the relic square, their owner removes the marker and gains its <b>one-time</b> ability. Afterwards the square may be built over or altered as normal.</li></ul>" +
      "<h4>The relics</h4><ul class=\"aid-icons\">" +
      (c.has("ff") ? "<li>" + CV.ic.img("relic-atlantis", "Atlantis relic marker") + "<span><b>Atlantis</b> (water square) — learn a <b>free tech of your choice</b> at the start of the next turn (you need a legal pyramid space).</span></li>" +
        "<li>" + CV.ic.img("relic-school-of-confucius", "School of Confucius relic marker") + "<span><b>School of Confucius</b> (mountain square) — gain <b>one great person</b> (<b>FAQ errata</b>: F&F printed two)." + (c.may("greece") ? " The Greeks draw two great people and keep one (F&F’s note, with the errata applied)." : "") + "</span></li>" +
        "<li>" + CV.ic.img("relic-seven-cities-of-gold", "Seven Cities of Gold relic marker") + "<span><b>Seven Cities of Gold</b> (forest square; <b>FAQ errata</b>: the square shows 2 production and 1 coin) — " + (c.mod("invest") ? "<b>invest two coins for free</b> at the start of the next turn: gain two investment markers without losing two coin tokens." + (c.may("arabia") ? " <b>FAQ:</b> the Arabs also advance two culture spaces for these investments." : "") : "its printed reward is two free investments at the start of the next turn; you aren’t using the investment deck, and the books don’t give a substitute.") + "</span></li>" : "") +
      (c.has("ww") ? "<li>" + CV.ic.img("relic-ark-of-the-covenant", "Ark of the Covenant relic marker") + "<span><b>Ark of the Covenant</b> (desert square) — receive <b>two free advances</b> on the culture track.</span></li>" +
        "<li>" + CV.ic.img("relic-attilas-village", "Attila’s Village relic marker") + "<span><b>Attila’s Village</b> (grassland square) — immediately build <b>two unlocked units</b> of your choice for free.</span></li>" : "") +
      "</ul>",
    src: (c) => CV.joinSrc([c.has("ff") && "F&F p.3, p.9, p.16 · FAQ p.5", c.has("ww") && "W&W p.3, p.11–12"])
  },
  {
    title: "Great Person Deck",
    when: (c) => c.mod("gp"),
    html: (c) => "<p>Optional (all players agree at the start). It makes culture victories more desirable and lets you recruit specific great people from history.</p>" +
      "<h4>Setup</h4><ul><li>In General Setup 6, the great person markers go <b>face up, sorted by type</b> (artist, builder, general, humanitarian, industrialist, scientist); the shuffled deck goes face down beside them.</li></ul>" +
      "<h4>Gaining great people</h4><ul>" +
      "<li>Whenever you gain a great person, <b>draw a card</b> from the deck without showing it. Take the marker matching the <b>picture</b> on the card. Artist, builder, general, humanitarian and scientist markers match cards of the same name; <b>industrialist</b> markers match the <b>“Great Merchant or Explorer”</b> cards.</li>" +
      "<li>Place the marker or hold it in reserve as normal. Keep the card <b>face down</b> and secret until used.</li>" +
      "<li>No marker of that type left? Discard the card face up to the <b>bottom</b> of the deck and draw again. No markers left at all: no great person.</li>" +
      "<li>If a face-up card reaches the top of the deck, turn the deck over and shuffle it.</li>" +
      (c.may("greece") ? "<li><b>Greeks:</b> they draw until they have <b>two valid</b> great person cards, and choose between them.</li>" : "") +
      (c.may("america") ? "<li><b>America:</b> draws a great person card at the start of the game, as though it gained a great person.</li>" : "") +
      "</ul>" +
      "<h4>Using abilities</h4><ul>" +
      "<li>Each card says when its ability can be used. To use it, turn the card <b>face up</b>; if it must be discarded, put it face up at the bottom of the deck, otherwise it stays face up in front of you.</li>" +
      "<li>You can’t use a great person’s ability unless you have <b>at least one marker of that type on the map</b> (e.g. “William Shakespeare” needs an artist on the map). <b>FAQ:</b> at least one that is <b>not blockaded</b>.</li></ul>" +
      "<h4>Killing great people</h4><ul>" +
      "<li>You may hold only <b>one card per marker of that type</b> you own (on the map or in reserve), face up or down.</li>" +
      "<li>When a marker is killed (usually by a culture event or a destroyed city) and you have too many cards of that type, discard cards of that type <b>at random</b>, one at a time, until you don’t.</li></ul>" +
      "<h4>Card rulings (FAQ)</h4><ul>" +
      "<li><b>“Leonidas”</b> should read: “Battle: Each time you are the defender in a battle with fewer units in your battle force than your opponent, your combat bonus is increased by 8 until the end of the battle.”" + (c.has("ww") ? " Wisdom and Warfare provides the replacement card." : "") + "</li>" +
      "<li><b>“Marie Curie”</b> — discard to spend any resource in place of uranium.</li>" +
      "<li><b>“Georgy Zhukov”</b> — its damage happens immediately when one of your units is killed, before your opponent can use an ability after playing a unit.</li>" +
      "<li><b>“Archimedes”</b> — no culture when a tech is <i>learned</i> through a culture card or Public Education investments; only researching (Research Phase, spending trade) counts.</li></ul>",
    src: (c) => CV.joinSrc(["F&F p.3, p.5, p.11–12 · FAQ p.5", c.may("america") && "F&F p.6", c.has("ww") && "W&W p.4"])
  },
  {
    title: "Investment Deck",
    when: (c) => c.mod("invest"),
    html: (c) => "<p>Optional (all players agree at the start) — " + (c.may("arabia") ? "<b>required while the Arabs play</b>, since one of their abilities depends on it." : "but it must be used whenever the Arabs play.") + " It ties the economic path to the other three.</p>" +
      "<h4>Setup</h4><ul><li>In General Setup 2, each player takes their deck of <b>four investment cards</b>.</li></ul>" +
      "<h4>Investing coins</h4><ul>" +
      "<li>Each player may invest <b>one (and only one)</b> coin per turn, during the <b>start of the turn</b>.</li>" +
      "<li>Only <b>coin tokens</b> can be invested — not coins printed on the map, tech cards or buildings.</li>" +
      "<li>Discard one of your coin tokens (your coins drop by one) and gain one <b>investment marker</b>. Place it on one of your investment cards, kept face up for everyone to see; you may spread markers over different cards or pile them on one.</li>" +
      "<li>Investments <b>don’t count</b> toward the 15 coins for an economic victory — but other players <b>can’t discard</b> them (loot can’t touch them).</li></ul>" +
      "<h4>Investment effects</h4><ul>" +
      "<li>An ability becomes active when the markers on its card are <b>equal to or more than</b> the number to its left.</li>" +
      "<li>Only the <b>most expensive active</b> ability on a card works; once a more expensive one activates, the cheaper ones stop.</li>" +
      "<li><i>Example (F&F p.13):</i> “Military-Industrial Complex” with 3 markers gives +4 combat bonus (its 2-marker ability); a 4th marker activates +8, which replaces the +4.</li>" +
      "<li><b>Endowment for the Arts</b> (FAQ errata text): 1 marker +1 culture hand size; 2 markers +1 culture hand size and pay 1 less culture to advance on the culture track; 4 markers +1 culture hand size and pay 2 less culture." + (c.has("ww") ? " Wisdom and Warfare provides replacement cards." : "") + "</li></ul>" +
      "<h4>Free investments</h4><ul><li><b>Seven Cities of Gold</b> relic: invest two coins for free at the start of the next turn (two markers, no coin tokens spent)." + (c.may("arabia") ? " The Arabs also advance two culture spaces (FAQ)." : "") + "</li></ul>",
    src: (c) => CV.joinSrc(["F&F p.3, p.5, p.7, p.9, p.13 · FAQ p.5", c.has("ww") && "W&W p.4"])
  },
  {
    title: "Five-Player Game",
    when: (c) => c.p === 5,
    html: (c) => "<ul><li>Fame and Fortune supplies the fifth player’s figures (6 armies, 2 scouts), cards (1 setup, 4 government, 36 tech), markers (7 military tech, 3 city, 4 market resource) and a reference sheet." + (c.has("ww") ? " With Wisdom and Warfare, the fifth player too uses the replacement government cards and the replacement “Metal Casting” and “Railroad” techs (W&W p.2–4)." : "") + "</li>" +
      "<li>Use the <b>five-player map</b> (General Setup 5): 5 home tiles and 17 neutral tiles around a central hole.</li>" +
      "<li>The <b>hole</b> can’t be moved through in any way and counts as adjacent to the map’s <b>inside</b> edge rather than the outside — e.g. the great person Galileo can’t move figures next to it.</li>" +
      "<li>As in every game, one of each market resource per player: <b>5</b> wheat, silk, incense and iron.</li></ul>",
    src: (c) => CV.joinSrc(["F&F p.2, p.4–6 · Core p.10", c.has("ww") && "W&W p.2–4"])
  },
  {
    title: "Wisdom and Warfare — What Changes",
    when: (c) => c.has("ww"),
    html: (c) => "<p class=\"callout\">All the rules in Wisdom and Warfare <b>supersede</b> the core rules and must be used whenever you play with it. It has no optional modules.</p><ul>" +
      "<li><b>Six new civilizations</b> — the Aztecs, English, French, Japanese, Mongols and Zulu (see Civilizations in Play).</li>" +
      "<li><b>Social policies</b> — four double-sided cards per civilization (see Social Policies).</li>" +
      "<li><b>Building programs</b> — a fourth city action (see City Management).</li>" +
      "<li><b>Replacement units</b> — strength and health, engaged fronts, a new way to resolve battles (see Combat).</li>" +
      "<li><b>New hut and village effects</b> — <b>City-state</b> (see City-States) and <b>Wealth</b>: reveal and discard the marker, gain one coin token (see Huts, Villages & Barbarians).</li>" +
      (c.mod("learn") ? "" : "<li><b>Wonder deck</b> — built from four modern, four medieval and four ancient wonders, with the rest returned unseen (General Setup, W&W p.5).</li>") +
      "<li><b>Relics</b> — Ark of the Covenant and Attila’s Village (see Relics).</li>" +
      "<li>" + CV.ic.w("shipyard", "Shipyard marker", "<b>Shipyards</b>") + " — a new water building unlocked by Navy, with a market board overlay.</li>" +
      "<li><b>New cards</b> — 4 techs per player (plus replacement Metal Casting and Railroad), 6 wonders" + (c.mod("learn") ? " (not used in the learning game)" : "") + ", 12 culture events (including “Roaming Horde” and two-phase cards), replacement government cards.</li>" +
      "<li><b>Rules changes</b> — the same wonder-market, obsoleting and loot changes as Fame and Fortune and the FAQ (see Buildings, City Walls & Wonders and After the Battle; W&W p.6).</li>" +
      "<li>" + CV.ic.w("ww-expansion-icon", "Wisdom and Warfare expansion icon", "<b>Expansion icon</b>") + " — Wisdom and Warfare components are marked with it, to tell them from core game and Fame and Fortune components. Replacement small cards for the core game and Fame and Fortune are marked with an <b>R</b>.</li></ul>",
    src: "W&W p.2–12"
  },
  {
    title: "Social Policies",
    when: (c) => c.has("ww"),
    html: (c) => "<p>Social policies expand the role of government. Each civilization has a set of <b>four double-sided cards</b>. They are always unlocked (no tech needed), but you benefit only from policies you have <b>adopted</b>.</p>" +
      "<h4>Adopting</h4><ul>" +
      "<li>Your <b>social policy maximum</b> equals your number of <b>built cities</b>" + (c.may("french") ? " (the French: +1, so 2 at the start)" : "") + ". Whenever it increases, you <b>must immediately adopt</b> a new policy.</li>" +
      "<li>You start with a maximum of <b>1</b> and adopt one policy in Player Setup 1.</li>" +
      "<li>To adopt, choose a card you don’t currently have and flip it to the side you want. You can’t adopt the other side of a card you already hold — that needs a switch.</li></ul>" +
      "<h4>Losing</h4><ul><li>Whenever your maximum decreases (e.g. a city is destroyed), choose one of your adopted cards and return it to your unused pile; either side can be adopted again later.</li></ul>" +
      "<h4>Switching</h4><ul>" +
      "<li>Normally an adopted policy can’t be changed — choose carefully.</li>" +
      "<li>Some effects, such as the new <b>Bureaucracy</b> tech (level II), let you switch: flip an adopted card to its other side, or swap it for a card you aren’t using.</li></ul>" +
      "<h4>Using them</h4><ul>" +
      "<li>Each “Start of Turn” ability on a policy card can be used <b>once per turn</b>; if a card has two abilities, both can be used once.</li>" +
      "<li><i>Examples (W&W p.10):</i> <b>Expansionism</b> — Start of Turn: gain 1 trade for each of your cities and 1 for each of your city-states. <b>Rationalism</b> — Start of Turn: spend 6 trade to learn a level I tech; Start of Turn: spend 11 trade to learn a level II tech.</li>" +
      "<li>The <b>Pacifism</b> policy doesn’t let scouts enter a relic square alone (W&W p.11).</li></ul>",
    src: (c) => CV.joinSrc(["W&W p.3, p.10–11", c.may("french") && "W&W p.5"])
  },
  {
    title: "City-States",
    when: (c) => c.has("ww"),
    html: (c) => "<p>A new hut and village effect that can give bonuses to the civilization controlling it each turn. The <b>5</b> city-state markers are shuffled face down near the board at the start.</p>" +
      "<h4>Founding</h4><ul><li>When a hut or village marker shows the " + CV.ic.w("ww-city-state", "City-state hut/village reward", "<b>City-state</b> reward") + ", draw the top " + CV.ic.w("city-state-marker", "City-state marker", "city-state marker") + " and place it on the square where the hut or village was.</li></ul>" +
      "<h4>Control and effects</h4><ul>" +
      "<li>You <b>control</b> a city-state while you have a <b>figure</b> on its square.</li>" +
      "<li>A controlled city-state counts as part of your <b>capital’s outskirts</b>: it can give production, trade, culture and other bonuses.</li>" +
      "<li>Figures you build with your capital may be placed on the squares of city-states you control (normal stacking limits).</li>" +
      "<li>A garrisoned army can be attacked; it gets a <b>+4</b> defensive bonus. A scout there that is attacked is removed without a battle.</li></ul>" +
      "<h4>Cities and city-states</h4><ul>" +
      "<li>No city may be built <b>adjacent</b> to a city-state.</li>" +
      "<li>A city <b>may</b> be built on a city-state’s square: the city-state is destroyed and you receive <b>3 culture</b>.</li>" +
      (c.may("zulu") ? "<li><b>Zulu:</b> if they explore a city-state by building a city, it is immediately destroyed and they receive 3 culture.</li>" : "") +
      "</ul>" +
      "<h4>Abandoning</h4><ul><li>Move away as normal; you lose its bonuses. A city-state remains even when nobody controls it.</li></ul>",
    src: "W&W p.3, p.5, p.9–10, p.12"
  }
];
(function () {
  const i = CV.reference.findIndex(s => s.title === "Variants");
  CV.reference.splice(i, 0, ...CV.expansionReference);
})();

/* =============================================================================
   TEACHING SCRIPT — read-aloud teach for the configuration selected
   ============================================================================= */
CV.teach = {
  intro: "A ~5-minute teach for the exact sets, player count, civilizations and variants selected above. Read it aloud, or hit Copy and tweak. Everything in it comes from the rulebooks and FAQ cited in the setup steps.",
  sections: [
    {
      h: "The hook — and how you win",
      body: (c) => c.mod("learn")
        ? "<p>Each of us leads a civilization that starts as one humble city with almost no inventions. Tonight is a <b>learning game</b>: nobody wins. We play until somebody builds their <b>third city</b>, then stop and talk it over." +
          (c.mod("advtie") ? " (The <b>Advanced Tiebreaker</b> we picked only matters in a full game, since nobody wins this one.)" : "") +
          " In the real game there are four ways to win, and the first to any of them wins on the spot: reach the end of the <b>culture track</b>, research <b>Space Flight</b>, hold <b>15 coins</b>, or <b>conquer a rival’s capital</b>.</p>"
        : "<p>Each of us leads a civilization that starts as one humble city with almost no inventions. There are <b>four ways to win</b>, and " + (c.mod("advtie") ? "reaching one ends the game:" : "the first player to reach any of them wins on the spot:") + " reach the end of the <b>culture track</b>; research <b>Space Flight</b>, the top of the tech pyramid; hold <b>15 coins</b>; or <b>conquer one rival’s capital</b>. You don’t pick a path in advance — so watch what everyone is close to.</p>" +
          (c.mod("advtie") ? "<p>We’re using the <b>Advanced Tiebreaker</b>: taking a capital still ends the game at once, but a culture, coin or tech win lets the turn finish, and then everyone who made it compares a score — techs learned, spaces advanced on the culture track, coins, and wonders (obsoleted ones count, destroyed ones don’t). The highest score wins, and tied players share the win. With this variant, reaching the culture victory space also earns you a card from the third culture deck.</p>" : "")
    },
    {
      h: "The shape of a turn",
      body: (c) => "<p>A turn has five phases. <b>Start of Turn:</b> from the second turn on, the first player marker moves one seat left; found new cities, change government. <b>Trade:</b> everyone collects trade at once, and you may deal — trade, culture, resources, culture cards, promises you don’t have to keep. <b>City Management:</b> each of your cities takes one action. <b>Movement:</b> move your armies and scouts, two squares each to start, no diagonals. <b>Research:</b> everyone secretly buys up to one tech, and we reveal together. Apart from Trade and Research, we go one at a time from the first player.</p>" +
        "<p>" + (c.p === 2 ? "With two of us the map is a tall strip two tiles wide, our home tiles at opposite ends." : c.p === 3 ? "With three of us the map is a stepped pyramid: one home tile at the top, two at the ends of the bottom row." : c.p === 4 ? "With four of us the map is a four-by-four square, a home tile in each corner." : "With five of us we use the Fame and Fortune <b>five-player map</b>: twenty-two tiles around a hole in the middle that nothing can cross.") + " Everything else starts face down.</p>"
    },
    {
      h: "Your cities — and why you’d take each action",
      body: (c) => "<p>A city works the eight squares around it, its <b>outskirts</b>: trade, production, culture, coins and resources. Trade from all your cities pools on your dial and can be saved. Production belongs to one city, this turn only — use it or lose it.</p>" +
        "<p>Each city does one thing per turn. <b>Produce</b> something its production covers: an army for 4, a scout for 6, a unit card from 5, a building you’ve unlocked" + (c.mod("learn") ? "" : ", or a wonder from the market") + " — topping up at <b>3 trade per extra production</b>. <b>Devote to the arts</b>: one culture plus one per culture icon, spent to climb the culture track for culture cards, great people and, at the end, the win. Or <b>harvest</b> one resource the city can see; resources power the abilities on your tech cards, each once per turn.</p>" +
        "<p>For more cities, walk a <b>scout</b> out as a settler and sacrifice it at the start of a turn — on land, not on the map’s edge, and not next to a face-down tile, a hut, a village" + ((c.has("ff") || c.has("ww")) ? ", a relic" : "") + (c.has("ww") ? ", a city-state" : "") + " or an enemy, and three squares from any other city. Two cities to start; three once you learn Irrigation.</p>"
    },
    {
      h: "The central mechanic — the tech pyramid",
      body: () => "<p>Research is the engine. A level I tech needs <b>6 trade</b> on your dial, and each level after needs 5 more — 11, 16, 21, 26. The catch: researching <b>spends all your trade</b>, unless you own coins — each coin lets you keep one.</p>" +
        "<p>Techs form a <b>pyramid</b>: level I is unlimited, but each level II tech sits on two level I techs, each level III on two level IIs, and so on — Space Flight needs at least fourteen techs beneath it, fifteen in all. Techs unlock buildings, governments and better units, and give abilities and coins. Your starting tech sits in the bottom row.</p>"
    },
    {
      h: "Exploring and fighting",
      body: (c) => "<p>Next to a face-down tile, spend a step to flip it. New tiles bring <b>huts</b> and <b>villages</b>, which only armies may enter. A hut joins you: a free resource. A village fights: the player on your left runs three barbarian units against you; win and you get a resource or a great person, lose and your army dies.</p>" +
        "<p>Battles use <b>unit cards</b>; armies just show where your forces are. Each side draws three cards at random from its standing forces, two more per extra army in the square, three more defending a city. Take turns playing cards, defender first: open a new front or attack an enemy card, trading wounds equal to strength." +
          (c.has("ww") ? " With Wisdom and Warfare’s new unit cards, each unit also has a <b>health</b> — the wounds it can take before it dies — and a front with two units already <b>engaged</b> can’t be attacked again." : "") +
          " <b>Infantry beats mounted, mounted beats artillery, artillery beats infantry</b> — the trumping card strikes first. At the end, " +
          (c.has("ww") ? "add up your survivors’ health, subtract their wounds and add your combat bonus" : "total your survivors’ strength plus combat bonuses") +
          "; ties go to the defender. The winner takes loot or destroys a city — and taking a capital wins the game.</p>"
    },
    { when: (c) => c.civs.length > 0,
      h: "Our civilizations",
      body: (c) => "<p>Each sheet has special abilities, a starting government and a starting tech — read yours out now. Tonight’s starting bonuses:</p><ul>" +
        c.civs.map(id => {
          const v = CV.civById(id);
          const t = {
            america: "<b>America</b> starts with a random great person by its capital" + (c.mod("gp") ? " — and draws a great person card for it" : "") + ".",
            china: "<b>China</b> starts with City Walls on its capital.",
            egypt: "<b>Egypt</b> starts with a free ancient wonder by its capital" + (c.mod("advegypt") ? " — and with Advanced Egypt, its wonders can never be obsoleted" : "") + ".",
            germany: "<b>Germany</b> starts with two extra infantry units.",
            rome: "<b>Rome</b> starts as a Republic.",
            russia: "<b>Russia</b> starts with a second army, a stacking limit of three, and Communism.",
            arabia: "<b>Arabia</b> starts with one of each market resource and its artillery at rank two" + (c.mod("advarabia") ? " — and with Advanced Arabia, it gains only one culture per resource token spent, not two" : "") + ". The Arabs need the investment deck.",
            greece: "<b>Greece</b> starts as a Democracy with its infantry at rank two" + (c.mod("advgreece") ? " — and with Advanced Greece, its first ability no longer keeps trade: after it researches or learns a tech, it gains one culture for each player who does not currently know or is researching that tech" : "") + ".",
            india: "<b>India</b> starts with a two-square metropolis as its capital.",
            spain: "<b>Spain</b> puts an extra white scout on the map, though its stacking limit is still two.",
            aztecs: "<b>The Aztecs</b> have only their starting tech — and just three squares to choose from for their capital.",
            english: "<b>The English</b> have only their starting tech.",
            french: "<b>The French</b> start with two social policies and can always hold one more than their number of cities.",
            japanese: "<b>The Japanese</b> start under Feudalism with their mounted units at rank two.",
            mongols: "<b>The Mongols</b> start with two extra mounted units and a travel speed of three.",
            zulu: "<b>The Zulu</b> start with two extra artillery units."
          }[id];
          return "<li>" + t + "</li>";
        }).join("") + "</ul>"
    },
    { when: (c) => c.mod("advsetup"),
      h: "Advanced Setup",
      body: () => "<p>We’re using <b>Advanced Setup</b>: each of you drew two civilization sheets. Once the first player is chosen, pick the one you’ll play, in turn order.</p>"
    },
    { when: (c) => c.mod("advegypt") && !c.civ("egypt"),
      h: "Advanced Egypt",
      body: () => "<p>If someone draws <b>Egypt</b>, we’re using its advanced version: Egypt’s wonders can never be obsoleted.</p>"
    },
    { when: (c) => c.has("ff"),
      h: "Fame and Fortune",
      body: (c) => "<p>We’re playing with <b>Fame and Fortune</b>. A new tech, <b>Agriculture</b>, grows your capital into a two-square <b>metropolis</b>: ten outskirts squares, two base culture, and plus two in defense. You may now <b>disband</b> a figure in one of your own city centers: an army <b>fortifies</b> the city — plus two in defense until it survives an attack — and a scout leaves a <b>caravan</b>, two extra production for one build there. Some new tiles hide <b>relics</b>: the first army to end its move on one claims a one-time reward; a scout may stop on one, but only an army can claim it. New huts and villages add friendly barbarians, workers, native art, teachers and wealth.</p>" +
        (c.mod("gp") ? "<p>We’re using the <b>great person deck</b>: when you gain a great person, draw a secret card naming one and take the matching marker. Its ability works only while you have a marker of that type on the map.</p>" : "") +
        (c.mod("invest") ? "<p>We’re using <b>investments</b>: once per turn, at the start of the turn, you may turn a coin token into an investment marker on one of your four investment cards. They don’t count toward fifteen coins, nobody can take them, and each card gives its best unlocked ability.</p>" : "") +
        (c.mod("advarabia") && !c.civ("arabia") ? "<p>If someone draws <b>Arabia</b>, we’re using <b>Advanced Arabia</b>: the Arabs gain only one culture per resource token spent, not two.</p>" : "") +
        (c.mod("advgreece") && !c.civ("greece") ? "<p>If someone draws <b>Greece</b>, we’re using <b>Advanced Greece</b>: instead of keeping trade, after the Greeks research or learn a tech they gain one culture for each player who does not currently know or is researching that tech.</p>" : "")
    },
    { when: (c) => c.has("ww"),
      h: "Wisdom and Warfare",
      body: (c) => "<p>We’re playing with <b>Wisdom and Warfare</b>. Each civilization has four double-sided <b>social policy</b> cards. You hold one adopted policy per city you’ve built" + (c.may("french") ? " — the French one more" : "") + ", and you must adopt a new one the moment that number goes up, so choose with care: they’re hard to change. There’s a fourth city action, <b>start a building program</b>: the next time that city produces, its outskirts production doubles. Some huts and villages found <b>city-states</b>: keep a figure on one and it counts as part of your capital’s outskirts" + (c.has("ff") ? "" : "; others bring <b>wealth</b>, a free coin token") + ". " + (c.has("ff") ? "Two more <b>relics</b> hide on the new tiles; scouts can’t go into those two without an army." : "Two new tiles hide <b>relics</b>: the first army to end its move on one claims a one-time reward, and scouts can’t go in without an army.") + " The new <b>Shipyard</b> building goes on water once you learn Navy.</p>" +
        "<p>The unit cards are replaced too — that’s the <b>strength</b> and <b>health</b> I mentioned in battle. And watch for <b>Roaming Horde</b>, a culture card that sends rank two barbarians at someone else’s army or city.</p>"
    },
    {
      h: "Don’t worry about these until they come up",
      body: (c) => "<ul>" +
        "<li><b>Culture event cards</b> — each says which phase you may play it in; you can hold two to start.</li>" +
        "<li><b>Great people</b> — placed in your outskirts like buildings; a Great General adds +4 in battle.</li>" +
        (c.mod("learn") ? "" : "<li><b>Wonders</b> — each card explains its ability; some techs obsolete them.</li>") +
        "<li><b>Changing government</b> — free the turn after you unlock one; otherwise through Anarchy, and your capital sits out a turn.</li>" +
        "<li><b>Upgrades</b> — a new tech upgrades all your units or buildings of a type at once, and new ones then cost more.</li>" +
        "<li><b>Scouts and blockades</b> — a scout sends its square’s icons to one of your cities; an enemy figure in your outskirts blocks that square.</li>" +
        "<li><b>Battle turns and loot</b> — the step-by-step battle turn and the FAQ loot table are in the reference.</li>" +
        (c.has("ff") ? "<li><b>Relic rewards, metropolis placement, “immune to anarchy”</b> — all in the reference.</li>" : "") +
        (c.mod("gp") ? "<li><b>Losing great person cards</b> — one card per marker of that type.</li>" : "") +
        (c.has("ww") ? "<li><b>Switching social policies</b> (e.g. Bureaucracy) and <b>two-phase culture cards</b> (you choose one effect).</li>" : "") +
        "</ul>"
    }
  ]
};
