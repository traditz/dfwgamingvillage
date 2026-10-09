/* =============================================================================
   Root — Setup & Reference Utility · teaching script
   Teaching order (CLAUDE.md): hook & win → shape of a turn → actions and why → central mechanic →
   inserts for the factions and modules selected → "don't worry about these yet".
   Written from the Law, the Learning to Play guides and the Walkthrough (cited in setup/reference).
   Expansion faction inserts come from data-factions.js, bot inserts from data-bots.js.
   ============================================================================= */

/* one-line goals, from each faction's Law overview (§6.1–§18.1) and LtP p.2 */
RT.goal = {
  marquise:  "the <b>Marquise de Cat</b>, who scores by <b>building</b> workshops, sawmills and recruiters on a network of wood",
  eyrie:     "the <b>Eyrie Dynasties</b>, who score every Evening for their <b>roosts</b> on the map, bound by an ever-growing Decree",
  alliance:  "the <b>Woodland Alliance</b>, who score by <b>spreading sympathy</b> and rise up in revolt",
  vagabond:  "the <b>Vagabond</b>, who scores by <b>quests</b>, by <b>aiding</b> other factions and by harming those hostile to him",
  vagabond2: "a <b>second Vagabond</b>, playing the same game as the first",
  lizard:    "the <b>Lizard Cult</b>, who build <b>gardens</b> where they rule and score by revealing and spending cards",
  riverfolk: "the <b>Riverfolk Company</b>, who <b>sell services</b> to everyone, build trade posts and score dividends on their funds",
  duchy:     "the <b>Underground Duchy</b>, who tunnel up from the Burrow, build citadels and markets, and <b>sway ministers</b>",
  corvid:    "the <b>Corvid Conspiracy</b>, who hide <b>plots</b> around the map and score each time they flip one",
  hundreds:  "the <b>Lord of the Hundreds</b>, who score by <b>oppressing</b> clearings — ruling them with no enemy pieces at all",
  keepers:   "the <b>Keepers in Iron</b>, who <b>delve relics</b> out of the forests and recover them at their waystations",
  diaspora:  "the <b>Lilypad Diaspora</b>, who found <b>enclaves</b> that add the frog suit and score by spending cards matching their Peaceful enclaves",
  council:   "the <b>Twilight Council</b>, who convene <b>assemblies</b> and score by governing clearings that hold enemy buildings or tokens",
  knaves:    "the <b>Knaves of the Deepwood</b>, three Captains and a crew of Skunks who score from <b>acclaim</b> and the <b>prisoners</b> they take"
};

RT.teach = {
  intro: "A ~5-minute teach for the exact game selected above. Read it aloud, or hit Copy and tweak it. Each player's faction board explains the details of their own faction.",
  sections: [
    { h: "The hook — and how you win",
      body: function (c) {
        var who = c.facs.map(function (id) {
          var bt = c.bot(id);
          if (bt === "mmorig") return "the <b>Original Mechanical Marquise</b>, a bot in the Marquise de Cat's seat that scores <b>2 points each Birdsong</b> for every clearing it rules with at least three warriors";
          if (bt === "mm2") return "the <b>Marquise de Cat</b> (played by a bot, the Mechanical Marquise 2.0), which builds sawmills, workshops and recruiters without wood and scores each Evening from its Buildings tracks";
          if (bt === "vagabot" || bt === "vagabot2") return (id === "vagabond2" ? "a second Vagabond" : "the Vagabond") + " — the <b>Vagabot</b>, a bot who scores by completing quests, by aiding players who have crafted items and by removing the leader's warriors in battle";
          if (id === "vagabond2" && !bt && c.bot("vagabond")) return "a <b>second Vagabond</b>, who scores by <b>quests</b>, by <b>aiding</b> other factions and by harming those hostile to him";
          return RT.goal[id] + (bt ? " (played by a bot)" : "");
        });
        var p = "<p>Root is a war for the <b>Woodland</b>, and every one of us is playing a different game. " +
          (who.length ? "At this table: " + RT.list(who) + "." : "Pick your factions above and each will be introduced here.") + "</p>";
        p += c.v("coop")
          ? RT.teachCoopHtml(c)
          : "<p>The first to <b>30 victory points</b> wins on the spot. Each faction has its own scoring engine, but anyone scores <b>one point for removing an enemy building or token</b>, and crafting an <b>item</b> scores the points printed on the card." +
            (c.noDom ? (c.two ? " With two of us there are no dominance cards." : (c.fac("diaspora") ? " The four suit dominance cards are out tonight; only the <b>Frog Dominance</b> card is still in the deck." : " There are no dominance cards tonight.")) : " Later on, a player with 10 or more points can trade their score for a <b>dominance card</b> — a different way to win — but don't worry about that yet.") + "</p>";
        if (c.walk) p += "<p>Tonight we learn by playing: the <b>walkthrough booklet</b> scripts our first two turns, and each of us reads our part aloud as we do it.</p>";
        return p;
      } },
    { h: "The shape of a turn",
      body: function (c) {
        return "<p>Every turn has three phases: <b>Birdsong</b>, <b>Daylight</b> and <b>Evening</b>. Your faction board lists exactly what you do in each one, top to bottom — think of it as your personal rulebook. " +
          "Roughly: Birdsong gets your engine going, Daylight is where you take most of your actions, and Evening wraps up — some factions score there" + (c.fac("eyrie") ? ", like the Eyrie," : "") +
          " — and draws cards. Most of us draw <b>one card plus one for each draw bonus</b> we've uncovered on our board, and we all <b>discard down to five</b>. Then the turn passes to the left.</p>";
      } },
    { h: "What everyone can do — and why",
      body: function (c) {
        return "<ul>" +
          "<li><b>Rule.</b> You rule a clearing when you have more warriors and buildings there than anyone else; on a tie nobody does" +
            (function () {
              var ex = [c.fac("eyrie") ? "the Eyrie win ties in clearings where they have a piece" : "", c.fac("lizard") ? "the Lizard Cult rule any clearing with one of their gardens" : ""].filter(Boolean);
              return ex.length ? " — though " + RT.list(ex) : "";
            })() + ". Ruling matters because it lets you <b>move</b> and, for most factions, build.</li>" +
          "<li><b>Move.</b> Take any number of your warriors from one clearing to an adjacent one along a path. You must rule where you start <i>or</i> where you end up" +
            (function () {
              var ex = ["vagabond", "corvid", "riverfolk", "diaspora", "knaves"].filter(function (id) { return c.human(id) || (id === "vagabond" && c.vbH); }).map(function (id) { return RT.F[id].short; });
              if (ex.length === 1 && ex[0] === "Vagabond") return " (the Vagabond bends that rule — he'll explain)";
              return ex.length ? " (the " + RT.list(ex) + " bend that rule — they'll explain)" : "";
            })() + ".</li>" +
          "<li><b>Battle.</b> Pick a clearing with your warriors and an enemy to attack. Roll both dice: the attacker deals the <b>higher</b> number of hits, the defender the <b>lower</b>, but nobody rolls more hits than they have warriors there. Hits remove warriors first, then buildings and tokens — and every enemy building or token you remove is a point. If the defender has no warriors there, the attacker gets a free extra hit.</li>" +
          "<li><b>Craft.</b> Play a card from your hand by activating your crafting pieces in clearings of the suits shown in its corner" +
            (function () {
              var cf = c.facs.filter(function (id) { return !c.bot(id); }).map(function (id) { return RT.F[id].short + ": " + (id === "vagabond" || id === "vagabond2" ? "his pawn, exhausting hammers" : RT.F[id].craft.replace(/ \([^()]*\)$/, "")); });
              return cf.length ? " — " + RT.list(cf) : "";
            })() +
            ". Items score points now; persistent effects give you a new ability for the rest of the game.</li></ul>";
      } },
    { h: "The central idea: suits and cards",
      body: function (c) {
        return "<p>Every clearing has a suit — <b>fox, rabbit or mouse</b> — and so does every card, plus a fourth: <b>bird</b>. Almost everything you do spends or needs a card that <b>matches a clearing</b>, so your hand decides where you can act. " +
          "<b>Birds are wild</b>: a bird card counts as any suit, but when a rule asks for a bird specifically, only a bird will do. The deck is shared, so the cards you spend come back around to your rivals.</p>" +
          (c.fac("diaspora") ? "<p>Tonight there's a fifth suit, the <b>frog</b>: frog cards are in the deck, and the Lilypad Diaspora's enclaves make clearings frog clearings.</p>" : "") +
          "<p>That's why this game is so asymmetric: each faction turns cards into power in its own way, and you'll win by understanding what <i>your neighbours</i> need and denying it to them.</p>";
      } }
  ]
};

/* ---------- base faction inserts (expansion factions: data-factions.js) ---------- */
RT.factionTeach.marquise = { h: "The Marquise de Cat",
  body: function () {
    return "<p>The Marquise starts with a warrior in almost every clearing and her <b>keep</b> in a corner, where only she can place pieces. Each Birdsong her <b>sawmills</b> produce wood. In Daylight she crafts with <b>workshops</b>, then takes <b>three actions</b> — battle, march (two moves), recruit at every recruiter, build, or overwork a sawmill — plus one more for each bird card she spends. " +
      "<b>Building</b> is her scoring: the wood must be connected through clearings she rules, and each building scores the points on the space it uncovers on her board, rising from 1–2 points for the first of a type to 4–5 for the last. She's the most action-starved faction, and her <b>Field Hospitals</b> can send fallen warriors home to the keep for a matching card.</p>";
  } };
RT.factionTeach.eyrie = { h: "The Eyrie Dynasties",
  body: function () {
    return "<p>The Eyrie score every Evening for the <b>roosts</b> they have on the map. Their engine is the <b>Decree</b>: each Birdsong they must add one or two cards (at most one bird) under Recruit, Move, Battle or Build, and every Daylight they must carry out <b>every</b> card, left to right, each in a clearing of that card's suit. The Decree only grows — until they can't do something. Then comes <b>turmoil</b>: they lose a point per bird in the Decree, it's wiped back to the two Viziers, and a new leader takes over. " +
      "They're <b>Lords of the Forest</b>, ruling ties, but disdain trade: crafting an item gives them just one point.</p>";
  } };
RT.factionTeach.alliance = { h: "The Woodland Alliance",
  body: function () {
    return "<p>The Alliance starts with nothing on the map, only <b>supporters</b> — a face-down stack of cards spent for their suit. They spend supporters to place <b>sympathy</b> next to existing sympathy, scoring each time, and to <b>revolt</b> in a sympathetic clearing: every enemy piece there is removed and a base appears with warriors and a new <b>officer</b>. Officers buy them Evening moves, battles, recruits and new sympathy. " +
      "Everyone else, beware <b>Outrage</b>: if you move warriors into a sympathetic clearing or remove sympathy, you pay the Alliance a matching card. And they fight best defending — <b>Guerrilla War</b> flips the dice in their favour.</p>";
  } };
RT.vbTeach = function (c, seat) {
  var vc = c.vchar(seat);
  return "<p>The Vagabond is one pawn and a <b>pack of items</b>: he flips (exhausts) boots to move, swords to battle, a torch to explore ruins for new items, a hammer to craft or repair, a crossbow to strike. He's nimble — he moves through anyone's clearings — and only his free <b>Slip</b> enters the forests, where resting repairs everything. " +
    "He scores by <b>aiding</b> factions (giving them matching cards, maybe taking a crafted item back) to climb their relationship track until they're <b>Allied</b>, by <b>quests</b>, and by hurting factions he's made <b>Hostile</b>. Hits damage his items. Tonight he's the <b>" + vc.name + "</b> (" + vc.act + ").</p>";
};
RT.factionTeach.vagabond = { h: "The Vagabond", body: function (c) { return RT.vbTeach(c, "vagabond"); } };
RT.factionTeach.vagabond2 = { h: "Two Vagabonds",
  body: function (c) {
    var ruins = "every ruin holds two items — whoever explores looks at both and takes one, but nobody can take an “R” item if they already have the same type of “R” item on their board.";
    if (!c.human("vagabond")) return RT.vbTeach(c, "vagabond2") + "<p>With the Vagabot in the game too, " + ruins + "</p>";
    return "<p>We have <b>two Vagabonds</b>: the second is the <b>" + c.vchar("vagabond2").name + "</b>. They share the three face-up quests, and " + ruins + "</p>";
  } };

/* ---------- module inserts ---------- */
RT.teachModules = [
  { when: function (c) { return c.map !== "autumn"; },
    h: function (c) { return "The " + RT.M[c.map].name + " map"; },
    body: function (c) {
      var m = c.map, t = "";
      if (m === "winter") t = "Tonight's clearings got <b>random suits</b>, so look at the map before you plan. The <b>Raging River</b> splits forests the way a path does.";
      if (m === "lake") t = "The <b>lake</b> works like a river joining every coastal clearing. Once per turn, moving from the <b>Ferry's</b> clearing, you can sail to any coastal clearing — you still need rule — and the Ferry draws you a card.";
      if (m === "mountain") t = "Six paths start <b>closed</b>: those clearings aren't adjacent until someone spends a card in their Daylight to open one, for a point. The <b>Pass</b> — the clearing with the Tower — scores you a point at the end of your own Evening if you rule it.";
      if (m === "marsh") t = c.p >= 5 ? "With five or more of us, three <b>landmarks</b> — Mousehold, Foxburrow and Rabbittown — sit in the marsh's unsuited clearings and give those clearings their suits. Foxburrow lets you move between it and any fox clearing; once in your Daylight, Rabbittown lets you spend a rabbit card to pour warriors in and battle there; and Mousehold catches warriors removed in battle from other mouse clearings. These three can't be battled, moved or removed, and they belong to nobody." : "Three clearings are <b>flooded</b>: they're no longer clearings, just paths through, and their flooded paths link nothing.";
      if (m === "gorge") t = "The dam, the bridge and the gorge sides change which forests count as separate — it only matters for pieces that move through or sit in forests.";
      return "<p>" + t + " Suits come from random suit markers" + (m === "winter" ? "" : ", too") + ".</p>";
    } },
  { when: function (c) { return c.lm > 0; },
    h: function () { return "Landmarks"; },
    body: function (c) {
      var parts = [];
      // Homeland p.18: only the landmarks in tonight's pool (finish stage: the line used to list all three whenever any was in the pool)
      if (c.lmPool("foxburrow")) parts.push("<b>Foxburrow</b> lets you move between it and any fox clearing");
      if (c.lmPool("rabbittown")) parts.push("<b>Rabbittown</b> lets you spend a rabbit to pour warriors in and battle there");
      if (c.lmPool("mousehold")) parts.push("<b>Mousehold</b> catches warriors removed in battle from other mouse clearings");
      if (c.lmPool("pack")) parts.push("a <b>Landmarks Pack</b> landmark works as its card says");
      return "<p>We're playing with <b>" + c.lm + " landmark" + (c.lm > 1 ? "s" : "") + "</b>, dealt from the pool: " + RT.list(parts) + ". Landmarks can't be battled, moved or removed unless a landmark says so, and they belong to nobody.</p>";
    } },
  { when: function (c) { return c.hire; },
    h: function () { return "Hirelings"; },
    body: function (c) {
      return "<p>Three <b>hirelings</b> start the game unaligned. The first player to reach <b>4, 8 and 12 points</b> takes one at the end of their turn and rolls the control die for how long it stays — the leader counts only the gold pips. Each turn it loses a marker, and when they run out it goes to someone else. While you control one, its pieces count as yours <b>for rule</b> and it gives you its actions, but you score nothing for what it removes." +
        (c.p >= 3 ? " With " + c.p + " players, " + (c.p >= 5 ? "all three are" : c.p === 4 ? "two are" : "one is") + " on the Demoted side (marked with a D), which usually gives abilities instead of pieces." : "") +
        " A faction can't be played while its own hireling is in the game." +
        (function () {   // the hirelings chosen in the configurator (Law p.23 §A.6; Marauder p.12)
          var d = c.st.hirelingsDealt.filter(function (h) { return c.hireDealt(h); }).map(function (h) { return "<b>" + RT.H[h].name + "</b>"; });
          return d.length ? " Tonight's hirelings include " + RT.list(d) + (d.length < 3 ? ", plus " + (3 - d.length === 1 ? "one more" : "two more") + " dealt at random" : "") + "." : "";
        })() + "</p>";
    } },
  { when: function (c) { return c.adv; },
    h: function () { return "Advanced Setup"; },
    body: function (c) {
      return "<p>We're using <b>Advanced Setup</b>: everyone draws five cards and keeps three at the end" + (c.advCards ? ", and instead of picking freely we <b>draft factions</b> from a small pool of setup cards — the last player in turn order picks first and sets up straight away, choosing homelands as their card says; if a card says to keep away from enemy homelands and you can't, just get as far away as you can" : "") + ". It's wilder than the standard setup.</p>";
    } },
  { when: function (c) { return c.deck !== "standard"; },
    h: function () { return "A different deck"; },
    body: function (c) {
      return "<p>Tonight's shared deck is <b>" + RT.decks.filter(function (d) { return d.id === c.deck; })[0].name + "</b>, replacing the base deck. Suits work exactly the same; just read each card's crafted effect when it shows up.</p>";
    } },
  { when: function (c) { return c.two; },
    h: function () { return "Two players"; },
    body: function (c) {
      return "<p>With two of us, the dominance cards are out of the deck." + (c.v("twogames") ? " And we'll play a <b>two-game match</b>: after this game we trade factions, play again, and add up both scores." : "") + "</p>";
    } }
];

/* ---------- the closing list ---------- */
RT.teachLater = function (c) {
  var a = [];
  a.push("<li><b>Ambush cards</b> — a defender can play one matching the clearing for two instant hits; the attacker can cancel it with one of their own.</li>");
  if (!c.noDom) a.push("<li><b>Dominance cards</b> — only matter once someone has 10 points.</li>");
  if (c.vbH && c.p >= 4 && !c.noDom) a.push("<li><b>Coalitions</b> — the Vagabond can use a dominance card to team up with the player in last place.</li>");
  a.push("<li><b>Persistent effects</b> — crafted cards that stay in front of you; read them when they come out.</li>");
  if (c.human("marquise")) a.push("<li><b>Field Hospitals</b> — the Marquise's way to bring warriors back home.</li>");
  if (c.human("eyrie")) a.push("<li><b>The details of turmoil</b> — it'll explain itself the first time it happens.</li>");
  if (c.vbH) a.push("<li><b>The Vagabond's item limit and draw bonuses</b> — they're on his board.</li>");
  if (c.hire) a.push("<li><b>Each hireling's own actions</b> — they're on its card.</li>");
  if (c.map === "lake") a.push("<li><b>Coastal forests</b> — the lake changes which forests are adjacent; it only matters for pieces that move through or sit in forests.</li>");
  c.facs.forEach(function (id) { if (c.human(id) && RT.factionLater && RT.factionLater[id]) a.push(RT.factionLater[id](c)); });   // expansion factions (data-factions.js)
  if (c.anyBot) a.push(RT.botLater(c));   // data-bots.js
  a.push("<li><b>Running out of cards</b> — when the deck empties, shuffle the discard pile straight away" + (c.fac("diaspora") ? ", along with the Pond" : "") + ".</li>");
  return "<ul>" + a.join("") + "</ul>";
};

/* The teaching script for the current configuration: [{h, html}] */
RT.teachFor = function (c) {
  var out = [];
  RT.teach.sections.forEach(function (s) { out.push({ h: s.h, html: s.body(c) }); });
  if (c.anyBot) out.push({ h: RT.botTeach._general.h(c), html: RT.botTeach._general.body(c) });   // how bots work, before the bots' own inserts
  c.facs.forEach(function (id) {
    var bt = c.bot(id);
    if (bt) {   // every bot type has an insert (data-bots.js)
      out.push({ h: RT.F[id].name + " — " + RT.B[bt].name + " (bot)", html: RT.botTeach[bt].body(c) });
      return;
    }
    var t = RT.factionTeach[id];
    out.push({ h: t.h, html: t.body(c) });   // every faction has an insert (base: above; expansions: data-factions.js)
  });
  RT.teachModules.forEach(function (m) { if (m.when(c)) out.push({ h: m.h(c), html: m.body(c) }); });
  out.push({ h: "Don't worry about these until they come up", html: RT.teachLater(c) });
  return out.filter(function (s) { return s.html; });
};
