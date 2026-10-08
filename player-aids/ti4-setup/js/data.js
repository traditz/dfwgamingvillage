/* =============================================================================
   Twilight Imperium 4th Edition — Setup & Reference Utility · core data
   Base game + Prophecy of Kings, sourced ONLY from the PDFs in the game folder:
     LtP  = Learn to Play (base)                     printed page = PDF page
     RR   = Rules Reference (base, 2017)             printed page = PDF page
     LRR  = Living Rules Reference v2.0 (09/22/20)   printed page = PDF page (pp.2–3 unnumbered changelog)
     PoK  = Prophecy of Kings rulebook               printed page = PDF page
     Wiki FAQ / Wiki Errata = TI4 Wiki snapshots (2026-09-29); no pages — cited by topic
   Precedence (newest official ruling wins): TE/TF > Codex IV > III > II > LRR v2.0 > PoK >
   Codex I (its foreword, p.4, predates PoK) > RR > LtP. The LRR is "the definitive source for all TI4: PoK rules" (LRR p.4) and its
   errata (p.40) and FAQ (pp.40–44) are applied. Wiki FAQ [OFFICIAL] answers clarify points the
   PDFs leave open and are labelled; conflicts with a PDF are flagged, never silently applied.
   Codex I–IV, Thunder's Edge and Twilight's Fall content lives in js/data-codex.js and
   js/data-te.js (module files merged by app.js — see the contract in app.js).
   Context c: c.has(setId) · c.p (3–8) · c.mode ("standard" | "firstgame" | module mode id) ·
   c.mod(id) · c.galaxy (core galaxy build id: deal | hyper5 | large | alt | premade | ltp).
   ============================================================================= */
var TI = {};

/* ---------------- citation helper -------------------------------------------
   Glossary topics: [LRR section, LRR printed pages, RR section, RR pages, LtP pages].
   PoK-only topics have no RR entry. Base-only configurations also cite the base RR
   page (the printed booklet in the base box); the first game also cites the LtP. */
TI.TOP = {
  abilities:      [1, "7–8", 1, "4", null],
  actioncards:    [2, "8", 2, "5", "17"],
  actionphase:    [3, "8", 3, "5", "9–10"],
  activeplayer:   [4, "9", 4, "5", "9"],
  activesystem:   [5, "9", 5, "6", "13"],
  adjacency:      [6, "9", 6, "6", "14"],
  agendacard:     [7, "9", 7, "6", "20–21"],
  agendaphase:    [8, "10", 8, "6–7", "20–21"],
  anomalies:      [9, "10–11", 9, "7", "14"],
  afb:            [10, "11", 10, "7", "19"],
  asteroid:       [11, "11", 11, "8", "14"],
  attach:         [12, "11", 12, "8", null],
  attacker:       [13, "11", 13, "8", "14"],
  blockaded:      [14, "11", 14, "8", "16"],
  bombardment:    [15, "12", 15, "8", "19"],
  capacity:       [16, "12", 16, "8", "14"],
  capture:        [17, "12", null, null, null],
  combat:         [18, "13", 17, "8", "14"],
  commandsheet:   [19, "13", 18, "9", "10"],
  commandtokens:  [20, "13", 19, "9", "10"],
  commodities:    [21, "13–14", 20, "9", "17"],
  componentaction:[22, "14", 21, "10", "10"],
  limits:         [23, "14", 22, "10", "16"],
  construction:   [24, "14–15", 23, "10", "8"],
  control:        [25, "15", 24, "10–11", "5"],
  cost:           [26, "15", 25, "11", "16"],
  custodians:     [27, "15", 26, "11", "20"],
  deals:          [28, "16", 27, "11", "17"],
  defender:       [29, "16", 28, "11", "14"],
  deploy:         [30, "16", null, null, null],
  destroyed:      [31, "16", 29, "11", null],
  diplomacy:      [32, "16", 30, "12", "8"],
  elimination:    [33, "17", 31, "12", null],
  exhausted:      [34, "17", 32, "12", "11"],
  exploration:    [35, "17–18", null, null, null],
  fightertokens:  [36, "18", 33, "12", "16"],
  fleetpool:      [37, "18", 34, "12", "10"],
  frontier:       [38, "18–19", null, null, null],
  gameboard:      [39, "19", 35, "13", null],
  gameround:      [40, "19", 36, "13", "8"],
  gravityrift:    [41, "19", 37, "13", "14"],
  groundcombat:   [42, "19", 38, "13", "15"],
  groundforces:   [43, "20", 39, "13", "5"],
  hyperlanes:     [44, "20", null, null, null],
  imperial:       [45, "20", 40, "14", "9"],
  infantrytokens: [46, "20", 41, "14", "16"],
  influence:      [47, "20", 42, "14", "5"],
  initiative:     [48, "20–21", 43, "14", "8"],
  invasion:       [49, "21", 44, "15", "15"],
  leadersheet:    [50, "21", null, null, null],
  leaders:        [51, "21–22", null, null, null],
  leadership:     [52, "22", 45, "15", "8"],
  legendary:      [53, "22", null, null, null],
  mecatol:        [54, "22", 46, "15", "20"],
  mechs:          [55, "23", null, null, null],
  modifiers:      [56, "23", 47, "15", null],
  move:           [57, "23", 48, "16", "13"],
  movement:       [58, "23", 49, "16", "13"],
  nebula:         [59, "23", 50, "16", "14"],
  neighbors:      [60, "24", 51, "16", "17"],
  objectives:     [61, "24–25", 52, "16–17", "12"],
  opponent:       [62, "25", 53, "17", null],
  pds:            [63, "25", 54, "17", "19"],
  planets:        [64, "25", 55, "18", "5"],
  planetaryshield:[65, "25", 56, "18", "19"],
  politics:       [66, "26", 57, "18", "8"],
  producing:      [67, "26", 58, "18–19", "16"],
  production:     [68, "26–27", 59, "19", "16"],
  promissory:     [69, "27", 60, "19", "21"],
  purge:          [70, "27", null, null, null],
  readied:        [71, "27", 61, "20", "11"],
  reinforcements: [72, "27", 62, "20", "5"],
  relics:         [73, "28", null, null, null],
  rerolls:        [74, "28", 63, "20", null],
  resources:      [75, "28", 64, "20", "5"],
  ships:          [76, "28", 65, "20", "5"],
  spacecannon:    [77, "28–29", 66, "20–21", "14, 19"],
  spacecombat:    [78, "29–30", 67, "22", "14–15"],
  spacedock:      [79, "30", 68, "23", "16"],
  speaker:        [80, "30–31", 69, "23", "6"],
  status:         [81, "31", 70, "23", "11"],
  strategic:      [82, "31", 71, "24", "10"],
  strategycard:   [83, "31–32", 72, "24", "8–9"],
  strategyphase:  [84, "32", 73, "24", "8"],
  structures:     [85, "32", 74, "24–25", "5"],
  supernova:      [86, "32", 75, "25", "14"],
  sustain:        [87, "32–33", 76, "25", "19"],
  systemtiles:    [88, "33", 77, "25", "5"],
  tactical:       [89, "33", 78, "25", "13"],
  technology:     [90, "33–35", 79, "26", "18"],
  techcard:       [91, "35", 80, "27", "9"],
  trade:          [92, "35", 81, "27", "9"],
  tradegoods:     [93, "35", 82, "27", "17"],
  transactions:   [94, "35–36", 83, "28", "17"],
  transport:      [95, "36", 84, "28", "13"],
  units:          [96, "36", 85, "28", "5"],
  upgrades:       [97, "36", 86, "29", "18"],
  vp:             [98, "37", 87, "29", "12"],
  warfare:        [99, "37", 88, "29", "9"],
  nexus:          [100, "37", null, null, null],
  wormholes:      [101, "37", 89, "29", "14"]
};

/* TI.cite(c, ["spacecombat", "sustain"], ["LRR FAQ p.40", "Wiki FAQ (Timing)"])
   -> "LRR §78 p.29–30, §87 p.32–33 · RR §67 p.22, §76 p.25 · LRR FAQ p.40 · Wiki FAQ (Timing)" */
TI.cite = function (c, keys, extra) {
  const L = [], R = [], P = new Set();   /* P: LtP printed page numbers, so a page is never listed twice */
  const base = !c.has("pok");
  const first = c.mode === "firstgame";
  for (const k of keys || []) {
    const t = TI.TOP[k];
    if (!t) continue;
    const l = "§" + t[0] + " p." + t[1];
    if (L.indexOf(l) === -1) L.push(l);
    if (base && t[2] !== null) { const r = "§" + t[2] + " p." + t[3]; if (R.indexOf(r) === -1) R.push(r); }
    if (first && t[4]) String(t[4]).split(",").forEach((part) => {   /* "14", "14–15" or "14, 19" */
      const [a, b] = part.trim().split("–").map(Number);
      for (let n = a; n <= (b || a); n++) P.add(n);
    });
  }
  const out = [];
  if (P.size) {   /* ascending, consecutive pages as a range: "LtP p.13–15, p.19" */
    const runs = [];
    [...P].sort((x, y) => x - y).forEach((n) => { const r = runs[runs.length - 1]; if (r && n === r[1] + 1) r[1] = n; else runs.push([n, n]); });
    out.push("LtP " + runs.map((r) => "p." + r[0] + (r[1] > r[0] ? "–" + r[1] : "")).join(", "));
  }
  if (L.length) out.push("LRR " + L.join(", "));
  if (R.length) out.push("RR " + R.join(", "));
  return out.concat(extra || []).join(" · ");
};

/* ---------------- tags, sets, modes ------------------------------------------ */
TI.expMeta = {
  base:  { name: "Base game",         cls: "tag-base" },
  pok:   { name: "Prophecy of Kings", cls: "tag-pok" },
  ltp:   { name: "First game",        cls: "tag-ltp" },
  faq:   { name: "FAQ",               cls: "tag-faq" },
  opt:   { name: "Option",            cls: "tag-mod" }
};

TI.sets = [
  { id: "base", short: "Twilight Imperium 4E", year: "2017", name: "Twilight Imperium: Fourth Edition (base game)",
    blurb: "The base game: 17 factions, 3–6 players. Always in play." },
  { id: "pok", short: "Prophecy of Kings", year: "2020", name: "Prophecy of Kings",
    blurb: "Seven new factions, leaders, mechs, exploration, relics, legendary planets, the wormhole nexus, hyperlanes and 7–8 player games." }
];

TI.modes = [
  { id: "standard", name: "Standard game", requires: ["base"],
    blurb: "Complete Setup from the Rules Reference — build the galaxy, choose factions, race to 10 (or 14) victory points.",
    src: "LRR p.4–5 · RR p.2–3" },
  { id: "firstgame", name: "First game (Learn to Play)", requires: ["base"], baseOnly: true, minPlayers: 3, maxPlayers: 6,
    blurb: "The abridged First-Game Setup: a preset galaxy, six starter factions dealt at random, one secret objective, no promissory notes. Base game only.",
    src: "LtP p.6–7, p.21–23" }
];

/* ---------------- galaxy builds (core) ---------------------------------------
   One is always selected; c.galaxy holds its id and c.mod("gal-<id>") is true for it,
   so module files can exclude a build (e.g. excludes: ["gal-large"]).                */
TI.DEAL = {
  "3:deal":   { b: 6, r: 2, rings: 3 },
  "4:deal":   { b: 5, r: 3, rings: 3 },
  "5:deal":   { b: 4, r: 2, rings: 3, extra: "1 red", tg: true },
  "5:hyper5": { b: 3, r: 2, rings: 3, hl: "83A, 84A, 85A, 86A, 87A and 88A", hlSrc: "PoK p.9" },
  "6:deal":   { b: 3, r: 2, rings: 3 },
  "6:large":  { b: 6, r: 3, rings: 4 },
  "7:deal":   { b: 4, r: 2, rings: 4, extra: "2 red and 3 blue", hl: "83A, 84A, 85A, 86A, 87A and 88A", hlSrc: "PoK p.9" },
  "7:alt":    { b: 3, r: 2, alt: true, hl: "83B, 84B, 85B, 86B, 88B and 90B", hlSrc: "PoK p.12" },
  "8:deal":   { b: 4, r: 2, rings: 4, extra: "2 red and 2 blue" },
  "8:alt":    { b: 3, r: 2, alt: true, hl: "83B, 85B, 87A, 88A, 89B and 90B", hlSrc: "PoK p.12" },
  /* Thunder's Edge (TE p.7, p.12): five players — and four players with PoK — always use hyperlanes */
  "5:hyper5:te": { b: 3, r: 2, rings: 3, hl: "119A, 120A, 121A, 122A, 123A and 124A", hlSrc: "TE p.7", te: true },
  "4:hyper4":    { b: 3, r: 2, rings: 3, hlDiagram: true, hlSrc: "TE p.7", te: true }
};
TI.deal = (c) => TI.DEAL[c.p + ":" + c.galaxy + (c.has("te") && c.galaxy === "hyper5" ? ":te" : "")] || TI.DEAL[c.p + ":deal"];
/* Twilight's Fall (module mode id from js/data-te.js): TF p.6 returns standard strategy cards, action
   cards, agendas, technologies, promissory notes, faction sheets, leaders and standard mechs to the box;
   TF p.10 replaces the agenda phase with the benediction phase. Core sections adapt or hide in TF. */
TI.isTF = (c) => c.mode === "twilightsfall";
/* a module scenario mode (anything but the core Standard / First game and Twilight's Fall) */
TI.isScenario = (c) => c.mode !== "standard" && c.mode !== "firstgame" && !TI.isTF(c);
/* the Alliance game variant (module id "alliance" in js/data-codex.js): played on the 14-point side;
   an alliance wins when one ally has 14 victory points and the other at least 10 (Codex II p.13, TE p.13) */
TI.isAlliance = (c) => c.mode === "standard" && !!c.mod("alliance");
TI.allianceSrc = (c) => c.has("te") ? "TE p.13" : "Codex II p.13";
TI.PREMADE = { 3: 13, 4: 13, 5: 14, 6: 14, 7: 15, 8: 15 };
TI.PREMADE_HL = { 5: "83A, 84A, 85A, 86A, 87A and 88A", 7: "83B, 84B, 85B, 86B, 88B and 90B", 8: "83B, 85B, 87A, 88A, 89B and 90B" };
TI.LTP_MAP = { 3: 22, 4: 22, 5: 23, 6: 23 };

TI.galaxy = [
  { id: "deal",
    avail: (c) => c.mode !== "firstgame" && !(c.has("te") && (c.p === 5 || (c.p === 4 && c.has("pok")))),
    name: (c) => c.p === 5 ? "Build it — no hyperlanes" : c.p === 7 ? "Build it — 4 rings with hyperlanes" : c.p === 8 ? "Build it — 4 rings" : "Build it — deal & place tiles",
    blurb: (c) => { const d = TI.DEAL[c.p + ":deal"]; return d ? "Each player is dealt " + d.b + " blue and " + d.r + " red system tiles and you take turns placing them" + (d.extra ? "; the speaker first adds " + d.extra + " next to Mecatol Rex" : "") + (d.tg ? "; three crowded seats get bonus trade goods" : "") + "." : ""; },
    src: "LRR p.4–6 · RR p.2–3" },
  { id: "hyper5",
    avail: (c) => c.mode !== "firstgame" && c.p === 5 && (c.has("pok") || c.has("te")),
    name: () => "Build it — with hyperlanes",
    blurb: (c) => c.has("te")
      ? "Thunder’s Edge: five-player games use hyperlanes (tiles 119A–124A); each player is dealt 3 blue and 2 red tiles; no bonus trade goods."
      : "Six hyperlane tiles (83A–88A) balance the seats; each player is dealt 3 blue and 2 red tiles; no bonus trade goods.",
    src: "LRR p.4–6 · PoK p.9, p.11 · TE p.7, p.12" },
  { id: "hyper4",
    avail: (c) => c.mode !== "firstgame" && c.p === 4 && c.has("te") && c.has("pok"),
    name: () => "Build it — with hyperlanes",
    blurb: () => "Thunder’s Edge with Prophecy of Kings: four-player games use hyperlanes as shown on TE p.7; each player is dealt 3 blue and 2 red tiles.",
    src: "TE p.7, p.12" },
  { id: "large",
    avail: (c) => c.mode !== "firstgame" && c.p === 6 && c.has("pok"),
    name: () => "Large galaxy (4 rings)",
    blurb: (c) => c.has("te") ? "Four rings: 6 blue and 3 red tiles each; the 14-point track is recommended." : "Every tile from both boxes: 6 blue and 3 red tiles each; the 14-point track is recommended.",
    src: "PoK p.12 · LRR p.5" },
  { id: "alt",
    avail: (c) => c.mode !== "firstgame" && (c.p === 7 || c.p === 8) && c.has("pok"),
    name: () => "Alternate hyperlanes",
    blurb: (c) => "Hyperlanes inside the map for more equal starting positions (" + (c.p === 7 ? "83B, 84B, 85B, 86B, 88B, 90B" : "83B, 85B, 87A, 88A, 89B, 90B") + "); 3 blue and 2 red tiles each.",
    src: "PoK p.12 · LRR p.4–6" },
  { id: "premade",
    avail: (c) => c.mode !== "firstgame" && c.has("pok"),
    name: () => "Premade map",
    blurb: (c) => "Lay out the fixed " + c.p + "-player map printed on PoK p." + TI.PREMADE[c.p] + " instead of dealing tiles.",
    src: "PoK p.12–15" },
  { id: "ltp",
    avail: (c) => c.mode === "firstgame",
    name: () => "Learn to Play preset map",
    blurb: (c) => "Match the numbered tiles to the " + c.p + "-player preset map on LtP p." + (TI.LTP_MAP[c.p] || 22) + ".",
    src: "LtP p.7, p.22–23" }
];
TI.defaultGalaxy = (c) => c.mode === "firstgame" ? "ltp"
  : (c.p === 5 && (c.has("pok") || c.has("te"))) ? "hyper5"
  : (c.p === 4 && c.has("te") && c.has("pok")) ? "hyper4" : "deal";

/* ---------------- core options (same shape as module-file modules) ------------ */
TI.modules = [
  { id: "vp14", name: "The long war — 14 points", requires: ["base"], modes: ["standard", "twilightsfall"],
    when: (c) => !TI.isAlliance(c),   /* the Alliance variant always uses the 14 side (Codex II p.13, TE p.13) */
    summary: "Play to 14 victory points on the other side of the track",
    description: "As a group, players decide whether to use the 10- or 14-space side of the victory point track; the 14-space side is for a longer game. Prophecy of Kings recommends it for the six-player large galaxy.",
    src: "LRR p.5, §98 p.37 · RR p.3, §87 p.29 · LtP p.21 · PoK p.6, p.12" }
];

/* =============================================================================
   SETUP — every core card has id + anchor "lrr-setup-N" (N = the LRR Complete Setup step;
   0 = box preparation before step 1). Module steps insert by anchor (see app.js).
   ============================================================================= */
TI.phases = [
  {
    title: "Before you begin",
    steps: [
      { id: "lrr-setup-0", anchor: "lrr-setup-0", when: (c) => c.has("pok") && c.mode !== "firstgame", exp: "pok",
        t: "First time with Prophecy of Kings? Integrate the expansion",
        d: () => "<ul>" +
          "<li>Remove these <b>13 base-game agenda cards</b> — they are not used with the expansion: Core Mining, Demilitarized Zone, Holy Planet of Ixth, Representative Government, Research Team: Biotic, Research Team: Cybernetic, Research Team: Propulsion, Research Team: Warfare, Senate Sanctuary, Shard of the Throne, Terraforming Initiative, The Crown of Emphidia, The Crown of Thalnos.</li>" +
          "<li>Add each color’s <b>4 mech units</b>, <b>8 new technology cards</b> and <b>1 new promissory note</b> to that color’s components.</li>" +
          "<li>Add the remaining cards to their decks, and shuffle the new red-backed and blue-backed system tiles into the base-game piles (expansion tiles are numbered 52–91).</li>" +
          "<li>Replace the base <b>Diplomacy</b> and <b>Construction</b> strategy cards with the revised versions from the expansion.</li>" +
          "<li>Add the <b>7 new faction sheets</b> to the base-game sheets.</li></ul>",
        src: () => "PoK p.6" }
    ]
  },
  {
    title: "Players & factions",
    steps: [
      { id: "lrr-setup-1", anchor: "lrr-setup-1", when: () => true, exp: (c) => c.mode === "firstgame" ? "ltp" : "base",
        t: "Determine the speaker",
        d: (c) => "<ul><li>Randomly determine one player to take the <b>speaker token</b>; that player is the speaker" + (c.mode === "firstgame" ? " and will go first when the game begins" : "") + ".</li>" +
          "<li>The speaker chooses the first strategy card each round, prepares the objectives during setup (see “Prepare the objectives” below), reveals a new public objective in each status phase, and reveals the agendas, votes last and breaks ties in the agenda phase.</li></ul>",
        src: (c) => c.mode === "firstgame" ? TI.cite(c, ["speaker"]) : (c.has("pok") ? "LRR p.4 · " : "LRR p.4 · RR p.2 · ") + TI.cite(c, ["speaker"]) },

      { id: "lrr-setup-2", anchor: "lrr-setup-2", when: () => true, exp: (c) => c.mode === "firstgame" ? "ltp" : "base",
        t: (c) => c.mode === "firstgame" ? "Assign factions (six starter factions, dealt at random)" : "Choose factions",
        d: (c) => c.mode === "firstgame"
          ? "<ul><li>Gather these six faction sheets: <b>The Xxcha Kingdom, The Barony of Letnev, The Federation of Sol, The Sardakk N’orr, The Emirates of Hacan, The Universities of Jol-Nar</b>.</li>" +
            "<li>The speaker deals <b>one at random</b> to each player.</li>" +
            "<li>Each faction sheet shows the attributes and abilities of that faction’s units and its unique faction abilities. For every faction’s details see the <a href=\"../../ti.html\">Faction Reference</a>.</li></ul>"
          : "<ul><li>Each player chooses <b>one faction sheet</b> — their faction for the game — and places it in their play area.</li>" +
            "<li>The base game has 17 faction sheets" + (c.has("pok") ? "; Prophecy of Kings adds 7 more" : "") + (c.has("te") ? "; Thunder’s Edge adds six more factions, including the Council Keleres" : "") + ". For every faction’s abilities, units, technologies and leaders see the <a href=\"../../ti.html\">Faction Reference</a>.</li></ul>",
        src: (c) => c.mode === "firstgame" ? "LtP p.6" : (c.has("pok") ? "LRR p.4 · PoK p.6" : "LRR p.4 · RR p.2 · LtP p.4") + (c.has("te") ? " · TE p.4" : "") },

      { id: "lrr-setup-3", anchor: "lrr-setup-3", when: () => true, exp: (c) => c.mode === "firstgame" ? "ltp" : (c.has("pok") ? "pok" : "base"),
        t: "Gather faction components",
        d: (c) => {
          if (c.mode === "firstgame") return "<ul><li>Each player takes the components that show their faction’s symbol: <b>1 home system tile, 17 control tokens, 16 command tokens, 2 technology cards</b>.</li>" +
            "<li>Place your faction sheet and faction components in front of you; return all unused faction components to the box.</li>" +
            "<li>Promissory notes are <b>not used</b> in the first game — they are introduced as an advanced rule.</li></ul>";
          let d = "<ul><li>Each player takes the components that show their faction’s icon: <b>1 home system tile, 17 control tokens, 16 command tokens, 1 faction promissory note, 2 faction technology cards</b>" +
            (c.has("pok") ? ", <b>3 leader cards</b> (agent, commander, hero) and <b>1 mech unit card</b>" : "") + ", plus any faction-specific extras.</li>";
          d += "<li>Place them near your faction sheet; return all unused faction components to the box.</li>";
          if (c.has("pok")) {
            d += "<li><b>Factions with extra components</b> (LRR): the Naalu Collective, the Nekro Virus, the Ghosts of Creuss, the Embers of Muaat, the Vuil’raith Cabal, the Nomad, the Empyrean and the Titans of Ul. Prophecy of Kings adds:<ul>" +
              "<li>Ghosts of Creuss: 1 Creuss gamma wormhole token</li><li>Vuil’raith Cabal: 3 dimensional tear tokens</li><li>Nekro Virus: 3 dimensional tear tokens</li><li>Titans of Ul: 5 Ul sleeper tokens</li><li>Embers of Muaat: 1 Muaat supernova tile</li>" +
              "<li>The Nomad: two additional agents (“The Company” — five leaders in total)</li></ul></li>";
          }
          d += "<li>Base-game faction tokens: the Naalu “0” token, the Nekro Virus X/Y assimilator tokens and the Creuss alpha/beta wormhole tokens.</li>";
          if (c.has("pok")) d += "<li>Some faction sheets carry their own setup instructions — for example the Mahact Gene-Sorcerers purge their own “Alliance” promissory note during setup (“Hubris”). Read the sheet; details in the <a href=\"../../ti.html\">Faction Reference</a>.</li>";
          return d + "</ul>";
        },
        src: (c) => c.mode === "firstgame" ? "LtP p.6, p.21" : (c.has("pok") ? "LRR p.4 · PoK p.7–8 · LRR §51 p.21–22 · LtP p.4" : "LRR p.4 · RR p.2 · LtP p.4") },

      { id: "lrr-setup-4", anchor: "lrr-setup-4", when: () => true, exp: (c) => c.mode === "firstgame" ? "ltp" : (c.has("pok") ? "pok" : "base"),
        t: "Choose a color",
        d: (c) => {
          if (c.mode === "firstgame") return "<ul><li>Each player chooses a color and takes <b>59 plastic units, 1 command sheet and 25 technology cards</b> of that color.</li>" +
            "<li>Slide the edge of your command sheet under your faction sheet; place the other components nearby.</li></ul>";
          const pok = c.has("pok");
          let d = "<ul><li>Each player chooses a color and takes: <b>" + (pok ? "63" : "59") + " plastic units" + (pok ? " (including 4 mechs)" : "") + ", 1 command sheet, " + (pok ? "33" : "25") + " technology cards, " + (pok ? "5" : "4") + " promissory notes" + (pok ? ", 1 leader sheet" : "") + "</b>.</li>" +
            "<li>Combine your color’s technology cards with your 2 faction technologies into <b>one technology deck</b>, and your color’s promissory notes with your faction note into <b>one promissory note deck</b>. Keep both decks, your command sheet and your plastic in your play area. (You don’t own the technologies in your deck — only those you gain.)</li>";
          if (pok) d += "<li><b>Leader sheet:</b> slide its edge under your faction sheet. From top slot to bottom place your <b>agent, commander and hero</b>, then your <b>mech unit card</b>. Leaders go in showing the side with the slot icon in the upper-right corner — the hash marks (1 = agent, 2 = commander, 3 = hero) match the slot.</li>" +
            "<li>The Nomad’s two extra agents go in their play area, readied side up.</li>";
          return d + "</ul>";
        },
        src: (c) => c.mode === "firstgame" ? "LtP p.6" : (c.has("pok") ? "LRR p.4 · PoK p.8 · LRR §50–51 p.21 · §90 p.33" : "LRR p.4 · RR p.2 · LRR §90 p.33") },

      { id: "lrr-setup-5", anchor: "lrr-setup-5", when: () => true, exp: (c) => c.mode === "firstgame" ? "ltp" : "base",
        t: "Take your starting planet cards",
        d: () => "<ul><li>Each player takes the planet cards for the planets in their home system and places them <b>faceup</b> (readied) in their play area.</li></ul>",
        src: (c) => c.mode === "firstgame" ? "LtP p.6" : (c.has("pok") ? "LRR p.4" : "LRR p.4 · RR p.2") }
    ]
  },
  {
    title: "The galaxy",
    steps: [
      { id: "lrr-setup-6", anchor: "lrr-setup-6", when: () => true,
        exp: (c) => c.galaxy === "ltp" ? "ltp" : (TI.deal(c).te && c.galaxy !== "premade" ? "te" : (c.has("pok") ? "pok" : "base")),
        t: (c) => c.galaxy === "ltp" ? "Create the game board — preset map" : c.galaxy === "premade" ? "Create the game board — premade map" : "Create the game board",
        d: (c) => TI.galaxyStep(c),
        src: (c) => {
          if (c.galaxy === "ltp") return "LtP p.7, p." + TI.LTP_MAP[c.p];
          if (c.galaxy === "premade") return "PoK p.8, p.12, p." + TI.PREMADE[c.p] + " · LRR p.4" + (c.p === 5 ? " · PoK p.11" : "") + " · " + TI.cite(c, (TI.PREMADE_HL[c.p] ? ["hyperlanes"] : []).concat(["gameboard"]));
          const d = TI.deal(c), te = d.te;
          const s = [c.has("pok") ? "LRR p.4–6" : "LRR p.4–6 · RR p.2–3"];
          /* PoK p.8 = wormhole nexus; p.9 = the 5p hyperlane board and the 7p/8p boards; p.12 = large / alternate */
          if (c.has("pok")) s.push(c.galaxy === "alt" ? "PoK p.8, p.12, p.15" : c.galaxy === "large" ? "PoK p.8, p.12" : ((c.galaxy === "hyper5" && !te) || c.p >= 7 ? "PoK p.8–9" : "PoK p.8"));
          if (c.galaxy === "hyper5" && !te) s.push("PoK p.11");
          if (te) s.push(d.hlDiagram ? "TE p.7, p.12, p.15" : "TE p.7, p.12");
          if (c.has("te") && c.galaxy === "large") s.push("TE p.4");
          if (c.p === 5 && c.galaxy === "deal") s.push("LtP p.23");
          if (c.mod("ge-minorFactions") === true) s.push("Codex IV p.15");
          s.push(TI.cite(c, ["anomalies"].concat(d.hl || d.hlDiagram ? ["hyperlanes"] : [], ["gameboard"])));
          return s.join(" · ");
        } },

      { id: "lrr-setup-7", anchor: "lrr-setup-7", when: () => true, exp: (c) => c.mode === "firstgame" ? "ltp" : (c.has("pok") ? "pok" : "base"),
        t: (c) => c.has("pok") ? "Place game board tokens" : "Place the custodians token",
        d: (c) => {
          /* a map supplied by an option can put Mecatol Rex off-centre (Codex II pp.16, 18, 19 presets) */
          let d = "<ul><li>Place the <b>custodians token</b> on <b>Mecatol Rex</b>" + (c.galaxyFrom === "option" ? ", wherever this game’s map places it" : " in the center of the board") + ". Ships may enter its system as normal, but no one can land ground forces on Mecatol Rex until a player spends 6 influence to remove the token.</li>";
          if (c.has("pok")) d += "<li>Place <b>1 frontier token</b> in every non-home system that contains <b>no planets</b> — including anomalies without planets and the Creuss Gate system. Never on hyperlane tiles, and never more than 1 per system. Return the remaining frontier tokens to the box.</li>" +
            "<li>Place all <b>attachment tokens</b> near the game board.</li>";
          return d + "</ul>";
        },
        src: (c) => c.mode === "firstgame" ? "LtP p.7 · " + TI.cite(c, ["custodians"]) : (c.has("pok") ? "LRR p.5 · PoK p.8, p.16 · LRR §38 p.18–19 · §27 p.15" : "LRR p.5 · RR p.3 · " + TI.cite(c, ["custodians"])) }
    ]
  },
  {
    title: "Decks, supply & strategy cards",
    steps: [
      { id: "lrr-setup-8", anchor: "lrr-setup-8", when: () => true, exp: (c) => c.mode === "firstgame" ? "ltp" : (c.has("pok") ? "pok" : "base"),
        t: "Shuffle the common decks",
        d: (c) => "<ul><li>Shuffle separately and place in the common play area: the <b>action card</b>, <b>agenda</b>, <b>stage I objective</b>, <b>stage II objective</b> and <b>secret objective</b> decks.</li>" +
          (c.has("pok") ? "<li>Also shuffle the <b>relic deck</b> and each <b>exploration deck</b> separately — cultural, hazardous, industrial and frontier — and place them in the common play area.</li><li>The 13 removed base agendas stay out (see “Before you begin”).</li>" : "") + "</ul>",
        src: (c) => c.mode === "firstgame" ? "LtP p.7" : (c.has("pok") ? "LRR p.5 · PoK p.6, p.7–8" : "LRR p.5 · RR p.3") },

      { id: "lrr-setup-9", anchor: "lrr-setup-9", when: () => true, exp: (c) => c.mode === "firstgame" ? "ltp" : (c.has("pok") ? "pok" : "base"),
        t: "Create the supply",
        d: (c) => "<ul><li>Make separate piles in the common play area for <b>trade good tokens</b> (their other side is the commodity side), <b>fighter tokens</b> and <b>infantry tokens</b>.</li>" +
          "<li>Place the <b>planet cards</b>" + (c.has("pok") || c.has("te") ? " and the <b>legendary planet ability cards</b>" : "") + " near the game board.</li></ul>",
        src: (c) => c.mode === "firstgame" ? "LtP p.7 · LRR p.5, §21 p.13" : (c.has("pok") ? "LRR p.5 · §21 p.13" : "LRR p.5 · RR p.3 · LRR §21 p.13" + (c.has("te") ? " · TE p.4–5" : "")) },

      { id: "lrr-setup-10", anchor: "lrr-setup-10", when: () => true, exp: (c) => c.mode === "firstgame" ? "ltp" : "base",
        t: "Gather the strategy cards",
        d: (c) => "<ul><li>Place all <b>eight strategy cards</b> faceup in the common play area within reach of the speaker" +
          (c.has("pok") && c.has("te") ? " — using Prophecy of Kings’ revised Diplomacy card and Thunder’s Edge’s revised Construction and Warfare cards"
            : c.has("te") ? " — using Thunder’s Edge’s revised Construction and Warfare cards"
            : c.has("pok") ? " — using the revised Diplomacy and Construction cards from Prophecy of Kings" : "") + ".</li>" +
          (c.p <= 4 ? "<li>With " + c.p + " players each player will take <b>two</b> strategy cards every round.</li>" : "") + "</ul>",
        src: (c) => (c.mode === "firstgame" ? "LtP p.7" : (c.has("pok") ? "LRR p.5 · PoK p.6" : "LRR p.5 · RR p.3")) + (c.has("te") && c.mode !== "firstgame" ? " · TE p.4–5" : "") +
          (c.p <= 4 ? " · " + TI.cite(c, ["strategyphase"]).replace("LtP p.8", "LtP p.12") : "") }   /* LtP p.12: three- and four-player games */
    ]
  },
  {
    title: "Starting forces & objectives",
    steps: [
      { id: "lrr-setup-11", anchor: "lrr-setup-11", when: () => true, exp: (c) => c.mode === "firstgame" ? "ltp" : "base",
        t: "Gather starting components",
        d: (c) => "<ul><li>Each player gains the <b>starting technologies</b> and <b>starting units</b> listed on the back of their faction sheet: technology cards faceup near the faction sheet, units in the home system." +
          (c.mode === "firstgame" ? " If your home system has several planets, placing your space dock and infantry on the planet with the highest resource value is recommended." : "") + "</li>" +
          "<li>Command tokens: <b>3 in your tactic pool</b> and <b>2 in your strategy pool</b> (faction symbol faceup), and <b>3 in your fleet pool</b> (ship silhouette faceup). The rest are your reinforcements.</li>" +
          "<li>Players do <b>not</b> start with commodities — the commodity value on your faction sheet is only the most you can hold. You gain them through effects, such as replenishing with the Trade strategy card.</li></ul>",
        src: (c) => (c.mode === "firstgame" ? "LtP p.7" : (c.has("pok") ? "LRR p.5" : "LRR p.5 · RR p.3")) + " · LRR §20–21 p.13, §92 p.35 · Wiki FAQ (Commodities)" },

      { id: "lrr-setup-12", anchor: "lrr-setup-12", when: () => true, exp: (c) => c.mode === "firstgame" ? "ltp" : "base",
        t: "Prepare the objectives",
        d: (c) => "<ol>" +
          (c.mode === "firstgame"
            ? "<li>Each player draws <b>one secret objective</b> and keeps it hidden from the other players.</li>"
            : "<li>Each player draws <b>two secret objectives</b> and keeps <b>one</b>; shuffle the others back into the secret objective deck without revealing them.</li>") +
          (TI.isAlliance(c) ? "<li>Place the <b>victory point track</b> near the board with its <b>14-space</b> side faceup — the Alliance variant always plays to 14 (next step). Each player puts one control token on space <b>0</b>.</li>"
          /* Codex IV p.18 gives Liberation's winning totals but names no side of the track (open question) */
          : c.mode === "liberation" ? "<li>Place the <b>victory point track</b> near the board; each player puts one control token on space <b>0</b>. Codex IV sets this scenario’s winning totals — within the Salient Sun alliance (Sol and Xxcha) one player has <b>12</b> victory points and the other <b>10</b>; any other player wins at <b>10</b> — but doesn’t say which side of the track to use. The 10-space side can’t show 12, and Codex II’s Alliance rules, which the Salient Sun allies follow, use the 14-space side.</li>"
          : "<li>Place the <b>victory point track</b> near the board with its <b>" + (c.mod("vp14") ? "14-space" : "10-space") + "</b> side faceup" + (c.mode === "firstgame" ? "" : c.mode === "ordinian" ? " — like a standard game, Ordinian ends when a player gains their tenth victory point" : TI.isScenario(c) ? "" : " (the group decides: 10 or 14 — set under Options above)") + ". Each player puts one control token on space <b>0</b>.</li>") +
          "<li>The speaker deals <b>5 stage I</b> objectives facedown in a row above the track, then <b>5 stage II</b> objectives facedown in a row below it.</li>" +
          "<li>The speaker reveals the <b>first two stage I</b> objectives.</li></ol>" +
          (c.galaxy === "large" && c.galaxyFrom !== "option" && !c.mod("vp14") && !TI.isAlliance(c) ? "<p class=\"note\">Large galaxy: Prophecy of Kings recommends the 14-space side (turn on “The long war” above).</p>" : ""),
        src: (c) => {
          const s = [c.mode === "firstgame" ? "LtP p.7" : (c.has("pok") ? "LRR p.5" : "LRR p.5 · RR p.3")];
          if (TI.isAlliance(c)) s.push(TI.allianceSrc(c));
          else if (c.mode === "ordinian") s.push("Codex I p.12");
          else if (c.mode === "liberation") s.push("Codex IV p.18 · Codex II p.13");
          else if (c.mod("vp14")) s.push("LRR §98 p.37 · " + (c.has("pok") ? "PoK p.6" : "LtP p.21"));
          if (c.galaxy === "large" && c.galaxyFrom !== "option" && !TI.isAlliance(c)) s.push("PoK p.12");
          return s.join(" · ");
        } }
    ]
  },
  {
    title: "Begin play",
    steps: [
      { id: "play", anchor: "play", when: () => true, exp: (c) => c.mode === "firstgame" ? "ltp" : "base",
        t: "Start round 1 with the strategy phase",
        d: (c) => "<ul><li>Each round: <b>strategy phase → action phase → status phase</b>, " + (TI.isTF(c) ? "then the <b>benediction phase</b> — Twilight’s Fall replaces the agenda phase with it, and it happens even before anyone controls Mecatol Rex (see the Twilight’s Fall sections)." : (c.mode === "ordinian" ? "plus the <b>agenda phase</b> once the Coatl has been repaired (Ordinian scenario rules)."
            : c.mode === "liberation" ? "plus the <b>agenda phase</b> — but this scenario has no custodians token and Codex IV doesn’t say when the agenda phase begins, so agree on it before you start."
            : TI.isScenario(c) ? "plus the <b>agenda phase</b> once the scenario adds it."
            : "plus the <b>agenda phase</b> once a player has removed the custodians token from Mecatol Rex.")) + "</li>" +
          "<li>Round 1 begins with the speaker choosing a strategy card, then clockwise" + (c.p <= 4 ? "; with " + c.p + " players everyone then picks a second card, again from the speaker" : "") + ".</li>" +
          "<li>First time at the table? Open the <b>📖 Teaching script</b> above.</li></ul>",
        src: (c) => TI.cite(c, ["gameround", "strategyphase"]).replace("LtP p.8", c.p <= 4 ? "LtP p.8, p.12" : "LtP p.8") + (TI.isTF(c) ? " · TF p.10" : c.mode === "ordinian" ? " · Codex I p.12" : c.mode === "liberation" ? " · Codex IV p.18" : "") }
    ]
  }
];

/* the galaxy step body — one function so every build reads the same way */
TI.galaxyStep = function (c) {
  const p = c.p, pok = c.has("pok");
  if (c.galaxy === "ltp") {
    return "<ul><li>Build the galaxy from the <b>" + p + "-player preset map on LtP p." + TI.LTP_MAP[p] + "</b>: match the number in the leftmost corner of each system tile to the map.</li>" +
      "<li>Each player places their home system on the green space nearest their position around the table.</li>" +
      (p === 5 ? "<li><b>Five players:</b> the player closest to two other players takes <b>4 trade goods</b>; the two players on either side of that player take <b>2</b> each; the remaining two players (not within two tiles of any other player) take none.</li>" : "") +
      "<li>Experienced players build a custom galaxy each game instead (Complete Setup).</li></ul>";
  }
  if (c.galaxy === "premade") {
    const hl = TI.PREMADE_HL[p];
    return "<ul><li>Instead of dealing tiles, lay out the <b>" + p + "-player premade map on PoK p." + TI.PREMADE[p] + "</b>: Mecatol Rex in the center, every other system tile by the number printed on it.</li>" +
      "<li>Home systems go on the map’s green home-system spaces.</li>" +
      (hl ? "<li>This map includes the hyperlane tiles <b>" + hl + "</b> exactly as printed; systems joined by a hyperlane line are adjacent.</li>" : "") +
      "<li>Place the <b>wormhole nexus</b> in the common play area with its gamma-only side faceup, and the <b>3 gamma wormhole tokens</b> beside it.</li>" +
      (p === 5 ? "<li>This five-player map uses hyperlanes, so no starting-position trade goods are given.</li>" : "") +
      "<li><b>Ghosts of Creuss:</b> their home system sits apart from the map — follow the faction sheet; it still counts as part of the game board, on its edge.</li></ul>";
  }
  const d = TI.deal(c);
  let s = "<ol>";
  s += "<li>Place <b>Mecatol Rex</b> in the center of the table. " +
    (d.alt ? "This alternate-hyperlane galaxy has a <b>non-standard shape</b> — follow the diagram exactly." : "The galaxy has <b>" + d.rings + " rings</b> around it.") +
    " Home systems go at the positions shown in the <i>Game Board Setup</i> diagram (" + (d.te ? "TE p.7" : "LRR p.6" + (c.galaxy === "large" || c.galaxy === "alt" ? ", PoK p.12" : (pok && (c.galaxy === "hyper5" || p >= 7) ? ", PoK p.9" : ""))) + ") — use it to estimate where each player’s home system will sit.</li>";
  if (d.hl) s += "<li><b>Hyperlanes:</b> gather hyperlane tiles <b>" + d.hl + "</b> and place them exactly as the diagram shows (" + d.hlSrc + ")." +
    /* the alternate diagrams (LRR p.6, PoK p.12) show no tile numbers; PoK p.15's premade maps sit on the same hyperlane layout */
    (d.alt ? " That diagram doesn’t number the tiles; the " + p + "-player premade map on PoK p.15 uses the same hyperlane layout with each tile’s number printed in place." : "") +
    (d.te ? " Tile-by-tile positions: see the step before." : "") +   /* js/data-te.js step te-hyperlane-tiles, anchored before this step */
    " Systems connected by a hyperlane line are adjacent; hyperlane tiles are not systems.</li>";
  /* TE p.7 names only 119A–124A, but its four-player board has two six-tile rings and needs PoK (TE p.7, p.12);
     TE's own four-player map "Red vs Blue" (TE p.15) fills the second ring with PoK's 83A–88A */
  if (d.hlDiagram) s += "<li><b>Hyperlanes:</b> place the hyperlane tiles exactly as shown in the Thunder’s Edge <i>Four-Player Setup</i> diagram (" + d.hlSrc + "): tiles <b>119A–124A</b> for the lower hyperlane formation and Prophecy of Kings’ <b>83A–88A</b> for the upper one (TE names only 119A–124A; the second set is inferred from Thunder’s Edge’s own four-player map, TE p.15). Tile-by-tile positions: see the step before. Systems connected by a hyperlane line are adjacent; hyperlane tiles are not systems.</li>";
  if (pok) s += "<li><b>Wormhole nexus:</b> place it in the common play area with its <b>gamma-only side</b> faceup, and the <b>3 gamma wormhole tokens</b> beside it.</li>";
  s += "<li><b>Separate</b> the system tiles by the color of their backs into a <b>blue</b> pile and a <b>red</b> pile (green-backed tiles are home systems and stay out of both).</li>";
  const mf = c.mod("ge-minorFactions") === true;   /* Codex IV galactic event (js/data-codex.js choice): "players are dealt 1 fewer blue tile" (Codex IV p.15) */
  s += "<li><b>Deal:</b> shuffle each pile facedown and deal each player <b>" + (mf ? d.b - 1 : d.b) + " blue</b> and <b>" + d.r + " red</b> tiles" + (mf ? " — one blue fewer than usual, for the Minor Factions event (see its step above)" : "") + ".</li>";
  if (d.extra) s += "<li><b>Extra tiles:</b> before anyone places tiles, the speaker draws <b>" + d.extra + "</b> tile" + (d.extra === "1 red" ? "" : "s") + " from the unused tiles and places " + (d.extra === "1 red" ? "it" : "them") + " faceup adjacent to Mecatol Rex" + (pok && d.extra !== "1 red" ? ", one at a time in an order of their choice, following the normal placement rules" : "") + ".</li>";
  s += "<li><b>Place — snake order:</b> first put the home systems roughly where they will connect. Starting with the speaker and going clockwise, each player places one tile faceup in <b>ring 1</b>. The last player then places a second tile and placement reverses, counterclockwise, back to the speaker, who places two; then it reverses again. Repeat until every dealt tile is placed.<ul>" +
    "<li>Each ring must be <b>completely built</b> before any tile goes in the next ring" + (d.alt ? " — on this map the rings deviate from the standard shape, so check the diagram" : "") + ".</li>" +
    "<li><b>Anomalies</b> (red border on the tile’s corners) can’t be placed next to each other unless there is no other option; neither can two systems with the <b>same type of wormhole</b>.</li></ul></li>";
  s += "<li>After all dealt tiles are placed, attach the <b>home systems</b> to the galaxy.</li>";
  if (d.tg) s += "<li><b>Five players without hyperlanes:</b> three seats are at a slight disadvantage, so after the board is built those players take trade goods as the diagram shows: <b>+2, +4, +2</b> — the +4 goes to the middle seat, which is closest to two other players, and the seats either side of it take 2 each.</li>";
  if (c.galaxy === "hyper5") s += "<li>" + (d.te ? "With hyperlanes, the five-player starting-position trade goods are not given." : "Hyperlanes balance the starting positions, so no one receives the five-player starting trade goods.") + "</li>";
  if (c.galaxy === "large") s += c.has("te")
    ? "<li>The large galaxy was designed around every base-game and Prophecy of Kings tile (PoK p.12). With Thunder’s Edge’s tiles shuffled into the piles (TE p.4) you still deal only 6 blue and 3 red each, so some tiles stay in the box. With this much to go around, the 14-point victory track is recommended.</li>"
    : "<li>The large galaxy uses every tile from the base game and Prophecy of Kings; with this much to go around, the 14-point victory track is recommended.</li>";
  s += "<li><b>Ghosts of Creuss:</b> their home system isn’t connected to the rest of the galaxy — follow the faction sheet; it still counts as part of the game board, on its edge.</li>";
  return s + "</ol>";
};

/* =============================================================================
   RULES REFERENCE — {id, title, when, html(c), src(c)}. Module files append theirs
   (optionally positioned with after/replace: "<core id>" — see app.js).
   ============================================================================= */
TI.reference = [
  {
    id: "ref-round", title: "The game round at a glance", when: () => true,
    html: (c) => "<ol><li><b>Strategy phase</b> — starting with the speaker and going clockwise, each player takes a strategy card" + (c.p <= 4 ? " (with " + c.p + " players, a second one too)" : "") + ".</li>" +
      "<li><b>Action phase</b> — in initiative order, one action per turn (tactical, strategic or component), round and round until everyone has passed.</li>" +
      "<li><b>Status phase</b> — score objectives, reveal a public objective, draw action cards, reset command tokens, ready cards, repair units, return strategy cards.</li>" +
      (TI.isTF(c) ? "<li><b>Benediction phase</b> (Twilight’s Fall) — replaces the agenda phase. It happens even if nobody controls Mecatol Rex, but is skipped while there is no tyrant; see the Twilight’s Fall sections.</li></ol>" : "<li><b>Agenda phase</b> — " + TI.agendaStart(c) + "</li></ol>") +
      "<ul><li>The game ends the moment " + (TI.isAlliance(c) ? "an alliance meets its victory condition (one ally at 14 victory points, the other at 10 or more — " + TI.allianceSrc(c) + ")" : c.mode === "liberation" ? "one of the allied Sol/Xxcha players has <b>12</b> victory points and the other <b>10</b>, or any other player has <b>10</b> (Codex IV p.18)" : "a player has <b>" + (c.mod("vp14") ? "14" : "10") + " victory points</b>") + " — or when the speaker must reveal a public objective and none are left" + (TI.isAlliance(c) ? "." : " (most points wins).") + "</li>" +
      "<li>Effects that last “until the end of your turn” end when your turn ends; they don’t carry into other phases.</li></ul>",
    src: (c) => TI.cite(c, ["gameround", "custodians", "vp"]) + (TI.isTF(c) ? " · TF p.10" : "") + TI.scenarioSrc(c)
  },
  {
    id: "ref-strategy-phase", title: "Strategy phase & initiative order", when: () => true,
    html: (c) => "<ul><li>Starting with the <b>speaker</b> and going clockwise, each player chooses one strategy card from the common play area and places it faceup in their play area. A card someone already chose this phase can’t be chosen.</li>" +
      "<li>Any <b>trade goods</b> sitting on a card go to the player who takes it.</li>" +
      (c.p <= 4 ? "<li><b>" + c.p + " players:</b> after the last player receives a first card, everyone chooses a <b>second</b> card, again starting with the speaker and going clockwise.</li>" : "") +
      "<li>Then the speaker places <b>1 trade good</b> from the supply on each card nobody chose." + (c.p === 4 || c.p === 8 ? " (With " + c.p + " players every card is chosen, so none get trade goods.)" : "") + "</li>" +
      "<li><b>Initiative order</b> runs from the lowest-numbered chosen card upward (unchosen cards are ignored); it sets turn order in the action and status phases." + (c.p <= 4 ? " With 3 or 4 players only your <b>lowest</b>-numbered card counts." : "") + " The Naalu “0” token gives its holder initiative 0.</li>" +
      (c.p >= 5 ? "<li>If eliminations shrink a game that began with five or more players to four or fewer, players still take only one card each.</li>" : "") + "</ul>",
    src: (c) => { let s = TI.cite(c, ["strategyphase", "initiative"]);
      if (c.p >= 5) s = s.replace("§48 p.20–21", "§48 p.20–21, §33 p.17");   /* the 5+ → 4-or-fewer rule is LRR §33.9 only (RR §31 has no such clause) */
      return c.p <= 4 ? s.replace("LtP p.8", "LtP p.8, p.12") : s; }
  },
  {
    id: "ref-action-phase", title: "Action phase — actions, passing & turn order", when: () => true,
    html: (c) => "<ul><li>Players take turns in initiative order; on your turn you perform <b>one action</b>:<ul>" +
      "<li><b>Tactical action</b> — spend a command token from your tactic pool to activate a system; move, fight, invade, produce (see below).</li>" +
      "<li><b>Strategic action</b> — resolve the <b>primary</b> ability of your strategy card; then each other player, starting on your left and going clockwise, may resolve its <b>secondary</b> ability (usually by spending a token from their strategy pool). Then exhaust the card. You can’t use the secondary of your own card, and effects resolve top to bottom.</li>" +
      "<li><b>Component action</b> — an ability headed “Action” on a component such as " + (TI.isTF(c) ? "an action card, an ability, genome or paradigm card" + (c.has("pok") ? ", an exploration card" : "") + " or a relic" : (c.has("pok") ? "an action card, technology, faction sheet, promissory note, leader, exploration card or relic" : c.mode === "firstgame" ? "an action card, technology or faction sheet" : "an action card, technology, faction sheet" + (c.has("te") ? ", promissory note or relic" : " or promissory note"))) + ". It can’t be performed unless it can be completely resolved; if it is canceled, it doesn’t use your action.</li></ul></li>" +
      "<li>You <b>can’t pass</b> until you have performed the strategic action of your strategy card" + (c.p <= 4 ? " — with " + c.p + " players, until <b>both</b> of your cards are exhausted" : "") + ". If you can’t perform any action, you must pass.</li>" +
      "<li>After passing you take no more turns this phase, but you can still resolve the secondary abilities of other players’ strategy cards. On the turn you pass you can still make transactions, use “at the start of your turn” abilities and resolve “end of turn” abilities.</li>" +
      "<li>If everyone else has passed, you may take several actions in a row. When all players have passed, go to the status phase.</li></ul>",
    src: (c) => { const s = TI.cite(c, ["actionphase", "activeplayer", "strategic", "strategycard", "componentaction"], ["Wiki FAQ (Passing)"].concat(TI.isTF(c) ? ["TF p.9"] : c.has("te") && !c.has("pok") ? ["TE p.10"] : []));
      return c.p <= 4 ? s.replace("LtP p.8–10", "LtP p.8–10, p.12") : s; }
  },
  {
    id: "ref-cards", title: "The eight strategy cards", when: (c) => !TI.isTF(c),
    html: (c) => "<div class=\"table-wrap\"><table><thead><tr><th>#</th><th>Card</th><th>Primary (you)</th><th>Secondary (others)</th></tr></thead><tbody>" +
      "<tr><td>1</td><td><b>Leadership</b></td><td>Gain 3 command tokens. Then spend any amount of influence: 1 more token per 3 influence spent.</td><td>Spend any amount of influence: 1 token per 3 influence. <b>No strategy token needed.</b></td></tr>" +
      "<tr><td>2</td><td><b>Diplomacy</b></td><td>Choose 1 system, other than the Mecatol Rex system, that contains a planet you control: each other player places a command token from their reinforcements in it. Then ready up to 2 exhausted planets you control.</td><td>1 strategy token: ready up to 2 exhausted planets you control.</td></tr>" +
      "<tr><td>3</td><td><b>Politics</b></td><td>Choose a player other than the speaker (you, if you aren’t the speaker) to take the speaker token; draw 2 action cards; secretly look at the top 2 agenda cards and put each on the top or bottom of the deck.</td><td>1 strategy token: draw 2 action cards.</td></tr>" +
      (c.has("te") ? "<tr><td>4</td><td><b>Construction</b></td><td colspan=\"2\">Thunder’s Edge replaces this card with a revised version — use the printed card (see “Revised strategy cards” below).</td></tr>" :
      "<tr><td>4</td><td><b>Construction</b></td><td>You may place 1 PDS or 1 space dock on a planet you control; then you may place 1 more PDS on a planet you control (any systems, token or not).</td><td>1 strategy token, placed in any system (if you already have one there it goes to reinforcements): place 1 PDS or 1 space dock on a planet you control in that system.</td></tr>") +
      "<tr><td>5</td><td><b>Trade</b></td><td>Gain 3 trade goods; replenish your commodities; choose any number of other players — they use the secondary for free (once; during the secondary).</td><td>1 strategy token: replenish your commodities.</td></tr>" +
      (c.has("te") ? "<tr><td>6</td><td><b>Warfare</b></td><td colspan=\"2\">Thunder’s Edge replaces this card with a revised version — use the printed card (see “Revised strategy cards” below).</td></tr>" :
      "<tr><td>6</td><td><b>Warfare</b></td><td>Remove 1 of your command tokens from the board and gain it (any pool); then redistribute your command tokens.</td><td>1 strategy token: use the Production of <b>1 space dock in your home system</b> (the token is not placed there).</td></tr>") +
      "<tr><td>7</td><td><b>Technology</b></td><td>Research 1 technology; then you may spend 6 resources to research 1 more.</td><td>1 strategy token and 4 resources: research 1 technology.</td></tr>" +
      "<tr><td>8</td><td><b>Imperial</b></td><td>Score 1 public objective whose requirements you meet; then gain 1 victory point if you control Mecatol Rex, otherwise draw 1 secret objective.</td><td>1 strategy token: draw 1 secret objective.</td></tr>" +
      "</tbody></table></div>" +
      "<ul><li>Diplomacy is shown with its errata applied (LRR p.40). Diplomacy: players with no command tokens in reinforcements place one from their command sheet; a player who already has a token in the chosen system places none.</li>" +
      "<li>Secret objectives: you may hold at most 3, scored and unscored together — if a draw takes you over, return an unscored one and shuffle the deck.</li>" +
      (c.has("pok") ? "<li>Prophecy of Kings replaced the base Diplomacy and Construction cards with revised versions.</li>" : "") +
      (c.has("te") ? "<li><b>Thunder’s Edge</b> replaces the Construction and Warfare cards with revised versions (TE p.4; both cards are pictured on TE p.5) — use the text on those cards.</li>" : "") +
      "</ul>",
    src: (c) => TI.cite(c, ["leadership", "diplomacy", "politics", "construction", "trade", "warfare", "techcard", "imperial"], ["LRR errata p.40", "LRR FAQ p.41"].concat(c.has("pok") ? ["PoK p.6"] : []).concat(c.has("te") ? ["TE p.4–5"] : []))
  },
  {
    id: "ref-tactical", title: "Tactical action — step by step", when: () => true,
    html: (c) => "<ol><li><b>Activation</b> — place a command token from your <b>tactic pool</b> in a system that doesn’t already contain one of your command tokens (other players’ tokens don’t stop you). It is the <b>active system</b> for the whole action.</li>" +
      "<li><b>Movement</b><ol type=\"i\"><li><b>Move ships</b> into the active system (see Movement).</li><li><b>Space cannon offense</b> — starting with the active player and going clockwise, players may fire the Space Cannon of their units in the active system.</li></ol></li>" +
      "<li><b>Space combat</b> — if two players have ships in the active system: anti-fighter barrage (first round only), announce retreats, roll dice, assign hits, retreat. Skipped if only you have ships there.</li>" +
      "<li><b>Invasion</b><ol type=\"i\"><li>Bombardment</li><li>Commit ground forces</li><li>Space cannon defense</li><li>Ground combat</li><li>Establish control</li></ol></li>" +
      "<li><b>Production</b> — resolve the Production abilities of your units in the active system, even if you moved nothing and landed nothing.</li></ol>" +
      "<p>During your turn you may make one transaction with each neighbor at any time — even during combat.</p>",
    src: (c) => TI.cite(c, ["tactical", "activesystem", "commandsheet", "transactions"])
  },
  {
    id: "ref-movement", title: "Movement, transport, capacity & fleet limits", when: () => true,
    html: (c) => "<h4>Move ships</h4><ul>" +
      "<li>Move any number of your ships with enough <b>move</b> value into the active system. Declare every moving ship first; they arrive simultaneously.</li>" +
      "<li>A ship must <b>end</b> its move in the active system; it follows a path of adjacent systems and can’t enter more systems than its move value (it may leave the active system and come back if it has the move).</li>" +
      "<li>A ship <b>can’t move through</b> a system containing another player’s ships — <b>fighters count</b> (they block movement).</li>" +
      "<li>A ship <b>can’t move at all</b> if it starts in another system that contains one of your command tokens; it <b>can</b> move through systems with your own tokens.</li>" +
      "<li>Only the destination is moved “into”; every other system is moved “through”. When several paths exist (wormholes or ordinary adjacency) the mover chooses.</li>" +
      "<li>Abilities that move units outside the Movement step of a tactical action follow their own text; move values and these rules don’t apply.</li></ul>" +
      "<h4>Transport &amp; capacity</h4><ul>" +
      "<li><b>Fighters and ground forces don’t move on their own</b> — the standard fighter and infantry have no move value — so they travel by being transported. Ground forces are always on a planet or in a space area with your ships that have capacity. (A unit upgrade’s printed values replace the faction sheet’s.)</li>" +
      "<li>A ship with <b>capacity</b> carries up to that many fighters and ground forces in any mix. During a tactical action it may pick them up in the system it starts in, each system it moves through, and the active system — but not from a system containing your command token, other than the active system. They stay with it, in the space area, until it finishes moving; ground forces land during the invasion.</li>" +
      "<li class=\"note flag\"><b>Sources disagree.</b> LRR v2.0 §95.3 — followed here — says fighters and ground forces can’t be picked up from a system that contains your command token (other than the active system), and doesn’t limit this to tactical actions. The TI4 Wiki FAQ (Movement Abilities) reports an official ruling that the restriction applies only during tactical actions, so ships moved by an ability could pick units up there, and says the LRR “will be updated”; LRR v2.0 has not been.</li>" +
      "<li>Any effect that moves a ship lets it transport units from its system if it has capacity (e.g. the “Skilled Retreat” action card).</li>" +
      "<li>Your fighters and ground forces in a system’s <b>space area</b> can’t exceed the combined capacity of your ships there — remove the excess (your choice). Ground forces on planets don’t count. During combat capacity is ignored; excess units are removed when the combat ends.</li></ul>" +
      "<h4>Fleet pool</h4><ul>" +
      "<li>The number of tokens in your <b>fleet pool</b> is the most <b>non-fighter ships</b> you may have in any one system. Units on planets, units counting against capacity and units being transported through don’t count.</li>" +
      "<li>Whenever you exceed it, choose and remove the excess ships (returned to reinforcements — not destroyed). Fleet-pool tokens aren’t spent unless an effect says so.</li></ul>" +
      "<h4>Adjacency</h4><ul><li>Systems are adjacent if their tile sides touch; systems with matching wormholes are adjacent" + (c.has("pok") || c.has("te") ? "; systems joined by hyperlane lines are adjacent for all purposes" : "") + ". A unit or planet is adjacent to every system adjacent to its own; a planet is adjacent to its own system; a system is not adjacent to itself.</li></ul>",
    src: (c) => TI.cite(c, ["movement", "transport", "capacity", "groundforces", "upgrades", "fleetpool", "adjacency"], [TI.isTF(c) ? "King faction sheets (shown TF p.6–7)" : "faction sheet (shown LtP p.6)", "LRR FAQ p.40–41", "Wiki FAQ (Moving Into Systems; Path of Movement; Movement Abilities)"])
  },
  {
    id: "ref-anomalies", title: (c) => c.has("pok") ? "Anomalies, wormholes, the wormhole nexus & hyperlanes" : "Anomalies & wormholes", when: () => true,
    html: (c) => "<h4>Anomalies</h4><p class=\"sub\">Anomaly tiles have a red border on their corners; some contain planets and are still anomalies. Abilities can make a system an anomaly, or two kinds of anomaly at once.</p>" +
      "<div class=\"table-wrap\"><table><thead><tr><th>Anomaly</th><th>Rule</th></tr></thead><tbody>" +
      "<tr><td><b>Asteroid field</b></td><td>Ships can’t move through or into it.</td></tr>" +
      "<tr><td><b>Supernova</b></td><td>Ships can’t move through or into it.</td></tr>" +
      "<tr><td><b>Nebula</b></td><td>Ships can move into it only if it is the active system, and can’t move through it. A ship that starts the Movement step in a nebula has move 1 for that step (other effects can raise it). In a space combat there, the <b>defender</b> applies +1 to their ships’ combat rolls.</td></tr>" +
      "<tr><td><b>Gravity rift</b></td><td>A ship that moves out of or through a rift applies <b>+1 to its move</b> — but each rift gives a given ship that bonus <b>only once</b> (newest ruling, below). Immediately before it exits the rift, roll 1 die for it: on <b>1–3</b> it is <b>removed</b> (returned to reinforcements — not “destroyed”), together with anything it transports (transported units aren’t rolled for). It rolls each time it exits a rift, even the same rift twice in one move; several rifts in one system count as one.</td></tr>" +
      "</tbody></table></div>" +
      "<p class=\"note\">Newest ruling (Thunder’s Edge p.16, 2025): a gravity rift can contribute its movement bonus to a ship passing through it only once per ship — “a change from previous rulings” (LRR §41.3 let the same rift affect a ship several times in one move). Applied to every game here as the newest official ruling.</p>" +
      "<h4>Wormholes</h4><ul>" +
      "<li>Systems with <b>matching wormholes</b> (alpha–alpha, beta–beta) are adjacent for all purposes, so players can be neighbors and transact through them.</li>" +
      "<li>PDS with the PDS unit upgrade can fire Space Cannon into adjacent systems, including through wormholes.</li>" +
      "<li><b>Delta</b> wormholes: on the Creuss Gate tile and the Ghosts of Creuss home system.</li>" +
      (c.has("pok") ? "<li><b>Gamma</b> wormholes (PoK): on the wormhole nexus, and found through exploration.</li>" : "") + "</ul>" +
      (c.has("pok") ? "<h4>Wormhole nexus (PoK)</h4><ul><li>Starts in play off the map, <b>inactive</b> side up (only a gamma wormhole); it is part of the game board, on its edge.</li><li>After a player moves or places a unit into it, or gains control of its planet <b>Mallice</b>, flip it to its <b>active</b> side (alpha, beta and gamma). A ship moving in activates it at the <b>end</b> of the Movement step.</li></ul>" +
        "<h4>Hyperlanes (PoK)</h4><ul><li>Each continuous line across one or more hyperlane tiles is a hyperlane; the systems it connects are <b>adjacent for all purposes</b>.</li><li>Hyperlane tiles are not systems: no units can be on them and they can’t be targeted by abilities.</li><li class=\"note flag\"><b>Sources disagree — board edge on hyperlane maps.</b> LRR §39.2 — followed here — puts a system on the edge if any of its sides doesn’t touch another system tile, and hyperlane tiles are not systems (§44.2). The TI4 Wiki FAQ (Hyperlanes) reports the designer’s intent that a side touching a hyperlane tile doesn’t count as an edge.</li></ul>" : "") +
      "<p class=\"sub\">Board edge: a system tile is on the edge of the board if any side doesn’t touch another system tile. The Ghosts of Creuss home system" + (c.has("pok") ? " and the wormhole nexus are" : " is") + " on the edge.</p>",
    src: (c) => TI.cite(c, ["anomalies", "asteroid", "supernova", "nebula", "gravityrift", "wormholes", "gameboard"].concat(c.has("pok") ? ["nexus", "hyperlanes"] : []), (c.has("pok") ? ["PoK p.11, p.16", "Wiki FAQ (Hyperlanes; Units & Unit Abilities)"] : ["Wiki FAQ (Units & Unit Abilities)"]).concat(["TE p.16"]))
  },
  {
    id: "ref-cannon", title: "Space cannon — offense & defense", when: () => true,
    html: () => "<ul><li>Written <b>Space Cannon X (xY)</b>: roll Y dice (1 if no Y); each result of X or more is a hit. Effects that reroll or modify <b>combat</b> rolls don’t affect space cannon rolls. You needn’t be the active player to use it, and using it is optional.</li></ul>" +
      "<h4>Offense — after the Move Ships step</h4><ul>" +
      "<li>Starting with the active player and going clockwise, each player may fire the Space Cannon of their units <b>in the active system</b> — even if no ships moved.</li>" +
      "<li>Other players must target the <b>active player</b>; the active player chooses a player with ships there. The targeted player destroys one of their own ships in the active system per hit.</li>" +
      "<li>With a PDS unit upgrade, your PDS in systems <b>adjacent</b> to the active system may fire too; hits still land in the active system.</li></ul>" +
      "<h4>Defense — during an invasion</h4><ul>" +
      "<li>After ground forces are committed, players other than the active player may fire the Space Cannon of their units <b>on each invaded planet</b>.</li>" +
      "<li>The active player destroys one of their ground forces <b>on that planet</b> per hit. Adjacent-system firing has no effect here.</li>" +
      "<li>If several invaded planets have space cannons, the active player chooses the order.</li></ul>" +
      "<p class=\"sub\">Sustain Damage can cancel space cannon hits (see Space combat).</p>",
    src: (c) => TI.cite(c, ["spacecannon", "invasion"], ["Wiki FAQ (Units & Unit Abilities)"])
  },
  {
    id: "ref-space-combat", title: "Space combat — anti-fighter barrage, retreats, sustain damage", when: () => true,
    html: () => "<p class=\"sub\">If two players have ships in the active system after space cannon offense, they must fight. The active player is the <b>attacker</b>, the other the <b>defender</b>. “Before combat” abilities happen just before anti-fighter barrage.</p><ol>" +
      "<li><b>Anti-fighter barrage</b> (first round only) — both players may, simultaneously, roll for their units with <b>Anti-Fighter Barrage X (xY)</b>; each hit destroys one of the opponent’s fighters in the system (extra hits are lost). Combat-roll modifiers and rerolls don’t apply. The step happens even with no fighters present. If a player then has no ships left, the combat ends.</li>" +
      "<li><b>Announce retreats</b> — defender first; if the defender announces, the attacker can’t this round. You need an eligible system to retreat to.</li>" +
      "<li><b>Roll dice</b> — one die per ship (a combat value with several burst icons rolls that many dice); each result equal to or above the ship’s combat value is a hit. Roll by combat value (1s first, then 2s…); the attacker rolls everything before the defender. Resolve rerolls and die-affecting abilities right after rolling all your dice.</li>" +
      "<li><b>Assign hits</b> — each player chooses and destroys one of their own ships per hit scored against them; <b>Sustain Damage</b> may cancel hits first.</li>" +
      "<li><b>Retreat</b> — a player who announced a retreat (and still has an eligible system) must retreat: move all their ships that have a move value to <b>one adjacent system</b> that contains their units and/or a planet they control and <b>no other player’s ships</b>. Retreating ships may transport fighters and ground forces up to their capacity — including ground forces picked up from planets in the active system. Fighters and ground forces that can’t move or be transported are removed. Place a command token from reinforcements in that system (from your command sheet if you have none; none if one is already there). If the opponent has no ships left, the combat simply ends.</li></ol>" +
      "<ul><li>While both players still have ships, repeat from <b>Announce retreats</b>. The player with ships left is the <b>winner</b>; if neither has any, it is a draw. The winner then removes fighters and ground forces beyond their ships’ capacity.</li>" +
      "<li><b>Sustain Damage</b>: immediately before assigning hits, each of your units in the active system with this ability may cancel 1 hit and is turned on its side (damaged). A damaged unit works normally but can’t sustain again until it is repaired (in the status phase or by another game effect). It works against any hit the unit could take (combat, space cannon…) — not against anti-fighter barrage on a non-fighter, and not against effects that directly “destroy”.</li>" +
      "<li><b>Rerolls</b>: the same ability can’t reroll the same die twice, but several abilities can each reroll it. A “0” on the die is a 10.</li>" +
      "<li>If neither side can possibly win (e.g. certain Non-Euclidean Shielding and Duranium Armor combinations), the attacker must retreat; if they can’t, their units in the combat are destroyed.</li>" +
      "<li>“Start of combat” and “start of combat round” effects share a window in round 1; “end of combat” and “end of combat round” share one in the last round.</li>" +
      "<li><b>Opponent:</b> the other player who had ships in the system at the start of the space combat (or ground forces on the planet at the start of a ground combat). Players with no units on either side aren’t opponents — they can’t use abilities that work against an opponent, or be targeted by them.</li></ul>",
    src: (c) => TI.cite(c, ["spacecombat", "afb", "sustain", "rerolls", "attacker", "defender", "opponent", "transport"], ["LRR FAQ p.40–41"].concat(c.has("codex1") ? ["Codex I p.14"] : []).concat(["Wiki FAQ (Units & Unit Abilities)"]))
  },
  {
    id: "ref-invasion", title: "Invasion & ground combat (incl. bombardment and the custodians)", when: () => true,
    html: (c) => "<ol><li><b>Bombardment</b> — the active player may use the <b>Bombardment X (xY)</b> of their units in the active system: declare which planet each unit bombards, then roll; the planet’s controller destroys one of their ground forces there per hit. Planets holding a unit with <b>Planetary Shield</b> can’t be bombarded — except by a <b>war sun</b>, which ignores other players’ planetary shields in its system. Only the active player can bombard, and rerolls/modifiers for combat rolls don’t apply.</li>" +
      "<li><b>Commit ground forces</b> — land any number of your ground forces from the space area of the active system onto any of its planets, even ones holding enemy ground forces. Landing nothing? Skip to Production.<ul><li>" + (c.mode === "ordinian" ? "<b>Ordinian scenario:</b> Mecatol Rex isn’t used and the custodians token is the <b>Coatl</b>, whose own rules replace the standard custodians rules (see “Ordinian scenario: the Coatl”)." : c.mode === "liberation" ? "<b>Liberation of Ordinian:</b> Mecatol Rex isn’t used and no custodians token is placed; effects that refer to Mecatol Rex refer to Ordinian." :
        "<b>Mecatol Rex:</b> no one can land there while the <b>custodians token</b> is on it. Just before this step the active player may spend <b>6 influence</b> to remove it — they must then land at least one ground force there. They take the token and gain <b>1 victory point</b>" + (TI.isTF(c) ? "." : ", and the agenda phase joins every round from now on (including this one).")) + "</li></ul></li>" +
      "<li><b>Space cannon defense</b> — see Space cannon.</li>" +
      "<li><b>Ground combat</b> — on each planet where you and another player both have ground forces (you choose the order): each player rolls one die per ground force (hits on results ≥ its combat value), then destroys one of their own ground forces per hit; repeat until one side (or neither) is left.</li>" +
      "<li><b>Establish control</b> — you gain control of each planet you committed to that still has your ground forces: take its planet card <b>exhausted</b>; other players’ structures there are destroyed. If everyone on both sides died, the <b>defender</b> keeps the planet and marks it with a control token." + (c.has("pok") ? " Gaining control of a planet that no other player controls means you <b>explore</b> it." : "") + "</li></ol>" +
      "<ul><li>A PDS or space dock on a planet with another player’s units and none of its owner’s ground forces is destroyed.</li>" +
      "<li>You keep control of a planet with no units on it (mark it with a control token) until another player puts units there.</li></ul>",
    src: (c) => TI.cite(c, ["invasion", "bombardment", "planetaryshield", "groundcombat", "control", "pds", "spacedock", "custodians"].concat(c.has("pok") ? ["exploration"] : []), ["Wiki FAQ (The L1Z1X Mindnet)"].concat(TI.isTF(c) ? ["TF p.10"] : [])) + TI.scenarioSrc(c)
  },
  {
    id: "ref-production", title: "Producing units, blockades & reinforcements", when: () => true,
    html: (c) => "<ul><li>In the Production step you may use the <b>Production</b> ability of each of your units in the active system; a unit’s Production value is the most units it can produce, and values in the same system add up. Space dock: Production = the planet’s resource value + 2.</li>" +
      "<li>Pay resources equal to or above the <b>cost</b> — you may total the cost of everything you’re producing first; excess is lost. A cost with two icons (fighters, infantry) buys two units, and each counts toward the production limit; you may take just one but still pay the full cost.</li>" +
      "<li><b>Ships</b> are placed in the active system; <b>ground forces</b> on the planet whose unit produced them (a unit producing from the space area may put them on a planet you control in that system, or in space).</li>" +
      "<li><b>Blockade:</b> a Production unit in a system that has other players’ ships and none of yours is blockaded — it can’t produce ships (ground forces are fine). You can’t produce ships in a system containing other players’ ships.</li>" +
      "<li><b>Reinforcements are limited</b> to the plastic in your color. If none of a unit is left, you may remove that unit from any system without your command token and produce it immediately. Fighters and infantry can use tokens from the supply — each token must be accompanied by at least one plastic piece of that type, or it is replaced (or destroyed if you can’t).</li>" +
      "<li class=\"note flag\"><b>Sources disagree.</b> LRR §36.3a and §46.3a — followed here — say a fighter or infantry token that can’t be replaced with a plastic piece is <b>destroyed</b>. The TI4 Wiki FAQ (Excess Fighters/Infantry) reports an official answer that such unaccompanied tokens are <b>removed</b>, not destroyed.</li>" +
      "<li>Producing through an ability other than Production: the ability says how many and where; you can’t produce on a planet you don’t control, and you must still pay." + (TI.isTF(c) ? "" : " “Sarween Tools” applies only to the Production ability.") + "</li>" +
      "<li><b>Structures</b> (PDS, space docks) have no cost — they are placed" + (TI.isTF(c) ? " by card effects" : ", mostly with the Construction card") + ": at most <b>1 space dock</b> and <b>2 PDS</b> per planet; they can’t move.</li></ul>",
    src: (c) => TI.cite(c, ["producing", "production", "blockaded", "cost", "limits", "fightertokens", "infantrytokens", "structures", "spacedock"], ["LRR FAQ p.41", "faction sheet “Space Dock I” (shown LtP p.6)", "Wiki FAQ (Excess Fighters/Infantry)"].concat(TI.isTF(c) ? ["TF p.6"] : []))
  },
  {
    id: "ref-units", title: "Units at a glance", when: () => true,
    html: (c) => (TI.isTF(c) ? "<p class=\"sub\">Twilight’s Fall: values as printed on the Mahact King faction sheets (the Ruby Monarch and Avarice Rex sheets are shown on TF p.6–7) — the same as the standard units below, except that the <b>war sun is printed on the sheet</b>. Each King has its own flagship and mech — <b>your King’s sheet always wins</b>; unit upgrade splice cards replace these values.</p>" :
      "<p class=\"sub\">Standard unit values as printed on the faction sheets (read from the Xxcha sheet shown in the Learn to Play). Some factions have their own versions of some units — <b>your faction sheet always wins</b>; unit upgrade technologies replace these values.</p>") +
      "<div class=\"table-wrap\"><table class=\"unit-stats\"><thead><tr><th>Unit</th><th>Cost</th><th>Combat</th><th>Move</th><th>Capacity</th><th>Abilities</th></tr></thead><tbody>" +
      "<tr><td>Carrier I</td><td>3</td><td>9</td><td>1</td><td>4</td><td>—</td></tr>" +
      "<tr><td>Cruiser I</td><td>2</td><td>7</td><td>2</td><td>–</td><td>—</td></tr>" +
      "<tr><td>Destroyer I</td><td>1</td><td>9</td><td>2</td><td>–</td><td>Anti-Fighter Barrage 9 (x2)</td></tr>" +
      "<tr><td>Dreadnought I</td><td>4</td><td>5</td><td>1</td><td>1</td><td>Sustain Damage · Bombardment 5</td></tr>" +
      "<tr><td>Fighter I</td><td>1 for 2</td><td>9</td><td>–</td><td>–</td><td>no move value: travels by being transported</td></tr>" +
      "<tr><td>Infantry I</td><td>1 for 2</td><td>8</td><td>–</td><td>–</td><td>ground force</td></tr>" +
      "<tr><td>PDS I</td><td>–</td><td>–</td><td>–</td><td>–</td><td>structure · Planetary Shield · Space Cannon 6</td></tr>" +
      "<tr><td>Space Dock I</td><td>–</td><td>–</td><td>–</td><td>–</td><td>structure · Production X = planet’s resources + 2 · up to 3 fighters in its system don’t count against capacity</td></tr>" +
      (TI.isTF(c) ? "<tr><td>War Sun</td><td>12</td><td>5 (x3)</td><td>0</td><td>6</td><td>Sustain Damage · Bombardment 5 (x3) — printed on the King sheets, so it can be produced from the start</td></tr>" :
        "<tr><td>War Sun</td><td colspan=\"5\">Can’t be produced until you own its unit upgrade technology (values on that card).</td></tr>") +
      "<tr><td>Flagship</td><td colspan=\"5\">" + (TI.isTF(c) ? "Unique to each Mahact King — see its faction sheet (TF p.7)." : "Unique to each faction — see the faction sheet.") + "</td></tr>" +
      (c.has("pok") ? "<tr><td>Mech (PoK)</td><td colspan=\"5\">" + (TI.isTF(c) ? "Unique to each Mahact King — see its faction sheet (TF p.7)." : "Unique to each faction — see the mech unit card on your leader sheet.") + "</td></tr>" : "") +
      "</tbody></table></div>" +
      "<ul><li><b>Unit types:</b> ships (carriers, cruisers, destroyers, dreadnoughts, fighters, war suns, flagships) are always in space; ground forces (infantry" + (c.has("pok") ? ", mechs" : "") + ") are on planets or carried in space by ships with capacity; structures (PDS, space docks) are on planets.</li>" +
      "<li><b>Plastic per color:</b> 3 space docks, 6 PDS, 8 destroyers, 8 cruisers, 5 dreadnoughts, 4 carriers, 2 war suns, 1 flagship, 12 infantry, 10 fighters" + (c.has("pok") ? ", 4 mechs (63 in all)" : " (59 in all)") + ".</li>" +
      "<li><b>Component limits:</b> units are limited to the plastic in the game, except fighters and ground forces; control, trade good, fighter and infantry tokens may be substituted with coins or beads if they run out; other tokens are limited; dice are unlimited; when a deck runs out, shuffle its discard pile.</li>" +
      (TI.isTF(c) ? "<li><b>Unit upgrades (Twilight’s Fall):</b> unit upgrade splice cards are placed over a unit on your King’s sheet and count as unit upgrade technologies with no color. Gain a second one for the same slot and you keep one and discard the other — except mechs, which can have several.</li>" :
        "<li><b>Unit upgrades:</b> place the upgrade card over the unit on your faction sheet; from then on all those units use its values. White arrows on the sheet mark the values that improve." + (c.has("pok") ? " Mech unit cards are not technologies." : "") + "</li>") +
      "<li><b>Combat X with burst icons:</b> roll one die per burst icon.</li></ul>",
    src: (c) => TI.cite(c, ["units", "ships", "groundforces", "structures", "limits", "upgrades", "combat"].concat(c.has("pok") ? ["mechs"] : []), TI.isTF(c) ? ["King faction sheets (shown TF p.6–7)", "TF p.9"] : ["faction sheet (shown LtP p.6)"])
  },
  {
    id: "ref-economy", title: "Planets, resources, influence, trade goods & commodities", when: () => true,
    html: (c) => "<ul><li>Each planet shows a <b>resource</b> value (left, yellow border) and an <b>influence</b> value (right, blue border). " + (TI.isTF(c) ? "Resources pay for units and other resource costs; influence pays for command tokens and other influence costs." : "Resources buy units and technology; influence buys command tokens and, in the agenda phase, votes.") + "</li>" +
      "<li>To spend a planet’s resources <b>or</b> influence, <b>exhaust</b> its card (flip it facedown). Until it is readied, an exhausted card can’t be exhausted again and you can’t spend its resources or influence or resolve its abilities (its passive abilities still apply) — all are readied in the status phase" + (TI.isTF(c) ? "" : ", and planets again at the end of the agenda phase") + ".</li>" +
      "<li>When you <b>gain control</b> of a planet, take its card <b>exhausted</b> — from the planet deck if nobody held it, otherwise from its previous controller.</li>" +
      "<li><b>Traits</b> (cultural, hazardous, industrial) have no effect on their own" + (c.has("pok") ? " but decide which exploration deck you draw from" : "") + "; " + (TI.isTF(c) ? "in Twilight’s Fall nothing is researched — when scoring objectives, a planet with a <b>technology specialty</b> can be exhausted to count as one technology of that color (TF p.10)." : "a <b>technology specialty</b> can be exhausted to ignore one matching prerequisite when researching.") + "</li>" +
      "<li><b>Trade goods</b> spend as 1 resource or 1 influence, or pay for effects that ask for trade goods — at any time" + (TI.isTF(c) ? "" : ", but <b>never as votes</b>") + ".</li>" +
      "<li><b>Commodities</b> (the other side of the same tokens) can’t be spent. Your faction sheet shows your commodity value — the most you may hold. “Replenish” means take tokens until you have that many. Give them to another player in a transaction and they become <b>trade goods</b> for the receiver" + (TI.allyRules(c) ? " — except between allies (" + TI.allyRules(c).label + ": commodities exchanged with your ally stay commodities — " + TI.allyRules(c).src + ")" : "") + ". You may trade commodities before resolving an effect that replenishes them. Converting your own commodities into trade goods doesn’t count as “gaining” trade goods." + (TI.geEvent(c, "ageOfCommerce") ? " <b>Age of Commerce</b> (galactic event): there is no maximum — when you replenish, gain commodities equal to your commodity value (Codex IV p.16)." : "") + "</li>" +
      "<li>Tokens come in values of 1 and 3; make change freely.</li></ul>",
    src: (c) => TI.cite(c, ["planets", "resources", "influence", "exhausted", "control", "tradegoods", "commodities"], ["LtP p.16"].concat(TI.isTF(c) ? ["TF p.10"] : []).concat(TI.allyRules(c) ? [TI.allyRules(c).src] : []).concat(TI.geEvent(c, "ageOfCommerce") ? ["Codex IV p.16"] : []))
  },
  {
    id: "ref-command", title: "Command tokens & the command sheet", when: () => true,
    html: (c) => "<ul><li>You start with <b>8</b> on your command sheet — <b>3 tactic, 3 fleet, 2 strategy</b> — " + (TI.isTF(c) ? "and the rest of your color-based Twilight’s Fall command tokens are your reinforcements.</li>" : "and 8 more in reinforcements (16 per faction).</li>") +
      "<li><b>Tactic pool:</b> spend one to perform a tactical action (it is placed in the activated system).</li>" +
      "<li><b>Strategy pool:</b> spend one to resolve another player’s strategy card secondary" + (TI.isTF(c) ? "" : " (not needed for Leadership)") + ".</li>" +
      "<li><b>Fleet pool</b> (ship silhouette up): not spent — its size is the most <b>non-fighter ships</b> you may have in each system (units on planets, units counting against capacity and units being transported through don’t count).</li>" +
      "<li>When you <b>gain</b> a token, choose its pool. You can’t gain more than your reinforcements hold. If an effect places your token from reinforcements and you have none, take one from your command sheet (unless the system already contains one of your tokens). A token that would go where you already have one goes to your reinforcements instead — its effect still happens.</li>" +
      "<li><b>Status phase:</b> remove all your tokens from the board, gain 2, and redistribute all tokens on your sheet — then check your fleet limit in every system.</li>" +
      (TI.isTF(c) ? "" : "<li>Leadership is the main source of extra tokens: 3 on the primary, plus 1 per 3 influence spent (primary or secondary).</li>") + "</ul>",
    src: (c) => TI.cite(c, ["commandsheet", "commandtokens", "fleetpool", "status"].concat(TI.isTF(c) ? [] : ["leadership"]), TI.isTF(c) ? ["TF p.6–7"] : [])
  },
  {
    id: "ref-tech", title: "Technology", when: (c) => !TI.isTF(c),
    html: (c) => "<ul><li>Research with the <b>Technology</b> strategy card (primary: 1 free + 1 more for 6 resources; secondary: 1 strategy token + 4 resources) or other effects: take the card from your technology deck and place it faceup; you own it for the rest of the game. You can look through your deck at any time.</li>" +
      "<li><b>Prerequisites:</b> the colored symbols in a card’s lower-left corner — for each, you must own a technology of that color. Colors: <b>Biotic</b> (green), <b>Warfare</b> (red), <b>Propulsion</b> (blue), <b>Cybernetic</b> (yellow); a technology’s own color is in its lower-right corner.</li>" +
      "<li><b>Unit upgrades</b> have no color and don’t satisfy prerequisites.</li>" +
      "<li><b>Technology specialty:</b> exhaust a planet with that symbol to ignore one prerequisite of the matching color — but an exhausted planet can’t be used this way, and a planet exhausted for its specialty can’t also pay resources.</li>" +
      "<li>You can’t research another faction’s faction technology.</li>" +
      "<li>“<b>Gain</b>” a technology: take it, ignoring prerequisites. “<b>Research</b>”: prerequisites apply. You can’t resolve an ability that gains a technology you already own (Wiki FAQ).</li>" +
      (c.has("te") ? "<li><b>Thunder’s Edge:</b> a planet with <b>two</b> technology specialties can be exhausted to satisfy either or both prerequisites at once (TE p.11); a breakthrough’s <b>synergy</b> lets a technology or specialty of one of its two colors count as the other when researching and when scoring technology objectives — as one color at a time (TE p.8).</li>" : "") + "</ul>",
    src: (c) => TI.cite(c, ["technology", "techcard", "upgrades"], ["LRR p.34 (color icons)"].concat(c.mode === "firstgame" ? [] : ["LtP p.18"]).concat(["Wiki FAQ (Technology)"]).concat(c.has("te") ? ["TE p.8, p.11"] : []))
  },
  {
    id: "ref-actioncards", title: "Action cards", when: () => true,
    html: (c) => "<ul><li>Draw <b>1</b> each status phase" + (TI.isTF(c) ? " (Twilight’s Fall uses its own action card deck instead of the standard one)" : " (the Politics card draws 2)") + ". Hand limit <b>7</b> — discard down if you ever have more. Keep them hidden until played.</li>" +
      "<li>The <b>bold first paragraph</b> says when a card can be played. Cards starting with “<b>Action:</b>” are component actions on your turn.</li>" +
      "<li>Play: read it, resolve it, discard it. A canceled card has no effect and is discarded.</li>" +
      "<li>Several cards with the <b>same name</b> can’t be played in one timing window to affect the same units or effect (canceled cards don’t count as played).</li>" +
      "<li>When several players want to act in the same window: in the action phase, take turns in initiative order starting with the active player; in the " + (TI.isTF(c) ? "strategy phase" : "strategy and agenda phases") + ", start with the speaker and go clockwise.</li>" +
      (TI.isTF(c) ? "" : "<li><b>Rulings:</b> “Sabotage” is played after targets are chosen but before effects resolve, votes are cast or dice are rolled · two “Direct Hit” cards may hit different targets in the same round · each player may play “Shields Holding” in the same window, and it also cancels hits from abilities such as Ambush or Devotion · “Lucky Shot” and similar can’t target your own units · “Skilled Retreat” isn’t a retreat (so “Intercept” can’t cancel it) · “Courageous to the End” produces no hits, so Sustain Damage can’t stop it · “Upgrade” needs the cruiser already in the active system · “Experimental Battlestation” uses the space cannon offense window, only against the active player’s ships, and only if ships moved in.</li>") + "</ul>",
    src: (c) => TI.cite(c, ["actioncards", "abilities"], ["LRR FAQ p.42–43"].concat(TI.isTF(c) ? ["TF p.6, p.10"] : []))
  },
  {
    id: "ref-diplomacy", title: (c) => TI.isTF(c) ? "Neighbors, transactions & deals" : "Neighbors, transactions, deals & promissory notes", when: () => true,
    html: (c) => "<ul><li><b>Neighbors:</b> two players with units or controlled planets in the same system or in adjacent systems (wormhole adjacency counts).</li>" +
      "<li><b>Transactions:</b> during your turn, at any time (even in combat), you may make <b>one transaction with each neighbor</b>: give any number of trade goods and commodities" + (c.has("pok") ? " and relic fragments" : "") + (c.mode === "firstgame" || TI.isTF(c) ? "" : " plus up to <b>1 promissory note</b>") + ", for any number of the same in return. Nothing else can be exchanged (the Emirates of Hacan may also trade action cards" + (c.has("pok") || TI.isTF(c) ? ", and a captured non-fighter ship or mech may be returned to its owner as part of a transaction — captured fighters and infantry can’t" : "") + "). It needn’t be even; agree the terms first — once exchanged it can’t be undone.</li>" +
      (TI.isTF(c) ? "" : "<li>While each <b>agenda</b> is resolved, anyone may make one transaction with each other player — neighbors or not.</li>") +
      (c.has("te") ? "<li><b>Thunder’s Edge:</b> players who control a <b>space station</b> may transact with each other even if they aren’t neighbors (TE p.10).</li>" : "") +
      (TI.geEvent(c, "ageOfCommerce") ? "<li><b>Age of Commerce</b> (galactic event): players don’t have to be neighbors to transact, and a transaction may share a non-faction technology — the receiver gains it from their own deck and the giver keeps it (Codex IV p.16).</li>" : "") +
      "<li><b>Deals</b> can be made with anyone at any time — but a deal that includes a transaction must follow the transaction rules, so those players must be neighbors. A deal whose terms resolve <b>immediately</b> is binding; anything else is non-binding and may be ignored. The results of playing action cards can’t be part of a binding deal.</li>" +
      (c.mode === "firstgame" ? "<li><b>Promissory notes</b> are left out of the first game (an advanced rule).</li>" : TI.isTF(c) ? "<li><b>Promissory notes</b> aren’t used in Twilight’s Fall.</li>" :
      "<li><b>Promissory notes:</b> you start with " + (c.has("pok") ? "6 (5 in your color and 1 faction note)" : "5 (4 in your color and 1 faction note)") + ". You can’t play your own; give them away as part of transactions (max 1 per transaction, from your hand — not from your play area). Keep your hand hidden (you may show a note you’re offering). Notes you received may be passed on without the owner’s permission. Returned notes can be given away again. A note received during its timing window may be played at once.</li>") +
      (c.has("pok") && !TI.isTF(c) ? "<li>The <b>“Alliance”</b> promissory note lets its holder use your commander’s ability once it is unlocked — you keep using it too." + (TI.allyRules(c) ? " <b>" + TI.allyRules(c).label + ":</b> " + TI.allyRules(c).who + " purge their own “Alliance” note at setup and start with their commander unlocked (" + TI.allyRules(c).src + ")." : "") + "</li>" : "") + "</ul>",
    src: (c) => TI.cite(c, ["neighbors", "transactions", "deals"].concat(c.mode === "firstgame" || TI.isTF(c) ? [] : ["promissory"]).concat(c.has("pok") && !TI.isTF(c) ? ["leaders"] : []).concat(c.has("pok") || TI.isTF(c) ? ["capture"] : []), (c.mode === "firstgame" ? ["LtP p.21", "LRR FAQ p.41"] : ["LtP p.17, p.21", "LRR FAQ p.41"]).concat(TI.isTF(c) ? ["TF p.6, p.11"] : []).concat(c.has("te") ? ["TE p.10"] : []).concat(TI.geEvent(c, "ageOfCommerce") ? ["Codex IV p.16"] : []).concat(TI.allyRules(c) && c.has("pok") && !TI.isTF(c) ? [TI.allyRules(c).src] : []))
  },
  {
    id: "ref-objectives", title: "Objectives, victory points & winning", when: () => true,
    html: (c) => "<ul><li><b>Public objectives:</b> 5 stage I and 5 stage II per game, facedown by the track; 2 stage I are revealed at setup and one more each status phase (no stage II until every stage I is revealed). Any number of players may score each one.</li>" +
      "<li><b>Secret objectives:</b> you start with " + (c.mode === "firstgame" ? "1" : "1 (drawn 2, kept 1)") + (TI.isTF(c) ? "; the Aeterna card draws more" : "; the Imperial card draws more") + ". You may have at most <b>3</b>, scored and unscored together; only you can score yours.</li>" +
      "<li>Each card shows its points, <b>when</b> it can be scored (" + (TI.isTF(c) ? "status or action phase — Twilight’s Fall has no agenda phase" : "status, action or agenda phase") + ") and its requirement. Status-phase objectives must be met <b>during</b> the Score Objectives step; costs printed on a card are paid then.</li>" +
      "<li><b>Status phase:</b> in initiative order, score up to <b>1 public and 1 secret</b>.</li>" +
      "<li><b>Action phase:</b> any number, at any time during the phase (not only on your own turn) — but only <b>one during or after each combat</b> (one in a space combat and one in a ground combat of the same tactical action is fine)." + (TI.isTF(c) ? "" : " <b>Agenda phase:</b> any number.") + "</li>" +
      "<li>You can’t score <b>public</b> objectives unless you control <b>every planet in your home system</b>. Each objective scores once per player.</li>" +
      "<li>“Destroy” requirements count any destroy effect; units removed for exceeding your fleet pool aren’t destroyed. A requirement naming “units” is met by one unit (Wiki FAQ).</li>" +
      (TI.isTF(c) ? "<li><b>Other points:</b> removing the custodians token (+1); the <b>Aeterna</b> primary while you control Mecatol Rex (+1); card effects.</li>" :
        c.mode === "ordinian" ? "<li><b>Other points:</b> in the Ordinian scenario the custodians token is the <b>Coatl</b> — controlling it once repaired is worth points (see “Ordinian scenario: the Coatl”); effects that refer to Mecatol Rex or its system refer to the Coatl’s system; some agendas, promissory notes and other cards — e.g. a “Support for the Throne” note gives you 1 victory point when you receive it, but you lose that point and return the note if you activate a system containing its owner’s units or its owner is eliminated. A point gained from a law isn’t lost if the law is later discarded.</li>" :
        c.mode === "liberation" ? "<li><b>Other points:</b> no custodians token is placed; effects that refer to Mecatol Rex or its system refer to Ordinian (e.g. the Imperial primary); the scenario’s <b>Liberate Ordinian</b> objective; some agendas, promissory notes and other cards — e.g. a “Support for the Throne” note gives you 1 victory point when you receive it, but you lose that point and return the note if you activate a system containing its owner’s units or its owner is eliminated. A point gained from a law isn’t lost if the law is later discarded.</li>" :
        "<li><b>Other points:</b> removing the custodians token (+1); the Imperial primary while you control Mecatol Rex (+1); some agendas" + (c.mode === "firstgame" ? "." : ", promissory notes and other cards — e.g. a “Support for the Throne” note gives you 1 victory point when you receive it, but you lose that point and return the note if you activate a system containing its owner’s units or its owner is eliminated.") + " A point gained from a law isn’t lost if the law is later discarded." + (TI.geEvent(c, "totalWar") ? " <b>Total War</b> (galactic event): as an action, discard 10 commodities from planets in your home system to gain 1 victory point (Codex IV p.16)." : "") + "</li>") +
      (c.mode === "liberation" ? "<li><b>Winning (Liberation of Ordinian):</b> the game ends when one of the allied Sol/Xxcha players has <b>12</b> victory points and the other <b>10</b>, or when any other player has <b>10</b> (Codex IV p.18 — it doesn’t say which side of the track to use). If the speaker must reveal a public objective and none are left, the game ends: most points wins, ties to initiative order.</li>" :
      TI.isAlliance(c) ? "<li><b>Winning (Alliance variant):</b> played on the 14-point side; an alliance wins when one ally has <b>14</b> victory points and the other at least <b>10</b> (" + TI.allianceSrc(c) + "). The game also ends if the speaker must reveal a public objective and none are left.</li>" :
      "<li><b>Winning:</b> the first to <b>" + (c.mod("vp14") ? "14" : "10") + "</b> wins immediately. If several players would reach it at once, the earliest in initiative order wins (with no strategy cards in play: nearest the speaker, clockwise, speaker included). If the speaker must reveal a public objective and none are left, the game ends: most points wins, ties to initiative order.</li>") +
      "<li>An effect that refers to the player with the <b>most</b> or <b>fewest</b> victory points applies to <b>every</b> tied player.</li></ul>",
    src: (c) => TI.cite(c, ["objectives", "vp", "status", "imperial", "custodians"], ["Wiki FAQ (Objectives)"].concat(c.mode !== "firstgame" && !TI.isTF(c) ? ["LtP p.21"] : []).concat(TI.isTF(c) ? ["TF p.10–11"] : []).concat(TI.geEvent(c, "totalWar") ? ["Codex IV p.16"] : [])) + TI.scenarioSrc(c)
  },
  {
    id: "ref-status", title: "Status phase — the 8 steps", when: () => true,
    html: (c) => "<ol><li><b>Score objectives</b> — in initiative order, up to 1 public and 1 secret each.</li>" +
      "<li><b>Reveal public objective</b> — the speaker flips the next one (stage II only after all stage I). If none are left at the start of this step, the game ends.</li>" +
      "<li><b>Draw action cards</b> — 1 each, in initiative order.</li>" +
      "<li><b>Remove command tokens</b> — all of yours come off the board to your reinforcements.</li>" +
      "<li><b>Gain and redistribute command tokens</b> — gain 2" + (TI.isTF(c) ? "" : " (the “Hyper Metabolism” technology: 3)") + ", then rearrange all tokens on your sheet; check fleet limits. Usually simultaneous; in initiative order if timing matters.</li>" +
      "<li><b>Ready cards</b> — ready all exhausted cards, including strategy cards" + (TI.isTF(c) ? " and genomes (and relics and legendary planet abilities that were exhausted)" : c.has("pok") ? " (and agents, relics and legendary planet abilities that were exhausted)" : c.has("te") ? " (and relics and legendary planet abilities that were exhausted)" : "") + ".</li>" +
      "<li><b>Repair units</b> — stand damaged units back up.</li>" +
      "<li><b>Return strategy cards</b> — then " + (TI.isTF(c) ? "go to the benediction phase if there is a tyrant (Twilight’s Fall), otherwise start a new round." :
        c.mode === "ordinian" ? "go to the agenda phase if the Coatl has been repaired (Ordinian scenario), otherwise start a new round." :
        c.mode === "liberation" ? "go to the agenda phase once it has been added — the Liberation scenario doesn’t say when, so use what you agreed — otherwise start a new round." :
        "go to the agenda phase if the custodians token has been removed, otherwise start a new round.") + "</li></ol>",
    src: (c) => TI.cite(c, ["status", "readied"].concat(c.has("pok") && !TI.isTF(c) ? ["leaders"] : []), TI.isTF(c) ? ["TF p.6, p.9–10"] : ["LRR errata p.40 (Hyper Metabolism)"].concat(c.has("te") && !c.has("pok") ? ["TE p.10"] : [])) + TI.scenarioSrc(c)
  },
  {
    id: "ref-agenda", title: "Agenda phase & voting", when: (c) => !TI.isTF(c),
    html: (c) => "<p class=\"sub\">" + (c.mode === "ordinian" ? "Only once the Coatl has been repaired (Ordinian scenario)." : c.mode === "liberation" ? "The Liberation of Ordinian scenario doesn’t say when the agenda phase begins; read literally it never does, because no custodians token is placed — agree on it before you start." : "Only once the custodians token has left Mecatol Rex.") + "</p><ol>" +
      "<li><b>First agenda</b><ol type=\"i\"><li><b>Reveal</b> — the speaker draws the top agenda and reads it aloud with all its outcomes.</li><li><b>Vote</b> — starting left of the speaker and going clockwise (the speaker votes last), each player may cast votes.</li><li><b>Resolve</b> — the outcome with the most votes is resolved by the speaker.</li></ol></li>" +
      "<li><b>Second agenda</b> — the same again.</li>" +
      "<li><b>Ready planets</b> — ready all exhausted planets; a new round begins.</li></ol>" +
      "<h4>Voting</h4><ul><li>Exhaust any number of your planets: your votes = their combined <b>influence</b>, and each exhausted planet gives its full value. All your votes go to <b>one outcome</b>, declared aloud.</li>" +
      "<li>Outcomes: <b>For / Against</b>, or <b>elect</b> a player (you may vote for yourself) or a planet (one controlled by a player, unless the agenda says otherwise).</li>" +
      "<li><b>Trade goods can’t be used as votes.</b> You may abstain; casting 0 votes counts as abstaining (no For/Against benefits). Extra votes from effects must go to your chosen outcome. A player who can’t vote can’t cast votes by any means — but can still play “rider” action cards.</li>" +
      "<li><b>Ties</b>, or no votes at all: the speaker chooses among the tied outcomes (that is not a vote).</li>" +
      "<li><b>Predictions</b> are declared after the reveal and before any votes, and must be a possible outcome; they resolve after the outcome.</li>" +
      "<li><b>Laws</b> (For or Elect outcome) stay in play permanently — in the common area or a player’s play area (that player owns it). Law with Against, or any <b>directive</b>: resolve and discard.</li>" +
      "<li>During each agenda anyone may make one transaction with each other player.</li>" +
      "<li><b>Rulings:</b> multiple riders may be played, even on opposing outcomes · “Bribery” can be played after the speaker’s vote window even if the speaker doesn’t vote · “Bribery” and “Distinguished Councilor” can’t be played after you abstain (Wiki FAQ) · “Distinguished Councilor” only after you vote in the Vote step.</li></ul>" +
      (c.has("pok") ? "<p class=\"sub\">Prophecy of Kings removes 13 base-game agendas (see setup).</p>" : ""),
    src: (c) => TI.cite(c, ["agendaphase", "agendacard", "speaker", "transactions"], ["LRR FAQ p.41–43", "Wiki FAQ (Agendas)"].concat(c.has("pok") ? ["PoK p.6"] : [])) + TI.scenarioSrc(c)
  },
  {
    id: "ref-abilities", title: "Abilities & timing — the golden rules", when: () => true,
    html: (c) => "<ul><li>If a <b>card</b> contradicts the rules, the card wins; if both can be followed, follow both. The Rules Reference beats the Learn to Play.</li>" +
      "<li>“<b>Cannot</b>” is absolute. If two “cannot”s clash, a persistent ability beats a one-time one, and an enabling ability beats a canceling one.</li>" +
      "<li>Resolve an ability in full; parts after “<b>may</b>” are optional. Abilities of components in play are mandatory unless they say “may”. With “<b>and</b>”, do as much as you can.</li>" +
      "<li><b>Costs</b> come before “to” or a semicolon — no payment, no effect (spending, exhausting, purging, activating…).</li>" +
      "<li><b>Before / after</b> = immediately before / after the event. <b>When</b> = at that moment, often changing the event; “when” beats “after”. “After X” happens before “before Y” (Wiki FAQ). <b>Then</b> = you must do the first part to do the second.</li>" +
      "<li>An ability resolves once per occurrence of its trigger. Effects with a duration last even if their source leaves play.</li>" +
      "<li>Several players acting in one window: action phase — initiative order from the active player; " + (TI.isTF(c) ? "strategy phase" : "strategy and agenda phases") + " — speaker, then clockwise.</li>" +
      "<li>“This system / this planet” on a unit means the one containing that unit. “Apply +X” is a modifier to a value or die result.</li>" +
      "<li>You may reveal hidden information (action cards, secret objectives) if you wish.</li>" +
      "<li>Newest general clarification (Thunder’s Edge): an ability that is still unresolved can’t be triggered again within a timing window it created itself.</li></ul>",
    src: (c) => TI.cite(c, ["abilities", "modifiers"], ["LRR FAQ p.41", "Wiki FAQ (Timing)", "TE p.16"].concat(TI.isTF(c) ? ["TF p.10"] : []))
  },
  {
    id: "ref-elimination", title: "Elimination", when: () => true,
    html: (c) => "<ul><li>A player is eliminated when they have <b>no ground forces</b> on the board, <b>no units with Production</b> and <b>control no planets</b>." + (TI.isAlliance(c) ? " <b>Alliance variant:</b> a player can’t be eliminated while their ally controls a planet (" + TI.allianceSrc(c) + ")." : c.mode === "liberation" ? " <b>Liberation of Ordinian:</b> the allied Sol and Xxcha players can’t be eliminated while their ally controls a planet (Codex IV p.18 uses the Alliance variant’s rules — Codex II p.13)." : "") + "</li>" +
      (TI.isTF(c) ? "<li>Their units, tokens, technologies and sheets go back to the box; action cards are discarded; strategy cards return to the common area; secret objectives (scored or not) are shuffled back.</li>"
        : "<li>Their units, tokens, technologies, sheets and the promissory notes of their color/faction go back to the box (even ones other players hold); notes they held from others are returned to those players; laws they own are discarded; action cards discarded; strategy cards returned to the common area; secret objectives (scored or not) shuffled back.</li>") +
      "<li>If the speaker is eliminated, the token passes to the player on their left.</li>" +
      "<li>A game that started with 5+ players and drops to 4 or fewer still takes one strategy card each.</li>" +
      (c.has("pok") ? "<li><b>PoK:</b> units they had captured return to their owners; relics are purged and relic fragments discarded (Wiki FAQ)." + (TI.isTF(c) ? "" : " Faction specifics (Nekro assimilator tokens, Creuss wormhole tokens, the Naalu “0” token, Titans attachments, Mahact command tokens) are covered in LRR 33.10.") + "</li>" +
        "<li class=\"note flag\"><b>Sources disagree — units others had captured from them.</b> LRR §33.2 (followed here) returns every unit of their faction or colour to the game box, which reads as including their non-fighter ships and mechs on other players’ sheets. The Wiki FAQ reports an official answer that captured units stay on the capturer’s sheet and go to the box only if they would ever be returned. Captured fighter and infantry tokens belong to no player (§17.4), so they stay either way.</li>" : (TI.isTF(c) ? "" : "<li>Faction specifics (Nekro assimilator tokens, Creuss wormhole tokens, the Naalu “0” token) are covered in LRR 33.10.</li>")) + "</ul>",
    src: (c) => TI.cite(c, ["elimination"].concat(TI.isTF(c) ? [] : ["promissory"]).concat(c.has("pok") ? ["capture"] : []), (c.has("pok") ? ["Wiki FAQ (General; Exploration) — conflict flagged"] : []).concat(TI.isTF(c) ? ["TF p.6"] : []).concat(TI.isAlliance(c) ? [TI.allianceSrc(c)] : c.mode === "liberation" ? ["Codex IV p.18", "Codex II p.13"] : []))
  },
  {
    id: "ref-leaders", title: "Leaders — agents, commanders & heroes (PoK)", when: (c) => c.has("pok") && !TI.isTF(c),
    html: (c) => "<ul><li>Each faction has <b>three leaders</b>: an agent, a commander and a hero. They sit on the leader sheet, hash-mark side up (1 agent, 2 commander, 3 hero). The Nomad’s “The Company” adds two more agents (five leaders in all); those two go in the Nomad’s play area, readied side up.</li></ul>" +
      "<dl><dt>Agent</dt><dd>No unlock needed; starts readied. Using its ability exhausts it; it readies in the status phase. Agents can interact with other players.</dd>" +
      "<dt>Commander</dt><dd>Locked until you meet its “Unlock” condition (conditions aren’t checked in the middle of resolving an ability) — then flip it; it never flips back. It can’t be exhausted. Your “Alliance” promissory note lets its holder use your commander too; you still can.</dd>" +
      "<dt>Hero</dt><dd>Unlocks when you have <b>3 scored objectives</b> (public and secret in any mix — victory points from other sources don’t count). A powerful once-per-game ability: it can’t be exhausted and is <b>purged</b> after its ability resolves (the Titans of Ul hero attaches to Elysium instead).</dd></dl>" +
      "<p class=\"sub\">Hero unlocks are checked after the Score Objectives step finishes, not between the public and secret score (Wiki FAQ).</p>" +
      (TI.allyRules(c) ? "<p class=\"note\"><b>" + TI.allyRules(c).label + ":</b> " + TI.allyRules(c).who + " flip their commander to its unlocked side at setup and purge their own “Alliance” promissory note (" + TI.allyRules(c).src + ").</p>" : ""),
    src: (c) => TI.cite(c, ["leadersheet", "leaders"], ["PoK p.10", "Wiki FAQ (The Xxcha Kingdom)"].concat(TI.allyRules(c) ? [TI.allyRules(c).src] : []))
  },
  {
    id: "ref-mechs", title: "Mechs & deploy (PoK)", when: (c) => c.has("pok"),
    html: (c) => "<ul><li>Mechs are faction-specific heavy <b>ground forces</b> (4 per color): they can be transported, land in invasions and fight in ground combat.</li>" +
      (TI.isTF(c) ? "<li>Twilight’s Fall: standard mechs aren’t used — each Mahact King faction sheet has its own unique mech.</li>" : "<li>Your mech unit card is in play from the start on your leader sheet; produce mechs at the cost printed there. Mech unit cards are <b>not technologies</b>.</li>") +
      "<li><b>Deploy:</b> some mechs have a “Deploy” ability that places them without producing them — only from your reinforcements, free unless it says otherwise, and each deploy ability only once per timing window.</li>" +
      "<li>Captured mechs sit on the capturer’s faction sheet (see Capture).</li></ul>",
    src: (c) => TI.cite(c, ["mechs", "deploy", "units"], ["PoK p.10, p.16"].concat(TI.isTF(c) ? ["TF p.6–7"] : []))
  },
  {
    id: "ref-explore", title: "Exploration, frontier tokens, attachments & relics (PoK)", when: (c) => c.has("pok"),
    html: (c) => "<h4>Exploring planets</h4><ul>" +
      "<li>When you gain control of a planet that <b>isn’t already controlled by another player</b>, explore it: draw the top card of the exploration deck matching its <b>trait</b> — cultural, hazardous or industrial — and resolve it. A planet with several traits: choose the deck. Planets without a trait (Mecatol Rex, home planets) can’t be explored.</li>" +
      "<li>Gaining several planets at once: choose an order and fully resolve each — gain A, explore A, gain B, explore B (Wiki FAQ). Transactions may happen after a card is revealed and before it resolves, but no other abilities can be used until it has resolved (Wiki FAQ).</li>" +
      "<li>After resolving, discard the card — unless it is a <b>relic fragment</b> or has an <b>Attach</b> header. An empty exploration deck is reshuffled from its discards.</li></ul>" +
      "<h4>Attachments</h4><ul><li>An “Attach” card goes partly under the explored planet’s card and its matching token goes on the planet; it changes the planet’s values/abilities and stays with the planet (and its ready state) when control changes. If the planet card is purged, its attachments are purged too.</li></ul>" +
      "<h4>Frontier tokens</h4><ul><li>Placed at setup in every non-home system without planets, anomalies included (never on hyperlanes; 1 per system). You can explore a frontier token only " + (TI.isTF(c) ? "when a card lets you (Twilight’s Fall uses no technology deck)" : "with the <b>Dark Energy Tap</b> technology or an ability that says so") + ": draw from the <b>frontier deck</b>, then discard the token.</li></ul>" +
      "<h4>Relic fragments &amp; relics</h4><ul>" +
      "<li>Relic fragments stay faceup in your play area; their abilities (e.g. <b>purge 3 fragments of the same type to gain 1 relic</b>) let you draw relics. Fragments <b>can</b> be traded in transactions." + (TI.geEvent(c, "ageOfExploration") ? " <b>Age of Exploration</b> (galactic event): a relic needs only <b>2</b> matching fragments (Codex IV p.16)." : "") + "</li>" +
      "<li>Gaining a relic: draw the top card of the relic deck and place it faceup — if the deck is empty you gain nothing (you may still purge fragments — Wiki FAQ). Use its ability as written. Relics <b>can’t</b> be traded.</li></ul>",
    src: (c) => TI.cite(c, ["exploration", "attach", "frontier", "relics"], ["PoK p.11, p.16", "Wiki FAQ (Exploration)"].concat(TI.isTF(c) ? ["TF p.6, p.10"] : []).concat(TI.geEvent(c, "ageOfExploration") ? ["Codex IV p.16"] : []))
  },
  {
    id: "ref-legendary", title: "Legendary planets, capture & purge (PoK)", when: (c) => c.has("pok"),
    html: () => "<h4>Legendary planets</h4><ul><li>Marked with the legendary icon. Gaining control of one also gives you its <b>legendary planet ability card</b> — readied if taken from the deck, in its current state if taken from a player. Prophecy of Kings’ legendary planet abilities are used at the end of your turn (the card is exhausted to use it). If the planet card is purged, the ability card is purged too.</li></ul>" +
      "<h4>Capture</h4><ul>" +
      "<li><b>Non-fighter ships and mechs</b> you capture go on your faction sheet. They return to their owner’s reinforcements only if you return them in a transaction, if an ability makes you return them (usually as a cost), or if their owner <b>blockades one of your space docks</b>.</li>" +
      "<li><b>Fighters and infantry</b> you capture go back to their owner’s reinforcements; you put a matching token from the supply on your sheet instead. Those tokens belong to no one: they can’t be traded or returned by a blockade, and go back to the supply only when an ability says so.</li>" +
      "<li>While captured, a unit can’t be produced or placed by its owner. While any of your space docks is blockaded, you can’t capture units from the blockading player.</li></ul>" +
      "<h4>Purge</h4><ul><li>A purged component is removed from the game and returned to the box — it can never come back, even if its ability only partly resolved. Purging as a cost makes an ability once-per-game.</li></ul>",
    src: (c) => TI.cite(c, ["legendary", "capture", "blockaded", "purge"], ["PoK p.10–11"])
  },
  {
    id: "ref-galaxy", title: "Galaxy setups by player count", when: () => true,
    html: (c) => {
      const te = c.has("te"), pok = c.has("pok");
      /* [players, key, rings, hyperlane tiles, dealt, speaker adds, note, show(c), superseded(c)] */
      const rows = [
        ["3", "deal", "3", "—", "6 + 2", "—", "", () => true, () => false],
        ["4", "deal", "3", "—", "5 + 3", "—", "", () => true, () => te && pok],
        ["4", "hyper4", "3", "as drawn on TE p.7", "3 + 2", "—", "Thunder’s Edge with Prophecy of Kings", () => te && pok, () => false],
        ["5", "deal", "3", "—", "4 + 2", "1 red", "+2/+4/+2 trade goods by seat", () => true, () => te],
        ["5", "hyper5", "3", "83A–88A", "3 + 2", "—", "no seat trade goods", () => pok, () => te],
        ["5", "hyper5te", "3", "119A–124A", "3 + 2", "—", "Thunder’s Edge; no seat trade goods", () => te, () => false],
        ["6", "deal", "3", "—", "3 + 2", "—", "", () => true, () => false],
        ["6", "large", "4", "—", "6 + 3", "—", "14 points recommended", () => pok, () => false],
        ["7", "deal", "4", "83A–88A", "4 + 2", "2 red + 3 blue", "", () => pok, () => false],
        ["7", "alt", "non-standard", "83B, 84B, 85B, 86B, 88B, 90B", "3 + 2", "—", "", () => pok, () => false],
        ["8", "deal", "4", "—", "4 + 2", "2 red + 2 blue", "", () => pok, () => false],
        ["8", "alt", "non-standard", "83B, 85B, 87A, 88A, 89B, 90B", "3 + 2", "—", "", () => pok, () => false]
      ];
      const nm = { deal: "Standard", hyper4: "Hyperlanes (TE)", hyper5: "Hyperlanes (PoK)", hyper5te: "Hyperlanes (TE)", large: "Large galaxy", alt: "Alternate hyperlanes" };
      const key = te && c.galaxy === "hyper5" ? "hyper5te" : c.galaxy;
      let h = "<div class=\"table-wrap\"><table><thead><tr><th>Players</th><th>Setup</th><th>Rings</th><th>Hyperlane tiles</th><th>Dealt each (blue + red)</th><th>Speaker adds next to Mecatol Rex</th><th>Note</th></tr></thead><tbody>";
      for (const r of rows) {
        if (!r[7]()) continue;
        const here = String(c.p) === r[0] && key === r[1] && c.galaxyFrom !== "option";
        const note = r[8]() ? "not used with Thunder’s Edge" + (r[0] === "4" ? " + Prophecy of Kings" : "") : r[6];
        h += "<tr" + (here ? " class=\"here\"" : "") + "><td>" + r[0] + "</td><td>" + nm[r[1]] + (here ? " <b>(this game)</b>" : "") + "</td><td>" + r[2] + "</td><td>" + r[3] + "</td><td>" + r[4] + "</td><td>" + r[5] + "</td><td>" + note + "</td></tr>";
      }
      h += "</tbody></table></div><ul>" +
        "<li>Placement is always in snake order starting with the speaker; each ring is finished before the next; no adjacent anomalies or same-type wormholes unless there is no other option.</li>" +
        (te ? "<li><b>Thunder’s Edge:</b> five-player games — and four-player games with Prophecy of Kings — are always set up with hyperlanes, and the five-player seat trade goods aren’t given (TE p.7, p.12).</li>" : "") +
        (pok ? "<li><b>Premade maps</b> for 3–8 players: PoK p.13 (3, 4), p.14 (5, 6), p.15 (7, 8) — no dealing.</li>" : "") +
        "<li><b>First-game preset maps</b> for 3–6 players: LtP p.22 (3, 4) and p.23 (5, 6).</li>" +
        "<li>Diagrams of every standard layout: LRR p.6" + (pok ? " (also PoK p.9 and p.12)" : " (base layouts also RR p.3)") + (te ? "; Thunder’s Edge layouts TE p.7" : "") + ".</li>" +
        (TI.geEvent(c, "minorFactions") && c.galaxyFrom !== "option" ? "<li><b>Minor Factions</b> (galactic event" + (c.mod("ge-minorFactions") === true ? "" : ", if it is in play") + "): each player is dealt <b>1 fewer blue tile</b> than the table shows. Before the galaxy is created, each player places one unplayed faction’s home system in <b>ring 2</b>, equidistant from the players’ home systems (Codex IV p.15).</li>" : "") +
        (c.galaxyFrom === "option" ? "<li>This game’s galaxy comes from the selected mode or option — see its setup step.</li>" : "") + "</ul>";
      return h;
    },
    src: (c) => (c.has("pok") ? "LRR p.4–6 · PoK p.9, p.11–15 · LtP p.22–23" : "LRR p.4–6 · RR p.2–3 · LtP p.22–23") + (c.has("te") ? " · TE p.7, p.12" : "") + (TI.geEvent(c, "minorFactions") && c.galaxyFrom !== "option" ? " · Codex IV p.15" : "")
  },
  {
    id: "ref-errata", title: "Errata — card text corrections", when: () => true,
    html: (c) => {
      const E = [
        ["Bribery", "action card", "After the speaker votes on an agenda: Spend any number of trade goods. For each trade good spent, cast 1 additional vote for the outcome on which you voted."],
        ["Devotion", "Yin Brotherhood faction ability", "After each space battle round, you may destroy 1 of your cruisers or destroyers in the active system to produce 1 hit and assign it to 1 of your opponent’s ships in that system."],
        ["Diplomacy", "strategy card", "Primary: Choose 1 system other than the Mecatol Rex system that contains a planet you control; each other player places a command token from their reinforcements in that system. Then, ready up to 2 exhausted planets you control. Secondary: Spend 1 token from your strategy pool to ready up to 2 exhausted planets you control."],
        ["Direct Hit", "action card", "After another player’s ship uses ‘Sustain Damage’ to cancel a hit produced by your units or abilities: Destroy that ship."],
        ["Harrow", "L1Z1X faction ability", "At the end of each round of ground combat, your ships in the active system may use their bombardment abilities against your opponent’s ground forces on the planet."],
        ["Hegemonic Trade Policy", "Winnu faction technology", "Exhaust this card when 1 or more of your units use ‘Production’; swap the resource and influence values of 1 planet you control during that use of ‘Production.’"],
        ["Hyper Metabolism", "technology", "During the status phase, gain 3 command tokens instead of 2."],
        ["Matriarch", "Naalu flagship", "During an invasion in this system, you may commit fighters to planets as if they were ground forces. When combat ends, return those units to the space area."],
        ["Political Favor", "Xxcha promissory note", "When an agenda is revealed: Remove 1 token from the Xxcha player’s strategy pool and return it to their reinforcements. Then, discard the revealed agenda and reveal 1 agenda from the top of the deck. Players vote on this agenda instead. Then, return this card to the Xxcha player."],
        ["Unstable Planet", "action card", "Action: Choose 1 hazardous planet. Exhaust that planet and destroy up to 3 infantry on it."],
        ["Veto", "action card", "When an agenda is revealed: Discard that agenda and reveal 1 agenda from the top of the deck. Players vote on this agenda instead."]
      ];
      return (TI.isTF(c) ? "<p class=\"note\">Twilight’s Fall returns the standard strategy cards, action cards, agendas, technologies, promissory notes, faction sheets, leaders and standard mechs to the box (TF p.6) — these apply only where a card with the same name is in play.</p>" : "") + "<p class=\"sub\">Read these cards as corrected below. The community TI4 Wiki’s Errata page lists the same eleven corrections (its Diplomacy entry quotes only the secondary ability).</p>" +
        E.map(e => "<div class=\"errata-card\"><b>" + e[0] + "</b> <span class=\"sub\">(" + e[1] + ")</span><br><q>" + e[2] + "</q></div>").join("");
    },
    src: (c) => "LRR errata p.40 · Wiki Errata" + (TI.isTF(c) ? " · TF p.6" : "")
  },
  {
    id: "ref-rulings", title: "Key rulings — LRR FAQ & TI4 Wiki FAQ", when: () => true,
    html: (c) => {
      /* Twilight's Fall has no agenda phase and no agenda cards (TF p.6, p.10): its agenda rulings can never apply */
      const R = TI.rulings.filter(r => TI.setOk(c, r.set) && !(TI.isTF(c) && (r.g === "Agendas" || r.tfOut)));
      const groups = [];
      for (const r of R) { let g = groups.find(x => x.g === r.g); if (!g) { g = { g: r.g, items: [] }; groups.push(g); } g.items.push(r); }
      return (TI.isTF(c) ? "<p class=\"note\">Twilight’s Fall returns the standard strategy cards, action cards, agendas, technologies, promissory notes, faction sheets, leaders and standard mechs, and the “Betray a Friend”, “Dictate Policy”, “Drive the Debate” and “Strengthen Bonds” secret objectives, to the box (TF p.6) — the rulings below apply only where a card with the same name is in play. It has no agenda phase (TF p.10), so the agenda rulings are left out, and the research/gain ruling is replaced by Twilight’s Fall’s own rule (TF p.10).</p>" : "") + "<p class=\"sub\">Official answers from the Living Rules Reference FAQ, and answers the TI4 Wiki (a community fan wiki, not an official source) marks as confirmed by Fantasy Flight Games or designer Dane Beltrami (“Wiki FAQ”). " + (TI.isTF(c) ? "Faction-specific rulings are under Faction rulings." : "Action-card rulings are under Action cards, voting and rider rulings under Agenda phase &amp; voting, and faction-specific rulings under Faction rulings.") + "</p>" +
        groups.map(g => "<h4>" + g.g + "</h4><ul>" + g.items.map(r => "<li" + (r.flag ? " class=\"note flag\"" : "") + ">" + (typeof r.t === "function" ? r.t(c) : r.t) + " <span class=\"sub\">(" + (typeof r.s === "function" ? r.s(c) : r.s) + ")</span></li>").join("") + "</ul>").join("");
    },
    src: (c) => "LRR FAQ p.40–42 · LRR §17 p.12, §33 p.17, §36 p.18, §39 p.19, §44 p.20, §46 p.20, §65 p.25, §95 p.36 · PoK p.16 · Wiki FAQ (General; Units & Unit Abilities; Objectives; Agendas; Technology; Exploration — topic on each ruling)" + (TI.isTF(c) ? " · TF p.6, p.10" : "")
  },
  {
    id: "ref-faction-rulings", title: "Faction rulings — LRR FAQ & TI4 Wiki FAQ", when: () => true,
    html: (c) => {
      const R = TI.factionRulings.filter(r => TI.setOk(c, r.set));
      const groups = [];
      for (const r of R) { let g = groups.find(x => x.f === r.f); if (!g) { g = { f: r.f, items: [] }; groups.push(g); } g.items.push(r); }
      return (TI.isTF(c) ? "<p class=\"note\">Twilight’s Fall returns the standard strategy cards, action cards, agendas, technologies, promissory notes, faction sheets, leaders and standard mechs to the box (TF p.6) — these apply only where a card with the same name is in play.</p>" : "") + "<p class=\"sub\">Faction sheets, leaders and technologies are in the <a href=\"../../ti.html\">Faction Reference</a>. Rulings on Codex “Ω” cards appear only when that Codex (or Thunder’s Edge, which reprints them) is selected; rulings on the cards they replace are then hidden.</p>" +
        "<dl>" + groups.map(g => "<dt>" + g.f + "</dt>" + g.items.map(r => "<dd" + (r.flag ? " class=\"note flag\"" : "") + ">" + r.t + " <span class=\"sub\">(" + r.s + ")</span></dd>").join("")).join("") + "</dl>";
    },
    src: (c) => "LRR errata p.40 · LRR FAQ p.41, p.43–44 · LRR §15, §33, " + (c.has("pok") ? "§51, " : "") + "§60, §65, §68, §79, §85, §87, §90, §94" + (c.has("pok") ? " · PoK p.7, p.16" : "") + (c.has("pok") && (c.has("codex3") || c.has("te")) ? " · Codex III p.13" : "") + " · Wiki FAQ (Factions)" + (c.has("te") ? " · TE p.5" : "") + (TI.isTF(c) ? " · TF p.6" : "")
  },
  {
    id: "ref-sources", title: "Sources & which rule wins", when: () => true,
    html: (c) => "<ul><li><b>Living Rules Reference v2.0</b> (22 Sept 2020) is “the definitive source” for base game + Prophecy of Kings rules; it beats the Learn to Play and the original base Rules Reference, and its errata and FAQ are applied throughout this page.</li>" +
      "<li>Precedence, newest official ruling first: Thunder’s Edge &amp; Twilight’s Fall (2025) › Codex IV (2025) › Codex III (2022) › Codex II (2021) › LRR v2.0 (Sept 2020) › Prophecy of Kings rulebook (2020) › Codex I (2020 — its foreword says it came out before Prophecy of Kings was released) › base Rules Reference (2017) › Learn to Play › TI4 Wiki (community, clarification only). Thunder’s Edge ranks above every Codex because it reprints their content in revised form (TE p.4). A card beats the rules where they conflict.</li>" +
      "<li><b>TI4 Wiki</b> (a community-run fan wiki, the lowest tier, below every official document): only answers on its FAQ page that it marks as confirmed by FFG or the designer are used, and only to clarify what the PDFs leave open, labelled “Wiki FAQ”. Its Errata page is used only as a cross-check of LRR p.40. Where one conflicts with a PDF, the PDF rule is shown and the conflict is flagged. Unofficial community answers are not used.</li>" +
      (c.has("te") ? "<li><b>Thunder’s Edge</b> (TE p.16) points to the Living Rules Reference online for the full rules. The LRR used here is v2.0 (2020), which predates Thunder’s Edge: where the Thunder’s Edge rulebook changes a rule, this page follows it; any later LRR revision is not covered.</li>" : "") +
      "<li>Page numbers are the printed page numbers of each booklet (they match the PDF pages). Base-game-only setups also cite the base Rules Reference (RR); the first game also cites the Learn to Play (LtP).</li></ul>",
    src: (c) => "LRR changelog (unnumbered PDF p.2), p.4, §1 p.7 · LtP p.5 · Codex I p.4 · TE p.4" + (c.has("te") ? ", p.16" : "")
  }
];

/* set gate for rulings: "base" always · "pok" · "base-only" (cards PoK removes) · "tf" (Twilight's Fall mode) · codex/te ids ·
   "!id" = that set is NOT selected · arrays = any of · {all: [...]} = every one of */
TI.setOk = function (c, set) {
  if (!set || set === "base") return true;
  if (set === "base-only") return !c.has("pok");
  if (set === "tf") return TI.isTF(c);
  if (typeof set === "string" && set.charAt(0) === "!") return !c.has(set.slice(1));
  if (Array.isArray(set)) return set.some(s => TI.setOk(c, s));
  if (typeof set === "object" && Array.isArray(set.all)) return set.all.every(s => TI.setOk(c, s));
  return c.has(set);
};
/* Codex scenarios without Mecatol Rex / the standard custodians token (module mode ids from
   js/data-codex.js): Ordinian — the custodians token is the Coatl, standard custodians rules not used,
   the agenda phase is added when the Coatl is repaired (Codex I p.12); Liberation of Ordinian — no
   custodians token is placed and the scenario never says when the agenda phase begins (Codex IV p.18). */
TI.scenarioSrc = (c) => c.mode === "ordinian" ? " · Codex I p.12" : c.mode === "liberation" ? " · Codex IV p.18" : "";
/* games using the Alliance variant's rules: the variant itself (every player) or Liberation of Ordinian
   (Sol and Xxcha, who resolve the variant's setup step 3 — Codex IV p.17). Setup: each such player purges
   their "Alliance" promissory note and flips their commander to its unlocked side; commodities exchanged
   with your ally don't convert into trade goods (Codex II p.13, TE p.13). */
TI.allyRules = (c) => TI.isAlliance(c) ? { who: "all players", label: "Alliance variant", src: TI.allianceSrc(c) }
  : c.mode === "liberation" ? { who: "the allied Sol and Xxcha players", label: "Liberation of Ordinian", src: "Codex IV p.17–18 · Codex II p.13" } : null;
TI.agendaStart = (c) => c.mode === "ordinian"
  ? "skipped early on. In the Ordinian scenario the custodians token is the <b>Coatl</b> and its standard rules aren’t used: the agenda phase is added to the game once a player <b>repairs the Coatl</b> (see “Ordinian scenario: the Coatl”)."
  : c.mode === "liberation"
    ? "the Liberation of Ordinian scenario places no custodians token and doesn’t say when the agenda phase begins. Read literally it is never added, since its trigger is removing that token (LRR 8.1, 27.4) — agree on it before you start (see the scenario section)."
    : "skipped early on. Once a player removes the custodians token from Mecatol Rex, it is added to <b>every</b> round, including the round in which the token was removed.";
/* a Codex IV galactic event that changes a core rule is (or may be) in play: the module js/data-codex.js
   offers the choices "ge-<key>" plus "ge-any" (drawn or chosen at the table) — Codex IV pp.15–16 */
TI.geEvent = (c, key) => c.mode === "standard" && c.has("codex4") && (c.mod("ge-" + key) === true || c.mod("ge-any") === true);

/* ---- key rulings (general) — g = group, t = text, s = source, set = gate ---- */
TI.rulings = [
  { g: "General", t: "A “0” on the ten-sided die is a 10.", s: "LRR FAQ p.40" },
  { g: "General", t: "You may reveal hidden information — an action card, your secret objective — to other players if you wish.", s: "LRR FAQ p.41" },
  { g: "General", t: "A card gained through a transaction during its own timing window (e.g. a promissory note with “At the start of your turn”) may be played immediately.", s: "LRR FAQ p.41" },
  { g: "General", t: "Players don’t begin the game with commodities.", s: "Wiki FAQ (Commodities)" },
  { g: "General", t: "“End of turn” abilities can be resolved on the turn you pass.", s: "Wiki FAQ (Passing)" },
  { g: "General", t: "“After X” happens before “before Y” — they are distinct windows.", s: "Wiki FAQ (Timing)" },
  { g: "General", t: "<b>Sources disagree:</b> a fighter or infantry token left without a plastic piece of its type, which can’t be replaced with one, is <b>destroyed</b> under LRR §36.3a and §46.3a (followed here); the Wiki FAQ reports an official answer that such tokens are <b>removed</b>, not destroyed.", s: "LRR §36 p.18, §46 p.20 · Wiki FAQ (Excess Fighters/Infantry) — conflict flagged", flag: true },
  { g: "General", t: "“Replace” may be treated as “remove and place” when you have no units of that type left in reinforcements (component limitations apply). This overturns an earlier ruling about the Minister of Industry.", s: "Wiki FAQ (Replace v. Remove and Place)" },
  { g: "General", t: "A damaged unit that an ability removes and places (e.g. Transit Diodes) stays damaged; a damaged unit taken off the board so that it can be produced, placed or replaced (component limits) comes back undamaged.", s: "Wiki FAQ (Replace v. Remove and Place)" },
  { g: "General", t: "“At the start of a combat” abilities can only be used in a combat you are taking part in.", s: "Wiki FAQ (General)" },
  { g: "General", t: "<b>Sources disagree:</b> when a player is eliminated, LRR §33.2 (followed here) returns every unit of their faction or colour to the game box, which reads as including their non-fighter ships and mechs captured on other players’ sheets. The Wiki FAQ reports an official answer that captured units stay on the capturer’s sheet and go to the box only if they would ever be returned. Captured fighter and infantry tokens belong to no player (§17.4), so they stay either way.", s: "LRR §33 p.17, §17 p.12 · Wiki FAQ (General) — conflict flagged", set: ["pok", "tf"], flag: true },
  { g: "Movement & combat", t: "Fighters block ship movement (a correction since LRR v1.1).", s: "LRR FAQ p.40" },
  { g: "Movement & combat", t: "Any effect that moves a ship (e.g. “Skilled Retreat”, the “Foresight” faction ability) lets it transport units from its system if it has capacity — including units on planets.", s: "LRR FAQ p.41" },
  { g: "Movement & combat", t: "If neither side can possibly win a space combat, the attacker must retreat; if they can’t, their units in the combat are destroyed.", s: "LRR FAQ p.40" },
  { g: "Movement & combat", t: "Only the destination system is moved “into”; the others are moved “through”. The mover chooses the path when wormholes and ordinary adjacency both work.", s: "Wiki FAQ (Moving Into Systems; Path of Movement)" },
  { g: "Movement & combat", t: "<b>Sources disagree:</b> LRR §95.3 (followed here) bars picking up fighters and ground forces from a system that contains your command token (other than the active system), without limiting this to tactical actions. The Wiki FAQ reports an official ruling that the restriction applies only during tactical actions — ships moved by abilities may transport units out of such systems — and that the LRR “will be updated”; LRR v2.0 hasn’t been.", s: "LRR §95 p.36 · Wiki FAQ (Movement Abilities) — conflict flagged", flag: true },
  { g: "Movement & combat", t: "<b>Sources disagree:</b> LRR §39.2 (followed here) puts a system on the board’s edge if any of its sides doesn’t touch another system tile, and hyperlane tiles aren’t systems (§44.2). The Wiki FAQ gives the designer’s intent that, on hyperlane maps, a side touching a hyperlane tile isn’t an edge.", s: "LRR §39 p.19, §44 p.20 · Wiki FAQ (Hyperlanes) — conflict flagged", set: ["pok", "te"], flag: true },
  { g: "Unit abilities", t: "Bombardment, Anti-Fighter Barrage and Space Cannon are optional — you choose whether to roll.", s: "Wiki FAQ (Units & Unit Abilities)" },
  { g: "Unit abilities", t: "The anti-fighter barrage step still happens when the opponent has no fighters.", s: "Wiki FAQ (Units & Unit Abilities) · PoK p.16" },
  { g: "Unit abilities", t: "“Plasma Scoring” adds one die to each Bombardment or Space Cannon roll — not one per unit — and you choose the unit before rolling. With PDS on several invaded planets, each planet’s space cannon roll gets its die.", s: "LRR FAQ p.40–41" },
  { g: "Unit abilities", t: "PDS II (Deep Space Cannon) can fire through wormholes.", s: "Wiki FAQ (Units & Unit Abilities)" },
  { g: "Unit abilities", t: "Planetary Shield does not stop “X-89 Bacterial Weapon” (it isn’t bombardment).", s: "LRR FAQ p.40 · LRR §65 p.25", set: { all: ["!codex1", "!te"] } },
  { g: "Unit abilities", t: "Planetary Shield does stop “X-89 Bacterial Weapon Ω”, which needs bombardment to actually occur.", s: "Wiki FAQ (Units & Unit Abilities)", set: ["codex1", "te"] },
  { g: "Unit abilities", t: "Infantry II: if you control no planets in your home system when its infantry would be placed there, they return to your reinforcements instead; its resurrection roll works however the infantry were destroyed (e.g. “Plague”).", s: "LRR FAQ p.41 · Wiki FAQ (Units & Unit Abilities)" },
  { g: "Production", t: "Units produced by any ability must be paid for.", s: "LRR FAQ p.41" },
  { g: "Production", t: "“Sarween Tools” only reduces costs when using the Production ability.", s: "LRR FAQ p.41" },
  { g: "Trade & promissory notes", t: "Players chosen by the Trade primary resolve the secondary during the secondary step as normal, just without spending a token.", s: "LRR FAQ p.41" },
  { g: "Trade & promissory notes", t: "“Trade Agreement” can be played against a player who gains 0 commodities when replenishing.", s: "LRR FAQ p.41" },
  { g: "Trade & promissory notes", t: "“Political Secret” only stops faction abilities a player chooses to use — not passive ones (e.g. Letnev’s Armada), faction technologies, or abilities from owned agendas. If the agenda it was used on is discarded (e.g. by “Veto”), its effect ends for the new agenda.", s: "LRR FAQ p.41–42" },
  { g: "Trade & promissory notes", t: "“Neural Motivator” gives one extra action card only in the standard status-phase draw; the Yssaril “Scheming” ability triggers every time action cards are drawn.", s: "LRR FAQ p.41" },
  { g: "Objectives", t: "An objective requiring “units” is met by a single unit.", s: "Wiki FAQ (Objectives)" },
  { g: "Objectives", t: "Secret objectives are scored “after” events — e.g. Become a Martyr after elimination or losing Shard of the Throne; “Legal Text” action cards are played before Drive the Debate can be scored.", s: "Wiki FAQ (Objectives)" },
  { g: "Objectives", t: "“Turn Their Fleets to Dust” isn’t fulfilled by “Direct Hit”, or by destroying a ship with capacity so its fighters are removed — Space Cannon didn’t destroy the last ship.", s: "LRR FAQ p.41", set: { all: ["!codex3", "!te"] } },
  { g: "Objectives", t: "Another player holding your “Trade Agreement” doesn’t count for “Strengthen Bonds” or “Betray a Friend” — only notes their instructions put in a play area count.", s: "Wiki FAQ (Objectives)", tfOut: true },
  { g: "Objectives", t: "“Rule Distant Lands”: control 2 planets, each in or adjacent to a <i>different</i> opponent’s home system.", s: "Wiki FAQ (Objectives)" },
  { g: "Objectives", t: "A planet under a destroyed planet token is no longer a planet for any purpose.", s: "Wiki FAQ (Objectives)", set: "pok" },
  { g: "Objectives", t: "“Impersonation” can be played at your secret-objective limit: draw, then return one and shuffle.", s: "Wiki FAQ (Objectives)", set: ["codex1", "te"] },
  { g: "Agendas", t: "A “Research Team” agenda attached to a planet is exhausted to ignore a prerequisite — the planet is not.", s: "LRR FAQ p.41", set: "base-only" },
  { g: "Agendas", t: "“Enforced Travel Ban” does not stop Space Cannon through wormholes.", s: "LRR FAQ p.41" },
  { g: "Agendas", t: "If “Classified Document Leaks” is discarded, the objective stays scored but is no longer public (no one else can score it) and no longer counts toward its owner’s secret objectives.", s: "LRR FAQ p.42" },
  { g: "Agendas", t: "During a “Miscount Disclosed” revote, the law being voted on stays in play.", s: "LRR FAQ p.42" },
  { g: "Agendas", t: "“Ixthian Artifact” destroys units simultaneously; Creuss adjacency through Quantum Entanglement only applies to the Creuss.", s: "LRR FAQ p.42" },
  { g: "Agendas", t: "“Colonial Redistribution” may elect a planet that is also under “Demilitarized Zone”, but no infantry can be placed there, so the original owner keeps it.", s: "LRR FAQ p.42", set: "base-only" },
  { g: "Agendas", t: "“Holy Planet of Ixth”, “Shard of the Throne” and “The Crown of Emphidia”: their point is lost only as the card itself says — not when the law is repealed another way.", s: "LRR FAQ p.42", set: "base-only" },
  { g: "Agendas", t: "“Minister of War”: performing any action is the trigger.", s: "LRR FAQ p.42" },
  { g: "Agendas", t: "“Shared Research” (Against): place the token in your home system even if you don’t control it. “New Constitution” exhausts only home planets you control.", s: "Wiki FAQ (Agendas)" },
  { g: "Agendas", t: "“Covert Legislation”: follow the text (draw a new agenda if the drawn one replaces itself); the speaker still votes. “Legal Text” cards and “Deadly Plot” must be played before the hidden agenda is revealed; “resolved with no effect” can’t be predicted.", s: "Wiki FAQ (Agendas)" },
  { g: "Technology", t: "An ability that says “research” needs the prerequisites; “gain” or “replace” does not. You can’t resolve an ability to gain a technology you already own.", s: "Wiki FAQ (Technology)", tfOut: true },
  { g: "Technology", t: "Twilight’s Fall has no technology deck. If an effect lets you gain or research a technology, you can take one of your faction technologies instead (they have no prerequisites); if you already have both, you may gain 2 command tokens instead.", s: "TF p.10", set: "tf" },
  { g: "Technology", t: "“Sling Relay” must produce a ship; an exhausted “Predictive Intelligence” gives no bonus votes; “Psychoarchaeology” trade goods are gained one at a time.", s: "Wiki FAQ (Technology)" },
  { g: "Technology", t: "When Infantry II’s resurrection and a capture effect both apply to the same infantry, both happen.", s: "Wiki FAQ (Technology)", set: "pok" },
  { g: "Exploration & relics", t: "Gaining several planets: gain and explore each in turn (gain A, explore A, gain B, explore B).", s: "Wiki FAQ (Exploration)", set: "pok" },
  { g: "Exploration & relics", t: "Eliminated players’ relics are purged.", s: "Wiki FAQ (Exploration)", set: ["pok", "te"] },
  { g: "Exploration & relics", t: "An eliminated player’s relic fragments are discarded. You may purge fragments even if the relic deck is empty.", s: "Wiki FAQ (Exploration)", set: "pok" },
  { g: "Exploration & relics", t: (c) => "Over your commodity limit after purging the “Dynamis Core” relic? Discard down." + (TI.geEvent(c, "ageOfCommerce") ? " During the <b>Age of Commerce</b> galactic event there is no commodity maximum, so you keep them (Codex IV p.16)." : ""), s: (c) => "Wiki FAQ (Exploration)" + (TI.geEvent(c, "ageOfCommerce") ? " · Codex IV p.16" : ""), set: { all: [["codex2", "te"], ["pok", "te"]] } },
  { g: "Exploration & relics", t: "Cards taken from a discard pile with “The Codex” relic are public knowledge. “The Crown of Thalnos” affects only combat rolls (not Infantry II, “Courageous to the End” or anti-fighter barrage).", s: "Wiki FAQ (Exploration)", set: "pok" }
];

/* ---- faction rulings — f = faction, t = text, s = source, set = gate ---- */
TI.factionRulings = [
  { f: "The Arborec", t: "Their space docks’ Production can’t be used to produce infantry, even with other Production units in the system.", s: "LRR §68 p.27" },
  { f: "The Arborec", t: "The Warfare secondary triggers only space docks, so it can’t trigger Letani Warriors’ Production.", s: "LRR FAQ p.43", set: "!te" },
  { f: "The Arborec", t: "The LRR FAQ answer that the Warfare secondary can’t trigger Letani Warriors’ Production was written for the old “1 space dock” wording; Thunder’s Edge’s revised Warfare secondary uses the PRODUCTION abilities of the units in your home system.", s: "TE p.5 · LRR FAQ p.43", set: "te" },
  { f: "The Arborec", t: "Several Letani Warriors in a system total their Production (2 infantry for 1 resource).", s: "LRR FAQ p.43" },
  { f: "The Arborec", t: "“Duha Menaimon” must be in the system when it is activated. “Sarween Tools” doesn’t reduce the cost of units it produces (its ability isn’t PRODUCTION). “Mitosis” places only 1 infantry on a single planet.", s: "LRR FAQ p.41, p.43 · Wiki FAQ (The Arborec)" },
  { f: "The Arborec", t: "Hero “Ultrasonic Emitter”: the produced units must be paid for.", s: "Wiki FAQ (The Arborec)", set: "pok" },
  { f: "The Barony of Letnev", t: "“Non-Euclidean Shielding”: their Sustain Damage cancels up to 2 hits instead of 1.", s: "LRR §87 p.33" },
  { f: "The Barony of Letnev", t: "“War Funding” and “Munitions Reserves” affect only combat rolls — not anti-fighter barrage.", s: "Wiki FAQ (The Barony of Letnev)" },
  { f: "The Barony of Letnev", t: "Agent Viscount Unlenn affects only combat rolls — no extra anti-fighter barrage die.", s: "Wiki FAQ (The Barony of Letnev)", set: "pok" },
  { f: "The Clan of Saar", t: "“Floating Factory” space docks sit in the space area, are destroyed when blockaded, and can’t trigger or be hit by PDS space cannon.", s: "LRR §79 p.30, §85 p.32 · LRR FAQ p.44" },
  { f: "The Clan of Saar", t: "“Chaos Mapping” can be used at the start of each of their turns in the action phase, including the turn they pass.", s: "LRR FAQ p.44" },
  { f: "The Clan of Saar", t: "Agent Mendosa will be errata’d to “When you activate a system”, so other move bonuses apply after it; leaving a nebula, Mendosa counts as a bonus over the nebula’s move of 1.", s: "Wiki FAQ (The Clan of Saar)", set: "pok" },
  { f: "The Embers of Muaat", t: "Prototype War Sun I is a printed unit, not a technology: the Nekro can’t copy it; with “Publicize Weapon Schematics” For, it loses Sustain Damage but others can’t ignore war sun prerequisites through it, and Against doesn’t affect it (normal once Prototype War Sun II is researched).", s: "LRR FAQ p.43 · Wiki FAQ (The Embers of Muaat)" },
  { f: "The Embers of Muaat", t: "Hero “Nova Seed” purges all tokens in the system except command and frontier tokens; faction tokens return to their faction.", s: "Wiki FAQ (The Embers of Muaat)", set: "pok" },
  { f: "The Emirates of Hacan", t: "They may trade action cards in transactions. For transactions with non-neighbors, either player may open negotiations as long as the active player is involved. “Arbiters” is passive and still works under “Political Secret”.", s: "LRR §94 p.36 · LRR FAQ p.43 · Wiki FAQ (The Emirates of Hacan)" },
  { f: "The Emirates of Hacan", t: "A planet holding the Hacan mech can’t be traded during combat, and you can’t produce ground forces on a planet that holds another player’s ground forces (future errata).", s: "Wiki FAQ (The Emirates of Hacan)", set: "pok" },
  { f: "The Ghosts of Creuss", t: "Their promissory note works even without “Wormhole Generator”. “Light/Wave Deflector” lets other players move through a “Hil Colish” wormhole into the Creuss home or Gate system. If the Hil Colish is removed by a gravity rift, its wormhole is gone for later ships.", s: "LRR FAQ p.44" },
  { f: "The Ghosts of Creuss", t: "Players are neighbors with the Creuss when Quantum Entanglement creates adjacency from the Creuss player’s view. Creuss wormhole tokens stay on the board if they are eliminated.", s: "LRR §60 p.24, §33 p.17" },
  { f: "The Ghosts of Creuss", t: "Commander Sai Seravus: fighters are placed one at a time, up to the number of capacity ships that moved through wormholes or the capacity limit. Hero “Singularity Reactor”: all tokens stay with their tile.", s: "Wiki FAQ (The Ghosts of Creuss)", set: "pok" },
  { f: "The L1Z1X Mindnet", t: "“Harrow” (see Errata) doesn’t hit their own ground forces, is stopped by Planetary Shield, and can’t be used when defending — only the active player bombards.", s: "LRR §15 p.12, §65 p.25 · Wiki FAQ (The L1Z1X Mindnet)" },
  { f: "The Mentak Coalition", t: "“Salvage Operations” can’t produce a war sun without war sun technology; can produce their own flagship after destroying an opponent’s; can’t produce infantry after an “Alastor” combat. “Pillage” works with neighbors created by “Lazax Gate Folding” or Quantum Entanglement, and once for each Saar “Scavenge” gain.", s: "LRR FAQ p.44" },
  { f: "The Mentak Coalition", t: "Hero “Sleeper Cell” can’t place a war sun without the technology; if their last ship dies in a round where they destroy one, they place a ship and combat continues. “Unveil Flagship” can’t be scored if their flagship was destroyed in that combat, even if rebuilt.", s: "Wiki FAQ (The Mentak Coalition)", set: "pok" },
  { f: "The Naalu Collective", t: "“The Matriarch” fighters return to space when ground combat ends — fighters alone can’t take a planet (it is a draw), so “Dacxive Animators” doesn’t trigger. The Naalu “0” token stays with its holder, not with a strategy card.", s: "LRR FAQ p.44" },
  { f: "The Naalu Collective", t: "Commander M’aban lets them build a single fighter for 1 resource and gain another.", s: "Wiki FAQ (The Naalu Collective)", set: { all: ["pok", "!codex3", "!te"] } },
  { f: "The Naalu Collective", t: "Agent Z’eu Ω: the chosen player makes a tactical action as the active player but it isn’t their turn (no Fleet Logistics; Master Plan and Minister of War work; Minister of Peace or Starlancer still end it). M’aban Ω can’t peek when “Covert Legislation” is revealed or interrupt the Politics primary.", s: "Wiki FAQ (The Naalu Collective)", set: { all: ["pok", ["codex3", "te"]] } },
  { f: "The Nekro Virus", t: "“Valefar Assimilator” copies researched faction technologies incl. unit upgrades — not printed faction units. A copied technology counts its color and type for objectives; it stays in play if its owner is eliminated. They may hold a standard and a faction upgrade of the same type (only the faction one is active); several upgrades of one type count once for “Develop Weaponry” and “Revolutionize Warfare”.", s: "LRR §90 p.34–35 · LRR FAQ p.43 · Wiki FAQ (The Nekro Virus)" },
  { f: "The Nekro Virus", t: "“The Alastor”: infantry in the space combat count as ships for card effects (not fleet supply), keep fighting if it dies, can invade afterwards, count for “Assault Cannon”, and give the Winnu flagship extra dice.", s: "LRR FAQ p.43 · Wiki FAQ (The Nekro Virus)" },
  { f: "The Nekro Virus", t: "The Nekro player can’t vote, so they can’t play “Bribery” or “Distinguished Councilor” — but they can still play rider action cards.", s: "LRR FAQ p.43 · Wiki FAQ (The Nekro Virus)" },
  { f: "The Nekro Virus", t: "“Prophet’s Tears” works with Propagation, not with Technological Singularity. Agent Nekro Malleon (like other “during the action phase” abilities) can’t interrupt another ability. Alastor ground forces don’t move from where they are; if on a planet they are immune to Strike Wing Alpha II.", s: "Wiki FAQ (The Nekro Virus)", set: "pok" },
  { f: "The Sardakk N’orr", t: "Commander G’hom Sek’kus: the LRR will say “move” instead of “commit”, so “Ceasefire” stops it, and ground forces can’t be committed to planets in anomalies without the appropriate technology, or through wormholes while “Enforced Travel Ban” is a law; not usable when defending, nor with “Dominus Orb”; usable without moving ships in. “Valkyrie Particle Weave” still produces its hit if their hits were canceled.", s: "Wiki FAQ (Sardakk N’orr)", set: "pok" },
  { f: "The Universities of Jol-Nar", t: "Hero Rin swaps technologies simultaneously; a Nekro assimilator token on a swapped faction technology stays with it.", s: "Wiki FAQ (The Universities of Jol-Nar)", set: "pok" },
  { f: "The Winnu", t: "Commander Rickar Rickani gives at most +2. “Reclamation” happens after the tactical action, too late to produce on Mecatol Rex that action.", s: "Wiki FAQ (The Winnu)", set: "pok" },
  { f: "The Xxcha Kingdom", t: "“Peace Accords” works from a planet to another in the same system, and on a planet whose system has other players’ ships as long as the planet has no opposing ground forces or structures. “Instinct Training” can cancel “Sabotage”. “Political Favor” can’t be used if the Xxcha strategy pool is empty.", s: "LRR FAQ p.43 · Wiki FAQ (The Xxcha Kingdom)" },
  { f: "The Xxcha Kingdom", t: "Agent Ggrocuto Rinn can only ready an exhausted planet.", s: "Wiki FAQ (The Xxcha Kingdom)", set: "pok" },
  { f: "The Xxcha Kingdom", t: "Hero Xxekir Grom: if two players reach the winning total, initiative order decides; the Xxcha player may play riders and use Quash, while other players don’t vote and can’t play action cards; drawn agendas that affect everyone still resolve; “Checks and Balances” doesn’t trigger during it.", s: "Wiki FAQ (The Xxcha Kingdom)", set: { all: ["pok", "!codex3", "!te"] } },
  { f: "The Xxcha Kingdom", t: "Hero Political Data Nexus Ω: combined values are spent as resources or influence, not both; hero unlocks are checked after the whole Score Objectives step; “resource value” effects use the printed value.", s: "Wiki FAQ (The Xxcha Kingdom)", set: { all: ["pok", ["codex3", "te"]] } },
  { f: "The Yssaril Tribes", t: "“Scheming” triggers every time they draw action cards.", s: "LRR FAQ p.41" },
  { f: "The Yin Brotherhood", t: "“Devotion” — see Errata.", s: "LRR errata p.40" },
  { f: "The Yin Brotherhood", t: "Agent Brother Milor keeps a combat going after the last ship is destroyed. Commander Brother Omar lets them build a single infantry for 1 resource and gain another.", s: "Wiki FAQ (The Yin Brotherhood)", set: { all: ["pok", "!codex3", "!te"] } },
  { f: "The Yin Brotherhood", t: "<b>Sources disagree:</b> Quantum Dissemination Ω as printed (Codex III p.13) says to <b>resolve invasions</b> on those planets (followed here); the Wiki FAQ reports an official answer that it should resolve only ground combats, not full invasion steps, with “Parley” playable on one of those planets. <b>Sources disagree:</b> Brother Milor Ω’s printed trigger (“After a player’s unit is destroyed”) has no phase limit (followed here); the Wiki FAQ reports an official answer that it can be used only in the action phase. With the Nekro or Naalu flagship abilities, the owner chooses fighters or infantry.", s: "Codex III p.13 · Wiki FAQ (The Yin Brotherhood) — conflicts flagged", set: { all: ["pok", ["codex3", "te"]] }, flag: true },
  { f: "The Argent Flight", t: "“Raid Formation” damages ships without using Sustain Damage (no “Direct Hit” window) and applies after rolling, before canceling or assigning hits. Hero Mirik Aun Sissiri must obey anomaly movement rules. “Strike Wing Alpha II”: rerolls happen first, and its infantry are destroyed before hits are canceled.", s: "Wiki FAQ (The Argent Flight)", set: "pok" },
  { f: "The Empyrean", t: "“Dark Pact”: the commodities and the trade good are gained together (one gain for “Pillage”). Flagship “Dynamo” may repair several times in a round, paying 2 influence each time, but one unit can’t sustain twice in one window.", s: "Wiki FAQ (The Empyrean)", set: "pok" },
  { f: "The Mahact Gene-Sorcerers", t: "“Hubris”: they purge their own “Alliance” during setup and can’t receive others’. Agent Jae Mir Kan needs an eligible planet for the structure; the other player’s token is still placed. Commander Il Na Viroset: when they place a second token in a system, “when/after you activate” abilities and other abilities within that turn can’t be used, but end-of-turn abilities can; an ability that ends the turn ends it at once, with no further abilities in that timing window; “Dark Energy Tap” doesn’t trigger.", s: "PoK p.7 · Wiki FAQ (The Mahact Gene-Sorcerers)", set: "pok" },
  { f: "The Mahact Gene-Sorcerers", t: "“Genetic Recombination” resolves before votes are cast, so it can’t target a player who can’t vote or has no votes. A Mahact mech produced after a system is activated wasn’t there at activation, so its ability doesn’t trigger.", s: "Wiki FAQ (The Mahact Gene-Sorcerers)", set: "pok" },
  { f: "The Mahact Gene-Sorcerers", t: "Commander Il Na Viroset: when it is used, the “Counterstroke” action card can’t be played.", s: "Wiki FAQ (The Mahact Gene-Sorcerers)", set: { all: ["pok", ["codex1", "te"]] } },
  { f: "The Mahact Gene-Sorcerers", t: "Hero “Benediction”: ships leaving gravity rifts roll; the moved ships’ owner is the attacker and the combat system counts as the active system; capacity is checked before combat; moving their own ships, the Mahact may pick up their own ground forces from planets, but ground forces on planets can’t be picked up with another player’s moved ships (by the Mahact or by that player). They may use their mech on themselves. An agenda removing a fleet-pool token takes another player’s token if that is all they have; with “Fleet Regulations” they may add a 5th token then return one.", s: "Wiki FAQ (The Mahact Gene-Sorcerers)", set: "pok" },
  { f: "The Naaz-Rokha Alliance", t: "Hero Hesh and Prit can take tokens from the command sheet when reinforcements are empty (LRR to be updated). A fragment can be purged for a command token with none in reinforcements — you just gain none. “Distant Suns”: decide on the extra card before drawing.", s: "Wiki FAQ (The Naaz-Rokha Alliance)", set: "pok" },
  { f: "The Nomad", t: "“Duranium Armor” can’t repair Nomad mechs that canceled a hit in space combat (they aren’t rolling). “Temporal Command Suite” transactions don’t use up the per-player transaction. Hero Ahk-Syl Siven lets the flagship pick up ground forces in systems with their tokens.", s: "Wiki FAQ (The Nomad)", set: "pok" },
  { f: "The Titans of Ul", t: "Hel-Titans can’t be moved by the “Ghost Squad” action card — structures can’t move.", s: "Wiki FAQ (The Titans of Ul)", set: { all: ["pok", ["codex1", "te"]] } },
  { f: "The Titans of Ul", t: "Hel-Titans can be moved by “Transit Diodes” (remove and place) but not by the Sardakk N’orr commander shared through their “Alliance” note (structures can’t move); they can be bombarded by units that bypass Planetary Shield. The two-PDS limit doesn’t stop them placing a PDS where another player already has two, but they can’t deploy their mech onto a planet already holding 2 of their own PDS (or with no PDS in reinforcements — they may first remove one from the board). “Terraform” counts as in the planet owner’s play area for objectives. Their hero attaches to Elysium instead of being purged.", s: "LRR §51 p.22 · Wiki FAQ (The Titans of Ul)", set: "pok" },
  { f: "The Titans of Ul", t: "“Coalescence” forces the combat steps even if the turn then ends. Commander Tungstantus: gaining and spending the trade good is simultaneous (can’t be Pillaged). Their agent will be errata’d to “before you assign a hit”.", s: "Wiki FAQ (The Titans of Ul)", set: "pok" },
  { f: "The Vuil’raith Cabal", t: "If a space dock with a dimensional tear token under it is destroyed, the token is removed from the board. The Nekro Virus have their own dimensional tear tokens for when they copy “Dimensional Tear II”.", s: "PoK p.16", set: "pok" },
  { f: "The Vuil’raith Cabal", t: "Systems with Dimensional Tears are anomalies. “Vortex” needs that ship type in reinforcements. The flagship captures units destroyed in the same window it is destroyed. “The Crucible” bonus applies to every ship that can reach the active system. Their agent works on a player whose commodities were taken by “Trade Agreement”; converting commodities with it isn’t “gaining” for Pillage.", s: "Wiki FAQ (The Vuil’Raith Cabal)", set: "pok" }
];

/* =============================================================================
   TEACHING SCRIPT — teaching order: hook → round → actions → central mechanic (strategy
   cards) → economy, fighting, scoring, council, deals → inserts for selected options →
   [module-file inserts go here, before "later"] → don't worry yet.
   Sources: LtP p.2–21, LRR (as cited in the reference), PoK p.10–11.
   ============================================================================= */
TI.num = (n) => ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight"][n] || String(n);
TI.teach = {
  intro: "A ~5-minute teach for the exact sets, mode, player count and galaxy selected above. Read it aloud, or copy it and tweak. Every rule in it comes from the Learn to Play, the Living Rules Reference and (when selected) the expansion rulebooks cited in the setup steps and reference.",
  sections: [
    { id: "hook", h: "The hook — and how you win",
      body: (c) => "<p>" + (c.mode === "ordinian" || c.mode === "liberation"   /* Codex I p.12 · Codex IV p.18: Mecatol Rex is not used */
          ? "The Lazax emperors are long gone. Each of us leads a great civilization, and tonight we’ll barter, plot and fight over the heart of the galaxy — in this scenario Mecatol Rex isn’t on the board. "
          : "The Lazax emperors are long gone and the throne on Mecatol Rex stands empty. Each of us leads a great civilization, and we’ll barter, plot and fight to claim it. ") +
        (c.mode === "ordinian" ? "As in a standard game, the first to <b>10 victory points</b> wins, and points come almost entirely from <b>objectives</b>: public ones we all race for, and secret ones only you know."
          : TI.isScenario(c) ? "Tonight’s scenario sets its own victory conditions — more in a moment — but as always, points come almost entirely from <b>objectives</b>: public ones we all race for, and secret ones only you know."
          : TI.isAlliance(c) ? "We’re playing in alliances of two, so winning works differently — more in a moment — but points still come almost entirely from <b>objectives</b>: public ones we all race for, and secret ones only you know."
          : "The first to <b>" + (c.mod("vp14") ? "14" : "10") + " victory points</b> wins" + (c.mod("vp14") ? " — we’re playing the long war, 14 points instead of 10" : "") + ", and points come almost entirely from <b>objectives</b>: public ones we all race for, and secret ones only you know.") +
        " The game also ends if a new public objective must be revealed and none are left — most points wins.</p>" +
        (c.mode === "firstgame" ? "<p>This is a <b>first game</b>, kept simple: a <b>preset map</b>, six starter factions dealt at random, one secret objective each, and no promissory notes yet." + (c.p === 5 ? " With five of us, the seat closest to two others starts with four extra trade goods, and the two seats beside it get two each." : "") + "</p>" : "") },
    { id: "round", h: "The shape of a round",
      body: (c) => "<p><b>Strategy phase:</b> from the speaker, clockwise, each of us takes one of the eight strategy cards" + (c.p <= 4 ? ", then a second one" : "") + "; its number is your turn order this round, and cards nobody takes gain a trade good. <b>Action phase:</b> in turn order we take one action each, round and round, until everyone has passed. <b>Status phase:</b> score objectives, reveal a new one, draw an action card, take our command tokens back off the board, gain two more, and ready everything. " +
        (TI.isTF(c) ? "Then, instead of an agenda phase, comes the <b>benediction phase</b> — more on that below.</p>"
          : c.mode === "liberation" ? "<b>Agenda phase:</b> the scenario doesn’t say when it starts — we’ll settle that in a moment; once it does, the Galactic Council votes on two agendas every round.</p>"   /* Codex IV p.17–18 is silent */
          : TI.isScenario(c) ? "<b>Agenda phase:</b> not from the start — more on when it joins in a moment; once it does, the Galactic Council votes on two agendas every round.</p>"
          : "<b>Agenda phase:</b> only once someone has taken Mecatol Rex from the custodians — then the Galactic Council votes on two agendas every round.</p>") },
    { id: "actions", h: "Your turn — one action",
      body: (c) => "<p>The <b>tactical action</b>: put a command token from your tactic pool on a system, then move ships in, fight, land ground forces on its planets and build with your space docks there. Ships can’t leave a system holding your token until the status phase clears it — so where you place tokens is each round’s puzzle. The <b>strategic action</b>: use your strategy card’s primary ability; everyone else may then follow with its secondary, usually by paying a strategy token. You can’t pass until you’ve used your card. A <b>component action</b> is anything marked “Action” — " + (TI.isTF(c) ? "on your action cards and other cards" : "action cards, technologies, your faction sheet" + (c.has("pok") ? ", your leaders" : "")) + ".</p>" +
        "<p><b>Command tokens</b> are the real currency: tactic tokens are actions, strategy tokens follow other people’s cards, and your <b>fleet pool</b> is how many ships — not counting fighters — you may have in one system.</p>" },
    { id: "cards", h: "The strategy cards — the choice that shapes each round",
      body: (c) => "<p>Each card gives its owner a big move and everyone else a smaller one. <b>1 Leadership</b>: command tokens. <b>2 Diplomacy</b>: lock others out of one of your systems and ready two planets. <b>3 Politics</b>: pick the new speaker, draw action cards, peek at agendas. <b>4 Construction</b>: PDS and space docks. <b>5 Trade</b>: trade goods and commodities — you choose who follows for free. <b>6 Warfare</b>: " + (c.has("te") ? "a tactical action without placing a command token — Thunder’s Edge revised this card, more on it next." : "take a command token back so a fleet can move again.") + " <b>7 Technology</b>: research. <b>8 Imperial</b>: score a public objective now, plus a point if you hold Mecatol Rex" +
        (c.mode === "ordinian" ? " (tonight, anything that says Mecatol Rex means the Coatl’s system)" : c.mode === "liberation" ? " (tonight, anything that says Mecatol Rex means Ordinian)" : "") + ", otherwise a new secret objective.</p>" },
    { id: "economy", h: "Planets and money",
      body: (c) => "<p>Each planet has a <b>resource</b> value (left) for ships" + (TI.isTF(c) ? "" : " and technology") + " and an <b>influence</b> value (right) for command tokens" + (TI.isTF(c) ? "" : " and votes") + ". Spend it by exhausting the card; it readies in the status phase. <b>Trade goods</b> count as either. <b>Commodities</b> are worthless to you but become trade goods when given to another player — that’s why neighbors trade.</p>" },
    { id: "combat", h: "Fighting",
      body: () => "<p><b>Space combat</b>: each side rolls a ten-sided die per ship (some ships roll several), and each die equal to or above the ship’s combat value is a hit. Each side picks its own losses — fighters make good fodder. Repeat until one side is gone or retreats. Then <b>invade</b>: land ground forces, fight a ground combat the same way, and the survivor takes the planet. Enemy <b>PDS</b> fire their space cannon at your ships when you arrive, and PDS on a planet you invade fire again at the ground forces you land there.</p>" },
    { id: "objectives", h: "Scoring",
      body: () => "<p>In each status phase you may score <b>one public and one secret objective</b>. You can only score public objectives while you control <b>every planet in your home system</b>, so don’t leave it bare. Five stage I and five stage II objectives wait face down; one more is revealed each round.</p>" },
    { id: "council", h: (c) => c.mode === "ordinian" || c.mode === "liberation" ? "The Galactic Council" : "Mecatol Rex and the Galactic Council",
      body: (c) => "<p>" + (c.mode === "ordinian"
          ? "Tonight the custodians token plays the Coatl, so its usual rules are off: as the scenario says, the <b>agenda phase</b> joins the game once the Coatl is repaired, and from then on each round ends with it."
          : c.mode === "liberation"
          ? "There’s no custodians token in this scenario, and the book doesn’t say when the <b>agenda phase</b> starts — let’s agree on that before we begin."
          : "The first player to land on Mecatol Rex pays <b>six influence</b> to remove the custodians token and scores a point; from then on each round ends with the <b>agenda phase</b>.") + " Vote by exhausting planets for their influence — trade goods can’t be votes, but they can certainly persuade. Laws change the rules for good; directives happen once.</p>" },
    { id: "diplomacy", h: "Deals and trade",
      body: (c) => "<p>Deal with anyone, any time — but only terms that happen immediately are binding. On your turn you may make one <b>transaction</b> with each neighbor: trade goods and commodities" + (c.has("pok") ? " and relic fragments" : "") + (c.mode === "firstgame" || TI.isTF(c) ? "" : ", plus one promissory note each way — favors only other players can use") + "." + (TI.isTF(c) ? "" : " During agendas anyone can trade with anyone.") + "</p>" },
    /* ---- inserts for the selected configuration ---- */
    { id: "players34", when: (c) => c.p <= 4, h: (c) => "With " + TI.num(c.p) + " players",
      body: (c) => "<p>With " + TI.num(c.p) + " of us, everyone takes <b>two strategy cards</b>: the lower number sets your turn order, and you must use both before passing.</p>" },
    { id: "players78", when: (c) => c.p >= 7, h: (c) => "With " + TI.num(c.p) + " players",
      body: (c) => "<p>With " + TI.num(c.p) + " of us, everyone takes one strategy card" + (c.p === 8 ? " and every card is taken, so no trade goods pile up" : "") + ". Expect neighbors on every side.</p>" },
    { id: "galaxy", when: (c) => c.galaxy !== "ltp" && c.galaxyFrom !== "option", h: "Our galaxy",
      body: (c) => {
        const hl = " Hyperlanes — tiles with lines across them — link the systems at each end as if they were adjacent; nothing can stop on them.";
        if (c.has("te") && (c.galaxy === "hyper5" || c.galaxy === "hyper4")) return "<p>We <b>built the galaxy ourselves</b>, placing tiles in turn around the Thunder’s Edge <b>hyperlanes</b>.</p>";
        if (c.galaxy === "hyper5") return "<p>Our five-player galaxy uses <b>hyperlanes</b>." + hl + " They balance the seats, so no one got bonus trade goods.</p>";
        if (c.galaxy === "large") return c.has("te") ? "<p>This is the <b>large galaxy</b>: four rings and plenty of tiles — room to grow, which is why 14 points is recommended.</p>" : "<p>This is the <b>large galaxy</b>: four rings and every tile in the box — room to grow, which is why 14 points is recommended.</p>";
        if (c.galaxy === "alt") return "<p>This galaxy uses the <b>alternate hyperlanes</b>, set inside the map." + hl + "</p>";
        if (c.galaxy === "premade") return "<p>Tonight’s galaxy is a <b>premade map</b> from the Prophecy of Kings rulebook." + (TI.PREMADE_HL[c.p] ? hl : "") + "</p>";
        return "<p>We <b>built the galaxy ourselves</b>, placing tiles in turn — remember who put that asteroid field next to you." +
          (c.p === 5 ? " Without hyperlanes, three of you got <b>bonus trade goods</b> for crowded seats." : "") +
          (c.p === 7 ? hl : "") + "</p>";
      } },
    { id: "pok-leaders", when: (c) => c.has("pok") && !TI.isTF(c), h: "Prophecy of Kings — leaders and mechs",
      /* Alliance variant setup: every player purges their "Alliance" note and flips their commander unlocked
         (Codex II p.13, TE p.13); in Liberation of Ordinian only Sol and the Xxcha do (Codex IV p.17) */
      body: (c) => "<p>You have three <b>leaders</b>. Your <b>agent</b> is ready now: exhaust it for its ability; it readies in the status phase. " +
        (TI.isAlliance(c) ? "Your <b>commander</b> is already unlocked: in the Alliance variant everyone flips theirs during setup and purges their Alliance promissory note."
          : "Your <b>commander</b> unlocks when you meet its printed condition — share it by giving away your Alliance promissory note." +
            (c.mode === "liberation" ? " Sol and the Xxcha are the exception: as allies they purged those notes and start with their commanders unlocked." : "")) +
        " Your <b>hero</b> unlocks at three scored objectives: a once-per-game blowout, then it’s purged. You also have <b>mechs</b>, heavy ground forces unique to your faction; some have a Deploy ability that puts them on the board without producing them.</p>" },
    { id: "pok-explore", when: (c) => c.has("pok"), h: "Exploration, relics and legendary planets",
      body: (c) => "<p>When you take control of a planet no other player controls, you <b>explore</b> it: draw from the deck matching its trait for commodities, units, attachments or <b>relic fragments</b> — three of a type buy a <b>relic</b>. Empty systems have frontier tokens, explored " + (TI.isTF(c) ? "only when a card lets you" : "with the Dark Energy Tap technology") + ". <b>Legendary</b> planets come with an ability card. The <b>wormhole nexus</b> sits beside the map but counts as part of the board, on its edge: it starts with only a gamma wormhole and opens to alpha and beta once someone moves or places a unit into it or gains control of Mallice.</p>" },
    /* ---- module-file teach inserts are placed here ---- */
    { id: "later", h: "Don’t worry about these until they come up",
      body: (c) => "<ul>" +
        "<li><b>Anomalies</b> — asteroid fields, supernovas, nebulas, gravity rifts: I’ll explain when one is in your way.</li>" +
        "<li><b>Unit abilities</b> — Sustain Damage, Anti-Fighter Barrage, Bombardment, Planetary Shield, Space Cannon — printed on your faction sheet.</li>" +
        "<li><b>Retreats, capacity, production limits and blockades</b> — in the reference.</li>" +
        (TI.isTF(c) ? "" : "<li><b>Technology prerequisites</b> — the colored symbols; you can exhaust a planet with a matching technology specialty to ignore one.</li>") +
        "<li><b>Card wording</b> — each action card" + (TI.isTF(c) ? "" : " and agenda") + " says when it’s played.</li>" +
        "<li><b>Elimination</b> — rare.</li>" +
        (c.has("pok") ? "<li><b>Capture, purge and deploy</b> — the cards that use them explain them.</li>" : "") +
        (c.mode === "firstgame" ? "<li><b>Promissory notes, choosing your secret objective and building your own galaxy</b> — next game.</li>" : "") +
        "</ul>" }
  ]
};

