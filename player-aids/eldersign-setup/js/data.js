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
    blurb: "A two-stage rescue expedition into the Alaskan wilderness. Track supplies and days and weather storms — in Summer, every day past Day 7 costs doom and storms; in Winter, you lose when Day 7 ends.",
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
    src: "Unseen Forces p.1–2, p.4" },
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
    src: "Omens of Ice p.2–3" },
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
          bits.push(c.mode === "alaska" ? "<li><b>Investigators</b> from every set you selected go into one pool (this mode uses only the three Omens of Ice Ancient Ones — see the Ancient One step).</li>" : "<li><b>Investigators</b> and <b>Ancient Ones</b> from every set you selected go into their shared pools.</li>");
          bits.push("<li><b>Common Items, Unique Items, Spells and Allies</b> from every selected set shuffle into their base-game decks.</li>");
          bits.push("<li><b>Other World cards</b> from every selected set shuffle into one Other World deck" + (c.mode === "museum" && c.has("uf") ? "; Unseen Forces' <b>Adventure</b> and regular <b>Mythos</b> cards shuffle into the base Adventure and Mythos decks" : "") + ".</li>");
          if (c.has("goa") || c.has("ootd")) bits.push("<li><b>Skill cards</b> (Gates of Arkham / Omens of the Deep) shuffle together into one Skill deck.</li>");
          bits.push("<li><b>Monster markers</b> from every selected set join the base-game monsters (mask monsters and Children of Abhoth are set aside here and handled in the monster cup step" + (c.has("ootd") ? "; Omens of the Deep's <b>Deep One Legion</b> markers form their own stockpile and never go in the cup" : "") + ").</li>");
          if (c.mode === "museum" && (c.has("goa") || c.has("ooi") || c.has("ootd") || c.has("ootp")))
            bits.push("<li>The mode-specific decks stay in their boxes: Arkham/Alaskan/Pacific/Egyptian Adventures, their Mythos decks, entrance, track and scenario cards are <b>only</b> used in their own game modes" + (c.mod("exhibit") ? " — except The Exhibit sheet and the Dark Pharaoh special adventures, which The Exhibit brings in" : "") + ".</li>");
          if (c.mode !== "museum")
            bits.push("<li>Adventure and Mythos cards from sets other than the mode you're playing stay in the box — each game mode uses <b>only its own</b> Adventure and Mythos decks" + (c.mod("exhibit") ? " (The Exhibit's Dark Pharaoh special adventures are the exception)" : "") + ".</li>");
          if (c.has("goa") && c.mode !== "streets")
            bits.push("<li>Remove the Gates of Arkham cards and tokens marked with the <b>restriction (!) icon</b> — including the <i>Luck</i> and <i>Wanderlust</i> skills and the <i>Ancient Egypt</i>, <i>Far Side of the Moon</i> and <i>The Vaults of Zin</i> Other Worlds — they are Streets of Arkham only.</li>");
          if (c.has("ootp") && c.has("goa")) bits.push("<li>Omens of the Pharaoh's <b>Calvin Wright investigator</b> replaces the Calvin Wright Ally card from Gates of Arkham — remove that Ally from the deck.</li>");
          if (c.has("ooi") && c.mode !== "alaska") bits.push("<li>Omens of Ice's <b>storm markers</b> aren't Alaska-only: keep them in a facedown pile — its Ancient Ones' storm doom icon places them.</li>");
          if (c.has("ootp") && c.mode !== "pyramid" && !c.mod("exhibit")) bits.push("<li>Keep Omens of the Pharaoh's four <b>Dark Pharaoh special adventures</b> shuffled nearby — " + (c.mode === "alaska" ? "other game effects can bring them into play (its Ancient Ones, and their doom icon, aren't used in this mode)" : "its Ancient Ones' doom icon draws them into play") + ".</li>");
          return "<ul>" + bits.join("") + "</ul>";
        },
        src: "UF p.2 · GoA p.2 · OoI p.2,5 · OotD p.2,6 · OotP p.2,4–5 · FAQ p.4",
        when: (c) => c.has("uf") || c.has("goa") || c.has("ooi") || c.has("ootd") || c.has("ootp") },
      { exp: "gc",
        t: "Choose your Grave Consequences decks",
        d: (c) => {
          const on = ["phobia", "epitaph", "epicbattle"].filter(m => c.mod(m));
          const names = { phobia: "Phobia", epitaph: "Epitaph", epicbattle: "Epic Battle" };
          if (!on.length) return "Grave Consequences is on the table but none of its three decks is selected above. At the start of the game, players agree which of the Phobia, Epitaph and Epic Battle decks to use — any combination works with any other expansion.";
          const now = on.filter(m => m !== "epicbattle");
          return "All players agree to use the selected deck" + (on.length > 1 ? "s" : "") + ": <b>" + on.map(m => names[m]).join(", ") + "</b>." + (now.length ? " Shuffle the " + now.map(m => "<b>" + names[m] + "</b>").join(" and ") + " deck" + (now.length > 1 ? "s" : "") + " and place " + (now.length > 1 ? "them" : "it") + " beside the play area." : "") + (c.mod("epicbattle") ? " Set the <b>Epic Battle</b> deck aside: when the Ancient One awakens, shuffle it and place it next to the Ancient One card." : "");
        },
        src: (c) => "Grave Consequences cards 1/5–" + (c.mod("epitaph") || c.mod("epicbattle") ? "3/5" : "2/5"),
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
        src: "Gates of Arkham p.2, steps 6–7; p.3 · Base p.5, step 1",
        when: (c) => c.mode === "streets" },
      { exp: "mode",
        t: "Set up the Clock, Expedition Camp and Track card",
        d: (c) => "Place the <b>Clock</b> in the center of the table on <b>XII</b> with all dice near it. Replace the entrance sheet with the <b>Expedition Camp</b> entrance card. Place the <b>Track card</b> with the <b>" + (c.mod("winter") ? "Winter" : "Summer") + "</b> side faceup near the play area: put the <b>“+10” supply token on the “5” space</b> of the supply track (top) — 15 supplies — and the <b>day token on “Day 1”</b> of the day track (bottom). Place the 28 <b>storm markers</b> randomly in a facedown pile.",
        src: "Omens of Ice p.2, steps 4–6 · Base p.5, step 1",
        when: (c) => c.mode === "alaska" },
      { exp: "mode",
        t: "Set up the Clock, the Ultima Thule and the Dark Waters",
        d: "Place the <b>Clock</b> in the center of the table on <b>XII</b> with all dice near it. Replace the entrance sheet with <b>“The Ultima Thule”</b> entrance card, <b>“The Ultima Thule”</b> side faceup (not “Wreckage of the Ultima Thule”). Place the <b>Scenario card</b> Dark Waters side up and put the <b>omen token on the starting space</b> of the Dark Waters track. Place the <b>broken amulet tokens</b> randomly in a facedown pile — then the investigators, as a group, <b>gain 1 broken amulet token</b> (draw, reveal, and set it by the scenario card).",
        src: "Omens of the Deep p.2, steps 1–2, 8; p.5 · Base p.5, step 1",
        when: (c) => c.mode === "rlyeh" },
      { exp: "mode",
        t: "Set up the Clock, Cairo and the Expedition",
        d: "Place the <b>Clock</b> in the center of the table on <b>XII</b> with all dice near it. Replace the entrance sheet with the double-sided <b>Cairo / Dashur entrance card, “Cairo” side faceup</b>. Place <b>“The Expedition” scenario sheet</b> near the play area with the 8 <b>expedition tokens</b> beside it.",
        src: "Omens of the Pharaoh p.2, steps 1–2 · Base p.5, step 1",
        when: (c) => c.mode === "pyramid" },
      { exp: "ootp",
        t: "Add The Exhibit scenario sheet",
        d: "Place <b>“The Exhibit”</b> scenario sheet beside the entrance. It adds an effect to the current entrance (it is not a space investigators can move to): spending trophies there acquires <b>Relic</b> cards. Shuffle the <b>Relic deck</b> near the other card decks, and shuffle the four <b>Dark Pharaoh special adventure</b> cards into a facedown pile near the Adventure deck.",
        src: "Omens of the Pharaoh p.2 (steps 4, 8), p.4",
        when: (c) => c.mod("exhibit") && c.mode !== "pyramid" },

      /* --- Step 2: Ancient One --- */
      { exp: "base",
        t: "Choose the Ancient One",
        d: (c) => {
          let d = "Select an <b>Ancient One</b> card — at random, or by choice if all players agree — and place it next to the clock.";
          if (c.mode === "alaska") d = "Choose one of the three Omens of Ice Ancient Ones to challenge: <b>Rhan-Tegoth</b> (average), <b>Rlim-Shaikorth</b> (hard) or <b>Ithaqua</b> (insane). Place its card next to the clock.";
          if (c.mode === "rlyeh") d = "Choose an <b>Ancient One</b> to challenge and place it next to the clock. (Omens of the Deep's own three are <b>Hydra</b> (average), <b>Dagon</b> (hard) and <b>Cthulhu</b> (insane); each has the Deep One Legion doom icon.)";
          if (c.mode === "pyramid") d = "Choose any <b>Ancient One</b> to challenge and place it next to the clock. For your first Lightless Pyramid game the expansion recommends one of its own: <b>Haunter of the Dark</b> (average), <b>Nephren-Ka</b> (hard) or <b>Nyarlathotep</b> (insane).";
          return d;
        },
        src: (c) => c.mode === "alaska" ? "Omens of Ice p.2, step 7; p.6" : c.mode === "rlyeh" ? "Omens of the Deep p.2, step 3; p.5–6" : c.mode === "pyramid" ? "Omens of the Pharaoh p.2, step 3; p.6" : "Base p.5, step 2",
        when: () => true },

      /* --- Step 3: monster cup --- */
      { exp: "base",
        t: "Prepare the monster cup",
        d: (c) => {
          const bits = ["Place the monster markers in the box lid or another opaque container — the <b>monster cup</b>."];
          if (c.mode === "pyramid") {
            bits.push("Add <b>all mask monster markers</b> from every set in play to the cup — in the Lightless Pyramid they are always in play. <b>Exception:</b> if you are facing the Omens of the Pharaoh version of <b>Nyarlathotep</b>, follow the mask-monster instructions on his card instead.");
          } else if (c.mod("exhibit")) {
            bits.push("Because The Exhibit is in play, add <b>all mask monster markers</b> to the cup as well. <b>Exception:</b> if you are facing the Omens of the Pharaoh version of <b>Nyarlathotep</b>, follow the mask-monster instructions on his card instead.");
          } else {
            bits.push("If <b>Nyarlathotep</b> is the Ancient One, add the <b>mask monster markers</b> to the cup; otherwise return them to the box." + (c.has("ootp") ? " (The Omens of the Pharaoh <b>Nyarlathotep</b> instead follows the mask-monster instructions on his card.)" : ""));
          }
          if (c.has("uf")) bits.push("If <b>Abhoth</b> is the Ancient One, place the 3 <b>Children of Abhoth</b> markers in a facedown stockpile next to his card (never in the cup); otherwise return them to the box.");
          if (c.mode === "rlyeh") bits.push("Add the 5 <b>mission markers</b> to the monster cup, and set the 15 <b>Deep One Legion</b> markers aside as a separate stockpile — they never go in the cup.");
          else if (c.has("ootd")) bits.push("Add the 5 Omens of the Deep <b>mission markers</b> to the cup as well; its 15 <b>Deep One Legion</b> markers stay out of the cup as their own stockpile.");
          return bits.join(" ");
        },
        src: (c) => {
          const s = ["Base p.5, step 3"];
          if (c.has("uf")) s.push("UF p.2, step 7 · p.4");
          if (c.mode === "rlyeh") s.push("OotD p.2, steps 4–5");
          else if (c.has("ootd")) s.push("OotD p.3–4, p.6");
          if (c.mode === "pyramid") s.push("OotP p.2, step 5 · p.3");
          else if (c.mod("exhibit")) s.push("OotP p.3–4");
          else if (c.has("ootp")) s.push("OotP p.3");
          return s.join(" · ");
        },
        when: () => true },

      /* --- Step 4: adventures, per mode --- */
      { exp: "base",
        t: "Set up the Adventures",
        d: "Shuffle the <b>Adventure deck</b> (not the Other World cards) and deal <b>six cards faceup</b> below the Clock and Entrance in <b>two rows of three</b>. Shuffle the <b>Other World Adventure deck</b> and place both decks near the faceup adventures. If a dealt Adventure shows a <b>locked die icon</b>, immediately place the matching die on that card. If <i>Public Lavatory</i> is dealt, its <b>“when drawn”</b> effect still resolves during setup: two monsters appear there (Kate Winthrop's ability can prevent them).",
        src: "Base p.5, step 4 · FAQ p.5",
        when: (c) => c.mode === "museum" },
      { exp: "mode",
        t: "Set up the Arkham Adventures",
        d: "Replace the Adventure deck with a deck of <b>only the Arkham Adventure cards</b>. Shuffle it <b>under the table</b> (card backs are open information), then deal <b>three cards faceup</b> in a row below the entrance and <b>three cards facedown</b> below them. Shuffle the <b>Other World deck</b> and place both decks nearby. If a faceup Adventure shows a <b>locked die icon</b>, place the matching die on it.",
        src: "Gates of Arkham p.2–3, steps 1 & 8",
        when: (c) => c.mode === "streets" },
      { exp: "mode",
        t: "Set up the Alaskan Adventures",
        d: "Replace the Adventure deck with the <b>Alaskan Adventures</b>: set the four <b>Special Adventure</b> cards aside, separate the rest by stage, and shuffle a <b>Stage I</b> and a <b>Stage II</b> deck (Stage I under the table — backs are open information). Deal <b>three Stage I cards faceup</b> in a row and <b>three facedown</b> below them, then place the <b>“Arrival” Special Adventure faceup</b> below the bottom row. Shuffle the <b>Other World deck</b>; set the Stage II deck aside. Locked die icons on faceup cards get their dice.",
        src: "Omens of Ice p.2, steps 2 & 8; p.3",
        when: (c) => c.mode === "alaska" },
      { exp: "mode",
        t: "Set up the Pacific Adventures",
        d: "Replace the Adventure deck with the <b>Pacific Adventures</b>: set the four <b>Special Adventure</b> cards aside, separate by stage, and shuffle a <b>Stage I</b> and a <b>Stage II</b> deck (Stage I under the table — backs are open information). Deal <b>three Stage I cards faceup</b> and <b>three facedown</b> below them, then place the <b>“Calling” Special Adventure faceup</b> below the bottom row. Shuffle the <b>Other World deck</b>; set the Stage II deck aside. Locked die icons on faceup cards get their dice.",
        src: "Omens of the Deep p.2, steps 6–7; p.4",
        when: (c) => c.mode === "rlyeh" },
      { exp: "mode",
        t: "Set up the Egyptian Adventures",
        d: "Replace the Adventure deck with the <b>Egyptian Adventures</b>: separate them by stage and shuffle a <b>Stage I “Cairo”</b> deck and a <b>Stage II “Dashur”</b> deck — the <b>Hidden Chamber</b> special adventures are shuffled into the Dashur deck. Deal <b>three Cairo cards faceup</b> and <b>three facedown</b> below them (shuffle under the table — backs are open information). Shuffle the four <b>Dark Pharaoh Special Adventure</b> cards into a facedown pile near the decks. Shuffle the <b>Other World deck</b> and place everything near the rows. Locked die icons on faceup cards get their dice.",
        src: "Omens of the Pharaoh p.2, steps 6–8; p.3",
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
          if (c.has("uf")) s.push("UF p.2, steps 4–5");
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
          if (c.mode === "streets") s.push("GoA p.3");
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
          if (c.mode === "rlyeh") deck = "the <b>Stage I “Ocean” Mythos deck</b> (separate the Staged Mythos cards by stage and shuffle each; set the Stage II “R'lyeh” deck aside for later)";
          if (c.mode === "pyramid") deck = "the <b>Omens of the Pharaoh Mythos deck</b> (its cards only — never combined with other Mythos cards)";
          let mm = "";
          if (c.mode === "museum" && c.has("uf")) mm = c.mod("master")
            ? " Because you are using the <b>Master Mythos option</b>, shuffle all 9 red-bordered Master Mythos cards into the deck first."
            : " Return the 9 red-bordered <b>Master Mythos</b> cards to the box (enable the Master Mythos module above to use them).";
          let dilemma = "";
          if (c.mode === "alaska") dilemma = " Remember that each Alaskan Mythos card is a <b>group dilemma</b>: choose one of its two options — the bottom option only if you can resolve it entirely.";
          if (c.mode === "rlyeh" || c.mode === "pyramid") dilemma = " Remember that each Mythos card in this mode is a <b>group dilemma</b>: choose either of its two options, even one that would have no effect.";
          if (c.mode === "pyramid" && c.mod("expert")) dilemma += " <b>Expert Mythos variant:</b> each time you resolve a Mythos option with the turquoise Expert watermark in its background, add <b>1 additional doom</b> after resolving its effects.";
          return "The first player shuffles " + deck + " and places it next to the Ancient One." + mm + " Then <b>draw one Mythos card and resolve it</b>. If it shows a locked die icon, place the matching die on it. <b>“At Midnight” effects do not trigger during setup</b> — this first card is not midnight." + dilemma;
        },
        src: (c) => {
          const s = ["Base p.5, step 8", "FAQ p.4, p.11"];
          if (c.mode === "museum" && c.has("uf")) s.push("UF p.2, step 6 · p.4");
          if (c.mode === "streets") s.push("GoA p.2, step 2");
          if (c.mode === "alaska") s.push("OoI p.2, step 3; p.4");
          if (c.mode === "rlyeh") s.push("OotD p.2, step 9; p.5");
          if (c.mode === "pyramid") s.push("OotP p.2, step 9; p.5");
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
<p>The FAQ v2.0 complements and expands the base-game turn description with a strict three-phase structure. This is the current official timing.</p>
<h4>I. Movement phase</h4>
<ul>
<li>Move your Investigator marker to any Adventure${c.mode === "museum" ? " card" : " or Other World card"} in play, or to the entrance — or stay where you are.${c.mode === "streets" ? " You cannot move to an Arkham Adventure that has an open gate on it; enter its Other World instead." : ""}</li>
${(c.mode !== "museum") ? "<li>If you move to a <b>facedown</b> Adventure, resolve the effect printed on its back, then flip it faceup — this ends your Movement phase." + (c.mode === "pyramid" ? " Exception: a facedown <b>Hidden Chamber</b> must first be unlocked with one special roll against the task on its back, made before moving; if it fails, move elsewhere or stay (see Hidden Chambers)." : "") + "</li>" : ""}
${(c.has("uf") || c.has("goa") || c.mode !== "museum") ? "<li>If the card you arrive on has an <b>Entry</b> effect, resolve it as the last step of your Movement phase (if you cannot pay an Entry cost, ignore the effect — you may always still move there). If you failed there last turn and stay, don't resolve it again; it does trigger for anyone else who moves in.</li>" : ""}
</ul>
<h4>II. Resolution phase</h4>
<p>If you are on the entrance, resolve an entrance action instead${(c.mode === "alaska" || c.mode === "rlyeh" || c.mode === "pyramid") ? " (in this mode, being at the entrance skips the Resolution phase — its actions happen in the Clock phase)" : c.mode === "streets" ? " (in this mode, the Streets of Arkham ability is used at the end of your Movement phase, not here)" : ""}. On an adventure, you <b>must</b> attempt it, using this exact sequence:</p>
<ol>
${c.mode === "streets" ? "<li>If your card shows an <b>event icon</b>, draw and resolve an Event card.</li>" : ""}
<li>Decide whether to <b>attempt or intentionally fail</b> the adventure. You may declare it failed before your first roll (avoiding Terror effects): apply the penalties, leave your marker there, and go to the Clock phase.</li>
<li><b>Build the dice pool.</b> First pool of the phase: all available green dice${c.has("uf") ? ", plus the white die if Blessed and the black die if Cursed" : ""}. Add dice secured on Spells if you wish, spend Items for the yellow/red die, and use abilities. The yellow or red die cannot be added more than once per Resolution phase${(c.mode === "pyramid" || c.mod("exhibit")) ? " (Relics are the exception)" : ""}.</li>
<li><b>Roll the dice pool.</b></li>
<li>Apply <b>rerolls and result-changing effects</b> (Clue tokens, abilities, items).</li>
${c.has("uf") ? "<li>If <b>Cursed</b>, resolve the black die: if it matches another die in your pool, discard both.</li>" : ""}
<li><b>Secure dice on Spells</b> (spells that secure dice are cast <i>after</i> rolling, before Terror effects).</li>
<li><b>Complete a task if you can</b> — assign dice covering all its requirements (one task per roll). If it was the last task, the adventure is resolved. If tasks remain, return to step ${c.mode === "streets" ? 2 : 1} of this list. If you cannot or will not complete a task:
  <ul>
  <li><b>a.</b> Resolve <b>Terror effects</b> — the card's and the current Mythos card's — if at least one die you rolled shows a terror result (terror results secured on Spells${c.has("uf") ? " and the black die" : ""} don't count; each effect at most <b>once</b> per attempt);</li>
  <li><b>b.</b> optionally <b>focus</b> (or another investigator here may <b>assist</b>) — set one die's result aside on an investigator marker;</li>
  <li><b>c.</b> <b>discard one die</b> from the pool (mandatory);</li>
  <li><b>d.</b> return to step ${c.mode === "streets" ? 2 : 1} and roll again. If your last die is discarded with tasks remaining, the adventure is failed: suffer the penalties.</li>
  </ul></li>
<li><b>Adventure resolved:</b> in order — move your marker (and every other investigator on that card) to ${c.mode === "museum" && c.has("uf") ? "the <b>“Souvenir Shop”</b> Entrance card" : "the entrance"}, take the card as a trophy and replace it${c.mode !== "museum" ? " <b>facedown</b> from the current Adventure deck" : ""} (Other Worlds are not replaced), then gain its rewards (so a “monster appears” reward can land on the replacement card). Then go to the Clock phase.</li>
</ol>
<h4>III. Clock phase</h4>
<ul>
${(c.mode === "alaska" || c.mode === "rlyeh" || c.mode === "pyramid") ? "<li>If at the entrance, you may resolve its ability (spend trophies etc.) before advancing the clock — the benefit can go to <b>any one</b> investigator, including you.</li>" : ""}
<li>You may play spells/items with no timing trigger before advancing the clock.</li>
<li><b>Advance the clock 3 hours.</b> Midnight does not happen during your turn: it resolves <b>immediately after</b> any turn in which the hand reached or passed XII.</li>
</ul>
<p class="src-line">FAQ p.2–3 (turn structure), p.4–5 · Base p.5–9${c.has("uf") ? " · UF p.2–3" : ""}${c.mode === "streets" ? " · GoA p.3–4" : c.has("goa") ? " · GoA p.4" : ""}${c.mode === "alaska" ? " · OoI p.3–4" : ""}${c.mode === "rlyeh" ? " · OotD p.3–5" : ""}${c.mode === "pyramid" ? " · OotP p.3–5" : ""}</p>` },

  { id: "dice", title: "The Dice",
    when: () => true,
    html: (c) => `
<ul>
<li><b>Green ×6</b> — faces: 1, 2, 3 investigations · lore · peril · terror. The default pool.</li>
<li><b>Yellow</b> — like green but <b>4 investigations replaces terror</b>. Usually added by spending a <b>Common Item</b>.</li>
<li><b>Red</b> — like yellow but a <b>wildcard replaces 1 investigation</b>. Usually added by spending a <b>Unique Item</b>. The wildcard may be used as lore, peril, terror or a <b>4-investigation</b> result (the base rulebook's “1 investigation” is errata'd).</li>
${c.has("uf") ? `<li><b>White</b> — same faces as green. Added to your pool at the start of every adventure while <b>Blessed</b>; behaves like any normal die.</li>
<li><b>Black</b> — same faces as green, but rolled while <b>Cursed</b>: after each roll (and all rerolls/abilities), if it matches any die in your pool, discard the black die <i>and</i> one matching die. It can't be assigned to tasks, secured, discarded for a failed roll, or altered by any effect, and it never triggers Terror effects.</li>` : ""}
<li>Dice added by items stay in the pool until used on a task, discarded after a failed roll, the adventure is resolved, or your turn ends. A die discarded after a failed roll is <b>gone for the rest of that Resolution phase</b> — it cannot be re-bought with another item${(c.mode === "pyramid" || c.mod("exhibit")) ? " (Relics are the sole exception)" : ""}.</li>
<li><b>Locked dice:</b> when a locked die icon appears on a card or marker, the matching die is immediately trapped on it (even off a Spell or investigator marker, but never off another lock). Free it by resolving that Adventure, when that Mythos card is no longer in effect, or by defeating that monster — but a defeated monster's die stays on its facedown token until the token is collected at the end of the Resolution phase, so it can't be rerolled this phase. If an effect discards the monster (including by discarding the Adventure it is on), the die is freed immediately. A die can queue behind multiple locks.</li>
</ul>
<p class="src-line">Base p.6, p.9, p.11 · FAQ p.2 (wildcard), p.8 (locked dice, red/yellow), p.12${c.has("uf") ? " · UF p.2–3" : ""}${(c.mode === "pyramid" || c.mod("exhibit")) ? " · OotP p.4" : ""}</p>` },

  { id: "tasks", title: "Tasks: Symbols, Completing & Failing",
    when: () => true,
    html: (c) => `
<ul>
<li>Each horizontal row on an Adventure is a <b>task</b>; complete every task to resolve the card. You may complete only <b>one task per roll</b>, in any order unless the card has an <b>arrow</b> (top-to-bottom required).</li>
<li><b>Number symbol</b>: that many investigation pips (combine dice; excess is wasted). <b>Lore / Peril / Terror symbols</b>: one die showing that face. <b>Split symbol</b>: either shown result works.</li>
<li><b>Clock symbol</b>: completing the task forces you to <b>advance the clock</b>. <b>Sanity/Stamina numbers</b>: completing the task costs that much sanity/stamina — you may not complete a task that would drop you to 0 or below (Whiskey/Food can pay a 1-point cost instead).</li>
${c.has("uf") ? "<li><b>Cursed symbol</b> (UF): completing the task makes you Cursed. <b>Doom symbol</b> (UF): completing the task adds 1 doom.</li>" : c.has("goa") ? "<li><b>Doom symbol</b> (GoA): completing the task adds 1 doom.</li>" : ""}
${c.mode === "streets" ? "<li><b>Gate symbol</b> (GoA): completing the task opens a gate. <b>Membership tasks</b>: if you belong to the matching organization, the task counts as complete with no dice; a monster on it returns to the cup.</li>" : ""}
<li><b>Rolling with no requirements:</b> you must still roll your pool before completing a task with no dice requirements.</li>
<li><b>Monster tasks:</b> a white-bordered row is a monster task — empty ones are ignored until a monster sits there. Monsters on cards must be beaten as extra tasks (see Monsters).</li>
<li><b>Failing a roll:</b> Terror effect (once per attempt, if any die you rolled shows terror — results secured on Spells${c.has("uf") ? " and the black die" : ""} don't count) → optional focus/assist (one die per roll, max; an investigator marker holds only one die) → discard one die → roll again. If you fail the adventure (out of dice, or unwilling to finish it), each assisting investigator — anyone other than you with a die on their investigator marker — must lose 1 sanity or 1 stamina (their choice).</li>
<li><b>Focus/assist</b> is only allowed after a roll that <b>failed</b> to complete a task, and only <b>once per Resolution phase</b> for focusing. You cannot both focus and request assistance on the same roll.</li>
</ul>
<p class="src-line">Base p.5–8, p.10 · FAQ p.2, p.9–10 (focus/assist, Whiskey/Food, secured terror), p.5 · UF p.3–4 · GoA p.4–5</p>` },

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
      if (c.has("uf")) rows.push(["uf", "Blessed / Cursed", "Become Blessed / Cursed."]);
      const reprieveExp = ["uf", "goa", "ooi", "ootd"].find(e => c.has(e));
      if (reprieveExp) rows.push([reprieveExp, "Reprieve", "Remove 1 doom token from the doom track."]);
      const clockExp = ["uf", "goa", "ooi", "ootd", "ootp"].find(e => c.has(e));
      if (clockExp) rows.push([clockExp, "Clock", "Advance the clock once."]);
      if (c.has("goa") || c.has("ootd")) rows.push([c.has("goa") ? "goa" : "ootd", "Skill / Lost Skill", "Draw 1 Skill card / discard 1 Skill."]);
      else if (c.mode === "alaska") rows.push(["ooi", "Lost Skill", "Discard 1 Skill (if you have none, nothing happens; on a split penalty without Gates of Arkham, choose the side without the skill)."]);
      const iconExp = ["goa", "ooi", "ootd", "ootp"].find(e => c.has(e));
      if (iconExp) rows.push([iconExp, "Healing / Respite", "Any one investigator regains 1 stamina / 1 sanity. (Expansion icon.)"],
        [iconExp, "Expeditious", "Do not advance the clock during your Clock phase this turn. (Expansion icon.)"],
        [iconExp, "Remove Monster", "Return 1 monster on an adventure to the cup. (Expansion icon.)"],
        [iconExp, "Lost Item / Spell / Ally", "Discard 1 card of the shown type. (Expansion icon.)"],
        [iconExp, "Lost Elder Sign", "Remove 1 Elder Sign from the Ancient One — if there are none, add 1 doom instead. (Expansion icon.)"]);
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
<li><b>Split rewards/penalties</b> (diagonal line): choose one group. You cannot choose a penalty you cannot fulfill${(!c.has("uf") || !(c.has("goa") || c.has("ootd"))) ? "; if a split includes a blessing/curse/skill from an expansion you're not using, you must take the other side" : ""}.</li>
<li><b>Trophies:</b> resolved Adventures and defeated monsters are spent at the entrance for their printed value. Overspending is allowed with no change. Spent monsters return to the cup; spent Adventures go under their deck.</li>
</ul>
<p class="src-line">Base p.8–9 · UF p.4 · GoA p.4–5 · OoI p.4–5 · OotD p.5 · OotP p.5 · FAQ p.10, p.12</p>`;
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
<p>Unseen Forces replaces the entrance sheet with <b>four Entrance cards</b>, each a separate location offering its own ability. In your Movement phase you may move to any of them; if you are on one in your Resolution phase you <b>must</b> resolve its ability. Effects mentioning “the entrance” affect <b>all</b> Entrance cards — if told to move to “the entrance,” pick whichever you like. Some effects <b>close</b> an Entrance card (flip it facedown): you can still stand there, but its ability is off. Investigators return to the <b>“Souvenir Shop”</b> card after resolving adventures, and <b>“The Chapel”</b> is the place to seek a <b>Blessing</b>.</p>
<p class="src-line">UF p.2</p>`;
      if (c.mode === "streets") return `
<p>The <b>Streets of Arkham</b> card replaces the entrance. At the <b>end of your Movement phase</b> there, you may spend <b>2 trophies</b> to do one of the following and then move to an Arkham Adventure of your choice:</p>
<ul>
<li>Flip 1 facedown Arkham Adventure faceup;</li>
<li>Discard 1 Arkham Adventure without a gate, monster, locked die or investigator, and replace it facedown;</li>
<li>Regain 1 stamina and 1 sanity.</li>
</ul>
<p>If you use the ability you <b>must</b> move to an Arkham Adventure (never an Other World). If you don't use it, you may stay on the Streets for the turn. When the Adventure or Other World card you are on is resolved <b>or otherwise discarded</b>, you return here, and any effect that says “the entrance” means this card. A gate that opens on your Arkham Adventure also sends you here.</p>
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
<p>When the Adventure or Other World card you are on is resolved <b>or otherwise discarded</b>, you return here, and any effect that says “the entrance” means this card.</p>
<p class="src-line">OoI p.3 (camp card) · FAQ p.3</p>`;
      if (c.mode === "rlyeh") return `
<p><b>“The Ultima Thule”</b> replaces the entrance. An investigator there <b>skips the Resolution phase</b> and may spend trophies at the start of their <b>Clock phase</b> (the benefit may go to any investigator).</p>
<p>Options on “The Ultima Thule” side:</p>
<ul>
<li><b>5</b> — gain 1 ally, 1 skill, or advance the omen</li>
<li><b>4</b> — gain 1 unique item <i>or</i> 1 spell</li>
<li><b>3</b> — gain 1 common item <i>or</i> 1 clue</li>
<li><b>2</b> — regain 2 sanity <i>or</i> 2 stamina</li>
<li><b>1</b> — discard the top card of the Adventure deck</li>
</ul>
<p>When the Adventure or Other World card you are on is resolved <b>or otherwise discarded</b>, you return here, and any effect that says “the entrance” means this card. If <b>four or more Deep One Legions</b> are ever in play, the ship <b>sinks immediately</b>: discard 1 broken amulet token and flip the card to “Wreckage of the Ultima Thule” for the rest of the game — and the game advances to Stage II. From then on the Wreckage is the entrance: investigators return to it, effects that say “the entrance” mean it, and you use the options printed on that side.</p>
<p class="src-line">OotD p.2 (card), p.3 · FAQ p.5</p>`;
      return `
<p>The double-sided <b>Cairo / Dashur</b> card replaces the entrance. Whichever side is faceup is where investigators return when the Adventure or Other World card they are on is resolved <b>or otherwise discarded</b>; it is what any effect saying “the entrance” means, and it determines <b>which Adventure deck replacements are drawn from</b> (Cairo → Stage I, Dashur → Stage II). An investigator there skips their Resolution phase; in their <b>Clock phase</b> they may spend trophies on that side's options — or <b>advance the clock</b> to flip the card to the other side. Gather supplies in Cairo, but the Elder Signs are in Dashur.</p>
<p class="src-line">OotP p.3</p>`;
    } },

  { id: "midnight", title: "Midnight & “At Midnight” Effects",
    when: () => true,
    html: (c) => `
<ul>
<li>Midnight is <b>not part of a player's turn</b>: it resolves immediately <b>after</b> any turn in which the clock hand reached or passed XII.</li>
<li>If the clock passes midnight <b>more than once in the same turn</b>, each extra midnight adds <b>1 doom token</b> — but you do <b>not</b> draw another Mythos card or re-resolve “At Midnight” effects.</li>
<li>“At Midnight” effects trigger even if no investigator is on the card. They do <b>not</b> occur during setup, and they stop entirely once the Ancient One awakens. An “At Midnight” effect that enters play during the turn the clock reaches midnight (e.g. on a replacement adventure) resolves at that midnight.</li>
</ul>
<h4>Order of operations at midnight</h4>
<ol>
${c.mode === "alaska" ? "<li><b>Advance the day token</b> one space and add the storm markers shown on the new space.</li><li>Add <b>1 doom token per adventure with 4 storm markers</b>.</li>" : c.has("ooi") ? "<li>Add <b>1 doom token per adventure with 4 storm markers</b> (Omens of Ice storms).</li>" : ""}
<li>“At Midnight” effects on the <b>Ancient One</b>;</li>
<li>… on <b>monsters</b> (investigators choose the order);</li>
<li>… on <b>Adventure and Other World cards</b> (investigators choose)${c.has("ootp") ? " — but skip any Dark Pharaoh adventure that came into play during the Ancient One step of this midnight" : ""};</li>
<li>… on <b>other cards</b> (investigators choose);</li>
<li>“The next time the clock strikes midnight…” effects on the current Mythos card;</li>
<li><b>Draw and resolve a new Mythos card</b>${c.mode === "alaska" ? " — a group dilemma: choose one of its two options, and never the bottom option unless you can resolve it entirely" : ""}${c.mode === "rlyeh" || c.mode === "pyramid" ? " — a group dilemma: choose either of its two options, even one that would have no effect (if the group can't decide, the investigator who took the last turn chooses)" : ""}${c.mode === "pyramid" && c.mod("expert") ? " — Expert Mythos: if the chosen option has the turquoise watermark, add 1 more doom token after resolving it" : ""}${c.mode === "museum" && c.has("uf") ? " — on a card with the <b>insight icon</b>, the group chooses the top or bottom option (never one with no effect; if the group can't agree, the player who took the last turn before midnight decides)" : ""};</li>
<li>Refresh all <b>“Once per day”</b> abilities.</li>
</ol>
<p class="src-line">FAQ p.3, p.11–12${c.mode === "museum" && c.has("uf") ? " · UF p.3" : ""}${c.mode === "alaska" ? " · OoI p.6" : c.has("ooi") ? " · OoI p.5–6" : ""}${c.mode === "rlyeh" ? " · OotD p.5–6" : ""}${c.mode === "pyramid" ? " · OotP p.5–6" : c.has("ootp") ? " · OotP p.6" : ""}</p>` },

  { id: "monsters", title: "Monsters",
    when: () => true,
    html: (c) => `
<ul>
<li>When “a monster appears,” draw one marker from the cup and place it on a <b>monster task</b> — an empty one replaces that task; a <b>total</b> monster task is fully covered; a <b>partial</b> one covers only the white-bordered symbols and adds its own requirements to the rest.</li>
<li>If no empty monster task exists, place the monster <b>below the bottom task</b> of an Adventure — distributing monsters <b>as evenly as possible</b> across adventures (no card gets a second bottom monster until every card has one). A monster added to the bottom counts as the card's <b>last task</b> if there's an arrow. Exception: “a monster appears <b>here</b>” effects ignore evenness and land on the current adventure.</li>
${c.mode !== "museum" ? "<li>Monsters may be placed on <b>faceup or facedown</b> Adventure cards. When a facedown Adventure holding monsters is flipped faceup, move them onto its monster tasks; any that don't fit go below its bottom task.</li>" : ""}${c.mode === "alaska" || c.mode === "rlyeh" ? "<li>Monsters (like other markers) are never placed on <b>Special Adventure</b> cards.</li>" : ""}${c.has("ootp") ? "<li>Monsters (like other markers) are never placed on <b>Dark Pharaoh</b> special adventures.</li>" : ""}
<li>If an Adventure is discarded, its monsters return to the cup and any dice they lock are freed at once. When a reward makes a monster appear, replace the resolved Adventure first, so the monster may land on the new card.</li>
<li>Defeating a monster's task claims the marker as a trophy (flip it facedown until the adventure ends — dice locked by it stay until the Resolution phase ends; a <b>discarded</b> monster frees its die immediately). You keep the monster trophy even if you then fail the adventure, and gain any reward on the marker's back.</li>
<li>Items/spells that “defeat” a monster let you pick a monster on <b>any</b> adventure card (not just yours, unless the card says otherwise): turn it facedown — all its requirements, including sanity/stamina, count as satisfied (on a partial monster task, the uncovered requirements still need dice) — and it is claimed as a trophy at the end of that Resolution phase. <b>Discarding</b> a monster just returns it to the cup — no trophy, and requirements under it reopen.</li>
${c.has("uf") ? "<li><b>Monster order arrow</b> (Wizard Whateley): once placed, that card's tasks must be done in order top-to-bottom — if it sits below the bottom task, the monster comes last.</li><li><b>Children of Abhoth</b> (Abhoth only): when “a Child of Abhoth appears,” draw one at random from the stockpile beside Abhoth and place it like any monster. If an effect would return one to the monster cup, put it facedown back in Abhoth's stockpile and shuffle the stockpile instead.</li>" : ""}
${c.mode === "rlyeh" ? "<li><b>Deep One Legions</b> live in their own stockpile, never the cup. When defeated, pay the cost on the marker's back or the Legion <b>reappears</b> on another adventure. Four Legions in play sink the Ultima Thule. <b>Missions</b> come from the cup and act like monsters, but items and spells that defeat or discard monsters don't affect them. A completed mission is <b>not a trophy</b>: keep it facedown in front of you, and at the start of your Movement or Clock phase spend trophies equal to the number on its back, return it to the box and gain its reward.</li>" : ""}
${(c.mode === "pyramid" || c.mod("exhibit")) ? "<li><b>Mask monsters</b> are always in the cup in this configuration (exception: against the Omens of the Pharaoh <b>Nyarlathotep</b>, follow the mask-monster instructions on his card instead) — they are often very difficult to defeat. (A monster with a <b>midnight icon</b> in its task list, such as the Pharaoh's Sand Dweller, has an “At Midnight” effect on its back.)</li>" : ""}
</ul>
<p class="src-line">Base p.10–11 · FAQ p.3 (placement), p.8–10, p.12${c.has("uf") ? " · UF p.4" : ""}${c.mode === "streets" ? " · GoA p.3" : c.mode === "alaska" ? " · OoI p.4" : ""}${c.mode === "rlyeh" ? " · OotD p.3–4" : ""}${c.mode === "pyramid" || c.mod("exhibit") ? " · OotP p.3–5" : c.has("ootp") ? " · OotP p.4" : ""}</p>` },

  { id: "blessed", title: "Blessed & Cursed",
    when: (c) => c.has("uf"),
    html: () => `
<ul>
<li><b>Blessed:</b> add the <b>white die</b> to your pool at the start of every adventure. Only one Blessed card each; blessed again → instead gain 1 clue <i>or</i> draw 1 Common Item, Unique Item or Spell. Discard your Blessed card when you <b>fail an adventure</b> or the Ancient One awakens.</li>
<li><b>Cursed:</b> you must add the <b>black die</b> to your pool at the start of every adventure. After each roll (once rerolls and result-changing effects are done), if the black die matches another die in your pool, discard both (if several match, you choose which one). The black die is never assigned to a task, is never the die you discard for a failed roll, never triggers Terror, and can't be affected by items, spells, investigator abilities or Clue tokens; it leaves your pool when it matches or your turn ends. Cursed again while Cursed → <b>devoured</b>. Discard your Cursed card when you <b>successfully resolve an adventure</b> or the Ancient One awakens — but if you were cursed <i>during</i> an adventure, succeeding at that same adventure doesn't count; you must resolve another one.</li>
<li>Becoming Blessed while Cursed (or vice versa) just cancels the old card — you don't gain the new one.</li>
<li>Cursed mid-adventure: add the black die from your <b>next</b> roll. Blessed mid-adventure: you gain the card at once, but the white die is only added when a Resolution phase's first dice pool is created (FAQ). A secured white die (on a spell or investigator marker) is removed if the blessing is lost — a spell left with no dice is discarded. A black die can never be secured on a spell. The white die is never added during the final battle — it isn't an adventure.</li>
</ul>
<p class="src-line">UF p.2–3 · FAQ p.3–4 (black-die timing), p.12</p>` },

  { id: "battle", title: "Battling the Ancient One",
    when: () => true,
    html: (c) => `
<ul>
<li>The Ancient One awakens when the <b>last doom space fills</b> (a game effect that awakens it fills the track). Pending rewards/penalties resolve first. If the final doom lands at the same moment as the final Elder Sign, <b>the investigators win</b>.</li>
<li>On awakening: the current Mythos card is discarded (its lingering effect ends; dice locked on it are freed — dice locked on monsters/adventures are <b>removed from the game</b>). All investigator markers move to the Ancient One and cannot leave. “At Midnight” effects and special doom icons no longer function. If it awakens partway through a player's turn, that player proceeds immediately to their Advance the Clock step.</li>
<li><b>Attack the Ancient One</b> — roll your pool against its printed combat task as you would an adventure; each completion removes 1 doom token. You may complete it any number of times, but only once per roll; on a failed roll set one die aside and roll again, or stop. Failing to remove doom has no penalty.</li>
${c.mod("epicbattle") ? `<li><b>Epic Battle deck:</b> shuffle it and draw the top card, resolving top to bottom — it dictates whether investigators or the Ancient One strike first, plus battle effects. Investigators attack one per turn, advancing the clock after each; when midnight strikes the round ends — the Ancient One attacks at that point if the investigators struck first — and you draw the next Epic Battle card. (If the Ancient One awakens at midnight, draw the first card instead of resolving its attack immediately.) Battle Event cards break up the combat with a bonus or penalty — resolve them top to bottom.</li>` : `<li>Then <b>advance the clock</b>; each midnight the Ancient One's <b>attack</b> (printed on its card) resolves instead of a Mythos card.</li>`}
<li>You may not focus or assist during the battle, but Items, Spells, Clues, allies and abilities all work. Completing the combat task still requires assigning dice.</li>
<li>A devoured investigator during the battle adds 1 doom and is <b>not replaced</b> (their clock-advance still happens on their turn). All devoured, everyone loses. Remove every doom token — or bank enough Elder Signs — and <b>everyone wins, devoured included</b>.</li>
${c.mode === "alaska" && c.has("gc") ? "" : ""}
</ul>
<p class="src-line">Base p.11–12 · FAQ p.4–6, p.8${c.mod("epicbattle") ? " · Grave Consequences cards 3/5–5/5" : ""}</p>` },

  { id: "devoured", title: "Devoured Investigators & the Doom Track",
    when: () => true,
    html: (c) => `
<ul>
<li>Sanity <b>or</b> stamina at 0 or less devours an investigator${c.mod("phobia") ? " — <b>unless the Phobia deck saves them</b>: draw a Phobia instead, restore sanity to full, add 1 doom (a stamina KO still devours; a fourth Phobia devours; after the Ancient One awakens, phobias no longer save you)" : ""}. Add <b>1 doom token</b>, return the investigator card/marker to the box, return items, allies and Adventure trophies facedown to the bottoms of their decks, monster trophies to the cup, clues to the pool.${c.mod("epitaph") ? " Draw an <b>Epitaph card</b> and resolve it, then flip the card facedown near the play area and place the investigator token on its back." : ""}</li>
<li>If the active player's investigator is devoured, that player still <b>advances the clock</b> this turn (no other steps). The player then takes a <b>new investigator</b> (never one devoured this game) with full starting kit and full sanity/stamina, playing it from their next turn — unless the Ancient One has awoken. If no investigators are left to take, that player is out of the game but still wins if the others do.</li>
<li>The doom track <b>can never hold more tokens than it has spaces</b> — overflow doom (multi-doom effects, devoured investigators during the battle) is discarded. Special doom icons (monster, gate, storm…) trigger when covered during the game, but <b>never during the final battle</b>.</li>
<li>Doom is only added when an effect says so — not automatically each time the clock reaches midnight. (Exception: if the clock strikes midnight more than once in the same turn, each extra midnight adds 1 doom — see Midnight.)</li>
</ul>
<p class="src-line">Base p.11–12 · FAQ p.3–6, p.8${c.mod("phobia") || c.mod("epitaph") ? " · Grave Consequences cards 2/5–3/5" : ""}</p>` },

  /* --- mode-specific deep reference --- */
  { id: "mode-streets", title: "Streets of Arkham: Gates, Events, Skills & Memberships",
    when: (c) => c.mode === "streets",
    html: () => `
<h4>Facedown adventures & difficulty</h4>
<ul>
<li>Arkham Adventures enter play <b>facedown</b>; the top of each card back shows difficulty (green easy · yellow normal · red hard) and the deck's top card back is open information.</li>
<li>Moving onto a facedown card: resolve the effect on its back, flip it faceup, resolve any Entry effect, and end your Movement phase. “At Midnight” text on backs triggers only while facedown at midnight.</li>
<li>Monsters may be placed on faceup or facedown Adventures. When a facedown card holding monsters is flipped, move them onto its monster tasks; any that don't fit go below its bottom task.</li>
</ul>
<h4>Gates</h4>
<ul>
<li>Any effect that <b>opens a gate</b> or <b>places an Other World card</b> does this: draw the top Other World card facedown below the Arkham row, place one gate marker of a color on it and the matching marker on an Arkham Adventure without a gate or seal. Investigators there move to the Streets.</li>
<li>You cannot move to an Arkham Adventure with a gate; you can enter the gated <b>Other World</b> (flipping it faceup ends your Movement phase). Max 3 gates open at once; if no markers remain, a monster appears instead. If markers remain but every adventure is gated/sealed, remove all seals, add 1 doom, and open the gate normally.</li>
<li><b>Closing:</b> resolving an Other World with a gate closes it — put a <b>seal marker</b> on the matching Arkham Adventure (no new gates there) and return both gate markers. If an effect closes a gate without resolving its Other World, that Other World is discarded and the adventure is sealed. If an effect discards a gated Arkham Adventure (or its gate marker), the matching gate marker and its Other World card are discarded as well (FAQ).</li>
</ul>
<h4>Events, Skills, Memberships</h4>
<ul>
<li><b>Event icon:</b> at the start of your Resolution phase on a card with the icon, draw and resolve an Event card before attempting the adventure.</li>
<li><b>Skills</b> are drawn from rewards, played faceup, and last until their text expires; only their owner uses them.</li>
<li><b>Memberships</b> (Sheldon Gang / Order of the Silver Twilight, mainly from Hibb's Roadhouse or the Silver Twilight Lodge): only one at a time — gaining a second, choose which one to keep. A membership task matching your organization counts as <b>complete without dice</b> (if it held a monster, ignore the monster and return it to the cup once the adventure is successfully resolved), and matching membership rewards are gained in addition to the rest.</li>
</ul>
<p class="src-line">GoA p.3–4 · FAQ p.6 (3-gate limit), p.11 (discarded gates)</p>` },

  { id: "mode-alaska", title: "Alaska Expedition: Supplies, Days, Storms & Stages",
    when: (c) => c.mode === "alaska",
    html: (c) => `
<h4>Supplies & days</h4>
<ul>
<li>The <b>supply track</b> holds your provisions (total = the supply token's modifier + its space — you start with “+10” on “5”, i.e. 15; past “9” or below “0”, swap to the token with the next higher/lower modifier). The Track card punishes an empty larder: <b>at midnight with 0 supplies, every investigator loses 1 stamina</b> (as printed on the Track card).</li>
<li>The <b>day token</b> advances at every midnight (before other midnight effects), adding the storm markers shown on the new space. End of Day 7: <b>${c.mod("winter") ? "Winter — the investigators lose the game" : "Summer — add 2 doom, reset to Day 7 and add 7 storm markers"}</b>.</li>
</ul>
<h4>Storm markers</h4>
<ul>
<li>Placed facedown from the pile onto adventures (max 4 per adventure; never on Other Worlds or Special Adventures). If placing during your own Resolution phase, not on your own adventure unless all others are full.</li>
<li>At the start of your Resolution phase on a stormy adventure, flip all its markers and resolve the revealed penalties in any order (blanks do nothing); markers then return facedown to the pile.</li>
<li>At midnight, each adventure holding 4 storm markers adds <b>1 doom token</b>.</li>
<li>Storm markers are limited: if none are left in the pile, none are placed and there is no further effect. Storms on an adventure discarded by an effect return to the pile.</li>
<li><b>Midnight icon</b> in a monster's task list: at midnight, resolve the “At Midnight” effect on the back of that marker.</li>
</ul>
<h4>Stages & specials</h4>
<ul>
<li>Alaskan Adventures enter play facedown (difficulty color on the back; top of deck is open information). Facedown arrival: resolve the back, flip, resolve Entry, end Movement. “At Midnight” text on backs triggers only while facedown at midnight. Monsters may be placed on facedown Adventures; when one is flipped, move its monsters onto its monster tasks (extras go below the bottom task).</li>
<li><b>Special Adventures</b> can't be discarded (except by completing them) and never hold storms/monsters. Completing <b>“Arrival”</b> puts <b>“Into the Wild”</b> into play faceup; completing <b>“Into the Wild”</b> advances to <b>Stage II</b>: discard the Stage I deck (Stage I cards in play or held as trophies stay), add “Treacherous Ascent” faceup, and draw replacements from Stage II.</li>
<li>Alaskan Mythos cards are group dilemmas: pick one of two options; you may not pick the bottom option unless you can resolve it fully (then you must take the top). If the group can't agree, the investigator who took the last turn decides.</li>
</ul>
<p class="src-line">OoI p.2–5 · FAQ p.11 (Mythos options), p.12 (discarded storms)</p>` },

  { id: "mode-rlyeh", title: "R'lyeh Rising: Dark Waters, the Amulet & the Deep One Legion",
    when: (c) => c.mode === "rlyeh",
    html: (c) => `
<h4>The Dark Waters track (Stage I)</h4>
<ul>
<li>Game effects <b>advance</b> (one space right) or <b>retreat</b> (one space left) the omen token. <b>Leftmost space:</b> if the token would retreat while already there, <b>a Deep One Legion monster appears</b>. <b>Rightmost space:</b> “You may travel to Stage II” — per the FAQ, when the token lands there the players choose whether to travel to Stage II or stay in Stage I; if they stay, triggering that space again later (an advance while the token is already on it) offers the choice again.</li>
<li><b>Two ways to Stage II:</b> the Ultima Thule sinks (4 Deep One Legions in play — automatic), or the players trigger the rightmost Dark Waters space (their choice; it can be declined and triggered later).</li>
</ul>
<h4>Stage II: the Amulet of R'lyeh</h4>
<ul>
<li>Flip the scenario card. Place all broken amulet tokens you've gained on their spaces; <b>each empty space locks its matching die</b> on the track. Gaining that amulet piece later frees the die. Locked dice there are lost for good if the Ancient One awakens.</li>
<li>In Stage II the omen token no longer moves: if it would <b>advance</b>, instead <b>remove a Deep One Legion</b> on any adventure from the game; if it would <b>retreat</b>, instead <b>a monster appears</b>.</li>
<li>Discard the Stage I Adventure deck (adventures in play and trophies stay) and replace it with the Stage II deck; return the Ocean Mythos cards to the box and use the R'lyeh Mythos deck. Add <b>“R'lyeh Risen”</b> faceup (existing Special Adventures stay). Per the FAQ, completing <b>“Echoes of the Dream”</b> is <b>not</b> directly linked to reaching Stage II (resolved in Stage II, its reward is gained only once).</li>
</ul>
<h4>Deep One Legion & missions</h4>
<ul>
<li><b>Deep One Legion doom icon</b> (the three Omens of the Deep Ancient Ones): each time a doom token is placed on it, a Deep One Legion appears from the stockpile. Legions come from their stockpile (never the cup); both sides of their markers are open information. Defeat one and <b>pay the cost on its back</b> or it reappears on another adventure. Discarded Legions return to the stockpile; an empty stockpile means no Legion appears.</li>
<li><b>Missions</b> (from the cup) appear and are completed like monsters, but items and spells that <b>defeat or discard</b> monsters don't affect them. A completed mission sits facedown in front of you (not a trophy): at the start of your Movement or Clock phase, spend trophies equal to the number on its back and return the marker to the box to gain its reward.</li>
${c.has("goa") ? "" : "<li><b>Skills:</b> a Skill card you draw goes faceup in your play area and stays until its own text says it expires; only you can use it.</li>"}
<li>Pacific adventures enter facedown; Staged Mythos cards are group dilemmas — either option may be chosen, even one with no effect; if the group can't decide, the investigator who took the last turn chooses.</li>
</ul>
<p class="src-line">OotD p.3–5 · FAQ p.5 (Stage II), p.11${c.has("goa") ? "" : " · GoA p.4 (Skills rule)"}</p>` },

  { id: "mode-pyramid", title: "Lightless Pyramid: the Expedition, Relics, Chambers & the Dark Pharaoh",
    when: (c) => c.mode === "pyramid",
    html: (c) => `
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
<li>The <b>Chamber effect</b> at the top belongs only to the unlocking investigator, when the card is first flipped. Once unlocked, <b>any</b> investigator may move to the chamber (without its Chamber effect). Game effects can't flip a chamber unless they say it is “unlocked.” Completed chambers return to the box — they are not trophies. (Paying 3 trophies via Father Mateo can't skip the unlock roll — the task is not an “effect.”)</li>
</ul>
<h4>The Dark Pharaoh</h4>
<ul>
<li>The new doom icon draws a <b>Dark Pharaoh special adventure</b> into play facedown. They can't hold markers and aren't trophies; resolved ones go to their own discard, which reshuffles when a fifth draw is needed. If one must be drawn while <b>all four are already in play, the doom track fills and the Ancient One awakens immediately</b>.</li>
<li>Egyptian adventures enter facedown; replacements come from the deck matching the faceup entrance side (Cairo → Stage I, Dashur → Stage II).${c.has("uf") ? " <b>Foresee</b> (Unseen Forces spell) may only look at and manipulate the <b>active</b> Adventure deck — the Stage I Cairo deck while Cairo is faceup, the Stage II Dashur deck while Dashur is faceup." : ""} Mythos cards are group dilemmas — either option may be chosen, even with no effect; if the group can't decide, the investigator who took the last turn chooses.${c.mod("expert") ? " <b>Expert Mythos variant:</b> each time you resolve a Mythos option with the turquoise Expert watermark in its background, add <b>1 additional doom</b> after resolving its effects." : ""}</li>
</ul>
<p class="src-line">OotP p.3–5 · FAQ${c.has("uf") ? " p.5 (Foresee)," : ""} p.8 (Relics), p.9 (Father Mateo), p.11–12</p>` },

  /* --- expansion content used outside its own game mode --- */
  { id: "out-of-mode", title: "Expansion Content Outside Its Own Mode",
    when: (c) => (c.has("goa") && c.mode !== "streets") || (c.has("ooi") && c.mode !== "alaska") || (c.has("ootd") && c.mode !== "rlyeh") || (c.has("ootp") && c.mode !== "pyramid"),
    html: (c) => {
      const parts = [], src = [];
      if (c.has("goa") && c.mode !== "streets") {
        parts.push(`<h4>Gates of Arkham</h4>
<ul>
${c.mode !== "alaska" ? "<li><b>Gate doom icon</b> (its Ancient Ones): outside the Streets of Arkham, each time a doom token lands on it, <b>each investigator loses 1 sanity</b>.</li>" : ""}
<li><b>Skills:</b> a Skill card you draw goes faceup in your play area and stays until its own text says it expires; only you can use it.</li>
</ul>`);
        src.push("GoA p.4–5");
      }
      if (c.has("ooi") && c.mode !== "alaska") {
        parts.push(`<h4>Omens of Ice</h4>
<ul>
<li>Only its Alaskan Adventures, Alaskan Mythos cards, Track card and entrance card are Alaska-only — the rest, including the <b>storm markers</b>, can be used in any mode.</li>
<li><b>Storm doom icon</b> (its Ancient Ones): each time a doom token lands on it, place <b>3 storm markers</b> on adventures — drawn unseen from the facedown pile and placed facedown one at a time (max 4 per adventure; never on Other World or Special Adventure cards; not on your own adventure during your Resolution phase unless every other adventure holds 4; if none are left, none are placed).</li>
<li>At the start of your Resolution phase, flip all storm markers on your adventure and resolve their penalties in any order (blanks do nothing), then return them to the pile at random. At midnight, add <b>1 doom token per adventure holding 4 storm markers</b>. Storms on a discarded adventure return to the pile.</li>
<li><b>Midnight icon</b> in a monster's task list (some of its monsters): at midnight, resolve the “At Midnight” effect on the back of that marker.</li>
</ul>`);
        src.push("OoI p.5 · FAQ p.12");
      }
      if (c.has("ootd") && c.mode !== "rlyeh") {
        parts.push(`<h4>Omens of the Deep</h4>
<ul>
<li>Only its Pacific Adventures, Staged Mythos cards, Scenario card and entrance card are R'lyeh Rising-only — the rest can be used in any mode.</li>
<li>${c.mode === "alaska" ? "When an effect makes a <b>Deep One Legion</b> appear, it comes from the Deep One Legion stockpile" : "<b>Deep One Legion doom icon</b> (its Ancient Ones): each time a doom token lands on it, a <b>Deep One Legion</b> appears from the Deep One Legion stockpile"} (never the cup; if the stockpile is empty, nothing happens). Both sides of a Legion marker are open information. Defeat one and pay the cost on its back, or it <b>reappears</b> on another adventure; discarded Legions return to the stockpile.</li>
<li><b>Missions</b> go in the monster cup and appear and are completed like monsters, but items and spells that defeat or discard monsters don't affect them. A completed mission sits facedown in front of you and is not a trophy: at the start of your Movement or Clock phase, spend trophies equal to the number on its back, return it to the box and gain its reward.</li>
${c.has("goa") ? "" : "<li><b>Skills:</b> a Skill card you draw goes faceup in your play area and stays until its own text says it expires; only you can use it.</li>"}
</ul>`);
        src.push("OotD p.2–6" + (c.has("goa") ? "" : " · GoA p.4 (Skills rule)"));
      }
      if (c.has("ootp") && c.mode !== "pyramid") {
        parts.push(`<h4>Omens of the Pharaoh</h4>
<ul>
<li>Only its Egyptian Adventures, Mythos cards, the Expedition side of the scenario sheet and the Cairo/Dashur entrance card are Lightless Pyramid-only; Relics come into other modes through <b>The Exhibit</b>.</li>
<li>${c.mode === "alaska" ? "<b>Dark Pharaoh special adventures</b>: when a game effect draws one, put it into play facedown" : "<b>Dark Pharaoh doom icon</b> (its Ancient Ones): each time a doom token lands on it, draw a <b>Dark Pharaoh special adventure</b> and put it into play facedown"} — if all four are already in play, fill the doom track and the Ancient One awakens immediately. These cards can't hold markers or tokens and are never trophies; resolved ones go to their own discard pile, which is shuffled to draw from once all four have been drawn or discarded.</li>
<li>The <b>Sand Dweller</b> monster has a midnight icon in its task list: at midnight, resolve the “At Midnight” effect on the back of its marker.</li>
</ul>`);
        src.push("OotP p.2, p.4–5");
      }
      return parts.join("\n") + `\n<p class="src-line">${src.join(" · ")}</p>`;
    } },

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
${c.mode === "museum" && !c.has("uf") ? "<li>First Aid on the Museum Entrance sheet heals 1 stamina <b>or</b> 1 sanity for free — the sheet is right, the old rulebook text isn't.</li>" : ""}
<li><b>Hastur:</b> “X” in his battle task = monsters in play when the last doom token was added (min 1).</li>
<li><b>Yig</b> loses you an Elder Sign whenever an investigator defeats any “Cultist” monster — but not when a spell or item does the defeating.</li>
<li><b>Shub-Niggurath</b> adds a one-terror task to every monster marker.</li>
${c.has("uf") ? "<li><b>Shudde M'ell</b> frees locked dice when his ability discards the adventure locking them; “Fresh Start” refreshes to 6 adventures but doesn't end his game.</li>" : ""}
${c.has("goa") && c.mode !== "alaska" ? "<li><b>Atlach-Nacha:</b> when she awakens, before adventures are discarded, each investigator loses 1 sanity per gate in play (a gate is a pair of gate tokens); the open gates are then set beside her sheet, and each time she attacks one gate moves onto the sheet and each investigator loses 1 sanity or 1 stamina per gate on the sheet. (No more than 3 gates can ever be open.) <b>Ghatanothoa:</b> no effect or ability may modify the green die of Annihilating Gaze. <b>Yog-Sothoth (Lurker at the Threshold):</b> in an Other World you can't use spells, but you may still use dice already secured on them, and Jenny may still discard a spell for the red and yellow dice.</li>" : ""}${c.has("ooi") ? "<li><b>Rhan-Tegoth:</b> gaining several Elder Signs from one reward triggers Insatiable Hunger only once.</li>" : ""}${c.has("ootp") && c.has("ootd") && c.mode !== "alaska" ? "<li><b>Haunter of the Dark</b> isn't triggered by completed Missions — they aren't trophies.</li>" : ""}
${!c.has("uf") ? "<li><b>Investigator errata:</b> <b>Carolyn Fern</b> — once per day, at the start of any player's turn, restore 1 Sanity to 1 investigator of her choice (including herself); <b>Vincent Lee</b> — the same for 1 Stamina; <b>Mandy Thompson</b> — once per day, after any player has rolled, reroll 2 dice before determining whether the active player completed a task. (Revised Edition cards and the Unseen Forces replacements already print this.)</li>" : ""}
${c.mode === "museum" ? "<li><b>The Stars Align…Above an Open Door</b> is the only Mythos card whose effect outlives midnight (its extra Adventure card stays until completed).</li>" : ""}
</ul>
<p class="src-line">FAQ p.2, p.4–7, p.9–11</p>` },

  { id: "roster", title: "Ancient One Roster",
    when: () => true,
    html: (c) => {
      const rows = [];
      rows.push(["base", "8 Ancient One cards, including Cthulhu · Hastur · Ithaqua · Nyarlathotep · Shub-Niggurath · Yig · Yog-Sothoth", "The eight originals. Nyarlathotep brings the mask monsters; Cthulhu's attack reduces max sanity/stamina (errata'd wording in FAQ)."]);
      if (c.has("uf")) rows.push(["uf", "4 new Ancient Ones, including Abhoth and Shudde M'ell", "Abhoth spawns his Children from a stockpile next to his card; Shudde M'ell's World Cracking discards failed adventures (freeing their locked dice)."]);
      if (c.has("goa")) rows.push(["goa", "Yibb-Tstll (easy) · Ghatanothoa (average) · Atlach-Nacha (hard) · Yog-Sothoth, Lurker at the Threshold (insane)", "Each has the gate doom icon: doom landing on it opens a gate in Streets of Arkham — in any other mode, each investigator loses 1 sanity instead."]);
      if (c.has("ooi")) rows.push(["ooi", "Rhan-Tegoth (average) · Rlim-Shaikorth (hard) · Ithaqua, alt (insane)", "Each has the storm doom icon (doom landing on it places 3 storm markers). The Alaska Expedition's dedicated trio — the mode's setup chooses among these."]);
      if (c.has("ootd")) rows.push(["ootd", "Hydra (average) · Dagon (hard) · Cthulhu, alt (insane)", "Each has the Deep One Legion doom icon."]);
      if (c.has("ootp")) rows.push(["ootp", "Haunter of the Dark (average) · Nephren-Ka (hard) · Nyarlathotep, alt (insane)", "Each has the Dark Pharaoh doom icon; the alt Nyarlathotep has his own mask-monster setup."]);
      const trs = rows.map(r => `<tr><td class="tag ${ES.expMeta[r[0]].cls}">${ES.expMeta[r[0]].name}</td><td><b>${r[1]}</b></td><td>${r[2]}</td></tr>`).join("");
      return `<div class="twrap"><table>${trs}</table></div>
<p class="src-line">Base p.2–5 · FAQ p.4, p.6 · UF p.1–2, p.4 · GoA p.5–6 · OoI p.2, p.5–6 · OotD p.5–6 · OotP p.2–4, p.6</p>`;
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
<p>Your turn is quick: <b>move</b> anywhere — any Adventure card in play or the entrance — then <b>resolve</b> where you are: attempt the Adventure, ${c.mode === "museum" ? "or use an entrance action to heal and shop" : c.mode === "streets" ? "or, on the Streets card, spend trophies to flip or swap an adventure or to heal" : "or stop at the entrance, skip straight to the clock, and spend trophies there to heal or shop for any one of us"}. Finally <b>advance the clock 3 hours</b>. Every time the clock strikes <b>midnight</b> — every four turns — a <b>Mythos card</b> hits us and “At Midnight” effects fire. Midnight is the drumbeat; everything we do races it.</p>` },

    { h: "The dice — the heart of the game", body: (c) => `
<p>Attempting an Adventure: roll the <b>six green dice</b>${c.has("uf") ? " (plus the white die if you're Blessed — and the black one if you're Cursed)" : ""} and try to complete <b>one task</b> — one row of symbols — per roll. Complete every row and the Adventure is yours. Fail to complete a row and, if any die shows a <b>terror</b> result, the card's <b>Terror</b> effect fires (and the current Mythos card's, if it has one), once per roll. Then you must <b>throw away a die</b> before you roll again, and the pool shrinks until you triumph or run dry. You can also give up and take the penalties instead of rolling again.</p>
<p>Your tools: <b>Clue tokens</b> reroll dice; <b>Common and Unique Items</b> add the stronger yellow and red dice; <b>Spells</b> freeze a good result for later; <b>focusing</b> (or a friend on the same card assisting) saves one die from a bad roll. Choose Adventures your pool can actually beat — the rewards tell you what's worth the risk.</p>` },

    { h: "Unseen Forces — blessings and curses", when: (c) => c.has("uf") && c.mode === "museum", body: (c) => `
<p>The museum entrance is now <b>four Entrance cards</b>, each its own place with its own ability — we start at the Souvenir Shop, and we seek a <b>Blessing</b> at the Chapel: Blessed investigators roll an extra white die every adventure. Get <b>Cursed</b> and the black die rides along instead, eating matching results. Some game effects can even close an entrance.${c.mod("master") ? " And we've shuffled the red-bordered <b>Master Mythos</b> cards into the deck — the midnights will be crueler than usual." : ""}</p>` },

    { h: "Rewards, penalties & trophies", body: (c) => `
<p>Every Adventure card shows its price and its prize: fail and take the red penalties (sanity, stamina, doom…); succeed and take the green — <b>items, allies, Clues, and the Elder Signs we're here for</b>. Resolved Adventures and slain monsters become <b>trophies</b> you spend ${c.mode === "streets" ? "on the Streets card to reshape the board or heal" : "at the entrance for healing and gear"}. Monsters that appear squat on Adventure cards as extra tasks — someone has to go be the hero.</p>
${c.mod("exhibit") ? "<p>This game also has <b>the Exhibit</b>: spend trophies at the entrance for <b>Relic</b> cards — the best gear in the game, able to buy back a die you already lost. The price: the mask monsters and the Dark Pharaoh's adventures join the game.</p>" : ""}
${(c.has("goa") || c.has("ootd")) ? "<p>Some rewards are <b>Skill</b> cards: a Skill you draw stays faceup in front of you until its own text says it expires, and only you can use it.</p>" : ""}` },

    { h: "Doom, midnight & the Ancient One", body: (c) => `
<p>Mythos cards add doom, spawn monsters, and curse the room${c.mod("expert") ? " — and with the <b>Expert Mythos</b> variant, resolving a watermarked option costs an extra doom token on top" : ""}. If the Doom track ever fills, the Ancient One <b>awakens</b>: every investigator is dragged into the final battle, rolling against its combat task to strip doom tokens away${c.mod("epicbattle") ? " — with the Epic Battle deck directing each round of the fight" : ""}. It's winnable, barely. Better plan: don't let it wake up.</p>
<p>If your <b>sanity or stamina</b> hits zero, you're devoured — new investigator, one doom token to the enemy${c.mod("phobia") ? " (with the Phobia deck, a sanity break instead gives you a permanent Phobia and refills your sanity — the doom token still lands — until a fourth Phobia, which devours you; once the Ancient One wakes, no more Phobias: zero sanity devours you)" : ""}${c.mod("epitaph") ? ". The fallen draw an <b>Epitaph</b> and resolve its effects, then lay it facedown beside the board with their investigator marker on it — our little cemetery grows" : ""}.</p>` },

    { h: "This mode's twist", when: (c) => c.mode !== "museum", body: (c) => {
      if (c.mode === "streets") return `<p><b>Streets of Arkham:</b> half the Adventures are facedown — walking onto one flips it, for better or worse. Penalties, doom and Mythos cards open <b>gates</b> to Other Worlds that must be entered and sealed, <b>Events</b> trigger where you stand, and joining the <b>Sheldon Gang or the Lodge</b> auto-completes their tasks. On the Streets card you may pay 2 trophies to flip a facedown adventure, swap out an empty one, or regain 1 stamina and 1 sanity — but then you must move straight on to an Arkham Adventure.</p>`;
      if (c.mode === "alaska") return `<p><b>Alaska Expedition:</b> we manage <b>supplies</b> (zero at midnight hurts everyone) and a <b>day track</b> — ${c.mod("winter") ? "it's Winter: Day 7 ends and we lose" : "Summer lets us play on past Day 7 — at a price in doom and storms every extra day"}. <b>Storms</b> pile onto Adventures and punish whoever resolves them; four storms on a card feeds doom. The trek is staged: finish “Into the Wild” to reach Stage II and the endgame.</p>`;
      if (c.mode === "rlyeh") return `<p><b>R'lyeh Rising:</b> Stage I is the voyage — manage the <b>Dark Waters track</b> and the <b>Deep One Legion</b>. We reach Stage II one of two ways: when the omen token reaches the ship space at the right end of the Dark Waters track, we may choose to travel on; or, the moment four Legions are on adventures, they <b>sink our ship</b> — we lose a broken amulet piece, the Ultima Thule flips to its Wreckage side, and Stage II starts whether we're ready or not. Stage II reveals the broken <b>Amulet of R'lyeh</b>: every piece we haven't recovered locks one of our dice until we find it. Collect amulet pieces like your dice depend on it, because they do. When we beat a Legion, we pay the cost on its back or it reappears on another adventure. <b>Missions</b> come out of the monster cup like monsters, but items and spells that defeat or discard monsters can't touch them; a finished mission waits facedown in front of you until you spend the trophies shown on its back, at the start of your Movement or Clock phase, to claim its reward.</p>`;
      return `<p><b>Lightless Pyramid:</b> the entrance flips between <b>Cairo</b> (where we gather supplies) and <b>Dashur</b> (the Elder Signs) — flipping costs clock time. The <b>Expedition</b> sheet is our toolkit: each expedition token we earn goes on an empty space and unlocks that space's effect, and some effects are used by discarding the token. Every <b>mask monster</b> is in the cup from the start (unless we face the Pharaoh's own Nyarlathotep, whose card says what to do with them). <b>Relics</b> are the best items in the game: they can re-buy a die you already lost. <b>Hidden Chambers</b> demand an unlock roll before you may even enter, and the <b>Dark Pharaoh</b> adventures stack up: if a fifth must appear, the Ancient One wakes instantly.${c.mod("expert") ? " Expert Mythos is on: watermarked Mythos options cost an extra doom." : ""}</p>`;
    }},

    { h: "Extras from our other expansions",
      when: (c) => (c.has("goa") && c.mode !== "streets" && c.mode !== "alaska") || (c.has("ooi") && c.mode !== "alaska") || (c.has("ootd") && c.mode !== "rlyeh") || (c.has("ootp") && c.mode !== "pyramid"),
      body: (c) => {
      const bits = [];
      if (c.has("goa") && c.mode !== "streets" && c.mode !== "alaska") bits.push(`<p><b>Gates of Arkham:</b> its Ancient Ones have a gate icon on the doom track — outside the Streets of Arkham, when doom lands on it, each of us loses 1 sanity.</p>`);
      if (c.has("ooi") && c.mode !== "alaska") bits.push(`<p><b>Omens of Ice:</b> its Ancient Ones have a storm icon on the doom track — when doom lands on it, we place 3 facedown <b>storm markers</b> on adventures, up to 4 per card. Whoever starts their Resolution phase on a stormy adventure flips those storms and suffers whatever they show, and at midnight every adventure holding 4 storms adds a doom token. Some of its monsters carry a midnight icon, meaning an “At Midnight” effect waits on the back of the marker.</p>`);
      if (c.has("ootd") && c.mode !== "rlyeh") bits.push(`<p><b>Omens of the Deep:</b> ${c.mode === "alaska" ? "if a <b>Deep One Legion</b> appears, it comes from its own stockpile" : "its Ancient Ones have a Deep One Legion icon on the doom track — when doom lands on it, a <b>Deep One Legion</b> appears from its own stockpile"}, and when we beat one we pay the cost on its back or it pops up on another adventure. <b>Missions</b> come out of the monster cup like monsters, but items and spells that defeat or discard monsters can't touch them. Finish one and it waits facedown in front of you until you spend the trophies shown on its back, at the start of your Movement or Clock phase, to claim its reward.</p>`);
      if (c.has("ootp") && c.mode !== "pyramid") bits.push(`<p><b>Omens of the Pharaoh:</b> ${c.mode === "alaska" ? "if a game effect brings in a <b>Dark Pharaoh</b> special adventure, it enters play facedown" : "its Ancient Ones have a Dark Pharaoh icon on the doom track — when doom lands on it, a <b>Dark Pharaoh</b> special adventure enters play facedown"}, and if all four are already out, the Ancient One awakens on the spot. Its Sand Dweller monster carries a midnight icon, so an “At Midnight” effect waits on the back of that marker.</p>`);
      return bits.join("");
    }},

    { h: "Don't worry about these yet", body: (c) => {
      const later = ["exact monster placement", "locked dice"];
      if (c.has("uf") && c.mode !== "museum") later.push("Blessed and Cursed dice");
      if (c.mod("master") && c.mode !== "museum") later.push("the red-bordered Master Mythos cards");
      return `<p>I'll explain ${later.join(", ")} when they first appear. Opening advice: spend Clues freely — a Clue saved is usually a turn wasted — and always know what today's midnight is about to do.</p>`;
    }}
  ]
};
