/* =============================================================================
   A Game of Thrones: The Board Game (Second Edition) — Setup & Reference Utility · data
   Sources (the only sources): the Second Edition rulebook ("Rules", printed pages
   = PDF pages, p.1 is the cover), the Mother of Dragons rulebook ("MoD", printed
   pages = PDF pages) and the official Errata and FAQ version 2.0 ("FAQ", printed
   p.1–7). Precedence: FAQ v2.0 > Mother of Dragons (its own content and any base
   rule it changes) > Rules. FAQ errata are applied throughout.

   Context object c (built by GT.cfg.ctx, passed to every function below):
     c.has("core") / c.has("mod")   sets in play ("mod" = Mother of Dragons)
     c.p                            player count (3–6 base, 3–8 with Mother of Dragons)
     c.opt(id) (alias c.mod(id))    optional rules: "tob" Tides of Battle, "alt" Alternate House Card Set
     c.houses / c.house(id)         player Houses (fixed by count in the base game, chosen with MoD)
     c.vassals / c.vassal(id)       Mother of Dragons vassals (every unchosen House except Targaryen)
     c.targ                         House Targaryen is a player (MoD only)
   Mother of Dragons (MoD p.2–12; p.11 is an advertisement, p.12 is the unnumbered back-cover quick
   reference, cited as p.12) replaces the base setup and adds vassals, House Arryn, House Targaryen,
   the Essos board and the Iron Bank; "no modular content" (MoD p.3), so all of it is on when selected.
   ============================================================================= */
var GT = {};

GT.expMeta = {
  core: { name: "Base Game",          cls: "tag-core" },
  mod:  { name: "Mother of Dragons",  cls: "tag-mod" },
  faq:  { name: "FAQ v2.0",           cls: "tag-faq" },
  opt:  { name: "Optional",           cls: "tag-opt" },
  pc:   { name: "Player count",       cls: "tag-pc" }
};

GT.expansions = [
  { id: "core", short: "A Game of Thrones: The Board Game", year: "Second Edition", blurb: "The base game for three to six players: six Great Houses, the Westeros board, the Westeros and Wildling decks and the Tides of Battle module. Always in play." },
  { id: "mod",  short: "Mother of Dragons", year: "Expansion", blurb: "Houses Arryn and Targaryen, games of up to eight players, vassals for every House except Targaryen that no player chose, and, when someone plays Targaryen, the Essos side board and the Iron Bank of Braavos." }
];

/* The Houses. Mottos as printed on Rules p.6; Arryn and Targaryen come with Mother of Dragons (MoD p.3). */
GT.houses = [
  { id: "stark",     name: "Stark",     motto: "Winter is Coming",          set: "core" },
  { id: "lannister", name: "Lannister", motto: "Hear Me Roar",              set: "core" },
  { id: "baratheon", name: "Baratheon", motto: "Ours is the Fury",          set: "core" },
  { id: "greyjoy",   name: "Greyjoy",   motto: "We Do Not Sow",             set: "core" },
  { id: "tyrell",    name: "Tyrell",    motto: "Growing Strong",            set: "core" },
  { id: "martell",   name: "Martell",   motto: "Unbowed, Unbent, Unbroken", set: "core" },
  { id: "arryn",     name: "Arryn",     set: "mod" },
  { id: "targaryen", name: "Targaryen", set: "mod" }
];
GT.houseName = (id) => { const h = GT.houses.find(x => x.id === id); return h ? h.name : id; };
GT.list = (arr) => arr.length <= 1 ? arr.join("") : arr.slice(0, -1).join(", ") + " and " + arr[arr.length - 1];
GT.names = (ids) => GT.list(ids.map(GT.houseName));

/* Rulebook icons (icons standard v1, css/icons.css): images/icons/<name>.webp, cropped from the rulebooks.
   Each call names its file literally, e.g. GT.ici("supply", "Supply icon"). Icons sit beside their words,
   never in the teaching script. ici = inline (kept on one line with the word that follows it);
   icl = one item of a ul.aid-icons list; icr = one name of a p.aid-icon-row. */
GT.icImg = (name, alt, cls) => "<img class=\"" + cls + "\" src=\"images/icons/" + name + ".webp\" alt=\"" + alt.replace(/"/g, "&quot;") + "\">";
GT.ici = (name, alt, word) => "<span class='ic-nb'>" + GT.icImg(name, alt, "aid-ic aid-ic-inline") + (word ? " " + word : "") + "</span>";
GT.icl = (name, alt, html) => "<li>" + GT.icImg(name, alt, "aid-ic") + "<span>" + html + "</span></li>";
GT.icr = (name, alt, label) => "<span class='aid-pair'>" + GT.icImg(name, alt, "aid-ic") + "<span>" + label + "</span></span>";

/* Base game: the Houses that may be chosen at each player count (Rules p.28). */
GT.baseHouses = {
  3: ["stark", "lannister", "baratheon"],
  4: ["stark", "lannister", "baratheon", "greyjoy"],
  5: ["stark", "lannister", "baratheon", "greyjoy", "tyrell"],
  6: ["stark", "lannister", "baratheon", "greyjoy", "tyrell", "martell"]
};
GT.baseExcluded = { 3: ["martell", "tyrell", "greyjoy"], 4: ["martell", "tyrell"], 5: ["martell"], 6: [] };

/* Influence tracks after the leftward slide, as pictured in the Rules p.28 setup diagrams.
   (With six players the positions are those printed on each player screen.) */
GT.influence = {
  3: { it: ["baratheon", "lannister", "stark"], f: ["stark", "baratheon", "lannister"], kc: ["lannister", "stark", "baratheon"] },
  4: { it: ["baratheon", "lannister", "stark", "greyjoy"], f: ["greyjoy", "stark", "baratheon", "lannister"], kc: ["lannister", "stark", "baratheon", "greyjoy"] },
  5: { it: ["baratheon", "lannister", "stark", "greyjoy", "tyrell"], f: ["greyjoy", "tyrell", "stark", "baratheon", "lannister"], kc: ["lannister", "stark", "baratheon", "tyrell", "greyjoy"] }
};

/* Stars (Special Order tokens allowed) on the King's Court track: the printed track and the
   3–4 player overlay (Rules p.11–12, p.22; star counts read from the p.28 diagrams). */
GT.kcStars = { board: [3, 3, 2, 1, 0, 0], overlay: [3, 2, 1, 0] };

/* Neutral Force tokens: the area named on each token, the player range on its 4–6 side and the
   strength on each side (Rules p.4, p.26, p.28 diagrams; "~" = insurmountable, Rules p.26). */
GT.neutral = [
  { area: "King's Landing",  range: "4-6", s: 5, s3: "5" },
  { area: "The Eyrie",       range: "4-6", s: 6, s3: "6" },
  { area: "The Boneway",     range: "4-5", s: 3, s3: "~" },
  { area: "Yronwood",        range: "4-5", s: 3, s3: "~" },
  { area: "Three Towers",    range: "4-5", s: 3, s3: "~" },
  { area: "Sunspear",        range: "4-5", s: 5, s3: "~" },
  { area: "Prince's Pass",   range: "4-5", s: 3, s3: "~" },
  { area: "Starfall",        range: "4-5", s: 3, s3: "~" },
  { area: "Salt Shore",      range: "4-5", s: 3, s3: "~" },
  { area: "Storm's End",     range: "4",   s: 4, s3: "~" },
  { area: "Dornish Marches", range: "4",   s: 3, s3: "~" },
  { area: "Oldtown",         range: "4",   s: 3, s3: "~" },
  { area: "Pyke",            range: null,  s3: "~" },
  { area: "Highgarden",      range: null,  s3: "~" }
];
GT.neutralFor = (p) => GT.neutral.filter(t => {
  if (p === 3) return true;
  if (!t.range) return false;
  const [lo, hi] = t.range.split("-").map(Number);
  return p >= lo && p <= (hi || lo);
});

/* Supply track: the armies each Supply position allows (Rules p.8 illustration). */
GT.supplyTrack = [[2, 2], [3, 2], [3, 2, 2], [3, 2, 2, 2], [3, 3, 2, 2], [4, 3, 2, 2], [4, 3, 2, 2, 2]];

/* ---- Mother of Dragons ------------------------------------------------------ */
/* Influence order for every Mother of Dragons game, whatever the player count (MoD p.4 picture and
   the p.12 "Influence Track Setup" quick reference, read at 300 dpi). Space 8 is Targaryen's (MoD p.8). */
GT.modInfluence = {
  it: ["baratheon", "lannister", "stark", "martell", "greyjoy", "tyrell", "arryn"],
  f:  ["greyjoy", "tyrell", "martell", "arryn", "stark", "baratheon", "lannister"],
  kc: ["lannister", "stark", "martell", "tyrell", "arryn", "baratheon", "greyjoy"]
};
/* King's Court stars on the printed track plus the influence track extension, positions 1–8
   (MoD p.3, p.4, p.12 pictures; "space 8 ... has three stars", MoD p.8). */
GT.modKcStars = [3, 3, 2, 1, 0, 0, 0, 3];
GT.trackName = { it: "Iron Throne", f: "Fiefdoms", kc: "King's Court" };
GT.dominanceName = { it: "Iron Throne", f: "Valyrian Steel Blade", kc: "Messenger Raven" };
GT.starSpan = (n) => " <span class='stars'>" + (n ? "★".repeat(n) : "no ★") + "</span>";

/* Setup step 9 (MoD p.4): if a vassal sits in any of the top three spaces of a track, every vassal on that
   track is removed, the players slide forward and the vassals refill the end of the track (before
   Targaryen's space 8) in their original order. All seven non-Targaryen Houses are always on the tracks. */
GT.modTrack = (key, c) => {
  const base = GT.modInfluence[key];
  const moved = base.slice(0, 3).some(h => c.vassal(h));
  const list = moved ? base.filter(h => c.house(h)).concat(base.filter(h => c.vassal(h))) : base.slice();
  return { list: list, moved: moved };
};
GT.modTrackList = (key, c) => {
  const items = GT.modTrack(key, c).list.map((h, i) => "<li><b>" + GT.houseName(h) + "</b>" +
    (c.vassal(h) ? " <span class='muted'>(vassal)</span>" : "") + (key === "kc" ? GT.starSpan(GT.modKcStars[i]) : "") + "</li>");
  items.push(c.targ ? "<li><b>Targaryen</b> <span class='muted'>(fixed)</span>" + (key === "kc" ? GT.starSpan(3) : "") + "</li>"
                    : "<li><span class='muted'>empty — Targaryen is not in the game</span></li>");
  return "<ol class='track'>" + items.join("") + "</ol>";
};
/* Setup step 10: the highest player House on each track takes its Dominance token (vassals never do, MoD p.6). */
GT.modDominance = (key, c) => GT.modTrack(key, c).list.find(h => c.house(h));
/* Setup step 11 (MoD p.4): one set of vassal order tokens per vassal, each to the highest player on the Iron
   Throne track without a set; with three players the fourth set goes to the top player. Targaryen holds space 8. */
GT.vassalSets = (c) => {
  const players = GT.modTrack("it", c).list.filter(h => c.house(h)).concat(c.targ ? ["targaryen"] : []);
  return c.vassals.map((v, i) => players[i] || players[0]);
};
/* Vassal setup cards printed in the rulebook (the other five are only on the cards themselves). */
GT.vassalCards = {
  baratheon: { units: ["1 Ship in Blackwater Bay", "2 Ships in Shipbreaker Bay", "2 Knights in Dragonstone", "1 Footman in The Kingswood", "1 Footman in Storm's End"], src: "MoD p.2" },
  martell:   { units: ["1 Ship in Sea of Dorne", "2 Ships in East Summer Sea", "1 Footman in Salt Shore", "1 Footman in Sunspear", "1 Knight and 1 Footman in Yronwood", "1 Footman in Starfall"], src: "MoD p.4" }
};
/* The four vassal order tokens in each set (MoD p.6). */
GT.vassalOrders = [
  "<b>March +0</b> — works exactly like a player's March order, except that a vassal can't march into a <b>port</b>, nor into an area controlled by its <b>commander</b> or by its commander's other vassals.",
  "<b>Raid/Support +1</b> — both a Raid and a Support order. When the vassal's raid comes up, the commander chooses whether to resolve it as a raid (the token is then removed as normal); if not, it stays on the board as a support order. The commander decides whom the vassal supports each time it can. A commander and his vassals can't raid each other.",
  "<b>Defense +1/Muster</b> — a normal Defense order (+1 to combat in its area) <i>and</i> a <b>Muster</b> order: in the Resolve Consolidate Power Orders step the vassal may muster in that area under the normal mustering rules, exactly like a Special Consolidate Power order. The stronghold pictured on the token doesn't give the area a stronghold. In a port it has no effect. Being a Defense order, only a <b>Special Raid</b> (★) can remove it.",
  "<b>Defense +3</b> — a normal Defense order: +3 combat strength in its area."
];
/* The same four tokens with their MoD p.6 pictures (ul.aid-icons). */
GT.vassalOrderList = () => "<ul class='aid-icons'>" +
  GT.icl("vassal-march", "Vassal March +0 order token", GT.vassalOrders[0]) +
  GT.icl("vassal-raid-support", "Vassal Raid/Support +1 order token", GT.vassalOrders[1]) +
  GT.icl("vassal-defense-muster", "Vassal Defense +1/Muster order token", GT.vassalOrders[2]) +
  GT.icl("vassal-defense-3", "Vassal Defense +3 order token", GT.vassalOrders[3]) + "</ul>";
/* Loan effects (MoD p.12 quick reference). */
GT.loans = [
  ["Master-at-Arms", "Choose any two areas that contain a castle. Improve those castles to strongholds."],
  ["Savvy Steward", "Choose any land area and place a supply improvement there. Then, move up one position on the supply track."],
  ["Expert Artificer", "Choose any land area and place a power improvement there. Then, gain 8 power tokens."],
  ["Customs Officer", "Gain 10 power tokens."],
  ["The Faceless Men", "Destroy one Knight in any one area and one Footman in any one other area. The units may belong to any player or vassal."],
  ["Pyromancer", "Choose any area that contains a castle and degrade it. Then place either a power improvement or a supply improvement in that area."],
  ["Spymaster", "Draw the top two cards of any one Westeros deck. After secretly reading them, put any number of them on the bottom of the deck in any order and the rest on top of the deck in any order."],
  ["Loyal Maester", "Choose any two land areas and place one supply improvement on each."],
  ["Full Host, Vanguard Cavalry, Siege Engineers and Sea Raiders", "Place the units shown on the card in areas you control or already have units (obeying supply). Ship units shown may also be placed at ports you control."]
];

GT.options = [
  { id: "tob", name: "Tides of Battle", summary: "A small deck adds a random strength bonus, extra swords or fortifications, and deadly skulls to every combat",
    description: "Optional module: all players agree before the game. Each combatant draws a Tides of Battle card after House cards are revealed.", src: "Rules p.29 · FAQ p.1" },
  { id: "alt", requires: "mod", name: "Alternate House Card Set", summary: "Play Mother of Dragons with House cards that follow the later books (needs A Feast for Crows and A Dance With Dragons)",
    description: "Agreed by the group; replaces the base House cards with those of A Dance With Dragons, Arryn's with A Feast for Crows' and uses Targaryen's \"B\" deck. May contain plot spoilers.", src: "MoD p.4" }
];

/* =============================================================================
   CONFIGURATION — pure functions shared by app.js and the Node harness
   state = { sets: Set, players: n, houses: [ids in order picked], opts: Set }
   ============================================================================= */
GT.cfg = {
  houseOrder: ["stark", "lannister", "baratheon", "greyjoy", "tyrell", "martell", "arryn", "targaryen"],
  playerRange: (sets) => [3, sets.has("mod") ? 8 : 6],
  /* Mother of Dragons: any of the eight Houses with four or more players; no Targaryen with three (MoD p.3, p.7) */
  houseAllowed: (id, sets, p) => {
    if (!sets.has("mod")) return (GT.baseHouses[p] || []).includes(id);
    if (id === "targaryen") return p >= 4;
    return true;
  },
  normalize(state) {
    state.sets.add("core");
    const [lo, hi] = GT.cfg.playerRange(state.sets);
    if (state.players < lo) state.players = lo;
    if (state.players > hi) state.players = hi;
    for (const o of GT.options) if (o.requires && state.opts.has(o.id) && !state.sets.has(o.requires)) state.opts.delete(o.id);
    const p = state.players;
    if (!state.sets.has("mod")) { state.houses = GT.baseHouses[p].slice(); return state; }
    let hs = (state.houses || []).filter((h, i, a) => GT.cfg.houseOrder.includes(h) && a.indexOf(h) === i && GT.cfg.houseAllowed(h, state.sets, p));
    if (hs.length > p) hs = hs.slice(0, p);
    for (const h of GT.cfg.houseOrder) {
      if (hs.length >= p) break;
      if (!hs.includes(h) && GT.cfg.houseAllowed(h, state.sets, p)) hs.push(h);
    }
    state.houses = hs;
    return state;
  },
  /* Mother of Dragons picker: a House joins or leaves the table and the player count follows.
     At least three Houses; Targaryen only with four or more (MoD p.3, p.7); at most eight. */
  canToggleHouse(state, id) {
    if (!state.sets.has("mod")) return false;
    const hs = state.houses, on = hs.includes(id);
    if (!on) return hs.length < 8;
    const min = (hs.includes("targaryen") && id !== "targaryen") ? 4 : 3;
    return hs.length - 1 >= min;
  },
  toggleHouse(state, id) {
    if (!GT.cfg.canToggleHouse(state, id)) return state;
    state.houses = state.houses.includes(id) ? state.houses.filter(h => h !== id) : state.houses.concat([id]);
    state.players = state.houses.length;
    return state;
  },
  ctx(state) {
    const sets = new Set(state.sets), opts = new Set(state.opts), p = state.players;
    const houses = GT.cfg.houseOrder.filter(h => state.houses.includes(h));
    const mod = sets.has("mod");
    const vassals = mod ? GT.cfg.houseOrder.filter(h => h !== "targaryen" && !houses.includes(h)) : [];
    return {
      has: (id) => sets.has(id),
      p: p,
      opt: (id) => opts.has(id),
      mod: (id) => opts.has(id),
      houses: houses,
      house: (id) => houses.includes(id),
      vassals: vassals,
      vassal: (id) => vassals.includes(id),
      targ: houses.includes("targaryen")
    };
  }
};

/* Configurator copy (also dumped by the harness) */
GT.ui = {
  playersHint: (c) => c.has("mod") ? "(3–8 with Mother of Dragons)" : "(3–6; seven and eight need Mother of Dragons)",
  playerTitle: (i, c) => i > 6 && !c.has("mod") ? "Seven and eight players need Mother of Dragons (MoD p.3)" : "",
  housesHint: (c) => c.has("mod")
    ? "— tap the Houses the players chose; the player count follows. Every House no one picks, except Targaryen, becomes a vassal (MoD p.3)"
    : "— fixed by the player count (Rules p.28)",
  houseState: (id, c) => {
    if (c.house(id)) return "Player";
    if (c.vassal(id)) return "Vassal";
    return c.has("mod") ? "Not in the game" : "Not used";
  },
  houseTitle: (id, c) => {
    if (!c.has("mod")) return c.house(id) ? "In play with " + c.p + " players" : "Not chosen as a player House with " + c.p + " players (Rules p.28)";
    if (c.house(id)) {
      if (c.p === 3) return "A player House. A game needs at least three players";
      if (c.targ && id !== "targaryen" && c.p === 4) return "A player House. Targaryen needs four or more players (MoD p.3, p.7)";
      return "A player House — tap to remove it from the table";
    }
    if (c.vassal(id)) return "No player chose this House: it becomes a vassal (MoD p.3, p.5). Tap to give it a player";
    if (id === "targaryen") return "If no player picks Targaryen it does not become a vassal and takes no part (MoD p.3). Playable with four or more players (MoD p.7)";
    return "Tap to give this House a player";
  },
  vassalNote: (c) => !c.has("mod") ? "" :
    (c.vassals.length ? "Vassals this game: <b>" + GT.names(c.vassals) + "</b>." : "No vassals: " + (c.targ ? "all eight Houses have a player." : "every House except Targaryen has a player.")) +
    (c.targ ? "" : " Targaryen is not in the game (no player chose it).")
};

/* =============================================================================
   SETUP PHASES — each phase and step has when(c); steps cite printed pages
   ============================================================================= */
GT.trackList = (ids, stars) => "<ol class='track'>" + ids.map((h, i) => "<li><b>" + GT.houseName(h) + "</b>" + (stars ? " <span class='stars'>" + (stars[i] ? "★".repeat(stars[i]) : "no ★") + "</span>" : "") + "</li>").join("") + "</ol>";

GT.phases = [
  {
    title: "Board, Decks & Neutral Forces",
    when: (c) => !c.has("mod"),
    steps: [
      { when: () => true, exp: "core",
        t: "Prepare the game board",
        d: "<ul><li>Unfold the game board and place it in the center of the play area.</li>" +
           "<li>Its tracks: the <b>Wildlings track</b> and Wildling deck space (top), the three <b>Influence tracks</b>, the <b>Supply track</b>, the <b>Round track</b> and the <b>Victory track</b> (Setup Diagram).</li></ul>",
        src: "Rules p.4–5" },
      { when: () => true, exp: "core",
        t: "Wildling deck & Wildling Threat token",
        d: "<ul><li>Shuffle the <b>9 Wildling cards</b> into a deck and place it on its space at the top of the board.</li>" +
           "<li>Place the <b>Wildling Threat token</b> on the <b>2</b> position of the Wildlings track (its positions read 0, 2, 4, 6, 8, 10, 12).</li></ul>",
        src: "Rules p.2, p.4–5" },
      { when: () => true, exp: "core",
        t: "Westeros decks I, II and III",
        d: "<ul><li>Separate the <b>30 Westeros cards</b> into three decks by the Roman numeral on them (I, II or III).</li>" +
           "<li>Shuffle each deck and place the three decks separately, facedown, next to the board.</li></ul>",
        src: "Rules p.2, p.4, p.7" },
      { when: () => true, exp: "pc",
        t: (c) => "Neutral Force tokens — " + c.p + " players",
        d: (c) => {
          const toks = GT.neutralFor(c.p);
          let d = "<ul><li>Every Neutral Force token is double-sided: the side marked <b>3</b> is used only with three players; the other side shows the player range it is used with (<b>4-6</b>, <b>4-5</b> or <b>4</b>). Find the range in the token's lower-left corner:" +
            "<p class='aid-icon-row nf-range'>" + GT.icr("neutral-3", "Neutral Force token, side used only with three players", "“3”: three players only") +
            GT.icr("neutral-4-5", "Neutral Force token, side used with four or five players", "“4-5”: four or five players") + "</p></li>";
          if (c.p === 6) d += "<li><b>Six players:</b> place only the tokens whose range includes 6 — the two <b>4-6</b> tokens: <b>King's Landing</b> (strength 5) and <b>The Eyrie</b> (strength 6).</li>";
          else if (c.p === 3) {
            d += "<li><b>Three players:</b> place all <b>14</b> tokens, <b>3</b> side up:<ul>" +
              "<li><b>King's Landing</b> (strength 5) and <b>The Eyrie</b> (strength 6);</li>" +
              "<li><b>~ (insurmountable)</b>: " + toks.filter(t => t.s3 === "~").map(t => t.area).join(", ") + ". These areas can't be entered by anyone for the whole game.</li></ul></li>";
          } else {
            d += "<li><b>" + (c.p === 5 ? "Five" : "Four") + " players:</b> place the <b>" + toks.length + "</b> tokens marked " + (c.p === 5 ? "<b>4-6</b> and <b>4-5</b>" : "<b>4-6</b>, <b>4-5</b> and <b>4</b>") + ", range side up:<ul>" +
              toks.map(t => "<li>" + t.area + " — strength <b>" + t.s + "</b> <span class='muted'>(" + t.range + ")</span></li>").join("") + "</ul></li>";
          }
          d += "<li>Put each token on the area named on it, and return every unused token to the box.</li></ul>" +
            "<p class='inline-note'>Token names and strengths as pictured in the rulebook's p.28 setup diagrams.</p>";
          return d;
        },
        src: (c) => c.p === 3 ? "Rules p.4, p.26, p.28" : "Rules p.4, p.28" },
      { when: () => true, exp: "core",
        t: "Game Round marker",
        d: "<ul><li>Place the Game Round marker on the <b>1</b> position of the Round track. The game lasts <b>10 rounds</b>.</li></ul>",
        src: "Rules p.4, p.7" }
    ]
  },
  {
    title: "Houses & Starting Forces",
    when: (c) => !c.has("mod"),
    steps: [
      { when: () => true, exp: "pc",
        t: "Determine player Houses",
        d: (c) => "<ul><li>Each player selects the House he will control — or determine Houses at random.</li>" +
          "<li><b>" + c.p + " players:</b> the Houses in play are <b>" + GT.names(c.houses) + "</b>.</li>" +
          (c.p < 6 ? "<li>Not eligible with " + c.p + " players: " + GT.names(GT.baseExcluded[c.p]) + ".</li>" : "<li>With six players every House is played.</li>") + "</ul>",
        src: (c) => c.p < 6 ? "Rules p.4, p.28" : "Rules p.2, p.4" },
      { when: () => true, exp: "core",
        t: "Gather House materials",
        d: (c) => "<ul><li>Each player takes his House's <b>player screen, 7 House cards, 15 Order tokens, 1 Supply token, 3 Influence tokens, 1 Victory Point token, 1 Garrison token</b> and <b>all plastic units of his color</b> — not the Power tokens yet.</li>" +
          "<li>Units per House: <b>10 Footmen, 5 Knights, 6 Ships, 2 Siege Engines</b>.</li>" +
          "<li>Order tokens per House: <b>10 regular</b> (2 March: −1 and +0; 2 Defense +1; 2 Support; 2 Raid; 2 Consolidate Power) and <b>5 Special</b> (one of each type, marked with a star). Keep unused Order tokens behind your screen.</li>" +
          "<li><b>Component limit:</b> when all your components of a type are in use, you can't bring more into play. Units destroyed or removed from the board return to your available units and can be mustered again.</li>" +
          (c.p < 6 ? "<li>The materials of " + GT.names(GT.baseExcluded[c.p]) + " stay in the box (crossed out in the p.28 diagrams).</li>" : "") + "</ul>",
        src: (c) => "Rules p.2, p.4, p.12–13, p.22, p.27" + (c.p < 6 ? ", p.28" : "") },
      { when: () => true, exp: "core",
        t: "Victory & Supply tokens",
        d: "<ul><li>Each player places his <b>Victory</b> and <b>Supply</b> tokens on those tracks as instructed by his player screen.</li>" +
           "<li>Unlike the Influence tracks, several Houses may share a position on the Victory and Supply tracks.</li></ul>",
        src: "Rules p.4, p.6" },
      { when: () => true, exp: "pc",
        t: (c) => c.p === 6 ? "Influence tracks & Dominance tokens" : "Influence tracks & Dominance tokens — slid left for " + c.p + " players",
        d: (c) => {
          if (c.p === 6) return "<ul><li>Each player places his three Influence tokens on the <b>Iron Throne</b>, <b>Fiefdoms</b> and <b>King's Court</b> tracks at the positions printed on his player screen.</li>" +
            "<li>The House in position <b>1</b> of each track claims that track's Dominance token: Iron Throne track → the <b>Iron Throne</b>; Fiefdoms → the <b>Valyrian Steel Blade</b>; King's Court → the <b>Messenger Raven</b>.</li>" +
            "<li>No King's Court Overlay with six players.</li></ul>";
          const inf = GT.influence[c.p];
          return "<ul><li>Place the Influence tokens as the player screens show, then <b>slide every token left</b> (towards position 1) to fill each empty position. The highest-numbered positions stay empty and unused. The result:</li></ul>" +
            "<div class='tracks'><div><h5>Iron Throne</h5>" + GT.trackList(inf.it) + "</div><div><h5>Fiefdoms</h5>" + GT.trackList(inf.f) + "</div><div><h5>King's Court</h5>" + GT.trackList(inf.kc, c.p <= 4 ? GT.kcStars.overlay : GT.kcStars.board) + "</div></div>" +
            "<ul><li>Position 1 of each track claims its Dominance token: <b>" + GT.houseName(inf.it[0]) + "</b> takes the <b>Iron Throne</b>, <b>" + GT.houseName(inf.f[0]) + "</b> the <b>Valyrian Steel Blade</b>, <b>" + GT.houseName(inf.kc[0]) + "</b> the <b>Messenger Raven</b>.</li>" +
            (c.p === 5 ? "<li>No King's Court Overlay with five players.</li>" : "") + "</ul>";
        },
        src: (c) => c.p === 6 ? "Rules p.4, p.6, p.11" : "Rules p.4–5, p.11, p.28" },
      { when: (c) => c.p <= 4, exp: "pc",
        t: "King's Court Overlay",
        d: "<ul><li>Place the <b>King's Court Overlay</b> on the King's Court Influence track, covering its first four positions.</li>" +
           "<li>It changes the stars — the Special Order tokens each position may use: position 1 <b>★★★</b>, 2 <b>★★</b>, 3 <b>★</b>, 4 none.</li></ul>",
        src: "Rules p.3, p.11, p.28" },
      { when: () => true, exp: "core",
        t: "Starting units",
        d: (c) => "<ul><li>Each player places all of his starting units on the board as listed — and mapped — on his player screen.</li>" +
          "<li><b>Errata — House Lannister's screen</b> now reads: 1 Ship in <b>The Golden Sound</b>; 1 Ship in the <b>port at Lannisport</b>; 1 Knight and 1 Footman in <b>Lannisport</b>; 1 Footman in <b>Stoney Sept</b>.</li></ul>",
        src: "Rules p.4, p.6 · FAQ p.1" },
      { when: () => true, exp: "core",
        t: "Garrison tokens",
        d: "<ul><li>Each player places his <b>Garrison token</b> on his home area — the area named on the token (a home area carries its House's printed shield; Winterfell is House Stark's).</li>" +
           "<li>A Garrison is not a unit: it never takes an order and doesn't count for supply. Its printed strength defends its home area.</li></ul>",
        src: "Rules p.4, p.6, p.26" },
      { when: () => true, exp: "core",
        t: "Power tokens & the Power Pool",
        d: "<ul><li>Put the Power tokens of every House in one central pile: the <b>Power Pool</b>.</li>" +
           "<li>Each player takes <b>5 Power tokens</b> of his House from the Pool: his <b>available power</b>.</li>" +
           "<li>Available power stays visible in front of your screen, except while bidding.</li></ul>",
        src: "Rules p.4, p.6, p.27" }
    ]
  },
  /* ---- Mother of Dragons replaces the base setup (MoD p.3: "replace all of the setup instructions found on
          page 4 of the ... rulebook with the setup instructions presented here"). Steps 1–15 of MoD p.3–5. ---- */
  {
    title: "Mother of Dragons Setup — Houses, Board & Decks",
    when: (c) => c.has("mod"),
    steps: [
      { when: () => true, exp: "mod",
        t: "Determine player and vassal Houses",
        d: (c) => "<ul><li>Choose a player at random. Starting with him and going clockwise, each player selects the House he will play.</li>" +
          "<li>With <b>four or more</b> players, any of the eight Houses may be chosen: Stark, Lannister, Greyjoy, Tyrell, Baratheon, Martell, Arryn or Targaryen. <b>With three players, House Targaryen is not available.</b></li>" +
          "<li>Every House <b>except Targaryen</b> that no player chose becomes a neutral House called a <b>vassal</b>.</li>" +
          "<li><b>This game — " + c.p + " players:</b> " + GT.names(c.houses) + ". <b>Vassals:</b> " + (c.vassals.length ? GT.names(c.vassals) + " (" + c.vassals.length + ")" : "none — " + (c.targ ? "all eight Houses have a player" : "every House but Targaryen has a player")) + ".</li>" +
          (c.targ ? "" : "<li><b>No Targaryen player:</b> Targaryen doesn't become a vassal and takes no part in the game. Return all House Targaryen materials to the box.</li>") + "</ul>",
        src: "MoD p.3, p.5, p.7" },
      { when: () => true, exp: "mod",
        t: "Gather House materials",
        d: (c) => "<ul><li>Each player takes his House's <b>1 player screen, 7 House cards, 15 Order tokens, 3 sea order tokens, 1 Supply token, 3 Influence tokens, 1 Victory Point token, 1 Garrison token</b> and <b>all plastic units of his color</b>. Don't take any Power tokens yet.</li>" +
          (c.opt("alt") ? "<li><b>Alternate House Card Set:</b> instead of the base game's House cards, each player takes his House's House cards from <i>A Dance With Dragons</i>; House Arryn takes the Arryn House card from <i>A Feast for Crows</i> instead of this expansion's Arryn House cards.</li>" : "") +
          (c.targ ? "<li><b>House Targaryen</b> also takes its <b>20 loyalty tokens</b> and " + (c.opt("alt") ? "its House card deck marked <b>“B”</b> (Alternate House Card Set — not the 7 cards marked “A”)" : "the <b>7 House cards marked “A”</b>") + ".</li>" +
                    "<li>Targaryen has three <b>Dragons</b> and no Siege Engines.</li>" +
                    "<li>Targaryen's place on the Influence tracks is space 8, shown with its dragon on the influence track extension. The expansion's component list has only 3 Influence tokens (House Arryn's), so Targaryen has none to place.</li>" : "") +
          "<li><b>Component limit:</b> when all your components of a type are in use, you can't bring more into play. Units destroyed or removed from the board return to your available units" + (c.targ ? " (except Dragons: a destroyed Dragon is permanently removed and can't be mustered or brought back, outside of certain card abilities)" : "") + ".</li></ul>",
        src: (c) => "MoD " + (c.targ ? "p.2–3" : "p.3") + (c.opt("alt") ? ", p.4" : "") + (c.targ ? ", p.8 · FAQ p.6" : "") + " · Rules p.4" },
      { when: () => true, exp: "mod",
        t: "Prepare the game board",
        d: (c) => "<ul><li>Unfold the game board and place it in the center of the play area.</li>" +
          "<li>Place <b>The Eyrie overlay</b> and <b>The Bite overlay</b> on the board, as pictured on MoD p.3.</li>" +
          "<li>Place the <b>influence track extension</b> next to the board, so it continues all three Influence tracks with spaces <b>7</b> and <b>8</b>.</li>" +
          (c.targ ? "<li><b>House Targaryen:</b> place the <b>Essos side board</b> against the right side of the main board, with the bottoms of both boards flush and aligned.</li>"
                  : "<li><b>No Targaryen:</b> return the Essos side board and the rest of the Targaryen and Iron Bank components (such as the loan cards and the Braavos neutral force token) to the box. Each House keeps its <b>Iron Bank sea order token</b>: without the Essos board it is played as a blank (no effect) sea order (FAQ p.6).</li>") + "</ul>",
        src: (c) => "MoD p.3, p.5" + (c.targ ? "" : " · FAQ p.6") },
      { when: (c) => c.vassals.length > 0, exp: "mod",
        t: "Gather vassal materials",
        d: (c) => "<ul><li>For each vassal — <b>" + GT.names(c.vassals) + "</b> — gather <b>1 vassal setup card, 1 Supply token, 3 Influence tokens, 1 Garrison token</b> and <b>all plastic units in its color</b>.</li>" +
          "<li>Each vassal's Victory Point token becomes its <b>vassal marker</b> (step 11).</li></ul>",
        src: "MoD p.4" },
      { when: () => true, exp: "mod",
        t: "Wildling deck & Wildling Threat token",
        d: "<ul><li>Shuffle the Wildling cards into a deck and place it on its space at the top of the board.</li>" +
           "<li>Place the <b>Wildling Threat token</b> on the <b>2</b> position of the Wildlings track.</li></ul>",
        src: "MoD p.4" },
      { when: () => true, exp: "mod",
        t: (c) => c.targ ? "Westeros decks I, II, III and IV" : "Westeros decks I, II and III",
        d: (c) => "<ul><li>Separate the Westeros cards into decks by their Roman numeral (I, II and III). Shuffle each deck and place them separately, facedown, next to the board.</li>" +
          (c.targ ? "<li><b>House Targaryen:</b> also shuffle the <b>10 Westeros cards labeled “IV”</b> and place that deck facedown next to the Westeros III deck.</li>"
                  : "<li>No Targaryen: the Westeros IV deck stays in the box.</li>") + "</ul>",
        src: "MoD p.2, p.4" },
      { when: () => true, exp: "mod",
        t: "Round track markers",
        d: (c) => "<ul><li>Place the Game Round marker on the <b>1</b> position of the Round track.</li>" +
          (c.targ ? "<li><b>House Targaryen:</b> place one <b>dragon strength token</b> on each of spaces <b>2, 4, 6, 8</b> and <b>10</b> of the Round track (5 tokens).</li>" : "") + "</ul>",
        src: "MoD p.4" }
    ]
  },
  {
    title: "Mother of Dragons Setup — Tracks, Forces & Power",
    when: (c) => c.has("mod"),
    steps: [
      { when: () => true, exp: "mod",
        t: "Victory & Supply tokens",
        d: (c) => "<ul><li>Place each player House's Victory and Supply tokens as instructed on the <b>back of its player screen</b>.</li>" +
          (c.targ ? "<li><b>Targaryen</b> begins with its Victory token on space <b>1</b>: the point for controlling <b>Pentos</b>, its home area.</li>" : "") +
          (c.vassals.length ? "<li><b>Vassals:</b> place each vassal's Supply token on space <b>4</b> of the Supply track, however many areas it controls (" + GT.names(c.vassals) + ").</li>" : "") +
          "<li>Several Houses may share a position on the Victory and Supply tracks.</li></ul>",
        src: (c) => "MoD p.4" + (c.targ ? ", p.7" : "") + " · Rules p.4, p.6" },
      { when: () => true, exp: "mod",
        t: "Place and adjust Influence tokens",
        d: (c) => {
          const tr = ["it", "f", "kc"].map(k => ({ k: k, t: GT.modTrack(k, c) }));
          let d = "<ul><li>Place every House's Influence tokens in the <b>fixed order</b> below, whatever the player count. Ignore the order printed on the player screens.<ul>" +
            ["it", "f", "kc"].map(k => "<li><b>" + GT.trackName[k] + ":</b> " + GT.modInfluence[k].map(GT.houseName).join(", ") + "; space 8 is Targaryen's.</li>").join("") + "</ul></li>";
          if (c.vassals.length) {
            const moved = tr.filter(x => x.t.moved).map(x => GT.trackName[x.k]), kept = tr.filter(x => !x.t.moved).map(x => GT.trackName[x.k]);
            d += "<li>Then, on any track where a <b>vassal</b> sits in one of the <b>top three spaces</b>, remove <b>all</b> vassals from that track and slide the player tokens forward. Fill the empty spaces at the end of the track with the removed vassals, keeping their order.</li>" +
              "<li><b>This game:</b> " + (moved.length ? "vassals move down on the " + GT.list(moved) + " track" + (moved.length > 1 ? "s" : "") : "no track has a vassal in its top three") + (kept.length && moved.length ? "; the " + GT.list(kept) + " track" + (kept.length > 1 ? "s stay" : " stays") + " as printed" : "") + ".</li>";
          } else d += "<li>No vassals this game, so the printed order stands.</li>";
          d += "<li>Space <b>8</b> of every track belongs to House Targaryen for the whole game" + (c.targ ? "" : " (empty this game)") + ".</li></ul>" +
            "<div class='tracks'>" + ["it", "f", "kc"].map(k => "<div><h5>" + GT.trackName[k] + "</h5>" + GT.modTrackList(k, c) + "</div>").join("") + "</div>" +
            "<ul><li><b>No King's Court Overlay.</b> The FAQ rules it out whenever vassals play, at any player count. (Games without vassals have seven or eight players.)</li></ul>";
          return d;
        },
        src: "MoD p.4, p.8, p.12 · FAQ p.6" },
      { when: () => true, exp: "mod",
        t: "Claim Dominance tokens",
        d: (c) => "<ul><li>The House in the highest position on each track claims that track's Dominance token: <b>" + GT.houseName(GT.modDominance("it", c)) + "</b> takes the <b>Iron Throne</b>, <b>" +
          GT.houseName(GT.modDominance("f", c)) + "</b> the <b>Valyrian Steel Blade</b> and <b>" + GT.houseName(GT.modDominance("kc", c)) + "</b> the <b>Messenger Raven</b>.</li>" +
          (c.vassals.length ? "<li>Vassals never hold Dominance tokens. If a vassal is ever highest on a track, the player House in the next-highest position takes that token instead.</li>" : "") + "</ul>",
        src: (c) => "MoD p.4" + (c.vassals.length ? ", p.6" : "") },
      { when: (c) => c.vassals.length > 0, exp: "mod",
        t: "Vassal markers & vassal order tokens",
        d: (c) => {
          const sets = GT.vassalSets(c), by = {};
          sets.forEach(h => { by[h] = (by[h] || 0) + 1; });
          const holders = Object.keys(by).map(h => "<b>" + GT.houseName(h) + "</b>" + (by[h] > 1 ? " (" + by[h] + " sets)" : ""));
          return "<ul><li>Place each vassal's <b>Victory Point token</b> near the Iron Throne track. These are the <b>vassal markers</b>.</li>" +
            "<li>For each vassal, give a <b>set of four vassal order tokens</b> to the highest player on the Iron Throne track who doesn't already have a set.</li>" +
            (c.p === 3 ? "<li><b>Three players:</b> the set for the fourth vassal goes to the player in the highest position on the Iron Throne track, who starts the game with two sets.</li>" : "") +
            "<li><b>This game:</b> " + sets.length + " set" + (sets.length > 1 ? "s" : "") + " — " + GT.list(holders) + ".</li>" +
            "<li>Each set holds one each of <b>March +0</b>, <b>Raid/Support +1</b>, <b>Defense +1/Muster</b> and <b>Defense +3</b>. The icons on their backs only tie a set together.</li></ul>";
        },
        src: "MoD p.4–6" },
      { when: () => true, exp: "mod",
        t: "Place units",
        d: (c) => {
          let d = "<ul><li>Place each player's starting units on the board as instructed on his <b>player screen</b>.</li>";
          if (c.house("lannister")) d += "<li><b>Errata — House Lannister's screen</b> now reads: 1 Ship in <b>The Golden Sound</b>; 1 Ship in the <b>port at Lannisport</b>; 1 Knight and 1 Footman in <b>Lannisport</b>; 1 Footman in <b>Stoney Sept</b>.</li>";
          if (c.targ) d += "<li><b>House Targaryen</b> begins the game on the Essos side board. Its three Dragons are in play from the beginning of the game.</li>";
          if (c.vassals.length) {
            d += "<li>Then place each vassal's starting units as instructed on its <b>vassal setup card</b>: " + GT.names(c.vassals) + ".";
            const known = c.vassals.filter(v => GT.vassalCards[v]);
            if (known.length) d += "<ul>" + known.map(v => "<li><b>" + GT.houseName(v) + " vassal</b> (the card pictured on " + GT.vassalCards[v].src + "): " + GT.vassalCards[v].units.join("; ") + ".</li>").join("") + "</ul>";
            d += "</li>";
          }
          return d + "</ul>";
        },
        src: (c) => {
          const s = ["MoD p.4"];
          if (c.targ) s[0] += ", p.7–8";
          if (c.vassal("baratheon")) s[0] = s[0].replace("MoD p.4", "MoD p.2, p.4");
          if (c.house("lannister")) s.push("FAQ p.1");
          return s.join(" · ");
        } },
      { when: () => true, exp: "mod",
        t: "Garrison & Neutral Force tokens",
        d: (c) => "<ul><li>Place the Garrison token of each House" + (c.vassals.length ? " — players and vassals alike —" : "") + " on its home area, the area named on the token.</li>" +
          "<li>New Garrisons in this expansion: <b>The Eyrie</b> (House Arryn" + (c.vassal("arryn") ? ", a vassal this game" : "") + ")" + (c.targ ? " and <b>Pentos</b> (House Targaryen, on the Essos board)" : "") + ".</li>" +
          "<li>Place the <b>King's Landing</b> Neutral Force token (strength 5) in King's Landing. It is the only base-game Neutral Force used: the vassal system replaces the others, which stay in the box.</li>" +
          (c.targ ? "<li><b>House Targaryen:</b> place one <b>loyalty token</b> in King's Landing.</li>" : "") + "</ul>",
        src: (c) => "MoD p.2, p.5" + (c.targ ? ", p.7" : "") + " · Rules p.28" },
      { when: (c) => c.targ, exp: "mod",
        t: "Braavos & the Iron Bank",
        d: "<ul><li>Shuffle the <b>12 loan cards</b> and place the deck facedown on its space at the top of the Essos side board.</li>" +
           "<li>Draw one loan card and place it faceup in the <b>rightmost</b> space of the Iron Bank track, the one marked <b>7</b>. (The three spaces are marked 1, 4 and 7.)</li>" +
           "<li>Place the <b>Braavos</b> Neutral Force token (strength 5) in the Braavos area.</li></ul>",
        src: "MoD p.2, p.5, p.9" },
      { when: () => true, exp: "mod",
        t: "Power tokens",
        d: (c) => "<ul><li>Place all Power tokens in one central pile: the <b>Power Pool</b>.</li>" +
          "<li>Each player takes <b>7 Power tokens</b> of his House from the Pool (5 in the base game).</li>" +
          (c.vassals.length ? "<li>Vassals take none. They never collect Power tokens and use them only to mark control.</li>" : "") +
          "<li>Available power stays visible in front of your screen, except while bidding.</li></ul>",
        src: "MoD p.5 · Rules p.27" }
    ]
  },
  {
    title: "Options & the First Round",
    steps: [
      { when: (c) => c.opt("tob"), exp: "opt",
        t: "Tides of Battle deck",
        d: "<ul><li>All players agree to use the module before playing.</li>" +
           "<li>Shuffle the <b>24 Tides of Battle cards</b> into a single deck and place it near the board.</li>" +
           "<li><b>FAQ:</b> immediately before the Choose and Reveal House Cards step of <i>every</i> combat, reshuffle all Tides of Battle cards together into a new deck.</li></ul>",
        src: "Rules p.2, p.29 · FAQ p.1" },
      { when: (c) => c.has("mod") && c.opt("alt"), exp: "mod",
        t: "Alternate House Card Set",
        d: (c) => "<ul><li>Needs both the <i>A Feast for Crows</i> and <i>A Dance With Dragons</i> expansions, and the group's agreement. The cards follow the state of the Houses in the later books and may contain plot spoilers.</li>" +
          "<li>Replace <b>all the base game's House cards</b> with those from <i>A Dance With Dragons</i>.</li>" +
          "<li>Replace this expansion's <b>Arryn</b> House cards with the Arryn House card from <i>A Feast for Crows</i>.</li>" +
          "<li>House <b>Targaryen</b> uses this expansion's deck marked <b>“B”</b> next to the expansion icon " + GT.ici("mod-deck-b", "“B” beside the Mother of Dragons expansion icon") + (c.targ ? "" : " (not needed this game: no Targaryen player)") + ".</li>" +
          "<li><b>FAQ errata</b> for two <i>A Dance With Dragons</i> cards, Ser Addam Marbrand and Paxter Redwyne, are under <i>Combat — House Cards</i>.</li></ul>",
        src: "MoD p.4 · FAQ p.2" },
      { when: () => true, exp: (c) => c.has("mod") ? "mod" : "core",
        t: "Begin — round 1 skips the Westeros Phase",
        d: (c) => "<ul><li>The game is ready. In the first game round, skip the Westeros Phase and go straight to the <b>Planning Phase</b>.</li>" +
          (c.vassals.length ? "<li>Every Planning Phase, the first one included, starts with <b>Choosing Vassals</b> (see <i>Mother of Dragons — Vassals</i>).</li>" : "") +
          (c.targ ? "<li>The Iron Bank's loan cards don't shift at the start of round 1 (they do at the start of every later round).</li>" : "") + "</ul>",
        src: (c) => c.has("mod") ? "Rules p.7" + (c.vassals.length || c.targ ? " · MoD " + [c.vassals.length ? "p.5" : "", c.targ ? "p.9" : ""].filter(Boolean).join(", ") : "") : "Rules p.4, p.7" }
    ]
  }
];

/* =============================================================================
   RULES REFERENCE — each section: title, when(c), html(c), src(c)
   ============================================================================= */
GT.reference = [
  {
    title: "The Game Round & How to Win",
    when: () => true,
    html: (c) => "<ol><li><b>Westeros Phase</b> (skipped in round 1) — reveal the top card of each Westeros deck and resolve them in order I, II, III" + (c.targ ? ", IV" : "") + ".</li>" +
      "<li><b>Planning Phase</b> — " + (c.vassals.length ? "players first choose the vassals they command; then everyone simultaneously assigns facedown Order tokens to every area holding their units; then, in turn order, each commander places up to two vassal order tokens per vassal; then all orders are revealed.</li>" : "everyone simultaneously assigns facedown Order tokens to every area holding their units, then reveals them.</li>") +
      "<li><b>Action Phase</b> — the orders resolve: Raids, then Marches (and combat), then Consolidate Power" + (c.has("mod") ? " (with the crown-icon orders)" : "") + ", then Clean Up.</li></ol>" +
      "<ul><li>The game lasts <b>10 rounds</b>; after each Action Phase a new round begins with a Westeros Phase.</li>" +
      "<li><b>Instant win:</b> the moment a player controls <b>7 areas containing a Castle or Stronghold</b>, the game ends and he wins.</li>" +
      "<li>Otherwise, at the end of round 10 the player who controls the most such areas wins (tiebreakers under <i>Winning the Game</i>).</li>" +
      (c.has("mod") ? "<li><b>Mother of Dragons:</b>" + "<ul>" +
        (c.targ ? "<li>A fourth Westeros card, from <b>deck IV</b>, is revealed and resolved after I, II and III.</li>" +
                  "<li>At the start of each round after the first, the Iron Bank's loans shift one slot; at the start of each Westeros Phase, borrowers pay interest.</li>" +
                  "<li><b>House Targaryen</b> wins the moment it reaches <b>7</b> on the Victory track, which counts its <b>loyalty tokens</b> (and Pentos) instead of castles.</li>" : "") +
        (c.vassals.length ? "<li><b>Vassals</b> are chosen at the start of every Planning Phase and resolve their orders in their own Iron Throne position.</li>" : "") +
        "<li>Orders marked with a small " + GT.ici("mod-crown-icon", "Circled crown icon", "circled <b>crown</b>") + " resolve in the Consolidate Power step.</li></ul></li>" : "") + "</ul>",
    src: (c) => "Rules p.2, p.7, p.12, p.14, p.16" + (c.has("mod") ? " · MoD p.6" + (c.vassals.length ? ", p.5" : "") + (c.targ ? ", p.7, p.9" : "") : "")
  },
  {
    title: "Important Terms",
    when: () => true,
    html: (c) => "<ul><li><b>Unit</b> — a plastic Ship, Footman, Knight or Siege Engine" + (c.targ ? " (or Targaryen's Dragon)" : "") + ". Garrisons, Neutral Forces and Influence tokens are <i>not</i> units.</li>" +
      "<li><b>Area</b> — a region of the board: a <b>sea area</b> (red borders) or a <b>land area</b> (white borders).</li>" +
      "<li><b>Home area</b> — the land area with its House's printed shield (Winterfell is House Stark's).</li>" +
      "<li><b>Turn order</b> — the order of the Iron Throne Influence track: position 1 first, then 2, and so on.</li>" +
      "<li><b>Army</b> — two or more friendly units in the same area. A single unit is not an army and is unaffected by supply.</li>" +
      "<li><b>Available power</b> — the Power tokens in your play area, ready to bid or spend. Tokens in the Power Pool are not available.</li>" +
      "<li><b>Collect / receive power</b> — take Power tokens with your House insignia from the Power Pool. <b>Discard power</b> — return them from your available power to the Pool. You only ever handle your own House's Power tokens.</li>" +
      "<li><b>Destroy</b> — remove a unit from the board and return it to its player's available units" + (c.targ ? " (a destroyed <b>Dragon</b> is instead removed from the game permanently, outside certain card abilities)" : "") + ".</li>" +
      "<li><b>Embattled area</b> — the area where a combat is taking place.</li>" +
      "<li><b>Friendly / enemy</b> — components and areas belonging to you / to another player.</li>" +
      (c.has("mod") ? (c.vassals.length ? "<li><b>Vassal</b> <span class='muted'>(Mother of Dragons)</span> — a neutral House no player chose (never Targaryen), commanded each round by a player as an extension of his forces.</li>" +
        "<li><b>Commander</b> — the player commanding a vassal until the start of the next Planning Phase. <b>Vassal marker</b> — the vassal's Victory Point token.</li>" : "") +
        "<li><b>Sea order token</b> — a blue-hued order that resolves only in a sea area or a port that has a ship.</li>" +
        (c.targ ? "<li><b>Loyalty token</b> — a hidden Targaryen supporter on a Westeros land area; Targaryen gains it by controlling that area.</li>" : "") : "") + "</ul>",
    src: (c) => "Rules p.6" + (c.has("mod") ? " · MoD " + [c.vassals.length ? "p.5" : "", c.targ ? "p.7, p.8" : "", "p.10"].filter(Boolean).join(", ") : "")
  },
  {
    title: "Westeros Phase",
    when: () => true,
    html: (c) => (c.targ ? "<p><b>Iron Bank, at the beginning:</b> at the beginning of each round after the first, shift every loan in the Iron Bank one slot left and reveal a new loan into the “7” slot. At the beginning of the Westeros Phase, in turn order, each player with loans discards one available Power token per loan (see <i>The Iron Bank of Braavos</i>). The book doesn't say which of these two comes first.</p>" : "") +
      "<ol><li><b>Advance the Game Round marker</b> one position. If it was already on <b>10</b>, the game ends instead and a winner is determined." +
      (c.targ ? " If the marker reaches a space holding a <b>dragon strength token</b>, move that token to the leftmost free slot of the dragon strength box: every Dragon gains +1 strength." : "") + "</li>" +
      "<li><b>Draw Westeros cards</b> — reveal the top card of all three Westeros decks" + (c.targ ? ", then the top card of <b>Westeros deck IV</b>" : "") + ".</li>" +
      "<li><b>Advance the Wildlings track</b> — count the " + GT.ici("wildling-icon", "Wildling icon", "Wildling icons") + " on the revealed cards and move the Wildling Threat token that many spaces. If it reaches <b>12</b>, resolve a <b>wildling attack</b> at once (ignore surplus icons).</li>" +
      "<li><b>Resolve Westeros cards</b> in deck order: I, then II, then III" + (c.targ ? ", then IV" : "") + ". Read each card and apply it.</li></ol>" +
      (c.vassals.length ? "<ul><li><b>Vassals</b> are affected by Westeros cards, except wildling attacks. Their commander makes any decision a card asks of them.</li></ul>" : "") +
      "<h4>Reading a Westeros card</h4><ul><li><b>Title and artwork</b>.</li><li><b>Deck number</b> — the numeral in the right-hand box (also on the card back).</li><li><b>Text effect</b>.</li><li><b>Wildling icon</b> (upper right, on some cards) — advances the Wildling Threat token one space.</li></ul>" +
      "<h4>Rulings</h4><ul><li><b>Winter Is Coming (errata):</b> “Immediately shuffle this deck and discard pile (including this card). Then, draw and resolve a new card.” It resolves the moment it is drawn, not in step 4, so a Wildling icon on the card it brings in <i>can</i> trigger a wildling attack.</li>" +
      "<li>The wildlings can attack twice in one Westeros Phase: the track reaches 12 <i>and</i> a “Wildlings Attack” card is revealed.</li></ul>",
    src: (c) => "Rules p.7, p.23 · FAQ p.2, p.4" + (c.targ ? " · MoD p.7–9" : c.vassals.length ? " · MoD p.7" : "")
  },
  {
    title: "Westeros Cards Explained in the Rules",
    when: () => true,
    html: (c) => "<ul>" +
      "<li><b>Supply</b> (deck I) — “Adjust Supply track. Reconcile armies.” See <i>Supply &amp; Armies</i>.</li>" +
      "<li><b>Mustering</b> (deck I) — “Recruit new units in Strongholds and Castles.” See <i>Mustering</i>.</li>" +
      "<li><b>Clash of Kings</b> (deck II) — “Bid on the three Influence tracks.” See <i>Clash of Kings</i>.</li>" +
      "<li><b>Game of Thrones</b> — each House collects one Power token per <b>Power icon</b> in the areas it controls, plus one per friendly <b>Port</b> holding a friendly Ship whose connected sea area has no enemy Ships (<i>Trade with the Free Cities</i>). Power tokens placed on the board are not Power icons." + (c.has("mod") ? " A <b>power improvement</b> token does count as a Power icon; a degraded icon doesn't (Mother of Dragons)." : "") + (c.vassals.length ? " <b>Vassals</b> never collect Power." : "") + "</li>" +
      "<li><b>Wildlings Attack</b> (deck III) — “The wildlings attack Westeros.” Resolved wherever the Wildling Threat token stands; at <b>0</b> players still bid, and the Night's Watch is guaranteed to win.</li>" +
      "<li><b>Web of Lies</b> (deck III, Wildling icon) — “Support Orders cannot be played during this Planning Phase.”</li>" +
      "<li><b>Winter Is Coming</b> (errata) — “Immediately shuffle this deck and discard pile (including this card). Then, draw and resolve a new card.”</li>" +
      "<li><b>Dark Wings, Dark Words</b> — its second option works exactly like <i>Game of Thrones</i>, so ships in ports collect power too.</li>" +
      "<li><b>Storm of Swords</b> — while its effect is in play, Defense orders can't be placed or executed (FAQ rulings)" + (c.vassals.length ? ". That includes a vassal's <b>Defense +1/Muster</b> (a type of Defense order) and its <b>Defense +3</b>" : "") + ".</li>" +
      "<li><b>Feast for Crows</b> — forbids placing or executing Consolidate Power orders (FAQ ruling)" + (c.has("mod") ? ". It does <b>not</b> forbid the <b>Iron Bank</b> order" + (c.targ ? "" : " (a blank sea order without Targaryen)") + (c.vassals.length ? " or the vassal Defense/Muster order: neither is a Consolidate Power order, though they resolve in the same step" : ": it is not a Consolidate Power order, though it resolves in the same step") : "") + ".</li>" +
      "</ul>" +
      (c.vassals.length ? "<h4>Vassals and Westeros cards</h4><ul><li>Vassals are affected by Westeros cards, except wildling attacks. The commander makes any decision for them.</li>" +
        "<li>Mustering granted by a Westeros card happens only in the vassal's <b>home area</b>, if it still controls it. Otherwise it gets no units.</li>" +
        "<li>Vassals adjust their supply on <b>Supply</b> cards like everyone else.</li></ul>" : "") +
      (c.targ ? "<h4>Westeros deck IV — House Targaryen</h4><ul><li>Resolve a deck IV card after I, II and III. The Targaryen player places <b>one loyalty token on each area named on the banner</b> in the upper middle of the card (the map on its left helps find them), then follows the rest of the card's text — often placing or moving loyalty tokens, sometimes for Power tokens.</li>" +
        "<li><i>Example:</i> resolving <b>Empty Promises</b> places one loyalty token on The Stony Shore. Its text: “The Targaryen player may discard 1 power token to place a loyalty token on either: The Mountains of the Moon or Moat Cailin.”</li>" +
        "<li>Loyalty tokens exist on <b>land areas only</b>: never placed on or moved into a sea area (FAQ).</li>" +
        "<li><b>Fire Made Flesh</b> (FAQ) — only <b>one</b> dragon strength token can be moved to the dragon strength box. Each of its effects is optional: Targaryen may perform neither.</li>" +
        "<li><b>Playing With Fire</b> (FAQ) — Targaryen can't choose a player who has no available units.</li>" +
        "<li><b>Word Spreads Quickly</b> and <b>Scattering Dissent</b> (FAQ) — each player, Targaryen included, <b>must</b> choose one loyalty token to move. The same token may be moved more than once, even back and forth between the same areas.</li></ul>" : "") +
      "<p class='inline-note'>Every other Westeros card: read it and apply its text. The rulebooks and FAQ don't reprint the rest of the decks.</p>",
    src: (c) => "Rules p.7–10, p.22, p.24–25 · FAQ p.2, p.4, p.6–7" + (c.has("mod") ? " · MoD " + (c.targ ? "p.2, p.6–7, p.10" : "p.6–7, p.10") : "")
  },
  {
    title: "Supply & Armies",
    when: () => true,
    html: (c) => "<ul><li>When a <b>Supply</b> card resolves, each House in turn order counts the " + GT.ici("supply", "Supply icon", "<b>Supply icons</b>") + " (barrels) printed in the areas it controls" + (c.has("mod") ? ", plus any <b>supply improvement</b> tokens (barrels) in those areas," : "") + " and moves its Supply token to that number.</li>" +
      (c.has("mod") ? "<li><b>Improvement and degradation</b> (Mother of Dragons): an area with a supply improvement token counts as having a printed barrel; a printed barrel covered by a degradation no longer counts.</li>" : "") +
      (c.vassals.length ? "<li><b>Vassals</b> start with their Supply token on <b>4</b>, whatever they control. They obey every supply limit and adjust on Supply cards; if a vassal exceeds its limit, its <b>commander</b> chooses which units to destroy.</li>" : "") +
      (c.targ ? "<li>Each <b>Dragon</b> is a single land unit that must follow the rules of supply.</li>" : "") +
      "<li>Each Supply position's flags show how many <b>armies</b> you may field and the maximum size of each:</li></ul>" +
      "<table class='ref-table'><thead><tr><th>Supply</th><th>Armies allowed (max units in each)</th></tr></thead><tbody>" +
      GT.supplyTrack.map((a, i) => "<tr><td>" + i + "</td><td>" + a.join(" · ") + "</td></tr>").join("") + "</tbody></table>" +
      "<ul><li>An <b>army</b> is 2+ friendly units in one land area, sea area or port. A single unit is never an army.</li>" +
      "<li>After adjusting, if your armies are too many or too big, <b>immediately destroy units</b> until they comply.</li>" +
      "<li>Fewer or smaller armies than allowed are fine. A Knight or Siege Engine counts as one unit. Routed units still count.</li>" +
      "<li>Armies are reconciled only when the Supply track is adjusted — gaining or losing barrels during the Action Phase changes nothing until then.</li>" +
      "<li>You may <b>never</b> take an action that would exceed your supply limit — mustering, marching or retreating.</li>" +
      "<li><b>FAQ:</b> when a March order splits into a combat move and other moves, the other moves finish first, all at once, without exceeding supply.</li></ul>",
    src: (c) => "Rules p.6, p.8, p.21, p.25 · FAQ p.4" + (c.has("mod") ? " · MoD " + (c.vassals.length ? "p.4, p.7" + (c.targ ? "–8" : "") + ", p.10" : (c.targ ? "p.8, p.10" : "p.10")) : "")
  },
  {
    title: "Mustering",
    when: () => true,
    html: (c) => "<ul><li>When a <b>Mustering</b> card resolves, each player in turn order <b>may</b> recruit in every area he controls that holds a Castle or Stronghold (mustering is optional). One player finishes all his mustering before the next starts.</li>" +
      "<li>Mustering points (spent only in their own area; unspent points are lost):</li></ul>" +
      "<ul class='aid-icons'>" + GT.icl("stronghold", "Stronghold", "<b>Stronghold</b> — 2 points of mustering.") + GT.icl("castle", "Castle", "<b>Castle</b> — 1 point of mustering.") + "</ul>" +
      "<table class='ref-table'><thead><tr><th>Unit</th><th>Cost</th></tr></thead><tbody>" +
      "<tr><td>" + GT.ici("unit-footman", "Footman", "Footman") + "</td><td>1</td></tr><tr><td>" + GT.ici("unit-knight", "Knight", "Knight") + "</td><td>2 (or 1 to upgrade a Footman)</td></tr><tr><td>" + GT.ici("unit-ship", "Ship", "Ship") + "</td><td>1</td></tr><tr><td>" + GT.ici("unit-siege-engine", "Siege Engine", "Siege Engine") + "</td><td>2 (or 1 to upgrade a Footman)</td></tr></tbody></table>" +
      "<ul><li><b>Upgrade:</b> replace a Footman already in the mustering area with a Knight or Siege Engine for 1 point. It doesn't change army size.</li>" +
      "<li>New units come from your unused units and go into the area that provided the points.</li>" +
      "<li>You can't muster a unit that would create or enlarge an army beyond your supply limit.</li>" +
      "<li><b>Ships</b> go into the area's connected <b>Port</b> or an <b>adjacent sea area</b> — never into a sea area holding enemy ships. A Port can take ships even when its sea area holds enemy ships. You may split points between the Port and the sea area (FAQ). No port and no eligible sea area: no ships. A Port never holds more than three Ships.</li>" +
      "<li>Footmen, Knights and Siege Engines are never mustered into ports or sea areas.</li>" +
      "<li>The <b>Special Consolidate Power</b> order can muster in its own area only — it needs a Castle or Stronghold there and doesn't work in a Port.</li>" +
      "</ul>" +
      (c.has("mod") ? "<h4>Mother of Dragons</h4><ul>" +
        "<li><b>Improvements:</b> an area with an improvement token is treated as having that icon printed (for example a Castle improved to a Stronghold gives 2 points); an icon covered by a degradation is treated as gone.</li>" +
        (c.vassals.length ? "<li><b>Vassals, Westeros-card mustering:</b> only in the vassal's <b>home area</b>, if it still controls it — otherwise it receives no units. Its commander decides.</li>" +
          "<li><b>Vassal Defense +1/Muster order:</b> in the Resolve Consolidate Power Orders step the vassal may muster in that area under the normal mustering rules, exactly like a Special Consolidate Power order. The stronghold pictured on the token gives the area no stronghold; in a port the token has no effect.</li>" : "") +
        (c.targ ? "<li><b>House Targaryen</b> has no Siege Engines and can never gain or muster one, even when an effect says it should.</li>" +
          "<li><b>Dragons</b> can't be mustered: they are in play from the start, and a destroyed Dragon is permanently removed (outside certain card abilities).</li>" : "") + "</ul>" : ""),
    src: (c) => "Rules p.9, p.22, p.25 · FAQ p.5" + (c.has("mod") ? " · MoD " + (c.vassals.length ? "p.6–7" + (c.targ ? ", p.8" : "") + ", p.10" : (c.targ ? "p.8, p.10" : "p.10")) + (c.targ ? " · FAQ p.6" : "") : "")
  },
  {
    title: "Clash of Kings — Bidding on the Influence Tracks",
    when: () => true,
    html: (c) => "<ol><li>Remove every Influence token from the three tracks.</li>" +
      "<li>Bid for one track at a time: <b>Iron Throne</b>, then <b>Fiefdoms</b>, then <b>King's Court</b>.</li></ol>" +
      "<h4>Each bid</h4><ul><li>Everyone announces their total available power (FAQ: this is required, at the start of each bid).</li>" +
      "<li>Hide your available power behind your screen, put any number of tokens in a closed fist, and reveal all fists together.</li>" +
      "<li>Highest bid takes position 1, second-highest position 2, and so on.</li>" +
      "<li><b>Ties:</b> the holder of the Iron Throne token places the tied Houses on the highest available positions, in the order he chooses. The token changes hands only after the whole Iron Throne track is placed, so its old holder breaks ties on that track.</li>" +
      "<li>All power bid is discarded to the Power Pool, win or lose.</li>" +
      "<li>Position 1 then takes the track's Dominance token, and bidding moves on to the next track.</li></ul>" +
      "<ul><li>After the King's Court track and the Messenger Raven, the card is resolved; remaining power goes back in front of the screens.</li>" +
      "</ul>" +
      (c.vassals.length || c.targ ? "<h4>Mother of Dragons</h4><ul>" +
        (c.vassals.length ? "<li><b>Vassals</b> are placed on the tracks like Houses and can change positions, but they automatically bid <b>zero</b> on each track" + (c.targ ? " (Targaryen's power can raise that)" : "") + ".</li>" +
          "<li>Vassals can't gain Dominance tokens: if a vassal takes position 1, the player House in the next-highest position takes the token instead.</li>" : "") +
        (c.targ ? "<li><b>House Targaryen</b> bids any number of tokens as normal, but never moves: it stays on space 8 of every track.</li>" +
          "<li>Right after the bids are revealed — <b>before</b> the Iron Throne holder breaks any ties (FAQ) — Targaryen <b>distributes the power it bid</b> among any of the other players and vassals. It chooses the amount distributed and how it's divided.</li>" +
          "<li>Each Targaryen Power token a House receives raises that House's bid by one, even if it bid nothing. Players and vassals can't refuse it.</li>" : "") + "</ul>" : ""),
    src: (c) => "Rules p.10–11, p.27 · FAQ p.5" + (c.vassals.length || c.targ ? " · MoD " + (c.vassals.length ? "p.6" + (c.targ ? ", p.8" : "") : "p.8") + (c.targ ? " · FAQ p.6" : "") : "")
  },
  {
    title: "Influence Tracks & Dominance Tokens",
    when: () => true,
    html: (c) => "<h4>Iron Throne track — turn order</h4><ul><li>Anything done “in turn order” starts at position 1, then 2, and so on.</li>" +
      "<li>" + GT.ici("token-iron-throne", "Iron Throne token", "<b>Iron Throne token</b>") + " (position 1): decides <b>every tie</b> in the game except ties in combat (Fiefdoms track) and ties for the winner of the game.</li></ul>" +
      "<h4>Fiefdoms track — combat ties</h4><ul><li>The higher House (closer to 1) wins a tied combat.</li>" +
      "<li>" + GT.ici("token-valyrian-blade", "Valyrian Steel Blade token", "<b>Valyrian Steel Blade</b>") + " (position 1): <b>once per round</b>, +1 Combat Strength in a combat you fight." + (c.opt("tob") ? " With Tides of Battle, you may instead use it, before the Tides cards are revealed, to discard your Tides of Battle card and draw a replacement you must keep (see <i>Tides of Battle</i>)." : "") + " Flip it to its faded side when used; its holder flips it back at the end of every Action Phase.</li></ul>" +
      "<h4>King's Court track — Special Orders</h4><ul><li>The stars beside your position are the number of Special Order tokens you may use in the Planning Phase:</li>" +
      (c.has("mod")
        ? "<li><b>Mother of Dragons</b> (printed track plus the influence track extension): 1st ★★★ · 2nd ★★★ · 3rd ★★ · 4th ★ · 5th, 6th and 7th none · <b>8th ★★★</b> (House Targaryen's space).</li>" +
          "<li>No King's Court Overlay: the FAQ rules it out whenever vassals play, at any player count.</li>" +
          (c.vassals.length ? "<li>Vassals take up positions on the track, but they are only ever ordered with vassal order tokens.</li>" : "")
        : (c.p >= 5 ? "<li><b>" + c.p + " players</b> (printed track): 1st ★★★ · 2nd ★★★ · 3rd ★★ · 4th ★ · " + (c.p === 6 ? "5th and 6th" : "5th") + " none.</li>"
                    : "<li><b>" + c.p + " players</b> (King's Court Overlay): 1st ★★★ · 2nd ★★ · 3rd ★" + (c.p === 4 ? " · 4th none" : "") + ".</li>")) +
      "<li>" + GT.ici("token-messenger-raven", "Messenger Raven token", "<b>Messenger Raven</b>") + " (position 1): at the <b>end of the Reveal Orders step</b> (FAQ errata — the rulebook said Assign Orders), choose one or neither:<ul>" +
      "<li><b>Replace an Order token</b> — swap one of your orders on the board for one of your unused Order tokens;</li>" +
      "<li><b>Look in the Wildling deck</b> — look at the top card, then leave it on top or put it on the bottom. You may tell others about it (or lie) but never show it.</li></ul></li>" +
      "<li>Flip the Raven to its faded side when used; its holder flips it back at the end of every Action Phase.</li></ul>" +
      "<h4>Shifting position outside bidding</h4><ul><li>Some cards (Doran Martell's House card, the “A King Beyond the Wall” Wildling card) move a House on a track; every other House shifts to make room.</li>" +
      "<li>Losing position 1 this way hands that track's Dominance token to the new holder immediately, in its current state (used or available — FAQ confirms).</li>" +
      "<li>A King's Court shift doesn't remove Special Orders already legally on the board; it changes what's available next Planning Phase (FAQ confirms).</li>" +
      "<li>Turn order always follows the positions as they stand: a House moved to the last position after its turn may act again next (FAQ, Doran Martell).</li></ul>" +
      (c.has("mod") ? "<h4>Mother of Dragons</h4><ul><li>The influence track extension adds spaces <b>7</b> and <b>8</b> to every track. Space 8 belongs to House Targaryen" + (c.targ ? "" : " — empty this game") + ".</li>" +
        (c.targ ? "<li><b>Targaryen</b> permanently occupies space 8 on all three tracks: it can't rise higher, and no other House can occupy space 8. With three stars there, it can always use up to three Special Orders each round.</li>" +
          "<li><b>FAQ:</b> any effect that would shift Targaryen to a higher position (such as “A King Beyond the Wall” or Doran Martell) is ignored. Any effect that would shift a House to the lowest position puts its token on space <b>7</b> instead.</li>" : "") +
        (c.vassals.length ? "<li><b>Vassals</b> sit on the tracks and are part of turn order (FAQ), but can't hold Dominance tokens: when a vassal is highest on a track, the next-highest player House holds that token.</li>" +
          "<li>The Messenger Raven can't be used to swap a vassal's order token.</li>" +
          "<li>A commander holding the Valyrian Steel Blade may use it for his vassal's combat (see <i>Combat — Strength &amp; Support</i>).</li>" : "") + "</ul>" : ""),
    src: (c) => "Rules p.11–12, p.22, p.27" + (c.has("mod") ? "" : ", p.28") + (c.opt("tob") ? ", p.29" : "") + " · FAQ p.1, p.3" + (c.has("mod") ? " · MoD p.3–6, p.8, p.12 · FAQ p.6" : "")
  },
  {
    title: "Planning Phase",
    when: () => true,
    html: (c) => (c.vassals.length ? "<p><b>Mother of Dragons — first, Choosing Vassals</b> (start of every Planning Phase; see <i>Mother of Dragons — Vassals</i>): vassal markers go back near the Iron Throne track, the highest players on that track each receive a set of vassal order tokens, and in turn order each picks a vassal to command or passes the set on.</p>" : "") +
      "<ol><li><b>Assign Orders</b> — each player places exactly <b>one</b> Order token facedown (House insignia up) on <b>every</b> area he controls containing at least one of his units. Everyone places at the same time; an area never takes more than one order." +
      (c.vassals.length ? " <b>Then</b>, in turn order, each commander places <b>up to two</b> of his four vassal order tokens for each vassal he commands, each in an area containing that vassal's units. Some vassal areas may get no order." : "") + "</li>" +
      "<li><b>Reveal Orders</b> — flip all orders faceup together.</li>" +
      "<li><b>Use Messenger Raven</b> — its holder may swap one placed order for an unused one, or look at the top Wildling card (see <i>Influence Tracks</i>)." + (c.vassals.length ? " Never on a vassal's order token." : "") + "</li></ol>" +
      (c.has("mod") ? "<ul><li><b>Sea orders</b> (Mother of Dragons): before players begin resolving orders — after the Messenger Raven would be used — every <b>sea order token on a land area</b> is removed without effect.</li></ul>" : "") +
      "<ul><li>Use any of your 10 regular orders" + (c.has("mod") ? " and your 3 sea orders" : "") + ", but only as many <b>Special Orders</b> (★) as the stars by your King's Court position — never more, under any circumstance.</li>" +
      "<li>You may plead, cajole and suggest during Assign Orders, but never show an order.</li>" +
      "<li>Areas containing only a Garrison take no order.</li>" +
      "<li><b>Not enough Order tokens?</b> In the rare case a player can't cover every area, everyone assigns in turn order instead; that player places all his eligible tokens and leaves areas of his choice without an order.</li>" +
      "</ul>",
    src: (c) => "Rules p.12, p.26 · FAQ p.1" + (c.has("mod") ? " · MoD " + (c.vassals.length ? "p.5, p.10" : "p.10") : "")
  },
  {
    title: "Order Tokens & Special Orders",
    when: () => true,
    html: (c) => "<p>The five order types, each with its Special Order (marked with a star ★):</p><ul class='aid-icons'>" +
      GT.icl("order-march", "March Order token", "<b>March</b> — 2 regular (<b>−1</b> and <b>+0</b>) + Special " + GT.ici("special-march", "Special March +1 Order token", "<b>March +1</b>") + ". Resolved in step 2 of the Action Phase: units move to adjacent areas; the printed number modifies the attacker's strength if this march starts a combat.") +
      GT.icl("order-defense", "Defense Order token", "<b>Defense</b> — 2 regular (<b>+1</b> each) + Special " + GT.ici("special-defense", "Special Defense +2 Order token", "<b>Defense +2</b>") + ". Adds its number to the defender in its area, against any number of attacks that round, unless removed.") +
      GT.icl("order-support", "Support Order token", "<b>Support</b> — 2 regular + Special " + GT.ici("special-support", "Special Support +1 Order token", "<b>Support +1</b>") + " (the area's supporting strength is +1). Lends the area's strength to an adjacent combat.") +
      GT.icl("order-raid", "Raid Order token", "<b>Raid</b> — 2 regular + " + GT.ici("special-raid", "Special Raid Order token", "Special Raid") + ". Resolved first: removes one adjacent enemy Support, Raid or Consolidate Power order. The <b>Special Raid</b> may instead remove one adjacent <b>Defense</b> order.") +
      GT.icl("order-consolidate", "Consolidate Power Order token", "<b>Consolidate Power</b> — 2 regular + " + GT.ici("special-consolidate", "Special Consolidate Power Order token", "Special") + ". Resolved third: gain 1 power plus 1 per Power icon in the area. The <b>Special Consolidate Power</b> may instead <b>muster</b> in its own area (only if it contains a Castle or Stronghold).") +
      "</ul><ul><li>Special Orders are strictly better than regular ones — and they give you a third order of a type.</li>" +
      "<li>Whether resolved or removed, an Order token returns to its House's available orders for the next Planning Phase.</li>" +
      "</ul>" +
      (c.has("mod") ? "<h4>Sea order tokens (Mother of Dragons)</h4><ul>" +
        "<li>Each House has " + GT.ici("mod-sea-orders", "Sea order tokens", "<b>3 sea order tokens</b>") + ", blue-hued. They work exactly like standard order tokens, but resolve only in <b>sea areas or ports that have a ship</b>. Sea orders placed on land areas are removed without effect before orders resolve.</li>" +
        "<li>The book pictures a <b>March −1</b> and a <b>Support</b> sea order, and names the <b>Iron Bank order</b> token as a sea order.</li>" +
        "<li>" + GT.ici("mod-iron-bank-order", "Iron Bank order token", "<b>Iron Bank order:</b>") + " in the Resolve Consolidate Power Orders step, its owner can choose to resolve it to buy one loan from the Iron Bank" + (c.targ ? " (see <i>The Iron Bank of Braavos</i>)" : "") + ". It can be raided, but the raider doesn't pillage. It is not a Consolidate Power order.</li>" +
        (c.targ ? "" : "<li><b>No Targaryen, so no Essos board or Iron Bank:</b> the Iron Bank sea order can still be played, as a blank sea order with no effect (FAQ).</li>") +
        "<li>" + GT.ici("mod-crown-icon", "Circled crown icon", "<b>Circled crown icon</b>") + " — some of the new order tokens carry a small circled crown: resolve that order in the <b>Resolve Consolidate Power Orders</b> step.</li></ul>" : "") +
      (c.vassals.length ? "<h4>Vassal order tokens</h4><p>Four types, one of each in a set:</p>" + GT.vassalOrderList() : ""),
    src: (c) => "Rules p.12–13, p.16, p.22 · FAQ p.5" + (c.has("mod") ? " · MoD p.2, p.6" + (c.targ ? ", p.9" : "") + ", p.10 · FAQ p.6–7" : "")
  },
  {
    title: "Action Phase",
    when: () => true,
    html: (c) => (c.has("mod") ? "<p><b>Before step 1</b> (Mother of Dragons): remove every sea order token on a land area, without effect.</p>" : "") +
      "<ol><li><b>Resolve Raid Orders</b></li><li><b>Resolve March Orders</b> (and any combat)</li><li><b>Resolve Consolidate Power Orders</b>" +
      (c.has("mod") ? " — and the orders with a " + GT.ici("mod-crown-icon", "Circled crown icon", "circled crown") + ": the Iron Bank order" + (c.vassals.length ? " and the vassal Defense +1/Muster used as a Muster" : "") : "") + "</li><li><b>Clean Up</b></li></ol>" +
      "<ul><li>Steps 1–3: in turn order, each player resolves <b>one</b> of his orders of that type; keep cycling until none remain. A player with none left is skipped.</li>" +
      (c.vassals.length ? "<li><b>Vassals</b> resolve their orders exactly like player Houses, in their own position on the Iron Throne track (they are part of turn order — FAQ). On a vassal's turn, its commander resolves the order on the board for it.</li>" : "") +
      "<li><b>Clean Up:</b> remove all remaining Support and Defense orders; stand routed units upright; flip the Messenger Raven and the Valyrian Steel Blade to their available side. After round 10, the game ends.</li>" +
      "<li><b>FAQ:</b> at the end of every combat's Clean Up, all order tokens in areas without units are removed.</li></ul>",
    src: (c) => "Rules p.14–16 · FAQ p.1" + (c.has("mod") ? " · MoD " + (c.vassals.length ? "p.5–6, p.10 · FAQ p.6" : "p.6, p.10") : "")
  },
  {
    title: "Raids",
    when: () => true,
    html: (c) => "<ul><li>Choose one <b>enemy Support, Raid or Consolidate Power</b> order adjacent to your " + GT.ici("order-raid", "Raid Order token", "Raid order") + "; remove both tokens. Special versions of those orders can be raided too.</li>" +
      "<li><b>Pillage:</b> raiding a Consolidate Power order gains you 1 Power token from the Pool, and the victim discards 1 available Power token if he can. A Consolidate Power order in a sea area can be pillaged (FAQ).</li>" +
      "<li>A Raid on a <b>land</b> area can never raid a sea area; a Raid on a <b>sea</b> area may raid an adjacent land or sea area.</li>" +
      "<li>The " + GT.ici("special-raid", "Special Raid Order token", "<b>Special Raid</b>") + " may instead remove an adjacent <b>Defense</b> order (both tokens removed).</li>" +
      "<li>No eligible target: the Raid is removed with no effect. You may also choose no effect.</li>" +
      "<li><b>Ports:</b> ships in a Port may raid the adjacent sea area only; ships in the connected sea area may raid the Port; land units can't raid a Port.</li>" +
      "<li>Ship transport doesn't make areas adjacent for raiding.</li>" +
      (c.has("mod") ? "<li><b>Iron Bank order</b> (Mother of Dragons): it can be raided, but raiding it doesn't let the raider steal a Power token (no pillage).</li>" +
        "<li><b>Sea orders</b> resolve only in sea areas or ports with a ship; any on land were removed before raids began.</li>" : "") +
      (c.vassals.length ? "<li><b>Vassal Raid/Support +1:</b> when it's the vassal's turn to raid, its commander chooses whether to resolve the token as a raid (it is then removed as normal). If not, it stays on the board as a support order.</li>" +
        "<li>The vassal <b>Defense +1/Muster</b> token is a Defense order: only a <b>Special Raid</b> can remove it.</li>" +
        "<li>A commander and his vassals can't raid each other, and one of his vassals can't raid another of his vassals (FAQ).</li>" : "") + "</ul>",
    src: (c) => "Rules p.13–14, p.22–23, p.25 · FAQ p.5" + (c.has("mod") ? " · MoD " + (c.vassals.length ? "p.6, p.10 · FAQ p.6" : "p.10") : "")
  },
  {
    title: "March Orders",
    when: () => true,
    html: (c) => "<ul><li>Move <b>all, some or none</b> of the units in the area, together or split among several <b>adjacent</b> areas (or further by ship transport); some may stay.</li>" +
      "<li>Footmen, Knights and Siege Engines never enter sea areas or ports. Ships move into adjacent sea areas or friendly connected ports, never onto land.</li>" +
      "<li><b>One combat per March order:</b> only one of the destination areas may contain another House's units. Moving there starts a combat with you as attacker. Attacking a Neutral Force uses that one attack.</li>" +
      "<li>All other moves from the area are completed before the combat starts.</li>" +
      "<li>The number on the " + GT.ici("order-march", "March Order token", "March token") + " modifies your strength in the combat it starts.</li>" +
      "<li><b>Leaving an area empty</b> loses control of it unless you <b>establish control</b> by placing one of your available Power tokens there — decided before any combat begins.</li>" +
      "<li>Marching into an area holding only an enemy Power token is <b>not</b> a combat: the token is discarded to the Pool. Marching into an area holding only routed enemy units <b>is</b> a combat (FAQ).</li>" +
      "<li><b>Staggered moves:</b> march into an area that holds another of your March orders, and move again when that order resolves — if no enemy removes it first.</li>" +
      "</ul>" +
      (c.targ ? "<h4>Dragons — marching and flying</h4><ul><li>When a March order resolves, a " + GT.ici("mod-dragon", "Dragon unit", "<b>Dragon</b>") + " may march normally or <b>fly</b>: it moves to <b>any land area</b> on the Westeros or Essos boards. Flying into a land area with an enemy unit starts a combat as normal.</li>" +
          "<li>Non-Dragon units can't fly, even if they start in a Dragon's area: they follow the normal march rules.</li>" +
          "<li>Retreats: see <i>Combat Resolution</i>.</li></ul>" +
        "<h4>The Essos board</h4><ul><li>Every House may move between the Westeros board's sea areas and the adjacent sea areas of the Essos board as if they were directly adjacent.</li></ul>" : "") +
      (c.vassals.length ? "<h4>Vassals</h4><ul><li>A vassal's <b>March +0</b> works like a player's March order, but a vassal can't march into a <b>port</b>, nor into an area controlled by its commander or its commander's other vassals.</li>" +
          "<li>A <b>commander</b> can't enter areas his vassals control.</li>" +
          "<li>A commander can't attack one of his own vassals, nor they him; and one of his vassals can't attack another (FAQ).</li>" +
          "<li>A vassal march that vacates a land area always leaves a Power token there to establish control.</li></ul>" : ""),
    src: (c) => "Rules p.15, p.24, p.26 · FAQ p.3–4" + (c.vassals.length || c.targ ? " · MoD " + [c.targ ? "p.5" : "", c.vassals.length ? "p.6–7" : "", c.targ ? "p.8" : ""].filter(Boolean).join(", ") + (c.vassals.length ? " · FAQ p.6" : "") : "")
  },
  {
    title: "Controlling Areas & Power Tokens on the Board",
    when: () => true,
    html: (c) => "<ul><li>You <b>control</b> a land area when at least one of your Footmen, Knights or Siege Engines is there, or you have established control there with a Power token.</li>" +
      "<li><b>Establish control</b> only when a March order empties a land area: place one Power token from your available power there. Never in a sea area; not possible with no available power; not when units leave the area any other way (such as a Wildling penalty).</li>" +
      "<li>The token stays if your units return, and leaves only when an opponent takes control (it goes back to the Pool). One Power token per area. You can't take back your own tokens (FAQ).</li>" +
      "<li>Power tokens on the board give no defense and are not Power icons (for Consolidate Power or the Game of Thrones card).</li>" +
      "<li><b>Home areas:</b> the printed House shield works like a Power token that can't be removed. An enemy controls it with units there, or by placing his Power token over the shield; if he leaves without one, control reverts to the original House.</li>" +
      "<li>Retreating units can never enter an area containing an enemy Power token.</li>" +
      "<li><b>FAQ:</b> control changes only when every step of a combat is complete — an emptied area never counts for the attacker during the combat.</li>" +
      (c.vassals.length ? "<li><b>Vassals</b> can't collect or spend Power tokens, but whenever a vassal resolves a March order that vacates a land area, it <b>always</b> places a Power token there to establish control. A commander can't enter areas his vassals control.</li>" : "") +
      (c.targ ? "<li><b>House Targaryen</b> establishes control with its Power tokens when vacating an area with a march, like any House. <b>Loyalty tokens</b> never give control and can share an area with any tokens and units.</li>" : "") + "</ul>",
    src: (c) => "Rules p.24 · FAQ p.3, p.5" + (c.vassals.length || c.targ ? " · MoD p.7" + (c.targ ? "–8" : "") : "")
  },
  {
    title: "Consolidate Power",
    when: () => true,
    html: (c) => "<ul><li>In turn order, one " + GT.ici("order-consolidate", "Consolidate Power Order token", "Consolidate Power order") + " at a time: remove the token and gain <b>1 Power token</b> plus <b>1 for each Power icon</b> printed in its area.</li>" +
      "<li>On a <b>sea area</b> it has no effect, but may still be placed (and can be raided).</li>" +
      "<li>In a <b>Port</b>: removed with no effect if enemy ships are in the connected sea area; otherwise it resolves like a land area with no Power icons.</li>" +
      "<li>" + GT.ici("special-consolidate", "Special Consolidate Power Order token", "<b>Special Consolidate Power:</b>") + " resolve it normally, or muster in its own area (Castle or Stronghold only; never in a Port).</li>" +
      (c.has("mod") ? "<li><b>Power improvements</b> (Mother of Dragons): an area with a power improvement token counts as having a printed Power icon; an icon covered by a degradation no longer counts.</li>" +
        "<li><b>Crown-icon orders</b> also resolve in this step, in turn order: the <b>Iron Bank</b> order (buy one loan" + (c.targ ? "" : "; blank without Targaryen") + ")" + (c.vassals.length ? " and the vassal <b>Defense +1/Muster</b> used as a Muster" : "") + ". " + (c.vassals.length ? "Neither is" : "It is not") + " a Consolidate Power order (FAQ).</li>" +
        (c.targ ? "<li>An Iron Bank order in a <b>Port</b> can be resolved even when enemy ships are in the adjacent sea area (FAQ).</li>" : "") : "") + "</ul>",
    src: (c) => "Rules p.13, p.16, p.22, p.25 · FAQ p.5" + (c.has("mod") ? " · MoD p.6, p.10 · FAQ p.6–7" : "")
  },
  {
    title: "Combat — Strength & Support",
    when: () => true,
    html: (c) => "<p>Combat starts when you march units into an area holding another House's units. The marching player is the <b>attacker</b>; the occupant is the <b>defender</b>; units lending strength from adjacent Support orders are <b>supporting</b>.</p>" +
      "<h4>The steps</h4><ol><li>Call for Support</li><li>Calculate Initial Combat Strength</li><li>Choose and Reveal House Cards" + (c.opt("tob") ? " (then draw Tides of Battle cards)" : "") + "</li><li>Use Valyrian Steel Blade" + (c.opt("tob") ? " (Tides of Battle redraw, reveal)" : "") + "</li><li>Calculate Final Combat Strength</li><li>Combat Resolution</li></ol>" +
      "<h4>Unit strength</h4><ul class='aid-icons'>" + GT.icl("strength-footman", "Footman", "<b>Footman</b> — 1") + GT.icl("strength-knight", "Knight", "<b>Knight</b> — 2") + GT.icl("strength-ship", "Ship", "<b>Ship</b> — 1") +
      GT.icl("strength-siege-engine", "Siege Engine", "<b>Siege Engine</b> — 4 when attacking (or supporting an attack on) an area containing a Castle or Stronghold; otherwise 0.") + "</ul><ul>" +
      "<li><b>Routed units</b> count as an unmodifiable 0 — whether attacking, defending or supporting — but still take part in the combat for card text such as Renly Baratheon's. Non-routed units sharing an area with routed units still support as normal (FAQ p.3).</li></ul>" +
      "<h4>1 · Call for Support (FAQ order)</h4><ul><li>In turn order, each House with Support orders adjacent to the embattled area (attacker and defender included) declares which of its supporting areas it offers to the attacker or to the defender — all to the same side — or refrains. It can't split its support between both sides.</li>" +
      "<li>The player offered support accepts or declines each declaration as it is made.</li>" +
      "<li>An area gives its <b>full</b> strength or none. Support can go to any adjacent combat, your own or other players'; a Support order isn't removed and may support any number of combats that round.</li>" +
      "<li>Never support an opponent against your own units. A Support order gives no defensive bonus to an attack on its own area (its units just defend).</li>" +
      "<li>Ships may support land or sea combats; Footmen, Knights and Siege Engines never support a combat in a sea area. Supporting Siege Engines count only for an attacker against a Castle or Stronghold.</li>" +
      "<li>Support only comes from an area adjacent to the <b>embattled area</b> (not the area the attackers left) — ship transport doesn't extend it (FAQ).</li></ul>" +
      "<h4>2 · Initial Combat Strength</h4><ul><li>Units in the combat + Defense order (defender) or March order (attacker) + supporting units and Special Support bonuses + Garrison (defender). Both players announce it.</li></ul>" +
      "<h4>5 · Final Combat Strength</h4><ul><li>Initial strength (recalculated if a House card changed it) + the House card's strength and text + the Valyrian Steel Blade's +1 if used" + (c.opt("tob") ? " + the Tides of Battle modifier" : "") + ".</li>" +
      "<li>Initial strength can be negative; final strength below 0 counts as 0 (FAQ).</li></ul>" +
      (c.has("mod") ? "<h4>Mother of Dragons</h4><ul>" +
        "<li><b>Gifting power during a combat</b> is allowed only in the <b>Call for Support</b> step, never in the other steps (FAQ).</li>" +
        (c.targ ? "<li>" + GT.ici("mod-dragon", "Dragon unit", "<b>Dragon</b>") + " strength = the number of " + GT.ici("mod-dragon-strength", "Dragon strength token", "dragon strength tokens") + " in the dragon strength box on the Essos board (<b>0</b> at the start). Dragons attack, defend and support following the normal rules.</li>" : "") +
        (c.vassals.length ? "<li><b>Combat with vassals:</b> a vassal's <b>commander</b> fights its combat on its behalf, using the normal combat steps with the changes under <i>Mother of Dragons — Vassals</i> (vassal House cards, Blade, clean up).</li>" +
          "<li>The vassal's <b>Raid/Support +1</b> left on the board supports whoever its commander decides, each time it is eligible.</li>" +
          "<li>A commander can't support an attack against one of his vassals; a vassal can't support an attack against its commander or another of its commander's vassals (FAQ).</li>" +
          "<li>On a player's House card, <b>“your opponent”</b> means the vassal itself, not its commander (FAQ).</li>" +
          "<li><b>Valyrian Steel Blade:</b> a commander holding it may use it to give his vassal +1 (flip it as normal); the vassal needn't be top of the Fiefdoms track.</li>" : "") + "</ul>" : ""),
    src: (c) => "Rules p.17–18, p.20, p.23 · FAQ p.3–4" + (c.opt("tob") ? " · FAQ p.1" : "") + (c.has("mod") ? (c.vassals.length || c.targ ? " · MoD " + [c.vassals.length ? "p.6" : "", c.targ ? "p.8" : ""].filter(Boolean).join(", ") : "") + " · FAQ p.1" + (c.vassals.length ? ", p.6" : "") : "")
  },
  {
    title: "Combat — House Cards & the Valyrian Steel Blade",
    when: () => true,
    html: (c) => "<h4>3 · Choose and Reveal House Cards</h4><ul><li>Attacker and defender each secretly choose one House card from hand and reveal together. Playing a card is <b>mandatory</b>.</li>" +
      "<li>A card shows a leader, a <b>Combat Strength</b> (added to yours), and either a <b>text ability</b> or <b>combat icons</b>.</li>" +
      "<li>Text abilities apply immediately unless they say otherwise. If timing conflicts:<ol><li>“Ignore” or “Cancel” abilities first, in Iron Throne order;</li><li>“Immediately…” abilities next (FAQ), then other conflicting abilities, in Iron Throne order;</li><li>“Win/lose this combat…” abilities once the outcome is known, in Iron Throne order;</li><li>“After combat…” abilities last of all, at the end of Combat Clean Up, after the cards are discarded (FAQ).</li></ol></li>" +
      "<li>Each card's ability is applied completely before the other's.</li></ul>" +
      "<h4>Combat icons</h4><ul class='aid-icons'>" + GT.icl("icon-sword", "Sword icon", "<b>Sword</b> — if you win, each Sword destroys one enemy unit in the embattled area.") + GT.icl("icon-fortification", "Fortification icon", "<b>Fortification</b> — if you lose, each Fortification cancels one of the victor's Swords.") + "</ul>" +
      "<h4>Your hand of seven</h4><ul><li>After combat both cards go faceup to their owners' discard piles and can't be used.</li>" +
      "<li>When your seventh card has been played, the other six return to your hand at the end of that combat; the last card stays in the discard pile.</li>" +
      "<li><b>FAQ:</b> discard piles are open information <b>at all times</b>, during combat too. Hands are open except while players choose cards in step 3.</li></ul>" +
      "<h4>4 · Use Valyrian Steel Blade</h4><ul><li>If the attacker or defender holds the Blade and it's unused this round, he may add <b>+1</b>; flip it to its faded side." + (c.opt("tob") ? " With Tides of Battle he may instead use it to redraw his Tides of Battle card." : "") + "</li></ul>" +
      (c.vassals.length ? "<h4>Vassal House cards (Mother of Dragons)</h4><ul><li>Vassals don't use the standard House cards. In step 3 the vassal's commander shuffles the common deck of <b>7 vassal House cards</b>, draws <b>three</b> as a temporary hand and chooses one to play.</li>" +
        "<li>The other two stay as the vassal's “hand” until the end of the combat, for card abilities. These cards work exactly like standard House cards.</li>" +
        "<li>Anyone may look through the whole vassal deck at any time <b>before</b> a player draws a hand from it during a combat.</li>" +
        "<li>In Combat Clean Up, all seven vassal House cards are shuffled back into one deck. Vassals have no discard pile, so <b>Robert Arryn</b>'s ability has no vassal cards to target (FAQ).</li></ul>" : "") +
      (c.has("mod") ? "<h4>Mother of Dragons House card errata (FAQ)</h4><ul>" +
        "<li><b>Xaro Xhoan Daxos:</b> “If you have more ships in the embattled area than your opponent, each of your ships in the embattled area add an additional +1 combat strength.”</li>" +
        "<li><b>Rakharo:</b> “If the embattled area is a land area that does not contain a stonghold [sic] or a castle, each of your knights in the embattled area add an additional +2 combat strength.”</li>" +
        (c.targ ? "<li><b>Viserys Targaryen</b> discarding the <b>Khal Drogo</b> card doesn't remove Drogo from the game: a House card's text only works when it is the card played in a combat (FAQ).</li>" : "") + "</ul>" : "") +
      (c.opt("alt") ? "<h4>A Dance With Dragons House cards (Alternate House Card Set — FAQ)</h4><ul>" +
        "<li><b>Ser Addam Marbrand</b> (errata): “If you are attacking, all of your participating knights (including supporting Lannister knights) add an additional +1 combat strength.”</li>" +
        "<li><b>Paxter Redwyne</b> (errata): “If the embattled area is a sea area, all of your participating ships (including supporting Tyrell ships) add an additional +1 combat strength.”</li>" +
        "<li><b>Mance Rayder</b> gives at most <b>10</b> strength: the Wildling Threat token can't reach 12 during the Action Phase.</li>" +
        "<li><b>Rodrick the Reader</b>: the chosen Westeros “deck” is only its facedown, unused cards — not its discard pile.</li></ul>" +
        "<p class='inline-note'>The base-game House card errata and rulings below concern the base cards, which the Alternate House Card Set replaces (MoD p.4).</p>" : "") +
      "<h4>Card errata (FAQ)</h4><ul><li><b>Victarion Greyjoy:</b> “If you are attacking, all of your participating ships (including supporting Greyjoy ships) add an additional +1 combat strength.”</li>" +
      "<li><b>Kevan Lannister:</b> “If you are attacking, all of your participating footmen (including supporting Lannister footmen) add an additional +1 combat strength.”</li></ul>" +
      "<h4>Card rulings (FAQ)</h4><ul>" +
      "<li>A card needing you to be (or not be) supported counts support from any House that backs you.</li>" +
      "<li><b>Robb Stark</b> works when Stark wins as defender: Stark chooses where the attacker retreats — the area it marched from, or one adjacent (or ship-connected) area controlled by no one or by the attacker, if that keeps the attacker within supply.</li>" +
      "<li><b>Roose Bolton</b> vs <b>Patchface</b>: Roose first (Stark takes his hand back), then Patchface discards from that hand. Patchface against a last card discards one of the retrieved cards. A card discarded by an effect as your last card stays in the discard pile; the other six return.</li>" +
      "<li><b>Renly Baratheon</b> may upgrade a routed Footman; the new unit stays routed until the end of the round.</li>" +
      "<li><b>Salladhor Saan</b> sets non-Baratheon ships to 0 but doesn't cancel order bonuses. Against <b>Victarion Greyjoy</b>, turn order decides: if Greyjoy is first, Salladhor resolves after Victarion and the ships are 0.</li>" +
      "<li><b>Tyrion Lannister</b> returning Greyjoy's card: Greyjoy may choose <b>Aeron Damphair</b> and use him to replay it.</li>" +
      "<li><b>Doran Martell</b>: a moved House may have its turn skipped or come next; Special Orders on the board stay; a Dominance token changes hands in its current state.</li>" +
      "<li><b>Loras Tyrell</b> vs <b>Arianne Martell</b>: the March order may technically move in, but it is removed at the end of Combat Cleanup.</li>" +
      "<li><b>Mace Tyrell</b> destroying the last defender: the combat continues.</li>" +
      "<li><b>Queen of Thorns</b> removing a Support order: those supporting units no longer count in the final strength.</li></ul>",
    src: (c) => {
      const m = [c.opt("alt") ? "p.4" : "", c.vassals.length ? "p.6" : ""].filter(Boolean);
      return "Rules p.19–20" + (c.opt("tob") ? ", p.29" : "") + (m.length ? " · MoD " + m.join(", ") : "") +
        " · FAQ p.1–3" + (c.opt("alt") ? ", p.5" : "") + (c.vassals.length || c.targ ? ", p.6" : "");
    }
  },
  {
    title: "Combat Resolution — Casualties, Retreats & Routing",
    when: () => true,
    html: (c) => "<ol><li><b>Determine the victor</b> — higher final Combat Strength wins; a tie goes to the House higher on the <b>Fiefdoms</b> track.</li>" +
      "<li><b>Casualties</b> — only the loser: destroy one of his units in the embattled area per victor's <b>Sword</b> minus loser's <b>Fortification</b> (zero or less: none). The loser chooses which (unless a played House card's text says otherwise); supporting units are never casualties; a Knight counts as one casualty like any unit." + (c.opt("tob") ? " Swords and Fortifications on Tides of Battle cards count as if printed on the House card." : "") + "</li>" + (c.opt("tob") ? "<li><b>Skull casualties</b> (Tides of Battle) — next, if a player's Tides of Battle card shows a <b>Skull</b>, the <i>opposing</i> player suffers one more casualty, whichever side won. Fortifications can't prevent it, and it follows the normal casualty rules.</li>" : "") +
      "<li><b>Retreats and routing</b> — see below.</li>" +
      "<li><b>Combat clean up</b> — remove the attacker's March order. If the attacker won, also remove the defender's order and Power token in the area; if the defender won, they stay. Discard both House cards. Then remove every order token in an area without units (FAQ).</li></ol>" +
      "<h4>Casualty rulings (FAQ)</h4><ul><li><b>Siege Engines</b> can't be chosen to satisfy casualties: the loser's Siege Engines in the embattled area are destroyed automatically, in addition to the other casualties (supporting Siege Engines are unaffected).</li><li>If the victor suffers casualties that eliminate all of his units in the embattled area, the loser must still retreat.</li><li>Routed units are never chosen as casualties.</li></ul>" +
      "<h4>Retreats</h4><ul><li>The losing army retreats from the embattled area; supporting units don't.</li>" +
      "<li><b>Attacker lost:</b> his survivors go back to the area they marched from.</li>" +
      "<li><b>Defender lost:</b> all survivors go together to <b>one</b> adjacent area (or one connected by his ships — FAQ) that is <b>empty</b> (no enemy units or enemy Power token) or <b>friendly</b> — never the area the attackers came from, even if empty.</li>" +
      "<li>If his only option would break his supply limit, he first destroys enough retreating units to comply. No legal area: all retreating units are destroyed.</li>" +
      "<li>Footmen and Knights never retreat into a sea area or port; Ships never onto land; Ships retreat into a Port only if their House controls its land area (FAQ). Ship transport may be used to retreat.</li>" +
      "<li><b>Siege Engines</b> can't retreat — forced to, they are destroyed.</li>" +
      "<li>March out of an enemy home area without leaving a Power token and lose the combat: you have no legal retreat and are destroyed (FAQ).</li></ul>" +
      "<h4>Routed units</h4><ul><li>Retreated units are laid on their sides: <b>routed</b>.</li><li>They add no strength but still count for supply, can't be chosen as casualties and can't move, even if a March order resolves in their area.</li><li>A routed unit forced to retreat again is destroyed.</li><li>They stand up again in the Action Phase Clean Up.</li></ul>" +
      (c.targ ? "<h4>Dragons</h4><ul><li>Dragons can be chosen as casualties. A destroyed Dragon is <b>permanently removed</b> from the game and can't be mustered or brought back (outside certain card abilities).</li>" +
          "<li>Dragons follow all the normal retreat rules (back to the area they marched from, retreat using Ships, and so on). They can't fly when retreating — except when forced back to the area they flew from.</li>" +
          "<li><b>Loyalty tokens</b> in the embattled area: Targaryen gains them only once it controls the area — it must win the combat and have at least one surviving unit there (FAQ). Arianne Martell's card, for example, would stop it.</li></ul>" : "") +
      (c.vassals.length ? "<h4>Vassals</h4><ul><li><b>Combat Clean Up:</b> shuffle all seven vassal House cards back into one deck.</li>" +
          "<li><b>Power reward:</b> after a combat involving a vassal, if the vassal <b>won</b> — attacking or defending — its commander gains <b>one Power token</b> for his player House.</li>" +
          "<li>If a vassal must lose units (casualties, supply), its commander makes the choices for it.</li></ul>" : ""),
    src: (c) => "Rules p.16, p.20–21, p.24 · FAQ p.1, p.3–5" + (c.opt("tob") ? " · Rules p.29" : "") + (c.vassals.length || c.targ ? " · MoD " + [c.vassals.length ? "p.6–7" : "", c.targ ? "p.8" : ""].filter(Boolean).join(", ") + (c.targ ? " · FAQ p.6" : "") : "")
  },
  {
    title: "Tides of Battle (optional module)",
    when: (c) => c.opt("tob"),
    html: () => "<p>All players agree to use it before the game. Combat steps with Tides of Battle (FAQ v2.0 order):</p>" +
      "<ol><li>Call for Support</li><li>Calculate Initial Combat Strength</li>" +
      "<li>Choose and Reveal House Cards — <i>reshuffle all Tides of Battle cards into a new deck first (FAQ)</i>; each player chooses a House card; both reveal (some text abilities happen now); then the attacker and defender each <b>draw one Tides of Battle card</b> and look at it privately.</li>" +
      "<li>Use Valyrian Steel Blade — (optional) its holder may <b>discard his Tides of Battle card and draw a replacement</b>, which he must keep, flipping the Blade; then both <b>reveal</b> their Tides of Battle cards; then (optional) the Blade's <b>+1</b>, if it hasn't been used.</li>" +
      "<li>Calculate Final Combat Strength — add the number in your card's shield.</li>" +
      "<li>Combat Resolution — victor; casualties from Swords and text abilities; then casualties from <b>Skulls</b>; then retreats and routing; then combat clean up.</li></ol>" +
      "<ul><li><b>Swords and Fortifications</b> on your Tides of Battle card count as if printed on your House card.</li></ul>" +
      "<ul class='aid-icons'>" + GT.icl("icon-skull", "Skull icon", "<b>Skull:</b> the <i>opposing</i> player suffers one casualty, whoever won. Fortifications can't prevent it; it follows the normal casualty rules.") + "</ul>" +
      "<ul><li><b>Garrisons</b> are immune to Skulls.</li></ul>",
    src: () => "Rules p.26, p.29 · FAQ p.1"
  },
  {
    title: "Wildling Attacks",
    when: () => true,
    html: (c) => "<ul><li>An attack happens when the Wildling Threat token reaches <b>12</b> (Westeros Phase step 3), or when a <b>Wildlings Attack</b> Westeros card resolves.</li>" +
      "<li>Westeros cards with a " + GT.ici("wildling-icon", "Wildling icon", "Wildling icon") + " each move the token one space (up to three spaces in one Westeros Phase).</li></ul>" +
      "<ol><li><b>Wildling strength</b> — the number at the Wildling Threat token's position.</li>" +
      "<li><b>Bid power</b> — each player hides his available power and secretly bids in a closed fist" + (c.vassals.length ? ". <b>Vassals don't bid</b>" : "") + (c.targ ? (c.vassals.length ? "; " : ". ") + "<b>Targaryen bids as normal</b>" : "") + ".</li>" +
      "<li><b>Night's Watch strength</b> — reveal together; add up every player's bid.</li>" +
      "<li><b>Outcome</b> — Night's Watch strength <b>equal to or greater than</b> the wildlings': the attack is defeated. Otherwise the wildlings win.</li>" +
      "<li><b>Adjust the track</b> — Night's Watch won: reset the token to <b>0</b>. Wildlings won: move it back only <b>two</b> positions (minimum 0).</li>" +
      "<li><b>Discard</b> every Power token bid, whatever the result.</li></ol>" +
      "<h4>Consequences (once step 4 decides the outcome)</h4><ol><li>Reveal the top Wildling card.</li>" +
      "<li><b>Night's Watch victory:</b> the <b>highest bidder</b> receives the “Night's Watch Victory” reward.<br><b>Wildling victory:</b> the <b>lowest bidder</b> suffers the severe penalty and everyone else the lesser one (both under “Wildling Victory”). The lowest bidder resolves first, then everyone else in turn order (FAQ).</li>" +
      "<li>Place the Wildling card facedown at the bottom of the Wildling deck.</li></ol>" +
      "<ul><li>Ties for highest or lowest bidder are decided by the holder of the Iron Throne token.</li>" +
      "<li>A <b>Wildlings Attack</b> card resolves even with the token on 0: players still bid and the Night's Watch is guaranteed to win (FAQ).</li></ul>" +
      "<h4>Wildling card rulings (FAQ)</h4><ul><li><b>Preemptive Raid:</b> the lowest bidder may choose an option he can't fully fulfil (e.g. option B while already last on every track).</li>" +
      "<li><b>Massing on the Milkwater</b> with two cards of equal strength left: discard one, then discard the last and keep it in the discard pile while retrieving the other six (including the first).</li>" +
      "<li><b>The Horde Descends:</b> the two units the lowest bidder destroys must come from one area with a Castle or Stronghold.</li>" +
      "<li><b>A King Beyond the Wall</b> moves Houses on the Influence tracks (see <i>Influence Tracks</i>)" + (c.targ ? ". It can't move Targaryen up from space 8, and a House sent to the lowest position goes to space 7 instead (FAQ)" : "") + ".</li></ul>" +
      (c.vassals.length || c.targ ? "<h4>Mother of Dragons</h4><ul>" +
        (c.vassals.length ? "<li><b>Vassals</b> don't take part in bids against wildling attacks, gain no benefit and suffer no penalty from Wildling cards, and can't be chosen as the highest or lowest bidder.</li>" : "") +
        (c.targ ? "<li><b>House Targaryen</b> bids against wildling attacks as normal and is subject to every effect on the Wildling cards.</li>" : "") + "</ul>" : ""),
    src: (c) => "Rules p.7, p.22–23, p.27 · FAQ p.1, p.4" + (c.vassals.length || c.targ ? " · MoD " + [c.vassals.length ? "p.7" : "", c.targ ? "p.8" : ""].filter(Boolean).join(", ") + (c.targ ? " · FAQ p.6" : "") : "")
  },
  {
    title: "Neutral Forces & Garrisons",
    when: () => true,
    html: (c) => "<h4>Neutral Force tokens</h4><ul><li>" + GT.ici("neutral-force", "Neutral Force token (The Boneway, strength 3, used with four or five players)") + " Each token shows its area, its strength (right) and its player range (lower left).</li>" +
      "<li>March into a Neutral Force's area only with enough strength to destroy it: <b>equal or exceed</b> its printed strength with:<ul>" +
      "<li>the marching units' strength (Siege Engines only if the area has a Castle or Stronghold);</li><li>the March order's bonus or penalty;</li><li>support for <b>you</b> from adjacent areas (the Neutral Force gets none).</li></ul></li>" +
      "<li>No House cards are played, and the Valyrian Steel Blade can't be used.</li>" +
      "<li>Success: the token is removed from the game and your units move in. It counts as that March order's one attack.</li>" +
      (c.has("mod")
        ? "<li><b>Mother of Dragons:</b> the vassal system replaces most Neutral Forces. Only <b>King's Landing</b> (base game, strength 5)" + (c.targ ? " and <b>Braavos</b> (this expansion, strength 5, on the Essos board) are" : " is") + " used; every other Neutral Force token stays in the box.</li>" +
          (c.targ ? "<li>" + GT.ici("mod-braavos-front", "Braavos Neutral Force token, front", "<b>Braavos:</b>") + " the first player to defeat its Neutral Force places the token " + GT.ici("mod-braavos-back", "Braavos Neutral Force token, back", "<b>facedown</b>") + " in front of him: while he has it, each loan's initial cost is −1 for him (not the interest). Whoever takes control of Braavos later receives the token immediately; if no player controls Braavos, it is set aside until someone does.</li>" : "")
        : "<li>" + GT.ici("neutral-insurmountable", "Neutral Force token marked “~” (Pyke, three-player side)", "<b>~ tokens</b>") + " (three-player game) are insurmountable: those areas can't be entered for the whole game.</li>") + "</ul>" +
      "<h4>Garrisons</h4><ul><li>Each House starts with a " + GT.ici("garrison-token", "Garrison token (Lannisport, strength 2)", "Garrison") + " on its home area. It is not a unit: no supply, no orders (an area with only a Garrison takes no order).</li>" +
      "<li>If its home area is attacked, the Garrison's printed strength is added to the defender's initial strength. With no units there, combat still happens as if the Garrison were a single unit.</li>" +
      "<li>A Garrison defeated in combat is removed from the game, whatever the Swords and Fortifications" + (c.targ ? " — except that Targaryen's " + GT.ici("mod-pentos-garrison", "Pentos Garrison token", "<b>Pentos</b> Garrison") + " goes back on Pentos whenever Targaryen regains control of it" : "") + ".</li>" +
      "<li>It only defends — never supports or anything else" + (c.opt("tob") ? " — and is immune to Tides of Battle Skulls" : "") + ".</li>" +
      (c.has("mod") ? "<li>Mother of Dragons adds the Garrisons of <b>The Eyrie</b> (Arryn)" + (c.targ ? " and <b>Pentos</b> (Targaryen)" : "") + (c.vassals.length ? "; vassals have Garrisons too" : "") + ".</li>" : "") + "</ul>",
    src: (c) => "Rules p.4, p.26" + (c.opt("tob") ? ", p.29" : "") + (c.has("mod") ? " · MoD p.2, p.4–5" + (c.targ ? ", p.7, p.9" : "") : "")
  },
  {
    title: "Ship Transport, Ports & the Board",
    when: () => true,
    html: (c) => "<h4>Ship transport</h4><ul><li>Two land areas count as <b>adjacent for marching and retreating</b> when a chain of one or more sea areas, each with your Ships, connects them.</li>" +
      "<li>Reuse the same ships any number of times per round, even several times in one March order. Never another House's ships, even with permission.</li>" +
      "<li>Works whatever order is on the ships, and with routed ships. Land units may attack through it (still one combat per march). Ships can't be transported.</li>" +
      "<li>It doesn't make areas adjacent for anything else — not support, not raids.</li></ul>" +
      "<h4>Ports</h4><ul><li>A Port sits between a land area and a sea area; only the controller of its land area may use it.</li>" +
      "<li>Only Ships occupy a Port: <b>at most three</b>; 2+ ships there are an army under supply.</li>" +
      "<li>Ships in a Port need an order. Defense orders have no effect there — Ports can't be attacked directly.</li>" +
      "<li>Ships move between a Port and its sea area; never into another player's Port. They support only combats in the adjacent sea area, give no defense to the land area, and raid only the adjacent sea area.</li>" +
      "<li><b>Mustering</b> may place ships in the Port even when enemy ships hold its sea area.</li>" +
      "<li><b>Taking an enemy Port:</b> win and control its land area, then replace the enemy ships there with your own available ships (as many as you have, want and supply allows); excess enemy ships are removed.</li>" +
      "<li><b>FAQ:</b> “connected” and “adjacent” sea area mean the same. Ships left in a Port whose land area no one controls are destroyed at once (if it's an enemy home area, that House may replace them with its own).</li></ul>" +
      "<h4>Rivers, bridges and islands</h4><ul><li><b>Rivers</b> — areas divided by a river are <b>not</b> adjacent for any purpose.</li><li>" + GT.ici("bridge", "Bridge", "<b>Bridges</b>") + " — areas across a river joined by a bridge <b>are</b> adjacent for all purposes.</li>" +
      "<li><b>Islands</b> — Dragonstone, Pyke and The Arbor are land areas surrounded by sea: land units reach or leave them only by ship transport. Small islands without a white border are scenery.</li></ul>" +
      (c.has("mod") ? "<h4>Mother of Dragons boards</h4><ul><li><b>The Eyrie</b> and <b>The Bite</b> overlays sit on the main board for the whole game (placed in setup).</li>" +
        (c.targ ? "<li><b>The Essos side board</b> extends the play space with new sea and land areas. Every House may move between the sea areas of the Westeros board and the adjacent sea areas of the Essos board as if they were directly adjacent.</li>" +
          "<li>While the Essos board is in play, any rule that refers to the “game board” refers to both boards.</li>"
          : "<li>No Targaryen player: the Essos side board isn't used.</li>") + "</ul>" : ""),
    src: (c) => "Rules p.9, p.15, p.21, p.23, p.25, p.27 · FAQ p.5" + (c.has("mod") ? " · MoD p.3, p.5" : "")
  },
  {
    title: "Alliances & Hidden Information",
    when: () => true,
    html: (c) => "<h4>Alliances</h4><ul><li>Promises and alliances are allowed at any time — and are <b>never binding</b>.</li>" +
      "<li>Never show anyone an assigned Order token, nor your unused Order tokens during the Planning Phase.</li>" +
      "<li>Never give, donate or bribe with game items — " + (c.has("mod") ? "Dominance tokens, Order tokens, House cards. <b>Power tokens are the exception</b> with Mother of Dragons (below)" : "Power tokens, Dominance tokens, Order tokens, House cards") + ".</li>" +
      "<li>Bids are always secret until revealed.</li></ul>" +
      (c.has("mod") ? "<h4>Gifting Power tokens (Mother of Dragons)</h4><ul><li>Players may freely gift Power tokens to other players <b>at any time</b>: the giver puts that many of his Power tokens into the Power Pool, and the receiver takes the same number of his own from the Pool into his available power.</li>" +
        "<li><b>During a combat</b>, power can be gifted only in the <b>Call for Support</b> step (FAQ).</li>" +
        "<li>A player <b>may refuse</b> gifted Power tokens (FAQ)." + (c.targ ? " Targaryen's distribution of its bid during a Clash of Kings is different: that can't be refused." : "") + "</li></ul>" : "") +
      "<h4>Hidden information</h4><ul><li>Unused Order tokens stay behind your screen.</li><li>Available power stays visible except during bidding: announce your total, pull it behind your screen for the bid, then put it back out.</li>" +
      "<li>House cards: discard piles are always open (FAQ); hands are open except while choosing cards in combat step 3.</li></ul>",
    src: (c) => "Rules p.19, p.24, p.27 · FAQ p.1, p.5" + (c.has("mod") ? ", p.7 · MoD " + (c.targ ? "p.8, p.10" : "p.10") : "")
  },
  {
    title: "Winning the Game",
    when: () => true,
    html: (c) => "<ul><li>Keep your <b>Victory</b> token at the number of areas you control containing a " + GT.ici("castle", "Castle", "Castle") + " or " + GT.ici("stronghold", "Stronghold", "Stronghold") + ", at all times.</li>" +
      "<li>The moment a House reaches <b>7</b> on the Victory track, the game ends and it wins.</li>" +
      "<li>Otherwise, at the end of round <b>10</b> the highest House on the Victory track wins. <b>Ties (FAQ v2.0, replacing p.16):</b><ol><li>most total land areas controlled;</li><li>highest position on the Supply track;</li><li>highest position on the Iron Throne track.</li></ol></li>" +
      "<li>A player with no Castles, Strongholds or units left is <b>not eliminated</b>; he plays on with what he has (FAQ).</li>" +
      "</ul>" +
      (c.has("mod") ? "<h4>Mother of Dragons</h4><ul>" +
        (c.targ ? "<li><b>House Targaryen</b> doesn't score castles and strongholds: its Victory track counts the <b>loyalty tokens</b> it has gained. It starts on <b>1</b> for controlling Pentos, its home area (which has a printed loyalty token).</li>" +
          "<li>Whenever an area Targaryen controls holds loyalty tokens (outside of combat), Targaryen gains them: remove each from the board (it can be placed again later) and advance one space per token. A token placed or moved into an area Targaryen controls is gained and scored at once (FAQ).</li>" +
          "<li>Points from loyalty tokens are <b>never lost</b>. Targaryen loses a point only by losing control of <b>Pentos</b> (back one space); regaining Pentos moves it forward one space again.</li>" +
          "<li>The moment Targaryen reaches <b>7</b>, it wins. The book adds no other end-of-game rule for Targaryen: at the end of round 10 its Victory track position is compared like any House's.</li>" +
          "<li><b>Degraded castles:</b> an area whose Castle or Stronghold icon is covered by a <b>degradation</b> token (the Pyromancer loan degrades a castle) is treated as having no Castle or Stronghold, so it no longer counts on the Victory track.</li>" : "") +
        (c.vassals.length ? "<li><b>Vassals</b> can't win or lose the game.</li>" : "") +
        "<li><b>Flexible player attendance:</b> if a player " + (c.targ ? "(other than Targaryen) " : "") + "leaves the session early, between rounds, his House and all its units become a <b>vassal</b>: remove its Victory token and place it near the Iron Throne track as a new vassal marker.</li></ul>" : ""),
    src: (c) => "Rules p.2, p.7, p.9, p.16 · FAQ p.1, p.5" + (c.has("mod") ? " · MoD " + (c.targ ? "p.7–8, p.10, p.12" : c.vassals.length ? "p.7–8" : "p.8") + (c.targ ? " · FAQ p.6" : "") : "")
  },
  {
    title: "Playing with Fewer than Six Players",
    when: (c) => !c.has("mod"),
    html: (c) => "<ul>" + [5, 4, 3].map(p => "<li" + (p === c.p ? " class='here'" : "") + "><b>" + p + " players" + (p === c.p ? " (this game)" : "") + ":</b> no " + GT.names(GT.baseExcluded[p]) + "; " +
      (p === 3 ? "all 14 Neutral Force tokens on their <b>3</b> side (King's Landing 5, The Eyrie 6, the rest insurmountable)" : GT.neutralFor(p).length + " Neutral Force tokens (" + (p === 5 ? "4-6 and 4-5" : "4-6, 4-5 and 4") + ")") +
      "; Influence tokens slid left" + (p <= 4 ? "; King's Court Overlay on the first four positions" : "") + ".</li>").join("") +
      "<li" + (c.p === 6 ? " class='here'" : "") + "><b>6 players" + (c.p === 6 ? " (this game)" : "") + ":</b> every House; only the two 4-6 Neutral Force tokens (King's Landing, The Eyrie).</li></ul>",
    src: () => "Rules p.4, p.28"
  },
  {
    title: "FAQ v2.0 — What Changed",
    when: () => true,
    html: (c) => "<p>The Errata and FAQ version 2.0 is the newest official ruling and overrides the rulebook" + (c.has("mod") ? " and the Mother of Dragons book" : "") + ". This page applies it throughout. Rules changes:</p><ul>" +
      "<li><b>Messenger Raven</b> is used at the end of the <b>Reveal Orders</b> step (not Assign Orders).</li>" +
      "<li><b>Tiebreakers</b> at the end of round 10: most land areas, then Supply, then Iron Throne (replacing Strongholds, Supply, available power, Iron Throne).</li>" +
      "<li><b>Lannister player screen:</b> 1 Ship in The Golden Sound, 1 Ship in the port at Lannisport, 1 Knight and 1 Footman in Lannisport, 1 Footman in Stoney Sept.</li>" +
      "<li><b>Discarded House cards</b> are open information at all times, including during combat.</li>" +
      "<li><b>Order tokens in areas without units</b> are removed at the end of each combat's Clean Up.</li>" +
      "<li><b>Wildling penalties:</b> the lowest bidder resolves first, then everyone else in turn order.</li>" +
      "<li><b>Tides of Battle:</b> the full step order, and a reshuffle of the whole deck before every combat's House card step.</li>" +
      "<li><b>Card errata:</b> Winter Is Coming, Victarion Greyjoy, Kevan Lannister (texts under the relevant sections).</li>" +
      "</ul>" +
      (c.has("mod") ? "<h4>Mother of Dragons in the FAQ</h4><ul>" +
        "<li><b>Gifting power</b> during a combat only in the Call for Support step; a player may refuse a gift.</li>" +
        "<li><b>Card errata:</b> Xaro Xhoan Daxos and Rakharo (texts under <i>Combat — House Cards</i>).</li>" +
        "<li><b>No King's Court Overlay</b> with vassals, at any player count.</li>" +
        "<li><b>Iron Bank sea orders</b> without the Essos board are blank sea orders; one in a Port resolves even with enemy ships next to it; Feast for Crows doesn't stop it.</li>" +
        (c.vassals.length ? "<li><b>Vassals:</b> “your opponent” means the vassal; Robert Arryn finds no vassal discard pile; several vassals are selected together; vassals are in turn order; Defense/Muster is a Defense order (Storm of Swords stops it, as it stops Defense +3) and stays after defending; commanders and their vassals never attack, raid or support against each other.</li>" : "") +
        (c.targ ? "<li><b>Targaryen:</b> never shifted up from space 8 (a “lowest position” shift goes to 7); Khal Drogo discarded by Viserys isn't removed from the game (a House card's text works only when it is the card played); loyalty tokens only on land and scored at once in a controlled area, but not mid-combat; the Blade holder may destroy a Dragon for unpaid interest; no Siege Engines ever; bid power is distributed before ties are broken.</li>" +
          "<li><b>Loans:</b> fulfil as much of the effect as you can, never ignore any of it on purpose, and you may buy a loan you can't fully use; degrading Braavos's castle doesn't cancel the Braavos token; a degraded castle's Port still works.</li>" +
          "<li><b>Westeros IV cards:</b> Fire Made Flesh, Playing With Fire, Word Spreads Quickly and Scattering Dissent rulings (under <i>Westeros Cards Explained</i>).</li>" : "") +
        (c.opt("alt") ? "<li><b>A Dance With Dragons cards</b> (Alternate House Card Set): Ser Addam Marbrand and Paxter Redwyne errata; Mance Rayder and Rodrick the Reader rulings.</li>" : "") + "</ul>" : ""),
    src: (c) => "FAQ p.1–2" + (c.has("mod") ? (c.opt("alt") ? ", p.5" : "") + ", p.6–7" : "")
  },
  /* ---- Mother of Dragons sections ---- */
  {
    title: "Mother of Dragons — At a Glance",
    when: (c) => c.has("mod"),
    html: (c) => "<ul><li><b>No modular content:</b> all of the expansion's content must be used unless the rules say otherwise — vassals, sea orders, the overlays and the track extension. The rules themselves say the Essos board, Iron Bank and Targaryen components are used only when a player is House Targaryen.</li>" +
      "<li><b>Eight Houses:</b> Arryn and Targaryen join the six base Houses, for up to eight players.</li>" +
      "<li><b>Vassals:</b> every House except Targaryen that no player chose is a vassal.</li>" +
      "<li><b>Targaryen:</b> needs four or more players; if no one picks it, it takes no part (it never becomes a vassal).</li>" +
      "<li><b>Setup</b> replaces Rules p.4 entirely; the Influence tracks start in one fixed order; only King's Landing" + (c.targ ? " and Braavos" : "") + " hold Neutral Forces; no King's Court Overlay.</li></ul>" +
      "<table class='ref-table'><thead><tr><th>Players</th><th>Targaryen</th><th>Vassals</th></tr></thead><tbody>" +
      [3, 4, 5, 6, 7, 8].map(p => {
        const here = p === c.p;
        const v = p === 3 ? "4 (the top Iron Throne player holds two vassal sets)" : p === 8 ? "none — Targaryen plays" : (7 - p) + " without Targaryen · " + (8 - p) + " with Targaryen";
        return "<tr" + (here ? " class='here'" : "") + "><td>" + p + (here ? " <b>(this game)</b>" : "") + "</td><td>" + (p === 3 ? "not available" : p === 8 ? "always in play" : "optional") + "</td><td>" + (p === 7 ? "0 without Targaryen · 1 with Targaryen" : v) + "</td></tr>";
      }).join("") + "</tbody></table>" +
      "<p class='inline-note'>This game: " + GT.names(c.houses) + (c.vassals.length ? "; vassals " + GT.names(c.vassals) : "; no vassals") + ".</p>",
    src: () => "MoD p.2–5, p.7 · FAQ p.6"
  },
  {
    title: "Mother of Dragons — Vassals",
    when: (c) => c.has("mod") && c.vassals.length > 0,
    html: (c) => "<p>A <b>vassal</b> is a neutral House commanded by a player House as an extension of his forces. Who commands which vassal can change every round. <b>This game:</b> " + GT.names(c.vassals) + ".</p>" +
      "<h4>Choosing vassals — start of every Planning Phase</h4><ol>" +
      "<li>Place each vassal's <b>vassal marker</b> (its Victory Point token) near the Iron Throne track.</li>" +
      "<li>The highest players on the Iron Throne track each receive a <b>set of four vassal order tokens</b> — one set per vassal" + (c.p === 3 ? " (with three players the top player takes two sets)" : "") + ". Which set doesn't matter: the icons on their backs only tie a set together.</li>" +
      "<li>In turn order, each player holding a set selects a vassal to <b>command</b>: he takes its marker and puts it in front of his screen. He is its <b>commander</b> until the beginning of the next Planning Phase.</li>" +
      "<li>Or he <b>passes</b>, handing his set to the next player on the Iron Throne track, who may choose or pass in turn.</li>" +
      "<li>The <b>last player on the track can't pass</b> and must command all remaining vassals.</li>" +
      "<li>Passing can leave a player with several sets: he chooses a vassal or passes for each set — but the last player on the track can't pass. He selects (or passes) for all his sets at the same time (FAQ).</li></ol>" +
      "<h4>Ordering vassals</h4><ul><li><b>After</b> players assign orders for their own Houses, each commander, in turn order, places <b>up to two</b> tokens from his set of four for each vassal he commands.</li>" +
      "<li>Each must go in an area containing a unit of that vassal. Some vassal areas may get no order.</li>" +
      "<li>Vassals resolve their orders exactly like player Houses, in their own turn-order position on the Iron Throne track; the commander resolves the order on the board for it. Vassals are part of turn order (FAQ).</li>" +
      "<li>The <b>Messenger Raven</b> can't swap a vassal's order token.</li></ul>" +
      "<h4>Vassal order tokens</h4>" + GT.vassalOrderList() +
      "<p class='inline-note'>The book doesn't explain the +1 printed on the Raid/Support token. On the base Special Support +1, a printed +1 means the supporting strength from that area is +1 (Rules p.22).</p>" +
      "<ul><li><b>FAQ:</b> the Defense +1/Muster token is not removed after it is used for defense. It can defend again, and/or be used as a Muster order in the Resolve Consolidate Power Orders step.</li>" +
      "<li><b>FAQ:</b> Storm of Swords forbids placing or executing the Defense +1/Muster and the Defense +3 (both are Defense orders).</li></ul>" +
      "<h4>Combat with vassals</h4><ul><li>The commander resolves the combat on the vassal's behalf, with the normal combat steps changed as follows:</li>" +
      "<li><b>Choose and Reveal House Cards:</b> vassals use the common deck of <b>7 vassal House cards</b>. The commander shuffles it, draws three as a temporary hand and chooses one to play. The other two remain the vassal's “hand” until the end of combat, for card abilities. Anyone may look at the whole vassal deck any time before a hand is drawn during a combat.</li>" +
      "<li><b>Use Valyrian Steel Blade:</b> a commander holding the Blade may use it for +1 to his vassal's strength (flip it as normal); the vassal needn't be top of the Fiefdoms track.</li>" +
      "<li><b>Combat Clean Up:</b> all seven vassal House cards are shuffled back into one deck.</li>" +
      "<li><b>Power reward:</b> if the vassal wins the combat, attacking or defending, its commander gains <b>one Power token</b> for his player House.</li>" +
      "<li><b>FAQ:</b> on a player's House card, “your opponent” is the vassal itself. The commander only plays on its behalf — the Valyrian Steel Blade is the one exception.</li>" +
      "<li><b>FAQ:</b> vassals have no discard pile, so Robert Arryn's card has no vassal cards to remove.</li></ul>" +
      "<h4>Commanders and their own vassals (FAQ)</h4><ul><li>A commander can't attack one of his vassals, and a vassal can't attack its commander.</li>" +
      "<li>A commander can't attack or raid his own vassals, and none of his vassals can attack or raid him or another of his vassals.</li>" +
      "<li>A commander can't support an attack made against one of his vassals; a vassal can't support an attack against its commander or another of its commander's vassals.</li>" +
      "<li>A commander can't enter areas his vassals control (MoD). A vassal can't march into an area controlled by its commander or his other vassals, nor into a port.</li></ul>" +
      "<h4>Bidding, Dominance and the Wildlings</h4><ul><li>Vassals change positions on the Influence tracks during a Clash of Kings, but automatically bid <b>zero</b>" + (c.targ ? " — unless Targaryen gives them power" : "") + ".</li>" +
      "<li>Vassals can't gain Dominance tokens: if a vassal is highest on a track, the player House in the next-highest position takes the token.</li>" +
      "<li>Vassals don't bid against wildling attacks, gain no benefits and suffer no penalties from Wildling cards, and can't be chosen as the highest or lowest bidder.</li></ul>" +
      "<h4>Additional vassal rules</h4><ul>" +
      "<li>Vassals can't collect or spend Power tokens. But when a vassal resolves a March order that vacates a land area, it <b>always</b> places a Power token there to establish control.</li>" +
      "<li>Vassals can't win or lose the game.</li>" +
      "<li>Vassals obey every supply limit and rule, and adjust their supply on <b>Supply</b> Westeros cards (they start on space 4). If a vassal exceeds its limit, its commander decides which units to destroy.</li>" +
      "<li>Vassals are affected by Westeros cards (except wildling attacks); the commander makes any decision for them.</li>" +
      "<li>Mustering granted by a Westeros card happens in the vassal's <b>home area only</b>, if it still controls it — otherwise it receives no units.</li></ul>",
    src: () => "MoD p.4–7 · FAQ p.6–7 · Rules p.22"
  },
  {
    title: "House Targaryen — Loyalty & Dragons",
    when: (c) => c.has("mod") && c.targ,
    html: () => "<ul><li>Playable only with <b>four or more</b> players; never a vassal. Targaryen begins on the <b>Essos side board</b> and follows all the rules for player Houses, with these exceptions.</li></ul>" +
      "<h4>Targaryen victory</h4><ul><li>The Victory track counts the " + GT.ici("mod-loyalty", "Loyalty token", "<b>loyalty tokens</b>") + " Targaryen has gained, not castles and strongholds.</li>" +
      "<li><b>Pentos</b>, its home area, has a printed loyalty token: Targaryen starts on space <b>1</b> for controlling it.</li>" +
      "<li>Losing control of Pentos moves its Victory token back one space — the <b>only</b> way Targaryen loses points. Regaining Pentos moves it forward one space and puts the " + GT.ici("mod-pentos-garrison", "Pentos Garrison token", "Pentos Garrison") + " back on Pentos.</li>" +
      "<li>Reaching space <b>7</b> wins the game immediately. Points from loyalty tokens are never lost.</li></ul>" +
      "<h4>Placing loyalty tokens — Westeros deck IV</h4><ul><li>Each Westeros Phase, after the cards from decks I, II and III, reveal a card from <b>deck IV</b>; resolve all four in order.</li>" +
      "<li>To resolve a deck IV card, Targaryen places <b>one loyalty token on each area named on the banner</b> in the card's upper middle (the map on its left helps), then follows the rest of its text: often placing or moving loyalty tokens, sometimes for Power tokens.</li>" +
      "<li>Loyalty tokens have no direct effect on other Houses: they give no control, can't be removed by normal means, and coexist with all other tokens and units. Several can share an area.</li>" +
      "<li><b>FAQ:</b> loyalty tokens exist on <b>land areas only</b> — never placed on or moved into a sea area.</li></ul>" +
      "<h4>Gaining loyalty tokens</h4><ul><li>Any time an area <b>controlled by Targaryen</b> holds loyalty tokens (outside of combat), Targaryen gains them: remove each from the board (it can be placed again later) and advance one Victory space per token.</li>" +
      "<li><b>FAQ:</b> a token placed or moved into an area Targaryen controls is gained and scored immediately.</li>" +
      "<li><b>FAQ:</b> marching into an area with a loyalty token and another House's units doesn't gain it at once: Targaryen must win the combat and keep at least one surviving unit there. (Arianne Martell's card, for example, would prevent it.)</li></ul>" +
      "<h4>Power, bidding and the Influence tracks</h4><ul><li>Targaryen collects Power tokens like other Houses, but spends them differently: many deck IV cards ask it to spend power to place or move loyalty tokens.</li>" +
      "<li>It permanently occupies space <b>8</b> on all three tracks: it can't rise higher, and no other House can occupy space 8. Space 8 on the King's Court track has <b>three stars</b>, so Targaryen can always use up to three Special Orders a round.</li>" +
      "<li><b>Clash of Kings:</b> Targaryen bids any number of tokens as normal. Immediately after the reveal — before the Iron Throne holder breaks ties (FAQ) — it must distribute the power it bid among any of the other players and vassals. It chooses the amount distributed and how it is divided. Each token raises that House's bid by one, even with no bid of its own, and can't be refused.</li>" +
      "<li><b>FAQ:</b> effects that would shift Targaryen higher on a track are ignored; an effect that would shift a House to the lowest position puts it on space 7 instead.</li>" +
      "<li>Targaryen bids against wildling attacks as normal and is subject to every effect on the Wildling cards. It may establish control with its Power tokens when vacating an area with a march.</li></ul>" +
      "<h4>Dragons</h4><ul><li>Targaryen has " + GT.ici("mod-dragon", "Dragon unit", "<b>three Dragons</b>") + ", in play from the start. They can't be mustered; a Dragon destroyed for any reason is permanently removed (outside certain card abilities).</li>" +
      "<li>Each Dragon is a single <b>land</b> unit that obeys supply, and can attack, defend and support following the normal rules.</li>" +
      "<li><b>Strength</b> = the number of " + GT.ici("mod-dragon-strength", "Dragon strength token", "dragon strength tokens") + " in the dragon strength box at the bottom of the Essos board: <b>0</b> at the start. When the Round marker advances onto a space holding a dragon strength token (spaces 2, 4, 6, 8, 10), that token moves to the leftmost slot of the box and every Dragon gains +1.</li></ul>" +
      "<table class='ref-table'><thead><tr><th>Rounds</th><th>Dragon strength</th></tr></thead><tbody>" +
      [["1", 0], ["2–3", 1], ["4–5", 2], ["6–7", 3], ["8–9", 4], ["10", 5]].map(r => "<tr><td>" + r[0] + "</td><td>" + r[1] + "</td></tr>").join("") + "</tbody></table>" +
      "<p class='inline-note'>Normal schedule (“By round 4, each dragon will have a combat strength of 2”). A card such as Fire Made Flesh can also move a dragon strength token to the box — only one token per card (FAQ).</p>" +
      "<ul><li><b>Flying:</b> resolving a March order, a Dragon may march normally or fly to <b>any land area</b> on the Westeros or Essos boards. Flying into a land area with an enemy unit starts a combat as normal. Non-Dragon units can't fly, even from a Dragon's area.</li>" +
      "<li><b>Retreats:</b> Dragons follow the normal retreat rules (back to the area they marched from, retreat using Ships, and so on) and can be chosen as casualties. They can't fly when retreating — except when forced to retreat to the area they flew from.</li>" +
      "<li><b>No Siege Engines (FAQ):</b> Targaryen ignores any effect that would give it one, such as the Siege Engineers loan; it can never gain or muster Siege Engines.</li>" +
      "<li><b>FAQ:</b> Viserys Targaryen's card discarding Khal Drogo doesn't remove Drogo from the game; a House card's text only works when it is the card played in a combat.</li></ul>",
    src: () => "MoD p.4–5, p.7–8 · FAQ p.6–7"
  },
  {
    title: "The Iron Bank of Braavos & the Essos Board",
    when: (c) => c.has("mod") && c.targ,
    html: () => "<h4>The Essos board</h4><ul><li>Used only when a player is House Targaryen. It adds new sea and land areas, including <b>Pentos</b> (Targaryen's home) and <b>Braavos</b>.</li>" +
      "<li>Every House may move between the Westeros board's sea areas and the adjacent Essos sea areas as if they were directly adjacent. Rules that say “game board” mean both boards.</li></ul>" +
      "<h4>Purchasing loans</h4><ul><li>When a player resolves his " + GT.ici("mod-iron-bank-order", "Iron Bank order token", "<b>Iron Bank sea order</b>") + " (in the Resolve Consolidate Power Orders step), he may take <b>one</b> loan:</li></ul>" +
      "<ol><li>Choose a faceup loan from one of the three slots of the Iron Bank.</li>" +
      "<li>Pay its <b>initial cost</b>: discard available Power tokens equal to the value above that loan's current slot — <b>7</b>, <b>4</b> or <b>1</b> (−1 if you hold the Braavos token).</li>" +
      "<li>Resolve the loan's effect (below).</li>" +
      "<li>Place the loan facedown in your play area.</li></ol>" +
      "<ul><li><b>Shifting:</b> at the beginning of each round (not the first), every loan in the Iron Bank shifts one slot left; a loan that would shift out of the leftmost slot (1) goes facedown to the bottom of the loan deck. Then reveal the top loan into the rightmost slot (7). A slot emptied by a purchase stays empty for the rest of the round.</li>" +
      "<li>The Iron Bank order can be raided, but the raider doesn't pillage. An Iron Bank order in a Port can be resolved even with enemy ships in the adjacent sea area, and Feast for Crows doesn't forbid it (FAQ).</li></ul>" +
      "<h4>Paying interest</h4><ul><li>At the beginning of each <b>Westeros Phase</b>, in turn order, each player with loans discards <b>one available Power token per loan</b> he has bought, for the rest of the game.</li>" +
      "<li>For each Power token he is short, the holder of the <b>Valyrian Steel Blade</b> chooses one of his units anywhere and destroys it — a Dragon included (FAQ). If the debtor holds the Blade, the next-highest player on the Fiefdoms track chooses.</li></ul>" +
      "<h4>Controlling Braavos</h4><ul><li>Braavos starts with a " + GT.ici("mod-braavos-front", "Braavos Neutral Force token, front", "<b>strength 5</b> Neutral Force") + ". The first player to defeat it places the token " + GT.ici("mod-braavos-back", "Braavos Neutral Force token, back", "<b>facedown</b>") + " in front of him: while he holds it, he pays <b>−1</b> on every loan's initial cost (not on interest).</li>" +
      "<li>If another player takes control of Braavos, he immediately receives the token. If no player controls Braavos, the token is set aside until someone does.</li>" +
      "<li><b>FAQ:</b> a Pyromancer degrading Braavos's castle doesn't remove the token's effect — it belongs to the area, not the castle.</li></ul>" +
      "<h4>Loan effects</h4><ul>" + GT.loans.map(l => "<li><b>" + l[0] + ":</b> " + l[1] + "</li>").join("") + "</ul>" +
      "<ul><li><b>FAQ:</b> you may buy any loan you can afford, even if you can't fulfil its whole effect: ignore the part that can't be done. But you must fulfil as much as possible — never ignore part of it on purpose.</li>" +
      "<li><b>FAQ:</b> if you lack a unit type a loan shows (Targaryen has no Siege Engines), take the units you can and ignore the rest.</li>" +
      "<li><b>FAQ:</b> a Pyromancer degrading the castle of an area with a Port doesn't stop the Port from working.</li></ul>",
    src: () => "MoD p.5, p.9–10, p.12 · FAQ p.6–7"
  },
  {
    title: "Mother of Dragons — Additional Rules",
    when: (c) => c.has("mod"),
    html: (c) => "<h4>Sea order tokens</h4><ul><li>Each House receives <b>three</b> blue-hued " + GT.ici("mod-sea-orders", "Sea order tokens", "sea order tokens") + ". They work exactly like standard order tokens, except that they can only be resolved in <b>sea areas or ports that have a ship</b>.</li>" +
      "<li>Before players begin resolving orders (after the Messenger Raven would be used), every sea order token on a land area is removed without effect.</li>" +
      "<li>The book pictures a March −1 and a Support sea order. The " + GT.ici("mod-iron-bank-order", "Iron Bank order token", "<b>Iron Bank order</b>") + " token is also a sea order" + (c.targ ? ": see <i>The Iron Bank of Braavos</i>" : ". Without Targaryen there is no Essos board or Iron Bank, so it is a blank sea order with no effect (FAQ)") + ".</li>" +
      "<li>Orders with a small " + GT.ici("mod-crown-icon", "Circled crown icon", "circled <b>crown</b> icon") + " resolve in the <b>Resolve Consolidate Power Orders</b> step.</li></ul>" +
      "<h4>Improvement and degradation</h4><ul class='aid-icons'>" + GT.icl("mod-improvement", "Area improvement tokens", "Effects can <b>improve</b> areas permanently with <b>area improvement tokens</b>. An area with one is treated as having the matching icon printed on the board — e.g. a Supply card counts printed barrels <b>plus</b> supply improvements in your areas.") +
      GT.icl("mod-degradation", "Degradation side of the improvement tokens", "Effects can also <b>degrade</b> areas permanently: the reverse of each improvement token is a <b>degradation</b>, placed over any icon on the map. An icon under a degradation is treated as no longer there.") + "</ul><ul>" +
      "<li>The 15 tokens show strongholds, crowns (power) and barrels (supply)" + (c.targ ? "; loans such as Master-at-Arms, Pyromancer, Savvy Steward, Loyal Maester and Expert Artificer place them" : "") + ".</li></ul>" +
      "<h4>Gifting Power tokens</h4><ul><li>Players may freely gift Power tokens to other players at <b>any</b> time: put that many of your Power tokens into the Power Pool; the receiver takes as many of his own from the Pool into his available power.</li>" +
      "<li><b>FAQ:</b> during a combat, only in the Call for Support step. The receiver may refuse.</li></ul>" +
      "<h4>Flexible player attendance</h4><ul><li>If a player " + (c.targ ? "other than Targaryen " : "") + "has to leave the session early, between rounds, treat his House and all its units as a <b>vassal</b>: remove his Victory token and place it near the Iron Throne track as a new vassal marker.</li></ul>" +
      "<h4>Alternate House Card Set" + (c.opt("alt") ? " (in use)" : " (optional)") + "</h4><ul><li>With both <i>A Feast for Crows</i> and <i>A Dance With Dragons</i>, the group may play with House cards that follow the later books (may contain plot spoilers): <i>A Dance With Dragons</i>' cards replace all base House cards, <i>A Feast for Crows</i>' Arryn card replaces this expansion's Arryn cards, and Targaryen uses its “B” deck " + GT.ici("mod-deck-b", "“B” beside the Mother of Dragons expansion icon") + ".</li></ul>" +
      "<h4>Expansion icon</h4><ul class='aid-icons'>" + GT.icl("mod-expansion-icon", "Mother of Dragons expansion icon", "Cards in this expansion carry the Mother of Dragons expansion icon, to tell them apart from other <i>A Game of Thrones: The Board Game</i> products.") + "</ul>",
    src: (c) => "MoD p.2–4, p.6, p.8, p.10" + (c.targ ? ", p.12" : "") + " · FAQ p.1, p.6–7"
  }
];

/* =============================================================================
   TEACHING SCRIPT — read-aloud teach for the exact configuration
   ============================================================================= */
GT.teach = {
  intro: "A ~5-minute teach for the exact setup chosen above. Read it aloud, or hit Copy and adjust. Every rule in it comes from the rulebook, the Mother of Dragons book and the FAQ v2.0 cited on this page.",
  sections: [
    {
      h: "The hook — and how you win",
      body: (c) => "<p>We are the Great Houses of Westeros" + (c.has("mod") ? "" : " — tonight that's <b>" + GT.names(c.houses) + "</b>") + ", and we all want the Iron Throne. Power here is land: every area with a <b>Castle or Stronghold</b> you control moves you up the Victory track. Hold <b>seven</b> at any moment and you win on the spot. Otherwise the game ends after <b>ten rounds</b> and whoever holds the most wins — ties go to most land areas, then the Supply track, then the Iron Throne track.</p>" +
        "<p>There are no dice. Battles are decided by numbers on the table plus one secret card. And every promise made at this table is <b>non-binding</b>.</p>"
    },
    {
      h: "The shape of a round",
      body: (c) => "<p>Each round has three phases. <b>Westeros:</b> we flip one card from each of three decks — they bring supply checks, mustering, bidding wars for influence and wildling trouble (we skip this phase in round one). <b>Planning:</b> all of us secretly place one order token, face down, on every area where we have units, and then flip them all at once. <b>Action:</b> the orders resolve in turn order — raids first, then marches and battles, then consolidate power.</p>"
    },
    {
      h: "Your orders — and why you'd give them",
      body: (c) => "<ul><li><b>March</b> — the only way to move, fight and take ground. Each march can start just one battle. If you leave an area empty, drop a Power token there to keep it.</li>" +
        "<li><b>Defense</b> — a bonus for whoever defends that area, all round.</li>" +
        "<li><b>Support</b> — lend that area's strength to a battle next door, <i>anyone's</i> battle. This is where the negotiating happens.</li>" +
        "<li><b>Raid</b> — resolves first: cancel an adjacent enemy support, raid or consolidate power order, and steal power if it was consolidate.</li>" +
        "<li><b>Consolidate Power</b> — your income: one Power token plus one for each crown printed in the area.</li></ul>" +
        "<p>Everyone has two of each, plus five stronger <b>Special Orders</b> marked with a star — but you may only use as many stars as your King's Court position allows.</p>"
    },
    {
      h: "Battle — the heart of the game",
      body: (c) => "<p>March into an area holding another House's units and you fight. Add up your strength: Footmen and Ships are 1, Knights 2, Siege Engines 4 against castles and strongholds. Add the order bonuses, any support from neighbouring areas, and a defending home area's Garrison. Then both of us secretly pick one of our <b>seven House cards</b> and reveal them: each adds strength, and some add swords, fortifications or special text.</p>" +
        "<p>Higher strength wins; a tie goes to whoever is higher on the Fiefdoms track. The loser loses one unit per sword minus fortification, then <b>retreats</b> and is <b>routed</b> — laid on its side, worth nothing until the round ends. A House card you play is gone until you've used all seven, so everyone can count exactly what you have left.</p>"
    },
    {
      h: "Power and the three tracks",
      body: (c) => "<p>Power tokens are your currency. You spend them to keep areas you leave, to defend the Wall, and above all to <b>bid</b> when a Clash of Kings card comes up. That bidding sets three tracks:</p>" +
        "<ul><li><b>Iron Throne</b> — turn order, and its holder breaks almost every tie.</li>" +
        "<li><b>Fiefdoms</b> — wins tied battles, and its leader holds the <b>Valyrian Steel Blade</b>: +1 in one battle each round.</li>" +
        "<li><b>King's Court</b> — how many Special Orders you may use, and its leader holds the <b>Messenger Raven</b>: after orders are revealed, swap one of yours, or peek at the next wildling card.</li></ul>"
    },
    {
      h: "Supply, mustering and the wildlings",
      body: (c) => "<p>Barrels on the map set your <b>Supply</b>: how many armies you may have and how big. When a Supply card comes up, anyone over the limit loses units. When a <b>Mustering</b> card comes up, each Castle gives one point and each Stronghold two to recruit or upgrade units there.</p>" +
        "<p>Some Westeros cards push the <b>wildlings</b> up their track. When they attack, everyone secretly bids power for the Night's Watch. Match their strength together and the top bidder is rewarded; fall short and the lowest bidder suffers worst, and everyone else a little.</p>"
    },
    { when: (c) => !c.has("mod"),
      h: (c) => c.p === 6 ? "Six players" : c.p + " players — the smaller map",
      body: (c) => c.p === 6
        ? "<p>With six of us, every House plays — Stark, Lannister, Baratheon, Greyjoy, Tyrell and Martell. Only <b>King's Landing</b> (strength 5) and <b>The Eyrie</b> (strength 6) start held by neutral forces; to march in, your strength must match or beat theirs, with no House cards. The King's Court gives three stars to its top two positions, two to third, one to fourth, none below.</p>"
        : "<p>With " + ({ 3: "three", 4: "four", 5: "five" })[c.p] + " of us, " + GT.names(c.houses) + " play; " + GT.names(GT.baseExcluded[c.p]) + (GT.baseExcluded[c.p].length > 1 ? " sit" : " sits") + " this one out. " +
          (c.p === 3 ? "Twelve areas — Pyke and most of the south — are <b>sealed off</b>: their tokens show a squiggle instead of a number and can never be entered. Only <b>King's Landing</b> (5) and <b>The Eyrie</b> (6) can be conquered from neutral forces." : "Neutral forces hold " + GT.neutralFor(c.p).length + " areas, " + (c.p === 4 ? "including most of the empty Houses' lands — but not <b>Highgarden</b>, which starts empty and falls to the first army that marches in" : "including the empty Houses' lands") + "; to march in, your strength must match or beat the token's number, with no House cards and no help for them.") +
          " The Influence tracks are slid together to fit us" + (c.p <= 4 ? ", and the <b>King's Court Overlay</b> means only the top three positions get Special Orders: three, two and one" : "") + ".</p>"
    },
    { when: (c) => c.opt("tob"),
      h: "Tides of Battle",
      body: () => "<p>We're playing with <b>Tides of Battle</b>. After House cards are revealed, both fighters draw a Tides of Battle card: it adds a number to your strength, and may add swords or fortifications as if they were on your House card. A <b>skull</b> kills one of your <i>opponent's</i> units no matter who wins — though Garrisons ignore skulls. The Valyrian Steel Blade can redraw your card instead of giving +1, and the whole deck is reshuffled before every battle.</p>"
    },
    { when: (c) => c.has("mod"),
      h: "Mother of Dragons — what's different",
      body: (c) => "<p>We're playing with <b>Mother of Dragons</b>. At the table tonight: <b>" + GT.names(c.houses) + "</b>." +
        (c.house("arryn") ? " House Arryn is new; its home is The Eyrie." : "") +
        (c.vassals.length ? " " + GT.names(c.vassals) + (c.vassals.length > 1 ? " have" : " has") + " no player, so " + (c.vassals.length > 1 ? "they become <b>vassals</b>" : "it becomes a <b>vassal</b>") + " — more on that in a moment." : "") +
        (c.targ ? "" : " House Targaryen isn't in this game.") + "</p>" +
        "<ul><li>Everyone starts with <b>seven Power tokens</b>, not five.</li>" +
        "<li>Each of us also has three blue <b>sea order</b> tokens. They only work in a sea area, or a port with a ship; one left on land is simply removed before orders resolve." +
        (c.targ ? "" : " The one showing the Iron Bank does nothing tonight — there's no bank without Targaryen.") + "</li>" +
        "<li>You may <b>gift Power tokens</b> to another player at any time — in a battle only while support is being called — and they may refuse.</li>" +
        "<li>Only <b>King's Landing</b>" + (c.targ ? " and <b>Braavos</b> start" : " starts") + " with a neutral force, and the Influence tracks start in a fixed order" + (c.vassals.length ? " — and on any track where a vassal starts in the top three, the vassals drop below the players" : "") + ".</li></ul>"
    },
    { when: (c) => c.has("mod") && c.vassals.length > 0,
      h: "Vassals",
      body: (c) => "<p>A <b>vassal</b> is a neutral House we take turns commanding — tonight <b>" + GT.names(c.vassals) + "</b>. At the start of each Planning Phase the top players on the Iron Throne track get sets of vassal orders; in turn order you take a vassal or pass the set down the track, and the last player takes whatever is left.</p>" +
        "<ul><li>After your own orders, place up to <b>two</b> vassal orders for each vassal you command: <b>March +0</b>, <b>Raid/Support +1</b>, <b>Defense +1 or Muster</b>, <b>Defense +3</b>. They resolve at the vassal's own place in turn order.</li>" +
        "<li>In a vassal's battle its commander draws three cards from the shared vassal deck and plays one. A vassal win earns its commander a Power token.</li>" +
        "<li>Vassals bid nothing, hold no Dominance tokens, ignore the wildlings and can't win. You can't attack, raid or support against your own vassals, or march into areas they control.</li></ul>"
    },
    { when: (c) => c.has("mod") && c.targ,
      h: "House Targaryen, the Dragons and the Iron Bank",
      body: () => "<p><b>House Targaryen</b> starts on the <b>Essos</b> board and wins differently: its Victory track counts <b>loyalty tokens</b>, not castles, starting on 1 for Pentos, its home. Each Westeros Phase a fourth card, from <b>Westeros deck IV</b>, places loyalty tokens around Westeros. When Targaryen controls an area holding them, it scores them for good — seven wins on the spot. The only point it can lose is Pentos.</p>" +
        "<ul><li>Targaryen sits on space 8 of every track all game, with three Special Orders. It still bids for the tracks, but must hand the power it bid to other players and vassals, raising their bids.</li>" +
        "<li>Its three <b>Dragons</b> start at strength 0 and gain one on every even-numbered round. A Dragon may fly to any land area on either board; lose one and it's gone for good.</li>" +
        "<li><b>The Iron Bank of Braavos:</b> anyone resolving their Iron Bank sea order, in the Consolidate Power step, may buy a faceup loan for 7, 4 or 1 power, by its slot. Each loan then costs one power of interest at the start of every Westeros Phase. For each power you can't pay, the holder of the Valyrian Steel Blade picks one of your units anywhere, even a Dragon, and destroys it. If you hold the Blade yourself, the next player down the Fiefdoms track picks.</li></ul>"
    },
    { when: (c) => c.has("mod") && c.opt("alt"),
      h: "Alternate House cards",
      body: (c) => "<p>We're using the <b>Alternate House Card Set</b>. The base House cards are swapped for A Dance With Dragons' cards" + (c.house("arryn") ? ", Arryn uses its card from A Feast for Crows" : "") + (c.targ ? ", and Targaryen plays its “B” deck" : "") + "." + (c.vassals.length ? " Vassals still fight with the shared vassal deck." : "") + " They follow the later books, so expect spoilers. The combat rules don't change — only the cards in our hands.</p>"
    },
    {
      h: "Don't worry about these until they come up",
      body: (c) => {
        const items = [
          "<li><b>Ship transport and ports</b> — chains of your ships carry armies along the coast; I'll show it the first time someone tries.</li>",
          "<li><b>Retreat details</b> — where a beaten army may go, and when it is simply destroyed.</li>",
          "<li><b>Each Westeros and Wildling card</b> — read them as they come; most say exactly what to do.</li>",
          "<li><b>House card timing</b> — when two card texts clash, cancels go first, then turn order.</li>",
          "<li><b>Running out of Order tokens</b> — rare; we then place orders in turn order.</li>",
          "<li><b>Cards that shift the Influence tracks</b> — everyone slides to make room, Dominance tokens change hands.</li>"
        ];
        if (c.opt("tob")) items.push("<li><b>The exact Tides of Battle step order</b> — I'll walk us through the first battle.</li>");
        if (c.has("mod")) {
          items.push("<li><b>Improvement and degradation tokens</b> — an improvement counts as a barrel or crown printed in that area, or turns a Castle into a Stronghold; a degradation cancels an icon printed on the map.</li>");
          items.push("<li><b>Flexible player attendance</b> — if someone" + (c.targ ? " other than Targaryen" : "") + " has to leave between rounds, their House becomes a vassal.</li>");
        }
        if (c.vassals.length) items.push("<li><b>Vassal fine print</b> — supply, Westeros-card mustering only at home, and the commander deciding everything for them.</li>");
        if (c.targ) items.push("<li><b>Each loan's effect</b> — read it when someone buys it — the <b>deck IV</b> card texts, and <b>Braavos</b>: beat its neutral force and take its token. While you control Braavos, a loan costs you one less power to buy, though the interest is not reduced.</li>");
        return "<ul>" + items.join("") + "</ul>";
      }
    }
  ]
};

/* =============================================================================
   CITATION TIDY-UP — merges repeated document labels in a citation ("FAQ p.5 · MoD p.6 · FAQ p.6"
   → "FAQ p.5, p.6 · MoD p.6"), sorts each document's pages and drops duplicates. Wraps every
   step and reference src, so the page and the harness print the same citations.
   ============================================================================= */
GT.normSrc = (s) => {
  if (typeof s !== "string") return s;
  const docs = [], pages = {};
  for (const seg of s.split(" · ")) {
    const m = seg.match(/^(Rules|MoD|FAQ) (.+)$/);
    const key = m ? m[1] : seg;
    if (!pages[key]) { pages[key] = []; docs.push(key); }
    if (m) for (const p of m[2].split(", ")) if (!pages[key].includes(p)) pages[key].push(p);
  }
  const num = (p) => parseFloat((p.match(/\d+/) || ["0"])[0]);
  return docs.map(d => pages[d].length ? d + " " + pages[d].sort((a, b) => num(a) - num(b) || a.length - b.length).join(", ") : d).join(" · ");
};
(function () {
  const wrap = (o) => { const f = o.src; o.src = typeof f === "function" ? (c) => GT.normSrc(f(c)) : GT.normSrc(f); };
  GT.phases.forEach(ph => ph.steps.forEach(wrap));
  GT.reference.forEach(wrap);
})();
