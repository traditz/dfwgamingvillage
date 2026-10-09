/* =============================================================================
   Root — Setup & Reference Utility · core data
   Sources (the ONLY sources; citations use each document's PRINTED page numbers):
     Law          The Law of Root (October 13, 2025) — authoritative for every rule it covers
     LtP          Root base Learning to Play (web, Oct 15 2020)
     Walkthrough  Walking Through Root (web, Oct 15 2020) — no printed page numbers: cited by PDF page
     Riverfolk    Riverfolk Expansion Learning to Play
     Underworld   Underworld Expansion Learning to Play
     Marauder     Marauder Expansion Learning to Play
     Homeland     Homeland Expansion Learning to Play
     Rootbotics   The Law of Rootbotics (cover date September 8, 2021) — governs bots only
   Precedence (Law p.2 §1.1.1): a card beats the Law; the Law beats every Learning to Play book.
   ---------------------------------------------------------------------------
   File map (all files add to the one global RT):
     data.js          this file: registries, suggested mixes, the configuration engine (normalize + ctx)
     data-setup.js    setup phases (Standard 5.1, Advanced App. A, the Walkthrough game) + every faction's setup
     data-ref.js      rules reference: Law §1–5, the four base factions (§6–9), appendices H, K, L, M, V
     data-teach.js    the teaching script (core teach + base factions + modules)
     data-factions.js expansion factions' reference + teach inserts (stage "factions")
     data-bots.js     everything about bots (stage "bots")
   ============================================================================= */
var RT = {};

/* ---------- item letters used by the Law's icon font (rendered and checked: Law p.5 §5.1.5, p.28) ---------- */
RT.items = { M: "boots", B: "bag", C: "crossbow", H: "hammer", S: "sword", T: "tea", X: "coins", F: "torch" };
RT.itemName = function (letter) { return RT.items[letter] || letter; };
RT.itemList = function (letters) {           // "MFTS" -> "boots, torch, tea, sword"
  return letters.split("").map(RT.itemName).join(", ");
};

/* ---------- tags shown on setup steps ---------- */
RT.expMeta = {
  base:       { name: "Base game",     cls: "tag-base" },
  riverfolk:  { name: "Riverfolk",     cls: "tag-riverfolk" },
  underworld: { name: "Underworld",    cls: "tag-underworld" },
  marauder:   { name: "Marauder",      cls: "tag-marauder" },
  homeland:   { name: "Homeland",      cls: "tag-homeland" },
  clockwork:  { name: "Clockwork",     cls: "tag-clockwork" },
  clockwork2: { name: "Clockwork 2",   cls: "tag-clockwork" },
  vpack:      { name: "Vagabond Pack", cls: "tag-extra" },
  lpack:      { name: "Landmarks Pack", cls: "tag-extra" },
  hpacks:     { name: "Hireling Packs", cls: "tag-extra" },
  epdeck:     { name: "Exiles & Partisans", cls: "tag-extra" },
  sddeck:     { name: "Squires & Disciples", cls: "tag-extra" },
  adv:        { name: "Advanced Setup", cls: "tag-adv" },
  walk:       { name: "Walkthrough",   cls: "tag-walk" },
  mod:        { name: "Module",        cls: "tag-mod" },
  variant:    { name: "Variant",       cls: "tag-mod" },
  bots:       { name: "Bots",          cls: "tag-clockwork" }
};

/* ---------- what you own ---------- */
RT.sets = [
  { id: "base", short: "Root", year: "base game", group: "box",
    blurb: "The base game: Marquise de Cat, Eyrie Dynasties, Woodland Alliance and Vagabond (Thief, Tinker, Ranger); the Autumn and Winter maps; the 54-card shared deck. Always in play.", src: "Law p.24 §C.1" },
  { id: "riverfolk", short: "Riverfolk", year: "expansion", group: "box",
    blurb: "Lizard Cult, Riverfolk Company, a second Vagabond board, the Vagrant, Arbiter and Scoundrel, the original Mechanical Marquise bot and its spy cards.", src: "Law p.24 §C.2" },
  { id: "underworld", short: "Underworld", year: "expansion", group: "box",
    blurb: "Underground Duchy, Corvid Conspiracy, and the Lake and Mountain maps (with the Ferry and Tower).", src: "Law p.24 §C.3" },
  { id: "marauder", short: "Marauder", year: "expansion", group: "box",
    blurb: "Lord of the Hundreds, Keepers in Iron, four hirelings, and the faction setup cards for Advanced Setup.", src: "Law p.24 §C.4" },
  { id: "homeland", short: "Homeland", year: "expansion", group: "box",
    blurb: "Lilypad Diaspora, Twilight Council, Knaves of the Deepwood (12 Captains), the Marsh and Gorge maps, three landmarks, the Cheat, Gladiator and Jailor.", src: "Law p.24 §C.5" },
  { id: "clockwork", short: "Clockwork", year: "bots", group: "box",
    blurb: "Bots: Mechanical Marquise 2.0, Electric Eyrie, Automated Alliance and the Vagabot (Thief, Tinker, Ranger).", src: "Law p.25 §C.6 · Rootbotics p.11 §7.7, p.15" },
  { id: "clockwork2", short: "Clockwork 2", year: "bots", group: "box",
    blurb: "Bots: Logical Lizards, Riverfolk Robots, Drillbit Duchy, Cogwheel Corvids, three more Vagabots, and the bot Services cards.", src: "Law p.25 §C.7 · Rootbotics p.11 §7.7, p.15" },
  { id: "vpack", short: "Vagabond Pack", year: "extra", group: "extra",
    blurb: "Three more Vagabond characters: the Adventurer, Harrier and Ronin (with seven pawns).", src: "Law p.25 §C.11 · p.28–29 App. V" },
  { id: "epdeck", short: "Exiles & Partisans", year: "deck", group: "extra",
    blurb: "A 54-card shared deck that can replace the base game's whole deck (Advanced Setup step 2).", src: "Law p.25 §C.8 · p.22 §A.2" },
  { id: "sddeck", short: "Squires & Disciples", year: "deck", group: "extra",
    blurb: "A 54-card shared deck that can replace the base game's whole deck (Advanced Setup step 2).", src: "Law p.25 §C.9 · p.22 §A.2" },
  { id: "lpack", short: "Landmarks Pack", year: "extra", group: "extra",
    blurb: "Six landmark cards and four wooden landmarks; each card carries its own setup and rules.", src: "Law p.25 §C.10" },
  { id: "hpacks", short: "Hireling Packs", year: "extra", group: "extra",
    blurb: "Neutral and faction hirelings beyond the Marauder four; each hireling card carries its own setup and rules.", src: "Law p.25 §C.12" }
];

/* ---------- the 13 factions (+ the second Vagabond board), in the Law's chapter order ----------
   reach: Law p.5 §5.2. corner: the faction's standard setup places it in a corner clearing
   (Law §6.3.2, §7.3.2, §10.3.2, §12.3.3, §14.3.2, §15.3.3, §17.3.2) — five or more of these force Advanced Setup (Law p.4 §5). */
RT.factions = [
  { id: "marquise",  name: "Marquise de Cat",         short: "Marquise",  set: "base",       reach: 10, corner: true,  sec: "§6",  page: "5–6",   craft: "workshops (Daylight)", craftSrc: "Law p.5 §6.2.1" },
  { id: "eyrie",     name: "Eyrie Dynasties",          short: "Eyrie",     set: "base",       reach: 7,  corner: true,  sec: "§7",  page: "6–7",   craft: "roosts (Daylight, before the Decree)", craftSrc: "Law p.6 §7.2.1" },
  { id: "alliance",  name: "Woodland Alliance",        short: "Alliance",  set: "base",       reach: 3,  corner: false, sec: "§8",  page: "7–8",   craft: "sympathy tokens (Daylight)", craftSrc: "Law p.7 §8.2.1" },
  { id: "vagabond",  name: "Vagabond",                 short: "Vagabond",  set: "base",       reach: 5,  corner: false, sec: "§9",  page: "8–11",  craft: "his pawn, exhausting one hammer per crafting icon — not limited to once per turn; his clearing must match every icon (Daylight)", craftSrc: "Law p.9–10 §9.2.1, §9.2.5, §9.5.8" },
  { id: "vagabond2", name: "Second Vagabond",          short: "2nd Vagabond", set: "riverfolk", reach: 2, corner: false, sec: "§9.7", page: "10–11", craft: "his pawn, exhausting one hammer per crafting icon — not limited to once per turn; his clearing must match every icon (Daylight)", craftSrc: "Law p.9–10 §9.2.1, §9.2.5, §9.5.8" },
  { id: "lizard",    name: "Lizard Cult",              short: "Lizard Cult", set: "riverfolk", reach: 2,  corner: true,  sec: "§10", page: "11–12", craft: "gardens whose printed suit matches the Outcast (Evening)", craftSrc: "Law p.11 §10.2.1" },
  { id: "riverfolk", name: "Riverfolk Company",        short: "Riverfolk", set: "riverfolk",  reach: 5,  corner: false, sec: "§11", page: "12–13", craft: "committing funds to the Trade Posts tracks (Daylight; no crafting pieces)", craftSrc: "Law p.12 §11.2.1" },
  { id: "duchy",     name: "Underground Duchy",        short: "Duchy",     set: "underworld", reach: 8,  corner: true,  sec: "§12", page: "13–14", craft: "citadels and markets (Evening)", craftSrc: "Law p.13 §12.2.1" },
  { id: "corvid",    name: "Corvid Conspiracy",        short: "Corvids",   set: "underworld", reach: 3,  corner: false, sec: "§13", page: "14–15", craft: "plot tokens, face up or down (Birdsong)", craftSrc: "Law p.14 §13.2.1" },
  { id: "hundreds",  name: "Lord of the Hundreds",     short: "Hundreds",  set: "marauder",   reach: 9,  corner: true,  sec: "§14", page: "15–17", craft: "strongholds (Daylight)", craftSrc: "Law p.15 §14.2.1" },
  { id: "keepers",   name: "Keepers in Iron",          short: "Keepers",   set: "marauder",   reach: 8,  corner: true,  sec: "§15", page: "17–18", craft: "waystations of any type (Daylight)", craftSrc: "Law p.17 §15.2.3" },
  { id: "diaspora",  name: "Lilypad Diaspora",         short: "Diaspora",  set: "homeland",   reach: 7,  corner: false, sec: "§16", page: "18–19", craft: "enclaves (Birdsong)", craftSrc: "Law p.19 §16.2.7" },
  { id: "council",   name: "Twilight Council",         short: "Council",   set: "homeland",   reach: 4,  corner: true,  sec: "§17", page: "20–21", craft: "assemblies (Evening)", craftSrc: "Law p.20 §17.2.6" },
  { id: "knaves",    name: "Knaves of the Deepwood",   short: "Knaves",    set: "homeland",   reach: 4,  corner: false, sec: "§18", page: "21–22", craft: "the Acting Captain (Filch) or acclaim (Serve) (Daylight)", craftSrc: "Law p.21 §18.2.8" }
];
RT.F = {}; RT.factions.forEach(function (f) { RT.F[f.id] = f; });
RT.baseFour = ["marquise", "eyrie", "alliance", "vagabond"];
RT.expansionFactions = ["lizard", "riverfolk", "duchy", "corvid", "hundreds", "keepers", "diaspora", "council", "knaves"];

/* Viable reach sums (Law p.5 §5.2): players -> minimum total reach. */
RT.reach = { 2: 17, 3: 18, 4: 21, 5: 25, 6: 28 };

/* ---------- maps (Law p.27–28 App. M) ---------- */
RT.maps = [
  { id: "autumn",   name: "Autumn",   set: "base",       blurb: "The printed suits; no special rules.", src: "Law p.27 §M.1" },
  { id: "winter",   name: "Winter",   set: "base",       blurb: "Random suit markers; the Raging River divides forests. For experienced players.", src: "Law p.27 §M.2 · LtP p.23" },
  { id: "lake",     name: "Lake",     set: "underworld", blurb: "A central lake links every coastal clearing like rivers; the Ferry crosses it.", src: "Law p.27 §M.3 · Underworld p.6" },
  { id: "mountain", name: "Mountain", set: "underworld", blurb: "Six closed paths that players can open, and the Pass, which scores 1 point at the end of your Evening if you rule it.", src: "Law p.27–28 §M.4 · Underworld p.7" },
  { id: "marsh",    name: "Marsh",    set: "homeland",   blurb: "Flooded clearings with 1–4 players; the three suited landmarks with 5 or more.", src: "Law p.28 §M.5 · Homeland p.17" },
  { id: "gorge",    name: "Gorge",    set: "homeland",   blurb: "A dam, a bridge and gorge sides that change which forests are separate.", src: "Law p.28 §M.6 · Homeland p.16" }
];
RT.M = {}; RT.maps.forEach(function (m) { RT.M[m.id] = m; });

/* ---------- shared decks (Law p.22 §A.2, p.25 §C.8–C.9) ---------- */
RT.decks = [
  { id: "standard", name: "Base deck",            set: "base",   blurb: "The base game's 54-card shared deck." },
  { id: "ep",       name: "Exiles and Partisans", set: "epdeck", blurb: "Replaces the entire base deck." },
  { id: "sd",       name: "Squires and Disciples", set: "sddeck", blurb: "Replaces the entire base deck." }
];

/* ---------- Vagabond characters (Law p.28–29 App. V) ---------- */
RT.vchars = [
  { id: "thief",      name: "Thief",      set: "base",      items: "MFTS", act: "Steal", sec: "V.1", page: "28" },
  { id: "tinker",     name: "Tinker",     set: "base",      items: "MFBH", act: "Day Labor", sec: "V.2", page: "28" },
  { id: "ranger",     name: "Ranger",     set: "base",      items: "MFCS", act: "Hideout", sec: "V.3", page: "28" },
  { id: "vagrant",    name: "Vagrant",    set: "riverfolk", items: "XFM",  act: "Instigate", sec: "V.4", page: "28" },
  { id: "arbiter",    name: "Arbiter",    set: "riverfolk", items: "MFSS", act: "Protector", sec: "V.5", page: "28" },
  { id: "scoundrel",  name: "Scoundrel",  set: "riverfolk", items: "MMFC", act: "Scorched Earth", sec: "V.6", page: "28" },
  { id: "adventurer", name: "Adventurer", set: "vpack",     items: "MFH",  act: "Improvise", sec: "V.7", page: "28" },
  { id: "harrier",    name: "Harrier",    set: "vpack",     items: "XFSC", act: "Glide", sec: "V.8", page: "29" },
  { id: "ronin",      name: "Ronin",      set: "vpack",     items: "MMFS", act: "Swift Strike", sec: "V.9", page: "29" },
  { id: "cheat",      name: "Cheat",      set: "homeland",  items: "MTCF", act: "Con", sec: "V.10", page: "29" },
  { id: "gladiator",  name: "Gladiator",  set: "homeland",  items: "MFH",  act: "Duel", sec: "V.11", page: "29" },
  { id: "jailor",     name: "Jailor",     set: "homeland",  items: "MCF",  act: "Coerce", sec: "V.12", page: "29" }
];
RT.VC = {}; RT.vchars.forEach(function (v) { RT.VC[v.id] = v; });

/* ---------- Knave Captains (Law p.27 App. K; all 12 Captain cards come in Homeland, Law p.24 §C.5.4) ---------- */
RT.captains = [
  { id: "thief",      name: "Thief",      items: "MB", sec: "K.1" },
  { id: "tinker",     name: "Tinker",     items: "BH", sec: "K.2" },
  { id: "ranger",     name: "Ranger",     items: "SC", sec: "K.3" },
  { id: "vagrant",    name: "Vagrant",    items: "TX", sec: "K.4" },
  { id: "arbiter",    name: "Arbiter",    items: "SX", sec: "K.5" },
  { id: "scoundrel",  name: "Scoundrel",  items: "CT", sec: "K.6" },
  { id: "adventurer", name: "Adventurer", items: "HX", sec: "K.7" },
  { id: "harrier",    name: "Harrier",    items: "MC", sec: "K.8" },
  { id: "ronin",      name: "Ronin",      items: "MS", sec: "K.9" },
  { id: "cheat",      name: "Cheat",      items: "MT", sec: "K.10", warrior: true },
  { id: "gladiator",  name: "Gladiator",  items: "SH", sec: "K.11", warrior: true },
  { id: "jailor",     name: "Jailor",     items: "CB", sec: "K.12", warrior: true }
];
RT.CP = {}; RT.captains.forEach(function (k) { RT.CP[k.id] = k; });
RT.defaultCaptains = ["jailor", "gladiator", "cheat"];   // Homeland p.15: "Play your first game with them."

/* ---------- hirelings ----------
   The Marauder four are associated with the four base factions (Marauder p.12); a faction cannot be played while its
   hireling is in play (Law p.23 §A.6.5). Names: Marauder p.12, p.15; Law p.23. The Spring Uprising–Alliance pairing is
   by elimination (Marauder p.12) and matches the rabbit hireling icons in Marauder p.20's two-player mixes. */
RT.hirelings = [
  { id: "patrol",   name: "Forest Patrol",   alt: "Feline Physicians", set: "marauder", blocks: ["marquise"],             src: "Marauder p.12" },
  { id: "dynasty",  name: "Last Dynasty",    alt: "Bluebird Nobles",   set: "marauder", blocks: ["eyrie"],                src: "Marauder p.12, p.15" },
  { id: "uprising", name: "Spring Uprising", alt: "",                  set: "marauder", blocks: ["alliance"],             src: "Marauder p.12, p.15, p.20" },
  { id: "exile",    name: "The Exile",       alt: "Brigand",           set: "marauder", blocks: ["vagabond", "vagabond2", "knaves"], src: "Law p.23 §A.6.5" }
];
RT.H = {}; RT.hirelings.forEach(function (h) { RT.H[h.id] = h; });

/* ---------- landmarks (Law p.22–23 §A.5, p.27 App. L; Homeland p.18) ---------- */
RT.landmarks = [
  { id: "foxburrow",  name: "Foxburrow",  set: "homeland", suit: "fox" },
  { id: "rabbittown", name: "Rabbittown", set: "homeland", suit: "rabbit" },
  { id: "mousehold",  name: "Mousehold",  set: "homeland", suit: "mouse" },
  { id: "pack",       name: "Landmarks Pack cards", set: "lpack", suit: "" }
];
RT.LM = {}; RT.landmarks.forEach(function (l) { RT.LM[l.id] = l; });

/* ---------- bots (configurator registry; rules, setup and teach come from data-bots.js) ----------
   Clockwork = Rootbotics §4–7; Clockwork 2 = §8–11 (Rootbotics p.15 "The next four sections refer to factions in The
   Clockwork Expansion 2"). The original Mechanical Marquise is the Riverfolk book's older bot (Riverfolk p.6–8): Mechanical Marquise 2.0
   (Rootbotics §4) is the current one — the Law's Advanced Setup sends bots to the Law of Rootbotics (Law p.22 §A.3), whose setup
   leaves out the original's spy cards (Rootbotics p.3 §3.4). Nothing retires the original (Law p.24 §C.2.4–C.2.5 still lists its
   board and spy cards), so it stays selectable, but never in the same game as Law of Rootbotics bots (see RT.normalize). */
RT.bots = [
  { id: "mm2",      faction: "marquise",  name: "Mechanical Marquise 2.0", set: "clockwork",  rb: true,  src: "Rootbotics p.4 §4" },
  { id: "eyriebot", faction: "eyrie",     name: "Electric Eyrie",          set: "clockwork",  rb: true,  src: "Rootbotics p.6 §5" },
  { id: "allybot",  faction: "alliance",  name: "Automated Alliance",      set: "clockwork",  rb: true,  src: "Rootbotics p.8 §6" },
  { id: "vagabot",  faction: "vagabond",  name: "Vagabot",                 set: "clockwork",  rb: true,  src: "Rootbotics p.10 §7" },
  { id: "vagabot2", faction: "vagabond2", name: "Vagabot",                 set: "clockwork",  rb: true,  src: "Rootbotics p.10 §7" },
  { id: "lizbot",   faction: "lizard",    name: "Logical Lizards",         set: "clockwork2", rb: true,  src: "Rootbotics p.15 §8" },
  { id: "riverbot", faction: "riverfolk", name: "Riverfolk Robots",        set: "clockwork2", rb: true,  src: "Rootbotics p.18 §9" },
  { id: "duchybot", faction: "duchy",     name: "Drillbit Duchy",          set: "clockwork2", rb: true,  src: "Rootbotics p.20 §10" },
  { id: "corvbot",  faction: "corvid",    name: "Cogwheel Corvids",        set: "clockwork2", rb: true,  src: "Rootbotics p.22 §11" },
  { id: "mmorig",   faction: "marquise",  name: "Original Mechanical Marquise", set: "riverfolk", rb: false, src: "Riverfolk p.6–8" }
];
RT.B = {}; RT.bots.forEach(function (b) { RT.B[b.id] = b; });
RT.difficulties = [   // Rootbotics p.3 §3.3.1
  { id: "easy", name: "Easy" }, { id: "default", name: "Default" },
  { id: "challenging", name: "Challenging" }, { id: "nightmare", name: "Nightmare" }
];
RT.DIFF = {}; RT.difficulties.forEach(function (d) { RT.DIFF[d.id] = d; });
RT.vagabots = [       // Rootbotics p.11 §7.7 (the Clockwork 2 three carry no difficulty label)
  { id: "thief",     name: "Thief (Easy)",      set: "clockwork",  sec: "§7.7.1" },
  { id: "tinker",    name: "Tinker (Moderate)", set: "clockwork",  sec: "§7.7.2" },
  { id: "ranger",    name: "Ranger (Difficult)", set: "clockwork", sec: "§7.7.3" },
  { id: "vagrant",   name: "Vagrant",   set: "clockwork2", sec: "§7.7.4" },
  { id: "scoundrel", name: "Scoundrel", set: "clockwork2", sec: "§7.7.5" },
  { id: "arbiter",   name: "Arbiter",   set: "clockwork2", sec: "§7.7.6" }
];
RT.VB = {}; RT.vagabots.forEach(function (v) { RT.VB[v.id] = v; });

/* ---------- variants ---------- */
RT.variants = [
  { id: "twogames", name: "Two-game match", summary: "Play twice, trading factions; add both scores (two players)",
    description: "The two-player game is best played over two full games: record scores, trade factions, play again, and add both games' scores to find the winner.", src: "LtP p.22" },
  { id: "coop", name: "Cooperative vs the bots", summary: "The humans win as a team if each of them reaches 30 before any bot",
    description: "Fully cooperative play against Law of Rootbotics bots (Rootbotics p.3), or the Riverfolk book's Cooperative Play against the original Mechanical Marquise for one to four players (Riverfolk p.6, p.8).", src: "Rootbotics p.3 · Riverfolk p.8" },
  { id: "campaign", name: "Cooperative campaign", summary: "Chain co-op games against the original Mechanical Marquise",
    description: "Each win gives the Mechanical Marquise 3 more starting points and lets each player carry one more crafted card from their last game (cards build up over the campaign).", src: "Riverfolk p.8" }
];

/* ---------- suggested faction mixes (torch = recommended for new players) ----------
   Read from the books' icon rows (rendered at 180–220 dpi): LtP p.22, Riverfolk p.8, Underworld p.8, Marauder p.20, Homeland p.20. */
RT.mixes = [
  // Base game, LtP p.22
  { src: "LtP p.22", set: "base", torch: true,  f: ["marquise", "eyrie"], note: "An ideal two-player learning game." },
  { src: "LtP p.22", set: "base", torch: false, f: ["marquise", "alliance"] },
  { src: "LtP p.22", set: "base", torch: false, f: ["eyrie", "alliance"] },
  { src: "LtP p.22", set: "base", torch: false, f: ["eyrie", "vagabond"] },
  { src: "LtP p.22", set: "base", torch: true,  f: ["marquise", "eyrie", "vagabond"] },
  { src: "LtP p.22", set: "base", torch: true,  f: ["marquise", "eyrie", "alliance"] },
  { src: "LtP p.22", set: "base", torch: false, f: ["eyrie", "alliance", "vagabond"] },
  { src: "LtP p.22", set: "base", torch: true,  f: ["marquise", "eyrie", "alliance", "vagabond"] },
  // Riverfolk p.8 ("Scenarios")
  { src: "Riverfolk p.8", set: "riverfolk", torch: true,  f: ["marquise", "eyrie", "riverfolk"] },
  { src: "Riverfolk p.8", set: "riverfolk", torch: true,  f: ["marquise", "eyrie", "lizard"] },
  { src: "Riverfolk p.8", set: "riverfolk", torch: true,  f: ["marquise", "lizard", "riverfolk"] },
  { src: "Riverfolk p.8", set: "riverfolk", torch: false, f: ["marquise", "lizard", "alliance"] },
  { src: "Riverfolk p.8", set: "riverfolk", torch: false, f: ["marquise", "lizard", "vagabond"] },
  { src: "Riverfolk p.8", set: "riverfolk", torch: false, f: ["marquise", "alliance", "riverfolk"] },
  { src: "Riverfolk p.8", set: "riverfolk", torch: false, f: ["eyrie", "lizard", "riverfolk"] },
  { src: "Riverfolk p.8", set: "riverfolk", torch: false, f: ["eyrie", "lizard", "alliance"] },
  { src: "Riverfolk p.8", set: "riverfolk", torch: false, f: ["eyrie", "lizard", "vagabond"] },
  { src: "Riverfolk p.8", set: "riverfolk", torch: false, f: ["marquise", "vagabond", "vagabond2"] },
  { src: "Riverfolk p.8", set: "riverfolk", torch: true,  f: ["marquise", "eyrie", "alliance", "riverfolk"] },
  { src: "Riverfolk p.8", set: "riverfolk", torch: true,  f: ["eyrie", "lizard", "riverfolk", "vagabond", "vagabond2"] },
  { src: "Riverfolk p.8", set: "riverfolk", torch: true,  f: ["marquise", "eyrie", "lizard", "riverfolk", "vagabond", "vagabond2"] },
  // Riverfolk p.8 — with the original Mechanical Marquise (it takes the Marquise's seat)
  { src: "Riverfolk p.8", set: "riverfolk", torch: true,  f: ["marquise", "eyrie"],    bots: { marquise: "mmorig" }, mode: "Solitaire", coop: true },
  { src: "Riverfolk p.8", set: "riverfolk", torch: false, f: ["marquise", "vagabond"], bots: { marquise: "mmorig" }, mode: "Solitaire", coop: true },
  { src: "Riverfolk p.8", set: "riverfolk", torch: false, f: ["marquise", "lizard"],   bots: { marquise: "mmorig" }, mode: "Solitaire", coop: true },
  { src: "Riverfolk p.8", set: "riverfolk", torch: true,  f: ["marquise", "vagabond", "vagabond2"], bots: { marquise: "mmorig" }, mode: "Cooperative", coop: true },
  { src: "Riverfolk p.8", set: "riverfolk", torch: true,  f: ["marquise", "eyrie", "alliance"],     bots: { marquise: "mmorig" }, mode: "Cooperative", coop: true },
  { src: "Riverfolk p.8", set: "riverfolk", torch: false, f: ["marquise", "alliance", "vagabond"],  bots: { marquise: "mmorig" }, mode: "Cooperative", coop: true },
  { src: "Riverfolk p.8", set: "riverfolk", torch: false, f: ["marquise", "vagabond", "eyrie"],     bots: { marquise: "mmorig" }, mode: "Cooperative", coop: true },
  // Underworld p.8
  { src: "Underworld p.8", set: "underworld", torch: true, f: ["marquise", "duchy"] },
  { src: "Underworld p.8", set: "underworld", torch: true, f: ["marquise", "duchy", "corvid"] },
  { src: "Underworld p.8", set: "underworld", torch: true, f: ["duchy", "eyrie", "marquise"] },
  { src: "Underworld p.8", set: "underworld", torch: true, f: ["marquise", "eyrie", "duchy", "corvid"] },
  { src: "Underworld p.8", set: "underworld", torch: true, f: ["duchy", "eyrie", "corvid", "vagabond"] },
  { src: "Underworld p.8", set: "underworld", torch: true, f: ["duchy", "eyrie", "riverfolk", "lizard"] },
  { src: "Underworld p.8", set: "underworld", torch: true, f: ["duchy", "eyrie", "alliance", "lizard", "vagabond"] },
  { src: "Underworld p.8", set: "underworld", torch: true, f: ["marquise", "duchy", "eyrie", "alliance", "corvid", "vagabond"] },
  // Marauder p.20 (two-player mixes list optional hirelings)
  { src: "Marauder p.20", set: "marauder", torch: true, f: ["hundreds", "keepers"], hire: ["patrol", "uprising", "dynasty"] },
  { src: "Marauder p.20", set: "marauder", torch: true, f: ["hundreds", "marquise"], hire: ["exile", "uprising", "dynasty"] },
  { src: "Marauder p.20", set: "marauder", torch: true, f: ["eyrie", "keepers", "alliance"] },
  { src: "Marauder p.20", set: "marauder", torch: true, f: ["vagabond", "hundreds", "marquise"] },
  { src: "Marauder p.20", set: "marauder", torch: true, f: ["hundreds", "keepers", "corvid"] },
  { src: "Marauder p.20", set: "marauder", torch: true, f: ["hundreds", "marquise", "alliance", "keepers"] },
  { src: "Marauder p.20", set: "marauder", torch: true, f: ["keepers", "duchy", "marquise", "riverfolk"] },
  { src: "Marauder p.20", set: "marauder", torch: true, f: ["hundreds", "lizard", "corvid", "riverfolk"] },
  { src: "Marauder p.20", set: "marauder", torch: true, f: ["hundreds", "keepers", "alliance", "riverfolk", "vagabond"] },
  { src: "Marauder p.20", set: "marauder", torch: true, f: ["hundreds", "keepers", "corvid", "riverfolk", "eyrie"] },
  // Homeland p.20
  { src: "Homeland p.20", set: "homeland", torch: true, f: ["diaspora", "eyrie"] },
  { src: "Homeland p.20", set: "homeland", torch: true, f: ["diaspora", "hundreds"] },
  { src: "Homeland p.20", set: "homeland", torch: true, f: ["diaspora", "duchy", "marquise"] },
  { src: "Homeland p.20", set: "homeland", torch: true, f: ["knaves", "eyrie", "marquise"] },
  { src: "Homeland p.20", set: "homeland", torch: true, f: ["marquise", "council", "hundreds"] },
  { src: "Homeland p.20", set: "homeland", torch: true, f: ["diaspora", "hundreds", "corvid", "riverfolk"] },
  { src: "Homeland p.20", set: "homeland", torch: true, f: ["eyrie", "marquise", "council", "lizard"] },
  { src: "Homeland p.20", set: "homeland", torch: true, f: ["hundreds", "eyrie", "alliance", "knaves"] },
  { src: "Homeland p.20", set: "homeland", torch: true, f: ["keepers", "eyrie", "marquise", "corvid", "knaves"] },
  { src: "Homeland p.20", set: "homeland", torch: true, f: ["hundreds", "diaspora", "lizard", "riverfolk", "corvid"] },
  { src: "Homeland p.20", set: "homeland", torch: true, f: ["council", "duchy", "hundreds", "alliance", "corvid"] }
];

/* =============================================================================
   CONFIGURATION ENGINE — pure functions shared by app.js and the Node harness.
   ============================================================================= */
RT.defaultState = function () {
  return {
    sets: new Set(["base"]),
    setup: "standard",          // "standard" (Law §5.1) | "advanced" (Law App. A) | "walkthrough" (Walkthrough booklet)
    advCards: true,             // Advanced Setup: draft with faction setup cards (true) or set up factions as in 5.1 (false) — Law §A.8
    seats: 4,                   // factions at the table, players and bots (Rootbotics p.2 §2.6: "player" includes bots)
    factions: ["marquise", "eyrie", "alliance", "vagabond"],   // in the order chosen
    map: "autumn",
    deck: "standard",
    hirelings: false,
    hirelingsDealt: [],
    landmarks: 0,               // 0, 1 or 2 (Law §A.5.1)
    lmPool: ["foxburrow", "rabbittown", "mousehold", "pack"],
    bots: {},                   // factionId -> { type, diff, traits, vbot }
    vchar: { vagabond: "thief", vagabond2: "tinker" },
    captains: RT.defaultCaptains.slice(),
    variants: new Set(),
    services: "basic",          // Riverfolk services with bots: basic, or basic + advanced (Rootbotics p.18 §9.7)
    botPref: "rb"               // the bot family chosen last: "rb" (Law of Rootbotics) or "mmorig" (see normalize)
  };
};

RT.factionAvailable = function (st, id) {
  var f = RT.F[id];
  if (!f || !st.sets.has(f.set)) return false;
  if (id === "vagabond2" && !st.sets.has("riverfolk")) return false;
  return true;
};
RT.hirelingBlocks = function (st, id) {        // the dealt hireling that blocks faction id, or null (Law §A.6.5)
  if (!st.hirelings) return null;
  for (var i = 0; i < st.hirelingsDealt.length; i++) {
    var h = RT.H[st.hirelingsDealt[i]];
    if (h && h.blocks.indexOf(id) >= 0) return h;
  }
  return null;
};
RT.botsFor = function (st, factionId) {         // bot types available for a faction
  return RT.bots.filter(function (b) { return b.faction === factionId && st.sets.has(b.set); });
};
RT.vcharsAvail = function (st) { return RT.vchars.filter(function (v) { return st.sets.has(v.set); }); };
RT.vagabotsAvail = function (st) { return RT.vagabots.filter(function (v) { return st.sets.has(v.set); }); };

/* normalize(st) mutates st into a valid configuration and returns a list of notes explaining forced changes. */
RT.normalize = function (st) {
  var notes = [];
  st.sets.add("base");
  if (["standard", "advanced", "walkthrough"].indexOf(st.setup) < 0) st.setup = "standard";
  st.seats = Math.max(2, Math.min(6, st.seats | 0 || 4));

  // hirelings (Law §A.6; Marauder p.12): need the Marauder hirelings or a Hireling Pack
  if (!(st.sets.has("marauder") || st.sets.has("hpacks"))) st.hirelings = false;
  st.hirelingsDealt = st.hirelings ? st.hirelingsDealt.filter(function (h, i, a) {
    return RT.H[h] && st.sets.has(RT.H[h].set) && a.indexOf(h) === i;
  }).slice(0, 3) : [];

  // factions: owned, not blocked by a dealt hireling, Knaves exclusive with the Vagabond (Law p.21 §18.2.1)
  var fs = [];
  st.factions.forEach(function (id) {
    if (fs.indexOf(id) >= 0 || !RT.factionAvailable(st, id)) return;
    var hb = RT.hirelingBlocks(st, id);
    if (hb) { notes.push(RT.F[id].name + " was removed: its hireling (" + hb.name + ") is in play."); return; }
    fs.push(id);
  });
  // a second Vagabond needs the first (Law §9.7)
  if (fs.indexOf("vagabond2") >= 0 && fs.indexOf("vagabond") < 0) fs.splice(fs.indexOf("vagabond2"), 1);
  // Knaves vs Vagabond: keep whichever was chosen last
  var kn = fs.indexOf("knaves"), vb = fs.indexOf("vagabond");
  if (kn >= 0 && vb >= 0) {
    if (kn > vb) { fs = fs.filter(function (x) { return x !== "vagabond" && x !== "vagabond2"; }); }
    else { fs = fs.filter(function (x) { return x !== "knaves"; }); }
    notes.push("The Knaves of the Deepwood cannot be played in the same game as the Vagabond (Law p.21 §18.2.1).");
  }
  if (fs.length > st.seats) fs = fs.slice(0, st.seats);
  st.factions = fs;

  if (!RT.M[st.map] || !st.sets.has(RT.M[st.map].set)) st.map = "autumn";
  var dk = RT.decks.filter(function (d) { return d.id === st.deck && st.sets.has(d.set); })[0];
  if (!dk) st.deck = "standard";

  // landmarks (Law §A.5; Homeland p.18): Homeland's three or the Landmarks Pack
  st.lmPool = st.lmPool.filter(function (id, i, a) { return RT.LM[id] && st.sets.has(RT.LM[id].set) && a.indexOf(id) === i; });
  if (!(st.sets.has("homeland") || st.sets.has("lpack"))) st.landmarks = 0;
  st.landmarks = Math.max(0, Math.min(2, st.landmarks | 0));
  if (st.landmarks > 0 && st.lmPool.length === 0) {
    st.lmPool = RT.landmarks.filter(function (l) { return st.sets.has(l.set); }).map(function (l) { return l.id; });
  }
  // the Homeland three count one card each; the Landmarks Pack holds six cards (Law §C.10.1)
  // On the Marsh with 5+ players the Homeland three are already on the map (Law p.28 §M.5.1.II)
  var lmOnMap = (st.map === "marsh" && st.seats >= 5) ? ["foxburrow", "rabbittown", "mousehold"] : [];
  if (st.landmarks > 0 && lmOnMap.length && st.sets.has("lpack") && st.lmPool.every(function (id) { return lmOnMap.indexOf(id) >= 0; })) st.lmPool.push("pack");
  var poolCards = st.lmPool.reduce(function (n, id) { return lmOnMap.indexOf(id) >= 0 ? n : n + (id === "pack" ? 6 : 1); }, 0);
  if (st.landmarks > poolCards) {
    if (lmOnMap.length && !poolCards) notes.push("On the Marsh with 5 or more players, Mousehold, Foxburrow and Rabbittown are already on the map, so only Landmarks Pack cards can be added as landmarks (Law p.28 §M.5.1.II).");
    st.landmarks = poolCards;
  }

  // Vagabond characters: owned, distinct
  var vav = RT.vcharsAvail(st).map(function (v) { return v.id; });
  ["vagabond", "vagabond2"].forEach(function (seat) {
    if (vav.indexOf(st.vchar[seat]) < 0) st.vchar[seat] = seat === "vagabond" ? "thief" : "tinker";
  });
  // Knave Captains: three distinct (Law p.21 §18.3.2)
  var caps = st.captains.filter(function (k, i, a) { return RT.CP[k] && a.indexOf(k) === i; });
  RT.defaultCaptains.concat(RT.captains.map(function (k) { return k.id; })).forEach(function (k) {
    if (caps.length < 3 && caps.indexOf(k) < 0) caps.push(k);
  });
  st.captains = caps.slice(0, 3);

  // bots: owned, faction in play, at least one human (Rootbotics p.3 §3.2 replaces factions with bot factions)
  var bots = {};
  st.factions.forEach(function (id) {
    var b = st.bots[id];
    if (!b) return;
    var t = RT.B[b.type];
    if (!t || t.faction !== id || !st.sets.has(t.set)) return;
    var diffOk = RT.difficulties.some(function (d) { return d.id === b.diff; });
    var vbs = RT.vagabotsAvail(st).map(function (v) { return v.id; });
    bots[id] = { type: b.type, diff: diffOk ? b.diff : "default", traits: !!b.traits,
                 vbot: (t.id === "vagabot" || t.id === "vagabot2") ? (vbs.indexOf(b.vbot) >= 0 ? b.vbot : vbs[0]) : undefined };
  });
  // the original Mechanical Marquise and the Law of Rootbotics bots aren't combined: their setups conflict (Riverfolk p.6 adds the
  // spy cards and deals it a Schedule of Orders; Rootbotics p.3 §3.4 leaves the spy cards out and bots draw nothing). Keep the family chosen last.
  var rbIds = Object.keys(bots).filter(function (id) { return RT.B[bots[id].type].rb; });
  if (bots.marquise && bots.marquise.type === "mmorig" && rbIds.length) {
    if (st.botPref === "mmorig") {
      rbIds.forEach(function (id) { delete bots[id]; });
      notes.push("The original Mechanical Marquise isn't combined with Law of Rootbotics bots (their setups conflict: Riverfolk p.6 adds the spy cards, Rootbotics p.3 §3.4 leaves them out), so the other bots are back to human players. For several bots, use Mechanical Marquise 2.0.");
    } else {
      delete bots.marquise;
      notes.push("The original Mechanical Marquise isn't combined with Law of Rootbotics bots (Riverfolk p.6 vs Rootbotics p.3 §3.4), so the Marquise is back to a human player — choose Mechanical Marquise 2.0 for a Marquise bot.");
    }
  }
  // the Clockwork boxes have one Vagabot faction board and the Law of Rootbotics never covers two Vagabots
  if (bots.vagabond && bots.vagabond2) {
    delete bots.vagabond2;
    notes.push("The Clockwork expansions have one Vagabot faction board (Rootbotics p.10–12 §7; Law p.25 §C.6.4, §C.7.4) and the Law of Rootbotics doesn't cover two Vagabots, so the second Vagabond is back to a human player.");
  }
  var botIds = Object.keys(bots);
  if (st.factions.length && botIds.length >= st.seats) { delete bots[botIds[botIds.length - 1]]; notes.push("At least one faction must be played by a person."); }
  st.bots = bots;
  // two human Vagabonds need different character cards; a Vagabot uses its own cards (Rootbotics p.10 §7.3.1)
  if (st.factions.indexOf("vagabond2") >= 0 && !bots.vagabond && !bots.vagabond2 && st.vchar.vagabond === st.vchar.vagabond2) {
    st.vchar.vagabond2 = vav.filter(function (v) { return v !== st.vchar.vagabond; })[0];
  }
  var nb = Object.keys(bots).length;
  var mmorig = bots.marquise && bots.marquise.type === "mmorig";

  // corner starters: five or more force Advanced Setup (Law p.4 §5; Marauder p.19)
  var corners = st.factions.filter(function (id) { return RT.F[id].corner; }).length;
  if (st.setup === "standard" && corners >= 5) {
    st.setup = "advanced"; st.advCards = true;
    notes.push("Five or more factions that start in corner clearings must use the Advanced Setup (Law p.4 §5).");
  }
  if (st.setup === "advanced" && corners >= 5) st.advCards = true;
  if (!st.sets.has("marauder") && st.setup === "advanced" && corners < 5) st.advCards = false;  // setup cards: Marauder (+ Homeland's own)
  // insurgent setup cards (pictured: Woodland Alliance, Marauder p.18; Twilight Council, Homeland p.19): two-player drafts remove insurgents (Law §A.8.2.I)
  if (st.setup === "advanced" && st.advCards && st.seats === 2 && !st.hirelings) {
    [["council", "Twilight Council", "Homeland p.19", "homeland"], ["alliance", "Woodland Alliance", "Marauder p.18", "marauder"]].forEach(function (x) {
      if (st.factions.indexOf(x[0]) >= 0 && st.sets.has(x[3]))
        notes.push("The " + x[1] + "'s setup card is insurgent: with two players the insurgent cards are removed before dealing, so it can't be drafted unless you keep them for a game with hirelings (Law p.23 §A.8.2.I; " + x[2] + ").");
    });
  }

  // variants
  var v = new Set();
  if (st.variants.has("twogames") && st.seats === 2 && nb === 0) v.add("twogames");
  if (st.variants.has("coop") && nb > 0) {
    var mmOnlyCoop = mmorig && !Object.keys(bots).some(function (id) { return RT.B[bots[id].type].rb; });
    if (mmOnlyCoop && st.factions.length - nb > 4) notes.push("The Riverfolk book's cooperative game against the original Mechanical Marquise is for one to four players (Riverfolk p.6) — with more humans, play it competitively.");
    else v.add("coop");
  }
  if (st.variants.has("campaign") && mmorig && v.has("coop")) v.add("campaign");
  st.variants = v;
  if (st.services !== "advanced") st.services = "basic";
  if (st.botPref !== "mmorig") st.botPref = "rb";
  return notes;
};

/* ctx(st): the context object every data function receives (also the aid:config detail for the glossary and search). */
RT.ctx = function (st) {
  var W = st.setup === "walkthrough";
  var order = RT.factions.map(function (f) { return f.id; });
  var facs = W ? RT.baseFour.slice() : order.filter(function (id) { return st.factions.indexOf(id) >= 0; });
  var bots = W ? {} : st.bots;
  var botFacs = facs.filter(function (id) { return !!bots[id]; });
  var humanFacs = facs.filter(function (id) { return !bots[id]; });
  var p = W ? 4 : st.seats;
  var reach = facs.reduce(function (n, id) { return n + RT.F[id].reach; }, 0);
  var corners = facs.filter(function (id) { return RT.F[id].corner; }).length;
  var map = W ? "autumn" : st.map;
  var deck = (W || st.setup !== "advanced") ? "standard" : st.deck;   // the deck choice is Advanced Setup step 2 (Law p.22 §A.2)
  var hire = !W && st.hirelings;
  var lm = W ? 0 : st.landmarks;
  var adv = st.setup === "advanced";
  var advCards = adv && st.advCards;
  var c = {
    st: st,
    has: function (id) { return st.sets.has(id); },
    setup: st.setup, std: st.setup === "standard", adv: adv, walk: W, advCards: advCards,
    p: p, nfac: facs.length, need: Math.max(0, p - facs.length),
    facs: facs, humanFacs: humanFacs, botFacs: botFacs,
    fac: function (id) { return facs.indexOf(id) >= 0; },
    bot: function (id) { return bots[id] ? bots[id].type : null; },
    botCfg: function (id) { return bots[id] || null; },
    human: function (id) { return facs.indexOf(id) >= 0 && !bots[id]; },
    nbots: botFacs.length, humans: p - botFacs.length,
    anyBot: botFacs.length > 0,
    rb: botFacs.some(function (id) { return RT.B[bots[id].type].rb; }),
    mmorig: !!(bots.marquise && bots.marquise.type === "mmorig"),
    vbH: (facs.indexOf("vagabond") >= 0 && !bots.vagabond) || (facs.indexOf("vagabond2") >= 0 && !bots.vagabond2),   // a person plays a Vagabond
    map: map, deck: deck,
    hire: hire, hireDealt: function (id) { return hire && st.hirelingsDealt.indexOf(id) >= 0; },
    lm: lm, lmPool: function (id) { return lm > 0 && st.lmPool.indexOf(id) >= 0 && !(map === "marsh" && p >= 5 && ["foxburrow", "rabbittown", "mousehold"].indexOf(id) >= 0); },
    mod: function (id) {
      if (id === "hirelings") return hire;
      if (id === "landmarks") return lm > 0;
      if (id === "bots") return botFacs.length > 0;
      if (id === "twovb") return facs.indexOf("vagabond2") >= 0;
      return false;
    },
    v: function (id) { return !W && st.variants.has(id); },
    vchar: function (seat) { return RT.VC[W && seat === "vagabond" ? "thief" : st.vchar[seat]]; },
    captains: st.captains.map(function (k) { return RT.CP[k]; }),
    services: st.services,
    reach: reach, reachNeed: RT.reach[p], corners: corners,
    cornerProblem: corners >= 5 && !(advCards && st.sets.has("marauder")),
    two: p === 2,
    solo: botFacs.length > 0 && p - botFacs.length === 1,
    vb: facs.indexOf("vagabond") >= 0 || facs.indexOf("vagabond2") >= 0,
    twovb: facs.indexOf("vagabond2") >= 0
  };
  // dominance cards out of the deck: two players (Law p.5 §5.1.3); with bots, one or two humans (Rootbotics p.3 §3.4) or the fully
  // cooperative game (Rootbotics p.3); with the original Mechanical Marquise always — the spy cards replace them (Riverfolk p.6)
  c.noDom = c.anyBot ? ((c.mmorig && !c.rb) || c.humans <= 2 || c.v("coop")) : c.two;
  return c;
};

/* small helpers for data files */
RT.join = function (parts) { return parts.filter(Boolean).join(" · "); };
RT.ul = function (items) { items = items.filter(Boolean); return items.length ? "<ul><li>" + items.join("</li><li>") + "</li></ul>" : ""; };
RT.ol = function (items) { items = items.filter(Boolean); return items.length ? "<ol><li>" + items.join("</li><li>") + "</li></ol>" : ""; };
RT.fname = function (id) { return RT.F[id] ? RT.F[id].name : id; };
RT.list = function (arr) {            // ["a","b","c"] -> "a, b and c"
  if (arr.length <= 1) return arr.join("");
  return arr.slice(0, -1).join(", ") + " and " + arr[arr.length - 1];
};

/* registries filled by the other data files */
RT.fsetup = {};        // factionId -> { std(c), stdSrc(c), adv(c), advSrc(c) }        (data-setup.js)
RT.factionRef = {};    // factionId -> { title, html(c), src(c) }                       (data-ref.js / data-factions.js)
RT.factionTeach = {};  // factionId -> { h, body(c) }                                   (data-teach.js / data-factions.js)
RT.botRef = {};        // bot type id -> { title, html(c), src(c) }                     (data-bots.js)
RT.botTeach = {};      // bot type id -> { h, body(c) }                                 (data-bots.js)
RT.botSetup = {};      // bot type id -> { t, d(c), src(c) }                            (data-bots.js)
