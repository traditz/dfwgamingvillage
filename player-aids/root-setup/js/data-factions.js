/* =============================================================================
   Root — Setup & Reference Utility · expansion factions (stage "factions")
   The nine expansion factions, from the Law of Root (Oct 2025) §10–18, checked against their Learning to Play books
   (Riverfolk p.2–5, Underworld p.2–5, Marauder p.2–11, Homeland p.2–15). The Law wins every conflict (Law p.2 §1.1.1).
     RT.factionRef[id]   = { title, html(c), src(c) }   rules reference section
     RT.factionTeach[id] = { h, body(c) }                teach insert (h names the faction: the harness checks it)
     RT.factionLater[id] = function (c) → "<li>…</li>"   the teach's "don't worry about these yet" items
     RT.coreExc[section] = [{ when(c), t, src }]         faction exceptions shown inside the core reference sections
                                                         (data-ref.js RT.core). Gated on c.human(id): bots follow their own
                                                         rules in the Law of Rootbotics, so the bots stage adds bot entries.
   Faction icons in the Law's margins (rendered, Law p.2 "Faction icons mark rules modified by Faction Rules and
   Abilities sections") were used to find every core rule an expansion faction changes: §1.2.1 (O), §2.1 (L, f),
   §2.1.1 (L, b), §2.1.3 (F), §2.2.1–2.2.2 (D, F), §2.3 (O, F), §2.5 (L), §3.2.2 (H, S), §3.3.3 (L), §4.1.1 (O, L),
   §4.1.2 (H, s), §4.2.1 (O, C, F, S), G.2 (D), G.5 (L, F), G.6 (F).
   ============================================================================= */

RT.todoFactions = [];   // every expansion faction is written below
RT.factionLater = RT.factionLater || {};

var RTH = function (id) { return function (c) { return c.human(id); }; };   // gate: this faction is played by a person

/* ---------- small shared bits ---------- */
RT.frogText = {          // Homeland p.7 "Common Interactions with the Frog Suit" (+ the Eyrie example, Homeland p.3)
  alliance: "You may spend frog supporters to Spread Sympathy and Revolt in clearings with enclaves; at a Peaceful enclave you may combine frog supporters with supporters of the clearing's printed suit. You cannot Revolt at a Militant enclave (your bases have no frog suit). Train by spending cards matching your bases' <i>clearings</i>, not their printed suits. When a base is removed, discard supporters matching the base's clearing (a fox clearing with a Peaceful enclave: foxes, frogs and birds; a Militant enclave: frogs and birds only).",
  eyrie: "A frog card in the Decree must be carried out in a frog clearing — a clearing with an enclave.",
  lizard: "You may reveal frog cards to Recruit and Build at enclaves — Build places a garden whose printed suit matches the clearing's printed suit. You cannot Build at a Militant enclave. Gardens of the Outcast suit still craft, but fulfil icons by their clearing: at a Militant enclave only a frog icon, at a Peaceful enclave the printed suit or frog.",
  riverfolk: "You may place trade posts at Peaceful enclaves (a trade post whose printed suit matches the clearing's printed suit), but not at Militant enclaves.",
  corvid: "You may spend a frog card to Recruit at every enclave.",
  keepers: "Recovering from a clearing with a Peaceful enclave, count the clearings you rule of matching printed suit <i>and</i> the clearings you rule with enclaves."
};
RT.frogNote = function (c, id) {
  if (!c.fac("diaspora")) return "";
  var t = RT.frogText[id];
  return t ? "<h4>With the Lilypad Diaspora (frog suit)</h4>" + RT.ul([t]) : "";
};

/* =====================================================================
   LIZARD CULT — Law p.11–12 §10 · Riverfolk p.2–3
   ===================================================================== */
RT.factionRef.lizard = { title: "Lizard Cult",
  html: function (c) {
    return "<p>The Cult builds <b>gardens</b> wherever it rules and scores by revealing and spending cards. Revealed cards come back to its hand in Evening unless spent to score. It moves and fights only with <b>acolytes</b> — warriors radicalized when Cult defenders are slaughtered.</p>" +
      "<h4>Abilities</h4>" + RT.ul([
        "<b>Crafting:</b> during <b>Evening</b>, by activating gardens whose <b>printed suit matches the Outcast</b>. (A garden fulfils an icon matching its <i>clearing</i>, whatever its printed suit — this matters with the Lost City or the Lilypad Diaspora.)",
        "<b>Hatred of Birds:</b> bird cards are <b>not wild</b> for Cult rituals.",
        "<b>Revenge:</b> whenever a Cult warrior is removed while <b>defending</b> in battle, place it in the <b>Acolytes</b> box instead of the supply.",
        "<b>Pilgrims:</b> the Cult rules every clearing where it has any garden. This overrides the Eyrie's Lords of the Forest.",
        "<b>Fear of the Faithful:</b> whenever a garden is removed, the Cult must discard a random card.",
        "<b>The Lost Souls pile:</b> whenever <b>any</b> card is spent or discarded — even a dominance card — it goes to the Lost Souls pile instead of the discard pile." +
          (c.fac("diaspora") ? " <i>Frog cards go to the Pond instead, not to Lost Souls.</i>" : "")
      ]) +
      "<h4>Birdsong (in order)</h4>" + RT.ol([
        "<b>Adjust Outcast:</b> look at the Lost Souls pile, ignoring birds. The suit with the <b>most</b> cards becomes the new Outcast — move the outcast marker to it, Outcast side up. If that suit was already the Outcast, flip the marker to <b>Hated</b>. If no single suit has the most, the marker stays and, if it isn't Hated, flips to Hated.",
        "<b>Discard Lost Souls:</b> move every card in the Lost Souls pile to the discard pile. (Dominance cards there become available to take.)",
        "<b>Perform Conspiracies:</b> spend acolytes (back to your supply) to act in clearings matching the Outcast, in any order and number. If the Outcast is <b>Hated</b>, each costs <b>one fewer</b> acolyte." + RT.ul([
          "<b>Crusade (2):</b> battle in an Outcast clearing, <i>or</i> move at least one warrior from an Outcast clearing and then, if you wish, battle in the destination.",
          "<b>Convert (2):</b> replace an enemy warrior in an Outcast clearing with a Cult warrior (you must be able to remove the old piece and place the new one).",
          "<b>Sanctify (3):</b> replace an enemy building in an Outcast clearing with a garden of the Outcast suit."])
      ]) +
      "<h4>Daylight</h4><p>Reveal any number of cards into your play area and perform <b>one ritual per card</b>, in any order and number. Revealed cards can't be used for anything else during Daylight; birds aren't wild for rituals.</p>" + RT.ul([
        "<b>Build:</b> in a clearing you rule matching the card, place a garden whose printed suit matches the clearing.",
        "<b>Recruit:</b> place a warrior in a clearing matching the card.",
        "<b>Score:</b> spend the revealed card (into Lost Souls) to score the points above the <b>rightmost empty space</b> of that suit's Gardens track. Not allowed if no gardens of that suit are on the map; <b>once per turn per suit</b>.",
        "<b>Sacrifice:</b> reveal a <b>bird</b> card to place a warrior in the Acolytes box."
      ]) +
      "<h4>Evening (in order)</h4>" + RT.ol([
        "<b>Return</b> all cards you revealed this turn to your hand.",
        "<b>Craft</b> with gardens whose printed suit matches the Outcast.",
        "<b>Draw</b> one card plus one per uncovered draw bonus; discard down to five."
      ]) + RT.frogNote(c, "lizard");
  },
  src: function (c) { return RT.join(["Law p.11–12 §10", "Riverfolk p.2–3", c.fac("diaspora") ? "Law p.19 §16.2.3 · Homeland p.7" : ""]); } };

RT.factionTeach.lizard = { h: "The Lizard Cult",
  body: function () {
    return "<p>The <b>Lizard Cult</b> hardly spends cards at all. In Daylight they <b>reveal</b> cards to build gardens where they rule, recruit, or — by actually spending a card — score for their gardens of that suit; revealed cards go back to their hand in Evening. Birds aren't wild for them. " +
      "Here's what affects all of us: while the Cult is in play, every card any of us spends or discards goes onto their <b>Lost Souls</b> pile, and its most common suit becomes their <b>Outcast</b>. They only move and fight by spending <b>acolytes</b> — warriors they gain when we kill their defenders, or by revealing a bird card to Sacrifice — in Outcast clearings: to crusade, to convert our warriors, or to turn our buildings into gardens. And they rule any clearing with a garden, ties or not.</p>";
  } };
RT.factionLater.lizard = function () { return "<li><b>The Hated Outcast</b> — when the same suit stays the Outcast, the Cult's conspiracies get one acolyte cheaper.</li>"; };

/* =====================================================================
   RIVERFOLK COMPANY — Law p.12–13 §11 · Riverfolk p.4–5
   ===================================================================== */
RT.factionRef.riverfolk = { title: "Riverfolk Company",
  html: function (c) {
    return "<p>The Riverfolk <b>sell services</b> to everyone else. Payments become their <b>funds</b>; they spend funds on <b>trade posts</b> along the river, which score, and score <b>dividends</b> on a big treasury — an easy target.</p>" +
      "<h4>Abilities</h4>" + RT.ul([
        "<b>Crafting:</b> during Daylight, by committing funds to empty spaces on the <b>Trade Posts tracks</b>. (They have no crafting pieces.)",
        "<b>Swimmers:</b> they treat rivers as paths and may move along a river fully linking two clearings <b>ignoring rule</b>. (They can still move along paths.)",
        "<b>Public Hand:</b> their hand sits face up above their board. If a random card is taken from them, flip the hand face down, shuffle, draw, then flip it face up again.",
        "<b>Funds</b> are the warriors (of any faction) in the Funds box. <b>Commit</b> a fund: move it to the Committed box. <b>Spend</b> a fund: return it to its owner's supply.",
        "<b>Trade Posts</b> score when placed. <b>Trade Disruption:</b> whenever a trade post is removed, remove <b>half your funds, rounded up</b>, and remove that trade post from the game permanently — it can't be rebuilt."
      ]) +
      "<h4>Buying services (other players)</h4>" + RT.ul([
        "At the <b>start of their Birdsong</b>, another player may buy services: <b>one</b>, plus <b>one per clearing</b> with a trade post and their faction pieces.",
        "<b>Cost:</b> the buyer places warriors from their supply in the Riverfolk's <b>Payments</b> box equal to the price on that service's track.",
        c.vbH ? "<b>The Vagabond</b> pays by exhausting items: for each item he exhausts, the Riverfolk place one Riverfolk warrior in Payments." : "",
        "<b>Hand Card:</b> the buyer takes any card from the Riverfolk's hand (buyable several times, given enough trade posts).",
        "<b>Riverboats:</b> the buyer treats rivers as paths until the end of their turn.",
        "<b>Mercenaries:</b> during Daylight and Evening of this turn, except when battling the Riverfolk, the buyer treats Riverfolk warriors as their own <b>for rule and for battle</b>. They can't move them, count them for dominance, or remove them except by taking hits. Mercenaries aren't enemy pieces but stay Riverfolk faction pieces (no Field Hospitals for them, no counting them for the Duchy's Sway, and so on)." + RT.ul([
          "<b>Taking hits:</b> the buyer splits hits, taking the odd hits by removing their own (not Riverfolk) warriors, if any; their own buildings or tokens are hit only if they have no warriors (Riverfolk included) in the clearing.",
          c.vbH ? "<b>Vagabond:</b> he can't buy Mercenaries. If Mercenaries are removed in a battle against him, he doesn't become Hostile with the Riverfolk." : ""])
      ]) +
      "<h4>Birdsong (in order)</h4>" + RT.ol([
        "<b>Protectionism:</b> if the Payments box is empty, place two warriors in it.",
        "<b>Score Dividends:</b> if any trade posts are on the map, score <b>1 point per two funds</b> (not counting Payments or Committed).",
        "<b>Gather Funds:</b> move every warrior on your faction board to the Funds box."
      ]) +
      "<h4>Daylight</h4><p>Commit and spend funds, in any order and number:</p>" + RT.ul([
        "<b>Move</b> — commit 1. <b>Battle</b> — commit 1. <b>Draw</b> a card — commit 1.",
        "<b>Craft</b> — commit funds by placing them on empty Trade Posts track spaces matching the suits of the crafting cost (not in Committed). <b>Export:</b> you may ignore the card's benefit, discarding it, to place one Riverfolk warrior in Payments.",
        "<b>Recruit</b> — spend 1: place a warrior in any clearing with a river.",
        "<b>Establish Trade Post with Garrison</b> — spend 2: choose any clearing <b>without a trade post that some player rules</b>; spend two funds <b>of the player who rules it</b>; place the matching trade post and one warrior there and score the points uncovered."
      ]) +
      "<h4>Evening (in order)</h4>" + RT.ol([
        "<b>Discard</b> down to five cards. (There's no Evening draw — draw with the Daylight Draw action.)",
        "<b>Set Costs:</b> you may move each service marker to any space on its track."
      ]) + RT.frogNote(c, "riverfolk");
  },
  src: function (c) { return RT.join(["Law p.12–13 §11", "Riverfolk p.4–5", c.fac("diaspora") ? "Homeland p.7" : ""]); } };

RT.factionTeach.riverfolk = { h: "The Riverfolk Company",
  body: function (c) {
    return "<p>The <b>Riverfolk Company</b> runs a shop. Their hand is <b>face up</b>, and at the start of each of our Birdsongs we can <b>buy services</b> by paying warriors from our supply into their Payments box: take a card from their hand, use rivers as paths this turn, or hire their warriors as <b>mercenaries</b> for rule and battle. You can buy one service, plus one per clearing where you have pieces and they have a trade post. " +
      (c.vbH ? "(The Vagabond pays by exhausting items instead: for each item he exhausts, the Riverfolk put one of their own warriors in Payments. He can't hire mercenaries.) " : "") +
      "Those payments become their <b>funds</b>: they commit funds to move, battle, draw and craft, and spend them to recruit and set up <b>trade posts</b>, which score. Each Birdsong with a trade post on the map they score a point for every two funds — so hitting their trade posts, which costs them half their funds, keeps them honest. They swim along rivers ignoring rule.</p>";
  } };
RT.factionLater.riverfolk = function () { return "<li><b>Mercenaries in battle</b> — how a buyer splits hits between their own warriors and the hired ones.</li>"; };

/* =====================================================================
   UNDERGROUND DUCHY — Law p.13–14 §12 · Underworld p.2–3
   ===================================================================== */
RT.duchyMinisters = [
  ["Foremole", "Reveal any card to place a citadel or market in any clearing you rule, matching or not."],
  ["Captain", "Initiate a battle."],
  ["Marshal", "Take a move."],
  ["Brigadier", "Take up to two moves, or initiate up to two battles."],
  ["Banker", "Spend any number of cards (even one) of the same suit to score that many points."],
  ["Mayor", "Take the action of any swayed noble or squire."],
  ["Duchess of Mud", "Score 2 points if all three tunnels are on the map."],
  ["Baron of Dirt", "Score 1 point per market on the map."],
  ["Earl of Stone", "Score 1 point per citadel on the map."]
];
RT.factionRef.duchy = { title: "Underground Duchy",
  html: function (c) {
    return "<p>The Duchy tunnels up from the <b>Burrow</b>, builds <b>citadels and markets</b>, and <b>sways ministers</b> by revealing cards where it has pieces — each minister scores and adds an action. Lose a building and the Duke's patience runs out.</p>" +
      "<h4>Abilities</h4>" + RT.ul([
        "<b>Crafting:</b> during <b>Evening</b>, by activating citadels and markets (identical for crafting).",
        "<b>The Burrow:</b> an <b>unsuited clearing</b> adjacent to every clearing with a tunnel. It's off the map with no building slots. Non-Duchy pieces can't be placed in or moved into it. The Duchy always rules it, even with no pieces there.",
        "<b>The Price of Failure:</b> whenever any number of Duchy buildings are removed, return your swayed minister of <b>highest rank</b> (lord, then noble, then squire — you choose among ties) to the Unswayed Ministers pile, <b>remove its crown from the game permanently</b>, then discard a random card.",
        "<b>Tunnels:</b> you have three. If told to place one while all three are on the map, you may first remove any tunnel."
      ]) +
      "<h4>Birdsong</h4>" + RT.ul(["Place <b>one warrior</b>, plus one per warrior icon showing (uncovered on your Citadels track), in the <b>Burrow</b>."]) +
      "<h4>Daylight (in order)</h4>" + RT.ol([
        "<b>Assembly — up to two actions</b>, in any order and number:" + RT.ul([
          "<b>Build:</b> reveal a card to place a citadel or market in a matching clearing you rule.",
          "<b>Recruit:</b> place one warrior in the Burrow.",
          "<b>Move:</b> take a move. <b>Battle:</b> initiate a battle.",
          "<b>Dig:</b> spend a card to place a tunnel in a matching clearing without one, then move up to four warriors (at least one) from the Burrow into it. (All three tunnels out? You may remove one first.)"]),
        "<b>Parliament:</b> take the action of each swayed minister once, in any order (table below).",
        "<b>Sway</b> one minister:" + RT.ol([
          "Choose a minister in your Unswayed Ministers pile. You need a <b>crown</b> on your board of that minister's rank (squire, noble or lord).",
          "<b>Reveal</b> the number of cards listed on it — a squire needs <b>2</b>, a noble <b>3</b>, a lord <b>4</b>. Each card must match a clearing holding a Duchy piece, and each such clearing lets you reveal only one card.",
          "Put the minister above your board, place a crown of its rank on it, and <b>score</b> the points uncovered on your board."])
      ]) +
      "<h4>Evening (in order)</h4>" + RT.ol([
        "<b>Discard</b> any bird cards you revealed this turn; return all other revealed cards to your hand.",
        "<b>Craft</b> with citadels and markets.",
        "<b>Draw</b> one card plus one per card-draw icon showing; discard down to five."
      ]) +
      "<h4>Ministers</h4><table class='rt'><thead><tr><th>Minister</th><th>Parliament action</th></tr></thead><tbody>" +
      RT.duchyMinisters.map(function (m) { return "<tr><td>" + m[0] + "</td><td>" + m[1] + "</td></tr>"; }).join("") + "</tbody></table>" +
      "<p class='inline-note'>Each minister card shows its rank; the Underworld guide pictures the Captain and Foremole as squires. The guide also lets you simply remove a crown from the game when you sway, instead of placing it on the card.</p>" +
      (c.hire ? RT.ul(["<b>Hirelings</b> aren't Duchy pieces: they don't count toward the clearings that let you reveal cards to Sway."]) : "");
  },
  src: function (c) { return RT.join(["Law p.13–14 §12", "Underworld p.2–3", c.hire ? "Law p.26 §H.3.3 · Marauder p.16" : ""]); } };

RT.factionTeach.duchy = { h: "The Underground Duchy",
  body: function () {
    return "<p>The <b>Underground Duchy</b> live in the <b>Burrow</b> — a clearing off the map that's adjacent to every clearing with one of their tunnels, and only they can go there. Each Daylight they take <b>two actions</b> — build citadels and markets, recruit, move, battle, or dig a new tunnel and pour warriors out of it — then one action for each <b>minister</b> they've swayed. " +
      "To sway a minister they reveal cards matching clearings where they have pieces; it scores, and the more powerful ministers need more cards. The catch: whenever any of us removes one of their buildings, their best minister quits, its crown leaves the game, and they discard a random card.</p>";
  } };
RT.factionLater.duchy = function () { return "<li><b>The nine ministers' powers</b> — each one is printed on its minister card.</li>"; };

/* =====================================================================
   CORVID CONSPIRACY — Law p.14–15 §13 · Underworld p.4–5
   ===================================================================== */
RT.factionRef.corvid = { title: "Corvid Conspiracy",
  html: function (c) {
    return "<p>The Corvids hide <b>plots</b> around the Woodland and score each time they flip one — more for every plot already face up. They must recruit carefully and dodge <b>exposure</b>.</p>" +
      "<h4>Abilities</h4>" + RT.ul([
        "<b>Crafting:</b> during <b>Birdsong</b>, by activating plot tokens, face up or face down.",
        "<b>Plot tokens:</b> eight, two each of bomb, snare, extortion and raid. Face down (feather) in your supply; on the map, face up (its icon) or face down. You may inspect your face-down plots at any time. <b>One plot per clearing.</b>",
        "<b>Nimble:</b> the Corvids move regardless of who rules the origin or destination.",
        "<b>Exposure:</b> any number of times on their turn, an enemy with faction pieces in a clearing with a <b>face-down</b> plot may show the Corvids a card matching that clearing and guess the plot's type. Wrong: the Corvids say “no” and take that card. Right: the enemy removes the plot (scoring a point) — an exposed Raid places no warriors. (Not once the enemy has begun the last step of their turn.)",
        "<b>Embedded Agents:</b> as <b>defender</b>, if a face-down Corvid plot is in the clearing of battle, the Corvids deal an extra hit — even if defenseless."
      ]) +
      "<h4>Birdsong (in order)</h4>" + RT.ol([
        "<b>Craft</b> with plot tokens (face up or down).",
        "<b>Flip Plots:</b> any number of times, flip a plot face up in a clearing with any Corvid warriors, score <b>1 point per face-up plot on the map</b> (including this one), then resolve its flip effect if it's a bomb or extortion.",
        "<b>Recruit</b> (once per turn): spend any card to place one warrior in <b>each</b> matching clearing. (A bird: choose one suit.)"
      ]) +
      "<h4>Daylight — up to three actions</h4>" + RT.ul([
        "<b>Move:</b> take a move. <b>Battle:</b> initiate a battle.",
        "<b>Plot:</b> remove one Corvid warrior, plus one more per plot you've already placed this turn, from a clearing with no plot token, and place a face-down plot there. (The warriors come from that clearing.)",
        "<b>Trick:</b> swap two plot tokens on the map — both face up or both face down."
      ]) +
      "<h4>Evening (in order)</h4>" + RT.ol([
        "<b>Exert:</b> you may take one more Daylight action if you choose not to draw cards this Evening.",
        "<b>Draw</b> one card plus one per face-up extortion on the map; discard down to five."
      ]) +
      "<h4>Plot tokens</h4><table class='rt'><thead><tr><th>Plot</th><th>Effect</th></tr></thead><tbody>" +
      "<tr><td>Bomb</td><td>When flipped, remove all enemy pieces in its clearing, then remove the bomb.</td></tr>" +
      "<tr><td>Snare</td><td>While face up, enemy pieces can't be placed in or moved from its clearing." + (c.vbH ? " (The Vagabond's Slip ignores this.)" : "") + "</td></tr>" +
      "<tr><td>Extortion</td><td>When flipped, take a random card from each enemy with faction pieces in its clearing. While face up, draw another card in Evening.</td></tr>" +
      "<tr><td>Raid</td><td>Whenever removed (face up or down), place one warrior in each adjacent clearing — but not if removed by Exposure.</td></tr></tbody></table>" +
      RT.frogNote(c, "corvid");
  },
  src: function (c) { return RT.join(["Law p.14–15 §13", "Underworld p.4–5", c.vbH ? "Law p.10 §9.4.2" : "", c.fac("diaspora") ? "Homeland p.7" : ""]); } };

RT.factionTeach.corvid = { h: "The Corvid Conspiracy",
  body: function () {
    return "<p>The <b>Corvid Conspiracy</b> hide <b>plot tokens</b> face down around the map — bombs, snares, extortion and raids. Each Birdsong they flip plots where they have warriors, scoring a point for <b>every face-up plot</b> on the map. A bomb or an extortion goes off as it flips, a face-up snare locks its clearing, and a raid spreads warriors when it's removed. Their warriors move regardless of rule, one card recruits them into every clearing of a suit, and when they defend in a clearing with a face-down plot they deal an extra hit, even with no warriors there. " +
      "Our counter is <b>Exposure</b>: on your turn, if you have pieces in a clearing with a face-down plot, show them a card matching that clearing and guess what the plot is. Guess right and it's removed for a point; guess wrong and they keep your card.</p>";
  } };
RT.factionLater.corvid = function () { return "<li><b>Each plot's exact effect</b> — see the Plot tokens table in the Corvid Conspiracy reference on this page; we'll see when one flips.</li>"; };

/* =====================================================================
   LORD OF THE HUNDREDS — Law p.15–17 §14 · Marauder p.2–6
   ===================================================================== */
RT.hundredsMoods = [   // [mood, item that blocks it (Law icons, rendered), effect]
  ["Bitter", "hammer", "In battle in your warlord's clearing, before the roll you may remove any number of mob tokens from that clearing and adjacent clearings, then place that many warriors in the warlord's clearing."],
  ["Grandiose", "tea", "This turn, Advance the Warlord first, then Command the Hundreds."],
  ["Jubilant", "boots", "Whenever you Incite in your warlord's clearing, after placing that mob you may — up to four times — roll the mob die and place a mob in a matching clearing with no mob that is adjacent to any clearing with a mob."],
  ["Lavish", "no item", "At the end of Birdsong, you may remove any number of Hoard items permanently; place two warriors in your warlord's clearing for each. Then shift Hoard items to fill the tracks from left to right."],
  ["Relentless", "bag", "Whenever an Advance the Warlord action both moves and battles, you may then either move the warlord (with any Hundreds warriors) or battle in its clearing."],
  ["Rowdy", "coins", "In Evening, draw one more card — two more if your warlord's clearing has three or more enemy pieces (any mix of enemies)."],
  ["Stubborn", "crossbow", "In battle in your warlord's clearing, ignore the first hit you take (doesn't combine with other ignore-the-first-hit abilities). The Hundreds' setup starts them Stubborn."],
  ["Wrathful", "sword", "As attacker in battle in your warlord's clearing, deal an extra hit."]
];
RT.factionRef.hundreds = { title: "Lord of the Hundreds",
  html: function (c) {
    return "<p>The Hundreds score each Evening by <b>oppressing</b> clearings — ruling them with a Hundreds piece and <b>no enemy pieces at all</b>. Items piled in the <b>Hoard</b> raise their <b>Command</b> and <b>Prowess</b>; the <b>warlord</b>'s mood gives a power each turn; <b>mobs</b> raze the Woodland.</p>" +
      "<h4>Abilities</h4>" + RT.ul([
        "<b>Crafting:</b> during Daylight, by activating <b>strongholds</b>.",
        "<b>The Warlord:</b> a warrior that can't be removed outside battle, moved outside the Hundreds' turn, or placed except in setup and by Anoint.",
        "<b>Contempt for Trade:</b> when you craft an item, either take it and score <b>none</b> of its points, or remove it permanently to score them. (Extra crafting points from effects such as Master Engravers or the Legendary Forge still score.)",
        "<b>The Hoard</b> (instead of a Crafted Items box): the <b>Command</b> track holds boots, bags and coins; the <b>Prowess</b> track holds hammers, tea, swords and crossbows. A gained item goes in the leftmost empty space of its track; if the track is full, permanently remove the new item or one already there, and score <b>1 point</b>.",
        "<b>Looters:</b> at the start of a battle you attack in, you may declare a <b>loot</b> if the defender has an item in its Crafted Items box" + (c.vb ? " (never the Vagabond — he has no Crafted Items box)" : "") + ". You then deal <b>no rolled hits</b> (the defender still does; extra hits such as Wrathful still count). At the end of the battle, if you rule the clearing, take one item from the defender's Crafted Items box."
      ]) +
      "<table class='rt'><thead><tr><th>Items on a track</th><th>0</th><th>1–2</th><th>3</th><th>4</th></tr></thead><tbody><tr><td>Command or Prowess</td><td>1</td><td>2</td><td>3</td><td>4</td></tr></tbody></table>" +
      "<h4>Birdsong (in order)</h4>" + RT.ol([
        "<b>Raze:</b> in each clearing with a mob, remove all enemy buildings and tokens, and take one item from a ruin there (remove the ruin if you took its last item)." + (c.twovb ? " A ruin holding two items: look at both and take one; you can't take an “R” item of a type already on your board." : "") +
          " Then you <b>must</b> roll the mob die once and place a mob in a matching clearing with no mob that is <b>adjacent</b> to a clearing with a mob (none: no mob). <i>No mobs on your first turn, so skip it.</i>",
        "<b>Recruit:</b> place warriors equal to your <b>Prowess</b> in the warlord's clearing, then one warrior per stronghold in each clearing with strongholds.",
        "<b>Anoint:</b> if the warlord isn't on the map, you must replace any Hundreds warrior with it; if you can't, place it in any clearing.",
        "<b>Choose Mood:</b> replace your mood card with a <b>different</b> one that doesn't show an item in your Hoard. (If you're Lavish and can't choose, you stay Lavish.)"
      ]) +
      "<h4>Daylight (in order)</h4>" + RT.ol([
        "<b>Craft</b> with strongholds.",
        "<b>Command the Hundreds</b> — up to your <b>Command</b>, in any order: <b>Move</b>; <b>Battle</b>; <b>Build</b> (spend a card to place a stronghold in a matching clearing you rule).",
        "<b>Advance the Warlord</b> — up to your <b>Prowess</b>: you may move the warlord (with any Hundreds warriors), then you may battle in the warlord's clearing."
      ]) +
      "<h4>Evening (in order)</h4>" + RT.ol([
        "<b>Incite:</b> any number of times, spend a card to place a mob in a matching clearing with no mob but with a Hundreds warrior (the warlord counts). No adjacency needed.",
        "<b>Oppress:</b> count clearings you rule that have a Hundreds piece and no enemy pieces." +
          "<table class='rt'><thead><tr><th>Clearings</th><th>1–2</th><th>3–4</th><th>5</th><th>6+</th></tr></thead><tbody><tr><td>Points</td><td>1</td><td>2</td><td>3</td><td>4</td></tr></tbody></table>",
        "<b>Draw</b> one card; discard down to five."
      ]) +
      "<h4>Moods</h4><table class='rt'><thead><tr><th>Mood</th><th>Not if your Hoard has</th><th>Effect</th></tr></thead><tbody>" +
      RT.hundredsMoods.map(function (m) { return "<tr><td>" + m[0] + "</td><td>" + m[1] + "</td><td>" + m[2] + "</td></tr>"; }).join("") + "</tbody></table>" +
      ((c.fac("knaves") || c.hire) ? "<h4>Interactions</h4>" + RT.ul([
        c.fac("knaves") ? "<b>Knaves' Prisoners</b> don't count when checking whether Anoint can replace a warrior, and Anoint can't replace a Prisoner." : "",
        c.hire ? "<b>Hirelings:</b> Anoint can't replace a hireling warrior, and Advance the Warlord can't move hirelings." : ""]) : "");
  },
  src: function (c) { return RT.join(["Law p.15–17 §14", "Marauder p.2–6", c.twovb ? "Law p.11 §9.7.3" : "", c.fac("knaves") ? "Homeland p.15" : "", c.hire ? "Law p.26 §H.3.3–H.3.4 · Marauder p.16" : ""]); } };

RT.factionTeach.hundreds = { h: "The Lord of the Hundreds",
  body: function () {
    return "<p>The <b>Lord of the Hundreds</b> score each Evening for <b>oppression</b>: clearings they rule with no enemy pieces at all. Their <b>warlord</b> leads, and its <b>mood</b> changes every turn, each giving a power. Items fill their <b>Hoard</b>: boots, bags and coins raise their <b>Command</b> — how many moves, battles and stronghold builds they get; hammers, tea, swords and crossbows raise their <b>Prowess</b> — how many warriors gather at the warlord and how often it advances. " +
      "They incite <b>mobs</b> that spread across the map and raze our buildings and tokens, and they can <b>loot</b> items out of our Crafted Items boxes by attacking us. When they craft an item they choose: keep it, or score it — never both.</p>";
  } };
RT.factionLater.hundreds = function () { return "<li><b>The eight moods</b> — the Hundreds read theirs out when they choose it.</li>"; };

/* =====================================================================
   KEEPERS IN IRON — Law p.17–18 §15 · Marauder p.7–11
   ===================================================================== */
RT.factionRef.keepers = { title: "Keepers in Iron",
  html: function (c) {
    return "<p>The Keepers <b>delve relics</b> out of the forests, carry them to a <b>waystation</b> of the same type and <b>recover</b> them for points — the relic's value, plus 2 for each completed set of figure, tablet and jewelry. Their <b>Retinue</b> grants their actions, but risky delves and recoveries cost Retinue cards.</p>" +
      "<h4>Abilities</h4>" + RT.ul([
        "<b>Relics:</b> 12 tokens, four each of <b>figures, tablets and jewelry</b>. The front shows only the type; the back shows a value of <b>1, 2, 3 or 3</b>.",
        "<b>Waystations:</b> three, each showing one relic type on its front and another on its back.",
        "<b>Crafting:</b> during Daylight, by activating waystations of any type.",
        "<b>Devout Knights:</b> in battle (attacking or defending), if the clearing has at least one relic and at least one Keeper warrior, ignore the <b>first hit</b> you take. (Ambushed: ignore one ambush hit, not later hits.) When moving between clearings, each Keeper warrior that moves may carry <b>one relic</b>.",
        "<b>Prized Trophies:</b> whenever an enemy removes a relic, they place it face up in any forest and score an extra point (<b>2 in total</b>)."
      ]) +
      "<h4>Birdsong (in order)</h4>" + RT.ol([
        "<b>Encamp:</b> once per clearing, you may replace a Keeper warrior with a waystation, either side up. (A clearing may already hold a waystation from an earlier turn.) If you have no warriors or waystations in any clearing, instead place one waystation and one warrior in any clearing on the map edge.",
        "<b>Decamp:</b> once per clearing, you may replace a waystation with a Keeper warrior.",
        "<b>Recruit:</b> any number of times, spend a card to place <b>two warriors</b> at a matching waystation."
      ]) +
      "<h4>Daylight (in order)</h4>" + RT.ol([
        "<b>Craft</b> with waystations (any type).",
        "<b>Act with Retinue:</b> starting with the leftmost column and moving right, you may take that column's action once for each card in it, in any order, each in a clearing <b>matching the card's suit</b>. Skipping is allowed." + RT.ul([
          "<b>Move:</b> take a move from a matching clearing.",
          "<b>Battle then Delve:</b> choose a matching clearing. You <b>must</b> battle there if any enemy pieces you can battle are there. Then, if you rule it and have a Keeper warrior there, you may <b>delve</b> (even without battling): flip a relic in an <b>adjacent forest</b> to show its value (if it isn't showing) and move it into the clearing. Count the clearings you rule <b>adjacent to that forest</b>: if fewer than the relic's value, discard the Retinue card you used.",
          "<b>Move or Recover:</b> choose a matching clearing; take a move from it, or <b>recover</b>: remove a relic there of the same type as a waystation there and put it in your leftmost empty Relics space of that type; score its value, plus <b>2</b> if you filled a Relics column. Count the clearings you rule <b>matching that clearing's suit</b>: if fewer than the relic's value, end the action and discard the Retinue card; otherwise you may recover again or stop."])
      ]) +
      "<h4>Evening (in order)</h4>" + RT.ol([
        "<b>Live Off the Land:</b> remove one Keeper warrior from each clearing with <b>four or more</b> Keeper warriors.",
        "<b>Gather Retinue:</b> add any number of cards from your hand to any Retinue columns — <i>or</i> shift one Retinue card to a different column. The Retinue holds at most <b>ten</b> cards.",
        "<b>Draw</b> one card plus one per uncovered draw bonus (one per waystation on the map); discard down to five."
      ]) +
      "<p class='inline-note'>You start with a Faithful Retainer — a <b>bird</b> card, so it matches any clearing — in each Retinue column; a discarded Faithful Retainer is removed permanently (pictured on Marauder p.8).</p>" +
      ((c.fac("knaves") || c.hire) ? "<h4>Interactions</h4>" + RT.ul([
        c.fac("knaves") ? "<b>Knaves' Prisoners</b> don't count when checking whether Encamp places a warrior and waystation." : "",
        c.hire ? "<b>Hirelings</b> aren't Keeper pieces: you can't remove hireling warriors to Encamp or delve with them, and they can't carry relics." : ""]) : "") +
      RT.frogNote(c, "keepers");
  },
  src: function (c) { return RT.join(["Law p.17–18 §15", "Marauder p.7–11", c.fac("knaves") ? "Homeland p.15" : "", c.hire ? "Law p.26 §H.3.3, §H.3.5 · Marauder p.16" : "", c.fac("diaspora") ? "Homeland p.7" : ""]); } };

RT.factionTeach.keepers = { h: "The Keepers in Iron",
  body: function () {
    return "<p>The <b>Keepers in Iron</b> hunt twelve <b>relics</b> hidden in the forests. They act through a <b>Retinue</b>, a bit like a forgiving Eyrie Decree: cards in three columns let them move, battle-then-delve, and move-or-recover, each in a clearing of that card's suit, and they can skip without penalty. " +
      "Delving pulls a relic out of an adjacent forest; carrying it to a <b>waystation</b> of the same type lets them recover it for its value, plus two for each full set. Reach too far — rule too few clearings around it — and they lose that Retinue card. In battle beside a relic they shrug off the first hit, and if one of us removes a relic we score two and drop it back in a forest.</p>";
  } };
RT.factionLater.keepers = function () { return "<li><b>Encamp and decamp</b> — how the Keepers swap warriors and waystations each Birdsong.</li>"; };

/* =====================================================================
   LILYPAD DIASPORA — Law p.18–19 §16 · Homeland p.2–7
   ===================================================================== */
RT.factionRef.diaspora = { title: "Lilypad Diaspora",
  html: function (c) {
    var others = ["alliance", "eyrie", "lizard", "riverfolk", "corvid", "keepers"].filter(function (id) { return c.human(id); });
    return "<p>The Diaspora found <b>enclaves</b> that bring the <b>frog suit</b> to the Woodland and score by spending cards matching their <b>Peaceful</b> enclaves. <b>Militant</b> enclaves give warriors but drive them to battle every turn.</p>" +
      "<h4>Enclaves and the frog suit</h4>" + RT.ul([
        "12 double-sided enclave tokens: <b>Peaceful</b> / <b>Militant</b>. One enclave per clearing.",
        "<b>Peaceful</b> adds frog to its clearing (dual-suited). <b>Militant</b> covers the clearing's suit — it's frog only.",
        "<b>Matching:</b> a Militant-enclave clearing matches frog; a Peaceful-enclave clearing matches frog <i>or</i> its printed suit. (E.g. the Alliance could spend a fox and a frog card to revolt in a fox clearing with a Peaceful enclave.)",
        "<b>Crafting pieces</b> there: at a Peaceful enclave, use the piece for a frog icon or the printed suit (not both); at a Militant enclave, only for a frog icon. The frog icon can be used as a wild icon.",
        "<b>Crafting (Diaspora):</b> during <b>Birdsong</b>, by activating enclaves."
      ]) +
      "<h4>Frog cards and the Pond</h4>" + RT.ul([
        "<b>14 frog cards</b> are shuffled into the shared deck in setup" + (c.two ? " — <b>13</b> here: Frog Dominance is removed with two players" : "") + ". They have the frog suit; some have frog crafting icons (you need a crafting piece in a frog clearing). Many force the Diaspora to act; the Diaspora can craft them to act themselves.",
        "<b>The Pond:</b> a discarded frog card goes face up on the Pond placard, not the discard pile" + (c.human("lizard") ? " (and not the Lizard Cult's Lost Souls)" : "") + ". Whenever any player draws, they may take their <b>first</b> card from the top of the Pond. When the deck is reshuffled, shuffle the Pond into it.",
        c.two ? "" : "<b>Frog Dominance:</b> a player who activates it wins at the start of their Birdsong if they rule <b>at least two enclaves on the river</b>, and now follows <b>Enclave Defense</b>: when the Diaspora defends in a clearing with an enclave, the Frog Dominance player's faction warriors there join as defenders, taking hits after the Diaspora's — unless that player is the attacker." +
          (c.fac("council") ? " With Peacekeepers too, the Diaspora chooses the mix of Council and Enclave Defense warriors that take hits after their own." : "")
      ]) +
      "<h4>Abilities</h4>" + RT.ul([
        "<b>Swimmers:</b> treat rivers as paths and may move along a river fully linking two clearings, ignoring rule.",
        "<b>Fears Come to Pass:</b> after a battle in which an enemy attacks a defending <b>Peaceful</b> enclave, or when an enemy removes a Peaceful enclave outside battle, flip <b>all</b> Peaceful enclaves with that enemy's pieces to Militant and place 1 warrior at each flipped enclave.",
        "<b>Negotiations:</b> once during their turn, an enemy with faction pieces in a clearing with a <b>Militant</b> enclave may flip it to Peaceful. If another player rules that enclave, the flipper must give the ruler a card (any suit)."
      ]) +
      "<h4>Birdsong (in order)</h4>" + RT.ol([
        "<b>Craft</b> with enclaves.",
        "<b>Rally or Reconcile</b> — you must do one:" + RT.ul([
          "<b>Rally:</b> place 1 warrior at each Militant enclave.",
          "<b>Reconcile:</b> flip any number of Militant enclaves to Peaceful; each time, if a player rules it, they draw 1 card (it may come from the Pond)."])
      ]) +
      "<h4>Daylight — Settle or Provoke, up to 3 times in total</h4>" + RT.ul([
        "<b>Settle:</b> choose a clearing. You may move into it from any number of adjacent clearings, once each. Then either battle in it, or place a <b>Peaceful</b> enclave if it has none and you rule it.",
        "<b>Provoke:</b> flip a Peaceful enclave to Militant, <i>or</i> place a Militant enclave on the river or at a Diaspora warrior. Then place 1 warrior at each Militant enclave. Finally discard a <b>random</b> card (frog cards included; skip if your hand is empty)."
      ]) +
      "<h4>Evening (in order)</h4>" + RT.ol([
        "<b>Retaliate:</b> you <b>must</b> battle at each Militant enclave (skip clearings with no enemy pieces; enemies placed there during this step must be battled; battle Riverfolk Mercenaries if they're the only option).",
        "<b>Integrate</b> (once per turn): you may spend one card to score <b>1 point per matching Peaceful enclave</b> on the map. You can't score the frog suit.",
        "<b>Draw and discard:</b> draw by Peaceful enclaves on the map, then discard down to five." +
          "<table class='rt'><thead><tr><th>Peaceful enclaves</th><th>0–1</th><th>2–3</th><th>4–7</th><th>8+</th></tr></thead><tbody><tr><td>Cards drawn</td><td>1</td><td>2</td><td>3</td><td>4</td></tr></tbody></table>"
      ]) +
      (others.length ? "<h4>The frog suit and the other factions in play</h4>" + RT.ul(others.map(function (id) {
        return "<b>" + RT.F[id].name + ":</b> " + RT.frogText[id];
      })) : "");
  },
  src: function (c) { return RT.join(["Law p.18–19 §16", "Homeland p.2–7", c.fac("council") && !c.two ? "Law p.19 §16.2.2.Ib" : ""]); } };

RT.factionTeach.diaspora = { h: "The Lilypad Diaspora",
  body: function (c) {
    return "<p>The <b>Lilypad Diaspora</b> bring a new suit, the <b>frog</b>. Their <b>enclaves</b> add frog to a clearing while Peaceful, and make it frog-only while Militant. " + (c.two ? "Thirteen" : "Fourteen") + " frog cards are in the deck; discarded frog cards go to the <b>Pond</b>, and whenever you draw you may take your first card off the Pond. They're <b>Swimmers</b>: they treat rivers as paths and move along a river ignoring rule. " +
      "Once each Evening they spend one card to score a point for every <b>Peaceful</b> enclave in a clearing matching it (never for frog), but only <b>Militant</b> enclaves give them warriors — and force them to battle there every Evening. Attack a Peaceful enclave and their fears come to pass: every Peaceful enclave where you have pieces turns Militant. Once on your turn you can <b>negotiate</b>: flip a Militant enclave you're in back to Peaceful, paying a card to whoever rules it.</p>";
  } };
RT.factionLater.diaspora = function (c) {
  return (c.two ? "" : (c.noDom ? "<li><b>Frog Dominance</b> — the one dominance card in the deck tonight: with 10 or more points you can trade your score for it, then win by ruling two enclaves on the river.</li>" : "<li><b>Frog Dominance</b> — like the other dominance cards, but you win by ruling two enclaves on the river.</li>")) +
    "<li><b>Frog cards' crafted effects</b> — many make the Diaspora act; read them as they come.</li>";
};

/* =====================================================================
   TWILIGHT COUNCIL — Law p.20–21 §17 · Homeland p.8–11
   ===================================================================== */
RT.factionRef.council = { title: "Twilight Council",
  html: function (c) {
    return "<p>The Council convenes <b>assemblies</b> to suppress the war. Assemblies score, banish enemy warriors and gain <b>Loyalists</b>; Governing assemblies restrict enemies, and in Evening the Council scores for Governing assemblies that share a clearing with enemy buildings or tokens.</p>" +
      "<h4>Abilities</h4>" + RT.ul([
        "<b>Loyalists:</b> up to 4 warriors on the Council's board. Placed by Entreat and Assemble. The Council may return them to its supply at any time.",
        "<b>Assemblies:</b> two sides, <b>Closed</b> (closed tent) and <b>Governing</b> (open tent). When an enemy of the Council removes an assembly, the Council removes 1 Loyalist.",
        "<b>Governors:</b> at a <b>Governing</b> assembly, enemies of the Council can't activate crafting pieces and can't place, remove, take or flip pieces — except in battle." + (c.vbH ? " (So the Vagabond can't craft there.)" : ""),
        "<b>Entreating:</b> any number of times on their turn, an enemy may <b>force</b> the Council to flip any assembly to Closed. The Council then either places any number of Loyalists at that assembly or puts 1 warrior in its Loyalists.",
        "<b>Peacekeepers:</b> when an enemy chooses <b>another enemy</b> as defender at an assembly, Council warriors there join as defenders, taking hits only once the defender's own warriors are gone. Ignored if the Vagabond is defending. (The Council can't ambush or use battle effects there.)" +
          (c.vbH ? RT.ul(["<b>Vagabond Allies:</b> if the Vagabond, Allied with the Council, attacks another enemy, Council warriors are attacking warriors."]) : ""),
        "<b>Crafting:</b> during <b>Evening</b>, by activating assemblies."
      ]) +
      "<h4>Birdsong</h4><p>Any number of times, <b>reveal</b> a card to take an action in a clearing matching it (revealed cards can't be used otherwise during Birdsong):</p>" + RT.ul([
        "<b>Move</b> from a matching clearing.",
        "<b>Recruit:</b> place 1 warrior in a matching clearing.",
        "<b>Battle</b> in a matching clearing. If an assembly is there, discard the revealed card.",
        "<b>Assemble:</b> place a <b>Closed</b> assembly and any number of Loyalists in a matching clearing with no assembly. Then, if you don't rule it, discard the revealed card."
      ]) +
      "<h4>Daylight</h4>" + RT.ul(["<b>Sleep:</b> flip assemblies ruled by enemies to Closed. That's all."]) +
      "<h4>Evening (in order)</h4>" + RT.ol([
        "<b>Convene Woodfolk:</b> one by one, return each card revealed in Birdsong to your hand. For each, you may:" + RT.ul([
          "<b>Banish</b> (non-bird card): battle in a clearing with a matching assembly. Defending warriors hit aren't removed — you <b>force</b> them to move to a single destination you choose, ignoring rule (one move, for triggering other effects). You can't hit buildings or tokens, and you ignore rolled hits you take (not ambush or extra hits). The Hundreds' warlord, the Vagabond and hirelings can't take Banish hits.",
          "<b>Agitate</b> (non-bird card): spend it and choose a matching assembly; put 1 warrior in your Loyalists, then flip that assembly to Governing if it's Closed. (No matching assembly, no Loyalist.)",
          "<b>Empower</b> (bird card): choose an assembly and roll one battle die; remove that many Council warriors from it. Put them in your Loyalists, <i>or</i> score 1 point if you rule the assembly."]),
        "<b>Inspire:</b> you may craft with assemblies. If you craft <b>nothing</b>, draw one card per card-draw icon showing on your Assemblies track.",
        "<b>Adjourn:</b> you may remove any of your assemblies. Flip assemblies you rule to Governing.",
        "<b>Oversee:</b> count Governing assemblies in a clearing with any <b>enemy buildings or tokens</b>." +
          "<table class='rt'><thead><tr><th>Assemblies</th><th>1</th><th>2–3</th><th>4</th><th>5–6</th></tr></thead><tbody><tr><td>Points</td><td>1</td><td>2</td><td>3</td><td>4</td></tr></tbody></table>",
        "<b>Draw</b> one card; discard down to five."
      ]);
  },
  src: function () { return "Law p.20–21 §17 · Homeland p.8–11"; } };

RT.factionTeach.council = { h: "The Twilight Council",
  body: function (c) {
    return "<p>The <b>Twilight Council</b> are nocturnal. In Birdsong they reveal cards to move, recruit, battle or set up <b>assemblies</b>; in Evening those cards come home to <b>banish</b> our warriors out of their assemblies, <b>agitate</b> assemblies into Governing, or <b>empower</b> them. " +
      "They score for Governing assemblies that sit with our buildings or tokens — and a <b>Governing</b> assembly stops us crafting there or placing, removing, taking or flipping pieces there, except in battle. If one of us attacks someone else at an assembly, Council warriors defend them" + (c.vb ? " — unless the Vagabond is the one defending" : "") + ". Our way out: on our turn we can <b>entreat</b> them to close an assembly, but then they may either gain 1 Loyalist or place any number of their Loyalists at that assembly.</p>";
  } };
RT.factionLater.council = function () { return "<li><b>Peacekeepers' fine print</b> — Council warriors take hits only after the defender's own warriors.</li>"; };

/* =====================================================================
   KNAVES OF THE DEEPWOOD — Law p.21–22 §18 · p.27 App. K · Homeland p.12–15
   ===================================================================== */
RT.knavesItems = [   // [action, item, effect] — Law p.22 §18.5.1.IV (item icons rendered; Homeland p.14 names them)
  ["Dash", "boots", "Move the Acting Captain up to twice, ignoring rule."],
  ["Assault", "sword", "Battle in the Acting Captain's clearing. Take <b>every</b> warrior you hit as a Prisoner, each to a separate forest with no Prisoners."],
  ["Skirmish", "crossbow", "Move the Acting Captain out of a forest, then battle in its destination clearing, ignoring the first hit you take."],
  ["Nab", "bag", "Battle in the Acting Captain's clearing. If the Captain is hit, move it to an adjacent forest instead of removing it (if it can't move, remove it). If it wasn't hit, you may move it after the battle (after placing acclaim)."],
  ["Revel", "tea", "Place 1 acclaim and 1 Skunk at the Acting Captain (in a forest: just the Skunk). If acclaim is already in its clearing, place 2 Skunks instead."],
  ["Gift", "coins", "Place 1 acclaim in the Acting Captain's clearing and draw 1 card (in a forest: just draw). If acclaim is already there, draw 2 cards instead."],
  ["Serve", "hammer", "Place 1 acclaim in the Acting Captain's clearing. If acclaim is already there, instead activate any number of acclaim matching that clearing to craft (you do score the listed points; each acclaim crafts once per turn)."]
];
RT.factionRef.knaves = { title: "Knaves of the Deepwood",
  html: function (c) {
    var caps = c.captains;
    return "<p>The Knaves mock the powerful: they score from <b>acclaim</b> across the Woodland and from <b>Prisoners</b> taken in battle. Each turn one of three <b>Captains</b> acts, with a crew of <b>Skunks</b>, flipping <b>Stash</b> items for special actions; once all three have acted they <b>Take It Easy</b> and refresh.</p>" +
      "<h4>Abilities</h4>" + RT.ul([
        "<b>Exclusive with the Vagabond:</b> the Knaves can't share a game with the Vagabond.",
        "<b>Stash</b> (instead of a Crafted Items box): items face up or face down; items you craft or take go in face up.",
        "<b>Acclaim:</b> 8 tokens, at most one per clearing (never in forests). It powers item actions and scores in Evening.",
        "<b>Deepwood Runners:</b> Captains and Skunks are warriors that move in and out of <b>forests</b>, ignoring rule.",
        "<b>Follow Me:</b> Skunks may move with a moving Captain. A Captain can be hit in battle only once no Skunks remain in the battle clearing. Captains can't be placed except in setup and by Ready, and can't be replaced (e.g. by the Lizard Cult's Convert).",
        "<b>Have at Thee:</b> when a Captain attacks a faction, take <b>1 defending warrior you hit as a Prisoner</b>: instead of removing it, move it to an adjacent forest with no Prisoners, ignoring rule (if it can't move, remove it). At the end of that battle, place acclaim in the battle clearing if the Acting Captain is there. Prisoners can't be used by their owner in any way. (Lay them down flat.)",
        "<b>Run Away:</b> when an enemy removes acclaim, they force the Knaves to place 1 Skunk in a forest of the enemy's choice adjacent to that clearing (ignored if no Skunks are in the supply).",
        "<b>Crafting:</b> in Daylight, by activating the <b>Acting Captain</b> (Filch) or <b>acclaim</b> matching the Acting Captain's clearing (Serve); each acclaim once per turn."
      ]) +
      "<h4>Birdsong — Ready</h4>" + RT.ul([
        "Place a <b>face-up</b> Captain card in the Acting Captain slot; you have its ability until you Retire.",
        "If that Captain's warrior isn't on the map, place it in any forest, remove any Prisoners in that forest and adjacent forests, and take only <b>three</b> actions this Daylight."
      ]) +
      "<h4>Daylight (in order)</h4>" + RT.ol([
        "<b>Captain Acts</b> — up to <b>four</b> actions (three if Ready placed it this turn), any order and combination, with the Acting Captain:" + RT.ul([
          "<b>Move</b> the Acting Captain (Skunks may follow).",
          "<b>Battle</b> in the Acting Captain's clearing.",
          "<b>Filch</b> (once per turn): craft a card by activating the Acting Captain — an item crafted this way scores <b>no points</b> — or take 1 item from the Crafted Items box of an enemy faction in the Acting Captain's clearing.",
          "<b>Item action:</b> flip a face-up Stash item face down to take its action (table below)."]),
        "<b>Retire:</b> flip the Acting Captain's card face down and return it to your supply, by your board."
      ]) +
      "<table class='rt'><thead><tr><th>Item</th><th>Action</th></tr></thead><tbody>" +
      RT.knavesItems.map(function (k) { return "<tr><td>" + k[1] + "</td><td><b>" + k[0] + ":</b> " + k[2] + "</td></tr>"; }).join("") + "</tbody></table>" +
      "<h4>Evening (in order)</h4>" + RT.ol([
        "<b>Mock the Powerful:</b> score 1 point per <b>2 Prisoners</b>, and 1 point per <b>2 acclaim</b> on the map (count them separately).",
        "<b>Protect the Weak:</b> once per acclaim, you may spend a matching card to place 1 Skunk at it.",
        "<b>Take It Easy:</b> if all three Captain cards are face down, flip them and every Stash item face up. Then the enemy with the <b>most Prisoners</b> may choose a clearing and move all their Prisoners from adjacent forests into it. (Tied: you choose which tied enemy.)",
        "<b>Draw</b> one card; discard down to five."
      ]) +
      "<h4>Your Captains</h4><table class='rt'><thead><tr><th>Captain</th><th>Starting items</th><th>Ability</th></tr></thead><tbody>" +
      caps.map(function (k) { return "<tr><td>" + k.name + "</td><td>" + RT.itemList(k.items) + "</td><td>" + RT.captainAbility[k.id] + "</td></tr>"; }).join("") + "</tbody></table>" +
      ((c.fac("keepers") || c.fac("hundreds")) ? "<h4>Interactions</h4>" + RT.ul([
        c.fac("keepers") ? "<b>Keepers in Iron:</b> Prisoners don't count when checking whether Encamp places a warrior and waystation." : "",
        c.fac("hundreds") ? "<b>Lord of the Hundreds:</b> Prisoners don't count when checking whether Anoint can replace a warrior, and Anoint can't replace a Prisoner." : ""]) : "");
  },
  src: function () { return "Law p.21–22 §18 · Law p.27 App. K · Homeland p.12–15"; } };

RT.captainAbility = {   // Law p.27 App. K (the same text as the Knave Captains appendix in data-ref.js)
  thief: "After you Filch, you may move the Thief.",
  tinker: "After you Serve, draw 1 card.",
  ranger: "Once per turn, as an action, flip any item face down to Assault, Skirmish or Nab.",
  vagrant: "Once per turn, as an action, flip any item face down to Revel, Gift or Serve.",
  arbiter: "In Assault battles, you may take 1 extra hit to deal 1 extra hit (after rolling).",
  scoundrel: "When you Skirmish, you may instead move from a clearing before the battle; if you do, don't ignore 1 hit.",
  adventurer: "After you place acclaim at a ruin, draw 1 card.",
  harrier: "When you Dash, you may move the Harrier up to three times (not two), ignoring rule.",
  ronin: "When you Assault, the Ronin may move before the battle.",
  cheat: "As an action, you may flip two items face down to take any item action.",
  gladiator: "When you Assault, draw 1 card at the start of battle.",
  jailor: "In Nab battles, you may deal 1 less hit (even if dealing none) to ignore 1 rolled hit you take (after rolling)."
};

RT.factionTeach.knaves = { h: "The Knaves of the Deepwood",
  body: function (c) {
    var names = c.captains.map(function (k) { return "<b>" + k.name + "</b>"; });
    return "<p>The <b>Knaves of the Deepwood</b> act with <b>one Captain each turn</b> — tonight they have the " + RT.list(names) + " — and that Captain sits out until all three have acted; then they <b>Take It Easy</b> and everything refreshes. Captains and their <b>Skunks</b> slip through the forests ignoring rule. " +
      "The acting Captain gets four actions: move, battle, filch an item or craft, or flip an item in their Stash for a trick — dash, assault, skirmish, nab, revel, gift or serve. An item they craft with <b>Filch</b> scores no points; items crafted with <b>Serve</b> score as normal. When a Captain attacks, one warrior it hits becomes a <b>Prisoner</b> in a nearby forest. They score for every two Prisoners and every two <b>acclaim</b> on the map. Remove their acclaim and a Skunk runs off into the woods. And no Vagabond in the same game.</p>";
  } };
RT.factionLater.knaves = function () { return "<li><b>Take It Easy</b> — when the Knaves refresh, whoever has the most Prisoners gets to free some.</li>"; };

/* =====================================================================
   FACTION EXCEPTIONS INSIDE THE CORE REFERENCE (data-ref.js RT.core)
   ===================================================================== */
RT.coreExc.turn = [
  { when: function (c) { return c.human("riverfolk") && c.nfac > 1; }, src: "Law p.12 §11.2.6",
    t: "<b>Buy Riverfolk services</b> (everyone but the Riverfolk) at the <b>start of your Birdsong</b>: one, plus one per clearing with a trade post and your faction pieces." },
  { when: RTH("corvid"), src: "Law p.15 §13.2.4",
    t: "<b>Exposure</b> (Corvid Conspiracy): any number of times on your turn, in a clearing where you have faction pieces and a face-down plot sits, show the Corvids a card matching the clearing and guess the plot's type." },
  { when: RTH("diaspora"), src: "Law p.19 §16.2.6",
    t: "<b>Negotiations</b> (Lilypad Diaspora): once on your turn, flip a Militant enclave where you have faction pieces to Peaceful — giving its ruler a card if someone else rules it." },
  { when: RTH("council"), src: "Law p.20 §17.2.4",
    t: "<b>Entreat</b> (Twilight Council): any number of times on your turn, force the Council to flip an assembly to Closed (they then place Loyalists there or gain one)." },
  { when: RTH("diaspora"), src: "Law p.19 §16.2.3.I",
    t: "<b>The Pond</b>: whenever you draw, your first card may come from the top of the Pond." },
  { when: RTH("riverfolk"), src: "Law p.13 §11.5.4, §11.6",
    t: "<b>Riverfolk Company:</b> no Evening draw — they draw with a Daylight action; in Evening they discard to five and reset their prices." },
  { when: RTH("corvid"), src: "Law p.15 §13.6",
    t: "<b>Corvid Conspiracy:</b> may skip their Evening draw to take one more Daylight action (Exert); they draw one extra card per face-up extortion." },
  { when: function (c) { return c.human("hundreds") || c.human("council") || c.human("knaves"); },
    src: "Law p.16 §14.6.3 · p.21 §17.6.2, §17.6.5 · p.22 §18.6.4",
    t: "<b>One-card Evening draw</b> (no draw bonuses): the Lord of the Hundreds (more while Rowdy), the Twilight Council (their Assemblies-track draws come only in Inspire, when they craft nothing) and the Knaves." }
];
RT.coreExc.victory = [
  { when: RTH("keepers"), src: "Law p.17 §15.2.5",
    t: "<b>Keepers' relics</b> (tokens) score <b>2</b> when an enemy removes one (Prized Trophies); the remover puts it face up in any forest." },
  { when: RTH("hundreds"), src: "Law p.15 §14.2.3",
    t: "<b>Lord of the Hundreds — Contempt for Trade:</b> crafting an item, they keep it and score nothing, or remove it permanently and score its points." },
  { when: RTH("knaves"), src: "Law p.22 §18.5.1.III",
    t: "<b>Knaves:</b> an item crafted with Filch scores no points (crafting with Serve scores normally)." },
  { when: RTH("lizard"), src: "Law p.11 §10.2.6, §10.4.2",
    t: "<b>Lizard Cult:</b> a spent or discarded dominance card goes to the Lost Souls pile first; it becomes available when the Cult discards Lost Souls in its Birdsong." },
  { when: function (c) { return c.human("diaspora") && !c.two; }, src: "Law p.19 §16.2.2.I",
    t: "<b>Frog Dominance</b> (a frog card): win at the start of your Birdsong if you rule <b>at least two enclaves on the river</b>; you also follow Enclave Defense." }
];

RT.coreExc.cards = [
  { when: RTH("lizard"), src: "Law p.11 §10.2.6",
    t: "<b>Lost Souls (Lizard Cult):</b> every card spent or discarded — even a dominance card — goes to the Cult's Lost Souls pile instead of the discard pile; the Cult moves it to the discard pile each Birdsong." },
  { when: RTH("lizard"), src: "Law p.11 §10.2.2",
    t: "<b>Hatred of Birds:</b> birds aren't wild for the Lizard Cult's rituals." },
  { when: RTH("council"), src: "Law p.20–21 §17.6.1",
    t: "<b>Twilight Council:</b> Banish and Agitate need a non-bird card; a returned bird card Empowers instead." },
  { when: RTH("diaspora"), src: "Law p.19 §16.2.2–16.2.3 · Homeland p.3",
    t: "<b>Frog cards and the Pond (Lilypad Diaspora):</b> frog cards add a fifth suit to the deck. Discarded frog cards go face up to the Pond" },
  { when: RTH("riverfolk"), src: "Law p.12 §11.2.3",
    t: "<b>Public hand (Riverfolk):</b> their hand is face up; a random card taken from them is drawn after flipping the hand face down and shuffling." }
];

RT.coreExc.map = [
  { when: RTH("lizard"), src: "Law p.11 §10.2.4",
    t: "<b>Pilgrims (Lizard Cult):</b> they rule every clearing where they have a garden — overriding the Eyrie's Lords of the Forest." },
  { when: RTH("duchy"), src: "Law p.13 §12.2.2 · Underworld p.2",
    t: "<b>The Burrow (Duchy):</b> an off-map, unsuited clearing with no slots, adjacent to every clearing with a tunnel. Only Duchy pieces may be placed in or moved into it, and the Duchy always rule it." },
  { when: RTH("diaspora"), src: "Law p.18 §16.2.1",
    t: "<b>Enclaves (Diaspora):</b> a Peaceful enclave adds the frog suit to its clearing; a Militant enclave covers the suit, leaving only frog." },
  { when: function (c) { return c.human("riverfolk") || c.human("diaspora"); }, src: "Law p.12 §11.2.2 · p.19 §16.2.4",
    t: "<b>Rivers as paths:</b> the Swimmers ability" },
  { when: RTH("riverfolk"), src: "Law p.12 §11.2.7.III",
    t: "<b>Riverfolk Mercenaries:</b> a buyer treats Riverfolk warriors as their own for rule (and battle) in that turn's Daylight and Evening." },
  { when: RTH("keepers"), src: "Law p.17 §15.3.1 · §15.2.5",
    t: "<b>Relics (Keepers)</b> start in the forests, and a relic an enemy removes goes back to a forest." },
  { when: RTH("knaves"), src: "Law p.21 §18.2.3, §18.2.6",
    t: "<b>Knaves:</b> acclaim sits in clearings (one each, never forests); Prisoners and Captains can be in forests." }
];

RT.coreExc.move = [
  { when: RTH("corvid"), src: "Law p.15 §13.2.3", t: "<b>Corvid Conspiracy — Nimble:</b> they move regardless of rule." },
  { when: function (c) { return c.human("riverfolk") || c.human("diaspora"); }, src: "Law p.12 §11.2.2 · p.19 §16.2.4",
    t: "<b>Swimmers</b>" },
  { when: RTH("riverfolk"), src: "Law p.12 §11.2.7.II",
    t: "<b>Riverboats</b> (a Riverfolk service): the buyer treats rivers as paths until the end of their turn." },
  { when: RTH("knaves"), src: "Law p.21 §18.2.4–18.2.5",
    t: "<b>Knaves — Deepwood Runners:</b> Captains and Skunks move in and out of forests, ignoring rule; Skunks may move with a Captain." },
  { when: RTH("keepers"), src: "Law p.17 §15.2.4",
    t: "<b>Keepers — Devout Knights:</b> each Keeper warrior moving between clearings may carry one relic." },
  { when: RTH("hundreds"), src: "Law p.15 §14.2.2",
    t: "<b>The Hundreds' warlord</b> can't be moved outside the Hundreds' turn." },
  { when: RTH("duchy"), src: "Law p.13 §12.2.2",
    t: "<b>The Burrow:</b> only Duchy pieces may move into it." },
  { when: RTH("corvid"), src: "Law p.15 §13.7.2",
    t: "<b>Snare</b> (face-up Corvid plot): enemy pieces can't be placed in or moved out of its clearing." },
  { when: RTH("diaspora"), src: "Law p.19 §16.5.1",
    t: "<b>Diaspora — Settle:</b> move into one clearing from any number of adjacent clearings, once each." }
];

RT.coreExc.battle = [
  { when: RTH("corvid"), src: "Law p.15 §13.2.5", t: "<b>Corvids — Embedded Agents:</b> defending with a face-down plot in the clearing, they deal an extra hit, even if defenseless." },
  { when: RTH("keepers"), src: "Law p.17 §15.2.4", t: "<b>Keepers — Devout Knights:</b> with a relic and a Keeper warrior in the clearing, they ignore the first hit they take (only one ambush hit, if ambushed)." },
  { when: RTH("council"), src: "Law p.20 §17.2.5", t: "<b>Twilight Council — Peacekeepers:</b> attack another enemy at an assembly and Council warriors defend too, taking hits after the defender's warriors (not when the Vagabond defends)." },
  { when: RTH("hundreds"), src: "Law p.16 §14.2.5", t: "<b>Hundreds — Looters:</b> attacking, they may loot instead of dealing rolled hits, then take an item from the defender's Crafted Items box if they rule afterwards." },
  { when: RTH("knaves"), src: "Law p.21 §18.2.5–18.2.6", t: "<b>Knaves:</b> a Captain can be hit only once no Skunks remain; an attacking Captain takes one warrior it hits as a Prisoner instead of removing it." },
  { when: RTH("lizard"), src: "Law p.11 §10.2.3", t: "<b>Lizard Cult — Revenge:</b> Cult warriors removed while defending become acolytes." },
  { when: RTH("diaspora"), src: "Law p.19 §16.2.5", t: "<b>Diaspora — Fears Come to Pass:</b> after a battle in which you attack them at a Peaceful enclave (or whenever you remove a Peaceful enclave outside battle), every Peaceful enclave with your pieces flips to Militant and gains a Diaspora warrior." },
  { when: RTH("riverfolk"), src: "Law p.12 §11.2.7.IIIa", t: "<b>Riverfolk Mercenaries</b> fight for their buyer (not against the Riverfolk); the buyer takes the odd hits on their own warriors." }
];

RT.coreExc.craft = [
  { when: RTH("diaspora"), src: "Law p.4 §4.1.1 · p.18 §16.2.1.I · Homeland p.3",
    t: "<b>Frog icons</b> need a crafting piece in a frog clearing. A piece at a Peaceful enclave fills a frog <i>or</i> printed-suit icon (not both); at a Militant enclave, only frog. A three-colour question mark accepts any suit, even frog." },
  { when: RTH("lizard"), src: "Law p.11 §10.2.1",
    t: "<b>Lizard Cult:</b> a garden fulfils an icon matching its clearing, whatever its printed suit." },
  { when: RTH("riverfolk"), src: "Law p.12–13 §11.2.1, §11.5.3",
    t: "<b>Riverfolk Company:</b> no crafting pieces — they commit funds to Trade Posts track spaces matching the cost; Export discards the card for a warrior in Payments instead." },
  { when: RTH("hundreds"), src: "Law p.15–16 §14.2.3–14.2.4",
    t: "<b>Lord of the Hundreds:</b> crafted items go to the Hoard — or are removed to score (Contempt for Trade)." },
  { when: RTH("knaves"), src: "Law p.21–22 §18.2.2, §18.5.1.III",
    t: "<b>Knaves:</b> crafted items go to the Stash; items crafted with Filch score nothing." },
  { when: RTH("council"), src: "Law p.20 §17.2.3",
    t: "<b>Governing assemblies:</b> no enemy of the Council may activate crafting pieces there." }
];

/* finish the entries whose wording depends on the configuration: e.html(c) / e.srcFn(c) override e.t / e.src */
(function () {
  var oneCard = RT.coreExc.turn.filter(function (e) { return /One-card/.test(e.t); })[0];
  oneCard.html = function (c) {
    var parts = [];
    if (c.human("hundreds")) parts.push("the Lord of the Hundreds (more while Rowdy)");
    if (c.human("council")) parts.push("the Twilight Council (their Assemblies-track draws come only in Inspire, when they craft nothing)");
    if (c.human("knaves")) parts.push("the Knaves");
    return "<b>One-card Evening draw</b> (no draw bonuses): " + RT.list(parts) + ".";
};
  oneCard.srcFn = function (c) {
    return RT.join([c.human("hundreds") ? "Law p.16 §14.6.3" : "", c.human("council") ? "Law p.21 §17.6.2, §17.6.5" : "", c.human("knaves") ? "Law p.22 §18.6.4" : ""]);
};
  var pond = RT.coreExc.cards.filter(function (e) { return /Pond \(Lilypad/.test(e.t); })[0];
  pond.html = function (c) {
    return "<b>Frog cards and the Pond (Lilypad Diaspora):</b> " + (c.two ? "13" : "14") + " frog cards add a fifth suit to the deck. Discarded frog cards go face up to the <b>Pond</b>" +
      (c.human("lizard") ? " (not Lost Souls)" : "") + ". Whenever you draw, your first card may come from the top of the Pond. When the deck is reshuffled, shuffle the Pond in too.";
};
  var rivers = RT.coreExc.map.filter(function (e) { return /Rivers as paths/.test(e.t); })[0];
  rivers.html = function (c) {
    var who = ["riverfolk", "diaspora"].filter(function (id) { return c.human(id); }).map(function (id) { return "the " + RT.F[id].name; });
    return "<b>Rivers as paths:</b> " + RT.list(who) + " treat rivers as paths (Swimmers)" + (c.human("riverfolk") ? "; anyone can buy Riverboats from the Riverfolk to do the same for a turn" : "") + ".";
};
  var swim = RT.coreExc.move.filter(function (e) { return e.t === "<b>Swimmers</b>"; })[0];
  swim.html = function (c) {
    var who = ["riverfolk", "diaspora"].filter(function (id) { return c.human(id); }).map(function (id) { return "the " + RT.F[id].name; });
    return "<b>Swimmers:</b> " + RT.list(who) + " treat rivers as paths and may move along a river fully linking two clearings, <b>ignoring rule</b>.";
};
  swim.srcFn = rivers.srcFn = function (c) {
    return RT.join([c.human("riverfolk") ? "Law p.12 §11.2.2" : "", c.human("diaspora") ? "Law p.19 §16.2.4" : ""]);
};
  var snare = RT.coreExc.move.filter(function (e) { return /Snare/.test(e.t); })[0];
  snare.html = function (c) { return snare.t + (c.vbH ? " The Vagabond's Slip ignores it." : ""); };
  snare.srcFn = function (c) { return RT.join(["Law p.15 §13.7.2", c.vbH ? "Law p.10 §9.4.2" : ""]); };
})();
