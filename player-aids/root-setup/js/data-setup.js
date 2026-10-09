/* =============================================================================
   Root — Setup & Reference Utility · setup
   Standard Setup (Law p.5 §5.1), Advanced Setup (Law p.22–24 App. A), the Walkthrough game
   (Walkthrough PDF p.2–3), and every faction's own setup (Law §6.3–§18.3).
   c = RT.ctx(state) — see data.js.
   ============================================================================= */

RT.cornerRule = "a corner clearing that is not another player's starting corner clearing and, if possible, is diagonally opposite a starting corner clearing";
RT.bh = function (hook, c) { return (typeof RT.botHook === "function") ? (RT.botHook(hook, c) || "") : ""; };

/* ---------- every faction's own setup ---------- */
RT.fsetup.marquise = {
  std: function () {
    return RT.ol([
      "<b>Gather:</b> form supplies of <b>25 warriors</b> and <b>8 wood</b> tokens.",
      "<b>Place the keep</b> token in <b>any corner clearing</b>. This is your starting clearing. (Only the Marquise can place pieces in the keep's clearing; pieces may still move in.)",
      "<b>Garrison:</b> place <b>1 warrior in each clearing</b> except the clearing in the corner diagonally opposite the keep.",
      "<b>Starting buildings:</b> place <b>1 sawmill, 1 workshop and 1 recruiter</b> among the keep's clearing and any adjacent clearings, in any combination.",
      "<b>Fill your Buildings tracks:</b> the remaining 5 sawmills, 5 workshops and 5 recruiters go on their tracks from right to left — leave the leftmost space of each track empty."
    ]);
  },
  stdSrc: function () { return "Law p.5–6 §6.3 · p.5 §6.2.2"; },
  adv: function () {
    return "<p>The Marquise's setup card begins: <i>“1st — Choose 3 homeland clearings, each adjacent to one other.”</i></p>";
  }
};

RT.fsetup.eyrie = {
  std: function () {
    return RT.ol([
      "<b>Gather:</b> form a supply of <b>20 warriors</b>.",
      "<b>Roost and starting warriors:</b> place <b>1 roost and 6 warriors</b> in " + RT.cornerRule + ". This is your starting clearing. <i>(Updated from earlier printings, which named the corner opposite the keep.)</i>",
      "<b>Choose a leader:</b> put 1 of the 4 Eyrie leader cards in your Leader Card slot; keep the other three face up near you." +
        RT.ul(["<b>Builder</b> — Viziers on Recruit and Move", "<b>Charismatic</b> — Viziers on Recruit and Battle",
               "<b>Commander</b> — Viziers on Move and Battle", "<b>Despot</b> — Viziers on Move and Build"]),
      "<b>Tuck your 2 Loyal Viziers</b>, showing their suit, into the Decree columns your leader lists.",
      "<b>Fill your Roosts track:</b> the remaining 6 roosts go on it from right to left."
    ]);
  },
  stdSrc: function () { return "Law p.6 §7.3 · p.7 §7.8 · Marauder p.19"; }
};

RT.fsetup.alliance = {
  std: function () {
    return RT.ol([
      "<b>Gather:</b> form a supply of <b>10 warriors</b>.",
      "<b>Bases:</b> place your <b>3 bases</b> on their spaces in your Bases box.",
      "<b>Sympathy:</b> place your <b>10 sympathy tokens</b> on your Sympathy track.",
      "<b>Supporters:</b> draw <b>3 cards</b> and place them face down on your Supporters stack."
    ]);
  },
  stdSrc: function () { return "Law p.8 §8.3"; },
  adv: function () {
    return "<p>The Alliance's setup card begins: <i>“1st — Draw 3 cards and add them face down to your Supporters stack.”</i></p>";
  }
};

RT.vbItemsHtml = function (vc) {
  var tracks = vc.items.split("").filter(function (l) { return "TXB".indexOf(l) >= 0; }).map(RT.itemName);
  var satchel = vc.items.split("").filter(function (l) { return "TXB".indexOf(l) < 0; }).map(RT.itemName);
  return "the <b>" + vc.name + "</b> starts with <b>" + RT.itemList(vc.items) + "</b>" +
    " — " + (tracks.length ? tracks.join(", ") + " face up on " + (tracks.length > 1 ? "their tracks" : "its track") + ", " : "") +
    satchel.join(", ") + " face up in the Satchel";
};
RT.vagabondSetup = function (c, seat) {
  var vc = c.vchar(seat), two = c.twovb, bothHuman = c.human("vagabond") && c.human("vagabond2");
  return RT.ol([
    "<b>Choose a character</b> card for your Character Card slot" + (c.advCards ? " — <b>use the character card dealt beside your setup card</b>" : "") + ". Selected: <b>" + vc.name + "</b>.",
    "<b>Place your pawn</b> in <b>any forest</b>.",
    bothHuman
      ? "<b>Quests (two Vagabonds):</b> whichever Vagabond sets up <b>first</b> shuffles the quest deck, draws <b>3 quests</b> and places them face up; the other draws none. Both Vagabonds share those 3 — do not add extra quest cards."
      : two
      ? "<b>Quests:</b> shuffle the quest deck, draw <b>3 quest cards</b> and place them face up near you. The Vagabot draws its own single quest, which only it can complete (Rootbotics p.10 §7.3.3); it never uses your three."
      : "<b>Quests:</b> shuffle your quest deck, draw <b>3 quest cards</b> and place them face up near you.",
    two
      ? "<b>Ruins (two Vagabonds):</b> whichever Vagabond sets up <b>first</b> takes the 4 ruins off the map and puts <b>two random “R” items</b> under each — use <b>both sets</b> of “R” items — then shuffles each stack and returns each to an empty ruin slot. The other skips this."
      : "<b>Populate the ruins:</b> take the 4 ruins off the map and the bag, boots, hammer and sword marked “R”; put one under each ruin, shuffle each ruin stack, and return each stack to an empty ruin slot.",
    "<b>Starting items</b> (the “S” items listed on your character card): " + RT.vbItemsHtml(vc) + ". Return any remaining “S” items to the box." +
      (two ? " <i>With two Vagabonds, the first to set up should leave the other's starting items out of the box: the Law doesn't say how two Vagabonds share the “S” items (the Riverfolk box adds a second set of items).</i>" : ""),
    "<b>Relationships:</b> put a relationship marker for <b>each non-Vagabond faction</b> on the Indifferent space of your Relationships chart."
  ]);
};
RT.fsetup.vagabond = {
  std: function (c) {
    return (c.twovb ? "<p><b>Two Vagabonds:</b> randomly determine which Vagabond sets up first.</p>" : "") + RT.vagabondSetup(c, "vagabond");
  },
  stdSrc: function (c) { return RT.join(["Law p.10 §9.3", c.twovb ? "Law p.10–11 §9.7.1–9.7.2" : "", c.twovb && c.bot("vagabond2") ? "Rootbotics p.10 §7.3.3" : "", "Law p." + c.vchar("vagabond").page + " §" + c.vchar("vagabond").sec]); },
  adv: function (c) {
    return RT.ul([
      "A random character card is dealt face up beside the Vagabond setup card; whoever takes this Vagabond <b>must use it</b>.",
      "Selected: <b>" + c.vchar("vagabond").name + "</b> — starts with " + RT.itemList(c.vchar("vagabond").items) + ".",
      c.twovb ? "<b>Two Vagabonds</b> (both Vagabond setup cards in the pool): put <b>two random “R” items</b> in each ruin slot (both sets)" + (c.bot("vagabond2") ? "; your 3 face-up quests are yours alone — the Vagabot keeps its own single quest." : ", and the Vagabonds share the 3 face-up quests — do not add extra quest cards.") : ""
    ]);
  },
  advSrc: function (c) { return RT.join(["Law p.23 §A.8.1, §A.8.2.III", c.twovb ? "Law p.10–11 §9.7" : ""]); }
};
RT.fsetup.vagabond2 = {
  std: function (c) { return "<p>The second Vagabond board (Riverfolk). Follow the same steps:</p>" + RT.vagabondSetup(c, "vagabond2"); },
  stdSrc: function (c) { return RT.join(["Law p.10 §9.3", "Law p.10–11 §9.7", c.bot("vagabond") ? "Rootbotics p.10 §7.3.3" : "", "Law p." + c.vchar("vagabond2").page + " §" + c.vchar("vagabond2").sec]); },
  adv: function (c) {
    return RT.ul([
      "This Vagabond uses the character card dealt beside its setup card. Selected: <b>" + c.vchar("vagabond2").name + "</b> — starts with " + RT.itemList(c.vchar("vagabond2").items) + ".",
      c.bot("vagabond") ? "The ruins hold two “R” items each; your 3 face-up quests are yours alone — the Vagabot keeps its own single quest." : "The ruins hold two “R” items each and the 3 face-up quests are shared."
    ]);
  },
  advSrc: function () { return "Law p.23 §A.8.2.III · p.10–11 §9.7"; }
};

RT.fsetup.lizard = {
  std: function () {
    return RT.ol([
      "<b>Gather:</b> form a supply of <b>25 warriors</b>.",
      "<b>Starting clearing:</b> place <b>4 warriors and 1 garden of matching printed suit</b> in " + RT.cornerRule + ". Then place <b>1 warrior in each adjacent clearing</b>. <i>(Updated from earlier printings.)</i>",
      "<b>Choose the Outcast:</b> put the outcast marker on any suit space in your Outcast box.",
      "<b>Fill your Gardens tracks:</b> the remaining 14 gardens go on their matching spaces from right to left."
    ]);
  },
  stdSrc: function () { return "Law p.11 §10.3"; }
};
RT.fsetup.riverfolk = {
  std: function () {
    return RT.ol([
      "<b>Gather:</b> form a supply of <b>15 warriors</b>.",
      "<b>Warriors:</b> place <b>4 warriors</b> in any clearings touching the river.",
      "<b>Trade posts:</b> place your <b>9 trade posts</b> on the matching spaces of your Trade Posts tracks.",
      "<b>Starting funds:</b> place <b>3 warriors</b> in your Payments box.",
      "<b>Starting prices:</b> put 1 service marker on any space of <b>each</b> Services track."
    ]);
  },
  stdSrc: function () { return "Law p.12 §11.3"; }
};
RT.fsetup.duchy = {
  std: function () {
    return RT.ol([
      "<b>Gather:</b> form supplies of <b>20 warriors</b> and <b>3 tunnel</b> tokens.",
      "<b>The Burrow:</b> place the Burrow board near the map.",
      "<b>Surface:</b> place <b>2 warriors and 1 tunnel</b> in " + RT.cornerRule + ". Then place <b>2 warriors in each clearing adjacent</b> to that corner, except the Burrow. <i>(Updated from earlier printings.)</i>",
      "<b>Buildings:</b> place 3 citadels and 3 markets on their Buildings spaces.",
      "<b>Ministers:</b> place the 9 minister cards face up as your Unswayed Ministers pile.",
      "<b>Crowns:</b> place the 9 crowns on the victory-point spaces of your faction board."
    ]);
  },
  stdSrc: function () { return "Law p.14 §12.3"; }
};
RT.fsetup.corvid = {
  std: function () {
    return RT.ol([
      "<b>Gather:</b> form supplies of <b>15 warriors</b> and your <b>8 plot tokens</b>, face down. (The box's second set of plots are spares.)",
      "<b>Scatter:</b> place <b>1 warrior in any clearing of each suit</b> — 3 in total."
    ]);
  },
  stdSrc: function () { return "Law p.15 §13.3 · Underworld p.4"; }
};
RT.fsetup.hundreds = {
  std: function () {
    return RT.ol([
      "<b>Gather:</b> form supplies of <b>20 warriors, 1 warlord and 6 strongholds</b>.",
      "<b>Garrison:</b> place your <b>warlord, 4 warriors and 1 stronghold</b> in " + RT.cornerRule + ".",
      "<b>Items:</b> place the four “R” items randomly under the ruins, unless this has already been done.",
      "<b>Mood:</b> put your <b>Stubborn</b> mood card in your Mood Card slot."
    ]);
  },
  stdSrc: function () { return "Law p.16 §14.3"; }
};
RT.fsetup.keepers = {
  std: function () {
    return RT.ol([
      "<b>Starting relics:</b> shuffle all <b>12 relic tokens</b> face down (values hidden) and place <b>one at random in each forest</b>. <i>(Easiest: slide them around face down, then place them quickly as a group. Or the Keepers stack them, another player cuts the stack, and relics are dropped one by one from the bottom onto the forests.)</i>",
      "<b>Gather:</b> form a supply of <b>15 warriors</b>.",
      "<b>Warriors:</b> place <b>4 warriors</b> in " + RT.cornerRule + ". Then place <b>4 warriors</b> in a clearing on the map edge adjacent to it.",
      "<b>Remaining relics:</b> place them at random, as evenly as possible, among forests <b>not adjacent</b> to clearings with your warriors.",
      "<b>Retinue:</b> tuck one Faithful Retainer card into each Retinue slot.",
      "<b>Waystations:</b> place your 3 waystations on their Waystations spaces."
    ]);
  },
  stdSrc: function () { return "Law p.17 §15.3 · p.25 §G.15"; }
};
RT.fsetup.diaspora = {
  std: function (c) {
    return RT.ol([
      "<b>Gather:</b> form a supply of <b>20 warriors</b> and <b>12 enclaves</b>.",
      "<b>Starting clearing:</b> in a clearing <b>on the river</b>, place <b>5 warriors and 1 enclave, Peaceful side up</b>.",
      c.two ? "<b>Two players:</b> remove the <b>Frog Dominance</b> card permanently." : "",
      "<b>Frog cards and the Pond:</b> shuffle all the frog cards into the shared deck — <b>" + (c.two ? "13" : "14") + " cards</b>" + (c.two ? " (Frog Dominance removed)" : "") + ". Place the Pond placard near the shared deck."
    ]);
  },
  stdSrc: function () { return "Law p.19 §16.3"; },
  adv: function (c) {
    return RT.ul([
      "As in the Diaspora's own setup: " + (c.two ? "with two players, remove the <b>Frog Dominance</b> card permanently, then shuffle the other <b>13</b> frog cards into the shared deck" : "shuffle all <b>14</b> frog cards into the shared deck") + ", and place the Pond placard near the deck."
    ]);
  },
  advSrc: function () { return "Law p.19 §16.3.3–16.3.4 · p.23 §A.7–A.8"; }
};
RT.fsetup.council = {
  std: function () {
    return RT.ol([
      "<b>Gather:</b> form a supply of <b>20 warriors</b>.",
      "<b>Warriors:</b> place <b>4 warriors in a corner clearing</b> — your starting clearing — and <b>2 warriors in a different clearing</b>.",
      "<b>Assemblies:</b> fill your Assemblies track with your 6 assemblies, <b>Closed</b> side up (assemblies start on their Closed side)."
    ]);
  },
  stdSrc: function () { return "Law p.20 §17.3 · Homeland p.8, p.19"; },
  adv: function (c) {
    return "<p>The Council's setup card (pictured in the Homeland guide) reads:</p>" + RT.ol([
      "Choose a homeland clearing. Place <b>4 warriors</b> there.",
      "Place <b>2 warriors</b> in a different clearing.",
      "Fill your Assemblies track with <b>assemblies</b> on their <b>Closed</b> side."
    ]) + "<p class='inline-note'>Its card has a grey band with no sword — an <b>insurgent</b> card" + (c.two ? ", so with two players it's removed before dealing (unless you keep insurgents because you're playing with hirelings)" : "") + ".</p>";
  },
  advSrc: function () { return "Homeland p.19 · Law p.23 §A.8.2"; }
};
RT.fsetup.knaves = {
  std: function (c) {
    var caps = c.captains;
    return RT.ol([
      "<b>Gather:</b> form a supply of <b>10 Skunk</b> warriors.",
      "<b>Choose 3 Captain cards</b>" + (c.advCards ? " from the four dealt beside your setup card" : "") + " and collect their Captain warriors. Selected: <b>" + caps.map(function (k) { return k.name; }).join(", ") + "</b>." +
        (caps.some(function (k) { return !k.warrior; }) ? " <i>Homeland includes Captain warriors only for the Jailor, Gladiator and Cheat; the other Captains use the matching Vagabond pawn (the Thief: the base game's pawn; the rest: Riverfolk or the Vagabond Pack) or a proxy.</i>" : ""),
      "<b>Place</b> 1 Captain warrior and 1 Skunk warrior together in each of <b>three different forests</b>.",
      "<b>Stash:</b> place the <b>6 items</b> shown on your 3 Captain cards face up in your Stash — " +
        caps.map(function (k) { return k.name + ": " + RT.itemList(k.items); }).join("; ") + ". Fill each Acclaim slot with <b>2 acclaim</b> tokens."
    ]) + "<p class='inline-note'>The Knaves cannot be played in the same game as the Vagabond.</p>";
  },
  stdSrc: function () { return "Law p.21 §18.3, §18.2.1 · p.27 App. K · Homeland p.15"; },
  adv: function (c) {
    return RT.ul([
      "<b>Four random Captain cards</b> are dealt face up beside the Knaves setup card; in setup the Knaves choose three of them.",
      "Selected Captains: <b>" + c.captains.map(function (k) { return k.name; }).join(", ") + "</b>."
    ]);
  },
  advSrc: function () { return "Law p.23 §A.8.2.IV · p.27 App. K"; }
};

/* one setup step per bot in play: its own faction setup (data-bots.js RT.botSetup) */
RT.botFactionSteps = function (c) {
  return c.facs.filter(function (id) { return !!c.bot(id); }).map(function (id) {
    var bt = c.bot(id), bs = RT.botSetup[bt];
    return { exp: RT.B[bt].rb ? "bots" : "riverfolk", t: RT.F[id].name + " — " + RT.B[bt].name + " (bot)", d: bs.d(c), src: bs.src(c) };
  });
};
/* one setup step per faction in play, in the Law's chapter order. With Advanced Setup's draft ("adv"), bots are set up
   earlier, in step A.3 (Law p.22), so they're left out here. */
RT.factionSteps = function (c, mode) {   // mode: "std" | "adv"
  return c.facs.filter(function (id) { return !(mode === "adv" && c.bot(id)); }).map(function (id) {
    var f = RT.F[id], fs = RT.fsetup[id], bt = c.bot(id);
    if (bt) return RT.botFactionSteps(c).filter(function (s) { return s.t.indexOf(f.name + " — ") === 0; })[0];
    if (mode === "adv") {
      return { exp: f.set === "base" ? "adv" : f.set, t: f.name + " — setup card",
        d: "<p>Set up exactly as the faction setup card says, right after choosing it — not from the faction board's back.</p>" + (fs.adv ? fs.adv(c) : ""),
        src: RT.join(["Law p.23 §A.8.3", "Marauder p.18", fs.adv && fs.advSrc ? fs.advSrc(c) : ""]) };
    }
    return { exp: f.set, t: f.name + " — setup", d: fs.std(c), src: fs.stdSrc(c) };
  });
};

/* ---------- maps ---------- */
RT.mapSetup = function (c) {
  var m = c.map, a = [];
  var markers = "Shuffle the <b>12 suit markers</b> face down, place one on each clearing (covering any printed suit symbol), then flip them all face up.";
  if (m === "autumn") a.push("Use the <b>Autumn</b> map: the clearings' printed suits are used; it has no special rules.");
  if (m === "winter") {
    a.push("Use the <b>Winter</b> map (the back of the Autumn map). It is recommended for experienced players: random suits bring new challenges for each faction, so keep the layout in mind when picking factions.");
    a.push(markers);
    a.push("The ruin slots (“R”) are in different places from the Autumn map. The <b>Raging River</b> divides forests as a path does.");
  }
  if (m === "lake") {
    a.push("Use the <b>Lake</b> map. <b>Setup modification first:</b> place the <b>Ferry</b> in the corner clearing that is also a coastal clearing (the bottom-right corner).");
    a.push(markers + " (Underworld p.6 also pictures a suggested clearing setup.)");
  }
  if (m === "mountain") {
    a.push("Use the <b>Mountain</b> map. <b>Setup modification first:</b> cover the <b>6 paths of darker colour with excavated ground</b> with the 6 closed path markers, and place the <b>Tower</b> in the central clearing showing two towers.");
    a.push(markers + " (Underworld p.7 also pictures a suggested clearing setup.)");
  }
  if (m === "marsh") {
    a.push("Use the <b>Marsh</b> map. <b>Setup modification first:</b> " + (c.p >= 5
      ? "with 5 or more players, place the <b>Mousehold, Foxburrow and Rabbittown</b> landmarks in the three unsuited clearings (you can still use other landmarks as normal)."
      : "with 1–4 players, cover a total of <b>3 flooding clearings</b> with flood markers — one light green, one dark green and one dark brown clearing space, each with the flood marker of matching colour — aligning each marker's paths with the paths touching it."));
    a.push(markers + (c.p >= 5 ? " The landmarks stand in the 3 clearings without a suit marker." : ""));
  }
  if (m === "gorge") {
    a.push("Use the <b>Gorge</b> map.");
    a.push(markers);
  }
  if (c.std && m !== "autumn") a.push("<i>Order:</i> do the map's setup modification first, then the suit markers (the Law's order in Advanced Setup step 1); finish the map before placing the ruins.");
  return RT.ul(a) + RT.bh("map", c);
};
RT.mapSrc = function (c) {
  var s = { autumn: "Law p.27 §M.1", winter: "LtP p.23 · Law p.22 §A.1 · p.27 §M.2", lake: "Law p.22 §A.1 · p.27 §M.3.1 · Underworld p.6",
            mountain: "Law p.22 §A.1 · p.27 §M.4.1 · Underworld p.7", marsh: "Law p.22 §A.1 · p.28 §M.5.1 · Homeland p.17",
            gorge: "Law p.22 §A.1 · p.28 §M.6 · Homeland p.16" }[c.map];
  return s;
};

RT.ruinsHtml = function (c) {
  var a = [];
  if (c.map === "marsh") a.push("<b>Marsh:</b> place 2 ruins in the “R” slots with <b>no numbers</b> and 2 ruins in the “R” slots with the <b>lowest showing numbers</b>.");
  else a.push("Place a ruin in each slot marked with an <b>“R”</b> — four in total.");
  if (c.vb) a.push((c.twovb ? "Whichever Vagabond sets up first puts two" : "The Vagabond puts") + " items under each ruin during faction setup.");  else if (c.fac("hundreds")) a.push("The Lord of the Hundreds puts the four “R” items under them during faction setup.");
  else a.push("With no Vagabond " + (c.has("marauder") ? "or Lord of the Hundreds " : "") + "in the game, the ruins stay empty and keep their slots blocked all game: nothing can explore them.");
  return RT.ul(a);
};

RT.itemSupplyHtml = function (c) {
  return RT.ul(["Place these items on their spaces of the item supply near the top of the map: <b>2 boots, 2 bags, 1 crossbow, 1 hammer, 2 swords, 2 tea and 2 coins</b> (12 items).", RT.bh("items", c)]);
};

RT.landmarkHtml = function (c) {
  var pool = RT.landmarks.filter(function (l) { return c.lmPool(l.id); }).map(function (l) { return l.name; });
  var a = [
    "<b>Choose:</b> as a group, play with <b>" + c.lm + " landmark" + (c.lm > 1 ? "s" : "") + "</b>; remove any landmark cards you don't want. Pool: " + RT.list(pool) + ".",
    "<b>Deal and collect:</b> shuffle the chosen landmark cards, deal out " + c.lm + ", and collect the landmark piece shown on each dealt card.",
    "<b>Set up:</b> the <b>last player</b> in turn order sets up one dealt landmark as its card describes" + (c.lm > 1 ? "; the <b>second-to-last player</b> sets up the other." : ".")
  ];
  if (c.lmPool("foxburrow") || c.lmPool("rabbittown") || c.lmPool("mousehold"))
    a.push("Homeland's Foxburrow, Rabbittown and Mousehold add their suit to their clearing. The book recommends a clearing of the matching suit; adventurous groups may use a clearing of another suit, making it double-suited.");
  if (c.map === "lake" || c.map === "mountain") a.push("With landmarks you may ignore or override where the map places the " + (c.map === "lake" ? "Ferry" : "Tower") + ".");
  if (c.map === "marsh" && c.p >= 5) a.push("On the Marsh with 5+ players, Mousehold, Foxburrow and Rabbittown are already on the map; deal from the other landmarks.");
  a.push("Landmarks cannot be battled, moved, covered or removed unless a landmark says so; nobody owns them and they are not enemy pieces.");
  return RT.ul(a);
};
RT.landmarkSrc = function (c) {
  return RT.join(["Law p.22–23 §A.5", "Law p.27 §L.1",
    (c.lmPool("foxburrow") || c.lmPool("rabbittown") || c.lmPool("mousehold")) ? "Homeland p.18" : "",
    c.map === "marsh" && c.p >= 5 ? "Law p.28 §M.5.1.II" : ""]);
};

RT.demoteText = function (c) {
  if (c.p <= 2) return "<b>Two players:</b> all three hirelings stay <b>Promoted</b>.";
  if (c.p === 3) return "<b>Three players:</b> flip <b>one</b> random hireling to its <b>Demoted</b> side (marked “D”).";
  if (c.p === 4) return "<b>Four players:</b> flip <b>two</b> random hirelings to their <b>Demoted</b> side (marked “D”).";
  return "<b>Five or more players:</b> flip <b>all three</b> hirelings to their <b>Demoted</b> side (marked “D”).";
};
RT.hireBlockText = function (c) {
  var dealt = RT.hirelings.filter(function (h) { return c.hireDealt(h.id); });
  var t = "<b>Return the matching factions:</b> a faction cannot be played while its hireling (same colour and icon) is in play — return its faction board, pieces and setup card to the box." +
    (c.has("marauder") ? " The Marauder four: Forest Patrol / Feline Physicians → Marquise, Last Dynasty / Bluebird Nobles → Eyrie, Spring Uprising → Woodland Alliance, the Exile / Brigand → Vagabond <i>and</i> Knaves of the Deepwood." : "");
  if (dealt.length) t += " Dealt this game: " + dealt.map(function (h) { return "<b>" + h.name + "</b> (no " + h.blocks.filter(function (b) { return b !== "vagabond2"; }).map(RT.fname).join(" or ") + ")"; }).join(", ") + ".";
  return t;
};

/* ---------- the setup phases ----------
   A phase has `when(c)`, `title`, and `steps(c)` returning [{exp, t, d, src}] (already filtered). */
RT.phases = [
  /* ===================== WALKTHROUGH GAME ===================== */
  { when: function (c) { return c.walk; }, title: "The Walkthrough game (learn by playing)",
    steps: function () {
      return [
        { exp: "walk", t: "Choose factions, seats and walkthrough cards",
          d: RT.ul([
            "Read the first two pages of the Learning to Play guide first.",
            "Each player takes a faction board and all the pieces listed on its back. Seat the players clockwise: <b>Marquise, Eyrie, Alliance, Vagabond</b>.",
            "Give each player their faction's <b>walkthrough card</b>.",
            "The walkthrough is written for <b>four players</b>; with fewer, some players act as more than one faction."
          ]), src: "Walkthrough PDF p.2 · LtP p.3" },
        { exp: "walk", t: "Set scores", d: RT.ul(["Place each faction's score marker on “0” on the score track."]), src: "Walkthrough PDF p.2" },
        { exp: "walk", t: "Follow the walkthrough cards",
          d: "<p>Each player follows their walkthrough card (the starting map is pictured on the walkthrough sheet). Hands stay <b>public</b> for the walkthrough.</p>" + RT.ul([
            "<b>Marquise:</b> keep and 1 sawmill in the <b>top-left fox clearing</b> (the keep doesn't fill a slot); 1 warrior in each clearing except the one diagonally opposite the keep (11 in total); 1 workshop and 1 recruiter where the sheet shows; the rest of the buildings on your tracks from right to left. Hand: (bird) Brutal Tactics, (rabbit) Better Burrow Bank, (mouse) Travel Gear.",
            "<b>Eyrie:</b> the <b>Despot</b> in your Leader Card slot; tuck the 2 Loyal Viziers into <b>Move and Build</b>; 1 roost and 6 warriors in the <b>bottom-right rabbit clearing</b>; the other roosts on your Roosts track from right to left. Hand: (bird) Ambush, (rabbit) A Visit to Friends, (rabbit) Bake Sale.",
            "<b>Alliance:</b> your 3 bases and 10 sympathy on their tracks. Hand: (bird) Brutal Tactics, (mouse) Scouting Party, (mouse) Crossbow. Supporters stack: (bird) Sappers, (bird) Birdy Bindle, (fox) Anvil.",
            "<b>Vagabond:</b> the <b>Thief</b> card in your Character Card slot; your pawn where the sheet shows; the Errand (fox) quest and 2 drawn quests near you; a random “R” item beneath each ruin on the map <i>(the ruins go out in step 5 — place them first)</i>; the “S” boots, torch and sword in your Satchel and the “S” tea on its track; relationship markers on Indifferent. Hand: (fox) Root Tea, (fox) Protection Racket, (rabbit) Cobbler."
          ]), src: "Walkthrough PDF p.2–3" },
        { exp: "walk", t: "Shuffle the deck", d: RT.ul(["Shuffle the remaining <b>39 cards</b> to form the shared deck."]), src: "Walkthrough PDF p.2" },
        { exp: "walk", t: "Place ruins", d: RT.ul(["Place the 4 ruin markers on the four slots marked “R”."]), src: "Walkthrough PDF p.2" },
        { exp: "walk", t: "Make the item supply", d: RT.ul(["Place the 12 item chits on their matching spaces near the top of the map: 2 boots, 2 bags, 1 crossbow, 1 hammer, 2 swords, 2 tea, 2 coins."]), src: "Walkthrough PDF p.2 · Law p.5 §5.1.5" },
        { exp: "walk", t: "Play the walkthrough",
          d: RT.ul([
            "Give the booklet to the Marquise player, who reads the text aloud while taking the actions described; then pass it to the Eyrie, and so on, for two full turns.",
            "Encourage questions; point players at their faction board for faction questions.",
            "When it ends, continue this game or start over — either way, hands are <b>private</b> from then on. Not covered by the walkthrough: ambush cards, dominance cards and persistent crafted effects."
          ]), src: "LtP p.3 · Walkthrough PDF p.19" }
      ];
    } },

  /* ===================== STANDARD SETUP (Law §5.1) ===================== */
  { when: function (c) { return c.std; }, title: "Players, factions and cards",
    steps: function (c) {
      var s = [];
      if (c.hire) s.push({ exp: "mod", t: "Hirelings — set up before choosing factions",
        d: RT.ol([
          "<b>Seat the players and pick the first player at random now</b> (part of step 1 below) — hireling setup goes in turn order.",
          "<b>Collect and place:</b> put the 12 control markers and the control die near the map; place the three hireling markers — “4”, “8” and “12” — on those spaces of the score track.",
          "<b>Deal out hirelings:</b> shuffle the hireling cards, deal out <b>three</b>, and collect their pieces into a supply. Return the rest to the box.",
          RT.demoteText(c) + " Promoted hirelings have pieces for their actions; Demoted hirelings usually give abilities instead.",
          "<b>Set up hirelings:</b> starting with the <b>last player</b> in turn order and going counterclockwise, each player sets up one hireling as its Setup line says, if any.",
          RT.hireBlockText(c)
        ]), src: "Marauder p.12 · Law p.23 §A.6, §A.6.5" });
      s.push({ exp: "base", t: "Assign factions, seats and the first player",
        d: function () {
          var a = [
            "Assign one faction to each player in any way. Determine the <b>starting player</b> and <b>seating order</b> at random" + (c.hire ? " (done above)" : "") + ".",
            "Each player takes their faction board and the pieces listed on its back.",
            c.nfac ? "In play: " + c.facs.map(function (id) { return "<b>" + RT.F[id].name + "</b>" + (c.bot(id) ? " (bot)" : "") + " — reach " + RT.F[id].reach; }).join("; ") + "." : "",
            c.need ? "<b>Choose " + c.need + " more faction" + (c.need > 1 ? "s" : "") + "</b> in the configurator above." : "",
            c.reachNeed ? "<b>Reach:</b> total " + c.reach + " — " + (c.reach >= c.reachNeed ? "meets" : "<b>below</b>") + " the viable sum of " + c.reachNeed + "+ for " + c.p + " players. (Adventurous players are welcome to use any mix with 17+ reach.)" : "",
            c.facs.every(function (id) { return RT.F[id].set === "base"; }) && c.p <= 3 ? "Base game tip: with three players, remove the Vagabond; with two, also remove the Alliance." : "",
            c.twovb ? "<b>Two Vagabonds</b> (Riverfolk): randomly determine which Vagabond sets up first." : "",
            c.fac("knaves") ? "The Knaves of the Deepwood cannot share a game with the Vagabond." : ""
          ];
          return RT.ul(a);
        }(),
        src: RT.join(["Law p.5 §5.1.1, §5.2", c.facs.every(function (id) { return RT.F[id].set === "base"; }) && c.p <= 3 ? "LtP p.4" : "", c.twovb ? "Law p.10–11 §9.7.1" : "", c.fac("knaves") ? "Law p.21 §18.2.1" : ""]) });
      if (c.anyBot) s.push({ exp: RT.mmOnly(c) ? "riverfolk" : "bots", t: RT.mmOnly(c) ? "Bots — the original Mechanical Marquise" : "Bots — replace factions, difficulty and traits", d: RT.bh("general", c), src: RT.botGeneralSrc(c, false) });
      s.push({ exp: "base", t: "Place score markers",
        d: RT.ul(["Each player places their score marker on <b>“0”</b> on the score track.", RT.bh("score", c), c.hire ? "The hireling markers sit on 4, 8 and 12: the first player to reach each takes it (and a hireling at the end of their turn)." : ""]),
        src: RT.join(["Law p.5 §5.1.2", c.v("campaign") ? "Riverfolk p.8" : "", c.hire ? "Law p.26 §H.1.1" : ""]) });
      s.push({ exp: c.deck !== "standard" ? (c.deck === "ep" ? "epdeck" : "sddeck") : "base", t: "Draw starting hands",
        d: RT.ul([
          c.deck !== "standard" ? "<b>Deck:</b> the " + RT.decks.filter(function (d) { return d.id === c.deck; })[0].name + " deck replaces the base game's entire shared deck." : ""
        ].concat(c.anyBot ? RT.botHands(c, false) : [
          c.two ? "<b>Two players:</b> remove all <b>four dominance cards</b> from the deck." : "",
          "Shuffle the deck. Each player draws <b>three cards</b>."
        ]).concat([
          c.fac("diaspora") ? "The Lilypad Diaspora shuffles its frog cards into the deck later, during its own faction setup." : ""
        ])),
        src: RT.join(["Law p.5 §5.1.3", c.deck !== "standard" ? "Law p.22 §A.2" : "", c.fac("diaspora") ? "Law p.19 §16.3.4" : "", c.anyBot ? RT.botHandsSrc(c) : ""]) });
      return s;
    } },
  { when: function (c) { return c.std; }, title: "The Woodland",
    steps: function (c) {
      var s = [];
      s.push({ exp: RT.M[c.map].set, t: "Map — " + RT.M[c.map].name, d: RT.mapSetup(c), src: RT.join([RT.mapSrc(c), c.rb ? RT.prioritySrc(c) : ""]) });
      if (c.lm) s.push({ exp: "mod", t: "Landmarks", d: RT.landmarkHtml(c), src: RT.landmarkSrc(c) });
      s.push({ exp: "base", t: "Place ruins", d: RT.ruinsHtml(c), src: RT.join(["Law p.5 §5.1.4", c.map === "marsh" ? "Law p.28 §M.5.1" : "", c.vb ? (c.twovb ? "Law p.10–11 §9.7.1" : "Law p.10 §9.3.4") : (c.fac("hundreds") ? "Law p.16 §14.3.3" : "Law p.3 §2.2.4"), (c.bot("vagabond") === "vagabot" || c.bot("vagabond2") === "vagabot2") ? "Rootbotics p.10 §7.3.4" : "", "LtP p.6"]) });
      s.push({ exp: "base", t: "Form the item supply", d: RT.itemSupplyHtml(c), src: RT.join(["Law p.5 §5.1.5 · LtP p.4", c.mmorig && !c.rb ? "Riverfolk p.6" : ""]) });
      s.push({ exp: "base", t: "Gather other pieces", d: RT.ul(["Hand out the 16 faction overview cards as desired.", "Place the two battle dice near the map."]), src: "Law p.5 §5.1.6" });
      return s;
    } },
  { when: function (c) { return c.std; }, title: "Set up the factions",
    steps: function (c) {
      var s = [{ exp: "base", t: "Set up factions in setup order",
        d: RT.ul([
          "In setup order (A, B, C, etc. — the letter on each faction board), each player follows their faction's setup, listed in its rules section and on the back of its faction board. The steps below list the factions in the Law's chapter order.",
          c.facs.every(function (id) { return RT.baseFour.indexOf(id) >= 0; }) ? "Base game order: Marquise, Eyrie, Alliance, Vagabond." : "",
          "<b>Starting corner clearings</b> are the corners holding the Marquise's keep, the Eyrie's starting roost, the Cult's starting garden, the Duchy's starting tunnel" +
            (c.has("homeland") ? ", the Keepers' starting warriors or the Twilight Council's starting warriors (its starting clearing is a corner clearing)." : " or the Keepers' starting warriors.")
        ]), src: RT.join(["Law p.5 §5.1.7", c.facs.every(function (id) { return RT.baseFour.indexOf(id) >= 0; }) ? "LtP p.4" : "", "Marauder p.19", c.has("homeland") ? "Law p.20 §17.3.2" : ""]) }];
      return s.concat(RT.factionSteps(c, "std"));
    } },

  /* ===================== ADVANCED SETUP (Law App. A) ===================== */
  { when: function (c) { return c.adv; }, title: "Map, deck and seats",
    steps: function (c) {
      var s = [];
      if (c.cornerProblem) s.push({ exp: "adv", t: "Check your faction mix",
        d: RT.ul(["This mix has <b>" + c.corners + " factions that start in corner clearings</b>. With five or more, you must use the Advanced Setup with the faction setup cards — " +
          (c.has("marauder") ? "keep “Draft with setup cards” selected." : c.has("homeland") ? "Homeland's setup cards cover only its own three factions; the other factions' setup cards come in the <b>Marauder</b> expansion, which this collection doesn't include." : "the setup cards come in the <b>Marauder</b> (and Homeland) expansions, which this collection doesn't include.")]),
        src: RT.join(["Law p.4 §5 · Marauder p.19", !c.has("marauder") && c.has("homeland") ? "Homeland p.19" : ""]) });
      s.push({ exp: "adv", t: "Choose and set up the map",
        d: "<p>As a group, choose a map.</p>" + RT.mapSetup(c) + RT.ul([
          "Set up the <b>ruins</b>: " + (c.map === "marsh" ? "2 in the “R” slots with no numbers and 2 in the “R” slots with the lowest showing numbers." : "a ruin in each “R” slot (four in total)."),
          "Form the <b>item supply</b>: 2 boots, 2 bags, 1 crossbow, 1 hammer, 2 swords, 2 tea, 2 coins on their spaces.",
          RT.bh("items", c),
          "Place the <b>two battle dice</b> near the map."
        ]),
        src: RT.join([RT.mapSrc(c).indexOf("Law p.22 §A.1") >= 0 ? "" : "Law p.22 §A.1", RT.mapSrc(c), "Law p.5 §5.1.4–5.1.6", c.rb ? RT.prioritySrc(c) : "", c.mmorig && !c.rb ? "Riverfolk p.6" : ""]) });
      s.push({ exp: c.deck === "standard" ? "adv" : (c.deck === "ep" ? "epdeck" : "sddeck"), t: "Choose the deck",
        d: RT.ul([c.deck === "standard" ? "Use the base game's shared deck." : "Replace the <b>entire</b> base shared deck with the <b>" + RT.decks.filter(function (d) { return d.id === c.deck; })[0].name + "</b> deck."]),
        src: "Law p.22 §A.2" });
      if (c.anyBot) {
        s.push({ exp: RT.mmOnly(c) ? "riverfolk" : "bots", t: "Set up bots", d: RT.bh("general", c), src: RT.botGeneralSrc(c, true) });
        if (c.advCards) s = s.concat(RT.botFactionSteps(c));   // bots set up now, outside the draft (page reading of Law §A.3)
      }
      s.push({ exp: "adv", t: "Seat players",
        d: RT.ul(["Determine the seating order and the first player at random.", "In setup, the <b>last</b> player in turn order acts first and the first player acts last."]),
        src: "Law p.22 §A.4 · Marauder p.17" });
      return s;
    } },
  { when: function (c) { return c.adv && (c.lm || c.hire); }, title: "Landmarks and hirelings",
    steps: function (c) {
      var s = [];
      if (c.lm) s.push({ exp: "mod", t: "Set up landmarks", d: RT.landmarkHtml(c), src: RT.landmarkSrc(c) });
      if (c.hire) s.push({ exp: "mod", t: "Set up hirelings",
        d: RT.ol([
          "<b>Collect pieces:</b> shuffle all the hireling cards, deal out <b>three</b> and return the rest to the box. Collect the dealt hirelings' pieces into a supply (with the 12 control markers and the control die).",
          "<b>Demote:</b> " + RT.demoteText(c),
          "<b>Set up hirelings:</b> starting with the <b>last player</b> in turn order and going counterclockwise, players set up one dealt hireling each as its card describes (some have no setup).",
          "<b>Hireling markers:</b> place the “4”, “8” and “12” markers on those spaces of the score track.",
          RT.hireBlockText(c)
        ]), src: "Law p.23 §A.6 · Marauder p.12" });
      return s;
    } },
  { when: function (c) { return c.adv; }, title: "Cards and factions",
    steps: function (c) {
      var s = [];
      s.push({ exp: c.deck !== "standard" ? (c.deck === "ep" ? "epdeck" : "sddeck") : "adv", t: "Draw five cards",
        d: RT.ul((c.anyBot ? RT.botHands(c, true).concat([
            "Humans keep three of their five at the end of setup." + (RT.mmOnly(c) ? "" : " <i>The Law of Rootbotics writes its card rule for the Standard Setup's three-card draw; this page applies it to the Advanced Setup's five.</i>")
          ]) : [c.two ? "<b>Two players:</b> remove all <b>four dominance cards</b> from the deck." : "",
          "Shuffle the deck. Each player draws <b>five</b> cards — not three; you keep three at the end of setup."]).concat([
          c.fac("diaspora") ? "The Lilypad Diaspora's frog cards go into the deck during its faction setup." : ""])),
        src: RT.join(["Law p.23 §A.7", c.anyBot ? RT.botHandsSrc(c) : ""]) });
      if (c.advCards) {
        s.push({ exp: "adv", t: "Draft factions with setup cards",
          d: RT.ol([
            "<b>Create the draft pool:</b> agree whether to omit any factions. You cannot include both the Vagabond and the Knaves of the Deepwood. If you include the Vagabond, choose whether to include one or both Vagabond setup cards (one is recommended except for adventurous groups)." +
              (c.anyBot ? " <b>Bots:</b> their factions are already set up (step 3) — leave their setup cards out and draft among the humans only." : ""),
            "<b>Deal setup cards:</b> shuffle all the <b>militant</b> setup cards (red name with a sword) and deal <b>one</b> to a pool in the centre. Shuffle the remaining militant cards with all the <b>insurgent</b> cards (grey name, no sword) and deal <b>one per player</b> — one more card than players" + (c.anyBot ? " (here: one per <b>human</b>, so " + (c.humans + 1) + " cards in all)" : "") + "." +
              RT.ul([
                c.two ? "<b>Two players:</b> remove all the insurgent cards before dealing" + (c.has("marauder") ? " (the Woodland Alliance's" + (c.has("homeland") ? " and the Twilight Council's are" : " is") + " among them)" : c.has("homeland") ? " (the Twilight Council's is one)" : "") + (c.hire ? " — you may keep them since you're playing with hirelings, if you're feeling adventurous." : ".") : "",
                "If the <b>last card dealt is an insurgent</b>, turn it sideways: it is locked until at least one militant faction has been chosen.",
                "A dealt <b>Vagabond</b> card gets a random character card dealt face up beside it; whoever picks it uses that character.",
                "A dealt <b>Knaves</b> card gets four random Captain cards dealt face up beside it; the Knaves choose three in setup."
              ]),
            "<b>Choose factions:</b> starting with the <b>last player</b> in turn order and going counterclockwise, each player takes one setup card from the pool and <b>sets up that faction immediately</b> as the card describes, before the next player chooses." +
              RT.ul([
                "<b>Homelands:</b> you cannot choose a clearing that an enemy chose as a homeland, or one where you cannot place all the pieces listed.",
                "<b>Not adjacent to enemy homelands:</b> if you can't, choose one adjacent to an enemy homeland. <b>Two or more clearings away:</b> if you can't, choose one not adjacent. (Basically, set up as far away as you can.)",
                "<b>Several homelands:</b> if you can't meet every adjacency requirement, choose and set them up one at a time, meeting each as best you can.",
                "<b>Map edge:</b> the single closed loop of clearings and paths around the map's boundary (on the Mountain map this includes the closed paths) — in practice, the clearings touching the border art."
              ]),
            "Don't use the setup instructions or order on the faction board backs. Reach isn't used (each card still shows it in the corner)."
          ]),
          src: RT.join(["Law p.23 §A.8.1–A.8.3 · Marauder p.17–19", "Law p.25 §G.15", c.two && c.has("homeland") ? "Homeland p.19" : ""]) });
        s = s.concat(RT.factionSteps(c, "adv"));
      } else {
        s.push({ exp: "adv", t: "Set up factions as in Standard Setup",
          d: RT.ul([
            "Choose factions as a group and set them up as in the Standard Setup: assign one faction to each player, take the boards and pieces, and set up <b>in setup order</b> (A, B, C … on the boards) from each faction's own setup.",
            !c.has("marauder") ? (c.has("homeland") ? "Drafting with faction setup cards needs the Marauder setup cards: Homeland's cover only its own three factions." : "Drafting with faction setup cards needs the Marauder (and Homeland) setup cards.") : "",
            c.nfac ? "In play: " + c.facs.map(function (id) { return "<b>" + RT.F[id].name + "</b>" + (c.bot(id) ? " (bot)" : ""); }).join(", ") + "." : "",
            c.need ? "<b>Choose " + c.need + " more faction" + (c.need > 1 ? "s" : "") + "</b> in the configurator above." : "",
            c.twovb ? "<b>Two Vagabonds:</b> randomly determine which Vagabond sets up first." : ""
          ]),
          src: RT.join(["Law p.23 §A.8", "Law p.5 §5.1.1, §5.1.7", c.twovb ? "Law p.10–11 §9.7.1" : ""]) });
        s = s.concat(RT.factionSteps(c, "std"));
      }
      s.push({ exp: "adv", t: "Place score markers",
        d: RT.ul(["Each player places their faction's score marker on “0” on the score track.", RT.bh("score", c)]), src: RT.join(["Law p.24 §A.9 · Marauder p.18", c.v("campaign") ? "Riverfolk p.8" : ""]) });
      s.push({ exp: "adv", t: "Choose starting hands",
        d: RT.ul(["Each " + (c.anyBot ? "human" : "player") + " keeps <b>three</b> of their five cards and puts the other <b>two</b> face down on the shared deck. When everyone is done, shuffle the shared deck." + (c.anyBot ? " (Bots have no hand.)" : "")]),
        src: "Law p.24 §A.10" });
      return s;
    } },

  /* ===================== BEGIN ===================== */
  { when: function (c) { return !c.walk; }, title: "Begin",
    steps: function (c) {
      return [{ exp: "base", t: "Take the first turn",
        d: RT.ul([
          "The <b>first player</b> begins with Birdsong; each turn runs Birdsong, Daylight, Evening, then passes clockwise until a player wins.",
          c.v("twogames") ? "<b>Two-game match:</b> after this game, record both scores, trade factions and play again; add each player's scores from both games to find the winner." : "",
          c.two && !c.v("twogames") && !c.anyBot ? "Two players: the Learning to Play guide suggests a two-game match, trading factions (select it under Modules &amp; variants)." : "",
          c.v("coop") ? RT.bh("coop", c) : ""
        ]),
        src: RT.join(["Law p.2 §1.4.1", "Law p.5 §5.1.1", c.two && !c.anyBot ? "LtP p.22" : "", c.v("coop") ? (RT.mmOnly(c) ? "Riverfolk p.8" : "Rootbotics p.3") : ""]) }];
    } }
];

RT.mmOnly = function (c) { return c.mmorig && !c.rb; };

/* Flattened, numbered setup for the current configuration (used by app.js and the harness). */
RT.setupFor = function (c) {
  var out = [], n = 0;
  RT.phases.forEach(function (ph) {
    if (!ph.when(c)) return;
    var steps = ph.steps(c).filter(Boolean);
    if (!steps.length) return;
    out.push({ title: ph.title, steps: steps.map(function (s) { n++; return { n: n, exp: s.exp, t: s.t, d: s.d, src: s.src }; }) });
  });
  return out;
};
