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
    blurb:"A corner board reached from the Ruins space. Adds the Dungeon deck, the Lord of Darkness and his Treasure Chamber — a route that can emerge a character directly onto the Crown of Command — plus Treasure Cards, new characters and spells. (No Alternative Ending Cards; it has its own alternative rules.)" },
  highland: { id:"highland", group:"board", name:"The Highland", short:"Highland", cls:"s-highland",
    blurb:"A corner board reached from the Crags space. Adds the Highland deck, the Eagle King at the Eyrie, Relic Cards, Trinkets, new characters, spells and 3 Alternative Ending Cards." },
  city: { id:"city", group:"board", name:"The City", short:"City", cls:"s-city",
    blurb:"A corner board reached from the City space. Adds the City deck and shop decks (Armoury, Magic Emporium, Potion, Pet, Stables, Wanted Poster), Trinkets, the Jail, bounties, Neutral Alignment Cards, new characters and 3 Alternative Ending Cards." },
  woodland: { id:"woodland", group:"board", name:"The Woodland", short:"Woodland", cls:"s-woodland",
    blurb:"A corner board reached from the Forest space. A linear path to the Meeting With Destiny. Adds Woodland, Path & Destiny decks, the Light/Dark Fate rules, Trinkets, new characters (with character tokens), spells and 3 Alternative Ending Cards." },
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
    blurb:"Adds the Harbinger figure & sheet and the Omen stack (an end-of-the-world doom timer), Harbinger Cards, Cursed-keyword Objects, Terrain Cards, new characters, spells and 2 Alternative Ending Cards." },
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
    desc:"The classic ending: reach the Crown of Command (only a character with a Talisman may enter the Valley of Fire on the way), then, while alone there, cast the Command Spell each turn to force every other character out of the game." },
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
    d:"Use the Cataclysm board in place of the base board. All base-board movement and encounter rules still apply except where the Cataclysm rules change a space (Lich, Frozen Spire, Mutant's Den, Pits, Plain of Peril, etc.).",
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
    d:"Place the Woodland corner board next to the main board, connected at the Forest space. Note its arrows: movement runs along a linear path toward the Meeting With Destiny.",
    page:"Woodland, pp.4–5 (Setup 1; Entering the Woodland)",
    when: c => c.has("woodland") },
  { ph:0, src:"deeprealms", order:40, t:"Place the Deep Realms between the City & Dungeon",
    d:"Place the Wraith Lord's Domain and Rat Queen's Lair Realm cards between the Dungeon and City boards. (The Deep Realms requires both The City and The Dungeon to be in play.)",
    page:"Deep Realms, p.2 · Lost Realms, p.2 (Setup 1)",
    when: c => c.has("deeprealms") || c.has("lostrealms") },

  /* ---------------- Phase 1 — Decks & Cards ---------------- */
  { ph:1, src:"base", order:10, t:"Form the Adventure deck",
    d: c => c.has("cataclysm")
      ? "Shuffle the Adventure Cards facedown beside the board. (With the Cataclysm board, you also build separate Denizen, Remnant and Talisman decks — see the Cataclysm steps below.)"
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
    d:"Shuffle the Frostmarch Character, Adventure & Spell Cards into the base decks. If using its optional Warlock Quest Cards, shuffle the 24 quests into a facedown Warlock Quest deck by the board (combine with The Reaper's quests if both are used).",
    page:"Frostmarch, p.1",
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
    d:"Add the Harbinger's characters to the pool and shuffle its Spell Cards into the Spell deck (it adds no new Adventure Cards); keep the 75 Harbinger Cards as their own deck (drawn instead when a board space tells a character in the Harbinger's Region to draw cards). Shuffle its Terrain Cards into the Terrain Card deck (form one if no other expansion provides it). Place the Harbinger figure on its sheet, then choose one 8-card Omen set and stack it (7th Omen on the bottom … Prophecy on top) next to the sheet.",
    page:"Harbinger, pp.1–2",
    when: c => c.has("harbinger") },
  { ph:1, src:"netherrealm", order:26, t:"Set out the Nether Deck",
    d:"Shuffle the 36-card Nether Deck and place it facedown beside the board. It is used together with this expansion's Alternative Endings, which direct characters to draw Nether Cards.",
    page:"Nether Realm, p.2 · Lost Realms, p.2",
    when: c => c.has("netherrealm") || c.has("lostrealms") },
  { ph:1, src:"deeprealms", order:27, t:"Set up the Deep Realms decks & loot",
    d:"Shuffle the Bridge deck and place it facedown between the Skull Passage and Rat Run spaces; shuffle the Tunnel deck and place it by the Realm cards. Set loot piles: 3 random Treasure cards faceup on the Throne Room, and 2 Armoury + 2 Magic Emporium cards faceup on the Rat's Nest.",
    page:"Deep Realms, p.2 · Lost Realms, p.2 (Setup 2–4)",
    when: c => c.has("deeprealms") || c.has("lostrealms") },
  { ph:1, src:"firelands", order:28, t:"Set up the Firelands cards & tokens",
    d:"Shuffle the Firelands Character, Adventure & Spell Cards into the base decks. Form the 19-card Terrain Card deck beside the board and place the 34 fireland tokens in a supply. (When using this expansion, its Adventure Cards, Spell Cards, fireland tokens and Terrain Cards are all required components.)",
    page:"Firelands, pp.1–2",
    when: c => c.has("firelands") },
  /* board-expansion dedicated decks */
  { ph:1, src:"dungeon", order:40, t:"Form the Dungeon deck",
    d:"Shuffle the Dungeon Cards facedown beside the Dungeon board, and shuffle the Dungeon's new Character, Adventure & Spell Cards into the base decks. Leave the Treasure Cards in the game box until needed — they are won by defeating the Lord of Darkness in the Treasure Chamber.",
    page:"Dungeon, p.4 (Setup 1–3)",
    when: c => c.has("dungeon") },
  { ph:1, src:"highland", order:41, t:"Form the Highland deck",
    d:"Shuffle the Highland Cards facedown beside the Highland board, and shuffle the Highland's new Character, Adventure & Spell Cards into the base decks. Leave the Relic Cards in the game box until needed — they are won by defeating the Eagle King at the Eyrie.",
    page:"Highland, p.4 (Setup 1–3)",
    when: c => c.has("highland") },
  { ph:1, src:"city", order:42, t:"Form the City & shop decks",
    d:"Shuffle the City deck facedown by the City board. Shuffle the Potion and Pet decks; place the Potion, Magic Emporium, Armoury, Pet and Stables decks facedown by their spaces. Shuffle the Wanted Poster deck, place it facedown, and draw 3 faceup onto the City Gate. Leave the Neutral Alignment Cards in the box until needed.",
    page:"City, p.4 (Setup 2–4)",
    when: c => c.has("city") },
  { ph:1, src:"woodland", order:43, t:"Form the Woodland, Path & Destiny decks",
    d:"Shuffle the Woodland deck facedown by the Woodland board. Shuffle the Path deck and draw three Path Cards faceup. Shuffle the Destiny deck and place it facedown. Shuffle the Woodland's new Adventure Cards into the base Adventure deck and its Spell Cards into the Spell deck.",
    page:"Woodland, p.4 (Setup 2–4)",
    when: c => c.has("woodland") },
  { ph:1, src:"dragon", order:44, t:"Form the Dragon decks & Draconic Lords",
    d:"Separate the Dragon Cards into the Varthrax (red), Cadorus (gold) and Grilipus (green) decks, shuffle each, and place it by its matching Draconic Lord card. Shuffle the 3 Draconic Lord cards, reveal one at random and place the Crown token on it (the starting Dragon King); place the other two faceup. Put 5 life counters on each Draconic Lord card.",
    page:"Dragon, p.5 (Setup 2–3)",
    when: c => c.has("dragon") },
  /* Cataclysm dedicated decks */
  { ph:1, src:"cataclysm", order:50, t:"Seed the Remnant Cards",
    d:"Shuffle the Remnant deck. On each space showing a Remnant symbol, place one facedown Remnant Card per symbol — the Ruins gets two cards. Then return the rest of the Remnant deck to the box.",
    page:"Cataclysm, pp.4–5 (Setup 2; Remnant Cards)",
    when: c => c.has("cataclysm") },
  { ph:1, src:"cataclysm", order:51, t:"Set up the Denizen deck",
    d:"Shuffle the Denizen deck and place it facedown next to the board. Board spaces that say so (such as the City, Tavern and Chapel) and the 'Settlement' Terrain card have a character draw a Denizen, then visit one Denizen there.",
    page:"Cataclysm, pp.4–5 (Setup 3; Denizens)",
    when: c => c.has("cataclysm") },
  { ph:1, src:"cataclysm", order:52, t:"Set up the Talisman deck",
    d:"Shuffle the Talisman Cards together to form a Talisman deck and place it facedown next to the board. Gaining a Talisman now means drawing the top card.",
    page:"Cataclysm, pp.4, 7 (Setup 4; Talisman Cards)",
    when: c => c.has("cataclysm") },
  { ph:1, src:"cataclysm", order:53, t:"Set up the Warlock Quest deck",
    d:"Shuffle the Warlock Quest Cards to form the Warlock Quest deck and place it facedown next to the board.",
    page:"Cataclysm, p.4 (Setup 5)",
    when: c => c.has("cataclysm") },

  /* ---------------- Phase 2 — Tokens, Counters & Coins ---------------- */
  { ph:2, src:"base", order:10, t:"Stockpile counters, fate & gold",
    d:"Sort the Strength (red), Craft (blue) and Life (green) counters, the Fate tokens and the Gold coins into stockpiles within reach of all players. (Large counters are worth 5, small worth 1.)",
    page:"Core, pp.3–4" },
  { ph:2, src:"base", order:11, t:"Keep Toad & Alignment Cards handy",
    d:"Set the 4 Toad Cards (with their figures) and the 4 Alignment Cards to one side, ready to use when a character is toaded or changes alignment.",
    page:"Core, p.4 (Setup 11)" },
  { ph:2, src:"woodland", order:20, t:"Use the Light/Dark Fate tokens",
    d:"Fate tokens are two-sided (gold = Light Fate, dark blue = Dark Fate). The Woodland's Light/Dark Fate rules replace the normal fate rules: Light Fate rerolls your own die; Dark Fate forces another character to reroll. Each character's starting fate may be set to either side.",
    page:"Woodland, p.8",
    when: c => c.has("woodland") },
  { ph:2, src:"dragon", order:21, t:"Make the Dragon token pool",
    d:"Place all Dragon Tokens (Scales, Strikes, Rages, Slumbers) facedown and randomize them into a pool — each player draws one at the start of their turn. Place the Sleep tokens in a separate pool.",
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
      : "Place each figure on the start space printed at the bottom of its character card (next to its alignment).",
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
    d:"The default victory condition stands: reach the Crown of Command (reached only from the Valley of Fire, which only a character with a Talisman may enter), then cast the Command Spell on your turn to drive the other characters out of the game.",
    page:"Core, p.20",
    when: c => c.ending === "crown" && !c.has("cataclysm") && !c.has("dragon") },
  { ph:4, src:"dragon", order:10, t:"Confirm the Dragon King ending",
    d:"With the Dragon overlay in play, the victory objective changes: journey through the Dragon Realm (or ascend the Dragon Tower) to the Crown of Command and confront the current Dragon King. A character on the Crown must attack the Dragon King every turn — the character who removes the Dragon King's last life wins the game.",
    page:"Dragon, p.14 (Confronting the Dragon King)",
    when: c => c.ending === "crown" && c.has("dragon") && !c.has("cataclysm") },
  { ph:4, src:"cataclysm", order:11, t:"Place 'The Eternal Crown' ending",
    d:"With the Cataclysm board, place the 'The Eternal Crown' Alternative Ending card on the Crown of Command — this is the default Cataclysm victory condition.",
    page:"Cataclysm, pp.4, 6 (Setup 6; Crown of Command)",
    when: c => c.has("cataclysm") && c.ending === "crown" },
  { ph:4, src:"base", order:12, t:"Choose an Alternative Ending",
    d: c => {
      const names = c.altPool.map(s => TAL.sources[s].name).join(", ");
      return "Gather the Alternative Ending Cards from " + (names || "your expansions") +
        ". Shuffle them, draw one at random and place it on the Crown of Command (faceup or facedown — see the next step). It replaces the standard win condition: a character on the Crown must encounter it and follow its text instead of casting the Command Spell. (Some cards need other components — check the card.)";
    },
    page:"Highland, p.9 · Woodland, p.12 · Cataclysm, p.7 (Alternative Ending Cards)",
    when: c => c.ending === "alt" },
  { ph:4, src:"base", order:13, t:"Pick revealed or hidden variant",
    d:"Agree whether the Alternative Ending is played face-up (revealed — known to all, more strategic) or face-down (hidden — its danger is a surprise). Some cards are marked for only one variant.",
    page:"Cataclysm, p.7 (Alternative Ending Cards)",
    when: c => c.ending === "alt" },

  /* ---------------- Phase 5 — Begin Play ---------------- */
  { ph:5, src:"base", order:10, t:"Take the first turn",
    d:"The owner of the game takes the first turn; play then proceeds clockwise. On a turn: cast any pre-move Spells, roll one die and move, then resolve the encounter on the space (or another character there).",
    page:"Core, p.4 (Setup 12)" }
];

/* ---- Setup callouts — configuration-specific reminders -------------------- */
TAL.setupCallouts = [
  { src:"base", t:"You still need a Talisman", when: c => c.ending !== "alt" || !c.has("cataclysm"),
    d:"A character may only enter the Valley of Fire — the last space before the Crown of Command — if they hold a Talisman (even just to encounter another character there). Without one they must turn back. Talismans come from the Adventure deck or a completed Warlock's Cave quest." },
  { src:"cataclysm", t:"Cataclysm changes how you draw", when: c => c.has("cataclysm"),
    d:"Spaces that used to have you roll on a table (City, Tavern, Chapel, etc.) — and the 'Settlement' Terrain card — now have you draw a Denizen and visit one Denizen there. Cataclysm Adventure cards don't print how they leave the board: Events are discarded once resolved; Enemies stay until defeated; Strangers and Places stay after being encountered (unless stated); Objects and Followers stay until taken. Talismans come from the Talisman deck." },
  { src:"woodland", t:"Woodland uses Light & Dark Fate", when: c => c.has("woodland"),
    d:"The two-sided fate rules apply to the whole game once the Woodland is in play: spend Light Fate to reroll your own die, or Dark Fate to force an opponent to reroll. Fate may not reroll a creature's attack roll." },
  { src:"city", t:"Trinkets ignore the carrying limit", when: c => c.has("highland") || c.has("city") || c.has("woodland") || c.has("firelands") || c.has("cataclysm"),
    d:"Objects with the 'Trinket' keyword don't count toward your 4-Object carrying limit. They can still be ditched, stolen, sold or discarded like normal Objects. (Trinkets appear in the Highland, City, Woodland, Firelands and Cataclysm decks.)" },
  { src:"dragon", t:"The Dragon changes how you win", when: c => c.has("dragon") && c.ending !== "alt" && !c.has("cataclysm"),
    d:"With the Dragon, victory means reaching the Crown of Command and vanquishing the current Dragon King. Draw one Dragon token at the start of every turn. Landing on a space with a dragon scale lets you encounter the scale instead of the space — draw one Dragon Card of that Lord's colour and ignore the space's text; a scale matching the current Dragon King must be encountered." },
  { src:"bloodmoon", t:"Watch the clock", when: c => c.has("bloodmoon"),
    d:"The Time Card tracks Day and Night and flips whenever a character draws one or more Events (a Lunar Event flips it to the side it names). By Day each creature subtracts 1 from its attack score (minimum 1); at Night it adds 1. Many cards behave differently by phase. Whoever rolls a 1 for movement also moves the prowling Werewolf; a character it visits who rolls a 1 on its chart becomes a lycanthrope (Lycanthrope Cards only take effect at Night)." },
  { src:"harbinger", t:"The Omen stack is a doom timer", when: c => c.has("harbinger"),
    d:"Each time the top Omen is discarded the next is revealed; when the Omen stack runs out, the world ends and every character loses. When a board space tells a character in the Harbinger's Region to draw cards, he draws Harbinger Cards instead, and landing on the Harbinger's space forces an encounter on his chart." },
  { src:"dragon", t:"The Dragon can't be combined with Alternative Endings", when: c => c.has("dragon") && (c.ending === "alt" || c.has("cataclysm")),
    d:"Players cannot play with The Dragon expansion in its entirety and Alternative Ending Cards at the same time — and on the Cataclysm board 'The Eternal Crown' is itself an Alternative Ending Card. Leave the Dragon board overlay and its Dragon King victory off the table. The Dragon's characters can still be used, and its Dragon Cards, Draconic Lord Cards and tokens are optional." },
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
      { h:"2 · Movement", t:"Roll one die and move that many spaces in either direction (Outer & Middle Regions). You must always move, and you must move the full count. The Inner Region is different — one space per turn, no die." },
      { h:"3 · Encounter", t:"On the space you land on, either encounter another character there, or encounter the space itself (resolve Events and Enemies first, then Strangers; then take any gold/Objects/Followers; then visit Places)." },
      { h:"End", t:"Play passes to the player on the left." }
    ],
    flow:["Pre-move Spells","Move (1 die, either direction)","Land","Other character? → encounter them or the space","Draw-cards space? → draw to the listed total","Resolve in encounter-number order: Events → Enemies → Strangers","Take Objects, Followers & gold, then Places","Turn ends"] },

  regions: { id:"ref-regions", title:"Regions & Crossing",
    intro:"The board has three Regions. You cross between them only at specific places.",
    items:[
      { k:"Outer Region", t:"The ring around the outer edge of the board. Characters first adventure here and in the Middle Region to build up Strength, Craft and Lives." },
      { k:"Middle Region", t:"Separated from the Outer Region by the Storm River and from the Inner Region by the Plain of Peril." },
      { k:"Inner Region", t:"The deadly centre. Entered only through the Portal of Power; movement is one space per turn and there are no Adventure-Card draws — each space has fixed instructions." },
      { k:"Storm River (Outer↔Middle)", t:"Cross via the Sentinel bridge (Sentinel space ↔ Hills), by building/using a Raft, or by an encounter effect." },
      { k:"The Sentinel", t:"Attacks a character every time they try to cross the bridge from the Outer to the Middle Region. Defeat or evade it to continue; it does not attack the other direction or characters merely passing through." },
      { k:"Portal of Power (Middle↔Inner)", t:"Must be opened (per its instructions) to pass from the Middle to the Inner Region — each attempt is separate; past success guarantees nothing. Returning outward needs no opening: moving from the Plain of Peril to the Portal of Power space is your whole move." },
      { k:"Crown of Command", t:"The last space, reached only from the Valley of Fire — which only a character holding a Talisman may enter." }
    ] },

  combat: { id:"ref-combat", title:"Attacks: Battle & Psychic Combat",
    intro:"Attacks split into battles (Strength) and psychic combats (Craft). Both resolve the same way.",
    steps:[
      { h:"1 · Evade", t:"Declare whether you evade (if able, e.g. via a Spell or ability). If not, combat takes place." },
      { h:"2 · Cast Spells", t:"Cast any Spells and apply any Strength/Craft modifiers before the attack roll." },
      { h:"3 · Attack rolls", t:"You roll one die; add it to your Strength (battle) or Craft (psychic) plus modifiers. The creature/opponent rolls one die added to its value. You may spend one Fate to reroll your own die (not a creature's)." },
      { h:"4 · Compare scores", t:"Higher attack score wins: a beaten creature is killed; a beaten character loses one life (an Object, Spell or special ability may prevent this) and their turn ends. Equal scores = stand-off: nobody is harmed and the turn ends." }
    ],
    notes:[
      "Only one Weapon and one Armour may be used at a time in an attack.",
      "No Object can prevent the loss of a life in psychic combat.",
      "Multiple Strength-Enemies sharing an encounter number combine into one attack score.",
      "In a stand-off the character leaves that space next turn without re-fighting what they fought (unless told otherwise).",
      "Character vs character: the winner may force a life loss, or take one Object or one Gold; a kill lets the winner take all Objects, Followers and gold."
    ] },

  stats: { id:"ref-stats", title:"Strength, Craft, Lives, Fate & Gold",
    intro:"A character card lists four values — Strength, Craft, Lives and Fate — plus special abilities; Gold is tracked beside it.",
    items:[
      { k:"Strength (red)", t:"Might in battle. Counters are gained only for points earned in play; Strength from Objects/Followers is added when used, not recorded. Can never drop below the printed value." },
      { k:"Craft (blue)", t:"Used in psychic combat and sets how many Spells you may hold. Same counter rules as Strength." },
      { k:"Lives (green)", t:"Durability. Lost through combat and hazards; healing can never exceed your Life value, but you may gain lives above it." },
      { k:"Fate", t:"Once per die roll, spend a Fate token to reroll one die you just rolled for: your movement, your attack roll, or a card/space instruction. You must accept the reroll. You cannot reroll a creature's attack roll or another player's die. Replenish up to your value; gain above it." },
      { k:"Gold", t:"Buys Objects and services. Prices shown as 'G' (e.g. 3G). Not an Object — doesn't count toward the carrying limit." }
    ] },

  cards: { id:"ref-cards", title:"Adventure Cards & Carrying",
    intro:"Most spaces tell you to draw Adventure Cards. Resolve them by encounter number, lowest first.",
    items:[
      { k:"Events", t:"Follow the text. Loss-of-turn ends your turn immediately. An Event that lasts more than one turn stays on its space as a reminder (FAQ)." },
      { k:"Enemies (Strength)", t:"Animals, Monsters, Dragons — fought in battle. Kept as trophies when killed." },
      { k:"Enemies (Craft / Spirit)", t:"Engaged in psychic combat. Kept as trophies when killed." },
      { k:"Strangers", t:"Varied effects, sometimes based on your alignment." },
      { k:"Objects / Magic Objects / Followers", t:"Taken to your play area if the space is clear of Enemies. Max 4 Objects (unless you have a Mule); Followers are unlimited." },
      { k:"Places", t:"Follow the instructions; some are encountered every visit." },
      { k:"Trophies", t:"Turn in killed Enemies at end of turn: every 7 points of Strength → 1 Strength counter; every 7 points of Craft → 1 Craft counter. Excess over a multiple of 7 is lost." }
    ] },

  spells: { id:"ref-spells", title:"Spells",
    intro:"Anyone with enough Craft can cast Spells. Your Craft sets how many you may hold.",
    table:[ ["Craft","1","2","3","4","5","6+"], ["Max Spells","0","0","1","2","2","3"] ],
    notes:[
      "Spells are kept facedown (hidden). Cast as stated on the card, then discard.",
      "Spells affecting characters work in any Region; Spells affecting creatures cannot affect creatures in the Inner Region.",
      "You may cast as many Spells on your turn as you held at the start of it, but only one Spell during another character's turn — except the Command Spell."
    ] },

  inner: { id:"ref-inner", title:"The Inner Region & Endgame",
    intro:"The centre is resolved by fixed space instructions — no Adventure draws, no evading creatures, no Spells against its creatures.",
    items:[
      { k:"Portal of Power", t:"Open it to enter; each attempt is separate. Succeed and your turn ends on the Plain of Peril; fail and it ends on the Portal of Power space." },
      { k:"Crypt / Mines", t:"Roll three dice and subtract your Strength (Crypt) or Craft (Mines) to find the exit tunnel you emerge from." },
      { k:"Werewolf Den", t:"Roll two dice for the Werewolf's Strength; battle it each visit until you escape." },
      { k:"Pits", t:"Roll a die for the number of Pit Fiends; fight them one at a time." },
      { k:"Valley of Fire → Crown", t:"Only a character with a Talisman may enter the Valley of Fire (even just to encounter another character there); otherwise turn back. The Crown can only be reached from the Valley of Fire." },
      { k:"Command Spell", t:"Alone on the Crown, on your turn you must cast the Command Spell: roll one die. 1–3 has no effect; 4–6 makes every other character lose one life. A character killed this way is out for good. Once anyone reaches the Crown, any character killed is out — even if a character later leaves the Crown." }
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
      { k:"Sudden Death", t:"The first character to reach the Crown of Command simply wins. Or stop at an agreed time and total each character's counters, Spells, Objects etc. — highest wins." },
      { k:"Inherited Items", t:"A new character inherits the Objects, gold and Followers of the killed character it replaces." },
      { k:"Evading Unfriendly Individuals", t:"Allow evading any unfriendly card/space (e.g. Black Knight, Hag, Witch) at the table's discretion — but not the Vampire's Tower, Werewolf Den, Death or Pits." }
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
    a:"Yes. The Crown of Command can only be reached from the Valley of Fire, and only a character with a Talisman may enter the Valley of Fire (even just to encounter another character there); otherwise you must turn back. Talismans come from the Adventure deck or a Warlock's Cave quest (or the Talisman deck under the Cataclysm). Exception: a character who emerges onto the Crown from the Dungeon's Treasure Chamber needs no Talisman." },
  { q:"How does the Command Spell actually remove players?",
    a:"Alone on the Crown, on your turn you cast it and roll one die: 1–3 nothing; 4–6 every other character loses one life. A character killed by the Command Spell is out of the game and may not start a new character. Faster-play variants widen the triggering range." },
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
      const goal = alt ? " to whatever ending fate has dealt us this game (it may stay hidden until someone arrives)"
        : dk ? " to the Crown, where you must fight the current Dragon King — whoever takes his last life wins"
        : cat ? " to the Crown, where 'The Eternal Crown' makes you cast a riskier Command Spell each turn (a bad roll can cost you a life too) to strike down every rival until you alone remain"
        : " to the Crown, where the Command Spell lets you strike down every rival until you alone remain";
      return `
<p>We are adventurers in ${cat ? "the shattered, post-Cataclysm land of Talisman — the familiar board is gone, replaced by a wasteland of ruins and scavenged remnants" : "the land of Talisman"}, and the prize is the <b>Crown of Command</b> at the center of the board. The land is three rings: grow strong in the <b>Outer Region</b>, brave the <b>Middle</b>, then pass the <b>Portal of Power</b> and fight through the <b>Inner Region</b>${dk ? "" : " — carrying a <b>Talisman</b>, because nobody without one may enter the Valley of Fire just before the Crown —"}${goal}.</p>
<p>This is a race with fangs: last adventurer standing, or first to the ending, wins.</p>`;
    }},

    { h: "Your turn — roll, land, resolve", body: (c) => `
<p>Roll a die, move <b>exactly</b> that many spaces, clockwise or anti — your only real decision is which of two landing spots serves you. Then <b>encounter your space</b>: draw Adventure cards if it tells you to, fight what's there, or use the space's own text. Or — if another adventurer stands there — <b>attack them</b> instead: the winner makes the loser lose a life or takes one of their Objects or a gold.</p>` },

    { h: "Strength, Craft & Lives", body: (c) => `
<p>Two stats rule everything: <b>Strength</b> for battles against monsters and rivals, <b>Craft</b> for psychic combat against spirits. Combat is simple: both sides roll a die, add their stat, high total wins — beat a creature and it dies (keep it as a trophy); lose and you drop a <b>Life</b>; a tie is a stand-off. Kill enough enemies and their trophies buy stat points; some spaces train you outright. <b>Gold</b> buys gear, <b>Followers</b> tag along with bonuses, your Craft sets how many <b>Spells</b> you can hold, and <b>fate tokens</b> reroll your own dice — the 4th Edition's mercy rule. Run out of lives and your character is killed: you start a fresh one on your next turn — but once anyone has reached the Crown of Command, death is final.</p>` },

    { h: "The long game", body: (c) => `
<p>Don't sprint. The Inner Region murders the unprepared — the classic arc is: loot the Outer ring until your stats embarrass the Middle ring, find your <b>Talisman</b> (quests and luck), then commit. Every character breaks the rules their own way; read your sheet aloud when we start.</p>` },

    { h: "The Cataclysm board", when: (c) => c.has("cataclysm"), body: () => `
<p>Spaces that used to have you roll on a table — the City, Tavern, Chapel and others — now have you draw a <b>Denizen</b>, add it to the space, then visit one Denizen there (often a die roll on its card); a Denizen whose card names the space you're on, or says "Any", stays for the next visitor, and the rest are discarded after a visit. Facedown <b>Remnant</b> cards were seeded on marked spaces at setup: land on one and you flip it faceup before choosing what to encounter, and from then on it counts as an Adventure card.</p>` },

    { h: (c) => (c.ending === "alt" || c.boardMode === "cataclysm") ? "The Dragon (in part)" : "The Dragon Realm",
      when: (c) => c.has("dragon"), body: (c) => (c.ending === "alt" || c.boardMode === "cataclysm") ? `
<p>The <b>Dragon expansion</b> is only partly in play: an Alternative Ending sits on the Crown, and the full Dragon can't be combined with one — so there's no Dragon board overlay and no Dragon King fight. Its new characters are in the pool (and its Dragon Cards, Draconic Lords and tokens only if we've chosen to use them).</p>` : `
<p>The <b>Dragon expansion</b> has overlaid the Inner Region. Three <b>Draconic Lords</b> — Varthrax, Cadorus and Grilipus — vie to be <b>Dragon King</b>. At the start of every turn you draw a dragon token: scales pile onto the Lords, and when one collects three he takes the Crown token and drops a scale onto the board. Land on a scale and you may draw that Lord's Dragon Cards instead of using the space — you <b>must</b> if it matches the current Dragon King. Kill a Dragon Card Enemy to claim the scale; it helps against that Lord later. The endgame is a boss fight: reach the Crown and attack the Dragon King until someone takes his last life.</p>` },

    { h: "This table's boards", when: (c) => c.corners && c.corners.length, body: (c) => {
      const names = { dungeon: "<b>the Dungeon</b> (enter at the Ruins — a treasure-crawl that can drop you shockingly close to the Crown)", highland: "<b>the Highland</b> (enter at the Crags — the Eagle King guards real rewards)", city: "<b>the City</b> (enter at the City — shops, stables, and honest work)", woodland: "<b>the Woodland</b> (enter at the Forest — a path of destiny with fae prices; it also swaps in <b>light and dark fate</b> for everyone: light fate rerolls your own die, dark fate forces a rival to reroll theirs)" };
      return `<p>Corner realms are open this game: ${c.corners.map(x => names[x] || x).join("; ")}. Each is a detour with its own deck — riskier than the main road, and usually worth it.</p>`;
    }},

    { h: "The City", when: (c) => c.has("city"), body: () => `
<p>The City's streets are one-way — follow the arrows — and its shops (the Armoury, Magic Emporium, Apothecary, Menagerie and Stables) each sell from their own deck: stepping into a shop costs a point of movement and ends your move, and once inside you must encounter the shop or a character there. At the City Gate you can buy <b>Wanted Posters</b> for one gold each, then collect: discard matching Enemy trophies at the end of your turn for gold equal to their Strength or Craft, or beat a character of the listed alignment and roll a die for that much gold. Some encounters throw you in the <b>Jail</b> — your turn ends, and instead of moving you roll on the Jail's chart each turn until you get out.</p>` },

    { h: "The Deep Realms", when: (c) => c.has("deeprealms") || c.has("lostrealms"), body: (c) => `
<p>Between the City and the Dungeon lie the <b>Deep Realms</b> — the Rat Queen's Lair and the Wraith Lord's Domain, linked by a rickety bridge, with tunnels leading down to each ruler's hoard and their own Bridge and Tunnel decks (watch for Traps). Inside, before each move you choose to <b>Escape</b> (roll and move back out against the arrow) or <b>Press On</b> (no die — follow your space's instructions). Beat the Rat Queen or the Wraith Lord to grab loot and teleport to any Outer Region space${c.has("netherrealm") || c.has("lostrealms") ? "; and the brutal <b>Nether Deck</b> is in play wherever its ending demands it" : ""}.${c.has("lostrealms") ? " The Lost Realms' coloured <b>base rings</b> just fit around our figures' bases to make them easier to tell apart." : ""}</p>` },

    { h: "Extra rules in play", when: (c) => c.has("reaper") || c.has("bloodmoon") || c.has("harbinger") || c.has("firelands"), body: (c) => {
      const bits = [];
      if (c.has("reaper")) bits.push("the <b>Grim Reaper</b>, if we're using him, stalks the board — whoever rolls a 1 for movement moves him after their turn, and when he ends on your space you may be picked to roll on his chart, which can help you or kill you");
      if (c.has("bloodmoon")) bits.push("<b>day and night</b> alternate, lunar events fire, and the <b>Werewolf</b> hunts in the dark");
      if (c.has("harbinger")) bits.push("the <b>Harbinger</b> walks the land reading omens — the end of the world is on a timer");
      if (c.has("firelands")) bits.push("the <b>Firelands</b> burn: Ifrit hazards scorch spaces, and fireproof gear suddenly matters");
      const cursed = c.has("harbinger") ? " Watch for <b>Cursed</b> Objects and Followers: you must take one when you encounter it — even past your carrying limit — and you can never ditch it, though it can still be discarded, stolen or sold." : "";
      return `<p>Also: ${bits.join("; ")}.${cursed}</p>`;
    }},

    { h: "Terrain cards", when: (c) => c.has("cataclysm") || c.has("firelands") || c.has("harbinger"), body: () => `
<p>Some effects place a <b>Terrain card</b> on a space: until an effect specifically removes it, that space uses the Terrain card's name and text instead of its own — and Terrain can never go in the Inner Region. A Terrain card on the Sentinel or the Portal of Power lets you cross freely: no Sentinel to beat, no lock to open.</p>` },

    { h: "Warlock Quest cards", when: (c) => c.has("reaper") || c.has("frostmarch") || c.has("cataclysm"), body: (c) => {
      const cat = c.has("cataclysm"), fm = c.has("frostmarch"), rp = c.has("reaper");
      const opt = [rp && "the Reaper", fm && "the Frostmarch"].filter(Boolean).join(" and ");
      /* Reaper & Frostmarch quest cards are optional; the Cataclysm's quest deck is part of its setup.
         Frostmarch (the later product) makes you draw the top card; the Reaper alone lets you choose. */
      const s1 = cat
        ? "The Cataclysm puts its own <b>Warlock Quest deck</b> into the setup — some of its quests have you put fate tokens on the card as you go, and you can complete them at the end of your turn once enough have built up" + (opt ? ` (${opt} quest cards are optional)` : "") + "."
        : `If we've agreed to use the optional <b>Warlock Quest cards</b> from ${opt}, quests at the Warlock's Cave come from that deck instead of a die roll.`;
      const s2 = fm ? ` When you take a quest, draw the top card${rp ? " (the Reaper's quests are shuffled in too)" : ""}; a completed quest leaves the game, and one you lose by dying goes back into the deck.`
        : rp ? " When you take a quest, pick any card still in the deck; a completed quest leaves the game, and one you lose by dying goes back into the deck."
        : "";
      return `<p>${s1}${s2} You can hold only one quest at a time, must finish it as soon as you can, and the Warlock won't let you open the Portal of Power until you do — complete it and you teleport to the Warlock's Cave and gain a Talisman.</p>`;
    }},

    { h: "New cards in the decks", when: (c) => c.has("frostmarch") || c.has("sacredpool") || c.has("firelands") || c.has("netherrealm"), body: (c) => {
      const bits = [];
      if (c.has("frostmarch")) bits.push("<b>Frostmarch</b>");
      if (c.has("sacredpool")) bits.push("<b>Sacred Pool</b> (if we use its Quest Rewards, a completed Warlock Quest can pay one instead of a Talisman)");
      if (c.has("firelands")) bits.push("<b>Firelands</b>");
      /* The Nether Deck is NOT shuffled into the Adventure deck — it is only used with the Nether Realm's own endings (Nether Realm p.2). */
      const nether = c.has("netherrealm") ? "The Nether Realm's <b>Nether Deck</b> is kept separate — it only comes into play with one of the Nether Realm's own Alternative Endings." : "";
      return `<p>${bits.length ? `The Adventure and Spell decks are thickened with ${bits.join(", ")} cards — expect encounters nobody at this table has seen before.${nether ? " " : ""}` : ""}${nether}</p>`;
    }},

    { h: "Faster-play tweaks", when: (c) => ["easyCmd","fastSC","startBonus","bloodbath","sudden","inherit","evadeUnf"].some(id => c.opt(id)), body: (c) => {
      const bits = [];
      if (c.opt("easyCmd")) bits.push("the <b>Command Spell</b> triggers on more results — the endgame is faster");
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
