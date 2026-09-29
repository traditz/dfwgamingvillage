/*
 * Marvel Champions: The Card Game — Rules Reference & Setup player aid
 * DATA LAYER (plain browser script, no modules, no build step).
 *
 * Every rule here is a paraphrase of, and cites, one of the two official rulebooks:
 *   RR  = Rules Reference v1.8  (Golden Rules p.4 · Glossary p.4–49 · App. I Deck Customization p.50 ·
 *         App. II Setup p.51 · App. III Card Anatomy p.52–56 · App. IV FAQ p.57–65 · App. V Errata p.65–70 ·
 *         App. VI Game Environments (beta) p.71)
 *   LtP = Learn to Play (24 pages)
 * PDF page number = printed page number in both books. Where the two books differ, the RR wins (RR p.4).
 *
 * Functions (d / when / body / intro) receive the app's config object c:
 *   c.players 1..4 · c.mode "standard"|"expert" · c.heroic 0..5 · c.skirmish · c.campaign · c.pool
 *   c.scn (scenario object or null) · c.setName(id) · c.modulars (chosen modular set ids)
 * Allowed markup in strings: <b> <i> <ul><li> <br>.
 */
const MC = {};

(function () {
  "use strict";

  /* ------------------------------------------------------------------ helpers */
  const arr = (a) => (Array.isArray(a) ? a.filter((x) => x !== null && x !== undefined && x !== "") : []);
  const players = (c) => {
    const n = Math.floor(Number(c && c.players));
    return n >= 1 && n <= 4 ? n : 1;
  };
  const heroic = (c) => {
    const h = Math.floor(Number(c && c.heroic));
    return h > 0 ? h : 0;
  };
  const modeName = (c) => (c && c.mode === "expert" ? "expert" : "standard");
  const scn = (c) => (c && c.scn && typeof c.scn === "object" ? c.scn : null);
  const scnName = (c) => {
    const s = scn(c);
    return s && s.name ? String(s.name) : "";
  };
  const nm = (c, id) => {
    let n = null;
    try {
      if (c && typeof c.setName === "function") n = c.setName(id);
    } catch (e) {
      n = null;
    }
    return n === null || n === undefined || n === "" ? String(id) : String(n);
  };
  const villainDeck = (c) => {
    const s = scn(c);
    if (!s || !s.villainDeck || typeof s.villainDeck !== "object") return [];
    return arr(s.villainDeck[modeName(c)]);
  };
  const plural = (n, one, many) => (n === 1 ? one : many);
  const WORDS = ["zero", "one", "two", "three", "four", "five", "six"];
  const word = (n) => WORDS[n] || String(n);
  const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);
  const ul = (items) => {
    const list = arr(items);
    return list.length ? "<ul>" + list.map((i) => "<li>" + i + "</li>").join("") + "</ul>" : "";
  };
  const joinAnd = (list) => {
    const l = arr(list);
    if (l.length <= 1) return l.join("");
    return l.slice(0, -1).join(", ") + " and " + l[l.length - 1];
  };
  const sameSet = (a, b) => a.length === b.length && a.every((x) => b.indexOf(x) >= 0);

  /* ------------------------------------------------------------------ sources */
  MC.sources = {
    rr: { name: "Rules Reference v1.8", short: "RR" },
    ltp: { name: "Learn to Play", short: "LtP" },
  };

  /* ------------------------------------------------------------------ setup */
  MC.phases = ["1 · Choose Heroes", "2 · Scenario & Encounter Deck", "3 · Scenario Setup", "4 · Draw & Mulligan"];

  // One entry per official setup step (RR Appendix II, p.51 — 16 steps). n = official step number.
  MC.setup = [
    {
      n: 1,
      ph: 0,
      t: "Select identities",
      src: "RR p.51 (step 1) · LtP p.4 (step 1)",
      d: (c) => {
        const n = players(c);
        return (
          "Each player chooses <b>one identity</b> (the hero/alter-ego card) and places it <b>alter-ego side up</b> — everyone starts the game in alter-ego form. <i>(RR p.23)</i>" +
          ul([
            n === 1
              ? "Solo: one identity."
              : cap(word(n)) + " players, " + word(n) + " identities — players can't choose identities that <b>match</b> (see Uniqueness). A villain may match a hero. <i>(RR p.45)</i>",
            "Before this step, set aside any cards with the <b>permanent</b> keyword — other cards put them into play later <i>(RR p.32)</i>. <b>Linked</b> cards your decks call for are also set aside at the start of setup <i>(RR p.27)</i>.",
          ])
        );
      },
    },
    {
      n: 2,
      ph: 0,
      t: "Set hit points",
      src: "RR p.51 (step 2) · LtP p.4 (step 2)",
      d: "Each player sets their <b>hit point dial</b> to the starting hit points printed at the bottom of their identity card.",
    },
    {
      n: 3,
      ph: 0,
      t: "Select first player",
      src: "RR p.51 (step 3) · LtP p.4 (step 3)",
      d: (c) =>
        "As a group, choose a <b>first player</b> and give them the first player token." +
        (players(c) === 1
          ? " Playing solo, that's you."
          : " The first player goes first each round, makes the choices encounter cards leave open, and orders simultaneous effects; the token passes clockwise at the end of every round. <i>(RR p.19–20)</i>"),
    },
    {
      n: 4,
      ph: 0,
      t: "Set aside obligations",
      src: "RR p.51 (step 4) · LtP p.4 (step 4)",
      d: (c) => {
        const n = players(c);
        return (
          "For each identity being played, <b>set aside its obligation card</b> — " +
          (n === 1 ? "at least one card" : "at least " + word(n) + " cards") +
          " (an identity can have more than one). They are shuffled into the encounter deck in step 10. <i>(RR p.30)</i>"
        );
      },
    },
    {
      n: 5,
      ph: 0,
      t: "Set aside nemesis sets",
      src: "RR p.51 (step 5) · LtP p.5 (step 5), p.17",
      d:
        "For each identity, set aside its <b>nemesis</b> and that nemesis's encounter cards (they share a common label), out of play. " +
        "They stay out of play until an encounter card calls for them. When a card puts a player's nemesis side scheme into play, that player's nemesis minion also enters play engaged with them and the rest of the set goes to the encounter discard pile — unless the card says otherwise. <i>(RR p.30 · LtP p.6, 17)</i>",
    },
    {
      n: 6,
      ph: 0,
      t: "Shuffle player decks",
      src: "RR p.51 (step 6) · LtP p.5 (step 6)",
      d: "Each player <b>shuffles their player deck</b> and keeps it beside their identity card. Starter decks: the decklist is on the back of the deck's title card — don't shuffle that card in.",
    },
    {
      n: 7,
      ph: 0,
      t: "Collect tokens and status cards",
      src: "RR p.51 (step 7) · LtP p.5 (step 7)",
      d: "Put the <b>damage tokens, threat tokens, acceleration tokens and all-purpose counters</b> in one shared supply everyone can reach, and set the <b>stunned, confused and tough</b> status cards in stacks next to it. There is no limit on these — use coins or other tokens if you run out. <i>(RR p.4)</i>",
    },
    {
      n: 8,
      ph: 1,
      t: "Select scenario",
      src: "RR p.51 (step 8) · LtP p.6 (step 8)",
      d: (c) => {
        const s = scn(c);
        const m = modeName(c);
        const items = [];
        if (s) {
          const vd = villainDeck(c);
          const ms = arr(s.mainSchemeDeck);
          items.push(
            vd.length
              ? "<b>Villain deck (" + m + "):</b> " + vd.join(" → ")
              : "<b>Villain deck:</b> use the " + m + " villain stages listed for " + (scnName(c) || "this scenario") + "."
          );
          if (ms.length) items.push("<b>Main scheme deck:</b> " + ms.join(" → "));
          if (s.src) items.push("<i>Scenario contents per " + s.src + ".</i>");
        } else {
          items.push(
            m === "expert"
              ? "<b>Expert:</b> use the scenario's listed expert villain stages (core set: remove stage I and add stage III). <i>(RR p.28 · LtP p.23)</i>"
              : "<b>Standard:</b> use the scenario's standard villain stages (core set: stages I and II). <i>(LtP p.23)</i>"
          );
        }
        if (c && c.skirmish) {
          items.push("<b>Skirmish:</b> choose <b>any one</b> version of the villain. Put only that card into play and remove the other villain cards from the game. <i>(RR p.29)</i>");
        }
        return (
          "Put the scenario's <b>villain deck</b> and <b>main scheme deck</b> into play in the center of the table. Stack the villain stages in order, first stage on top; the first main scheme goes in <b>1A side up</b>. <i>(LtP p.6)</i>" +
          ul(items)
        );
      },
    },
    {
      n: 9,
      ph: 1,
      t: "Set the villain's hit points",
      src: "RR p.51 (step 9) · LtP p.6 (step 9)",
      d: (c) => {
        const n = players(c);
        const vd = villainDeck(c);
        let h =
          "Set the <b>villain's hit point dial</b> to the hit points on the villain card multiplied by the number of players — <b>× " +
          n +
          "</b> — as its per-player icon shows.";
        if (vd.length && !(c && c.skirmish)) h += " Start with <b>" + vd[0] + "</b>.";
        if (c && c.skirmish) h += " Use the single version you chose for skirmish.";
        h += " <i>Example" + (n <= 2 ? " (LtP p.6)" : "") + ": Rhino (I) has 14 per player → " + 14 * n + " with " + n + " " + plural(n, "player", "players") + ".</i>";
        h += " When a stage is defeated, reveal the next and reset the dial to its value. <i>(RR p.47)</i>";
        return h;
      },
    },
    {
      n: 10,
      ph: 1,
      t: "Create the encounter deck",
      src: "RR p.51 (step 10) · LtP p.6 (step 11), p.23",
      d: (c) => {
        const n = players(c);
        const s = scn(c);
        const m = modeName(c);
        const h = heroic(c);
        const items = [];
        let chosen = [];
        let rec = [];
        if (s) {
          const sets = arr(s.encounterSets).filter((id) => arr(s.requiredModulars).indexOf(id) < 0).map((id) => nm(c, id));
          if (sets.length) items.push("<b>Scenario " + plural(sets.length, "set", "sets") + ":</b> " + sets.join(", "));
          const req = arr(s.requiredModulars);
          chosen = arr(c.modulars).filter((id) => req.indexOf(id) < 0 && arr(s.encounterSets).indexOf(id) < 0);
          rec = arr(s.recommendedModulars);
          if (req.length) items.push("<b>Required modular " + plural(req.length, "set", "sets") + ":</b> " + req.map((id) => nm(c, id)).join(", "));
          if (chosen.length) items.push("<b>Modular " + plural(chosen.length, "set", "sets") + ":</b> " + chosen.map((id) => nm(c, id)).join(", "));
          else if (!req.length) items.push("<b>Modular set:</b> none chosen yet — most scenarios include at least one. <i>(RR p.50)</i>");
          const picked = req.concat(chosen);
          if (rec.length && !sameSet(rec, picked) && !sameSet(rec, chosen)) {
            items.push("<i>Recommended for this scenario: " + rec.map((id) => nm(c, id)).join(", ") + " — swapping in other modular sets is allowed. (RR p.50)</i>");
          }
          if (s.standardSet) items.push("<b>Standard set:</b> " + nm(c, s.standardSet));
          if (m === "expert") items.push("<b>Expert set:</b> " + (s.expertSet ? nm(c, s.expertSet) : "the Expert encounter set") + " <i>(expert mode)</i>");
        } else {
          items.push("<b>The scenario's own encounter set</b> (the villain's cards)");
          items.push("<b>Modular set(s)</b> — the recommended one, or swap in any other <i>(RR p.50)</i>");
          items.push("<b>Standard set</b> — added to most scenarios <i>(RR p.40)</i>");
          if (m === "expert") items.push("<b>Expert set</b> — expert mode only <i>(RR p.28)</i>");
        }
        if (s && s.noObligations) items.push("<b>Obligations:</b> not used in this scenario — its setup removes them from the game");
        else items.push("<b>Obligations:</b> " + (n === 1 ? "your obligation card(s)" : "the " + word(n) + " heroes' obligation cards") + " set aside in step 4");
        if (c && c.pool) {
          items.push(
            "<b>'Pool:</b> add <b>Crisis of Infinite Deadpools</b> (Deadpool Hero Pack #37) — a player chose the 'Pool aspect. It is <i>not</i> added if a deck only includes some 'Pool cards through another card's ability. <i>(RR p.64, FAQ)</i>"
          );
        }
        const notes = [];
        if (s && chosen.length > Math.max(1, rec.length)) notes.push("Extra modular sets are allowed, but too many dilute the encounter deck. <i>(RR p.50)</i>");
        if (!s) notes.push("For surprise, pick the modular set from a group of facedown sets and shuffle it in without looking. <i>(RR p.50)</i>");
        if (h) {
          notes.push(
            "<b>Heroic " + h + ":</b> the deck itself doesn't change — instead each player is dealt " + h + " extra encounter " + plural(h, "card", "cards") + " in every villain phase. <i>(RR p.29)</i>"
          );
        }
        if (c && c.campaign) notes.push("<b>Campaign:</b> this scenario's campaign setup instructions are resolved in step 13. <i>(RR p.51)</i>");
        return (
          "Shuffle together the encounter sets listed on side <b>1A</b> of the main scheme and the obligation cards set aside in step 4:" +
          ul(items) +
          (notes.length ? notes.join("<br>") : "")
        );
      },
    },
    {
      n: 11,
      ph: 2,
      t: "Put setup cards into play",
      src: "RR p.51 (step 11), p.40",
      d: "Search <b>each deck and the set-aside area</b> for cards with the <b>setup</b> keyword and put them into play.",
    },
    {
      n: 12,
      ph: 2,
      t: "Resolve scenario setup & When Revealed abilities",
      src: "RR p.51 (step 12) · LtP p.6 (step 10), p.14",
      d: (c) => {
        const n = players(c);
        const s = scn(c);
        const ms = s ? arr(s.mainSchemeDeck) : [];
        const vd = villainDeck(c);
        let out = ul([
          "<b>a.</b> Resolve any <b>“Setup”</b> abilities on side 1A of the main scheme" + (ms.length ? " (<b>" + ms[0] + "</b>)" : "") + ".",
          "<b>b.</b> Flip it to side <b>1B</b>, place its <b>starting threat</b> (bottom of the card" +
            (n > 1 ? "; × " + n + " where it shows the per-player icon" : "") +
            ") and resolve any <b>“When Revealed”</b> abilities on that side. <i>(LtP p.14)</i>",
          "<b>c.</b> Resolve the villain's" + (vd.length && !(c && c.skirmish) ? " (<b>" + vd[0] + "</b>)" : "") + " <b>“Setup”</b> and <b>“When Revealed”</b> abilities.",
        ]);
        out += "“When Revealed” abilities of any other encounter cards that entered play during setup also resolve now. <i>(RR p.48)</i>";
        const notes = s ? arr(s.setupNotes) : [];
        if (notes.length) out += "<br><b>" + (scnName(c) || "Scenario") + " setup:</b>" + ul(notes);
        return out;
      },
    },
    {
      n: 13,
      ph: 2,
      t: "Campaign setup",
      src: "RR p.51 (step 13), p.29",
      when: (c) => !!(c && c.campaign),
      d: "Resolve this scenario's <b>Setup campaign instructions</b> from the campaign's rulebook. The <b>campaign log</b> records the effects and cards that persist between games; a card removed from the campaign stays out for the rest of it, even if you replay a scenario.",
    },
    {
      n: 14,
      ph: 3,
      t: "Draw cards",
      src: "RR p.51 (step 14) · LtP p.7 (step 12)",
      d: "Each player draws until they hold their <b>hand size</b> (including modifiers), printed near the bottom of the identity card. Everyone is in alter-ego form, so use that side's hand size. <i>(Example, LtP p.7: Peter Parker draws 6.)</i>",
    },
    {
      n: 15,
      ph: 3,
      t: "Resolve mulligans",
      src: "RR p.51 (step 15) · LtP p.7 (step 13)",
      d: "Each player may <b>discard as many cards as they like</b> from their opening hand, then draw until they are back at their starting hand size. The discards stay in the discard pile for now — don't reshuffle them. Keep the cards you like; mulligan the specific ones you don't.",
    },
    {
      n: 16,
      ph: 3,
      t: "Resolve player setup abilities",
      src: "RR p.51 (step 16) · LtP p.7 (step 14)",
      d: "Resolve any <b>“Setup”</b> abilities on player cards in play — usually on identity cards. (Player card abilities can't be used during setup unless they have a “Setup” trigger. <i>RR p.4</i>) <b>The game is ready to begin!</b>",
    },
  ];

  /* ------------------------------------------------------------------ round */
  MC.round = [
    {
      id: "player",
      h: "Player Phase",
      src: "RR p.4, 18, 34–35 · LtP p.10–14",
      steps: [
        {
          t: "Take turns in player order",
          d: "Each player takes one full turn: the first player, then clockwise. On your turn you may do the things below in any order, as many times as you can pay for them — except changing form, which is once per turn.",
          src: "RR p.34 · LtP p.10",
        },
        {
          t: "Change form (once per turn)",
          d: "Flip your identity between hero and alter-ego. Damage, cards, tokens and ready/exhausted state stay as they are. Your form decides whether the villain attacks you (hero) or schemes (alter-ego) in the villain phase.",
          src: "RR p.6, 21, 34 · LtP p.11, 15",
        },
        {
          t: "Play cards",
          d: "Play an ally, upgrade, support or player side scheme from your hand by paying its cost. Events are played by triggering their ability — Action events on your turn, Interrupt/Response events when their trigger happens.",
          src: "RR p.18, 34–35 · LtP p.11, 13",
        },
        {
          t: "Use a basic power",
          d: "Exhaust your identity. <b>Hero:</b> attack an enemy (ATK damage) or thwart a scheme (remove THW threat). <b>Alter-ego:</b> recover (heal REC damage). DEF isn't a turn action: when any hero is attacked — yours or another player's — you may exhaust your hero to defend, reducing the damage by DEF.",
          src: "RR p.35 · LtP p.11–12",
        },
        {
          t: "Use allies",
          d: "Exhaust an ally you control to attack an enemy or thwart a scheme; afterwards it takes consequential damage — 1 per icon under the power it used.",
          src: "RR p.7, 35 · LtP p.12",
        },
        {
          t: "Trigger Action abilities",
          d: "On cards you control, on encounter cards in play, or events in your hand. “Hero Action” and “Alter-Ego Action” need that form. You may ask another player to use one of their Actions. Every <b>Forced Action</b> must be resolved before the player phase can end.",
          src: "RR p.6, 20, 35 · LtP p.10, 13",
        },
        {
          t: "End your turn",
          d: "When you've done everything you can or want to, say so; the next player clockwise begins their turn.",
          src: "LtP p.14",
        },
        {
          t: "End of the player phase",
          d: ul([
            "In player order, each player may discard any number of cards and <b>must discard down to their hand size</b>.",
            "Everyone <b>draws up to their hand size</b>.",
            "Everyone <b>readies all their cards</b>; exhausted encounter cards ready too.",
            "“Until the end of the phase” effects end; then “when/after the phase ends” effects resolve.",
          ]),
          src: "RR p.18, 34 · LtP p.14",
        },
      ],
    },
    {
      id: "villain",
      h: "Villain Phase",
      src: "RR p.4, 47 · LtP p.14–17",
      steps: [
        {
          t: "Place threat",
          d: "Place the main scheme's acceleration value (bottom-right of the card; multiply it by the number of players if it shows the per-player icon) on it, plus <b>1 threat for each acceleration icon and acceleration token</b> in play.",
          src: "RR p.5, 27, 47 · LtP p.15",
        },
        {
          t: "Villain & minions activate",
          d:
            "In player order, for each player: the <b>villain</b> activates against them — <b>attacks</b> if they're in hero form, <b>schemes</b> if alter-ego — and gets <b>one boost card</b>. Then each <b>minion engaged</b> with that player activates the same way, in the order that player chooses (no boost card unless it's villainous)." +
            ul([
              "<b>Attack:</b> boost card dealt → defender declared → boost flipped (+1 ATK per icon) → damage (minus DEF if a hero defended) → after-attack effects.",
              "<b>Scheme:</b> boost card flipped (+1 SCH per icon) → that much threat goes on the main scheme.",
            ]),
          src: "RR p.6, 9, 39, 47 · LtP p.15–16",
        },
        {
          t: "Deal encounter cards",
          d: "Deal <b>one facedown encounter card to each player</b>, plus one more card per <b>hazard icon</b> in play (handed out in player order, not one per player). Heroic mode: each player gets as many extra cards as the heroic level.",
          src: "RR p.21, 29, 47 · LtP p.16",
        },
        {
          t: "Reveal encounter cards",
          d:
            "The first player reveals their cards one at a time in the order dealt, resolving each by type; then the next player, and so on." +
            ul([
              "<b>Minion</b> — engages you. <b>Treachery</b> — resolve, then discard. <b>Attachment</b> — attaches as instructed. <b>Side scheme / environment</b> — to the villain's area. <b>Obligation</b> — goes to the player it names; if it names no one, the player who revealed it keeps it.",
              "Resolve its “When Revealed” abilities, including keywords — <b>surge</b> deals you another card.",
            ]),
          src: "RR p.38, 42, 47 · LtP p.16–17",
        },
        {
          t: "Pass the first player token & end the round",
          d: "Pass the token to the next player clockwise. Then “until the end of the round/phase” effects end and end-of-round effects resolve (for example, <b>temporary</b> cards are discarded). The next round begins.",
          src: "RR p.44, 47 · LtP p.17",
        },
      ],
    },
  ];

  /* ------------------------------------------------------------------ reference topics */
  MC.reference = [
    {
      id: "golden",
      h: "Golden Rules & the Grim Rule",
      src: "RR p.4 · LtP p.9",
      items: [
        "Where the <b>Rules Reference</b> and the Learn to Play disagree, the Rules Reference wins.",
        "Where a <b>card or scenario rule</b> contradicts either rulebook, the card or scenario wins.",
        "<b>“Cannot” is absolute</b> — it beats any ability or rule that says something can happen (though a card may still override a rule, per the Golden Rules). <i>(RR p.11)</i>",
        "<b>The Grim Rule:</b> if the Rules Reference doesn't settle a rules or timing conflict, resolve it the way the players see as <b>worst for winning the scenario</b> at that moment, and keep playing.",
        "<b>No component limits:</b> threat, damage and acceleration tokens, all-purpose counters and status cards are unlimited — substitute coins or other tokens.",
        "<b>Table talk</b> is encouraged, including about your hand (you never have to reveal it). Only a <b>peril</b> card stops you consulting. <i>(RR p.32, 42)</i>",
      ],
    },
    {
      id: "forms",
      h: "Hero & Alter-Ego Forms",
      src: "RR p.21, 23 · LtP p.11, 15",
      items: [
        "Your <b>identity card</b> is double-sided — hero on one side, alter-ego on the other. The face-up side is your current form (and the only side in play). Everyone <b>starts in alter-ego form</b>. <i>(RR p.23)</i>",
        "<b>Once per round, during your own turn</b>, you may flip to change form. Card effects that flip you don't use up this change.",
        "Changing form changes only the form: damage, status cards, attachments, upgrades, tokens, lasting effects and ready/exhausted state all stay.",
        "<b>Hero</b> side: ATK, THW, DEF. <b>Alter-ego</b> side: REC. Each side has its own hand size and abilities. <i>(RR p.52–53)</i>",
        "Your form sets what the villain and your engaged minions do to you: <b>hero → they attack</b>, <b>alter-ego → they scheme</b>. <i>(RR p.6 · LtP p.15)</i>",
        "Bold triggers naming a form (<b>Hero Action</b>, <b>Alter-Ego Action</b>…) and “[form] form only” cards need that form. Encounter text marked Hero/Alter-Ego applies only if the revealing player is in that form. <i>(RR p.5, 21 · LtP p.13, 17)</i>",
        "While you're a hero, effects that refer to your alter-ego don't affect you — and vice versa.",
        "The <b>form</b> keyword can grant extra forms; switching those doesn't use your once-per-turn flip, but still counts as changing form for card effects.",
        "<i>Strategy (LtP p.15):</i> be a hero to stop the villain scheming; stay alter-ego to recover and build up — but then nobody is stopping the scheme.",
      ],
    },
    {
      id: "powers",
      h: "Basic Powers",
      src: "RR p.10–11, 15, 36, 44 · LtP p.11–12",
      table: {
        cols: ["Power", "Who has it", "What it does"],
        rows: [
          ["ATK — attack", "Heroes, allies (villains & minions too)", "Hero/ally: exhaust → deal ATK damage to one enemy. Villains/minions use it when they activate."],
          ["THW — thwart", "Heroes, allies", "Exhaust → remove THW threat from one scheme"],
          ["DEF — defense", "Heroes", "When an enemy attacks: exhaust → the damage is reduced by DEF; the hero takes the rest"],
          ["REC — recover", "Alter-egos", "Exhaust → heal REC damage (not above maximum)"],
          ["SCH — scheme", "Villains, minions", "Place SCH threat on the main scheme"],
        ],
      },
      items: [
        "A hero, alter-ego or ally <b>exhausts</b> (turns sideways) to use a basic power. An exhausted card can't exhaust again until it is readied — normally at the end of the player phase. <i>(RR p.10, 15, 18–19, 36, 44)</i>",
        "A basic power needs a <b>valid target</b> — an enemy you can attack, a scheme with threat on it — unless the character is stunned (attack) or confused (thwart), in which case the attempt just removes the status card. <i>(RR p.10, 44)</i>",
        "You <b>can't recover</b> if your identity has no damage to heal. <i>(RR p.36)</i>",
        "A <b>dash (–)</b> means that power can't be used. A <b>0</b> can be — a hero with THW 0 may still thwart. <i>(RR p.15, 43)</i>",
        "“Make a basic attack/thwart <b>without exhausting</b>” works even on an exhausted character. <i>(RR p.10, 44)</i>",
        "<b>Labeled abilities</b> such as <b>Hero Action (attack)</b> count as an attack / thwart / defense by your identity, but don't exhaust you unless they say so. <i>(RR p.10, 16, 26, 44)</i>",
        "<b>Allies</b> exhaust to attack or thwart (then take consequential damage) or to defend. <i>(RR p.7)</i>",
      ],
    },
    {
      id: "resources",
      h: "Resources & Paying Costs",
      src: "RR p.13–14, 37, 48 · LtP p.11, 13",
      items: [
        "Generate resources by <b>discarding cards from your hand</b> — each icon in the bottom-left corner is one resource — or with <b>“Resource”</b> abilities. <i>(RR p.37 · LtP p.11)</i>",
        "Four types: <b>energy, mental, physical, wild</b>. When paying a cost, each wild resource can be declared as any type; outside of costs it is only “wild”. <i>(RR p.48)</i>",
        "Most cards' resource costs can be paid with <b>any mix of types</b>. Many abilities need specific types (e.g. “Spend [physical][physical][physical]”). <i>(RR p.37 · LtP p.11, 13)</i>",
        "<b>Overpaying</b> is allowed, but the extra resources are <b>lost</b> — they don't carry over and don't count as paid for that cost. <i>(RR p.13, 37)</i>",
        "<b>Cost arrow (→):</b> the non-bold text before the arrow is the cost (a “When…”/“After…” trigger condition isn't part of it) and must be paid in full before the effect after the arrow resolves. <i>(RR p.13–14)</i>",
        "You pay with cards and game elements <b>you control</b> (a cost that says “choose” or targets a “friendly” card may use cards you don't control). All costs of one card or ability, including any “additional costs”, are paid <b>together</b> — no partial payments. <i>(RR p.13–14)</i>",
        "Costs with the <b>per-player icon</b> are multiplied by the number of players who started; a cost reduction comes off the total. <i>(RR p.13)</i>",
        "<b>X costs:</b> you choose X while determining the cost. A <b>dash (–)</b> cost means the card can't be played, only put into play. <i>(RR p.15, 24)</i>",
        "<b>Put into play</b> ignores the cost and doesn't count as playing the card. <i>(RR p.32–33)</i>",
        "Costs requiring <b>printed</b> resources accept resources generated by a card's ability only if those icons are printed in its text box — and <b>wild can't stand in</b> for another type there. <i>(RR p.35)</i>",
        "<b>Alliance:</b> any player may help pay. <b>Requirement:</b> the listed resources must be spent. <i>(RR p.6, 37)</i>",
      ],
    },
    {
      id: "player-cards",
      h: "Player Card Types",
      src: "RR p.7, 12, 18–19, 33–34, 37, 42, 46 · LtP p.11",
      items: [
        "Seven types: <b>identity, ally, upgrade, support, event, resource, player side scheme</b>. Most have a blue back. <i>(RR p.12, 33)</i>",
        "<b>Playing a card:</b> put it on the table and pay its cost; allies, upgrades and supports then enter play <b>ready</b> in your area; an event resolves and goes to its owner's discard pile. <i>(LtP p.11)</i>",
        "<b>Ally</b> — exhaust to attack or thwart (then consequential damage) or to defend (it takes all the damage). Defeated at 0 hit points and discarded. An ally's actions are <b>not</b> your identity's. <i>(RR p.7)</i>",
        "<b>Ally limit: 3.</b> You may still play or put a 4th into play — then immediately choose and discard allies down to the limit (before “enters play” abilities resolve). <i>(RR p.7 · LtP p.11)</i>",
        "<b>Upgrade</b> — powers, gear and assets near your identity, or <b>attached</b> to another card (then it modifies that card). It counts as your identity unless attached to another friendly character. <i>(RR p.46)</i>",
        "<b>Support</b> — locations and backup in your back row; its effects aren't your identity's. <i>(RR p.42)</i>",
        "<b>Event</b> — a one-shot effect: play it (it never enters play), pay, resolve, discard. If it has targets, it needs at least one valid one; it counts as your identity acting. <i>(RR p.18–19)</i>",
        "<b>Resource</b> — built to be discarded for resources, usually more efficiently than other cards. <i>(RR p.37)</i>",
        "<b>Player side scheme</b> — your own mission: enters next to the main scheme with its starting threat and is defeated when its threat is gone. Limit <b>1</b> in play if 1–2 players started the game, <b>2</b> if 3–4 did. You may play one at the limit, then choose one to discard (it isn't defeated); otherwise the first player chooses which extras to discard. <i>(RR p.34)</i>",
        "<b>Restricted:</b> no more than two restricted cards under your control. <b>“Max X per [period]”</b> counts every copy by title across all players, but <b>“Max 1 per player”</b> applies to each player separately and <b>“Max X per deck”</b> to each deck. <i>(RR p.28, 38)</i>",
      ],
    },
    {
      id: "encounter-cards",
      h: "Encounter Card Types",
      src: "RR p.8, 12, 17–18, 26–28, 30, 38, 40, 45–47 · LtP p.16–17",
      items: [
        "Eight types: <b>villain, main scheme, side scheme, minion, treachery, attachment, obligation, environment</b>. Most have an orange back. <i>(RR p.12, 17)</i>",
        "<b>Villain</b> — a sequential deck of stages; reduce each stage to 0 hit points. Villain cards can't be discarded. A <b>leader</b> follows the villain rules. <i>(RR p.26, 46–47)</i>",
        "<b>Main scheme</b> — the villain's goal. It advances when its threat reaches its target; completing the final stage loses the game. Can't be discarded. <i>(RR p.27–28)</i>",
        "<b>Side scheme</b> — enters the villain's play area with its starting threat; it is <b>defeated and discarded</b> when it has no threat. <i>(RR p.40)</i>",
        "<b>Minion</b> — enters play <b>engaged</b> with the player who revealed it and activates against that player each villain phase. <i>(RR p.28)</i>",
        "<b>Treachery</b> — resolve its effect, then discard it; it never enters play. <i>(RR p.38, 45)</i>",
        "<b>Attachment</b> — enters play attached as its “attach to” text says (often to the villain), and can modify ATK, SCH or THW. <i>(RR p.8, 38)</i>",
        "<b>Obligation</b> — an alter-ego's personal problem, shuffled in at setup. It goes to the player whose identity it names (if it names no one, the player who revealed it takes it), who resolves it; if it can't be given to the named player, remove it from the game and reveal another card. <i>(RR p.30 · LtP p.17)</i>",
        "<b>Environment</b> — an ongoing rule for the scenario, in the villain's play area. <i>(RR p.18)</i>",
        "<b>Nemesis set</b> — each identity's personal foe, set aside at setup until an encounter card calls for it. When a card puts a player's nemesis side scheme into play, their <b>nemesis minion</b> also engages them and the rest of the set goes to the encounter discard pile — unless the card says otherwise. <i>(RR p.30 · LtP p.6, 17)</i>",
      ],
    },
    {
      id: "schemes",
      h: "Schemes, Threat & Scheme Icons",
      src: "RR p.5, 7, 14, 21, 27–28, 39–40, 47 · LtP p.14–16",
      table: {
        cols: ["Icon", "While a card with it is in play"],
        rows: [
          ["Acceleration", "+1 threat on the main scheme in the Place Threat step of each villain phase (per icon)"],
          ["Crisis", "Player cards can't remove threat from the main scheme"],
          ["Hazard", "+1 encounter card dealt in each villain phase per icon — one card in total, not one per player; extras dealt in player order"],
          ["Amplify", "Each boost card turned faceup in an enemy activation gets +1 boost icon per amplify icon"],
        ],
      },
      items: [
        "<b>Villain phase step 1:</b> put the main scheme's acceleration value (bottom-right) on it, plus 1 per acceleration icon and token in play. <i>(RR p.27, 47)</i>",
        "<b>Target threat</b> (top-left): when the main scheme's threat is ≥ its target, it is <b>completed</b> and the deck advances — remove the card, resolve “When Revealed” on the next card's A side, flip it to B, add its starting threat, resolve B's “When Revealed”. Excess threat doesn't carry over; acceleration tokens do. <i>(RR p.27–28 · LtP p.14)</i>",
        "Completing the <b>final</b> main scheme stage means the players lose, immediately. <i>(RR p.27 · LtP p.14)</i>",
        "<b>Acceleration tokens</b> are added whenever the encounter deck runs out (or by card effects); they work like icons and can't be removed from the main scheme. <i>(RR p.5)</i>",
        "“Place/remove threat on <b>a scheme</b>”: the player resolving it picks the main scheme or a side scheme. Prevented threat is never placed. <i>(RR p.35, 39)</i>",
        "Threat-related keywords: <b>hinder X</b> (enters with X extra threat), <b>incite X</b> (when revealed, X threat on the main scheme), <b>assault</b> (basic thwarts against it use ATK), <b>patrol</b> (on a minion: the engaged player can't thwart the main scheme). <i>(RR p.8, 22, 24, 32)</i>",
      ],
    },
    {
      id: "attacks",
      h: "Attacks & Defense",
      src: "RR p.7–10, 13, 15–16, 31–32, 36, 38 · LtP p.12, 16",
      items: [
        "<b>Enemy attack, step by step:</b> 1 give a boost card (villain or villainous minion) · 2 declare a defender · 3 flip boost cards one at a time (Boost abilities, +1 ATK per icon, discard) · 4 damage = ATK + modifiers + boost icons, minus a defending hero's DEF · 5 deal it · 6 after-attack abilities, forced ones (like retaliate) first. <i>(RR p.9)</i>",
        "<b>Hero defends:</b> exhaust; the damage is reduced by DEF and the hero takes the rest. <b>Ally defends:</b> exhaust; the ally takes <b>all</b> the damage and the excess does not carry over to you (unless the attack has overkill). <i>(RR p.9, 15 · LtP p.16)</i>",
        "Only <b>one defender</b> per attack, and <b>any player</b> may defend another player's attack — the defending player becomes the attack's target. <i>(RR p.15–16)</i>",
        "<b>Undefended:</b> all the damage goes to the attacked character (normally your hero). If a defending ally leaves play before the damage, the attack becomes undefended against its controller's identity. <i>(RR p.9, 16)</i>",
        "<b>Defense-labeled</b> abilities (e.g. Hero Interrupt (defense)) make your identity the defender if there isn't one already (not if your own ally is defending). The ability itself isn't a basic defense and gives no DEF reduction, but your hero can still be declared the defender in the Declare Defender step and reduce the damage by DEF. <i>(RR p.15–16)</i>",
        "<b>Your attacks</b> can target any enemy — the villain or any minion — unless something like <b>guard</b> prevents it. <i>(RR p.10, 21)</i>",
        "<b>Consequential damage:</b> after an ally attacks or thwarts it takes 1 damage per icon under the ATK or THW it used, after abilities triggered by that attack/thwart. None if its target left play first, or if a stun/confuse canceled the attempt. <i>(RR p.7, 13)</i>",
        "<b>Retaliate X:</b> after that character is attacked, deal X damage to the attacker (it must still be in play). <b>Ranged</b> attacks ignore retaliate. <i>(RR p.36, 38)</i>",
        "<b>Piercing:</b> discard the target's tough cards before damage is dealt. <b>Overkill:</b> excess damage from defeating an ally goes to its controller's identity; from defeating a minion, to the villain. An ally protected by tough takes no damage, so nothing passes on. <i>(RR p.31–32, 57)</i>",
        "Attacks aimed directly <b>at an ally</b>: its controller is the attacked player, and a defender may still be declared. <i>(RR p.10)</i>",
      ],
    },
    {
      id: "damage",
      h: "Damage, Healing & Defeat",
      src: "RR p.14–15, 22, 24, 30, 35, 47 · LtP p.12",
      items: [
        "Damage to identities and villains <b>lowers the hit point dial</b>; on allies and minions it's tracked with <b>damage tokens</b>. At 0 remaining hit points a character is <b>defeated</b>. <i>(RR p.14, 22 · LtP p.12)</i>",
        "A defeated <b>ally, minion or side scheme</b> is discarded; a defeated <b>identity or villain stage</b> is removed from the game. <i>(RR p.15)</i>",
        "<b>Villain stage defeated:</b> reveal the next stage and set the dial to its hit points; excess damage doesn't carry over. Same title → attachments, upgrades, status cards and counters stay; different title → they don't. <i>(RR p.47)</i>",
        "<b>Heal</b> removes damage, never above maximum hit points unless the effect says so. Moving damage off a character heals it; moving damage onto one deals damage. <i>(RR p.22, 30)</i>",
        "<b>Prevent</b> reduces the damage a character <i>takes</i>, not the damage <i>dealt</i>. <i>(RR p.35)</i>",
        "<b>Indirect damage:</b> the player splits it among characters they control, but can't give one more than would defeat it. <i>(RR p.24)</i>",
        "Losing a <b>“+X hit points”</b> bonus lowers the dial again — which can defeat you. <i>(RR p.22, 58)</i>",
        "Damage as a <b>cost</b>: dealing it counts even if prevented; taking it counts only if all of it is taken. <i>(RR p.14)</i>",
        "<b>Order around damage:</b> “would be dealt” abilities → tough → “would take” → “takes” → damage placed → “would be defeated” → “is defeated” / When Defeated → defeated character discarded → “after” abilities. <i>(RR p.14)</i>",
      ],
    },
    {
      id: "status",
      h: "Status Cards",
      src: "RR p.13, 41, 44–45 · LtP p.24",
      table: {
        cols: ["Status", "Effect"],
        rows: [
          ["Stunned", "Cancels the character's next attack — discard the stunned card instead"],
          ["Confused", "Cancels the character's next thwart (heroes, allies) or scheme (villain, minions) — discard the confused card instead"],
          ["Tough", "The next time it would take any damage, prevent all of it and discard one tough card"],
        ],
      },
      items: [
        "A stunned/confused hero or ally that tries to attack/thwart still <b>pays the costs, including exhausting</b>; it isn't considered to have attacked or thwarted (so no consequential damage). <i>(RR p.7, 13, 41)</i>",
        "A character can have only <b>one of each</b> status card (a <b>steady</b> character: two stunned and two confused). <i>(RR p.41)</i>",
        "Status cards have <b>priority over triggered abilities</b> — you can't interrupt to save a tough card. <i>(RR p.41, 57)</i>",
        "A hero's <b>basic defense</b> reduces the damage by DEF first; if that brings it to 0, the tough card stays. <i>(RR p.44, 57)</i>",
        "Related keywords: <b>stalwart</b> (can't be stunned or confused), <b>steady</b>, <b>toughness</b> (enters play with a tough card), <b>vulnerable</b> (discarded when stunned or confused), <b>piercing</b> (strips tough). <i>(RR p.32, 40–41, 45, 48)</i>",
      ],
    },
    {
      id: "boost",
      h: "Boost Cards",
      src: "RR p.6, 9, 11, 39–41, 47 · LtP p.15–16",
      items: [
        "Each time the <b>villain</b> activates — attack or scheme — it gets <b>one facedown boost card</b> from the encounter deck. Minions don't, unless they are <b>villainous</b>. <i>(RR p.6, 11, 47)</i>",
        "Boost cards are flipped <b>one at a time</b>, after any defender is declared: each <b>boost icon</b> (bottom-right) is +1 ATK or SCH for this activation. <i>(RR p.9, 11, 39)</i>",
        "A <b>star</b> in the boost field means resolve that card's <b>“Boost”</b> ability (below the divider line); the star isn't a boost icon. Nothing else on a boost card is active. <i>(RR p.11, 41)</i>",
        "Discard each boost card after it resolves. Extra boost cards add up — all their icons count and all their Boost abilities resolve. <i>(RR p.9, 11)</i>",
        "Damage from a Boost ability isn't damage from the activation. <i>(RR p.11)</i>",
        "Each <b>amplify</b> icon in play adds one boost icon to every boost card turned faceup during an enemy activation. <i>(RR p.7)</i>",
        "A boost card given to an enemy outside its activation stays facedown until it activates (a villain or villainous minion still gets its normal card too). <i>(RR p.11)</i>",
      ],
    },
    {
      id: "engagement",
      h: "Minions & Engagement",
      src: "RR p.10, 18–19, 28, 34, 38, 47 · LtP p.15–16",
      items: [
        "A minion entering play <b>engages</b> the player resolving the card that brought it in (unless told otherwise) and sits in that player's play area. <i>(RR p.18, 28, 38)</i>",
        "It stays engaged until it is defeated or removed, or an ability moves it. <i>(RR p.18)</i>",
        "<b>Villain phase step 2:</b> after the villain activates against you, each minion engaged with you activates, one at a time in the order <b>you</b> choose — it <b>attacks</b> if you're a hero and <b>schemes</b> if you're an alter-ego. No boost card unless it's villainous. <i>(RR p.28, 47 · LtP p.15–16)</i>",
        "Any hero or ally may attack any minion unless an ability prevents it. Engagement decides who the minion activates against, and powers its keywords: <b>guard</b> (you can't attack the villain), <b>patrol</b> (you can't thwart the main scheme), <b>quickstrike</b> (attacks you right after it engages you if you're in hero form, after any When Revealed), <b>teamwork</b> (activates on entry if another minion with that trait is in play). <i>(RR p.10, 21, 32, 36, 43)</i>",
        "A minion that engages you during an activation in which all your minions are told to activate also activates. <i>(RR p.28)</i>",
        "“Find and reveal” a minion already in play: it engages you and resolves its reveal abilities, keeping its tokens and attachments. <i>(RR p.19)</i>",
        "If you're eliminated, your minions engage the <b>next player clockwise</b>, keeping tokens, attachments, boost cards and status cards. <i>(RR p.34)</i>",
      ],
    },
    {
      id: "multiplayer",
      h: "Multiplayer",
      src: "RR p.6, 15, 17, 19–20, 24, 32, 34–35 · LtP p.9, 17",
      items: [
        "The <b>first player</b> (holding the token) goes first; decides when an encounter card has several eligible targets or doesn't say who acts; orders simultaneous effects; and gets the first chance at each interrupt and response. <i>(RR p.19–20)</i>",
        "<b>In player order</b> means the first player, then clockwise. The token passes clockwise at the end of every round. <i>(RR p.24, 47 · LtP p.9, 17)</i>",
        "<b>Per-player icon:</b> × the number of players who <b>started</b> the scenario — it doesn't drop when someone is eliminated. <i>(RR p.32)</i>",
        "The villain activates once against <b>each</b> player, and every player is dealt their own encounter card. <i>(RR p.47)</i>",
        "Help each other: anyone may <b>defend</b> another player's attack (one defender per attack), ask another player to use an <b>Action</b> on your turn, or help pay an <b>alliance</b> card. <i>(RR p.6, 15, 35)</i>",
        "Player side scheme limit: <b>1</b> if 1–2 players started the game, <b>2</b> if 3–4 did. <i>(RR p.34)</i>",
        "<b>Elimination</b> (identity defeated): pass the first player token on if they held it; their engaged minions engage the next player clockwise; cards they don't own go to their owners' discard piles; their play area is removed from the game. They still <b>win or lose with the team</b>, and if everyone is eliminated the players lose. <i>(RR p.34)</i>",
        "“Each player” effects resolve one player at a time; the first player picks the order if none is given. <i>(RR p.17)</i>",
      ],
    },
    {
      id: "winning",
      h: "Winning & Losing",
      src: "RR p.17, 27, 34, 47–48 · LtP p.9, 14",
      items: [
        "<b>You win</b> when the <b>final villain stage</b> is defeated. <i>(RR p.47–48 · LtP p.9)</i>",
        "<b>You lose</b> immediately when the <b>final main scheme stage</b> is completed (threat ≥ target). <i>(RR p.27, 48 · LtP p.14)</i>",
        "<b>You lose</b> if <b>every player is eliminated</b>. <i>(RR p.34 · LtP p.9)</i>",
        "<b>You lose</b> if the encounter deck and the encounter discard pile are ever empty at the same time (an endless acceleration loop). <i>(RR p.17)</i>",
        "Some scenarios add <b>alternate win or loss conditions</b>; these can't be blanked or canceled. <i>(RR p.48)</i>",
        "Eliminated players share the team's result. <i>(RR p.34)</i>",
      ],
    },
    {
      id: "timing",
      h: "Timing, Triggers & Priority",
      src: "RR p.4–6, 11, 20, 25–26, 37–38, 40, 48 · LtP p.13",
      table: {
        cols: ["Order", "Abilities with the same triggering condition"],
        rows: [
          ["1", "Constant abilities, delayed effects and lasting effects"],
          ["2", "Interrupts: (a) status-card Forced Interrupts, (b) Forced Interrupts, (c) Interrupts"],
          ["3", "Boost and When Revealed abilities"],
          ["4", "Responses: (a) Forced Responses, (b) Responses"],
          ["5", "Consequential damage"],
        ],
      },
      items: [
        "<b>Constant</b> abilities (no bold trigger) are always active while their card is in play. <b>Triggered</b> abilities have a bold trigger followed by a colon. <i>(RR p.5)</i>",
        "<b>Mandatory:</b> constant, Setup, When Revealed, When Defeated, Forced, Boost and keywords. <b>Optional:</b> Action, Interrupt, Response, Resource. <i>(RR p.4)</i>",
        "<b>Action:</b> on your turn (or on request during another player's), from cards you control, encounter cards or events in hand. <b>Forced Actions</b> must be resolved before the player phase ends. <i>(RR p.6, 20, 35)</i>",
        "<b>Interrupt:</b> resolves just <b>before</b> its triggering condition resolves (“would” interrupts come even earlier). <b>Response:</b> just <b>after</b>. Each copy can trigger once per occurrence. <i>(RR p.25, 38, 48 · LtP p.13)</i>",
        "<b>Resource</b> abilities: any time you are generating resources to pay a cost. <i>(RR p.37)</i>",
        "Ties: the <b>first player</b> orders simultaneous effects and gets the first chance to interrupt or respond, then the others in player order. <i>(RR p.20, 40)</i>",
        "Player card abilities can't be used during setup unless they have a <b>“Setup”</b> trigger. <i>(RR p.4)</i>",
        "<b>Cancel:</b> the effect doesn't happen but the costs stay paid; a canceled event was still played, a canceled treachery was still revealed. <i>(RR p.11)</i>",
        "“Until the end of the round” effects expire just before “at the end of the round” abilities. <i>(RR p.26)</i>",
      ],
    },
    {
      id: "unique",
      h: "Uniqueness",
      src: "RR p.13, 23, 45–46, 50",
      items: [
        "The <b>unique icon</b> in a card's title marks a one-of-a-kind person, place or thing. <i>(RR p.23, 45)</i>",
        "Two unique cards <b>match</b> if they share a title and neither has a subtitle or alter-ego title — or if one's subtitle or alter-ego title matches the other's title, subtitle or alter-ego title (so a T'Challa identity, a T'Challa ally and a Black Panther ally subtitled T'Challa all match). <i>(RR p.45)</i>",
        "<b>Deckbuilding:</b> a deck can't contain matching cards — the identity counts. <i>(RR p.45, 50)</i>",
        "<b>Setup:</b> players can't choose matching identities (a villain may match a hero). <i>(RR p.45)</i>",
        "<b>In play:</b> a non-villain card can't enter play while a matching card is in play. A player card simply can't be played or put into play; an encounter card is discarded instead, and if it was being revealed, that player is dealt a facedown encounter card. <i>(RR p.46)</i>",
        "A <b>copy</b> is any card with the same title (and subtitle), however else it differs. <i>(RR p.13)</i>",
        "If one of your identity-specific cards matches another player's chosen identity, you may replace it with a <b>Team-Up</b> card naming both identities. <i>(RR p.50)</i>",
      ],
    },
    {
      id: "card-text",
      h: "Reading Card Text",
      src: "RR p.4, 7, 20, 27–29, 31, 36–37, 42–44, 49",
      items: [
        "Read the whole ability first, then resolve it <b>one sentence at a time</b>. <i>(RR p.4)</i>",
        "<b>Then:</b> the part after “then” happens only if everything before it fully resolved. <b>Otherwise:</b> happens only if the preceding effect didn't. <b>And:</b> each part resolves as fully as it can, independently. <i>(RR p.7, 31, 44)</i>",
        "<b>“Instead”</b> marks a replacement — the original effect never happens. <i>(RR p.37)</i>",
        "<b>For each:</b> without “choose” it's one target and one instance; with “choose”, every iteration is a separate instance and the game updates between them. <i>(RR p.20)</i>",
        "<b>Targets:</b> an ability that specifies targets needs at least one valid target to be used (a future-target ability needs none; a search needs only a searchable area); a target is valid if any part of the ability can affect it. Drawing always has a target while your deck has cards. <i>(RR p.4, 42–43)</i>",
        "<b>“You”</b> means your identity whenever it can (damage to “you” hits your dial); otherwise it means you, the player. Events, resources and your upgrades act as your identity; allies, supports, player side schemes and encounter cards don't. <i>(RR p.49)</i>",
        "<b>Modifiers:</b> per-player icon first; then add/subtract before doubling/halving; a “set” value overrides the rest; anything below 0 is 0; fractions round up; a dash can't be modified. <i>(RR p.29)</i>",
        "<b>Limit X per period</b> applies to each copy of an ability. <b>Max X per [period]</b> counts all copies by title across all players; <b>Max 1 per player</b> applies to each player, <b>Max X per deck</b> to each deck, and <b>Max 1 per [element]</b> to copies attached to each such element. <i>(RR p.27–28)</i>",
        "Italic text in parentheses is <b>reminder text</b> and has no effect. <i>(RR p.36)</i>",
      ],
    },
    {
      id: "decks",
      h: "Hand Size, Decks & Running Out",
      src: "RR p.15–18, 21, 27, 30, 33, 39 · LtP p.14",
      items: [
        "<b>Hand size</b> is checked at the end of the player phase: you may discard any cards, must discard down to your hand size, then draw back up to it (one card at a time). <i>(RR p.18, 21)</i>",
        "<b>Your deck runs out:</b> shuffle your discard pile into a new deck, then deal yourself <b>one facedown encounter card</b>. Keep drawing if you were mid-draw; stop if you were discarding. <i>(RR p.33)</i>",
        "<b>The encounter deck runs out:</b> shuffle the encounter discard pile into a new deck and place an <b>acceleration token</b> next to the main scheme. <i>(RR p.17)</i>",
        "Drawing an <b>obligation</b> from your own deck puts it into your play area; you don't draw a replacement unless you're refilling your hand. <i>(RR p.30)</i>",
        "Discard piles are open information and their order can't be changed. <i>(RR p.16)</i>",
        "<b>Search</b> any part of a deck → shuffle the whole deck afterwards. <b>Look at</b> cards → put them back in the same order. <i>(RR p.27, 39)</i>",
        "The order of cards in a deck can't change unless a game step or card says so. <i>(RR p.15)</i>",
      ],
    },
    {
      id: "areas",
      h: "Play Areas, In & Out of Play",
      src: "RR p.23–24, 33, 35–36, 39, 46–47",
      items: [
        "<b>Your play area:</b> identity, hit point dial, deck, hand, discard pile, the cards you control in play, minions engaged with you, your obligations and the encounter cards dealt to you. <i>(RR p.33, 35)</i>",
        "<b>Villain's play area:</b> villain deck and dial, main scheme deck, encounter deck and discard pile, side schemes and environments. <i>(RR p.33, 47)</i>",
        "<b>In play:</b> the face-up side of each identity; allies, supports and upgrades that entered play; the top villain and main scheme cards; attachments, environments, minions, obligations and side schemes. Only in-play text is active. <i>(RR p.23)</i>",
        "<b>Out of play:</b> hands, decks, discard piles, facedown dealt encounter cards, set-aside and removed-from-the-game cards, and the victory display. Events and treacheries work from out of play. <i>(RR p.23–24, 46)</i>",
        "<b>Set-aside</b> cards wait out of play until the scenario or a card calls for them; <b>removed-from-the-game</b> cards can't come back. <i>(RR p.36, 39)</i>",
        "You can't play cards into another player's play area unless a rule or card says so. <i>(RR p.35)</i>",
      ],
    },
  ];

  /* ------------------------------------------------------------------ keywords & icons (alphabetical) */
  MC.keywords = [
    { k: "Acceleration Icon", side: "encounter", src: "RR p.5, 22, 28", d: "Each acceleration icon in play adds <b>1 threat</b> to the main scheme in the Place Threat step of the villain phase. Defeating the card it's printed on removes it. <b>Acceleration tokens</b> (added when the encounter deck runs out) do the same, can't be removed from the main scheme and carry over when it advances." },
    { k: "Alliance", side: "player", src: "RR p.6, 25", d: "While paying the costs of this card, <b>any player may help pay</b>. Only the player playing it is resolving it." },
    { k: "Amplify Icon", side: "encounter", src: "RR p.7, 22", d: "Each amplify icon in play gives <b>+1 boost icon</b> to every boost card turned faceup during an enemy activation." },
    { k: "Assault", side: "encounter", src: "RR p.8, 25", d: "A <b>basic thwart</b> against this scheme uses the character's <b>ATK instead of THW</b>; an ally takes the consequential damage under its ATK. Effects that raise a “basic power” can raise that ATK." },
    { k: "Boost Icon", side: "encounter", src: "RR p.11, 22", d: "Each boost icon on a boost card gives the activating enemy <b>+1 ATK or SCH</b>. Printed bottom-right on encounter cards; a star there means the card also has a “Boost” ability to resolve." },
    { k: "Consequential Damage Icon", side: "player", src: "RR p.13, 23", d: "Printed under an ally's ATK or THW: after the ally attacks or thwarts, it takes <b>1 damage per icon</b> in the field it used." },
    { k: "Cost Arrow (→)", side: "both", src: "RR p.13–14, 23", d: "Separates a <b>cost</b> (before the arrow) from its <b>effect</b> (after). The non-bold text before the arrow (not an interrupt/response trigger condition) must be paid or resolved in full first; responses to the cost resolve before the effect." },
    { k: "Crisis Icon", side: "encounter", src: "RR p.14, 22", d: "While any crisis icon is in play, <b>player cards can't remove threat from the main scheme</b>. Encounter card abilities aren't affected." },
    { k: "Energy Icon", side: "player", src: "RR p.18, 22", d: "A resource icon that generates <b>one energy resource</b>. Some abilities require energy specifically." },
    { k: "Form", side: "player", src: "RR p.21, 25", d: "Grants an identity an <b>extra form</b> with its own conditions for changing into it. Changing it doesn't use your once-per-turn flip but counts as changing form for card effects. “[type] form only” cards require that form." },
    { k: "Guard", side: "encounter", src: "RR p.21, 25", d: "While a guard minion is engaged with you, <b>you can't attack the villain</b> with cards you control." },
    { k: "Hazard Icon", side: "encounter", src: "RR p.21–22", d: "For each hazard icon in play, deal <b>one extra encounter card</b> in the Deal Encounter Cards step — one card in total per icon (not one per player), handed out in player order." },
    { k: "Hinder X", side: "encounter", src: "RR p.22, 25", d: "This card enters play with <b>X threat</b> on it, in addition to any starting threat." },
    { k: "Incite X", side: "encounter", src: "RR p.24–25", d: "When this card is revealed, place <b>X threat on the main scheme</b>." },
    { k: "Linked (Card Title)", side: "player", src: "RR p.25, 27", d: "Can't be included in a deck. <b>Set aside during setup</b> if a deck contains the named card, which brings it into play. Doesn't count toward deck size; whoever takes control of it becomes its owner." },
    { k: "Mental Icon", side: "player", src: "RR p.22, 28", d: "A resource icon that generates <b>one mental resource</b>. Some abilities require mental specifically." },
    { k: "Overkill", side: "both", src: "RR p.25, 31", d: "If the attack defeats an <b>ally</b>, excess damage goes to its controller's <b>identity</b>; if it defeats a <b>minion</b>, excess goes to the <b>villain</b>. That damage is from an attack but isn't an attack; prevented excess isn't dealt." },
    { k: "Patrol", side: "encounter", src: "RR p.25, 32", d: "While a patrol minion is engaged with you, <b>you can't thwart the main scheme</b> with cards you control." },
    { k: "Per Player Icon", side: "both", src: "RR p.13, 23, 29, 32", d: "Multiplies the value by the <b>number of players who started the scenario</b> — unchanged if a player is eliminated. It is applied before any modifiers; a reduced cost comes off the total." },
    { k: "Peril", side: "encounter", src: "RR p.25, 32", d: "While a player resolves this card they <b>can't consult</b> the others, and other players can't play cards or trigger abilities. While it's in a player's area, other players can't trigger its abilities." },
    { k: "Permanent", side: "both", src: "RR p.25, 32", d: "Can't be defeated, leave play or have its text blanked except by cards from its own set. Set aside before setup step 1 and put into play by other cards; doesn't count toward deck size." },
    { k: "Physical Icon", side: "player", src: "RR p.22, 32", d: "A resource icon that generates <b>one physical resource</b>. Some abilities require physical specifically." },
    { k: "Piercing", side: "both", src: "RR p.25, 32", d: "Before this attack deals damage, <b>discard every tough status card</b> from the attacked character (only if the attack would deal it damage)." },
    { k: "Quickstrike", side: "encounter", src: "RR p.25, 36", d: "After this minion engages a player <b>in hero form</b>, it attacks them — after any When Revealed abilities if it's being revealed." },
    { k: "Ranged", side: "both", src: "RR p.25, 36", d: "This attack <b>ignores retaliate</b>." },
    { k: "Requirement (Resources)", side: "player", src: "RR p.25, 37", d: "The listed resources <b>must be spent</b> when paying this card's cost — so it can't be played “ignoring its resource cost”." },
    { k: "Restricted", side: "player", src: "RR p.25, 38", d: "You can't control more than <b>two restricted cards</b>. You may play a third, then immediately discard down to two." },
    { k: "Retaliate X", side: "both", src: "RR p.26, 38", d: "After this character is attacked, deal <b>X damage to the attacker</b>. It must still be in play when the attack has resolved." },
    { k: "Setup", side: "both", src: "RR p.26, 40", d: "This card <b>starts the game in play</b> — it enters in the “Put Setup Cards Into Play” setup step. (A bold “Setup:” ability is different: it resolves during setup.)" },
    { k: "Stalwart", side: "both", src: "RR p.26, 40", d: "<b>Can't be stunned or confused</b>; gaining stalwart removes any such status cards." },
    { k: "Star Icon", side: "both", src: "RR p.11, 23, 40–41", d: "A reminder to check the card's text box whenever that stat or boost field is used. In a boost field it means resolve the card's “Boost” ability (the star isn't +1). A star stat is defined by the card's text — 0 if that text is blanked." },
    { k: "Steady", side: "both", src: "RR p.26, 41", d: "Can hold two stunned and two confused cards and is only stunned/confused with <b>two</b> of a type. When a status cancels its attack, scheme or thwart, remove all cards of that type." },
    { k: "Surge", side: "encounter", src: "RR p.26, 42", d: "When revealed, the revealing player deals themselves <b>another encounter card</b> — revealed after this card (and responses to it) finish resolving." },
    { k: "Team-Up", side: "player", src: "RR p.26, 43, 50", d: "Names two characters. You can include it only if your identity is one of them, and play it only while <b>both</b> are friendly characters in play (by title or subtitle)." },
    { k: "Teamwork (Trait)", side: "encounter", src: "RR p.26, 43", d: "After this minion enters play and engages a player, if another minion with that trait is in play, it <b>activates</b> against that player (after any When Revealed abilities)." },
    { k: "Temporary", side: "both", src: "RR p.26, 44", d: "Discard this card from play <b>when the round ends</b>." },
    { k: "Toughness", side: "both", src: "RR p.26, 45", d: "When this character enters play, give it a <b>tough</b> status card." },
    { k: "Unique Icon", side: "both", src: "RR p.23, 45–46", d: "A one-of-a-kind card: no matching cards in one deck, no matching identities at the table, and a matching non-villain card can't enter play while its match is in play." },
    { k: "Uses (X “type”)", side: "both", src: "RR p.26, 46", d: "Enters play with <b>X all-purpose counters</b> of that type, which its abilities spend; discard the card when the last one is removed." },
    { k: "Victory X", side: "both", src: "RR p.26, 46", d: "When defeated (for attachments and upgrades, when their host is; with uses, when the last counter is removed) it goes to the <b>victory display</b> instead of a discard pile, worth X victory points where a scenario or campaign counts them." },
    { k: "Villainous", side: "encounter", src: "RR p.26, 47", d: "When this character attacks or schemes (uses a basic power), it gets a <b>boost card</b>, just like the villain." },
    { k: "Vulnerable", side: "both", src: "RR p.48", d: "If this character becomes stunned or confused it is <b>discarded</b> (not defeated) — even if damage would defeat it at the same moment. With steady, it takes two status cards of a type." },
    { k: "Wild Icon", side: "player", src: "RR p.22, 35, 48", d: "Generates one resource of <b>any type you declare</b> (energy, mental, physical or wild) when paying a cost. Can't stand in for another type when a cost needs “printed” resources; outside of costs it's only “wild”." },
  ];

  /* ------------------------------------------------------------------ modes of play */
  MC.modes = [
    {
      id: "standard",
      h: "Standard Mode",
      src: "RR p.28, 40",
      d: "The basic mode for every scenario: follow the scenario's content and setup instructions as written. The <b>Standard encounter set</b> is added to most scenarios.",
    },
    {
      id: "expert",
      h: "Expert Mode",
      src: "RR p.19, 28, 50 · LtP p.19, 23",
      d: "For advanced players wanting a greater challenge: use the scenario's listed <b>expert villain stages</b> and add the <b>Expert encounter set</b> to the encounter deck, in addition to the standard set. (Core set: remove stage I and add stage III.) The Expert set is not a modular set. Combines with heroic, skirmish and campaign modes.",
    },
    {
      id: "heroic",
      h: "Heroic Mode",
      src: "RR p.29",
      d: "Scales the difficulty. Before the game the group chooses a <b>heroic level</b> (such as 1 or 4); for the rest of that game, in step 3 of every villain phase, deal <b>that many additional encounter cards to each player</b>. Combines with expert, skirmish and campaign modes.",
    },
    {
      id: "skirmish",
      h: "Skirmish Mode (Rookie Mode)",
      src: "RR p.29, 39",
      d: "Shortens the game. Before the game the group chooses <b>any one version of the villain</b>; in setup step 8 (Select Scenario) only that version is put into play and every other villain card is removed from the game. Combines with expert, heroic and campaign modes.",
    },
    {
      id: "campaign",
      h: "Campaign Mode",
      src: "RR p.11, 29, 51, 61",
      d: "Interconnected scenarios played one after another, with rules in the campaign's own rulebook and a <b>campaign log</b> recording what persists between games. A card removed from a campaign stays out for the rest of it, even on a replay. <b>Expert campaign</b> adds cards or setup instructions but doesn't require expert mode — choose the other modes freely for each scenario. Campaign setup is setup step 13; campaign-specific cards can only be used in their own campaign.",
    },
  ];

  /* ------------------------------------------------------------------ deckbuilding */
  MC.deckbuilding = {
    src: "RR p.50",
    player: [
      "Choose <b>exactly one identity</b>. <i>(RR p.50)</i>",
      "Deck size <b>40–50 cards</b>. The identity, <b>permanent</b> cards and <b>linked</b> cards don't count toward it. <i>(RR p.27, 32, 50)</i>",
      "Include <b>every identity-specific card</b> of your identity, in the exact quantities of its set. Identity-specific, obligation and nemesis cards must share the identity's set icon. <i>(RR p.23, 30, 50)</i>",
      "Choose <b>exactly one aspect</b> — Aggression, Justice, Leadership or Protection, or the fifth aspect, <b>'Pool</b> — and fill the rest of the deck with that aspect's cards and/or <b>basic</b> cards. <i>(RR p.8, 12, 50)</i>",
      "At most <b>3 copies</b> (by title) of each non-unique card, and <b>no two matching unique cards</b> — the identity counts. <i>(RR p.50)</i>",
      "“<b>Max X per deck</b>” on a card lowers that card's limit. <i>(RR p.28)</i>",
      "Follow any <b>deckbuilding requirements</b> printed on your identity card. <i>(RR p.50)</i>",
      "<b>Team-Up</b> cards need your identity to be one of the two named characters. If one of your identity-specific cards matches another player's chosen identity, you may replace it with a Team-Up card naming both identities. <i>(RR p.43, 50)</i>",
      "Your <b>obligation(s)</b> and <b>nemesis set</b> aren't part of your deck — they're set aside at setup, and the obligations are shuffled into the encounter deck. <i>(RR p.30, 51)</i>",
      "Once setup has begun, game effects may add matching cards to your deck. <i>(RR p.45)</i>",
      "<i>Optional (beta):</i> a <b>game environment</b> limits which products you build from — <b>Current</b> (core set plus the most recent products), <b>Legacy</b> (everything) or <b>Limited</b> (core set + up to 3 campaign/custom-scenario expansions + up to 4 hero packs). Any scenario and modular sets may still be played. <i>(RR p.71)</i>",
      "New to deckbuilding? Try different heroes with different aspects, then start adjusting the starter decks. <i>(LtP p.22)</i>",
    ],
    encounter: [
      "Each scenario has a <b>recommended list</b> of card sets forming its default encounter deck (core set lists: LtP p.23), plus its villain deck and main scheme deck. <i>(RR p.39, 50)</i>",
      "The encounter deck is the scenario's own set(s) + <b>modular set(s)</b> + the <b>Standard</b> set (most scenarios) + the <b>Expert</b> set in expert mode + every hero's <b>obligation(s)</b>. <i>(RR p.19, 40, 51)</i>",
      "<b>Customize:</b> remove the recommended modular set and add any other. More than one is possible but dilutes the deck. For surprise, choose from facedown sets and shuffle it in unseen. <i>(RR p.50 · LtP p.23)</i>",
      "Modular sets are added <b>whole</b> — no single cards unless the scenario says so. Some scenarios <b>require</b> particular modular sets; others let players choose. <i>(RR p.29)</i>",
      "The <b>Standard</b> and <b>Expert</b> sets are not modular and can't be picked when a scenario asks for a modular set. <i>(RR p.19, 40)</i>",
      "Encounter sets with the same name but different set icons are different sets. <i>(RR p.18)</i>",
      "Core set modular difficulty levels: Bomb Scare 1, Masters of Evil 2, Under Attack 3, Legions of Hydra 4, The Doomsday Chair 5 — a higher level generally adds more difficulty. <i>(LtP p.23)</i>",
    ],
  };

  /* ------------------------------------------------------------------ FAQ (RR Appendix IV, p.57–65) — all 107 entries */
  MC.faq = [
    // General questions
    { topic: "General Questions · Tough status cards", src: "RR p.57", q: "My hero has a tough card and is dealt damage — can I use an interrupt to reduce or prevent it and keep the tough card?", a: "No. Status cards take priority over triggered abilities, so the tough card is discarded to prevent all the damage first. You can keep it if a constant effect reduces the damage your hero takes to 0, or your basic defense (DEF) reduces the attack's damage dealt to 0." },
    { topic: "General Questions · Tough vs. overkill", src: "RR p.57", q: "My ally has a tough card and is hit by an overkill attack — does the excess damage go to my identity?", a: "No. Overkill only passes on excess damage the ally actually takes, and the tough card means it takes none." },
    // Core Set
    { topic: "Core Set · Aspect card counts", src: "RR p.57", q: "The core set has 19 Aggression, Justice and Protection cards but only 18 Leadership cards — correct?", a: "Yes. Leadership has one fewer card because it has more unique cards to choose from." },
    { topic: "Core Set · Spider-Man (#1A)", src: "RR p.57", q: "When does the villain “initiate” an attack against Spider-Man?", a: "The moment the game determines an attack will be made — from a game step (villain phase step 2) or a card (such as the Assault treachery). Spider-Sense resolves before any step of the enemy attack process." },
    { topic: "Core Set · Webbed Up (#9)", src: "RR p.57", q: "How many attacks does Webbed Up prevent?", a: "Two. It replaces the attached enemy's next attack with placing a stunned card, and that stun then cancels the enemy's following attack." },
    { topic: "Core Set · Webbed Up (#9)", src: "RR p.57", q: "Does Webbed Up stop Spider-Sense from triggering?", a: "Yes. It's a replacement effect (“instead”), so the attack never initiates." },
    { topic: "Core Set · Jennifer Walters (#19B)", src: "RR p.57", q: "Can Jennifer Walters remove threat from a side scheme as it enters play?", a: "No. Side schemes enter play with threat already on them; that threat isn't “placed”." },
    { topic: "Core Set · Jennifer Walters (#19B)", src: "RR p.57", q: "Does her ability trigger when threat is placed during setup?", a: "No. Only abilities with a “Setup” trigger can resolve during setup." },
    { topic: "Core Set · Legal Practice (#23)", src: "RR p.57", q: "Can Legal Practice split its threat removal across several schemes?", a: "No. All the threat must come off a single scheme." },
    { topic: "Core Set · Focused Rage (#27)", src: "RR p.57", q: "Can She-Hulk use Focused Rage to draw a card while she has a tough card?", a: "No. The tough card prevents her taking the 1 damage, so the cost can't be paid — and you can't pay part of a cost just to strip the tough card." },
    { topic: "Core Set · Superhuman Strength (#28)", src: "RR p.57", q: "If She-Hulk attacks an enemy that can't be stunned (already stunned, or stalwart), does the Forced Interrupt resolve?", a: "No. It can't affect that enemy, so it doesn't resolve and Superhuman Strength isn't discarded." },
    { topic: "Core Set · Repulsor Blast (#31)", src: "RR p.57", q: "Can the first point of damage strip an enemy's tough card and the additional damage then hit?", a: "No. The additional damage modifies the first point simultaneously — e.g. two energy resources discarded means 5 damage dealt all at once." },
    { topic: "Core Set · Pepper Potts (#33)", src: "RR p.57", q: "Does she generate 2 resources if the top card of the discard pile has 2 printed resources (Energy, Genius, Strength)?", a: "Yes — resources equal in number and type to that card's." },
    { topic: "Core Set · Pepper Potts (#33)", src: "RR p.58", q: "Does she generate 2 resources if a “The Power of [Aspect]” card is on top of the discard pile?", a: "No. Pepper Potts is the card generating the resources, so The Power of… never generates its bonus." },
    { topic: "Core Set · Pepper Potts (#33)", src: "RR p.58", q: "Can she copy the resources of a card being spent right now?", a: "No. Resources are generated simultaneously, so that card isn't on top of the discard pile yet." },
    { topic: "Core Set · Rocket Boots (#39)", src: "RR p.58", q: "Iron Man has 1 hit point left and Rocket Boots is discarded — is he defeated?", a: "Yes. When a hit point modifier ends, hit points revert; he drops to 0 and is defeated." },
    { topic: "Core Set · Black Panther (#40A)", src: "RR p.58", q: "An enemy attacks Black Panther but another hero or an ally defends — does his retaliate trigger?", a: "No. Black Panther himself must be attacked." },
    { topic: "Core Set · Black Panther (#40A)", src: "RR p.58", q: "Does retaliate trigger when Black Panther defends an attack?", a: "Yes — he is attacked, so retaliate triggers." },
    { topic: "Core Set · Ancestral Knowledge (#42)", src: "RR p.58", q: "Can it shuffle different versions of Wakanda Forever into Black Panther's deck?", a: "No. Cards with the same title are the same card for card abilities." },
    { topic: "Core Set · Vibranium Suit (#49)", src: "RR p.58", q: "Does moving damage discard the target enemy's tough card?", a: "Yes. Damage moved onto a character is dealt to it." },
    { topic: "Core Set · Tigra (#51)", src: "RR p.58", q: "Does Tigra's Response trigger before or after her consequential damage?", a: "Before — it's checked right after she defeats the minion, before consequential damage is applied." },
    { topic: "Core Set · Make the Call (#71)", src: "RR p.58", q: "Does a “The Power of [Aspect]” card generate 1 or 2 resources for Make the Call?", a: "You are paying the ally's printed cost, so it generates 2 only if that ally's aspect matches; otherwise 1." },
    { topic: "Core Set · Whirlwind (#130)", src: "RR p.58", q: "How is his attack against each hero resolved?", a: "As separate attacks against each hero, resolved simultaneously step by step. Each attack may have its own defender, who defends for one player only." },
    { topic: "Core Set · Ultron II (#135)", src: "RR p.58", q: "If another player defends, whose Drone minions count for Ultron's +1 ATK?", a: "Those engaged with the player the attack was initiated against. The ability resolved before defenders were declared, creating a lasting effect that refers to that original target; the bonus changes if that player's Drone count changes." },
    { topic: "Core Set · Assault (#197)", src: "RR p.58", q: "Assault makes the villain attack with one card left in the encounter deck — is Assault shuffled back in when the boost card empties the deck?", a: "No. Assault isn't discarded until the villain's attack has finished resolving." },
    // Green Goblin Scenario Pack
    { topic: "Green Goblin Scenario Pack · Norman Osborn (#1A)", src: "RR p.58", q: "Will a stunned card prevent Norman Osborn's attack activation?", a: "Yes. Status cards take priority over all other abilities." },
    { topic: "Green Goblin Scenario Pack · Green Goblin (#1B)", src: "RR p.59", q: "What if a Boost ability removes the last madness counter from State of Madness while Green Goblin is attacking?", a: "He flips to Norman Osborn at once. The boost icons are added to Norman's star ATK (treated as 0) and he deals that much damage. His Forced Interrupt doesn't trigger — the attack is already past “would attack”." },
    { topic: "Green Goblin Scenario Pack · I See You (#30)", src: "RR p.59", q: "If I reveal I See You in alter-ego form, does Green Goblin attack me?", a: "Yes. Its When Revealed doesn't specify a form." },
    // Captain America Hero Pack
    { topic: "Captain America Hero Pack · Steve Rogers (#1B)", src: "RR p.59", q: "If Captain America's Shield became a Drone minion during Ultron's setup, can Steve's Setup ability retrieve it?", a: "No. The Setup ability only searches your deck and discard pile." },
    { topic: "Captain America Hero Pack · Steve Rogers (#1B)", src: "RR p.59", q: "I played an ally as Captain America, then flipped to Steve Rogers — does Living Legend apply to the next ally?", a: "No. It only applies to the first ally played each round." },
    // Ms. Marvel Hero Pack
    { topic: "Ms. Marvel Hero Pack · Embiggen (#10)", src: "RR p.59", q: "How does Embiggen work with an Attack event that deals damage more than once (e.g. Melee)?", a: "Every instance gets +2 — 3 damage then 3 damage becomes 5 then 5." },
    { topic: "Ms. Marvel Hero Pack · Shrink (#11)", src: "RR p.59", q: "Can I exhaust Shrink when playing Emergency to remove 2 threat?", a: "No. Shrink adds to threat removed by thwart events; Emergency only prevents threat, so Shrink does nothing." },
    { topic: "Ms. Marvel Hero Pack · Nova / Sam Alexander (#12)", src: "RR p.59", q: "If Nova's ability defeats an attacking enemy, does its attack still deal damage?", a: "No. Damage hasn't been calculated yet, so the rest of the attack fails to resolve." },
    { topic: "Ms. Marvel Hero Pack · Melee (#30)", src: "RR p.59", q: "Can Melee damage the same enemy twice?", a: "No. The second damage must go to a different enemy — and different villain stages count as the same enemy." },
    { topic: "Ms. Marvel Hero Pack · Melee (#30)", src: "RR p.59", q: "Engaged with a guard minion, can I target it and then the villain?", a: "Yes, if the first sentence defeats the guard minion, the second sentence can damage the villain." },
    // Thor Hero Pack
    { topic: "Thor Hero Pack · Jarnbjorn (#19)", src: "RR p.59", q: "Can I trigger Jarnbjorn after playing an Attack event?", a: "Yes. A hero attacks both with the basic attack power and with (attack)-labeled actions." },
    { topic: "Thor Hero Pack · Jarnbjorn (#19)", src: "RR p.59", q: "If an Attack event damages several enemies, can Jarnbjorn trigger for each?", a: "Yes. Each enemy dealt damage by an Attack event was attacked." },
    // Black Widow Hero Pack
    { topic: "Black Widow Hero Pack · Dance of Death (#4)", src: "RR p.59", q: "It has no (attack) label — are its damage effects really attacks?", a: "Yes. Its first sentence makes each damage effect an individual attack; resolve them one at a time as normal attacks." },
    { topic: "Black Widow Hero Pack · Dance of Death (#4)", src: "RR p.59", q: "If Black Widow is stunned, are all of its attacks prevented?", a: "No — only the first of its three separate attacks; the other two happen normally." },
    { topic: "Black Widow Hero Pack · Attacrobatics (#6)", src: "RR p.59", q: "Can Attacrobatics cancel 0 boost icons?", a: "No. A card with no boost icons is not a valid target." },
    { topic: "Black Widow Hero Pack · Widow's Bite (#10)", src: "RR p.60", q: "With Widow's Bite in play I reveal a quickstrike minion — which resolves first?", a: "Both trigger on the minion engaging you; keywords have priority over Responses, so quickstrike resolves first." },
    // Doctor Strange Hero Pack
    { topic: "Doctor Strange Hero Pack · The Night Nurse (#19)", src: "RR p.60", q: "If a hero's only status card is tough, is it discarded when The Night Nurse heals that hero?", a: "Yes. She discards 1 status card from the hero, whatever its type." },
    { topic: "Doctor Strange Hero Pack · Unflappable (#20)", src: "RR p.60", q: "Defending, my identity took damage from a Boost ability but none from the attack itself — can I trigger Unflappable?", a: "Yes. Its cost only needs the defending identity to take no damage in step 4 of the enemy attack." },
    { topic: "Doctor Strange Hero Pack · Counterspell (#30)", src: "RR p.60", q: "Counterspell says “Attach to your hero” — what if I draw it in alter-ego form?", a: "It can't attach, so simply discard it (don't reveal a replacement encounter card)." },
    { topic: "Doctor Strange Hero Pack · Images of Ikonn (#33)", src: "RR p.60", q: "Can I resolve it if the villain is already confused and no scheme has threat?", a: "Yes. Its second effect always has a valid target (the card itself), so it resolves as much as it can." },
    // Hulk Hero Pack
    { topic: "Hulk Hero Pack · Crushing Blow (#2)", src: "RR p.60", q: "If its cost is reduced to 0, can it be played without spending physical resources?", a: "Yes. The physical-only restriction applies only when resources are actually spent on its cost." },
    { topic: "Hulk Hero Pack · Unstoppable Force (#6)", src: "RR p.60", q: "If its cost is reduced to 0, do I draw a card from its second ability?", a: "No. Nothing was paid using only physical resources, so the condition isn't met." },
    { topic: "Hulk Hero Pack · Clash of Titans (#28)", src: "RR p.60", q: "My highest-ATK character is an ally and the attack is undefended — who takes the damage?", a: "The attacked ally takes all of it." },
    // Rise of Red Skull Expansion
    { topic: "Rise of Red Skull Expansion · Hawkeye's Quiver (#3)", src: "RR p.60", q: "After searching the top 5 cards of my deck, what do I do with them?", a: "Shuffle Hawkeye's whole deck — any search, even of part of a deck, ends with a full shuffle." },
    { topic: "Rise of Red Skull Expansion · Marked for Death (#28)", src: "RR p.60", q: "When it's revealed, what if a copy of Mockingbird is already controlled by someone other than Clint Barton?", a: "The Clint Barton player can still tuck their Mockingbird under the scheme — tucked cards aren't in play." },
    { topic: "Rise of Red Skull Expansion · Jessica Drew (#31B)", src: "RR p.60", q: "Does Double Agent require her deck to be built with two aspects?", a: "Yes — an equal number of cards from two different aspects." },
    { topic: "Rise of Red Skull Expansion · Finesse (#33)", src: "RR p.60", q: "Can Finesse pay for an aspect card's ability (such as Jarnbjorn)?", a: "Yes, as long as the resource is spent on an aspect card — its resource cost or a cost in its ability." },
    // The Once and Future Kang Scenario Pack
    { topic: "The Once and Future Kang Scenario Pack · Split game areas", src: "RR p.60", q: "While the players are split into separate game areas, where are environment cards?", a: "In all players' game areas." },
    { topic: "The Once and Future Kang Scenario Pack · Depowered (#20)", src: "RR p.60", q: "With Depowered in Doctor Strange's play area, can he still use the Invocation deck?", a: "Yes. Invocation cards are resolved, not played." },
    // Wasp Hero Pack
    { topic: "Wasp Hero Pack · Wasp (#1C)", src: "RR p.61", q: "How does Giant Wasp's first ability interact with patrol and the crisis icon?", a: "Her basic thwart removes threat from every scheme she chooses at once, but she can't choose the main scheme while engaged with a patrol minion or while a crisis icon is in play — even if that card leaves play mid-thwart." },
    { topic: "Wasp Hero Pack · Wasp (#1C)", src: "RR p.61", q: "How does Giant Wasp's second ability interact with guard?", a: "Her basic attack damages every enemy she chooses at once, but she can't choose the villain while engaged with a guard minion — even if it leaves play mid-attack." },
    { topic: "Wasp Hero Pack · Wasp (#1C)", src: "RR p.61", q: "Giant Wasp divides her attack among several retaliate enemies — what happens?", a: "She attacked each of them, so each retaliate damages her, in the order she chooses." },
    // Quicksilver Hero Pack
    { topic: "Quicksilver Hero Pack · Quicksilver (#1A)", src: "RR p.61", q: "If he attempts a basic attack while stunned (or basic thwart while confused), does Super Speed trigger?", a: "No. The status card replaces the basic power, so he didn't use one." },
    // Scarlet Witch Hero Pack
    { topic: "Scarlet Witch Hero Pack · Hex Bolt (#4)", src: "RR p.61", q: "Do the bulleted abilities resolve after each discarded card, or after all 3?", a: "After all 3. With no alteration effect, resolve the first sentence fully, then resolve the bullets based on what was discarded." },
    { topic: "Scarlet Witch Hero Pack · Slipping Sanity (#23)", src: "RR p.61", q: "Is it intentional that Scarlet Witch has two obligation cards?", a: "Yes — they represent the negative side of her chaotic powers." },
    // Galaxy's Most Wanted Expansion
    { topic: "Galaxy's Most Wanted Expansion · Modular encounter sets", src: "RR p.61", q: "Which Galaxy's Most Wanted sets are modular?", a: "Any set that isn't scenario-specific or “Campaign”: Badoon Headhunter, Band of Badoon, Galactic Artifacts, Kree Militants, Menagerie Medley, Power Stone, Space Pirates and Ship Command." },
    { topic: "Galaxy's Most Wanted Expansion · Campaign mode", src: "RR p.61", q: "Must every scenario of an expert campaign be played in expert mode?", a: "No. A harder campaign only adds cards or setup instructions; choose the other modes you want for each scenario." },
    { topic: "Galaxy's Most Wanted Expansion · Campaign mode", src: "RR p.61", q: "If I play one scenario in expert mode, must I play the next the same way?", a: "No — mix and match modes between the scenarios of a campaign." },
    { topic: "Galaxy's Most Wanted Expansion · Rocket Raccoon (#29A)", src: "RR p.61", q: "If the Tech upgrade discarded for Tinkering doesn't reach a discard pile (e.g. because of Collector), do I still draw 2?", a: "Yes. Discarding is the attempt to place a card in a discard pile, so the cost was paid." },
    { topic: "Galaxy's Most Wanted Expansion · Salvage (#33)", src: "RR p.61", q: "What happens if the Hulk ally (Core Set #50) discards Salvage?", a: "Hulk checks all of Salvage's printed resources at once; the player controlling Hulk chooses the order of the resulting effects." },
    { topic: "Galaxy's Most Wanted Expansion · Battery Pack (#34)", src: "RR p.62", q: "Can Battery Pack move a charge counter to a Tech card that doesn't use charge counters?", a: "Yes. A counter takes the type defined by the card it's on (if any)." },
    { topic: "Galaxy's Most Wanted Expansion · Power Stone (#149)", src: "RR p.62", q: "What happens to the Power Stone if the identity controlling it is defeated?", a: "The eliminated player resolves its “attach to” text, so it attaches to the villain." },
    { topic: "Galaxy's Most Wanted Expansion · Power Stone (#149)", src: "RR p.62", q: "A character with the Power Stone is dealt 3+ damage but takes less because of prevention — does the attacker take the Stone?", a: "Yes. Prevention doesn't reduce damage dealt. A hero's basic defense does reduce damage dealt (by DEF), so defending can keep the Stone." },
    // Star-Lord Hero Pack
    { topic: "Star-Lord Hero Pack · Star-Lord (#1A)", src: "RR p.62", q: "In hero form I play an ally without the printed Guardian trait — can Knowhere (#22) respond?", a: "Yes. His constant ability gives the ally the Guardian trait first, because constant abilities come before triggered ones." },
    { topic: "Star-Lord Hero Pack · Mister Knife (#26)", src: "RR p.62", q: "If Shadow of the Past reveals Mister Knife, does Shadow of the Past gain surge as the Star-Lord player's first treachery that phase?", a: "No. Mister Knife wasn't in play when Shadow of the Past was revealed." },
    { topic: "Star-Lord Hero Pack · Dive Bomb (#28)", src: "RR p.62", q: "Can I play Dive Bomb while engaged with a guard minion, and how does it resolve?", a: "Yes, one sentence at a time. If the 7 damage defeats the guard minion, the 1 damage to each other enemy includes the villain; if not, it hits every other enemy except the villain." },
    // Venom Hero Pack
    { topic: "Venom Hero Pack · Grasping Tendrils (#3)", src: "RR p.62", q: "If I cancel an attack with Grasping Tendrils, did my hero defend it?", a: "Yes — it is defense-labeled." },
    // Mad Titan's Shadow Expansion
    { topic: "Mad Titan's Shadow Expansion · Scenario 2, Tower Defense", src: "RR p.62", q: "When a minion schemes, which main scheme gets the threat?", a: "The main scheme with the Focused Defense attachment." },
    { topic: "Mad Titan's Shadow Expansion · In-Betweener (#42), Living Tribunal (#48), Eternity (#54), The Gardener (#60)", src: "RR p.62", q: "Where does a Cosmic Entity event go after resolving as a boost card?", a: "Into the encounter discard pile." },
    // Nebula Hero Pack
    { topic: "Nebula Hero Pack · Old Rivals (#31)", src: "RR p.62", q: "When Old Rivals makes Gamora (ally or hero) attack, can her controller use abilities triggered by her attacking?", a: "Yes — she has attacked." },
    { topic: "Nebula Hero Pack · Old Rivals (#31)", src: "RR p.62", q: "Does the Gamora ally take consequential damage from that attack?", a: "Yes. Allies always take consequential damage after they attack." },
    // War Machine Hero Pack
    { topic: "War Machine Hero Pack · Gauntlet Gun (#5)", src: "RR p.62", q: "Can its resource ability be used for costs other than a War Machine event, just to add an ammo counter?", a: "No — only when paying for a War Machine event." },
    // Sinister Motives Expansion
    { topic: "Sinister Motives Expansion · Scenario 4, The Sinister Six", src: "RR p.62", q: "With more than one villain in play, which takes overkill damage?", a: "The villain with the active counter." },
    { topic: "Sinister Motives Expansion · Scenario 4, The Sinister Six", src: "RR p.62", q: "A villain must activate, but none of the villains in play has the active counter — what now?", a: "Put the active counter on the villain with the lowest activation order value and continue the activation." },
    { topic: "Sinister Motives Expansion · Scenario 5, Venom Goblin", src: "RR p.63", q: "What happens when one of the main schemes is completed?", a: "Flip that main scheme to its environment side and reveal the environment." },
    { topic: "Sinister Motives Expansion · Scenario 5, Venom Goblin", src: "RR p.63", q: "A player card places an acceleration token on “the main scheme” — which one?", a: "The main scheme with the glider counter." },
    { topic: "Sinister Motives Expansion · Scenario 5, Venom Goblin", src: "RR p.63", q: "A player card counts acceleration tokens on “the main scheme” — which one?", a: "The player using the effect chooses one main scheme to count." },
    { topic: "Sinister Motives Expansion · Across the Spider-Verse (#18)", src: "RR p.63", q: "Can its ability repeat more than once?", a: "Yes — repeating includes the repeat effect itself, so it can keep repeating while you can still choose a player able to spend 3 resources and exhaust a Web-Warrior card." },
    // Ironheart Hero Pack
    { topic: "Ironheart Hero Pack · “Go for Champions!” (#25)", src: "RR p.63", q: "After playing it this round, can I use an ability whose cost is taking damage?", a: "No. If you can't take damage, you can't pay a cost that requires it." },
    // Spider-Ham Hero Pack
    { topic: "Spider-Ham Hero Pack · Warrior of the Great Web (#29)", src: "RR p.63", q: "Can the SP//dr hero or ally have it attached?", a: "No. The character's title must contain “Spider” spelled exactly that way." },
    // SP//dr Hero Pack
    { topic: "SP//dr Hero Pack · Spider-Man Noir (#15)", src: "RR p.63", q: "If a treachery's When Revealed is canceled, can Spider-Man Noir attach it to himself?", a: "Only if some part of the card resolved — for example a reveal keyword like surge or incite X. If nothing on it resolved, he can't." },
    // Mutant Genesis Expansion
    { topic: "Mutant Genesis Expansion · Powerful Punch (#14)", src: "RR p.63", q: "When does Shadowcat flip her mass form if she plays Powerful Punch on the villain?", a: "She plays it as the villain initiates its attack and deals 4 damage; once that attack-labeled effect resolves she has attacked and may flip (must, if Phased). The villain's attack continues with her defending — Phased, she takes no damage — and after it she may flip again (must, if Phased)." },
    { topic: "Mutant Genesis Expansion · Mutant Protectors (#17)", src: "RR p.63", q: "How does its defense label work when the card makes an ally the defender?", a: "You become the attack's target player and the X-Men ally put into play is the defender. If that ally leaves play before damage, your hero becomes the defender and can use “after you defend” responses — but it isn't a basic defense, so DEF doesn't reduce the attack." },
    { topic: "Mutant Genesis Expansion · White Queen (#56)", src: "RR p.63", q: "How does her constant ability work?", a: "“You are confused” keeps placing confused cards on the engaged player's identity up to the maximum it can hold (normally one; more with steady). Thwarting removes them, but new ones arrive immediately. After she leaves play, any remaining confused cards stay until a thwart attempt removes them." },
    { topic: "Mutant Genesis Expansion · Operation Zero Tolerance (#104)", src: "RR p.63", q: "An ally defeated by an enemy attack isn't discarded (e.g. returned to hand or shuffled into a deck) — does it go under Operation Zero Tolerance?", a: "Yes, wherever it ended up." },
    { topic: "Mutant Genesis Expansion · Fabian Cortez (#159)", src: "RR p.64", q: "His When Defeated puts a teamwork Acolyte minion into play while he's the only other Acolyte in play — does teamwork trigger?", a: "No. That's the last part of his ability, so he is discarded as the minion enters play — no other Acolyte is in play when teamwork checks." },
    // Cyclops Hero Pack
    { topic: "Cyclops Hero Pack · Ricochet Beam (#9)", src: "RR p.64", q: "Both instances target the same enemy with Exploit Weakness attached — how much damage?", a: "8 in total (4 + 4): Exploit Weakness adds 1 to each instance." },
    // MojoMania Scenario Pack
    { topic: "MojoMania Scenario Pack · Dial M for Mojo (#35)", src: "RR p.64", q: "Spiral flips while Dial M for Mojo is in play — does her incite 1 trigger?", a: "Yes. Villains are encounter cards, so she has incite 1, and her new face is revealed when she flips." },
    { topic: "MojoMania Scenario Pack · Wild Wild Mojo (#66)", src: "RR p.64", q: "How does its Forced Interrupt affect overkill damage?", a: "It adds 1 to the initial damage to the minion or ally, then another 1 when the excess is applied to the villain or identity — +2 overkill damage in total." },
    // NeXt Evolution Expansion
    { topic: "NeXt Evolution Expansion · Malice (#199)", src: "RR p.64", q: "Is Malice still a minion while attached to an ally?", a: "Yes: she keeps the minion type and her damage; she can be attacked and targeted but can't be defeated again; she isn't engaged, so she doesn't activate; and she's discarded when her host leaves play." },
    // X-23 Hero Pack
    { topic: "X-23 Hero Pack · Honey Badger (#3)", src: "RR p.64", q: "Can her Response trigger if the damage defeats her?", a: "No. She has already left play by then." },
    // Deadpool Hero Pack
    { topic: "Deadpool Hero Pack · Crisis of Infinite Deadpools (#37)", src: "RR p.64", q: "Is it in the encounter deck if an ability lets a player include 'Pool cards from outside their chosen aspect?", a: "No. It's included only if at least one player chose 'Pool as (one of) their aspect(s)." },
    // Age of Apocalypse Expansion
    { topic: "Age of Apocalypse Expansion · Magik (#30A)", src: "RR p.64", q: "When she plays the top card of her deck, when is the next card turned faceup?", a: "As soon as she moves the card she's playing onto the table (as with playing from hand, during the Initiating Abilities process)." },
    { topic: "Age of Apocalypse Expansion · Magik (#30A)", src: "RR p.64", q: "Can she play her top card through “play a card from your hand” abilities (e.g. Team-Building Exercise, Ant-Man #24)?", a: "Yes. Whenever she could play a card from hand she may play her top card instead (once per phase)." },
    { topic: "Age of Apocalypse Expansion · Magik (#30A)", src: "RR p.64", q: "Does an “after you play [card] from your hand” ability (e.g. Pixie, Storm #17) trigger when she plays her top card?", a: "Yes. That card counts as played from her hand." },
    { topic: "Age of Apocalypse Expansion · Magik (#30A)", src: "RR p.64", q: "Can she put her top card into play as if it were in hand (e.g. Mutant Protectors)?", a: "No. Putting into play isn't playing, and her ability only lets her play it." },
    // Agents of S.H.I.E.L.D. Expansion
    { topic: "Agents of S.H.I.E.L.D. Expansion · Maria Hill (#1B)", src: "RR p.64", q: "Can my Maria Hill deck include just one or two S.H.I.E.L.D. supports from other aspects?", a: "No — all or nothing: the maximum copies of exactly three off-aspect S.H.I.E.L.D. supports, or none at all." },
    { topic: "Agents of S.H.I.E.L.D. Expansion · Stealth (#35)", src: "RR p.65", q: "Stealth turns the villain's activation into a scheme — what if the villain is confused?", a: "The activation re-initiates as a scheme, so the confused card cancels it, and Nick Fury places no threat on his suit form upgrade." },
    // Black Panther Hero Pack
    { topic: "Black Panther Hero Pack · The Elephant's Trunk (#7)", src: "RR p.65", q: "Can exhausting The Elephant's Trunk itself pay its action's cost?", a: "Yes. It's a Wakanda support, so it meets the minimum of one Wakanda ally or support." },
    { topic: "Black Panther Hero Pack · Target Spotter (#38)", src: "RR p.65", q: "If I use Target Spotter on a minion another player revealed, does it ever engage them?", a: "No. Target Spotter interrupts the engagement, and the minion engages you instead." },
    // Falcon Hero Pack
    { topic: "Falcon Hero Pack · Redwing (#2)", src: "RR p.65", q: "Can Redwing trigger if the top encounter card is visible and has no boost icons?", a: "No. You know the ability can't affect its target, so it can't be triggered." },
    // Hercules Hero Pack
    { topic: "Hercules Hero Pack · Labor cards", src: "RR p.65", q: "What happens if a Labor card finds no target when it's revealed?", a: "Discard it. Whenever a Labor card leaves play other than to the victory display, put it on the bottom of the Labor deck." },
  ];

  /* ------------------------------------------------------------------ errata (RR Appendix V, p.65–70) — all 87 entries */
  MC.errata = [
    // Core Set
    { card: "Superhuman Law Division (#26)", product: "Core Set", src: "RR p.65", change: "Its Alter-Ego Action (exhaust it and spend a mental resource → remove 2 threat from a scheme) loses the “(thwart)” label." },
    { card: "Iron Man (#29A)", product: "Core Set", src: "RR p.65", change: "Cap changed from “a maximum hand size of 7” to <b>+6</b> hand size: you get +1 hand size per Tech upgrade you control, up to +6." },
    { card: "The Doomsday Chair (#183)", product: "Core Set", src: "RR p.65", change: "Text now spells M.O.D.O.K. with periods (if he isn't in play, search the encounter deck and discard pile for him, put him into play engaged with you, shuffle)." },
    { card: "M.O.D.O.K. (#184)", product: "Core Set", src: "RR p.65", change: "Periods added to the card title." },
    // The Wrecking Crew Scenario Pack
    { card: "“I've Been Waiting for This!” (#41)", product: "The Wrecking Crew Scenario Pack", src: "RR p.65", change: "The active villain <b>heals</b> 3 hit points (was “gains”), then gets a tough status card." },
    // Captain America Hero Pack
    { card: "Honorary Avenger (#25)", product: "Captain America Hero Pack", src: "RR p.65", change: "Adds “Max 1 per character.”" },
    { card: "Followed (#32)", product: "Captain America Hero Pack", src: "RR p.65", change: "Now an <b>Interrupt</b> (was Response): when the attached scheme is defeated, deal 4 damage to an enemy." },
    // Thor Hero Pack
    { card: "Lightning Strike (#6)", product: "Thor Hero Pack", src: "RR p.65", change: "Second sentence reads “This <b>damage</b> ignores tough status cards if you have the Aerial trait” (was “This attack”)." },
    { card: "Loki (#28)", product: "Thor Hero Pack", src: "RR p.66", change: "Now a <b>Forced Interrupt</b> (was Interrupt): when Loki would be defeated, discard the top encounter card; if it's a treachery, heal all damage from Loki instead." },
    // Black Widow Hero Pack
    { card: "Black Widow (#1A)", product: "Black Widow Hero Pack", src: "RR p.66", change: "Widowmaker triggers after you <b>resolve</b> (was “trigger”) the ability of a Preparation card you control." },
    { card: "Synth-Suit (#9)", product: "Black Widow Hero Pack", src: "RR p.66", change: "Triggers after you <b>resolve</b> (was “trigger”) the ability of a Preparation card you control." },
    // Doctor Strange Hero Pack
    { card: "Iron Fist (#14)", product: "Doctor Strange Hero Pack", src: "RR p.66", change: "Now an <b>Interrupt</b> (was Response) when he attacks an enemy: remove 1 mystic counter → stun that enemy and deal 1 damage to it." },
    { card: "Warning (#21)", product: "Doctor Strange Hero Pack", src: "RR p.66", change: "Loses the “(defense)” label and the Defense trait; it still reduces damage a hero would take by 1." },
    // Hulk Hero Pack
    { card: "Inner Demons (#25)", product: "Hulk Hero Pack", src: "RR p.66", change: "“Then:” removed — change form, then the bullet for your form applies (Bruce Banner: discard 2 cards; Hulk: exhaust your hero), and the obligation is discarded." },
    // Rise of Red Skull Expansion
    { card: "Avengers Tower (#21)", product: "Rise of Red Skull Expansion", src: "RR p.66", change: "Gains the Avenger trait." },
    { card: "Marked for Death (#28)", product: "Rise of Red Skull Expansion", src: "RR p.66", change: "The Clint Barton player <b>tucks</b> Mockingbird faceup beneath it (was “places”), and <b>the tucked</b> Mockingbird (words added) returns to her owner's hand when this <b>scheme</b> (was “stage”) is defeated." },
    { card: "Hail Hydra! (#57, #147)", product: "Rise of Red Skull Expansion", src: "RR p.66", change: "Shuffle the encounter deck only if it was searched." },
    { card: "Attack on Mount Athena (#61A)", product: "Rise of Red Skull Expansion", src: "RR p.66", change: "Contents list the <b>Hydra Assault</b> modular set (was “Hydra Patrol”)." },
    { card: "The Rise of Red Skull (#128A)", product: "Rise of Red Skull Expansion", src: "RR p.66", change: "Setup shuffles every other <b>encounter</b> side scheme into the side-scheme deck (word “encounter” added)." },
    { card: "Twisted Reality (#135)", product: "Rise of Red Skull Expansion", src: "RR p.66", change: "Now a <b>Forced Interrupt</b> (was Forced Response): when the attached side scheme is defeated, deal the first player an encounter card." },
    { card: "Bitter Rival (#136)", product: "Rise of Red Skull Expansion", src: "RR p.66", change: "Reworded for the updated “for each” rules: for each side scheme in play, choose and exhaust a character you control." },
    // Wasp Hero Pack
    { card: "Beetle (#28)", product: "Wasp Hero Pack", src: "RR p.66", change: "The <b>defeating player</b> chooses to spend a physical resource or shuffle Beetle into the encounter deck." },
    // Galaxy's Most Wanted Expansion
    { card: "Rulebook p.10 — Campaign instructions, Setup, bullet 5", product: "Galaxy's Most Wanted Expansion", src: "RR p.66", change: "Expert Campaign only: “When setup ends”, each player in player order puts 1 card from their hand faceup into The Collection (timing added)." },
    { card: "Rulebook p.18 — Campaign instructions, Setup, bullet 1", product: "Galaxy's Most Wanted Expansion", src: "RR p.66", change: "Revealing the Kree Supremacy (#182A) side scheme is now <b>optional</b> (reverse side for expert mode)." },
    { card: "Obedience Potion (#123)", product: "Galaxy's Most Wanted Expansion", src: "RR p.66", change: "“Any player can do this” is now rules text, not reminder text (Hero Action: take 1 damage and spend two mental resources → discard this card)." },
    { card: "The Poison (#125)", product: "Galaxy's Most Wanted Expansion", src: "RR p.66", change: "“Any player can do this” is now rules text, not reminder text (Hero Action: spend 3 resources of different types → discard this card)." },
    // Star-Lord Hero Pack
    { card: "Cosmo (#20)", product: "Star-Lord Hero Pack", src: "RR p.67", change: "Discards the top card of <b>a player deck or the encounter deck</b> (was “a deck”); reminder text removed." },
    // Mad Titan's Shadow Expansion
    { card: "Rulebook p.10 — Two Main Schemes, paragraph 1", product: "Mad Titan's Shadow Expansion", src: "RR p.67", change: "Adds: when a minion schemes, its threat goes on the main scheme with the Focused Defense attachment." },
    { card: "Sanctuary (#116)", product: "Mad Titan's Shadow Expansion", src: "RR p.67", change: "Thanos can't take damage <b>from player cards</b> (words added)." },
    { card: "Infinity Gauntlet (#129)", product: "Mad Titan's Shadow Expansion", src: "RR p.67", change: "Adds “Attach to the villain.” Its Forced Response triggers after the attached villain activates <b>against you</b>." },
    // Nebula Hero Pack
    { card: "Eros (#11)", product: "Nebula Hero Pack", src: "RR p.67", change: "Reworded for the updated “for each” rules: for each mental resource used to pay for him, choose a minion and confuse it." },
    { card: "Cosmo (#20)", product: "Nebula Hero Pack", src: "RR p.67", change: "Discards the top card of <b>a player deck or the encounter deck</b> (was “a deck”); reminder text removed." },
    { card: "Old Rivals (#31)", product: "Nebula Hero Pack", src: "RR p.67", change: "Reminder text became rules text: if the Gamora hero or ally is in play, she attacks you (resolving her ATK without exhausting her); if no attack was made this way, it gains surge." },
    // War Machine Hero Pack
    { card: "James Rhodes (#1B)", product: "War Machine Hero Pack", src: "RR p.67", change: "His Action gains “(Limit once per phase.)”." },
    // Valkyrie Hero Pack
    { card: "Aragorn (#7)", product: "Valkyrie Hero Pack", src: "RR p.67", change: "“<b>You</b> get +4 hit points and gain the Aerial trait” (was “Valkyrie”)." },
    { card: "Shieldmaiden (#11)", product: "Valkyrie Hero Pack", src: "RR p.67", change: "Gains the Defense trait, and its Hero Interrupt gains the <b>(defense)</b> label." },
    { card: "Beguiled (#31)", product: "Valkyrie Hero Pack", src: "RR p.67", change: "Has the Condition trait; attaches to the highest-cost ally without Beguiled, and that ally <b>engages its controller</b>; otherwise it gains surge." },
    // Vision Hero Pack
    { card: "Machine Man (#22)", product: "Vision Hero Pack", src: "RR p.67", change: "The +1 THW and +1 ATK per resource spent apply <b>for this use</b> only." },
    // Sinister Motives Expansion
    { card: "Rulebook p.17 — The Glider Counter, paragraph 4", product: "Sinister Motives Expansion", src: "RR p.67", change: "Adds: when a main scheme is completed, flip it to its environment side." },
    { card: "Rulebook p.22 — Reputation Track, left column, paragraph 2", product: "Sinister Motives Expansion", src: "RR p.67", change: "The extra mulligan happens during “the Resolve Mulligans step” of setup (was “step 13”), matching the updated setup." },
    { card: "Worried Father (#25)", product: "Sinister Motives Expansion", src: "RR p.67", change: "Attaches George Stacy facedown <b>to itself</b>, instead of setting him aside and attaching itself to him." },
    { card: "Venom I and II (#73–74)", product: "Sinister Motives Expansion", src: "RR p.67", change: "Vengeance triggers after <b>you or an ally you control</b> attacks and damages Venom (was “you… with a card you control”)." },
    { card: "Venom III (#75)", product: "Sinister Motives Expansion", src: "RR p.67", change: "Retribution triggers after <b>you or an ally you control</b> attacks and damages Venom (was “you… with a card you control”): place 1 facedown boost card on your identity, or 2 if it's the first attack this turn." },
    { card: "Manipulated Mind (#171)", product: "Sinister Motives Expansion", src: "RR p.68", change: "Adds “Attached ally engages its controller.”" },
    // Nova Hero Pack
    { card: "Ms. Marvel (#2)", product: "Nova Hero Pack", src: "RR p.68", change: "Returns the event to your hand <b>from your discard pile</b> (words added)." },
    // Ironheart Hero Pack
    { card: "“Go for Champions!” (#25)", product: "Ironheart Hero Pack", src: "RR p.68", change: "Its cost is now removing it from the game (→ each Champion character can't take damage until the end of the round)." },
    // SP//dr Hero Pack
    { card: "SP//dr Suit (#1B)", product: "SP//dr Hero Pack", src: "RR p.68", change: "When flipping back to Peni Parker, counters and attached cards move from this card <b>to her</b> (not the reverse)." },
    { card: "M.O.R.B.I.U.S. (#27)", product: "SP//dr Hero Pack", src: "RR p.68", change: "Forced Response now keys off the <b>engaged player</b> (was “engaged hero”): after that player generates resources, deal that much damage to <b>that player's hero</b> (was “that hero”)." },
    // Mutant Genesis Expansion
    { card: "Steel Fist (#8)", product: "Mutant Genesis Expansion", src: "RR p.68", change: "Cost arrow replaced by “to”: after dealing 5 damage, you may discard a tough card from your hero to stun and confuse the enemy." },
    { card: "Armor Up (#10)", product: "Mutant Genesis Expansion", src: "RR p.68", change: "Triggers when the villain <b>would</b> activate (word added)." },
    { card: "Mutants at the Mall (#88A)", product: "Mutant Genesis Expansion", src: "RR p.68", change: "Discards any other <b>ally</b> version of Jubilee (word added)." },
    { card: "Asteroid M (#141B)", product: "Mutant Genesis Expansion", src: "RR p.68", change: "The 3 magnet counters are removed <b>before</b> discarding to a Magnetic card and revealing it." },
    { card: "Factory Online (#142B)", product: "Mutant Genesis Expansion", src: "RR p.68", change: "The 3 magnet counters are removed <b>before</b> discarding to a Magnetic card and revealing it." },
    { card: "The Rule of Magnus (#143B)", product: "Mutant Genesis Expansion", src: "RR p.68", change: "The 3 magnet counters are removed <b>before</b> discarding to a Magnetic card and revealing it." },
    // Wolverine Hero Pack
    { card: "Logan (#1A)", product: "Wolverine Hero Pack", src: "RR p.68", change: "Setup ability: put Wolverine's Claws into play." },
    { card: "Berserker Barrage (#8)", product: "Wolverine Hero Pack", src: "RR p.68", change: "Cost arrow replaced by “to”: if the attack defeats an enemy, you may take 2 damage to repeat the ability." },
    // Storm Hero Pack
    { card: "Claustrophobia (#30)", product: "Storm Hero Pack", src: "RR p.68", change: "You can't change <b>to hero form</b> (was “change forms”)." },
    { card: "Possessed (#38)", product: "Storm Hero Pack", src: "RR p.68", change: "Adds “Attached ally engages its controller.”" },
    // Gambit Hero Pack
    { card: "Psionic Shield (#34)", product: "Gambit Hero Pack", src: "RR p.68", change: "“And put it back into play” removed — when the attached minion would leave play, heal all its damage instead, then discard this attachment." },
    // Rogue Hero Pack
    { card: "Anna Marie (#1A)", product: "Rogue Hero Pack", src: "RR p.69", change: "Her Setup ability and Withdrawn now <b>find</b> Touched and set it aside." },
    { card: "Rogue (#1B)", product: "Rogue Hero Pack", src: "RR p.69", change: "Skin Contact: “<b>Find</b> Touched and attach it…” (was “Attach Touched…”)." },
    { card: "Energy Transfer (#7)", product: "Rogue Hero Pack", src: "RR p.69", change: "“<b>Find</b> Touched and attach it…” (was “Attach Touched…”)." },
    { card: "Mystique's Manipulations (#26)", product: "Rogue Hero Pack", src: "RR p.69", change: "The <b>defeating player</b> searches for the Misled treachery and shuffles it into their deck." },
    { card: "Bonebreaker (#31)", product: "Rogue Hero Pack", src: "RR p.69", change: "Now a <b>Forced Response</b> (was Forced Interrupt): after he engages you, take 1 indirect damage per Reaver minion engaged with you." },
    // MojoMania Scenario Pack
    { card: "The Search for Spiral (#16)", product: "MojoMania Scenario Pack", src: "RR p.69", change: "Cost arrow added: take 2 damage → remove 3 threat from here." },
    { card: "Fetch Quest (#45)", product: "MojoMania Scenario Pack", src: "RR p.69", change: "Cards are played “ignoring its resource cost” (was “for free”)." },
    // NeXt Evolution Expansion
    { card: "Inhibitor Collar (#92)", product: "NeXt Evolution Expansion", src: "RR p.69", change: "“Any player can do this” is now rules text, not reminder text." },
    // X-23 Hero Pack
    { card: "Front Line Specialist (#36)", product: "X-23 Hero Pack", src: "RR p.69", change: "Your <b>identity</b> gets +4 hit points (was “hero”)." },
    // Deadpool Hero Pack
    { card: "'Pool-ized (#41)", product: "Deadpool Hero Pack", src: "RR p.69", change: "Adds “Attached ally engages its controller.”" },
    // Age of Apocalypse Expansion
    { card: "Suit Up (#17)", product: "Age of Apocalypse Expansion", src: "RR p.69", change: "The upgrade only needs to be one that can attach to <b>an</b> ally (was “that ally”)." },
    { card: "Mission Team (#171A)", product: "Age of Apocalypse Expansion", src: "RR p.69", change: "First bullet: the cost reduction for the next ally played to the mission applies <b>this phase</b>." },
    // Nightcrawler Hero Pack
    { card: "Rogue (#12)", product: "Nightcrawler Hero Pack", src: "RR p.69", change: "Adds the other character's <b>base</b> (was “printed”) THW and ATK to hers." },
    { card: "Tweedledope (#37)", product: "Nightcrawler Hero Pack", src: "RR p.69", change: "The star icon is removed from its boost field." },
    // Magneto Hero Pack
    { card: "Magnetic Missile (#10)", product: "Magneto Hero Pack", src: "RR p.69", change: "Cost arrow changed to “Then”: discard a minion that has the Wrapped in Metal attachment, then deal 5 damage to an enemy and stun it." },
    { card: "Deft Focus (#23)", product: "Magneto Hero Pack", src: "RR p.69", change: "Classification is <b>Basic</b>, not Protection." },
    { card: "Exodus (#28)", product: "Magneto Hero Pack", src: "RR p.69", change: "Discards cards equal to his total ATK <b>for that attack</b> (words added)." },
    // Agents of S.H.I.E.L.D. Expansion
    { card: "Radiation Exposure (#171A)", product: "Agents of S.H.I.E.L.D. Expansion", src: "RR p.69", change: "Its SCH modifier should be a <b>THW</b> modifier." },
    { card: "MACH-IV (#156)", product: "Agents of S.H.I.E.L.D. Expansion", src: "RR p.69", change: "Characters without the Aerial trait can't <b>defend</b> against its attacks (was “make basic defenses”)." },
    // Silk Hero Pack
    { card: "Eidetic Memory (#8)", product: "Silk Hero Pack", src: "RR p.70", change: "Refers to “<b>your identity</b>” instead of “Silk”." },
    // Winter Soldier Hero Pack
    { card: "S.H.I.E.L.D. Deputy (#33)", product: "Winter Soldier Hero Pack", src: "RR p.70", change: "Adds “Max 1 per character.”" },
    // Trickster Takeover Scenario Pack
    { card: "Rulebook p.19 — Swapping Avatars of Loki, paragraph 1", product: "Trickster Takeover Scenario Pack", src: "RR p.70", change: "The swapping rules also cover swapping <b>Fading Figment</b> with a random set-aside Avatar of Loki villain." },
    // Civil War Expansion
    { card: "Yellow Jacket (#19)", product: "Civil War Expansion", src: "RR p.70", change: "Title and text read “<b>Yellowjacket</b>”." },
    { card: "Yellow Jacket (#73)", product: "Civil War Expansion", src: "RR p.70", change: "Title reads “<b>Yellowjacket</b>”." },
    { card: "Energy Channel (#98)", product: "Civil War Expansion", src: "RR p.70", change: "“→” changed to “and”: with 4+ energy counters, remove them all and Captain Marvel attacks that character (the attack gains overkill)." },
    // Synthezoid Smackdown Scenario Pack
    { card: "Moon Knight (#65)", product: "Synthezoid Smackdown Scenario Pack", src: "RR p.70", change: "Adds “(Limit once per phase.)”." },
    { card: "Phased Out (#76)", product: "Synthezoid Smackdown Scenario Pack", src: "RR p.70", change: "Targets an attachment on the enemy leader with “Hero Action” (was “Hero Interrupt”) or “Hero Response” text." },
    // Wonder Man Hero Pack
    { card: "Ionic Physiology (#2)", product: "Wonder Man Hero Pack", src: "RR p.70", change: "Cost arrow changed to “Then”: tuck the event under this card, then heal 1 damage from your identity." },
  ];

  /* ------------------------------------------------------------------ read-aloud teach (~5 minutes) */
  MC.teach = {
    intro: (c) => {
      const n = players(c);
      const team = n === 1 ? "you're playing <b>solo</b> — one hero" : "there are <b>" + word(n) + " of you</b> — " + word(n) + " heroes on one team";
      const foe = scnName(c) ? "<b>" + scnName(c) + "</b>" : "a villain";
      let t = "Welcome to <b>Marvel Champions</b>! Today " + team + ", taking on " + foe + " in <b>" + modeName(c) + " mode</b>.";
      const extras = [];
      const h = heroic(c);
      if (h) extras.push("<b>heroic level " + h + "</b>");
      if (c && c.skirmish) extras.push("<b>skirmish mode</b>");
      if (c && c.campaign) extras.push("<b>campaign mode</b>");
      if (c && c.pool) extras.push("a deck using the <b>'Pool</b> aspect");
      if (extras.length) t += " We're also playing with " + joinAnd(extras) + ".";
      t += " Here are the essentials; everything else we'll learn as it comes up.";
      return t;
    },
    sections: [
      {
        h: "The hook: how you win and lose",
        when: () => true,
        body: (c) => {
          const solo = players(c) === 1;
          return (
            (solo
              ? "Marvel Champions is <b>cooperative</b> — today it's you against the game, which plays the villain."
              : "Marvel Champions is <b>cooperative</b>: you win or lose together, and the game plays the villain.") +
            " The villain is a small deck of <b>stages</b> — knock the current stage to zero hit points and the next one flips in. Defeat the <b>final stage</b> and " +
            (solo ? "you win." : "you all win.") +
            "<br><br>The villain wins if its <b>main scheme</b> collects enough threat to complete its final stage, or if " +
            (solo ? "<b>your hero is knocked out</b>" : "<b>every hero is knocked out</b>") +
            ". So you're racing two clocks: the villain's hit points, which you push down, and the threat, which the villain pushes up."
          );
        },
      },
      {
        h: "The shape of a round",
        when: () => true,
        body: (c) => {
          const solo = players(c) === 1;
          return (
            "Every round has two halves. In the <b>player phase</b>, " +
            (solo
              ? "you take your turn; then you discard down if you need to, <b>draw back up to your hand size</b>, and <b>ready</b> every exhausted card."
              : "each of you takes a full turn — first player first, then clockwise; then everyone discards down if they need to, <b>draws back up to hand size</b>, and <b>readies</b> every exhausted card.") +
            "<br><br>Then comes the <b>villain phase</b>: threat goes on the main scheme; the villain activates against " +
            (solo
              ? "you, and so do the minions engaged with you; you're dealt an encounter card and reveal it"
              : "each of you in turn, and so do the minions engaged with you; each of you is dealt an encounter card and reveals it") +
            "; and finally the first player token passes " +
            (solo ? "on (to you again)." : "one seat clockwise.")
          );
        },
      },
      {
        h: "Your turn — and why it matters",
        when: () => true,
        body: () =>
          "On your turn, do any of these in any order, as often as you can pay for them:" +
          ul([
            "<b>Flip</b> between hero and alter-ego — once per turn.",
            "<b>Play cards</b>: allies, upgrades and supports stay in play; events happen and are discarded.",
            "<b>Exhaust your identity</b> for a basic power: a hero <b>attacks</b> an enemy or <b>thwarts</b> — removes threat from — a scheme; an alter-ego <b>recovers</b> hit points.",
            "<b>Exhaust your allies</b> to attack or thwart; afterwards each takes 1 consequential damage per damage icon under the stat it used (some have none).",
            "Use <b>Action</b> abilities on your cards.",
          ]) +
          "Why? Whatever you leave standing — threat on the schemes, minions engaged with you — acts against you in the villain phase. Your turn is your chance to decide what the villain gets to do.",
      },
      {
        h: "Hero or alter-ego?",
        when: () => true,
        body: (c) =>
          "Your identity card has two sides, and " +
          (players(c) === 1 ? "you <b>start as your alter-ego</b>" : "everyone <b>starts as their alter-ego</b>") +
          ". Your form decides what the villain does to you: against a <b>hero</b>, the villain and the minions engaged with you <b>attack</b>; against an <b>alter-ego</b>, they <b>scheme</b> and pile threat onto the main scheme. " +
          "Hero form is how you fight; alter-ego form is how you recover and build up. Flipping keeps your damage and your cards. Picking the right form each round is the heart of the game.",
      },
      {
        h: "Paying for cards",
        when: () => true,
        body: () =>
          "Cards cost resources, and you usually pay by <b>discarding other cards from your hand</b> (some cards also have “Resource” abilities that generate resources): each icon in a card's bottom-left corner is one resource — energy, mental, physical or wild, and wild counts as any type. " +
          "Most cards take any mix; some abilities demand a specific type. Extra resources are simply lost. So every card is either something to play or fuel for something else — choosing which is the constant puzzle.",
      },
      {
        h: "Threat and schemes",
        when: () => true,
        body: () =>
          "Threat is the villain's clock. The main scheme gains threat at the start of every villain phase and whenever an enemy schemes; at its target number it advances, and completing the <b>last stage</b> loses the game. " +
          "<b>Side schemes</b> come out of the encounter deck with threat of their own, and some carry icons: <b>acceleration</b> adds threat every round, <b>crisis</b> stops you thwarting the main scheme, <b>hazard</b> deals an extra encounter card. Thwart a side scheme down to zero to get rid of it.",
      },
      {
        h: "Encounter cards and boost",
        when: () => true,
        body: () =>
          "The encounter deck is the villain's bag of tricks. <b>Minions</b> engage whoever revealed them and activate against that player every round; <b>treacheries</b> hit once and are discarded; <b>side schemes</b> and <b>attachments</b> stick around; <b>obligations</b> go to the hero they belong to." +
          "<br><br>Whenever the villain attacks or schemes, it gets a facedown <b>boost card</b>: flip it, and each boost icon adds 1 to that attack or scheme — a star means read that card's Boost ability too. " +
          "When a hero is attacked, you may <b>defend</b>: exhaust a hero to cut the damage by its DEF, or exhaust an ally to take the whole hit instead.",
      },
      {
        h: "Expert mode",
        when: (c) => modeName(c) === "expert",
        body: (c) =>
          "We're playing <b>expert mode</b>: " +
          (c && c.skirmish
            ? "the <b>Expert encounter set</b> joins the standard set in the encounter deck — and with skirmish we still face only the one villain version we chose."
            : "the villain uses this scenario's <b>expert stages</b>, and the <b>Expert encounter set</b> joins the standard set in the encounter deck.") +
          " Same rules — a greater challenge.",
      },
      {
        h: "Heroic mode",
        when: (c) => heroic(c) > 0,
        body: (c) => {
          const h = heroic(c);
          const solo = players(c) === 1;
          return (
            "Heroic level <b>" + h + "</b>: every villain phase, when encounter cards are dealt, " +
            (solo ? "you're dealt <b>" : "each of you is dealt <b>") + h + " extra encounter " + plural(h, "card", "cards") + "</b> — " +
            word(h + 1) + (solo ? " instead of one" : " each instead of one") + ", plus any hazard cards. It's the game's difficulty dial."
          );
        },
      },
      {
        h: "Skirmish mode",
        when: (c) => !!(c && c.skirmish),
        body: () =>
          "In <b>skirmish mode</b> the villain deck is just <b>one version of the villain</b>, chosen before setup — the other stages were removed from the game. Defeat that single stage and you win. It's the shorter game.",
      },
      {
        h: "Campaign mode",
        when: (c) => !!(c && c.campaign),
        body: () =>
          "This game is one chapter of a <b>campaign</b>: its rulebook adds setup for this scenario, and the <b>campaign log</b> tracks what carries over between games. Cards removed from the campaign stay gone, even on a replay; the other modes can change from scenario to scenario.",
      },
      {
        h: "The 'Pool aspect",
        when: (c) => !!(c && c.pool),
        body: (c) =>
          (players(c) === 1 ? "You chose" : "At least one of you chose") +
          " the <b>'Pool</b> aspect, so <b>Crisis of Infinite Deadpools</b> is included in the encounter deck. It's only added when someone picks 'Pool as their aspect — not when an ability just lets a deck borrow a few 'Pool cards.",
      },
      {
        h: "Playing as a team",
        when: (c) => players(c) > 1,
        body: (c) => {
          const n = players(c);
          return (
            "With <b>" + word(n) + " heroes</b>:" +
            ul([
              "The villain activates once against <b>each</b> of you, and each of you gets your own encounter card.",
              "The <b>per-player icon</b> multiplies a number by " + n + " — that's why the villain has " + n + "× hit points.",
              "The <b>first player</b> goes first, decides the order when effects happen at the same time, and makes any choice an encounter card leaves open; the token moves clockwise every round.",
              "Talk freely and <b>defend each other</b>: anyone can exhaust a hero or ally to block an attack aimed at someone else.",
              "A hero knocked to zero is <b>eliminated</b>: their minions move to the next player, and they still win or lose with the team.",
            ])
          );
        },
      },
      {
        h: "This scenario's special rules",
        when: (c) => !!scn(c) && arr(scn(c).specialRules).length > 0,
        body: (c) => {
          const s = scn(c);
          const rules = s ? arr(s.specialRules) : [];
          return "<b>" + (scnName(c) || "This scenario") + "</b> adds its own rules:" + ul(rules);
        },
      },
      {
        h: "Don't worry about these until they come up",
        when: () => true,
        body: () =>
          ul([
            "<b>Keywords</b> like guard, patrol, surge, quickstrike and retaliate — the cards and the Keywords list explain them.",
            "<b>Status cards</b>: stunned cancels the next attack, confused the next thwart or scheme, tough the next damage.",
            "Your <b>obligation</b> is shuffled into the encounter deck and turns up like any other encounter card; your <b>nemesis</b> only appears when an encounter card calls for it.",
            "<b>Running out of cards</b> — reshuffle and keep going: your own deck costs you an encounter card, the encounter deck adds an acceleration token.",
            "The <b>ally limit</b> of three, and fine timing like interrupts and responses.",
            "Truly stuck? The <b>Grim Rule</b>: choose the outcome that's worst for the heroes and play on.",
          ]),
      },
    ],
  };
})();
