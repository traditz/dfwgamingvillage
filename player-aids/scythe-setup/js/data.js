/* =============================================================================
   Scythe — Setup & Reference Utility · data
   Every rule here comes from the PDFs in the game folder (see citations):
     Core            ScytheRules_15th_r24.pdf (2022 printing) — printed page numbers
     QRG             Quick Reference Guide (2 pages, no printed numbers: PDF pages)
     Invaders        Invaders from Afar rulebook r7 — printed page numbers
     Wind Gambit     The Wind Gambit rulebook r6 — printed page numbers
     Modular Board   Modular Board rules r18 (English = PDF pp.2–3, no printed numbers)
     Rise of Fenris  The Rise of Fenris rulebook r22 — printed page numbers
     Overlooked Rules (fan)  "Frequently Overlooked Rules v4.0" — an unofficial community
                     sheet (no printed numbers). Lowest precedence: it only clarifies.
   Precedence: the 2022 core rulebook already folds in the errata printed in The Wind Gambit
   (p.7); where an older book differs, the newer text wins and the step says so.

   Context object c (built in app.js):
     c.has(set)   set in play: core, ifa, wg, mb, rof
     c.p          factions at the table (1 = one human player)
     c.mode       "standard" | "campaign";  c.camp = campaign gate open
     c.modOpen    Rise of Fenris modules gate open (standard mode)
     c.act(id)    module in effect (picked, or switched on by the chosen episode)
     c.opt(id)    option on: air, airadv, res, mbvar, delay, matorder, firstgame
     c.air/c.res  Wind Gambit airships / resolution tile in effect
     c.board      "std" | "mod";   c.triumph "std" | "war" | "peace" | "tiles"
     c.ep         chosen episode object (or null); c.epId; c.epi (order index)
     c.rewards    episode over (show rewards);  c.boxc Box C opened;  c.prev2 "2a"|"2b"
     c.solo       one human vs the Automa;  c.automa any Automa seat;  c.coop Desolation
   ============================================================================= */
var SY = {};

SY.expMeta = {
  core: { name: "Core",           cls: "tag-core" },
  ifa:  { name: "Invaders",       cls: "tag-ifa" },
  wg:   { name: "Wind Gambit",    cls: "tag-wg" },
  mb:   { name: "Modular Board",  cls: "tag-mb" },
  rof:  { name: "Rise of Fenris", cls: "tag-rof" },
  camp: { name: "Campaign",       cls: "tag-camp" },
  auto: { name: "Automa",         cls: "tag-auto" },
  var:  { name: "Variant",        cls: "tag-var" },
  fan:  { name: "Fan sheet",      cls: "tag-fan" }
};

SY.expansions = [
  { id: "core", short: "Scythe", year: "core · 2015", blurb: "The core game: five factions, 1–5 players. Solo play needs the separate Automa rulebook, which this page does not cover." },
  { id: "ifa",  short: "Invaders from Afar", year: "2016", blurb: "Clan Albion and the Togawa Shogunate, two more player mats (2a and 3a), and up to 7 players." },
  { id: "wg",   short: "The Wind Gambit", year: "2017", blurb: "Airships and resolution tiles: two optional modules for any player count." },
  { id: "rof",  short: "The Rise of Fenris", year: "2018", blurb: "An eight-game campaign plus stand-alone modules. Both stay behind spoiler gates on this page." },
  { id: "mb",   short: "Modular Board", year: "2019", blurb: "A double-sided board with random hex tiles and home bases, plus 8 new structure bonus tiles." }
];

SY.modes = [
  { id: "standard", name: "Standard game", blurb: "Race to place six stars; the richest faction wins." },
  { id: "campaign", name: "Rise of Fenris campaign", blurb: "Eight linked games. The episode rules open behind a spoiler gate.", requires: "rof" }
];

/* Options that are not Rise of Fenris modules. group: board | wg | var */
SY.options = [
  { id: "mbvar", group: "board", requires: "mb", board: "mod", name: "Player-count variant", summary: "Leave some modular tiles off at 2–4 players", src: "Modular Board p.3" },
  { id: "air", group: "wg", requires: "wg", name: "Airship module", summary: "Every faction adds an airship; two random tiles set all airships' abilities", src: "Wind Gambit p.3" },
  { id: "airadv", group: "wg", requires: "wg", needs: "air", name: "Advanced: own airship tiles", summary: "Each player gets their own pair of tiles (generally not recommended, especially at 4+)", src: "Wind Gambit p.5" },
  { id: "res", group: "wg", requires: "wg", name: "Resolution module", summary: "A random resolution tile replaces the sixth-star ending", src: "Wind Gambit p.6" },
  { id: "firstgame", group: "var", name: "First game", summary: "Quick-start cards and a sample scoring round", src: "Core p.9, p.28" },
  { id: "delay", group: "var", name: "Delay of Game", summary: "Stall over 10 seconds totting up scores: lose 2 popularity", src: "Core p.28" },
  { id: "matorder", group: "var", name: "Player mats in number order", summary: "Deal the player mats clockwise by number", src: "Wind Gambit p.7" }
];

/* Rise of Fenris stand-alone modules (Modular Rules, RoF p.50–51) */
SY.modules = [
  { id: "mechmods",   name: "Mech Mods", summary: "Draw 4, place up to 2 over your mech abilities", src: "Rise of Fenris p.51, p.6" },
  { id: "inframods",  name: "Infrastructure Mods", summary: "Draw 4, keep up to 2 once-per-game boosts", src: "Rise of Fenris p.51, p.7" },
  { id: "rivals",     name: "Rivals", summary: "Stake stars on rivals' home bases; win them back in combat for $5", src: "Rise of Fenris p.16, p.51" },
  { id: "alliances",  name: "Alliances", summary: "Swap Alliance tokens to share faction abilities", src: "Rise of Fenris p.18, p.51" },
  { id: "vesna",      name: "Vesna faction", summary: "Starts with 3 Factory cards; picks her mech abilities each game", src: "Rise of Fenris p.22–23, p.51" },
  { id: "fenris",     name: "Fenris faction", summary: "Spreads Influence tokens: each one a player holds at the end costs $1", src: "Rise of Fenris p.30–31, p.51" },
  { id: "tesla",      name: "Tesla", summary: "First to 3 encounters takes control of Tesla", src: "Rise of Fenris p.37, p.51" },
  { id: "madtesla",   name: "Mad Tesla", summary: "An autonomous unit to fight; destroy him to end the game", src: "Rise of Fenris p.40–41, p.51" },
  { id: "desolation", name: "Desolation (co-op)", summary: "Everyone together against the Desolation faction", src: "Rise of Fenris p.46–47, p.51" },
  { id: "deshard",    name: "Desolation: harder", needs: "desolation", summary: "Displacing a worker costs Desolation 1 popularity, speeding its timer", src: "Rise of Fenris p.47" },
  { id: "mpautoma",   name: "Multiplayer Automa", summary: "Semi-official: seat Automas beside humans (needs the Automa rulebook)", src: "Rise of Fenris p.48–49" }
];

/* The Triumph Track choice: each alternative covers the whole track (RoF p.16, 18, 37). */
SY.triumphs = [
  { id: "std",   name: "Standard track", summary: "The printed Triumph Track", src: "Core p.27" },
  { id: "war",   name: "War Triumph Track", summary: "Rewards combat; no stars for workers or popularity", src: "Rise of Fenris p.16, p.51" },
  { id: "peace", name: "Peace Triumph Track", summary: "No combat or power stars; rewards encounters and economy", src: "Rise of Fenris p.18, p.51" },
  { id: "tiles", name: "Triumph Tiles", summary: "10 random tiles replace the track", src: "Rise of Fenris p.37, p.51" }
];

/* ---------------------------------------------------------------------------
   FACTIONS — starting power / combat cards read from each faction mat's box
   (Core p.15–17 mat pictures, Invaders p.5, p.7, Rise of Fenris p.22, p.31)
   --------------------------------------------------------------------------- */
SY.factions = [
  { id: "nordic", name: "Nordic Kingdom", who: "Bjorn & Mox", set: "core", power: 4, cards: 1,
    ability: "<b>Swim</b>: your workers may move across rivers, onto any terrain except lakes (workers only, not your character or mechs).",
    mechs: ["<b>Riverwalk</b>: character and mechs may cross rivers onto forests and mountains",
            "<b>Seaworthy</b>: move to and from lakes, and retreat onto an adjacent lake (or home)",
            "<b>Artillery</b>: before combat, pay 1 power to make your opponent lose 2 power (once per combat)",
            "<b>Speed</b>: move one extra territory per move"],
    src: "Core p.16, p.21" },
  { id: "rusviet", name: "Rusviet Union", who: "Olga Romanova & Changa", set: "core", power: 3, cards: 2,
    ability: "<b>Relentless</b>: you may choose the same Player Mat section as your previous turn(s). It does not apply to Factory cards.",
    mechs: ["<b>Riverwalk</b>: cross rivers onto farms and villages",
            "<b>Township</b>: villages you control and the Factory count as adjacent for your character's and mechs' moves",
            "<b>People's Army</b>: in a combat where you have at least 1 worker, play 1 extra combat card (you still need a character or mech there)",
            "<b>Speed</b>: move one extra territory per move"],
    src: "Core p.16, p.21" },
  { id: "crimea", name: "Crimean Khanate", who: "Zehra & Kar", set: "core", power: 5, cards: 0,
    ability: "<b>Coercion</b>: once per turn, spend 1 combat card as if it were any 1 resource token (whatever its number).",
    mechs: ["<b>Riverwalk</b>: cross rivers onto farms and tundra",
            "<b>Wayfare</b>: move from a territory or home base to any inactive faction's home base or your own, any distance",
            "<b>Scout</b>: before combat, steal 1 random combat card from your opponent (once per combat)",
            "<b>Speed</b>: move one extra territory per move"],
    src: "Core p.17, p.21" },
  { id: "polania", name: "Polania Republic", who: "Anna & Wojtek", set: "core", power: 2, cards: 3,
    ability: "<b>Meander</b>: pick up to 2 different options per encounter card, in any order (the first may pay for the second). You still draw only one card.",
    mechs: ["<b>Riverwalk</b>: cross rivers onto villages and mountains",
            "<b>Submerge</b>: move to and from lakes, and from any lake to another",
            "<b>Camaraderie</b>: no popularity loss when you force workers to retreat after winning combat as the aggressor",
            "<b>Speed</b>: move one extra territory per move"],
    src: "Core p.17, p.21" },
  { id: "saxony", name: "Saxony Empire", who: "Gunter von Duisburg with Nacht & Tag", set: "core", power: 1, cards: 4,
    ability: "<b>Dominate</b>: no limit to the stars you place for objectives and combat victories (you keep your second objective card). If you have a star left after winning combat, you must place it.",
    mechs: ["<b>Riverwalk</b>: cross rivers onto forests and mountains",
            "<b>Underpass</b>: mountains you control and all tunnels count as adjacent for your character's and mechs' moves",
            "<b>Disarm</b>: before combat on a territory with a tunnel or your Mine, your opponent loses 2 power (once per combat)",
            "<b>Speed</b>: move one extra territory per move"],
    src: "Core p.15, p.21" },
  { id: "albion", name: "Clan Albion", who: "Connor & Max", set: "ifa", power: 3, cards: 0,
    ability: "<b>Exalt</b>: after your character ends its movement, you may place a Flag token from your supply on its territory (4 Flags).",
    mechs: ["<b>Burrow</b>: character and mechs may cross rivers into or out of any adjacent tunnel territory (your Mine counts; an opponent's Mine does not)",
            "<b>Sword</b>: before combat as the attacker, the defender loses 2 power (once per combat)",
            "<b>Shield</b>: before combat as the defender, gain 2 power (once per combat)",
            "<b>Rally</b>: on a Move action, your character and mechs may move to any territory with one of your workers or a Flag, any distance"],
    src: "Invaders p.4–5" },
  { id: "togawa", name: "Togawa Shogunate", who: "Akiko & Jiro", set: "ifa", power: 0, cards: 2,
    ability: "<b>Maifuku</b>: after your character ends its movement, you may place an armed Trap token of your choice on its territory, even one with an opponent's structure (4 Traps).",
    mechs: ["<b>Toka</b>: once per turn when moving, 1 character or 1 mech may cross a river (a mech may carry workers; no crossing several rivers on a Factory card's Move)",
            "<b>Suiton</b>: move to and from lakes; in combat on a lake, play 1 extra combat card (once per combat); you may place a Trap on a lake",
            "<b>Ronin</b>: before a combat where you have exactly 1 unit (1 character or 1 mech, no workers), you may gain 2 power",
            "<b>Shinobi</b>: move to any territory with a Trap, any distance; ending there on a disarmed Trap (not mid-way through a Factory card Move) lets you re-arm it, but only after winning if it led to combat"],
    src: "Invaders p.6–7" },
  { id: "vesna", name: "Vesna", who: "Vesna & Voltan", set: "rof", power: 1, cards: 1,
    ability: "<b>Technophile</b>: 3 face-up Factory cards are yours from the start; use them like normal Factory cards, and return each one to the box after you use it (including one gained at the Factory). You may still gain only 1 card at the Factory per game. Her starting Factory cards do not count toward objectives.",
    mechs: ["<b>Riverwalk</b>: move your character and mechs across rivers to or from an adjacent territory containing any player's structure",
            "Two blank spaces, filled each game from her mech ability tokens",
            "<b>Speed</b>: move one extra territory per Move action"],
    src: "Rise of Fenris p.22–23" },
  { id: "fenris", name: "Fenris", who: "Rasputin & Likho", set: "rof", power: 4, cards: 2,
    ability: "<b>Influence</b>: after moving your character (and resolving combat and encounters), you may place an Influence token on its territory; if you do, you may place 1 more on any other unoccupied, tokenless primary-terrain territory.",
    mechs: ["<b>Leap</b>: when moving, leap over a territory if the destination is in a straight line (crosses rivers and lakes, avoids enemy units); twice in one turn with a Factory card Move",
            "<b>Horrify</b>: you may give an opponent 1 Influence token (from your supply) for each unit you force to retreat as the aggressor, in or out of combat",
            "<b>Death Ray</b>: in combat, play any number of combat cards of the same value (from now on only identical cards, but no limit)",
            "<b>Fanatical</b>: your mechs and character may move to any non-adjacent territory containing an Influence token, and gain that token"],
    src: "Rise of Fenris p.30–31" }
];

/* ---------------------------------------------------------------------------
   TABLES
   --------------------------------------------------------------------------- */
SY.tierTable =
  "<table class='tbl tiers'><caption>End-game coins by popularity (Core p.29)</caption>" +
  "<thead><tr><th scope='col'>Popularity</th><th scope='col'>Each star</th><th scope='col'>Each territory</th><th scope='col'>Every 2 resources</th></tr></thead><tbody>" +
  "<tr><th scope='row'>0–6</th><td>$3</td><td>$2</td><td>$1</td></tr>" +
  "<tr><th scope='row'>7–12</th><td>$4</td><td>$3</td><td>$2</td></tr>" +
  "<tr><th scope='row'>13–18</th><td>$5</td><td>$4</td><td>$3</td></tr></tbody></table>";

SY.bonusTilesCore = [
  ["Tunnel territories <i>adjacent</i> to your structures (each tunnel once; a Mine is not a tunnel; rivers don't break adjacency)", "1: $2 · 2–3: $4 · 4–5: $6 · 6: $9"],
  ["Lakes adjacent to your structures (each lake once)", "1: $2 · 2–3: $4 · 4–5: $6 · 6–7: $9"],
  ["Encounter territories adjacent to your structures (each once, token or not; rivers don't break adjacency)", "1: $2 · 2–3: $4 · 4–5: $6 · 6–7: $9"],
  ["Tunnel territories <i>with</i> your structures on them (a Mine is not a tunnel)", "1: $2 · 2: $4 · 3–4: $6"],
  ["Your structures in a row (longest continuous straight line; rivers don't break it)", "1: $2 · 2: $4 · 3: $6 · 4: $9"],
  ["Farms and tundras with your structures on them", "1: $2 · 2: $4 · 3: $6 · 4: $9"]
];
SY.bonusTilesMB = [
  ["Structures adjacent to any home base or the Factory", "1: $3 · 2: $6 · 3–4: $9"],
  ["Structures adjacent to the same lake", "1: $2 · 2: $4 · 3: $6 · 4: $9"],
  ["Structures on village territories", "1: $3 · 2: $6 · 3–4: $9"],
  ["Structures on mountains and forests", "1: $2 · 2: $4 · 3: $6 · 4: $9"],
  ["Structures on encounter territories", "1: $3 · 2: $6 · 3–4: $9"],
  ["Structures not adjacent to other buildings (yours or opponents')", "1: $2 · 2: $4 · 3–4: $6"],
  ["Structures within a diamond formation (the pictured shape, any angle; your largest matching group)", "1: $2 · 2: $3 · 3: $4 · 4: $9"],
  ["Structures adjacent to the same encounter territory", "1: $2 · 2: $4 · 3: $6 · 4: $9"]
];
SY.tileTable = function (rows, cap) {
  return "<table class='tbl'><caption>" + cap + "</caption><thead><tr><th scope='col'>The tile counts…</th><th scope='col'>Coins</th></tr></thead><tbody>" +
    rows.map(function (r) { return "<tr><td>" + r[0] + "</td><td class='nowrap'>" + r[1] + "</td></tr>"; }).join("") + "</tbody></table>";
};

/* Factions available with the current sets/modules */
SY.factionsInPlay = function (c) {
  return SY.factions.filter(function (f) {
    if (f.set === "core") return true;
    if (f.set === "ifa") return c.has("ifa");
    return c.act(f.id);
  });
};
SY.factionTable = function (c) {
  var rows = SY.factionsInPlay(c).map(function (f) {
    return "<tr><th scope='row'>" + f.name + "</th><td>" + f.power + "</td><td>" + f.cards + "</td></tr>";
  }).join("");
  return "<table class='tbl compact'><caption>Faction mat starting values</caption><thead><tr><th scope='col'>Faction</th><th scope='col'>Power</th><th scope='col'>Combat cards</th></tr></thead><tbody>" + rows + "</tbody></table>";
};

/* The Triumph Track, by variant (Core p.27; Rise of Fenris p.16, p.18, p.37) */
SY.triumphList = function (c) {
  if (c.triumph === "war") return "<ul><li>Complete 6 upgrades <b>or</b> build 4 structures (a star for one, not both)</li><li>Deploy all 4 mechs</li><li>Enlist all 4 recruits</li><li>Reveal 1 completed objective</li><li>Win combat: <b>up to 4 stars</b> for everyone (Saxony: unlimited combat and objective stars)</li><li>Reach 16 power</li><li>Have <b>8 combat cards</b> in hand at the end of your turn</li><li>No stars for 8 workers or for maximum popularity</li></ul>";
  if (c.triumph === "peace") return "<ul><li>Complete 6 upgrades</li><li>Build all 4 structures</li><li>Deploy 4 mechs <b>or</b> enlist 4 recruits (not both)</li><li>All 8 workers on the board</li><li>Objectives: <b>2 stars</b> for everyone; after your objective star, draw a new objective card instead of discarding your other one (if any remain; don't reshuffle discards)</li><li>Reach <b>13</b> popularity</li><li>Claim <b>3 encounter tokens</b></li><li>Gain a <b>Factory card</b> (place the star the turn you gain it)</li><li>Control <b>16 resources</b> in total (any territories)</li><li>No stars for combat victories or 16 power</li></ul>";
  if (c.triumph === "tiles") return c.coop
    ? "<ul><li>Triumph Tiles replace the track: reveal " + SY.desolationTiles(c.p) + " of the 21 tiles (including the 5 Desolation-only tiles). The team wins when every tile holds at least one star.</li></ul>"
    : "<ul><li>10 random Triumph Tiles (of 16) cover the 10 slots: read each one before you start.</li><li>Known tiles include: 8 combat cards in hand on your turn · claiming 3 encounter tokens (star after the encounter) · gaining a Factory card (star when you gain it, at end of turn) · controlling 16 resources.</li><li>Saxony keeps its unlimited objective and combat stars even with no tile for them.</li></ul>";
  return "<ul><li>Complete all 6 upgrades</li><li>Deploy all 4 mechs</li><li>Build all 4 structures</li><li>Enlist all 4 recruits</li><li>Have all 8 workers on the board</li><li>Reveal 1 completed objective card</li><li>Win combat (two spaces: up to 2 times)</li><li>Have 18 popularity</li><li>Have 16 power</li></ul>";
};
SY.desolationTiles = function (p) { return ({ 1: 5, 2: 8, 3: 10, 4: 12, 5: 14, 6: 16, 7: 18 })[p] || 10; };

/* ---------------------------------------------------------------------------
   RISE OF FENRIS CAMPAIGN — shown only after the campaign spoiler gate is opened,
   one episode at a time. Rewards/outcomes stay hidden until "episode over" is set
   (the book: "Do not read these sections until the episode ends", RoF p.3).
   idx = campaign order (2a/2b and 8a/8b are alternative paths).
   --------------------------------------------------------------------------- */
SY.episodes = [
  { id: "1", idx: 0, name: "Episode 1: A New Era", date: "March 1921", pages: "p.14–15", wg: false,
    setup: [
      "Set up the game as usual, <b>selecting or randomizing faction mats</b> (you keep this faction in later episodes) and randomizing player mats. <b>Do not use The Wind Gambit.</b>",
      "Reveal 1 random objective card and place it next to the Triumph Track. Anyone may achieve it (place a star on it) in addition to the Triumph Track objective.",
      "Place 1 Influence token (punchboard 1) on each of the 10 Triumph Track spaces, and 1 on the revealed objective card.",
      "For this game only, every player may use <b>1 Perk for free</b>: mark it on your Campaign Log and gain it now. Each Perk is used once per campaign (7 Perks each over the 8 games)."
    ],
    setupSrc: "Rise of Fenris p.14",
    special: "<ul><li>Whenever you place a star in a category where nobody has one yet, take that space's <b>Influence token</b> and put it on your faction mat. At the end these tokens decide the path of the next episode.</li><li>Both combat spaces are separate categories: the first to fill each takes its token (it can be the same player or two different ones).</li></ul>",
    specialSrc: "Rise of Fenris p.14",
    goals: "Earn Influence tokens · win the game",
    ends: "The game ends immediately when a player places their 6th star on the Triumph Track.",
    skip: "both combat spaces and 16 power",
    automa: "<ul><li>The extra objective counts as the first Triumph Track space when you place a Star Tracker star.</li><li>The Automa gains Influence tokens exactly as you do.</li><li>When it wins combat it puts its star on a combat space that still holds an Influence token, if possible.</li></ul>",
    automaSrc: "Rise of Fenris p.15",
    automaRewards: "<ul><li>The Automa gains its extra Influence token like everyone else, then votes with all of them: an even number of tokens votes <b>War (2a)</b>, an odd number votes <b>Peace (2b)</b>.</li></ul>",
    rewards: "<ol><li>Record your victory (if you won), stars and coins (your final score) on your Campaign Log.</li><li>A star earned on the revealed objective card may count for any 1 category on your Triumph Log.</li><li>Each player gains 1 more Influence token (use $1 coins if they run out).</li><li><b>Vote</b>: hide tokens in your left hand for <b>War</b> (combat and interaction next game) and/or your right hand for <b>Peace</b> (engine-building). Reveal together. Majority War → <b>Episode 2a</b>; majority Peace → <b>Episode 2b</b>; a tie is decided by the winner of Episode 1.</li><li>Return all Influence tokens to the supply; nobody keeps them.</li><li>No other rewards this game.</li></ol>",
    rewardsSrc: "Rise of Fenris p.15",
    teach: "Episode 1 plays like normal Scythe with two twists: an extra objective card sits by the Triumph Track that anyone can score, and every Triumph space holds an Influence token for the first player to put a star there. Grab them: at the end of the game those tokens decide which path the next episode takes." },

  { id: "2a", idx: 1, name: "Episode 2a: War", date: "October 1921", pages: "p.16–17", wg: false,
    setup: [
      "Set up as usual, <b>keeping your faction mat</b> and randomizing player mats. <b>No Wind Gambit.</b>",
      "Remove objective cards <b>7, 13, 15, 20, 22, 23 and 27</b> for this game.",
      "Lay the <b>War Triumph Track</b> over the Triumph Track.",
      "Place <b>1 extra worker</b> on each of your starting territories.",
      "Place <b>1 structure</b> on each of your starting territories.",
      "Take <b>3 upgrades</b> of your choice on your player mat.",
      "Add <b>4</b> to your starting popularity.",
      "If you like, spend $15 of Wealth on a Perk for this game.",
      "Then follow the <b>Rivals</b> rules: once all other setup is done, place stars on rivals' home bases."
    ],
    setupSrc: "Rise of Fenris p.16",
    special: "<p>Rivals and the War Triumph Track are in play (their rules are in the reference below).</p>",
    specialSrc: "Rise of Fenris p.16",
    goals: "Deploy mechs · win battles · win the game",
    ends: "The game ends immediately when a player places their 6th star on the War Triumph Track.",
    skip: "all four combat spaces and 16 power",
    automa: "<ul><li><b>Setup:</b> the Automa's popularity starts on space 14; it places 2 workers on its base in addition to the 2 on the board, and 1 mech on its home base; advance its Star Tracker token 3 spaces; draw 3 random Automa cards and give it everything in each card's Scheme II (red) “Gain Stuff” section, ignoring faction-specific gains, then reshuffle the Automa deck.</li><li>Rivals and War Track items for the Automa are listed in those modules' reference sections below.</li></ul>",
    automaSrc: "Rise of Fenris p.17",
    automaRewards: "<ul><li>The Automa gains 1 free Mod on top of buying them as normal.</li><li>If it earns the upgrades-or-structures Triumph, check upgrades or structures on its Triumph Log, whichever has the most checks without being full (tie: upgrades).</li></ul>",
    rewards: "<ol><li>Record victory, stars and coins on your Campaign Log.</li><li>Stars from the War track's new categories (the 2 extra combat stars, the 8-combat-card star and the upgrades-or-structures star) may each count for any 1 category on your Triumph Log.</li><li><b>Mech Mods</b> are unlocked: read their rules (Rise of Fenris p.6) and make the tokens available. Draw 2 Mech Mods plus 1 for each mech you deployed this game; keep 1 for free and buy any of the others for $50 each. Only Mech Mods are available for now.</li><li>Wealth earned in Episodes 1–7 never decides the campaign winner, so spend it.</li><li>The War Triumph Track and Rivals won't be used in future games.</li></ol>",
    rewardsSrc: "Rise of Fenris p.17",
    teach: "Episode 2a is war. Everyone starts stronger: an extra worker and a structure on each starting territory, three free upgrades and four more popularity. The War Triumph Track rewards fighting, and before we start you can stake stars on rivals' home bases; you only win them back by beating someone in combat." },

  { id: "2b", idx: 1, name: "Episode 2b: Peace", date: "October 1921", pages: "p.18–19", wg: false,
    setup: [
      "Set up as usual, <b>keeping your faction mat</b> and randomizing player mats. <b>No Wind Gambit.</b>",
      "Make the <b>Alliance tokens</b> available from the punchboard.",
      "Lay the <b>Peace Triumph Track</b> over the Triumph Track (remove objective 23; Saxony starts with 3 objective cards).",
      "If you like, spend $15 of Wealth on a Perk for this game."
    ],
    setupSrc: "Rise of Fenris p.18",
    special: "<p>Alliances and the Peace Triumph Track are in play (rules in the reference below).</p><ul><li><b>End-game scoring:</b> if you broke your alliance, deduct $10. Your end-game score can never be less than $0.</li></ul>",
    specialSrc: "Rise of Fenris p.18–19",
    goals: "Build structures · win the game",
    ends: "The game ends immediately when a player places their 6th star on the Peace Triumph Track.",
    skip: "claiming 3 encounter tokens and gaining a Factory card",
    automa: "<ul><li>Alliances and Peace Track items for the Automa are listed in those modules' reference sections below.</li></ul>",
    automaSrc: "Rise of Fenris p.19",
    automaRewards: "<ul><li>The Automa gains 1 free Mod on top of buying them as normal.</li><li>If it earns the mechs-or-recruits Triumph, check mechs or recruits on its Triumph Log, whichever has the most checks without being full (tie: mechs).</li></ul>",
    rewards: "<ol><li>Record victory, stars and coins on your Campaign Log.</li><li>Stars from the Peace track's new categories (16 resources, Factory card, 3 encounters, the second objective, 4 mechs or 4 recruits) may each count for any 1 category on your Triumph Log.</li><li><b>Infrastructure Mods</b> are unlocked: read their rules (Rise of Fenris p.7) and make the tokens available. Draw 2 plus 1 for each structure you built this game; keep 1 for free and buy any of the others for $50 each. Only Infrastructure Mods are available for now.</li><li>Wealth earned in Episodes 1–7 never decides the campaign winner, so spend it.</li><li>The Peace Triumph Track and Alliances won't be used in future games.</li></ol>",
    rewardsSrc: "Rise of Fenris p.19",
    teach: "Episode 2b is peace. The Peace Triumph Track has no stars for combat or power; instead there are stars for encounters, a Factory card, 13 popularity and 16 resources, and everyone can score two objectives. You can also form alliances: swap tokens with another player to share faction abilities, but attack your ally and you break it." },

  { id: "3", idx: 2, name: "Episode 3: A Plea from Vesna", date: "March 1922", pages: "p.20–21", wg: false,
    setup: [
      "Set up as usual, keeping your faction mat and randomizing player mats. <b>No Wind Gambit.</b>",
      "Place any Infrastructure Mods you own face up near your play area (they may not be unlocked yet).",
      "You may place any Mech Mods you own over the abilities on your faction mat.",
      "Lift <b>Box A</b> out of the game box <b>without opening it</b>: a <b>Vesna card</b> is taped to its bottom (if not, use a random Factory card to stand for Vesna).",
      "Shuffle the Vesna card <b>plus 4 additional Factory cards</b> into the Factory deck (e.g. 5 players: 6 Factory cards + Vesna + 4 more = 11 cards).",
      "Place the Influence tokens near the board.",
      "If Rusviet is in the game, it must use the <b>revised Township tile</b> from the punchboard instead of its printed Township (or cover it with a Mech Mod, if unlocked). The revised ability is printed on the tile.",
      "If you like, spend $15 of Wealth on a Perk for this game."
    ],
    setupSrc: "Rise of Fenris p.20",
    special: "<ul><li>When your character moves onto the Factory, its movement ends. Before anything else (combat, Traps…), in order: <ol type='a'><li>gain 1 Influence token and shuffle the Factory deck;</li><li>draw as many random Factory cards as you have Influence tokens and show them to everyone. If the Vesna card is among them, take it (Vesna is not a Factory card). If not, and you have no Factory card yet, you may take 1 of the revealed cards;</li><li>return the cards face down to the board;</li><li>finish your Move action (other units, combat, Traps).</li></ol></li><li>Starting your turn on the Factory gives no Influence and no search, but you may leave and re-enter with Speed or a Factory card Move and do steps a–d again.</li><li>Nobody ever looks through the whole Factory deck this episode.</li><li>After Vesna is found, players may keep gaining Influence and searching. What Vesna means is revealed at the end.</li></ul>",
    specialSrc: "Rise of Fenris p.20",
    goals: "Accumulate Influence tokens · find Vesna · win the game",
    ends: "The game ends immediately when a player places their 6th star on the Triumph Track.",
    skip: "both combat spaces and 16 power",
    automa: "<ul><li><b>Factory cards:</b> the Automa gains Influence and draws Factory cards like you. If it draws, misses Vesna and had no Factory card, it keeps the first card drawn.</li><li><b>Combat-unit movement:</b> while Vesna is unfound and the unit can reach the Factory, the Factory is its destination (ignore this if it would lead to combat while the Automa has under 5 power).</li><li>If an Automa combat unit is on the Factory at the end of a non-attacking Move Character or Encounter/Factory action, it also searches (a mech there acts as a character).</li></ul>",
    automaSrc: "Rise of Fenris p.21",
    automaRewards: "<ul><li>If the Automa did not get Vesna, roll a die: on 4–6 it returns its faction mat, and when its turn comes to take a faction (by Wealth) it takes a random available one, possibly the same.</li></ul>",
    rewards: "<ol><li>Record victory, stars and coins on your Campaign Log.</li><li>For every 2 Influence tokens you hold (round up), raise a Setup Bonus by 1 (power and popularity have limits).</li><li><b>Who becomes Vesna:</b> the player who found the Vesna card, or if nobody did, the winner of this game. That player takes every tile on the Vesna punchboard and the contents of Box A, keeps everything earned so far, renames their faction on the Campaign Log and removes the Vesna card from the game. See the Vesna faction rules.</li><li><b>Everyone else may switch factions:</b> the Vesna player may not. Switchers add their mats to the unused ones; then, lowest total Wealth first (each purchased Mod counts $50 toward this total), each switcher picks a new faction. Finally the Vesna player picks a home base from the unselected factions and places the Vesna home base tile there in later games.</li><li>Each player draws 2 Mods and may buy them ($50 each); the winner draws 1 extra (3 in total).</li></ol>",
    rewardsSrc: "Rise of Fenris p.21",
    teach: "Episode 3 is a search. Vesna's card is hidden in a bigger Factory deck. Each time your character reaches the Factory you gain an Influence token and then draw as many Factory cards as you hold Influence tokens. Find the Vesna card and something important happens after the game." },

  { id: "4", idx: 3, name: "Episode 4: Fenris", date: "September 1922", pages: "p.24–25", wg: true,
    setup: [
      "Set up as usual. The Vesna player uses the home base location chosen earlier and keeps all Mods, Setup Bonuses, etc. Randomize player mats.",
      "You may use The Wind Gambit's <b>airships</b> and/or the <b>Doomsday Clock</b> or <b>Backup Plan</b> resolution tiles.",
      "Gain all bonuses under <b>Setup Bonuses</b> on your Campaign Log.",
      "Open <b>Box B</b>: place 1 <b>Fenris agent</b> (wooden worker; 8 in total) on each tunnel and 2 on the Factory.",
      "Place any Infrastructure Mods face up near your play area.",
      "You may place any Mech Mods over the abilities on your faction mat.",
      "If you like, spend $15 of Wealth on a Perk for this game."
    ],
    setupSrc: "Rise of Fenris p.24",
    special: "<ul><li>When your character or a mech moves into a territory with Fenris agents, its movement ends and, before anything else, you must try to <b>subdue</b> them: <ol><li>draw and reveal 1 combat card per Fenris agent there (this is not combat);</li><li>lose any mix of power, coins and/or popularity equal to the total on those cards. If you can pay, you must: you subdue them, keep the combat cards and put the agents on your faction mat (no combat star). If you can't, pay nothing, discard the cards and move your unit back where it came from.</li></ol></li><li>Workers may not move alone into a territory with Fenris agents (mechs may carry them in as normal).</li></ul>",
    specialSrc: "Rise of Fenris p.24",
    goals: "Subdue the Fenris agents · win the game",
    ends: "The game ends immediately when all 8 Fenris agents have been subdued, or when a player places their 6th star.",
    skip: "both combat spaces and 16 power",
    automa: "<ul><li>Move Worker: territories with Fenris agents are never valid. All other Automa moves ignore the agents when finding valid territories.</li><li>After any non-attacking move of an Automa combat unit: if agents are on its territory it tries to subdue them; otherwise, if agents are in its neighborhood, it tries to subdue all of those on 1 territory (English reading order breaks ties). The unit does not move there.</li><li>To subdue, draw the combat cards: any 5-power card means the Automa fails; otherwise it takes the agents, but gains no cards and loses no power, coins or popularity.</li></ul>",
    automaSrc: "Rise of Fenris p.25",
    automaRewards: "",
    rewards: "<ol><li>Record victory, stars and coins on your Campaign Log.</li><li>For every 2 Fenris agents you subdued (round up), raise a Setup Bonus by 1 (power and popularity have limits).</li><li>Unlock the Mod type you did not unlock in Episode 2a/2b: read its rules (p.6 or p.7) and add those tokens to the supply.</li><li>Each player draws 2 Mods of each type (4 tokens) and may buy them ($50 each); the winner draws 1 extra of either type (5 in total).</li></ol>",
    rewardsSrc: "Rise of Fenris p.25",
    teach: "Episode 4 puts eight Fenris agents on the tunnels and the Factory. Move a character or mech onto them and you must try to subdue them: flip one combat card per agent and pay that total in power, coins or popularity. Pay it and the agents are yours; they pay off after the game. Workers can't walk in on them alone, and the game also ends the moment all eight are subdued." },

  { id: "5", idx: 4, name: "Episode 5: Factory Fortress", date: "April 1923", pages: "p.26–29", wg: true,
    setup: [
      "Set up as usual, keeping faction mats; randomize player mats. The Vesna player keeps the same home base location, Mods, Setup Bonuses, etc.",
      "You may use the airships and/or the Doomsday Clock or Backup Plan resolution tiles.",
      "Gain all bonuses under Setup Bonuses on your Campaign Log.",
      "Place your Infrastructure Mods face up near your play area.",
      "Place any number of your Mech Mods over the abilities on your faction mat.",
      "Place 1 Influence token on each tunnel (6) and on each of the 3 land territories adjacent to the Factory (3).",
      "Place <b>Box C</b> on the Factory. <b>Do not open it</b> until told to.",
      "If Rusviet is in the game, it must use the revised Township tile.",
      "If you like, spend $15 of Wealth on a Perk for this game."
    ],
    setupSrc: "Rise of Fenris p.26",
    special: "<ul><li>Whenever any unit you control (mech, character or worker) moves to a territory with an Influence token, its movement ends and you take the token (onto your faction mat).</li><li>Each Influence token is worth <b>−$1</b> at the end of the game.</li><li>The first time a player moves any unit onto the Factory, their Move action ends and they open <b>Box C</b>, then read its instructions (Rise of Fenris p.28). Do not turn to page 28 before then.</li></ul>",
    specialSrc: "Rise of Fenris p.26–27",
    goals: "Get to the Factory and uncover the mystery there · win the game",
    ends: "The game ends immediately when a player places their 6th star. Box C also contains an alternative end condition.",
    skip: "both combat spaces and 16 power",
    automa: "<ul><li>For all non-attacking Move Mech or Character actions, the Automa moves toward the Factory instead of toward enemy combat units.</li></ul>",
    automaSrc: "Rise of Fenris p.27",
    automaRewards: "<ul><li>The Automa does not lose coins for Influence tokens.</li></ul>",
    rewards: "<ol><li>Record victory, stars and coins on your Campaign Log.</li><li>Each player draws 2 Mods of each type and may buy them ($50 each); the winner draws 1 extra of either type (5 in total).</li><li><b>Who becomes Fenris:</b> the player who defeated the Annihilator in combat, or if nobody did, the winner of this game. (This may leave Vesna unused for a game; everyone can switch factions after Episode 6.)</li><li>The Fenris player takes the Annihilator mech, every tile on the Fenris punchboard and the contents of Box D; their previous home base becomes Fenris's home base. They keep everything earned so far and rename their faction on the Campaign Log.</li><li>The Fenris punchboard also holds Alliance tokens for Vesna and Fenris: give them to those factions for episodes with Alliances.</li><li>Read the Fenris faction rules.</li></ol>",
    rewardsSrc: "Rise of Fenris p.29",
    teach: "Episode 5 is a race to the Factory. Influence tokens on the tunnels and around the Factory stop any unit that reaches them and cost $1 each at the end. The first player to move a unit onto the Factory opens Box C, and only then do we read what's inside." },

  { id: "6", idx: 5, name: "Episode 6: Annihilation", date: "July 1923", pages: "p.32–33", wg: true,
    setup: [
      "Set up as usual. The Vesna and Fenris players use the home base locations chosen earlier and keep all Mods, Setup Bonuses, etc. Randomize player mats.",
      "You may use the airships and/or the Doomsday Clock or Backup Plan resolution tiles.",
      "Gain all bonuses under Setup Bonuses on your Campaign Log.",
      "Place your Infrastructure Mods face up near your play area.",
      "Place any number of your Mech Mods over the abilities on your faction mat.",
      "If you like, spend $15 of Wealth on a Perk for this game."
    ],
    setupSrc: "Rise of Fenris p.32",
    special: "<p>No special rules: this episode introduces the Fenris faction. Everyone may switch factions after this game (the winner chooses first).</p>",
    specialSrc: "Rise of Fenris p.32",
    goals: "Win the game",
    ends: "The game ends immediately when a player places their 6th star on the Triumph Track.",
    skip: "both combat spaces and 16 power",
    automa: "",
    automaSrc: "Rise of Fenris p.33",
    automaRewards: "<ul><li>If the Automa played Fenris or Vesna, it keeps its faction. Otherwise roll a die: on 4–6 it returns its faction mat and, when its turn comes (by score), takes a random available faction, possibly the same one.</li></ul>",
    rewards: "<ol><li>Record victory, stars and coins on your Campaign Log.</li><li><b>Anyone may switch factions</b>, keeping their Campaign Log and everything earned: add your old mat to the unused ones; the <b>winner</b> of this game picks first, then the next-highest score, and so on. If you take Vesna or Fenris you keep their current home base position, unless another player's faction uses it (then choose an unused base).</li><li>Each player draws 2 Mods of each type and may buy them ($50 each); the winner draws 1 extra of either type (5 in total).</li></ol>",
    rewardsSrc: "Rise of Fenris p.33",
    teach: "Episode 6 has no special rules: it's the first game with the Fenris faction on the board. Play your faction as well as you can; after this game everyone may switch factions, winner first." },

  { id: "7", idx: 6, name: "Episode 7: The Search for Tesla", date: "October 1923", pages: "p.34–35", wg: true,
    setup: [
      "Set up as usual. Vesna and Fenris keep their home base locations; everyone keeps Mods, Setup Bonuses, etc. Randomize player mats.",
      "You may use the airships and/or the Doomsday Clock or Backup Plan resolution tiles.",
      "Gain all bonuses under Setup Bonuses on your Campaign Log.",
      "Place your Infrastructure Mods face up near your play area.",
      "Place any number of your Mech Mods over the abilities on your faction mat.",
      "Place the <b>12th encounter token</b> (or a substitute) on the Factory.",
      "The Episode 2 combination you did <b>not</b> use is activated now: Rivals + War Triumph Track (if you played Peace) or Alliances + Peace Triumph Track (if you played War).",
      "If you like, spend $15 of Wealth on a Perk for this game."
    ],
    setupSrc: "Rise of Fenris p.34",
    special: "<ul><li>Follow the Rivals or Alliances rules, as set up.</li><li>Whenever you have an encounter, <b>keep its token</b> on your faction mat: encounter tokens are how you search for Tesla.</li><li><b>To find Tesla</b>, collect this many encounter tokens: solo 6 · 2 players 6 · 3 players 5 · 4 players 5 · 5 players 4 · 6 players 4 · 7 players 3.</li><li>The first player to reach that number: discards all their encounter tokens, opens <b>Box E</b>, and the game ends immediately.</li><li>Otherwise the game ends at a 6th star.</li><li>At the end, <b>encounter territories</b> (those that started with an encounter token, including the Factory this game) are worth <b>+1 territory</b> each.</li></ul>",
    specialSrc: "Rise of Fenris p.34",
    goals: "Have encounters to find Tesla · win the game",
    ends: "The game ends immediately when a player finds Tesla or places their 6th star.",
    skip: "War track: all four combat spaces and 16 power · Peace track: 3 encounter tokens and the Factory card",
    automa: "<ul><li>Use the Automa rules from Episode 2a/2b marked Rivals or Alliances, as applicable (listed in those modules' reference sections).</li><li>When the Automa takes an encounter token, it also takes 1 more (if possible) within 2 territories, by English reading order, but not from a space with an opponent unit or one it can't reach because of the initial water restriction. With 3+ players, not from another player's home peninsula.</li></ul>",
    automaSrc: "Rise of Fenris p.35",
    automaRewards: "",
    rewards: "<ul><li><b>Outcome:</b> if a player found Tesla, the next game is <b>Episode 8a</b>. If nobody did, open Box E, take the Mad Tesla tile from the punchboard and play <b>Episode 8b</b>.</li></ul><ol><li>Record victory, stars and coins on your Campaign Log.</li><li>For each encounter token still on your faction mat, raise a Setup Bonus by 1 (tokens discarded to open Box E don't count).</li><li>Stars from categories unique to the War or Peace track may count for any category on your Triumph Log.</li><li>Each player draws 2 Mods of each type and may buy them ($50 each); the winner draws 1 extra of either type (5 in total).</li></ol>",
    rewardsSrc: "Rise of Fenris p.35",
    teach: "Episode 7 is a hunt. Keep every encounter token you claim: the first player to collect the target number finds Tesla and ends the game on the spot. Encounter territories are worth an extra territory at the end, and the Episode 2 rules we didn't play are switched on." },

  { id: "8a", idx: 7, name: "Episode 8a: A New Era", date: "March 1924", pages: "p.36–37", wg: true,
    setup: [
      "Take the <b>Triumph Tiles</b> from the punchboard, shuffle them and fill all 10 Triumph Track slots.",
      "Set up as usual. Vesna and Fenris keep their home base locations.",
      "<b>Players choose their player mats</b>, starting with the highest total Wealth and going down (Rusviet may not take Industrial; Crimea may not take Patriotic). Ties: most games won in the campaign, then most stars on your Triumph Log.",
      "You may use the airships and/or the Doomsday Clock or Backup Plan resolution tiles.",
      "Gain all bonuses under Setup Bonuses on your Campaign Log.",
      "Place your Infrastructure Mods face up near your play area.",
      "Place any number of your Mech Mods over the abilities on your faction mat.",
      "Place <b>1 star from every player</b> on each of the 3 land territories adjacent to the Factory.",
      "The <b>Tesla</b> miniature starts on the home base of the player who found him in Episode 7.",
      "If you like, spend $15 of Wealth on a Perk; then <b>cross off any remaining Wealth</b> on your Campaign Log."
    ],
    setupSrc: "Rise of Fenris p.36",
    special: "<ul><li><b>Winning the campaign:</b> double your final coins for this game only, then add any $25 bonuses earned on your Triumph Log. The highest total wins the game and the campaign; Wealth from earlier episodes doesn't count.</li><li>You must retrieve 3 of your stars from the board before you can place them; your other 3 are available from the start.</li><li>When one of your ground units (character, mech or worker) moves onto a territory holding your star, its movement ends and you claim the star (resolve Traps or combat afterwards). Airships can't claim stars.</li><li>A claimed star may go straight onto the Triumph Track if you meet a requirement at that moment. You can't place a star “retroactively” for a combat won earlier while you had none; otherwise keep it on your faction mat for later.</li><li><b>Tesla</b> (Box E) is both a character and a mech for all standard and special abilities, but doesn't count toward the mech Triumph. He can have encounters, claim a Factory card, carry workers and use all your faction and mech abilities.</li><li>Triumph Tiles notes are in the Triumph Track reference.</li></ul>",
    specialSrc: "Rise of Fenris p.36–37",
    goals: "WIN!",
    ends: "The game ends immediately when a player places their 6th star on the Triumph Track.",
    skip: "three combat spaces, 16 power, 3 encounter tokens and the Factory card (if included)",
    automa: "<ul><li><b>Setup:</b> if the Automa picks its player mat first, it takes one at random (it may take Industrial or Patriotic whatever its faction); the only effect is that the mat is unavailable. With 3+ players, each Automa draws a random mat if a human is anywhere behind it in player order.</li><li><b>Movement:</b> a new first tiebreaker for every Move: the territory with an Automa star on it (skip it if none).</li><li><b>Stars:</b> like you, it can't place a star retroactively for combat or maximum power, but if it retrieves a star while at 16 power it places it. Stars from the Star Tracker are placed as soon as it has one, even retroactively.</li><li>Tesla controlled by the Automa counts as a mech, not a character.</li></ul>",
    automaSrc: "Rise of Fenris p.37",
    automaRewards: "",
    rewards: "<ol><li>Record stars and coins on your Campaign Log. Stars from Triumph Tiles may count for any category on your Triumph Log.</li><li>Go to the campaign finale (Rise of Fenris p.42).</li></ol>",
    rewardsSrc: "Rise of Fenris p.37",
    teach: "Episode 8a is the finale. The Triumph Track is ten random tiles, three of your stars are out on the land around the Factory and must be fetched before you can place them, and the player who found Tesla starts with him. Your coins this game are doubled for the campaign result." },

  { id: "8b", idx: 7, name: "Episode 8b: Tesla's Madness", date: "March 1924", pages: "p.38–41", wg: true,
    setup: [
      "Set up as usual. Vesna and Fenris keep their home base locations.",
      "<b>Players choose their player mats</b>, highest total Wealth first (Rusviet may not take Industrial; Crimea may not take Patriotic). Ties: most games won in the campaign, then most stars on your Triumph Log.",
      "You may use the airships and/or the Doomsday Clock or Backup Plan resolution tiles.",
      "Gain all bonuses under Setup Bonuses on your Campaign Log.",
      "Set up <b>Mad Tesla</b> (see his reference section) <b>before</b> selecting Mods.",
      "Place your Infrastructure Mods face up near your play area.",
      "Place any number of your Mech Mods over the abilities on your faction mat.",
      "If you like, spend $15 of Wealth on a Perk; then <b>cross off any remaining Wealth</b> on your Campaign Log."
    ],
    setupSrc: "Rise of Fenris p.38",
    special: "<ul><li><b>Winning the campaign:</b> double your final coins for this game only, then add any $25 bonuses earned on your Triumph Log. The highest total wins the game and the campaign; earlier Wealth doesn't count.</li><li>Mad Tesla is in play (rules in his reference section).</li><li><b>$10 for destroying Mad Tesla:</b> his rules give the destroyer $10 the moment he is destroyed (p.41), and this episode's end-game scoring list also says “Gain $10 if you destroyed Mad Tesla” (p.39). The book doesn't say whether that is a second $10 or the same $10 restated: agree on it before you play.</li></ul>",
    specialSrc: "Rise of Fenris p.38–39, p.41",
    goals: "WIN!",
    ends: "The game ends immediately when a player destroys Mad Tesla or places their 6th star.",
    skip: "both combat spaces and 16 power",
    automa: "<ul><li><b>Setup:</b> if the Automa picks its player mat first, it takes one at random (Industrial and Patriotic allowed); with 3+ players, each Automa draws a random mat if a human is anywhere behind it in player order.</li><li>Mad Tesla's Automa rules are in his reference section.</li></ul>",
    automaSrc: "Rise of Fenris p.39, p.41",
    automaRewards: "",
    rewards: "<ol><li>Gain $10 if you destroyed Mad Tesla (as the book lists it; whether this is on top of the $10 gained when he fell is the group call noted in the special rules).</li><li>Record stars and coins on your Campaign Log.</li><li>Go to the campaign finale (Rise of Fenris p.42).</li></ol>",
    rewardsSrc: "Rise of Fenris p.39",
    teach: "Episode 8b is the finale. Mad Tesla rampages from the Factory: fight him for popularity, stars and a shot at destroying him, which ends the game. Your coins this game are doubled for the campaign result." }
];
SY.episodeById = function (id) { for (var i = 0; i < SY.episodes.length; i++) if (SY.episodes[i].id === id) return SY.episodes[i]; return null; };

/* =============================================================================
   SETUP PHASES — c = context (see header). Steps follow the rulebook order:
   Core p.6–9 (and the QRG's 18-step list), then expansion/module additions.
   ============================================================================= */
/* Join citation parts, merging pages of the same book: ("Core p.7", "Core p.2, p.9", "p.11")
   -> "Core p.2, p.7, p.9, p.11". A bare "p.N" belongs to the book before it. */
SY.src = function () {
  var order = [], pages = {}, last = "";
  Array.prototype.forEach.call(arguments, function (a) {
    if (!a) return;
    String(a).split(" · ").forEach(function (part) {
      part = part.trim();
      if (!part) return;
      var m = part.match(/^(.*?)\s*\b(p\.\S.*)$/);
      var book = m ? m[1].trim() : part, pg = m ? m[2] : "";
      if (!book) book = last;
      if (!(book in pages)) { pages[book] = []; order.push(book); }
      last = book;
      if (pg) pg.split(/,\s*(?=p\.)/).forEach(function (x) {
        x = x.replace(/^p\./, "");
        if (pages[book].indexOf(x) < 0) pages[book].push(x);
      });
      // a single page inside a range already listed is redundant (p.26–27 covers p.27)
      pages[book] = pages[book].filter(function (x, i, arr) {
        if (!/^\d+$/.test(x)) return true;
        var n = +x;
        return !arr.some(function (y) { var r = y.match(/^(\d+)–(\d+)$/); return r && n >= +r[1] && n <= +r[2]; });
      });
    });
  });
  return order.map(function (b) {
    var ps = pages[b].slice().sort(function (x, y) { return parseInt(x, 10) - parseInt(y, 10); });
    return ps.length ? b + " p." + ps.join(", p.") : b;
  }).join(" · ");
};
SY.inPlayNames = function (c) { return SY.factionsInPlay(c).map(function (f) { return f.name; }).join(", "); };
/* Where a Rise of Fenris module's pieces are (RoF p.51) — module play only; campaign players unlock them. */
SY.comp = function (c, where) { return c.camp ? "" : "<li><b>Components:</b> " + where + ".</li>"; };

SY.phases = [
  /* ---------------- Campaign (Rise of Fenris) ---------------- */
  {
    title: "The campaign",
    steps: [
      { when: function (c) { return c.mode === "campaign" && !c.camp; }, exp: "camp",
        t: "Open the spoiler gate to see your episode",
        d: "<ul><li>Episode setups and rules stay hidden until you open the campaign gate in the configurator and pick an episode.</li><li><b>Avoiding spoilers:</b> don't open, look under or look through any tuckbox or punchboard. Instead, check that tuckboxes <b>A–E</b> and punchboards <b>1–6</b> are all there. If you decide to spoil the tuckboxes, open <b>all</b> of them before deciding whether anything is missing.</li><li>New to Scythe? Play a game or two of regular Scythe before starting the campaign.</li></ul>",
        src: "Rise of Fenris p.2–3" },
      { when: function (c) { return c.camp; }, exp: "camp",
        t: "Campaign Logs",
        d: function (c) {
          return "<ul><li>Each player keeps a <b>Campaign Log</b>: Victories, Wealth, Mods (up to 6 Mech and 6 Infrastructure), Setup Bonuses, Perks and the Triumph Log.</li>" +
            "<li><b>Wealth:</b> after each game add your final coins; spend Wealth on Mods and Perks ($15). Wealth never decides the campaign winner.</li>" +
            "<li><b>Setup Bonuses:</b> permanent extras for every later episode: coins, power (max 3) and popularity (max 3).</li>" +
            "<li><b>Perks</b> (once per campaign, 1 per episode, bought during setup): +$5 · +3 power · +2 objective cards · +2 popularity · +2 resources · +2 combat cards · +1 worker. The resources and the worker go on one of your starting territories. If Perk choices matter to others, choose in player order.</li>" +
            "<li><b>Triumph Log:</b> after each game tick one box per category you placed a star in (even Saxony ticks one objective box per game). Every completed row or column is a $25 end-of-campaign bonus.</li>" +
            "<li>Players can join (unused faction, a fair log), sit out (set their log aside) or leave (return their mat and tokens) mid-campaign.</li></ul>";
        },
        src: "Rise of Fenris p.2–4" },
      { when: function (c) { return c.camp && !c.ep; }, exp: "camp",
        t: "Choose your episode",
        d: "<ul><li>Pick the episode you are about to play in the configurator. Only that episode's setup and rules will appear; its rewards and outcome stay hidden until you mark the episode as over.</li></ul>",
        src: "Rise of Fenris p.3" },
      { when: function (c) { return c.camp && !!c.ep; }, exp: "camp",
        t: function (c) { return c.ep.name + " — episode setup"; },
        d: function (c) {
          return "<p class='inline-note'>Step 1 (“set up the game as usual”) is the normal setup in the phases below; the other steps adjust it. " + c.ep.date + ".</p><ol>" +
            c.ep.setup.map(function (s) { return "<li>" + s + "</li>"; }).join("") + "</ol>";
        },
        src: function (c) { return c.ep.setupSrc; } },
      { when: function (c) { return c.camp && c.automa; }, exp: "auto",
        t: function (c) { return c.solo ? "Solo campaign: the Automa" : "Campaign with Automas"; },
        d: function (c) {
          var d = "<ul><li><b>The Automa's own rules are in the separate Automa rulebook</b>, which this page does not cover; master them before playing the campaign " + (c.solo ? "solo" : "with Automas") + ". These are the campaign adjustments.</li>" +
            "<li>The Automa never buys or uses Perks. From Episode 3 on, give it everything listed in the Mods section of its Campaign Log (never beyond its normal limits, e.g. 8 workers).</li>" +
            "<li>It places <b>all</b> its stars on the Triumph Track. Each episode's <b>Skip Triumphs</b> are the spaces it can earn normally through play" + (c.ep ? " (this episode: " + c.ep.skip + ")" : "") + ". For a Star Tracker star, roll 2 dice and take the lower number; count that many spaces left to right, skipping the Skip Triumph spaces and any space where it already has a star (wrap round to the first valid space), and place the star there.</li>" +
            "<li>It records its stars on its Triumph Log as you do. For a <b>combat</b> Triumph it ticks whichever of the two combat columns has the most ticks without being full; a star “for any category” fills the first empty space in normal reading order. When it gains Setup Bonuses it always takes coins.</li>" +
            "<li><b>Difficulty variant:</b> each setup, subtract the Automa's episode wins from yours and move its Star Tracker token that many spaces (a negative total delays it). With 3+ players, an Automa that finished below its closest human neighbour gets +1, above gets −1, between two humans no change.</li>";
          if (c.ep && c.ep.automa) d += "<li><b>" + c.ep.name + ":</b></li></ul>" + c.ep.automa; else d += "</ul>";
          return d;
        },
        src: function (c) { return SY.src("Rise of Fenris p.3, p.5", c.ep ? c.ep.automaSrc : ""); } }
    ]
  },

  /* ---------------- The board ---------------- */
  {
    title: "Board & supply",
    steps: [
      { when: function (c) { return c.board !== "mod"; }, exp: "core",
        t: "Game board",
        d: function (c) {
          return "<ul><li>Unfold the board. The <b>Triumph Track</b>, <b>Popularity Track</b> and <b>Power Track</b> run along it.</li>" +
            "<li>Seven home bases ring the map: one per core faction and two placeholders for expansion factions" + (c.has("ifa") ? " (the board shows Albion's and Togawa's emblems on them)" : "") + ". A home base is not a territory.</li>" +
            ((c.act("vesna") || c.act("fenris")) ? "<li>" + (c.act("vesna") && c.act("fenris") ? "Vesna's and Fenris's home base tiles go" : c.act("vesna") ? "Vesna's home base tile goes" : "Fenris's home base tile goes") + " over an unused home base (see " + (c.act("vesna") && c.act("fenris") ? "their steps" : "its step") + " below).</li>" : "") + "</ul>";
        },
        src: "Core p.4, p.6" },
      { when: function (c) { return c.board === "mod"; }, exp: "mb",
        t: "Modular board",
        d: function (c) {
          // Modular Board p.2, step 3b brings in The Rise of Fenris's new faction tiles: name them only once a gate
          // reveals those factions, and only alongside their setup/reference sections (the Vesna and Fenris modules).
          var v = c.act("vesna"), f = c.act("fenris"), hb;
          if (!c.has("rof")) hb = "use all 8 home base tiles, including the inactive one.";
          else if (c.modOpen) hb = "with The Rise of Fenris, use 7 of these home base tiles plus the 2 new faction tiles, Vesna's and Fenris's (after the random placement one faction is left out), and leave out the inactive tile." +
            (v && f ? "" : v || f ? " These rules only cover using both new factions: switch on the " + (v ? "Fenris" : "Vesna") + " module too, so its rules appear on this page."
              : " Switch on the Vesna and Fenris modules above to play this way, so their rules appear on this page; without those factions, use all 8 of these tiles, including the inactive one.");
          else if (c.camp) hb = (v || f
              ? "the rules for Rise of Fenris owners also randomize that expansion's faction tiles, which clashes with the campaign's own home-base rules. The closest fit (not covered by the rules): all 8 of these tiles, including the inactive one, then lay " + (v && f ? "Vesna's and Fenris's home base tiles over the locations the campaign gave them (see their steps)" : (v ? "Vesna's" : "Fenris's") + " home base tile over the location the campaign gave it (see its step)") + "."
              : "the rules for Rise of Fenris owners add faction tiles that the campaign reveals later, so they don't fit here. The closest fit (not covered by the rules) is the setup without The Rise of Fenris: all 8 of these tiles, including the inactive one.");
          else hb = "use all 8 home base tiles, including the inactive one. With The Rise of Fenris the rules add faction tiles from that expansion; that setup appears here once you open its module gate.";
          return (c.mode === "campaign" ? "<p class='warn'>The Modular Board rules don't recommend it during campaign play: some random layouts may conflict with various episodes.</p>" : "") +
            "<ol><li>Randomly choose either side of the Modular Board.</li>" +
            "<li>Randomly place the 4 double-sided hex tiles on their marked areas, facing the right way. If a tile puts a lake next to a home base, flip it (one side always fits).</li>" +
            "<li>Randomly place a home base tile on every home base hex, whatever the player count: " + hb + "</li></ol>" +
            "<ul><li><b>Lakes:</b> water on a non-lake territory that connects to an adjacent lake is part of that lake (no Riverwalk needed to cross it, but you need a lake ability).</li>" +
            (c.opt("mbvar") ? "<li><b>Player-count variant</b> (after factions are chosen): remove modular tiles, leaving parts of the board empty. Roughly: 2–3 players remove 2–3 tiles; 4 players remove 1; 5–7 players none. Exactly which (and how many) depends on the home bases in use." + (c.p >= 5 ? " At " + c.p + " players, remove none." : "") + "</li>" : "") + "</ul>";
        },
        src: "Modular Board p.2–3" },
      { when: function () { return true; }, exp: function (c) { return c.triumph === "peace" ? "rof" : "core"; },
        t: "Objective, encounter and combat decks",
        d: function (c) {
          return "<ul><li>Shuffle the <b>objective</b> (beige), <b>encounter</b> (green) and <b>combat</b> (yellow) cards and put each deck on its board space.</li>" +
            "<li>If a combat card must be drawn from an empty deck, shuffle the discards into a new deck; if both are empty, nobody draws.</li>" +
            (c.triumph === "peace" ? "<li><b>Peace Triumph Track:</b> first remove objective card <b>#23</b>.</li>" : "") +
            (c.camp && c.epId === "2a" ? "<li><b>Episode 2a:</b> first remove objective cards 7, 13, 15, 20, 22, 23 and 27.</li>" : "") + "</ul>";
        },
        src: function (c) { return SY.src("Core p.6", "QRG p.1", c.triumph === "peace" ? "Rise of Fenris p.18" : "", c.camp && c.epId === "2a" ? "Rise of Fenris p.16" : ""); } },
      { when: function () { return true; }, exp: function (c) { return c.act("vesna") ? "rof" : "core"; },
        t: "Factory cards",
        d: function (c) {
          var n = c.solo ? "players + 1 (in a solo game, follow the Automa rulebook)" : "<b>" + (c.p + 1) + "</b> (players + 1)";
          var ep3 = c.camp && c.epId === "3";
          return "<ul><li>Shuffle the 12 Factory cards (purple), deal " + n + " face down onto the board, and return the rest to the box unseen.</li>" +
            (ep3 ? "<li><b>Episode 3:</b> also shuffle the Vesna card and <b>4 more</b> Factory cards into this deck" + (c.solo ? "" : ": " + (c.p + 6) + " cards in all") + ". This episode nobody looks through the whole deck (see its special rules).</li>"
                 : "<li>The first character to reach the Factory looks at all of them and keeps one; each later visitor sees one fewer.</li>") +
            (c.act("vesna") ? "<li><b>Vesna" + (c.camp ? " (if she is at the table)" : "") + ":</b> then draw 3 more at random from the cards not in use and place them face up beside Vesna's player mat.</li>" : "") +
            "</ul>";
        },
        src: function (c) { return SY.src("Core p.2, p.6, p.25", "QRG p.1", c.act("vesna") ? "Rise of Fenris p.22" : "", c.camp && c.epId === "3" ? "Rise of Fenris p.20" : ""); } },
      { when: function () { return true; }, exp: function (c) { return c.has("mb") ? "mb" : "core"; },
        t: "Structure bonus tile",
        d: function (c) {
          return "<ul><li>Shuffle the structure bonus tiles" +
            (c.has("mb") ? ": the core 6 <b>plus the Modular Board's 8</b> (its rules mix them in for every game of Scythe, modular board or not)" : " (6)") +
            ", draw 1 at random and place it face up at the bottom of the Popularity Track. Remove the rest from the game.</li>" +
            "<li>At the end it pays coins for where your structures stand, even on territories you no longer control (tiles in the reference).</li></ul>";
        },
        src: function (c) { return SY.src("Core p.6, p.18", "QRG p.1", c.has("mb") ? "Modular Board p.3" : ""); } },
      { when: function () { return true; }, exp: "core",
        t: "Encounter tokens",
        d: function (c) {
          return "<ul><li>Place 1 encounter token (green compass) on each territory marked with the encounter symbol" +
            (c.board === "mod" ? " on your layout." : ": <b>11</b> tokens on the standard board.") + "</li>" +
            (c.camp && c.epId === "7" ? "<li><b>Episode 7:</b> also place the 12th token on the Factory.</li>" : "") + "</ul>";
        },
        src: function (c) { return SY.src("Core p.6", "QRG p.1", c.camp && c.epId === "7" ? "Rise of Fenris p.34" : ""); } },
      { when: function () { return true; }, exp: "core",
        t: "Supply",
        d: "<ul><li>Put the resource tokens (oil, metal, food, wood), the coins and the multiplier tokens in a supply beside the board.</li><li>Resources are unlimited: use a multiplier token when you run short.</li></ul>",
        src: "Core p.4, p.6 · QRG p.1" }
    ]
  },

  /* ---------------- Factions ---------------- */
  {
    title: "Factions & player mats",
    steps: [
      { when: function (c) { return c.board !== "mod"; }, exp: function (c) { return c.has("ifa") ? "ifa" : "core"; },
        t: "Deal faction mats and player mats",
        d: function (c) {
          var mats = c.has("ifa") ? "7 player mats (including 2a and 3a)" : "5 player mats";
          var deal = "<li>Shuffle the faction mats in play (" + SY.inPlayNames(c) + ") and the " + mats + " separately, and deal each player <b>one of each</b>.</li>";
          if (c.camp && c.ep) {
            if (c.epId === "1") deal = "<li><b>Episode 1:</b> select or randomize faction mats (you keep your faction in later episodes) and deal the " + mats + " at random.</li>";
            else if (c.epId === "8a" || c.epId === "8b") deal = "<li><b>Keep your faction.</b> This episode players <b>choose</b> player mats, highest total Wealth first (see the episode setup).</li>";
            else deal = "<li><b>Keep your faction mat</b> from the last episode; deal the " + mats + " at random.</li>";
          }
          return "<ul>" + deal +
            ((c.epId === "8a" || c.epId === "8b") ? "<li><b>Banned pairs:</b> Rusviet may not choose the <b>Industrial</b> player mat and Crimea may not choose the <b>Patriotic</b> mat.</li>"
              : "<li><b>Banned pairs:</b> Rusviet may not have the <b>Industrial</b> player mat and Crimea may not have the <b>Patriotic</b> mat. Whoever is dealt one discards that player mat and takes another at random.</li>") +
            "<li>Sit by your faction's home base with both mats in front of you. Core seating, clockwise from the top: Nordic, Rusviet, Crimea, Saxony, Polania.</li>" +
            (c.has("ifa") && (!c.camp || c.epId === "1") ? "<li>Players new to Scythe should take one of the original factions, not Albion or Togawa.</li>" : "") +
            (c.opt("matorder") ? "<li><b>Variant:</b> deal the player mats clockwise <b>by number</b> instead of at random. (Starting resources are staggered for turn order and playtest results, but the effect is very, very small.)</li>" : "") + "</ul>";
        },
        src: function (c) { return SY.src("Core p.6", "QRG p.1", c.has("ifa") ? "Invaders p.1, p.3" : "", c.opt("matorder") ? "Wind Gambit p.7" : "", c.camp && c.ep ? "Rise of Fenris " + c.ep.setupSrc.match(/p\.\d+/)[0] : ""); } },
      { when: function (c) { return c.board === "mod"; }, exp: "mb",
        t: "Deal player mats, then choose factions",
        d: function (c) {
          return "<ol><li>Deal a player mat to each player at random.</li>" +
            "<li>Starting with the <b>highest-numbered</b> mat and going down (" + (c.has("ifa") ? "5, 4, 3a, 3, 2a, 2, 1" : "5, 4, 3, 2, 1") + "), each player chooses a faction whose home base is on the board, and sits near it.</li></ol>" +
            "<ul><li><b>Think about Riverwalk</b> when choosing, especially a faction with metal nearby (for mechs) but no wood (for a Mine). Experienced players may need to guide new ones.</li>" +
            "<li><b>Banned:</b> the Industrial mat may not choose Rusviet; the Patriotic mat may not choose Crimea.</li>" +
            (c.opt("matorder") ? "<li><b>Player mats in number order:</b> the Modular Board deals mats at random and seats everyone by the faction they choose, so The Wind Gambit's deal-clockwise-by-number variant doesn't fit this setup.</li>" : "") +
            (c.camp ? "<li><b>Campaign:</b> you keep your faction between episodes, so only player mats change.</li>" : "") + "</ul>";
        },
        src: function (c) { return SY.src("Modular Board p.2", c.opt("matorder") ? "Wind Gambit p.7" : ""); } },
      { when: function (c) { return c.p >= 6; }, exp: "ifa",
        t: function (c) { return c.board === "mod" ? "6–7 players: Polania's ability swap" : "6–7 players: Crimea's and Polania's ability swaps"; },
        d: function (c) {
          return "<ul><li><b>Crimea:</b> " + (c.board === "mod"
              ? "keep the original <b>Wayfare</b>: the Modular Board rules say so even at 6–7 players, and any inactive home base is a valid target (1 inactive base at 7 players, 2 at 6, and so on). This replaces Invaders from Afar's swap to “Move to any unoccupied farm”."
              : "replace <b>Wayfare</b> with its punchboard token: <b>“Move to any unoccupied farm.”</b>") + "</li>" +
            "<li><b>Polania:</b> replace <b>Meander</b> with its punchboard token: <b>“Pick up to 2 options per encounter card. At end of game, gain $3 for each encounter territory you control.”</b></li>" +
            "<li>No other rule changes; the map is simply more crowded. Scythe runs about 25 minutes per player.</li></ul>";
        },
        src: function (c) { return SY.src("Invaders p.3", c.board === "mod" ? "Modular Board p.2" : ""); } },
      { when: function (c) { return c.act("vesna"); }, exp: function (c) { return c.camp ? "camp" : "rof"; },
        t: "Vesna",
        d: function (c) {
          return "<ul>" + (c.camp
              ? "<li>If Vesna is at the table this episode, the Vesna player keeps the home base location chosen after Episode 3" + (c.epi >= 6 ? " (a player who took Vesna after Episode 6 keeps it too, unless another player's faction uses that base; then they chose an unused one)" : "") + ".</li>"
              : "<li><b>Home base:</b> " + (c.board === "mod" ? "on the Modular Board her home base tile goes into the random layout (see the Modular board step)." : "pick at random a home base no other player is using and lay the <b>Vesna home base tile</b> over it.") + "</li>") +
            "<li><b>Factory cards:</b> after the usual cards are on the board, draw 3 more at random from those not in use and put them face up beside your player mat.</li>" +
            "<li><b>Mech abilities:</b> Vesna's mat prints only Riverwalk and Speed; the other 2 spaces are blank. Draw 6 of her 18 blue-bordered mech ability tokens at random (return the other 12 to the box). From those tokens" + (c.act("mechmods") ? " and your Mech Mods" : "") + ", choose <b>2–4</b>: 2 cover the blank spaces; a 3rd or 4th covers Riverwalk or Speed. They are locked in for this game; set the rest aside.</li>" +
            (c.camp ? "<li>Choose them before any Mods or abilities are placed on her mat.</li>"
                    : c.act("mechmods") ? "<li>Do this after Mech Mods are drawn and chosen, but before any Mods or abilities are placed on her mat.</li>" : "") +
            "<li>Vesna's airship is only used with The Wind Gambit (its stands are in that box).</li>" + SY.comp(c, "Box A and punchboard 4") + "</ul>";
        },
        src: function (c) { return SY.src("Rise of Fenris p.22–23", c.camp ? (c.epi >= 6 ? "p.21, p.33" : "p.21") : "p.51"); } },
      { when: function (c) { return c.act("fenris"); }, exp: function (c) { return c.camp ? "camp" : "rof"; },
        t: "Fenris",
        d: function (c) {
          return "<ul>" + (c.camp
              ? "<li>If Fenris is at the table, its home base tile goes over the base of the faction its player had before becoming Fenris (Episode 5's rewards); keep using that location" + (c.epi >= 6 ? " (a player who took Fenris after Episode 6 keeps it too, unless another player's faction uses that base; then they chose an unused one)" : "") + ".</li>"
              : "<li><b>Home base:</b> " + (c.board === "mod" ? "on the Modular Board its home base tile goes into the random layout (see the Modular board step)." : "pick at random a home base no other player is using and lay the <b>Fenris home base tile</b> over it.") + "</li>") +
            "<li>Put all <b>16 Influence tokens</b> in your supply, then set up your faction as usual.</li>" +
            "<li>Every Influence token a player holds at the end is −$1, so Fenris effectively starts at −$16. Nobody can finish below $0.</li>" +
            "<li>Fenris's airship is only used with The Wind Gambit.</li>" + SY.comp(c, "Box B (Fenris workers), Box C (its Annihilator mech), Box D and punchboard 5 (everything else)") + "</ul>";
        },
        src: function (c) { return SY.src("Rise of Fenris p.30–31", c.camp ? (c.epi >= 6 ? "p.29, p.33" : "p.29") : "p.51"); } }
    ]
  },

  /* ---------------- Mats ---------------- */
  {
    title: "Each player's mats",
    steps: [
      { when: function () { return true; }, exp: "core",
        t: "Starting power, combat cards, popularity and coins",
        d: function (c) {
          return "<p>Each mat has a box at its far right:</p><ul>" +
            "<li><b>Faction mat:</b> put your power token on that number on the Power Track, and draw that many combat cards (how many you hold is public; what they are is secret).</li>" +
            "<li><b>Player mat:</b> put your popularity token (heart) on that number on the Popularity Track, take that many coins (keep them on your faction mat; you never have to reveal your total), and draw that many objective cards (secret). Then return the objective deck to the board.</li>" +
            (c.triumph === "peace" ? "<li><b>Peace Triumph Track:</b> Saxony draws <b>3</b> objective cards instead of 2.</li>" : "") +
            (c.camp && c.epi >= 3 ? "<li><b>Campaign:</b> add your Setup Bonuses, plus any Perk you buy.</li>" : "") +
            (c.camp && c.epi >= 0 && c.epi < 3 ? "<li><b>Campaign:</b> add any Perk you use this episode.</li>" : "") +
            "</ul>" + SY.factionTable(c);
        },
        src: function (c) { return SY.src("Core p.7, p.15–17 (mats)", "QRG p.1", c.has("ifa") ? "Invaders p.5, p.7" : "", c.act("vesna") ? "Rise of Fenris p.22" : "", c.act("fenris") ? "Rise of Fenris p.31" : "", c.triumph === "peace" ? "Rise of Fenris p.18" : "", c.camp ? "Rise of Fenris p.4" : ""); } },
      { when: function () { return true; }, exp: "core",
        t: "Character, workers and faction mat",
        d: function (c) {
          return "<ul><li>Put your <b>character</b> (the person-and-animal miniature) on your home base.</li>" +
            "<li>Put <b>1 worker</b> on each of the 2 territories connected to your home base by land.</li>" +
            "<li>Put your <b>4 mechs</b> on the 4 mech ability spaces of your faction mat.</li>" +
            "<li>Put your <b>6 stars</b> at the upper left of your faction mat, by the emblem.</li>" +
            "<li>Leave the <b>recruit one-time bonus</b> spaces (bottom left) empty; recruits fill them during the game.</li>" +
            (c.act("rivals") ? "<li><b>Rivals:</b> some of your stars may go onto rivals' home bases at the very end of setup.</li>" : "") + "</ul>";
        },
        src: "Core p.7, p.9 · QRG p.1" },
      { when: function () { return true; }, exp: "core",
        t: "Player mat",
        d: "<ul><li><b>6 technology cubes</b> on the green boxes that have a black square in the corner.</li><li><b>4 structures</b> (Armory, Monument, Mine, Mill) on their matching boxes.</li><li><b>4 recruit tokens</b> (cylinders) on the round spaces of the bottom row.</li><li>Your <b>other 6 workers</b> on the red rectangles above the Produce action.</li><li>Your <b>action token</b> beside the player mat.</li></ul>",
        src: "Core p.8 · QRG p.1" },
      { when: function () { return true; }, exp: "core",
        t: function (c) { return c.opt("firstgame") ? "Riverwalk and quick-start cards" : "Riverwalk cards"; },
        d: function (c) {
          return "<ul><li>Give each player a <b>Riverwalk card</b>: it reminds everyone which factions can cross into each home territory once they unlock their (slightly different) Riverwalk ability.</li>" +
            (c.opt("firstgame") ? "<li><b>First game:</b> give each player a <b>quick-start card</b>. One side sums up the units; the other covers the broad concepts and suggests something to do on each of your first five turns. Don't try to teach every rule; start pushing buttons and look things up as they come.</li>" : "") +
            (c.p >= 6 ? "<li><b>6–7 players:</b> the core box has only 5 Riverwalk cards" + (c.opt("firstgame") ? " and 5 quick-start cards" : "") + "; Invaders from Afar adds none.</li>" : "") + "</ul>";
        },
        src: function (c) { return SY.src("Core p.9", c.p >= 6 ? "Core p.2 · Invaders p.2" : ""); } }
    ]
  },

  /* ---------------- Expansions & modules ---------------- */
  {
    title: "Expansions & modules",
    steps: [
      { when: function (c) { return c.air; }, exp: "wg",
        t: "Airships",
        d: function (c) {
          return "<ol><li>Each player takes the airship in their faction's colour and puts it on their home base.</li>" +
            "<li>Shuffle the two kinds of airship tile separately (different backs). " +
            (c.opt("airadv") ? "<b>Advanced variant:</b> deal each player 1 aggressive (red) and 1 passive (green) tile; that pair applies only to their airship. (Not recommended, especially with 4+ players.)"
                             : "Reveal <b>1 aggressive (red)</b> and <b>1 passive (green)</b> tile and put them by the encounter deck: every airship has both abilities all game.") + "</li></ol>" +
            "<ul><li>The aggressive tile says whether airships carry <b>up to 3 resources</b> or <b>up to 2 workers</b>; the passive tile's hex shows the airship's <b>range</b>.</li>" +
            ((c.act("vesna") || c.act("fenris")) ? "<li>" + (c.act("vesna") && c.act("fenris") ? "Vesna's and Fenris's airships use" : c.act("vesna") ? "Vesna's airship uses" : "Fenris's airship uses") + " stands from The Wind Gambit box.</li>" : "") +
            (c.coop ? "<li><b>Desolation:</b> allowed, but not recommended for your first few plays: some airship abilities interact confusingly with cooperative play.</li>" : "") +
            (c.camp ? "<li><b>Campaign:</b> airships are allowed from Episode 4 on.</li>" : "") + "</ul>";
        },
        src: function (c) { return SY.src("Wind Gambit p.3–5", c.act("vesna") ? "Rise of Fenris p.23" : "", c.act("fenris") ? "Rise of Fenris p.31" : "", c.coop ? "Rise of Fenris p.47" : "", c.camp ? "Rise of Fenris p.24" : ""); } },
      { when: function (c) { return c.res; }, exp: "wg",
        t: "Resolution tile",
        d: function (c) {
          return "<ul>" + (c.camp ? "<li><b>Campaign (Episodes 4–8):</b> use only the <b>Doomsday Clock</b> or <b>Backup Plan</b> tile.</li>" : "<li>Shuffle the 8 resolution tiles and draw 1 at random.</li>") +
            "<li>Read it aloud and place it face up near the Triumph Track. It applies to everyone.</li>" +
            "<li>Ignore the standard end of the game (a 6th star stops everything): this tile decides when and how the game ends.</li>" +
            (c.camp ? "" : "<li>If your group loves one tile, you may simply choose it every game.</li>") + "</ul>";
        },
        src: function (c) { return SY.src("Wind Gambit p.6", c.camp ? "Rise of Fenris p.24" : ""); } },
      { when: function (c) { return c.act("mechmods"); }, exp: function (c) { return c.camp ? "camp" : "rof"; },
        t: "Mech Mods",
        d: function (c) {
          return c.camp
            ? "<ul><li>Place any number of the Mech Mods you own over abilities on your faction mat; set the rest aside. You can't rearrange them once the episode begins.</li></ul>"
            : "<ul><li>After faction and player mats are settled, each player draws <b>4 Mech Mods</b> at random (redraw duplicates, which include abilities already on your faction mat) and places <b>up to 2</b> over mech abilities on their faction mat. Discard the rest.</li>" +
              (c.automa ? "<li><b>Automa:</b> it doesn't draw Mods; it “buys” them instead (see Mech Mods in the reference).</li>" : "") + SY.comp(c, "punchboard 2") + "</ul>";
        },
        src: function (c) { return c.camp ? "Rise of Fenris p.6" : "Rise of Fenris p.51, p.6"; } },
      { when: function (c) { return c.act("inframods"); }, exp: function (c) { return c.camp ? "camp" : "rof"; },
        t: "Infrastructure Mods",
        d: function (c) {
          return (c.camp
            ? "<ul><li>Place your Infrastructure Mods face up near your play area.</li>"
            : "<ul><li>Each player draws <b>4 Infrastructure Mods</b> at random (redraw duplicates) and places <b>up to 2</b> face up beside their player mat. Discard the rest.</li>") +
            "<li>Each can be used <b>once per game</b> (flip it), only at the moment printed on it.</li>" +
            (c.automa ? "<li><b>Automa:</b> remove the <b>Spy</b> Infrastructure Mods from any game against the Automa.</li>" : "") + SY.comp(c, "punchboard 3") + "</ul>";
        },
        src: function (c) { return SY.src(c.camp ? "Rise of Fenris p.7" : "Rise of Fenris p.51, p.7", c.automa ? "Rise of Fenris p.6" : ""); } },
      { when: function (c) { return c.triumph !== "std" && !c.coop; }, exp: function (c) { return c.camp ? "camp" : "rof"; },
        t: function (c) { return ({ war: "War Triumph Track", peace: "Peace Triumph Track", tiles: "Triumph Tiles" })[c.triumph]; },
        d: function (c) {
          if (c.triumph === "war") return "<ul><li>Lay the <b>War Triumph Track</b> over the Triumph Track. The game ends when a player places their 6th star on it.</li><li>It changes how stars are earned (see the Triumph Track reference).</li>" + SY.comp(c, "punchboard 1") + "</ul>";
          if (c.triumph === "peace") return "<ul><li>Lay the <b>Peace Triumph Track</b> over the Triumph Track. The game ends at the 6th star on it.</li><li>Remove objective card <b>#23</b> (see the decks step) and give <b>Saxony 3</b> objective cards instead of 2 (it can't earn combat stars on this track).</li>" + (c.camp ? "" : "<li>Rivals can't be used with the Peace track.</li>") + SY.comp(c, "punchboard 1") + "</ul>";
          return "<ul><li>Shuffle the <b>16 Triumph Tiles</b> and place them at random on all <b>10</b> Triumph Track slots. Read them out.</li>" + SY.comp(c, "punchboard 6") + "</ul>";
        },
        src: function (c) { return SY.src(({ war: "Rise of Fenris p.16", peace: "Rise of Fenris p.18", tiles: c.camp ? "Rise of Fenris p.36–37" : "Rise of Fenris p.37" })[c.triumph], c.camp ? "" : "p.51"); } },
      { when: function (c) { return c.act("rivals"); }, exp: function (c) { return c.camp ? "camp" : "rof"; },
        t: "Rivals (at the very end of setup)",
        d: function (c) {
          var max = c.triumph === "war" ? 4 : 2;
          return "<ul><li>After every other setup step, all players at once may declare rivals: place up to <b>" + max + "</b> of your stars on other players' home bases (several on one base is fine)." +
            (max === 2 ? " Without the War Triumph Track, the limit is 2 instead of 4." : "") + "</li>" +
            (c.automa ? "<li><b>Automa:</b> place 2 of its stars on your home base. With 3+ players, each Automa puts 1 star on each of its two neighbouring opponents' home bases.</li>" : "") + "</ul>";
        },
        src: function (c) { return SY.src("Rise of Fenris p.16", c.camp ? "" : "p.51", c.automa ? "p.17" : ""); } },
      { when: function (c) { return c.act("alliances"); }, exp: function (c) { return c.camp ? "camp" : "rof"; },
        t: "Alliances",
        d: function (c) {
          return "<ul><li>Each player takes their own faction's <b>Alliance token</b> (its faction ability and a coin amount on the front, −$10 on the back). Return the other Alliance tokens to the box.</li>" +
            ((c.act("vesna") || c.act("fenris")) ? "<li>The Vesna and Fenris Alliance tokens come from the Fenris punchboard.</li>" : "") +
            (c.automa ? "<li><b>Automa:</b> you may form an alliance with the Automa during setup. The alliance rules apply to you, not to it: it gets $8 instead of anything from the token. With 3+ players, decide in reverse turn order.</li>" : "") + SY.comp(c, "punchboards 1 and 5") + "</ul>";
        },
        src: function (c) { return SY.src("Rise of Fenris p.18", c.camp ? "" : "p.51", (c.act("vesna") || c.act("fenris")) ? "p.29" : "", c.automa ? "p.19" : ""); } },
      { when: function (c) { return c.act("tesla") && !c.camp; }, exp: "rof",
        t: "Tesla",
        d: "<ul><li>Set the Tesla miniature aside. The first player to have <b>3 encounters</b> completes that third encounter, then takes control of Tesla and places him on that encounter's territory.</li><li><b>Or</b> assign Tesla at setup to any faction you consider weaker than the others; he starts on its home base.</li><li><b>Components:</b> Box E.</li></ul>",
        src: "Rise of Fenris p.51, p.37" },
      { when: function (c) { return c.act("madtesla"); }, exp: function (c) { return c.camp ? "camp" : "rof"; },
        t: "Mad Tesla",
        d: function (c) {
          return "<ol><li>Place the Tesla miniature on the Factory.</li><li>Discard the top 2 cards of the combat deck.</li><li>Put an unused faction's popularity token on space <b>16</b> of the Power Track: Tesla's “health”, never spent in combat.</li><li>Mad Tesla always goes <b>last</b>. Place the Mad Tesla tile between the first and last player, turned the same way as the board: it steers his movement.</li></ol>" +
            "<ul>" + (c.camp ? "" : "<li>Your group may decide: the game ends when Mad Tesla is destroyed or at a 6th star (as written), or only at a 6th star.</li>") +
            (c.act("tesla") ? "<li>The Tesla module uses the same Tesla miniature. The book doesn't cover combining the two modules; you'll need a stand-in for one of them.</li>" : "") + SY.comp(c, "Box E and the Mad Tesla tile (punchboard 6)") + "</ul>";
        },
        src: function (c) { return c.camp ? "Rise of Fenris p.40" : "Rise of Fenris p.40, p.51"; } },
      { when: function (c) { return c.coop; }, exp: "rof",
        t: "Desolation (co-op)",
        d: function (c) {
          var n = SY.desolationTiles(c.p);
          return "<ol><li>Set up as normal with any mix of factions, but <b>no</b> alternative Triumph Tracks, Rivals, Mad Tesla or resolution tiles.</li>" +
            "<li>Shuffle all <b>21 Triumph Tiles</b> (including the 5 used only with this module) and reveal <b>" + n + "</b> for " + c.p + " player" + (c.p > 1 ? "s" : "") +
            (c.p === 1 ? " (don't use the 5-star tile, and if you reveal 2 objective tiles, draw and discard another)" : "") +
            ", laid over the Triumph Track and around it. One way to win is a star on every tile.</li>" +
            "<li>Place the <b>Desolation tile</b> beside the board" + (c.p <= 2 ? " (with 1–2 players, over any exposed part of the Triumph Track)" : "") + ".</li>" +
            "<li>Choose an inactive faction to be <b>Desolation</b> (for looks the book suggests Fenris, if it's available). Put its 4 mechs, its character and the Tesla miniature on the 6 territories around the Factory, one each" + (c.act("tesla") ? " (Tesla is in use, but any extra miniature will do)" : "") + ".</li>" +
            "<li>Desolation's popularity token goes on <b>18</b> and the blue die on popularity <b>12</b>: popularity is its timer, and at 12 its units start moving. Its 6 stars and the orange die go beside the Desolation tile.</li>" +
            "<li>Draw a combat card, put it beside the Desolation tile and mark its value on the Power Track: Desolation's current power.</li>" +
            "<li>First player as usual (lowest-numbered mat). Desolation takes the last turn each round.</li></ol>" +
            "<ul><li><b>Easier:</b> use Mech Mods, Infrastructure Mods and/or Alliances." + (c.act("deshard") ? "" : " <b>Harder:</b> switch on “Desolation: harder”.") + "</li>" +
            (c.act("deshard") ? "<li><b>Harder (on):</b> whenever a Desolation unit displaces a worker (by movement or combat), Desolation loses 1 popularity per worker, advancing its timer.</li>" : "") +
            "<li>The Automa doesn't support Desolation.</li>" + SY.comp(c, "punchboard 6") + "</ul>";
        },
        src: "Rise of Fenris p.46–47, p.50–51" },
      { when: function (c) { return c.act("mpautoma"); }, exp: "auto",
        t: "Automas at the table (semi-official)",
        d: function (c) { return "<ul><li>Choose how many seats are Automas (up to the normal maximum). Each Automa gets its own faction mat, units and so on, set up by the <b>Automa rulebook</b> (not covered here), and takes a place in turn order like a human.</li><li>Pick the mode: <b>cooperative</b> (all humans against all Automas: compare the humans' average coins with the Automas' average as if it were a 2-player game; “enemy” means any human) or <b>competitive</b> (normal scoring; “enemy” means any other player).</li><li>Ideally give each Automa its own Automa deck; one shared deck works, with more reshuffles and bigger swings.</li><li>Each Automa has its own token on a Star Tracker card (simplest if they share a difficulty level).</li><li>Place an Automa recruit token on Albion's home base: it replaces the English-reading-order tiebreaker (see the reference).</li><li>The Stonemaier rules call this a semi-official variant, not recommended until you know the normal Automa rules.</li>" + SY.autoModNote(c) + "</ul>"; },
        src: function (c) { return SY.src("Rise of Fenris p.48–49", SY.autoModNote(c) ? "p.50" : ""); } },
      { when: function (c) { return c.solo && !c.camp; }, exp: "auto",
        t: "Solo: the Automa",
        d: function (c) {
          var mods = c.act("mechmods") && c.act("inframods") ? "4 Infrastructure Mods" : c.act("mechmods") ? "3 Mech Mods" : c.act("inframods") ? "2 Infrastructure Mods" : "";
          return "<ul><li>Solo play is against the <b>Automa</b>. Its rules are in a separate <b>Automa rulebook</b>, which is not among this page's sources, so <b>this page does not cover them</b> (The Wind Gambit's component list includes an Automa rulebook). Set up the Automa from that book; where it changes a step here, it wins.</li>" +
            (c.board === "mod" ? "<li><b>Modular Board:</b> on the normal board, water holds the Automa back early on; a random layout may not, so choose the starting home bases carefully (or take on the challenge).</li>" : "") +
            SY.autoModNote(c) +
            (mods ? "<li><b>Mods:</b> the Automa “buys” " + mods + ". Remove the Spy Infrastructure Mods.</li>" : "") + "</ul>";
        },
        src: function (c) { return SY.src("Core p.1", "Wind Gambit p.2", c.board === "mod" ? "Modular Board p.3" : "", c.modOpen ? "Rise of Fenris p.50" : "", (c.act("mechmods") || c.act("inframods")) ? "p.6" : ""); } }
    ]
  },

  /* ---------------- Start ---------------- */
  {
    title: "Start the game",
    steps: [
      { when: function () { return true; }, exp: function (c) { return c.has("ifa") ? "ifa" : "core"; },
        t: "First player",
        d: function (c) {
          return "<ul><li>The player whose player mat shows the <b>lowest number</b> goes first; play continues clockwise." +
            (c.has("ifa") ? " With Invaders from Afar the order is 1, 2, <b>2a</b>, 3, <b>3a</b>, 4, 5." : "") + "</li>" +
            "<li>Higher-numbered mats start a little richer, because those players are likely to get one turn fewer.</li>" +
            (c.act("madtesla") ? "<li><b>Mad Tesla</b> takes his turn after the last player each round.</li>" : "") +
            (c.coop ? "<li><b>Desolation</b> takes the last turn each round.</li>" : "") +
            "<li>No rounds or phases: turns simply rotate until the game ends. Start your turn as soon as the player on your right begins a bottom-row action.</li></ul>";
        },
        src: function (c) { return SY.src("Core p.8, p.10, p.14", "QRG p.1", c.has("ifa") ? "Invaders p.3" : ""); } },
      { when: function (c) { return c.opt("firstgame"); }, exp: "var",
        t: "First game: a sample scoring round",
        d: "<ul><li>After any player places their first star, pause and let everyone work out their current score, just to get a feel for end-game scoring. It doesn't count.</li></ul>",
        src: "Core p.28" },
      { when: function (c) { return c.opt("delay"); }, exp: "var",
        t: "Delay of Game variant",
        d: "<ul><li>Anyone who holds up the game (during play, not at the final scoring) for more than 10 seconds trying to work out final scores loses 2 popularity.</li></ul>",
        src: "Core p.28" }
    ]
  }
];

/* =============================================================================
   AUTOMA NOTES per module (Rise of Fenris Automa boxes / Modular Rules table)
   ============================================================================= */
SY.autoNotes = {
  war: "<ul><li>Through play the Automa can earn all four combat stars and the 16-power star.</li><li>It never places a star for holding 8 combat cards.</li></ul>",
  warCamp: "<p class='inline-note'>In the campaign a random Star Tracker placement may still land on the 8-combat-card space (RoF p.17).</p>",
  rivals: "<ul><li><b>Setup:</b> place 2 of its stars on your home base (3+ players: 1 star from each Automa on each of its two neighbouring opponents' home bases).</li><li>It gains $5 when it places a star taken from your base. With 3+ players, if it beats a player whose base holds none of its stars, it takes its home-base star closest clockwise to that player's base.</li><li><b>Movement:</b> an extra first tiebreaker for every Move: the territory closest to any unit of a player on whose base it has a star.</li><li><b>Encounter/Factory action:</b> if it has a star on an opponent's base and 5+ power, it makes an attack move against a combat unit of that opponent instead. Playing Albion or Togawa and winning that combat, it places a Flag or Trap even with a mech. If no combat results, it does the Encounter/Factory action as normal.</li></ul>",
  peace: "<ul><li>Through play it can earn the 3-encounter star and the Factory-card star (it places a star for removing 3 encounter tokens and for obtaining a Factory card).</li></ul>",
  peaceNoAlliances: "<ul><li><b>Without Alliances</b> (modular rules), it switches to Scheme II only once its Star Tracker has reached the first star <b>and</b> it has been in a combat or an action in which a worker retreated.</li></ul>",
  alliances: "<ul><li><b>Setup:</b> you may ally with the Automa; the rules apply to you, not to it: it takes $8 instead. With 3+ players, decide in reverse turn order.</li><li>After setup it never agrees to an alliance. With 3+ players, the odd-man-out $5 goes to the only human without an Alliance token.</li><li>It doesn't lose $10 for breaking an alliance. Playing Togawa, it places no Traps while you hold its Alliance token active side up.</li><li>It postpones switching to Scheme II (and the reshuffle that goes with it) while it holds an Alliance token active side up and its own token is also active side up.</li></ul>",
  tiles: "<ul><li>Through play (besides Star Tracker stars) it can earn the four combat stars, the 16-power star, the 3-encounter star and the Factory-card star, if those tiles are included.</li></ul>",
  mods: "<ul><li>Infrastructure Mods only: it “buys” 2 Infrastructure Mods. Mech Mods only: 3 Mech Mods. Both: 4 Infrastructure Mods.</li><li>As in the Mods rules (p.6), for each one it draws a random Mod tile of that type and removes it, and instead of using the tile it gains the Mod Benefit Table's benefit, in order. Infrastructure: 1st Star Tracker +1, 2nd Gain stuff, 3rd Remove card 4, 4th Star Tracker +1. Mech: 1st Gain stuff, 2nd No effect, 3rd Gain stuff.</li><li><b>Star Tracker +1:</b> advance its Star Tracker token 1 space at setup. <b>Gain stuff:</b> draw an Automa card and give it the items in the “Gain Stuff” section of its Scheme I (green) half, ignoring faction-specific items. <b>Remove card 4:</b> that Automa card (number at the top right of its green half) leaves the deck.</li><li>Remove the Spy Infrastructure Mods from any game against the Automa.</li></ul>",
  vesna: "<ul><li>If it ever needs to choose a home base, mix the icon tokens of all unselected home bases and draw one.</li><li>It doesn't get the 3 extra Factory cards.</li><li>First step of every setup: mix the icon tokens of the 7 base-game and Invaders from Afar factions, draw 2 and place them face up beside the Automa deck; it carries out the bracketed faction-specific actions of both.</li></ul>",
  fenris: "<ul><li><b>Automa as Fenris:</b> it draws its home base from the unselected home bases' icon tokens and uses no faction-specific (bracketed) actions. For each enemy unit it forces to retreat, it gives that unit's owner 1 Influence token (while it has any). After each character move it places up to 3 Influence tokens: 1 on the character's territory (if none there); then, on a primary terrain, 2 more on unoccupied, tokenless territories of the same type (tiebreakers: closest to an enemy combat unit, then English reading order). It never loses coins for Influence at episode rewards.</li><li><b>Automa against Fenris:</b> it picks up Influence tokens and loses coins for them normally. All its Move actions add a tiebreaker (after any episode tiebreaker, before the normal ones): the territory without an Influence token, unless it currently counts as more than 1 territory for scoring.</li></ul>",
  tesla: "<ul><li>The Automa uses no special rules to find encounter tokens.</li><li>If it controls Tesla, he is a mech for all its actions; against Tesla, it treats him as any enemy combat unit.</li></ul>",
  madtesla: "<ul><li>It discards combat cards in random order, and treats Tesla as an enemy combat unit in all its Moves.</li><li>Its popularity (starting at 10) changes only when fighting Mad Tesla, exactly as yours does, which can change its end-game coins.</li><li>If Tesla would move onto a territory with an Automa unit, reroll the movement die once and keep that roll.</li><li>If it beats Tesla on the Factory and at least 1 adjacent territory is unoccupied, roll and use the Mad Tesla tile to send him away, rerolling until he lands on an unoccupied territory.</li></ul>"
};
/* Modular-rules Automa note (RoF p.50): applies with any module, including an alternative Triumph Track */
SY.autoModNote = function (c) {
  if (!c.modOpen || !(c.triumph !== "std" || SY.modules.some(function (m) { return m.id !== "mpautoma" && c.act(m.id); }))) return "";
  return "<li><b>Rise of Fenris modules:</b> Star Tracker stars go beside the board, as in the base Automa rules. Through play the Automa can earn only the two combat stars and the 16-power star, unless a module's Automa notes say otherwise (see each module's reference section).</li>";
};

/* Campaign: a Mod type / faction is "revealed" once its episode's rewards say to read its rules */
SY.revealed = function (c, id) {
  if (c.act(id)) return true;
  if (!c.camp || !c.rewards) return false;
  if (id === "mechmods") return c.epId === "2a" || c.epId === "4";
  if (id === "inframods") return c.epId === "2b" || c.epId === "4";
  if (id === "vesna") return c.epId === "3";
  if (id === "fenris") return c.epId === "5";
  return false;
};
SY.autoCampMods =
  "<ul><li>At the end of Episode 2 and every episode after, the Automa “buys” as many Mods as it can afford (it doesn't draw a choice like you do), up to 6 of each unlocked type.</li>" +
  "<li>It takes an Infrastructure Mod while those are unlocked and it has fewer than 6; otherwise a Mech Mod (none if Mech Mods aren't unlocked yet or it already has 6).</li>" +
  "<li>For each Mod: draw a random Mod tile of that type and remove it from the campaign, then write the benefit from this table on its Campaign Log (even “No effect”):</li></ul>" +
  "<table class='tbl compact'><caption>Mod Benefit Table</caption><thead><tr><th scope='col'>Mod</th><th scope='col'>Infrastructure</th><th scope='col'>Mech</th></tr></thead><tbody>" +
  "<tr><th scope='row'>1st</th><td>Star Tracker +1</td><td>Gain stuff</td></tr><tr><th scope='row'>2nd</th><td>Gain stuff</td><td>No effect</td></tr>" +
  "<tr><th scope='row'>3rd</th><td>Remove card 4</td><td>Gain stuff</td></tr><tr><th scope='row'>4th</th><td>Star Tracker +1</td><td>No effect</td></tr>" +
  "<tr><th scope='row'>5th</th><td>Gain stuff</td><td>Gain stuff</td></tr><tr><th scope='row'>6th</th><td>Remove card 15</td><td>No effect</td></tr></tbody></table>" +
  "<ul><li><b>Star Tracker +1:</b> at every setup, advance its Star Tracker token 1 space per +1 recorded. <b>Gain stuff:</b> draw an Automa card and record the items in the “Gain Stuff” section of its Scheme I (green) half, ignoring faction-specific items; it gains them at every setup for the rest of the campaign. <b>Remove card X:</b> that Automa card (number at the top right of its green half) leaves the deck for the rest of the campaign.</li>" +
  "<li>Remove the Spy Infrastructure Mods from any game against the Automa.</li></ul>";

/* =============================================================================
   RULES REFERENCE
   ============================================================================= */
SY.reference = [
  {
    title: "How to win · when the game ends",
    when: function () { return true; },
    html: function (c) {
      if (c.coop) return "<ul><li><b>Desolation is cooperative:</b> you all win together or lose together.</li><li><b>Win</b> immediately if every Triumph Tile holds at least 1 star, or you destroy all 6 Desolation units.</li><li><b>Lose</b> immediately if Desolation has 6 stars on its tile, or its popularity (the timer) reaches 0.</li></ul>";
      var end = "<li>The game ends <b>immediately</b> when a player places their <b>6th star</b>, even if they or others could still do things that turn. Nothing else happens except end-game scoring.</li>";
      if (c.res) end = "<li><b>Resolution tile:</b> ignore the usual sixth-star ending; the tile says when and how the game ends. Some tiles let you place stars on the tile (or on objective cards, etc.); those count as if on the Triumph Track. Nobody can place more than 6 stars, but with some tiles several players may reach 6.</li>";
      if (c.camp && c.ep) end = "<li><b>" + c.ep.name.split(":")[0] + ":</b> " + c.ep.ends + "</li>" + (c.boxc ? "<li><b>Box C:</b> defeating the Annihilator in combat also ends the game immediately.</li>" : "") + (c.res ? end : "");
      return "<ul><li>The winner is the richest faction: your <b>coins</b> at the end are your score (a typical winning fortune is around $75). Most of them come from end-game scoring.</li>" +
        "<li>You earn <b>stars</b> for achievements on the Triumph Track; you have only 6.</li>" + end +
        (c.act("madtesla") ? "<li><b>Mad Tesla:</b> the game also ends immediately when he is destroyed (the destroyer completes their turn first)" + (c.camp ? "" : ", unless your group chose to play on to a 6th star") + ".</li>" : "") +
        "</ul><h4>End-of-game edge cases</h4><ul>" +
        "<li>If your 6th star comes from a bottom-row action, take its main benefit, the coins and the recruit ongoing bonus before placing the star.</li>" +
        "<li>Any of your units left on a territory with an opponent's units (from a Move) go back to where they moved from.</li>" +
        "<li>A popularity or power star earned from a recruit bonus on an opponent's turn is placed after they finish that action (in clockwise order), and only if their action didn't place their own 6th star.</li>" +
        "<li>If your 6th star is placed while you still have a combat to fight this turn, the game ends and the units you moved to start that combat go back where they came from.</li></ul>";
    },
    src: function (c) { return c.coop ? "Rise of Fenris p.46–47" : SY.src("Core p.1, p.23, p.27–28, p.31", "QRG p.1", c.res ? "Wind Gambit p.6" : "", c.act("madtesla") ? "Rise of Fenris p.40–41" : "", c.camp && c.ep ? "Rise of Fenris " + c.ep.pages.match(/p\.\d+/)[0] + (c.boxc ? ", p.28" : "") : ""); }
  },
  {
    title: "Your turn",
    when: function () { return true; },
    html: function (c) {
      return "<ol><li>Put your action token on a <b>different section</b> of your player mat than last turn" +
        " (Rusviet may repeat a section, but not a Factory card; a Factory card counts as a fifth section).</li>" +
        "<li>Take that section's <b>top-row action</b> once (optional).</li><li>Then its <b>bottom-row action</b> once (optional).</li></ol>" +
        "<ul><li>Do one, both (top first) or neither, but always move the token. Resources gained on top can pay for the bottom.</li>" +
        "<li><b>Red</b> boxes are costs, <b>green</b> boxes benefits: whatever is uncovered counts. Pay the full cost first, then take as much or as little of the benefit as you like. No action twice in one turn.</li>" +
        "<li>You may reveal a completed objective before or after an action, never in the middle of one.</li>" +
        "<li><b>Announce bottom-row actions</b>, so your neighbours can take recruit bonuses. The next player may start as soon as you begin a bottom-row action.</li>" +
        "<li><b>Dead turn:</b> if you can do nothing (you last took Move and have no coins, resources, power or popularity), move your token to another section and take no actions. Be thrifty with coins early.</li>" +
        (c.opt("delay") ? "<li><b>Delay of Game:</b> stalling more than 10 seconds to calculate final scores costs 2 popularity.</li>" : "") + "</ul>";
    },
    src: function (c) { return SY.src("Core p.10, p.13–14, p.20–21, p.25–26", "QRG p.1", c.opt("delay") ? "Core p.28" : ""); }
  },
  {
    title: "Top-row actions: Move · Bolster · Trade · Produce",
    when: function () { return true; },
    html: function (c) {
      return "<p>The top row is in a different order on each player mat, but the actions are the same. An upgrade (a cube moved off a green box) adds one more of that benefit.</p>" +
        "<h4>Move</h4><ul><li>Move up to <b>2 different units</b> (character, mechs, workers) from a territory or your home base to an adjacent territory, one after the other, <i>or</i> gain <b>$1</b>. Upgraded: 3 units, or $2.</li><li>Each move icon moves one more unit one territory; extra distance only comes from abilities (Speed etc.).</li><li><b>Mine</b> (the structure under Move): once built it's a tunnel only you can use, for all your unit movement.</li></ul>" +
        "<h4>Bolster</h4><ul><li>Pay <b>$1</b>: gain <b>2 power</b> (upgraded: 3), <i>or</i> draw <b>1 combat card</b> (upgraded: 2).</li><li><b>Monument</b> built: also gain 1 popularity whenever you Bolster.</li></ul>" +
        "<h4>Trade</h4><ul><li>Pay <b>$1</b>: gain <b>any 2 resources</b> (any mix of oil, metal, food, wood) on a territory you control that has at least one of your workers, <i>or</i> gain <b>1 popularity</b> (upgraded: 2).</li><li>You can't trade for resources if all your workers are on your home base.</li><li><b>Armory</b> built: also gain 1 power whenever you Trade.</li></ul>" +
        "<h4>Produce</h4><ul><li>Pay the costs on <b>all uncovered red boxes</b> of the Produce row (they appear as workers leave your mat; the rulebook's pictured mat shows 1 power under the 2nd worker space, 1 popularity under the 4th and $1 under the 6th). You must pay it all.</li>" +
        "<li>Choose up to <b>2 different territories</b> you control (upgraded: 3); every worker on them may produce 1 token of that land. <b>Mill</b> built: its territory can be an extra territory, and the Mill itself produces like a worker (you must control that territory).</li>" +
        "<li>Mountain → <b>metal</b> · farm → <b>food</b> · tundra → <b>oil</b> · forest → <b>wood</b> · village → <b>worker</b> (take the leftmost worker from your Produce row). Lakes and the Factory produce nothing.</li>" +
        "<li>Produced tokens stay on their territory. No limit to tokens or workers on a territory. Workers never return to your mat.</li>" +
        (c.act("inframods") ? "<li><b>Automachines</b> (Infrastructure Mod): doubles production by workers and mills, only on the turn you use it.</li>" : "") + "</ul>";
    },
    src: function (c) { return SY.src("Core p.10 (mat), p.11–13, p.18", "QRG p.2", c.act("inframods") ? "Rise of Fenris p.7" : ""); }
  },
  {
    title: "Moving, territory & control",
    when: function () { return true; },
    html: function (c) {
      return "<h4>Control and resources</h4><ul><li>You control a territory if you have a unit there (character, worker or mech), or your structure with no enemy character, worker or mech. Only one player controls a territory.</li>" +
        "<li>Resources stay on the board where they were made. You may spend resources from <b>any</b> territory you control, for an action anywhere; spent tokens go to the supply. Workers are not resources.</li>" +
        "<li>A home base is <b>not a territory</b>: by default you can't move onto any home base (even your own), build or deploy there.</li></ul>" +
        "<h4>Units</h4><ul><li><b>Characters</b> fight, have encounters and (once per game) take a Factory card. <b>Mechs</b> fight and carry any number of your workers (not your character). <b>Workers</b> produce, and deploy mechs and build structures where they stand. Any unit may carry any number of resources.</li>" +
        "<li>A mech may pick up and drop off workers and resources during its move; that counts as the mech's move only. A worker it dropped off can then move on its own as another unit. With Speed, mechs may pick up and drop off mid-move.</li>" +
        "<li>Move different units, one at a time; you may use only part of a Move action. No limit to your units on a territory.</li></ul>" +
        "<h4>Terrain</h4><ul><li><b>Rivers</b> (borders between land territories) and <b>lakes</b> block movement unless an ability says otherwise. A lake counts as touching every adjacent shoreline.</li>" +
        "<li><b>Tunnels:</b> all tunnel territories are adjacent to each other for every unit's moves. Your <b>Mine</b> is a tunnel only you can use (even if an opponent controls its territory).</li>" +
        (c.board === "mod" ? "<li><b>Modular Board:</b> water on a non-lake territory that connects to an adjacent lake is part of that lake.</li>" : "") + "</ul>" +
        "<h4>Moving into an opponent's territory</h4><ul><li><b>Only their workers there:</b> your character or mech stops; each of their workers retreats to its home base, leaving its resources, and you lose 1 popularity per worker (they retreat even if you can't lose more). Another of your units may then move through. Your workers can't move alone into territories controlled by opponent workers.</li>" +
        "<li><b>Only their structure there:</b> any unit may enter, and you now control the territory.</li>" +
        "<li><b>Their character and/or mechs:</b> your character or mech stops there (they still control it for now). After all your moves, you fight. Your workers can't move alone into or out of territories controlled by opponent characters or mechs.</li>" +
        "<li><b>Encounter token:</b> your character stops and can't move again this turn.</li>" +
        "<li>Finish all your unit moves first, then resolve combats, then encounters and the Factory.</li></ul>";
    },
    src: function (c) { return SY.src("Core p.4–5, p.11, p.15, p.18, p.22, p.24–25, p.31", "Wind Gambit p.7 (errata)", "QRG p.2", c.board === "mod" ? "Modular Board p.3" : ""); }
  },
  {
    title: "Bottom-row actions: Upgrade · Deploy · Build · Enlist",
    when: function () { return true; },
    html: function (c) {
      return "<p>Same order on every player mat; costs and coin rewards vary. Take the coins first so you don't forget them (you may decline them). After you complete an action (nothing left to upgrade, etc.) you may still pay for it just for the coins and recruit bonus. Announce it.</p>" +
        "<h4>Upgrade (oil)</h4><ul><li>Pay the oil; move a technology cube from <b>any green box</b> (top row) to <b>any empty red box with a bracketed border</b> (bottom row). The top action gains a benefit; the bottom action gets cheaper. Solid-bordered red boxes can't be upgraded.</li></ul>" +
        "<h4>Deploy (metal)</h4><ul><li>Pay the metal; put any mech from your faction mat on a territory you control with at least one of your workers. Never on a lake (even with a lake ability).</li><li>From now on your character and <b>all</b> your mechs (not workers) have the ability that mech uncovered.</li></ul>" +
        "<h4>Build (wood)</h4><ul><li>Pay the wood; put any structure from your player mat on a territory you control with at least one of your workers.</li><li>Only <b>1 structure per territory</b>, ever. Not on home bases or lakes; the Factory is allowed. Structures are never destroyed or moved.</li><li>Opponents can't use your structures' abilities. You keep yours even without control of the territory, except the Mill (no producing there unless you control it). A lone structure controls its territory; an opponent's unit there takes control.</li><li>The uncovered box is an ongoing bonus to the top action above it: <b>Monument</b> (Bolster: +1 popularity), <b>Mill</b> (Produce: extra territory), <b>Mine</b> (a private tunnel, for all your unit movement), <b>Armory</b> (Trade: +1 power).</li></ul>" +
        "<h4>Enlist (food)</h4><ul><li>Pay the food; move any recruit token from your player mat to any open <b>one-time bonus</b> space on your faction mat and take it: <b>2 power</b>, <b>2 coins</b>, <b>2 popularity</b> or <b>2 combat cards</b>" + (c.act("fenris") ? " (Fenris's mat: 3 power, $3, 1 popularity or 3 combat cards)" : "") + ". It stays there.</li>" +
        "<li>The green circle it uncovered is an <b>ongoing bonus</b>: whenever you <b>or the player on your immediate left or right</b> takes that bottom-row action on a player mat, you may gain it (the rulebook's mat shows Upgrade → 1 power, Deploy → $1, Build → 1 popularity, Enlist → 1 combat card). Top-row actions and Factory cards don't trigger it.</li>" +
        "<li>Several players gaining at once: the active player first, then the player on their left, then on their right. A 6th star from this ends the game immediately.</li>" +
        (c.p === 2 ? "<li><b>2 players:</b> when your opponent's action would give you a recruit bonus, you gain it only once.</li>" : "") +
        (c.act("inframods") ? "<li><b>Machinery, Assembly Line, Construction, Recruitment Office</b> (Infrastructure Mods): take that bottom-row action without paying its cost. They are not extra actions.</li>" : "") + "</ul>";
    },
    src: function (c) { return SY.src("Core p.10 (mat), p.14–15, p.18, p.20", "QRG p.2", c.act("inframods") ? "Rise of Fenris p.7" : "", c.act("fenris") ? "Rise of Fenris p.31 (mat)" : ""); }
  },
  {
    title: "Combat",
    when: function () { return true; },
    html: function (c) {
      return (c.coop ? "<p class='inline-note'><b>Desolation (co-op):</b> you only ever fight Desolation units, and dials and combat cards are set in full view, not secretly (see Desolation).</p>" : "") +
        "<ul><li><b>When:</b> at the end of your Move action, if your character or mechs share a territory with an opponent's character or mechs. With several, the attacker chooses the order. Only the two players involved fight; others may try to bribe them with coins. You may fight with 0 power and 0 popularity.</li>" +
        "<li>Mech abilities that affect combat: the attacker uses theirs first, then the defender.</li></ul>" +
        "<h4>1 · Select power</h4><ul><li>Both players secretly set their Power Dial: <b>0–7</b>, and no more than their power on the Power Track (the track goes to 16).</li>" +
        "<li>Tuck up to <b>1 combat card per character or mech</b> you have in the fight behind the dial (even with 0 on the dial). How many cards you hold is public; whether you used any can stay hidden.</li></ul>" +
        "<h4>2 · Reveal</h4><ul><li>Total = dial + combat cards. <b>Highest wins; ties go to the attacker.</b></li><li>Both players pay the power on their dials; discard the used cards face up (cards are only a temporary boost).</li></ul>" +
        "<h4>3 · Results</h4><ul><li><b>Winner</b> gains or keeps the territory and every resource on it" +
          (c.coop ? ", and one of the players involved places a combat star if a combat Triumph Tile is available (see Desolation)"
            : c.triumph === "peace" ? ", but places no combat star: the Peace Triumph Track has none (Saxony gets a third objective card instead)"
            : c.triumph === "tiles" ? ", and places a combat star on a combat Triumph Tile they haven't starred yet, if one is in play (Saxony: no limit, even with no combat tile)"
            : ", and places a combat star unless they already have " + (c.triumph === "war" ? "4 (War track)" : "2") + " (Saxony: no limit)") + ". A winning <b>attacker</b> loses 1 popularity per enemy worker forced to retreat. If an encounter token is there and the winner's character is there, they have the encounter.</li>" +
        "<li><b>Loser</b> retreats every unit there (mechs, character, workers) to their home base, leaving resources behind. If they revealed at least 1 power (dial or cards), they draw 1 combat card.</li>" +
        "<li>You may keep fighting after your combat stars are placed.</li>" +
        "<li>Popularity is only lost for retreats you force on <b>your</b> turn: win as a defender against a mech carrying workers and you lose nothing.</li>" +
        "<li><b>Lakes:</b> factions with lake abilities can fight on a lake. If an attacked mech on a lake was carrying workers and the attacker wins, the attacker loses 1 popularity per worker (they retreat with the mech).</li></ul>" +
        "<table class='tbl compact'><caption>The combat deck (42 cards)</caption><thead><tr><th scope='col'>Power</th><th scope='col'>2</th><th scope='col'>3</th><th scope='col'>4</th><th scope='col'>5</th></tr></thead><tbody><tr><th scope='row'>Cards</th><td>16</td><td>12</td><td>8</td><td>6</td></tr></tbody></table>" +
        ((c.act("mechmods") || c.act("madtesla") || c.coop || c.boxc) ? "<p class='inline-note'>Mods and abilities marked with the no-NPC icon (affecting an opponent's power or combat cards) don't work against non-player units; abilities that only affect you still do.</p>" : "");
    },
    src: function (c) { return SY.src("Core p.22–23, p.26, p.31", "QRG p.2", c.act("mechmods") ? "Rise of Fenris p.6" : "", c.act("madtesla") ? "Rise of Fenris p.41" : "", c.coop ? "Rise of Fenris p.47" : "", c.boxc ? "Rise of Fenris p.28" : "", c.triumph === "war" ? "Rise of Fenris p.16" : "", c.triumph === "peace" ? "Rise of Fenris p.18" : "", c.triumph === "tiles" && !c.coop ? "Rise of Fenris p.37" : ""); }
  },
  {
    title: "Encounters & the Factory",
    when: function () { return true; },
    html: function (c) {
      return "<h4>Encounters</h4><ul><li>Only characters have encounters. When your character moves onto an encounter token, it stops. After all your moves and combats (before any bottom-row action), discard the token and draw an encounter card.</li>" +
        "<li>Show everyone the art and read the capitalised text aloud. Choose <b>one</b> option you can pay for (you must choose one and pay its cost), and take as much of its benefit as you like. Put the card on the bottom of the deck, face down." + (SY.factionsInPlay(c).some(function (f) { return f.id === "polania"; }) ? " (Polania may take 2 different options.)" : "") + "</li>" +
        "<li>Everything gained goes on your character's territory (so no structure if one already stands there). An encounter's gains cost nothing extra, give nothing extra and trigger no recruit bonuses.</li>" +
        "<li>If your character had to fight there, the encounter happens only if you win; otherwise the token stays.</li>" +
        (c.triumph === "peace" ? "<li><b>Peace Triumph Track:</b> a star for claiming 3 encounter tokens.</li>" : "") +
        (c.triumph === "tiles" ? "<li><b>Triumph Tile for 3 encounter tokens</b> (if it is in play): place the star after completing the encounter.</li>" : "") + "</ul>" +
        "<h4>The Factory</h4><ul><li>The Factory produces nothing and counts as <b>3 territories</b> at the end for whoever controls it.</li>" +
        "<li>When your Move action is completely over (combat won if needed) and your character is on the Factory <b>for the first time this game</b>, look at the Factory cards on the board, keep 1, and put the rest back. The first visitor sees players + 1 cards; each later visitor, one fewer. One Factory card per player, kept for good.</li>" +
        "<li>A Factory card is a <b>fifth section</b> of your player mat: top and/or bottom action as usual. It never gives recruit bonuses, structure bonuses or the coins of similar mat actions.</li>" +
        "<li>Every Factory card's bottom action is <b>Move one unit up to twice</b>. Normal movement rules still apply (stopping at encounters and opponents); your Mine works; with Speed, one mech or your character may go up to 3 territories.</li>" +
        (c.air ? "<li>An airship using a Factory card's Move gets +1 range.</li>" : "") +
        (c.camp && (c.epId === "3" || c.epId === "5" || c.epId === "7") ? "<li><b>" + c.ep.name.split(":")[0] + " changes the Factory:</b> see “This episode: special rules”.</li>" : "") + "</ul>";
    },
    src: function (c) { return SY.src("Core p.21, p.24–25, p.31", "QRG p.2", c.air ? "Wind Gambit p.5" : "", c.triumph === "peace" ? "Rise of Fenris p.18" : "", c.triumph === "tiles" ? "Rise of Fenris p.37" : ""); }
  },
  {
    title: "Objectives, deals & bribes",
    when: function () { return true; },
    html: function (c) {
      return "<ul><li>" + (c.coop ? "In Desolation (co-op) objective cards are public knowledge, but each player completes their own without sharing resources, units or territory." : "Your objective cards are secret.") + " On your own turn, before or after a top- or bottom-row action (never during one), reveal a completed objective: place a star on the objective space and discard it and your other objective to the bottom of the deck.</li>" +
        (c.triumph === "tiles"
          ? "<li><b>Triumph Tiles:</b> objective stars go on an objective tile, if one is in play. <b>Saxony</b> doesn't discard its second card and may score both, even with no objective tile.</li>"
          : "<li>Only <b>1</b> objective star each" + (c.triumph === "peace" ? " (<b>Peace track: 2 each</b>; after the first, draw a new objective instead of discarding your other card, while any remain)" : "") + ". " +
            (c.triumph === "peace" ? "<b>Saxony</b> starts with <b>3</b> objective cards on this track, and its faction ability sets no limit to its objective stars.</li>"
                                   : "<b>Saxony</b> doesn't discard its second card and may score both (up to 2 objective stars; its faction ability sets no limit).</li>")) +
        "<li>You may wait to reveal, but you must meet the whole requirement at the moment you reveal it.</li>" +
        (c.act("vesna") ? "<li>Vesna's 3 starting Factory cards don't count toward objectives.</li>" : "") +
        "<li><b>Deals:</b> informal, unenforceable agreements are fine; only coins may change hands (never in tournament play). You can't pay your way out of a combat once it has begun.</li></ul>";
    },
    src: function (c) { return SY.src("Core p.21, p.26", "Wind Gambit p.7", c.triumph === "peace" ? "Rise of Fenris p.18" : "", c.triumph === "tiles" && !c.coop ? "Rise of Fenris p.37" : "", c.coop ? "Rise of Fenris p.37, p.46" : "", c.act("vesna") ? "Rise of Fenris p.23" : ""); }
  },
  {
    title: "Triumph Track: placing stars",
    when: function () { return true; },
    html: function (c) {
      var name = ({ std: "Standard Triumph Track", war: "War Triumph Track", peace: "Peace Triumph Track", tiles: "Triumph Tiles" })[c.triumph];
      return "<p><b>" + name + "</b></p>" + SY.triumphList(c) +
        "<ul><li>When you achieve a goal you <b>must</b> place a star on it. Stars are never lost (drop below 18 popularity later and the star stays).</li>" +
        "<li>By default each player fills each goal once; other players may place on the same goal.</li>" +
        "<li>You have only 6 stars: focus on 6 goals rather than a bit of everything.</li>" +
        (c.act("rivals") ? "<li><b>Rivals:</b> stars staked on other players' home bases come back only through combat.</li>" : "") +
        (c.camp && c.epId === "1" ? "<li><b>Episode 1:</b> the revealed objective card beside the track is an extra place for a star; first stars in each category take its Influence token.</li>" : "") +
        (c.camp && c.epId === "8a" ? "<li><b>Episode 8a:</b> 3 of your stars must be fetched from the board before you can place them.</li>" : "") + "</ul>";
    },
    src: function (c) { return SY.src("Core p.27", "QRG p.1", ({ std: "", war: "Rise of Fenris p.16", peace: "Rise of Fenris p.18", tiles: c.coop ? "Rise of Fenris p.37, p.46" : "Rise of Fenris p.37" })[c.triumph]); }
  },
  {
    title: "End-game scoring",
    when: function (c) { return !c.coop; },
    html: function (c) {
      var mods = [];
      if (c.has("ifa")) mods.push("<b>Albion:</b> each Flag is +1 territory if Albion controls its territory (character, mech, worker or unoccupied structure) and it isn't adjacent to Albion's home base. <b>Togawa:</b> an armed Trap alone controls its territory; a territory holding only another player's structure and a Trap (armed or not) belongs to the structure's owner.");
      if (c.p >= 6) mods.push("<b>Polania (6–7 players):</b> +$3 for each encounter territory it controls.");
      if (c.air) mods.push("<b>Airships:</b> resources on your airship count; an airship alone never controls a territory.");
      if (c.act("alliances")) mods.push("<b>Alliances:</b> lose $10 if the token you hold shows −$10 (you broke the alliance).");
      if (c.act("fenris")) mods.push("<b>Fenris Influence:</b> −$1 per Influence token you hold." + (c.automa ? " An Automa playing Fenris loses nothing for its tokens; an Automa playing against Fenris pays as normal." : ""));
      if (c.act("madtesla")) mods.push("<b>Mad Tesla:</b> whoever destroyed him gained $10 at that moment, so it is already in their coins." + (c.camp ? " Episode 8b's end-game scoring list also says “Gain $10 if you destroyed Mad Tesla”; the book doesn't say whether that is a second $10 or the same one restated, so agree on it before you play." : ""));
      if (c.camp && c.epId === "5") mods.push("<b>Episode 5:</b> −$1 per Influence token you hold." + (c.automa ? " The Automa doesn't lose coins for them." : ""));
      if (c.camp && c.epId === "7") mods.push("<b>Episode 7:</b> each encounter territory (started with a token, including the Factory) is worth +1 territory.");
      if (c.camp && (c.epId === "8a" || c.epId === "8b")) mods.push("<b>Campaign finale:</b> your coins this game are doubled for the campaign result, plus your $25 Triumph Log bonuses.");
      if (c.act("alliances") || c.act("fenris") || (c.camp && c.epId === "2b")) mods.push("Nobody's final score can go below $0.");
      return SY.tierTable +
        "<ul><li><b>Coins in hand</b> count toward your final fortune.</li>" +
        "<li><b>Each star</b> you placed × your star rate.</li>" +
        "<li><b>Each territory</b> you control × your territory rate: lakes count, home bases don't, and the <b>Factory counts as 3</b>.</li>" +
        "<li><b>Every 2 resources</b> you control × your resource rate (13 resources at 10 popularity = 6 pairs × $2 = $12). Workers aren't resources.</li>" +
        "<li><b>Structure bonus tile:</b> coins for its goal, even for structures on territories you no longer control.</li>" +
        "<li>You control a territory and its resources if you have a unit there, or your structure with no opponent unit there.</li>" +
        (mods.length ? "<li><b>Adjustments in this game:</b><ul><li>" + mods.join("</li><li>") + "</li></ul></li>" : "") + "</ul>" +
        "<h4>Ties</h4><ol><li>Workers, mechs and structures (combined)</li><li>Power</li><li>Popularity</li><li>Resource tokens controlled</li><li>Territories controlled</li><li>Stars placed</li></ol>" +
        "<p class='inline-note'>Core p.28's example calls 18 popularity part of the “13–17” level, but the track on p.29 draws the top band as 13–18: either way 18 pays the top rates. The QRG words the first tiebreaker as “units and structures”, which adds your character; everyone has exactly one, so the result is the same as the rulebook's workers, mechs and structures.</p>" +
        "<ul><li>The winner may write their name on the achievement sheet (up to 2 times) to commemorate a first-ever win of its kind.</li></ul>";
    },
    src: function (c) {
      var r = [];
      if (c.act("alliances") || (c.camp && c.epId === "2b")) r.push("p.18–19");
      if (c.camp && c.epId === "5") r.push(c.automa ? "p.26–27" : "p.26");
      if (c.act("fenris")) r.push("p.30–31");
      if (c.camp && c.epId === "7") r.push(c.rewards ? "p.34–35" : "p.34");
      if (c.camp && c.epId === "8a") r.push("p.36");
      if (c.camp && c.epId === "8b") r.push("p.38–39");
      if (c.act("madtesla")) r.push("p.41");
      return SY.src("Core p.28–29, p.31", "QRG p.1", c.has("ifa") ? "Invaders p.3–4, p.6" : "", c.air ? "Wind Gambit p.3–4" : "", r.length ? "Rise of Fenris " + r.join(", ") : "");
    }
  },
  {
    title: "Structure bonus tiles",
    when: function () { return true; },
    html: function (c) {
      return "<p>One tile is in play. Count your structures for it at the end, whether or not you still control their territories; count each adjacent feature only once.</p>" +
        SY.tileTable(SY.bonusTilesCore, "Core tiles") +
        (c.has("mb") ? SY.tileTable(SY.bonusTilesMB, "Modular Board tiles (mixed in for every game)") : "") +
        "<p class='inline-note'>Example: with the lakes tile, two structures touching 4 different lakes earn $6.</p>";
    },
    src: function (c) { return SY.src("Core p.18–19", c.has("mb") ? "Modular Board p.3" : ""); }
  },
  {
    title: "Factions & mech abilities",
    when: function () { return true; },
    html: function (c) {
      return "<p>Each faction has a <b>faction ability</b> (top right of its mat) and four <b>mech abilities</b>, each unlocked for your character and all your mechs when you deploy the mech covering it. Speed lets a unit move one extra territory, but it still stops on entering a territory with an opponent's unit; a tunnel-to-tunnel hop counts as 1 move.</p>" +
        SY.factionsInPlay(c).map(function (f) {
          var ab = f.ability, mechs = f.mechs.slice();
          if (c.p >= 6 && f.id === "polania") ab = "<b>6–7 players:</b> “Pick up to 2 options per encounter card. At end of game, gain $3 for each encounter territory you control.” (replaces Meander)";
          if (c.p >= 6 && f.id === "crimea" && c.board !== "mod") mechs[1] = "<b>6–7 players:</b> “Move to any unoccupied farm.” (replaces Wayfare)";
          if (c.camp && c.epId === "3" && f.id === "rusviet") mechs[1] = "<b>Township (revised tile, required this episode)</b>: use the revised Township tile from the punchboard instead of the printed ability (or cover it with a Mech Mod, if unlocked); its text is on the tile";
          if (c.camp && c.epId === "5" && f.id === "rusviet") mechs[1] = "<b>Township (revised tile, required this episode)</b>: move from any village you control to either another village you control or any unoccupied village";
          return "<h4>" + f.name + " <span class='who'>(" + (f.who ? f.who + " · " : "") + "starts " + f.power + " power, " + f.cards + " combat card" + (f.cards === 1 ? "" : "s") + ")</span></h4>" +
            "<ul><li>" + ab + "</li>" + mechs.map(function (m) { return "<li>" + m + "</li>"; }).join("") + "</ul>";
        }).join("") +
        "<p class='inline-note'>Riverwalk lets you cross any river onto the two named terrains. Lake abilities (Seaworthy, Submerge, Suiton) don't need Riverwalk. Units can't leave workers or resources on a lake after moving off it, and nobody builds or deploys on a lake.</p>";
    },
    src: function (c) { return SY.src("Core p.11, p.15–17, p.21, p.30", c.has("ifa") ? "Invaders p.3–7" : "", c.act("vesna") ? "Rise of Fenris p.22–23" : "", c.act("fenris") ? "Rise of Fenris p.30–31" : "", c.camp && c.epId === "3" ? "Rise of Fenris p.20" : "", c.camp && c.epId === "5" ? "Rise of Fenris p.26" : ""); }
  },
  {
    title: "Invaders from Afar: Flags & Traps",
    when: function (c) { return c.has("ifa"); },
    html: function (c) {
      return "<h4>Placing (Albion's Flags, Togawa's Traps)</h4><ul><li>After your character ends its movement you may place a token on its territory. If it entered a combat or an encounter there, wait until that is resolved (after all your units have moved).</li><li>Only <b>1 faction token</b> per territory (one Flag or one Trap). They are never moved or removed.</li></ul>" +
        "<h4>Albion's Flags (4)</h4><ul><li>A Flag doesn't give control. At the end, each Flag is <b>+1 territory</b> for Albion if Albion controls its territory (character, mech, worker or unoccupied structure) <b>and</b> it isn't adjacent to Albion's home base. (A Forest plus a Tundra with a Flag = 3 territories.)</li></ul>" +
        "<h4>Togawa's Traps (4, armed/disarmed)</h4><ul><li>An <b>armed</b> Trap alone gives Togawa control of its territory for scoring; an enemy unit can never stand on an armed Trap.</li>" +
        "<li>An opponent's unit moving onto an armed Trap stops; flip the Trap and they suffer its penalty if possible, before anything else (combat, encounter). The Trap stays, disarmed.</li>" +
        "<li><b>Penalties:</b> lose 2 popularity · lose 3 power · lose $4 · discard 2 combat cards at random. Tell everyone before the game.</li>" +
        "<li>Opponents may build on a Trap's territory. At the end, if only that structure and the Trap (armed or not) are there, the structure's owner controls it.</li>" +
        (c.air ? "<li>Airships don't trigger Traps.</li>" : "") + "</ul>" +
        "<h4>General</h4><ul><li>The new player mats (2a, 3a) are used at every player count; first player order is 1, 2, 2a, 3, 3a, 4, 5.</li><li>New players should take an original faction.</li>" +
        (c.coop ? "<li><b>Desolation (co-op):</b> nobody is an opponent, so all players ignore tokens that target opponents, such as Togawa's Traps; Albion and Togawa can still use their Flags and Traps for movement.</li>" : "") + "</ul>";
    },
    src: function (c) { return SY.src("Invaders p.1, p.3–4, p.6", c.air ? "Wind Gambit p.5" : "", c.coop ? "Rise of Fenris p.46" : ""); }
  },
  {
    title: "6–7 players",
    when: function (c) { return c.p >= 6; },
    html: function (c) {
      return "<ul><li>The map doesn't change; it's just more crowded.</li>" +
        "<li><b>Crimea:</b> " + (c.board === "mod" ? "keeps Wayfare on the Modular Board (any inactive home base qualifies)." : "Wayfare is replaced by “Move to any unoccupied farm.”") + "</li>" +
        "<li><b>Polania:</b> Meander is replaced by “Pick up to 2 options per encounter card. At end of game, gain $3 for each encounter territory you control.”</li>" +
        "<li>Expect about 25 minutes per player. You may begin your turn once the player to your right starts a bottom-row action.</li></ul>";
    },
    src: function (c) { return SY.src("Invaders p.3", c.board === "mod" ? "Modular Board p.2" : ""); }
  },
  {
    title: "Airships (The Wind Gambit)",
    when: function (c) { return c.air; },
    html: function (c) {
      return "<ul><li>A new kind of unit: moved by a Move action as one of your units, up to its <b>range</b> (the number in the hex at the upper right of the passive tile). Finish one unit's move before moving another.</li>" +
        "<li>Ignores rivers and lakes; may fly onto and off any territory, even an opponent's; any number of airships may share a territory. Never onto a home base, never through tunnels or Mines.</li>" +
        "<li><b>Never controls territory:</b> you can't spend resources on its territory unless you control it another way, and an airship alone at the end controls nothing.</li>" +
        "<li>Not a mech or character: no mech abilities, no extra combat cards, doesn't trigger Traps. A Factory card Move gives it +1 range.</li>" +
        "<li>“Occupied” on tiles means at least 1 worker, character or mech is there.</li></ul>" +
        "<h4>Carrying (" + (c.opt("airadv") ? "set by each player's own aggressive tile, for their airship all game" : "set by the aggressive tile, for every airship all game") + ")</h4><ul><li>Either <b>up to 3 resources</b> or <b>up to 2 workers</b>, loaded before, during or after its move, as part of the Move action. Never pick up resources from territories opponents control.</li>" +
        "<li><b>Resources</b> on your airship stay under your control until spent or dropped off (at any time during its move), and count at the end.</li>" +
        "<li><b>Workers</b> aboard don't control its territory, can't produce or trade there, and can't be interacted with. Drop them only on territories no opponent occupies, and during the airship's own move before the worker can move or ride a mech (same turn is fine); they can't step off straight to another territory. A worker picked up can't bring resources aboard.</li>" +
        (c.has("ifa") ? "<li><b>Albion's Rally</b> works only toward a Flag or an Albion worker on the ground, not one aboard an airship.</li>" : "") +
        (c.act("fenris") ? "<li><b>Influence:</b> airships and the workers they carry never claim Influence, but dropping a worker onto an Influence territory claims it at once.</li>" : "") +
        "</ul><h4>Blitzkrieg (an aggressive tile)</h4><ul><li>Allows combat between 2 airships; the winner gains a star as usual. It's the only time an airship retreats; other units there don't fight or retreat.</li></ul>" +
        (c.opt("airadv") ? "<p><b>Advanced variant on:</b> each player has their own aggressive and passive tile.</p>" : "") +
        "<p class='inline-note'>The rulebook pictures only a few airship tiles; read the two revealed tiles for this game's abilities.</p>";
    },
    src: function (c) { return SY.src("Wind Gambit p.3–5", c.act("fenris") ? "Rise of Fenris p.30" : ""); }
  },
  {
    title: "Resolution tiles (The Wind Gambit)",
    when: function (c) { return c.res; },
    html: function (c) {
      return "<ul><li>The revealed tile replaces the standard end-game trigger for everyone: it decides when and how the game ends.</li>" +
        "<li>Some tiles let players place stars on the tile or on objective cards: these count at the end as if on the Triumph Track. Nobody may place more than 6 stars, but with some tiles several players can reach 6.</li>" +
        "<li>Paying for a completed bottom-row action just for its coins (and recruit bonus) is especially useful with this module. Still no action more than once per turn.</li>" +
        (c.camp ? "<li><b>Campaign:</b> only the Doomsday Clock or Backup Plan tiles, from Episode 4 on.</li>" : "") + "</ul>" +
        "<p class='inline-note'>The rulebook shows one tile as an example; read your tile's own text.</p>";
    },
    src: function (c) { return SY.src("Wind Gambit p.6", c.camp ? "Rise of Fenris p.24" : ""); }
  },
  {
    title: "Modular Board",
    when: function (c) { return c.has("mb"); },
    html: function (c) {
      return "<ul><li>The 8 new structure bonus tiles are shuffled in for every game of Scythe, not only on the modular board.</li>" +
        (c.board === "mod" ? "<li>Board: random side; the 4 hex tiles placed at random (flip one that puts a lake next to a home base); home base tiles placed at random on every home-base hex.</li>" +
          "<li>Faction draft: player mats first, then factions chosen from the highest-numbered mat down (5, 4, 3a, 3, 2a, 2, 1). Watch Riverwalk access to wood and metal. Industrial can't choose Rusviet; Patriotic can't choose Crimea. Lowest-numbered mat still goes first.</li>" +
          "<li>Crimea keeps its original Wayfare even at 6–7 players; any inactive home base is a valid target.</li>" +
          "<li>Water on a non-lake territory that touches an adjacent lake is part of that lake.</li>" +
          "<li><b>Player-count variant</b> (after faction selection): leave some modular tiles off. Roughly 2–3 players: 2–3 tiles; 4 players: 1; 5–7 players: none.</li>" +
          (c.automa ? "<li><b>Automa:</b> the random layout may not hold the Automa back behind water as the normal board does; choose starting home bases carefully.</li>" : "") +
          (c.mode === "campaign" ? "<li>Not recommended during campaign play: some layouts may conflict with episodes.</li>" : "") : "<li>You're using the standard board this game; switch the board option to see the modular setup.</li>") + "</ul>";
    },
    src: "Modular Board p.2–3"
  },
  /* ---------------- Rise of Fenris modules ---------------- */
  {
    title: "Mech Mods",
    when: function (c) { return SY.revealed(c, "mechmods"); },
    html: function (c) {
      return "<ul><li>41 tokens of variable mech abilities that <b>replace</b> abilities printed on your faction mat. You may hold only 1 of each Mod.</li>" +
        (c.camp ? "<li><b>Campaign:</b> at the end of each episode, after adding that game's coins to your Wealth, each player draws 2 Mech Mods (the episode's rewards may change the number), redrawing duplicates (within the draw, Mods you own, or abilities on your current faction mat); everyone decides at once and may buy any for $50 each. Unbought Mods go back to the supply. Limit 6 Mech Mods, 1 of each. During setup you may cover abilities on your faction mat with any of yours (or none); no rearranging once the episode starts.</li>"
                : "<li><b>Modules:</b> draw 4 at random (redraw duplicates), place up to 2 on your faction mat, discard the rest.</li>") +
        "<li>Mods marked with the no-NPC icon can't be used against non-player units.</li>" +
        "<li><b>Armor:</b> the attacker decides which card to discard. <b>Feint:</b> after adjusting your dial you must be able to pay the new total; you don't pay the original amount. <b>Stealth:</b> used with another ability (Speed, a Factory card, etc.) to move through a territory where you would start combat, force workers out or trigger a token penalty, you ignore everything there. <b>Tactics:</b> once per combat.</li>" +
        (c.act("vesna") ? "<li>Some of Vesna's mech ability tokens are clarified here too.</li>" : "") + "</ul>" +
        (c.automa ? "<h4>Automa</h4>" + (c.camp ? SY.autoCampMods : SY.autoNotes.mods) : "");
    },
    src: function (c) { return SY.src(c.camp ? (c.automa ? "Rise of Fenris p.6–7" : "Rise of Fenris p.6") : "Rise of Fenris p.51, p.6", c.automa && !c.camp ? "p.7, p.50" : ""); }
  },
  {
    title: "Infrastructure Mods",
    when: function (c) { return SY.revealed(c, "inframods"); },
    html: function (c) {
      return "<ul><li>32 tokens of once-per-game abilities that boost your economy. You may hold only 1 of each.</li>" +
        (c.camp ? "<li><b>Campaign:</b> at the end of each episode, after adding that game's coins to your Wealth, each player draws 2 Infrastructure Mods (the episode's rewards may change the number), redrawing duplicates; everyone decides at once and may buy any for $50 each. Unbought Mods go back to the supply. Limit 6, 1 of each. Place yours face up near your play area at setup; they are yours for later episodes too.</li>"
                : "<li><b>Modules:</b> draw 4 at random (redraw duplicates), keep up to 2 face up by your player mat, discard the rest.</li>") +
        "<li>Each is used <b>once per game</b> (flip it), only at its printed trigger.</li>" +
        "<li><b>Machinery, Assembly Line, Construction, Recruitment Office:</b> take that bottom-row action without paying its cost (not an extra action). <b>Automachines:</b> doubles production by workers and mills that turn. <b>Spy, Propaganda, Cavalry</b> are triggered by other actions; declare Spy at the very beginning of combat.</li></ul>" +
        (c.automa ? "<h4>Automa</h4>" + ((c.camp ? SY.revealed(c, "mechmods") : c.act("mechmods")) ? "<ul><li>Remove the Spy Infrastructure Mods from any game against the Automa. How the Automa buys Mods is under Mech Mods.</li></ul>" : (c.camp ? SY.autoCampMods : SY.autoNotes.mods)) : "");
    },
    src: function (c) { return SY.src(c.camp ? "Rise of Fenris p.7" : "Rise of Fenris p.51, p.7", c.automa ? "p.6" + (c.camp ? "" : ", p.50") : ""); }
  },
  {
    title: "War Triumph Track",
    when: function (c) { return c.triumph === "war"; },
    html: function (c) {
      return SY.triumphList(c) + "<ul><li>The game ends immediately at a 6th star on the War Triumph Track.</li>" + (c.camp ? "" : "<li>Use it to encourage combat between players; Rivals is designed to go with it.</li>") + "</ul>" + (c.automa ? "<h4>Automa</h4>" + SY.autoNotes.war + (c.camp ? SY.autoNotes.warCamp : "") : "");
    },
    src: function (c) { return SY.src("Rise of Fenris p.16", c.camp ? "" : "p.51", c.automa ? (c.camp ? "p.17" : "p.17, p.50") : ""); }
  },
  {
    title: "Peace Triumph Track",
    when: function (c) { return c.triumph === "peace"; },
    html: function (c) {
      return SY.triumphList(c) + "<ul><li>Remove objective card #23; Saxony starts with 3 objective cards instead of 2 (compensating for the missing combat stars).</li><li>The game ends immediately at a 6th star on the Peace Triumph Track.</li>" + (c.camp ? "" : "<li>Use it to discourage combat between players. It can't be combined with Rivals.</li>") + "</ul>" + (c.automa ? "<h4>Automa</h4>" + SY.autoNotes.peace + (!c.camp && !c.act("alliances") ? SY.autoNotes.peaceNoAlliances : "") : "");
    },
    src: function (c) { return SY.src("Rise of Fenris p.18", c.camp ? "" : "p.51", c.automa ? (c.camp ? "p.19" : "p.19, p.50") : ""); }
  },
  {
    title: "Triumph Tiles",
    when: function (c) { return c.triumph === "tiles"; },
    html: function (c) {
      return SY.triumphList(c) + "<ul><li>Triumph Tiles create a fully random version of the Triumph Track.</li>" +
        (c.coop ? "<li><b>Tile notes for Desolation:</b> for the 5-star tile, place your 6th star on it immediately after your 5th. The 7-territory tile can't be achieved mid-Move, and the Factory counts as 1 territory for it. The structure bonus tile needs all 4 of your structures built so they would maximize the structure bonus tile's reward. You achieve objectives and the 16-resources tile under normal competitive rules (no sharing).</li>" : "") + "</ul>" +
        (c.automa ? "<h4>Automa</h4>" + (c.camp ? "<ul><li>Episode 8a's Skip Triumphs (earned through play; Star Tracker stars skip them): <b>three</b> combat spaces, 16 power, 3 encounter tokens and the Factory card, if those tiles are included. (The modular rules list four combat stars; in the campaign the episode's list applies.)</li></ul>" : SY.autoNotes.tiles) : "");
    },
    src: function (c) { return SY.src(c.camp ? "Rise of Fenris p.36–37" : "Rise of Fenris p.37", c.coop ? "p.46" : "", c.camp ? "" : "p.51", c.automa && !c.camp ? "p.50" : ""); }
  },
  {
    title: "Rivals",
    when: function (c) { return c.act("rivals"); },
    html: function (c) {
      return "<ul><li><b>Setup:</b> after all other setup, everyone at once may place up to <b>" + (c.triumph === "war" ? 4 : 2) + "</b> of their stars on other players' home bases (several on one base allowed)." + (c.triumph === "war" ? "" : " (Up to 2 because the War Triumph Track isn't in play.)") + "</li>" +
        "<li>A player is your <b>rival</b> while one of your stars sits on their home base.</li>" +
        "<li>Win a combat against a rival: remove 1 of your stars from their base, place it on the Triumph Track, and gain <b>$5</b>.</li>" +
        "<li>Whenever you win a combat you may instead take 1 of your stars from <b>any</b> opponent's base and place it, but the $5 comes only if it's from the base of the player you beat.</li>" +
        "<li>Stars on opponents' bases can only be retrieved through combat.</li>" +
        (c.camp ? "" : "<li>Can't be combined with the Peace Triumph Track.</li>") + "</ul>" + (c.automa ? "<h4>Automa</h4>" + SY.autoNotes.rivals : "");
    },
    src: function (c) { return SY.src("Rise of Fenris p.16", c.camp ? "" : "p.51", c.automa ? "p.17" : ""); }
  },
  {
    title: "Alliances",
    when: function (c) { return c.act("alliances"); },
    html: function (c) {
      return "<ul><li><b>Setup:</b> each player takes their own faction's Alliance token (faction ability and a coin amount on the front, −$10 on the back).</li>" +
        "<li>At any time on your turn, while you hold <b>your own</b> token, you may propose an alliance to a player who holds theirs. If they agree, swap tokens: each of you gains the coins shown on the token you receive, and you now also have their faction ability (as printed on the token).</li>" +
        "<li>In games with an odd number of players, the moment you become the “odd man out”, gain <b>$5</b>.</li>" +
        "<li>Attack the player who holds your Alliance token, or force their workers off a territory, and you must flip the token <b>you</b> hold: you lose that ability (they keep yours face up).</li>" +
        "<li>End of game: if the token you hold shows −$10 (you broke the alliance), lose $10. Your score can't go below $0.</li>" +
        (c.coop ? "<li><b>Desolation (co-op):</b> Alliances are one of its “easier” options. Players can't fight or have any conflict with each other, so an alliance can't be broken; there is no end-game coin count either.</li>" : "") + "</ul>" +
        (c.automa ? "<h4>Automa</h4>" + SY.autoNotes.alliances : "");
    },
    src: function (c) { return SY.src("Rise of Fenris p.18–19", c.coop ? "p.46–47" : "", c.camp ? "" : "p.51"); }
  },
  {
    title: "Vesna",
    when: function (c) { return SY.revealed(c, "vesna"); },
    html: function (c) {
      var f = SY.factions.filter(function (x) { return x.id === "vesna"; })[0];
      return "<ul><li>" + f.ability + "</li>" + f.mechs.map(function (m) { return "<li>" + m + "</li>"; }).join("") +
        "<li>Mech abilities are chosen each game: 6 random tokens of her 18" + (c.act("mechmods") ? " (plus your Mech Mods)" : "") + ", keep 2–4.</li>" +
        (SY.revealed(c, "mechmods") ? "<li>Some of her mech ability tokens are clarified with the Mech Mods (see Mech Mods).</li>"
          : "<li>Some of her mech ability tokens are clarified in the Mech Mod rules: <b>Armor</b>: the attacker decides which card to discard. <b>Feint</b>: after adjusting your dial you must be able to pay the new total; you don't pay the original amount. <b>Stealth</b>: used with another ability (Speed, a Factory card, etc.) to move through a territory where you would start combat, force workers out or trigger a token penalty, you ignore everything there. <b>Tactics</b>: once per combat.</li>") +
        "<li>Starts with 1 power and 1 combat card. Her airship is used only with The Wind Gambit.</li>" +
        "<li>An advanced faction that rewards flexible play; her abilities change from game to game.</li></ul>" +
        (c.automa ? "<h4>Automa playing Vesna</h4>" + SY.autoNotes.vesna : "");
    },
    src: function (c) { return SY.src("Rise of Fenris p.22–23", SY.revealed(c, "mechmods") ? "" : "p.6"); }
  },
  {
    title: "Fenris & Influence tokens",
    when: function (c) { return SY.revealed(c, "fenris"); },
    html: function (c) {
      var f = SY.factions.filter(function (x) { return x.id === "fenris"; })[0];
      return "<ul><li>" + f.ability + " A territory holding only a structure or an airship is not “occupied”. Influence can't go on a territory with a Trap, Flag, encounter or Influence token. Primary terrain = mountains, farms, tundras, forests, villages (not lakes, the Factory or home bases).</li>" +
        f.mechs.map(function (m) { return "<li>" + m + "</li>"; }).join("") + "</ul>" +
        "<h4>Influence tokens</h4><ul><li>When a non-Fenris unit (character, mech or worker) moves into a territory with an Influence token, it stops and its owner takes the token onto their faction mat.</li>" +
        "<li>A Mill producing a worker on an Influence territory claims it at once." + (c.air ? " Airships and the workers they carry don't claim Influence, but dropping a worker onto one claims it immediately." : "") + "</li>" +
        "<li>Fenris units never collect Influence from the board (except with Fanatical) and don't stop for it. With Fanatical you gain the token only when you move to it using Fanatical, not with normal moves or Leap.</li>" +
        "<li>Each Influence token is <b>−$1</b> at the end for whoever holds it; Fenris effectively starts at −$16. Nobody ends below $0.</li>" +
        "<li>Fenris starts with 4 power and 2 combat cards. Its mat's one-time recruit bonuses differ from the usual 2 of each: <b>3 power, $3, 1 popularity, 3 combat cards</b> (mat pictured on p.31).</li>" +
        "<li>A powerful faction with handicaps; movement matters, and it suits an aggressive player.</li>" +
        (c.coop ? "<li><b>Desolation (co-op):</b> nobody is an opponent, so all players ignore Influence tokens; Fenris can still use them for movement.</li>" : "") + "</ul>" +
        (c.automa ? "<h4>Automa</h4>" + SY.autoNotes.fenris : "");
    },
    src: "Rise of Fenris p.30–31"
  },
  {
    title: "Tesla",
    when: function (c) { return c.act("tesla"); },
    html: function (c) {
      return "<ul>" + (c.camp ? "<li>Tesla starts on the home base of the player who found him in Episode 7.</li>" :
          "<li>The first player to have <b>3 encounters</b> completes the third encounter, then takes control of Tesla and places him on that encounter territory. Or, at setup, give him to a faction you consider weaker; he starts on its home base.</li>") +
        "<li>Tesla is both a <b>character and a mech</b> for all standard and special abilities, but he doesn't count toward the mech Triumph.</li>" +
        "<li>He can have encounters, claim a Factory card, carry workers and use all your faction and mech abilities.</li>" +
        (c.camp ? "" : "<li>In a regular game, finding Tesla doesn't end the game.</li>") + "</ul>" +
        (c.automa ? "<h4>Automa</h4>" + (c.camp ? "<ul><li>Controlled by the Automa, Tesla is a mech but not a character.</li></ul>" : SY.autoNotes.tesla) : "");
    },
    src: function (c) { return c.camp ? "Rise of Fenris p.36–37" : SY.src("Rise of Fenris p.37, p.51", "p.34", c.automa ? "p.50" : ""); }
  },
  {
    title: "Mad Tesla",
    when: function (c) { return c.act("madtesla"); },
    html: function (c) {
      return "<h4>Ongoing</h4><ul><li>After <b>any</b> combat, the attacker discards their combat cards first, then the defender, so the defender's cards end up on top of the discard pile (this matters for Tesla's power).</li>" +
        "<li>Mad Tesla controls territories and forces workers home like any combat unit. Anyone may attack him, and he may attack anyone.</li></ul>" +
        "<h4>His turn (always last)</h4><ul><li>Roll the <b>blue die</b>, put it on the Mad Tesla tile and move him in that direction. If that first move doesn't start a combat, roll and move once more. Never a third time.</li>" +
        "<li>Moving off the map sends him back to the Factory (which may start a combat). He ignores rivers, may enter lakes, never uses tunnels, and ignores all tokens (encounters, Traps, Influence…). He is a combat unit for all movement and unit interactions.</li></ul>" +
        "<h4>Fighting Mad Tesla</h4><ol><li>If you enter 2 combats on your turn and one is against Mad Tesla on the Factory, fight that one first.</li><li><b>Gain 1 popularity.</b></li><li>Set your dial and combat cards as usual. His base power is the <b>top 2 cards of the combat discard pile</b>. Mods and abilities that affect an opponent's power or cards (no-NPC icon) don't work on him.</li><li>Roll the <b>orange die</b> onto the Combat slot of his tile and add it to his base power.</li><li>Highest total wins; ties go to the attacker.</li></ol>" +
        "<ul><li><b>You lose:</b> retreat as usual, and Mad Tesla also retreats to the Factory (possibly starting another combat).</li>" +
        "<li><b>You win:</b> he retreats to the Factory (if you beat him <b>on</b> the Factory, he goes to an unoccupied adjacent territory of your choice; if none, roll and move him by the tile and he starts a combat). Then gain 1 more popularity, place a combat star if you can, and lower his health by the difference in totals (1 on a tie).</li>" +
        "<li><b>Health 0:</b> he is destroyed and removed. You gain <b>$10</b>, complete your turn, and the game ends immediately" + (c.camp ? " (Episode 8b's end-game scoring lists $10 for this again: see the episode's special rules)" : " (unless your group chose to play on to a 6th star)") + ".</li></ul>" +
        "<p class='inline-note'>Example: you total 11; he has a 3 on the die plus a 2 and a 3 on the discard pile = 8. You win: +1 popularity, a combat star (if possible), and his health drops from 16 to 13.</p>" +
        (c.automa ? "<h4>Automa</h4>" + SY.autoNotes.madtesla : "");
    },
    src: function (c) { return SY.src("Rise of Fenris p.40–41", c.camp ? "" : "p.51"); }
  },
  {
    title: "Desolation (cooperative)",
    when: function (c) { return c.coop; },
    html: function (c) {
      return "<h4>Cooperation</h4><ul><li>You operate only your own faction (move and carry your own units, build your structures, retreat to your own base…), but for <b>control</b> all players count as one faction:</li>" +
        "<li>You may spend resources any player controls (with their consent); your mechs may carry other players' resources. Several players may share a territory and all control its resources. No combat or conflict between players. Still 1 structure per territory.</li>" +
        "<li>Your Mill produces even with another player's units there; anyone may move through any Mine. Several players may defend together to play more combat cards.</li>" +
        "<li>Tokens that target “opponents” (Traps, Influence…) are ignored by everyone; their factions can still use them for movement.</li>" +
        "<li>Objectives and the 16-resources tile use normal competitive rules (no sharing). Objectives and combat cards are public.</li></ul>" +
        "<h4>Desolation's turn (last each round)</h4><ol><li><b>Popularity</b> drops by 1 (a timer). At 13–17 its turn ends; at 1–12 it moves; at 0 Desolation wins.</li><li><b>Movement:</b> roll the blue die; the number is a direction on the Desolation tile; move <b>all</b> Desolation units that way. A unit can't enter a territory with another Desolation unit (move them in the order that lets most move). They cross rivers and enter lakes, but never use tunnels or tokens. Workers alone on a territory they enter retreat home (no popularity loss for Desolation). Resources on a Desolation unit's territory travel with it." + (c.act("deshard") ? " <b>Harder:</b> each worker displaced (movement or combat) also costs Desolation 1 popularity." : "") + "</li></ol>" +
        "<h4>Combat against Desolation</h4><ol><li>Anyone may attack a Desolation unit, and it attacks players it moves into (players choose the order of several). Set dials and cards <b>openly</b>. Defending together, each player uses their own mech abilities and cards for their units, but only one of you spends power (your own) on the dial. Its base power is the sum of the combat cards beside the Desolation tile (1 at the start). Mods and abilities affecting an opponent's power or cards (no-NPC icon) don't work on it.</li><li>Roll the orange die onto the tile's Combat slot and add it.</li><li>Highest total wins; ties go to the attacker.</li></ol>" +
        "<ul><li><b>You lose:</b> a normal loss for you, and Desolation places a star on its tile (its 6th = you all lose).</li><li><b>You win:</b> destroy that unit (remove it from the game), draw a combat card beside the Desolation tile and raise its power on the track (max 16). One of the players involved places a combat star, if a combat Triumph Tile is available (only 1 star per combat).</li></ul>" +
        "<h4>Variants</h4><ul><li><b>Easier:</b> use Mech Mods, Infrastructure Mods and/or Alliances.</li><li><b>Harder:</b> worker displacement speeds the timer (see above).</li><li><b>Wind Gambit airships</b> are allowed but not recommended for your first few plays.</li><li>The Automa doesn't support Desolation.</li></ul>";
    },
    src: "Rise of Fenris p.46–47, p.50–51"
  },
  {
    title: "Multiplayer Automa (semi-official)",
    when: function (c) { return c.act("mpautoma"); },
    html: function (c) {
      return "<p class='warn'>The Automa's core rules are in the separate Automa rulebook, which this page does not cover.</p><ul><li><b>Modes:</b> cooperative (humans vs Automas: compare average coins as if a 2-player game; “enemy” = any human) or competitive (normal winner; “enemy” = any other player).</li>" +
        "<li>“Automa units” in its rules means only the units of the Automa taking its turn.</li>" +
        "<li>Turns go around as in a multiplayer game; each Automa is a separate player. With one shared Automa deck, each still draws its own cards.</li>" +
        "<li>Your recruit ongoing bonuses are triggered only by card draws of the Automas sitting next to you.</li>" +
        "<li>Each Automa has its own Star Tracker token, moved only by its own card draws; each places its own stars and switches to Scheme II on its own.</li>" +
        "<li><b>Automa vs Automa combat:</b> each draws its own Automa card for power and combat cards; no resources are placed as a result.</li>" +
        "<li><b>Conquering an Automa's territory:</b> place resources equal to those on the last Automa card that Automa used not for combat (with one shared deck: the last card any Automa used not for combat).</li>" +
        "<li><b>Tiebreaker:</b> instead of English reading order, pick the territory closest to the Automa recruit token (starting on Albion's home base); if still tied, move the token <b>two home bases</b> clockwise and repeat; after each use, move it two home bases clockwise. (The book's example: the 2nd use goes by Rusviet's base, the 3rd by Crimea's.)</li></ul>";
    },
    src: "Rise of Fenris p.48–49"
  },
  /* ---------------- Campaign ---------------- */
  {
    title: "The Rise of Fenris campaign: how it works",
    when: function (c) { return c.camp; },
    html: function () {
      return "<ul><li>8 games (episodes), fully replayable and resettable (not a legacy game). The winner of the <b>final episode</b> wins the campaign; small bonuses from your Triumph Log may be added.</li>" +
        "<li>Keep your faction until the book says otherwise; draw new player mats each episode. Use the same players throughout if you can.</li>" +
        "<li>End-game triggers are as in regular Scythe unless an episode's Special Rules say otherwise. The 2 custom dice are used when the rules say so.</li>" +
        "<li>Each episode has an opening story (with a short summary) and outcome and reward sections: <b>don't read the outcome and rewards until the episode ends.</b></li>" +
        "<li><b>Wealth:</b> add your end-game coins after each episode; it's spent on Mods and Perks, and you start each game with only your player mat's coins plus Setup Bonuses. Cross out and rewrite your total when you spend.</li>" +
        "<li><b>Rewards</b> persist from game to game: note them on your Campaign Log and bag new tokens.</li>" +
        "<li>Fully compatible with Invaders from Afar; some episodes allow The Wind Gambit's airships and resolution tiles.</li></ul>";
    },
    src: "Rise of Fenris p.2–4"
  },
  {
    title: "This episode: special rules",
    when: function (c) { return c.camp && !!c.ep; },
    html: function (c) {
      var e = c.ep;
      return "<p><b>" + e.name + "</b> · " + e.date + "</p><p><b>Goals:</b> " + e.goals + "</p><p>" + e.ends + "</p>" + e.special +
        (c.automa ? "<h4>Automa</h4><p><b>Skip Triumphs</b> (earned through play; Star Tracker stars skip them): " + e.skip + ".</p>" + (e.automa || "") : "");
    },
    src: function (c) { return SY.src(c.ep.specialSrc, c.automa ? c.ep.automaSrc.replace("Rise of Fenris ", "") : ""); }
  },
  {
    title: "Box C: the Annihilator",
    when: function (c) { return c.camp && c.epId === "5" && c.boxc; },
    html: function (c) {
      return "<p>An autonomous mech that guards the Factory and never moves. The game can now end at a 6th star <b>or</b> by defeating the Annihilator in combat. These rules apply only to Episode 5.</p>" +
        "<h4>Original reveal</h4><ol><li>Place the Annihilator on the Factory. The discoverer rolls the two dice and picks one as its combat power, placing that die on the matching Power Track space.</li><li>Anyone holding objective <b>5, 7 or 22</b> discards it and draws a replacement.</li><li>A worker that moved onto the Factory alone returns to its base.</li><li>If a character or mech revealed it, you must fight it: finish your Move action (other units may still move, even onto the Factory to join the fight), then fight.</li></ol>" +
        "<h4>Combat</h4><ol><li>After you have chosen and revealed your power and any combat cards, draw the top 4 combat cards and add them to the Annihilator's power (the die). Discard them.</li><li>Decide the winner as usual; ties go to the attacker.</li><li>Defeat it: remove it, place a combat star (usual limit), and the game ends immediately.</li></ol>" +
        "<ul><li>Mods and abilities that affect an opponent's power or combat cards (no-NPC icon) don't apply; there is no way to reduce its power or cards.</li></ul>" +
        "<h4>Its turn</h4><ul><li>Whoever discovered it is its controller for this game (though it is an enemy to everyone). Its turn comes just before the controller's (so everyone else plays first).</li><li>On its turn the controller rolls two dice and picks 1 as its power until its next turn, then its turn ends (it never moves).</li></ul>" +
        (c.automa ? "<h4>Automa</h4><ul><li>If the Automa is first to fight it, the Automa loses, along with 4 power and 1 random combat card (instead of drawing an Automa card and combat cards for it). The outcome is otherwise handled as any combat.</li><li>An Automa controller always picks the lower die. In all Automa moves the Annihilator counts as an enemy combat unit.</li><li><b>Popularity:</b> when Box C opens, if its Star Tracker token is on row 1–3, move the Automa's popularity to 2; once the token reaches row 4, to 10.</li></ul>" : "");
    },
    src: function (c) { return c.automa ? "Rise of Fenris p.28, p.29 (Automa box)" : "Rise of Fenris p.28"; }
  },
  {
    title: "This episode: rewards & outcome",
    when: function (c) { return c.camp && !!c.ep && c.rewards; },
    html: function (c) {
      return c.ep.rewards + (c.automa && c.ep.automaRewards ? "<h4>Automa</h4>" + c.ep.automaRewards : "");
    },
    src: function (c) { return c.ep.rewardsSrc; }
  },
  {
    title: "Campaign finale: the winner and your leadership",
    when: function (c) { return c.camp && (c.epId === "8a" || c.epId === "8b") && c.rewards; },
    html: function () {
      return "<ul><li>Each player: <b>Episode 8 score × 2 + $25 Triumph Log bonuses</b> (each completed row or column). The highest total wins the campaign; a tie shares the victory.</li>" +
        "<li><b>Leadership style:</b> rank players in three categories: <b>Economy</b> (the total above), <b>Governance</b> (Infrastructure Mods owned + Triumph Log stars for upgrades, structures, workers, objectives and popularity) and <b>Military</b> (Mech Mods owned + stars for deploy, enlist, combat and power).</li>" +
        "<li>Highest = <b>A</b>, second = <b>B</b>, third or lower = <b>C</b>. Read your A description first, then B, then C (Rise of Fenris p.44).</li></ul>";
    },
    src: "Rise of Fenris p.42–44"
  },
  {
    title: "Solo & the Automa: what this page covers",
    when: function (c) { return c.automa; },
    html: function (c) {
      return "<p class='warn'>The Automa's core rules (its deck, turn, Star Tracker and difficulty) are in the separate <b>Automa rulebook</b>, which is not among this page's sources and is <b>not covered here</b>.</p>" +
        "<ul><li>Scythe is for 1–5 players" + (c.has("ifa") ? " (1–7 with Invaders from Afar)" : "") + "; solo means playing against the Automa. The Wind Gambit's component list includes an Automa rulebook (likewise not covered).</li>" +
        "<li>Covered here: your own setup and rules, and the Automa adjustments printed in the expansion books: the Modular Board's note, The Rise of Fenris's campaign and module rules, and its semi-official multiplayer Automa variant.</li>" +
        (c.p === 1 && c.has("rof") && !c.camp ? (c.modOpen ? "<li>No Automa? The Rise of Fenris's <b>Desolation</b> module can be played by 1 player (5 Triumph Tiles) without an Automa.</li>" : "<li>No Automa? The Rise of Fenris also includes a fully cooperative module, which isn't part of the campaign; open the modules gate to see it.</li>") : "") + "</ul>";
    },
    // Module pages (p.46, p.50) are cited only once the module gate is open: they name campaign content.
    src: function (c) { return SY.src("Core p.1", c.has("ifa") ? "Invaders p.1" : "", "Wind Gambit p.2", c.board === "mod" ? "Modular Board p.3" : "", !c.has("rof") ? "" : c.modOpen ? "Rise of Fenris p.3, p.50" + (c.p === 1 ? ", p.46" : "") : (c.p === 1 && !c.camp ? "Rise of Fenris p.2–3" : "Rise of Fenris p.3")); }
  },
  {
    title: "Errata, rulings & recommended variants",
    when: function () { return true; },
    html: function (c) {
      return "<p>The Wind Gambit (p.7) recaps Scythe's errata and variants. The 2022 core rulebook used here has already absorbed the errata, and made the Rusviet recommendations official.</p><ul>" +
        "<li><b>Forcing workers to retreat:</b> a character or mech entering a territory held only by opponent workers stops; the workers retreat at once, so another of your units may then move through. (Core p.11 now reads this way.)</li>" +
        "<li><b>Objective timing:</b> reveal before or after a top- or bottom-row action, never in the middle of one (Core p.26).</li>" +
        "<li><b>Rusviet:</b> The Wind Gambit offered as a variant that Relentless can't repeat a Factory card and that Rusviet never pairs with Industrial. The 2022 rulebook makes both rules official, and also bans Crimea with Patriotic (Core p.6, p.21).</li>" +
        "<li><b>Player mat order variant:</b> starting resources are staggered by turn order and playtest data, with a very small effect; you may deal the mats clockwise by number (Wind Gambit p.7).</li>" +
        "<li><b>Delay of Game variant:</b> stalling the game for more than 10 seconds to calculate scores costs 2 popularity (Core p.28).</li>" +
        (c.has("ifa") ? "<li><b>6–7 players:</b> Invaders from Afar swaps Crimea's Wayfare and Polania's Meander; the later Modular Board rules keep Wayfare when playing on the modular board.</li>" : "") +
        "<li><b>Scoring table wording:</b> 18 popularity scores the top rates (the track shows 13–18, although the example text on p.28 says 13–17).</li>" +
        "<li><b>Tiebreaker wording:</b> the QRG says “units and structures”; the 2022 rulebook says workers, mechs and structures. Everyone has one character, so both give the same result.</li></ul>";
    },
    src: function (c) { return SY.src("Wind Gambit p.7", "Core p.6, p.11, p.21, p.26, p.28–29", "QRG p.1", c.has("ifa") ? "Invaders p.3 · Modular Board p.2" : ""); }
  },
  {
    title: "Frequently overlooked rules (fan checklist)",
    when: function () { return true; },
    html: function (c) {
      var ok = function (t, p) { return "<li>" + t + " <span class='cite'>" + p + "</span></li>"; };
      var flag = function (t, p) { return "<li class='flagged'><span class='flag'>Not in the rulebooks</span> " + t + " <span class='cite'>" + p + "</span></li>"; };
      var infer = function (t, p) { return "<li class='flagged'><span class='flag'>Inferred</span> " + t + " <span class='cite'>" + p + "</span></li>"; };
      var s = "<p class='inline-note'>“Frequently Overlooked Rules v4.0” looks <b>unofficial</b>: it has no Stonemaier branding or copyright line, was made in Apple Pages (2018), and cites rulebook pages and an online “Scythe FAQ”. Each reminder below points to the rulebook pages that support it. <b>Inferred</b> marks a point the sheet adds that follows from the rules without being stated; <b>Not in the rulebooks</b> marks one they don't support. The rulebooks always win.</p>" +
        "<h4>Turns & setup</h4><ul>" +
        ok("Your 2 starting workers go on the 2 territories next to your home base.", "Core p.7") +
        ok("You may take one action, both (top first) or neither, but must still move your action token.", "Core p.10") +
        ok("Benefits are always optional (including parts of an encounter option); a finished bottom-row action can still be paid for its coins, and you may refuse the coins.", "Core p.10, p.14, p.24") +
        ok("Objectives: reveal before or after an action, never in the middle.", "Core p.26 · Wind Gambit p.7") +
        ok("Rusviet: never with Industrial; Relentless doesn't repeat a Factory card.", "Core p.6, p.21") +
        ok("Polania's Camaraderie only applies after combat; pushing workers out without combat still costs popularity.", "Core p.11, p.17") +
        infer("Crimea's Wayfare may carry resources onto a home base, where they can't be spent and don't score (the sheet cites the online FAQ; it fits home bases not being territories).", "Overlooked Rules p.1 (fan) · cf. Core p.4, p.29") +
        "</ul><h4>Movement</h4><ul>" +
        ok("Riverwalk crosses any river onto its two terrain types; lake abilities work regardless of Riverwalk.", "Core p.11, p.15–17") +
        ok("All units, workers included, may use tunnels and your Mine" + (c.air ? "; airships may not" : "") + ".", "Core p.11, p.18" + (c.air ? " · Wind Gambit p.5" : "")) +
        ok("Each Move icon moves one more unit, not one unit further; a Factory card's Move takes one unit two spaces (plus abilities).", "Core p.11, p.25") +
        ok("A mech carrying workers counts as one unit moved; a dropped worker may then move as another unit.", "Core p.11") +
        ok("Finish all your moves before combat, encounters or the Factory card, except that pushed-out workers leave at once so another unit can pass.", "Core p.11, p.22 · Wind Gambit p.7") +
        ok("A unit's movement ends when your character triggers an encounter or stops on the Factory to take a Factory card, or when a combat unit enters a territory with enemy units.", "Core p.5, p.11, p.24–25") +
        "</ul><h4>Placement, production & recruits</h4><ul>" +
        ok("Deploy and build only where you have a worker (the sheet adds: also with a Factory card's top action); never on lakes. Encounter rewards are the exception and land on the encounter territory.", "Core p.15, p.18, p.24") +
        ok("The Mill adds a production territory and produces like a worker.", "Core p.18") +
        ok("Structure bonus tiles count each lake, tunnel or encounter only once.", "Core p.19") +
        ok("Recruits: any token to any open one-time space; ongoing bonuses for you and your immediate neighbours; Factory-card and encounter gains don't trigger them. Announce bottom-row actions.", "Core p.20, p.24–25") +
        ok("A 6th star from a bottom-row action comes after its benefit, coins and recruit bonus.", "Core p.28") +
        "</ul><h4>Combat</h4><ul>" +
        ok("Your hand size is public; which cards you used can stay hidden. One card per combat unit unless an ability says otherwise.", "Core p.22") +
        ok("The attacker orders multiple combats, uses combat abilities first and wins ties; only a winning attacker loses popularity for pushed workers; a loser who revealed any power draws a card.", "Core p.22–23") +
        flag("If an ability's power gain gives you a 6th star at the start of a combat, the combat is still finished before the game ends, so two players might have 6 stars (the sheet cites the online FAQ). The 2022 rulebook says the game ends the moment a 6th star is placed, even if other things would happen afterwards: follow the rulebook.", "Overlooked Rules p.2 (fan) · cf. Core p.23, p.28") +
        "</ul>" +
        (c.has("ifa") ? "<h4>Albion & Togawa</h4><ul>" +
          ok("Place a Flag or Trap after your character's move; if combat or an encounter is due there, only after it's resolved. One faction token per territory; never moved.", "Invaders p.4, p.6") +
          ok("Flags don't give control; an armed Trap does. A structure + Trap territory belongs to the structure's owner at the end. Flag scoring conditions; Trap penalties.", "Invaders p.4, p.6") +
          infer("An Albion Flag on the Factory, if Albion controls it at the end, makes it worth 4 territories (3 for the Factory + 1 for the Flag).", "Overlooked Rules p.1 (fan) · cf. Invaders p.4, Core p.25") + "</ul>" : "") +
        (c.has("wg") ? "<h4>Airships</h4><ul>" +
          ok("Each game airships carry resources or workers, never both; they don't control or occupy territory, use mech abilities, tunnels or Mines, add combat cards or trigger Traps; they fly anywhere, any number per territory.", "Wind Gambit p.3–5") +
          ok("Pick up and drop off only as part of the airship's move; never take resources from opponents' territories; worker drop-off limits; Albion's Rally ignores workers aboard.", "Wind Gambit p.3–4") +
          flag("The sheet says airships may drop off resources anywhere except an <i>empty</i> lake. The official QRG says resources are never dropped off on lakes (and a character or mech with a lake ability can't leave resources on a lake after moving off it), so don't drop them on any lake.", "Overlooked Rules p.3 (fan) · cf. QRG p.2, Core p.16") +
          flag("An airship tile called “Safe Haven” that lets an airship occupy and control a territory. The Wind Gambit rulebook doesn't show or describe that tile (airships never control territory by its rules), so check the tile itself.", "Overlooked Rules p.3 (fan) · cf. Wind Gambit p.3") + "</ul>" : "");
      return s;
    },
    src: "Overlooked Rules p.1–3 (fan) · pages cited per line"
  },
  {
    title: "Sources & page numbers",
    when: function () { return true; },
    html: function (c) {
      return "<ul><li><b>Core</b>: Scythe rulebook, 2022 printing (r24). Printed page numbers.</li>" +
        "<li><b>QRG</b>: Scythe Quick Reference Guide (2 pages, unnumbered: PDF pages).</li>" +
        "<li><b>Invaders</b>: Invaders from Afar rulebook. <b>Wind Gambit</b>: The Wind Gambit rulebook. <b>Rise of Fenris</b>: The Rise of Fenris rulebook. Printed page numbers.</li>" +
        "<li><b>Modular Board</b>: Modular Board rules; the English rules are its 2nd and 3rd PDF pages (no printed numbers).</li>" +
        "<li><b>Overlooked Rules (fan)</b>: an unofficial community reminder sheet (3 unnumbered pages). Used only to point back to the rulebooks; never overrides them.</li>" +
        "<li>Not covered: the Automa rulebook(s), the online FAQ, and the text on individual cards and tiles (encounter, Factory, objective, airship, resolution" + (c.modOpen || (c.camp && c.epi >= 7) ? ", Mod and Triumph Tile" : " and Mod") + ").</li></ul>";
    },
    src: "Core · QRG · Invaders · Wind Gambit · Modular Board · Rise of Fenris · Overlooked Rules (fan)"
  }
];

/* =============================================================================
   TEACHING SCRIPT — about five minutes aloud, in teaching order:
   hook & how to win → shape of a turn → actions & why → central mechanic →
   inserts for the selected sets/modules/modes → "don't worry about these yet".
   Written from the rulebooks cited in the setup and reference sections.
   ============================================================================= */
SY.teach = {
  intro: "About five minutes, read aloud, for exactly the sets, modules and mode selected above. Hit Copy to paste it anywhere.",
  sections: [
    {
      h: "The hook — and how you win",
      body: function (c) {
        if (c.coop) return "<p>It's the 1920s in an alternate Eastern Europa, and tonight we're on the same side. A faction called <b>Desolation</b> has six units around the Factory in the middle of the map, and it's on a clock. Each of us still runs our own faction, but we all win the moment there's at least one star on every one of the <b>Triumph Tiles</b> on the table, or all six Desolation units are destroyed. We all lose if Desolation wins six fights, or its timer runs out.</p>";
        var s = "<p>It's the 1920s in an alternate Eastern Europa. The war is over, the Factory in the middle of the map is shut, and each of you leads a faction: a hero with an animal companion, some workers, and four mechs waiting on your faction mat. It looks like a war game, but it's a race for money: the most <b>coins</b> at the end wins.</p>";
        var stars = "Stars are achievements" + (c.triumph === "std"
              ? ": all upgrades, all mechs, all structures, all recruits, all eight workers out, an objective, winning a fight (twice), 18 popularity, 16 power."
              : "; tonight's list is a variant, which I'll come to.") + " You have only six, so pick your six.";
        s += c.res
          ? "<p>Normally the game ends the instant someone places a sixth star on the Triumph Track. Tonight a <b>resolution tile</b> replaces that ending; we'll read it before we start. " + stars + "</p>"
          : "<p>The game ends the instant someone places their <b>sixth star</b> on the Triumph Track. " + stars + "</p>";
        s += "<p>Then we cash in: coins in hand, plus coins for each star, each territory you control and each pair of resources you control. The rate depends on your <b>popularity</b>, so whoever ends the game doesn't always win it.</p>";
        if (c.solo) s += "<p>Tonight it's you against the <b>Automa</b>, an automated opponent. Its turns come from its own deck and its own rulebook, the Automa rulebook, which this page doesn't cover, so keep that book to hand.</p>";
        return s;
      }
    },
    {
      h: "The shape of a turn",
      body: function (c) {
        return "<p>No rounds: we just take turns clockwise. Your player mat has four sections. On your turn, move your action token to a <b>different section</b> from last turn and take its top action, its bottom action, both (top first), or neither. Red boxes are the cost, green boxes the reward: pay it all, then take as much reward as you like.</p>" +
          "<p>Say your bottom action out loud (you'll see why). Once you start it, the next player can begin.</p>" +
          (c.has("ifa") ? "<p>First player is the lowest-numbered player mat; with the Invaders from Afar mats the order is 1, 2, 2a, 3, 3a, 4, 5.</p>" : "<p>The lowest-numbered player mat goes first.</p>");
      }
    },
    {
      h: "The actions — and why you'd take them",
      body: function () {
        return "<p>The <b>top row</b> is everyday stuff:</p><ul>" +
          "<li><b>Move</b> two different units one territory each, or take $1: grab land, reach encounters and the Factory, start fights.</li>" +
          "<li><b>Produce</b> on up to two territories you control: each worker there makes one of that land's resource; a village makes a worker.</li>" +
          "<li><b>Trade</b>: $1 for any two resources, or 1 popularity.</li>" +
          "<li><b>Bolster</b>: $1 for 2 power, or a combat card.</li></ul>" +
          "<p>The <b>bottom row</b> is investment, each paid in one resource:</p><ul>" +
          "<li><b>Upgrade</b> (oil): slide a cube from a top box to a bottom cost box: top actions get stronger, bottom actions cheaper.</li>" +
          "<li><b>Deploy</b> (metal): a mech where you have a worker; each one gives your character and all your mechs a new ability.</li>" +
          "<li><b>Build</b> (wood): a structure where you have a worker; it boosts the top action above it.</li>" +
          "<li><b>Enlist</b> (food): a one-time bonus now, plus an ongoing bonus whenever you <i>or either neighbour</i> takes that bottom action. That's why we announce them.</li></ul>" +
          "<p>Most bottom actions also pay coins, even after you've finished them.</p>";
      }
    },
    {
      h: "The central mechanic: engine, land and popularity",
      body: function (c) {
        return "<p>Every player mat pairs top and bottom actions differently: the combo you can fire in one turn is your engine, and upgrades improve it. Resources stay on the map where they're made, and you can only spend what's on land you control, so your units guard your economy.</p>" +
          (c.coop ? "<p>Tonight nobody counts coins at the end; coins only pay for things. What matters is getting stars onto every Triumph Tile, or wiping out Desolation.</p>"
                  : "<p>At the end, popularity sets your pay rate: at 0–6 a star pays $3, a territory $2, a pair of resources $1; at 7–12, $4, $3, $2; at 13–18, $5, $4, $3. The Factory counts as three territories. Keep your people happy.</p>");
      }
    },
    {
      h: function (c) { return c.coop ? "Combat — against Desolation only" : "Combat — mostly a threat"; },
      body: function (c) {
        if (c.coop) return "<p>We never fight each other. Fights are against Desolation's units, and they work like normal Scythe combat: dial 0 to 7 power (no more than you have) and add one combat card per character or mech of yours in the fight, higher total wins, ties go to the attacker, and you pay the power you dialled. The difference is that it's all done openly, and Desolation adds a die roll to its cards.</p>";
        return "<p>End a move with your character or mech where an opponent's character or mech is, and you fight. Workers alone just get sent home, but each costs you a popularity. In a fight, both players secretly dial 0 to 7 power (no more than you have) and may add one combat card per character or mech involved. Reveal: higher total wins, ties go to the attacker, and both pay the power they dialled.</p>" +
          "<p>The winner takes the territory and its resources" + (c.triumph === "peace" ? " (tonight's Peace track gives no combat stars)" : " and places a combat star" + (c.triumph === "war" ? " (up to four each on the War track)" : c.triumph === "tiles" ? " (one per combat tile on the track, though Saxony has no limit)" : " (twice a game at most, though Saxony has no limit)")) + "; the loser goes home and, if they committed anything, draws a combat card. Usually the threat of a fight matters more than the fight.</p>";
      }
    },
    { when: function (c) { return c.p === 2; }, h: "Just the two of us",
      body: function () { return "<p>With two of us, when your opponent's bottom action would trigger one of your recruit bonuses, you gain it only once.</p>"; } },
    { when: function (c) { return c.has("ifa"); }, h: "Invaders from Afar",
      body: function (c) {
        if (c.coop) return "<p>Two more factions may turn up: <b>Clan Albion</b> with its Flags and the <b>Togawa Shogunate</b> with its Traps. Tonight nobody is anyone's opponent, so the rest of us ignore the Traps; both factions still use their tokens for their own movement abilities." + (c.p >= 6 ? "" : " The expansion's two extra player mats, 2a and 3a, are shuffled in with the others and slot into the turn order.") + "</p>";
        return "<p>Two more factions may turn up. <b>Clan Albion</b> plants Flags: each one is worth an extra territory at the end if Albion holds that land and it isn't next to Albion's home base. The <b>Togawa Shogunate</b> sets Traps: walk a unit onto an armed Trap and you stop and take its penalty, and an armed Trap counts as Togawa's land." + (c.p >= 6 ? "" : " The expansion's two extra player mats, 2a and 3a, are shuffled in with the others and slot into the turn order.") + "</p>";
      } },
    { when: function (c) { return c.p >= 6; }, h: "Six or seven players",
      body: function (c) { return "<p>With six or seven of us the map just gets more crowded. Polania's Meander is swapped for a token that also pays $3 per encounter territory at the end, and " + (c.board === "mod" ? "Crimea keeps its Wayfare on the modular board." : "Crimea's Wayfare becomes “move to any unoccupied farm”.") + " Budget about 25 minutes per player.</p>"; } },
    { when: function (c) { return c.air; }, h: "Airships",
      body: function (c) { return "<p>Each of us also has an <b>airship</b>. It moves as one of your units with a Move action, up to its range, and ignores rivers and lakes, but it never controls territory. " + (c.opt("airadv") ? "Tonight each of us has our own pair of airship tiles, so read each other's." : "The two tiles we revealed give every airship the same two abilities.") + (c.opt("airadv") ? " Your red tile also says whether your airship carries up to 3 resources or up to 2 workers." : " The red tile also says whether airships carry up to 3 resources or up to 2 workers this game.") + "</p>"; } },
    { when: function (c) { return c.res; }, h: "The resolution tile",
      body: function () { return "<p>Remember, the <b>resolution tile</b> replaces the usual sixth-star ending. If it lets us place stars on it (or on objective cards), those count like Triumph Track stars; nobody places more than six, but several of us might reach six.</p>"; } },
    { when: function (c) { return c.has("wg") && !c.air && !c.res; }, h: "The Wind Gambit",
      body: function () { return "<p>The Wind Gambit is on the table, but tonight we're using neither of its modules (airships or resolution tiles), so the game plays as normal.</p>"; } },
    { when: function (c) { return c.has("mb"); }, h: function (c) { return c.board === "mod" ? "The modular board" : "Extra structure bonus tiles"; },
      body: function (c) {
        if (c.board !== "mod") return "<p>We own the Modular Board, so its 8 extra <b>structure bonus tiles</b> were shuffled into the pile; check what tonight's tile rewards.</p>";
        return "<p>The map is random tonight: a <b>modular board</b> with shuffled hex tiles and home bases. We dealt player mats first and picked factions from the highest-numbered mat down; Riverwalk matters more than usual, so check you can reach wood as well as metal. Its 8 extra structure bonus tiles are in the mix too." + (c.opt("mbvar") ? " With fewer players we left some modular tiles off, so parts of the board are empty." : "") + "</p>";
      } },
    { when: function (c) { return c.triumph !== "std" && !c.coop; }, h: "Tonight's Triumph Track",
      body: function (c) {
        if (c.triumph === "war") return "<p>We're on the <b>War Triumph Track</b>: one star for six upgrades or four structures (not both), up to four combat stars each, and a star for holding eight combat cards at the end of your turn. No stars for workers or for popularity.</p>";
        if (c.triumph === "peace") return "<p>We're on the <b>Peace Triumph Track</b>: no stars for combat or power. Instead there are stars for four mechs or four recruits (not both), two objectives each, three encounter tokens, 13 popularity, gaining a Factory card and controlling 16 resources. Saxony gets a third objective card to make up for it.</p>";
        return "<p>The Triumph Track is covered by ten random <b>Triumph Tiles</b>: those are tonight's ten achievements, so let's read them now.</p>";
      } },
    { when: function (c) { return c.act("mechmods"); }, h: "Mech Mods",
      body: function (c) { return "<p><b>Mech Mods</b> replace some of the mech abilities printed on our faction mats" + (c.camp ? ": everyone's bought Mods are on their mats." : ": each of us drew four and placed up to two.") + " Check your neighbours' mats before you pick a fight.</p>"; } },
    { when: function (c) { return c.act("inframods"); }, h: "Infrastructure Mods",
      body: function () { return "<p>Your face-up <b>Infrastructure Mods</b> each work once per game, at the moment printed on them; flip one when you use it. Several let you take a bottom action without paying its cost.</p>"; } },
    { when: function (c) { return c.act("rivals"); }, h: "Rivals",
      body: function (c) { return "<p>We're playing <b>Rivals</b>. At the end of setup you may park up to " + (c.triumph === "war" ? "four" : "two") + " of your stars on other players' home bases. The only way to get them back is to win a fight: then you move one onto the Triumph Track, and if it came off the base of the player you just beat, you also gain $5.</p>"; } },
    { when: function (c) { return c.act("alliances"); }, h: "Alliances",
      body: function (c) { return "<p>We're playing with <b>Alliance</b> tokens" + (c.coop ? " to make Desolation easier" : "") + ". On your turn, while you still hold your own token, you can offer an alliance to a player who holds theirs. Swap tokens: each of you gains the coins printed on the token you receive, and you can also use each other's faction ability. " + (c.coop ? "We can't attack each other tonight, so no alliance gets broken." : "Attack your ally, or push their workers off a territory, and you flip their token: you lose the ability and $10 at the end.") + " With an odd number of players, the moment you become the odd man out, you gain $5.</p>"; } },
    { when: function (c) { return c.act("vesna"); }, h: "Vesna",
      body: function (c) { return "<p><b>Vesna</b> may be at the table. She starts with three Factory cards of her own, each used once and then boxed, and picks her mech abilities fresh each game from random tokens, so read her mat " + (c.coop ? "to see what she can do tonight" : "before you plan against her") + ".</p>"; } },
    { when: function (c) { return c.act("fenris"); }, h: "Fenris",
      body: function (c) {
        if (c.coop) return "<p><b>Fenris</b> may be on our side tonight. Its Influence tokens don't affect the rest of us in this co-op game, but Fenris can still use them for its own movement abilities.</p>";
        return "<p><b>Fenris</b> spreads Influence tokens across the map. If one of your units moves onto one, it stops and you take the token, and every token you hold costs $1 at the end. Fenris starts at effectively minus $16 and wants to hand them all to you.</p>";
      } },
    { when: function (c) { return c.act("tesla"); }, h: "Tesla",
      body: function (c) { return c.camp ? "<p>Tesla starts with the player who found him last episode. He counts as both a character and a mech, can have encounters and uses all your abilities, but doesn't count toward the four-mech star.</p>" : "<p>Watch for <b>Tesla</b>: the first of us to have three encounters takes control of him, right there on that encounter's territory. He counts as a character and a mech, can have encounters and uses all your abilities.</p>"; } },
    { when: function (c) { return c.act("madtesla"); }, h: "Mad Tesla",
      body: function (c) { return "<p><b>Mad Tesla</b> starts on the Factory and moves after the last player each round: a die roll picks his direction, and he moves again if his first move doesn't start a fight. Fighting him gains you popularity. His strength is the top two cards of the combat discard pile plus a die, which is why the defender always discards last. Every win knocks his health, which starts at 16, down by your margin, and whoever destroys him gains $10" + (c.camp ? " and ends the game. This episode's end-game scoring also lists “gain $10 if you destroyed Mad Tesla” without saying whether that's a second $10, so let's agree on that now." : ", which by the rules ends the game.") + "</p>"; } },
    { when: function (c) { return c.coop; }, h: "Desolation: how we work together",
      body: function (c) { return "<p>We're one faction as far as control goes: we can share territories, spend each other's resources with permission, and defend together to play more combat cards, but each of us moves only our own units. <b>Desolation</b> moves last each round. Its popularity is a countdown: from 12 down, a die sends all its units the same direction, pushing workers home and fighting whoever they reach. Fights against it are open, it adds a die to its combat cards, and each unit we beat is destroyed but makes the others stronger." + (c.act("deshard") ? " We're playing it harder: every worker Desolation displaces speeds its clock." : "") + "</p>"; } },
    { when: function (c) { return c.act("mpautoma"); }, h: "Automas at the table",
      body: function () { return "<p>Some seats tonight are <b>Automas</b>, run by the Automa rulebook, which this page doesn't cover. They take turns like players; decide now whether we're all against them together or everyone for themselves.</p>"; } },
    { when: function (c) { return c.mode === "campaign" && !c.ep; }, h: "The campaign",
      body: function () { return "<p>This is The Rise of Fenris <b>campaign</b>: eight linked games. Your coins become Wealth for Mods and Perks between episodes, stars fill your Triumph Log, and the winner of the final episode wins it all. No peeking in the tuckboxes, and no reading an episode's rewards until it's over.</p>"; } },
    { when: function (c) { return c.camp && !!c.ep; }, h: function (c) { return "Tonight: " + c.ep.name; },
      body: function (c) {
        var g = c.ep.goals.replace(/ · /g, ", ");
        return "<p>This is The Rise of Fenris <b>campaign</b>. " + c.ep.teach + " Its goals: " + g + (/[.!?]$/.test(g) ? "" : ".") + "</p>" +
          (c.ep.idx === 7
            ? "<p>This is the last game: leftover Wealth is crossed off during setup, and at the end your $25 Triumph Log bonuses are added to your doubled coins. We read the campaign finale once the game is over.</p>"
            : "<p>Your end-game coins go onto your Campaign Log as Wealth, to spend on Mods and Perks between episodes; stars you place get ticked on your Triumph Log. We don't read this episode's rewards until it's over.</p>");
      } },
    { when: function (c) { return c.opt("firstgame") || c.opt("delay") || c.opt("matorder"); }, h: "Tonight's variants",
      body: function (c) {
        var a = [];
        if (c.opt("firstgame")) a.push("Grab a <b>quick-start card</b>: it suggests something to do on each of your first five turns. After the first star is placed we'll pause for a practice scoring round that doesn't count.");
        if (c.opt("delay")) a.push("<b>Delay of Game:</b> anyone who stalls more than ten seconds totting up scores loses 2 popularity.");
        if (c.opt("matorder")) a.push(c.board === "mod"
          ? "Dealing the player mats clockwise <b>by number</b> doesn't fit the modular board: mats were dealt at random and we're seated by the factions we chose."
          : "We dealt the player mats clockwise <b>by number</b> instead of at random.");
        return "<p>" + a.join(" ") + "</p>";
      } },
    {
      h: "Don't worry about these until they come up",
      body: function (c) {
        var items = [
          "<li><b>Encounters</b>: stop your character on a compass token, draw a card, pick one option.</li>",
          "<li><b>The Factory</b>: your character's first visit gets you a Factory card, a fifth mat section.</li>",
          "<li><b>Objectives</b>: reveal one when it's done, before or after an action, for a star.</li>",
          "<li><b>Rivers, lakes and tunnels</b>: rivers block, lakes are off limits, tunnels link; mech abilities bend this.</li>",
          "<li><b>The structure bonus tile</b> and your <b>faction ability</b> (top right of your faction mat).</li>",
          "<li><b>End-game edge cases</b> and dead turns: we'll look them up.</li>"
        ];
        if (c.has("ifa") && !c.coop) items.push("<li><b>Trap penalties</b>: lose 2 popularity, 3 power, $4, or 2 random combat cards.</li>");
        if (c.air) items.push("<li><b>Airship fine print</b>: where workers can be dropped off and what an airship can't do.</li>");
        if (c.act("inframods") || c.act("mechmods")) items.push("<li><b>Individual Mods</b>: read them when they're used.</li>");
        if (c.camp && c.ep) items.push("<li><b>Campaign bookkeeping</b>: Wealth, Mods and Setup Bonuses get sorted after the game.</li>");
        return "<ul>" + items.join("") + "</ul>";
      }
    }
  ]
};
