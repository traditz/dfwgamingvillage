/* =============================================================================
   Elder Sign — Setup & Reference Utility
   Data model: the base game, six expansions, five game modes, optional
   modules & variants, and a single precedence-aware setup sequence.

   The setup follows the base game's 8 numbered setup steps (Rules of Play
   p.5). Expansions insert into or replace those steps; the four big-box
   expansions each add a whole game mode whose rulebook rewrites setup.
   The FAQ v2.0 (25 Jul 2018) is the latest official ruling and always wins
   over older rulebook text.
   ============================================================================= */

const ES = {};

/* ---- Sets ------------------------------------------------------------------ */
ES.expansions = [
  { id: "base", name: "Elder Sign", short: "Base Game", year: 2011, kind: "base",
    blurb: "The 2011 original. 1–8 investigators roll dice through midnight adventures in a haunted museum, racing to collect Elder Signs before the Ancient One's doom track fills." },
  { id: "uf", name: "Elder Sign: Unseen Forces", short: "Unseen Forces", year: 2013, kind: "exp",
    blurb: "Blessings and curses (white & black dice), four Entrance cards that replace the entrance sheet, Master Mythos cards, entry effects, and 4 new Ancient Ones including Abhoth and his Children." },
  { id: "goa", name: "Elder Sign: Gates of Arkham", short: "Gates of Arkham", year: 2014, kind: "exp",
    blurb: "The Streets of Arkham game mode: leave the museum for Arkham proper, with facedown adventures, opening and sealing gates, events, skills, and memberships in the Sheldon Gang or Order of the Silver Twilight." },
  { id: "ooi", name: "Elder Sign: Omens of Ice", short: "Omens of Ice", year: 2015, kind: "exp",
    blurb: "The Alaska Expedition game mode: a staged trek through the icy frontier with a supply track, a day track (Summer or Winter), storm markers, and Ithaqua at his most dangerous." },
  { id: "gc", name: "Elder Sign: Grave Consequences", short: "Grave Consequences", year: 2015, kind: "exp",
    blurb: "Three small modular decks usable with any other content: Phobias (lasting madness instead of death), Epitaphs (a graveyard for the fallen), and Epic Battle cards for the final fight." },
  { id: "ootd", name: "Elder Sign: Omens of the Deep", short: "Omens of the Deep", year: 2016, kind: "exp",
    blurb: "The R'lyeh Rising game mode: sail the Pacific aboard the Ultima Thule, manage the Dark Waters track, rebuild the Amulet of R'lyeh, and hold off the Deep One Legion — with Cthulhu waiting below." },
  { id: "ootp", name: "Elder Sign: Omens of the Pharaoh", short: "Omens of the Pharaoh", year: 2017, kind: "exp",
    blurb: "The Lightless Pyramid game mode: travel between Cairo and Dashur, build the Expedition, collect Relics, unlock Hidden Chambers, and face Nephren-Ka the Dark Pharaoh." }
];

ES.expMeta = {
  base: { name: "Base Game",           cls: "e-base" },
  faq:  { name: "FAQ v2.0",            cls: "e-faq"  },
  uf:   { name: "Unseen Forces",       cls: "e-uf"   },
  goa:  { name: "Gates of Arkham",     cls: "e-goa"  },
  ooi:  { name: "Omens of Ice",        cls: "e-ooi"  },
  gc:   { name: "Grave Consequences",  cls: "e-gc"   },
  ootd: { name: "Omens of the Deep",   cls: "e-ootd" },
  ootp: { name: "Omens of the Pharaoh",cls: "e-ootp" },
  mode: { name: "Game Mode",           cls: "e-mode" }
};

/* ---- Game modes -------------------------------------------------------------
   Exactly one mode is active. The classic museum game is the default; each
   big-box expansion adds a mode that rewrites setup and the play area.      */
ES.modes = [
  { id: "museum", name: "Classic Museum", requires: null,
    blurb: "The original game in and around the museum. All expansion investigators, Ancient Ones, items and monsters you selected are mixed in.",
    src: "Base p.5" },
  { id: "streets", name: "Streets of Arkham", requires: "goa",
    blurb: "Adventure across Arkham itself: three faceup and three facedown Arkham Adventures, gates that open onto Other Worlds, events, skills, and memberships.",
    src: "Gates of Arkham p.2–3" },
  { id: "alaska", name: "Alaska Expedition", requires: "ooi",
    blurb: "A two-stage rescue expedition into the Alaskan wilderness. Track supplies and days, weather storms, and push north before Summer ends — or survive the Winter.",
    src: "Omens of Ice p.2–3" },
  { id: "rlyeh", name: "R'lyeh Rising", requires: "ootd",
    blurb: "A two-stage voyage into the Pacific aboard the Ultima Thule. Manage the Dark Waters track, gather the broken Amulet of R'lyeh, and don't let the Deep One Legion sink your ship.",
    src: "Omens of the Deep p.2" },
  { id: "pyramid", name: "Lightless Pyramid", requires: "ootp",
    blurb: "Excavate Egypt from Cairo to Dashur. Build up the Expedition, collect paired Relics, unlock Hidden Chambers, and stop the Dark Pharaoh's return.",
    src: "Omens of the Pharaoh p.2" }
];

/* ---- Optional modules & variants -------------------------------------------
   requires = expansion id that must be on the table.
   modes    = array of mode ids the module applies to (null = any mode).     */
ES.modules = [
  { id: "master", name: "Master Mythos cards", requires: "uf", modes: ["museum"],
    summary: "Shuffle the 9 red-bordered Master Mythos cards into the Mythos deck for a harder game.",
    description: "An optional challenge for experienced players. If all players agree, shuffle all 9 Master Mythos cards into the Mythos deck before setup. Otherwise they are returned to the box during setup.",
    src: "Unseen Forces p.4" },
  { id: "phobia", name: "Phobia deck", requires: "gc", modes: null,
    summary: "Sanity hitting 0 gives a permanent Phobia (and 1 doom) instead of devouring — until the fourth.",
    description: "When an investigator's sanity would drop to 0 or less, they are not devoured: they draw a Phobia card, restore sanity to full, and add 1 doom token to the doom track. Phobias can never be removed. Drawing a fourth Phobia devours the investigator. After the Ancient One awakens, no more Phobias are drawn — 0 sanity devours as normal.",
    src: "Grave Consequences card 2/5" },
  { id: "epitaph", name: "Epitaph deck", requires: "gc", modes: null,
    summary: "Each devoured investigator draws an Epitaph card and leaves a gravestone by the play area.",
    description: "After an investigator is devoured, they draw an Epitaph card and resolve its effect, then flip it facedown near the play area and stand their investigator token on it — a growing graveyard of the fallen.",
    src: "Grave Consequences card 3/5" },
  { id: "epicbattle", name: "Epic Battle deck", requires: "gc", modes: null,
    summary: "The final battle is fought through Epic Battle cards that set attack order and add effects.",
    description: "When the Ancient One awakens, shuffle the Epic Battle deck next to its card and draw the top card, resolving it top to bottom. Cards dictate whether investigators or the Ancient One attack first, and Battle Event cards add bonuses or penalties between rounds. After each midnight strike, draw the next card.",
    src: "Grave Consequences cards 3/5–5/5" },
  { id: "winter", name: "Winter expedition (harder)", requires: "ooi", modes: ["alaska"],
    summary: "Use the Winter side of the Track card — if Day 7 ends, the investigators lose.",
    description: "Choose the season during setup. Summer (default) is more forgiving: when the day token must advance past Day 7, add 2 doom tokens, reset it to Day 7 and add 7 storm markers. Winter is unforgiving: when the day token must advance past Day 7, the investigators lose the game.",
    src: "Omens of Ice p.2, p.4" },
  { id: "expert", name: "Expert Mythos variant", requires: "ootp", modes: ["pyramid"],
    summary: "Mythos options with the turquoise Expert watermark add +1 doom after resolving.",
    description: "For a greater challenge: each time the players resolve a Mythos card option that has the turquoise Expert Mythos watermark in its background, add 1 additional doom token to the doom track after resolving that option's effects.",
    src: "Omens of the Pharaoh p.5" },
  { id: "exhibit", name: "The Exhibit (Relics outside Egypt)", requires: "ootp", modes: ["museum", "streets", "alaska", "rlyeh"],
    summary: "Add the Exhibit scenario sheet: spend trophies for Relics — and face mask monsters and the Dark Pharaoh.",
    description: "Puts \"The Exhibit\" scenario sheet into play alongside the current entrance (it is not a space of its own). Investigators may spend trophies at the entrance to acquire Relic cards — but the Dark Pharaoh special adventures and all mask monsters are added to the game as well.",
    src: "Omens of the Pharaoh p.4" }
];

/* ---- THE SETUP SEQUENCE ------------------------------------------------------
   Each step: { exp, t, d, src, when }
     exp  = source tag (string or (c)=>string)
     when = (c)=>boolean, with c = { has(exp), mode, p, mod(id) }
   Steps are grouped into phases for display.                                  */

ES.phases = [
  /* ---------------------------------------------------------------- */
  { title: "Prepare the Collection",
    note: "One-time mixing of expansion components. Skip anything already done from a previous game.",
    steps: [
      { exp: "uf",
        t: "Swap in the Unseen Forces replacement cards",
        d: "Unseen Forces includes 8 replacement cards that are <b>always used, regardless of which expansions or mode you play</b>: the Adventure card <i>The Elder Sign</i>; the Other World cards <i>Great Hall of Celeano</i>, <i>The Abyss</i>, <i>Plateau of Leng</i> and <i>City of the Great Race</i>; and the Investigator cards <i>Carolyn Fern</i>, <i>Vincent Lee</i> and <i>Mandy Thompson</i>. Remove the base-game versions from your collection. (Owners of the Revised Edition already have the corrected investigators.)",
        src: "Unseen Forces p.2 · FAQ p.4",
        when: (c) => c.has("uf") },
      { exp: "base",
        t: "Pool the cross-compatible components",
        d: (c) => {
          const bits = [];
          bits.push("<li><b>Investigators</b> and <b>Ancient Ones</b> from every set you selected go into their shared pools.</li>");
          bits.push("<li><b>Common Items, Unique Items, Spells and Allies</b> from every selected set shuffle into their base-game decks.</li>");
          if (c.has("goa") || c.has("ootd")) bits.push("<li><b>Skill cards</b> (Gates of Arkham / Omens of the Deep) shuffle together into one Skill deck.</li>");
          bits.push("<li><b>Monster markers</b> from every selected set join the base-game monsters (mask monsters and Children of Abhoth stay out — see the monster cup step).</li>");
          if (c.mode === "museum" && (c.has("goa") || c.has("ooi") || c.has("ootd") || c.has("ootp")))
            bits.push("<li>The mode-specific decks stay in their boxes: Arkham/Alaskan/Pacific/Egyptian Adventures, their Mythos decks, entrance, track and scenario cards are <b>only</b> used in their own game modes.</li>");
          if (c.mode !== "museum")
            bits.push("<li>Adventure and Mythos cards from sets other than the mode you're playing stay in the box — each game mode uses <b>only its own</b> Adventure and Mythos decks.</li>");
          if (c.has("goa") && c.mode !== "streets")
            bits.push("<li>Remove the Gates of Arkham cards marked with the <b>restriction (!) icon</b> — including the <i>Luck</i> and <i>Wanderlust</i> skills and the <i>Ancient Egypt</i>, <i>Far Side of the Moon</i> and <i>The Vaults of Zin</i> Other Worlds — they are Streets of Arkham only.</li>");
          if (c.has("ootp")) bits.push("<li>Omens of the Pharaoh's <b>Calvin Wright investigator</b> replaces the Calvin Wright Ally card from Gates of Arkham — remove that Ally from the deck.</li>");
          return "<ul>" + bits.join("") + "</ul>";
        },
        src: "UF p.2 · GoA p.2 · OoI p.2,5 · OotD p.2,6 · OotP p.2,5 · FAQ p.4",
        when: (c) => c.has("uf") || c.has("goa") || c.has("ooi") || c.has("ootd") || c.has("ootp") },
      { exp: "gc",
        t: "Choose your Grave Consequences decks",
        d: (c) => {
          const on = ["phobia", "epitaph", "epicbattle"].filter(m => c.mod(m));
          const names = { phobia: "Phobia", epitaph: "Epitaph", epicbattle: "Epic Battle" };
          if (!on.length) return "Grave Consequences is on the table but none of its three decks is selected above. At the start of the game, players agree which of the Phobia, Epitaph and Epic Battle decks to use — any combination works with any other expansion.";
          return "All players agree to use the selected deck" + (on.length > 1 ? "s" : "") + ": <b>" + on.map(m => names[m]).join(", ") + "</b>. Place " + (on.length > 1 ? "each deck" : "the deck") + " shuffled beside the play area. (The Epic Battle deck is only shuffled and drawn when the Ancient One awakens.)";
        },
        src: "Grave Consequences card 1/5",
        when: (c) => c.has("gc") }
    ] },

  /* ---------------------------------------------------------------- */
  { title: "Build the Play Area",
    steps: [
      /* --- Step 1: clock & entrance, per mode --- */
      { exp: "base",
        t: "Set up the Clock and the Entrance",
        d: "Place the <b>Clock</b> in the center of the table with the clock hand on <b>XII (midnight)</b>. Place the <b>Entrance reference sheet</b> next to it, and the 6 green dice, the yellow die and the red die near the clock.",
        src: "Base p.5, step 1",
        when: (c) => c.mode === "museum" && !c.has("uf") },
      { exp: "uf",
        t: "Set up the Clock and the four Entrance cards",
        d: "Place the <b>Clock</b> in the center of the table with the clock hand on <b>XII (midnight)</b>, and the 6 green dice, the yellow die and the red die near it. The base game's entrance sheet is <b>not used</b>: place the four Unseen Forces <b>Entrance cards</b> faceup near the clock instead. Put the <b>white and black dice</b> and the <b>Blessed/Cursed cards</b> in a pile within reach of all players.",
        src: "Unseen Forces p.2 · Base p.5, step 1",
        when: (c) => c.mode === "museum" && c.has("uf") },
      { exp: "mode",
        t: "Set up the Clock and the Streets of Arkham",
        d: "Place the <b>Clock</b> in the center of the table with the clock hand on <b>XII (midnight)</b> and all dice near it" + " — investigators will start on the <b>Streets of Arkham entrance card</b>, which replaces the entrance sheet (and any Unseen Forces Entrance cards). Attach each of the 6 <b>gate markers</b> to a plastic stand and set them next to the Clock.",
        src: "Gates of Arkham p.2, steps 6–7 · Base p.5, step 1",
        when: (c) => c.mode === "streets" },
      { exp: "mode",
        t: "Set up the Clock, Expedition Camp and Track card",
        d: (c) => "Place the <b>Clock</b> in the center of the table on <b>XII</b> with all dice near it. Replace the entrance sheet with the <b>Expedition Camp</b> entrance card. Place the <b>Track card</b> with the <b>" + (c.mod("winter") ? "Winter" : "Summer") + "</b> side faceup near the play area: put the <b>supply token on the “5” space</b> of the supply track (top) and the <b>day token on “Day 1”</b> of the day track (bottom). Place the 28 <b>storm markers</b> randomly in a facedown pile.",
        src: "Omens of Ice p.2, steps 4–6 · Base p.5, step 1",
        when: (c) => c.mode === "alaska" },
      { exp: "mode",
        t: "Set up the Clock, the Ultima Thule and the Dark Waters",
        d: "Place the <b>Clock</b> in the center of the table on <b>XII</b> with all dice near it. Replace the entrance sheet with <b>“The Ultima Thule”</b> entrance card, ship side faceup. Place the <b>Scenario card</b> Dark Waters side up and put the <b>omen token on the starting space</b> of the Dark Waters track. Place the <b>broken amulet tokens</b> randomly in a facedown pile — then the investigators, as a group, <b>gain 1 broken amulet token</b> (draw, reveal, and set it by the scenario card).",
        src: "Omens of the Deep p.2, steps 1–2, 8 · Base p.5, step 1",
        when: (c) => c.mode === "rlyeh" },
      { exp: "mode",
        t: "Set up the Clock, Cairo and the Expedition",
        d: "Place the <b>Clock</b> in the center of the table on <b>XII</b> with all dice near it. Replace the entrance sheet with the double-sided <b>Cairo / Dashur entrance card, “Cairo” side faceup</b>. Place <b>“The Expedition” scenario sheet</b> near the play area with the 8 <b>expedition tokens</b> beside it.",
        src: "Omens of the Pharaoh p.2, steps 1–2 · Base p.5, step 1",
        when: (c) => c.mode === "pyramid" },
      { exp: "ootp",
        t: "Add The Exhibit scenario sheet",
        d: "Place <b>“The Exhibit”</b> scenario sheet beside the entrance. It adds an effect to the current entrance (it is not a space investigators can move to): spending trophies there acquires <b>Relic</b> cards. Shuffle the <b>Relic deck</b> near the other card decks, and shuffle the four <b>Dark Pharaoh special adventure</b> cards into a facedown pile near the Adventure deck.",
        src: "Omens of the Pharaoh p.4",
        when: (c) => c.mod("exhibit") && c.mode !== "pyramid" },

      /* --- Step 2: Ancient One --- */
      { exp: "base",
        t: "Choose the Ancient One",
        d: (c) => {
          let d = "Select an <b>Ancient One</b> card — at random, or by choice if all players agree — and place it next to the clock.";
          if (c.mode === "alaska") d = "Choose one of the three Omens of Ice Ancient Ones to challenge: <b>Rhan-Tegoth</b> (average), <b>Rlim-Shaikorth</b> (hard) or <b>Ithaqua</b> (insane). Place its card next to the clock.";
          if (c.mode === "rlyeh") d = "Choose an <b>Ancient One</b> to challenge and place it next to the clock. The three from Omens of the Deep fit the voyage: <b>Hydra</b> (average), <b>Dagon</b> (hard) or <b>Cthulhu</b> (insane).";
          if (c.mode === "pyramid") d = "Choose any <b>Ancient One</b> to challenge and place it next to the clock. For your first Lightless Pyramid game the expansion recommends one of its own: <b>Haunter of the Dark</b> (average), <b>Nephren-Ka</b> (hard) or <b>Nyarlathotep</b> (insane).";
          return d;
        },
        src: (c) => c.mode === "alaska" ? "Omens of Ice p.2, step 7" : c.mode === "rlyeh" ? "Omens of the Deep p.2, step 3" : c.mode === "pyramid" ? "Omens of the Pharaoh p.2, step 3" : "Base p.5, step 2",
        when: () => true },

      /* --- Step 3: monster cup --- */
      { exp: "base",
        t: "Prepare the monster cup",
        d: (c) => {
          const bits = ["Place the monster markers in the box lid or another opaque container — the <b>monster cup</b>."];
          if (c.mode === "pyramid") {
            bits.push("Add <b>all mask monster markers</b> from every set you own to the cup — in the Lightless Pyramid they are always in play. <b>Exception:</b> if you are facing the Omens of the Pharaoh version of <b>Nyarlathotep</b>, follow the mask-monster instructions on his card instead.");
          } else if (c.mod("exhibit")) {
            bits.push("Because The Exhibit is in play, add <b>all mask monster markers</b> to the cup as well.");
          } else {
            bits.push("If <b>Nyarlathotep</b> is the Ancient One, add the <b>mask monster markers</b> to the cup; otherwise return them to the box.");
          }
          if (c.has("uf")) bits.push("If <b>Abhoth</b> is the Ancient One, place the 3 <b>Children of Abhoth</b> markers in a facedown stockpile next to his card (never in the cup); otherwise return them to the box.");
          if (c.mode === "rlyeh") bits.push("Add the 5 <b>mission markers</b> to the monster cup, and set the 15 <b>Deep One Legion</b> markers aside as a separate stockpile — they never go in the cup.");
          return bits.join(" ");
        },
        src: (c) => {
          const s = ["Base p.5, step 3"];
          if (c.has("uf")) s.push("UF p.2, step 7");
          if (c.mode === "rlyeh") s.push("OotD p.2, steps 4–5");
          if (c.mode === "pyramid" || c.mod("exhibit")) s.push("OotP p.2, step 5 · p.3–4");
          return s.join(" · ");
        },
        when: () => true },

      /* --- Step 4: adventures, per mode --- */
      { exp: "base",
        t: "Set up the Adventures",
        d: "Shuffle the <b>Adventure deck</b> (not the Other World cards) and deal <b>six cards faceup</b> below the Clock and Entrance in <b>two rows of three</b>. Shuffle the <b>Other World Adventure deck</b> and place both decks near the faceup adventures. If a dealt Adventure shows a <b>locked die icon</b>, immediately place the matching die on that card.",
        src: "Base p.5, step 4",
        when: (c) => c.mode === "museum" },
      { exp: "mode",
        t: "Set up the Arkham Adventures",
        d: "Replace the Adventure deck with a deck of <b>only the Arkham Adventure cards</b>. Shuffle it <b>under the table</b> (card backs are open information), then deal <b>three cards faceup</b> in a row below the entrance and <b>three cards facedown</b> below them. Shuffle the <b>Other World deck</b> and place both decks nearby. If a faceup Adventure shows a <b>locked die icon</b>, place the matching die on it.",
        src: "Gates of Arkham p.2–3, steps 1 & 8",
        when: (c) => c.mode === "streets" },
      { exp: "mode",
        t: "Set up the Alaskan Adventures",
        d: "Replace the Adventure deck with the <b>Alaskan Adventures</b>: set the four <b>Special Adventure</b> cards aside, separate the rest by stage, and shuffle a <b>Stage I</b> and a <b>Stage II</b> deck (Stage I under the table — backs are open information). Deal <b>three Stage I cards faceup</b> in a row and <b>three facedown</b> below them, then place the <b>“Arrival” Special Adventure faceup</b> below the bottom row. Shuffle the <b>Other World deck</b>; set the Stage II deck aside. Locked die icons on faceup cards get their dice.",
        src: "Omens of Ice p.2, steps 2 & 8",
        when: (c) => c.mode === "alaska" },
      { exp: "mode",
        t: "Set up the Pacific Adventures",
        d: "Replace the Adventure deck with the <b>Pacific Adventures</b>: set the four <b>Special Adventure</b> cards aside, separate by stage, and shuffle a <b>Stage I</b> and a <b>Stage II</b> deck (Stage I under the table — backs are open information). Deal <b>three Stage I cards faceup</b> and <b>three facedown</b> below them, then place the <b>“Calling” Special Adventure faceup</b> below the bottom row. Shuffle the <b>Other World deck</b>; set the Stage II deck aside. Locked die icons on faceup cards get their dice.",
        src: "Omens of the Deep p.2, steps 6–7",
        when: (c) => c.mode === "rlyeh" },
      { exp: "mode",
        t: "Set up the Egyptian Adventures",
        d: "Replace the Adventure deck with the <b>Egyptian Adventures</b>: separate them by stage and shuffle a <b>Stage I “Cairo”</b> deck and a <b>Stage II “Dashur”</b> deck — the <b>Hidden Chamber</b> special adventures are shuffled into the Dashur deck. Deal <b>three Cairo cards faceup</b> and <b>three facedown</b> below them (shuffle under the table — backs are open information). Shuffle the four <b>Dark Pharaoh Special Adventure</b> cards into a facedown pile near the decks. Shuffle the <b>Other World deck</b> and place everything near the rows. Locked die icons on faceup cards get their dice.",
        src: "Omens of the Pharaoh p.2, steps 6–8",
        when: (c) => c.mode === "pyramid" },

      /* --- Step 5: items & clues --- */
      { exp: "base",
        t: "Set up Items, Clues and the small decks",
        d: (c) => {
          const bits = ["Place all <b>Clue tokens</b> in a pool beside the adventures. Shuffle the <b>Common Item</b>, <b>Unique Item</b>, <b>Spell</b> and <b>Ally</b> decks (with all selected expansion cards mixed in) and place them next to the Clue tokens."];
          if (c.mode === "streets") bits.push("Shuffle the <b>Event deck</b> and place it near the Mythos deck. Shuffle the <b>Skill deck</b> and place it near the Item and Ally decks, and set the <b>Membership cards</b> beside them.");
          if (c.mode === "rlyeh") bits.push("Shuffle the <b>Skill cards</b> — including any from Gates of Arkham — into one deck near the other cards.");
          if (c.mode === "pyramid") bits.push("Shuffle the <b>Relic deck</b> and place it near the other cards.");
          if (c.has("uf") && c.mode !== "museum") bits.push("Keep the <b>Blessed/Cursed cards</b> and the white and black dice within reach of all players.");
          return bits.join(" ");
        },
        src: (c) => {
          const s = ["Base p.5, step 5"];
          if (c.has("uf")) s.push("UF p.2, step 4");
          if (c.mode === "streets") s.push("GoA p.2, steps 3–5");
          if (c.mode === "rlyeh") s.push("OotD p.2, step 4");
          if (c.mode === "pyramid") s.push("OotP p.2, step 4");
          return s.join(" · ");
        },
        when: () => true }
    ] },

  /* ---------------------------------------------------------------- */
  { title: "Investigators & First Turn",
    steps: [
      { exp: "base",
        t: "Distribute the investigators",
        d: (c) => {
          const start = c.mode === "streets" ? "the <b>Streets of Arkham</b> card"
            : c.mode === "alaska" ? "the <b>Expedition Camp</b> card"
            : c.mode === "rlyeh" ? "<b>“The Ultima Thule”</b> entrance card"
            : c.mode === "pyramid" ? "the <b>“Cairo”</b> side of the entrance card"
            : c.has("uf") ? "the <b>“Souvenir Shop”</b> Entrance card"
            : "the <b>Entrance reference sheet</b>";
          return "Each of the <b>" + c.p + "</b> player" + (c.p > 1 ? "s" : "") + " selects an <b>Investigator</b> card (or deals them at random — decide as a group). Each player takes the matching Investigator marker, <b>Stamina and Sanity tokens equal to the maximums</b> printed on the card, and any <b>starting items and Clue tokens</b> shown on the card. All Investigator markers begin on " + start + " (they do not have to remain there on their first turn).";
        },
        src: (c) => {
          const s = ["Base p.5, step 6"];
          if (c.mode === "museum" && c.has("uf")) s.push("UF p.2");
          if (c.mode === "streets") s.push("GoA p.2");
          if (c.mode === "alaska") s.push("OoI p.3");
          if (c.mode === "rlyeh") s.push("OotD p.3");
          if (c.mode === "pyramid") s.push("OotP p.3");
          return s.join(" · ");
        },
        when: () => true },
      { exp: "base",
        t: "Choose the first player",
        d: "Select one player — at random, or by any method all players agree on — to be the <b>first player</b>. Play will proceed clockwise.",
        src: "Base p.5, step 7",
        when: () => true },
      { exp: "base",
        t: "Resolve the initial Mythos card",
        d: (c) => {
          let deck = "the <b>Mythos deck</b>";
          if (c.mode === "streets") deck = "the new <b>Arkham Mythos deck</b> (Gates of Arkham cards only)";
          if (c.mode === "alaska") deck = "the <b>Alaskan Mythos deck</b> (Omens of Ice cards only)";
          if (c.mode === "rlyeh") deck = "the <b>Stage I “Ocean” Mythos deck</b> — set the Stage II “R'lyeh” Mythos deck aside for later";
          if (c.mode === "pyramid") deck = "the <b>Omens of the Pharaoh Mythos deck</b> (its cards only — never combined with other Mythos cards)";
          let mm = "";
          if (c.mode === "museum" && c.has("uf")) mm = c.mod("master")
            ? " Because you are using the <b>Master Mythos option</b>, shuffle all 9 red-bordered Master Mythos cards into the deck first."
            : " Return the 9 red-bordered <b>Master Mythos</b> cards to the box (enable the Master Mythos module above to use them).";
          let dilemma = "";
          if (c.mode === "alaska") dilemma = " Remember that each Alaskan Mythos card is a <b>group dilemma</b>: choose one of its two options — the bottom option only if you can resolve it entirely.";
          if (c.mode === "rlyeh" || c.mode === "pyramid") dilemma = " Remember that each Mythos card in this mode is a <b>group dilemma</b>: choose either of its two options, even one that would have no effect.";
          return "The first player shuffles " + deck + " and places it next to the Ancient One." + mm + " Then <b>draw one Mythos card and resolve it</b>. If it shows a locked die icon, place the matching die on it. <b>“At Midnight” effects do not trigger during setup</b> — this first card is not midnight." + dilemma;
        },
        src: (c) => {
          const s = ["Base p.5, step 8", "FAQ p.4, p.11"];
          if (c.mode === "museum" && c.has("uf")) s.push("UF p.2, step 6 · p.4");
          if (c.mode === "streets") s.push("GoA p.2, step 2");
          if (c.mode === "alaska") s.push("OoI p.2, step 3");
          if (c.mode === "rlyeh") s.push("OotD p.2, step 9");
          if (c.mode === "pyramid") s.push("OotP p.2, step 9");
          return s.join(" · ");
        },
        when: () => true },
      { exp: "gc",
        t: "You're ready — the first player begins",
        d: (c) => "The first player takes the first turn. A turn is <b>Movement phase → Resolution phase → Clock phase</b> — see the Turn Reference below for the full structure." + (c.mod("epicbattle") ? " Keep the Epic Battle deck handy for when the Ancient One awakens." : ""),
        src: "FAQ p.2–3",
        when: () => true }
    ] }
];
/* Fix: the ready step is always shown; tag it as base */
ES.phases[2].steps[3].exp = "base";

/* ---- REFERENCE SECTIONS ------------------------------------------------------
   Each: { id, title, when, html (string or (c)=>string) }                     */

ES.reference = [
  { id: "turn", title: "Turn Structure (official FAQ timing)",
    when: () => true,
    html: (c) => `
<p>The FAQ v2.0 replaces the loose base-game turn description with a strict three-phase structure. This is the current official timing.</p>
<h4>I. Movement phase</h4>
<ul>
<li>Move your Investigator marker to any Adventure${c.mode === "museum" ? " card" : " or Other World card"} in play, or to the entrance — or stay where you are.${c.mode === "streets" ? " You cannot move to an Arkham Adventure that has an open gate on it; enter its Other World instead." : ""}</li>
${(c.mode !== "museum") ? "<li>If you move to a <b>facedown</b> Adventure, resolve the effect printed on its back, then flip it faceup — this ends your Movement phase.</li>" : ""}
${(c.has("uf") || c.mode !== "museum") ? "<li>If the card you arrive on has an <b>Entry</b> effect, resolve it as the last step of your Movement phase (if you cannot pay an Entry cost, ignore the effect — you may always still move there).</li>" : ""}
</ul>
<h4>II. Resolution phase</h4>
<p>If you are on the entrance, resolve an entrance action instead${(c.mode === "alaska" || c.mode === "rlyeh") ? " (in this mode, being at the entrance skips the Resolution phase — its actions happen in the Clock phase)" : ""}. On an adventure, you <b>must</b> attempt it, using this exact sequence:</p>
<ol>
${c.mode === "streets" ? "<li>If your card shows an <b>event icon</b>, draw and resolve an Event card.</li>" : ""}
<li>Decide whether to <b>attempt or intentionally fail</b> the adventure. You may declare it failed before your first roll (avoiding Terror effects): apply the penalties, leave your marker there, and go to the Clock phase.</li>
<li><b>Build the dice pool.</b> First pool of the phase: all available green dice${c.has("uf") ? ", plus the white die if Blessed and the black die if Cursed" : ""}. Add dice secured on Spells if you wish, spend Items for the yellow/red die, and use abilities. The yellow or red die cannot be added more than once per Resolution phase${c.has("ootp") ? " (Relics are the exception)" : ""}.</li>
<li><b>Roll the dice pool.</b></li>
<li>Apply <b>rerolls and result-changing effects</b> (Clue tokens, abilities, items).</li>
${c.has("uf") ? "<li>If <b>Cursed</b>, resolve the black die: if it matches another die in your pool, discard both.</li>" : ""}
<li><b>Secure dice on Spells</b> (spells that secure dice are cast <i>after</i> rolling, before Terror effects).</li>
<li><b>Complete a task if you can</b> — assign dice covering all its requirements (one task per roll). If it was the last task, the adventure is resolved. If tasks remain, return to step 2 of this list. If you cannot or will not complete a task:
  <ul>
  <li><b>a.</b> Resolve the card's <b>Terror effect once</b> if you rolled at least one terror result (never more than once per attempt);</li>
  <li><b>b.</b> optionally <b>focus</b> (or another investigator here may <b>assist</b>) — set one die's result aside on an investigator marker;</li>
  <li><b>c.</b> <b>discard one die</b> from the pool (mandatory);</li>
  <li><b>d.</b> roll again (step 2). If your last die is discarded with tasks remaining, the adventure is failed: suffer the penalties.</li>
  </ul></li>
<li><b>Adventure resolved:</b> in order — move your marker to the entrance, take the card as a trophy and replace it${c.mode !== "museum" ? " from the current Adventure deck" : ""} (Other Worlds are not replaced), then gain its rewards (so a “monster appears” reward can land on the replacement card). Then go to the Clock phase.</li>
</ol>
<h4>III. Clock phase</h4>
<ul>
${(c.mode === "alaska" || c.mode === "rlyeh" || c.mode === "pyramid") ? "<li>If at the entrance, you may resolve its ability (spend trophies etc.) before advancing the clock — the benefit can go to <b>any one</b> investigator, including you.</li>" : ""}
<li>You may play spells/items with no timing trigger before advancing the clock.</li>
<li><b>Advance the clock 3 hours.</b> Midnight does not happen during your turn: it resolves <b>immediately after</b> any turn in which the hand reached or passed XII.</li>
</ul>
<p class="src-line">FAQ p.2–3 (turn structure), p.4–5 · Base p.5–9</p>` },

  { id: "dice", title: "The Dice",
    when: () => true,
    html: (c) => `
<ul>
<li><b>Green ×6</b> — faces: 1, 2, 3 investigations · lore · peril · terror. The default pool.</li>
<li><b>Yellow</b> — like green but <b>4 investigations replaces terror</b>. Usually added by spending a <b>Common Item</b>.</li>
<li><b>Red</b> — like yellow but a <b>wildcard replaces 1 investigation</b>. Usually added by spending a <b>Unique Item</b>. The wildcard may be used as lore, peril, terror or a <b>4-investigation</b> result (the base rulebook's “1 investigation” is errata'd).</li>
${c.has("uf") ? `<li><b>White</b> — same faces as green. Added to your pool at the start of every adventure while <b>Blessed</b>; behaves like any normal die.</li>
<li><b>Black</b> — same faces as green, but rolled while <b>Cursed</b>: after each roll (and all rerolls/abilities), if it matches any die in your pool, discard the black die <i>and</i> one matching die. It can't be assigned to tasks, secured, discarded for a failed roll, or altered by any effect.</li>` : ""}
<li>Dice added by items stay in the pool until used on a task, set aside from a failed roll, or your turn ends. A die discarded after a failed roll is <b>gone for the rest of that Resolution phase</b> — it cannot be re-bought with another item${c.has("ootp") ? " (Relics are the sole exception)" : ""}.</li>
<li><b>Locked dice:</b> when a locked die icon appears on a card or marker, the matching die is immediately trapped on it (even off a Spell or investigator marker, but never off another lock). Free it by resolving that card. A die can queue behind multiple locks.</li>
</ul>
<p class="src-line">Base p.6, p.11 · FAQ p.2 (wildcard), p.8 (locked dice, red/yellow)${c.has("uf") ? " · UF p.2–3" : ""}</p>` },

  { id: "tasks", title: "Tasks: Symbols, Completing & Failing",
    when: () => true,
    html: (c) => `
<ul>
<li>Each horizontal row on an Adventure is a <b>task</b>; complete every task to resolve the card. You may complete only <b>one task per roll</b>, in any order unless the card has an <b>arrow</b> (top-to-bottom required).</li>
<li><b>Number symbol</b>: that many investigation pips (combine dice; excess is wasted). <b>Lore / Peril / Terror symbols</b>: one die showing that face. <b>Split symbol</b>: either shown result works.</li>
<li><b>Clock symbol</b>: completing the task forces you to <b>advance the clock</b>. <b>Sanity/Stamina numbers</b>: completing the task costs that much sanity/stamina — you may not complete a task that would drop you to 0 or below (Whiskey/Food can pay a 1-point cost instead).</li>
${c.has("uf") ? "<li><b>Cursed symbol</b> (UF): completing the task makes you Cursed. <b>Doom symbol</b> (UF): completing the task adds 1 doom.</li>" : ""}
${c.mode === "streets" ? "<li><b>Gate symbol</b> (GoA): completing the task opens a gate. <b>Membership tasks</b>: if you belong to the matching organization, the task counts as complete with no dice; a monster on it returns to the cup.</li>" : ""}
<li><b>Rolling with no requirements:</b> you must still roll your pool before completing a task with no dice requirements.</li>
<li><b>Monster tasks:</b> a white-bordered row is a monster task — empty ones are ignored until a monster sits there. Monsters on cards must be beaten as extra tasks (see Monsters).</li>
<li><b>Failing a roll:</b> Terror effect (once per attempt, if any terror was rolled) → optional focus/assist (one die per roll, max; an investigator marker holds only one die) → discard one die → roll again. Assisting investigators whose die goes unused when the adventure is abandoned lose 1 sanity or 1 stamina.</li>
<li><b>Focus/assist</b> is only allowed after a roll that <b>failed</b> to complete a task, and only <b>once per Resolution phase</b> for focusing. You cannot both focus and request assistance on the same roll.</li>
</ul>
<p class="src-line">Base p.5–8, p.10 · FAQ p.9 (focus/assist), p.5 · UF p.4 · GoA p.4</p>` },

  { id: "rewards", title: "Rewards & Penalties — Icon Glossary",
    when: () => true,
    html: (c) => {
      const rows = [
        ["base", "Common Item / Unique Item / Spell / Ally", "Draw 1 card from that deck per icon."],
        ["base", "Clue", "Gain 1 Clue token (spend after any roll to reroll any of your dice; repeatable)."],
        ["base", "Elder Sign", "Add 1 Elder Sign token to the Ancient One. Reaching its Elder Sign Limit <b>wins the game immediately</b>."],
        ["base", "Gate", "Draw 1 Other World Adventure card into play" + (c.mode === "streets" ? " — in Streets of Arkham, <b>open a gate</b> instead" : "") + "."],
        ["base", "Monster", "A monster appears (see Monsters)."],
        ["base", "Doom", "Add 1 doom token to the doom track."],
        ["base", "Sanity / Stamina", "Lose that much Sanity / Stamina."]
      ];
      if (c.has("uf")) rows.push(
        ["uf", "Blessed / Cursed", "Become Blessed / Cursed."],
        ["uf", "Reprieve", "Remove 1 doom token from the doom track."],
        ["uf", "Clock", "Advance the clock once."]);
      if (c.has("goa") || c.has("ootd")) rows.push(["goa", "Skill / Lost Skill", "Draw 1 Skill card / discard 1 Skill."]);
      rows.push(["base", "Healing / Respite", "Any one investigator regains 1 stamina / 1 sanity. (Expansion icon.)"],
        ["base", "Expeditious", "Do not advance the clock during your Clock phase this turn. (Expansion icon.)"],
        ["base", "Remove Monster", "Return 1 monster on an adventure to the cup. (Expansion icon.)"],
        ["base", "Lost Item / Spell / Ally", "Discard 1 card of the shown type. (Expansion icon.)"],
        ["base", "Lost Elder Sign", "Remove 1 Elder Sign from the Ancient One — if there are none, add 1 doom instead. (Expansion icon.)"]);
      if (c.mode === "alaska") rows.push(
        ["ooi", "Supply / Lost Supply", "Gain 1 supply / lose 1 supply (if you can't, lose 1 stamina instead)."],
        ["ooi", "Storm", "Add 3 storm markers to adventures."]);
      if (c.mode === "rlyeh") rows.push(
        ["ootd", "Gain / Lost Amulet", "Draw and reveal a broken amulet token / return one to the pile."],
        ["ootd", "Advance / Retreat Omen", "Move the omen token one space right / left on the Dark Waters track."]);
      if (c.mode === "pyramid" || c.mod("exhibit")) rows.push(
        ["ootp", "Gain / Lost Relic", "Draw 1 Relic / discard 1 Relic."]);
      if (c.mode === "pyramid") rows.push(
        ["ootp", "Gain / Lost Expedition Token", "Place 1 expedition token on an empty scenario-sheet space / discard 1 (none left: add 1 doom instead)."]);
      const trs = rows.map(r => `<tr><td class="tag ${ES.expMeta[r[0]].cls}">${ES.expMeta[r[0]].name}</td><td><b>${r[1]}</b></td><td>${r[2]}</td></tr>`).join("");
      return `<p>Rewards sit in the green (lower-right) area of a card, penalties in the red (lower-left). You resolve every icon you are able to; a reward isn't always good, a penalty isn't always bad.</p>
<div class="twrap"><table>${trs}</table></div>
<ul>
<li><b>Split rewards/penalties</b> (diagonal line): choose one group. You cannot choose a penalty you cannot fulfill${(c.has("uf")) ? "; if a split includes a blessing/curse/skill from an expansion you're not using, you must take the other side" : ""}.</li>
<li><b>Trophies:</b> resolved Adventures and defeated monsters are spent at the entrance for their printed value. Overspending is allowed with no change. Spent monsters return to the cup; spent Adventures go under their deck.</li>
</ul>
<p class="src-line">Base p.8 · UF p.4 · GoA p.5 · OoI p.5 · OotD p.5 · OotP p.5 · FAQ p.10</p>`;
    } },

  { id: "entrance", title: "The Entrance",
    when: () => true,
    html: (c) => {
      if (c.mode === "museum" && !c.has("uf")) return `
<p>An investigator at the Entrance sheet performs <b>one</b> of three activities in the Resolution phase:</p>
<ul>
<li><b>Receive First Aid</b> — one of: regain <b>1 Stamina <i>or</i> 1 Sanity</b> for free (FAQ correction: not both); pay 2 trophies to fully restore Stamina <i>or</i> Sanity; pay 4 trophies to fully restore both.</li>
<li><b>Search the Lost &amp; Found</b> — roll a green die and resolve the chart on the sheet. Nothing may modify this roll.</li>
<li><b>Buy a Souvenir</b> — buy exactly one listed object with trophies per visit.</li>
</ul>
<p class="src-line">Base p.8 · FAQ p.4, p.12</p>`;
      if (c.mode === "museum") return `
<p>Unseen Forces replaces the entrance sheet with <b>four Entrance cards</b>, each a separate location offering its own ability. In your Movement phase you may move to any of them; if you are on one in your Resolution phase you <b>must</b> resolve its ability. Effects mentioning “the entrance” mean any Entrance card — if told to move to “the entrance,” pick whichever you like. Some effects <b>close</b> an Entrance card (flip it facedown): you can still stand there, but its ability is off. Investigators return to the <b>“Souvenir Shop”</b> card after resolving adventures, and <b>“The Chapel”</b> is the place to seek a <b>Blessing</b>. Where an Entrance card restates a base-sheet action, remember the FAQ correction: first aid heals 1 Stamina <b>or</b> 1 Sanity for free, not both.</p>
<p class="src-line">UF p.2 · FAQ p.4</p>`;
      if (c.mode === "streets") return `
<p>The <b>Streets of Arkham</b> card replaces the entrance. At the <b>end of your Movement phase</b> there, you may spend <b>2 trophies</b> to do one of the following and then move to an Arkham Adventure of your choice:</p>
<ul>
<li>Flip 1 facedown Arkham Adventure faceup;</li>
<li>Discard 1 Arkham Adventure without a gate, monster, locked die or investigator, and replace it facedown;</li>
<li>Regain 1 stamina and 1 sanity.</li>
</ul>
<p>If you use the ability you <b>must</b> move to an Arkham Adventure (never an Other World). If you don't use it, you may stay on the Streets for the turn. Investigators return here after resolving adventures.</p>
<p class="src-line">GoA p.3 · FAQ p.5</p>`;
      if (c.mode === "alaska") return `
<p>The <b>Expedition Camp</b> replaces the entrance. An investigator there <b>skips the Resolution phase</b>. At the start of their <b>Clock phase</b> they may pay trophies once — the benefit may go to <b>any</b> investigator:</p>
<ul>
<li><b>6</b> — remove up to 5 storm markers from adventures</li>
<li><b>5</b> — gain 1 ally</li>
<li><b>4</b> — gain 1 unique item <i>or</i> 1 clue</li>
<li><b>3</b> — gain 1 common item <i>or</i> 1 spell</li>
<li><b>2</b> — regain 2 stamina <i>or</i> 2 sanity</li>
<li><b>1</b> — discard the top card of the adventure deck</li>
</ul>
<p class="src-line">OoI p.3 (camp card) · FAQ p.3</p>`;
      if (c.mode === "rlyeh") return `
<p><b>“The Ultima Thule”</b> replaces the entrance. An investigator there <b>skips the Resolution phase</b> and may spend trophies at the start of their <b>Clock phase</b> (the benefit may go to any investigator). If <b>four or more Deep One Legions</b> are ever in play, the ship <b>sinks immediately</b>: flip the card to “Wreckage of the Ultima Thule” (a weaker entrance) for the rest of the game — and the game advances to Stage II.</p>
<p class="src-line">OotD p.3 · FAQ p.5</p>`;
      return `
<p>The double-sided <b>Cairo / Dashur</b> card replaces the entrance; the faceup side is where investigators return after adventures, and determines <b>which Adventure deck replacements are drawn from</b> (Cairo → Stage I, Dashur → Stage II). An investigator there skips their Resolution phase; in their <b>Clock phase</b> they may spend trophies on that side's options — or <b>advance the clock</b> to flip the card to the other side. Gather supplies in Cairo, but the Elder Signs are in Dashur.</p>
<p class="src-line">OotP p.3</p>`;
    } },

  { id: "midnight", title: "Midnight & “At Midnight” Effects",
    when: () => true,
    html: (c) => `
<ul>
<li>Midnight is <b>not part of a player's turn</b>: it resolves immediately <b>after</b> any turn in which the clock hand reached or passed XII.</li>
<li>If the clock passes midnight <b>more than once in the same turn</b>, each extra midnight adds <b>1 doom token</b> — but you do <b>not</b> draw another Mythos card or re-resolve “At Midnight” effects.</li>
<li>“At Midnight” effects trigger even if no investigator is on the card. They do <b>not</b> occur during setup, and they stop entirely once the Ancient One awakens.</li>
</ul>
<h4>Order of operations at midnight</h4>
<ol>
${c.mode === "alaska" ? "<li><b>Advance the day token</b> one space and add the storm markers shown on the new space.</li><li>Add <b>1 doom token per adventure with 4 storm markers</b>.</li>" : ""}
<li>“At Midnight” effects on the <b>Ancient One</b>;</li>
<li>… on <b>monsters</b> (investigators choose the order);</li>
<li>… on <b>Adventure and Other World cards</b> (investigators choose)${c.mode === "pyramid" ? " — but skip any Dark Pharaoh adventure that entered play earlier this same midnight" : ""};</li>
<li>… on <b>other cards</b> (investigators choose);</li>
<li>“The next time the clock strikes midnight…” effects on the current Mythos card;</li>
<li><b>Draw and resolve a new Mythos card</b>${c.mode === "alaska" ? " — a group dilemma: choose one of its two options, and never the bottom option unless you can resolve it entirely" : ""}${c.mode === "rlyeh" || c.mode === "pyramid" ? " — a group dilemma: choose either of its two options, even one that would have no effect" : ""}${c.mode === "museum" && c.has("uf") ? " — on a card with the <b>insight icon</b>, the group chooses the top or bottom option (never one with no effect; if the group can't agree, the player who took the last turn before midnight decides)" : ""};</li>
<li>Refresh all <b>“Once per day”</b> abilities.</li>
</ol>
<p class="src-line">FAQ p.3, p.11–12${c.mode === "alaska" ? " · OoI p.6" : ""}${c.mode === "rlyeh" ? " · OotD p.5–6" : ""}${c.mode === "pyramid" ? " · OotP p.5–6" : ""}</p>` },

  { id: "monsters", title: "Monsters",
    when: () => true,
    html: (c) => `
<ul>
<li>When “a monster appears,” draw one marker from the cup and place it on a <b>monster task</b> — an empty one replaces that task; a <b>total</b> monster task is fully covered; a <b>partial</b> one covers only the white-bordered symbols and adds its own requirements to the rest.</li>
<li>If no empty monster task exists, place the monster <b>below the bottom task</b> of an Adventure — distributing monsters <b>as evenly as possible</b> across adventures (no card gets a second bottom monster until every card has one). A monster added to the bottom counts as the card's <b>last task</b> if there's an arrow. Exception: “a monster appears <b>here</b>” effects ignore evenness and land on the current adventure.</li>
<li>Defeating a monster's task claims the marker as a trophy (flip it facedown until the adventure ends — dice locked by it stay until the Resolution phase ends; a <b>discarded</b> monster frees its die immediately). You keep the monster trophy even if you then fail the adventure, and gain any reward on the marker's back.</li>
<li>Items/spells that “defeat” a monster satisfy all its requirements (including sanity/stamina) and claim it at the end of the phase; <b>discarding</b> a monster just returns it to the cup — no trophy, and requirements under it reopen.</li>
${c.has("uf") ? "<li><b>Monster order arrow</b> (Wizard Whateley): once placed, that card's tasks must be done top-to-bottom, ending with the monster.</li>" : ""}
${c.mode === "rlyeh" ? "<li><b>Deep One Legions</b> live in their own stockpile, never the cup. When defeated, pay the cost on the marker's back or the Legion <b>reappears</b> on another adventure. Four Legions in play sink the Ultima Thule. <b>Missions</b> come from the cup and act like monsters but can't be defeated/discarded by items or spells; complete one, then spend the printed trophy value at your Movement or Clock phase start to gain its reward.</li>" : ""}
${(c.mode === "pyramid" || c.mod("exhibit")) ? "<li><b>Mask monsters</b> are always in the cup in this configuration — they are tough, and several have “At Midnight” effects on their backs (midnight icon in the task list).</li>" : ""}
</ul>
<p class="src-line">Base p.10–11 · FAQ p.3 (placement), p.8–9, p.10${c.mode === "rlyeh" ? " · OotD p.3–4" : ""}${c.mode === "pyramid" || c.mod("exhibit") ? " · OotP p.3" : ""}</p>` },

  { id: "blessed", title: "Blessed & Cursed",
    when: (c) => c.has("uf"),
    html: () => `
<ul>
<li><b>Blessed:</b> add the <b>white die</b> to your pool at the start of every adventure. Only one Blessed card each; blessed again → instead gain 1 clue <i>or</i> draw 1 Common Item, Unique Item or Spell. Discard your Blessed card when you <b>fail an adventure</b> or the Ancient One awakens.</li>
<li><b>Cursed:</b> you must roll the <b>black die</b> with every pool. After each roll (post-rerolls), if it matches another die, discard both. Cursed again while Cursed → <b>devoured</b>. Discard your Cursed card when you <b>successfully resolve an adventure</b> or the Ancient One awakens — but if you were cursed <i>during</i> an adventure, succeeding at that same adventure doesn't count; you must resolve another one.</li>
<li>Becoming Blessed while Cursed (or vice versa) just cancels the old card — you don't gain the new one.</li>
<li>Mid-adventure changes apply the appropriate die from your <b>next</b> roll. A secured white die is lost (with its spell) if the blessing is lost. A black die can never be secured on a spell. The white die is never added during the final battle — it isn't an adventure.</li>
</ul>
<p class="src-line">UF p.2–3 · FAQ p.4 (black-die timing), p.12</p>` },

  { id: "battle", title: "Battling the Ancient One",
    when: () => true,
    html: (c) => `
<ul>
<li>The Ancient One awakens when the <b>last doom space fills</b> (a game effect that awakens it fills the track). Pending rewards/penalties resolve first. If the final doom lands at the same moment as the final Elder Sign, <b>the investigators win</b>.</li>
<li>On awakening: the current Mythos card is discarded (its lingering effect ends; dice locked on it are freed — dice locked on monsters/adventures are <b>removed from the game</b>). All investigator markers move to the Ancient One and cannot leave. “At Midnight” effects and special doom icons no longer function.</li>
${c.mod("epicbattle") ? `<li><b>Epic Battle deck:</b> shuffle it and draw the top card, resolving top to bottom — it dictates whether investigators or the Ancient One strike first, plus battle effects. Investigators attack one per turn, advancing the clock after each; at each midnight the Ancient One attacks and you draw the next Epic Battle card. (If the Ancient One awakens at midnight, draw the first card instead of resolving its attack immediately.)</li>` : `<li>Each turn: <b>Attack the Ancient One</b> — roll your pool against its printed combat task; each completion removes 1 doom token (repeat as long as your dice hold out, once per roll). Then <b>advance the clock</b>; each midnight the Ancient One's <b>attack</b> resolves instead of a Mythos card.</li>`}
<li>You may not focus or assist during the battle, but Items, Spells, Clues, allies and abilities all work. Completing the combat task still requires assigning dice.</li>
<li>A devoured investigator during the battle adds 1 doom and is <b>not replaced</b> (their clock-advance still happens on their turn). All devoured, everyone loses. Remove every doom token — or bank enough Elder Signs — and <b>everyone wins, devoured included</b>.</li>
${c.mode === "alaska" && c.has("gc") ? "" : ""}
</ul>
<p class="src-line">Base p.11–12 · FAQ p.4–5, p.11${c.mod("epicbattle") ? " · Grave Consequences cards 3/5–5/5" : ""}</p>` },

  { id: "devoured", title: "Devoured Investigators & the Doom Track",
    when: () => true,
    html: (c) => `
<ul>
<li>Sanity <b>or</b> stamina at 0 or less devours an investigator${c.mod("phobia") ? " — <b>unless the Phobia deck saves them</b>: draw a Phobia instead, restore sanity to full, add 1 doom (a stamina KO still devours; a fourth Phobia devours; after the Ancient One awakens, phobias no longer save you)" : ""}. Add <b>1 doom token</b>, return the investigator card/marker to the box, return items, allies and Adventure trophies facedown to the bottoms of their decks, monster trophies to the cup, clues to the pool.${c.mod("epitaph") ? " Draw an <b>Epitaph card</b>, resolve it, and stand the investigator token on it facedown near the play area." : ""}</li>
<li>The player then takes a <b>new investigator</b> (never one devoured this game) with full starting kit, beginning next turn — unless the Ancient One has awoken, or no investigators remain.</li>
<li>The doom track <b>can never hold more tokens than it has spaces</b> — overflow doom (multi-doom effects, devoured investigators during the battle) is discarded. Special doom icons (monster, gate, storm…) trigger when covered during the game, but <b>never during the final battle</b>.</li>
<li>Doom is only added when an effect says so — never automatically at midnight.</li>
</ul>
<p class="src-line">Base p.11 · FAQ p.4, p.11${c.mod("phobia") || c.mod("epitaph") ? " · Grave Consequences cards 2/5–3/5" : ""}</p>` },

  /* --- mode-specific deep reference --- */
  { id: "mode-streets", title: "Streets of Arkham: Gates, Events, Skills & Memberships",
    when: (c) => c.mode === "streets",
    html: () => `
<h4>Facedown adventures & difficulty</h4>
<ul>
<li>Arkham Adventures enter play <b>facedown</b>; the top of each card back shows difficulty (green easy · yellow normal · red hard) and the deck's top card back is open information.</li>
<li>Moving onto a facedown card: resolve the effect on its back, flip it faceup, resolve any Entry effect, and end your Movement phase. “At Midnight” text on backs triggers only while facedown at midnight.</li>
</ul>
<h4>Gates</h4>
<ul>
<li>Effects <b>open gates</b>: draw the top Other World card facedown below the Arkham row, place one gate marker of a color on it and the matching marker on an Arkham Adventure without a gate or seal. Investigators there move to the Streets.</li>
<li>You cannot move to an Arkham Adventure with a gate; you can enter the gated <b>Other World</b> (flipping it faceup ends your Movement phase). Max 3 gates open at once; if no markers remain, a monster appears instead. If markers remain but every adventure is gated/sealed, remove all seals, add 1 doom, and open the gate normally.</li>
<li><b>Closing:</b> resolving an Other World with a gate closes it — put a <b>seal marker</b> on the matching Arkham Adventure (no new gates there) and return both gate markers. If an effect discards a gate, the linked Other World is discarded too and the adventure is sealed.</li>
</ul>
<h4>Events, Skills, Memberships</h4>
<ul>
<li><b>Event icon:</b> at the start of your Resolution phase on a card with the icon, draw and resolve an Event card before attempting the adventure.</li>
<li><b>Skills</b> are drawn from rewards, played faceup, and last until their text expires; only their owner uses them.</li>
<li><b>Memberships</b> (Sheldon Gang / Order of the Silver Twilight, mainly from Hibb's Roadhouse or the Lodge): one at a time. A membership task matching your organization counts as <b>complete without dice</b> (a monster on it returns to the cup), and matching membership rewards are gained in addition to the rest.</li>
</ul>
<p class="src-line">GoA p.3–5 · FAQ p.4 (restricted cards), p.6</p>` },

  { id: "mode-alaska", title: "Alaska Expedition: Supplies, Days, Storms & Stages",
    when: (c) => c.mode === "alaska",
    html: (c) => `
<h4>Supplies & days</h4>
<ul>
<li>The <b>supply track</b> holds your provisions (the ±10 modifier tokens roll the track over). The Track card punishes an empty larder: <b>at midnight with 0 supplies, every investigator loses 1 stamina</b> (as printed on the Track card).</li>
<li>The <b>day token</b> advances at every midnight (before other midnight effects), adding the storm markers shown on the new space. End of Day 7: <b>${c.mod("winter") ? "Winter — the investigators lose the game" : "Summer — add 2 doom, reset to Day 7 and add 7 storm markers"}</b>.</li>
</ul>
<h4>Storm markers</h4>
<ul>
<li>Placed facedown from the pile onto adventures (max 4 per adventure; never on Other Worlds or Special Adventures). If placing during your own Resolution phase, not on your own adventure unless all others are full.</li>
<li>At the start of your Resolution phase on a stormy adventure, flip all its markers and resolve the revealed penalties in any order (blanks do nothing); markers then return facedown to the pile.</li>
<li>At midnight, each adventure holding 4 storm markers adds <b>1 doom token</b>.</li>
</ul>
<h4>Stages & specials</h4>
<ul>
<li>Alaskan Adventures enter play facedown (difficulty color on the back; top of deck is open information). Facedown arrival: resolve the back, flip, resolve Entry, end Movement.</li>
<li><b>Special Adventures</b> can't be discarded and never hold storms/monsters. Completing <b>“Into the Wild”</b> advances to <b>Stage II</b>: discard the Stage I deck, add “Treacherous Ascent,” and draw replacements from Stage II.</li>
<li>Alaskan Mythos cards are group dilemmas: pick one of two options; you may not pick the bottom option unless you can resolve it fully.</li>
</ul>
<p class="src-line">OoI p.3–5 · FAQ p.11 (Mythos options)</p>` },

  { id: "mode-rlyeh", title: "R'lyeh Rising: Dark Waters, the Amulet & the Deep One Legion",
    when: (c) => c.mode === "rlyeh",
    html: () => `
<h4>The Dark Waters track (Stage I)</h4>
<ul>
<li>Game effects <b>advance</b> (right) or <b>retreat</b> (left) the omen token. Advancing off the rightmost space — or choosing its special ability — can push the game to Stage II; hitting either end resolves that space's printed effect.</li>
<li><b>Two ways to Stage II:</b> the Ultima Thule sinks (4 Deep One Legions in play — automatic), or the players trigger the rightmost Dark Waters space (their choice; it can be declined and triggered later).</li>
</ul>
<h4>Stage II: the Amulet of R'lyeh</h4>
<ul>
<li>Flip the scenario card. Place all broken amulet tokens you've gained on their spaces; <b>each empty space locks its matching die</b> on the track. Gaining that amulet piece later frees the die. Locked dice there are lost for good if the Ancient One awakens.</li>
<li>Discard the Stage I deck and Ocean Mythos; use Stage II adventures and the R'lyeh Mythos deck. Add <b>“R'lyeh Risen”</b> faceup (existing Special Adventures stay). Completing <b>“Echoes of the Dream”</b> is the Special-Adventure route to Stage II.</li>
</ul>
<h4>Deep One Legion & missions</h4>
<ul>
<li>Legions come from their stockpile (never the cup); both sides of their markers are open information. Defeat one and <b>pay the cost on its back</b> or it reappears on another adventure. Discarded Legions return to the stockpile; an empty stockpile means no Legion appears.</li>
<li><b>Missions</b> (from the cup) act like monsters but ignore monster-defeating items/spells. A completed mission sits facedown in front of you (not a trophy): fulfill it at the start of your Movement or Clock phase by spending trophies equal to the number on its back to gain its reward.</li>
<li>Pacific adventures enter facedown; Staged Mythos cards are group dilemmas — either option may be chosen, even one with no effect.</li>
</ul>
<p class="src-line">OotD p.3–5 · FAQ p.5 (Stage II), p.10–11</p>` },

  { id: "mode-pyramid", title: "Lightless Pyramid: the Expedition, Relics, Chambers & the Dark Pharaoh",
    when: (c) => c.mode === "pyramid",
    html: () => `
<h4>The Expedition sheet</h4>
<ul>
<li>Gaining an <b>expedition token</b>, place it on any empty sheet space; while there, its effect is available to all. Some effects <b>discard</b> their token to trigger. One token per space; tokens lost to penalties trigger nothing.</li>
</ul>
<h4>Relics</h4>
<ul>
<li>Relics show a die with a <b>refresh icon</b>: discard the Relic before rolling to add that die to your pool <b>even if it was already lost to a failed roll</b> (the only way back in). Component limits still apply. Paired relics have bonus effects.</li>
</ul>
<h4>Hidden Chambers</h4>
<ul>
<li>Hidden Chambers hide in the Stage II Dashur deck. To move to one you must first <b>unlock</b> it: before moving, roll (6 green dice by default; items/clues/effects may help — but never the white or black die) against the task on its back. <b>One roll only.</b> Fail: move elsewhere or stay put. Any added dice are lost either way.</li>
<li>The <b>Chamber effect</b> at the top belongs only to the unlocking investigator, when the card is first flipped. Completed chambers return to the box — they are not trophies. (Paying 3 trophies via Father Mateo can't skip the unlock roll — the task is not an “effect.”)</li>
</ul>
<h4>The Dark Pharaoh</h4>
<ul>
<li>The new doom icon draws a <b>Dark Pharaoh special adventure</b> into play facedown. They can't hold markers and aren't trophies; resolved ones go to their own discard, which reshuffles when a fifth draw is needed. If one must be drawn while <b>all four are already in play, the doom track fills and the Ancient One awakens immediately</b>.</li>
<li>Egyptian adventures enter facedown; replacements come from the deck matching the faceup entrance side (Cairo → Stage I, Dashur → Stage II). Mythos cards are group dilemmas — either option may be chosen, even with no effect.</li>
</ul>
<p class="src-line">OotP p.3–5 · FAQ p.9 (Relics/locked dice), p.11–12</p>` },

  { id: "rulings", title: "Rulings Worth Remembering (FAQ v2.0)",
    when: () => true,
    html: (c) => `
<ul>
<li>You <b>must roll</b> your pool even for a task with no dice requirements — spells, curses and effects still resolve.</li>
<li>An investigator starting their Resolution phase on an adventure <b>must attempt it</b> (or declare it failed before the first roll).</li>
<li><b>Spending a Clue</b> = reroll one, some or all pool dice; chain as many clues as you like. Clues are spent after rolling, before spell-securing decisions. Clue tokens can't be used on other players' turns; items/spells/allies also only on your own turn unless stated.</li>
<li><b>Spell-secured dice</b>: cast after a roll; a secured result can't be altered further. Anyone may later use dice on a spell to complete a task. A secured terror never triggers Terror effects. A spell with no dice left is discarded. Removing a red/yellow die from a spell to <i>reroll</i> requires being eligible for it (an item, etc.), but <i>using</i> its secured result is free.</li>
<li><b>“Once per day”</b> = until the next midnight; refreshed after the new Mythos card. “Once per roll” = once per roll on your own turn; clue rerolls don't reset it.</li>
<li><b>Whiskey / Food</b> can pay a task's 1-sanity/1-stamina cost instead of losing the point.</li>
<li>First Aid at the entrance heals 1 stamina <b>or</b> 1 sanity for free — the sheet is right, the old rulebook text isn't.</li>
<li><b>Hastur:</b> “X” in his battle task = monsters in play when the last doom token was added (min 1).</li>
<li><b>Yig</b> loses you an Elder Sign whenever an investigator defeats any “Cultist” monster — but not when a spell or item does the defeating.</li>
${c.has("uf") ? "<li><b>Shub-Niggurath</b> adds a one-terror task to every monster marker. <b>Shudde M'ell</b> frees locked dice when his ability discards the adventure locking them; “Fresh Start” refreshes to 6 adventures but doesn't end his game.</li>" : ""}
${c.mode === "museum" ? "<li><b>The Stars Align…Above an Open Door</b> is the only Mythos card whose effect outlives midnight (its extra Adventure card stays until completed).</li>" : ""}
</ul>
<p class="src-line">FAQ p.5–12</p>` },

  { id: "roster", title: "Ancient One Roster",
    when: () => true,
    html: (c) => {
      const rows = [];
      rows.push(["base", "Azathoth · Cthulhu · Hastur · Ithaqua · Nyarlathotep · Shub-Niggurath · Yig · Yog-Sothoth", "The eight originals. Nyarlathotep brings the mask monsters; Cthulhu's attack reduces max sanity/stamina (errata'd wording in FAQ)."]);
      if (c.has("uf")) rows.push(["uf", "4 new Ancient Ones, including Abhoth and Shudde M'ell", "Abhoth spawns his Children from a stockpile next to his card; Shudde M'ell's World Cracking discards failed adventures (freeing their locked dice)."]);
      if (c.has("goa")) rows.push(["goa", "Yibb-Tstll (easy) · Ghatanothoa (average) · Atlach-Nacha (hard) · Yog-Sothoth, Lurker at the Threshold (insane)", "Each has the gate doom icon: doom landing on it opens a gate in Streets of Arkham — in any other mode, each investigator loses 1 sanity instead."]);
      if (c.has("ooi")) rows.push(["ooi", "Rhan-Tegoth (average) · Rlim-Shaikorth (hard) · Ithaqua, alt (insane)", "The Alaska Expedition's dedicated trio — the mode's setup chooses among these."]);
      if (c.has("ootd")) rows.push(["ootd", "Hydra (average) · Dagon (hard) · Cthulhu, alt (insane)", "Each has the Deep One Legion doom icon."]);
      if (c.has("ootp")) rows.push(["ootp", "Haunter of the Dark (average) · Nephren-Ka (hard) · Nyarlathotep, alt (insane)", "Each has the Dark Pharaoh doom icon; the alt Nyarlathotep has his own mask-monster setup."]);
      const trs = rows.map(r => `<tr><td class="tag ${ES.expMeta[r[0]].cls}">${ES.expMeta[r[0]].name}</td><td><b>${r[1]}</b></td><td>${r[2]}</td></tr>`).join("");
      return `<div class="twrap"><table>${trs}</table></div>
<p class="src-line">Base p.4 · UF p.1 · GoA p.6 · OoI p.6 · OotD p.6 · OotP p.6</p>`;
    } }
];


/* ---- TEACHING SCRIPT (read aloud, ~5 min; content per the base Rules of Play,
   the expansion rulebooks and FAQ v2.0 — see references for citations) ------- */
ES.teach = {
  intro: "Read this aloud — about five minutes. Dice down until the end.",
  sections: [
    { h: "The pitch — and how we win", body: (c) => {
      const place = { museum: "in a haunted museum at midnight", streets: "across the streets of Arkham", alaska: "on an expedition into the Alaskan wilderness", rlyeh: "aboard the Ultima Thule in the Pacific", pyramid: "between Cairo and the tombs of Dashur" }[c.mode];
      return `
<p>We're investigators ${place}, and an <b>Ancient One</b> is clawing its way into our world. We win the moment we collect the number of <b>Elder Signs</b> printed on its sheet. It wins doom tokens through events and our failures — fill its <b>Doom track</b> and it <b>awakens</b>: then we fight it dice-in-hand, or die.</p>
<p>This is fully cooperative. Talk, plan, and share — the game is the enemy.</p>`;
    }},

    { h: "The shape of a turn", body: (c) => `
<p>Your turn is quick: <b>move</b> anywhere — any Adventure card in play or the entrance — then <b>resolve</b> where you are: attempt the Adventure, or use an entrance action to heal and shop. Finally <b>advance the clock 3 hours</b>. Every time the clock strikes <b>midnight</b> — every four turns — a <b>Mythos card</b> hits us and “At Midnight” effects fire. Midnight is the drumbeat; everything we do races it.</p>` },

    { h: "The dice — the heart of the game", body: (c) => `
<p>Attempting an Adventure: roll the <b>six green dice</b>${c.has("uf") ? " (plus the white die if you're Blessed — and the black one if you're Cursed)" : ""} and try to complete <b>one task</b> — one row of symbols — per roll. Complete every row and the Adventure is yours. Fail to match a row and you must <b>throw away a die</b> and roll again — the pool shrinks until you triumph or run dry.</p>
<p>Your tools: <b>Clue tokens</b> reroll dice; <b>Common and Unique Items</b> add the stronger yellow and red dice; <b>Spells</b> freeze a good result for later; <b>focusing</b> (or a friend on the same card assisting) saves one die from a bad roll. Choose Adventures your pool can actually beat — the rewards tell you what's worth the risk.</p>` },

    { h: "Rewards, penalties & trophies", body: (c) => `
<p>Every Adventure card shows its price and its prize: fail and take the red penalties (sanity, stamina, doom…); succeed and take the green — <b>items, allies, Clues, and the Elder Signs we're here for</b>. Resolved Adventures and slain monsters become <b>trophies</b> you spend at the entrance for healing and gear. Monsters that appear squat on Adventure cards as extra tasks — someone has to go be the hero.</p>` },

    { h: "Doom, midnight & the Ancient One", body: (c) => `
<p>Mythos cards add doom, spawn monsters, and curse the room. If the Doom track ever fills, the Ancient One <b>awakens</b>: every investigator is dragged into the final battle, rolling against its combat task to strip doom tokens away${c.mod("epicbattle") ? " — with the Epic Battle deck directing each round of the fight" : ""}. It's winnable, barely. Better plan: don't let it wake up.</p>
<p>If your <b>sanity or stamina</b> hits zero, you're devoured — new investigator, one doom token to the enemy${c.mod("phobia") ? " (with the Phobia deck, a sanity break gives you a permanent Phobia instead — until the fourth one)" : ""}.</p>` },

    { h: "This mode's twist", when: (c) => c.mode !== "museum", body: (c) => {
      if (c.mode === "streets") return `<p><b>Streets of Arkham:</b> half the Adventures are facedown — walking onto one flips it, for better or worse. Success can open <b>gates</b> to Other Worlds that must be entered and sealed, <b>Events</b> trigger where you stand, and joining the <b>Sheldon Gang or the Lodge</b> auto-completes their tasks. The Streets card itself lets you pay 2 trophies to fix the board.</p>`;
      if (c.mode === "alaska") return `<p><b>Alaska Expedition:</b> we manage <b>supplies</b> (zero at midnight hurts everyone) and a <b>day track</b> — ${c.mod("winter") ? "it's Winter: Day 7 ends and we lose" : "Summer forgives one overtime, at a price"}. <b>Storms</b> pile onto Adventures and punish whoever resolves them; four storms on a card feeds doom. The trek is staged: finish “Into the Wild” to reach Stage II and the endgame.</p>`;
      if (c.mode === "rlyeh") return `<p><b>R'lyeh Rising:</b> Stage I is the voyage — manage the <b>Dark Waters track</b> and the <b>Deep One Legion</b>: four Legions in play <b>sink our ship</b>. Stage II reveals the broken <b>Amulet of R'lyeh</b>: every piece we haven't recovered locks one of our dice for the rest of the game. Collect amulet pieces like your dice depend on it, because they do.</p>`;
      return `<p><b>Lightless Pyramid:</b> the entrance flips between <b>Cairo</b> (supplies, easier cards) and <b>Dashur</b> (the Elder Signs) — flipping costs clock time. <b>Relics</b> are the best items in the game: they can re-buy a die you already lost. <b>Hidden Chambers</b> demand an unlock roll before you may even enter, and the <b>Dark Pharaoh</b> adventures stack up: if a fifth must appear, the Ancient One wakes instantly.</p>`;
    }},

    { h: "Don't worry about these yet", body: (c) => {
      const later = ["exact monster placement", "locked dice"];
      if (c.has("uf")) later.push("Blessed and Cursed dice");
      if (c.mod("master")) later.push("the red-bordered Master Mythos cards");
      if (c.mod("exhibit")) later.push("the Exhibit's Relic shop");
      return `<p>I'll explain ${later.join(", ")} when they first appear. Opening advice: spend Clues freely — a Clue saved is usually a turn wasted — and always know what today's midnight is about to do.</p>`;
    }}
  ]
};
