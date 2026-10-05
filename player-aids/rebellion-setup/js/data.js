/* =============================================================================
   Star Wars: Rebellion — Setup & Reference Utility · data
   Sources (citation labels):
     LtP  = Learn to Play (2016)                      printed pages 02–20
     RR   = Rules Reference (2016)                    printed pages 02–16 ("the reference for all rules queries")
     RotE = Rise of the Empire rulesheet (2017)       printed sides 01–02
     FAQ  = FAQ & errata v2.1 (May 2019)              printed pages 01–08 (Rise of the Empire from p.06)
   Precedence: FAQ > RotE > RR > LtP. FAQ errata are applied throughout and flagged where they change a book.
   Context c = { has(set), mode: "first" | "std", p: 2|3|4, team, first, mod(id) }
   ============================================================================= */
var SWR = {};

SWR.expMeta = {
  base:  { name: "Base game",          cls: "tag-base" },
  rote:  { name: "Rise of the Empire", cls: "tag-rote" },
  first: { name: "First game",         cls: "tag-first" },
  team:  { name: "Team game",          cls: "tag-team" },
  faq:   { name: "FAQ errata",         cls: "tag-faq" }
};

SWR.expansions = [
  { id: "base", short: "Star Wars: Rebellion", year: "2016",
    blurb: "The base game: the Galactic Empire against the Rebel Alliance, for 2 players or teams of up to 4. Always in play." },
  { id: "rote", short: "Rise of the Empire", year: "2017",
    blurb: "Rogue One heroes and villains, new units, green dice, target markers and Cinematic Combat with advanced tactic cards. Its setup changes are written against the Rules Reference's full setup (RotE p.1), so this page pairs it with the full game and keeps the Learn to Play first-game setup base game only." }
];

SWR.modes = [
  { id: "first", name: "First game",
    blurb: "Learn to Play setup: fixed starting positions, and action cards are only used to recruit leaders. Base game only (Rise of the Empire's setup changes are written for the full game, RotE p.1)." },
  { id: "std", name: "Full game",
    blurb: "Rules Reference setup (the Learn to Play's advanced rules): random starting loyalty, place your own units, two secret starting action cards each." }
];

SWR.players = [
  { n: 2, label: "1 v 1" },
  { n: 3, label: "1 Rebel v 2 Imperials" },
  { n: 4, label: "2 v 2" }
];

SWR.modules = [
  { id: "roteunits", requires: "rote", name: "Rise of the Empire starting units",
    summary: "The Death Star is still under construction in a remote system; new units join both sides' starting forces",
    description: "After placing starting loyalty, players agree whether to use the base game's starting units or these. They replace parts II and III of the Rules Reference's setup step 8 (the Imperial and Rebel starting units).",
    src: "RotE p.1" },
  { id: "rotefirst", requires: "rote", name: "First game with the expansion",
    summary: "Both mission decks use only the cards with a Darth Vader icon or a leader icon",
    description: "For your first game using Rise of the Empire. Off: each player chooses the base or the Rise of the Empire mission set (Choosing Mission Sets).",
    src: "RotE p.1–2" }
];

/* ---- small helpers ---------------------------------------------------------- */
SWR.cite = function () { return Array.prototype.slice.call(arguments).filter(Boolean).join(" · "); };
SWR.ul = function (items) { return "<ul>" + items.filter(Boolean).map(function (i) { return "<li>" + i + "</li>"; }).join("") + "</ul>"; };

/* =============================================================================
   SETUP PHASES
   ============================================================================= */
(function () {
  var J = SWR.cite, ul = SWR.ul;

  SWR.phases = [
    {
      title: "Before you start",
      steps: [
        { when: function (c) { return c.first; }, exp: "first",
          t: "Unpack the game",
          d: function () {
            return ul([
              "Punch out all of the cardboard components.",
              "Attach each <b>leader</b> to a plastic stand.",
              "Assemble each <b>Death Star</b> and <b>Star Destroyer</b> miniature, as shown in the assembly diagram on LtP p.2."
            ]);
          },
          src: function () { return J("LtP p.2", "LtP p.4"); } },
        { when: function (c) { return c.has("rote"); }, exp: "rote",
          t: "Add Rise of the Empire",
          d: function () {
            return ul([
              "Shuffle the expansion's <b>action cards</b> and <b>mission cards</b> into their respective decks.",
              "Mix the expansion's tokens, dice, figures and leaders into the supply of unused components.",
              "Remove these base-game cards and use the expansion's replacements instead (same name, Rise of the Empire icon):" +
                ul(["<b>Sabotage</b> (Rebel mission)", "<b>Son of Skywalker</b> (Rebel action)", "<b>Good Intel</b> (Imperial action)",
                    "<b>Construct Super Star Destroyer</b> (both copies of this Imperial mission)"]),
              "All cards in the expansion are marked with the Rise of the Empire icon."
            ]);
          },
          src: function () { return "RotE p.1"; } }
      ]
    },
    {
      title: "Factions & leaders",
      steps: [
        { when: function () { return true; }, exp: function (c) { return c.team ? "team" : (c.has("rote") ? "rote" : "base"); },
          t: "Choose factions and gather components",
          d: function (c) {
            var a = [];
            if (c.p === 2) a.push("Decide who plays the <b>Galactic Empire</b> and who plays the <b>Rebel Alliance</b>. If you can't decide, choose randomly, e.g. flip a coin.");
            if (c.p === 3) a.push("<b>3 players:</b> one player controls the <b>Rebels</b>; the other two split the <b>Imperials</b>, one as <b>Admiral</b> and one as <b>General</b>.");
            if (c.p === 4) a.push("<b>4 players:</b> two per faction. On each team one player is the <b>Admiral</b> and the other the <b>General</b>.");
            if (c.team) a.push("Use the <b>Team Game</b> side of each faction sheet." + (c.p === 3 ? " The single Rebel player also uses the Team Game side and controls <b>both</b> the Admiral and General roles." : ""));
            a.push((c.team ? "Each team takes its" : "Each player takes his") + " faction's plastic <b>miniatures</b>, <b>leaders</b>, <b>loyalty markers</b>, <b>faction sheet</b>, <b>mission cards</b> and <b>action cards</b>.");
            if (c.has("rote")) a.push("<b>Rise of the Empire:</b> place your <b>unit reference sheet</b> below your faction sheet. The units on it can be built under the normal rules.");
            return ul(a);
          },
          src: function (c) { return J("RR p.15", "LtP p.4", c.team && "LtP p.19", c.has("rote") && "RotE p.1"); } },
        { when: function () { return true; }, exp: function (c) { return c.team ? "team" : "base"; },
          t: "Place starting leaders",
          d: function (c) {
            var a = [];
            a.push((c.team ? "Each faction takes its" : "Each player takes his") + " <b>four leaders without a recruit icon</b> and places them in the <b>Leader Pool</b> on the faction sheet.");
            if (c.team) a.push("<b>Team game:</b> each faction sheet has two leader pools. The <b>Admiral</b> takes the two <b>blue</b> starting leaders and the <b>General</b> the two <b>orange</b> ones, each into his own pool." +
              (c.p === 3 ? " The single Rebel player fills both Rebel pools." : ""));
            a.push("Place all leaders <b>with</b> a recruit icon near the game board. They can't join a leader pool until they are recruited later in the game.");
            if (c.has("rote")) a.push("<b>Rise of the Empire:</b> the expansion's 8 leaders are in the supply with the others. <b>Leader pool limit:</b> " +
              (c.team ? "each team may keep at most <b>8 leaders</b> across its pools; if it ever has more, it chooses 8 and eliminates the rest, taking the excess from the pool of the teammate who has more."
                      : "if a player ever has more than <b>8 leaders</b> in his leader pool, he chooses 8 and eliminates the rest."));
            return ul(a);
          },
          src: function (c) { return J("RR p.15", "LtP p.4", c.team && "LtP p.19 · RR p.8", c.has("rote") && "RotE p.1"); } }
      ]
    },
    {
      title: "Board, decks & dice",
      steps: [
        { when: function () { return true; }, exp: "base",
          t: "Game board and time track",
          d: function () {
            return ul([
              "Place both halves of the game board next to each other in the middle of the table.",
              "Put the <b>time marker</b> on space <b>1</b> of the time track.",
              "Put the <b>reputation marker</b> on space <b>14</b> of the time track."
            ]);
          },
          src: function () { return J("RR p.15", "LtP p.4"); } },
        { when: function () { return true; }, exp: function (c) { return c.has("rote") ? "rote" : "base"; },
          t: "Objective deck",
          d: function (c) {
            var a = [];
            if (c.has("rote")) {
              a.push("Sort the objective cards into three piles by the number on the card back: <b>I</b>, <b>II</b> and <b>III</b>.");
              a.push("<b>Stage III:</b> 1 <b>Death Star Plans</b> card + 4 random stage III cards. Shuffle.");
              a.push("<b>Stage II:</b> 1 <b>Death Star Plans</b> card + 4 random stage II cards. Shuffle and place on top of the stage III deck.");
              a.push("<b>Stage I:</b> shuffle the pile and deal 5 random cards onto the top of the stage II deck.");
              a.push("Return all unused objective cards to the box <b>without revealing them</b>.");
            } else {
              a.push("Sort the objective cards into three piles by the number on the card back: <b>I</b>, <b>II</b> and <b>III</b>. Shuffle each pile.");
              a.push("Place pile <b>III</b> on the <b>Objectives</b> space of the board, then pile <b>II</b> on top, then pile <b>I</b> on top.");
            }
            a.push("The Rebel " + (c.team ? "<b>General</b>" : "player") + " draws <b>one objective card</b> and keeps it secret" + (c.has("rote") ? " (the FAQ errata keeps this draw with the expansion's objective setup)" : "") + ".");
            if (c.has("rote")) a.push("If it is an <b>Immediate</b> objective, reveal and resolve it at once (see Rise of the Empire in the reference).");
            return ul(a);
          },
          src: function (c) { return J("RR p.15", "LtP p.4", c.has("rote") && "RotE p.1 · FAQ p.6"); } },
        { when: function () { return true; }, exp: function (c) { return c.first ? "first" : "base"; },
          t: "Action decks",
          d: function (c) {
            var a = ["Each player takes all of his action cards <b>with a recruit icon</b>, shuffles them and places this <b>action deck</b> facedown next to the faction sheet, on the side labelled <b>Action Deck</b>."];
            if (c.first) a.push("<b>First game:</b> the action cards <b>without</b> a recruit icon (starting action cards) aren't used. Return them to the box.");
            else a.push("The action cards <b>without</b> a recruit icon are the <b>starting action cards</b>; keep them apart for the <b>Starting action cards</b> step below.");
            if (c.has("rote")) a.push("<b>Rise of the Empire:</b> sort the expansion's action cards (with the replacement <i>Son of Skywalker</i> and <i>Good Intel</i>) together with the base cards: those with a recruit icon go into the action deck.");
            return ul(a);
          },
          src: function (c) { return J("RR p.15", "LtP p.4", c.has("rote") && "RotE p.1"); } },
        { when: function () { return true; }, exp: function (c) { return c.has("rote") ? "rote" : "base"; },
          t: function (c) { return c.has("rote") ? "Advanced tactic decks, markers and dice" : "Tactic decks, markers and dice"; },
          d: function (c) {
            var a = [];
            if (c.has("rote")) {
              a.push("<b>Remove all of the original tactic cards</b> from the game.");
              a.push("Each faction takes its own <b>advanced tactic cards</b> as a <b>ground</b> deck and a <b>space</b> deck (16 per faction). These decks are <b>never shuffled</b>; they are used with the <b>Cinematic Combat</b> rules.");
              a.push("Place all remaining markers and dice nearby, including the 3 <b>green dice</b> and the <b>target markers</b>.");
            } else {
              a.push("Shuffle the <b>space</b> and <b>ground</b> tactic decks separately and place them within easy reach of all players.");
              a.push("Place all remaining markers and the dice nearby.");
            }
            return ul(a);
          },
          src: function (c) { return J("RR p.15", "LtP p.5", c.has("rote") && "RotE p.1–2"); } },
        { when: function () { return true; }, exp: function (c) { return c.has("rote") ? "rote" : "base"; },
          t: "Mission cards",
          d: function (c) {
            var a = [];
            a.push("<b>Starting missions</b> (an arrow at the bottom of the card): each player sets his <b>four</b> aside.");
            a.push("<b>Projects</b> (a white star in a blue circle, bottom-right): the Imperial player shuffles them into the <b>project deck</b>, facedown on the <b>Projects</b> space of the board." + (c.has("rote") ? " The Rise of the Empire project cards are shuffled in too." : ""));
            if (c.has("rote") && c.mod("rotefirst")) {
              a.push("<b>First game with the expansion:</b> build each mission deck using <b>only</b> the mission cards that have a <b>Darth Vader icon</b> or a <b>leader icon</b> on the left side of the card. All starting missions and projects are still used.");
            }
            a.push("<b>Remaining missions:</b> each player shuffles his into a facedown <b>mission deck</b> on the side of the faction sheet labelled <b>Mission Deck</b>.");
            if (c.has("rote") && !c.mod("rotefirst")) {
              a.push("<b>Choosing mission sets</b> (at the end of this step): " + (c.team ? "each faction's <b>General</b>" : "each player") + " chooses any one card from his mission deck and places it facedown; reveal simultaneously." +
                ul(["<b>Darth Vader icon</b> → that faction uses the <b>Rise of the Empire</b> set: remove every card without a leader icon or a Darth Vader icon.",
                    "<b>Leader icon or no icon</b> → that faction uses the <b>base</b> set: remove every card with a Darth Vader icon.",
                    "Removed cards go back in the box. Starting missions and project cards are used in every game."]));
            }
            return ul(a);
          },
          src: function (c) { return J("RR p.15", "LtP p.5", c.has("rote") && (c.mod("rotefirst") ? "RotE p.1" : "RotE p.1–2")); } }
      ]
    },
    {
      title: "Starting positions",
      steps: [
        /* ---- first game: fixed positions (LtP p.16) ---- */
        { when: function (c) { return c.first; }, exp: "first",
          t: "First game — probe deck and loyalty",
          d: function () {
            return ul([
              "Remove these cards from the <b>probe deck</b>: Corellia, Mandalore, Saleucami, Sullust and Mustafar. Shuffle the deck and return it to its space on the board.",
              "<b>Rebel loyalty markers:</b> Kashyyyk, Bothawui, Naboo.",
              "<b>Imperial loyalty markers:</b> Saleucami, Corellia, Mustafar.",
              "<b>Subjugation markers:</b> Mandalore, Sullust."
            ]);
          },
          src: function () { return J("LtP p.16", "LtP p.5"); } },
        { when: function (c) { return c.first; }, exp: "first",
          t: "First game — starting units",
          d: function () {
            return "<p><b>Rebel Alliance</b></p>" + ul([
              "<b>“Rebel Base” space:</b> 1 X-wing, 1 Y-wing, 3 Rebel Troopers, 1 Airspeeder.",
              "<b>Bothawui:</b> 1 Corellian Corvette, 1 Rebel Transport, 1 X-wing, 1 Y-wing, 3 Rebel Troopers, 1 Airspeeder."
            ]) + "<p><b>Galactic Empire</b></p>" + ul([
              "<b>Coruscant:</b> 1 Star Destroyer, 1 Assault Carrier, 2 TIE Fighters, 3 Stormtroopers, 1 AT-AT, 1 AT-ST.",
              "<b>Mandalore:</b> 1 Death Star, 4 TIE Fighters, 2 Stormtroopers, 1 AT-ST.",
              "<b>Saleucami:</b> 1 Star Destroyer, 2 TIE Fighters, 2 Stormtroopers, 1 AT-ST.",
              "<b>Sullust:</b> 1 Star Destroyer, 2 TIE Fighters, 2 Stormtroopers, 1 AT-ST.",
              "<b>Mustafar:</b> 1 Assault Carrier, 2 TIE Fighters, 2 Stormtroopers, 1 AT-ST.",
              "<b>Corellia:</b> 1 Assault Carrier, 1 Stormtrooper."
            ]) + "<p class='inline-note'>No starting action cards are dealt in the first game.</p>";
          },
          src: function () { return J("LtP p.16", "LtP p.4"); } },
        /* ---- full game: RR p.15 step 8 ---- */
        { when: function (c) { return !c.first; }, exp: "base",
          t: "Starting loyalty",
          d: function () {
            return ul([
              "Shuffle the <b>probe deck</b> and reveal cards from the top until <b>three Rebel systems</b> and <b>five Imperial systems</b> have been revealed (the loyalty icon on a probe card marks a Rebel or an Imperial system).",
              "Place a <b>Rebel loyalty marker</b> in each of the three Rebel systems.",
              "Place a <b>subjugation marker</b> in each of the <b>first two</b> Imperial systems drawn, and an <b>Imperial loyalty marker</b> in each of the other three.",
              "Return the five Imperial systems' probe cards to the box. Shuffle all other probe cards back into the probe deck."
            ]);
          },
          src: function () { return J("RR p.15", "LtP p.18"); } },
        { when: function (c) { return !c.first; }, exp: function (c) { return c.has("rote") ? "rote" : "base"; },
          t: "Imperial starting units",
          d: function (c) {
            var a = [];
            if (c.mod("roteunits")) {
              a.push("<b>Rise of the Empire starting units</b> (replace the base list):");
              a.push("Place 1 <b>Death Star</b> on space <b>3</b> of the Imperial build queue.");
              a.push("Choose any <b>remote</b> system and place there: 4 TIE Fighters, 1 Stormtrooper and 1 <b>Death Star Under Construction</b>. Then remove that system's card from the probe deck and put it in the box.");
              a.push("Then place 8 TIE Fighters, 3 Assault Carriers, 3 Star Destroyers, 2 TIE Strikers, 12 Stormtroopers, 4 AT-STs, 2 Assault Tanks and 1 AT-AT in any systems that have an <b>Imperial loyalty marker</b>, a <b>subjugation marker</b> or a <b>Death Star Under Construction</b>.");
            } else {
              if (c.has("rote")) a.push("<b>Rise of the Empire:</b> after placing starting loyalty, players agree whether to use this base-game list or the Rise of the Empire starting units. This setup uses the base list.");
              a.push("The Imperial " + (c.team ? "team" : "player") + " receives 3 Star Destroyers, 3 Assault Carriers, 12 TIE Fighters, 12 Stormtroopers, 5 AT-STs, 1 AT-AT and 1 Death Star.");
              a.push("Place them in any systems that have an <b>Imperial loyalty marker</b> or a <b>subjugation marker</b>.");
            }
            a.push("At least <b>one ground unit</b> must be placed in each Imperial system.");
            if (c.team) a.push("<b>Team game:</b> the Imperial <b>Admiral</b> decides where to place the starting units.");
            return ul(a);
          },
          src: function (c) { return J("RR p.15", "LtP p.18", c.has("rote") && "RotE p.1"); } },
        { when: function (c) { return !c.first; }, exp: function (c) { return c.mod("roteunits") ? "rote" : "faq"; },
          t: "Rebel starting units",
          d: function (c) {
            var a = [];
            if (c.mod("roteunits")) a.push("<b>Rise of the Empire starting units:</b> 1 X-wing, 1 Y-wing, 1 U-wing, 1 Rebel Transport, 1 Corellian Corvette, 5 Rebel Troopers, 2 Airspeeders and 1 Rebel Vanguard.");
            else a.push("The Rebel " + (c.team ? "team" : "player") + " receives 1 Corellian Corvette, 1 Rebel Transport, 2 X-wings, 2 Y-wings, 6 Rebel Troopers and 2 Airspeeders.");
            a.push("Place them on the <b>“Rebel Base” space</b> and/or in <b>any one system that does not contain Imperial units</b>.");
            a.push("<i>FAQ errata: this replaces “any one Rebel or neutral system”, and applies to expansion setup as well.</i>");
            if (c.team) a.push("<b>Team game:</b> the Rebel <b>Admiral</b> decides where to place the starting units" + (c.p === 3 ? " (with 3 players, the single Rebel player)" : "") + ".");
            return ul(a);
          },
          src: function (c) { return J("RR p.15", "LtP p.18", "FAQ p.1", c.has("rote") && "RotE p.1"); } },
        { when: function (c) { return !c.first; }, exp: function (c) { return c.team ? "team" : "base"; },
          t: "Starting action cards",
          d: function (c) {
            var a = [];
            a.push("Each " + (c.team ? "team" : "player") + " draws <b>two random starting action cards</b> (action cards without a recruit icon) and places them facedown near the faction sheet.");
            a.push("Return all other starting action cards to the box without revealing them.");
            if (c.team) a.push("<b>Team game:</b> give each card to the player who controls the leader shown on it. If a card shows no leader, either player may use it.");
            a.push("An <b>Immediate</b> card must be revealed and resolved as soon as you gain it. During setup the Rebel player resolves his first.");
            return ul(a);
          },
          src: function (c) { return J("RR p.15", "RR p.2", "LtP p.18", "FAQ p.7"); } },
        { when: function () { return true; }, exp: function (c) { return c.first ? "first" : "base"; },
          t: "Choose the Rebel base",
          d: function (c) {
            var a = [];
            if (c.first) a.push("Make sure every system that contains Imperial units has been removed from the probe deck.");
            a.push("The Rebel " + (c.team ? "team" : "player") + " secretly chooses <b>one card from the probe deck</b> and places it facedown under the Rebel base <b>Location</b> space of the board.");
            if (c.first) a.push("<b>First game:</b> choose a system that is <b>not adjacent</b> to any Imperial units.");
            if (c.p === 4) a.push("<b>Team game:</b> if the Rebel team can't agree, the <b>General</b> decides.");
            a.push("Shuffle the probe deck and place it on the <b>Probe Deck</b> space of the board.");
            return ul(a);
          },
          src: function (c) { return J("RR p.15", "LtP p.5"); } },
        { when: function () { return true; }, exp: function (c) { return c.team ? "team" : "base"; },
          t: "Draw starting hands",
          d: function (c) {
            return ul([
              (c.team ? "Each faction takes its" : "Each player takes his") + " <b>four starting missions</b> and draws the top <b>two</b> cards of " + (c.team ? "its" : "his") + " mission deck. This hand is hidden from the other " + (c.team ? "team" : "player") + ".",
              c.team ? "<b>Team game:</b> each team's <b>General</b> draws the two mission cards and controls the hand of mission cards." : ""
            ]);
          },
          src: function (c) { return J("RR p.15", "LtP p.5"); } }
      ]
    },
    {
      title: "Begin",
      steps: [
        { when: function (c) { return c.first; }, exp: "first",
          t: "Read the First Game Strategy aloud",
          d: function (c) {
            return ul([
              "Before the first game, read the <b>First Game Strategy</b> (back page of the Learn to Play) aloud to all players.",
              c.team ? "With more than two players, everyone also needs the <b>Team Game</b> rules (LtP p.19)." : ""
            ]);
          },
          src: function (c) { return J("LtP p.17", "LtP p.20", c.team && "LtP p.19"); } },
        { when: function () { return true; }, exp: "base",
          t: "Start round 1",
          d: function (c) {
            return ul([
              "Begin with the <b>Assignment Phase</b>: the Rebel " + (c.team ? "team" : "player") + " assigns leaders to missions first, then the Imperial " + (c.team ? "team" : "player") + ".",
              c.team ? "In the <b>Command Phase</b> players take turns in the order of the <b>initiative numbers</b> (#1, #2, …) printed beside each role's leader pool on the Team Game side." : "In the <b>Command Phase</b> the Rebel player takes the first turn, then the players alternate.",
              "As questions arise during play, use the Rules Reference below."
            ]);
          },
          src: function (c) { return J("RR p.3", "RR p.6", "LtP p.6–7"); } }
      ]
    }
  ];
})();

/* =============================================================================
   RULES REFERENCE
   ============================================================================= */
(function () {
  var J = SWR.cite, ul = SWR.ul;
  var rote = function (c) { return c.has("rote"); };

  SWR.reference = [
    {
      title: "Winning the game",
      when: function () { return true; },
      html: function (c) {
        return "<h4>The Empire wins immediately</h4>" + ul([
          "when there are <b>Imperial units in the Rebel base's system and no Rebel units</b> there. This is only possible once the base is revealed.",
          "when the Death Star destroys the Rebel base's system with <i>Superlaser Online</i>, even while the base is still hidden."
        ]) + "<h4>The Rebels win immediately</h4>" + ul([
          "when the <b>reputation marker and the time marker are in the same space</b> of the time track.",
          "The time marker starts on space 1 and advances one space each Refresh Phase; the reputation marker starts on space 14.",
          "Reputation moves <b>toward</b> the time marker one space at a time; the game ends the instant it enters the time marker's space. Losing reputation moves it away.",
          "Reputation comes mostly from <b>objective cards</b>."
        ]) + "<h4>Rulings</h4>" + ul([
          "If the Imperials destroy the last Rebel units in the revealed base's system in the same combat step in which the Rebels fulfil an objective such as <i>Major Victory</i> or <i>Rebel Assault</i>, the <b>Empire wins</b>: its victory happens first.",
          "<b>Cheating:</b> a player revealed at the end of the game to have cheated, even by accident (e.g. moving from the base to an illegal system, or recruiting a leader that doesn't match the chosen action card), loses."
        ]);
      },
      src: function () { return J("RR p.4", "RR p.12", "RR p.14", "LtP p.11", "FAQ p.2", "FAQ p.4"); }
    },
    {
      title: "The game round at a glance",
      when: function () { return true; },
      html: function (c) {
        var t = function (s) { return c.team ? " <i>(" + s + ")</i>" : ""; };
        return "<ol>" +
          "<li><b>Assignment Phase</b> — starting with the Rebels, each " + (c.team ? "team" : "player") + " assigns leaders to missions.</li>" +
          "<li><b>Command Phase</b> — " + (c.team ? "in initiative order" : "starting with the Rebels") + ", take turns revealing missions or activating systems to move units; pass when done.</li>" +
          "<li><b>Refresh Phase</b><ol type='i'>" +
            "<li>Retrieve leaders.</li>" +
            "<li>Draw missions: each draws 2, then discards down to 10." + t("General only") + "</li>" +
            "<li>Launch probe droids: the Imperials draw 2 probe cards." + t("Imperial General only") + "</li>" +
            "<li>Draw objective: the Rebels draw 1." + t("Rebel General only") + "</li>" +
            "<li>Advance the time marker; recruit and/or build if its new space shows those icons (recruit: spaces 2–5; build: spaces 2, 4, 6, 8, 10, 12, 14)." + t("recruiting and building: Admiral only") + "</li>" +
            "<li>Deploy units: starting with the Rebels, slide the build queue; units sliding off are deployed (limit 2 new units per system)." + t("Admiral only") + "</li>" +
          "</ol></li></ol>" +
          "<p>Play rounds until one faction wins.</p>";
      },
      src: function () { return J("LtP p.4", "LtP p.6", "LtP p.20", "RR p.12"); }
    },
    {
      title: "Assignment Phase",
      when: function () { return true; },
      html: function (c) {
        return ul([
          "The Rebel " + (c.p === 4 ? "team (both players)" : c.p === 3 ? "player (for both roles)" : "player") + " assigns first; when finished, the Imperial " + (c.team ? "team" : "player") + " assigns.",
          "To assign: put a mission card from your hand <b>facedown</b> near your faction sheet and place <b>one or two leaders</b> from your leader pool on it. You may assign two even if the mission doesn't need both." + (c.team ? " <i>Team game:</i> at most two leaders per mission, whichever players they belong to." : ""),
          "Missions are not revealed now. Unassigned leaders stay in the pool, ready to activate systems, oppose missions or join combats.",
          "The <b>skill requirement</b> (top-left of the card) is the number of matching skill icons the assigned leaders need between them to reveal the mission later.",
          !c.first ? "An action card marked <b>Assignment</b> is used instead of assigning a leader to a mission." : "",
          c.team ? "<i>Team game:</i> both the Admiral and the General assign their own leaders. The <b>General</b> controls the mission hand and may disallow the Admiral's assignment if you disagree." : "",
          rote(c) ? "<i>Rise of the Empire:</i> up to two leaders can be assigned to a <b>Subversion</b> mission, which is used during the opponent's mission (see Rise of the Empire — other rules)." : ""
        ]);
      },
      src: function (c) { return J("RR p.3", "RR p.8", "LtP p.6", !c.first && "RR p.2", rote(c) && "RotE p.2"); }
    },
    {
      title: "Command Phase",
      when: function () { return true; },
      html: function (c) {
        return ul([
          c.team ? "<i>Team game:</i> players take turns in the order of the <b>initiative numbers</b> printed beside their roles on the Team Game side (#1, then #2, …)." : "The <b>Rebel</b> player takes the first turn, then players alternate.",
          "On your turn, do <b>one</b>: <b>activate a system</b> with a leader from your pool, or <b>reveal a mission</b> that one of your leaders is assigned to. Or <b>pass</b>.",
          "Once you pass, your turns are skipped for the rest of the phase, but you can still use leaders in your pool to <b>oppose missions</b> and to <b>add a leader</b> to a combat. Passing is not an action. When everyone has passed, the Refresh Phase begins.",
          "You don't have to reveal every mission. At the end of the phase, leaders still on mission cards go back to the pool and those cards return to your hand unrevealed.",
          "Where a leader stands within a system doesn't matter: it takes part in every mission and battle there.",
          c.p === 3 ? "<i>3 players:</i> the Rebel player has <b>two turns</b> each round, using his blue (Admiral) and orange (General) leaders separately, as in a 4-player game, and passes for each role separately." : "",
          "The Rebels may reveal their base voluntarily only at the <b>start</b> of one of their turns (before using a leader or passing), and not after passing (FAQ errata)." +
            (c.team ? " <i>Team game:</i> the Rebel Admiral or the Rebel General may do so on his own turn." : "")
        ]);
      },
      src: function (c) { return J("RR p.6", c.team && "RR p.11", "LtP p.7", c.team && "LtP p.19", "FAQ p.1", "FAQ p.5"); }
    },
    {
      title: "Activating a system & moving units",
      when: function () { return true; },
      html: function (c) {
        return "<ol>" +
          "<li><b>Place leader:</b> put a leader from your pool in any system. It needs <b>tactic values</b> to activate. A system that already holds a leader can be activated.</li>" +
          "<li><b>Move units:</b> move any of your ships into it from <b>adjacent</b> systems (from several systems at once if all are adjacent). Moving 0 units is allowed.</li>" +
          "<li><b>Reveal base:</b> if Imperial ground units moved in, the Rebel player must say whether the base is there; if it is, it is revealed.</li>" +
          "<li><b>Combat:</b> if both factions have units in the same theater (space or ground), resolve a combat.</li>" +
          "<li><b>Subjugate:</b> an Imperial ground unit in a system without Imperial loyalty → place a subjugation marker.</li></ol>" +
          "<h4>Movement rules</h4>" + ul([
            "Each moving ship carries ground units and TIE Fighters up to its <b>transport capacity</b> (the number in the black box on the faction sheet); each takes 1.",
            "Units with the <b>transport restriction</b> icon move only when units with transport capacity leave the same system. An ability that lets you “ignore transport restrictions” removes this need.",
            "Units with the <b>immobile</b> icon never move.",
            "Systems sharing a border are adjacent. You may cross the orange region borders, but not the shaded impassable areas.",
            "You <b>can't move units out of a system that contains one of your leaders</b>, even a leader without tactic values. A leader on the “Rebel Base” space stops units leaving that space, but not the base's system.",
            "Abilities that move units follow all movement rules (transport, immobile …) unless they say otherwise.",
            "If units don't fit in a system, stand them by its border and move survivors in after the combat."
          ]);
      },
      src: function () { return J("RR p.2", "RR p.9", "RR p.14", "LtP p.7", "FAQ p.1"); }
    },
    {
      title: "Missions — revealing, opposing, success",
      when: function () { return true; },
      html: function (c) {
        return "<ol>" +
          "<li><b>Flip</b> the card faceup and read it aloud. (If its leaders don't meet the skill requirement it can't be revealed.)</li>" +
          "<li><b>Choose the system</b> as the card says and place all assigned leaders there. “Against a leader” means a system containing that leader. A mission in the “Rebel Base” space puts the leader on that space, not in the base's system.</li>" +
          "<li><b>Attempt or resolve:</b> <i>resolve</i> can't be opposed — skip to 6. <i>Attempt</i> can be opposed.</li>" +
          "<li><b>Send a leader to oppose:</b> the opponent may place <b>one</b> leader from his pool in the system, even if he already has leaders there." + (c.team ? " <i>Team game:</i> only one player from the opposing team may send one." : "") + "</li>" +
          "<li><b>Opposition:</b> no opposing leader there → the mission succeeds. Otherwise both roll dice, the current player first: <b>one die per matching skill icon</b> on all of your leaders in the system. The attempting player needs <b>more successes</b>; a tie fails.</li>" +
          "<li><b>Success:</b> perform the ability, making any choices now.</li>" +
          "<li><b>Starting missions</b> return to your hand; all other missions (projects too) are discarded. A discarded project goes to the project deck's discard pile.</li></ol>" +
          "<h4>Dice and odds</h4>" + ul([
            "Hit and direct hit = <b>1 success</b>; special = <b>2 successes</b>; blank = none. Any colour of die may be rolled.",
            "A <b>leader portrait</b> on the card: its owner gains <b>2 extra successes</b> if that leader is assigned to the mission. (On a <i>resolve</i> card, the portrait leader adds an extra effect instead.)",
            "An opposing leader with no matching icons still forces a roll: you need at least one success.",
            "“Count all skill icons”: one die per skill icon of any kind.",
            "Maximum <b>10 dice</b> per player per mission" + (rote(c) ? ", plus up to 3 green dice (Rise of the Empire)" : "") + ".",
            "A <b>captured</b> leader doesn't take part and counts as absent, except when a mission is attempted <b>against it</b>: then it opposes and rolls, and the Rebels may still send another leader.",
            "Missions “against a leader” are attempted in that leader's system; all leaders in the system take part, and sending an opposer doesn't change the target.",
            c.team ? "<i>Team game:</i> one player on each team rolls for all of the team's leaders in the system; only the player whose leader is assigned can reveal a mission, and he makes its decisions." : ""
          ]) +
          "<h4>Rulings</h4>" + ul([
            "If a leader on a mission card is eliminated, captured or moved off it, the card returns to the hand unrevealed.",
            "You may reveal a mission even when it will do little or nothing.",
            "Only <i>attempted</i> missions can succeed or fail; <i>resolved</i> missions do neither.",
            "Missions that read “roll dice, even if unopposed” automatically succeed when unopposed.",
            "A combat caused by a mission is resolved after all mission steps, even if the card says “then resolve a combat”.",
            "If an ability assigns a leader to a mission during the Assignment Phase you may add a second leader; during the Command Phase you may not."
          ]);
      },
      src: function (c) { return J("RR p.8–10", "LtP p.8", "FAQ p.4", "FAQ p.8", rote(c) && "RotE p.1"); }
    },
    {
      title: "Skills",
      when: function () { return true; },
      html: function (c) {
        return ul([
          "<b>Diplomacy:</b> missions usually give loyalty in systems or more units.",
          "<b>Intel:</b> Rebel intel missions usually help with objective cards; Imperial ones help find the Rebel base.",
          "<b>Spec ops:</b> Rebel spec ops missions usually destroy Imperial units; Imperial ones capture Rebel leaders and exploit them.",
          "<b>Logistics:</b> Rebel logistics missions usually move units to and from the base; Imperial ones build special units or speed up building.",
          "A leader's skill icons show which missions it can attempt and oppose; more matching icons = more dice.",
          rote(c) ? "<b>Minor skills</b> (Rise of the Empire): small skill icons. Each lets the leader roll <b>1 green die</b> in a mission, and counts toward skill requirements. Example: Jabba the Hutt has 4 normal and 2 minor skills, rolling 2 regular dice and 1 green die for an intel mission." : ""
        ]);
      },
      src: function (c) { return J("LtP p.8", "RR p.7–8", "RR p.13", rote(c) && "RotE p.1"); }
    },
    {
      /* With Rise of the Empire the base steps still apply ("Players obey all combat rules from the base game except as
         listed below", RotE p.2), so this section stays visible and marks the Cinematic Combat changes inline. */
      title: function (c) { return rote(c) ? "Combat — the steps (with Cinematic Combat)" : "Combat — base game"; },
      when: function () { return true; },
      html: function (c) {
        var cin = rote(c), C = "<i>Cinematic Combat:</i> ";
        return "<p>Combat happens when units of both factions share a theater (space or ground) in a system." +
            (cin ? " With Rise of the Empire these base steps still apply, changed where marked <i>Cinematic Combat</i> (details in the next section)." : "") + "</p><ol>" +
          "<li><b>Add leader:</b> a player with no leader with tactic values in the system may add one from his pool (the current player decides first)." + (c.first ? "" : " Then, current player first, “Start of Combat” action cards may be used.") +
            (c.team ? " <i>Team game:</i> no adding if a teammate already has a leader with tactic values there; one added leader per team." : "") + "</li>" +
          (cin ? "<li><b>Draw tactic cards:</b> " + C + "nothing is drawn. Each player picks up his own space and ground advanced tactic decks and may look through them. Tactic values give rerolls instead.</li>"
               : "<li><b>Draw tactic cards:</b> draw <b>space</b> tactic cards equal to your leader's space tactic value and <b>ground</b> cards equal to the ground value (highest among your leaders there), only for theaters where both sides have units. Current player first." +
            (c.team ? " <i>Team game:</i> the team's highest values; the Admiral draws space cards, the General ground cards." : "") + "</li>") +
          "<li><b>Combat round:</b><ol type='i'>" +
            "<li><b>Space battle</b> (only if both have ships): " + (cin ? C + "first both players choose, reveal and resolve a space tactic card. Then " : "") + "the current player attacks with all his ships, then the opponent." + (c.team ? " <i>Admiral decides.</i>" : "") + "</li>" +
            "<li><b>Ground battle</b> (only if both have ground units): " + (cin ? C + "first both players choose, reveal and resolve a ground tactic card. Then " : "") + "the same with ground units." + (c.team ? " <i>General decides.</i>" : "") + "</li>" +
            "<li><b>Retreat:</b> starting with the current player, each may retreat.</li>" +
            "<li><b>Next round</b> if both still have units in the same theater. " +
              (cin ? "Structures that are a player's only ground units there, while the opponent still has ground units, are destroyed, unless their owner rolled at least one die in that theater's battle this round (then another round is fought)"
                   : "Rebel structures left alone against Imperial ground units are destroyed") +
              "; a Death Star Under Construction left as the only Imperial ship against Rebel ships is destroyed.</li></ol></li></ol>" +
          "<h4>Resolving an attack</h4><ol>" +
          "<li><b>Roll dice</b> matching the attack values of all your participating units: at most <b>5 black and 5 red</b> (reductions apply before the cap)" + (cin ? ", plus up to 3 green" : "") + ".</li>" +
          (cin ? "<li><b>Combat actions</b>, any number, any order: " + C + "once per attack, reroll up to your leader's tactic value in dice; or spend a die showing a special to remove 1 damage from one of your units in this theater whose health matches its colour. Tactic cards are never drawn or played during an attack.</li>"
               : "<li><b>Combat actions</b>, any number, any order: <b>draw</b> a tactic card of this theater by spending a die showing a special (spent dice are set aside), or <b>play</b> a tactic card of this theater (cards with the special icon need a special die spent).</li>") +
          "<li><b>Assign damage:</b> " + (cin ? C + "first the attacker removes the dice his opponent's “prevent” ability names. Then " : "") + "put hits and direct hits next to enemy units in this theater. A hit only goes on a unit whose <b>health colour matches the die</b>; a direct hit on any unit. Overkill is allowed; you must assign every die you can.</li>" +
          (cin ? "<li><b>Block:</b> " + C + "no tactic cards can be played during an attack, so no block cards are played here.</li>" +
                 "<li><b>Destroy:</b> " + C + "skip this step. Damage stays on units (track it with tokens); at the end of the round of battle, after every unit in that theater has attacked, each unit with damage ≥ health is destroyed. Lesser damage stays until the end of the combat.</li></ol>"
               : "<li><b>Block:</b> the opponent may play block cards to remove assigned damage (“block 2” = 2 on one unit or 1 each on two). Damage markers already on units can't be blocked.</li>" +
                 "<li><b>Destroy:</b> units with damage ≥ health go on the faction sheet and are destroyed at the end of this battle step; they still attack this round. Lesser damage becomes damage markers, kept until the end of the combat.</li></ol>") +
          "<h4>Ending a combat</h4>" + ul([
            "When no theater holds units of both sides after a combat round.",
            cin ? "Remove all damage. " + C + "advanced tactic cards are not reshuffled; each player's discards stay beside his decks."
                : "Discard all tactic cards from hands and shuffle all tactic cards back into their decks; remove all damage markers.",
            cin ? "Rerolled dice are rerolled together and can be rerolled again by another ability (the leader reroll only once per die per attack)."
                : "Tactic cards are hidden until played, only affect units in the combat's system and theater, and a card that deals damage without naming targets lets its player choose them. Rerolled dice are rerolled together and can be rerolled again."
          ]);
      },
      src: function (c) { return J("RR p.4–5", "RR p.14", "LtP p.14", "LtP p.20", rote(c) && "RotE p.2"); }
    },
    {
      title: "Combat — Cinematic Combat (Rise of the Empire)",
      when: function (c) { return rote(c); },
      html: function (c) {
        return "<p>Players obey all the base combat rules (the steps in the previous section) except as below. The original tactic cards are out of the game.</p>" +
          "<h4>Advanced tactic cards</h4>" + ul([
            "At <b>Draw Tactic Cards</b>, each player picks up his own ground and space tactic decks and may look through them. They are <b>never shuffled</b>: everything not in your discard pile is available.",
            "<b>Before each round of space battle and each round of ground battle</b> (each combat round has one of each):" +
              "<ol><li>Both players secretly choose 1 card of the current theater and place it facedown.</li><li>Reveal together.</li><li>Starting with the current player, each resolves the card's <b>top or bottom</b> ability. An ability preceded by a unit icon needs at least 1 unit of that type in the system.</li></ol>",
            "Each player <b>must</b> play a card every round of battle, but may choose to resolve neither ability and just discard it.",
            "Then the current player rolls and the battle continues. Advanced tactic cards are never played during an attack.",
            "Discard used cards faceup by their deck (anyone may look). They are not reshuffled after combat; when you use your deck's last card, return that deck's discards to it (except the card just used).",
            "An ability that lets you “draw” tactic cards instead retrieves that many cards of your choice from your discard pile to your deck. The Shield Generator's draw happens just before players choose ground cards.",
            "Abilities last until the end of that round of battle and only affect units of the card's theater in this system (unless stated). Changes to who attacks first last until the end of the combat or until changed again; if both players play “you resolve your attacks after …” the current player's card resolves first and is then overridden."
          ]) +
          "<h4>Leader reroll action</h4>" + ul([
            "Tactic values no longer draw cards. Instead, once during each of your attacks, as a combat action, reroll up to your leader's tactic value (that theater) in dice, all at once; each die only once per attack this way. Use your highest leader values in the system."
          ]) +
          "<h4>Damage</h4>" + ul([
            "<b>Preventing hits:</b> at the start of Assign Damage, the attacking player removes his dice that match the icons his opponent's ability prevents (e.g. “prevent 2 black hits” removes two black dice showing hits).",
            "<b>Removing damage:</b> as a combat action, spend a die showing a special to remove 1 damage from one of your units whose health matches the die's colour, in this theater. Specials can no longer draw or play tactic cards.",
            "<b>Destroying:</b> skip the Destroy Units step. A unit is destroyed at the <b>end of the round of battle</b> if its damage ≥ health; track damage with tokens. A unit destroyed by a tactic card doesn't roll this round and leaves after both cards are resolved (so it still meets unit requirements).",
            "Card damage: place a damage token on a unit of your choice (matching health colour if a colour is given); split it unless the card names one unit.",
            "The general rules under the base Destroy Units step still apply: damage that hasn't destroyed a unit stays on it into later combat rounds and is removed at the end of the combat, and lone Rebel Transports must retreat or be destroyed (only if an Imperial ship is present)."
          ]) +
          "<h4>Canceling</h4>" + ul([
            "A canceled card has no effect. If the <b>defender</b> uses a cancel ability, the defender resolves first. If he played a cancel card but uses its other ability, the normal order applies (current player first), and a current player who also played a cancel card may cancel the defender's card before it resolves.",
            "An additional card played through an ability can't be canceled and can't cancel."
          ]);
      },
      src: function () { return J("RotE p.2", "FAQ p.2", "FAQ p.6", "RR p.4–5"); }
    },
    {
      title: "Retreat & winning a battle",
      when: function () { return true; },
      html: function (c) {
        return "<h4>Retreat</h4>" + ul([
          "Take one of your leaders from the system (any one, even without tactic values) to an <b>adjacent</b> system, then move your units there following normal movement and transport rules. A leader only retreats with units, and with <b>no leader in the system you can't retreat</b>.",
          "Go to a system with your units or loyalty markers if possible; otherwise any adjacent system without units. <b>Never</b> to a system with enemy units, nor to the system the opponent moved from to start this combat. The Rebels can't retreat to the “Rebel Base” space.",
          "You can't retreat if the opponent has no units in the system. The Empire can't retreat <b>any</b> units with a Death Star or Death Star Under Construction in the combat.",
          "You must take <b>all your ships</b>; you may leave ground units and TIE Fighters" + (rote(c) ? " (and TIE Strikers)" : "") + " behind (then another round is fought if the opponent has units in that theater). Immobile units always stay; captured leaders can't be moved when retreating.",
          "Each player retreats at most once per combat." + (c.team ? " <i>Team game:</i> once per team, by any player using his own leader." : ""),
          "If the only Rebel ships are <b>Rebel Transports</b>, they must retreat or be destroyed, but only if there is at least one Imperial ship in the system.",
          "The opponent may also retreat in the same step as long as you still have a unit there (any theater).",
          rote(c) ? "<b>Interdictor</b> (Rise of the Empire): Rebel units can't retreat from its system, and Rebel abilities giving extra ways to retreat don't work there, until every Interdictor there is destroyed." : ""
        ]) + "<h4>Winning a battle</h4>" + ul([
          "You win a battle (space or ground) when the opponent has no units of that theater left in the system. Retreating all of a theater's units hands the opponent that battle.",
          "One side can win the space battle and the other the ground battle. If both sides are wiped out, or both retreat all their space units, nobody wins.",
          "You don't win a battle if the opponent had no units in that theater at the start of the combat. Destroying the last enemy ship still wins the space battle even if you retreat after the ground battle.",
          "“A combat that you initiated”: the player resolving his turn; outside a turn, the player whose card caused the combat."
        ]);
      },
      src: function (c) { return J("RR p.3", "RR p.5", "LtP p.15", "FAQ p.2", rote(c) && "RotE p.1"); }
    },
    {
      title: "Dice",
      when: function () { return true; },
      html: function (c) {
        return "<div class='tbl-wrap'><table class='ref-table'><thead><tr><th>Result</th><th>In combat</th><th>In a mission</th></tr></thead><tbody>" +
          "<tr><td><b>Hit</b></td><td>1 damage to a unit whose health colour matches the die</td><td>1 success</td></tr>" +
          "<tr><td><b>Direct hit</b></td><td>1 damage to a unit with any (black or red) health</td><td>1 success</td></tr>" +
          "<tr><td><b>Special</b></td><td>" + (rote(c) ? "Remove 1 damage from your unit whose health matches the die (Cinematic Combat)" : "Draw 1 tactic card, or play 1 tactic card with the special icon") + "</td><td>2 successes</td></tr>" +
          "<tr><td>Blank</td><td>—</td><td>no success</td></tr></tbody></table></div>" +
          ul([
            "Combat: at most <b>5 black and 5 red</b> dice per attack. Missions: at most <b>10 dice</b>, any colour.",
            "Die colour only matters in combat. A die may be rerolled any number of times.",
            rote(c) ? "<b>Green dice</b> (Rise of the Empire): two direct-hit faces, no other icons. Rolled by some units and leaders (minor skills). Only 3 exist, so never more than 3 per roll, on top of the 5 red + 5 black. An ability that says “roll dice” uses red or black unless it says otherwise (e.g. Death Star Plans)." : ""
          ]);
      },
      src: function (c) { return J("RR p.4", "RR p.7", "RR p.9", "LtP p.20", rote(c) && "RotE p.1–2"); }
    },
    {
      title: "Refresh Phase",
      when: function () { return true; },
      html: function (c) {
        var t = function (s) { return c.team ? " <i>Team game: " + s + ".</i>" : ""; };
        return "<p>Immediately before step 1, the Rebels may play one <b>Start of Refresh Phase</b> objective.</p><ol>" +
          "<li><b>Retrieve leaders</b> from the board to their pools. Leaders still on mission cards come back and the cards return to hand. Captured leaders can't return to the pool and stay where they are.</li>" +
          "<li><b>Draw missions:</b> each draws 2, then discards down to <b>10</b> mission cards. Projects count; objectives don't; starting missions can never be discarded. (You may hold more than 10 until this step.)" + t("only each team's General draws and discards") + "</li>" +
          "<li><b>Launch probe droids:</b> the Imperials draw 2 probe cards and keep them hidden. Each shows a system where the base is <b>not</b>." + t("only the Imperial General") + "</li>" +
          "<li><b>Draw objective:</b> the Rebels draw 1 objective card." + t("the Rebel General") + (rote(c) ? " An <b>Immediate</b> objective is revealed and resolved at once." : "") + "</li>" +
          "<li><b>Advance the time marker</b> one space, then act on the icons beside its new space. On the time track pictured in the Learn to Play, the <b>recruit</b> icon is on spaces <b>2, 3, 4 and 5</b> and the <b>build</b> icon on spaces <b>2, 4, 6, 8, 10, 12 and 14</b>:" + ul([
            "<b>Recruit icon:</b> each draws 2 cards from his action deck and recruits one leader shown on either card. " +
              (c.first ? "<b>First game:</b> ignore both cards' abilities and return both to the box." : "Keep the chosen card facedown (usable later); put the other on the bottom of your action deck unrevealed.") +
              " Choices are simultaneous, but the Rebels declare their leader first." + t("the Admiral draws and decides; the leader goes to the pool of its colour and that pool's player gets the card"),
            "<b>Build icon:</b> both build at once: one unit per resource icon in your loyal and subjugated systems (subjugated: <b>left-most icon only</b>), placed on your build queue in the space matching the number beside the icon." + t("Admiral only") + (rote(c) ? " If there's a timing conflict over which units to build, the Rebels choose first (Rise of the Empire)." : "")
          ]) + "</li>" +
          "<li><b>Deploy units:</b> starting with the Rebels, slide every unit one space down the build queue; units sliding off space 1 are deployed (see Building & deploying)." + t("Admiral only") + "</li></ol>" +
          "<h4>Recruiting rulings</h4>" + ul([
            "You can't recruit a leader already on the board, in a pool, or eliminated. If neither card shows a recruitable leader, you may keep drawing one card at a time until one does, but you may still choose a card that recruits nobody.",
            !c.first ? "If every leader on a chosen card is captured, eliminated or lured to the Dark Side, no one is recruited and its Immediate ability has no effect; the card is discarded." : "",
            "An ability that recruits a specific leader takes it from the supply into your pool."
          ]);
      },
      src: function (c) { return J("RR p.3", "RR p.11–12", "LtP p.4", "LtP p.10", !c.first && "LtP p.18", "LtP p.20", "FAQ p.5", rote(c) && "RotE p.1"); }
    },
    {
      title: "Building & deploying units",
      when: function () { return true; },
      html: function (c) {
        return "<h4>Building</h4>" + ul([
          "Units come from the supply. You can't use a system's resource icons if the opponent has a unit there, nor if it holds a <b>sabotage marker</b>.",
          "The Rebels may also build from the resource icons on the <b>“Rebel Base” space</b>, unless the base is revealed and the Empire has a unit or loyalty in its system.",
          "The Rebel faction sheet offers several units for the blue ▲ and orange ■ icons: choose one when you build that icon.",
          "You may build fewer units than you could.",
          "Units are limited to those in the box. When building in Refresh Phase step 5 you may destroy one of your units on the board to build it, but only if none with that name is left in your supply. The Empire can never destroy its own Death Star this way.",
          "Abilities that “place units on the build queue” take them from the supply, ignore the system's loyalty, and work despite sabotage. An ability that refers to a system's resource icons uses all of them, whoever has loyalty, subjugation or units there.",
          "If a card lets you <b>gain</b> units at another time and your supply is short, you may destroy your own units on the board then to gain them (e.g. <i>Incite Rebellion</i>)."
        ]) + "<h4>Deploying</h4>" + ul([
          "Deploy units leaving space 1 into your <b>loyal or subjugated</b> systems: at most <b>2 units per system</b> each Refresh Phase. Units you can't or won't deploy go back to space 1.",
          "Not into systems with a sabotage marker or any enemy ship or ground unit, and never into remote systems.",
          "Hidden base: the Rebels may deploy up to 2 units to the <b>“Rebel Base” space</b>, and into the base's system too if it is loyal. Revealed base: nothing is deployed to the space; the base's system takes deployments only if it has Rebel loyalty and no Imperial units.",
          "A Death Star leaving the build queue is placed in the Death Star Under Construction's system, even if Rebel ground units are there.",
          "“<b>Gain</b>” a unit = take it straight from the supply into the system (not the queue). Abilities that say “build” or “deploy” are stopped by sabotage; others are not (e.g. <i>Oversee Project</i> deploys, so it can't be used in a sabotaged system). <i>Oversee Project</i> and <i>Imperial Might</i> may deploy into a remote system if the card's other requirements are met.",
          rote(c) ? "<b>Shield Bunker</b> (Rise of the Empire): may also be deployed to any system with at least 1 Imperial ground unit and no Rebel units, whatever its loyalty (remote systems included). While a Shield Bunker sits in a remote system with no Rebel units, the Empire may deploy there as if it were loyal, but not in the build step in which the Bunker itself is deployed; a Death Star deployed there counts toward the 2-unit limit." : ""
        ]) + (c.team ? "<p><i>Team game:</i> only each team's Admiral builds and deploys.</p>" : "");
      },
      src: function (c) { return J("RR p.3", "RR p.6–7", "RR p.10–13", "LtP p.10", "FAQ p.1", "FAQ p.4–5", rote(c) && "RotE p.1 · FAQ p.8"); }
    },
    {
      title: "Loyalty, subjugation & systems",
      when: function () { return true; },
      html: function () {
        return "<h4>System types</h4>" + ul([
          "The board has <b>32 systems</b> in <b>8 regions</b> of 4. <b>Populous</b> systems have a loyalty space and resource icons; <b>remote</b> systems have neither, are always neutral, take no loyalty or subjugation markers, and units can't be deployed there (except where a card or unit ability allows it, see Building &amp; deploying).",
          "<b>Neutral</b> = no Rebel or Imperial loyalty marker. Neutral is about loyalty only: a system can be neutral <b>and</b> subjugated (FAQ errata to RR p.10).",
          "<b>Imperial system</b> = Imperial loyalty or a subjugation marker. <b>Rebel system</b> = Rebel loyalty and no subjugation marker.",
          "<b>Coruscant</b> is always loyal to the Empire and can't gain or lose loyalty. The “Rebel Base” space is not a system and has no loyalty.",
          "“Closest system” = fewest moves; ties are chosen by the player resolving the ability."
        ]) + "<h4>Loyalty</h4>" + ul([
          "Gain 1 loyalty in a <b>neutral</b> system: place your marker. In the <b>opponent's</b> system: remove his marker (now neutral). Gain 2 there: remove his and place yours.",
          "Lose loyalty: remove your marker. Neutral systems can't lose loyalty.",
          "At most one loyalty marker and one subjugation marker per system. “Have loyalty” means having your marker there, whatever units or subjugation are present.",
          "Loyalty lets you build from the system's resource icons and deploy units there."
        ]) + "<h4>Subjugation</h4>" + ul([
          "An Imperial ground unit in a system without Imperial loyalty <b>subjugates</b> it: place a subjugation marker (the back of an Imperial loyalty marker), on top of any Rebel loyalty marker.",
          "The Empire builds from a subjugated system's <b>left-most</b> resource icon only and may deploy there. The Rebels can't build or deploy in it, even with their loyalty underneath.",
          "As soon as no Imperial ground units remain, remove the subjugation marker: loyalty reverts to the Rebels, or neutral.",
          "A neutral subjugated system that gains Imperial loyalty flips its marker to the loyalty side. Rebel loyalty gained there goes beneath the subjugation marker; lost, it is removed."
        ]) + "<h4>Destroyed systems</h4>" + ul([
          "<i>Superlaser Online</i> places a destroyed system marker and destroys all Rebel ground units there. Imperial ground units beyond the transport capacity of Imperial ships there are destroyed (owner's choice). Leaders are unaffected; any sabotage marker is removed.",
          "Destroyed systems have no loyalty, no resource icons, are neither populous nor remote, and can't be subjugated. Ground units may move in, but units needing transport beyond the capacity of their side's ships there are destroyed; no ground battles occur there, space battles happen as normal.",
          "Missions, objectives and action cards can still be attempted or resolved there."
        ]);
      },
      src: function () { return J("RR p.7–8", "RR p.10–14", "LtP p.7", "LtP p.13", "FAQ p.1–2"); }
    },
    {
      title: "The Rebel base & probe cards",
      when: function () { return true; },
      html: function (c) {
        return "<h4>The hidden base</h4>" + ul([
          "The base's probe card lies facedown under the board's <b>Location</b> space. The <b>“Rebel Base” space</b> is not a system: units are built from and deployed to it as if it were one, and missions can't be attempted there unless a card says so.",
          "An effect “in the Rebel base's system” (not the space) must be resolved in the real system.",
          "<b>Moving out:</b> units on the “Rebel Base” space can move to the base's system or a system adjacent to it. <b>Moving in:</b> activate the “Rebel Base” space to bring units from the base's system or an adjacent one. Each move hints where the base is. A few missions ignore adjacency.",
          "A Rebel leader on the “Rebel Base” space stops units leaving it, even by missions such as <i>Lead the Strike Team</i>, unless a card says otherwise (e.g. <i>Plan the Assault</i>).",
          "<b>Probe deck:</b> one card per system except Coruscant. Each Refresh the Empire draws 2; each one is a system where the base is <b>not</b>. The Empire keeps them hidden" + (c.team ? " (the Imperial General manages them)" : "") + ". Both players may take notes."
        ]) + "<h4>Revealing the base</h4>" + ul([
          "The base is revealed when the Empire has <b>loyalty or ground units</b> in its system: after all movement, before combat. Imperial ships alone (even a Death Star) don't reveal it, and the Rebels say nothing.",
          "The Rebels may also reveal it voluntarily at the start of one of their Command Phase turns (not after passing); if Imperial units are already there, a combat follows immediately.",
          "On reveal: flip the probe card faceup onto the “Rebel Base” space and move every unit and leader from that space into the system.",
          "While revealed: nothing can move or be deployed to the space; anything <i>placed</i> there goes to the base's system instead; its resource icons still work unless an Imperial unit or loyalty is in the system; cards about the space apply to the system. <i>Long Range Probe</i> doesn't reveal the base."
        ]) + "<h4>Establishing a new base (<i>Rapid Mobilization</i>)</h4>" + ul([
          "Resolved at the end of the Command Phase. Draw the top 4 probe cards and may pick one as the new base, but not a system with Imperial loyalty, Imperial units or a destroyed marker.",
          "If you move: reveal the old base's card, move all units and leaders from the space to the old system, give the old card to the Empire, and put the new card facedown under Location. Shuffle the unchosen cards to the bottom of the probe deck.",
          "You may decline (the cards go to the bottom; a hidden base stays hidden). It also works after the base is revealed.",
          "<i>Rapid Mobilization</i> can't move units out of a system that contains a Rebel leader. With <i>Contingency Plan</i> it can be resolved twice at the end of the Command Phase (relocate twice, move units twice, or one of each)."
        ]);
      },
      src: function () { return J("RR p.4", "RR p.10–11", "LtP p.12", "FAQ p.1", "FAQ p.4–5"); }
    },
    {
      title: "Leaders, capture & attachment rings",
      when: function () { return true; },
      html: function (c) {
        return ul([
          "Leaders move units (by activating), attempt and oppose missions, and fight. Skill icons sit under the name; the two numbers are the <b>tactic values</b> (space in blue, ground in orange). A leader without tactic values can't activate a system.",
          "Leaders in a system take part in every mission and combat there, and stop their faction's units leaving it.",
          "Luke Skywalker (Jedi) counts as Luke Skywalker for all card abilities and action-card restrictions.",
          "<b>Eliminated</b> leaders go back to the box for the rest of the game.",
          rote(c) ? "<b>Leader pool limit</b> (Rise of the Empire): more than <b>8 leaders</b> in a pool → choose 8 and eliminate the rest." + (c.team ? " Team game: 8 per team; the excess comes from the pool of whichever teammate has more." : "") : ""
        ]) + "<h4>Captured leaders</h4>" + ul([
          "Capture puts the <b>captured ring</b> on a Rebel leader (only Rebel leaders can be captured). A captured leader doesn't oppose missions, doesn't add tactic values, can't use action cards, can't return to the pool, and the Rebels can't move it. It doesn't stop Rebel units leaving its system.",
          "The Empire can move it like a ground unit (it takes no transport capacity), but not when retreating.",
          "There is one captured ring: capturing a second leader rescues the first. Another ring attached to a captured leader replaces the captured ring. A leader in the <b>carbonite</b> ring is still captured (it can be rescued, and missions and cards that affect captured leaders work on it); the Empire can hold one leader in each ring. Rescuing it doesn't give back the reputation lost to <i>Carbon Freezing</i>.",
          "<b>Rescue:</b> when no Imperial units remain in its system, or by a card. Remove the ring and place the leader on the “Rebel Base” space (the base's system if revealed). After a rescue <i>mission</i>, any of the assigned leaders may go with it."
        ]) + "<h4>Attachment rings</h4>" + ul([
          "Press the leader's stand into the ring; its effect is on the card that attached it (you may keep that card as a reminder).",
          "One ring per leader: a new ring replaces the old one. A removed ring returns to the supply and its effect ends.",
          c.team ? "<i>Team game:</i> <i>Lure of the Dark Side</i> gives the Imperial team a Rebel leader for the rest of the game; in the Refresh Phase it goes to the Imperial pool of its colour. A lured leader is not a captured leader." : ""
        ]);
      },
      src: function (c) { return J("RR p.3", "RR p.7–8", "RR p.12", "LtP p.6", "LtP p.13–14", "FAQ p.3", rote(c) && "RotE p.1"); }
    },
    {
      title: "Action cards",
      when: function () { return true; },
      html: function (c) {
        if (c.first) {
          return ul([
            "<b>First game:</b> action cards are only used to <b>recruit leaders</b>. The starting action cards stay in the box, and when you recruit, both drawn cards' abilities are ignored and both cards go back to the box.",
            "From your next game, each player starts with two secret action cards and keeps the card he recruits from (choose “Full game” above)."
          ]);
        }
        return ul([
          "Each ability can be used <b>once per game</b>: flip the card faceup, resolve it, return it to the box. Using one is optional; if both players want to at once, the current player goes first.",
          "The bold word above the ability says when: <b>Assignment</b> (instead of assigning a leader to a mission), <b>Start of Combat</b> (right after Add Leader; lasts for this combat only), <b>Immediate</b> (as soon as you gain the card, during setup or after recruiting from it), <b>Special</b> (as the card says).",
          "In a mission or combat, a card can only be used if a leader shown on it is <b>already in that system</b> (unless the card moves the leader there). Cards used at other times, and rings already attached, don't need the leader, so they still work if the leaders shown are captured, eliminated or lured to the Dark Side.",
          "Captured leaders and leaders lured to the Dark Side can't use action cards.",
          "You may look at your own action cards at any time, never at the opponent's. A card that searches for a mission card doesn't reveal it.",
          "Recruiting: you keep the chosen card facedown; the other goes to the bottom of your action deck.",
          c.team ? "<i>Team game:</i> each card goes to the player controlling the leader shown on it; a card without a leader can be used by either." : ""
        ]);
      },
      src: function (c) { return c.first ? J("LtP p.4", "LtP p.10", "LtP p.18") : J("RR p.2", "RR p.11", "LtP p.18", "FAQ p.3", "FAQ p.7"); }
    },
    {
      title: "Objectives & reputation",
      when: function () { return true; },
      html: function (c) {
        return ul([
          "The Rebels start with 1 objective and draw 1 each Refresh Phase" + (c.team ? " (the Rebel General draws, holds and plays them)" : "") + ". Any number may be held; they don't count toward the mission hand limit and stay hidden until played.",
          "Play one when you <b>fulfil its requirement at the time it names</b>: gain the reputation in its top-left corner, moving the reputation marker toward the time marker. The card is then discarded and can't be used again unless an ability allows it (FAQ p.7; the RR said “returned to the game box”).",
          "<b>Combat:</b> play as soon as the requirement is met (it must be met in a combat, not by units destroyed outside one). A card that needs you to win a battle is played at the end of the combat.",
          "<b>Start of Refresh Phase:</b> only immediately before step 1 of the Refresh Phase.",
          "<b>Only one objective per combat and one per Refresh Phase</b>; after playing one in a combat, not even Death Star Plans can be played in it. The Rebels are never forced to play one.",
          "The objective deck runs stage I on top, then II, then III. Card backs are open information.",
          "An ability that makes the Rebels reveal objectives shows the whole hand, which then becomes hidden again.",
          "“X-health worth of units” counts the health printed on the faction sheet. Units lost with a destroyed transport (e.g. ground units carried in a destroyed system) count as destroyed in that combat."
        ]) + (rote(c) ? "<h4>Rise of the Empire</h4>" + ul([
          "<b>Immediate</b> objectives are revealed and resolved as soon as they are drawn; they give reputation later, as the card explains. Such an objective (and any objective that places target markers, e.g. <i>Show No Fear</i>) stays in play while at least one of its target markers is on the board, then is discarded.",
          "<b>Target markers</b> go where the card says. A player with a ground unit in that system, where the opponent has none, may remove the marker (the card says what happens). Destroying a system removes its markers and resolves their effects.",
          "<i>Show No Fear</i> gives no reputation in the Refresh Phase it is played; it can't be played with another objective in the same Refresh Phase, but once in play its reputation can come alongside another objective.",
          "<i>Defensive Position</i> can't be used in the revealed base's system. <i>Rebel Cell</i> drawn with no Rebel systems on the board is discarded without a replacement."
        ]) : "");
      },
      src: function (c) { return J("RR p.10", "RR p.12", "LtP p.11", "FAQ p.2", rote(c) ? "RotE p.1 · FAQ p.7" : "FAQ p.7"); }
    },
    {
      title: "The Death Star",
      when: function () { return true; },
      html: function (c) {
        return ul([
          "A ship and a <b>space station</b> (not a capital ship or fighter). It has <b>no health</b> and can't be assigned or dealt damage. The Empire can't retreat any units from a combat containing a Death Star or Death Star Under Construction.",
          "<b>Superlaser:</b> the Empire's <i>Research and Development</i> mission draws project cards; <i>Superlaser Online</i> lets a Death Star destroy a system (see Destroyed systems). Destroying the base's system wins, hidden or not.",
          "<b>A second Death Star:</b> <i>Construct Death Star</i> places a <b>Death Star Under Construction</b> (immobile) in the mission's system and a Death Star on space 3 of the build queue. The queued Death Star can only be deployed to that system and is destroyed if the one under construction is. The card adds: when the Death Star is deployed, it replaces the Death Star Under Construction.",
          "An ability naming “the Death Star” doesn't work for the Death Star Under Construction unless it says so (e.g. not <i>Superlaser Online</i> or <i>Fear Will Keep Them in Line</i>). <i>Oversee Project</i> and <i>Imperial Might</i> can speed up the queued Death Star only if resolved in the Under Construction's system.",
          "A Death Star Under Construction left as the only Imperial ship against Rebel ships at the end of a combat round is destroyed. Destroying it without the plans gives no reputation."
        ]) + "<h4>Death Star Plans (objective)</h4>" + ul([
          "In the space battle step, after both sides have attacked and units are destroyed, the Rebels may reveal <i>Death Star Plans</i> if they have at least one <b>fighter</b> in the system and a Death Star (or one under construction) is there.",
          "Roll <b>3 dice</b>" + (rote(c) ? " (red or black)" : "") + ": any <b>direct hit</b> destroys it; discard the card and gain its reputation. No direct hit: keep the card for a later combat round. One use per combat round.",
          "<i>One in a Million</i> can turn a die into an automatic direct hit; the Master Yoda ring can reroll one.",
          rote(c) ? "<b>Shield Bunker</b> (Rise of the Empire): a Death Star or Death Star Under Construction in the same system as a Shield Bunker can't be destroyed, dealt damage or assigned damage, so Death Star Plans can't touch it until every Shield Bunker there is destroyed." : ""
        ]) + "<h4>Rulings</h4>" + ul([
          "If the only Imperial ship is a Death Star that can't roll because of two or more Ion Cannons, the Empire has no ground units there, and the Rebels haven't revealed Death Star Plans this round, the Rebel ships must retreat at the end of the combat round (destroyed if they can't).",
          "<i>Rogue Squadron Raid</i> can't target a Death Star on the build queue."
        ]);
      },
      src: function (c) { return J("RR p.4–7", "RR p.13", "LtP p.5", "LtP p.11", "FAQ p.1–2", "FAQ p.4", "FAQ p.8", rote(c) && "RotE p.1"); }
    },
    {
      title: "Units & faction sheets",
      when: function () { return true; },
      html: function (c) {
        var row = function (n, q, type, b, r, h, cap) {
          return "<tr><td><b>" + n + "</b> <span class='qty'>×" + q + "</span><span class='utype'>" + type + "</span></td><td>" + b + "</td><td>" + r + "</td><td>" + h + "</td><td>" + cap + "</td></tr>";
        };
        var head = "<thead><tr><th>Unit</th><th>Black</th><th>Red</th><th>Health</th><th>Cap.</th></tr></thead>";
        return ul([
          "<b>Ships:</b> units with a blue resource icon, plus the Super Star Destroyer, Death Star and Death Star Under Construction. <b>Capital ship</b> = red health; <b>fighter</b> = black health; the two Death Star pieces are <b>space stations</b>.",
          "<b>Ground units:</b> units with an orange resource icon. Ground units and TIE Fighters need transport capacity to move.",
          "<b>Structures</b> (Rebel Ion Cannon and Shield Generator): immobile, roll no dice, and give the ability printed on the sheet while in the system; several can share a system.",
          "<b>Black</b> and <b>Red</b> are a unit's attack dice; <b>Health</b> is the damage that destroys it; <b>Cap.</b> is its transport capacity.",
          "<b>Destroyed</b> units go back to the supply. “Destroy X-health worth of units”: the player resolving it chooses units whose combined health is X or less, and they are destroyed at once."
        ]) +
          "<h4>Galactic Empire</h4><div class='tbl-wrap'><table class='ref-table units'>" + head + "<tbody>" +
          row("TIE Fighter", 24, "fighter", "1", "–", "1 black", "–") +
          row("Assault Carrier", 8, "capital ship", "1", "1", "2 red", "4") +
          row("Star Destroyer", 8, "capital ship", "1", "2", "4 red", "6") +
          row("Super Star Destroyer", 2, "capital ship", "2", "3", "6 red", "8") +
          row("Death Star", 2, "space station", "–", "4", "none", "8") +
          row("Death Star Under Construction", 1, "space station, immobile", "–", "–", "4 black", "–") +
          row("Stormtrooper", 30, "ground", "1", "–", "1 black", "–") +
          row("AT-ST", 10, "ground", "1", "1", "2 red", "–") +
          row("AT-AT", 4, "ground", "1", "2", "3 red", "–") +
          "</tbody></table></div>" +
          "<h4>Rebel Alliance</h4><div class='tbl-wrap'><table class='ref-table units'>" + head + "<tbody>" +
          row("X-wing", 8, "fighter", "1", "–", "1 black", "–") +
          row("Y-wing", 12, "fighter", "–", "1", "1 black", "–") +
          row("Rebel Transport", 4, "capital ship", "–", "–", "2 red", "4") +
          row("Corellian Corvette", 4, "capital ship", "1", "1", "2 red", "2") +
          row("Mon Calamari Cruiser", 3, "capital ship", "1", "2", "4 red", "4") +
          row("Rebel Trooper", 21, "ground", "1", "–", "1 black", "–") +
          row("Airspeeder", 6, "ground", "1", "1", "2 red", "–") +
          row("Shield Generator", 3, "structure", "–", "–", "3 red", "–") +
          row("Ion Cannon", 3, "structure", "–", "–", "3 red", "–") +
          "</tbody></table></div>" +
          ul([
            "<b>Shield Generator:</b> at the start of each ground battle step, draw 1 ground tactic card." + (rote(c) ? " (Cinematic Combat: retrieve 1 card of your choice from your ground discard pile, just before cards are chosen.)" : ""),
            "<b>Ion Cannon:</b> during each space battle step, your opponent rolls 2 fewer red dice.",
            "Values as printed on the faction sheets pictured in the Learn to Play; counts from the Rules Reference unit list.",
            rote(c) ? "<b>Rise of the Empire</b> adds units on the two <b>unit reference sheets</b> (not pictured in the rulesheet), among them the TIE Striker, Assault Tank, Shield Bunker and Interdictor (Empire) and the U-wing and Rebel Vanguard (Rebels). All immobile ground units are <b>structures</b>; abilities that move an opponent's units can't move structures." : ""
          ]);
      },
      src: function (c) { return J("RR p.3", "RR p.7", "RR p.9", "RR p.13–14", "LtP p.3", "LtP p.6", "LtP p.10", "LtP p.13", "LtP p.15", rote(c) && "RotE p.1–2"); }
    },
    {
      title: "Sabotage markers",
      when: function () { return true; },
      html: function (c) {
        return ul([
          "Placed by the Rebel <i>Sabotage</i> mission (" + (rote(c) ? "Rise of the Empire replaces the base card with its own version; the base card's errata reads" : "errata:") + " “Attempt in any populous system.”). At most one per system.",
          "Neither faction can build from that system's resource icons or deploy units there; abilities that “build” or “deploy” there are blocked too. Abilities that “gain” units or “place units on the build queue” are not.",
          "Markers stay until an Imperial mission removes them, or the system is destroyed."
        ]);
      },
      src: function (c) { return J("RR p.13", "LtP p.12", "FAQ p.1–2", "FAQ p.5", rote(c) && "RotE p.1"); }
    },
    {
      title: "Team game (3–4 players)",
      when: function (c) { return c.team; },
      html: function (c) {
        return ul([
          c.p === 3 ? "<b>3 players:</b> one player is the Rebels and uses the Team Game side, controlling both roles: he has two turns in each round of Command Phase turns, one as Admiral and one as General (leaders used separately, passing separately). The two Imperial players are the Admiral and the General." :
            "<b>4 players:</b> two per faction, one Admiral and one General each.",
          "Each player controls the leaders of his colour (<b>Admiral = blue</b>, <b>General = orange</b>) and makes all their decisions. Both may activate systems and move any of the team's units.",
          "In a mission, the player who reveals it rolls and decides for it, and one player per team rolls for all of that team's leaders in the system (the Rules Reference; the Learn to Play has each player roll for his own leaders).",
          "Any step done “starting with the current player” is done by the current player's whole team before the other team. Project cards the Empire draws go into the Imperial General's mission hand.",
          "Turns follow the <b>initiative numbers</b> beside the roles on the faction sheets. On your turn: activate a system with one of your leaders, reveal a mission one of your leaders is assigned to, or pass.",
          "Rules about “a player's units” mean all of the team's units."
        ]) + "<h4>Responsibilities</h4><div class='tbl-wrap'><table class='ref-table'><thead><tr><th>Admiral</th><th>General</th></tr></thead><tbody>" +
          "<tr><td>Space battles: rolls, " + (rote(c) ? "plays the space tactic cards" : "draws and plays space tactic cards") + ", makes all decisions</td><td>Ground battles: rolls, " + (rote(c) ? "plays the ground tactic cards" : "draws and plays ground tactic cards") + ", makes all decisions</td></tr>" +
          "<tr><td>Recruiting: draws the action cards and chooses the leader (an orange leader and its card go to the General)</td><td>Mission hand: draws, discards, and may veto the Admiral's assignments</td></tr>" +
          "<tr><td>Building and deploying units; places the starting units</td><td>Imperial General: draws and manages probe cards · Rebel General: draws, keeps and plays objectives</td></tr>" +
          "<tr><td>—</td><td>Decides the base location if the Rebel team disagrees" + (rote(c) ? "; chooses the faction's mission set" : "") + "</td></tr>" +
          "</tbody></table></div>" + ul([
          "<b>Communication:</b> share anything, and show each other cards, but talk openly at the table. Code and whispers are fine; leaving the room is not.",
          "Combat: each team adds at most one leader and uses its best tactic values; any player may retreat with his own leader, once per team per combat.",
          "Missions: at most two leaders per mission, whoever owns them; only one player of the opposing team sends a leader."
        ]);
      },
      src: function (c) { return J("LtP p.19", "LtP p.20", "RR p.2–6", "RR p.8–12", "RR p.14–15", rote(c) && "RotE p.1–2"); }
    },
    {
      title: "Rise of the Empire — other rules",
      when: function (c) { return rote(c); },
      html: function () {
        return "<h4>Structures</h4>" + ul([
          "All immobile ground units are structures. Normally a player's structures are destroyed when they are his only ground units left and the opponent still has ground units there, <b>but</b> not if he rolled at least one die in that theater's battle this round: then another round is fought. A player who rolled no dice (e.g. because of <i>According to My Design</i>) loses them.",
          "Abilities that move (or force the opponent to move) the opponent's units can't move structures."
        ]) + "<h4>Subversion mission</h4>" + ul([
          "Never attempted: reveal and resolve it when the opponent <b>attempts</b> a mission (at Send Leader to Oppose). Its assigned leaders (up to two) oppose that mission.",
          "It can be revealed even after you have passed, doesn't use up your turn, and can be combined with a leader from your pool, but only one Subversion per opposed mission. It can't be used against “resolve” missions. It never succeeds or fails.",
          "Leaders on a Subversion mission are unaffected by the Rebel <i>Misdirection</i> mission."
        ]) + "<h4>Sweep the Area & Secret Facility</h4>" + ul([
          "These action cards use probe cards the Empire has drawn and stay in play until the probe card is revealed and the ability resolved. They don't need their leader in the system.",
          "<i>Plant False Lead</i> can't touch a probe card held under them; once revealed, it rejoins the Empire's probe cards."
        ]) + "<h4>Errata</h4>" + ul([
          "Objective setup: the expansion's objective deck replaces the Rules Reference's setup step 4 (Prepare Objective Deck), but the Rebel player still draws an objective card during that step as normal.",
          "Jyn Erso's <i>Something to Fight For</i>: “After you win a battle” (not “a combat”).",
          "<i>Secret Facility</i>: “At the start of your turn”."
        ]) + "<h4>Other card rulings</h4>" + ul([
          "<i>Under the Radar</i>: all cards go on top or all on the bottom of the probe deck.",
          "<i>Baze's Loyalty</i>, like objectives, uses the units' printed health. If it removes every Imperial ground unit at the start of combat, there is no ground battle (no <i>Confrontation</i>, no “win a ground battle”), but the units still count toward “X-health destroyed in combat” objectives.",
          "<i>Confrontation</i>: a targeted leader may retreat but is still eliminated at the end of the Command Phase. If the Rebels use it to play <i>Escape Plan</i> as their additional card, they may retreat at once; all damage is removed from units that leave the combat, even lethal damage. <i>Tractor Beam</i> resolves after the retreat step and works however the Rebel ships left (retreat, destruction or <i>Escape Plan</i>), but it can't capture a leader who retreated. <i>Planetary Shield</i> may assign 3 damage to a Shield Generator that already has damage.",
          "<i>Sweep the Area</i>: as with <i>Collect Bounty</i>, a leader captured in a system that contains an Imperial unit stays in that system.",
          "<i>Target the Star Destroyers</i> happens before hit prevention; its hits can't be prevented by black-hit prevention, only by red.",
          "<i>Ambitions of Power</i> works even without Admiral Motti or Jabba the Hutt. A leader returned by <i>Track Them</i> during the Assignment Phase can still be assigned.",
          "Master Yoda and Millennium Falcon rings can't go on a leader with the Bounty ring.",
          "Dice-manipulating abilities (Master Yoda ring, <i>One in a Million</i>) work for <i>Discredit Rebellion</i> if their leader is in the mission's system."
        ]);
      },
      src: function () { return J("RotE p.2", "FAQ p.5", "FAQ p.6–8"); }
    },
    {
      title: "Card rulings — base game (FAQ)",
      when: function () { return true; },
      html: function (c) {
        return "<p>Official answers about specific base-game cards, A to Z.</p>" + ul([
          "<b><i>Boba Fett? Where?</i></b> doesn't stop the Rebels using attached rings. <i>Undercover</i> can move a leader out of that system but not into it.",
          "<b><i>Build Alliance</i></b> (and any mission) may be revealed even if it gives no benefit.",
          "<b><i>Build Super Star Destroyer</i>, <i>Support of Mon Calamari</i></b>: placing units on the build queue isn't stopped by sabotage.",
          "<b><i>Capture Rebel Operative</i>, <i>Collect Bounty</i></b> can't be attempted against a leader who is already captured or lured to the Dark Side. A leader taken by <i>Collect Bounty</i> in a system with an Imperial unit stays in that system.",
          "<b><i>Contingency Plan</i></b> can't add a second leader to the mission (it's used in the Command Phase). With <i>Rapid Mobilization</i> it resolves that card twice at the end of the Command Phase; if they had different numbers of leaders assigned, the Rebels choose the order.",
          "<b><i>Crippling Blow</i></b> counts the health printed on the faction sheet (an AT-AT destroyed with 2 damage after <i>Point Blank Assault</i> is still 3 health), and ground units lost with a transport destroyed in a destroyed system count. With <i>Rebel Assault</i> also possible, you can't wait: play an objective as soon as it is fulfilled.",
          "<b><i>Detained</i></b>: the detained leader works normally (skills, tactic values, retreating, blocking movement, action cards such as <i>Undercover</i>). A captured leader can't be detained, and capture ends detention. It may be revealed where the only Rebel leaders are captured, with no effect.",
          rote(c) ? "" : "<b><i>Escape Plan</i></b> (base tactic card) only lets the Rebels ignore transport restrictions in this round's retreat step; it needs Imperial units in the system and a Rebel leader there.",
          "<b><i>Fear Will Keep Them in Line</i>, <i>Superlaser Online</i></b> can't be used by a Death Star Under Construction. <i>Superlaser Online</i> wins if it destroys the hidden base's system, and may be resolved in an already destroyed system just for its loyalty.",
          "<b><i>Gather Intel</i></b> with the base revealed counts Rebel units in the base's system.",
          "<b><i>Independent Operation</i></b> (errata): the Imperial units can't move to a system with Rebel ground units; with no valid system it can't be used. It can't move captured leaders, though other Imperial cards that move units to an adjacent system may take them along under the normal movement rules.",
          "<b><i>It Is Your Destiny</i></b> captures only Rebel leaders. After a rescue it may capture a leader assigned to that mission, including one about to move to the base (the Empire decides after the Rebels choose who moves). If the rescue happened because a mission destroyed the last Imperial unit, the assigned leaders can't go to the base. The Millennium Falcon ring can't answer it.",
          "<b><i>Lead the Strike Team</i></b> can't move units off the “Rebel Base” space while a Rebel leader is there.",
          "<b><i>Long Range Probe</i></b> doesn't reveal the base.",
          "<b><i>Lure of the Dark Side</i></b>: the lured leader isn't a captured leader and can't use action cards.",
          "<b>Millennium Falcon</b> ring: rescues after all mission steps are complete, and before any combat the mission causes in that system. Leaders assigned to the mission may go to the base with the rescued leader; the ring's own leader only if it was assigned (and only then can <i>It Is Your Destiny</i> capture it). From the <i>Millennium Falcon</i> action card the ring can go on any leader shown on the card, but not on a leader wearing an Imperial ring.",
          "<b><i>One in a Million</i></b>: Luke or Wedge only needs to be in the system, not assigned, even without matching skills. It can give Death Star Plans an automatic direct hit.",
          "<b><i>Oversee Project</i></b>: speeds up a new Death Star only in the Death Star Under Construction's system; it deploys, so not in a sabotaged system; it may deploy into a remote system.",
          "<b><i>Plant False Lead</i></b>: the Empire sees the faces of the cards taken, then only how many go to the top and the bottom.",
          "<b>R2-D2 and Master Yoda</b> rings may be used after seeing both players' rolls; the Yoda ring can reroll a Death Star Plans die.",
          "<b><i>Regional Support</i></b> needs at least one Rebel loyalty in the region, so a region whose populous systems are all destroyed can't qualify.",
          "<b><i>Return of the Jedi</i></b> can be played if Vader or the Emperor retreats and the Rebels win the battle, but the retreated leader isn't eliminated. A captured or ringed Luke Skywalker (Jedi) still completes it (and keeps his ring). If Luke (Jedi) was lured to the Dark Side, it still works and may even eliminate Luke; but a Luke who retreated isn't in the system and eliminates no one.",
          "<b><i>Rogue Squadron Raid</i></b> can't target a Death Star on the build queue.",
          "<b><i>Seek Yoda</i></b> can be resolved in a destroyed Dagobah. With Luke and another leader assigned, Luke may become Luke Skywalker (Jedi) and the Yoda ring go on the other leader.",
          "<b><i>Stolen Plans</i>, <i>Lord Vader's Orders</i></b>: when the objective deck is rearranged, card backs stay open information."
        ]);
      },
      src: function () { return J("RR p.6", "RR p.11", "FAQ p.1–5"); }
    },
    {
      title: "Golden rules, limits & errata",
      when: function () { return true; },
      html: function (c) {
        return "<h4>Golden rules</h4>" + ul([
          "The Rules Reference beats the Learn to Play. A card beats the rules, but if both can be followed, follow both. “Cannot” on a card is absolute.",
          "When Rebel and Imperial abilities have the exact same timing, the Rebel one resolves first; a player orders his own simultaneous abilities.",
          "The <b>current player</b> is the one resolving his turn."
        ]) + "<h4>Component limits</h4>" + ul([
          "Dice: 5 black and 5 red per attack; missions: 10 in total" + (rote(c) ? "; plus at most 3 green" : "") + ". Leaders, rings and units are limited to those in the box; other markers aren't — use a substitute.",
          "<b>Units run out:</b> you can't build a unit type with none left in your supply. When placing units on your build queue in Refresh step 5, you may destroy one of your units on the board to build it, but only if none with that name is left in your supply (never the Empire's own Death Star). A card that lets you <i>gain</i> units you don't have lets you destroy your own units then to gain them.",
          "An empty deck: shuffle its discard pile (discards are faceup and open to everyone) into a new deck."
        ]) + "<h4>FAQ errata (base game)</h4>" + ul([
          "<i>Sabotage</i>: “Attempt in any populous system.”",
          "<i>Covert Operation</i>: “Attempt in any system that contains an Imperial unit.” (at least 1)",
          "Voluntary base reveal only at the start of a Rebel turn, before using a leader or passing.",
          "<i>Independent Operation</i>: Imperial units can't move to a system with Rebel ground units; with no valid system, the card can't be used now.",
          "Neutral systems: a system with no Rebel or Imperial loyalty marker is neutral, even if subjugated; Rebel starting units go to the “Rebel Base” space and/or one system without Imperial units."
        ]);
      },
      src: function (c) { return J("RR p.2", "RR p.6–7", "RR p.9", "FAQ p.1", "FAQ p.4–5", rote(c) && "RotE p.1"); }
    },
    {
      title: "First game notes",
      when: function (c) { return c.first; },
      html: function () {
        return ul([
          "Setup uses the fixed starting positions of LtP p.16, and the Rebel base must not be adjacent to any Imperial units.",
          "No starting action cards; recruiting ignores the action cards' abilities.",
          "<b>First Game Strategy</b> (read it aloud): the Rebels have far fewer units, but conquering the galaxy isn't their path to victory. Even with most of their units destroyed they can win by keeping the base hidden and gaining reputation from objectives.",
          "The Empire's goal is to find the base: draw lots of probe cards (intel missions) or conquer many systems hoping to find it.",
          "Once the base is found, the Death Star is the ultimate weapon. Early on it is nearly invincible; later, defend it with plenty of TIE Fighters.",
          "With 2 players you now know every rule you need; with more, also read the Team Game rules. Look up anything else in the Rules Reference."
        ]);
      },
      src: function () { return J("LtP p.5", "LtP p.16–17", "LtP p.20"); }
    }
  ];
})();

/* =============================================================================
   TEACHING SCRIPT — read aloud, ~5 minutes, for the configuration selected
   ============================================================================= */
SWR.teach = {
  intro: "A ~5-minute teach for the exact setup chosen above. Read it aloud, or copy it and adjust. It is written from the Learn to Play, the Rules Reference, the Rise of the Empire rulesheet and the FAQ, the same sources cited in the setup steps.",
  sections: [
    {
      h: "The hook — and how each side wins",
      body: function () {
        return "<p>This is the Galactic Civil War, and it's lopsided on purpose. The Empire has the fleets and the Death Star; the Rebels have a <b>secret base</b> and not much else. So each side wins differently.</p>" +
          "<p>The <b>Empire</b> wins the moment it <b>conquers the Rebel base</b>: Imperial units in its system and no Rebel units left. But first it has to find it.</p>" +
          "<p>The <b>Rebels</b> run out the clock. The <b>time marker</b> starts on space 1 and moves up every round; the <b>reputation marker</b> starts on 14. Each objective the Rebels complete pulls reputation toward time, and when the two meet, the Rebels win.</p>";
      }
    },
    {
      h: "The shape of a round",
      body: function (c) {
        return "<ul>" +
          "<li><b>Assignment:</b> Rebels first, we secretly put leaders on mission cards from our hands.</li>" +
          "<li><b>Command:</b> we take turns" + (c.team ? " in the initiative order on our faction sheets" : ", Rebels first") + ": reveal a mission, or send a leader to a system to move troops and fight. Pass when you're done.</li>" +
          "<li><b>Refresh:</b> leaders come home, we draw two missions each, the Empire draws two <b>probe cards</b>, each a system where the base is <b>not</b>, the Rebels draw an objective, and time ticks forward. Some time spaces let us <b>recruit</b> a leader (spaces 2 to 5) or <b>build</b> units from our systems (every even space up to 14).</li></ul>";
      }
    },
    {
      h: "Leaders are your actions",
      body: function () {
        return "<p>Each leader does <b>one thing a round</b>. On a mission, it's committed. Kept in your pool, it can <b>activate a system</b>, pulling your ships in from neighbouring systems with troops aboard, or it can <b>oppose</b> an enemy mission, or lead a battle.</p>" +
          "<p>A mission says <b>resolve</b>, which just happens, or <b>attempt</b>, which can be opposed: if an enemy leader comes, both sides roll a die per matching skill icon, and the player attempting it needs <b>more</b> successes. So every round asks: how many leaders do I commit, and how many do I hold back?</p>" +
          "<p>Rebels use missions for loyalty, sabotage and objectives; the Empire uses them to capture leaders, research projects and hunt the base. One warning: your units can't leave a system that holds one of your leaders.</p>";
      }
    },
    {
      h: "The central mechanic — the hunt",
      body: function () {
        return "<p>The base is a probe card hidden under the board. Every probe card the Empire draws rules out a system. When Imperial ground troops land somewhere, the Rebels must say if the base is there, and if it is, it's revealed.</p>" +
          "<p>Rebels, your weapon is misdirection: units on the “Rebel Base” space hide where they are, but every move in or out shows a system that is the base or next to it. Objectives say when they can be played; one per combat and one per Refresh Phase.</p>" +
          "<p>The Death Star can't be damaged; only the <b>Death Star Plans</b> objective destroys it. With <i>Superlaser Online</i> it can destroy a whole system, and destroying the base's system wins for the Empire even while the base is hidden.</p>";
      }
    },
    {
      h: "Fighting",
      body: function (c) {
        var base = "<p>When you move into a system with enemy units, a side with no leader there may add one from its pool, then every combat round has a <b>space battle</b> if both sides have ships there and a <b>ground battle</b> if both have ground units. Roll the black and red dice on your units, five of each at most. A <b>hit</b> only damages a unit whose health matches the die's colour; a <b>direct hit</b> damages anything. ";
        if (c.has("rote")) {
          return base + "Either side may retreat after each round, if it has a leader there.</p>" +
            "<p>Rise of the Empire uses <b>Cinematic Combat</b>: we each have our own tactic decks, and before every round of battle we secretly pick a card, reveal together, and use its top or bottom half. Tactic values give <b>rerolls</b>, a <b>special</b> removes damage from your unit, and units die at the end of each round of battle.</p>";
        }
        return base + "A <b>special</b> draws or plays a <b>tactic card</b>; your leader's tactic values set how many you draw at the start. Either side may retreat after each round, if it has a leader there.</p>";
      }
    },
    { when: function (c) { return c.first; },
      h: "This is a first game",
      body: function () {
        return "<p>We use the Learn to Play's fixed starting positions, and the base isn't next to any Imperial units. Action cards only recruit leaders tonight; we ignore their abilities. I'll read the First Game Strategy before we start.</p>";
      }
    },
    { when: function (c) { return !c.first; },
      h: "The full game",
      body: function (c) {
        return "<p>Starting loyalty came from the probe deck and we placed our own units. Each " + (c.team ? "team" : "of you") + " has <b>two secret starting action cards</b>: once-per-game tricks for your leaders, used when the card says. When you recruit, you keep the card you chose.</p>";
      }
    },
    { when: function (c) { return c.p === 4; },
      h: "Four players — two teams",
      body: function () {
        return "<p>We're playing in teams. The <b>Admiral</b> has the blue leaders, space battles, recruiting and building; the <b>General</b> has the orange leaders, ground battles and the mission hand, plus the probe cards or the objectives. Talk freely, but openly at the table.</p>";
      }
    },
    { when: function (c) { return c.p === 3; },
      h: "Three players",
      body: function () {
        return "<p>One player is the whole Rebellion and takes <b>two turns</b> a round, one with the blue leaders and one with the orange. The Empire splits: the <b>Admiral</b> has the blue leaders, space battles, recruiting and building; the <b>General</b> the orange leaders, ground battles, missions and probes. Talk openly at the table.</p>";
      }
    },
    { when: function (c) { return c.has("rote"); },
      h: "Rise of the Empire",
      body: function (c) {
        return "<p>New leaders and units arrive. <b>Green dice</b> carry only direct hits; each small <b>minor skill</b> icon adds a green die in missions. <b>Target markers</b> can be removed by having ground units there and the enemy none; <b>Immediate</b> objectives resolve when drawn; " + (c.team ? "each team keeps at most <b>eight leaders</b>" : "a leader pool holds at most <b>eight leaders</b>") + ". Beware the Imperial <b>Shield Bunker</b>, which shields a Death Star from the plans, and the <b>Interdictor</b>, which stops Rebel retreats.</p>";
      }
    },
    { when: function (c) { return c.mod("roteunits"); },
      h: "The Rise of the Empire start",
      body: function () {
        return "<p>The Death Star is still <b>under construction</b> in a remote system, and the finished one waits on space 3 of the build queue. Destroy the one under construction and the queued one goes too.</p>";
      }
    },
    { when: function (c) { return c.has("rote") && c.mod("rotefirst"); },
      h: "Mission cards",
      body: function () {
        return "<p>Both mission decks use only the cards with a Darth Vader icon or a leader icon: the Rise of the Empire set.</p>";
      }
    },
    { when: function (c) { return c.has("rote") && !c.mod("rotefirst"); },
      h: "Mission cards",
      body: function (c) {
        return "<p>Each " + (c.team ? "team's General" : "of you") + " revealed a mission card to choose a mission set: a Darth Vader icon means the Rise of the Empire set, anything else the base set.</p>";
      }
    },
    {
      h: "Don't worry about these until they come up",
      body: function (c) {
        var a = [
          "Captured leaders, and attachment rings: the card that attaches a ring explains it.",
          "Moving the base, a second Death Star, destroyed systems and sabotage.",
          "Structures: the Shield Generator and Ion Cannon abilities are on the faction sheet."
        ];
        if (c.has("rote")) a.push("Subversion missions, canceling tactic cards, <i>Sweep the Area</i> and <i>Secret Facility</i>, and structures, which now survive a round if their owner rolled any dice in that battle.");
        if (c.team) a.push("<i>Lure of the Dark Side</i>, which turns a Rebel leader Imperial.");
        return "<ul>" + a.map(function (x) { return "<li>" + x + "</li>"; }).join("") + "</ul>";
      }
    }
  ]
};
