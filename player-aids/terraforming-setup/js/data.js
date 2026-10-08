/* =============================================================================
   Terraforming Mars — Setup & Reference Utility · data
   Every rule below comes from the rulebooks in the game folder (see the citations):
     Base      TMRULESFINAL.pdf (printed page numbers = PDF pages)
     H&E wrap  Hellas & Elysium box wrap        A&V wrap  Amazonis & Vastitas box wrap
     U&C wrap  Utopia & Cimmeria box wrap       M&A       Milestones & Awards leaflet
     Venus     Venus Next                        Prelude / Prelude 2
     Colonies                                     Turmoil   (image-only PDF; printed pages 2–7)
     Automa A / B / C  (MarsBot — its rules live in the optional js/data-automa.js)
   Venus, Prelude, Prelude 2, Colonies and M&A print no page numbers: "p.N" counts the
   leaflet's pages from its cover (p.1). Where a newer book changes an older one, the newer
   rule is shown and both are cited.
   Context c (every when/t/d/src/html/body function): c.has(setId), c.p (human players),
   c.mode ("standard" | "solo" | "automa"), c.map (map id), c.mod(optionId) (boolean),
   c.choice(optionId) (chosen choice id or null).
   ============================================================================= */
var TM = {};

/* ---------------- helpers ---------------- */
TM.u = {
  solo: (c) => c.mode === "solo",
  automa: (c) => c.mode === "automa",
  multi: (c) => c.mode === "standard",
  /* seats at the table for setup purposes: MarsBot games are set up as two-player games (Automa A p.3) */
  seats: (c) => (c.mode === "automa" ? 2 : c.p),
  map: (c) => TM.maps.find((m) => m.id === c.map) || TM.maps[0],
  preludeCards: (c) => c.has("prelude") && !c.mod("prelude-nocards"),
  soloGens: (c) => (c.has("prelude") && !c.mod("prelude-nocards") ? 12 : 14),
  solar: (c) => c.has("venus") || c.has("colonies") || c.has("turmoil"),
  /* World Government Terraforming runs unless skipped (Venus p.3); against MarsBot it is not carried out (Automa C p.3) */
  wgt: (c) => c.has("venus") && !c.mod("venus-nowgt") && c.mode !== "automa",
  mandaTiles: (c) => c.has("ma") && c.mode !== "solo",
  twoPlayer: (c) => (c.mode === "automa" ? true : c.p === 2),
  you: (c, many, one) => (c.p === 1 ? one : many),
  src: (...parts) => parts.filter(Boolean).join(" · "),
  ul: (items) => "<ul>" + items.filter(Boolean).map((x) => "<li>" + x + "</li>").join("") + "</ul>",
  ol: (items) => "<ol>" + items.filter(Boolean).map((x) => "<li>" + x + "</li>").join("") + "</ol>",
  mapSrc: (c) => { const m = TM.u.map(c); return m.id === "tharsis" ? "" : m.src; },
  corpDeal: (c) => (c.mod("corp-deal") ? c.choice("corp-deal") : null),
  setName: (id) => ({ venus: "Venus Next", prelude: "Prelude", colonies: "Colonies" }[id] || id),
  /* true when js/data-automa.js (TM_AUTOMA) is loaded: its MarsBot steps/teach then cover the MarsBot-specific
     lines, so the core text avoids repeating them */
  automaModule: () => { try { return typeof TM_AUTOMA !== "undefined" && !!TM_AUTOMA; } catch (e) { return false; } }
};

/* ---------------- source tags ---------------- */
TM.expMeta = {
  base:     { name: "Base game",           cls: "tag-base" },
  venus:    { name: "Venus Next",          cls: "tag-venus" },
  prelude:  { name: "Prelude",             cls: "tag-prelude" },
  prelude2: { name: "Prelude 2",           cls: "tag-prelude2" },
  colonies: { name: "Colonies",            cls: "tag-colonies" },
  turmoil:  { name: "Turmoil",             cls: "tag-turmoil" },
  he:       { name: "Hellas & Elysium",    cls: "tag-he" },
  av:       { name: "Amazonis & Vastitas", cls: "tag-av" },
  uc:       { name: "Utopia & Cimmeria",   cls: "tag-uc" },
  ma:       { name: "Milestones & Awards", cls: "tag-ma" },
  automa:   { name: "MarsBot",             cls: "tag-automa" },
  solo:     { name: "Solo",                cls: "tag-solo" },
  variant:  { name: "Variant",             cls: "tag-variant" }
};

/* ---------------- configurator: sets, modes, maps, options ---------------- */
TM.sets = [
  { id: "base", short: "Terraforming Mars", year: "Base game", blurb: "The base game: the Tharsis board, 17 corporations, 208 project cards, the standard game for 2–5 players, the solo game and the Corporate Era and Draft variants. Always in play." },
  { id: "venus", short: "Venus Next", year: "Expansion", blurb: "The Venus board adds a fourth global parameter, floaters, the Air Scrapping standard project, the Hoverlord milestone, the Venuphile award and the Solar phase's World Government Terraforming." },
  { id: "prelude", short: "Prelude", year: "Expansion", blurb: "Prelude cards jump-start every corporation during setup; also the TR solo variant." },
  { id: "prelude2", short: "Prelude 2", year: "Needs Prelude", requires: ["prelude"], blurb: "More Preludes (some with actions and effects), the 15 M€ Prelude refund, separate discard piles and the Extended Start variant. Played together with Prelude." },
  { id: "colonies", short: "Colonies", year: "Expansion", blurb: "Colony tiles to settle and trade with, a trade fleet for every player, and colony production in the Solar phase." },
  { id: "turmoil", short: "Turmoil", year: "Expansion", blurb: "The Terraforming Committee: six parties, delegates, a ruling party each generation, Global Events three generations ahead — and 1 TR lost every generation." },
  { id: "he", short: "Hellas & Elysium", year: "Map boards", blurb: "Two alternative boards, each with new placement bonuses, ocean areas, milestones and awards." },
  { id: "av", short: "Amazonis & Vastitas", year: "Map boards", blurb: "Amazonis Planitia (a larger map with longer global parameters) and Vastitas Borealis, with new bonuses, milestones and awards." },
  { id: "uc", short: "Utopia & Cimmeria", year: "Map boards", blurb: "Utopia Planitia and Terra Cimmeria, with new bonuses, milestones and awards." },
  { id: "ma", short: "Milestones & Awards", year: "70 tiles", blurb: "70 milestone and award tiles: pick 5 of each, at random or by choice, to replace the ones printed on the board." },
  { id: "automa", short: "MarsBot", year: "Automa", blurb: "The MarsBot automa: a solo opponent that plays as a second player (choose ‘Versus MarsBot’ below)." }
];

TM.modes = [
  { id: "standard", name: "Standard game", blurb: "2–5 players compete to terraform Mars. Most victory points wins.", minPlayers: 2, maxPlayers: 5, src: "Base p.7" },
  { id: "solo", name: "Solo game", blurb: "The rulebook’s solo variant: TR 14, no milestones or awards — finish terraforming by the end of generation 14 (12 with Prelude cards).", minPlayers: 1, maxPlayers: 1, src: "Base p.13" },
  { id: "automa", name: "Versus MarsBot", blurb: "You against the MarsBot automa, set up as a two-player game. Beat MarsBot’s score to win.", requires: ["automa"], minPlayers: 1, maxPlayers: 1, src: "Automa A p.2–3" }
];

/* Milestones & awards printed on each board: [name, condition]. */
TM.maps = [
  {
    id: "tharsis", name: "Tharsis", set: "base", box: "Base game", src: "Base p.4",
    blurb: "The base game board: plant bonuses around the equator, steel and titanium on the ridges.",
    params: { temp: 8, o2: 14, oceans: 9 },
    bonus: ["Oxygen <b>8 %</b>: raise the temperature 1 step", "Temperature <b>−24 °C</b> and <b>−20 °C</b>: +1 heat production each", "Temperature <b>0 °C</b>: place an ocean tile"],
    bonusSrc: "Base p.4",
    special: [
      "Plant bonuses cluster around the equator; mountain ridges give steel and titanium; a few sites, like the Viking lander site, give cards.",
      "3 areas are reserved for specific cities: <b>Noctis City</b> on the map, plus <b>Phobos Space Haven</b> and <b>Ganymede Colony</b> off it. No other tiles may go there.",
      "12 areas are reserved for oceans, for 9 ocean tiles.",
      "The map includes Valles Marineris and 3 of the 4 great volcanoes — only the region around Olympus Mons is missing."
    ],
    specialSrc: "Base p.4, p.15 · Venus p.2",
    volcanoes: true,
    milestones: [["Terraformer", "a terraform rating of at least 35"], ["Mayor", "own at least 3 city tiles"], ["Gardener", "own at least 3 greenery tiles"], ["Builder", "at least 8 building tags in play"], ["Planner", "at least 16 cards in your hand when you claim it"]],
    awards: [["Landlord", "most tiles in play"], ["Banker", "highest M€ production"], ["Scientist", "most science tags in play"], ["Thermalist", "most heat resource cubes"], ["Miner", "most steel and titanium resource cubes"]],
    maSrc: "Base p.10–11"
  },
  {
    id: "hellas", name: "Hellas", set: "he", box: "Hellas & Elysium", src: "H&E wrap",
    blurb: "The south pole and the Hellas sea: heat bonuses, and a South Pole site that pays out an ocean.",
    params: { temp: 8, o2: 14, oceans: 9 },
    bonus: ["Oxygen <b>8 %</b>: raise the temperature 1 step", "Temperature <b>−24 °C</b> and <b>−20 °C</b>: +1 heat production each", "Temperature <b>0 °C</b>: place an ocean tile"],
    bonusSrc: "H&E wrap (board picture)",
    special: [
      "Plant bonuses lie at the <b>top</b> of the map, along the equator; Argyre Planitia and its mountains overlap the Tharsis board.",
      "New placement bonus: <b>heat</b> — in the Hellas sea and around the south pole.",
      "<b>South Pole:</b> pay <b>6 M€</b> to place a tile there, and you get an <b>ocean tile</b> (with its TR) to place on any available ocean area.",
      "No volcanoes and no Noctis region: the <b>Noctis City</b> and <b>Lava Flows</b> tiles lose their placement restrictions and may go on any non-ocean area."
    ],
    specialSrc: "H&E wrap",
    volcanoes: false,
    milestones: [["Diversifier", "8 different tags in play"], ["Tactician", "5 cards with requirements in play"], ["Polar Explorer", "3 tiles on the two bottom rows"], ["Energizer", "6 energy production"], ["Rim Settler", "3 Jovian tags"]],
    awards: [["Cultivator", "most greenery tiles"], ["Magnate", "most automated cards (green cards) in play"], ["Space Baron", "most space tags (event cards do not count)"], ["Excentric", "most resources on cards"], ["Contractor", "most building tags (event cards do not count)"]],
    maSrc: "H&E wrap"
  },
  {
    id: "elysium", name: "Elysium", set: "he", box: "Hellas & Elysium", src: "H&E wrap",
    blurb: "West of Tharsis, from Olympus Mons to Elysium Montes: four volcanic sites, no special bonuses.",
    params: { temp: 8, o2: 14, oceans: 9 },
    bonus: ["Oxygen <b>8 %</b>: raise the temperature 1 step", "Temperature <b>−24 °C</b> and <b>−20 °C</b>: +1 heat production each", "Temperature <b>0 °C</b>: place an ocean tile"],
    bonusSrc: "H&E wrap (board picture)",
    special: [
      "No special placement bonuses on this map. The northern lowlands (Vastitas Borealis) reach towards the equator; the south is crater-saturated highland. Arsia Mons overlaps the Tharsis board.",
      "No Noctis region: <b>Noctis City</b> may be placed without its restriction.",
      "Four volcanic sites where the <b>Lava Flows</b> tile can go: <b>Arsia Mons, Olympus Mons, Elysium Mons</b> and <b>Hecates Tholus</b>."
    ],
    specialSrc: "H&E wrap",
    volcanoes: true,
    milestones: [["Generalist", "you have increased all 6 productions by at least 1 step (starting production from corporation cards counts as an increase)"], ["Specialist", "at least 10 production of any one resource"], ["Ecologist", "4 bio tags (plant, microbe and animal tags count)"], ["Tycoon", "15 project cards in play (blue and green cards)"], ["Legend", "5 played events (red cards)"]],
    awards: [["Celebrity", "most cards in play (not events) with a cost of at least 20 M€"], ["Industrialist", "most steel and energy resources"], ["Desert Settler", "most tiles south of the equator (the four bottom rows)"], ["Estate Dealer", "most tiles adjacent to ocean tiles"], ["Benefactor", "highest terraform rating — count this award first!"]],
    maSrc: "H&E wrap"
  },
  {
    id: "amazonis", name: "Amazonis Planitia", set: "av", box: "Amazonis & Vastitas", src: "A&V wrap",
    blurb: "A larger map with longer global parameters, for a better 4–5 player game: energy, wild-resource and delegate bonuses.",
    params: { temp: 14, o2: 18, oceans: 11 },
    paramsSrc: "A&V wrap (text and board picture)",
    bonus: ["Oxygen <b>7 %</b>: draw a card", "Oxygen <b>11 %</b>: raise the temperature 1 step", "Temperature <b>−24 °C</b> and <b>−20 °C</b>: +1 heat production each", "Temperature <b>−12 °C</b>: +1 plant production", "Temperature <b>0 °C</b>: place an ocean tile"],
    bonusSrc: "A&V wrap (board picture)",
    special: [
      "A larger map with <b>longer global parameters</b>, for a better 4–5 player experience (or more room and more terraforming for everyone): oxygen runs to <b>18 %</b>, temperature to <b>+14 °C</b>, and there are <b>11</b> ocean tiles.",
      "Highlighted by <b>energy</b> bonuses; <b>wild resource</b> bonuses give you any standard resource.",
      "<b>Delegate</b> bonuses let you place a delegate for free from the Reserve (ignore them if you’re not playing Turmoil).",
      "<b>Noctis City</b> may be placed without its restriction. Volcanic areas: <b>Olympus Mons, Ascraeus Mons, Pavonis Mons, Arsia Mons</b> and <b>Hecates Tholus</b>.",
      "The box adds 2 ocean tiles, 13 city/greenery tiles, a Standard Project tile (the board has no standard-project panel) and an optional Venus board with a longer Venus track."
    ],
    specialSrc: "A&V wrap",
    volcanoes: true,
    milestones: [["Terran", "5 Earth tags"], ["Landshaper", "1 greenery tile, 1 special tile and 1 city tile (they need not be adjacent)"], ["Merchant", "3 of each standard resource"], ["Sponsor", "3 cards in play costing 20 M€ or more"], ["Lobbyist", "all 7 of your delegates in play (none in the Lobby or Reserve)"]],
    awards: [["Collector", "most types of resources, on the player board and on cards (different kinds of microbes count as 1 type)"], ["Innovator", "most played cards (event cards also count!)"], ["Constructor", "most colonies and city tiles"], ["Manufacturer", "most steel and heat production combined"], ["Physicist", "most science and space tags"]],
    maSrc: "A&V wrap"
  },
  {
    id: "vastitas", name: "Vastitas Borealis", set: "av", box: "Amazonis & Vastitas", src: "A&V wrap",
    blurb: "The ancient northern sea around the North Pole: a tile on the pole releases frozen CO₂ for a temperature step; Viking delegate sites.",
    params: { temp: 8, o2: 14, oceans: 9 },
    bonus: ["Oxygen <b>8 %</b>: raise the temperature 1 step", "Temperature <b>−24 °C</b> and <b>−20 °C</b>: +1 heat production each", "Temperature <b>0 °C</b>: place an ocean tile"],
    bonusSrc: "A&V wrap (board picture)",
    special: [
      "<b>North Pole:</b> placing a tile there releases frozen carbon dioxide — it <b>raises the temperature 1 step</b> but <b>costs you 4 M€</b>.",
      "<b>Viking 1</b> and <b>Viking 2</b> landing sites let you place a delegate for free from the Reserve (ignore if you’re not playing Turmoil).",
      "No Noctis region: <b>Noctis City</b> may be placed without its restriction. Volcanic areas for tiles like Lava Flows: <b>Hecates Tholus, Elysium Mons, Alba Mons</b> and <b>Uranius Tholus</b>."
    ],
    specialSrc: "A&V wrap",
    volcanoes: true,
    milestones: [["Agronomist", "4 plant tags"], ["Engineer", "10 production of energy and heat combined"], ["Spacefarer", "4 space tags"], ["Geologist", "3 tiles on, or adjacent to, volcanic areas (you may mark any tile covering a volcanic area with a gold cube until this is claimed)"], ["Farmer", "5 animal and microbe resources combined"]],
    awards: [["Traveller", "most Jovian and Earth tags"], ["Landscaper", "most connected tiles (each player counts their largest group of tiles)"], ["Highlander", "most tiles not adjacent to ocean"], ["Promoter", "most event cards played"], ["Blacksmith", "highest production of steel and titanium combined"]],
    maSrc: "A&V wrap"
  },
  {
    id: "utopia", name: "Utopia Planitia", set: "uc", box: "Utopia & Cimmeria", src: "U&C wrap",
    blurb: "The northern lava plain: plant bonuses away from the equator, geothermal energy by the pole, landing-site card bonuses.",
    params: { temp: 8, o2: 14, oceans: 9 },
    bonus: ["Oxygen <b>8 %</b>: raise the temperature 1 step", "Temperature <b>−24 °C</b> and <b>−20 °C</b>: +1 heat production each", "Temperature <b>0 °C</b>: place an ocean tile"],
    bonusSrc: "U&C wrap (board picture)",
    special: [
      "Plentiful <b>plant</b> bonuses away from the equator (mineral-rich lava soil); the thin crust near the <b>North Pole</b> suits geothermal <b>energy</b>.",
      "Settling the <b>Viking 2</b> or <b>Beagle 2</b> landing sites gains you <b>2 extra cards</b>.",
      "No volcanoes and no Noctis region: <b>Noctis City</b> and cards that place tiles on volcanic areas (for example <b>Lava Flows</b>) lose their placement restrictions and may go on any non-reserved area."
    ],
    specialSrc: "U&C wrap",
    volcanoes: false,
    milestones: [["Manager", "3 special tiles in play"], ["Pioneer", "3 colonies in play"], ["Trader", "3 different types of resources on cards (different kinds of microbes count as 1 type)"], ["Metallurgist", "6 steel production and titanium production combined"], ["Researcher", "4 science tags"]],
    awards: [["Suburbian", "most tiles along the border of the map"], ["Investor", "most Earth tags"], ["Botanist", "highest plant production"], ["Incorporator", "most cards played with a cost of 10 M€ or less"], ["Metropolist", "most city tiles"]],
    maSrc: "U&C wrap"
  },
  {
    id: "cimmeria", name: "Terra Cimmeria", set: "uc", box: "Utopia & Cimmeria", src: "U&C wrap",
    blurb: "The cratered southern highlands: the best steel and titanium, oceans along the edges, a colony site at Gale crater.",
    params: { temp: 8, o2: 14, oceans: 9 },
    bonus: ["Oxygen <b>8 %</b>: raise the temperature 1 step", "Temperature <b>−24 °C</b> and <b>−20 °C</b>: +1 heat production each", "Temperature <b>0 °C</b>: place an ocean tile"],
    bonusSrc: "U&C wrap (board picture)",
    special: [
      "The best place on the planet for <b>steel</b> and <b>titanium</b>; the ocean areas lie along the <b>edges</b> of the region.",
      "<b>MSL Curiosity (Gale crater):</b> placing a tile there places a <b>colony for 5 M€</b> (ignore if you’re not playing Colonies).",
      "No Noctis region: <b>Noctis City</b> may be placed without its restriction. Volcanic areas for tiles like Lava Flows: <b>Albor Tholus, Tyrrhenus Mons, Hadriacus Mons</b> and <b>Apollinaris Mons</b>."
    ],
    specialSrc: "U&C wrap",
    volcanoes: true,
    milestones: [["Planetologist", "2 Earth tags, 2 Venus tags and 2 Jovian tags"], ["Architect", "3 city tags"], ["Coastguard", "3 tiles adjacent to ocean"], ["Forester", "3 plant production"], ["Fundraiser", "12 M€ production"]],
    awards: [["Electrician", "most power tags"], ["Founder", "most tiles adjacent to special tiles"], ["Mogul", "highest total production of all resources except M€"], ["Zoologist", "most animal and microbe resources"], ["Forecaster", "most played cards with requirements"]],
    maSrc: "U&C wrap"
  }
];

/* the 70 Milestones & Awards tiles (M&A p.2–4) */
TM.maTiles = {
  milestones: [
    ["Briber", "pay 12 M€ on top of the normal 8 M€ claim cost (20 M€ total)"], ["Builder", "7 building tags"], ["Coastguard", "3 tiles adjacent to ocean"],
    ["Diversifier", "8 different tags"], ["Ecologist", "4 bio tags"], ["Energizer", "6 energy production"],
    ["Engineer", "10 energy production and heat production combined"], ["Farmer", "5 animal and microbe resources combined"], ["Forester", "3 plant production"],
    ["Fundraiser", "12 M€ production"], ["Gardener", "3 greeneries"], ["Generalist", "1 production of each resource (without the Corporate Era: 2 of each)"],
    ["Geologist", "3 tiles on, or adjacent to, volcanic areas (bold names on the maps); replace it on a map without volcanic areas"],
    ["Hydrologist", "having placed 4 oceans (put owner markers on your oceans until it’s claimed — they don’t make the oceans yours)"],
    ["Landshaper", "1 city, 1 greenery and 1 special tile"], ["Legend", "4 event cards"], ["Lobbyist", "all 7 of your delegates in parties (Party Leaders and the Chairman count)"],
    ["Mayor", "3 cities"], ["Merchant", "2 of each standard resource (after paying the claim cost)"], ["Metallurgist", "6 steel and titanium production combined"],
    ["Philantropist", "5 cards with non-negative VP (cards like ‘1 VP per 2 microbes’ count)"], ["Pioneer", "4 colonies"], ["Planetologist", "2 Earth, 2 Venus and 2 Jovian tags"],
    ["Planner", "16 cards in hand when you claim it"], ["Producer", "combined production of at least 16 (negative M€ production subtracts)"], ["Researcher", "4 science tags"],
    ["Rim settler", "3 Jovian tags"], ["Spacefarer", "4 space tags"], ["Sponsor", "3 cards costing 20 M€ or more"],
    ["Tactician", "4 cards with requirements"], ["Terraformer", "29 TR"], ["Terran", "5 Earth tags"],
    ["Thawer", "having raised the temperature 5 times (mark each raise with your player marker on the track until it’s claimed)"],
    ["Trader", "3 different types of resources on cards"], ["Tycoon", "10 blue and green cards combined"]
  ],
  awards: [
    ["Administrator", "most cards with no tags (corporation and Prelude cards count)"], ["Banker", "highest M€ production"], ["Benefactor", "highest TR — count it before all other awards and milestones"],
    ["Biologist", "most bio tags (plant, microbe and animal)"], ["Botanist", "highest plant production"], ["Celebrity", "most cards costing 20 M€ or more"],
    ["Collector", "most different types of resources, on your board and your cards"], ["Constructor", "most colonies and cities combined"], ["Contractor", "most building tags"],
    ["Cultivator", "most greeneries"], ["Electrician", "most power tags"], ["Estate Dealer", "most tiles next to ocean"],
    ["Excentric", "most resources on cards"], ["Forecaster", "most cards with requirements"], ["Founder", "most tiles adjacent to special tiles"],
    ["Highlander", "most tiles not adjacent to ocean"], ["Incorporator", "most cards costing 10 M€ or less"], ["Industrialist", "most steel and energy resources combined"],
    ["Investor", "most Earth tags"], ["Landlord", "most tiles"], ["Landscaper", "most tiles connected together (your largest group)"],
    ["Magnate", "most green cards"], ["Manufacturer", "highest steel and heat production combined"], ["Metropolist", "most cities"],
    ["Miner", "most steel and titanium resources combined"], ["Mogul", "highest production of steel, titanium, plants, energy and heat combined (all but M€)"], ["Politician", "most Party Leaders and influence combined"],
    ["Promoter", "most cards in your event pile"], ["Scientist", "most science tags"], ["Space Baron", "most space tags"],
    ["Suburbian", "most tiles on areas along the edges of the map"], ["Thermalist", "most heat resources"], ["Traveller", "most Jovian and Earth tags combined"],
    ["Visionary", "most cards in hand"], ["Zoologist", "most animal and microbe resources combined"]
  ]
};

/* Options & variants. forced(c): on and locked in that configuration (forcedWhy explains).
   choices: one-of options — c.choice(id) returns the chosen choice id. */
TM.modules = [
  { id: "ce", name: "Corporate Era", summary: "All cards with the red-and-white icon, 2 more corporations — and no free starting production",
    description: "The extended game: economy and technology projects. Longer and more complex; not recommended for new players. Combines with any other variant.",
    forced: (c) => c.mode === "solo", forcedWhy: "The rulebook’s solo game is the “Solo variant for Corporate Era”, and Venus Next’s solo variant uses the Corporate Era too (Base p.13; Venus p.3).",
    src: "Base p.13" },
  { id: "draft", name: "Draft variant", summary: "From generation 2, draft the 4 Research cards instead of drawing them",
    description: "More interaction: pick 1 card and pass the rest until everyone has drafted 4, then buy as usual. Adds game time; not recommended for new players.",
    modes: ["standard", "automa"], src: "Base p.13" },
  { id: "beginner", name: "Beginner corporations", summary: "New players take a Beginner Corporation: 42 M€ and 10 free project cards",
    description: "Players new to Terraforming Mars skip the corporation and card choices.", src: "Base p.7" },
  { id: "ma-pick", name: "Milestones & Awards tiles", summary: "How the 5 milestone and 5 award tiles are picked",
    description: "The M&A tiles replace the milestones and awards printed on the board.",
    requires: ["ma"], modes: ["standard", "automa"], forced: (c) => c.has("ma"), forcedWhy: "With the Milestones & Awards set in play, 5 + 5 of its tiles replace the board’s own (M&A p.1).",
    choices: [{ id: "random", name: "Draw at random", summary: "Draw 5 milestone and 5 award tiles at random" }, { id: "choose", name: "Choose together", summary: "Choose the 5 + 5 tiles as a group" }],
    src: "M&A p.1" },
  { id: "corp-deal", name: "Expansion corporation deal", summary: "Deal each player 1 corporation from one expansion and 1 from the others",
    description: "A variant printed in Venus Next, Prelude and Colonies.",
    requires: [["venus", "prelude", "colonies"]],
    choices: [{ id: "venus", name: "Venus Next", requires: ["venus"] }, { id: "prelude", name: "Prelude", requires: ["prelude"] }, { id: "colonies", name: "Colonies", requires: ["colonies"] }],
    src: "Venus p.2 · Prelude p.2 · Colonies p.2" },
  { id: "venus-nowgt", name: "No World Government Terraforming", summary: "Skip Solar phase step 2 for a longer game",
    description: "Venus Next variant.", requires: ["venus"], modes: ["standard"], src: "Venus p.3" },
  { id: "prelude-nocards", name: "Prelude without Prelude cards", summary: "Leave out the 35 Prelude cards; Prelude’s 7 project cards and 5 corporations may stay in",
    description: "Prelude variant: play without the 35 Prelude cards.", requires: ["prelude"], when: (c) => !c.has("prelude2"), src: "Prelude p.2" },
  { id: "p2-extended", name: "Extended Start", summary: "Choose from 3 corporations and 6 Preludes instead of 2 and 4",
    description: "Prelude 2 variant.", requires: ["prelude2"], src: "Prelude 2 p.3" },
  { id: "tr-solo", name: "TR solo", summary: "Reach TR 63 instead of completing the parameters; Buffer Gas standard project",
    description: "A solo variant that may be used with any expansion (printed in Prelude; Turmoil refers to it).",
    requires: [["prelude", "turmoil"]], modes: ["solo"], src: "Prelude p.3 · Turmoil p.7" }
];

/* =============================================================================
   SETUP — ids base-setup-1 … base-setup-8 are the Base rulebook's own 8 steps (Base p.7).
   Expansion steps: ma-setup, venus-setup, turmoil-setup, colonies-setup, solo-cities, prelude-setup.
   ============================================================================= */
TM.phases = [
  {
    title: "The board",
    steps: [
      { id: "base-setup-1", exp: (c) => TM.u.map(c).set,
        t: (c) => "Game board — " + TM.u.map(c).name,
        d: (c) => {
          const m = TM.u.map(c), U = TM.u, it = [];
          it.push(m.id === "tharsis" ? "Place the game board (Tharsis) in the middle of the table."
            : "Place the <b>" + m.name + "</b> board in the middle of the table — it is used instead of the ordinary game board.");
          it.push("Place the <b>" + m.params.oceans + " ocean tiles</b> on their reserved space" + (m.id === "amazonis" ? " (the Amazonis &amp; Vastitas box adds 2 ocean tiles to the usual 9)" : "") + ".");
          it.push("Put the <b>temperature</b> marker on −30 °C and the <b>oxygen</b> marker on 0 % — the start of their tracks.");
          it.push("Put the <b>generation marker</b> on ‘1’ on the TR track.");
          if (m.id === "amazonis") it.push("Amazonis has no standard projects printed on it: set out the box’s <b>Standard Project tile</b> beside the board.");
          if (U.solo(c) && c.mod("tr-solo")) it.push("<b>TR solo:</b> mark <b>63</b> on the TR track with a gold cube — that’s your goal.");
          if (U.solo(c) && U.preludeCards(c)) it.push("<b>Solo with Prelude cards:</b> mark generation <b>12</b> with a gold cube — you have 12 generations, not 14.");
          return U.ul(it);
        },
        src: (c) => { const U = TM.u, m = U.map(c);
          return U.src("Base p.7, p.4", m.id !== "tharsis" && m.src, U.solo(c) && (c.mod("tr-solo") || U.preludeCards(c)) && "Prelude p.3"); } },

      { id: "ma-setup", when: (c) => c.has("ma"), exp: "ma",
        t: "Milestones & Awards tiles",
        d: (c) => {
          const U = TM.u, m = U.map(c), it = [];
          /* solo: milestones and awards are not used (Base p.13), so the selected M&A set sits out */
          if (U.solo(c)) return U.ul(["<b>Solo:</b> milestones and awards aren’t used, so leave the Milestones &amp; Awards tiles in the box."]);
          const random = c.choice("ma-pick") !== "choose";
          it.push("<b>Before any cards are dealt</b>, " + (random ? "draw <b>5 Milestone tiles</b> and <b>5 Award tiles</b> at random" : "choose <b>5 Milestone tiles</b> and <b>5 Award tiles</b> together") +
            " and lay them over the milestones and awards printed on the " + m.name + " board — they replace them this game.");
          it.push("Some goals reward the same strategy: feel free to swap goals until you have a set all players agree on.");
          it.push(m.volcanoes ? "<b>Geologist</b> counts volcanic areas — the names in bold on the map."
            : "<b>Geologist</b> needs volcanic areas and <b>" + m.name + " has none</b>: replace it if it comes up.");
          const off = [];
          if (!c.has("turmoil")) off.push("<b>Lobbyist</b> and <b>Politician</b> (Turmoil delegates and Party Leaders)");
          if (!c.has("colonies")) off.push("<b>Pioneer</b> (colonies)");
          if (!c.has("venus")) off.push("<b>Planetologist</b> (Venus tags)");
          if (off.length) it.push("Some tiles count pieces from expansions you aren’t using: " + off.join(", ") + ". The leaflet has a replace rule only for Geologist — for these it says nothing beyond the general rule that you may change goals until everyone agrees.");
          if (U.automa(c)) it.push("<b>Against MarsBot</b>, leave <b>Terraformer</b> out — it isn’t supported against the automa.");
          if (c.has("venus")) it.push("<b>Venus Next:</b> add <b>Hoverlord</b> and <b>Venuphile</b> as normal (next step).");
          if (c.has("turmoil") && m.id === "tharsis" && !U.automa(c)) it.push("<b>Turmoil:</b> its TR 26 Terraformer tile replaces the <i>printed</i> Tharsis Terraformer; the books give no Turmoil change for the M&amp;A Terraformer tile (29 TR).");
          return U.ul(it);
        },
        src: (c) => { const U = TM.u, m = U.map(c);
          if (U.solo(c)) return "Base p.13";
          return U.src("M&A p.1, p.2–4", U.automa(c) && "Automa C p.14", c.has("venus") && "Venus p.3", c.has("turmoil") && m.id === "tharsis" && !U.automa(c) && "Turmoil p.2"); } },

      { id: "venus-setup", when: (c) => c.has("venus"), exp: "venus",
        t: "Venus Next — the Venus board",
        d: (c) => {
          const U = TM.u, it = [];
          it.push("Place the <b>Venus board</b> next to the game board, with a white marker on <b>0 %</b> — the start of the Venus scale.");
          if (U.map(c).id === "amazonis") it.push("The Amazonis &amp; Vastitas box includes an <b>optional Venus board with a longer Venus track</b>. The wrap doesn’t describe that track, so the Venus figures on this page are for the standard Venus board.");
          if (U.solo(c)) it.push("Solo: milestones and awards aren’t used, so leave the <b>Hoverlord</b> and <b>Venuphile</b> tiles in the box.");
          else it.push("Place the <b>Hoverlord</b> milestone tile over the Milestones headline on the game board and the <b>Venuphile</b> award tile over the Awards headline" +
            (U.mandaTiles(c) ? ", alongside your M&amp;A tiles" : "") + ": 6 milestones and 6 awards — still only 3 of each can be claimed or funded.");
          it.push("Venus Next’s <b>49 project cards</b> and <b>5 corporations</b> (blue-and-white V icon) go into the decks in the next steps.");
          return U.ul(it);
        },
        src: (c) => TM.u.src("Venus p.2, p.3", TM.u.mandaTiles(c) && "M&A p.1", TM.u.map(c).id === "amazonis" && "A&V wrap", TM.u.solo(c) && "Base p.13") },

      { id: "base-setup-2", exp: "base",
        t: "Resource cubes & tiles",
        d: (c) => TM.u.ul([
          "Place the <b>resource cubes</b> — bronze = 1, silver = 5, gold = 10 — and the <b>remaining tiles</b> (greenery/city tiles and special tiles) where everyone can reach them.",
          TM.u.map(c).id === "amazonis" && "Amazonis: add the box’s <b>13 extra city/greenery tiles</b> to the supply."
        ]),
        src: (c) => TM.u.src("Base p.7, p.5", TM.u.map(c).id === "amazonis" && "A&V wrap") },

      { id: "turmoil-setup", when: (c) => c.has("turmoil"), exp: "turmoil",
        t: "Turmoil — Terraforming Committee & Global Events",
        d: (c) => {
          const U = TM.u, m = U.map(c);
          const tf = m.id === "tharsis" && !U.solo(c)
            ? (U.mandaTiles(c)
              ? " Tharsis with the M&amp;A tiles: they already cover the printed milestones, including the <b>Terraformer</b> that Turmoil’s <b>TR 26</b> tile replaces. " +
                (U.automa(c) ? "Against MarsBot the M&amp;A Terraformer tile is left out anyway (see the M&amp;A step)."
                  : "The books don’t say whether Turmoil’s tile also replaces the M&amp;A <b>Terraformer</b> tile (29 TR).")
              : " Playing on Tharsis: replace the <b>Terraformer</b> milestone with Turmoil’s tile — it needs only <b>TR 26</b>.") : "";
          return "<p class='inline-note'>Done right after step 2 of the base setup.</p>" + U.ol([
            "<b>Boards:</b> place the <b>Terraforming Committee</b> board and the <b>Global Event</b> board next to the main board." + tf,
            "<b>Delegates:</b> " + U.you(c, "each player takes their", "take your") + " <b>7 delegate markers</b>: 1 in the <b>Lobby</b> of the Committee board, the other 6 in the <b>Delegate Reserve</b>. Put a gray <b>neutral delegate</b> in the <b>Chairman</b> seat and the rest of the neutral delegates in the <b>Neutral Reserve</b>. All delegate markers stay on the Committee board for the rest of the game.",
            "<b>Global Events:</b>" + U.ul([
              "Shuffle the Global Event cards and put the deck on its space on the Global Event board.",
              "Draw a card and place it face up on <b>Coming Global Event</b>. Put a neutral delegate as <b>Party Leader</b> in the party shown at the card’s top left — that party is now <b>Dominant</b>: put the Dominance marker in its delegate area.",
              "Turn the next card of the deck face up — the <b>Distant Global Event</b> — and put a neutral delegate as Party Leader of the party at its top left (if that’s the same party as before, put it in that party’s delegate area instead).",
              "There is <b>no Current Global Event</b> in the first generation."
            ]),
            "<b>Policy tiles:</b> stack all 6 on their place on the Committee board with <b>Greens</b> on top — Greens start as the ruling party, and their policy is active in the first Action phase.",
            "Turmoil’s <b>16 project cards</b> are shuffled into the project deck (step 3)."
          ]);
        },
        src: (c) => { const U = TM.u, tm = U.map(c).id === "tharsis" && U.mandaTiles(c);
          return U.src("Turmoil p.2–3", tm && "M&A p.1, p.3", tm && U.automa(c) && "Automa C p.14"); } },

      { id: "colonies-setup", when: (c) => c.has("colonies"), exp: "colonies",
        t: "Colonies — Trade Fleets & Colony tiles",
        d: (c) => {
          const U = TM.u, it = [];
          it.push("Place the <b>Trade Fleets tile</b> next to the game board. " + U.you(c, "Each player takes one trade fleet and places it", "Take one trade fleet and place it") + " on the Trade Fleets tile with " + U.you(c, "their", "your") + " player marker inside it.");
          if (U.solo(c)) it.push("Shuffle the Colony tiles, draw <b>4</b> and choose <b>3</b> of them to have in play; place them next to the main board.");
          else if (U.automa(c)) it.push("Shuffle the Colony tiles and draw <b>5</b> — a two-player setup; place them next to the main board.");
          else it.push("Shuffle the Colony tiles and draw <b>" + (c.p === 2 ? 5 : c.p + 2) + "</b> (" + (c.p === 2 ? "2 players: 5 tiles" : "players + 2") + "); place them next to the main board.");
          it.push("Put a white cube on the highlighted <b>second step</b> of each Colony tile’s track — it shows what trading there gives.");
          if (U.automa(c)) { if (!U.automaModule()) it.push("Against MarsBot, <b>every</b> Colony tile — Titan, Enceladus and Miranda included — starts with its marker on the highlighted second step."); }
          else it.push("<b>Titan, Enceladus</b> and <b>Miranda</b> start with their white marker on the moon picture: it moves to the highlighted second step as soon as any card in play can collect their resource. Until then nobody can build a colony or trade there.");
          it.push("Colonies’ project cards and corporations go into the decks in the next steps.");
          return U.ul(it);
        },
        src: (c) => TM.u.src("Colonies p.2", TM.u.solo(c) && "Colonies p.3", TM.u.automa(c) && "Automa A p.3 · Automa C p.4") }
    ]
  },
  {
    title: "Decks, players & corporations",
    steps: [
      { id: "base-setup-3", exp: (c) => (c.mod("ce") ? "variant" : "base"),
        t: (c) => TM.u.preludeCards(c) ? "Project deck & Prelude deck" : "Project deck",
        d: (c) => {
          const U = TM.u, it = [];
          if (c.mod("ce")) it.push("<b>Corporate Era:</b> keep every card with the red-and-white icon (lower-left corner) in the project deck and among the corporations — including the <b>2 Corporate Era corporations</b>" + (U.solo(c) ? " (the solo game is the Corporate Era’s solo variant)" : "") + ".");
          else it.push("Make sure there are <b>no Corporate Era cards</b> in the project deck or among the corporations — they have a red-and-white icon at the lower-left corner.");
          const add = [];
          if (c.has("venus")) add.push("<b>Venus Next:</b> 49 project cards (blue-and-white V icon)");
          if (c.has("prelude")) add.push("<b>Prelude:</b> its 7 project cards (Prelude icon, lower left)");
          if (c.has("colonies")) add.push("<b>Colonies:</b> its project cards (49 in the box)");
          if (c.has("turmoil")) add.push("<b>Turmoil:</b> its 16 project cards");
          if (add.length) it.push("Shuffle in the expansions’ project cards:" + U.ul(add));
          if (c.has("prelude2")) it.push("<b>Prelude 2:</b> most of its cards carry required-expansion marks beside the Prelude mark — use only the cards whose expansions are in this game, or keep them all and discard and redraw any card you draw for an expansion you aren’t using. (Prelude 2’s rulebook has no components list, so this page gives no card counts for it.)");
          it.push("Shuffle the project cards and place the <b>project deck</b> next to the board; leave space for a discard pile beside it.");
          if (U.preludeCards(c)) it.push("Shuffle the <b>35 Prelude cards</b>" + (c.has("prelude2") ? " and Prelude 2’s Preludes (minding their expansion marks)" : "") + " into their own <b>Prelude deck</b> — only these are “Prelude cards”.");
          else if (c.has("prelude")) it.push("<b>No Prelude cards this game:</b> leave the 35 Prelude cards in the box — Prelude’s 7 project cards and 5 corporations may still be used.");
          return U.ul(it);
        },
        src: (c) => TM.u.src("Base p.7", c.mod("ce") && "Base p.13", c.has("venus") && "Venus p.2", c.has("prelude") && "Prelude p.2",
          c.has("prelude2") && "Prelude 2 p.2", c.has("colonies") && "Colonies p.2, p.4", c.has("turmoil") && "Turmoil p.2") },

      { id: "base-setup-4", exp: (c) => (TM.u.solo(c) ? "solo" : "base"),
        t: "Players, player boards & TR",
        d: (c) => {
          const U = TM.u, it = [];
          if (U.multi(c)) it.push("The player who most recently won a game of Terraforming Mars takes the <b>first player marker</b>.");
          if (U.automa(c) && !U.automaModule()) it.push("<b>You are the starting player</b> — take the first player marker.");
          it.push(U.you(c, "Each player chooses a color and takes", "Choose a color and take") + " the matching <b>player markers</b> and a <b>player board</b>.");
          if (U.solo(c)) it.push("<b>Solo: no extra production</b> — all your production tracks start at 0.");
          else if (c.mod("ce")) it.push("<b>Corporate Era: no extra production</b> — all production tracks start at 0.");
          else it.push("Standard game: " + U.you(c, "everyone starts", "you start") + " with <b>1 production of each resource</b> — put a player marker on ‘1’ of all six production tracks.");
          if (U.solo(c)) it.push("Put your marker on <b>14</b> on the TR track (marked ‘solo’) — not 20.");
          else it.push(U.you(c, "Each player places", "Place") + " one marker on <b>20</b> on the TR track — the starting terraform rating.");
          return U.ul(it);
        },
        src: (c) => TM.u.src("Base p.7", (c.mod("ce") || TM.u.solo(c)) && "Base p.13", TM.u.solo(c) && "Base p.4", TM.u.automa(c) && "Automa A p.3") },

      { id: "solo-cities", when: (c) => TM.u.solo(c), exp: "solo",
        t: "Solo — two neutral cities",
        d: (c) => TM.u.ul([
          "<b>Before you choose your cards</b>, place <b>2 neutral city tiles</b> on the map, each with an <b>adjacent greenery tile</b>. These tiles aren’t yours and <b>don’t raise the oxygen level</b>.",
          "Reveal and discard the top <b>4</b> project cards and use their <b>cost numbers</b> — one card’s cost for each tile — to find the positions:" + TM.u.ol([
            "<b>First city:</b> count areas from the top-left, left to right and downwards, like reading.",
            "<b>Second city:</b> count backwards from the bottom-right in the same fashion.",
            "<b>The two greeneries:</b> count clockwise around each city, starting from its top-left neighbour."
          ]),
          "While counting, <b>skip illegal placements</b> (such as areas reserved for oceans).",
          "<b>Tharsis Republic:</b> if you play it, you get its M€ production for these 2 neutral cities even though they’re placed before you reveal your corporation."
        ]),
        src: "Base p.13" },

      { id: "base-setup-5", exp: "base",
        t: (c) => TM.u.preludeCards(c) ? "Corporations & Prelude cards" : "Corporation cards",
        d: (c) => {
          const U = TM.u, it = [];
          if (c.mod("beginner")) it.push(c.p === 1
            ? "<b>New to the game?</b> Take a <b>Beginner Corporation</b> card (colorless back) and follow it: <b>42 M€</b> and draw <b>10 project cards</b> as your starting hand — then skip the corporation and project-card deal below."
            : "<b>New players</b> each take a <b>Beginner Corporation</b> card (colorless back) and follow it: <b>42 M€</b> and draw <b>10 project cards</b> as their starting hand. They can study their cards while the experienced players finish this setup without them.");
          const decks = ["the <b>10 standard corporations</b>" + (c.mod("ce") ? " and the <b>2 Corporate Era corporations</b>" : " (not the 2 Corporate Era ones)")];
          if (c.has("venus")) decks.push("<b>5 Venus Next</b> corporations");
          if (c.has("prelude")) decks.push("<b>5 Prelude</b> corporations");
          if (c.has("colonies")) decks.push("<b>5 Colonies</b> corporations");
          it.push("Shuffle the corporation cards: " + decks.join(", ") + ".");
          if (c.has("turmoil")) it.push("Turmoil’s box also holds <b>5 corporation cards</b> (its components list), but its setup text doesn’t mention them. Venus Next, Prelude and Colonies each say to shuffle their corporations into the corporation deck (Venus p.2, Prelude p.2, Colonies p.2); Turmoil’s book doesn’t say.");
          if (c.has("prelude2")) it.push("<b>Prelude 2 corporations:</b> Prelude 2’s rulebook has no components list and doesn’t say to shuffle any corporations into the deck, though Automa B’s FAQ names <b>Ecotec</b> as a Prelude 2 corporation. The books give no instruction for adding them; the rulebook says only that cards with expansion marks need those expansions in play (Prelude 2 p.2).");
          const n = c.mod("p2-extended") ? 3 : 2;
          const who = c.p === 1 ? (c.mod("beginner") ? "yourself — unless you took the Beginner Corporation —" : "yourself") : (c.mod("beginner") ? "each remaining player" : "each player");
          const deal = U.corpDeal(c);
          if (deal) it.push("<b>Variant:</b> deal " + who + " <b>1 " + U.setName(deal) + " corporation</b> and <b>1</b> from the other corporations" +
            (c.mod("p2-extended") ? " — as printed. The books don’t say how this variant combines with Extended Start’s 3 corporations." : "."));
          else it.push(c.p === 1 ? "Deal " + who + " <b>" + n + " corporations</b>." : "Deal <b>" + n + " corporations</b> to " + who + ".");
          if (c.mod("p2-extended")) it.push("<b>Extended Start:</b> 3 corporations instead of 2" + (U.preludeCards(c) ? ", and 6 Prelude cards instead of 4" : "") + ".");
          if (U.preludeCards(c)) it.push(c.p === 1 ? "Also deal yourself <b>" + (c.mod("p2-extended") ? 6 : 4) + " Prelude cards</b>." : "Also deal <b>" + (c.mod("p2-extended") ? 6 : 4) + " Prelude cards</b> to each player.");
          return U.ul(it);
        },
        src: (c) => TM.u.src("Base p.7", c.mod("ce") && "Base p.13", c.has("venus") && "Venus p.2", c.has("prelude") && "Prelude p.2",
          c.has("colonies") && "Colonies p.2, p.4", c.has("turmoil") && "Turmoil back cover", c.has("prelude2") && "Prelude 2 p.2", c.mod("p2-extended") && "Prelude 2 p.3", c.has("prelude2") && "Automa B p.4") },

      { id: "base-setup-6", exp: "base",
        t: "Starting-hand options",
        d: (c) => {
          const U = TM.u, it = [];
          it.push((c.p === 1 ? "Deal yourself <b>10 project cards</b>" + (c.mod("beginner") ? " (unless you took the Beginner Corporation)" : "")
              : "Deal <b>10 project cards</b> to " + (c.mod("beginner") ? "each remaining player" : "each player")) +
            ". These are the cards " + U.you(c, "players", "you") + " may buy for the starting hand, at <b>3 M€ each</b>.");
          if (U.preludeCards(c) && c.mode === "automa" && c.mod("mb-corps")) it.push("<b>Prelude cards:</b> you get <b>" + (c.mod("p2-extended") ? 6 : 4) + "</b>, but don’t choose yet — keep them aside and choose your 2 <b>after MarsBot’s corporation is drawn</b> (see the MarsBot corporation step).");
          else if (U.preludeCards(c)) it.push("<b>Prelude cards:</b> " + U.you(c, "each player keeps", "you keep") + " <b>2 of " + U.you(c, "their ", "your ") + (c.mod("p2-extended") ? 6 : 4) + "</b>, chosen at the same time as " + U.you(c, "their", "your") + " corporation and project cards — keeping Preludes costs nothing.");
          it.push(U.you(c, "Everyone now examines their", "Now examine your") + " options for the starting hand and corporation.");
          return U.ul(it);
        },
        src: (c) => TM.u.src("Base p.7", TM.u.preludeCards(c) && "Prelude p.2", c.mod("p2-extended") && "Prelude 2 p.3", TM.u.preludeCards(c) && c.mode === "automa" && c.mod("mb-corps") && "Automa B p.1") },

      { id: "base-setup-7", exp: "base",
        t: "Starting conditions — choose & reveal",
        d: (c) => {
          const U = TM.u, it = [];
          if (c.p === 1 && c.mod("beginner")) it.push("<b>Took the Beginner Corporation?</b> Skip the corporation and project-card choice and the 3 M€ payments — its 10 cards are already your starting hand" + (U.preludeCards(c) ? (c.mode === "automa" && c.mod("mb-corps") ? " (you still choose 2 of your Prelude cards, after MarsBot’s corporation is drawn — see the MarsBot corporation step)" : " (you still keep 2 of your Prelude cards)") : "") + ".");
          it.push(U.you(c, "Players choose", "Choose") + " the corporation to play and which of the 10 project cards to keep" + (U.preludeCards(c) && !(c.mode === "automa" && c.mod("mb-corps")) ? ", plus the 2 Preludes" : "") + ".");
          it.push("Discard the rest — cards are always discarded <b>face down</b>! " + (c.has("prelude2")
            ? "<b>Prelude 2:</b> discarded corporations and Preludes go face down on <b>their own discard piles</b> (instead of back in the box); if one of those decks runs out, shuffle its discard pile into a new deck."
            : "Put discarded corporations back in the box."));
          it.push(c.p === 1 ? "Reveal your corporation, take its <b>starting resources and production</b> (if any), then pay <b>3 M€ for each project card</b> you keep."
            : "In player order, each player reveals their corporation, takes its <b>starting resources and production</b> (if any), then pays <b>3 M€ for each project card</b> kept.");
          if (U.solo(c) && c.has("colonies")) it.push("<b>Colonies solo:</b> then reduce your <b>M€ production 2 steps</b> (M€ production can go as low as −5).");
          it.push("Money will be tight for the first few generations, until your economy gets going.");
          return U.ul(it);
        },
        src: (c) => TM.u.src("Base p.7", TM.u.preludeCards(c) && !(c.mode === "automa" && c.mod("mb-corps")) && "Prelude p.2", c.p === 1 && c.mod("beginner") && TM.u.preludeCards(c) && c.mode === "automa" && c.mod("mb-corps") && "Automa B p.1", c.has("prelude2") && "Prelude 2 p.3", TM.u.solo(c) && c.has("colonies") && "Colonies p.3 · Base p.6") },

      { id: "prelude-setup", when: (c) => TM.u.preludeCards(c), exp: (c) => (c.has("prelude2") ? "prelude2" : "prelude"),
        t: "Play your Preludes (step 7b)",
        d: (c) => {
          const U = TM.u, it = [];
          const rest = (c.mod("p2-extended") ? 4 : 2) + (c.has("prelude2") ? " (face down, on the Prelude discard pile)" : "");
          it.push(c.p === 1 ? "After your corporation is revealed and your cards are paid for, play your <b>2 chosen Prelude cards</b> and discard the other " + rest + "."
            : "After all corporations are revealed and cards paid for, each player, in player order, plays their <b>2 chosen Prelude cards</b> and discards the other " + rest + ".");
          it.push("Preludes work like <b>green cards</b>: they stay in play with their tags visible.");
          if (c.has("prelude2")) {
            it.push("Some Preludes have an <b>action or effect</b>, like corporations: they work like blue cards, but corporations and Preludes <b>never count as blue cards</b> (for example towards milestones or awards).");
            it.push("<b>Prelude refund:</b> if you can’t play a Prelude (perform all its effects), reveal and discard it and take <b>15 M€</b> instead.");
          }
          it.push("The whole setup counts as part of <b>generation 1</b>.");
          return U.ul(it);
        },
        src: (c) => TM.u.src("Prelude p.2", c.has("prelude2") && "Prelude 2 p.2–3") }
    ]
  },
  {
    title: "Begin",
    steps: [
      { id: "base-setup-8", exp: "base",
        t: "Start the game",
        d: (c) => {
          const U = TM.u, it = [];
          it.push("Generation 1 has <b>no Player Order phase and no Research phase</b> — setup covered both — so " + (U.multi(c) ? "the first player simply starts" : "you simply start") + " the <b>Action phase</b>.");
          it.push("Some corporations have a <b>fixed first action</b>, described with their starting conditions — Tharsis Republic, for example, places a city tile as its first action.");
          if (c.has("turmoil")) it.push("<b>Turmoil:</b> Greens rule and their policy is active; there is no Current Global Event to resolve this generation.");
          if (c.mod("draft")) it.push("<b>Draft variant:</b> the first draft is in generation 2 (generation 1 has no Research phase).");
          if (U.solo(c)) it.push(c.mod("tr-solo")
            ? "<b>TR solo:</b> reach <b>TR 63</b> within <b>" + U.soloGens(c) + " generations</b>."
            : "<b>Solo:</b> complete terraforming — " + (c.has("venus") ? "all four global parameters, Venus included —" : "temperature, oxygen and oceans —") + " before the end of generation <b>" + U.soloGens(c) + "</b>.");
          return U.ul(it);
        },
        src: (c) => { const U = TM.u;
          return U.src("Base p.6–8", c.has("turmoil") && "Turmoil p.2, p.6", c.mod("draft") && "Base p.13", U.solo(c) && "Base p.13",
            U.solo(c) && (U.preludeCards(c) || c.mod("tr-solo")) && "Prelude p.3", U.solo(c) && c.mod("tr-solo") && c.has("turmoil") && "Turmoil p.7", U.solo(c) && c.has("venus") && !c.mod("tr-solo") && "Venus p.3"); } }
    ]
  }
];

/* =============================================================================
   RULES REFERENCE
   ============================================================================= */
TM.reference = [
  {
    id: "ref-overview",
    title: "How to win & when the game ends",
    when: () => true,
    html: (c) => {
      const U = TM.u, m = U.map(c), it = [];
      if (U.solo(c)) {
        it.push(c.mod("tr-solo")
          ? "<b>TR solo:</b> your goal is a terraform rating of <b>63</b> within <b>" + U.soloGens(c) + " generations</b> — the global parameters no longer need finishing."
          : "<b>Solo:</b> complete terraforming — <b>temperature</b> (+" + m.params.temp + " °C), <b>oxygen</b> (" + m.params.o2 + " %)" + (c.has("venus") ? ", <b>oceans</b> (" + m.params.oceans + ") <b>and Venus</b> (30 %)" : " and <b>oceans</b> (" + m.params.oceans + ")") + " at their goals — before the end of generation <b>" + U.soloGens(c) + "</b>, or you <b>lose</b>. If you make it, score as many victory points as you can.");
      } else {
        it.push("Most <b>victory points</b> (VP) wins: your final TR, plus milestones, awards, greenery and city tiles on the map, and VP on your cards. " +
          (U.automa(c) ? "<b>Against MarsBot</b> you must <b>beat MarsBot’s score</b> — a tie is a win for MarsBot (MarsBot scores by its own rules)." : "<b>Ties:</b> most M€ wins."));
      }
      it.push("Your <b>Terraform Rating (TR)</b> starts at <b>" + (U.solo(c) ? 14 : 20) + "</b>. It goes up 1 step each time you raise a global parameter — temperature, oxygen or an ocean" + (c.has("venus") ? ", or Venus" : "") + " — and some cards raise it directly, as printed on them. It is both your <b>income</b> every generation and your <b>base score</b>.");
      if (U.solo(c)) it.push("<b>Game end:</b> solo, you always play <b>" + U.soloGens(c) + " generations</b>. After the last one you may convert plants into greeneries — normal rules, but <b>without raising the oxygen</b> — then score.");
      else it.push("<b>Game end:</b> when <b>temperature</b> (+" + m.params.temp + " °C), <b>oxygen</b> (" + m.params.o2 + " %) and <b>oceans</b> (" + m.params.oceans + ") have all reached their goals, the game ends after that generation’s production phase" + (U.solar(c) ? " (Solar phase step 1)" : "") + ": everyone gets one last chance to turn plants into greeneries, in player order, then final scoring." + (c.has("venus") && !U.solo(c) ? " Venus is <b>not</b> an end condition." : ""));
      if (c.has("turmoil")) it.push(U.automa(c)
        ? "<b>Turmoil:</b> the Committee takes <b>1 TR</b> from you every generation — <b>MarsBot never loses it</b> — and at the end you and MarsBot each score 1 VP per Party Leader and for the Chairman."
        : "<b>Turmoil:</b> the Committee takes <b>1 TR</b> from " + (U.solo(c) ? "you" : "everyone") + " every generation, and Party Leaders and the Chairman score 1 VP each at the end.");
      return U.ul(it);
    },
    src: (c) => { const U = TM.u;
      return U.src("Base p.3, p.4, p.12", U.solo(c) && "Base p.13", U.solo(c) && (c.mod("tr-solo") || U.preludeCards(c)) && "Prelude p.3", c.has("venus") && "Venus p.2–3",
        U.map(c).id === "amazonis" && "A&V wrap", c.has("turmoil") && "Turmoil p.6", U.automa(c) && "Automa A p.2, p.10", U.automa(c) && c.has("turmoil") && "Automa C p.6–7"); }
  },
  {
    id: "ref-generation",
    title: "A generation, phase by phase",
    when: () => true,
    html: (c) => {
      const U = TM.u, ph = [];
      ph.push("<b>Player Order</b> — " + (U.solo(c) ? "the generation marker moves up 1" : "the first player marker moves 1 step clockwise" + (U.automa(c) ? " (against MarsBot it alternates between you and MarsBot)" : "") + " and the generation marker moves up 1") + ". <i>Skipped in generation 1.</i>");
      ph.push("<b>Research</b> — " + (U.solo(c) ? "draw 4 cards and buy any of them" : U.automa(c) ? "you draw 4 cards and buy any of them" : "each player draws 4 cards and buys any of them") + " at <b>3 M€ each</b> (0–4 cards); the rest are discarded face down." +
        (U.automa(c) ? " MarsBot builds its own action deck instead and pays nothing for it." : "") + " <b>No hand limit.</b> <i>Skipped in generation 1.</i>" +
        (c.mod("draft") ? (U.automa(c) ? " <b>Draft variant:</b> use the MarsBot drafting procedure (Automa A p.4)." : " <b>Draft variant:</b> draft the 4 cards instead — see Variants.") : ""));
      ph.push("<b>Action</b> — " + (U.solo(c) ? "take 1 or 2 actions per turn until you pass"
        : U.automa(c) ? "you and MarsBot alternate turns: you take <b>1 or 2 actions</b> or pass; MarsBot resolves one card from its action deck a turn and passes when the deck is empty. The phase ends when you have both passed"
        : "in turn, each player takes <b>1 or 2 actions</b> or passes; once you pass you’re out until next generation. Play goes clockwise until everyone has passed") + ".");
      ph.push("<b>Production</b> — " + (U.solo(c) ? "" : U.automa(c) ? "yours only — MarsBot skips this phase: " : "everyone at once: ") + "first convert all <b>energy into heat</b>; then gain <b>M€ = TR + M€ production</b> (which may be negative) and every other resource you produce; finally remove the player markers from used action cards.");
      let h = U.ol(ph);
      if (U.solar(c)) {
        /* [rulebook step number, text]: the books number the Solar phase 1–4 whatever is in play (step 2 only with Venus Next,
           step 3 only with Colonies — Colonies p.3, Turmoil p.7), and the page cites "Solar phase step N" elsewhere */
        const st = [];
        st.push([1, U.solo(c) ? "<b>Game end check</b> — solo, the game ends after generation " + U.soloGens(c) + " (you always play " + U.soloGens(c) + " generations): in that last generation no further Solar steps are carried out" + (c.has("venus") ? " — which is why the WG helps one generation fewer than you play" : "") + "."
          : "<b>Game end check</b> — temperature, oxygen and oceans all maxed? The game ends: final scoring begins with the normal plant conversion; no further Solar steps."]);
        if (c.has("venus")) st.push([2, U.automa(c) ? "<b>World Government Terraforming</b> — <i>not carried out against MarsBot</i>: its Government Intervention bonus card does the equivalent (Automa C p.3)."
          : c.mod("venus-nowgt") ? "<b>World Government Terraforming</b> — <i>skipped (variant)</i>."
          : U.solo(c) ? "<b>World Government Terraforming</b> — you act as the WG: raise one non-maxed global parameter 1 step, or place an ocean tile. You get no TR or other bonuses for it, but other cards can trigger (e.g. Arctic Algae, Aphrodite)."
          : "<b>World Government Terraforming</b> — the first player (order hasn’t shifted yet) acts as the WG: raise one non-maxed global parameter 1 step, or place an ocean tile. The first player gets no TR or other bonuses for it, but other cards can trigger (e.g. Arctic Algae, Aphrodite)."]);
        if (c.has("colonies")) st.push([3, "<b>Colony production</b> — all trade fleets return to the Trade Fleets tile; each Colony tile’s white marker moves 1 step up its track."]);
        if (c.has("turmoil")) st.push([4, "<b>Turmoil</b> — TR revision (" + (U.automa(c) ? "you lose 1 TR; MarsBot doesn’t" : U.solo(c) ? "you lose 1 TR" : "everyone loses 1 TR") + ") · the Current Global Event · New Government · Changing Times (see Turmoil)." + (U.automa(c) ? " Against MarsBot, see the MarsBot rules for its other exceptions." : "")]);
        h += "<p><b>Then the Solar phase</b>, after production (steps numbered as in the rulebooks):</p><ol>" + st.map((s) => "<li value='" + s[0] + "'>" + s[1] + "</li>").join("") + "</ol>";
      }
      return h;
    },
    src: (c) => { const U = TM.u;
      return U.src("Base p.8", (c.mod("draft") || (U.solo(c) && U.solar(c))) && "Base p.13", c.has("venus") && "Venus p.3", c.has("colonies") && "Colonies p.3", c.has("turmoil") && "Turmoil p.7", U.automa(c) && "Automa A p.4–5",
        U.automa(c) && (c.has("venus") && c.has("turmoil") ? "Automa C p.3, p.6" : c.has("venus") ? "Automa C p.3" : c.has("turmoil") ? "Automa C p.6" : "")); }
  },
  {
    id: "ref-actions",
    title: "Your turn: the actions",
    when: () => true,
    html: (c) => {
      const U = TM.u, noMA = U.solo(c);
      const n = c.has("venus") ? 6 : 5;
      const it = [
        "<b>A · Play a card</b> from your hand — meet its requirement and pay its cost (see <i>Playing a card</i>).",
        "<b>B · Use a standard project</b> — always available; each may be used several times per generation (see <i>Standard projects</i>).",
        noMA ? "<b>C · Claim a milestone</b> — <i>not used in solo</i>."
          : "<b>C · Claim a milestone</b> — meet its condition and pay <b>8 M€</b>" + (U.mandaTiles(c) ? " (Briber: +12 M€)" : "") + "; each can be claimed once, and only <b>3 of " + n + "</b> in total. 5 VP each.",
        noMA ? "<b>D · Fund an award</b> — <i>not used in solo</i>."
          : "<b>D · Fund an award</b> — no requirement; costs <b>8, then 14, then 20 M€</b>; each award once, only 3 in total. Scored for everyone at the end, whoever funded it.",
        "<b>E · Use a card action</b> (red arrow) on a blue card or your corporation" + (c.has("prelude2") && U.preludeCards(c) ? " or a Prelude 2 Prelude (these work like blue cards but never count as blue cards)" : "") + " — once per generation per card: pay the cost left of the arrow, take what it points to, and mark the card with a player marker.",
        "<b>F · Convert 8 plants</b> into a greenery tile — raises oxygen 1 step (and your TR).",
        "<b>G · Convert 8 heat</b> into a 1-step temperature raise (and your TR)."
      ];
      if (c.has("colonies")) it.push("<b>Colonies · Trade</b> — pay <b>9 M€, 3 energy or 3 titanium</b> and send your trade fleet to a Colony tile (see <i>Colonies</i>). A new action, not a standard project. <i>Building a colony is a standard project.</i>");
      if (c.has("turmoil")) {
        it.push("<b>Turmoil · Lobby</b> — not a standard project, and any number of times per generation: move a delegate from the <b>Lobby (free)</b> or your <b>Delegate Reserve (5 M€)</b> into a party’s delegate area.");
        it.push("<b>Turmoil · policy actions</b> while that party rules: <b>Scientists</b> — pay 10 M€ to draw 3 cards (once per generation per player); <b>Kelvinists</b> — pay 10 M€ for +1 heat and +1 energy production (any number of times).");
      }
      return "<p>On your turn take <b>1 or 2 actions</b> — any mix, even the same one twice — or pass and sit out the rest of the generation.</p>" + U.ul(it) +
        (noMA ? "" : "<p>One action lets you wait and watch; two let you beat " + (U.automa(c) ? "MarsBot" : "the others") + " to a goal or bonus.</p>");
    },
    src: (c) => TM.u.src("Base p.8–11", c.has("venus") && "Venus p.3", TM.u.mandaTiles(c) && "M&A p.2", c.has("prelude2") && TM.u.preludeCards(c) && "Prelude 2 p.2", c.has("colonies") && "Colonies p.2", c.has("turmoil") && "Turmoil p.4, p.6")
  },
  {
    id: "ref-standard-projects",
    title: "Standard projects",
    when: () => true,
    html: (c) => {
      const rows = [
        ["Sell patents", "—", "discard any number of cards from your hand: <b>1 M€ each</b>"],
        ["Power plant", "11 M€", "+1 energy production"],
        ["Asteroid", "14 M€", "raise the temperature 1 step (+1 TR)"],
        ["Aquifer", "18 M€", "place an ocean tile (+1 TR, placement bonus)"],
        ["Greenery", "23 M€", "place a greenery tile with your marker (oxygen +1 step, +1 TR, placement bonus)"],
        ["City", "25 M€", "place a city tile with your marker (placement bonus) and +1 M€ production"]
      ];
      if (c.has("venus")) rows.push(["Air Scrapping <span class='tag tag-venus'>Venus</span>", "15 M€", "raise Venus 1 step (+1 TR)"]);
      if (c.has("colonies")) rows.push(["Build a colony <span class='tag tag-colonies'>Colonies</span>", "17 M€", "your marker on the lowest free spot of a Colony tile’s track; take the bonus printed there"]);
      if (TM.u.solo(c) && c.mod("tr-solo")) rows.push(["Buffer Gas <span class='tag tag-variant'>TR solo</span>", "16 M€", "+1 TR"]);
      return "<table class='rtable'><thead><tr><th scope='col'>Project</th><th scope='col'>Cost</th><th scope='col'>You get</th></tr></thead><tbody>" +
        rows.map((r) => "<tr><th scope='row'>" + r[0] + "</th><td>" + r[1] + "</td><td>" + r[2] + "</td></tr>").join("") + "</tbody></table>" +
        TM.u.ul(["Always available to every player; each may be used <b>several times</b> in the same generation.",
          TM.u.map(c).id === "amazonis" && "Amazonis: the standard projects are on the box’s Standard Project tile."]);
    },
    src: (c) => TM.u.src("Base p.10", c.has("venus") && "Venus p.2", c.has("colonies") && "Colonies p.2", TM.u.solo(c) && c.mod("tr-solo") && "Prelude p.3", TM.u.map(c).id === "amazonis" && "A&V wrap")
  },
  {
    id: "ref-cards",
    title: "Playing a card",
    when: () => true,
    html: (c) => {
      const U = TM.u;
      return U.ol([
        "<b>Check the requirement</b> (next to the cost). It must be met <b>when you play</b> the card — not later. Some need a global parameter at or above a level, others only allow the card while it is still low; some need tags or production." +
          (c.has("turmoil") ? " <b>Turmoil:</b> a party icon as requirement means that party is ruling <b>or</b> you have at least 2 delegates in it." : "") +
          (c.has("venus") ? " <b>Venus:</b> cards that change global requirements (Adaptation Technology, Special Design, Inventrix) also affect Venus requirements." : ""),
        "You must also be able to perform the card’s effects — <b>except</b> you may still play a card that:" + U.ul([
          "raises a global parameter that is already maxed (ignore that part — no TR);",
          "adds resources you can’t collect (e.g. microbes with no microbe card);",
          "removes red-bordered resources from any player, when you can’t or don’t want to."]),
        "<b>Pay</b> the cost (top left). Blue cards may give discounts; <b>steel</b> pays for <b>building</b> cards at 2 M€ each, <b>titanium</b> for <b>space</b> cards at 3 M€ each — no change for overpaying." + (c.has("turmoil") ? " (While Unity rules, titanium is worth 1 M€ extra.)" : ""),
        "<b>Immediate effects</b> (bottom panel) — in any order you choose:" + U.ul([
          "production changes (brown boxes) <b>must</b> be performed;",
          "<b>red border</b> = any player you choose (even yourself); red-bordered resource removal is optional or partial (all from one player), but a red-bordered <b>production</b> decrease must happen — if no opponent has it, lower your own or don’t play the card;",
          "a tile must be placed if possible — being unable to doesn’t stop you playing the card;",
          "a card marked (*) is an exception: read the text in parentheses."]),
        "<b>Place the card:</b> <b>events</b> (red) face down in your event pile — their tags count only while being played; <b>automated</b> (green) in a stack with the top row showing — their tags still count; <b>active</b> (blue) with the top panel showing — effects are always on, actions once per generation."
      ]);
    },
    src: (c) => TM.u.src("Base p.6, p.9–10, p.15", c.has("turmoil") && "Turmoil p.5–6", c.has("venus") && "Venus p.2")
  },
  {
    id: "ref-resources",
    title: "Resources & production",
    when: () => true,
    html: (c) => TM.u.ul([
      "<b>Resource cubes</b> come as bronze = 1, silver = 5, gold = 10, and can be any resource — where you put them decides what they are.",
      "<b>M€</b> pays for everything. Income each generation = <b>TR + M€ production</b>. M€ production is the only production that can go negative — <b>never below −5</b>.",
      "<b>Steel</b> — only for building-tag cards, worth 2 M€. <b>Titanium</b> — only for space-tag cards, worth 3 M€" + (c.has("turmoil") ? " (+1 M€ while Unity rules)" : "") + ".",
      "<b>Plants</b> — 8 make a greenery (action F). <b>Energy</b> — used by cards; all leftover energy turns into heat at the start of production. <b>Heat</b> — 8 raise the temperature (action G).",
      "<b>Production</b> is shown by a resource symbol in a brown box. It isn’t capped at 10: leave a marker on 10 and start another.",
      "<b>Card resources</b> — animals, microbes" + (c.has("venus") ? ", <b>floaters</b>" : "") + " and others — live on their cards, usually the card that makes them." + (c.has("venus") ? " A <b>?</b> in a square resource box is a wild resource: see the card text." : ""),
      "A card icon means: draw a card for free."
    ]),
    src: (c) => TM.u.src("Base p.5–6, p.14–15", c.has("venus") && "Venus p.2", c.has("turmoil") && "Turmoil p.6")
  },
  {
    id: "ref-tiles",
    title: "Tiles & placement",
    when: () => true,
    html: (c) => {
      const U = TM.u, m = U.map(c);
      const it = [
        "First check the restrictions: areas reserved for oceans or specific cities, and any restriction on the card.",
        "<b>Placement bonus:</b> take what’s printed on the area, plus <b>2 M€ for each adjacent ocean tile</b> (even when placing an ocean).",
        "<b>Ocean:</b> only on ocean-reserved areas; +1 TR; owned by nobody.",
        "<b>Greenery:</b> must go next to one of your own tiles if possible (otherwise anywhere available); your marker on it; raises oxygen and your TR — if oxygen is maxed, no TR. Worth 1 VP, plus 1 VP to each adjacent city.",
        "<b>City:</b> never next to another city" + (m.id === "tharsis" ? " (exception: Noctis City always goes on its reserved area)" : "") + "; your marker on it; 1 VP per adjacent greenery, whoever owns it. (Capital also scores adjacent oceans, as its card says.)",
        "<b>Special tiles</b> (brown symbol): placed and restricted as the card says; your marker on it."
      ];
      it.push("<b>" + m.name + ":</b> " + m.special.filter((s) => /Noctis|volcan/i.test(s)).join(" "));
      if (c.has("venus")) it.push("<b>Venus board</b> city areas, for specific cards only: Maxwell Base, Stratopolis, Luna Metropolis and Dawn City.");
      if (c.has("turmoil")) it.push("<b>Turmoil policies</b>, only during the Action phase while that party rules: Mars First — 1 steel whenever you place any tile on Mars; Greens — 4 M€ whenever you place a greenery.");
      return U.ul(it);
    },
    src: (c) => TM.u.src("Base p.4–5, p.15", TM.u.map(c).id !== "tharsis" && TM.u.map(c).specialSrc, c.has("venus") && "Venus p.2", c.has("turmoil") && "Turmoil p.4, p.6")
  },
  {
    id: "ref-map",
    title: (c) => "The map: " + TM.u.map(c).name,
    when: () => true,
    html: (c) => {
      const U = TM.u, m = U.map(c), p = m.params;
      let h = "<table class='rtable'><thead><tr><th scope='col'>Track</th><th scope='col'>Start → goal</th></tr></thead><tbody>" +
        "<tr><th scope='row'>Temperature</th><td>−30 °C → <b>+" + p.temp + " °C</b>, 2 °C a step (" + ((p.temp + 30) / 2) + " steps)</td></tr>" +
        "<tr><th scope='row'>Oxygen</th><td>0 % → <b>" + p.o2 + " %</b>, 1 % a step</td></tr>" +
        "<tr><th scope='row'>Oceans</th><td><b>" + p.oceans + "</b> ocean tiles</td></tr>" +
        (c.has("venus") ? "<tr><th scope='row'>Venus</th><td>0 % → <b>30 %</b> (15 steps) — not an end condition" + (U.solo(c) ? ", except solo" : "") + "</td></tr>" : "") +
        "</tbody></table>";
      h += "<p><b>Bonus steps</b> — raise a track onto one of these and you also get the bonus:</p>" + U.ul(m.bonus.concat(c.has("venus") ? ["Venus <b>8 %</b>: draw a card", "Venus <b>16 %</b>: +1 TR"] : []));
      h += "<p><b>Board features:</b></p>" + U.ul(m.special.concat([
        (m.id === "amazonis" || m.id === "vastitas") ? (c.has("turmoil") ? "Turmoil is in play: the <b>delegate</b> bonuses are live." : "Without Turmoil, <b>ignore</b> the delegate bonuses.") : "",
        m.id === "cimmeria" ? (c.has("colonies") ? "Colonies is in play: the <b>MSL Curiosity</b> colony bonus is live." : "Without Colonies, <b>ignore</b> the MSL Curiosity colony bonus.") : "",
        m.id === "amazonis" && c.has("venus") ? "<b>Venus:</b> the Venus values above are the standard Venus board’s. The box’s <b>optional Venus board</b> has a longer Venus track; the wrap gives no further details of it." : ""
      ]));
      return h;
    },
    src: (c) => { const m = TM.u.map(c); return TM.u.src(m.id === "tharsis" ? "Base p.4, p.15" : m.src + " (text and board picture)", c.has("venus") && "Venus p.2–3"); }
  },
  {
    id: "ref-milestones",
    title: "Milestones & awards",
    when: () => true,
    html: (c) => {
      const U = TM.u, m = U.map(c);
      if (U.solo(c)) return "<p><b>Not used in the solo game.</b></p>";
      const n = c.has("venus") ? 6 : 5;
      let h = U.ul([
        "<b>Claim a milestone:</b> meet its condition, pay <b>8 M€</b>" + (U.mandaTiles(c) ? " (Briber: 20 M€ in all)" : "") + " and put your player marker on it. One player per milestone; only <b>3 of " + n + "</b> can be claimed. <b>5 VP</b> each.",
        "<b>Fund an award:</b> no condition. The first funder pays <b>8 M€</b>, the second <b>14</b>, the third <b>20</b>; only 3 awards are funded, each once. At the end, whoever funded it: <b>1st place 5 VP, 2nd place 2 VP</b>" + (U.twoPlayer(c) ? " — <b>but with 2 players there is no 2nd place</b>" : "") + ".",
        "Award ties are friendly: everyone tied gets the place; if several players share 1st, no 2nd place is awarded."
      ]);
      if (U.mandaTiles(c)) {
        h += "<p>This game uses the <b>5 + 5 Milestones &amp; Awards tiles</b> you set out — every tile is listed in <i>Milestones &amp; Awards tiles</i>.</p>";
      } else {
        const tf = c.has("turmoil") && m.id === "tharsis";
        h += "<table class='rtable'><thead><tr><th scope='col'>" + m.name + " milestones</th><th scope='col'>Condition</th></tr></thead><tbody>" +
          m.milestones.map((x) => "<tr><th scope='row'>" + x[0] + "</th><td>" + (tf && x[0] === "Terraformer" ? "<b>TR 26</b> (Turmoil’s replacement tile; printed: TR 35)" : x[1]) + "</td></tr>").join("") + "</tbody></table>";
        h += "<table class='rtable'><thead><tr><th scope='col'>" + m.name + " awards</th><th scope='col'>Won by</th></tr></thead><tbody>" +
          m.awards.map((x) => "<tr><th scope='row'>" + x[0] + "</th><td>" + x[1] + "</td></tr>").join("") + "</tbody></table>";
        /* printed goals that count an expansion's pieces: the wraps say nothing about playing them without it */
        const needs = { Lobbyist: ["turmoil", "delegates", "Turmoil"], Pioneer: ["colonies", "colonies", "Colonies"], Planetologist: ["venus", "Venus tags", "Venus Next"] };
        const off = m.milestones.filter((x) => needs[x[0]] && !c.has(needs[x[0]][0]));
        if (off.length) h += U.ul(off.map((x) => "<b>" + x[0] + "</b> counts " + needs[x[0]][1] + ", and " + needs[x[0]][2] + " isn’t in this game: the " + m.box + " wrap doesn’t say what to do with this milestone then."));
      }
      if (c.has("venus")) h += U.ul(["<b>Venus Next adds</b> the <b>Hoverlord</b> milestone (at least 7 floater resources on your cards) and the <b>Venuphile</b> award (most Venus tags in play)."]);
      return h;
    },
    src: (c) => { const U = TM.u, m = U.map(c);
      return U.solo(c) ? "Base p.13" : U.src("Base p.10–12", U.mandaTiles(c) ? "M&A p.1" : m.id !== "tharsis" && m.maSrc, c.has("venus") && "Venus p.3", c.has("turmoil") && m.id === "tharsis" && !U.mandaTiles(c) && "Turmoil p.2"); }
  },
  {
    id: "ref-ma-tiles",
    title: "Milestones & Awards tiles (all 70)",
    when: (c) => TM.u.mandaTiles(c),
    html: (c) => {
      const li = (x) => "<li><b>" + x[0] + ":</b> " + x[1] + "</li>";
      return TM.u.ul([
        "<b>Milestones:</b> you must have at least the requirement in play when you claim.",
        "Face-down cards (events) and their tags <b>never count</b> unless the tile says so.",
        "A <b>wild tag</b> doesn’t count when deciding award winners."
      ]) + "<h4>Milestones (35)</h4><ul class='cols'>" + TM.maTiles.milestones.map(li).join("") + "</ul>" +
        "<h4>Awards (35)</h4><ul class='cols'>" + TM.maTiles.awards.map(li).join("") + "</ul>";
    },
    src: () => "M&A p.2–4"
  },
  {
    id: "ref-end",
    title: "Game end & final scoring",
    when: () => true,
    html: (c) => {
      const U = TM.u, it = [];
      if (U.solo(c)) {
        it.push(c.mod("tr-solo") ? "The game lasts <b>" + U.soloGens(c) + " generations</b>; reach <b>TR 63</b> by then, or <b>you lose</b>."
          : "The game lasts <b>" + U.soloGens(c) + " generations</b>. If terraforming isn’t complete by the end of generation " + U.soloGens(c) + ", <b>you lose</b>.");
        it.push("After the last generation you may convert plants into greeneries — normal rules, but <b>without raising the oxygen</b> — then score VP for as high a total as you can.");
      } else {
        it.push("When temperature, oxygen and oceans are all at their goals, the game ends <b>at the end of that generation</b>. After the production phase" + (U.solar(c) ? " (Solar phase step 1: game end check)" : "") + ", players get <b>one last chance to convert plants into greeneries</b>, in player order (this can trigger placement bonuses and other effects).");
      }
      if (c.has("turmoil")) it.push("<b>Turmoil:</b> the Turmoil step isn’t performed when the game ends.");
      const sc = ["<b>TR</b> — your base score.", U.solo(c) ? "" : "<b>Awards</b> — 5 VP to the leader, 2 VP to the runner-up" + (U.twoPlayer(c) ? " (no runner-up with 2 players)" : "") + "; friendly ties.",
        U.solo(c) ? "" : "<b>Milestones</b> — 5 VP each.",
        "<b>Game board</b> — 1 VP per greenery tile; each city 1 VP per adjacent greenery, whoever owns it. Count in player order.",
        "<b>Cards</b> — first the VP on cards that collect resources, then all your other cards, <b>played events included</b>. Jovian cards may need counting separately."];
      if (c.has("turmoil")) sc.push("<b>Turmoil</b> — as a last step, each <b>Party Leader</b> and the <b>Chairman</b> is worth 1 VP to its owner" + (U.automa(c) ? " — MarsBot’s too" : "") + ".");
      it.push("<b>Final scoring</b>, in this order:" + U.ol(sc));
      if (U.automa(c)) it.push("Beat MarsBot’s score to win — <b>a tie is a win for MarsBot</b>. MarsBot scores by its own rules (see the MarsBot sections).");
      else if (!U.solo(c)) it.push("Highest total wins; <b>ties go to the player with the most M€</b>. Tip: let one player do the scoring while the others check it.");
      return U.ul(it);
    },
    src: (c) => { const U = TM.u;
      return U.src("Base p.12", U.solo(c) && "Base p.13", U.solo(c) && (c.mod("tr-solo") || U.preludeCards(c)) && "Prelude p.3",
        c.has("venus") && "Venus p.3", c.has("colonies") && "Colonies p.3", c.has("turmoil") && "Turmoil p.6–7", U.automa(c) && "Automa A p.10", U.automa(c) && c.has("turmoil") && "Automa C p.7"); }
  },
  {
    id: "ref-solo",
    title: "Solo game rules",
    when: (c) => TM.u.solo(c),
    html: (c) => {
      const U = TM.u, it = [];
      it.push("All rules apply as usual, with these exceptions (the rulebook’s “Solo variant for Corporate Era”):" + U.ol([
        "Two <b>neutral cities</b>, each with an adjacent greenery, are placed before you choose your cards (see setup). They aren’t yours and didn’t raise the oxygen.",
        "Start at <b>TR 14</b>, without the standard game’s extra production.",
        "<b>Milestones and awards are not used.</b>",
        "You have a <b>neutral opponent</b> you can steal from, or reduce any kind of resource or production from.",
        "You always play <b>" + U.soloGens(c) + " generations</b>" + (U.preludeCards(c) ? " — not 14, because you use the Prelude cards" : "") + "."
      ]));
      if (c.mod("tr-solo")) it.push("<b>TR solo:</b> your goal is <b>TR 63</b> in " + U.soloGens(c) + " generations instead of completing the global parameters. New standard project <b>Buffer Gas</b>: 16 M€ for 1 TR. All other solo rules apply.");
      else it.push("<b>Win</b> by completing terraforming — " + (c.has("venus") ? "all <b>four</b> global parameters, <b>Venus included</b>" : "all three global parameters") + " — before the end of generation " + U.soloGens(c) + ". Then convert plants to greeneries (without raising oxygen) and score as high as you can. Otherwise, you lose.");
      if (U.map(c).id === "amazonis") it.push("<b>Amazonis Planitia:</b> the books give no solo changes for its longer tracks (+14 °C, 18 % oxygen, 11 oceans) — the solo rules above apply unchanged.");
      if (c.has("venus")) it.push("<b>Venus Next solo</b> uses the Venus cards and the Corporate Era. World Government Terraforming still runs in the Solar phase, and <b>you choose what the WG does</b>." +
        (c.mod("tr-solo") ? "" : " You’ll need it: Venus takes 15 steps, and the WG helps once per generation except the last, whose game end check skips it — the book counts 13 WG steps in a 14-generation game."));
      if (c.has("colonies")) it.push("<b>Colonies solo:</b> use all the normal solo rules, but start by reducing your M€ production 2 steps; draw 4 Colony tiles and choose 3 to have in play.");
      if (c.has("turmoil")) it.push("<b>Turmoil solo:</b> combine the Turmoil rules with the solo rules. <b>Reds’ ruling bonus</b> in solo: you gain 1 TR if your TR is 20 or below. Some Global Events have their own solo special cases — read them as they come." + (c.mod("tr-solo") ? "" : " Decide before setup whether you terraform in the allotted time or go for TR 63 (the TR solo option)."));
      return U.ul(it);
    },
    src: (c) => { const U = TM.u;
      return U.src("Base p.13", (U.preludeCards(c) || c.mod("tr-solo")) && "Prelude p.3", c.has("venus") && "Venus p.3", c.has("colonies") && "Colonies p.3", c.has("turmoil") && "Turmoil p.6–7", U.map(c).id === "amazonis" && "A&V wrap"); }
  },
  {
    id: "ref-variants",
    title: "Variants in play",
    when: (c) => ["ce", "draft", "beginner", "corp-deal", "venus-nowgt", "prelude-nocards", "p2-extended", "tr-solo"].some((id) => c.mod(id)),
    html: (c) => {
      const U = TM.u, it = [];
      if (c.mod("ce")) it.push("<b>Corporate Era</b> (extended game): all cards with the red-and-white icon, including 2 corporations; players start with <b>no extra production</b>. Economy and technology rather than terraforming — longer and more complex. It combines with any other variant.");
      if (c.mod("draft")) it.push("<b>Draft</b> (Research phase, from generation 2): " + (U.automa(c) ? "against MarsBot, follow the MarsBot drafting procedure (Automa A p.4)." :
        "each player takes 4 cards, sets 1 aside and passes the rest to the next player; keep 1 of the 3 you receive and pass on; keep 1 of the 2 and pass the last; then receive your fourth card. Buy any of your 4 drafted cards at 3 M€ each and discard the rest. Pass <b>clockwise in even-numbered</b> generations and <b>counter-clockwise in odd-numbered</b> ones."));
      if (c.mod("beginner")) it.push("<b>Beginner corporations:</b> a new player takes a Beginner Corporation (colorless back): 42 M€ and 10 project cards drawn as the starting hand — no corporation or card choices.");
      if (c.mod("corp-deal") && U.corpDeal(c)) it.push("<b>Expansion corporation deal:</b> " + U.you(c, "each player is", "you are") + " dealt 1 " + U.setName(U.corpDeal(c)) + " corporation and 1 from the others to choose from" +
        (c.mod("p2-extended") ? " — as printed; the books don’t say how it combines with Extended Start’s 3 corporations." : "."));
      if (c.mod("venus-nowgt")) it.push("<b>No World Government Terraforming:</b> skip Solar phase step 2 for a longer game.");
      if (c.mod("prelude-nocards")) it.push("<b>Prelude without Prelude cards:</b> the 35 Prelude cards stay in the box; Prelude’s 7 project cards and 5 corporations may still be used (this page’s setup keeps them in).");
      if (c.mod("p2-extended")) it.push("<b>Extended Start:</b> choose from 3 corporations and 6 Preludes instead of 2 and 4.");
      if (c.mod("tr-solo")) it.push("<b>TR solo:</b> reach TR 63 in " + U.soloGens(c) + " generations; Buffer Gas standard project (16 M€: 1 TR).");
      return U.ul(it);
    },
    src: (c) => { const U = TM.u;
      return U.src((c.mod("ce") || c.mod("draft")) && "Base p.13", c.mod("beginner") && "Base p.7", U.automa(c) && c.mod("draft") && "Automa A p.4",
        U.corpDeal(c) === "venus" && "Venus p.2", U.corpDeal(c) === "prelude" && "Prelude p.2", U.corpDeal(c) === "colonies" && "Colonies p.2",
        c.mod("venus-nowgt") && "Venus p.3", c.mod("prelude-nocards") && U.corpDeal(c) !== "prelude" && "Prelude p.2", c.mod("p2-extended") && "Prelude 2 p.3", c.mod("tr-solo") && "Prelude p.3"); }
  },
  {
    id: "ref-venus",
    title: "Venus Next",
    when: (c) => c.has("venus"),
    html: (c) => {
      const U = TM.u;
      return U.ul([
        "The <b>Venus scale</b> is a fourth global parameter (“Venus” on the cards), from <b>0 % to 30 %</b> in 15 steps. Each step raises your TR like any parameter; once maxed it gives no TR." +
          (U.map(c).id === "amazonis" ? " (These are the standard Venus board’s values: the Amazonis &amp; Vastitas box’s optional Venus board has a longer track that its wrap doesn’t describe.)" : ""),
        "<b>Not an end condition</b>" + (U.solo(c) ? (c.mod("tr-solo") ? " — and in TR solo it isn’t part of your goal either: only reaching TR 63 counts." : " — but in solo it is part of your goal: all four parameters, Venus included, must be maxed by the end of the last generation to win.") : ": only temperature, oxygen and oceans end the game."),
        "<b>Bonus steps:</b> reach <b>8 %</b> — draw a card for free; reach <b>16 %</b> — an extra TR.",
        "<b>Air Scrapping</b> standard project: 15 M€ to raise Venus 1 step (+1 TR).",
        "Cards that change global requirements (Adaptation Technology, Special Design, the Inventrix corporation) also affect Venus requirements.",
        "<b>Floaters</b> — a new card resource that works like microbes and animals. A <b>?</b> in a square resource box = a wild (unspecified) resource: see the card. The <b>Venus tag</b> marks a Venus card.",
        "Four special <b>city areas</b> on the Venus board, for specific project cards: Maxwell Base (surface), Stratopolis (atmosphere), Luna Metropolis (our Moon), Dawn City (Mercury).",
        U.solo(c) ? "Hoverlord and Venuphile aren’t used in solo." : "<b>Hoverlord</b> milestone: at least 7 floaters on your cards. <b>Venuphile</b> award: most Venus tags in play. With them, 3 of 6 milestones may be claimed and 3 of 6 awards funded.",
        U.automa(c) ? "<b>World Government Terraforming</b> (Solar phase step 2) is <b>not carried out against MarsBot</b> — its Government Intervention bonus card does the equivalent, and MarsBot can’t be played with Venus Next without it." :
        c.mod("venus-nowgt") ? "<b>World Government Terraforming</b> is skipped this game (variant)." :
          "<b>World Government Terraforming</b> (Solar phase step 2): " + (U.solo(c) ? "you, as first player, always choose a non-maxed global parameter to raise 1 step, or place an ocean" : "the first player — before player order shifts — chooses a non-maxed global parameter to raise 1 step, or places an ocean") + ". All bonuses go to the WG: no TR or bonuses for the first player, but other cards can trigger (e.g. Arctic Algae, Aphrodite).",
        "Venus Next may be played with or without the Corporate Era and any other expansion."
      ]);
    },
    src: (c) => TM.u.src("Venus p.2–3", TM.u.solo(c) && "Base p.13", TM.u.solo(c) && c.mod("tr-solo") && "Prelude p.3", TM.u.map(c).id === "amazonis" && "A&V wrap", TM.u.automa(c) && "Automa C p.3")
  },
  {
    id: "ref-prelude",
    title: (c) => (c.has("prelude2") ? "Prelude & Prelude 2" : "Prelude"),
    when: (c) => c.has("prelude"),
    html: (c) => {
      const U = TM.u, it = [];
      if (U.preludeCards(c)) {
        it.push("<b>Prelude cards:</b> " + (c.mod("p2-extended") ? 6 : 4) + " dealt with the corporations, <b>2 kept for free</b>, played after the corporations in player order (setup step 7b); the rest are discarded. They work like <b>green cards</b> and stay in play with their tags visible. All of setup is part of generation 1.");
        it.push("<b>Wild tag</b> (a round <b>?</b>): once played, whenever you perform an action it counts as a tag of your choice — so it doesn’t trigger anything when it enters play, and it <b>never counts for awards</b>, but you can use it, for example, to claim a milestone.");
      } else it.push("<b>No Prelude cards this game</b> (variant): the 35 Prelude cards stay in the box; Prelude’s 7 project cards and 5 corporations may still be used.");
      if (U.solo(c) && U.preludeCards(c)) it.push("<b>Solo with Prelude cards:</b> only <b>12 generations</b> to finish.");
      it.push("<b>TR solo</b> (a solo variant for any expansion): reach TR 63 in 14 generations (12 with the Prelude cards); new standard project Buffer Gas, 16 M€ for 1 TR.");
      it.push("<b>Variant:</b> deal each player 1 Prelude corporation and 1 from the other corporations.");
      if (c.has("prelude2")) {
        it.push("<b>Prelude 2</b> is played together with Prelude; all Prelude rules apply, plus:" + U.ul([
          "Some Preludes have <b>actions or effects</b> like corporations: they work like blue cards, but corporations and Preludes never count as blue cards (e.g. for milestones and awards).",
          "<b>Required expansions:</b> marks beside the Prelude mark show the expansions a card needs — play only with the right cards, or discard and redraw one you can’t use.",
          "Preludes and corporations have their own decks and <b>face-down discard piles</b>; reshuffle a discard pile when its deck runs out.",
          "<b>Prelude refund:</b> a Prelude you can’t play (perform all its effects) is revealed and discarded for <b>15 M€</b>.",
          "<b>Extended Start</b> variant: choose from 3 corporations and 6 Preludes instead of 2 and 4."
        ]));
      }
      return U.ul(it);
    },
    src: (c) => TM.u.src("Prelude p.2–3", c.has("prelude2") && "Prelude 2 p.2–3")
  },
  {
    id: "ref-colonies",
    title: "Colonies",
    when: (c) => c.has("colonies"),
    html: (c) => {
      const U = TM.u;
      return U.ul([
        "<b>Build a colony</b> (standard project, <b>17 M€</b>): put your player marker on the <b>lowest free spot</b> of a Colony tile’s track (moving the white marker up 1 step if needed) and take the placement bonus printed there. At most <b>3 colonies per tile — no exceptions</b>, and only 1 per player per tile (unless a card says otherwise).",
        "<b>Trade</b> (a new action, not a standard project): pay <b>9 M€, 3 energy or 3 titanium</b> and move your trade fleet from the Trade Fleets tile onto an available Colony tile (not onto its track). One trade fleet per Colony tile at a time.",
        "Trading pays the <b>trade income</b> the white marker points to, and every colony on that tile gives its owner the <b>colony bonus</b>. Then move the white marker as far left as possible — it stops next to the colonies, or at the bottom of the track.",
        "<b>Colony production</b> (Solar phase step 3): all fleets return to the Trade Fleets tile and each white marker moves 1 step up its track.",
        U.automa(c) ? "<b>Titan, Enceladus, Miranda:</b> against MarsBot they start on the highlighted second step like every other Colony tile, so they’re open from the start."
          : "<b>Titan, Enceladus, Miranda</b> can’t be built on or traded with until a card in play can collect their resource; then their marker moves to the highlighted second step.",
        "Example: trading with Callisto for 3 titanium gives the trade income shown (10 energy in the book’s example), and each colony owner there gets the colony bonus (3 energy).",
        U.solo(c) ? "<b>Solo:</b> reduce your M€ production 2 steps at the start; draw 4 Colony tiles and keep 3 in play." : ""
      ]);
    },
    src: (c) => TM.u.src("Colonies p.2–3", TM.u.automa(c) && "Automa C p.4")
  },
  {
    id: "ref-turmoil",
    title: "Turmoil — the Terraforming Committee",
    when: (c) => c.has("turmoil"),
    html: (c) => {
      const U = TM.u;
      return U.ul([
        "<b>Lobbying</b> (new action, not a standard project, any number of times per generation): move one of your delegates from the <b>Delegate Reserve (5 M€)</b> or the <b>Lobby (free)</b> into a party’s delegate area.",
        "<b>The Lobby:</b> each generation starts with 1 of your delegates there. Spent Lobby delegates are replaced from your Reserve at the end of the generation — if your Reserve is empty, you get none.",
        "<b>Party Leader:</b> the first delegate in a party becomes its leader. Whoever — the neutral “player” included — gets <b>more delegates</b> in a party than the current leader’s owner replaces the leader with one of their own (the old leader becomes a normal delegate in that party). A leader also counts as a delegate.",
        "<b>Dominant party:</b> the one with the most delegates holds the Dominance marker; a party with <b>more</b> delegates takes it over. The Dominant party rules next generation.",
        "<b>Ruling party:</b> its Policy tile is on top; the policy works <b>only during the Action phase</b>.",
        "<b>Influence</b> (0–3): 1 for owning the <b>Chairman</b>, 1 for owning the <b>leader of the Dominant party</b>, 1 for having 1+ <b>non-leader delegates in the Dominant party</b>.",
        "<b>Max 5:</b> a Global Event that counts anything (resources, production, cards, tiles, tags, TR…) counts at most 5 — then your influence changes that number up or down, even beyond 5.",
        "<b>Global Events:</b> seen 3 generations ahead. When one is first shown (Distant), a neutral delegate joins the party at its top left; when it becomes Current, another joins the party at its mid-right. The Current event is resolved in the Turmoil step. If an event lets the “first player” do something (like place an ocean), they get no bonuses or TR for it.",
        "<b>Neutral delegates</b> belong to no one but count as a separate player; they can become Party Leader and Chairman.",
        "<b>Project card requirements</b> showing a party icon: playable only while that party rules, <b>or</b> if you have at least 2 delegates in it.",
        "<b>Turmoil step</b> (Solar phase step 4)" + U.ol([
          "<b>TR revision</b> — " + (U.automa(c) ? "you lose 1 TR; <b>MarsBot doesn’t</b>." : "all players lose 1 TR."),
          U.automa(c) ? "<b>Global Event</b> — resolve the Current Global Event, with influence; it <b>affects only you</b> (you make any first-player choices)."
            : "<b>Global Event</b> — resolve the Current Global Event, with influence.",
          "<b>New Government</b> — the Dominant party becomes ruling (its Policy tile on top) · " + (U.automa(c) ? "its <b>ruling bonus</b> goes to you (<b>MarsBot ignores it</b>)" : "its <b>ruling bonus</b> goes to all players") + " · the old Chairman and the ruling party’s non-leader delegates return to their reserves · its Party Leader becomes <b>Chairman</b> and its owner gains <b>1 TR</b>" + (U.automa(c) ? " (MarsBot too)" : "") + " · the Dominance marker moves to the party with the most delegates (tie: the first one clockwise from the new ruling party) · " + (U.automa(c) ? "refill your Lobby delegate (never MarsBot’s)." : "refill the Lobby so each player has 1 delegate there."),
          "<b>Changing Times</b> — the Coming event goes on top of the Current one (add its mid-right neutral delegate) · the Distant event moves to Coming · reveal a new Distant event, add its top-left neutral delegate and read its flavor text."
        ]),
        "<b>Special cases:</b> a maxed global parameter can’t be affected again for the rest of the game. If Volcanic Eruptions triggers the 0 °C ocean bonus, the first player places the ocean but gets no bonus. If Snow Cover drops the temperature below 0 °C, nothing happens — but the ocean bonus can trigger again when it’s raised.",
        "<b>Final scoring:</b> no Turmoil step at game end; each Party Leader and the Chairman is worth 1 VP to its owner.",
        U.automa(c) ? "<b>Against MarsBot:</b> MarsBot starts with all 7 delegates in its reserve and never gets one in the Lobby, ignores policies and ruling bonuses, never loses TR in the TR revision (it does gain 1 TR as Chairman), and Global Events affect only you" +
          (U.automaModule() ? " — see <i>Turmoil against MarsBot</i>." : ".") : ""
      ]);
    },
    src: (c) => TM.u.src("Turmoil p.3–7", TM.u.automa(c) && "Automa C p.6–7")
  },
  {
    id: "ref-parties",
    title: "Turmoil — the six parties",
    when: (c) => c.has("turmoil"),
    html: (c) => {
      const rows = [
        ["Mars First", "1 M€ per building tag", "When you place any tile on Mars, gain 1 steel."],
        ["Scientists", "1 M€ per science tag", "Pay 10 M€ to draw 3 cards — once per generation per player."],
        ["Unity", "1 M€ per Venus, Earth and Jovian tag", "Titanium is worth 1 M€ extra."],
        ["Greens", "1 M€ per plant, microbe and animal tag", "Gain 4 M€ each time you place a greenery tile."],
        ["Reds", "The player with the lowest TR gains 1 TR (friendly ties)" + (TM.u.solo(c) ? "; <b>solo:</b> you gain 1 TR if your TR is 20 or below" : "; in solo, 1 TR if your TR is 20 or below"), "You lose 3 M€ for each step your TR is raised; with less than 3 M€ you may not raise your TR."],
        ["Kelvinists", "1 M€ per heat production", "Pay 10 M€ to raise your heat and energy production 1 step each — any number of times."]
      ];
      return "<table class='rtable'><thead><tr><th scope='col'>Party</th><th scope='col'>" + (TM.u.automa(c) ? "Ruling bonus (when it takes power; MarsBot ignores it)" : "Ruling bonus (all players, when it takes power)") + "</th><th scope='col'>Ruling policy (Action phase, while it rules)</th></tr></thead><tbody>" +
        rows.map((r) => "<tr><th scope='row'>" + r[0] + "</th><td>" + r[1] + "</td><td>" + r[2] + "</td></tr>").join("") + "</tbody></table>" +
        TM.u.ul(["Greens rule the first generation (their Policy tile starts on top)."]);
    },
    src: (c) => TM.u.src("Turmoil p.2–3, p.6", TM.u.automa(c) && "Automa C p.7")
  },
  {
    id: "ref-symbols",
    title: "Tags & symbols",
    when: () => true,
    html: (c) => {
      const U = TM.u;
      return U.ul([
        "Cards have <b>0–3 tags</b>; tags have no rules of their own — other cards and goals refer to them.",
        "<b>Building</b> (steel may pay) · <b>Space</b> (titanium may pay) · <b>Power</b> · <b>Science</b> · <b>Jovian</b> (the outer solar system) · <b>Earth</b> · <b>Plant</b> · <b>Microbe</b> · <b>Animal</b> (generates VP) · <b>City</b> (places a city tile) · <b>Event</b> (one-time; red cards, face down after play)" +
          (c.has("venus") ? " · <b>Venus</b>" : "") + (c.has("prelude") ? " · <b>Wild</b> (a round ?) — after it is played, a tag of your choice whenever you take an action (e.g. to claim a milestone); it triggers nothing when the card is played and never counts for awards" : "") + ".",
        "A resource icon means resource cubes; the same icon inside a <b>brown box</b> means production of it.",
        "A <b>red border</b> means any player (you or an opponent): removed resources come from any one player (optional, or only partly); a production decrease must be performed — if no opponent has that production, lower your own or don’t play the card; a red tile icon targets any or all players’ tiles; a red tag icon counts every card with that tag, yours and everyone else’s.",
        "Temperature, oxygen and ocean icons each mean a 1-step raise (and 1 TR); greenery and city hexes mean you place that tile with your marker; brown hexes are special tiles.",
        "Not sure what a card does? Read the text in parentheses."
      ]);
    },
    src: (c) => TM.u.src("Base p.6, p.14–15", c.has("venus") && "Venus p.2", c.has("prelude") && "Prelude p.3")
  },
  {
    id: "ref-rulings",
    title: "Rulings worth knowing",
    when: () => true,
    html: (c) => {
      const U = TM.u;
      return U.ul([
        "When several effects trigger at the same time, the <b>active player chooses the order</b> — even for other players’ effects.",
        "A requirement only matters <b>when you play</b> the card, not when you use it later.",
        "A maxed global parameter can’t be raised further and gives no TR — but you may still play cards that would raise it." + (c.has("turmoil") ? " (Turmoil: once maxed, it can’t be affected again for the rest of the game.)" : ""),
        "A greenery placed when oxygen is maxed gives no TR.",
        "Blue-card actions: once per generation each; the markers come off in the production phase.",
        "<b>No hand limit</b>, and cards are always discarded <b>face down</b>.",
        "Steel and titanium can pay for a card along with M€, but overpaying gives no change.",
        c.has("colonies") ? "Colonies: 3 colonies per Colony tile, no exceptions." : "",
        c.has("prelude") ? "Prelude: a wild tag triggers nothing when its card is played and never counts for awards, but counts as any tag you choose when you take an action (e.g. claiming a milestone)." : ""
      ]);
    },
    src: (c) => TM.u.src("Base p.3, p.5–12", c.has("turmoil") && "Turmoil p.6", c.has("colonies") && "Colonies p.2", c.has("prelude") && "Prelude p.3")
  }
];

/* =============================================================================
   TEACHING SCRIPT — teaching order: hook → shape of a generation → actions → central mechanic
   → inserts for what's selected → "don't worry about these yet". Ids: hook, shape, actions, engine,
   map, ce, draft, beginner, ma, venus, prelude, prelude2, colonies, turmoil, solo, variants, automa, later.
   ============================================================================= */
TM.teach = {
  intro: "A ~5-minute teach for the exact sets, map, mode and players selected above. Read it aloud, or copy it and adjust. Every rule in it comes from the rulebooks cited in the setup and reference.",
  sections: [
    { id: "hook", h: "The hook — and how you win",
      body: (c) => {
        const U = TM.u, m = U.map(c);
        const goals = "temperature up to plus " + m.params.temp + " degrees, oxygen up to " + m.params.o2 + " percent, and all " + m.params.oceans + " oceans placed";
        if (U.solo(c)) {
          return "<p>You run a corporation hired by the World Government to make Mars livable — alone, against the clock. Three global parameters stand between Mars and a breathable planet: temperature, oxygen and ocean coverage. Every step you raise one of them lifts your <b>Terraform Rating</b>, your TR — which is both your income and your score. You start at TR 14.</p>" +
            (c.mod("tr-solo") ? "<p>Tonight’s goal is <b>TR 63</b> by the end of generation " + U.soloGens(c) + ". The parameters don’t have to be finished — only your rating counts.</p>"
              : "<p>Your goal: finish terraforming — " + goals + (c.has("venus") ? ", and Venus at 30 percent too" : "") + " — before the end of generation <b>" + U.soloGens(c) + "</b>. Miss it and you lose; make it and you score as many victory points as you can.</p>");
        }
        if (U.automa(c)) {
          return "<p>You run a corporation hired by the World Government to make Mars livable" + (U.automaModule() ? ", with a single rival: <b>MarsBot</b>." : " — and tonight your rival is <b>MarsBot</b>, an automated opponent that takes the second seat of a two-player game.") + " Three global parameters stand between Mars and a breathable planet: <b>temperature, oxygen and ocean coverage</b>. Every time you raise one of them one step, your <b>Terraform Rating</b> — your TR — goes up one. TR is your income every generation <i>and</i> your base score, so terraforming pays twice. You start at 20.</p>" +
            "<p>The game ends after the generation in which all three are maxed — " + goals + ". Then you add up <b>victory points</b>: TR, plus milestones and awards, plus greeneries and cities on the map, plus points printed on your cards." +
            (U.automaModule() ? "</p>" : " You win only by <b>beating MarsBot’s score</b> — a tie goes to MarsBot.</p>");
        }
        return "<p>We each run a corporation hired by the World Government to make Mars livable. Three global parameters stand between Mars and a breathable planet: <b>temperature, oxygen and ocean coverage</b>. Every time you raise one of them one step, your <b>Terraform Rating</b> — your TR — goes up one. TR is your income every generation <i>and</i> your base score, so terraforming pays twice. We all start at 20.</p>" +
          "<p>The game ends after the generation in which all three are maxed — " + goals + ". Then we add up <b>victory points</b>: TR, plus milestones and awards, plus greeneries and cities on the map, plus points printed on our cards. Most points wins; ties go to whoever has the most MegaCredits.</p>";
      } },
    { id: "shape", h: "The shape of a generation",
      body: (c) => {
        const U = TM.u, one = c.p === 1;
        let h = "<p>Time runs in <b>generations</b>, and each has four phases. <b>Player order:</b> " +
          (U.solo(c) ? "the generation marker moves up one" : U.automa(c) ? "the first-player marker alternates between you and MarsBot" : "the first-player marker moves one seat clockwise") + ". <b>Research:</b> " +
          (one ? "you draw four cards and buy any of them for 3 MegaCredits each" + (U.automa(c) ? " — MarsBot builds its own action deck instead." : ".") : "everyone draws four cards and buys any of them for 3 MegaCredits each — keep what you can use, the rest are discarded.") +
          " <b>Action:</b> " + (U.solo(c) ? "you take one or two actions a turn until you pass." : U.automa(c) ? "you and MarsBot alternate turns until you’ve both passed." : "we take turns doing one or two actions, around and around, until everyone has passed.") +
          " <b>Production:</b> leftover energy turns into heat, then you collect MegaCredits equal to your TR plus your MegaCredit production, and every other resource you produce. Generation one skips player order and research — setup already covered them.</p>";
        if (U.solar(c)) {
          const bits = [];
          if (U.wgt(c)) bits.push(U.solo(c) ? "you raise one unfinished parameter for the World Government" : "the first player raises one unfinished parameter for the World Government, for no reward");
          if (c.has("colonies")) bits.push("the trade fleets come home and the colony markers creep up");
          if (c.has("turmoil")) bits.push("the Terraforming Committee meets");
          h += "<p>After production comes a <b>Solar phase</b>: first a check whether the game is over" + (bits.length ? "; then " + bits.join("; then ") : "") + ".</p>";
        }
        return h;
      } },
    { id: "actions", h: "Your turn — the actions, and why you’d take them",
      body: (c) => {
        const U = TM.u, solo = U.solo(c);
        return "<p>On your turn you do <b>one or two actions</b>, or pass — and once you pass, you’re out until the next generation. The options:</p>" + U.ul([
          "<b>Play a card</b> from your hand: meet its requirement, pay its cost. This is how you build your engine.",
          "<b>Use a standard project</b> " + (U.map(c).id === "amazonis" ? "from the Standard Project tile" : "printed on the board") + " — raise the temperature for 14, an ocean for 18, a greenery for 23, a city for 25, energy production for 11, or sell cards for 1 each. Your reliable fallback when your hand doesn’t help.",
          solo ? "" : "<b>Claim a milestone</b> for 8 MegaCredits when you meet its condition: 5 points, but only three can ever be claimed — it’s a race.",
          solo ? "" : "<b>Fund an award</b> — 8, then 14, then 20 MegaCredits. At the end the leader gets 5 points" + (U.twoPlayer(c) ? "" : " and second place 2") + ", whoever paid — so fund the ones you expect to win.",
          "<b>Use a blue card’s action</b> once per generation.",
          "<b>Turn 8 plants into a greenery</b> — it raises oxygen — or <b>spend 8 heat</b> to raise the temperature."
        ]) + (solo ? "" : "<p>One action lets you wait and see what " + (U.automa(c) ? "MarsBot does" : "others do") + "; two let you grab a bonus or a milestone before anyone can react.</p>");
      } },
    { id: "engine", h: "The central idea — build an engine, then terraform",
      body: (c) => {
        const U = TM.u;
        return "<p>The heart of the game is your <b>engine</b>. Cards raise your <b>production</b>, and production pays out every single generation — so early on you invest in income, and later you cash it in for terraforming and points. Cards carry <b>tags</b> — building, space, science, plant and more — and many cards and goals reward the tags you already have. <b>Steel</b> pays for building cards at 2 each, <b>titanium</b> for space cards at 3.</p>" +
          "<p>On the map: oceans belong to nobody, but each one pays <b>2 MegaCredits</b> to whoever later places a tile next to it. A <b>greenery</b> is worth a point and must go next to your own tiles if it can. A <b>city</b> scores a point for every greenery next to it — anyone’s. " +
          (U.solo(c) ? (c.mod("tr-solo") ? "And keep an eye on the clock: only your TR counts, and you have " + U.soloGens(c) + " generations." : "And keep an eye on the clock: you have " + U.soloGens(c) + " generations to finish the job.")
            : "And remember that terraforming is shared: every step anyone takes brings the end of the game closer, so watch who that helps.") + "</p>";
      } },
    { id: "map", h: (c) => "The map — " + TM.u.map(c).name,
      body: (c) => {
        const m = TM.u.map(c), t = {
          tharsis: "We’re on <b>Tharsis</b>, the original board: plant bonuses around the equator, steel and titanium on the mountain ridges, a few card-draw sites, and three areas reserved for specific cities, like Noctis City. Oxygen at 8 percent also warms the planet a step, the minus 24 and minus 20 degree marks give heat production, and 0 degrees places an ocean.",
          hellas: "We’re on <b>Hellas</b>, the southern wild: the plant bonuses sit at the top along the equator, the Hellas sea and the south pole give <b>heat</b>, and the <b>South Pole</b> itself costs 6 MegaCredits to settle but hands you an ocean to place. No volcanoes here, so Noctis City and Lava Flows can go anywhere that isn’t ocean.",
          elysium: "We’re on <b>Elysium</b>, the other side of Mars: no special placement bonuses, Noctis City has no restriction, and there are four volcanic sites — Arsia Mons, Olympus Mons, Elysium Mons and Hecates Tholus — for Lava Flows.",
          amazonis: "We’re on <b>Amazonis Planitia</b>, a bigger board with <b>longer tracks</b>: oxygen goes to 18 percent, temperature to plus 14, and there are 11 oceans — a longer game with more terraforming for everyone. Watch for energy bonuses, <b>wild resource</b> bonuses that give any standard resource, and delegate bonuses" + (c.has("turmoil") ? " — live, since Turmoil is in play." : ", which are ignored without Turmoil."),
          vastitas: "We’re on <b>Vastitas Borealis</b>, the ancient northern sea. Placing a tile on the <b>North Pole</b> costs 4 MegaCredits but also raises the temperature a step. The Viking landing sites give a free delegate" + (c.has("turmoil") ? "" : " — ignored without Turmoil") + ", and Noctis City has no restriction here.",
          utopia: "We’re on <b>Utopia Planitia</b>, the northern lava plain: plenty of plant bonuses away from the equator, geothermal energy near the pole, and two extra cards for settling the Viking 2 or Beagle 2 landing sites. No volcanoes, so Noctis City and Lava Flows can go on any non-reserved area.",
          cimmeria: "We’re on <b>Terra Cimmeria</b>, the cratered highlands: the best steel and titanium on the planet, oceans along the edges, and at Gale crater a tile placement that " + (c.has("colonies") ? "also builds you a colony for 5 MegaCredits." : "would give a colony — ignored without Colonies.")
        }[m.id];
        return "<p>" + (c.p === 1 ? t.replace(/^We’re on/, "You’re on") : t) + (TM.u.solo(c) ? "" : " " + (TM.u.mandaTiles(c) ? "Its printed milestones and awards are covered by tiles tonight." : "Its milestones and awards are printed at the bottom of the board — let’s read them out now.")) + "</p>";
      } },
    { id: "ce", when: (c) => c.mod("ce"), h: "Corporate Era",
      body: (c) => TM.u.solo(c)
        ? "<p>The solo game is played with the <b>Corporate Era</b>: every card with the red-and-white icon is in, including two more corporations — projects about economy and technology rather than terraforming. You don’t get the standard game’s free starting production: your engine starts from zero.</p>"
        : "<p>" + (TM.u.automa(c) ? "You’re" : "We’re") + " playing the <b>Corporate Era</b>: every card with the red-and-white icon is in, including two more corporations. Those cards are about economy and technology rather than terraforming, and " + (TM.u.automa(c) ? "you don’t" : "nobody") + " get" + (TM.u.automa(c) ? "" : "s") + " the free starting production — engines start from zero, so the game runs longer.</p>" },
    { id: "draft", when: (c) => c.mod("draft"), h: "Draft variant",
      body: (c) => TM.u.automa(c) ? (TM.u.automaModule() ? "" : "<p>You’re using the <b>draft</b>: from generation two, research becomes a draft against MarsBot — two piles of four; you keep one card, MarsBot gets one from its pile at random, then you swap piles, until you’ve both kept four. You buy yours as usual.</p>")
        : "<p>We’re using the <b>draft</b>: from generation two, the research phase becomes a draft. Take your four cards, keep one, pass the rest; keep one of three, pass; keep one of two, pass the last — then buy whichever of your four you want. Pass clockwise in even generations, counter-clockwise in odd ones. Watch what you pass: you’re feeding your neighbors.</p>" },
    { id: "beginner", when: (c) => c.mod("beginner"), h: "Beginner corporations",
      body: (c) => "<p>" + (c.p === 1 ? "As a new player you take" : "If this is your first game, take") + " a <b>Beginner Corporation</b>: 42 MegaCredits and ten project cards, free — no corporation or card choices to agonize over. " + (c.p === 1 ? "" : "You can study your hand while the rest of us pick.") + "</p>" },
    { id: "ma", when: (c) => TM.u.mandaTiles(c), h: "Milestones & Awards tiles",
      body: (c) => "<p>Tonight’s milestones and awards come from the <b>Milestones &amp; Awards</b> box: five of each, " + (c.choice("ma-pick") === "choose" ? "chosen together" : "drawn at random") + ", laid over the ones printed on the board. Let’s read them aloud now — they’re the side goals we’ll race for. Same rules: 8 to claim a milestone, 8, 14, 20 to fund an award.</p>" },
    { id: "venus", when: (c) => c.has("venus"), h: "Venus Next",
      body: (c) => {
        const U = TM.u;
        return "<p><b>Venus Next</b> adds a fourth global parameter, the <b>Venus scale</b>, from 0 to 30 percent. Raising it earns TR like any other, with a free card at 8 percent and an extra TR at 16, and there’s a new standard project, <b>Air Scrapping</b>, for 15. " +
          (U.solo(c) ? (c.mod("tr-solo") ? "Venus steps add to your TR like any other parameter." : "In solo, Venus must be finished too — it’s part of your goal.") : "Venus does <i>not</i> end the game.") +
          " New cards collect <b>floaters</b>, a resource like microbes." +
          (U.wgt(c) ? (U.solo(c) ? " After production each generation except the last, you also raise one unfinished parameter — or place an ocean — for the World Government: a free step, but no TR for it." :" After production, the first player acts as the <b>World Government</b> and raises one unfinished parameter a step — or places an ocean — with no reward for themselves.")
            : U.automa(c) ? (U.automaModule() ? "" : " Against MarsBot there’s no World Government step after production: MarsBot’s Government Intervention card does that job.")
            : " We’re skipping World Government Terraforming tonight, for a longer game.") +
          (U.solo(c) ? "" : " There’s a sixth milestone, <b>Hoverlord</b> — seven floaters — and a sixth award, <b>Venuphile</b> — most Venus tags; still only three of each.") + "</p>";
      } },
    { id: "prelude", when: (c) => c.has("prelude"), h: "Prelude",
      body: (c) => {
        const U = TM.u;
        if (!U.preludeCards(c)) return "<p>" + (c.p === 1 ? "You’re" : "We’re") + " using <b>Prelude</b>’s corporations and project cards, but not the Prelude cards themselves.</p>";
        const one = c.p === 1;
        return "<p><b>Prelude</b> jump-starts " + (one ? "you" : "everyone") + ": " + (one ? "you were" : "we were each") + " dealt " + (c.mod("p2-extended") ? "six" : "four") + " <b>Prelude cards</b>; keep two for free, and once " + (one ? "your corporation is" : "corporations are") + " revealed, play them — they’re one-shot boosts that stay in play like green cards, and the whole setup counts as generation one. Some show a <b>wild tag</b>, which counts as a tag of your choice whenever you perform an action" +
          (U.solo(c) ? " — though it triggers nothing as it enters play." : " — say, to claim a milestone — but never for awards.") +
          (U.solo(c) ? " The catch in solo: with Prelude cards you have only <b>12 generations</b>." : "") + "</p>";
      } },
    { id: "prelude2", when: (c) => c.has("prelude2"), h: "Prelude 2",
      body: (c) => "<p><b>Prelude 2</b> adds more Preludes. A few have an action or an effect, like a corporation — they work like blue cards but never count as blue cards. If you can’t play one of your Preludes, reveal it and take <b>15 MegaCredits</b> instead." +
        (c.mod("p2-extended") ? " And we’re using the <b>Extended Start</b>: choose from three corporations and six Preludes." : "") + "</p>" },
    { id: "colonies", when: (c) => c.has("colonies"), h: "Colonies",
      body: (c) => "<p><b>Colonies</b> puts moons and dwarf planets on the table, with a new standard project and a new action. <b>Build a colony</b> — a standard project for 17 — to take the tile’s placement bonus and a share of every future trade there. Or <b>trade</b>: send your trade fleet to a tile, paying 9 MegaCredits, 3 energy or 3 titanium, and take whatever its marker points to; " + (TM.u.solo(c) ? "if you have a colony there, you also get its colony bonus." : "everyone with a colony there gets a bonus too.") + " Each tile holds three colonies and one fleet at a time, and its marker creeps up every generation — the longer nobody trades there, the richer the haul." +
        (TM.u.solo(c) ? " Solo, you start with 2 less MegaCredit production and 3 colony tiles in play." : "") + "</p>" },
    { id: "turmoil", when: (c) => c.has("turmoil"), h: "Turmoil",
      body: (c) => "<p><b>Turmoil</b> adds politics. Six parties sit in the Terraforming Committee, and each generation the party with the most delegates takes power: " + (c.p === 1 ? "you get its <b>ruling bonus</b>" : "its <b>ruling bonus</b> pays out (to everyone for most parties, but the Reds give 1 TR only to whoever has the lowest TR)") + ", its <b>policy</b> — an effect, or an extra action you can pay for — applies during the next action phase, and its party leader becomes <b>Chairman</b>, worth 1 TR. You place delegates by <b>lobbying</b> — free from the lobby, or 5 MegaCredits from your reserve. <b>Global Events</b> are visible three generations ahead, and your influence softens or sharpens them. The catch: the Committee takes <b>1 TR from " + (c.p === 1 ? "you" : "everyone") + " every generation</b>" + (TM.u.automa(c) && !TM.u.automaModule() ? " — MarsBot never loses it" : "") + ". " +
        (TM.u.solo(c) ? "In solo, when the Reds take power they give you 1 TR if your rating is 20 or below. Any party leaders and Chairman you own are worth a point each at the end." : "Party leaders and the Chairman are worth a point each at the end.") + "</p>" },
    { id: "solo", when: (c) => TM.u.solo(c), h: "Playing solo",
      body: (c) => "<p>Solo, you start at TR 14 with no free production, there are <b>no milestones or awards</b>" + (c.has("ma") ? " — the Milestones &amp; Awards tiles stay in the box —" : ",") + " and two <b>neutral cities</b> with greeneries are already on the map. There’s a <b>neutral opponent</b> you can steal from, or reduce any resource or production of — so cards that hit someone else always have a target." +
        (c.mod("tr-solo") ? " You’re playing <b>TR solo</b>: the target is TR 63, and a new standard project, <b>Buffer Gas</b>, buys 1 TR for 16." : "") + "</p>" },
    { id: "variants", when: (c) => c.mod("corp-deal") || c.mod("prelude-nocards"), h: "Tonight’s dealing variant",
      body: (c) => {
        const U = TM.u, b = [];
        if (c.mod("corp-deal") && U.corpDeal(c)) b.push((c.p === 1 ? "You were" : "Each of us was") + " dealt one <b>" + U.setName(U.corpDeal(c)) + "</b> corporation " + (c.mod("p2-extended") ? "among " + (c.p === 1 ? "your" : "our") + " choices" : "and one from the rest") + ", so expect the new expansion’s ideas at the table.");
        if (c.mod("prelude-nocards")) b.push((c.p === 1 ? "You’re" : "We’re") + " playing <b>without Prelude cards</b>; only Prelude’s corporations and project cards are in.");
        return "<p>" + b.join(" ") + "</p>";
      } },
    { id: "later", h: "Don’t worry about these until they come up",
      body: (c) => {
        const U = TM.u, it = [
          "<b>Individual card text</b> — the words in parentheses explain every icon.",
          "<b>Red borders</b> mean any player, including you.",
          "<b>Requirements</b> only matter when you play a card.",
          "<b>Simultaneous effects</b> — the active player picks the order.",
          "<b>Special tiles</b> and their placement rules — the card says.",
          "<b>M€ production</b> can’t drop below −5.",
          U.solo(c) ? "<b>End-game scoring order</b> — it’s in the reference." : "<b>End-game scoring order</b> — we’ll do it together."
        ];
        if (c.has("venus")) it.push("<b>Venus requirement modifiers</b> — cards that bend global requirements bend Venus’s too.");
        if (c.has("colonies") && !U.automa(c)) it.push("<b>Titan, Enceladus and Miranda</b> wake up only once a card can collect their resource.");
        if (c.has("turmoil")) it.push("<b>Influence and the max-5 rule</b> on Global Events — " + (c.p === 1 ? "work it out event by event." : "we’ll work it out event by event."));
        if (c.has("prelude2")) it.push("<b>Required-expansion marks</b> on Prelude 2 cards — discard and redraw any you can’t use.");
        if (U.map(c).id !== "tharsis") it.push("<b>Where Noctis City and Lava Flows may go</b> on this map — see the reference.");
        return U.ul(it);
      } }
  ]
};
