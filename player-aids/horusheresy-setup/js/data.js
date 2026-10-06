/* =============================================================================
   Horus Heresy (Fantasy Flight Games, 2010) — Setup & Reference Utility · data
   Sources (citations use PRINTED page numbers, which equal the PDF page numbers):
     Rules     — Horus Heresy "Rules of Play" rulebook (this edition © 2010 per its p.42; PDF dated 2009–10; 44 pp)
     Scenarios — the Scenario Guide booklet (a 20-page scan: the six scenarios p.3–10, "The Siege of Terra" p.11–20)
     FAQ       — Horus Heresy FAQ and Errata, Version 1.0 (updated 7/13/2010, 3 pp)
   Precedence: the FAQ's errata and rulings override both books (applied throughout; the one that bears on scenario
   setup, that the Traitor may execute his setup orders on his first turn, FAQ p.2, is in the order card setup step).
   c = { mode, scen, first, seat, mod(id), has(id) } — see js/app.js. scen is "bab" (Brother Against Brother)
   unless mode is "veteran", when it is the scenario picked in the configurator.
   ============================================================================= */
var HH = {};

/* ---- step tags: who carries the step out ---------------------------------- */
HH.tagMeta = {
  table: { name: "Table",          cls: "tag-table" },
  both:  { name: "Both players",   cls: "tag-both" },
  imp:   { name: "Imperial",       cls: "tag-imp" },
  trt:   { name: "Traitor",        cls: "tag-trt" },
  first: { name: "First game",     cls: "tag-first" },
  opt:   { name: "Optional",       cls: "tag-opt" }
};

/* ---- configurator ----------------------------------------------------------- */
HH.modes = [
  { id: "first", name: "First game for both of you",
    blurb: "“Brother Against Brother”, the learning scenario. Choose sides at random or by agreement." },
  { id: "mentor", name: "Teaching a new player",
    blurb: "“Brother Against Brother”, with the experienced player on the Traitor side." },
  { id: "veteran", name: "Two experienced players",
    blurb: "Any of the six scenarios: pick it below. Settle scenario and sides by one of the rulebook’s three methods." }
];

/* the Scenario Guide's six scenarios (Scenarios p.2–10). corr / bomb = the Traitor's corruption draws and orbital
   bombardments at setup; imp = impassible areas (p.7); tok = special tokens (p.8). */
HH.scenarios = [
  { id: "bab", n: 1, name: "Brother Against Brother", pg: "p.3–5", corr: 12, bomb: 4,
    blurb: "The introductory scenario: everything starts where the book’s setup diagram shows (Scenarios p.3–5).",
    premise: "Well balanced, with a roughly historical setup: a complete unit setup and an event deck that is both simple and fair. The book highly recommends it as new players’ first game." },
  { id: "hu", n: 2, name: "Heresy Unheralded", pg: "p.6", corr: 12, bomb: 4,
    blurb: "Like Brother Against Brother, but both sides choose how to deploy (Scenarios p.6).",
    premise: "Like the strictly historical Brother Against Brother, but both players make more choices about how their starting forces are arrayed. Not recommended for first-time players: good choices need a feel for what the units can do." },
  { id: "hta", n: 3, name: "Holy Terra Asunder", pg: "p.7", corr: 8, bomb: 6, imp: true,
    blurb: "Four impassible areas, and a battlefield that changes as you play (Scenarios p.7).",
    premise: "The invaders’ bombardments have wracked Holy Terra almost beyond recognition. The battlefield itself changes over the course of the game, and both players must adapt to it." },
  { id: "ffb", n: 4, name: "Fortune Favors the Bold", pg: "p.8", corr: 12, bomb: 4, tok: true,
    blurb: "Special tokens cut initiative costs, and the Imperial hold-out victory is imperiled (Scenarios p.8).",
    premise: "Events give both players chances to do more: place more orders and push their units further and harder. The Imperial victory by holding out is imperiled, and late events throw the Emperor and Horus closer together, for a wider-ranging, more dynamic game." },
  { id: "lug", n: 5, name: "Like Unto Gods", pg: "p.9", corr: 12, bomb: 4,
    blurb: "Each of you picks event cards for the deck, four extra starting orders and the freest deployment (Scenarios p.9).",
    premise: "The most latitude: each player contributes event cards of his choice, deploys with the greatest freedom and picks extra starting orders. Setup takes a bit longer than usual." },
  { id: "cha", n: 6, name: "Cry Havoc", pg: "p.10", corr: 8, bomb: 4, imp: true, tok: true,
    blurb: "Everything at once: impassible areas, special tokens and ten random events (Scenarios p.10).",
    premise: "Everything in the box, in a massive free-for-all where just about anything can happen. Great fun for some, but the book warns that such anarchy is not to every player’s taste." }
];
HH.sc = function (c) {
  for (var i = 0; i < HH.scenarios.length; i++) if (HH.scenarios[i].id === c.scen) return HH.scenarios[i];
  return HH.scenarios[0];
};

HH.pieces = [
  { id: "assemble", name: "First time out of the box",
    blurb: "Assemble every playing piece and Hero marker before setting up." },
  { id: "ready", name: "Pieces already assembled",
    blurb: "Just put last game’s Traitor Armies and Tank Divisions back on gray bases." }
];

HH.seats = [
  { id: "both", name: "Both players", blurb: "One screen for the table: both sides’ tasks shown alike." },
  { id: "imp",  name: "Imperial player", blurb: "Defend Terra. Your tasks are marked “you”." },
  { id: "trt",  name: "Traitor player",  blurb: "Lead Horus’s assault. Your tasks are marked “you”." }
];

HH.modules = [
  { id: "rotate", name: "Rotate newly placed orders",
    summary: "Turn each order 90° as it goes on the strategic map; straighten them all at each change of initiative",
    description: "The rulebook’s memory aid for the rule that orders placed since the last change of initiative can’t be executed yet.",
    src: "Rules p.19" },
  { id: "pending", name: "Mark pending phase icons",
    summary: "Drop a spare token on each special-phase icon a marker crosses until that phase is resolved",
    description: "The rulebook’s suggestion for not losing track of which special phases are still to resolve.",
    src: "Rules p.15" },
  { id: "tuck", name: "Tuck your reserve under the board",
    summary: "Slide recycled orders halfway under the board so they aren’t mixed up with cards in play",
    description: "The rulebook’s tip for keeping each player’s reserve separate from cards being executed.",
    src: "Rules p.20" }
];

/* ---- helpers ------------------------------------------------------------------ */
HH.sideName = { imp: "Imperial", trt: "Traitor" };
// A bullet that belongs to one side; marked "you" when that side is the selected seat.
HH.li = function (c, s, html) {
  var mine = c.seat === s, theirs = c.seat !== "both" && c.seat !== s;
  return "<li class='side side-" + s + (mine ? " mine" : "") + (theirs ? " theirs" : "") + "'>" +
    "<span class='who who-" + s + "'>" + HH.sideName[s] + (mine ? " · you" : "") + "</span> " + html + "</li>";
};

// Initiative track as pictured on the game board (Rules p.14 strip = spaces 1–19; p.38 board = all 34).
HH.track = ["start", "", "E", "", "", "E", "O", "", "E", "R", "", "E", "O", "", "E", "R", "S", "E", "O", "",
            "E", "R", "", "E", "O", "", "E", "R", "", "E", "O", "R", "", "V"];
HH.trackLabel = { start: "Start", E: "Event", O: "Draw orders", R: "Refresh", S: "Spaceport victory possible", V: "Imperial victory", "": "" };
HH.trackHtml = function () {
  return "<ol class='itrack' aria-label='Initiative track, 34 spaces'>" + HH.track.map(function (k, i) {
    var cls = { start: "start", E: "ev", O: "or", R: "rf", S: "sp", V: "iv", "": "blank" }[k];
    var lab = HH.trackLabel[k];
    return "<li class='it it-" + cls + "'><span class='it-n'>" + (i + 1) + "</span><span class='it-l'>" +
      (lab || "<span class='vh'>no icon</span>") + "</span></li>";
  }).join("") + "</ol>";
};

// Citation for the selected table aids, e.g. "Rules p.15, p.19"
HH.aidSrc = function (c) {
  var pg = [c.mod("pending") ? "p.15" : "", c.mod("rotate") ? "p.19" : "", c.mod("tuck") ? "p.20" : ""].filter(Boolean);
  return pg.length ? "Rules " + pg.join(", ") : "";
};

HH.heroTrackHtml = function () {
  var cells = ["<li class='ht ht-start'><span class='ht-n'>0</span><span class='ht-l'>Start</span></li>"];
  for (var i = 1; i <= 10; i++) {
    var cls = i <= 5 ? "ht-ok" : (i < 10 ? "ht-wd" : "ht-dead");
    var lab = i <= 5 ? "Unwounded" : (i === 6 ? "Wounded" : (i < 10 ? "Wounded" : "Defeated"));
    cells.push("<li class='ht " + cls + "'><span class='ht-n'>" + i + "</span><span class='ht-l'>" + lab + "</span></li>");
  }
  return "<ol class='htrack' aria-label='Hero damage track: damage points and state'>" + cells.join("") + "</ol>";
};

/* ---- scenario helpers (Scenario Guide) ------------------------------------------------- */
HH.scIs = function (c) { var ids = [].slice.call(arguments, 1); return ids.indexOf(c.scen) !== -1; };
// The page that holds the chosen scenario's setup text, and the citation for steps that follow it
HH.scPage = function (c) { return c.scen === "bab" ? "p.3" : HH.sc(c).pg; };
// Unit setup: Heresy Unheralded's procedure (p.6) is reused by scenarios 3–6; Cry Havoc takes its impassible areas from p.7
HH.huSrc = function (c, rules) {
  return "Scenarios " + ({ hu: "p.6", hta: "p.7, p.6", ffb: "p.8, p.6", lug: "p.9, p.6", cha: "p.10, p.6–7" })[c.scen] + " · Rules " + rules;
};

// Event decks built act by act (Scenarios p.3, p.6, p.7, p.8). use = how many random cards of the list; 0 = all.
HH.evActs = {
  bab: [ { use: 0, cards: ["Apocalypse Rains Down", "The Righteous Heed the Call", "Tendrils of the Traitor", "The Vicissitudes of Chaos"] },
         { use: 0, cards: ["Apocalypse Rains Down", "Command Decisions (×2)", "The Sky Fortress Rises"] },
         { use: 0, cards: ["Titans Stride the Earth (×2)"] } ],
  hta: [ { use: 3, cards: ["Apocalypse Rains Down", "Cyclones Rage and the Air Itself Burns", "Doom Flies Astray", "Lava Boils and Terra is Torn Asunder"] },
         { use: 5, cards: ["An Unholy Portal is Opened", "Apocalypse Rains Down", "Blocked With Corpses", "Command Decisions", "The Sky Fortress Rises", "The Unwavering Will to Act"] },
         { use: 0, cards: ["Titans Stride the Earth (×2)"] } ],
  ffb: [ { use: 3, cards: ["Command Decisions (×2)", "The Strength of Conviction", "The Unwavering Will to Act"] },
         { use: 2, cards: ["Horus’s Irresistible Gambit", "The Strength of Conviction", "The Warp Claims a Mighty Armada"] },
         { use: 5, cards: ["An Unholy Portal is Opened", "The Sky Fortress Rises", "Thrown to Terra by his Mighty Hand", "Titans Stride the Earth", "The Unwavering Will to Act (×3)"] } ]
};
HH.evActs.hu = HH.evActs.bab;   // identical lists (Scenarios p.6)
HH.evCount = function (cards) {
  return cards.reduce(function (n, x) { var m = x.match(/\(×(\d+)\)/); return n + (m ? +m[1] : 1); }, 0);
};
HH.evHtml = function (c) {
  if (c.scen === "cha") {
    return "<ul><li>Shuffle <b>all 30 event cards</b> together and deal <b>10</b> of them into a facedown pile: that pile is the event deck.</li>" +
      "<li>The other 20 aren’t used this game. The event deck is <b>never reshuffled</b>.</li></ul>";
  }
  if (c.scen === "lug") {
    return "<p>Like Unto Gods builds its three acts its own way:</p><ol>" +
      "<li><b>Share out the event cards.</b><ul>" +
        HH.li(c, "imp", "takes Blocked With Corpses, Cyclones Rage and the Air Itself Burns, Doom Flies Astray, Lava Boils and Terra is Torn Asunder, The Righteous Heed the Call, The Sky Fortress Rises (×2) and The Vicissitudes of Chaos (×2): 9 cards.") +
        HH.li(c, "trt", "takes Apocalypse Rains Down (×2), Tendrils of the Traitor (×2), A Traitor Within the Walls (×2) and An Unholy Portal is Opened (×2): 8 cards.") +
        "<li><b>Not used:</b> The Warp Claims a Mighty Armada, Horus’s Irresistible Gambit and Thrown to Terra by his Mighty Hand.</li>" +
        "<li><b>Neutral pile:</b> shuffle the remaining 10 facedown: Command Decisions (×2), The Strength of Conviction (×2), Titans Stride the Earth (×2) and The Unwavering Will to Act (×4).</li></ul></li>" +
      "<li><b>Choose.</b> Each player, choosing freely from his own cards, puts <b>2</b> facedown in the <b>Act I</b> pile, <b>2</b> in the <b>Act II</b> pile and <b>1</b> in the <b>Act III</b> pile. Return the unchosen cards to the box facedown.</li>" +
      "<li><b>Add neutral cards.</b> Add 2 random cards from the top of the neutral pile to Act I and 2 to Act II. Return the rest of the neutral pile to the box facedown.</li>" +
      "<li><b>Shuffle</b> each of the three act piles separately.</li>" +
      "<li><b>Trim.</b> Discard 2 random cards to the box, facedown, from Act I and 2 from Act II.</li>" +
      "<li><b>Stack</b> the three piles together to form the event deck, Act I on top as the rulebook stacks acts: 10 cards (4 + 4 + 2). It is <b>never reshuffled</b>.</li></ol>";
  }
  var acts = HH.evActs[c.scen], names = ["Act I", "Act II", "Act III"], total = 0, random = false;
  var rows = acts.map(function (a, i) {
    var n = HH.evCount(a.cards);
    total += a.use || n;
    if (a.use) random = true;
    return "<tr><th scope='row'>" + names[i] + "</th><td>" + (a.use ? "<b>" + a.use + " random</b> of these " + n + ": " : "<b>All " + n + "</b>: ") +
      a.cards.join(", ") + "</td></tr>";
  }).join("");
  return "<ul><li>For each act, find the cards listed and shuffle them facedown." +
    (random ? " Where only some are used, keep that many and return the rest to the box without looking at them." : "") + "</li></ul>" +
    "<div class='tbl-wrap'><table class='mini'><caption>Event cards by act</caption>" +
    "<thead><tr><th scope='col'>Act</th><th scope='col'>Cards</th></tr></thead><tbody>" + rows + "</tbody></table></div>" +
    "<ul><li>Stack the piles with <b>Act I on top</b>, then Act II, then Act III: a <b>" + total + "-card</b> event deck.</li>" +
    "<li>Event cards not selected aren’t part of this game’s event deck. The deck is <b>never reshuffled</b>: it holds exactly as many cards as the game can need.</li></ul>";
};

// "Brother Against Brother" setup diagram (Scenarios p.4–5), cropped from the scan at its native resolution.
HH.fig = function (file, w, h, alt, cap) {
  return "<figure class='scen-fig'><a href='images/" + file + "' target='_blank' rel='noopener' title='Open the diagram full size'>" +
    "<img src='images/" + file + "' width='" + w + "' height='" + h + "' alt='" + alt + "' loading='lazy' decoding='async'></a>" +
    "<figcaption>" + cap + "</figcaption></figure>";
};
HH.babFigs = function () {
  return HH.fig("scen-bab-terra.webp", 1139, 1272,
      "Brother Against Brother setup diagram for Terra: a labelled group of units, Heroes and defense lasers for each starting area, with a line to that area. The next two steps list them.",
      "<b>Terra</b> · Scenarios p.4 · blue labels are Imperial, red labels Traitor. Tap a diagram to open it full size.") +
    HH.fig("scen-bab-vs.webp", 1160, 494, "Brother Against Brother setup diagram for the Vengeful Spirit, listed in the Traitor step below.",
      "<b>The Vengeful Spirit</b> · Scenarios p.5") +
    HH.fig("scen-bab-palace.webp", 1160, 655, "Brother Against Brother setup diagram for the Palace, listed in the Imperial step below.",
      "<b>The Palace</b> · Scenarios p.5");
};
HH.areaTable = function (cap, rows, cls) {
  return "<div class='tbl-wrap'><table class='mini areas" + (cls ? " " + cls : "") + "'><caption>" + cap + "</caption>" +
    "<thead><tr><th scope='col'>Area</th><th scope='col'>Starts with</th></tr></thead><tbody>" +
    rows.map(function (r) { return "<tr><th scope='row'>" + r[0] + "</th><td>" + r[1] + "</td></tr>"; }).join("") + "</tbody></table></div>";
};

/* =============================================================================
   SETUP — phases and steps (rulebook order: First Game Setup p.10–11, then Setup steps 1–8, p.12–13)
   ============================================================================= */
HH.phases = [
  {
    title: "Before you set up",
    steps: [
      { when: (c) => c.first, who: "first",
        t: "Assemble the playing pieces",
        d: (c) => "<ul>" +
          "<li>Push each <b>figure</b> onto a <b>base</b> of the rank below. The points on a base are the unit’s <b>combat rank</b> (I–IV). Gray bases are Imperial, black bases are Traitor.</li>" +
          "<li><b>Space Marines</b> and <b>Chaos Space Marines</b> also take their <b>legion designator</b> disc between figure and base.</li>" +
          "<li>Slot each of the 10 <b>Hero markers</b> into a clear Hero base. Heroes can stay in their bases between games.</li></ul>" +
          "<div class='tbl-wrap'><table class='mini'><caption>Playing piece assembly</caption>" +
          "<thead><tr><th scope='col'>Imperial unit (gray base)</th><th scope='col'>Rank</th><th scope='col'>Traitor unit (black base)</th><th scope='col'>Rank</th></tr></thead><tbody>" +
          "<tr><td>Imperial Army</td><td>I</td><td>Chaos Cultists</td><td>I</td></tr>" +
          "<tr><td>Imperial Tank Division</td><td>II</td><td>Chaos Thunderhawk Flight</td><td>II</td></tr>" +
          "<tr><td>Adeptus Arbites</td><td>II</td><td>Chaos Warband</td><td>II</td></tr>" +
          "<tr><td>Adeptus Mechanicus</td><td>II</td><td>Chaos Space Marines: World Eaters, Death Guard, Thousand Sons, Emperor’s Children</td><td>III</td></tr>" +
          "<tr><td>Space Marines: Blood Angels, Imperial Fists, White Scars</td><td>III</td><td>Daemon Horde</td><td>III</td></tr>" +
          "<tr><td>Adeptus Custodes</td><td>IV</td><td>Chaos Titan</td><td>IV</td></tr>" +
          "<tr><td>Imperial Titan</td><td>IV</td><td></td><td></td></tr></tbody></table></div>" +
          "<ul><li>Traitor figures come in four colours: <b>red</b> Khorne, <b>green</b> Nurgle, <b>blue</b> Tzeentch and <b>purple</b> Slaanesh. Every colour of a unit type takes the same rank.</li>" +
          "<li>Left over: <b>8 black rank I</b> and <b>4 black rank II</b> bases. These are the Traitor’s spares for turning Imperial Armies and Tank Divisions into Traitor units.</li></ul>",
        src: "Rules p.10–11 · p.5, p.7–8" },
      { when: (c) => !c.first, who: "both",
        t: "Reset from your last game",
        d: "<ul><li>Units can stay assembled between games.</li>" +
          "<li>Put any <b>Traitor Armies</b> and <b>Traitor Tank Divisions</b> back on <b>gray Imperial bases</b> before the new game. That frees the Traitor’s 12 spare black bases (8 rank I, 4 rank II) again.</li></ul>",
        src: "Rules p.11 · p.37" }
    ]
  },
  {
    title: "Scenario, board & components (rulebook setup steps 1–3)",
    steps: [
      { when: () => true, who: "both",
        t: "Choose the scenario and sides",
        d: (c) => {
          var s = HH.sc(c), d = "<ul>";
          if (c.mode === "first") {
            d += "<li>Play <b>“Brother Against Brother”</b> (Scenarios p.3). The rulebook highly recommends it for first-time players; it is meant to introduce the game. The Scenario Guide calls it well balanced and roughly historical, with a complete unit setup and a simple, fair event deck.</li>" +
                 "<li>Choose sides <b>at random</b> or <b>by agreement</b>.</li>";
          } else if (c.mode === "mentor") {
            d += "<li>The rulebook recommends <b>“Brother Against Brother”</b> (Scenarios p.3), the introductory scenario…</li>" +
                 "<li>…with the <b>experienced player controlling the Traitor</b>, so the new player commands the Imperium.</li>";
          } else {
            d += "<li>Choose a scenario and sides by one of three methods:<ol>" +
                 "<li><b>Agree the scenario, draw for sides.</b> Shuffle the bombardment deck, pick one player and reveal the top card. An <b>Imperial Eagle</b> makes that player Imperial; a <b>Chaos Star</b> makes him the Traitor.</li>" +
                 "<li><b>Flip a coin.</b> The winner chooses any scenario; the loser then chooses which side to control.</li>" +
                 "<li><b>Simply agree</b> on a scenario and sides.</li></ol></li>" +
                 "<li>This page is set to <b>Scenario " + s.n + ": “" + s.name + "”</b> (Scenarios " + s.pg + "). " + s.premise + " Pick another under Scenario, above.</li>";
          }
          d += "<li>The Scenario Guide’s six scenarios each have their own unit setup, event deck, corruption and bombardment; the steps below are this scenario’s. The rulebook’s general setup still applies, and every scenario uses the rulebook’s victory conditions.</li></ul>";
          return d;
        },
        src: (c) => "Rules p.12 · p.9 · Scenarios p.2" + (c.mode === "veteran" && c.scen !== "bab" ? ", " + HH.sc(c).pg : ", p.3") },
      { when: () => true, who: "table",
        t: "Assemble the board",
        d: "<ul><li>Lay the plastic <b>fortifications</b> (<b>3 factories, 6 fortresses and the palace</b>) on the table in the rough arrangement shown in the rulebook’s diagram, matching the holes in the board.</li>" +
          "<li>Lower the unfolded board onto them, lining each one up with its hole. The board should lie flat with the fortifications protruding through it. Factories and fortresses are interchangeable with others of their type.</li>" +
          "<li>The board has the <b>main map board</b> (Terra, plus Horus’s flagship the <b>Vengeful Spirit</b>), the <b>strategic map</b>, and record-keeping tracks.</li></ul>",
        src: "Rules p.12 · p.3" },
      { when: () => true, who: "both",
        t: "General component setup",
        d: (c) => "<ul>" +
          "<li>Each player takes a <b>reference sheet</b> (it lists his Heroes’ abilities and his units’ special abilities) and the <b>playing pieces</b> for his side.</li>" +
          HH.li(c, "imp", "also takes the <b>6 defense lasers</b> and his 5 Heroes: <b>the Emperor, Rogal Dorn, Jaghatai Khan, Sanguinius</b> and <b>the Fabricator General</b>.") +
          HH.li(c, "trt", "also takes the <b>extra bases</b> used to turn Imperial Armies and Tank Divisions into Traitor units (8 black rank I, 4 black rank II), and his 5 Heroes: <b>Horus, Angron, Fulgrim, Mortarion</b> and <b>Magnus the Red</b>.") +
          "<li>Put all <b>Hero damage markers</b> on the first space of the <b>Hero damage track</b> (it is double width so they all fit).</li>" +
          "<li>Each player shuffles his own <b>combat deck</b> and <b>Hero combat deck</b> and puts them facedown near himself.</li>" +
          "<li>Shuffle the <b>bombardment deck</b> and place it facedown within reach of both players.</li>" +
          "<li>Put both <b>initiative markers</b> on the first space of the <b>initiative track</b>, with the <b>Traitor marker on top</b> of the Imperial marker.</li>" +
          "<li>Place the remaining markers and tokens within reach of both players.</li>" +
          "<li>Each player takes his <b>order deck</b> but sets it aside until order card setup.</li></ul>",
        src: "Rules p.12 · p.3, p.5, p.11, p.32" },
      { when: (c) => HH.scIs(c, "hta", "cha"), who: "both",
        t: "Mark four impassible areas",
        d: (c) => "<ul>" +
          "<li>After general component setup, the players take turns rendering <b>four areas impassible</b>:</li>" +
          HH.li(c, "trt", "chooses the first area; then the players alternate until four have been chosen.") +
          "<li>Mark each one with a <b>special token</b>.</li>" +
          "<li>No two impassible areas may be <b>adjacent</b> to each other.</li>" +
          "<li><b>Never impassible:</b> the Inner Palace, the four spaceports and the two areas of the Vengeful Spirit. Any other area is fair game.</li>" +
          "<li>An impassible area can’t be entered by units or Heroes, can’t be the target of a bombardment and can’t be the subject of any game effect at all. As far as the game is concerned, it doesn’t exist.</li>" +
          (c.scen === "cha" ? "<li>Cry Havoc uses Holy Terra Asunder’s procedure, and these areas work the same way.</li>" : "") + "</ul>",
        src: (c) => c.scen === "cha" ? "Scenarios p.10, p.7" : "Scenarios p.7" },
      { when: (c) => HH.scIs(c, "ffb", "cha"), who: "both",
        t: "Take three special tokens each",
        d: (c) => "<ul>" +
          "<li>Each player takes <b>3 special tokens</b>." +
          (c.scen === "cha" ? " Keep them apart from the impassible-area markers: in Cry Havoc special tokens have two different uses, and they aren’t interchangeable." : "") + "</li>" +
          "<li>Whenever you <b>place</b> one of your orders on the strategic map, <b>execute</b> one of your orders from the strategic map, or <b>execute</b> one from your hand, you may spend <b>one</b> token (never more) to reduce that placement’s or execution’s initiative cost by 1, to a minimum of 0.</li>" +
          "<li>A spent token is removed from play for the rest of the game.</li></ul>",
        src: (c) => c.scen === "cha" ? "Scenarios p.10, p.8" : "Scenarios p.8" }
    ]
  },
  {
    title: (c) => "Scenario setup: " + HH.sc(c).name + " (rulebook steps 4–8)",
    steps: [
      /* ---- unit setup: Brother Against Brother's diagram (Scenarios p.3–5) ---- */
      { when: (c) => c.scen === "bab", who: "both",
        t: "Unit setup: the setup diagram",
        d: (c) => "<ul><li>Both players place their starting units, Heroes and defense lasers exactly as the <b>“Brother Against Brother” setup diagram</b> shows. The next two steps list each side’s pieces area by area.</li></ul>" +
          HH.babFigs(),
        src: "Scenarios p.3–5 · Rules p.12" },
      { when: (c) => c.scen === "bab", who: "imp",
        t: "Unit setup: Imperial forces",
        d: (c) => "<ul>" + HH.li(c, "imp", "places all 5 of his Heroes, all 6 defense lasers and these units (the diagram’s blue labels).") + "</ul>" +
          HH.areaTable("The Palace (Scenarios p.5)", [
            ["Inner Palace", "<b>the Emperor</b>, 3 Adeptus Custodes"],
            ["Imperial Fists Fortress Monastery", "<b>Rogal Dorn</b>, 3 Imperial Fists Space Marines, defense laser"],
            ["Forbidden Fortress", "<b>Sanguinius</b>, 3 Blood Angels Space Marines, defense laser"],
            ["Outer Palace, north-west", "Adeptus Arbites, 1 Blood Angels Space Marines, defense laser"],
            ["Outer Palace, north-east", "Adeptus Arbites"],
            ["Outer Palace, south-east", "Adeptus Arbites"],
            ["Outer Palace, south-west", "1 Imperial Fists Space Marines"]]) +
          HH.areaTable("Terra: named areas (Scenarios p.4)", [
            ["Librarium Technologicus", "<b>Jaghatai Khan</b>, 2 White Scars Space Marines, 1 Imperial Army"],
            ["Fortress of Truth", "2 White Scars Space Marines, 1 Imperial Army, defense laser"],
            ["Tower of Shadows", "2 Imperial Armies, defense laser"],
            ["The Black Ministry", "2 Imperial Armies, defense laser"],
            ["Citadel of Justice", "1 Imperial Army"],
            ["Bastion Eternal", "1 Imperial Army"],
            ["Volcanus Factory Complex", "<b>the Fabricator General</b>, Adeptus Mechanicus"],
            ["Crucible Factory Complex", "Adeptus Mechanicus"],
            ["Factory north-east of the Palace", "Adeptus Mechanicus"],
            ["Lions Gate Spaceport", "3 Imperial Armies, 1 Imperial Tank Division"],
            ["Spaceport Damocles", "3 Imperial Armies, 1 Imperial Tank Division"]]) +
          HH.areaTable("Terra: open areas (Scenarios p.4, follow the diagram)", [
            ["South of Spaceport Primus, west of the Volcanus Factory Complex", "2 Imperial Titans, 2 Imperial Tank Divisions"],
            ["East of the factory north-east of the Palace, north of Lions Gate Spaceport", "1 Imperial Titan, 1 Imperial Army"],
            ["South-west of the Palace, between Eternity Wall Spaceport and the Librarium Technologicus", "1 Imperial Army, 2 Imperial Tank Divisions"],
            ["The two areas just north of Spaceport Primus, between the Fortress of Truth and the Librarium Technologicus (a white line running north from the spaceport divides them)", "1 Imperial Army in each"],
            ["Just south of the Palace, below its south-west Outer Palace (west of the white line that runs south from the Palace)", "1 Imperial Army"],
            ["South-east of the Palace: just south of the Forbidden Fortress (the Palace’s east end) and south-west of Lions Gate Spaceport", "1 Imperial Army"]], "open") +
          "<ul><li>That is 20 of the 24 Imperial Armies, 6 of the 12 Tank Divisions and every other Imperial unit. The other <b>4 Imperial Armies</b> and <b>6 Tank Divisions</b> form the Imperial <b>stockpile</b>.</li>" +
          "<li class='note'>The diagram points at areas without naming them. The names here are the board’s, as the rulebook pictures it (Rules p.4, p.33, p.38). Open areas have no names, and the factory north-east of the Palace has a label too small to read in the rulebook’s pictures, so those are given by position.</li></ul>",
        src: "Scenarios p.4–5 · Rules p.4, p.33, p.38" },
      { when: (c) => c.scen === "bab", who: "trt",
        t: "Unit setup: Traitor forces",
        d: (c) => "<ul>" + HH.li(c, "trt", "places Horus, Mortarion, Angron and these 13 units (the diagram’s red labels).") + "</ul>" +
          HH.areaTable("The Vengeful Spirit (Scenarios p.5) and Terra (p.4)", [
            ["Vengeful Spirit Command Center", "<b>Horus</b>, 2 Daemon Hordes (Slaanesh, purple), Emperor’s Children Chaos Space Marines"],
            ["Vengeful Spirit Catacombs", "2 Chaos Warbands (Slaanesh, purple), 1 Chaos Warband (Tzeentch, blue), 1 Daemon Horde (Nurgle, green)"],
            ["Eternity Wall Spaceport", "<b>Mortarion</b>, Death Guard Chaos Space Marines, Chaos Titan (Nurgle, green), Chaos Warband (Nurgle, green)"],
            ["Spaceport Primus", "<b>Angron</b>, World Eaters Chaos Space Marines, Daemon Horde (Khorne, red), Chaos Warband (Khorne, red)"]]) +
          "<ul><li>Everything else is the Traitor <b>stockpile</b>: <b>Fulgrim</b>, <b>Magnus the Red</b>, 13 Chaos Space Marines (all 4 Thousand Sons among them), 3 Chaos Titans, all 8 Thunderhawk Flights and 8 Cultists, 3 Chaos Warbands, 4 Daemon Hordes and the 12 spare black bases.</li>" +
          "<li>A stockpiled Hero can be brought in whenever his owner may place units from his stockpile.</li></ul>",
        src: "Scenarios p.4–5 · Rules p.12, p.31" },

      /* ---- unit setup: Heresy Unheralded's procedure (Scenarios p.6), used by scenarios 2–6 ---- */
      { when: (c) => c.scen !== "bab", who: "both",
        t: (c) => "Unit setup 1: claim the spaceports" + (c.scen === "hu" ? "" : " (as in Heresy Unheralded)"),
        d: (c) => "<ul>" +
          HH.li(c, "trt", "first chooses one of the four <b>spaceports</b> and places a <b>Chaos Warband</b> of his choice there.") +
          HH.li(c, "imp", "then chooses two of the remaining three spaceports and places <b>3 Imperial Armies</b> on each.") +
          HH.li(c, "trt", "then places a Chaos Warband of his choice on the <b>fourth</b> spaceport.") +
          "<li>The spaceports are Eternity Wall Spaceport, Lions Gate Spaceport, Spaceport Damocles and Spaceport Primus.</li>" +
          (HH.scIs(c, "hta", "cha") ? "<li><b>Impassible areas:</b> nothing can be placed in one. A unit the setup says must go in an impassible area is destroyed instead of placed.</li>" : "") +
          "</ul>",
        src: (c) => HH.huSrc(c, "p.12, p.41") },
      { when: (c) => c.scen !== "bab", who: "imp",
        t: "Unit setup 2: the Imperial deployment",
        d: (c) => "<ul>" +
          HH.li(c, "imp", "places the rest of his starting forces. None may break an area’s <b>stacking limit</b> (6 units; 3 in a fortified area), go in either spaceport holding a Traitor Warband, or go on the <b>Vengeful Spirit</b>.") +
          "<li><b>1 Imperial Army</b> in each fortress area: the Tower of Shadows, Librarium Technologicus, Bastion Eternal, Fortress of Truth, Citadel of Justice and Black Ministry." +
            (HH.scIs(c, "hta", "cha") ? " If a fortress is impassible, its Army is destroyed instead of placed." : "") + "</li>" +
          "<li><b>6 defense lasers</b>, in six different areas.</li>" +
          "<li><b>3 Adeptus Custodes</b>, <b>3 Adeptus Arbites</b> and <b>the Emperor</b>, in any area(s) of the Palace region.</li>" +
          "<li><b>3 Adeptus Mechanicus</b> and <b>the Fabricator General</b>, in any factory area(s).</li>" +
          "<li><b>3 Imperial Titans</b>, in any factory area(s) or area(s) adjacent to a factory.</li>" +
          "<li>All <b>12 Space Marines</b> and their Primarchs, in any area(s): 4 Blood Angels and Sanguinius, 4 Imperial Fists and Rogal Dorn, 4 White Scars and Jaghatai Khan.</li>" +
          "<li><b>8 Imperial Armies</b> and <b>4 Imperial Tank Divisions</b>, in any area(s).</li>" +
          "<li>Imperial units not placed form the Imperial <b>stockpile</b>.</li></ul>",
        src: (c) => HH.huSrc(c, "p.12, p.38") },
      { when: (c) => c.scen !== "bab", who: "trt",
        t: "Unit setup 3: the Traitor deployment",
        d: (c) => "<ul>" +
          HH.li(c, "trt", "places the rest of his starting forces:") +
          "<li><b>Horus</b> and any <b>3 Traitor units</b> in the Vengeful Spirit <b>Command Center</b>.</li>" +
          "<li>Any <b>4 Traitor units</b> in the Vengeful Spirit <b>Catacombs</b>.</li>" +
          "<li>Any <b>4 Traitor units</b> in each of the two spaceports his Warbands claimed: 8 more units in all.</li>" +
          "<li>Any of his other <b>Heroes</b> he chooses, in any area(s) already holding Traitor units.</li>" +
          "<li>All unused units, figures, bases and Heroes form each player’s <b>stockpile</b>. A stockpiled Hero can be brought in whenever his owner may place units from his stockpile.</li></ul>",
        src: (c) => HH.huSrc(c, "p.12, p.31") },

      { when: () => true, who: "table",
        t: "Build the event deck",
        d: (c) => HH.evHtml(c),
        src: (c) => "Scenarios " + HH.scPage(c) + (c.scen === "cha" ? " · Rules p.5, p.39" : " · Rules p.5, p.13, p.39") },
      { when: () => true, who: "trt",
        t: (c) => "Corruption: " + HH.sc(c).corr + " draws",
        d: (c) => "<ul>" + HH.li(c, "trt", "makes <b>" + HH.sc(c).corr + " corruption draws</b>. For each:<ol>" +
          "<li>Choose an <b>Imperial Army</b> or <b>Imperial Tank Division</b> on the main map board. They are the only unit types that can be corrupted, and each Imperial unit can be put in jeopardy only <b>once</b> during setup.</li>" +
          "<li>Draw the top <b>bombardment card</b>. <b>Imperial Eagle</b>: no effect. <b>Chaos Star</b>: the unit is corrupted.</li>" +
          "<li>Move a corrupted unit’s figure from its gray base onto a <b>black Traitor base</b> (rank I for an Army, rank II for a Tank Division). It stays in the same area and is now a Traitor unit. The gray base goes to the Imperial stockpile. Discard the drawn card.</li></ol>") +
          "<li>Only the 12 spare black bases can be used. With none of the right rank left, that unit type can’t be corrupted.</li>" +
          HH.li(c, "imp", "watches which of his Armies and Tank Divisions change sides.") + "</ul>",
        src: (c) => "Scenarios " + HH.scPage(c) + " · Rules p.13, p.37" },
      { when: () => true, who: "trt",
        t: (c) => "Bombardment: " + HH.sc(c).bomb + " orbital bombardments",
        d: (c) => "<ul>" + HH.li(c, "trt", "makes <b>" + HH.sc(c).bomb + " orbital bombardments</b>. For each:<ol>" +
          "<li>Choose an area on the main map board. It may <b>not</b> be a fortified area, e.g. a factory, a fortress or an area of the palace." +
            (HH.scIs(c, "hta", "cha") ? " Nor may it be an impassible area." : "") + "</li>" +
          "<li>Declare the bombardment <b>precise</b> or <b>reckless</b>.</li>" +
          "<li>Draw the top bombardment card and apply its <b>orbital</b> result of the type chosen to that area. Discard the card.</li></ol>") +
          "<li><b>Damage</b> is divided among the units in the area as the bombarding player chooses, and all of it must be assigned if possible. Once every enemy unit there is destroyed, the rest hits his own units. <b>Heroes are never damaged</b> by orbital bombardment.</li>" +
          "<li>A <b>breach</b> result breaches one adjacent fortified border segment (the bombarding player picks which, if there are several). FAQ: the breach marker is placed even though you didn’t target the fortification itself.</li>" +
          "<li>The same area may be bombarded more than once, up to the scenario’s total.</li>" +
          "<li>Each damaged survivor gets a <b>damage token</b> showing its total damage, slotted into its base by its owner.</li></ul>",
        src: (c) => "Scenarios " + HH.scPage(c) + (c.scen === "cha" ? ", p.7" : "") + " · Rules p.13, p.30, p.35 · FAQ p.2" },
      { when: () => true, who: "both",
        t: "Order card setup",
        d: (c) => "<ul>" +
          "<li>Each player removes all of his <b>starting orders</b> from his order deck. They have a <b>green skull icon</b> in the lower left corner, and by default they are his <b>starting hand</b>.</li>" +
          HH.li(c, "trt", "places exactly <b>4</b> of his <b>Port Landing</b> and/or <b>Drop Pods</b> starting orders, in any combination, on the strategic map at no initiative cost, in any region(s) he chooses. " +
            (c.scen === "lug" ? "He returns his other Port Landing and Drop Pods starting orders to his order deck." : "He shuffles his other Port Landing and Drop Pods starting orders into his order deck.")) +
          (c.scen === "lug" ? "<li>Then each player chooses <b>any 4 order cards</b> from his order deck and adds them to his starting hand.</li>" +
            "<li>Finally, each player shuffles his order deck and puts it facedown near him.</li>"
            : "<li>Shuffle your remaining order cards into a facedown <b>order deck</b> near you.</li>") +
          (c.scen === "cha" ? "<li>Then each player adds <b>1 random card</b> from his order deck to his starting hand.</li>" : "") +
          HH.li(c, "trt", "may execute the orders he placed on the strategic map during setup on his first turn.") + "</ul>",
        src: (c) => "Scenarios " + HH.scPage(c) + " · Rules p.13 · FAQ p.2" }
    ]
  },
  {
    title: "Begin play",
    steps: [
      { when: (c) => c.mod("rotate") || c.mod("pending") || c.mod("tuck"), who: "opt",
        t: "Agree on your table aids",
        d: (c) => "<ul>" +
          (c.mod("rotate") ? "<li><b>Rotate new orders.</b> Place every order on the strategic map turned 90° from the rest of its stack. At each change of initiative, turn them all to match. A turned card can’t be executed yet.</li>" : "") +
          (c.mod("pending") ? "<li><b>Mark pending phases.</b> Keep a spare marker or token handy. Put it on each special-phase icon a marker moves past or onto, and take it off when that phase is resolved.</li>" : "") +
          (c.mod("tuck") ? "<li><b>Tuck your reserve.</b> Slide your faceup reserve cards halfway under the game board while they aren’t in use, so they aren’t confused with cards being executed.</li>" : "") +
          "</ul>",
        src: (c) => HH.aidSrc(c) },
      { when: () => true, who: "trt",
        t: "Begin play: the Traitor acts first",
        d: (c) => "<ul>" +
          HH.li(c, "trt", "is the first <b>current player</b>, because his initiative marker is on top. He starts taking actions right away; there are no more preliminaries.") +
          "<li>Each round: <b>1</b> the current player takes one action, <b>2</b> advances his initiative marker by its cost, <b>3</b> if he moved past his opponent’s marker there is a change of initiative (coexistence battles, then stacking limits), and <b>4</b> any special phases he crossed or landed on are resolved.</li></ul>",
        src: "Rules p.13 · p.14" }
    ]
  }
];

/* =============================================================================
   RULES REFERENCE
   ============================================================================= */
HH.reference = [
  {
    title: "Winning the game",
    open: true,
    when: () => true,
    html: (c) => "<p><b>Every victory condition is immediate:</b> the game ends the moment one is met, even mid-action and before any special phases.</p><ul>" +
      "<li><b>Death of the Emperor or of Horus.</b> If the Emperor is eliminated, the Traitor wins. If Horus is eliminated, the Imperial player wins.</li>" +
      "<li><b>Spaceport victory (either player).</b> Once at least one initiative marker has moved onto or past the <b>Spaceport Victory</b> space, a player wins by being the only side with units on all four spaceports: <b>Eternity Wall Spaceport, Lions Gate Spaceport, Spaceport Damocles</b> and <b>Spaceport Primus</b>.<ul>" +
        "<li>A spaceport with units of both sides, or with no units at all, blocks this for both players.</li>" +
        "<li>Heroes are not units, so an unsupported Hero doesn’t hold a spaceport.</li>" +
        "<li>If you already hold all four when a marker reaches that space, you win at once in that advance initiative marker step.</li></ul></li>" +
      "<li><b>Imperial hold-out victory.</b> If either initiative marker moves onto the last space of the track (“Imperial Victory”), the Imperial player wins: relief legions have arrived.</li></ul>" +
      "<ul><li>All six scenarios share these victory conditions." +
        (c.scen === "ffb" ? " In <b>Fortune Favors the Bold</b> the book warns that the hold-out victory is imperiled: both players should read the event card <b>The Warp Claims a Mighty Armada</b> before the game begins." : "") + "</li></ul>",
    src: (c) => "Rules p.2, p.39–41 · Scenarios p.2" + (c.scen === "ffb" ? ", p.8" : "")
  },
  {
    title: "Your scenario: special rules & setup",
    when: () => true,
    html: (c) => {
      var s = HH.sc(c), h = "<h4>Scenario " + s.n + ": " + s.name + "</h4><p>" + s.premise + "</p>";
      if (s.imp) h += "<h4>Impassible areas</h4><ul>" +
        "<li>Four areas, chosen in turn before deployment (Traitor first), never two adjacent, never the Inner Palace, a spaceport or a Vengeful Spirit area. Each is marked with a special token.</li>" +
        "<li>A unit the unit setup would place in an impassible area is destroyed instead of placed.</li>" +
        "<li>Units and Heroes can’t enter an impassible area, it can’t be the target of a bombardment, and it can’t be the subject of <b>any</b> game effect at all: functionally, it doesn’t exist.</li></ul>";
      if (s.tok) h += "<h4>Special tokens</h4><ul>" +
        "<li>Each player has 3. When you place one of your orders on the strategic map, or execute one of your orders from the strategic map or from your hand, you may spend <b>one</b> to cut that cost by 1 (minimum 0).</li>" +
        "<li>Only one token per placement or execution. A spent token is out for the rest of the game.</li>" +
        (s.id === "cha" ? "<li>Cry Havoc also uses special tokens to mark impassible areas; the two uses aren’t interchangeable.</li>" : "") + "</ul>";
      if (s.id === "ffb") h += "<h4>Before you start</h4><ul>" +
        "<li>Both players should read and understand the event card <b>The Warp Claims a Mighty Armada</b>: it imperils the Imperial hold-out victory. It may or may not come out during the game (it is one of three cards for Act II, of which two are used).</li>" +
        "<li>Late in the game, extra events designed to throw the Emperor and Horus closer together may come into play.</li></ul>";
      if (!s.imp && !s.tok) h += "<ul><li><b>No special rules.</b> Once setup is done, the rulebook’s rules apply unchanged.</li></ul>";
      h += "<h4>Setup at a glance</h4><ul>" +
        "<li><b>Units:</b> " + (s.id === "bab" ? "as the book’s setup diagram shows (Traitor beachheads at Eternity Wall Spaceport and Spaceport Primus)." : "deployed by the players" + (s.id === "hu" ? "" : ", as in Heresy Unheralded") + ": the Traitor’s Warbands claim two spaceports, the Imperium garrisons the other two, then each side places the rest under the book’s limits.") + "</li>" +
        "<li><b>Corruption:</b> " + s.corr + " draws. <b>Bombardment:</b> " + s.bomb + " orbital bombardments.</li>" +
        "<li><b>Events:</b> " + ({ bab: "10 known cards in three acts", hu: "10 known cards in three acts, the same as Brother Against Brother", hta: "10 cards in three acts, the first two partly random", ffb: "10 cards in three acts, each partly random", lug: "10 cards in three acts, built largely from cards the players choose", cha: "10 cards dealt at random from all 30" })[s.id] + ". The event deck is never reshuffled.</li>" +
        "<li><b>Orders:</b> the Traitor starts with 4 Port Landing and/or Drop Pods orders on the strategic map, which he may execute on his first turn" +
          (s.id === "lug" ? "; each player also adds 4 order cards of his choice to his starting hand" : s.id === "cha" ? "; each player also adds 1 random order to his starting hand" : "") + ".</li>" +
        "<li><b>Victory:</b> the rulebook’s, as in every scenario (see Winning the game).</li></ul>";
      return h;
    },
    src: (c) => "Scenarios p.2, " + HH.sc(c).pg + ({ bab: "", hu: "", hta: ", p.6", ffb: ", p.6", lug: ", p.6", cha: ", p.6–8" })[c.scen] +
      " · Rules p.39 · FAQ p.2"
  },
  {
    title: "The six scenarios",
    when: () => true,
    html: (c) => {
      var glance = {
        bab: "Setup diagram · 12 corruption draws · 4 bombardments · set event acts",
        hu: "Players deploy · 12 corruption draws · 4 bombardments · Brother Against Brother’s events",
        hta: "4 impassible areas · deploy as Heresy Unheralded · 8 corruption draws · 6 bombardments · partly random events",
        ffb: "3 special tokens each · deploy as Heresy Unheralded · 12 corruption draws · 4 bombardments · partly random events",
        lug: "Players build the event deck · deploy as Heresy Unheralded · 12 corruption draws · 4 bombardments · 4 chosen extra orders",
        cha: "Impassible areas and special tokens · deploy as Heresy Unheralded · 8 corruption draws · 4 bombardments · 10 random events · 1 random extra order"
      };
      return "<p>From the Scenario Guide. Every scenario follows the rulebook’s general setup and uses its victory conditions.</p>" +
        "<dl class='terms scen-dl'>" +
        HH.scenarios.map(function (s) {
          var on = s.id === c.scen ? " class='on'" : "";
          return "<dt" + on + ">" + s.n + ". " + s.name + "<span class='sub'>Scenarios " + s.pg + (on ? " · your scenario" : "") + "</span></dt>" +
            "<dd" + on + ">" + s.premise + "<span class='sub'>" + glance[s.id] + "</span></dd>";
        }).join("") + "</dl>";
    },
    src: () => "Scenarios p.2–10"
  },
  {
    title: "The round, step by step",
    when: () => true,
    html: (c) => "<ul><li>At the start of each round, the player whose initiative marker is <b>closest to the start</b> of the initiative track is the <b>current player</b>. If both markers share a space, the one on top is. The current player doesn’t change during a round.</li></ul><ol>" +
      "<li><b>Action step.</b> The current player chooses one of the five actions and resolves it.</li>" +
      "<li><b>Advance initiative marker step.</b> He moves his marker forward by the action’s cost. A marker that lands on (not past) the opponent’s space goes <b>on top</b>. A cost of 0 doesn’t move it.</li>" +
      "<li><b>Change of initiative step</b> (only if his marker passed his opponent’s; on a shared space, only if his marker is underneath):<ol type='a'>" +
        "<li><b>Coexistence battles</b> are fought in every area where both sides’ forces co-exist. The Imperial player chooses the order.</li>" +
        "<li><b>Stacking limits</b> are checked and enforced.</li></ol>" +
        "If there is no change of initiative, nothing happens in this step.</li>" +
      "<li><b>Resolve special phases step.</b> One special phase for each icon his marker moved past or onto this round, in the order crossed.</li></ol>" +
      "<ul><li>A new round begins immediately.</li></ul>",
    src: () => "Rules p.14–15, p.44"
  },
  {
    title: "The five actions",
    when: () => true,
    html: (c) => "<div class='tbl-wrap'><table class='ref-tbl'><thead><tr><th scope='col'>Action</th><th scope='col'>Cost</th><th scope='col'>What you do</th></tr></thead><tbody>" +
      "<tr><th scope='row'>Place an order</th><td>1</td><td>Put an order card from your hand <b>facedown</b> on top of one of the 7 order stacks.</td></tr>" +
      "<tr><th scope='row'>Execute order from strategic map</th><td>1</td><td>Execute one of <b>your</b> orders from the top of a stack, whatever its printed cost. <b>Not</b> one placed since the most recent change of initiative.</td></tr>" +
      "<tr><th scope='row'>Execute order from hand</th><td>0–3</td><td>Pay one point per cost icon on the card and execute it in the region of your choice. Its strategic effect is ignored.</td></tr>" +
      "<tr><th scope='row'>Bury an order</th><td>1</td><td>Move the top card of any stack (yours or your opponent’s) to the bottom of that stack, without looking at it.</td></tr>" +
      "<tr><th scope='row'>Draw an order</th><td>1</td><td>Take one card of your choice from your reserve, or the top card of your order deck. Not allowed with six order cards in hand.</td></tr>" +
      "</tbody></table></div>" +
      "<ul><li>You may always ignore an executed order’s effects. You still pay the cost, but place no activation markers.</li>" +
      "<li>An executed order goes to your discard pile, or to your <b>reserve</b> if it has the recycle symbol.</li>" +
      (HH.scIs(c, "ffb", "cha") ? "<li><b>" + HH.sc(c).name + ":</b> when you place an order or execute one (from the map or from hand), you may spend one of your special tokens to cut that cost by 1, to a minimum of 0. One token per placement or execution; a spent token is gone for good.</li>" : "") +
      "</ul>",
    src: (c) => "Rules p.14, p.18–20, p.44" + (HH.scIs(c, "ffb", "cha") ? " · Scenarios p.8" + (c.scen === "cha" ? ", p.10" : "") : "")
  },
  {
    title: "Initiative track & special phases",
    when: () => true,
    html: (c) => "<p>The track as pictured in the rulebook (34 spaces). The board’s <b>Order Phase</b> icon is the draw orders phase (the index equates them).</p>" + HH.trackHtml() +
      "<ul><li>That is <b>10 Event</b>, <b>5 Draw Orders</b> and <b>5 Refresh</b> icons, <b>Spaceport Victory</b> on space 17 and <b>Imperial Victory</b> on space 34.</li>" +
      "<li>Each space’s special phase happens <b>once per game</b>: the first round in which a marker moves past or onto it. A marker reaching an icon that has already been triggered has no effect.</li>" +
      "<li>Only the <b>current player’s</b> marker triggers icons. If a card moves your opponent’s marker onto an icon, it isn’t resolved.</li>" +
      (c.mod("pending") ? "<li><b>Table aid:</b> drop a token on each pending icon until it is resolved.</li>" : "<li>Pending icons can be marked with a spare token until resolved.</li>") + "</ul>" +
      "<h4>Event phase</h4><ul><li>The current player draws the top event card and carries out its instructions.</li>" +
      "<li>“Do immediately” cards are resolved at once. Otherwise the instructions say what to do with the card, and its effect says how and when it applies.</li></ul>" +
      "<h4>Draw orders phase</h4><ol><li>Starting with the current player, each player may <b>discard</b> any or all orders from his hand. Recyclable ones go to his reserve.</li>" +
      "<li>Starting with the current player, each may move any or all orders from his <b>reserve</b> to his hand, up to six cards in hand.</li>" +
      "<li>Each player with fewer than six cards <b>draws</b> from his order deck up to six.</li></ol>" +
      "<h4>Refresh phase</h4><ul><li>Remove every activation marker showing its <b>activation icon</b>, then flip every <b>routed</b> activation marker to its activation side.</li></ul>",
    src: () => "Rules p.14–16, p.38, p.40, p.43 · FAQ p.2"
  },
  {
    title: "Orders, regions & the strategic map",
    when: () => true,
    html: (c) => "<h4>Order card anatomy</h4><ul>" +
      "<li><b>Cost:</b> skull icons down the left edge, one initiative point each when executed <b>from hand</b>.</li>" +
      "<li><b>Effect</b>, with the areas it activates in <i>italics</i>. No italic text means nothing is activated.</li>" +
      "<li><b>Strategic effect:</b> a bonus carried out only when the order is executed <b>from the strategic map</b>.</li>" +
      "<li><b>Starting order icon</b> (green skull, lower left) and <b>recycle symbol</b> (bottom centre).</li></ul>" +
      "<h4>Regions and the seven order stacks</h4><ul>" +
      "<li>The strategic map is a high-level version of the main map. Each <b>region</b> is a group of areas and has an <b>order stack</b>. The six regions are Palace, Imperial Plateau, Crucible, Lions Gate, Volcanus and Black Ministry. The <b>Vengeful Spirit</b>’s stack sits beside its areas, top right of the board.</li>" +
      "<li>A new order goes <b>on top</b> of its stack. Offset it slightly so both players can see the orders underneath." + (c.mod("rotate") ? " <b>Table aid:</b> turn it 90° until the next change of initiative." : "") + "</li>" +
      "<li>You may look at a facedown order only if it is yours <b>and</b> on top of its stack.</li>" +
      "<li>An order underneath others can’t be executed until those above it are executed or buried.</li>" +
      "<li>Every executed order applies to one region: the stack it came from, or the region you choose when playing from hand. Its destination or target areas must be in that region, but the units carrying it out may start outside it. Orders that don’t affect a region can be carried out anywhere they are legal.</li></ul>" +
      "<h4>Executing</h4><ul><li>Do exactly what the card says. Movement follows the movement rules; attacks follow the battle rules.</li>" +
      "<li>You control <b>only your own units</b> unless the order says otherwise.</li>" +
      "<li>Afterwards the card goes to your discard pile, or to your faceup <b>reserve</b> if it bears the recycle symbol. Either player may look through either reserve at any time." + (c.mod("tuck") ? " <b>Table aid:</b> keep yours tucked half under the board." : "") + "</li>" +
      "<li>Specific rules on cards, in scenarios and in Hero abilities override these general rules.</li></ul>" +
      "<h4>Errata (FAQ)</h4><ul><li><b>Forced March</b> (Traitor): “Activate the destination area.” (not “each destination area”).</li>" +
      "<li><b>Unnatural Vigor</b> (Traitor): effect “Remove a normal activation marker from 1 area in this region.”; strategic effect “Remove 1 normal activation marker from 2 different areas in this region.”</li></ul>",
    src: () => "Rules p.11, p.17–21 · FAQ p.1"
  },
  {
    title: "Activation markers",
    when: () => true,
    html: () => "<ul>" +
      "<li>Executing an order usually <b>activates</b> areas. Put one of your activation markers in each, activation icon up.</li>" +
      "<li>You <b>may not order units in an area that holds one of your activation markers</b> (to move, attack and so on), whether it shows the activation or the rout side.</li>" +
      "<li>Units from an unactivated area may still move <b>into</b> an area you’ve activated. A second marker of the same side is never added to an area.</li>" +
      "<li>Areas are activated separately for each player. Ignore your opponent’s markers.</li>" +
      "<li><b>Routed activation markers</b> (rout side up) come from retreats and routs. They aren’t removed directly: when one would be removed, flip it to its activation side instead.</li>" +
      "<li>Activity that doesn’t come from an order (events, coexistence battles) ignores activation and activates nothing, unless it says otherwise.</li>" +
      "<li>Markers are mostly cleared in the <b>Refresh phase</b>.</li></ul>" +
      "<h4>FAQ rulings</h4><ul>" +
      "<li>Heroes can’t move out of an area that holds one of their side’s activation markers.</li>" +
      "<li>Thunderhawk flying movement can’t be used from an activated area.</li>" +
      "<li>Drop Pods and Port Landing can’t take units or Heroes from a Vengeful Spirit area holding a Traitor activation marker.</li>" +
      "<li>Units moved by the Vicissitudes of Chaos event don’t activate their new area.</li></ul>",
    src: () => "Rules p.16, p.20–21 · FAQ p.1–3"
  },
  {
    title: "Movement & flying",
    when: () => true,
    html: () => "<ul>" +
      "<li>Any order whose effect says “<b>move</b>” is a movement order. Its destination area(s) must be in the order’s region; the units may start inside or outside it.</li>" +
      "<li><b>Movement points:</b> most units have <b>2</b>; fast units have more (table). Heroes count as having <b>3</b>.</li>" +
      "<li>Moving to an adjacent area costs 1. Crossing a <b>crevasse</b> costs <b>2</b> (1 for flying units).</li>" +
      "<li>Move only <b>into and through friendly or neutral areas</b>. Entering an enemy or contested area needs an attack order.</li>" +
      "<li>Every moving unit must end in a legal destination. A unit that can’t reach one doesn’t move (exceptions: <b>Boarding Action</b> and <b>Secret Routes</b>). You needn’t use all your points.</li>" +
      "<li>Fortifications don’t affect movement.</li>" +
      "<li><b>Lightning Raid</b> exception: its target area must be in the region, but its movement destination (the attack’s origin area) need not be.</li></ul>" +
      "<div class='tbl-wrap'><table class='ref-tbl'><caption>Fast units</caption><thead><tr><th scope='col'>Unit</th><th scope='col'>Movement points</th></tr></thead><tbody>" +
      "<tr><td>Imperial Space Marines</td><td>3</td></tr><tr><td>Imperial Tank Division</td><td>3</td></tr><tr><td>Chaos Space Marines</td><td>3</td></tr>" +
      "<tr><td>Traitor Tank Division</td><td>3</td></tr><tr><td>Chaos Thunderhawk Flight</td><td>5</td></tr></tbody></table></div>" +
      "<h4>Flying units</h4><ul><li>Pay only 1 point to cross a crevasse.</li><li>May move <b>through</b> enemy and contested areas, but not end there.</li></ul>" +
      "<h4>Flying transport</h4><ul>" +
      "<li>Where it starts and in each area it enters, a flying transport unit may <b>pick up</b> friendly units, up to its combat rating at any one time. A Chaos Thunderhawk Flight carries 2. It may <b>not</b> pick up from an activated area.</li>" +
      "<li>It may <b>drop off</b> units in friendly or empty areas it passes through, or where it stops, and may drop off and pick up in the same area. It must drop off everything at the end of its move.</li>" +
      "<li>FAQ: transport works <b>only during a movement order</b>, not when an event moves the Thunderhawk and not when it retreats. Thunderhawks <b>can’t transport Heroes</b>.</li></ul>" +
      "<h4>Heroes moving</h4><ul><li>Heroes move by movement orders, as units with 3 movement points. They also count as units for routing, retreating and event card effects.</li>" +
      "<li>FAQ: an unsupported Hero can execute move and attack orders, but can’t move through enemy areas.</li></ul>",
    src: () => "Rules p.21–23, p.32 · FAQ p.3"
  },
  {
    title: "Battle 1 · Joining battle & engaging units",
    when: () => true,
    html: () => "<ul><li>Battles come from <b>attack orders</b>, and from <b>coexistence battles</b> at a change of initiative in every area where enemy forces co-exist (an unsupported Hero counts; see Heroes). Both are resolved the same way.</li>" +
      "<li>The <b>attacker</b> and <b>defender</b> stay the same all battle. The <b>active</b> and <b>passive</b> roles swap every iteration.</li></ul>" +
      "<h4>Joining battle</h4><ul>" +
      "<li>The attack order’s player is the attacker. He picks a <b>target area</b> in the order’s region containing at least one enemy unit or Hero.</li>" +
      "<li>The order says how many <b>origin areas</b> he may attack from (Firefight: 1). Each must be adjacent to the target and contain at least one of the attacker’s <b>units or Heroes</b> (FAQ erratum).</li>" +
      "<li>If the attacker has units in the target area, it becomes an origin area automatically, without counting against the limit. Those units are engaged even if their area is activated or routed (FAQ).</li>" +
      "<li>Enemy units in an origin area don’t stop your units there from attacking (FAQ).</li><li>Units in an area holding your own activation marker can’t take part through a new order; your units already in the target area are the exception, engaging automatically.</li>" +
      "<li><b>Coexistence battles:</b> the Imperial player is always the attacker and the Traitor always the defender (FAQ glossary erratum). The shared area is both target and origin, and the battle lasts at most <b>8 iterations</b>.</li></ul>" +
      "<h4>Engaging units</h4><ul>" +
      "<li>The attacker chooses freely which units and Heroes in his origin areas engage, up to all of them, and pushes them toward the target. They <b>don’t move into the target area yet</b>.</li>" +
      "<li>Everything in the target area, of both sides, is engaged automatically. In a coexistence battle everything in the area is.</li></ul>" +
      "<h4>Flying units joining battles</h4><ul>" +
      "<li>Once a target is named, nearby flying units may spend up to <b>3 movement points</b> to reach a friendly or neutral area adjacent to the target. That area becomes an origin area (it counts toward the order’s limit) and is activated, and the flyers must engage.</li>" +
      "<li>They can’t transport units this way, and flying units never join a coexistence battle.</li></ul>",
    src: () => "Rules p.24–25, p.32 · FAQ p.1–2"
  },
  {
    title: "Battle 2 · Cards & combat iterations",
    when: () => true,
    html: () => "<h4>Preparing to fight</h4><ul>" +
      "<li>Each player draws combat cards equal to <b>half the total combat rank of his engaged units, rounded up</b>. For example, III + III + I = 7 gives 4 cards. Some orders add more.</li>" +
      "<li>With at least one engaged Hero, also draw <b>2 Hero combat cards</b>: only 1 if all your engaged Heroes are wounded, and never more than 2 however many Heroes fight.</li>" +
      "<li>Hands start empty every battle, and leftovers are discarded when it ends. Both players can see which cards in a hand are Hero cards.</li>" +
      "<li>Place the iteration marker on the first space of the iteration track. The <b>defender chooses</b> who is active in iteration 1; the roles then alternate.</li></ul>" +
      "<h4>Each iteration (N = iteration number)</h4><ol>" +
      "<li><b>Active player plays cards or retreats.</b> He plays up to <b>N</b> cards face up, or passes (forced if he has none). From iteration 2 on he may retreat instead. A pass skips straight to step 6.</li>" +
      "<li><b>Special effects.</b> He may use <b>one</b> special effect that isn’t free, plus <b>any number of free effects</b> (free effect icon), from the cards played. Each needs one of his engaged units to meet the card’s unit requirement. “Attacking” and “defending” are not the same as active and passive.<br>" +
        "If an effect has a counter cost “[N shields counter.]”, the passive player may discard cards showing that many shields to cancel it, using <b>any number of cards</b> (FAQ). If a regular effect is cancelled, the active player can’t choose another.</li>" +
      "<li><b>Total regular damage:</b> the attack values of <b>all</b> cards played, whether or not their unit requirements are met.</li>" +
      "<li><b>Passive player resists:</b> he may discard up to <b>N</b> cards. Each shield icon cancels 1 regular damage, and extra shields are wasted. Cards used to counter in step 2 don’t count here.</li>" +
      "<li><b>Active player assigns damage</b> among the enemy’s engaged units as he likes. Only if no engaged enemy units remain may it go to enemy Heroes.</li>" +
      "<li><b>Advance the iteration marker.</b> Past the order’s limit (8 in a coexistence battle), the battle ends. The board’s iteration track doesn’t cap a battle that other rules let run longer.</li></ol>" +
      "<ul><li>Fortified defenders cut the attacker’s regular damage by 2 (or 1) in each of the attacker’s active iterations; see Fortifications.</li>" +
      "<li>FAQ: the 2 extra cards drawn with <b>Hunker Down</b> can’t be played in that iteration.</li></ul>" +
      "<h4>Combat card anatomy</h4><ul><li><b>Attack value</b> (top left), <b>shields</b> (icons down the left edge), and a <b>special effect</b>: name, unit requirement, free effect icon, effect text and counter cost. A blank part means the card doesn’t have it.</li></ul>",
    src: () => "Rules p.26–29, p.44 · FAQ p.1, p.3"
  },
  {
    title: "Battle 3 · Retreats, routing & end of battle",
    when: () => true,
    html: () => "<h4>Retreat</h4><ul>" +
      "<li>Instead of playing cards in any iteration <b>after the first</b>, the active player may retreat, ending the battle at once. He can’t if any of his engaged units are in an area holding his routed activation marker. <b>No retreats from coexistence battles</b> (FAQ).</li>" +
      "<li><b>Defender:</b> moves all his engaged units and any Heroes present to <b>one</b> adjacent friendly or neutral area (only flying units may cross a crevasse) and marks it with his routed activation marker. With no such area he can’t retreat. FAQ: an origin area whose attacking units were all eliminated is a legal retreat area even if an enemy Hero remains there.</li>" +
      "<li><b>Attacker:</b> his units stay put. Every origin area with units engaged when he retreated is marked with his routed activation marker.</li>" +
      "<li>Marking an area: flip a marker already showing its activation side; never add a second routed marker.</li></ul>" +
      "<h4>Routing (forced by effects)</h4><ul>" +
      "<li><b>Defender’s unit:</b> leaves the battle for an adjacent friendly or neutral area of its owner’s choice. It is eliminated instead if there is none, if the target area already holds the defender’s routed marker, or if the defender prefers.</li>" +
      "<li><b>Attacker’s unit:</b> leaves the battle and stays in its origin area, unless that area already holds the attacker’s routed marker, in which case it is eliminated.</li>" +
      "<li>Every area a unit routs to gets its side’s routed marker (flip an activation-side one; never a second). Only flying units rout across a crevasse. A routed unit is no longer engaged.</li>" +
      "<li>FAQ: when an effect routs your units you may eliminate them instead. Units in an area with a routed marker fight normally in a coexistence battle.</li></ul>" +
      "<h4>End of battle</h4><ul>" +
      "<li>The battle ends at once when one side’s engaged units and Heroes have all retreated, been eliminated or been removed (such as by routing); when a new iteration would begin but neither player has cards; or when the iterations are used up. Remaining steps aren’t applied.</li>" +
      "<li>If <b>no defending units</b> remain in the target area, the attacker may move all, some or none of his surviving engaged units and Heroes into it.</li>" +
      "<li>Discard all unused combat and Hero combat cards, then discard or recycle the attack order.</li></ul>",
    src: () => "Rules p.30–31 · FAQ p.2"
  },
  {
    title: "Damage & elimination",
    when: () => true,
    html: () => "<ul>" +
      "<li>A unit is <b>eliminated</b> when its damage equals its <b>combat rank</b>: 3 points kill a rank III unit.</li>" +
      "<li>Smaller damage persists. The owner slots a <b>damage token</b> showing the unit’s total damage into its base clip. Damage is cumulative between battles, but has no other effect: the unit keeps its full rank, abilities and movement.</li>" +
      "<li><b>Eliminated Traitor units</b> go back to the box, except Traitor Armies and Traitor Tank Divisions: the figure returns to the Imperial stockpile and the black base to the Traitor stockpile.</li>" +
      "<li><b>Eliminated Imperial units</b> go back to the box, except <b>Imperial Armies, Imperial Tank Divisions and Imperial Titans</b>, which return to the Imperial stockpile because certain orders, rules and instructions can bring them back into play (FAQ: Armies Without Numbers can return an Imperial Army eliminated in that battle).</li>" +
      "<li><b>Sacrifice</b> means voluntarily eliminating one of your own units.</li></ul>",
    src: () => "Rules p.30–31, p.37, p.41 · FAQ p.2"
  },
  {
    title: "Heroes",
    when: () => true,
    html: (c) => "<div class='tbl-wrap'><table class='ref-tbl'><thead><tr><th scope='col'>Imperial Heroes</th><th scope='col'>Traitor Heroes</th></tr></thead><tbody>" +
      "<tr><td>The Emperor</td><td>Warmaster Horus</td></tr>" +
      "<tr><td>Rogal Dorn (Imperial Fists)</td><td>Angron (World Eaters)</td></tr>" +
      "<tr><td>Jaghatai Khan (White Scars)</td><td>Fulgrim (Emperor’s Children)</td></tr>" +
      "<tr><td>Sanguinius (Blood Angels)</td><td>Mortarion (Death Guard)</td></tr>" +
      "<tr><td>The Fabricator General (of Mars)</td><td>Magnus the Red (Thousand Sons)</td></tr></tbody></table></div><ul>" +
      "<li><b>Heroes are not units.</b> They don’t make an area friendly, don’t count toward stacking limits or spaceports, and can’t be hit by defense lasers or orbital bombardment. They do count as units for movement orders, routing, retreating and event card effects.</li>" +
      "<li><b>Entering play:</b> a Hero not placed at setup can be put in whenever his owner may place units from his stockpile, for example with Drop Pods, Port Landing or the event “The Righteous Heed the Call”. This is free and doesn’t use up any unit placement.</li>" +
      "<li><b>Common ability:</b> Hero combat cards (2 per battle; 1 if every engaged Hero on your side is wounded).</li>" +
      "<li><b>Individual abilities</b> are printed only on the reference sheets and are always optional. The rulebook mentions: Sanguinius deals extra damage based on the Blood Angels with him; Magnus the Red may draw bombardment cards when attacking with Thousand Sons; Rogal Dorn’s ability works in a coexistence battle inside an unbreached fortified area; some abilities corrupt units.</li>" +
      "<li><b>Unsupported Hero</b> (no friendly units in his area): the area isn’t friendly to his side, so enemy units may move through or into it. Enemy units there trigger a coexistence battle, and so does an opposing unsupported Hero (FAQ).</li></ul>" +
      "<h4>Hero damage track</h4>" + HH.heroTrackHtml() +
      "<ul><li>As pictured in the rulebook (p.32): after the double-width start space come 5 unwounded spaces, then 4 wounded spaces (the first labelled Wounded), then <b>Defeated</b>. That puts a Hero in the wounded section from his 6th point of damage, and the 10th defeats him.</li>" +
      "<li><b>Wounded:</b> brings 1 Hero combat card instead of 2 but otherwise works normally. The least-wounded engaged Hero on a side sets the draw. Cards already drawn aren’t put back if a Hero is wounded mid-battle.</li>" +
      "<li><b>Defeated:</b> the Hero is eliminated from the game; his marker goes back to the box.</li>" +
      "<li>Regular damage can be assigned to Heroes only when the passive player has <b>no engaged units left</b>, and so can Thunderhawk bombardment damage (FAQ erratum). Some card effects, such as Lead by Example, damage a Hero directly.</li>" +
      "<li><b>Hero eliminated in battle:</b> his player draws one bombardment card for <b>each</b> of his units in that area, engaged or not (FAQ). A unit whose card shows the other side’s symbol routs.</li></ul>" +
      "<h4>Ability timing when several Heroes fight (FAQ)</h4><ol>" +
      "<li><b>Joining battle:</b> Jaghatai Khan, then the Fabricator General.</li>" +
      "<li><b>Engaging units:</b> Fulgrim, Mortarion, Rogal Dorn, Magnus the Red, Angron.</li>" +
      "<li><b>Preparing to fight:</b> the Emperor, then Horus.</li>" +
      "<li><b>Combat iterations:</b> Sanguinius, when the Imperial player totals regular damage.</li></ol>" +
      "<h4>Other FAQ rulings</h4><ul>" +
      "<li>Jaghatai Khan can’t use his ability if his area is already activated.</li>" +
      "<li>Orbital bombardments from abilities or events (Magnus the Red, “The Sky Fortress Rises”) follow all the normal bombardment rules.</li>" +
      "<li>Rogal Dorn and an Imperial Fists Space Marine defend. The Marine takes 3 damage, then the battle ends with attackers surviving. The attackers can’t move into the target area, because the Marine wasn’t eliminated during the battle; it is eliminated after the battle is resolved.</li></ul>",
    src: () => "Rules p.7, p.12, p.29, p.31–33, p.35–38, p.40 · FAQ p.1–3"
  },
  {
    title: "Fortifications, crevasses & breaches",
    when: () => true,
    html: () => "<h4>Fortified areas</h4><ul>" +
      "<li>Every <b>factory</b>, <b>fortress</b> and <b>palace</b> area (all the raised plastic), the <b>Vengeful Spirit Command Center</b> (the circular area), and any area marked with a <b>fortification marker</b>. All their borders are fortified borders.</li>" +
      "<li>Any unit, even a Titan or a Thunderhawk, may enter a fortified area.</li>" +
      "<li>Stacking limit <b>3</b> units per side (an area fortified by a marker keeps its limit of 6).</li></ul>" +
      "<h4>In battle</h4><ul>" +
      "<li>Defending units in a fortified area subtract <b>2</b> from the attacker’s regular damage in <b>each of his active iterations</b>.</li>" +
      "<li>Only <b>1</b> is subtracted if any attacking unit attacks across a breached border segment. Full benefit needs every attacker to cross an unbreached segment.</li>" +
      "<li><b>Flying attackers:</b> the border between their origin area and the target counts as breached while they stay engaged. No breach marker is placed (FAQ).</li>" +
      "<li>No benefit in a <b>coexistence battle</b> inside a fortified area, except Rogal Dorn’s ability if the area is unbreached.</li>" +
      "<li>No benefit to units attacking <b>from</b> a fortified origin area.</li>" +
      "<li>FAQ: if the attacker’s units are already inside the fortified target area (they engage automatically) and more attack from outside, the defenders get no fortification bonus.</li></ul>" +
      "<h4>Crevasses</h4><ul>" +
      "<li>A crevasse counts as a fortified border. Defenders attacked only by units that <b>all</b> must cross crevasses get full fortification benefits. If some attackers cross a crevasse and some don’t, the defenders get none.</li>" +
      "<li>Crevasses don’t make an area fortified (no help against bombardment) and can’t be breached. Flying units attacking across a fortified border treat it as breached while engaged.</li></ul>" +
      "<h4>Breaches</h4><ul>" +
      "<li>A <b>border segment</b> is the border shared with one adjacent area. The Librarium Technologicus, for example, has 3. Each segment is breached or not; it can’t be breached twice. Two adjacent fortified areas share a breached segment.</li>" +
      "<li>Mark it with a breach marker. An area fortified by a <b>fortification marker</b> loses the marker instead, which ends its fortification on every segment; no breach markers are placed.</li></ul>",
    src: () => "Rules p.33–35, p.38 · FAQ p.2"
  },
  {
    title: "Bombardment",
    when: () => true,
    html: () => "<p>Bombardment isn’t combat. Battle rules apply only when a bombardment happens inside a battle, such as a Thunderhawk bombardment from a combat card.</p>" +
      "<h4>Bombardment cards (32)</h4><ul>" +
      "<li><b>Orbital:</b> a <b>Precise</b> and a <b>Reckless</b> result (damage, “No Effect”, or damage + Breach).</li>" +
      "<li><b>Thunderhawk:</b> e.g. “1 Damage per Thunderhawk”, “2 Damage per Thunderhawk”, or “No Effect”.</li>" +
      "<li><b>Defense laser:</b> a Hit or Miss for <b>1, 2, 3 and 4</b> lasers.</li>" +
      "<li>An <b>Imperial Eagle</b> or <b>Chaos Star</b>, used to pick a random player or side.</li></ul>" +
      "<div class='tbl-wrap'><table class='ref-tbl'><caption>Example cards printed in the rulebook</caption><thead><tr><th scope='col'>Precise</th><th scope='col'>Reckless</th><th scope='col'>Thunderhawk</th><th scope='col'>Lasers 1 / 2 / 3 / 4</th></tr></thead><tbody>" +
      "<tr><td>1 Damage</td><td>3 Damage</td><td>No Effect</td><td>Miss / Miss / Miss / Miss</td></tr>" +
      "<tr><td>2 Damage</td><td>5 Damage + Breach</td><td>2 per Thunderhawk</td><td>Miss / Miss / Hit / Hit</td></tr>" +
      "<tr><td>3 Damage</td><td>No Effect</td><td>1 per Thunderhawk</td><td>Miss / Miss / Miss / Hit</td></tr>" +
      "<tr><td>3 Damage</td><td>No Effect</td><td>No Effect</td><td>Miss / Miss / Miss / Miss</td></tr>" +
      "</tbody></table></div>" +
      "<h4>Orbital bombardment</h4><ol>" +
      "<li>The bombarding player (usually the Traitor) chooses an area on <b>Terra</b>. Outside setup, fortified areas may be targeted.</li>" +
      "<li>He declares <b>precise</b> (more likely to cause damage, usually less of it) or <b>reckless</b> (usually more damage, more likely to miss entirely).</li>" +
      "<li>He draws a card and applies its orbital result. If he may draw several and choose one, he declares precise or reckless <b>before</b> drawing.</li></ol><ul>" +
      "<li><b>Damage:</b> he divides it among the units in the area as he likes and must assign all of it; once every enemy unit is destroyed, the rest hits his own units. <b>Heroes are never damaged by orbital bombardment.</b></li>" +
      "<li><b>Breach:</b> one fortified border segment of the target area is breached, his choice if several are fortified, and never more than one. FAQ: this applies even when the target area itself isn’t fortified. The breach is applied first, then fortification reduces the damage.</li>" +
      "<li><b>Fortification:</b> a force in a fortified area takes 2 less damage, or 1 less if the area is breached on any segment. Crevasses don’t help.</li></ul>" +
      "<h4>Thunderhawk bombardment</h4><ul>" +
      "<li>Triggered by combat card effects such as Rain of Death. Draw a card and apply its Thunderhawk result. “Per Thunderhawk” means per Thunderhawk engaged in this battle.</li>" +
      "<li>The damage hits units in the target area (or in the origin areas, if the bombarding player is the defender), engaged or not, using the orbital bombardment rules.</li>" +
      "<li><b>FAQ erratum:</b> if the passive player has no engaged units left, the active player may assign this damage to enemy Heroes.</li>" +
      "<li><b>FAQ:</b> it is special-effect damage, not regular damage. It <b>ignores fortification</b> and <b>can’t be reduced with shields</b>; the effect itself can be countered (e.g. 3 shields) only <b>before</b> the card is drawn.</li></ul>" +
      "<ul><li>Spent bombardment cards go to the bombardment discard pile.</li></ul>",
    src: () => "Rules p.3, p.5–6, p.13, p.34–36 · FAQ p.1–2"
  },
  {
    title: "Defense lasers & landings",
    when: () => true,
    html: () => "<ul>" +
      "<li>Lasers fire when the Traitor executes <b>Port Landing</b> or <b>Drop Pods</b>. He first names the landing area, then which units he’ll try to land, from his stockpile <b>or</b> from the Vengeful Spirit. All of them must come from <b>one</b> source (FAQ).</li>" +
      "<li>The Imperial player counts the defense lasers <b>in or adjacent to</b> the landing area. For each inbound unit he names that unit as the target, then draws <b>one</b> bombardment card and reads its Defense Laser result for that number of lasers.</li>" +
      "<li><b>Hit:</b> the unit is eliminated whatever its rank. <b>Miss:</b> it lands.</li>" +
      "<li>Lasers <b>can’t target Heroes</b>.</li>" +
      "<li>A laser isn’t a unit: it can’t be ordered or moved, doesn’t count toward stacking and never fights.</li>" +
      "<li>A laser is <b>destroyed</b> (returned to the box) the instant its area becomes friendly to the Traitor. It can’t be regained, and the Traitor can never use one.</li>" +
      "<li><b>Drop Pods</b> places up to 3 Chaos Space Marines or Thunderhawk Flights (any mix) in any area of its region, including enemy, contested or fortified ones, and activates that area. It can’t land in a Vengeful Spirit area or an <b>enemy</b> area of the Palace region. It isn’t an attack, but landing among enemies will probably cause a coexistence battle at the next change of initiative.</li></ul>",
    src: () => "Rules p.20, p.31, p.36–37 · FAQ p.2"
  },
  {
    title: "Area types, stacking & the Vengeful Spirit",
    when: () => true,
    html: () => "<h4>Area types</h4><ul>" +
      "<li><b>Neutral:</b> no units (an area with only Heroes is neutral). <b>Contested:</b> units of both sides. <b>Friendly:</b> only your units. <b>Enemy:</b> only your opponent’s units.</li></ul>" +
      "<h4>Stacking limits</h4><ul>" +
      "<li><b>6</b> units per side in most areas; <b>3</b> per side in fortified areas. An area fortified by a marker keeps 6.</li>" +
      "<li>Heroes and defense lasers don’t count.</li>" +
      "<li>Overstacking has no immediate penalty. Limits are checked only at a <b>change of initiative</b>, after coexistence battles. Each player then removes units of his choice from each overstacked area until he is within the limit. Removed units are <b>eliminated</b> (normal elimination rules apply).</li></ul>" +
      "<h4>The Vengeful Spirit</h4><ul>" +
      "<li>Horus’s flagship, in the upper right of the board: a two-area region. The board names its areas the <b>Command Center</b> (the circular area; stacking limit 3) and the <b>Catacombs</b> (stacking limit 6). They are adjacent to each other but to nothing on Terra. Its orders go on its own stack beside it.</li>" +
      "<li><b>Imperial:</b> the <b>Boarding Action</b> order moves units between Terra and the Vengeful Spirit, both ways.</li>" +
      "<li><b>Traitor:</b> a <b>Port Landing</b> order in the Vengeful Spirit region moves units from any spaceport area to either Vengeful Spirit area. The order sets the maximum combined combat rank moved.</li>" +
      "<li>The <b>Command Center</b> (the circular area) is fortified. Otherwise its areas follow all the normal rules.</li>" +
      "<li>FAQ: Boarding Action and Port Landing may move units into the Catacombs even if enemy units are there.</li>" +
      "<li>FAQ: the event “Thrown to Terra by his Mighty Hand” moves <b>every</b> unit and Hero on the Vengeful Spirit, of both sides, into a single area on Terra.</li></ul>",
    src: () => "Rules p.37–38, p.41 · FAQ p.1–2"
  },
  {
    title: "Traitor Armies & corruption",
    when: () => true,
    html: () => "<ul>" +
      "<li>A <b>Traitor Army</b> is an Imperial Army figure on a rank I black base. A <b>Traitor Tank Division</b> is an Imperial Tank Division figure on a rank II black base. They act like any other Traitor unit; a Traitor Tank Division moves 3.</li>" +
      "<li>Corruption happens at setup (by scenario), and through certain events and Hero abilities. The unit becomes a Traitor unit at once, under Traitor control until eliminated or the game ends, and keeps any damage it had.</li>" +
      "<li>Only the <b>12 spare black bases</b> (8 rank I, 4 rank II) can be used. The Traitor can’t borrow bases from his other units, such as Chaos Warbands.</li>" +
      "<li>When eliminated, the figure returns to the Imperial stockpile (re-mounted on a gray base and ready to return) and the base to the Traitor’s stockpile.</li>" +
      "<li>They are not <b>Chaos units</b>: that term covers every other Traitor unit.</li></ul>",
    src: () => "Rules p.13, p.23, p.37, p.40"
  },
  {
    title: "Units at a glance",
    when: () => true,
    html: () => {
      const row = (u, n, r, m, note) => "<tr><td>" + u + (note ? "<span class='sub'>" + note + "</span>" : "") + "</td><td>" + n + "</td><td>" + r + "</td><td>" + m + "</td></tr>";
      return "<div class='tbl-wrap'><table class='ref-tbl units'><thead><tr><th scope='col'>Unit</th><th scope='col'>Count</th><th scope='col'>Rank</th><th scope='col'>Move</th></tr></thead><tbody>" +
      "<tr class='grp'><th colspan='4' scope='colgroup'>Imperial (gray bases)</th></tr>" +
      row("Imperial Army", "24", "I", "2", "Can be corrupted; returns to the stockpile when eliminated") +
      row("Imperial Tank Division", "12", "II", "3", "Can be corrupted; returns to the stockpile when eliminated") +
      row("Adeptus Arbites", "3", "II", "2") +
      row("Adeptus Mechanicus", "3", "II", "2") +
      row("Space Marines", "12", "III", "3", "Blood Angels, Imperial Fists, White Scars") +
      row("Adeptus Custodes", "3", "IV", "2") +
      row("Imperial Titan", "3", "IV", "2", "Returns to the stockpile when eliminated") +
      "<tr class='grp'><th colspan='4' scope='colgroup'>Traitor (black bases)</th></tr>" +
      row("Chaos Cultists", "8", "I", "2") +
      row("Traitor Army", "–", "I", "2", "A corrupted Imperial Army") +
      row("Chaos Thunderhawk Flight", "8", "II", "5", "Flying; flying transport (carries 2)") +
      row("Chaos Warband", "8", "II", "2") +
      row("Traitor Tank Division", "–", "II", "3", "A corrupted Imperial Tank Division") +
      row("Chaos Space Marines", "16", "III", "3", "World Eaters, Death Guard, Thousand Sons, Emperor’s Children") +
      row("Daemon Horde", "8", "III", "2") +
      row("Chaos Titan", "4", "IV", "2") +
      "</tbody></table></div>" +
      "<ul><li>Move 2 is the standard allowance; the 3s and the 5 come from the Fast Units table. Units’ other special abilities, such as flying, are listed on the reference sheets.</li>" +
      "<li>Traitor colours: red Khorne, green Nurgle, blue Tzeentch, purple Slaanesh. The Chaos Space Marines, Thunderhawks, Cultists, Warbands and Daemon Hordes come two (four for Marines) in each colour; there is one Chaos Titan in each colour.</li>" +
      "<li>Heroes aren’t units; they move 3.</li></ul>";
    },
    src: () => "Rules p.3, p.5, p.10–11, p.13, p.21, p.23, p.31–32"
  },
  {
    title: "The board: regions, areas & names",
    when: () => true,
    html: () => "<ul>" +
      "<li><b>Terra</b> is the whole main map except the Vengeful Spirit. It is divided into <b>areas</b>, mostly by white lines, but plastic fortification walls also divide areas: Eternity Wall Spaceport and the Tower of Shadows are separate though no white line divides them. Some borders are <b>crevasses</b>.</li>" +
      "<li><b>The palace</b> is seven areas: the <b>Inner Palace</b>, four <b>Outer Palace</b> areas, the <b>Imperial Fists Fortress Monastery</b> and the <b>Forbidden Fortress</b>.</li>" +
      "<li><b>Spaceports:</b> Eternity Wall Spaceport, Lions Gate Spaceport, Spaceport Damocles and Spaceport Primus.</li>" +
      "<li><b>Regions</b> (strategic map): Palace, Imperial Plateau, Crucible, Lions Gate, Volcanus and Black Ministry, plus the Vengeful Spirit.<ul>" +
        "<li>Four fortress areas with <b>dashed borders</b> belong to every region they touch. The Tower of Shadows is in both Imperial Plateau and Crucible; the Bastion Eternal is in three regions.</li>" +
        "<li>The Palace region is only the seven palace areas. The Imperial Plateau is roughly horseshoe-shaped. The Black Ministry region is the nine areas around Spaceport Damocles.</li>" +
        "<li>One region border, in the north centre, is neither a crevasse nor a fortification wall. It is marked by an orange dotted line and the words “Region Division”.</li>" +
        "<li>Spaceports and factories appear on the strategic map only to help you find your way.</li></ul></li></ul>",
    src: () => "Rules p.3–4, p.17–18, p.41"
  },
  {
    title: "Cards named in the rulebooks & FAQ",
    when: () => true,
    html: () => "<p class='note'>Each side has 40 order cards, 32 combat cards and 8 Hero combat cards, and there are 30 event cards. The rulebook doesn’t list them all; these are the ones it pictures or rules on, plus the names of all 30 event cards from the Scenario Guide. Always read the card in hand.</p>" +
      "<h4>Orders</h4><ul>" +
      "<li><b>Assemble</b> (cost 1; both sides have one): move units and Heroes from any number of areas to one destination area in the region; activate it. Strategic effect: don’t activate it.</li>" +
      "<li><b>Redeploy</b> (pictured as an Imperial order; cost 2): move units and Heroes from any number of areas to any number of destinations in the region; activate each destination.</li>" +
      "<li><b>Firefight</b> (pictured as a Traitor order; cost 2): attack from 1 adjacent origin area; fight 4 iterations; activate the target and origin areas.</li>" +
      "<li><b>Assault</b> (pictured as a Traitor order; cost 3): attack from any number of adjacent origin areas; fight 6 iterations; activate the target and each origin area.</li>" +
      "<li><b>Onslaught</b> (Imperial; cost 3): attack from any number of adjacent origin areas; fight 8 iterations. Before drawing cards, look at the top 3 of your combat deck and put each on the top or bottom in any order. Activate the target and each origin area.</li>" +
      "<li><b>Drop Pods</b> (Traitor; cost 2): see Defense lasers &amp; landings. Heroes may come too.</li>" +
      "<li><b>Port Landing</b> (Traitor): lands units from the stockpile or the Vengeful Spirit, and defense lasers fire at them (the rulebook’s example lands at Eternity Wall Spaceport). In the Vengeful Spirit region, it moves units from any spaceport area to the Vengeful Spirit.</li>" +
      "<li><b>Boarding Action</b> (Imperial): moves units between Terra and the Vengeful Spirit.</li>" +
      "<li><b>Lightning Raid</b>, <b>Secret Routes</b>: movement exceptions (see Movement).</li>" +
      "<li><b>Forced March</b>, <b>Unnatural Vigor</b> (Traitor): errata, see Orders.</li>" +
      "<li><b>Surprise Attack</b> (Traitor): an enemy activation marker it lets you place must show its normal activation side, not the rout side (FAQ).</li></ul>" +
      "<p class='note'>Assault, Assemble, Firefight and Redeploy are pictured with the starting-order icon and the recycle symbol.</p>" +
      "<h4>Combat & Hero combat cards</h4><ul>" +
      "<li><b>Angels of Death</b> (Imperial; attack 1; Space Marines): eliminate 1 opposing unit regardless of its rank [5 shields counter].</li>" +
      "<li><b>Noose of Ruin</b> (Traitor; attack 1): partly covered in the rulebook’s picture. The visible text (“Chaos S…”, “Eliminate … regardles… [5 shields…”) matches Angels of Death.</li>" +
      "<li><b>Breach</b> (Traitor; attack 3): free effect for a Chaos Titan attacking a fortification: breach the fortification between it and the target area [5 shields counter].</li>" +
      "<li><b>Diversionary Tactics</b> (Traitor combat card, attack 3, attacking unit; and Traitor Hero card, attack 2, Hero): move your opponent’s initiative marker forward 1 space [5 shields counter].</li>" +
      "<li><b>Rain of Death</b> (Traitor; Chaos Thunderhawk Flight): resolve a Thunderhawk bombardment [3 shields counter].</li>" +
      "<li><b>Terrifying</b> (Traitor; Daemon Horde): rout 3 opposing units of your choice whose rank is below the Horde’s.</li>" +
      "<li><b>Will of Chaos</b> (Traitor; Chaos Space Marines): remove your normal activation marker from the target area, or flip yours there to its normal side.</li>" +
      "<li><b>Hostile Ground</b> (Imperial; defending unit): 2 damage to 1 opposing unit of your choice.</li>" +
      "<li><b>Strategic Withdrawal</b> (Imperial; defending unit): move all your units in the target area to an adjacent friendly or neutral area. FAQ: works on activated or routed units.</li>" +
      "<li><b>Lead by Example</b> (Imperial Hero): draw 1 combat card, then 2 damage to 1 opposing Hero.</li>" +
      "<li><b>Sacrifices Must Be Made</b> (Imperial Hero): put 1 damage on one of your engaged units to take a card from your combat or Hero discard pile into your hand.</li>" +
      "<li><b>Hunker Down</b> (Imperial): its 2 extra cards can’t be played that iteration (FAQ).</li>" +
      "<li><b>Armies Without Numbers</b>: FAQ: it can be used to place an Imperial Army eliminated during the battle in the area of battle.</li>" +
      "<li><b>Maleficent Plague</b> (Traitor): eliminate a Nurgle unit, then draw a bombardment card per opposing engaged unit. If countered (5 shields), the Nurgle unit is not eliminated (FAQ).</li>" +
      "<li><b>Attrition</b>: discard random cards from your opponent’s hand. You may tell Hero cards by their backs.</li></ul>" +
      "<h4>Events</h4><ul>" +
      "<li><b>Command Decisions</b> (do immediately): the current player may place up to 3 order cards from hand onto the strategic map at no initiative cost. FAQ: they can’t be executed until after a change of initiative.</li>" +
      "<li><b>Apocalypse Rains Down</b> (do immediately): the Traitor chooses 1 area and inflicts an orbital bombardment there.</li>" +
      "<li><b>The Sky Fortress Rises</b>: moves units without regard to activation and without activating; it also lets a player draw several bombardment cards and pick one.</li>" +
      "<li><b>The Righteous Heed the Call</b>: places units from the stockpile (Heroes may enter).</li>" +
      "<li><b>Thrown to Terra by his Mighty Hand</b>, <b>Vicissitudes of Chaos</b>, <b>Titans Stride the Earth</b>: see the FAQ rulings in Area types, Activation markers and Movement.</li></ul>" +
      "<h4>All 30 event cards (Scenario Guide)</h4>" +
      "<p>The scenarios’ event lists name every card; Like Unto Gods shares out the whole set (9 Imperial, 8 Traitor, 10 neutral, 3 left out). The Scenario Guide doesn’t say what the cards do.</p><ul>" +
      ["A Traitor Within the Walls ×2", "An Unholy Portal is Opened ×2", "Apocalypse Rains Down ×2", "Blocked With Corpses", "Command Decisions ×2",
       "Cyclones Rage and the Air Itself Burns", "Doom Flies Astray", "Horus’s Irresistible Gambit", "Lava Boils and Terra is Torn Asunder",
       "Tendrils of the Traitor ×2", "The Righteous Heed the Call", "The Sky Fortress Rises ×2", "The Strength of Conviction ×2",
       "The Unwavering Will to Act ×4", "The Vicissitudes of Chaos ×2", "The Warp Claims a Mighty Armada", "Thrown to Terra by his Mighty Hand",
       "Titans Stride the Earth ×2"].map(function (n) { return "<li>" + n + "</li>"; }).join("") + "</ul>",
    src: () => "Rules p.3, p.5–7, p.13, p.16–17, p.20–21, p.24, p.26–29, p.31, p.36–37 · Scenarios p.3, p.6–9 · FAQ p.1–3"
  },
  {
    title: "Deck management",
    when: () => true,
    html: () => "<ul>" +
      "<li>Eight decks: each side’s order, combat and Hero combat decks, plus the shared event and bombardment decks.</li>" +
      "<li>Each deck has its own faceup discard pile. Cards go back to the pile of the deck they came from, except recyclable orders, which go to the reserve.</li>" +
      "<li>Only the top card of a discard pile may be looked at, unless a card lets you search the pile. Several cards discarded at once may go in any order, but must all be announced.</li>" +
      "<li>When a deck’s last card is drawn, shuffle its discard pile at once to make a new deck. A deck is never reshuffled before it runs out.</li>" +
      "<li>The <b>event deck is never reshuffled</b>.</li></ul>",
    src: () => "Rules p.39"
  },
  {
    title: "FAQ & errata at a glance",
    when: () => true,
    html: () => "<h4>Errata (these replace the rulebook)</h4><ul>" +
      "<li>Components: <b>58 activation markers</b> (29 Imperial, 29 Traitor), not 57.</li>" +
      "<li>Joining battle (p.24): an origin area must be adjacent to the target and contain at least one of the attacker’s <b>units or Heroes</b>.</li>" +
      "<li>Thunderhawk bombardments (p.36): instead of “never affects Heroes”, the active player may assign the damage to enemy Heroes if the passive player has no engaged units left. It is special-effect damage, ignores fortification and can’t be reduced with shields.</li>" +
      "<li>Glossary (p.40): in a coexistence battle the Traitor player is always the <b>defender</b>.</li>" +
      "<li>Forced March and Unnatural Vigor: see Orders, regions &amp; the strategic map.</li></ul>" +
      "<h4>Rulings</h4><ul>" +
      "<li>Counter costs may be paid with any number of cards; resisting damage is limited to the iteration number.</li>" +
      "<li>Only the current player’s marker triggers special-phase icons.</li>" +
      "<li>The Traitor may execute orders placed on the strategic map during setup on his first turn.</li>" +
      "<li>Orders placed by Command Decisions wait for a change of initiative.</li>" +
      "<li>No retreats from coexistence battles. Units with routed markers fight normally in one. Opposing unsupported Heroes in one area fight a coexistence battle.</li>" +
      "<li>Your units already in the target area engage automatically, even if activated or routed.</li>" +
      "<li>When an effect routs your units, you may eliminate them instead.</li>" +
      "<li>A bombardment breach result next to a fortification places a breach marker. Flying attackers’ “breach” places none.</li>" +
      "<li>Plus the card, Hero, movement and battle rulings listed in their own sections.</li></ul>",
    src: () => "FAQ p.1–3"
  },
  {
    title: "Frequently overlooked rules",
    when: () => true,
    html: () => "<ul>" +
      "<li>Orders placed on the strategic map since the last change of initiative can’t be executed until after the next one.</li>" +
      "<li>The strategic bonus only applies when an order is executed from the strategic map.</li>" +
      "<li>Orders with the recycle symbol go to the reserve, not the discard pile.</li>" +
      "<li>Heroes not on the board can be placed whenever their owner may place units.</li>" +
      "<li>Heroes and defense lasers don’t count toward stacking limits.</li>" +
      "<li>Non-flying units pay an extra movement point to cross a crevasse.</li>" +
      "<li>Attackers stay in their origin areas during a battle, and may move in only if no defending units remain at the end.</li>" +
      "<li>If every attacking unit must cross crevasses, the defender may get the effects of fortification.</li>" +
      "<li>Card limits: up to the iteration number for playing and for resisting damage, but not for countering a special effect.</li>" +
      "<li>A card’s unit requirement applies only to its special effect, never to its damage or shields.</li>" +
      "<li>Each iteration: at most one regular special effect, plus any number of free ones.</li>" +
      "<li>When a Hero is eliminated in battle, friendly units in his area may rout.</li>" +
      "<li>Fortifications attacked by flying units count as breached while the flyers stay engaged.</li>" +
      "<li>Event movement doesn’t activate areas and ignores earlier activation.</li></ul>",
    src: () => "Rules p.44"
  },
  {
    title: "Key terms",
    when: () => true,
    html: (c) => "<dl class='terms'>" +
      "<dt>Act</dt><dd>A portion of the event deck, used when building it at setup.</dd>" +
      "<dt>Active / passive</dt><dd>In each iteration, the side that can deal damage / the side that resists it.</dd>" +
      "<dt>Attacker / defender</dt><dd>The side that started the battle with an order / the other side. In coexistence battles the Imperial player is always the attacker and the Traitor the defender.</dd>" +
      "<dt>Area · region · border segment</dt><dd>The smallest division of the map · a group of areas with one order stack · where two adjacent areas meet.</dd>" +
      "<dt>Chaos unit</dt><dd>Any Traitor unit except Traitor Armies and Traitor Tank Divisions.</dd>" +
      "<dt>Coexistence battle</dt><dd>A battle fought automatically at a change of initiative where enemy forces share an area.</dd>" +
      "<dt>Combat rank</dt><dd>I–IV, shown by the points on a unit’s base.</dd>" +
      "<dt>Current player</dt><dd>The player with initiative this round, who chooses and carries out an action.</dd>" +
      "<dt>Destination · origin · target area</dt><dd>Where moving units may go · where engaged attackers attack from · the area being attacked.</dd>" +
      "<dt>Eliminate (kill) · sacrifice</dt><dd>Remove a unit from play · voluntarily eliminate one of your own.</dd>" +
      "<dt>Free effect</dt><dd>A special effect with the free effect icon; any number may be used each iteration.</dd>" +
      (HH.scIs(c, "hta", "cha") ? "<dt>Impassible area</dt><dd>" + HH.sc(c).name + ": an area marked with a special token at setup. It can’t be entered, bombarded or affected by anything; functionally, it doesn’t exist.</dd>" : "") +
      "<dt>Neutral · contested · friendly · enemy area</dt><dd>No units · both sides’ units · only your units · only your opponent’s units.</dd>" +
      "<dt>Precise · reckless</dt><dd>The two kinds of orbital bombardment.</dd>" +
      "<dt>Regular damage</dt><dd>Damage from the active player’s cards’ attack values, as opposed to special effects.</dd>" +
      "<dt>Reserve</dt><dd>Your faceup recyclable orders, taken back into hand in a draw orders phase or with a draw action.</dd>" +
      "<dt>Retreat · rout</dt><dd>Leave a battle voluntarily · involuntarily.</dd>" +
      (HH.scIs(c, "ffb", "cha") ? "<dt>Special token</dt><dd>" + HH.sc(c).name + ": each player’s 3 one-use tokens, each cutting the initiative cost of one order placement or execution by 1." + (c.scen === "cha" ? " (Special tokens also mark the impassible areas.)" : "") + "</dd>" : "") +
      "<dt>Stockpile</dt><dd>Your units, figures, bases and Heroes that aren’t in play but may enter or re-enter it (not ones returned to the box).</dd>" +
      "<dt>Terra</dt><dd>The main map board except the Vengeful Spirit region.</dd>" +
      "<dt>Unsupported</dt><dd>A Hero with no friendly unit in his area.</dd>" +
      "<dt>Wounded · defeated</dt><dd>Hero damage states: one fewer Hero combat card · removed from the game.</dd></dl>",
    src: (c) => "Rules p.40–41 · FAQ p.1" + ({ hta: " · Scenarios p.7", ffb: " · Scenarios p.8", cha: " · Scenarios p.7–8, p.10" }[c.scen] || "")
  },
  {
    title: "Table aids you’ve agreed on",
    when: (c) => c.mod("rotate") || c.mod("pending") || c.mod("tuck"),
    html: (c) => "<ul>" +
      (c.mod("rotate") ? "<li><b>Rotated orders:</b> every order placed on the strategic map goes on turned 90°. At each change of initiative, turn them all to match the stack. Turned cards can’t be executed.</li>" : "") +
      (c.mod("pending") ? "<li><b>Pending phases:</b> put a spare marker or token on each special-phase icon crossed this round, and remove it as that phase is resolved.</li>" : "") +
      (c.mod("tuck") ? "<li><b>Reserves:</b> keep your reserve cards tucked halfway under the game board when they aren’t in use.</li>" : "") + "</ul>",
    src: (c) => HH.aidSrc(c)
  },
  {
    title: "What these sources don’t cover",
    when: () => true,
    html: (c) => "<ul>" +
      "<li><b>What the event cards do.</b> The Scenario Guide names the cards in each scenario’s event deck but doesn’t print their text; the rulebook pictures or describes only a few, and the FAQ rules on some others. Read each card as it is drawn" +
        (c.scen === "ffb" ? ", and read The Warp Claims a Mighty Armada together before you start, as the book asks" : "") + ".</li>" +
      "<li><b>Each Hero’s individual abilities</b> are printed only on the two <b>reference sheets</b>, which also list units’ special abilities such as flying and fast movement.</li>" +
      "<li><b>Full order and combat card lists</b>: only the order and combat cards named above appear in the rulebook and FAQ.</li>" +
      (c.scen === "bab" ? "<li><b>Area names on the setup diagram.</b> The Brother Against Brother diagram points at areas without naming them. This page names them from the rulebook’s pictures of the board (Rules p.4, p.33, p.38). It describes by position the open areas, which have no names, and the factory north-east of the Palace, whose label is too small to read there.</li>" : "") +
      (HH.scIs(c, "hta", "cha") ? "<li><b>“Destroyed instead of placed.”</b> A unit that must be placed in an impassible area is destroyed instead" +
        (c.scen === "cha" ? " (Holy Terra Asunder’s unit-setup rule: Cry Havoc doesn’t repeat it, but says its impassible areas work the same way)" : "") +
        ". The book doesn’t say whether it then goes to the stockpile or back to the box.</li>" : "") +
      "<li><b>Defense lasers out of the 1–4 range</b>: every bombardment card pictured in the rulebook prints laser results for 1, 2, 3 and 4 lasers only. The rulebook doesn’t say what happens with none in range or with more than four.</li></ul>",
    src: (c) => "Rules p.5–6, p.9, p.12, p.31, p.36" + (c.scen === "bab" ? ", p.4, p.33, p.38" : "") + " · Scenarios p.3–10"
  }
];

/* =============================================================================
   TEACHING SCRIPT — teaching order: hook & win → shape of a turn → actions & why →
   central mechanic → battles/Heroes/orbit → inserts for the options selected → "don't worry yet"
   ============================================================================= */
// Teaching-script insert for each scenario (Scenarios p.3–10)
HH.teachScen = {
  bab: "<p>The book’s setup diagram puts everything in place. The Imperium holds the Palace, every fortress, the factories and two spaceports, Lions Gate and Damocles, with all five of its Heroes on the board. Mortarion holds Eternity Wall Spaceport, Angron holds Spaceport Primus, and Horus waits aboard the Vengeful Spirit. The event deck is ten set cards in three acts.</p>",
  hu: "<p>In Heresy Unheralded we deploy by choice. The Traitor claims one spaceport with a Warband, the Imperium garrisons two others with three Imperial Armies each, and a second Warband takes the last. Then the Imperium places the rest within the book’s limits, and the Traitor puts Horus and seven units aboard the Vengeful Spirit and four more units on each of his spaceports. The events are the same as Brother Against Brother’s.</p>",
  hta: "<p>In Holy Terra Asunder the battlefield itself changes over the course of the game. First we take turns, Traitor first, marking four impassible areas with special tokens: never two side by side, and never the Inner Palace, a spaceport or the Vengeful Spirit. Nothing can enter, bombard or affect an impassible area. Then we deploy by choice, as in Heresy Unheralded: Warbands and Imperial Armies claim the four spaceports, each side places the rest within the book’s limits, and a unit that would have to go into an impassible area is destroyed instead.</p>",
  ffb: "<p>In Fortune Favors the Bold each of us gets three special tokens. When you place one of your orders, or execute one from the map or your hand, you may spend one token to make it cost one less, down to zero: only one token at a time, and a spent token is gone. Before we start, we both read the event card The Warp Claims a Mighty Armada: it threatens the Imperial hold-out victory, though it may never come out. We deploy by choice, as in Heresy Unheralded: Warbands and Imperial Armies claim the four spaceports, then each side places the rest within the book’s limits.</p>",
  lug: "<p>Like Unto Gods gives us the most choice. We deploy by choice, as in Heresy Unheralded: Warbands and Imperial Armies claim the four spaceports, then each side places the rest within the book’s limits. Then we build the event deck together: the Imperial player has nine event cards and the Traitor eight, and each of us puts two facedown in Act I, two in Act II and one in Act III. Random neutral cards are added and others trimmed, leaving acts of four, four and two. Each of us also adds any four order cards he likes to his starting hand.</p>",
  cha: "<p>Cry Havoc throws in everything. Four impassible areas, chosen in turn as in Holy Terra Asunder, simply don’t exist for the game. Each of us has three special tokens, as in Fortune Favors the Bold: spend one to make placing or executing an order cost one less. We deploy by choice, as in Heresy Unheralded: Warbands and Imperial Armies claim the four spaceports, then each side places the rest within the book’s limits. The event deck is ten event cards dealt at random from all thirty, and each of us adds one random order from his deck to his starting hand.</p>"
};

HH.teach = {
  intro: "A ~5-minute teach for the scenario, sides and options selected above. Read it aloud, or copy it and adapt it. Every rule in it comes from the rulebook, the Scenario Guide and the FAQ cited on this page.",
  sections: [
    {
      h: "The hook — and how each side wins",
      body: () => "<p>It’s the Siege of Terra. Warmaster Horus has turned against the Emperor, and brother fights brother. His fleet hangs in orbit: one of us lands the Traitors on the planet, the other holds it for the Emperor. There are three ways to win, and each ends the game on the spot:</p><ul>" +
        "<li><b>Kill the enemy commander.</b> The Emperor dies, the Traitor wins; Horus dies, the Imperium wins.</li>" +
        "<li><b>Hold all four spaceports</b>, alone, once a marker has reached the Spaceport Victory space.</li>" +
        "<li><b>Run out the clock.</b> If either initiative marker reaches the last space of the track, relief legions arrive and the Imperial player wins.</li></ul>"
    },
    {
      h: (c) => "Tonight’s scenario: " + HH.sc(c).name,
      body: (c) => {
        var s = HH.sc(c);
        return (c.mode === "first"
          ? "<p>We’re playing <b>Brother Against Brother</b>, the rulebook’s recommended first scenario, with sides chosen at random or by agreement.</p>"
          : c.mode === "mentor"
          ? "<p>We’re playing <b>Brother Against Brother</b>, the learning scenario, and as the rulebook suggests, the experienced player takes the Traitor.</p>"
          : "<p>We settled scenario and sides by agreement, a coin toss or a revealed bombardment card: tonight is Scenario " + s.n + ", <b>" + s.name + "</b>.</p>") +
          HH.teachScen[s.id] +
          "<p>Before play, the Traitor gets a head start: <b>" + s.corr + " corruption draws</b>, turning Imperial Armies or Tank Divisions of his choice Traitor on a Chaos Star; <b>" + s.bomb + " orbital bombardments</b>; and four Port Landing or Drop Pods orders placed free on the strategic map, ready for his first turn.</p>";
      }
    },
    {
      h: "The shape of a turn — the initiative track",
      body: () => "<p>There are no fixed turns. Whoever is <b>furthest behind</b> on the initiative track acts, and actions cost initiative: you move your marker forward that many spaces (a few cost nothing). The Traitor starts on top, so he goes first. Pass your opponent and initiative changes: battles are fought wherever both sides share an area, stacking limits are checked, and then he acts until he passes you.</p>" +
        "<p>Icons on the track trigger <b>Event</b> cards, <b>Draw Orders</b> (refill your hand to six) and <b>Refresh</b> (clear activation markers and flip routed ones back). Each fires once, when the acting player’s marker first reaches it.</p>"
    },
    {
      h: "Your five actions — and why you’d take each",
      body: () => "<ul>" +
        "<li><b>Place an order</b>, 1 point: facedown on one of the seven stacks of the strategic map. Cheap and hidden, and executing it later from there adds the card’s strategic bonus.</li>" +
        "<li><b>Execute from the map</b>, 1 point whatever the card costs, but not an order placed since the last change of initiative. That’s the reward for planning ahead.</li>" +
        "<li><b>Execute from hand</b>, 0 to 3 points, one per skull: immediate, in any region, but no bonus.</li>" +
        "<li><b>Bury an order</b>, 1 point: send a stack’s top card to the bottom.</li>" +
        "<li><b>Draw an order</b>, 1 point: from your reserve or your deck.</li></ul>"
    },
    {
      h: "The central idea — regions and activation",
      body: () => "<p>Every order works in <b>one region</b> and <b>activates</b> the areas it names: put your marker there. You can’t order units out of your activated areas until a Refresh, so each order commits troops. Most units move 2, fast ones more, and a crevasse costs 2. You can only move through friendly or empty areas; enemies need an attack order.</p>"
    },
    {
      h: "Battles and Heroes",
      body: () => "<p>Attack orders start battles, and so does sharing an area with the enemy when initiative changes. Each side draws combat cards equal to <b>half its engaged units’ total rank</b>, rounded up (rank is the points on the base), plus <b>two Hero cards</b> if a Hero fights. The order sets the iterations: Firefight 4, Assault 6, Onslaught 8.</p>" +
        "<p>Each iteration, the active player plays up to as many cards as the iteration number, deals their attack values as damage, and may use one card’s special effect plus any free ones. The passive player discards up to as many cards to block one damage per shield, or pays shields to cancel an effect. Damage equal to a unit’s rank kills it. Roles swap every iteration, and from the second on the active player may retreat. Fortified defenders take 2 off the attacker’s damage in each of his active iterations.</p>" +
        "<p>Heroes aren’t units. They bring Hero cards and the abilities on your reference sheet, and battle damage reaches them only once their units are gone, though some cards hit them directly. Wounded, a Hero brings one card; Defeated, he’s gone, and his units there may rout.</p>"
    },
    {
      h: "From orbit",
      body: () => "<p>The Traitor bombards from orbit: declare <b>precise</b> (likelier to hit) or <b>reckless</b> (bigger, likelier to miss), then draw a bombardment card. Drop Pods and Port Landing bring troops down, and the Imperial <b>defense lasers</b> fire one card per incoming unit; a hit destroys it. The Imperium strikes back with Boarding Actions on the Vengeful Spirit.</p>"
    },
    {
      h: (c) => c.first ? "Before we start: building the pieces" : "Before we start: reset the pieces",
      body: (c) => c.first
        ? "<p>First game for this box, so as we talk, push each figure onto a <b>base of its rank</b>: gray Imperial, black Traitor, legion discs under the Marines. Rank decides the cards a unit brings and the damage it can take.</p>"
        : "<p>The pieces are built. Just check that last game’s Traitor Armies and Tank Divisions are back on <b>gray bases</b>.</p>"
    },
    {
      h: (c) => c.seat === "imp" ? "Tips for the Imperial player" : c.seat === "trt" ? "Tips for the Traitor player" : "Tips for each side",
      body: (c) => {
        var imp = "<p><b>Imperial:</b> take the fight to Horus with <b>Boarding Action</b> orders, and bring several Heroes. Stacking limits are only checked at a change of initiative, so you may board with more than three units, as long as the Boarding Action is carried out before a change of initiative forces you to cut back. Don’t abandon Palace areas: Drop Pods can’t land in an enemy Palace area, but an empty one is fair game.</p>";
        var trt = "<p><b>Traitor:</b> Drop Pods can’t land in an enemy Palace area, but empty ones are fair game, and a beachhead inside makes reinforcing easier. Heroes, Horus included, can land from your stockpile or the Vengeful Spirit: Horus dropped into the Palace to attack the Emperor can turn the tables.</p>";
        return c.seat === "imp" ? imp : c.seat === "trt" ? trt : imp + trt;
      }
    },
    {
      when: (c) => c.mod("rotate") || c.mod("pending") || c.mod("tuck"),
      h: "Table aids we’re using",
      body: (c) => "<ul>" +
        (c.mod("rotate") ? "<li>New orders on the map go on <b>turned 90 degrees</b> until the next change of initiative; turned cards can’t be executed.</li>" : "") +
        (c.mod("pending") ? "<li>A <b>token</b> marks each phase icon crossed until that phase is done.</li>" : "") +
        (c.mod("tuck") ? "<li>Reserves stay <b>tucked half under the board</b>.</li>" : "") + "</ul>"
    },
    {
      h: "Don’t worry about these until they come up",
      body: () => "<p>Flying and transport, the fine print on crevasses and breaches, retreat and rout markers, the bombardment card tables, the Traitor’s 12 spare bases for corruption, Hero ability timing, and individual card rulings. They’re all in the reference below. And each event card explains itself: we read it out when it’s drawn.</p>"
    }
  ]
};
