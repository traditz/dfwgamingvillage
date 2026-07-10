/* =============================================================================
   Aquatica — Setup & Reference Utility
   Data model: base game + Cold Waters + Coral Reefs, three ways to play
   (Goals, Tribes, Solo), and optional modules.

   Sources: the Aquatica rulebook (updated January printing), the Cold Waters
   rulebook (which also carries the post-Spiel-2019 rules changes), the Coral
   Reefs rulebook, and the community-compiled Comprehensive FAQ (BGG), which
   collects designer rulings.
   ============================================================================= */

const AQ = {};

/* ---- Sets ------------------------------------------------------------------ */
AQ.expansions = [
  { id: "base", name: "Aquatica", short: "Base Game", year: 2019, kind: "base",
    blurb: "The undersea engine-builder: play Character cards, buy or conquer Locations, raise their Depths, and score Prosperity. 1–4 players." },
  { id: "cw", name: "Aquatica: Cold Waters", short: "Cold Waters", year: 2021, kind: "exp",
    blurb: "A fifth player, new Kings, Characters with Delayed Effects, Frosty Depths Locations, new Goals — and the Tribes module that replaces the Goal tracks entirely." },
  { id: "cr", name: "Aquatica: Coral Reefs", short: "Coral Reefs", year: 2023, kind: "exp",
    blurb: "A new double-sided board with Reefs and Corals, the seed and defend effects, Turn Order Mantas, the Southern Tribes, and tougher Goals." }
];

AQ.expMeta = {
  base: { name: "Base Game",   cls: "e-base" },
  cw:   { name: "Cold Waters", cls: "e-cw" },
  cr:   { name: "Coral Reefs", cls: "e-cr" },
  faq:  { name: "FAQ",         cls: "e-faq" },
  mode: { name: "Game Mode",   cls: "e-mode" }
};

/* ---- Ways to play ------------------------------------------------------------ */
AQ.modes = [
  { id: "goals", name: "Goals (classic)", requires: null,
    blurb: "Race along the four Goal tracks — the classic competitive game. 2–4 players (5 with Cold Waters).",
    src: "Base rulebook p.24" },
  { id: "tribes", name: "Tribes module", requires: "cw",
    blurb: "The Goal tracks are replaced by recruitable Tribes with ongoing or instant bonuses. Needs Cold Waters (or Coral Reefs' Southern Tribes).",
    src: "Cold Waters p.9–10" },
  { id: "solo", name: "Solo", requires: null,
    blurb: "One player against the Ichthyanders on the Goal tracks — or climb the Tribes Solo difficulty ladder.",
    src: "Base p.27 · Cold Waters p.12–14" }
];

/* ---- Modules ------------------------------------------------------------------ */
AQ.modules = [
  { id: "kings", name: "King cards", requires: "base", modes: ["goals", "tribes"],
    summary: "Each player gets a unique King card — recommended once you know the game.",
    description: "In basic mode, deal King 1 to the first player, King 2 to the second, and so on. Kings count as Character cards (they score in hand at game end, FAQ). Skip for a first game.",
    src: "Base p.7, p.26" },
  { id: "kingsdraft", name: "Draft the Kings", requires: "base", modes: ["goals", "tribes"],
    summary: "Draft Kings from a pool of players + 1, starting with the last player.",
    description: "Shuffle player-count + 1 King cards; the last player in turn order picks first and passes the rest counterclockwise. Return the leftover King to the box.",
    src: "Base p.26 (Advanced Mode)" },
  { id: "advgoals", name: "Variable Goals", requires: "base", modes: ["goals"],
    summary: "Replace the four printed Goals with random Goal tokens.",
    description: "Shuffle the double-sided Goal tokens (combine the base tokens with Cold Waters' and Coral Reefs' if owned), draw 4 at random and place them over the printed Goals — or agree on 4 as a group. Coral Reefs' Goals are deliberately harder and lean on Reefs and Corals.",
    src: "Base p.26 · Cold Waters p.11 · Coral Reefs p.13" },
  { id: "turnorder", name: "Turn Order Mantas", requires: "cr", modes: ["goals", "tribes"],
    summary: "Numbered Mantas replace the Kings and change how the game ends.",
    description: "Remove all King cards. The first player takes Turn Order Manta #1, the next #2, and so on; each behaves like a Wild Manta (but can never claim Goals or hire Tribes). End of game: in Tribes play, finish the current round and then everyone takes one more turn, keeping turns equal.",
    src: "Coral Reefs p.4" }
];

/* ---- helpers ------------------------------------------------------------------ */
AQ.help = {
  tribesAvailable: (c) => c.has("cw") || c.has("cr")
};

/* ---- THE SETUP SEQUENCE -------------------------------------------------------- */
AQ.phases = [
  { title: "The Ocean",
    steps: [
      { exp: (c) => c.has("cr") ? "cr" : "base",
        t: "Place the game board",
        d: (c) => {
          if (!c.has("cr")) return "Place the Ocean board in the centre of the table." + (c.mode === "tribes" ? " Place the <b>Tribe board on top</b> of it so that it covers the Goal tracks." : "");
          return "Use the <b>Coral Reefs double-sided board</b> (the base board stays in the box): the <b>night side</b> for Goals play, the <b>day side</b> for Tribes play. Place it in the centre of the table.";
        },
        src: (c) => c.has("cr") ? "Coral Reefs p.5" : ("Base p.6" + (c.mode === "tribes" ? " · Cold Waters p.6" : "")),
        when: () => true },
      { exp: (c) => c.has("cw") || c.has("cr") ? (c.has("cw") ? "cw" : "cr") : "base",
        t: "Build the Ocean Character deck",
        d: (c) => {
          if (c.mode === "solo") {
            return c.has("cw") || c.has("cr")
              ? "Use only the Ocean Characters marked with <b>one</b> of the two symbols (from the base game" + (c.has("cw") ? " and Cold Waters" : "") + ") — 15 different Characters. Shuffle and deal <b>6 faceup</b> into the Character row."
              : "Remove one of the two identical sets of Ocean Characters (by the symbol in the corner) — you play with a single set. Shuffle and deal <b>6 faceup</b> into the Character row.";
          }
          if (c.has("cr")) return "Form the two symbol decks (base + Coral Reefs Characters; Cold Waters' sea creatures optional), shuffle each <b>separately</b>, then stack one on top of the other — <b>no cards are removed</b>, regardless of player count. Deal <b>6 faceup</b> into the Character row.";
          if (c.has("cw")) {
            const cut = c.p >= 5 ? "shuffle both symbol decks together with no discards" : (c.p === 4 ? "discard 5 random cards from one symbol deck, then shuffle both together" : "discard 10 random cards from one symbol deck, then shuffle both together");
            return "Form two decks by corner symbol (base + Cold Waters = 15 different Characters each). For " + c.p + " players: " + cut + ". Deal <b>6 faceup</b> into the Character row.";
          }
          return "Shuffle the Ocean Character deck (two identical sets) and deal <b>6 faceup</b> into the Character row.";
        },
        src: (c) => c.mode === "solo" ? "Base p.27 · Cold Waters p.12" : (c.has("cr") ? "Coral Reefs p.6" : (c.has("cw") ? "Cold Waters p.5" : "Base p.6")),
        when: () => true },
      { exp: (c) => c.has("cw") ? "cw" : "base",
        t: "Build the Location deck",
        d: (c) => {
          if (c.mode === "solo" && AQ.help.tribesAvailable(c)) return "Base solo: shuffle all Locations into one deck. <b>Tribes Solo</b>: split the Locations into their 5 type decks, shuffle each, take <b>4 random cards of each type</b> (20 total) as your deck. Deal <b>6 faceup</b> into the bottom Location row.";
          if (!c.has("cw")) return "Shuffle the Location deck and deal <b>6 faceup</b> into the bottom Location row.";
          const cut = c.p >= 5 ? "use every Location" : (c.p === 4 ? "discard 2 random Locations of each type (10 total)" : (c.p === 3 ? "discard 4 random Locations of each type (20 total)" : "discard 6 random Locations of each type (30 total)"));
          return "Combine the base and Cold Waters Locations. For " + c.p + " player" + (c.p > 1 ? "s" : "") + ": " + cut + ". Shuffle and deal <b>6 faceup</b> into the bottom Location row.";
        },
        src: (c) => c.mode === "solo" && AQ.help.tribesAvailable(c) ? "Cold Waters p.12" : (c.has("cw") ? "Cold Waters p.5" : "Base p.6"),
        when: () => true },
      { exp: (c) => c.mode === "tribes" ? (c.has("cw") ? "cw" : "cr") : "base",
        t: (c) => c.mode === "tribes" ? "Lay out the Tribes" : "Lay out the Goals",
        d: (c) => {
          if (c.mode === "tribes") {
            if (c.has("cw") && c.has("cr")) return "Form the two Tribe decks (<b>I</b> and <b>II</b> backs) from <b>both</b> expansions, shuffle separately, and deal <b>4 random Tribes from each</b> onto their board spaces (or agree on the eight as a group). Box the rest.";
            if (c.has("cr")) return "Place the <b>8 Southern Tribes</b> (4 of type I, 4 of type II) from Coral Reefs onto their spaces on the day side of the board.";
            return "Divide the Tribe cards into their <b>I</b> and <b>II</b> decks, shuffle separately, and deal <b>4 from each</b> faceup onto the Tribe board. Box the rest.";
          }
          let d = c.mod("advgoals")
            ? "Shuffle the double-sided <b>Goal tokens</b>" + ((c.has("cw") || c.has("cr")) ? " (base" + (c.has("cw") ? " + Cold Waters" : "") + (c.has("cr") ? " + Coral Reefs" : "") + ")" : "") + " and place <b>4 at random</b> over the printed Goals — or agree on four as a group."
            : "Play with the <b>four Goals printed on the board</b>: 8 Characters in hand · 5 Locations on your board · 3+ scored Locations · 2+ Wild Mantas.";
          if (c.has("cr") && !c.mod("advgoals")) d += " (The Coral Reefs board requires Goal tokens — lay out 4, randomly or by agreement.)";
          return d;
        },
        src: (c) => c.mode === "tribes" ? (c.has("cw") ? "Cold Waters p.6 · Coral Reefs p.6" : "Coral Reefs p.6, p.12") : "Base p.6, p.24, p.26" + (c.has("cr") ? " · Coral Reefs p.6" : ""),
        when: () => true },
      { exp: "cr",
        t: "Reefs and Corals",
        d: (c) => {
          const reefs = c.p >= 5 ? "all 30" : (c.p === 4 ? "26" : (c.p === 3 ? "22" : "18"));
          const corals = c.p >= 5 ? "all" : (c.p === 4 ? "60" : (c.p === 3 ? "50" : "40"));
          return "Shuffle the Reef tokens and keep <b>" + reefs + "</b> as a facedown Reef deck (box the extras); reveal <b>6 Reefs</b> into the Reef row beneath the Character row. Split the Corals into the <b>common supply</b> and the <b>final reserve</b>: take " + corals + " Corals total, with <b>10 of one colour</b> always set aside as the final reserve.";
        },
        src: "Coral Reefs p.7, p.16",
        when: (c) => c.has("cr") },
      { exp: "base",
        t: "Wild Mantas",
        d: "Place all Wild Manta miniatures <b>effect side up</b> next to the board.",
        src: "Base p.6",
        when: () => true }
    ] },

  { title: "The Kings & Their Courts",
    steps: [
      { exp: "base",
        t: "Player setup",
        d: (c) => {
          let d = "Each player takes a <b>three-layered player board</b>, a symbol's set of <b>6 starting Characters</b> and <b>4 Trained Mantas</b> (turned effect side up).";
          if (c.has("cr")) d += " Coral Reefs adds to each player the <b>Medusa Arcadio</b> starting Character (7 starting cards total) and a <b>5th Manta</b> (+1 coin / +1 power) — that Manta can never claim Goals or hire Tribes.";
          return d;
        },
        src: (c) => "Base p.7" + (c.has("cr") ? " · Coral Reefs p.7" : ""),
        when: () => true },
      { exp: (c) => c.mod("turnorder") ? "cr" : "base",
        t: (c) => c.mod("turnorder") ? "Turn Order Mantas" : "Kings and turn order",
        d: (c) => {
          if (c.mode === "solo") return "Shuffle the Kings, draw <b>3</b>, keep <b>1</b> in your starting hand. Give a set of Trained Mantas to your rival, the <b>Ichthyanders</b>." + (AQ.help.tribesAvailable(c) ? " (<b>Tribes Solo</b>: no virtual rival — see the Solo reference below for the difficulty ladder.)" : "");
          if (c.mod("turnorder")) return "Remove all <b>King cards</b> from the game. The first player (the last one to feed the fish, or random) takes Turn Order Manta <b>#1</b>, the next clockwise <b>#2</b>, and so on; extras go back in the box. They start ready beside your boards and behave like Wild Mantas — but never claim Goals or hire Tribes.";
          let d = "The <b>last player to dive in the sea</b> goes first; play proceeds clockwise.";
          if (c.mod("kingsdraft")) d += " <b>Draft the Kings:</b> shuffle player-count + 1 Kings; the last player picks first and passes counterclockwise; box the leftover.";
          else if (c.mod("kings")) d += " <b>Kings:</b> deal King #1 to the first player, #2 to the second, and so on — each joins that player's starting hand.";
          else d += " (Skipping the King cards — recommended for a first game.)";
          return d;
        },
        src: (c) => c.mode === "solo" ? "Base p.27" : (c.mod("turnorder") ? "Coral Reefs p.4" : "Base p.7, p.26"),
        when: () => true },
      { exp: "base",
        t: "Ready to dive",
        d: (c) => {
          let d = "Turns go clockwise: on yours, you <b>must play exactly one Character card</b> (your Main Action) and may take <b>unlimited additional actions</b> (flip ready Mantas, exploit Location Depths) before, between and after — the full structure is in the reference below.";
          if (c.mode === "solo") d += " Solo: every time you play <b>Matrona</b> or take a <b>Scout</b> action, the Ichthyanders place one of their Mantas on a free Goal track (you may place yours first, FAQ).";
          return d;
        },
        src: (c) => "Base p.12" + (c.mode === "solo" ? " · Base p.27 · Cold Waters p.12" : ""),
        when: () => true }
    ] }
];

/* ---- REFERENCE SECTIONS -------------------------------------------------------- */
AQ.reference = [
  { id: "turn", title: "Turn Structure & Actions",
    when: () => true,
    html: (c) => `
<ul>
<li><b>Main Action (mandatory):</b> play one Character card and resolve its effects <b>in the printed order</b>, doing <b>as much of each as you can</b> — the only optional effect is <b>Scout</b> (updated rule). Opponent-hitting cards (Meg, Researcher…) are mandatory for the opponents too (FAQ). Played cards go faceup on your personal discard pile — except <b>Matrona</b>, which always returns to your hand.</li>
<li><b>Additional actions (unlimited):</b> flip a <b>ready Manta</b> for its effect (it turns tired), or <b>exploit the top Depth</b> of one of your Locations, sliding it up one. Resource Depths (coins/power) may only be exploited <b>during</b> your Main Action; effect Depths only <b>before or after</b> it — never interrupting it (FAQ). One resource Depth per Location per turn (sole exception: The Grabber's double conquest can chain two back-to-back type-specific conquer Depths on a Volcano); you must use at least part of any effect you exploit (FAQ).</li>
<li><b>Resources don't carry over</b> — coins and power exist only within the turn, and only in support of your Main Action (FAQ).</li>
${c.has("cw") ? "<li><b>Delayed Effects</b> (purple box, Cold Waters): active while that Character tops your discard pile — resolve it at the start of your next Main Action. Covered by another card = switched off.</li>" : ""}
</ul>
<p class="src-line">Base p.12–13 · Cold Waters p.7–8, p.11 · FAQ #7, 8, 21, 23, 40–41, 47</p>` },

  { id: "effects", title: "The Effects",
    when: () => true,
    html: (c) => `
<ul>
<li><b>Recruit</b> — pay the coin cost shown under an Ocean Character in the row; it goes to your hand. Slide the row left and refill from the deck. No limit on duplicates.${c.has("cr") ? " <b>Coral Reefs:</b> every Recruit also takes the <b>Reef token below the chosen Character</b> — you must place it above one of your five Location slots (stacking hides the older Reef); the Reef row refreshes like the Character row." : ""}</li>
<li><b>Buy / Conquer Location</b> — pay coins (buy) or power (conquer) shown on a Location in either row; slot it into an empty space on your player board, top Depth showing. Board full (5) = no new Locations. ${c.has("cr") ? "On the Coral Reefs board the top row gives <b>+1 Coral</b> instead of the base board's −1 power conquer discount." : "Top-row Locations cost <b>1 less power to conquer</b> (never cheaper to buy)."} Locations without Depths show only their Prosperity row.</li>
<li><b>Raise</b> — slide a Location up the shown number of Depths (splitting between Locations if the effect allows), losing whatever the covered Depths held. A raise effect on a Location can never raise <b>itself</b>, and you can't use a raise effect if you have nothing to raise (FAQ). A <b>fully risen</b> Location immediately grants its <b>Wild Manta</b>, ready to use at once.</li>
<li><b>Score</b> — move one fully risen Location to your (secret) Scoring Pile; only scored Locations pay Prosperity. A score effect can't score the Location it's printed on (FAQ).</li>
<li><b>Scout</b> — now optional: discard the top Location row, keep at most 4 from the bottom row and slide them up, refill the bottom with 6.</li>
${c.has("cr") ? "<li><b>Seed</b> (Coral Reefs) — place 1 Coral from the supply onto any of your Locations (even fully risen); multi-seeds spread across different Locations. Corals reach your reserve when their Location is scored, and each is <b>1 Prosperity</b> at game end (in Tribes play they can also pay for Tribes).</li><li><b>Defend</b> (Coral Reefs) — park one of your Mantas (even tired) on a board Location: nobody may buy or conquer it. When it would be discarded, it comes to <b>your</b> board instead (full board = discarded; no Coral either way) and your Manta returns <b>ready</b>.</li>" : ""}
</ul>
<p class="src-line">Base p.14–23 · Cold Waters p.11${c.has("cr") ? " · Coral Reefs p.8–10" : ""} · FAQ #40–48</p>` },

  { id: "goals", title: "Goals",
    when: (c) => c.mode !== "tribes",
    html: (c) => `
<ul>
<li>Meet a Goal's condition on your turn and you may place one of your <b>original Trained Mantas</b> (ready or tired) on its next free track spot — earlier spots pay more Prosperity. Claiming is <b>optional</b>, free, and legal even mid-Main-Action (FAQ) — but each Goal only once per player.</li>
<li><b>Printed Goals:</b> 8 Character cards in hand (King counts) · 5 Locations on your board · 3+ Locations scored · 2+ Wild Mantas.</li>
${c.mod("advgoals") ? "<li><b>Base tokens:</b> 11 Locations board+scored · 15+ Prosperity scored · 3+ Wild Mantas · all but 1 Character discarded (via normal play — Matrona stays) · 4 different types scored · 4 of one type owned · 10+ Characters in discard · 5+ Conquer-effect Characters owned · 5 fully risen at once · recruit a 5-coin Character (paying the coins, FAQ).</li>" : ""}
${c.mod("advgoals") && c.has("cw") ? "<li><b>Cold Waters tokens:</b> 5 board Locations with different Prosperity values · 7+ scored · 5 board Locations with different unexploited Depth counts · 4+ scored worth ≤3 each.</li>" : ""}
${c.mod("advgoals") && c.has("cr") ? "<li><b>Coral Reefs tokens:</b> 9 Corals in reserve · 4 board Locations with Corals · 4 scored with the same coin cost · 4 scored with the same power cost · 4 board Locations with different Prosperity · 5 scored with different Prosperity · 5 scored without a Manta icon · 4 scored worth 5+ · 5 Reefs on your board · 4 Locations in Reef slots.</li>" : ""}
</ul>
<p class="src-line">Base p.24, p.28 · Cold Waters p.11 · Coral Reefs p.13 · FAQ #49–52</p>` },

  { id: "tribes", title: "The Tribes",
    when: (c) => c.mode === "tribes" || (c.mode === "solo" && AQ.help.tribesAvailable(c)),
    html: (c) => `
<ul>
<li><b>Recruiting a Tribe</b> uses a card with the <b>Recruit</b> effect (that use can't also recruit an Ocean Character). Cost = base cost <b>+1 coin per Manta already on the card</b>. Pay like a Location — and you may also discard Locations <b>from your Scoring Pile</b>, each worth its Prosperity in coins (that card is gone from the game, FAQ)${c.has("cr") ? ", or spend Corals" : ""}.</li>
<li>Place one of your original <b>Trained Mantas</b> on the Tribe — it's retired for the game. One recruitment per Tribe per player.</li>
<li><b>Dark-blue (I) Tribes</b>: an ongoing bonus usable <b>once per turn</b>, plus fixed end-game Prosperity. <b>Light-blue (II) Tribes</b>: an instant bonus on recruitment, plus conditional end-game Prosperity.</li>
<li>Rulings: Starting cards count as “Ocean Characters” for Tribe scoring (FAQ) — but <b>Red Thunder</b> scores only market-recruited Characters, and its bottom icon retrieves your discard pile like Matrona; <b>Seastar Syndicate / Turtle Kin</b> count hand + discard; <b>Coral Carvers</b> pay per Reef-covered Location (max 5), not per stacked Reef; <b>Spirit Hunters</b> give +2 coins or +2 power.</li>
</ul>
<p class="src-line">Cold Waters p.9–10 · Coral Reefs p.12 · FAQ #6, 32–39</p>` },

  { id: "endgame", title: "End of the Game & Scoring",
    when: () => true,
    html: (c) => `
<ul>
<li><b>Triggers:</b> a player claims all 4 Goals (Goals play) · the Location deck runs out · the Character deck runs out (when its last card fills the row, FAQ)${c.has("cr") ? " · the Reef deck runs out (replaces the Character-deck trigger) · the last Coral leaves the common supply (draw from the final reserve thereafter)" : ""}.</li>
<li>Then <b>everyone takes one more turn</b>, including the player who triggered it. In Tribes play${c.mod("turnorder") ? " (and always with Turn Order Mantas)" : ""}: finish the current round first, then one final full round (FAQ #1).</li>
<li><b>Score:</b> 1 Prosperity per Character card in hand (Kings count; discard pile doesn't) + the Goal-track spots your Mantas hold + all Locations in your Scoring Pile (board Locations score nothing)${c.has("cr") ? " + 1 per Coral in your reserve" : ""}${c.mode === "tribes" ? " + your Tribes' fixed and conditional bonuses" : ""}.</li>
<li><b>Ties:</b> most Mantas in reserve, then the lowest-numbered King (no Kings: the last player in turn order wins).</li>
</ul>
<p class="src-line">Base p.25 · Coral Reefs p.10, p.16 · FAQ #1–2, 18</p>` },

  { id: "solo", title: "Solo Play",
    when: (c) => c.mode === "solo",
    html: (c) => `
<ul>
<li><b>Base solo (vs the Ichthyanders):</b> single Character set, one King kept of three drawn. Whenever you play <b>Matrona</b> or take a <b>Scout</b> action (yes — even the Sea Horse's, FAQ), the rival places one Manta on any Goal track without one of theirs; you may claim your own Goal first. Game ends when their 4th Manta lands (plus your final turn) — or by the usual deck-out and 4-goal triggers. Score yourself: ≤30 Blobfish · 31–60 Sea Serpent · 61–90 Leviathan · 91+ Kraken. In a solo game Matrona does <b>not</b> discard the row's leftmost Character (that's 2-player only).</li>
${AQ.help.tribesAvailable(c) ? "<li><b>Tribes Solo (the ladder):</b> 20-Location deck (4 of each type), single Character set, Tribes laid out; win by recruiting <b>all eight Tribes</b> before a deck runs out (one last turn when it does). Levels: <b>1</b> — you may flip a Tribe card instead of spending a Manta (no bonus if you do); <b>2</b> — six type-I / two type-II Tribes; <b>3</b> — a Manta (Trained or Wild) is always required, ensure the Location deck holds 6+ Wild Mantas; <b>4</b> — scored Locations pay only 1 coin toward Tribes; <b>5</b> — no discarding scored Locations at all; <b>6</b> — two type-I / six type-II, and count your Prosperity for bragging rights.</li>" : ""}
</ul>
<p class="src-line">Base p.27 · Cold Waters p.12–14 · FAQ #55–59</p>` },

  { id: "rulings", title: "Rulings Worth Remembering (FAQ)",
    when: () => true,
    html: (c) => `
<ul>
<li><b>The Grabber</b>: two separate conquests — power can't be reused or carried over between them, but an effect from the first conquered Location may help pay for the second.</li>
<li><b>Manta's Leader</b>: un-tiring happens first; power Mantas still only flip once that turn. “All Mantas” means yours only.</li>
<li><b>Healer</b> can replay your King from the discard pile; the retrieved card still counts as part of your Main Action.</li>
<li><b>Depth discipline</b>: you can't exploit a Depth you'd entirely waste (two 2-coin Depths can't buy a 2-cost card, but they can buy a 3-cost one); overpaying with a single coin/power effect is fine — overflow is lost.</li>
<li><b>Public info</b>: deck counts, the Location discard pile, and the top of each discard pile are open; your Scoring Pile and the rest of your discard pile are private.</li>
${c.has("cr") ? "<li><b>Reefs</b>: placing every Reef you gain is mandatory (stack to bury one you dislike); Reef row effects that grant a Reef don't shift the Character row. <b>Snappy Dressers</b>: a Reef taken by effect is on top of the one your Recruit still collects.</li><li><b>Crab Union</b>: counts everyone's defended Locations, and lets available power (from any source) pay coin costs.</li>" : ""}
${c.has("cw") ? "<li><b>2-player Matrona</b>: playing her also discards the row's leftmost (free) Character, then refills.</li>" : ""}
</ul>
<p class="src-line">FAQ #3, 5, 9–20, 24–28, 40–48, 53–54</p>` }
];

/* ---- TEACHING SCRIPT (read aloud, ~5 min; content per the base, Cold Waters
   and Coral Reefs rulebooks + FAQ — see reference sections for citations) ---- */
AQ.teach = {
  intro: "Read this aloud — about five minutes. Keep hands off the cards until the end.",
  sections: [
    { h: "The pitch — and how you win", body: (c) => `
<p>We are ocean kings growing underwater empires. Everything is worth <b>Prosperity</b> at the end: the <b>Locations you've scored</b>, your <b>Goal-track claims</b>, leftover <b>Characters in hand</b>${c.has("cr") ? ", <b>Corals</b> in your reserve" : ""}${c.mode === "tribes" ? ", and your <b>Tribes</b>" : ""} — most Prosperity wins.</p>
<p>The game ends when ${c.mode === "tribes" ? "a deck runs dry" : "someone claims all four Goals or a deck runs dry"}${c.has("cr") ? " (with Coral Reefs: the Reef deck or the Coral supply can also end it)" : ""} — then everyone gets equal turns, and we count.</p>` },

    { h: "Your turn — one card, then squeeze the engine", body: () => `
<p>On your turn you <b>must play exactly one Character card</b> — that's your main action, and its effects resolve top to bottom. But around it you may take <b>unlimited extra actions</b>: flip a ready <b>Manta</b> for its bonus, or <b>exploit the top depth</b> of one of your Locations, sliding the card up a notch. The skill of Aquatica is chaining these: a coin depth funds the card, the card conquers a Location, the new Location's depth pays for more.</p>
<p>One catch: <b>coins and power vanish at end of turn</b>. Generate only what you can spend right now.</p>` },

    { h: "The effects — what cards do and why", body: (c) => `
<p><b>Recruit</b> buys better Characters from the row — your deck is your engine, upgrade it${c.has("cr") ? " (each Recruit also grabs the Reef tile under that Character — a small permanent upgrade for one of your Location slots)" : ""}. <b>Buy</b> (coins) or <b>Conquer</b> (power) takes Locations onto your board — your income and your points. <b>Raise</b> slides a Location up, spending its remaining depths for tempo; a <b>fully risen</b> Location hands you a <b>Wild Manta</b>. <b>Score</b> banks a fully risen Location into your pile — only scored Locations pay Prosperity. <b>Scout</b> refreshes the market when it's stale.</p>` },

    { h: "Cold Waters — delayed effects", when: (c) => c.has("cw"), body: () => `
<p>Cold Waters characters carry <b>Delayed Effects</b> — the purple box at the bottom. A delayed effect is armed while that card sits <b>on top of your discard pile</b>, and it fires at the start of your next main action; play another card on top and it switches off unfired. Sequencing your discard pile becomes a real skill — the strongest engines in this expansion are two-turn plays.</p>` },

    { h: "Goals — the race inside the race", when: (c) => c.mode === "goals", body: (c) => `
<p>Four <b>Goals</b> sit at the top of the board${c.mod("advgoals") ? " — random ones this game, drawn from the Goal tokens, so read them out now" : ""}. Meet one — on your turn — and you may park a Manta on its track: <b>earlier claims pay more</b>. Each Goal once per player, and claiming is optional but almost always right. This is the tempo war: rushing Goals ends the game while opponents are still building.</p>` },

    { h: "Tribes — hire your engine's endgame", when: (c) => c.mode === "tribes", body: () => `
<p>Instead of Goals, we hire <b>Tribes</b>: play a card with a Recruit effect at a Tribe, pay its cost <b>+1 coin for every Manta already on it</b> (you may cash in scored Locations for their Prosperity value — gone forever), and retire one of your Mantas onto it. Dark-blue Tribes give an ongoing once-a-turn power plus flat points; light-blue ones fire instantly and score conditionally. Early hires are cheap; good hires shape your whole game.</p>` },

    { h: "Solo — the Ichthyanders", when: (c) => c.mode === "solo", body: (c) => `
<p>You race a silent rival: every time you play <b>Matrona</b> or take a <b>Scout</b> action, the Ichthyanders claim a Goal track. When their fourth Manta lands, you get one final turn — then the Ocean Council grades your Prosperity, from Blobfish to Kraken.${AQ.help.tribesAvailable(c) ? " (Tribes Solo instead climbs a six-level difficulty ladder: recruit all eight Tribes before a deck runs out.)" : ""}</p>` },

    { h: "Coral Reefs — reefs and corals", when: (c) => c.has("cr"), body: () => `
<p>Two additions: <b>Reefs</b> come free with every Recruit and permanently improve one of your five Location slots (stack a new one to replace the old). <b>Corals</b> are points-on-legs: the <b>seed</b> effect grows them on your Locations, and they only bank — 1 Prosperity each — when the Location scores. The <b>defend</b> effect parks a Manta on a market Location so nobody can buy it out from under you; if it would be discarded, it's yours.</p>` },

    { h: "Don't worry about these yet", body: (c) => {
      const bits = [];
      if (c.mod("kings") || c.mod("kingsdraft")) bits.push("your King card is just a strong Character that starts in hand");
      if (c.mod("turnorder")) bits.push("your numbered Manta acts like a Wild Manta, never claims Goals — and at game end we finish the round so everyone gets equal turns");
      return `<p>Individual card powers explain themselves as they're played${bits.length ? "; " + bits.join("; ") : ""}. Starting advice: don't hoard — a Location on your board is worth nothing until you <b>score</b> it.</p>`;
    }}
  ]
};
