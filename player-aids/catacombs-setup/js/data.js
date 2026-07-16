/* =============================================================================
   Clank! Catacombs — Setup & Reference Utility · data
   All content sourced from the official rulebooks (see citations).
   The core rulebook citations refer to CLANK! Catacombs Rulebook & Token
   Reference Guide (2022).
   ============================================================================= */
var CC = {};

CC.expMeta = {
  base:  { name: "Catacombs",   cls: "tag-base" },
  uw:    { name: "Underworld",  cls: "tag-uw" },
  lairs: { name: "Lairs & L.C.", cls: "tag-lairs" },
  party: { name: "Adv. Party",  cls: "tag-party" },
  mod:   { name: "Variant",     cls: "tag-mod" }
};

CC.expansions = [
  { id: "base",  short: "Clank! Catacombs", year: "2022", blurb: "The standalone tile-crawling Clank!. Always in play." },
  { id: "lairs", short: "Lairs & Lost Chambers", year: "2023", blurb: "12 new tiles with lairs, lost chambers, pit traps and trophies, plus 50 cards." },
  { id: "uw",    short: "Underworld", year: "2025", blurb: "A second dungeon below the Depths: ladders, undercoins, fate cards, harpies and the Underworld Guardian." },
  { id: "party", short: "Adventuring Party", year: "2021", blurb: "5–6 players (via the “Party in the Catacombs!” rules) and six optional unique characters." }
];

CC.modules = [
  { id: "fixeddim", requires: "uw", name: "Fixed Dimensions (variant)", summary: "Limit the dungeon to an agreed 5×5 or 6×6 grid",
    description: "For limited table space — no tile may be placed outside the agreed grid.", src: "Underworld p.10" },
  { id: "mercy", requires: "uw", name: "Mercy (variant)", summary: "Rotate your tile if you become completely trapped",
    description: "Playable with or without the Underworld tiles; strongly recommended with Fixed Dimensions.", src: "Underworld p.10" },
  { id: "chars", requires: "party", name: "Characters", summary: "Six unique thieves with custom starting decks",
    description: "Each player may pick a character board and its 10-card custom deck instead of the standard deck — usable at any player count, but don't mix characters with regular starting decks.", src: "Adventuring Party p.2, p.5" }
];

/* =============================================================================
   SETUP PHASES — c = { has(exp), p, mod(id) }
   ============================================================================= */
CC.phases = [
  {
    title: "Board, Tiles & Bank",
    steps: [
      { when: () => true, exp: "base",
        t: "Clank! board & Dragon marker",
        d: (c) => "<ul><li>Place the <b>Clank! board</b> to one side of your playing space.</li>" +
          "<li>Place the <b>Dragon marker</b> on the Rage Track space showing the number of players (" + c.p + ").</li>" +
          (c.p >= 5 ? "<li><b>Adventuring Party:</b> place its <b>side board</b> near the Clank! board — it tracks the Dragon's rage and the health of the fifth and sixth players.</li>" : "") + "</ul>",
        src: (c) => c.p >= 5 ? "Core p.4 · Core p.15" : "Core p.4" },
      { when: (c) => !c.has("uw"), exp: (c) => c.has("lairs") ? "lairs" : "base",
        t: "Build the tile stack",
        d: (c) => "<ul>" +
          (c.has("lairs") ? "<li><b>Lairs & Lost Chambers:</b> first shuffle its 12 new square tiles into your existing tiles by their backs (10 Depths, 2 “safe”). All Depths tiles are used. <i>(First game: shuffle the new tiles into the top half of the stack to see plenty of them.)</i></li>" : "") +
          "<li>Separate the square tiles by their backs. Shuffle the <b>Depths tiles</b> into a face-down stack in a Bank area next to the Clank! board.</li>" +
          "<li>Shuffle the <b>“safe” tiles</b>; return <b>two at random</b> to the box unseen and place the remaining <b>four</b> on top of the Depths stack.</li></ul>",
        src: (c) => c.has("lairs") ? "Core p.4 · Lairs p.4" : "Core p.4" },
      { when: (c) => c.has("uw"), exp: "uw",
        t: "Build the tile stacks — Underworld",
        d: (c) => "<ul>" +
          (c.has("lairs") ? "<li><b>Lairs & Lost Chambers:</b> first shuffle its 12 new tiles into your existing tiles by their backs.</li>" : "") +
          "<li>Shuffle the six <b>Underworld Depths tiles</b> and return <b>three</b> to the box unseen.</li>" +
          "<li>Separately shuffle your existing Depths tiles; take the <b>top seven</b> unseen and shuffle the three kept Underworld Depths tiles into them. Place this 10-tile stack on top of the remaining Depths tiles.</li>" +
          "<li>Shuffle the “safe” tiles and place only <b>three</b> (not four) on top of the stack.</li>" +
          "<li>Shuffle the <b>seven regular Underworld tiles</b> into their own face-down stack next to the square tiles.</li></ul>",
        src: (c) => c.has("lairs") ? "Underworld p.4 · Lairs p.4" : "Underworld p.4" },
      { when: () => true, exp: (c) => c.has("uw") ? "uw" : "base",
        t: "Stock the Bank",
        d: (c) => "<ul><li>Add the <b>Gold</b> (1s, 5s, 10s) and <b>Lockpicks</b> (not limited — substitute if you run out), the five white <b>Ghost cubes</b>, and the <b>Dragon bag</b> with the 24 black dragon cubes inside.</li>" +
          "<li>Stack the <b>seven Artifacts</b> face up in order of value: 5-point on top, 20-point on the bottom." +
          (c.p >= 5 ? " <b>Adventuring Party:</b> add its 10/15/20/25-point Artifacts (not the 30) to the stack, still in increasing order, each on top of a Catacombs Artifact of the same value.</li>" : "</li>") +
          "<li>Separate <b>major secrets, minor secrets, and prisoners</b>; shuffle each kind face down." + (c.has("uw") ? " Shuffle the <b>Underworld</b> secrets and prisoners into their matching pools." : "") + (c.p >= 5 ? " Add the Adventuring Party minor secrets and extra Gold and Mastery tokens." : "") + "</li>" +
          (c.has("uw")
            ? "<li>Add the <b>undercoins</b> and the <b>harpy and ladder tokens</b>. Use the <b>Underworld Market Board</b> instead of the Catacombs one: the <b>River Lamp</b> joins the regular items on the top row; the five <b>Underworld market items</b> go on the bottom row.</li>"
            : "<li>Place the <b>Market Board</b> in the Bank and stack on it: two Backpacks, two Blood Amulets, three Burglar's Kits, and three Crowns in order of value (10-point Crown on top, 8-point on the bottom).</li>") +
          (c.p >= 5 ? "<li><b>Adventuring Party:</b> do <b>not</b> add the Master Key market item (there are no Master Keys in Catacombs); the other items, including the <b>Invisibility Cloaks</b>, may be used.</li>" : "") + "</ul>",
        src: (c) => {
          const s = ["Core p.4"];
          if (c.has("uw")) s.push("Underworld p.4");
          if (c.p >= 5) s.push("Core p.15");
          return s.join(" · ");
        } }
    ]
  },
  {
    title: "Starting Tile & Dungeon Deck",
    steps: [
      { when: () => true, exp: "base",
        t: "Place the starting tile",
        d: (c) => "<ul><li>Place the <b>starting tile</b> in the center of your playing space, either side face up, with room around it for new tiles.</li>" +
          "<li>Place the three <b>Monkey Idols</b> on the Monkey Shrine room" + (c.has("uw") ? " (unless using the back of the Underworld starting tile — see the next step)" : "") + ".</li>" +
          "<li>Stack one <b>Mastery token per player</b> near the Crypt (return extras to the box).</li></ul>",
        src: "Core p.4" },
      { when: (c) => c.has("uw"), exp: "uw",
        t: "Place the Underworld starting tile",
        d: "<ul><li>Place the <b>Underworld starting tile</b> with space separating it from the Catacombs starting tile. Either side is legal; the <b>front</b> side is recommended for your first game.</li>" +
          "<li>Place on its marked rooms: the <b>magic lyre</b> (16-point artifact); the three <b>Imp Assistants</b> (4-value on top); the three <b>artifact enhancers</b> (2× on top) with the <b>Underworld Guardian marker</b>; and one <b>harpy token</b> from the Bank.</li>" +
          "<li><b>Front side:</b> put one random face-up <b>Prisoner</b> from the Bank in the marked room (not yet freed — no immediate effects). <b>Back side:</b> the Monkey Shrine moves to the Underworld — place the three Monkey Idols there and cover the Catacombs Monkey Shrine with the replacement token.</li>" +
          "<li><i>First game suggestion:</i> each player takes one <b>undercoin</b> from the Bank.</li></ul>",
        src: "Underworld p.5" },
      { when: () => true, exp: (c) => c.has("uw") || c.has("lairs") ? "mod" : "base",
        t: "Reserve, Dungeon Deck & Dungeon Row",
        d: (c) => "<ul><li>Create the <b>Reserve</b>: the Goblin card plus three stacks — Mercenary, Explore, Secret Tome" + (c.p >= 5 ? " (add the four extra copies of each from Adventuring Party)" : "") + "." + (c.has("uw") ? " Add the <b>Underworld Guardian</b> card next to the Goblin as a reference." : "") + "</li>" +
          ((c.has("lairs") || c.has("uw") || c.p >= 5) ? "<li>Shuffle into the <b>Dungeon Deck</b>: " + [c.has("lairs") ? "the 50 Lairs & Lost Chambers cards" : "", c.has("uw") ? "the 50 Underworld cards" : "", c.p >= 5 ? "the 35 Adventuring Party cards" : ""].filter(Boolean).join(", ") + ".</li>" : "") +
          "<li>Shuffle the <b>Dungeon Deck</b> and deal <b>six cards face up</b> as the Dungeon Row. Replace any card showing the <b>Dragon Attack symbol</b> until the Row has six without it; shuffle replaced cards back in.</li>" +
          "<li>Place the deck next to the Row, leaving room for a Dungeon discard pile.</li>" +
          (c.has("uw") ? "<li>Shuffle the <b>fate deck</b> and place it near the Dungeon Deck; give each player an Underworld <b>reference card</b>.</li>" : "") +
          (c.has("lairs") ? "<li>Place the five <b>monster markers</b> in the Bank: three Living Statues, one Medusa, one Sphinx.</li>" : "") + "</ul>",
        src: (c) => {
          const s = ["Core p.5"];
          if (c.has("lairs")) s.push("Lairs p.4");
          if (c.has("uw")) s.push("Underworld p.5");
          if (c.p >= 5) s.push("Core p.15 · Adventuring Party p.3");
          return s.join(" · ");
        } }
    ]
  },
  {
    title: "Players & First Turn",
    steps: [
      { when: () => true, exp: (c) => c.mod("chars") ? "party" : "base",
        t: "Player colors, cubes & decks",
        d: (c) => "<ul><li>Each player chooses a color, takes its <b>30 Clank! cubes</b> as a personal supply, and places their <b>pawn on the Crypt</b> of the starting tile (outside the dungeon).</li>" +
          "<li>Each player takes <b>three Lockpicks</b> from the Bank.</li>" +
          (c.mod("chars")
            ? "<li><b>Characters:</b> each player picks one of the six characters, taking its character board, any special tokens, and its <b>custom 10-card starting deck</b> (three unique cards each). Don't mix characters with regular starting decks.</li>"
            : "<li>Each player takes a <b>10-card starting deck</b>: 6 Burgle, 2 Stumble, 1 Sidestep, 1 Scramble.</li>") +
          "<li>Shuffle your deck and <b>draw five cards</b>.</li></ul>",
        src: (c) => c.mod("chars") ? "Core p.5 · Adventuring Party p.5" : "Core p.5" },
      { when: () => true, exp: (c) => c.p >= 5 ? "party" : "base",
        t: "First player & starting Clank!",
        d: (c) => "<ul><li>The <b>sneakiest player</b> goes first (or choose randomly); play proceeds clockwise.</li>" +
          "<li>Starting Clank! in the Clank! area: first player <b>3</b>, second <b>2</b>, third <b>1</b>, fourth <b>0</b>." +
          (c.p >= 5 ? " The fifth and sixth players also place <b>0</b> Clank!, but the fifth takes <b>1 Gold</b> and the sixth takes <b>2 Gold</b> from the Bank.</li>" : "</li>") + "</ul>",
        src: (c) => c.p >= 5 ? "Core p.5 · Adventuring Party p.3" : "Core p.5" }
    ]
  }
];

/* =============================================================================
   RULES REFERENCE
   ============================================================================= */
CC.reference = [
  {
    title: "Your Turn — Cards & Resources",
    when: () => true,
    html: () => "<ul><li>Start each turn with five cards; you <b>must play all your cards</b> before ending it, in any order, into your play area.</li>" +
      "<li>Cards make three pooled resources — <b>Skill</b> (acquire cards, use devices), <b>Swords</b> (fight monsters, prevent tunnel-monster damage), <b>Boots</b> (movement) — plus <b>Gold</b>, <b>Clank!</b>, and card draws. Unused resources are wasted at the end of the turn.</li>" +
      "<li>Take any action <b>as many times as you like</b> if you can pay for it, before, between or after card plays.</li>" +
      "<li><b>Clank!:</b> add cubes from your supply to the Clank! area when you make noise; negative Clank! removes your cubes from the area (creditable later the same turn). Leftover negative Clank! is lost at end of turn.</li>" +
      "<li>Card effects apply regardless of play order (e.g. Rebel General sees a companion played before <i>or</i> after it).</li>" +
      "<li>Draws always come from <b>your own deck</b>; when it's empty, reshuffle your discard pile (never the cards still in your play area).</li></ul>",
    src: () => "Core p.6"
  },
  {
    title: "Actions",
    when: () => true,
    html: (c) => "<ul><li><b>Acquire a Card</b> (Skill): buy blue-banner cards from the Dungeon Row (cost bottom-right; goes to your discard pile) or yellow-banner cards from the Reserve. Row cards are <b>not replaced until end of turn</b>.</li>" +
      "<li><b>Use a Device</b> (Skill): purple banners; pay the cost and carry out the USE text <b>immediately</b>; the card goes to the Dungeon discard pile.</li>" +
      "<li><b>Fight a Monster</b> (Swords): red banners; gain the DEFEAT text; the card goes to the Dungeon discard pile. The <b>Goblin</b> in the Reserve stays put and can be fought repeatedly.</li>" +
      "<li><b>Movement</b> (Boots): 1 Boot per tunnel; <b>footprints</b> = 2 Boots; <b>monster icons</b> = 1 damage each unless you spend a Sword per icon; <b>lock icons</b> need a Lockpick (placed on the tunnel — permanently unlocked for everyone); <b>one-way tunnels</b> only in the arrow's direction.</li>" +
      "<li><b>Buy from the Market</b> (7 Gold, in a Market room): any items, multiple buys allowed" + (c.has("uw") ? ". <b>Underworld market rooms</b> sell only the five Underworld items (and vice versa)" : "") + ".</li>" +
      "<li><b>Take an Artifact</b> (in its room, any point of your turn): you can never hold two (a Backpack allows one more). Taking one moves the <b>Dragon marker up the Rage Track</b>. You're stuck with the one you take!</li>" +
      "<li><b>Pick a Chest / Library / Prison</b> (spend a Lockpick onto the feature): Chest → random <b>major secret</b>; Library → a <b>Secret Tome</b> from the Reserve free into your discard pile; Prison → free <b>two random Prisoners</b> (kept face up for scoring; their “immediate” effects trigger).</li>" +
      "<li><b>Wayshrine</b> (special action): place a cube from your supply on an empty space; gain 1 Gold per Wayshrine you've marked so far. One mark per Wayshrine" + (c.p >= 5 ? "; each Wayshrine holds max four cubes — a fifth or sixth player arriving late may be shut out" : "") + ". (Wayshrine cubes never become Clank!.)</li></ul>",
    src: (c) => c.p >= 5 ? "Core p.7–8, p.11, p.15" : "Core p.7–8, p.11"
  },
  {
    title: "Discovering Tiles & Tile Features",
    when: () => true,
    html: (c) => "<ul><li>Moving along a tunnel off the dungeon's edge <b>discovers</b> the next tile from the stack: reveal it, rotate it any way you like, and place it sharing an entire edge (never stacked; the long edges of the starting tile line up with either half). Placing it completes the tunnel — you interact with any icons it adds as you finish the move.</li>" +
      "<li>If you can't afford the completed tunnel (Boots/Lockpicks), choose a different orientation; you may pause mid-move to acquire/use/fight for what you need.</li>" +
      "<li>If the tile stack empties, no more tiles can be discovered.</li>" +
      "<li><b>Artifact rooms:</b> when placed, stock the room from the Artifact stack — each “+” icon takes one Artifact <b>deeper</b> than the top" + (c.p >= 5 ? " (5–6 players: place multiple Artifacts — the top one plus one per “+”; first claimant takes the most valuable, gold version before silver)" : "") + ". Empty stack = empty room.</li>" +
      "<li><b>Crypt:</b> where you start and where you must return <b>with an Artifact</b> to escape.</li>" +
      "<li><b>Crystal Caves:</b> entering exhausts you — no more Boots this turn (teleports still work).</li>" +
      "<li><b>Haunted tiles</b> (4 of the 22 Depths tiles): when added, put a <b>Ghost cube</b> from the Bank into the Clank! area.</li>" +
      "<li><b>Portals:</b> a tunnel into a portal exits from <b>any other portal</b>; the whole portal move costs one Boot.</li>" +
      "<li><b>Room rewards</b> (minor secret, Monkey Idol, Gold, healing): once per room per turn, on entry.</li></ul>",
    src: (c) => c.p >= 5 ? "Core p.9–11, p.15" : "Core p.9–11"
  },
  {
    title: "Clank!, Dragon Attacks, Health",
    when: () => true,
    html: (c) => "<ul><li><b>End of turn:</b> (1) discard your play area and draw five; (2) refill the Dungeon Row to six; (3) if any <b>new</b> card shows the Dragon Attack symbol, the dragon attacks <b>once</b>.</li>" +
      "<li><b>Dragon Attack:</b> all cubes in the Clank! area go into the Dragon bag; shake and draw cubes equal to the Rage Track number (+1 per <b>Danger</b> card in the Row). Black cubes are set aside in the Bank; your colored cubes are <b>damage to you</b>; undrawn cubes stay in the bag for later attacks.</li>" +
      "<li><b>Ghost cubes:</b> when drawn, <b>every</b> player takes 1 damage; after the attack the Ghost cubes return to the Clank! area (they'll be in the bag again next time).</li>" +
      "<li>The <b>Rage Track</b> advances every time an Artifact is picked up (and from certain tokens" + (c.has("uw") ? ", e.g. Dragon Egg, Soul Elixir, Judgement" : ", e.g. the Dragon Egg minor secret") + ").</li>" +
      "<li><b>Health:</b> damage cubes go on your Health Meter. You can't voluntarily take damage with an empty supply or if it would fill your meter. A full meter <b>knocks you out</b>. Healing returns a cube of yours to your supply.</li>" +
      "<li>If the Dragon bag is <b>empty after an attack</b>, or the Dungeon Deck can't refill the Row, the game ends immediately — remaining players are knocked out.</li></ul>",
    src: () => "Core p.12"
  },
  {
    title: "Game End & Scoring",
    when: () => true,
    html: (c) => "<ul><li>The game ends when <b>all players have escaped or been knocked out</b>.</li>" +
      "<li><b>Escape:</b> reach the <b>Crypt</b> carrying an Artifact — you can't return empty-handed. Take a <b>Mastery token</b> (+20 points).</li>" +
      "<li><b>Knocked out:</b> meter full. With no Artifact, or with your pawn in the <b>Depths</b>" + (c.has("uw") ? " or the Underworld" : "") + ", you score <b>0</b>. (The Depths are the 22 darker tiles plus the top half of the starting tile.)</li>" +
      "<li>Escaped/knocked-out players stop playing; on each of their turns they put the Clank! area cubes in the bag and draw exactly <b>four</b> cubes (<b>six</b> in a 2-player game), ignoring the Rage Track and Danger.</li>" +
      "<li><b>Score:</b> Artifact value + all other tokens (Mastery, secrets, prisoners, Monkey Idols…) + Gold + points on your cards (deck, hand and discard pile). Most points wins; ties go to the most valuable Artifact.</li></ul>",
    src: () => "Core p.14"
  },
  {
    title: "Token Quick Reference",
    when: () => true,
    html: (c) => "<ul><li><b>Major secrets</b> (Chests): Catacombs Map (move against one-way arrows, 5 pts), Chalice (7 pts), Greater Skill Boost (+5 Skill), Greater Treasure (5 Gold), Potion of Greater Healing (heal 2).</li>" +
      "<li><b>Minor secrets</b> (rooms): Dragon Egg (3 pts, rage +1), Lockpick, Magic Spring (trash a card from discard/play area at end of turn), Potions of Healing / Swiftness / Strength, Puzzle Box (redeem at a Wayshrine for a major secret), Treasure (2 Gold)" + (c.p >= 5 ? ", Potion of Stealth (−1 Clank! for you, +1 for each opponent)" : "") + ".</li>" +
      "<li><b>Prisoners</b> (Prisons, 2 freed per Lockpick): points plus effects — e.g. Barbarian (+2 Swords now), Cleric (heal 1), Mayor (5 pts with a Mastery token), Monk (1 pt per marked Wayshrine), Primatologist (5 pts with a Monkey Idol), Prince/Princess (5 pts with a Crown), Sorceress (5 pts with two Secret Tomes), Warrior (1 pt per freed Prisoner), Discount Coupon (one Market buy at −5 Gold).</li>" +
      "<li><b>Market items:</b> Backpack (carry a 2nd Artifact" + (c.p >= 5 ? " — never two from the same room" : "") + ", 5 pts), Blood Amulet (needs 5+ damage; heal 2; 7 pts), Burglar's Kit (2 Lockpicks, 2 pts), Crown (points as shown, best available first)" + (c.p >= 5 ? ", Invisibility Cloak (ignore tunnel monsters, 5 pts)" : "") + ".</li>" +
      "<li><b>Monkey Idols:</b> 5 pts each, not Artifacts, from the Monkey Shrine.</li></ul>",
    src: (c) => c.p >= 5 ? "Core p.17–18 · Adventuring Party p.3" : "Core p.17–18"
  },
  {
    title: "Underworld — Getting There & Back",
    when: (c) => c.has("uw"),
    html: () => "<ul><li>The <b>Underworld</b> is a separate area (max six tiles: the starting tile plus tiles A–E placed against it, never rotated). It is <b>not</b> the Depths — Depths effects don't work there — but being knocked out there also scores <b>0</b>.</li>" +
      "<li><b>Ladders</b> (on the new Depths tiles, lettered A–E): spend 1 Boot (or a teleport) to descend to the matching Underworld ladder room, discovering its tile if needed. Climb back up the same way — but only if the matching lettered room actually exists in the Depths (mark connected rooms with <b>ladder tokens</b>).</li>" +
      "<li><b>Underworld chutes</b> (unlettered): descend to <b>any</b> ladder room — one-way, down only.</li>" +
      "<li>The Underworld starting tile's <b>return portal</b> is one-way <b>out</b>: exit to any other portal; you can never enter through it.</li>" +
      "<li><b>Tolls:</b> starting your turn in the Underworld costs <b>1 undercoin</b> (or +2 Clank! if you can't pay — you can't choose the Clank! if you have a coin). Toll-booth tunnels cost 1 undercoin, no Clank! option (teleports ignore them).</li>" +
      "<li><b>Undercoins</b> work exactly like Gold (spend for market items, 1 pt each) and are earned in Underworld rooms.</li></ul>",
    src: () => "Underworld p.6–7"
  },
  {
    title: "Underworld — Features & Variants",
    when: (c) => c.has("uw"),
    html: (c) => "<ul><li><b>Underworld Guardian:</b> entering his room means fight (3 Swords) or take 2 damage (once — staying costs nothing more). Defeating him gives the <b>2× artifact enhancer</b> and the Guardian as a trophy “bonus artifact” (rage +1; doesn't count against your Artifact limit).</li>" +
      "<li><b>Artifact enhancers:</b> a multiplier on your <b>best</b> artifact's value at game end (round up). After the 2× is claimed, up to two other players may each take a lesser one — one per player.</li>" +
      "<li><b>Imp Assistants</b> (Forbidden Library): first entry takes the top one (one per player). From then on, each Secret Tome you acquire forces you to remove two cards of your choice from the Dungeon Row; the Imp scores the shown value per Secret Tome you have.</li>" +
      "<li><b>Magic lyre:</b> a 16-point artifact that can only be taken by a player in its room — immune to Arrive effects and Lost Chambers tricks.</li>" +
      "<li><b>Fate rooms:</b> first visit, draw three <b>fate cards</b>, keep one (max one per game; Gauntlets of Destiny allows two). Most stay hidden until scoring.</li>" +
      "<li><b>Harpies:</b> entering a harpy room means fight (2 Swords) or take 1 damage (once). Defeating one pays 1 undercoin per harpy trophy you own (including it).</li>" +
      "<li><b>Underground lakes:</b> on entry (once per turn), trash a card in your play area or discard pile.</li>" +
      (c.mod("fixeddim") ? "<li><b>Fixed Dimensions:</b> the dungeon may not exceed the agreed grid (5×5 or 6×6); tiles must be oriented to respect it, even if that forces damage.</li>" : "") +
      (c.mod("mercy") ? "<li><b>Mercy:</b> if you're completely trapped (no adjacent room, no placeable tile), rotate your current tile to any orientation that frees you.</li>" : "") +
      "<li><b>With Lairs & Lost Chambers:</b> the Guardian (marker + card) and harpies count as <b>trophies</b>; fate rooms are <b>lost chambers</b>; the Guardian's room is <b>not</b> a lair.</li></ul>",
    src: () => "Underworld p.8–10"
  },
  {
    title: "Lairs & Lost Chambers",
    when: (c) => c.has("lairs"),
    html: () => "<ul><li><b>Trophies:</b> cards with TROPHY text (and the five monster markers) go face up to your personal supply when defeated/used, and their text stays active.</li>" +
      "<li><b>Entry tunnels:</b> a newly discovered tile with entry tunnels must be placed so you enter through one; afterwards they're normal tunnels.</li>" +
      "<li><b>Magic barriers:</b> you can't walk through with an artifact (teleporting is fine).</li>" +
      "<li><b>Linked one-way tunnels:</b> your entry direction decides which of the pair you use.</li>" +
      "<li><b>Pit traps:</b> each entry (per room, per turn): <b>Fall in</b> (1 damage, no more Boots this turn) or <b>Evade</b> (trash a non-Stumble card <b>from your hand</b>).</li>" +
      "<li><b>Lost chambers</b> (Wayshrine-style cube marking): <b>Aegis Shrine</b> (return your cube to cancel Ghost damage), <b>Bizarre Bazaar</b> (four one-off stalls, 3 Gold or trash a trophy each), <b>Altar of the Haunted</b> (trash a trophy: 2 Gold + fetch an artifact from anywhere), <b>Temple of Gold</b> (donate Gold from any Wayshrine for healing/Lockpick/major secret/artifact fetch — once per game), <b>Umbrok Vessna's Hoard</b> (5 Gold and +2 Clank! on entry; taking its artifact/chest teleports you to another room on the tile).</li>" +
      "<li><b>Lairs:</b> <b>Living Statues</b> (fight in the lair; you must teleport to another lair/lost chamber after each kill), <b>Medusa</b> (fight or take 2 damage on entry; her trophy lets you ignore tunnel monsters), <b>Sphinx</b> (4 Swords <i>or</i> 7 Skill).</li></ul>",
    src: () => "Lairs p.4–8"
  },
  {
    title: "Adventuring Party — 5 & 6 Players",
    when: (c) => c.p >= 5 || c.mod("chars"),
    html: (c) => "<ul>" +
      (c.p >= 5 ? "<li><b>Party in the Catacombs:</b> Artifact rooms with “+” icons hold <b>multiple Artifacts</b> (top of stack + one per “+”) instead of digging deeper; a player taking one takes the most valuable available. Gold versions are claimed before silver, and win scoring ties.</li>" +
        "<li>A <b>Backpack</b> never lets you take two Artifacts from the same room.</li>" +
        "<li>Wayshrines hold only <b>four cubes</b> — late arrivals can be shut out.</li>" +
        "<li>The <b>side board</b> tracks the health of the fifth and sixth players.</li>" +
        "<li>If the Ape Lord Phantasm is defeated, a Golden Monkey Bot prisoner can't be “returned” to the Monkey Shrine (it was never there).</li>" : "") +
      (c.mod("chars") ? "<li><b>Characters</b> (any player count): six thieves — e.g. Agnet (conscription tokens put companions on top of your deck), D'allan (score “Finds”: dragon egg, artifact, crown, monkey idol) — each with a board and a 10-card custom deck holding three unique cards. Play characters against characters only; mixing with Legacy character packs is allowed.</li>" : "") +
      "</ul>",
    src: (c) => c.mod("chars") ? "Core p.15 · Adventuring Party p.2–7" : "Core p.15 · Adventuring Party p.2–3"
  }
];

/* =============================================================================
   TEACHING SCRIPT
   ============================================================================= */
CC.teach = {
  intro: "A ~5-minute teach for the exact sets selected above. Read it aloud, or hit Copy and tweak. Rules content is drawn from the rulebooks cited in the setup steps.",
  sections: [
    {
      h: "The hook — and how you win",
      body: () => "<p>We're thieves sneaking into a dragon's catacombs to steal an <b>Artifact</b> and get out alive. Two goals: grab an Artifact and escape back to the <b>Crypt</b> where we started — and score more than everyone else. Points come from your Artifact, treasure tokens, Gold, and the cards you buy. But greed is loud: every bit of noise you make — <b>Clank!</b> — becomes cubes with your color on them, and when the dragon attacks, cubes get pulled from a bag. Yours hurt <b>you</b>.</p>" +
        "<p>One hard rule to respect: if you're knocked out before escaping — or knocked out deep in the dungeon without an Artifact — you score <b>zero</b>. Escape artists beat corpses every time.</p>"
    },
    {
      h: "The shape of a turn",
      body: () => "<p>You hold five cards and <b>must play them all</b>, in any order. They produce three currencies: <b>Skill</b> buys new cards for your deck, <b>Swords</b> fight monsters, <b>Boots</b> move you through tunnels. Cards also make Gold, draws — and Clank!. Spend everything you can; nothing carries over. Then discard, draw five, refill the card row — and if a new card shows the <b>Dragon Attack</b> symbol, the dragon strikes.</p>"
    },
    {
      h: "The dungeon builds itself",
      body: () => "<p>Unlike other Clank! games, there's no fixed map — the catacombs are a stack of <b>tiles</b>. Walk off the edge of the known dungeon and you flip the next tile and choose how to rotate it. Tunnels can demand extra Boots, bite you with <b>monsters</b> (a Sword each cancels a bite), or be <b>locked</b> — spend a Lockpick and it's open for everyone, forever. The first four tiles are safe-ish; everything after is the <b>Depths</b>, where being knocked out means scoring nothing.</p>" +
        "<p>Rooms are where the loot lives: Artifact rooms, Markets (7 Gold a purchase), <b>Chests, Libraries and Prisons</b> you crack with Lockpicks, Wayshrines to mark for Gold, monkey shrines, portals. Room rewards pay once per visit.</p>"
    },
    {
      h: "Clank! and the dragon — the heart of it",
      body: () => "<p>When you attack, stumble, or grab an Artifact, cubes of your color go to the Clank! area. On a Dragon Attack, <b>everything</b> in that area goes into the bag with the black dragon cubes, and we draw as many as the <b>Rage Track</b> shows. Black cubes: nothing. Your cubes: damage on your health meter. Fill the meter and you're out. Every stolen Artifact enrages the dragon further — the endgame is a countdown of everyone's own making. The white <b>Ghost cubes</b> from haunted tiles hurt <i>everyone</i> when drawn.</p>" +
        "<p>So the real game is tempo: dive deep for the fat 20-point Artifact and risk the bag filling with your color, or snatch a cheap one and run. Once you escape (grabbing a 20-point <b>Mastery token</b> on the way out), your turns become extra bag-pulls that hurry everyone else.</p>"
    },
    { when: (c) => c.has("lairs"),
      h: "Lairs & Lost Chambers",
      body: () => "<p>Twelve stranger tiles are shuffled in. <b>Lost chambers</b> are one-of-a-kind rooms — a bazaar with four buyable boons, a temple that trades Gold donations for healing and secrets, a hoard that pays 5 Gold but wakes the dragon. <b>Lairs</b> hold boss monsters: Living Statues, Medusa (fight her or turn briefly to stone), and the Sphinx, who falls to 4 Swords <i>or</i> 7 Skill. Beat them and keep them as <b>trophies</b> with permanent powers. Watch for <b>pit traps</b> and <b>magic barriers</b> that stop artifact-carriers.</p>" },
    { when: (c) => c.has("uw"),
      h: "The Underworld",
      body: () => "<p>Below the Depths lies a second dungeon. Find a lettered <b>ladder</b> (or a one-way chute) to climb down. Down there the currency is <b>undercoins</b> — worth Gold, but also demanded as a <b>toll</b> every turn you wake up down there; can't pay and you make +2 Clank!. The prizes are rich: the 16-point <b>magic lyre</b>, <b>fate cards</b> that quietly score at game end, <b>artifact enhancers</b> that multiply your best artifact — guarded by <b>Kerberos</b> himself and a flock of harpies. Getting out again is the trick: ladders only climb to Depths rooms that actually exist, and the return portal is one-way. Don't get knocked out down there — that's a zero.</p>" },
    { when: (c) => c.p >= 5,
      h: "Five or six thieves",
      body: () => "<p>With the Adventuring Party rules, artifact rooms hold <b>two artifacts</b> (first claimant takes gold, second silver — gold wins ties), Wayshrines only fit four cubes, and the fifth and sixth players start with a little bonus Gold instead of extra quiet. Expect the card row to churn and the bag to fill fast — escape windows close early at this count.</p>" },
    { when: (c) => c.mod("chars"),
      h: "Characters",
      body: () => "<p>Tonight everyone plays a unique <b>character</b> — your own board and a tweaked starting deck with three signature cards. Read your three cards; that's your whole edge. Characters only face other characters, so nobody's on a plain deck.</p>" },
    { when: (c) => c.mod("fixeddim") || c.mod("mercy"),
      h: "Variants tonight",
      body: (c) => "<ul>" +
        (c.mod("fixeddim") ? "<li><b>Fixed Dimensions:</b> the dungeon can't grow past our agreed grid — plan your placements.</li>" : "") +
        (c.mod("mercy") ? "<li><b>Mercy:</b> if you're ever truly trapped, you may rotate your tile to escape.</li>" : "") + "</ul>" },
    {
      h: "Don't worry about these until they come up",
      body: (c) => {
        const items = [];
        items.push("<li><b>Individual secrets, prisoners and market items</b> — read them as they're drawn; the reference guide is right there.</li>");
        items.push("<li><b>Crystal Caves</b> — they just stop your Boots for the turn.</li>");
        items.push("<li><b>Portals and teleports</b> — cheap fast travel; I'll walk the first one.</li>");
        items.push("<li><b>What happens after you escape</b> — you'll pull cubes to hurry the rest of us.</li>");
        if (c.has("uw")) items.push("<li><b>Ladder letters and chutes</b> — the tokens mark which exits are real.</li>");
        if (c.has("lairs")) items.push("<li><b>Each lost chamber's fine print</b> — read it when you're standing in it.</li>");
        items.push("<li><b>Exact end-of-turn order</b> — discard, draw, refill row, check for a dragon attack. It becomes automatic.</li>");
        return "<ul>" + items.join("") + "</ul>";
      }
    }
  ]
};
