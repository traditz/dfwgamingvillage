/* =============================================================================
   Warrior Knights — Setup & Reference Utility · data
   Sources (the only sources used):
     Rules  = Warrior Knights Rules of Play (FFG, 2006). Printed folio "Page N" = PDF page N.
     FAQ    = Warrior Knights FAQ, last updated January 8, 2007 (printed pages 1–3).
     C&G    = Crown and Glory expansion rules (May 2007): two spreads with no printed page numbers,
              counted here as four pages in reading order (sheet 1 left = p.1 … sheet 2 right = p.4).
   Precedence: newest wins — C&G (May 2007) > FAQ (Jan 2007) > Rules (2006). FAQ errata are applied
   throughout; where Crown and Glory's For Glory variant changes a rule the FAQ also addresses (the Fate-card
   draw limit) the current rule is shown and both are cited.
   ============================================================================= */
var WK = {};

WK.expMeta = {
  base: { name: "Warrior Knights", cls: "tag-base" },
  faq:  { name: "FAQ",             cls: "tag-faq" },
  cg:   { name: "Crown and Glory", cls: "tag-cg" },
  fg:   { name: "For Glory",       cls: "tag-fg" },
  mis:  { name: "Missions",        cls: "tag-mis" },
  king: { name: "The King",        cls: "tag-king" },
  var:  { name: "Optional rule",   cls: "tag-var" }
};

WK.expansions = [
  { id: "base", short: "Warrior Knights", year: "2006",
    blurb: "The base game: six Barons, their Nobles and armies, the Assembly, the Church, three expeditions and the Fate deck. Always in play." },
  { id: "cg", short: "Crown and Glory", year: "2007 expansion",
    blurb: "Three variants — For Glory, Missions and The King — which may be used in any combination (C&G p.1)." }
];

/* Crown and Glory's three variants ("All three variants are compatible with one another" — C&G p.1) */
WK.modules = [
  { id: "fg", requires: "cg", name: "For Glory", summary: "Knowledge &amp; Advancements, Garrisons, Town Levies, new Action, Agenda, Event, Mercenary and Fate cards",
    description: "The variant that expands the game most: a new resource (Knowledge) buys Advancement cards; new troop types; new Baron and Neutral Action cards; the original Fate deck is replaced by a new 48-card deck.", src: "C&G p.1–4" },
  { id: "mis", requires: "cg", name: "Missions", summary: "A secret Mission card, worth 2 Influence if fulfilled at the end",
    description: "Each Baron is dealt one secret Mission card before strongholds are placed; fulfilled Missions score 2 Influence at the end of the game.", src: "C&G p.4" },
  { id: "king", requires: "cg", name: "The King", summary: "The pool running out crowns a King; play on until someone reaches 16 Influence",
    description: "A slightly longer game: 8 Influence per Baron in the pool; when it runs out the Baron with the most Influence becomes King (with the King's Army and +1 Influence per Upkeep) and play continues until a Baron has 16 Influence.", src: "C&G p.4" }
];

/* Base-game and FAQ optional rules ("All players must agree at the start of the game which optional rules and
   variants they will use" — Rules p.19). Game Length is the separate length selector. */
WK.variants = [
  { id: "openpm", name: "Open Private Motions", summary: "Private Motions may propose anything the players can invent",
    description: "Broader Private Motions, e.g. prohibiting sieges or all road movement; they must still be voted on like any other Agenda.", src: "Rules p.19" },
  { id: "heirs", name: "Exchanging Heirs", summary: "Every Noble has a tradeable heir — hold one and you hold a hostage",
    description: "Each Noble has one heir (a token); heirs may be traded between Barons; a dead Noble returns only if the holder of his living heir returns it.", src: "Rules p.19–20" },
  { id: "elim", name: "Player Elimination", summary: "Lose your stronghold and you are out of the game",
    description: "A Baron whose stronghold is captured is eliminated: his Nobles leave the board and his cities become neutral.", src: "Rules p.20" },
  { id: "might", name: "Might Is Right", summary: "The city win is the only victory; Influence decides nothing",
    description: "Only one victory condition: more than half the unrazed Kingdom cities at the beginning of an Upkeep phase. The game does not end when the Influence pool runs out.", src: "Rules p.20" },
  { id: "aband", name: "Abandoned Nobles", summary: "A Noble killed by desertion is abandoned, not dead (FAQ)",
    description: "Makes mercenary desertion less harsh: a Noble who dies because of desertion is treated like a dead Noble except that he does not count as dead for cards such as No Heir.", src: "FAQ p.3" },
  { id: "mirac", name: "Miracles Can Happen", summary: "Cancel an Event later for 1 Faith more than its printed cost (FAQ)",
    description: "Continuous Events (such as No Heir or Heretic) may be canceled after they happen by paying 1 Faith more than the printed cancellation cost.", src: "FAQ p.3" }
];

/* ---- helpers ------------------------------------------------------------------------------------------ */
WK.WORDS = ["zero", "one", "two", "three", "four", "five", "six"];
WK.word = (n) => WK.WORDS[n] || String(n);
WK.RAZED = { 2: 11, 3: 7, 4: 5, 5: 3, 6: 0 };                 // Rules p.19
WK.unrazed = (p) => 18 - WK.RAZED[p];                          // 18 Kingdom cities (Rules p.2)
WK.majority = (p) => Math.floor(WK.unrazed(p) / 2) + 1;
WK.fg = (c) => c.has("cg") && c.mod("fg");
WK.mis = (c) => c.has("cg") && c.mod("mis");
WK.king = (c) => c.has("cg") && c.mod("king");
WK.anyCG = (c) => WK.fg(c) || WK.mis(c) || WK.king(c);
WK.VAR_IDS = ["openpm", "heirs", "elim", "might", "aband", "mirac"];
WK.anyVar = (c) => WK.VAR_IDS.some((id) => c.mod(id));
WK.fateMax = (c) => (WK.fg(c) ? 20 : 10);                      // FAQ p.1 errata; For Glory C&G p.3
WK.neutralPer = (c) => (WK.fg(c) ? 3 : 2);                     // Rules p.7; C&G p.2
WK.neutralTotal = (c) => (WK.fg(c) ? 12 : 8);                  // 8 − 3 + 7 (C&G p.1)

/* Game length. Base: 10 Influence per Baron (Rules p.5); Game Length option 8 / 12 / 15 (Rules p.19).
   The King: 8 per Baron, play to 16; shorter 6 → 12; longer 10 → 20 (C&G p.4). */
WK.lengths = (c) => WK.king(c)
  ? [ { id: "std",   name: "The King — standard", blurb: "8 Influence per Baron in the pool; play until a Baron has 16 Influence." },
      { id: "short", name: "The King — shorter",  blurb: "6 Influence per Baron; play until a Baron has 12." },
      { id: "long",  name: "The King — longer",   blurb: "10 Influence per Baron; play until a Baron has 20." } ]
  : [ { id: "std",    name: "Standard",       blurb: "10 Influence per Baron in the pool." },
      { id: "short",  name: "Shorter game",   blurb: "Game Length option: 8 Influence per Baron." },
      { id: "long",   name: "Longer game",    blurb: "Game Length option: 12 Influence per Baron." },
      { id: "long15", name: "Longer still",   blurb: "Game Length option: 15 Influence per Baron." } ];
WK.pool = (c) => (WK.king(c) ? { std: 8, short: 6, long: 10 } : { std: 10, short: 8, long: 12, long15: 15 })[c.len] || (WK.king(c) ? 8 : 10);
WK.target = (c) => ({ std: 16, short: 12, long: 20 })[c.len] || 16;
WK.lenSrc = (c) => (WK.king(c) ? "C&G p.4" : (c.len && c.len !== "std" ? "Rules p.19" : ""));

/* Join citation parts, merging the pages cited from the same document:
   cite("Rules p.5", "Rules p.19", "FAQ p.3") -> "Rules p.5, p.19 · FAQ p.3" (runs of pages become ranges). */
WK.cite = function () {
  const order = [], pages = {};
  Array.prototype.slice.call(arguments).filter(Boolean).join(" · ").split(" · ").forEach((part) => {
    const m = part.match(/^(\S+) (p\..*)$/);
    if (!m) return;
    if (!pages[m[1]]) { pages[m[1]] = new Set(); order.push(m[1]); }
    m[2].split(", ").forEach((tok) => {
      const n = tok.replace("p.", "").split("–").map(Number);
      for (let i = n[0]; i <= (n[1] || n[0]); i++) pages[m[1]].add(i);
    });
  });
  return order.map((doc) => {
    const nums = Array.from(pages[doc]).sort((a, b) => a - b), runs = [];
    nums.forEach((x) => { const r = runs[runs.length - 1]; if (r && x === r[1] + 1) r[1] = x; else runs.push([x, x]); });
    return doc + " " + runs.map((r) => "p." + r[0] + (r[1] > r[0] ? "–" + r[1] : "")).join(", ");
  }).join(" · ");
};

/* Short lines for the optional rules chosen, used by the setup step and the teach */
WK.optLines = {
  openpm: "<li><b>Open Private Motions</b> — a Private Motion may propose anything (for example, banning sieges or all road movement); it is still voted on like any other Agenda.</li>",
  heirs: "<li><b>Exchanging Heirs</b> — every Noble starts with an heir token; heirs may be traded, and a dead Noble returns only if the holder of his living heir gives it back.</li>",
  elim: "<li><b>Player Elimination</b> — a Baron whose stronghold is captured is eliminated from the game.</li>",
  might: "<li><b>Might Is Right</b> — the city win is the only victory; Influence has no effect on who wins and the game does not end when the Influence pool runs out.</li>",
  aband: "<li><b>Abandoned Nobles</b> (FAQ) — a Noble who dies because of desertion is abandoned, not dead.</li>",
  mirac: "<li><b>Miracles Can Happen</b> (FAQ) — an Event may be canceled after it happens by paying 1 Faith more than its printed cost.</li>"
};

/* =============================================================================
   SETUP PHASES — c = { has(set), p, mod(id), len }
   ============================================================================= */
WK.phases = [
  {
    title: "Before You Begin",
    steps: [
      { when: (c) => c.has("cg") && !WK.anyCG(c), exp: "cg",
        t: "Crown and Glory — choose your variants",
        d: "<ul><li>Crown and Glory is played through its three variants — <b>For Glory</b>, <b>Missions</b> and <b>The King</b>. Players agree before the game which ones they will use; any combination works.</li>" +
           "<li>No variant is selected above, so the steps below are the base game. Pick one or more variants to add their setup and rules.</li></ul>",
        src: "C&G p.1" },
      { when: (c) => WK.anyVar(c) || (!WK.king(c) && c.len !== "std"), exp: "var",
        t: "Agree on the optional rules",
        d: (c) => {
          let items = WK.VAR_IDS.filter((id) => c.mod(id)).map((id) => WK.optLines[id]).join("");
          if (!WK.king(c) && c.len !== "std") items = "<li><b>Game Length</b> — " + WK.pool(c) + " Influence per Baron in the pool instead of 10" + (c.mod("might") ? "" : " (a " + (c.len === "short" ? "shorter" : "longer") + " game)") + ".</li>" + items;
          let d = "<ul><li>All players must agree at the start of the game which optional rules they will use. This game uses:<ul>" + items + "</ul></li>";
          if (c.mod("might") && (WK.king(c) || WK.mis(c))) {
            const other = [WK.king(c) ? "The King" : "", WK.mis(c) ? "Missions" : ""].filter(Boolean).join(" or ");
            d += "<li class='caution'>The rules don't say how Might Is Right combines with " + other + ": Might Is Right makes Influence irrelevant to winning, while " +
              (WK.king(c) ? "The King is won on Influence" : "") + (WK.king(c) && WK.mis(c) ? " and " : "") + (WK.mis(c) ? "Missions pay out in Influence" : "") +
              ". Settle at the table how you will play it before you start.</li>";
          }
          if (c.mod("might") && c.len !== "std") d += "<li class='caution'>Under Might Is Right the game doesn't end when the pool runs out, so the pool's size no longer sets the game's length.</li>";
          return d + "</ul>";
        },
        src: (c) => {
          const late = c.mod("heirs") || c.mod("elim") || c.mod("might");
          const rules = late ? "Rules p.19–20" : "Rules p.19";
          return WK.cite(rules, (c.mod("aband") || c.mod("mirac")) ? "FAQ p.3" : "", (c.mod("might") && (WK.king(c) || WK.mis(c))) ? "C&G p.4" : "");
        } }
    ]
  },
  {
    title: "The Board, Decks & Treasury",
    steps: [
      { when: () => true, exp: (c) => (WK.fg(c) ? "fg" : "base"),
        t: "Lay out the board and the decks",
        d: (c) => {
          let d = "<ul><li>Unfold the board. Put the <b>Agenda deck</b>, the <b>Mercenary deck</b> and the <b>" + WK.neutralTotal(c) + " Neutral Action cards</b> beside it; the <b>Fate deck</b> and the <b>Event deck</b> go on their spaces on the board.</li>";
          if (!WK.fg(c) && WK.anyCG(c)) d += "<li><b>Crown and Glory:</b> of the expansion's cards, use only those of the variant" + (WK.mis(c) && WK.king(c) ? "s" : "") + " you chose; the rest stay out of the base game's decks (every Crown and Glory card has the expansion icon on its front, so they're easy to sort out).</li>";
          if (WK.fg(c)) d +="<li><b>For Glory</b> — before shuffling:<ul>" +
            "<li>shuffle the <b>25 new Agenda cards</b> and the <b>20 new Event cards</b> into their decks;</li>" +
            "<li>shuffle the <b>12 new Mercenary cards</b> (a Leader and a Herald for each nationality) into the Mercenary deck;</li>" +
            "<li>take the original <b>Uncertain Times</b>, <b>Muster Troops</b> (C&amp;G calls it “Muster Forces”) and <b>Upgrade Defenses</b> out of the Neutral Action cards and add all <b>7 new Neutral Action cards</b> (8 − 3 + 7 = 12);</li>" +
            "<li><b>replace the Fate deck</b> with the new <b>48-card Fate deck</b> (blue backs); the original Fate deck goes back in the box.</li></ul></li>";
          d += "<li><b>Shuffle every deck</b>, then move the <b>top card of the Event deck to the bottom</b> of that deck.</li>";
          if (WK.fg(c)) d += "<li><b>For Glory:</b> if the Event card now on top is <b>red</b>, put it on the bottom too; repeat until a <b>green or blue</b> Event is on top.</li>";
          return d + "</ul>";
        },
        src: (c) => WK.cite("Rules p.5–6", WK.fg(c) ? "C&G p.1–2" : (WK.anyCG(c) ? "C&G p.1" : "")) },
      { when: () => true, exp: (c) => (WK.king(c) ? "king" : (WK.fg(c) ? "fg" : (c.len !== "std" ? "var" : "base"))),
        t: "The treasury and the Influence pool",
        d: (c) => {
          const per = WK.pool(c);
          let note = "";
          if (WK.king(c)) note = c.len === "std" ? " (The King: 8 instead of 10)" : (c.len === "short" ? " (The King, shorter game: play to 12 Influence)" : " (The King, longer game: play to 20 Influence)");
          else if (c.len !== "std") note = c.mod("might") ? " (Game Length option)" : " (Game Length option: a " + (c.len === "short" ? "shorter" : "longer") + " game)";
          let d = "<ul><li>Put all <b>Votes, Faith and crowns</b> to the side of the board: this pool is the <b>treasury</b>. The siege markers, breach tokens, casualty tokens and extra Influence tokens go beside it, within everyone's reach.</li>";
          if (WK.fg(c)) d += "<li><b>For Glory:</b> add all the <b>Knowledge, Riot and Garrison tokens</b> to the treasury.</li>";
          const end = c.mod("might") ? "" : (WK.king(c) ? " When it runs out, a King is crowned." : " The round in which it runs out is the last.");
          d += "<li>Place <b>" + per + " Influence per Baron</b> — <b>" + (per * c.p) + "</b> for " + WK.word(c.p) + " Barons — on the board's <b>Influence pool</b> area" + note + "." + end + "</li>";
          if (WK.king(c)) d += "<li><b>The King:</b> set the <b>King token</b> and the <b>King's Army cards</b> off to the side of the board — they aren't needed until the second half of the game.</li>";
          if (c.mod("might")) d += "<li><b>Might Is Right:</b> the pool is still used, but the game does not end when it runs out.</li>";
          return d + "</ul>";
        },
        src: (c) => WK.cite("Rules p.5–6", (!WK.king(c) && !c.mod("might")) ? "Rules p.18" : "", WK.lenSrc(c), WK.fg(c) ? "C&G p.1" : "", c.mod("might") ? "Rules p.20" : "") },
      { when: (c) => WK.fg(c), exp: "fg",
        t: "For Glory — troop decks and Advancements",
        d: "<ul><li>Place the <b>Garrison deck</b> and the <b>Town Levy deck</b> in separate piles beside the board.</li>" +
           "<li>Shuffle the <b>Advancement deck</b> and place it beside the board. Draw the <b>top 3</b> and lay them faceup next to it: these are the Advancements available to buy.</li></ul>",
        src: "C&G p.1" },
      { when: () => true, exp: (c) => (WK.fg(c) && c.p < 6 ? "fg" : "base"),
        t: (c) => (c.p === 6 ? "Place the plastic cities" : "Raze cities, then place the plastic cities"),
        d: (c) => {
          if (c.p === 6) return "<ul><li>With six Barons <b>no city is razed</b>: place a <b>plastic city</b> over every city on the board (each city has a “razed city” icon for the piece to cover).</li></ul>";
          const n = WK.RAZED[c.p];
          let d = "<ul><li>With " + WK.word(c.p) + " Barons, <b>" + n + " Kingdom cities are razed</b> at random before play (2 Barons: 11 · 3: 7 · 4: 5 · 5: 3). Only Kingdom cities are razed, never the six overseas cities.</li>";
          if (WK.fg(c)) d += "<li><b>For Glory:</b> instead of using the Fate deck, draw <b>" + n + " Town Levy cards</b> at random and raze the cities they name. Then return those Town Levy cards to the game box.</li>";
          else d += "<li>Draw Fate cards to choose them: each card names a random city. Keep drawing past any card that doesn't give a usable result (for example, an overseas city). Then <b>shuffle the Fate deck</b>.</li>";
          d += "<li>Place a <b>plastic city</b> over every city that is <b>not</b> razed. Razed cities stay empty: no Baron can ever control them.</li></ul>";
          return d;
        },
        src: (c) => WK.cite(c.p < 6 ? "Rules p.5–6, p.18–19" : "Rules p.5–6", WK.fg(c) && c.p < 6 ? "C&G p.1–2" : "") }
    ]
  },
  {
    title: "The Barons",
    steps: [
      { when: () => true, exp: (c) => (WK.fg(c) ? "fg" : (c.mod("heirs") ? "var" : "base")),
        t: "Each Baron's pieces",
        d: (c) => "<ul><li>Deal each player a <b>Stronghold card</b> — it names your Baron, his color and his crest, and shows your stronghold's strength.</li>" +
          "<li>Each Baron takes, in his color: <b>4 plastic Nobles</b>, the <b>4 matching Noble cards</b> (unexhausted side up), <b>12 Baron Action cards</b>, <b>12 control markers</b>, <b>8 Baron markers</b> and his <b>stronghold marker</b>.</li>" +
          (WK.fg(c) ? "<li><b>For Glory:</b> each Baron also adds the <b>3 new Baron Action cards</b> of his color to his hand — <b>Forced March</b> and two <b>Enrich Mind</b>.</li>" : "") +
          "<li>Each Noble's base (square, circle, triangle or star) matches the icon on his Noble card — the shape tells you his special ability (see “Nobles &amp; Their Abilities”).</li>" +
          (c.mod("heirs") ? "<li><b>Exchanging Heirs:</b> give every Noble an <b>heir</b> — a scrap of paper or a token. All Nobles start the game with heirs.</li>" : "") + "</ul>",
        src: (c) => WK.cite("Rules p.3, p.5–6", WK.fg(c) ? "C&G p.1, p.3" : "", c.mod("heirs") ? "Rules p.19–20" : "") },
      { when: () => true, exp: (c) => (WK.fg(c) ? "fg" : "base"),
        t: (c) => (WK.fg(c) && c.p > 2 ? "Chairman, Head of the Church and Scholar" : "Chairman of the Assembly and Head of the Church"),
        d: (c) => "<ul><li>Use the <b>Fate deck</b> (its random-Baron result) to choose the <b>Chairman of the Assembly</b>, and give him the Chairman token.</li>" +
          "<li>Randomly choose a <b>different</b> Baron to be <b>Head of the Church</b> and give him the Head of the Church token." + (c.p === 2 ? " With two Barons, each of you holds one of the two tokens." : "") + "</li>" +
          (WK.fg(c) ? (c.p === 2
            ? "<li><b>For Glory, two players:</b> skip the Scholar — nobody starts with the Scholar token.</li>"
            : "<li><b>For Glory:</b> randomly choose a Baron to start with the <b>Scholar token</b>. The Scholar may not be the Baron who is Chairman or Head of the Church.</li>") : "") +
          "<li>The Chairman orders the Agendas and breaks voting ties at the Assembly; the Head of the Church decides who draws harmful or beneficial Events.</li></ul>",
        src: (c) => WK.cite("Rules p.5–6", WK.fg(c) ? "C&G p.1" : "") },
      { when: () => true, exp: "base",
        t: "Starting crowns",
        d: "<ul><li>Each Baron receives <b>15 crowns</b> from the treasury.</li></ul>",
        src: "Rules p.5–6" },
      { when: () => true, exp: (c) => (WK.fg(c) ? "fg" : "base"),
        t: "Starting troops — 400 per Baron",
        d: (c) => "<ul><li>Each Baron takes his <b>4 Regular Troop cards</b>: three <b>50</b>-strength and one <b>100</b>-strength.</li>" +
          "<li>Take one <b>100-strength Mercenary</b> card per Baron from the Mercenary deck, shuffle them and deal 1 to each Baron. Then do the same with one <b>50-strength Mercenary</b> card per Baron.</li>" +
          (WK.fg(c) ? "<li><b>For Glory:</b> the new <b>Leaders and Heralds</b> may not be given out as these 50-strength Mercenaries.</li>" : "") +
          "<li>Assign all <b>400 troops</b> by sliding the Troop cards under your <b>Noble cards</b> and/or your <b>Stronghold card</b>:<ul>" +
          "<li>every troop must be assigned;</li><li>you don't have to give troops to every Noble, or any to your stronghold;</li>" +
          "<li>only Nobles who have troops can be placed on the board.</li></ul></li></ul>",
        src: (c) => WK.cite("Rules p.5–6", WK.fg(c) ? "C&G p.2" : "") },
      { when: () => true, exp: "faq",
        t: "The Mercenary deck and the first offer",
        d: (c) => "<ul><li>Shuffle the Mercenary deck and place it off the board, near the <b>Mercenary Track</b>.</li>" +
          "<li>Reveal <b>" + (c.p + 1) + " Mercenary cards</b> — one more than the number of Barons — and place them faceup beside the track. They are hired in the first Mercenary Draft.</li>" +
          "<li class='note'>The setup diagram (Rules p.6) says “equal to the number of players”; the FAQ errata corrects it to one more than the number of players, matching setup step 9. (The FAQ calls it “the setup diagram on page 9”; the diagram is on p.6.)</li></ul>",
        src: "Rules p.5–6 · FAQ p.1" },
      { when: () => true, exp: "base",
        t: "The first three Agendas",
        d: "<ul><li>Place the shuffled <b>Agenda deck</b> near the top of the board and reveal its <b>top 3 cards</b> faceup into the <b>Current Agendas</b> space (upper left of the board). They are voted on at the first Assembly.</li></ul>",
        src: "Rules p.3, p.5–6" }
    ]
  },
  {
    title: "Strongholds & Nobles",
    steps: [
      { when: (c) => WK.mis(c), exp: "mis",
        t: "Missions — deal the secret Missions",
        d: "<ul><li>Immediately before strongholds are placed, shuffle the <b>Mission deck</b> and deal <b>1 Mission card</b> to each Baron. Return the rest to the game box without revealing them.</li>" +
           "<li>Look at your own Mission but never show it. If you reveal its criteria to another player during the game, you lose the ability to fulfill it.</li></ul>",
        src: "C&G p.4" },
      { when: () => true, exp: "base",
        t: "Place the strongholds",
        d: (c) => "<ul><li>Starting with the <b>Chairman of the Assembly</b> and going <b>clockwise</b>, each Baron places his <b>stronghold marker</b> on the board.</li>" +
          "<li>Any <b>Kingdom area</b> (not overseas) that doesn't contain an <b>unrazed city</b> (a plastic city piece) or another Baron's stronghold. An area with a razed city is allowed.</li>" +
          (c.p <= 3 ? "<li><b>" + (c.p === 2 ? "Two" : "Three") + " Barons:</b> strongholds may not be placed in any area on the <b>outer row or column</b> of the main Kingdom map.</li>" : "") + "</ul>",
        src: (c) => WK.cite("Rules p.5", c.p <= 3 ? "Rules p.19" : "", "FAQ p.3") },
      { when: () => true, exp: "base",
        t: "Place the Nobles",
        d: "<ul><li>Starting with the <b>last Baron to place his stronghold</b> and going <b>counterclockwise</b>, Barons take turns placing <b>one Noble who has troops</b> on any Kingdom area.</li>" +
           "<li>Not in an overseas area, and not in an area with another Baron's Noble or stronghold. You may place Nobles in the area of your own stronghold or with your other Nobles.</li>" +
           "<li>Continue until every Noble with troops is on the board. Nobles without troops stay off the board.</li></ul>",
        src: "Rules p.5" },
      { when: () => true, exp: "base",
        t: "Reshuffle the Fate deck and begin",
        d: (c) => {
          const used = ["the Chairman", "the Head of the Church"];
          if (WK.fg(c) && c.p > 2) used.push("the starting Scholar");
          if (c.p < 6 && !WK.fg(c)) used.push("the razed cities");
          return "<ul><li>Reshuffle the Fate deck once more before the game begins (it was used to choose " + used.slice(0, -1).join(", ") + " and " + used[used.length - 1] + ").</li>" +
            "<li>The game is ready when all Nobles with troops are on the board. Round 1 begins with the <b>Planning phase</b>.</li></ul>";
        },
        src: (c) => WK.cite("Rules p.5–7", WK.fg(c) && c.p > 2 ? "C&G p.1" : "") }
    ]
  }
];

/* =============================================================================
   RULES REFERENCE
   ============================================================================= */
WK.reference = [
  {
    title: "Winning the Game",
    when: () => true,
    open: true,
    html: (c) => {
      const U = WK.unrazed(c.p), need = WK.majority(c.p);
      let h = "<h4>How the game ends</h4><ul>";
      if (c.p === 2) h += "<li><b>Seize the Kingdom (two Barons — FAQ rule change):</b> a Baron does <b>not</b> win by controlling more than half the unrazed Kingdom cities. Instead, a Baron who controls <b>5 cities</b> at the start of the Upkeep phase wins immediately. (The FAQ says “5 cities”; the normal test counts only Kingdom cities.)</li>";
      else h += "<li><b>Seize the Kingdom:</b> at the start of every Upkeep phase, a Baron who controls <b>more than half of the unrazed Kingdom cities</b> (overseas cities don't count) wins immediately. At the start of a " + WK.word(c.p) + "-Baron game that is <b>" + need + " of " + U + "</b> cities — razing during play lowers the count.</li>";
      if (c.mod("might")) h += "<li><b>Might Is Right:</b> that is the only victory condition. Influence has no effect on who wins, and the game does not end when the Influence pool runs out — expect a much longer game.</li>";
      else if (WK.king(c)) h += "<li><b>The King:</b> when the Influence pool runs out, the Baron with the most Influence (ties broken as below) becomes <b>King</b> and takes the King token — but the game goes on. When a Baron has at least <b>" + WK.target(c) + " Influence</b> at the end of a game round, the game ends and the Baron with the most Influence wins. You don't need to be King to win.</li>";
      else h += "<li><b>Influence:</b> when the last Influence token is taken from the pool during an Upkeep phase, this is the <b>last game round</b>. Finish that Upkeep — Barons still owed Influence take it from the extra tokens outside the pool, and revolts are resolved as normal — then the Baron with the <b>most Influence</b> is crowned and wins.</li>";
      if (WK.mis(c)) h += "<li><b>Missions:</b> at the end of the game, while tallying final Influence, everyone reveals his Mission; starting with the Chairman, each Baron who is fulfilling his Mission's criteria gains <b>2 Influence</b>." + (WK.king(c) ? " With The King, Missions are not scored when the pool runs out — only when the game ends." : "") + "</li>";
      h += "</ul>";
      if (!c.mod("might") || WK.king(c)) h += "<h4>Ties for the most Influence</h4><ol><li>Most cities controlled (Kingdom and overseas).</li><li>Highest total of crowns + Faith + Votes.</li><li>Most troops on the board.</li><li>Still tied: there is no King and no winner.</li></ol>";
      h += "<h4>Influence each Upkeep</h4><ul><li>Each Baron takes <b>1 Influence per city he controls</b> (Kingdom and overseas) from the pool; if the pool runs short, the rest comes from outside the pool.</li>" +
        "<li>No Influence at all while your stronghold is off the board, and none from a city under siege" + (WK.fg(c) ? " or a rioting city" : "") + ".</li>" +
        (WK.king(c) ? "<li><b>The King</b> gains <b>1 extra Influence</b> in every Upkeep after he is crowned.</li>" : "") + "</ul>";
      return h;
    },
    src: (c) => WK.cite("Rules p.2, p.8, p.18", c.p === 2 ? "FAQ p.1" : "", c.mod("might") ? "Rules p.20" : "", (WK.king(c) || WK.mis(c)) ? "C&G p.4" : "", WK.fg(c) ? "C&G p.3" : "")
  },
  {
    title: "The Game Round",
    when: () => true,
    html: (c) => "<h4>1 · Planning</h4><ul>" +
      "<li>Each Baron secretly chooses <b>6 of his Action cards</b> and places them facedown: <b>2</b> on each of the three Action card areas marked “1”, “2” and “3”. If you can't or won't place two in a stack, you may place fewer.</li>" +
      "<li>The Chairman shuffles the " + WK.neutralTotal(c) + " Neutral Action cards and deals <b>" + WK.neutralPer(c) + "</b> facedown onto each area" + (WK.fg(c) ? " (For Glory: three instead of two)" : "") + "; the rest wait facedown until next round.</li>" +
      "<li>The Chairman then shuffles each of the three stacks separately. With " + WK.word(c.p) + " Barons placing two each, a stack holds up to <b>" + (2 * c.p + WK.neutralPer(c)) + " cards</b>.</li>" +
      "<li>After the first round you won't have all your Action cards: those sitting in the Special Phase areas come back only when their phase fires.</li></ul>" +
      "<h4>2 · Actions</h4><ul>" +
      "<li>The Chairman turns over the cards of stack “1” one at a time and reads each aloud; each card is <b>resolved</b>, then <b>allocated</b>. Then stack “2”, then stack “3”.</li>" +
      "<li>You know your stack-1 cards happen before your stack-2 cards, but not when they fall among the other Barons' cards.</li>" +
      "<li>You may decline a Baron Action; the card is still allocated as normal.</li>" +
      "<li>If a card triggers a special phase, the <b>whole special phase</b> is carried out before the next card is revealed.</li></ul>" +
      "<h4>3 · Upkeep</h4><ol>" +
      "<li><b>Check for victory</b> (see “Winning the Game”).</li>" +
      "<li><b>Gain Influence</b>: 1 per city you control.</li>" +
      "<li><b>Revolts</b>: each city you control without one of your Nobles in its area may revolt" + (WK.fg(c) ? " or riot" : "") + ".</li>" +
      "<li><b>Sea movement arrivals</b>: Nobles on port icons move into the port's area.</li>" +
      "<li><b>Refresh Nobles</b>: flip exhausted Noble cards faceup" + (WK.fg(c) ? "; exhausted Advancement cards refresh too" : "") + ".</li>" +
      "<li><b>Return Nobles to the board</b> (and transfer troops between Nobles in the same area).</li></ol>",
    src: (c) => WK.cite("Rules p.7–8, p.20", WK.fg(c) ? "C&G p.2–3" : "")
  },
  {
    title: "Special Phases — Triggers & Where Each Card Goes",
    when: () => true,
    html: (c) => "<h4>Triggers with " + WK.word(c.p) + " Barons</h4><table class='tbl'><thead><tr><th>Special phase</th><th>Fires when…</th></tr></thead><tbody>" +
      "<tr><td>Taxation (yellow area)</td><td>the Taxation area holds <b>" + (2 * c.p) + "</b> cards (twice the number of Barons)</td></tr>" +
      "<tr><td>Wages (red area)</td><td>the Wages area holds <b>" + (2 * c.p) + "</b> cards</td></tr>" +
      "<tr><td>Assembly (blue area)</td><td>the Assembly area holds <b>" + (2 * c.p) + "</b> cards</td></tr>" +
      "<tr><td>Mercenary Draft</td><td><b>" + (c.p + 1) + "</b> Baron markers are on the Mercenary Track (one more than the number of Barons)" + (WK.fg(c) ? "; casualty tokens placed by Assemble Troops fill spots too" : "") + "</td></tr></tbody></table>" +
      "<p>When Taxation, Wages or the Assembly is over, <b>all the cards in that stack go back to their owners</b>.</p>" +
      "<h4>Allocating each card</h4><ul>" +
      "<li><b>Levy Taxes</b> → Taxation.</li>" +
      "<li><b>Draft Soldiers</b> → Wages. It is the only card that can start two special phases (a Mercenary Draft when resolved, Wages when allocated); if both would trigger, carry out <b>Wages first</b>.</li>" +
      "<li><b>Rally Support</b> → Assembly.</li>" +
      "<li><b>Serve the Church</b> → any one of the three areas, your choice.</li>" +
      "<li><b>Mobilize Forces</b> → Wages if you only moved; Assembly if you only battled; either if you did both. If you did neither, either area (FAQ).</li>" +
      "<li><b>Versatile Strategy</b> → back to your hand.</li>" +
      (WK.fg(c) ? "<li><b>Forced March</b> → Wages. <b>Enrich Mind</b> → Taxation or Assembly, your choice.</li>" : "") +
      "<li><b>Neutral Action cards</b> → back to the pile of unused Neutral Action cards" + (WK.fg(c) ? " — except <b>A Pressing Agenda</b>, which goes into the Assembly stack and may trigger an Assembly" : "") + ".</li></ul>",
    src: (c) => WK.cite("Rules p.7–9, p.11", "FAQ p.3", WK.fg(c) ? "C&G p.3" : "")
  },
  {
    title: "Baron Action Cards",
    when: () => true,
    html: (c) => "<ul>" +
      "<li><b>Levy Taxes</b> — gain <b>1 crown for each area</b> (Kingdom or overseas) holding at least one of your Nobles; one crown per area however many Nobles are there. Nobles on a port icon don't count. These are separate from Taxation income.</li>" +
      "<li><b>Draft Soldiers</b> — place one of your Baron markers <b>free</b> on any available spot of the Mercenary Track (never a spot numbered higher than the number of Barons). It may trigger a Mercenary Draft.</li>" +
      "<li><b>Rally Support</b> — gain <b>2 Votes</b>. If you now have more Votes than every other Baron, you become <b>Chairman of the Assembly</b> and take the Chairman token.</li>" +
      "<li><b>Serve the Church</b> — gain <b>1 Faith</b>. If you now have more Faith than every other Baron, you become <b>Head of the Church</b>. Then choose which area the card goes to.</li>" +
      "<li><b>Mobilize Forces</b> — choose one area; move one or more unexhausted Nobles into it, start a battle there, or both. It can move a Noble into an area with another of your unexhausted Nobles and send both into the battle. Every Noble that moves or attacks is then exhausted.</li>" +
      "<li><b>Versatile Strategy</b> (the name printed on the card, pictured on Rules p.15; Rules p.9 and the FAQ also call it “Versatile Action”) — choose one: gain <b>2 crowns</b>; gain <b>1 Vote</b>; <b>move</b> one unexhausted Noble, then exhaust him; <b>start a battle</b> (to move <i>and</i> attack you need Mobilize Forces), then exhaust the Nobles involved; or place a Baron marker on an available spot of the Mercenary Track and <b>pay its fee</b>. The card returns to your hand.</li>" +
      (WK.fg(c) ? "<li><b>Forced March</b> (For Glory) — refresh one of your exhausted Nobles free, then any others for <b>2 crowns each</b>.</li>" +
        "<li><b>Enrich Mind</b> (For Glory, two per Baron) — gain <b>1 Knowledge</b>; if you now have more Knowledge than every other Baron, take the <b>Scholar</b> token; then you may buy Advancement cards.</li>" : "") +
      "</ul><h4>Chairman and Head of the Church</h4><ul><li>These tokens change hands only through <b>Rally Support</b> and <b>Serve the Church</b> — “except for a few Agent and Event cards”, in the FAQ's words. If the Head of the Church loses Faith so that you now have the most, you do <b>not</b> take the token until you play Serve the Church.</li>" +
      "<li>The rulebook adds one more case: a Chairman who is <b>banned</b> from the Assembly loses the token to the Baron with the most Votes (see “The Assembly”)" + (c.mod("elim") ? "; with <b>Player Elimination</b>, an eliminated Baron's tokens pass on too" : "") + ".</li></ul>",
    src: (c) => WK.cite("Rules p.7–9, p.12, p.15", c.mod("elim") ? "Rules p.20" : "", "FAQ p.2", WK.fg(c) ? "C&G p.3" : "")
  },
  {
    title: "Neutral Action Cards",
    when: () => true,
    html: (c) => "<p>The Chairman reads each Neutral Action card aloud and it is resolved as below." + (WK.fg(c) ? " For Glory replaces three of the eight originals and adds four new cards." : "") + "</p><ul>" +
      "<li><b>Important Event</b> — the Head of the Church chooses who draws and resolves the top Event card (see “Events &amp; the Head of the Church”).</li>" +
      "<li><b>Fund Expeditions</b> — the Chairman may start an expedition; Barons may invest; expeditions advance and resolve (see “Expeditions”).</li>" +
      "<li><b>Upgrade Defenses</b> — each Baron in turn (Chairman first, clockwise) may <b>repair or fortify one city</b> he controls:<ul>" +
        "<li><b>Repair:</b> pay <b>2 crowns per breach token</b> removed; any number of breaches, all from one city. You may repair your stronghold instead of a city.</li>" +
        "<li><b>Fortify:</b> pay <b>4 crowns</b> to flip the city's control marker to its fortified side: <b>+1 crown</b> every Taxation and <b>+100 strength</b> when defending. Strongholds can't be fortified.</li>" +
        (WK.fg(c) ? "<li><b>For Glory:</b> each Baron may also hire <b>one Garrison</b> for one of his un-garrisoned cities for <b>1 crown</b>.</li>" : "") +
        "<li>A besieged city can't be repaired or fortified.</li></ul></li>" +
      "<li><b>Muster Troops</b>" + (WK.fg(c) ? " (For Glory's replacement is called “Muster Forces”)" : "") + " — each Baron in turn (Chairman first, clockwise) may remove any number of casualty tokens from <b>one</b> of his armies for <b>2 crowns per token</b>." +
        (WK.fg(c) ? " <b>For Glory:</b> Barons may also recruit any number of <b>Town Levies</b> for <b>2 crowns each</b> (see “For Glory — New Troops”)." : "") + "</li>" +
      "<li><b>Uncertain Times</b> — shuffle the Fate deck." + (WK.fg(c) ? " <b>For Glory:</b> the Scholar may also discard one of the available Advancement cards and replace it with the top card of the Advancement deck." : "") + "</li>" +
      (WK.fg(c) ? "<li><b>Research</b> (For Glory, 2 cards) — the Scholar may pay <b>2 crowns</b> to draw the top Advancement card, then either discard it or buy it at once for <b>1 less Knowledge</b> (minimum 0).</li>" +
        "<li><b>A Pressing Agenda</b> (For Glory) — draw the top Agenda card and place it faceup with the Current Agendas; it is voted on at the next Assembly with the others. This card then goes into the <b>Assembly stack</b> and may trigger an Assembly.</li>" +
        "<li><b>Assemble Troops</b> (For Glory) — draw the top Mercenary card and add it faceup to the Mercenaries available. Then place a <b>casualty token</b> on the first available spot of the Mercenary Track: that spot counts as full (it may trigger a Mercenary Draft) and no Baron marker may go there. At the start of the Draft, remove these tokens and skip those spaces.</li>" : "") +
      "</ul>",
    src: (c) => WK.cite("Rules p.9–11, p.17", WK.fg(c) ? "C&G p.1, p.3" : "")
  },
  {
    title: "Events & the Head of the Church",
    when: () => true,
    html: (c) => "<h4>Three kinds of Event (by the color of the back)</h4><ul>" +
      "<li><b>Red</b> — always harmful; affects the Baron who drew it.</li>" +
      "<li><b>Green</b> — always beneficial to the Baron who drew it.</li>" +
      "<li><b>Blue</b> — may target any Baron.</li></ul>" +
      "<h4>Important Event</h4><ul><li>The <b>Head of the Church</b> chooses a Baron to draw and resolve the top Event card:<ul>" +
      "<li>red on top: he draws it himself, or pays <b>1 Faith</b> to choose an opponent to draw it;</li>" +
      "<li>green on top: he chooses an opponent to draw it, or pays <b>1 Faith</b> to draw it himself;</li>" +
      "<li>blue on top: he simply chooses who draws it — it doesn't matter who (in the rulebook's example he draws it himself).</li></ul></li></ul>" +
      "<h4>Canceling an Event</h4><ul>" +
      "<li>Most red Events and some blue ones can be canceled with Faith: the cost is shown at the bottom of the card. A canceled Event is discarded without effect.</li>" +
      "<li><b>Red:</b> only the Baron who drew it may pay. <b>Blue:</b> any Baron may pay, and several Barons may combine to pay a cost above 1 Faith.</li>" +
      "<li>If an Event uses Fate cards to pick its random targets, you may wait until the targets are known before canceling.</li>" +
      "<li>Events must be canceled when they are played; a lasting Event (such as <i>Heretic</i>) that isn't canceled stays for the rest of the game (FAQ).</li>" +
      (c.mod("mirac") ? "<li><b>Miracles Can Happen:</b> you may cancel an Event after it happens by paying <b>1 Faith more</b> than its printed cost — but not once its effect is final (for example, <i>No Heir</i> or <i>Broken Line</i> after the Noble has died).</li>" : "") +
      "</ul>" + (WK.fg(c) ? "<p><b>For Glory</b> adds 20 new Event cards, and the Event on top of the deck at the start of the game is never red.</p>" : ""),
    src: (c) => WK.cite("Rules p.9", "FAQ p.1", c.mod("mirac") ? "FAQ p.3" : "", WK.fg(c) ? "C&G p.1–2" : "")
  },
  {
    title: "Expeditions",
    when: () => true,
    html: (c) => "<p>Three expedition tracks: <b>Ceylon</b> has the best chance of success but the lowest rewards, <b>China</b> the least chance and the highest payouts, and the <b>Spice Islands</b> are in between.</p>" +
      "<h4>When Fund Expeditions is revealed</h4><ol>" +
      "<li><b>Start:</b> the Chairman may start one expedition that isn't already underway (none if all three are underway).</li>" +
      "<li><b>Fund:</b> starting with the Chairman and going clockwise, each Baron may place <b>up to 5 crowns</b> below it with one of his Baron markers. Funding is optional, even for the Chairman.</li>" +
      "<li><b>Bless:</b> the Head of the Church may pay <b>1 Faith</b> to bless it (the Faith token stays on the track): when a blessed expedition is resolved, draw <b>one extra Fate card</b> and use the better result.</li>" +
      "<li><b>Mark:</b> the Chairman places an expedition marker on spot “1” — no marker if he didn't start one (the rulebook's example places it because at least one Baron funded).</li>" +
      "<li><b>Advance:</b> expeditions already on “1” or “2” — not one just started — move up one spot.</li>" +
      "<li><b>Resolve:</b> draw 1 Fate card (2 if blessed) for each expedition now on “3”.</li></ol>" +
      "<h4>Expedition results</h4><ul>" +
      "<li><b>" + (WK.fg(c) ? "1x–5x" : "1x, 2x, 3x, 4x") + ":</b> success. Each funder receives the crowns he invested <b>times</b> the number (1x just breaks even); the crowns on the track go to the treasury and the markers go back. Example: 5 crowns on China and a 4x result pays 20 crowns.</li>" +
      "<li><b>No News:</b> the expedition stays on “3” and draws again the next time Fund Expeditions is resolved; a blessing stays until it is resolved.</li>" +
      (WK.fg(c) ? "<li><b>Funds Needed</b> (For Glory): each funder either pays <b>2 crowns</b> to the treasury or loses his investment (his crowns on the expedition go to the treasury). The card is then treated as a “No Result” card (the sheet's wording; No News is the base game's no-result outcome).</li>" : "") +
      "<li><b>Fleet Lost:</b> all crowns invested go to the treasury; the marker is removed and the expedition may be started again later.</li></ul>" +
      (WK.fg(c) ? "<p><b>For Glory</b> order of results, best to worst (for picking the better of a blessed draw): highest payout (5x, 4x, 3x, 2x, 1x), No News, Funds Needed, Fleet Lost.</p>" : ""),
    src: (c) => WK.cite("Rules p.9–10", WK.fg(c) ? "C&G p.4" : "")
  },
  {
    title: "Taxation & Wages",
    when: () => true,
    html: (c) => "<h4>Taxation (" + (2 * c.p) + " cards in the Taxation area)</h4><ul>" +
      "<li>Every Baron receives the income of every <b>city</b> and <b>Concession</b> he controls. A city's income is the number beside the gold coin under its name; <b>fortified</b> cities pay <b>1 extra crown</b>.</li>" +
      "<li>Besieged cities pay nothing" + (WK.fg(c) ? "; nor do rioting cities" : "") + ".</li>" +
      "<li>Then return all the cards in the Taxation stack to their owners.</li></ul>" +
      "<h4>Wages (" + (2 * c.p) + " cards in the Wages area)</h4><ul>" +
      "<li>Each Baron in turn, Chairman first and then clockwise, pays each troop's wage (the gold coin on its Troop card) to the treasury.</li>" +
      "<li><b>Regular Troops first</b> — all of them, even those with an off-board Noble or in an army with casualty tokens. Pay as many as you can; unpaid Regular Troops don't desert." + (WK.king(c) ? " <b>King's Army</b> cards are Regular Troops: paid before any Mercenary, and they never desert." : "") + "</li>" +
      "<li>Then choose which <b>Mercenaries</b> to pay. Any Mercenary not paid in full <b>deserts</b> and is shuffled back into the Mercenary deck.</li>" +
      "<li><b>Circle Nobles</b> pay no wages for the troops assigned to them while those troops number <b>400 or less</b>; at 450 or more, all must be paid. Their +200 doesn't count toward the 450; <b>maintained troops</b> do (FAQ). This ability works even when the Noble is exhausted.</li>" +
      "<li><b>Maintained troops</b> (from offices) add strength but never need wages.</li>" +
      "<li>Casualty tokens don't reduce wages: you pay for every troop (FAQ).</li>" +
      "<li>If a desertion leaves an army with casualties equal to or greater than its troops, its Noble dies (FAQ)" + (c.mod("aband") ? " — with <b>Abandoned Nobles</b>, he is abandoned instead of dead" : "") + ".</li>" +
      (WK.fg(c) ? "<li><b>Garrisons</b> (For Glory) must be paid every Wages phase; for each one not paid, discard a Garrison card and one of your Garrison tokens.</li>" +
        "<li><b>Town Levies</b> (For Glory) are never paid — but if any Mercenary assigned to a Noble deserts during Wages, <b>all</b> Town Levies with that Noble are discarded.</li>" : "") +
      "<li>Then return all the cards in the Wages stack to their owners.</li></ul>",
    src: (c) => WK.cite("Rules p.11, p.17, p.19", "FAQ p.1–2", c.mod("aband") ? "FAQ p.3" : "", WK.fg(c) ? "C&G p.2–3" : "", WK.king(c) ? "C&G p.4" : "")
  },
  {
    title: "The Assembly",
    when: () => true,
    html: (c) => "<p>Triggered when the Assembly area holds <b>" + (2 * c.p) + " cards</b>. Every Baron who isn't banned from the Assembly, or kept away by a charge, must attend.</p><ol>" +
      "<li><b>Receive Votes:</b> each attending Baron receives <b>1 Vote + 1 per Kingdom city</b> he controls. Votes are open information until voting starts.</li>" +
      "<li><b>Appoint Acting Chairman</b> (usually not necessary): if the Chairman isn't attending, he appoints an acting Chairman for this Assembly.</li>" +
      "<li><b>Vote on Private Motions:</b> any Private Motion among the Current Agendas is voted on before the other Agendas.</li>" +
      "<li><b>Declare Agenda Order:</b> the Chairman decides the order of the remaining Agendas and reads them all aloud in that order.</li>" +
      (c.p === 2
        ? "<li><b>Vote on Agendas — two Barons:</b> voting works differently. After the Chairman declares the order, each Baron secretly writes down how many Votes he casts on <b>each</b> of the three Agendas (in total, no more than the Votes he has). Reveal all votes at once, then resolve each Agenda in order.</li>"
        : "<li><b>Vote on Agendas</b>, one at a time:<ol type='a'><li>each Baron secretly holds some Votes in a closed fist (the rest hidden in his other hand);</li><li>all reveal at once;</li><li>starting with the Chairman and going clockwise, each declares how his Votes are cast — yes/no, or for a Baron. All revealed Votes count and are discarded. The Chairman breaks ties any way he likes, however he voted;</li><li>the winning result takes effect immediately.</li></ol></li>") +
      "<li><b>Reveal next Assembly's Agendas:</b> place three new Agendas in the Current Agendas space.</li></ol>" +
      "<p>Finally, return all the cards in the Assembly stack to their owners; Barons keep any Votes they didn't use." + (WK.fg(c) ? " (For Glory's <b>A Pressing Agenda</b> adds an extra Agenda to the next Assembly.)" : "") + "</p>" +
      "<h4>Agendas</h4><ul>" +
      "<li>Each Agenda shows (lower right) whether it takes a <b>yes/no</b> vote or a <b>Choose a Baron</b> vote. A passed yes/no Agenda takes effect at once; a failed one is discarded. A Choose-a-Baron Agenda goes to the chosen Baron.</li>" +
      "<li><b>Motions:</b> carried out immediately, then discarded.</li>" +
      "<li><b>Laws:</b> placed faceup as a lasting effect.</li>" +
      "<li><b>Charges:</b> assigned to a Baron; <b>maximum three</b>. On receiving a fourth, discard one of the original three (not the new one).</li>" +
      "<li><b>Concessions:</b> charges that pay you crowns at every Taxation phase.</li>" +
      "<li><b>Offices:</b> assigned by a Baron to one of his Nobles; one office per Noble (a new one replaces the old); discarded if the Noble dies. Many give <b>maintained troops</b>, which add strength but need no wages.</li>" +
      "<li>A Baron needn't attend to receive a charge or office; a banned Baron may refuse it without further penalty.</li></ul>" +
      "<h4>Private Motions</h4><ul>" +
      "<li>A Fate card chooses which Baron proposes it (he needn't be attending). It is voted on before the Chairman orders the other Agendas.</li>" +
      "<li>It may be: rescind a Baron's ban · discard one law, charge or office in effect · postpone the Assembly (it ends at once and the current Agendas carry over) · vote on any Agenda in the discard pile.</li>" +
      (c.mod("openpm") ? "<li><b>Open Private Motions:</b> a Private Motion may propose anything — for example prohibiting sieges, or all road movement — but it must still be voted on like any other Agenda.</li>" : "") + "</ul>" +
      "<h4>Refusing a decision — and being banned</h4><ul>" +
      "<li>Refuse a <b>charge, motion or office</b> as soon as it passes (discard the Agenda if it targets you): you storm out, are <b>banned from the Assembly</b> immediately, and can't vote on further Agendas.</li>" +
      "<li>Refuse a <b>law</b> when you are required to comply with it (for example, a tax refused at the Taxation phase) — and be banned.</li>" +
      "<li>You can't refuse a decision that <i>withdraws</i> an office or charge from you.</li>" +
      "<li>A ban lasts the whole game unless an Assembly rescinds it; a reinstated Baron attends future Assemblies, not the current one.</li>" +
      "<li>If the Chairman is banned, the Baron with the most Votes becomes Chairman (ties broken randomly). Banned Barons can never become Chairman.</li></ul>",
    src: (c) => WK.cite("Rules p.11–12", (c.p === 2 || c.mod("openpm")) ? "Rules p.19" : "", WK.fg(c) ? "C&G p.3" : "")
  },
  {
    title: "The Mercenary Draft",
    when: () => true,
    html: (c) => {
      const spots = ["two unnumbered spots"].concat([2, 3, 4, 5, 6].filter((n) => n <= c.p).map((n) => "“" + n + "”")).join(", ");
      return "<p>Triggered when <b>" + (c.p + 1) + " Baron markers</b> are on the Mercenary Track. With " + WK.word(c.p) + " Barons the available spots are: " + spots + " — never a spot numbered higher than the number of Barons.</p>" +
        "<table class='tbl'><thead><tr><th>Track spot (left → right)</th><th>1st</th><th>2nd</th><th>“2”</th><th>“3”</th><th>“4”</th><th>“5”</th><th>“6”</th></tr></thead>" +
        "<tbody><tr><td>Fee with Versatile Strategy</td><td>8</td><td>7</td><td>6</td><td>5</td><td>4</td><td>3</td><td>2</td></tr></tbody></table>" +
        "<p class='note'>Fees as printed on the track (shown on Rules p.12); the text confirms the “3” spot costs 5 crowns. Draft Soldiers places a marker free.</p>" +
        "<h4>Hiring</h4><ul>" +
        "<li>Starting with the <b>left-most</b> marker, that marker's Baron may hire one of the Mercenaries beside the track, paying a <b>hiring fee equal to its wage</b>. If he can't pay, he can't hire it but still removes his marker. He may choose not to hire; then the next marker's Baron chooses.</li>" +
        "<li>Two or more markers on the track mean two or more chances to hire.</li>" +
        "<li><b>Same nationality:</b> if several Mercenaries of one nationality are available and you have that many markers on the track (anywhere), announce it when your first marker comes up, remove that many markers, pay each fee and hire them all at once.</li>" +
        "<li>Assign each hire immediately to: a Noble at one of your cities or your stronghold · a Noble currently off the board · or your stronghold. (Nobles in a besieged city can't receive troops during the Draft.)</li>" +
        "<li>When every spot has drafted: shuffle unhired Mercenaries back into the deck, clear the track, and reveal <b>" + (c.p + 1) + "</b> new Mercenaries for the next Draft.</li></ul>" +
        "<h4>Mercenaries</h4><ul><li>Mercenary Troop cards show their <b>nationality</b> at the bottom left. They may <b>desert</b> when their Noble dies or retreats (a Fate card names a nationality), or when their wages go unpaid.</li>" +
        (WK.fg(c) ? "<li><b>For Glory — Leaders and Heralds:</b> one of each for every nationality. Each grants the Noble it's assigned to a special ability, treated as printed on his Noble card and usable in addition to his others, <b>even when exhausted</b>. A Noble may have only one Leader and one Herald at a time.</li>" +
          "<li><b>For Glory — Assemble Troops:</b> its casualty tokens fill track spots; at the start of the Draft remove them and skip those spaces, so Drafts come more often with more Mercenaries on offer.</li>" : "") + "</ul>";
    },
    src: (c) => WK.cite("Rules p.4, p.8–9, p.12–13, p.17", WK.fg(c) ? "C&G p.2–3" : "")
  },
  {
    title: "Movement",
    when: () => true,
    html: (c) => "<ul>" +
      "<li>Nobles move with <b>Mobilize Forces</b> (any number into one area) or <b>Versatile Strategy</b> (one Noble).</li>" +
      "<li>A Noble normally moves <b>one area</b>. A Noble on a <b>road</b> may move up to <b>three areas</b>, but must follow the road for the whole move and can't leave it once he starts along it.</li>" +
      "<li><b>Mountain</b> borders are impassable. <b>River</b> borders can only be crossed at one of the <b>four bridges</b>.</li>" +
      "<li>You can't move through an area containing another Baron's Noble or city unless that Baron allows it. An area holding only another Baron's stronghold (no Nobles) needs no permission (FAQ).</li>" +
      "<li>After moving and/or attacking, a Noble is <b>exhausted</b> (flip his card). Exhausted Nobles can't move or attack, but defend if attacked. Every Noble that moves or attacks is exhausted, not only the commander (FAQ).</li></ul>" +
      "<h4>Sea movement</h4><ul>" +
      "<li>A Noble who <b>starts</b> his move in an area with a <b>port</b> may move to any other port: place him on the destination's port icon and exhaust him.</li>" +
      "<li>In the Upkeep phase he moves into that area and refreshes; next round he acts normally.</li>" +
      "<li>Sea movement can't be combined with road movement. A Noble on a port icon can't attack or be attacked, and doesn't count for Levy Taxes.</li>" +
      "<li>Ports in areas with razed cities work, and you don't need to own the city to use its port (FAQ).</li></ul>" +
      "<h4>Receiving troops while moving</h4><ul>" +
      "<li>At any point in his move, a Noble may take any number of troops from your stronghold (if he's in its area) or from an <b>unexhausted</b> Noble of yours in the same area. A Noble on a road may continue after.</li>" +
      "<li>An army with casualty tokens may receive troops. To take troops <i>out</i> of such an army you must take all its troops and casualty tokens — its Noble, left without troops, leaves the board — or none.</li></ul>" +
      (WK.fg(c) ? "<p><b>For Glory:</b> <b>Forced March</b> refreshes exhausted Nobles, and some Advancement cards let a Noble move an extra space or make sea travel faster.</p>" : ""),
    src: (c) => WK.cite("Rules p.8, p.13–14, p.18", "FAQ p.2–3", WK.fg(c) ? "C&G p.2–3" : "")
  },
  {
    title: "Nobles & Their Abilities",
    when: () => true,
    html: (c) => "<p>Each Baron has four Nobles; the shape on a Noble's base matches the icon on his Noble card and names his ability:</p>" +
      "<table class='tbl'><thead><tr><th>Shape</th><th>Ability</th></tr></thead><tbody>" +
      "<tr><td>★ Star</td><td>“May inflict 100 extra casualties in battle” — counts as an extra <i>Deal 100 Casualties</i> card.</td></tr>" +
      "<tr><td>■ Square</td><td>“May prevent 100 casualties in battle” — counts as an extra <i>Prevent 100 Casualties</i> card.</td></tr>" +
      "<tr><td>▲ Triangle</td><td>“+1 Victory in battle” — one extra victory when victories are counted.</td></tr>" +
      "<tr><td>● Circle</td><td>“Does not pay wages for troops if army size is under 450” — works even while exhausted.</td></tr></tbody></table><ul>" +
      "<li>Only the <b>commanding Noble's</b> ability and +200 count in a battle. An exhausted commander still adds his +200 but can't use his ability.</li>" +
      "<li>The <b>+200</b> is leadership, not troops: it matters only when drawing Fate cards and in the siege strength comparison, and never counts as troops (so a Noble with 100 + 200 troops dies when his third casualty token arrives) (FAQ).</li>" +
      "<li>An <b>army</b> is a Noble with the Troop cards under his card; troops at a stronghold with no Noble are also an army.</li>" +
      (WK.fg(c) ? "<li><b>For Glory:</b> a Leader or Herald Mercenary grants its Noble an extra ability, usable even when he is exhausted (max one Leader and one Herald per Noble).</li>" : "") + "</ul>",
    src: (c) => WK.cite("Rules p.2–3, p.11, p.14–15, p.19", "FAQ p.1", WK.fg(c) ? "C&G p.2" : "")
  },
  {
    title: "Battles — Starting a Battle",
    when: () => true,
    html: (c) => "<ul>" +
      "<li>Start a battle with <b>Mobilize Forces</b> or <b>Versatile Strategy</b>. You need a Noble in an area with an opposing Noble, city or stronghold. You are the <b>attacker</b>; the <b>defender</b> may be a neutral city.</li>" +
      "<li>Only one or two Barons are ever involved in a battle (one, when the defender is a neutral city): if several opponents have armies in the area, name the one you attack.</li>" +
      "<li><b>All</b> the defender's troops in the area fight. The attacker chooses which of his armies led by <b>unexhausted</b> Nobles fight; his exhausted Nobles' armies, and any he holds back, have no effect.</li>" +
      "<li>A defending Noble in an area with a city his Baron controls is <b>in the city</b>: he can only be attacked by assault or siege, not in an open-field battle (FAQ). An attacking Noble is never in a city.</li>" +
      "<li><b>Three kinds of battle:</b> open-field battles, assaults and sieges. Assaults and sieges happen only in an area with a city the attacker doesn't control; in an area with the attacker's own city the battle is open-field.</li></ul>" +
      "<h4>You may attack a city only if…</h4><ol>" +
      "<li>it's neutral and you are the only Baron with armies in the area;</li>" +
      "<li>it's neutral and the other Barons with armies there give permission;</li>" +
      "<li>it belongs to another Baron and he is the only other Baron with armies there;</li>" +
      "<li>it belongs to another Baron and the other Barons with armies there (not counting the owner) give permission.</li></ol>" +
      "<ul><li>Finishing a siege is a battle too: ask permission again if other Barons' Nobles are present (FAQ).</li>" +
      "<li>There's no voluntary retreat: a would-be defender must bargain his way out before the attack is declared" + (WK.fg(c) ? " (For Glory's Retreat/Draw 1 Fate result is the exception)" : "") + ".</li></ul>",
    src: (c) => WK.cite("Rules p.14, p.16–17", "FAQ p.1, p.3", WK.fg(c) ? "C&G p.3" : "")
  },
  {
    title: "Battles — Open-Field Procedure",
    when: () => true,
    html: (c) => "<h4>Prepare for battle</h4><ol>" +
      "<li><b>Declare commanders</b> (attacker first): with more than one Noble in the battle, each side names one commander. Only his ability and +200 count; he commands all your troops fighting, whichever Noble they're assigned to. A lone Noble commands by default.</li>" +
      "<li><b>Draw Fate cards:</b> 1 per <b>100</b> troop strength fighting (rounded down: the rulebook's example draws 2 for 250 troops), plus <b>2</b> for the commander's +200; each casualty token on your armies is −100. <b>Maximum " + WK.fateMax(c) + " cards</b> in this step" + (WK.fg(c) ? " — For Glory's larger Fate deck raises the FAQ errata's limit of 10 to 20" : " (FAQ errata)") + "; cards from “Draw 1 Fate” later don't count.</li>" +
      (WK.fg(c) ? "<li class='fg-li'><b>For Glory — Advancements:</b> declare any Advancement you'll use right after drawing, before discarding or revealing (attacker first). One Advancement per Baron per battle, used in addition to Fate cards and Noble abilities.</li>" : "") +
      "<li><b>Discard Fate cards:</b> each side with a commanding Noble discards <b>2</b> (facedown to the bottom of the deck); if that would leave you with none because you drew only two, keep one. You may discard more than two.</li>" +
      "<li><b>Reveal</b> simultaneously.</li></ol>" +
      "<h4>Resolve the battle</h4><ol>" +
      "<li><b>Draw additional Fate:</b> each “Draw 1 Fate” card draws another card, and so on while they keep coming." + (WK.fg(c) ? " (For Glory: resolve Retreat/Draw 1 Fate results first — see “For Glory — New Fate Deck”.)" : "") + "</li>" +
      "<li><b>Tally casualties</b> simultaneously: your <i>Deal 100 Casualties</i> cards minus his <i>Prevent 100 Casualties</i> cards is what he takes, and vice versa. A star commander may add a Deal, a square commander a Prevent.</li>" +
      "<li><b>Assign casualties:</b> one casualty token per 100, placed one by one on your armies in the battle — you may split them (FAQ). An army can take no more tokens than it has troops; when its tokens equal or exceed its troops, its Noble <b>dies</b>. Once all your Nobles in the battle are dead, assign no more. The defender may watch the attacker assign first. If either side now has no living Nobles in the battle, skip step 4.</li>" +
      "<li><b>Count victories:</b> each side's <i>+1 Victory</i> cards, plus one for a triangle commander:<ul>" +
        "<li><b>Full victory</b> — two or more ahead: the opposing Nobles with troops fighting are <b>killed</b>;</li>" +
        "<li><b>Partial victory</b> — one ahead: the opposing Nobles with troops fighting <b>retreat</b>;</li>" +
        "<li><b>Stalemate</b> — equal: nothing happens.</li></ul></li>" +
      "<li><b>Resolve Noble deaths.</b> Casualty tokens stay on surviving armies until removed by Muster Troops.</li></ol>" +
      "<p>The battle is over, even if both sides still have armies in the area. (The Quick Reference also skips Count Victories when the defender has 0 strength.)</p>",
    src: (c) => WK.cite("Rules p.14–16, p.20", "FAQ p.1–2", WK.fg(c) ? "C&G p.2–3" : "")
  },
  {
    title: "Assaulting a City (and Breaches)",
    when: () => true,
    html: (c) => "<p>Choose <b>assault</b> or <b>siege</b> when you attack a city. Assaulting is the quickest way to capture it, but the most dangerous, and it damages the city's defenses.</p><ul>" +
      "<li>Use the open-field procedure, but the defender adds the <b>city's strength</b> (the left-hand number under its name; income is on the right): 1 Fate card per 100 of troops <i>and</i> city. Fortified cities add 100" + (WK.fg(c) ? "; a Garrison adds 100 (a city holds at most one)" : "") + ". Example: 200 troops in Vecht (strength 300) draw 5 + 2 = 7 cards; 8 if Vecht is fortified.</li>" +
      "<li>A <b>neutral city</b> is played by another Baron (not the attacker), drawing for its strength; it has no commander, so it doesn't discard two cards.</li></ul>" +
      "<h4>Breaches</h4><ul>" +
      "<li>The defender may take casualties as <b>breaches</b> on the city instead of casualty tokens on his armies: each breach = 100 casualties and lowers the city's strength by 100. A city can take breaches up to its current strength; with more than 100 casualties he may split them between breaches and troops.</li>" +
      "<li>At 0 strength a city takes no more breaches; further casualties go on the defender's armies.</li>" +
      "<li>Breaches stay after the battle (and when the city changes hands) until repaired with Upgrade Defenses.</li></ul>" +
      "<h4>Capturing the city</h4><ul>" +
      "<li>Kill all opposing Nobles <b>and</b> reduce the city to 0 strength — or win a full or partial victory (partial: defending Nobles retreat), which can take a city with its defenses intact.</li>" +
      "<li>Place your control marker under the city (fortified side up if it was fortified).</li>" +
      "<li>FAQ: if your attacking Noble dies while reducing the city to 0, you don't capture it. Assaulting a 0-strength city wins automatically. A neutral city that scores two or more victories more than the attacker kills the attacking Noble, just as in Noble-versus-Noble combat.</li></ul>" +
      "<h4>Razing instead</h4><ul><li>Immediately after gaining control of a city you may <b>raze</b> it: remove the plastic city (and your control marker) and take <b>3 × its income</b> in crowns. Razed cities can never be controlled.</li></ul>",
    src: (c) => WK.cite("Rules p.16–18", "FAQ p.1–2", WK.fg(c) ? "C&G p.2–3" : "")
  },
  {
    title: "Sieges",
    when: () => true,
    html: () => "<ul>" +
      "<li>You may siege only if your <b>total strength is greater</b> than the defender's. The defender counts the city's strength; both sides add +200 for their would-be commanders; special abilities don't count; casualties and breaches <b>do</b> count (FAQ). A neutral city has no commander.</li>" +
      "<li>Declare the siege and place a <b>siege marker</b> on the city. No Fate cards are drawn: the attacker takes no casualties and the city's defenses stay intact. (Example: 50 troops + 200 = 250 against a 200-strength neutral city is a legal siege.)</li>" +
      "<li><b>While besieged:</b> Nobles in the city can't move out, transfer troops, or receive troops during the Upkeep or the Mercenary Draft; the city gives no Influence and no Taxation income; it can't be fortified or repaired.</li>" +
      "<li>The besieged Baron may still move Nobles <i>into</i> the city to reinforce it (they can't leave until the siege is lifted) (FAQ). Nobles inside may attack the besiegers — an open-field battle, without the city's strength.</li>" +
      "<li><b>The siege is lifted</b> if the besiegers' leading Nobles are killed or forced to retreat, or if all the attacker's armies leave the area for any reason. Remove the marker. Another of your Nobles may join the siege, or take it over, as long as the area is never left without your Nobles (FAQ).</li>" +
      "<li><b>The city falls</b> if, in a <b>later game round</b>, the same Baron sieges it again with the siege never lifted in between: he gains control and any defending Nobles in the city die. He must meet the strength test again when he announces the second siege; losing strength in between doesn't lift the siege. It can be any later round, not just the next (FAQ).</li></ul>",
    src: () => "Rules p.16–17 · FAQ p.2–3"
  },
  {
    title: "Strongholds",
    when: () => true,
    html: (c) => "<ul>" +
      "<li>A stronghold is attacked exactly like a city — assault or siege. Its strength is on its Stronghold card.</li>" +
      "<li>Troops in a stronghold with no Noble: no commander, so no discard of two Fate cards. The battle ends at once if the stronghold is reduced to 0 and those troops take casualties equal to or greater than their number; they are removed with the stronghold.</li>" +
      "<li><b>Eliminating a stronghold:</b> the winner takes <b>half the loser's crowns</b> (rounded down) and <b>one of the loser's cities</b>, of the loser's choice. The stronghold is removed; its Baron gains <b>no Influence</b> in this round's Upkeep, and may put it back during the Upkeep (just before placing Nobles) in any Kingdom area without an unrazed city or an opponent's Noble or stronghold.</li>" +
      "<li>FAQ: troops assigned to a captured stronghold are removed with it; draw for deserters and lose casualties as for a Noble death; the rest (including all Regular Troops) stay with the stronghold and return with it.</li>" +
      "<li>FAQ: if the attacking Noble dies while reducing a stronghold to 0, the attacker gets no rewards — but the stronghold is still removed and its Baron gets no Influence in the next Upkeep.</li>" +
      "<li>You may always place off-board Nobles, and assign Mercenaries from the Draft, at your stronghold — even while it is besieged (FAQ).</li>" +
      (c.mod("elim") ? "<li><b>Player Elimination:</b> a Baron whose stronghold is captured is eliminated. His Nobles leave the board and his cities become neutral; if he was Chairman or Head of the Church, the token passes to the Baron with the next-most Votes or Faith (ties broken randomly).</li>" : "") +
      (WK.king(c) ? "<li><b>The King — usurping:</b> a Baron who wins an attack against the King's stronghold takes the King token and all the King's Army cards (on top of the normal spoils) and becomes King.</li>" : "") + "</ul>",
    src: (c) => WK.cite("Rules p.17", "FAQ p.3", c.mod("elim") ? "Rules p.20" : "", WK.king(c) ? "C&G p.4" : "")
  },
  {
    title: "Retreats, Noble Death & Returning Nobles",
    when: () => true,
    html: (c) => "<h4>Retreat (after losing a partial victory)</h4><ol>" +
      "<li><b>Draw for deserters:</b> draw 1 Fate card; if the retreating army has Mercenaries of that nationality, one of them deserts (shuffle it into the Mercenary deck).</li>" +
      "<li><b>Move:</b> retreating Nobles move even if exhausted, not necessarily together, to an <b>adjacent</b> area with no city or Nobles belonging to another Baron — an area with a <b>neutral</b> city is fine if it holds no other Baron's Noble or stronghold (FAQ). If there is no such area, the Noble is exhausted and placed at your stronghold; if it is besieged or off the board, he dies. No retreat by sea: a Noble forced to retreat from an overseas area dies.</li></ol>" +
      "<h4>Noble death</h4><ol>" +
      "<li><b>Draw for deserters</b> (as above).</li>" +
      "<li><b>Lose casualties:</b> for each casualty token, discard 100 strength of <b>Mercenaries</b> — as many as possible without going over — then remove the tokens. Regular Troops are never discarded as casualties." + (WK.fg(c) ? " (For Glory: all his <b>Town Levies</b> are discarded after this, so use Levies for casualties before Mercenaries.)" : "") + "</li>" +
      "<li><b>Remove</b> the Noble from the board and discard any office he held.</li>" +
      "<li><b>Heir:</b> the same piece keeps the remaining troops and may return in the Upkeep. With no heir, his Mercenaries are shuffled back and his Regular Troops leave the game — the only way to lose Regular Troops.</li></ol><ul>" +
      "<li>Casualties equal to or greater than troops at any moment — even outside battle, such as from the <i>Assassin</i> Event — kill the Noble at once (FAQ).</li>" +
      "<li>A Noble who loses all his troops <i>without</i> casualties is removed from the board but not dead, so <i>No Heir</i> and <i>Broken Line</i> don't apply (FAQ).</li>" +
      (c.mod("aband") ? "<li><b>Abandoned Nobles:</b> a Noble who dies because of desertion is <b>abandoned</b>, not dead, even with casualty tokens: remove him and his casualties/troops as for a death, but he doesn't count as dead for cards such as <i>No Heir</i>.</li>" : "") +
      (c.mod("heirs") ? "<li><b>Exchanging Heirs:</b> each Noble has one heir token, which his Baron may trade to another player. Whoever holds an opponent's heir may threaten at any time to kill it, making the Noble's death permanent. A dead Noble returns only if the holder of his living heir gives it back. <i>No Heir</i> or <i>Broken Line</i> kills his heir, and he may not have another.</li>" : "") + "</ul>" +
      "<h4>Returning Nobles to the board (end of Upkeep)</h4><ul>" +
      "<li>Chairman first, then the Baron to his left, and so on. Nobles are off the board because they never had troops, gave all their troops away, or died (the returning Noble is then his heir).</li>" +
      "<li>First, re-divide the troops among your off-board Nobles as you like. Second, troops at your stronghold may go to off-board Nobles (troops with casualty tokens: all of them and the tokens to one Noble, or nothing).</li>" +
      "<li>Finally, every off-board Noble <b>with troops</b> must be placed at your stronghold or at any city you control that isn't under siege (your besieged stronghold is allowed — FAQ). A Noble without troops never enters the board.</li></ul>",
    src: (c) => WK.cite("Rules p.8, p.17–19", "FAQ p.2–3", c.mod("heirs") ? "Rules p.19–20" : "", WK.fg(c) ? "C&G p.2" : "")
  },
  {
    title: "Cities: Control, Revolts & Fortifications",
    when: () => true,
    html: (c) => "<ul>" +
      "<li>The board has <b>18 Kingdom cities</b> and <b>6 overseas cities</b> (in the areas with Constantinople, Syracuse, Cadiz, Jerusalem, Alexandria and Acre). Each city shows its <b>strength</b> (left) and <b>income</b> (right).</li>" +
      "<li>When you capture a city, place one of your control markers under it.</li></ul>" +
      "<h4>Revolts (Upkeep step 3)</h4><ul>" +
      "<li>One at a time, for each city you control <b>without one of your Nobles in its area</b>, draw a Fate card. On <b>Revolt</b> the city becomes neutral (remove your control marker) unless you pay <b>1 Faith</b> or <b>twice its income</b> in crowns.</li>" +
      (WK.fg(c) ? "<li><b>For Glory — Riot</b> (on about 1 in 5 of the new Fate cards): pay twice the city's income or 1 Faith, or a <b>riot token</b> goes on the city. A rioting city gives no crowns at Taxation and no Influence at Upkeep; a second Riot on a rioting city counts as a Revolt. The token is removed when you have a Noble or Garrison at the city, or if you lose the city.</li>" : "") + "</ul>" +
      "<h4>Fortified cities</h4><ul>" +
      "<li>Fortify with <b>Upgrade Defenses</b> (4 crowns): <b>+1 crown</b> at Taxation, <b>+100 strength</b> when defending.</li>" +
      "<li>A fortified city stays fortified when another Baron takes it (his marker goes fortified side up), but loses the status if it becomes neutral (for example by revolt). Breaches stay either way.</li>" +
      "<li>If breaches reduce a fortified city to 0, flip the control marker to unfortified and remove one breach token, so the city is still at 0.</li></ul>" +
      (WK.fg(c) ? "<h4>Garrisons (For Glory)</h4><ul><li>A Garrison adds <b>100 strength</b> to its city while defending; it never moves or attacks. See “For Glory — New Troops”.</li></ul>" : ""),
    src: (c) => WK.cite("Rules p.2–3, p.8, p.10, p.16, p.18", WK.fg(c) ? "C&G p.2–3" : "")
  },
  {
    title: "Fate Cards & Random Draws",
    when: () => true,
    html: (c) => "<p>Each Fate card carries seven results: (1) a random <b>Baron</b>, (2) <b>Revolt / No Revolt</b>, (3) a random <b>Noble</b>, (4) a <b>battle result</b>, (5) <b>expedition results</b> (one per expedition), (6) a random <b>city</b>, (7) a random <b>nationality</b>.</p><ul>" +
      "<li>Whenever the rules or a card say to “randomly choose” a Baron, Noble, nationality or city, the <b>Chairman</b> draws the top Fate card. A random Noble of a random Baron uses one card.</li>" +
      "<li>If the card doesn't meet the need (for example, a Kingdom city is needed and it shows an overseas city), keep drawing until it does.</li>" +
      "<li>Discard Fate cards <b>facedown to the bottom</b> of the deck. <b>Uncertain Times</b> reshuffles the deck; any deck that runs out is rebuilt from its discards.</li>" +
      "<li>Battle results: <i>Deal 100 Casualties</i>, <i>Prevent 100 Casualties</i>, <i>+1 Victory</i>, <i>Draw 1 Fate</i>" + (WK.fg(c) ? ", and For Glory's <i>Retreat/Draw 1 Fate</i>" : "") + ".</li>" +
      (WK.fg(c) ? "<li><b>For Glory:</b> the new <b>48-card</b> deck (blue backs) replaces the original and does all the same jobs; it adds the <b>Riot</b>, <b>Retreat/Draw 1 Fate</b> and <b>Funds Needed</b> results, and each Baron may draw up to <b>20</b> cards at the start of a battle.</li>" : "") + "</ul>",
    src: (c) => WK.cite("Rules p.4–5, p.11, p.14, p.19", WK.fg(c) ? "C&G p.1, p.3–4" : "")
  },
  {
    title: "Player Count Rules",
    when: () => true,
    html: (c) => "<table class='tbl'><thead><tr><th>Barons</th><th>Kingdom cities razed at setup</th><th>Unrazed at start</th><th>City win at start</th></tr></thead><tbody>" +
      [6, 5, 4, 3, 2].map((p) => "<tr" + (p === c.p ? " class='cur'" : "") + "><td>" + p + (p === c.p ? " (this game)" : "") + "</td><td>" + WK.RAZED[p] + "</td><td>" + WK.unrazed(p) + "</td><td>" + (p === 2 ? "5 cities (FAQ rule change)" : WK.majority(p) + " cities (more than half)") + "</td></tr>").join("") +
      "</tbody></table><ul>" +
      "<li>Special phases fire at <b>twice the number of Barons</b> (" + (2 * c.p) + " cards); the Mercenary Draft at <b>one more</b> than the number of Barons (" + (c.p + 1) + " markers).</li>" +
      (c.p <= 3 ? "<li><b>Two or three Barons:</b> strongholds may not be placed on the outer row or column of the main Kingdom map.</li>" : "") +
      (c.p === 2 ? "<li><b>Two Barons:</b> Assembly votes are written secretly for all three Agendas at once (see “The Assembly”); the city win is <b>5 cities</b> (FAQ)" + (WK.fg(c) ? "; For Glory's starting Scholar is skipped" : "") + ".</li>" : "") +
      "<li>The razed cities are chosen with the Fate deck" + (WK.fg(c) ? " — or, with For Glory, with Town Levy cards" : "") + ".</li></ul>",
    src: (c) => WK.cite("Rules p.2, p.7, p.19", "FAQ p.1", WK.fg(c) ? "C&G p.1–2" : "")
  },
  {
    title: "Bargaining & Running Out of Components",
    when: () => true,
    html: (c) => "<ul>" +
      "<li>Money and favors may be traded freely between Barons <b>at any time</b>. You may pay someone to spend Faith or cast Votes a certain way, but Vote and Faith tokens themselves can't be exchanged.</li>" +
      "<li><b>Influence, charges, offices and troops</b> may never be traded" + (c.mod("heirs") ? " (with Exchanging Heirs, heirs may be)" : "") + ".</li>" +
      "<li>Agreements are <b>not binding</b>: backstabbing is perfectly acceptable. A would-be defender can only avoid a battle by bargaining before the attack is declared.</li>" +
      "<li>If a deck runs out, shuffle its discard pile to make a new deck. Tokens are unlimited: use substitutes if you run out.</li></ul>",
    src: (c) => WK.cite("Rules p.17, p.19", c.mod("heirs") ? "Rules p.20" : "")
  },
  {
    title: "For Glory — Knowledge, Advancements & the Scholar",
    when: (c) => WK.fg(c),
    html: (c) => "<ul>" +
      "<li><b>Knowledge</b> is a new resource, gained with the <b>Enrich Mind</b> Baron Action card (1 per card). It buys <b>Advancement cards</b>.</li>" +
      "<li><b>Buying:</b> when you resolve Enrich Mind you may buy <b>one</b> of the three available Advancements for the Knowledge shown at the bottom of the card — the <b>Scholar</b> may buy as many as he can afford. Place it faceup in front of you; draw a replacement after <b>each</b> purchase.</li>" +
      "<li><b>Limits:</b> one copy of each Advancement per Baron, and at most <b>three</b> Advancements: discard down to three (your choice) to the bottom of the Advancement deck.</li>" +
      "<li><b>Using:</b> at no cost, when the card says; state that you're activating it, carry out the effect, and exhaust it if told to. An exhausted Advancement lies facedown until the Refresh Nobles step of the Upkeep.</li>" +
      "<li><b>In battle:</b> one Advancement per Baron per battle, declared right after drawing Fate cards and before discarding or revealing them — the attacker declares first. It works in addition to Fate cards and Noble abilities.</li></ul>" +
      "<h4>The Scholar</h4><ul>" +
      "<li>The Baron who plays Enrich Mind and then has more Knowledge than every other Baron takes the <b>Scholar token</b>." + (c.p === 2 ? " (Two Barons: nobody starts with it.)" : " A random Baron who is neither Chairman nor Head of the Church starts with it.") + "</li>" +
      "<li>The Scholar may buy any number of Advancements with Enrich Mind, and uses the special options on <b>Research</b> and <b>Uncertain Times</b>.</li></ul>",
    src: () => "C&G p.1–3"
  },
  {
    title: "For Glory — New Troops",
    when: (c) => WK.fg(c),
    html: () => "<h4>Garrisons (8)</h4><ul>" +
      "<li>Hired only through the new <b>Upgrade Defenses</b>: each Baron may hire one for one of his un-garrisoned cities for <b>1 crown</b>. Place the Garrison card in front of you and a Garrison token on the city.</li>" +
      "<li>Assigned to a city, not a Noble: <b>+100 strength</b> to the city while defending; it never attacks or moves. When all eight are hired, no more can be hired until one is free.</li>" +
      "<li>Paid <b>every Wages phase</b>: for each Garrison not paid, discard a Garrison card and one of your Garrison tokens. Lose control of a garrisoned city and its token is discarded with one of your Garrison cards. Discarded Garrison cards return to the Garrison deck.</li>" +
      "<li>A Garrison at a rioting city removes the riot token.</li></ul>" +
      "<h4>Town Levies (18)</h4><ul>" +
      "<li>Recruited only through the new <b>Muster Forces</b>: any number, for <b>2 crowns each</b>. You must <b>control</b> the Kingdom city named on the Town Levy card (it shows a mini-map) and have a <b>Noble at that city</b>; search the deck for it and assign it to that Noble. A Levy already with a different Noble can't be recruited.</li>" +
      "<li>Otherwise Levies follow the Mercenary rules and move with their Noble like Mercenaries — but they are never hired in the Draft and <b>never paid</b> at Wages.</li>" +
      "<li>If any Mercenary with a Noble deserts during Wages, <b>all</b> that Noble's Town Levies are discarded. When a Noble dies, all his Levies are discarded after casualties are resolved. Discarded Levies return to the Town Levy deck.</li></ul>" +
      "<h4>Leaders &amp; Heralds (12 Mercenaries)</h4><ul>" +
      "<li>One Leader and one Herald for each of the six nationalities, shuffled into the Mercenary deck and following all Mercenary rules.</li>" +
      "<li>Each grants the Noble it's assigned to a special ability, treated as printed on his Noble card and usable with his others — <b>even when exhausted</b>. Max one Leader and one Herald per Noble. They can't be dealt as starting 50-strength Mercenaries.</li></ul>",
    src: () => "C&G p.1–3"
  },
  {
    title: "For Glory — New Fate Deck",
    when: (c) => WK.fg(c),
    html: () => "<p>The new 48-card Fate deck (blue backs) completely replaces the original and serves all the same functions. Because it's bigger, each Baron may draw up to <b>20 Fate cards</b> at the start of a battle (the FAQ errata's limit for the original deck is 10).</p>" +
      "<h4>Riot (revolt result)</h4><ul><li>On about 1 in 5 of the new cards. Drawn for a city in the Revolts step: its owner pays twice its income or 1 Faith, or a <b>riot token</b> goes on it — no Taxation crowns and no Upkeep Influence from it. A second Riot on a rioting city is treated as a Revolt. The token goes when your Noble or Garrison is present at the city, or when you lose it.</li></ul>" +
      "<h4>Retreat/Draw 1 Fate (battle result)</h4><ul>" +
      "<li>After all Fate cards are revealed, both sides count their Retreat/Draw 1 Fate results. If the <b>defender</b> has more, he may <b>retreat</b> voluntarily. Otherwise — or if he chooses not to — each counts as a Draw 1 Fate result.</li>" +
      "<li>Retreating: no casualties are dealt and no mercenaries retreat; the defender moves his army as for a normal retreat (the sheet cites “page 18”). If he retreats from an area with one of his cities or his stronghold, the attacker gains the city (or eliminates the stronghold) as if he had won an assault.</li>" +
      "<li>A neutral city treats this result as Draw 1 Fate.</li></ul>" +
      "<h4>Funds Needed (expedition result)</h4><ul><li>Each funder pays 2 crowns to the treasury or loses his investment; then the card counts as a “No Result” card. Results from best to worst: highest payout (5x, 4x, 3x, 2x, 1x), No News, Funds Needed, Fleet Lost.</li></ul>",
    src: () => "Rules p.14, p.17–18 · FAQ p.1 · C&G p.3–4"
  },
  {
    title: "Missions",
    when: (c) => WK.mis(c),
    html: (c) => "<ul>" +
      "<li>Each Baron is dealt <b>one secret Mission card</b> immediately before strongholds are placed; the rest go back in the box unseen.</li>" +
      "<li>Never show your Mission. If you reveal its criteria to another player, you lose the ability to fulfill it.</li>" +
      "<li>At the end of the game" + (WK.king(c) ? " (with The King, when a Baron reaches " + WK.target(c) + " Influence at the end of a round — not when the pool runs out),": ", after the Influence pool has run out,") + " everyone reveals his Mission while final Influence is tallied. Starting with the Chairman, each Baron checks whether he is <b>currently</b> fulfilling its criteria: if so it is worth <b>2 Influence</b>; if not it is discarded for nothing.</li>" +
      (c.mod("might") ? "<li class='caution'>With Might Is Right, Influence doesn't decide the winner, so Missions change nothing unless you agree otherwise.</li>" : "") + "</ul>",
    src: (c) => WK.cite("C&G p.4", c.mod("might") ? "Rules p.20" : "")
  },
  {
    title: "The King",
    when: (c) => WK.king(c),
    html: (c) => "<ul>" +
      "<li><b>Setup:</b> " + WK.pool(c) + " Influence per Baron in the pool; the King token and King's Army cards wait beside the board.</li>" +
      "<li><b>Crowning:</b> when the pool runs out, the Baron with the most Influence (ties broken as normal) becomes <b>King</b> and takes the King token. The game continues.</li>" +
      "<li><b>King's Army:</b> the new King immediately gains <b>" + c.p + " King's Army cards</b> (one per Baron), assigned at once to his stronghold and/or any of his Nobles at his stronghold or at cities he controls. They are Regular Troops: they never desert, but must be paid at Wages before any Mercenary. They are never discarded or lost unless another Baron becomes King.</li>" +
      "<li><b>The King's Influence:</b> the King gains <b>+1 Influence</b> in the Gain Influence step of every later Upkeep.</li>" +
      "<li><b>Usurping:</b> a Baron who wins an attack against the King's stronghold usurps him: on top of the normal spoils for defeating a stronghold, he takes the King token and all King's Army cards, assigns them as above, and is now King.</li>" +
      "<li><b>Winning:</b> with the pool empty, all Influence now comes from the treasury. When a Baron has at least <b>" + WK.target(c) + " Influence</b> at the end of a game round the game ends" + (WK.mis(c) ? " (Missions are scored now)" : "") + " and the Baron with the most Influence wins. You needn't hold the King token to win — the King is everyone's target.</li>" +
      "<li><b>Game length:</b> standard 8 per Baron to 16; longer 10 per Baron to 20; shorter 6 per Baron to 12.</li>" +
      (c.mod("might") ? "<li class='caution'>The rules don't say how The King combines with Might Is Right; agree at the table which victory applies.</li>" : "") + "</ul>",
    src: (c) => WK.cite("C&G p.4", c.mod("might") ? "Rules p.20" : "")
  },
  {
    title: "Optional Rules & Variants",
    when: () => true,
    html: (c) => {
      const on = (id) => (c.mod(id) ? " <span class='inplay'>in play</span>" : "");
      const lenOn = !WK.king(c) && c.len !== "std";
      return "<p>Agree before the game which of these you'll use. Those selected above are marked <span class='inplay'>in play</span>.</p><ul>" +
        "<li><b>Game Length</b>" + (lenOn ? " <span class='inplay'>in play</span>" : "") + " — change the Influence pool: 8 per Baron for a shorter game, 12 or 15 for a longer one." + (WK.king(c) ? " (With The King, use its own lengths: 6 → 12, 8 → 16, 10 → 20.)" : "") + "</li>" +
        "<li><b>Open Private Motions</b>" + on("openpm") + " — Private Motions are limited only by the players' ingenuity (e.g., prohibit sieges, or prohibit all Nobles from using roads); they're still voted on like any other Agenda.</li>" +
        "<li><b>Exchanging Heirs</b>" + on("heirs") + " — every Noble starts with one heir (a token). A Baron may trade his Nobles' heirs to other players; the holder may use one for bargaining, threatening to kill it and make the Noble's death permanent. A dead Noble returns only if the holder of his living heir gives it back. <i>No Heir</i> or <i>Broken Line</i> kills the heir for good.</li>" +
        "<li><b>Player Elimination</b>" + on("elim") + " — a Baron whose stronghold is captured is eliminated: his Nobles leave the board and his cities become neutral; his Chairman or Head of the Church token passes to the Baron with the next-most Votes or Faith (ties broken randomly).</li>" +
        "<li><b>Might Is Right</b>" + on("might") + " — one victory condition: more than half the unrazed Kingdom cities at the beginning of an Upkeep. Influence has no effect on who wins and the game doesn't end when the pool runs out; it may take much longer.</li>" +
        "<li><b>Abandoned Nobles</b> (FAQ)" + on("aband") + " — a Noble who dies because of desertion is abandoned, not dead, even with casualty tokens: treated exactly like a dead Noble except for cards such as <i>No Heir</i>. It makes desertion less harsh.</li>" +
        "<li><b>Miracles Can Happen</b> (FAQ)" + on("mirac") + " — Events with continuous effects (such as <i>No Heir</i> or <i>Heretic</i>) may be canceled after they happen for 1 Faith more than the printed cost — though not after the fact they describe has happened (e.g., <i>No Heir</i> after the Noble's death).</li></ul>";
    },
    src: (c) => WK.cite("Rules p.19–20", "FAQ p.3", WK.king(c) ? "C&G p.4" : "")
  },
  {
    title: "Key FAQ Rulings",
    when: () => true,
    html: (c) => "<ul>" +
      "<li><b>Errata:</b> at most <b>10</b> Fate cards in the Draw Fate Cards step" + (WK.fg(c) ? " (For Glory's new deck: 20)" : "") + "; Draw 1 Fate cards may exceed it. The setup diagram's Mercenary offer is one more than the number of players. Component counts: 93 crowns, 44 Influence, 24 casualty tokens (all −100), 18 single-sided breach tokens, 44 Agenda cards.</li>" +
      "<li><b>Two Barons (rule change):</b> win with <b>5 cities</b> at the start of an Upkeep instead of a majority; otherwise most Influence at the end wins.</li>" +
      "<li>The +200 of a Noble is leadership, not troops: it counts only for drawing Fate cards and the siege comparison.</li>" +
      "<li>Defending Nobles in an area with their own city are in the city: attack them only by assault or siege.</li>" +
      "<li>Casualties may be split among your armies in a battle; you can win even if your commander dies.</li>" +
      "<li>Every Noble that moves or attacks is exhausted, commander or not; Nobles you leave out of an attack stay fresh.</li>" +
      "<li>Wages are paid for every troop regardless of casualty tokens; a desertion that leaves casualties ≥ troops kills the Noble.</li>" +
      "<li>A Noble left without troops but with no casualties is removed, not killed.</li>" +
      "<li>Retreat into an area with a neutral city is allowed if it holds no other Baron's Noble or stronghold.</li>" +
      "<li>Ports in razed-city areas work; you needn't own a city to use its port.</li>" +
      "<li>Sieges: casualties and breaches count in the strength test; another Noble may join or finish a siege; finish it in any later round; ask permission again when other Barons are present; a besieged Baron may move Nobles in but not out.</li>" +
      "<li>Strongholds may go in an area with a razed city; moving through an area with only another Baron's stronghold needs no permission; off-board Nobles may always be placed at your own stronghold, even besieged.</li>" +
      "<li>A Mobilize Forces card used for neither moving nor attacking goes to the Assembly or Wages area, your choice.</li>" +
      "<li>Lasting Events must be canceled when played.</li></ul>",
    src: (c) => WK.cite("FAQ p.1–3", WK.fg(c) ? "C&G p.3" : "")
  },
  {
    title: "Strategy Tips (from the Rulebook)",
    when: () => true,
    html: () => "<ul>" +
      "<li><b>Early game:</b> take as many neutral cities as you can. Two common openings: split into four small armies and siege as many cities as possible in the first round, or build fewer, stronger armies and assault.</li>" +
      "<li><b>Managing stacks:</b> know which Action cards you still have (the rest sit in the Special Phase stacks) and which phase you're trying to trigger; experienced players use the stacks to thwart opponents.</li>" +
      "<li><b>Battles:</b> against a small army you may kill it with casualties before victories are counted; if you'll lose a battle, focus on dealing casualties. Discarding more than two Fate cards can pay off — e.g., throwing away casualty cards to take a city without breaching it.</li></ul>",
    src: () => "Rules p.18"
  }
];

/* =============================================================================
   TEACHING SCRIPT
   ============================================================================= */
WK.teach = {
  intro: "A ~5-minute teach for the exact sets, variants and player count selected above. Read it aloud, or hit Copy and tweak. Everything in it comes from the rulebook, the FAQ and the Crown and Glory rules cited in the setup and reference.",
  sections: [
    {
      h: "The hook — and how you win",
      body: (c) => {
        const U = WK.unrazed(c.p), need = WK.majority(c.p);
        let t = "<p>The King lies dead without an heir, and the " + WK.word(c.p) + " of us are Barons of the realm, each staking a claim to the throne. Each of us has four Nobles who lead our armies, a stronghold, a handful of crowns, and 400 troops — some loyal Regulars, some hired Mercenaries.</p>";
        const cityWin = c.p === 2
          ? "With two of us, the FAQ changes the city win: control <b>5 cities</b> at the start of an Upkeep and you win on the spot."
          : "Control <b>more than half of the unrazed Kingdom cities</b> at the start of any Upkeep and you take the throne by force — with " + WK.word(c.p) + " of us that's <b>" + need + " of the " + U + "</b> cities standing right now.";
        if (c.mod("might")) {
          t += "<p>We're playing <b>Might Is Right</b>, so there's only one way to win. " + cityWin + " Influence decides nothing, and the game doesn't end when the Influence pool runs out, so this will be a long war.</p>";
          if (WK.king(c)) t += "<p>We're also playing <b>The King</b>, and the rules don't say how it combines with Might Is Right — we'll play it the way we agreed before we started.</p>";
        }
        else if (WK.king(c)) t += "<p>There are two ways to win. " + cityWin + " Or win on <b>Influence</b>: each city pays 1 Influence per round from a pool of " + (WK.pool(c) * c.p) + ". We're playing <b>The King</b>: when the pool runs dry, the Baron with the most Influence is crowned <b>King</b> — but the game goes on until someone ends a round with <b>" + WK.target(c) + " Influence</b>, and then the most Influence wins. The King gets 1 extra Influence every Upkeep and a royal army, which makes him everyone's target.</p>";
        else t += "<p>There are two ways to win. " + cityWin + " Otherwise, every city we hold pays 1 <b>Influence</b> each round out of a shared pool of " + (WK.pool(c) * c.p) + " tokens; the round the pool runs dry is the last, and the most Influence wins." + (c.len !== "std" ? " We're playing the <b>" + (c.len === "short" ? "shorter" : "longer") + " game</b> — " + WK.pool(c) + " Influence per player in the pool instead of 10." : "") + "</p>";
        if (WK.king(c) && c.len !== "std") t += "<p>We're playing The King's <b>" + (c.len === "short" ? "shorter" : "longer") + " game</b>: " + WK.pool(c) + " Influence per player in the pool" + (c.mod("might") ? " and a finishing total of " + WK.target(c) + " Influence" : ", and the game ends at " + WK.target(c)) + ".</p>";
        if (WK.mis(c)) t += "<p>Each of us also has a secret <b>Mission</b>: if you're fulfilling it when the game ends, it's worth 2 more Influence. Never reveal what it asks, or you lose it.</p>";
        return t;
      }
    },
    {
      h: "The shape of a round",
      body: (c) => "<p>Each round has three phases. In <b>Planning</b>, we each secretly choose six of our Action cards and place them facedown, two on each of three numbered stacks. The Chairman adds " + WK.word(WK.neutralPer(c)) + " Neutral Action cards to each stack and shuffles each one. In <b>Actions</b>, the Chairman turns the cards over one at a time — stack one, then two, then three — and each card's owner carries it out. You know your stack-one cards come before your stack-three cards, but never exactly where they land among everyone else's. Then <b>Upkeep</b>: we check for a winner, take 1 Influence per city, cities with none of our Nobles in their area may revolt, ships land, tired Nobles refresh, and dead Nobles' heirs come back.</p>"
    },
    {
      h: "Your actions — and why you'd take them",
      body: (c) => "<ul>" +
        "<li><b>Mobilize Forces</b> — pick an area; march Nobles into it and/or start a battle there. This is how you take cities.</li>" +
        "<li><b>Versatile Strategy</b> — the Swiss army knife: 2 crowns, or 1 Vote, or move one Noble, or start a battle, or buy a spot in the Mercenary Draft. It comes straight back to your hand.</li>" +
        "<li><b>Levy Taxes</b> — a crown for every area where you have a Noble.</li>" +
        "<li><b>Draft Soldiers</b> — a free marker on the Mercenary Track; markers further left hire first when the Draft fires.</li>" +
        "<li><b>Rally Support</b> — 2 Votes, and if you now have the most, you take the Chairman's token: he orders the Agendas and breaks ties.</li>" +
        "<li><b>Serve the Church</b> — 1 Faith, and if you now have the most, you become Head of the Church, who aims Events at other people. Faith also cancels bad Events and buys off revolting cities.</li>" +
        (WK.fg(c) ? "<li><b>Forced March</b> (For Glory) — refresh an exhausted Noble for free, others for 2 crowns each: a second attack in one round.</li>" +
          "<li><b>Enrich Mind</b> (For Glory) — gain Knowledge, take the Scholar token if you have the most, and buy Advancements.</li>" : "") +
        "</ul><p>The Neutral cards shuffled in bring Events, expeditions you can invest in, city repairs and fortifications, healing for battered armies" + (WK.fg(c) ? ", troop recruiting, research" : "") + ", and a reshuffle of the Fate deck.</p>"
    },
    {
      h: "The central mechanic — the three stacks",
      body: (c) => "<p>Here's the heart of the game. After a card resolves, it goes onto one of three areas: Levy Taxes feeds <b>Taxation</b>, Draft Soldiers feeds <b>Wages</b>, Rally Support feeds the <b>Assembly</b>; Serve the Church goes wherever you like, and Mobilize Forces goes to Wages if you only moved and the Assembly if you fought. When an area holds <b>" + (2 * c.p) + " cards</b> — twice our number — that phase fires at once. <b>Taxation</b> pays everyone their city income. <b>Wages</b> makes everyone pay their troops, and unpaid Mercenaries desert. The <b>Assembly</b> votes on three Agendas — laws, offices, charges — " + (c.p === 2 ? "with Votes written down secretly" : "with Votes held in a closed fist") + ". Only then do those cards go back to their owners. So every card you play — except Versatile Strategy, which comes straight back — is locked away until its phase fires, and you can trigger Wages when a rival is broke. The <b>Mercenary Draft</b> fires the same way when " + (c.p + 1) + " Baron markers are on the Mercenary Track.</p>"
    },
    {
      h: "Battles and the Fate deck",
      body: (c) => "<p>To fight you need a Noble in an area with an enemy Noble, city or stronghold. Each side draws one <b>Fate card per 100 troops</b>, plus two for its commander's +200 — never more than " + WK.fateMax(c) + " cards — then throws two away and reveals the rest together. Cards say <i>Deal 100 Casualties</i>, <i>Prevent 100 Casualties</i>, <i>+1 Victory</i> or <i>Draw 1 Fate</i>. Casualties become tokens on your armies; when an army's tokens reach its troops, its Noble dies. If both sides still have Nobles standing, count victories: two ahead is a full victory and the enemy Nobles die; one ahead and they retreat. A commander's shape matters: stars deal an extra 100, squares prevent 100, triangles add a victory — and circle Nobles lead up to 400 troops wage-free.</p>" +
        "<p>Cities fight back with their own strength. <b>Assault</b> one for a quick, bloody capture that knocks breaches in its walls — or, if you're stronger, <b>siege</b> it: no losses, and if the siege is still standing when you siege again in a later round, the city falls. The early game is a land-grab for neutral cities — and the same Fate deck decides everything random, from revolts to deserters.</p>"
    },
    {
      h: "Our table",
      when: (c) => c.p !== 6 || WK.anyVar(c) || (!WK.king(c) && c.len !== "std"),
      body: (c) => {
        const li = [];
        if (c.p === 2) li.push("<li><b>Two players:</b> 11 Kingdom cities were razed before we began, strongholds stay off the outer row and column, the city win is 5 cities, and at the Assembly we each secretly write down how many Votes we put on each of the three Agendas, then reveal them all at once.</li>");
        else if (c.p === 3) li.push("<li><b>Three players:</b> 7 Kingdom cities were razed before we began, and strongholds stay off the outer row and column of the Kingdom.</li>");
        else if (c.p < 6) li.push("<li><b>" + (c.p === 4 ? "Four" : "Five") + " players:</b> " + WK.RAZED[c.p] + " Kingdom cities were razed before we began, so there's less to go round.</li>");
        if (!WK.king(c) && c.len !== "std") li.push(c.mod("might")
          ? "<li><b>Game Length:</b> " + WK.pool(c) + " Influence per player in the pool (the " + (c.len === "short" ? "shorter" : "longer") + " game's setting) — though under Might Is Right an empty pool doesn't end the game.</li>"
          : "<li><b>Game Length:</b> " + WK.pool(c) + " Influence per player in the pool makes this a " + (c.len === "short" ? "shorter" : "longer") + " game.</li>");
        if (c.mod("openpm")) li.push("<li><b>Open Private Motions:</b> a Private Motion can propose anything we can dream up — banning sieges, closing the roads — as long as it's voted on like any Agenda.</li>");
        if (c.mod("heirs")) li.push("<li><b>Exchanging Heirs:</b> every Noble has an heir token, and heirs can be traded. Whoever holds your Noble's heir decides whether he ever comes back from the dead — a hostage worth bargaining over.</li>");
        if (c.mod("elim")) li.push("<li><b>Player Elimination:</b> lose your stronghold and you're out of the game — guard it.</li>");
        if (c.mod("might")) li.push("<li><b>Might Is Right:</b> as I said, only the city win counts.</li>");
        if (c.mod("aband")) li.push("<li><b>Abandoned Nobles:</b> a Noble who dies because his Mercenaries deserted is only abandoned, not dead — cards like No Heir can't touch him.</li>");
        if (c.mod("mirac")) li.push("<li><b>Miracles Can Happen:</b> you can cancel a lasting Event later by paying 1 Faith more than its cost.</li>");
        return li.length ? "<ul>" + li.join("") + "</ul>" : "";
      }
    },
    {
      h: "For Glory",
      when: (c) => WK.fg(c),
      body: (c) => "<p>We're adding <b>For Glory</b>. A new resource, <b>Knowledge</b>, comes from the new <b>Enrich Mind</b> card and buys <b>Advancement cards</b> — powerful free abilities; you may own three. If Enrich Mind leaves you with more Knowledge than anyone else, you take the <b>Scholar</b> token, which lets you buy several at once" + (c.p === 2 ? "" : " — one of us starts as Scholar") + ". <b>Forced March</b> refreshes tired Nobles. New troops: <b>Garrisons</b> add 100 to a city's defense; <b>Town Levies</b> are raised at your own cities and never paid, but are lost if a Mercenary in their army deserts at Wages; and <b>Leader and Herald</b> Mercenaries give their Noble an extra ability. Three Neutral cards go on each stack now, adding <b>Research</b>, <b>A Pressing Agenda</b> and <b>Assemble Troops</b>. The new Fate deck lets you draw up to 20 cards and adds <b>Riot</b> (a city stops paying), <b>Retreat/Draw 1 Fate</b> (a defender may slip away) and <b>Funds Needed</b> (expedition investors pay 2 more crowns or lose their stake).</p>"
    },
    {
      h: "Missions",
      when: (c) => WK.mis(c),
      body: (c) => "<p>With <b>Missions</b>, look at your secret Mission card now and keep it hidden. " + (c.mod("might") ? "Under Might Is Right its 2 Influence decides nothing unless we agree otherwise." : "At the end, if you're fulfilling it right then, it's worth 2 Influence — often enough to swing a close game.") + "</p>"
    },
    {
      h: "The King",
      when: (c) => WK.king(c),
      body: (c) => "<p>With <b>The King</b>, the first to be crowned gets " + WK.word(c.p) + " King's Army cards — loyal troops that never desert — and 1 extra Influence every Upkeep. Take the King's stronghold and you <b>usurp</b> him: his crown and his army become yours. " +
        (c.mod("might") ? "How the crown and The King's finish at " + WK.target(c) + " Influence fit with Might Is Right is whatever we agreed before we started."
          : "Remember, you don't need the crown to win — only the most Influence when someone reaches " + WK.target(c) + ".") + "</p>"
    },
    {
      h: "Don't worry about these until they come up",
      body: (c) => {
        const it = [];
        it.push("<li><b>Agendas</b> — motions, laws, charges, offices, Private Motions and bans; we'll read each as it comes up.</li>");
        it.push("<li><b>Expedition payouts</b> — the Fate card tells us when a fleet reaches spot 3.</li>");
        it.push("<li><b>Retreats, deserters, Noble death and heirs returning</b> — we'll walk through them the first time.</li>");
        it.push("<li><b>Sea movement, breaches, repairs and fortifying</b> — when someone first tries them.</li>");
        if (WK.fg(c)) it.push("<li><b>Individual Advancements</b> — read each card when it's on offer.</li>");
        if (WK.king(c)) it.push("<li><b>King's Army placement</b> — we'll sort it out when the pool runs dry.</li>");
        return "<ul>" + it.join("") + "</ul>";
      }
    }
  ]
};
