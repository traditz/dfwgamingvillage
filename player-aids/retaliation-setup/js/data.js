/* =============================================================================
   Nemesis: Retaliation — Setup & Reference Utility · game data
   Sources: Retaliation rulebook (40p), Contractors rules sheet, Support Squad
   sheet, Insider rulebook, Sangrevores rulebook, Neoflesh Cult rulebook,
   Xyrians rulebook, Official FAQ v1.2 (8.06.2026).
   ============================================================================= */
var RT = {};

RT.expansions = [
  { id: "base",        short: "Retaliation",   year: "Base game",  blurb: "The standalone marine-squad sequel: 1-5 players, the Facility, the Primeblood hive." },
  { id: "contractors", short: "Contractors",   year: "Characters", blurb: "12 Contractor cards bringing the previous Nemesis Characters into the draft." },
  { id: "ss",          short: "Support Squad", year: "Characters", blurb: "Two new Characters: the Sharpshooter and the UAV Operator with her drone." },
  { id: "insider",     short: "Insider",       year: "Story",      blurb: "A woman trapped in the Facility with her own goals — a 55-card branching story." },
  { id: "sangre",      short: "Sangrevores",   year: "Alt. race",  blurb: "Replaces the Intruders with vampiric Ghouls, Blood Specters and the King. Shadow markers replace Noise." },
  { id: "neoflesh",    short: "Neoflesh Cult", year: "Alt. race",  blurb: "Replaces the Intruders with an AI's flesh-machine drones and the evolving Motherbrain." },
  { id: "xyrians",     short: "Xyrians",       year: "3rd faction",blurb: "A hyper-intelligent third side of the conflict, hostile to marines and Intruders alike." }
];

RT.expMeta = {
  base:        { name: "Base",          cls: "e-base" },
  contractors: { name: "Contractors",   cls: "e-chars" },
  ss:          { name: "Support Squad", cls: "e-chars" },
  insider:     { name: "Insider",       cls: "e-ins" },
  sangre:      { name: "Sangrevores",   cls: "e-san" },
  neoflesh:    { name: "Neoflesh",      cls: "e-neo" },
  xyrians:     { name: "Xyrians",       cls: "e-xyr" },
  faq:         { name: "FAQ",           cls: "e-faq" },
  mode:        { name: "Mode",          cls: "e-mode" }
};

RT.modes = [
  { id: "standard", name: "Standard",    blurb: "Semi-cooperative. Private and Mission Objectives, one shared Mission Task. 2-5 players." },
  { id: "solocoop", name: "Solo / Co-op", blurb: "Fully cooperative or alone. One Solo/Coop Mission Task per Character — all must be fulfilled." }
];

RT.races = [
  { id: "primebloods", name: "Primebloods",   blurb: "The classic hive: Larvae, Adults, Drones and the Queen." },
  { id: "sangre",      name: "Sangrevores",   requires: "sangre",   blurb: "Ghouls, Blood Specters and the King. No Noise rolls — Shadows and Infections instead." },
  { id: "neoflesh",    name: "Neoflesh Cult", requires: "neoflesh", blurb: "Four Adult types with Skills, Cultists, Twitchlings and the growing Motherbrain." }
];

RT.modules = [
  {
    id: "deadly", requires: "base",
    name: "Deadly Mode",
    summary: "Harder game: Corridors use their second, smaller Noise value too.",
    description: "Available in both the standard and the Solo/Coop game. Corridors are treated as having <b>both</b> printed Noise values for all effects, so Noise rolls hit far more Corridors. Secured Corridors still have only their single “0” value. For tie-breaks, use only the standard (larger) Noise value.",
    src: "Retaliation p.40"
  }
];

/* ---------------------------------------------------------------------------
   Setup phases. ctx c = { has(exp), mode, race, p, mod(id) }
--------------------------------------------------------------------------- */
RT.phases = [
  {
    title: "Sections Setup",
    steps: [
      {
        when: function () { return true; }, exp: "base",
        t: "Assemble the Facility frame",
        d: "<ul><li>Connect the 3 <b>Section border pieces</b> and 3 <b>Round track border pieces</b> and place them on the table.</li><li>Place the <b>Undiscovered Hibernatorium tile</b> on top of the Hibernatorium Room — until Characters reach it, the Hibernatorium is Undiscovered: no Noise tokens on its Corridors, no Robot activation.</li><li>Round marker on <b>slot 1</b> of the Round track; <b>Lander token on slot 10</b>; Autodestruction token on its slot above the track.</li><li>1 Universal marker on the top-most space of the <b>Objective Choice</b> section.</li></ul>",
        src: "Retaliation p.8"
      },
      {
        when: function () { return true; }, exp: "base",
        t: "Section systems & the Robot",
        d: "<ul><li>All 3 <b>Life Support tokens</b> and the <b>Hibernatorium token</b> go on their border-piece slots, <b>Inactive side up</b>.</li><li>Shuffle the Robot cards, place <b>1 random Robot card face down</b> on the Section “A” border piece (box the rest unseen). Add 1 full Ammo token and 1 Oxygen token to its slots; place the Robot model in the Hibernatorium.</li><li>Shuffle both <b>Anti-Aircraft tokens</b> and stack them face down on the Section “B” slot — the top token is the system's true status.</li><li>Place <b>5 Egg tokens</b> on the Eggs space of the Section “C” border piece.</li></ul>",
        src: "Retaliation p.8"
      },
      {
        when: function () { return true; }, exp: "base",
        t: "Landing Zone supplies",
        d: "Place on the slots next to the Landing Zone: <b>4 Ammo tokens</b> (full side up), <b>4 Grenade tokens</b>, <b>4 Oxygen tokens</b> and <b>4 Medpack tokens</b>.",
        src: "Retaliation p.8"
      },
      {
        when: function () { return true; }, exp: "base",
        t: "Corridors & Room stacks",
        d: "<ul><li>Shuffle all Corridor tiles into the <b>Corridor insert</b> and place it near the Round track — draw from it all game without seeing fronts.</li><li>Draw <b>3 random Corridors</b> and connect them face up to the Landing Zone; any Door slot faces the Landing Zone entrance.</li><li>Sort all Room tiles by back into 4 stacks — <b>“A”, “B”, “C” and “?”</b> — shuffle each and place them face down nearby.</li></ul>",
        src: "Retaliation p.8"
      },
      {
        when: function (c) { return c.mod("deadly"); }, exp: "mode",
        t: "Deadly Mode is on",
        d: "For the whole game, Corridors are treated as having <b>both</b> of their printed Noise values (the standard one and the second, smaller one), for all effects:<ul><li>Noise rolls hit far more Corridors, so Intruders appear and enter Rooms much more often.</li><li>Secured (Reinforced) Corridors still have only their single “0” value.</li><li>For any tie-breaks, use only the standard (larger) Noise value.</li></ul>",
        src: "Retaliation p.40"
      }
    ]
  },

  {
    title: "Intruder Setup",
    steps: [
      {
        when: function (c) { return c.race === "primebloods"; }, exp: "base",
        t: "Primeblood hive",
        d: function (c) {
          return "<ul><li>Shuffle the <b>Exploration deck</b>, place it face down with space for a discard pile.</li><li>Separate the Intruder tokens into piles by type, shuffle each pile, place model-icon side up.</li><li><b>Intruder bag</b>: 1 Blank + 2 Larva + 3 random Adult tokens, +1 additional random Adult per Character (" + c.p + " extra). Keep the bag by the token piles.</li><li>Place the Intruder models nearby; shuffle the <b>Intruder Attack</b> and <b>Event</b> decks separately, face down.</li><li>Shuffle the <b>Queen Health cards</b> numbers-side down onto the Section “C” border piece; Universal marker on <b>“0”</b> of the Queen's Hits track.</li><li>Intruder Help sheet with <b>“The Queen is Alive”</b> side up near the bag.</li></ul>";
        },
        src: "Retaliation p.9"
      },
      {
        when: function (c) { return c.race === "sangre"; }, exp: "sangre",
        t: "Sangrevore brood",
        d: function (c) {
          return "Sections, Remaining Components and Player Setup follow the base rulebook — only this Intruder Setup changes:<ul><li>Shuffle the <b>Sangrevore Exploration deck</b>, face down.</li><li>Separate Sangrevore tokens into piles by type, shuffle, model-icon side up.</li><li><b>Intruder bag</b>: 1 Blank + 2 Blood Specter + 3 random Ghoul tokens, +1 additional random Ghoul per Character (" + c.p + " extra).</li><li>Place the Sangrevore models nearby; shuffle the <b>Sangrevore Attack</b> and <b>Sangrevore Event</b> decks, face down.</li><li>Shuffle the <b>King Health cards</b> numbers-side down onto the Section “C” space; Universal marker on <b>“0”</b> of the Hits track.</li><li>Sangrevore Help sheet with <b>“The King is Alive”</b> side up.</li></ul>";
        },
        src: "Sangrevores p.2"
      },
      {
        when: function (c) { return c.race === "sangre"; }, exp: "sangre",
        t: "Shadow, Infection & Tainted Blood decks",
        d: "<ul><li>Shuffle the <b>Shadow deck</b> and place it face down near the Exploration deck (leave discard space).</li><li>Shuffle the <b>Infection deck</b> and place it on the right side of the Facility <b>instead of the Contamination deck</b> — Infections replace Contamination in this expansion.</li><li>Shuffle the <b>Tainted Blood deck</b> near the Serious Wound deck.</li></ul>",
        src: "Sangrevores p.2"
      },
      {
        when: function (c) { return c.race === "neoflesh"; }, exp: "neoflesh",
        t: "Neoflesh machine-hive",
        d: function (c) {
          return "Sections, Remaining Components and Player Setup follow the base rulebook — only this Intruder Setup changes:<ul><li>Shuffle the <b>Neoflesh Cult Exploration deck</b>, face down.</li><li>Separate the Neoflesh tokens into piles — <b>all 4 Adult types mixed together</b> in one pile; Twitchlings and Motherbrain separate.</li><li><b>Intruder bag</b>: 1 Blank + 2 Twitchling + 3 random Adult tokens, +1 additional random Adult per Character (" + c.p + " extra).</li><li>Place the Neoflesh models nearby; shuffle the <b>Neoflesh Attack</b> and <b>Neoflesh Event</b> decks, face down.</li><li>Shuffle the <b>Neoflesh Queen Health cards</b> numbers-side down onto the Section “C” space; Universal marker on <b>“0”</b>.</li><li>Neoflesh Intruder Help sheet with <b>“The Queen is off the map”</b> side up.</li></ul>";
        },
        src: "Neoflesh p.4"
      },
      {
        when: function (c) { return c.race === "neoflesh"; }, exp: "neoflesh",
        t: "Skills, Absorbed Bodies & Body tokens",
        d: "<ul><li>Lay out the 6 <b>Neoflesh Skill cards</b> colored-side up in <b>descending order</b> of their top-right numbers — this order also breaks ties in play.</li><li>Place the <b>Absorbed Bodies tile</b> above the Section “B” border piece connected to the Queen's Hits track, with 1 <b>Motherbrain token</b> on each of its slots (the mismatched shapes are intentional).</li><li>Place the <b>Dead Neoflesh Cultists tile</b> to its left.</li><li>Place the 3 <b>Body tokens</b> illustration-side up on Round track slots <b>8, 11 and 14</b>.</li><li>Replace the standard Help cards with the <b>Neoflesh Cult Help cards</b>.</li></ul>",
        src: "Neoflesh p.4"
      }
    ]
  },

  {
    title: "Remaining Components",
    steps: [
      {
        when: function () { return true; }, exp: function (c) { return c.race === "sangre" ? "sangre" : "base"; },
        t: "Decks, markers & dice",
        d: function (c) {
          var cont = c.race === "sangre" ? "<b>Infection deck</b> (replacing Contamination)" : "Contamination deck";
          return "<ul><li>Shuffle separately and place face down on the right side of the Facility: 3 Item decks (red, green, yellow), the " + cont + ", and the Serious Wound deck — leave discard space for each.</li><li>Set the component insert in easy reach: Noise markers, Fire markers, Malfunction markers, Door tokens (with standee bases), Secure tokens, Tactical Gear tokens, Universal markers.</li><li>Place all 6 dice, the <b>Scanner</b> and remaining tokens nearby.</li></ul>";
        },
        src: function (c) { return c.race === "sangre" ? "Retaliation p.9 · Sangrevores p.2" : "Retaliation p.9"; }
      }
    ]
  },

  {
    title: "Player Setup",
    steps: [
      {
        when: function () { return true; }, exp: "base",
        t: "Help cards",
        d: function (c) {
          return "Find the Help cards numbered 1-" + c.p + ", shuffle them and deal one to each player, revealed. The number is used for the Character draft and by some Objectives — <i>not</i> for turn order, which is simply clockwise from the Starting Player.";
        },
        src: "Retaliation p.10"
      },
      {
        when: function () { return true; }, exp: function (c) { return c.mode === "solocoop" ? "mode" : "base"; },
        t: "Objectives & Mission Task",
        d: function (c) {
          if (c.mode === "solocoop") return "<ul><li>Do <b>NOT</b> deal standard Objective cards.</li><li>Instead of one Mission Task, draw and place face up <b>" + c.p + " random Solo/Coop Mission Task cards</b> (one per Character).</li><li>To win: <b>all</b> Mission Tasks fulfilled and at least 1 Character survives. Duplicate requirements (e.g. two tasks needing a Data token) must be met by that many different Characters.</li><li>Adjust difficulty by adding or removing Mission Tasks. FAQ: Tasks 3 and 11 (Closedown &amp; Shutdown) can never coexist — redraw the second.</li></ul>";
          return "<ul><li>Split the Objective cards into <b>Private</b> and <b>Mission</b> decks; take the <b>Mission Task</b> deck. Remove all cards with a Character count above " + c.p + ".</li><li>Deal each player <b>1 Private + 1 Mission Objective</b>, face down and secret (you may discuss and lie about them).</li><li>Reveal <b>1 random Mission Task</b> face up on the bottom Round track tile — the squad's common mission; most Mission Objectives require it to be fulfilled.</li></ul>";
        },
        src: function (c) { return c.mode === "solocoop" ? "Retaliation p.40 · FAQ v1.2 p.2" : "Retaliation p.10"; }
      },
      {
        when: function () { return true; },
        exp: function (c) { return (c.has("contractors") || c.has("ss")) ? (c.has("contractors") ? "contractors" : "ss") : "base"; },
        t: "Character draft",
        d: function (c) {
          var extra = "";
          if (c.has("ss")) extra += "<li><b>Support Squad:</b> add the Sharpshooter and UAV Operator draft cards to the deck. The UAV Operator is not recommended for a first game.</li>";
          if (c.has("contractors")) extra += "<li><b>Contractors:</b> shuffle all 12 Contractor Draft cards and place <b>2 of them face up in the middle</b>. Any player may pick one of those instead of their dealt cards (choice of 4). The moment anyone picks a Contractor (including the base game's), all other Contractor options are discarded — only one Contractor per game.</li>";
          return "<ul><li>Deal <b>2 secret Character draft cards to Player 1</b>; they keep 1 (revealed) and shuffle the other back. Repeat in ascending player-number order.</li>" + extra + "</ul>";
        },
        src: function (c) {
          var s = "Retaliation p.10";
          if (c.has("contractors")) s += " · Contractors sheet";
          if (c.has("ss")) s += " · Support Squad sheet";
          return s;
        }
      },
      {
        when: function () { return true; }, exp: function (c) { return c.has("contractors") ? "contractors" : "base"; },
        t: "Character setup",
        d: function (c) {
          var contr = "<li>The base <b>Contractor</b> starts with <b>2 Character Items</b>." + (c.has("contractors") ? " A Contractor from the expansion builds their Action deck from the 5 generic “Contractor” cards + the 5 “Contractor: <i>[name]</i>” cards of the drafted Contractor, and uses that Contractor's 2 Character Item cards." : "") + "</li>";
          return "Each player:<ul><li>Places their <b>Character tile</b> into a universal Character board.</li><li>Health: Universal marker on the <b>left-most slot</b> of the Health track. Oxygen dial to the max: <b>7</b>.</li><li>Miniature in its colored ring, placed in the <b>Landing Zone</b>.</li><li>Takes the <b>Backpack card holder</b> matching their player number.</li><li>Shuffles their <b>Action deck</b> face down to the left of the board (discard pile on the right).</li><li>Takes their <b>Character Item</b>: Heavy Item → a Hand slot; Armor → the Heavily Injured section of the Health track. Fill any Ammo slots with full Ammo tokens.</li>" + contr + "<li>Return all Character Draft cards to the box.</li></ul>";
        },
        src: function (c) { return c.has("contractors") ? "Retaliation p.10 · Contractors sheet" : "Retaliation p.10"; }
      },
      {
        when: function () { return true; }, exp: "base",
        t: "Support Equipment draft",
        d: "The Contractor sits this one out (they already have 2 Items). Everyone else:<ul><li>Shuffle the Support Equipment deck, reveal <b>7 cards</b>.</li><li>The player with the <b>highest player number picks first</b>, then in descending order, until everyone has 1 — Heavy Items to a Hand slot, Armor to the Health track.</li><li>Fill any empty Tactical Gear slots on chosen Equipment with matching tokens (gray slots take any token).</li><li>Remove the unchosen Equipment from the game; keep the deck near the Item decks for later use.</li><li>Finally, every player takes <b>4 Tactical Gear tokens of their choice</b> for their Tactical Belt (Ammo full side up). First game? Take 1 of each.</li></ul>",
        src: "Retaliation p.10"
      },
      {
        when: function () { return true; }, exp: "base",
        t: "Begin the mission",
        d: "<ul><li>Each player draws <b>5 Action cards</b>.</li><li>Player 1 takes the <b>Starting Player token</b> — the game begins with them.</li></ul>",
        src: "Retaliation p.10"
      }
    ]
  },

  {
    title: "Expansion Setup",
    steps: [
      {
        when: function (c) { return c.has("xyrians"); }, exp: "xyrians",
        t: "Seed the Xyrians",
        d: "After the main setup but before Player Setup:<ul><li>Shuffle the <b>3 Xyrian Exploration cards</b> into the Exploration deck and <b>1 random Xyrian Event card</b> into the Event deck — make sure no Xyrian card sits on top; box the other 2 Event cards.</li><li>Place the <b>Xyrian Phase card</b> face up next to the Event deck (resolved before every Event Phase) and the Xyrian Help card in reach.</li><li>Shuffle the <b>Xyrian Activation</b> deck (by the Intruder Attack deck), the <b>Xyrian Item</b> deck (by the Item decks) and the <b>Xyrian Status</b> deck (by the Serious Wound deck).</li><li>Place the <b>Allegiance card</b> Available side up — either side may be read at any time.</li><li>Set out 3 Trace tokens, 3 Injury tokens and 3 Xyrian models; put the <b>Xyrian token</b> next to the Intruder bag.</li></ul>",
        src: "Xyrians p.3"
      },
      {
        when: function (c) { return c.has("insider"); }, exp: "insider",
        t: "Prepare the Insider",
        d: "<ul><li>Place the Insider model, standee and Insider card nearby — they are <b>not in play</b> until a Story card introduces them.</li><li>Place the <b>Story deck</b> with the side showing Room names face up — <b>do not shuffle it</b>.</li><li>When the first Exploration card with the Insider icon is drawn: finish the Exploration card, find all Story cards matching the newly Discovered Room, keep them nearby with the lowest number facing up (box every other Story card — they won't be used this game), and resolve that Starting Story card.</li><li><i>Compatibility: the Insider works only with the standard game (plus Character expansions like Contractors and Support Squad) — not with Sangrevores, Neoflesh Cult or Xyrians.</i></li></ul>",
        src: "Insider p.2-3"
      }
    ]
  }
];

/* ---------------------------------------------------------------------------
   Reference sections
--------------------------------------------------------------------------- */
RT.reference = [
  {
    id: "round",
    title: "Round Structure",
    when: function () { return true; },
    html: function (c) {
      var xy = c.has("xyrians") ? "<li><b>Xyrian Phase</b> (before the Event card, if any Xyrian is on the map) — resolve the Xyrian Phase card: 1 Xyrian Activation, add the Xyrian token to the bag, and if 2+ Xyrians share a Room, replace the least injured with a Trace token.</li>" : "";
      var burning = c.race === "neoflesh" ? "<li><b>Intruders Burning — skipped entirely</b>: Neoflesh machines don't burn, and their Eggs aren't destroyed by Fire.</li>" : "<li><b>Intruders Burning</b> — each Intruder in a Room with Fire takes 1 Hit (no roll, so only Larvae can die of it). Fire in the Nest destroys 1 Egg.</li>";
      var twitch = c.race === "neoflesh" ? "<li><b>Twitchling Activations</b> — every Twitchling moves toward the closest Unexplored Corridor (attacking Characters in Rooms it enters). One already in an Unexplored Corridor leaves the map instead: return it to the pool and shift all Body tokens 1 space up the Round track.</li>" : "";
      var evtMove = c.race === "neoflesh" ? "Event cards show an Intruder <i>type</i> instead of Corridor orientations — all Intruders of that type AND everyone sharing their Corridors move. Twitchlings and Cultists never move this way. Effects are often gated by a Cultist count — if fewer Cultist icons are visible on the Dead Cultists tile than required, skip the effect." : "Intruders in Corridors of the orientation shown on the card move toward the closest Character, then the Main effect and the Secondary effect resolve (impossible sentences are simply skipped).";
      return "<h4>1 · Player Phase</h4><ul><li>Clockwise from the Starting Player, each non-passed player takes a Turn: <b>2 Actions</b>, then <b>Oxygen Loss</b> (lose 1 Oxygen in a Section with Inactive Life Support), then <b>Fire Damage</b> (lose 1 Health in a burning Room).</li><li>Repeat until everyone has Passed. Passing lets you discard any cards; you can still use Reactions afterwards. <b>Pass is an Action</b> — an empty hand doesn't auto-pass you.</li><li><b>Choosing an Objective</b> (once per game, between your Actions, not an Action): remove one of your 2 Objective cards from the game, advance the Objective Choice track, and draw Action cards by position — 1st chooser draws 3, 2nd and 3rd draw 2, 4th and 5th draw 1.</li></ul><h4>2 · Intruder Phase</h4><ul>" + burning + "<li><b>Intruder Attacks</b> — each Intruder in a Room with a Character attacks, resolved Room by Room from the top-left going row by row, largest Intruders first, all against the Character first in Turn order (moving to the next Character if that one dies or leaves)." + (c.race === "neoflesh" ? " Twitchlings deal 1 Contamination instead of drawing a card; Cultists never attack." : "") + "</li>" + twitch + "</ul><h4>3 · Event Phase</h4><ul>" + xy + "<li><b>Event Card</b> — " + evtMove + "</li><li><b>Bag Development</b> — draw 1 token and resolve its front per the Intruder Help sheet (see the table below).</li></ul><h4>4 · Cleanup Phase</h4><ul><li>Starting Player token passes clockwise.</li><li>Everyone draws back up to <b>5 cards</b> (reshuffle your discard into your deck whenever it runs dry).</li><li>Advance the Round marker. <b>Autodestruction token's space = the Facility explodes</b>. <b>Lander token's space</b> = reveal the top Anti-Aircraft token — Inactive: the Lander lands in the Landing Zone (remove the AA tokens for good); Active: the Lander is destroyed. After Round 14, the game ends.</li></ul>";
    },
    src: function (c) { return "Retaliation p.12-15" + (c.has("xyrians") ? " · Xyrians p.4" : "") + (c.race === "neoflesh" ? " · Neoflesh p.4-5" : ""); }
  },
  {
    id: "bagdev",
    title: "Bag Development Table",
    when: function () { return true; },
    html: function (c) {
      if (c.race === "neoflesh") return "<p>Bag Development uses the standard rules with the Neoflesh Help sheet (start on “The Queen is off the map”). The <b>Motherbrain tokens</b> enter the bag only through the Absorbing Bodies sequence — and once in, they never leave while she lives.</p><p>Base table (Queen = Motherbrain): Queen token — activate her if on the map, else add 2 Larva-equivalents; Drone/Adult token — add 2 Queen tokens; Larva token — add 2 Drone-equivalents; Blank — add 2 random Adults and return the Blank.</p>";
      if (c.race === "sangre") return "<p>Sangrevores follow the base hierarchy (Ghouls = Adults, Blood Specters = Drones, the King = the Queen) with their own Help sheet: resolve the drawn token's front per that sheet — King token activates the King or grows the brood, Specter and Ghoul tokens escalate, the Blank adds Ghouls and returns to the bag. Tokens go back to their piles after resolving (Blank excepted).</p>";
      return "<p>Draw 1 token, resolve its <b>front</b> only, then discard it to the bottom of its pile — except the Blank, which always returns to the bag. Effects change when the Queen dies (flip the Help sheet).</p><ul><li><b>Queen</b> — if the Queen is on the map: <b>Activate</b> her (she attacks a Character in her Room, or moves once toward the closest Character). Otherwise: add 2 Larva tokens to the bag.</li><li><b>Drone / Adult</b> — add 2 Queen tokens to the bag.</li><li><b>Larva</b> — add 2 random Drone tokens to the bag.</li><li><b>Blank</b> — add 2 random Adult tokens; the Blank returns to the bag.</li></ul>";
    },
    src: function (c) { return c.race === "neoflesh" ? "Neoflesh p.5" : (c.race === "sangre" ? "Sangrevores p.2-4" : "Retaliation p.15, 35"); }
  },
  {
    id: "actions",
    title: "Actions & Golden Rules",
    when: function () { return true; },
    html: function (c) {
      return "<h4>Basic Actions (pay by discarding Action cards)</h4><ul><li><b>0 cards</b>: Play an Action card (reveal, resolve, discard) · Pass.</li><li><b>1 card</b>: Make a Move · Place 1 Secure token (never in a Room with an Intruder) · Fire a Shot in a Room · Fire a Burst at a Corridor · Melee Attack · Use an Item · Activate the Robot · Trade · Use any Tactical Gear.</li><li><b>2 cards</b>: Use the Room · Make a Move Cautiously.</li></ul><p>Contamination cards can never pay costs. Actions marked “Not in Combat” can't be used in a Room with an Intruder. When choosing an effect you must be able to resolve it <i>entirely</i>. Discarded cost cards never trigger their effects. <b>Reactions</b> play any time their condition is met, don't count as Actions, and work even after Passing.</p><h4>Orders &amp; interplay</h4><ul><li>Effects that command another Character: the effect's owner chooses targets, and Passed Characters can still be ordered — but never into an Intruder Opportunity Attack.</li><li>Using an Item/Action/Gear on a willing Character in your Room is allowed only for: restoring Health, discarding Serious Wounds, discarding Malfunction markers from their Items, or gaining Oxygen (FAQ). Anything else must be Traded first.</li><li><b>Trade</b>: everyone in the Room may exchange Items and Tactical Gear by mutual consent (3-way deals allowed); gifts are fine. FAQ: traded Items count as “gained” and can be used immediately.</li></ul><h4>Golden Rules</h4><ul><li><b>Nightmare Rule</b> — unsure about anything? Resolve it in the worst way for the players (then worst for the Character first in Turn order).</li><li><b>Local Effects</b> — untargeted effects apply in the acting Character's Room.</li><li><b>Component Limits</b> — components are limited; if none are available and no special rule applies, nothing happens (Fire and Malfunction markers have special rules — see Map &amp; Markers).</li></ul><h4>Tactical Gear</h4><ul><li><b>Ammo</b> — reload: move the token onto a Weapon (never between Weapons). Full tokens flip to half when spent; half tokens are discarded.</li><li><b>Grenade</b> — pick an adjacent Corridor, roll the Burst die and <b>add 2</b>; deal that many Hits there (an ammo-spend result does nothing; Weapon effects don't apply).</li><li><b>Oxygen</b> — gain 3 Oxygen (max 7). <b>Medpack</b> — restore 2 Health.</li><li>“Use any Tactical Gear” can fire multiple tokens, chosen one at a time (FAQ), and can also rearrange your tokens; in the Robot's Room you may use and swap the Robot's tokens too.</li></ul>";
    },
    src: "Retaliation p.12-13, 16-17, 29 · FAQ v1.2 p.2-3"
  },
  {
    id: "movement",
    title: "Movement, Noise & Exploration",
    when: function () { return true; },
    html: function (c) {
      if (c.race === "sangre") {
        return "<h4>Movement (Sangrevores — no Noise rolls!)</h4><ol><li><b>Choose Direction</b>.</li><li><b>Opportunity Attacks</b> — Intruders in your Room or the chosen Corridor attack, largest first, max 3.</li><li>To a Discovered Room: move (Cautious: also place a Secure token). <b>Do NOT roll for Noise</b> — instead place 1 <b>Shadow marker</b> in each Corridor adjacent to your new Room except the one you came through.</li><li>To an Undiscovered Room: resolve the Exploration Sequence (Sangrevore Exploration cards place Shadow markers, never in the Corridor you just moved through).</li><li>If you moved through any Shadow markers: draw 1 <b>Shadow card</b> and resolve the effect matching the number of markers you crossed, discarding them. Skip this if Moving Cautiously.</li></ol><h4>Shadow markers</h4><ul><li>Rethemed Noise markers — effects that interact with Noise markers apply to them. FAQ: they're unlimited (substitute components) and are still placed in Reinforced Corridors.</li><li>Max 3 per Corridor — placing a 4th replaces them all with a <b>Blood Specter</b>.</li><li>Shadows and Intruders can share a Corridor: all Shadow markers together take 1 of the 6 spaces.</li><li>Deal with them three ways: walk through them (resolve a Shadow card), Move Cautiously through them (no effect, markers stay), or Burst/apply Hits (1 Hit removes 1 marker, no consequences).</li></ul>";
      }
      return "<h4>Movement Sequence</h4><ol><li><b>Choose Direction</b> — pick an adjacent Corridor (Closed Doors block you).</li><li><b>Opportunity Attacks</b> — every Intruder in your Room and/or the chosen Corridor attacks, largest first, <b>max 3 attacks</b>.</li><li><b>To a Discovered Room</b>: move there (Moving Cautiously: also place a Secure token) and <b>make a Noise roll — after every Movement</b>, even into occupied Rooms.</li><li><b>Through an Unexplored Corridor</b> (one connected to only 1 Room): resolve the <b>Exploration Sequence</b>.</li></ol><h4>Noise roll</h4><ul><li><b>1-4</b> — for EACH adjacent Corridor with that value:<ul><li>Intruder inside → the largest one moves into your Room (and attacks).</li><li>Noise marker inside → <b>resolve the marker</b>: draw an Intruder token; its back shows how many Intruders appear there (red number = Drones).</li><li>Empty → place a Noise marker.</li></ul></li><li><b>Hazard</b> — draw a token and place 1 Intruder of the shown type <i>in your Room</i> (ignore the number).</li><li>Any Intruder placed in or moved to a Room with Characters immediately attacks (Secure tokens: discard 1 instead — FAQ confirms this also covers Intruders placed by effects).</li></ul><h4>Exploration Sequence</h4><ol><li>Draw an Exploration card, oriented North like the map.</li><li><b>Set up the Room</b> — draw a random Room of the shown type (A/B/C/?; none left = a “?” Room) and place it face up at the Corridor's exit.</li><li><b>Set up Corridors</b> — place random face-up Corridors in each shown space; Door slots face the new Room. Never outside the Facility borders, never leading to already-placed Rooms.</li><li><b>Markers</b> — place the shown Noise markers etc. (never doubling up a Noise marker).</li><li><b>Move</b> (Cautious: + Secure token), resolve any <b>Entrance Effect</b> (FAQ: “close all Doors” means only Doors touching the new Room; effects that skip Entrance Effects still remove the card), then discard the card. An empty Exploration deck reshuffles (minus removed cards).</li></ol><h4>Corridors</h4><ul><li>Capacity: <b>6 Intruders</b> (the Queen counts as 4) or a Noise marker — a Corridor with only a Noise marker still counts as empty; an Intruder entering discards the marker.</li><li><b>Reinforce</b> (via Actions): discard its Noise marker and flip the Corridor to its “0” side — Noise rolls can't hit it (Intruders can still move through; Hibernatorium Corridors can't be Reinforced).</li></ul>";
    },
    src: function (c) { return c.race === "sangre" ? "Sangrevores p.3 · FAQ v1.2 p.3" : "Retaliation p.21, 24-25 · FAQ v1.2 p.2-3"; }
  },
  {
    id: "combat",
    title: "Combat & Intruder Health",
    when: function () { return true; },
    html: function (c) {
      var races = "";
      if (c.race === "neoflesh") races = "<h4>Neoflesh types & Skills</h4><ul><li>Four Adult types replace Adults/Drones, each with a Skill active until deactivated: <b>Slashers</b> (a hit that wounds attacks a second time), <b>Crawlmines</b> (killed in a Room: draw 3 Attack cards; any “Boom!” = resolve one), <b>Ironclads</b> (must be targeted first; 2 Hits at once to kill in a Corridor; killed in a Room = Repelled instead), <b>Firespitters</b> (Bursting their Corridor first costs you 1 Health each).</li><li><b>Cultists</b> don't move, attack or count for Combat; kill one (Adult health rules) to place it on the Dead Cultists tile and deactivate a Skill of your choice — but while the Cultist Skill is active, any Hits dealt to a Cultist force a Noise roll (once per Action — FAQ).</li><li><b>Twitchlings</b>: 1 Hit kills — unless their Skill is active, in which case they take Hits like Adults in Rooms. Their attack = 1 Contamination; they stay on the map.</li><li>Intruder tokens show exactly which mix of Adults spawns; not enough Corridor space = place by Skill-card order, largest first.</li><li>Attack cards: match the attacker's type icon → top effect (even if its Skill is off); Motherbrain with enough Absorbed Bodies → second row; otherwise third row.</li></ul>";
      if (c.race === "sangre") races = "<h4>Sangrevore types</h4><ul><li><b>Ghouls</b> = Adults, <b>Blood Specters</b> = Drones, the <b>King</b> = the Queen; no Larvae. Same combat math, new Attack and Event decks.</li><li>Their attacks hand out <b>Infections</b> (rarely from Ghouls, frequently from Specters and the King) and sometimes <b>Tainted Blood</b> — see the Sangrevore section below.</li></ul>";
      return "<p>Hits work differently by location: in a <b>Corridor</b>, each Hit kills 1 Adult outright (Drones need 2 at once; leftover Hit markers never persist there); in a <b>Room</b>, Hits accumulate as Universal markers by the model.</p><h4>Shoot (1 card)</h4><ol><li>Pick a working, loaded Ranged Weapon and an Intruder in your Room.</li><li><b>Deal 1 Hit</b>, then roll the Shoot die: crosshair = it dies; <b>2-5</b> = it dies if the roll ≤ its total Hits; ammo symbol = spend 1 Ammo (flip full → half, discard half). Shooting otherwise costs no Ammo!</li></ol><h4>Burst (1 card)</h4><ol><li>Pick a working, loaded Ranged Weapon and an adjacent Corridor (Closed Doors block it).</li><li><b>Spend 1 Ammo</b>, roll the Burst die and distribute that many Hits: 1 per Adult or Larva, exactly 2 per Drone, any number to the Queen; leftovers are lost.</li></ol><h4>Melee (1 card)</h4><ol><li><b>Gain 1 Contamination card</b>, pick an Intruder in your Room.</li><li>Deal 1 Hit and roll the Shoot die (crosshair kill / 2-5 kill if ≤ Hits / miss = nothing).</li><li>If it survives, it retaliates — unless you place a Malfunction marker on one of your Weapons (a second Malfunction destroys the Weapon).</li></ol><h4>Larvae & Drones</h4><ul><li>A Larva dies to 1 Hit anywhere, die roll irrelevant. A Larva's attack: the Character gains 1 Contamination and the Larva climbs onto their board (already infected = the Larva is just discarded).</li><li>Drones: 2 simultaneous Hits in a Corridor; normal Shoot rules in a Room.</li></ul><h4>The Queen" + (c.race === "neoflesh" ? " (Motherbrain)" : c.race === "sangre" ? " (King)" : "") + "</h4><ul><li>Hits advance the Universal marker on her Hits track. When it reaches the final space, ignore further Hits from that Action and draw a <b>Queen Health card</b>: discard that many more cards unseen, resolve its bottom effect, reset the marker to 0.</li><li>All Queen Health cards discarded = she dies; flip the Intruder Help sheet (tokens now behave differently).</li><li>FAQ: shooting her works like shooting an Adult — a 2 (or crosshair) resolves a Health card since she'll have 2 Hits.</li>" + (c.race === "neoflesh" ? "<li><b>Motherbrain</b>: each Absorbed Body adds a Motherbrain token to the bag, expands her Hits track, and strengthens her attacks. Absorbing a Body never heals existing Hits.</li>" : "") + "</ul><h4>Attack cards & Prevention</h4><ul><li>An attacking Intruder draws 1 Attack card; find its type icon and resolve that effect. The deck reshuffles only when instructed (and a reshuffle includes the instructing card — FAQ).</li><li>“Prevent an Intruder Attack” cancels everything — no card is drawn. FAQ: movement-prevention cards stop only Opportunity Attacks, not Hazard-roll attacks.</li><li>Characters can never attack each other — though trapping someone in a burning Room is “not an Attack”.</li></ul>" + races;
    },
    src: function (c) { return "Retaliation p.30, 32-35 · FAQ v1.2 p.2" + (c.race === "neoflesh" ? " · Neoflesh p.6-8" : "") + (c.race === "sangre" ? " · Sangrevores p.4" : ""); }
  },
  {
    id: "health",
    title: "Health, Oxygen & Wounds",
    when: function () { return true; },
    html: function (c) {
      return "<h4>Health track</h4><ul><li>Three states — <b>Healthy → Injured → Heavily Injured</b> — that matter mainly to Intruder Attack cards (some kill Heavily Injured Characters outright). Passing the skull = death: your miniature and every Item you carried are gone.</li><li><b>Armor</b> sits on the Heavily Injured section (only 1 worn at a time); when your Health marker would enter its section, the Armor breaks, is discarded, and remaining damage continues.</li></ul><h4>Serious Wounds</h4><ul><li>Drawn randomly, placed in the left-most Health section without one; they block those Health slots (your marker skips to the next free slot — possibly breaking Armor). Duplicates don't stack effects.</li><li>Discarding one (Items, Surgery Room): choose which, slide the rest left; your Health marker doesn't move.</li></ul><h4>Oxygen</h4><ul><li>Dial starts at 7, max 7. Lose 1 at the end of your Turn in a Section with Inactive Life Support (Passing included). Active Life Support does NOT refill it — only Oxygen tokens (+3) and Items do.</li><li>At 0: gain a <b>Suffocating token</b>, reset the dial to 0 — the next Oxygen loss kills you. Discard the token by gaining Oxygen or ending a Turn in a Section with Active Life Support. You can't take Actions whose Oxygen cost would take you below 0.</li></ul>";
    },
    src: "Retaliation p.17-18, 29"
  },
  {
    id: "contam",
    title: "Contamination & Procedures",
    when: function () { return true; },
    html: function (c) {
      if (c.race === "sangre") return "<h4>Infections (replace Contamination)</h4><ul><li>Gained Infection cards are <b>shuffled into your Action deck</b> (without the discard pile). They can't pay costs and can't be discarded freely.</li><li>Ways out: play an Infection for its bottom effect (an Action) to remove it; discard any number from hand when Passing at the cost of 1 Health total; or play a <b>Rest</b> Action card to discard any number from hand free.</li><li>FAQ: all Infections are treated as <i>Infected</i> Contaminations.</li></ul><h4>Tainted Blood</h4><ul><li>A “gift” from the Sangrevores: an Ability usable once per Round, always costing something and counting as an Action.</li><li>Only 1 is Active (face up); gaining a second means choosing which stays Active. When told to discard one, always discard from the bottom of the stack.</li></ul><h4>End of the game (Sangrevores)</h4><ol><li>Each surviving escaped/hibernated Character with any Infection cards performs the <b>Eclosion Procedure</b> treating Infections as Contaminations — drawing one = death.</li><li>Survivors reveal and check Objectives (choosing one first if they never did); fulfilled = you win.</li></ol>";
      return "<h4>Contamination cards</h4><ul><li>Gained cards go to your <b>discard pile</b>; they clog your deck and hand, can't pay costs, and may be discarded when Passing. The Scanner reveals INFECTED / not (read carefully!).</li><li>A <b>Larva</b> on your board has no in-game penalty — it just makes the end-of-game Eclosion likely to kill you. The Surgery Room can remove it.</li></ul><h4>Infection Procedure</h4><p>Scan all Contamination cards <b>in hand</b>: any INFECTED → place a Larva on your board (if you don't have one). Then put all those Contaminations on your discard pile.</p><h4>Eclosion Procedure</h4><p>Draw 4 cards from your Action deck — <b>any</b> Contamination card among them (no scanning) = death. Dying this way mid-game spawns an Adult in your Room" + (c.race === "neoflesh" ? " (Neoflesh FAQ: a Slasher)" : "") + ".</p><h4>Autodestruction Procedure</h4><ul><li>Started in the Cooling System Room: place the Autodestruction token <b>5 spaces ahead</b> of the Round marker (not enough spaces = it triggers at game end; FAQ: even then it resolves before the end-game sequence).</li><li>The Round marker reaching it destroys the Facility: everyone inside (hibernated included) dies, all Rooms and Intruders (Queen included) are destroyed.</li><li>Only a full power shutdown in the <b>Reactor</b> cancels it — which also permanently kills Life Support, Anti-Aircraft and the Autodestruction system.</li></ul>";
    },
    src: function (c) { return c.race === "sangre" ? "Sangrevores p.4 · FAQ v1.2 p.3" : "Retaliation p.36, 38 · FAQ v1.2 p.2-3"; }
  },
  {
    id: "map",
    title: "The Facility: Sections, Rooms & Markers",
    when: function () { return true; },
    html: function (c) {
      return "<h4>Sections</h4><ul><li><b>A — Entrance</b>: Landing Zone (escape + restock), Drilling Room (drill new Corridors — FAQ: not with a broken Robot), Life Support Control “A” (toggle LS-A, put out fires).</li><li><b>B — Middle</b>: Hibernatorium (starts Undiscovered AND Inactive — activate it in Life Support Control “C”), Life Support Control “B” (toggle LS-B, check/swap Anti-Aircraft tokens), Server Room (grants the Data token some Objectives need — the token also waives the extra card for remote Robot activation).</li><li><b>C — Deep end</b>: the Nest (5 Eggs on the border piece; Eggs are Heavy Items; no Eggs left = Nest destroyed for good — FAQ: fire sitting there at game end doesn't destroy it), Reactor (total power shutdown), Escape Shuttle (1 person!), Cooling System (start Autodestruction), Surgery (Serious Wounds and Larva removal; Solo/Coop: revives), Life Support Control “C” (toggle LS-C, activate the Hibernatorium).</li><li>“?” Rooms are random and can appear anywhere. Use the Room = 2 cards, blocked by a Malfunction marker. FAQ: Malfunction markers do <i>not</i> disable a Room's Computer icon.</li></ul><h4>Doors</h4><ul><li>Exist only at Door slots. Closed Doors block Movement, Bursting, Grenades, Commands — everything except Noise markers. Intruders destroy them rather than move through (a Destroyed Door lies flat and can't close again).</li><li>Closed Doors also block spreading Fire. FAQ: Fire spreading into an open Corridor does nothing; Portable Barricade Doors that get opened are gone.</li></ul><h4>Markers</h4><ul><li><b>Fire</b> — 1 per Room. Out of Fire markers = the Facility burns down, game over. Damage: Characters ending a Turn there lose 1 Health; Intruders take 1 Hit in the Intruder Phase.</li><li><b>Malfunction</b> — on Rooms (Action unavailable), Heavy Items (unusable; a 2nd Malfunction destroys the Item; its Tactical Gear still works; no Ammo can be spent from it — FAQ) or the Robot. Out of markers = place Fire instead.</li><li><b>Secure tokens</b> — max 3 per Room, never in a Room with an Intruder. When an Intruder <i>enters</i> a Room with a Character + Secure token: discard 1 token instead of the Attack (no protection from Intruders already inside). The Shelter Room's “always secured” is a permanent status, not a token (FAQ).</li></ul>";
    },
    src: "Retaliation p.19-23 · FAQ v1.2 p.2"
  },
  {
    id: "escape",
    title: "Escaping, the Lander & End of the Game",
    when: function () { return true; },
    html: function (c) {
      var win;
      if (c.mode === "solocoop") win = "<h4>Winning (Solo/Coop)</h4><ul><li><b>All</b> Solo/Coop Mission Tasks fulfilled and at least 1 Character survives. Duplicate requirements need that many different Characters.</li><li><b>Revive</b>: a dead Character's model stays knocked over (Items discarded). Another Character can drag it along (1 extra card per Move). Starting a Round knocked-over in the Surgery Room (no Intruders, no Malfunction) stands you back up: Serious Wounds discarded, Health at the left-most Injured slot.</li></ul>";
      else win = "<h4>Winning (standard)</h4><ul><li>Escape or Hibernate, survive the end-game procedures, and fulfill the Objective you kept. The <b>Mission Task</b> is shared and most Mission Objectives require it.</li><li>Never chose an Objective? You choose at the final reveal, before others show theirs.</li><li><b>Escaped</b> Characters count as Escaped even if the end-game Infection kills them; <b>Hibernated ≠ Escaped</b> for Objectives.</li></ul>";
      return "<h4>Three ways out</h4><ul><li><b>Lander</b> (Landing Zone) — available once it lands on Round 10 (if Anti-Aircraft is Inactive; Active = it's destroyed and this exit disappears).</li><li><b>Hibernatorium</b> — only while Active; you sleep through the rest and only Facility destruction can still kill you.</li><li><b>Escape Shuttle</b> (Section C) — fits exactly 1 Character; ignores Anti-Aircraft.</li></ul><p>Each is a Room action with a special Noise roll: if an Intruder is in your Room after the roll, the attempt fails and you stay.</p><h4>In the Lander</h4><ul><li>Your Turns are skipped (not Passed; if everyone else Passes, you auto-Pass). You can't leave voluntarily, lose no Oxygen or Health (only Facility destruction hurts you), and still draw cards in Cleanup.</li><li>An Intruder appearing in the Landing Zone throws everyone out of the Lander. FAQ: Intruders never move toward Characters inside the Lander, and Xyrians removing the Lander eject its passengers.</li><li>At the start of any Event Phase, anyone aboard may <b>launch</b>: the Lander leaves and all passengers have Escaped.</li></ul><h4>Game end & final checks</h4><ol><li>The game ends after <b>Round 14</b> (everyone still inside dies) or when all Characters are out/dead.</li><li>Survivors without a Larva: draw ALL cards (deck + discard) and run the <b>Infection Procedure</b>.</li><li>Survivors with a Larva: gain 1 Contamination, reshuffle everything, run the <b>Eclosion Procedure</b> — a Contamination among 4 draws = death.</li><li>Reveal Objectives" + (c.mode === "solocoop" ? " / check the Mission Tasks" : "") + " — completers win!</li></ol>" + win;
    },
    src: function (c) { return "Retaliation p.37-40 · FAQ v1.2 p.2" + (c.has("xyrians") ? "-3" : ""); }
  },
  {
    id: "robot",
    title: "The Robot",
    when: function () { return true; },
    html: function (c) {
      return "<ul><li>One of 6 Robot cards is in play, face down on the Section “A” border piece; it's revealed when any Room first connects to the Hibernatorium. The model starts in the Hibernatorium.</li><li><b>Activate the Robot</b> (1 card): locally in its Room, or remotely from any Room with a Computer for 1 extra card (free with a Data token). Each Robot card has a unique effect.</li><li>Intruders completely ignore it. It never moves on its own, moves Room-to-Room via player Actions, can't pass Closed Doors or Unexplored Corridors (the Exploration Robot excepted), and makes no Noise rolls.</li><li>It carries 1 Ammo + 1 Oxygen token; Characters in its Room can use and swap its Tactical Gear.</li><li>A Malfunction marker blanks its card (Gear still usable; effects merely <i>requiring</i> a Robot still work; FAQ: Robot-related Events still resolve).</li></ul>";
    },
    src: "Retaliation p.37 · FAQ v1.2 p.2-3"
  },
  {
    id: "xyrians",
    title: "Xyrians — the Third Faction",
    when: function (c) { return c.has("xyrians"); },
    html: function (c) {
      return "<h4>How they arrive</h4><ul><li>Xyrian Exploration cards place <b>Trace tokens</b> in Rooms (untouchable clues) and put the <b>Xyrian token</b> in the Intruder bag. Drawing that token: resolve 1 Activation (if any Xyrian is on the map), replace every Trace token with a Xyrian model, discard the Xyrian token.</li><li><b>Xyrian Phase</b> (before each Event card, only if a Xyrian is on the map): resolve 1 Activation card, add the Xyrian token to the bag, and if 2+ Xyrians share a Room, swap the least injured for a Trace token.</li></ul><h4>General rules</h4><ul><li>Only ever in <b>Rooms</b>; they move Room-to-Room ignoring Doors and Intruders (crossing a Corridor with Intruders deals 1 Hit to the largest one — this can even force Queen Health cards, resolving only their top halves).</li><li>Intruders ignore them; Characters treat them as Intruders for targeting (Shoot, Repel, “all Intruders” effects) but are <b>not in Combat</b> with them; game effects don't treat them as Intruders (no Burning, no Event movement). Secure tokens can't be placed in their Rooms.</li><li>Activation cards: Xyrians in Rooms with Characters follow the top half, all others the bottom half; injured Xyrians discard their Injury token instead. Hard limit of 3 Xyrians per game — dead ones never return.</li></ul><h4>Fighting & befriending</h4><ul><li>Shooting works as against Adults, but after any Action that deals a Hit to a Xyrian you must make a <b>Noise roll</b>. They never stand in Corridors, so no Bursting.</li><li>First “death”: discard its Hits and mark it with an Injury token. Second death: remove the model for good and flip the token into a <b>Xyrian Item</b> — pick it up (2 cards, out of Combat) to discard 1 Serious Wound, restore 3 Health (first pickup only — FAQ) and gain a random Xyrian Armor Item.</li><li><b>Statuses</b>: nasty persistent cards (max 1; a second = a Serious Wound instead), discarded per their own instructions.</li><li><b>Allegiance</b>: once per game one Character in a Room with the Available Allegiance token may pledge (1 card + the token) — its effects protect them until death removes it from the game.</li></ul>";
    },
    src: "Xyrians p.4-10 · FAQ v1.2 p.3"
  },
  {
    id: "insider",
    title: "The Insider — Story Rules",
    when: function (c) { return c.has("insider"); },
    html: function (c) {
      return "<h4>Story cards</h4><ul><li>Cards are grouped by Room name; each group is one story, and only the group matching the triggering Room is used per game. Starting Story cards have a squared number.</li><li>Resolve a Story card when the Insider-icon Exploration card is drawn, or whenever an effect says “go to #XYZ”. Resolved cards stack on the previous one so only the newest is active — except <b>dotted-line cards</b>, whose lower portion stays active under later cards.</li><li>Backs carry: Instant Effects (once, on flip), Ongoing Effects (while visible), New Actions (cost = discard N cards), and Exploration Effects (after Insider-icon Exploration cards).</li></ul><h4>The Insider herself</h4><ul><li>Enters play only when a Story card says so; without her Insider card she is completely non-interactive. She's only ever in Rooms, moves through empty Corridors only, never explores, and ignores Fire and other mechanics unless a card says otherwise.</li><li><b>Friendly side</b>: Characters in her Room draw 1 extra card in the Drawing step; an Action on her card moves her (then she makes a Noise roll); Intruders treat her as the last Character in Turn order (Larvae never attack her; Serious Wounds cost her 2 Health, Contamination does nothing; marker on the skull = she dies). FAQ: you can't heal her via interplay — she's not a Character.</li><li><b>Hostile side</b>: she and Intruders ignore each other; Characters treat her as an Intruder and can kill her like an Adult (Hits kept on her card). FAQ: Intruders do NOT avoid her Room — they stay and attack.</li><li>“Remove the Insider from the game” always means model + Insider card + all Story cards.</li><li>Objective twist: players with an <b>Official Order</b> Objective need only one of them fulfilled; an <b>Ulterior Motive</b> player must keep both Official Tasks unfulfilled.</li></ul>";
    },
    src: "Insider p.2-4 · FAQ v1.2 p.3"
  },
  {
    id: "neoflesh",
    title: "Neoflesh Cult — Bodies & the Motherbrain",
    when: function (c) { return c.race === "neoflesh"; },
    html: function (c) {
      return "<h4>Body tokens & Absorbing</h4><ul><li>3 Body tokens start on Round slots 8, 11, 14. Every Twitchling that exits through an Unexplored Corridor shifts ALL Body tokens 1 space up (closer).</li><li>Round marker meets a Body token → <b>Absorbing Bodies</b>: move the rightmost Motherbrain token from the Absorbed Bodies tile into the bag (the only way it gets there — and it never leaves while she lives), then flip the Body token onto the tile, expanding the Queen's Hits track. Her attacks also scale with Absorbed Bodies.</li></ul><h4>Cultists & Skills</h4><ul><li>The 6 Skill cards are active from the start. Killing a Cultist (by a Character) deactivates a Skill of your choice and weakens Event effects (each dead Cultist covers an icon on the Dead Cultists tile). A Cultist killed by anything else deactivates the last Skill in order.</li><li>Xyrians can kill Cultists too — no Noise roll, deactivate the last Skill in order.</li></ul><h4>Odds & ends</h4><ul><li>The Nest and Eggs are the leftover Primeblood nest — same rules as the base game" + " (but Fire doesn't destroy Neoflesh Eggs in the Burning step, which is skipped).</li><li>FAQ: Twitchlings do move toward Unexplored Corridors even from Rooms with Characters; they can enter an undiscovered Hibernatorium; the “Artificial Fever” Event ends with “Then, discard all cards from hand.”</li></ul>";
    },
    src: "Neoflesh p.4-8 · FAQ v1.2 p.2-3"
  },
  {
    id: "sschars",
    title: "Support Squad & Contractors",
    when: function (c) { return c.has("ss") || c.has("contractors"); },
    html: function (c) {
      var out = "";
      if (c.has("ss")) out += "<h4>Support Squad</h4><ul><li>Freely added to any game: shuffle in the two Character Draft cards.</li><li><b>Sharpshooter</b> — precision cards like “Taking Aim” (reroll your first Shoot/Burst roll, keep the second). FAQ: her “One by One” can't kill Drones or Ironclads (they need multi-hits).</li><li><b>UAV Operator</b> — her UAV starts with her in the Landing Zone, moves only via her Action cards, is ignored by Intruders, and can't pass Unexplored Corridors or Closed Doors (unless a card says so). Not recommended for a first game.</li></ul>";
      if (c.has("contractors")) out += "<h4>Contractors</h4><ul><li>12 draftable veterans of the first Nemesis (Lab Rat, Sentry, Hacker, Mechanic, Soldier, Scout…). 2 are laid out each game; whoever drafts one locks out all other Contractors.</li><li>A Contractor uses a 10-card deck (5 “Contractor” + 5 of their own), their 2 Character Items, and skips the Support Equipment draft.</li><li>FAQ: the Sentry's NBC suit beats the Suffocating token — gain the Oxygen first and live.</li></ul>";
      return out;
    },
    src: function (c) { return (c.has("ss") ? "Support Squad sheet" : "") + (c.has("ss") && c.has("contractors") ? " · " : "") + (c.has("contractors") ? "Contractors sheet" : "") + " · FAQ v1.2 p.3"; }
  },
  {
    id: "faq",
    title: "Key FAQ Rulings (v1.2)",
    when: function () { return true; },
    html: function (c) {
      return "<ul><li><b>Fire At Will</b> (Officer): the Officer picks their Room or a neighboring one; each Character in Turn order Bursts at a Corridor the Officer chooses (it can differ per Character), with their choice of Weapon.</li><li>Weapon die effects are <i>in addition to</i> the standard result unless the card says “instead” — an ammo-spend result still spends Ammo even if your Weapon adds an effect to it.</li><li>“Requires no Ammo” Weapons can still have Ammo “spent” from them by card effects; malfunctioned Weapons cannot.</li><li>Grenades CAN be thrown from a malfunctioned Grenade Launcher via Use Any Tactical Gear.</li><li><b>Duct Tape</b> can strap a 3rd Item into a single hand.</li><li>Reshuffling a deck “when instructed by a card” includes that card itself; Action-deck reshuffles from drawing happen before the drawn card is discarded.</li><li>Closed-Door effects block anything “through” them (Reinforcing, Commands, Bursts, Grenades) — but Noise markers pass freely.</li><li>“Resolve a Noise marker in each Unexplored Corridor” only works where markers actually exist.</li><li>Technical Corridor Entrance attacks can be Prevented like any Intruder Attack.</li><li>Autodestruction active at game end still detonates before the end-game sequence.</li></ul>";
    },
    src: "FAQ v1.2 p.2-3"
  }
];

/* ---- TEACHING SCRIPT (read aloud, ~5 min; content per the Retaliation
   rulebook, booster rulebooks and FAQ v1.2 — see references) ---------------- */
RT.teach = {
  intro: "Read this aloud — about five minutes. Weapons cold until the end.",
  sections: [
    { h: "The pitch — and how you win", body: (c) => {
      const foe = c.race === "sangre" ? "Sangrevores" : c.race === "neoflesh" ? "Neoflesh Cult" : "Primebloods";
      if (c.mode === "solocoop") return `
<p>We're a marine squad dropping into a dead facility crawling with <b>${foe}</b>. Fully cooperative: we have one shared <b>Mission Task per marine</b> and every one of them must be done, with at least one of us alive at the end. The clock is brutal: <b>fourteen rounds</b>, and our ride — the <b>Lander</b> — only arrives on round ten, if the anti-aircraft guns don't eat it.</p>`;
      return `
<p>We're a marine squad dropping into a dead facility crawling with <b>${foe}</b>. Semi-cooperative: each of us holds a <b>Private Objective and a Mission Objective</b>, keeps one during the game, and wins alone by completing it, escaping or hibernating, and passing the infection checks. The shared <b>Mission Task</b> on the table is what most Mission Objectives point at — so the squad has a job even when we don't trust each other.</p>
<p>The clock is brutal: <b>fourteen rounds</b>. Our ride — the <b>Lander</b> — arrives on round ten <i>if</i> the facility's anti-aircraft guns are off. There's also a one-seat <b>Escape Shuttle</b> deep in Section C, and the <b>Hibernatorium</b>, if someone switches it on. Count the seats. Do the math.</p>`;
    }},

    { h: "The shape of a round", body: (c) => `
<p>Your turn is <b>two actions</b>, paid with cards from your hand; then you lose <b>oxygen</b> if your section's life support is down, and burn if your room's on fire. When everyone has passed: the <b>Intruders attack</b>, an <b>Event card</b> marches them down the corridors, the <b>bag develops</b> — the hive literally breeds between rounds — and we all draw back to five cards. The round marker crawls toward whatever tokens are waiting on the track. You can see the whole countdown. That's the horror.</p>` },

    { h: "Exploring — building the map that kills you", body: (c) => {
      if (c.race === "sangre") return `
<p>The facility starts undiscovered — moving into the dark draws an <b>Exploration card</b> that builds rooms and corridors as you go. Against the Sangrevores there are <b>no noise rolls</b>: instead your movement drops <b>Shadow markers</b> in the corridors around you, and walking through Shadows later triggers a <b>Shadow card</b> — the more you crossed, the worse it gets. Move cautiously to slip through untouched, or burst-fire to clear them. The dark literally accumulates.</p>`;
      return `
<p>The facility starts undiscovered — moving into the dark draws an <b>Exploration card</b> that builds the rooms and corridors as you go. And after <b>every single move</b> you roll the <b>noise die</b>: matching corridors either spawn a noise marker, wake the marker that's already there — drawing monsters straight out of the bag — or shove whatever's lurking there into your room. <b>Secure tokens</b> soak the first attack from anything entering; <b>reinforcing</b> corridors silences them. Map discipline is life.</p>`;
    }},

    { h: "Fighting — three triggers, know them all", body: (c) => `
<p><b>Shoot</b> in your room: deal a hit, roll — crosshair kills, a low roll kills if it's already wounded, and only the ammo symbol actually spends ammo. <b>Burst</b> into a corridor: always spends ammo, sprays multiple hits — the crowd-control button. <b>Melee</b>: free, filthy — you gain a contamination card, and if it survives, it swings back. In corridors little ones die to one hit; in rooms wounds accumulate. The <b>Queen</b> is different: her health is a deck, and you'll be at it a while.</p>` },

    { h: "Your body is a resource tracker", body: (c) => `
<p>Watch three things: <b>Health</b> — serious wounds block whole sections of the track and armor breaks before you do; <b>Oxygen</b> — a dial that only goes down in dead sections, and at zero you get exactly one more turn; and <b>Contamination</b> — dead cards silting up your action deck that decide, at the very end, whether something hatches out of you. The <b>Surgery room</b> fixes most of it. Getting there is the hard part.</p>` },

    { h: "Squad boosters", when: (c) => c.has("contractors") || c.has("ss"), body: (c) => {
      const bits = [];
      if (c.has("contractors")) bits.push("a <b>Contractor</b> may be drafted — a veteran of the first Nemesis with their own ten-card action deck and two personal items; they skip the equipment draft, and only one Contractor may exist per game");
      if (c.has("ss")) bits.push("the <b>Support Squad</b> is draftable: the <b>Sharpshooter</b> rerolls her shots, and the <b>UAV Operator</b> flies a drone that only her cards can move — the intruders ignore it completely");
      return `<p>In the character pool this game: ${bits.join("; ")}.</p>`;
    }},

    { h: "Sangrevores — infection and gifts", when: (c) => c.race === "sangre", body: () => `
<p>Their touch leaves <b>Infections</b> — shuffled straight into your deck, treated as infected at the end. Pass and pay a health to purge your hand, or play the card itself away. But they also leave <b>Tainted Blood</b>: a once-a-round vampiric ability. Take the gift. Worry later.</p>` },

    { h: "Neoflesh Cult — kill the batteries", when: (c) => c.race === "neoflesh", body: () => `
<p>Four Adult breeds, each with an active <b>Skill</b> — Slashers double-tap, Ironclads soak, Crawlmines detonate, Firespitters punish bursts. The off-switch is the <b>Cultists</b>: half-alive humans wired into the walls. Kill one, turn off a Skill of your choice. Meanwhile <b>Twitchlings</b> scurry offstage to feed the <b>Motherbrain</b> — every body they deliver makes her bigger, meaner, and closer. Squash the little ones.</p>` },

    { h: "The Xyrians", when: (c) => c.has("xyrians"), body: () => `
<p>A third player at the table: <b>Xyrians</b> appear from Trace tokens and act on their own cards — hostile to us <i>and</i> the hive. They walk through doors like rumors, hurt whatever's nearest, and hurting them is loud. Kill one twice and it drops <b>alien armor</b>; or one of us can pledge <b>Allegiance</b> and buy a strange kind of peace.</p>` },

    { h: "The Insider", when: (c) => c.has("insider"), body: () => `
<p>Someone else is alive in here. The <b>Insider</b>'s story unfolds through numbered Story cards as we explore — sometimes she's an ally worth protecting, sometimes a target. Follow the cards; they always tell you what's active. Two of our objectives may hinge on her.</p>` },

    { h: "Don't worry about these yet", body: (c) => {
      const later = ["the room help sheet (it's on this page)", "the Robot", "item traits"];
      if (c.mod("deadly")) later.push("(you already know Deadly Mode: every corridor is twice as loud)");
      if (c.mode === "solocoop") later.push("revival in Surgery");
      return `<p>I'll explain ${later.join(", ")} when they come up. Opening advice: life support is the quiet killer — keep an eye on your section's oxygen — and when the Lander token hits the round marker, you want to already be standing in the Landing Zone.</p>`;
    }}
  ]
};
