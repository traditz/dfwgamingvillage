/* =============================================================================
   Root — Setup & Reference Utility · bots (stage "bots")
   Sources:
     Rootbotics  The Law of Rootbotics (cover date September 8, 2021) — §1 changes to the Law with bots, §2 new rules,
                 §3 setup with bots (priority-marker charts p.2–3), §4–11 the eight bots, §12 map interactions.
                 It governs bots only; where it changes the Law of Root (its §1) that applies only in games with bots.
     Riverfolk   Riverfolk Learning to Play p.6–8 — the original Mechanical Marquise (an older bot), its cooperative
                 game, campaign and solo rule.
     Law         The Law of Root (Oct 2025): §A.3 (bots in Advanced Setup point to the Law of Rootbotics), §C.6–C.7
                 (Clockwork components), §C.2.4–C.2.5 (the original Mechanical Marquise's board and spy cards).
   Original vs 2.0: Mechanical Marquise 2.0 is the current Marquise bot (Law §A.3 → Rootbotics; Rootbotics §3.4 leaves the
   original's spy cards out). Nothing in the books retires the original, so it stays selectable, but RT.normalize never
   combines it with Law of Rootbotics bots (their setups conflict).
   Not in the sources: the text of the difficulty, trait, Vagabot-character-board and Services cards, and priority charts
   for the Marsh and Gorge maps. The page says so where it matters.
     RT.botHook(hook, c)  — setup inserts: "general", "map", "items", "score", "coop" (see data-setup.js RT.bh)
     RT.botGeneral(c, adv), RT.botGeneralSrc(c, adv) — the bots setup step (Standard step 1–2 / Advanced step A.3)
     RT.botHands(c, adv)  — the Draw starting hands list with bots (Rootbotics §3.4 / Riverfolk p.6)
     RT.botSetup[type]    = { d(c), src(c) }   each bot's own faction setup
     RT.botRef[type]      = { title, html(c), src(c) };  RT.botRef._general = { title(c), html(c), src(c) }
     RT.botTeach[type]    = { body(c) };                 RT.botTeach._general = { h(c), body(c) }; RT.botLater(c)
     RT.coreExc[...]      += bot entries (shown inside the core reference sections)
   ============================================================================= */

/* ---------- small helpers ---------- */
RT.rbFacs = function (c) { return c.botFacs.filter(function (id) { return RT.B[c.bot(id)].rb; }); };
RT.hasBot = function (c, type) { return c.botFacs.some(function (id) { return c.bot(id) === type; }); };
RT.botName = function (c, id) { return RT.B[c.bot(id)].name; };
RT.diffOf = function (c, id) { var b = c.botCfg(id); return RT.DIFF[b && b.diff] || RT.DIFF["default"]; };
RT.vbotOf = function (c, id) { var b = c.botCfg(id); return RT.VB[b && b.vbot] || RT.VB.thief; };
RT.diffLine = function (c, id) {      // "Challenging difficulty card · trait cards" for one bot
  var d = RT.diffOf(c, id), b = c.botCfg(id);
  return (d.id === "default" ? "<b>Default</b> difficulty (no difficulty card)" : "<b>" + d.name + "</b> difficulty card") +
    " · " + (b.traits ? "<b>with trait cards</b>" : "no trait cards");
};
RT.diffEasyNote = {   // what the book's example turns show an Easy difficulty card doing (the card texts aren't printed)
  lizbot: "Easy, as the book's example turn shows: the Logical Lizards perform <b>three</b> rituals in Daylight instead of four.",
  corvbot: "Easy, as the book's example turn shows: the Cogwheel Corvids recruit <b>one</b> warrior in each of two ordered clearings instead of two."
};
RT.diffEasySrc = { lizbot: "Rootbotics p.17", corvbot: "Rootbotics p.23" };
RT.diffTraitsHtml = function (c, id) {   // the difficulty/traits block at the top of each bot's reference
  var t = c.bot(id), d = RT.diffOf(c, id);
  return "<p class='inline-note'>This bot: " + RT.diffLine(c, id) + ". A difficulty card (anything but Default) and trait cards modify the rules below — read them alongside; their text is on the cards, not in the Law of Rootbotics." +
    (d.id === "easy" && RT.diffEasyNote[t] ? " " + RT.diffEasyNote[t] : "") + "</p>";
};
RT.diffTraitsSrc = function (c, id) {
  var t = c.bot(id), d = RT.diffOf(c, id);
  return RT.join(["Rootbotics p.3 §3.3", d.id === "easy" && RT.diffEasySrc[t] ? RT.diffEasySrc[t] : ""]);
};
RT.botsUncovered = function (c) {   // later content in play that the Law of Rootbotics never mentions
  var a = [];
  var hf = ["hundreds", "keepers", "diaspora", "council", "knaves"].filter(function (id) { return c.fac(id); });
  if (hf.length) a.push("the " + RT.list(hf.map(function (id) { return RT.F[id].name; })));
  if (c.fac("diaspora")) a.push("frog cards and the Pond");
  if (c.hire) a.push("hirelings");
  if (c.lm > 0 || (c.map === "marsh" && c.p >= 5)) a.push("landmarks");
  return a;
};
RT.arbiterInPlay = function (c) {     // the Arbiter, as a human Vagabond or a Vagabot (Rootbotics §7.7.6 covers both)
  return ["vagabond", "vagabond2"].some(function (s) {
    if (!c.fac(s)) return false;
    return c.bot(s) ? RT.vbotOf(c, s).id === "arbiter" : c.vchar(s).id === "arbiter";
  });
};
RT.botCorner ="a <b>random corner clearing</b> that is not the starting corner clearing of another bot and, if possible, is diagonally opposite a starting corner clearing";

/* ---------- clearing priority markers (Rootbotics p.2–3 §3.1) ----------
   Read from the rendered charts (200–300 dpi). Positions as the charts draw the maps; suits only on the Fall chart. */
RT.priority = {
  autumn: { chart: "Fall", page: "p.2", img: "images/bots/priority-autumn.webp", h: 339, list: [
    "top-left corner (fox)", "top-right corner (mouse)", "bottom-right corner (rabbit)", "bottom-left corner (rabbit)",
    "top edge, between 1 and 2 (rabbit)", "right edge, below 2 (fox)", "bottom edge, left of 3 (mouse)", "bottom edge, right of 4 (fox)",
    "left edge, below 1 (mouse)", "upper middle, below 5 (rabbit)", "middle right, left of 6 (mouse)", "centre (fox)"] },
  winter: { chart: "Winter", page: "p.3", img: "images/bots/priority-winter.webp", h: 322, list: [
    "top-left corner", "top-right corner", "bottom-right corner", "bottom-left corner",
    "top edge, right of 1", "top edge, left of 2", "right edge, below 2", "bottom edge, left of 3",
    "bottom edge, right of 4", "left edge, below 1", "centre left", "centre right"] },
  lake: { chart: "Lake", page: "p.3", img: "images/bots/priority-lake.webp", h: 331, list: [
    "bottom-right corner (the coastal corner where the Ferry starts)", "top-left corner", "bottom-left corner", "top-right corner",
    "right edge, below 4", "top edge, left of 4", "top edge, right of 2", "left edge, below 2",
    "bottom edge, left of 1", "upper middle, above the lake", "middle right, on the lake's upper shore", "lower middle, below the lake"] },
  mountain: { chart: "Mountain", page: "p.3", img: "images/bots/priority-mountain.webp", h: 331, list: [
    "top-left corner", "top-right corner", "bottom-right corner", "bottom-left corner",
    "top edge, left of 2", "right edge, below 2", "bottom edge, left of 3", "left edge, below 1",
    "upper middle, left", "centre", "lower middle, right", "lower middle, left"] }
};
RT.priorityHtml = function (c, withImg) {
  var pr = RT.priority[c.map];
  if (!pr) return "<p><b>Clearing priority markers (bots):</b> the Law of Rootbotics prints charts only for the Fall (Autumn), Winter, Lake and Mountain maps — <b>none for the " + RT.M[c.map].name + "</b>. " +
    "Bots need a priority marker from 1 (highest) to 12 (lowest) in every clearing, so agree on a placement as a group before play; the sources give no chart for this map." +
    (c.map === "marsh" && c.p >= 5 ? " With five or more players the Marsh has <b>15 clearings</b> (the three landmark clearings have no suit marker) but there are only 12 priority markers, so also agree how the bots rank those three clearings — the sources don't cover this." : "") + "</p>";
  return "<p><b>Clearing priority markers (bots):</b> after choosing the map, place the 12 priority markers, one in each clearing, as " + (withImg ? "this chart shows" : "the book's chart shows (pictured in the map setup step)") +
    (c.map === "autumn" ? " (the Law of Rootbotics calls the Autumn map <b>Fall</b>)" : "") + ". <b>1</b> is the highest priority, <b>12</b> the lowest.</p>" +
    (withImg ? "<figure class='prio-fig'><img src='" + pr.img + "' width='340' height='" + pr.h + "' loading='lazy' alt='Clearing priority chart for the " + RT.M[c.map].name + " map, numbering the clearings 1 to 12'>" +
      "<figcaption>" + pr.chart + " chart, Law of Rootbotics " + pr.page + (c.map === "mountain" ? " — the thick bars are the six closed paths" : "") + "</figcaption></figure>" : "") +
    "<ol class='prio-list'>" + pr.list.map(function (t) { return "<li>" + t + "</li>"; }).join("") + "</ol>";
};
RT.prioritySrc = function (c) { return c.map === "autumn" ? "Rootbotics p.3 §3.1 · p.2 (Fall chart)" : "Rootbotics p.3 §3.1"; };

/* ---------- the draw-starting-hands list with bots ---------- */
RT.botHands = function (c, adv) {
  var n = adv ? "five" : "three";
  if (RT.mmOnly(c)) return [
    "<b>Original Mechanical Marquise:</b> before shuffling, remove the four <b>dominance cards</b> and add the four <b>spy cards</b>." + (!c.two && c.fac("diaspora") ? " The <b>Frog Dominance</b> card stays in: the Law removes it only in a two-player game." : ""),
    c.solo ? "<b>Playing alone</b> against it: also remove <b>Favor of the Foxes</b>, <b>Favor of the Rabbits</b> and <b>Favor of the Mice</b> from the deck." : "",
    "Shuffle the deck. Each human draws <b>" + n + "</b> cards.",
    "Draw <b>five cards</b> for the Mechanical Marquise — not three — and stand them in a row on the card stand so players see only the backs. This is its <b>Schedule of Orders</b>."
  ];
  return [
    c.noDom
      ? "<b>Dominance cards:</b> remove all four from the deck — " + (c.v("coop") ? "the fully cooperative game always does" + (c.humans <= 2 ? " (and so does any game with one or two humans)" : "") : "you have " + (c.humans === 1 ? "one human" : "two humans")) + "." + (!c.two && c.fac("diaspora") ? " The <b>Frog Dominance</b> card stays in: the Law removes it only in a two-player game." : "")
      : "<b>Dominance cards</b> stay in the deck: with bots they're removed only with one or two humans or in the cooperative game.",
    c.has("riverfolk") ? "Don't include the Riverfolk expansion's <b>spy cards</b>." : "",
    "Shuffle the deck. Each <b>human</b> draws <b>" + n + "</b> cards. <b>Bots don't draw cards</b> — they have no hand."
  ];
};
RT.botHandsSrc = function (c) {
  if (RT.mmOnly(c)) return RT.join(["Riverfolk p.6", c.solo ? "Riverfolk p.8" : "", c.noDom && !c.two && c.fac("diaspora") ? "Law p.19 §16.3.3" : ""]);
  return RT.join(["Rootbotics p.3 §3.4", c.v("coop") ? "Rootbotics p.3" : "", c.noDom && !c.two && c.fac("diaspora") ? "Law p.19 §16.3.3" : ""]);
};

/* ---------- setup inserts ---------- */
RT.botGeneral = function (c, adv) {
  var rb = RT.rbFacs(c), a = [];
  var advLines = function () {
    if (adv && c.advCards) a.push("<b>Advanced Setup:</b> set up each bot's faction <b>now</b>, from its own bot rules (the steps that follow). <i>Bots don't draft: leave their factions' setup cards out of the pool and deal setup cards for the humans only. The Law of Root names this step for bots but doesn't say how they join the draft — this is the page's reading.</i>");
    if (adv && !c.advCards) a.push("<b>Advanced Setup</b> with factions set up as in the Standard Setup: each bot sets up its faction from its own bot rules, in setup order with everyone else.");
  };
  if (RT.mmOnly(c)) {
    a.push("The <b>Original Mechanical Marquise</b> replaces a human Marquise. It uses the Marquise de Cat's pieces, so you can't include both.");
    a.push("Give it a <b>random seating position</b>, as if it were a human player. One player sitting near it sets it up and plays its turns.");
    a.push("It has no difficulty or trait cards and doesn't use clearing priority markers — those belong to the Law of Rootbotics bots. Its own board has a Clearing Priority box.");
    if (c.v("campaign")) a.push("<b>Campaign:</b> each time the players win, the Mechanical Marquise starts the next game with <b>3 more victory points</b> and each player starts with <b>one more crafted card</b> from their final play area of the last game — both build up (after two wins the Marquise begins on 6, and in the book's example Patrick starts game three with a card he crafted in game one and carried into game two, plus one he crafted in game two).");
    advLines();
    a.push("<i>Which Mechanical Marquise? This is the Riverfolk book's original bot. <b>Mechanical Marquise 2.0</b> (Clockwork) is the newer Marquise bot under the Law of Rootbotics, which the Law of Root's Advanced Setup names for bots. Nothing in the books retires the original, but its setup conflicts with the Law of Rootbotics bots', so this page never mixes the two.</i>");
    return RT.ul(a);
  }
  a.push("<b>Replace factions:</b> " + (adv ? "choose which factions bots play" : "while assigning factions (the Law's setup step 1)") + " — you may replace any number of factions with their bot factions. Tonight: " +
    rb.map(function (id) { return "<b>" + RT.botName(c, id) + "</b> plays the " + RT.F[id].name; }).join("; ") + ".");
  a.push("<b>Bots are players.</b> In the rules, “player” means humans and bots alike; bots take seats in turn order like anyone else.");
  a.push("<b>Choose difficulty and traits</b>" + (adv ? "" : " — after assigning factions and before placing score markers (the Law's setup steps 1 and 2)") + ": for each bot choose <b>easy, default, challenging or nightmare</b>. For anything but default, place the matching <b>difficulty card</b> face up near the bot's faction board. Then choose any number of its <b>trait cards</b> (even zero) — they modify its rules and generally make it harder — and place them face up near its board." +
    RT.ul(rb.map(function (id) { return "<b>" + RT.botName(c, id) + ":</b> " + RT.diffLine(c, id) + "."; })));
  a.push("<b>Priority markers</b> go into the clearings once the map is chosen — see the map step" + (RT.priority[c.map] ? "" : " (no chart exists for the " + RT.M[c.map].name + ")") + ".");
  if (c.fac("riverfolk") && rb.some(function (id) { return id !== "riverfolk"; })) {
    a.push(c.has("clockwork2")
      ? "<b>Bot Services cards</b> (the Riverfolk are in play): bots buy and use the Riverfolk's services by these cards, whether the Riverfolk are human or bot. Tonight: " + (c.services === "advanced" ? "the <b>3 Basic and 8 Advanced Services</b> cards" : "the <b>3 Basic Services</b> cards only") + "."
      : "<b>Bot Services cards:</b> how bots use the Riverfolk's services is printed on the Services cards from Clockwork 2, which isn't in this collection — the sources don't say how bots buy services without them.");
  }
  if (c.v("coop")) a.push("<b>Fully cooperative:</b> remove all four dominance cards during setup (see the starting-hands step).");
  if (c.solo) a.push("<b>Playing alone:</b> you against " + (c.nbots === 1 ? "one bot" : c.nbots + " bots") + ".");
  advLines();
  return RT.ul(a);
};
RT.botGeneralSrc = function (c, adv) {
  if (RT.mmOnly(c)) return RT.join(["Law p.22 §A.3", "Riverfolk p.6–7", c.v("campaign") ? "Riverfolk p.8" : "", "Rootbotics p.3 §3.4 · p.4 §4"]);
  return RT.join([adv ? "Law p.22 §A.3" : "", "Rootbotics p.2 §2.6 · p.3 §3.2–3.3", c.fac("riverfolk") ? "Rootbotics p.18 §9.7" : "", c.v("coop") ? "Rootbotics p.3" : ""]);
};

RT.botHook = function (hook, c) {
  if (!c.anyBot) return "";
  switch (hook) {
    case "general": return RT.botGeneral(c, c.adv);
    case "map": return c.rb ? RT.priorityHtml(c, true) : "";
    case "score": return c.v("campaign") ? "<b>Campaign:</b> the Mechanical Marquise's score marker starts on <b>3 points for each game</b> you've won so far." : "";
    case "items": return c.mmorig && !c.rb ? "<b>Original Mechanical Marquise:</b> take a <b>sword, boots, bag and tea</b> from the item supply and place them in the <b>Items for Sale</b> box on its faction board." : "";
    case "coop":
      if (!c.v("coop")) return "";
      if (RT.mmOnly(c)) return "<b>Cooperative play:</b> you win as a team if <b>every player</b> scores 30 points before the Mechanical Marquise does. It also scores <b>1 point per human player</b> in each Birdsong, and recruits in <b>all clearings matching the suit of the crafting cost</b>, regardless of rule." +
        (c.v("campaign") ? " <b>Campaign:</b> after each win, string the next game on (its setup step says how)." : "");
      return "<b>Fully cooperative:</b> the humans win together only if <b>each</b> of them scores 30 points before <b>any</b> bot does. Bots don't treat bot pieces as enemies when targeting a clearing to act in, and don't target each other in battle (they may still remove bot pieces as collateral damage, e.g. in revolts). The humans still treat each other as enemies.";
  }
  return "";
};

/* ---------- each bot's own faction setup ---------- */
RT.botSetup.mm2 = {
  d: function () {
    return RT.ol([
      "<b>Gather:</b> form a supply of <b>25 warriors</b>. (The bot's setup gathers no wood.)",
      "<b>Keep:</b> place the keep token in a <b>random corner clearing</b>.",
      "<b>Garrison:</b> place a warrior in <b>each clearing</b> except the one in the corner diagonally opposite the keep. Place an <b>extra warrior</b> in the keep's clearing.",
      "<b>Starting buildings:</b> <b>randomly</b> place 1 sawmill, 1 workshop and 1 recruiter among the keep's clearing and the clearings adjacent to it, <b>at most one building per clearing</b>.",
      "<b>Buildings tracks:</b> place the remaining 5 sawmills, 5 workshops and 5 recruiters on their tracks, filling every space except the leftmost of each."
    ]);
  },
  src: function () { return "Rootbotics p.4 §4.3"; } };

RT.botSetup.eyriebot = {
  d: function () {
    return RT.ol([
      "<b>Gather:</b> form a supply of <b>20 warriors</b>.",
      "<b>Roost and starting warriors:</b> place <b>1 roost and 6 warriors</b> in " + RT.botCorner + ".",
      "<b>Viziers:</b> tuck your <b>2 Loyal Vizier</b> cards, showing their suit, into the <b>rightmost Decree column</b> (bird). (The bot's setup has no leader step.)",
      "<b>Roosts track:</b> place the remaining 6 roosts on it from right to left, filling every space except the leftmost."
    ]);
  },
  src: function () { return "Rootbotics p.6 §5.3"; } };

RT.botSetup.allybot = {
  d: function () {
    return RT.ol([
      "<b>Gather:</b> form a supply of <b>10 warriors</b>.",
      "<b>Bases:</b> place your 3 bases on their spaces in the Bases box.",
      "<b>Sympathy:</b> place your 10 sympathy tokens on the Sympathy track. (The bot's setup draws no supporters.)"
    ]);
  },
  src: function () { return "Rootbotics p.8 §6.3"; } };

RT.vagabotSetup = function (c, seat) {
  var vb = RT.vbotOf(c, seat);
  return RT.ol([
    "<b>Choose a character:</b> pick a <b>Vagabot</b> character card (not a Vagabond one) for the Character Card slot. Selected: <b>" + vb.name + "</b>.",
    "<b>Pawn:</b> place the Vagabot pawn in the <b>forest adjacent to the most clearings</b>; if several tie, choose randomly among them.",
    "<b>Quest:</b> shuffle the quest deck, draw <b>1 quest</b> and place it face up near the bot. Only the bot can complete it.",
    c.twovb
      ? "<b>Ruins:</b> with two Vagabonds the ruins hold <b>two “R” items each</b>, using both sets — done once, by whichever Vagabond sets up first (see the Vagabond's setup)."
      : "<b>Ruins:</b> take the 4 items marked “R” and place one at random under each ruin (as for the human Vagabond).",
    "<b>Starting items:</b> take <b>any " + (vb.id === "tinker" ? "3" : "4") + " items marked “S”</b> and place them face up in the Satchel" + (vb.id === "tinker" ? " — the Tinker starts with one fewer." : ".") +
      (c.twovb ? " <i>With two Vagabonds the Law doesn't say how the “S” items are shared.</i>" : "")
  ]);
};
RT.vagabotSrc = function (c, seat) { return RT.join(["Rootbotics p.10 §7.3", "p.11 " + RT.vbotOf(c, seat).sec, c.twovb ? "Law p.10–11 §9.7.1" : ""]); };
RT.botSetup.vagabot = { d: function (c) { return RT.vagabotSetup(c, "vagabond"); }, src: function (c) { return RT.vagabotSrc(c, "vagabond"); } };
RT.botSetup.vagabot2 = { d: function (c) { return (c.bot("vagabond") ? "<p>A second Vagabot. Follow the same steps:</p>" : "<p>The Vagabot plays the second Vagabond seat, on the <b>Vagabot faction board</b> (not the Riverfolk Second Vagabond board):</p>") + RT.vagabotSetup(c, "vagabond2"); }, src: function (c) { return RT.vagabotSrc(c, "vagabond2"); } };

RT.botSetup.lizbot = {
  d: function () {
    return RT.ol([
      "<b>Gather:</b> form a supply of <b>25 warriors</b>.",
      "<b>Starting clearing:</b> place <b>4 warriors and 1 garden of matching printed suit</b> in " + RT.botCorner + ". Then place <b>1 warrior in each adjacent clearing</b>.",
      "<b>Conspiracy:</b> place the outcast marker on the <b>Sanctify</b> space of the Conspiracy track on your faction board.",
      "<b>Gardens tracks:</b> place the remaining <b>14 gardens</b> on their matching spaces, from right to left.",
      "<b>Lost Souls:</b> draw <b>3 cards</b> and place them face up in your Lost Souls, in the order drawn."
    ]);
  },
  src: function () { return "Rootbotics p.15 §8.3"; } };

RT.botSetup.riverbot = {
  d: function () {
    return RT.ol([
      "<b>Gather:</b> form a supply of <b>15 warriors</b>.",
      "<b>Warriors:</b> place <b>1 warrior in each clearing on the river</b>.",
      "<b>Trade posts:</b> place <b>9 trade posts</b> on the matching spaces of the Trade Posts tracks.",
      "<b>Starting payment:</b> place <b>1 warrior</b> in the Payments box.",
      "<b>Market:</b> draw <b>5 cards</b> and add them face up to the Market."
    ]);
  },
  src: function () { return "Rootbotics p.18 §9.3"; } };

RT.botSetup.duchybot = {
  d: function (c) {
    return RT.ol([
      "<b>Gather:</b> form supplies of <b>20 warriors, 3 tunnels and 9 crowns</b>.",
      "<b>The Burrow:</b> place the Burrow board near the map.",
      "<b>Surface:</b> place <b>2 warriors and 1 tunnel</b> in a corner clearing that is not the starting corner clearing of another bot and, if possible, is diagonally opposite a starting corner clearing. Then place <b>2 warriors in each clearing adjacent</b> to it, except the Burrow." +
        (c.map === "mountain" ? " <i>(On the Mountain bots treat closed paths as paths, so a clearing joined to the corner only by a closed path still counts as adjacent and gets 2 warriors.)</i>" : ""),
      "<b>Buildings:</b> place 3 citadels and 3 markets on their Buildings spaces.",
      "<b>Sway starting ministers:</b> draw <b>2 cards</b> and discard them; for each, place a crown on the <b>topmost matching unswayed minister</b> on your faction board."
    ]);
  },
  src: function (c) { return c.map === "mountain" ? "Rootbotics p.20 §10.3 · p.24 §12.2.1" : "Rootbotics p.20 §10.3"; } };

RT.botSetup.corvbot = {
  d: function (c) {
    return RT.ol([
      "<b>Gather:</b> form supplies of <b>15 warriors</b> and <b>8 plot tokens</b>, face down.",
      "<b>Scatter:</b> place <b>1 warrior in the lowest-priority clearing of each suit</b> — 3 in total." + (c.map === "mountain" ? " <i>(On the Mountain the Pass always counts as lowest priority, so the warrior for the Pass's suit goes in the Pass.)</i>" : "") + (RT.priority[c.map] ? "" : " <i>(The " + RT.M[c.map].name + " has no printed priority chart — use the markers your group placed.)</i>")
    ]);
  },
  src: function (c) { return c.map === "mountain" ? "Rootbotics p.22 §11.3 · p.24 §12.2.2" : "Rootbotics p.22 §11.3"; } };

RT.botSetup.mmorig = {
  d: function () {
    return "<p>Follow the Marquise de Cat's faction setup, but <b>skip steps 4 and 5</b> (starting buildings and Buildings tracks) — the original Mechanical Marquise doesn't use the Marquise's buildings:</p>" + RT.ol([
      "<b>Gather:</b> form supplies of <b>25 warriors</b> and <b>8 wood</b> tokens.",
      "<b>Keep:</b> place the keep token in any corner clearing.",
      "<b>Garrison:</b> place a warrior in each clearing except the one in the corner diagonally opposite the keep."
    ]);
  },
  src: function () { return "Riverfolk p.6 · Law p.5–6 §6.3.1–6.3.3"; } };

/* =====================================================================
   RULES REFERENCE
   ===================================================================== */
RT.botAbilities = "Like every bot, it has <b>Poor Manual Dexterity</b> (no hand of cards) and <b>Hates Surprises</b> (no ambush cards against it) — see Playing with bots.";

RT.botRef.mm2 = { title: "Mechanical Marquise 2.0",
  html: function (c) {
    return "<p>The simplest bot, built to fill out the player count — straightforward, but at least one player will need to keep it in check.</p>" + RT.diffTraitsHtml(c, "marquise") +
      "<h4>Abilities</h4>" + RT.ul([
        "<b>The Keep:</b> only the Marquise can place pieces in the keep's clearing (pieces may still move in). If the keep is removed, it leaves the game permanently.",
        RT.botAbilities
      ]) + "<h4>Birdsong</h4>" + RT.ol([
        "<b>Reveal order:</b> draw and reveal an order card.",
        "<b>Craft item:</b> if the order card shows an available item, craft it (1 point, no workshops needed)."
      ]) + "<h4>Daylight (fox, rabbit or mouse order)</h4>" + RT.ol([
        "<b>Battle</b> in each ordered clearing. The defender is the player with the <b>most pieces</b> there; on a tie, the one with the most victory points.",
        "<b>Recruit:</b> place <b>four warriors</b> among ordered clearings you rule, distributed evenly. If you rule three such clearings, the fourth goes to the one of highest priority.",
        "<b>Build</b> in the clearing you rule with the most Marquise warriors: a <b>sawmill</b> on a fox order, a <b>workshop</b> on rabbit, a <b>recruiter</b> on mouse. (The order picks the building type, not the clearing.)",
        "<b>Move</b> all but three of your warriors from each ordered clearing to the adjacent clearing with the <b>most enemy pieces</b>.",
        "<b>Expand:</b> if you placed no building this turn and have five or fewer buildings on the map, discard the order card, draw and reveal a new one (don't craft its item), and return to the start of Daylight."
      ]) + "<h4>Escalated Daylight (bird order — instead of Daylight)</h4>" + RT.ol([
        "<b>Battle</b> in <b>each clearing</b>. Defender: the player with the most pieces there; tie, most victory points.",
        "<b>Recruit:</b> place two warriors in each of the <b>two clearings you rule of lowest priority</b>. If you rule only one clearing, place all four there.",
        "<b>Build</b> a building of the type with the <b>most pieces on the map</b> in the clearing you rule with the most Marquise warriors. A tie between sawmills and any other type: sawmill. A tie between workshops and recruiters (not sawmills): recruiter.",
        "<b>Move</b> all but three of your warriors from <b>each clearing</b> to the adjacent clearing with the most enemy pieces. Then <b>battle in each clearing you moved into</b>."
      ]) + "<h4>Evening</h4>" + RT.ol([
        "<b>Score</b> the points on the rightmost empty space of your <b>ordered</b> Buildings track (bird order: the track that would score the most). Unlike the Marquise de Cat, it scores nothing for placing buildings.",
        "<b>Discard</b> the order card."
      ]) + "<p class='inline-note'>The Riverfolk book's <b>original Mechanical Marquise</b> is an older, separate bot with different rules (Schedule of Orders, spy cards). This is the Law of Rootbotics version.</p>";
  },
  src: function (c) { return RT.join(["Rootbotics p.4–5 §4", RT.diffTraitsSrc(c, "marquise")]); } };

RT.botRef.eyriebot = { title: "Electric Eyrie",
  html: function (c) {
    return "<p>The Electric Eyrie will inspire fear in the most stalwart of players: like the Eyrie Dynasties, it ramps up its actions aggressively through the Decree.</p>" + RT.diffTraitsHtml(c, "eyrie") +
      "<h4>Abilities</h4>" + RT.ul([
        "<b>Lords of the Forest:</b> the Electric Eyrie rule a clearing when <b>tied</b> for most combined warriors and buildings there. They don't rule empty clearings.",
        RT.botAbilities
      ]) + "<h4>Birdsong</h4>" + RT.ol([
        "<b>Reveal order:</b> draw and reveal an order card.",
        "<b>Craft order:</b> if it shows an available item, craft it.",
        "<b>Add to the Decree:</b> add the order card to the Decree column of its suit. The columns run <b>fox, mouse, rabbit, bird</b> from left to right.",
        "<b>A New Roost:</b> if you have no roosts on the map, place a roost and four warriors in the <b>ordered clearing of highest priority</b> where all those pieces can be placed. (Not listed on the board.)"
      ]) + "<h4>Daylight</h4>" + RT.ol([
        "<b>Resolve the Decree:</b> recruit for each column with at least one card, left to right; then move the same way; then battle the same way." + RT.ul([
          "<b>Recruit:</b> place warriors equal to the cards in the column in a clearing with a roost matching the column's suit. Ties: most enemy pieces → fewest Eyrie warriors → lowest priority.",
          "<b>Move</b> from the clearing you rule matching the column with the most Eyrie warriors, to an adjacent clearing <b>with no roost</b> (if every adjacent clearing has one, to an adjacent clearing with a roost). Leave behind exactly enough warriors to rule the origin, or as many as the column has cards, whichever is higher. Destination ties: fewest enemy pieces → lowest priority.",
          "<b>Battle</b> in a clearing matching the column. The defender is the player with the <b>most buildings</b> there (even zero). If this column has <b>more cards than each other column</b>, deal one extra hit. Clearing ties: no roost → most defenseless buildings → lowest priority. Defender ties: most pieces there → most victory points."
        ]),
        "<b>Build:</b> place a roost in a clearing you rule with no roost (several: the highest priority) — whatever cards are in the Decree. If you can't place a roost for any reason, you fall into <b>turmoil</b> at once."
      ]) + "<h4>Evening</h4>" + RT.ul(["<b>Score</b> the points on the rightmost empty space of your Roosts track."]) +
      "<h4>Turmoil</h4><p>Whenever you're prompted to place a roost (Build, or A New Roost) but can't for any reason, you fall into turmoil at once:</p>" + RT.ol([
        "<b>Humiliate:</b> lose 1 point per bird card in the Decree (Loyal Viziers included).",
        "<b>Purge:</b> discard every Decree card except the Loyal Viziers, which stay in the bird column.",
        "<b>Rest:</b> go to Evening as normal."
      ]);
  },
  src: function (c) { return RT.join(["Rootbotics p.6–7 §5", RT.diffTraitsSrc(c, "eyrie")]); } };

RT.botRef.allybot = { title: "Automated Alliance",
  html: function (c) {
    return "<p>The Automated Alliance is especially zealous and revolts often. Keep an eye on their likely targets, and don't let them consolidate their warriors once they have a foothold.</p>" + RT.diffTraitsHtml(c, "alliance") +
      "<h4>Abilities</h4>" + RT.ul([
        "<b>Sympathy tokens:</b> 10, at most one per clearing (sympathetic and unsympathetic clearings).",
        "<b>Automated Ambush:</b> as defender in battle with at least one Alliance warrior, they deal <b>one extra hit</b>.",
        "<b>Automated Outrage:</b> whenever a <b>human</b> removes a sympathy token or moves any warriors into a sympathetic clearing, that player must <b>discard a matching card</b>. If they can't, the Alliance scores 1 point. (This doesn't trigger Poor Manual Dexterity; bots never cause Outrage.)",
        "<b>Crackdown:</b> whenever an Alliance base is removed, remove all sympathy tokens from clearings matching the base's suit.",
        "<b>Martial Law:</b> placing sympathy in a clearing with three or more warriors of one enemy scores one point fewer (minimum zero).",
        "Poor Manual Dexterity, like every bot. (It doesn't list Hates Surprises: it never initiates battles.)"
      ]) + "<h4>Birdsong</h4>" + RT.ol([
        "<b>Reveal order:</b> draw and reveal an order card.",
        "<b>Craft order:</b> if it shows an available item, craft it.",
        "<b>Revolt:</b> if the order isn't a bird and the <b>ordered base</b> isn't on the map, remove all enemy pieces from the ordered sympathetic clearing with the most enemy pieces matching a base on your faction board, then place the ordered base there.",
        "<b>Public Pity:</b> if you didn't revolt this Birdsong, spread sympathy (Daylight step 1): <b>twice</b> with zero to four sympathy tokens on the map, <b>once</b> with five or more. (You spread again in Daylight.)"
      ]) + "<p class='inline-note'>What stops a revolt: a bird order; the ordered base already on the map; or no sympathetic clearing matching a base not yet on the map. Each failure triggers Public Pity.</p>" +
      "<h4>Daylight</h4>" + RT.ol([
        "<b>Spread Sympathy:</b> place a token in an <b>ordered unsympathetic clearing</b> adjacent to any sympathetic clearing, with the <b>fewest enemy warriors</b>; score the points revealed on the board (remember Martial Law)." + RT.ul([
          "<b>No such clearing:</b> place it in the clearing with the fewest enemy pieces.",
          "<b>Cannot spread</b> (track empty, or nowhere to place): score <b>5 points</b> instead."
        ]),
        "<b>Surprise Revolt</b> (bird order only): remove all enemy pieces from the sympathetic clearing with the most enemy pieces matching a base on your board, then place the matching base there (several: highest priority)."
      ]) + "<h4>Evening</h4>" + RT.ol([
        "<b>Organize:</b> in each clearing with a base and three or more Alliance warriors, remove all Alliance warriors there, then spread sympathy.",
        "<b>Recruit:</b> place one warrior in each clearing with a base.",
        "<b>Discard</b> the order card."
      ]);
  },
  src: function (c) { return RT.join(["Rootbotics p.8–9 §6", "p.2 §2.8.2", RT.diffTraitsSrc(c, "alliance")]); } };

RT.vagabotRefHtml = function (c, seat) {
  var sel = RT.vbotOf(c, seat).id, other = c.bot(seat === "vagabond" ? "vagabond2" : "vagabond") ? RT.vbotOf(c, seat === "vagabond" ? "vagabond2" : "vagabond").id : null;
  var acts = {
    thief: "Take a random card from the enemy in your clearing with the most victory points (tie: the one with the most pieces there).",
    tinker: "Search the discard pile for the topmost card with an available item and craft it (score only 1 point). Starts with one fewer item.",
    ranger: "If you have three or more damaged items, slip into a random adjacent forest.",
    vagrant: "Initiate a battle in your clearing: you choose the attacker, then the defender (by setup priority), and you remove pieces for each.",
    scoundrel: "If your clearing has three or more enemy pieces, including one building or token, remove all enemy pieces there. Place any one of your items in your clearing, covering a building slot (no building can be placed there). Score 1 point.",
    arbiter: "Before rolling in battle, the defender may enlist the Arbiter if he's in the clearing: he scores 1 point and adds the items on his Battle Track to the defender's maximum rolled hits. Defending bots will enlist him if all three hold: their maximum rolled hits is under three; it's under the number of enemy pieces in the battle; and they have more victory points than the Arbiter."
  };
  var rows = RT.vagabots.filter(function (v) { return c.has(v.set); }).map(function (v) {
    var on = v.id === sel || v.id === other;
    return "<tr" + (on ? " class='sel'" : "") + "><td>" + (on ? "<b>" + v.name + "</b> ✓" : v.name) + "<br><span class='muted'>" + RT.expMeta[v.set].name + "</span></td><td>" + acts[v.id] + "</td></tr>";
  }).join("");
  return "<p>The Vagabot is a capricious friend or foe: like a human Vagabond he rewards those who craft items, but once he has enough items to boost his maximum hits he's a dangerous enemy.</p>" + RT.diffTraitsHtml(c, seat) +
    "<h4>Abilities</h4>" + RT.ul([
      "<b>Lone Wanderer:</b> the pawn isn't a warrior (he can't rule or stop anyone ruling) and can't be removed from the map. <b>Full Removal:</b> whenever an enemy uses an effect that removes all enemy pieces from his clearing (Alliance revolts, Favor cards, Corvid bombs…), he damages three items.",
      "<b>Nimble:</b> he moves regardless of who rules either clearing.",
      "<b>Items:</b> all items are <b>identical</b> to him (a hammer is as good as a tea). Items are face up or face down; he <b>exhausts</b> undamaged items (flips them face down) to act. Gained items go face up in the Satchel; repaired items stay on their current side.",
      "<b>Battle Track:</b> his maximum rolled hits starts at <b>one</b> (swords don't count). While he has at least 6, 9 and 12 undamaged items, one, two or three items — exhausted before unexhausted — sit on the Battle Track, left to right: the <b>6th and 9th</b> each add one maximum rolled hit, the <b>12th</b> deals one extra hit as attacker. Battle Track items can't be exhausted, but can be damaged.",
      "<b>Taking hits:</b> he damages exhausted items first, then unexhausted ones (which may drop items off the Battle Track into the Satchel).",
      RT.botAbilities
    ]) + "<h4>Birdsong</h4>" + RT.ol([
      "<b>Reveal order:</b> draw and reveal an order card.",
      "<b>Craft order:</b> if it shows an available item, craft it.",
      "<b>Slip:</b> if you have <b>two or fewer undamaged items</b>, move into a random adjacent forest, skip Daylight and begin Evening."
    ]) + "<h4>Daylight — the order card sets the actions, in this sequence</h4>" +
    "<table class='rt'><thead><tr><th>Order</th><th>Actions in order</th></tr></thead><tbody>" +
    "<tr><td>Bird</td><td>Explore, Quest, Aid, Battle</td></tr><tr><td>Fox</td><td>Explore, Battle, Special</td></tr>" +
    "<tr><td>Rabbit</td><td>Battle, Repair, Special</td></tr><tr><td>Mouse</td><td>Quest, Aid, Battle, Repair</td></tr></tbody></table>" +
    RT.ul([
      "Actions often say the <b>nearest</b> clearing: if he can act without moving, he stays; otherwise he moves to a clearing where he can, exhausting <b>one item per move</b>, the way that exhausts fewest. He moves even if he then lacks the items to act.",
      "He keeps going through the sequence until he has taken every action or has no unexhausted items (the book's example turn)."
    ]) + RT.ul([
      "<b>Explore:</b> move to the nearest ruin; exhaust one item to take a random item from under it, reveal it and put it face up in the Satchel. Remove the ruin when its last item goes. No points for exploring.",
      "<b>Quest:</b> move to the nearest clearing matching his current quest; exhaust two items (ignore the listed item types) to complete it. Discard it, score <b>1 point</b> (ignore the card's text) and draw a new quest face up.",
      "<b>Aid:</b> target the player in his clearing with a piece there, at least one item in their Crafted Items box, and the fewest victory points of those. Exhaust as many items as possible, up to the items in their Crafted Items box; take that many items from them and score that many points; they draw that many cards. (He can aid other bots — they simply score 1 point.)",
      "<b>Battle:</b> move to the nearest clearing with a piece of the player with the <b>most victory points</b>; exhaust one item to battle them. While any of their pieces remain, exhaust two items and battle again, until you lack the items. Score <b>1 point per enemy warrior</b> you remove (not as defender; buildings and tokens score as normal). Destination ties: where they have the most buildings and tokens → the fewest warriors.",
      "<b>Repair:</b> with at least one damaged item, exhaust one item to repair one. Repair unexhausted damaged items before exhausted ones; a repaired item keeps its side.",
      "<b>Special:</b> exhaust one item for the character card's action (below). Skip it if it would do nothing or is impossible."
    ]) + "<h4>Evening</h4>" + RT.ol([
      "<b>Refresh:</b> with at least one damaged item, refresh <b>four</b> undamaged items; with none damaged, refresh <b>six</b>.",
      "<b>Repair:</b> in a forest, repair all items; otherwise repair one (unexhausted before exhausted).",
      "<b>Discard</b> the order card."
    ]) + "<h4>Vagabot characters</h4><p>Vagabot cards in your collection (✓ = in play); they're different from the Vagabond's character cards.</p>" +
    "<table class='rt'><thead><tr><th>Character</th><th>Special action</th></tr></thead><tbody>" + rows + "</tbody></table>";
};
RT.vagabotRefSrc = function (c, seat) { return RT.join(["Rootbotics p.10–12 §7", RT.diffTraitsSrc(c, seat)]); };
RT.botRef.vagabot = { title: "Vagabot", html: function (c) { return RT.vagabotRefHtml(c, "vagabond"); }, src: function (c) { return RT.vagabotRefSrc(c, "vagabond"); } };
RT.botRef.vagabot2 = { title: "Vagabot",
  html: function (c) {
    return c.bot("vagabond") ? "<p>The second Vagabot plays exactly like the first — see the Vagabot section above.</p>" + RT.diffTraitsHtml(c, "vagabond2") : RT.vagabotRefHtml(c, "vagabond2");
  },
  src: function (c) { return c.bot("vagabond") ? RT.join(["Rootbotics p.10–11 §7", RT.diffTraitsSrc(c, "vagabond2")]) : RT.vagabotRefSrc(c, "vagabond2"); } };

RT.botRef.lizbot = { title: "Logical Lizards",
  html: function (c) {
    return "<p>The Lizards convert all unbelievers, willing or not. Watch their <b>Lost Souls</b> — lots of cards matching your clearings means a flood of warriors — hurt them by removing gardens, and don't hand them too many acolytes.</p>" + RT.diffTraitsHtml(c, "lizard") +
      "<h4>Abilities</h4>" + RT.ul([
        "<b>Pilgrims:</b> they rule every clearing with a garden (as normal).",
        "<b>Robot Revenge:</b> whenever any number of Lizard warriors are removed, one of them goes to the <b>Acolytes</b> box instead of the supply.",
        "<b>Gardens:</b> when a garden is removed from the map, put the top card of the Lost Souls into the discard pile.",
        "<b>Lost Souls:</b> whenever <b>any card is spent or discarded</b>, it goes face up on the Lizards' Lost Souls pile." +
          (c.fac("diaspora") ? " <i>Frog cards are the exception: a discarded frog card goes to the Pond, not the Lost Souls — the Law's ruling for the Lizard Cult (Law p.19 §16.2.3).</i>" : ""),
        RT.botAbilities
      ]) + "<h4>Birdsong</h4>" + RT.ol([
        "<b>Set order:</b> the order is the <b>most common suit in your Lost Souls</b>; on a tie, bird.",
        "<b>Perform conspiracies:</b> while you have acolytes, move the conspiracy marker one space right (off the right end: back to the leftmost space) and perform the conspiracy it covers, if able — removing an acolyte if you do. Continue until you have no acolytes. Pick the target player first, then the clearing." + RT.ul([
          "<b>Convert:</b> in an ordered clearing, replace an enemy warrior with a Lizard warrior. Target player: most points. Clearing tie: most enemy buildings.",
          "<b>Crusade:</b> battle in each ordered clearing with two or more Lizard warriors. Defender tie: the player there with the most points.",
          "<b>Sanctify:</b> in an ordered clearing, replace an enemy building with a garden matching the clearing's printed suit. Target player: most points. Clearing tie: fewest enemy warriors."
        ])
      ]) + "<p class='inline-note'>The Conspiracy track reads Convert · Crusade · Convert · Crusade · Sanctify (pictured in the example turn); setup starts the marker on Sanctify.</p>" +
      "<h4>Daylight</h4><p>Reveal the <b>top four cards</b> of your Lost Souls one at a time (they're already face up: move them to your play area) and perform a ritual for each:</p>" + RT.ul([
        "<b>Rabbit, fox or mouse:</b> place a warrior in a matching clearing; then, if you rule it, place a matching garden there. Clearing ties: free building slots, then most enemy buildings.",
        "<b>Bird:</b> remove a Lizard warrior from the clearing with the most Lizard warriors and put it in the Acolytes box. That card goes to the discard pile, not the Lost Souls."
      ]) + "<h4>Evening</h4>" + RT.ol([
        "<b>Score</b> the points above the rightmost empty <b>ordered</b> Gardens space (bird order: the track with the fewest gardens).",
        "<b>Discard Lost Souls:</b> discard every card in your Lost Souls pile.",
        "<b>Return revealed cards</b> to the Lost Souls in the order revealed (the first revealed on top).",
        "<b>Craft:</b> reveal the top card of the deck and craft it if it shows an available item (1 point); then put it on top of your Lost Souls, crafted or not."
      ]);
  },
  src: function (c) { return RT.join(["Rootbotics p.15–17 §8", RT.diffTraitsSrc(c, "lizard"), c.fac("diaspora") ? "Law p.19 §16.2.3" : ""]); } };

RT.botRef.riverbot = { title: "Riverfolk Robots",
  html: function (c) {
    return "<p>The Riverfolk Robots supply shiny swords and good boats. The more services you buy, the stronger they grow — but they turn nasty if nobody buys anything.</p>" + RT.diffTraitsHtml(c, "riverfolk") +
      "<h4>Abilities</h4>" + RT.ul([
        "<b>The Market:</b> a row of five face-up cards; its order can't be changed.",
        "<b>Trade posts:</b> unlike for the human Riverfolk, removed trade posts return to the bot's faction board.",
        "<b>Protectionism</b> (checked whenever they Organize): an empty Payments box fulfils the <b>shield</b> condition; no warriors in their supply fulfils the <b>sword</b> condition. A fulfilled condition makes them take every action showing its icon for the rest of that turn.",
        RT.botAbilities
      ]) + "<h4>Services (other players buy them)</h4>" + RT.ul([
        "At the <b>start of their Birdsong</b>, another player may buy <b>one service, plus one per clearing</b> with their faction pieces and a trade post.",
        "They pay by placing warriors in the Riverfolk's <b>Payments</b> box. A faction with no warriors: the Riverfolk place that many Riverfolk warriors instead.",
        "<b>Price per service</b> depends on the buyer's score: <b>2 warriors</b> at 0–9 points, <b>3</b> at 10–19, <b>4</b> at 20 or more. They won't sell to a player with a dominance victory condition.",
        "<b>Hand Card:</b> take any card from the Market into your hand.",
        "<b>Riverboats:</b> treat rivers as paths until the end of your turn.",
        "<b>Mercenaries:</b> for battle and rule in Daylight and Evening, treat Riverfolk warriors as your own, except in battle against the Riverfolk. In battle, split hits: take the odd hits by removing your own (not Riverfolk) warriors, or your own buildings or tokens only if there are no warriors of yours or the Riverfolk's in the clearing. As normal, you can't move them, count them for dominance, or remove them except by taking hits" + (c.vbH ? ", and the Vagabond can't buy Mercenaries" : "") + ".",
        c.botFacs.some(function (id) { return id !== "riverfolk"; }) ? "Bots buy and use services by the <b>Services cards</b> (" + (c.has("clockwork2") ? (c.services === "advanced" ? "Basic and Advanced" : "Basic only") : "Clockwork 2 — not in this collection") + ")." : ""
      ]) + "<h4>Birdsong</h4>" + RT.ol([
        "<b>Stock the Market:</b> draw cards and add them face up to its right side until it has five.",
        "<b>Craft</b> the first card added to the Market this turn that shows an available item (1 point), then discard it, leaving four.",
        "<b>Set order:</b> the order is the <b>rightmost</b> Market card."
      ]) + "<h4>Daylight</h4>" + RT.ol([
        "<b>Build and Garrison:</b> place a trade post and a warrior in an ordered clearing without a trade post. Tie: a clearing with faction pieces of the player with the most warriors in Payments.",
        "<b>Recruit:</b> place a warrior in each ordered clearing (bird order: in each clearing on the river). Running out of warriors: highest-priority clearings first.",
        "<b>Organize:</b> check Protectionism. If the sword or shield condition is fulfilled, score <b>1 point</b> and place two warriors in a clearing with Riverfolk pieces and the most enemy pieces.",
        "<b>Battle:</b> with the <b>shield</b>, battle in each clearing and skip to Evening (ignoring the sword). Otherwise, with the <b>sword</b>, battle in each ordered clearing. Defender tie: the player with the fewest warriors in Payments."
      ]) + "<h4>Evening</h4>" + RT.ol([
        "<b>Score</b> 1 point per warrior in Payments belonging to the player with the most warriors there; return all of those warriors to their supply.",
        "<b>Racketeering:</b> with the sword or shield, take all but two Riverfolk warriors from each clearing and put them in Payments.",
        "<b>Discard</b> the leftmost Market card — with the shield, discard the leftmost card again."
      ]);
  },
  src: function (c) { return RT.join(["Rootbotics p.18–19 §9", "Law p.12 §11.2.7.III", RT.diffTraitsSrc(c, "riverfolk")]); } };

RT.botRef.duchybot = { title: "Drillbit Duchy",
  html: function (c) {
    return "<p>The Duchy invade from below, emerging from fresh tunnels at a moment's notice; as they dig in, their ministers grow bold. Punish them by destroying their buildings and driving them back into the dark.</p>" + RT.diffTraitsHtml(c, "duchy") +
      "<h4>Abilities</h4>" + RT.ul([
        "<b>Cost of Errors:</b> whenever any number of Duchy buildings are removed, remove the crown from the swayed minister <b>closest to the bottom</b>.",
        "<b>The Burrow:</b> an unsuited clearing adjacent to each clearing with a tunnel. Non-Duchy pieces can't be placed or moved into it; the Duchy always rule it, even with no pieces there (as normal).",
        RT.botAbilities
      ]) + "<h4>Birdsong</h4>" + RT.ol([
        "<b>Set order:</b> reveal the top card of the deck as the order card.",
        "<b>Craft</b> the order card if it shows an available item (1 point).",
        "<b>Recruit:</b> place <b>two warriors, plus one per Mole icon</b> showing on your faction board, into the Burrow."
      ]) + "<h4>Daylight</h4>" + RT.ol([
        "<b>Dig:</b> if the Burrow has <b>four or more</b> warriors, place a tunnel in an ordered clearing with no tunnel and no Duchy buildings, then move four warriors from the Burrow there. Ties: a non-bird order → most empty building slots, then fewest warriors; a bird order → most enemy buildings and tokens. No tunnel in supply: take one from the clearing with the fewest Duchy warriors.",
        "<b>Battle</b> in each ordered clearing. Defender tie: most buildings there → most pieces there → most points.",
        "<b>Build</b> in the clearing you rule with the most Duchy warriors: a <b>citadel</b> if you have nine or more warriors in your supply, otherwise a <b>market</b>. If you can't place a building but have any on your faction board, score 1 point.",
        "<b>Act with ministers:</b> take the actions of all swayed ministers, top to bottom (the Captain and Foremole are abilities, not actions)."
      ]) + "<h4>Evening</h4>" + RT.ol([
        "<b>Rally:</b> in each ordered clearing with no Duchy buildings and two or fewer Duchy warriors, move all Duchy warriors there to an adjacent clearing with a Duchy building (tie: fewest Duchy warriors; no such clearing: put them in the Burrow instead). Then, in each clearing you rule, put all but four Duchy warriors into the Burrow.",
        "<b>Score</b> 1 point per market on the map.",
        "<b>Sway:</b> place a crown on the topmost <b>ordered</b> minister without one. If no minister is ordered (a bird order included), crown the bottommost minister without a crown.",
        "<b>Discard</b> the order card."
      ]) + "<h4>Ministers (top to bottom on the bot's board)</h4><table class='rt'><thead><tr><th>Minister</th><th>When swayed</th></tr></thead><tbody>" +
      "<tr><td>Captain</td><td><i>Ability:</i> as attacker in battle, deal an extra hit if the battle clearing has a tunnel.</td></tr>" +
      "<tr><td>Marshal</td><td>Place a warrior in the clearing with the fewest Duchy warriors and at least one Duchy building.</td></tr>" +
      "<tr><td>Foremole</td><td><i>Ability:</i> in your Recruit step, place one more warrior in the Burrow.</td></tr>" +
      "<tr><td>Brigadier</td><td>If the Burrow has three or more warriors, take the Dig action; its first tie for target clearing is the clearing with the most enemy buildings and tokens.</td></tr>" +
      "<tr><td>Banker</td><td>Take the Build action.</td></tr>" +
      "<tr><td>Mayor</td><td>Remove a Duchy warrior from the clearing you rule with the most Duchy warriors; if you do, score 1 point.</td></tr>" +
      "<tr><td>Earl of Stone</td><td>Score 1 point per citadel on the map.</td></tr>" +
      "<tr><td>Baron of Dirt</td><td>Score 1 point per market on the map.</td></tr>" +
      "<tr><td>Duchess of Mud</td><td>Score 2 points if all tunnels are on the map.</td></tr></tbody></table>" +
      "<p class='inline-note'>Each minister shows its suit on the board (the example shows the Brigadier fox, Banker rabbit and Mayor mouse).</p>";
  },
  src: function (c) { return RT.join(["Rootbotics p.20–22 §10", RT.diffTraitsSrc(c, "duchy")]); } };

RT.botRef.corvbot = { title: "Cogwheel Corvids",
  html: function (c) {
    return "<p>The Corvids rule by fear. Snuff out their plots before they resolve them, and watch for big build-ups of warriors — those let them hatch plots and resolve them immediately.</p>" + RT.diffTraitsHtml(c, "corvid") +
      "<h4>Abilities</h4>" + RT.ul([
        "<b>Nimble:</b> they move regardless of who rules either clearing (as normal).",
        "<b>Embedded Agents:</b> as defender, with a face-down plot (even defenseless) in the clearing of battle, they deal an extra hit (as normal).",
        RT.botAbilities
      ]) + "<h4>Birdsong</h4>" + RT.ol([
        "<b>Set order:</b> reveal the top card of the deck as the order card.",
        "<b>Craft</b> the order card if it shows an available item (1 point).",
        "<b>Recruit:</b> place <b>two warriors in each of two ordered clearings</b>. Ties: no plot tokens, then most Corvid warriors. Out of warriors (even midway): do <b>The Plot Thickens</b> at once, then place the rest.",
        "<b>Flip plots:</b> flip every face-down plot (no warrior needed; in priority order). Each flip scores <b>1 point per face-up plot on the map</b>, then resolves the plot's flip effect."
      ]) + "<h4>Daylight</h4>" + RT.ol([
        "<b>Battle</b> in each ordered clearing with two or more Corvid warriors. Defender tie: most buildings and tokens there → most victory points.",
        "<b>Move</b> all but two Corvid warriors from each ordered clearing with a face-up plot to an adjacent clearing with no plot (tie: most Corvid warriors; every neighbour has a plot: the adjacent clearing of lowest priority).",
        "<b>Plot:</b> in the ordered clearing with the most Corvid warriors and no plot, remove one Corvid warrior to place a random face-down plot.",
        "<b>The Plot Thickens:</b> if any clearing has no plot and three or more Corvid warriors, remove one Corvid warrior there to place a random face-down plot (tie: most Corvid warriors)."
      ]) + "<h4>Evening</h4>" + RT.ol(["<b>Score</b> 1 point per face-up Extortion plot on the map.", "<b>Discard</b> the order card."]) +
      "<h4>Plots (the bot's)</h4><table class='rt'><thead><tr><th>Plot</th><th>Effect</th></tr></thead><tbody>" +
      "<tr><td>Bomb</td><td>When flipped, remove all enemy pieces in its clearing, then swap the bomb with a random plot from your supply, placed face up (it doesn't trigger, and can be another bomb).</td></tr>" +
      "<tr><td>Snare</td><td>While face up, enemy pieces can't be placed in or moved from its clearing (as normal).</td></tr>" +
      "<tr><td>Extortion</td><td>When flipped, each player with faction pieces in its clearing discards one card at random.</td></tr>" +
      "<tr><td>Raid</td><td>When removed, place one warrior in each adjacent clearing (as normal).</td></tr></tbody></table>";
  },
  src: function (c) { return RT.join(["Rootbotics p.22–23 §11", RT.diffTraitsSrc(c, "corvid")]); } };

RT.botRef.mmorig = { title: "Original Mechanical Marquise",
  html: function (c) {
    return "<p>The Riverfolk expansion's automated Marquise: it replaces a human Marquise in a competitive game, or opposes a team of one to four players in the cooperative game. One player sitting near it runs its turns.</p>" +
      "<p class='inline-note'>An older bot: <b>Mechanical Marquise 2.0</b> (Clockwork, Law of Rootbotics) is the newer Marquise bot. This page never combines the original with Law of Rootbotics bots.</p>" +
      "<h4>Abilities</h4>" + RT.ul([
        "<b>Poor Manual Dexterity:</b> it has no hand and can't be forced to discard. If you would take a card from its hand, draw from the deck instead. If you would give it a card, discard the card and it scores 1 point.",
        "<b>Hates Surprises:</b> ambush cards can't be played against it.",
        "It uses the Marquise de Cat's pieces (so no human Marquise) but <b>not her buildings</b>. Its board's Clearing Priority box breaks ties."
      ]) + "<h4>Birdsong</h4>" + RT.ul([
        "Score <b>2 points per clearing you rule</b> with at least three of your warriors." + (c.v("coop") ? " <b>Cooperative game:</b> also score <b>1 point per human player</b>." : "")
      ]) + "<h4>Daylight</h4><p>Reveal the <b>leftmost</b> card of the Schedule of Orders, take these steps, then discard it. Battle and move happen in all clearings matching the <b>order's suit</b>; recruiting follows its <b>crafting cost</b>.</p>" + RT.ol([
        "<b>Battle</b> in each matching clearing with your warriors and any enemy pieces. Several enemies: the defender has the most pieces there, then the most victory points, then the highest setup priority (A, B, C…).",
        "<b>Move:</b> going up from the clearing with the lowest number in the Clearing Priority box (1, 2…), move from matching clearings you rule with <b>four or more</b> of your warriors: all but three go to the adjacent clearing with the most enemy pieces (tie: the lowest Clearing Priority number).",
        "<b>Recruit</b> by the order's crafting cost" + RT.ul([
          "<b>1–3 of one suit:</b> that many warriors in each clearing you rule of that suit.",
          "<b>One of each suit:</b> one warrior in each clearing you rule.",
          "<b>Four of any suits</b> (“?” icons): four warriors in the keep's clearing.",
          "<b>No crafting cost:</b> restart Daylight with the next order card — if the Schedule has none left, go to Evening.",
          c.v("coop") ? "<b>Cooperative game:</b> it recruits in <b>all clearings matching the suit of the crafting cost</b>, regardless of rule." : ""
        ])
      ]) + "<h4>Evening</h4>" + RT.ul(["Draw cards and add them to the <b>right side</b> of the Schedule of Orders until it has five."]) +
      "<h4>Spy cards (for the humans)</h4>" + RT.ul([
        "The four spy cards replace the dominance cards. They follow the dominance cards' rules for playing, discarding and taking <b>available</b> cards, but don't change your victory condition. (The card: “May play at no cost.”)",
        "With a spy card in your play area you may <b>reveal one order card</b> in your Daylight. If it matches your spy's suit (birds aren't wild for this), discard the spy at once — it becomes available. Otherwise you may <b>swap any two order cards</b>."
      ]) + (c.solo ? "<p class='inline-note'><b>Solo play:</b> Favor of the Foxes, Favor of the Rabbits and Favor of the Mice are out of the deck.</p>" : "");
  },
  src: function (c) { return RT.join(["Riverfolk p.6–7", c.v("coop") || c.solo ? "Riverfolk p.8" : ""]); } };

/* ---------- Playing with bots: Law of Rootbotics §1–2, §3.3, §12 and the cross-faction rules ---------- */
RT.botRef._general = {
  title: function (c) { return RT.mmOnly(c) ? "Playing against the original Mechanical Marquise" : "Playing with bots"; },
  html: function (c) {
    if (RT.mmOnly(c)) {
      var h = RT.ul([
        "Its full rules are in its own section below. Everything else follows the Law of Root.",
        "<b>Dominance:</b> the four dominance cards are out of the deck; the four <b>spy cards</b> are in it instead.",
        c.solo ? "<b>Solo:</b> Favor of the Foxes, Favor of the Rabbits and Favor of the Mice are out of the deck." : "",
        c.vbH ? "<b>Vagabond:</b> aiding it means giving it a card — you discard the card and it scores 1 point (Poor Manual Dexterity)." : ""
      ]);
      if (c.v("coop")) h += "<h4>Cooperative play</h4>" + RT.ul([
        "You win as a team if <b>every player</b> scores 30 points before the Mechanical Marquise does.",
        "It also scores <b>1 point per human player</b> in Birdsong, and recruits in all clearings matching the suit of the crafting cost, regardless of rule.",
        c.v("campaign") ? "<b>Campaign:</b> each time the players win, the Mechanical Marquise starts the next game with <b>3 more points</b>, and each player starts with <b>one crafted card</b> from their final play area of the last game. (Example: after two wins, Patrick starts with a card he crafted in game two plus the one he kept from game one, and the Marquise begins on 6.)" : ""
      ]);
      var later0 = RT.botsUncovered(c).concat(["lake", "mountain", "marsh", "gorge"].indexOf(c.map) >= 0 ? ["the " + RT.M[c.map].name + " map"] : []);
      if (later0.length) h += "<h4>Not covered by its rules</h4>" + RT.ul(["The Riverfolk book's Mechanical Marquise rules (2020) don't mention " + RT.list(later0) + ". It follows its own rules and the Law of Root; the sources don't say how it handles these."]);
      h += "<p class='inline-note'>Suggested scenarios with it (Riverfolk p.8): solitaire against it with the Eyrie, the Vagabond or the Lizard Cult; cooperative with two Vagabonds, Eyrie + Alliance, Alliance + Vagabond, or Vagabond + Eyrie (three or four humans: add one or two factions). Competitive: swap it for the Marquise in any suggested mix.</p>";
      return h;
    }
    var rb = RT.rbFacs(c);
    var h2 = "<p>Bots are automated players (Law of Rootbotics). “Player” means humans and bots alike. Games with bots follow the Law of Root, with these changes.</p>" +
      "<h4>Changes to the Law with bots</h4>" + RT.ul([
        "<b>Crafting:</b> bots craft without activating crafting pieces (the item must still be in the supply). Any item a bot crafts scores it <b>1 point</b>, whatever the card lists. Bots can't craft cards with persistent effects.",
        "<b>Taking hits:</b> a bot removes all its tokens in the clearing of battle before any of its buildings there; with several building types it could remove, it picks at random.",
        "<b>Dominance:</b> bots can't play a dominance card to change their victory condition."
      ]) + "<h4>How bots choose</h4>" + RT.ul([
        "<b>Order cards:</b> on its turn a bot draws and reveals an order card that sets some of its actions. <b>Ordered</b> means matching the order card's suit.",
        "<b>Clearing priority:</b> a bot follows its action's rules; if they leave a choice, it targets the clearing of <b>highest priority</b> (marker 1 is highest, 12 lowest) among those.",
        "<b>Player priority:</b> likewise it targets the player with the highest <b>setup priority</b>, starting with the Marquise de Cat's “A”.",
        "<b>Target legality:</b> a bot targets only what the rules allow. If it can't target the prompted clearing or player, it tries the others tied with it, then the next in priority order. (Told to battle where there are the most enemy warriors but it has no warriors there, it tries the other such clearings, then the clearing with the second most, and so on until it battles or has tried them all.)",
        "<b>Action order:</b> when a bot takes several actions whose order could matter, it goes from highest to lowest target priority — when moving, by the priority of the <b>origin</b> clearings.",
        "<b>“Such a clearing”</b> means the clearing meeting every targeting criterion the action has listed so far (likewise such clearings, such a player, such players)."
      ]) + "<h4>Every bot's abilities</h4>" + RT.ul([
        "<b>Poor Manual Dexterity:</b> bots have no hand of cards and can't discard. If a human would take a card from a bot, that human draws a card instead. If a human would give a card to a bot, discard it and the bot scores 1 point.",
        "<b>Hates Surprises:</b> ambush cards can't be played against bots."
      ]) + "<h4>Difficulty and traits</h4>" + RT.ul(rb.map(function (id) { return "<b>" + RT.botName(c, id) + ":</b> " + RT.diffLine(c, id) + "."; }).concat([
        "Difficulty and trait cards modify the bot's rules; their text is on the cards, not in the Law of Rootbotics. The Clockwork box holds 12 difficulty and 16 trait cards" + (c.has("clockwork2") ? "; Clockwork 2 holds 12 difficulty and 20 trait cards" : "") + "."
      ])) + "<h4>Priority markers on this map</h4>" + RT.priorityHtml(c, false) +
      "<h4>Bots on this map</h4>" + RT.ul([
        c.map === "lake" ? "<b>Ferry:</b> bots use the Ferry by the normal movement rules, treating the Ferry's clearing as linked by a path to every other coastal clearing. They score 1 point instead of drawing a card." : "",
        c.map === "mountain" ? "<b>Closed paths:</b> bots treat closed paths as paths and ignore the rules for opening them." : "",
        c.map === "mountain" ? "<b>The Pass:</b> whenever a bot targets a clearing by highest or lowest priority, the Pass always meets that condition — bots will likely target it, and it wins every tiebreaker." : "",
        c.map === "autumn" || c.map === "winter" ? "No special bot rules on the " + RT.M[c.map].name + " map." : "",
        c.map === "marsh" || c.map === "gorge" ? "The Law of Rootbotics (2021) has no rules or chart for the " + RT.M[c.map].name + " map, which came later with Homeland." : ""
      ]);
    if (c.fac("riverfolk") && rb.some(function (id) { return id !== "riverfolk"; })) h2 += "<h4>Riverfolk services and bots</h4>" + RT.ul([
      c.has("clockwork2") ? "How bots buy and use the Riverfolk's services — human or bot Riverfolk — is on the <b>Services cards</b>: 3 Basic and 8 Advanced. Use only the Basic cards, or both, for every bot in play. Tonight: <b>" + (c.services === "advanced" ? "Basic and Advanced" : "Basic only") + "</b>." :
        "How bots use the Riverfolk's services is on the Services cards from Clockwork 2, which isn't in this collection; the sources don't cover bots and services without them."
    ]);
    if (c.fac("corvid")) h2 += "<h4>Corvid plots and bots</h4><p>Whether the Corvids are human or bot, their plots treat bots like this:</p>" + RT.ul([
      "<b>Bomb:</b> when flipped, it removes <b>two pieces of each bot</b> in the clearing (warriors first) instead of all their pieces.",
      "<b>Snare:</b> bots ignore snares when targeting clearings to place or move pieces. If a bot would place in, or move out of, a clearing with a snare, remove the snare instead of doing that part of the action."
    ]);
    if (RT.arbiterInPlay(c)) h2 += "<h4>The Arbiter and bots</h4>" + RT.ul(["Bots treat the Arbiter the same way, human or bot: a defending bot will enlist him if its maximum rolled hits is under three, under the number of enemy pieces in the battle, and it has more victory points than the Arbiter."]);
    if (c.fac("alliance") && c.human("alliance")) h2 += "<h4>Outrage and bots</h4>" + RT.ul(["A bot that moves into sympathy or removes it causes Outrage as normal; it has no hand, so the Alliance draws a card and adds it to its Supporters stack (the book's Electric Eyrie example)."]);
    var later = RT.botsUncovered(c);
    if (later.length) h2 += "<h4>Not covered by the bot rules</h4>" + RT.ul(["The Law of Rootbotics doesn't mention " + RT.list(later) + ". Bots follow their own rules and the Law of Root; the sources don't say how bots handle these."]);
    if (c.v("coop")) h2 += "<h4>Fully cooperative play</h4>" + RT.ul([
      "All four dominance cards are removed during setup.",
      "To win, the humans must <b>each</b> score 30 points before <b>any</b> bot scores 30.",
      "Bots don't treat bot pieces as enemy pieces when targeting a clearing to act in, and don't target each other in battle — though one may still remove bot pieces as collateral damage (revolts and the like).",
      "The humans still treat each other as enemies (so they can remove each other's buildings and tokens for points).",
      "<i>Want a leg up?</i> The book suggests treating the humans' pieces as one team in various ways — combining them for rule, say — making judgment calls on the odd interaction and erring on the side of challenge."
    ]);
    return h2;
  },
  src: function (c) {
    if (RT.mmOnly(c)) return RT.join(["Riverfolk p.6–8"]);
    return RT.join(["Rootbotics p.2 §1–2 · p.3 §3.3", RT.prioritySrc(c), "Law p.25 §C.6–C.7",
      c.map === "lake" ? "Rootbotics p.24 §12.1" : "", c.map === "mountain" ? "Rootbotics p.24 §12.2" : "",
      c.fac("riverfolk") && RT.rbFacs(c).some(function (id) { return id !== "riverfolk"; }) ? "Rootbotics p.18 §9.7" : "",
      c.fac("corvid") ? "Rootbotics p.22 §11.8" : "",
      RT.arbiterInPlay(c) ? "Rootbotics p.11 §7.7.6" : "",
      c.human("alliance") ? "Rootbotics p.7" : "", c.v("coop") ? "Rootbotics p.3" : ""]);
  } };

/* ---------- bot exceptions inside the core reference sections (data-ref.js RT.core) ---------- */
var RTB = function (type) { return function (c) { return RT.hasBot(c, type); }; };
RT.coreExc.turn = (RT.coreExc.turn || []).concat([
  { when: function (c) { return c.rb; }, src: "Rootbotics p.2 §2.7, §2.8.1",
    t: "<b>Bots' turns:</b> each bot runs its own Birdsong, Daylight and Evening from its board, driven by an <b>order card</b> (“ordered” = matching its suit). Bots have no hand." },
  { when: RTB("riverbot"), src: "Rootbotics p.18 §9.2.3",
    t: "<b>Buy Riverfolk Robots services</b> at the <b>start of your Birdsong</b>: one, plus one per clearing with your faction pieces and a trade post — <b>2 / 3 / 4 warriors</b> each at 0–9 / 10–19 / 20+ points." },
  { when: function (c) { return RT.mmOnly(c); }, src: "Riverfolk p.6–7",
    t: "<b>Original Mechanical Marquise:</b> it runs on its <b>Schedule of Orders</b> (five face-down cards), revealing the leftmost each Daylight; it has no hand." }
]);
RT.coreExc.victory = (RT.coreExc.victory || []).concat([
  { when: function (c) { return c.rb; }, src: "Rootbotics p.2 §1.1.2, §1.3",
    t: "<b>Bots</b> score <b>1 point</b> for any item they craft, and can't play a dominance card to change their victory condition." },
  { when: function (c) { return c.v("coop") && c.rb; }, src: "Rootbotics p.3",
    t: "<b>Fully cooperative:</b> the humans win only if <b>each</b> of them scores 30 before <b>any</b> bot does." },
  { when: function (c) { return c.v("coop") && RT.mmOnly(c); }, src: "Riverfolk p.8",
    t: "<b>Cooperative:</b> you win as a team if every player scores 30 before the Mechanical Marquise does." }
]);
RT.coreExc.cards = (RT.coreExc.cards || []).concat([
  { when: function (c) { return c.anyBot; }, srcFn: function (c) { return RT.mmOnly(c) ? "Riverfolk p.6" : "Rootbotics p.2 §2.8"; },
    t: "<b>Bots — Poor Manual Dexterity:</b> no hand. Take a card from a bot? Draw one instead. Give a bot a card? Discard it; the bot scores 1 point. <b>Hates Surprises:</b> no ambush cards against bots." },
  { when: RTB("lizbot"), src: "Rootbotics p.15 §8.2.3–8.2.4",
    t: "<b>Logical Lizards — Lost Souls:</b> every card spent or discarded goes face up on the Lizards' Lost Souls pile; when a garden is removed, the top Lost Souls card goes to the discard pile." },
  { when: function (c) { return RT.mmOnly(c); }, src: "Riverfolk p.6–7",
    t: "<b>Spy cards</b> replace the four dominance cards: play one at no cost; in your Daylight it lets you reveal an order card and maybe swap two." }
]);
RT.coreExc.map = (RT.coreExc.map || []).concat([
  { when: RTB("eyriebot"), src: "Rootbotics p.6 §5.2.1",
    t: "<b>Electric Eyrie — Lords of the Forest:</b> they rule a clearing when tied for most warriors and buildings; never an empty clearing." },
  { when: RTB("lizbot"), src: "Rootbotics p.15 §8.2.1", t: "<b>Logical Lizards — Pilgrims:</b> they rule every clearing with a garden." },
  { when: RTB("duchybot"), src: "Rootbotics p.20 §10.2.2",
    t: "<b>Drillbit Duchy — the Burrow:</b> an unsuited clearing adjacent to every tunnel clearing; only Duchy pieces enter it, and the Duchy always rule it." },
  { when: function (c) { return RT.hasBot(c, "vagabot") || RT.hasBot(c, "vagabot2"); }, src: "Rootbotics p.10 §7.2.1",
    t: "<b>Vagabot:</b> his pawn isn't a warrior — he never rules or blocks rule — and can't be removed." },
  { when: RTB("riverbot"), src: "Rootbotics p.18 §9.2.3.III",
    t: "<b>Riverfolk Robots Mercenaries:</b> a buyer treats Riverfolk warriors as their own for rule and battle in that Daylight and Evening." },
  { when: function (c) { return c.rb; }, srcFn: function (c) { return RT.prioritySrc(c); },
    t: "<b>Priority markers</b> number the clearings 1–12 for the bots' tiebreaks." }
]);
RT.coreExc.move = (RT.coreExc.move || []).concat([
  { when: RTB("corvbot"), src: "Rootbotics p.22 §11.2.1", t: "<b>Cogwheel Corvids — Nimble:</b> they move regardless of rule." },
  { when: function (c) { return RT.hasBot(c, "vagabot") || RT.hasBot(c, "vagabot2"); }, src: "Rootbotics p.10 §7.2.2, §7.4.3",
    t: "<b>Vagabot — Nimble:</b> he ignores rule when moving; he slips into a random adjacent forest when down to two undamaged items." },
  { when: RTB("riverbot"), src: "Rootbotics p.18 §9.2.3.II", t: "<b>Riverboats</b> (a Riverfolk Robots service): rivers are paths for the buyer until the end of their turn." },
  { when: RTB("duchybot"), src: "Rootbotics p.20 §10.2.2", t: "<b>The Burrow:</b> non-Duchy pieces can't move into it." },
  { when: function (c) { return c.rb && c.fac("corvid"); }, src: "Rootbotics p.22 §11.8.2",
    t: "<b>Snares and bots:</b> bots ignore snares when targeting; a bot that would place in or move out of a snared clearing removes the snare instead of doing that part." },
  { when: function (c) { return c.anyBot && c.human("alliance"); }, srcFn: function (c) { return RT.mmOnly(c) ? "Law p.7 §8.2.6 · Riverfolk p.6" : "Rootbotics p.7 · p.2 §2.8.1"; },
    t: "<b>Outrage from a bot:</b> it has no hand, so the Alliance draws a card onto its Supporters stack." },
  { when: RTB("allybot"), src: "Rootbotics p.8 §6.2.3",
    t: "<b>Automated Outrage:</b> a human who moves warriors into a sympathetic clearing (or removes sympathy) discards a matching card — or the Automated Alliance scores 1." }
]);
RT.coreExc.battle = (RT.coreExc.battle || []).concat([
  { when: function (c) { return c.rb; }, src: "Rootbotics p.2 §1.2.1, §2.8.2",
    t: "<b>Bots taking hits:</b> after warriors, a bot removes its tokens before its buildings (building type at random). No ambush cards against bots." },
  { when: function (c) { return RT.mmOnly(c); }, src: "Riverfolk p.6", t: "<b>Hates Surprises:</b> no ambush cards against the Mechanical Marquise." },
  { when: RTB("allybot"), src: "Rootbotics p.8 §6.2.2", t: "<b>Automated Ambush:</b> defending with at least one warrior, the Automated Alliance deals an extra hit." },
  { when: RTB("corvbot"), src: "Rootbotics p.22 §11.2.2", t: "<b>Cogwheel Corvids — Embedded Agents:</b> defending with a face-down plot in the clearing, they deal an extra hit (even defenseless)." },
  { when: function (c) { return RT.hasBot(c, "vagabot") || RT.hasBot(c, "vagabot2"); }, src: "Rootbotics p.10 §7.2.4–7.2.5",
    t: "<b>Vagabot:</b> maximum rolled hits starts at 1 (swords don't count), +1 at 6 and at 9 undamaged items, and an extra hit as attacker at 12; hits damage his exhausted items first." },
  { when: RTB("lizbot"), src: "Rootbotics p.15 §8.2.2", t: "<b>Logical Lizards — Robot Revenge:</b> whenever Lizard warriors are removed, one becomes an acolyte." },
  { when: RTB("duchybot"), src: "Rootbotics p.20 §10.2.1", t: "<b>Drillbit Duchy — Cost of Errors:</b> removing Duchy buildings uncrowns their bottom-most swayed minister." },
  { when: RTB("allybot"), src: "Rootbotics p.8 §6.2.4", t: "<b>Crackdown:</b> when an Automated Alliance base is removed, all sympathy in clearings of its suit goes too." },
  { when: RTB("riverbot"), src: "Rootbotics p.18 §9.2.3.III · Law p.12 §11.2.7.IIIa", t: "<b>Riverfolk Robots Mercenaries</b> fight for their buyer (not against the Riverfolk); the buyer splits hits, taking the odd hits on their own warriors (as normal)." },
  { when: function (c) { return c.rb && c.fac("corvid"); }, src: "Rootbotics p.22 §11.8.1", t: "<b>Bombs and bots:</b> a flipped bomb removes two pieces of each bot there (warriors first), not all of them." }
]);
RT.coreExc.craft = (RT.coreExc.craft || []).concat([
  { when: function (c) { return c.rb; }, src: "Rootbotics p.2 §1.1",
    t: "<b>Bots craft</b> without crafting pieces (the item must be in the supply), score 1 point per item, and never craft persistent effects." }
]);
RT.coreExc.mapref = [
  { when: function (c) { return c.rb && c.map === "lake"; }, src: "Rootbotics p.24 §12.1",
    t: "<b>Bots and the Ferry:</b> normal movement, treating the Ferry's clearing as linked by a path to every other coastal clearing; a bot scores 1 point instead of drawing." },
  { when: function (c) { return c.rb && c.map === "mountain"; }, src: "Rootbotics p.24 §12.2",
    t: "<b>Bots on the Mountain:</b> they treat closed paths as paths and never open them; the Pass meets every highest- or lowest-priority test, so it wins all their tiebreakers." },
  { when: function (c) { return c.rb && (c.map === "marsh" || c.map === "gorge"); }, src: "Rootbotics p.3 §3.1 · p.24 §12",
    t: "<b>Bots:</b> the Law of Rootbotics has no priority chart or map rules for this map." }
];

/* =====================================================================
   TEACHING SCRIPT
   ===================================================================== */
RT.diffTeach = function (c, id) {
  var d = RT.diffOf(c, id), b = c.botCfg(id);
  return " It's on <b>" + d.name.toLowerCase() + "</b> difficulty" + (d.id === "default" ? "" : " — its difficulty card sits by its board") +
    (b.traits ? ", with <b>trait cards</b> that change its rules — we'll read them out" : "") + ".";
};
RT.botTeach.mm2 = { body: function (c) {
  return "<p>The <b>Mechanical Marquise 2.0</b> is the simplest bot, but somebody has to keep it in check. Each turn it flips an order card, crafts its item if it can, then battles in every clearing of that suit, recruits four warriors there, builds — a sawmill on a fox order, a workshop on rabbit, a recruiter on mouse — and marches all but three warriors out of each ordered clearing into the adjacent clearing with the most enemy pieces. If it built nothing and has five or fewer buildings out, it flips another order and goes again. It scores in Evening from the buildings track matching the order. A <b>bird</b> order is the scary one: it battles <b>everywhere</b>." + RT.diffTeach(c, "marquise") + "</p>";
} };
RT.botTeach.eyriebot = { body: function (c) {
  return "<p>The <b>Electric Eyrie</b> files every order card into its <b>Decree</b> by suit, so it gets stronger every turn. Each Daylight it recruits, then moves, then battles once for every column with cards — and the biggest column hits harder. It builds a roost every turn and scores its roosts each Evening; the moment it can't place a roost it falls into <b>turmoil</b>, loses a point per bird in the Decree, and the Decree is wiped back to its two Loyal Viziers. So: take away its room to build." + RT.diffTeach(c, "eyrie") + "</p>";
} };
RT.botTeach.allybot = { body: function (c) {
  return "<p>The <b>Automated Alliance</b> spreads <b>sympathy</b> every turn and <b>revolts</b> often, wiping out every enemy piece in a clearing to place a base. Two things to remember: whenever one of us moves warriors into a sympathetic clearing or removes sympathy, we must <b>discard a matching card</b> or it scores a point; and it hits back when defending. Watch the clearings it could revolt in, and don't let it pile up warriors at its bases." + RT.diffTeach(c, "alliance") + "</p>";
} };
RT.vagabotTeach = function (c, seat) {
  var vb = RT.vbotOf(c, seat);
  return "<p>The <b>Vagabot</b> — tonight the <b>" + vb.name.replace(/ \(.*\)$/, "") + "</b> — is one pawn that can't be removed. To him every item is the same: he exhausts items to work through a list of actions set by the order card's suit — exploring ruins, questing, <b>aiding</b>, battling, repairing, his special move — walking to the nearest place to do each. When he aids you he takes your crafted items and scores for them, and you draw that many cards — so he rewards crafting. In battle he hunts whoever's <b>leading</b>, and every 6th, 9th and 12th item makes him hit harder." + ({
    thief: " His special move takes a random card from whichever enemy in his clearing has the most victory points.",
    tinker: " His special move searches the discard pile for the topmost card with an available item and crafts it, and he starts with one fewer item.",
    ranger: " His special move slips him into a random adjacent forest if he has three or more damaged items.",
    vagrant: " His special move starts a battle in his clearing: he chooses the attacker and then the defender by setup priority, and removes pieces for both.",
    scoundrel: " His special move, if his clearing has three or more enemy pieces including a building or token, removes all enemy pieces there, puts one of his items over a building slot there so nothing can be built in it, and scores a point.",
    arbiter: " And when you defend in a battle in his clearing, you may enlist him before rolling: he scores a point and adds the items on his Battle Track to your maximum rolled hits."
  }[vb.id] || "") + RT.diffTeach(c, seat) + "</p>";
};
RT.botTeach.vagabot = { body: function (c) { return RT.vagabotTeach(c, "vagabond"); } };
RT.botTeach.vagabot2 = { body: function (c) { return RT.vagabotTeach(c, "vagabond2"); } };
RT.botTeach.lizbot = { body: function (c) {
  return "<p>The <b>Logical Lizards</b> feed on our cards: <b>every card any of us spends or discards</b> lands face up on their <b>Lost Souls</b> pile, and its most common suit is their order. Each Daylight they turn the top " + (RT.diffOf(c, "lizard").id === "easy" ? "three" : "four") + " of those cards into warriors and gardens — though a bird card turns one of their own warriors into an acolyte. Whenever we remove Lizard warriors, one of them becomes an <b>acolyte</b>, and each acolyte buys a conspiracy — converting our warriors, crusading, or turning our buildings into gardens, always aimed at the leader. Hurt them by removing gardens, and think twice before giving them acolytes." + RT.diffTeach(c, "lizard") + "</p>";
} };
RT.botTeach.riverbot = { body: function (c) {
  return "<p>The <b>Riverfolk Robots</b> run a shop: at the start of your Birdsong you can buy a card from their face-up <b>Market</b>, riverboats or mercenaries, paying <b>two, three or four warriors</b> depending on your score. Buying makes them stronger — each Evening they score a point per warrior from whoever paid the most — but <b>Protectionism</b> makes them nasty: with an empty Payments box they battle in <b>every</b> clearing, and once they run out of warriors they battle in every ordered one. Keep the shop open, carefully." + RT.diffTeach(c, "riverfolk") + "</p>";
} };
RT.botTeach.duchybot = { body: function (c) {
  return "<p>The <b>Drillbit Duchy</b> fill their <b>Burrow</b> every Birdsong, then burst out of a new tunnel with four warriors, battle in the ordered clearings, build citadels and markets, and score for their markets. Each Evening they sway a <b>minister</b>, and swayed ministers give them more actions every turn. The counter: whenever we destroy Duchy buildings, they <b>lose a minister's crown</b>." + RT.diffTeach(c, "duchy") + "</p>";
} };
RT.botTeach.corvbot = { body: function (c) {
  return "<p>The <b>Cogwheel Corvids</b> recruit in pairs and hide face-down <b>plots</b>; every Birdsong they flip <b>all</b> of them, scoring for each face-up plot on the map every time. Bombs blow up a clearing, snares freeze it, extortion costs us cards. And once each Daylight, if a clearing without a plot holds three or more of their warriors, they spend one of them to grow a new plot there — in their biggest such group. So snuff out plots before they flip, and break up big groups of Corvids." + RT.diffTeach(c, "corvid") + "</p>";
} };
RT.botTeach.mmorig = { body: function (c) {
  return "<p>The <b>Original Mechanical Marquise</b> from the Riverfolk box plays from a face-down <b>Schedule of Orders</b> of five cards. Each Daylight it reveals the leftmost: it battles in every clearing of that suit, marches big stacks toward us, and recruits according to the card's crafting cost. Each Birdsong it scores <b>two points for every clearing it rules with three or more warriors</b>, so break up its strongholds. Instead of dominance cards the deck holds four <b>spy cards</b>: play one free, and in your Daylight it lets you peek at an order and maybe swap two around.</p>";
} };
RT.botTeach._general = {
  h: function (c) { return RT.mmOnly(c) ? "Playing against the Mechanical Marquise" : "Playing with bots"; },
  body: function (c) {
    if (RT.mmOnly(c)) return "<p>One of us sitting next to the Mechanical Marquise runs its turns. It has <b>no hand</b>: if you'd take a card from it, draw one instead; if you'd give it one, discard it and it scores a point. And you can't ambush it." +
      (c.solo ? " Since I'm alone against it, the three Favor cards are out of the deck." : "") + (c.v("campaign") ? " This is a <b>campaign</b> game: every win so far gives it another 3-point head start and each of us another crafted card to start with, taken from our play area at the end of the last game — so the cards build up." : "") + "</p>";
    var rb = RT.rbFacs(c);
    var ordEx = [];
    if (RT.hasBot(c, "lizbot")) ordEx.push("the Logical Lizards take the most common suit in their Lost Souls (bird on a tie)");
    if (RT.hasBot(c, "riverbot")) ordEx.push("the Riverfolk Robots take the rightmost Market card");
    var ordOthers = rb.some(function (id) { var b = c.bot(id); return b !== "lizbot" && b !== "riverbot"; });
    return "<p>Tonight " + (rb.length === 1 ? "one seat is a bot" : ["", "", "two", "three", "four", "five"][rb.length] + " seats are bots") + ". A bot has <b>no hand</b>: each turn it sets an <b>order</b> — " +
      (ordEx.length ? (ordOthers ? "most bots flip an <b>order card</b>, but " : "") + ordEx.join(" and ") : "it flips an <b>order card</b>") + "; the suit tells it where to act — and then follows its board step by step, like a flowchart; one of us reads it out and moves its pieces. When a bot has to pick a clearing it uses the numbered <b>priority markers</b> on the map — 1 is its favourite; when it picks a player, it goes by setup order, Marquise first.</p>" +
      "<p>Three things change for us: you <b>can't ambush</b> a bot; if you'd take a card from a bot, you draw one instead; and if you'd give a bot a card, you discard it and the bot scores a point. Bots craft for free, but any item only scores them <b>one point</b>." +
      (c.map === "lake" ? " On the Lake the bots ride the Ferry like a path and score a point instead of drawing." : "") +
      (c.map === "mountain" ? " On the Mountain the bots walk straight through closed paths, and they love the Pass." : "") +
      (c.map === "marsh" || c.map === "gorge" ? " The bot book has no chart for this map, so we placed the priority markers ourselves." : "") +
      (c.fac("riverfolk") && rb.some(function (id) { return id !== "riverfolk"; }) && c.has("clockwork2") ? " When a bot buys the Riverfolk's services, it follows the " + (c.services === "advanced" ? "Basic and <b>Advanced Services</b>" : "<b>Basic Services</b>") + " cards." : "") +
      (c.solo ? " It's just me against " + (rb.length === 1 ? "the bot" : "the bots") + " tonight." : "") + "</p>";
  } };
RT.teachCoopHtml = function (c) {
  if (RT.mmOnly(c)) return "<p>Tonight we play <b>together</b> against the Mechanical Marquise: we win as a team only if <b>every one of us</b> reaches 30 points before it does. It scores an extra point per human each Birdsong and recruits regardless of rule, so we'll have to work together to keep it down." + (c.v("campaign") ? " Win, and the next game of our <b>campaign</b> gets harder." : "") + "</p>";
  return "<p>Tonight we play <b>together</b> against the bots: we win only if <b>each of us</b> reaches 30 points before <b>any</b> bot does — so " + (c.fac("diaspora") && !c.two ? "the four suit dominance cards are out (the Frog Dominance card is still in the deck, and the books don't say how it fits a team win)" : "no dominance cards") + ". The bots won't fight each other, but we can still hurt each other, so share the work.</p>";
};
RT.botLater = function (c) {
  var a = [];
  if (c.rb) a.push("<li><b>The bots' tiebreakers</b> — whoever runs a bot checks its board and the priority numbers; the rest of us can ignore them.</li>");
  if (c.botFacs.some(function (id) { return c.botCfg(id).traits; })) a.push("<li><b>Trait cards</b> — we'll read each one out when it changes what its bot does.</li>");
  if (c.mmorig && !c.rb) a.push("<li><b>Spy card details</b> — they only matter once someone plays one.</li>");
  return a.join("");
};
