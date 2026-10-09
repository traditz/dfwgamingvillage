/* =============================================================================
   Vast: The Crystal Caverns — Teaching script (~5 minutes, read aloud)
   Teaching order: hook & goals → shape of a turn → each role's actions and why → the central mechanic
   → inserts for the selected roles/variants → "don't worry about these yet". Written from the same
   sources as the setup steps (Rules, FAQ, Ghost, Ghoul and Unicorn books).
   ============================================================================= */
(function () {
  const has = (c, ...ids) => ids.some((r) => c.has(r));
  const P = (s) => "<p>" + s + "</p>";
  const goalText = (r, c) => VC.goal(r, c).replace(/<i>\s*\([^<]*\)\s*<\/i>/g, "").replace(/\s+/g, " ").trim();
  const over = (r, c) => (c.v.shadow === "solo" && r !== "ghost") || (c.v.shadow === "multi" && c.opt.shadowHunter === r) || (c.v.alongside && c.opt.uHunter === r) ||
    (r === "ghoul" && (c.v.ghoulSolo || !!c.v.ghoulGoal)) || (r === "dragon" && c.v.dAmbush) || (r === "thief" && (c.v.kt || c.v.uThief));
  const goalLine = (r, c) => " This game, your goal is: " + goalText(r, c);

  const roleTeach = {
    knight: (c) => P("<b>The Knight</b> " + (c.v.solo ? "— that's you — " : "") + "starts on the Entrance with two Hero cubes. Each turn you pick your cubes back up and spend them: on <b>Movement</b> to travel, <b>Perception</b> for more Encounters, <b>Strength</b> to fight — or on your Bomb, Bow, Ancient Map and Shield. Every Dark tile you step on must be revealed: it might be treasure, a Crystal, an Event, or an Ambush. Revealing earns <b>Grit</b>, and Grit unlocks more Hero cubes — so exploring makes you stronger." +
      (c.v.valid && over("knight", c) ? goalLine("knight", c) : has(c, "dragon", "unicorn") ? (VC.target(c) === "the Dragon" ? " You win by killing the Dragon; while he's underground before the Collapse, you can attack him only with your Bomb (or the Javelin), once a turn." : " You win by killing the Nightmare Unicorn: you can enter his space when your Strength is at least his Armor, and every attack on him makes him Teleport away.") : " You win by smashing Crystals — Strength " + (c.v.valid ? VC.num.knightSmashStr(c) : 3) + " does it — and walking back out the Entrance.")),
    goblins: (c) => P("<b>The Goblins</b> are three Tribes — Fangs, Bones and Eye — that start hidden. Each turn you draw War cards to grow them, give them Monsters, draw Secrets, then move and act with each Tribe. " + (has(c, "knight") ? "A Tribe can only step onto the Knight if its Strength beats hers, and every attack costs you Rage" : "Every attack costs you Rage") + (has(c, "ghoul") ? " (except attacking the Ghoul, which gains you 1 Rage and doesn't scatter the Tribe)" : "") + " — run out of Rage and you're in Malaise. Tribes on your board are hidden — nobody can target them" +
      (has(c, "knight") ? " — and a hidden Tribe can spring an Ambush when the Knight reveals an Ambush tile." :
        ". With no Knight this game, Ambush tiles do nothing." + (function () {
          const uHunt = c.v.valid && c.v.alongside && c.opt.uHunter === "goblins";
          if (c.v.valid && over("goblins", c) && !uHunt) return "";
          if (!uHunt && has(c, "dragon")) return c.v.ash ? " With the Ash Dragon card, a Tribe whose Strength beats the Dragon's Armor can enter his tile and attack — at any time: he loses 1 Health, the Tribe scatters and you lose 1 Rage." : "";
          if (uHunt || has(c, "unicorn")) return " A Tribe whose Strength beats the Unicorn's Armor can enter his space and attack: he loses 1 Health and is forced to Teleport.";
          return " To smash a Crystal token, two Tribes with Strength 3 or more must each use Attack on it before your turn ends; both scatter and you lose 1 Rage" + (c.v.gEscape ? ", and then you must escape the Cave" : "") + ".";
        })()) + (c.v.valid && over("goblins", c) ? goalLine("goblins", c) : "")),
    vileghoul: (c) => P("<b>The Vile Ghoul</b> takes the Goblins' seat and hunts the same target" + (!has(c, "knight", "dragon", "unicorn") && !(c.v.valid && over("vileghoul", c)) ? " — here that means smashing Crystals and then escaping out the Entrance" : "") + "." +
      (c.v.valid && over("vileghoul", c) ? goalLine("vileghoul", c) : "") + " It rolls " + (c.lvl("vileghoul") >= 3 ? "its two dice (Hard/Expert)" : "all three dice") + ", then places one per turn — without rerolling — on its dice chart: that row sets its Movement and Attack, and dice already slid to the right of the row are Boost dice. When the dice run out, it rolls again. It attacks anything whose defense its Attack beats, then <b>skitters</b>" + (c.mod("skitter") ? " (it skitters when attacked, too): the Vile Ghoul names a Dark-tile symbol and its opponent places it on an unoccupied Dark tile showing it." : ": whoever it fought (it skitters when attacked, too) names a Dark-tile symbol, and the Vile Ghoul jumps to any unoccupied Dark tile showing it.")),
    dragon: (c) => P("<b>The Dragon</b> starts asleep, underground, moving through walls with Power cards: Claw, Flame and Wing, combined into bigger powers. You wake by moving Sloth cubes to Wakefulness — Greed by handing Treasure to the Cave, Hunger by eating Goblins, Pride by revealing Event tiles. Once awake you <b>surface</b> on a Crystal tile, and then " + (has(c, "knight") ? "you're vulnerable: walls stop you, and the Knight can hit you freely. " : "walls stop you. " + (c.v.ash ? "The Ash Dragon card gives you +1 Armor" + (has(c, "goblins") ? ", but any Goblin Tribe whose Strength beats your Armor can attack you, at any time" : "") + ". " : "")) + (c.v.valid && over("dragon", c) ? goalLine("dragon", c).trim() : "Make it to the Entrance and you win.") +
      (c.v.hunger === 2 ? " This game you start with two Hunger cubes already on Wakefulness." : "") +
      (!has(c, "goblins", "ghoul", "vileghoul", "unicorn") && !c.v.shadow ? " With no Goblins to eat this game, you'll need Slither to move Hunger cubes onto Greed or Pride." : "")),
    unicorn: (c) => P("<b>The Nightmare Unicorn</b> " + (c.v.alongside ? "joins the Dragon this game, playing right after him." : "takes the Dragon's seat — anything that targets the Dragon targets the Unicorn.") + " He moves only forward, playing Move and Turn cards up to his Pace, or two cards to <b>Teleport</b>. Ending a calm move on a Crystal tile or a Treasure gains <b>Radiance</b>, and Radiance buys upgrades. Angry cards raise his Anger, which makes his attacks hurt more — and every attack throws him into a forced Teleport." + (c.v.valid && over("unicorn", c) ? goalLine("unicorn", c) : " Gain your Radiance, then reach the Entrance.")),
    cave: (c) => P("<b>The Cave</b> has no piece. You hold three tiles, fill every open edge as others explore, and place one more tile and one Treasure each turn — Crystal tiles first." + (c.v.ptOpt ? " (This game, placing that Treasure is optional — Treasure Rooms still get theirs when revealed.)" : "") + " You draw Omen tokens based on how many Treasures and Crystals are out there, and spend them on omens: bats that drag pieces around, rockslides, spores, hatred. When the last tile is down, the <b>Collapse</b> starts: you rip out three tiles a turn, and " + (c.v.valid ? VC.num.caveCrystals(c) : 5) + " Crystal tiles gone" + (c.v.valid && VC.num.caveHatred(c) ? " (plus all " + VC.num.caveHatred(c) + " Hatred tokens)" : "") + " means you bury everyone." + (c.v.valid && over("cave", c) ? goalLine("cave", c) : "")),
    caveghost: (c) => P("<b>The Cave Ghost</b> is the Cave with a body: she shapes the Cave and places Treasure like the Cave" + (c.v.ptOpt ? " (placing that Treasure is optional this game — Treasure Rooms still get theirs when revealed)" : "") + ", but also floats around the map. Her Omens grow with her <b>Isolation</b> — how far she is from everyone — while her Telekinesis and Possession get cheaper the closer she is to her target. She can even possess another player and take a turn as them, right now. " + (c.v.valid && over("caveghost", c) ? goalLine("caveghost", c).trim() : "She wins the same way: collapse the Cave.")),
    thief: (c) => P("<b>The Thief</b> sets three Stat tokens each turn across Movement, Stealth and Thievery, then spends Action cubes: loot, pick Vault locks, pickpocket or backstab — but only someone whose Perception" + (function () { const x = []; if (has(c, "dragon")) x.push("the Dragon's Armor"); if (has(c, "unicorn") || c.v.shadow) x.push("a Unicorn's Armor — and Unicorns can only be Backstabbed"); if (has(c, "ghoul", "vileghoul")) x.push("the Ghoul's Defense"); return x.length ? " (" + x.join("; ") + ")" : ""; })() + " his Stealth beats. Anyone who catches him kills him, but he's cursed to come back at the Entrance. Every Treasure he stashes there buys a permanent upgrade." +
      (c.v.valid && over("thief", c) ? goalLine("thief", c) : " Stash " + (c.v.valid ? VC.num.thiefStash(c) : 6) + " and he's free.")),
    ghoul: (c) => P("<b>The Ghoul</b> rolls " + (c.lvl("ghoul") >= 3 ? "two dice each turn (a Terror card on a total of 4 or less)" : "three dice each turn (a Terror card on a total of 7 or less)") + ": the higher kept die is movement, the lower is attack points. It walks through the Cave without revealing anything, attacks anyone it can afford — one more than their defense — gains <b>Fury</b> each time, and then <b>skitters</b>" +
      (c.mod("skitter") ? " (it skitters when attacked, too): the Ghoul names a Dark-tile symbol and its opponent places it on an unoccupied Dark tile showing it." : ": whoever it fought (it skitters when attacked, too) names a Dark-tile symbol, and the Ghoul jumps to any unoccupied Dark tile showing it.") +
      " Collect Treasures for Fury too." + (c.v.valid && over("ghoul", c) ? goalLine("ghoul", c) : " Reach " + (c.v.valid ? VC.num.fury(c) : "your") + " Fury and walk out the Entrance.")),
    ghost: (c) => {
      const m = c.v.ghostMode;
      const poss = m === "solo" ? " Each turn she secretly picks a Possession card for a role nobody is playing; after her own turn she can flip it and play one turn as that role, then the card is out of the game." + (c.v.flare.has("ghost") ? " After placing tiles, roll Flare for each Artifact on a Dark tile." : "")
        : m === "2" ? " She can't possess her opponent. Instead, each turn she secretly picks a Possession card for a role nobody is playing (or her own Ghost card): a role that comes before her opponent in turn order is flipped at the end of her turn, one that comes after at the end of her opponent's turn; she plays one turn as that role, then the card is out of the game."
        : " Each turn she secretly picks a Possession card; at the end of the matching player's turn she can flip it and play that role's turn from its beginning as them — but it isn't a separate turn, so any per-turn limits they already used this turn still count.";
      const goal = c.v.valid && over("ghost", c) ? goalLine("ghost", c) : " She wins by getting her <b>Artifacts</b> locked onto Ghost tiles, then escaping" + (m === "4" || m === "3" ? " — and some of you are carrying them right now." : " — they all start on the Entrance.");
      const block = m === "solo" ? "" : m === "2" ? " Stand on a Ghost tile with a locked Artifact and she can't flip any Possession card." : " Stand on a Ghost tile with a locked Artifact, or pay to Mental Block her, and you stop her possessing you.";
      return P("<b>The Ghost</b> floats through walls and moves things — tokens, even other players — with <b>Telekinesis</b>." + poss + goal + block);
    }
  };

  VC.teach = {
    intro: "A ~5-minute teach for exactly the roles and options selected above. Read it aloud, or copy it and adjust. It follows the rulebooks and FAQ cited in the setup steps.",
    sections: [
      { h: "The hook",
        body: (c) => {
          if (!c.v.valid) return P("Pick the roles at the table first — the script follows them.");
          const roles = c.v.players.map((r) => VC.role[r].short);
          return P("Vast is a game where " + (c.v.solo ? "you play one role against the Cave itself." : "every one of you plays a completely different game on the same map.") +
            " A knight goes into a cave where a dragon sleeps; goblins hunt her, the cave itself shifts and grows, and everyone wants something different.") +
            P("Tonight " + (c.v.solo ? "you are the " + roles[0] : "we have the " + roles.join(", the ").replace(/, the ([^,]*)$/, " and the $1")) + ". Here's how each of you wins:") +
            "<ul>" + c.v.players.map((r) => "<li><b>" + VC.role[r].short + ":</b> " + goalText(r, c) + "</li>").join("") + "</ul>" +
            P(VC.loseLine(c) + " That's the clock on the whole game.");
        } },
      { h: "The shape of a turn",
        when: (c) => c.v.valid,
        body: (c) => P("We take turns in seat order: " + c.v.players.map((r) => VC.role[r].short).join(", ") + (c.v.shadow ? ", then the Shadow Unicorn" : "") + ". Each role has its own short turn, printed on its board.") +
          P("The map starts as the Entrance and four Dark tiles. Whenever a Dark tile is revealed, it's turned over and every open edge gets a new Dark tile — so the Cave keeps growing" +
            (c.v.noCave ? ", and since nobody is playing the Cave, each of us adds tiles at the end of our own turn." : ", and the " + (c.has("caveghost") ? "Cave Ghost" : "Cave") + " decides where.") +
            " When the last Cave tile is placed, <b>the Collapse</b> begins: from then on tiles are removed, not added, and when " + (c.v.noCave ? "five" : VC.num.caveCrystals(c)) + " Crystal tiles have fallen" + (!c.v.noCave && VC.num.caveHatred(c) ? " and all " + VC.num.caveHatred(c) + " Hatred tokens are gone" : "") + ", the Cave collapses.") },
      { h: "Your roles — what you do and why",
        when: (c) => c.v.valid,
        body: (c) => c.v.players.map((r) => roleTeach[r](c)).join("") },
      { h: "The heart of the game",
        when: (c) => c.v.valid,
        body: (c) => P("Every role is lopsided on purpose. You'll spend half the game helping someone else by accident" + (has(c, "knight") ? " — the Knight's exploring makes the Cave lay down tiles, pushing it toward the Collapse" + (has(c, "dragon") ? ", and turns up the Crystal tiles the Dragon surfaces on" : "") : "") + ". Watch the other boards: everything is public except cards and tiles in hand, face-down cards and the undersides of Dark tiles.") +
          P("Fights are mostly a comparison, not dice: to step onto someone, your number has to beat theirs" + (has(c, "knight", "goblins") ? " — Strength against Strength or Armor" : "") + (has(c, "thief") ? ", and Stealth against Perception for the Thief" : "") + ". The Dragon die only comes out for traps, Dragon powers and ties. And keep one eye on the tile stack: " + (c.v.noCave ? "if the Cave collapses, we all lose." : "the Collapse is the Cave's win.")) },

      /* ---- inserts: only for what's selected ---- */
      { h: "Variant cards this game",
        when: (c) => c.v.valid && (c.v.flare.size || c.v.pp || c.v.inf || c.v.ash || c.v.aid || c.v.unicornArmor),
        body: (c) => {
          const v = c.v, out = [];
          if (v.flare.size) out.push("<li><b>Flare</b> — " + VC.names(Array.from(v.flare)) + (v.flareMap ? " share it" : " gets it") + ": it reveals Dark tiles without anyone stepping on them — the card has the details. The Knight can use it once a turn, each Goblin Tribe once, the Thief and Ghoul as often as they pay for it.</li>");
          if (v.pp) out.push("<li><b>Past Plunder</b> — the " + VC.role[v.pp].short + " gets it: it places Treasure tokens on the map, keeping the treasure flowing without a Cave player's help.</li>");
          if (v.inf) out.push("<li><b>Goblin Infestation</b> — there's no Goblin player, so this card decides what happens when the Knight reveals an Ambush tile; we're using " + VC.infLine(c) + ". The Ogre and Troll Monster tokens can stay on the map until she beats them.</li>");
          if (v.ash) out.push("<li><b>Ash Dragon</b> — the Dragon gets +1 Armor and the Goblins can attack him directly.</li>");
          if (v.unicornArmor) out.push("<li>The Ash Dragon rule becomes a free Armor upgrade for the Unicorn: he starts at Armor 2.</li>");
          if (v.aid) out.push("<li><b>" + (v.aid === "II" ? "Alone in the Dark II" : "Alone in the Dark") + "</b> — it replaces the Cave player: at the end of your turn it tells you how many tiles to place, and later how many to remove.</li>");
          if (v.hunger === 2) out.push("<li>The Dragon starts with two Hunger cubes already moved to Wakefulness.</li>");
          if (v.hunger === "solo") out.push("<li>Solo difficulty (" + ({ easy: "Easy", medium: "Medium", hard: "Hard" })[c.opt.dSolo] + "): the Dragon starts with " + ({ easy: "all 4", medium: "2", hard: "no" })[c.opt.dSolo] + " Hunger cubes moved to Wakefulness.</li>");
          if (v.sq) out.push("<li>The Daring and Eagle-Eyed Sidequests are out of the deck.</li>");
          return "<ul>" + out.join("") + "</ul>";
        } },
      { h: "No Cave player",
        when: (c) => c.v.valid && c.v.noCave && !c.v.aid,
        body: (c) => {
          const one = (c.mod("crowded") && c.v.n >= 4) || c.v.ghoulMode === "4" || c.v.ghostMode === "4";
          return P("Nobody is the Cave, so we all do its job: at the end of your own turn, " + (has(c, "unicorn") || c.v.shadow ? "if you revealed no Dark tiles, place one" : one ? "place one Dark tile" : "place one Dark tile from the stack") +
            "; once the Collapse begins, remove " + (one ? "one tile" : c.mod("faq1") && c.v.n >= 4 ? "one tile (we're using the FAQ's suggestion)" : "three tiles") + " instead. " + (one ? "That one-tile rule keeps a big game from collapsing too fast. " : "") + "Remember: if it collapses, all of us lose.");
        } },
      { h: "The Shadow Unicorn",
        when: (c) => c.v.valid && !!c.v.shadow,
        body: (c) => P("A <b>Shadow Unicorn</b> is loose too. Nobody plays him: after all our turns he flips cards from his Spirit pile and charges forward — and if he can see any of us when a card provokes him, he <b>Rampages</b> straight at them" +
          ({ easy: " (only angry cards set him off tonight)", medium: " (Moves and angry cards set him off)", hard: " (any card sets him off)" })[c.opt.shadowLvl] + ". His attacks always land, and then he teleports away." +
          (c.v.shadow === "solo" ? (c.has("ghost") ? " You keep your normal goal; he's just in the way." : " Your goal tonight is to kill him — he has 7 Health" + (["knight", "dragon", "thief", "ghoul", "vileghoul"].indexOf(c.v.players[0]) >= 0 ? " — and then escape" + (c.has("dragon") ? " (awake and surfaced first)" : "") : "") + ".") : c.opt.shadowHunter ? " The " + VC.role[c.opt.shadowHunter].short + " has switched goals to hunting him; only that player's hits wound him." : " If one of you wants to switch goals to hunting him, say so now.")) },
      { h: "Fearsome Foes in this game",
        when: (c) => c.v.valid && (c.ff),
        body: (c) => {
          const out = [];
          if (c.v.alongside) out.push("The Dragon and the Nightmare Unicorn are both here: the Unicorn plays right after the Dragon, no Hunger cubes start moved, and if we all agree, one of us can switch their goal to killing the Unicorn.");
          if (has(c, "vileghoul") && has(c, "knight")) out.push("With the Vile Ghoul instead of Goblins, the Knight's Ambush tiles use Goblin Infestation, and an Ambush kill still counts for the Vile Ghoul.");
          if (has(c, "ghost")) out.push("The Ghost is an advanced role" + (c.v.ghostMode === "3" || c.v.ghostMode === "4" ? " — her rules touch everyone, so watch for a possession turn at the end of yours" : c.v.ghostMode === "2" ? " — a role she summons may take a turn at the end of yours" : "") + ". Ghost tiles are mixed into the Cave" + (c.v.ghostMode === "solo" ? "." : "; standing on one with a locked Artifact blocks her."));
          if (has(c, "caveghost")) out.push("The Cave Ghost is an advanced role: she can possess any of us immediately, and nobody can block it.");
          if (c.v.ghoulMode === "3" || c.v.ghoulMode === "4") out.push("The Ghoul plays sixth, after the Thief" + (c.v.pp === "ghoul" ? ", and takes the Past Plunder card this game." : "."));
          if (c.v.uThief) out.push("The Thief can also win by killing the Nightmare Unicorn.");
          return out.length ? "<ul>" + out.map((x) => "<li>" + x + "</li>").join("") + "</ul>" : "";
        } },
      { h: "Optional rules we're using",
        when: (c) => c.v.valid && (c.mod("terrain") || c.mod("collapse") || c.mod("crowded") || c.mod("skitter") || c.mod("simple") || c.mod("focused") || c.mod("faq1") || c.anyDiff),
        body: (c) => {
          const out = [];
          if (c.mod("terrain")) out.push("<b>Terrain</b>: until the Collapse begins, the first Event tile revealed each round brings a big Terrain tile — a Canyon, Lake, Magma, Mushroom Forest, Pits or a River — that " + (c.v.noCave ? "whoever revealed it" : c.has("caveghost") ? "the Cave Ghost" : "the Cave") + " picks and places as close as possible to the revealer. Each has its own effect; I'll read it out when it lands.");
          if (c.mod("collapse")) out.push("<b>Collapse Variant</b>: we pulled a few Cave tiles out at setup, so the Collapse comes sooner.");
          if (c.mod("crowded") && c.v.n >= 4) out.push("<b>Crowded House</b>: " + (c.v.noCave ? "with this many of us, each player places or removes only one tile at the end of their turn." : c.v.n >= 6 ? "the Cave draws Omens as if one more Crystal were on the map." : "its rules only kick in without a Cave player or with six or more of us."));
          if (c.mod("faq1") && c.v.n >= 4 && c.v.noCave) out.push("<b>One tile in the Collapse</b>: as the FAQ suggests, each of us removes just one tile per turn once the Collapse starts.");
          if (c.mod("skitter")) out.push("<b>Skitter Variant</b>: when the " + (c.has("vileghoul") ? "Vile Ghoul" : "Ghoul") + " skitters, it names the symbol and its opponent places it.");
          if (c.mod("simple")) out.push("<b>Simple Teleport</b>: the Unicorn's cards always point away from his player, not along his facing — easier to plan.");
          if (c.mod("focused")) out.push("<b>Fully Focused</b>: after locking her Artifacts, the Ghost must also end a turn on a Ghost tile without a locked Artifact (or lock one more) before escaping.");
          if (c.anyDiff) out.push("<b>Difficulty levels</b>: " + c.v.players.filter((r) => c.lvl(r) !== 2).map((r) => "the " + VC.role[r].short + " plays at " + VC.levels[r][c.lvl(r)] + " (" + VC.levelWord[c.lvl(r)] + ")").join("; ") + " — the numbers in your goals already include it." +
            (has(c, "ghost") && c.lvl("ghost") >= 3 ? " The Ghost plays without her own Ghost Possession card." : "") +
            (!c.v.noCave && c.lvl(c.has("caveghost") ? "caveghost" : "cave") <= 1 ? " Some Cave tiles of each type came out at setup." : "") +
            (!c.v.noCave && VC.num.caveHatred(c) ? " The " + (c.has("caveghost") ? "Cave Ghost" : "Cave") + " clears Hatred tokens by using the Hatred omen and skipping its effect." : ""));
          return "<ul>" + out.map((x) => "<li>" + x + "</li>").join("") + "</ul>";
        } },
      { h: "Don't worry about these until they come up",
        when: (c) => c.v.valid,
        body: (c) => {
          const out = [];
          out.push("<b>Exact tile-placement rules</b> — orientation, which tiles collapse first — whoever's placing, I'll talk you through it.");
          out.push("<b>Forced movement</b> — a pushed piece can't go onto an open space or another player's space, or through walls (the underground Dragon excepted), and the Knight can't be pushed onto Dark tiles; if your tile is removed, whoever removes it moves you the shortest distance to a legal space.");
          if (has(c, "knight")) out.push("<b>Individual Treasures, Events and Sidequests</b> — each card says what it does.");
          if (has(c, "goblins")) out.push("<b>Monster and Secrets card details</b>, and overpopulation — it only bites when a Tribe would pass 4.");
          if (has(c, "dragon")) out.push("<b>The rarer Dragon powers</b> — Slither, Swat, Shriek, Wrath — they're all on your board.");
          if (has(c, "cave")) out.push("<b>Every omen's fine print</b> — costs and targets are on the Cave board.");
          if (has(c, "thief")) out.push("<b>Thief upgrades</b> — you'll pick one each time you stash.");
          if (has(c, "ghoul", "vileghoul")) out.push("<b>Terror cards</b> — face up when drawn, and each says when it works.");
          if (has(c, "ghost")) out.push("<b>Possession card details</b> — each card lists the stats to use.");
          if (has(c, "unicorn") || c.v.shadow) out.push("<b>Teleport grids</b> — " + (c.mod("simple") ? "point the card's arrow away from your seat (Simple Teleport)" : "turn the card to match the Unicorn's facing") + " and look where it lands.");
          out.push("<b>Terrain, edge cases and errata</b> — the Rules Reference and the search below have them.");
          return "<ul>" + out.map((x) => "<li>" + x + "</li>").join("") + "</ul>";
        } }
    ]
  };
})();
