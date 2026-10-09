/* =============================================================================
   Vast: The Mysterious Manor — Setup & Reference Utility · rules reference
   Every section is written from the living rules (LR, cited by section), the setup sheets and the
   Haunted Hallways booklet. VM.reference = [{ title, when(c), html(c), src(c) }]
   ============================================================================= */
(function () {
  var LR = VM.LR, li = VM.li, ol = VM.ol, cites = VM.cites;
  function tbl(head, rows, cls) {
    return "<table class=\"ref-table" + (cls ? " " + cls : "") + "\"><thead><tr>" + head.map(function (h) { return "<th scope=\"col\">" + h + "</th>"; }).join("") +
      "</tr></thead><tbody>" + rows.map(function (r) { return "<tr>" + r.map(function (x, i) { return i === 0 ? "<th scope=\"row\">" + x + "</th>" : "<td>" + x + "</td>"; }).join("") + "</tr>"; }).join("") + "</tbody></table>";
  }
  function h(t) { return "<h4>" + t + "</h4>"; }
  var SEC_SOLO = "The Paladin’s Journey (Solo)";
  var TR = "Traveling Between Vast Games";

  /* who the Skeletons hunt at this table */
  function skelPrey(c) { return VM.skelHuntSpider(c) ? VM.seatName(c, "spider") : VM.seatName(c, "paladin"); }
  /* in the Cave, the traveler's own chapter reads other Manor roles as the Caverns role of the same colour — a table ruling */
  VM.caveSeatNote = function (c) {
    if (c.mode !== "cave") return "";
    var t = VM.travelerById(c.trav);
    return "<p class=\"inline-note\">In the Cave, Find and Replace only makes Caverns text naming the " + t.cave + " mean the " + VM.roleName(c.trav) + ". The living rules don’t say what your own rules mean when they name another Manor role there; this page reads it as the Caverns role of the same colour (Paladin → Knight, Skeletons → Goblins, Spider → Dragon, Warlock → Thief) — a table ruling, so agree it before play.</p>";
  };
  /* Skeletons' STRIKE!!: what a hit does depends on who holds the Paladin and Spider seats (HH pp.1–3; LR › Traveling Between Vast Games › General Rules › Attacking by Movement). */
  function strikeDefenders(c) {
    var cave = c.mode === "cave";
    var ps = cave ? "knight" : c.occupant("paladin"), ss = cave ? "dragon" : c.occupant("spider");
    var byCaverns = ": the hit follows The Crystal Caverns’ rules (Attacking by Movement).";
    return ({ paladin: " Paladin: his Formidable trait triggers.", aknight: " Armored Knight: her Formidable trait triggers (she is not removed and loses 1 Health).", knight: " Knight" + byCaverns }[ps] || "") +
      ({ spider: " Spider: her Shapeshifter trait triggers.", shadow: " Shadow Paladin: their Formidable trait triggers — they are not removed (they lose Health only when hit by the Paladin or Armored Knight) — and, Cowardly, they immediately move to the nearest Dark tile.", dragon: " Dragon" + byCaverns }[ss] || "") +
      (!cave && c.occupant("warlock") === "thief" ? " Thief" + byCaverns : "");
  }
  function caveSeatSrc(c) { return c.mode === "cave" ? LR(TR) + " · " + LR(TR + " › General Rules (Find and Replace, Dead Cards and Abilities)") : ""; }

  VM.caveNote = function (c) { return c.mode === "cave" ? "<p class=\"inline-note\">Shown for reference: these are The Mysterious Manor’s core rules. Beyond the traveling rules, the living rules don’t say which of them carry over into the Cave.</p>" : ""; };
  VM.reference = [
    {
      title: "Golden rules",
      when: function () { return true; },
      html: function () {
        return h("Public information") + li([
          "All components are public information, except <b>cards in a player’s hand</b> (visible only to that player) and <b>cards in decks or the Lit sides of Dark tiles</b>."
        ]) + h("Rules for components") + li([
          "Components are limited by their included quantities. If you run out of one, <b>do not use proxies</b>.",
          "Hand sizes are <b>unlimited</b> unless otherwise noted.",
          "A dial or tracking cube (such as Health or Seals) can’t move outside its boundaries.",
          "Need to draw from an empty deck? Shuffle its discard pile into a new deck and keep drawing. If the discard pile is empty too, you can’t draw those cards."
        ]) + h("Reading these rules") + li([
          "If the rules don’t say you can’t do something, you can — within the confines of those rules.",
          "<b>Nothing requires consent.</b> Just do the thing.",
          "If a rule doesn’t tell you something happens, <b>it doesn’t happen</b>. Follow the word of the rules, not your instinct.",
          "A specific term means only that term — never a closely related one.",
          "<i>Italic text is a reminder</i> of another rule; it never overrides the original, non-italic rule."
        ]) + h("Rules disagreements") + li([
          "A <b>card</b> beats any other rule. A <b>variant</b> beats a core rule. A <b>role</b> beats a core rule.",
          "If a role doesn’t contradict a core rule and you can follow both, follow both; if you can’t, follow the role."
        ]);
      },
      src: function () { return LR("Golden Rules › Public Information, Rules for Components, Reading These Rules, Rules Disagreements"); }
    },
    {
      title: "Glossary",
      when: function () { return true; },
      html: function () {
        var g = [
          ["Adjacent", "Each space touching the <b>edge</b> of a given space. Diagonal spaces are <b>not</b> adjacent."],
          ["Crypt", "A square space on the map without a tile."],
          ["Empty", "Contains no pieces."],
          ["Enemy", "A piece that is not your own."],
          ["Figure", "A cardboard standee or plastic miniature."],
          ["Gain", "Increase the prompted dial or track, or place the prompted piece in the prompted box on your board."],
          ["Grounds", "A rectangular space around the outside of the map, bounded by hedges, adjacent to multiple crypts."],
          ["Map", "The shared board on which pieces are placed and move around."],
          ["Marker", "A cardboard piece that is not a figure, tile or token."],
          ["Lose", "Decrease the prompted dial or track, or remove the prompted piece from the prompted box on your board."],
          ["Open edge", "A tile edge not showing a printed wall and not touching an adjacent tile edge showing a printed wall."],
          ["Piece", "Any game component."],
          ["Place", "Take the prompted piece from the owner’s supply and add it to the prompted space."],
          ["Remove", "Return the prompted piece to the owner’s supply."],
          ["Return to the box", "Eliminate the piece from play for the rest of the game."],
          ["Space", "Any bounded shape on the map, whether or not it contains a tile."],
          ["Spend", "Decrease the prompted dial or track, or return the prompted piece to your supply."],
          ["Surrounding", "Each space touching the edge <b>or corner</b> of a given space. Diagonal spaces are surrounding."],
          ["Tile", "A square cardboard piece equal in size to a crypt."],
          ["Token", "A round cardboard piece."],
          ["Wall", "A tile edge showing a printed wall, or touching an adjacent tile edge showing a printed wall."]
        ];
        return "<dl class=\"gloss\">" + g.map(function (x) { return "<dt>" + x[0] + "</dt><dd>" + x[1] + "</dd>"; }).join("") + "</dl>";
      },
      src: function () { return LR("Golden Rules › Glossary"); }
    },
    {
      title: "How to play — goals and turn order",
      when: function (c) { return c.mode === "multi"; },
      html: function (c) {
        var goals = {
          paladin: "The <b>Paladin</b> wants to kill the " + VM.seatName(c, "spider") + ".",
          skeletons: "The <b>Skeletons</b> want to kill the " + (VM.skelHuntSpider(c) ? VM.seatName(c, "spider") + " <i>(this role mix)</i>" : VM.seatName(c, "paladin")) + ".",
          spider: "The <b>Spider</b> wants to gain " + (VM.v(c, "spider", "hatchling") ? "8" : VM.v(c, "spider", "consumer") ? "10" : "12") + " Terror and then escape the Manor.",
          manor: "The <b>Manor</b> wants to complete " + (VM.v(c, "manor", "shack") ? "11" : VM.v(c, "manor", "villa") ? "13" : "14") + " Seals.",
          warlock: "The <b>Warlock</b> wants to dominate " + (VM.v(c, "warlock", "charlatan") ? "4" : "5") + " pieces.",
          aknight: "The <b>Armored Knight</b> wants to kill the " + VM.seatName(c, "spider") + ".",
          shadow: "The <b>Shadow Paladin</b> wants to reach the last space of the Shadow track and then leave through the Manor’s entrance.",
          knight: "The <b>Knight</b> visits from The Crystal Caverns: her goal is in that game’s rules (Find and Replace applies).",
          goblins: VM.skelHuntSpider(c) ? "The <b>Goblins</b> visit from The Crystal Caverns. This role mix says “The Skeletons now win if they kill the Spider”; the sources don’t say whether that applies to the Goblins in their seat (the traveling rules assume mixes with the core roles, and this one has no Paladin), so agree the Goblins’ goal as a ruling before you start <i>(this role mix)</i>." : "The <b>Goblins</b> visit from The Crystal Caverns: their goal is in that game’s rules (Find and Replace applies).",
          dragon: "The <b>Dragon</b> visits from The Crystal Caverns: his goal is in that game’s rules (Find and Replace applies).",
          thief: "The <b>Thief</b> visits from The Crystal Caverns: the Thief’s goal is in that game’s rules (Find and Replace applies)."
        };
        return "<p>Vast is asymmetric: each role plays and wins in a very different way.</p>" + li(c.roles.map(function (r) { return goals[r]; })) +
          h("Turn order") + ol(c.roles.map(function (r) { return VM.roleName(r); })) +
          "<p>The full order is Paladin, Skeletons, Spider, Manor, Warlock; roles not in play are skipped" + (VM.replaceNote(c).length ? ", and a replacement role takes the turn of the role it replaces" : "") + ". Play continues until a player wins.</p>";
      },
      src: function (c) { return cites([LR("How to Play"), (c.has("aknight") || c.has("shadow")) ? VM.HH(1) : "", c.has("shadow") ? VM.HH(2) : "", c.has("aknight") ? VM.HH(3) : "", c.vis ? LR(TR) : "", c.vis ? LR(TR + " › General Rules › Find and Replace") : "", VM.skelHuntSpider(c) ? LR(c.mixObj.sec) : ""]); }
    },
    {
      title: "The map — moving and revealing",
      when: function (c) { return c.has("map"); },
      html: function (c) {
        return "<p>The map is a grid of square spaces called <b>crypts</b>, surrounded by the <b>grounds</b> and separated from them by hedges. Crypts fill with tiles during play; the grounds can never hold tiles.</p>" +
          h("Moving") + li([
            "Each time you move, pick up your figure and place it on an <b>adjacent tile</b> (diagonals are not adjacent).",
            "You <b>cannot cross walls</b> or enter crypts or the grounds — unless your role says otherwise.",
            "<b>Tokens:</b> each time you enter a tile with any enemy tokens, remove one of each enemy token there."
          ]) +
          h("Revealing a Dark tile") + "<p>Most tiles start on their Dark side. To reveal one:</p>" + ol([
            "<b>Flip and orient the tile.</b> Rotate it as you choose, but at least 1 open edge must touch an open edge of an adjacent tile, if possible.",
            "<b>Fill crypts on open edges.</b> Take Dark tiles from the stack and place 1 Dark tile in each crypt touching an open edge of the revealed tile.",
            "<b>Resolve the tile</b> by its icon (below)."
          ]) +
          tbl(["Tile", "When revealed"], [
            ["Blood", "Place a blood token here."],
            ["Treasure", "Place a treasure marker here."],
            ["Poltergeist", "Place a poltergeist figure here."],
            ["Pit", "No immediate effect. Later, Skeletons can move here easily (TUNNEL!!)."],
            ["Armory", "No immediate effect. Later, Skeletons can collect gear cards here (ARM!!)."],
            ["Shrine", c.has("aknight") ? "No immediate effect. Later, the Armored Knight can use it in an encounter: discard any number of sidequest cards to draw that many (Haunted Hallways p.3)." : "No immediate effect. Later, the Paladin can crusade here to gain 1 Fury, 1 Light or a new favor card."]
          ]) + (c.mode === "solo" ? "<p class=\"inline-note\">Solo: revealing an Armory also loses 1 Stability, a Blood tile also gains 1 Terror, and a Pit also gains 1 Stability.</p>" : "");
      },
      src: function (c) { return cites([LR("The Map › Moving Around the Map, Revealing the Map"), LR("Key Action Reference › Revealed Tiles"), c.mode === "solo" ? LR(SEC_SOLO + " › The Paladin › Revealing Tiles") : "", c.has("aknight") ? VM.HH(3) : ""]); }
    },
    {
      title: "Attacking enemies",
      when: function () { return true; },
      html: function (c) {
        return VM.caveNote(c) + li([
          "You can attack enemy figures. <b>When you enter a tile with an enemy figure, you must attack it</b> — you have to fight your way in.",
          "Compare your <b>Strength</b> with the enemy’s <b>Defense</b>:<ul><li><b>Greater:</b> you hit. Remove the enemy figure from the map (sometimes a hit causes more effects).</li>" +
            "<li><b>Not greater:</b> you miss; the figure stays. If you were forced to attack by moving into the tile, you must <b>retreat</b> — put your figure back in the tile it came from.</li></ul>",
          "Each role lists its own Strength and Defense. <b>Poltergeists</b> have no Strength and <b>1 Defense</b>.",
          "<b>Move</b>, <b>attack</b> and <b>reveal</b> are key actions each role takes in its own way — see the Key action reference."
        ]);
      },
      src: function () { return LR("Attacking Enemies (incl. When can I...?)"); }
    },
    {
      title: "Distances, visibility, breaches and force walls",
      when: function () { return true; },
      html: function (c) {
        return VM.caveNote(c) + h("Distances") + li(["Always count distances across edges, <b>never diagonally</b>."]) +
          h("Visibility") + li([
            "A piece is <b>visible</b> to you if you can trace a straight line (not diagonal) from your figure to it.",
            "The line can’t pass through a <b>wall</b>, a <b>crypt</b> or a <b>Dark tile</b> — but it can start out of a Dark tile holding your figure, and end in a Dark tile holding the target."
          ]) +
          h("Breaches and force walls") + li([
            "A <b>breach</b> over a wall makes it an open edge.",
            "A <b>force wall</b> over an open edge makes it a wall.",
            "The outer wall touching the grounds <b>cannot be breached</b>.",
            "An edge with both a force wall and a breach: remove both.",
            "Whenever a tile is rotated, moved or flipped to its Dark side, remove all breaches and force walls on that tile."
          ]);
      },
      src: function () { return LR("A Few More Concepts... › Distances, Visibility, Breaches and Force Walls"); }
    },
    {
      title: "The Paladin",
      when: function (c) { return c.has("paladin"); },
      html: function (c) {
        var solo = c.mode === "solo", cave = c.mode === "cave";
        var gob = c.has("goblins") || cave;
        var goal = solo ? "Solo: see <i>The Paladin’s Journey</i> — you hit poltergeists instead of chasing a Spider player."
          : cave ? "You win if you kill the <b>Dragon</b> <i>(table ruling: your rules name the Spider, who isn’t in the Cave; the living rules don’t restate this goal there — see the note above)</i>. How your attacks hit and kill him follows The Crystal Caverns’ rules (Attacking by Movement) — see " + VM.CAVES_LINK + ". You can attack him underground by spending 1 Fury."
          : c.has("dragon") ? "You win if you kill the <b>Dragon</b> (Find and Replace: your rules’ “Spider” now means him). The 5 Spiderlings are the Spider’s own and don’t carry over (Dead Cards and Abilities): whether you hit the Dragon and what a hit does follow The Crystal Caverns’ rules for him (Attacking by Movement) — see " + VM.CAVES_LINK + ". You can attack him underground by spending 1 Fury."
          : c.has("shadow") ? "You win if you kill the <b>Shadow Paladin</b> (Haunted Hallways: text naming the Spider now means them). Each of your hits costs them 1 Health (their Formidable trait), and when hit they immediately move to the nearest Dark tile (Cowardly); the 5 Spiderlings are the Spider’s own."
          : "You win if you kill the " + VM.seatName(c, "spider") + ", by returning her 5 Spiderlings to the box (the setup sheet: hitting her five times).";
        return VM.caveSeatNote(c) + h("Goal") + li([goal,
            solo ? "You lose at 0 Health — or at the solo Terror limit." : (c.seat("skeletons") && !VM.skelHuntSpider(c)) ? "You lose if the " + VM.seatName(c, "skeletons") + " reduce your Health to 0 (setup sheet)." : ""]) +
          h("Trait") + li(["<b>Formidable:</b> your figure is not removed when hit. Each time you are hit by " + (gob ? "the <b>Goblins</b> (" + (cave ? "table ruling — see the note above" : "Find and Replace") + ")" : "a Skeleton") + ", you lose 1 Health."]) +
          h("Strength and Defense") + li(["You start with <b>0 Strength and 0 Defense</b>; raise them with the Prepare action and by spending Fury.",
            VM.v(c, "skeletons", "miscreant") ? "Health starts on <b>5</b> (Miscreant variant)." : VM.v(c, "skeletons", "boss") ? "Health starts on <b>6</b> (Boss variant)." : "Health starts on 7 (setup sheet)."]) +
          h("Your turn") + ol([
            "<b>Collect hero cubes:</b> take all the hero cubes off your board and put them in the Unassigned Hero Cubes box.",
            "<b>Take actions</b> in any order and number. To take one, place a hero cube in its box:<ul>" +
              "<li><b>Prepare:</b> gain 1 Strength and 1 Defense. Any time — even during a crusade or sprint.</li>" +
              "<li><b>Sprint:</b> move up to 2 spaces. You can only enter Lit tiles with no figures that force attacks.</li>" +
              "<li><b>Crusade:</b> move 0 or 1 spaces, then resolve the crusade steps below.</li></ul>You may end this phase after completing any action.",
            solo ? "<b>Gain Fury (solo text):</b> gain 1 Fury if you did not hit a poltergeist this turn. Also, gain 1 Terror." : "<b>Gain Fury:</b> gain 1 Fury if you did not hit the " + VM.seatName(c, "spider") + (cave ? " <i>(table ruling)</i>" : "") + " this turn."
          ]) +
          h("Crusade steps") + ol([
            "<b>Reveal Dark tile:</b> if you are on a Dark tile, reveal it and gain <b>2 Grit</b>. An open edge of the revealed tile must touch the tile you moved from.",
            "<b>Attack figures:</b> you can attack figures on your tile; you must attack figures that force attacks before ones that don’t:<ul>" +
              (gob ? "<li><b>Goblin Tribe:</b> it scatters (Attacking by Movement)" + (cave ? "" : ": roll the spawn die and place it on the matching Spawn") + "; a Tribe counts as a single figure for gaining Light.</li>"
                : "<li><b>Skeleton:</b> its Undead trait triggers" + (solo ? " (solo: it doesn’t — see the solo rules)" : "") + ".</li>") +
              (c.has("shadow") ? "<li><b>Shadow Paladin:</b> their Formidable trait triggers (they lose 1 Health), and Cowardly: they immediately move to the nearest Dark tile.</li>"
                : (c.has("dragon") || cave) ? "<li><b>Dragon:</b> resolve the hit by The Crystal Caverns’ rules (Attacking by Movement).</li>"
                : "<li><b>Spider:</b> her Shapeshifter trait triggers.</li>") + "<li><b>Egg:</b> remove all blood tokens from its tile; gain <b>5 Grit</b>.</li><li><b>Poltergeist:</b> gain <b>3 Grit</b>.</li><li>Gain <b>1 Light</b> each time you hit an enemy figure.</li></ul>",
            "<b>Use Shrine:</b> on a Shrine, gain 1 Fury or 1 Light, <i>or</i> discard a favor card to draw 3 favor cards, keep 1 and discard 2. You can’t discard Vigor or Illuminate. A Shrine can be used many times a game." + (VM.v(c, "paladin", "justicar") ? " <b>Justicar: you cannot use Shrines.</b>" : ""),
            "<b>Collect treasures:</b> remove each treasure marker on your tile, one at a time. For each, the Manor draws 2 treasure cards, gives you one and discards the other; with no Manor player, draw a treasure card. Keep the card in your hand, or return it to the box to gain <b>5 Grit</b>. If the Manor can’t give you a card because the treasure deck is empty, gain 5 Grit."
          ]) +
          h("Grit") + tbl(["Grit", "Reaching it", "Falling below it"], [
            ["7, 18, 32, 41", "Immediately take a hero cube from your supply into your Unassigned box (usable this turn).", "Immediately remove a hero cube from your board to your supply."],
            ["13, 25", "Immediately draw 3 favor cards, keep 1, discard 2.", "Immediately discard a favor card (not Vigor or Illuminate)."]
          ]) +
          h("Fury, Light, favor and treasure") + li([
            "Track Fury and Light with fury and light tokens on their spaces: up to <b>5 Fury</b> and <b>8 Light</b> at a time.",
            "Any time in your Take Actions phase, you can play a treasure or favor card from your hand; played cards give persistent effects.",
            "Spend Fury and Light to use your favor cards’ effects any time in your Take Actions phase, even during an action.",
            "<b>Lamps:</b> your Illuminate favor card lets you spend Light to place lamp tokens (the back of light tokens). " +
              (gob ? "When a Goblin Tribe enters a tile with a lamp, it stops moving <i>(" + (cave ? "table ruling — see the note above" : "Find and Replace: the living rules don’t mention lamps for the Goblins directly") + ")</i>." : "A Skeleton that enters a tile with a lamp stops moving.")
          ]);
      },
      src: function (c) {
        var sv = VM.variant(c, "skeletons");
        return cites([LR("The Paladin (whole chapter)"), VM.SS.paladin, c.mode === "solo" ? LR(SEC_SOLO + " › The Paladin") : "",
          sv && (sv.id === "miscreant" || sv.id === "boss") ? LR(VM.variantSec("skeletons", sv)) : "",
          c.has("shadow") ? VM.HH(1) + " · " + VM.HH(2) : "",
          c.has("dragon") ? LR(TR + " › General Rules (Find and Replace, Dead Cards and Abilities, Attacking by Movement)") + " · " + LR(TR + " › Visiting the Manor › Dragon in the Manor") : "",
          c.has("goblins") ? LR(TR + " › General Rules (Find and Replace, Attacking by Movement)") + " · " + LR(TR + " › Visiting the Manor › Goblins in the Manor") : "",
          caveSeatSrc(c), c.mode === "cave" ? LR(TR + " › General Rules › Attacking by Movement") + " · " + LR(TR + " › Visiting the Cave › Paladin in the Cave") : ""]);
      }
    },
    {
      title: "The Skeletons",
      when: function (c) { return c.has("skeletons"); },
      html: function (c) {
        var prey = skelPrey(c);
        var goal = VM.skelHuntSpider(c) ? (prey === "Spider" ? "You win if you kill the Spider, by returning her 5 Spiderlings to the box <i>(this role mix)</i>." : "You win if you kill the " + prey + " <i>(this role mix)</i>.")
          : (c.has("knight") || c.mode === "cave") ? "You win if you kill the Knight" + (c.mode === "cave" ? " <i>(table ruling: your rules name the Paladin, who isn’t in the Cave — see the note above)</i>" : " (Find and Replace)") + ". How she takes hits and is killed follows The Crystal Caverns’ rules (Attacking by Movement) — see " + VM.CAVES_LINK + "."
          : c.has("aknight") ? "You win if you kill the Armored Knight, by reducing her Health to 0."
          : "You win if you kill the Paladin, by reducing his Health to 0.";
        return VM.caveSeatNote(c) + h("Goal") + li([goal]) +
          h("Traits") + li([
            "<b>Distracting:</b> each time a Skeleton attacks, it gains 1 Strength per space with a Skeleton or cackling skulls token adjacent to the defender.",
            "<b>Groundskeepers:</b> Skeletons can enter the grounds (rectangular spaces around the map edge) and crypts (square spaces without tiles).",
            "<b>Undead:</b> each time a Skeleton is removed, immediately roll the spawn die and place it on the matching Spawn (numbered grounds). Move its card to the 1st space of the March Order and push cards right to fill the gap.",
            "<b>Weak Bones:</b> each time a Skeleton attacks, remove it after attacking (hit or miss)."
          ]) +
          h("Strength and Defense") + li(["Each Skeleton has <b>1 Strength</b> (plus Distracting).", "Each Skeleton has <b>1 Defense, +1 per other Skeleton</b> on its tile."]) +
          h("Your turn") + ol([
            "<b>Lose Stability:</b> lose 1 Stability per Skeleton on a Lit tile that is not a Pit.",
            "<b>Activate Skeletons:</b> activate each Skeleton on the map, one at a time, left to right in the March Order. Each can move <b>up to 5 spaces</b>, then take <b>one action</b>. A Skeleton that enters a tile with a <b>lamp or web</b> ends its movement (it still removes one of each enemy token there).",
            "<b>Summon Skeleton:</b> once per turn, you may spend <b>3 Stability</b> to flip up the leftmost facedown Skeleton card in the March Order, roll the spawn die, and place the matching Skeleton on the matching Spawn.",
            "<b>Gain Stability:</b> gain 2 Stability."
          ]) +
          h("Actions (one per activation)") + li([
            "<b>STRIKE!!</b> Spend 1 Stability to attack an enemy figure on your tile (Distracting and Weak Bones apply). If you can’t spend Stability, you don’t attack and you return to your origin space." + strikeDefenders(c) + (VM.skelHuntSpider(c) ? " <b>This mix: Spiderlings force the Skeletons to attack.</b>" : ""),
            "<b>LOOT!!</b> Once per turn, remove a treasure marker from your tile to gain 2 Stability.",
            "<b>BREACH!!</b> Spend 1 Stability to place a breach marker on a wall on your tile (including a wall printed on an adjacent tile touching your tile).",
            "<b>TUNNEL!!</b> While on a Pit, place the Skeleton on any Pit with no enemy figures.",
            "<b>ARM!!</b> While on an Armory tile (Lit or Dark), draw a gear card."
          ]) +
          h("Abilities") + "<p>Each Skeleton has a unique ability, usable during its activation each turn (even between spaces of movement).</p>" + li([
            "<b>Casty:</b> spend 1 Stability to place a cackling skulls token on an adjacent space. Cackling skulls distract enemy figures in adjacent tiles. Once both are placed, Casty can’t use this ability.",
            "<b>Screamy:</b> once per turn, spend 1 Stability to target a Skeleton within 2 spaces of Screamy and move it up to 5 spaces — not into a tile with an enemy figure that forces attacks.",
            "<b>Shooty:</b> when she takes the Strike action, spend 1 Stability to have her attack a visible figure exactly 2 spaces away instead of on her tile. This attack doesn’t remove Shooty.",
            "<b>Slashy:</b> spend 1 Stability to raise Slashy’s Strength to 2 this turn (her Defense stays 1).",
            "<b>Stabby:</b> spend 1 Stability when Stabby hits the Paladin: the Paladin loses 4 Grit."
          ]) + (c.has("hhskel") ? "<p class=\"inline-note\">Haunted Hallways Skeletons in play: their abilities and gear are on their own cards (not in this page’s sources).</p>" : "") +
          h("Gear") + li(["Any time during your turn, play gear cards from your hand in front of their listed Skeleton. Played gear gives that Skeleton another ability, usable the same turn.", "Stability costs on gear add to the Stability costs of any associated actions."]) +
          h("Pit markers") + li(["Some Skeletons can place pit markers. A tile with a pit marker counts as a Pit tile, even while Dark.", "Pit markers cannot be removed."]);
      },
      src: function (c) { return cites([LR("The Skeletons (whole chapter)"), VM.SS.skeletons, VM.skelHuntSpider(c) ? LR(c.mixObj.sec) : "", VM.skelHuntSpider(c) && skelPrey(c) === "Spider" ? LR("The Paladin") : "", c.has("hhskel") ? VM.HH(1) : "",
        c.has("knight") ? LR(TR + " › General Rules") : "", c.has("aknight") ? VM.HH(3) : "", c.has("shadow") ? VM.HH(1) + " · " + VM.HH(2) : "",
        (c.has("knight") || c.has("dragon") || c.has("thief")) ? LR(TR + " › General Rules › Attacking by Movement") : "",
        caveSeatSrc(c), c.mode === "cave" ? LR(TR + " › General Rules › Attacking by Movement") : ""]); }
    },
    {
      title: "The Spider",
      when: function (c) { return c.has("spider"); },
      html: function (c) {
        var terror = VM.v(c, "spider", "hatchling") ? 8 : VM.v(c, "spider", "consumer") ? 10 : 12;
        return VM.caveSeatNote(c) + h("Goal") + li(["You win if you gain <b>" + terror + " Terror</b>" + (terror !== 12 ? " <i>(" + VM.variant(c, "spider").name + " variant)</i>" : "") + ", then escape by moving out from the <b>Entrance tile</b>.", "Lose all 5 Spiderlings and you are killed" + (c.mode === "cave" ? "." : VM.skelHuntSpider(c) ? (c.has("goblins") ? " (in this mix, the Skeletons’ goal; with the Goblins in their seat, agree a ruling — see How to play)." : " (in this mix, the Skeletons’ goal).") : " (the " + VM.seatName(c, "paladin") + "’s goal).")]) +
          h("Traits") + li([
            "<b>Agile:</b> you always hit on attacks and cannot be forced to attack.",
            "<b>Crawly:</b> your Giant Spider can cross 1 wall per turn; your Spiderlings can cross any number of walls.",
            "<b>Shapeshifter:</b> when a Spiderling is hit, return it to the box. When the Sorcerer or Giant Spider is hit, return a Spiderling to the box, place a Spiderling on a tile adjacent to your old figure, then place each remaining one on a tile adjacent to the previous Spiderling placed.",
            "<b>Tiny:</b> your Spiderlings and Eggs do not force attacks (the Giant Spider and Sorcerer still do)." + (VM.skelHuntSpider(c) ? " <b>This mix: Spiderlings do force the Skeletons to attack.</b>" : "")
          ]) +
          h("Strength and Defense") + li(["All your forms have <b>no Strength and 2 Defense</b>; your Defense increases as your Terror increases.", "An <b>Egg</b> has no Strength and <b>1 Defense +1 per blood token</b> on its tile."]) +
          h("Your turn") + ol([
            "<b>Choose form</b> (ignore on your first turn): flip the Giant Spider, Sorcerer or Spiderlings board face up and the other two facedown. Put your new figure on the tile with your old figure, then remove the old one. Going to Spiderlings: place all the Spiderling figures in your old figure’s tile. Leaving Spiderlings: place the new figure in any tile with a Spiderling." + (VM.v(c, "spider", "demonqueen") ? " <b>Demon Queen: you stay the Giant Spider all game.</b>" : ""),
            "<b>Gain Terror</b> — each once per turn: <b>Feed:</b> spend 3 Blood to gain 1 Terror. <b>Scare:</b> if the map has at least 6 webs, discard 1 power card to gain 1 Terror.",
            "<b>Move and cast spells</b> in any order. Sorcerer or Giant Spider: cast spells at any time in this phase. Spiderlings: finish moving one Spiderling before moving another, and cast only before and after moving a given Spiderling.",
            "<b>Redraw hand:</b> discard all power cards left in your hand, then draw power cards equal to your <b>Spirit</b> (it rises with your Terror)."
          ]) +
          h("Your three forms") + tbl(["Form", "Moves", "Power cards affect", "Plays any card as", "Its own spells"], [
            ["Sorcerer", "Up to 2 spaces; can’t cross walls", "One visible tile", "Eyes", "Veil, Tend"],
            ["Giant Spider", "Up to 3 spaces; may cross 1 wall per turn", "Any adjacent tiles, twice in total", "Fangs", "Lay Egg"],
            ["Spiderlings", "Each up to 4 spaces; may cross walls", "Each tile with any Spiderlings, in any order", "Webs", "Loot"]
          ]) +
          h("Power cards") + "<p>Play a power card from your hand to use its effect, then discard it:</p>" + li([
            "<b>Eyes:</b> reveal a tile. If you reveal a Blood tile, gain 1 Blood.",
            "<b>Fangs:</b> attack to gain 1 Blood.",
            "<b>Webs:</b> place a web token on a tile. A tile can hold up to 3 webs."
          ]) +
          h("Other spells") + li([
            "<b>Veil (Sorcerer):</b> discard 1 power card to flip an empty visible Lit tile to its Dark side (the center of the target tile must be visible).",
            "<b>Tend (Sorcerer):</b> spend 1 Blood to place 1 blood token on each tile with an Egg.",
            "<b>Lay Egg (Giant Spider):</b> discard 2 power cards to place an Egg on your tile or an adjacent visible tile; if you already placed an Egg this turn, discard 1 card instead. You can’t place 3 Eggs in the same turn.",
            "<b>Legs (all forms):</b> discard 1 power card to move your figure 1 space; in Spiderlings form, move each Spiderling 1 space instead." + (VM.v(c, "spider", "matriarch") ? " <b>Matriarch: you cannot use Legs.</b>" : ""),
            "<b>Loot (Spiderlings):</b> discard 1 power card to remove all treasure markers from all tiles with any Spiderlings. Gain 1 Terror if you removed 2, 2 Terror for 3 or 4, 3 Terror for 5 or more."
          ]) +
          h("Webs, Eggs and Blood") + li([
            "<b>Webs:</b> each time an enemy figure enters a tile with any webs, it ends its move.",
            "<b>Eggs:</b> when a tile with an Egg holds any combination of <b>6 web and blood tokens</b>, gain <b>2 Terror</b> and remove the Egg and all blood tokens on its tile (not the webs). Eggs cannot move.",
            "<b>Blood:</b> whenever your Sorcerer, Giant Spider or a Spiderling is on a tile with a blood token, you may remove it to gain 1 Blood."
          ]);
      },
      src: function (c) { var sv = VM.variant(c, "spider"); return cites([LR("The Spider (whole chapter)"), VM.SS.spider, sv ? LR(VM.variantSec("spider", sv)) : "", VM.skelHuntSpider(c) ? LR(c.mixObj.sec) : "", caveSeatSrc(c)]); }
    },
    {
      title: "The Manor",
      when: function (c) { return c.has("manor"); },
      html: function (c) {
        var seals = VM.v(c, "manor", "shack") ? 11 : VM.v(c, "manor", "villa") ? 13 : 14;
        return h("Goal") + li(["You win if you complete <b>" + seals + " Seals</b>" + (seals !== 14 ? " <i>(" + VM.variant(c, "manor").name + " variant)</i>" : "") + ", by playing ritual cards."]) +
          h("Traits") + li([
            "Your avatar on the physical plane is the <b>Wraith</b>.",
            "<b>Ethereal:</b> your Wraith can cross walls, cannot attack or be attacked, ignores the effects of enemy tokens, and does not remove enemy tokens when entering their space.",
            "<b>Spooky:</b> each time you reveal a Poltergeist tile, you may place the poltergeist on any empty Lit tile."
          ]) +
          h("Strength and Defense") + li(["Your Wraith has no Strength or Defense."]) +
          h("Your turn") + ol([
            "<b>Assign omens:</b> take any number of cubes from your Unassigned Omens box and place them on empty spaces of the tracks on your board, filling each track from left to right.",
            "<b>Use powers:</b> you <b>may</b> use each of your powers, in order from top to bottom (each needs at least 1 cube on its track — see below).",
            "<b>Perform a ritual:</b> you can play 1 ritual card from your hand (see below).",
            "<b>Place treasure, then draw rituals</b> (see the table). <i>The living rules number this step “3)” as well.</i>",
            "<b>Return omens:</b> return all omen cubes on your board to your Unassigned Omens box."
          ]) +
          h("Powers (each power’s limit = the combined filled spaces of its track)") + li([
            "<b>Reveal Tiles:</b> reveal Dark tiles anywhere on the map — up to the track’s number.",
            "<b>Shift 1 Tile:</b> choose any tile and shift <i>or</i> rotate it (remove any breaches or force walls on it). A shifted tile must go on a crypt touching at least one other tile; pieces on it move with it; orient it as if revealing it. Maximum distance = the track. If the shift leaves open edges, fill them with Dark tiles. If the map has no crypts, you can use shift as if it were swap.",
            "<b>Swap 2 Tiles:</b> choose 2 tiles and swap them <i>or</i> rotate each (remove breaches/force walls on them). Pieces move with their tiles; orient them as if revealing them. Maximum distance between them = the track. Fill any open edges left with Dark tiles.",
            "<b>Place Walls:</b> place a force wall marker on the shared edge of any two adjacent tiles (Lit, Dark or both) without a wall — up to the track’s number.",
            "<b>Move Wraith:</b> move it up to the track’s number of spaces."
          ]) +
          h("Rituals") + li([
            "Trace a path from your Wraith’s tile to the end tile shown on the card — only from, through and into <b>Lit tiles with no figures</b>, never crossing walls.",
            "Complete the path and you complete the ritual: gain the card’s Seals, move the Wraith to the end tile, then place a <b>poltergeist</b> on the tile shown on the card.",
            "<b>Portents:</b> 1-Seal rituals show portent icons. Completing one puts a portent cube in the leftmost box of the matching track. A portent cube counts as a placed omen cube that is <b>never removed</b>. (On the Draw Card track it shifts the cubes right and takes effect the same turn.)"
          ]) +
          h("Place treasure, then draw rituals") + "<p>Place treasure markers on <b>empty Dark tiles</b>, then draw ritual cards; if you then hold more than 5, discard ritual cards of your choice until you have 5. The numbers come from the combined filled spaces of your <b>Place Treasures, then Draw Rituals</b> track:</p>" +
          tbl(["Filled spaces on the track", "0", "1", "2", "3"], [["Treasures placed", "1", "1", "2", "2"], ["Ritual cards drawn", "0", "1", "2", "3"]]) +
          (VM.v(c, "manor", "keep") || VM.v(c, "manor", "castle") ? "<p class=\"inline-note\">" + VM.variant(c, "manor").name + ": all rituals worth " + (VM.v(c, "manor", "keep") ? "3 Seals" : "1 Seal") + " are out of the game.</p>" : "");
      },
      src: function (c) { var vv = VM.variant(c, "manor"); return cites([LR("The Manor (whole chapter)"), VM.SS.manor, vv ? LR(VM.variantSec("manor", vv)) : ""]); }
    },
    {
      title: "The Warlock",
      when: function (c) { return c.has("warlock"); },
      html: function (c) {
        var n = VM.v(c, "warlock", "charlatan") ? 4 : 5;
        return VM.caveSeatNote(c) + h("Goal") + li([n === 4 ? "You win as soon as you have dominated any combination of <b>4 poltergeists and treasures</b> <i>(Charlatan variant: you must only dominate 4 pieces to win; normally you must fill your Dominated Pieces track with 5)</i>." : "Fill your <b>Dominated Pieces track</b> with any combination of <b>5 poltergeists and treasures</b>."]) +
          h("Traits") + li([
            "<b>Crypt Walker:</b> you can enter crypts (square spaces without tiles).",
            "<b>Ethereal:</b> you can cross walls, cannot attack or be attacked, ignore the effects of enemy tokens, and do not remove enemy tokens when entering their space.",
            "<b>Hexomancer:</b> each time a piece with any curse markers is removed, advance your Spells track once.",
            "<b>Skittish:</b> each time an enemy figure enters your space, immediately move to the nearest Dark tile, crypt or Pit tile at least 2 spaces away, remove half of your Curses (<b>round down</b>), and advance your Spells track once." +
              "<div class=\"inline-note\">Sources disagree on rounding: the living rules’ Warlock chapter says round <b>down</b>; their Key Action Reference and the printed setup sheet say round <b>up</b>. This page follows the Warlock chapter.</div>"
          ]) +
          h("Strength and Defense") + li(["The Warlock has no Strength or Defense."]) +
          h("Your turn") + ol([
            "<b>Curse and dominate:</b> take curse markers from your Curses and place them under any poltergeists and treasures in your network, spreading them as evenly as possible. Then check for domination.",
            "<b>Gain spells:</b> for every 3 spells in your hand, play one and discard two. Played spells give persistent effects and new actions.",
            "<b>Collect magic cubes:</b> take all the magic cubes off your board and put them in the Unassigned Magic Cubes box.",
            "<b>Take actions</b> in any order and number — place a magic cube in an action’s box:<ul>" +
              "<li><b>Sneak:</b> move up to 2 spaces. You must end on a Dark tile, Pit tile or crypt.</li>" +
              "<li><b>Summon Poltergeist:</b> place a poltergeist on a surrounding Lit tile with no figures.</li>" +
              "<li><b>Conjure Treasure:</b> place a treasure on a surrounding Dark tile with no figures, then put curse markers from your supply under it equal to the number of poltergeists in your network.</li>" +
              "<li><b>Syphon:</b> gain 1 Curse per figure, except poltergeists, surrounding you.</li></ul>"
          ]) +
          h("Domination (checked in step 1, after you place curses)") + li([
            "In step 1, after placing curse markers: if a piece in your network has curse markers under it <b>equal to or greater than</b> the value of an empty space on your Dominated Pieces track, you may remove that piece and its curse markers and place it on any empty space with a value equal to or less than the number of curse markers that were under it.",
            "You immediately gain the effect printed on that space. A magic cube gained goes in your Unassigned Magic Cubes box (usable this turn)."
          ]) +
          h("Spells track and network") + li([
            "Each time the Spells track advances to a space with the spell symbol, <b>draw 3 spell cards</b>. Hexomancer and Skittish advance it.",
            "<b>Network:</b> a treasure or poltergeist is in your network if you can trace a path to it through any number of poltergeists or treasures surrounding you, or surrounding other poltergeists or treasures in your network."
          ]);
      },
      src: function (c) { return cites([LR("The Warlock (whole chapter)"), LR("Key Action Reference › Move"), VM.SS.warlock, VM.v(c, "warlock", "charlatan") ? LR(VM.variantSec("warlock", VM.variants.warlock[0])) : "", caveSeatSrc(c)]); }
    },
    {
      title: "The Armored Knight (Haunted Hallways)",
      when: function (c) { return c.has("aknight"); },
      html: function (c) {
        var cave = c.mode === "cave", gob = c.has("goblins") || cave;
        return VM.caveSeatNote(c) + h("Goal") + li([c.mode === "cave" ? "You win if you kill the Dragon <i>(table ruling: your rules name the Spider, who isn’t in the Cave; neither the living rules nor Haunted Hallways restate this goal there — see the note above)</i>. How your attacks hit and kill him follows The Crystal Caverns’ rules (Attacking by Movement) — see " + VM.CAVES_LINK + "." : "You win if you kill the " + VM.seatName(c, "spider") + "."]) +
          h("Trait") + li(["<b>Formidable:</b> your figure is not removed when hit. Each time you are hit by " + (gob ? "the <b>Goblins</b> (" + (cave ? "table ruling — see the note above" : "Find and Replace") + ")" : "a Skeleton") + ", you lose 1 Health."]) +
          h("Strength and Defense") + li(["You start with <b>1 Strength and 1 Defense</b>. Bolster raises Strength; hero cubes on your Strength &amp; Defense track raise both."]) +
          h("Your turn") + ol([
            "<b>Collect hero cubes:</b> take all the hero cubes off your board and put them in the Unassigned Hero Cubes box.",
            "<b>Move and act:</b> move a number of times equal to your <b>Movement</b> and have a number of encounters equal to your <b>Perception</b>, in any order — but you can’t move if you have no encounters left. Whenever you enter a Dark tile, you must encounter it. End the phase after any move or encounter; a forced encounter must be completed first."
          ]) +
          h("Encounters (in order — much like the Paladin’s crusade)") + ol([
            "<b>Reveal Dark tile:</b> if you are on a Dark tile, reveal it and gain <b>2 Grit</b>. An open edge of the revealed tile must touch the tile you moved from.",
            "<b>Attack figures</b> on your tile, figures that force attacks first: " +
              (gob ? "Goblin Tribe — it scatters (Attacking by Movement)" + (cave ? "" : ": roll the spawn die and place it on the matching Spawn") : "Skeleton — its Undead trait triggers") + "; " +
              (c.has("shadow") ? "Shadow Paladin — their Formidable trait triggers (they lose 1 Health) and, Cowardly, they immediately move to the nearest Dark tile"
                : (c.has("dragon") || cave) ? "Dragon — resolve the hit by The Crystal Caverns’ rules (Attacking by Movement)"
                : "Spider — her Shapeshifter trait triggers") + "; Egg — remove all blood tokens on its tile, gain <b>5 Grit</b>; Poltergeist — gain <b>3 Grit</b>.",
            "<b>Use Shrine:</b> on a Shrine, you may discard any number of sidequest cards to draw the same number.",
            "<b>Collect treasures:</b> remove each treasure marker on your tile, one at a time; for each, gain <b>5 Grit</b> or gain a <b>javelin token</b> on the matching space of your Throw Javelin box."
          ]) +
          h("Statistics and actions") + li([
            "<b>Statistics:</b> any time in Move and Act (even during an encounter), place unassigned hero cubes on an empty box of your Perception, Movement or Strength &amp; Defense track, left to right. Each raises the statistic by the number below its space.",
            "<b>Throw Javelin</b> (once per turn): place a hero cube here and remove the javelin token from this box to attack a visible figure. Put the javelin token on the defender’s tile; if you attacked the Spider, return it to the box. On a tile with a javelin token, you may take it back to this box.",
            "<b>Lob Bomb:</b> place a hero cube to place a breach token on a visible wall.",
            "<b>Intuit:</b> place a hero cube to pick up each adjacent Dark tile, look at it, and return each to its original crypt.",
            "<b>Repair Armor</b> (once per turn): place 2 hero cubes here to place an armor token here. When you would lose Health with an armor token here, return the token to the box and lose 1 less Health.",
            "<b>Bolster</b> (once per turn): place a hero cube to gain 2 Strength on your next attack."
          ]) +
          h("Sidequests, Grit and artifacts") + li([
            "<b>Sidequests:</b> any time in Move and Act, reveal a sidequest card whose requirements you meet: return it to the box, resolve its effect, then draw a new sidequest card." + (c.mode === "cave" ? " <b>In the Cave</b> she uses the Knight’s sidequest cards and gains an artifact, not Grit, for completing one." : ""),
            "<b>Grit</b> (on your Grit track): reaching <b>6, 13, 22, 32 or 43</b> immediately takes a hero cube from your supply into your Unassigned box (usable this turn); falling below any of those values immediately returns a hero cube from your board to your supply.",
            "<b>Artifacts:</b> play one from your hand any time in Move and Act for a persistent effect; place hero cubes on played artifacts to use their effects any time in that phase (even during an action)."
          ]);
      },
      src: function (c) { return cites([VM.HH(3), VM.HH(4), VM.HH(1), c.has("shadow") ? VM.HH(2) : "",
        c.has("dragon") ? LR(TR + " › General Rules (Find and Replace, Dead Cards and Abilities, Attacking by Movement)") + " · " + LR(TR + " › Visiting the Manor › Dragon in the Manor") : "",
        c.has("goblins") ? LR(TR + " › General Rules (Find and Replace, Attacking by Movement)") + " · " + LR(TR + " › Visiting the Manor › Goblins in the Manor") : "",
        c.mode === "cave" ? LR(TR) + " · " + LR(TR + " › General Rules (Find and Replace, Dead Cards and Abilities, Attacking by Movement)") : ""]); }
    },
    {
      title: "The Shadow Paladin (Haunted Hallways)",
      when: function (c) { return c.has("shadow"); },
      html: function (c) {
        return VM.caveSeatNote(c) + h("Goal") + li([c.mode === "cave" ? "Advance to the final space of your Shadow track, then escape: <b>in the Cave you must get to the Entrance tile</b>." :
            "You win if you advance to the <b>final space of your Shadow track</b> and then move through the Manor’s entrance (the open edge by the stairs)."]) +
          h("Traits") + li([
            "<b>Agile:</b> you always hit on attacks and cannot be forced to attack.",
            "<b>Cowardly:</b> you cannot enter tiles with any figures. Whenever you are hit, immediately move to the nearest Dark tile.",
            "<b>Formidable:</b> your figure is not removed when hit. Each time you are hit by the Paladin (or Armored Knight), you lose 1 Health.",
            "<b>Sadistic:</b> when revealing a tile, you can place it so no open edge touches an open edge of an adjacent tile."
          ]) +
          h("Strength and Defense") + li(["You have <b>no Strength and 1 Defense</b>; your Defense increases as you advance on your Shadow track."]) +
          h("Your turn") + ol([
            "<b>Collect ruin:</b> collect each ruin cube on the map into your Ruin box.",
            "<b>Move and act:</b> move up to 2 spaces, crossing up to 1 wall. Before, after or during a move, take these actions in any order and number:<ul>" +
              "<li><b>Play power card</b>, then discard it — <b>Gaze:</b> reveal your tile or an adjacent visible tile. <b>Float:</b> move 1 space; you may cross a wall and enter a tile with enemy figures. <b>Shroud:</b> flip an adjacent visible Lit tile to its Dark side (its center must be visible)" + (c.mode === "cave" ? " — not on Crystal tiles in the Cave" : "") + ". <b>Strike:</b> attack all visible figures and treasure markers in adjacent visible tiles; remove attacked treasures; gain 1 Ruin per piece attacked.</li>" +
              "<li><b>Break chain:</b> discard 2 matching power cards to break any locked chain card: move it from its Locked Chains slot to near your board — you can use it without paying debt for the rest of the game. Then you may discard any chain cards from your Locked Chains spaces and draw chain cards until all three are filled.</li>" +
              "<li><b>Use broken chain:</b> use an ability on any chain you have broken.</li>" +
              "<li><b>Pay debt:</b> discard 1 power card to treat any 1 unbroken chain as broken until the end of your turn.</li>" +
              "<li><b>Summon wall:</b> spend 1 Ice to place a force wall on any visible open edge.</li></ul>",
            "<b>Advance Shadow track:</b> spend the Ruin shown in the Cost column to advance your shadow marker one space — as many times as you can pay.",
            "<b>Mark isolated tiles:</b> place a ruin cube on each Lit tile with no open edges touching an open edge of another Lit tile. If, during another player’s turn, such a tile becomes Dark or gains a shared open edge with another Lit tile, remove its ruin cube immediately.",
            "<b>Draw power cards:</b> discard any number, then draw up to your <b>Spirit</b> (set by your Shadow track marker). Unlike the Spider, you don’t have to discard your hand.",
            "<b>Gain Ice:</b> if you did not break a chain this turn, gain 1 Ice (ice tokens on the Ice box)."
          ]) +
          h("Chains and starting Ruin") + li([
            "Chain cards give special abilities, usable any time on your turn by paying the cost on the card.",
            "<b>Locked chains</b> sit in the Locked Chains spaces of your board: to use one, first discard 1 power card to pay debt (plus the card’s cost). <b>Broken chains</b> sit near your board: no debt, just the card’s cost.",
            "<b>Starting Ruin:</b> in games with the Paladin or the Skeletons, you begin with 5 ruin cubes."
          ]) + (c.mode === "cave" ? h("In the Cave") + li(["Attacking a Goblin Tribe causes it to scatter.", "You can use <b>Shadow Crawl</b> to move to Ambush tiles.", "The Knight can roll the Dragon die against you when her Strength equals your Defense."]) : "");
      },
      src: function (c) { return cites([VM.HH(2), c.mode === "cave" ? VM.HH(4) : "", VM.HH(1), caveSeatSrc(c)]); }
    },
    {
      title: "Haunted Hallways — new Skeletons and miniatures",
      when: function (c) { return c.has("hhskel") || c.has("hhmini"); },
      html: function (c) {
        return li([
          c.has("hhskel") ? "<b>Four new Skeletons</b> (4 figures, 4 Skeleton cards, 12 gear cards) can replace Skeletons from The Mysterious Manor <b>one-for-one, in any combination</b>. Each comes with its own gear cards. Their abilities are on their cards — not in this page’s sources. (The living rules name one expansion Skeleton, <b>Smashy</b>, whose Iron Spike gear some 3-player mixes return to the box.)" + (c.mode === "solo" ? " In the Paladin’s Journey, Skeletons use no abilities or gear." : "") : "",
          c.has("hhmini") ? "<b>Miniatures</b> can replace many of the pieces of The Mysterious Manor: 1 Shadow Paladin, 1 Armored Knight, 4 Skeletons, 6 force walls, 9 poltergeists, 10 treasures, 10 webs, 3 Eggs and 1 pillar of light." : ""
        ]);
      },
      src: function (c) { return cites([VM.HH(1), c.has("hhskel") ? LR("Player Counts and Role Mixes › Three Players › Skeletons/Spider/Warlock") : "", c.has("hhskel") ? LR("Player Counts and Role Mixes › Three Players › Skeletons/Spider/Manor") : "", c.has("hhskel") && c.mode === "solo" ? LR(SEC_SOLO + " › The Skeletons") : ""]); }
    },
    {
      title: "Difficulty variants",
      when: function (c) { return c.mode === "multi"; },
      html: function (c) {
        var out = "<p>Adjust roles for differences in age, experience and skill. These adjustments assume a 4- or 5-player game; some may not suit low player counts.</p>";
        VM.variantRoles.forEach(function (r) {
          var inPlay = c.has(r);
          out += h(VM.roleName(r) + (inPlay ? "" : " <i>(not in this game)</i>")) +
            tbl(["Variant", "Level", "Effect"], VM.variants[r].map(function (v) {
              var sel = c.diff(r) === v.id;
              return [v.name + (sel ? " ✔ <i>selected</i>" : ""), v.lvl, v.t];
            }));
        });
        return out;
      },
      src: function () { return LR("Difficulty Variants"); }
    },
    {
      title: "Player counts and role mixes",
      when: function (c) { return c.mode === "multi"; },
      html: function (c) {
        var rows = VM.mixes.map(function (m) {
          var sel = m.id === c.mix;
          return [m.p + " players" + (sel ? " ✔" : ""), m.name + (m.star ? " ★" : ""), m.id === "m5" ? "The full game." : m.changes.length ? m.changes.map(function (ch) { return ch.t; }).join(" ") : "No changes to the rules."];
        });
        return "<p>Besides the full five-player game, only these mixes can be played. ★ = suggested for new players.</p>" +
          tbl(["Players", "Roles", "Changes"], rows, "ref-table-wide");
      },
      src: function () { return LR("Player Counts and Role Mixes"); }
    },
    {
      title: "Solo — setup, goal and the Paladin’s changes",
      when: function (c) { return c.mode === "solo"; },
      html: function (c) {
        var lv = c.solo.lv;
        return "<p>The Paladin enters the Manor alone to destroy the spirits lurking within.</p>" +
          h("Setup") + li(["Set up the map and the Paladin as normal, then: shuffle " + lv.skels + " Skeleton cards face up in a line as the March Order; roll the spawn die to spawn each Skeleton (all begin in play); " + (c.solo.campaign ? "put the Stability and Terror dials nearby at your campaign values (Stability " + VM.campaignRanks[c.solo.ranks.st].st + ", Terror " + VM.campaignRanks[c.solo.ranks.te].te + ") and start with " + VM.campaignRanks[c.solo.ranks.fl].fl + " Fury and " + VM.campaignRanks[c.solo.ranks.fl].fl + " Light" : "put the Stability and Terror dials nearby at 0") + "; place a blood token on the central Pit; start with the <b>Disdain</b> favor card as well as Vigor and Illuminate."]) +
          h("Goal") + li(["<b>Win:</b> hit <b>" + lv.polts + " poltergeists</b>.", "<b>Lose:</b> reach <b>0 Health</b> or <b>" + lv.terror + " Terror</b>."]) +
          h("Revealing tiles — extra effects") + tbl(["Tile", "Extra effect in solo"], [["Armory", "Lose 1 Stability."], ["Blood", "Gain 1 Terror."], ["Pit", "Gain 1 Stability."]]) +
          h("Other changes") + li([
            "<b>Removing blood:</b> when you remove a blood token by entering a tile, lose 1 Terror.",
            "<b>Hitting a Skeleton:</b> don’t trigger its Undead trait — just remove it and lay it on its side above its card.",
            "<b>Hitting a poltergeist:</b> keep it — it tracks how close you are to winning.",
            "<b>Gain Fury phase</b> now reads: “You gain 1 Fury if you did not hit a poltergeist during this turn. Also, gain 1 Terror.”"
          ]);
      },
      src: function (c) { return cites([LR(SEC_SOLO + " › Setup, Goal, The Paladin (Revealing Tiles, Removing Blood, Hitting Enemies)"), c.solo.level !== "normal" ? LR(SEC_SOLO + " › Difficulty") : "", c.solo.campaign ? LR(SEC_SOLO + " › Campaign Play") : ""]); }
    },
    {
      title: "Solo — the Skeletons’ moves and the Spawn phase",
      when: function (c) { return c.mode === "solo"; },
      html: function () {
        return li(["The Skeletons activate left to right. After every Skeleton on the map has activated, go to the Spawn phase. They don’t use abilities or gear."]) +
          h("Movement priority (each Skeleton)") + ol([
            "<b>Attack!</b> If the Paladin is within movement range and the Skeleton has enough Strength to hit him, move it to him and hit him. Then shift that Skeleton’s card to the front of the March Order, remove the Skeleton and lay it on its side above its card.",
            "<b>Distract!</b> Otherwise, if a space adjacent to the Paladin is within range, move there — choosing the space that leads to the most Skeletons distracting the Paladin this turn.",
            "<b>Creep!</b> Otherwise move as close as possible to the Paladin."
          ]) +
          h("How they move") + li([
            "Each moves up to the <b>Movement</b> on the Stability table, along the shortest path toward the Paladin. That is 3 at Stability 0–2 (not 5), so a campaign game that starts at Stability rank 3 begins at Movement 4.",
            "A Skeleton moves away from the Paladin only if blocked by his pillar of light with no other path, or if going around lamps on the shortest path gets it closer than entering (and stopping on) a lamp tile.",
            "If several destinations are equally far from the Paladin, you choose.",
            "No Stability loss for starting on a Lit tile. Each Skeleton can cross <b>one wall per turn</b>. Skeletons <b>can’t enter the grounds</b>.",
            "Entering a tile with a blood token doesn’t remove it. A Skeleton can’t end its move on a space with another Skeleton (but may pass through). Skeletons ignore poltergeists and move as if they weren’t there."
          ]) +
          h("Spawn phase") + ol([
            "Stand up Skeletons lying on their side, from left to right, equal to the <b>Rush</b> value on the Stability table.",
            "Spawn removed Skeletons that aren’t on their side: roll the spawn die once per Skeleton and place it on the matching Spawn. Reroll if its adjacent space in the Manor is blocked by a pillar of light.",
            "Stand up any Skeletons still on their side (they spawn next turn)."
          ]);
      },
      src: function () { return cites([LR(SEC_SOLO + " › The Skeletons (Skeleton Movement, Spawn Phase)"), LR(SEC_SOLO + " › Enemy Dials › Stability")]); }
    },
    {
      title: "Solo — enemy dials, difficulty and campaign",
      when: function (c) { return c.mode === "solo"; },
      html: function (c) {
        var st = [["0", "3", "0", "1"], ["1", "3", "0", "1"], ["2", "3", "0", "1"], ["3", "4", "1", "1"], ["4", "4", "1", "1"], ["5", "4", "1", "2"], ["6", "5", "1", "2"], ["7", "5", "2", "2"], ["8", "5", "2", "3"], ["9", "6", "2", "3"], ["10+", "6", "3", "3"]];
        var te = [["0", "1", "—"], ["1", "1", "—"], ["2", "1", "—"], ["3", "1", "—"], ["4", "2", "Treasure"], ["5", "2", "—"], ["6", "2", "Favor"], ["7", "2", "—"], ["8", "3", "Treasure"], ["9", "3", "—"], ["10+", "3", "Favor"]];
        return "<p>You track the enemies’ <b>Stability</b> and <b>Terror</b>; as they rise, the game gets harder.</p>" +
          h("Stability — the Skeletons’ preparedness") + li(["In solo, Stability changes only when Armory and Pit tiles are revealed."]) +
          tbl(["Stability", "Movement", "Rush", "Skeleton Strength"], st) +
          h("Terror — how close the Paladin is to succumbing to fright") + li(["Terror rises each turn and whenever you reveal a Blood tile; it falls whenever you remove a blood token.", "<b>Discard:</b> whenever Terror increases to that value, discard one card of the listed type if able (Vigor and Illuminate can’t be discarded)."]) +
          tbl(["Terror", "Poltergeist Strength", "Discard"], te) +
          h("Difficulty") + tbl(["Level", "Skeletons", "Lose at", "Win at"], [
            ["Easy" + (c.solo.level === "easy" ? " ✔" : ""), "4", "12 Terror", "5 poltergeists"],
            ["Normal" + (c.solo.level === "normal" ? " ✔" : ""), "5", "12 Terror", "6 poltergeists"],
            ["Hard" + (c.solo.level === "hard" ? " ✔" : ""), "6 (needs Haunted Hallways)", "10 Terror", "7 poltergeists"]]) +
          h("Campaign play") + li([
            "Write down “Fury &amp; Light”, “Stability” and “Terror”, each at rank 0. A category’s rank sets its starting value (table).",
            "Each time you win, raise one category by one rank (maximum 3). You can’t raise a category whose rank is higher than any other category’s.",
            "Complete the game with all three at rank 3 and you can tell the world you are a <b>Vast Master</b>."
          ]) + tbl(["Rank", "Fury &amp; Light", "Stability", "Terror"], [["0", "3 each", "0", "0"], ["1", "2 each", "1", "1"], ["2", "1 each", "2", "2"], ["3", "0 each", "3", "3"]]) +
          (c.solo.campaign ? "<p class=\"inline-note\">This campaign game: Fury &amp; Light rank " + c.solo.ranks.fl + ", Stability rank " + c.solo.ranks.st + ", Terror rank " + c.solo.ranks.te + ".</p>" : "");
      },
      src: function () { return LR(SEC_SOLO + " › Enemy Dials (Stability, Terror), Difficulty, Campaign Play"); }
    },
    {
      title: "Traveling between Vast games — general rules",
      when: function (c) { return c.has("travel"); },
      html: function () {
        return li([
          "Roles from Vast: The Mysterious Manor and Vast: The Crystal Caverns can be used together in either game. A migrated role <b>replaces the role of the same colour</b> (e.g. the Paladin replaces the Knight, or vice versa). Migrating one role at a time is recommended.",
          "The rules assume the recommended player mixes for each game with at least the core roles (Paladin/Skeletons/Spider or Knight/Goblins/Dragon). Playing without a role? Use the variant rules from that role’s original game. Other mixes are possible but will likely need rulings during play."
        ]) + h("Find and Replace") + li(["Replace any references to the original role with references to the migrated role. <i>Example: playing The Mysterious Manor with the Dragon, “Spider” on the Paladin’s cards means “Dragon”.</i>"]) +
          h("Dead cards and abilities") + li(["Read card text literally, except under Find and Replace — some cards may stop doing anything.", "Don’t convert game terms unless explicitly told to. <i>Examples: the Goblins have no Stability, so they ignore effects about Stability; the Dragon’s Wrath collapses tiles, but tiles can’t collapse in the Manor, so that part is ignored.</i>"]) +
          h("Attacking by movement") + li(["Broadly, attacking follows the rules of the <b>defender’s</b> original game (not the text of cards and special abilities). <i>A hit Skeleton is removed; a hit Goblin Tribe scatters.</i>", "Caverns roles are forced to attack by moving into a space with an enemy figure only if that colour of role would be forced to in The Mysterious Manor. <i>The Thief can enter tiles with enemy figures such as the Warlock; the Knight must attack a Skeleton whose tile she enters.</i>"]) +
          h("Forced move") + li(["When a Caverns role forces a Manor role to move, it can be moved onto any legal tile. The Warlock may be forced into crypts; the Skeletons into crypts and grounds."]);
      },
      src: function () { return LR(TR + " › General Rules (Find and Replace, Dead Cards and Abilities, Attacking by Movement, Forced Move)"); }
    },
    {
      title: "Visiting the Manor — the Knight",
      when: function (c) { return c.has("knight"); },
      html: function () {
        return li(["The Knight can use the <b>Bow</b> on a Skeleton to remove it.", "She does not use bomb tokens: her <b>Bomb</b> equipment places a breach marker on a wall of her tile.", "She cannot use her <b>Ancient Map</b> to enter a crypt.", "She gains <b>2 Grit</b> each time she removes a poltergeist.", "She must spend an <b>extra Movement</b> to enter a tile with any webs.", "Her full rules are in The Crystal Caverns — see " + VM.CAVES_LINK + "."]);
      },
      src: function () { return LR(TR + " › Visiting the Manor › Knight in the Manor"); }
    },
    {
      title: "Visiting the Manor — the Goblins",
      when: function (c) { return c.has("goblins"); },
      html: function () {
        return li(["During setup, roll for each Tribe and place it on the matching Spawn.",
          "Tribes are <b>never hidden</b>. If a Tribe ever scatters or uses the Hide action, roll the spawn die and place it on the matching Spawn.",
          "Goblins are <b>lurking</b> while on a crypt. A Tribe forfeits its action if it moves from a crypt or Spawn to a tile.",
          "Tribes at 0 Population cannot enter a tile. Tribes cannot enter the grounds.",
          "Goblins ignore webs in Lit tiles, but a Tribe stops moving when it enters a Dark tile with any webs.",
          "Goblins can spend their action to spawn, even while on the map. If they are on a Spawn and roll that Spawn’s number, they reroll.",
          "Goblins treat Pit tiles as Dark and can use them to trigger Ambushes. A Tribe on a Spawn may attack because of an Ambush.",
          "A Tribe counts as a single figure for the Paladin gaining Light from a hit.",
          "Overpopulation must affect a Tribe on a tile, if possible.",
          "Their full rules are in The Crystal Caverns — see " + VM.CAVES_LINK + "."]);
      },
      src: function () { return LR(TR + " › Visiting the Manor › Goblins in the Manor"); }
    },
    {
      title: "Visiting the Manor — the Dragon",
      when: function (c) { return c.has("dragon"); },
      html: function () {
        return li(["At <b>11 Wakefulness</b>, the Dragon may surface at any Pit tile.", "The Paladin can attack the underground Dragon by spending <b>1 Fury</b>.",
          "Any Dragon power that scatters a Tribe or makes it hide instead <b>removes Skeletons and poltergeists</b>; each figure removed this way advances his Eaten Goblins track once.",
          "Other players treat <b>Dragon Gems</b> as enemy tokens (one is removed when another role enters its tile).",
          "His full rules are in The Crystal Caverns — see " + VM.CAVES_LINK + "."]);
      },
      src: function () { return LR(TR + " › Visiting the Manor › Dragon in the Manor"); }
    },
    {
      title: "Visiting the Manor — the Thief",
      when: function (c) { return c.has("thief"); },
      html: function () {
        return li(["The Thief can <b>stash</b> treasures while on the Entrance tile or the central Pit tile.", "The Thief ignores all enemy tokens.",
          "When a Shrine is revealed, also place a <b>vault token</b> on it. Vault tokens are markers (not removed when their tile is entered); the Thief’s Pick Lock action removes them.",
          "When the Paladin attacks the Thief, he counts the hero cubes placed on crusade in place of Perception to see whether he hits; if he misses, he does not retreat to his origin tile.",
          "<b>Climb:</b> crossing a wall costs 1 cube (not 2).",
          "<b>Pickpocket</b> (only if the target has the item): Skeleton — choose a face-up gear card and put it on the bottom of their gear deck. Spider — she loses 1 Terror."]) +
          tbl(["Result", "Backstab: Skeleton"], [["Light", "Skeleton removed."], ["Moderate", "Skeleton removed and lose 1 Stability."], ["Heavy", "Skeleton removed and lose 2 Stability."]]) +
          tbl(["Loot drop", "Paladin", "Skeletons"], [["Level 3", "+3 Grit", "+3 Stability"], ["Level 2", "+1 Grit", "+2 Stability"], ["Level 1", "+1 Grit", "+1 Stability"], ["Level 0", "No bonus", "No bonus"]]) +
          "<p>The Thief’s full rules are in The Crystal Caverns — see " + VM.CAVES_LINK + ".</p>";
      },
      src: function () { return LR(TR + " › Visiting the Manor › Thief in the Manor (Climb, Pickpocket, Backstab, Loot Drop Results)"); }
    },
    {
      title: "Visiting the Cave — your role’s rules",
      when: function (c) { return c.mode === "cave"; },
      html: function (c) {
        var t = c.trav, out = h("In every Cave game") + li(["The <b>Entrance</b> and <b>Crystal</b> tiles cannot be flipped to their Dark side."]);
        if (t === "paladin") out += h("Paladin in the Cave") + li(["The Paladin can attack the <b>underground Dragon</b> by spending 1 Fury.", "He cannot sprint into a tile with an <b>event token</b>.", "Events are resolved as written.", "A Goblin Tribe counts as a single figure for the Paladin gaining Light from a hit."]);
        if (t === "spider") out += h("Spider in the Cave") + li(["Goblins ignore webs in Lit tiles, but a Tribe must stop moving when it enters a Dark tile with any webs.", "The Knight must spend <b>2 Movement</b> to enter a tile with any webs; after she enters, remove 1 web there.", "When an Event tile is revealed, place a blood token on it. When the Spider reveals an Event tile, she also gains 1 Blood.", "The Spider may play a <b>Fangs</b> card to smash a crystal.", "The Knight can roll the Dragon die against the Spider if her Strength equals the Spider’s Defense."]);
        if (t === "warlock") out += h("Warlock in the Cave") + li(["The Warlock uses the <b>poltergeist figures</b> and <b>force wall markers</b> (which he can still bring into play with Enclose).", "He treats the outside edge of the map as if composed of crypts.", "When he uses <b>Expand</b>, play the top tile from the stack.", "The Knight gains 2 Grit each time she removes a poltergeist.", "The Goblins can trigger his <b>Skittish</b> trait only once per turn.", "In games without the Cave <i>(the Cave role, not the game: this rule is written for games already in the Caverns)</i>, the Warlock starts with the <b>Past Plunder</b> variant card."]);
        if (t === "skeletons") out += h("Skeletons in the Cave") + li(["The living rules give no Skeletons-specific Cave rules: only the general traveling rules apply (read card text literally; don’t convert game terms).", "<i>Example from the rules: if the Skeletons visit the Cave with the Knight and the Dragon, the Dragon takes the Past Plunder variant card.</i>"]);
        if (t === "aknight") out += h("Armored Knight in the Cave") + li(["She uses the <b>Knight’s sidequest cards</b> while in the Cave. Completing a sidequest gains her an <b>artifact</b>, not Grit."]);
        if (t === "shadow") out += h("Shadow Paladin in the Cave") + li(["The Shadow Paladin must get to the <b>Entrance tile</b> to escape.", "Attacking a Goblin Tribe causes it to scatter.", "The Shadow Paladin cannot use <b>Shroud</b> on Crystal tiles.", "The Shadow Paladin can use <b>Shadow Crawl</b> to move to Ambush tiles.", "The Knight can roll the Dragon die against the Spider or Shadow Paladin when her Strength equals the defender’s Defense."]);
        return out + "<p>The Crystal Caverns’ own rules — see " + VM.CAVES_LINK + ".</p>";
      },
      src: function (c) {
        var t = VM.travelerById(c.trav);
        return cites([LR(TR + " › Visiting the Cave › General"), t && t.sec ? LR(t.sec) : "", c.trav === "skeletons" ? LR(TR) : "", (c.trav === "aknight" || c.trav === "shadow") ? VM.HH(4) : ""]);
      }
    },
    {
      title: "Key action reference",
      when: function () { return true; },
      html: function (c) {
        return VM.caveNote(c) + (c.mode === "solo" ? "<p class=\"inline-note\">Solo: the Paladin’s Journey changes the Skeletons. They move up to their Stability <b>Movement</b> value (" + ((c.solo.campaign && VM.campaignRanks[c.solo.ranks.st].st >= 3) ? 4 : 3) + " at the start; it rises with Stability — see the Stability table), can cross one wall per turn, and cannot enter the grounds. A removed Skeleton does not respawn at once. When you hit one, its Undead trait does not trigger. A Skeleton that hits you is removed after its card moves to the front of the March Order. Either way, lay it on its side above its card, and it spawns again in a later Spawn phase: that turn only if the Rush value stands it up first, otherwise it is stood up at the end of the Spawn phase and spawns the next turn. See the solo sections.</p>" : "") + h("Move") + "<p>Pick up your figure and place it on an adjacent space. You can’t enter crypts or cross walls. Entering a tile with enemy tokens removes one of each enemy token there.</p>" + li([
            "<b>Crawly (Spider):</b> her Giant Spider (once per turn) and Spiderlings can cross walls.",
            "<b>Crypt Walker (Warlock):</b> he can enter crypts.",
            "<b>Ethereal (Manor, Warlock):</b> they can cross walls and don’t remove enemy tokens when entering their space.",
            "<b>Groundskeepers (Skeletons):</b> they can enter the grounds and crypts.",
            "<b>Skittish (Warlock):</b> if an enemy figure enters his space, he immediately moves to the nearest Dark tile, Pit or crypt, removes half of his Curses and advances his Spells track once. <i>(This reference says “round up”; the Warlock chapter says round down and “at least 2 spaces away” — see the Warlock.)</i>",
            "<b>Lamps:</b> when a Skeleton enters a tile with a lamp, it stops moving.",
            "<b>Webs:</b> when the Paladin or a Skeleton enters a tile with a web, he or it stops moving."
          ]) +
          h("Attack") + "<p>You can attack enemy figures on your space; entering a space with an enemy figure forces you to attack it. Hit if your Strength is greater than the enemy’s Defense (remove the defender); otherwise miss — and if you were forced to attack, return to your origin tile.</p>" + li([
            "<b>Agile (Spider):</b> she cannot be forced to attack, and always hits.",
            "<b>Ethereal (Manor, Warlock):</b> they cannot attack or be attacked.",
            "<b>Tiny (Spider):</b> her Spiderlings and Eggs do not force attacks.",
            "<b>Distracting (Skeletons):</b> an attacking Skeleton gains 1 Strength per space with a Skeleton or cackling skulls token adjacent to the defender.",
            "<b>Formidable (Paladin):</b> when hit he is not removed; when hit by a Skeleton he loses 1 Health.",
            "<b>Weak Bones (Skeletons):</b> a Skeleton is removed after it attacks.",
            "<b>Undead (Skeletons):</b> a removed Skeleton is immediately respawned (roll the spawn die, matching Spawn); its card moves to the 1st March Order space, cards push right to fill the gap.",
            "<b>Hexomancer (Warlock):</b> advance his Spells track once if a piece with any curse markers is removed."
          ]) +
          h("Reveal") + ol(["Flip and orient the tile: rotate as you choose, but at least 1 open edge must touch an open edge of an adjacent tile, if possible.", "Fill crypts on open edges with Dark tiles from the stack.", "Resolve the tile. <b>Spooky (Manor):</b> when it reveals a Poltergeist tile, it may place the poltergeist on any empty Lit tile."]) +
          h("Easy-to-forget Defense values") + tbl(["Figure", "Defense"], [["Poltergeist", "1"], ["Egg", "1 + blood tokens on its tile"], ["Skeleton", "Number of Skeletons on its tile"]]);
      },
      src: function (c) { return cites([LR("Key Action Reference › Move, Attack, Reveal, Easy-to-Forget Defense Values"), c.mode === "solo" ? LR(SEC_SOLO + " › The Paladin › Hitting Enemies") + " · " + LR(SEC_SOLO + " › The Skeletons › Skeleton Movement, Spawn Phase") + " · " + LR(SEC_SOLO + " › Enemy Dials › Stability") : "", c.mode === "solo" && c.solo.campaign ? LR(SEC_SOLO + " › Campaign Play") : ""]); }
    },
    {
      title: "About these sources",
      when: function () { return true; },
      html: function (c) {
        return h("Precedence") + li([
          "<b>Living rules</b> (vast.mm.livingrules.io, snapshot 2026-10-08): the current official core rules. The site has no page numbers, so citations name its sections (“LR › The Spider › Webs”). It leaves out the printed rulebook’s examples and some diagrams.",
          "<b>Setup sheets:</b> each role’s printed setup list and overview, cited by role sheet and PDF page (they carry no page numbers). Where a sheet disagrees with the living rules, this page follows the living rules (the current official core rules).",
          "<b>Haunted Hallways</b> booklet: governs the Armored Knight and the Shadow Paladin, which replace the Paladin and the Spider respectively (any game text naming the replaced role refers to the new one); the four new Skeletons and their gear (swapped in one-for-one); the miniatures; and the use of its two roles in The Crystal Caverns (HH pp.1–4)."
        ]) + h("Where the sources disagree or are silent") + li([
          "<b>Skittish rounding:</b> LR’s Warlock chapter says “round down”; LR’s Key Action Reference and the Warlock setup sheet say “round up”. This page follows the Warlock chapter.",
          "<b>Manor turn numbering:</b> LR numbers both “Perform a Ritual” and “Place Treasure, then Draw Rituals” as step 3; this page lists them as steps 3 and 4 and “Return Omens” as 5.",
          "<b>Starting Dark tiles:</b> LR’s setup says to place six facedown “as shown right”, but the site omits that picture.",
          "<b>Printed boards and cards:</b> the Spider’s Terror track (Defense and Spirit), the Warlock’s Dominated Pieces track, the Shadow Paladin’s Shadow track and every card’s text are printed on the components, not in these sources.",
          "<b>Haunted Hallways:</b> the Armored Knight’s and Shadow Paladin’s own setup sheets, and the four new Skeletons’ abilities, aren’t among these sources. Nor is how the role mixes and difficulty variants apply to them.",
          c.has("travel") ? "<b>The Crystal Caverns:</b> its own rules are on " + VM.CAVES_LINK + "; this page states only what the living rules and Haunted Hallways say about traveling." : ""
        ]);
      },
      src: function (c) { return cites([LR("How to use this site"), "Setup Sheets (PDF pp.1–10)", LR("Setup › 1. Place Map and Starting Tiles"), LR("The Manor › 3) Perform a Ritual"), LR("The Manor › 3) Place Treasure, then Draw Rituals"), LR("The Warlock › Traits"), LR("Key Action Reference › Move"), VM.HH(1), VM.HH(2), VM.HH(4), c.has("travel") ? LR(TR) : ""]); }
    }
  ];
})();
