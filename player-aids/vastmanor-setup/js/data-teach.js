/* =============================================================================
   Vast: The Mysterious Manor — Setup & Reference Utility · teaching script
   A ~5-minute read-aloud teach for the exact configuration selected, in teaching order:
   hook & win/loss → shape of a turn → the map and fighting → each role's actions and why →
   how the roles collide (the central mechanic) → inserts for the selected mix, variants,
   Haunted Hallways options, visitors / solo / travel → "don't worry about these yet".
   Every rule here comes from the living rules, the setup sheets (their back pages describe how
   the roles interact) or the Haunted Hallways booklet — the same sources the setup cites.
   ============================================================================= */
(function () {
  function nm(c, seat) { return VM.seatName(c, seat); }
  function spiderTerror(c) { return VM.v(c, "spider", "hatchling") ? 8 : VM.v(c, "spider", "consumer") ? 10 : 12; }
  function paladinHealth(c) { return VM.v(c, "skeletons", "miscreant") ? 5 : VM.v(c, "skeletons", "boss") ? 6 : 7; }
  function ul(L) { return "<ul>" + L.filter(Boolean).map(function (x) { return "<li>" + x + "</li>"; }).join("") + "</ul>"; }

  var GOAL = {
    paladin: function (c) { return "<b>The Paladin</b> wins by killing the " + nm(c, "spider") + (c.has("spider") ? ": each hit sends one of her five Spiderlings back to the box." : c.has("shadow") ? ": each of his hits costs the Shadow Paladin 1 Health." : "."); },
    skeletons: function (c) { return VM.skelHuntSpider(c) ? "<b>The Skeletons</b> win by killing the " + nm(c, "spider") + " — in this mix " + (c.has("dragon") ? "he’s" : c.has("shadow") ? "they’re" : "she’s") + " their prey." : c.has("knight") ? "<b>The Skeletons</b> win by killing the Knight — her own game’s rules say how she goes down." : "<b>The Skeletons</b> win by killing the " + nm(c, "paladin") + " — knocking " + (c.has("aknight") ? "her" : "his") + " Health " + (c.has("paladin") ? "from " + paladinHealth(c) + " " : "") + "down to zero."; },
    spider: function (c) { return "<b>The Spider</b> wins by reaching " + spiderTerror(c) + " Terror and then escaping through the Entrance tile."; },
    manor: function (c) { return "<b>The Manor</b> — yes, the house is a player — wins with " + (VM.v(c, "manor", "shack") ? 11 : VM.v(c, "manor", "villa") ? 13 : 14) + " Seals from its rituals."; },
    warlock: function (c) { return "<b>The Warlock</b> wins by dominating " + (VM.v(c, "warlock", "charlatan") ? "four" : "five") + " poltergeists and treasures."; },
    aknight: function (c) { return "<b>The Armored Knight</b>, in the Paladin’s place, wins by killing the " + nm(c, "spider") + (c.has("spider") ? ": each hit sends one of her five Spiderlings back to the box." : c.has("shadow") ? ": each of her hits costs the Shadow Paladin 1 Health." : "."); },
    shadow: function () { return "<b>The Shadow Paladin</b>, in the Spider’s place, wins by climbing to the end of the Shadow track and walking out of the entrance by the stairs."; },
    knight: function () { return "<b>The Knight</b> visits from The Crystal Caverns in the Paladin’s seat, chasing her own game’s goal."; },
    goblins: function () { return "<b>The Goblins</b> visit from The Crystal Caverns in the Skeletons’ seat, chasing their own game’s goal."; },
    dragon: function () { return "<b>The Dragon</b> visits from The Crystal Caverns in the Spider’s seat, chasing his own game’s goal."; },
    thief: function () { return "<b>The Thief</b> visits from The Crystal Caverns in the Warlock’s seat, chasing that game’s goal."; }
  };

  var ROLE = {
    paladin: function (c) {
      return "<p><b>The Paladin</b> spends hero cubes on actions. <b>Prepare</b> adds 1 Strength and 1 Defense — you start at zero. <b>Sprint</b> runs two spaces through Lit rooms with nothing that forces a fight. <b>Crusade</b> steps up to one space, then reveals your room, fights what’s there, uses a Shrine and grabs treasure. Exploring and fighting earn <b>Grit</b>, a running total you never spend: reaching 7, 18, 32 and 41 Grit adds a hero cube, and reaching 13 and 25 lets you draw 3 favor cards and keep one — drop back below a mark and you lose a hero cube or discard a favor card. " +
        (c.mode === "solo" ? "Every hit earns <b>Light</b>, and your favor cards spend Fury and Light — Illuminate turns Light into lamps that stop Skeletons.</p>"
          : "You gain <b>Fury</b> each turn you don’t hit the " + nm(c, "spider") + " and <b>Light</b> for every hit; your favor cards spend both" +
            (c.has("skeletons") ? " — Illuminate turns Light into lamps that stop Skeletons" : c.has("goblins") ? " — Illuminate turns Light into lamps that stop the Goblins" : "") + ".</p>");
    },
    skeletons: function (c) {
      return "<p><b>The Skeletons</b> start with two of their five on the board. First you lose 1 <b>Stability</b> per Skeleton on a Lit tile that isn’t a Pit, so lurk in the dark. Then, left to right in your <b>March Order</b>, each moves up to five spaces — crypts and grounds included — and takes one action: STRIKE!! (1 Stability), LOOT!! (+2 Stability, once per turn), BREACH!! (1 Stability), TUNNEL!! or ARM!!. One Skeleton has 1 Strength, but each Skeleton or cackling skulls next to the " + (VM.skelHuntSpider(c) ? nm(c, "spider") : "target") + " adds 1 — that’s <b>Distracting</b>. Attackers crumble and respawn at the front of the line; 3 Stability summons another, and you gain 2 Stability at the end of every turn.</p>";
    },
    spider: function (c) {
      return "<p><b>The Spider</b> shapeshifts each turn: the slow <b>Sorcerer</b> tends Eggs, the <b>Giant Spider</b> moves three and crosses a wall, five <b>Spiderlings</b> run four spaces each through walls. You gain <b>Terror</b> by feeding on Blood and, once six webs are out, by scaring; you play power cards — <b>Eyes</b> reveal, <b>Fangs</b> attack for Blood, <b>Webs</b> stop enemies — and your form sets their reach. Eggs hatch for 2 Terror. You always hit and can’t be forced to attack, but every hit you take costs a Spiderling for good.</p>";
    },
    manor: function () {
      return "<p><b>The Manor</b> is the house. You assign <b>omen cubes</b> to your power tracks — more cubes, stronger power — then reveal rooms, shift, rotate or swap them, drop force walls and move your <b>Wraith</b>. Then you may complete a <b>ritual</b>: a path from the Wraith to the card’s end room through Lit rooms with no figures, never crossing a wall, for Seals and a new poltergeist. Last, you bait the house with treasure on Dark rooms and draw rituals. The Wraith is Ethereal: it walks through walls and can’t attack or be attacked.</p>";
    },
    warlock: function () {
      return "<p><b>The Warlock</b> wants the Manor’s poltergeists and treasures. Each turn you spread <b>curses</b> under the ones in your <b>network</b> — chained to you or to each other — and a piece with enough curses can be dominated onto your track for its bonus. Then you spend <b>magic cubes</b>: Sneak two spaces to a Dark tile, Pit or crypt, Summon a poltergeist, Conjure a cursed treasure, or Syphon Curses from the figures around you. You’re Ethereal but <b>Skittish</b>: an enemy entering your space sends you fleeing with half your Curses — but that, and every cursed piece removed, earns you spells.</p>";
    },
    aknight: function (c) {
      return "<p><b>The Armored Knight</b> takes the " + (c.mode === "cave" ? "Knight" : "Paladin") + "’s seat. Each turn she moves up to her <b>Movement</b> and has up to her <b>Perception</b> in <b>encounters</b> — entering a Dark room forces one: reveal it for Grit, fight, swap sidequests at a Shrine, and turn treasure into Grit or javelins. Hero cubes either raise her Perception, Movement and Strength &amp; Defense tracks or fuel actions: Throw Javelin, Lob Bomb, Intuit, Repair Armor and Bolster. Grit brings more cubes, and <b>sidequests</b> pay off when she meets them.</p>";
    },
    shadow: function (c) {
      return "<p><b>The Shadow Paladin</b> takes the " + (c.mode === "cave" ? "Dragon" : "Spider") + "’s seat. Each turn they collect the <b>ruin cubes</b> on the map, move up to two spaces crossing up to one wall, play power cards — Gaze, Float, Shroud, Strike — and use <b>chains</b>, then spend Ruin to climb the <b>Shadow track</b>. Every isolated Lit room gets a ruin cube for next turn, and if no chain broke they gain Ice for force walls. They’re Cowardly — no entering rooms with figures, fleeing to the nearest Dark tile when hit — and " +
        (c.mode === "cave" ? "their Formidable trait names only the Paladin’s (or Armored Knight’s) hits as costing them Health. In the Cave the Knight can roll the Dragon die against them when her Strength equals their Defense, but the sources don’t say whether her hit costs them Health — agree a ruling before you start."
          : !c.occupant("paladin") ? "their Formidable trait names only the Paladin’s (or Armored Knight’s) hits as costing them Health — there’s no Paladin in this mix, so agree a ruling on how the Skeletons can kill them."
          : "only the " + nm(c, "paladin") + "’s hits cost them Health.") + "</p>";
    },
    knight: function () {
      return "<p><b>The Knight</b> plays by The Crystal Caverns’ rules, with Manor changes: her Bow can remove a Skeleton, her Bomb blows a breach in a wall instead of using bomb tokens, her Ancient Map can’t enter crypts, each poltergeist she removes is worth 2 Grit, and webs cost her an extra Movement.</p>";
    },
    goblins: function () {
      return "<p><b>The Goblins</b> play by The Crystal Caverns’ rules, with Manor changes: Tribes start on the numbered Spawns and are never hidden — a scattered or hiding Tribe rolls back onto a Spawn. They lurk in crypts, but a Tribe that moves from a crypt or a Spawn onto a tile forfeits its action; they can’t enter the grounds, treat Pits as Dark for Ambushes, and stop for webs only in Dark rooms.</p>";
    },
    dragon: function (c) {
      return "<p><b>The Dragon</b> plays by The Crystal Caverns’ rules, with Manor changes: at 11 Wakefulness he may surface at any Pit" + (c.has("paladin") ? ", the Paladin can strike him underground for 1 Fury" : "") + ", his powers that would scatter Tribes instead remove Skeletons and poltergeists, and his Gems count as enemy tokens to everyone else.</p>";
    },
    thief: function () {
      return "<p><b>The Thief</b> plays by The Crystal Caverns’ rules, with Manor changes: treasures are stashed at the Entrance or the central Pit, enemy tokens are ignored, each newly revealed Shrine gets a vault token, climbing a wall costs just 1 cube, and Pickpocket, Backstab and Loot Drop have Manor results in our reference.</p>";
    }
  };

  function collide(c) {
    var hero = c.has("paladin") || c.has("aknight");
    var L = [];
    if (c.has("spider") && hero) L.push("The Spider must dodge the " + nm(c, "paladin") + " long enough to escape; webs slow " + (c.has("aknight") ? "her" : "him") + (c.has("paladin") ? ", but every turn he misses her he builds Fury." : "."));
    if (c.has("manor") && c.has("skeletons")) L.push("Skeletons in big Lit areas spoil the Manor’s ritual paths, at a cost in Stability — a Skeleton on a Pit loses none.");
    if (c.has("warlock")) L.push("Poltergeists and treasures are the Warlock’s network — smash or loot a cursed one and he gains spells.");
    if (c.has("spider")) L.push((c.has("skeletons") ? "Skeletons and poltergeists are" : "Poltergeists are") + " easy prey for the Spider’s Fangs: Blood for her" + (c.has("paladin") ? " — and every poltergeist she eats is 3 Grit the Paladin never gets." : "."));
    if (c.has("manor") && hero) L.push("The " + nm(c, "paladin") + " lights up more rooms than anyone, which helps the Manor build ritual paths.");
    if (c.has("manor")) L.push("Treasure is bait: the Manor places it, and everyone chases it.");
    if (c.has("skeletons") && c.has("paladin") && !VM.skelHuntSpider(c)) L.push("The Paladin hunts the " + nm(c, "spider") + " and the Skeletons hunt the Paladin: predict where the " + nm(c, "spider") + " is going and you predict where he’ll be.");
    if (!L.length) L.push("Every role’s plan gets in somebody else’s way — watch what the others need and deny it.");
    return "<p>The central idea: we all share one changing house, and every plan gets in somebody else’s way.</p>" + ul(L.slice(0, 4));
  }

  VM.teach = {
    intro: "A ~5-minute teach for the exact roles and options selected above. Read it aloud, or hit Copy and tweak. Every rule in it comes from the living rules, the setup sheets and the Haunted Hallways booklet cited in the setup steps.",
    sections: [
      { h: "The hook — and how you win",
        body: function (c) {
          if (c.mode === "solo") {
            var lv = c.solo.lv;
            return "<p>Tonight it’s just you: the Paladin, alone in the Manor, come to destroy the spirits inside. You win by hitting <b>" + lv.polts + " poltergeists</b>. You lose if your Health hits zero — or if your <b>Terror</b> reaches <b>" + lv.terror + "</b>, and Terror climbs every turn.</p>";
          }
          if (c.mode === "cave") {
            var t = VM.travelerById(c.trav);
            return "<p>Tonight one of us takes a role from Vast: The Mysterious Manor into <b>Vast: The Crystal Caverns</b>. Teach The Crystal Caverns as usual first — our Crystal Caverns page has its own script — then add this: the <b>" + VM.roleName(c.trav) + "</b> takes the <b>" + t.cave + "</b>’s seat, and anything that mentions the " + t.cave + " now means the " + VM.roleName(c.trav) + ".</p>";
          }
          return "<p>Welcome to Vast: The Mysterious Manor. We’re each playing a different game on the same board:</p>" +
            ul(c.roles.map(function (r) { return GOAL[r](c); })) + "<p>No teams, no points: play continues until someone wins.</p>";
        } },
      { h: "The shape of a turn",
        body: function (c) {
          if (c.mode === "solo") return "<p>Your turn is the Paladin’s normal turn — collect hero cubes, spend them on Prepare, Sprint and Crusade — except the last step now reads: gain 1 Fury if you didn’t hit a poltergeist, <i>and</i> gain 1 Terror. Then the Skeletons move, then they spawn, and you go again.</p>";
          if (c.mode === "cave") return "<p>The " + VM.roleName(c.trav) + " takes the " + VM.travelerById(c.trav).cave + "’s turn and plays it from the Manor role’s own board and setup sheet.</p>";
          return "<p>Turns go <b>" + c.roles.map(function (r) { return VM.roleName(r); }).join(", ") + "</b>, then around again. On your turn you work down the numbered steps on your own board. No two roles share steps — here’s the gist of each in a moment.</p>";
        } },
      { when: function (c) { return c.has("map"); },
        h: "The Manor itself",
        body: function () {
          return "<p>The board is the Manor: a grid of square crypts inside the grounds. Most rooms start as <b>Dark tiles</b>. Revealing one flips it Lit — turn it so an open edge meets a neighbour’s if you can — fills every crypt touching its open edges with a new Dark tile, and resolves its icon: blood, treasure, a poltergeist, or a Pit, Armory or Shrine for later. Moves are one adjacent space at a time: no diagonals, no walls, and no crypts or grounds unless your role allows it. Entering a room with enemy tokens removes one of each.</p>";
        } },
      { when: function (c) { return c.mode !== "cave"; },
        h: "Fighting and seeing",
        body: function () {
          return "<p>Enter a room with an enemy figure and you <b>must attack</b>: you hit if your Strength is greater than its Defense, and a hit removes it. Miss after being forced in and you retreat. Poltergeists have 1 Defense. To <b>see</b> something, trace a straight line (no diagonals) that crosses no wall, crypt or Dark tile — though it can start in your own Dark tile and end in the target’s. Breaches turn walls into open edges; force walls do the reverse.</p>";
        } },
      { h: function (c) { return c.mode === "multi" ? "What each role does — and why" : c.mode === "solo" ? "What you do — and why" : "The traveler’s turn"; },
        body: function (c) {
          if (c.mode === "cave") return ROLE[c.trav](c);
          return c.roles.map(function (r) { return ROLE[r](c); }).join("");
        } },
      { when: function (c) { return c.mode === "multi"; },
        h: "How the roles collide",
        body: function (c) { return collide(c); } },
      { when: function (c) { return c.mode === "solo"; },
        h: "The two dials — the heart of the solo game",
        body: function () {
          return "<p>You keep two enemy dials. <b>Stability</b> moves only when you reveal tiles — up 1 for a Pit, down 1 for an Armory — and as it climbs, Skeletons move farther, hit harder and come back faster. <b>Terror</b> rises every turn and with each Blood tile you reveal, and drops whenever you clear a blood token by walking in; as it climbs, poltergeists get stronger and you must discard treasure or favor cards. Every reveal is a gamble.</p>";
        } },
      { when: function (c) { return c.mode === "solo"; },
        h: "How the Skeletons hunt you",
        body: function () {
          return "<p>All the Skeletons start in play. Left to right, each one <b>attacks</b> you if it can reach you with enough Strength; otherwise gets <b>next to you</b> to distract; otherwise <b>creeps</b> closer. No abilities or gear; one wall per turn; never the grounds; poltergeists ignored; lamps and your pillar of light steer them. A Skeleton that hits you moves its card to the front of the March Order, and the Skeleton is removed and laid on its side above its card, just like one you knock over. Then the <b>Spawn phase</b> rolls removed Skeletons back onto the Spawns — those lying on their side, like the ones you knock over, wait a turn unless the Rush value stands them up.</p>";
        } },
      { when: function (c) { return c.mode === "solo"; },
        h: function (c) { return "Difficulty: " + c.solo.lv.name + (c.solo.campaign ? " — campaign game" : ""); },
        body: function (c) {
          var lv = c.solo.lv, r = c.solo.ranks;
          return "<p>We’re playing <b>" + lv.name + "</b>: " + lv.skels + " Skeletons, a loss at " + lv.terror + " Terror, a win at " + lv.polts + " poltergeists" + (c.solo.level === "hard" ? " — the sixth Skeleton comes from Haunted Hallways" : "") + ".</p>" +
            (c.solo.campaign ? "<p>This is a <b>campaign</b> game: our ranks — Fury &amp; Light " + r.fl + ", Stability " + r.st + ", Terror " + r.te + " — set the starting Fury and Light, Stability and Terror. Win, and we raise one category a rank, never one already ahead of another. Finish a game with all three at rank 3 and you’re a Vast Master.</p>" : "");
        } },
      { when: function (c) { return c.mode === "multi" && c.mixObj.changes.length > 0; },
        h: function (c) { return "This mix: " + c.mixObj.name; },
        body: function (c) { var n = VM.mixNotes(c); return "<p>The <b>" + c.mixObj.name + "</b> mix changes a few things:</p>" + ul(c.mixObj.changes.map(function (ch) { return ch.t; })) + (n.length ? "<p><i>" + n.join(" ") + "</i></p>" : ""); } },
      { when: function (c) { return c.mode === "multi" && VM.variantRoles.some(function (r) { return c.diff(r); }); },
        h: "Difficulty variants tonight",
        body: function (c) {
          return ul(VM.variantRoles.filter(function (r) { return c.diff(r); }).map(function (r) {
            var v = VM.variant(c, r);
            var note = "";
            if (r === "skeletons" && !c.has("paladin")) note = c.has("aknight") ? (["master", "warlord"].indexOf(v.id) >= 0 ? " — the Armored Knight has no treasure cards; the sources don’t cover this." : " — read it as the Armored Knight.") : c.has("knight") ? " — under Find and Replace it names the Knight; read it literally." : " — this mix has no Paladin, so it has no effect as written.";
            if (r === "paladin" && (v.id === "squire" || v.id === "protector") && !c.has("spider")) note = " — with the " + VM.seatName(c, "spider") + " in the Spider’s seat there are no Spiderlings to give; the sources don’t cover this.";
            return "The <b>" + VM.roleName(r) + "</b> play" + (r === "skeletons" ? "" : "s") + " <b>" + v.name + "</b> (" + v.lvl + "): “" + v.t + "”" + note;
          }));
        } },
      { when: function (c) { return c.has("hhskel") || c.has("hhmini"); },
        h: "Haunted Hallways pieces",
        body: function (c) {
          return (c.has("hhskel") ? (c.mode === "solo" ? "<p>Some Skeletons are <b>new recruits from Haunted Hallways</b>: they swap in one-for-one. In solo they still use no abilities or gear.</p>" : "<p>Some Skeletons are <b>new recruits from Haunted Hallways</b>: they swap in one-for-one, with their abilities and gear on their own cards.</p>") : "") +
            (c.has("hhmini") ? "<p>We’re using the <b>Haunted Hallways miniatures</b> in place of some of the pieces.</p>" : "");
        } },
      { when: function (c) { return c.has("travel"); },
        h: "Traveling rules",
        body: function (c) {
          return "<p>Because a role is traveling between games: <b>Find and Replace</b> — text naming the replaced role now names the traveler. <b>Dead cards</b> — read cards literally and don’t convert game terms; some may do nothing. When someone attacks by moving, the <b>defender’s own game</b> decides the result" +
            (c.mode === "multi" ? ", and a Caverns role must attack only where a Manor role of the same colour would. A Caverns role that forces one of ours to move can put it on any legal tile." : ", and a Caverns role must attack by moving only where a Manor role of the same colour would. A Caverns role that forces a Manor role to move can put it on any legal tile — the Warlock may be forced into crypts, the Skeletons into crypts and grounds.") +
            (c.mode === "cave" ? " In the Cave, the Entrance and Crystal tiles can never be flipped to their Dark side." : "") + "</p>";
        } },
      { when: function (c) { return c.mode === "cave"; },
        h: function (c) { return "The " + VM.roleName(c.trav) + " in the Cave"; },
        body: function (c) {
          return (function (t) {
          if (t === "paladin") return "<p>The Paladin can attack the underground Dragon by spending 1 Fury, can’t sprint into a tile with an event token, resolves events as written, and counts a Goblin Tribe as a single figure when he gains Light for a hit.</p>";
          if (t === "spider") return "<p>Goblins ignore webs in Lit tiles, but a Tribe stops when it enters a Dark tile with webs. The Knight pays 2 Movement to enter a webbed tile, then removes 1 web there. Revealed Event tiles get a blood token — and if the Spider revealed it, she gains 1 Blood. Fangs can smash a crystal, and the Knight can roll the Dragon die against the Spider when her Strength equals the Spider’s Defense.</p>";
          if (t === "warlock") return "<p>The Warlock brings the poltergeist figures and force wall markers, treats the map’s outside edge as crypts, plays the top tile from the stack when he uses Expand, and can be made Skittish by the Goblins only once per turn. The Knight gains 2 Grit for each poltergeist she removes. If nobody is playing the Cave role, he starts with the Past Plunder variant card.</p>";
          if (t === "skeletons") return "<p>The living rules give the Skeletons no Cave-specific changes — just the traveling rules above. If we’re playing without a role, use that role’s own variant rules: with the Knight and the Dragon, the Dragon takes the Past Plunder variant card.</p>";
          if (t === "aknight") return "<p>In the Cave the Armored Knight uses the Knight’s sidequest cards, and completing one earns her an artifact instead of Grit.</p>";
          return "<p>In the Cave the Shadow Paladin escapes from the Entrance tile, scatters any Goblin Tribe it attacks, can’t Shroud Crystal tiles, and can use Shadow Crawl to reach Ambush tiles. The Knight can roll the Dragon die against it when her Strength equals its Defense.</p>";
          })(c.trav) + "<p>One table ruling: where your own rules name another Manor role, we’ll read it as the Caverns role of the same colour — the living rules leave that to us.</p>";
        } },
      { h: "Don’t worry about these until they come up",
        body: function (c) {
          var L = ["<b>Card text</b> — each card explains itself, and a card beats the rules."];
          if (c.has("manor")) L.push("<b>Shift and Swap limits</b> — the Manor’s tracks say how far.");
          L.push("<b>Breach plus force wall</b> on one edge — remove both.");
          L.push("<b>Running out</b> — no proxy pieces; an empty deck reshuffles its discards.");
          if (c.has("warlock")) L.push("<b>Dominated Pieces bonuses</b> — printed on the Warlock’s board.");
          if (c.has("spider")) L.push("<b>The Spider’s Defense and hand size</b> — they climb with the Terror on her board.");
          if (c.has("shadow")) L.push("<b>Chains and Shadow track costs</b> — printed on the Shadow Paladin’s cards and board.");
          if (c.mode === "solo") L.push("<b>The Stability and Terror charts</b> — check the reference when a dial moves.");
          if (c.has("travel")) L.push("<b>Odd cross-game interactions</b> — read the cards literally and make a quick ruling.");
          return ul(L);
        } }
    ]
  };
})();
