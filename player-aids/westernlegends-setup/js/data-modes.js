/* =============================================================================
   Western Legends — Setup & Reference Utility · variants, game modes, appendices
   Variants (Rules p.13–18, Unique Events p.6), game modes (p.18–25) and
   Appendices I and IV (p.52–54, 59). Appendices II–III (fight and gambling
   charts, p.55–58) are used in data-ref.js. Loaded after data-ref.js.
   ============================================================================= */
(function () {
  const ul = WL.ul, join = WL.join;
  const tbl = (head, rows) => "<div class=\"tbl-wrap\"><table><thead><tr>" + head.map(h => "<th>" + h + "</th>").join("") +
    "</tr></thead><tbody>" + rows.map(r => "<tr>" + r.map(x => "<td>" + x + "</td>").join("") + "</tr>").join("") + "</tbody></table></div>";
  const ol = (items) => "<ol>" + items.filter(Boolean).map(i => "<li>" + i + "</li>").join("") + "</ol>";

  /* red suits for poker card names */
  WL.suit = (s) => s.replace(/([♥♦])/g, "<span class=\"suit-r\">$1</span>");

  /* ---- game-mode data, exactly as printed (Rules p.19–25) -------------------------- */
  WL.modeInfo = {
    serenade: {
      rec: { p: "3–5", lp: "15 or 20", pmin: 3, pmax: 5, lps: [15, 20] },
      required: "The Good, The Bad, and The Handsome (story cards)",
      story: ["Initiate a fight with another player"],
      chars: ["Elfego Baca", "Bass Reeves", "Annie Oakley", "Kit Carson", "Johnny Ringo", "Doc Holliday", "Allan Pinkerton", "Dave Rudabaugh", "Butch Cassidy", "Joaquin Murrieta", "William “Curly Bill” Brocius", "Jesse James"],
      stores: {
        gs: ["Revolver", "Rifle", "Shotgun", "Bedroll", "Provisions", "Holster", "Derringer", "Mustang", "Peacekeeper", "Burro", "Snake Oil", "Gazette"],
        tp: ["Boot Knife", "Repeating Shotgun", "Whiskey", "Quarter Horse", "Miner’s Map", "Medicine Pouch"]
      },
      legendary: { only: ["Bandolier", "Bowie Knife", "Canteen", "Dragoons", "Dynamite", "Marshal’s Badge", "Saber", "Serape", "Shortcut", "Shot Glass", "Spyglass", "Tomahawk"] },
      events: "remove <b>all high roller</b> and <b>all Unique event</b> cards.",
      poker: { remove: ["7♣ Rumors", "7♠ Rumors", "8♣ Scout", "8♠ Scout", "9♥ Jackpot", "9♦ Jackpot"], add: ["7♣ Reputation", "7♠ Reputation", "8♣ Wallop", "8♠ Wallop", "9♥ Instinct", "9♦ Instinct"] },
      p2: true,
      srcShort: "p.19", srcStores: "p.19", srcEvents: "p.19", srcPoker: "p.18–19"
    },
    golden: {
      rec: { p: "3–6", lp: "20", pmin: 3, pmax: 6, lps: [20] },
      required: "",
      story: ["Spend $80 or more in a town with a single action"],
      chars: ["Al Swearengen", "Ben Hodges", "Buffalo Bill Cody", "Doc Holliday", "Fee Lee Wong", "Isom Dart", "Maria Gertrudis Barcelo", "Poker Alice", "“Soapy” Smith", "Stagecoach Mary Fields", "Texas John Slaughter", "Wild Bill Hickok"],
      stores: {
        gs: ["Bullwhip", "Derringer", "Gazette", "Mule", "Mustang", "Pocket Watch", "Revolver", "Saddle Bags", "Snake Oil", "Ten-Gallon", "Whiskey", "Workhorse"],
        tp: ["Burro", "Miner’s Map", "Peacekeeper", "Provisions", "Quarter Horse", "Shotgun"],
        tt: ["Bedroll", "Boot Knife", "Carbine", "Holster", "Medicine Pouch", "Rifle", "Repeating Shotgun"]
      },
      legendary: { only: ["Bandolier", "Black Coat", "Canteen", "Cattle Brand", "Lasso", "Lucky Coin", "Marked Cards", "Marshal’s Badge", "Mesa Deed", "Molasses", "Portrait", "Shot Glass", "Shortcut", "Silver Flask", "Snakeskin Boots", "Spurs", "Telegram", "Treasure Map"] },
      events: "remove these <b>Unique event</b> cards: Orphan, Grizzly Bear, Wounded Deputy and Bathcat (spelled so in the book).",
      poker: { remove: ["4♥ Dead or Alive", "4♦ Dead or Alive", "5♥ Vendetta", "5♦ Vendetta", "8♣ Scout", "8♠ Scout", "10♣ Outfit", "10♠ Outfit"], add: ["4♥ Manhunt", "4♦ Manhunt", "5♥ Payday", "5♦ Payday", "8♣ Wallop", "8♠ Wallop", "10♣ Fool’s Gold", "10♠ Fool’s Gold"] },
      srcShort: "p.20", srcStores: "p.20", srcEvents: "p.20", srcPoker: "p.18, 20"
    },
    law: {
      rec: { p: "3–6", lp: "20", pmin: 3, pmax: 6, lps: [20] },
      required: "Wild Bunch of Extras (Gang/Posse variant)",
      story: ["Initiate a fight with another player", "Gain any number of Marshal or Wanted points"],
      chars: ["Ada Curnutt", "Bass Reeves", "Ben Hodges", "Billy the Kid", "Butch Cassidy", "Dave Rudabaugh", "Elfego Baca", "Jesse James", "Judge Roy Bean", "Lozen", "Pat Garrett", "Seth Bullock", "Sundance Kid", "Texas John Slaughter", "Tiburcio Vasquez", "William “Curly Bill” Brocius", "Wyatt Earp"],
      gang: true,
      stores: {
        gs: ["Boot Knife", "Holster", "Medicine Pouch", "Peacekeeper", "Pocket Watch", "Provisions", "Quarter Horse", "Revolver", "Saddle Bags", "Shotgun", "Snake Oil", "Whiskey"],
        tp: ["Bedroll", "Bullwhip", "Burro", "Gazette", "Mustang", "Repeating Shotgun"],
        tt: ["Carbine", "Derringer", "Miner’s Map", "Mule", "Rifle", "Ten-Gallon", "Workhorse"]
      },
      legendary: { only: ["Bandolier", "Black Coat", "Bowie Knife", "Canteen", "Dragoons", "Dynamite", "Lightning", "Marshal’s Badge", "Outlaw’s Mask", "Portrait", "Saber", "Serape", "Shortcut", "Shot Glass", "Silver Flask", "Snakeskin Boots", "Spurs", "Telegram", "Thunder", "Tomahawk"] },
      events: "remove <b>all high roller</b> and <b>all Unique event</b> cards.",
      poker: { remove: ["7♣ Rumors", "7♠ Rumors", "9♥ Jackpot", "9♦ Jackpot"], add: ["7♣ Reputation", "7♠ Reputation", "9♥ Instinct", "9♦ Instinct"] },
      srcShort: "p.21", srcStores: "p.21", srcEvents: "p.21", srcPoker: "p.18, 21"
    },
    risky: {
      rec: { p: "3–5", lp: "20–25", pmin: 3, pmax: 5, lps: [20, 25] },
      required: "",
      story: null,
      chars: ["Allan Pinkerton", "Bat Masterson", "Ben Hodges", "Bloody Knife", "Buckshot Roberts", "Calamity Jane", "Charley Parkhurst", "Doc Holliday", "Elfego Baca", "James “Bloody Arm” Beckwourth", "Johnny Ringo", "Lottie Deno", "Maria Gertrudis Barcelo", "Stagecoach Mary Fields", "Texas John Slaughter", "Wild Bill Hickok"],
      goal: true,
      stores: {
        gs: ["Boot Knife", "Bullwhip", "Pocket Watch", "Provisions", "Quarter Horse", "Revolver", "Repeating Shotgun", "Rifle", "Saddle Bags", "Shotgun", "Ten-Gallon", "Whiskey"],
        tp: ["Bedroll", "Burro", "Gazette", "Medicine Pouch", "Mustang", "Peacekeeper"],
        tt: ["Carbine", "Derringer", "Holster", "Miner’s Map", "Mule", "Snake Oil", "Workhorse"]
      },
      legendary: { except: ["Cattle Brand", "Companion", "Lasso", "Lightning"] },
      events: "use <b>all</b> event cards.",
      poker: null,
      srcShort: "p.22", srcStores: "p.22", srcEvents: "p.22", srcPoker: "p.18"
    },
    border: {
      rec: { p: "2–4", lp: "15–20", pmin: 2, pmax: 4, lps: [15, 20] },
      required: "Wild Bunch of Extras (story cards)",
      story: ["Initiate a fight with another player", "End your move in a space with an event token or frontier token"],
      charsExcept: ["Al Swearengen", "Bloody Knife", "Buffalo Bill Cody", "Charley Parkhurst", "James “Bloody Arm” Beckwourth", "Kit Carson", "Lottie Deno", "Tom Tobin"],
      stores: {
        both: ["Bedroll", "Boot Knife", "Bullwhip", "Burro", "Derringer", "Gazette", "Holster", "Medicine Pouch", "Mustang", "Provisions", "Repeating Shotgun", "Revolver", "Shotgun", "Rifle", "Snake Oil", "Ten-Gallon", "Whiskey", "Workhorse"]
      },
      legendary: { except: ["Fiddle", "Shortcut", "Dime Western", "Pump Trolley"] },
      events: "remove <b>all Unique event</b> cards, and every event that spawns at the <b>Darkrock Bank</b> or the <b>Red Falls Cabaret</b>.",
      poker: null,
      srcShort: "p.23–25", srcStores: "p.24", srcEvents: "p.25", srcPoker: "p.18"
    }
  };

  /* character list line for the Choose characters step */
  WL.modeChars = (c) => {
    const M = WL.modeInfo[c.mode];
    if (M.chars) return "<b>" + c.modeName + ":</b> use only these " + M.chars.length + " characters: " + M.chars.join(", ") + ". Skip any you don’t own.";
    return "<b>" + c.modeName + ":</b> use every character <b>except</b> " + M.charsExcept.join(", ") + ".";
  };

  /* ---- reference sections ----------------------------------------------------------- */
  const sections = [
    /* ------------------------------------------------------------ variants */
    { id: "v-mib", title: "The Man in Black (2-player variant)", when: (c) => c.mib,
      html: (c) => "<p>An automated rival, so 2 players can play without competing head to head.</p>" +
        "<h4>His turn</h4>" + ul([
          "After <b>both players</b> have taken their turn, draw and resolve <b>1 Man in Black card</b>, top to bottom as printed.",
          c.mode === "serenade" ? "Serenade of the Six Guns uses only his cards 1–9, 11–15 and 19." : ""
        ]) +
        "<h4>Rules for the Man in Black</h4>" + ul([
          "He counts as a <b>player</b> for game effects.",
          "He can’t gain Marshal points, Wanted points, Gambler points, Story points or wounds.",
          "He has <b>unlimited</b> money and gold nuggets.",
          "In fights he draws <b>3 fight cards</b>.",
          "Poker cards played against him are worth <b>1 less</b>.",
          "He <b>wins all ties</b>."
        ]) +
        "<h4>Fighting him</h4>" + ul([
          "You may <b>Duel</b> or <b>Rob</b> him. Resolve the result as for a fight with another player.",
          "Rob him successfully: gain <b>1 Wanted point</b> and either <b>$60</b> or <b>2 gold nuggets</b> from the supply."
        ]) +
        "<h4>End of game</h4>" + ul([
          "If he reaches " + c.len + " LP, finish the round; then each player takes one final turn, the Man in Black included.",
          "If he has the most LP at the end, <b>he wins</b>. He also wins any tie."
        ]),
      src: (c) => join(["Rules p.17", c.mode === "serenade" ? "p.19" : ""]) },

    { id: "v-bandit", title: "Bandit Card variant", when: (c) => c.v("bandit"),
      html: () => ul([
          "Each bandit miniature has a <b>numbered sticker</b> under its base that names it: 1 The Gambler, 2 The Desperado, 3 The Fugitive, 4 The Robber, 5 The Bandido, 6 The Horse Thief.",
          "After a player enters a space with a bandit, reveal the <b>top bandit card</b>, then the number under that bandit.",
          "The bandit card’s row for that number applies. Read it aloud, then fight the bandit with all the standard bandit rules, applying that effect.",
          "Each row is one of: a fight effect, an additional reward, an additional penalty, or a thematic quote with no game effect.",
          "<b>Spawning bandits:</b> the player who triggers the story card or effect that spawns them chooses <b>which</b> bandits spawn and at <b>which</b> Bandit Hideout."
        ]) + "<p class=\"note\">Bandit cards 1–6 are in Fistful of Extras; 7–8 are in Wild Bunch of Extras.</p>",
      src: "Rules p.13" },

    { id: "v-gang", title: "Gang/Posse variant & the Recruit action", when: (c) => c.v("gang"),
      html: (c) => "<h4>Recruit (location action)</h4>" + tbl(["Who", "Where", "Cost", "Gain"], [
          ["A <b>Marshal</b> player", c.bt ? "The Buzzard Gulch Marshal’s Office (it counts as the Sheriff’s Office)" : "Sheriff’s Office or Marshal’s Office", "1 action + $20", "A <b>posse</b> card, placed next to your player mat"],
          ["A <b>Wanted</b> player", "Outlaw Camp", "1 action + $20", "A <b>gang</b> card, placed next to your player mat"]
        ]) + ul([
          "You can never have more than <b>1</b> gang or posse card.",
          "You can never hold a card for the opposite alignment: a Wanted player can’t have a posse card.",
          "If your alignment changes to the opposing track, <b>discard</b> your gang or posse card at once, back beside the board."
        ]) +
        "<h4>The double-sided card pictured on p.15 ($20)</h4>" + tbl(["Gang (discard if you become a Marshal)", "Posse (discard if you become Wanted)"], [
          ["At the start of a fight, draw 1 poker card.", "At the start of a fight against bandits, claim jumpers, outlaws, or an arrest attempt, draw 1 poker card."],
          ["At the start of an arrest attempt against you, draw 2 poker cards, and discard this.", "At the end of a Move action, you may discard this to move up to 3 spaces."],
          ["If you would lose a fight, cancel any wounds you would gain, and discard this.", "If you would lose a fight, cancel any wounds you would gain, and discard this."]
        ]) +
        (c.has("au") ? "" : "<p class=\"note\">The Marshal’s Office and the Outlaw Camp are on the Buzzard Gulch board from Ante Up. Without it, posses can be recruited only at the Sheriff’s Office, and the book gives gangs no other place to recruit.</p>"),
      src: (c) => join(["Rules p.10, 15, 43", c.has("au") ? "" : "p.23, 40, 46", c.mode === "law" ? "p.21" : "", c.bt ? "p.25" : ""]) },

    { id: "v-goal", title: "Goal Cards variant", when: (c) => c.v("goal"),
      html: () => ul([
          "Every character has a set of 4 goal cards. You keep 3, facedown (1 was discarded unseen at setup).",
          "When you meet a goal’s requirement, you may <b>complete</b> it: reveal it and announce the condition. It costs <b>no action</b>, and you can complete more than one on your turn.",
          "Then take legendary tokens from the supply equal to the <b>number of goals you have completed</b>, adding them to the ones you already have.",
          "Keep <b>1 more</b> legendary token than you had before completing the goal (to a maximum of 3). Return the rest facedown to the supply.",
          "Uncompleted goal cards cost nothing at the end of the game.",
          "The 27 legendary tokens (with Ante Up’s): 3 worth 0 LP, 7 worth 1 LP, 10 worth 2 LP, 4 worth 3 LP and 3 worth 4 LP."
        ]) + "<p class=\"note\">Completing <b>some</b> goal cards is also one of the ways to free a miscellaneous item slot (p.34).</p>",
      src: "Rules p.15, 34, 36" },

    { id: "v-hsp", title: "High Stakes Poker variant", when: (c) => c.v("hsp"),
      html: () => "<p>An extra game you may choose when you take a <b>Gamble</b> action from a space next to a Saloon. Ordinary poker is still available.</p>" + ol([
          "<b>Ante:</b> the active player antes <b>$10</b> and draws 1 poker card.",
          "<b>Join:</b> the other players in town decide in clockwise order. To join you need at least <b>$30 and 1 poker card</b>. Each joiner antes $10 and draws 1 poker card.",
          "The Saloon adds <b>$40</b> to the pot.",
          "<b>Nobody joined:</b> the dealer (the player to the right of the active player) sets their hand aside and draws <b>5</b> cards to play against the active player.",
          "<b>The flop:</b> turn 3 communal poker cards faceup.",
          "<b>Raise or fold:</b> starting with the player to the left of the active player, clockwise, each player adds <b>$20</b> to the pot or folds. Folding forfeits your $10, counts as losing, and you draw 1 poker card. A playing dealer always adds $20 from the supply and never folds.",
          "<b>Only 1 player left</b> who added $20: they win the pot and gain <b>1 LP and 1 GP</b>. If only the dealer is left, the game ends and the pot goes to the supply.",
          "<b>2 or more left:</b> if the dealer isn’t playing, the Saloon adds <b>$20</b>. Deal the <b>Turn and River</b> (2 more communal cards).",
          "<b>Showdown:</b> starting left of the active player, clockwise, each player reveals <b>2 cards</b> from their hand and combines them with <b>3</b> communal cards for their best hand.",
          "Best hand takes the pot and gains <b>1 LP and 1 GP</b>. Everyone discards the cards they revealed; every loser draws 1 poker card. If a playing dealer has the best hand, the pot goes to the supply."
        ]) + ul([
          "Poker and gambling abilities resolve just as in a normal game of poker.",
          "Hands rank as in normal poker (see “Gambling: poker, faro & high rollers”)."
        ]) + "<p class=\"note\">The book’s sentence for step 8 reads “If more than 1 player remains who added $20 to the pot, the dealer is not playing, the Saloon adds $20 to the pot.” This page reads it as: the Saloon adds $20 only when the dealer isn’t playing.</p>",
      src: "Rules p.16, 31" },

    { id: "v-joker", title: "Joker Card variant", when: (c) => c.v("joker"),
      html: () => ul([
          "Two Jokers in the poker deck act as <b>wild cards</b>. They have no value of their own in a fight or game of poker.",
          "Play a Joker as a <b>placeholder</b> for another poker card in your hand: reveal that card from your hand and keep it. The Joker counts as an <b>exact copy</b> of it: suit, value and any bonuses.",
          "Unlike the poker card Cheat, a Joker revealed in the <b>flop</b>, or played by the <b>dealer</b>, is whatever suit and value <b>each player</b> chooses."
        ]) + "<p class=\"note\">Card text (p.16): “Bonus: After you play this card in a fight or game of poker, you may reveal a card in your hand. This card counts as a duplicate of that card: suit, value, and any bonuses. This card is considered a wild on the flop in a game of poker or when played by the dealer.”</p>",
      src: "Rules p.16" },

    { id: "v-sheriff", title: "Sheriff variant", when: (c) => c.v("sheriff"),
      html: () => ul([
          "The active <b>sheriff card</b> describes how this Sheriff differs from the standard Sheriff. Follow all the normal Sheriff rules except those the card covers.",
          "When the Sheriff <b>loses a fight</b>, discard the active sheriff card and draw a replacement. The new card stays in effect until he loses a fight.",
          "If the sheriff deck runs out, shuffle the discards to form a new deck."
        ]),
      src: "Rules p.17" },

    { id: "v-title", title: "Title Card variant", when: (c) => c.v("title"),
      html: () => ul([
          "The revealed <b>title card</b> adds a condition that lasts the whole game. It adds or changes one or two rules, from in-game effects to end of game scoring.",
          "If the title card conflicts with the normal rules, <b>follow the title card</b>."
        ]),
      src: "Rules p.18" },

    { id: "v-unique", title: "Unique Events", when: (c) => c.v("unique"),
      html: (c) => ul([
          "The Unique event cards (Wild Bunch of Extras) are shuffled into the event deck; their <b>Unique event tokens</b> sit in a supply near the board.",
          "Unique event tokens are event tokens: they are removed from a player’s starting space at setup, like the others.",
          "Resolve each Unique event card as printed when it is drawn.",
          c.mode === "golden" ? "The Golden Rule removes Orphan, Grizzly Bear, Wounded Deputy and Bathcat." : ""
        ]),
      src: (c) => join(["Rules p.6", c.mode === "golden" ? "p.20" : c.mode === "risky" ? "p.22" : ""]) },

    /* ------------------------------------------------------------ game modes */
    { id: "mode", title: (c) => "Game mode: " + c.modeName, when: (c) => c.mode !== "std",
      html: (c) => {
        const M = WL.modeInfo[c.mode];
        let h = "<p class=\"note\">Recommended for " + M.rec.p + " players at " + M.rec.lp + " LP. Everything not listed here follows the normal rules.</p>";
        if (c.mode === "serenade") h += "<h4>Special rules</h4>" + ul([
          "Every player starts with <b>2 extra poker cards</b> in their hand.",
          "No <b>Traveling Trader</b>. Legendary items <b>can’t be purchased</b>: they must be gained through game effects.",
          "No <b>deed</b> cards, so no Claim action and no deed scoring.",
          "Story cards: only those triggered by “Initiate a fight with another player”."
        ]);
        if (c.mode === "golden") h += "<h4>Special rules: end of game scoring</h4>" + ul([
          "Gain <b>1 LP for every $40</b> you have, instead of every $60.",
          "The player with the greatest <b>combined value of items, money and deeds</b> gains <b>1 LP</b>. Upgraded mounts and weapons count at their <b>base cost</b>; Legendary items count as <b>$40</b>."
        ]) + "<h4>Other changes</h4>" + ul([
          "No <b>injury</b> cards.",
          "Story cards: only those triggered by “Spend $80 or more in a town with a single action”."
        ]) + "<p class=\"note\">The book doesn’t say how a deed is valued for the richest-player bonus, or what happens to a tie for it. It also doesn’t say what replaces an injury when you would gain one.</p>";
        if (c.mode === "law") h += "<h4>Special rule: Infamous</h4>" + ul([
          "A Wanted player who is <b>Arrested</b> by a player or the Sheriff may <b>discard their entire hand</b> of poker cards to keep from losing all their Wanted points. Instead they move their cube to the <b>first space</b> of the Wanted track.",
          "The discard happens after they draw the poker card for losing the fight, and after the Sheriff and the player’s miniature are placed in the Sheriff’s or Marshal’s Office.",
          "The Sheriff doesn’t try to Arrest that player again this turn. All other arrest rules still apply."
        ]) + "<h4>Other changes</h4>" + ul([
          "The <b>Gang/Posse variant</b> is in play (see its section).",
          "No <b>deed</b> cards, so no Claim action and no deed scoring.",
          "Story cards: only those triggered by “Initiate a fight with another player” or “Gain any number of Marshal or Wanted points”."
        ]);
        if (c.mode === "risky") h += "<h4>Special rule</h4>" + ul([
          "Each time a player reaches <b>space 4 of the Story track</b>, they gain <b>1 LP</b> in addition to the space reward of their choice."
        ]) + "<h4>Other changes</h4>" + ul([
          "The <b>Goal Cards variant</b> is in play (see its section).",
          "The Legendary Story System and the risk die are used as normal, and every event card is in the deck."
        ]);
        if (c.bt) h += "<h4>The board</h4>" + ul([
          "Played entirely on the <b>Buzzard Gulch</b> board, with <b>Bandit Hideouts</b> and <b>Mines</b> brought in from the main board as tokens or 3D buildings.",
          "Not used: the <b>Bank</b>, <b>Cabaret</b> and <b>Doctor’s Office</b>, the <b>Traveling Trader</b>, and <b>deed</b> cards.",
          "The Buzzard Gulch <b>Marshal’s Office</b> also counts as the <b>Sheriff’s Office</b> for cards, arrests and the Sheriff.",
          "<b>Game text:</b> text that names a space or region on the Western Legends board uses the Buzzard Gulch equivalent instead. If several locations qualify, the active player chooses (for example, either Buzzard Gulch Mine for “the Sunny Hills Mine”)."
        ]) + "<h4>Settler action (Frontier space)</h4>" + ul([
          "While in a Frontier space, spend an action and <b>$40</b> to place your homestead marker in that space.",
          "Only once per game, and only in a Frontier space with <b>no frontier token</b> and no other player’s homestead."
        ]) + "<h4>Your Homestead (location actions there)</h4>" + tbl(["Action", "Effect"], [
          ["<b>Improvement</b>", "Gain <b>1 LP for every $30</b> spent. Gold nuggets can be spent as $20 each."],
          ["<b>Recuperate</b>", "Lose <b>all</b> wounds. Draw 1 poker card for each wound lost this way."]
        ]) + "<h4>Gold nuggets</h4>" + ul([
          "No Bank, so gold nuggets can’t be deposited.",
          "Spend them like money, at <b>$20 each</b> (for example, faro wagers and buying items). They don’t count toward the $120 money limit.",
          "Each gold nugget you hold at the end of the game is worth <b>1 LP</b>."
        ]) + "<h4>Stores & the Train</h4>" + ul([
          "The General Store and Trading Post stands count as <b>one store</b> for Purchase/Upgrade.",
          "The Train starts at the <b>Buzzard Gulch Rail Station</b> and has only 3 checkpoints: Buzzard Gulch Rail Station → Mountain Pass A → Mountain Pass C → back to the Rail Station. All other Train rules are unchanged."
        ]) + "<h4>2 players</h4>" + ul([
          "No Man in Black. A 2-player game plays exactly like any other player count."
        ]);
        return h;
      },
      src: (c) => "Rules p.18 · " + WL.modeInfo[c.mode].srcShort },

    /* ------------------------------------------------------------ appendices */
    { id: "anatomy", title: "Reading the cards & tokens (Appendix I)", when: () => true,
      html: (c) => {
        const rows = [
          ["<b>Character card</b> (p.29)", "1 Artwork · 2 Character Name · 3 Character Ability · 4 Character History · 5 Starting Location · 6 Starting Bonus: items, money and points"],
          ["<b>Poker card</b> (p.41)", "1 Card Value and Suit · 2 Card Name · 3 Artwork · 4 Card Ability: Action, Reaction or Bonus · 5 Set Icon"],
          c.csc ? ["<b>Story card</b> (p.46)", "Back: 7 Condition (the trigger) and the player-count spaces · Front: 1 Card Name · 2 Story Text · 3 Reward Text · 4 Spawn Instructions (not on every card) · 5 Sheriff Movement (not on every card)"] : "",
          c.lss ? ["<b>Legendary story card</b> (p.36)", "Front: 2 Story Text · 7 Conditions · 8 Game effect (immediate, ongoing or both) · Back: 2 Story Text · 3 Reward Text · 6 Additional Resolution Effects (not on every card)"] : "",
          ["<b>Event card</b> (p.30)", "1 Event Effect · 2 Effect Location · 3 Spawn Instructions · 4 Event Token Type"],
          ["<b>Fight card</b> (p.31)", "1 Card Value · 2 Card Effect"],
          c.v("goal") ? ["<b>Goal card</b> (p.15)", "1 Character Name and Artwork · 2 Character Name · 3 Condition · 4 Card Identification Code"] : "",
          ["<b>Item</b> (p.34)", "1 Artwork · 2 Item Name · 3 Purchase/Upgrade Cost · 4 Mount Speed · 5 Item Ability"],
          ["<b>Upgraded item</b>", "1 Artwork · 2 Item Name · 5 Item Ability · 6 LP scored during end of game scoring"],
          c.legItems ? ["<b>Legendary item</b> (p.35)", "1 Artwork · 2 Item Name · 5 Item Ability"] : "",
          c.noInjury ? "" : ["<b>Injury card</b> (p.34)", "1 Card Name · 2 Injury Effect · 3 End of Game Scoring Effect"],
          ["<b>Train encounter card</b> (p.33)", "1 Card Name · 2 Number of Fight Cards the Guard Draws · 3 Win/Lose Reward"],
          c.noTrader ? "" : ["<b>Trader movement card</b> (p.49)", "1 Region Name · 2 Game Board Map Reference · 3 Movement Instructions"],
          c.noDeeds ? "" : ["<b>Deed card</b> (p.29)", "Front: 1 Cost to Claim · 2 Location Name & Icon · 3 Deed Ability · Back: 2 Location Name & Icon · 4 End of Game Scoring Effect"],
          ["<b>Cattle token</b> (p.28)", "1 Ranch Color · 2 Reward"],
          ["<b>Claim jumper token</b> (p.29)", "1 Number of Fight Cards Drawn · 2 Reward for Winning"],
          c.has("au") ? ["<b>Frontier token</b> (p.31)", "1 Number Added to the Frontier Space · 2 Reward"] : "",
          ["<b>High roller token</b> (p.34)", "1 Number of Poker Cards Drawn · 2 Reward for Winning"],
          ["<b>Longhorn token</b> (p.37)", "1 Movement Reduction · 2 Reward"],
          ["<b>Outlaw token</b> (p.40)", "1 Number of Fight Cards Drawn · 2 Reward for Winning"]
        ].filter(Boolean);
        return "<p>The numbers match the callouts on the pictured examples in Appendix I. The page in brackets is the card’s Rules Reference entry.</p>" +
          tbl(["Component", "What each part shows"], rows) +
          "<p class=\"note\">Appendix I labels the longhorn token “(pg 27)”; the Longhorn Token entry is on page 37.</p>";
      },
      src: "Rules p.52–54" },

    { id: "points", title: "Ways to gain points (Appendix IV)", when: () => true,
      html: (c) => {
        const st = c.lss ? "Reach space 4 on the Story track" + (c.mode === "risky" ? " (Risky Business: plus 1 LP)" : "") + "." : "";
        return "<p>A general list from the book, not exhaustive: many characters and items give other ways.</p>" +
          "<h4>Legendary points (LP)</h4>" + ul([
            "Be on the Wanted track (end of each of your turns).", "Defeat a bandit.", "Deliver longhorn tokens.",
            c.bt ? "" : "Deposit gold nuggets.", "Duel a player.", "Play the Reputation poker card for its Reaction effect.", "Event token rewards.", st,
            "Reach spaces 3, 6 or 9 of the Marshal track.", "Reach spaces 2 and 6 on the Gambler track.",
            c.bt ? "" : "Revel at the Cabaret.", "Story card rewards.", "Win a game of poker.",
            c.bt ? "<b>Border Town:</b> the Improvement action at your Homestead, and 1 LP per gold nugget at the end of the game." : ""
          ]) +
          "<h4>Marshal points (MP)</h4>" + ul([
            "Defeat a bandit.", "Defeat outlaw tokens.", "Wrangle cattle tokens.", "Arrest a Wanted player.",
            "Play the Living Legend poker card for its action effect.", st, "Story card rewards."
          ]) +
          "<h4>Wanted points (WP)</h4>" + ul([
            "Rob " + (c.bt ? "the Train or another player (no Bank in this mode)" : "the Bank, the Train or another player") + ".", "Rustle cattle tokens.", "Defeat outlaw tokens.",
            "Play the Living Legend poker card for its action effect.", st, "Story card rewards."
          ]) +
          "<h4>Gambler points (GP)</h4>" + ul([
            "Win a game of poker.", "Win a game of faro.", "Play the Jackpot poker card for its Reaction effect.", st, "High roller token rewards."
          ]) +
          (c.lss ? "<h4>Story points (SP)</h4>" + ul(["Complete a legendary story card condition.", "Roll the risk die."]) : "") +
          (c.mode === "serenade" || c.mode === "law" ? "<p class=\"note\">" + c.modeName + " removes the Jackpot poker cards (p." + (c.mode === "law" ? "21" : "19") + ").</p>" : "");
      },
      src: (c) => join(["Rules p.59", c.mode === "risky" ? "p.22" : "", c.bt ? "p.23, 25" : ""]) }
  ];

  /* insert before the Legends lookup (js/data-legends.js) if it is already loaded, else at the end */
  const at = WL.reference.findIndex(s => s.id === "legends");
  WL.reference.splice(at < 0 ? WL.reference.length : at, 0, ...sections);
})();
