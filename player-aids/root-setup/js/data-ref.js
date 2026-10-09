/* =============================================================================
   Root — Setup & Reference Utility · rules reference
   Law §1–5 (core rules), the four base factions (§6–9), and the appendices this stage owns:
   H (hirelings), K (Knave Captains), L (landmarks), M (maps), V (Vagabonds).
   Expansion factions' sections come from data-factions.js; bots' from data-bots.js.
   ============================================================================= */

/* Faction exceptions to the core rules: RT.coreExc[sectionId] = [{ when(c), t | html(c), src | srcFn(c) }],
   filled by data-factions.js (expansion factions) and data-bots.js (bots). Shown at the end of each core section. */
RT.coreExc = {};
RT.excItems = function (c, id) { return (RT.coreExc[id] || []).filter(function (e) { return e.when(c); }); };
RT.excHtml = function (c, id, head) {
  var a = RT.excItems(c, id);
  return a.length ? "<h4>" + (head || "With the factions in play") + "</h4>" + RT.ul(a.map(function (e) { return e.html ? e.html(c) : e.t; })) : "";
};
RT.excSrc = function (c, id) {           // unique citations of the exceptions shown
  var seen = {}, out = [];
  RT.excItems(c, id).forEach(function (e) {
    var s = e.srcFn ? e.srcFn(c) : e.src;
    if (s && !seen[s]) { seen[s] = true; out.push(s); }
  });
  return out.join(" · ");
};

RT.core = [
  { id: "turn", title: "A turn: Birdsong, Daylight, Evening",
    when: function () { return true; },
    html: function (c) {
      return RT.ul([
        "Each turn has three phases in order: <b>Birdsong</b>, <b>Daylight</b>, <b>Evening</b>. Your faction board lists exactly what you do in each.",
        "Anything “at start of” a phase happens before everything else in it; anything “at end of” happens after everything else in it, before the next phase.",
        "After you end Evening, the next player <b>clockwise</b> begins their turn. Play continues until someone wins.",
        "<b>No interrupting:</b> you cannot interrupt an action (even a compound one like the Marquise's March), ability or persistent effect with another effect unless it explicitly allows it (e.g. a card that says “In battle…”).",
        "<b>End of turn:</b> once you begin the last step of your turn you cannot take actions, except those that say “end of Evening” or “end of turn” (such as hirelings).",
        "Unless noted, you may take the actions listed in a phase in any order and take a given action more than once.",
        "Most factions end Evening the same way: <b>draw one card plus one per uncovered draw bonus, then discard down to five</b>."
      ]) + RT.excHtml(c, "turn");
    },
    src: function (c) { return RT.join(["Law p.2 §1.4 · LtP p.2, p.10–11", RT.excSrc(c, "turn")]); } },

  { id: "victory", title: "Victory: 30 points, dominance and coalitions",
    when: function () { return true; },
    html: function (c) {
      var h = "<h4>How to win</h4>" + RT.ul([
        "The first player to reach <b>30 victory points</b> wins immediately.",
        "<b>Ties:</b> if several players reach 30 at the same time, the tied player closest in clockwise order to the current player wins (the current player included)."
      ]) + "<h4>Points any faction can score</h4>" + RT.ul([
        "<b>Remove an enemy building or token</b> (in battle or not): <b>+1</b>.",
        "<b>Craft an item:</b> score the points listed on the card." + (c.human("eyrie") ? " (The Eyrie score only 1 — Disdain for Trade — unless their leader is the Builder; extra crafting points from effects still count.)" : "")
      ]) + "<h4>Dominance cards</h4>";
      if (c.noDom) h += RT.ul([c.anyBot
        ? (c.mmorig && !c.rb ? "<b>Not in this game</b> — the original Mechanical Marquise's spy cards replace them." : "<b>Not in this game</b> — all four are removed in setup " + (c.v("coop") ? "for the cooperative game." : "with one or two humans."))
        : "<b>Not used with two players</b> — all four are removed from the deck in setup.",
        !c.two && c.fac("diaspora") ? "The <b>Frog Dominance</b> card stays in the deck: the Law removes it only in a two-player game (Law p.19 §16.3.3), and the " + (c.mmorig && !c.rb ? "original Mechanical Marquise rules don't" : "Law of Rootbotics doesn't") + " mention it." + (c.v("coop") ? " The cooperative win needs every human to reach 30 points; the books don't say how a Frog Dominance win fits that." : "") : ""]);
      if (!c.noDom) h += RT.ul([
        "The deck holds <b>four dominance cards</b>, one per suit. They cannot be crafted, but can be spent for their suit.",
        "<b>Activate:</b> during your Daylight, if you have <b>at least 10 points</b>, place a dominance card from your hand in your play area. Remove your score marker from the track — you can no longer score points.",
        "<b>Mouse, rabbit or fox dominance:</b> you win immediately if you <b>rule three clearings of that suit</b> at the start of your Birdsong.",
        "<b>Bird dominance:</b> you win immediately if you <b>rule two clearings in opposite corners</b> at the start of your Birdsong.",
        "An activated dominance card can't be removed from your play area or replaced. It doesn't count against your hand.",
        "Whenever a dominance card would go to the discard pile, it is placed near the map instead, <b>available</b>: during your Daylight you may take it into your hand by spending a matching card. You can't treat an available bird dominance card as a non-bird suit."
      ]);
      if (c.vbH) h += "<h4>Vagabond coalitions</h4>" + RT.ul([
        "The Vagabond cannot activate a dominance card to win by it." + (c.noDom && !c.two && c.fac("diaspora") ? (c.p >= 4 ? " The four suit dominance cards are out, so his only coalition card is <b>Frog Dominance</b>." : " Coalitions need <b>four or more players</b> — not available in this game.") : (c.noDom ? " This game has no dominance cards, so he can't form a coalition either." : (c.p >= 4 ? "" : " Coalitions need <b>four or more players</b> — not available in this game."))),
        (!c.noDom || (!c.two && c.fac("diaspora"))) && c.p >= 4 ? "In games with <b>four or more players</b>, he can activate one to form a <b>coalition</b>: put his score marker on the faction board of the player with fewer points than each other player (except himself) who isn't in a coalition; he chooses among ties. He no longer scores; if that player wins, he wins too." : "",
        (!c.noDom || (!c.two && c.fac("diaspora"))) && c.p >= 4 ? "He may form a coalition with a Hostile faction — its relationship marker moves back to Indifferent." : ""
      ]);
      return h + RT.excHtml(c, "victory", "Scoring and dominance with the factions in play");
    },
    src: function (c) { return RT.join(["Law p.3–4 §3", c.noDom ? (c.anyBot ? (c.mmorig && !c.rb ? "Riverfolk p.6" : (c.v("coop") ? "Rootbotics p.3 (Fully Cooperative Play)" : "Rootbotics p.3 §3.4")) : (c.adv ? "Law p.23 §A.7" : "Law p.5 §5.1.3")) : "", c.noDom && !c.two && c.fac("diaspora") ? "Law p.19 §16.3.3" : "", c.human("eyrie") ? "Law p.6–7 §7.2.3, §7.8.1" : "", c.vbH ? "Law p.9–10 §9.2.8, §9.2.9.IIId" : "", "LtP p.21", RT.excSrc(c, "victory")]); } },

  { id: "cards", title: "Cards and suits",
    when: function () { return true; },
    html: function (c) {
      return RT.ul([
        "You draw from the top of the <b>shared deck</b> and discard to a shared discard pile. If the deck is ever empty, shuffle the discard pile at once to form a new deck.",
        "Every card has a suit: <b>bird, fox, rabbit or mouse</b>. Most cards also have an effect you can craft.",
        "<b>Birds are wild:</b> you can treat a bird card as any other suit, even when spending, taking or giving several cards of one suit." + RT.ul([
          "<b>Forced effects:</b> if you must discard or give cards of a non-bird suit, your birds count as that suit.",
          "<b>Reverse substitution:</b> if you must spend, discard, take or give a <i>bird</i> card, no other suit can stand in for it."]),
        "<b>Ambush cards:</b> five in the deck — one mouse, one rabbit, one fox and two birds. They cannot be crafted; play one in battle to deal immediate hits.",
        "<b>Dominance cards:</b> four, one per suit; they can't be crafted (see Victory).",
        "<b>Your play area:</b> activated dominance cards, crafted persistent effects and revealed cards sit near you. They aren't in your hand and can be used only as instructed.",
        "<b>Information:</b> the number of cards in a hand is public; cards in hand are shown only when a rule says so. Face-up piles (like the discard pile) can be searched; the shared deck cannot.",
        c.deck !== "standard" ? "This game uses the <b>" + RT.decks.filter(function (d) { return d.id === c.deck; })[0].name + "</b> deck instead of the base deck." : ""
      ]) + RT.excHtml(c, "cards");
    },
    src: function (c) { return RT.join(["Law p.2–3 §1.2, §2.1", c.deck !== "standard" ? "Law p.22 §A.2" : "", "LtP p.6", RT.excSrc(c, "cards")]); } },

  { id: "map", title: "The Woodland: clearings, paths, forests and rule",
    when: function () { return true; },
    html: function (c) {
      return RT.ul([
        "<b>Clearings</b> are linked by <b>paths</b>; a clearing is adjacent to every clearing a path links it to.",
        "<b>Suit:</b> each clearing is mouse, rabbit or fox" + (c.map === "autumn" ? " (shown by its symbol and the colour of its trees)" : " (here, by the suit markers placed in setup)") + ".",
        "<b>Slots:</b> each building fills an open slot (white box). No open slot, no building — but tokens can still be placed.",
        "<b>Ruins</b> fill the slots marked “R” and can't be removed unless a rule says so (such as the Vagabond's Explore).",
        "<b>Rivers</b> link many clearings. They are <b>not paths</b> unless a rule says to treat them as paths, and they don't divide clearings or forests" + (c.map === "winter" ? " — except on this Winter map, where the Raging River divides forests" : "") + ".",
        "<b>Forests</b> are the areas enclosed by paths and clearings. A forest is adjacent to every clearing it touches without crossing a path, and to every forest separated from it by only one path." + (c.map === "lake" ? " (Lake map: see the map section for coastal forests.)" : ""),
        "<b>Rule:</b> you rule a clearing if you have <b>more warriors and buildings combined</b> there than each other player. Tokens and pawns don't count. On a tie, <b>no one</b> rules it." +
          (c.human("eyrie") ? " <i>Exception in play: the Eyrie's Lords of the Forest — they rule ties if they have a piece there.</i>" : "")
      ]) + RT.excHtml(c, "map");
    },
    src: function (c) { return RT.join(["Law p.3 §2.2–2.5", c.map === "winter" ? "Law p.27 §M.2.1" : "", c.human("eyrie") ? "Law p.6 §7.2.2" : "", "LtP p.5–6", RT.excSrc(c, "map")]); } },

  { id: "move", title: "Move",
    when: function () { return true; },
    html: function (c) {
      return RT.ul([
        "Take <b>any number (more than zero)</b> of your warriors and pawns from one clearing and move them along a path to <b>one adjacent clearing</b>.",
        "<b>You must rule</b> the origin, the destination, or both." + (c.fac("vagabond") || c.fac("vagabond2") ? " (The Vagabond is Nimble and ignores this.)" : ""),
        "<b>No movement limits:</b> a piece can move any number of times in a turn; with several moves you may move the same group or different groups.",
        "Moving into a forest needs a rule that allows it" + (c.vb ? " (the Vagabond's Slip)" : "") + ". Rivers are used only when a rule lets you treat them as paths."
      ]) + RT.excHtml(c, "move");
    },
    src: function (c) { return RT.join(["Law p.4 §4.2", c.vb ? "Law p.9–10 §9.2.3, §9.2.10" : "", "Law p.3 §2.3", RT.excSrc(c, "move")]); } },

  { id: "battle", title: "Battle",
    when: function () { return true; },
    html: function (c) {
      return "<p>Choose a clearing where you have warriors or a pawn (the clearing of battle); you are the <b>attacker</b>. Choose an enemy there as the <b>defender</b>.</p>" + RT.ol([
        "<b>Defender may ambush:</b> the defender may play one ambush card matching the clearing. The attacker may <b>foil</b> it with a matching ambush card of their own (the defender's is discarded and does nothing). Otherwise the ambush deals <b>two hits immediately</b>, then is discarded; if no attacking warriors or pawns remain, the battle ends.",
        "<b>Before-roll effects:</b> players may use effects that happen “before rolling” (the attacker orders them if both have some).",
        "<b>Roll both dice.</b> The attacker will deal hits equal to the <b>higher</b> roll, the defender equal to the <b>lower</b> roll (equal rolls: the same number)." + (c.human("alliance") ? " <i>Woodland Alliance defending: Guerrilla War reverses this.</i>" : "") +
          " <b>Maximum rolled hits</b> = your warriors in the clearing of battle" + (c.vbH ? " (the Vagabond: his undamaged swords)" : "") + ".",
        "<b>After-roll effects:</b> players may use battle effects that don't say “before rolling” (the attacker orders them if both have some).",
        "<b>Count hits:</b> rolled hits plus effects. <b>Extra hits</b> aren't capped by warriors. <b>Defenseless:</b> if the defender has no warriors there, the attacker deals one extra hit. <b>Ignored hits</b> are subtracted.",
        "<b>Deal hits:</b> each hit removes one piece of the other side from the clearing. The side taking hits chooses the order, but must remove <b>all its warriors there before any buildings or tokens</b>, and chooses the order of any effects that triggers. Score 1 point per enemy building or token removed."
      ]) + RT.ul([
        "Ambush hits ignore the warrior cap — you can ambush even when defenseless.",
        c.vbH ? "<b>The Vagabond in battle:</b> his pawn isn't a warrior; his maximum rolled hits equal his undamaged swords (face up or down); each hit he takes damages one undamaged item (none left: ignore the rest); he is defenseless if he has no undamaged sword." : ""
      ]) + RT.excHtml(c, "battle");
    },
    src: function (c) { return RT.join(["Law p.4 §4.3", c.vbH ? "Law p.9 §9.2.4–9.2.7" : "", c.human("alliance") ? "Law p.7 §8.2.2" : "", "LtP p.8–9", RT.excSrc(c, "battle")]); } },

  { id: "craft", title: "Craft",
    when: function () { return true; },
    html: function (c) {
      var rows = c.facs.filter(function (id) { return !c.bot(id); }).map(function (id) {
        return "<tr><td>" + RT.F[id].name + "</td><td>" + RT.F[id].craft + "</td></tr>";
      }).join("");
      return RT.ul([
        "To craft a card from your hand, <b>activate crafting pieces</b> in clearings matching the suits in the card's bottom-left corner. A crafting piece's suit is its clearing's suit. Each crafting piece can be activated <b>once per turn</b>. A three-colour question mark means a piece of any suit.",
        "<b>Immediate effect</b> (paper box): resolve it, then discard the card. If it shows an <b>item</b>, take that item from the item supply on the map into your Crafted Items box and score the card's points. If the item isn't in the supply, you can't craft the card.",
        c.vbH ? "<b>Vagabond:</b> crafted items go face up into his Satchel or onto their item track — he has no Crafted Items box." : "",
        c.human("eyrie") ? "<b>Eyrie Dynasties — Disdain for Trade:</b> when they craft an item they score only 1 point, not the card's points (extra crafting points from effects such as Master Engravers still count). While the <b>Builder</b> is their leader, they ignore this and score normally." : "",
        "<b>Persistent effect</b> (stone box): place the card in your play area; you now have its effect. You can't craft one if you already have an identical one.",
        "Ambush and dominance cards can't be crafted."
      ]) + (rows ? "<table class='rt'><thead><tr><th>Faction</th><th>Crafts by activating…</th></tr></thead><tbody>" + rows + "</tbody></table>" : "") + RT.excHtml(c, "craft");
    },
    src: function (c) {
      var parts = ["Law p.3 §2.1.2–2.1.3, §3.2.2", "Law p.4 §4.1", "LtP p.7"].concat(c.humanFacs.map(function (id) { return RT.F[id].craftSrc; }),
        [c.human("eyrie") ? "Law p.6–7 §7.2.3, §7.8.1" : ""], RT.excItems(c, "craft").map(function (e) { return e.srcFn ? e.srcFn(c) : e.src; }));
      return RT.join(parts.filter(function (s, i, a) { return s && a.indexOf(s) === i; }));
    } },

  { id: "terms", title: "Pieces and key terms",
    when: function () { return true; },
    html: function () {
      return RT.ul([
        "<b>Piece limits:</b> pieces are limited to what's in the game — no proxies if you run out. If told to place, take or remove pieces and you can't do it fully, do the most you can (this doesn't let you skip costs).",
        "<b>Faction pieces</b> are the warriors, pawns, buildings and tokens listed on the back of your faction board — not items. Their ownership never changes.",
        "<b>Warriors and pawns</b> are wooden; <b>buildings</b> are square cardboard (fill slots, count for rule); <b>tokens</b> are round cardboard (no slot, no rule); <b>items</b> are square cardboard owned by no faction.",
        "<b>Place:</b> take the piece from its supply (or the leftmost one on its track) and put it where prompted.",
        "<b>Remove:</b> return it to its owner's supply, or to the rightmost empty space of its track; items are removed permanently.",
        "<b>Replace:</b> remove one piece and place another where it was — you must be able to do both.",
        "<b>Spend</b> = discard (used where you have a choice). <b>Reveal</b> = place the card face up in your play area. <b>Swap</b> switches two pieces, ignoring move and place restrictions.",
        "<b>Enemy:</b> any other player you're not in a coalition with. <b>Treat:</b> pieces you treat as your own for rule aren't enemy pieces, but still belong to their faction.",
        "<b>Force:</b> when you force a player to act, resolve it as if they chose it, within the effect's limits; a forced battle's decisions are theirs.",
        "If pieces are removed at the same time and that triggers effects, remove them all first, then trigger the effects."
      ]);
    },
    src: function () { return "Law p.2–3 §1.5 · p.25–26 App. G"; } },

  { id: "golden", title: "Golden rules and table talk",
    when: function () { return true; },
    html: function () {
      return RT.ul([
        "<b>Precedence:</b> a card beats the Law; the Law beats the Learning to Play guides. If you can follow both a general rule and a faction or hireling rule, follow both; if not, follow the faction or hireling rule.",
        "<b>Cannot</b> is absolute unless something explicitly overrides it.",
        "<b>Unclear order or chooser:</b> the player taking their turn decides.",
        "If the rules don't forbid something within an action, you may do it; but follow the literal wording, not instinct — a term means only itself (“move” is not “place”).",
        "<b>Deals</b> are allowed but non-binding. Cards are given to other players only when a rule says so. Actions <b>never</b> require consent."
      ]);
    },
    src: function () { return "Law p.2 §1.1–1.3, Reading the Law"; } }
];

/* ---------- the four base factions (Law §6–9) ---------- */
RT.factionRef.marquise = { title: "Marquise de Cat",
  html: function () {
    return "<p>The Marquise occupies the Woodland and scores by <b>building</b>: the more of one building type she has on the map, the more points she scores. Fuel it with an interconnected economy of <b>wood</b>.</p>" +
      "<h4>Abilities</h4>" + RT.ul([
        "<b>Crafting:</b> during Daylight, by activating <b>workshops</b>.",
        "<b>The Keep:</b> only the Marquise can place pieces in the keep's clearing (others may move in). If the keep is removed, it never returns.",
        "<b>Field Hospitals:</b> while the keep is on the map, whenever any number of Marquise warriors are removed from a clearing, she may spend a card matching that clearing to place them at the keep instead of her supply."
      ]) + "<h4>Birdsong</h4>" + RT.ul(["Place <b>one wood</b> at each sawmill (one per sawmill in a clearing)."]) +
      "<h4>Daylight</h4><p>First, craft with workshops. Then take <b>up to three actions</b>, plus <b>one per bird card you spend</b> (not as part of an action), in any order and number:</p>" + RT.ul([
        "<b>Battle.</b>",
        "<b>March:</b> up to two moves.",
        "<b>Recruit:</b> one warrior at <b>each</b> recruiter — only once per turn.",
        "<b>Build:</b> choose a clearing you rule with an open slot and a building type; take the leftmost building of that type from your board. Pay its cost by removing wood from the chosen clearing, adjacent clearings you rule, or clearings linked to it through any number of clearings you rule. Place it and score the points it uncovers.",
        "<b>Overwork:</b> spend a card matching the clearing of a sawmill to place one wood there."
      ]) + "<h4>Evening</h4>" + RT.ul(["Draw one card, plus one per uncovered draw bonus (the recruiter track); discard down to five."]) +
      "<h4>Buildings track (cost and points, in the order you build them)</h4>" +
      "<table class='rt'><thead><tr><th>Built</th><th>1st</th><th>2nd</th><th>3rd</th><th>4th</th><th>5th</th></tr></thead><tbody>" +
      "<tr><td>Wood cost</td><td>1</td><td>2</td><td>3</td><td>3</td><td>4</td></tr>" +
      "<tr><td>Sawmill</td><td>+1</td><td>+2</td><td>+3</td><td>+4</td><td>+5</td></tr>" +
      "<tr><td>Workshop</td><td>+2</td><td>+2</td><td>+3</td><td>+4</td><td>+5</td></tr>" +
      "<tr><td>Recruiter</td><td>+1</td><td>+2 · draw +1</td><td>+3</td><td>+3 · draw +1</td><td>+4</td></tr></tbody></table>" +
      "<p class='inline-note'>Your setup building of each type sat on the leftmost (cost 0) space. A building returned to your board doesn't cost you points.</p>";
  },
  src: function () { return "Law p.5–6 §6 · LtP p.4 (faction board), p.10–11 · Walkthrough PDF p.4–5"; } };

RT.factionRef.eyrie = { title: "Eyrie Dynasties",
  html: function (c) {
    return "<p>The Eyrie retake the Woodland by building <b>roosts</b> and score each Evening for the roosts on the map — but their leader binds them to the <b>Decree</b>, an ever-growing list of actions they must take every turn or fall into <b>turmoil</b>.</p>" +
      "<h4>Abilities</h4>" + RT.ul([
        "<b>Crafting:</b> during Daylight, before resolving the Decree, by activating <b>roosts</b>.",
        "<b>Lords of the Forest:</b> the Eyrie rule a clearing when <b>tied</b> for most warriors and buildings there, if they have at least one Eyrie piece there." +
          (c.fac("lizard") ? " <i>The Lizard Cult's Pilgrims override this: the Cult rules wherever it has a garden.</i>" : ""),
        "<b>Disdain for Trade:</b> crafting an item scores only <b>1 point</b>, not the card's listed points (extra crafting points from effects such as Master Engravers still count)."
      ]) + "<h4>Birdsong</h4>" + RT.ol([
        "<b>Emergency Orders:</b> if you have no cards in hand, draw one.",
        "<b>Add to the Decree:</b> you <b>must</b> add one or two cards from your hand to any Decree columns (any number per column); at most <b>one</b> may be a bird.",
        "<b>A New Roost:</b> if you have no roosts on the map, place a roost and three warriors in a clearing with the fewest warriors where all those pieces can be placed."
      ]) + "<h4>Daylight</h4>" + RT.ol([
        "<b>Craft</b> with roosts.",
        "<b>Resolve the Decree</b>, leftmost column first. Resolve every card in a column, in any order; each card's action happens in a clearing <b>matching the card</b>:" + RT.ul([
          "<b>Recruit:</b> place a warrior in a matching clearing with a roost.",
          "<b>Move:</b> move at least one warrior from a matching clearing.",
          "<b>Battle:</b> initiate a battle in a matching clearing.",
          "<b>Build:</b> place a roost in a matching clearing you rule that has no roost (and an open slot)."]) +
          "If you can't fully take an action, you fall into <b>turmoil</b> at once. (An empty column is fine — you just skip it.)"
      ]) + "<h4>Turmoil</h4>" + RT.ol([
        "<b>Humiliate:</b> lose one point per bird card in the Decree (Loyal Viziers included).",
        "<b>Purge:</b> discard every Decree card except the Loyal Viziers.",
        "<b>Depose:</b> flip your leader face down and set it aside; choose a new leader from those face up and tuck the Viziers where it lists. (None face up? Flip them all face up — a new clutch.)",
        "<b>Rest:</b> end Daylight and begin Evening."
      ]) + "<h4>Evening</h4>" + RT.ol([
        "<b>Score</b> the points on the rightmost empty space of your Roosts track.",
        "<b>Draw</b> one card plus one per uncovered draw bonus; discard down to five."
      ]) + "<h4>Leaders</h4><table class='rt'><thead><tr><th>Leader</th><th>Viziers start on</th><th>Ability</th></tr></thead><tbody>" +
      "<tr><td>Builder</td><td>Recruit, Move</td><td>Ignore Disdain for Trade when crafting.</td></tr>" +
      "<tr><td>Charismatic</td><td>Recruit, Battle</td><td>Each Recruit action places <b>two</b> warriors.</td></tr>" +
      "<tr><td>Commander</td><td>Move, Battle</td><td>As attacker in battle, deal an extra hit.</td></tr>" +
      "<tr><td>Despot</td><td>Move, Build</td><td>Removing at least one enemy building or token in battle scores one extra point (two in total).</td></tr></tbody></table>" +
      RT.frogNote(c, "eyrie");
  },
  src: function (c) { return RT.join(["Law p.6–7 §7 · LtP p.12–13 · Walkthrough PDF p.15", c.fac("lizard") ? "Law p.11 §10.2.4" : "", RT.hasBot && RT.hasBot(c, "lizbot") ? "Rootbotics p.15 §8.2.1" : "", c.fac("diaspora") ? "Homeland p.3" : ""]); } };

RT.factionRef.alliance = { title: "Woodland Alliance",
  html: function (c) {
    return "<p>The Alliance wins over the Woodland with <b>sympathy</b> (each token placed scores), paid for by <b>supporters</b>, and turns sympathy into violent <b>revolts</b> that found bases and train <b>officers</b>.</p>" +
      "<h4>Abilities</h4>" + RT.ul([
        "<b>Crafting:</b> during Daylight, by activating <b>sympathy tokens</b>.",
        "<b>Guerrilla War:</b> when defending, the Alliance deals hits equal to the <b>higher</b> roll and the attacker the lower.",
        "<b>Supporters stack:</b> cards spent for their suit only; face down, but you may look; they don't count against your hand. With <b>no base</b> on the map the stack holds at most <b>five</b> (extra cards are discarded); with a base, unlimited.",
        "<b>Removing a base:</b> discard every supporter matching the base's clearing (birds included) and remove half your officers, rounded up. If no bases remain and you have more than five supporters, discard down to five.",
        "<b>Sympathy:</b> 10 tokens, at most one per clearing (sympathetic vs unsympathetic clearings).",
        "<b>Outrage:</b> whenever another player removes a sympathy token or <b>moves</b> warriors into a sympathetic clearing, they must add a matching card from hand to your Supporters stack. If they have none (not even a bird), they show you their hand and you draw a card from the deck onto the stack. (Placing pieces there doesn't trigger it.)"
      ]) + "<h4>Birdsong</h4>" + RT.ol([
        "<b>Revolt</b>, any number of times: choose a sympathetic clearing with no base that matches a base still on your board; spend <b>two supporters</b> of its suit. Remove <b>all enemy pieces</b> there (scoring for buildings and tokens), place the matching base, place warriors equal to the number of sympathetic clearings matching the base's printed suit, and put one warrior in the Officers box.",
        "<b>Spread Sympathy</b>, any number of times: choose an unsympathetic clearing adjacent to a sympathetic one (any clearing if none are sympathetic). Spend supporters of its suit — the number shown above the next token on your Sympathy track — plus <b>one more</b> if that clearing has 3+ warriors of another player (<b>Martial Law</b>" + (c.human("riverfolk") || c.hire ? " — counting warriors they treat as their own for rule, such as Riverfolk Mercenaries or hirelings" : "") + "). Place the token and score the points it uncovers."
      ]) + "<h4>Daylight</h4><p>Any order and number:</p>" + RT.ul([
        "<b>Craft</b> with sympathy.",
        "<b>Mobilize:</b> add a card from your hand to the Supporters stack.",
        "<b>Train:</b> spend a card matching the clearing of a base on the map to put a warrior in the Officers box."
      ]) + "<h4>Evening</h4>" + RT.ol([
        "<b>Military operations</b>, up to your number of officers, in any order: <b>Move</b> (one move), <b>Battle</b>, <b>Recruit</b> (a warrior at a base), <b>Organize</b> (remove an Alliance warrior from an unsympathetic clearing to place sympathy there and score it). Without officers you can't move or battle.",
        "<b>Draw</b> one card plus one per uncovered draw bonus; discard down to five."
      ]) + RT.frogNote(c, "alliance");
  },
  src: function (c) { return RT.join(["Law p.7–8 §8 · LtP p.14–16 · Walkthrough PDF p.17", c.human("riverfolk") || c.hire ? "Law p.8 §8.4.2.IIa" : "", c.fac("diaspora") ? "Homeland p.7" : ""]); } };

RT.vagabondRefHtml = function (c) {
  return "<p>The Vagabond plays all sides: he scores by improving <b>relationships</b> through Aid, by removing warriors of factions <b>Hostile</b> to him, by exploring ruins and by completing <b>quests</b>. Everything he does costs <b>items</b>.</p>" +
    "<h4>Items</h4>" + RT.ul([
      "Item icons: boots, bag, crossbow, hammer, sword, tea, coins, torch.",
      "Items are face up or face down, damaged or undamaged. <b>Exhaust</b> = flip a face-up undamaged item face down to take an action.",
      "<b>Tea, coins and bags</b> have their own tracks (3 spaces each): whenever one is face up in the Satchel, put it on an empty space of its track if you can; when one on a track is flipped face down (exhausted), it moves to the Satchel. Boots, swords, crossbows, hammers and torches go face up in the <b>Satchel</b>.",
      "<b>Taking hits:</b> damage one undamaged item per hit (it goes to the Damaged box); with none left, ignore further hits."
    ]) + "<h4>Abilities</h4>" + RT.ul([
      "<b>Crafting:</b> exhaust one hammer per crafting icon; his pawn is the crafting piece (no once-per-turn limit) and his clearing must match every icon. A crafted item may be taken at once, face up.",
      "<b>Lone Wanderer:</b> his pawn is not a warrior — he can't rule or block rule — and it can never be removed. If an enemy effect removes <b>all enemy pieces</b> in his clearing (revolts, Favor cards, bombs…), he damages three items.",
      "<b>Nimble:</b> he moves regardless of who rules either clearing.",
      "<b>Battle:</b> maximum rolled hits = undamaged swords (face up or down); <b>defenseless</b> with no undamaged sword.",
      "<b>Forests:</b> only Slip enters a forest; other moves can only leave one, into an adjacent clearing."
    ]) + "<h4>Relationships</h4>" + RT.ul([
      "Each non-Vagabond faction has a marker on your chart: <b>Indifferent → +1 → +2 → Allied (+2)</b>, or the <b>Hostile</b> box.",
      "<b>Improve:</b> in a single turn, Aid a non-Hostile faction the number of times shown between its space and the next — <b>1, then 2, then 3</b> Aids — and score the points on the new space.",
      "<b>Allied:</b> each later Aid to that faction scores <b>2</b>. When you move you may force one Allied faction's warriors to move with you; at the start of a battle you attack in, you may treat one Allied faction's warriors there as your own (max rolled hits = their warriors + your undamaged swords; not against that same faction). If you take more hits on Allied warriors than on your items in that battle, they become Hostile.",
      "<b>Hostile:</b> removing a warrior of a non-Hostile faction makes it Hostile. <b>Infamy:</b> each piece of a Hostile faction you remove in battle on your turn scores one extra point (not the warrior that made it Hostile). Moving into a clearing with Hostile warriors costs <b>an extra boot</b>, even if forced. You can still Aid a Hostile faction to take its items, but never improve it."
    ]) + "<h4>Birdsong</h4>" + RT.ol([
      "<b>Refresh:</b> flip two exhausted items face up per face-up tea on the Refresh track (not counting tea flipped now), then three more.",
      "<b>Slip:</b> you may move into an adjacent clearing <b>or forest</b> without exhausting boots, even into a Hostile clearing; this ignores effects that stop movement out of a clearing."
    ]) + "<h4>Daylight</h4><p>Exhaust items for these actions, in any order and number:</p>" + RT.ul([
      "<b>Move</b> (boots; one more if the destination has Hostile warriors). Not into a forest.",
      "<b>Battle</b> (sword).",
      "<b>Explore</b> (torch): take an item from under a ruin in your clearing, reveal it and place it face up; <b>+1 point</b>. Remove the ruin when its last item is taken.",
      "<b>Aid</b> (any item): give a card matching your clearing to a player with faction pieces there (even Hostile); you may take one item from their Crafted Items box.",
      "<b>Quest:</b> pick a face-up quest matching your clearing and exhaust the two items it lists. Then score <b>1 point per completed quest of that suit</b> (this one included) or draw two cards; draw a new quest.",
      "<b>Strike</b> (crossbow): remove an enemy warrior in your clearing — or, if that enemy has no warriors there, another of its faction pieces.",
      "<b>Repair</b> (hammer): move a damaged item back to the Satchel, keeping its side.",
      "<b>Craft</b> (hammers), and your character's <b>Special Action</b> (exhausting the items it lists)."
    ]) + "<h4>Evening</h4>" + RT.ol([
      "<b>Rest:</b> if you're in a forest, repair all damaged items and flip them face up.",
      "<b>Draw</b> one card plus one per face-up coins on the Coins track.",
      "<b>Discard</b> down to five cards.",
      "<b>Item capacity:</b> six plus two per face-up bag on the Bags track; remove any excess from the Satchel and Damaged box permanently."
    ]) + (c.twovb ? "<h4>Two Vagabonds</h4>" + RT.ul([
      "Each ruin holds <b>two</b> “R” items. Whoever explores (or razes) a ruin with two items looks at both and takes one; a second Explore can take the other.",
      "You can't take an “R” item if you already have the same type of “R” item on your board. Exploring without taking an item scores nothing, but the torch is still exhausted.",
      c.human("vagabond") && c.human("vagabond2") ? "The three face-up quests are shared: either Vagabond may complete any of them." : "The Vagabot keeps its own single quest and completes only that (Rootbotics p.10 §7.3.3, §7.5.2); the three face-up quests are yours."
    ]) : "") + RT.vbExpHtml(c);
};
/* the Vagabond's interactions with expansion factions in play (their own sections hold the full rules) */
RT.vbExpItems = function (c) {
  return [
    c.human("riverfolk") ? { t: "<b>Riverfolk services:</b> you pay by exhausting items — the Riverfolk place one of their own warriors in Payments per item. You can't buy Mercenaries, and removing Mercenaries in a battle against you doesn't make the Riverfolk Hostile.", s: "Law p.12 §11.2.6.III, §11.2.7.IIIb" } : null,
    c.human("council") ? { t: "<b>Twilight Council:</b> Peacekeepers never defend when you're the defender; while Allied with the Council, its warriors attack alongside you. You can't craft at a Governing assembly.", s: "Law p.20 §17.2.3, §17.2.5" } : null,
    c.human("hundreds") ? { t: "<b>Lord of the Hundreds:</b> they can't loot you — you have no Crafted Items box. Their mobs raze ruins too.", s: "Law p.16 §14.2.5, §14.4.1 · Marauder p.6" } : null,
    c.human("corvid") ? { t: "<b>Corvid snares:</b> your Slip ignores them.", s: "Law p.10 §9.4.2" } : null,
    c.human("duchy") ? { t: "<b>The Burrow:</b> only Duchy pieces may enter it.", s: "Law p.13 §12.2.2" } : null
  ].filter(Boolean);
};
RT.vbExpHtml = function (c) { var a = RT.vbExpItems(c); return a.length ? "<h4>With the expansion factions in play</h4>" + RT.ul(a.map(function (x) { return x.t; })) : ""; };
RT.factionRef.vagabond = { title: "Vagabond",
  html: function (c) { return RT.vagabondRefHtml(c); },
  src: function (c) { return RT.join(["Law p.8–11 §9", c.twovb ? "Law p.10–11 §9.7" : "", "LtP p.17–20"].concat(RT.vbExpItems(c).map(function (x) { return x.s; }))); } };
RT.factionRef.vagabond2 = { title: "Second Vagabond",
  html: function (c) { return c.human("vagabond") ? "<p>The second Vagabond plays exactly like the first — see the Vagabond section above, including <b>Two Vagabonds</b>.</p>" : RT.vagabondRefHtml(c); },
  src: function (c) { return c.human("vagabond") ? "Law p.10–11 §9.7" : RT.factionRef.vagabond.src(c); } };

/* ---------- appendices ---------- */
RT.appendix = [
  { id: "vchars", title: "Vagabond characters",
    when: function (c) { return c.human("vagabond") || c.human("vagabond2"); },
    html: function (c) {
      var chosen = [c.human("vagabond") ? c.vchar("vagabond").id : null, c.human("vagabond2") ? c.vchar("vagabond2").id : null];
      var acts = {
        thief: "<b>Steal:</b> exhaust a torch to take a random card from a player with faction pieces in your clearing.",
        tinker: "<b>Day Labor:</b> exhaust a torch to take a card matching your clearing from the discard pile (you can always take a bird).",
        ranger: "<b>Hideout:</b> exhaust a torch to repair three items, then immediately end Daylight and begin Evening.",
        vagrant: "<b>Instigate:</b> exhaust a torch to force a player (even you) to battle a player in your clearing; treat removed buildings and tokens as if you removed them (score them, and Infamy as normal).",
        arbiter: "<b>Protector:</b> when defending in battle, before the roll, a faction may enlist the Arbiter if he's in the clearing: he scores 1 point and adds all his undamaged swords to the defender's maximum rolled hits. He can't enlist himself or be enlisted against himself.",
        scoundrel: "<b>Scorched Earth:</b> exhaust a torch and place it in your clearing to remove all enemy pieces there. Pieces can't be placed in or moved into that clearing (you stay; once you leave you can't return). The torch isn't an enemy piece.",
        adventurer: "<b>Improvise:</b> once per turn while questing, treat one unexhausted item as any other item; when you exhaust it for the quest, also damage it.",
        harrier: "<b>Glide:</b> exhaust a torch to move only your pawn to any clearing (even Hostile), ignoring adjacency and paths, without exhausting boots.",
        ronin: "<b>Swift Strike:</b> you may exhaust a sword to deal an extra hit in battle (after rolling).",
        cheat: "<b>Con:</b> once per turn, resolve the Quest action by exhausting any two items instead of the listed ones (score or draw as normal, draw a new quest), then shuffle the completed quest into the quest deck.",
        gladiator: "<b>Duel:</b> exhaust any item, damage it, and remove 1 enemy warrior from your clearing to draw 1 card. You don't go Hostile.",
        jailor: "<b>Coerce:</b> once per turn, spend a card matching your clearing to treat it as exhausting any item; after the action it prompts or adds to, lose 1 point. It may interrupt actions on your turn (use it to repair, craft, aid, quest and pay for Riverfolk services)."
      };
      var rows = RT.vcharsAvail(c.st).map(function (v) {
        var on = chosen.indexOf(v.id) >= 0;
        return "<tr" + (on ? " class='sel'" : "") + "><td>" + (on ? "<b>" + v.name + "</b> ✓" : v.name) + "<br><span class='muted'>" + (RT.expMeta[v.set] ? RT.expMeta[v.set].name : "") + "</span></td><td>" + RT.itemList(v.items) + "</td><td>" + acts[v.id] + "</td></tr>";
      }).join("");
      return "<p>Characters in your collection (✓ = selected). Starting items are the “S” items.</p><table class='rt'><thead><tr><th>Character</th><th>Starts with</th><th>Special action</th></tr></thead><tbody>" + rows + "</tbody></table>";
    },
    src: function () { return "Law p.28–29 App. V"; } },

  { id: "captains", title: "Knave Captains",
    when: function (c) { return c.human("knaves"); },
    html: function (c) {
      var ab = {
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
      var sel = c.captains.map(function (k) { return k.id; });
      var rows = RT.captains.map(function (k) {
        var on = sel.indexOf(k.id) >= 0;
        return "<tr" + (on ? " class='sel'" : "") + "><td>" + (on ? "<b>" + k.name + "</b> ✓" : k.name) + "</td><td>" + RT.itemList(k.items) + "</td><td>" + ab[k.id] + "</td></tr>";
      }).join("");
      return "<p>All 12 Captain cards (✓ = your three). Homeland includes Captain warriors for the Jailor, Gladiator and Cheat — play your first game with them; the others use the matching Vagabond pawn or a proxy.</p><table class='rt'><thead><tr><th>Captain</th><th>Starting items</th><th>Ability</th></tr></thead><tbody>" + rows + "</tbody></table>";
    },
    src: function () { return "Law p.27 App. K · Homeland p.15"; } },

  { id: "mapref", title: "This map's rules",
    when: function () { return true; },
    html: function (c) {
      var m = c.map;
      if (m === "autumn") return RT.ul(["<b>Autumn map:</b> no special rules. Rivers are not paths and don't divide clearings or forests; they matter only when a rule mentions them — e.g. the Riverfolk Company (and players who buy its river service) and the Lilypad Diaspora treat rivers as paths, and some setups and placements use river clearings."]);
      if (m === "winter") return RT.ul(["<b>Raging River:</b> the river divides forests, as printed paths do.", "Suits are random (suit markers), so faction strengths shift from game to game."]);
      if (m === "lake") return RT.ul([
        "<b>The Lake</b> fills the centre: it is treated as <b>rivers linking every coastal clearing to every other coastal clearing</b>, and it divides forests. It is not a forest.",
        "<b>Coastal clearings</b> touch the lake (not separated by a forest). <b>Coastal forests</b> touch the lake; each is adjacent to its two neighbouring coastal forests, separated by one coastal clearing.",
        "<b>The Ferry:</b> once per turn, when moving from the Ferry's clearing, you may move to any other coastal clearing, ignoring paths; the Ferry moves with you. If faction pieces moved, their player draws a card. You must still rule the origin or destination, even with Swimmers; if several factions' pieces move together, each of their players draws."
      ]);
      if (m === "mountain") return RT.ul([
        "<b>Closed paths:</b> clearings linked only by a closed path are <b>not adjacent</b>, and nothing can be placed on a closed path. Closed paths still enclose and divide forests (the Vagabond can slip across them).",
        "<b>Opening a path:</b> once per turn in your Daylight, if you have faction pieces in either clearing it links, spend a card to remove a closed path marker permanently and score <b>1 point</b>.",
        "<b>The Pass</b> (the Tower's clearing): at the end of your Evening, if you rule the Pass, score <b>1 point</b>. (Tip: put the ruler's warrior on top of the tower.)",
        "Every area enclosed by paths and clearings is a forest, whether or not trees are drawn there."
      ]);
      if (m === "marsh") return RT.ul([
        c.p >= 5 ? "<b>Landmarks:</b> Mousehold, Foxburrow and Rabbittown stand in the three unsuited clearings (see Landmarks)." : "<b>Flooded clearings:</b> a flooded clearing is no longer a clearing — only paths, possibly with flooded paths. Clearings linked by non-flooded paths through it are adjacent.",
        c.p >= 5 ? "" : "<b>Flooded paths</b> link nothing, but enclose and divide forests as paths do (the Vagabond can slip across).",
        c.p >= 5 ? "" : "Pieces that can be placed on paths (such as Highway Bandits) may go on any non-flooded path in a flooded clearing, but not where its paths meet."
      ]);
      if (m === "gorge") return RT.ul([
        "<b>The dam</b> (the wall under the top bridge) separates the forests on either side of it.",
        "<b>The bottom bridge</b> does not separate the forests below it; the path off its right side (drawn orange) doesn't split its forest.",
        "<b>Gorge sides</b> do not separate the forests they're in: a forest is the whole area enclosed by paths."
      ]);
      return "";
    },
    src: function (c) {
      return { autumn: "Law p.27 §M.1 · LtP p.5", winter: "Law p.27 §M.2 · LtP p.23", lake: "Law p.27 §M.3 · Underworld p.6",
        mountain: "Law p.27–28 §M.4 · Underworld p.7", marsh: "Law p.28 §M.5", gorge: "Law p.28 §M.6 · Homeland p.16" }[c.map];
    } },

  { id: "landmarks", title: "Landmarks",
    when: function (c) { return c.lm > 0 || (c.map === "marsh" && c.p >= 5); },
    html: function (c) {
      var three = c.lmPool("foxburrow") || c.lmPool("rabbittown") || c.lmPool("mousehold") || (c.map === "marsh" && c.p >= 5);
      return RT.ul([
        "<b>Safety:</b> landmarks cannot be battled, moved, covered or removed unless a landmark says so.",
        "<b>Ownership:</b> landmarks belong to no one and are not enemy pieces.",
        three ? "<b>Foxburrow</b> (adds fox): while moving, you may treat fox clearings as adjacent to Foxburrow and ignore paths when moving between them." : "",
        three ? "<b>Rabbittown</b> (adds rabbit): once in Daylight, you may spend a rabbit card to place 1 warrior in Rabbittown for each <i>other</i> rabbit clearing with your pieces, then battle in Rabbittown." : "",
        three ? "<b>Mousehold</b> (adds mouse): in battle, whenever a player's warriors are removed from a mouse clearing other than Mousehold, they may place them at Mousehold." : "",
        c.lmPool("pack") ? "<b>Landmarks Pack:</b> each landmark card gives its own setup and rules (not reproduced in these rulebooks)." : ""
      ]);
    },
    src: function (c) { return RT.join(["Law p.27 §L.1", "Homeland p.18", c.lmPool("pack") ? "Law p.25 §C.10" : ""]); } },

  { id: "hirelings", title: "Hirelings",
    when: function (c) { return c.hire; },
    html: function (c) {
      return "<h4>Gaining and losing hirelings</h4>" + RT.ul([
        "<b>From the supply:</b> when your score marker enters a space with a hireling marker (4, 8, 12), take that marker and put it below your Evening. At the <b>end of your turn</b> take any hireling card from the supply, <b>roll for control</b>, and flip the marker.",
        "<b>Roll for control:</b> roll the control die and put that many control markers on the card — counting only the <b>gold pips</b> if you have the most points (or are tied for most), and <b>all pips</b> otherwise (including after activating a dominance card).",
        "<b>Losing interest:</b> at the end of each of your turns, remove one control marker from each hireling you gained on an earlier turn. A hireling with none left must be given, with a hireling marker, to <b>any other player</b> (even the leader), who rolls for control at once."
      ]) + "<h4>Actions and abilities (card icons)</h4>" + RT.ul([
        "<b>When-hired action:</b> the new controller must take it on gaining control.",
        "<b>Ability:</b> always active, or says when it happens.",
        "<b>Start-of-Birdsong action:</b> the controller must or may take it at the start of their Birdsong, as written.",
        "<b>Once-per-Daylight action:</b> the controller may take it once in their Daylight.",
        "Text starting “<b>Controller:</b>” is gained by the controlling player. Promoted hirelings have pieces; Demoted ones usually give abilities instead."
      ]) + "<h4>Rules</h4>" + RT.ul([
        "<b>Rule:</b> the controller treats hireling pieces as their own <b>only for rule</b> (and can rule with hirelings alone — even Lords of the Forest applies). Uncontrolled hirelings rule clearings as if they were players.",
        "<b>Enemies:</b> a hireling is an enemy to everyone except its controller (and players in coalition with them) — including while it sits in the supply.",
        "<b>Separate:</b> hireling pieces aren't the controller's faction pieces; their Move and Battle actions use only hireling pieces; hirelings can't act any other way (not your moves, False Orders or the Vagabond's Allied rules), and can't use your abilities, persistent effects or ambush cards. You can't play an ambush when someone battles your hireling.",
        "<b>No scoring:</b> you don't score when your hireling removes enemy pieces. Others still score for removing hireling buildings and tokens, even when defending in battle against the hireling" + (c.has("hpacks") ? ", and players score as normal when the Warm Sun Prophets force their faction pieces to battle" : "") + ".",
        "<b>Weird stuff:</b> effects worded “when a player moves” or “removes” — Outrage, the Ferry — trigger when hireling pieces are used."
      ]);
    },
    src: function () { return "Law p.26–27 App. H · Marauder p.12–16"; } },

  { id: "tweaks", title: "Rules tweaks, extra pieces and game improvements",
    when: function (c) { return c.has("marauder") || c.has("homeland") || c.deck === "ep"; },
    html: function (c) {
      var h = "";
      if (c.has("marauder") || c.deck === "ep") h += "<h4>Rules Tweaks (Marauder)</h4>" + RT.ul([
        c.has("marauder") ? "<b>Starting corner clearings</b> are the corners holding the Marquise's keep, the Eyrie's starting roost, the Cult's starting garden, the Duchy's starting tunnel or the Keepers' starting warriors." + (c.has("homeland") ? " The Twilight Council (Homeland, published after that list) also starts in a corner: the Law calls its 4-warrior corner its starting clearing (Law p.20 §17.3.2), so count it as a starting corner clearing too." : "") + " Older factions now use this wording (e.g. the Eyrie set up opposite another player's starting corner clearing, not the keep specifically). With five or more corner-starting factions, use Advanced Setup." : "",
        c.has("marauder") ? "<b>Faction pieces</b> means the warriors, pawns, buildings and tokens listed on your faction board's back — not items, hirelings, Riverfolk mercenary warriors or a Vagabond's Allied factions' pieces. Many Law rules now use the term — the Vagabond's Aid, the Corvids' Exposure, the Keepers' Encamp and the Hundreds' Oppress among them." : "",
        "<b>Force and False Orders:</b> “force” is the term for making another player act. False Orders (Exiles and Partisans deck) now reads: “In Birdsong, may discard this card to force an enemy to move half their faction warriors (round up) from a clearing you choose to a clearing you choose, ignoring rule.” It works exactly as before."
      ]);
      if (c.has("marauder")) h += "<h4>Extra pieces (Marauder)</h4>" + RT.ul([
        "Score markers with faction faces (rather than “VP”) for all the earlier factions.",
        "An extra set of Underworld relationship markers, for games with two Vagabonds."
      ]);
      if (c.has("homeland")) h += "<h4>Game Improvements (Homeland)</h4>" + RT.ul([
        "<b>Advanced setup cards</b> for the Lilypad Diaspora, Twilight Council and Knaves of the Deepwood. The other factions' setup cards come in the Marauder expansion" + (c.has("marauder") ? "." : " — not in this collection."),
        "<b>Updated cards</b> replace cards from the base game, Riverfolk and the Exiles and Partisans deck, with wording compatible with later content.",
        "<b>Reminder markers</b> sit next to your phases to remind you of crafted effects and faction abilities that trigger then (such as the Riverfolk Company's services).",
        "<b>Extra items, ruins and dice:</b> a full set of ruins and items and battle dice in a new colour, so you can run two games at once with a second deck (Exiles and Partisans, or Squires and Disciples)."
      ]);
      return h;
    },
    src: function (c) { return RT.join([c.has("marauder") || c.deck === "ep" ? "Marauder p.19" : "", c.has("marauder") ? "Marauder p.20" : "", c.has("homeland") ? "Homeland p.19" : "", c.has("marauder") && c.has("homeland") ? "Law p.20 §17.3.2" : ""]); } },

  { id: "twop", title: "Two players",
    when: function (c) { return c.two; },
    html: function (c) {
      return RT.ul([
        "Remove all four <b>dominance cards</b> in setup" + (c.fac("diaspora") ? " (and the Frog Dominance card)" : "") + ".",
        c.anyBot ? "" : "The two-player game is best played as <b>two full games</b> (30–45 minutes each): record scores, trade factions, play again, and add both games' scores.",
        c.adv && c.advCards ? "Advanced Setup: remove the insurgent setup cards before dealing (keep them only with hirelings, if adventurous)." + (c.has("marauder") ? " The Woodland Alliance's card is insurgent." : "") + (c.has("homeland") ? " The Twilight Council's card is insurgent." : "") : "",
        c.hire ? "Hirelings: all three stay Promoted." : "",
        c.vbH ? "The Vagabond's coalitions need four or more players." : ""
      ]);
    },
    src: function (c) { return RT.join(["Law p.5 §5.1.3", c.fac("diaspora") ? "Law p.19 §16.3.3" : "", c.anyBot ? "" : "LtP p.22", c.adv && c.advCards ? "Law p.23 §A.8.2.I" : "", c.adv && c.advCards && c.has("marauder") ? "Marauder p.18" : "", c.adv && c.advCards && c.has("homeland") ? "Homeland p.19" : "", c.hire ? "Marauder p.12" : "", c.vbH ? "Law p.9 §9.2.8" : ""]); } }
];

/* "This map's rules" also lists the bots' map rules (data-bots.js RT.coreExc.mapref) */
(function () {
  var mr = RT.appendix.filter(function (s) { return s.id === "mapref"; })[0];
  var base = mr.html, baseSrc = mr.src;
  mr.html = function (c) { return base(c) + RT.excHtml(c, "mapref", "Bots on this map"); };
  mr.src = function (c) { return RT.join([baseSrc(c), RT.excSrc(c, "mapref")]); };
})();

/* The reference for the current configuration: core rules, then playing with bots (if any), each faction in play, then appendices. */
RT.referenceFor = function (c) {
  var out = [];
  RT.core.forEach(function (s) { if (s.when(c)) out.push({ id: s.id, title: s.title, html: s.html(c), src: s.src(c) }); });
  var g = RT.botRef._general;
  if (c.anyBot) out.push({ id: "bots", title: g.title(c), html: g.html(c), src: g.src(c) });
  c.facs.forEach(function (id) {
    var bt = c.bot(id);
    if (bt) {
      var br = RT.botRef[bt];   // every bot type has one (data-bots.js)
      out.push({ id: "bot-" + id, title: RT.F[id].name + " — " + br.title + " (bot)", html: br.html(c), src: br.src(c) });
      return;
    }
    var r = RT.factionRef[id];   // every faction has one (data-ref.js: base four; data-factions.js: the nine expansion factions)
    out.push({ id: "f-" + id, title: r.title, html: r.html(c), src: r.src(c) });
  });
  RT.appendix.forEach(function (s) { if (s.when(c)) { var h = s.html(c); if (h) out.push({ id: s.id, title: s.title, html: h, src: s.src(c) }); } });
  return out;
};
