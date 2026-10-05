/* =============================================================================
   StarCraft: The Board Game — Setup & Reference Utility · data
   Sources, as cited on the page (PRINTED page numbers):
     Base     StarCraft: The Board Game, Rules of Play (2007), p.1–48
     BW       Brood War expansion, Rules of Play (Dec 2008). The PDF holds printed p.1–12, p.18 and p.20;
              the scenario pages (p.13–16) and p.17 are not in it.
     FAQ      FAQ & errata for the base game and Brood War (updated January 2, 2009), p.1–3; Brood War part from p.2.
     FAQ v1.1 (January 4, 2008) is repeated in full by the 2009 FAQ, so every ruling cites the 2009 FAQ.
   Precedence: FAQ > BW > Base. Brood War rules apply only when Brood War is selected (BW p.5: its rules,
   except the optional rules and game modes, supersede the core rules when playing with the expansion).
   ============================================================================= */
var SC = {};

SC.expMeta = {
  base: { name: "Core Game", cls: "tag-core" },
  bw:   { name: "Brood War", cls: "tag-bw" },
  var:  { name: "Variant", cls: "tag-var" },
  opt:  { name: "BW Option", cls: "tag-opt" },
  mode: { name: "Game Mode", cls: "tag-mode" },
  faq:  { name: "FAQ", cls: "tag-faq" }
};

SC.expansions = [
  { id: "base", short: "StarCraft: The Board Game", year: "2007",
    blurb: "The core game: six factions of Terran, Protoss and Zerg, 12 planets, 2 to 6 players. Always in play." },
  { id: "bw", short: "Brood War", year: "2008",
    blurb: "New units for every faction, Leadership cards and heroes, the Special Order Pool, Defend orders, new planets with strategic areas, optional rules, and the Survival and Scenario game modes." }
];

/* The six factions (Base p.2) */
SC.F = {
  raynor:   { name: "Jim Raynor",          race: "Terran",  color: "Blue" },
  mengsk:   { name: "Arcturus Mengsk",     race: "Terran",  color: "Red" },
  tassadar: { name: "Tassadar",            race: "Protoss", color: "Yellow" },
  aldaris:  { name: "Aldaris",             race: "Protoss", color: "Orange" },
  qob:      { name: "The Queen of Blades", race: "Zerg",    color: "Purple" },
  overmind: { name: "The Overmind",        race: "Zerg",    color: "Green" }
};
SC.FAC_ORDER = ["raynor", "mengsk", "tassadar", "aldaris", "qob", "overmind"];

SC.modes = [
  { id: "standard", name: "Standard game", blurb: "Race to 15 conquest points, a special victory, or be the last faction standing.", src: "Base p.2, p.17" },
  { id: "survival", requires: "bw", name: "Survival (Brood War)", blurb: "Galactic Conquest with sharper teeth: lose your last base and you are out.", src: "BW p.11 · FAQ p.3" },
  { id: "scenario", requires: "bw", name: "Scenario (Brood War)", blurb: "Story missions with their own map, factions and victory conditions.", src: "BW p.11–12" }
];

SC.modules = [
  { id: "gc", requires: "base", group: "Core variant", name: "Galactic Conquest",
    summary: "No conquest points: the last faction standing wins",
    description: "The End Draws Near cards are removed and the Event deck recycles its Stage III cards; the only way to win is elimination. Combines with Team Play.", src: "Base p.42" },
  { id: "team", requires: "base", group: "Core variant", name: "Team Play",
    summary: "Four or six players in teams of two",
    description: "Teams first, then random factions; teammates sit apart, can't attack each other and win together on team totals.", src: "Base p.42–43" },
  { id: "rf", requires: "bw", group: "Brood War option", name: "Randomized Factions",
    summary: "Each player is dealt a random Faction Sheet", description: "The Brood War Faction Sheets share a common back, so shuffle them and deal one to each player.", src: "BW p.11" },
  { id: "dso", requires: "bw", group: "Brood War option", name: "Disposable Special Orders",
    summary: "Always execute special orders, losing any that don't fit your pool",
    description: "A special order that can't (or won't) go into your Special Order Pool is executed anyway and removed from the game.", src: "BW p.11" },
  { id: "mspt", requires: "bw", group: "Brood War option", name: "More Starting Planet Tokens",
    summary: "Draw three planets, place two", excludes: "lg",
    description: "More control over galaxy setup: each player draws three starting planet tokens but still places two planets. This page's call: it can't be combined with Larger Galaxy here, because the two options contradict each other about the third planet (BW p.11 otherwise lets any number of options be combined).", src: "BW p.11" },
  { id: "lg", requires: "bw", group: "Brood War option", name: "Larger Galaxy",
    summary: "Three planets each and 25 points to win", excludes: "mspt",
    description: "Each player places a third planet; no special victory Leadership cards; 25 conquest points to win. This page's call: it can't be combined with More Starting Planet Tokens here, because the two options contradict each other about the third planet (BW p.11 otherwise lets any number of options be combined).", src: "BW p.11" },
  { id: "nlc", requires: "bw", group: "Brood War option", name: "No Leadership Cards",
    summary: "Start with your Special Victory card only",
    description: "A more traditional game: each player starts with their Special Victory Leadership card and the Choose Leadership Cards steps are skipped.", src: "BW p.11" },
  { id: "fast", requires: "bw", group: "Survival option", name: "Faster Survival",
    summary: "Each faction keeps only 3 bases", description: "The FAQ's recommended option to shorten Survival games: return all but 3 bases of each faction to the box.", src: "FAQ p.3" }
];

/* Which options can be chosen for a configuration s = { has(set), mode, p }. app.js and the harness share this. */
SC.modAvailable = function (mod, s) {
  if (mod.requires && !s.has(mod.requires)) return false;
  if (mod.id === "gc") return s.mode === "standard";          // Survival already includes it; scenarios set their own victory conditions
  if (mod.id === "team") return s.mode !== "scenario" && (s.p === 4 || s.p === 6);
  if (mod.id === "fast") return s.mode === "survival";
  return s.mode === "standard";                                // BW optional rules can't be used with a game mode (BW p.11)
};
SC.modWhyNot = function (mod, s) {
  if (mod.requires && !s.has(mod.requires)) return "Needs Brood War";
  if (mod.id === "gc" && s.mode === "survival") return "Included in Survival, which follows all the Galactic Conquest rules (BW p.11)";
  if ((mod.id === "gc" || mod.id === "team") && s.mode === "scenario") return "This page's call: scenarios set their own victory conditions and teams (BW p.12)";
  if (mod.id === "team") return "Team Play needs 4 or 6 players (Base p.42)";
  if (mod.id === "fast") return "Only for the Survival game mode (FAQ p.3)";
  return "Brood War's optional rules can't be combined with a game mode (BW p.11)";
};

/* Citation tidy-up used by app.js when it renders a src line: merges the parts that cite the same document,
   sorts the pages and joins neighbouring pages into ranges, in the order Base · BW · FAQ.
   e.g. "Base p.7–8 · Base p.42 · FAQ p.1" -> "Base p.7–8, p.42 · FAQ p.1" */
SC.cite = function (s) {
  var docs = ["Base", "BW", "FAQ"], pages = {}, other = [];
  String(s || "").split(" · ").forEach(function (part) {
    part = part.trim();
    if (!part) return;
    var m = part.match(/^(Base|BW|FAQ) (p\.\d+(?:–\d+)?(?:, p\.\d+(?:–\d+)?)*)$/);
    if (!m) { other.push(part); return; }
    pages[m[1]] = pages[m[1]] || [];
    m[2].split(", ").forEach(function (r) {
      var mm = r.match(/p\.(\d+)(?:–(\d+))?/);
      pages[m[1]].push([+mm[1], mm[2] ? +mm[2] : +mm[1]]);
    });
  });
  return docs.filter(function (d) { return pages[d]; }).map(function (d) {
    var merged = [];
    pages[d].sort(function (a, b) { return a[0] - b[0] || a[1] - b[1]; }).forEach(function (r) {
      var last = merged[merged.length - 1];
      if (last && r[0] <= last[1] + 1) last[1] = Math.max(last[1], r[1]);
      else merged.push([r[0], r[1]]);
    });
    return d + " " + merged.map(function (r) { return "p." + r[0] + (r[1] > r[0] ? "–" + r[1] : ""); }).join(", ");
  }).concat(other).join(" · ");
};

/* ---------- small helpers used by the content functions ---------- */
SC.list = function (a) { return a.length <= 1 ? a.join("") : a.slice(0, -1).join(", ") + " and " + a[a.length - 1]; };
SC.names = function (ids) { return SC.list(ids.map(function (f) { return SC.F[f].name; })); };
SC.raceIds = function (c, race) { return SC.FAC_ORDER.filter(function (f) { return SC.F[f].race === race && c.maybe(f); }); };
SC.lead = function (c) { return c.has("bw") && c.mode !== "scenario" && !c.mod("nlc"); };   // Choose Leadership Cards steps happen
SC.scoring = function (c) { return c.mode !== "scenario" && !c.mod("gc"); };                   // conquest points decide the game
SC.aldarisOn = function (c) { return SC.scoring(c) && !c.mod("lg") && c.maybe("aldaris"); };   // his objective can be in play
SC.rg = function (c) {   // Regrouping step numbers (Base p.15–16 · FAQ p.1; BW p.20)
  return c.has("bw")
    ? { destroy: 1, lose: 2, gain: 3, retrieve: 4, lead: 5, cp: 6, normal: 7, special: 8, events: 9, discard: 10, pass: 11 }
    : { destroy: 1, lose: 2, gain: 3, retrieve: 4, cp: 5, normal: 6, special: 7, events: 8, discard: 9, pass: 10 };
};
SC.factionTable = function (c) {
  var ids = c.facs.length ? c.facs : SC.FAC_ORDER;
  return "<table class='ref-table'><thead><tr><th>Faction (leader)</th><th>Race</th><th>Colour</th></tr></thead><tbody>" +
    ids.map(function (f) { return "<tr><td>" + SC.F[f].name + "</td><td>" + SC.F[f].race + "</td><td>" + SC.F[f].color + "</td></tr>"; }).join("") +
    "</tbody></table>";
};
SC.tablePick = function (c) {
  if (!c.facs.length) return "";
  var left = c.p - c.facs.length;
  return "<p class='inline-note'>At this table: " + SC.names(c.facs) + (left > 0 ? " (" + left + " still to choose)" : "") + ".</p>";
};

/* =============================================================================
   SETUP PHASES — c = { has(set), p, mode, mod(id), facs[], complete, fac(id), maybe(id) }
   ============================================================================= */
SC.phases = [
  {
    title: "Brood War: combine the boxes",
    steps: [
      { when: function (c) { return c.has("bw"); }, exp: "bw",
        t: "Swap in the Brood War Combat & Technology cards",
        d: "<ul><li>Some core cards are revised. Remove these from the core Combat and Technology decks and store them for core-only games:<ul>" +
          "<li><b>Terran</b> — Combat cards 4, 5, 15, 17, 18; Technology: Siege Mode (2×), Lockdown (2×).</li>" +
          "<li><b>Zerg</b> — Combat cards 6, 10, 11, 12, 14; Technology: Metabolic Boost, Improved Flyer Attack (2×), Dark Swarm (2×), Guardian Aspect.</li>" +
          "<li><b>Protoss</b> — Combat cards 1, 2, 9; Technology: Increased Reaver Capacity (3×), Summon Archon.</li></ul></li>" +
          "<li>Add each faction's Brood War Combat and Technology cards (marked with the Brood War icon) to its decks. Combat decks now hold <b>20</b> cards instead of 18.</li></ul>",
        src: "BW p.4–5" },
      { when: function (c) { return c.has("bw"); }, exp: "bw",
        t: "Swap in the Brood War tokens, sheets & figures",
        d: "<ul><li>Remove these core building tokens and store them: <b>Terran</b> Barracks II–III and Starport I–III; <b>Protoss</b> Gateway II–III and Robotics Facility I.</li>" +
          "<li>Add the Brood War building, module and order tokens to each faction's components. Protoss also gain a level II <b>Robotics Bay</b>, which has no core counterpart.</li>" +
          "<li>Play with the 6 Brood War <b>Faction Sheets</b> instead of the core ones.</li>" +
          "<li>Snap each Brood War flying unit (Corsair, Devourer, Valkyrie) onto a clear plastic stand, then add all the new figures to their factions.</li>" +
          "<li>Shuffle the Brood War Event cards and Resource cards into the matching decks, and mix the 6 new planet tiles, their starting planet tokens and the 5 navigation routes into the core pools.</li></ul>",
        src: "BW p.2–3, p.5–6" }
    ]
  },
  {
    title: "Scenario setup (replaces the normal setup)",
    steps: [
      { when: function (c) { return c.mode === "scenario"; }, exp: "mode",
        t: "Agree on a scenario",
        d: "<ul><li>Decide which scenario to play <b>before</b> setup. Most scenarios can only be played by a certain number of players; some are variable.</li>" +
          "<li>Each scenario gives its own setup, factions, play order, victory conditions and special rules. They are printed on Brood War p.13–16, <b>which are not in the rulebook PDF this page was built from</b>: take those details from the scenario itself.</li>" +
          "<li>Then follow the steps below <i>instead of</i> the normal game setup.</li></ul>",
        src: "BW p.11–12" },
      { when: function (c) { return c.mode === "scenario"; }, exp: "mode",
        t: "Choose the first player & factions",
        d: "<ul><li>Randomly determine which player chooses a faction first.</li>" +
          "<li>Each player chooses a faction from those listed in the scenario (only those).</li>" +
          "<li>After factions are chosen, the player the scenario names becomes the <b>first player</b>.</li>" +
          "<li>Sit in the scenario's <b>play order</b>. Example: for Queen of Blades, Jim Raynor, Tassadar, the Raynor player sits to the Queen of Blades player's left and the Tassadar player to her right.</li></ul>",
        src: "BW p.12" },
      { when: function (c) { return c.mode === "scenario"; }, exp: "mode",
        t: "Gather components, the conquest track & tokens",
        d: "<ul><li>Each player takes their faction's Faction Sheet, tokens, cards and plastic figures. Some scenarios give extra pieces (such as figures of another colour) or start you with particular buildings or modules on your Faction Sheet.</li>" +
          "<li>Place the <b>conquest point track</b>: most scenarios use it, even to count rounds (below).</li>" +
          "<li>Put all unused depletion, guard and resource tokens to one side of the play area.</li>" +
          "<li><b>Counting rounds:</b> if the scenario lasts a set number of rounds, put an unused conquest marker on the <b>1</b> space and move it up one space at the end of each Regrouping Phase.</li></ul>",
        src: "BW p.12" },
      { when: function (c) { return c.mode === "scenario"; }, exp: "mode",
        t: "Prepare the Event deck",
        d: "<ul><li>Remove the cards (or random cards) the scenario lists. If it removes none, use the whole deck.</li>" +
          "<li>Shuffle each stage separately, then stack Stage I on top of Stage II on top of Stage III.</li></ul>",
        src: "BW p.12" },
      { when: function (c) { return c.mode === "scenario"; }, exp: "mode",
        t: "Set up the galaxy from the scenario",
        d: "<ul><li>Place the planets, z-axis navigation routes (shown with dotted lines), bases and each faction's starting units exactly as the scenario shows, placing starting units on the specified planets beginning with the first player.</li>" +
          "<li><b>No Leadership cards</b> unless the scenario says so. A scenario that starts you with a hero also gives you that hero's Leadership card.</li>" +
          "<li>Teams: many scenarios split the factions into teams; use the core Team Play rules (Base p.42).</li></ul>",
        src: "BW p.12 · Base p.42" },
      { when: function (c) { return c.mode === "scenario"; }, exp: "faq",
        t: "Scenario errata & rulings",
        d: "<ul><li><b>Eye of the Storm</b> starting forces: the Overmind starts on <b>Antiga Prime</b> (instead of Halcyon) and <b>Avernus Station</b> (instead of Torus); the Queen of Blades starts on <b>Hydrax</b> (instead of Braken); Arcturus Mengsk starts on <b>Dylar IV</b> (instead of Antiga Prime).</li>" +
          "<li><b>Eye of the Storm</b> with fewer than six players: a player controlling several factions treats both colours as a single faction, so uses one Combat deck and one Technology deck and may mix unit colours in areas.</li>" +
          "<li><b>Quest for Uraj and Khalis:</b> the Tassadar player starts on <b>Tarsonis</b> (instead of Bhekar Ro).</li>" +
          "<li><b>Trump Card:</b> ignore the starting units on the Overmind's <i>Endless Hunger</i> Leadership card; the Overmind gets only the scenario's Starting Forces.</li></ul>",
        src: "FAQ p.2–3" },
      { when: function (c) { return c.mode === "scenario"; }, exp: "mode",
        t: "Separate decks & draw Combat cards",
        d: "<ul><li>Each player separates their Combat deck from their Technology deck and puts each on its space on the Faction Sheet. If the scenario adds Technology cards to the Combat deck (or puts them in play), do it now.</li>" +
          "<li>Shuffle your Combat deck and draw Combat cards up to your hand limit (normally 6; the Terran hand limit printed on the Faction Sheet is 8).</li></ul>",
        src: "BW p.12 · Base p.8, p.16" }
    ]
  },
  {
    title: "Factions & the first player",
    steps: [
      { when: function (c) { return c.mode !== "scenario"; }, exp: "base",
        t: "Choose the first player",
        d: "<ul><li>Choose a player at random to take the <b>first player token</b> and place it in front of them. Whoever holds it is the <i>first player</i>.</li>" +
          "<li>The token passes to the left at the end of every round.</li></ul>",
        src: "Base p.8, p.16" },
      { when: function (c) { return c.mode !== "scenario"; }, exp: function (c) { return c.mod("team") ? "var" : (c.mod("rf") ? "opt" : "base"); },
        t: "Choose factions",
        d: function (c) {
          var d = "<ul>";
          if (c.mod("team")) d += "<li><b>Team Play:</b> first decide the teams of two, <i>then</i> determine each player's faction at random (so teammates may be the same race or not). Sit teammates as far apart as possible: " +
            (c.p === 4 ? "Team 1, Team 2, Team 1, Team 2." : "Team 1, Team 2, Team 3, Team 1, Team 2, Team 3.") + "</li>";
          if (c.mod("rf")) d += "<li><b>Randomized Factions:</b> shuffle the Brood War Faction Sheets (they share a common back) and deal one to each player: that is your faction for the game.</li>";
          if (!c.mod("team") && !c.mod("rf")) d += "<li>Starting with the first player and going clockwise, each player chooses a faction and puts its <b>Faction Sheet</b> in front of them, the centre of their play area. Players may instead determine their races at random.</li>";
          d += "<li>" + (c.facs.length ? "The factions chosen:" : "The six factions (two per race; factions of the same race are <b>not</b> allied):") + SC.factionTable(c) + "</li>";
          if (c.has("bw")) d += "<li>Use the <b>Brood War Faction Sheets</b>. They add the Special Order Pool, more module spaces and a space for the Combat deck, but no longer show special victory objectives or starting units: those are on the Leadership cards.</li>";
          return d + "</ul>" + SC.tablePick(c);
        },
        src: function (c) {
          var s = ["Base p.2, p.6, p.8"];
          if (c.mod("team")) s.push("Base p.42");
          if (c.has("bw")) s.push(c.mod("rf") ? "BW p.3, p.6, p.11" : "BW p.3, p.6");
          return s.join(" · ");
        } },
      { when: function (c) { return c.mode !== "scenario"; }, exp: function (c) { return c.mod("fast") ? "faq" : (c.has("bw") ? "bw" : "base"); },
        t: "Gather faction components",
        d: function (c) {
          var d = "<ul><li>Each player takes everything in their faction's colour: plastic figures, Combat deck, Technology deck, <b>6</b> standard and <b>3</b> special order tokens, <b>6</b> base tokens, <b>15</b> worker tokens, <b>7</b> transport tokens, building tokens and module tokens, plus a reference sheet (these are not faction-specific).</li>" +
            "<li>Core building / module tokens per faction: " + [["Terran", "8 / 8"], ["Protoss", "6 / 7"], ["Zerg", "6 / 4"]].filter(function (r) { return SC.raceIds(c, r[0]).length; }).map(function (r) { return r[0] + " " + r[1]; }).join(" · ") + ".</li>";
          if (c.has("bw")) {
            d += "<li><b>Brood War</b> adds each faction's <b>Defend order token</b>, <b>3 module tokens</b> (Defensive, Assist, Offensive) and " +
              (c.mod("nlc") ? "its <b>Special Victory Leadership card</b> (No Leadership Cards)" : "its <b>7 Leadership cards</b>") + ".</li>";
            var tp = [["Terran", "5"], ["Protoss", "4"]].filter(function (r) { return SC.raceIds(c, r[0]).length; });
            if (tp.length) d += "<li>Brood War building tokens (replacing the core ones you stored, plus the new Protoss Robotics Bay II): " + tp.map(function (r) { return r[0] + " " + r[1] + " per faction"; }).join(" · ") + "." + (SC.raceIds(c, "Zerg").length ? " The Zerg get none." : "") + "</li>";
            var pr = SC.raceIds(c, "Protoss");
            if (pr.length) d += "<li>" + (pr.length === 1 ? SC.names(pr) + " takes" : "Each Protoss faction takes") + " <b>2 mind control tokens</b>.</li>";
            if (c.maybe("mengsk")) d += "<li>Arcturus Mengsk's <b>Star order token</b> and <b>2 special conquest point tokens</b> are used only if he chooses the matching Leadership cards.</li>";
          }
          if (c.mod("fast")) d += "<li><b>Faster Survival:</b> return all but <b>3 bases</b> of each faction to the box, so no one can build more than 3 bases in the whole game.</li>";
          return d + "</ul>";
        },
        src: function (c) {
          var s = ["Base p.3, p.8"];
          if (c.has("bw")) s.push("BW p.2, p.4, p.7");
          if (c.mod("fast")) s.push("FAQ p.3");
          return s.join(" · ");
        } },
      { when: function (c) { return c.mode !== "scenario"; }, exp: function (c) { return c.mode === "survival" ? "mode" : (c.mod("gc") ? "var" : "base"); },
        t: "Place the conquest point track",
        d: function (c) {
          return "<ul><li>Put the conquest track beside the play area and every faction's conquest marker on its <b>0</b> space.</li>" +
            "<li>Past 15 points, flip your marker to its <b>+15</b> side and keep moving it along the track.</li>" +
            (c.mode === "survival" ? "<li><b>Survival:</b> conquest points are not accumulated. Each time you would receive a conquest point, you receive a <b>resource token</b> of your choice instead.</li>"
              : (c.mod("gc") ? "<li><b>Galactic Conquest:</b> players do not acquire conquest points in this variant.</li>" : "")) + "</ul>";
        },
        src: function (c) { return "Base p.4, p.8" + (c.mode === "survival" ? " · BW p.11" : (c.mod("gc") ? " · Base p.42" : "")); } },
      { when: function (c) { return c.mode !== "scenario"; }, exp: function (c) { return c.has("bw") ? "bw" : "base"; },
        t: function (c) { return c.has("bw") ? "Place depletion, resource & guard tokens" : "Place the depletion tokens"; },
        d: function (c) {
          return "<ul><li>Pile the <b>depletion tokens</b>" + (c.has("bw") ? ", the <b>resource tokens</b> and the <b>guard tokens</b>" : "") + " beside the play area, where everyone can reach them.</li>" +
            "<li>If the depletion tokens run out, use coins or other markers to show partially depleted and depleted areas.</li></ul>";
        },
        src: function (c) { return "Base p.8, p.22" + (c.has("bw") ? " · BW p.20" : ""); } },
      { when: function (c) { return c.mode !== "scenario"; }, exp: function (c) { return c.mod("gc") ? (c.mode === "survival" ? "mode" : "var") : (c.mod("nlc") ? "opt" : (c.has("bw") ? "bw" : "base")); },
        t: "Prepare the Event deck",
        d: function (c) {
          var d = "<ul><li>Separate the <b>Stage I, II and III</b> Event cards (their backs show one, two or three planets) and shuffle each stage separately.</li>";
          if (c.mod("gc")) d += "<li><b>" + (c.mode === "survival" ? "Survival (Galactic Conquest rules)" : "Galactic Conquest") + ":</b> first remove the <i>The End Draws Near</i> Event cards (the core game has three) and return them to the box.</li>";
          if (c.has("bw")) {
            var n = { 6: 3, 5: 7, 4: 11, 3: 15, 2: 19 }[c.p], left = { 6: 25, 5: 21, 4: 17, 3: 13, 2: 9 }[c.p];
            if (c.mod("nlc")) d += "<li><b>No Leadership Cards:</b> remove <i>Subtle Planning</i> (Stage I), <i>Heroic Strategy</i> (Stage II) and <i>Inspiring Leadership</i> (Stage III). Then remove <b>" + (n - 1) + "</b> random cards from each of Stage I and Stage II (one fewer than usual), leaving <b>" + left + "</b> in each.</li>";
            else d += "<li>With " + c.p + " players, randomly remove <b>" + n + "</b> cards from each of Stage I and Stage II, leaving <b>" + left + "</b> in each (the Brood War counts).</li>";
          } else if (c.p === 6) {
            d += "<li>With six players, no cards are removed.</li>";
          } else {
            var m = { 5: 5, 4: 10, 3: 15, 2: 20 }[c.p];
            d += "<li>With " + c.p + " players, randomly remove <b>" + m + "</b> cards each from Stage I and Stage II (" + (2 * m) + " in total).</li>";
          }
          if (c.has("bw") || c.p < 6) d += "<li>Return the removed cards to the box without looking at their faces.</li>";
          d += "<li>Place the Stage III cards face down, Stage II on top of them and Stage I on top of that, and put the deck next to the depletion tokens. " +
            (c.mod("gc") ? "When its last card is drawn, shuffle all the Stage III Event cards in the discard pile to form a new Event deck and keep playing." : "It is never shuffled again: the Event deck is the game's clock.") + "</li></ul>";
          return d;
        },
        src: function (c) {
          var s = ["Base p.7–8"];
          if (c.has("bw")) s.push(c.mod("nlc") || c.mode === "survival" ? "BW p.5, p.11" : "BW p.5");
          if (c.mod("gc")) s.push("Base p.42");
          return s.join(" · ");
        } },
      { when: function (c) { return c.has("bw") && c.mode !== "scenario"; }, exp: function (c) { return c.mod("nlc") ? "opt" : "bw"; },
        t: function (c) { return c.mod("nlc") ? "Take your Special Victory Leadership card" : "Choose Stage I Leadership cards"; },
        d: function (c) {
          if (c.mod("nlc")) return "<ul><li><b>No Leadership Cards:</b> each player begins the game with their faction's <b>Special Victory</b> Leadership card. The Choose Leadership Cards steps of setup and of the Regrouping Phase are skipped.</li>" +
            "<li>Your starting units are the ones listed on that card" + (c.mod("lg") ? ". With <b>Larger Galaxy</b> as well, you take those starting units but don't use the card's special victory" : "") + ".</li>" +
            (c.mod("gc") ? "<li>In " + (c.mode === "survival" ? "Survival" : "Galactic Conquest") + " the only way to win is elimination, so the card's special victory can't win the game.</li>" : "") + "</ul>";
          return "<ul><li>Each player looks through their <b>7 Leadership cards</b>, chooses one <b>Stage I</b> card and places it face down. When everyone has chosen, turn them face up at once.</li>" +
            "<li>Resolve them starting with the first player and going clockwise. One-time cards take effect and are removed from the game; cards that say <i>Place in your play area</i>, and Special Victory and Hero cards, stay in play.</li>" +
            "<li>Your Stage I card lists your <b>starting units</b>; they replace the ones on the back of the old Faction Sheets.</li>" +
            (c.mod("lg") ? "<li><b>Larger Galaxy:</b> the Special Victory card is not used, so choose a different Stage I card.</li>"
              : (c.mod("gc") ? "<li>Each faction's <b>Special Victory</b> card is a Stage I card, but in " + (c.mode === "survival" ? "Survival" : "Galactic Conquest") + " the only way to win is elimination, so its objective can't win the game; choose for starting forces and abilities.</li>"
                : "<li>Each faction's <b>Special Victory</b> card is a Stage I card. If you don't choose it now, you can only win by collecting conquest points.</li>")) +
            "<li>You may look at any player's Leadership deck at any time, except during a Choose Leadership Cards step.</li></ul>";
        },
        src: function (c) {
          var s = c.mod("nlc") ? ["BW p.11"] : ["BW p.9–10, p.20"];
          if (c.mod("lg") && !c.mod("nlc")) s.push("BW p.11");
          if (c.mod("gc") && (c.mod("nlc") || !c.mod("lg"))) s.push("Base p.42");   // only when the Galactic Conquest sentence shows
          return s.join(" · ");
        } }
    ]
  },
  {
    title: "Set up the galaxy",
    steps: [
      { when: function (c) { return c.mode !== "scenario"; }, exp: function (c) { return (c.mod("mspt") || c.mod("lg")) ? "opt" : "base"; },
        t: "Receive planets",
        d: function (c) {
          var three = c.mod("mspt") || c.mod("lg");
          return "<ul><li>Mix the <b>starting planet tokens</b> face down (or put them in an opaque container)" + (c.has("bw") ? ". Brood War's 6 planets and tokens are mixed in with the core 12" : "") + ".</li>" +
            "<li>Starting with the first player, each player draws <b>" + (three ? "three" : "two") + "</b> planet tokens, reveals them and takes the matching planet tiles.</li>" +
            (c.mod("mspt") ? "<li><b>More Starting Planet Tokens:</b> you still place only two of your three planets.</li>" : "") +
            (c.mod("lg") ? "<li><b>Larger Galaxy:</b> you will place all three.</li>" : "") + "</ul>";
        },
        src: function (c) { return "Base p.8" + (c.has("bw") ? " · BW p.5" + ((c.mod("mspt") || c.mod("lg")) ? ", p.11" : "") : ""); } },
      { when: function (c) { return c.mode !== "scenario"; }, exp: function (c) { return c.mod("mspt") ? "opt" : "base"; },
        t: "Return unused components",
        d: function (c) {
          return "<ul><li>Return every drawn planet token to the box.</li>" +
            "<li>Return the planets nobody drew, with their undrawn tokens and their <b>Resource cards</b>." + (!c.has("bw") && c.p === 6 ? " (With six players and the core game alone, all 12 planets are in play.)" : "") + "</li>" +
            (c.mod("mspt") ? "<li><b>More Starting Planet Tokens:</b> keep your three tiles for now. After every player has placed two planets, all the other planet tiles go back to the box.</li>" : "") +
            (c.p < 6 ? "<li>Return every faction nobody is playing, with all its components.</li>" : "") + "</ul>";
        },
        src: function (c) { return "Base p.9" + (c.mod("mspt") ? " · BW p.11" : ""); } },
      { when: function (c) { return c.mode !== "scenario"; }, exp: "base",
        t: "First round of planet placement",
        d: function (c) {
          return "<ul><li>The first player picks one of their planets, places it in the middle of the table and may place their <b>base</b> on any area of it.</li>" +
            "<li>Going clockwise, each other player picks one of their planets and places it in any orientation so it connects to at least one planet already on the table, joined by a <b>normal navigation route</b>. They may then place their base on any area of it.</li>" +
            "<li><b>Forced routes:</b> if the new planet can be connected to two or more planets with normal navigation routes, all of those routes must be placed.</li>" +
            (c.has("bw") ? "<li>Bases can never be placed in a flying-only area (Brood War planets).</li>" : "") +
            "<li>Tip from the rulebook: a starting base usually wants plenty of minerals and an area with conquest points.</li></ul>";
        },
        src: function (c) { return "Base p.9–10" + (c.has("bw") ? " · BW p.6" : ""); } },
      { when: function (c) { return c.mode !== "scenario"; }, exp: function (c) { return (c.mod("lg") || c.mod("mspt")) ? "opt" : "base"; },
        t: "Second round of planet placement",
        d: function (c) {
          var order = [];
          for (var i = 1; i <= c.p; i++) order.push(i);
          for (var j = c.p; j >= 1; j--) order.push(j);
          return "<ul><li>The last player to place (the player to the first player's right) now places " + ((c.mod("lg") || c.mod("mspt")) ? "one of their two remaining planets" : "their remaining planet") + " first, then placement continues <b>counter-clockwise</b>, so the first player places both the first planet and the last planet of these two rounds" + (c.mod("lg") ? " (Larger Galaxy's third planets come next)" : "") + ". Across both rounds, with " + c.p + " players, the placement order by seat is " + order.join(", ") + " (seat 1 is the first player).</li>" +
            "<li>The same placement rules apply, including forced routes.</li>" +
            (c.mod("lg") ? "<li><b>Larger Galaxy:</b> you place only <b>one base</b> in the whole setup, and it may go on any of your three planets.</li>"
              : "<li>If you did not place your base on your first planet, you <b>must</b> place it on this one. Once both rounds are done, every player has exactly one base on the board.</li>") +
            (c.mod("mspt") ? "<li><b>More Starting Planet Tokens:</b> once everyone has placed two planets, return all the other planet tiles to the box.</li>" : "") + "</ul>";
        },
        src: function (c) { return "Base p.9" + ((c.mod("lg") || c.mod("mspt")) ? " · BW p.11" : ""); } },
      { when: function (c) { return c.mod("lg") && c.mode !== "scenario"; }, exp: "opt",
        t: "Larger Galaxy: place the third planets",
        d: "<ul><li>Starting with the first player and going clockwise, each player places their <b>third</b> planet into the galaxy, following the normal placement rules (including forced routes).</li>" +
          "<li>You still place only a single base, on any of your three planets: if you haven't placed it yet, it must go on this one.</li></ul>",
        src: "BW p.11 · Base p.9" },
      { when: function (c) { return c.mode !== "scenario"; }, exp: "base",
        t: "Place z-axis navigation routes",
        d: "<ul><li>Each player takes one <b>z-axis navigation route</b>: a pair of pieces with the same colour and number (a major end and a minor end).</li>" +
          "<li>Starting with the first player and going clockwise, each player places the <b>major end</b> in any free navigation route slot on any planet, then the <b>minor end</b> in a free slot on a <b>different</b> planet.</li>" +
          "<li>If there aren't enough free slots to place both ends legally, place neither and return the pair to the box.</li>" +
          "<li>The two ends of one route may never connect to the same planet, but they may join two planets that are already adjacent.</li>" +
          "<li>The arrow colours only show which pieces match: they have nothing to do with player colours, and anyone may use any z-axis route.</li></ul>",
        src: "Base p.9, p.24, p.48 · FAQ p.1" },
      { when: function (c) { return c.mode !== "scenario"; }, exp: "base",
        t: "Distribute Resource cards",
        d: "<ul><li>Each player claims all the <b>Resource cards</b> for the planet with their base and lays them beside their Faction Sheet, normal (non-yellow) side up.</li>" +
          "<li>Put the rest of the Resource cards to the side of the play area.</li></ul>",
        src: "Base p.9" },
      { when: function (c) { return c.mode !== "scenario"; }, exp: function (c) { return c.has("bw") ? "bw" : "base"; },
        t: "Place starting forces",
        d: function (c) {
          var from = !c.has("bw") ? "the back of your Faction Sheet" : (c.mod("nlc") ? "your Special Victory Leadership card" : "your Stage I Leadership card");
          return "<ul><li>" + (c.has("bw") ? "Your starting units are listed on <b>" + from + "</b>; they replace the starting units on the back of the old (core) Faction Sheets." : "The back of your Faction Sheet lists your starting units, transports and workers.") + "</li>" +
            "<li>Starting with the first player and going clockwise, each player places their starting units in any areas of the planet with their base, never exceeding an area's <b>unit limit</b> (the number of unit icons printed in it)" + (c.has("bw") ? ", and only in areas whose limit icons match the unit's type (ground-only and flying-only areas)" : "") + ".</li>" +
            "<li>At the same time, place your single <b>transport</b> on any navigation route connected to that planet, normal or z-axis. On a z-axis route the transport goes on the <b>major</b> end; flip the minor end to its warning side as a reminder.</li>" +
            "<li>Put your starting <b>worker tokens</b> in your Worker Pool.</li></ul>";
        },
        src: function (c) { return "Base p.10, p.21, p.24" + (c.has("bw") ? " · BW p.6, p.9" + (c.mod("nlc") ? ", p.11" : "") : ""); } }
    ]
  },
  {
    title: "Cards & the first round",
    steps: [
      { when: function (c) { return c.mode !== "scenario"; }, exp: "base",
        t: "Separate Technology cards from Combat cards",
        d: function (c) {
          var tech = [["Terran", "21"], ["Protoss", "20"], ["Zerg", "22"]].filter(function (r) { return SC.raceIds(c, r[0]).length; });
          return "<ul><li>If you haven't already, pull every card bearing the <b>Technology symbol</b> out of your faction's cards: they form your <b>Technology deck</b>. Place it on its space on your Faction Sheet.</li>" +
            "<li>The remaining cards form your <b>Combat deck</b>" + (c.has("bw") ? " (20 cards; Brood War sheets have a space for it too)" : " (18 cards)") + ".</li>" +
            (c.has("bw") ? "" : "<li>Core Technology cards per faction: " + tech.map(function (r) { return r[0] + " " + r[1]; }).join(" · ") + ".</li>") + "</ul>";
        },
        src: function (c) { return "Base p.3, p.7–8" + (c.has("bw") ? " · BW p.3, p.5" : ""); } },
      { when: function (c) { return c.mode !== "scenario"; }, exp: "base",
        t: "Draw Combat cards",
        d: function (c) {
          var t = SC.raceIds(c, "Terran");
          return "<ul><li>Shuffle your Combat deck, place it face down in your play area and draw <b>6</b> cards as your starting hand.</li>" +
            (t.length ? "<li>" + (t.length === 1 ? SC.names(t) + " (Terran) draws" : "Terran factions (" + SC.names(t) + ") draw") + " <b>8</b> instead: the Terran hand limit printed on the Faction Sheet.</li>" : "") + "</ul>";
        },
        src: "Base p.8, p.16" },
      { when: function (c) { return c.mode !== "scenario"; }, exp: function (c) { return c.has("bw") ? "bw" : "base"; },
        t: "Begin round 1",
        d: function (c) {
          return "<ul><li>Play starts with the <b>Planning Phase</b> of round 1, beginning with the first player.</li>" +
            (c.has("bw")
              ? "<li>You may place special (gold) orders from the start, but to <b>execute</b> one it must fit in your Special Order Pool (one slot per Research &amp; Development module) or be on a planet where you control a strategic area. Otherwise you take the Event card instead" + (c.mod("dso") ? ", or, with <b>Disposable Special Orders</b>, execute it and remove the token from the game" : "") + ".</li>"
              : "<li>No faction starts with a Research &amp; Development module, so no one can place special orders in round 1.</li>") + "</ul>";
        },
        src: function (c) { return c.has("bw") ? "Base p.10 · BW p.5–6" + (c.mod("dso") ? ", p.11" : "") + " · FAQ p.3" : "Base p.10, p.36"; } }
    ]
  }
];

/* =============================================================================
   RULES REFERENCE
   ============================================================================= */
SC.unitTable = [
  // race, unit, attack max, attack min, health max, health min, # of tech, ability (BW p.18)
  // Ghost # of tech: BW p.18 prints 3; the January 2009 FAQ (newest ruling, covers Brood War) corrects it to 4 (FAQ p.1).
  ["Zerg", "Zergling", 6, 4, 6, 4, 2, ""], ["Zerg", "Hydralisk", 7, 5, 6, 5, 1, ""], ["Zerg", "Ultralisk", 8, 7, 9, 8, 1, ""],
  ["Zerg", "Queen", null, null, null, null, 4, "Assist"], ["Zerg", "Defiler", null, null, null, null, 3, "Assist"],
  ["Zerg", "Scourge", 8, 7, 6, 5, 0, "Sacrifice"], ["Zerg", "Mutalisk", 8, 7, 8, 6, 0, ""], ["Zerg", "Guardian", 8, 7, 8, 7, 1, ""],
  ["Zerg", "Devourer", 8, 7, 9, 8, 1, ""], ["Zerg", "Lurker", 8, 6, 7, 6, 0, "Cloaking"], ["Zerg", "Infested Terran", 8, 7, 6, 5, 0, "Sacrifice"],
  ["Terran", "Marine", 6, 5, 6, 4, 2, ""], ["Terran", "Firebat", 6, 5, 6, 4, 2, ""], ["Terran", "Ghost", 6, 5, 6, 4, "4*", ""],
  ["Terran", "Vulture", 7, 5, 7, 6, 1, ""], ["Terran", "Goliath", 7, 6, 8, 7, 1, ""], ["Terran", "Siege Tank", 8, 7, 8, 7, 1, ""],
  ["Terran", "Wraith", 8, 6, 7, 7, 1, ""], ["Terran", "Science Vessel", null, null, null, null, 3, "Assist · Detector"],
  ["Terran", "Battlecruiser", 8, 7, 9, 8, 1, ""], ["Terran", "Medic", null, null, null, null, 3, "Assist"], ["Terran", "Valkyrie", 9, 6, 7, 6, 0, ""],
  ["Protoss", "Zealot", 7, 5, 7, 5, 1, ""], ["Protoss", "Dragoon", 8, 6, 7, 6, 1, ""], ["Protoss", "High Templar", null, null, null, null, 3, "Assist"],
  ["Protoss", "Reaver", 9, 7, 8, 7, 1, ""], ["Protoss", "Archon", 9, 8, 9, 8, 0, ""], ["Protoss", "Scout", 8, 7, 8, 7, 0, ""],
  ["Protoss", "Arbiter", null, null, null, null, 3, "Assist"], ["Protoss", "Carrier", 9, 7, 9, 8, 1, ""], ["Protoss", "Dark Archon", null, null, null, null, 3, "Assist"],
  ["Protoss", "Dark Templar", 8, 7, 7, 6, 0, "Cloaking"], ["Protoss", "Corsair", 8, 7, 7, 6, 1, ""]
];

SC.reference = [
  {
    title: "The factions",
    when: function () { return true; },
    html: function (c) {
      var h = SC.factionTable(c) + "<ul>";
      if (SC.raceIds(c, "Terran").length) h += "<li><b>Terran</b>: hand limit <b>8</b> Combat cards (start with 8); unit build limit starts at 2, +1 per Supply module.</li>";
      if (SC.raceIds(c, "Protoss").length) h += "<li><b>Protoss</b>: hand limit 6; unit build limit starts at 2, +1 per Supply module." + (c.has("bw") ? " Each Protoss faction has 2 mind control tokens (at most two mind-controlled units at a time)." : "") + "</li>";
      if (SC.raceIds(c, "Zerg").length) h += "<li><b>Zerg</b>: hand limit 6; no Supply modules: the unit build limit is <b>twice the number of different building types</b> on the Faction Sheet (2 at the start, 6 with all three). Each Zergling and Scourge unit is two figures on one base but counts as one unit.</li>";
      h += "<li>Every faction begins with one first-level building printed on its Faction Sheet (for example Aldaris: Gateway; Arcturus Mengsk: Barracks) and two <b>permanent resources</b>.</li></ul>";
      if (!SC.scoring(c) || c.mod("lg")) return h + "<p>" +
        (c.mode === "scenario" ? "Scenarios usually don't use special victory objectives: each scenario sets its own victory conditions."
          : (c.mod("gc") ? "Special victory objectives can't win this game: elimination is the only way to win." : "Special victory objectives aren't used: Larger Galaxy leaves out the Special Victory Leadership cards.")) + "</p>";
      h += "<h4>Special victory objectives named in the rulebooks</h4><ul>";
      var obj = [
        ["raynor", "control six areas containing gas and/or minerals (FAQ p.2)"],
        ["qob", "control three areas containing conquest points, as on her Faction Sheet (the order reference sheet has it wrong; FAQ p.1)"],
        ["overmind", "control bases on three different planets (Base p.42)"],
        ["aldaris", "all enemy players need 20 conquest points (not 15) for a normal victory, and when two or more <i>The End Draws Near</i> cards are played, Aldaris wins (Base p.17)"]
      ].filter(function (o) { return c.maybe(o[0]); });
      obj.forEach(function (o) { h += "<li><b>" + SC.F[o[0]].name + "</b>: " + o[1] + ".</li>"; });
      var other = ["mengsk", "tassadar"].filter(function (f) { return c.maybe(f); });
      if (other.length) h += "<li>" + SC.names(other) + ": " + (other.length === 1 ? "this objective is" : "these objectives are") + " printed on the " + (c.has("bw") ? "Special Victory Leadership card" : "Faction Sheet") + " and not reproduced in the rulebooks.</li>";
      h += "</ul>";
      if (c.has("bw")) h += "<p>With Brood War, special victory objectives are printed on each faction's <b>Special Victory Leadership card</b>, not the Faction Sheet; the descriptions above come from the core components, so follow your card's wording.</p>";
      return h;
    },
    src: function (c) { return "Base p.2, p.6, p.8, p.16–17, p.19, p.22, p.37, p.40, p.42 · FAQ p.1–2" + (c.has("bw") ? " · BW p.6–7, p.10" : ""); }
  },
  {
    title: "The game round at a glance",
    when: function () { return true; },
    html: function (c) {
      return "<ol><li><b>Planning Phase</b>: in four cycles, starting with the first player and going clockwise, each player places one order token face down on a planet, until everyone has placed four." + (c.has("bw") ? " A Defend order is resolved the moment it is placed." : "") + "</li>" +
        "<li><b>Execution Phase</b>" + (c.has("bw") ? " (Brood War calls it the Action Phase)" : "") + ": starting with the first player and going clockwise, each player reveals and executes one of their orders from the top of an order stack, until every order has been executed.</li>" +
        "<li><b>Regrouping Phase</b>: destroy bases" + (c.has("bw") ? ", installations" : "") + " and transports, lose and gain Resource cards, retrieve workers" + (c.has("bw") ? " and special orders" : "") + ", " +
        (SC.lead(c) ? "choose Leadership cards when a new stage begins, " : "") +
        (SC.scoring(c) ? "gain conquest points, check for victory, "
          : (c.mode === "survival" ? "take resource tokens instead of conquest points, "
            : (c.mode === "scenario" ? "score and check for victory as the scenario says, " : ""))) +
        "play Event cards, discard down to your hand limit and pass the first player token to the left.</li></ol>";
    },
    src: function (c) {
      return "Base p.10–11, p.15–16" + (c.mod("gc") && c.mode !== "survival" ? ", p.42" : "") + (c.has("bw") ? " · BW p.5, p.9, p.20" : "") +
        (c.mode === "survival" ? ", p.11" : (c.mode === "scenario" ? ", p.12" : ""));
    }
  },
  {
    title: "Planning Phase — placing orders",
    when: function () { return true; },
    html: function (c) {
      var h = "<ul><li>Each player places exactly <b>four</b> orders: the first player places one, then each player clockwise places one, and the cycle repeats four times.</li>" +
        "<li>Orders go face down in the order area of a planet that holds at least one of your units or bases, or a planet <b>adjacent</b> to such a planet (connected by a navigation route, normal or z-axis).</li>" +
        "<li>An order placed where orders already lie goes on <b>top</b>, forming an order stack (no size limit). Anyone may look at the backs to see whose orders are in a stack and in what order, but not at their faces.</li>" +
        "<li><b>The last order placed in a stack is the first one executed.</b> To move onto a planet and then build a base there, place the Build order first and the Mobilize order on top.</li>";
      if (c.has("bw")) {
        h += "<li><b>Special orders (Brood War):</b> you may place any number of your special (gold) orders, whatever modules you have; Research &amp; Development modules only limit how many you can <i>execute</i> (see Execution).</li>" +
          "<li><b>Defend order (Brood War):</b> once per Planning Phase, instead of stacking it, place your Defend order face up in one <b>friendly area</b> on any planet and resolve it at once: move and/or transport units into that area as if executing a Mobilize order on that planet, then put a <b>guard token</b> in the area and take the Defend order back. It counts toward your four orders, and it can't be used for the Event card option.</li>";
      } else {
        h += "<li><b>Special orders:</b> you may place as many special (gold) orders as you have Research &amp; Development modules, still four orders in total. No one has an R&amp;D module in round 1.</li>";
      }
      return h + "</ul>";
    },
    src: function (c) { return "Base p.6, p.12–14, p.36" + (c.has("bw") ? " · BW p.5, p.9 · FAQ p.3" : ""); }
  },
  {
    title: "Execution Phase — carrying out orders",
    when: function () { return true; },
    html: function (c) {
      var h = "<ul><li>Starting with the first player and going clockwise, each player chooses one of their orders that is on <b>top</b> of a stack, reveals it, executes it and takes it back. You must execute an order if you can: no passing.</li>" +
        "<li><b>Event card option:</b> after revealing an order you may instead remove it without effect and draw an <b>Event card</b>. Event cards are kept face down and unread (tuck them under your Faction Sheet) until the Play Event Cards step of the Regrouping Phase.</li>" +
        "<li><b>Obstructed:</b> if all your remaining orders are covered by other orders, draw an Event card instead and play passes on. Once you have executed all four orders you are never obstructed: your turn is simply skipped.</li>" +
        "<li>An eliminated player's orders are discarded without effect when they reach the top of a stack.</li>";
      if (c.has("bw")) {
        h += "<li><b>Special Order Pool (Brood War):</b> when you reveal a special (gold) order, either <b>execute</b> it and put it in the Special Order Pool on your Faction Sheet, which you may do only while the pool holds fewer orders than your Research &amp; Development modules allow, or take the <b>Event card option</b> and return the token to your unused orders. The pool empties back into your unused orders in Regrouping step 4. (FAQ: ignore the mention of strategic areas in this rule on BW p.5.)</li>" +
          "<li><b>Strategic areas (Brood War):</b> if you control a strategic area (gold hexagon) on a planet, every order you execute on that planet is treated as a special order, and those special orders go back to your unused orders instead of into your pool.</li>";
        if (c.mod("dso")) h += "<li><b>Disposable Special Orders:</b> you may always execute a special order, whatever your R&amp;D modules. If you execute one and cannot (or do not wish to) put it in your Special Order Pool, remove the token from the game.</li>";
      }
      return h + "</ul>";
    },
    src: function (c) { return "Base p.14–15, p.18" + (c.has("bw") ? " · BW p.5–6" + (c.mod("dso") ? ", p.11" : "") + " · FAQ p.3" : ""); }
  },
  {
    title: "Build order",
    when: function () { return true; },
    html: function (c) {
      var h = "<ol><li>With a <b>base</b> on the active planet: build any number of workers and transports, and units up to your unit build limit.</li>" +
        "<li>With a <b>unit or base</b> on the active planet: buy one <b>building</b> and/or one <b>module</b> for your Faction Sheet.</li>" +
        "<li>With a <b>unit but no base</b> on the active planet: build one <b>base</b> there.</li></ol>" +
        "<p>Do any or all of these, but in this order (you can't build a base and then build units there). With neither a base nor a unit on the planet, the order has no effect.</p><ul>" +
        "<li><b>Workers</b>: pay the cost and put them in the Unavailable Workers area of your Faction Sheet (usable after the next Regrouping).</li>" +
        "<li><b>Transports</b>: place each on any navigation route connected to the active planet (on a z-axis route, on its major end, and flip the minor end to its warning side). At most one of your transports per route; other players' transports don't stop you.</li>" +
        "<li><b>Units</b>: only types your buildings allow; place them on any <b>friendly or empty</b> area of the active planet within unit limits, even when enemy units sit in your base's area (you just can't place them there).</li>" +
        "<li><b>Unit build limit</b>: Terran and Protoss start at 2, +1 per Supply module; Zerg have 2 per different building type (max 6). Tech-required units count toward it too.</li>" +
        "<li><b>Bases</b>: one per Build order, in an area with one of your units; only one base of yours per planet, and never in an area with an enemy base" + (c.has("bw") ? "; never in a flying-only area, and an area holds at most one base or installation" : "") + ".</li>" +
        "<li><b>Upgrades</b> improve all your bases at once, including bases built later. Building levels can't be skipped (I, then II, then III); you may only build as many modules as your Faction Sheet has module spaces.</li>" +
        "<li><b>Tech-required units</b> (the Zerg Guardian and the Protoss Archon): once you own the technology, you build them as it describes, on any planet (even one without a base), by destroying the specified units that were already on the active planet; the new unit goes in an area where one of them was destroyed." + (c.has("bw") ? " With Brood War the Lurker's cost also includes destroying friendly units (FAQ p.3)." : "") + "</li>" +
        "<li><b>Component limits</b>: you can't build more pieces than the game provides. During your own turn, except in a battle, you may voluntarily destroy your own units, bases and transports (for example to rebuild a unit elsewhere or make room in an area).</li>" +
        "<li><b>Special Build order</b>: your unit build limit is +1 for this order, and you get a one-resource discount (one mineral or one gas) on a single unit, base, transport, building or module.</li>";
      if (c.has("bw")) h += "<li><b>Infested Terrans (Brood War)</b>: the Zerg need an Infested Command Center installation (from the <i>Infest Command Center</i> technology) on a planet to build Infested Terrans there; no base is required.</li>";
      if (c.mode === "survival") h += "<li><b>Survival</b>: you don't need a base to build transports, as long as you control at least one area on the planet.</li>";
      return h + "</ul>";
    },
    src: function (c) {
      var s = ["Base p.21–24, p.36–38, p.40"];
      if (c.has("bw")) s.push("BW p.6, p.9");
      s.push(c.has("bw") ? "FAQ p.1, p.3" : "FAQ p.1");
      return s.join(" · ");
    }
  },
  {
    title: "Mobilize order",
    when: function () { return true; },
    html: function (c) {
      var h = "<ul><li>Two steps, in order: <b>move units</b>, then <b>resolve the battle</b> (if any).</li>" +
        "<li>Move your units from any areas of the active planet to other areas of it, and/or <b>transport</b> units from adjacent planets to the active planet across any route that has one of your transports on it. Every moved unit must end on the active planet: you can never move units <i>off</i> it.</li>" +
        "<li>You may move into any number of empty or friendly areas, but into only <b>one enemy area</b>: at most one battle per Mobilize order.</li>" +
        "<li>Unit limits apply when moving (bases aren't units, so they don't count). When you attack, you may bring in up to the area's unit limit <b>plus two</b> (the defending units don't count toward your limit).</li>" +
        "<li><b>Limited Orbital Defense</b>: you can't transport units from another planet straight into an area containing the base of a player with an Air Support module (units already on that planet may still move in).</li>" +
        "<li>Z-axis navigation routes work exactly like normal routes, and any player may use them.</li>" +
        "<li><b>Special Mobilize order</b>: if you start a battle, draw two extra Combat cards in battle step 3 (five in all) and add +1 to your final attack value in every skirmish.</li>";
      if (c.has("bw")) h += "<li><b>Brood War planets</b>: units may never enter or occupy an area whose ground-only or flying-only limit icons don't match their type. The large planet <i>Moria</i> has no special movement rules: units may move to any of its five areas.</li>" +
        "<li><b>Offensive module (Brood War)</b>: you may ignore an enemy's Limited Orbital Defense and transport units into the area with their base, then destroy every transport you used to move units into that area.</li>";
      return h + "</ul>";
    },
    src: function (c) { return "Base p.21, p.23–25, p.36, p.41, p.48" + (c.has("bw") ? " · BW p.6, p.8" : ""); }
  },
  {
    title: "Research order",
    when: function () { return true; },
    html: function () {
      return "<p>You need a <b>base</b> on the active planet. Steps, in order:</p><ol>" +
        "<li><b>Draw an Event card</b> (required), face down and unread.</li>" +
        "<li><b>Draw three Combat cards</b> into your hand (optional).</li>" +
        "<li><b>Purchase one technology</b> (optional): look through your Technology deck, pay the cost once and take <b>every copy</b> of that technology (the dots at the bottom of a card show how many there are). Announce it and explain its effect. Unless it says otherwise, it goes into your Combat deck, and it now counts as a Combat card.</li>" +
        "<li><b>Shuffle your Combat deck</b>, with your discards, if you added a technology to it.</li></ol><ul>" +
        "<li><b>Special Research order</b>: after the standard steps, choose one: draw an <b>additional Event card</b>, or put <b>one copy</b> of the technology you just bought into your hand instead of your deck.</li>" +
        "<li>If you ever draw the last card of your Combat deck, immediately shuffle your discards into a new deck (then finish drawing).</li>" +
        "<li>To speed play, if everyone agrees, the next player may start their order while you choose your technology.</li></ul>";
    },
    src: function () { return "Base p.25–26, p.37"; }
  },
  {
    title: "Resources, workers & depletion",
    when: function () { return true; },
    html: function (c) {
      var h = "<ul><li><b>Costs</b>: workers, transports and units are on your Faction Sheet; bases, buildings and modules on the backs of their tokens; technologies at the bottom of the card.</li>" +
        "<li><b>Paying</b>: move one worker from your Worker Pool onto a Resource card for each mineral or gas you spend. Use any of your Resource cards, not only the active planet's. A card holds at most as many workers as its number (its capacity), and workers stay there until the Regrouping Phase, so workers limit how much you can spend each round.</li>" +
        "<li><b>Permanent resources</b>: the two Resource cards printed on your Faction Sheet can never be lost or force mined. Use them first: workers on a Resource card you lose are destroyed.</li>" +
        "<li><b>Force mining</b>: assign one worker beyond a card's capacity for one extra resource, then flip the card to its partially depleted (yellow) side and put a depletion token, partially depleted side up, on its area.</li>" +
        "<li>Force mining a partially depleted card again removes it from the game: its workers go to your Unavailable Workers area and the area's depletion token flips to its depleted side. You may do both in one action (two extra workers).</li>" +
        "<li>When you gain the card of a partially depleted area, take it yellow side up.</li>";
      if (c.has("bw")) h += "<li><b>Resource tokens (Brood War)</b>: some Leadership and Event cards give mineral or gas resource tokens. Discard one whenever you pay a cost to reduce it by one resource of that type.</li>";
      if (c.mode === "survival") h += "<li><b>Survival</b>: each conquest point you would receive becomes a resource token of your choice.</li>";
      return h + "</ul>";
    },
    src: function (c) { return "Base p.15, p.18–20" + (c.has("bw") ? " · BW p.9" + (c.mode === "survival" ? ", p.11" : "") : ""); }
  },
  {
    title: "Battle sequence",
    when: function () { return true; },
    html: function (c) {
      return "<p>A battle starts when the active player's Mobilize order moves units into an area containing enemy units: the active player is the <b>attacker</b>.</p><ol>" +
        "<li><b>Place the order token</b> face up in the contested area (the units come off the board while you fight).</li>" +
        "<li><b>Start-of-battle abilities</b>: the attacker, then the defender, may each use <b>one</b> ability that says <i>at the start of a battle</i>." + (c.has("bw") ? " A defender with a guard token in the area may discard it now for +2 health in each skirmish." : "") + "</li>" +
        "<li><b>Draw Combat cards</b>: the attacker draws <b>3</b> (5 with a special Mobilize order), the defender <b>1</b>.</li>" +
        "<li><b>Attacker establishes skirmishes</b>: pairs one attacking unit with one defending unit, making as many pairs as possible (assist units are left out). These are the front-line units.</li>" +
        "<li><b>Assign supporting units</b>: every unpaired unit must join a skirmish of its owner's choice, all in one or spread out; if both sides have supporters, the attacker assigns first." + (c.has("bw") ? " Once the match-ups are made, a defender with a <b>Defensive module</b> may switch any two of their units between skirmishes (not assist units)." : "") + "</li>" +
        "<li><b>Place Combat cards</b>: the attacker, then the defender, plays one standard Combat card face down to <b>each</b> skirmish, optionally with one reinforcement card. Instead of a card from hand you may play the top card of your deck unseen (but then no reinforcement card from hand on that skirmish).</li>" +
        "<li><b>Resolve skirmishes</b> one at a time, in the order the attacker chooses: reveal, compare attack and health, destroy units and discard cards.</li>" +
        "<li><b>Resolve splash damage</b>.</li>" +
        "<li><b>Resolve retreats</b>, then remove the attacker's order token and continue the Execution Phase.</li></ol>";
    },
    src: function (c) { return "Base p.26–33, p.36" + (c.has("bw") ? " · BW p.7, p.9" : ""); }
  },
  {
    title: "Resolving a skirmish",
    when: function () { return true; },
    html: function () {
      return "<ul><li><b>Major or minor values</b>: if a unit icon on your standard Combat card matches your front-line unit, use the card's large (major) attack and health values and its special ability. You must use that ability. Otherwise use the small (minor) values and ignore the ability. Assist units never match, so as front-line units they use minor values.</li>" +
        "<li><b>Reinforcement cards</b>: when revealed, one must match your front-line unit (or, with the <b>specialty support icon</b>, your front-line or a supporting unit) or it is discarded without effect. Once it passes, its ability lasts the whole battle, even if that unit later dies.</li>" +
        "<li><b>A lone reinforcement card</b> (no standard card) is discarded and replaced from the top of your deck, repeatedly, until a standard Combat card turns up.</li>" +
        "<li><b>Final attack</b> = the card's value + card and reinforcement bonuses + the <b>support value</b> of each supporting unit that can target the enemy front-line unit. <b>Final health</b> = the card's value + bonuses.</li>" +
        "<li>Icons are checked only in the Compare step; the values found then stand until the skirmish ends.</li>" +
        "<li><b>Destroy</b>: if your final attack <b>equals or exceeds</b> the enemy's final health, you have <i>sufficient strength</i>: destroy their front-line unit if your front-line unit can target it; if it can't, destroy one of their supporting units it can target (their choice); otherwise nothing. Both, one or neither front-line unit may die.</li>" +
        "<li>Discard the skirmish's cards face up beside your deck, except triggered splash damage cards, which wait for battle step 8 (splash damage). Your discards are shuffled back only when you draw the last card of your deck or when you shuffle a newly bought technology into it.</li>" +
        "<li><b>Timing</b>: italic text at the start of a card (e.g. <i>End of the Destroy Units step</i>) says when it resolves; otherwise abilities resolve in the Compare step. Simultaneous abilities: the attacker's first in combat, otherwise clockwise from the first player; you order your own.</li>" +
        "<li><b>Cancel</b> effects resolve before any other abilities, the attacker's first.</li></ul>";
    },
    src: function () { return "Base p.27–28, p.30–32, p.34, p.38, p.42 · FAQ p.2"; }
  },
  {
    title: "Ground vs flying units",
    when: function () { return true; },
    html: function (c) {
      return "<ul><li>Every unit is <b>ground</b> (rock texture on the Faction Sheet) or <b>flying</b> (field of stars; flying figures stand on clear bases).</li>" +
        "<li>Icons on that texture show what the unit can <b>target</b>: a tank turret = ground units, a rocket blast = flying units. Both icons = both; neither = it can destroy nothing.</li>" +
        "<li>Your <b>front-line unit</b> decides what your sufficient strength can destroy (see Resolving a skirmish).</li>" +
        "<li>A <b>supporting unit</b> adds its support value only if it can target the enemy front-line unit, but it is still part of the skirmish in every other way (for example, it can be destroyed).</li>" +
        (c.has("bw") ? "<li><b>Errata</b>: the Overmind's Faction Sheet should say Guardians can attack only <b>ground</b> units (the Queen of Blades' sheet is correct).</li>" : "") + "</ul>";
    },
    src: function (c) { return "Base p.33–35" + (c.has("bw") ? " · FAQ p.2" : ""); }
  },
  {
    title: "Splash damage",
    when: function () { return true; },
    html: function (c) {
      return "<ul><li><b>Trigger</b>: a splash damage card triggers if its side destroys at least one enemy unit in the skirmish where it was played, even if its own units die. Every splash card in that skirmish triggers (standard and reinforcement). Set triggered cards aside face up; discard the rest normally.</li>" +
        "<li>Destroying a cloaked unit still triggers splash damage, even though the unit withdraws; cloaking does not let a unit withdraw from splash damage itself.</li>" +
        "<li><b>Resolve</b> after all skirmishes: for each triggered card the opponent must choose and destroy one of their surviving units of the type named (<i>ground</i>, <i>flying</i> or <i>ground/flying</i>). The attacker destroys first, then the defender.</li>" +
        "<li>Destroy as many units as possible: apply ground and flying splash before ground/flying splash. Then discard the splash cards.</li>" +
        (c.has("bw") ? "<li><b>Heroes (Brood War)</b> are immune: a non-hero must be chosen if possible; if no other unit can be chosen, that splash damage is ignored.</li>" : "") +
        (!c.has("bw") ? "<li><b>Errata</b>: the Zerg Scourge Combat cards (#10–12) read: <i>End of the Destroy Units Step: If your front-line unit was not destroyed, destroy it. If this happens, and your opponent's front-line unit is flying, it is also destroyed. This does not trigger any Splash Damage abilities.</i></li>" : "") + "</ul>";
    },
    src: function (c) { return "Base p.39–40 · " + (c.has("bw") ? "BW p.10" : "FAQ p.1"); }
  },
  {
    title: "Keywords & abilities",
    when: function () { return true; },
    html: function (c) {
      var h = "<ul><li>Abilities a Combat card gives a unit last only until the end of that skirmish.</li>" +
        "<li><b>Cloaking</b>: when the unit is destroyed in a skirmish it <i>withdraws</i> instead, at the end of the Destroy Units step, to a friendly or empty area of the active planet; with no such area (or over the unit limit) it is destroyed." + (c.has("bw") ? " A unit with Cloaking on its Faction Sheet always has it in battle." : "") + "</li>" +
        "<li><b>Detector</b>: a front-line or supporting detector cancels the cloaking of enemy units in the same skirmish.</li>" +
        "<li><b>Cancel</b>: the canceled card goes to its owner's discard pile and its effects are ignored; cancels resolve first, the attacker's before the defender's.</li>" +
        "<li><b>Vs.</b>: the benefit applies only if the opposing front-line unit matches what follows <i>vs.</i></li>" +
        "<li><b>Assist</b>: never a front-line unit, always supporting, so both sides may have supporters. If all of a player's units in the battle have assist, they choose one to be the front-line unit, making a single skirmish.</li>" +
        "<li><b>Gain</b>: add the stated attack and/or health (often only if a condition is met).</li>" +
        "<li><b>Return to your Technology deck</b>: after use the card goes back to the Technology deck, to be researched again.</li>" +
        "<li><b>Place in your play area</b>: the technology is placed face up in front of you when bought, not shuffled into your deck, and works as the card says. It doesn't count toward your hand limit.</li>";
      if (c.has("bw")) h += "<li><b>Collateral Damage (Brood War)</b>: if a front-line unit with it is not destroyed in the Resolve Skirmishes step, its owner may immediately destroy one enemy base, or one enemy installation, or all enemy workers on the Resource card of that area (even if the unit later retreats or withdraws).</li>" +
        "<li><b>Mind Control (Brood War)</b>: at the end of the Destroy Units and Discard Cards step, the opposing front-line unit is stolen: put one of your mind control tokens under it and treat it as yours. In battle it uses the <b>top card of its original owner's Combat deck</b> for its standard card, though you may add reinforcement cards from your own hand that match it. Each Protoss faction may hold two mind-controlled units at a time, and may voluntarily destroy ones it controls. Heroes can't be mind controlled.</li>" +
        "<li><b>Recharge (Brood War)</b>: when the named card type would be discarded, return it to its owner's hand instead. For once-per-Action-Phase recharges, mark the card with a depletion token and remove it at the end of the phase.</li>" +
        "<li><b>Sacrifice (Brood War, FAQ wording)</b>: a front-line unit with sacrifice on its Faction Sheet is automatically destroyed in the Resolve Skirmishes step, whether or not the enemy had sufficient strength. This is ignored if the unit is unable to attack both the opposing front-line unit and supporting units (due to its attack capability), and ignored if the opposing unit has cloaking and no friendly detector is present.</li>";
      return h + "</ul>";
    },
    src: function (c) { return "Base p.16, p.38–40" + (c.has("bw") ? " · BW p.6–7 · FAQ p.3" : ""); }
  },
  {
    title: "Retreats & the end of a battle",
    when: function () { return true; },
    html: function () {
      return "<p>After splash damage, put every surviving unit back in the contested area. Then:</p><ul>" +
        "<li><b>All defenders destroyed</b>: the attacker wins; if they now exceed the area's unit limit, they retreat the excess units (their choice).</li>" +
        "<li><b>All attackers destroyed</b>: the defender wins; nothing else happens.</li>" +
        "<li><b>Everything destroyed</b>: the area is empty; the defender keeps its Resource card unless something changes before the Regrouping Phase.</li>" +
        "<li><b>Both sides have survivors</b>: the attacker must retreat all of them, unless every remaining defender is an <b>assist</b> unit, in which case the attacker wins and the defender retreats. If both sides have only assist units left, the defender retreats; an attacker over the unit limit retreats the excess only after the defenders have retreated.</li>" +
        "<li><b>Retreating</b>: move all your surviving units together to a <b>single</b> friendly or empty area on the active planet, or on an adjacent planet if you have a transport on the connecting route. Any unit that can't retreat (no legal area, or over its unit limit) is destroyed.</li>" +
        "<li>The loser's Resource card for the area is only lost in the Regrouping Phase.</li></ul>";
    },
    src: function () { return "Base p.32–33 · FAQ p.2"; }
  },
  {
    title: "Buildings & modules",
    when: function () { return true; },
    html: function (c) {
      var rows = [["Terran", "Barracks", "Marines, Firebats, Ghosts"], ["Terran", "Factory", "Vultures, Goliaths, Siege Tanks"], ["Terran", "Starport", "Wraiths, Science Vessels, Battlecruisers"],
        ["Protoss", "Gateway", "Zealots, Dragoons, High Templars"], ["Protoss", "Robotics Facility", "Reavers"], ["Protoss", "Stargate", "Scouts, Arbiters, Carriers"],
        ["Zerg", "Spawning Pool", "Zerglings, Hydralisks, Ultralisks"], ["Zerg", "Queen's Nest", "Queens, Defilers"], ["Zerg", "Spire", "Scourges, Mutalisks"]]
        .filter(function (r) { return SC.raceIds(c, r[0]).length; });
      var h = "<table class='ref-table'><thead><tr><th>Race</th><th>Building</th><th>Lets you build (core game)</th></tr></thead><tbody>" +
        rows.map(function (r) { return "<tr><td>" + r[0] + "</td><td>" + r[1] + "</td><td>" + r[2] + "</td></tr>"; }).join("") + "</tbody></table><ul>";
      if (c.has("bw")) h += "<li><b>Brood War buildings</b> replace the core tokens listed in setup and unlock the new units; some levels now allow more than one new unit type (if a unit is pictured, you may build it). Protoss gain a level II Robotics Bay. Read each token.</li>";
      h += "<li>Your first building of a type is level I; higher levels go on top of the lower one in the same space and can't be skipped. Each building shows the units it lets you build.</li>" +
        "<li>Every faction starts with one level I building printed on its Faction Sheet; a level II token goes on top of it.</li>" +
        "<li><b>Supply module</b> (Terran and Protoss only): +1 unit build limit each.</li>" +
        "<li><b>Research &amp; Development module</b>: " + (c.has("bw") ? "sets the size of your Special Order Pool: one special order executed per module, per round." : "lets you place one special order per module in the Planning Phase (still four orders in total).") + "</li>" +
        "<li><b>Air Support module</b>, three benefits for every base: <i>Cloaking Detector</i> (your units in an area with your base gain detector); <i>Anti-aircraft Defenses</i> (+1 attack in each skirmish of a battle in an area with your base where the enemy front-line unit is flying); <i>Limited Orbital Defense</i> (enemies can't transport units from another planet straight into an area with your base).</li>";
      if (c.has("bw")) h += "<li><b>Defensive module</b> (gas: Zerg 2, Terran 2, Protoss 1): when defending, after match-ups are made, switch any two of your units between skirmishes (front-line or supporting, not assist units); a unit may be switched into the front line only if the opposing front-line unit can attack it.</li>" +
        "<li><b>Assist module</b> (gas: Zerg 2, Terran 1, Protoss 2): one of your assist units in an area doesn't count toward its unit limit, and a single assist unit doesn't count toward the limit when you attack.</li>" +
        "<li><b>Offensive module</b> (gas: Zerg 1, Terran 2, Protoss 2): destroy your own transports to evade an enemy's Limited Orbital Defense (see Mobilize order).</li>";
      return h + "<li>You may build only as many modules as your Faction Sheet has module spaces.</li></ul>";
    },
    src: function (c) { return "Base p.22–23, p.36–38, p.40–41, p.44" + (c.has("bw") ? " · BW p.5–8, p.20" : ""); }
  },
  {
    title: "Regrouping Phase",
    when: function () { return true; },
    html: function (c) {
      var n = SC.rg(c), L = [];
      L[n.destroy] = "<b>Destroy bases" + (c.has("bw") ? ", installations" : "") + " and transports</b>: first, every base" + (c.has("bw") ? " or installation" : "") + " in an area containing an opponent's units is destroyed" + (c.mode === "survival" ? " (Survival: destroyed bases go back in the box)" : "") + ". Then every transport without one of its owner's bases on either planet its route connects is destroyed. This check happens only here: a transport cut off earlier in the round survives until now.";
      L[n.lose] = "<b>Lose Resource cards</b>: you keep a Resource card only if you have a base on its planet <i>and</i> its area holds no enemy unit or base. Lost cards go back to the Resource deck, and any workers on them are destroyed.";
      L[n.gain] = "<b>Gain Resource cards</b>: for each planet with your base, take the card of every friendly area; if yours is the only base on that planet, also take the cards of its empty areas. Partially depleted cards come yellow side up.";
      L[n.retrieve] = "<b>Retrieve workers" + (c.has("bw") ? " and special orders" : "") + "</b>: move all workers from your Unavailable Workers area, your Resource cards and your permanent resources back to your Worker Pool" + (c.has("bw") ? "; empty your Special Order Pool back into your unused orders" : "") + ".";
      if (c.has("bw")) L[n.lead] = "<b>Choose Leadership cards (if necessary)</b>: " + (SC.lead(c) ? "in the first Regrouping Phase of a new stage, each player chooses one Leadership card of that stage face down; reveal together and resolve from the first player clockwise. Skip the step if cards for the current stage have already been chosen." : (c.mode === "scenario" ? "only if the scenario uses Leadership cards." : "skipped (No Leadership Cards).") );
      L[n.cp] = "<b>Gain conquest points</b>: " + (c.mode === "scenario" ? "if the scenario uses them, score the conquest points of every area you control (at least one of your units or bases and no enemy units or bases)." : c.mode === "survival" ? "Survival: no conquest points; take a resource token of your choice for each point you would score." : (c.mod("gc") ? "none in Galactic Conquest." : "score the conquest points of every area you control (at least one of your units or bases and no enemy units or bases). Having the only base on a planet is not enough."));
      L[n.normal] = "<b>Check for normal victory</b>" + (SC.scoring(c) ? " (see Winning the game)." : (c.mod("gc") ? ": not used." : ": as the scenario says."));
      L[n.special] = "<b>Check for special victory</b>" + (SC.scoring(c) ? " (see Winning the game)." : (c.mod("gc") ? ": not used (elimination is the only way to win)." : ": as the scenario says."));
      L[n.events] = "<b>Play Event cards</b>: everyone secretly reads the Event cards they drew. Starting with the first player, clockwise, each player may execute <b>one</b>; their other Event cards are revealed and discarded without effect. Cards that say to place them in your play area stay there." +
        (c.mod("gc") ? "" : " If you drew <i>The End Draws Near</i>, you must play it and discard your other Event cards without effect; if you drew several, play them all but gain the added benefit of only one. Played, they stay beside the board" + (c.mode === "scenario" ? "; how the game ends is set by the scenario's victory conditions." : ", and if two or more are there at the end of this step, the game ends."));
      L[n.discard] = "<b>Discard Combat cards</b> down to your hand limit: 6, or 8 for Terran factions. Some abilities (such as Event cards) raise it, and cards in your play area don't count.";
      L[n.pass] = "<b>Pass the first player token</b> to the left.";
      var h = "<ol>" + L.slice(1).map(function (x) { return "<li>" + x + "</li>"; }).join("") + "</ol>";
      if (c.mode === "scenario") h += "<p>Counting rounds: if the scenario uses a round marker, move it up one space at the end of each Regrouping Phase.</p>";
      return h + "<p class='inline-note'>Errata: the list on the back cover of the core rulebook puts these steps in the wrong order; the order above (Base p.15–16" + (c.has("bw") ? ", extended by the Brood War quick reference" : "") + ") is correct.</p>";
    },
    src: function (c) {
      var s = ["Base p.15–17 · FAQ p.1–2"];
      if (c.has("bw")) s.push("BW p.5, p.9–10, p.20");
      if (c.mode === "survival") s.push("BW p.11");
      if (c.mode === "scenario") s.push("BW p.12");
      if (c.mod("gc") && c.mode !== "survival") s.push("Base p.42");
      return s.join(" · ");
    }
  },
  {
    title: "Winning the game",
    when: function () { return true; },
    html: function (c) {
      var n = SC.rg(c);
      if (c.mode === "scenario") return "<ul><li>In most scenarios players don't collect conquest points or use special victory objectives: each scenario says what each faction (or team) must do to win.</li><li>Unless the scenario says otherwise, the core elimination rule applies: a player with no bases and no units on the board is eliminated at once.</li></ul>";
      if (c.mod("gc")) {
        return "<ul><li>" + (c.mode === "survival" ? "<b>Survival</b> follows all the Galactic Conquest rules: no" : "<b>Galactic Conquest</b>: no") + " conquest points are acquired, and the only way to win is an <b>elimination victory</b>: be the last " + (c.mod("team") ? "team" : "faction") + " standing.</li>" +
          (c.mode === "survival" ? "<li>You are eliminated as soon as you have <b>no bases</b> in play (units don't save you), and every destroyed base is removed from the game.</li>" + (c.mod("fast") ? "<li><b>Faster Survival</b>: each faction has only 3 bases for the whole game.</li>" : "")
            : "<li>A player with no bases and no units on the board is eliminated immediately.</li>") +
          "<li>An eliminated player can't place orders, play Event cards or win; their orders are discarded as they reach the top of a stack, and their Event cards are removed from the game without effect.</li>" +
          "<li>With <i>The End Draws Near</i> removed, the game has no clock: when the Event deck runs out, shuffle the discarded Stage III cards into a new deck.</li></ul>";
      }
      var target = c.mod("team") ? 30 : (c.mod("lg") ? 25 : 15);
      var h = "<ul>";
      if (c.mod("team")) {
        h += "<li><b>Normal victory (teams)</b>: at step " + n.normal + " of the Regrouping Phase, the game ends if a team has <b>30</b> or more conquest points combined" + (SC.aldarisOn(c) ? " (<b>40</b> for every other team if Aldaris's objective is in play; Aldaris's team still needs 30)" : "") + ", and the team with the most combined points wins. For tiebreakers, combine both teammates' resources, areas, bases or workers.</li>" +
          (c.mod("lg") ? "<li><b>Larger Galaxy</b>: the Special Victory Leadership cards aren't used, so there are no special victories.</li>"
            : "<li><b>Special victory</b>: at step " + n.special + ", if either teammate has achieved their special victory objective, their team wins. Two or more teams at once: the most combined conquest points wins, then the usual tiebreakers.</li>") +
          "<li><b>End-game victory</b>: if two or more <i>The End Draws Near</i> cards are in the common play area at the end of step " + n.events + ", the team with the most combined conquest points wins" + (SC.aldarisOn(c) ? ", unless Aldaris's objective is in play: then Aldaris's team wins" : "") + ".</li>" +
          "<li><b>Elimination victory</b>: the last team with anything on the board wins.</li>" +
          "<li>Base p.43 numbers the team special victory and end-game checks as steps 6 and 7, following the back-cover list that the FAQ corrects; the step numbers here follow the corrected order.</li>";
        if (c.mod("lg")) h += "<li><b>Not covered by the rulebooks:</b> Larger Galaxy raises the target to 25 for a normal game, but neither book says how it combines with Team Play's 30-point team target. Agree on a target before you start.</li>";
      } else {
        h += "<li><b>Normal victory</b>: at step " + n.normal + " of the Regrouping Phase, if anyone has <b>" + target + "</b> or more conquest points" + (c.mod("lg") ? " (Larger Galaxy)" : "") + ", the game ends and the player with the most points wins." +
          (SC.aldarisOn(c) ? " If Aldaris's special objective is in play, everyone except Aldaris needs <b>20</b>; if Aldaris is eliminated, the target goes back to 15." : "") + "</li>" +
          "<li><b>Tiebreakers</b>, in order: most total resources (count the resources, not the cards), most areas controlled, most bases in play, most workers in the Worker Pool area of the Faction Sheet; otherwise the tied players share the victory.</li>";
        if (!c.mod("lg")) h += "<li><b>Special victory</b>: at step " + n.special + ", a player who has achieved their special victory objective wins (several at once: most conquest points, then the tiebreakers). Most objectives count only in <b>Stage III</b>: the top card of the Event deck must be a Stage III card (three planets on its back)." + (c.has("bw") ? " With Brood War your objective is on your Special Victory Leadership card, which lets you complete it once Stage III has been reached, so you need to have chosen it in Stage I" + (c.mod("nlc") ? " (No Leadership Cards: everyone has it)" : "") + "." : "") + "</li>";
        else h += "<li><b>Larger Galaxy</b>: the Special Victory Leadership cards aren't used, so there are no special victories.</li>";
        h += "<li><b>End-game victory</b>: if two or more <i>The End Draws Near</i> cards are in the common play area at the end of step " + n.events + " (Play Event Cards), the game ends and the most conquest points wins, with the same tiebreakers" + (SC.aldarisOn(c) ? ". If Aldaris's objective is in play, Aldaris wins instead, whatever the scores" : "") + ".</li>" +
          "<li><b>Elimination</b>: a player with no bases and no units on the board is eliminated immediately and can't win, place orders or play Event cards; their orders are discarded as they reach the top of a stack and their Event cards (even <i>The End Draws Near</i>) are removed without effect. The last player standing wins.</li>";
      }
      if (!c.mod("lg")) h += "<li>For special victory objectives, fully depleted areas still count (they still have the printed icon), and if there are fewer areas of the required type on the board than the objective asks for, controlling all of them is enough.</li>";
      return h + "</ul>";
    },
    src: function (c) {
      if (c.mode === "scenario") return "BW p.12 · Base p.18 · FAQ p.1";
      if (c.mod("gc")) return "Base p.18, p.42" + (c.mod("team") ? "–43" : "") + " · FAQ p.1–2" + (c.mode === "survival" ? " · BW p.11" + (c.mod("fast") ? " · FAQ p.3" : "") : "");
      var s = ["Base p.17–18" + (c.mod("team") ? ", p.43" : "") + " · FAQ p.1–2"];
      if (c.has("bw")) s.push(c.mod("lg") || c.mod("nlc") ? "BW p.10–11" : "BW p.10, p.20");
      return s.join(" · ");
    }
  },
  {
    title: "Brood War — Leadership cards & heroes",
    when: function (c) { return c.has("bw"); },
    html: function (c) {
      var h = "<ul>";
      var hero = "<li>A hero is a normal unit of its type (it matches that unit's Combat cards and has its Faction Sheet abilities) plus the card's abilities, marked by a <b>hero token</b> under the figure that moves with it. Heroes are immune to splash damage, to mind control and to Technology card abilities that destroy units.</li>";
      if (c.mode === "scenario") return h + "<li><b>Scenarios</b>: Leadership cards are never used unless the scenario says so. A scenario that starts you with a hero also gives you that hero's Leadership card.</li>" + hero + "</ul>";
      if (c.mod("nlc")) h += "<li><b>No Leadership Cards</b>: each player has only their Special Victory Leadership card; the Choose Leadership Cards steps are skipped, so there are no Stage II or III cards and no heroes from them. (The Event cards <i>Subtle Planning</i>, <i>Heroic Strategy</i> and <i>Inspiring Leadership</i> were removed at setup.)</li>";
      else h += "<li>Each faction has <b>7 Leadership cards</b> in three stages. You use one per stage, up to three in a game: Stage I at setup, the others in step 5 of the first Regrouping Phase of each new stage. They are never randomized: you choose.</li>" +
        "<li>Choose face down, reveal together, and resolve starting with the first player, clockwise. One-time cards are then removed from the game; <i>Place in your play area</i>, Special Victory and Hero cards stay in play.</li>" +
        "<li>Stage I cards list your starting units. Each faction has one Stage I <b>Special Victory</b> card: " +
          (c.mod("lg") ? "in Larger Galaxy it isn't used at all." : (c.mod("gc") ? "in " + (c.mode === "survival" ? "Survival" : "Galactic Conquest") + " its objective can't win the game, because elimination is the only victory." : "without it you can only win on conquest points.")) + "</li>" +
        "<li>You may look at any player's Leadership deck at any time, except during a Choose Leadership Cards step.</li>" +
        "<li><b>Heroes</b>: each faction has at least one Stage II card with the <b>Hero</b> trait. Take a figure of that type from your unbuilt figures (if none is left, you may destroy one of yours of that type), place it in any friendly area and put a hero token under it. If you have no friendly area where it can legally go, you can't gain the hero.</li>" + hero;
      h += "<li><b>FAQ rulings</b>: <i>Sarah Kerrigan</i> (Queen of Blades) lets her take the <i>Psionic Storm and Cloaking</i> cards from her Technology deck and shuffle them into her Combat deck. <i>Tactical Mastery</i> (Arcturus Mengsk): its conquest points count as if printed in the area: whoever controls the area scores them, and they can never be moved or removed.</li></ul>";
      return h;
    },
    src: function (c) {
      if (c.mode === "scenario") return "BW p.10, p.12";
      return (c.mod("nlc") ? "BW p.11 · " : "BW p.3, p.9–10" + (c.mod("lg") ? ", p.11" : "") + (c.mod("gc") && !c.mod("lg") ? " · Base p.42" : "") + " · ") + "FAQ p.3";
    }
  },
  {
    title: "Brood War — planets, installations & tokens",
    when: function (c) { return c.has("bw"); },
    html: function () {
      return "<ul><li><b>Ground-only and flying-only areas</b>: units may never enter, be built in or occupy an area whose special unit limit icons don't match their type. Bases and installations (Terran bases included) can never be built in, move into or be in a flying-only area. Otherwise these are normal areas.</li>" +
        "<li><b>Strategic areas</b> (gold hexagon): control one and every order you execute on that planet counts as special without using your Special Order Pool.</li>" +
        "<li><b>Moria</b>, the large planet: its five areas don't look adjacent, but there are no special movement rules.</li>" +
        "<li><b>Installations</b> (Infested Command Centers, Cerebrate, Overmind, Warp Gate): placed in areas, they don't count toward unit limits; an area holds at most one base or one installation. They are destroyed the same way as bases, but they are not bases and give no resources. An area holding only an installation is controlled by its owner. The Cerebrate, Overmind and Warp Gate follow their Leadership card or scenario; Infested Command Centers come from the Zerg <i>Infest Command Center</i> technology.</li>" +
        "<li><b>Guard token</b>: at the start of a battle in its area, the defender may discard it for <b>+2 health in each skirmish</b>. It is discarded if you no longer control the area. Defending only, and it can't be combined with other health bonuses (another defend or guard token, a <i>Bunker</i> Technology card, a <i>Flawless Defense Plan</i> Event card).</li>" +
        "<li><b>Mind control tokens</b> (2 per Protoss faction), <b>hero tokens</b>, <b>resource tokens</b>; the <b>Star order token</b> and <b>special conquest point tokens</b> belong to Arcturus Mengsk's matching Leadership cards; <b>scenario item tokens</b> are used only by scenarios.</li></ul>";
    },
    src: function () { return "BW p.3–4, p.6, p.9 · FAQ p.3"; }
  },
  {
    title: "Variant — Galactic Conquest",
    when: function (c) { return c.mod("gc") && c.mode !== "survival"; },
    html: function (c) {
      return "<ul><li>For a long game that ends only when a single " + (c.mod("team") ? "team" : "faction") + " is left standing: no conquest points are acquired, and the only way to win is an elimination victory.</li>" +
        "<li>Before setting up the Event deck, remove the <i>The End Draws Near</i> cards and return them to the box.</li>" +
        "<li>When the last Event card is drawn, shuffle all the Stage III Event cards in the discard pile to form a new Event deck and continue.</li>" +
        "<li>It can be combined with Team Play: play until only one team is left.</li></ul>";
    },
    src: function () { return "Base p.42"; }
  },
  {
    title: "Game mode — Survival",
    when: function (c) { return c.mode === "survival"; },
    html: function (c) {
      return "<ul><li>A quicker, more unforgiving version of the Galactic Conquest variant: follow all its rules (no conquest points, no <i>The End Draws Near</i>, recycled Stage III Event deck, elimination is the only victory), plus:</li>" +
        "<li>You are eliminated as soon as you have <b>no bases</b> in play.</li>" +
        "<li>A destroyed base is removed from the game and returned to the box.</li>" +
        "<li>Each time you would receive a conquest point, take a <b>resource token</b> of your choice instead.</li>" +
        "<li><b>FAQ addition</b>: you don't need a base to build transports on a planet, as long as you control at least one area there.</li>" +
        (c.mod("fast") ? "<li><b>Faster Survival</b> (FAQ recommendation): each faction has only 3 bases for the whole game.</li>" : "<li>The FAQ recommends <b>Faster Survival</b> (each faction keeps only 3 bases) to shorten the game.</li>") +
        "<li>Game modes can't be combined with the Brood War optional rules, and only one game mode is used at a time.</li></ul>";
    },
    src: function () { return "BW p.11 · Base p.42 · FAQ p.3"; }
  },
  {
    title: "Variant — Team Play",
    when: function (c) { return c.mod("team"); },
    html: function (c) {
      return "<ul><li>Four or six players in teams of two; each still controls their own faction. Decide the teams, then determine factions at random; seat teammates as far apart as possible.</li>" +
        "<li>You may not attack your teammate or move into areas they control, and your teammate's areas still count as <b>enemy areas</b> for all game purposes.</li>" +
        (c.mod("gc") || c.mod("lg") ? "" : "<li>Your teammate's units, bases and areas don't count toward your own special victory objective.</li>") +
        (c.has("bw") ? "<li>The FAQ's <b>team game restriction</b> (no base that would give your team a base in every area of a planet) applies only without Brood War, so it isn't used here.</li>"
          : "<li><b>Team game restriction</b>: you can't build a base on a planet if it would give your team a base in every area of that planet (so a team can't lock a small planet with Air Support modules).</li>") +
        (c.mod("gc") ? "<li>Victory: the last team standing wins.</li></ul>" : "<li>Victory: see Winning the game (team totals).</li></ul>");
    },
    src: function () { return "Base p.42–43 · FAQ p.1"; }
  },
  {
    title: "Brood War optional rules in play",
    when: function (c) { return ["rf", "dso", "mspt", "lg", "nlc"].some(function (id) { return c.mod(id); }); },
    html: function (c) {
      var h = "<p>Optional rules are used only if every player agrees before setup; they can't be combined with a game mode.</p><ul>";
      if (c.mod("rf")) h += "<li><b>Randomized Factions</b>: factions aren't chosen; each player is dealt a random Brood War Faction Sheet.</li>";
      if (c.mod("dso")) h += "<li><b>Disposable Special Orders</b> (for advanced players): you may always execute special orders instead of discarding them for Event cards, regardless of your R&amp;D modules. A special order you execute but can't (or won't) put in your Special Order Pool is removed from the game.</li>";
      if (c.mod("mspt")) h += "<li><b>More Starting Planet Tokens</b>: each player draws three starting planet tokens and takes the tiles, but places only two; after each player has placed two, the other tiles go back in the box.</li>";
      if (c.mod("lg")) h += "<li><b>Larger Galaxy</b> (slower build-up, more high-level units): three planet tokens each, and after everyone has placed two planets, each player (first player first, clockwise) places their third. Still a single base, on any of your three planets. No Special Victory Leadership cards, and <b>25</b> conquest points to win" +
        (c.mod("gc") ? " (moot in Galactic Conquest, where nobody scores conquest points)" : (c.mod("team") ? " (neither book says how this combines with Team Play's 30-point team target: see Winning the game)" : "")) + "." +
        (c.mod("nlc") ? " With No Leadership Cards, each player simply starts with the units on their Special Victory Leadership card." : "") + "</li>";
      if (c.mod("nlc")) h += "<li><b>No Leadership Cards</b> (a more traditional game): everyone begins with their Special Victory Leadership card and the Choose Leadership Cards steps are skipped. At setup, remove <i>Subtle Planning</i>, <i>Heroic Strategy</i> and <i>Inspiring Leadership</i> from the Event deck, then remove one fewer random card from each of Stage I and II.</li>";
      h += "</ul>";
      if (c.mod("mspt") || c.mod("lg")) h += "<p class='inline-note'>This page's call: More Starting Planet Tokens and Larger Galaxy can't both be selected here. BW p.11 lets any number of optional rules be combined, but these two contradict each other: one returns each player's third planet to the box, the other places it.</p>";
      return h;
    },
    src: function (c) { return "BW p.11" + (c.mod("lg") && c.mod("gc") ? " · Base p.42" : (c.mod("lg") && c.mod("team") ? " · Base p.43" : "")); }
  },
  {
    title: "Game mode — Scenarios",
    when: function (c) { return c.mode === "scenario"; },
    html: function () {
      return "<ul><li>Scenarios are story missions played instead of a normal game, each with its own setup, factions, victory conditions and special rules. The scenarios themselves are printed on BW p.13–16, which are not in the source PDF; follow the scenario for its details.</li>" +
        "<li><b>Victory</b>: usually no conquest points and no special victory objectives; the scenario says what each faction or team must do.</li>" +
        "<li><b>Play order</b>: the scenario names the first player and the seating order.</li>" +
        "<li><b>Counting rounds</b>: an unused conquest marker starts on 1 and moves up at the end of each Regrouping Phase.</li>" +
        "<li><b>Teams</b>: many scenarios split the factions into teams; the team rules are in the core rulebook's Team Play variant (Base p.42).</li>" +
        "<li><b>No Leadership cards</b> unless the scenario says so (a starting hero comes with its Leadership card).</li>" +
        "<li><b>Scenario items</b> (Psi Emitter, Khalis Crystal, Uraj Crystal): most can be carried by units, though a scenario may restrict which. A carried item sits under the unit and moves with it; if the unit is destroyed, the item stays in that area. To pick one up you must control its area; when executing a Mobilize order, choose one of your units in that area to carry it. A unit carries one item at a time.</li>" +
        "<li><b>Special rules</b> in each scenario must also be followed. A scenario can't be combined with the optional rules or another game mode.</li></ul>";
    },
    src: function () { return "BW p.11–12 · Base p.42"; }
  },
  {
    title: "Unit combat values (Brood War)",
    when: function (c) { return c.has("bw"); },
    html: function (c) {
      var races = ["Zerg", "Terran", "Protoss"].filter(function (r) { return SC.raceIds(c, r).length; });
      var h = "<p>Highest and lowest attack and health values among the standard Combat cards matching each unit, with the number of technologies that affect it (Brood War decks). Assist units have no values: they never match a standard Combat card.</p>";
      races.forEach(function (r) {
        h += "<h4>" + r + "</h4><table class='ref-table num'><thead><tr><th>Unit</th><th>Attack max / min</th><th>Health max / min</th><th>Techs</th><th>Ability</th></tr></thead><tbody>" +
          SC.unitTable.filter(function (u) { return u[0] === r; }).map(function (u) {
            return "<tr><td>" + u[1] + "</td><td>" + (u[2] === null ? "—" : u[2] + " / " + u[3]) + "</td><td>" + (u[4] === null ? "—" : u[4] + " / " + u[5]) + "</td><td>" + u[6] + "</td><td>" + (u[7] || "—") + "</td></tr>";
          }).join("") + "</tbody></table>";
        if (r === "Terran") h += "<p class='inline-note'>* Ghost: <b>4</b> technologies. BW p.18 prints 3, but the FAQ's errata (January 2009, newer than Brood War and covering it) says Ghosts can use four different technologies, not three. Unlike its Scourge and team-base errata, it doesn't exempt Brood War games, so the newer ruling applies here too.</p>";
      });
      return h;
    },
    src: function (c) { return "BW p.5, p.18 · Base p.42" + (SC.raceIds(c, "Terran").length ? " · FAQ p.1" : ""); }
  },
  {
    title: "Key rulings — FAQ & errata",
    when: function () { return true; },
    html: function (c) {
      var h = "<h4>General</h4><ul>" +
        "<li><b>Control</b>: you control an area if it holds at least one of your units or bases and no enemy units or bases.</li>" +
        "<li>Having the only base on a planet doesn't give you all its conquest points: you score only areas you control.</li>" +
        "<li>A player is eliminated only with <b>zero bases and zero units</b> on the board" + (c.mode === "survival" ? " (Survival: zero bases is enough)" : "") + ".</li>" +
        "<li>With enemy units in your base's area you can still build units at that base, in the planet's other friendly or empty areas.</li>" +
        "<li>Tech-required units count toward the build limit: two High Templar turned into an Archon is one unit built.</li>" +
        "<li>A z-axis route may join two planets that are already adjacent; its two ends may never be on the same planet.</li>" +
        "<li>A transport left without one of its owner's bases on either connected planet is destroyed only in step 1 of the Regrouping Phase, not at once, even when an Event card moves a z-axis route away. (This overrides the core rulebook's “immediately destroyed” on p.5.)</li></ul>" +
        "<h4>Event, Technology &amp; Combat cards</h4><ul>" +
        "<li>If both players use the Event card that makes the opponent play Combat cards first and face up, both play face up, the attacker first (the defender's ability resolves second and overrides).</li>" +
        "<li>Several <i>The End Draws Near</i> cards in one hand: you must play them all but gain the added benefit (extra card or extra VP) of only one; then discard your other Event cards.</li>" +
        "<li>You must use the special ability of a Combat card you played if it matches your front-line unit.</li>" +
        "<li><i>Nuke</i> + <i>Cloaking Field</i>: the Nuke still triggers if the Ghost withdraws; only the Ghost being physically destroyed prevents it.</li>" +
        "<li>A Scourge card's ability against a cloaked unit: the unit withdraws as normal. <i>Stasis Field</i> affects only combat values and doesn't cancel a Scourge card's text.</li>" +
        "<li><i>Recall</i> moves a single unit to one area containing an Arbiter, however many Arbiters there are.</li>" +
        "<li><i>Metabolic Boost</i>: if an attacking front-line Zergling has sufficient strength to destroy the opposing ground unit, it gains +2 health, only when attacking and only in that skirmish." +
          (c.has("bw") ? " (Brood War swaps in a revised <i>Metabolic Boost</i> card, BW p.5. The FAQ, issued after Brood War, keeps this ruling without limiting it to the core game, so it still applies unless the new card's own text says otherwise.)" : "") + "</li>" +
        "</ul><h4>Victory &amp; retreats</h4><ul>" +
        "<li>Fully depleted areas still count toward special victory objectives; if fewer areas of the needed type exist on the board, control all of them.</li>" +
        (SC.aldarisOn(c) && !c.mod("team") ? "<li>If Aldaris is eliminated, the conquest point target goes back to 15.</li>" : "") +
        "<li>Both sides left with only assist units: the defender retreats. An attacker over the unit limit retreats the excess only after the defenders have retreated.</li></ul>" +
        "<h4>Errata</h4><ul>" +
        "<li>The core rulebook's back-cover list of Regrouping steps is in the wrong order; use p.15–16 (as on this page).</li>" +
        "<li>Order reference sheet: the Queen of Blades' special victory is to control three areas containing conquest points (as on her Faction Sheet), and Ghosts can use four technologies, not three." +
          (c.has("bw") ? " This also applies with Brood War: the Brood War combat values table (BW p.18) still prints 3, but this FAQ is newer and, unlike its Scourge and team-base errata, doesn't exempt Brood War games." : "") + "</li>";
      if (!c.has("bw")) h += "<li><b>Team game restriction</b>: in a team game, you can't build a base on a planet if it would give your team a base in every area of that planet.</li>" +
        "<li><b>Scourge Combat cards (#10–12)</b> read: <i>End of the Destroy Units Step: If your front-line unit was not destroyed, destroy it. If this happens, and your opponent's front-line unit is flying, it is also destroyed. This does not trigger any Splash Damage abilities.</i></li>";
      h += "</ul>";
      if (c.has("bw")) {
        h += "<h4>Brood War</h4><ul>" +
          "<li>The FAQ's team game restriction and Scourge card wording apply only <b>without</b> Brood War (Brood War removes Scourge cards 10–12).</li>" +
          "<li>Overmind Faction Sheet: Guardians attack only ground units.</li>" +
          "<li>Special Order Pool: ignore the mention of strategic areas in <i>Execute Special Order</i> (BW p.5); only R&amp;D modules size the pool.</li>" +
          "<li>Sacrifice: ignored if the unit can't attack both the opposing front-line unit and supporting units, or if the opposing unit has cloaking and no friendly detector is present.</li>" +
          "<li>A Defend order counts toward your four orders per Planning Phase.</li>" +
          "<li>Mind control: the stolen unit's standard Combat card must come from the top of its original owner's deck; you may add reinforcement cards from your hand that match it.</li>" +
          "<li><i>Leg Enhancement</i>: for this card, a unit's cost includes the cost of the units destroyed to build it (an Archon costs 4: 2 for the Archon plus 2 in all for the High Templars).</li>" +
          "<li>A canceled <i>Feedback</i> card (e.g. by <i>EMP Shockwave</i>) is canceled without its ability resolving.</li>" +
          "<li><i>Sarah Kerrigan</i> (Leadership card): the Queen of Blades takes the <i>Psionic Storm and Cloaking</i> cards from her Technology deck and shuffles them into her Combat deck.</li>" +
          "<li><i>Tactical Mastery</i> (Leadership card): its conquest points are treated as printed in the area, so whoever controls the area scores them; they can never be removed or moved.</li>" +
          (c.mode === "scenario" ? "<li>Scenario errata (<i>Eye of the Storm</i>, <i>Quest for Uraj and Khalis</i>, <i>Trump Card</i>) are in the setup steps.</li>" : "") +
          "<li>Survival: you may build transports on a planet without a base there, as long as you control at least one area on it. The FAQ also recommends Faster Survival: each faction keeps only 3 bases.</li></ul>";
      }
      return h;
    },
    src: function (c) { return c.has("bw") ? "FAQ p.1–3 · Base p.5 · BW p.5, p.18" : "FAQ p.1–2 · Base p.5"; }
  },
  {
    title: "Frequently overlooked rules",
    when: function () { return true; },
    html: function (c) {
      var n = SC.rg(c);
      return "<ul><li>Event cards stay unread until the Play Event Cards step (step " + n.events + ") of the Regrouping Phase. (The core quick reference says step 7; in the corrected order it is step 8" + (c.has("bw") ? ", and step 9 with Brood War" : "") + ".)</li>" +
        "<li>Mobilize orders move units <b>to</b> (or on) the planet the order is on, never <b>from</b> it.</li>" +
        "<li>To score an area's conquest points you need a base and/or units in it, and no enemy there.</li>" +
        "<li>When you lose a Resource card (Regrouping step 2), all workers on it are destroyed.</li>" +
        "<li>Units in an area with an enemy base destroy it in Regrouping step 1, and not before.</li>" +
        "<li>You may force mine a Resource card for one extra resource, at the cost of partially depleting (or depleting) it.</li>" +
        "<li>With a base on the active planet, a Build order may place units in any friendly or empty area of that planet.</li>" +
        "<li>The active player may draw an Event card instead of executing the order just revealed.</li>" +
        "<li>Any player may use any z-axis navigation route, whatever its colour.</li></ul>";
    },
    src: function () { return "Base p.48 · FAQ p.1"; }
  }
];

/* =============================================================================
   TEACHING SCRIPT
   ============================================================================= */
SC.teach = {
  intro: "A ~5-minute teach for the exact sets, mode and options selected above. Read it aloud, or copy it and adjust. It is written from the rulebooks and FAQ cited in the setup steps.",
  sections: [
    {
      h: "The hook — and how you win",
      body: function (c) {
        if (c.mode === "scenario") return "<p>Tonight we're playing a Brood War <b>scenario</b>: a story mission with its own map, factions and victory conditions, so I'll read our objectives from the scenario itself. Everything else (orders, building, battles) works as in a normal game, and that's what I'll teach.</p>";
        var open = "<p>We're commanders fighting over the planets on this table: " + c.p + " factions of Terran, Protoss and Zerg. Planets give <b>minerals</b> and <b>gas</b> to pay for everything";
        if (c.mod("gc")) {
          return open + ". " + (c.mode === "survival" ? "This is Brood War's <b>Survival</b> mode" : "We're playing <b>Galactic Conquest</b>") +
            ", so nobody scores points: the only way to win is to be the last " + (c.mod("team") ? "team" : "faction") + " standing. " +
            (c.mode === "survival" ? "You're out the moment you have no bases left, and destroyed bases leave the game, so guard them.</p>" : "You're out when you have no bases and no units left on the board.</p>");
        }
        var h = open + ", and some areas are worth <b>conquest points</b>. ";
        if (c.mod("team") && c.mod("lg")) h += "We play in teams of two and pool our conquest points. Team Play's target is <b>30</b> between a team's players, but neither book says how Larger Galaxy's 25 changes that, so we agree our target before we start. ";
        else if (c.mod("team")) h += "We play in teams of two, and a team wins with <b>30</b> conquest points between its players at the end of a round" + (SC.aldarisOn(c) ? " (40 for the other teams if Aldaris's objective is in play)" : "") + ". ";
        else h += "If anyone has <b>" + (c.mod("lg") ? 25 : 15) + "</b> conquest points at the end of a round, the game ends and the most points wins" + (SC.aldarisOn(c) ? " (everyone but Aldaris needs 20 if his special objective is in play)" : "") + ". ";
        if (!c.mod("lg")) h += "You can also win with your faction's <b>special victory objective</b>, usually only in Stage III" + (c.has("bw") ? " and, with Brood War, only if you took your Special Victory Leadership card" : "") + ", or by wiping everyone out. ";
        else h += "You can also win by wiping everyone out. ";
        return h + "The <b>Event deck</b> is the clock: once two <i>The End Draws Near</i> cards are played, " + (c.mod("team") ? "the team with the most combined points wins" : "the most points wins") +
          (SC.aldarisOn(c) ? ", unless Aldaris's objective is in play: then " + (c.mod("team") ? "Aldaris's team wins" : "Aldaris wins") : "") + ".</p>";
      }
    },
    {
      h: "The shape of a round",
      body: function (c) {
        return "<p>A round has three phases. <b>Planning</b>: from the first player, clockwise, we each place one <b>order</b> face down on a planet, until everyone has placed four. You can only order a planet where you have a unit or base, or one next door." +
          (c.has("bw") ? " A Defend order resolves the moment you place it, and counts as one of your four." : "") +
          " <b>Execution</b>: from the first player, each of us reveals one of our orders on top of a stack and carries it out. <b>Regrouping</b>: bases with enemies in their area are destroyed, Resource cards change hands, workers come home, " +
          (SC.scoring(c) ? "we score points and check for victory, " : "") + "we play Event cards, discard to our hand limit and pass the first player token left.</p>";
      }
    },
    {
      h: "Your three orders — and why",
      body: function (c) {
        return "<ul><li><b>Build</b>: with a base on that planet, build workers, transports and units up to your build limit. With a unit or base there, buy up to one building and one module; they upgrade all your bases, and buildings unlock new units. With a unit but no base there, build a base.</li>" +
          "<li><b>Mobilize</b>: move units around that planet, or bring them in from neighbouring planets across routes where you have a transport. Moving into enemies starts a battle, and an attacker may exceed the area's unit limit by two.</li>" +
          "<li><b>Research</b>: needs a base there. You must draw an Event card; then you may draw three Combat cards and buy a technology for your Combat deck.</li></ul>" +
          "<p>Any order" + (c.has("bw") ? " except a Defend order" : "") + " can be traded for an <b>Event card</b> instead when you reveal it; Event cards stay face down until Regrouping.</p>";
      }
    },
    {
      h: "The order stack — the heart of the game",
      body: function () {
        return "<p>Orders on one planet pile up, and the <b>last one placed is carried out first</b>. To move onto a planet and then build a base there, place the Build first and the Mobilize on top. You can also bury a rival's order to delay it; if all your remaining orders are buried, you draw an Event card instead. Being first player isn't always good: everyone gets to stack on you.</p>";
      }
    },
    {
      h: "Paying for things — workers and resources",
      body: function (c) {
        return "<p>You pay by putting <b>workers</b> on your Resource cards: one worker per mineral or gas, up to the card's number, and they stay there until Regrouping, so workers are your real budget. The two <b>permanent resources</b> on your Faction Sheet can't be lost; use them first. Each Regrouping you collect the Resource cards for areas you control on planets with your base (empty areas too, if yours is the only base there), and lose any whose area an enemy occupies or whose planet no longer has your base. Short? <b>Force-mine</b> one extra worker onto a card, but the area starts to run dry." +
          (c.has("bw") ? " Brood War's resource tokens each take one off a cost." : "") + "</p>";
      }
    },
    {
      h: "Battles",
      body: function () {
        return "<p>The attacker pairs units one on one into <b>skirmishes</b>; spare units join as supporters. Each side plays a <b>Combat card</b> face down to every skirmish, attacker first, optionally with a reinforcement card, or blind off the top of the deck. If the card shows your front-line unit, use its big numbers and its ability; otherwise the small ones. Attack equal to or above their health kills their unit, if yours can hit it: some units only hit ground, some only fliers. Then splash damage, and if both sides still have units, the attacker usually retreats (not when only assist units are left defending).</p>";
      }
    },
    { when: function (c) { return c.has("bw"); },
      h: "Brood War",
      body: function (c) {
        var h = "<p>Brood War adds new units and changes a few rules. <b>Special orders</b> (the gold tokens) can be placed freely, but executing one needs room in your <b>Special Order Pool</b>, one slot per Research &amp; Development module; otherwise you take the Event card. Control a planet's <b>strategic area</b> and your orders there count as special for free. Your <b>Defend order</b> moves units into one of your areas during Planning and leaves a guard token there, worth +2 health per skirmish when it's attacked.";
        if (SC.lead(c)) h += " At each new stage we each pick one of our seven <b>Leadership cards</b>: Stage I sets your starting forces" + (c.mod("gc") ? "" : ", only the Special Victory card lets you win by objective" + (c.mod("lg") ? " (unused in Larger Galaxy)" : "")) + ", and Stage II brings heroes.";
        else if (c.mod("nlc")) h += " With <b>No Leadership Cards</b>, everyone simply starts with their Special Victory Leadership card.";
        else h += " Leadership cards stay in the box unless the scenario says otherwise.";
        return h + "</p>";
      }
    },
    { when: function (c) { return c.mod("team"); },
      h: "Team Play",
      body: function (c) {
        return "<p>We're in teams of two, sitting apart. You can't attack your teammate or move into their areas, yet their areas still count as enemy areas. " +
          (c.mod("gc") ? "The last team standing wins."
            : (c.mod("lg") ? "With Larger Galaxy there are no special victories: a team wins on our agreed points target, or with the most combined points when the end draws near, or by being the last team standing."
              : "Either partner's special victory wins for both; otherwise it's 30 points combined, or the most combined points when the end draws near" + (SC.aldarisOn(c) ? " (Aldaris's team wins that one if his objective is in play)" : "") + ".")) +
          (c.has("bw") ? "" : " And you can't build a base that would give your team every area of a planet.") + "</p>";
      }
    },
    { when: function (c) { return c.mod("gc") && c.mode !== "survival"; },
      h: "Galactic Conquest",
      body: function (c) {
        return "<p><i>The End Draws Near</i> cards are out of the deck, so there's no clock: the Event deck recycles its Stage III cards and we play until one " + (c.mod("team") ? "team" : "faction") + " is left.</p>";
      }
    },
    { when: function (c) { return c.mode === "survival"; },
      h: "Survival",
      body: function (c) {
        return "<p>Survival plays like Galactic Conquest, only harsher: no bases means you're out, destroyed bases leave the game, and each conquest point you would score becomes a resource token instead. A Build order may build transports on a planet where you control an area, even without a base there." +
          (c.mod("fast") ? " And with <b>Faster Survival</b>, each faction has only 3 bases for the whole game." : "") + "</p>";
      }
    },
    { when: function (c) { return ["rf", "dso", "mspt", "lg", "nlc"].some(function (id) { return c.mod(id); }); },
      h: "Optional rules tonight",
      body: function (c) {
        var L = [];
        if (c.mod("rf")) L.push("<li><b>Randomized Factions</b>: your faction was dealt at random.</li>");
        if (c.mod("dso")) L.push("<li><b>Disposable Special Orders</b>: you can always execute a special order, but if it doesn't fit in your pool, that token is gone for good.</li>");
        if (c.mod("mspt")) L.push("<li><b>More Starting Planet Tokens</b>: we each drew three planets and placed two.</li>");
        if (c.mod("lg")) L.push("<li><b>Larger Galaxy</b>: three planets each, still one starting base and no special victories. " +
          (c.mod("gc") ? "It normally takes 25 conquest points to win, but in Galactic Conquest nobody scores points, so that doesn't matter tonight."
            : (c.mod("team") ? "It raises the normal target to 25 conquest points; for teams we use the target we agreed." : "It takes 25 conquest points to win.")) + "</li>");
        if (c.mod("nlc")) L.push("<li><b>No Leadership Cards</b>: just your Special Victory card, no new picks at each stage.</li>");
        return "<ul>" + L.join("") + "</ul>";
      }
    },
    { when: function (c) { return c.mode === "scenario"; },
      h: "Scenario rules",
      body: function () {
        return "<p>The scenario sets our factions, seating, starting forces and goals. Some last a set number of rounds, tracked with a spare conquest marker; some split us into teams; some use <b>scenario items</b>, which a unit picks up when you Mobilize in an area you control that holds one, and drops where it dies.</p>";
      }
    },
    { when: function (c) { return c.facs.length > 0; },
      h: "Your factions",
      body: function (c) {
        return "<ul>" + c.facs.map(function (f) {
          var F = SC.F[f], s = "<li><b>" + F.name + "</b> (" + F.race + "): ";
          if (F.race === "Terran") s += "holds up to 8 Combat cards, not 6; Supply modules raise the build limit.";
          if (F.race === "Protoss") s += "Supply modules raise the build limit" + (c.has("bw") ? "; can mind control enemy units." : ".");
          if (F.race === "Zerg") s += "no Supply modules: the build limit is twice the number of different building types.";
          if (f === "aldaris" && SC.aldarisOn(c)) s += c.mod("team")
            ? " His objective raises every other team's target to 40 and wins the game for his team when two <i>The End Draws Near</i> cards are played."
            : " His objective raises everyone else's target to 20 and wins him the game when two <i>The End Draws Near</i> cards are played.";
          return s + "</li>";
        }).join("") + "</ul>";
      }
    },
    {
      h: "Don't worry about these until they come up",
      body: function (c) {
        var L = ["<li><b>Keywords</b> (cloaking, detector, assist, cancel, <i>vs.</i>) and <b>splash damage</b>: we'll read them when they appear.</li>",
          "<li><b>Tech-required units</b>: Guardians and Archons are built by sacrificing other units.</li>",
          "<li><b>Air Support modules</b> stop enemies transporting units from other planets straight into the areas with that player's bases.</li>",
          "<li><b>Z-axis routes</b> work like normal routes, for anyone.</li>"];
        if (SC.scoring(c)) L.push("<li><b>Tiebreakers</b>: total resources, then areas, bases and idle workers.</li>");
        if (c.has("bw")) L.push("<li>Brood War's <b>mind control, recharge, collateral damage, sacrifice</b> and <b>installations</b>: see the reference.</li>");
        if (SC.lead(c)) L.push("<li><b>Heroes</b> arrive with Stage II Leadership cards.</li>");
        return "<ul>" + L.join("") + "</ul>";
      }
    }
  ]
};
