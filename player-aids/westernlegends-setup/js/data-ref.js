/* =============================================================================
   Western Legends — Setup & Reference Utility · rules reference
   Overview & phases of play (Rules p.8–12) and the alphabetical Rules Reference
   (p.26–51), grouped for mid-game lookup. Fight and gambling steps also use the
   charts in Appendix II–III (p.55–58). Each section: { id, title, when(c), html(c), src }.
   ============================================================================= */
(function () {
  const ul = WL.ul, join = WL.join;
  /* a rulebook icon at its first mention (icons standard v1; files cropped from the Rules, see each section's src) */
  const ic = (file, alt) => "<img class=\"aid-ic aid-ic-inline\" src=\"images/icons/" + file + ".webp\" alt=\"" + alt + "\">";
  const tbl = (head, rows) => "<div class=\"tbl-wrap\"><table><thead><tr>" + head.map(h => "<th>" + h + "</th>").join("") +
    "</tr></thead><tbody>" + rows.map(r => "<tr>" + r.map(x => "<td>" + x + "</td>").join("") + "</tr>").join("") + "</tbody></table></div>";

  WL.reference = [
    /* ---------------------------------------------------------------- overview */
    { id: "overview", title: "Winning, game length & the end of the game", when: () => true,
      html: (c) => "<h4>The goal</h4>" + ul([
          "Finish with the most <b>Legendary points (LP)</b>.",
          "LP comes mainly from notable acts: fights, driving cattle, and completing " + (c.lss ? "legendary story cards" : "story cards") + ".",
          (c.bt ? "Outlaws collect <b>Wanted points</b> by robbing the Train, rustling cattle and stealing from players (no Bank in Who Runs Border Town?)." : "Outlaws collect <b>Wanted points</b> by robbing the Bank, rustling cattle and stealing from players.") + " Lawmen collect <b>Marshal points</b> by fighting bandits, wrangling cattle and arresting Wanted players."
        ]) +
        "<h4>Triggering the end</h4>" + ul([
          "Game length tonight: <b>" + c.len + " LP</b> (Short 15 · Average 20 · Long 25).",
          "At the end of your turn, if your LP is <b>equal to or greater than " + c.len + "</b>, you trigger the end of the game.",
          "Finish the current round. Then, starting with the first player, everyone takes <b>one more turn</b>, including the player who triggered the end, so all players have had the same number of turns.",
          "Then do final scoring."
        ]) +
        "<h4>Final scoring, in this order</h4>" + "<ol>" + [
          "Gain LP for each <b>upgraded mount and upgraded weapon</b> you own (top left corner of the card).",
          c.legItems ? "Gain LP from any <b>Legendary items</b> that provide it (top left corner)." : "",
          c.mode === "golden" ? "Gain <b>1 LP for every $40</b> you have, rounding down (The Golden Rule; normally every $60)." : "Gain <b>1 LP for every $60</b> you have, rounding down.",
          c.mode === "golden" ? "<b>The Golden Rule:</b> the player with the greatest combined value of items, money and deeds gains <b>1 LP</b> (upgraded mounts and weapons at base cost; Legendary items count as $40)." : "",
          c.bt ? "<b>Who Runs Border Town?:</b> gain <b>1 LP per gold nugget</b> you hold." : "",
          "Lose <b>1 LP per wound</b>.",
          c.noInjury ? "" : "Lose LP for an <b>injury</b> card that causes an end of game loss (shown at the bottom of the card).",
          "Most Wanted player: <b>+3 LP</b>; every other Wanted player <b>+1 LP</b>. If the most Wanted is tied, every Wanted player gains 1 LP instead.",
          "Marshal players gain LP for the <b>row</b> their cube is on: 1, 2 or 3 LP.",
          "Furthest along the <b>Gambler track</b>: +1 LP (all tied players gain 1 LP).",
          "Gain LP equal to the total value of your <b>legendary tokens</b>.",
          c.noDeeds ? "" : "Gain LP from your <b>deeds</b>, as their scoring side instructs. Deeds for destroyed locations (with a ruin token) don’t count toward scoring in any way."
        ].filter(Boolean).map(x => "<li>" + x + "</li>").join("") + "</ol>" +
        "<h4>Ties</h4>" + ul([
          "Most Marshal or Wanted points wins; then most gold nuggets; then fewest wounds; otherwise the tied players share the victory."
        ]) +
        "<p class=\"note\">Only score the steps that apply to the version you’re playing. Upgraded gear, some Legendary items and legendary tokens score only at the end; most other LP is scored as you gain it.</p>",
      src: (c) => join(["Rules p.8, 12, 35", c.mode === "golden" ? "p.20" : "", c.bt ? "p.25" : "", c.noDeeds && !c.bt ? WL.modeInfo[c.mode].srcShort : ""]) },

    /* ---------------------------------------------------------------- turn */
    { id: "turn", title: "Your turn: Start, Action and End of Turn Phases", when: () => true,
      html: (c) => "<h4>1. Start of Turn Phase</h4><ol>" + [
          "<b>Move the Train</b> to its next checkpoint (see “The Train”).",
          "Check for <b>start of turn</b> effects.",
          "Choose one: <b>gain $20</b>, <b>draw 2 poker cards</b>, or <b>gain $10 and draw 1 poker card</b>.",
          "Choose your <b>weapon and mount</b> for the turn: the card on top of each stack on your mat is the active one."
        ].map(x => "<li>" + x + "</li>").join("") + "</ol>" +
        "<h4>2. Action Phase</h4>" + ul([
          "Take up to <b>3 actions</b>, choosing from: <b>Move</b>, <b>Location/Region</b>, <b>Card</b>, and <b>Fight Another Player</b> (Arrest, Duel or Rob).",
          "You may take the same action several times, unless a rule says otherwise.",
          "You can’t take a Fight Another Player action against the <b>same player</b> more than once in a turn. You can take at most <b>1 Heist</b> per turn.",
          c.lss ? "Once during your Action Phase you may roll the <b>risk die</b>, at any time except while resolving one of your actions." : ""
        ]) +
        "<h4>3. End of Turn Phase, in this order</h4><ol>" + [
          "Resolve your <b>end of turn</b> abilities and effects, in the order you choose.",
          c.lss ? "Resolve all <b>legendary story card</b> conditions tied to where you end your turn." : "Resolve any <b>story card</b> you just completed (the last story disc, Core Story Card variant).",
          c.lss ? "Resolve the legendary story card if <b>all its conditions</b> have been met." : "",
          "If you are <b>Wanted</b>, gain LP for the row your cube is on (1, 2 or 3 LP).",
          "If your LP has reached <b>" + c.len + "</b>, trigger the end of the game.",
          "The next player clockwise becomes the active player."
        ].filter(Boolean).map(x => "<li>" + x + "</li>").join("") + "</ol>" +
        "<p class=\"note\">Hand size is checked in your End of Turn Phase: discard down to your maximum (5, minus your wounds) then. You may hold more cards until then.</p>",
      src: (c) => join(["Rules p.8–9, 12", "p.26, 33, 41, 50", c.csc ? "p.46" : ""]) },

    /* ---------------------------------------------------------------- actions */
    { id: "actions", title: "The four actions: Move, Location/Region, Card, Fight", when: () => true,
      html: (c) => "<h4>A. Move</h4>" + ul([
          "Move up to your maximum movement with one Move action: <b>2 spaces</b> without a mount, or the <b>number printed on your active mount</b>.",
          "Move into any adjacent space. <b>Diagonal spaces are adjacent.</b>",
          "You can’t move into or through the 2 <b>mesas</b> (surrounded by a red dashed line). Thick brown lines show town and region borders.",
          "Entering a space with an <b>NPC</b> (bandit, claim jumper, outlaw) ends your movement at once. You lose the rest of your movement and must fight it.",
          "Each <b>longhorn</b> token you carry reduces your movement by 1, to a minimum of 1.",
          "Moving outside a Move action (a card effect, say) doesn’t trigger Bonus, Reaction or other abilities that trigger off a Move action."
        ]) +
        "<h4>B. Location or Region action</h4>" + ul([
          "Most actions are at <b>locations</b>: spaces with an icon. You must be <b>in the location’s space</b>.",
          "For a <b>General Store" + (c.has("au") ? ", Trading Post" : "") + " or Saloon</b>, you can be in any of the <b>3 spaces adjacent</b> to it.",
          c.noTrader ? "" : "A <b>region action</b> (the Traveling Trader’s Trader action) needs you anywhere inside that region.",
          "See “Locations & what you can do there”."
        ]) +
        "<h4>C. Action on a card</h4>" + ul([
          "Poker cards, item cards and some character cards say <b>ACTION</b>. Using one costs 1 action.",
          "Place the card faceup and read it aloud, then carry out its text in full before taking another action.",
          "A poker card used for its action is <b>always discarded</b> afterwards. A character or item card is kept, unless its text says to discard it."
        ]) +
        "<h4>D. Fight Another Player</h4>" + ul([
          "Challenge a player <b>in your space</b> to an <b>Arrest</b> (Marshals only, against a Wanted player), a <b>Duel</b> or a <b>Rob</b>. See “Fights” and “Arrest, Duel & Rob”."
        ]) +
        "<h4>Bonus & Reaction effects</h4>" + ul([
          "<b>Bonus</b> (printed “Bonus” on the card): used after cards are revealed, only when its condition is met. It costs no action. Played where the condition isn’t met, it is ignored, e.g. the Bonus on the poker card Cheat is ignored in a fight.",
          "<b>Reaction</b> (printed “REACTION”): play it when its condition is met to change the outcome of an action. It costs no action and can be played on another player’s turn."
        ]) +
        "<h4>Character abilities</h4>" + ul([
          "Every character has a unique ability, available only once they have <b>5 LP</b> (the star on the 5 LP space).",
          "If the rulebook and a character’s ability conflict, the <b>card text wins</b>."
        ]),
      src: (c) => join(["Rules p.9–11", "p.26–28, 35, 37, 39, 43–44", c.noTrader ? (c.bt ? "p.24" : "p.19") : ""]) },

    { id: "regions", title: "Spaces, regions & occupied spaces", when: () => true,
      html: (c) => "<h4>Regions</h4>" + ul(c.bt ? [
          "Who Runs Border Town? uses only the Buzzard Gulch board: <b>Buzzard Gulch</b> (inside of town) and the <b>Buzzard Gulch Frontier</b> (outside of town).",
          "Locations are named after their region: the Mine in Sunny Hills is the <b>Sunny Hills Mine</b>."
        ] : [
          "There are <b>" + (c.has("au") ? "9" : "7") + " regions</b>, each with a unique name and a thick border.",
          "Inside town: <b>Darkrock</b>, <b>Red Falls</b>" + (c.has("au") ? " and <b>Buzzard Gulch</b>" : "") + ". A player in these spaces is inside of town.",
          "Outside town: Mesito’s Point, Sunny Hills, Cliff Junction, Spike’s View, Dixon Creek" + (c.has("au") ? " and the Buzzard Gulch Frontier" : "") + ".",
          "Locations are named after their region: the Mine in Sunny Hills is the <b>Sunny Hills Mine</b>."
        ]) +
        "<h4>Occupied and unoccupied</h4>" + ul([
          "A space is <b>occupied</b> when it holds an NPC or a player miniature.",
          "Players can share spaces with other players. Marshal and neutral players can share a space with the Sheriff.",
          "Players can’t share a space with bandits, claim jumpers or outlaws: moving in ends your move and starts a fight.",
          "Bandits, claim jumpers and outlaws can’t be placed in an occupied space, during setup or play.",
          c.noTrader ? "The <b>Train</b> miniature doesn’t occupy its space." : "The <b>Train</b> and <b>Traveling Trader</b> miniatures don’t occupy their spaces."
        ]),
      src: (c) => join(["Rules p.40, 43", c.has("au") ? "" : "p.42", c.bt ? "p.23" : "", c.noTrader ? (c.bt ? "p.24" : "p.19") : ""]) },

    /* ---------------------------------------------------------------- locations */
    { id: "locations", title: "Locations & what you can do there", when: () => true,
      html: (c) => {
        const rows = [
          [ic("loc-bandit-hideout", "Bandit Hideout") + " <b>Bandit Hideout</b> " + (c.bt ? "(3 in Buzzard Gulch: A, B, C — tokens or 3D buildings)" : "(6: A, B or C)"), "Work", "Bandits spawn only here."],
          c.bt ? null : [ic("loc-bank", "Bank") + " <b>Bank</b> (Darkrock)", "Claim, Deposit, Heist, Repair, Work", ""],
          c.bt ? null : [ic("loc-cabaret", "Cabaret") + " <b>Cabaret</b> (Red Falls)", "Claim, Revel, Repair, Work", ""],
          c.bt ? null : [ic("loc-doctors-office", "Doctor’s Office") + " <b>Doctor’s Office</b> (Red Falls)", "Claim, Heal, Repair, Work", ""],
          c.bt ? null : [ic("loc-store-barrel", "General Store / Trading Post (barrel)") + ic("loc-store-horseshoe", "General Store (horseshoe)") + " <b>General Store</b> (Darkrock and Red Falls)", "Claim, Purchase/Upgrade, Work", "Act from any of its 3 adjacent spaces."],
          [ic("loc-mine", "Mine") + " <b>Mine</b> " + (c.bt ? "(2 in Buzzard Gulch — tokens or 3D buildings)" : "(3, main board)"), "Claim, Prospect for Gold, Repair, Work", "Claim jumpers spawn only here."],
          [ic("loc-ranch", "Ranch") + " <b>Ranch</b> (" + (c.bt ? "Buzzard Gulch" : c.has("au") ? "3: 2 on the main board, 1 in Buzzard Gulch" : "2, top of the main board") + ")", "Acquire, Claim, Work", "Free: deliver longhorns; rustle cattle of another Ranch’s colour."],
          [ic("loc-rail-station", "Rail Station") + " <b>Rail Station</b> (" + (c.bt ? "Buzzard Gulch" : c.has("au") ? "2: main board and Buzzard Gulch" : "main board") + ")", "Claim" + (c.has("au") && !c.bt ? ", Travel by Rail" : "") + ", Work", "Free: wrangle cattle; deliver longhorns."],
          [ic("loc-saloon", "Saloon") + " <b>Saloon</b> " + (c.bt ? "(Buzzard Gulch)" : "(1 in each town)"), "Challenge, Gamble (poker" + (c.v("hsp") ? ", faro or High Stakes Poker" : " or faro") + "), Work", "Act from any of its 3 adjacent spaces."],
          [ic("loc-sheriffs-office", "Sheriff’s/Marshal’s Office") + (c.bt ? " <b>Marshal’s Office</b> (Buzzard Gulch; counts as the Sheriff’s Office)" : " <b>Sheriff’s Office</b> (Darkrock)" + (c.has("au") ? " / <b>Marshal’s Office</b> (Buzzard Gulch)" : "")), "Work" + (c.v("gang") ? ", Recruit" : ""), "Arrested players go here."],
          [ic("loc-train", "Train") + " <b>Train</b> (at its current checkpoint)", "Heist, Work", "Heist only while the Train is there." + (c.bt ? "" : " While it is on the train board extension, heist from the matching Bandit Hideout on the main board.")]
        ].filter(Boolean);
        if (c.has("au")) rows.push(
          [ic("loc-store-barrel", "Trading Post (barrel)") + " <b>Trading Post</b> (Buzzard Gulch)", "Claim, Purchase/Upgrade, Work", "Act from any of its 3 adjacent spaces." + (c.bt ? " Sells both the General Store and Trading Post stands (one store in this mode)." : "")],
          [ic("loc-frontier", "Frontier space") + " <b>Frontier spaces</b> (Buzzard Gulch Frontier)", c.bt ? "Frontier, Settler, Work" : "Frontier, Work", c.bt ? "Settler: an action and $40 places your homestead marker in that space (once per game; no frontier token, no other player’s homestead)." : ""],
          [ic("loc-outlaw-camp", "Outlaw Camp") + " <b>Outlaw Camp</b> (Buzzard Gulch Frontier)", "Work" + (c.v("gang") ? ", Recruit" : ""), "Free: rustle cattle; deliver longhorns."],
          c.bt ? [ic("loc-mountain-pass", "Mountain Pass") + " <b>Mountain Pass</b> (A and C, Buzzard Gulch Frontier)", "Work", ""]
            : [ic("loc-mountain-pass", "Mountain Pass/Trailhead") + " <b>Mountain Pass / Trailhead</b>", "Trail, Work", ""]
        );
        if (c.bt) rows.push(["<b>Homestead</b> (your homestead marker)", "Improvement, Recuperate", "Who Runs Border Town? only."]);
        if (!c.noTrader) rows.push([ic("loc-traveling-trader", "Traveling Trader") + " <b>Traveling Trader</b> (its current region)", "Trader (region action)", "Anywhere in the region."]);
        if (c.noDeeds) rows.forEach(r => { r[1] = r[1].replace("Claim, ", ""); });
        return tbl(["Location", "Actions", "Notes"], rows) + ul([
          c.noDeeds ? "" : "<b>Claim</b> is available at any location with an available deed card.",
          "At a location with a <b>ruin token</b>, the only action is <b>Repair</b>.",
          "Free deliveries (wrangle, rustle, longhorns) need no action: when you end a Move action there, you <b>may</b> deliver (it’s your choice).",
          "<b>Store icons:</b> the General Store and the Trading Post share the barrel icon. The Western Legends playmat uses the horseshoe icon in place of the barrel for the General Store, to tell it apart from the Trading Post. Whatever icon is printed on the board, “General Store” means the locations in Darkrock and Red Falls."
        ]) + (c.noDeeds ? "" : "<p class=\"note\">The location chart on page 10 also lists Claim at the Saloon. The Saloon entry on page 45 doesn’t, and Claim depends on a deed being available at the location (p.29).</p>") +
          (c.noDeeds ? "<p class=\"note\">" + c.modeName + " doesn’t use deed cards, so there is no Claim action.</p>" : "") +
          (c.bt ? "<p class=\"note\">Who Runs Border Town? is played on the Buzzard Gulch board only: no Bank, Cabaret or Doctor’s Office; the Marshal’s Office counts as the Sheriff’s Office; Bandit Hideouts and Mines are added as tokens or 3D buildings; and each player can found a <b>Homestead</b> (see “Game mode: Who Runs Border Town?”).</p>" +
            "<p class=\"note\">Who Runs Border Town? is played entirely on the Buzzard Gulch board, which sits on top of the main board (p.23–24). Travel by Rail and the Trail lead to the main board (p.48–49), so they have nowhere to go in this mode. The book doesn’t mention them for this mode.</p>" : "");
      },
      src: (c) => join(["Rules p.10–11", "p.26–29, 31–33, 37–40, 42, 44–46, 48–49, 51", c.v("hsp") ? "p.16" : "", c.v("gang") ? "p.43" : "", c.noDeeds ? WL.modeInfo[c.mode].srcShort : ""]) },

    { id: "town", title: "Work, Bank, Cabaret & Doctor", when: () => true,
      html: (c) => "<h4>Work</h4>" + ul(["At any location: spend an action, gain <b>$10</b>."]) +
        "<h4>Deposit (Bank)</h4>" + ul([
          "Sell your gold nuggets: <b>$20 and 1 LP</b> for each one sold. Sold nuggets go back to the supply."
        ]) +
        "<h4>Revel (Cabaret)</h4>" + ul(["Pay <b>$30 for 1 LP</b>. You can repeat it in the same action, gaining 1 LP for each $30 spent."]) +
        "<h4>Heal (Doctor’s Office)</h4>" + ul([
          "Pay <b>$10</b>, lose <b>all</b> your wounds, and draw <b>1 poker card per wound</b> lost.",
          c.noInjury ? "" : "It also removes your <b>injury</b> card, if you have one. You don’t draw a card for the injury."
        ]) +
        "<h4>Money limit</h4>" + ul(["You can carry at most <b>$120</b>. Money gained above that is lost and returned to the supply."]) +
        (c.bt ? "<p class=\"note\">Who Runs Border Town?: the Bank, Cabaret and Doctor’s Office aren’t used. Recuperate at your Homestead instead of Heal. Gold nuggets can be spent as $20 each and don’t count toward the $120 limit.</p>" : ""),
      src: (c) => join(["Rules p.29, 33, 42, 44, 50", c.bt ? "p.23, 25" : ""]) },

    { id: "travel", title: "Travel by Rail, the Trail & Mountain Passes", when: (c) => c.has("au"),
      html: (c) => "<h4>Travel by Rail (Rail Station)</h4>" + ul([
          "A location action that is also a Move action.",
          "Pay <b>$10</b>, move your miniature to the <b>other Rail Station</b>, then move up to your maximum movement."
        ]) +
        "<h4>Trail (Trailhead)</h4>" + ul([
          "A location action that is also a Move action. Spend an action to go through a Mountain Pass to the matching Trailhead on the other board.",
          "You must use your <b>full movement</b> to go through a Mountain Pass.",
          "Top pass: the Trailhead at <b>Bandit Hideout A in Sunny Hills</b> ↔ <b>Mountain Pass A</b> in the Buzzard Gulch Frontier.",
          "Bottom pass: the Trailhead at <b>Bandit Hideout C in Cliff Junction</b> ↔ <b>Mountain Pass C</b> in the Buzzard Gulch Frontier.",
          "When the <b>Sheriff</b> moves through a Mountain Pass, its 2 Trailheads count as adjacent: 1 movement."
        ]) + (c.bt ? "<p class=\"note\">Who Runs Border Town? is played entirely on the Buzzard Gulch board, so the other Rail Station and the main board’s Trailheads aren’t in play. The book doesn’t mention these actions for this mode.</p>" : ""),
      src: (c) => join(["Rules p.39, 48–49", c.bt ? "p.23" : ""]) },

    /* ---------------------------------------------------------------- fights */
    { id: "fights", title: "Fights: how every fight works", when: () => true,
      html: (c) => "<p>There are two kinds of fight: <b>player fights</b> (Arrest, Duel, Rob) and <b>NPC fights</b> (bandits, claim jumpers, outlaws, the guard, the Sheriff).</p>" +
        "<h4>Player fight</h4><ol>" + [
          "<b>Declaration:</b> declare a fight against a player in your space. Only a Marshal player can declare an Arrest, and only against a Wanted player.",
          "<b>Start of fight effects:</b> starting with the active player, alternate until both pass in a row.",
          "The active player chooses 1 poker card from hand, facedown. The other player chooses to <b>fight</b> (and picks a poker card facedown) or <b>decline</b>. Declining means the active player wins: skip to the reward.",
          "<b>Reveal</b> both cards at once. Each player resolves Bonus effects and character or item abilities that affect the card played against them.",
          "<b>Reaction:</b> starting with the active player, alternate playing Reaction effects until both pass in a row.",
          "Highest value wins. <b>The active player wins ties.</b>",
          "<b>Reward</b> (see “Arrest, Duel & Rob”), then end of fight effects, starting with the active player. Discard all poker cards played."
        ].map(x => "<li>" + x + "</li>").join("") + "</ol>" +
        "<h4>NPC fight</h4><ol>" + [
          "<b>Trigger:</b> the player to the <b>right</b> of the active player plays the NPC and draws its number of <b>fight cards</b>.",
          "Resolve start of fight effects. You choose 1 poker card facedown; the NPC side chooses 1 of the drawn fight cards facedown.",
          "<b>Reveal</b> both. Resolve your Bonus effects and abilities, play any Reaction effects, then apply the <b>fight card’s effect</b>. It always applies, win or lose.",
          "Highest value wins. <b>The NPC wins ties.</b>",
          "Reward, then end of fight effects. Shuffle the drawn fight cards onto the <b>bottom</b> of the fight deck. Discard the poker cards played."
        ].map(x => "<li>" + x + "</li>").join("") + "</ol>" +
        ul([
          "You can’t decline a fight with an NPC.",
          "NPCs are removed from the board after the fight, whatever the outcome. (The Sheriff instead goes to the " + (c.has("au") ? "Sheriff’s/Marshal’s Office" : "Sheriff’s Office") + " if he loses; see “The Sheriff”.)",
          "Reaction and Bonus effects are always resolved starting with the active player."
        ]),
      src: "Rules p.31, 40 · App. II p.55–56" },

    { id: "pvp", title: "Arrest, Duel & Rob", when: () => true,
      html: (c) => tbl(["Fight", "Who", "Active player wins", "Active player loses"], [
          ["<b>Arrest</b>", "A Marshal player against a Wanted player", "Gain <b>1 Marshal point</b>. The Wanted player is Arrested (below).", "You gain 1 wound and draw 1 poker card. The Wanted player avoids capture."],
          ["<b>Duel</b>", "Anyone", "Gain <b>2 LP</b>. The loser gains 1 wound and draws 1 poker card. No Marshal or Wanted points.", "You gain 1 wound and draw 1 poker card. The other player gets nothing."],
          ["<b>Rob</b>", "Anyone", "Gain <b>1 Wanted point</b>. Steal half the target’s money <b>or</b> half their gold nuggets (rounded up), and you <b>may</b> also steal 1 cattle or longhorn token if they carry one. The loser gains 1 wound and draws 1 poker card.", "You gain 1 wound and draw 1 poker card. The target avoids being robbed."]
        ]) +
        "<h4>Arrested</h4>" + ul([
          "The Wanted player gains 1 wound and draws 1 poker card.",
          "They lose <b>all Wanted points</b>, all cattle and longhorn tokens, <b>half their money</b> and <b>half their gold nuggets</b> (both rounded up).",
          c.has("au") ? "Arrested by a Marshal: the Sheriff and the arrested player go to the Sheriff’s Office or Marshal’s Office on the <b>board where the arrest happened</b>." : "Arrested by a Marshal: the Sheriff and the arrested player go to the <b>Sheriff’s Office</b>.",
          c.mode === "law" ? "<b>Law and Disorder — Infamous:</b> the arrested player may discard their whole hand (after drawing for the loss and after both miniatures are placed) to move to the first space of the Wanted track instead of losing all their Wanted points." : ""
        ]) +
        "<h4>Rob details</h4>" + ul([
          "If you steal a cattle token while carrying one, choose which cattle token goes back to its Ranch."
        ]) +
        "<p class=\"note\">The Duel entry (p.29) says that if the initiator loses, “neither player… gains anything”, and Rob (p.44) says “nothing is gained”. The fight chart (p.56) still gives the losing active player 1 wound and 1 poker card, as shown here.</p>",
      src: (c) => join(["Rules p.11, 26, 29, 44 · App. II p.56", c.mode === "law" ? "p.21" : ""]) },

    { id: "npcs", title: "NPCs: bandits, outlaws, claim jumpers & the guard", when: () => true,
      html: (c) => tbl(["NPC", "Fight cards", "You win", "You lose"], [
          [ic("loc-bandit-hideout", "Bandit") + " <b>Bandit</b>", "2", "Gain 1 LP. A Marshal player may take 1 Marshal point instead.", "1 wound, draw 1 poker card"],
          [ic("npc-outlaw", "Outlaw") + " <b>Outlaw</b> token", "The number on the token", "The reward printed on the token", "1 wound, draw 1 poker card"],
          [ic("npc-claim-jumper", "Claim Jumper") + " <b>Claim jumper</b> token", "The number on the token", "The reward printed on the token", "1 wound, draw 1 poker card"],
          [ic("loc-bank", "Guard (Bank)") + " <b>Guard</b> (Bank Heist)", "3", "3 Wanted points and $80", "1 wound, draw 1 poker card, gain 1 Wanted point"],
          [ic("loc-train", "Guard (Train)") + " <b>Guard</b> (Train Heist)", "The number on the train encounter card", "The card’s “Player Wins” effect", "1 wound, draw 1 poker card, the card’s “Player Loses” effect"],
          [ic("loc-sheriffs-office", "Sheriff") + " <b>Sheriff</b>", "4", "No reward; the Sheriff goes back to the " + (c.has("au") ? "Sheriff’s/Marshal’s Office" : "Sheriff’s Office"), "You are Arrested: 1 wound, draw 1 poker card"]
        ]) +
        ul([
          "Bandits spawn only at <b>Bandit Hideouts</b>; claim jumpers only at <b>Mines</b>; outlaws at the <b>Outlaw Camp</b>" + (c.has("au") ? "" : " (Ante Up)") + " and wherever an event card says.",
          "A defeated bandit’s Hideout stays empty until a game effect places a new bandit there, and only if it is unoccupied.",
          "NPCs always win ties and are removed after the fight, whatever the outcome.",
          "High rollers are NPCs too, but you play poker against them (see “Gambling”)."
        ]) +
        "<p class=\"note\">The fight chart on p.55 prints “Gain 1MP or 1LP” for beating a bandit, with “Wanted players cannot gain WP”. The Bandits entry (p.27) says a <b>Marshal</b> player may choose 1 MP instead of 1 LP, and a Wanted player can never gain Marshal points (p.50).</p>",
      src: (c) => "Rules p.27, 29, 33–34, 40, 45 · App. II p.55" },

    { id: "heist", title: (c) => c.bt ? "Heist: the Train" : "Heist: the Bank & the Train", when: () => true,
      html: (c) => ul([
          c.bt ? "A location action at the Train’s current space. At most <b>1 Heist per turn</b>." : "A location action at the <b>Bank</b> or at the Train’s current space. At most <b>1 Heist per turn</b>.",
          "You must fight the <b>guard</b> (an NPC fight)."
        ]) +
        (c.bt ? "" : "<h4>At the Bank</h4>" + ul(["The guard draws <b>3</b> fight cards.", "Win: gain <b>3 Wanted points and $80</b>.", "Lose: gain <b>1 Wanted point</b> (plus the usual 1 wound and 1 poker card)."])) +
        "<h4>At the Train</h4>" + ul([
          "The guard draws the number of fight cards printed on the <b>train encounter card</b>.",
          "Win: resolve its <b>Player Wins</b> effect. Lose: resolve its <b>Player Loses</b> effect (plus 1 wound and 1 poker card).",
          c.bt ? "" : "When the Train is on a space of the <b>train board extension</b>, heist from the matching Bandit Hideout on the main board. For example, with the Train at space B, rob it from Bandit Hideout B."
        ]) + (c.bt ? "<p class=\"note\">Who Runs Border Town? has no Bank, so only the Train can be heisted.</p>" : ""),
      src: (c) => join(["Rules p.33, 48 · App. II p.55", c.bt ? "p.25" : ""]) },

    { id: "sheriff", title: "The Sheriff, Wanted players & arrests", when: () => true,
      html: (c) => ul([
          "The Sheriff is an NPC that tries to Arrest Wanted players. He starts at the <b>Sheriff’s Office</b> in Darkrock" + (c.bt ? " (Who Runs Border Town?: at the Buzzard Gulch Marshal’s Office, which counts as the Sheriff’s Office)." : "."),
          c.v("sheriff") ? "<b>Sheriff variant:</b> the active sheriff card changes some of these rules; see “Sheriff variant”." : "",
          "He is <b>active only while some player is Wanted</b>. With no Wanted player, effects that would move him do nothing.",
          "Story cards" + (c.lss ? ", the Story track" : "") + " and event cards can move him."
        ]) +
        "<h4>When the Sheriff enters a Wanted player’s space</h4><ol>" + [
          "Every Wanted player in the space discards <b>1 poker card</b>.",
          "The Sheriff fights to arrest a Wanted player there. If there are several, the player who resolved the effect that moved him chooses.",
          "The Sheriff draws <b>4</b> fight cards and wins ties.",
          "Sheriff wins: the player is Arrested (loses all Wanted points, cattle and longhorn tokens, half their money and half their gold nuggets, rounded up), gains 1 wound and draws 1 poker card." + (c.has("au") ? " The Sheriff and the player go to the Sheriff’s Office or Marshal’s Office, <b>whichever is closer</b>." : " The Sheriff and the player go to the <b>Sheriff’s Office</b>."),
          "Player wins: no reward; the Sheriff is placed back at the " + (c.has("au") ? "Sheriff’s/Marshal’s Office" : "Sheriff’s Office") + "."
        ].map(x => "<li>" + x + "</li>").join("") + "</ol>" +
        (c.mode === "law" ? "<p class=\"note\">Law and Disorder — Infamous: a player arrested by the Sheriff may discard their whole hand to drop to the first space of the Wanted track instead of losing all their Wanted points. The Sheriff doesn’t try to Arrest them again this turn.</p>" : "") +
        ul([
          "The Sheriff isn’t limited to fighting a player once per turn.",
          c.has("au") ? "Through a Mountain Pass, the Sheriff treats its 2 Trailheads as adjacent (1 movement)." : ""
        ]),
      src: (c) => join(["Rules p.6, 26, 40, 45–46", c.lss ? "p.47" : "", c.has("au") ? "p.39" : "", "App. II p.55", c.mode === "law" ? "p.21" : "", c.bt ? "p.25" : "", c.v("sheriff") ? "p.17" : ""]) },

    /* ---------------------------------------------------------------- tracks */
    { id: "tracks", title: "Points & tracks: LP, Marshal, Wanted & Gambler", when: () => true,
      html: (c) => (c.lss ? "<p>There are 5 kinds of points: Gambler (GP), Legendary (LP), Marshal (MP), Story (SP) and Wanted (WP), each with its own track.</p>" : "<p>There are 4 kinds of points in play: Gambler (GP), Legendary (LP), Marshal (MP) and Wanted (WP), each with its own track. (Story points and the Story track belong to Blood Money’s Legendary Story System, which isn’t used here.)</p>") +
        "<h4>Legendary Point track</h4>" + ul([
          "Move your cube 1 space per LP gained. The <b>star on space 5</b> reminds you that character abilities switch on at 5 LP.",
          "<b>Event markers</b>: the first time any cube enters or passes a space with an event marker (on any track), that player resolves an event card, then the marker goes back to the box."
        ]) +
        "<h4>Marshal track</h4>" + tbl(["Row", "Spaces (reward when you reach them)", "End of game"], [
          ["1", "1: $20 · 2: $20 · 3: 2 LP", "1 LP"],
          ["2", "4: $30 · 5: $30 · 6: 4 LP", "2 LP"],
          ["3", "7: $40 · 8: $40 · 9: 6 LP", "3 LP"]
        ]) + ul([
          "A player with a cube on this track is a <b>Marshal player</b>.",
          "You gain a space’s reward only when moving forward. If your cube is moved back, you don’t gain the same reward again. If you leave the track (by gaining WP) and later come back, you gain the rewards again.",
          "On space 9, each further MP gives <b>1 LP</b> instead.",
          "A Marshal player who gains any <b>Wanted points</b> moves straight onto the Wanted track and is now Wanted."
        ]) +
        "<h4>Wanted track</h4>" + tbl(["Row", "Spaces", "End of each of your turns"], [
          ["1", "1: Sheriff active · 2: draw 1 poker card · 3: —", "1 LP"],
          ["2", "4: draw 1 poker card · 5: — · 6: draw 1 poker card", "2 LP"],
          ["3", "7: — · 8: draw 1 poker card · 9: —", "3 LP"]
        ]) + ul([
          "A player with a cube on this track is a <b>Wanted player</b>.",
          "On space 9, each further WP gives <b>1 LP</b> instead.",
          "You only gain a space’s reward when moving forward; that progress resets each time you are Arrested.",
          "You can’t leave the Wanted track unless you are Arrested or an effect allows it. A Wanted player <b>can’t gain Marshal points</b>.",
          "End of game: the most Wanted player gains <b>3 LP</b> and each other Wanted player gains <b>1 LP</b>. If the most Wanted is tied, every Wanted player gains 1 LP instead."
        ]) +
        "<h4>Gambler track</h4>" + tbl(["Space", "Reward"], [
          ["1", "$10 or draw 1 poker card"], ["2", "1 LP"], ["3", "$10 or draw 1 poker card"], ["4", "1 legendary token"],
          ["5", "$20 or draw 2 poker cards"], ["6", "2 LP"], ["7", "2 legendary tokens"], ["Each GP after 7", "2 legendary tokens"]
        ]) + ul([
          "Gain GP by winning poker (a winning active player may take 1 LP instead), winning faro, and winning a faro jackpot.",
          "The Gambler track is independent of the Marshal" + (c.lss ? ", Story" : "") + " and Wanted tracks.",
          "End of game: the player furthest along gains 1 LP (all tied players gain 1 LP)."
        ]),
      src: (c) => join(["Rules p.4 (board), 12, 30, 32, 35, 38, 41, 49–50", c.lss ? "" : "p.14"]) },

    /* ---------------------------------------------------------------- gambling */
    { id: "poker", title: "Gambling: poker, faro & high rollers", when: () => true,
      html: (c) => "<p><b>Gamble</b> is a location action from a space adjacent to a Saloon: choose <b>poker</b> or <b>faro</b>" + (c.v("hsp") ? " (or High Stakes Poker)" : "") + ".</p>" +
        "<h4>Poker</h4><ol>" + [
          "Pay <b>$10</b> to the pot and draw 1 poker card. Any player in the same town may buy in: $10 and 1 poker card.",
          "The house (Saloon) adds <b>$50</b> to the pot.",
          "If nobody joined, the player to your right is the <b>dealer</b>: they set their hand aside and draw <b>4</b> poker cards.",
          "<b>The flop:</b> reveal the top 3 cards of the poker deck. Each player makes a 5-card hand from those 3 and <b>exactly 2</b> cards from their hand (with only 1 card in hand, make the best 4-card hand).",
          "Everyone reveals at once and names their hand. Best hand wins."
        ].map(x => "<li>" + x + "</li>").join("") + "</ol>" +
        ul([
          "<b>Ties:</b> the dealer wins ties against the active player. Between players, the active player wins ties. If the active player isn’t among the tied players, they split the pot as evenly as possible; the remainder goes to the supply.",
          "<b>Winner</b> takes the pot plus any item or ability rewards. Active player: gain <b>1 GP or 1 LP</b>. Any other winner: gain 1 GP.",
          "<b>Losing players</b> draw 1 poker card. If the dealer wins, the active player draws 1 poker card.",
          "Place all revealed cards in the discard pile."
        ]) +
        "<h4>Poker hands, best first</h4>" + tbl(["Hand", "Made of"], [
          ["Five of a Kind", "4 cards of the same value and the Cheat poker card"],
          ["Royal Flush", "A–10 of the same suit"],
          ["Straight Flush", "5 cards in sequence of the same suit"],
          ["Four of a Kind", "4 cards of the same value"],
          ["Full House", "2 cards of one value and 3 cards of another value"],
          ["Flush", "5 cards of the same suit"],
          ["Straight", "5 cards in sequence"],
          ["Three of a Kind", "3 cards of the same value"],
          ["Two Pair", "2 cards of one value and 2 cards of another value"],
          ["Pair", "2 cards of one value"],
          ["High Card", "Highest value card in hand"]
        ]) +
        "<h4>Faro</h4><ol>" + [
          "All players in the same town may join. If anyone joins, the active player gains <b>$10</b>.",
          "<b>Dealer:</b> the non-playing player closest to the active player’s right. If everyone plays, the active player deals.",
          "<b>Reveal:</b> the dealer draws the top 4 fight cards and reveals the first 3; the 4th stays facedown.",
          "<b>Bet:</b> in clockwise order, the active player betting last, each player places 1 or 2 <b>bet markers</b> on the faro board, each on its $10 or $20 side. Never 2 on the same value, and your bets can’t total more than the money you have.",
          "<b>Loser:</b> the dealer shuffles the 4 cards facedown, offers the active player a cut, and reveals the top card. Bets on that value lose: pay the marker’s value to the supply.",
          "<b>Winner:</b> the next card wins. Bets on it pay <b>1:1</b> and gain 1 GP. Then each player with a marker still out decides to take it back or stay for the jackpot.",
          "<b>Jackpot:</b> the next card. Bets on it pay <b>3:1</b> and gain 1 GP. Shuffle the fight cards used and put them on the bottom of the fight deck."
        ].map(x => "<li>" + x + "</li>").join("") + "</ol>" +
        "<p class=\"note\">Two details differ between the Faro entry (p.30) and the faro chart (p.58). Who decides first about the jackpot: “to the right” (p.30) or “to the left” of the active player (p.58). Markers left on the board after the jackpot: just claimed (p.30), or they lose and pay their value (p.58).</p>" +
        "<h4>High rollers & the Challenge action</h4>" + ul([
          "High roller tokens spawn on a <b>Saloon icon</b>, ignoring the rules for occupied spaces.",
          "<b>Challenge</b> (from a space adjacent to that Saloon): play poker against the high roller. Ante <b>$20</b>; neither the high roller nor the Saloon adds to the pot, and no other player may join.",
          "The dealer draws as many poker cards as the number on top of the token. High rollers win ties.",
          "Win: the token’s reward, plus the normal poker rewards and any card rewards. The high roller is removed either way."
        ]),
      src: (c) => join(["Rules p.28, 30–32, 34, 41", c.v("hsp") ? "p.16" : "", "App. III p.57–58"]) },

    { id: "pokercards", title: "Poker cards & hand size", when: () => true,
      html: (c) => ul([
          "Poker cards give you <b>ACTION</b>, <b>Bonus</b> and <b>Reaction</b> effects; their values settle fights; and they are your hand at the Saloon.",
          "Maximum hand size: <b>5</b>, minus 1 for each wound you have at the end of your turn (shown on the wound track). You discard down only in your End of Turn Phase.",
          "Discarded poker cards go to a discard pile next to the poker deck. When the deck runs out, shuffle the discards to form a new deck and keep drawing.",
          c.v("altpoker") ? "Your deck uses the alternate expansion cards (same suits and values as the base cards they replaced)." : "",
          c.mode !== "std" && WL.modeInfo[c.mode].poker ? c.modeName + " swaps in: " + WL.modeInfo[c.mode].poker.add.map(WL.suit).join(", ") + "." : "",
          c.v("joker") ? "Two <b>Jokers</b> are wild; see “Joker Card variant”." : ""
        ]),
      src: (c) => join(["Rules p.41, 50", c.v("altpoker") ? "p.3" : "", c.mode !== "std" ? WL.modeInfo[c.mode].srcPoker : "", c.v("joker") ? "p.16" : ""]) },

    /* ---------------------------------------------------------------- cattle */
    { id: "cattle", title: "Cattle: Acquire, Wrangle, Rustle & longhorns", when: () => true,
      html: (c) => "<h4>Acquire (Ranch)</h4>" + ul([
          "If you aren’t carrying a cattle token, take 1 at random, facedown, from that Ranch’s tokens. Keep it on your mat until you deliver it.",
          "Each Ranch has an identical set of 8 cattle tokens, each with a reward on its back. You may look at your own token’s reward at any time.",
          "You can carry only <b>1 cattle token</b> unless an effect allows more. If you ever have too many, choose which to discard (no reward); discarded tokens return to the Ranch of their colour."
        ]) +
        "<h4>Delivering cattle (optional, free, after you end a Move action)</h4>" + tbl(["Where you end", "Deliver", "Gain"], [
          ["<b>Rail Station</b>: Wrangle", "Each of your cattle tokens", "1 Marshal point + the token’s reward"],
          ["<b>Ranch</b>" + (c.has("au") ? " or <b>Outlaw Camp</b>" : "") + ": Rustle", "Each cattle token that <b>doesn’t match</b> the Ranch’s colour", "1 Wanted point + the token’s reward"]
        ]) + ul(["Delivering is your choice: you <b>may</b> wrangle or rustle, but you never have to.", "A delivered token is shuffled back in with the tokens at the Ranch of its colour."]) +
        "<h4>Longhorn tokens</h4>" + ul([
          "Longhorns are a special cattle token that appear through events and game effects.",
          "Get them by taking an action in their space; automatically from a frontier token reward; or by successfully Robbing a player who has one.",
          "Carry <b>any number</b>, separately from your cattle token. Each one <b>reduces your movement by 1</b> (minimum 1).",
          "You may deliver them for free when you end your movement at a Ranch" + (c.has("au") ? ", Rail Station or the Outlaw Camp" : " or Rail Station") + ": <b>1 LP and $30</b> per longhorn.",
          "Delivering longhorns gives no Marshal or Wanted points."
        ]),
      src: "Rules p.26, 28, 37, 45, 51" },

    /* ---------------------------------------------------------------- mining */
    { id: "mining", title: "Mining & gold nuggets", when: () => true,
      html: (c) => "<h4>Prospect for Gold (Mine)</h4>" + ul([
          "Spend an action to roll the <b>mining dice</b> and gain the results."
        ]) +
        "<h4>Mining die faces</h4>" + tbl(["Face", "Result"], [
          [ic("die-gold-nugget", "Gold Nugget") + " <b>Gold Nugget</b>", "Gain 1 gold nugget"],
          [ic("die-gold-dust", "Gold Dust") + " <b>Gold Dust</b>", "Gain $10 and reroll that die, gaining the new result (it can be Gold Dust again)"],
          [ic("die-gravel", "Gravel") + " <b>Gravel</b>", "Gain nothing"],
          [ic("die-tailings", "Tailings") + " <b>Tailings</b>", "Gain $10"]
        ]) +
        "<h4>Gold nuggets</h4>" + ul([
          "You can hold at most <b>4</b>. Any you gain beyond that go back to the supply.",
          "If you end your movement on a space with a gold nugget, take it if you can; otherwise it stays.",
          "Nuggets on the board (from events) aren’t event tokens and don’t occupy their space.",
          c.bt ? "<b>Who Runs Border Town?:</b> no Bank, so no Deposit. Gold nuggets can be spent like money at <b>$20 each</b> (for example faro wagers, buying items and the Improvement action); they don’t count toward the $120 limit. Each nugget you hold at the end is worth <b>1 LP</b>." : "Sell them at the Bank with <b>Deposit</b>: $20 and 1 LP each."
        ]),
      src: (c) => join(["Rules p.29–30, 33, 38–39, 42", c.bt ? "p.23, 25" : ""]) },

    /* ---------------------------------------------------------------- items */
    { id: "items", title: (c) => c.noTrader ? "Items & stores" : "Items, stores & the Traveling Trader", when: () => true,
      html: (c) => "<h4>Item cards</h4>" + ul([
          "Three types: <b>miscellaneous</b>, <b>mount</b> and <b>weapon</b>. You can’t own more than one copy of the same item.",
          "<b>Miscellaneous</b>: up to 3 at a time, on the 3 spaces at the top of your mat. With 3, you can’t buy or gain another until a space frees up (an item discarded by its own effect, some goal cards, or gaining a Legendary item). They share a card back and can’t be upgraded.",
          "<b>Mounts</b> set your movement; <b>weapons</b> help in fights. You can own several of each, stacked on your mat; the card on top of each stack is the active one.",
          "Discarded items go back to the stand they came from."
        ]) +
        "<h4>Purchase/Upgrade (General Store" + (c.has("au") ? " or Trading Post" : "") + ")</h4>" + ul([
          "From a space adjacent to the store, take one action to spend money <b>purchasing items and upgrading items you own</b>, paying each card’s printed cost. A miscellaneous item needs a free slot on your mat.",
          "A new mount or weapon may become your active one at once. That is the only way to change them outside your Start of Turn Phase.",
          "<b>Upgrade:</b> pay the cost again and flip the card to its upgraded side. Only items available from the store you are at can be upgraded there. You can buy and upgrade the same item in one action.",
          "Upgraded mounts and weapons score the LP in their top left corner at the end of the game.",
          c.bt ? "Who Runs Border Town?: every item in both stands is available from the Buzzard Gulch Trading Post (the General Store locations are on the covered main board)." : "Every item in the General Store stand is available from either General Store location." + (c.has("au") ? " Trading Post items are only available at the Trading Post." : "")
        ]) +
        (c.noTrader ? "<h4>No Traveling Trader</h4>" + ul([
          c.modeName + " doesn’t use the Traveling Trader.",
          c.mode === "serenade" ? "Legendary items <b>can’t be purchased</b>; they must be gained through game effects." : "",
          c.bt ? "The General Store and Trading Post stands count as <b>one store</b> for Purchase/Upgrade." : ""
        ]) : "<h4>Trader (region action)</h4>" + ul([
          "Anywhere in the Traveling Trader’s current region: buy any of its items at their printed cost" + (c.legItems ? ", and revealed <b>Legendary items for $40 each</b> (you may buy several)" : "") + ". Its items (those left over after the stores were dealt) are only available from the Traveling Trader.",
          "At the Traveling Trader you may upgrade <b>any</b> of your mounts and weapons, wherever they were bought.",
          c.legItems ? "When a Legendary item is bought, refill its space from the Legendary item deck so 3 are always available." : "",
          "After your Trader action, the Trader moves: reveal the top trader movement card and move the miniature to that region; the card goes faceup on the discard pile. Reshuffle the discards when the deck is empty."
        ])) +
        (c.legItems ? "<h4>Legendary items</h4>" + ul([
          "Unique, iconic items. They follow all the item rules, can’t be upgraded, and count as miscellaneous unless they say otherwise.",
          c.noTrader ? "Gain them through card and token effects." : "Gain them through card and token effects, or buy them from the Traveling Trader.",
          "Some score LP at the end of the game (top left corner)."
        ]) : "") +
        "<p class=\"note\">The Western Legends playmat marks the General Store with a horseshoe icon instead of the barrel. Either way, “General Store” means the locations in Darkrock and Red Falls.</p>",
      src: (c) => join(["Rules p.12, 32, 34–35, 42, 47–49, 53", c.mode === "serenade" ? "p.19" : "", c.bt ? "p.24" : ""]) },

    /* ---------------------------------------------------------------- deeds */
    { id: "deeds", title: (c) => c.noDeeds ? "Ruins & Repair" : "Deeds, ruins & Repair", when: () => true,
      html: (c) => (c.noDeeds ? "<p class=\"note\">" + c.modeName + " doesn’t use deed cards.</p>" : "<h4>Claim</h4>" + ul(["At a location with an available deed card, pay the cost at the top of the card and place it faceup in front of you."]) +
        "<h4>Deed cards</h4>" + ul([
          "Each deed has a <b>one-time action ability</b>: spend an action to use it, then flip it to its scoring side. It can’t be used again.",
          "At the end of the game, flip any unused deeds to their scoring side and score them.",
          "A deed for a location with a <b>ruin token</b> can’t be used for its action and doesn’t count toward scoring in any way."
        ])) +
        "<h4>Ruins & Repair</h4>" + ul([
          "Some effects, such as story card results, destroy a location: place a " + ic("ruin-token", "Ruin token") + " <b>ruin token</b> on it. Its only action is now <b>Repair</b>.",
          "Repair: take the action, then discard 1 poker card. Remove the ruin token and gain <b>2 Story points</b>.",
          "For a General Store, Saloon" + (c.has("au") ? " or Trading Post" : "") + ", you repair from a space adjacent to it."
        ]) +
        (c.lss ? "" : "<p class=\"note\">" + (c.csc ? "Core Story Card variant" : "Without Blood Money’s Legendary Story System") + ": there is no Story track (it runs along the story board overlay, p.47" + (c.csc ? ", which this variant removes, p.14" : "") + "), so the 2 Story points from Repair have nowhere to go. The book doesn’t say what replaces them.</p>"),
      src: (c) => join(["Rules p.12, 29, 44–45", c.lss ? "" : (c.csc ? "p.14, 47" : "p.47"), c.noDeeds ? WL.modeInfo[c.mode].srcShort : ""]) },

    /* ---------------------------------------------------------------- wounds */
    { id: "wounds", title: (c) => c.noInjury ? "Wounds" : "Wounds & injuries", when: () => true,
      html: (c) => "<h4>Wounds</h4>" + ul([
          "Track wounds with the wound token on your mat. Gaining wounds moves it right; losing them moves it left.",
          "Your <b>maximum hand size</b> is the number above your current wound space, checked in your End of Turn Phase.",
          "At the end of the game you lose LP equal to your wound level (the negative number below the track).",
          c.noInjury ? "Your wound limit is usually <b>3</b>." : "Gaining a wound beyond your limit (usually <b>3</b>) gives you an <b>injury</b> card."
        ]) +
        (c.noInjury ? "<p class=\"note\">The Golden Rule doesn’t use injury cards. The book doesn’t say what happens instead when you would gain one.</p>" :
        "<h4>Injuries</h4>" + ul([
          "Draw 1 injury card, reveal it, resolve its text and keep it by your mat. Its effect may be immediate, ongoing or both.",
          "You can have only <b>1 injury</b>. If you gain wounds while you have one, discard <b>1 poker card per wound</b> instead.",
          "To discard an injury you must lose <b>all</b> your wounds (" + (c.bt ? "Recuperate at your Homestead" : "Heal") + " does this). It is shuffled back into the injury deck.",
          "Injuries aren’t wounds. Some cost LP at the end of the game, as printed at the bottom of the card."
        ])),
      src: (c) => join(["Rules p.33–34, 50", c.noInjury ? "p.20" : "", c.bt ? "p.23" : ""]) },

    /* ---------------------------------------------------------------- events */
    { id: "events", title: "Events & event tokens", when: () => true,
      html: (c) => ul([
          "The first time any player’s cube enters or passes a space with an <b>event marker</b> on any track, that player reveals the top event card and resolves it. The marker then goes back to the box.",
          "Events often place <b>event tokens</b>: claim jumpers, high rollers, longhorns and outlaws" + (c.v("unique") ? ", plus Unique event tokens" : "") + ". A token placed by any other means is still an event token.",
          "An event token is only placed if its space is <b>unoccupied</b>. High rollers are the exception: they go on the Saloon icon and ignore the occupied-space rules (p.34).",
          "Gold nuggets placed by events aren’t event tokens and don’t occupy their space.",
          c.mode !== "std" ? "<b>" + c.modeName + " — event deck:</b> " + WL.modeInfo[c.mode].events : "",
          c.bt ? "Event text that names a space or region on the Western Legends board uses the Buzzard Gulch equivalent; if several qualify, the active player chooses." : ""
        ]),
      src: (c) => join(["Rules p.30, 34, 37, 40", c.v("unique") ? "p.6" : "", c.mode !== "std" ? WL.modeInfo[c.mode].srcEvents : ""]) },

    /* ---------------------------------------------------------------- Frontier */
    { id: "frontier", title: "The Frontier", when: (c) => c.has("au"),
      html: () => ul([
          "Frontier spaces are the unexplored land around Buzzard Gulch: a <b>green ring</b> with a number from 6 to 8. Each starts with a frontier token, number faceup.",
          "<b>Frontier action</b> (in a Frontier space with a frontier token): discard poker cards whose total value is <b>at least the token’s number plus the space’s number</b>.",
          "Values when discarding: 2–10 at face value; Jack, Queen and King count <b>10</b>; Ace counts <b>11</b>.",
          "Flip the token and gain the reward on its back. A longhorn won this way is gained automatically, with no action."
        ]),
      src: "Rules p.31, 37" },

    /* ---------------------------------------------------------------- train */
    { id: "train", title: "The Train", when: () => true,
      html: (c) => c.bt ? ul([
          "The Train moves as the <b>very first step</b> of every player’s Start of Turn Phase, to the next checkpoint. Place the <b>front</b> of the train miniature in the checkpoint space.",
          "For that player’s turn the Train is a <b>location</b> in that space: Heist and Work are available there.",
          "It doesn’t block NPC placement, and it doesn’t occupy its space."
        ]) + "<h4>Who Runs Border Town?: 3 checkpoints</h4><ol><li>Buzzard Gulch Rail Station (where it starts)</li><li>Mountain Pass A</li><li>Mountain Pass C</li></ol>" +
        ul(["Then back to the Buzzard Gulch Rail Station. All other Train rules are unchanged."]) : ul([
          "The Train moves as the <b>very first step</b> of every player’s Start of Turn Phase, to the next checkpoint. Place the <b>front</b> of the train miniature in the checkpoint space.",
          "For that player’s turn the Train is a <b>location</b> in that space: Heist and Work are available there.",
          "It doesn’t block NPC placement, and it doesn’t occupy its space."
        ]) +
        "<h4>Checkpoints, in order (from Spike’s View)</h4><ol>" + [
          "Spike’s View Rail Station", "Cliff Junction Bandit Hideout C", "Trailhead C in Buzzard Gulch", "Buzzard Gulch Rail Station",
          "Trailhead A in Buzzard Gulch", "Sunny Hills Bandit Hideout A (train board extension)", "Sunny Hills Bandit Hideout B (train board extension)",
          "Mesito’s Point Bandit Hideout A (train board extension)"
        ].map(x => "<li>" + x + "</li>").join("") + "</ol>" +
        ul([
          "After checkpoint 8 it returns to checkpoint 1.",
          "While the Train is on the <b>train board extension</b>, heist it from the matching Bandit Hideout on the main board."
        ]) +
        (c.has("au") ? "" : "<p class=\"note\">Checkpoints 3–5 are on the Buzzard Gulch board from Ante Up. The book gives no Train route without it.</p>"),
      src: (c) => join(["Rules p.8, 10, 40, 48", c.bt ? "p.25" : ""]) },

    /* ---------------------------------------------------------------- story systems */
    { id: "lss", title: "Legendary Story System: story cards, Story track, risk die", when: (c) => c.lss,
      html: (c) => "<h4>Legendary story cards</h4>" + ul([
          "Each card has <b>flavor text</b>, <b>game effects</b> (in force while it is the visible card on top of the deck: immediate, ongoing or both) and <b>2 or 3 conditions</b>.",
          "During your turn, when you meet one of the conditions, place 1 of your story discs on the legendary story board beside it and gain all the rewards listed.",
          "Once anyone has contributed to a condition, nobody else can contribute to it. You may contribute to the same card more than once. A card with only 2 conditions ignores the third space."
        ]) +
        "<h4>Completing a card (End of Turn Phase)</h4><ol>" + [
          "If all its conditions are met, the player who contributed last sets aside all the story discs, flips the card and reads the story text aloud.",
          "Everyone who contributed gains the reward, resolving the text on the back in order.",
          "Return the card to the box. If map tokens were used, shuffle them into a supply by the board. Everyone takes back their story discs.",
          "The active player reads the story text and any rules on the newly revealed card."
        ].map(x => "<li>" + x + "</li>").join("") + "</ol>" +
        "<h4>Story track</h4>" + tbl(["Space", "Effect when your cube enters it"], [
          ["1", "Start"], ["2", "Move the Sheriff up to 3 spaces"], ["3", "Spawn bandits at Bandit Hideouts A, B or C"],
          ["4", "Choose 1: gain 1 GP, 1 LP, 1 MP or 1 WP — then return your cube to space 1" + (c.mode === "risky" ? ". <b>Risky Business:</b> also gain 1 LP." : "")]
        ]) + ul([
          "Gain Story points (SP) by completing legendary story card conditions, rolling the risk die and Repairing a ruined location (2 SP). Some characters start with SP, and some characters and items give SP. Move 1 space per SP and resolve each new space you enter.",
          "The Story track has no end of game bonus."
        ]) +
        "<h4>Risk die</h4>" + ul([
          ic("risk-die", "Risk die") + " Once during your Action Phase, at any time except while resolving one of your actions.",
          "Announce it and choose a bonus: <b>draw 1 poker card</b>, <b>gain $10</b>, or <b>move 1</b> (not a Move action).",
          "Roll and resolve the result: Story points, wounds, or both. Then gain your bonus."
        ]) +
        "<h4>Map tokens</h4>" + ul([
          "A set of 3 tokens some legendary story cards use, placed facedown where the card says.",
          "Reveal one when told. The <b>danger X</b> token gives whoever revealed it 1 wound.",
          "Resolve the card’s text for the token revealed, then claim the token."
        ]),
      src: (c) => join(["Rules p.4 (board), 6, 9, 11, 36–37, 44, 47, 59", c.mode === "risky" ? "p.22" : ""]) },

    { id: "storycards", title: "Story cards (Core Story Card variant)", when: (c) => c.csc,
      html: (c) => ul([
          "Two piles of story cards sit on the board, <b>trigger side</b> faceup. Each card’s trigger is printed on its back.",
          c.mode !== "std" && WL.modeInfo[c.mode].story ? "<b>" + c.modeName + ":</b> only the cards with the trigger" + (WL.modeInfo[c.mode].story.length > 1 ? "s " : " ") + WL.modeInfo[c.mode].story.map(x => "“" + x + "”").join(" or ") + " are in play." : "",
          "During your turn, if you meet a trigger, you may place 1 story disc on the first available space of that card.",
          "Discs needed to resolve a card: <b>" + (c.p <= 4 ? "2" : "3") + "</b> with " + c.p + " players (2 discs with 2–4 players, 3 with 5–6).",
          "You may add only 1 disc to 1 story card per turn, and only on your own turn. If both cards share the trigger, choose one.",
          "If both your story discs are already on story cards and you would place another, you may move one of them to the triggered card."
        ]) +
        "<h4>Resolving (end of the turn of whoever placed the last disc)</h4><ol>" + [
          "Read the narrative text aloud.",
          "Everyone who contributed gains the reward, once each even if they placed several discs.",
          "Spawn bandits at the Bandit Hideouts shown. Not in an occupied space: no player, Sheriff or other bandit.",
          "If the Sheriff is active, that player moves him the number of spaces shown (0–6). This can trigger an arrest."
        ].map(x => "<li>" + x + "</li>").join("") + "</ol>",
      src: (c) => join(["Rules p.14, 46", c.mode !== "std" ? WL.modeInfo[c.mode].srcShort : ""]) },

    /* ---------------------------------------------------------------- tokens */
    { id: "legtokens", title: "Legendary tokens", when: () => true,
      html: (c) => ul([
          "Scored at the end of the game. Gain them through game effects, gambling (the Gambler track)" + (c.v("goal") ? " and goal cards" : "") + ".",
          "Draw them at random from the facedown supply. Keep them facedown on your mat; you may look at your own at any time.",
          "If you ever have more than <b>3</b>, return the excess of your choice to the supply.",
          c.has("au") ? "The 27 tokens: 3 worth 0 LP, 7 worth 1 LP, 10 worth 2 LP, 4 worth 3 LP and 3 worth 4 LP." : "Tokens are worth 0 to 4 LP."
        ]),
      src: (c) => join(["Rules p.32, 36", c.has("au") ? "p.15" : ""]) }
  ];

  /* Legends, items and Legendary items (Appendices V–VII) are added by js/data-legends.js. */
})();
