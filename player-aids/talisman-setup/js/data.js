/* =============================================================================
   Talisman: The Magical Quest Game (Revised 4th Edition)
   Setup Utility & Reference — data layer
   -----------------------------------------------------------------------------
   All content is grounded in the official Revised 4th Edition rulebook, the
   published expansion rulesheets, and the official FAQ & Errata (v1.1).
   Where the FAQ or a later printing overrides an earlier rule, the current
   ruling is the one shown. Page citations refer to the relevant rulesheet.
   ============================================================================= */
const TAL = {};

/* ---- Content sources (base game + 16 expansions) -------------------------
   group: "board"  -> base game, the five corner/replacement boards + Dragon
   group: "small"  -> the card/figure expansions (no board of their own)
   cls is the colour class used for the source tag.                          */
TAL.sources = {
  base: { id:"base", group:"board", name:"Base Game", short:"Base", cls:"s-base", always:true,
    blurb:"Talisman Revised 4th Edition: the main board (Outer, Middle & Inner Regions), 104 Adventure Cards, 24 Spells, 14 characters and the Crown of Command endgame, for up to six players." },

  /* --- Board expansions ------------------------------------------------- */
  dragon: { id:"dragon", group:"board", name:"The Dragon", short:"Dragon", cls:"s-dragon",
    blurb:"Overlays the Inner Region with a double-sided Dragon Realm / Dragon Tower board. Adds three Dragon decks (Varthrax, Cadorus, Grilipus), Dragon Scale tokens and the Draconic Lords / Dragon King endgame, new characters and 3 Alternative Ending Cards. (No new Spell cards.)" },
  dungeon: { id:"dungeon", group:"board", name:"The Dungeon", short:"Dungeon", cls:"s-dungeon",
    blurb:"A corner board reached from the Ruins space. Adds the Dungeon deck, the Lord of Darkness and his Treasure Chamber — a route that can emerge a character directly onto the Crown of Command — plus Treasure Cards, new characters and spells. (No Alternative Ending Cards. Instead, its rulebook offers optional alternative rules agreed before play: Winner Takes All, where the first to kill the Lord of Darkness wins; Short Dungeon Game; Fight or Flight; and Random Treasures. See Dungeon p.11.)" },
  highland: { id:"highland", group:"board", name:"The Highland", short:"Highland", cls:"s-highland",
    blurb:"A corner board reached from the Crags space. Adds the Highland deck, the Eagle King at the Eyrie, Relic Cards, Trinkets, new characters, spells and 3 Alternative Ending Cards." },
  city: { id:"city", group:"board", name:"The City", short:"City", cls:"s-city",
    blurb:"A corner board reached from the City space. Adds the City deck and shop decks (Armoury, Magic Emporium, Potion, Pet, Stables, Wanted Poster), Trinkets, the Jail, bounties, Neutral Alignment Cards, new characters and 3 Alternative Ending Cards." },
  woodland: { id:"woodland", group:"board", name:"The Woodland", short:"Woodland", cls:"s-woodland",
    blurb:"A corner board reached from the Forest space. A linear path to the Meeting With Destiny. Adds Woodland, Path & Destiny decks, the Light/Dark Fate rules, Trinkets, new characters (with character tokens), spells and 3 Alternative Ending Cards. (Optional alternative rules, agreed before play — Woodland pp.14–15: Choose Your Destiny, where you may search the Destiny deck for the Destiny of your choice instead of taking the top card; Destiny Bound, which keeps the base fate rules (read 'light fate'/'dark fate' as 'fate') and has each character draw a starting Destiny Card to set lightbound/darkbound/unbound; and Fight or Flight, where you must always move clockwise in the Woodland unless a card or space says otherwise or you are fleeing — declared after rolling and before moving, after which you move counterclockwise until you leave the Woodland.)" },
  cataclysm: { id:"cataclysm", group:"board", name:"The Cataclysm", short:"Cataclysm", cls:"s-cataclysm",
    blurb:"REPLACES the main board with a post-apocalyptic world. Adds Denizen, Remnant, Talisman & Purchase decks, Terrain Cards, Trinkets, Warlock Quests, new characters and 4 Alternative Ending Cards — including 'The Eternal Crown', the default Cataclysm ending." },

  /* --- Small (card / figure) expansions --------------------------------- */
  reaper: { id:"reaper", group:"small", name:"The Reaper", short:"Reaper", cls:"s-reaper",
    blurb:"Adds the roaming Grim Reaper figure, the Warlock Quest deck, new Adventure & Spell cards and characters. (No Alternative Ending Cards.)" },
  frostmarch: { id:"frostmarch", group:"small", name:"The Frostmarch", short:"Frost", cls:"s-frost",
    blurb:"Adds new Adventure & Spell cards, Warlock Quest Cards, characters and 3 Alternative Ending Cards." },
  sacredpool: { id:"sacredpool", group:"small", name:"The Sacred Pool", short:"Pool", cls:"s-pool",
    blurb:"Adds Quest Reward Cards (rewards for completing Warlock Quests), a Stables deck, Neutral Alignment Cards, new Adventure & Spell cards, characters and 3 Alternative Ending Cards. (No board of its own.)" },
  bloodmoon: { id:"bloodmoon", group:"small", name:"Blood Moon", short:"Blood", cls:"s-blood",
    blurb:"Adds the Day/Night cycle (the Time Card), Lunar Events, the prowling Werewolf & Lycanthropy, new Adventure & Spell cards, characters and 3 Alternative Ending Cards." },
  firelands: { id:"firelands", group:"small", name:"The Firelands", short:"Fire", cls:"s-fire",
    blurb:"Adds new Adventure & Spell cards, Terrain Cards, Trinkets, Fireland tokens (Ifrit hazards), the Burn/fireproof mechanic and Noble Ifrit enemies, new characters and 3 Alternative Ending Cards. (No board of its own.)" },
  netherrealm: { id:"netherrealm", group:"small", name:"The Nether Realm", short:"Nether", cls:"s-nether",
    blurb:"Adds the 36-card Nether Deck and 3 Alternative Ending Cards. The Nether Deck supplies brutal encounters used together with this expansion's Alternative Endings — there are no new characters." },
  harbinger: { id:"harbinger", group:"small", name:"The Harbinger", short:"Harb", cls:"s-harb",
    blurb:"Adds the Harbinger figure & sheet and the Omen stack (an end-of-the-world doom timer), Harbinger Cards, Cursed-keyword Objects & Followers, Terrain Cards, new characters, spells and 2 Alternative Ending Cards." },
  deeprealms: { id:"deeprealms", group:"small", name:"The Deep Realms", short:"Deep", cls:"s-deep",
    blurb:"Adds two small Realms between the City and the Dungeon — the Rat Queen's Lair & Wraith Lord's Domain — with Bridge & Tunnel decks, Traps and the Escape/Press On rules. Requires The City and The Dungeon. (No new characters or Alternative Endings.)" },
  lostrealms: { id:"lostrealms", group:"small", name:"The Lost Realms", short:"Lost", cls:"s-lost",
    blurb:"A bundle of The Nether Realm (36-card Nether Deck + 3 Alternative Ending Cards) and The Deep Realms (the Rat Queen's Lair & Wraith Lord's Domain with Bridge & Tunnel decks), plus coloured base rings. The Deep Realms portion requires The City and The Dungeon." }
};
TAL.sourceOrder = ["base","dragon","dungeon","highland","city","woodland","cataclysm",
  "reaper","frostmarch","sacredpool","bloodmoon","firelands","netherrealm","harbinger","deeprealms","lostrealms"];
TAL.boardSources = ["dragon","dungeon","highland","city","woodland","cataclysm"];
TAL.smallSources = ["reaper","frostmarch","sacredpool","bloodmoon","firelands","netherrealm","harbinger","deeprealms","lostrealms"];

/* Corner boards that attach to the main board (Cataclysm replaces, Dragon swaps the Inner Region). */
TAL.cornerBoards = {
  dungeon:  { attach:"the Ruins space",  name:"Dungeon" },
  highland: { attach:"the Crags space",  name:"Highland" },
  city:     { attach:"the City space",   name:"City" },
  woodland: { attach:"the Forest space", name:"Woodland" }
};

/* Expansions that contribute Alternative Ending Cards to the shared pool.
   Verified against each expansion's printed component list. The Dungeon, the
   Reaper and the Deep Realms supply NO Alternative Ending Cards. */
TAL.altEndingSources = ["dragon","highland","city","woodland","cataclysm",
  "frostmarch","sacredpool","bloodmoon","firelands","netherrealm","harbinger","lostrealms"];

/* ---- Endgame options ------------------------------------------------------
   The configurator lets players steer how the game is won. "alt" is only
   selectable when an Alternative-Ending-providing expansion is on the table.  */
TAL.endings = [
  { id:"crown", name:"Crown of Command", sub:"Standard",
    desc:"The classic ending: reach the Crown of Command (only a character with a Talisman may enter the Valley of Fire on the way), then, while alone there, cast the Command Spell each turn to force every other character out of the game. (With the full Dragon expansion this becomes the Dragon King fight — Dragon p.14; on the Cataclysm board it is 'The Eternal Crown' card — Cataclysm pp.4, 6.)" },
  { id:"alt", name:"Alternative Ending", sub:"Draw one at random",
    desc:"One Alternative Ending Card is placed on the Crown of Command at setup, changing the win condition. Requires an expansion that supplies Alternative Ending Cards.",
    req: c => TAL.altEndingSources.some(s => c.has(s)) }
];

/* ---- Setup phases (ordered) ---------------------------------------------- */
TAL.phases = [
  "Boards & Regions",        // 0
  "Decks & Cards",           // 1
  "Tokens, Counters & Coins",// 2
  "Characters",              // 3
  "Endgame",                 // 4
  "Begin Play"               // 5
];

/* ---- Setup steps ----------------------------------------------------------
   Each step: { ph, src, t, d, page, order, when? }
   - ph    : phase index
   - src   : source id (drives the colour tag)
   - t     : short title
   - d     : detail (string or fn(c))
   - page  : citation
   - order : sort order within phase
   - when  : optional predicate fn(c) -> only shown when true
   c (context) exposes: has(id), p (players), ending, boardMode ("main"|"cataclysm"),
   corners (array of active corner board ids), altPool (array of AE sources), opt(id). */
TAL.setup = [
  /* ---------------- Phase 0 — Boards & Regions ---------------- */
  { ph:0, src:"base", order:10, t:"Place the main board",
    d: c => c.boardMode === "cataclysm"
      ? "The Cataclysm replaces the standard board — skip the base board and use the Cataclysm board instead (next step)."
      : "Unfold the main game board and place it in the centre of the playing area. It is divided into three Regions: Outer, Middle and Inner.",
    page:"Core, p.4 (Setup 1)",
    when: c => c.boardMode !== "cataclysm" },
  { ph:0, src:"cataclysm", order:11, t:"Replace the main board with the Cataclysm board",
    d:"Use the Cataclysm board in place of the base board. All base-board movement and encounter rules still apply, except for the Cataclysm's own rules (Denizens, Remnants, Talisman deck) and these changed Inner Region spaces (the Game Reference's Inner Region entries describe the base board): • Plain of Peril: you must end your move here, and if other characters are here you can't encounter the space; you must attack one of them in battle (the winner takes one life). • Lich: roll a die and lose that many lives, minus one for each Follower you choose to discard. • Frozen Spire: roll a die and either lose that many lives or stay and encounter it again next turn. • Mutant's Den: battle the Mutant, whose Strength is three dice rolled each encounter; you can't move on until you beat it. • Pits: battle the Snowbeast, whose Strength equals your own Strength including bonuses; you can't move on until you beat it.",
    page:"Cataclysm, pp.4–6 (Setup 1; A New World; The Inner Region)",
    when: c => c.has("cataclysm") },
  { ph:0, src:"dragon", order:20, t:"Place the Dragon board overlay",
    d:"Place the double-sided Dragon board overlay over the Inner Region. Choose a side — the Dragon Realm (recommended for a first game) or the Dragon Tower — and line up the Portal of Power doorways with the main board.",
    page:"Dragon, p.5 (Setup 1)",
    /* The full Dragon can't be combined with an Alternative Ending (Dragon p.15), and the
       Cataclysm board always has one on the Crown ('The Eternal Crown', Cataclysm pp.4, 6). */
    when: c => c.has("dragon") && c.ending !== "alt" && !c.has("cataclysm") },
  { ph:0, src:"dungeon", order:30, t:"Attach the Dungeon board",
    d:"Place the Dungeon corner board next to the main board; it connects at the main board's Ruins space (move from Ruins to the Dungeon Entrance to enter).",
    page:"Dungeon, p.4 (Setup 2)",
    when: c => c.has("dungeon") },
  { ph:0, src:"highland", order:31, t:"Attach the Highland board",
    d:"Place the Highland corner board next to the main board; it connects at the main board's Crags space (move from Crags to the Highland Entrance to enter).",
    page:"Highland, pp.4–5 (Setup 2; Entering the Highland)",
    when: c => c.has("highland") },
  { ph:0, src:"city", order:32, t:"Attach the City board",
    d:"Place the City corner board next to the main board; it connects at the main board's City space (move from the City space to the City Gate to enter).",
    page:"City, pp.4–5 (Setup 1; Entering the City Region)",
    when: c => c.has("city") },
  { ph:0, src:"woodland", order:33, t:"Attach the Woodland board",
    d:"Place the Woodland corner board next to the main board; it connects at the main board's Forest space (move from the Forest to the Woodland Entrance to enter — entering is optional). The Woodland is a linear path: its arrows point toward the Meeting with Destiny, and you may move with or against them but never across the path. You leave by reaching the Meeting with Destiny or by exiting through the Woodland Entrance (some encounters also move you out).",
    page:"Woodland, pp.4–5 (Setup 1; Entering, Movement & Leaving the Woodland)",
    when: c => c.has("woodland") },
  { ph:0, src:"deeprealms", order:40, t:"Place the Deep Realms between the City & Dungeon",
    d:"Place the Wraith Lord's Domain and Rat Queen's Lair Realm cards between the Dungeon and City boards. (The Deep Realms requires both The City and The Dungeon to be in play.)",
    page:"Deep Realms, p.2 · Lost Realms, p.2 (Setup 1)",
    when: c => c.has("deeprealms") || c.has("lostrealms") },

  /* ---------------- Phase 1 — Decks & Cards ---------------- */
  { ph:1, src:"base", order:10, t:"Form the Adventure deck",
    d: c => c.has("cataclysm")
      ? "Shuffle the Adventure Cards facedown beside the board. (With the Cataclysm board you also build Denizen, Talisman and Warlock Quest decks and seed Remnant Cards onto the board — see the Cataclysm steps below.)"
      : "Shuffle the 104 Adventure Cards and place them facedown beside the board to form the Adventure deck.",
    page:"Core, p.4 (Setup 2)" },
  { ph:1, src:"base", order:11, t:"Form the Spell deck",
    d:"Shuffle the 24 Spell Cards and place them facedown beside the board to form the Spell deck.",
    page:"Core, p.4 (Setup 3)" },
  { ph:1, src:"base", order:12, t:"Lay out Talisman & Purchase Cards",
    d: c => c.has("cataclysm")
      ? "Place the Purchase Cards faceup beside the board. (Under the Cataclysm, Talismans come from a dedicated Talisman deck instead — see below.)"
      : "Place the Talisman Cards and Purchase Cards faceup beside the board so all players can see what is available.",
    page:"Core, p.4 (Setup 4)" },
  /* shuffle-in steps for expansions that add to the base decks */
  { ph:1, src:"reaper", order:20, t:"Add the Reaper cards",
    d:"Shuffle the Reaper's new Character, Adventure & Spell Cards into the base decks. The Grim Reaper and Warlock Quest Cards are each optional: if used, place the Warlock Quest Cards facedown next to the board, and place the Grim Reaper Card next to the board with the Grim Reaper figure on the Portal of Power space.",
    page:"Reaper, p.1 (Setup)",
    when: c => c.has("reaper") },
  { ph:1, src:"frostmarch", order:21, t:"Add the Frostmarch cards",
    d:"Shuffle the Frostmarch Character, Adventure & Spell Cards into the base decks. If using its optional Warlock Quest Cards, shuffle the 24 quests into a facedown Warlock Quest deck by the board (combine with The Reaper's quests if both are used). Optional quest variants (agree before play): Starting Quests — after forming the quest deck, deal each player one Warlock Quest at random; Replacing Quests — a character who already has a quest and gets a chance to accept another may draw one, then discard either; Treasure Rewards (needs The Dungeon) — a completed quest still teleports you to the Warlock's Cave but may give one random Treasure Card instead of a Talisman.",
    page:"Frostmarch, p.1 · FAQ v1.1, p.9",
    when: c => c.has("frostmarch") },
  { ph:1, src:"sacredpool", order:22, t:"Add the Sacred Pool cards",
    d:"Shuffle the Sacred Pool Character, Adventure & Spell Cards into the base decks. Place the Stables deck faceup beside the board and add the Neutral Alignment Cards to the alignment cards. If using the optional Quest Rewards, shuffle the Quest Reward deck and place it facedown beside the board. (Sacred Pool has no Warlock Quest cards of its own.)",
    page:"Sacred Pool, pp.1–2",
    when: c => c.has("sacredpool") },
  { ph:1, src:"bloodmoon", order:24, t:"Set up the Day/Night cycle",
    d:"Shuffle the Blood Moon Character, Adventure & Spell Cards into the base decks (Lunar Events are part of those Adventure cards). Place the Time Card Day-side up, set the Werewolf figure on the Forest space with the Werewolf Card beside the board, and keep the 6 Lycanthrope Cards handy.",
    page:"Blood Moon, pp.1–3",
    when: c => c.has("bloodmoon") },
  { ph:1, src:"harbinger", order:25, t:"Prepare the Harbinger & Omen stack",
    d:"Add the Harbinger's characters to the pool and shuffle its Spell Cards into the Spell deck (it adds no new Adventure Cards); keep the 75 Harbinger Cards as their own deck (drawn instead when a board space tells a character in the Harbinger's Region to draw cards). Shuffle its Terrain Cards into the Terrain Card deck (form one if no other expansion provides it). Place the Harbinger figure on its sheet, then choose one Omen set, collect its 8 Omen cards and make a faceup stack (7th Omen on the bottom … Prophecy card on top) next to the sheet.",
    page:"Harbinger, pp.1–2",
    when: c => c.has("harbinger") },
  { ph:1, src:"netherrealm", order:26, t:"Set out the Nether Deck",
    d:"Shuffle the 36-card Nether Deck and place it facedown close to the board. It is only used if the Alternative Ending on the Crown is one of this expansion's three, whose text brings Nether Cards into play. Abilities and effects that apply to Adventure Cards apply to Nether Cards only after they have been drawn and placed on the board.",
    page:"Nether Realm, p.2 · Lost Realms, p.2",
    when: c => (c.has("netherrealm") || c.has("lostrealms")) && c.ending === "alt" },
  { ph:1, src:"deeprealms", order:45, t:"Set up the Deep Realms decks & loot",
    d:"After the Dungeon and City are set up: shuffle the Bridge deck and place it facedown between the Skull Passage and Rat Run spaces; shuffle the Tunnel deck and place it facedown next to the Realm cards. Set up the loot piles: 3 random Treasure cards faceup on the Throne Room, and 2 random Armoury cards plus 2 random Magic Emporium cards faceup on the Rat's Nest.",
    page:"Deep Realms, p.2 · Lost Realms, p.2 (Setup 2–4)",
    when: c => c.has("deeprealms") || c.has("lostrealms") },
  { ph:1, src:"firelands", order:28, t:"Set up the Firelands cards & tokens",
    d:"Shuffle the Firelands Character, Adventure & Spell Cards into the base decks. Shuffle its 19 Terrain Cards into the Terrain Card deck (form one beside the board if no other expansion provides it) and place the 34 fireland tokens in a supply. (When using this expansion, its Adventure Cards, Spell Cards, fireland tokens and Terrain Cards are all required components.)",
    page:"Firelands, pp.1–2",
    when: c => c.has("firelands") },
  /* board-expansion dedicated decks */
  { ph:1, src:"dungeon", order:40, t:"Form the Dungeon deck",
    d: c => "Shuffle the Dungeon Cards facedown beside the Dungeon board, and shuffle the Dungeon's new Character, Adventure & Spell Cards into the base decks. Leave the Treasure Cards in the game box until needed — they are won by defeating the Lord of Darkness in the Treasure Chamber." +
      ((c.has("deeprealms") || c.has("lostrealms")) ? " (The Deep Realms step below then takes 3 random Treasure Cards for the Throne Room, where the Wraith Lord guards them; " + [c.has("deeprealms") && "Deep Realms pp.2, 5", c.has("lostrealms") && "Lost Realms pp.2, 4"].filter(Boolean).join(" · ") + ".)" : ""),
    page:"Dungeon, p.4 (Setup 1–3)",
    when: c => c.has("dungeon") },
  { ph:1, src:"highland", order:41, t:"Form the Highland deck",
    d:"Shuffle the Highland Cards facedown beside the Highland board, and shuffle the Highland's new Character, Adventure & Spell Cards into the base decks. Leave the Relic Cards in the game box until needed. They are drawn at random as a reward for killing the Eagle King at the Eyrie, or from the Lost City space.",
    page:"Highland, pp.4, 8, 11 (Setup 1–3; Claiming Relics; Lost City Rewards)",
    when: c => c.has("highland") },
  { ph:1, src:"city", order:42, t:"Form the City & shop decks",
    d:"Shuffle the City deck facedown by the City board. Shuffle the Potion and Pet decks; place the Potion, Magic Emporium, Armoury, Pet and Stables decks facedown by their spaces. Shuffle the Wanted Poster deck, place it facedown, and draw 3 faceup onto the City Gate. Leave the Neutral Alignment Cards in the box until needed.",
    page:"City, p.4 (Setup 2–4)",
    when: c => c.has("city") },
  { ph:1, src:"woodland", order:43, t:"Form the Woodland, Path & Destiny decks",
    d:"Shuffle the Woodland deck and place it facedown next to the Woodland board. Shuffle the Path deck, place it facedown next to the Woodland board, and draw three Path Cards faceup beside it. Shuffle the Destiny deck and place it facedown next to the Woodland board. Shuffle the Woodland's 10 Adventure Cards into the Adventure deck and its 5 Spell Cards into the Spell deck (Adventure Cards with the Woodland Restriction Icon are encountered as normal while the board is in use).",
    page:"Woodland, pp.3–4 (Components; Setup 2–4; The Woodland Icon)",
    when: c => c.has("woodland") },
  { ph:1, src:"dragon", order:44, t:"Form the Dragon decks & Draconic Lords",
    d: c => ((c.ending === "alt" || c.boardMode === "cataclysm") ? "Optional: only if your table has agreed to use the Dragon Cards and Draconic Lords without the board overlay (Dragon, p.4). " : "") +
      "Shuffle the 3 Draconic Lord cards facedown, reveal one at random and place the Crown token on it (the starting Dragon King); flip the other two faceup. Put 5 life counters on each Draconic Lord card. Separate the Dragon Cards by colour into the Varthrax (red), Cadorus (gold) and Grilipus (green) decks, shuffle each, and place it facedown beside its matching Draconic Lord card.",
    page:"Dragon, p.5 (Setup 2–3)",
    when: c => c.has("dragon") },
  /* Cataclysm dedicated decks */
  { ph:1, src:"cataclysm", order:50, t:"Seed the Remnant Cards",
    d:"Shuffle the Remnant deck. On each space showing a Remnant symbol, place one facedown Remnant Card per symbol — the Ruins gets two cards. Then return the rest of the Remnant deck to the box. A facedown Remnant isn't an Adventure card and doesn't count toward the cards on its space. Whoever lands there flips it faceup before choosing to encounter the space or a character, and from then on it counts as an Adventure card. Discarded Remnants go to the Adventure discard pile and are shuffled into the Adventure deck with it; after the game, return them to the Remnant deck.",
    page:"Cataclysm, pp.4–5 (Setup 2; Remnant Cards)",
    when: c => c.has("cataclysm") },
  { ph:1, src:"cataclysm", order:51, t:"Set up the Denizen deck",
    d:"Shuffle the Denizen deck and place it facedown next to the board. Board spaces that say so (such as the City, Tavern and Chapel) and the 'Settlement' Terrain card have a character draw a Denizen, then visit one Denizen there.",
    page:"Cataclysm, pp.4–5 (Setup 3; Denizens)",
    when: c => c.has("cataclysm") },
  { ph:1, src:"cataclysm", order:52, t:"Set up the Talisman deck",
    d:"Shuffle the Talisman Cards together to form a Talisman deck and place it facedown next to the board. Gaining a Talisman now means drawing the top card. Discarded Talismans go to a Talisman discard pile; when the deck runs out, shuffle that pile to form a new Talisman deck.",
    page:"Cataclysm, pp.4, 7 (Setup 4; Talisman Cards)",
    when: c => c.has("cataclysm") },
  { ph:1, src:"cataclysm", order:53, t:"Set up the Warlock Quest deck",
    d:"Shuffle the Warlock Quest Cards to form the Warlock Quest deck and place it facedown next to the board.",
    page:"Cataclysm, p.4 (Setup 5)",
    when: c => c.has("cataclysm") },
  { ph:1, src:"cataclysm", order:54, t:"Set out the Terrain deck",
    d:"Keep the Cataclysm's 10 Terrain Cards beside the board as the Terrain deck. Effects that place a named Terrain type (e.g. the Arcane Construction Spell) take a card of that type from this deck, and a Terrain card that is replaced goes back to it.",
    page:"Cataclysm, pp.3, 6 (Components; Terrain Cards)",
    when: c => c.has("cataclysm") },

  /* ---------------- Phase 2 — Tokens, Counters & Coins ---------------- */
  { ph:2, src:"base", order:10, t:"Stockpile counters, fate & gold",
    d:"Sort the Strength (red), Craft (blue) and Life (green) counters, the Fate tokens and the Gold coins into stockpiles within reach of all players. (Large counters are worth 5, small worth 1.)",
    page:"Core, pp.3–4" },
  { ph:2, src:"base", order:11, t:"Keep Toad & Alignment Cards handy",
    d:"Set the 4 Toad Cards (with their figures) and the 4 Alignment Cards to one side, ready to use when a character is toaded or changes alignment.",
    page:"Core, p.4 (Setup 11)" },
  { ph:2, src:"woodland", order:20, t:"Use the Light/Dark Fate tokens",
    d:"Fate tokens are two-sided (gold = Light Fate, dark blue = Dark Fate). The Woodland's Light/Dark Fate rules replace the normal fate rules (unless your table agrees to the Destiny Bound alternative rule): Light Fate rerolls your own die; Dark Fate forces another character to reroll. Each character's starting fate may be set to either side.",
    page:"Woodland, pp.8, 14",
    when: c => c.has("woodland") },
  { ph:2, src:"dragon", order:21, t:"Make the Dragon token pool",
    d: c => ((c.ending === "alt" || c.boardMode === "cataclysm") ? "Optional: only if your table has agreed to use the Dragon tokens without the board overlay (Dragon, pp.4, 15). " : "") +
      "Place all Dragon Tokens (Scales, Strikes, Rages, Slumbers) facedown and randomize them into a pool (a box lid or bowl works). Each player draws one at the start of their turn. Place the Sleep tokens in a separate pool.",
    page:"Dragon, pp.5–6 (Setup 4–5; Drawing Dragon Tokens)",
    when: c => c.has("dragon") },
  { ph:2, src:"lostrealms", order:22, t:"Hand out the coloured base rings",
    d:"Optionally fit each character figure with one of the 6 coloured base rings to tell figures apart during play.",
    page:"Lost Realms, p.1",
    when: c => c.has("lostrealms") },

  /* ---------------- Phase 3 — Characters ---------------- */
  { ph:3, src:"base", order:10, t:"Deal characters",
    d: c => "Shuffle all character cards and deal one facedown to each of the " + c.p + " players. (Optional, if all agree: deal three each and let players choose one; return the rest.) Add any expansion characters to the pool before dealing.",
    page:"Core, p.4 (Setup 5)" },
  { ph:3, src:"base", order:11, t:"Take figure & starting stats",
    d:"Each player reveals their character, takes the matching figure, and takes Life counters equal to its Life value, Fate tokens equal to its Fate value, and 1 Gold. Place these next to the character card.",
    page:"Core, p.4 (Setup 6–8)" },
  { ph:3, src:"base", order:12, t:"Place figures on start spaces",
    d: c => c.has("cataclysm")
      ? "Place each figure on the start space listed at the bottom of its character card — on the Cataclysm board. (Whenever a new character is placed on the board later in the game, ignore any Terrain cards when placing it — Cataclysm p.6.)"
      : "Place each figure on the start space printed at the bottom of its character card (next to its alignment)." +
        ((c.has("firelands") || c.has("harbinger")) ? " (Whenever a new character is placed on the board later in the game, ignore any Terrain Cards when placing it — " + [c.has("firelands") && "Firelands p.2", c.has("harbinger") && "Harbinger p.2"].filter(Boolean).join(" · ") + ".)" : ""),
    page:"Core, pp.4, 7 (Setup 7; Start Space)" },
  { ph:3, src:"base", order:13, t:"Draw starting Spells",
    d:"Any character whose special ability starts the game with Spells draws that many Spell Cards now, kept secret from other players.",
    page:"Core, p.4 (Setup 9)" },
  { ph:3, src:"base", order:14, t:"Take starting Objects",
    d:"Any character who starts with Objects takes the designated Object Cards from the Purchase deck now.",
    page:"Core, p.4 (Setup 10)" },
  { ph:3, src:"woodland", order:19, t:"Take character tokens (Woodland)",
    d:"Any player using a Woodland character takes the specific tokens their special abilities require, as described on the character card; unused tokens go back in the box. If a character who uses tokens is killed, remove all of their tokens from the game.",
    page:"Woodland, pp.4, 13 (Setup 5; Character Tokens)",
    when: c => c.has("woodland") },

  /* ---------------- Phase 4 — Endgame ---------------- */
  { ph:4, src:"base", order:10, t:"Confirm the Crown of Command ending",
    d: c => {
      const easy = c.opt("easyCmd") && c.p >= 5;
      const miss = easy ? (c.p >= 6 ? "1" : "1–2") : "1–3";
      const hit  = easy ? (c.p >= 6 ? "2–6" : "3–6") : "4–6";
      return "The default victory condition stands: reach the Crown of Command, then cast the Command Spell to drive the other characters out of the game. The Crown is normally reached only from the Valley of Fire, which only a character with a Talisman may enter" +
        (c.has("dungeon") ? ". With The Dungeon there is a second route: beat the Lord of Darkness's attack score by 8 or more in the Treasure Chamber and you emerge directly on the Crown, with no Talisman needed (Dungeon pp.2, 8)." : ".") +
        " A character on the Crown does not move and cannot turn back. While two or more characters are on the Crown, their turns consist only of encountering one of the others. A character alone on the Crown must cast one Command Spell at all other characters on his turn: roll one die — " + miss + " has no effect; " + hit + " makes every other character lose one life" +
        (easy ? " (Easier Command Spell variant, Core p.21)" : "") +
        ". A character killed by the Command Spell loses the game and may not start another character, and once anyone has reached the Crown, any character who is killed is out of the game for the rest of the game." +
        (c.opt("sudden") ? " With Sudden Death, the first character to reach the Crown of Command simply wins (Core p.21)." : "");
    },
    page:"Core, p.20",
    when: c => c.ending === "crown" && !c.has("cataclysm") && !c.has("dragon") },
  { ph:4, src:"dragon", order:10, t:"Confirm the Dragon King ending",
    d:"With the Dragon overlay in play, the victory objective changes: journey through the Dragon Realm (or ascend the Dragon Tower) to the Crown of Command and confront the current Dragon King. On entering the Crown you immediately attack him, choosing Strength or Craft. Each time you defeat him, remove one of his lives (he starts with 5) and attack again. A stand-off or defeat ends your turn, and you must attack him at the start of your next turn; a defeat also costs you a life and inflicts his Dragon Rage. If you are killed and no other character is on the Crown, he heals all his lives. The Dragon King does not change while anyone is on the Crown. The character who removes his last life wins. Once anyone has reached the Crown and confronted him, any character who is killed loses the game.",
    page:"Dragon, pp.5, 14 (Setup 2; Confronting the Dragon King)",
    when: c => c.ending === "crown" && c.has("dragon") && !c.has("cataclysm") },
  { ph:4, src:"cataclysm", order:11, t:"Place 'The Eternal Crown' ending",
    d:"With the Cataclysm board, place the 'The Eternal Crown' Alternative Ending card on the Crown of Command — this is the default Cataclysm victory condition. A character alone on the Crown must cast the Command Spell at the start of each of his turns and roll one die: 1 — he loses 1 life; 2 — all characters lose 1 life; 3–5 — all other characters lose 1 life; 6 — all other characters with the lowest life are killed. If another character is on the Crown, he must encounter that character instead.",
    page:"Cataclysm, pp.4, 6 (Setup 6; Crown of Command)",
    when: c => c.has("cataclysm") && c.ending === "crown" },
  { ph:4, src:"base", order:13, t:"Choose an Alternative Ending",
    d: c => {
      const names = c.altPool.map(s => TAL.sources[s].name).join(", ");
      return "Gather the Alternative Ending Cards from " + (names || "your expansions") +
        " (minus any removed for your variant). Shuffle them, draw one at random and place it on the Crown of Command, faceup for revealed or facedown for hidden. It replaces the standard win condition. A character on the Crown must encounter the card and follow its text. Unless the card says otherwise, he cannot cast the Command Spell, cannot encounter other characters on the Crown, and cannot move off the Crown. Spells cannot affect the card or the Inner Region's creatures, and neither can be evaded. Once any character has reached the Crown, any character who is killed loses the game. Card instructions usually affect only characters on the Crown, but an instruction that starts with a ★ star icon affects every character in every Region. (Some cards need other expansions or components — check the card.)";
    },
    page:"Highland, p.9 · Woodland, p.12 · Cataclysm, p.7 (Alternative Ending Cards)",
    when: c => c.ending === "alt" },
  { ph:4, src:"base", order:12, t:"Pick revealed or hidden variant",
    d:"Before drawing, agree on a variant. Revealed: remove every Alternative Ending card with a hidden icon in its upper-left corner; the card will be placed faceup (more strategy). Hidden: remove every card with a revealed icon; the card will be placed facedown, and the first character to enter the Crown of Command turns it faceup.",
    page:"Highland, p.9 · City, p.9 · Cataclysm, p.7 (Alternative Ending Cards)",
    when: c => c.ending === "alt" },

  /* ---------------- Phase 5 — Begin Play ---------------- */
  { ph:5, src:"base", order:10, t:"Take the first turn",
    d:"The owner of the game takes the first turn; play then proceeds clockwise. On a turn: cast any Spells that must be cast before moving, roll one die and move (in the Inner Region, move one space instead — no roll), then encounter the space or one character there.",
    page:"Core, p.4 (Setup 12) · pp.8–9, 19, 24" }
];

/* ---- Setup callouts — configuration-specific reminders -------------------- */
TAL.setupCallouts = [
  /* The Valley of Fire still needs a Talisman with an Alternative Ending and on the Cataclysm board
     (Cataclysm pp.6–7: all other Inner Region rules still apply), so this note is always shown. */
  { src:"base", t:"You still need a Talisman",
    d: c => "A character may only enter the Valley of Fire — the last space before the Crown of Command — if they hold a Talisman (even just to encounter another character there). Without one they must turn back (Core p.20 · FAQ p.3). " +
      (c.has("cataclysm") ? "On the Cataclysm board, gaining a Talisman means drawing the top card of the facedown Talisman deck (Cataclysm p.7)." : "Talismans come from Adventure cards, the Temple (a roll of 10 — FAQ p.4) or a completed Warlock's Cave quest.") +
      (c.has("dungeon") ? " Exception: a character who emerges from the Dungeon's Treasure Chamber directly onto the Crown of Command doesn't need a Talisman (Dungeon p.8)." : "") },
  { src:"cataclysm", t:"Cataclysm changes how you draw", when: c => c.has("cataclysm"),
    d:"Spaces that used to have you roll on a table (City, Tavern, Chapel, etc.), and the 'Settlement' Terrain card, now have you draw a Denizen, add it to your space, then visit one Denizen there. After the visit it is discarded unless its trait names your space or says 'Any'. A Denizen with no trait is always discarded. Denizens aren't Adventure cards and don't count toward the cards on a space. A Denizen you can't resolve still counts as visited. If a card says to roll using another space's results (e.g. the Carnival → the Tavern), choose and visit a Denizen on that space instead; nothing happens if there is none. If a card sends you to a specific person (e.g. the Village Mystic), you may visit the Denizen of that name wherever it is. Cataclysm Adventure cards don't print how they leave the board: Events are discarded once resolved; Enemies stay until defeated; Strangers and Places stay after being encountered (unless stated); Objects and Followers stay until taken. Talismans come from the Talisman deck." },
  { src:"woodland", t:"Woodland uses Light & Dark Fate", when: c => c.has("woodland"),
    d:"The two-sided fate rules replace the normal fate rules for the whole game (Woodland p.8), unless your table agrees to the Destiny Bound alternative rule (Woodland p.14). Once per die roll, spend Light Fate to reroll a die your own character just rolled, or Dark Fate to make another character reroll a die they just rolled (movement, attack rolls, or rolls a card or space calls for). The roller gets the first chance to spend light fate. A die can be rerolled by fate only once, and only one die of a multi-die roll. Fate can never reroll a creature's attack roll or any other roll made for a creature. You choose which side faces up for your starting fate and whenever you gain or replenish fate, unless the effect names light or dark fate." },
  /* Tagged with the first Trinket source in play (the rule is printed in each of these books). */
  { src: c => ["highland","city","woodland","firelands","cataclysm"].find(id => c.has(id)), t:"Trinkets ignore the carrying limit", when: c => c.has("highland") || c.has("city") || c.has("woodland") || c.has("firelands") || c.has("cataclysm"),
    d:"Objects with the 'Trinket' keyword don't count toward your 4-Object carrying limit. They can still be ditched, stolen, sold or discarded like normal Objects. (Trinkets appear in the Highland, City, Woodland, Firelands and Cataclysm decks.) (Highland p.11 · City p.10 · Woodland p.13 · Firelands p.3 · Cataclysm p.7)" },
  { src:"dungeon", t:"Exploring the Dungeon", when: c => c.has("dungeon"),
    d: c => "Entering the Dungeon from the Ruins is optional. In the Dungeon Region you always draw Dungeon Cards instead of Adventure Cards (even when a card or ability says 'Adventure Cards'), and you move only directly with or directly against the arrows. Reaching the Treasure Chamber ends your move: fight the Lord of Darkness (Strength 12, Craft 12; you choose battle or psychic combat). He can't be evaded, and only characters may fight him (Followers, Spells and Objects can't fight in your place); if he defeats you, lose 1 life as normal. If you kill him, choose 1 Treasure Card from the Treasure deck, if any remain. Whatever the result, you then emerge: subtract his attack score from yours and use the chart on the Treasure Chamber space (use the '0' result if he scored higher, or if you killed him without an attack, e.g. with Finger of Death). Beat him by 8 or more and you emerge directly on the Crown of Command, with no Talisman needed. Apart from the Treasure Chamber, you leave the Dungeon only through an encounter that lets you, or out through the Dungeon Entrance to the Ruins (then continue clockwise or counterclockwise)" +
      ((c.has("deeprealms") || c.has("lostrealms")) ? "; with the Deep Realms, you can also move from an adjacent Dungeon space into the Wraith Lord's Domain (" + [c.has("deeprealms") && "Deep Realms p.3", c.has("lostrealms") && "Lost Realms p.3"].filter(Boolean).join(" · ") + ")" : "") +
      ". A Treasure Card that must be discarded is removed from the game. (Dungeon pp.4, 6–8, 10)" },
  { src:"highland", t:"Exploring the Highland", when: c => c.has("highland"),
    d:"Entering the Highland from the Crags is optional. In the Highland Region you always draw Highland Cards instead of Adventure Cards (even when a card or ability says 'Adventure Cards'), and you move only directly with or directly against the arrows. Reaching the Eyrie ends your move: fight the Eagle King (Strength 8, Craft 8; you choose battle or psychic combat). He can't be evaded, and only characters may fight him (Followers, Spells and Objects can't fight in your place); if he defeats you, lose 1 life as normal. If you kill him, draw 1 Relic Card at random (if any remain), then move to any space in the Outer or Middle Region and encounter that space or a character there. On a stand-off or a defeat, move to the Crags and end your turn. Apart from the Eyrie, you leave the Highland only through an encounter that lets you, or out through the Highland Entrance to the Crags (then continue clockwise or counterclockwise). Relics gained at the Lost City are also drawn at random. A Relic Card that must be discarded is removed from the game. (Highland pp.5, 8, 10–11)" },
  /* Terrain rules are printed (near-identically) in all three books; tagged with the first in play. */
  { src: c => ["cataclysm","firelands","harbinger"].find(id => c.has(id)), t:"Terrain cards", when: c => c.has("cataclysm") || c.has("firelands") || c.has("harbinger"),
    d: c => "While a Terrain card is on a space, ignore that space's name and text and use the card's. Effects that refer to the covered space (e.g. 'move to the Temple') are ignored. Terrain can't be placed in the Inner Region; ignore any effect that would place it where it can't go. It leaves only through effects that specifically remove Terrain. Placing Terrain on a space that already has Terrain returns the old card to the Terrain deck. If none of the required type is left in the deck, move one of that type from the board. Terrain on the Sentinel or Portal of Power: cross freely (no Sentinel, no lock, and the Warlock can't stop you over an unfinished quest). Terrain on a space that connects to an expansion board still lets you move to and from that board. On an expansion board's last space (e.g. the Treasure Chamber) you must stop and encounter the Terrain card. A new character placed on the board ignores Terrain." +
      (c.has("harbinger") ? " Random Terrain: shuffle the Terrain deck and draw the top card; if the deck is empty, move the Terrain card closest to you (your choice if tied) to your space." : "") +
      (c.has("city") ? " Terrain can't go on the City's Jail or Town Square." : "") +
      ((c.has("deeprealms") || c.has("lostrealms")) ? " Terrain can't go on Realm spaces." : "") +
      (c.has("cataclysm") ? " Placing or removing Terrain discards any Denizens on that space." : "") +
      " (" + [c.has("cataclysm") && "Cataclysm pp.6–7", c.has("firelands") && "Firelands p.2", c.has("harbinger") && "Harbinger p.2", c.has("deeprealms") && "Deep Realms p.5", c.has("lostrealms") && "Lost Realms p.4"].filter(Boolean).join(" · ") + ")" },
  { src:"firelands", t:"Fireland tokens & Burn", when: c => c.has("firelands"),
    d:"A character who ends his turn on a space with a fireland token loses 1 life. A space can hold only one fireland token, and none can be placed in the Inner Region. To burn a card is to remove it from the game (into the box); game effects don't interact with burnt cards unless they say so. Cards with the fireproof symbol can't be burnt. To burn cards from a deck, reveal that many from the top, set the fireproof ones aside, burn the rest, then shuffle the set-aside cards and put them back on top. Enemies with a Strength/Craft value may be fought in battle or psychic combat (your choice), and their trophies can be traded for Strength or Craft counters. (Firelands, p.2)" },
  { src:"dragon", t:"The Dragon changes how you win", when: c => c.has("dragon") && c.ending !== "alt" && !c.has("cataclysm"),
    d:"With the Dragon, victory means reaching the Crown of Command and vanquishing the current Dragon King (Dragon p.14). • Start of each turn you take (not a missed turn): draw one dragon token and resolve it. A scale goes on its matching Draconic Lord. On his third scale he is crowned Dragon King: the Crown token moves to him (unless a character is on the Crown of Command), you place one of his scales on your space (or the next space counterclockwise without one; if every space in the Region has one, discard it and suffer his Dragon Rage instead) and discard the other two. In the Inner Region all three are discarded. Dragon Strike: draw two more tokens. Dragon Rage: suffer the Dragon King's Rage: Varthrax, discard a Follower; Cadorus, an Object; Grilipus, a Spell; lose 1 life if you have none. Dragon Slumber: put a sleep token on any Dragon (or, if there are none on the board, any Enemy); a sleeping Enemy has −3 Strength and Craft (min 1). (Dragon pp.6, 8, 14–16) • Landing on a space with a dragon scale lets you encounter the scale instead of the space or a character there. Draw one Dragon Card of that Lord's colour, resolve it with any cards already on the space, and ignore the space's text. A scale matching the current Dragon King must be encountered. A scale matching the Dragon King on the Sentinel stops crossing into the Middle Region, and on the Portal of Power stops crossing into the Inner Region (crossing outward is still allowed). (Dragon p.10) • Kill an Enemy from a Dragon Card to claim the scale on your space. Each claimed scale adds 1 to your attack score against a matching Enemy or Draconic Lord, and you may discard one to cancel that Lord's Dragon Rage. Scales can't be ditched, stolen, sold or traded and pass to your next character. (Dragon p.11) Optional rules (everyone must agree before the game; Dragon pp.16–17): • Wrath of the Dragon King: when the current Dragon King is crowned again, before the character places his scale, every character on a space with a scale matching the Dragon King suffers his Dragon Rage, and all cards on those spaces are discarded (the scales stay). • Challenge for the Crown: place the Dragon Tower side next to the main board instead of over the Inner Region. A character who enters the main board's Crown of Command immediately moves to the Tower's Plain of Peril, and only the Tower's Crown of Command lets you confront and vanquish the Dragon King. Encounters that move you to an Inner Region space use the main board. The book recommends also using the Starting Bonus and Strength and Craft faster-play rules (main rulebook p.21). • Dragon Spawn: after setup, starting with the first player, each player reveals dragon tokens until a scale comes up and places it a die roll clockwise from their start space, then does the same counterclockwise (normal scale-placement rules). Any Strikes, Rages and Slumbers drawn are set aside faceup, then returned facedown to the pool and randomized." },
  { src:"bloodmoon", t:"Watch the clock", when: c => c.has("bloodmoon"),
    d: c => "The Time Card tracks Day and Night. Whenever a character draws one or more Events on his turn, flip it before he encounters any cards. A Lunar Event instead names the side to flip to (no flip if the card already shows that side) and stays in play beside the Time Card until the card next flips. By Day each creature subtracts 1 from its attack score in battle and psychic combat (minimum 1); at Night it adds 1. Many cards behave differently by phase. Werewolf: whoever rolls a 1 for movement finishes their turn, then rolls the die again and moves the Werewolf like a character. It may cross the Storm River freely at the Sentinel but never the Portal of Power, and at Night it must stop on the first space it enters that holds a character." +
      (c.corners && c.corners.length ? " It enters and leaves expansion boards like a character; if it reaches an expansion board's last space (e.g. the Treasure Chamber), the player moving it immediately moves it to any space outside the Inner Region, where it ends its move." : "") +
      " When it ends on a space with characters, the player who moved it picks one, who rolls on the Werewolf Card's chart; a 1 makes that character a lycanthrope. A character who already has a Lycanthrope Card does not take another, and Lycanthrope Cards only take effect at Night. Characters who land on the Werewolf's space do not encounter it. (Blood Moon pp.2–3)" },
  { src:"harbinger", t:"The Omen stack is a doom timer", when: c => c.has("harbinger"),
    d:"The Omen stack sits faceup: the top Omen's continuous effects are always in force. When an effect discards the top Omen, put it on the Omen discard pile and resolve any immediate effects of the newly revealed Omen; if no Omens remain, the game is over and every character loses. After a character outside the Inner Region draws an Event, move the Harbinger to that character's space; when an Omen is discarded, he returns to his sheet once the next Omen is resolved. When a board space tells a character in the Harbinger's Region to draw cards, he draws Harbinger Cards instead, and a character landing on the Harbinger's space must roll on his chart instead of encountering the space or another character. Harbinger Cards aren't Adventure Cards while being drawn (the Orb of Knowledge, the Prophetess's ability and similar effects can't affect them), but once placed faceup on a space they are treated as Adventure Cards. Enemies from the Harbinger deck must be taken as trophies when defeated in battle or psychic combat. Enemies with a Strength/Craft value may be fought in battle or psychic combat (your choice), and their trophies can be traded for Strength or Craft counters. (Harbinger, pp.1–2)" },
  { src:"reaper", t:"The Grim Reaper (if used)", when: c => c.has("reaper"),
    d:"He moves only when a player rolls a natural 1 on a single die for movement. A Riding Horse's two-dice total never counts. The Amazon moves him only if she uses the 1. A fate-token reroll counts only if the reroll is a 1. That player finishes the turn, then rolls again and moves the Reaper like a character. He may cross the Storm River at the Sentinel, or between the Temple and the Tavern, for one movement point. He never crosses the Portal of Power and can never teleport into the Inner Region. In the Dungeon, on reaching the Treasure Chamber he must move to any space outside the Inner Region, chosen by the player moving him. If his move is forgotten and the next player starts their turn, he does not move. When he ends on a space with characters, the player who moved him picks one, who rolls on the Grim Reaper Card's chart. Characters who land on his space do not encounter him, and no Spell, Adventure Card or special ability affects him. (Reaper p.2 · FAQ p.6)" },
  { src:"reaper", t:"Reaper Warlock Quest Cards (if used)", when: c => c.has("reaper") && !c.has("frostmarch") && !c.has("cataclysm"),
    d:"At the Warlock's Cave, choose any quest card still in the deck instead of rolling a die, and place it faceup in your play area. A completed quest is removed from the game; if a character with a quest card is killed, the card goes back to the deck. Only one quest at a time, and it must be completed as soon as possible. (Reaper p.2)" },
  { src:"deeprealms", t:"Inside the Deep Realms", when: c => c.has("deeprealms") || c.has("lostrealms"),
    d:"Entering a Realm (from an adjacent City or Dungeon space, following the arrows) ends your movement. Before each movement roll, choose to Escape (roll and move against the arrow into the adjacent Region) or Press On (no roll; follow your space's instructions). In a Realm you can't encounter other characters. Each Realm counts as a separate Region for the Command Spell and Spells. Traps can't be ignored or avoided unless an effect says it works against Traps. Terrain cards, Spell cards and tokens can't be placed on Realm spaces. Discarded Bridge and Tunnel cards are shuffled back into their decks. In the Rat Queen's Lair, each Enemy with 'Rat' in its title adds 1 to its Strength during battle; in the Wraith Lord's Domain, each Spirit adds 1 to its Craft during psychic combat. Rat's Nest: you can't take its Objects; instead you fight the Rat Queen in battle (Strength 3, +1 for each Object on the Rat's Nest). Throne Room: you can't take its Treasure cards; instead you fight the Wraith Lord in psychic combat (Craft 4, +1 for each Treasure card on the Throne Room). Neither can be evaded, and Followers, Spells or Objects can't fight in your place. If you defeat one, take one Object (Rat's Nest) or Treasure (Throne Room) of your choice from the space, then teleport to any space in the Outer Region. If the Rat Queen defeats you, you also ditch one of your Objects at random; if the Wraith Lord defeats you, you also lose 1 Craft and place one random card from the Treasure deck faceup on the Throne Room. After a stand-off or a defeat, move to Rat's Road in the City (Rat Queen) or the Hall of Darkness in the Dungeon (Wraith Lord) and end your turn. (Deep Realms, pp.3–5 · Lost Realms, pp.3–4)" },
  { src:"dragon", t:"The Dragon can't be combined with Alternative Endings", when: c => c.has("dragon") && (c.ending === "alt" || c.has("cataclysm")),
    d:"Players cannot play with The Dragon expansion in its entirety and Alternative Ending Cards at the same time — and on the Cataclysm board 'The Eternal Crown' is itself an Alternative Ending Card. Leave the Dragon board overlay and its Dragon King victory off the table. The Dragon's characters can still be used, and its Dragon Cards, Draconic Lord Cards and tokens are optional. If you do use them, these rules apply. At the start of each turn you take (not a missed turn), draw one dragon token and resolve it. A dragon scale goes on its matching Draconic Lord; on his third scale he is crowned Dragon King, and you place one of his scales on your space (or the next space counterclockwise without one; if every space in the Region has one, discard it and suffer his Dragon Rage instead) and discard the other two (in the Inner Region all three are discarded). Dragon Strike: draw two more tokens. Dragon Rage: suffer the current Dragon King's Rage (Varthrax, discard a Follower; Cadorus, an Object; Grilipus, a Spell; lose 1 life if you have none). Dragon Slumber: put a sleep token on any Dragon (or, if there are none on the board, any Enemy); a sleeping Enemy has −3 Strength and Craft (minimum 1). Landing on a space with a dragon scale lets you encounter the scale instead of the space or a character there: draw one Dragon Card of that Lord's colour, resolve it with any cards already on the space, and ignore the space's text. A scale matching the current Dragon King must be encountered, and on the Sentinel or the Portal of Power it stops characters crossing inward. Kill an Enemy from a Dragon Card to claim the scale on your space: each claimed scale adds 1 to your attack score against a matching Enemy or Draconic Lord, and you may discard one to cancel that Lord's Dragon Rage. (Dragon pp.4, 6, 8, 10–11, 15–16)" },
  { src:"deeprealms", t:"The Deep Realms need two other boards", when: c => (c.has("deeprealms") || c.has("lostrealms")) && (!c.has("city") || !c.has("dungeon")),
    d:"The Deep Realms (Rat Queen's Lair & Wraith Lord's Domain) sit between the City and the Dungeon and require both boards to be on the table. Add The City and The Dungeon, or these Realms have nothing to connect to." },
  { src:"netherrealm", t:"The Nether Deck needs an Alternative Ending", when: c => (c.has("netherrealm") || c.has("lostrealms")) && c.ending !== "alt",
    d:"The Nether Deck is only drawn from when one of the Nether Realm Alternative Endings is in play. Switch the Endgame above to 'Alternative Ending' to actually use it." },
  { src:"base", t:"Big tables run long", when: c => c.p >= 5,
    d:"The more players, the longer the game (the rulebook puts a game with more than six players at two to three hours, possibly longer). The faster-play variants above (easier Command Spell, faster Strength/Craft, Starting Bonus, Sudden Death, or Talisman Bloodbath) are especially recommended with five or more players — but agree on them before starting." }
];

/* =============================================================================
   GAME REFERENCE  (grounded in the Revised 4th Edition rulebook)
   ============================================================================= */
TAL.reference = {
  turn: { id:"ref-turn", title:"The Game Turn",
    intro:"On their turn, a character moves and then has one encounter. Play passes clockwise.",
    steps:[
      { h:"1 · Pre-move Spells", t:"Cast any Spells that must be cast before moving." },
      { h:"2 · Movement", t:"Roll one die and move that many spaces, clockwise or counter-clockwise (Outer & Middle Regions). You must always move the full count, even from a space with cards or characters, and you cannot reverse direction mid-move except on passing between the Outer and Middle Regions. The Inner Region is different: one space per turn, no die. Movement effects (FAQ): an 'instead of rolling the die for movement' effect works only when you would normally roll, so not in the Inner Region. An 'instead of moving normally' effect works whenever you can move. Characters on the Crown cannot use either." },
      { h:"3 · Encounter", t:"On the space you land on, encounter either one other character there or the space itself. If you encounter another character, first resolve any card on the space with no encounter number (e.g. the Hex Spell) (Core p.17). To encounter a space (FAQ order): (1) on a draw-cards space, draw up to the listed total; (2) resolve any cards with no encounter number (e.g. Hex Spell); (3) Events; (4) Enemies, lowest encounter number first. If any Enemy is not killed or evaded, your turn ends. (5) Visit Strangers; (6) take any gold, Followers and Objects; (7) visit Places; (8) on a space with no draw-cards instruction, now follow the space's instructions. If you are moved to another space during the encounter, start a new encounter there. If you were defeated in an attack and forced to move, your turn ends instead." },
      { h:"End", t:"Play passes to the player on the left." }
    ],
    flow:["Pre-move Spells","Move (1 die, either direction)","Land","Other character? → resolve no-number cards (e.g. Hex), then encounter one of them — or encounter the space","Draw-cards space? → draw to the listed total","Cards with no encounter number (e.g. Hex)","Events → Enemies by encounter number (any not killed/evaded = turn ends)","Strangers","Take gold, Followers & Objects","Places","No draw-cards instruction? → follow the space's instructions","Moved elsewhere? → new encounter there","Turn ends"] },

  regions: { id:"ref-regions", title:"Regions & Crossing",
    intro:"The board has three Regions. You cross between them only at specific places.",
    items:[
      { k:"Outer Region", t:"The ring around the outer edge of the board. Characters first adventure here and in the Middle Region to build up Strength, Craft and Lives." },
      { k:"Middle Region", t:"Separated from the Outer Region by the Storm River and from the Inner Region by the Plain of Peril." },
      { k:"Inner Region", t:"The deadly centre. Entered only through the Portal of Power; movement is one space per turn and there are no Adventure-Card draws — each space has fixed instructions." },
      { k:"Storm River (Outer↔Middle)", t:"Cross via the Sentinel bridge (Sentinel space ↔ Hills), by building/using a Raft, or by an encounter effect." },
      { k:"The Sentinel", t:"Attacks you every time you try to cross the bridge from the Outer to the Middle Region; your roll must be enough to carry you across. Defeat or evade it and you must carry on into the Middle Region for the rest of your roll; you may change direction on entering. Lose and you lose one life (an Object or Spell may save it), and your turn ends on the Sentinel space; a stand-off also ends your turn there. It does not attack characters crossing back, passing along the Outer Region, or ending their move on its space. A card on the space does not block crossing unless it says so (e.g. Barrier Spell, Cerberus), and you encounter it only if you end your move there (FAQ)." },
      { k:"Portal of Power (Middle↔Inner)", t:"Must be opened (per its instructions) to pass from the Middle to the Inner Region. You may try only if your move would carry you beyond it. Each passage needs a new attempt, and past success guarantees nothing. You cannot open it while you have an uncompleted Warlock quest. A card on the space does not block crossing unless it says so (FAQ). Returning outward needs no opening: moving from the Plain of Peril to the Portal of Power space is your whole move." },
      { k:"Crown of Command", t:"The last space, reached only from the Valley of Fire — which only a character holding a Talisman may enter." }
    ] },

  combat: { id:"ref-combat", title:"Attacks: Battle & Psychic Combat",
    intro:"Attacks split into battles (Strength) and psychic combats (Craft). Both resolve the same way.",
    steps:[
      { h:"1 · Evade", t:"Declare whether you evade (if able, e.g. via a Spell or ability). If not, combat takes place." },
      { h:"2 · Cast Spells", t:"Cast any Spells and apply any Strength/Craft modifiers before the attack roll." },
      { h:"3 · Attack rolls", t:"You roll one die; add it to your Strength (battle) or Craft (psychic) plus modifiers. Another player rolls one die for the creature and adds its value. After both rolls you may spend one Fate to reroll your own die, never the creature's. Against another character, both roll; the attacker decides on fate first, then the defender, and the attacker cannot change their mind afterwards." },
      { h:"4 · Compare scores", t:"Higher attack score wins: a beaten creature is killed; a beaten character loses one life (an Object, Spell or special ability may prevent this) and their turn ends. Equal scores = stand-off: nobody is harmed and the turn ends." }
    ],
    notes:[
      "Only one Weapon and one Armour may be used at a time in an attack.",
      "No Object can prevent the loss of a life in psychic combat.",
      "Multiple Strength-Enemies sharing an encounter number fight as one: add their Strengths with a single attack roll. A Spell or effect that targets one creature hits only one of them (you choose). An Enemy effect that causes a stand-off or automatic defeat applies to the whole fight (FAQ).",
      "In a stand-off the character leaves that space next turn without re-fighting what they fought (unless told otherwise).",
      "Character vs character: always a battle unless the attacker's ability allows psychic combat. The defender may evade first; both may cast Spells before rolling. The winner chooses one reward: force the loser to lose one life (a Spell may save it, or an Object in a battle), or take one Object or one gold. If that kills the loser, the winner may take any of their Objects, Followers and gold, and whatever is not taken stays on the space. The turn then ends.",
      "A card that fights in your place (e.g. Summon Stormcrow): if it wins, you get the normal rewards, including trophies, unless the card says otherwise. If it loses to a creature, you lose no life and suffer no other effects, but your turn still ends. If it loses to a character, the winner claims no reward, and if both sides use such cards, neither claims one (FAQ)."
    ] },

  stats: { id:"ref-stats", title:"Strength, Craft, Lives, Fate & Gold",
    intro:"A character card lists four values — Strength, Craft, Lives and Fate — plus special abilities; Gold is tracked beside it.",
    items:[
      { k:"Strength (red)", t:"Might in battle. Counters are gained only for points earned in play; Strength from Objects/Followers is added when used, not recorded. Can never drop below the printed value." },
      { k:"Craft (blue)", t:"Used in psychic combat and sets how many Spells you may hold. Same counter rules as Strength." },
      { k:"Lives (green)", t:"Durability. Lost through combat and hazards; healing can never exceed your Life value, but you may gain lives above it. Lose your last life and you are killed: your Objects, Followers and gold are left on your space, your Strength/Craft counters and fate go back to the stockpiles, and your Spells and trophies are discarded. On your next turn you start again with a random unused character (Setup steps 5–10), but only if no one has yet reached the Crown of Command." },
      { k:"Fate", t:"Once per die roll, spend a Fate token to reroll one die you just rolled for: your movement, your attack roll, or a card/space instruction. You must accept the reroll. You cannot reroll a creature's attack roll or another player's die. Replenish up to your value; gain above it. With The Woodland, its Light/Dark Fate rules replace these: Light Fate rerolls your own die, and Dark Fate forces another character to reroll one of theirs. Neither can reroll a creature's roll (Woodland p.8)." },
      { k:"Gold", t:"Buys Objects and services. Prices shown as 'G' (e.g. 3G). Not an Object — doesn't count toward the carrying limit." }
    ] },

  cards: { id:"ref-cards", title:"Adventure Cards & Carrying",
    intro:"Most spaces tell you to draw Adventure Cards (only enough to bring the space up to the number shown). Resolve them by encounter number, lowest first; ties go in the order drawn, except that Strength Enemies sharing a number fight as one (see Combat). Cards that move themselves to another space, and cards with no encounter number (e.g. the Hex Spell), are dealt with first.",
    items:[
      { k:"Events", t:"Follow the text. Losing a turn ends your turn immediately — that counts as your missed turn if other cards were still to be encountered; otherwise you miss your next turn. An Event lasting more than one turn stays on its space as a reminder and still counts as a card there; meeting it again doesn't reset it (FAQ p.1)." },
      { k:"Enemies (Strength)", t:"Animals, Monsters, Dragons — fought in battle. Kept as trophies when killed." },
      { k:"Enemies (Craft / Spirit)", t:"Engaged in psychic combat. Kept as trophies when killed." },
      { k:"Strangers", t:"Varied effects, sometimes based on your alignment." },
      { k:"Objects / Magic Objects / Followers", t:"Taken to your play area once every Enemy on the space has been killed or evaded (simply not attacking isn't evading — FAQ p.4). Max 4 Objects unless you have a Mule (excess is placed faceup on your space); a Raft counts as an Object until your next turn (FAQ p.5); expansion Trinkets don't count toward the limit. Followers are unlimited." },
      { k:"Places", t:"Follow the instructions; some are encountered every visit." },
      { k:"Trophies", t:"Turn in killed Enemies at end of turn: every 7 points of Strength → 1 Strength counter; every 7 points of Craft → 1 Craft counter. Excess over a multiple of 7 is lost." }
    ] },

  spells: { id:"ref-spells", title:"Spells",
    intro:"Anyone with enough Craft can cast Spells. Your Craft sets how many you may hold.",
    table:[ ["Craft","1","2","3","4","5","6+"], ["Max Spells","0","0","1","2","2","3"] ],
    notes:[
      "Spells are kept facedown (you may look at your own). Cast one only as stated on the card and only at a valid target (FAQ p.2); discard it once its effect ends. You can't discard Spells just to get rid of them — only when over your limit.",
      "Spells affecting characters work in any Region; Spells affecting creatures cannot affect creatures in the Inner Region.",
      "You may cast as many Spells on your turn as you held at the start of it, but only one Spell during another character's turn — except the Command Spell."
    ] },

  inner: { id:"ref-inner", title:"The Inner Region & Endgame",
    intro:"The centre is resolved by fixed space instructions — no Adventure draws, no evading creatures, no Spells against its creatures.",
    items:[
      { k:"Portal of Power", t:"Open it to enter; each attempt is separate. Succeed and your turn ends on the Plain of Peril; fail and it ends on the Portal of Power space." },
      { k:"Crypt / Mines", t:"Roll three dice and subtract your Strength (Crypt) or Craft (Mines) to find the exit tunnel you emerge from." },
      { k:"Werewolf Den", t:"When you land there, roll two dice for your Werewolf's Strength. That Werewolf keeps that Strength and battles you each turn until you defeat it (or turn back); each character faces a different Werewolf." },
      { k:"Pits", t:"Each time you land there, roll a die for the number of Pit Fiends and fight them one at a time (each is a separate battle) until you are defeated or beat them all; your turn then ends. If defeated, next turn fight the remaining Fiends or turn back. You move on the turn after the last one falls." },
      { k:"Valley of Fire → Crown", t:"Only a character with a Talisman may enter the Valley of Fire (even just to encounter another character there); otherwise turn back. The Crown can only be reached from the Valley of Fire." },
      { k:"Command Spell", t:"Alone on the Crown, on your turn you must cast the Command Spell: roll one die. 1–3 has no effect; 4–6 makes every other character lose one life. A character killed this way is out for good. Once anyone reaches the Crown, any character killed is out — even if a character later leaves the Crown. Any Craft can cast it, but a Toad cannot (FAQ p.3). If two or more characters are on the Crown, their turns consist only of encountering each other." },
      { k:"Other endings & the Cataclysm board", t:"With an Alternative Ending card on the Crown, characters there encounter that card and follow it; they cannot cast the Command Spell or encounter other characters there unless the card says so (Cataclysm p.7). With the full Dragon expansion, a character entering the Crown attacks the Dragon King instead; whoever removes his last life wins (Dragon p.14). On the Cataclysm board the default ending is The Eternal Crown (Cataclysm p.6): alone on the Crown, cast the Command Spell at the start of each of your turns and roll 1 die — 1: you lose 1 life; 2: all characters lose 1 life; 3–5: all other characters lose 1 life; 6: all other characters with the lowest life are killed. If another character is there, encounter them instead (Cataclysm p.4). The Cataclysm Inner Region also changes (Cataclysm p.6): you must end your move on the Plain of Peril, and if other characters are there you must attack one in battle (the winner takes one life). The Lich (where Death was): roll 1 die and lose that many lives, less 1 for each Follower you discard. Frozen Spire: roll 1 die and lose that many lives, or stay and encounter it again next turn. Mutant's Den: roll 3 dice for its Strength each time it is encountered. Pits: a Snowbeast whose Strength equals yours, including bonuses. You can't move on from the Mutant's Den or the Pits until you defeat it." }
    ] },

  golden: { id:"ref-golden", title:"Golden Rules & Key Clarifications",
    intro:"The first four are Talisman's Golden Rules, which supersede all other rules; the last two are key clarifications.",
    items:[
      { k:"Special ability beats the rules", t:"If a special ability or effect conflicts with a basic rule, the ability/effect wins." },
      { k:"Cannot beats can", t:"If a card says a character cannot do something, that prohibition overrides any ability that would allow it." },
      { k:"Natural vs modified roll", t:"When an effect cares about a die result, only the unmodified number on the die counts." },
      { k:"Limited resources", t:"Components are finite — if a counter type runs out, none can be gained until some are returned; you must trade five 1-point counters for a 5-point counter whenever you can." },
      { k:"Toads", t:"A toaded character has Strength 1 / Craft 1, no special abilities, can neither gain nor cast Spells (but keeps its Spell Cards), moves one space per turn, keeps its lives, fate and trophies, and reverts after three turns." },
      { k:"Alignment", t:"Good, Neutral or Evil. You may change alignment at most once per turn; ditch any cards your new alignment forbids." }
    ] },

  faster: { id:"ref-faster", title:"Faster-Play Variants",
    intro:"Optional rules — agree on them before starting. Most shorten the game (especially recommended at 5+ players); Inherited Items and Evading Unfriendly Individuals are general alternative rules.",
    items:[
      { k:"Easier Command Spell", t:"The Command Spell triggers on more results: 5 players → 3–6; 6 players → 2–6; 7+ players → automatic." },
      { k:"Faster Strength/Craft", t:"Lower the trophy threshold for a counter from 7 to 6 (or 5) points." },
      { k:"Starting Bonus", t:"Each character takes one extra Strength or Craft (their choice) at the start." },
      { k:"Talisman Bloodbath", t:"Remove three Talisman Cards (use only one); a killed character is out of the game — short but very bloody." },
      { k:"Sudden Death", t:"The first character to reach the Crown of Command wins. Or agree a stop time, then total each character's Strength and Craft counters plus gold, Spells, Followers, Objects and Magic Objects held beyond what it started with — highest total wins." },
      { k:"Inherited Items", t:"When a character is killed, set aside its Objects (including Magic Objects), gold and Followers, and return its Spells, trophies, fate, other cards and counters. The player's new character inherits the set-aside items; anything it doesn't take goes on its start space. A character who kills another may not take the victim's Objects, gold or Followers (Core p.21)." },
      { k:"Evading Unfriendly Individuals", t:"Characters may also evade any unfriendly individual on a card or space they don't wish to encounter (e.g. the Black Knight, Hag or Witch), as the table decides — but never a space in the Inner Region (e.g. the Vampire's Tower, Werewolf Den, Death or Pits) (Core p.20)." }
    ] }
};

/* ---- FAQ / rules clarifications (grounded in the rulebook & FAQ) ---------- */
TAL.faq = [
  { q:"Can I spend Fate to reroll a monster's attack roll?",
    a:"No. Fate may only reroll a die you just rolled — your movement, your own attack roll, or a card/board instruction. You can never reroll a creature's attack roll, and never another player's die (in the base rules)." },
  { q:"What happens on a tie in combat?",
    a:"A stand-off: neither side loses a life. The turn ends immediately, and on your next turn you leave that space without re-fighting what you fought (unless told otherwise)." },
  { q:"How many Weapons or Armour can I use in one attack?",
    a:"Only one Weapon and one Armour per attack, even if you hold several — unless a special ability says otherwise (the Warrior, for example, may use two Weapons at once). But if a card says no Weapons can be used, even the Warrior can't use any: 'cannot' beats 'can'." },
  { q:"Can an Object save me in psychic combat?",
    a:"No. Objects can prevent a life loss in a battle (Strength), but no Object can prevent the loss of a life in psychic combat (Craft)." },
  { q:"How many Spells can I hold?",
    a:"By Craft: 1–2 Craft = 0, 3 Craft = 1, 4–5 Craft = 2, 6+ Craft = 3. If your Craft drops and you now hold too many, immediately discard down to the limit." },
  { q:"Do I have to move on my turn? Can I reverse direction mid-move?",
    a:"You must always move and must move the full die roll. You choose clockwise or counter-clockwise, but may not reverse during a single move — except you may change direction when passing between Regions." },
  { q:"Do I need a Talisman to win the standard game?",
    a:"Yes, normally. The Crown of Command can only be reached from the Valley of Fire, and only a character with a Talisman may enter the Valley of Fire (even just to encounter another character there); otherwise you must turn back. Talismans come from the Adventure deck or a Warlock's Cave quest (Core p.16), and a roll of 10 at the Temple also offers one (FAQ p.4). With the Cataclysm, any Talisman you gain is drawn from its Talisman deck (Cataclysm p.7). Exceptions: a character who emerges onto the Crown from the Dungeon's Treasure Chamber needs no Talisman (Dungeon p.8), and the Transference Spell can swap you with a character on the Crown without one, though not with one in the Valley of Fire (FAQ p.8)." },
  { q:"How does the Command Spell actually remove players?",
    a:"Alone on the Crown, on your turn you cast it and roll one die: 1–3 nothing; 4–6 every other character loses one life. A character killed by the Command Spell is out of the game and may not start a new character. Faster-play variants widen the triggering range. (On the Cataclysm board The Eternal Crown's chart replaces this roll; with any other Alternative Ending on the Crown you follow the card instead; with the full Dragon you fight the Dragon King.)" },
  { q:"Once someone reaches the Crown, what changes?",
    a:"From that moment, any character that is killed is out of the game for good — this stays in effect for the rest of the game even if a character later leaves the Crown of Command." },
  { q:"Can I evade creatures in the Inner Region?",
    a:"No. None of the Inner Region's creatures can be evaded or affected by Spells — only other characters can be evaded there. (You may only encounter another character on the Plain of Peril, Valley of Fire and Crown of Command.)" },
  { q:"How do trophies convert to counters?",
    a:"At the end of your turn, total the Strength of killed Enemies you turn in: every full 7 points = 1 Strength counter (excess is lost). Craft trophies work the same for Craft counters. Strength and Craft trophies are tallied separately." },
  { q:"With the Woodland out, whose fate rules apply?",
    a:"The Light/Dark Fate rules replace the normal fate rules for the whole game. Light Fate rerolls your own die; Dark Fate forces an opponent to reroll one of theirs. You still can't reroll a creature's attack roll." }
];

/* ---- TEACHING SCRIPT (read aloud, ~5 min; content per the Revised 4th Ed.
   rulebook and expansion rulebooks — see the setup citations above) ---------- */
TAL.teach = {
  intro: "Read this aloud — about five minutes.",
  sections: [
    { h: "The pitch — and how you win", body: (c) => {
      const alt = c.ending && c.ending !== "crown";
      const cat = c.boardMode === "cataclysm";
      const dk = c.has("dragon") && !alt && !cat;   // full Dragon: overlay + Dragon King victory
      const sd = !alt && !dk && c.opt("sudden");      // Sudden Death variant (Core p.21)
      const goal = alt ? " to whatever ending fate has dealt us this game (it may stay hidden until someone arrives)"
        : dk ? " to the Crown, where you must fight the current Dragon King — whoever takes his last life wins"
        : sd ? " to the Crown — with Sudden Death, the first to reach it wins outright"
        : cat ? " to the Crown, where 'The Eternal Crown' makes you cast a riskier Command Spell each turn (a bad roll can cost you a life too) to strike down every rival until you alone remain"
        : " to the Crown, where the Command Spell lets you strike down every rival until you alone remain";
      return `
<p>We are adventurers in ${cat ? "the shattered, post-Cataclysm land of Talisman — the familiar board is gone, replaced by a wasteland of ruins and scavenged remnants" : "the land of Talisman"}, and the prize is the <b>Crown of Command</b> at the center of the board. The land is three rings: grow strong in the <b>Outer Region</b>, brave the <b>Middle</b>, then pass the <b>Portal of Power</b> and fight through the <b>Inner Region</b>${dk ? "" : " — carrying a <b>Talisman</b>, because nobody without one may enter the Valley of Fire just before the Crown —"}${goal}.</p>
<p>${sd ? "This is a pure race: the first adventurer to reach the Crown of Command wins." : dk ? "This is a race with fangs: whoever takes the Dragon King's last life wins." : alt ? "This is a race with fangs: the ending card on the Crown says how the game is won — some reward the first to meet its condition, some the last adventurer alive." : "This is a race with fangs: the last adventurer standing wins."}</p>`;
    }},

    { h: "Your turn — roll, land, resolve", body: (c) => {
      const dk = c.has("dragon") && !(c.ending && c.ending !== "crown") && c.boardMode !== "cataclysm";
      return `
<p>Roll a die, move <b>exactly</b> that many spaces, clockwise or anti — your only real decision is which of two landing spots serves you.${dk ? " (Once you're through the Portal of Power there's no die: on the Dragon Realm side you move one space per turn and must complete each space before moving on; on the Dragon Tower side you draw the Dragon Cards your space shows at the start of your turn, then move one space plus one for each Enemy you killed. Either way, its creatures can't be evaded or hit with Spells.)" : " (Once you're through the Portal of Power there's no die: in the Inner Region you move one space per turn, must complete each space before moving on, and its creatures can't be evaded or hit with Spells.)"} Then <b>encounter your space</b>: draw Adventure cards if it tells you to, fight what's there, or use the space's own text. Or — if another adventurer stands there — <b>attack them</b> instead: the winner makes the loser lose a life or takes one of their Objects or a gold.</p>`;
    }},

    { h: "Strength, Craft & Lives", body: (c) => `
<p>Two stats rule everything: <b>Strength</b> for battles against monsters and rivals, <b>Craft</b> for psychic combat against spirits. Combat is simple: both sides roll a die, add their stat, high total wins — beat a creature and it dies (keep it as a trophy); lose and you drop a <b>Life</b>; a tie is a stand-off. Kill enough enemies and their trophies buy stat points; some spaces train you outright. <b>Gold</b> buys gear, <b>Followers</b> tag along with bonuses, your Craft sets how many <b>Spells</b> you can hold, and <b>fate tokens</b> reroll your own dice — the 4th Edition's mercy rule. ${c.opt("bloodbath") ? "Run out of lives and your character is killed — and with Talisman Bloodbath you're out of the game for good." : "Run out of lives and your character is killed: you start a fresh one on your next turn — but once anyone has reached the Crown of Command, death is final."}</p>` },

    { h: "The long game", body: (c) => `
<p>Don't sprint. The Inner Region murders the unprepared — the classic arc is: loot the Outer ring until your stats embarrass the Middle ring, find your <b>Talisman</b> (quests and luck), then commit. Every character breaks the rules their own way; read your sheet aloud when we start.</p>` },

    { h: "The Cataclysm board", when: (c) => c.has("cataclysm"), body: () => `
<p>Spaces that used to have you roll on a table — the City, Tavern, Chapel and others — now have you draw a <b>Denizen</b>, add it to the space, then visit one Denizen there (often a die roll on its card); a Denizen whose card names the space you're on, or says "Any", stays for the next visitor, and the rest are discarded after a visit. Facedown <b>Remnant</b> cards were seeded on marked spaces at setup: land on one and you flip it faceup before choosing what to encounter, and from then on it counts as an Adventure card.</p>` },

    { h: (c) => (c.ending === "alt" || c.boardMode === "cataclysm") ? "The Dragon (in part)" : "The Dragon Realm",
      when: (c) => c.has("dragon"), body: (c) => (c.ending === "alt" || c.boardMode === "cataclysm") ? `
<p>The <b>Dragon expansion</b> is only partly in play: an Alternative Ending sits on the Crown, and the full Dragon can't be combined with one — so there's no Dragon board overlay and no Dragon King fight. Its new characters are in the pool (and its Dragon Cards, Draconic Lords and tokens only if we've chosen to use them).</p>` : `
<p>The <b>Dragon expansion</b> has overlaid the Inner Region. Three <b>Draconic Lords</b> (Varthrax, Cadorus and Grilipus) vie to be <b>Dragon King</b>. At the start of every turn you draw a dragon token. Most are scales that pile onto the matching Lord. When one collects his third, he takes the Crown token and you put one of his scales on your own space. The rest are nasty: a Strike makes you draw two more, a Rage makes you suffer the Dragon King's rage (discard a Follower, an Object or a Spell depending on who's king, or lose a life if you have none), and a Slumber lets you put a dragon to sleep. Land on a scale and you may draw one of that Lord's Dragon Cards instead of using the space. You <b>must</b> if it matches the current Dragon King. Kill an Enemy from a Dragon Card to claim the scale: each one adds 1 to your attack against that Lord's creatures and the Lord himself, or you can discard it to cancel his rage. The endgame is a boss fight: reach the Crown and attack the Dragon King until someone takes his last life.</p>` },

    { h: "This table's boards", when: (c) => c.corners && c.corners.length, body: (c) => {
      const names = { dungeon: "<b>the Dungeon</b> (enter at the Ruins — a treasure-crawl that can drop you shockingly close to the Crown)", highland: "<b>the Highland</b> (enter at the Crags — the Eagle King guards real rewards)", city: "<b>the City</b> (enter at the City — shops, stables, and honest work)", woodland: "<b>the Woodland</b> (enter at the Forest — a path of destiny with fae prices)" };
      return `<p>Corner realms are open this game: ${c.corners.map(x => names[x] || x).join("; ")}. Each is a detour with its own deck — riskier than the main road, and usually worth it.</p>`;
    }},

    { h: "The City", when: (c) => c.has("city"), body: () => `
<p>The City's streets are one-way — follow the arrows. The shops around its edge include the Armoury, Magic Emporium, Apothecary, Menagerie and Stables, which sell from their own decks. Stepping into any shop costs a point of movement and ends your move, and once inside you must encounter the shop or a character there. You leave through the City Gate or by visiting the Wharf (or when a City encounter sends you out). At the City Gate you can either claim the bounty on a <b>Wanted Poster</b> lying there, or buy posters for one gold each to keep. An Enemy-type poster pays gold equal to the Strength or Craft of the matching trophies you discard. An alignment poster you own pays a die roll of gold when you defeat a character of that alignment in battle or psychic combat. Two posters naming the same target pay only one bounty. Some encounters throw you in the <b>Jail</b> — your turn ends, and instead of moving you roll on the Jail's chart each turn until you get out.</p>` },

    { h: "The Woodland", when: (c) => c.has("woodland"), body: () => `
<p>The Woodland is one long trail from the Forest to the <b>Meeting with Destiny</b>. Its arrows point toward the Meeting with Destiny, but you may move with or against them, never across the path. When you enter, you must take one of the three faceup <b>Path</b> cards when your move ends. You must always follow its Travel effect, and you discard it if you leave the Region. Reach the Meeting with Destiny and your move ends there. Resolve your Path's Destiny effect, which can bind you to a <b>Destiny</b> card that passes to your next character if you die. Then discard the Path, and if you're still on that space, move out to the Forest.</p><p>Fate is two-sided for the whole game. Spend <b>light fate</b> to reroll a die you just rolled, or <b>dark fate</b> to make another character reroll one they just rolled. Some cards carry a lightbound and a darkbound effect. With more light than dark fate you use the lightbound one; with more dark, the darkbound one. With equal amounts you ignore both. With no fate at all, you must resolve the lower effect on cards you encounter.</p>` },

    { h: "The Deep Realms", when: (c) => c.has("deeprealms") || c.has("lostrealms"), body: (c) => `
<p>Between the City and the Dungeon lie the <b>Deep Realms</b> — the Rat Queen's Lair and the Wraith Lord's Domain, linked by a rickety bridge, with tunnels leading down to each ruler's hoard and their own Bridge and Tunnel decks (watch for Traps). Inside, before each move you choose to <b>Escape</b> (roll and move back out against the arrow) or <b>Press On</b> (no die — follow your space's instructions). Beat the Rat Queen or the Wraith Lord to grab loot and teleport to any Outer Region space${(c.has("netherrealm") || c.has("lostrealms")) && c.ending === "alt" ? "; and if the ending on the Crown turns out to be one of the Nether Realm's, its brutal <b>Nether Deck</b> comes into play as that card directs" : ""}.${c.has("lostrealms") ? " The Lost Realms' coloured <b>base rings</b> just fit around our figures' bases to make them easier to tell apart." : ""}</p>` },

    { h: "Extra rules in play", when: (c) => c.has("reaper") || c.has("bloodmoon") || c.has("harbinger") || c.has("firelands"), body: (c) => {
      const bits = [];
      if (c.has("reaper")) bits.push("the <b>Grim Reaper</b>, if we're using him, stalks the board — whoever rolls a 1 for movement moves him after their turn, and when he ends on your space you may be picked to roll on his chart, which can help you or kill you");
      if (c.has("bloodmoon")) bits.push("<b>day and night</b> alternate: the Time Card flips whenever someone draws an Event, and every creature's attack score is 1 lower by Day (never below 1) and 1 higher at Night; and the <b>Werewolf</b> prowls. Roll a 1 for movement and, after your turn, you roll again and move it like a character. At Night it stops on the first space with a character, and when it ends on characters the player who moved it picks one to roll on its chart, where a 1 makes them a <b>lycanthrope</b> whose card only bites at Night");
      if (c.has("harbinger")) bits.push("the <b>Harbinger</b> jumps to anyone outside the Inner Region who draws an Event, and landing on him means rolling on his chart — his faceup <b>Omen stack</b> is a doom clock: the top Omen's effect is always in force, and if the last Omen is discarded the world ends and we all lose");
      if (c.has("firelands")) bits.push("the <b>Firelands</b> burn: end your turn on a space with a fireland token and you lose a life, a <b>burnt</b> card leaves the game for good (only cards with the fireproof symbol can't be burnt), and Enemies with a <b>Strength/Craft</b> value let you choose battle or psychic combat");
      const cursed = c.has("harbinger") ? " Watch for <b>Cursed</b> Objects and Followers: you must take one when you encounter it — even past your carrying limit — and you can never ditch it, though it can still be discarded, stolen or sold." : "";
      return `<p>Also: ${bits.join("; ")}.${cursed}</p>`;
    }},

    { h: "Terrain cards", when: (c) => c.has("cataclysm") || c.has("firelands") || c.has("harbinger"), body: () => `
<p>Some effects place a <b>Terrain card</b> on a space: until an effect specifically removes it, that space uses the Terrain card's name and text instead of its own — and Terrain can never go in the Inner Region. A Terrain card on the Sentinel or the Portal of Power lets you cross freely: no Sentinel to beat, no lock to open, and the Warlock can't hold you back over an unfinished quest.</p>` },

    { h: "Warlock Quest cards", when: (c) => c.has("reaper") || c.has("frostmarch") || c.has("cataclysm"), body: (c) => {
      const cat = c.has("cataclysm"), fm = c.has("frostmarch"), rp = c.has("reaper");
      const opt = [rp && "the Reaper", fm && "the Frostmarch"].filter(Boolean).join(" and ");
      /* Reaper & Frostmarch quest cards are optional; the Cataclysm's quest deck is part of its setup.
         Frostmarch (the later product) makes you draw the top card; the Reaper alone lets you choose. */
      const s1 = cat
        ? "The Cataclysm puts its own <b>Warlock Quest deck</b> into the setup — some of its quests have you put fate tokens on the card as you go, and you can complete them at the end of your turn once enough have built up" + (opt ? ` (${opt} quest cards are optional)` : "") + "."
        : `If we've agreed to use the optional <b>Warlock Quest cards</b> from ${opt}, quests at the Warlock's Cave come from that deck instead of a die roll.`;
      const s2 = fm ? ` When you take a quest, draw the top card${rp ? " (the Reaper's quests are shuffled in too)" : ""}; a completed quest leaves the game, and one you lose by dying or discard is shuffled back into the deck.`
        : rp ? " When you take a quest, pick any card still in the deck; a completed quest leaves the game, and one you lose by dying goes back into the deck."
        : "";
      return `<p>${s1}${s2} You can hold only one quest at a time, must finish it as soon as you can, and the Warlock won't let you open the Portal of Power until you do — complete it and you teleport to the Warlock's Cave and gain a Talisman.</p>`;
    }},

    { h: "New cards in the decks", when: (c) => c.has("frostmarch") || c.has("sacredpool") || c.has("firelands") || c.has("netherrealm"), body: (c) => {
      const bits = [];
      if (c.has("frostmarch")) bits.push("<b>Frostmarch</b>");
      if (c.has("sacredpool")) bits.push("<b>Sacred Pool</b> (it also brings a faceup <b>Stables</b> deck of mounts that some encounters let you buy or take, and <b>Neutral</b> Alignment cards for anyone whose alignment turns neutral; and if we use its <b>Quest Rewards</b>, a completed Warlock Quest can pay one instead of a Talisman: you still teleport to the Cave, and you lose all your Rewards if you die)");
      if (c.has("firelands")) bits.push("<b>Firelands</b>");
      /* The Nether Deck is NOT shuffled into the Adventure deck — it is only used with the Nether Realm's own endings (Nether Realm p.2). */
      const nether = c.has("netherrealm") ? "The Nether Realm's <b>Nether Deck</b> is kept separate — it only comes into play with one of the Nether Realm's own Alternative Endings." : "";
      return `<p>${bits.length ? `The Adventure and Spell decks are thickened with ${bits.join(", ")} cards — expect encounters nobody at this table has seen before.${nether ? " " : ""}` : ""}${nether}</p>`;
    }},

    { h: "Faster-play tweaks", when: (c) => ["easyCmd","fastSC","startBonus","bloodbath","sudden","inherit","evadeUnf"].some(id => c.opt(id)), body: (c) => {
      const bits = [];
      if (c.opt("easyCmd")) bits.push((c.ending === "alt" || c.boardMode === "cataclysm") ? "the easier Command Spell doesn't apply — an Alternative Ending card sits on our Crown"
        : c.has("dragon") ? "the easier Command Spell doesn't apply — we fight the Dragon King at the Crown instead"
        : c.p >= 7 ? "the <b>Command Spell</b> casts automatically — the endgame is faster"
        : c.p >= 5 ? `the <b>Command Spell</b> now succeeds on a ${c.p >= 6 ? "2" : "3"} or higher — the endgame is faster`
        : "the easier <b>Command Spell</b> only kicks in with five or more players, so at our table it still needs a 4–6");
      if (c.opt("fastSC")) bits.push("trophies convert to <b>Strength and Craft</b> at a cheaper rate");
      if (c.opt("startBonus")) bits.push("everyone starts with a <b>bonus stat point</b>");
      if (c.opt("bloodbath")) bits.push("<b>Talisman Bloodbath</b>: only one Talisman card is available, and a killed character is out of the game — no fresh start");
      if (c.opt("sudden")) bits.push("<b>Sudden Death</b>: the first character to reach the Crown of Command simply wins");
      if (c.opt("inherit")) bits.push("<b>Inherited Items</b>: if you die, your next character inherits your Objects, gold and Followers, and your killer can't take them");
      if (c.opt("evadeUnf")) bits.push("<b>unfriendly individuals</b> on cards and spaces (the Black Knight, Hag, Witch…) can be evaded, as the table decides — never Inner Region spaces");
      return `<p>Variants we've agreed on: ${bits.join("; ")}.</p>`;
    }},

    { h: "Don't worry about these yet", body: (c) => `
<p>Alignment, individual Spells, and shop inventories explain themselves in play. Opening advice: fight things slightly weaker than you, bank fate for the rolls that matter, and never enter the Middle Region because you're bored — enter it because you're ready.</p>` }
  ]
};
