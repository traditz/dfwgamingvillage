/* =============================================================================
   Abyss — Setup & Reference Utility
   Data model: base game + Kraken, Leviathan and the De Profundis (Outcasts)
   booster, with a filtered setup sequence and reference.

   Sources: the Abyss base rulebook (US edition), the Kraken and Leviathan
   expansion rulebooks, and the De Profundis rules leaflet (2024).
   ============================================================================= */

const AB = {};

/* ---- Sets ------------------------------------------------------------------ */
AB.expansions = [
  { id: "base", name: "Abyss", short: "Base Game", year: 2014, kind: "base",
    blurb: "The struggle for the throne of the deep: explore the depths, court the five Allied Races, recruit Lords, and control Locations. Most Influence Points is crowned monarch. 2–4 players." },
  { id: "kraken", name: "Abyss: Kraken", short: "Kraken", year: 2015, kind: "exp",
    blurb: "Dirty money floods the kingdom: Nebulis black pearls, the wild kraken Ally Race, the Smugglers guild, Sentinel reservations, and push-your-luck Loot in the Sanctuaries." },
  { id: "leviathan", name: "Abyss: Leviathan", short: "Leviathan", year: 2021, kind: "exp",
    blurb: "The Border is under siege: replaces the Threat track with dice-driven Leviathan battles, adds martial law, Wound tokens, the Scourge of the Abyss — and a fifth player. 2–5 players." },
  { id: "outcasts", name: "Abyss: De Profundis (Outcasts)", short: "Outcasts", year: 2024, kind: "exp",
    blurb: "Ten banished part-Abyssal Lords return to reclaim what was theirs: a second Court deck of Outcasts who are recruited like Lords but let you seize Locations from your rivals." }
];

AB.expMeta = {
  base:      { name: "Base Game", cls: "e-base" },
  kraken:    { name: "Kraken",    cls: "e-kraken" },
  leviathan: { name: "Leviathan", cls: "e-lev" },
  outcasts:  { name: "Outcasts",  cls: "e-out" }
};

/* ---- THE SETUP SEQUENCE ------------------------------------------------------ */
AB.phases = [
  { title: "Build the Depths",
    steps: [
      { exp: "base",
        t: "Place the game board",
        d: "Place the game board in the middle of the table.",
        src: "Base rulebook p.2, step 1",
        when: () => true },
      { exp: (c) => c.has("leviathan") ? "leviathan" : (c.has("kraken") ? "kraken" : "base"),
        t: "Prepare the Exploration deck",
        d: (c) => {
          const bits = [];
          if (c.has("leviathan")) bits.push("First, deal a <b>value-1 crab Ally from the base game to each player</b> — a crab always lets you fight a Leviathan.");
          let d = "Shuffle the Exploration cards (65 Allies of five Races + 6 Monsters)";
          const adds = [];
          if (c.has("kraken")) adds.push("the kraken Allies");
          if (c.has("leviathan")) adds.push("Leviathan's new Allies");
          if (adds.length) d += " together with " + adds.join(" and ");
          d += ", and form a facedown deck on the Exploration Track.";
          bits.push(d);
          return bits.join(" ");
        },
        src: (c) => {
          const s = ["Base p.2, step 2"];
          if (c.has("kraken")) s.push("Kraken p.2");
          if (c.has("leviathan")) s.push("Leviathan p.2");
          return s.join(" · ");
        },
        when: () => true },
      { exp: (c) => c.has("outcasts") ? "outcasts" : (c.has("kraken") || c.has("leviathan") ? (c.has("kraken") ? "kraken" : "leviathan") : "base"),
        t: "Prepare the Lords and fill the Court",
        d: (c) => {
          const bits = [];
          let d = "Shuffle the 35 Lord cards";
          const adds = [];
          if (c.has("kraken")) adds.push("Kraken's 18 new Lords (including the Smugglers guild)");
          if (c.has("leviathan")) adds.push("Leviathan's 10 conscripts");
          if (adds.length) d += " together with " + adds.join(" and ");
          d += " and form a facedown deck on the Lords space.";
          if (c.has("leviathan")) d += " <b>Remove the Tamer</b> from the base Lords first — she returns to the box.";
          bits.push(d);
          if (c.has("outcasts")) {
            bits.push("Shuffle the <b>Outcast cards</b> into a facedown deck to the <b>left of the Lord deck</b>. Turn over the first Outcast into the <b>left-most space of the Court</b>, then fill the rest of the Court with <b>5 Lords</b>. (Outcasts are NOT Lords — effects naming “Lord” ignore them.)");
          } else {
            bits.push("Turn over the top <b>six Lords</b> into the Court.");
          }
          return bits.join("<br>");
        },
        src: (c) => {
          const s = ["Base p.2, step 3"];
          if (c.has("kraken")) s.push("Kraken p.2, p.6");
          if (c.has("leviathan")) s.push("Leviathan p.2");
          if (c.has("outcasts")) s.push("De Profundis (Setup)");
          return s.join(" · ");
        },
        when: () => true },
      { exp: (c) => c.has("kraken") ? "kraken" : "base",
        t: "Prepare the Locations",
        d: (c) => "Shuffle the 20 Location tiles" + (c.has("kraken") ? " together with Kraken's 6 new Locations (including the four Sanctuaries)" : "") + " into a facedown stack beside the board, then turn the top tile faceup." + (c.has("kraken") ? " Shuffle the <b>Loot cards</b> into a facedown deck next to the Location stack." : ""),
        src: (c) => "Base p.3, step 4" + (c.has("kraken") ? " · Kraken p.2, p.6" : ""),
        when: () => true },
      { exp: (c) => c.has("leviathan") ? "leviathan" : "base",
        t: "Prepare the Monster tokens" + "",
        d: (c) => "Shuffle the 20 Monster tokens (2×4 IP, 9×3 IP, 9×2 IP) and place them facedown by the board." + (c.has("leviathan") ? " Make a <b>second, separate deck</b> from Leviathan's new Monster tokens next to the first — <b>never mix the two decks</b>. When you earn Monster tokens you choose freely from either (or both) decks." : ""),
        src: (c) => "Base p.3, step 5" + (c.has("leviathan") ? " · Leviathan p.2" : ""),
        when: () => true },
      { exp: "base",
        t: "Place the Threat token",
        d: "Place the Threat token on the first space of the Threat Track.",
        src: "Base p.3, step 6",
        when: (c) => !c.has("leviathan") },
      { exp: "leviathan",
        t: "Assemble the Border",
        d: "The Threat track is <b>not used</b> — leave it in the base box. Assemble the <b>Border board</b> and place it to the right of the main board. Shuffle the <b>Leviathan cards</b> into a facedown deck near the Border. <b>Roll both dice</b>, reveal the first Leviathan, and place it on the Border zone matching the dice total, with a <b>Health point token on its top space</b>. Set the dice, Wound tokens, remaining Health tokens, and the <b>Scourge of the Abyss</b> figure nearby.",
        src: "Leviathan p.2",
        when: (c) => c.has("leviathan") },
      { exp: "base",
        t: "Keys, Pearls and the Treasury",
        d: (c) => {
          const bits = ["Pile the <b>ten Key tokens</b> near the board. Each player takes <b>one Pearl</b> in a plastic cup; the rest form the <b>Treasury</b> beside the board."];
          if (c.has("kraken")) bits.push("Pour the <b>Nebulis</b> (black pearls) into their cup next to the Treasury and stand the <b>Kraken figure</b> beside it. Place the <b>3 Sentinel tokens</b> next to the Lord deck.");
          if (c.has("leviathan") && c.p === 5) bits.push("The fifth player takes the cup from the Leviathan box.");
          return bits.join(" ");
        },
        src: (c) => {
          const s = ["Base p.3, steps 7–8"];
          if (c.has("kraken")) s.push("Kraken p.2");
          if (c.has("leviathan") && c.p === 5) s.push("Leviathan p.2");
          return s.join(" · ");
        },
        when: () => true },
      { exp: "base",
        t: "Choose the starting player",
        d: "Randomly determine the starting player. Play proceeds clockwise.",
        src: "Base p.3, step 9",
        when: () => true }
    ] }
];

/* ---- REFERENCE SECTIONS ------------------------------------------------------ */
AB.reference = [
  { id: "turn", title: "Turn Structure",
    when: () => true,
    html: (c) => `
<ol>
<li><b>Plot at Court</b> (optional) — pay 1 Pearl per Lord${c.has("outcasts") ? " <b>or Outcast</b> (any combination)" : ""} to turn new cards into empty Court spaces (furthest from the deck), as often as you can pay${c.has("kraken") ? ". Nebulis can <b>never</b> be used to plot" : ""}.</li>
<li><b>Take one action</b> (mandatory) — exactly one of: <b>Explore the Depths</b>, <b>Request Support from the Council</b>, or <b>Recruit a Lord${c.has("outcasts") ? " / Outcast" : ""}</b>.</li>
<li><b>Control a Location</b> (mandatory when triggered) — the moment you hold <b>three Keys</b>, you must take control of a Location.</li>
</ol>
${c.has("leviathan") ? "<p><b>Martial law:</b> at the end of your turn, you may keep at most <b>12 Allies</b> in hand — pay 1 Pearl per extra Ally or discard it" + (c.has("kraken") ? " (kraken Allies can never be discarded this way)" : "") + ".</p>" : ""}
<p class="src-line">Base p.4, 9${c.has("leviathan") ? " · Leviathan p.3" : ""}${c.has("outcasts") ? " · De Profundis" : ""}</p>` },

  { id: "explore", title: "Explore the Depths",
    when: () => true,
    html: (c) => `
<ul>
<li>Reveal Exploration cards one at a time onto the Track, left to right. Each revealed <b>Ally</b> must first be offered to your opponents in clockwise order: the 1st Ally bought this turn costs <b>1 Pearl paid to you</b>, the 2nd costs 2, the 3rd costs 3 — and <b>each opponent may buy only one Ally per turn</b>.</li>
<li>If nobody buys, either <b>take the Ally yourself for free (ending your turn)</b> or leave it and reveal the next card. A card revealed on the <b>last space</b> must be taken (Ally: you also gain 1 bonus Pearl${c.has("leviathan") ? "" : "; Monster: you must fight it, gaining 1 bonus Pearl on top of the reward"}).</li>
${!c.has("leviathan") ? `<li>If you reveal a <b>Monster</b>: fight it (automatic victory — take the reward shown for the Threat token's space, return the token to the first space, end your turn) or keep exploring (move the Threat token up one space). Threat rewards climb from 1 Pearl / 1 Monster token up to 2 Keys on the sixth space; Monster tokens are kept facedown and are worth 2–4 IP.</li>` : `<li>If you reveal a <b>Monster</b> (Leviathan rules): choose to <b>fight one Leviathan at the Border</b>, or <b>keep exploring</b> — which forces a new Leviathan onto the Border. Roll both dice for its zone: if the zone is free, place it (health token on top), discard the Monster card, continue. If the zone is occupied, the old Leviathan <b>attacks you first</b> (unavoidable): suffer its printed penalty — Wound tokens (−1 IP each at game end), discard 3 Pearls, discard 3 Allies, or discard one free Lord — then replace it with the newcomer and continue exploring.</li>`}
<li><b>End of exploration:</b> remaining Allies on the Track go facedown onto their Races' <b>Council</b> stacks${c.has("kraken") ? " (the active player chooses which Council stack each leftover kraken joins)" : ""}; Monsters go to the discard. An exhausted Exploration deck is rebuilt by reshuffling the discard.</li>
</ul>
<p class="src-line">Base p.4–6${c.has("kraken") ? " · Kraken p.3" : ""}${c.has("leviathan") ? " · Leviathan p.4" : ""}</p>` },

  { id: "fight", title: "Fighting Leviathans",
    when: (c) => c.has("leviathan"),
    html: () => `
<ul>
<li><b>Attack:</b> discard ONE Ally of a Race shown on the Leviathan (a <b>crab always works</b>) and roll ONE die. Attack power = die + Ally value. No Ally of a listed Race? You cannot fight — you must keep exploring and add a Leviathan.</li>
<li>New Allies add options when used to fight: spend Pearls for +1 each, or roll <b>both dice and keep the higher</b>.</li>
<li>Power below the Resistance: no effect, gain 1 consolation Pearl. Power ≥ the Resistance: the Leviathan loses 1 Health — or several, if your power meets the <b>sum of consecutive Resistance levels</b>. Each Health lost pays out the printed Monster tokens, chosen freely from either deck (or a mix): base-game tokens are worth 2–4 IP, while the expansion's tokens grant 2–3 Pearls, a Key, or a Council stack — after looking at a new token you may resolve it immediately or hold it face down and reveal it at the start of a later turn, then discard it.</li>
<li>You may keep attacking the <b>same</b> Leviathan (one Leviathan per turn) by discarding a fresh Ally each time. Killing it: keep its card faceup in front of you; the kill <b>ends your turn</b>. The <b>Scourge of the Abyss</b> figure sits with whoever has the most kills (ties take it from the holder) and is worth <b>+5 IP</b> at game end.</li>
<li>The Border is never empty: whoever slays the last Leviathan immediately adds a new one (no attack possible from this placement).</li>
</ul>
<p class="src-line">Leviathan p.5–6</p>` },

  { id: "recruit", title: "The Council & Recruiting",
    when: () => true,
    html: (c) => `
<ul>
<li><b>Request support from the Council:</b> take one entire Council stack — sight unseen — into your hand.</li>
<li><b>Recruit:</b> play Allies whose Races and total value meet the Lord's cost — the exact number of different Races shown (the large bubble's Race is mandatory), multiple Allies of a Race allowed, excess value lost. Short on value? Pay <b>1 Pearl per missing point</b> (still at least one Ally of each required Race)${c.has("kraken") ? ", and at most <b>one Nebulis</b>, only once all your Pearls are spent" : ""}.</li>
<li><b>Affiliate</b> the lowest-valued Ally you used (your choice on ties) — it stays faceup in front of you and scores at game end; the rest go to the discard.${c.has("kraken") ? " <b>Kraken Allies</b> are wild (choose their Race as you play them) but are discarded before affiliation — recruit with only kraken and you affiliate nothing — and each one used or still in hand at game end pays you its printed <b>Nebulis</b>." : ""}</li>
<li><b>Refill the Court</b> after recruiting: slide Lords toward the deck; with three or more Lords left the gap stays open, with <b>two or fewer you gain 2 Pearls</b> and refill the Court completely${c.has("outcasts") ? " — adding <b>1 Outcast first</b>, then Lords (skip Outcasts once their deck is empty)" : ""}.</li>
<li>Lord Powers: an arrow = once, on recruitment; no arrow = semi-permanent, until that Lord is slid under a Location (its owner picks when during their turn it applies).</li>
${c.has("outcasts") ? "<li><b>Outcasts</b> recruit exactly like Lords (some grant a Key on recruitment). Recruiting your <b>2nd Outcast</b> forces a <b>reconquest</b>: take any opponent's Location (never one already held by 2 Outcasts; if none qualifies, the top of the stack) and slide both Outcasts under it. The victim immediately replaces their loss from the top of the stack — Lords under the lost Location slide under the new one. Reconquering a Sanctuary grants a Loot search; the victim discards the Loot they'd gained from it.</li>" : ""}
</ul>
<p class="src-line">Base p.6–8${c.has("kraken") ? " · Kraken p.3–5" : ""}${c.has("outcasts") ? " · De Profundis" : ""}</p>` },

  { id: "locations", title: "Keys & Locations",
    when: () => true,
    html: (c) => `
<ul>
<li>Keys come from <b>fighting Monsters</b> (tokens — discarded once used) and <b>Lord cards with a Key symbol</b>. Your <b>third Key</b> forces you to take a Location immediately; over three, you choose which Keys to spend. Ambassadors carry 3 Keys and can claim one alone.</li>
<li>Choose the faceup Location — or draw <b>1 to 4</b> from the stack, keep one, and leave the rest faceup for everyone.</li>
<li>Lords whose Keys you used slide <b>under</b> the Location: their Powers are covered for good, they are no longer “free” (immune to targeting), but their IP still scores.</li>
${c.has("kraken") ? `<li><b>Sanctuaries</b> (Cetaceous Cemetery, Abandoned Convoy, Megalodon, Battlefield): on control, draw Loot one card at a time — a 3 grants a Key, 4 grants 2 Pearls, 5 a Monster token, 6 the top Exploration card (redraw Monsters, moving the Threat token up), 7 nothing. Stop anytime and keep it all; draw a <b>duplicate value</b> and the search ends with both duplicates discarded. (Loot deck counts: three 3s, four 4s, five 5s, six 6s, seven 7s.)</li>
<li><b>Sentinels</b> (from the Watcher, Vigil or Lookout): reserve a Lord at Court${c.has("outcasts") ? " or an Outcast" : ""}, a Council stack, or a faceup Location — only you may take it. One Sentinel per area of the board; the token returns to you when you claim the reserved element.</li>` : ""}
</ul>
<p class="src-line">Base p.9${c.has("kraken") ? " · Kraken p.6–7" : ""}${c.has("outcasts") ? " · De Profundis" : ""}</p>` },

  { id: "nebulis", title: "Nebulis & Corruption",
    when: (c) => c.has("kraken"),
    html: () => `
<ul>
<li>Nebulis are dirty money: each one held at game end costs <b>−1 IP</b>, and the most corrupt player (holder of the <b>Kraken figure</b>) loses <b>5 more</b>. The figure goes to the first player to gain Nebulis and moves to anyone who ties or passes the holder (holder chooses on ties); it returns to the supply if nobody holds Nebulis.</li>
<li><b>Spending:</b> when paying Pearls (buying an Ally on someone's turn, topping up a recruitment) you may include <b>one and only one Nebulis</b> — and only if you're also spending <b>all</b> of your Pearls (or have none). Never usable to Plot at Court. The Smugglers guild bends these rules card by card.</li>
</ul>
<p class="src-line">Kraken p.4–5</p>` },

  { id: "endgame", title: "End of the Game & Scoring",
    when: () => true,
    html: (c) => `
<ul>
<li><b>Triggers:</b> a player recruits their <b>7th Lord${c.has("outcasts") ? " and/or Outcast (combined)" : ""}</b>, or the Court can't be fully refilled${c.has("leviathan") ? ", or at the end of a turn the <b>Leviathan deck</b> or <b>either Monster-token deck</b> is empty (Monsters revealed while exploring in the last turns are discarded without effect)" : ""}. The active player finishes normally, then everyone else gets one last turn.</li>
<li>Then each player <b>affiliates the lowest-value Ally of each Race</b> still in hand — the rest are discarded${c.has("kraken") ? " (kraken Allies pay out their Nebulis instead and never affiliate)" : ""}.</li>
<li><b>Score:</b> Locations + Lords${c.has("outcasts") ? " + Outcasts" : ""} + the strongest affiliated Ally of each Race + Monster tokens${c.has("leviathan") ? " − 1 IP per Wound token + 5 IP for the Scourge of the Abyss" : ""}${c.has("kraken") ? " − 1 IP per Nebulis (−5 more for the most corrupt)" : ""}.</li>
<li><b>Ties:</b> most Pearls, then highest-value Lord${c.has("outcasts") ? " or Outcast" : ""}.</li>
</ul>
<p class="src-line">Base p.10${c.has("kraken") ? " · Kraken p.4" : ""}${c.has("leviathan") ? " · Leviathan p.7" : ""}${c.has("outcasts") ? " · De Profundis" : ""}</p>` },

  { id: "clarif", title: "Card Clarifications",
    when: () => true,
    html: (c) => `
<ul>
<li><b>Commander</b>: on recruitment each opponent discards down to 6 Allies; while he stays free they re-check at the end of each of their turns.</li>
<li><b>Assassin</b>: targets are rotated 90° — only their IP still counts (Powers and Keys dead), but they stay “free” and can still be swapped out by the Traitor or Schemer (the replacement arrives unaffected).</li>
<li><b>Traitor / Schemer</b>: swap one of your other free Lords; the incoming Lord's Power can be used immediately.</li>
<li><b>Master of Magic</b>: his recruitment affiliates normally — his Power only bends <i>future</i> recruitments.</li>
<li><b>Trainer</b>: fighting on the first Threat space still pays that space's reward.</li>
${c.has("leviathan") ? "<li><b>The Rebel</b>: a chosen Leviathan loses 1 Health as if you'd hit it — rewards included; if it dies, you keep the card. <b>The Border Guard</b>: the targeted opponent must add a Leviathan to the Border, exactly as if they'd explored past a Monster.</li>" : ""}
${c.has("outcasts") ? "<li><b>The Conspirator</b> (Outcast): at the start of your turn, secretly peek at the top Lord of the deck — you may recruit them at normal cost.</li>" : ""}
</ul>
<p class="src-line">Base p.12${c.has("leviathan") ? " · Leviathan p.7" : ""}${c.has("outcasts") ? " · De Profundis" : ""}</p>` }
];
