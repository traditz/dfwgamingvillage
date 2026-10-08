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
  { id: "lairs", short: "Lairs & Lost Chambers", year: "2024", blurb: "12 new tiles with lairs, lost chambers, pit traps and trophies, plus 50 cards." },
  { id: "uw",    short: "Underworld", year: "2025", blurb: "A second dungeon below the Depths: ladders, undercoins, fate cards, harpies and the Underworld Guardian." },
  { id: "party", short: "Adventuring Party", year: "2020", blurb: "5–6 players (via the “Party in the Catacombs!” rules) and six optional unique characters." }
];

CC.modules = [
  { id: "fixeddim", requires: "uw", name: "Fixed Dimensions (variant)", summary: "Limit the dungeon to an agreed 5×5 or 6×6 grid",
    description: "For limited table space — no square tile may be placed outside the agreed grid.", src: "Underworld p.10" },
  { id: "mercy", requires: "base", name: "Mercy (variant)", summary: "Rotate your tile if you become completely trapped",
    description: "From the Underworld rulebook; playable with or without the Underworld expansion, and strongly recommended with Fixed Dimensions.", src: "Underworld p.10" },
  { id: "chars", requires: "party", name: "Characters", summary: "Six unique thieves with custom starting decks",
    description: "Each player may pick a character board and its 10-card custom deck instead of the standard deck — usable at any player count, but don't mix characters with regular starting decks.", src: "Core p.15 · Adventuring Party p.2, p.5" }
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
          (c.p >= 5
            ? "<li><b>Adventuring Party:</b> place its <b>side board</b> near the Clank! board — it holds the new Rage Track and the Health Meters for the fifth and sixth players.</li>" +
              "<li>Place the <b>Dragon marker</b> on the <b>first space of the side board's Rage Track</b> (marked 5/6; the Clank! board's own track has only 2–4 player spaces).</li>"
            : "<li>Place the <b>Dragon marker</b> on the Rage Track space showing the number of players (" + c.p + ").</li>") + "</ul>",
        src: (c) => c.p >= 5 ? "Core p.4 · Core p.15 · Adventuring Party p.2" : "Core p.4" },
      { when: (c) => !c.has("uw"), exp: (c) => c.has("lairs") ? "lairs" : "base",
        t: "Build the tile stack",
        d: (c) => "<ul>" +
          (c.has("lairs") ? "<li><b>Lairs & Lost Chambers:</b> first shuffle its 12 new square tiles into your existing tiles by their backs (10 Depths, 2 “safe”). All Depths tiles are used. <i>(First game: you may shuffle the new tiles and cards into the top half of their stacks to see plenty of them.)</i></li>" : "") +
          "<li>Separate the square tiles by their backs. Shuffle the <b>Depths tiles</b> into a face-down stack in a Bank area next to the Clank! board.</li>" +
          "<li>Shuffle the <b>“safe” tiles</b>; return <b>" + (c.has("lairs") ? "four" : "two") + " at random</b> to the box unseen and place the remaining <b>four</b> on top of the Depths stack.</li></ul>",
        src: (c) => c.has("lairs") ? "Core p.4 · Lairs p.3–4" : "Core p.4" },
      { when: (c) => c.has("uw"), exp: "uw",
        t: "Build the tile stacks — Underworld",
        d: (c) => "<ul>" +
          (c.has("lairs") ? "<li><b>Lairs & Lost Chambers:</b> first shuffle its 12 new tiles into your existing tiles by their backs.</li>" : "") +
          "<li>Shuffle the six <b>Underworld Depths tiles</b> and return <b>three</b> to the box unseen.</li>" +
          "<li>Separately shuffle your existing Depths tiles; take the <b>top seven</b> unseen and shuffle the three kept Underworld Depths tiles into them. Place this 10-tile stack on top of the remaining Depths tiles.</li>" +
          "<li>Shuffle the “safe” tiles and place only <b>three</b> (not four) on top of the stack; return the other " + (c.has("lairs") ? "five" : "three") + " to the box unseen.</li>" +
          "<li>Shuffle the <b>seven regular Underworld tiles</b> into their own face-down stack next to the square tiles.</li></ul>",
        src: (c) => c.has("lairs") ? "Underworld p.4 · Core p.4 · Lairs p.4" : "Underworld p.4 · Core p.4" },
      { when: () => true, exp: (c) => c.has("uw") ? "uw" : "base",
        t: "Stock the Bank",
        d: (c) => "<ul><li>Add the <b>Gold</b> (1s, 5s, 10s) and <b>Lockpicks</b> (not limited — substitute if you run out), the five white <b>Ghost cubes</b>, and the <b>Dragon bag</b> with the 24 black dragon cubes inside.</li>" +
          "<li>Stack the <b>seven Artifacts</b> face up in order of value: 5-point on top, 20-point on the bottom." +
          (c.p >= 5 ? " <b>Adventuring Party:</b> add its 10/15/20/25-point Artifacts (not the 30) to the stack, still in increasing order, each on top of any Catacombs Artifact of the same value.</li>" : "</li>") +
          "<li>Separate <b>major secrets, minor secrets, and prisoners</b>; shuffle each kind face down." + (c.has("uw") ? " Shuffle the <b>Underworld</b> secrets and prisoners into their matching pools." : "") + (c.p >= 5 ? " Add the Adventuring Party minor secrets and extra Gold and Mastery tokens." : "") + "</li>" +
          (c.has("uw")
            ? "<li>Add the <b>undercoins</b> and the <b>harpy and ladder tokens</b>. Use the <b>Underworld Market Board</b> instead of the Catacombs one. Top row: the regular items (two Backpacks, two Blood Amulets, three Burglar's Kits, three Crowns stacked 10-point on top, 8-point on the bottom) plus the new <b>River Lamp</b>. Bottom row: the five <b>Underworld market items</b>.</li>"
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
      { when: () => true, exp: (c) => c.has("uw") ? "uw" : c.has("lairs") ? "lairs" : "base",
        t: "Reserve, Dungeon Deck & Dungeon Row",
        d: (c) => "<ul><li>Create the <b>Reserve</b>: the Goblin card plus three stacks — Mercenary, Explore, Secret Tome" + (c.p >= 5 ? " (add the four extra copies of each from Adventuring Party)" : "") + "." + (c.has("uw") ? " Add the <b>Underworld Guardian</b> card next to the Goblin as a reference." : "") + "</li>" +
          ((c.has("lairs") || c.has("uw") || c.p >= 5) ? "<li>Shuffle into the <b>Dungeon Deck</b>: " + [c.has("lairs") ? "the 50 Lairs & Lost Chambers cards" : "", c.has("uw") ? "the 50 Underworld cards" : "", c.p >= 5 ? "the 35 Adventuring Party cards" : ""].filter(Boolean).join(", ") + ".</li>" : "") +
          "<li>Shuffle the <b>Dungeon Deck</b> and deal <b>six cards face up</b> as the Dungeon Row. Replace any card showing the <b>Dragon Attack symbol</b> until the Row has six without it; shuffle replaced cards back in. If any card in the starting Row has <b>Arrive</b> text, carry it out before the first player's turn.</li>" +
          "<li>Place the deck next to the Row, leaving room for a Dungeon discard pile.</li>" +
          (c.has("uw") ? "<li>Shuffle the <b>fate deck</b> and place it near the Dungeon Deck; give each player an Underworld <b>reference card</b>.</li>" : "") +
          (c.has("lairs") ? "<li>Place the five <b>monster markers</b> in the Bank: three Living Statues, one Medusa, one Sphinx.</li>" : "") + "</ul>",
        src: (c) => {
          const s = ["Core p.5, p.11"];
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
      { when: () => true, exp: (c) => (c.mod("chars") || c.p >= 5) ? "party" : "base",
        t: "Player colors, cubes & decks",
        d: (c) => "<ul><li>Each player chooses a color, takes its <b>30 Clank! cubes</b> as a personal supply, and places their <b>pawn on the Crypt</b> of the starting tile (outside the dungeon)." +
          (c.p >= 5 ? " <b>Adventuring Party:</b> the fifth and sixth players use its two new colors (30 Clank! cubes and a pawn each)." : "") + "</li>" +
          "<li>Each player takes <b>three Lockpicks</b> from the Bank.</li>" +
          (c.mod("chars")
            ? "<li><b>Characters:</b> each player picks one of the six characters, taking its character board, any special tokens, and its <b>custom 10-card starting deck</b> (three unique cards each). Don't mix characters with regular starting decks.</li>"
            : "<li>Each player takes a <b>10-card starting deck</b>: 6 Burgle, 2 Stumble, 1 Sidestep, 1 Scramble." +
              (c.p >= 5 ? " The fifth and sixth players take the two identical 10-card starting decks from Adventuring Party." : "") + "</li>") +
          "<li>Shuffle your deck and <b>draw five cards</b>.</li></ul>",
        src: (c) => c.mod("chars") ? (c.p >= 5 ? "Core p.5 · Adventuring Party p.2, p.5" : "Core p.5 · Adventuring Party p.5") : (c.p >= 5 ? "Core p.5 · Adventuring Party p.2" : "Core p.5") },
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
      "<li>Cards make three pooled resources — <b>Skill</b> (acquire cards, use devices), <b>Swords</b> (fight monsters, prevent tunnel-monster damage), <b>Boots</b> (movement) — plus <b>Gold</b>, <b>Clank!</b>, and card draws. Unused Skill, Swords and Boots are wasted at the end of the turn; Gold is kept in your personal supply (1 point each at game end).</li>" +
      "<li>Take any action <b>as many times as you like</b> if you can pay for it, before, between or after card plays.</li>" +
      "<li><b>Clank!:</b> add cubes from your supply to the Clank! area when you make noise (none if your supply is empty); negative Clank! removes your cubes from the area (creditable later the same turn). Leftover negative Clank! is lost at end of turn.</li>" +
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
      "<li><b>Movement</b> (Boots): 1 Boot per tunnel; <b>footprints</b> = 2 Boots; <b>monster icons</b> = 1 damage each unless you spend a Sword per icon; <b>lock icons</b> need a Lockpick each (placed on the tunnel — permanently unlocked for everyone; two locks in one tunnel = two Lockpicks); <b>one-way tunnels</b> only in the arrow's direction.</li>" +
      "<li><b>Buy from the Market</b> (7 Gold, in a Market room): any items, multiple buys allowed" + (c.has("uw") ? ". <b>Underworld market rooms</b> sell only the five Underworld items (and vice versa)" : "") + ".</li>" +
      "<li><b>Take an Artifact</b> (in its room, any point of your turn): you can never hold two (a Backpack allows one more). Taking one moves the <b>Dragon marker up the Rage Track</b>. You're stuck with the one you take!</li>" +
      "<li><b>Pick a Chest / Library / Prison</b> (spend a Lockpick onto the feature): Chest → random <b>major secret</b>; Library → a <b>Secret Tome</b> from the Reserve free into your discard pile; Prison → free <b>two random Prisoners</b> (kept face up for scoring; their “immediate” effects trigger). Each feature can be picked only once per game, and only if its reward is still available (a Prison can still be picked for the last single Prisoner).</li>" +
      "<li><b>Wayshrine</b> (special action, while in it): place a cube from your supply on an empty space; gain 1 Gold per Wayshrine you've marked so far. One mark per Wayshrine; no cubes in your supply = can't mark" + (c.p >= 5 ? "; each Wayshrine holds max four cubes — a fifth or sixth player arriving late may be shut out" : "") + ". (Wayshrine cubes never become Clank!.)</li></ul>",
    src: (c) => (c.p >= 5 ? "Core p.7–8, p.11, p.15, p.18" : "Core p.7–8, p.11, p.18") + (c.has("uw") ? " · Underworld p.9" : "")
  },
  {
    title: "Discovering Tiles & Tile Features",
    when: () => true,
    html: (c) => "<ul><li>Moving along a tunnel off the dungeon's edge <b>discovers</b> the next tile from the stack: reveal it, rotate it any way you like, and place it sharing an entire edge (never stacked; the long edges of the starting tile line up with either half). Placing it completes the tunnel — you interact with any icons it adds as you finish the move.</li>" +
      "<li>If you can't afford the completed tunnel (Boots/Lockpicks), choose a different orientation; you may pause mid-move to acquire/use/fight for what you need.</li>" +
      "<li>If the tile stack empties, no more tiles can be discovered.</li>" +
      "<li><b>Artifact rooms:</b> when placed, stock the room from the Artifact stack" + (c.p >= 5 ? ": with 5–6 players a room with “+” icons gets <b>multiple Artifacts</b>, the top one plus one more per “+” (instead of digging deeper). Whoever takes from a room holding more than one takes the <b>most valuable</b> available, and a Backpack never lets you take two from the same room" : ": the top Artifact, or for each “+” icon one Artifact <b>deeper</b> than the top. Not enough Artifacts below the top for the “+” icons → place the highest-valued Artifact that remains") + ". Empty stack = empty room.</li>" +
      "<li><b>Crypt:</b> where you start and where you must return <b>with an Artifact</b> to escape.</li>" +
      "<li><b>Crystal Caves:</b> entering exhausts you — no more Boots this turn (teleports still work).</li>" +
      "<li><b>Haunted tiles</b> (4 of the base game's 22 Depths tiles" + (c.has("uw") ? ", plus Underworld's new haunted Depths and Underworld tiles" : "") + "): when added, put a <b>Ghost cube</b> from the Bank into the Clank! area" + (c.has("uw") ? " (only five Ghosts exist: if none are left in the Bank, add nothing)" : "") + ".</li>" +
      "<li><b>Portals:</b> a tunnel into a portal doesn't stop there: you exit from <b>any other portal</b> on any tile. Room → portal → portal → room costs just <b>one Boot</b>, but both tunnels still apply their Monster, Lock and one-way icons. Teleports can use portals as if the two rooms were adjacent. Afterwards you may keep moving.</li>" +
      "<li><b>Room rewards</b> (minor secret, Monkey Idol, Gold, healing): once per room per turn, on entry.</li></ul>",
    src: (c) => (c.p >= 5 ? "Core p.9–11, p.15" : "Core p.9–11") + (c.has("uw") ? " · Underworld p.2" : "")
  },
  {
    title: "Card Effects",
    when: () => true,
    html: () => "<ul><li><b>Acquire</b> text: carried out once, the moment you acquire the card from the Dungeon Row (not when you later play it).</li>" +
      "<li><b>Arrive</b> text: carried out as soon as the card is revealed in the Dungeon Row, before any Dragon Attack the refill triggers. Arrive cards in the opening Row resolve before the first player's turn.</li>" +
      "<li><b>Danger</b>: +1 cube drawn in each Dragon Attack per Danger card in the Row.</li>" +
      "<li><b>Discard</b>: only an unplayed card from your hand; the discarded card doesn't have its normal effect. If an effect needs a discard, you must actually discard to get it.</li>" +
      "<li><b>Teleport</b>: move straight to another room with no Boots, still exhausted if you entered a Crystal Cave this turn. To an “adjacent room” (connected by a tunnel), ignore that tunnel's icons, even against a one-way arrow. You can teleport off a tile's edge to discover a new tile.</li>" +
      "<li><b>Trash</b>: remove the card from the game (to the box).</li>" +
      "<li><b>Each player</b>: when order matters (e.g. rotating a tile), start with the player taking (or ending) their turn and go clockwise; skip escaped and knocked-out players.</li></ul>",
    src: () => "Core p.11"
  },
  {
    title: "Clank!, Dragon Attacks, Health",
    when: () => true,
    html: (c) => "<ul><li><b>End of turn:</b> (1) discard your play area and draw five; (2) refill the Dungeon Row to six; (3) if any <b>new</b> card shows the Dragon Attack symbol, the dragon attacks <b>once</b>.</li>" +
      "<li><b>Dragon Attack:</b> all cubes in the Clank! area go into the Dragon bag; shake and draw cubes equal to the Rage Track number (+1 per <b>Danger</b> card in the Row). Black cubes are set aside in the Bank; your colored cubes are <b>damage to you</b>; undrawn cubes stay in the bag for later attacks.</li>" +
      "<li><b>Ghost cubes:</b> when drawn, <b>every</b> player takes 1 damage; after the attack the Ghost cubes return to the Clank! area (they'll be in the bag again next time). If you have no cubes in your supply to mark Ghost damage, use a black cube already set aside in the Bank.</li>" +
      "<li>The <b>Rage Track</b> advances every time an Artifact is picked up (and from certain tokens" + (c.has("uw") ? ", e.g. the Dragon Egg minor secret, the Adventurer prisoner, Soul Elixir" : ", e.g. the Dragon Egg minor secret or the Adventurer prisoner") + ").</li>" +
      "<li><b>Health:</b> damage cubes go on your Health Meter. You can't voluntarily take damage with an empty supply or if it would fill your meter. A full meter <b>knocks you out</b>. Healing returns a cube of yours to your supply.</li>" +
      "<li>If the Dragon bag is <b>empty after an attack</b>, or the Dungeon Deck can't refill the Row, the game ends immediately — remaining players are knocked out.</li></ul>",
    src: (c) => "Core p.11–12, p.17–18" + (c.has("uw") ? " · Underworld p.12" : "")
  },
  {
    title: "Game End & Scoring",
    when: () => true,
    html: (c) => "<ul><li>The game ends when <b>all players have escaped or been knocked out</b>.</li>" +
      "<li><b>Escape:</b> reach the <b>Crypt</b> carrying an Artifact — you can't return empty-handed. Finish your turn, then remove your pawn before refilling the Dungeon Row, and take a <b>Mastery token</b> (+20 points).</li>" +
      "<li><b>Knocked out:</b> meter full. With no Artifact, or with your pawn in the <b>Depths</b>" + (c.has("uw") ? " or the Underworld" : "") + ", you score <b>0</b>. (The Depths are the darker tiles — 22 in the base game — plus the top half of the starting tile.)</li>" +
      "<li>Escaped/knocked-out players stop taking turns: they add no more Clank!, 'all players' effects skip them, and drawn cubes don't damage them. On each of their turns they put the Clank! area cubes in the bag and draw exactly <b>four</b> cubes (<b>six</b> in a 2-player game), ignoring the Rage Track and Danger.</li>" +
      "<li><b>Score:</b> Artifact value + all other tokens (Mastery, secrets, prisoners, Monkey Idols…) + Gold + points on your cards (deck, hand and discard pile)." +
      (c.has("lairs") ? " Trophies (cards and monster markers) in your personal supply add any points they give." : "") +
      (c.has("uw") ? " Underworld: undercoins score 1 each; reveal and score your fate card(s); an artifact enhancer multiplies your best artifact (round up); an Imp Assistant scores its value per Secret Tome." : "") +
      " Most points wins; ties go to the most valuable Artifact" + (c.has("uw") ? " (counting its artifact enhancer; if enhancers make two Artifacts equal, the higher unmodified value wins)" : "") + ".</li></ul>",
    src: (c) => "Core p.14" + (c.has("lairs") ? " · Lairs p.4, p.8" : "") + (c.has("uw") ? " · Underworld p.6, p.8–9" : "")
  },
  {
    title: "Token Quick Reference",
    when: () => true,
    html: (c) => "<ul><li><b>Major secrets</b> (Chests): Catacombs Map (move against one-way arrows, 5 pts), Chalice (7 pts), Greater Skill Boost (+5 Skill), Greater Treasure (5 Gold), Potion of Greater Healing (heal 2).</li>" +
      "<li><b>Minor secrets</b> (rooms): Dragon Egg (3 pts, rage +1), Lockpick, Magic Spring (trash a card from discard/play area at end of turn), Potion of Healing (heal 1), Potion of Swiftness (+1 Boot), Potion of Strength (+2 Swords) — keep until used on your turn, Puzzle Box (redeem at a Wayshrine for a major secret), Treasure (2 Gold)" + (c.p >= 5 ? ", Potion of Stealth (−1 Clank! for you, +1 for each opponent)" : "") + ".</li>" +
      "<li><b>Prisoners</b> (Prisons free 2 per Lockpick): Adventurer (rage +1; 3 pts), Barbarian (+2 Swords this turn; 2 pts), Cleric (heal 1; 2 pts), Golden Monkey Bot (counts as a Monkey Idol for all purposes, but 3 pts), Haunted Prisoner (put a Ghost cube from the Bank in the Clank! area; 3 pts), Mayor (5 pts if you have a Mastery token), Monk (1 pt per Wayshrine you've marked), Peasant (2 pts), Primatologist (5 pts with at least one Monkey Idol — the Bot counts), Prince/Princess (5 pts with a Crown), Sorceress (5 pts with at least two Secret Tomes), Warrior (1 pt per Prisoner freed, himself included). The <b>Discount Coupon</b> also comes from Prisons but is <b>not a Prisoner</b> for any purpose (Warrior, Riot, Brave Hero): use it once to pay 5 less Gold for a Market item.</li>" +
      "<li><b>Market items:</b> Backpack (carry a 2nd Artifact" + (c.p >= 5 ? " — never two from the same room" : "") + ", 5 pts), Blood Amulet (needs 5+ damage; heal 2; 7 pts), Burglar's Kit (2 Lockpicks, 2 pts), Crown (points as shown, best available first)" + (c.p >= 5 ? ", Invisibility Cloak (ignore tunnel monsters, 5 pts)" : "") + ".</li>" +
      (c.has("uw") ? "<li><b>Underworld tokens:</b> Prisoners — Faithful (take 1 undercoin; 1 pt), Haunted Myrmidon (add a Ghost cube; +1 Sword each turn you're in the Underworld; 1 pt), Soul Elixir (rage +1; once in the Underworld heal 2; <b>not</b> a Prisoner). Major secrets — Book of the Dead (5 pts; becomes a Secret Tome at game end), Greater Potion of Hope (heal 1, or 2 in the Underworld, +1 Boot), Undercoin Cache (counts as 4 undercoins). Minor secrets — Darkiron Ingot (once: −3 Gold on an Underworld market item, else 2 pts), Potion of Hope (+1 Sword; +1 Boot too in the Underworld), Underworld Chute (once, outside the Underworld: place it as a permanent down-only chute; else 1 pt). Regular market — River Lamp (take 3 undercoins; 5 pts). Underworld markets only — Blood Amulet (as Catacombs), Boots of the Wind (+1 Boot each turn; 1 pt), Gauntlets of Destiny (draw 3 fate cards, keep 1; fate limit 2; 6 pts), Jester's Cap (7 pts per Stumble; counts as a crown), River Boat (trashed cards stack under it and score as part of your deck; 8 pts +1 per card).</li>" : "") +
      "<li><b>Monkey Idols:</b> 5 pts each, not Artifacts, from the Monkey Shrine.</li></ul>",
    src: (c) => "Core p.17–18" + (c.p >= 5 ? " · Adventuring Party p.3" : "") + (c.has("uw") ? " · Underworld p.12" : "")
  },
  {
    title: "Underworld — Getting There & Back",
    when: (c) => c.has("uw"),
    html: () => "<ul><li>The <b>Underworld</b> is a separate area (max six tiles: the starting tile plus tiles A–E placed against it, never rotated). It is <b>not</b> the Depths — Depths effects don't work there — but being knocked out there also scores <b>0</b>. To discover one, reveal the top Underworld tile and place it with its shorter flat edge against the starting tile (you don't choose its orientation). Defeating the <b>Marble Guardian</b> while in the Underworld places a new Underworld tile in an available space next to yours.</li>" +
      "<li><b>Ladders</b> (on the new Depths tiles, lettered A–E): spend 1 Boot (or a teleport) to descend to the matching Underworld ladder room, discovering its tile if needed. Climb back up the same way — but only if the matching lettered room actually exists in the Depths (mark connected rooms with <b>ladder tokens</b>).</li>" +
      "<li><b>Underworld chutes</b> (unlettered; the Underworld Chute minor secret can create one): spend 1 Boot to descend to <b>any</b> ladder room — even an undiscovered one, revealing its tile. One-way, down only — not even a teleport takes you back up.</li>" +
      "<li>The Underworld starting tile's <b>return portal</b> is one-way <b>out</b>: exit to any other portal; you can never enter through it.</li>" +
      "<li><b>Tolls:</b> starting your turn in the Underworld costs <b>1 undercoin</b> (or +2 Clank! if you can't pay — you can't choose the Clank! if you have a coin). Toll-booth tunnels cost 1 undercoin, no Clank! option (teleports ignore them).</li>" +
      "<li><b>Undercoins</b> work exactly like Gold (spend for market items, 1 pt each) and are earned from undercoin rooms (once per room each turn) and some cards.</li>" +
      "<li><b>“When you trash this” cards:</b> you can't trash them whenever you choose — you need some other means, such as an underground lake.</li></ul>",
    src: () => "Underworld p.6–7, p.12"
  },
  {
    title: "Underworld — Features & Variants",
    when: (c) => c.has("uw"),
    html: (c) => "<ul><li><b>Underworld Guardian:</b> entering his room means fight (3 Swords) or take 2 damage (once — staying costs nothing more, and you may fight him later that turn or on a later turn). If you have no cubes in your supply, or the damage would fill your Health Meter, you can't enter his room. Defeating him gives the <b>2× artifact enhancer</b> and the Guardian as a trophy “bonus artifact” (rage +1; doesn't count against your Artifact limit).</li>" +
      "<li><b>Artifact enhancers:</b> a multiplier on your <b>best</b> artifact's value at game end (round up). After the 2× is claimed, up to two other players may each enter the room and take a 1.5× — one per player. For the artifact tiebreak, the higher <i>unmodified</i> value wins.</li>" +
      "<li><b>Imp Assistants</b> (Forbidden Library): on first entry you <b>must</b> take the top one (one per player). From then on, each Secret Tome you acquire (or card that “counts as a Secret Tome”) forces you to remove two cards of your choice from the Dungeon Row to the Dungeon discard pile (not trashed). At game end the Imp scores its shown value per Secret Tome you have.</li>" +
      "<li><b>Magic lyre:</b> a 16-point artifact chained in its room — only a player in its room can take it." + (c.has("lairs") ? " Lairs & Lost Chambers ARRIVE cards that return an artifact to the stack (e.g. Artifact Detector) and lost chambers that take an artifact from elsewhere can't affect it." : "") + "</li>" +
      "<li><b>Fate rooms:</b> the first time you enter <b>any</b> fate room, draw three <b>fate cards</b>, keep one and put the other two on the bottom of the fate deck (max one fate card per game; Gauntlets of Destiny allows a second). You may look at yours any time; keep it hidden until game end unless it says when to reveal it.</li>" +
      "<li><b>Harpies</b> (some are found outside the Underworld too): when a tile with a harpy room is discovered, put a harpy token from the Bank in it. Entering means fight (2 Swords) or take 1 damage (once — staying costs nothing more; you may fight it later that turn or on a later turn). If you can't voluntarily take the damage (no cubes in your supply, or it would fill your Health Meter), you can't enter. Defeating one: keep it as a <b>trophy</b> in your personal supply and take 1 undercoin per harpy trophy you have (including it). The <b>Harpy Matriarch</b> card also counts as a harpy trophy, but defeating it pays exactly 2 undercoins.</li>" +
      "<li><b>Underworld Prison</b> (front side of the Underworld starting tile): the first player to enter frees its Prisoner at once — no Lockpick needed.</li>" +
      "<li><b>Underworld markets:</b> only the five Underworld items can be bought there (and only there). Cards that grant market items another way (Golden Flute, Ogre Merchant) give Underworld items while you're in the Underworld, regular items otherwise.</li>" +
      "<li><b>Underground lakes:</b> on entry you <i>may</i> trash a card from your play area or discard pile (once each turn per lake room).</li>" +
      "<li><b>Towers:</b> start your turn in a tower room and you get 1 Boot.</li>" +
      "<li><b>More haunted tiles, same five Ghosts:</b> Underworld adds haunted Depths and Underworld tiles, but there are still only five Ghost cubes — if all five are already out of the Bank when you discover a haunted tile, you don't add another.</li>" +
      (c.mod("fixeddim") ? "<li><b>Fixed Dimensions:</b> the square tiles may not exceed the grid agreed at the start (5×5 or 6×6; the Underworld doesn't count); orient new tiles to respect it, even if every legal orientation causes damage.</li>" : "") +
      (c.has("lairs") ? "<li><b>With Lairs & Lost Chambers:</b> the Guardian marker + card count together as a <b>single trophy</b>, and harpies (tokens and the Harpy Matriarch) are trophies too; fate rooms are <b>lost chambers</b> (so Silver Arch, Swap Meet etc. affect them); the Guardian's room is <b>not</b> a lair.</li>" : "") + "</ul>",
    src: () => "Underworld p.2, p.8–10"
  },
  {
    title: "Mercy (variant)",
    when: (c) => c.mod("mercy"),
    html: () => "<ul><li><b>Mercy:</b> during your turn, if you're trapped (no room adjacent to yours and no way to place a new tile to escape), you may rotate your current tile to any orientation so you're no longer stuck.</li></ul>",
    src: () => "Underworld p.10"
  },
  {
    title: "Lairs & Lost Chambers",
    when: (c) => c.has("lairs"),
    html: () => "<ul><li><b>Trophies:</b> when you Fight a Monster or Use a Device that has TROPHY text, put that card face up in your personal supply (never your play area or discard pile). Its TROPHY text applies to you while it stays there, and its TROPHY points count at game end. The five lair monster markers are also trophies, worth <b>1 point</b> each. A Device with only TROPHY text still counts as “used” (for example, for the Tinkerer).</li>" +
      "<li><b>Entry tunnels:</b> a newly discovered tile with entry tunnels must be placed so you enter through one; afterwards they're normal tunnels.</li>" +
      "<li><b>Magic barriers:</b> you can't walk through with an artifact (teleporting is fine).</li>" +
      "<li><b>Free “acquire” effects</b> (Cavern Prowler, Pack Rat, Acrobatics…) can't be used on monsters (defeated, not acquired) or devices (used, not acquired).</li>" +
      "<li><b>Linked one-way tunnels:</b> the direction you enter from decides which of the pair you use. With the Catacombs Map major secret, you may choose either.</li>" +
      "<li><b>Pit traps:</b> the first time each turn you enter a Pit Trap room (each pit room checks separately), you must either:<ul><li><b>Fall in</b>: take 1 damage and spend no more Boots this turn (teleports still work).</li><li><b>Evade</b>: trash a non-Stumble card <b>from your hand</b>. If you can't Evade, you must Fall In. <i>(Tip: discover new tiles before playing out your hand.)</i></li></ul>If you can't voluntarily take damage (no cubes in your supply, or it would fill your Health Meter) and can't Evade, you can't enter the room.</li>" +
      "<li><b>Lost chambers</b> use the Wayshrine cube rules: be in the room, use an empty space, use a cube from your supply, and mark each room only once.<ul><li><b>Aegis Shrine</b>: while your cube is here, you may return it to your supply to prevent damage a Ghost would deal you. Visit again to place a new one.</li><li><b>Bizarre Bazaar</b>: four stalls, one cube each. Pay 3 Gold or trash a trophy:<ul><li>Mystic Stew: heal 3.</li><li>Magic Ointment: trash a card from your play area or discard pile and draw a card.</li><li>Display Case: from the Dungeon Row, acquire a card, use a device or defeat a monster for free.</li><li>Stolen Goods: take a Market item for free.</li></ul></li><li><b>Altar of the Haunted</b>: one space only. Trash a trophy and take 2 Gold; you may also take an artifact from any room (carry limit still applies).</li><li><b>Temple of Gold</b>: while in <i>any</i> Wayshrine, place a cube on a pillar and donate Gold:<ul><li>2: heal 1 + a Lockpick.</li><li>3: heal 2.</li><li>5: heal 1 + a random major secret.</li><li>8: heal 1, and you may take an artifact from any room.</li></ul>Each player may donate only once, and you needn't be able to take every reward.</li><li><b>Umbrok Vessna's Hoard</b>: no cubes. When you enter, take 5 Gold and make +2 Clank!. Taking its artifact or picking its chest teleports you at once to one of the tile's other two rooms.</li></ul></li>" +
      "<li><b>Lairs</b> (when a lair tile is placed, put its marker(s) from the Bank in the lair; each marker becomes a 1-point trophy):<ul><li><b>Living Statues</b>: three markers. While in the lair, fight one for <b>3 Swords</b>. After each kill you <i>must</i> teleport to another lair or lost chamber, if the dungeon has one.</li><li><b>Medusa</b>: when you enter, you must immediately fight her (<b>2 Swords</b>, and you must play a Secret Tome that turn) or turn to stone and take <b>2 damage</b>. You take no more damage for staying, and may fight her later that turn or on a later turn. Defeat: draw two cards. Her trophy also lets you ignore tunnel monsters. If you can't voluntarily take damage, you can't enter her lair.</li><li><b>Sphinx</b>: while in the lair, fight it with <b>4 Swords</b> <i>or</i> pay <b>7 Skill</b> to solve its riddle. Defeat: take <b>7 Gold</b>.</li></ul></li></ul>",
    src: () => "Lairs p.4–8"
  },
  {
    title: "Adventuring Party — 5–6 Players & Characters",
    when: (c) => c.p >= 5 || c.mod("chars"),
    html: (c) => "<ul>" +
      (c.p >= 5 ? "<li><b>Party in the Catacombs:</b> Artifact rooms with “+” icons hold <b>multiple Artifacts</b> (top of stack + one per “+”) instead of digging deeper; a player taking one takes the most valuable available. Gold versions are claimed before silver, and win scoring ties.</li>" +
        "<li>A <b>Backpack</b> never lets you take two Artifacts from the same room.</li>" +
        "<li>Wayshrines hold only <b>four cubes</b> — late arrivals can be shut out.</li>" +
        "<li>The <b>side board</b> carries the Dragon's <b>Rage Track</b> (the Dragon marker starts on its first space) and the Health Meters of the fifth and sixth players.</li>" +
        "<li>If the Ape Lord Phantasm is defeated, a Golden Monkey Bot prisoner can't be “returned” to the Monkey Shrine (it was never there).</li>" : "") +
      ((c.p >= 5 || c.mod("chars")) ? "<li><b>React</b> (Adventuring Party cards): when its condition occurs during an opponent's turn (or, for some cards, while the Dungeon Row is refilled between turns), you may play the card from your hand to your play area and immediately draw a replacement. Its resources and text wait until your next turn. You needn't React the moment the condition occurs. On your own turn a React card plays normally, without the extra draw. Always end your turn by drawing your next hand.</li>" : "") +
      (c.p >= 5 ? "<li><b>Arrive Choice:</b> every player chooses, starting with the player about to take their turn (or the current player, if it arrives mid-turn). If two options are offered, each player must pick one.</li>" : "") +
      (c.mod("chars") ? "<li><b>Characters</b> (any player count; play characters only against other characters; may mix with the Legacy Upper Management and “C” Team packs). Each takes a board, any special tokens, and a 10-card deck of 5 Burgle, 2 Stumble and three unique cards:<ul><li><b>Agnet</b>: 4 conscription tokens. When you acquire a companion, you may spend one (to the box) to put that card on top of your deck. Inspire can top-deck a companion at end of turn.</li><li><b>D'allan</b>: your first dragon egg, artifact, crown and monkey idol go on your board as “Finds”. Collection gives Gold. Competition/Exhibit give one Find reward:<ul><li>egg: −2 Clank!</li><li>idol: trash a Burgle</li><li>crown: no stopping in Crystal Caves this turn</li><li>artifact: may buy from the Market this turn</li></ul></li><li><b>Garignar</b>: the first Monster card you defeat each turn (even the Goblin; not tunnel monsters) advances his carnage token one space clockwise, and you take that space's reward.</li><li><b>Lenara</b>: Channel and Study earn mana (max 10 on the board). Each spell may be cast once per turn:<ul><li>Transfigure, 3 mana: discard then draw.</li><li>Duplicate, 5 mana: copy a card in your play area.</li><li>Levitate, 7 mana: acquire a card free into your hand.</li></ul></li><li><b>Whiskers</b>: Cattitude/Saunter flip a face-up behavior token (Skill, Sword or Boot) for its resource. If all three are face down when you end your turn, you must cause a Dragon Attack drawing exactly 4 cubes (ignore Rage and Danger); your own cubes return to your supply. Then draw your hand, flip all three face up, and refill the Row.</li><li><b>MonkeyBot Prime</b>: 7 cogwheels. Each Dragon Attack that damages you removes the leftmost one (only one per attack, not for other damage, never replaced). Every turn you gain all revealed Skill/Swords/Boots.</li></ul></li>" : "") +
      "</ul>",
    src: (c) => c.mod("chars") ? "Core p.15 · Adventuring Party p.2–7" : "Core p.15 · Adventuring Party p.2–4"
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
        "<p>One hard rule to respect: if you're knocked out while you're down in the <b>Depths</b>, or without an Artifact, you score <b>zero</b>. Escape artists beat corpses every time.</p>"
    },
    {
      h: "The shape of a turn",
      body: () => "<p>You hold five cards and <b>must play them all</b>, in any order. They produce three currencies: <b>Skill</b> buys new cards for your deck, <b>Swords</b> fight monsters, <b>Boots</b> move you through tunnels. Cards also make Gold (which you keep), draws — and Clank!. Use your Skill, Swords and Boots — any you don't spend this turn are wasted. Then discard, draw five, refill the card row — and if a new card shows the <b>Dragon Attack</b> symbol, the dragon strikes.</p>"
    },
    {
      h: "The dungeon builds itself",
      body: (c) => "<p>Unlike other Clank! games, there's no fixed map — the catacombs are a stack of <b>tiles</b>. Walk off the edge of the known dungeon and you flip the next tile and choose how to rotate it. Tunnels can demand extra Boots, bite you with <b>monsters</b> (a Sword each cancels a bite), or be <b>locked</b> — spend a Lockpick and it's open for everyone, forever. The first " + (c.has("uw") ? "three" : "four") + " tiles discovered are safe-ish; everything after — plus the top half of the starting tile — is the <b>Depths</b>, where being knocked out means scoring nothing.</p>" +
        "<p>Rooms are where the loot lives: Artifact rooms, Markets (7 Gold a purchase), <b>Chests, Libraries and Prisons</b> you crack with Lockpicks, Wayshrines to mark for Gold, monkey shrines, portals. Room rewards pay once per room each turn.</p>"
    },
    {
      h: "Clank! and the dragon — the heart of it",
      body: () => "<p>Whenever a card makes you add Clank! — like the Stumbles in your starting deck — cubes of your color go to the Clank! area. On a Dragon Attack, <b>everything</b> in that area goes into the bag with the black dragon cubes, and we draw as many as the <b>Rage Track</b> shows, plus one more for each <b>Danger</b> card in the Dungeon Row. Black cubes: nothing. Your cubes: damage on your health meter. Fill the meter and you're out. Every stolen Artifact enrages the dragon further — the endgame is a countdown of everyone's own making. The white <b>Ghost cubes</b> from haunted tiles hurt <i>everyone</i> when drawn.</p>" +
        "<p>So the real game is tempo: dive deep for the fat 20-point Artifact and risk the bag filling with your color, or snatch a cheap one and run. Once you escape (grabbing a 20-point <b>Mastery token</b> on the way out), your turns become extra bag-pulls that hurry everyone else.</p>"
    },
    { when: (c) => c.has("lairs"),
      h: "Lairs & Lost Chambers",
      body: () => "<p>Twelve stranger tiles are shuffled in. <b>Lost chambers</b> are one-of-a-kind rooms — a bazaar with four buyable boons, a temple that trades Gold donations for healing and secrets, a hoard that pays 5 Gold on entry but makes you +2 Clank!. <b>Lairs</b> hold boss monsters: Living Statues, Medusa (fight her — only on a turn you play a Secret Tome — or turn to stone for 2 damage), and the Sphinx, who falls to 4 Swords <i>or</i> 7 Skill. Beat them and keep them as <b>trophies</b> — a point apiece, and Medusa's lets you ignore tunnel monsters. Some new Monster and Device cards say <b>TROPHY</b> too — beat or use one and it goes face up in your supply, never your discard pile, and its TROPHY text works for you from then on. Watch for <b>pit traps</b> and <b>magic barriers</b> that stop artifact-carriers.</p>" },
    { when: (c) => c.has("uw"),
      h: "The Underworld",
      body: () => "<p>Below the Depths lies a second dungeon. Find a lettered <b>ladder</b> (or a one-way chute) to climb down. Down there the currency is <b>undercoins</b> — worth Gold, but also demanded as a <b>toll</b> every turn you start down there (can't pay? make +2 Clank!), and <b>toll-booth tunnels</b> cost 1 undercoin to pass — no Clank! option, though a teleport ignores them. The prizes are rich: the 16-point <b>magic lyre</b>, <b>fate cards</b> that quietly score at game end, <b>artifact enhancers</b> that multiply your best artifact — guarded by <b>Kerberos</b> himself and a flock of harpies. Getting out again is the trick: ladders only climb to Depths rooms that actually exist, chutes are down-only, and the <b>return portal</b> on the Underworld starting tile only leads out — to any other portal. Don't get knocked out down there — that's a zero.</p>" },
    { when: (c) => c.p >= 5,
      h: "Five or six thieves",
      body: () => "<p>With the Adventuring Party rules, artifact rooms with <b>“+” icons</b> hold <b>several artifacts</b> instead of one from deeper in the stack — each thief who takes one grabs the most valuable left (gold before silver at equal value; gold also wins ties), and even a Backpack never lets you take two from the same room. Wayshrines only fit four cubes, and the fifth and sixth players start with a little bonus Gold instead of extra quiet. Expect the card row to churn and the bag to fill fast — escape windows close early at this count.</p>" +
        "<p>Adventuring Party's cards bring two new terms. <b>React</b>: when a React card's condition happens on someone else's turn, you may flash it from your hand into your play area and draw a replacement right away — its resources and text wait for your next turn. <b>Arrive Choice</b>: when one of these hits the Dungeon Row, every player picks their option, starting with the player about to take their turn (or the current player, if it arrives mid-turn).</p>" },
    { when: (c) => c.mod("chars"),
      h: "Characters",
      body: (c) => "<p>Tonight everyone plays a unique <b>character</b> — your own board and a tweaked starting deck with three signature cards. Read your board and those three cards — that's your edge. Characters only face other characters, so nobody's on a plain deck.</p>" +
        (c.p >= 5 ? "" : "<p>Some character cards say <b>React</b>: when that condition happens on someone else's turn, you may play the card from your hand into your play area and draw a replacement right away — its resources and text wait for your next turn.</p>") },
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
        if (c.has("uw")) items.push("<li><b>Underworld tiles and rooms</b> — Underworld tiles go in with their short flat edge against the Underworld starting tile and can never be rotated; an <b>Imp Assistant</b> is mandatory the first time you enter its room (from then on, each Secret Tome you acquire makes you remove two Dungeon Row cards, and the Imp scores for each Tome you hold); <b>towers</b> give a Boot when you start your turn there, <b>underground lakes</b> let you trash a card, and Underworld markets sell only Underworld items.</li>");
        if (c.has("lairs")) items.push("<li><b>Each lost chamber's fine print</b> — read it when you're standing in it.</li>");
        items.push("<li><b>Exact end-of-turn order</b> — discard, draw, refill row, check for a dragon attack. It becomes automatic.</li>");
        return "<ul>" + items.join("") + "</ul>";
      }
    }
  ]
};
