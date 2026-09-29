/* =============================================================================
   Unfathomable — Setup & Reference Utility · data
   Sources (the only sources used):
     • Learn to Play (LTP), 28 pp.            → cited "Learn to Play p.N"
     • Rules Reference (RR), 24 pp.           → cited "Rules Ref p.N (§x.y)"
       "the definitive source for all Unfathomable rules" — RR wins over LTP (RR p.1).
     • From the Abyss rulebook, 12 pp.        → cited "From the Abyss p.N"
     • Unofficial FAQ (community compilation) → cited "Unofficial FAQ"; lowest tier,
       used only to clarify points the books leave open, never to override them.
   Page numbers are the printed page numbers (they equal the PDF page numbers in
   all three books).
   ============================================================================= */
var UF = {};

UF.expMeta = {
  core:  { name: "Base Game",      cls: "tag-core" },
  fta:   { name: "From the Abyss", cls: "tag-fta" },
  learn: { name: "Learning Game",  cls: "tag-learn" },
  vari:  { name: "Variant",        cls: "tag-var" },
  faq:   { name: "Unofficial FAQ", cls: "tag-faq" }
};

UF.expansions = [
  { id: "core", short: "Unfathomable", year: "2021",
    blurb: "The base game: the SS Atlantica, 10 characters, Deep Ones and the monarchs Father Dagon and Mother Hydra, Human / Hybrid / Cultist loyalties. Always in play." },
  { id: "fta", short: "From the Abyss", year: "2024",
    blurb: "Expansion: 8 new characters, allies, the three horrors, boon skill cards, Personal Crisis cards, optional preludes, plus new items, spells, waypoints, damage and mythos cards." }
];

UF.modes = [
  { id: "standard", name: "Standard game",
    blurb: "Rules Reference Appendix IV setup: a secret loyalty card from the start, 3 starting skill cards of your choice, the Cultist at 4 and 6 players." },
  { id: "learning", name: "Learning game (your first game)",
    blurb: "Learn to Play setup: full 5-card starting hands, no loyalty cards until everyone has taken one turn, no Cultist." }
];

/* Modules & variants. requires: set id; needs: another module; excludes: rival modules;
   avail(c): extra availability rule (c = config context). */
UF.modules = [
  { id: "prelude", requires: "fta", name: "Preludes",
    summary: "Resolve 1 day, 1 twilight and 1 night card before the loyalty deck",
    description: "Optional prelude cards vary setup and the starting state of the board. Day cards favor humans, twilight cards affect everyone, night cards favor hybrids.",
    src: "From the Abyss p.9" },
  { id: "prelHum", requires: "fta", needs: "prelude", excludes: ["prelHyb"], name: "Prelude balance — favor the humans",
    summary: "Swap night→twilight and/or twilight→day (everyone must agree)",
    description: "Modifying balance: replace night cards with twilight cards and/or twilight cards with day cards to favor the humans.",
    src: "From the Abyss p.9" },
  { id: "prelHyb", requires: "fta", needs: "prelude", excludes: ["prelHum"], name: "Prelude balance — favor the hybrids",
    summary: "Swap day→twilight and/or twilight→night (everyone must agree)",
    description: "Modifying balance: replace day cards with twilight cards and/or twilight cards with night cards to favor the hybrids.",
    src: "From the Abyss p.9" },
  { id: "prelExtra", requires: "fta", needs: "prelude", name: "Extra preludes",
    summary: "Draw and resolve additional prelude cards of any type",
    description: "Modifying balance: draw and resolve additional prelude cards of any type to further modify setup (everyone must agree).",
    src: "From the Abyss p.9" },
  { id: "nocult", requires: "core", name: "No-Cultist variant",
    avail: (c) => c.mode === "standard" && (c.p === 4 || c.p === 6),
    summary: "4 or 6 players: an extra Human card replaces the Cultist; dials start 7/6/6/7",
    description: "Appendix I: in four- and six-player games, add an additional Human loyalty card in place of the Cultist card and set the dials to Fuel 7, Food 6, Sanity 6, Souls 7.",
    src: "Rules Ref p.18 (Appendix I)" },
  { id: "easyH", requires: "core", excludes: ["easyT"], name: "Easier for the humans",
    summary: "Start with two more of each resource",
    description: "Appendix II: decided before the game starts — start the game with two more of each resource.",
    src: "Rules Ref p.18 (Appendix II)" },
  { id: "easyT", requires: "core", excludes: ["easyH"], name: "Easier for the traitors",
    summary: "Start with two fewer of each resource",
    description: "Appendix II: decided before the game starts — start the game with two fewer of each resource.",
    src: "Rules Ref p.18 (Appendix II)" }
];

/* Pure availability rule shared by app.js and the test harness. */
UF.modAvailable = function (mod, c, mods) {
  if (!c.has(mod.requires)) return false;
  if (mod.needs && !mods.has(mod.needs)) return false;
  if (mod.avail && !mod.avail(c)) return false;
  return true;
};

/* ---------------------------------------------------------------------------
   Helpers
   --------------------------------------------------------------------------- */
UF.word = (n) => ({ 3: "three", 4: "four", 5: "five", 6: "six" })[n] || String(n);
UF.ul = (items) => "<ul>" + items.filter(Boolean).map(i => "<li>" + i + "</li>").join("") + "</ul>";
UF.ol = (items) => "<ol>" + items.filter(Boolean).map(i => "<li>" + i + "</li>").join("") + "</ol>";
UF.src = (...parts) => parts.filter(Boolean).join(" · ");

/* Loyalty deck for a configuration. Standard: Rules Ref p.23 (also Learn to Play p.28 and
   From the Abyss p.12). Learning game: Learn to Play p.7 (Cultist replaced by a Human).
   No-Cultist variant: Rules Ref p.18. */
UF.loy = function (c) {
  const p = c.p;
  const hyb = p >= 5 ? 2 : 1;
  const cultSlot = (p === 4 || p === 6);
  const cult = (cultSlot && c.mode !== "learning" && !c.mod("nocult")) ? 1 : 0;
  const hum = ({ 3: 5, 4: 6, 5: 8, 6: 9 })[p] + ((cultSlot && !cult) ? 1 : 0);
  return { hyb: hyb, cult: cult, hum: hum, total: hyb + cult + hum, cultSlot: cultSlot };
};

/* Starting dials. Base 8 each (Rules Ref p.20 step 3). No-Cultist variant 7/6/6/7 (Rules Ref p.18
   App. I, 4 and 6 players only). Appendix II: two more / two fewer of each resource. */
UF.dials = function (c) {
  const nc = c.mode !== "learning" && c.mod("nocult") && (c.p === 4 || c.p === 6);
  const base = nc ? { fuel: 7, food: 6, sanity: 6, souls: 7 } : { fuel: 8, food: 8, sanity: 8, souls: 8 };
  const d = c.mod("easyH") ? 2 : (c.mod("easyT") ? -2 : 0);
  const v = {};
  Object.keys(base).forEach(k => { v[k] = base[k] + d; });
  return { v: v, nc: nc, d: d };
};
UF.dialText = (v) => "Fuel <b>" + v.fuel + "</b> · Food <b>" + v.food + "</b> · Sanity <b>" + v.sanity + "</b> · Souls <b>" + v.souls + "</b>";

/* Base-game lines of succession (back of the title cards): Learn to Play p.7, Rules Ref p.23. */
UF.captainLine = ["Keilani Tatupu, the Captain", "Arjun Singh, the First Mate", "Jeanne Lafarge, the Engineer",
  "Jamie Snell, the Master-At-Arms", "Svetlana Gedroits, the Ship’s Surgeon", "Beatrice Sharpe, the Mathematician",
  "Edmund Mallory, the Jinx", "Ishmael Marsh, the Exile", "William Bowleg, the Apprentice", "Samira Dualeh, the Stowaway"];
UF.keeperLine = ["William Bowleg, the Apprentice", "Ishmael Marsh, the Exile", "Beatrice Sharpe, the Mathematician",
  "Edmund Mallory, the Jinx", "Samira Dualeh, the Stowaway", "Svetlana Gedroits, the Ship’s Surgeon",
  "Jamie Snell, the Master-At-Arms", "Jeanne Lafarge, the Engineer", "Arjun Singh, the First Mate", "Keilani Tatupu, the Captain"];

/* Learning game suggested characters: Learn to Play p.6. */
UF.suggested = {
  3: ["Jeanne Lafarge", "Svetlana Gedroits", "William Bowleg"],
  4: ["Arjun Singh", "Jeanne Lafarge", "Samira Dualeh", "William Bowleg"],
  5: ["Arjun Singh", "Jamie Snell", "Samira Dualeh", "Svetlana Gedroits", "William Bowleg"],
  6: ["Arjun Singh", "Jeanne Lafarge", "Jamie Snell", "Samira Dualeh", "Svetlana Gedroits", "William Bowleg"]
};
/* Highest of the suggested characters on each base line of succession. */
UF.firstOnLine = function (line, names) {
  for (const entry of line) {
    const nm = entry.split(",")[0];
    if (names.indexOf(nm) !== -1) return nm;
  }
  return "";
};

/* =============================================================================
   SETUP PHASES — c = { has(set), mode, p, mod(id) }
   Order follows Rules Ref Appendix IV (p.20–23), with the From the Abyss insertions
   placed where From the Abyss p.3 and p.9 put them.
   ============================================================================= */
UF.phases = [
  {
    title: "Before You Begin",
    steps: [
      { when: (c) => c.mode === "learning", exp: "learn",
        t: "First time out of the box: assemble the dials",
        d: "<ul><li>Before playing Unfathomable for the first time, attach the <b>four resource dials</b> to the board with their plastic connectors.</li></ul>",
        src: "Learn to Play p.2" },
      { when: (c) => c.has("fta"), exp: "fta",
        t: "From the Abyss — update the base game components",
        d: (c) => UF.ul([
          c.mode === "learning" ? "<b>Note:</b> From the Abyss writes its setup changes against the Rules Reference’s standard setup (its pages 20–23). Neither book covers combining the expansion with the Learn to Play’s first-game setup; the steps below simply apply the same changes to it." : "",
          "<b>Add</b> to the existing decks: 12 skill cards (2 each of influence, lore, observation, strength, will and treachery), 10 item cards, 2 ship damage cards, 10 waypoint cards, 10 spell cards and 72 mythos cards (the 72 include the <b>12 Personal Crisis</b> cards).",
          "<b>Remove</b> every character-specific (green) mythos card from the mythos deck and <b>set them aside</b> — they are still used, at the “Create play areas” step.",
          "<b>Replace</b> with the updated versions: the Captain title card, the Keeper of the Tome title card, the Jam Tin Grenade item card, the 6 player reference sheets and the 3 traitor reference sheets.",
          "Keep the rest of the expansion ready: 3 horror figures, 4 horror cards and the horror token; 23 boon cards; 12 ally cards; 2 overlay tiles (boon and ally); the 8 new characters (sheets, feat cards, standees and their character-specific mythos cards); 3 expansion reference sheets" + ", and the 15 optional prelude cards.",
          "Every expansion card and sheet carries the <b>From the Abyss icon</b>, so you can sort them back out later."
        ]),
        src: (c) => UF.src("From the Abyss p.2–3", c.mode === "learning" ? "Rules Ref p.23" : "") }
    ]
  },
  {
    title: "The Board, Tracks & Supply",
    steps: [
      { when: () => true, exp: "core",
        t: "Prepare the game board",
        d: "<ul><li>Place the game board in the center of the table.</li></ul>",
        src: "Rules Ref p.20 (step 1) · Learn to Play p.4" },
      { when: () => true, exp: "core",
        t: "Set the tracks",
        d: "<ul><li>Place the <b>travel track token</b> and the <b>ritual track token</b> on the <b>Start</b> space of their tracks.</li>" +
           "<li>Each track runs Start → three spaces → <b>Arrive</b> (travel) or <b>Cast</b> (ritual), so four advances reach the end.</li></ul>",
        src: "Rules Ref p.20 (step 2) · Learn to Play p.5, p.14" },
      { when: () => true, exp: (c) => (UF.dials(c).nc || UF.dials(c).d) ? "vari" : "core",
        t: "Set the resource dials",
        d: (c) => {
          const D = UF.dials(c);
          const items = [];
          if (!D.nc && !D.d) items.push("Set each of the four resource dials to its starting value of <b>8</b>: " + UF.dialText(D.v) + ".");
          else {
            items.push("Set the dials to: " + UF.dialText(D.v) + ".");
            if (D.nc) items.push("<b>No-Cultist variant</b> (4 or 6 players): Fuel 7, Food 6, Sanity 6, Souls 7 instead of 8 each.");
            if (D.d > 0) items.push("<b>Easier for the humans</b>: start with two more of each resource" + (D.nc ? " (applied here to the No-Cultist values)" : "") + ".");
            if (D.d < 0) items.push("<b>Easier for the traitors</b>: start with two fewer of each resource" + (D.nc ? " (applied here to the No-Cultist values)" : "") + ".");
          }
          if (c.mode === "learning" && (c.p === 4 || c.p === 6)) items.push("<b>Learning game:</b> the Learn to Play starts every dial at 8" + (D.d ? " (before the difficulty adjustment)" : "") + " even at four and six players, although its loyalty deck swaps the Cultist for a Human card — the lower 7/6/6/7 start belongs only to the Rules Reference’s No-Cultist variant.");
          items.push("A resource can never go above <b>10</b>; gains beyond 10 are ignored. If <b>any</b> dial reaches <b>0</b>, the game ends at once — a Deep One victory.");
          return UF.ul(items);
        },
        src: (c) => {
          const D = UF.dials(c);
          const lrn46 = c.mode === "learning" && (c.p === 4 || c.p === 6);
          return UF.src("Rules Ref p.20 (step 3)", "Learn to Play p.5" + (lrn46 ? ", p.28" : ""),
            (D.nc || D.d || lrn46) ? "Rules Ref p.18 (Appendix " + (D.nc && D.d ? "I–II" : D.nc ? "I" : D.d && lrn46 ? "I–II" : D.d ? "II" : "I") + ")" : "", "Rules Ref p.12 (§36.1)");
        } },
      { when: () => true, exp: "core",
        t: "Create the supply",
        d: "<ul><li>Place the <b>Deep One figures</b>, <b>passenger tokens</b>, <b>traitor rings</b> and the <b>eight-sided die</b> next to the board.</li>" +
           "<li>Flip every passenger token <b>facedown</b> and mix them thoroughly.</li>" +
           "<li>The box holds 20 Deep Ones, 9 passenger tokens and 4 traitor rings.</li></ul>",
        src: "Rules Ref p.20 (step 4) · Learn to Play p.3, p.5" },
      { when: (c) => c.has("fta"), exp: "fta",
        t: "Create the horror deck (new step)",
        d: "<ul><li>Place the three <b>horror figures</b> (Shoggoth, Drowned Spirit, Grasping Tendril) in the supply.</li>" +
           "<li>Shuffle the four <b>horror cards</b> and place them facedown on the top-left corner of the board: this is the horror deck.</li>" +
           "<li>Place the <b>horror token</b> on the <b>Start</b> space of the horror track, printed on the back of the horror deck (Start → one space → Spawn).</li></ul>",
        src: "From the Abyss p.3, p.7" }
    ]
  },
  {
    title: "Decks, Monsters & the Chaos Deck",
    steps: [
      { when: () => true, exp: (c) => c.has("fta") ? "fta" : "core",
        t: "Create the skill decks",
        d: (c) => UF.ul([
          "Separate the skill cards by type — <b>influence</b> (orange), <b>lore</b> (purple), <b>observation</b> (green), <b>strength</b> (red), <b>will</b> (blue) and <b>treachery</b> (black) — shuffle each type into its own deck and place each deck facedown beside the board next to its label.",
          c.has("fta") ? "<b>From the Abyss:</b> place the <b>boon overlay tile</b> on the board edge to the left of the treachery label, shuffle the <b>boon cards</b> and place them facedown next to the tile." : ""
        ]),
        src: (c) => UF.src("Rules Ref p.21 (step 5)", "Learn to Play p.5, p.28", c.has("fta") ? "From the Abyss p.3" : "") },
      { when: () => true, exp: (c) => c.has("fta") ? "fta" : "core",
        t: "Create the damage and mythos decks",
        d: (c) => UF.ul([
          "Shuffle the <b>damage deck</b> and place it beside the board next to its label.",
          "Shuffle the <b>mythos deck</b> and place it near the board.",
          c.has("fta") ? "<b>From the Abyss:</b> the mythos deck now includes the expansion’s 72 cards (with the 12 Personal Crisis cards) and <b>no</b> character-specific cards — those were set aside." : ""
        ]),
        src: (c) => UF.src("Rules Ref p.21 (step 6)", "Learn to Play p.5", c.has("fta") ? "From the Abyss p.3, p.9" : "") },
      { when: () => true, exp: "core",
        t: "Place monsters and passengers",
        d: "<ul><li>Place <b>Father Dagon</b> and <b>Mother Hydra</b> in <b>the Deep</b>.</li>" +
           "<li>Place <b>six Deep Ones</b> around the bow:<ul>" +
             "<li><b>2</b> in water space <b>1–4</b></li><li><b>1</b> in deck space <b>1</b></li><li><b>1</b> in deck space <b>2</b></li><li><b>2</b> in water space <b>5–8</b></li></ul></li>" +
           "<li>Place <b>two passenger tokens</b> facedown: one in deck space <b>3</b>, one in deck space <b>4</b>.</li>" +
           "<li>That leaves 14 Deep Ones and 7 passengers in the supply — both counts are open information.</li></ul>",
        src: "Rules Ref p.21 (step 7, diagram) · Learn to Play p.3–4 · Rules Ref p.11 (§30.3)" },
      { when: () => true, exp: (c) => c.has("fta") ? "fta" : "core",
        t: "Create the chaos deck",
        d: (c) => UF.ul([
          "Without looking, take <b>two cards from each skill deck except treachery</b> (influence, lore, observation, strength, will) and shuffle them together.",
          c.has("fta") ? "<b>From the Abyss:</b> also take <b>two boon</b> and <b>two treachery</b> cards, unseen, and shuffle them in — <b>14 cards</b> in all." : "That makes a <b>10-card</b> chaos deck.",
          "Place it on the chaos deck space on the board, next to the Deep. Nobody may look at chaos cards; how many remain is open information."
        ]),
        src: (c) => UF.src("Rules Ref p.21 (step 8)", "Learn to Play p.4", "Rules Ref p.6 (§10)", c.has("fta") ? "From the Abyss p.3" : "") }
    ]
  },
  {
    title: "Characters",
    steps: [
      { when: () => true, exp: (c) => c.mode === "learning" ? "learn" : "core",
        t: "Select characters",
        d: (c) => {
          const items = [
            "Randomly choose a player to be the <b>current player</b> and give them the <b>current player token</b>.",
            "Starting with the current player and going clockwise, each player chooses <b>one character</b> and takes that character’s sheet. Return the remaining sheets to the box.",
            "Tip: pick with the group’s skills in mind — it matters to have a wide variety of skills available."
          ];
          if (c.mode === "learning") items.push("<b>Learning game — suggested characters for " + UF.word(c.p) + " players:</b> " + UF.suggested[c.p].join(", ") + ".");
          if (c.has("fta")) items.push("<b>From the Abyss</b> adds 8 characters to choose from.");
          return UF.ul(items);
        },
        src: (c) => UF.src("Rules Ref p.22 (step 9)", "Learn to Play p.6", c.has("fta") ? "From the Abyss p.2–3" : "") },
      { when: () => true, exp: (c) => c.has("fta") ? "fta" : "core",
        t: "Create play areas",
        d: (c) => UF.ul([
          "Each player takes the <b>feat card</b> and <b>standee</b> of their character and a double-sided <b>player reference sheet</b>, and places them in their play area.",
          "Return the remaining reference sheets, feat cards and standees to the box.",
          c.has("fta") ? "<b>From the Abyss:</b> each player also takes the <b>character-specific mythos card</b> for their character and places it <b>facedown</b> in their play area. Return the remaining character-specific mythos cards to the box." : ""
        ]),
        src: (c) => UF.src("Rules Ref p.22 (step 10)", "Learn to Play p.6", c.has("fta") ? "From the Abyss p.3" : "") },
      { when: () => true, exp: "core",
        t: "Gather items",
        d: "<ul><li>Each player takes the <b>starting item</b> named on the back of their character sheet from the item deck and places it faceup in their play area.</li>" +
           "<li>Shuffle the remaining items to form the <b>item deck</b> and place it beside the board next to its label.</li></ul>",
        src: "Rules Ref p.22 (step 11) · Learn to Play p.6" },
      { when: () => true, exp: "core",
        t: "Place characters",
        d: "<ul><li>Each player places their standee in the <b>starting space</b> named on the back of their character sheet.</li></ul>",
        src: "Rules Ref p.22 (step 12) · Learn to Play p.6" },
      { when: () => true, exp: (c) => c.mode === "learning" ? "learn" : "core",
        t: "Draw starting skill cards",
        d: (c) => c.mode === "learning"
          ? "<ul><li><b>Learning game:</b> each player <b>except the current player</b> draws the <b>five skill cards</b> listed at the bottom of their character sheet (their full skill set).</li>" +
            "<li>The current player starts the game with <b>no cards</b> in hand.</li></ul>"
          : "<ul><li>Starting with the player to the <b>left of the current player</b> and going clockwise, each player <b>except the current player</b> draws <b>any three skill cards</b> of their choice from within their character’s skill set.</li>" +
            "<li>The current player starts the game with <b>no cards</b> in hand.</li>" +
            "<li>This differs from the Learn to Play’s first-game setup (five cards).</li></ul>",
        src: (c) => c.mode === "learning" ? "Learn to Play p.7 (step 13), p.26" : "Rules Ref p.23 (step 13)" }
    ]
  },
  {
    title: "Titles, Waypoints, Spells & Allies",
    steps: [
      { when: () => true, exp: (c) => c.has("fta") ? "fta" : "core",
        t: "Create the waypoint deck — the Captain",
        d: (c) => {
          const items = ["Shuffle the <b>waypoint cards</b>; give the deck and the <b>Captain title card</b> to the player whose character is <b>highest on the Captain line of succession</b> (printed on the back of the Captain title card)."];
          if (c.has("fta")) items.push("<b>From the Abyss:</b> use the updated Captain title card and its printed line of succession.");
          else {
            items.push("<details class='inline-det'><summary>Captain line of succession</summary>" + UF.ol(UF.captainLine) + "</details>");
            if (c.mode === "learning") items.push("With the suggested characters, the Captain is <b>" + UF.firstOnLine(UF.captainLine, UF.suggested[c.p]) + "</b>.");
          }
          return UF.ul(items);
        },
        src: (c) => UF.src("Rules Ref p.23 (step 14)", "Learn to Play p.7", c.has("fta") ? "From the Abyss p.3" : "") },
      { when: () => true, exp: (c) => c.has("fta") ? "fta" : "core",
        t: "Create the spell deck — the Keeper of the Tome",
        d: (c) => {
          const items = ["Shuffle the <b>spell cards</b>; give the deck and the <b>Keeper of the Tome title card</b> to the player whose character is <b>highest on the Keeper line of succession</b> (printed on the back of the Keeper title card)."];
          if (c.has("fta")) items.push("<b>From the Abyss:</b> use the updated Keeper title card — its action now looks at the <b>top 3</b> spells, puts 2 on the bottom in any order and resolves the third (limit once per turn).");
          else {
            items.push("<details class='inline-det'><summary>Keeper of the Tome line of succession</summary>" + UF.ol(UF.keeperLine) + "</details>");
            if (c.mode === "learning") items.push("With the suggested characters, the Keeper is <b>" + UF.firstOnLine(UF.keeperLine, UF.suggested[c.p]) + "</b>.");
          }
          return UF.ul(items);
        },
        src: (c) => UF.src("Rules Ref p.23 (step 15)", "Learn to Play p.7", c.has("fta") ? "From the Abyss p.2–3" : "") },
      { when: (c) => c.has("fta"), exp: "fta",
        t: "Create the ally deck (new step)",
        d: "<ul><li>Place the <b>ally overlay tile</b> on the board edge to the left of the item card label. Shuffle the <b>ally cards</b> and place them facedown next to the tile.</li>" +
           "<li>Roll the die <b>twice</b>, rerolling until the two results are <b>different</b>. Spawn <b>one ally</b> (faceup) in the <b>interior space</b> matching each result:" +
             "<ul><li>1–2 Bridge · 3 Chapel · 4 Captain’s Cabin · 5 Cargo Hold · 6 Galley · 7–8 Boiler Room</li></ul></li>" +
           "<li>As written, two different results can still name the same room (1 and 2 are both the Bridge; 7 and 8 both the Boiler Room).</li></ul>",
        src: "From the Abyss p.3–4 · Learn to Play p.11 (space numbers)" },
      { when: (c) => c.has("fta") && c.mod("prelude"), exp: "fta",
        t: "Resolve preludes (optional)",
        d: (c) => {
          const items = [
            "Shuffle the <b>day</b>, <b>twilight</b> and <b>night</b> prelude cards separately.",
            "Draw <b>1 day</b> card, read it aloud and resolve it; then <b>1 twilight</b> card; then <b>1 night</b> card.",
            "Then <b>remove all prelude cards</b> from the game.",
            "Day cards favor the humans (e.g. Favorable Conditions: advance the travel track 2 spaces without moving anything in the water); twilight cards affect everyone (e.g. Valuable Lessons: each player takes a random unused feat card); night cards favor the hybrids (e.g. Boarding Party: a Deep One spawns in deck spaces 3 and 4, and their passengers move to the closest water space)."
          ];
          if (c.mod("prelHum")) items.push("<b>Balance — favor the humans</b> (everyone agrees): replace the night card with a twilight card and/or the twilight card with a day card.");
          if (c.mod("prelHyb")) items.push("<b>Balance — favor the hybrids</b> (everyone agrees): replace the day card with a twilight card and/or the twilight card with a night card.");
          if (c.mod("prelExtra")) items.push("<b>Extra preludes</b> (everyone agrees): draw and resolve additional prelude cards of any type.");
          return UF.ul(items);
        },
        src: "From the Abyss p.9" }
    ]
  },
  {
    title: "Loyalties",
    steps: [
      { when: () => true, exp: (c) => c.mode === "learning" ? "learn" : (c.mod("nocult") ? "vari" : "core"),
        t: "Create the loyalty deck",
        d: (c) => {
          const L = UF.loy(c);
          const items = [
            "Combine these loyalty cards for <b>" + UF.word(c.p) + " players</b>:" +
              "<div class='loy-line'><span class='lc lc-hyb'>" + L.hyb + " Hybrid</span>" +
              (L.cult ? "<span class='lc lc-cult'>1 Cultist</span>" : "") +
              "<span class='lc lc-hum'>" + L.hum + " Human</span><span class='lc lc-tot'>= " + L.total + " cards</span></div>",
            "That is <b>two cards per player</b>: one is dealt at setup" + (c.mode === "learning" ? " (after the first round, in the learning game)" : "") + ", the other at the <b>awakening phase</b> — so by then every card is out and at least one player is a traitor."
          ];
          if (c.mode === "learning") items.push("<b>Learning game:</b> only Human and Hybrid cards — the Cultist card is not used" + (L.cultSlot ? " (it is replaced by an extra Human card)" : "") + ".");
          else if (c.mod("nocult")) items.push("<b>No-Cultist variant:</b> an additional Human card replaces the Cultist.");
          else if (L.cult) items.push("The <b>Cultist</b> is used only in four- and six-player games.");
          else items.push("There is no Cultist card at " + UF.word(c.p) + " players.");
          return UF.ul(items);
        },
        src: (c) => c.mode === "learning" ? "Learn to Play p.7 (step 16), p.8, p.23, p.28"
          : UF.src("Rules Ref p.23 (step 16)", "Rules Ref p.11 (§29.10)", c.mod("nocult") ? "Rules Ref p.18 (Appendix I)" : "", "Learn to Play p.23") },
      { when: () => true, exp: (c) => c.mode === "learning" ? "learn" : "core",
        t: (c) => c.mode === "learning" ? "Loyalty cards — not yet!" : "Deal loyalty cards",
        d: (c) => c.mode === "learning"
          ? "<ul><li><b>Learning game:</b> nobody gets a loyalty card at setup. Everyone plays as (and should assume they are) a <b>loyal human</b>, and questions are welcome.</li>" +
            "<li>Once <b>every player has taken one turn</b>, shuffle and deal <b>one loyalty card</b> to each player. Everyone looks at their own card for <b>30 seconds</b> — eyes on your own card the whole time, so no reaction gives you away — then places it <b>facedown</b> in their play area.</li>" +
            "<li>The undealt cards stay as the loyalty deck for the <b>awakening phase</b>. Then continue under the normal rules.</li></ul>"
          : "<ul><li>Shuffle the loyalty deck and deal <b>one card facedown</b> to each player.</li>" +
            "<li>Everyone looks at their card <b>at the same time</b>; when all are done, place it <b>facedown</b> in your play area. (The Learn to Play suggests a full <b>30 seconds</b>, eyes only on your own card.)</li>" +
            "<li>The undealt cards stay as the loyalty deck for the <b>awakening phase</b>.</li>" +
            "<li>You may look at your own loyalty cards at any time — but peeking during play can give you away. The number of loyalty cards each player has is open information.</li></ul>",
        src: (c) => c.mode === "learning" ? "Learn to Play p.7, p.21, p.22" : "Rules Ref p.23 (step 17) · Learn to Play p.22 · Rules Ref p.9 (§25.7), p.11 (§30.5)" }
    ]
  },
  {
    title: "Ready to Sail",
    steps: [
      { when: () => true, exp: "core",
        t: "Agree on table talk",
        d: "<ul><li>Hidden traitors need cover, so agree <b>before the game begins</b> how much players may say. The recommended starting point:<ul>" +
             "<li>No one has to tell the truth — except about open information.</li>" +
             "<li>Speak only in generalities about hidden information.</li>" +
             "<li>Never name the titles, types, colors or values of cards you add to a skill check.</li>" +
             "<li>Ask only yes/no questions about someone’s hidden information.</li>" +
             "<li>Never ask someone outright if they are a traitor (accusations are fine).</li></ul></li>" +
           "<li>See <b>Table talk — secrecy guidelines</b> in the reference below.</li></ul>",
        src: "Rules Ref p.19 (Appendix III) · Learn to Play p.26" },
      { when: () => true, exp: "core",
        t: "The current player takes the first turn",
        d: (c) => "<ul><li>The current player begins, then play passes <b>clockwise</b> (to the left).</li>" +
          "<li>A human’s turn: <b>1 Receive Skills</b> (draw your skill set) → <b>2 Action</b> (two actions) → <b>3 Mythos</b> (draw and resolve a mythos card) → <b>4 Discard</b> (everyone down to 10 cards).</li>" +
          (c.mode === "learning" ? "<li><b>Learning game:</b> after everyone’s first turn, deal the loyalty cards (see above).</li>" : "") + "</ul>",
        src: (c) => UF.src("Rules Ref p.17 (§53.1–53.8)", "Learn to Play p.10", c.mode === "learning" ? "Learn to Play p.21" : "") }
    ]
  }
];

/* =============================================================================
   RULES REFERENCE
   ============================================================================= */
UF.reference = [
  {
    title: "Loyalties & victory — who wins, exactly",
    open: true,
    when: () => true,
    html: (c) => {
      const L = UF.loy(c);
      const cols = [3, 4, 5, 6].map(p => {
        const cc = Object.assign({}, c, { p: p });
        return Object.assign({ p: p }, UF.loy(cc));
      });
      const th = cols.map(x => "<th" + (x.p === c.p ? " class='cur'" : "") + ">" + x.p + (x.p === c.p ? " ◆" : "") + "</th>").join("");
      const row = (label, f) => "<tr><th scope='row'>" + label + "</th>" + cols.map(x => "<td" + (x.p === c.p ? " class='cur'" : "") + ">" + f(x) + "</td>").join("") + "</tr>";
      const modeNote = c.mode === "learning" ? "Learning game — no Cultist" : (c.mod("nocult") ? "No-Cultist variant at 4 and 6 players" : "Standard game");
      let h = "<h4>The loyalty deck (" + modeNote + ")</h4>" +
        "<div class='tbl-wrap'><table class='tbl loy-table'><caption>Players (◆ = this game)</caption><thead><tr><th scope='col'>Cards</th>" + th + "</tr></thead><tbody>" +
        row("Hybrid", x => x.hyb) + row("Cultist", x => x.cult) + row("Human", x => x.hum) +
        row("Total (2 per player)", x => x.total) +
        /* Derived, not printed: each player is dealt 2 cards, and a traitor who hands cards on keeps the
           revealed one (hand-offs never reduce the number of holders), so N traitor cards sit with at
           least ceil(N/2) and at most N players — e.g. 6 players standard: 2–3, not 1–3 (audit 1). */
        row("Traitors once all cards are out", x => { const t = x.hyb + x.cult, lo = Math.ceil(t / 2); return lo === t ? String(t) : lo + "–" + t; }) +
        "</tbody></table></div>" +
        "<p class='note'>This game: <b>" + L.hyb + " Hybrid</b>" + (L.cult ? " + <b>1 Cultist</b>" : "") + " + <b>" + L.hum + " Human</b>. One card each at setup" + (c.mode === "learning" ? " (after the first round)" : "") + ", one each at the awakening. Before the awakening there may be <i>no</i> traitor yet; after it, every card is out, so at least one player holds a Hybrid. A player can hold two traitor cards, so the number of traitors is a range.</p>";
      h += "<h4>Who is on which side</h4>" + UF.ul([
        "<b>Only Human cards</b> → loyal to the humans.",
        "<b>At least one Hybrid card</b> → a <b>traitor</b>, loyal to the Deep Ones — even if you also hold Human cards.",
        L.cultSlot && L.cult ? "<b>The Cultist card</b> (4 and 6 players only) → a traitor loyal to the Deep Ones, who wins only if the ship has already traveled <b>12+ distance</b> when it goes down — even if they also hold Human cards." : "",
        L.cult ? "<b>Hybrid + Cultist</b> in one hand → use the <b>Hybrid</b> condition (win whenever the Deep Ones do, whatever the distance)." : "",
        "Until a traitor <b>reveals</b>, they are a <b>human</b> for every game effect. Revealing (or not) never changes whether you can win.",
        "Loyalty can change mid-game: cards are handed on when someone reveals before 12 distance, and revealed traitors hand on the card they get at the awakening."
      ]);
      h += "<h4>The game ends immediately when…</h4>" + UF.ol([
        "the travel track advances to <b>Arrive</b> while the waypoint cards in play already total <b>12 or more</b> distance → <b>the human objective</b>;",
        "<b>any resource dial reaches 0</b> → a Deep One objective;",
        "<b>six spaces are damaged</b> at the same time → a Deep One objective;",
        "Deep Ones must be <b>spawned</b> but the supply is short → a Deep One objective."
      ]) + "<p>Then <b>everyone reveals all their loyalty cards</b>.</p>";
      h += "<h4>Winners</h4><div class='tbl-wrap'><table class='tbl win-matrix'><thead><tr><th scope='col'>You hold</th><th scope='col'>Ship arrives</th><th scope='col'>Ship lost, distance &lt; 12</th><th scope='col'>Ship lost, distance 12+</th></tr></thead><tbody>" +
        "<tr><th scope='row'>Only Human</th><td class='w'>WIN</td><td class='l'>lose</td><td class='l'>lose</td></tr>" +
        "<tr><th scope='row'>Any Hybrid</th><td class='l'>lose</td><td class='w'>WIN</td><td class='w'>WIN</td></tr>" +
        (L.cult ? "<tr><th scope='row'>Cultist, no Hybrid</th><td class='l'>lose</td><td class='l'>lose</td><td class='w'>WIN</td></tr>" : "") +
        "</tbody></table></div>" +
        "<p class='note'><b>Ship arrives</b> = the human objective. <b>Ship lost</b> = any Deep One objective (a dial at 0, six damaged spaces, or Deep Ones that can’t be spawned). <b>Any Hybrid</b> = at least one Hybrid card, whatever else you hold." +
        (L.cult ? " “Distance 12+” includes a game that ends while resolving the waypoint card that brings the total to 12." : " No Cultist in this game" + (L.cultSlot ? "" : " — the Cultist is used only at 4 and 6 players") + ".") + "</p>";
      return h;
    },
    src: (c) => UF.src("Rules Ref p.7–8 (§18)", "Rules Ref p.9 (§25)", "Rules Ref p.11 (§29)", "Rules Ref p.23", c.mode === "learning" ? "Learn to Play p.7, p.28" : "Learn to Play p.28", c.mod("nocult") ? "Rules Ref p.18" : "", "Learn to Play p.21–23")
  },
  {
    title: "Turn structure — humans and revealed traitors",
    when: () => true,
    html: (c) => "<h4>Human (and hidden traitor) turn</h4>" + UF.ol([
        "<b>Receive Skills</b> — draw the types and numbers of skill cards in your skill set (on your character sheet). In the <b>Sick Bay</b>: draw only <b>one</b> card of your choice from it. In the <b>Brig</b>: your full set. Switch your active Improvement item first, if you like — before drawing.",
        "<b>Action</b> — perform <b>two actions</b>, one at a time; repeats allowed. Abilities that say “Then perform 1 action” give you more.",
        "<b>Mythos</b> — draw and resolve the top mythos card (in the Brig: only its icons).",
        "<b>Discard</b> — <b>every</b> player with more than 10 skill cards discards down to 10."
      ]) + "<p>Then pass the current player token to your <b>left</b>. Tip: turn the token’s wheel to count actions left.</p>" +
      "<h4>Revealed traitor turn</h4>" + UF.ol([
        "<b>Receive Skills</b> — you may skip any number of the cards in your skill set; for each card skipped, draw <b>one treachery card</b> instead. Decide how many before drawing anything.",
        "<b>Action</b> — two actions (revealed-traitor options).",
        "<b>Discard</b> — everyone down to 10."
      ]) + "<p>A revealed traitor has <b>no Mythos step</b>. Reveal during your own turn and you finish your remaining actions but skip that turn’s Mythos step.</p>",
    src: (c) => "Rules Ref p.17–18 (§53) · Rules Ref p.6 (§9.7, §9.12), p.9 (§24.10), p.12 (§38.8), p.13 (§40.1) · Learn to Play p.10–13, p.24"
  },
  {
    title: "Actions",
    when: () => true,
    html: (c) => {
      const f = c.has("fta");
      return "<h4>Human actions (two per turn)</h4>" + UF.ul([
        "<b>Move</b> to any ship space. Not while you are in the Brig; never into water spaces or the Deep; never voluntarily into the <b>Brig</b> or the <b>Sick Bay</b>.",
        "<b>Attack</b> " + (f ? "an <b>enemy</b> in your space — a Deep One, a revealed traitor or a <b>horror</b> (a horror is repelled, not defeated)." : "a <b>Deep One</b> or <b>revealed traitor</b> in your space.") + " See Attacks.",
        f ? "<b>Rescue</b> <b>each</b> passenger in your space, <b>or one</b> passenger in an adjacent water space — then <b>spawn one ally</b> in your space (one ally per rescue action)."
          : "<b>Rescue</b> a passenger in your space: return the token facedown to the supply without looking (one passenger per action).",
        "<b>Trade</b> — enable trading of items: any players in your space may give and receive any number of items; you need not take part yourself.",
        "<b>Use an “Action:” ability</b> on your character sheet, feat card, items, title card or any other card in your play area, or on a skill card in your hand (reveal it, resolve it, discard it). Humans cannot use treachery card abilities.",
        "<b>Use your space’s action ability</b> (interior spaces) — once per space per turn; not while a " + (f ? "Deep One, revealed traitor or horror (any enemy)" : "Deep One or revealed traitor") + " is in the space (the Brig is exempt). In a <b>damaged</b> space, use the damage card’s action to <b>repair</b> it instead — repairing doesn’t count against the once-per-turn limit.",
        "<b>Reveal as a traitor</b> — only if you hold a Hybrid or Cultist loyalty card."
      ]) + "<h4>Revealed traitor actions (two per turn)</h4>" + UF.ul([
        "<b>Move</b> to any ship space. Leaving the <b>Brig</b>: first discard skill cards totaling <b>12+</b> in value, all at once. Never into water, the Deep, or voluntarily into the Brig or Sick Bay.",
        "<b>Attack a human</b> in your space.",
        "<b>Defeat a passenger</b> in your space" + (f ? " <b>or an adjacent water space</b>" : "") + " — only if no human is in your space.",
        "<b>Use an “Action:” ability</b> on a card in your hand or play area — never your character sheet or your space."
      ]) + "<p class='note'>Some treachery cards are played at the <b>start</b> of your Action step and “end your Action step”: after one, you take no actions and play no other start-of-Action cards that turn.</p>";
    },
    src: (c) => UF.src("Rules Ref p.2–3 (§2–3)", "Rules Ref p.12 (§35)", "Rules Ref p.17 (§52.2)", "Learn to Play p.10–11, p.25", c.has("fta") ? "From the Abyss p.2 (updated sheets), p.4, p.7" : "")
  },
  {
    title: "The ship — spaces and interior actions",
    when: () => true,
    html: (c) => {
      const f = c.has("fta");
      return "<div class='tbl-wrap'><table class='tbl space-table'><thead><tr><th scope='col'>Die #</th><th scope='col'>Interior space</th><th scope='col'>Action ability (once per space per turn)</th></tr></thead><tbody>" +
        "<tr><td>1–2</td><th scope='row'>Bridge</th><td>Risk a passenger to look at the top 2 cards of the <b>mythos</b> or <b>waypoint</b> deck; put 1 on top of that deck and 1 on the bottom. (No passengers left to risk → can’t be used.)</td></tr>" +
        "<tr><td>3</td><th scope='row'>Chapel</th><td>Choose 1: <b>retreat</b> the ritual track 1 space; <b>or</b> discard 1 <b>lore</b> card and roll — if roll + the card’s value is <b>6 or less</b>, lose 1 sanity; then <b>advance</b> the ritual track 1 space.</td></tr>" +
        "<tr><td>4</td><th scope='row'>Captain’s Cabin</th><td><b>Skill check 8</b> — supporting <b>influence</b> + <b>observation</b>. Choose " + (f ? "a human (updated sheet; the Rules Reference says another human)" : "a character (the Rules Reference says another human)") + "; if the check passes, move them to the <b>Brig</b>. Every player may add cards. A failed space check has no effect.</td></tr>" +
        "<tr><td>5</td><th scope='row'>Cargo Hold</th><td>Look at the top 2 item cards; put 1 on the bottom and the other in your play area. (Only 1 card left: keep it or return it.)</td></tr>" +
        "<tr><td>6</td><th scope='row'>Galley</th><td>Draw up to <b>5</b> skill cards from any non-treachery deck(s); then roll — if the result is <b>less than</b> the number of cards drawn, lose 1 food.</td></tr>" +
        "<tr><td>7–8</td><th scope='row'>Boiler Room</th><td>Discard 1 <b>strength</b> card and roll — if roll + the card’s value is <b>6 or less</b>, lose 1 fuel; then <b>advance</b> the travel track 1 space.</td></tr>" +
        "<tr><td>—</td><th scope='row'>Sick Bay</th><td>You draw only 1 skill card during Receive Skills. Can’t be damaged; Deep Ones" + (f ? ", horrors and allies" : "") + " can’t enter; no voluntary moves in.</td></tr>" +
        "<tr><td>—</td><th scope='row'>Brig</th><td>Characters here follow Brig rules. Action: <b>skill check 8</b> — supporting <b>lore</b> + <b>strength</b>; if it passes, move to any ship space. Everyone may add cards; a revealed traitor here doesn’t block it.</td></tr>" +
        "</tbody></table></div>" +
        "<h4>Spaces</h4>" + UF.ul([
          "<b>8 water spaces</b> ring the ship. The two numbered <b>1–4</b> and <b>5–8</b> are the <b>front</b>; the two beside deck spaces <b>7 and 8</b> are the <b>back</b>. Only monsters" + (f ? " (and, with this expansion, passengers)" : "") + " go in water; characters never do.",
          "<b>8 deck spaces</b>, numbered 1–8, ring the interior. Passengers are placed on deck spaces (any number per space)" + (f ? " — and, with this expansion, can also spawn in or be moved into water spaces." : " and nowhere else."),
          "<b>8 interior spaces</b>: the six numbered rooms above, plus the Brig and the Sick Bay (no numbers).",
          "Any number of characters and Deep Ones can share a ship space.",
          "Every water and deck space has a <b>Deep One movement arrow</b>: water → the adjacent deck space; deck → the adjacent interior space. There are no arrows between interior spaces.",
          "A die result “matches” a space by its printed number. <b>Adjacent</b> = sharing a border (a corner doesn’t count). <b>Closest</b> = fewest spaces away.",
          "<b>The Deep</b> is not a board space and is adjacent to nothing; monsters there can’t activate or be affected by player abilities."
        ]);
    },
    src: (c) => UF.src("Learn to Play p.11 (player reference sheet), p.9, p.16", "Rules Ref p.4 (§5)", "Rules Ref p.5–6 (§9)", "Rules Ref p.7 (§14–15)", "Rules Ref p.11 (§32.6)", "Rules Ref p.13 (§40)", "Rules Ref p.14–15 (§44)", "Rules Ref p.8 (§24.4)", c.has("fta") ? "From the Abyss p.2, p.5, p.7" : "")
  },
  {
    title: "Mythos cards and crises",
    when: () => true,
    html: (c) => "<p>Resolve every mythos card in this order: <b>1 Crisis</b> → <b>2 Activation icon</b> → <b>3 Track icon</b>. It is revealed to everyone and is open information; discard it faceup afterwards. When the deck runs out, shuffle the discard pile into a new deck after resolving the last card.</p>" +
      "<h4>Crisis types</h4>" + UF.ul([
        "The current player reads the <b>story text</b> aloud.",
        "<b>Choice</b> — the card names the chooser: the <b>current player</b>, the <b>Captain</b>, the <b>Keeper of the Tome</b>, or a named <b>character</b>. Hand the card to the chooser; they read both options aloud and pick one — even one that can’t be fully resolved, unless the card says otherwise.",
        "<b>Skill check</b> — a target number with 2 or more supporting skills; the card lists Pass / Fail and sometimes a partial “<b>N+</b>” result.",
        "<b>Combination</b> — the chooser picks either the skill check or the other option (a chosen option means no check). Both are read aloud first.",
        "On a mythos card, “you/your” means the current player, or the chooser on a choice for someone else.",
        c.has("fta") ? "<b>From the Abyss:</b> no green character-specific cards in the deck; <b>Personal Crisis</b> cards send a player to their own facedown character-specific card (see From the Abyss — Personal Crisis)." :
          "<b>Green</b> cards are <b>character-specific</b>: if that character isn’t in the game, is in the Brig or has revealed as a traitor, discard it and draw another. If you’re looking at mythos cards in secret and see one of these, reveal and discard it, then look at that many more.",
        "Some crises go into a player’s play area and grant abilities while they stay there."
      ]) + "<h4>Icons (lower-right corner)</h4>" + UF.ul([
        "<b>Activation</b>: Deep Ones · Father Dagon · Mother Hydra" + (c.has("fta") ? " · Shoggoth · Drowned Spirit · Grasping Tendril · the generic horror icon" : "") + ". Activation icons printed in a crisis’s text resolve left to right.",
        "<b>Track</b>: travel · ritual · <b>choice of tracks</b> (the current player picks; if they’re in the Brig, the <b>Captain</b> picks)" + (c.has("fta") ? " · the horror icon acts as a track icon while no horror is on the board" : "") + ".",
        "A <b>human in the Brig</b> resolves only the icons of their mythos card — never the crisis."
      ]),
    src: (c) => UF.src("Rules Ref p.2 (§1.2, §1.11)", "Rules Ref p.9–10 (§28)", "Rules Ref p.6 (§9.7)", "Learn to Play p.12–13", c.has("fta") ? "From the Abyss p.7, p.9, p.12" : "")
  },
  {
    title: "Skill checks and the chaos deck",
    when: () => true,
    html: (c) => UF.ol([
        "<b>Announce</b> the target number and supporting skills (every other skill type opposes). “Before any cards are added” abilities are used now.",
        "<b>Chaos cards</b> — the current player puts the top <b>2</b> chaos cards facedown to start the skill check pile.",
        "<b>Add cards</b> — starting with the player to the current player’s <b>left</b> and ending with the current player, each player gets <b>one</b> chance to add any number of cards facedown (or none). Humans in the Brig and revealed traitors: <b>1 card max</b>.",
        "<b>Shuffle</b> the pile.",
        "<b>Sort</b> — flip cards one at a time into supporting and opposing piles.",
        "<b>Total</b> = supporting values − opposing values. ≥ target: <b>pass</b>. Below target but ≥ the partial number (“8+”): resolve the <b>partial</b> result (counts as neither pass nor fail). Otherwise: <b>fail</b>.",
        "<b>Discard</b> all the cards to their discard piles."
      ]) + UF.ul([
        "<b>Treachery</b> cards always oppose" + (c.has("fta") ? " (unless a card such as Revelation makes them supporting)" : "") + ".",
        "Chaos deck: " + (c.has("fta") ? "2 of each of influence, lore, observation, strength and will, plus <b>2 boon and 2 treachery</b>" : "2 of each non-treachery type (10 cards)") + ". When the last card is taken, build a new one the same way; skip any type whose deck plus discard pile holds fewer than 2 cards. “Shuffle X treachery cards into the chaos deck” means the top X of the treachery deck.",
        "Open information: how many cards each player adds and how many are in the check — never which ones.",
        "The Captain’s Cabin and Brig checks only say what happens on a pass; if they fail, nothing happens."
      ]),
    src: (c) => UF.src("Rules Ref p.14 (§42)", "Rules Ref p.6 (§10)", "Rules Ref p.11 (§30.7–30.8, §31)", "Rules Ref p.17 (§52.3)", "Learn to Play p.16–17", c.has("fta") ? "From the Abyss p.3, p.8" : "")
  },
  {
    title: "Monsters — Deep Ones and the monarchs",
    when: () => true,
    html: (c) => "<h4>Deep Ones — each activates on its own, in the order the current player chooses, doing the first thing it can:</h4>" + UF.ol([
        "<b>Attack</b> a human in its space (current player picks the defender; never a revealed traitor) — a roll of <b>6+</b> defeats the human.",
        "<b>Defeat a passenger</b> in its space (only if no human is there; with several there, the current player picks which).",
        "<b>Damage its space</b> — only an undamaged interior space.",
        "<b>Move</b> — water or deck space: follow the arrow. Interior space: one space toward the <b>closest undamaged interior space</b>; ties → the one with the <b>highest printed number</b>."
      ]) + "<p>No Deep Ones on the board (the Deep doesn’t count)? <b>Spawn 2 Deep Ones in the Deep</b>. Then, if 4+ Deep Ones are in the Deep, roll and move <b>all monsters</b> in the Deep — monarchs included — to the matching water space (1–4 or 5–8).</p>" +
      "<h4>Father Dagon</h4>" + UF.ul([
        "Spawn <b>2 Deep Ones</b> in the deck space adjacent to him (his arrow points to it). Then he moves <b>1 water space toward the front</b> (not if already at 1–4 or 5–8).",
        "In the Deep instead: spawn 2 Deep Ones in the Deep; if 4+ are there, roll and move Father Dagon <b>and all Deep Ones</b> in the Deep to the matching water space."
      ]) + "<h4>Mother Hydra</h4>" + UF.ul([
        "Damage the <b>interior space closest to her</b> (follow the arrows from her space). Already damaged? Damage the undamaged interior space closest to it (ties → highest printed number). Then she moves <b>1 water space toward the front</b> (not if already there).",
        "In the Deep instead: spawn 2 Deep Ones in the Deep; if 4+ are there, roll and move Mother Hydra <b>and all Deep Ones</b> in the Deep to the matching water space."
      ]) + "<h4>Facts</h4>" + UF.ul([
        "Monarchs can’t be attacked" + (c.has("fta") ? " or defeated" : "") + ", aren’t Deep Ones, and never enter ship spaces. A monarch removed from the board goes to the Deep.",
        "Monsters in the Deep can’t activate. Deep Ones can’t spawn in or move to the Brig or Sick Bay.",
        "If Deep Ones must spawn and the supply (20 figures) is short, the game ends — a Deep One victory."
      ]),
    src: (c) => UF.src("Rules Ref p.3–4 (§4)", "Rules Ref p.7 (§14, §16.2)", "Rules Ref p.8 (§21)", "Rules Ref p.9 (§26)", "Rules Ref p.15 (§45)", "Learn to Play p.18, p.20, p.28", c.has("fta") ? "From the Abyss p.10" : "")
  },
  {
    title: "Attacks, dice and defeat",
    when: () => true,
    html: (c) => "<h4>Resolving an attack</h4>" + UF.ol([
        "Attacker declared (a player, or a Deep One" + (c.has("fta") ? " / horror" : "") + ").",
        "Defender — the attacking player chooses; for a monster, the current player chooses. Same space only. Humans attack Deep Ones and revealed traitors" + (c.has("fta") ? " (and horrors)" : "") + "; revealed traitors" + (c.has("fta") ? ", Deep Ones and horrors" : " and Deep Ones") + " attack humans.",
        "Target number: <b>4</b> vs a Deep One · <b>6</b> vs a character" + (c.has("fta") ? " · <b>6</b> to <b>repel</b> a horror" : "") + ".",
        "“Before a die is rolled” abilities.",
        "Roll the die.",
        "Reroll abilities — each reroll goes back to step 4.",
        "Result + modifiers ≥ target → the defender is defeated; otherwise nothing happens."
      ]) + "<h4>The die</h4>" + UF.ul([
        "One eight-sided die. Modified results never go below 1 or above 8.",
        "Abilities may reroll any number of times; modifiers carry over; “limit once per die roll” abilities work once however many rerolls happen."
      ]) + "<h4>Defeated</h4>" + UF.ul([
        "<b>Human</b> → the <b>Sick Bay</b> (if already in the Sick Bay or the Brig, they stay put).",
        "<b>Revealed traitor</b> → the <b>Brig</b> (stays if already there).",
        "<b>Deep One</b> → back to the supply.",
        "<b>Passenger</b> → flip it; each dial loses 1 per matching icon; remove it from the game (an “X” token costs nothing).",
        c.has("fta") ? "<b>Ally</b> → removed from the game. <b>Horror</b> → repelled instead (only the tracks defeat horrors)." : "",
        "If an ability prevents a defeat, ignore all of that defeat’s effects."
      ]),
    src: (c) => UF.src("Rules Ref p.5 (§6)", "Rules Ref p.7 (§16–17)", "Rules Ref p.16 (§48)", "Learn to Play p.10, p.19", c.has("fta") ? "From the Abyss p.2, p.5, p.7" : "")
  },
  {
    title: "Tracks, waypoints and the awakening",
    when: () => true,
    html: (c) => {
      const f = c.has("fta");
      return UF.ul([
        "<b>Advance</b> = move away from Start (overflow past the end continues from Start after the reset). <b>Retreat</b> = toward Start, stopping there. <b>Reset</b> = back to Start.",
        "Four advances take a token from Start to Arrive or Cast."
      ]) + "<h4>Travel track</h4>" + UF.ul([
        "Advanced by travel icons and the Boiler Room.",
        "For <b>each</b> space it advances, every monster" + (f ? " and passenger" : "") + " in a water space moves 1 water space toward the <b>back</b>. Anything already at the back: " + (f ? "monarchs and Deep Ones go to <b>the Deep</b>; horrors and passengers are <b>defeated</b>." : "moves to <b>the Deep</b>.") + " Retreating the track moves nothing.",
        "<b>Arrive</b> with waypoints in play totaling <b>12+</b> → the game ends: the human objective is met.",
        "<b>Arrive</b> with less than 12 → the <b>Captain</b> looks at the top 2 waypoint cards, places 1 in the row of waypoints beside the board and resolves it, puts the other on the bottom, then <b>resets</b> the travel track.",
        "Waypoint distances are 2, 3 or 4. The distance traveled is the total on the waypoint cards in play."
      ]) + "<h4>The awakening phase — once per game</h4>" + UF.ol([
        "Right after resolving the waypoint that brings the total to <b>6 or more</b>, deal <b>one loyalty card</b> to each player from the loyalty deck.",
        "Everyone looks at all their loyalty cards at the same time, then returns them facedown.",
        "Revealed traitors, clockwise from the current player, each give their <b>new</b> card to a human of their choice (who then reviews all their cards).",
        "Resume where the game left off (usually the end of a mythos card)."
      ]) + "<h4>Ritual track — the greater banishment</h4>" + UF.ul([
        "Advanced by ritual icons and the Chapel.",
        f ? "At <b>Cast</b>: move the monarchs to <b>the Deep</b>, then <b>defeat each Deep One, horror, passenger, ally and character in every deck and water space</b>. Then reset the ritual track."
          : "At <b>Cast</b>: return every Deep One in deck and water spaces to the supply; move Father Dagon and Mother Hydra to the Deep; defeat each passenger in each deck space; defeat each character in each deck space. Then reset the ritual track.",
        "Anyone and anything in an <b>interior</b> space is unaffected. Defeated humans go to the Sick Bay; defeated revealed traitors to the Brig (the Rules Reference corrects the Learn to Play, which sends every character to the Sick Bay)."
      ]);
    },
    src: (c) => UF.src("Rules Ref p.16–17 (§50)", "Rules Ref p.18 (§54)", "Rules Ref p.5 (§7–8)", "Learn to Play p.14–15, p.23", c.has("fta") ? "From the Abyss p.2 (updated traitor sheet), p.4, p.7" : "")
  },
  {
    title: "Damage and repair",
    when: () => true,
    html: (c) => UF.ul([
        "<b>“Damage the ship”</b>: draw the top damage card and resolve it. A <b>Structural Damage</b> card goes into the interior space matching a die roll.",
        "<b>“Damage a space”</b> (e.g. a monster): draw and resolve; Structural Damage goes into that space.",
        "Cards that remove themselves (e.g. <i>Fuel Leak</i>: lose 1 fuel) don’t cause an extra draw — and a Deep One that drew one has still finished its activation.",
        "Structural Damage cards <b>defeat each human</b> in the space they land in" + (c.has("fta") ? " (some expansion damage cards say otherwise — follow the card)" : "") + ".",
        "Only interior spaces can be damaged — never the Brig or Sick Bay. A damaged space can’t be damaged again: the <b>closest undamaged interior space</b> takes it instead (ties → highest printed number).",
        "A damaged space’s action can’t be used. A human there may <b>repair</b> it by performing the damage card’s action (usually discarding skill cards of a stated type and total value) — not while a Deep One or revealed traitor" + (c.has("fta") ? " (or any enemy)" : "") + " is there. Shuffle the card back into the damage deck. Repairing doesn’t use the space’s once-per-turn action.",
        "<b>Six damaged spaces at once → the game ends</b> (a Deep One victory)."
      ]),
    src: (c) => UF.src("Rules Ref p.6–7 (§13)", "Rules Ref p.12 (§35)", "Learn to Play p.19", c.has("fta") ? "From the Abyss p.2, p.7" : "")
  },
  {
    title: "Passengers",
    when: () => true,
    html: (c) => UF.ul([
        "Tokens stay <b>facedown</b>; each face shows one or more resource icons or an <b>X</b>.",
        "<b>Risk a passenger</b>: roll and place a passenger from the supply facedown, unseen, in the matching <b>deck space</b>" + (c.has("fta") ? " (with the expansion this counts as <b>spawning</b> it)" : "") + "; risking several means a separate roll for each. Too few in the supply → risk as many as you can; if risking is a <b>cost</b> (like the Bridge), you can’t pay it without enough.",
        "<b>Rescue</b>: the token goes back to the supply facedown, unseen.",
        "<b>Defeat</b>: flip it, lose 1 of each resource per matching icon, remove it from the game (X = no loss). A dial hitting 0 this way ends the game.",
        "Deep Ones and revealed traitors can’t defeat a passenger while a <b>human</b> is in its space.",
        "Passengers are <b>not humans</b> for any game effect.",
        c.has("fta") ? "<b>From the Abyss:</b> passengers can spawn in or be moved into <b>water spaces</b>; the travel track pushes them toward the back, and one already at the back is <b>defeated</b>. The ritual’s banishment defeats passengers in water too." : "",
        "The box has 9 passenger tokens; how many are in the supply is open information."
      ]),
    src: (c) => UF.src("Rules Ref p.11–12 (§32)", "Rules Ref p.11 (§30.3)", "Learn to Play p.3, p.11, p.21", c.has("fta") ? "From the Abyss p.2, p.4" : "")
  },
  {
    title: "The Brig and the Sick Bay",
    when: () => true,
    html: (c) => "<h4>The Brig</h4>" + UF.ul([
        "How you get there: the <b>Captain’s Cabin</b> skill check (a human sends another human), being <b>defeated as a revealed traitor</b>, or a card that moves you there (e.g. a crisis option such as <i>Do No Harm</i>’s “Move to the Brig”). Nobody moves there voluntarily.",
        "Moving to the Brig costs a human <b>all their titles</b>.",
        "While there: add at most <b>1 card</b> to each skill check; no <b>item</b> abilities, and your active Improvement doesn’t count; “if you are not in the Brig” abilities don’t work — including the harmful part of a reveal ability.",
        "You still draw your <b>full</b> skill set and may use skill card abilities.",
        "A <b>human’s</b> Mythos step resolves only the card’s icons (choice of tracks → the Captain chooses).",
        "Leaving: a <b>human</b> uses the Brig’s action (skill check 8, lore + strength; not blocked by a revealed traitor there). A <b>revealed traitor</b> discards skill cards worth <b>12+</b>, all at once, and moves. Other movement effects work only if they say “Brig”.",
        "Defeated in the Brig → you stay. It can’t be damaged; Deep Ones" + (c.has("fta") ? ", horrors and allies" : "") + " can’t enter."
      ]) + "<h4>The Sick Bay</h4>" + UF.ul([
        "Defeated humans go here.",
        "Receive Skills here: draw only <b>1 card</b> of your choice from your skill set (it may be the type your active Improvement adds).",
        "Leave with a normal move. Moved out before your turn (e.g. a granted action)? You draw your full set.",
        "Defeated here → you stay. It can’t be damaged; Deep Ones" + (c.has("fta") ? ", horrors and allies" : "") + " can’t enter; no voluntary moves in."
      ]) + "<p class='note'>Sending an innocent human to the Brig makes the game harder for the humans; it can neutralize a hidden traitor.</p>",
    src: (c) => UF.src("Rules Ref p.5–6 (§9)", "Rules Ref p.13 (§40)", "Learn to Play p.13, p.25", c.has("fta") ? "From the Abyss p.5, p.7" : "")
  },
  {
    title: "Titles — Captain and Keeper of the Tome",
    when: () => true,
    html: (c) => UF.ul([
        "Each title goes at setup to the character highest on its <b>line of succession</b> (on the back of the title card).",
        "You lose your titles when you <b>move to the Brig</b> or <b>reveal as a traitor</b>. The title passes to the highest eligible character — not revealed traitors, not humans in the Brig, not characters out of play. The loser stays eligible only if every other human is in the Brig (and they aren’t revealing); if all humans are in the Brig, the highest of them takes it.",
        "<b>Captain</b>: holds the waypoint deck; at Arrive looks at the top 2 waypoints, resolves 1, bottoms the other; makes the choice on many crises; picks the track when a human in the Brig draws a choice-of-tracks icon.",
        "<b>Keeper of the Tome</b>: holds the spell deck. Action: " + (c.has("fta")
          ? "look at the <b>top 3</b> spells, put <b>2 on the bottom</b> in any order, then resolve the remaining one (updated card)"
          : "look at the <b>top 2</b> spells, put 1 on the bottom, resolve the other") + ". Limit once per turn. Resolved spells are removed from the game; with an empty spell deck, no spells. Also makes the choice on several crises.",
        "A hidden traitor with a title can do real damage: a Captain choosing short waypoints, a Keeper casting spells that hurt more than help."
      ]),
    src: (c) => UF.src("Rules Ref p.16 (§49)", "Rules Ref p.15 (§46)", "Learn to Play p.16, p.22", c.has("fta") ? "From the Abyss p.2–3" : "")
  },
  {
    title: "Revealing as a traitor — and life as a revealed traitor",
    when: () => true,
    html: (c) => "<h4>Reveal as a traitor (an action; Hybrid or Cultist holders only)</h4>" + UF.ol([
        "Reveal <b>one</b> Hybrid or Cultist card (holding both? you choose which).",
        "Resolve the “When you reveal as a traitor” ability on your character sheet; then lay the revealed card faceup over your sheet’s abilities — you can’t use them for the rest of the game.",
        "If the ship has traveled <b>less than 12</b> distance, give your unrevealed loyalty cards to <b>one other player</b> of your choice (everyone takes a moment to review loyalty cards). At 12+, keep them facedown.",
        "Lose all titles.",
        "Discard any mythos cards in your play area and remove your feat card from the game; take a traitor reference sheet.",
        "If you’re not in the Brig, you may discard any number of skill cards to draw that many treachery cards.",
        "Put a <b>traitor ring</b> on your standee."
      ]) + "<p>The turn then resumes. There is no going back to being hidden.</p>" +
      "<h4>Revealed traitor rules</h4>" + UF.ul([
        "May attack and be attacked by humans; may draw and use treachery cards.",
        "Blocks humans from using the action ability of your space — and any damage card there.",
        "At most 1 card to each skill check; no character sheet or space abilities; no Mythos step.",
        "Deep Ones never attack you" + (c.has("fta") ? "; allies in your space flee unless a human is there too" : "") + "."
      ]) + "<h4>Hidden or revealed?</h4>" + UF.ul([
        "Hidden: sabotage skill checks (more than two opposing cards flipped means a traitor added some), play inefficiently, lie about your cards, stack decks you get to arrange, abuse a title.",
        "Revealing lets you attack humans, use treachery cards, block a room, escape the Brig more easily, and (before 12 distance) hand a spare Hybrid to another player to recruit a fellow traitor. It costs you the Mythos step, extra cards in checks, your sheet’s abilities — and makes you a target."
      ]),
    src: (c) => UF.src("Rules Ref p.12–13 (§37–39)", "Learn to Play p.22–25", c.has("fta") ? "From the Abyss p.5" : "")
  },
  {
    title: "Cards — skills, items, spells and feats",
    when: () => true,
    html: (c) => "<h4>Skill cards</h4>" + UF.ul([
        "Each has a type, a value and an ability. Play them on <b>any</b> player’s turn; an “Action:” ability costs an action. Discard after use.",
        "Types: influence, lore, observation, strength, will, treachery" + (c.has("fta") ? ", and <b>boon</b>" : "") + " — each with its own deck and faceup discard pile; an empty deck reshuffles its discards.",
        "Drawing from several decks: decide how many from each before drawing.",
        "Hand limit <b>10</b> (checked in every Discard step). How many cards you hold is open information — answer truthfully if asked.",
        c.has("fta") ? "Treachery abilities: <b>revealed traitors only</b> — though with this expansion anyone may end up holding treachery cards." : "Only revealed traitors may draw treachery cards or use their abilities."
      ]) + "<h4>Items</h4>" + UF.ul([
        "Draw → faceup in your play area. There’s no discard pile: an item leaving play is removed from the game. An empty item deck means no draws.",
        "<b>Improvements</b> add one skill card of the type shown to your skill set. Only <b>one</b> may be active (faceup); switch at the start of your turn — before Receive Skills — or whenever you gain or lose one. Inactive ones still count as your items (tradeable).",
        "Traits (e.g. Weapon, Tool) have no effect of their own but other cards refer to them."
      ]) + "<h4>Spells and feats</h4>" + UF.ul([
        "Spells are resolved only when an ability lets you (usually the Keeper’s title): reveal, read aloud, resolve, then remove from the game. Looking at more spells than remain: look at what’s there.",
        "Each character’s <b>feat</b> is a once-per-game ability; remove it after use (an “Action:” feat costs an action). Revealing as a traitor removes your unused feat."
      ]),
    src: (c) => UF.src("Rules Ref p.13 (§41)", "Rules Ref p.8–9 (§20, §22, §24)", "Rules Ref p.15 (§46)", "Rules Ref p.17 (§52)", "Learn to Play p.10, p.26", c.has("fta") ? "From the Abyss p.8" : "")
  },
  {
    title: "Reading card text — abilities, timing, open information",
    when: () => true,
    html: (c) => UF.ul([
        "<b>Golden rules</b>: the Rules Reference beats the Learn to Play; a card beats the Rules Reference; if both can be followed, follow both.",
        "“<b>Enemy</b>”: for a human, a Deep One or a revealed traitor" + (c.has("fta") ? " — and, with From the Abyss, a horror (the updated reference sheet’s “Attack an enemy” covers horrors; the Unofficial FAQ confirms horrors are enemies)" : "") + "; for a revealed traitor, a human. “<b>Characters</b>” = humans and revealed traitors.",
        "“<b>You/your</b>” = the player resolving the card. “<b>Cannot</b>” is absolute. “<b>May</b>” is optional. “<b>To</b>” marks a cost that must be paid for what follows. “<b>Would</b>” = resolves before that event; with “<b>instead</b>” it replaces the event. “<b>Look at</b>” = only you see it. “<b>If able</b>” = skip what can’t be done. “<b>Then</b>” happens after, whether or not the earlier part resolved.",
        "“<b>Limit once per turn</b>” = once in each player’s turn — you may use it again in someone else’s turn; the limit covers the whole ability.",
        "Timing: before and after each die roll, and before cards are added to a skill check, players get a window for abilities. When several players want to act at once, or simultaneous events need an order, the <b>current player</b> decides the order.",
        "Text in parentheses is reminder text.",
        "Short on components? Draw as many cards as there are (maybe zero). (Deep Ones are the exception: a shortfall ends the game.)",
        "<b>Open information</b>: the number of cards in each facedown deck; the top card of each discard pile (you can’t count discard piles); Deep Ones and passengers in the supply; all faceup components in play areas; the number of loyalty cards and skill cards each player has; how many cards each player adds to a skill check.",
        "Removed-from-the-game components go back in the box and can’t be looked at unless an effect allows it."
      ]),
    src: (c) => UF.src("Rules Ref p.1 (Golden Rules)", "Rules Ref p.2 (§1)", "Rules Ref p.6 (§11–12)", "Rules Ref p.8 (§19)", "Rules Ref p.11 (§30)", "Rules Ref p.12 (§34)", "Learn to Play p.26", c.has("fta") ? "From the Abyss p.2, p.7 · Unofficial FAQ" : "")
  },
  {
    title: "Table talk — secrecy guidelines",
    when: () => true,
    html: () => "<p>Guidelines, not strict rules: a group may add, amend or remove them, as long as everyone agrees <b>before the game begins</b>.</p>" + UF.ul([
        "No one must tell the truth — except about <b>open information</b> (e.g. how many cards you hold).",
        "Speak in <b>generalities</b> about hidden information. When in doubt, use polar opposites: “high” or “low” — never “pretty high” or “medium”.",
        "Only <b>yes/no</b> questions about another player’s hidden information; they may lie or stay silent.",
        "Never ask someone directly if they are a traitor — implying, insinuating and accusing are fine.",
        "<b>Skill checks</b>: never state card titles, types, colors or values you added or will add, or give clues that identify them afterwards. OK: “I’m helping a lot with one card”, “I added four low-value cards”, “That couldn’t have been me — I don’t draw influence cards.” Not OK: “a medium amount with one card”, “four strength cards”, “a bunch of twos”, “I added a Preparation”, “those are my lore cards”.",
        "<b>Skill card abilities</b>: you may ask who has a helpful card and may claim to have one or not; say “I can help with a die roll”, but don’t name or read the card.",
        "<b>Loyalty cards</b> you get to look at: no specifics and no counts — just accuse (or clear) the owner. The owner may know which of their cards you saw.",
        "<b>Top cards of a deck</b> (waypoint, mythos): only “good” or “bad”.",
        "Revealed traitors follow the same rules and never show their hands."
      ]),
    src: () => "Rules Ref p.19 (Appendix III) · Learn to Play p.26"
  },
  {
    title: "Variants and balance",
    when: () => true,
    html: (c) => UF.ul([
        "<b>Learning game</b>" + (c.mode === "learning" ? " (selected)" : "") + ": the Learn to Play’s first-game setup. Compared with it, the full game (Rules Reference Appendix IV) deals one loyalty card at setup (so traitors may exist from the start; the second still comes at the awakening), has players except the first draw <b>any three</b> skill cards from their skill set instead of the full five, and adds the <b>Cultist</b> at 4 and 6 players.",
        "<b>No-Cultist variant</b>" + (c.mod("nocult") ? " (selected)" : "") + " — 4 or 6 players: an additional Human card replaces the Cultist; dials start Fuel 7 · Food 6 · Sanity 6 · Souls 7.",
        "<b>Adjusting difficulty</b>" + ((c.mod("easyH") || c.mod("easyT")) ? " (selected)" : "") + " — agreed before the game: easier for the humans = start with two more of each resource; easier for the traitors = two fewer.",
        c.has("fta") ? "<b>Prelude balance</b>" + ((c.mod("prelHum") || c.mod("prelHyb") || c.mod("prelExtra")) ? " (selected)" : "") + " — with everyone’s agreement: swap night→twilight and/or twilight→day to favor the humans; day→twilight and/or twilight→night to favor the hybrids; or draw extra preludes of any type." : "",
        "Current starting dials: " + UF.dialText(UF.dials(c).v) + "."
      ]),
    src: (c) => UF.src("Learn to Play p.26", "Rules Ref p.18 (Appendices I–II)", "Rules Ref p.23", c.has("fta") ? "From the Abyss p.9" : "")
  },
  {
    title: "From the Abyss — allies",
    when: (c) => c.has("fta"),
    html: () => UF.ul([
        "<b>Getting allies</b>: each rescue action spawns 1 ally in your space; two spawn at setup; some cards (e.g. the Companion boon) spawn more. Ally cards are spawned <b>faceup</b> in ship spaces — never the Brig, the Sick Bay or water.",
        "<b>Using an ally</b>: before or after you could perform an action, a <b>human</b> may use an ally in their space: discard skill cards with a total value <b>≥ the number</b> in the ally’s top-left corner, then resolve its ability.",
        "<b>One ally per human per turn</b>; allies used through an ability don’t count toward that limit. Several players may use the same ally in a turn.",
        "Granted an action outside your turn? You may use an ally before or after it. Granting an action to someone else? You can’t use an ally before or after that granted action.",
        "<b>Wander</b>: most abilities end “… wanders” — the user rolls and moves the ally to a <b>different</b> ship space matching the roll (deck or interior, the user’s choice; if the roll matches its current space, it takes the other one). You may use an ally even if part of its ability can’t resolve, just to make it wander.",
        "<b>Flee</b> (shuffle it back into the ally deck): when its space holds a monster or revealed traitor, or becomes damaged — but never while a human is in its space. If damage defeats every human in a space, its allies flee.",
        "<b>Defeat</b>: by the ritual’s banishment or other abilities — remove it from the game.",
        "Examples: <i>Soldier</i> (3): defeat 1 Deep One in any space · <i>Professor</i> (4): draw 3 cards from one non-treachery deck · <i>Host</i> (4): any human may move to any ship space except the Brig or Sick Bay. <i>Ruffian</i>’s attack follows the normal human attack steps; its user picks the defender."
      ]),
    src: () => "From the Abyss p.2–5"
  },
  {
    title: "From the Abyss — horrors",
    when: (c) => c.has("fta"),
    html: () => "<p>Three horrors — monsters, but not monarchs or Deep Ones. Each has its own activation icon; activating a horror that isn’t on the board <b>spawns</b> it first. Then it does the first thing it can:</p>" +
      "<h4>Shoggoth — spawns in the deck space matching a roll</h4>" + UF.ol([
        "Attack <b>each</b> human in its space, <b>+1</b> to each roll.",
        "Defeat <b>each</b> passenger in its space.",
        "Damage its space (an undamaged interior space).",
        "Remove the top <b>4 item cards</b> from the game unseen, then move: water → deck → interior along the arrows; inside, toward the closest undamaged interior space (ties → highest number)."
      ]) + "<h4>Drowned Spirit — spawns in the interior space matching a roll</h4>" + UF.ol([
        "Damage its space (an undamaged interior space).",
        "Remove the top <b>4 spell cards</b> from the game unseen, then move as the Shoggoth does."
      ]) + "<h4>Grasping Tendril — spawns in the water space matching a roll</h4>" +
      "<p>It occupies a water space <b>and</b> the adjacent deck space, and never enters the interior.</p>" + UF.ol([
        "Attack a human in its deck space, <b>+1</b> to the roll; then move 1 space toward the front.",
        "Move each passenger from its deck space into its water space; then move 1 toward the front.",
        "Spawn a passenger in its water space (still moves if none are left); then move 1 toward the front."
      ]) + "<h4>The horror icon</h4>" + UF.ul([
        "<b>No horrors on the board</b>: it’s a track icon — advance the horror track (Start → one space → Spawn). At <b>Spawn</b>, set the token aside and draw and resolve the top horror card (usually a specific horror’s activation icon). The <i>Ominous Visions</i> card instead gives the current player 1 boon and 1 treachery card, goes to the bottom of the horror deck, and you draw another horror card.",
        "<b>Exactly one horror</b> on the board: it activates.",
        "<b>More than one</b>: flip horror cards until one names a horror on the board; that one activates; shuffle the flipped cards back.",
        "A horror spawned by its own specific icon also takes the token off the track."
      ]) + "<h4>Repelling and removing</h4>" + UF.ul([
        "A horror that would be defeated is <b>repelled</b> instead: move it to an adjacent space, then you may discard skill cards worth <b>4+</b> to move it one more space.",
        "Who repels: the attacker; the player who used the skill, spell, ally or feat card; for a mythos card, the player who made the choice — otherwise the current player.",
        "Humans attack horrors normally; <b>6+</b> repels one.",
        "Only the tracks remove horrors: a horror already at the back when the travel track advances, or in a deck or water space when the ritual is cast, is <b>defeated</b> — back to the supply. If no horrors remain, put the horror token on Start.",
        "No space action while a horror is in the space; horrors can’t spawn in or enter the Brig or Sick Bay; with fewer than 4 cards to remove, remove what’s there and still move."
      ]),
    src: () => "From the Abyss p.2, p.6–7, p.12"
  },
  {
    title: "From the Abyss — boons, treachery and new skill cards",
    when: (c) => c.has("fta"),
    html: () => UF.ul([
        "<b>Boon</b> cards always <b>support</b> a skill check. They can be drawn only when an ability says “boon”. Humans and traitors alike may draw them and use their abilities.",
        "<b>Treachery</b>: abilities can now make humans draw treachery cards; humans may add them to skill checks and discard them for other abilities. Only <b>revealed traitors</b> may use treachery card abilities.",
        "<b>Chaos deck</b>: every new chaos deck also gets 2 boon and 2 treachery cards.",
        "<b>New values</b>: each deck gains a <b>6</b> (same ability as that deck’s 5s — except treachery) and a <b>0</b>. Influence/lore/observation/strength/will 0s trigger <b>after</b> the check fully resolves (e.g. <i>Oust</i>: the current player moves 1 Deep One from any space to another); boon and treachery 0s apply <b>while</b> in the check (e.g. <i>Revelation</i>: treachery becomes a supporting skill). Several 0s → the current player orders them.",
        "Adding a 0: you may not say you’re adding a 0 or that you aren’t helping."
      ]),
    src: () => "From the Abyss p.8"
  },
  {
    title: "From the Abyss — Personal Crisis cards and preludes",
    when: (c) => c.has("fta"),
    html: (c) => "<h4>Personal Crisis</h4>" + UF.ul([
        "All 18 character-specific mythos cards are out of the deck; each player keeps their own facedown. 12 Personal Crisis cards are in the deck.",
        "When one is drawn, the current player resolves the first that applies: <b>1</b> resolve your own character-specific card; <b>2</b> yours is already discarded → the next human clockwise who still has one resolves theirs; <b>3</b> nobody can → draw and resolve another mythos card.",
        "Drawn while the current player is in the Brig → discard it and draw a replacement.",
        "Looking at the top of the mythos deck and see a Personal Crisis? Discard it and look at the next card."
      ]) + "<h4>Preludes" + (c.mod("prelude") ? " (in use)" : " (not in use)") + "</h4>" + UF.ul([
        "Optional events from earlier in the voyage: day (favor humans), twilight (everyone), night (favor hybrids).",
        "Before the loyalty deck: shuffle each type; draw, read aloud and resolve 1 day, 1 twilight, 1 night; then remove all preludes from the game.",
        "Balance, if everyone agrees: night→twilight and/or twilight→day to favor humans; day→twilight and/or twilight→night to favor hybrids; extra preludes of any type."
      ]),
    src: () => "From the Abyss p.3, p.9"
  },
  {
    title: "From the Abyss — official clarifications",
    when: (c) => c.has("fta"),
    html: () => UF.ul([
        "<b>Spawning</b>: passengers, allies and horrors can be spawned. Short on components (other than Deep Ones)? Spawn as many as you can. Told to spawn a horror already on the board? Move it to that space instead.",
        "<b>Monarchs</b> cannot be defeated.",
        "<b>Providence</b> (boon): if it prevents losing a resource paid as a cost, the ability resolves as if the cost were paid.",
        "<b>Ida Lawrence</b> — Seasoned: draw after the action ability fully resolves (before a granted action is taken); it triggers even if the skill card’s ability can’t fully resolve.",
        "<b>Guillaume Delacroix</b> — Lost Souls’ ally doesn’t count toward his one-ally limit; in another player’s turn with a granted action he may use one with Lost Souls plus one in his space. Unfinished Business: he may exceed 3 allies while it resolves, then keeps three; used allies are removed, not wandered; another character using this feat (via Valuable Lessons) keeps unused allies but can’t use them.",
        "<b>Kokoj Fernandes</b> — Eldritch Influence: the set die may be modified (e.g. Keen Insight) but not rerolled.",
        "<b>Wong Mui Choo</b> — Instinct: on a partial pass the feat isn’t removed.",
        "<b>Cursed Mask</b> and <b>Blessing</b> are not Improvements. <b>Flare Gun</b>: you may move another character without attacking. <b>Spirit Board</b>: the defeated ally is revealed before removal.",
        "<b>Precognition</b>: fewer than 4 chaos cards → draw what’s there, build a new chaos deck, draw the rest. <b>Price of Power</b>: cast the greater banishment without moving the ritual token.",
        "<b>Cast Out</b>: repeat it until the roll is 5 or less or you stop. <b>Storm Winds</b>: move the travel token to Start first, then advance; it doesn’t return to Start afterwards."
      ]),
    src: () => "From the Abyss p.4, p.10"
  },
  {
    title: "Unofficial FAQ — community rulings (lowest tier)",
    when: () => true,
    html: (c) => "<p class='note faq-tier'>From a community-compiled FAQ, not the rulebooks. Used only where the books are silent; the books always win. Card names refer to cards not reproduced in the rulebooks.</p>" +
      "<h4>General</h4>" + UF.ul([
        "The Rules Reference’s ability rules cover all game text that isn’t flavor or rules text — skill cards, mythos cards, character sheets, interior space abilities and the rest; “ability” and “effect” mean the same thing.",
        "Timing windows exist mainly to break stalemates (the current player decides). Whenever the game state changes, players should get a chance to respond; you may use several abilities in one window and can get a second chance to act.",
        "Removed-from-the-game components — defeated passengers included — are not open information (matching Rules Ref §34).",
        "“Risk N passengers <i>to</i> …” with fewer than N in the supply: you may still pick that option; risk as many as there are, and the effect after “to” doesn’t happen (consistent with Rules Ref §1.5, §28.13, §32.5).",
        "Abilities that grant an extra action “refund” an action rather than nesting one — so, e.g., a basic attack taken with it still gets Kitchen Knife’s +1.",
        "All defeat-prevention effects share one timing; the current player chooses which resolves (e.g. Flesh Ward stays if something else prevents the defeat).",
        "Choices on a waypoint card are made by whoever chose the card — normally the Captain; the Keeper for Open the Gate; whoever chose Fog Bank for the waypoint after it."
      ]) + "<h4>Card-specific</h4>" + UF.ul([
        "<b>Perfect Number</b> (Beatrice): the set die takes modifiers but can’t be rerolled; “before a die is rolled” abilities come before she decides.",
        "<b>Experienced</b> (Keilani) has the same timing as “after calculating the total of a skill check”.",
        "<b>Full Steam Ahead</b> (Jeanne) works with the Boiler Room damaged or occupied by Deep Ones or revealed traitors — it isn’t the room’s action.",
        "<b>Self Sacrifice</b> (Arjun) on Ritual Coordination: choosing the outcome without a check advances the ritual only 1 space.",
        "<b>Gift of the Mother</b>: the treachery goes into the chaos deck being discarded; “Return the ring” removes the Lucky Ring from the game if someone other than Edmund has it.",
        "<b>The Game is Afoot</b>: Jamie may pick the Sick Bay or Brig (no effect — no Deep Ones can be there); if “Try to contain them” damages no space (the damage costs fuel or food instead), no Deep Ones spawn.",
        "<b>Family Ties</b>: “Refuse” in the Sick Bay still spawns Deep Ones — Ishmael’s player picks the Chapel or Captain’s Cabin; a Preparation played before a check stops its persistent treachery for that check.",
        "<b>Memory of the Deep</b> (and Family Ties): under Nothing to Hide their treachery goes in faceup — for Memory of the Deep, after William’s last card. When its check is triggered by its action, Arjun may use his feat on it; it is always discarded when passed; its action doesn’t re-resolve the icons.",
        "<b>Seaweed Patch</b>: with fewer than 2 passengers the Captain may still pick “risk 2 passengers”, risking what’s there (even 0) without damaging the ship."
      ]) + (c.has("fta") ? "<h4>From the Abyss</h4>" + UF.ul([
        "Horrors are <b>enemies</b> of the humans and block repairs just as a Deep One does.",
        "Repelling a horror an extra space: allies flee from <b>each</b> space it enters.",
        "The Grasping Tendril’s spawn roll always lands on the <b>1–4 or 5–8</b> water space (and the adjacent deck space).",
        "If a horror card’s activation is cancelled (Temporal Barrier, Sardaana’s Alarm) and no horror appears, put the horror token back on Start.",
        "Personal Crisis passing clockwise skips humans in the Brig; if all remaining are in the Brig, go to step 3. A Personal Crisis drawn with Predictive Analytics isn’t discarded; set-aside character-specific cards may be consulted any time.",
        "The greater banishment (and Price of Power) defeats passengers in water spaces too — as the updated reference sheet says.",
        "Granting an action (e.g. Coordinated Effort) removes your ally window before and after that granted action; an extra action granted to yourself does allow an ally before it.",
        "Cursed Mask: with trading enabled you may try to give it away once (gaining 1 treachery card) — not repeatedly, and not to several players. Valise: look through the whole item deck and choose the Improvement. Spirit Board may be followed by Ransack or Perform Rites the same turn. Notebook can return the Companion boon to hand (returning isn’t drawing). Uncanny Luck: its own reroll decides the outcome."
      ]) : ""),
    src: (c) => "Unofficial FAQ (Base Game" + (c.has("fta") ? "; From the Abyss" : "") + ") — lowest tier; never overrides the rulebooks"
  }
];

/* =============================================================================
   TEACHING SCRIPT — about 5 minutes aloud for the configuration selected.
   Teaching order: hook & win/loss → turn shape → actions & why → central mechanic →
   monsters & tracks → traitors → inserts for selected options → "don't worry yet".
   ============================================================================= */
UF.teach = {
  intro: "A ~5-minute teach for the exact setup selected above. Read it aloud, or copy it and tweak. Everything in it comes from the rulebooks cited in the setup and reference sections.",
  sections: [
    {
      h: "The hook — and how each side wins",
      body: (c) => {
        const L = UF.loy(c);
        let s = "<p>It’s 1913, aboard the steamship <b>SS Atlantica</b>, bound for Boston — and <b>Deep Ones</b> are climbing aboard, led by two giant monarchs, <b>Father Dagon</b> and <b>Mother Hydra</b>. Most of us are human. Some of us are secretly <b>traitors</b>: hybrids with Deep One blood.</p>";
        s += "<p><b>The humans win</b> by finishing the voyage: at each arrival the Captain picks a waypoint worth 2 to 4 distance, and once we’ve covered <b>12</b>, the next arrival brings us home. <b>The traitors win</b> if the ship fails first — any resource (<b>fuel, food, sanity or souls</b>) hits zero, <b>six rooms</b> are damaged at once, or the Deep Ones need to spawn and <b>not enough are left</b>. Either way the game ends instantly and everyone flips their loyalty cards.</p>";
        s += "<p>With " + UF.word(c.p) + " of us, the loyalty deck is <b>" + L.hyb + " Hybrid</b>" + (L.cult ? ", <b>1 Cultist</b>" : "") + " and <b>" + L.hum + " Human</b> — two each: one " + (c.mode === "learning" ? "after everyone’s first turn" : "now") + ", one at the <b>awakening</b>, when we’ve covered 6 distance. Hold even one Hybrid and you’re a traitor, whatever your other card says.";
        if (L.cult) s += " The <b>Cultist</b> is a traitor too, but only wins if the ship sinks <i>after</i> covering 12 distance — they want to see land first.";
        return s + "</p>";
      }
    },
    {
      h: "The shape of a turn",
      body: (c) => "<p>On your turn, <b>receive</b> the skill cards shown on your character sheet, take <b>two actions</b>, then draw a <b>mythos</b> card and deal with it. Then anyone over ten cards <b>discards</b> down to ten, and play passes left. The first player starts with an empty hand; everyone else starts with " +
        (c.mode === "learning" ? "the five cards of their full skill set" : "three cards of their choice from their skill set") + ".</p>"
    },
    {
      h: "Your actions — and why you’d take them",
      body: (c) => "<p><b>Move</b> anywhere aboard; <b>attack</b> a Deep One in your space — 4 or better on the eight-sided die kills it; <b>rescue</b> passengers before something eats them — losing them usually costs resources; <b>trade</b> items; use an <b>“Action:”</b> on your sheet or a card; or use your <b>room</b>, once per turn, never with a Deep One in it. The <b>Boiler Room</b> drives us toward the next waypoint, the <b>Chapel</b> advances the banishing ritual, the <b>Galley</b> deals cards, the <b>Cargo Hold</b> finds items, the <b>Bridge</b> peeks at upcoming cards, and the <b>Captain’s Cabin</b> throws a suspect in the <b>Brig</b> if a skill check passes. Several rooms gamble a resource on a die roll.</p>"
    },
    {
      h: "The heart of it — crises and skill checks",
      body: (c) => "<p>Every mythos card brings a <b>crisis</b>. Some are a choice for the current player, the Captain or the Keeper of the Tome; others are <b>skill checks</b> — a target number and two or three helpful colors — and some let the chooser pick between a check and a penalty. Two random <b>chaos</b> cards go in face down, then, from the current player’s left, each of us adds any number of cards face down. Shuffle and flip: helping colors add, all others subtract. That’s where traitors sabotage, with the chaos cards as cover — so table talk stays vague: “I’m helping a lot,” never “I put in a strength five.” After the crisis, a <b>monster activates</b> and a <b>track advances</b>.</p>"
    },
    {
      h: "Monsters and the two tracks",
      body: (c) => "<p><b>Deep Ones</b> each do the first thing they can: attack a human in their space, kill a passenger, wreck their room, or move deeper into the ship. <b>Father Dagon</b> spawns two more beside him; <b>Mother Hydra</b> damages the nearest room; neither can be attacked. The <b>travel track</b> is our progress — each step pushes the monsters in the water astern, and at Arrive the Captain picks the next waypoint. The <b>ritual track</b> is our bomb: at Cast, the banishment clears Deep Ones off the deck and out of the water and sends the monarchs to the Deep — but it also defeats every passenger and character on deck. Be inside.</p>"
    },
    {
      h: "Traitors, the Brig and titles",
      body: (c) => "<p>Traitors can stay hidden — bad cards in checks, a Captain choosing short waypoints, a Keeper casting nasty spells — or spend an action to <b>reveal</b>. Revealed, they lose their titles and character abilities and skip the mythos step, but draw <b>treachery</b> cards, attack us, kill passengers when no human is there, and lock us out of their room. Hit one with a 6 or better and they go to the <b>Brig</b>; they escape by discarding 12 points of cards. Reveal before 12 distance and you pass your other loyalty cards on — maybe recruiting a new traitor. And humans: jail an innocent and they lose their titles and add only one card per check.</p>"
    },
    { when: (c) => c.mode === "learning",
      h: "Learning game — tonight’s differences",
      body: (c) => "<p>This is a <b>learning game</b>: nobody gets a loyalty card yet. For one full round we all play as loyal humans and ask anything. Once everyone has had a turn, we each get one loyalty card, study it for thirty seconds, and put it face down — from then on, anyone might be a traitor. No Cultist in a first game" + (UF.loy(c).cultSlot ? "; an extra Human card takes its place" : "") + ".</p>"
    },
    { when: (c) => c.has("fta"),
      h: "From the Abyss",
      body: () => "<p><b>Rescue</b> is stronger: one action saves every passenger in your space, or one in an adjacent water space, and each rescue calls an <b>ally</b> into your space. Before or after an action, discard skill cards worth at least an ally’s number to use it — one ally per human per turn — then it wanders off. Allies flee from monsters, revealed traitors and damage unless a human is with them.</p>" +
        "<p>The <b>horrors</b> — Shoggoth, Drowned Spirit and Grasping Tendril — can’t be killed: a 6 or better only <b>repels</b> one a space, and discarding cards worth 4 or more pushes it one space further. Only the travel track, at the stern, or the ritual’s banishment removes them — and, like a Deep One, a horror in a room shuts down its action. A <b>horror icon</b> advances the horror track while none are out — at Spawn one arrives — and activates one once they’re here.</p>" +
        "<p><b>Boon</b> cards always help a check, but you only draw them when a card says “boon”. Humans can now end up holding <b>treachery</b> cards and may add them to checks; only revealed traitors use their text. <b>Personal Crisis</b> cards make you resolve your own character’s crisis card, face down in front of you. And the Keeper now looks at three spells and resolves one.</p>"
    },
    { when: (c) => c.has("fta") && c.mod("prelude"),
      h: "Preludes",
      body: (c) => {
        let s = "<p>Before loyalties we resolve three <b>preludes</b>, events from earlier in the voyage: a <b>day</b> card, which favors the humans; a <b>twilight</b> card, which affects everyone; and a <b>night</b> card, which favors the hybrids.";
        if (c.mod("prelHum")) s += " We’ve agreed to <b>tilt them toward the humans</b>: the night card becomes a twilight card and/or the twilight card a day card.";
        if (c.mod("prelHyb")) s += " We’ve agreed to <b>tilt them toward the hybrids</b>: the day card becomes a twilight card and/or the twilight card a night card.";
        if (c.mod("prelExtra")) s += " And we’ll draw <b>extra preludes</b> on top of those.";
        return s + " Then the preludes leave the game.</p>";
      }
    },
    { when: (c) => c.mod("nocult"),
      h: "No-Cultist variant",
      body: (c) => "<p>We’re playing <b>without the Cultist</b>: an extra Human card takes its place, and the ship starts leaner — Fuel <b>7</b> · Food <b>6</b> · Sanity <b>6</b> · Souls <b>7</b> instead of 8 each" +
        (UF.dials(c).d ? " (before the difficulty adjustment below)" : "") + ".</p>"
    },
    { when: (c) => c.mod("easyH") || c.mod("easyT"),
      h: "Difficulty",
      body: (c) => "<p>We’ve made the game <b>easier for the " + (c.mod("easyH") ? "humans" : "traitors") + "</b>: every resource starts <b>two " + (c.mod("easyH") ? "higher" : "lower") + "</b> — " + UF.dialText(UF.dials(c).v) + ".</p>"
    },
    {
      h: "Don’t worry about these until they come up",
      body: (c) => {
        const items = [
          "<b>Brig and Sick Bay fine print</b> — it’s on your reference sheet.",
          "<b>Title succession</b> — printed on the title cards.",
          "<b>Improvement items</b> — only one active at a time.",
          "<b>Repairing damage</b> — each damage card says how.",
          "<b>Rerolls and modifiers</b> — the die stays between 1 and 8.",
          "<b>The awakening</b> — I’ll walk us through it at 6 distance."
        ];
        if (!c.has("fta")) items.push("<b>Green character-specific mythos cards</b> — redrawn if that character is absent, in the Brig or revealed.");
        if (c.has("fta")) items.push("<b>Horror details</b> — which one activates when several are out, and how each moves.");
        if (c.has("fta")) items.push("<b>0- and 6-value skill cards</b> — the 0s do something when flipped in a check.");
        return "<ul>" + items.map(i => "<li>" + i + "</li>").join("") + "</ul>";
      }
    }
  ]
};
