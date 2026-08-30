/* =============================================================================
   Nemesis — Setup & Reference Utility · game data
   Sources: Nemesis base rulebook (28p), Aftermath rulebook, Carnomorphs
   rulebook, Void Seeders rulebook, Official FAQ v2.2 (16.04.2025).
   ============================================================================= */
var NM = {};

NM.expansions = [
  { id: "base",      short: "Nemesis",      year: "Base game",  blurb: "The core semi-cooperative survival horror game for 1-5 players." },
  { id: "aftermath", short: "Aftermath",     year: "Expansion",  blurb: "5 new Characters, Trait cards, new Rooms, Turrets, the Shuttle, and the Epilogue & Research Mission modes." },
  { id: "carno",     short: "Carnomorphs",   year: "Alt. race",  blurb: "Replaces the Intruders with the evolving, ever-feeding Carnomorphs." },
  { id: "void",      short: "Void Seeders",  year: "Alt. race",  blurb: "Replaces the Intruders with hallucinatory Void Seeders and the Insanity system." }
];

NM.expMeta = {
  base:      { name: "Base",         cls: "e-base" },
  aftermath: { name: "Aftermath",    cls: "e-aft" },
  carno:     { name: "Carnomorphs",  cls: "e-carno" },
  void:      { name: "Void Seeders", cls: "e-void" },
  faq:       { name: "FAQ",          cls: "e-faq" },
  mode:      { name: "Mode",         cls: "e-mode" }
};

NM.modes = [
  { id: "standard", name: "Standard",        blurb: "Semi-cooperative. Hidden objectives — trust no one. 2-5 players." },
  { id: "solo",     name: "Solo",            blurb: "1 player. Two Solo/Coop Objectives, halved Item counters." },
  { id: "coop",     name: "Co-op",           blurb: "Fully cooperative. Public objectives — all must be completed. AutoDoc revives." },
  { id: "research", name: "Research Mission", requires: "aftermath", blurb: "Standalone game using all Aftermath components, the Shuttle and Alerts." },
  { id: "epilogue", name: "Epilogue",        requires: "aftermath", blurb: "A 5-turn escape played on the board of a just-finished regular game." }
];

NM.races = [
  { id: "intruders", name: "Intruders",    blurb: "The classic hive: Larvae, Creepers, Adults, Breeders and the Queen." },
  { id: "carno",     name: "Carnomorphs",  requires: "carno", blurb: "Metagorgers, Shamblers, Fleshbeasts and the Butcher. They feed and evolve." },
  { id: "void",      name: "Void Seeders", requires: "void",  blurb: "Lurkers, Whisperers, Stalkers and the Despoiler. Madness is the real enemy." }
];

NM.modules = [
  {
    id: "intruderplayer", requires: "base", modes: ["standard"], minP: 2,
    name: "Play as an Intruder",
    summary: "The first player whose Character dies takes control of the Intruders.",
    description: "Optional mode: the first eliminated player controls the Intruders (if two die simultaneously, the lower player number). They remove their old Character's components and take the Intruder Player Action deck; changes apply from the start of the next Player Phase. Each round they draw 3 cards (hand limit 4), never take the First Player token, and on their turn play 1 card to Move an Intruder, Attack (draw Attack cards equal to the card's number, pick 1), or use the card's Effect — or pass (keeping up to 1 card). The Event Phase is skipped for them except the Time Track and Fire Damage; there is no bag development and Intruders no longer Attack in the Intruder Attack step. The Intruder player cannot win — their goal is that nobody else does.",
    src: "Base p.27"
  },
  {
    id: "altboard", requires: "base", modes: ["standard", "solo", "coop"],
    name: "Alternative board side",
    summary: "A harder ship layout with two separate sets of Technical Corridors.",
    description: "Flip the board to the side without the red arrow. The Red and Blue Technical Corridors are not connected to each other (Noise markers in one are separate from the other), and some Rooms are connected by a pair of separate Corridors — Closed Doors in one do not affect the other. During setup, place Evacuation sections A and B face up on their highlighted spots and put a face-down Exploration token on each (explore them normally on first entry).",
    src: "Base p.27"
  },
  {
    id: "traits", requires: "aftermath", modes: ["standard", "solo", "coop"],
    name: "Trait cards",
    summary: "A permanent advantage-and-disadvantage card for every Character.",
    description: "Aftermath adds a Trait card for each of the 11 Characters (5 Aftermath + 6 base game). During crew setup, each player places their Character's Trait card face up next to their Character board; its rule is in effect for the whole game. Epilogue and Research Mission games always use Traits.",
    src: "Aftermath p.3"
  },
  {
    id: "aftrooms", requires: "aftermath", modes: ["standard", "solo", "coop"],
    name: "Aftermath Rooms “2”",
    summary: "Add 4 new Rooms to the Room “2” pool: Crafting, Server, Alarm and Turret Room.",
    description: "Shuffle the 4 additional Room “2” tiles into the base game's Room “2” pool during setup step 2. They bring 3 new Crafted Items that can only be made in the Crafting Room (Energy Charge → Laser Pointer, Tools → Combat Drone, Clothes → Enviro-Suit) — add these cards to the Crafted Item deck.",
    src: "Aftermath p.5"
  },
  {
    id: "turrets", requires: "aftermath", modes: ["standard", "solo", "coop"],
    name: "Turrets",
    summary: "Automated defense turrets appear via 3 new Exploration tokens.",
    description: "Add the 3 Turret Exploration tokens to the Exploration token pool in setup step 4 and place the Turret miniatures with their Status tokens next to the board. When a Turret token is revealed, place a Turret in that Room (never in the Nest or a slimed Room) with its 3 Status tokens shuffled face down on top — the topmost is its current status (Inactive / Target: All / Target: Intruders), revealed when the Room is first entered. Turrets shoot during the Fire Damage step at everything that entered the Room this turn (Characters take 1 Light Wound, Intruders 1 Injury); Intruders destroy any active Turret in their Room during that same step. Playing with Void Seeders? The FAQ recommends exchanging Lair tokens last so all 3 Lairs stay in the pool.",
    src: "Aftermath p.5 · FAQ v2.2 p.6"
  },
  {
    id: "hourglass", requires: "aftermath",
    name: "Hourglass",
    summary: "Real-time pressure: an empty hourglass triggers extra Noise rolls.",
    description: "Turn the hourglass over at the beginning of every game turn. When any player notices it has run out, they may pick it up and choose any 1 Room on the board, then roll the Noise die for it with the usual rules. If an Encounter results, the Surprise Attack targets the player with the fewest cards in hand (no Character in the Room = no Surprise Attack). Set the hourglass aside afterwards; it is turned again at the start of the next turn. Nobody is obliged to pick it up, and it can be removed if any player objects.",
    src: "Aftermath p.8"
  }
];

/* ---------------------------------------------------------------------------
   Setup phases. Steps carry `when(c)` predicates; d/src/exp may be functions.
   ctx c = { has(exp), mode, race, p, mod(id) }
--------------------------------------------------------------------------- */
var STD = function (c) { return c.mode === "standard" || c.mode === "solo" || c.mode === "coop"; };

NM.phases = [
  {
    title: "Board Setup",
    steps: [
      {
        when: STD, exp: "base",
        t: "Place the board",
        d: function (c) {
          if (c.mod("altboard")) return "Place the board with its <b>alternative side</b> up (the side without the red arrow icon):<ul><li>The <b>Red and Blue Technical Corridors</b> are separate networks — Noise markers in one are not in the other.</li><li>Some Rooms connect through a <b>pair of Corridors</b>; Closed Doors in one do not affect the other.</li><li>Place <b>Evacuation sections A and B face up</b> on the highlighted spots, each with a face-down Exploration token.</li></ul>";
          return "Place the board using its <b>basic side</b> — marked with a red arrow icon in the upper-left corner.";
        },
        src: function (c) { return c.mod("altboard") ? "Base p.27" : "Base p.6"; }
      },
      {
        when: STD, exp: function (c) { return c.mod("aftrooms") ? "aftermath" : "base"; },
        t: "Deal the Room “2” tiles",
        d: function (c) {
          var extra = c.mod("aftrooms") ? "<li><b>Aftermath:</b> first shuffle the 4 additional Rooms “2” (Crafting, Server, Alarm, Turret Room) into the pool, and add the 3 new Crafted Item cards to the Crafted Item deck.</li>" : "";
          return "<ul>" + extra + "<li>Shuffle all Room “2” tiles <b>face down</b> without looking at their fronts.</li><li>Place one face down on each Room slot marked “2”.</li><li>Return the rest to the box unseen — you never use them all, so nobody knows exactly which Rooms are aboard.</li></ul>";
        },
        src: function (c) { return c.mod("aftrooms") ? "Base p.6 · Aftermath p.5" : "Base p.6"; }
      },
      {
        when: STD, exp: "base",
        t: "Deal the Room “1” tiles",
        d: "Use the same method for the Room “1” tiles: shuffle face down and place one on each Room slot marked “1”. All 11 basic Rooms are used every game.",
        src: "Base p.6"
      },
      {
        when: STD, exp: function (c) { return c.race === "void" ? "void" : (c.mod("turrets") ? "aftermath" : "base"); },
        t: "Place Exploration tokens",
        d: function (c) {
          var pre = "";
          if (c.race === "void") pre = "<li><b>Void Seeders:</b> remove <b>2 “Slime” and 2 “Silence”</b> tokens from the pool and add the <b>3 “Lair”</b> tokens.</li>";
          var tur = c.mod("turrets") ? "<li><b>Turrets:</b> add the 3 Turret Exploration tokens to the pool; keep the Turret miniatures and Status tokens next to the board." + (c.race === "void" ? " The FAQ advises exchanging the Lair tokens for Turret tokens <i>last</i>, so all 3 Lairs remain." : "") + "</li>" : "";
          var where = c.race === "void" ? "on each Room tile <b>and in each Engine</b> (there are no Items in Engines)" : "on each Room tile";
          return "<ul>" + pre + tur + "<li>Shuffle the Exploration tokens without looking at their fronts.</li><li>Place one face down " + where + ".</li><li>Return the remainder to the box.</li></ul>";
        },
        src: function (c) {
          var s = "Base p.6";
          if (c.race === "void") s = "Void p.3";
          if (c.mod("turrets")) s += " · Aftermath p.5 · FAQ v2.2 p.6";
          return s;
        }
      },
      {
        when: STD, exp: "base",
        t: "Coordinates & Destination",
        d: "<ul><li>Place 1 random Coordinates card <b>face down</b> on its space next to the Cockpit; box the rest unseen.</li><li>Place a Status marker on the <b>“B” space</b> of the Destination Track — this is the Destination marker.</li></ul>",
        src: "Base p.6"
      },
      {
        when: STD, exp: "base",
        t: "Place the Escape Pods",
        d: function (c) {
          var n = c.p <= 2 ? "2 Escape Pods" : (c.p <= 4 ? "3 Escape Pods" : "4 Escape Pods");
          return "<ul><li>For <b>" + c.p + " player" + (c.p > 1 ? "s" : "") + "</b>, take <b>" + n + "</b> at random (1-2 players: 2 · 3-4 players: 3 · 5 players: 4).</li><li>Place the lowest-numbered Pod in Section “A”, the next in Section “B”, then keep alternating A/B in numerical order.</li><li>All Pods start with their <b>“Locked”</b> side face up. Box the rest.</li></ul>";
        },
        src: function (c) { return c.race === "carno" ? "Base p.6 · Carno p.2" : (c.race === "void" ? "Base p.6 · Void p.3" : "Base p.6"); }
      },
      {
        when: STD, exp: "base",
        t: "Set up the Engines",
        d: "For each Engine number 1-3: take both of its Engine tokens (1 Damaged + 1 Working), shuffle them face down, and stack them on the matching Engine slot. The <b>top token is the true status</b> — make sure nobody sees the fronts.",
        src: "Base p.6"
      },
      {
        when: STD,
        exp: function (c) { return c.race === "intruders" ? "base" : c.race; },
        t: function (c) {
          if (c.race === "carno") return "Set up the Carnomorph board";
          if (c.race === "void") return "Set up the Void Seeder board";
          return "Set up the Intruder board";
        },
        d: function (c) {
          if (c.race === "carno") return "Put the Carnomorph board next to the main board and place in its slots:<ul><li><b>8 Egg tokens</b>.</li><li><b>3 random Carnomorph Adaptation cards, face down</b> — these <i>strengthen</i> the Carnomorphs instead of weakening them.</li><li>Place 1 <b>Shambler</b>, 1 <b>Fleshbeast</b> and 1 <b>Butcher</b> miniature on their corresponding Adaptation cards — each enters the board when its type first appears, revealing that Adaptation.</li></ul>";
          if (c.race === "void") return "Put the Void Seeder board next to the main board and place in its slots:<ul><li><b>5 Egg tokens</b>.</li><li><b>3 random Void Seeder Weakness cards, face down</b> (from the separate Void Seeder Weakness deck).</li></ul>";
          return "Put the Intruder board next to the main board and place in its slots:<ul><li><b>5 Egg tokens</b>.</li><li><b>3 random Weakness cards, face down</b> — hidden until discovered. Box the remaining Weakness cards unseen.</li></ul>";
        },
        src: function (c) { return c.race === "carno" ? "Carno p.3" : (c.race === "void" ? "Void p.3" : "Base p.6"); }
      },
      {
        when: STD,
        exp: function (c) { return c.race === "intruders" ? "base" : c.race; },
        t: "Fill the Intruder bag",
        d: function (c) {
          if (c.race === "carno") return "Put in the Intruder bag:<ul><li>1 Blank token</li><li>2 <b>blue</b> Metagorger tokens</li><li>2 <b>red</b> Metagorger tokens</li><li>+1 additional <b>red</b> Metagorger per player (" + c.p + " player" + (c.p > 1 ? "s" : "") + " = " + c.p + " extra)</li></ul>Keep the remaining tokens next to the board. <i>Whenever the game adds Metagorger tokens to the bag, add red ones first; blue only when red run out.</i>";
          if (c.race === "void") return "Put in the Intruder bag:<ul><li>1 Blank token</li><li>2 random Void Seeder tokens</li><li>+1 additional random Void Seeder token per player (" + c.p + " player" + (c.p > 1 ? "s" : "") + " = " + c.p + " extra)</li></ul>Keep the rest next to the board. <i>Void Seeder tokens carry no type symbol — the type that appears depends on the triggering Character's Insanity.</i>";
          return "Put in the Intruder bag:<ul><li>1 Blank token</li><li>4 Larva tokens</li><li>1 Creeper token</li><li>1 Queen token</li><li>3 Adult tokens</li><li>+1 additional Adult token per player (" + c.p + " player" + (c.p > 1 ? "s" : "") + " = " + c.p + " extra)</li></ul>Place the remaining Intruder tokens and the Intruder Carcass tokens next to the board.";
        },
        src: function (c) { return c.race === "carno" ? "Carno p.3" : (c.race === "void" ? "Void p.3" : "Base p.6"); }
      },
      {
        when: STD,
        exp: function (c) { return c.race === "intruders" ? "base" : c.race; },
        t: "Shuffle and place the decks",
        d: function (c) {
          var evt = "Event", atk = "Intruder Attack", extra = "";
          if (c.race === "carno") { evt = "Carnomorph Event"; atk = "Carnomorph Attack"; extra = "<li><b>Character Mutation</b> deck</li>"; }
          if (c.race === "void") { evt = "Void Seeder Event"; atk = "Void Seeder Attack"; extra = "<li><b>Panic</b> deck</li>"; }
          var solo = "";
          if (c.mode === "standard") solo = "<li>Box the Intruder Action cards" + (c.mod("intruderplayer") ? " — <b>except</b> keep the Intruder Player Action deck handy for the “Play as an Intruder” module" : "") + " and the Solo/Coop Objective cards.</li>";
          else solo = "<li>Keep the <b>Solo/Coop Objectives</b> deck — this mode uses it instead of the regular Objective decks. Box the Intruder Action cards.</li>";
          return "Shuffle separately and place face down next to the board:<ul><li>3 Item decks (Red, Yellow, Green)</li><li>" + evt + " deck</li><li>" + atk + " deck</li><li>Contamination deck</li>" + extra + "<li>Serious Wound deck</li></ul>Then:<ul><li>Place the <b>Crafted Item</b> deck" + (c.mod("aftrooms") ? " (including the 3 new Aftermath cards)" : "") + " next to the 3 Item decks.</li><li>Place the <b>Scanner</b> next to the Contamination deck.</li>" + solo + "</ul>";
        },
        src: function (c) { return c.race === "carno" ? "Carno p.3" : (c.race === "void" ? "Void p.3" : "Base p.6"); }
      },
      {
        when: STD, exp: "base",
        t: "Lay out markers, tokens & dice",
        d: "Place next to the board: Fire markers, Malfunction markers, Noise markers, Ammo/Injury markers, Status markers (Light Wounds / Slime / Signal / Self-Destruct / Time / Destination), Door tokens, red Character Corpse tokens, 2 Combat dice, 2 Noise dice, and the First Player token.",
        src: "Base p.6"
      },
      {
        when: STD, exp: "base",
        t: "Start the Time Track",
        d: "Place 1 Status marker on the <b>green space</b> of the Time Track — the Time marker. The board is ready; proceed to crew setup.",
        src: "Base p.6"
      }
    ]
  },

  {
    title: "Crew Setup",
    steps: [
      {
        when: STD,
        exp: function (c) { return c.race === "intruders" ? "base" : c.race; },
        t: "Deal Help cards & Inventories",
        d: function (c) {
          var swap = "";
          if (c.race === "carno") swap = " Then swap the basic Help cards for the <b>Carnomorph Help cards</b>.";
          if (c.race === "void") swap = " Then swap the basic Help cards for the <b>Void Seeders Help cards</b>.";
          return "<ul><li>Deal 1 random Help card per player, using cards numbered 1-" + c.p + ". The number is your <b>Player Number</b> — it sets Character-draft order and matters for some Objectives.</li><li>Each player takes the plastic Inventory card holder with the same number — Items in it stay hidden from the other players.</li></ul>" + swap;
        },
        src: function (c) { return c.race === "carno" ? "Base p.8 · Carno p.3" : (c.race === "void" ? "Base p.8 · Void p.3" : "Base p.8"); }
      },
      {
        when: STD, exp: function (c) { return c.mode === "standard" ? "base" : "mode"; },
        t: "Deal Objectives",
        d: function (c) {
          if (c.mode === "solo") return "<ul><li>Draw <b>2 cards from the Solo/Coop Objectives deck</b> instead of regular Objectives.</li><li>After the First Encounter you must choose one of the two and discard the other.</li><li><b>Item counters are halved (rounded up)</b>: Exploration tokens showing 1-2 Items → set the counter to 1; showing 3-4 → set it to 2.</li></ul>To win: fulfill your Objective and survive.";
          if (c.mode === "coop") return "<ul><li>Each player draws <b>1 card from the Solo/Coop Objectives deck</b> instead of regular Objectives. These are <b>public information</b>.</li><li>To win, <b>ALL</b> of these Objectives must be fulfilled and at least 1 Character must survive.</li><li>If two or more cards require sending the Signal, that many different Characters must each send it.</li></ul>";
          return "<ul><li>From both Objective decks (Corporate and Personal), remove all cards showing a player count higher than " + c.p + ".</li><li>Shuffle the decks separately; deal each player <b>1 Corporate + 1 Personal Objective</b>, kept hidden.</li><li>At the <b>First Encounter</b> you will discard one of the two and pursue the other.</li></ul><i>Objectives come before the Character draft on purpose — pick the Character best suited to yours.</i>";
        },
        src: function (c) { return c.mode === "standard" ? "Base p.8" : "Base p.27"; }
      },
      {
        when: STD, exp: function (c) { return c.has("aftermath") ? "aftermath" : "base"; },
        t: "Character draft",
        d: function (c) {
          var aft = c.has("aftermath") ? "<li><b>Aftermath:</b> a drafted card lets you pick <i>either</i> the base game or the Aftermath Character of that color (e.g. red = Soldier or Convict). Each player keeps their draft card so nobody else can take the other Character of that color. The Convict and the Soldier can never both be in the same game.</li>" : "";
          return "<ul><li>Shuffle all Character draft cards.</li><li>In Player Number order: draw 2 cards, reveal, keep 1 and shuffle the other back.</li>" + aft + "<li>Box the remaining draft cards.</li></ul>";
        },
        src: function (c) { return c.has("aftermath") ? "Base p.8 · Aftermath p.3" : "Base p.8"; }
      },
      {
        when: STD, exp: function (c) { return c.race === "void" ? "void" : (c.mod("traits") ? "aftermath" : "base"); },
        t: "Take Character components",
        d: function (c) {
          var out = "<ul><li><b>Character board</b> of your drafted Character.</li><li><b>Miniature</b> in your colored plastic ring, placed in the <b>Hibernatorium</b>.</li><li><b>Action deck</b>, shuffled, face down to the left of your board.</li><li><b>Starting Item (Weapon)</b> in a Hand slot, loaded with Ammo markers equal to its capacity.</li><li><b>2 Quest Item cards</b>, horizontal side up, next to your board — inactive until their mini-quests are completed.</li><li>Leave a spot for your <b>Action discard pile</b> (Contamination cards go there too).</li>";
          if (c.mod("traits")) out += "<li><b>Trait card</b> of your Character, face up next to your board — in effect all game.</li>";
          if (c.race === "void") out += "<li><b>Insanity Track card</b> over the miniature picture and Slime space of your board, with a Status marker on <b>space 1</b>.</li>";
          out += "</ul>";
          return out;
        },
        src: function (c) {
          var s = "Base p.8";
          if (c.mod("traits")) s += " · Aftermath p.3";
          if (c.race === "void") s += " · Void p.3";
          return s;
        }
      },
      {
        when: function (c) { return STD(c) && c.race === "void"; }, exp: "void",
        t: "Add Insanity tokens to the bag",
        d: function (c) { return "After Characters are chosen, add <b>1 Insanity token of each player's color</b> to the Intruder bag (" + c.p + " token" + (c.p > 1 ? "s" : "") + ")."; },
        src: "Void p.3"
      },
      {
        when: STD, exp: "base",
        t: "First Player & the poor sod",
        d: "<ul><li>Player 1 takes the <b>First Player token</b>.</li><li>Place the <b>blue Character Corpse token</b> in the Hibernatorium — treat it as a Character Corpse Object all game." + "</li></ul>",
        src: "Base p.8"
      },
      {
        when: function (c) { return c.mod("hourglass"); }, exp: "aftermath",
        t: "Set out the hourglass",
        d: "Place the hourglass in reach and <b>turn it over at the beginning of every game turn</b>:<ul><li>When any player notices it has run out, they may pick it up, choose any 1 Room on the board, and roll the Noise die for it with the usual rules.</li><li>If an Encounter results, the Surprise Attack targets the player with the fewest cards in hand (no Character in that Room = no Surprise Attack).</li><li>After the roll, set the hourglass aside until the next turn begins. Picking it up is never mandatory, and it is removed if any player objects (after resolving the pending Noise roll).</li></ul>",
        src: "Aftermath p.8"
      }
    ]
  },

  /* ---------------- Epilogue mode ---------------- */
  {
    title: "Epilogue Setup — after a finished game",
    steps: [
      {
        when: function (c) { return c.mode === "epilogue"; }, exp: "mode",
        t: "Prerequisite: a finished regular game",
        d: "The Epilogue is played immediately after a full regular Nemesis game, on the same board. Keep the board state — you are the rescue crew arriving on the drifting ship.",
        src: "Aftermath p.6"
      },
      {
        when: function (c) { return c.mode === "epilogue"; }, exp: "mode",
        t: "Reset the Intruders",
        d: function (c) {
          var mix = c.p <= 3 ? "1 Larva + 2 Adult tokens" : (c.p === 4 ? "2 Larva + 4 Adult tokens" : "3 Larva + 6 Adult tokens");
          return "<ul><li>Remove all Intruders from the board; put their tokens back in the Intruder bag.</li><li>Then add for " + c.p + " players: <b>" + mix + "</b> (2-3 players: 1 Larva + 2 Adults · 4 players: 2 + 4 · 5 players: 3 + 6). If you run out of tokens, add no more.</li></ul>";
        },
        src: "Aftermath p.6"
      },
      {
        when: function (c) { return c.mode === "epilogue"; }, exp: "mode",
        t: "Clean and keep the board",
        d: "<ul><li><b>Remove:</b> all Fire and Noise markers; every Item the previous crew found or crafted.</li><li><b>Keep in place:</b> Malfunction markers, Door tokens and Escape Pods; all revealed and unrevealed Weakness cards — put Status markers on revealed Weaknesses, which stay inactive until rediscovered (research them again as normal).</li></ul>",
        src: "Aftermath p.6"
      },
      {
        when: function (c) { return c.mode === "epilogue"; }, exp: "mode",
        t: "Decks, Engines & Coordinates",
        d: "Shuffle and place face down: Intruder Attack, <b>Aftermath Event</b>, Contamination and Serious Wound decks. Reshuffle the Engine tokens and the Coordinates card and place them as in base game setup — the rescue crew doesn't inherit the old crew's knowledge.",
        src: "Aftermath p.6"
      },
      {
        when: function (c) { return c.mode === "epilogue"; }, exp: "mode",
        t: "Reveal unexplored Rooms",
        d: "Turn every unexplored Room tile face up and reveal its Exploration token <b>only to set the Item counter</b> — ignore the tokens' special effects.",
        src: "Aftermath p.6"
      },
      {
        when: function (c) { return c.mode === "epilogue"; }, exp: "mode",
        t: "Aftermath Exploration tokens",
        d: "Shuffle the Aftermath Exploration tokens and place 1 face down on <b>every Room, plus the Hibernatorium, Cockpit and each Engine</b>. Reveal one when a Character enters its Room: Lockdown (close all Doors except the one you entered through; via Technical Corridors = close ALL), Danger (as a Noise roll result), Egg, Slimed room (stays — Slime on every entry), Larva (no Encounter, no Noise roll), Fire, or Carcass. They do not set Item counters.",
        src: "Aftermath p.5-6"
      },
      {
        when: function (c) { return c.mode === "epilogue"; }, exp: "mode",
        t: "Set up the Shuttle",
        d: "<ul><li>Place the Shuttle board next to the main board.</li><li>Fill its three Room “2” slots with random <b>Additional Room “2”</b> tiles, face up (replace a “Room covered in Slime” with another).</li><li>Shuttle Rooms have no Item counters — no Searching there.</li><li><b>Shuttle movement:</b> from the Main Room you may move to any ship Room with a Technical Corridors Entrance, and vice versa.</li></ul>",
        src: "Aftermath p.5-6"
      },
      {
        when: function (c) { return c.mode === "epilogue"; }, exp: "mode",
        t: "Crew setup",
        d: "<ul><li>Deal Help cards; swap them for <b>Aftermath Help cards</b>. Take matching Inventory holders.</li><li><b>Draft:</b> deal every player 2 Character draft cards; keep 1, shuffle the other back.</li><li>Take: Character board, miniature, Action deck, Starting Item(s), Quest Items and <b>Trait card</b>. Player 1 takes the First Player token.</li><li>Place all miniatures in the Shuttle's <b>Main Room</b>, in Player Number order.</li></ul>",
        src: "Aftermath p.6"
      },
      {
        when: function (c) { return c.mode === "epilogue"; }, exp: "mode",
        t: "Requirements, Alerts & the Lucrative Offer",
        d: "<ul><li>Deal each player 1 <b>Personal Requirement</b> card.</li><li>Shuffle the <b>Alert deck</b>, place it face down, and reveal the first Alert. You have 2 turns per Alert; requirements are checked when the Shuttle Time marker reaches a yellow space (turns 3 and 5) — fail and everyone loses. The second Alert is revealed at the start of turn 3.</li><li>Place the <b>Lucrative Offer</b> card face up nearby.</li><li>Place the Time marker on the green space of the <b>Shuttle Time Track</b> — the game lasts 5 turns.</li></ul>",
        src: "Aftermath p.6"
      }
    ]
  },

  /* ---------------- Research Mission mode ---------------- */
  {
    title: "Research Mission Setup — Board",
    steps: [
      {
        when: function (c) { return c.mode === "research"; }, exp: "mode",
        t: "Boards and Rooms",
        d: "<ul><li>Place the main board, <b>basic side</b> up, with the <b>Shuttle board</b> next to it.</li><li>Shuffle and deal Room “2” tiles face down onto every “2” slot <b>on both boards</b>, then Room “1” tiles onto the “1” slots.</li><li>Reveal the Shuttle's Room tiles; swap a revealed “Room covered in Slime” for another random Room “2”.</li></ul>",
        src: "Aftermath p.7"
      },
      {
        when: function (c) { return c.mode === "research"; }, exp: "mode",
        t: "Exploration tokens — two sets",
        d: "<ul><li>Take the base Exploration tokens, <b>remove the Doors and Danger tokens, add the 3 Turret tokens</b>, shuffle, and place 1 face down on each unexplored Room tile.</li><li>Then place 1 <b>Aftermath Exploration token</b> face down on EVERY Room of the Nemesis — Cockpit, Hibernatorium and Engines included. Each Room tile ends up with two different tokens.</li></ul>",
        src: "Aftermath p.7"
      },
      {
        when: function (c) { return c.mode === "research"; }, exp: "mode",
        t: "Coordinates, Escape Pods & Engines",
        d: function (c) {
          var pods = c.p <= 2 ? "1 Escape Pod" : (c.p <= 4 ? "2 Escape Pods" : "3 Escape Pods");
          return "<ul><li>Place 1 random Coordinates card face down next to the Cockpit.</li><li>Take <b>" + pods + "</b> (1-2 players: 1 · 3-4 players: 2 · 5 players: 3) — fewer than a regular game. Place them alternating A/B starting from Section “A”, Locked side up.</li><li>Set up the three Engines as usual: shuffled Damaged/Working pairs, top token is the truth.</li></ul>";
        },
        src: "Aftermath p.7"
      },
      {
        when: function (c) { return c.mode === "research"; }, exp: "mode",
        t: "Intruder board & bag",
        d: function (c) {
          return "<ul><li>Intruder board: <b>5 Egg tokens + 3 random Weakness cards</b> face down.</li><li>Intruder bag: <b>1 Blank, 4 Larvae, 2 Creepers, 3 Adults, 1 Breeder, 1 Queen</b> +1 additional Adult per player (" + c.p + " extra) — a hotter bag than the base game.</li><li>Keep remaining Intruder tokens and Carcass tokens nearby.</li></ul>";
        },
        src: "Aftermath p.7"
      },
      {
        when: function (c) { return c.mode === "research"; }, exp: "mode",
        t: "Build the Research Mission Event deck",
        d: "From the basic Event deck take: <b>Lurking, Short Circuit, Hunt (Intruder Move direction: 3), Scent of Prey, Damage, Life Support Failure, Eclosion, Damaging Fire</b>. Shuffle them together with the Aftermath Event deck — this combined deck is the Research Mission Event deck.",
        src: "Aftermath p.7"
      },
      {
        when: function (c) { return c.mode === "research"; }, exp: "mode",
        t: "Decks, markers & Time",
        d: "<ul><li>Shuffle and place: 3 Item decks, Research Mission Event, Intruder Attack, Contamination, <b>Alert</b> and Serious Wound decks; Crafted Item deck (with the new cards) beside the Item decks; Scanner by the Contamination deck.</li><li>Lay out the usual markers, Door tokens, red Corpse tokens, dice and First Player token (Status markers also serve as Alert Stage markers).</li><li>Time marker on the green space of the Time Track.</li></ul>",
        src: "Aftermath p.7"
      }
    ]
  },
  {
    title: "Research Mission Setup — Crew",
    steps: [
      {
        when: function (c) { return c.mode === "research"; }, exp: "mode",
        t: "Help cards, Inventories & Objectives",
        d: function (c) {
          return "<ul><li>Deal Help cards 1-" + c.p + " and matching Inventory holders.</li><li>Remove Objectives above your player count from both decks, then deal each player <b>1 Corporate + 1 Personal Objective</b>, hidden — the standard rules apply.</li></ul>";
        },
        src: "Aftermath p.7"
      },
      {
        when: function (c) { return c.mode === "research"; }, exp: "mode",
        t: "Character draft",
        d: "Standard draft: in Player Number order draw 2 draft cards, keep 1. A drafted color lets you pick the base or Aftermath Character of that color (Convict and Soldier never together). <b>The Android's player</b> discards their Personal Objective face down and draws a second Corporate Objective instead.",
        src: "Aftermath p.8 · Aftermath p.3"
      },
      {
        when: function (c) { return c.mode === "research"; }, exp: "mode",
        t: "Character components & start on the Shuttle",
        d: "Each player takes: Character board, miniature, shuffled Action deck, Quest Items (horizontal, inactive), <b>Trait card</b> (horizontal side up), and Starting Item with full Ammo (the Android's Arm Gun and the CEO's Robot sit next to the Quest Items). Player 1 takes the First Player token. Place the <b>blue Character Corpse</b> in the Hibernatorium. All Characters start in the Shuttle's <b>Main Room</b>.",
        src: "Aftermath p.8"
      },
      {
        when: function (c) { return c.mode === "research"; }, exp: "mode",
        t: "How Alerts arrive",
        d: "When an Event card with the Alert icon is drawn, draw 1 <b>Alert card</b> and set the Shuttle Time Track to space 5 (ignore the icon if an Alert is already running). You have <b>5 turns per Alert</b>; when the Shuttle Time Track hits the final red space — or the game ends mid-Alert — check its requirements. Unfulfilled = everyone dies. Some Alerts need the new <b>Activation Action</b> (1 card, only in the Room the Alert names, usable in or out of Combat).",
        src: "Aftermath p.8 · Aftermath p.5"
      }
    ]
  }
];

/* ---------------------------------------------------------------------------
   Reference sections
--------------------------------------------------------------------------- */
NM.reference = [
  {
    id: "round",
    title: "Round Order & Player Phase",
    when: function (c) { return true; },
    html: function (c) {
      var ep;
      if (c.race === "carno") ep = "<ol><li><b>Time Track</b> — move the Time marker (and Self-Destruct marker if active) 1 space right.</li><li><b>Intruder Attack — Feeding</b>: each Carnomorph in Combat attacks; each Carnomorph <i>not</i> in Combat in a Room with a Heavy Object and/or Metagorger <b>Feeds</b> (heal → evolve → eat). Carnomorphs in the Nest eat 1 Egg each.</li><li><b>Fire Damage</b> — each Carnomorph in a Room with Fire suffers 1 Injury.</li><li><b>Resolve 1 Event card</b>.</li><li><b>Bag development</b> — draw 1 token (see the Carnomorph table below).</li></ol>";
      else if (c.race === "void") ep = "<ol start='4'><li><b>Time Track</b> — move the Time marker (and Self-Destruct marker if active) 1 space right.</li><li><b>Void Seeder Attack</b> — each Void Seeder in Combat attacks, base game rules.</li><li><b>Fire Damage</b> — each Void Seeder <i>and Lair</i> in a Room with Fire suffers 1 Injury.</li><li><b>Resolve 1 Event card</b>.</li><li><b>NEW — Lurking</b>: for each Room with a Void Seeder not in Combat and no Character in a neighboring Room (Seeders ignore Closed Doors), place a Noise marker in each connected Corridor, remove those Seeders, and add 1 random Void Seeder token to the bag per Seeder removed.</li><li><b>Bag development</b> — draw 1 token (see the Void Seeder table below).</li></ol>";
      else ep = "<ol start='5'><li><b>Time Track</b> — move the Time marker 1 space right (and the Self-Destruct marker, if the sequence is active).</li><li><b>Intruder Attack</b> — each Intruder in Combat with a Character attacks them.</li><li><b>Fire Damage</b> — each Intruder in a Room with a Fire marker suffers 1 Injury.</li><li><b>Resolve 1 Event card</b> — first Intruder Movement (Intruders matching the card's symbol and not in Combat move through the Corridor with the card's number), then the Event Effect.</li><li><b>Intruder bag development</b> — draw 1 token and resolve it (table below).</li></ol>";
      return "<h4>I. Player Phase</h4><ol><li><b>Draw</b> up to 5 Action cards (Contamination cards count toward your hand).</li><li><b>Pass the First Player token</b> to the left.</li><li><b>Player turns</b> in clockwise order — each turn is <b>2 Actions</b>, or 1 Action + pass, or pass. After passing you take no more turns this round and may discard any cards. Flip your Help card to “Pass”.</li><li>Repeat until everyone has passed. Ending your turn in a Room with Fire = 1 Light Wound.</li></ol><h4>II. Event Phase</h4>" + ep + "<p><i>The round ends after bag development is fully resolved — including any resulting Encounters and Surprise Attacks.</i></p>";
    },
    src: function (c) { return c.race === "carno" ? "Base p.10, 28 · Carno p.6-7" : (c.race === "void" ? "Base p.10, 28 · Void p.6" : "Base p.10, 28"); }
  },
  {
    id: "bagdev",
    title: "Bag Development Table",
    when: function (c) { return true; },
    html: function (c) {
      if (c.race === "carno") return "<p>Draw 1 token from the Intruder bag:</p><ul><li><b>Red Metagorger</b> — place a Metagorger miniature in each Room that already contains a Metagorger (even in Combat) and/or a Heavy Object (even one in a Character's hands!). If the Nest is explored and not destroyed, also place one there. Return the token. <i>These minis are not drawn from the bag and make no Surprise Attack — but if this is the first Carnomorph to enter play, it still triggers the First Encounter objective choice.</i></li><li><b>Blue Metagorger</b> — all players not in Combat roll for Noise in order. Remove this token from the bag and add 1 Metagorger token (red first!).</li><li><b>Shambler</b> — return it; all players not in Combat roll for Noise in order.</li><li><b>Fleshbeast</b> — return it; all players not in Combat roll for Noise in order.</li><li><b>Butcher</b> — place the Butcher in the Room of a Character with a Slime marker (most-slimed tie → fewest cards in hand → Character order; nobody slimed → the first player's Room) and resolve an Encounter. Remove the token from the bag. <i>The Butcher can't use Technical Corridor entrances.</i></li><li><b>Blank</b> — remove from the board every Shambler not in a Room with a Character and return their tokens to the bag; add 1 Metagorger token; all players not in Combat roll for Noise; return the Blank.</li></ul>";
      if (c.race === "void") return "<p>Draw 1 token from the Intruder bag:</p><ul><li><b>Void Seeder</b> — return it; all players roll for Noise in order, except Characters already in Combat with a Void Seeder or a Lair.</li><li><b>Character Insanity</b> — if the matching Character is dead, hibernated or in an Escape Pod, remove the token and draw another. Otherwise that Character resolves a <b>Panic card</b>. Return the token.</li><li><b>Blank</b> — add a random Void Seeder token to the bag (nothing happens if none remain); return the Blank.</li></ul>";
      return "<p>Draw 1 token from the Intruder bag:</p><ul><li><b>Larva</b> — remove it from the bag; add 1 Adult token.</li><li><b>Creeper</b> — remove it from the bag; add 1 Breeder token.</li><li><b>Adult</b> — all players roll for Noise in turn order (skip players in Combat). Return the token.</li><li><b>Breeder</b> — all players roll for Noise in turn order (skip players in Combat). Return the token.</li><li><b>Queen</b> — if any Character is in the Nest, place the Queen there and resolve an Encounter; otherwise add 1 Egg to the Intruder board. Return the token.</li><li><b>Blank</b> — add 1 Adult token to the bag (nothing happens if none remain). Return the Blank.</li></ul><p class='fnote'>FAQ: an Adult token added to the bag during this step (e.g. by a Larva draw) can be drawn again the same game normally; tokens “removed” go out of the bag, tokens “returned” stay in.</p>";
    },
    src: function (c) { return c.race === "carno" ? "Carno p.7" : (c.race === "void" ? "Void p.6" : "Base p.10"); }
  },
  {
    id: "win",
    title: "Winning, Victory Checks & Critical Moments",
    when: function (c) { return c.mode !== "epilogue"; },
    html: function (c) {
      var chk;
      if (c.race === "carno") chk = "<li><b>3. Contamination check</b> — if you have a Mutation card, skip scanning and go straight to the draw. Otherwise Scan every Contamination card in your deck, discard pile and hand; at least 1 INFECTED = take a Mutation card. Anyone with a Mutation card shuffles all their cards into a new deck and draws 4: each Contamination card drawn = 1 Mutation marker. 4 Mutation markers = death.</li>";
      else if (c.race === "void") chk = "<li><b>3. Contamination check</b> — each Contamination card in your deck, hand and discard raises Insanity by 1 (max 5, you cannot die in this step). Then every Character at Insanity 5 shuffles all their cards and draws 4 — <b>any</b> Contamination card among them (Infected or not) means death. Characters already at Insanity 5 skip the counting and go straight to the draw.</li>";
      else chk = "<li><b>3. Contamination check</b> — Scan every Contamination card in your deck, discard pile and hand. At least 1 INFECTED card <i>or a Larva on your board</i> (Larva = skip the scan): shuffle all your cards into a new deck and draw 4 — any Contamination card among them (Infected or not) means death.</li>";
      var modes = "";
      if (c.mode === "coop") modes = "<h4>Co-op revive</h4><p>The Emergency Room's AutoDoc can revive the dead: carry a Character Corpse there, and that Character returns at the start of the next round with Light Wounds discarded and Serious Wounds Dressed. It doesn't work with an Intruder or Malfunction in the Room.</p>";
      return "<h4>How to win</h4><ul><li>Complete your Objective, <b>and</b></li><li>Survive: <b>hibernate</b> (Time marker on a blue space, no Intruder in the Hibernatorium, Noise roll doesn't summon one) while the ship makes its jump, or escape in an <b>Escape Pod</b>, and</li><li>Pass the end-of-game checks below.</li></ul><h4>The game ends when…</h4><ul><li>The Time marker reaches the final red space — immediate hyperspace jump; everyone on board not hibernating dies (Intruders survive!).</li><li>The Self-Destruct marker reaches the skull, or a 9th Fire or 9th Malfunction marker must be placed — the ship is destroyed; everyone and everything dies, hibernating or not.</li><li>The last active Character dies, hibernates or escapes — advance the Self-Destruct marker (if active) or the Time marker to its final space and resolve it.</li></ul><h4>Victory Check (in order)</h4><ul><li><b>1. Engines</b> — reveal the top Engine tokens: 2 or 3 Damaged = the ship explodes and hibernating Characters die. A Malfunction marker in an Engine Room never damages the Engine itself.</li><li><b>2. Coordinates</b> — reveal the Coordinates card; the Destination marker picks one of its four destinations. Not headed to Earth = all hibernating Characters die (exception: the Quarantine objective wants Mars).</li>" + chk + "<li><b>4. Objectives</b> — reveal Objective cards; fulfill yours and you win. Multiple players can win.</li></ul><p>Characters in a launched Escape Pod always count as arriving on Earth" + (c.race === "intruders" ? "; they still make the Contamination check" : "") + ".</p><h4>Critical moments</h4><ul><li><b>First Encounter</b> — when the first Intruder of any type appears, every player chooses 1 of their 2 Objectives and discards the other face down.</li><li><b>First death</b> — all Escape Pods unlock automatically" + (c.mode === "standard" ? "; optionally the first dead player may start playing as the Intruder (module)" : "") + ".</li><li><b>Blue Time Track spaces</b> — the Hibernation chambers open.</li><li><b>Self-Destruct on yellow</b> — the sequence can no longer be aborted and all Escape Pods unlock instantly (they can be re-Locked).</li><li><b>Self-Destruct skull</b> — the ship explodes. A hyperspace jump during an active Self-Destruct still destroys the ship.</li></ul>" + modes + "<p class='fnote'>FAQ: hibernated Characters are immune to everything except the ship's destruction. Blowing up the ship does fulfill “destroy the Nest/kill the Queen”-type objectives.</p>";
    },
    src: function (c) { return "Base p.11-12" + (c.race === "carno" ? " · Carno p.7" : (c.race === "void" ? " · Void p.6" : "")) + " · FAQ v2.2 p.2-3"; }
  },
  {
    id: "epwin",
    title: "Epilogue — Turn Structure & Victory",
    when: function (c) { return c.mode === "epilogue"; },
    html: function (c) {
      return "<h4>Event Phase (Epilogue)</h4><ol><li><b>Time Track</b> — move the Shuttle Time marker 1 space (and the Self-Destruct marker if active).</li><li><b>Alert check</b> (turns 3 and 5 only) — verify the current Alert's requirements; then reveal the second Alert if it's turn 3. A failed Alert ends the game in defeat for everyone.</li><li><b>Intruder Attack</b>.</li><li><b>Fire Damage</b>.</li><li><b>Resolve 1 Event card</b> — Intruder Movement, Event Effect, and a Noise roll if the card shows the Alert icon.</li><li><i>No bag development in the Epilogue.</i></li></ol><p>After Turn 5 the Shuttle leaves regardless of who is aboard.</p><h4>Victory — all four required</h4><ol><li>All Aftermath Exploration tokens on the Nemesis revealed (2-player game: up to 3 may remain). Fail = everyone loses.</li><li>Your <b>Personal Requirement</b> fulfilled.</li><li>Your Character on the Shuttle when it departs (or escaped by Pod).</li><li>Pass the Contamination check (as in the base game).</li></ol><p><b>Or betray them:</b> take the <b>Lucrative Offer</b> at any time, discarding your Personal Requirement — fulfilling the Offer's requirements wins automatically if you survive the Contamination check. FAQ: the Offer ignores the exploration-token and Alert requirements. The Epilogue also discards Heavy Objects dropped when a Character dies.</p>";
    },
    src: "Aftermath p.6 · FAQ v2.2 p.5"
  },
  {
    id: "actions",
    title: "Actions & Crafting",
    when: function (c) { return true; },
    html: function (c) {
      var extra = "";
      if (c.race === "carno") extra = "<h4>Mutation Action (Carnomorphs)</h4><p>Scan 1 Contamination card from your hand and place 1 Mutation marker on your Character board to activate your hidden Mutation card's power. Your 4th Mutation marker kills you — a Shambler and your Corpse appear in your Room.</p>";
      if (c.mode === "research" || c.mode === "epilogue") extra += "<h4>Activation Action (Aftermath)</h4><p>Cost 1 card, only in the Room specified by the current Alert, usable in or out of Combat. Its only effect is fulfilling the Alert task.</p>";
      return "<p>You cannot discard Contamination cards to pay Action costs. Passing is itself what ends your participation for the round — you may discard any cards when you pass.</p><ul><li><b>Basic Actions (cost 1 card)</b>: Move · Shoot · Melee Attack · Pick Up a Heavy Object · Trade (both in the same Room, out of Combat; FAQ: a trade cannot be empty — something must change hands) · Craft an Item.</li><li><b>Careful Movement (cost 2 cards)</b>: move without rolling the Noise die — instead <i>you choose</i> which Corridor connected to your destination gets the Noise marker. Not possible in Combat, nor when every connected Corridor already has a marker. FAQ: it cancels Danger/Silence Exploration-token effects on entry.</li><li><b>Action cards</b>: discard the card + its printed cost in other cards.</li><li><b>Room Actions (cost 2 cards)</b>: only in your current Room, never in Combat, never with a Malfunction marker.</li><li><b>Item Actions</b>: discard the cards shown; One-Use-Only Items are also discarded.</li></ul><h4>Crafting (Basic Action)</h4><p>Discard 2 Items whose <b>blue Component symbols match</b> the Crafted Item's requirements to gain: <b>Antidote, Taser, Flamethrower or Molotov Cocktail</b>. FAQ: a crafted Flamethrower arrives fully loaded." + (c.mod("aftrooms") ? " In the Crafting Room you can also exchange Energy Charge → Laser Pointer, Tools → Combat Drone, Clothes → Enviro-Suit." : "") + "</p><h4>Quest Items</h4><p>Your 2 Quest Items start as quests (horizontal). Completing the printed mini-quest activates them. FAQ: activating one is a Basic Action that cannot be performed in Combat.</p>" + extra;
    },
    src: function (c) { return "Base p.12-13, 23 · FAQ v2.2 p.2-4" + (c.race === "carno" ? " · Carno p.4" : "") + ((c.mode === "research" || c.mode === "epilogue") ? " · Aftermath p.5" : ""); }
  },
  {
    id: "movement",
    title: "Movement, Noise & Encounters",
    when: function (c) { return true; },
    html: function (c) {
      if (c.race === "void") {
        return "<h4>Noise & movement</h4><p>Move into an explored, empty Room → roll the Noise die: on 1-4 place a Noise marker in the matching Corridor (if it already has one → <b>Encounter</b>); Danger → place a Noise marker in <i>every</i> Corridor connected to your Room (all full → Encounter); Silence → nothing. There are <b>no Slime rules</b> with Void Seeders — ignore Slime markers entirely.</p><h4>Encounter (Void Seeders)</h4><ol><li>Discard all Noise markers around the Room.</li><li>Draw 1 token from the bag:<ul><li><b>Void Seeder token</b> — check the <b>Insanity level of the triggering Character</b> and place the matching type: Lurker (low) / Whisperer / Stalker / Despoiler (Insanity 5). No mini of that type left → place the next lower type. If your hand has fewer cards than the token's number → <b>Surprise Attack</b>: gain 1 Contamination card and resolve a <b>Panic card</b> (not an Attack card). Set the token aside.</li><li><b>Insanity token</b> — place a Noise marker in each connected Corridor; the triggering Character resolves a Panic card (any color); return the token.</li><li><b>Blank</b> — Noise marker in each connected Corridor; return it.</li></ul></li></ol><p>Void Seeders <b>ignore Closed Doors</b> when moving. Entering a Room with a Void Seeder = Combat, no Encounter. Lairs: see their own section.</p>";
      }
      var carno = c.race === "carno" ? "<p><b>Carnomorph Encounter changes:</b> a Blank token drawn in an Encounter places a Noise marker in each connected Corridor, and if it was the last token in the bag, add 1 Metagorger token. A Metagorger that lands a Surprise Attack still counts as the First Encounter — choose Objectives.</p>" : "";
      return "<h4>Moving</h4><ol><li>Move to a neighboring Room through a Corridor (Closed Door = blocked).</li><li>Unexplored Room: flip the tile, reveal and resolve its <b>Exploration token</b> — set the Item counter to its number, then apply its effect: <i>Silence</i> (nothing; Slimed Characters treat it as Danger) · <i>Danger</i> (see below) · <i>Slime</i> (you're Slimed) · <i>Fire / Malfunction</i> (place the marker) · <i>Doors</i> (Door token in the Corridor you entered by). Then Noise roll if nobody's there.</li><li>Explored, empty Room: perform a <b>Noise roll</b>. Entering a Room with any Character or Intruder = no roll.</li></ol><h4>Noise roll</h4><ul><li><b>1-4</b> — place a Noise marker in the Corridor with that number connected to your Room (Technical Corridors count if there's an Entrance). If there is already a Noise marker there → <b>Encounter</b>.</li><li><b>Danger</b> — if any Intruder is in a neighboring Room and not in Combat, it moves into your Room (all eligible Intruders move, respecting Closed Doors). Otherwise, place a Noise marker in every connected Corridor that doesn't already have one. FAQ: all Corridors already noisy = nothing happens.</li><li><b>Silence</b> — nothing. But if you carry a <b>Slime marker</b>, treat Silence as Danger.</li><li>A Corridor never holds more than 1 Noise marker; placing onto an existing marker = Encounter.</li></ul><h4>Encounter</h4><ol><li>Discard all Noise markers from Corridors connected to the Room (Technical Corridors included if there's an entrance).</li><li>Draw 1 Intruder token from the bag and place that Intruder in the Room (Blank: see below).</li><li>Compare the number on the token with your hand size (Contamination cards count) — fewer cards than the number = <b>Surprise Attack</b>: draw and resolve an Intruder Attack card.</li></ol><p>Blank token in an Encounter: place a Noise marker in each connected Corridor; if it was the last token in the bag, add 1 Adult token. Entering a Room already containing an Intruder never triggers an Encounter — you are simply <b>in Combat</b>.</p>" + carno + "<h4>Escape from Combat (Move, cost 1)</h4><p>Choose a neighboring Room, then draw 1 Intruder Attack card per Intruder in your Room (largest first — FAQ). Survive and you move, resolving the new Room as usual. FAQ: retreating an Intruder into a Closed Door destroys the Door and the Intruder stays.</p>";
    },
    src: function (c) { return c.race === "void" ? "Void p.5-6 · Base p.14-17" : "Base p.14-19 · FAQ v2.2 p.2-3" + (c.race === "carno" ? " · Carno p.6" : ""); }
  },
  {
    id: "combat",
    title: "Combat & " + "Enemy Injuries",
    when: function (c) { return true; },
    html: function (c) {
      var shoot = "<h4>Shoot (cost 1)</h4><ol><li>Choose a Weapon with Ammo and a target in your Room; discard 1 Ammo.</li><li>Roll the Combat die — one face misses; one face injures only a Larva or Creeper; one face injures a Larva, Creeper or Adult; one face deals 1 Injury to anything; one face deals 2 Injuries to anything.</li><li>On a hit: place Injury markers, then check the Injury Effect (below). Weapon cards can modify all of this.</li></ol>";
      var melee = "<h4>Melee Attack (cost 1)</h4><ol><li><b>Draw 1 Contamination card first.</b></li><li>Roll the Combat die — a double-hit result counts as 1 Injury in melee.</li><li>Hit: apply the Injury and check the Injury Effect. Miss: you suffer 1 Serious Wound.</li></ol>";
      var inj;
      if (c.race === "carno") inj = "<h4>Carnomorph Injuries & death</h4><ul><li>Injure any Carnomorph → draw 1 Attack card; it shows two numbers — one for Metagorgers, one for every other type. Number ≤ current Injuries = killed.</li><li><b>Metagorger / Shambler</b> killed — leave an Intruder Carcass.</li><li><b>Fleshbeast</b> killed — leave a Carcass <i>and</i> a Shambler.</li><li><b>Butcher</b> killed — leave <b>2 Shamblers</b>; the Butcher never returns (box it).</li><li><b>Metagorger Attack</b> — instead of an Attack card, the target gains 1 Mutation card + 1 Contamination + 1 Light Wound (already mutated: no new Mutation card); add a Shambler token to the bag and remove the Metagorger from the board.</li><li><b>Adaptations</b> — each revealed Adaptation strengthens the race; discard one from the game by analyzing the matching Object in the Laboratory (once its miniature has left the card).</li></ul>";
      else if (c.race === "void") inj = "<h4>Void Seeder Injuries & death</h4><ul><li><b>Lurker</b> — draw 2 Attack cards, use the <i>lower</i> blood number; a Retreat icon on either card = it retreats.</li><li><b>Whisperer</b> — draw 1 Attack card, standard check.</li><li><b>Stalker</b> — draw 2 Attack cards, use the <i>higher</i> number; Retreat icon = retreats.</li><li><b>Despoiler</b> — cannot be injured at all. It dies only when all 3 Lairs are destroyed. When it should suffer an Injury, draw 1 Attack card — it may still Retreat.</li><li>Defeated Void Seeders leave <b>no Carcass</b> — remove the miniature and add a random Void Seeder token to the bag.</li><li><b>Surprise Attacks</b> (all types): the target gains 1 Contamination card and resolves a Panic card.</li></ul>";
      else inj = "<h4>Intruder Injuries & death</h4><ul><li><b>Larva / Egg</b> — 1 Injury kills.</li><li><b>Creeper / Adult</b> — draw 1 Attack card; blood number ≤ current Injuries = dead, leaving an Intruder Carcass.</li><li><b>Breeder / Queen</b> — draw 2 Attack cards and <b>add</b> their blood values; compare the total the same way.</li><li><b>Retreat arrow</b> on a drawn card — the Intruder flees through the Corridor number of a drawn Event card, keeping its Injuries (Injuries are lost if it retreats into Technical Corridors).</li><li><b>Larva Attack</b> — no Attack card: the Larva leaves the board onto your Character board (if it's empty) and you gain 1 Contamination card. FAQ: if you already carry a Larva you just gain the Contamination card.</li><li><b>Intruder Attacks</b> target the Character with the fewest cards in hand (tie → First Player token / turn order). A card matching the attacker's symbol hits; otherwise it misses.</li><li><b>Weaknesses</b> — research a Character Corpse, Egg or Carcass in the Laboratory to flip the matching Weakness card; its rule then helps everyone. FAQ: “Vulnerability to fire” adds +1 Injury per Fire instance.</li></ul>";
      return shoot + melee + inj;
    },
    src: function (c) { return c.race === "carno" ? "Base p.18-19 · Carno p.5" : (c.race === "void" ? "Base p.18-19 · Void p.5" : "Base p.18-21 · FAQ v2.2 p.2-3"); }
  },
  {
    id: "lairs",
    title: "Lairs & the Insanity System",
    when: function (c) { return c.race === "void"; },
    html: function (c) {
      return "<h4>Insanity track (1-5)</h4><ul><li>Every Character starts at 1. The arrows are one-way from level 3: <b>once you reach 3 you can never go below 3</b>.</li><li>Insanity 5 + told to increase again = <b>death</b>.</li><li>The Encounter type you trigger depends on your level: low = Lurker … 5 = Despoiler.</li></ul><h4>Panic cards</h4><ul><li>Draw 1; compare its printed Insanity value with yours. <b>Your level lower than the card (or the effect impossible)</b> → raise Insanity by 1. Otherwise resolve the effect.</li><li>Another Character in your Room may play an <b>Interruption</b> to cancel the effect — no Insanity raise either.</li></ul><h4>Reducing Insanity</h4><ul><li><b>Rest / Shower Room / Canteen</b> — reduce your level by 1 and/or Scan Contamination cards from hand.</li><li><b>Antidote / Surgery</b> — set your Insanity to 3 (instead of removing a Larva).</li><li>An <b>INFECTED</b> scan result sets you straight to Insanity 5 (already at 5: nothing more happens).</li><li><b>Laboratory</b> — analyze a Character with Insanity 3+ in the Room (instead of a Corpse) to discover Void Seeder Weaknesses.</li></ul><h4>Lairs</h4><ul><li>Placed by the 3 Lair Exploration tokens (no Noise roll for that movement). A Character in a Room with a Lair is <b>in Combat</b>, and ending any round there forces a Noise roll — the only Noise roll made while in Combat.</li><li>Lairs never move. To hit one you need a <b>4+ style roll</b> (the two highest Combat-die results). When injured, draw 2 Attack cards and compare total Injuries to the <b>higher</b> blood value; any Retreat icon = the Lair survives.</li><li>A destroyed Lair leaves an <b>Intruder Carcass</b> (the only source of Carcasses in this expansion) — place its miniature on a Destroyed Lair slot of the Void Seeder board.</li><li>All 3 Lairs destroyed = <b>the Despoiler is killed</b> (removed immediately if on the board).</li><li>The Emergency Airlock procedure can also destroy Lairs.</li></ul>";
    },
    src: "Void p.4-6"
  },
  {
    id: "mutations",
    title: "Mutations & Feeding",
    when: function (c) { return c.race === "carno"; },
    html: function (c) {
      return "<h4>Character Mutation cards</h4><ul><li>When instructed to draw a Mutation card: draw 2, keep 1, shuffle the other back. Keep it <b>face down</b> — hidden until you first use its Mutation Action. A second Mutation card is never gained.</li><li><b>Mutation markers</b>: told to gain one without having a Mutation card → gain the card instead. With a card → place a marker on your board's Larva space. Your <b>4th marker kills you</b> — place a Shambler and your Corpse in your Room.</li><li><b>Mutation Action</b>: Scan a Contamination card from your hand + place 1 Mutation marker to trigger your card's power.</li></ul><h4>Feeding (Intruder Attack step)</h4><p>Each Carnomorph <b>not in Combat</b> in a Room with a Heavy Object (Corpse/Egg/Carcass) and/or a Metagorger Feeds. Multiple Carnomorphs feed in priority order Butcher → Fleshbeast → Shambler → Metagorger:</p><ol><li><b>Heal</b> — remove all its Injury markers.</li><li><b>Evolve</b> — replace with the next level: Metagorger → Shambler → Fleshbeast → Butcher (no mini available or Butcher = no evolution).</li><li><b>Eat</b> — remove one food item, priority: red Character Corpse → Intruder Egg → Intruder Carcass → Metagorger → <b>blue Character Corpse</b> (yes, the blue corpse can disappear, breaking an Objective!).</li></ol><p>Carnomorphs in the Nest each consume 1 Egg from the Carnomorph board during this step. If the Voracious Adaptation is revealed, Feeding happens <i>before</i> attacks.</p><h4>Adaptations</h4><p>Revealed when their type first appears; they strengthen the race and apply to <b>all Carnomorph types</b> (FAQ). Remove one from the game by analyzing the matching Object in the Laboratory.</p>";
    },
    src: "Carno p.4-8 · FAQ v2.2 p.6"
  },
  {
    id: "wounds",
    title: "Wounds, Contamination & Infection",
    when: function (c) { return true; },
    html: function (c) {
      var infest;
      if (c.race === "carno") infest = "<h4>Contamination & Mutation</h4><p>Contamination cards go on your Action discard pile, clog your hand, and can't pay costs. Scanning works as usual — but exposure to Carnomorphs mutates you rather than implanting Larvae (see Mutations & Feeding).</p>";
      else if (c.race === "void") infest = "<h4>Contamination & Insanity</h4><p>Contamination cards go on your Action discard pile, clog your hand, and can't pay costs. An INFECTED scan result sets your Insanity to 5 instead of placing a Larva. No Larvae, no Slime in this expansion.</p>";
      else infest = "<h4>Contamination & Infection</h4><ul><li>Contamination cards go on top of your Action discard pile; they sit in your hand as dead cards, can't pay costs, and may be discarded when Passing.</li><li><b>Scanning</b> (Rest, Canteen, Shower, Surgery, Antidote…): use the Scanner's red foil. Not infected → the procedure usually removes the card. <b>INFECTED</b> → a Larva lands on your Character board (the card stays!).</li><li>Already carrying a Larva and infected again → <b>death</b>, and a Creeper appears in your Room. FAQ: multiple INFECTED results in a single scan don't stack a second Larva — a Rest scan can't kill you if you had no Larva before it.</li><li>Surgery Room removes the Larva; the Antidote Item also removes it.</li></ul>";
      return "<h4>Character Wounds</h4><ul><li><b>Light Wounds</b> track down your board; the 3rd converts into a Serious Wound.</li><li><b>Serious Wounds</b> — draw a card; its effect persists. Duplicates don't stack effects. FAQ: a “Hand” Serious Wound doesn't affect Shooting.</li><li>3 Serious Wounds + any further Wound = <b>death</b>. Your Corpse and Heavy Objects drop in the Room; other Items leave the game" + (c.mode === "coop" ? " — <b>except in co-op</b>, where the FAQ rules that only Heavy Objects drop and Items stay in your inventory, ready for an Emergency Room AutoDoc revival (see Winning section)" : "") + ".</li><li><b>Dress</b> a Serious Wound: flip it — effect ignored but still counts toward the limit of 3. <b>Heal</b>: remove a Light Wound or discard a Dressed Serious Wound (Clothes, Bandages, Medkit, Emergency Room…).</li></ul>" + infest;
    },
    src: function (c) { return "Base p.19-21 · FAQ v2.2 p.2-4" + (c.race === "void" ? " · Void p.6" : "") + (c.race === "carno" ? " · Carno p.4" : ""); }
  },
  {
    id: "rooms",
    title: "Room Reference",
    when: function (c) { return true; },
    html: function (c) {
      var voidNotes = c.race === "void" ? "<p class='fnote'>Void Seeders: the Shower Room and Canteen also reduce Insanity by 1; Surgery sets Insanity to 3; the Laboratory analyzes a living Character with Insanity 3+ instead of a Corpse; ignore all Slime rules.</p>" : "";
      var aft = (c.mod("aftrooms") || c.mode === "research" || c.mode === "epilogue") ? "<h4>Aftermath Rooms “2”</h4><ul><li><b>Crafting Room</b> — Craft one of the special Items: Energy Charge → Laser Pointer, Tools → Combat Drone, Clothes → Enviro-Suit.</li><li><b>Server Room</b> — use the Room Action of any discovered, working Room with a Computer.</li><li><b>Alarm Room</b> — perform a Noise roll for any 1 Room without a Character in it.</li><li><b>Turret Room</b> — change the Status of any 1 Turret on the board (new Status goes face down on top of its pile).</li></ul>" : "";
      return "<p>Room Actions cost 2 cards — never in Combat, never with a Malfunction marker. A Computer symbol matters only when a rule refers to it (Malfunction = no Computer). FAQ: Intruders may enter unexplored Rooms (resolve the tile without a Noise roll).</p><h4>Basic Rooms “1” — all 11 in every game</h4><ul><li><b>Armory</b> — add 2 Ammo to 1 of your Energy Weapons (not Classic Weapons).</li><li><b>Comms Room</b> — place a Signal marker on your board (needed by some Objectives; FAQ: the Signal is individual — it counts only for the Character who sent it).</li><li><b>Emergency Room</b> — Dress all your Serious Wounds OR Heal 1 Dressed Serious Wound OR Heal all Light Wounds.</li><li><b>Generator</b> — start or stop the <b>Self-Destruct sequence</b>. On yellow it can't be aborted and unlocks all Pods; on the skull the ship explodes. You can't start it once anyone hibernates.</li><li><b>Fire Control System</b> — pick any Room: discard its Fire marker (if any) and every Intruder there flees in a random Event-card direction.</li><li><b>Laboratory</b> — analyze a Character Corpse, Carcass or Egg present in the Room to reveal the matching Weakness card (the Object survives).</li><li><b>Nest</b> — take 1 Egg from the Intruder board, then Noise roll. No Eggs left = the Nest is destroyed. Destroying uncarried Eggs works like a Shoot/Melee (each Injury = 1 Egg; melee-miss harmless; Grenade 2, Molotov 1; Noise roll after every attempt). FAQ: Eggs on the Intruder board are “in the Nest”, and Fire there destroys 1 per turn.</li><li><b>Storage</b> — draw 2 Items from a chosen colored deck, keep 1, bottom the other.</li><li><b>Surgery</b> — Scan ALL your Contamination cards, remove all Infected ones, remove your Larva" + (c.race === "void" ? " (set Insanity to 3 instead)" : "") + "; then suffer 1 Light Wound, reshuffle everything into a new Action deck and automatically pass.</li><li><b>Evacuation Section A / B</b> — try to enter an unlocked Escape Pod in that Section (Noise roll first; an Intruder appearing or already present = failure).</li></ul><h4>Additional Rooms “2” — 5 of 9 each game</h4><ul><li><b>Airlock Control</b> — Emergency Depressurisation: pick another Yellow Room with no destroyed Doors, close all its Doors; if they all stay closed to the end of the Player Phase, everything inside dies and Fire is extinguished.</li><li><b>Cabins</b> — at the start of a round there (no Intruders/Malfunction): draw up to 6 cards instead of 5.</li><li><b>Canteen</b> — Heal 1 Light Wound; optionally Scan hand Contamination cards, removing non-Infected ones" + (c.race === "intruders" ? " (an Infected one = Larva!)" : "") + ".</li><li><b>Command Center</b> — open/close any Doors around any 1 Room, your choice which.</li><li><b>Engine Control Room</b> — check (not change) the status of all 3 Engines, even if the Engine Rooms have Malfunctions.</li><li><b>Hatch Control System</b> — flip 1 Escape Pod token Locked/Unlocked.</li><li><b>Monitoring Room</b> — secretly peek at any 1 unexplored Room tile and its Exploration token; you may lie.</li><li><b>Room covered with Slime</b> — entering it Slimes you (before the Exploration token); no Searching.</li><li><b>Shower Room</b> — discard your Slime marker; optionally Scan hand Contamination cards (non-Infected removed).</li></ul><h4>Special Rooms — printed on the board, pre-explored, no Search</h4><ul><li><b>Cockpit</b> — Check Coordinates (peek secretly, may lie) OR Set Destination (never with an Intruder in the Cockpit; never once anyone hibernates).</li><li><b>Engines 1-3</b> — check the top Engine token secretly; with a Repairs Action card or Tools you may Repair/Break: inspect both tokens and reorder them (say IF you changed the order, not what's true). Works even with a Malfunction.</li><li><b>Hibernatorium</b> — hibernate when the Time marker is on blue: Noise roll, and if no Intruder appears you leave the board safely (fate decided at game end).</li></ul>" + aft + voidNotes;
    },
    src: function (c) { return "Base p.24-26 · FAQ v2.2 p.2-4" + ((c.mod("aftrooms") || c.mode === "research" || c.mode === "epilogue") ? " · Aftermath p.5" : ""); }
  },
  {
    id: "turrets",
    title: "Turrets",
    when: function (c) { return c.mod("turrets") || c.mode === "research" || c.mode === "epilogue"; },
    html: function (c) {
      return "<ul><li>A Turret is placed in the Room where its Exploration token is revealed — never in the Nest or a Room covered with Slime.</li><li>Its 3 Status tokens are shuffled and stacked face down next to it; the <b>topmost token is its current status</b>, revealed when the Room is first entered: <b>Inactive</b> (can't even be destroyed) · <b>Target: All</b> (shoots everything entering the Room this turn — Characters take 1 Light Wound, Intruders 1 Injury, resolved during the Fire Damage step; spawning in the Room counts as entering) · <b>Target: Intruders</b> (as above, Intruders only).</li><li>The <b>Turret Room</b> action changes any 1 Turret's status (new status face down on top of its pile).</li><li>During the Fire Damage step, Intruders always destroy any active Turret in their Room — simultaneously with the Turret's shooting, so mutual destruction is possible. “Ignoring the Fire Damage step” doesn't apply to Turrets.</li><li>Turrets can also be destroyed with a Demolition Action; destroyed Turrets leave the board.</li></ul>";
    },
    src: "Aftermath p.5"
  },
  {
    id: "pods",
    title: "Escape Pods, Fire, Malfunctions & Doors",
    when: function (c) { return true; },
    html: function (c) {
      return "<h4>Escape Pods</h4><ul><li>All Pods start Locked. Unlock manually (Items, Hatch Control) or automatically when the first Character dies or Self-Destruct reaches yellow.</li><li>Enter via the Evacuation Section Room (Noise roll; an Intruder in the Room or appearing = failure; a Malfunction in the Section does NOT block entry — FAQ). Each Pod holds 2; Heavy Objects don't take a space.</li><li>Inside you may <b>launch immediately or wait</b>. Waiting: you may launch at the start of your first turn each Player Phase — otherwise you pass automatically; you may also step back out freely. An Intruder appearing in the Section Room dumps everyone back out of unlaunched Pods.</li><li>Launching removes you from the game; you always count as reaching Earth (checks still apply at game end).</li></ul><h4>Fire</h4><ul><li>End your turn in a burning Room = 1 Light Wound (once per round, at the end of your own turn). Intruders there take 1 Injury in the Fire Damage step.</li><li>1 Fire marker max per Room. There are only <b>8 Fire markers</b> — told to place a 9th, the ship explodes and the game ends. FAQ: Fire spreading into an Open Corridor does nothing.</li></ul><h4>Malfunctions</h4><ul><li>A Malfunction marker blocks the Room Action and its Computer (Search still works; Engine status is unaffected). Repair with a Repairs Action / Tools.</li><li>Never placed in the Nest or the Room Covered with Slime; 1 max per Room. There are only <b>8 Malfunction markers</b> — a 9th means the hull fails and everyone dies.</li></ul><h4>Doors</h4><ul><li>Closed Doors block Character and Intruder movement through that Corridor (and Grenade throws). An Intruder “moving” into a Closed Door destroys it instead and stays put. Destroyed Doors (lying token) leave the Corridor permanently open — only the Mechanic’s Plasma Torch can re-close one. Doors are ignored during Encounters and never placed in Technical Corridors.</li></ul><h4>Technical Corridors</h4><ul><li>Characters can’t use them (exceptions: the Mechanic’s Technical Corridors Action card and the Technical Corridor Plans Item); otherwise they behave like normal Corridors. A Noise result pointing at a Technical Corridors Entrance puts the marker on the shared Technical Corridors space — which counts as being at <i>every</i> Entrance on the board.</li><li>An Intruder moving into a Technical Corridors Entrance vanishes into the ducts: discard its Injuries, return its token to the bag, remove the miniature.</li></ul>";
    },
    src: "Base p.14-17, 24-26 · FAQ v2.2 p.2-3"
  },
  {
    id: "faq",
    title: "Key FAQ Rulings (v2.2)",
    when: function (c) { return true; },
    html: function (c) {
      var race = "";
      if (c.race === "carno") race = "<li>The Blank-token help card is correct: the Blank <i>returns to the bag</i> after resolving its bag-development effect.</li><li>Adaptations apply to all Carnomorph types, not just the one pictured.</li><li>Agile Adaptation + a crosshair roll: the crosshair no longer auto-hits — it's a miss unless your total beats the requirement.</li>";
      if (c.race === "void") race = "<li>The Void Seeders help sheet conflicts with itself — <b>page 5 of the rulebook is correct</b>: a Surprise Attack gives 1 Contamination card and a Panic card.</li><li>Playing with Turrets: exchange Exploration tokens for Turrets <i>after</i> setting Lairs aside so all 3 Lair tokens stay in the pool.</li>";
      var aft = c.has("aftermath") ? "<li>There are 6 blue “crafted” Items in Aftermath, not 9 — the rulebook errata.</li><li>Laika: never gets Slimed, counts as a Character for Noise rolls she triggers, and is called back to the Bounty Hunter when an Encounter starts.</li><li>The CEO's Robot cannot be recharged in the Armory (it isn't an Energy Weapon).</li><li>The Android's Trait: scan Contamination cards immediately when drawn, remove them, and draw a replacement card.</li>" : "";
      return "<ul><li><b>Pass is an action of its own</b> — you are never forced to auto-pass just because your hand is empty; you pass on your turn.</li><li>Escaping from a Room with several Intruders = 1 Attack card per Intruder, largest first.</li><li>Noise-roll “Danger” with every Corridor already noisy = nothing happens (Encounters need a marker to be doubled).</li><li>Search: when you decline cards they go to the <b>bottom</b> of the deck.</li><li><b>Full Auto</b>: remove all the Weapon’s Ammo, make a single Shoot — total Injuries = the Shoot result + half the discarded Ammo (rounded down) + 1 for the Assault Rifle’s bonus.</li><li>You may play an Interruption card even after you have Passed.</li><li>Intruders can enter unexplored Rooms — flip the tile; no token resolution.</li><li>Hibernated Characters are immune to everything except the ship being destroyed.</li>" + aft + race + "</ul>";
    },
    src: "FAQ v2.2 p.2-6"
  },
  {
    id: "intplayer",
    title: "Playing as the Intruder",
    when: function (c) { return c.mod("intruderplayer"); },
    html: function (c) {
      return "<ul><li>The first player whose Character dies removes their Character components and takes the shuffled <b>Intruder Player Action deck</b>; the change starts at the next Player Phase.</li><li><b>Player Phase</b>: they draw 3 cards (max hand 4), never hold the First Player token, and each turn play 1 card or pass (keeping up to 1 card when passing). A played card does one of:<ol><li><b>Move</b> — move any Intruder through the Corridor number printed on the card (Technical Corridors per standard rules).</li><li><b>Attack</b> — pick an Intruder in a Room with a Character; draw Attack cards equal to the card's number, choose 1 to resolve against a Character of their choice.</li><li><b>Effect</b> — resolve the card's text.</li></ol></li><li><b>Event Phase</b>: only the Time Track and Fire Damage happen. Intruders make no end-of-round attacks (Surprise Attacks still work), no Event cards, no bag development.</li><li>The Intruder player can't win — they're just making sure you don't.</li></ul>";
    },
    src: "Base p.27"
  }
];

/* ---- TEACHING SCRIPT (read aloud, ~5 min; content per the base rulebook,
   the race/Aftermath rulebooks and FAQ v2.2 — see references) --------------- */
NM.teach = {
  intro: "Read this aloud — about five minutes. Nobody touches the bag.",
  sections: [
    { h: "The pitch — and how you win", body: (c) => {
      const foe = c.race === "carno" ? "Carnomorphs" : c.race === "void" ? "Void Seeders" : "Intruders";
      if (c.mode === "coop") return `
<p>We wake from hibernation on a broken ship, and something is aboard: the <b>${foe}</b>. This is the fully co-op game: our objectives are public, <b>all</b> of them must be completed, and at least one of us has to live. Surviving means <b>hibernating</b> while the ship makes its jump, or launching in an <b>escape pod</b> — and then surviving the end-of-game checks: working engines, the right destination, and whatever's incubating in your chest.</p>`;
      if (c.mode === "solo") return `
<p>You wake alone on a broken ship, and something is aboard: the <b>${foe}</b>. You hold two objectives; the first time you meet one of them, you keep one and burn the other. Win by completing it and surviving — <b>hibernate</b> while the ship jumps home, or take an <b>escape pod</b> — then pass the end-of-game checks: engines, destination, and whatever's incubating in your chest.</p>`;
      return `
<p>We wake from hibernation on a broken ship. The crew is dead, something is aboard — the <b>${foe}</b> — and each of us holds <b>two secret objectives</b>. When the first monster shows itself, everyone silently keeps one objective and burns the other. You win alone: complete <b>your</b> objective and survive. Several of us can win. All of us can die.</p>
<p>Surviving means <b>hibernating</b> while the ship jumps home or launching in an <b>escape pod</b> — and then passing the end-of-game checks: at least two working <b>engines</b>, the right <b>destination</b>, and a clean <b>contamination scan</b>. Read that again: helping the ship helps everyone, and someone's objective may need you dead.</p>`;
    }},

    { h: "The shape of a round", body: (c) => `
<p>Each round, everyone takes turns of <b>two actions</b> — cards from your hand pay for everything — until we've all passed. Then the ship gets its turn, the <b>Event phase</b>: time ticks (and the self-destruct, if someone lit it), monsters attack whoever they're with, fires burn, an Event card moves them through the corridors, and the <b>bag develops</b> — the infestation literally grows while we argue.</p>` },

    { h: "Noise — the heart of the game", body: (c) => {
      if (c.race === "void") return `
<p>Movement is the scary part. Enter an empty room and roll the <b>noise die</b>, placing a noise marker in one of the corridors — and if that corridor already had one, it's an <b>encounter</b>: draw from the bag, and what comes out depends on <b>your Insanity</b>. If your hand is thin, it gets a free hit — a contamination card and a <b>Panic card</b>. Move carefully (two cards) to place noise where you choose. Every step is a bet.</p>`;
      return `
<p>Movement is the scary part. Enter an empty room and roll the <b>noise die</b>, placing a noise marker in a corridor — and if that corridor already had one, it's an <b>encounter</b>: something crawls out of the bag right on top of you, and if your hand is thin it attacks before you can blink. Move <b>carefully</b> for two cards to place the noise where you choose. The whole game is this: every step is a bet, and a quiet ship is a lie.</p>`;
    }},

    { h: "Fighting, wounds & what's in your chest", body: (c) => {
      const race = c.race === "carno"
        ? "Wounds stack until they kill; <b>Metagorger hits mutate you</b> — four mutation markers and you burst. And they <b>feed</b>: any corpse, egg or carcass left lying around heals them and evolves them into something bigger. Clean up your dead."
        : c.race === "void"
        ? "Wounds stack until they kill — but the real track is <b>Insanity</b>: it only ratchets up past 3, and at 5 you're one bad moment from gone. Rest, showers and the canteen calm you; an INFECTED scan maxes you instantly."
        : "Serious wounds stack until they kill, and <b>contamination cards</b> silently fill your deck. Scan them when you can: an <b>INFECTED</b> result plants a larva in you — the surgery room can cut it out; ignoring it is how you die at the finish line.";
      return `
<p>Shooting costs ammo and is loud in spirit; <b>melee is free and desperate</b> — you draw a contamination card just for trying, and a miss costs a serious wound. You never know a monster's exact health: hits raise the odds it dies, never a promise.</p>
<p>${race}</p>`;
    }},

    { h: "The ship is a character", body: (c) => `
<p>Rooms are actions: repair <b>engines</b>, check the <b>cockpit's coordinates</b> — the ship may be aimed somewhere nobody wants — patch fires and malfunctions before they hit their limits (nine of either and the ship is gone), and if it all goes wrong, the <b>generator</b> starts the self-destruct. Watch the <b>critical moments</b>: the first death unlocks the escape pods, the blue time-track spaces open hibernation, and a yellow self-destruct can't be stopped.</p>` },

    { h: "Aftermath on the table", when: (c) => c.has("aftermath") && (c.mode === "standard" || c.mode === "solo" || c.mode === "coop") && (c.mod("traits") || c.mod("aftrooms") || c.mod("turrets") || c.mod("hourglass") || c.mod("altboard") || true), body: (c) => {
      const bits = ["five new <b>Characters</b> join the draft — each color offers a base-game or Aftermath face (never the Convict and the Soldier together)"];
      if (c.mod("traits")) bits.push("everyone plays with their <b>Trait card</b> — a permanent personal rule, faceup from the start");
      if (c.mod("aftrooms")) bits.push("four <b>Aftermath rooms</b> are shuffled into the ship, including the Crafting Room and its exclusive gadgets");
      if (c.mod("turrets")) bits.push("<b>Turrets</b> hide among the exploration tokens — automated guns that shoot whatever walks in, friend or fang");
      if (c.mod("hourglass")) bits.push("the <b>hourglass</b> is running: when it empties, anyone may grab it and force a noise roll in any room — real-time dread");
      return `<p>Aftermath is in play: ${bits.join("; ")}.</p>`;
    }},

    { h: "The alternative map", when: (c) => c.mod("altboard"), body: () => `
<p>We're on the <b>alternative side of the board</b> — a harder ship: the red and blue <b>technical corridors are separate networks</b>, and some rooms connect by twin corridors where one closed door doesn't cover the pair. Your mental map from past games will lie to you.</p>` },

    { h: "Playing as the Intruder", when: (c) => c.mod("intruderplayer"), body: () => `
<p>One consolation prize: the <b>first player to die</b> takes over the monsters — one card a turn to move them, attack with them, or spring their tricks. They can't win. They can absolutely make sure you don't.</p>` },

    { h: "This mode's twist", when: (c) => c.mode === "epilogue" || c.mode === "research", body: (c) => c.mode === "epilogue" ? `
<p>This is the <b>Epilogue</b>: we're the rescue crew boarding the same ship, five turns on the clock. Reveal every Aftermath token on the ship, satisfy your <b>Personal Requirement</b>, be on the Shuttle when it leaves, and pass the scan — or grab the <b>Lucrative Offer</b> and sell everyone out.</p>` : `
<p>This is a <b>Research Mission</b>: a standalone game with the Shuttle docked alongside, a hotter Intruder bag, and <b>Alerts</b> — timed side-missions from the Event deck with a five-turn fuse. Fail one and everyone dies, so treat Alerts as the priority the moment they appear.</p>` },

    { h: "Don't worry about these yet", body: (c) => {
      const later = ["the full room list (it's on this page)", "weakness research", "crafting recipes"];
      if (c.race === "carno") later.push("Adaptation cards");
      if (c.race === "void") later.push("the Lairs");
      if (c.mod("turrets")) later.push("turret statuses");
      return `<p>I'll explain ${later.join(", ")} when they matter. Opening advice: keep your hand fat — your cards are actions, currency <i>and</i> armor against surprise attacks — and never, ever assume the room next door is empty.</p>`;
    }}
  ]
};
