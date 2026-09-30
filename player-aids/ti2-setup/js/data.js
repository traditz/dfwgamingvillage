/* =============================================================================
   Twilight Imperium 2nd Edition — Setup & Reference Utility · data
   Sources (and nothing else):
     · Rules      — Twilight Imperium Second Edition "Rules of Play" (Fantasy Flight, 2000). The scan prints NO page
                    numbers, so "Rules p.N" is the page counted from the cover (p.1 = cover); § = the book's own
                    section numbers (note the book's quirk: Manifest Destiny §10.1 and Distant Suns §10.2 sit under
                    "11.0 Optional Rules").
     · FAQ        — the official FFG "Twilight Imperium Second Edition FAQ" (latest batch dated 7/22/02); "FAQ p.N" is
                    its printed "N of 6". Its batches run newest first (7/22/02, Hope's End questions, 2/27/02, then two
                    undated, older batches).
     · Hope's End — the official Hope's End expansion rules (Fantasy Flight, 2001; "the first expansion for TWILIGHT
                    IMPERIUM 2nd Edition"). A 4-page sheet with no printed numbers: "Hope's End p.N" = sheet page.
   Precedence: FAQ > rulebook / Hope's End; within the FAQ the newest ruling wins (see T2.faqConflicts).
   ============================================================================= */
var T2 = {};

T2.expMeta = {
  core: { name: "Base game",     cls: "tag-core" },
  he:   { name: "Hope's End",    cls: "tag-he" },
  opt:  { name: "Optional rule", cls: "tag-opt" },
  faq:  { name: "FAQ",           cls: "tag-faq" }
};

T2.expansions = [
  { id: "core", short: "Twilight Imperium 2nd Ed.", year: "2000",
    blurb: "The base game: six great races, 39 map hexes, 78 Action and 34 Political cards, the Galactic Progression Chart, and the Manifest Destiny and Distant Suns rules options. Always in play." },
  { id: "he", short: "Hope's End", year: "2001 · official expansion",
    blurb: "Fantasy Flight's first expansion for TI2: the Mentak Coalition and Yssaril Tribes, 13 new hexes (Nebulas, Gravity Rifts, larger galaxies), 56 new cards including Event cards, 58 Deed cards, 4 new technologies, and the Shock Troops and Leaders options." }
];

/* Galaxy layouts. The Hope's End constellations need the expansion; the sheet RECOMMENDS them only for 6 players
   ("We recommend that you only use these larger maps with a 6 player game" — a recommendation, not a rule), and each
   shows exactly six home systems, so choosing one sets the player count to 6 (the page has no seating for fewer). */
T2.galaxies = [
  { id: "std", name: "Standard galaxy", blurb: "The rulebook's constellation for your player count (Diagram Three).", src: "Rules p.5 §6.0" },
  { id: "vortex", requires: "he", name: "“Vortex”", blurb: "Hope's End larger galaxy: 42 system tiles; recommended for 6 players.", src: "Hope's End p.2" },
  { id: "snowflake", requires: "he", name: "“Snowflake”", blurb: "Hope's End larger galaxy: 42 system tiles; recommended for 6 players.", src: "Hope's End p.2" },
  { id: "gauntlet", requires: "he", name: "“Gauntlet”", blurb: "Hope's End larger galaxy: 42 system tiles; recommended for 6 players.", src: "Hope's End p.2" }
];

T2.modules = [
  { id: "bid", requires: "core", name: "Race bidding", summary: "Bid starting income for your race instead of drawing at random",
    description: "Game Variant: instead of randomly selecting races, players use starting income to bid for their favorite race. The rulebook gives no further procedure.", src: "Rules p.3 §4.0" },
  { id: "md", requires: "core", name: "Manifest Destiny", summary: "Buy neutral planets next to your home system before play",
    description: "Optional rule: after the galaxy is built, spend starting credits on neutral planets adjacent to your home system at (Resources + Influence) × 2 each, and place a free Ground Force on each.", src: "Rules p.18 §10.1" },
  { id: "ds", requires: "core", name: "Distant Suns", summary: "A hidden domain counter on every neutral planet; probing and razing",
    description: "Optional rule: face-down Domain Counters on neutral planets trigger on the first invasion — wealth, settlers, new technology, wormholes, radiation, hostile locals, Lazax survivors and more. Adds probing and razing.", src: "Rules p.18–20 §10.2" },
  { id: "shock", requires: "he", name: "Shock Troops", summary: "Veteran Ground Forces (combat 5) that capture enemy docks and PDS",
    description: "Optional rule: a Ground Force that rolls an unmodified 10 in invasion combat may become a Shock Troop. Eight counters.", src: "Hope's End p.2 §2.2" },
  { id: "leaders", requires: "he", name: "Leaders", summary: "Three leaders per race: Generals, Admirals, Diplomats, Agents, Scientists",
    description: "Optional rule: 24 Leader counters, three for each of the eight races, with special abilities; they can be killed, captured and rescued.", src: "Hope's End p.2–3 §2.3" },
  { id: "facedown", requires: "he", needs: "leaders", name: "Face-down Leaders", summary: "Leader counters stay hidden until a Leader uses its skill",
    description: "Optional rule within Leaders: play with the Leader counters face down; reveal one only (temporarily) when it uses its special skills.", src: "Hope's End p.3 §2.3" }
];

/* ---------------------------------------------------------------- shared facts */
T2.word = (n) => ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven", "twelve"][n] || String(n);
T2.galaxyName = (c) => ({ vortex: "Vortex", snowflake: "Snowflake", gauntlet: "Gauntlet" })[c.galaxy] || "standard";

/* Tile dealing for the standard galaxies (Rules p.3–4 §5.0): the 32 system tiles, minus the ones removed unseen. */
T2.deal = {
  2: { remove: 10, each: "11 each" },
  3: { remove: 8, each: "8 each" },
  4: { remove: 0, each: "8 each" },
  5: { remove: 1, each: "one player 7, everyone else 6" },
  6: { remove: 2, each: "5 each" }
};

/* Military victory (Rules p.3 §2.0) */
T2.milWin = (c) => c.p >= 4 ? "the home systems of <b>three</b> other players"
  : (c.p === 3 ? "the home systems of <b>both</b> other players" : "the other player's home system");

/* Unit values: Rules p.13 (costs) and the back cover p.20 (cost / battle / movement). The back cover prints a dash
   for the PDS battle value; the FAQ gives it: 7 (FAQ p.6). */
T2.units = [
  { n: "Dreadnought", cost: 10, hit: "4", mv: "1", note: "Bombards (one shot per Invasion Combat Segment) — never a planet with a PDS" },
  { n: "Carrier", cost: 10, hit: "9", mv: "1", note: "Holds 5 units: any mix of Ground Forces, Fighters and PDS" },
  { n: "Cruiser", cost: 6, hit: "8", mv: "2", note: "Fast and cheap — the blockade ship" },
  { n: "Fighter", cost: 4, hit: "9", mv: "—", note: "Moves only inside a Carrier; needs a Carrier or Spacedock to exist in a system" },
  { n: "Ground Force", cost: 4, hit: "8", mv: "—", note: "Takes and holds planets; travels by Carrier" },
  { n: "P.D.S.", cost: 10, hit: "7*", mv: "—", note: "Planetary shield and gun: fires out of turn, in your Space Combat, and at invaders" },
  { n: "Spacedock", cost: 15, hit: "—", mv: "—", note: "Builds units — up to its planet's Resources each turn; maintains 2 Fighters" }
];

/* Out of Money — sales values (Rules p.18 §10.0) */
T2.sales = [["Dreadnought", 4], ["Carrier", 4], ["P.D.S.", 4], ["Cruiser", 3], ["Fighter", 1], ["Spacedock", 5], ["Ground Force", 1], ["Technology chit", 10]];

/* Technology flow-chart — Hope's End p.4 ("comprehensive": the base game's 20 technologies plus Hope's End's 4; the
   sheet does not say which four are new). Colours: Rules p.7 §7.5 (Green Biological, Red Weapons, Blue Propulsion,
   Yellow General); the chart's type icons were matched to these. Requirements traced from the chart's connectors;
   Graviton Negator's matches the rulebook's own example (Rules p.16 §8.4). */
T2.techTypes = [
  { id: "General", colour: "Yellow", cls: "t-yel" },
  { id: "Biological", colour: "Green", cls: "t-grn" },
  { id: "Propulsion", colour: "Blue", cls: "t-blu" },
  { id: "Warfare", colour: "Red", cls: "t-red" }
];
T2.tech = [
  { n: "Enviro Compensator", ty: "General", req: "", eff: "Gain one Influence for every Space Dock you own." },
  { n: "Sarween Tools", ty: "General", req: "Enviro Compensator", eff: "Each of your planets receive +1 Resources." },
  { n: "Micro Technology", ty: "General", req: "Sarween Tools OR Stasis Capsules", eff: "All of your Trade Agreements generate 3 additional credits for you." },
  { n: "Integrated Economy", ty: "General", req: "Micro Technology AND Cybernetics", eff: "You may place your newly purchased units directly on the board during the “Buy New Units” Segment." },
  { n: "Transit Diodes", ty: "General", req: "Dacxive Animators OR Light/Wave Deflector", eff: "Immediately before your Movement Segment, you may move up to three Ground Forces from any one of your planets to another." },
  { n: "Graviton Laser System", ty: "General", req: "Deep Space Cannon", eff: "Your cost for P.D.S. is now 5 credits per P.D.S." },
  { n: "Stasis Capsules", ty: "Biological", req: "Enviro Compensator", eff: "Your Cruisers and Dreadnoughts may now carry one Ground Force." },
  { n: "Neural Motivator", ty: "Biological", req: "Micro Technology OR Stasis Capsules", eff: "You may draw one additional Action Card every Draw Action Cards Segment." },
  { n: "Dacxive Animators", ty: "Biological", req: "Neural Motivator", eff: "If you win an Invasion Combat, roll once for every Ground Force killed (yours and your opponent's); for every 9 or 10, place one new Ground Force on the planet." },
  { n: "Cybernetics", ty: "Biological", req: "Stasis Capsules OR Antimass Deflectors", eff: "All of your Fighters now receive +1 during Space Battles." },
  { n: "Gen Synthesis", ty: "Biological", req: "Cybernetics", eff: "During the Place New Units phase, you may purchase and place one Ground Force on each of your planets without a spacedock (at most one per planet per turn)." },
  { n: "X-89 Bacterial Weapon", ty: "Biological", req: "Neural Motivator AND Assault Cannon", eff: "A Dreadnought may use this before bombarding: immediately destroy all enemy Ground Forces on the planet, then discard all of your Action Cards." },
  { n: "Antimass Deflectors", ty: "Propulsion", req: "", eff: "All of your ships may move through Asteroid Fields, but may never end their move in one." },
  { n: "XRD Transporter", ty: "Propulsion", req: "Antimass Deflectors", eff: "All of your Carriers now receive +1 movement." },
  { n: "Type IV Drive", ty: "Propulsion", req: "Neural Motivator AND XRD Transporter", eff: "All of your Cruisers and Dreadnoughts now receive +1 movement." },
  { n: "Spatial Jump", ty: "Propulsion", req: "Type IV Drive", eff: "Before your Movement Segment, you may nominate one fleet to go anywhere in the galaxy; after the Jump roll for every ship — on 8, 9 or 10 it is lost. (Fighters roll too — FAQ p.1.)" },
  { n: "Light/Wave Deflector", ty: "Propulsion", req: "XRD Transporter AND Magen Defense Grid", eff: "All of your ships may move through systems containing enemy ships." },
  { n: "Shuttle Logistics", ty: "Propulsion", req: "Cybernetics AND Graviton Negator", eff: "Immediately before your Space Battles Segment, unless enemy ships are in any of the systems involved, each of your Ground Forces may move once from a friendly planet to another friendly planet in the same or an adjacent system." },
  { n: "Hylar V Assault Laser", ty: "Warfare", req: "", eff: "All of your Cruisers now receive +1 in battle." },
  { n: "Deep Space Cannon", ty: "Warfare", req: "Hylar V Assault Laser", eff: "During your Space Combat Segment, each of your P.D.S. may fire once at an enemy fleet in an adjacent system." },
  { n: "Magen Defense Grid", ty: "Warfare", req: "Deep Space Cannon", eff: "All your P.D.S. gain +1 on all rolls, and all defending Ground Forces in a system with a P.D.S. gain +1 during Invasion Combat." },
  { n: "Assault Cannon", ty: "Warfare", req: "Deep Space Cannon AND Cybernetics", eff: "Before any combat begins, your participating Dreadnoughts may each fire one shot; your opponent removes these casualties immediately, with no defense." },
  { n: "Graviton Negator", ty: "Warfare", req: "Assault Cannon OR Dacxive Animators", eff: "Your Dreadnoughts may bombard planets that contain P.D.S. Fighters may take part in Invasion Combat like Ground Forces (survivors return to space; they can't take control of a planet)." },
  { n: "Strategic Mathematics", ty: "Warfare", req: "XRD Transporter AND Assault Cannon", eff: "Immediately after winning a Space Combat, half (round down) of your participating Cruisers may move into an adjacent unoccupied system." }
];

/* Distant Suns domain effects — Rules back cover p.20 (with the Lazax special rules, p.19) */
T2.domains = [
  { n: "Biohazard", eff: "The first Ground Force to land here is always destroyed. The first player to invade successfully can't use the planet's resources next round. Then remove the counter." },
  { n: "Radioactive", eff: "Kills all Ground Forces of the initial invasion. Remove the counter after that first invasion attempt." },
  { n: "Settlers", eff: "Roll a die: 7 or more, the settlers are your race; 6 or lower, randomly pick one of the other races in play. The settling race immediately gets two free Ground Forces here. Discard." },
  { n: "Lazax Survivors", eff: "No one believes you: your influence is zero for one whole round. Discard. (Probing it or razing it has its own special rules — see below.)" },
  { n: "Wealth", eff: "Receive as many credits as the counter shows. Discard." },
  { n: "Industrial Society", eff: "The invading player may immediately place a free Spacedock here. Discard." },
  { n: "New Technology", eff: "Receive 5 × the planet's Influence in credit towards your next technology purchase. Discard." },
  { n: "Hostile Locals", eff: "The number shown of neutral Ground Forces defend the planet. If they aren't all destroyed in one invasion, the next invasion faces the full number again." },
  { n: "Wormhole", eff: "A new wormhole opens in space near this planet and links to its partner(s) (Alpha or Beta) like a normal wormhole. Leave the counter in space as a reminder." },
  { n: "Peaceful Invasion", eff: "No significant problems. Discard." }
];

/* Leaders — Hope's End p.3 */
T2.leaders = [
  { n: "General", fx: ["In a battle during the Invasion Combat Segment, re-roll ONE die roll every round of the battle (several friendly Generals still give only one re-roll).", "Dreadnoughts bombarding a planet that holds an enemy General get −4 to their roll."] },
  { n: "Admiral", fx: ["In a Space Battle, roll one additional die for the ship the Admiral is on.", "No fleet attacked by a fleet with an Admiral may play Skilled Retreat — unless the retreating fleet also has an Admiral.", "Up to three Dreadnoughts that start and end their movement with an Admiral get +1 movement."] },
  { n: "Diplomat", fx: ["On a planet about to be invaded, may delay the invasion one turn: the invading Ground Forces return to their fleet and can't attack until next turn. Not usable the turn after, nor on Mecatol Rex. It stops invading Ground Forces, not bombardment (FAQ p.2).", "A fleet with a Diplomat may pass through systems with an opponent's ships — only with that opponent's permission."] },
  { n: "Agent", fx: ["If an Agent joins an invasion attack, enemy P.D.S. may not fire at the invading Ground Forces.", "May be sacrificed at any time to act as a Sabotage card (then removed from play)."] },
  { n: "Scientist", fx: ["On any planet outside your home system: use double that planet's resource value in credit towards technology purchases in the Technology Phase.", "Once each round, buy one P.D.S. or one Spacedock for only 5 credits on the Scientist's planet. It is placed on that planet even if the Scientist moves on (FAQ p.2)."] }
];

/* FAQ precedence note: the one FAQ-vs-FAQ contradiction, resolved newest-first */
T2.faqConflicts = [
  "Two fleets that both have Assault Cannon and at least one Dreadnought: the 2/27/02 batch (FAQ p.2) says the player with more Assault-Cannon Dreadnoughts fires first with the difference; an older, undated answer (FAQ p.5) says the two cancel out. The newer ruling (p.2) is applied here."
];

/* =============================================================================
   SETUP PHASES — c = { has(exp), p, mod(id), galaxy, big }
   ============================================================================= */
T2.mapImg = {
  2: ["map-2p.webp", 300, 290], 3: ["map-3p.webp", 300, 282], 4: ["map-4p.webp", 279, 300],
  5: ["map-5p.webp", 267, 300], 6: ["map-6p.webp", 277, 300],
  vortex: ["map-vortex.webp", 247, 300], snowflake: ["map-snowflake.webp", 275, 300], gauntlet: ["map-gauntlet.webp", 297, 300],
  rings: ["map-rings.webp", 300, 292], planet: ["planet-key.webp", 300, 202]
};
T2.fig = (key, alt, cap) => {
  const m = T2.mapImg[key];
  return "<figure class='map-fig'><img src='images/" + m[0] + "' width='" + m[1] + "' height='" + m[2] + "' alt='" + alt + "' loading='lazy'>" +
    "<figcaption>" + cap + "</figcaption></figure>";
};

T2.phases = [
  {
    title: "Races & Supplies",
    steps: [
      { when: () => true, exp: (c) => c.has("he") ? "he" : "core",
        t: "Players and home systems",
        d: (c) => {
          const homes = c.has("he") ? 8 : 6;
          let d = "<ul><li><b>" + c.p + " players.</b> " + (c.p === 5 ? "The book warns a 5-player game is lopsided (“we do not recommend” it) but accommodates it with A and B starting positions (see “Five players — A and B positions”)." : (c.p === 2 ? "Two players is allowed; note the Galactic Council never meets in a two-player game." : "The book says Twilight Imperium works best with 3, 4 or 6 players.")) + "</li>";
          d += "<li>Place the <b>" + T2.word(homes) + " Homesystem tiles</b> (the hexes with yellow borders) face down" + (c.has("he") ? " — Hope's End adds the <b>Mentak Coalition</b> and <b>Yssaril Tribes</b> home systems to the base game's six" : "") + ".</li>";
          d += c.mod("bid")
            ? "<li><b>Race bidding (variant):</b> instead of drawing races at random, players use their <b>starting income</b> to bid for their favorite race. The rulebook gives no further procedure — agree the auction details at the table.</li>"
            : "<li>Each player <b>randomly takes one</b>: that home system's race is yours for the game.</li>";
          d += "<li>Remove the home systems nobody is playing" + (c.p < homes ? " (" + T2.word(homes - c.p) + " left over)" : "") + ".</li></ul>";
          return d;
        },
        src: (c) => "Rules p.3 §4.0, p.4 §5.0, p.5 §6.0" + (c.p === 2 ? ", p.11 §8.1" : "") + (c.has("he") ? " · Hope's End p.1 §1.1" : "") },
      { when: () => true, exp: "core",
        t: "Race stands",
        d: (c) => "<ul><li>Each player takes the <b>Race Stand</b> for their race and presses the race card into a plastic stand.</li>" +
          "<li>The back of the stand lists your <b>starting income</b>, <b>special abilities</b>, <b>starting technology</b> and <b>Extra Starting Units</b>. (Example: the Sardakk N'orr begin with 35 credits, two Technology chits and 5 extra combat units.)</li>" +
          (c.has("he") ? "<li>Hope's End: the Mentak Coalition and Yssaril Tribes come with their own 2 Race Stands and 22 Control Markers.</li>" : "") + "</ul>",
        src: (c) => "Rules p.3 §4.0, p.5 §6.1, p.6 §7.3" + (c.has("he") ? " · Hope's End p.1 §1.1" : "") },
      { when: () => true, exp: "core",
        t: "The Bank",
        d: "<ul><li>Put all the <b>Lazax Gold Credits</b> (“credits”) in a separate pile: the <b>Bank</b>.</li><li>Credits spent on units go back to the Bank.</li></ul>",
        src: "Rules p.3 §4.0, p.6 §7.2, p.12 §8.2" },
      { when: () => true, exp: (c) => c.has("he") ? "he" : "core",
        t: "Technology chits",
        d: (c) => "<ul><li>Sort the technology chits by type and colour within reach of everyone: <b>Green</b> Biological · <b>Red</b> Weapons · <b>Blue</b> Propulsion · <b>Yellow</b> General.</li>" +
          "<li>The base game has <b>20</b> technologies with <b>six chits each</b>, so all six players can own every one. A chit's front shows its name and requirements; the back, its effect.</li>" +
          (c.has("he") ? "<li><b>Hope's End:</b> add its <b>4 new technologies</b> (24 in all — see the Technology Tree in the reference).</li>" : "") + "</ul>",
        src: (c) => "Rules p.3 §4.0, p.6–7 §7.5" + (c.has("he") ? " · Hope's End p.1 §1.1, p.4" : "") },
      { when: () => true, exp: "core",
        t: "Colours and control markers",
        d: "<ul><li>Each player takes <b>all the plastic pieces of one colour</b> and the <b>Control Markers</b> of their race (11 per race).</li>" +
          "<li>Control markers mark planets you control that hold none of your Ground Forces, your Trade Agreements, and your place on the Progression Chart.</li>" +
          "<li>Pieces are limited but units aren't: set out the triangular <b>number counters</b> — a counter under a unit shows how many of that unit stand there (anyone may check them).</li></ul>",
        src: "Rules p.3 §4.0, p.6 §7.1, §7.4" },
      { when: () => true, exp: (c) => c.has("he") ? "he" : "core",
        t: "Political and Action decks",
        d: (c) => {
          let d = "<ul>";
          if (c.has("he")) {
            d += "<li><b>Hope's End:</b> mix its <b>28 Political</b> and <b>28 Action</b> cards into the base decks.</li>";
            const out = [];
            if (!c.mod("ds")) out.push("<b>Distant Suns</b>");
            if (!c.mod("leaders")) out.push("<b>Leaders</b>");
            d += "<li>Cards that need an optional rule carry that rule's keyword in the lower left-hand corner (the sheet's examples: Distant Suns, Leaders). Remove the cards of every optional rule you aren't using" +
              (out.length ? " — tonight that includes the " + out.join(" and ") + " cards." : "; tonight you keep the Distant Suns and Leaders cards.") + "</li>";
            d += "<li>Some of the new Political cards are <b>Event</b> cards (see the Political Phase).</li>";
          }
          d += "<li>Shuffle the <b>Political cards</b> and the <b>Action cards</b> into two separate decks within reach.</li></ul>";
          return d;
        },
        src: (c) => "Rules p.3 §4.0" + (c.has("he") ? " · Hope's End p.1 §1.1, p.3 §2.4" : "") },
      { when: (c) => c.has("he"), exp: "he",
        t: "Deed cards",
        d: "<ul><li>Separate the <b>58 Deed cards</b> (one per planet of TI2 and Hope's End) and keep the neutral planets' deeds in a central pile.</li>" +
          "<li>When you successfully invade a planet, take its Deed — from the pile, or from the player who just lost it. Your deeds show your resources, influence and planet count at a glance, and some new Action cards use them to pick planets at random.</li></ul>",
        src: "Hope's End p.1 §1.1" },
      { when: (c) => c.mod("shock"), exp: "opt",
        t: "Shock Troop counters",
        d: "<ul><li>Set the <b>8 Shock Troop counters</b> aside. A Ground Force earns Shock Troop status in play (a counter slides over its flag); never more than 8 at once.</li></ul>",
        src: "Hope's End p.1 §1.1, p.2 §2.2" },
      { when: (c) => c.mod("leaders"), exp: "opt",
        t: "Leader counters",
        d: (c) => "<ul><li>Each player takes their race's <b>three Leader counters</b> (24 counters: three for each of the eight races; the types are General, Admiral, Diplomat, Agent and Scientist).</li>" +
          (c.mod("facedown") ? "<li><b>Face-down Leaders:</b> keep your counters face down; reveal one only (temporarily) when it uses its special skill.</li>" : "") +
          "<li>They go on the board once the galaxy is built (see “Leaders take the field”).</li></ul>",
        src: "Hope's End p.1 §1.1, p.2–3 §2.3" },
      { when: () => true, exp: (c) => c.mod("bid") ? "opt" : "core",
        t: "Collect your starting credits, technology and units",
        d: (c) => "<ul><li>From the Bank, take your race's <b>starting income</b>" + (c.mod("bid") ? " (a bid for your race is paid out of this starting income)" : "") + ".</li>" +
          "<li>Take the <b>technology chits</b> your race starts with and place them in front of you.</li>" +
          "<li>Gather your <b>starting units</b>; they go on the board once the galaxy is built.</li></ul>",
        src: (c) => "Rules p.3 §5.0, p.5 §6.1" + (c.mod("bid") ? ", p.3 §4.0" : "") }
    ]
  },
  {
    title: "Creating the Galaxy",
    steps: [
      { when: () => true, exp: "core",
        t: "Mecatol Rex",
        d: "<ul><li>Place the <b>Mecatol Rex</b> tile in the middle of the table.</li></ul>",
        src: "Rules p.3 §5.0" },
      { when: () => true, exp: (c) => c.big ? "he" : "core",
        t: "Deal the system tiles",
        d: (c) => {
          if (c.big) return "<ul><li>With Hope's End you have <b>8 Homesystems, 1 Mecatol Rex and 43 regular tiles</b>. The “" + T2.galaxyName(c) + "” constellation uses <b>42</b> system tiles: mix the 43 regular tiles face down and <b>discard one at random</b>.</li>" +
            "<li>The sheet doesn't say how to share the tiles out; this page follows the base game (deal them all face down, evenly): <b>7 each</b>.</li>" +
            "<li>Hope's End recommends these larger maps only for 6 players, so the planets, resources and influence needed to win don't come too easily.</li></ul>";
          const k = T2.deal[c.p];
          let d = "<ul><li>Mix the <b>32 system tiles</b> (every tile except Mecatol Rex and the home systems) face down.</li>";
          d += "<li><b>" + c.p + " players:</b> " + (k.remove ? "remove <b>" + k.remove + "</b> tile" + (k.remove > 1 ? "s" : "") + " from the game without looking at " + (k.remove > 1 ? "them" : "it") + ", then deal the rest" : "deal all 32") + " face down evenly — <b>" + k.each + "</b>.</li>";
          if (c.p === 5) d += "<li>Before looking at any of their tiles, the player dealt <b>7</b> must either <b>pay 5 credits</b> or <b>pass the 7th tile</b> to another player of their choice (who does not pay).</li>";
          if (c.has("he")) d += "<li>The rulebook's counts above are for the base game's 32 tiles, so this page builds the standard layouts from those. Hope's End presents its 11 new regular tiles as the way to build larger galaxies (choose one above) and gives no tile counts for adding them to the standard layouts.</li>";
          return d + "</ul>";
        },
        src: (c) => c.big ? "Hope's End p.1–2 §2.1 · Rules p.3–4 §5.0" : "Rules p.3–4 §5.0" + (c.has("he") ? " · Hope's End p.1–2 §2.1" : "") },
      { when: () => true, exp: "core",
        t: "Seat the home systems",
        d: "<ul><li>Everyone rolls the die. The <b>lowest roll</b> places their home system against one edge of Mecatol Rex and drags it about two feet away toward themselves (Diagram One — its caption says about three); then the player to their left does the same, and so on.</li>" +
          "<li>These home systems move into the map when their spot opens up (next step).</li></ul>",
        src: "Rules p.4 §5.0" },
      { when: () => true, exp: (c) => (c.big || c.has("he")) ? "he" : "core",
        t: (c) => c.big ? "Build the “" + T2.galaxyName(c) + "”" : "Build the galaxy",
        d: (c) => {
          const red = c.big ? "Asteroid Fields, Supernovas, <b>Nebulas and Gravity Rifts</b>"
            : "Asteroid Fields and Supernovas" + (c.has("he") ? " — and Hope's End's Nebulas and Gravity Rifts, if you add its tiles" : "");
          let d = "<ul>" + (c.big ? "<li>Hope's End shows only the finished map, so this page applies the base game's placement rules below, building out from Mecatol Rex until the galaxy matches the picture.</li>" : "") +
            "<li>Starting with the lowest roll and going clockwise, players take turns placing <b>one tile</b> from their hand face up around Mecatol Rex.</li>" +
            "<li><b>Ring by ring:</b> no tile in ring 2 until ring 1 is complete, none in ring 3 until ring 2 is complete.</li>" +
            "<li>Place your <b>home system</b> in its spot as soon as that spot is available" + (c.big ? " (its spot on the picture)" : " (in the six-player diagram, after ring 2 is complete)") + ".</li>" +
            "<li><b>Red-bordered tiles</b> (" + red + ") may not go next to another red-bordered tile unless there is absolutely no other option.</li>" +
            "<li><b>Snake order:</b> after every full round the direction reverses (P1 P2 P3 P4, P4 P3 P2 P1, P1 P2…), so the last player places twice in a row.</li>" +
            "<li>If you placed a system with <b>no planet</b> on your last turn, you must place a planet tile this turn if you can.</li>" +
            "<li><i>Tip from the book:</i> keep wealthy systems near your own home; Asteroid Fields and Supernovas make good barriers against an aggressive neighbour.</li></ul>";
          if (c.big) d += "<div class='figs'>" + T2.fig(c.galaxy, "The " + T2.galaxyName(c) + " constellation: 42 white system tiles around a grey Mecatol Rex, with six dark home systems on its edge",
            "“" + T2.galaxyName(c) + "” (Hope's End p.2): the six solid dark hexes on the edge are the home systems, the grey hex is Mecatol Rex and the white hexes are the 42 system tiles." +
            (c.galaxy === "vortex" ? "" : " The dark, star-flecked hexes inside the map read as holes — empty space with no tile. The sheet doesn't say so, but a six-player map has only six home systems.")) + "</div>";
          else d += "<div class='figs'>" + T2.fig(c.p, "The " + c.p + "-player galaxy: a hex map with Mecatol Rex at the centre and " + (c.p === 5 ? "five home systems — two black, two lettered A and one lettered B" : "black home systems"),
              "Diagram Three — " + c.p + "-player galaxy. " + (c.p === 5 ? "Home systems: the two black hexes, the two “A” positions (15 extra starting credits each) and the “B” position (20)." : "Black hexes are home systems.")) +
            (c.p === 6 ? T2.fig("rings", "Diagram Two: the six-player map with rings 1, 2 and 3 around Mecatol Rex", "Diagram Two — rings 1–3 around Mecatol Rex; home systems sit in ring 3.") : "") + "</div>";
          return d;
        },
        src: (c) => "Rules p.4–5 §5.0" + (c.big ? " · Hope's End p.1–2 §2.1" : " · Rules p.5 Diagram Three" + (c.has("he") ? " · Hope's End p.1 §2.1" : "")) }
    ]
  },
  {
    title: "Deploy & Begin",
    steps: [
      { when: (c) => c.p === 5, exp: "core",
        t: "Five players — A and B positions",
        d: "<ul><li>The two players in the <b>“A” positions</b> each receive <b>15 extra credits</b>.</li><li>The player in the <b>“B” position</b> receives <b>20 extra credits</b>.</li><li>The other two positions get nothing extra (Diagram Three, above).</li></ul>",
        src: "Rules p.5 §6.0" },
      { when: () => true, exp: "core",
        t: "Starting units",
        d: "<ul><li>On your home system place <b>one Ground Force on each planet</b> and <b>one Spacedock</b> on the home planet with the <b>highest Resources</b>.</li>" +
          "<li>Add the <b>Extra Starting Units</b> from your race stand — all of them in your home system (ships in space, Ground Forces and PDS on planets).</li>" +
          "<li>Each planet shows its resource value, name, influence value and any technology specialty:</li></ul>" +
          "<div class='figs'>" + T2.fig("planet", "Planet key: Torkan, resource value 4 on the left, influence value 2 on the right, technology specialty symbol", "Reading a planet (Rules p.5): Torkan — 4 resources, 2 influence, with a technology specialty.") + "</div>",
        src: "Rules p.5 §6.1, p.7 §7.6" },
      { when: (c) => c.mod("leaders"), exp: "opt",
        t: "Leaders take the field",
        d: (c) => "<ul><li>Place your <b>three Leaders</b> together on a <b>single planet</b> of your home system" + (c.mod("facedown") ? ", face down" : "") + ".</li><li>Leaders always stand on a friendly planet or ride a ship; they never control a planet on their own.</li></ul>",
        src: (c) => "Hope's End " + (c.mod("facedown") ? "p.2–3" : "p.2") + " §2.3" },
      { when: () => true, exp: "core",
        t: "The Progression Chart",
        d: "<ul><li>Place the <b>Galactic Progression Chart</b> where everyone can see it and put one of your Control Markers under <b>Warlord</b>.</li></ul>",
        src: "Rules p.17 §8.6" },
      { when: (c) => c.mod("ds"), exp: "opt",
        t: "Distant Suns — domain counters",
        d: "<ul><li>Shuffle all the <b>Domain Counters</b> and place one <b>face down on every neutral planet</b> — none in home systems or on Mecatol Rex.</li><li>Remove the extra counters from the game without looking at them.</li></ul>",
        src: "Rules p.18 §10.2" },
      { when: (c) => c.mod("md"), exp: "opt",
        t: "Manifest Destiny",
        d: (c) => "<ul><li>With your <b>starting credits</b> you may buy control of <b>neutral planets adjacent to your home system</b>.</li>" +
          "<li>Price: <b>(Resources + Influence) × 2</b>, paid to the Bank; then place <b>one free Ground Force</b> on the planet. (Example: Sakulag, 4 resources and 2 influence, costs 12.)</li>" +
          (c.mod("ds") ? "<li>With Distant Suns: a planet you gain without invading it ignores its Domain Counter — remove the counter from the game.</li>" : "") +
          "<li>The book doesn't set a buying order; agree one at the table.</li></ul>",
        src: (c) => "Rules p.18 §10.1" + (c.mod("ds") ? " · Rules p.19 §10.2" : "") },
      { when: () => true, exp: "core",
        t: "Begin the first round",
        d: (c) => c.p === 2
          ? "<ul><li>In a two-player game the Galactic Council is dissolved: <b>no Political Phase</b> is ever held. Begin with the <b>Economy Phase</b>.</li><li>Round order: Economy → Individual Turns → Technology → Place New Units → Progression, then again.</li></ul>"
          : "<ul><li>Begin with the <b>Political Phase</b>, then Economy → Individual Turns → Technology → Place New Units → Progression, and repeat until someone wins.</li></ul>",
        src: (c) => "Rules p.9 §8.0" + (c.p === 2 ? ", p.11 §8.1" : "") + ", p.18 §9.0" }
    ]
  }
];

/* =============================================================================
   RULES REFERENCE
   ============================================================================= */
T2.reference = [
  {
    title: "Winning — the Progression Chart and military victory",
    open: true,
    when: () => true,
    html: (c) => "<h4>Imperium Rex</h4><ul>" +
      "<li>Advance on the <b>Galactic Progression Chart</b> from <b>Warlord</b> to <b>Imperium Rex</b>. The first to reach Imperium Rex seizes the council and wins at once.</li>" +
      "<li>Imperium Rex needs an empire of at least: <b>9 planets</b> outside your home system · <b>9 technology advances</b> · <b>30 resources</b> · <b>30 influence</b>.</li>" +
      "<li>In the <b>Progression Phase</b>, advance <b>one</b> category at most; you never move back, even if you later fall short.</li>" +
      "<li>The book's own examples: Warlord → <b>Foundation</b> needs 5 planets outside your home system; → <b>Consortium</b> needs 4 technology chits and 5 planets outside. The other brackets are printed on the chart itself, not in the rules.</li>" +
      "<li>Planet modifiers such as Sarween Tools (+1 resource per planet) count toward the chart (FAQ p.5–6).</li>" +
      "<li><b>Tie:</b> two players reach Imperium Rex in the same round — the higher influence wins; then the higher resources; otherwise it's a draw.</li></ul>" +
      "<h4>Military victory (" + c.p + " players)</h4><ul><li>Control <b>all the planets</b> in " + T2.milWin(c) + " and you win immediately, wherever you stand on the chart.</li>" +
      "<li>(4–6 players: three other players' home systems. 2–3 players: the other player(s)'.)</li></ul>",
    src: () => "Rules p.2 §2.0, p.3, p.17–18 §8.6 · FAQ p.5–6"
  },
  {
    title: "The round — six phases",
    when: () => true,
    html: (c) => "<ol>" +
      "<li><b>Political Phase</b> — draw an agenda, debate, vote." + (c.p === 2 ? " <i>Never held with two players.</i>" : "") + "</li>" +
      "<li><b>Economy Phase</b> — Draw Action Card · Receive Credits · Purchase Units. Everyone plays these at once; if there's doubt, go in influence order, highest first.</li>" +
      "<li><b>Individual Turns Phase</b> — in influence order, <b>highest first</b>, each player plays all three segments before the next: <b>Movement</b> → <b>Space Combat</b> (the back cover calls it Space Battles) → <b>Invasion Combat</b>. Influence changes as planets change hands, so re-check it after each turn; nobody takes two turns in a round.</li>" +
      "<li><b>Technology Phase</b> — each player may buy one technology.</li>" +
      "<li><b>Place New Units Phase</b> — units bought in the Economy Phase arrive at your Spacedocks.</li>" +
      "<li><b>Progression Phase</b> — check the chart. If nobody has won, start again with the " + (c.p === 2 ? "Economy" : "Political") + " Phase.</li></ol>" +
      "<ul><li><b>Turn-order ties</b> (equal influence): most resources goes first; then most technologies; then most credits in hand; then a coin toss (FAQ p.4).</li>" +
      "<li>Bonus influence from Fantastic Rhetoric counts for voting order only, not turn order (FAQ p.3).</li></ul>",
    src: (c) => "Rules p.9 §8.0, p.11 §8.2, p.13 §8.3, p.18 §9.0, p.20 · FAQ p.3–4"
  },
  {
    title: "Political Phase — the Galactic Council",
    when: () => true,
    html: (c) => (c.p === 2 ? "<p class='callout'><b>Two players:</b> the council is dissolved — no Political Phase is held, and any Laws are discarded. The same happens if a bigger game is ever reduced to two players.</p>" : "") +
      "<h4>Running it</h4><ol><li>Draw a <b>Political card</b> and read the agenda aloud.</li><li><b>Debate</b> — threaten, lure, convince.</li><li><b>Vote</b>: the player with the <b>least influence votes first</b>, the most influence last.</li></ol>" +
      "<ul><li>Your votes = your total <b>influence</b> (the influence of all your planets). Cast <b>all</b> of them or abstain — never split or part-cast.</li>" +
      "<li><b>Elect</b> agendas: the subject with the most votes is elected. <b>For/Against</b> agendas: the side with the majority of the cast votes wins.</li>" +
      "<li><b>Laws</b>: voted FOR → lay the card face up by the deck; its effect is permanent. Voted AGAINST → apply any “against” effect, then discard.</li>" +
      "<li>A few cards let the council revote old Laws. A <b>Revote</b> card drawn when no Laws are in play is discarded and the phase ends.</li>" +
      "<li><b>Tied vote or everyone abstains:</b> the player with the highest total influence decides (who is elected, or whether the Law passes) (FAQ p.4).</li>" +
      "<li><b>Voting-order ties:</b> the player with the fewest resources votes first; then fewest technologies; then fewest credits; then a coin toss (FAQ p.4).</li></ul>" +
      "<h4>Deals</h4><ul><li>Promises are paper-thin: breaking one costs nothing but reputation.</li>" +
      "<li>Credits pass voluntarily between players <b>only in this phase</b> (unless a card says otherwise): all bribes and payments happen here.</li>" +
      "<li>Action cards may be traded, sold or given away in this phase.</li>" +
      (c.mod("leaders") ? "<li><b>Leaders:</b> a captor may hand a captive Leader to any player here — to its owner, it is freed.</li>" : "") + "</ul>" +
      (c.has("he") ? "<h4>Event cards (Hope's End)</h4><ul><li>Some new Political cards are <b>Events</b>, not agendas: they can't be Vetoed or affected by cards and abilities that affect regular Political cards.</li><li>Drawing one: read it aloud and resolve it at once, then draw another Political card and carry on.</li></ul>" : "") +
      "<h4>Card rulings (FAQ)</h4><ul>" +
      "<li><b>Labor Force Politics</b> swaps influence and resources only when you receive credits and when you vote — so Sarween Tools adds votes, not credits (FAQ p.1).</li>" +
      "<li><b>Determine Policy</b> (Action): the Xxcha may still use their ability to get rid of the chosen agenda before the vote, and may discard a current Law being revoted by paying 5 credits (FAQ p.2, p.4).</li>" +
      "<li><b>Dispute Resolution</b>: each player votes once for a pair of planets; the pair with the most votes is elected (FAQ p.4).</li>" +
      "<li><b>Mass Mobilization</b>: the Ground Forces go only on planets you control (FAQ p.3–4).</li>" +
      "<li>The two <b>“Long Term Truce”</b> cards (as the FAQ names them; time limits of two and one turns) are <b>not Laws</b> — errata. “Attack” = invading a system with an enemy fleet, invading a planet with enemy troops, rolling dice to hit enemy forces, or destroying them with a technology such as the X-89 bacterial weapon; other hostile acts (e.g. Public Execution) are not attacks (FAQ p.6).</li></ul>",
    src: (c) => "Rules p.9–11 §8.1 · FAQ p.1–4, p.6" + (c.has("he") ? " · Hope's End p.3 " + (c.mod("leaders") ? "§2.3–2.4" : "§2.4") : "")
  },
  {
    title: "Economy Phase — cards, credits, trade and purchases",
    when: () => true,
    html: (c) => "<h4>Draw Action Card</h4><ul>" +
      "<li>Each player draws <b>one</b> Action card" + (c.has("he") ? " (Neural Motivator: one more)" : "") + " and keeps it hidden. Each card says exactly when it may be played.</li>" +
      "<li><b>Hand limit 7:</b> holding 7, you don't draw. You may discard any number just before drawing.</li>" +
      "<li>No two identical Action cards on the same situation or target in one round (e.g. not two Flank Speeds on one fleet — one each on two fleets is fine).</li></ul>" +
      "<h4>Receive Credits</h4><ul>" +
      "<li>Take credits from the Bank equal to your total <b>resources</b> (the resources of all your planets).</li>" +
      "<li><b>Trade income:</b> for each Trade Agreement, collect credits equal to the <b>number of planets your partner controls</b>" + (c.has("he") ? " (Micro Technology: +3 more per agreement)" : "") + ". Example: Letnev with 7 planets and Xxcha with 4 — Letnev collects 4, Xxcha 7.</li>" +
      "<li><b>Stellar Criminals</b> (“halve any one opponent's income for one turn”) halves all the income that player receives in the Economy Phase — trade agreements, “gold domain counters” and the Rare Mineral card included (FAQ p.3).</li></ul>" +
      "<h4>Trade Agreements (Action cards)</h4><ul>" +
      "<li>Play one immediately before your Movement Segment; lay it face up and both partners put a Control Marker on it. Only <b>one</b> Trade Agreement between the same two players at a time.</li>" +
      "<li>Either partner may cancel it at any time (announce it and discard). It breaks <b>automatically</b> if the partners fight each other in a space battle or invasion combat — including a Deep Space Cannon shot into the partner's system (FAQ p.3) — <b>except</b> the Hacan's agreements, which survive combat with a partner.</li></ul>" +
      "<h4>Purchase Units</h4><ul>" +
      "<li>Pay the Bank; bought units wait beside your Race Stand until the Place New Units Phase.</li>" +
      "<li><b>Check your Spacedock limits and blockades first:</b> units you can't place are destroyed, and the credits lost.</li>" +
      (c.mod("leaders") ? "<li><b>Scientist:</b> once a round, one PDS or Spacedock for 5 credits on the Scientist's planet — placed there even if the Scientist then moves (FAQ p.2).</li>" : "") +
      (c.has("he") ? "<li>Graviton Laser System: every PDS costs you 5. Integrated Economy: place purchased units directly on the board during this segment.</li>" : "") + "</ul>",
    src: (c) => "Rules p.11–12 §8.2 · FAQ " + (c.mod("leaders") ? "p.2–3" : "p.3") + (c.has("he") ? " · Hope's End " + (c.mod("leaders") ? "p.3–4" : "p.4") : "")
  },
  {
    title: "Units — costs, combat values and capacity",
    when: () => true,
    html: (c) => "<div class='tbl-wrap'><table class='tbl'><thead><tr><th scope='col'>Unit</th><th scope='col'>Cost</th><th scope='col'>Hits on</th><th scope='col'>Move</th><th scope='col'>Notes</th></tr></thead><tbody>" +
      T2.units.map(u => "<tr><th scope='row'>" + u.n + "</th><td>" + u.cost + "</td><td>" + u.hit + "</td><td>" + u.mv + "</td><td>" + u.note + "</td></tr>").join("") +
      (c.mod("shock") ? "<tr><th scope='row'>Shock Troop</th><td>—</td><td>5</td><td>—</td><td>A Ground Force promoted in invasion combat (Hope's End)</td></tr>" : "") +
      "</tbody></table></div>" +
      "<p class='tbl-note'>* The back cover prints only a dash for the PDS battle value; the FAQ supplies it: a PDS hits on 7 (FAQ p.6). “Hits on” = roll this or higher on the ten-sided die (0 = 10).</p>" +
      "<ul><li><b>Carrier:</b> 5 slots in any mix of Ground Forces, Fighters and PDS (e.g. 1 Fighter, 2 Ground Forces, 2 PDS). A PDS doesn't work while aboard.</li>" +
      "<li><b>Fighters</b> can't move alone or even exist in space without support: each Spacedock maintains 2, each Carrier up to 5 (minus its other cargo). Excess Fighters in a system are destroyed at once. Example: one Spacedock + one empty Carrier = 7 Fighters; if the Carrier leaves, 5 must go with it.</li>" +
      "<li><b>Spacedock:</b> one per planet; you may have at most <b>6</b>. Spaceships always sit in space, never on a planet; Ground Forces and PDS always sit on planets.</li>" +
      (c.has("he") ? "<li>Stasis Capsules: your Cruisers and Dreadnoughts may each carry one Ground Force.</li>" : "") +
      "<li>Units are unlimited — use the triangular <b>number counters</b> when you run out of pieces.</li></ul>",
    src: (c) => "Rules p.6–8 §7.4–7.12, p.13, p.20 · FAQ p.6" + (c.has("he") ? " · Hope's End " + (c.mod("shock") ? "p.2, p.4" : "p.4") : "")
  },
  {
    title: "Movement — fleets, carriers and interdiction",
    when: () => true,
    html: (c) => "<ul>" +
      "<li>A movement of 1 = from one system to an adjacent one. Dreadnoughts and Carriers move 1, Cruisers 2" + (c.has("he") ? " (XRD Transporter: Carriers +1; Type IV Drive: Cruisers and Dreadnoughts +1" + (c.mod("leaders") ? "; an Admiral: up to three Dreadnoughts +1" : "") + ")" : "") + ".</li>" +
      "<li>A <b>fleet</b> is one or more of your spaceships in the same system at the start of your Movement Segment.</li>" +
      "<li><b>Transport:</b> a Carrier may pick up Ground Forces or PDS at any time during its move (before, during or after). They can't leave the Carrier — not even onto another Carrier — until the Invasion Combat Segment (FAQ p.3).</li>" +
      "<li>A Carrier with more than one move may drop Fighters along the way, if the systems it drops them in can maintain them (FAQ p.3).</li>" +
      "<li><b>Interdiction:</b> a ship entering a system with another race's spaceships must <b>stop</b>; a space battle follows.</li>" +
      "<li>You can never move <b>through</b> a system holding another race's fleet — not even an ally's" + (c.has("he") ? " (Light/Wave Deflector lets you" + (c.mod("leaders") ? "; so does a Diplomat, with the opponent's permission" : "") + ")" : "") + ". You may move through systems with enemy planets and with enemy Spacedocks and their Fighters.</li>" +
      "<li><b>Out-of-turn PDS fire:</b> right after an enemy finishes his Movement Segment, each of your PDS in a system containing his ships may fire once at them (no defense). It's optional, and Light/Wave Deflector doesn't stop it (FAQ p.5).</li>" +
      (c.has("he") ? "<li>Before your Movement Segment: Spatial Jump (one fleet anywhere; each ship — Fighters too — is lost on 8–10) and Transit Diodes (move up to three Ground Forces between your planets).</li>" : "") +
      (c.mod("leaders") ? "<li><b>Leaders</b> change ship or board a ship only immediately before your Movement Segment, within one system; they land only in the Invasion Combat Segment.</li>" : "") + "</ul>",
    src: (c) => "Rules p.7–8 §7.7–7.10, p.13–14 §8.3, p.20 · FAQ " + (c.has("he") ? "p.1, " : "") + "p.3, p.5" + (c.has("he") ? " · Hope's End " + (c.mod("leaders") ? "p.2–4" : "p.4") : "")
  },
  {
    title: "Special systems",
    when: () => true,
    html: (c) => "<ul>" +
      "<li><b>Wormholes</b> (Alpha and Beta): entering one costs 1 movement; the ship then appears in the system with the other end. If only one end made it onto the board, it does nothing. Example: a Cruiser (move 2) moves into the Alpha system, then through to the other Alpha system.</li>" +
      "<li><b>Supernova:</b> impassable.</li>" +
      "<li><b>Asteroid Field:</b> impassable — unless you have <b>Antimass Deflectors</b>: then your ships may move through, but never end their move there (so only ships with movement 2+ can use it).</li>" +
      "<li>An attacker can never <b>withdraw</b> through a wormhole or into an asteroid field.</li>" +
      (c.has("he") ? "<li><b>Nebula</b> (Hope's End): any ship entering must stop at once — no technology avoids it (entering on its last step is no loss). Fighters have <b>no combat value</b> in a Nebula but can still be taken as casualties.</li>" +
        "<li><b>Gravity Rift</b> (Hope's End): each ship leaving rolls a die, one ship at a time (move it before rolling the next); Fighters are exempt. <b>7–10:</b> exit through any side. <b>1–6:</b> exit through the side printed with that number — or stay in the Rift and end its move. Leaving a Rift never uses movement.</li>" +
        "<li>Nebulas and Gravity Rifts are red-bordered: not next to another red-bordered tile when building, unless there's no other option.</li>" : "") +
      (c.mod("ds") ? "<li><b>Distant Suns:</b> a Wormhole domain counter opens a new wormhole that links to its Alpha or Beta partner(s).</li>" : "") + "</ul>",
    src: (c) => "Rules p.4, p.13–15 §8.3" + (c.mod("ds") ? ", p.20" : "") + (c.has("he") ? " · Hope's End p.1 §2.1" : "")
  },
  {
    title: "Space combat",
    when: () => true,
    html: (c) => "<ul><li>A space battle always happens in any system holding the active player's ships and another race's. The active player is the attacker; it's fought in the active player's Space Combat Segment, right after his movement.</li></ul>" +
      "<h4>Before the first round</h4><ul>" +
      "<li><b>PDS offensive fire:</b> in your Space Combat Segment each of your PDS may fire once at enemy ships in its system — or, with Deep Space Cannon, in an adjacent system (one or the other). No defense.</li>" +
      (c.has("he") ? "<li><b>Mentak Coalition:</b> fires two Cruisers before space combat — in every system where it fights, attacking or defending, and <b>before</b> Assault Cannons (FAQ p.1)." + (c.mod("leaders") ? " An Admiral aboard doesn't add a third shot, nor a second Assault Cannon shot from one Dreadnought (FAQ p.1–2)." : "") + "</li>" : "") +
      "<li><b>Assault Cannon</b> (technology) gives your Dreadnoughts a free shot before combat" + (c.has("he") ? ": each fires once and the casualties are removed at once, with no defense" : "") + ". A defending PDS fires <b>before</b> these Dreadnoughts (FAQ p.5). If both sides have Assault Cannon and Dreadnoughts, the side with more Assault-Cannon Dreadnoughts fires first with the difference (e.g. 3 vs 2: one shot first); all the others fire normally (FAQ p.2 — see the FAQ note below).</li></ul>" +
      "<h4>Each round</h4><ol>" +
      "<li>The <b>attacker</b> fires once with <b>all</b> his ships; each roll equal to or higher than the ship's combat value is a hit.</li>" +
      "<li>The <b>defender</b> fires with all his units.</li>" +
      "<li>Both remove ships equal to the hits they took — <b>owners choose their own casualties</b>; one hit destroys any ship (Fighters make good fodder).</li>" +
      "<li>The attacker may <b>withdraw</b>.</li><li>Repeat until one side is eliminated or the attacker withdraws.</li></ol>" +
      "<ul><li><b>Withdrawal:</b> the whole attacking force retreats together into an adjacent system from which at least one attacking ship moved this turn — never through a wormhole or into an asteroid field. (The defender's <b>Skilled Retreat</b> Action card, played before any round, moves one defending fleet to an adjacent friendly or empty system.)</li>" +
      "<li><b>Cargo:</b> Ground Forces and PDS aboard a Carrier can't attack or defend and are destroyed with it; its Fighters may survive until the end of the Space Combat Segment.</li>" +
      "<li>A roll that can't miss or can't hit after modifiers isn't rolled — it simply succeeds or fails (FAQ p.5). PDS may shoot Fighters (FAQ p.5).</li>" +
      "<li>Battling breaks any Trade Agreement between the two players (the Hacan's excepted).</li>" +
      (c.has("he") ? "<li>Modifiers: Hylar V Assault Laser (your Cruisers +1), Cybernetics (your Fighters +1), Magen Defense Grid (your PDS +1)" + (c.mod("leaders") ? ", an <b>Admiral</b> (one extra die for his ship; no Skilled Retreat against his fleet)" : "") + ". Fighters are useless in a <b>Nebula</b>. After winning: Strategic Mathematics.</li>" : "") +
      (c.mod("leaders") ? "<li><b>Leaders</b> on a destroyed ship: roll — 1–5 killed, 6–9 captured by the destroyer, 0 escapes to any friendly planet.</li>" : "") + "</ul>" +
      "<p class='tbl-note'><b>Example (Diagram Four):</b> Sol's Dreadnought and Carrier (2 Ground Forces, 3 Fighters) attack a Xxcha Dreadnought and two Cruisers. Sol scores 2 hits, Xxcha 3: Xxcha loses both Cruisers, Sol its three Fighters. Next round Sol's Dreadnought hits and the Xxcha Dreadnought misses — the system is Sol's, and its Ground Forces can invade.</p>",
    src: (c) => "Rules p.7 §7.7, p.8 §7.9, p.11–12 §8.2, p.14–15 §8.3 · FAQ " + (c.has("he") ? "p.1–2" : "p.2") + ", p.5" + (c.has("he") ? " · Hope's End " + (c.mod("leaders") ? "p.1–4" : "p.1, p.4") : "")
  },
  {
    title: "Invasion combat and bombardment",
    when: () => true,
    html: (c) => "<ul><li>After all your space battles, in your <b>Invasion Combat Segment</b>, you may move Ground Forces and/or PDS from a Carrier onto a friendly, neutral or enemy planet <b>in the same system</b>. One Carrier can't invade two planets in one system (FAQ p.5).</li></ul>" +
      "<h4>Sequence</h4><ol>" +
      "<li>Declare which Ground Forces land on which planet.</li>" +
      "<li><b>Bombardment:</b> each of your Dreadnoughts in the system may fire one shot at the enemy Ground Forces there — even if nobody lands; <b>never</b> at a planet with a PDS" + (c.has("he") ? " (unless you have Graviton Negator)" : "") + ". Each hit removes one Ground Force; a hit on a planet held only by a control marker removes the marker and the planet turns neutral.</li>" +
      "<li>Each defending <b>PDS on that planet</b> fires once at the invaders (PDS elsewhere in the system can't)" + (c.mod("leaders") ? " — not if an <b>Agent</b> joins the attack" : "") + ".</li>" +
      "<li><b>Ground battle</b> — like a space battle but <b>the attackers can't withdraw</b>: attacker rolls, defender rolls, both remove casualties, repeat until only one side (or no one) has Ground Forces left.</li></ol>" +
      "<ul><li><b>Both sides wiped out:</b> the defender keeps the planet (place a control marker). <b>Defenders destroyed, invaders left:</b> the invader takes control.</li>" +
      "<li>A PDS landed with the invaders can't fight and is destroyed if the invasion fails.</li>" +
      "<li><b>Neutral planet taken:</b> add its resources and influence at once. <b>Enemy planet taken:</b> all enemy PDS and Spacedocks there are destroyed" + (c.mod("shock") ? " (if any of your Shock Troops survive, you may capture them instead)" : "") + "; you add its values, the loser deducts them. <b>Friendly planet:</b> the landing Ground Forces simply join the garrison.</li>" +
      "<li><b>Control:</b> you control a planet only if you have landed at least one Ground Force there. Moving your last Ground Force off leaves your control marker. Losing all your troops to a card doesn't lose the planet unless the card says so (FAQ p.4–5).</li>" +
      (c.has("he") ? "<li>Technologies: Stasis Capsules — a Dreadnought may bombard and land Ground Forces in the same turn (FAQ p.5); X-89 Bacterial Weapon; Dacxive Animators; Graviton Negator (bombard PDS planets; Fighters invade like Ground Forces but can't take control); Magen Defense Grid (defending Ground Forces in a system with a PDS +1).</li>" : "") +
      (c.mod("leaders") ? "<li><b>Leaders</b> may land on a friendly planet, or join an invasion (a <b>General</b> re-rolls one die per round; an invading Leader is captured if the invasion fails). A <b>Diplomat</b> on the defending planet may delay the invasion a turn. Dreadnoughts bombarding a planet with an enemy <b>General</b> get −4. A planet holding a Leader that is successfully invaded: roll — 1–5 captured, 6–9 escapes to any friendly planet, 0 killed.</li>" : "") +
      (c.mod("ds") ? "<li><b>Distant Suns:</b> the first invasion of a neutral planet triggers its Domain Counter; probing and razing also happen in this segment (see Distant Suns).</li>" : "") + "</ul>",
    src: (c) => "Rules p.7–9 §7.7–7.12, p.15–16 §8.3" + (c.mod("ds") ? ", p.19 §10.2" : "") + " · FAQ p.4–5" + (c.has("he") ? " · Hope's End " + (c.mod("leaders") ? "p.2–4" : (c.mod("shock") ? "p.2, p.4" : "p.4")) : "")
  },
  {
    title: "Technology Phase",
    when: () => true,
    html: (c) => "<ul>" +
      "<li>Each player may buy <b>one</b> technology per Technology Phase, for <b>30 credits</b> (the Jol-Nar buy green, gold and blue technology for 20).</li>" +
      "<li>You must already own its <b>requirements</b>, printed on the chit's front: <b>AND</b> = both, <b>OR</b> = either. Example: Graviton Negator requires Assault Cannon OR Dacxive Animators.</li>" +
      "<li><b>Planet specialties:</b> a planet with a technology symbol by its name lets you subtract its <b>resources</b> from the cost of technology of that colour. Example: two red planets worth 6 resources together → red technology costs 24. No planet has a yellow (General) specialty. Resource modifiers such as Sarween Tools count (FAQ p.5–6).</li>" +
      "<li>Colours: <span class='t-chip t-grn'>Green · Biological</span> <span class='t-chip t-red'>Red · Weapons</span> <span class='t-chip t-blu'>Blue · Propulsion</span> <span class='t-chip t-yel'>Yellow · General</span></li>" +
      "<li>Losing a technology (e.g. to Scientist Assassination) doesn't remove the ones that required it, and you may keep buying as if you still had it (FAQ p.6).</li>" +
      (c.mod("leaders") ? "<li><b>Scientist</b> on a planet outside your home system: that planet counts double resources toward your technology purchase.</li>" : "") +
      (c.mod("ds") ? "<li><b>New Technology</b> domain counter: 5 × the planet's influence in credit toward your next technology.</li>" : "") +
      (c.has("he") ? "" : "<li>The base rulebook prints no technology list: each chit carries its own requirements and effect. (Add Hope's End above to see its comprehensive flow-chart of all 24.)</li>") + "</ul>",
    src: (c) => "Rules p.6–7 §7.5, p.16 §8.4 · FAQ p.5–6" + (c.mod("leaders") ? " · Hope's End p.3" : "") + (c.mod("ds") ? " · Rules p.20" : "")
  },
  {
    title: "Technology tree (Hope's End flow-chart)",
    when: (c) => c.has("he"),
    html: () => "<p>The Hope's End rules print a comprehensive flow-chart of all <b>24</b> technologies — the base game's 20 plus the expansion's 4 (the sheet doesn't mark which are new). No requirement (—) = you may buy it without owning any other technology.</p>" +
      T2.techTypes.map(tt => "<h4><span class='t-chip " + tt.cls + "'>" + tt.colour + "</span> " + tt.id + "</h4><div class='tbl-wrap'><table class='tbl tech'><thead><tr><th scope='col'>Technology</th><th scope='col'>Requires</th><th scope='col'>Effect</th></tr></thead><tbody>" +
        T2.tech.filter(t => t.ty === tt.id).map(t => "<tr><th scope='row'>" + t.n + "</th><td>" + (t.req ? t.req.replace(/ (AND|OR) /, " <b>$1</b> ") : "—") + "</td><td>" + t.eff + "</td></tr>").join("") +
        "</tbody></table></div>").join(""),
    src: () => "Hope's End p.4 · Rules p.7 §7.5, p.16 §8.4 · FAQ p.1"
  },
  {
    title: "Placing new units and Spacedocks",
    when: () => true,
    html: (c) => "<ul>" +
      "<li>Every new unit except a Spacedock is produced by a <b>Spacedock</b>. Each produces up to its planet's <b>Resource value</b> in units per turn (Sarween Tools' +1 counts — FAQ p.3; a new Spacedock doesn't count toward it — FAQ p.3).</li>" +
      "<li><b>Land units</b> (Ground Forces, PDS) go on the Spacedock's planet. <b>Space units</b> (Dreadnoughts, Carriers, Cruisers, Fighters) go in the space of the Spacedock's system and count toward any Spacedock there. Example: Spacedocks on a 3-resource and a 2-resource planet in one system build 5 units there.</li>" +
      "<li><b>New Spacedocks</b> need no Spacedock: place one on any friendly planet without one. It can't produce on the turn it was bought.</li>" +
      "<li>One Spacedock per planet; never more than <b>six</b> Spacedocks per player.</li>" +
      "<li><b>Blockade:</b> if an enemy unit occupies the space around your Spacedock, it can't place space units — space units you can't place are destroyed. A blockaded Spacedock still produces Ground Forces and PDS.</li>" +
      "<li><b>Space Dock Accident</b>: the units it removes don't count toward that Spacedock's limit (FAQ p.3). <b>Holy Planet of Ixth</b>: the planet keeps its values and existing Spacedocks, but no new units may come into play on it (FAQ p.6).</li>" +
      (c.has("he") ? "<li>Gen Synthesis: in this phase, buy and place one Ground Force on each of your planets without a Spacedock.</li>" : "") + "</ul>",
    src: (c) => "Rules p.7 §7.6, p.16–17 §8.5 · FAQ p.3, p.6" + (c.has("he") ? " · Hope's End p.4" : "")
  },
  {
    title: "Planets, influence, insurgence and debt",
    when: () => true,
    html: (c) => "<div class='figs'>" + T2.fig("planet", "Planet key: technology specialty, resource value 4, name Torkan, influence value 2", "Each planet: technology specialty (if any), resource value, name, influence value.") + "</div>" +
      "<ul><li><b>Resources</b> = credits each Economy Phase and each Spacedock's production. <b>Influence</b> = " + (c.p === 2 ? "turn order (no council meets with two players)" : "votes and turn order") + ".</li>" +
      "<li><b>Control markers</b> go on planets you control that hold none of your Ground Forces.</li></ul>" +
      "<h4>Insurgence checks</h4><ul>" +
      "<li>When a card" + (c.mod("ds") ? " or a Distant Suns razing roll" : "") + " calls for one: roll the die, <b>+1 for each of your Cruisers and Dreadnoughts</b> in that system.</li>" +
      "<li>Equal to or above the planet's <b>influence</b>: the populace calms down. Lower: <b>remove two Ground Forces</b> from the planet; if its last Ground Force goes, you lose the planet and it turns neutral.</li>" +
      "<li>Home-system planets can be checked too, unless the card says otherwise (FAQ p.5). An automatic result isn't rolled (FAQ p.5).</li></ul>" +
      "<h4>Out of money</h4><ul>" +
      "<li>Forced to pay more than you have (by a card or an event)? Sell assets — remove them from the game for their sales value — until you can pay:</li></ul>" +
      "<div class='tbl-wrap'><table class='tbl compact'><thead><tr><th scope='col'>Asset</th><th scope='col'>Sells for</th></tr></thead><tbody>" +
      T2.sales.map(s => "<tr><th scope='row'>" + s[0] + "</th><td>" + s[1] + (s[1] === 1 ? " credit" : " credits") + "</td></tr>").join("") + "</tbody></table></div>" +
      "<ul><li>Never sell voluntarily, and never more than the debt needs. If everything is sold and the debt remains, you are <b>eliminated</b>.</li>" +
      "<li>Selling a Dreadnought to pay Unconventional Weapons means you don't pay for that Dreadnought (FAQ p.4); you may sell to pay Colonization Licensing only if you can't pay otherwise (FAQ p.4).</li></ul>",
    src: (c) => "Rules p.5, p.6 §7.1, p.7 §7.6, p.8 §7.8, p.9 §8.1, p.11 §8.2, p.13 §8.3, p.18 §10.0" + (c.mod("ds") ? ", p.19 §10.2" : "") + " · FAQ p.4–5"
  },
  {
    title: "The races",
    when: () => true,
    html: (c) => "<p>Each race's income, abilities, technologies and extra units are printed on its Race Stand, which isn't part of these rules. What the rules and FAQ themselves say:</p><ul>" +
      "<li><b>The Sardakk N'orr</b> — the rulebook's example: they begin with 35 credits, two technology chits and 5 extra combat units.</li>" +
      "<li><b>The Universities of Jol-Nar</b> — buy green, gold and blue technology for 20 credits instead of 30.</li>" +
      "<li><b>The Xxcha Kingdom</b> — their racial ability gets rid of a political agenda before the vote; it works on an agenda chosen with Determine Policy, and they may discard a current Law being revoted by paying 5 credits (FAQ p.2, p.4).</li>" +
      "<li><b>The Emirates of Hacan</b> — their Trade Agreements are not broken when they fight a trading partner.</li>" +
      "<li><b>The Federation of Sol</b> and <b>The Barony of Letnev</b> — no rules beyond their race stands.</li>" +
      (c.has("he") ? "<li><b>The Mentak Coalition</b> (Hope's End) — two Cruisers fire before space combat: in every battle, attacking or defending, and before Assault Cannons" + (c.mod("leaders") ? "; no extra shot from an Admiral" : "") + " (FAQ p.1–2).</li>" +
        "<li><b>The Yssaril Tribes</b> (Hope's End) — no rules beyond their race stand.</li>" : "") + "</ul>",
    src: (c) => "Rules p.5 §6.1, p.12 §8.2, p.16 §8.4 · FAQ " + (c.has("he") ? "p.1–2" : "p.2") + ", p.4" + (c.has("he") ? " · Hope's End p.1" : "")
  },
  {
    title: "Distant Suns — domain counters, probing and razing",
    when: (c) => c.mod("ds"),
    html: (c) => "<ul><li>A Domain Counter takes effect <b>immediately on the first invasion</b> of its neutral planet. Its symbol matches one of these:</li></ul>" +
      "<div class='tbl-wrap'><table class='tbl'><thead><tr><th scope='col'>Counter</th><th scope='col'>Effect</th></tr></thead><tbody>" +
      T2.domains.map(d => "<tr><th scope='row'>" + d.n + "</th><td>" + d.eff + "</td></tr>").join("") + "</tbody></table></div>" +
      "<ul><li>A planet gained <b>without invading</b> (e.g. by Manifest Destiny) ignores its counter — remove it from the game. A planet that turns neutral again gets no new counter.</li>" +
      (c.mod("leaders") ? "<li>If your Ground Forces are wiped out by radiation or a biohazard, a Leader who landed with them escapes back to the ship (FAQ p.2).</li>" : "") + "</ul>" +
      "<h4>Probing (Invasion Combat Segment)</h4><ul>" +
      "<li>With a <b>Carrier and at least one Fighter</b> in the system, secretly look at a neutral planet's counter, then put it back face down. One Fighter per planet probed (two planets in one system need two).</li>" +
      "<li>You can't invade the probed planet this segment (others still may), and you can't look again unless you invade or probe again.</li>" +
      "<li><b>Lazax Survivors</b> probed: remove the counter from the game; you <b>may</b> immediately draw 3 Action cards and place a free Ground Force on the planet.</li></ul>" +
      "<h4>Razing (Invasion Combat Segment)</h4><ul>" +
      "<li>With a <b>Dreadnought</b> in the system, raze a neutral planet that has a counter: the counter is removed from play, and no one may invade that planet this round.</li>" +
      "<li>Then roll for the galaxy's reaction: <b>1–7</b> no effect · <b>8–9</b> lose 3 random Action cards · <b>0</b> lose 3 random Action cards and make an insurgence check on all your planets outside your home system.</li>" +
      "<li>Razing <b>Lazax Survivors</b>: discard all your Action cards, make an insurgence check on <b>all</b> your planets, and you may not vote in the next Political Phase.</li></ul>",
    src: (c) => "Rules p.18–20 §10.2" + (c.mod("leaders") ? " · FAQ p.2" : "")
  },
  {
    title: "Manifest Destiny",
    when: (c) => c.mod("md"),
    html: (c) => "<ul><li>When: after the galaxy is set up, before the game begins.</li>" +
      "<li>Buy control of <b>neutral planets adjacent to your home system</b> with your starting credits: <b>(Resources + Influence) × 2</b> each, then place one free Ground Force there.</li>" +
      "<li>Example: next to the N'orr are Mellon (1 resource, 4 influence — 10 credits) and Sakulag (4 and 2 — 12 credits); the N'orr buy Sakulag for 12.</li>" +
      (c.mod("ds") ? "<li>Distant Suns: planets bought this way were never invaded, so their Domain Counters are removed unseen.</li>" : "") + "</ul>",
    src: (c) => "Rules p.18 §10.1" + (c.mod("ds") ? " · Rules p.19 §10.2" : "")
  },
  {
    title: "Hope's End — cards, deeds and new tiles",
    when: (c) => c.has("he"),
    html: (c) => "<ul>" +
      "<li><b>Cards:</b> 28 Political and 28 Action cards join the decks. Cards needing an optional rule (e.g. Distant Suns, Leaders) carry its keyword in the lower left-hand corner so you can remove them when that rule isn't in use.</li>" +
      "<li><b>Event cards</b> (among the new Political cards): read aloud and resolve at once, then draw another Political card; they can't be Vetoed or affected like agendas.</li>" +
      "<li><b>Deed cards:</b> take a planet's Deed when you invade it — from the neutral pile or from its previous owner.</li>" +
      "<li><b>New races:</b> the Mentak Coalition and the Yssaril Tribes play like any other race.</li>" +
      "<li><b>New hexes:</b> 13, including the two new home systems; with them you have 8 home systems, Mecatol Rex and 43 regular tiles. New system types: the Nebula and the Gravity Rift (see Special systems).</li>" +
      "<li><b>Larger galaxies:</b> the sheet's examples — “Vortex”, “Snowflake” and “Gauntlet” — use 42 tiles (discard one at random), recommended only for 6 players; experimenting with other constellations is encouraged." + (c.big ? " Tonight: “" + T2.galaxyName(c) + "”." : "") + "</li>" +
      "<li><b>Four new technologies</b>, shown with the rest in the Technology tree.</li></ul>",
    src: () => "Hope's End p.1–4 §1.1–2.4"
  },
  {
    title: "Shock Troops",
    when: (c) => c.mod("shock"),
    html: () => "<ul>" +
      "<li><b>Promotion:</b> when a normal Ground Force rolls an <b>unmodified 10</b> (a hit) in Invasion Combat, roll again: on <b>9 or 10</b> it becomes a Shock Troop (slide a counter over its flag).</li>" +
      "<li>Shock Troops <b>are Ground Forces</b>: they control planets, need Carriers, and every card reference to Ground Forces applies to them.</li>" +
      "<li>Combat value <b>5</b>.</li>" +
      "<li>They must be taken as the <b>first casualties</b> in combat — except against the defending PDS fire before the invasion battle.</li>" +
      "<li><b>Capture:</b> if any Shock Troops survive a successful invasion, you <b>may</b> capture the enemy Spacedocks and PDS on the planet — replace them with your own at once, free (normally they'd be destroyed). You may place new units at a captured Spacedock that same turn (FAQ p.2).</li>" +
      "<li>At most <b>8</b> Shock Troops on the board; while all 8 are in play, no more can be made.</li></ul>",
    src: () => "Hope's End p.2 §2.2 · FAQ p.2"
  },
  {
    title: "Leaders",
    when: (c) => c.mod("leaders"),
    html: (c) => "<ul>" +
      "<li>Three per race, starting together on one home-system planet" + (c.mod("facedown") ? " — <b>face down</b>, revealed (temporarily) only when used" : "") + ". They stand on a friendly planet or ride any ship (without using capacity), never on a neutral or enemy planet, and never control a planet alone.</li>" +
      "<li><b>Moving:</b> immediately before your Movement Segment, a Leader may board a ship from a planet or change ships within one system. In the Invasion Combat Segment it may land on a friendly planet in the system or join an invasion (captured if the invasion fails).</li>" +
      "<li><b>Ship destroyed in space combat:</b> roll — 1–5 killed · 6–9 captured by the destroyer · 0 escapes to any friendly planet. Destroyed any other way: killed.</li>" +
      "<li><b>Planet successfully invaded:</b> roll — 1–5 captured · 6–9 escapes to any friendly planet · 0 killed. Planet lost by bombardment or any other way: the Leader escapes to another friendly planet.</li>" +
      "<li><b>Captives:</b> kept by the captor, who may execute them at any time or hand them to any player in the Political Phase (to their owner: freed). Each time you successfully invade a planet of a player holding captives, roll: on <b>0</b> you find one (at random) — yours is freed, anyone else's becomes your captive.</li></ul>" +
      "<div class='tbl-wrap'><table class='tbl'><thead><tr><th scope='col'>Leader</th><th scope='col'>Abilities</th></tr></thead><tbody>" +
      T2.leaders.map(l => "<tr><th scope='row'>" + l.n + "</th><td><ul>" + l.fx.map(f => "<li>" + f + "</li>").join("") + "</ul></td></tr>").join("") + "</tbody></table></div>" +
      "<ul><li>With the Mentak, an Admiral doesn't give their Cruisers or an Assault-Cannon Dreadnought an extra pre-combat shot (FAQ p.1–2).</li></ul>",
    src: () => "Hope's End p.2–3 §2.3 · FAQ p.1–2"
  },
  {
    title: "Key rulings — the official FAQ",
    when: () => true,
    html: (c) => "<p>The FAQ overrides the rulebook. Its batches are printed newest first (7/22/02, the Hope's End questions, 2/27/02, then two older undated batches); where two answers disagree, the newest is applied.</p>" +
      "<h4>Precedence note</h4><ul>" + T2.faqConflicts.map(x => "<li>" + x + "</li>").join("") + "</ul>" +
      "<h4>Errata</h4><ul><li><b>PDS hit on 7</b> — the value is missing from the rulebook's back cover (FAQ p.6).</li><li>The two <b>“Long Term Truce”</b> cards are not Laws (FAQ p.6).</li></ul>" +
      "<h4>Combat and movement</h4><ul>" +
      "<li>PDS may shoot Fighters; out-of-turn PDS fire is optional; a PDS fires before Assault-Cannon Dreadnoughts (FAQ p.5).</li>" +
      "<li>A Carrier can't take Ground Forces or PDS from another Carrier; it may drop Fighters en route where they're maintained (FAQ p.3).</li>" +
      "<li>One Carrier can't invade two planets in one system (FAQ p.5).</li>" +
      "<li>Impossible or certain rolls aren't made — they automatically fail or succeed (FAQ p.5).</li>" +
      "<li>Losing all your troops to a card doesn't cost you the planet unless the card says so (FAQ p.4–5).</li></ul>" +
      "<h4>Economy and technology</h4><ul>" +
      "<li>Sarween Tools raises Spacedock production, progression totals and specialty discounts; a Spacedock itself doesn't count toward production (FAQ p.3, p.5–6).</li>" +
      "<li>Stasis Capsules: a Dreadnought may bombard and land Ground Forces in the same turn (FAQ p.5). Light/Wave Deflector doesn't stop PDS fire (FAQ p.5). Spatial Jump: Fighters roll too (FAQ p.1).</li>" +
      "<li>A lost prerequisite doesn't remove dependent technologies (FAQ p.6).</li></ul>" +
      (c.has("he") ? "<h4>Hope's End</h4><ul><li>Mentak pre-combat shots: every battle, also when defending, before Assault Cannons" + (c.mod("leaders") ? "; no extra shots with an Admiral" : "") + " (FAQ p.1–2).</li>" +
        (c.mod("leaders") ? "<li>A Diplomat stops invading Ground Forces, not bombardment (FAQ p.2).</li><li>A Scientist's cheap Spacedock or PDS is placed on the planet where it was bought (FAQ p.2).</li><li>A Leader whose troops die to radiation or a biohazard escapes back to the ship (FAQ p.2).</li>" : "") +
        (c.mod("shock") ? "<li>A Spacedock captured by Shock Troops can place new units that turn (FAQ p.2).</li>" : "") + "</ul>" : ""),
    src: (c) => "FAQ p.1–6"
  }
];

/* =============================================================================
   TEACHING SCRIPT
   ============================================================================= */
T2.teach = {
  intro: "A ~5-minute teach for the exact players, galaxy and options selected above. Read it aloud, or hit Copy and tweak. Rules content comes from the rulebook, the FAQ and Hope's End, as cited in the setup steps and reference.",
  sections: [
    {
      h: "The hook — and how you win",
      body: (c) => "<p>No Lazax has been seen in the galaxy for more than three thousand years, and the imperial throne on Mecatol Rex stands empty. Tonight each of us leads one of the great races" +
        (c.has("he") ? " — including, with Hope's End, the Mentak Coalition and the Yssaril Tribes —" : "") + " and one of us is going to take that throne.</p>" +
        "<p>You win by climbing the <b>Galactic Progression Chart</b> from Warlord to <b>Imperium Rex</b> — one step per round at most, and you never slide back. The last step needs an empire with at least <b>nine planets</b> outside your home system, <b>nine technologies</b>, <b>thirty resources</b> and <b>thirty influence</b>, all at once. There's a shortcut: with " + T2.word(c.p) + " of us, whoever controls every planet in " + T2.milWin(c).replace(/<\/?b>/g, "") + " wins on the spot.</p>"
    },
    {
      h: "The shape of a round",
      body: (c) => (c.p === 2
          ? "<p>A round normally has six phases, but with just two of us the Galactic Council is dissolved, so there's no Political Phase. We start each round with the <b>Economy</b>: everyone draws"
          : "<p>Each round has six phases. First the <b>Political Phase</b>: we draw an agenda for the Galactic Council and vote. Your votes are your influence; whoever has the least influence votes first, and you cast all your votes or abstain. This is also when you can trade Action cards, and the only time credits may pass between players — so bribes and deals happen here, and promises aren't binding. Then the <b>Economy</b>: everyone draws") +
        " an Action card, takes credits equal to their resources plus any trade income, and buys units. Then <b>Individual Turns</b>, highest influence first: you move, fight space battles, then invade planets. Then each of us may buy <b>one technology</b>, we <b>place the units</b> we bought at our Spacedocks, and finally we check the <b>Progression Chart</b>.</p>"
    },
    {
      h: "What you'll do, and why",
      body: (c) => "<p>Planets are everything. Each shows two numbers: <b>resources</b> pay your credits every round and set how many units a Spacedock there can build; <b>influence</b> is " + (c.p === 2 ? "your place in the turn order" : "your votes and your place in the turn order") + ". To take a planet you land Ground Forces from a <b>Carrier</b> — a Carrier holds five units in any mix of Ground Forces, Fighters and PDS — so no Carriers, no empire.</p>" +
        "<p><b>Cruisers</b> are fast and cheap, perfect for blockading an enemy Spacedock so it can't launch ships. <b>Dreadnoughts</b> hit hardest and bombard planets before you land. <b>Fighters</b> ride in Carriers and soak up hits. A <b>PDS</b> guards its planet: it shoots at enemy fleets that stop in your system, fires at invaders, and stops bombardment. <b>Technology</b> costs thirty credits, one per round, and each chit lists what you need first; a planet with a technology symbol knocks its resources off the price of that colour. Remember the chart wants planets, technology, resources and influence — every credit on warships is a credit not spent climbing.</p>"
    },
    {
      h: "The central mechanic — the ten-sided die",
      body: () => "<p>All combat uses one ten-sided die per unit. Roll the unit's combat value or higher and you score a hit: <b>Dreadnoughts hit on 4</b>, Cruisers and Ground Forces on 8, Carriers and Fighters on 9, and a PDS on 7. In a space battle the attacker fires everything, then the defender, then both of us remove casualties of our own choosing — that's what Fighters are for — and the attacker may then withdraw or fight another round. Invasions work the same way on the ground, except invaders can't retreat. If both armies die, the defender keeps the planet.</p>"
    },
    { when: (c) => !c.big,
      h: (c) => "Tonight's galaxy — " + T2.word(c.p) + " players",
      body: (c) => {
        const k = T2.deal[c.p];
        return "<p>We build the galaxy ourselves: " + (k.remove ? T2.word(k.remove) + " system tile" + (k.remove > 1 ? "s go" : " goes") + " back in the box unseen and we're dealt the rest — " + k.each : "all thirty-two system tiles are dealt out — " + k.each) +
          ". Lowest roll places first, ring by ring out from Mecatol Rex, in snake order; red-bordered hazards can't touch each other, and after a tile with no planet you must play one with a planet. Put rich systems near your home and hazards between you and your neighbours." +
          (c.p === 5 ? " With five the board is lopsided, so the two A seats start with 15 extra credits and the B seat with 20 — and whoever is dealt the seventh tile must pay 5 credits or pass it on before looking." : "") + "</p>";
      } },
    { when: (c) => c.big,
      h: (c) => "Tonight's galaxy — the “" + T2.galaxyName(c) + "”",
      body: (c) => "<p>We're building Hope's End's “" + T2.galaxyName(c) + "” constellation: forty-two system tiles — one of the forty-three discarded at random — dealt seven each, then placed in snake order out from Mecatol Rex until the galaxy matches the picture. The sheet only shows the finished map, so the dealing and placing are the base game's rules, borrowed: red-bordered hazards can't touch each other, and after a tile with no planet you must play one with a planet.</p>" },
    { when: (c) => c.mod("bid"),
      h: "Race bidding",
      body: () => "<p>Races tonight are auctioned: instead of drawing home systems at random, we bid our starting income for the race we want. The rulebook doesn't say how the auction runs, so let's agree that before we start.</p>" },
    { when: (c) => c.mod("md"),
      h: "Manifest Destiny",
      body: (c) => "<p>Before the first round you may spend starting credits buying <b>neutral planets next to your home system</b>: resources plus influence, times two, and each comes with a free Ground Force." + (c.mod("ds") ? " Bought planets skip their hidden domain counter." : "") + "</p>" },
    { when: (c) => c.mod("ds"),
      h: "Distant Suns",
      body: () => "<p>Every neutral planet hides a face-down <b>domain counter</b> that goes off when someone first invades it: wealth, settlers, new technology, an industrial society, a new wormhole — or radiation, a biohazard, hostile locals, even Lazax survivors that nobody believes in. A Carrier with a Fighter can <b>probe</b> to peek first; a Dreadnought can <b>raze</b> a planet to wipe its counter, but then the dice decide how badly the galaxy takes it.</p>" },
    { when: (c) => c.has("he"),
      h: "Hope's End",
      body: (c) => "<p>Hope's End adds two races — the Mentak Coalition and the Yssaril Tribes — and new hazard tiles" +
        (c.big ? ", which are in tonight's galaxy" : ", which come into play on its larger galaxies (tonight's standard map uses the base game's tiles)") +
        ": a <b>Nebula</b> stops any ship that enters and leaves Fighters unable to hit in battle, and a <b>Gravity Rift</b> makes each departing ship roll — 7 or better and it leaves by any side, otherwise it must leave by the side matching the roll or stay put. " +
        (c.p === 2 ? "Some new Political cards are <b>Events</b>, but with no council between the two of us they never come up. "
          : "Some new Political cards are <b>Events</b> that resolve at once before the real agenda. ") +
        "Take a planet's <b>Deed card</b> when you invade it — it keeps your totals honest. And there are four new technologies; the full tree is in the reference.</p>" },
    { when: (c) => c.mod("shock"),
      h: "Shock Troops",
      body: () => "<p>When one of your Ground Forces rolls a natural 10 in invasion combat, roll again: on 9 or 10 it becomes a <b>Shock Troop</b>. They hit on 5 and must be taken as your first casualties — except against the defending PDS shots before the ground battle. If any survive a successful invasion, you can <b>capture</b> the enemy's Spacedocks and PDS there instead of destroying them. Only eight can exist at a time.</p>" },
    { when: (c) => c.mod("leaders"),
      h: (c) => c.mod("facedown") ? "Leaders — face down" : "Leaders",
      body: (c) => "<p>Each race has three <b>Leaders</b>, drawn from five types: Generals re-roll a die in ground battles, Admirals add a die in space and speed up Dreadnoughts, Diplomats delay invasions, Agents silence PDS, and Scientists make technology and defences cheaper. They ride any ship; when their ship dies or their planet falls they may be killed, captured or escape — and captives can be traded or rescued." +
        (c.mod("facedown") ? " We play them <b>face down</b>: you reveal a Leader only when it uses its skill." : "") + "</p>" },
    {
      h: "Don't worry about these until they come up",
      body: (c) => {
        const items = [];
        items.push("<li><b>" + (c.p === 2 ? "Individual Action cards" : "Individual agendas and Action cards") + "</b> — each says when and how it works; I'll referee the first few.</li>");
        items.push("<li><b>Trade Agreements</b> — played from Action cards; they pay you per planet your partner owns and break if you fight each other.</li>");
        items.push("<li><b>Insurgence checks</b> — only when a card" + (c.mod("ds") ? " or a razing roll" : "") + " calls for one: a die plus your warships against the planet's influence.</li>");
        items.push("<li><b>Running out of money</b> — you sell units at fixed prices, only enough to cover the debt.</li>");
        items.push("<li><b>Wormholes, asteroid fields and supernovas</b> — the exact movement rules are in the reference.</li>");
        items.push("<li><b>Ties</b> — turn order goes to most resources, then technologies, then credits.</li>");
        if (c.mod("leaders")) items.push("<li><b>Leader capture and rescue rolls</b> — look them up when a Leader's ship or planet is lost.</li>");
        if (c.mod("ds")) items.push("<li><b>Each domain counter's exact effect</b> and the razing table — in the reference when one flips.</li>");
        if (c.big) items.push("<li><b>Gravity Rift exits</b> — roll per ship as it leaves.</li>");
        return "<ul>" + items.join("") + "</ul>";
      }
    }
  ]
};
