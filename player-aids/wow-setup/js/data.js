/* =============================================================================
   World of Warcraft: The Board Game — Setup & Reference Utility · data
   Sources (the only sources): the base rulebook (wowrules.pdf, 2005), the
   Shadow of War rulebook (wowxprules.pdf, 2006), The Burning Crusade rulebook
   (wow_tbc_rules.pdf, Aug 2007) and the official FAQ v1.4 (Dec 2007).
   Precedence: FAQ > The Burning Crusade > Shadow of War > Base. An expansion's
   changes apply only when that expansion is selected.
   Citations use the PRINTED page numbers (all four books number their pages
   the same as the PDF); The Burning Crusade's unnumbered back cover (the
   Dungeon Reference) is cited as "The Burning Crusade back cover".
   Context c = { has(set), mod(id), p, chars, ov, tbc, sow, outland, nool,
                 party:{A:[],H:[]}, cls(id), anyCls }
   ============================================================================= */
var WW = {};

WW.expMeta = {
  base:  { name: "Base game",           cls: "tag-base" },
  sow:   { name: "Shadow of War",       cls: "tag-sow" },
  tbc:   { name: "The Burning Crusade", cls: "tag-tbc" },
  faq:   { name: "FAQ",                 cls: "tag-faq" },
  "var": { name: "Variant",             cls: "tag-var" },
  guide: { name: "First game",          cls: "tag-guide" }
};

WW.expansions = [
  { id: "base", short: "World of Warcraft: The Board Game", year: "2005",
    blurb: "The base game: Horde against Alliance across Lordaeron, nine classes, three Overlords. Always in play." },
  { id: "sow", short: "Shadow of War", year: "2006",
    blurb: "New powers and talents, new items and a Bonus Item deck, blue quests for hunting independent creatures, new events and Destiny cards." },
  { id: "tbc", short: "The Burning Crusade", year: "2007",
    blurb: "Outland, dungeons, level 6, flying mounts, purple creatures, poison and four new Overlords — or play it without Outland." }
];

WW.tbcModes = [
  { id: "outland", name: "With Outland",
    blurb: "The full expansion: both boards, dungeons, level 6 and an Outland Overlord. Play continues until the Overlord falls." },
  { id: "nool", name: "Playing Without Outland",
    blurb: "A lower-key game on Lordaeron: a base Overlord or Ragnaros, the new creatures and quests, and the normal 30-turn ending." }
];

WW.overlords = [
  { id: "kt", name: "Kel’Thuzad", he: "he", blurb: "Five special Event cards join the Event deck." },
  { id: "nef", name: "Nefarian", he: "he", blurb: "Moves after each Event card draw, by its Fate number." },
  { id: "kaz", name: "Lord Kazzak", he: "he", blurb: "The elusive one: five Overlord counters." },
  { id: "rag", name: "Ragnaros", he: "he", tbc: true, blurb: "The Burning Crusade’s Lordaeron Overlord. Playing Without Outland only." },
  { id: "kael", name: "Kael’Thas", he: "he", tbc: true, outland: true, lair: "Tempest Keep", blurb: "Outland Overlord; lair: Tempest Keep." },
  { id: "vashj", name: "Lady Vashj", he: "she", tbc: true, outland: true, lair: "Coilfang Reservoir", blurb: "Outland Overlord; lair: Coilfang Reservoir." },
  { id: "illidan", name: "Illidan Stormrage", he: "he", tbc: true, outland: true, lair: "The Black Temple", blurb: "Outland Overlord; lair: The Black Temple. The longest, hardest endgame." }
];

/* Class order as listed in the base rulebook (Base p.15). Base sheets: the Paladin is
   Alliance-only and the Shaman Horde-only (Base p.3, p.7). */
WW.classes = [
  { id: "druid", name: "Druid" }, { id: "hunter", name: "Hunter" }, { id: "mage", name: "Mage" },
  { id: "paladin", name: "Paladin", baseFaction: "A" }, { id: "priest", name: "Priest" }, { id: "rogue", name: "Rogue" },
  { id: "shaman", name: "Shaman", baseFaction: "H" }, { id: "warlock", name: "Warlock" }, { id: "warrior", name: "Warrior" }
];

/* "A Guide to your First Game" (Base p.40) */
WW.firstGame = {
  A: [ { cls: "druid", hero: "Artumnis Moondream", powers: "Rejuvenation and Bear Form", talent: "Ferocity" },
       { cls: "warlock", hero: "Sandrai Darkshine", powers: "Immolate and Shadow Bolt", talent: "Improved Shadow Bolt" },
       { cls: "hunter", hero: "Burbonn Fang", powers: "Scorpid Sting and Hunter’s Mark", talent: "Precision" } ],
  H: [ { cls: "warrior", hero: "Grumbaz Crowsblood", powers: "Heroic Strike and Battle Shout", talent: "Improved Heroic Strike" },
       { cls: "mage", hero: "Sofeea Icecall", powers: "Frostbolt and Arcane Intellect", talent: "Arcane Focus" },
       { cls: "priest", hero: "Wennu Bloodsinger", powers: "Lesser Heal and Shadow Word: Pain", talent: "Improved Pain" } ]
};

WW.modules = [
  { id: "sow-class", requires: "sow", name: "New powers & talents", summary: "10 Power and 10 Talent cards per class; many can be fast-equipped",
    description: "Shadow of War’s new Class cards. The expansion is designed to be used whole, but you may use only some of its cards.", src: "Shadow of War p.2–4" },
  { id: "sow-items", requires: "sow", name: "New items & Bonus Items", summary: "New Item cards plus the fifth Bonus Item deck",
    description: "New Triangle, Square, Circle and Special Item cards, and the Bonus Item deck that blue quests mainly reward.", src: "Shadow of War p.2–3, p.5" },
  { id: "sow-blue", requires: "sow", name: "Blue quests", summary: "Three shared quests for hunting independent creatures",
    description: "A blue Quest deck either faction can complete by defeating blue (independent) creatures.", src: "Shadow of War p.3, p.5–6" },
  { id: "sow-events", requires: "sow", name: "New events", summary: "26 Event cards for the Event deck",
    description: "New Event cards that work like the base game’s.", src: "Shadow of War p.2–3" },
  { id: "sow-destiny", requires: "sow", name: "Destiny cards", summary: "One timed, realm-shaking card always in play",
    description: "Destiny cards: always one in play, expiring on a timer kept on the turn track; six are specific to each base Overlord.", src: "Shadow of War p.3, p.6–7" },
  { id: "sow-redraw", requires: "sow", needs: "sow-blue", name: "Optional rule: redraw blue quests", summary: "Redraw a blue quest whose creatures aren’t on the board",
    description: "If you draw a blue quest and none of the required creatures are on the board, you may discard it and draw a new one, once per quest.", src: "Shadow of War p.8" },
  { id: "deadly", requires: "base", name: "Variant: Deadly PvP!", summary: "Faster, deadlier PvP — hits are not cancelled in the Resolution step",
    description: "PvP Resolution step: each faction takes wounds equal to all the tokens in the opponent’s damage box.", src: "Base p.37" },
  { id: "dto", requires: "base", name: "Variant: Defeat the Overlord!", summary: "No final PvP battle: the turn track loops until the Overlord falls",
    description: "After turn 30 the turn marker goes back to space 1; the only way to win is to defeat the Overlord.", src: "Base p.37" },
  { id: "first", requires: "base", name: "First game guide", summary: "The rulebook’s six starter heroes, first powers and first talents",
    description: "Recommended characters, training and talent picks and tips from “A Guide to your First Game”.", src: "Base p.40" }
];

WW.teams = {
  2: "2 players · 4 characters — each player runs both characters of one faction",
  3: "3 players · 4 characters — two players share one faction (one character each); the third runs both characters of the other",
  4: "4 players · 4 characters — one each, two per faction",
  5: "5 players · 6 characters — one player runs two characters of the same faction; three per faction",
  6: "6 players · 6 characters — one each, three per faction (the rules are written for six)"
};

(function () {
  "use strict";
  /* Join citations, merging the pages cited for the same document ("Base p.3, p.7" + "Base p.40" →
     "Base p.3, p.7, p.40") and dropping a page already covered by a cited range. */
  const span = (pg) => { const m = pg.match(/^p\.(\d+)(?:–(\d+))?/); return m ? [+m[1], +(m[2] || m[1])] : [9999, 9999]; };
  const J = (a) => {
    const order = [], map = {};
    for (const item of a.filter(Boolean)) for (const part of String(item).split(" · ")) {
      const m = part.match(/^(.*?) (p\.\d.*)$/);
      if (!m) { if (!(part in map)) { map[part] = null; order.push(part); } continue; }
      const doc = m[1];
      if (!(doc in map)) { map[doc] = []; order.push(doc); }
      for (const pg of m[2].split(/,\s*/)) if (!map[doc].includes(pg.trim())) map[doc].push(pg.trim());
    }
    return order.map((doc) => {
      if (map[doc] === null) return doc;
      const pgs = map[doc].filter((pg, i, all) => {
        const [a1, b1] = span(pg);
        return !all.some((o, j) => j !== i && o !== pg && span(o)[0] <= a1 && span(o)[1] >= b1 && (span(o)[1] - span(o)[0]) > (b1 - a1));
      });
      pgs.sort((x, y) => span(x)[0] - span(y)[0] || span(x)[1] - span(y)[1]);
      return doc + " " + pgs.join(", ");
    }).join(" · ");
  };
  const ovOf = (c) => WW.overlords.find((o) => o.id === c.ov) || WW.overlords[0];
  const clsName = (id) => (WW.classes.find((k) => k.id === id) || {}).name || id;
  const partyLine = (c) => {
    if (!c.anyCls) return "";
    const side = (f) => c.party[f].map((x) => x ? clsName(x) : "—").join(", ");
    return "<b>Alliance:</b> " + side("A") + " · <b>Horde:</b> " + side("H");
  };
  WW.partyLine = partyLine;
  WW.clsName = clsName;
  WW.ovOf = ovOf;
  const quests = (c) => (c.chars === 6 ? 5 : 4);
  const maxLvl = (c) => (c.outland ? 6 : 5);
  const dice = (c) => (c.tbc ? 10 : 7);

  /* ===========================================================================
     SETUP — Base game setup steps 1–12 (Base p.6–8) with the expansions' changes
     =========================================================================== */
  WW.phases = [
    {
      title: "The table and the heroes",
      steps: [
        { when: (c) => c.nool, exp: "tbc",
          t: "Playing Without Outland — what changes",
          d: (c) => "<ul><li>This variant uses its own list <b>instead of</b> The Burning Crusade’s setup page (TBC p.7). The steps below apply it:<ul>" +
            "<li><b>Overlord:</b> a base-game Overlord or <b>Ragnaros</b> — never an Outland Overlord.</li>" +
            "<li><b>Creatures:</b> the Yeti, Ooze and Abomination and the <b>purple</b> figures of the base creature types are used; the Outland-only Arakkoa, Ravager, Mo’arg, Wrath Guard, Fungal Giant and Shivan may be left out.</li>" +
            "<li><b>Level 6:</b> not available — use Lordaeron’s Experience Track; the level 6 extensions, level 6 Power and Talent cards and Flying Mount cards stay in the box.</li>" +
            "<li><b>Quests:</b> the new green, yellow, red and purple Quest cards are used, except the <b>Outland quests</b> (green background on the card face); The Burning Crusade’s blue Quest cards stay in the box (they need the Outland board).</li>" +
            "<li><b>Ending:</b> the normal game — the final PvP battle when the turn marker reaches “End”." +
            (c.mod("dto") ? " Here the <b>Defeat the Overlord!</b> variant replaces that ending (see the variants step)." : "") + "</li></ul></li>" +
            "<li>Still in force without Outland: the <b>new Creature Reference Sheets</b> (they replace the base ones) and the <b>10-dice-per-colour</b> limit.</li>" +
            "<li><b>Not covered by the variant:</b> the Lordaeron dungeons (Dungeon tokens and Stage decks), the replacement Paladin and Shaman sheets and the new Item cards (with the hexagon deck) are set up in TBC p.7’s steps, which this variant replaces, and p.19 doesn’t bring them back — so this page leaves them out.<ul>" +
            "<li>That is this page’s literal reading, not a printed rule: TBC p.4 also calls the new sheets replacements for the base ones without mentioning Outland, and the books don’t say whether any of these may be added.</li></ul></li></ul>",
          src: (c) => J(["The Burning Crusade p.4, p.5, p.7, p.8, p.19", c.mod("dto") && "Base p.37"]) },

        { when: () => true, exp: (c) => (c.outland ? "tbc" : "base"),
          t: (c) => (c.outland ? "Lay out Lordaeron and Outland" : "Lay out the board"),
          d: (c) => {
            let h = "<ul><li>Fold out the <b>game board</b> and lay it centrally on the table.</li>" +
              "<li>Leave room as in “The Play Area” diagram: the Horde player areas along one side of the board and the Alliance player areas along the other; the Overlord, Item decks and token piles at one end; the Quest decks and the unused creature pile at the other end, with each faction’s faceup quests at its own corner.</li>";
            if (c.outland) {
              h += "<li><b>The Burning Crusade:</b> place the <b>Outland game board</b> next to the Lordaeron board — both boards are used.</li>" +
                "<li>Mark the four <b>Lordaeron dungeons</b> with their Dungeon tokens:<ul>" +
                "<li><b>Shadowfang Keep</b> → Olsen’s Farthing (Silverpine Forest)</li>" +
                "<li><b>The Scarlet Monastery</b> → Scarlet Monastery (Tirisfal Glades)</li>" +
                "<li><b>Stratholme</b> → Stratholme (Eastern Plaguelands)</li>" +
                "<li><b>Scholomance</b> → Caer Darrow (Western Plaguelands)</li></ul></li>" +
                "<li>The Outland dungeons are printed on the Outland board — no tokens needed.</li>" +
                "<li>Short of space? Keep the unused creatures in the box lid, put decks and the Overlord sheet on a second table, and bag the tokens until needed.</li>";
            }
            return h + "</ul>";
          },
          src: (c) => (c.outland ? "Base p.6 · The Burning Crusade p.7, p.16" : "Base p.6") },

        { when: () => true, exp: "base",
          t: "Choose classes",
          d: (c) => {
            const per = {
              2: "<b>2 players:</b> each of you chooses <b>two</b> classes — one of you will run both Alliance characters, the other both Horde characters." +
                (c.outland ? "" : " With the base sheets the Paladin is Alliance-only and the Shaman Horde-only, so one player can’t take both."),
              3: "<b>3 players:</b> two of you choose one class each (you’ll share a faction); the third chooses <b>two</b> classes for the other faction — but not both the Paladin and the Shaman" + (c.outland ? " (a base-game rule The Burning Crusade doesn’t revisit)" : "") + ".",
              4: "<b>4 players:</b> one class each — two characters per faction.",
              5: "<b>5 players:</b> one of you chooses <b>two</b> classes for the same faction (not both the Paladin and the Shaman" + (c.outland ? " — a base-game rule The Burning Crusade doesn’t revisit" : "") + "); everyone else chooses one. Three characters per faction.",
              6: "<b>6 players:</b> one class each — three characters per faction."
            };
            let h = "<ul><li>Randomly decide the order in which players choose their class.</li>" +
              "<li>In that order, each player takes a class’s <b>character sheet</b> and its <b>Class deck</b> of 24 cards (12 Power, 12 Talent). There are nine classes and each can be chosen only once.</li>" +
              "<li>" + per[c.p] + "</li>";
            if (c.mod("sow-class")) h += "<li><b>Shadow of War:</b> also take your class’s <b>10 new Power</b> and <b>10 new Talent</b> cards.</li>";
            if (c.outland) h += "<li><b>The Burning Crusade:</b> also take your class’s <b>level 6 character sheet extension</b> (it goes to the right of your sheet) and its <b>6 new level 6 Class cards</b>.</li>";
            if (c.nool) h += "<li><b>Without Outland:</b> no level 6 — the extensions, the level 6 Power and Talent cards and the Flying Mount cards stay in the box.</li>";
            if (c.mod("first")) h += "<li><b>First game?</b> The book recommends six starter heroes — see the last step.</li>";
            if (c.anyCls) h += "<li>Your line-up: " + partyLine(c) + "</li>";
            return h + "</ul>";
          },
          src: (c) => J(["Base p.4, p.6" + (c.p === 2 && !c.outland ? ", p.7" : "") + (c.p < 6 ? ", p.35–36" : ""), c.mod("sow-class") && "Shadow of War p.3",
            c.outland && "The Burning Crusade p.3, p.7, p.14, p.16", c.nool && "The Burning Crusade p.19"]) },

        { when: () => true, exp: (c) => (c.outland ? "tbc" : "base"),
          t: "Decide factions and take your seats",
          d: (c) => {
            let h = "<ul>";
            if (c.outland) {
              h += "<li><b>The Burning Crusade:</b> its two new sheets replace the base Paladin and Shaman sheets and add a <b>Horde Paladin</b> (Blood Elf) and an <b>Alliance Shaman</b> (Draenei), so either faction may field them. There is still only one Paladin deck and one Shaman deck.</li>";
            } else {
              h += "<li>The <b>Paladin</b> is always Alliance and the <b>Shaman</b> always Horde — their sheets are single-sided — so those players skip the random draw.</li>";
            }
            h += "<li>Randomly decide " + (c.outland ? "everyone’s" : "everyone else’s") + " faction so each side ends with <b>" + (c.chars / 2) + " characters</b>" +
              (c.p === 2 ? " (with two players, one player takes the Alliance pair and the other the Horde pair)" : "") +
              ". The book’s example: the undecided players each roll a die and the highest results join one faction — any random method works.</li>" +
              "<li>Sit the <b>Horde</b> together on one side of the table, preferably facing the northern part of the map, and the <b>Alliance</b> on the other side, facing south.</li>" +
              "<li>Put your character sheet in front of you with your faction’s side up (red = Horde, blue = Alliance) and your Class deck beside it.</li>";
            if (c.outland) h += "<li><b>Shaman errata (FAQ):</b> on the new sheet, the Horde Shaman’s racial ability should read “Bloodfury: ATTRITION +1” and the Shaman’s Lightning Bolt costs 1 Energy — the easiest fix is to use the old Orc Shaman sheet. Playing the Draenei Shaman, Lightning Bolt also costs 1.</li>";
            if (c.anyCls) h += "<li>Your line-up: " + partyLine(c) + "</li>";
            return h + "</ul>";
          },
          src: (c) => J(["Base p.3, p.7" + (c.p === 2 ? ", p.35" : ""), c.outland && "The Burning Crusade p.3–4, p.7 · FAQ p.4"]) },

        { when: () => true, exp: "base",
          t: "Prepare each character",
          d: (c) => "<ul>" +
            "<li>Take a <b>Bag</b> token and a <b>Spellbook</b> token and place them next to your character sheet.</li>" +
            "<li>Take your character’s <b>7 character tokens</b> (your character’s side up). Put one on the <b>“Start”</b> space of the Experience Track" +
            (c.outland ? " (with The Burning Crusade, the <b>Outland board’s</b> Experience Track, used instead of Lordaeron’s)" : "") +
            " and one on the <b>“Level 1”</b> box of the Level track on your sheet.</li>" +
            "<li>Take the starting <b>Health</b> and <b>Energy</b> tokens shown in your sheet’s Level 1 frame and put them in the Health and Energy areas.</li>" +
            "<li>Place your <b>figure</b>: Alliance in <b>Southshore</b>, Horde in <b>Brill</b>.</li>" +
            "<li>Each player takes two <b>Action tokens</b> to track actions — flip one to its grey side after each action.</li>" +
            ([2, 3, 5].includes(c.p) ? "<li>Running two characters? Do all of this for each of them — except the Action tokens, which are two per player.</li>" : "") +
            (c.outland ? "<li>The Alliance Shaman and the Horde Paladin use The Burning Crusade’s own figures and counters (7 counters each).</li>" : "") +
            "</ul>",
          src: (c) => J(["Base p.5, p.7–8" + ([2, 3].includes(c.p) ? ", p.3, p.35" : c.p === 5 ? ", p.3, p.36" : ""), c.outland && "The Burning Crusade p.3–4, p.14"]) }
      ]
    },
    {
      title: "Overlord, decks and quests",
      steps: [
        { when: () => true, exp: (c) => (ovOf(c).tbc ? "tbc" : "base"),
          t: (c) => "Set out the Overlord: " + ovOf(c).name,
          d: (c) => {
            const o = ovOf(c);
            let h = "<ul>";
            if (c.outland) h += "<li><b>The Burning Crusade:</b> with Outland in play you must choose one of the three <b>Outland Overlords</b> — Kael’Thas, Lady Vashj or Illidan Stormrage.</li>";
            if (c.nool) h += "<li><b>Without Outland:</b> choose a base-game Overlord or <b>Ragnaros</b> — not an Outland Overlord.</li>";
            h += "<li>Choose the Overlord by consensus or randomly.</li>" +
              "<li>Place " + (o.he === "she" ? "her" : "his") + " sheet next to the board with the <b>“" + c.chars + " Characters”</b> side faceup, and return the other Overlord sheets to the box.</li>";
            const per = {
              kt: "<b>Kel’Thuzad:</b> his sheet (pictured in the base rulebook) has you place his <b>Overlord counter in Stratholme</b> and add his <b>five Kel’Thuzad Event cards</b> to the Event deck (see the Event deck step).",
              nef: "<b>Nefarian:</b> set out his Overlord counter as his sheet directs. In the base game each Event card’s <b>Fate number</b> (0–2, lower right corner) sets how far Nefarian moves after each Event card draw.",
              kaz: "<b>Lord Kazzak:</b> the “elusive” Overlord has <b>five</b> Overlord counters — set them out as his sheet directs.",
              rag: "<b>Ragnaros:</b> his <b>Overlord counter</b> marks where he is on the Lordaeron board, and the <b>Ragnaros token</b> goes on his sheet to track the progress of combat against him. He uses the base-game Overlord rules.",
              kael: "<b>Kael’Thas</b> has no Overlord counter: he waits at the heart of his lair, <b>Tempest Keep</b> (a dungeon on the Outland board).",
              vashj: "<b>Lady Vashj</b> has no Overlord counter: she waits at the heart of her lair, <b>Coilfang Reservoir</b> (a dungeon on the Outland board).",
              illidan: "<b>Illidan Stormrage</b> has no Overlord counter: he waits at the heart of his lair, <b>The Black Temple</b> (a dungeon on the Outland board). Expect a longer, more challenging endgame."
            };
            h += "<li>" + per[o.id] + "</li>";
            if (o.outland) h += "<li>To fight " + (o.he === "she" ? "her" : "him") + ", a group clears Stages 1 and 2 of the lair and then moves onto the Overlord sheet instead of Stage 3 (see “Dungeons” in the reference).</li>";
            h += "<li>Read and follow any further setup instructions on the Overlord sheet.</li>";
            return h + "</ul>";
          },
          src: (c) => {
            const o = ovOf(c);
            const per = { kt: "Base p.8, p.35–36", nef: "Base p.5, p.8, p.26, p.35", kaz: "Base p.5, p.8, p.35", rag: "Base p.8, p.35",
              kael: "Base p.8, p.35", vashj: "Base p.8, p.35", illidan: "Base p.8, p.35" };
            return J([per[o.id], o.id === "rag" && "The Burning Crusade p.4–6, p.19", o.outland && "The Burning Crusade p.4, p.7, p.18",
              c.nool && o.id !== "rag" && "The Burning Crusade p.19"]);
          } },

        { when: () => true, exp: "base",
          t: "Shuffle the Item decks",
          d: (c) => {
            let h = "<ul><li>Sort the <b>Item cards</b> by the symbol on their backs — <b>Triangle</b> (white), <b>Square</b> (blue), <b>Circle</b> (purple) and the <b>Special Item</b> deck (cup). Shuffle each and place it next to the board.</li>";
            if (c.mod("sow-items")) h += "<li><b>Shadow of War:</b> shuffle its new Triangle, Square, Circle and Special Item cards into the matching decks. Its <b>Bonus Item</b> cards (green star backs) form a <b>fifth</b> Item deck.</li>";
            if (c.outland) h += "<li><b>The Burning Crusade:</b> shuffle its new Item cards into their decks and place the new <b>hexagon (orange)</b> Item deck beside the others.</li>";
            return h + "</ul>";
          },
          src: (c) => J(["Base p.8, p.23", c.mod("sow-items") && "Shadow of War p.2–3", c.outland && "The Burning Crusade p.5, p.7"]) },

        { when: () => true, exp: "base",
          t: "Stock the Merchant",
          d: () => "<ul><li>Draw <b>3 Triangle</b> (white), <b>2 Square</b> (blue) and <b>1 Circle</b> (purple) Item cards.</li>" +
            "<li>Stack these six cards <b>faceup</b> on the “Merchant deck” area in the lower right-hand side of the board.</li></ul>",
          src: () => "Base p.8" },

        { when: () => true, exp: "base",
          t: "Build the Quest decks",
          d: (c) => {
            let h = "<ul><li>Each faction takes its <b>40 Quest cards</b> (Alliance and Horde), separates them by difficulty — <b>grey, green, yellow and red</b> — into four decks, shuffles them and places them facedown within reach.</li>";
            if (c.outland) h += "<li><b>The Burning Crusade:</b> shuffle all its new Quest cards (44 Alliance, 44 Horde) into the decks of their colour and place the new <b>purple</b> Quest deck — the hardest quests — next to the others.</li>";
            if (c.nool) h += "<li><b>Without Outland:</b> shuffle the new Quest cards into the decks of their colour — the purple ones form the new <b>purple</b> Quest deck, the hardest quests — but leave out the <b>Outland quests</b> (green background on the card face). If one turns up anyway, remove it from the game and draw a replacement from the same deck.</li>";
            if (c.tbc && !(c.outland && c.mod("sow-blue"))) h += "<li>The Burning Crusade’s blue Quest cards are used only with Shadow of War’s blue quests <i>and</i> the Outland board — leave them in the box.</li>";
            return h + "</ul>";
          },
          src: (c) => J(["Base p.8", c.tbc && "The Burning Crusade p.3, p.5" + (c.outland ? ", p.7" : ", p.19")]) },

        { when: () => true, exp: "base",
          t: "Set out the pieces and take gold",
          d: (c) => {
            let h = "<ul><li>Separate the cardboard and plastic pieces and set them by the board as in “The Play Area” diagram: creature figures, tokens, the <b>" +
              (c.tbc ? "30 dice (10 per colour)" : "21 dice (7 per colour)") + "</b> and the Creature Reference Sheets.</li>" +
              "<li>Each character takes <b>5 gold</b> from the central bank and places it in the gold area of the character sheet.</li>";
            if (c.tbc) {
              h += "<li><b>The Burning Crusade:</b> add its creature figures to the unused creature pile and its <b>9 dice</b>, <b>Poison tokens</b> and extra <b>hit tokens</b> to the supply. Its two new <b>Creature Reference Sheets replace</b> the base game’s — even without Outland.</li>";
              if (c.nool) h += "<li><b>Without Outland:</b> you may leave out the Outland-only figures — <b>Arakkoa, Ravager, Mo’arg, Wrath Guard, Fungal Giant and Shivan</b>. The Yeti, Ooze and Abomination and all the purple figures for the base creature types are used.</li>";
              if (c.outland) h += "<li>Separate each <b>dungeon</b> into its individual <b>Stage decks</b> (Lordaeron dungeons have 2 stages, Outland dungeons 3) and set them on a convenient area of the table. Keep the <b>Flying Mount</b> cards handy (Gryphons for the Alliance, Windriders for the Horde).</li>";
            }
            return h + "</ul>";
          },
          src: (c) => J(["Base p.4–6, p.8", c.tbc && "The Burning Crusade p.3–4, p.6–9" + (c.outland ? ", p.17" : ", p.19")]) },

        { when: () => true, exp: "base",
          t: "Draw the starting quests",
          d: (c) => {
            const g = c.chars === 6 ? 4 : 3;
            let h = "<ul><li>Each faction draws the top <b>" + g + " grey</b> Quest cards and the top <b>1 green</b> Quest card and places them faceup by its side of the board — <b>" + quests(c) + " eligible quests</b> per faction" +
              (c.chars === 4 ? " (four-character games draw one grey card fewer)" : "") + ".</li>" +
              "<li>As each Quest card is drawn, the faction <b>spawns</b> its creatures on the board in the regions shown: the number in the small circle by each creature is how many of that colour to place. <b>Green and red</b>" + (c.tbc ? " (and purple)" : "") + " figures are the quest’s creatures; <b>blue</b> figures are independent creatures.</li>" +
              "<li>Put one of your faction’s <b>Quest tokens</b> in the region with the quest creatures, then place the card faceup with your other quests.</li>" +
              "<li>Return the remaining <b>grey</b> Quest cards to the box — grey quests are starting quests only.</li>";
            if (c.mod("sow-blue")) h += "<li><b>Shadow of War:</b> shuffle the <b>blue Quest deck</b>" +
              (c.outland ? " (with Outland in play, The Burning Crusade’s 18 blue Quest cards are shuffled into it)" : "") +
              ", then draw the top <b>3 blue</b> Quest cards and place them faceup beside the board near the other quests — either faction may complete them. They spawn no creatures." +
              (c.mod("sow-items") ? "" : " Note: blue quests are what mainly reward the <b>Bonus Item</b> cards, which come with Shadow of War’s items part — not selected here.") + "</li>";
            if (c.nool) h += "<li>Without Outland, an Outland quest drawn now is removed from the game and replaced from the same deck.</li>";
            return h + "</ul>";
          },
          src: (c) => J(["Base p.7–8, p.20" + (c.chars === 4 ? ", p.35–36" : ""), c.mod("sow-blue") && "Shadow of War " + (c.mod("sow-items") ? "" : "p.2, ") + "p.3, p.5", c.mod("sow-blue") && c.outland && "The Burning Crusade p.5", c.nool && "The Burning Crusade p.19"]) }
      ]
    },
    {
      title: "Final steps",
      steps: [
        { when: () => true, exp: "base",
          t: "Place the turn marker",
          d: () => "<ul><li>Place the turn marker on space <b>“1”</b> of the turn track.</li></ul>",
          src: () => "Base p.8" },

        { when: () => true, exp: "base",
          t: "Shuffle the Event deck",
          d: (c) => {
            let h = "<ul><li>Shuffle the <b>Event deck</b> and place it facedown next to the board.</li>";
            h += c.ov === "kt"
              ? "<li><b>Kel’Thuzad</b> is the Overlord: his <b>five special Event cards</b> (marked with the Kel’Thuzad symbol) go into the Event deck.</li>"
              : "<li>Kel’Thuzad isn’t the Overlord: <b>remove his five special Event cards</b> (each marked with the Kel’Thuzad symbol).</li>";
            if (c.mod("sow-events")) h += "<li><b>Shadow of War:</b> shuffle in its <b>26 new Event cards</b>.</li>";
            if (c.tbc) h += "<li><b>The Burning Crusade:</b> shuffle in its <b>4 new Event cards</b>." +
              (c.nool ? " Without Outland, note that the pictured cards include The Hellfire War, which needs a character in the Dark Portal (an Outland region), and Rare Goods, which draws from the hexagon Item deck this variant doesn’t set up; the books don’t say to leave any out." : "") + "</li>";
            return h + "</ul>";
          },
          src: (c) => J(["Base p.8, p.35", c.mod("sow-events") && "Shadow of War p.2–3", c.tbc && "The Burning Crusade p.3, p.6" + (c.nool ? ", p.19" : "")]) },

        { when: (c) => c.mod("sow-destiny"), exp: "sow",
          t: "Prepare the Destiny deck (Shadow of War’s 13th step)",
          d: (c) => {
            const base = ["kt", "kaz", "nef"].includes(c.ov);
            return "<ul>" + (base
              ? "<li>Keep only the <b>6 overlord-specific Destiny cards</b> for " + ovOf(c).name + " (his symbol is at the base of the card) and remove the other overlord-specific cards.</li>"
              : "<li>Shadow of War’s overlord-specific Destiny cards carry the symbol of Kel’Thuzad, Lord Kazzak or Nefarian. None corresponds to " + ovOf(c).name + ", so <b>remove all the overlord-specific cards</b> (Shadow of War’s rule applied as written — The Burning Crusade adds no Destiny cards).</li>") +
              "<li>Shuffle the Destiny deck, reveal the top card and put it into play faceup next to the board.</li>" +
              "<li>Check the <b>Destiny Number</b> on the hourglass in its lower left corner:<ul>" +
              "<li><b>0:</b> resolve it immediately and reveal another (repeat while you keep drawing zeros).</li>" +
              "<li><b>1 or more:</b> place a <b>hit token</b> on the turn track that many spaces away from the turn marker. When the marker reaches it, the card expires.</li></ul></li></ul>";
          },
          src: (c) => J(["Shadow of War p.3, p.6–7", ovOf(c).tbc && "The Burning Crusade p.2–3, p.9"]) },

        { when: (c) => c.mod("deadly") || c.mod("dto") || c.mod("sow-redraw"), exp: "var",
          t: "Agree the variants in play",
          d: (c) => "<ul>" +
            (c.mod("deadly") ? "<li><b>Deadly PvP!</b> — in the PvP Resolution step hits aren’t cancelled: each faction takes wounds equal to the tokens in the opponent’s damage box.</li>" : "") +
            (c.mod("dto") ? "<li><b>Defeat the Overlord!</b> — after turn 30 the turn marker returns to space “1” instead of “End”; the game goes on until a faction defeats the Overlord. On the second lap, item icons add a round (purple) Item card to the Merchant instead.</li>" : "") +
            (c.mod("sow-redraw") ? "<li><b>Blue quest redraw</b> (Shadow of War optional rule) — if you draw a blue quest and none of the required creatures are on the board, you may discard it and draw a new one, once per quest.</li>" : "") +
            "</ul>",
          src: (c) => J([(c.mod("deadly") || c.mod("dto")) && "Base p.37", c.mod("sow-redraw") && "Shadow of War p.8"]) },

        { when: () => true, exp: "base",
          t: "Begin — the Horde goes first",
          d: (c) => "<ul><li>The <b>Horde</b> always takes the first faction turn.</li>" +
            "<li>The game runs " + (c.outland ? "until a faction defeats the Overlord — after turn 30 the turn marker loops back to “Start”, and from then on an item icon on the turn track adds the top <b>hexagon (orange)</b> Item card to the Merchant instead of the item shown" :
              c.mod("dto") ? "until a faction defeats the Overlord — the turn track loops after turn 30" :
              "<b>30 faction turns</b> (15 per faction) and ends with the final PvP battle — unless a faction defeats the Overlord first") + ".</li></ul>",
          src: (c) => J(["Base p.8", c.mod("dto") && !c.outland && "Base p.37", c.outland && "The Burning Crusade p.18", c.nool && !c.mod("dto") && "The Burning Crusade p.19"]) },

        { when: (c) => c.mod("first"), exp: "guide",
          t: "First game: recommended heroes and first moves",
          d: (c) => {
            const row = (e) => "<li><b>" + e.hero + "</b> (" + clsName(e.cls) + ") — train " + e.powers + "; first talent " + e.talent + "</li>";
            return "<ul><li>The book recommends these six characters for a first game:<ul>" +
              "<li><b>Alliance</b></li>" + WW.firstGame.A.map(row).join("") +
              "<li><b>Horde</b></li>" + WW.firstGame.H.map(row).join("") + "</ul></li>" +
              (c.chars === 4 ? "<li>The list is for six characters; the book doesn’t say which to drop in a four-character game.</li>" : "") +
              "<li>On each faction’s first turn, let each player take both actions in a row.</li>" +
              "<li>Action 1: a <b>Town</b> action to buy level 1 Power cards — with the 5 starting gold you can usually afford two.</li>" +
              "<li>Action 2: <b>Travel</b> toward a group of your faction’s quest creatures, avoiding regions with blue (independent) creatures.</li></ul>";
          },
          src: () => "Base p.40" }
      ]
    }
  ];

  /* ===========================================================================
     RULES REFERENCE
     =========================================================================== */
  WW.reference = [
    {
      title: "Winning the game",
      when: () => true,
      html: (c) => {
        const o = ovOf(c);
        let h = "<ul><li><b>Defeat the Overlord</b> (" + o.name + "): the first faction to do it wins immediately" +
          ((c.outland || c.mod("dto")) ? "" : " — as long as the turn marker hasn’t entered the “End” space") + ".</li>";
        if (c.outland) {
          h += "<li><b>No turn limit (The Burning Crusade):</b> after turn 30, return the turn marker to the “Start” space and keep playing until the Overlord is defeated. From then on, an item icon on the turn track draws the top <b>hexagon (orange)</b> Item card into the Merchant pile instead of the item shown.</li>" +
            "<li>The Outland Overlords are fought at the end of their lair dungeon — see “Dungeons”." + (c.ov === "illidan" ? " Illidan may make the game longer than the other Outland Overlords." : "") + "</li>";
        } else if (c.mod("dto")) {
          h += "<li><b>Defeat the Overlord! (variant):</b> after turn 30, don’t move the marker into “End” — move it back to space “1”. The game continues until one side defeats the Overlord. On the second lap, an item icon adds a round (purple) Item card to the Merchant instead of the type shown.</li>";
        } else {
          h += "<li><b>Final PvP battle:</b> when the turn marker reaches “End” (after the 30th turn), the normal game is over:<ol>" +
            "<li>The faction with the higher combined XP are the <b>attackers</b> (random if tied).</li>" +
            "<li>Every character regains all Health and Energy up to capacity.</li>" +
            "<li>Starting with the attacking faction, each character may take a final <b>Character Management</b> step.</li>" +
            "<li>Fight one PvP battle involving every character. The faction with surviving characters wins; if both are eliminated at once, the game is a tie" +
            (c.mod("deadly") ? " — under <b>Deadly PvP!</b>, the team with fewer unabsorbed wounds wins (equal = tie)" : "") + ".</li></ol></li>";
        }
        h += "<li>Challenging the Overlord and losing is just a normal defeat; the game goes on.</li>" +
          "<li>The game is " + ((c.outland || c.mod("dto")) ? "as many faction turns as it takes; the turn track has 30 spaces and simply goes round again" : "30 faction turns — 15 per faction") + ".</li></ul>";
        return h;
      },
      src: (c) => J(["Base p.2, p.8, p.34–35", c.mod("dto") && !c.outland && "Base p.37", c.mod("deadly") && !c.outland && !c.mod("dto") && "Base p.37",
        c.outland && "The Burning Crusade p.18", c.nool && "The Burning Crusade p.19"])
    },
    {
      title: "The faction turn",
      when: () => true,
      html: (c) => "<ol>" +
        "<li><b>Character actions.</b> Every character of the active faction takes <b>two actions</b>" + (c.outland ? " (only one for a character who stays in a dungeon — see “Dungeons”)" : "") + ". The faction picks the order freely and may interleave characters (C2, C1, C1, C2, C3, C3 is fine). Flip an Action token after each action.</li>" +
        "<li><b>Character Management.</b> Equip and unequip Power and Item cards between your sheet and your Spellbook/Bag. Normally the only time you may do so" +
        ((c.mod("sow-class") || c.outland) ? " (fast-equip cards are the exception)" : "") + ".</li>" +
        (c.outland ? "<li><b>Dungeon phase (The Burning Crusade).</b> Every active-faction character in a dungeon must fight the boss of the stage they’re next to (characters on the Outland Overlord’s sheet fight the Overlord) — one dungeon at a time, in the order the faction chooses; skipped if nobody is in a dungeon. The book places it after all of the faction’s actions and says that when it ends “the turn marker is moved”, so this page runs it after Character Management.</li>" : "") +
        "<li><b>Advance the turn marker</b> one space." + (c.outland ? " After turn 30 it returns to “Start” (The Burning Crusade)." :
          c.mod("dto") ? " After turn 30 it returns to space “1” (Defeat the Overlord!)." : " Into “End”: the game ends at once and the final PvP battle begins.") + "</li>" +
        (c.mod("sow-destiny") ? "<li><b>Destiny check (Shadow of War).</b> If the marker reaches the Destiny hit token, the Destiny card expires: resolve its expiry text <b>before</b> anything else on that space, discard it (unless it says otherwise) and reveal a new one.</li>" : "") +
        "<li><b>Event card / Merchant check.</b> Event icon on the new space: draw and resolve an Event card. Item icon: draw the top card of that Item deck and put it faceup in the Merchant pile" +
        (c.outland ? " (a hexagon Item after turn 30)" : c.mod("dto") ? " (on the second lap, a round purple Item instead — Defeat the Overlord!)" : "") + ".</li>" +
        (c.outland ? "<li><b>Exchange quests (optional, The Burning Crusade).</b> After advancing the marker, the faction may trade non-Outland quests for Outland quests — see “Outland, flying mounts and level 6”.</li>" : "") +
        "<li>The other faction becomes the active faction.</li></ol>" +
        "<ul><li><b>Faction decisions</b> (action order, who gets which items): if the faction can’t agree, the player whose character has the most XP decides; ties are broken randomly.</li>" +
        "<li><b>Open information:</b> gold, Health, Energy, Bag and Spellbook contents are open to everyone, and anyone may look through the Merchant deck.</li></ul>",
      src: (c) => J(["Base p.7–9, p.12, p.37", c.mod("sow-class") && "Shadow of War p.4", c.mod("sow-destiny") && "Shadow of War p.6–7", c.outland && "The Burning Crusade p.8, p.9, p.13, p.17–18"])
    },
    {
      title: "The five character actions",
      when: () => true,
      html: (c) => "<ul>" +
        "<li><b>Exception — independent creatures:</b> if your region holds blue (independent) creatures, your <b>next action must be a Challenge</b> against one group of them. If you end your second action there and they’re still there, your first action next turn must challenge them (FAQ)." +
        (c.tbc ? " Purple creatures are quest creatures: they never stop movement or force a Challenge." : "") + "</li>" +
        "<li><b>Travel:</b> move up to <b>2</b> adjacent regions. Entering a region with independent creatures ends the move. Never cross a black border, and never enter the enemy’s starting region (Alliance never into Brill, Horde never into Southshore).<ul>" +
        "<li><b>Flight paths:</b> spend one movement step to go from a region with a friendly flight path icon to any other region with one (4 per faction; never enemy flight paths).</li>" +
        (c.outland ? "<li><b>Dungeons:</b> in a region with a dungeon, spend a movement step to enter it — you lose any remaining actions.</li>" +
          "<li><b>To Outland:</b> from a Lordaeron region with a friendly flight path, spend a movement step to go to the Dark Portal region on Outland. Back: from the Dark Portal, one movement step to any friendly flight path region on Lordaeron. The Dark Portal is the only link between the boards.</li>" : "") +
        "</ul></li>" +
        "<li><b>Rest:</b> regain Health and Energy totalling <b>2 × your level</b> (any mix) and remove 1 Curse token. In a region with a friendly town: <b>3 × your level</b> and remove all Curse tokens.</li>" +
        "<li><b>Challenge:</b> fight one group in your region — independent creatures, a group of quest creatures spawned by a <b>friendly</b> quest (never an enemy quest’s), " +
        (c.outland ? "a <b>boss</b> from an Event" + (c.mod("sow-destiny") ? " or the boss of a “Boss” Destiny card" : "") + " (an Outland Overlord is fought in its lair instead — see “Dungeons”)" : "a <b>boss</b> (the Overlord" + (c.mod("sow-destiny") ? ", a boss from an Event, or the boss of a “Boss” Destiny card" : " or a boss from an Event") + ")") + ", or <b>all</b> the enemy characters there (PvP). Invite friendly characters in your region to join; each joiner spends an action (no actions left, no joining).</li>" +
        "<li><b>Training:</b> buy Power cards from your Class deck with a level requirement no higher than your level; pay their gold cost and put them under your Spellbook.</li>" +
        "<li><b>Town</b> (region with a friendly town icon) — any or all, in any order: regain Health and Energy totalling <b>your level</b>; buy and sell Item cards with the Merchant; buy Power cards as in Training." +
        (c.outland ? " Not possible inside a dungeon." : "") + "</li>" +
        "<li><b>Group</b> = all independent creatures of one type in a region, or all quest creatures of one type in a region. A single creature is a group; independent and quest creatures are never grouped together.</li>" +
        "<li><b>Trading:</b> after resolving an action, if you share a region with a friendly character you may give or exchange gold and Bag items. Power cards and soulbound items never change hands.</li></ul>",
      src: (c) => J(["Base p.8–12, p.17, p.35–36 · FAQ p.2–3", c.mod("sow-destiny") && "Shadow of War p.6", c.tbc && "The Burning Crusade p.8" + (c.outland ? ", p.9, p.14, p.16, p.18" : "")])
    },
    {
      title: "Combat against creatures and bosses",
      when: () => true,
      html: (c) => "<p>Only creatures of one type fight in a combat, and quest and independent creatures never fight together. Look up the creature’s Threat, Attack and Health" +
        (c.tbc ? " on The Burning Crusade’s Creature Reference Sheets (they replace the base sheets and make some base creatures tougher)" : " on the Creature Reference Sheet") +
        "; green figures are the weakest of a type, " + (c.tbc ? "purple" : "red") + " the deadliest. A boss’s values and abilities are on its Event card or Overlord sheet" +
        (c.outland ? "; a dungeon boss’s are on its Boss card, enhanced by the Minion cards drawn for that stage and not discarded (see “Dungeons”)" : "") + ".</p>" +
        "<h4>1 · Attack Phase — each participating character in turn</h4><ol>" +
        "<li><b>Dice Pool:</b> collect the dice from every equipped card that says “Add X to your dice pool” (pay any Energy cost now), then roll them all.</li>" +
        "<li><b>Reroll:</b> reroll up to your <b>Reroll value</b> in dice; each die can be rerolled only once.</li>" +
        "<li><b>Place Tokens:</b> each result equal to or higher than the creature’s <b>Threat</b> is a hit:<ul>" +
        "<li><b>blue</b> hit → hit token in the <b>damage</b> box;</li><li><b>red</b> hit → hit token in the <b>defense</b> box;</li><li><b>green</b> hit → <b>armor</b> token in the defense box.</li></ul>" +
        "Then add hit tokens equal to your <b>Attrition value</b> to the <b>attrition</b> box.</li></ol>" +
        "<h4>2 · Defense Phase — once per round</h4><ol>" +
        "<li><b>Ranged Strike:</b> if the damage box holds hits equal to or more than a creature’s Health, discard that many and defeat the creature; repeat. The last creature down ends the combat.</li>" +
        "<li><b>Damage:</b> total Attack of the remaining creatures minus all tokens in the defense box = <b>wounds</b>, shared out among the characters as they agree. If the last character falls, the combat ends and the creatures survive.</li>" +
        "<li><b>Resolution:</b> discard the armor tokens, move the defense-box hits and the attrition-box hits into the damage box, then defeat creatures as in Ranged Strike. Leftover hits stay in the damage box for the next round.</li></ol>" +
        "<ul><li>If both sides remain, start the next round at once.</li>" +
        "<li>Each faction has its own <b>Combat Area</b> (the lower right and upper left corners of the board).</li>" +
        "<li>In a <b>group</b>, each character resolves an Attack Phase in an order agreed at the start of each round; the Defense Phase is resolved once.</li>" +
        "<li>Creature abilities work during <b>each</b> character’s Attack Phase and don’t multiply with the number of creatures unless they say so (FAQ). If a creature’s ability defeats a character at the end of the Reroll step, that character’s other dice are ignored.</li>" +
        "<li><b>Wounds</b> are taken one Health token at a time, so healing can happen in between; you can’t soak up more wounds than it takes to defeat you.</li></ul>",
      src: (c) => J(["Base p.26–31, p.33 · FAQ p.3", c.tbc && "The Burning Crusade p.7–8" + (c.outland ? ", p.10, p.12" : "")])
    },
    {
      title: "Dice, rerolls and card timing",
      when: () => true,
      html: (c) => "<ul>" +
        "<li><b>Dice limit:</b> " + dice(c) + " dice of each colour" + (c.tbc ? " (The Burning Crusade raises the base game’s 7 to 10 — even without Outland)" : "") +
        ". Never substitute one colour for another. If a card would add dice that aren’t physically available, you can’t add them (FAQ).</li>" +
        "<li><b>Changing dice (FAQ):</b> to change a result without changing colour, turn the rolled die. To change its <b>colour</b>, replace it with a die you didn’t roll — no spare die, no change. (You may choose not to roll all your dice to keep one spare.)</li>" +
        "<li><b>Removing dice:</b> a removed die is set aside for the rest of your Attack Phase and can’t be rolled again by later abilities; you can only remove real dice; a spotted die can’t be voluntarily removed, nor a removed die spotted. A die removed by a power (e.g. Earth Shock) can be rolled again next round (FAQ). Dice set aside by the Doom Guard stay out for the whole combat for everyone.</li>" +
        "<li><b>Spotting:</b> each die can be spotted once per round for abilities — except that a creature’s or boss’s ability and a character’s ability may spot the same die.</li>" +
        "<li><b>Card effect limitation (FAQ errata):</b> “A character may only use the abilities of <b>each</b> of his Power, Talent, and Item cards once per combat round.” A card with non-combat effects can be used once per character action. Combat effects (REROLL +1, ATTRITION +1…) last one round. Example: Cleave can’t spot two red 8s for +2 attrition.</li>" +
        "<li><b>“Add X to your dice pool”</b> cards are used at the start of your Dice Pool step.</li>" +
        "<li><b>Instant powers</b> cost their Energy every use, paid before the effect; a card’s secondary abilities are free once the first ability’s cost is paid.</li>" +
        "<li><b>Simultaneous effects:</b> the active character chooses the order; with no active player (e.g. the Defense Phase), the active faction decides" + (c.outland || c.mod("dto") ? "" : "; in the final PvP battle, randomly pick which faction decides each conflict") + ".</li>" +
        "<li><b>Dice symbols:</b> blue, red or green die = that colour; <b>black</b> = any colour; <b>two-coloured</b> = either colour; a <b>number inside</b> = that result on that colour; a <b>“+”</b> = that result or higher.</li>" +
        "<li><b>FAQ:</b> “the previous combat round” means the round just before this one, in this combat. A “rolled result” is a die’s current result, rerolls included.</li>" +
        "<li><b>Friendly participating character</b> includes you — and you must be in the combat to use such an ability.</li></ul>",
      src: (c) => J(["Base p.15–19, p.27–29, p.37 · FAQ p.1–3", c.tbc && "The Burning Crusade p.8"])
    },
    {
      title: "PvP combat",
      when: () => true,
      html: (c) => "<ul>" +
        "<li><b>When:</b> a Challenge against <b>all</b> enemy characters in your region (you can’t single one out and they can’t refuse)" + (c.outland || c.mod("dto") ? "" : ", or the final battle at “End”") + "." +
        (c.outland ? " There is <b>no PvP inside dungeons</b>." : "") + "</li>" +
        "<li>The challengers are the <b>attackers</b>. Attack Phases <b>alternate</b> between factions, attackers first; each faction chooses its own order.</li>" +
        "<li><b>Threat</b> = the highest level among the opposing characters <b>+ 2</b>" + (c.outland ? " (a faction’s Threat is never more than <b>7</b>, however many level 6 characters it has)" : "") + ". Each faction uses its own Combat Area.</li>" +
        "<li><b>Defense Phase — both factions at once:</b><ol>" +
        "<li><b>Armor:</b> each faction removes all its armor tokens. <b>For each armor token removed</b>, remove one enemy hit from their damage <i>or</i> defense box <b>and</b> one from their attrition box (reference card errata, FAQ). Spare armor is wasted.</li>" +
        "<li><b>Ranged Strike:</b> each faction removes its own damage-box hits; the other faction takes one wound per hit, shared out as it chooses.</li>" +
        "<li><b>Resolution:</b> move attrition and defense hits into the damage box" +
        (c.mod("deadly") ? ". <b>Deadly PvP!</b> — no cancelling: each faction takes wounds equal to all the tokens in the opponent’s damage box." :
          ", then remove one token from each side at a time; the side that runs out first takes a wound for each token the other side has left.") + " Then clear both Combat Areas.</li></ol></li>" +
        "<li>Keep going round by round until all the characters of one or both factions are defeated. A faction whose last character falls ends the combat at once.</li>" +
        "<li><b>Loot:</b> the winners may take one item from the <b>Bag</b> (not the sheet) of each defeated enemy, shared as they agree; defeated winners take no loot; refused loot goes back. With a full Bag, drop something or drop the loot — dropped items go to the Merchant deck (FAQ).</li>" +
        "<li><b>Mutual defeat:</b> no winner and no loot; randomise the order in which characters go to graveyards or starting regions." +
        (c.mod("deadly") ? " Under <b>Deadly PvP!</b>, when every character falls in the same step, the team with fewer unabsorbed wounds counts as the winner " + (c.outland || c.mod("dto") ? "for Event cards that ask" : "for the final PvP battle and for Event cards that ask") + " (equal = tie)." : "") + "</li>" +
        "<li>Defeating enemy characters gives <b>no XP</b>.</li>" +
        (c.mod("deadly") ? "" : "<li>PvP too slow? The FAQ suggests the <b>Deadly PvP!</b> variant.</li>") + "</ul>",
      src: (c) => J(["Base p.33–34, p.37, p.40 · FAQ p.1, p.3", c.outland && "The Burning Crusade p.14, p.16, p.18"])
    },
    {
      title: "Quests, experience and levels",
      when: () => true,
      html: (c) => "<ul>" +
        "<li><b>Decks:</b> grey (level 1 — setup only), green (levels 2–3), yellow (3–4), red (4–5)" + (c.tbc ? ", and The Burning Crusade’s <b>purple</b> deck, harder than red" : "") + ". Each faction keeps <b>" + quests(c) + "</b> quests faceup.</li>" +
        "<li><b>New quests</b> are drawn after completing one (the faction chooses green, yellow" + (c.tbc ? ", red or purple" : " or red") + ") or when an Event says so. Each spawns its creatures at once — remember the Quest token.</li>" +
        "<li><b>Completing:</b> whoever defeats the <b>last</b> remaining quest creature of a card completes it and takes the whole reward; partial progress earns nothing.</li>" +
        "<li><b>Rewards:</b> gold, XP and items. Each item symbol shows a Draw Number (1–3): draw that many from that deck, keep one, put the rest facedown on the bottom; resolve symbols one at a time in order. A special item in red bold is searched for in the Special Item (cup) deck.</li>" +
        "<li><b>Groups:</b> split gold and XP as evenly as possible; leftovers go to the character(s) with the fewest XP (ties random); share items by agreement. A character defeated in the fight still gets an equal XP share if the group completes the quest — but no gold or items.</li>" +
        "<li><b>XP penalty:</b> quest level lower than your level → subtract the difference from the XP that quest gives you (down to 0 — you never lose XP you already have). <b>XP bonus:</b> quest level higher → gain the difference, but only one character in a group gets it (the one with the fewest XP; ties random).</li>" +
        "<li><b>Running out of figures:</b> no independent figure left → skip that spawn. If even one of a quest’s quest creatures can’t be placed because all those figures are in use → spawn nothing from that card (not even its independent creatures), put it facedown at the bottom of its deck and draw another. (Base p.22’s next sentence says such a quest “should be discarded” instead; this page follows the step-by-step procedure.)</li>" +
        "<li><b>Levels:</b> move your token along the Experience Track; reaching or passing a “Level” space gains that level at once: (1) move the token on your sheet’s Level track, (2) regain all Health and Energy up to the new capacity, (3) choose a <b>Talent</b> card of your new level or lower and place it under the matching Talent bar.</li>" +
        "<li>Maximum level is <b>" + maxLvl(c) + "</b>" + (c.outland ? " (The Burning Crusade) — at level 6, XP you would gain becomes the same amount of gold (after any penalty), and you receive a Flying Mount card." : "; after that, more XP brings no benefit.") + "</li>" +
        "<li>No XP for defeating enemy characters or independent creatures" + (c.mod("sow-blue") ? " — except through blue quests" : "") + ".</li>" +
        "<li><b>Quest errata (FAQ):</b> the red Horde quest “Brutes in the Barrows” should say “The Infectis Scar”, not “Hearthglen” (the mini-maps are right)." +
        (c.tbc ? " The Burning Crusade’s red Horde quest “A Sample of Slime” should show 1 green Ooze and 1 purple Ooze, both in The Sepulcher (not Agmand Mills)." : "") + "</li></ul>",
      src: (c) => J(["Base p.7, p.17–18, p.20–23, p.40 · FAQ p.1" + (c.tbc ? ", p.4" : ""), c.chars === 4 && (c.p === 2 ? "Base p.35" : "Base p.36"), c.mod("sow-blue") && "Shadow of War p.5", c.tbc && "The Burning Crusade p.5" + (c.outland ? ", p.15–16" : "")])
    },
    {
      title: "Character sheet, powers and items",
      when: () => true,
      html: (c) => "<ul>" +
        "<li><b>Card areas:</b> one card per area (plus add-ons). The icons above an area say which card <b>types</b> fit; Item cards must also match one of its <b>traits</b> (“All” = any trait). Power cards only need the type — e.g. the Druid’s Bear Form fits a “mace or sword” melee area (FAQ). Warrior Stance powers go only in the Stance-only area.</li>" +
        "<li>You can’t equip a card above your level (you may carry it). A card placed over a preprinted card replaces it; uncover the preprinted card and it works again.</li>" +
        "<li><b>Card types:</b> melee (usually red dice), ranged (blue), armor (green), general items, <b>Bag items</b> (used straight from the Bag, never equipped — still not above your level), <b>instant powers</b> (pay Energy each use) and <b>active powers</b> (pay the Energy when equipped, then free).</li>" +
        "<li><b>Add-on items</b> (“+” before the type icon): traits read function – normal (e.g. Helmet – Leather); they must match the area’s normal trait (FAQ: the Hunter can’t wear the mail Thorium Helm); they sit on top of an area’s normal item; any number per area but only one of each function.</li>" +
        "<li><b>Unique categories</b> (e.g. Paladin Aura, Blessing and Seal; Warlock Demon): only one equipped Power card per category. Talents have no category (FAQ).</li>" +
        "<li><b>Pets and Demons:</b> place Health tokens on the card equal to its Health capacity; you may take a wound on it instead of yourself; at 0 it goes back to your Spellbook (re-equip later, paying its Energy). Defeat unequips it. Pets heal only through Mend Pet or by unequipping and re-equipping in Character Management (FAQ).</li>" +
        "<li><b>Bag:</b> up to <b>3</b> items" + (c.mod("sow-items") ? " — plus up to <b>7 Bonus Items</b> (Shadow of War)" : "") + ". Over the limit, put one (new or old) into the Merchant deck for nothing — the only way to discard an item. Equipping from a full Bag, you may swap the Bag item straight with the one on your sheet (FAQ). The Spellbook has no limit.</li>" +
        ((c.mod("sow-class") || c.outland) ? "<li><b>Fast-equip</b> (Spellbook icon in the card’s upper right): at the start of any of your actions — including a Challenge or joining one — you may equip the card from your Spellbook" + (c.outland ? " or Bag" : "") + ", paying an active power’s Energy and matching the area; " + (c.outland && c.mod("sow-class") ? "to make room, a Shadow of War power may replace one equipped <b>power</b>, while a Burning Crusade fast-equip card may replace any card (even one without the icon)" : c.outland ? "to make room you may unequip any card (even one without the icon)" : "to make room you may unequip one equipped <b>power</b>") + ".</li>" : "") +
        "<li><b>Gain vs regain:</b> “regain” stops at your capacity; “gain” may exceed it for the ability’s duration. If a capacity boost ends, remove the excess at once.</li>" +
        "<li><b>Merchant:</b> on a Town action, look through the Merchant deck and buy any number of items (pay the gold cost; higher-level items allowed); sell any number from your sheet or Bag for <b>half their value, rounded up</b>. Power cards and soulbound items can never be sold; soulbound items can’t be given away either.</li>" +
        "<li><b>Item errata (FAQ):</b> Pyric Caduceus has the ranged icon, not melee; Crackling Staff works at the “End of your Dice Pool step”, not the end of the Reroll step; of the two “Scroll of Lesser Strength” cards, the one adding two blue dice is “Scroll of Lesser Spirit”.</li></ul>",
      src: (c) => J(["Base p.3, p.12–17, p.19, p.23–24 · FAQ p.1–3", c.mod("sow-class") && "Shadow of War p.4", c.mod("sow-items") && "Shadow of War p.5", c.outland && "The Burning Crusade p.8"])
    },
    {
      title: "Events, wars and auctions",
      when: () => true,
      html: (c) => "<ul>" +
        "<li>When the turn marker enters an <b>Event</b> icon space, draw an Event card, read it aloud and resolve it; it stays faceup by the board until its requirements are met, then it’s discarded.</li>" +
        "<li><b>Bonus Events</b> (“+” at the bottom): resolve and discard (unless the card says otherwise), then draw another. Stop when you draw a normal Event, or a Bonus Event with the same title as one already drawn this step (discard that one without effect).</li>" +
        "<li><b>Auction House:</b> everyone announces their gold, then bids secretly in a closed fist; reveal together. The highest bidder pays and takes the Auction Item; ties are settled randomly (everyone bidding 0 is a tie — FAQ). Auction Items aren’t normal items (not in the Bag; they sit in front of you) and are all discarded if their owner is defeated.</li>" +
        "<li><b>Stronger / weaker faction:</b> the faction with more combined XP is stronger; if tied, both count as stronger.</li>" +
        "<li><b>Wars:</b> put a matching pair of War tokens on the two named regions. A faction with characters in both at the end of its enemy’s faction turn wins the reward; then remove the tokens and discard the card.</li>" +
        (c.outland ? "<li><b>Bosses</b> from Events are fought with a Challenge in their region (an Outland Overlord is fought in its lair — see “Dungeons”)."
          : "<li><b>Bosses</b> from Events — and the Overlord — are fought with a Challenge in their region.") +
        " The book recommends marking an Event boss’s region with a <b>Point of Interest</b> token.</li>" +
        "<li>The <b>Fate number</b> (0–2) in each Event card’s lower right corner sets how far Nefarian moves after each Event card draw.</li>" +
        (c.ov === "kt" ? "<li><b>Kel’Thuzad’s</b> five special Event cards are in the deck this game.</li>" : "") +
        (c.mod("sow-events") ? "<li>Shadow of War’s Event cards work exactly like the base game’s.</li>" : "") + "</ul>",
      src: (c) => J(["Base p.8, p.24–26 · FAQ p.3", c.mod("sow-events") && "Shadow of War p.2", c.outland && "The Burning Crusade p.18"])
    },
    {
      title: (c) => (c.tbc ? "Defeat, Stun, Curse and Poison" : "Defeat, Stun and Curse"),
      when: () => true,
      html: (c) => "<ul>" +
        "<li><b>Defeat:</b> after removing your last Health token you get one last chance to gain or regain Health (potions, heals). If you can’t:<ol>" +
        "<li>move your figure to the <b>nearest graveyard</b> (not one in the region where you fell) or to your faction’s <b>starting region</b> — your choice" +
        (c.outland ? "; never to the other game board" : "") + ";</li>" +
        "<li>reset to exactly <b>1 Health and 1 Energy</b>;</li>" +
        "<li>lose any remaining actions. You may also remove all your Curse tokens; your pet or demon is unequipped; your Auction Items are discarded.</li></ol></li>" +
        (c.outland ? "<li><b>Defeated in a dungeon:</b> move to the nearest graveyard or friendly town on the same board as the dungeon.</li>" : "") +
        "<li>Brought back by the Priest’s Resurrection or the Shaman’s Reincarnation? Treat it as a defeat: you lose your remaining actions, get no gold or items from that quest (XP yes) and may be looted if your faction loses the PvP combat you were fighting in (FAQ).</li>" +
        "<li><b>Stun</b> (mainly Spiders): for each Stun token, remove <b>2 dice</b> of your choice before rolling each round; if you can’t, you’re defeated before the Reroll step. Remove Stun tokens when the combat ends or you’re defeated.</li>" +
        "<li><b>Curse</b> (mainly Wraiths): for each Curse token, remove <b>1 die</b> before rolling and suffer REROLL −1 and ATTRITION −1. Curses stay after combat: a Rest removes one (all in a friendly town) and defeat removes them all. Unable to remove a die? You are <b>not</b> instantly defeated (FAQ).</li>" +
        (c.tbc ? "<li><b>Poison</b> (The Burning Crusade): at the start of each Damage step lose 1 Health per Poison token (a pet or demon may take some). Poison tokens go when the combat ends or you’re defeated.</li>" : "") +
        "<li><b>Component limits:</b> only the dice and the creature figures are limited — substitute anything else" + (c.tbc ? " (out of hit tokens? use gold tokens)" : "") + ".</li></ul>",
      src: (c) => J(["Base p.17, p.25–26, p.36–37 · FAQ p.2–3", c.tbc && "The Burning Crusade p.4, p.8" + (c.outland ? ", p.12, p.16" : "")])
    },
    {
      title: (c) => "The Overlord: " + ovOf(c).name,
      when: () => true,
      html: (c) => {
        const o = ovOf(c);
        let h = "<ul><li>Its sheet shows its <b>combat values</b>, its <b>special abilities and combat rules</b>, and its <b>setup and special rules</b>; use the side for your number of characters (" + c.chars + " here). The first faction to defeat it wins.</li>";
        const per = {
          kt: "<li><b>Kel’Thuzad:</b> his five special Event cards are shuffled into the Event deck; the sheet pictured in the rulebook starts his counter in Stratholme. Shown there: his four-character side; the six-character side is tougher.</li>",
          nef: "<li><b>Nefarian:</b> moves after every Event card draw by that card’s Fate number (0–2).</li>" +
            "<li><b>FAQ:</b> under Nefarian’s ability you may place only as many hits in the damage or defense boxes as you rolled blue and red 8s, the rest going to the attrition box — but you choose which hits those are (two blue 8s and two red 7s: the red hits may go in the defense box and the blue hits in the attrition box).</li>",
          kaz: "<li><b>Lord Kazzak:</b> represented by five Overlord counters — follow his sheet for how they’re used.</li>",
          rag: "<li><b>Ragnaros (The Burning Crusade):</b> his counter marks his location on the Lordaeron board; the Ragnaros token on his sheet tracks the progress of combat against him. Otherwise the base-game Overlord rules apply.</li>",
          kael: "", vashj: "", illidan: ""
        };
        h += per[o.id];
        if (o.outland) {
          h += "<li><b>Outland Overlord:</b> no counter and no travelling to fight " + (o.he === "she" ? "her" : "him") + ". " + o.name + "’s lair is <b>" + o.lair + "</b> (dungeon symbol in the sheet’s top left corner).</li>" +
            "<li>Characters who defeat <b>Stage 2</b> of the lair move onto the <b>Overlord sheet</b> instead of the Stage 3 deck. No dungeon cards are drawn (no minions, items or rewards); the Overlord is fought normally in the next Dungeon phase, and anyone defeated follows the dungeon defeat rules. Win that fight and your faction wins.</li>";
          if (o.id === "illidan") h += "<li><b>You Are Not Prepared!</b> Illidan is the most powerful enemy in the game — gather the best Power, Talent and Item cards first. He can make the game longer than the other Outland Overlords.</li>";
        } else {
          h += "<li>Challenge it like any boss when you share its region; friendly characters there may join.</li>";
        }
        h += "<li>Lose to it and you are simply defeated, as against any creature or boss.</li></ul>";
        return h;
      },
      src: (c) => {
        const o = ovOf(c);
        return J(["Base p.4, p.9, p.35–36", o.id === "nef" && "Base p.26 · FAQ p.3", o.id === "kaz" && "Base p.5", o.id === "kt" && "Base p.8",
          o.id === "rag" && "The Burning Crusade p.4–6", o.outland && "The Burning Crusade p.4, p.14, p.18"]);
      }
    },
    {
      title: "Shadow of War — new rules",
      when: (c) => c.sow,
      html: (c) => "<ul>" +
        "<li>The expansion is designed to be used whole, but you may use only some of its cards (e.g. just the powers and talents, or just the items). Its cards carry a broken-shield symbol." + (c.tbc ? " All of it works with The Burning Crusade too." : "") + "</li>" +
        (c.mod("sow-class") ? "<li><b>New powers and talents:</b> 10 + 10 per class, same rules as the base cards. Cards with the <b>Spellbook icon</b> can be fast-equipped at the start of any of your actions (including a Challenge or joining one): the card must be in your Spellbook, you pay an active power’s Energy, the type must match the area, and you may unequip one power to make room. Some talents let you equip at other times (e.g. the Warrior’s Tactical Mastery: “Start of the combat round: You may equip one power”).</li>" : "") +
        (c.mod("sow-items") ? "<li><b>Bonus Item cards</b> (green star backs, a fifth deck): they don’t count toward the 3-item Bag limit — you may hold up to <b>7 Bonus Items</b> as well; an eighth sends one Bonus Item (new or old) to the Merchant deck for nothing.</li>" +
          "<li><b>Experience Reward cards</b> (in the Bonus Item deck) aren’t Item cards: take the XP at once (a group splits it normally), then discard the card. Defeated characters can still receive this XP; a full Bag doesn’t matter.</li>" : "") +
        (c.mod("sow-blue") ? "<li><b>Blue quests:</b> three are always faceup; either faction may complete any of them; they spawn no creatures and aren’t tied to a region. Complete one by defeating a <b>blue (independent)</b> creature of one of the two types shown on the card.</li>" +
          "<li>Rewards come only after the whole combat is resolved; one combat can complete several blue quests (one per matching creature defeated — you pick which quest); extra kills don’t carry over to a newly drawn quest. Then draw replacements. Blue quests have no target level, so no XP penalties or bonuses. Out of blue quests? Shuffle the discards into a new deck.</li>" +
          (c.mod("sow-redraw") ? "<li><b>Optional rule in use:</b> if you draw a blue quest and none of its creatures are on the board, you may discard it and draw a new one — once per quest.</li>" : "") : "") +
        (c.mod("sow-events") ? "<li><b>New events</b> work exactly like the base game’s.</li>" : "") +
        (c.mod("sow-destiny") ? "<li><b>Destiny cards:</b> always exactly one in play. Its <b>Destiny Number</b> (hourglass, lower left) is how many turns it stays: put a hit token that many spaces ahead on the turn track. When the marker reaches it the card <b>expires</b> — resolve its expiry text before anything else on that space, discard it (unless it says otherwise) and reveal the next. A “Boss” Destiny card is discarded when that boss is defeated; if a card is discarded early, remove its hit token. A zero means resolve it now and draw again.</li>" +
          "<li>If an effect moves the turn marker several spaces, ignore the icons on the spaces it passes over — only the space it stops on counts.</li>" : "") +
        (c.mod("sow-class") ? "<li><b>Errata (FAQ):</b> the Priest’s Unbreakable Will should read “Place 1 armor token in the defense box for each blue 8 you spot.”</li>" : "") + "</ul>",
      src: (c) => J(["Shadow of War p.2–8", c.tbc && "The Burning Crusade p.9", c.mod("sow-class") && "FAQ p.3"])
    },
    {
      title: "The Burning Crusade — new rules",
      when: (c) => c.tbc,
      html: (c) => "<ul>" +
        "<li><b>Purple creatures</b> are the deadliest version of each type. They’re quest creatures: they never stop movement or force a Challenge. Nine new creature types appear through quests and events as usual.</li>" +
        "<li><b>New Creature Reference Sheets</b> replace the base ones (even without Outland): they add the new types and purple versions and make some green, red and blue base creatures tougher.</li>" +
        "<li><b>Poison:</b> at the start of each Damage step, lose 1 Health per Poison token (you may take some from a pet or demon). Removed at the end of combat or on defeat.</li>" +
        (c.outland ? "<li><b>Fast-equip powers and items</b> (Spellbook icon): at the start of any of your actions, equip from your Spellbook or Bag into any legal area, or replace a card already there. Normal costs and restrictions apply.</li>" : "") +
        "<li><b>Dice limit 10</b> per colour (3 extra dice of each colour), even without Outland. Extra hit tokens are included; if you still run out, use gold tokens.</li>" +
        (c.outland ? "<li><b>Hexagon (orange) items</b> come mainly from Outland quests and Outland dungeons; they work like other items.</li>" : "") +
        (c.nool ? "<li><b>Without Outland:</b> choose a base Overlord or Ragnaros; no level 6 (Lordaeron’s Experience Track), so none of the expansion’s Power and Talent cards — they are all level 6; no Outland quests; " +
          (c.mod("dto") ? "the normal ending (here replaced by the Defeat the Overlord! variant)" : "normal 30-turn ending with the final PvP battle") + ". The variant doesn’t mention the Lordaeron dungeons, the replacement Paladin/Shaman sheets or the new Item cards — this page leaves them out (see setup).</li>" : "") +
        "<li><b>Errata (FAQ):</b> " + (c.outland ? "the Warlock talent Soul Leech should read “End of your Reroll step: Gain 1 Health for each red or blue 8 you Spot. After Combat, you must immediately lose any Health in excess of your capacity.” On" : "on") +
        " the Creature (Monster) Reference Sheet, the Wrathguard’s ability timing is “End of each Damage step”, not “Start of each Resolution step”." +
        (c.outland ? " New Shaman sheet: the Horde racial is “Bloodfury: ATTRITION +1” and Lightning Bolt costs 1 Energy (or use the old Orc Shaman sheet); the Draenei Shaman’s Lightning Bolt costs 1 too." : "") + "</li></ul>",
      src: (c) => J(["The Burning Crusade p.3–5, p.8" + (c.nool ? ", p.16, p.19" : ""), "FAQ p.4", c.nool && c.mod("dto") && "Base p.37"])
    },
    {
      title: "Dungeons (The Burning Crusade)",
      when: (c) => c.outland,
      html: () => "<table class='ref-table'><thead><tr><th>Dungeon</th><th>Where</th><th>Stages</th><th>Level on key*</th></tr></thead><tbody>" +
        "<tr><td>Shadowfang Keep</td><td>Olsen’s Farthing (Silverpine Forest)</td><td>2</td><td>II</td></tr>" +
        "<tr><td>The Scarlet Monastery</td><td>Scarlet Monastery (Tirisfal Glades)</td><td>2</td><td>III</td></tr>" +
        "<tr><td>Stratholme</td><td>Stratholme (Eastern Plaguelands)</td><td>2</td><td>IV</td></tr>" +
        "<tr><td>Scholomance</td><td>Caer Darrow (Western Plaguelands)</td><td>2</td><td>IV</td></tr>" +
        "<tr><td>Tempest Keep</td><td>Outland — Kael’Thas’s lair</td><td>3</td><td>VI</td></tr>" +
        "<tr><td>Coilfang Reservoir</td><td>Outland — Lady Vashj’s lair</td><td>3</td><td>VI</td></tr>" +
        "<tr><td>The Black Temple</td><td>Outland — Illidan Stormrage’s lair</td><td>3</td><td>VI</td></tr></tbody></table>" +
        "<p class='ref-note'>*Each Stage deck’s level is printed at the bottom left of its card back (the stage number is at the bottom right) — check the deck in front of you. The back-cover key pictures one card back per dungeon, with the level shown here; it doesn’t list every stage. The book confirms that Tempest Keep’s three stages are all level VI (p.9) and that the Scarlet Monastery Stage 1 deck is level III (p.12).</p>" +
        "<h4>Entering</h4><ul>" +
        "<li>In a dungeon’s region, spend one movement step of a Travel action to enter: your figure leaves the board and stands by the <b>Stage 1</b> deck — or, if friendly characters are already inside, by their Stage deck (you can’t redo stages they’ve beaten). You <b>lose any remaining actions</b>.</li>" +
        "<li>Anyone next to a Stage deck or on an Overlord sheet is “in a dungeon”.</li></ul>" +
        "<h4>Dungeon phase — resolving a stage</h4><ol>" +
        "<li>After all of the active faction’s actions, before the turn marker moves: shuffle the Stage deck and draw cards one by one until a <b>Boss</b> card appears.</li>" +
        "<li>Set aside the <b>Item</b> and <b>Reward</b> cards drawn (the bounty). Count the <b>Minion</b> cards: if there are more than <b>2 per participating character</b>, the group may discard minions of its choice, one at a time, down to that limit (optional — it may discard fewer or none).</li>" +
        "<li>A group that discarded no minions may <b>push its luck</b>: draw more cards one at a time (a second Boss is discarded). These can’t be discarded even if the minion count goes over the limit.</li>" +
        "<li>Fight the boss with the normal combat rules; every minion adds its effects (“Attack +2”, “Health +2”…) — all cumulative, and the whole thing counts as <b>one opponent</b>. Friendly characters in the same dungeon all take part automatically.</li>" +
        "<li><b>Win:</b> distribute the boss’s reward (plus minion gold and XP) by the normal quest rules; share out the Item cards; Reward cards help everyone and are resolved at once, then go back into their Stage deck (unless “keep this card”). The revealed Boss and Minion cards also return to the Stage deck (as in the book’s example). Then move everyone to the next Stage deck — or, after the last stage, out to any region with a friendly flight path on the same board.</li></ol>" +
        "<ul><li><b>One stage per Dungeon phase</b> (unless an ability says otherwise): the next stage waits for your next Dungeon phase.</li>" +
        "<li><b>XP penalty:</b> split the XP as evenly as possible among all participants, as usual; then each character of a <b>higher level than the stage level</b> loses their share (<b>no XP</b>, and it isn’t passed to the others). There’s no bonus for lower-level characters.</li>" +
        "<li><b>Defeated</b> characters go to the nearest graveyard or friendly town on the same board. If everyone is defeated, the Boss and all faceup Minion, Item and Reward cards are shuffled back into the Stage deck. If some survive and win, the defeated still get their XP share — but no gold, Reward or Item cards.</li>" +
        "<li><b>Lair:</b> beating Stage 2 of the Overlord’s lair sends the group onto the Overlord sheet instead of Stage 3.</li></ul>" +
        "<h4>Actions while in a dungeon</h4><ul>" +
        "<li>Staying in a dungeon, you get only <b>one</b> action per faction turn: Rest or Training as normal; Travel to leave (one movement step to the dungeon’s region, then carry on — not if an independent creature is there; challenge it instead); or a Challenge against a creature, boss or enemy in the dungeon’s region (friendly characters there or in the dungeon may join). No Town actions.</li>" +
        "<li>Leaving the dungeon, you take the normal two actions that turn (the first being the Travel to leave or a Challenge in the region).</li>" +
        "<li>A stage you’ve beaten can’t be tried again on the same visit. Leave and come back and you start at Stage 1 (unless friendly characters are inside).</li>" +
        "<li>No PvP inside dungeons. Event and Destiny cards affect characters in dungeons.</li>" +
        "<li>Alone in a dungeon, you must face the boss alone in your Dungeon phase unless you leave — ask friends to come and help.</li></ul>",
      src: () => "The Burning Crusade p.7, p.9–15, p.18 · The Burning Crusade back cover"
    },
    {
      title: "Outland, flying mounts and level 6 (The Burning Crusade)",
      when: (c) => c.outland,
      html: () => "<ul>" +
        "<li><b>Outland</b> has seven areas divided into regions, like Lordaeron. The <b>Dark Portal</b> region is the only link: a Travel action from a Lordaeron region with a friendly flight path spends one movement step to reach it (and back from the Dark Portal to any friendly flight path region on Lordaeron). Defeated characters never change boards.</li>" +
        "<li><b>Secluded regions</b> (six unnamed regions ringed by black borders) can be entered only with a flying mount; independent creatures are never placed or moved there.</li>" +
        "<li><b>Outland quests</b> (green background on the card face) always spawn on the Outland board; they’re found in every Quest deck colour except grey.</li>" +
        "<li><b>Exchanging quests:</b> after advancing the turn marker, a faction may discard any non-Outland quests (return them to the box and remove their quest creatures — not the blue ones). Replace each by drawing from a deck of its choice (green, yellow, red or purple) one card at a time: non-Outland cards drawn are removed from play; switch decks only if one runs out. An Outland quest drawn this way spawns its quest creatures but <b>not</b> its independent creatures. Best done late in the game — and during your opponents’ turn to save time.</li>" +
        "<li><b>Level 6:</b> use the Outland board’s Experience Track. Your class extension adds the level 6 Health and Energy capacities, <b>two extra Power card areas usable from the start</b>, and a level 6 Talent bar. On reaching level 6, choose a Talent for that bar and take your faction’s <b>Flying Mount</b> card. At level 6, XP becomes gold. In PvP a faction’s Threat is never above 7.</li>" +
        "<li><b>Flying mounts</b> (Gryphon for the Alliance, Windrider for the Horde) aren’t items or powers and can never be lost, sold, traded, stolen or discarded. On Outland only: enter secluded regions; move up to <b>3</b> regions per Travel action; pass through regions with blue creatures without stopping or challenging (but then 3 regions is the absolute maximum). No effect on Lordaeron.</li></ul>",
      src: () => "The Burning Crusade p.5, p.14–18"
    },
    {
      title: "Players and characters",
      when: () => true,
      html: (c) => "<ul>" +
        "<li><b>This game:</b> " + WW.teams[c.p] + ".</li>" +
        "<li>Four-character games (2–4 players): each faction draws 3 grey + 1 green starting quests and keeps <b>4</b> eligible quests. Six-character games: 4 grey + 1 green, <b>5</b> quests.</li>" +
        "<li>The Overlord sheet side matches the number of <b>characters</b> (4 or 6), not players.</li>" +
        "<li>3 and 5 players: the player running two characters (same faction) may not choose both the Paladin and the Shaman" +
        (c.outland ? " (a base-game rule The Burning Crusade doesn’t revisit)" : "") + ".</li>" +
        "<li>Each faction plays as a team: when it can’t agree, the player whose character has the most XP decides (ties random).</li></ul>",
      src: () => "Base p.7–8, p.35–36"
    },
    {
      title: "Your heroes — class notes",
      when: (c) => c.anyCls,
      html: (c) => {
        const order = WW.classes.map((k) => k.id).filter((id) => c.cls(id));
        return order.map((id) => {
          const n = WW.classNotes[id];
          const f = c.cls(id) === "A" ? "Alliance" : "Horde";
          return "<h4>" + clsName(id) + " · " + f + "</h4><ul>" + n(c).map((x) => "<li>" + x + "</li>").join("") + "</ul>";
        }).join("");
      },
      src: (c) => {
        const ids = WW.classes.map((k) => k.id).filter((id) => c.cls(id));
        const s = new Set(["Base p.14–17"]);
        ids.forEach((id) => (WW.classSrc[id] || []).forEach((x) => s.add(typeof x === "function" ? x(c) : x)));
        return J([...s].filter(Boolean));
      }
    },
    {
      title: "First game guide",
      when: (c) => c.mod("first"),
      html: (c) => {
        const row = (e) => "<li><b>" + e.hero + "</b> (" + clsName(e.cls) + "): " + e.powers + " · first talent " + e.talent + "</li>";
        return "<h4>Recommended characters, first powers and first talent</h4><ul><li><b>Alliance</b><ul>" + WW.firstGame.A.map(row).join("") + "</ul></li><li><b>Horde</b><ul>" + WW.firstGame.H.map(row).join("") + "</ul></li></ul>" +
          "<h4>Tips from the book</h4><ul>" +
          "<li>First faction turn: each player simply takes both actions in a row. Start with a <b>Town</b> action to train (5 gold buys about two level 1 powers), then <b>Travel</b> toward friendly quest creatures, avoiding blue creatures.</li>" +
          "<li>Next turn some characters should be able to complete a first quest; a quest or two should bring level 2.</li>" +
          "<li><b>Can I survive this fight?</b> Look at the creature’s Attack first. A level 1 character usually beats a single Murloc, Gnoll, Ghoul or Scarlet Crusader. Beware any group of two or more quest creatures, and any creature listed below the Ghoul/Scarlet Crusader on the reference sheet. In doubt, invite a friend in the region.</li>" +
          "<li>Group fights are safer but split the rewards — deciding when to group is one of the game’s key decisions.</li>" +
          "<li>Levelling up refills all your Health and Energy — it can save several Rest actions. Save useful items for teammates: winning is a team effort.</li>" +
          "<li>The best way to win is to level up fast so your whole faction can group up and defeat the Overlord before the enemy does.</li></ul>";
      },
      src: () => "Base p.40"
    },
    {
      title: "FAQ rulings at a glance",
      when: () => true,
      html: (c) => "<ul>" +
        "<li><b>Independent (blue) creatures</b> give no reward when defeated (some Event cards make it worthwhile" + (c.mod("sow-blue") ? ", and so do blue quests" : "") + ").</li>" +
        "<li>Ending your second action in a region with a blue creature: if it’s still there when you take your next action (on your faction’s next turn), that action must challenge it.</li>" +
        "<li>A creature ability triggers once, not once per creature, unless it says otherwise (e.g. fighting 2 Murlocs and rolling one red 1 costs 1 Health, not 2).</li>" +
        "<li>Each ability can be used once per combat round unless it says otherwise (Cleave can’t spot two red 8s for +2 attrition).</li>" +
        "<li>Dice limits are physical; changing a die’s colour needs an unrolled die of the new colour.</li>" +
        "<li>Equipping from a full Bag: swap the Bag item straight with the one on your sheet. Looting with a full Bag: drop an item from your Bag to make room, or drop the looted item itself (dropped items go to the Merchant deck).</li>" +
        "<li>Add-on items must still match the area’s trait. Powers only match the type.</li>" +
        "<li>Cursed and unable to remove a die: not an automatic defeat (unlike Stun).</li>" +
        "<li>The Dwarf’s <b>Stoneform</b> racial ability may change a red 2 into a green 3 — a black die in an icon means any colour.</li>" +
        "<li>Auction House with no gold: everyone bids 0 — a tie, roll for it.</li>" +
        "<li>Rulebook errata: p.19 “Card Effect Limitation” — once per combat round for <b>each</b> Power, Talent and Item card; p.30 example — “damage box”, not “defense box”. Reference card PvP Armor Step — add “for each armor token removed”.</li>" +
        "<li><b>Power and talent errata:</b><ul>" +
        "<li>Priest’s Shadowguard: “During the Defense Phase”, not “During the Resolution step”.</li>" +
        "<li>Rogue’s Slice and Dice: “End of your Reroll step”, not “Start of the Ranged Strike step”.</li>" +
        "<li>Mage’s Arcane Missiles, second sentence: “If you used Arcane Missiles during the previous combat round and did not lose any Health, you may use Arcane Missiles without paying its Energy cost.”</li>" +
        "<li>Mage’s Arcane Focus talent: add “This ability is separate from your Reroll value.”</li>" +
        (c.mod("sow-class") ? "<li>Priest’s Unbreakable Will (Shadow of War): “Place 1 armor token in the defense box for each blue 8 you spot.”</li>" : "") +
        (c.outland ? "<li>Warlock’s Soul Leech and the new Shaman sheet (The Burning Crusade): see “The Burning Crusade — new rules”.</li>" : "") + "</ul></li>" +
        "<li>More class-specific rulings appear under “Your heroes — class notes” once you pick classes in the configurator.</li></ul>",
      src: (c) => "FAQ p.1–3" + (c.outland ? ", p.4" : "")
    }
  ];

  /* ===========================================================================
     CLASS NOTES (party) — only what the four PDFs say about each class
     =========================================================================== */
  WW.classNotes = {
    druid: (c) => [
      "<b>Bear Form</b> is a power with the melee icon: it may go in the melee area even though that area lists “mace or sword” — powers only need to match the type (FAQ).",
      "<b>Ferocious Bite</b> (“Change one blue die into a red 8 for each energy you spend”): swap the rolled blue die for a red die you didn’t roll; with all " + dice(c) + " red dice rolled you can’t use it — you may choose not to roll them all (FAQ).",
      "First-game pick: Artumnis Moondream (Alliance) — Rejuvenation and Bear Form; first talent Ferocity."
    ],
    hunter: () => [
      "<b>Pets</b> are a unique category with a Health capacity: put that many Health tokens on the card; you may take wounds on the pet; at 0 it returns to your Spellbook until re-equipped (Base).",
      "Pets heal only through the Hunter’s <b>Mend Pet</b> or by unequipping and re-equipping in Character Management (FAQ).",
      "Add-ons must match the area’s trait: the Hunter can’t wear the <b>Thorium Helm</b> (mail; his area lists cloth and leather) (FAQ).",
      "First-game pick: Burbonn Fang (Alliance) — Scorpid Sting and Hunter’s Mark; first talent Precision."
    ],
    mage: () => [
      "<b>Arcane Missiles errata:</b> second sentence — “If you used Arcane Missiles during the previous combat round and did not lose any Health, you may use Arcane Missiles without paying its Energy cost.” (FAQ)",
      "<b>Arcane Focus errata:</b> add “This ability is separate from your Reroll value.” (FAQ)",
      "First-game pick: Sofeea Icecall (Horde) — Frostbolt and Arcane Intellect; first talent Arcane Focus."
    ],
    paladin: (c) => [
      c.outland ? "The Burning Crusade’s Paladin sheet lets either faction field the Paladin (Horde Paladin: Blood Elf); still only one Paladin per game." : "Base sheet: the Paladin is always <b>Alliance</b> (single-sided sheet).",
      "Unique categories <b>Aura, Blessing and Seal</b>: one of each may be equipped at the same time (Base).",
      "<b>Judgement:</b> each Seal has a normal ability and a Judgement ability; the Judgement power (free, doesn’t unequip the Seal) activates the latter. Both may be used in the same round (FAQ).",
      "The <b>Blessing of Kings</b> talent doesn’t count toward the one-Blessing limit — only powers have unique categories (FAQ)."
    ],
    priest: (c) => [
      "<b>Shadowguard errata:</b> “During the Defense Phase” instead of “During the Resolution step”. (FAQ)",
      "<b>Resurrection</b> keeps a defeated character in his region with Health and Energy back, but it counts as a defeat: he loses his remaining actions, takes no gold or items from that quest (XP yes) and may be looted if his faction loses the PvP combat he was fighting in (FAQ).",
      "<b>Shadow Word: Pain</b> adds 2 blue dice only if it was used in the round immediately before, in the same combat (FAQ).",
      c.mod("sow-class") ? "<b>Unbreakable Will</b> (Shadow of War) errata: “Place 1 armor token in the defense box for each blue 8 you spot.” (FAQ)" : "",
      "First-game pick: Wennu Bloodsinger (Horde) — Lesser Heal and Shadow Word: Pain; first talent Improved Pain."
    ].filter(Boolean),
    rogue: () => [
      "<b>Slice and Dice errata:</b> “End of your Reroll step” instead of “Start of the Ranged Strike step”. (FAQ)",
      "The rulebooks have no other Rogue-specific rules; play the cards as written."
    ],
    shaman: (c) => [
      c.outland ? "The Burning Crusade’s Shaman sheet lets either faction field the Shaman (Alliance Shaman: Draenei); still only one Shaman per game." : "Base sheet: the Shaman is always <b>Horde</b> (single-sided sheet).",
      c.outland ? "<b>Sheet errata (FAQ):</b> the new Horde Shaman’s racial should read “Bloodfury: ATTRITION +1” and Lightning Bolt costs 1 Energy — easiest: use the old Orc Shaman sheet. The Draenei Shaman’s Lightning Bolt costs 1 too." : "",
      "<b>Earth Shock</b> removes a die for this round only — you may roll it again next round (FAQ).",
      "<b>Reincarnation</b> counts as a defeat, like the Priest’s Resurrection: remaining actions lost, no quest gold or items (XP yes), may be looted if his faction loses that PvP combat (FAQ)."
    ].filter(Boolean),
    warlock: (c) => [
      "<b>Demons</b> (Imp, Succubus, Voidwalker) share the unique Demon category — one equipped at a time — and have a Health capacity like pets (Base).",
      "Active powers such as <b>Demon Armor</b> cost their Energy when equipped, then work every round for free; instant powers such as <b>Shadow Bolt</b> cost Energy each use (Base).",
      c.outland ? "<b>Soul Leech errata</b> (The Burning Crusade level 6 talent): “End of your Reroll step: Gain 1 Health for each red or blue 8 you Spot. After Combat, you must immediately lose any Health in excess of your capacity.” (FAQ)" : "",
      "First-game pick: Sandrai Darkshine (Alliance) — Immolate and Shadow Bolt; first talent Improved Shadow Bolt."
    ].filter(Boolean),
    warrior: (c) => [
      "<b>Stance</b> powers must go in the Warrior’s Stance-only card area (Base).",
      "<b>Cleave</b> can’t spot two red 8s for +2 attrition — once per round (FAQ).",
      "<b>Intercept</b> may attack a quest creature or enemy faction in an adjacent region even if a blue creature is there; friendly characters in that region may join by spending an action (FAQ).",
      c.mod("sow-class") ? "<b>Tactical Mastery</b> (Shadow of War): “Start of the combat round: You may equip one power” — e.g. swap Berserker Stance for Defensive Stance mid-fight, paying its Energy." : "",
      "First-game pick: Grumbaz Crowsblood (Horde) — Heroic Strike and Battle Shout; first talent Improved Heroic Strike."
    ].filter(Boolean)
  };
  WW.classSrc = {
    druid: ["FAQ p.2", "Base p.40", (c) => (c.tbc ? "The Burning Crusade p.8" : "")],
    hunter: ["FAQ p.2–3", "Base p.40"],
    mage: ["FAQ p.1", "Base p.40"],
    paladin: ["Base p.3, p.7, p.16–17", "FAQ p.2", (c) => (c.outland ? "The Burning Crusade p.3–4, p.7" : "")],
    priest: ["FAQ p.1–2", (c) => (c.mod("sow-class") ? "FAQ p.3" : ""), "Base p.40"],
    rogue: ["FAQ p.1"],
    shaman: ["Base p.3, p.7", "FAQ p.2", (c) => (c.outland ? "The Burning Crusade p.4, p.7 · FAQ p.4" : "")],
    warlock: ["Base p.15–17", (c) => (c.outland ? "FAQ p.4 · The Burning Crusade p.16" : ""), "Base p.40"],
    warrior: ["Base p.14", "FAQ p.2", (c) => (c.mod("sow-class") ? "Shadow of War p.4" : ""), "Base p.40"]
  };

  /* ===========================================================================
     TEACHING SCRIPT (~5 minutes, read aloud)
     =========================================================================== */
  WW.teach = {
    intro: "A ~5-minute teach for the exact sets, Overlord, variants and player count selected above. Read it aloud, or copy it and adapt. Every rule in it comes from the rulebooks and FAQ cited in the setup steps.",
    sections: [
      {
        h: "The hook — and how you win",
        body: (c) => {
          const o = ovOf(c), him = o.he === "she" ? "her" : "him";
          let h = "<p>Welcome to Lordaeron. We play as two teams, the <b>Horde</b> and the <b>Alliance</b>, and the whole faction wins or loses together. The goal: be the first faction to defeat the Overlord, <b>" + o.name + "</b>" +
            (o.outland ? ", waiting at the bottom of " + o.lair + " in Outland" : "") + ". ";
          if (c.outland) h += "With Outland in play there’s no turn limit — the game runs until somebody brings " + him + " down.</p>";
          else if (c.mod("dto")) h += "We’re playing <b>Defeat the Overlord!</b>, so there’s no final battle: the turn track loops until someone defeats " + him + ".</p>";
          else h += "If nobody does, after the <b>30th turn</b> every hero fights one huge <b>final battle</b>, and the faction left standing wins.</p>";
          return h + "<p>To get strong enough, we quest, level up, train powers and loot gear.</p>";
        }
      },
      {
        h: "The shape of a turn",
        body: (c) => "<p>Factions take turns, Horde first. On our turn each of our heroes takes <b>two actions</b>, in any order — we can interleave. " +
          "Then comes <b>Character Management</b>, the one time you swap cards onto or off your sheet" + ((c.mod("sow-class") || c.outland) ? " (cards with a spellbook icon can also go on at the start of any action)" : "") +
          ". " + (c.outland ? "Anyone inside a dungeon then fights its boss. " : "") +
          "Finally the turn marker moves: some spaces draw an <b>Event</b>, some add an item to the Merchant" +
          (c.mod("sow-destiny") ? ", and the Destiny timer can run out" : "") + ".</p>"
      },
      {
        h: "Your actions — and why you take them",
        body: (c) => "<ul>" +
          "<li><b>Travel</b> up to two regions; one of those steps can be a hop between our flight paths" + (c.outland ? " — the Dark Portal leads to Outland" : "") + ". Blue monsters stop you.</li>" +
          "<li><b>Challenge</b> a monster from one of our quests, a boss, or every enemy hero in your region; teammates there can join by spending an action. A <b>blue</b> monster in your region must be fought first.</li>" +
          "<li><b>Rest</b> to heal twice your level and shed a Curse — in our towns, three times your level and every Curse.</li>" +
          "<li><b>Training</b> buys Power cards up to your level; a <b>Town</b> action heals, trains and trades with the Merchant.</li></ul>"
      },
      {
        h: "Fighting — the heart of the game",
        body: (c) => "<p>Your equipped cards give you coloured dice. Roll them all: anything that meets the monster’s <b>Threat</b> hits. <b>Blue</b> hits are ranged and strike first; <b>red</b> hits block the monster’s attack and then deal damage; <b>green</b> hits are armor and only block. Rerolls and Attrition help.</p>" +
          "<p>Then the monsters answer: our blue hits kill what they can, the rest attack, minus our blocks, and we take the difference as <b>wounds</b>; then our red hits land. In a group we each roll and share the wounds — safer, but we split the rewards. Against heroes, the Threat is their highest level plus two" +
          (c.outland ? " (7 at most)" : "") + ", armor cancels their hits" + (c.mod("deadly") ? " — and with <b>Deadly PvP!</b> nothing else cancels" : "") + ", and the losers get looted.</p>"
      },
      {
        h: "Growing your hero",
        body: (c) => "<p>Each faction keeps <b>" + quests(c) + "</b> quests face up. Kill a quest’s last monster and you take its gold, XP and items; quests below your level pay less XP. Each new level refills you and adds a <b>Talent</b>; the top level is <b>" + maxLvl(c) +
          "</b>. Fall in battle and you return at the nearest graveyard or our starting region with 1 Health and 1 Energy" +
          (c.outland ? " — always on the board where you fell, so in Outland it’s a graveyard there; a dungeon boss sends you to the nearest graveyard or our town on that board" : "") + ".</p>"
      },
      {
        h: (c) => "Our Overlord — " + ovOf(c).name,
        body: (c) => {
          const o = ovOf(c);
          if (o.outland) return "<p>" + o.name + " waits in " + o.lair + ": clear its first two stages and the group steps onto the Overlord sheet for the final fight." +
            (o.id === "illidan" ? " Illidan is the toughest enemy in the game — expect a long game." : "") + "</p>";
          return {
            kt: "<p>Kel’Thuzad starts in Stratholme, and five of his own Event cards are hidden in the Event deck.</p>",
            nef: "<p>Nefarian moves after every Event card, by the Fate number in its corner — we’ll have to catch him.</p>",
            kaz: "<p>Lord Kazzak is the elusive one, with five Overlord counters; his sheet explains them.</p>",
            rag: "<p>Ragnaros has an Overlord counter on Lordaeron marking where he is, and a token on his sheet tracks the progress of the fight against him; his sheet has the rest.</p>"
          }[o.id] + "<p>Challenge " + (o.he === "she" ? "her" : "him") + " like any boss when you’re ready — losing is just a normal defeat: back to the nearest graveyard or our starting region.</p>";
        }
      },
      { when: (c) => [2, 3, 5].includes(c.p),
        h: "Running two heroes",
        body: (c) => "<p>" + (c.p === 2 ? "Each of us runs both heroes of one faction" : c.p === 3 ? "Two of us share a faction; the third runs both heroes of the other" : "One of us runs two heroes of the same faction") +
          " — four actions to plan." + ((c.p === 3 || c.p === 5) ? " That player can’t take both the Paladin and the Shaman." : "") + "</p>" },
      { when: (c) => c.mod("sow-class"),
        h: "Shadow of War — new powers and talents",
        body: () => "<p>Each class gets ten more Power cards and ten more Talent cards. Powers with a <b>spellbook icon</b> can be equipped at the start of any action, even just before a fight.</p>" },
      { when: (c) => c.mod("sow-items"),
        h: "Shadow of War — Bonus Items",
        body: () => "<p>A fifth Item deck, <b>Bonus Items</b>: you may carry seven on top of your three normal items. <b>Experience Reward</b> cards in it are straight XP.</p>" },
      { when: (c) => c.mod("sow-blue"),
        h: "Shadow of War — blue quests",
        body: (c) => "<p>Three <b>blue quests</b> are open to both factions: defeat a blue monster of a type shown and the reward is yours after the fight — roadblocks become targets." +
          (c.mod("sow-redraw") ? " Optional rule: a new blue quest whose monsters aren’t on the board can be redrawn once." : "") + "</p>" },
      { when: (c) => c.mod("sow-events"),
        h: "Shadow of War — new events",
        body: () => "<p>Twenty-six new Event cards are mixed into the Event deck.</p>" },
      { when: (c) => c.mod("sow-destiny"),
        h: "Shadow of War — Destiny",
        body: () => "<p>One <b>Destiny card</b> is always in play, with a hit token on the turn track as its timer. Some punish us if unresolved when time runs out; others are short-lived gifts.</p>" },
      { when: (c) => c.outland,
        h: "The Burning Crusade — Outland",
        body: () => "<p>A second board, <b>Outland</b>, is reached through the Dark Portal from our flight paths. <b>Dungeons</b> are card decks: step in and you lose your remaining actions; at the end of our turn everyone inside fights the stage boss, boosted by its minions — draw extra cards for loot if you dare. Inside you get one action a turn.</p>" +
          "<p>Heroes can reach <b>level 6</b> and earn a <b>flying mount</b>. Beware <b>purple</b> monsters and <b>Poison</b>.</p>" },
      { when: (c) => c.nool,
        h: "The Burning Crusade — without Outland",
        body: (c) => "<p>We use The Burning Crusade on Lordaeron only: new monsters including deadly <b>purple</b> ones, new quests with a purple deck, <b>Poison</b>, and ten dice per colour. No level 6" +
          (c.mod("dto") ? "." : ", and the normal thirty turns.") + "</p>" },
      { when: (c) => c.mod("deadly"),
        h: "Variant — Deadly PvP!",
        body: () => "<p><b>Deadly PvP!</b>: when heroes fight heroes, end-of-round hits don’t cancel out — each side takes everything the other has in its damage box.</p>" },
      { when: (c) => c.mod("dto"),
        h: "Variant — Defeat the Overlord!",
        body: () => "<p><b>Defeat the Overlord!</b>: no final battle; the track loops after turn thirty, and the second lap brings round items to the Merchant.</p>" },
      { when: (c) => c.mod("first"),
        h: "First game",
        body: () => "<p>First game: take a <b>Town</b> action to train two level 1 powers with your five gold, then head for one of our quests, avoiding blue monsters. A lone level 1 hero can usually beat one Murloc, Gnoll, Ghoul or Scarlet Crusader — for anything tougher, bring a friend.</p>" },
      { when: (c) => c.anyCls,
        h: "Our heroes",
        body: (c) => {
          const one = {
            druid: "Druid — Bear Form fits the melee slot",
            hunter: "Hunter — his pet can soak wounds",
            mage: "Mage — Arcane Missiles is free if you used it last round and lost no Health",
            paladin: "Paladin — one Aura, Blessing and Seal at a time",
            priest: "Priest — Resurrection lets a defeated character stay where he fell, though it still counts as a defeat",
            rogue: "Rogue — check the Slice and Dice errata",
            shaman: "Shaman — Reincarnation lets a defeated character stay where he fell, though it still counts as a defeat",
            warlock: "Warlock — one demon at a time, and it can soak wounds",
            warrior: "Warrior — Stances have their own slot"
          };
          const ids = WW.classes.map((k) => k.id).filter((id) => c.cls(id));
          return "<p>Our line-up — " + partyLine(c) + ". " + ids.map((id) => one[id]).join("; ") + ".</p>";
        } },
      {
        h: "Don’t worry about these until they come up",
        body: (c) => "<ul>" +
          "<li>Which card fits which slot — I’ll check as we equip.</li>" +
          "<li>Card timing and spotting dice — each card says when.</li>" +
          "<li>Bonus Events, Auctions and Wars — we’ll read them as they come.</li>" +
          "<li>Stun, Curse" + (c.tbc ? ", Poison" : "") + " — it’s in the reference.</li>" +
          "<li>XP penalties, running out of figures, and looting.</li>" +
          (c.outland ? "<li>Trading quests for Outland quests — later on.</li>" : "") + "</ul>"
      }
    ]
  };
})();
