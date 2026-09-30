/* =============================================================================
   Twilight Imperium 3rd Edition — Setup & Reference Utility · data
   All content is sourced from the five files in the game folder:
     Base  = Twilight Imperium 3rd Edition rulebook (2005; printed page numbers = PDF pages)
     SE    = Shattered Empire expansion rulebook, revised printing (printed page numbers = PDF pages)
     SoT   = Shards of the Throne expansion rulebook (printed page numbers = PDF pages)
     FAQ   = Twilight Imperium 3rd Edition FAQ & Errata v2.5 (3/27/2012) — the newest official ruling;
             it overrides the rulebooks where they conflict
     Variants = "Game Options and Variants" v1.1 (Imperial Musings, 2005) — no printed page numbers,
             cited by PDF page (p.1–2)
   ============================================================================= */
var T3 = {};

(function () {
  "use strict";

  T3.expMeta = {
    base: { name: "Base game",            cls: "tag-core" },
    se:   { name: "Shattered Empire",     cls: "tag-se" },
    sot:  { name: "Shards of the Throne", cls: "tag-sot" },
    faq:  { name: "FAQ & errata",         cls: "tag-faq" },
    opt:  { name: "Option",               cls: "tag-mod" },
    vari: { name: "Official variant",     cls: "tag-var" },
    fote: { name: "Fall of the Empire",   cls: "tag-fote" }
  };

  T3.expansions = [
    { id: "base", short: "Twilight Imperium 3rd Ed.", year: "2005",
      blurb: "The base game: ten races, 3–6 players, the eight Strategy Cards, and the optional rules on Base p.31–35. Always in play." },
    { id: "se", short: "Shattered Empire", year: "2006",
      blurb: "Four new races, 28 new systems (Ion Storms, Trade Stations, the Wormhole Nexus), 7–8 players, variant Strategy Cards and fifteen optional rules." },
    { id: "sot", short: "Shards of the Throne", year: "2011",
      blurb: "Three new races, Gravity Rifts, new cards and technologies, Flagships, Mechanized Units, Mercenaries, Political Intrigue and the Fall of the Empire scenario." }
  ];

  T3.modes = [
    { id: "std", name: "Standard game",
      blurb: "The race for victory points: Public and Secret Objectives, the Imperial Strategy, the Galactic Council. First to the target wins." },
    { id: "fote", name: "Fall of the Empire", requires: "sot",
      blurb: "Shards of the Throne scenario: play the last days of the Lazax Empire on a preset map, 4–6 players (7 with Shattered Empire), secret objectives and treaties, eight rounds." }
  ];

  /* ---- Races (names as the rulebooks print them) ---------------------------------------- */
  T3.races = {
    base: ["Universities of Jol Nar", "The Naalu Collective", "The L1z1x Mindnet", "The Mentak Coalition", "The Barony of Letnev",
           "The Xxcha Kingdom", "The Yssaril Tribes", "The Emirates of Hacan", "The Sardakk N’orr", "The Federation of Sol"],
    se: ["The Brotherhood of Yin", "The Clan of Saar", "The Embers of Muaat", "The Winnu"],
    sot: ["The Arborec", "The Ghosts of Creuss", "The Nekro Virus"]
  };
  // Fall of the Empire: races by player count (SoT p.14)
  T3.foteRaces = {
    4: ["Lazax", "Federation of Sol", "The Barony of Letnev", "The Emirates of Hacan"],
    5: ["Lazax", "Federation of Sol", "The Barony of Letnev", "The Emirates of Hacan", "Universities of Jol Nar"],
    6: ["Lazax", "Federation of Sol", "The Barony of Letnev", "The Emirates of Hacan", "Universities of Jol Nar", "The Xxcha Kingdom"],
    7: ["Lazax", "Federation of Sol", "The Barony of Letnev", "The Emirates of Hacan", "Universities of Jol Nar", "The Xxcha Kingdom", "Sardakk N’orr"]
  };

  /* ---- Optional rules & variants -------------------------------------------------------- */
  // grp: which book defines it (display group). set: required set(s). needs: modules switched on with it
  // (and dropped if they are later switched off). excludes: modules that cannot be combined with it.
  T3.modGroups = [
    { id: "base", name: "Base game options", src: "Base p.31–35" },
    { id: "vari", name: "Official variants sheet", src: "Variants p.1–2" },
    { id: "se",   name: "Shattered Empire options", src: "SE p.7, p.9–13" },
    { id: "sot",  name: "Shards of the Throne options", src: "SoT p.10–14" }
  ];

  T3.modules = [
    // --- Base game (Base p.31–35) ---
    { id: "longwar", grp: "base", set: "base", name: "The Long War",
      summary: "Play to 14 victory points with a 14-card Public Objective deck",
      description: "Use the 0–14 side of the Victory Point Track; the Public Objective deck is 8 Stage I + 5 Stage II + the Game Over card.",
      src: "Base p.6, p.32" },
    { id: "aoe", grp: "base", set: "base", name: "Age of Empire",
      summary: "Every Public Objective is face up from round 1 — the row is also the turn track",
      description: "All Public Objectives are laid out face up at the start; a Turn token walks along them and the game ends when it reaches Game Over. Errata: no Stage II objectives in the first three rounds.",
      src: "Base p.33 · FAQ p.1" },
    { id: "ds", grp: "base", set: "base", name: "Distant Suns",
      summary: "A face-down Domain Counter on every neutral planet: exploration with risks",
      description: "Domain Counters are revealed when you land Ground Forces; Fighters can probe and Dreadnoughts/War Suns can raze them.",
      src: "Base p.33–34, p.44" },
    { id: "leaders", grp: "base", set: "base", name: "Leaders",
      summary: "Three Leaders per race — Scientists, Diplomats, Generals, Admirals, Agents",
      description: "Leaders start in your Home System, ride with your ships and grant abilities; they can be killed, captured, executed or rescued.",
      src: "Base p.34–35" },
    { id: "sabotage", grp: "base", set: "base", name: "Sabotage Runs",
      summary: "Fighters can make a desperate pre-battle strike at an enemy War Sun",
      description: "Before a Space Battle (after Anti-Fighter Barrage), commit Fighters: 9–10 passes the outer defences, then a 10 destroys the War Sun.",
      src: "Base p.35" },
    // --- Official variants sheet (Variants p.1–2, no printed page numbers) ---
    { id: "homeworlds", grp: "vari", set: "base", name: "Homeworlds",
      summary: "No victory points of any kind while you don’t hold every planet in your Home System",
      description: "In order to acquire any victory points, regardless of the source, a player must control every planet in his Home System.",
      src: "Variants p.2" },
    { id: "star", grp: "vari", set: "base", name: "The Star in the Crown", needs: ["aoe"], excludes: ["throne"], imperialOnly: true,
      summary: "The Imperial Strategy’s primary ability gives 1 victory point instead of 2",
      description: "For groups who find the Imperial Strategy Card too dominant. The sheet says players should also play Age of Empire, so this page keeps Age of Empire on with it. The sheet forbids combining it with The Ancient Throne.",
      src: "Variants p.2" },
    { id: "throne", grp: "vari", set: "base", name: "The Ancient Throne", needs: ["aoe"], excludes: ["star"], imperialOnly: true,
      summary: "A new Imperial primary: 1 VP if you hold Mecatol Rex, plus any number of objectives next Status Phase — or a free, exclusive secondary",
      description: "Replaces the Imperial Strategy’s primary ability (the secondary is unchanged); it no longer reveals objectives. The sheet says players should also play Age of Empire, so this page keeps Age of Empire on with it. Not with The Star in the Crown.",
      src: "Variants p.2" },
    // --- Shattered Empire (SE p.7, p.9–13) ---
    { id: "larger", grp: "se", set: "se", name: "Larger galaxy (4 rings)", players: [5, 6],
      summary: "5 or 6 players: deal out more systems and build a fourth ring",
      description: "Five players deal out every tile (11 each); six players remove 1 random tile and deal 9 each, building 4 rings around Mecatol Rex.",
      src: "SE p.7 · FAQ p.11" },
    { id: "varobj", grp: "se", set: "se", name: "Variant Objectives",
      summary: "Swap in Shattered Empire’s Stage I and Stage II decks — more military objectives",
      description: "Use both new Public Objective decks instead of the original Stage I and Stage II cards.",
      src: "SE p.5, p.9" },
    { id: "rst", grp: "se", set: ["se", "sot"], name: "Race-Specific Technologies",
      summary: "Each race may buy its own unique technology (two with both expansions)",
      description: "Buy your race’s Race-Specific Technology instead of a regular one, paying the normal cost plus the card’s cost; no prerequisites, no colour.",
      src: "SE p.9 · SoT p.10 · FAQ p.10" },
    { id: "artifacts", grp: "se", set: "se", name: "Artifacts",
      summary: "Four hidden relics, each worth 1 VP to whoever holds its planet",
      description: "Players choose planets for face-down Artifact tokens (4 real, 4 dummies); holding a revealed Artifact’s planet claims its Special Objective.",
      src: "SE p.9–10 · FAQ p.8, p.11" },
    { id: "shock", grp: "se", set: "se", name: "Shock Troops",
      summary: "Ground Forces that roll a natural 10 become veteran Shock Troops (battle value 5)",
      description: "Shock Troops fight at 5, can capture enemy Space Docks and PDS after a successful invasion, and must stay with a plastic Ground Force.",
      src: "SE p.10 · FAQ p.8, p.10" },
    { id: "mines", grp: "se", set: "se", name: "Space Mines",
      summary: "Cruisers can lay mines that roll against ships entering the system",
      description: "Spend 2 resources in a Production step with a Cruiser present to place a mine; enemy ships entering roll one die each — 9 or 10 is a hit.",
      src: "SE p.10 · FAQ p.9–10" },
    { id: "nexus", grp: "se", set: "se", name: "The Wormhole Nexus",
      summary: "An off-board system adjacent to every Alpha and Beta wormhole",
      description: "The Nexus tile sits off the board; any ship using an Alpha or Beta wormhole may travel to it instead.",
      src: "SE p.5, p.10" },
    { id: "facilities", grp: "se", set: "se", name: "Facilities",
      summary: "Build Colonies (+1 influence) and Refineries (+1 resource) for 1 resource",
      description: "Built in the Produce Units step like a Space Dock, on a planet outside your Home System held all round; one per planet.",
      src: "SE p.11 · FAQ p.10" },
    { id: "tretreat", grp: "se", set: "se", name: "Tactical Retreats",
      summary: "A defender may retreat into a fresh adjacent system, paying from Strategy Allocation",
      description: "When announcing a retreat, the defender may spend a Strategy Allocation Command Counter to activate an adjacent, unactivated system without enemy units and retreat there.",
      src: "SE p.11 · FAQ p.9" },
    { id: "newds", grp: "se", set: "se", name: "New Distant Suns counters", needs: ["ds"],
      summary: "Add Shattered Empire’s Domain Counters to Distant Suns",
      description: "Fighter Ambush, Automated Defense System, Hidden Factory, Native Intelligence and Hostage Situation join the mix (switches Distant Suns on).",
      src: "SE p.6, p.11, p.20" },
    { id: "terrds", grp: "se", set: "se", name: "Territorial Distant Suns", needs: ["ds", "newds"],
      summary: "Low-risk Domain Counters near the Home Systems and on the outer ring",
      description: "A “low-risk” pile goes on outer-ring planets and planets adjacent to Home Systems; everything else is mixed on the rest. Its pile names Shattered Empire counters, so the new counters are switched on too.",
      src: "SE p.11" },
    { id: "custodians", grp: "se", set: "se", name: "Custodians of Mecatol Rex",
      summary: "Mecatol Rex defends itself: 3 Fighters and 2 Ground Forces",
      description: "Both Custodian tokens start on Mecatol Rex; an invader must beat the Fighter Ambush and then the Hostile Locals.",
      src: "SE p.6, p.11 · FAQ p.11" },
    { id: "voice", grp: "se", set: "se", name: "Voice of the Council",
      summary: "A floating 1-VP Special Objective, won by a vote before each Council",
      description: "Before resolving the Political (or Assembly) primary ability, the active player may call a vote; the winner takes the Voice of the Council Objective and its 1 VP.",
      src: "SE p.11 · FAQ p.10" },
    { id: "early", grp: "se", set: "se", name: "Simulated Early Turns",
      summary: "Skip the slow opening: claim territory and buy extra units before round 1",
      description: "After setup, claim 2 systems, spend Home System resources + 3 on units and/or one technology, place units, take planets, reveal an objective and run an abbreviated Status Phase.",
      src: "SE p.12–13 · FAQ p.9, p.11" },
    // --- Shards of the Throne (SoT p.10–14) ---
    { id: "prelim", grp: "sot", set: "sot", name: "Preliminary Objectives",
      summary: "Start with an easier 1-VP objective instead of a Secret Objective",
      description: "Deal each player a Preliminary Objective instead of a Secret one; completing it draws a Secret Objective.",
      src: "SoT p.10 · FAQ p.14" },
    { id: "flagships", grp: "sot", set: "sot", name: "Flagships",
      summary: "Each race can build one unique Flagship in its Home System",
      description: "Cost, combat value, movement, capacity and ability are on your race’s Flagship card; only one on the board at a time.",
      src: "SoT p.10 · FAQ p.12–13" },
    { id: "frontier", grp: "sot", set: "sot", name: "The Final Frontier",
      summary: "Space Domain Counters hide surprises in systems with no planets",
      description: "A face-down Space Domain Counter goes in each empty system (not Special Systems); it is revealed when units end their move there.",
      src: "SoT p.11, p.24 · FAQ p.15" },
    { id: "mechs", grp: "sot", set: "sot", name: "Mechanized Units",
      summary: "Tough ground units that sustain damage (4 per player, cost 2)",
      description: "Mechanized Units land and hold planets like Ground Forces, take one hit before dying and are repaired in the Status Phase.",
      src: "SoT p.11 · FAQ p.13" },
    { id: "mercs", grp: "sot", set: "sot", name: "Mercenaries",
      summary: "Hire Mercenaries with the Trade III Strategy Card (it replaces Trade)",
      description: "Trade III’s primary pays upkeep and recruits 1 of the top 2 Mercenaries; Mercenaries have Evasion and their own abilities.",
      src: "SoT p.12, p.20 · FAQ p.13–14" },
    { id: "intrigue", grp: "sot", set: "sot", name: "Political Intrigue",
      summary: "Representatives, Spies and binding Promissory Notes in the Galactic Council",
      description: "Uses Political II (or Assembly II with Shattered Empire’s variant set); each player gets 3 Representatives and 5 Promissory Notes.",
      src: "SoT p.12–14, p.20 · FAQ p.12, p.14–15" }
  ];

  /* ---- Strategy Cards (text transcribed from the card pictures; rulings from the summaries) ---- */
  T3.scards = {
    initiative: { n: 1, name: "Initiative", set: "base", src: "Base p.36",
      special: "After selecting this card, claim the Speaker token. During the Action Phase you do not pay Command Counters from your Strategy Allocation area to execute the secondary abilities of Strategy Cards. You may not select Initiative during the next Strategy Phase. You take no Strategic Action this round." },
    diplomacy: { n: 2, name: "Diplomacy", set: "base", src: "Base p.36",
      primary: ["Diplomatic Envoy", "Name an opponent. For the rest of this phase, neither you nor that opponent may activate a system containing units of the other player (including Ground Forces and PDS)."],
      secondary: ["Economic Stimulus", "Spend 1 Command Counter from your Strategy Allocation area to refresh up to two of your exhausted (non-Home System) Planet Cards."],
      notes: ["The block is only on activation: PDS fire and other effects are not restricted (FAQ p.6)."] },
    political: { n: 3, name: "Political", set: "base", src: "Base p.37",
      primary: ["The Galactic Council", "Draw 3 Action Cards and receive 1 Command Counter from your reinforcements. Then draw the top Political Card and resolve its agenda. Afterwards, secretly look at the top 3 Political Cards: put 1 face down on top of the deck and the rest on the bottom."],
      secondary: ["Seek Destiny", "Spend 1 Command Counter from your Strategy Allocation area to draw 1 Action Card."] },
    logistics: { n: 4, name: "Logistics", set: "base", src: "Base p.37",
      primary: ["Comprehensive Operations", "Receive 4 Command Counters from your reinforcements."],
      secondary: ["Domestic Mandate", "Spend influence to receive Command Counters from your reinforcements: 1 Command Counter for every 3 influence spent."],
      notes: ["Special rule: no Strategy Allocation Command Counter is needed for this secondary ability (Base p.10, p.37)."] },
    trade: { n: 5, name: "Trade", set: "base", src: "Base p.37",
      primary: ["Influence on the Merchant’s Guild", "Choose one: <b>a)</b> immediately receive 3 Trade Goods, then Trade Goods for your active trade agreements; finally open trade negotiations among all players — you must approve every new agreement. <b>b)</b> Cancel all trade agreements: every Trade Contract (Hacan included) returns to its owner."],
      secondary: ["Commerce", "Spend 1 Command Counter from your Strategy Allocation area to receive Trade Goods for your active trade agreements."],
      notes: ["No one collects on an agreement formed during the same action (Base p.25, p.37)."] },
    warfare: { n: 6, name: "Warfare", set: "base", src: "Base p.38",
      primary: ["Major Offensive", "Immediately retrieve one of your Command Counters from the board and place it back in your Command Pool."],
      secondary: ["Patrols", "Spend 1 Command Counter from your Strategy Allocation area to choose one or two of your Destroyers/Cruisers anywhere on the board. Each may move to an adjacent empty (non-Home) system; then place one Command Counter from your reinforcements in each destination system."],
      notes: ["The ships may move even from an activated system, and into an already-activated empty system (no new counter is placed there) — Base p.38.", "Stasis Capsules don’t let you load or land Ground Forces with it (FAQ p.7)."] },
    technology: { n: 7, name: "Technology", set: "base", src: "Base p.38",
      primary: ["Technological Breakthrough", "Receive 1 Technology advance (for which you have the prerequisites)."],
      secondary: ["Research and Development", "Spend 1 Command Counter from your Strategy Allocation area and 8 resources to receive 1 Technology advance (for which you have the prerequisites)."],
      notes: ["The secondary buys only one advance (FAQ p.6)."] },
    imperial: { n: 8, name: "Imperial", set: "base", src: "Base p.38",
      primary: ["Imperial Claim", "Draw the top card of the Objective Deck and place it face up in the common play area. Then receive 2 victory points."],
      secondary: ["Rapid Mobilization", "Spend 1 Command Counter from your Strategy Allocation area to immediately build units in one of your systems containing one or more friendly Space Docks — even if you have already activated it. Building here does not activate the system."],
      notes: ["If the Game Over card is drawn the game ends immediately — before the 2 victory points (Base p.14, p.38).", "Reaching the winning total with the primary ability wins at once (FAQ p.8).", "The secondary only builds units at your Space Docks there, following the normal Space Dock rules — it can’t place a new Space Dock (FAQ p.6)."] },
    // --- Shattered Empire variant set (SE p.14–16) ---
    leadership: { n: 1, name: "Leadership", set: "se", src: "SE p.14",
      primary: ["Take Charge", "Receive 3 Command Counters from your reinforcements. You may then immediately use this card’s secondary ability."],
      secondary: ["Masterful Tactician", "Spend influence to buy Command Counters from your reinforcements: 1 Command Counter for every 2 influence spent."],
      notes: ["No Strategy Allocation Command Counter is needed for this secondary ability (SE p.14).", "Players are limited in how many they can buy: the summary’s example is 3 free plus “up to 3 more” for the active player (SE p.14). (The limit’s line on the card picture is obscured in the PDF.)", "The card’s number gives its holder first place in the order of play (SE p.14)."] },
    diplomacy2: { n: 2, name: "Diplomacy II", set: "se", src: "SE p.14",
      primary: ["Demilitarized Zone", "Choose one: <b>a)</b> choose a system containing a planet you control; each opponent must place one of his Command Counters into it from his reinforcements (from any area of his race sheet if none are left). <b>b)</b> Execute this card’s secondary ability without paying a Command Counter or any influence."],
      secondary: ["Peaceful Annexation", "Spend 1 Command Counter from your Strategy Allocation area and 3 influence to claim an empty planet (no Ground Forces, Leaders, PDS or Space Docks) adjacent to a system you control — even another player’s. Place your Control Marker; take its Planet Card exhausted."],
      notes: ["No one may annex a planet another player annexed this turn, and no one may annex Mecatol Rex (SE p.14).", "A Distant Suns counter on an annexed planet is removed without effect; an Artifact there is revealed after you take control; wormholes don’t make planets adjacent for annexing (FAQ p.9).", "Ships may still retreat into a system targeted by option a (FAQ p.9).", "Xxcha: using his ability to execute the primary costs a Strategy Allocation Command Counter (SE p.14)."] },
    assembly: { n: 3, name: "Assembly", set: "se", src: "SE p.14–15",
      primary: ["Senate", "Draw 1 Political Card and 2 Action Cards. Then choose one (not <b>a</b> if you are already the Speaker): <b>a)</b> claim the Speaker token and choose one other player to play a Political Card and resolve its agenda; <b>b)</b> choose one other player (not the current Speaker) to claim the Speaker token, then play a Political Card from your hand and resolve its agenda."],
      secondary: ["Morale Boost", "Spend 1 Command Counter from your Strategy Allocation area to refresh any number of your Planet Cards whose combined resource and influence values total 6 or less (Home System planets included)."],
      notes: ["A player told to play a Political Card with none in hand draws the top card of the deck and plays it (SE p.15)."] },
    production: { n: 4, name: "Production", set: "se", src: "SE p.15",
      primary: ["Tight Deadlines", "Immediately build units in one of your systems containing one or more friendly Space Docks, receiving 2 additional resources to build with — even if you already activated the system. Building here does not activate it."],
      secondary: ["Double Efforts", "Spend 1 Command Counter from your Strategy Allocation area to immediately build up to 3 units in one of your systems containing one or more friendly Space Docks — even if already activated. Does not activate the system."],
      notes: ["Neither ability may exceed the planet’s production capacity (SE p.15).", "The primary cannot build a Space Dock (FAQ p.9); the secondary can build at every Space Dock in the chosen system, Sarween Tools included (FAQ p.9)."] },
    trade2: { n: 5, name: "Trade II", set: "se", src: "SE p.15",
      primary: ["Free Trade", "Receive 3 Trade Goods, or cancel up to 2 trade agreements (never Hacan agreements). Then every player receives Trade Goods for his active trade agreements — players other than you receive 1 fewer in total. Finally open trade negotiations; you must approve every new agreement."],
      secondary: null,
      notes: ["Trade II has no secondary ability: everyone collects during the primary without spending a Command Counter (SE p.15)."] },
    warfare2: { n: 6, name: "Warfare II", set: "se", src: "SE p.16",
      primary: ["High Alert", "Place the High Alert token in a system. Your ships in that system gain +1 movement and +1 on all combat rolls. If you move ships out of it, you may move the token with them. Remove the token at the start of the next Status Phase."],
      secondary: ["Reinforce", "Spend 1 Command Counter from your Strategy Allocation area to move up to two of your ships from unactivated systems into adjacent systems you control. The destination systems are not activated."],
      notes: ["The +1 is for the Space Battle only — not pre-combat abilities, not Ground Forces in Invasion Combat (SE p.16). Ships starting an activation in the token’s system get +1 movement whether or not the token moves with them (FAQ p.9).", "The secondary triggers no PDS fire, and may not pick up or land Ground Forces; carried Fighters don’t count toward the two ships (SE p.16 · FAQ p.9)."] },
    technology2: { n: 7, name: "Technology II", set: "se", src: "SE p.16",
      primary: ["Technological Focus", "Receive 1 Technology advance. You may then buy a second advance for 8 resources. You need the prerequisites for each (the first may be a prerequisite of the second)."],
      secondary: ["Advanced Development", "Spend 1 Command Counter from your Strategy Allocation area and 6 resources to receive 1 Technology advance (for which you have the prerequisites)."],
      notes: ["Jol-Nar may use their ability with this secondary: one free advance, a second for 6 resources and a third for 8 (SE p.16)."] },
    bureaucracy: { n: 8, name: "Bureaucracy", set: "se", src: "SE p.16",
      special: "When selected: reveal Objective cards equal to the number of Bonus Counters on this card.",
      primary: ["Senatorial Control", "Receive 1 Command Counter from your reinforcements. Draw the top two Objective cards: place one face up in the common play area and the other back on top of the deck. You may then immediately claim one face-up Public Objective you qualify for."],
      secondary: ["New Agendas", "Spend 1 Command Counter from your Strategy Allocation area to draw 1 Political Card and 1 Action Card."],
      notes: ["You may still claim another Public Objective in the Status Phase; never a Secret Objective. Reaching the winning total ends the game at once. If Imperium Rex is revealed the game ends before you claim (SE p.16).", "Recommended: play to 1 fewer victory point with Bureaucracy (SE p.9, p.16)."] },
    imperial2: { n: 8, name: "Imperial II", set: "se", src: "SE p.17",
      primary: ["The Ancient Throne", "Choose one: <b>a)</b> during the upcoming Status Phase you may qualify for any number of Public Objectives; also, if you control Mecatol Rex, immediately gain 1 victory point. <b>b)</b> Execute this card’s secondary ability for free; no other player may execute it."],
      secondary: ["Rapid Mobilization", "Spend 1 Command Counter from your Strategy Allocation area to build at one of your Space Docks (even if the system is already activated). This does not activate the system."],
      notes: ["Must be played with Age of Empire; it replaces only the original Imperial card and cannot be swapped with Bureaucracy (SE p.9, p.17)."] },
    // --- Shards of the Throne (SoT p.20–21) ---
    trade3: { n: 5, name: "Trade III", set: "sot", src: "SoT p.12, p.20",
      primary: ["Merchants and Mercenaries", "Open trade negotiations among all players (you approve every new agreement). All players then receive Trade Goods from active trade agreements — even ones just formed. Then each player pays 1 Trade Good for each of his Mercenaries or discards it. Finally, you may recruit 1 of the top 2 Mercenary cards."],
      secondary: ["Free Commerce", "Spend 1 Command Counter from your Strategy Allocation area to break a trade agreement between any 2 other players and gain 1 Trade Good."],
      notes: ["Recruiting: keep one of the two, put the other secretly on the bottom; place its token ground side up on a planet you control (SoT p.12). The Hacan are immune to the secondary (SoT p.20)."] },
    political2: { n: 3, name: "Political II", set: "sot", src: "SoT p.12–13, p.20",
      primary: ["Summon the Councilors", "Choose 1 of the face-up Political Cards and resolve it: 1) choose Representatives; 2) resolve Spies; 3) resolve bargaining and Promissory Notes; 4) resolve voting & outcome; 5) draw a new Political Card to replace it."],
      secondary: ["Subterfuge", "Spend 1 Command Counter from your Strategy Allocation area and 2 influence to draw 2 Action Cards."] },
    assembly2: { n: 3, name: "Assembly II", set: "sot", src: "SoT p.13, p.20 · FAQ p.12, p.15",
      primary: ["Assembly of Councilors", "Draw 2 Political Cards. Then: 1) choose a player to resolve 1 Political Card from his hand; 2) give the Speaker token to any player except the chosen one; 3) choose Representatives; 4) resolve Spies; 5) bargaining and Promissory Notes; 6) resolve voting & outcome."],
      secondary: ["Rally Support", "Spend 1 Command Counter from your Strategy Allocation area to draw 1 Action Card and refresh 1 planet outside your Home System."],
      notes: ["Errata: the primary draws <b>two</b> Political Cards (FAQ p.12 corrects SoT p.20). If you are already the Speaker you may keep the token and choose another player to pick the agenda (FAQ p.15)."] },
    civilization: { n: 3, name: "Civilization", set: "sot", src: "SoT p.21",
      primary: ["Power of the People", "<b>Lazax:</b> draw the top 2 Agenda cards, keep 1 and discard the other, then choose any result on it — no voting. <b>Any other race:</b> draw the top 2 Agenda cards, choose 1 to vote on and discard the other."],
      secondary: ["Subterfuge", "Spend 1 Command Counter from your Strategy Allocation area and 2 influence to draw 2 Action Cards."] },
    industry: { n: 8, name: "Industry", set: "sot", src: "SoT p.21",
      primary: ["Accelerated Economy", "Choose one: <b>a)</b> receive 1 free Space Dock on a planet you control — even one whose Planet Card you gained this round; <b>b)</b> receive up to 4 resources’ worth of free units in an activated system you control that contains a Space Dock (even one built this round)."],
      secondary: ["Fabrication", "Spend 1 Command Counter from your Strategy Allocation area to receive up to 2 resources’ worth of free units in an activated system you control that contains a Space Dock (even one built this round)."] }
  };

  // The eight Strategy Card slots. Same-name pairs may be swapped (SE p.9 "Optional Strategy Card Replacement").
  T3.slotDefs = [
    { n: 1, orig: "initiative", vari: "leadership" },
    { n: 2, orig: "diplomacy",  vari: "diplomacy2", same: true },
    { n: 3, orig: "political",  vari: "assembly" },
    { n: 4, orig: "logistics",  vari: "production" },
    { n: 5, orig: "trade",      vari: "trade2", same: true },
    { n: 6, orig: "warfare",    vari: "warfare2", same: true },
    { n: 7, orig: "technology", vari: "technology2", same: true },
    { n: 8, orig: "imperial",   vari: "bureaucracy", origAlt: "imperial2" }
  ];

  /* ---- Shared configuration logic (used by app.js and the test harness) ---------------- */
  T3.playerRange = function (st) {
    const se = st.exps.has("se");
    if (st.mode === "fote") return [4, se ? 7 : 6];        // SoT p.14
    return [3, se ? 8 : 6];                                 // Base p.4 · SE p.8
  };

  // The cards chosen by set and swaps, before Shards of the Throne's option cards replace any of them
  T3.rawDeck = function (st) {
    if (st.mode === "fote")                                 // SoT p.14: Civilization for Political, Industry for Imperial
      return ["initiative", "diplomacy", "civilization", "logistics", "trade", "warfare", "technology", "industry"];
    const v = st.scset === "var";
    return T3.slotDefs.map(function (s) {
      let id = v ? s.vari : s.orig;
      if (s.same && st.swaps.has(s.n)) id = v ? s.orig : s.vari;
      if (s.n === 8 && !v && st.swaps.has(8)) id = "imperial2";
      return id;
    });
  };
  T3.deckOf = function (st) {
    const raw = T3.rawDeck(st);
    if (st.mode === "fote") return raw;
    return raw.map(function (id, i) {
      if (i === 2 && st.mods.has("intrigue")) return (id === "assembly") ? "assembly2" : "political2";   // SoT p.12
      if (i === 4 && st.mods.has("mercs")) return "trade3";                                               // SoT p.12
      return id;
    });
  };

  function setOk(mod, st) {
    const sets = Array.isArray(mod.set) ? mod.set : [mod.set];
    return sets.some(function (x) { return st.exps.has(x); });
  }

  // "" if the module can be switched on now, otherwise the reason it can't.
  T3.modBlock = function (mod, st) {
    if (!setOk(mod, st)) return "Needs " + (Array.isArray(mod.set) ? "Shattered Empire or Shards of the Throne" : T3.expMeta[mod.set].name);
    if (st.mode === "fote") return mod.id === "mechs"
      ? "Always used in Fall of the Empire (SoT p.15)"
      : "Fall of the Empire allows no other optional rules (SoT p.15)";
    if (mod.players && mod.players.indexOf(st.players) === -1) return "Only with " + mod.players.join(" or ") + " players (SE p.7)";
    if (mod.imperialOnly && (st.scset === "var" || st.swaps.has(8)))
      return "Changes the original Imperial Strategy Card — not in play with " + (st.scset === "var" ? "the variant set’s Bureaucracy" : "Imperial II (which already prints The Ancient Throne)");
    return "";
  };
  T3.modAvailable = function (mod, st) { return T3.modBlock(mod, st) === ""; };

  T3.normalize = function (st) {
    st.exps.add("base");
    if (st.mode === "fote" && !st.exps.has("sot")) st.mode = "std";
    const r = T3.playerRange(st);
    if (st.players < r[0]) st.players = r[0];
    if (st.players > r[1]) st.players = r[1];
    if (!st.exps.has("se") || st.mode === "fote") { st.scset = "orig"; st.swaps.clear(); }
    if (st.scset === "var") st.swaps.delete(8);
    if (st.mode === "fote") { st.mods.clear(); st.mods.add("mechs"); return; }   // SoT p.15: Mechanized Units always, nothing else
    let changed = true;
    while (changed) {
      changed = false;
      for (const m of T3.modules) {
        if (!st.mods.has(m.id)) continue;
        const needsMissing = (m.needs || []).some(function (x) { return !st.mods.has(x); });
        if (!T3.modAvailable(m, st) || needsMissing) { st.mods.delete(m.id); changed = true; }
      }
    }
    if (st.mods.has("star") && st.mods.has("throne")) st.mods.delete("star");   // Variants p.2
    if (st.swaps.has(8) && !st.mods.has("aoe")) st.swaps.delete(8);            // SE p.9: Imperial II needs Age of Empire
  };

  T3.ctx = function (st) {
    const deck = T3.deckOf(st);
    const fote = st.mode === "fote";
    return {
      has: function (id) { return st.exps.has(id); },
      mode: st.mode,
      fote: fote,
      p: st.players,
      mod: function (id) { return st.mods.has(id); },
      deck: deck,
      raw: T3.rawDeck(st),
      uses: function (id) { return deck.indexOf(id) !== -1; },
      varSC: !fote && st.scset === "var",
      swapped: !fote && st.swaps.size > 0
    };
  };

  // Merge citations: one entry per document, pages in order, duplicates and pages inside a range dropped.
  // e.g. ["Base p.6", "Base p.34", "SoT p.10", "Base p.6"] -> "Base p.6, p.34 · SoT p.10"
  T3.cite = function (items) {
    const DOC = /^(Base|SE|SoT|FAQ|Variants) (p\..+)$/;
    const order = [], pages = {};
    items.filter(Boolean).forEach(function (it) {
      String(it).split(" · ").forEach(function (part) {
        part = part.trim();
        if (!part) return;
        const m = part.match(DOC);
        const doc = m ? m[1] : part;
        if (!pages[doc]) { pages[doc] = []; order.push(doc); }
        if (m) m[2].split(/,\s*/).forEach(function (pg) { if (pages[doc].indexOf(pg) === -1) pages[doc].push(pg); });
      });
    });
    const first = function (pg) { const x = pg.match(/\d+/); return x ? +x[0] : 999; };
    const range = function (pg) { const x = pg.match(/^p\.(\d+)–(\d+)$/); return x ? [+x[1], +x[2]] : null; };
    return order.map(function (doc) {
      if (!pages[doc].length) return doc;
      const rs = pages[doc].map(range).filter(Boolean);
      const keep = pages[doc].filter(function (pg) {
        if (range(pg) || !/^p\.\d+$/.test(pg)) return true;
        const n = first(pg);
        return !rs.some(function (r) { return n >= r[0] && n <= r[1]; });
      });
      keep.sort(function (a, b) { return first(a) - first(b); });
      return doc + " " + keep.join(", ");
    }).join(" · ");
  };

  // Victory point target (Base p.4 · p.32 Long War · SE p.9/p.16 Bureaucracy recommendation)
  T3.vp = function (c) { return (c.mod("longwar") ? 14 : 10) - (c.uses("bureaucracy") ? 1 : 0); };
  T3.bonusCount = function (p) { return { 3: 2, 4: 0, 5: 3, 6: 2, 7: 1, 8: 0 }[p]; };
  T3.cardName = function (id) { return T3.scards[id] ? T3.scards[id].name : id; };
})();

/* =============================================================================
   SETUP PHASES — c = { has(set), mode, fote, p, mod(id), deck, uses(card), varSC, swapped }
   Base setup is Base p.6–8 (steps 1–11 plus the "Creating the Galaxy" sidebar).
   ============================================================================= */
(function () {
  "use strict";
  const ul = (a) => "<ul>" + a.filter(Boolean).map((x) => "<li>" + x + "</li>").join("") + "</ul>";
  const cite = (a) => T3.cite(a);
  const words = { 1: "one", 2: "two", 3: "three", 4: "four", 5: "five", 6: "six", 7: "seven", 8: "eight" };
  const list = (a) => a.length < 2 ? a.join("") : a.slice(0, -1).join(", ") + " and " + a[a.length - 1];

  // Tiles dealt to each player and how they are prepared (Base p.8, p.31–32 · SE p.7–8 · SoT p.9 · FAQ p.8, p.12, p.15)
  function tileSetup(c) {
    const p = c.p, se = c.has("se"), sot = c.has("sot"), big = c.mod("larger");
    const faceDown = (p >= 7) ? 4 : (p === 5 && !big ? 1 : 0);
    const deal = big ? (p === 5 ? 11 : 9) : { 3: 8, 4: 8, 5: 6, 6: 5, 7: 7, 8: 6 }[p];
    const it = [];
    const src = [];
    const dealText = (pool) => (faceDown ? "The first player places <b>" + faceDown + " random system" + (faceDown > 1 ? "s" : "") + " face down</b> next to Mecatol Rex, in " + (faceDown > 1 ? "positions" : "a position") + " of his choice, then deals the other " + (pool - faceDown) + ": " : "Deal them out: ") + "<b>" + deal + " systems to each player</b>, face down. Look at yours but keep them hidden.";
    // SE p.5: "systems" never include the Wormhole Nexus; with its option it is placed off the board (SE p.10), never dealt
    const nexusNote = "Keep the Wormhole Nexus out of these systems — it is never dealt" + (c.mod("nexus") ? "; with its option it goes off the board (a later step)" : "") + " (SE p.5" + (c.mod("nexus") ? ", p.10" : "") + ").";
    if (sot) {
      const t = { 3: [3, 5, 16, 0], 4: [4, 8, 20, 0], 5: [4, 8, 20, 1], 6: [4, 8, 20, 2], 7: [9, 12, 34, 2], 8: [9, 12, 34, 3] };
      const v = big ? (p === 5 ? [9, 12, 34, 0] : [9, 12, 34, 1]) : t[p];
      const pool = v[0] + v[1] + v[2] - v[3];
      it.push("Sort every non-Home System tile into three piles: <b>Special Systems</b> (red inner border), <b>empty systems</b> (no planets) and <b>Regular Systems</b> (all the rest).");
      it.push((big ? "<b>Larger galaxy (4 rings):</b> w" : "W") + "ithout looking, deal <b>" + v[0] + " Special, " + v[1] + " empty and " + v[2] + " Regular Systems</b> into a galaxy pile and shuffle it" + (v[3] ? ", then <b>remove " + v[3] + "</b> at random" : "") + ". Everything else goes back in the box unseen." +
        (p >= 7 ? " <i>(Errata: remove " + v[3] + ", not the " + (p === 7 ? 4 : 5) + " printed on SoT p.9 — FAQ p.12.)</i>" : ""));
      it.push(dealText(pool));
      it.push("Everra and Cormund count as Special Systems when sorting (FAQ p.15)." + (!se ? "" : " " + nexusNote));
      src.push("SoT p.9", "FAQ p.15");
      if (p >= 7) src.push("FAQ p.12");
      if (faceDown && p === 5) src.push("Base p.32");
      if (p >= 7) src.push("SE p.8");
      if (se) src.push(c.mod("nexus") ? "SE p.5, p.10" : "SE p.5");
      if (big) src.push("SE p.7");
    } else if (se && p >= 7) {
      const rm = p === 7 ? 2 : 3;
      it.push("The first player shuffles the <b>55</b> systems left after the Home Systems and Mecatol Rex are set aside (not the Wormhole Nexus), then <b>removes " + rm + "</b> at random, unseen.");
      it.push(dealText(55 - rm));
      it.push("<i>Errata: ignore any older instruction to “first remove 2 random systems” — only the removals above apply (FAQ p.8).</i>");
      src.push("SE p.5, p.8", "FAQ p.8");
    } else if (se && big) {
      it.push("<b>Larger galaxy (4 rings):</b> " + (p === 5
        ? "deal out <b>every</b> system — <b>11 to each player</b>. Unlike the standard 5-player game, no random system goes face down next to Mecatol Rex."
        : "remove <b>1</b> random system unseen, then deal out the rest — <b>9 to each player</b>."));
      it.push(nexusNote);
      src.push("SE p.5, p.7");
      if (c.mod("nexus")) src.push("SE p.10");
    } else if (se) {
      const r = { 3: [7, 6, 18, 0], 4: [4, 5, 14, 0], 5: [4, 5, 14, 1], 6: [4, 5, 14, 2] }[p];
      it.push("Instead of the base game’s removals, the first player removes at random, unseen: <b>" + r[0] + " empty systems, " + r[1] + " Special Systems and " + r[2] + " Regular Systems</b> (with planets)" + (r[3] ? ", and <b>" + r[3] + " more random system" + (r[3] > 1 ? "s" : "") + "</b>" : "") + ".");
      it.push(dealText(55 - r[0] - r[1] - r[2] - r[3]));
      it.push(nexusNote);
      src.push("SE p.5, p.7");
      if (c.mod("nexus")) src.push("SE p.10");
      if (p === 5) src.push("Base p.32");
    } else {
      if (p === 3) {
        it.push("Before shuffling, remove <b>3 empty systems</b> (starfield, no planets) and <b>1 Asteroid Field</b>. Shuffle the other 28 and remove <b>4</b> more at random, unseen.");
        it.push(dealText(24));
        src.push("Base p.31");
      } else if (p === 4) {
        it.push("Shuffle the remaining <b>32</b> systems — remove none.");
        it.push(dealText(32));
        src.push("Base p.31");
      } else if (p === 5) {
        it.push("Shuffle the remaining <b>32</b> systems and remove <b>1</b> at random, unseen.");
        it.push(dealText(31));
        src.push("Base p.32");
      } else {
        it.push("The first player shuffles the remaining <b>32</b> systems and removes <b>2</b> at random, unseen.");
        it.push(dealText(30));
        src.push("Base p.8");
      }
    }
    return { items: it, src: src };
  }

  const diagram = (p) => ({ 3: ["galaxy-3p.webp", 295, 340, "Base p.32"], 4: ["galaxy-4p.webp", 290, 340, "Base p.32"], 5: ["galaxy-5p.webp", 317, 340, "Base p.32"], 6: ["galaxy-6p.webp", 311, 340, "Base p.8"], 7: ["galaxy-7p.webp", 339, 340, "SE p.8"], 8: ["galaxy-8p.webp", 317, 340, "SE p.8"] })[p];

  T3.phases = [
    /* ------------------------------------------------------------------ */
    {
      title: "Races, colours & the common play area",
      steps: [
        { when: (c) => !c.fote, exp: (c) => (c.has("se") || c.has("sot")) ? (c.has("sot") ? "sot" : "se") : "base",
          t: "Draw Home Systems to decide your races",
          d: (c) => {
            const pool = T3.races.base.concat(c.has("se") ? T3.races.se : [], c.has("sot") ? T3.races.sot : []);
            return ul([
              "Separate the Home Systems (yellow inner border) from the other tiles. Shuffle them face down and let every player draw one at random — <b>that is your race</b> for the whole game.",
              "In the draw (" + pool.length + "): " + list(pool) + "." + (c.has("sot") ? " Leave out the <b>Lazax</b> Home System (Shards of the Throne’s variant Mecatol Rex, which has a Home System border): the Lazax are only played in the Fall of the Empire scenario." : ""),
              "Take your race’s <b>Race Sheet, Control Markers, 2 Trade Cards and 16 Command Counters</b>. Lay both Trade Cards <b>Trade Contract side up</b> in your play area.",
              "Unused Home Systems go back in the box.",
              c.has("sot") ? "<b>Ghosts of Creuss:</b> two Home System tiles joined by a “D” wormhole. Only the hexagonal tile goes into the galaxy; the other sits in front of the player. Both count as Home Systems." : "",
              (c.has("sot") && !c.has("se")) ? "Shards of the Throne cards marked with a Shattered Empire race symbol are only for games with Shattered Empire — leave them in the box." : ""
            ]);
          },
          src: (c) => cite(["Base p.4, p.6, p.17–18, p.24, p.31", c.has("se") ? "SE p.6" : "", c.has("sot") ? "SoT p.6, p.8–9" : ""]) },
        { when: (c) => c.fote, exp: "fote",
          t: "Fall of the Empire — the races are fixed",
          d: (c) => ul([
            "Play exactly these races — players choose among them: <b>" + list(T3.foteRaces[c.p]) + "</b>.",
            "The <b>Lazax</b> player always sits to the <b>left of the Federation of Sol</b> player. Treaty Cards that refer to the player on someone’s left or right always ignore the Lazax.",
            "Take your Race Sheet, Control Markers, Trade Contracts and Command Counters as normal; the Lazax sheet and pieces come in Shards of the Throne. The Lazax begin the game controlling Mecatol Rex.",
            c.p === 7 ? "<i>Seven players — this page’s reading:</i> SoT p.14 allows a seventh player only with Shattered Empire, yet p.15 bars every Shattered Empire component, so take just the seventh colour (its plastic and its grey or orange Technology deck) from Shattered Empire and use no other Shattered Empire rule or component." : ""
          ]),
          src: (c) => cite(["SoT p.6, p.14–15", c.p === 7 ? "SE p.5, p.8" : ""]) },
        { when: () => true, exp: (c) => (c.mod("mechs") || c.mod("flagships") || (c.mod("rst") && c.has("sot"))) ? "sot" : ((c.has("se") || c.mod("rst")) ? "se" : "base"),
          t: "Colours, plastic units and Technology decks",
          d: (c) => {
            const rstCount = (c.has("se") && c.has("sot")) ? "two cards" : "one card";
            return ul([
              "Each player chooses a colour and takes its <b>plastic units</b> and its <b>Technology deck</b>." + (c.p >= 7 ? " With " + c.p + " players " + (c.p === 7 ? "the seventh colour (grey or orange, with its own Technology deck) comes" : "the two extra colours (grey and orange, each with its own Technology deck) come") + " from Shattered Empire" + (c.fote ? " — in this scenario the only Shattered Empire components used (this page’s reading of SoT p.14–15; see the races step)" : "") + "." : ""),
              c.has("se") && !c.fote ? "<b>Shattered Empire:</b> mix its 7 new Technology Cards into each colour’s deck and remove the old Advanced Fighters, Micro Technology and Assault Cannon, which they replace — each deck then holds one copy of each technology. The grey and orange decks need no changes." : "",
              c.has("sot") ? "<b>Shards of the Throne:</b> mix its 4 new Technology Cards into each colour’s deck" + (c.has("se") && (!c.fote || c.p === 7) ? " (grey and orange included)." : " (its grey and orange cards are only for Shattered Empire’s plastic).") : "",
              c.mod("mechs") ? "<b>Mechanized Units:</b> each player also takes the <b>4 Mechanized Units</b> of his colour." : "",
              c.mod("flagships") ? "<b>Flagships:</b> each player takes his race’s <b>Flagship card</b> and the plastic Flagship of his colour." : "",
              c.mod("rst") ? "<b>Race-Specific Technologies:</b> each player takes his race’s " + rstCount + "." +
                (c.has("se") && c.has("sot") ? " Use Shards of the Throne’s replacement Berserker Genome (renamed <i>Valkyrie Armor</i> by the FAQ) and Bioptic Recyclers instead of Shattered Empire’s." : "") +
                (c.has("sot") && !c.has("se") ? " Leave out cards with the red Shattered Empire symbol in the lower left corner." : "") : "",
              c.mod("leaders") ? "<b>Leaders:</b> each race has 3 Leader counters (placed in your Home System in the starting-forces step)." : ""
            ]);
          },
          src: (c) => cite(["Base p.6", c.mod("leaders") ? "Base p.34" : "", c.has("se") && !c.fote ? "SE p.4–5, p.8" : "", c.fote && c.p === 7 ? "SE p.5, p.8" : "", c.has("sot") ? "SoT p.6, p.9" : "",
            c.mod("mechs") ? "SoT p.5, p.11" : "", c.mod("flagships") ? "SoT p.10" : "", c.mod("rst") ? (c.has("se") ? "SE p.9" : "") : "", c.mod("rst") && c.has("sot") ? "SoT p.10" : "",
            c.mod("rst") && c.has("se") && c.has("sot") ? "FAQ p.12" : ""]) },
        { when: () => true, exp: (c) => c.fote ? "fote" : (c.has("sot") ? "sot" : (c.has("se") ? "se" : "base")),
          t: "The common play area: Action and Political decks, supplements",
          d: (c) => ul([
            "Shuffle the <b>Action Card</b> deck and the <b>" + (c.fote ? "Agenda Card" : "Political Card") + "</b> deck and place them separately in the common play area, with the <b>Fighter and Ground Force Supplement Counters</b>.",
            c.fote ? "<b>Fall of the Empire:</b> the scenario’s <b>Agenda Cards replace the Political deck</b>. They count as Political Cards for other cards; an Agenda that elects a planet cannot target a Home System. Use all of Shards of the Throne’s new Action Cards." : "",
            c.has("se") && !c.fote ? "<b>Shattered Empire:</b> first swap in its replacement cards — 4 <i>Direct Hit</i> and 1 <i>Ruinous Tariff</i> (Action), 1 <i>Open the Trade Routes</i> (Political) — then shuffle in its 40 new Action Cards and 32 new Political Cards." : "",
            c.has("sot") ? "<b>Shards of the Throne:</b> replace <i>Ghost Ship</i> and <i>Star of Death</i> with its versions and shuffle in its new Action" + (c.fote ? "" : " and Political") + " Cards." + (!c.has("se") || c.fote ? " Cards marked with a Shattered Empire race symbol stay in the box." : "") + " An Action Card with a Trade Good icon may be discarded instead of spending 1 Trade Good when you aren’t playing the optional rule it names." : "",
            (c.p === 4 || c.p === 8) ? "<b>" + c.p + " players:</b> remove the Action Cards <i>Strategic Flexibility</i> and <i>Strategic Shift</i>." : "",
            (c.varSC || c.swapped) ? "Whenever anyone draws an Action or Political Card that refers to a Strategy Card not in this game, discard it and draw a replacement." : "",
            ((c.has("se") && !c.fote) || c.has("sot")) ? "Supplement counters: the expansions add " + list([c.has("se") && !c.fote ? "Shattered Empire’s 12 Fighter and 12 Ground Force tokens" : "", c.has("sot") ? "Shards of the Throne’s 16 Fighter and 16 Ground Force counters" : ""].filter(Boolean)) + " — each worth <b>3 units</b>, so make change as needed." : "",
            c.mod("intrigue") && c.uses("political2") ? "<b>Political Intrigue (Political II):</b> draw the top <b>two Political Cards</b> and lay them face up — the agendas the next Council can choose from." : "",
            c.mod("mercs") ? "<b>Mercenaries:</b> shuffle the Mercenary deck and set the 16 Mercenary tokens beside it." : "",
            c.mod("shock") ? "<b>Shock Troops:</b> set the 12 Shock Troop tokens nearby." : "",
            c.mod("mines") ? "<b>Space Mines:</b> set the 12 Space Mine tokens nearby." : "",
            c.mod("facilities") ? "<b>Facilities:</b> set out the 16 Facility Cards (8 Colonies, 8 Refineries)." : ""
          ]),
          src: (c) => cite(["Base p.6", c.fote ? "SoT p.14–15" : "", c.has("se") && !c.fote ? "SE p.4, p.6–7" : "", c.has("sot") ? "SoT p.5–6, p.8–9" : "",
            c.p === 4 ? "FAQ p.1" : "", c.p === 8 ? "SE p.8" : "", (c.varSC || c.swapped) ? "SE p.9" : "", c.mod("intrigue") && c.uses("political2") ? "SoT p.12" : "", c.mod("mercs") ? "SoT p.5, p.12" : "",
            c.mod("shock") ? "SE p.4, p.10" : "", c.mod("mines") ? "SE p.4, p.10" : "", c.mod("facilities") ? "SE p.11" : ""]) },
        { when: () => true, exp: (c) => c.has("se") || c.has("sot") ? (c.has("sot") ? "sot" : "se") : "base",
          t: "Planet Cards",
          d: (c) => ul([
            "Each player takes the Planet Cards of his own Home System and lays them <b>face up</b> in his play area.",
            "Every other Planet Card — the neutral planets — goes in the common play area" + ((c.has("se") || c.has("sot")) && !c.fote ? " (with the expansions’ Planet Cards for the new systems" + (c.has("se") ? "; the Trade Stations Tsion and Sumerian have cards too" : "") + ")" : "") + ".",
            c.fote ? "The Lazax begin the game controlling Mecatol Rex." : ""
          ]),
          src: (c) => cite(["Base p.6", c.has("se") && !c.fote ? "SE p.5, p.7" : "", c.has("sot") ? (c.fote ? "SoT p.14" : "SoT p.7") : ""]) },
        { when: () => true, exp: "base",
          t: "The Trade Supply",
          d: (c) => ul([
            "Put all the <b>Trade Goods</b> counters in a single pile — the Trade Supply — in the common play area. The base game has exactly 40; when the supply is empty, nobody can receive more until some are spent.",
            (c.has("se") && !c.fote) ? "Shattered Empire adds 12 more." : "",
            c.has("sot") ? "Shards of the Throne adds 12 counters worth <b>3 Trade Goods each</b> — make change from the supply." : ""
          ]),
          src: (c) => cite(["Base p.6, p.25", c.has("se") && !c.fote ? "SE p.4, p.6" : "", c.has("sot") ? "SoT p.5, p.8" : ""]) },
        { when: () => true, exp: (c) => c.fote ? "fote" : ((c.varSC || c.swapped) ? "se" : ((c.mod("mercs") || c.mod("intrigue")) ? "sot" : "base")),
          t: "The eight Strategy Cards",
          d: (c) => ul([
            "Place the 8 Strategy Cards side by side in numerical order, <b>active side up</b>, prominently in the common play area: " +
              c.deck.map((id, i) => (i + 1) + " " + T3.cardName(id)).join(" · ") + ".",
            c.fote ? "<b>Fall of the Empire:</b> the base game’s cards, except <b>Civilization</b> replaces Political and <b>Industry</b> replaces Imperial." : "",
            c.varSC ? "<b>Shattered Empire variant set</b> (white cards)" + (c.swapped ? ", with same-name swaps" : "") + " — its extra setup (a Political Card hand, an extra Stage II objective, a revealed first objective) is in the steps below." : (c.swapped ? "<b>Same-name swaps</b> from Shattered Empire: only cards sharing a name may be exchanged (Roman-numeral II cards count as their namesakes for every card and ability)." : ""),
            c.uses("imperial2") ? "<b>Imperial II</b> replaces the original Imperial card; it requires the Age of Empire option (on)." : "",
            c.uses("trade3") ? "<b>Mercenaries:</b> Trade III replaces " + T3.cardName(c.raw[4]) + "." : "",
            c.uses("political2") ? "<b>Political Intrigue:</b> Political II replaces Political." : "",
            c.uses("assembly2") ? "<b>Political Intrigue:</b> Assembly II replaces Assembly." : "",
            c.uses("warfare2") ? "Put the <b>High Alert token</b> beside Warfare II." : "",
            T3.bonusCount(c.p) ? "Keep the <b>Bonus Counters</b> nearby: each round the Speaker puts one on every card nobody chose (" + T3.bonusCount(c.p) + " a round with " + c.p + " players)." : "With " + c.p + " players every Strategy Card is chosen each round, so the Bonus Counters are not used."
          ]),
          src: (c) => cite(["Base p.6, p.9", c.p === 4 ? "Base p.31" : "", c.p === 5 ? "Base p.32" : "", c.p >= 7 ? "SE p.8" : "", c.fote ? "SoT p.14" : "",
            (c.varSC || c.swapped) ? "SE p.9" : "", c.uses("imperial2") ? "SE p.9, p.17" : "", c.uses("trade3") ? "SoT p.12" : "", c.mod("intrigue") ? "SoT p.12" : "", c.uses("warfare2") ? "SE p.5, p.16" : ""]) }
      ]
    },
    /* ------------------------------------------------------------------ */
    {
      title: "Objectives & the victory track",
      steps: [
        { when: (c) => !c.fote, exp: (c) => (c.mod("varobj") || c.varSC || c.mod("artifacts") || c.mod("voice")) ? "se" : (c.mod("prelim") ? "sot" : ((c.mod("longwar") || c.mod("aoe")) ? "opt" : "base")),
          t: "Build the Objective decks",
          d: (c) => {
            const lw = c.mod("longwar"), s1 = lw ? 8 : 6, s2 = (lw ? 5 : 3) + (c.varSC ? 1 : 0), deck = s1 + s2 + 1;
            const secrets = c.has("se") ? "13 Secret Objectives (the original 10 plus Shattered Empire’s 3)" : "10 Secret Objectives";
            return ul([
              "Separate the Objective Cards into three piles: <b>Secret</b> Objectives, Public <b>Stage I</b> and Public <b>Stage II</b>." +
                (c.mod("varobj") ? " <b>Variant Objectives:</b> use Shattered Empire’s new Stage I and Stage II decks instead of the originals (they favour military conflict)." : ""),
              c.mod("prelim")
                ? "<b>Preliminary Objectives:</b> instead of a Secret Objective, deal each player <b>1 Preliminary Objective</b> face down; box the rest unseen (they never join the Secret deck). Completing yours lets you draw a Secret Objective."
                : "Shuffle the " + secrets + " and deal <b>1 face down to each player</b>. Read yours, then keep it face down — never show it to an opponent.",
              c.has("sot") ? "Unused Secret Objectives are not boxed: they stay face down in the play area as the <b>Secret Objective deck</b>. A fulfilled Secret Objective leaves the game." : "Put the unused Secret Objectives back in the box unseen.",
              "Stage II: remove the <b>“Game Over”</b> card, shuffle the rest and draw <b>" + s2 + "</b> at random, unseen" + (c.varSC ? " (one more than usual for the variant Strategy Cards)" : "") + (lw ? " (Long War)" : "") + ". Shuffle the Game Over card in with them and stack these <b>" + (s2 + 1) + "</b> face down.",
              "Stage I: shuffle, draw <b>" + s1 + "</b> at random and place them on top. The result is the <b>Public Objective deck of " + deck + " cards</b> — " + s1 + " Stage I over " + (s2 + 1) + " Stage II, one of them Game Over.",
              "Box every unused Objective Card without anyone seeing it — otherwise experienced players can work out what is coming.",
              (lw && !c.mod("aoe")) ? "<i>Long War alternative:</i> leave the Game Over card out; the game then ends after the Status Phase in which the last Public Objective was drawn." : "",
              c.mod("aoe") ? "<b>Age of Empire:</b> now deal the deck face up, left to right, in a single row; after the Game Over card is placed, box whatever is left. The row (" + (s1 + 1) + "–" + deck + " cards, Game Over at the right) holds every Public Objective of the game, all scorable from round 1 — except that <b>no one may qualify for Stage II objectives in the first three rounds</b> (errata)." : "",
              (c.varSC && !c.mod("aoe")) ? "<b>Variant Strategy Cards:</b> reveal the top card of the deck and place it face up in the common play area." : "",
              c.mod("artifacts") ? "<b>Artifacts:</b> set out the 4 Special Objective cards that show artifacts." : "",
              c.mod("voice") ? "<b>Voice of the Council:</b> set out its Special Objective card." : ""
            ]);
          },
          src: (c) => cite(["Base p.6–7", c.mod("longwar") ? "Base p.32" : "", c.mod("aoe") ? "Base p.33 · FAQ p.1" : "", c.has("se") ? "SE p.5, p.7" : "",
            (c.mod("varobj") || c.varSC || c.mod("artifacts")) ? "SE p.9" : "", c.mod("voice") ? "SE p.11" : "", c.has("sot") || c.mod("prelim") ? "SoT p.10" : ""]) },
        { when: (c) => c.fote, exp: "fote",
          t: "Fall of the Empire — Scenario Objectives",
          d: (c) => ul([
            "No one scores victory points in this scenario: every player has a specific objective instead.",
            "Instead of a Secret Objective, deal each player except the Lazax <b>1 Scenario Objective Card</b>" + (c.p === 4 ? " — with 4 players, first remove the <b>Loyalist</b> card" : "") + ". Keep it hidden, though what it does may be discussed — publicly, in front of everyone.",
            "The Lazax player takes the <b>Lazax Objective Card</b> and keeps it <b>face up</b>: it is open information.",
            "You need not control your Home System to fulfil an objective unless the card says so. Some Scenario Objectives win the game the moment they are fulfilled."
          ]),
          src: "SoT p.14–15" },
        { when: () => true, exp: (c) => c.fote ? "fote" : ((c.mod("longwar") || c.mod("aoe")) ? "opt" : "base"),
          t: (c) => c.fote ? "The round track" : "The Victory Point Track",
          d: (c) => c.fote
            ? ul(["Place the Victory Point Track in the common play area as a <b>round track</b>, with a Lazax Control Marker on <b>“0”</b>.",
                  "Advance it one space at the end of every Status Phase. The moment it enters <b>“8”</b> the game ends: everyone reveals his objective and Treaty Cards, and every player fulfilling his objective wins. If nobody does, there is no victor."])
            : ul([
              "Place the Victory Point Track in the common play area — " + (c.mod("longwar") ? "<b>0–14 side up</b> (Long War)" : "the 0–10 side up") + " — with one Control Marker per player on <b>“0”</b>.",
              "Target: <b>" + T3.vp(c) + " victory points</b>" + (c.uses("bureaucracy") ? " — one fewer than usual, as recommended with the Bureaucracy card" : "") + ".",
              c.mod("aoe") ? "<b>Age of Empire:</b> find a Turn token (a glass bead, a thimble, a coin). After the first round’s Status Phase it goes on the leftmost objective and moves one card right after every Status Phase; when it moves onto Game Over, the game ends and the most victory points wins." : ""
            ]),
          src: (c) => c.fote ? "SoT p.15" : cite(["Base p.6", c.mod("longwar") ? "Base p.32" : "", c.mod("aoe") ? "Base p.33" : "", c.uses("bureaucracy") ? "SE p.9, p.16" : ""]) }
      ]
    },
    /* ------------------------------------------------------------------ */
    {
      title: "Creating the galaxy",
      steps: [
        { when: (c) => !c.fote, exp: (c) => c.has("sot") ? "sot" : (c.has("se") ? "se" : "base"),
          t: "Mecatol Rex, the Speaker, and dealing systems",
          d: (c) => { const t = tileSetup(c); return ul([
            "Place <b>Mecatol Rex</b> in the middle of the table. Randomly choose a <b>first player</b>: he takes the <b>Speaker token</b>."].concat(t.items)); },
          src: (c) => cite(["Base p.8"].concat(tileSetup(c).src)) },
        { when: (c) => c.fote, exp: "fote",
          t: "Fall of the Empire — the preset galaxy",
          d: (c) => ul([
            "Build the galaxy exactly as the scenario map shows for " + c.p + " players: <b>SoT p." + (12 + c.p) + "</b>. The scenario uses its own variant <b>Mecatol Rex</b> tile.",
            "Randomly choose a first player as usual; he takes the Speaker token."
          ]),
          src: (c) => cite(["SoT p.6, p.14, p." + (12 + c.p), "Base p.8"]) },
        { when: (c) => !c.fote, exp: (c) => (c.p >= 7 || c.mod("larger")) ? "se" : "base",
          t: "Home System positions",
          d: (c) => {
            const dg = (c.p === 6 && c.mod("larger")) ? null : diagram(c.p);   // Base p.8 shows the standard three-ring galaxy
            const it = [];
            if (c.p === 6) it.push("Starting with the first player and going clockwise, each player chooses a side of Mecatol Rex and drags his Home System about two feet straight out from it; the sixth player takes the last side. Then shift seats to sit behind your Home System.");
            else if (c.p === 5) it.push("Before any Home System is placed, randomly assign each player a number <b>1–5</b>: his position on the 5-player diagram.");
            else it.push("Create the galaxy as normal, but its final shape and the Home System positions must match the <b>" + c.p + "-player diagram</b>.");
            it.push(c.p >= 7
              ? "Home Systems sit in the <b>outer (4th) ring</b>, at the positions the diagram shows."
              : "Your Home System’s fixed spot is <b>exactly 3 systems out</b> from Mecatol Rex (the 3rd ring)" + (c.mod("larger") ? " — still the 3rd ring in this four-ring galaxy" : "") + ".");
            if (c.has("sot")) it.push("Ghosts of Creuss: only the hexagonal Home System tile is placed in the galaxy.");
            let html = ul(it);
            if (dg) html += "<figure class='diagram'><img src='images/" + dg[0] + "' width='" + dg[1] + "' height='" + dg[2] + "' alt='Galaxy setup diagram for " + c.p + " players' loading='lazy'>" +
              "<figcaption>" + c.p + "-player galaxy (" + dg[3] + "): red = Mecatol Rex, yellow = Home System, pale blue = ring 1, blue = ring 2, navy = ring 3" + (c.p >= 7 ? ", grey = ring 4" : "") + (c.p === 5 || c.p === 7 ? "; numbers mark player positions" : "") + (c.mod("larger") ? ". The larger galaxy adds a 4th ring of systems around this shape; Home Systems keep these 3rd-ring positions" : "") + ".</figcaption></figure>";
            return html;
          },
          src: (c) => cite([c.p === 6 ? "Base p.8" : (c.p <= 5 ? "Base p.8, p.31–32" : "SE p.8"), c.mod("larger") ? "FAQ p.11" : "", c.has("sot") ? "SoT p.9" : ""]) },
        { when: (c) => !c.fote, exp: (c) => (c.p >= 7 || c.mod("larger")) ? "se" : "base",
          t: "Place systems ring by ring",
          d: (c) => ul([
            "In clockwise order from the first player, each player places <b>one system face up</b> adjacent to Mecatol Rex. Finish the 1st ring before starting the 2nd, and the 2nd before the 3rd" + ((c.p >= 7 || c.mod("larger")) ? " — then continue to a <b>4th ring</b>" : "") + ".",
            "Your Home System joins the galaxy automatically as soon as its spot becomes available — it doesn’t use a placement turn.",
            "You may not place a <b>Special System</b> (red inner border) adjacent to another Special System unless you have no other option.",
            "The order snakes: after everyone has placed one, reverse direction — so the last player places two in a row (P1, P2 … P" + c.p + ", P" + c.p + " … P2, P1, P1, P2 …).",
            "If your last system had <b>no planet</b>, your next must have a planet if you can; if you can’t, reveal your remaining systems to prove it.",
            "Continue until every dealt system is placed."
          ]),
          src: (c) => cite(["Base p.8", (c.p >= 7) ? "SE p.8" : "", c.mod("larger") ? "SE p.7" : ""]) },
        { when: (c) => !c.fote && (c.p === 5 || c.p >= 7), exp: (c) => c.p >= 7 ? "se" : "base",
          t: (c) => c.p === 8 ? "Reveal the face-down systems" : (c.p === 5 ? (c.mod("larger") ? "Compensate the uneven positions" : "Reveal the face-down system and compensate positions") : "Reveal the face-down systems and compensate positions"),
          d: (c) => {
            if (c.p === 5) return ul([
              c.mod("larger") ? "Larger galaxy: there is no face-down system beside Mecatol Rex." : "Once the galaxy is complete, <b>reveal the face-down system</b> next to Mecatol Rex.",
              "Five players on a hexagonal board sit at uneven distances, so before the game begins <b>positions 1 and 4 receive 4 Trade Goods</b> and <b>position 5 receives 6</b>, placed on their race sheets." +
                (c.mod("larger") ? " <i>(Shattered Empire’s larger galaxy changes the deal and drops the face-down system; it says nothing about this compensation.)</i>" : "")
            ]);
            return ul([
              "Once setup is complete, turn the <b>4 face-down systems</b> around Mecatol Rex face up.",
              c.p === 7 ? "The 7-player board is uneven: <b>positions 1 and 2 receive 4 Trade Goods</b> and <b>position 3 receives 6</b> before the game begins." : ""
            ]);
          },
          src: (c) => c.p === 5 ? cite(["Base p.32", c.mod("larger") ? "SE p.7" : ""]) : "SE p.8" },
        { when: (c) => c.mod("nexus"), exp: "se",
          t: "The Wormhole Nexus",
          d: ul(["Place the non-hexagonal <b>Wormhole Nexus</b> tile off the board. It is treated like any other system and is adjacent to every system containing an Alpha or Beta wormhole; ships using a wormhole may always choose to travel to it instead."]),
          src: "SE p.5, p.10" }
      ]
    },
    /* ------------------------------------------------------------------ */
    {
      title: "Seeding the galaxy",
      steps: [
        { when: (c) => c.mod("artifacts"), exp: "se",
          t: "Artifacts — hide the relics",
          d: ul([
            "Immediately after the map is set up, each player, starting with the Speaker, chooses <b>one planet</b>.",
            "Not allowed: Mecatol Rex, a Home System, any system adjacent to a Home System, or a planet in a system that already holds a chosen planet.",
            "Place one random <b>Artifact token face down</b> on each chosen planet (there are 8: 4 real artifacts in colour and 4 blank “dummies”)."
          ]),
          src: "SE p.9 · FAQ p.8" },
        { when: (c) => c.mod("ds") && !c.mod("early"), exp: (c) => (c.mod("newds") || c.mod("terrds") || c.has("se")) ? "se" : "opt",
          t: "Distant Suns — Domain Counters",
          d: (c) => dsSetup(c),
          src: (c) => dsSrc(c) },
        { when: (c) => c.mod("frontier"), exp: "sot",
          t: "The Final Frontier — Space Domain Counters",
          d: ul([
            "Shuffle the Space Domain Counters (the ones with an empty-space back) and place <b>one face down in each system with no planets</b> — not in Special Systems.",
            "Put the unused counters back in the box unseen. Each is revealed when moving units end their movement in its system."
          ]),
          src: "SoT p.11" },
        { when: (c) => c.mod("custodians"), exp: "se",
          t: "Custodians of Mecatol Rex",
          d: ul([
            "Place both <b>Custodian tokens</b> on Mecatol Rex: a <b>Fighter Ambush of 3</b> and <b>Hostile Locals of 2</b>.",
            "An invader must first beat the Fighter Ambush, then the Hostile Locals with his Ground Forces; defeated tokens leave the game."
          ]),
          src: "SE p.6, p.11" }
      ]
    },
    /* ------------------------------------------------------------------ */
    {
      title: "Starting forces",
      steps: [
        { when: () => true, exp: (c) => (c.mod("leaders") ? "opt" : (c.has("sot") ? "sot" : "base")),
          t: "Setup units and starting technologies",
          d: (c) => ul([
            "Place your <b>setup units</b> — listed on your Race Sheet — in your Home System. If it has several planets, split Space Docks, Ground Forces and PDS among them as you like.",
            "Place your <b>Starting Technology</b> cards face up in your play area.",
            c.mod("leaders") ? "<b>Leaders:</b> all three of your Leaders start in your Home System, like starting units (always on a planet, or carried by a ship)." : "",
            c.has("sot") && !c.fote ? "<b>Ghosts of Creuss:</b> starting units go in the system with the Creuss planet." : "",
            c.has("sot") && !c.fote && !c.mod("mechs") ? "<b>Nekro Virus:</b> without the Mechanized Units option, it receives <b>2 additional Ground Forces</b> instead." : "",
            c.mod("early") ? "<b>Simulated Early Turns:</b> you may hold these units back — the procedure below places them, with any extra units you buy, in your Home System and/or the systems you claim." : ""
          ]),
          src: (c) => cite(["Base p.7", c.mod("leaders") ? "Base p.34" : "", c.has("sot") && !c.fote ? "FAQ p.12" : "", c.mod("early") ? "SE p.12–13" : ""]) },
        { when: () => true, exp: "base",
          t: "Starting Command Counters",
          d: ul([
            "Take 8 Command Counters from your reinforcements and place them on your Race Sheet:",
            "<b>2</b> in the <b>Strategy Allocation</b> area · <b>3</b> in the <b>Command Pool</b> · <b>3</b> in the <b>Fleet Supply</b> (Fleet side up).",
            "The other 8 stay in your reinforcements."
          ]),
          src: "Base p.7, p.20" },
        { when: (c) => c.varSC, exp: "se",
          t: "A hand of Political Cards",
          d: ul([
            "Deal each player <b>2 Political Cards</b>. With the variant set you keep a hidden hand of Political Cards (limit 5) beside your Action Cards; they are played through the Assembly card.",
            "You may discard a Political Card from your hand at any time instead of spending a Trade Good."
          ]),
          src: "SE p.9, p.15" },
        { when: (c) => c.mod("intrigue"), exp: "sot",
          t: "Political Intrigue — Representatives and Promissory Notes",
          d: ul([
            "Each player takes his race’s <b>3 Representative Cards</b> and the <b>5 Promissory Note Cards</b> of his colour.",
            "Representatives are sent to the Galactic Council; Promissory Notes create binding voting contracts."
          ]),
          src: "SoT p.12" },
        { when: (c) => c.fote, exp: "fote",
          t: "Fall of the Empire — Treaty Cards",
          d: ul([
            "Each player receives <b>all of his race’s Treaty Cards</b> (marked with the race icon).",
            "The Lazax player discards every Treaty Card that refers to a race not in the game."
          ]),
          src: "SoT p.14" },
        { when: (c) => c.mod("early"), exp: "se",
          t: "Simulated Early Turns",
          d: (c) => "<ol>" +
            "<li><b>Claim territory:</b> starting with the Speaker, clockwise, each player puts a Command Counter from his reinforcements on a system adjacent to his Home System. Then, in the same order, each may place a second — adjacent to his Home System or to his first system.</li>" +
            "<li><b>Build and buy:</b> starting with the Speaker, each player gets resources equal to his Home System’s total resources <b>+3</b>, for extra starting units and/or <b>one Technology for 4 resources</b> (no discounts; prerequisites needed; no Race-Specific Technologies). Unspent resources are lost. Starting Trade Goods may be spent on the extra units" + (c.varSC ? ", and Political Cards may be discarded instead of spending Trade Goods" : "") + ".</li>" +
            "<li><b>Place units:</b> starting with the Speaker, each player places his starting units in his Home System and/or the systems holding his Command Counters. A Space Dock must go on one of his Home System planets; outside the Home System, all Fighters, Ground Forces and PDS must be with ships able to carry them all (Carriers, War Suns, ships with Stasis Capsules).</li>" +
            "<li><b>Receive planets:</b> take the Planet Card of each planet with one of your Ground Forces on it; then return the Command Counters to your reinforcements.</li>" +
            "<li><b>Reveal an objective:</b> turn the top Public Objective face up." + (c.mod("aoe") ? " <i>Age of Empire: every Public Objective is already face up and no further ones enter the game (Base p.33), so there is nothing to reveal — the rulebooks don’t cover this pairing; this is the page’s reading.</i>" : "") + "</li>" +
            "<li><b>Abbreviated Status Phase:</b> each player receives 1 Action Card and refreshes his planets; refresh abilities may be used. Then play the first Strategy Phase as normal.</li>" +
            "</ol>" + ul([
              "No special abilities or technologies during the procedure — treat the Special Abilities area of the race sheets as blank.",
              c.mod("leaders") ? "Leaders: abilities that discount building at a Space Dock (such as the Scientist’s) can’t be used, since these units aren’t produced at any Space Dock." : "",
              c.mod("ds") ? "Distant Suns: place the Domain Counters <b>after</b> this procedure — see the next step." : ""
            ]),
          src: (c) => cite(["SE p.12–13", c.mod("aoe") ? "Base p.33" : "", "FAQ p.9", (c.mod("leaders") || c.mod("ds")) ? "FAQ p.11" : ""]) },
        { when: (c) => c.mod("ds") && c.mod("early"), exp: "se",
          t: "Distant Suns — Domain Counters (after the early turns)",
          d: (c) => dsSetup(c),
          src: (c) => cite([dsSrc(c), "FAQ p.11"]) },
        { when: () => true, exp: "base",
          t: "Begin: the Strategy Phase of round 1",
          d: (c) => ul([
            "The game starts with the <b>Strategy Phase</b> of the first game round: the Speaker picks a Strategy Card first, then clockwise.",
            (c.p <= 4) ? "With " + c.p + " players everyone takes <b>two</b> Strategy Cards, in two rounds of picking in the same order." : "",
            c.fote ? "The scenario lasts eight rounds." : ""
          ]),
          src: (c) => cite(["Base p.7", c.p <= 4 ? "Base p.31" : "", c.fote ? "SoT p.15" : ""]) }
      ]
    }
  ];

  function dsSetup(c) {
    const it = [];
    if (c.mod("terrds")) {
      it.push("<b>Territorial Distant Suns</b> — instead of the normal placement:");
      it.push("1. Make a <b>low-risk pile</b> of these counters: Peaceful Annexation, Natural Wealth (2), Native Intelligence, Hostile Locals (1), Biohazard, Hostage Situation, Fighter Ambush (1) and Settlers.");
      it.push("2. Put all the other Domain Counters in a separate pile.");
      it.push("3. Randomly place low-risk counters on <b>every planet in the outer ring</b> and every planet <b>adjacent to a Home System</b>.");
      it.push("4. Mix all remaining counters together and distribute them randomly on the remaining planets.");
      if (c.mod("early")) it.push("After the early turns only planets that no player controls receive counters.");
    } else {
      it.push("Shuffle the Domain Counters" + (c.mod("newds") ? " (with Shattered Empire’s new ones mixed in)" : "") + " face down and place <b>one on every neutral planet</b>" + (c.mod("early") ? " — every planet not under a player’s control after the early turns" : "") + ".");
      it.push("Put the excess back in the box unseen.");
    }
    it.push("Never on Home System planets or Mecatol Rex" + (c.has("se") ? ", and never on Trade Stations" : "") + ".");
    it.push("A counter is revealed only when Ground Forces land during a Tactical Action; a planet taken any other way loses its counter unrevealed.");
    return ul(it);
  }
  function dsSrc(c) {
    return cite(["Base p.33", c.has("se") ? "SE p.7" : "", c.mod("newds") ? "SE p.11" : "", c.mod("terrds") ? "SE p.11" : ""].filter((x, i, a) => a.indexOf(x) === i));
  }
})();

/* =============================================================================
   RULES REFERENCE — core rules
   ============================================================================= */
(function () {
  "use strict";
  const ul = (a) => "<ul>" + a.filter(Boolean).map((x) => "<li>" + x + "</li>").join("") + "</ul>";
  const ol = (a) => "<ol>" + a.filter(Boolean).map((x) => "<li>" + x + "</li>").join("") + "</ol>";
  const cite = (a) => T3.cite(a);
  const h = (t) => "<h4>" + t + "</h4>";

  function cardBlock(id, c) {
    const k = T3.scards[id];
    let s = "<div class='sc-card'><p class='sc-title'><span class='sc-num'>" + k.n + "</span> " + k.name + " <span class='sc-src'>" + k.src + "</span></p>";
    if (k.special) s += "<p><b>Special:</b> " + k.special + "</p>";
    if (k.primary) s += "<p><b>Primary — " + k.primary[0] + ":</b> " + k.primary[1] + "</p>";
    if (k.secondary) s += "<p><b>Secondary — " + k.secondary[0] + ":</b> " + k.secondary[1] + "</p>";
    else if (k.primary) s += "<p><b>Secondary:</b> none.</p>";
    // Official variants sheet options that rewrite the Imperial primary (Variants p.2)
    const vari = (id === "imperial" && c) ? (c.mod("star")
      ? "<b>The Star in the Crown (in play):</b> the primary gives <b>1 victory point</b> instead of 2 (Variants p.2)."
      : (c.mod("throne") ? "<b>The Ancient Throne (in play):</b> this primary is replaced — choose <b>a)</b> gain 1 VP at once if you control Mecatol Rex, and — whether or not you do — qualify for any number of Public Objectives in the upcoming Status Phase; or <b>b)</b> execute the secondary at no cost, and no other player may execute it this round. The secondary is unchanged (Variants p.2)." : "")) : "";
    // Age of Empire lays out every Public Objective at setup and boxes the rest (Base p.33): the Imperial primary has nothing to draw
    const aoe = (id === "imperial" && c && c.mod("aoe") && !c.mod("throne"))
      ? "<b>Age of Empire (in play):</b> every Public Objective is already face up and “no further Public Objective Cards will enter the game”, so the primary draws nothing — it just gives the victory point" + (c.mod("star") ? "" : "s") + " (Base p.33)." : "";
    // Bureaucracy (SE p.16) under Age of Empire: the same situation — not covered by the rulebooks, so labelled as the page's reading
    const aoeB = (id === "bureaucracy" && c && c.mod("aoe"))
      ? "<b>Age of Empire (in play):</b> every Public Objective is already face up and “no further Public Objective Cards will enter the game” (Base p.33), so the special’s reveal and the primary’s draw have nothing to act on; the Command Counter and the immediate claim still work. <i>The rulebooks don’t cover this pairing — this is the page’s reading.</i>" : "";
    const notes = (id === "imperial" && c && c.mod("aoe")) ? (k.notes || []).filter((x) => x.indexOf("Game Over card is drawn") === -1) : (k.notes || []);
    if (notes.length || vari || aoe || aoeB) s += ul([vari, aoe, aoeB].concat(notes));
    return s + "</div>";
  }
  T3.cardBlock = cardBlock;

  T3.reference = [
    {
      title: "How to win — and how the game ends",
      when: (c) => !c.fote, open: true,
      html: (c) => {
        const vp = T3.vp(c);
        return ul([
          "Be the first to reach <b>" + vp + " victory points</b>" + (c.mod("longwar") ? " (the Long War)" : "") + (c.uses("bureaucracy") ? " — one fewer than usual, as recommended with Bureaucracy" : "") + ". Most points come from <b>Public</b> and <b>Secret Objectives</b>, claimed in the Status Phase" +
            (c.uses("imperial") ? (c.mod("throne")
              ? ", plus <b>1 VP</b> when the Imperial holder chooses option a of The Ancient Throne while controlling Mecatol Rex"
              : ", plus <b>" + (c.mod("star") ? "1 VP" : "2 VP") + "</b> each time someone resolves the Imperial primary ability")
              : (c.uses("imperial2") ? ", plus <b>1 VP</b> when the Imperial II holder chooses option a while controlling Mecatol Rex" : "")) + ".",
          "Objectives are claimed one player at a time in order of play, so someone always reaches the target first — <b>he wins</b>, even if others would also get there later in the order.",
          !c.mod("varobj") ? "In Status Phase step 1 you also win if you are the first to meet the <b>Supremacy</b> or <b>Domination</b> objective while it is face up." : "",
          (c.uses("imperial") || c.uses("imperial2")) ? "Reaching the target with the " + (c.uses("imperial2") ? "Imperial II" : "Imperial") + " primary ability wins immediately — the game ends the moment someone gains his last victory point." : "",
          c.uses("bureaucracy") ? "Reaching the target by claiming an objective with Bureaucracy ends the game at once." : "",
          c.mod("aoe") ? "<b>Age of Empire:</b> after every Status Phase the Turn token moves one objective to the right; when it moves onto <b>Game Over</b> the game ends and the most victory points wins." :
            "<b>Game Over (“Imperium Rex”):</b> when the Game Over card is drawn from the Objective deck the game ends <b>immediately</b>" +
              (c.uses("imperial") ? " — the player who drew it with the Imperial card doesn’t get his " + (c.mod("star") ? "1 VP" : "2 VP") + " —" : (c.uses("bureaucracy") ? " — if Bureaucracy reveals it, before its holder can claim an objective —" : "")) + " and the most victory points wins.",
          "Ties when the game ends on Game Over" + (c.mod("aoe") ? " (Age of Empire ends it “as described in the core rules”)" : "") + ": most resolved Objective Cards, then most planets, then most unused Command Counters, then most Command Counters on the Race Sheet; still tied — a draw.",
          (c.mod("longwar") && !c.mod("aoe")) ? "<i>Long War alternative:</i> without a Game Over card, the game ends after the Status Phase in which the last Public Objective was drawn." : "",
          "You can <b>never qualify</b> for a Public or Secret Objective while you don’t control every planet in your Home System." +
            (c.mod("homeworlds") ? " <b>Homeworlds:</b> the same goes for victory points from <i>any</i> source; points missed are not banked — regain control and earn them again." : ""),
          "Victory points never go below 0" + (c.mod("artifacts") ? " — nor below the number of artifact planets a player controls" : "") + ".",
          c.mod("frontier") ? "<b>Precursor Space Station</b> (Final Frontier): while you control its system you need 1 fewer victory point to win." : "",
          "<b>Elimination:</b> a player with no planets and no units on the board is out — his Action Cards are discarded and his race’s trade agreements leave the game. Everyone else carries on, taking the same number of Strategy Cards as before."
        ]);
      },
      src: (c) => cite(["Base p.4, p.14–15, p.38", c.mod("longwar") ? "Base p.32" : "", c.mod("aoe") ? "Base p.33" : "", c.uses("bureaucracy") ? "SE p.9, p.16" : "",
        c.uses("imperial2") ? "SE p.17" : "", c.mod("homeworlds") || c.mod("star") || c.mod("throne") ? "Variants p.2" : "", c.mod("frontier") ? "SoT p.24" : "", "FAQ p.2, p.8, p.11"]) },
    {
      title: "Fall of the Empire — winning, treaties and alliances",
      when: (c) => c.fote, open: true,
      html: (c) => h("Winning the scenario") + ul([
          "No victory points: each player has a specific <b>Scenario Objective</b> (the Lazax: the face-up <b>Lazax Objective</b>). You need not control your Home System unless the objective says so.",
          "Some Scenario Objectives end the game <b>immediately</b> when fulfilled — that player wins (and perhaps one ally, below).",
          "Otherwise the game lasts <b>eight rounds</b>: the Lazax marker on the round track advances after each Status Phase, and as it enters <b>“8”</b> everyone reveals his objective and Treaty Cards. Every player fulfilling his objective wins; if no one does, there is no victor.",
          "“Emperor of the Galaxy” (Lazax): “control” of a Home System means holding all of its planets. “Support of the People”: if a player gives out his fourth Treaty and doesn’t win, the game continues."
        ]) + h("Forming an alliance (on your turn)") + ol([
          "<b>Activate a Home System:</b> activate another player’s Home System (not Mecatol Rex); instead of the normal activation steps you may give its owner a Treaty Card.",
          "<b>Give Treaty:</b> secretly give him one of your race’s Treaty Cards; he may read it but not show it.",
          "<b>Bargaining:</b> make any verbal deals — nothing is binding except an immediate exchange of Trade Goods.",
          "<b>Secretly accept or reject:</b> he shuffles it into his Treaty hand, then must discard one card of his choice face down beside the Action deck — the new one, one of his own, or another he received."
        ]) + ul([
          "The Lazax player can give Treaty Cards but never accept them.",
          "A Treaty’s bottom line (e.g. “Don’t attack the Hacan”) is only a hint about how to help that race win."
        ]) + h("Winning with an alliance") + ol([
          "Every non-winning player reveals his Treaty Cards (the winner’s don’t matter).",
          "A player holding Treaty Cards from more than one opponent loses.",
          "The player holding the <b>lowest-numbered</b> Treaty Card of the winning race also wins — so beware of high numbers."
        ]),
      src: "SoT p.14–15 · FAQ p.13" },
    {
      title: "The game round at a glance",
      when: () => true, open: true,
      html: (c) => ol([
          "<b>Strategy Phase</b> — starting with the Speaker, everyone takes " + (c.p <= 4 ? "<b>two</b> Strategy Cards" : "a Strategy Card") + (T3.bonusCount(c.p) ? "; unchosen cards collect Bonus Counters." : " — all eight are taken, so there are no Bonus Counters."),
          "<b>Action Phase</b> — in order of play, one action per turn (Strategic, Tactical, Transfer or Pass), round and round until everyone has passed.",
          "<b>Status Phase</b> — claim objectives, repair, clear your Command Counters from the board, refresh planets, draw 1 Action Card and 2 Command Counters, reorganise, return the Strategy Cards."
        ]) + ul([
          c.fote ? "Fall of the Empire lasts eight rounds." : "Rounds repeat until someone wins or another game-ending condition applies.",
          "“Friendly” means <b>your own</b> units and planets only; everyone else’s — allies included — are “enemy”.",
          "If a card contradicts the rules, the <b>card wins</b>.",
          "Several effects on one number (e.g. production limit): Political Cards first (in the order they entered play), then Technologies (owner’s order), then Action Cards (in the order resolved).",
          "“Up to” includes zero. Every Status Phase step is resolved in order of play."
        ]),
      src: (c) => cite(["Base p.7, p.9–10, p.23", c.p <= 4 ? "Base p.31" : "", c.p === 5 ? "Base p.32" : "", c.p === 8 ? "SE p.8" : "", c.fote ? "SoT p.15" : "", "FAQ p.8"]) },
    {
      title: "Strategy Phase — choosing Strategy Cards",
      when: () => true,
      html: (c) => {
        const b = T3.bonusCount(c.p);
        return ul([
          "The <b>Speaker</b> chooses first, then each player clockwise, taking one available card and placing it active side up in front of him.",
          c.p <= 4 ? "<b>" + c.p + " players:</b> everyone takes <b>two</b> cards, in two rounds of selection in the same order. You must take a Strategic Action for each before you may pass; your place in the order of play is set by the <b>lower</b> of your two numbers." : "",
          b ? "The Speaker puts a <b>Bonus Counter</b> on each card nobody chose (" + b + " each round with " + c.p + " players). They pile up round after round; whoever takes a card with Bonus Counters swaps each for a <b>Trade Good or a Command Counter</b>." :
            "With " + c.p + " players every card is taken each round, so there are no Bonus Counters.",
          (c.p === 4 && c.uses("initiative")) ? "4 players: Initiative still may not go to the same player two rounds running, unless he has no other option." : "",
          c.uses("initiative") ? "Taking <b>Initiative</b> claims the Speaker token, which stays with its holder until someone else takes Initiative. Nobody may take Initiative two rounds in a row." : "",
          c.uses("bureaucracy") ? "Taking <b>Bureaucracy</b> reveals one Objective card per Bonus Counter on it" + (c.mod("aoe") ? " — except under Age of Empire, where no further objectives enter the game (Base p.33; see the card)" : "") + "." : "",
          "<b>Order of play</b> follows the card numbers: " + c.deck.map((id, i) => (i + 1) + " " + T3.cardName(id)).join(", ") + ". A number nobody took is skipped."
        ]);
      },
      src: (c) => cite(["Base p.7, p.9, p.11, p.36", c.p <= 5 ? "Base p.31–32" : "", c.p >= 7 ? "SE p.8" : "", c.p <= 4 ? "FAQ p.2" : "", c.uses("bureaucracy") ? "SE p.16" : "", c.uses("bureaucracy") && c.mod("aoe") ? "Base p.33" : ""]) },
    {
      title: "The Strategy Cards in this game",
      when: () => true,
      html: (c) => ul([
          "<b>Primary ability</b>: resolved by the card’s holder as his Strategic Action. Then each other player, clockwise from him, may use the <b>secondary ability</b> once by spending 1 Command Counter from his Strategy Allocation area" +
            (c.uses("logistics") ? " (none needed for Logistics" + (c.uses("leadership") ? " or Leadership" : "") + ")" : (c.uses("leadership") ? " (none needed for Leadership)" : "")) +
            (c.uses("initiative") ? "; the Initiative holder pays nothing" : "") + ".",
          "The active player never uses his own card’s secondary ability" + ((c.uses("leadership") || c.uses("diplomacy2") || c.uses("imperial2")) ? " — unless the card says so" : "") + ". You may follow several different cards’ secondaries, each once. Players who have passed may still follow later secondaries.",
          (c.varSC || c.swapped) ? "Cards named with a Roman numeral II are affected by everything that affects the card of the same name." : "",
          (c.varSC || c.swapped) ? "Any Action or Political Card referring to a Strategy Card not in this game is discarded and replaced when drawn." : ""
        ]) + c.deck.map((id) => cardBlock(id, c)).join(""),
      src: (c) => {
        // FAQ pages: exactly those cited by the cards shown
        const faq = [];
        c.deck.forEach((id) => { const k = T3.scards[id]; ((k.notes || []).join(" ") + " " + k.src).replace(/FAQ p\.(\d+)(?:, p\.(\d+))?/g, (m, a, b) => { faq.push("FAQ p." + a); if (b) faq.push("FAQ p." + b); return m; }); });
        return cite(["Base p.9–10, p.14", c.deck.some((id) => T3.scards[id].set === "base") ? "Base p.36–38" : "", (c.varSC || c.swapped || c.uses("imperial2")) ? "SE p.9, p.14–17" : "",
          c.has("sot") && (c.fote || c.mod("mercs") || c.mod("intrigue")) ? "SoT p.20–21" : "", ((c.uses("imperial") && !c.mod("throne")) || c.uses("bureaucracy")) && c.mod("aoe") ? "Base p.33" : "", c.uses("imperial") && (c.mod("star") || c.mod("throne")) ? "Variants p.2" : ""].concat(faq));
      } },
    {
      title: "Action Phase — the four actions",
      when: () => true,
      html: (c) => ul([
          "In order of play each player takes <b>one action</b>, then the next player; after the last player it comes back round. Keep going until <b>everyone has passed</b> — a player left alone may take several actions in a row.",
          "<b>Strategic Action:</b> resolve your Strategy Card’s primary ability; the others may then follow with its secondary; flip your card to Inactive. You choose when — the card’s number only sets the order of play." + (c.uses("initiative") ? " The Initiative holder has no Strategic Action." : "") + (c.p <= 4 ? " With two cards you take two Strategic Actions, in the order you like." : ""),
          "<b>Tactical Action:</b> activate one system with a Command Counter from your Command Pool, then move, fight, land, invade and produce there (the Activation Sequence).",
          "<b>Transfer Action:</b> activate two adjacent systems that hold only your units, shuffle ships between them and produce in one of them.",
          "<b>Pass:</b> allowed only once you have taken your Strategic Action" + (c.p <= 4 ? "s" : "") + ". After passing you take no more actions this round, but you may still use the secondary ability of cards played later.",
          "With no Command Counters in your Command Pool you cannot take Tactical or Transfer Actions.",
          "An Action Card marked <b>“Play: As an action”</b> is played instead of taking an action — it is your action for the turn. One that gets Sabotaged doesn’t use up your action."
        ]),
      src: (c) => cite(["Base p.9–10, p.12, p.14, p.23", c.p <= 4 ? "Base p.31" : "", "FAQ p.2–3"]) },
    {
      title: "Tactical Action — the Activation Sequence",
      when: () => true,
      html: (c) => ol([
          "<b>Activate a system:</b> place a Command Counter from your Command Pool on it, insignia up. Not a system that already holds one of your counters; other players’ counters don’t matter. Asteroid Fields and Supernovas can never be activated." +
            (c.uses("diplomacy") ? " (Diplomacy can forbid activating systems with a named player’s units.)" : ""),
          "<b>Move ships</b> into the activated system — see Movement.",
          "<b>PDS fire:</b> enemy PDS in range may fire at the active player’s ships; then the active player’s PDS in range fire at enemy ships there. You may activate a system purely to fire your PDS." + (c.mod("mines") ? " <b>Space Mines</b> are rolled for right after this step." : ""),
          "<b>Space Battle</b> if you moved ships into a system holding another player’s ships (even a lone Fighter). You are the attacker.",
          "<b>Planetary Landings:</b> land Ground Forces" + (c.mod("mechs") ? ", Mechanized Units" : "") + " and PDS from your ships onto planets in the system — friendly, neutral, or hostile (an invasion). Split them as you like; you can’t change your mind once Invasion Combat starts. A PDS landing alone on a neutral or enemy planet is destroyed; an enemy planet without Ground Forces falls without resistance (take its card, exhausted)." +
            (c.mod("ds") ? " <b>Distant Suns:</b> razing happens at the start of this step; a planet’s Domain Counter is revealed once you have landed all your Ground Forces there." : ""),
          "<b>Invasion Combat</b> on each planet where two players’ Ground Forces meet, one planet at a time in the order you choose.",
          "<b>Produce Units</b> at your Space Docks in the system, and/or build a new Space Dock on a planet you have held all round." + (c.mod("mines") ? " Space Mines are deployed here." : "") + (c.mod("facilities") ? " Facilities are built here." : "")
        ]) + ul([
          "Only step 1 is required: the other steps happen only if they apply or you choose to start them.",
          "<b>PDS range:</b> a PDS fires into its own system — into adjacent systems too with <i>Deep Space Cannon</i>, but never through a wormhole. Each PDS fires once per activation, and firing is optional. During another player’s activation your PDS may fire only at the active player’s units, so no one can draw your fire onto a third player.",
          "Landing on a neutral planet counts as an invasion for Action and Political Cards."
        ]),
      src: (c) => cite(["Base p.10–12, p.18, p.24, p.26, p.29", c.mod("mines") ? "SE p.10" : "", c.mod("ds") ? "Base p.33 · SE p.13" : "", c.mod("facilities") ? "SE p.11" : "", "FAQ p.2, p.4–5, p.7–8"]) },
    {
      title: "Movement",
      when: () => true,
      html: (c) => ul([
          "Each ship moves up to its <b>movement value</b> (on your Race Sheet) and must <b>end in the activated system</b> — the only movement allowed. Fighters" + (c.mod("mechs") ? ", Mechanized Units" : "") + ", Ground Forces and PDS travel aboard Carriers or War Suns.",
          "A ship may <b>never move through a system containing enemy ships</b>; the only way in is to activate that system. Only ships block — enemy Fighters don’t (unless their owner has <i>Advanced Fighters</i>), and neither do Space Docks or Ground Forces.",
          "Ships in a system <b>you already activated</b> this round can’t move. Ships may pass through systems holding your Command Counters.",
          "Any legal route is fine, and a ship may even leave the activated system and come back (to collect units) if it has the movement.",
          "<b>Carriers and War Suns</b> pick up Ground Forces and PDS in the system they start in, pass through or end in — but never in a system you activated earlier, nor in one containing enemy ships. They unload only in Planetary Landings. A Carrier may take Fighters from another Carrier, but not its Ground Forces or PDS.",
          "When the last Ground Force leaves a planet, leave a Control Marker to show you still control it.",
          "Passing through a crowded system doesn’t break your Fleet Supply; ending there does (excess ships are removed at once).",
          "Each fleet carrying Ground Forces needs at least one plastic Ground Force with it; Supplement Counters travel only with a real unit of their type.",
          "<b>Wormholes:</b> systems holding the same wormhole type (Alpha or Beta) are adjacent — for movement only (Transfer Actions included), not for PDS fire or other effects. A wormhole type with only one end in play does nothing." +
            (c.mod("nexus") ? " The Wormhole Nexus is adjacent to every Alpha and Beta system." : "") + (c.has("sot") && !c.fote ? " The Ghosts of Creuss’ “D” wormhole counts as a wormhole for card and game effects." : "")
        ]),
      src: (c) => cite(["Base p.11, p.19–20, p.27–29, p.38", c.mod("nexus") ? "SE p.10" : "", c.has("sot") && !c.fote ? "SoT p.9" : "", "FAQ p.4–6, p.8"]) },
    {
      title: "Transfer Action",
      when: () => true,
      html: (c) => ol([
          "<b>Activate two systems:</b> one Command Counter from your Command Pool on one system, then one from your <b>reinforcements</b> on an adjacent system. Both must contain at least one of your units and <b>no enemy units at all</b> (Ground Forces and PDS included).",
          "<b>Movement</b> between the two systems — within each ship’s movement allowance. Fighters and Ground Forces must always be supported, so they move only with a ship that has room for them.",
          "<b>PDS fire:</b> enemy PDS in range may fire at your ships; a PDS in range of both systems fires at only one.",
          "<b>Planetary Landings</b> — only onto planets you already control.",
          "<b>Production</b> in <b>one</b> of the two systems only — never units in one and a Space Dock in the other."
        ]) + ul(["Matching wormholes make two systems adjacent for a Transfer Action too.",
          c.mod("facilities") ? "Facilities can’t be built during a Transfer Action." : ""]),
      src: (c) => cite(["Base p.12, p.14, p.19", "FAQ p.5, p.8", c.mod("facilities") ? "FAQ p.10" : ""]) },
    {
      title: "Space Battles",
      when: () => true,
      html: (c) => h("Before the first round") + ul([
          "Possible pre-combat effects: Action Cards played “immediately before a space battle”, <b>Anti-Fighter Barrage</b>, Assault Cannons, the Mentak ability, Minister of War" + (c.mod("sabotage") ? ", <b>Sabotage Runs</b>" : "") + ". The <b>defender</b> chooses their order" + (c.mod("sabotage") ? " — but Anti-Fighter Barrage always comes before Sabotage Runs" : "") + ".",
          "<b>Anti-Fighter Barrage:</b> every Destroyer (attacking and defending) rolls <b>2 dice</b>; each result equal to or above its combat value destroys one enemy Fighter. No return fire; once per battle, not every round."
        ]) + h("Each combat round") + ol([
          "<b>Announce</b> withdrawal (attacker first) or retreat (defender — only if the attacker didn’t). An announced retreat must be carried out.",
          "<b>Roll</b> one die per ship (a War Sun rolls 3). Each result equal to or above the ship’s combat value is a hit. A “0” is a 10.",
          "<b>Remove casualties</b> — the attacker first, then the defender, each choosing his own: destroy a ship or damage a Dreadnought or War Sun (a second hit destroys it). Fighters make cheap casualties.",
          "<b>Execute</b> the withdrawal or retreat: the whole fleet moves to an <b>adjacent system you activated earlier this round</b> that contains <b>no enemy ships</b> (enemy planets are fine). Cancelled if the enemy has no units left. Check Fleet Supply and Fighter capacity afterwards. No adjacent activated system — no retreat."
        ]) + ul([
          "Repeat until only one player (or no one) has ships in the system. Every battle has at least one round.",
          "During the battle Fighters fight on even if their Carrier dies; afterwards Fighters without capacity are removed.",
          "A Carrier can’t pick up units while retreating.",
          "A <b>Nebula’s</b> defender gets +1 on his combat rolls." + (c.has("se") && !c.fote ? " In an <b>Ion Storm</b> Fighters roll no dice (they can still be casualties)." : ""),
          c.mod("tretreat") ? "<b>Tactical Retreat:</b> when announcing a retreat the defender may spend a Strategy Allocation Command Counter to activate an adjacent, unactivated system with no enemy units, and retreat there at the end of the round." : "",
          c.has("sot") ? "<b>Stalemate</b> (in a Space Battle or Invasion Combat): if the ships can’t all be destroyed (e.g. two Dreadnoughts with Duranium Armor, or Fighters in an Ion Storm with Advanced Fighters), the attacker must make a tactical retreat; if he can’t, his ships are destroyed." : "",
          "A <b>combat roll</b> is any roll compared to a unit’s combat value to inflict a casualty — PDS fire and pre-combat abilities included" + (c.mod("sabotage") ? "; not Sabotage Run rolls" : "") + ". A bonus “during Space Battles” (or “Space Combat”) applies only to step 2 above.",
          "A Space Battle between trade partners breaks their trade agreement.",
          c.has("se") && !c.fote ? "For the objective cards, you have <b>won a space battle</b> if you are the only player with ships left in the system at its end." : ""
        ]),
      src: (c) => cite(["Base p.15–18, p.25, p.29–30", c.mod("sabotage") ? "Base p.35 · SE p.13" : "", c.has("se") && !c.fote ? "SE p.6" : "", c.mod("tretreat") ? "SE p.11" : "",
        "FAQ p.1–3, p.7" + (c.mod("tretreat") ? ", p.9" : "") + (c.has("se") && !c.fote ? ", p.10" : "") + (c.has("sot") ? ", p.12" : "")]) },
    {
      title: "Invasion Combat",
      when: () => true,
      html: (c) => h("Before combat") + ul([
          "<b>Bombardment:</b> each Dreadnought in the system rolls 1 die, each War Sun 3; each hit removes a defending Ground Force (no return fire). A Dreadnought bombards only a planet your Ground Forces are invading, and never one with a PDS (planetary shield). A War Sun ignores the shield and may bombard even without an invasion. A Dreadnought bombards only once per activation; when invading several planets in the system, you decide how to divide the bombardment. Never your own planet, and you must roll all the dice.",
          "<b>Defending PDS</b> on the planet then fire once each at the invading Ground Forces — a single pre-combat shot, not every round."
        ]) + h("Each round") + ol([
          "Both players roll one die per Ground Force" + (c.mod("mechs") ? " (and Mechanized Unit)" : "") + " on the planet; results equal to or above the combat value are hits.",
          "Both remove that many casualties" + (c.mod("shock") ? " (Shock Troops must be taken first)" : "") + (c.mod("mechs") ? "; a Mechanized Unit may absorb one hit by being damaged" : "") + "."
        ]) + ul([
          "Repeat until only one side (or neither) is left. <b>No retreats.</b>",
          "<b>Success</b> — all defenders destroyed and at least one invader survives: the defender’s PDS and Space Dock there are destroyed" + (c.mod("facilities") ? " (and his Facility)" : "") + ", and you take the Planet Card, exhausted." + ((c.mod("leaders") || c.mod("shock")) ? " " + [c.mod("leaders") ? "An invading Agent" : "", c.mod("shock") ? (c.mod("leaders") ? "a" : "A") + " surviving Shock Troop" : ""].filter(Boolean).join(" or ") + " can capture the PDS and Space Dock instead." : ""),
          "Both sides wiped out: the defender keeps the planet (he places a Control Marker); its PDS and Space Dock are unaffected.",
          "PDS landed with an invasion don’t fight and can’t be casualties; if the last invading Ground Force dies, they are destroyed.",
          "A planet whose last Ground Force is bombarded away doesn’t revert to neutral, and its PDS survive.",
          "Invading a planet that holds only a Control Marker still counts as Invasion Combat (it breaks a trade agreement).",
          c.has("sot") ? "<b>Stalemate:</b> the FAQ’s stalemate rule (see Space Battles) covers Invasion Combat too." : ""
        ]),
      src: (c) => cite(["Base p.12, p.17–18, p.25, p.29–31", c.mod("shock") ? "SE p.10" : "", c.mod("facilities") ? "SE p.11" : "", c.mod("mechs") ? "SoT p.11" : "", "FAQ p.3–4" + (c.has("sot") ? ", p.12" : "")]) },
    {
      title: "Status Phase",
      when: () => true,
      html: (c) => ol([
          c.fote ? "<b>Qualify for objectives</b> — nothing to claim in Fall of the Empire: no one scores victory points, and Scenario Objectives are checked when their cards say so or when the round marker enters “8”." :
          "<b>Qualify for objectives</b> — in order of play, each player may claim <b>one</b> face-up Public Objective" + ((c.uses("imperial2") || c.mod("throne")) ? " (any number after choosing option a of " + (c.uses("imperial2") ? "Imperial II" : "The Ancient Throne") + ")" : "") + " and/or his Secret Objective" + (c.mod("prelim") ? " (or Preliminary Objective)" : "") + ", proving it, placing a Control Marker on it and advancing on the track. Never while missing a Home System planet." +
            (c.mod("aoe") ? " Age of Empire: no Stage II objectives in rounds 1–3." : ""),
          "<b>Repair</b> damaged Dreadnoughts and War Suns" + (c.mod("mechs") ? " (and Mechanized Units)" : "") + " — stand them upright.",
          "<b>Remove your Command Counters</b> from the board to your reinforcements.",
          "<b>Refresh</b> your Planet Cards (face up)." + (c.has("se") && !c.fote ? " Straight after, you may exhaust planets with a <b>Refresh ability</b> for their effect instead of their resources." : ""),
          "<b>Draw 1 Action Card and take 2 Command Counters</b>, placing each in any of the three areas.",
          "<b>Redistribute</b> your Command Counters between Strategy Allocation, Command Pool and Fleet Supply (then check every fleet against your Fleet Supply).",
          "<b>Return</b> your Strategy Card" + (c.p <= 4 ? "s" : "") + " to the common play area."
        ]) + ul([
          "<b>Scuttle</b> (destroy) any of your own units at any time in the Status Phase once step 1 is complete — they return to your reinforcements.",
          "Any player may <b>break</b> a trade agreement during the Status Phase (not one with the Hacan).",
          c.uses("warfare2") ? "The <b>High Alert</b> token is removed at the start of the Status Phase." : "",
          c.mod("leaders") ? "<b>Leaders:</b> each captor decides the fate of his captives — hand over, keep, or execute." : "",
          c.mod("aoe") ? "<b>Age of Empire:</b> after each Status Phase move the Turn token one objective right; onto Game Over, the game ends." : "",
          c.fote ? "<b>Fall of the Empire:</b> at the end of each Status Phase advance the round marker; entering “8” ends the game." : ""
        ]),
      src: (c) => cite(["Base p.14–15, p.19, p.25", c.mod("aoe") ? "Base p.33 · FAQ p.1" : "", c.mod("leaders") ? "Base p.34" : "", c.has("se") && !c.fote ? "SE p.7" : "", c.uses("warfare2") ? "SE p.16" : "", c.uses("imperial2") ? "SE p.17" : "", c.mod("throne") ? "Variants p.2" : "", c.mod("mechs") ? "FAQ p.13" : "", c.fote ? "SoT p.15" : "", "FAQ p.2, p.8"]) },
    {
      title: "Command Counters and the Fleet Supply",
      when: () => true,
      html: () => ul([
          "Each race has <b>16 Command Counters</b>. A counter you receive goes into one of the three areas of your Race Sheet and stays there until the next Status Phase; a counter you spend returns to your reinforcements.",
          "<b>Command Pool</b> — one counter per activation (Tactical or Transfer Action). Empty pool: no more activations.",
          "<b>Strategy Allocation</b> — pays for other players’ secondary abilities (and some race abilities and Action Cards).",
          "<b>Fleet Supply</b> (Fleet side up) — the most ships, <b>not counting Fighters</b>, you may have in any one system. You may never move, build or otherwise end up with more; any excess is removed immediately — even at the start of a battle. You may have any number of fleets.",
          "A <b>fleet</b> is all of one player’s ships in one system — Fighters included (they just don’t count toward the Fleet Supply).",
          "Advanced Fighters errata: Fighters beyond a system’s Fighter capacity count toward your Fleet Supply.",
          "You are limited to the Command Counters provided — no substitutes. With all 16 in use, effects that would give you more don’t happen. (Control Markers and Bonus Counters that run out <i>may</i> be replaced by agreed substitutes.)"
        ]),
      src: "Base p.12, p.20–21 · FAQ p.1, p.4, p.8" },
    {
      title: "Units",
      when: () => true,
      html: (c) => "<div class='tbl-wrap'><table class='tbl'><thead><tr><th>Unit</th><th>Available</th><th>Cost</th><th>Rules</th></tr></thead><tbody>" +
          [["Space Dock", "3", "4", "Builds units (planet’s resources + 2 per activation); supports 3 Fighters; sits on its planet, never in space"],
           ["Ground Force", "12 + supplements", "1 for 2", "Takes and holds planets; battle value 8 (SE p.10)"],
           ["PDS", "6", "2", "Space cannon (normally hits on 6), planetary shield, invasion defence; max 2 per planet"],
           ["Fighter", "10 + supplements", "1 for 2", "Moves only with a Carrier/War Sun; needs capacity (Space Dock 3, Carrier 6, War Sun 6)"],
           ["Carrier", "4", "3", "Capacity 6 — any mix of Fighters, Ground Forces and PDS"],
           ["Destroyer", "8", "1", "Anti-Fighter Barrage: 2 dice before a Space Battle (normally hits on 9)"],
           ["Cruiser", "8", "2", "Movement 2, combat value 7 in the rulebook’s examples"],
           ["Dreadnought", "5", "5", "Sustains 1 damage; bombards (not through a PDS shield); movement 1"],
           ["War Sun", "2", "12", "Needs the War Sun technology; sustains damage; 3 dice in battle and bombardment; ignores PDS shields; capacity 6"]]
          .concat(c.mod("mechs") ? [["Mechanized Unit", "4", "2", "Ground unit carried like a Ground Force (1 capacity); sustains damage; holds planets"]] : [])
          .concat(c.mod("flagships") ? [["Flagship", "1 per race", "on card", "Race-specific cost, combat, movement, capacity and ability; built only in your Home System"]] : [])
          .concat(c.mod("shock") ? [["Shock Troop", "12 tokens", "promotion", "A Ground Force that rolled a natural 10; battle value 5"]] : [])
          .concat(c.mod("mercs") ? [["Mercenary", "16 cards/tokens", "hired", "Recruited with Trade III; Evasion; 1 Trade Good upkeep"]] : [])
          .map((r) => "<tr><td><b>" + r[0] + "</b></td><td>" + r[1] + "</td><td>" + r[2] + "</td><td>" + r[3] + "</td></tr>").join("") +
          "</tbody></table></div>" + ul([
          "Every unit’s cost, combat value and movement is on your Race Sheet’s unit table" + (c.has("se") || c.has("sot") ? " and the expansions’ unit reference cards" : "") + "; this table gives only what the rulebooks print.",
          "Only Fighters and Ground Forces are unlimited (Supplement Counters; any substitute once those run out). Every other unit is limited to its plastic: rebuild one only after it is destroyed.",
          "A Supplement Counter is one more unit of its type and must always share its system/planet (and its Carrier) with at least one real unit of that type — keep it under one.",
          "Ground Forces and PDS aboard a Carrier take no part in battles. If the Carrier is destroyed they are destroyed with it; its Fighters survive only if other capacity in the system (Carrier, War Sun, Space Dock) supports them. Excess units on a Carrier are destroyed at once.",
          "A <b>unit</b> is any plastic piece on the board, plus Fighter and Ground Force Supplement Counters."
        ]),
      src: (c) => cite(["Base p.4, p.13, p.15, p.19–20, p.26–31", c.mod("shock") ? "SE p.10" : "SE p.10 (Ground Force value)", c.mod("mechs") ? "SoT p.11" : "", c.mod("flagships") ? "SoT p.10" : "", c.mod("mercs") ? "SoT p.12" : "", "FAQ p.7", c.mod("shock") ? "FAQ p.10" : "", c.mod("flagships") ? "FAQ p.13" : ""]) },
    {
      title: "Space Docks and production",
      when: () => true,
      html: (c) => ul([
          "To produce, activate (Tactical or Transfer Action) a system with your Space Dock; in the last step, build up to the dock planet’s <b>resource value + 2 units</b> — any mix, whatever their cost. Each Fighter and Ground Force counts as one unit.",
          "Pay the total in one lump sum from any of your planets (and Trade Goods). 1 resource buys <b>2 Fighters or 2 Ground Forces</b> — 1 even for a single one, and no mixing one of each.",
          "New ships appear in the system’s space; Ground Forces and PDS appear on the dock’s planet.",
          "<b>Blockade:</b> while an enemy ship is in the system your Space Dock can’t build ships — Ground Forces and PDS are still allowed.",
          "<b>New Space Dock</b> (cost 4): only in the Production step of an activation of its system, on a planet you have controlled <b>all round</b>, one per planet, with no enemy ships in the system. It can’t build until next round — a Space Dock placed on the board by any means counts as built this round.",
          c.uses("imperial") || c.uses("imperial2") ? "The Imperial secondary can build at a Space Dock in a system you already activated, or without activating it." : "",
          c.uses("production") ? "Production builds without activating the system (primary: +2 resources; secondary: up to 3 units)." : ""
        ]),
      src: (c) => cite(["Base p.12, p.22, p.26–27", c.uses("imperial") ? "Base p.38" : "", c.uses("production") ? "SE p.15" : "", c.uses("imperial2") ? "SE p.17" : "", "FAQ p.4–7"]) },
    {
      title: "Planets, resources and influence",
      when: () => true,
      html: (c) => ul([
          "Every planet shows <b>resources</b> (build units, buy technology), <b>influence</b> (Command Counters, some Action Cards, and your votes) and maybe a <b>technology specialty</b>.",
          "To spend, <b>exhaust</b> a Planet Card (turn it face down) for <b>all</b> its resources <b>or all</b> its influence — never both, never part; any excess is lost. Say which before exhausting.",
          "Exhausted planets refresh in the Status Phase. A newly gained Planet Card always arrives exhausted.",
          "<b>Trade Goods</b> substitute for 1 resource or 1 influence each — but never for votes.",
          "<b>Control:</b> land at least one Ground Force" + (c.mod("mechs") ? " (or Mechanized Unit)" : "") + " to take a planet; it stays yours until someone invades it. You can’t hand a planet back to neutrality.",
          "You <b>control a system</b> when you control every planet in it and have at least one non-Fighter ship there; a system without planets needs just a non-Fighter ship and no enemy units.",
          "“I control Mecatol Rex” means the planet, not the system.",
          (c.has("se") || c.has("sot")) ? "The <b>yellow</b> (general) technology specialty works like the others but doesn’t count toward objectives." : ""
        ]),
      src: (c) => cite(["Base p.12, p.17, p.19, p.21–22, p.25, p.27", c.has("se") && !c.fote ? "SE p.6" : "", c.has("sot") ? "SoT p.9" : "", c.mod("mechs") ? "SoT p.11" : "", "FAQ p.8", c.mod("mechs") ? "FAQ p.13" : ""]) },
    {
      title: "Systems, special systems and wormholes",
      when: () => true,
      html: (c) => ul([
          "<b>Home Systems</b> (yellow inner border) · <b>Special Systems</b> (red inner border) · <b>Regular Systems</b> (empty, or one or two planets; some with a wormhole). Mecatol Rex is a regular system at the centre.",
          "<b>Asteroid Field:</b> no moving through without the Anti-Mass Deflector technology; no ship ever ends its move there; it can never be activated.",
          "<b>Nebula:</b> the defending fleet gets +1 on its Space Battle rolls; ships may enter by activation but never move through; a ship leaving always has movement 1.",
          "<b>Supernova:</b> impassable; can never be activated.",
          c.has("se") && !c.fote ? "<b>Ion Storm</b> (Shattered Empire): never move through (enter by activation only); PDS can’t fire at ships inside; Fighters there roll no combat dice." : "",
          c.has("sot") && !c.fote ? "<b>Gravity Rift</b> (Shards of the Throne): ships may move into and through it; each ship moving <b>out of or through</b> it rolls a die — 1–5 destroys it (and everything it carries)." : "",
          "<b>Empty system</b> (for rules and cards): no units of any player, yours included — planets, Control Markers and Command Counters don’t count. A Special System is never “empty”.",
          c.has("se") && !c.fote ? "<b>Trade Stations</b> (Tsion, Sumerian): never invaded — whoever is the only player with ships in the system controls it (Control Marker + its card, exhausted); no Ground Forces, Space Docks, PDS" + (c.mod("leaders") ? ", Leaders" : "") + (c.mod("facilities") ? " or Facilities" : "") + " there; no Distant Suns counter; capturing one doesn’t break a trade agreement; still a planet for card effects. Its refresh ability gives 2 Trade Goods." : "",
          c.has("se") && !c.fote ? "<b>Refresh abilities</b> (icon beside a planet’s name): in the Status Phase, straight after refreshing, exhaust the planet for its ability instead of its resources — 2 Trade Goods, 2 Shock Troops (Ground Forces without that option), 2 Ground Forces or 2 Fighters, placed on that planet. No Fighters (ships) can be gained this way while enemy ships are in the system, and the planet Mirage has no Fighter capacity of its own." : "",
          "<b>Wormholes:</b> matching wormholes make systems adjacent for movement only; an unmatched wormhole does nothing."
        ]),
      src: (c) => cite(["Base p.18–19, p.25", c.has("se") && !c.fote ? "SE p.6–7" : "", c.has("sot") && !c.fote ? "SoT p.9" : "", "FAQ p.8" + (c.has("se") && !c.fote ? ", p.11" : "")]) },
    {
      title: "Trade agreements and Trade Goods",
      when: () => true,
      html: (c) => ul([
          "Each race has <b>two Trade Cards</b>, kept Trade Contract side up (no value to you). Trade values differ between races.",
          "<b>Opening agreements:</b> during the Trade primary, two players who agree each give the other one of their Trade Cards (agreement side up). The active player must <b>approve</b> every new agreement — bribes are welcome. One agreement per pair of players, so at most two each.",
          "<b>Collecting:</b> count the trade values in front of you and take that many Trade Goods — " +
            (c.uses("trade") ? "during the Trade primary (holder: 3 extra Trade Goods first) or its secondary. Never on an agreement formed during the same action."
              : (c.uses("trade2") ? "during the Trade II primary, which pays everyone before new agreements are opened (see below)."
                : "during the Trade III primary, which opens new agreements first and then pays everyone, even on those (see below).")) +
            " The supply is limited, so collect in clockwise order.",
          "Trade Goods may be given to other players at any time.",
          "<b>Breaking:</b> either partner may break an agreement in the Status Phase (except with the Hacan); a Space Battle or Invasion Combat between the partners breaks it automatically (PDS fire and Action Cards don’t)." + (c.uses("trade") ? " Trade option <b>b</b> cancels every agreement in play, Hacan’s included." : ""),
          "Micro Technology (errata): +1 Trade Good per active agreement whenever you collect from agreements.",
          c.uses("trade2") ? "Trade II: everyone collects during the primary, the others 1 fewer in total; it can cancel up to 2 agreements (not Hacan)." : "",
          c.uses("trade3") ? "Trade III: everyone collects during the primary, even on new agreements; its secondary breaks another pair’s agreement." : ""
        ]),
      src: (c) => cite(["Base p.24–25, p.37", c.uses("trade2") ? "SE p.15" : "", c.uses("trade3") ? "SoT p.20" : "", "FAQ p.1, p.6"]) },
    {
      title: "Action Cards",
      when: () => true,
      html: () => ul([
          "Keep them hidden. Hand limit <b>7</b>: discard down immediately; at 7, draw and discard one card at a time.",
          "Play a card only in the circumstances printed on it. Announce that you are playing one; others may then announce theirs; reveal them all and resolve in order of play (clockwise from the Speaker when no one holds Strategy Cards).",
          "<b>Sabotage</b> needs no announcement: play it just after an Action Card is revealed (and its choices declared) to cancel it; discard both. A sabotaged card doesn’t count as played.",
          "Never play two identical cards on the same situation or entity in one round.",
          "“Play: As an action” replaces your action for the turn, and its text must be resolved.",
          "When the deck runs out, shuffle the discards into a new deck. You may play an Action Card between two hits."
        ]),
      src: "Base p.22–23 · FAQ p.2–3" },
    {
      title: "Political Cards and the Galactic Council",
      when: () => true,
      html: (c) => ul([
          c.uses("political") ? "The Political card’s holder draws the top Political Card and reads its agenda aloud; the Galactic Council then votes." : "",
          "<b>Elect</b> agendas: each player votes for one subject; the most votes (not necessarily a majority) wins. For “elect two planets”, each vote names a group of two.",
          "<b>For / Against</b> agendas: the majority of votes cast decides.",
          "<b>Laws:</b> voted “for”, enact the effect and keep the card face up — permanent unless a later agenda repeals it. Voted “against”, resolve any against-effect and discard.",
          "<b>Voting:</b> first debate, threaten and bribe — no promise is binding. Then vote clockwise from the player left of the Speaker (the Speaker votes last). Your votes = total influence of your <b>unexhausted</b> planets (minimum 1); cast all or none, never split. Voting doesn’t exhaust planets; Trade Goods can’t buy votes.",
          "You may abstain. A tie — even 0–0 — is broken by the Speaker.",
          c.varSC ? "<b>Political Card hand</b> (variant set): hand limit 5; the Assembly card makes a player play one from hand (drawing the top card if he has none); discard one instead of a Trade Good at any time." : "",
          c.fote ? "<b>Agenda Cards</b> (Fall of the Empire) replace Political Cards: icons show Elect Player, Elect Planet (never a Home System) or Event (resolve, discard, draw another)." : ""
        ]),
      src: (c) => cite(["Base p.23, p.37", c.varSC ? "SE p.15" : "", c.fote ? "SoT p.14" : "", "FAQ p.5"]) },
    {
      title: "Technology",
      when: () => true,
      html: (c) => ul([
          "Four fields: <b>red</b> Warfare, <b>green</b> Biotechnology, <b>blue</b> Propulsion, <b>yellow</b> General. Each player’s deck is identical (24 advances in the base game" + (c.has("se") && !c.fote ? "; Shattered Empire adds 4 brand-new ones per colour" : "") + (c.has("sot") ? "; Shards of the Throne adds 4 more" : "") + ").",
          "You get advances mainly from the Technology card (primary: 1 free" + (c.uses("technology2") ? ", then you may buy a second for 8 resources" : "") + "; secondary: 1 for " + (c.uses("technology2") ? "6" : "8") + " resources), and from some Action and Political Cards. Acquired cards go face up in your play area.",
          "You need every <b>prerequisite</b> printed on a card already face up in front of you. Technologies can’t be given to other players.",
          "<b>Technology specialties:</b> each planet you control with a red, green or blue specialty cuts 1 off the cost of an advance of that colour when you buy with the Technology secondary — per planet, and only while that Planet Card is unexhausted (you needn’t exhaust it)." + ((c.has("se") || c.has("sot")) ? " The yellow specialty works the same way but doesn’t count toward objectives." : ""),
          "Technology tree: Base p.42–43" + (c.has("se") && !c.fote ? "; with the new advances, SE p.18–19" : "") + ".",
          c.mod("rst") ? "<b>Race-Specific Technologies:</b> whenever you may buy a technology, you may buy your race’s instead for the normal cost <b>plus</b> the cost on its card (e.g. Technology primary: just the card’s cost). No prerequisites, no colour — so no specialty or Research Grant discount" + (c.has("se") ? ", and Subsidized Studies doesn’t apply either" : "") + "; otherwise a normal technology. Never another race’s" + (c.has("se") ? " (not even through Sharing of Technology or Technological Society)" : "") + "." : ""
        ]),
      src: (c) => cite(["Base p.4, p.24, p.38", c.has("se") && !c.fote ? "SE p.5, p.8" : "", c.uses("technology2") ? "SE p.16" : "", c.has("sot") ? "SoT p.9" : "", c.mod("rst") ? (c.has("se") ? "SE p.9" : "") : "", c.mod("rst") && c.has("sot") ? "SoT p.10" : "", c.mod("rst") ? "FAQ p.10" : "", "FAQ p.6"]) },
    {
      title: "Objectives",
      when: (c) => !c.fote,
      html: (c) => ul([
          "<b>Public Objectives</b> " + (c.mod("aoe") ? "are all laid out face up at the start (Age of Empire) and no others enter the game" : "are revealed a few at a time" + (c.uses("imperial") ? " by the Imperial primary" : "") + (c.uses("bureaucracy") ? " by Bureaucracy" : "")) + "; anyone can score each one, once. Your <b>Secret Objective</b> is yours alone.",
          "In Status Phase step 1 you may claim <b>one</b> Public Objective and/or your Secret Objective; place a Control Marker on each claimed card." + (c.has("sot") ? " With two Secret Objectives you may still claim only one per Status Phase." : ""),
          "Objectives saying <b>“I now…”</b> must be fulfilled right then — e.g. “I now spend 20 resources” means paying them in step 1.",
          "Keep your Secret Objective hidden until you can meet it. Reveal it without meeting it and you lose it for the rest of the game.",
          c.mod("varobj") ? "<b>Variant Objectives:</b> Shattered Empire’s Stage I and II decks lean toward conflict. You have <b>won a space battle</b> if you are the only player with ships left in the system; the Custodians of Mecatol Rex and Domain Counters aren’t “opposing” forces for objectives." : "",
          c.mod("prelim") ? "<b>Preliminary Objectives</b> work like Secret Objectives, easier and worth 1 VP; after completing yours, draw a Secret Objective from the Secret deck (you can’t claim it in the same Status Phase)." : "",
          c.has("se") ? "Rulings on Shattered Empire’s objectives: “destroyed x ships in a Space Battle” counts ships destroyed by pre-combat abilities but not by PDS fire; “destroyed X Ground Forces” counts bombardment and Action Cards such as Chemical Warfare." : "",
          c.has("sot") ? "An effect that targets a Secret Objective never touches one already fulfilled and scored." : ""
        ]),
      src: (c) => cite(["Base p.14, p.26", c.mod("aoe") ? "Base p.33" : "", c.mod("varobj") ? "SE p.9" : "", c.mod("prelim") ? "SoT p.10" : "", "FAQ p.8" + (c.mod("varobj") ? ", p.10" : "") + (c.has("se") ? ", p.11" : "") + (c.has("sot") ? ", p.14" : "")]) }
  ];
})();

/* =============================================================================
   RULES REFERENCE — optional rules, variants, the scenario, race rulings, errata
   ============================================================================= */
(function () {
  "use strict";
  const ul = (a) => "<ul>" + a.filter(Boolean).map((x) => "<li>" + x + "</li>").join("") + "</ul>";
  const ol = (a) => "<ol>" + a.filter(Boolean).map((x) => "<li>" + x + "</li>").join("") + "</ol>";
  const cite = (a) => T3.cite(a);
  const h = (t) => "<h4>" + t + "</h4>";
  const dl = (rows) => "<dl class='defs'>" + rows.filter(Boolean).map((r) => "<dt>" + r[0] + "</dt><dd>" + r[1] + "</dd>").join("") + "</dl>";

  const more = [
    { title: "Option: The Long War", when: (c) => c.mod("longwar"),
      html: (c) => ul([
        "Play on the <b>0–14</b> side of the Victory Point Track: the target is 14 victory points" + (c.uses("bureaucracy") ? " (13 here, one fewer as recommended with Bureaucracy)" : "") + ".",
        c.varSC
          ? "Public Objective deck: <b>8 Stage I</b> over <b>6 Stage II + Game Over</b> — 15 cards: the Long War’s 14 plus the variant Strategy Cards’ extra Stage II."
          : "Public Objective deck: <b>8 Stage I</b> over <b>5 Stage II + Game Over</b> — 14 cards instead of 10. The game ends somewhere between turns 9 and 14.",
        c.mod("aoe")
          ? "<i>Alternative</i> (leaving out the Game Over card): not with Age of Empire, whose objective row ends the game when the Turn token reaches Game Over."
          : "<i>Alternative:</i> leave the Game Over card out and end the game after the Status Phase in which the last Public Objective was drawn."
      ]),
      src: (c) => cite(["Base p.6, p.32", c.mod("aoe") ? "Base p.33" : "", c.varSC ? "SE p.9" : "", c.uses("bureaucracy") ? "SE p.16" : ""]) },
    { title: "Option: Age of Empire", when: (c) => c.mod("aoe"),
      html: (c) => ul([
        "Build the Public Objective deck as normal, then deal it face up in a row from left to right; once the Game Over card is placed, box the rest. The row (" +
          ((c.mod("longwar") ? 8 : 6) + 1) + "–" + ((c.mod("longwar") ? 14 : 10) + (c.varSC ? 1 : 0)) + " cards) ends with Game Over.",
        "Every objective in the row may be claimed from round 1; no other Public Objectives enter the game.",
        "<b>Errata:</b> no player may qualify for a Stage II objective during the first three rounds.",
        "After the first round’s Status Phase put a Turn token on the leftmost card; after every Status Phase move it one card right. When it moves onto <b>Game Over</b> the game ends immediately and the most victory points wins."
      ]),
      src: (c) => cite(["Base p.33", c.mod("longwar") ? "Base p.32" : "", c.varSC ? "SE p.9" : "", "FAQ p.1"]) },
    { title: "Option: Distant Suns (Domain Counters)", when: (c) => c.mod("ds"),
      html: (c) => h("How counters work") + ul([
        "A planet’s counter is revealed — and resolved at once — right after you have landed all the Ground Forces you want there during the Planetary Landings step of a <b>Tactical Action</b>. You may not land more on that planet this activation.",
        "A planet gained without landing forces in a Tactical Action loses its counter unrevealed (it goes back in the box). A planet that returns to neutral doesn’t get a new counter.",
        "<b>Probing:</b> right after the movement step of a Tactical Action (not a Transfer), if you have at least one Fighter in the activated system you may secretly look at every face-down counter there, then put them back. You can’t land on a planet in the activation you probed it.",
        "<b>Razing:</b> at the start of the Planetary Landings step (errata), each Dreadnought or War Sun in the system may raze one <b>face-down</b> counter — box it unresolved. A ship that razes can’t bombard in the same activation. Then roll a die: <b>1–7</b> no effect · <b>8–9</b> lose 3 random Action Cards · <b>0</b> lose 3 random Action Cards and exhaust all your ready planets.",
        "<b>Lazax Survivors:</b> probed — remove it; the prober gains <b>1 VP</b> and draws 3 Action Cards. Razed — the razer discards all his Action Cards, exhausts all his planets, loses all his Trade Goods and may not vote on the next agenda.",
        "Voluntary Annexation" + (c.uses("diplomacy2") ? " (or Diplomacy II’s annexation)" : "") + " of a planet removes its counter without effect.",
        c.mod("leaders") ? "A Leader whose invasion of a neutral planet fails is killed" + ((c.mod("newds") || c.mod("custodians")) ? "; a Leader on a ship lost to a Fighter Ambush rolls as in a Space Battle, but “captured” means killed" : "") + "." : ""
      ]) + h("Domain effects") + dl([
        ["Radiation", "Kill all the Ground Forces of the initial landing — the planet stays uncontrolled — then remove the counter."],
        ["Biohazard", "The first Ground Force to land here is always eliminated while the counter remains; discard it after a player successfully invades (you can’t leave it in place)."],
        ["Hostile Locals (number)", "That many local Ground Forces fight any invader (another player rolls for them). A failed invasion restores them to full strength. Can’t be bombarded. Discard after a successful invasion."],
        ["Lazax Survivors", "You may take this counter: +3 votes on all future political agendas. (Special probing/razing rules above.)"],
        ["Settlers", "Return your Ground Forces to their Carrier/War Sun and roll: 6+ place 2 free Ground Forces of yours on the planet; 1–5 a random opponent places 2 of his there. Discard."],
        ["Peaceful Annexation", "The landing proceeds without incident. Discard."],
        ["Industrial Society", "You may place a free Space Dock here (it can’t build this round), and the Planet Card arrives unexhausted. Discard."],
        ["Technological Society", "The player on your left picks a free advance from your Technology deck that you have the prerequisites for" + (c.mod("rst") ? " (never another race’s Race-Specific Technology)" : "") + ". Discard."],
        ["Wormhole Discovery", "Place the counter in the system: a new wormhole that connects to others of its letter (Alpha or Beta). It doesn’t count for the Master of Gates objective."],
        ["Natural Wealth (number)", "Receive that many Trade Goods, if able. Discard."],
        c.mod("newds") ? ["Fighter Ambush (number)", "After landing, fight a Space Battle against that many local Fighters (another player rolls; no Anti-Fighter Barrage). If you lose, the planet stays uncontrolled, your landed Ground Forces are discarded and the Fighters return to full strength. Discard after winning."] : null,
        c.mod("newds") ? ["Automated Defense System", "Roll 2 dice: for each 6+ lose 1 ship in the system and one landing Ground Force; with no Ground Forces left the planet stays uncontrolled. The first successful invader removes it and may place a free PDS."] : null,
        c.mod("newds") ? ["Hidden Factory", "Receive free ships worth up to 2 resources, placed in this system. Discard."] : null,
        c.mod("newds") ? ["Native Intelligence", "Secretly look at any one face-down Domain Counter on any planet. Discard."] : null,
        c.mod("newds") ? ["Hostage Situation", "Pay Trade Goods equal to the number of Ground Forces landing, or lose all of the initial landing (the planet stays uncontrolled). Discard."] : null
      ]) + (c.mod("terrds") ? h("Territorial Distant Suns") + ul(["Low-risk counters (Peaceful Annexation, Natural Wealth 2, Native Intelligence, Hostile Locals 1, Biohazard, Hostage Situation, Fighter Ambush 1, Settlers) sit on the outer ring and on planets adjacent to Home Systems; everything else is mixed on the remaining planets."]) : ""),
      src: (c) => cite(["Base p.33–34, p.44", "SE p.13", c.has("se") ? "SE p.20" : "", c.mod("terrds") ? "SE p.11" : "", "FAQ p.4", c.uses("diplomacy2") ? "FAQ p.9" : "", c.mod("rst") ? "FAQ p.10" : "",
        c.mod("leaders") && (c.mod("newds") || c.mod("custodians")) ? "FAQ p.11" : ""]) },
    { title: "Option: Leaders", when: (c) => c.mod("leaders"),
      html: (c) => h("Moving Leaders") + ul([
        "Three per race; all start in the Home System. A Leader is always on a planet or aboard a ship — never alone in space, never on a neutral or enemy planet.",
        "Any ship, <b>Fighters included</b>, can carry Leaders (same pick-up rules as Carriers with Ground Forces); they take no capacity. A Leader lands on a neutral or hostile planet only with at least one Ground Force." + (c.has("se") ? " Leaders can’t go to Trade Stations." : "") + (c.mod("mercs") ? " Mercenaries can’t carry Leaders." : ""),
        "A Leader in an invasion that <b>fails</b> is <b>captured</b> by the defending player — or <b>killed</b> if the planet was neutral (Distant Suns)."
      ]) + h("Killed, captured or escaped") + dl([
        ["Carrying ship destroyed in a Space Battle", "Roll: <b>1–5</b> killed · <b>6–8</b> escapes to any friendly planet not under blockade · <b>9–10</b> captured by the opponent. Destroyed any other way: killed."],
        ["Planet successfully invaded", "Roll: <b>1–5</b> captured · <b>6–9</b> escapes · <b>10</b> killed. Ownership changing any other way: the Leader escapes."],
        ["Captives", "In the Status Phase the captor may hand a captive to any player (to its owner = freed, placed on a friendly planet not under blockade), keep it another round, or execute it."],
        ["Rescue", "After successfully invading a planet of a player holding captives, roll: 9 or 10 finds one (your choice). Someone else’s Leader becomes your captive; your own is placed on a friendly planet. Invading a player’s last planet takes all his captives."]
      ]) + h("Abilities") + dl([
        ["Scientist", "Technology specialty planet: discount 2 instead of 1" + (c.has("sot") ? " (on a two-specialty planet, one more than the planet’s 2)" : "") + " · new Space Dock there costs 2 · its PDS get +1 on all rolls · with a PDS there, War Suns (and Graviton-Negator Dreadnoughts) can’t bombard it."],
        ["Diplomat", "Delays an invasion of its planet: the invading Ground Forces return to their Carriers (they may not attack another planet instead). It cancels only that one invasion — another player may still invade the planet this round (even the same player, if his Command Counter leaves that system), and a War Sun may still bombard it. A planet protected by a Diplomat can’t be protected again this round or next. A fleet with a Diplomat may move through a system with an opponent’s ships if he permits."],
        ["General", "Invading with your Ground Forces: re-roll up to 2 of your own dice each round (2 per General; never the same die twice). Defending: bombardment against its planet is at −4, and defending Ground Forces there get +1."],
        ["Admiral", "In a Space Battle, 1 extra die for the ship carrying it (only in the combat-dice step). A Dreadnought carrying one gets +1 movement. A fleet attacked by a fleet with an Admiral can’t retreat unless it has an Admiral too (the Naalu ability and Skilled Retreat ignore this)."],
        ["Agent", "Invading with your Ground Forces: enemy PDS can’t fire at them, and after success you may replace the enemy PDS and Space Dock with your own (not if yours are all built; a captured Space Dock can’t build this round). May be sacrificed as a Sabotage card."]
      ]) + ul(["Leader abilities don’t stack (two Admirals ≠ +2 movement) — except the General’s re-rolls.", c.mod("mechs") ? "Mechanized Units are immune to Leader abilities." : ""]),
      src: (c) => cite(["Base p.34–35", c.has("se") || c.mod("mercs") ? (c.mod("mercs") ? "SoT p.12" : "") : "", "FAQ p.3–4" + (c.has("se") ? ", p.11" : "") + (c.mod("mechs") ? ", p.13" : "") + (c.has("sot") ? ", p.15" : "")]) },
    { title: "Option: Sabotage Runs", when: (c) => c.mod("sabotage"),
      html: () => ul([
        "Before a Space Battle, right after any Anti-Fighter Barrage, each player (attacker first) may announce a Sabotage Run against an enemy War Sun and commit Fighters to it.",
        "<b>Outer defences:</b> roll a die per committed Fighter — an <b>unmodified 9 or 10</b> gets through; any other result destroys the Fighter (no return fire).",
        "<b>Inner defences:</b> roll one at a time for each Fighter that got through — an <b>unmodified 10</b> destroys the War Sun outright (no return fire); anything else destroys that Fighter.",
        "Surviving Fighters and an unharmed War Sun then fight normally. Against two War Suns, split your Fighters into two separate runs.",
        "Sabotage Run rolls are not “combat rolls”, so combat-roll modifiers don’t apply."
      ]),
      src: "Base p.35 · SE p.13 · FAQ p.3" },
    { title: "Official variants: the Imperial Strategy", when: (c) => c.mod("homeworlds") || c.mod("star") || c.mod("throne"),
      html: (c) => ul([
        c.mod("homeworlds") ? "<b>Homeworlds:</b> to gain victory points from <i>any</i> source you must control every planet in your Home System. Points you couldn’t take aren’t banked; after regaining control you must earn them again." : "",
        c.mod("star") ? "<b>The Star in the Crown:</b> the Imperial primary ability gives <b>1 victory point</b> instead of 2. The sheet says players should also play Age of Empire (kept on here); The Ancient Throne may not be combined with it." : "",
        c.mod("throne") ? "<b>The Ancient Throne:</b> the Imperial primary ability (still called <i>Imperial Claim</i>) gets new text — choose <b>a)</b> gain 1 VP at once if you control Mecatol Rex, and — whether or not you do — qualify for any number of Public Objectives in the upcoming Status Phase (meeting each one’s requirements); or <b>b)</b> execute the Imperial secondary ability at no cost, and no other player may execute it this round. The secondary ability is unchanged. Because it replaces the whole primary, the Imperial card no longer reveals objectives. The sheet says players should also play Age of Empire (kept on here) and not to combine it with The Star in the Crown." : ""
      ]),
      src: "Variants p.2" },
    { title: "Shattered Empire: Artifacts", when: (c) => c.mod("artifacts"),
      html: (c) => ul([
        "When you gain control of a planet with a face-down Artifact token, flip it. A coloured artifact: take its <b>Special Objective card</b> and gain <b>1 VP</b>. A blank “dummy” may be discarded.",
        "Lose the planet and you lose the card and the point. Anyone taking a planet with a face-up artifact takes the card (from its holder) and the point.",
        "Artifacts are never moved or destroyed; once revealed they stay face up.",
        (c.uses("diplomacy2") ? "Annexing a planet with Diplomacy II reveals its artifact after you take control. " : "") + "A player never has fewer victory points than the artifact planets he controls."
      ]),
      src: (c) => cite(["SE p.9–10", "FAQ p.11", c.uses("diplomacy2") ? "FAQ p.9" : ""]) },
    { title: "Shattered Empire: Shock Troops", when: (c) => c.mod("shock"),
      html: () => ul([
        "A Ground Force rolling a <b>natural 10</b> in battle becomes a Shock Troop at the end of that combat round, after casualties (swap in a token, if any are left).",
        "Battle value <b>5</b>. After a successful invasion with at least one surviving Shock Troop (and a Ground Force), you may replace the enemy Space Dock and PDS there with your own, free (not if yours are all on the board; a captured Space Dock can’t build this round).",
        "In Invasion Combat Shock Troops must be taken as casualties <b>before</b> other Ground Forces (not against bombardment or PDS fire).",
        "A Shock Troop must always be with at least one plastic Ground Force of yours — on ships, any Ground Force in the same fleet counts. Left alone, it reverts to a normal Ground Force.",
        "Shock Troops count as Ground Forces for every card and ability. Plague: roll for each Shock Troop and Ground Force separately.",
        "Hope’s End’s refresh ability gives 2 Shock Troops."
      ]),
      src: "SE p.7, p.10 · FAQ p.8, p.10" },
    { title: "Shattered Empire: Space Mines", when: (c) => c.mod("mines"),
      html: () => ul([
        "<b>Deploy:</b> in the Production step of an activation of a system with one of your Cruisers, spend 2 resources for 1 space mine (at most one per activation, while tokens last); put your Control Marker on it. You can’t build a Cruiser and lay a mine with it in the same step.",
        "<b>Trigger:</b> after the PDS fire step, if you moved ships into a system with an opponent’s mines, roll 1 die for each non-Fighter ship entering (announce which ship before each roll): <b>9 or 10 hits it</b>. Then remove one mine token (your choice). Roll only once however many mines there are.",
        "Mines trigger whenever an enemy ship enters or is built in the system — Warfare secondaries, Transfer Actions and retreats included — but not when merely passing through (unless it picks up units there).",
        "Mines aren’t units: they can’t be scuttled and don’t count for Diplomacy II or Tactical Retreats. Saar Space Docks are immune. A ship damaged by a mine can’t be targeted by Direct Hit.",
        "In a Transfer Action all production is in one of the two systems — never units in one and a space mine in the other."
      ]),
      src: "SE p.10 · FAQ p.3, p.5, p.9–10" },
    { title: "Shattered Empire: The Wormhole Nexus", when: (c) => c.mod("nexus"),
      html: () => ul([
        "The Nexus sits off the board and is treated like any other system, adjacent to <b>every</b> system containing an Alpha or Beta wormhole.",
        "Whenever a ship uses a wormhole, it may choose the Nexus or the matching wormhole.",
        "You needn’t control the Nexus for the Keeper of Gates objective. Its planet can’t be annexed through a wormhole."
      ]),
      src: "SE p.10 · FAQ p.9" },
    { title: "Shattered Empire: Facilities", when: (c) => c.mod("facilities"),
      html: () => ul([
        "A <b>Colony</b> adds 1 influence and a <b>Refinery</b> 1 resource to a planet outside your Home System. Cost: <b>1 resource</b>.",
        "Build it in the Produce Units step of a <b>Tactical Action</b> (not a Transfer), following the Space Dock rules: on a planet you have held all round, with no opponent ships in the system, while cards of that type remain. Never on a Trade Station.",
        "Building it exhausts the planet (you may exhaust that planet to help pay for it) — so no bonus that round. Tuck the card under the Planet Card; it is never exhausted itself: the planet simply counts 1 higher when exhausted.",
        "One facility per planet. A successful invasion destroys it — unless an Agent or Shock Troop captures it like a Space Dock."
      ]),
      src: "SE p.11 · FAQ p.10" },
    { title: "Shattered Empire: Tactical Retreats", when: (c) => c.mod("tretreat"),
      html: () => ul([
        "When announcing a retreat, the defender may spend a Command Counter from his <b>Strategy Allocation</b> area to activate an adjacent, <b>unactivated</b> system that contains no enemy units. At the end of the combat round he must retreat there.",
        "Normal retreats are still allowed. The Naalu ability can be used with a Tactical Retreat."
      ]),
      src: "SE p.11 · FAQ p.9, p.11" },
    { title: "Shattered Empire: Custodians of Mecatol Rex", when: (c) => c.mod("custodians"),
      html: () => ul([
        "The Custodians defend Mecatol Rex with <b>3 Fighters</b> (a Fighter Ambush) and <b>2 Ground Forces</b> (Hostile Locals), resolved exactly like those Domain Counters: first win the Space Battle against the Fighters (no Anti-Fighter Barrage), then beat the locals with your Ground Forces. Defeated tokens leave the game.",
        "Voluntary Annexation of Mecatol Rex, or an exploding Ancient Artifact, removes them. They are not “opposing” forces for objectives."
      ]),
      src: "SE p.11, p.20 · FAQ p.11" },
    { title: "Shattered Empire: Voice of the Council", when: (c) => c.mod("voice"),
      html: (c) => ul([
        "Before resolving the primary ability of the " + (c.uses("assembly") || c.uses("assembly2") ? "Assembly" : "Political") + " card, its holder may call a vote for <b>Voice of the Council</b>.",
        "Everyone votes for any player, as for an agenda (cards affecting agenda votes apply). Most votes — the Speaker breaks ties — takes the Special Objective and <b>1 VP</b>; the previous holder loses 1 VP.",
        c.has("sot") ? "The Nekro Virus can’t vote on it." : ""
      ]),
      src: (c) => cite(["SE p.11", "FAQ p.10" + (c.has("sot") ? ", p.12" : "")]) },
    { title: "Shattered Empire: Simulated Early Turns", when: (c) => c.mod("early"),
      html: (c) => ul([
        "Played once, right after setup: claim two systems, spend Home System resources + 3 on units and/or one 4-resource technology, place units, take planets, reveal one objective" + (c.mod("aoe") ? " (nothing to reveal under Age of Empire — see Setup)" : "") + ", run an abbreviated Status Phase (1 Action Card, refresh planets, refresh abilities allowed). Full steps are in Setup.",
        "No race abilities or technologies during the procedure; nothing is produced at a particular Space Dock, so Space Dock discounts don’t apply."
      ]),
      src: (c) => cite(["SE p.12–13", c.mod("aoe") ? "Base p.33" : "", "FAQ p.9, p.11"]) },
    { title: "Shards of the Throne: Preliminary Objectives", when: (c) => c.mod("prelim"),
      html: () => ul([
        "Dealt at setup instead of the Secret Objective. They work exactly like Secret Objectives but are easier and worth <b>1 VP</b>.",
        "After completing your Preliminary Objective, draw a Secret Objective from the Secret Objective deck — you can’t claim it in the same Status Phase."
      ]),
      src: "SoT p.10 · FAQ p.14" },
    { title: "Shards of the Throne: Flagships", when: (c) => c.mod("flagships"),
      html: () => ul([
        "Build your Flagship when producing units in your <b>Home System</b> (never elsewhere); its cost is on your race’s Flagship card. Only one of yours on the board at a time — you may rebuild it after it is destroyed.",
        "Cost, combat value, movement, capacity and special ability are on the card. It follows all normal unit rules — Fleet Supply included — and all cards and abilities that affect ships; Nano Technology and Type IV Drive don’t affect it.",
        "Rulings: the Arborec Duha Menaimon may produce Ground Forces (with Production only alongside a friendly Space Dock). The Creuss Hil Colish gives its <b>destination</b> system a “D” wormhole it can’t use itself, and no other race may use it. The Xxcha Loncara Ssodu always has Deep Space Cannon (even unresearched) and no other PDS technology, and can’t be used in Invasion Combat. Ground Forces fighting as Fighters with the Yin Van Hauge follow all Fighter rules."
      ]),
      src: "SoT p.10 · FAQ p.11–13" },
    { title: "Shards of the Throne: The Final Frontier", when: (c) => c.mod("frontier"),
      html: () => ul([
        "A system’s Space Domain Counter is revealed as soon as all moving units have ended their movement there; resolve it immediately. It can be used with or without Distant Suns."
      ]) + dl([
        ["Abandoned Transport", "The revealer receives 2 Trade Goods."],
        ["Alien Technology", "The revealer may research any one technology he has the prerequisites for, at no cost."],
        ["Derelict Ship", "The revealer may gain 1 Cruiser for free in this system."],
        ["Discovery", "The revealer may draw 1 Action Card."],
        ["Precursor Space Station", "Stays in play: while a player controls this system, he needs 1 fewer victory point to win."],
        ["Empty Space", "No effect."],
        ["Gravity Rift", "Stays in play: the system is now a Gravity Rift."],
        ["Space Pirates", "The revealer loses all his Trade Goods or is attacked by a Dreadnought (another player rolls for it); with no Trade Goods he is attacked. Then discard."],
        ["Supernova", "Stays in play: every ship in the system is destroyed and the system is now a Supernova."],
        ["Alpha / Beta Wormhole Discovery", "Stays in play: the system now has an Alpha (or Beta) wormhole. Doesn’t count for Keeper of Gates."]
      ]),
      src: "SoT p.11, p.24 · FAQ p.15" },
    { title: "Shards of the Throne: Mechanized Units", when: (c) => c.mod("mechs"),
      html: () => ul([
        "<b>4 available, cost 2.</b> Built on the planet of the producing Space Dock; carried like Ground Forces (1 capacity); never in space; picked up by any ship with capacity passing through; land in Planetary Landings.",
        "They count as Ground Forces for <b>invading and controlling</b> planets only (including cards that make a planet neutral when no Ground Forces remain). They fight in Invasion Combat, but are immune to everything else that refers to Ground Forces — Action Cards, technologies, Domain Counters, bombardment, PDS fire and Leaders.",
        "<b>Sustain damage:</b> the first hit only damages it (turn it on its side); a second destroys it. Repaired in the Status Phase like ships."
      ]),
      src: "SoT p.11 · FAQ p.13" },
    { title: "Shards of the Throne: Mercenaries", when: (c) => c.mod("mercs"),
      html: () => h("Hiring") + ul([
        "Only through the <b>Trade III</b> primary: before recruiting, every player pays <b>1 Trade Good</b> per Mercenary he has or returns it (card to the bottom of the deck, token to the supply). Then the active player may draw two, keep one and secretly put the other on the bottom, placing its token <b>ground side up</b> on a planet he controls."
      ]) + h("On the board") + ul([
        "Mercenaries are units, but not Ground Forces: they never claim planets, and a planet left with only a Mercenary reverts to neutral.",
        "Each Mercenary’s combat values, movement and special ability are printed on its card. The two-sided token shows whether it is in space or on the ground, with its battle value for each. Ground → space only during a Tactical or Transfer Action; space → ground in Planetary Landings. In space it counts toward Fleet Supply, can’t be carried, and counts as a ship for cards like Flank Speed and High Alert. Mercenaries can’t carry Leaders.",
        "Battle abilities work only if the Mercenary takes part in that Space Battle or Invasion Combat (it may do both in one action). N’orr and Jol-Nar modifiers apply; Generals, Biohazard, Radiation and X-89 don’t affect them."
      ]) + h("Evasion (x)") + ul([
        "Whenever a hit is assigned to a Mercenary (PDS fire, pre-combat abilities and bombardment included), roll: <b>x or higher</b> and it survives that hit; lower, and it is destroyed — card and token leave the game.",
        "Only one hit per combat round may go to a Mercenary unless you have no plastic units in the battle; every other ship must take a hit first (units that sustain damage, two). With several Mercenaries, spread the excess hits evenly."
      ]),
      src: "SoT p.12, p.20 · FAQ p.13–14" },
    { title: "Shards of the Throne: Political Intrigue", when: (c) => c.mod("intrigue"),
      html: (c) => h(c.uses("assembly2") ? "Council steps (Assembly II)" : "Council steps (Political II)") + (c.uses("assembly2") ? ol([
        "The active player draws 2 Political Cards, then <b>chooses a player</b> (himself included) to resolve 1 Political Card from his hand.",
        "He gives the <b>Speaker token</b> to any player except the chosen one (or keeps it if he is already the Speaker).",
        "<b>Choose Representatives</b>, face down.",
        "<b>Resolve Spies</b>, starting with the Speaker, clockwise: each Spy is revealed and resolves its ability (usually targeting another Representative, which is revealed). Then all Representatives are turned face up.",
        "<b>Bargaining and Promissory Notes.</b>",
        "<b>Voting and outcome.</b>"
      ]) : ol([
        "The active player picks one of the <b>two face-up</b> Political Cards.",
        "<b>Choose Representatives:</b> everyone places one of his Representatives face down.",
        "<b>Resolve Spies</b>, starting with the Speaker, clockwise: each Spy is revealed and resolves its ability (usually targeting another Representative, which is revealed). Then all Representatives are turned face up.",
        "<b>Bargaining and Promissory Notes:</b> offer Trade Goods or Notes; only Notes bind.",
        "<b>Voting and outcome;</b> then draw a new Political Card face up beside the one not chosen."
      ])) + h("Representatives") + ul([
        "Bonus votes (upper left) and any ability bonus add to your planets’ influence. No Representative — or an assassinated or killed one — means you can’t vote this time (you may still offer Notes).",
        "<b>Spies</b> act first, often to assassinate. <b>Bodyguards</b> can’t be assassinated (but can be killed by other effects). <b>Councilors</b> bring more votes but are more exposed.",
        "An assassinated or killed Representative leaves the game."
      ]) + h("Promissory Notes") + ul([
        "Starting with the Speaker, each player may offer <b>one</b> Note per Political Card, face down, asking another player to vote a certain way; he keeps it (and is <b>bound</b> to vote that way) or returns it.",
        "The Note’s “favour” must be fulfilled by the offering player whenever the holder plays it; then it returns to its owner to be offered again. Notes stay secret, though players may talk about them.",
        "The first player to lock someone into a vote takes precedence (ties in initiative order)."
      ]),
      src: "SoT p.12–14, p.20 · FAQ p.12, p.14–15" },
    { title: "Fall of the Empire — scenario rules", when: (c) => c.fote,
      html: (c) => ul([
        "Historical scenario during the Lazax Empire: preset map and races (see Setup); the <b>Lazax</b> — the acting rulers, starting with Mecatol Rex — can only be played here.",
        "Strategy Cards: the base game’s set, with <b>Civilization</b> instead of Political and <b>Industry</b> instead of Imperial.",
        "<b>Agenda Cards</b> replace the Political deck and count as Political Cards; an Agenda electing a planet can’t target a Home System. Icons: Elect Player, Elect Planet, Event (resolve, discard, draw a new Agenda).",
        "Use all of Shards of the Throne’s new Action and Technology Cards and the <b>Mechanized Units</b> rules. No other optional rule and no Shattered Empire component may be used." +
          (c.p === 7 ? " <i>Seven players (this page’s reading): only the seventh colour — its plastic and Technology deck — comes from Shattered Empire, which SoT p.14 requires for a seventh player.</i>" : "")
      ]),
      src: "SoT p.14–15" },
    {
      title: "Race rulings from the rulebooks and FAQ",
      when: () => true,
      html: (c) => {
        const inGame = (list) => c.fote ? list.some((r) => T3.foteRaces[c.p].join("|").indexOf(r) !== -1) : true;
        const rows = [
          inGame(["Hacan"]) ? ["Emirates of Hacan", "Trade agreements with the Hacan can’t be broken in the Status Phase — but other effects (Action and Political Cards, Trade option b) can break them" + (c.uses("trade2") ? "; Trade II can’t cancel them" : "") + (c.uses("trade3") ? "; Trade III’s secondary can’t touch them" : "") + ". Collects 1 extra Trade Good per trade agreement. Never more than 7 Action Cards, even while trading them."] : null,
          inGame(["Jol Nar"]) ? ["Universities of Jol Nar", "Errata: “You receive −1 on your combat rolls…”. Re-rolls one die per Command Counter spent. When following the Technology card he may also execute the primary (a free advance, plus the option to buy one); he still pays the Command Counter unless he holds Initiative, one advance may be the prerequisite of the other, and nobody else gets a second round of secondaries." + (c.uses("technology2") ? " With Technology II: a free advance, a second for 6 and a third for 8." : "")] : null,
          inGame(["Letnev"]) ? ["Barony of Letnev", "Trade Goods spent before combat give their bonus for one combat round; spending more doesn’t raise it, but he may pay again each round." + (c.mod("rst") && c.has("sot") ? " Noneuclidean Shielding: a Dreadnought dealt just 1 hit is still damaged, and Direct Hit still destroys it." : "")] : null,
          c.fote ? null : ["Mentak Coalition", "Cruisers and Destroyers that fire before combat with the Mentak ability also fire in the regular battle; an Admiral doesn’t boost those shots." + (c.mod("rst") && c.has("se") ? " Salvage Operations can’t rebuild a War Sun without the War Sun technology." : "")],
          c.fote ? null : ["Naalu Collective", "If the initiative “0” ability is copied, the Speaker settles the tied order of play. Its retreat ability isn’t stopped by an Admiral or the Code of Honor law" + (c.mod("tretreat") ? ", and works with Tactical Retreats" : "") + "." + (c.mod("rst") && c.uses("diplomacy2") ? " Telepathic Mind Weapon doesn’t trigger on Diplomacy II option a." : "")],
          inGame(["Sardakk"]) ? ["Sardakk N’orr", "Errata: “You receive +1 on your combat rolls” — every roll compared to a combat value, PDS fire and pre-combat included."] : null,
          inGame(["Xxcha"]) ? ["Xxcha Kingdom", "Errata: “When executing the Secondary Ability of the Diplomacy Strategy, you may execute the Primary Ability instead” — still paying the Command Counter, and no second round of secondaries." + (c.uses("diplomacy2") ? " With Diplomacy II it costs a Strategy Allocation Command Counter (option b then only saves the influence)." : "") + (c.uses("assembly") ? " With Assembly, his ability can cancel a Political Card after it is read: the chosen player then draws and resolves the top card." : "") + (c.mod("rst") && c.has("sot") ? " Instinct Training can cancel a Sabotage card." : "")] : null,
          c.fote ? null : ["Yssaril Tribes", "Skipping an action with the race ability isn’t passing — he may act later. Immune only to hand-size limits (not to discards)."],
          (c.has("se") && !c.fote) ? ["Brotherhood of Yin", "The “reversal” ability is once per game round; “convert” works only on other players’ Ground Forces (not Hostile Locals); a reversed planet taken by another player returns to normal."] : null,
          (c.has("se") && !c.fote) ? ["Clan of Saar", "Space Docks move (movement 1) and aren’t ships: built only in a system with a planet held all round (one planet per dock; Trade Stations don’t count); no Fleet Supply, no Space Battles, immune to Space Mines, no High Alert, never retreat; never blockaded — destroyed if enemy ships are present. Ground Forces and PDS built there go on any planet you control in the system or onto a Carrier. They may enter a Nebula or Ion Storm but not move through (Maneuvering Jets and Antimass Deflector apply) and may use wormholes. Immune to Cultural Crisis and Multiculturalism. With no planet or Carrier in the system to take them, Ground Forces and PDS can’t be built there. Subsidized Industry gives the Saar a new Space Dock in the system; the Saar can’t be the victim of Merciless (their docks are never on planets), but can score Usurper with a Space Dock in Mecatol Rex’s system and 6 Ground Forces on the planet."] : null,
          (c.has("se") && c.has("sot") && c.mod("rst") && !c.fote) ? ["Embers of Muaat", "Nova Seed: Muaat ships in the system are unaffected and may leave later, but can’t return."] : null,
          (c.has("se") && !c.fote) ? ["Winnu", "The home world’s yellow specialty works like the others but doesn’t count for objectives." + (c.mod("rst") ? " Its Shattered Empire racial technology may be used once per game round." : "") + (c.mod("rst") && c.has("sot") ? " Lazax Gate Folding onto an uncontrolled Mecatol Rex takes control" + (c.mod("custodians") ? " and discards the Custodians" : "") + "." : "")] : null,
          (c.has("sot") && !c.fote) ? ["Arborec", "The home world’s green specialty counts for objectives. Errata: “Your Ground Forces have a production capacity of 1. You may not produce units with Ground Forces that have moved during the same activation.” Capacity can’t be pooled; they can build ships; aboard ships they may produce (units go on ships with capacity or your planets there); with Production only in a system with a friendly Space Dock."] : null,
          (c.has("sot") && !c.fote) ? ["Ghosts of Creuss", "Two Home Systems joined by a “D” wormhole; starting units go in the Creuss planet’s system. Alpha/Beta systems are adjacent for movement only. The “D” wormholes needn’t be controlled for Keeper of Gates." + (c.mod("rst") ? " Slave Wormhole Generator: a “friendly” system has any of your units or Control Markers. Dimensional Splicer deals only one hit however many wormholes." : "")] : null,
          (c.has("sot") && !c.fote) ? ["Nekro Virus", (c.mod("mechs") ? "" : "Without Mechanized Units it starts with 2 extra Ground Forces. ") + "Taking 3 Command Counters instead of an advance, only generic technology discounts apply (Neural Computing −2). It may gain technologies from Domain Counters; Lazax Survivors is removed without effect; it can’t vote for Voice of the Council; it copies technology at the end of a battle." + (c.mod("rst") ? " Valefar Assimilator may copy any racial technology, but not one that modifies another race’s ability; copying Creuss’ Slave Wormhole Generator uses Creuss’ tokens (each moved once per round)." : "")] : null,
          c.fote ? ["Lazax", "Begin controlling Mecatol Rex; sit to the left of Sol; can give but never accept Treaty Cards; with Civilization they pick the agenda’s result without a vote."] : null
        ];
        return "<p>Race abilities themselves are printed on the Race Sheets; these are the rulebooks’ and FAQ’s errata and rulings about them.</p>" + dl(rows);
      },
      src: (c) => cite(["Base p.25", c.has("se") && !c.fote ? "SE p.6, p.13–16" : "SE p.13", c.has("sot") ? (c.fote ? "SoT p.14–15, p.21–22" : "SoT p.8–9, p.20–22") : "", "FAQ p.1–2, p.4–6" + (c.fote ? "" : (c.has("se") && c.has("sot") ? ", p.9–15" : (c.has("se") ? ", p.9–11" : (c.has("sot") ? ", p.11–15" : ""))))]) },
    {
      title: "Base game card rulings from the FAQ",
      when: () => true,
      html: (c) => "<p>What the FAQ rules about individual base-game cards — read them when the card comes up.</p>" + h("Action Cards") + dl([
        ["Rare Mineral", "Landing on a neutral planet counts as an invasion; an invasion in which all your Ground Forces die isn’t “successful”."],
        ["Focused Research", "Ignores one prerequisite on the tech tree, not on the card — so it can’t buy Advanced Fighters as your first technology. Afterwards you need only the prerequisites printed on each card."],
        ["Experimental Battlestation", "The Space Dock is treated in every respect as one of your PDS, technology upgrades and modifiers included."],
        ["Rally of the People", "Can’t be played while your Home System is blockaded."],
        c.fote ? null : ["Thugs", "Played on a player who used the Council Elder Political Card: no votes are cast, so the Speaker decides the outcome."],
        ["Corporate Sponsorship", "A discount on a green technology you then buy normally — not an extra technology."],
        ["Minelayers", "Its hits count from the moment it is played (right after the enemy fleet moves) and are taken in the first remove-casualties step of the Space Battle — none if no battle follows."],
        c.p <= 4 ? ["Political Stability", "With two Strategy Cards it keeps only the one that is neither Imperial nor Initiative; holding both, you can’t play it."] : null,
        ["Scientist Assassination", "The Technology card’s holder must still take his Strategic Action."],
        c.p <= 4 ? ["Tech Bubble", "Holding Initiative and Technology, you still pay the Command Counter for the Technology secondary — the cost comes from the card."] : null,
        ["Skilled Retreat", "Not a normal retreat, so retreat restrictions (such as the Admiral’s) don’t apply."],
        ["Lucky Shot", "The card’s player chooses which ship is destroyed."],
        ["Voluntary Annexation", "The planet arrives exhausted" + (c.mod("ds") ? "; its Domain Counter is removed without effect" : "") + "."],
        (c.p !== 4 && c.p !== 8) ? ["Strategic Flexibility", "Bonus Counters on the card you give up stay on it for a later player."] : null,
        ["In the Silence of Space", "Passes a fleet through only one system with enemy ships (even with Type IV Drive or Flank Speed), and it may not end its move where enemy ships are — Fighters included."],
        ["Shields Holding", "Not a pre-combat effect: it is played during one round of a Space Battle."],
        ["Local Unrest", "The planet becomes neutral, so its Space Dock and PDS are destroyed."],
        ["Target Their Capital Ship", "A card saying a ship doesn’t return fire doesn’t stop it attacking normally in the battle — a War Sun that survives still fires."],
        ["Multiculturalism", "Can’t be played on a player already targeted by Cultural Crisis."]
      ]) + (c.fote ? "" : h("Political Cards") + dl([
        ["Code of Honor", "Doesn’t stop the Naalu retreat ability."],
        ["Free Trade", "One extra Trade Good in total when you collect trade income — nothing if you collect none."],
        ["Fleet Regulations", "Fleet Supply counters above its new limit of 5 go straight back to reinforcements."],
        ["Checks and Balances", "Voted against: cards already resolved stay inactive with their new owner, who may then pass without a Strategic Action" + (c.p <= 4 ? "; both of each player’s cards pass left" : "") + ". The order of play shifts, but the Speaker token stays where it is."]
      ])) + h("Technology Cards") + dl([
        ["Sarween Tools", "+1 resource at every one of your Space Docks — enough to build with on its own — but each dock’s extra resource is spent only there: a ship’s production can’t be split between docks."],
        ["Gen Synthesis", "A destroyed Ground Force saved on 5+ returns to a planet in your Home System — if that planet is the one under attack, it keeps fighting. No return if you control no Home System planet. Against X-89 all the Ground Forces die, then roll for each. Returned Ground Forces aren’t “killed” for Dacxive Animators."],
        ["Light/Wave Deflector", "Works against Fighters with Advanced Fighters (they only block like ships). With XRD Transporters it still can’t pick up units in a system with enemy ships."],
        ["X-89 Bacterial Weapon", "Not a bombardment: a Dreadnought may use it on a planet with PDS. Usable even with no Action Cards in hand."],
        ["Graviton Negator", "Fighters can’t invade without Ground Forces — at least one Ground Force must land to start Invasion Combat."],
        ["Dacxive Animators", "Also counts Ground Forces killed by PDS fire, bombardment or X-89."],
        ["Transit Diodes", "Moves Ground Forces to and from any planets you control, in activated systems or not."]
      ]) + (c.fote ? "" : h("Objective Cards") + dl([
        c.mod("varobj") ? null : ["Public Objective: control Mecatol Rex and each system adjacent to it", "Only the adjacent systems that can be controlled count — not an adjacent Asteroid Field or Supernova."],
        ["3-point objective: more influence than both your neighbours combined", "An eliminated neighbour is still your neighbour, with 0 influence."]
      ])),
      src: (c) => cite(["FAQ p.2–3" + (c.mod("ds") ? ", p.4" : "") + (c.fote ? "" : ", p.5") + ", p.6–7" + (c.fote ? "" : ", p.8")]) },
    {
      title: "Expansion card rulings from the FAQ",
      when: (c) => (c.has("se") && !c.fote) || c.has("sot"),
      html: (c) => "<p>What the FAQ rules about individual expansion cards — read them when the card comes up.</p>" + dl([
        (c.has("se") && !c.fote) ? ["Courageous to the End · Target Their Flagship", "Their rolls are combat rolls, so effects that modify combat rolls (Experimental Weaponry included) apply."] : null,
        c.has("sot") ? ["Moment of Triumph", "Play it immediately after destroying the Flagship or War Sun — not later in the game."] : null,
        (c.has("sot") && !c.fote) ? ["Corrupt Empire", "“Attacking” the elected player means starting a Space Battle or Invasion Combat against him."] : null,
        (c.has("sot") && !c.fote) ? ["Necessary Bureaucracy", "Voted “for”: immediately draw the top Political Card and vote on it."] : null,
        (c.has("sot") && !c.fote) ? ["Sanctuary Shield", "Doesn’t let ships move through enemy ships in a Special System."] : null,
        c.has("sot") ? ["Gravity Drive", "A ship in a wormhole system gets the +1 only if another wormhole connects to it; a ship in a Gravity Rift only if that system is adjacent to another Gravity Rift or a wormhole."] : null,
        c.has("sot") ? ["Transfabrication", "May scuttle any of your units, following the normal scuttle rules."] : null,
        c.mod("intrigue") ? ["Paralyzing Serum", "Played after a Spy assassinates a Representative, it lets that Spy assassinate a second one."] : null,
        c.mod("intrigue") ? ["Support of the Throne", "One player may benefit from several, from different players."] : null,
        c.mod("intrigue") ? ["Territorial Concession", "May be played when attacking the Home System. The retreating player picks an adjacent friendly or empty system, activating it if it isn’t already; if no retreat is possible, the Note can’t be played then."] : null,
        c.mod("intrigue") ? ["Representatives", "Dirzuga Mantasa (Arborec): “no bonus votes” covers the corner number and votes from abilities · Captain Lassir (Letnev): after using him you choose no Representatives for the rest of the game · An’grag (N’orr): the Command Counter comes from reinforcements · Ta Zern (Jol Nar): counts only Technology Cards gained during the game, not starting ones."] : null,
        c.mod("mercs") ? ["Mercenaries", "Daffren’s trade for another player’s Strategy Card needs no agreement · Rhelat’s PDS ability is in addition to his use as a Ground Force: PDS technologies apply, he may act as a PDS even with 2 PDS already on the planet, and Equipment Sabotage doesn’t affect him · 52N6 can’t stop Race-Specific Technologies or Stasis Capsules, and acts in the same pre-combat step as Action Cards · moving into another system works the same from space or from a planet."] : null
      ]),
      src: (c) => cite([(c.has("se") && !c.fote) ? "FAQ p.11" : "", c.has("sot") ? "FAQ p.12" + (c.mod("mercs") ? ", p.13" : "") + (!c.fote ? ", p.14" : "") + ", p.15" : ""]) },
    {
      title: "Official errata applied on this page",
      when: () => true,
      html: (c) => h("Cards") + dl([
          ["Direct Hit", "Add: “Play: Immediately after the ship has been damaged in a Space Battle in which you participate.” (Pre-combat damage counts; PDS" + (c.mod("mines") ? " and Space Mine" : "") + " damage doesn’t.)"],
          ["Ancient Artifact", "“Planetary unit” means <b>planetary force</b> — the planet’s Ground Forces" + (c.has("se") && !c.fote ? " and Shock Troops" : "") + " together take one combined roll of three dice (PDS and Space Docks unaffected" + (c.mod("mechs") ? "; Mechanized Units are immune to effects on Ground Forces — SoT p.21’s errata counts them in the planetary force, but the newer FAQ is used" : "") + "). On 6–10 the two technologies are taken one after the other (the first can be a prerequisite of the second). With Leaders, they die on 1–5 and count as planetary force."],
          ["Open the Trade Routes", "“Against”: “This round, each player must give all of the Trade Goods he receives to the player on his left.”"],
          ["Advanced Fighters", "Add: “Any Fighters in excess of a system’s Fighter capacity will count towards your Fleet Supply limit.”"],
          ["Micro Technology", "“When you receive Trade Goods from your trade agreements, you now receive 1 additional Trade Good for each of your active trade agreements.”"],
          ["Integrated Economy", "Read as: “You may only place PDS and Ground Force units on any friendly planet within this range.”"],
          c.has("se") && !c.fote ? ["Sharing of Technology", "Not a Law — discard it after resolving."] : null,
          c.has("se") && !c.fote ? ["“Once per turn”", "Production Centers, Diplomats, Spatial Conduit Network, the Yin reversal and the Winnu racial technology: once per <b>game round</b>. Objectives about “this turn” mean this game round."] : null,
          c.has("sot") ? ["A Beacon of Hope", "“Play: Immediately before any Space Battle involving your Flagship begins.”"] : null,
          c.has("sot") ? ["Quantum Datahub Node · Inheritance Systems · Instinct Training", "Read “Strategy Phase” for “Status Phase” · “Technology Strategy Card” for “Trade Strategy Card” · “game round” for “game turn”."] : null,
          c.has("sot") ? ["Transfabrication", "Read “Produce Units” for “Build Units”; units scuttled by it can’t be rebuilt the same round."] : null,
          c.has("sot") ? ["Berserker Genome (replacement)", "Renamed <b>Valkyrie Armor</b>."] : null
        ]) + h("Race sheets") + ul([
          "PDS cost is <b>2</b> (the original sheets misprint it).",
          "Xxcha, Sardakk N’orr and Jol Nar ability wording — see Race rulings." + (c.has("sot") && !c.fote ? " Arborec ability wording — see Race rulings." : "")
        ]) + h("Rulebooks") + ul([
          "4 players" + (c.has("se") && !c.fote ? " (and 8)" : "") + ": remove Strategic Flexibility and Strategic Shift.",
          "Age of Empire: no Stage II objectives in the first three rounds.",
          "Retreats go to a previously activated system with no enemy ships (enemy planets allowed).",
          "Scuttling waits until Status Phase step 1 is complete.",
          "3–4 players: order of play uses your lower initiative number.",
          "Elimination: Action Cards discarded, trade agreements removed; Strategy Card counts unchanged.",
          "Distant Suns: razing happens at the start of Planetary Landings.",
          "“Space Combat” means Space Battles; bonuses apply only to the combat-dice step." + (c.has("sot") ? " <i>(SoT p.22 reprints this as “Space Battles or Invasion Combat”; the newer FAQ p.2 wording is used.)</i>" : ""),
          c.has("se") && !c.fote ? "<b>Shattered Empire:</b> the 7–8 player setup ignores any “first remove 2 random systems” instruction · Artifacts can’t go in or next to Home Systems · Tactical Retreats go to an adjacent, unactivated system without enemy units · Shock Troops aboard ships are “with” any Ground Force in their fleet · Space Mines trigger whenever an enemy ship enters or is built in their system · Simulated Early Turns allow refresh abilities in the abbreviated Status Phase, and Political Card discards instead of spending Trade Goods." : "",
          c.has("sot") ? "<b>Shards of the Throne:</b> " + (c.fote ? "" : "its galaxy piles remove 2 systems for 7 players and 3 for 8 (not the 4 and 5 printed on SoT p.9) · Assembly II draws two Political Cards · ") + "a stalemate forces the attacker into a tactical retreat (or destroys his ships)." : ""
        ]),
      src: (c) => cite(["SE p.13", c.has("sot") ? "SoT p.21–22" : "", "FAQ p.1–3, p.7" + (c.has("se") && !c.fote ? ", p.8–9" : "") + (c.has("sot") ? ", p.11–12" : "") + (c.mod("mechs") ? ", p.13" : "")]) }
  ];
  T3.reference = T3.reference.concat(more);
})();

/* =============================================================================
   TEACHING SCRIPT — ~5 minutes read aloud for the base game, in teaching order; short inserts only for what is
   selected. Every line is drawn from the rules cited in the setup and reference (Base p.4–38 · SE p.4–17 ·
   SoT p.8–21 · Variants p.2 · FAQ).
   ============================================================================= */
(function () {
  "use strict";
  const list = (a) => a.length < 2 ? a.join("") : a.slice(0, -1).join(", ") + " and " + a[a.length - 1];
  const numWord = (n) => ({ 9: "nine", 10: "ten", 13: "thirteen", 14: "fourteen", 15: "fifteen" })[n] || String(n);

  // one short spoken line per Strategy Card
  const cardLine = {
    initiative: "<b>Initiative</b>: act first, become Speaker, and follow everyone’s cards for free — but no primary ability, and never two rounds running.",
    diplomacy: "<b>Diplomacy</b>: name an opponent — neither of you may activate systems holding the other’s units this round. Followers refresh two planets.",
    political: "<b>Political</b>: three Action Cards, a Command Counter, and an agenda for the Galactic Council. Followers draw an Action Card.",
    logistics: "<b>Logistics</b>: four Command Counters. Followers buy them at three influence each.",
    trade: "<b>Trade</b>: three Trade Goods, collect on your trade deals and approve new ones — or cancel every deal. Followers collect on theirs.",
    warfare: "<b>Warfare</b>: take one of your Command Counters back off the board for a second go. Followers nudge two Destroyers or Cruisers.",
    technology: "<b>Technology</b>: a free advance. Followers buy one for eight resources.",
    imperial: "<b>Imperial</b>: reveal an objective and take two points on the spot. Followers build without activating.",
    imperialAoE: "<b>Imperial</b>: take two points on the spot — with Age of Empire every objective is already out, so there’s nothing to reveal. Followers build without activating.",
    imperialStar: "<b>Imperial</b>: take one point on the spot — The Star in the Crown; with Age of Empire every objective is already out. Followers build without activating.",
    imperialThrone: "<b>Imperial</b>, rewritten by The Ancient Throne: a point if you hold Mecatol Rex and, either way, the right to score any number of objectives this Status Phase — or its build secondary, free and yours alone. Followers build without activating.",
    leadership: "<b>Leadership</b>: act first and take three Command Counters; then anyone — you too — may buy up to three more at two influence each.",
    diplomacy2: "<b>Diplomacy Two</b>: make everyone drop a Command Counter into one of your systems, or annex for free. Followers pay a counter and three influence to annex an empty planet next to a system they control.",
    assembly: "<b>Assembly</b>: a Political and two Action Cards, then either take the Speaker token and name who plays an agenda, or give the token away and play an agenda from your own hand. Followers refresh planets worth up to six.",
    production: "<b>Production</b>: build at a Space Dock without activating, with two extra resources. Followers build up to three units.",
    trade2: "<b>Trade Two</b>: three Trade Goods or cancel up to two deals; everyone collects, the others one short. No secondary.",
    warfare2: "<b>Warfare Two</b>: the High Alert token gives your ships there plus one movement and plus one in battle. Followers shift two ships into adjacent systems they control.",
    technology2: "<b>Technology Two</b>: a free advance and another for eight. Followers pay six.",
    bureaucracy: "<b>Bureaucracy</b>: a Command Counter, pick which of two objectives appears, then claim one on the spot. Followers draw a Political and an Action Card.",
    bureaucracyAoE: "<b>Bureaucracy</b>: a Command Counter, then claim one objective on the spot — with Age of Empire every objective is already out, so nothing new appears. Followers draw a Political and an Action Card.",
    imperial2: "<b>Imperial Two</b>: no automatic points — score any number of objectives this Status Phase and take a point if you hold Mecatol Rex, or keep its build secondary to yourself. Otherwise followers build without activating.",
    trade3: "<b>Trade Three</b>: everyone collects, even on brand-new deals; mercenaries are paid; you may hire one. Followers can break someone else’s deal for a Trade Good.",
    political2: "<b>Political Two</b>: pick one of two face-up agendas and run the council with Representatives and Promissory Notes. Followers pay two influence for two Action Cards.",
    assembly2: "<b>Assembly Two</b>: choose who proposes an agenda from hand, pass the Speaker token, and run the council with Representatives. Followers draw a card and refresh a planet.",
    civilization: "<b>Civilization</b>: draw two agendas, keep one — the Lazax simply decide it; anyone else puts it to a vote. Followers pay two influence for two Action Cards.",
    industry: "<b>Industry</b>: a free Space Dock, or four resources’ worth of free units. Followers get two resources’ worth."
  };

  T3.teach = {
    intro: "A ~5-minute teach for the exact sets, player count, Strategy Cards and options selected above (each selected option adds a short insert). Read it aloud, or hit Copy and tweak. Everything in it comes from the rulebooks and FAQ cited in the setup and reference.",
    sections: [
      { when: (c) => !c.fote,
        h: "The hook — and how you win",
        body: (c) => {
          const vp = T3.vp(c);
          return "<p>We are the great races of a shattered galaxy, and the Imperial Throne on <b>Mecatol Rex</b> — the planet in the middle — stands empty. The first to <b>" + numWord(vp) + " victory points</b> claims it" +
            (c.mod("longwar")
              ? " — this is the <b>Long War</b>" + (c.uses("bureaucracy") ? " (fourteen, less one because Bureaucracy is in play)" : "") + ", with a " + numWord(c.varSC ? 15 : 14) + "-card objective deck"
              : (c.uses("bureaucracy") ? " — one fewer than usual, because Bureaucracy is in play" : "")) + ".</p>" +
            "<p>Points come mostly from <b>Objective cards</b>: Public Objectives anyone can score, " + (c.mod("aoe") ? "all face up from the start" : "revealed a few at a time") + ", and one hidden <b>" + (c.mod("prelim") ? "Preliminary Objective" : "Secret Objective") + "</b> each. We score in the Status Phase, in turn order, so the first to reach the target wins." +
            (c.uses("imperial") ? (c.mod("throne") ? " The <b>Imperial</b> card follows The Ancient Throne — more on that below." : " The <b>Imperial</b> card gives " + (c.mod("star") ? "one point — The Star in the Crown halves it —" : "two points") + " each time it’s played.") : "") + "</p>" +
            "<p>" + (c.mod("aoe") ? "A marker walks along the objective row each round; when it reaches <b>Game Over</b>, most points wins." : "The <b>Game Over</b> card lurks deep in the objective deck: when it appears, most points wins.") +
            " And no one scores objectives while he’s lost a planet in his own Home System" + (c.mod("homeworlds") ? " — with <b>Homeworlds</b>, no victory points from anything at all" : "") + ".</p>";
        } },
      { when: (c) => c.fote,
        h: "The hook — Fall of the Empire",
        body: (c) => "<p>Tonight we play the fall of the Lazax Empire. The <b>Lazax</b> still rule from Mecatol Rex; " + list(T3.foteRaces[c.p].slice(1).map((r) => /^The /.test(r) ? r.replace(/^The /, "the ") : "the " + r)) + " circle the throne. There are <b>no victory points</b>: each of us has a hidden <b>Scenario Objective</b> — the Lazax one lies face up — and the game lasts at most <b>eight rounds</b>. Some objectives win on the spot; otherwise, after round eight, everyone meeting his objective wins.</p>" +
          "<p>You can win together. On your turn, activate another player’s Home System to slip him one of your <b>Treaty Cards</b>; he shuffles it into his treaty hand and secretly discards any one card. When someone wins, whoever holds that winner’s <b>lowest-numbered</b> treaty wins too — but anyone holding treaties from two different players loses. The Lazax give treaties but never accept them.</p>" },
      {
        h: "The shape of a round",
        body: (c) => "<p>Three phases. <b>Strategy</b>: starting with the Speaker, each of us takes " + (c.p <= 4 ? "<b>two</b> Strategy Cards — the lower number sets your turn order; each card’s primary ability is yours, its secondary is for everyone else" : "a Strategy Card — its number sets turn order; its primary ability is yours, its secondary is for everyone else") + (T3.bonusCount(c.p) ? "; cards nobody takes gather bonus counters" : "") + ". <b>Action</b>: one action each, round and round, until everyone passes. <b>Status</b>: " + (c.fote ? "" : "score objectives, ") + "repair, pick our Command Counters up off the board, refresh planets, draw an Action Card and two Command Counters, and return the Strategy Cards" + (c.fote ? " — then the round marker moves on" : "") + ".</p>" },
      {
        h: "Command Counters — the heart of the game",
        body: (c) => "<p>Your sixteen <b>Command Counters</b> are your government. <b>Command Pool</b> counters activate systems — that’s how you move, fight and build. <b>Strategy Allocation</b> counters let you follow other players’ Strategy Cards. <b>Fleet Supply</b> caps the ships, Fighters not counted, you may have in any one system. We start with three, two and three.</p>" +
          "<p>Counters stay on the board until the Status Phase, and ships in a system you’ve activated can’t move again this round — so every activation is a commitment. More counters come each Status Phase, and from " + list([c.uses("logistics") ? "Logistics" : "", c.uses("leadership") ? "Leadership" : "", c.uses("political") ? "Political" : "", c.uses("bureaucracy") ? "Bureaucracy" : "", T3.bonusCount(c.p) ? "bonus counters" : ""].filter(Boolean)) + ".</p>" },
      {
        h: "Your actions — and why you’d take them",
        body: (c) => "<ul>" +
          "<li><b>Strategic</b>: resolve your Strategy Card" + (c.p <= 4 ? "s" : "") + " — you must before you may pass" + (c.uses("initiative") ? " (Initiative has none)" : "") + ".</li>" +
          "<li><b>Tactical</b>, the workhorse: activate a system, move ships in — never through enemy ships — PDS fire, battle, land Ground Forces" + (c.mod("mechs") ? " and Mechanized Units" : "") + " and invade, then build at your Space Docks there.</li>" +
          "<li><b>Transfer</b>: shuffle units between two adjacent systems that are entirely yours, and build in one.</li>" +
          "<li><b>Pass</b>: done for the round — but you may still follow other players’ secondaries.</li></ul>" },
      {
        h: "The Strategy Cards on the table",
        body: (c) => "<ul>" + c.deck.map((id) => "<li>" + cardLine[(id === "imperial" && c.mod("star")) ? "imperialStar" : ((id === "imperial" && c.mod("throne")) ? "imperialThrone" : ((id === "imperial" && c.mod("aoe")) ? "imperialAoE" : ((id === "bureaucracy" && c.mod("aoe")) ? "bureaucracyAoE" : id)))] + "</li>").join("") + "</ul>" +
          (c.varSC ? "<p>These are Shattered Empire’s <b>variant Strategy Cards</b>" + (c.swapped ? ", with some originals swapped back in" : "") + ": each of us keeps a hand of Political Cards — we started with two — played through Assembly, and the objective deck got one extra Stage II card" + (c.mod("aoe") ? "" : " and its top card starts face up") + ".</p>" : "") +
          (!c.varSC && c.swapped && [2, 5, 6, 7].some((n) => c.raw[n - 1] !== T3.slotDefs[n - 1].orig) ? "<p>We’ve <b>swapped</b> some cards for their same-name Shattered Empire versions; a “Two” counts as the original for every other card.</p>" : "") +
          (c.uses("imperial2") ? "<p><b>Imperial Two</b> replaces the Imperial card, so we also play Age of Empire.</p>" : "") },
      {
        h: "Planets, trade and technology",
        body: (c) => "<p>Planets are the economy. Exhaust a Planet Card for its <b>resources</b> — to build and research — <b>or</b> its <b>influence</b> — for Command Counters and votes; never both, and they refresh each Status Phase. Land Ground Forces to take a planet. <b>Trade Goods</b> count as one resource or influence each; you earn them from <b>trade agreements</b> made when the Trade card is played. Technologies need their prerequisites, and planets with a matching specialty make them cheaper" +
          (c.mod("rst") ? "; with <b>Race-Specific Technologies</b> you may buy your race’s unique advance instead, at the normal price plus its own" : "") + ".</p>" },
      {
        h: "Fighting",
        body: (c) => "<p>Each ship rolls a die — a War Sun three — and hits on its combat value or better; a zero is a ten. The attacker removes casualties first; Dreadnoughts and War Suns soak a hit by being damaged. Destroyers shoot at Fighters before the first round, and PDS shoot at fleets in range. The attacker may withdraw or the defender retreat, but only into an adjacent system he has already activated this round, with no enemy ships in it" +
          (c.mod("tretreat") ? " — or, with <b>Tactical Retreats</b>, the defender pays a Strategy Allocation counter to activate a fresh neighbouring system" : "") + ".</p>" +
          "<p>Invading a planet: Dreadnoughts and War Suns bombard, the defender’s PDS fire once, then Ground Forces roll until one side is gone. A battle between trading partners cancels their deal.</p>" },
      {
        h: "The Galactic Council",
        body: (c) => "<p>" + (c.fote ? "<b>Agenda Cards</b> replace the Political deck. " : "") + "Agendas are voted on with the influence of your <b>unexhausted</b> planets, so spend influence with care; passed <b>Laws</b> change the rules for good. Bribes are fine, promises aren’t binding" + (c.mod("intrigue") ? " — except Promissory Notes" : "") + ", and the Speaker breaks ties.</p>" },
      /* ---- inserts, only for what is selected ---- */
      { when: (c) => c.has("se") && !c.fote,
        h: "Shattered Empire",
        body: () => "<p>Shattered Empire adds the Brotherhood of Yin, the Clan of Saar, the Embers of Muaat and the Winnu, plus <b>Ion Storms</b> (no passing through, no Fighter dice), <b>Trade Stations</b> (held by whoever alone has ships there) and planets whose <b>refresh abilities</b> pay out in the Status Phase.</p>" },
      { when: (c) => c.has("sot"),
        h: "Shards of the Throne",
        body: (c) => "<p>Shards of the Throne " + (c.fote ? "supplies this scenario, the Lazax, and new Action and Technology Cards" : "adds the Arborec, the Ghosts of Creuss and the Nekro Virus, new cards and technologies, and the <b>Gravity Rift</b>: every ship leaving or passing through it rolls — one to five and it’s lost") + ".</p>" },
      { when: (c) => c.fote,
        h: "The scenario’s own rules",
        body: (c) => "<p><b>Civilization</b> replaces Political — the Lazax set an agenda’s result with no vote — and <b>Industry</b> replaces Imperial with free Space Docks and units. Everyone has <b>Mechanized Units</b>, heavy ground troops that survive one hit. No other optional rules" +
          (c.has("se") ? (c.p === 7 ? ", and <b>Shattered Empire</b> only lends the seventh player his colour" : ", and <b>Shattered Empire</b> stays in the box") : "") + ".</p>" },
      { when: (c) => !c.fote && (c.p <= 5 || c.p >= 7 || c.mod("larger")),
        h: (c) => (c.p === 6 ? "The galaxy" : c.p + " players"),
        body: (c) => "<p>" + [
          c.p <= 4 ? "Each of us has <b>two</b> Strategy Cards and must play both before passing; turn order comes from your lower number." + (c.p === 4 ? " All eight are taken, so no bonus counters." : "") : "",
          c.p === 5 ? "Seats are uneven with five, so <b>positions one and four</b> started with four Trade Goods and <b>position five</b> with six." : "",
          c.p === 7 ? "Seven players: <b>positions one and two</b> started with four Trade Goods and <b>position three</b> with six." : "",
          c.p === 8 ? "Eight players take <b>every Strategy Card</b> each round, so there are no bonus counters." : "",
          c.mod("larger") ? "This is the <b>larger galaxy</b>: a fourth ring of systems, with our Home Systems still in the third." : ""
        ].filter(Boolean).join(" ") + "</p>" },
      { when: (c) => c.mod("aoe"),
        h: "Age of Empire",
        body: () => "<p><b>Age of Empire</b>: every Public Objective is face up now, so plan the whole game — but no <b>Stage II</b> objective may be scored in the first three rounds.</p>" },
      { when: (c) => c.mod("throne"),
        h: "The Ancient Throne",
        body: () => "<p><b>The Ancient Throne</b> rewrites the Imperial card: a point for holding Mecatol Rex and the chance to score any number of objectives this Status Phase — or its build secondary kept to yourself.</p>" },
      { when: (c) => c.mod("star"),
        h: "The Star in the Crown",
        body: () => "<p><b>The Star in the Crown</b>: the Imperial card pays one point, not two.</p>" },
      { when: (c) => c.mod("varobj"),
        h: "Variant Objectives",
        body: () => "<p><b>Variant Objectives</b>: Shattered Empire’s objective decks, which lean toward military conflict.</p>" },
      { when: (c) => c.mod("prelim"),
        h: "Preliminary Objectives",
        body: () => "<p><b>Preliminary Objectives</b>: your starting objective is easier and worth one point; complete it to draw a real Secret Objective.</p>" },
      { when: (c) => c.mod("ds"),
        h: "Distant Suns",
        body: (c) => "<p><b>Distant Suns</b>: every neutral planet hides a Domain Counter, flipped when you land — Trade Goods, a free Space Dock, a technology, a wormhole, or radiation, a biohazard, hostile locals" +
          (c.mod("newds") ? ", and Shattered Empire’s <b>new counters</b>: ambushes, hidden factories, hostages" : "") + ". A Fighter can <b>probe</b> first; a Dreadnought or War Sun can <b>raze</b> one unseen, at a political price." +
          (c.mod("terrds") ? " <b>Territorial Distant Suns</b> keeps the gentler counters near our Home Systems and on the outer ring." : "") + "</p>" },
      { when: (c) => c.mod("leaders"),
        h: "Leaders",
        body: () => "<p><b>Leaders</b>: three per race — Scientists, Diplomats, Generals, Admirals, Agents — riding any ship and helping where they stand. They can be killed, captured, executed or rescued.</p>" },
      { when: (c) => c.mod("sabotage"),
        h: "Sabotage Runs",
        body: () => "<p><b>Sabotage Runs</b>: Fighters may dive at an enemy War Sun before battle — a nine or ten gets through, then a ten destroys it.</p>" },
      { when: (c) => c.mod("artifacts"),
        h: "Artifacts",
        body: () => "<p><b>Artifacts</b>: each face-down token we placed was drawn at random from four relics and four blanks — find a relic and hold its planet, and it’s worth a point until someone takes it.</p>" },
      { when: (c) => c.mod("shock"),
        h: "Shock Troops",
        body: () => "<p><b>Shock Troops</b>: a Ground Force rolling a natural ten becomes a veteran hitting on five that can capture enemy Space Docks and PDS.</p>" },
      { when: (c) => c.mod("mines"),
        h: "Space Mines",
        body: () => "<p><b>Space Mines</b>: a Cruiser can lay one for two resources; enemy ships entering roll — nine or ten, they’re hit.</p>" },
      { when: (c) => c.mod("nexus"),
        h: "The Wormhole Nexus",
        body: () => "<p>The <b>Wormhole Nexus</b> sits off the board, next door to every Alpha and Beta wormhole.</p>" },
      { when: (c) => c.mod("facilities"),
        h: "Facilities",
        body: () => "<p><b>Facilities</b>: one resource builds a Colony (+1 influence) or a Refinery (+1 resource) on a planet outside your Home System.</p>" },
      { when: (c) => c.mod("custodians"),
        h: "Custodians of Mecatol Rex",
        body: () => "<p>The <b>Custodians</b> defend Mecatol Rex with three Fighters and two Ground Forces.</p>" },
      { when: (c) => c.mod("voice"),
        h: "Voice of the Council",
        body: () => "<p><b>Voice of the Council</b>: before each Council a vote may move this one-point objective to a new holder.</p>" },
      { when: (c) => c.mod("early"),
        h: "Simulated Early Turns",
        body: (c) => "<p>We skipped the slow opening with <b>Simulated Early Turns</b>: nearby systems claimed, a starting budget spent" + (c.mod("aoe") ? "" : ", the first objective face up") + ".</p>" },
      { when: (c) => c.mod("flagships"),
        h: "Flagships",
        body: () => "<p><b>Flagships</b>: each race may build one unique Flagship, only at home — its card shows cost, stats and ability.</p>" },
      { when: (c) => c.mod("frontier"),
        h: "The Final Frontier",
        body: () => "<p><b>The Final Frontier</b>: systems without planets hide Space Domain Counters, revealed when you end a move there — from a free Cruiser to pirates or a supernova.</p>" },
      { when: (c) => c.mod("mechs") && !c.fote,
        h: "Mechanized Units",
        body: () => "<p><b>Mechanized Units</b>: four heavy ground units each, cost two, that hold planets like Ground Forces and survive their first hit.</p>" },
      { when: (c) => c.mod("mercs"),
        h: "Mercenaries",
        body: () => "<p><b>Mercenaries</b>: hired through Trade Three, each costs a Trade Good of upkeep whenever Trade Three is played, can’t hold planets alone, and dodges hits with <b>Evasion</b>.</p>" },
      { when: (c) => c.mod("intrigue"),
        h: "Political Intrigue",
        body: () => "<p><b>Political Intrigue</b>: before each vote everyone sends a <b>Representative</b> — Councilors bring votes, Spies can assassinate, Bodyguards can’t be assassinated; no Representative, no vote. A <b>Promissory Note</b> you accept binds your vote.</p>" },
      {
        h: "Don’t worry about these until they come up",
        body: (c) => {
          const it = [
            "<b>Action Card timing</b> — each card says when to play it.",
            "<b>Special systems</b> — " + list(["Asteroid Fields", "Nebulae", "Supernovas"].concat(c.has("se") && !c.fote ? ["Ion Storms"] : [], c.has("sot") && !c.fote ? ["Gravity Rifts"] : [])) + ".",
            "<b>Fighter capacity and Supplement Counters.</b>",
            "<b>Wormholes</b> — adjacent for movement only.",
            "<b>Scuttling</b> in the Status Phase."
          ];
          if (c.mod("ds")) it.push("<b>Each Domain Counter</b> — we’ll read it when it flips.");
          if (c.mod("leaders")) it.push("<b>Leader capture rolls.</b>");
          if (c.mod("mercs")) it.push("<b>Evasion hit order.</b>");
          if (c.mod("intrigue")) it.push("<b>Each Representative’s ability.</b>");
          if (c.fote) it.push("<b>Treaty Card hints</b> — only advice.");
          return "<ul>" + it.map((x) => "<li>" + x + "</li>").join("") + "</ul>";
        } }
    ]
  };
})();
