/* =============================================================================
   Eldritch Horror — Setup & Reference Utility
   Data model: base game + eight expansions, an Ancient One roster, optional
   modules, the full 9-step setup with expansion inserts, and reference.

   Sources: base Rulebook (the Reference Guide is the definitive rules source),
   each expansion's rulebook/rulesheet, and the community-compiled Ultimate
   FAQ 2.0 (3 Jan 2024), which collects official FFG rulings and errata.
   Per its own text, rulings in that document take precedence.
   ============================================================================= */

const EH = {};

/* ---- Sets ------------------------------------------------------------------ */
EH.expansions = [
  { id: "base", name: "Eldritch Horror", short: "Base Game", year: 2013, kind: "base",
    blurb: "The core cooperative game: 1–8 investigators race across the world map solving three Mysteries before the Ancient One's Doom track hits zero." },
  { id: "fl", name: "Forsaken Lore", short: "Forsaken Lore", year: 2014, kind: "exp",
    blurb: "Card expansion: Yig, new Mysteries for every base Ancient One, hundreds of new encounters, and the Lost in Time and Space Condition. Everything shuffles straight in." },
  { id: "mom", name: "Mountains of Madness", short: "Mountains of Madness", year: 2014, kind: "exp",
    blurb: "The Antarctica side board, Ithaqua and Rise of the Elder Things, Preludes, the Focus action, Unique Assets, Adventures, and Monster resistances." },
  { id: "sr", name: "Strange Remnants", short: "Strange Remnants", year: 2015, kind: "exp",
    blurb: "Syzygy and the Mystic Ruins Encounter deck — monuments of lost civilizations — plus Preludes, Focus, Unique Assets and Cosmic Alignment Adventures." },
  { id: "utp", name: "Under the Pyramids", short: "Under the Pyramids", year: 2015, kind: "exp",
    blurb: "The Egypt side board, Nephren-Ka and Abhoth, Impairment tokens, Local paths, the Museum Heist Adventures, and Preludes." },
  { id: "soc", name: "Signs of Carcosa", short: "Signs of Carcosa", year: 2016, kind: "exp",
    blurb: "Hastur and the spreading madness of the King in Yellow: new investigators, Preludes, Unique Assets and Impairment tokens." },
  { id: "td", name: "The Dreamlands", short: "The Dreamlands", year: 2016, kind: "exp",
    blurb: "The Dreamlands side board with Dream Portals and Dream-Quests, Hypnos and Atlach-Nacha, Focus, Unique Assets and Preludes." },
  { id: "cir", name: "Cities in Ruin", short: "Cities in Ruin", year: 2017, kind: "exp",
    blurb: "Shudde M'ell and his earthquakes: Disaster cards that devastate the world's cities, Devastation Encounters, new investigators and Preludes." },
  { id: "mon", name: "Masks of Nyarlathotep", short: "Masks of Nyarlathotep", year: 2018, kind: "exp",
    blurb: "Nyarlathotep and Antediluvium, Personal Stories for every investigator, Resources and the Gather Resources action, more Mystic Ruins, and the six-game campaign mode." }
];

EH.expMeta = {
  base: { name: "Base Game",            cls: "e-base" },
  faq:  { name: "FAQ / Errata",         cls: "e-faq"  },
  fl:   { name: "Forsaken Lore",        cls: "e-fl"   },
  mom:  { name: "Mountains of Madness", cls: "e-mom"  },
  sr:   { name: "Strange Remnants",     cls: "e-sr"   },
  utp:  { name: "Under the Pyramids",   cls: "e-utp"  },
  soc:  { name: "Signs of Carcosa",     cls: "e-soc"  },
  td:   { name: "The Dreamlands",       cls: "e-td"   },
  cir:  { name: "Cities in Ruin",       cls: "e-cir"  },
  mon:  { name: "Masks of Nyarlathotep",cls: "e-mon"  }
};

/* ---- Ancient Ones ------------------------------------------------------------
   notes = only claims verifiable from the PDFs; src = where those claims are
   found. Every Ancient One also has a Setup effect printed on its sheet that
   must be resolved during step 5.                                            */
EH.ancientOnes = [
  { id: "azathoth", name: "Azathoth", set: "base", src: "Base Rulebook p.3–5 · FAQ p.9–10",
    notes: "Recommended for a first game — the most straightforward Ancient One. Doom starts at 15; his setup places 1 Eldritch token on the green space of the Omen track (Doom advances by 1 per Eldritch token there whenever the Omen advances to green). Win by solving 3 Mysteries. If Azathoth ever awakens, the world is devoured — there is no final battle." },
  { id: "cthulhu", name: "Cthulhu", set: "base", src: "Base Rulebook p.11, p.16",
    notes: "Win by solving 3 Mysteries before Doom reaches zero; if he awakens, resolve the flip side and its Final Mystery." },
  { id: "shub", name: "Shub-Niggurath", set: "base", src: "FAQ/Errata p.1 · Base Rulebook p.16",
    notes: "If she awakens (errata'd wording): spawn the Shub-Niggurath Epic Monster on The Heart of Africa, then move all Ghoul, Goat Spawn and Dark Young Monsters to that space. From then on, her Cultists' reckoning moves them toward her; defeating her solves the Final Mystery." },
  { id: "yog", name: "Yog-Sothoth", set: "base", src: "Base Rulebook p.11, p.16",
    notes: "Win by solving 3 Mysteries before Doom reaches zero; if he awakens, resolve the flip side and its Final Mystery." },
  { id: "yig", name: "Yig", set: "fl", src: "FAQ p.9, p.21",
    notes: "Setup sets aside exactly 6 Cultist Monsters (extras stay in the cup; removed Cultists return to the set-aside pool up to 6). Uniquely, a player defeated after Yig awakens is not eliminated — they choose a new investigator as normal." },
  { id: "ithaqua", name: "Ithaqua", set: "mom", src: "MoM p.7 · FAQ p.13, p.16",
    notes: "The Wind-Walker. Hypothermia Conditions feature heavily — remember they block all Health recovery during Rest actions." },
  { id: "elderthings", name: "Rise of the Elder Things", set: "mom", src: "MoM p.3–4 · FAQ p.21",
    notes: "Setup sets aside all Rise of the Elder Things Special Encounters and builds the ANTARCTICA SIDE BOARD (see the side-board setup step below). Requires 4 solved Mysteries to win instead of 3. After resolving an Other World Encounter you may move to Plateau of Leng. Its Cultists are mind-controlled victims: pass the Lore test and you free them, defeating the Cultist and gaining a random Ally." },
  { id: "syzygy", name: "Syzygy", set: "sr", src: "SR p.2, p.4 · FAQ p.10, p.20",
    notes: "Setup builds the MYSTIC RUINS ENCOUNTER DECK (shuffle all Mystic Ruins cards; another player cuts the deck; place the Mystic Ruins token on the space matching the top card). Beware Omen effects: 'advance the Omen to the red space' triggers her ability even if it wraps all the way around. When she flips, solved Mysteries become Clues on her sheet — Mysteries aren't required to win, but they make the Final Mystery far easier." },
  { id: "nephrenka", name: "Nephren-Ka", set: "utp", src: "UtP p.3–4 · FAQ p.10",
    notes: "The Dark Pharaoh. Setup sets aside all Nephren-Ka Special Encounters and builds the EGYPT SIDE BOARD (see the side-board setup step below). His reckoning lets each investigator move 1 space toward The Bent Pyramid — anyone who doesn't move (including anyone already there) loses 1 Sanity." },
  { id: "abhoth", name: "Abhoth", set: "utp", src: "FAQ p.10 (overrides UtP p.7)",
    notes: "Separate his Special Encounters into their two decks by card back (Spawn of Abhoth and Deep Caverns). Spawn of Abhoth Special Encounters are NOT Combat Encounters — combat-only bonuses don't apply to their tests — but a Cultist defeated through one still clears your space for an additional encounter (FAQ, superseding the older Under the Pyramids printing). His sheet sets aside Cultist Monsters; effects referring to Monsters 'on this sheet' mean that set-aside pool." },
  { id: "hastur", name: "Hastur", set: "soc", src: "SoC p.4 · FAQ p.10",
    notes: "The King in Yellow. Watch the Spawn of Hastur Epic Monster: it can never lose more than 1 Health from a single effect." },
  { id: "hypnos", name: "Hypnos", set: "td", src: "The Dreamlands p.4 · FAQ p.11",
    notes: "Setup builds the DREAMLANDS SIDE BOARD (see the side-board setup step below). While playing against Hypnos, a Rest action recovers only Health or only Sanity — chosen before resolving, including any bonus recovery (FAQ)." },
  { id: "atlach", name: "Atlach-Nacha", set: "td", src: "The Dreamlands p.3 · Base Rulebook p.5 · FAQ p.20",
    notes: "Setup sets aside the Leng Spider Monster, and the Lead Investigator gains 1 Spell. Her reckoning spawns a Gate unless the group discards Clues and/or Spells equal to half the number of players. Her Cultists, when spawned, immediately scuttle to the nearest space without a Gate or Monster." },
  { id: "shudde", name: "Shudde M'ell", set: "cir", src: "CiR p.2",
    notes: "The burrower beneath brings the DISASTER deck to bear — expect cities to be devastated. If all nine named City spaces on the main board are ever devastated, the investigators lose." },
  { id: "nyarlathotep", name: "Nyarlathotep", set: "mon", src: "Masks p.3–4",
    notes: "Setup sets aside all Nyarlathotep Special Encounters, and his Mysteries use the four cult ADVENTURE stories (Brotherhood of the Dark Pharaoh, Cult of the Bloody Tongue, Order of the Bloated Woman, Cult of the Sand Bat). Only 2 solved Mysteries are needed to win — but an investigator whose Eldritch tokens reach their maximum Sanity is devoured." },
  { id: "antediluvium", name: "Antediluvium", set: "mon", src: "Masks p.4 · FAQ p.10, p.19",
    notes: "Setup builds the MYSTIC RUINS ENCOUNTER DECK (shuffle all Mystic Ruins cards — combine Strange Remnants' if you have it; another player cuts; place the Mystic Ruins token on the space matching the top card). When flipped, Sanity tokens already on the sheet stay there (FAQ)." }
];

/* ---- Modules & variants ------------------------------------------------------
   requires = one set id, or an array meaning "any of these" (every set whose
   rulebook prints the optional rule).                                        */
EH.modules = [
  { id: "stories", name: "Personal Stories", requires: "mon",
    summary: "Every investigator gets a Personal Mission with a unique Reward or Consequence.",
    description: "Decide before setup — all players use them or none do. During setup step 4 each investigator takes their Personal Mission card. Completing (or failing) it grants the matching Reward or Consequence, kept to the end of the game; these cards are not possessions or Conditions and can't be discarded by other effects. A replacement investigator enters with their own Personal Mission.",
    src: "Masks of Nyarlathotep p.6 · FAQ p.7" },
  { id: "campaign", name: "Campaign Mode", requires: "mon",
    summary: "Six sequential games; lose one and the world ends. Devastation and pacts carry over.",
    description: "Personal Stories are mandatory. Game 1's Ancient One is random, and each game also randomly determines the NEXT game's Ancient One — you play with two Preludes: the current Ancient One's own Prelude and the next one's (game 6 uses Unto the Breach). Defeated or devoured investigators are gone for the whole campaign; survivors carry forward (with their Reward/Consequence and any Dark Pact or Promise of Power), but not possessions or improvements. Devastated cities stay devastated. A defeated Ancient One can't be drawn again.",
    src: "Masks of Nyarlathotep p.7" },
  { id: "choosePrelude", name: "Control Your Fate (choose the Prelude)", requires: ["mom", "sr", "utp", "soc", "td", "cir", "mon"],
    summary: "The group picks the Prelude instead of drawing one at random.",
    description: "Instead of drawing a random Prelude card before setup, players as a group choose one Prelude — or choose to play without a Prelude entirely.",
    src: "Mountains of Madness p.6 · SR p.3 · UtP p.6 · SoC p.3 · The Dreamlands p.7 · CiR p.3 · Masks p.6" },
  { id: "noPrelude", name: "No Prelude", requires: ["mom", "sr", "utp", "soc", "td", "cir", "mon"],
    summary: "Skip the Prelude card entirely this game.",
    description: "The Control Your Fate optional rule allows the group to simply not use a Prelude card.",
    src: "Mountains of Madness p.6 · SR p.3 · UtP p.6 · SoC p.3 · The Dreamlands p.7 · CiR p.3 · Masks p.6" },
  { id: "staged", name: "Staged Difficulty", requires: ["mom", "td", "mon"],
    summary: "Stage I easy Mythos cards, Stage II normal, Stage III hard — the game ramps up.",
    description: "Build stage I of the Mythos deck using only easy Mythos cards, stage II using only normal, stage III using only hard. For more pain, use normal blue cards in stage I and hard blue in stage II, and consider a Starting Rumor (Reference Guide).",
    src: "Mountains of Madness p.6 · The Dreamlands p.7 · Masks p.6" },
  { id: "insane", name: "Insane Difficulty", requires: ["sr", "soc", "td", "cir", "mon"],
    summary: "Build the whole Mythos deck from hard cards only.",
    description: "Harder than the Reference Guide's Hard difficulty: build the entire Mythos deck using only hard Mythos cards. May require additional expansions depending on the chosen Ancient One's deck requirements.",
    src: "Strange Remnants p.3 · Signs of Carcosa p.3 · The Dreamlands p.7 · Cities in Ruin p.3 · Masks p.6" }
];

/* Which expansions bring Preludes into the pool */
EH.preludeSets = ["mom", "sr", "utp", "soc", "td", "cir", "mon"];

/* ---- helpers used by steps --------------------------------------------------- */
EH.helpers = {
  hasPreludes: (c) => EH.preludeSets.some(s => c.has(s)),
  sideBoard: (c) => {
    if (!c.ao) return null;
    if (c.ao.id === "elderthings") return "antarctica";
    if (c.ao.id === "nephrenka") return "egypt";
    if (c.ao.id === "hypnos") return "dreamlands";
    return null;
  },
  mysticRuins: (c) => c.ao && (c.ao.id === "syzygy" || c.ao.id === "antediluvium"),
  /* " · "-prefixed citations for the selected sets only, e.g. cite(c, { mom: "MoM p.5" });
     first = true keeps just the first selected set's citation */
  cite: (c, m, first) => {
    const ks = Object.keys(m).filter(k => c.has(k));
    return (first ? ks.slice(0, 1) : ks).map(k => " · " + m[k]).join("");
  }
};

/* ---- THE SETUP SEQUENCE ------------------------------------------------------ */
EH.phases = [
  { title: "Before Setup",
    steps: [
      { exp: "base",
        t: "Pool the expansion content",
        d: (c) => {
          const bits = ["<li>Add every selected expansion's Investigators, Ancient Ones, Encounter cards, Mythos cards, Mystery cards, Assets, Artifacts, Spells, Conditions and Monster tokens to their base-game decks and pools. Each expansion is designed to be used whole — its new mechanics need its other components.</li>"];
          if (c.has("mom") || c.has("sr") || c.has("utp") || c.has("soc") || c.has("td") || c.has("cir") || c.has("mon"))
            bits.push("<li>Shuffle all <b>Unique Assets</b> into one faceup deck next to the Asset deck.</li>");
          if (c.has("mom") || c.has("sr") || c.has("td") || c.has("mon"))
            bits.push("<li>Add the <b>Focus tokens</b> and <b>Adventure token</b> to the general token pool.</li>");
          if (c.has("utp") || c.has("soc"))
            bits.push("<li>Add the <b>Impairment tokens</b>" + ((c.has("utp") && !(c.has("mom") || c.has("sr") || c.has("td") || c.has("mon"))) ? " and the <b>Adventure token</b>" : "") + " to the general token pool.</li>");
          if (c.has("mon"))
            bits.push("<li>Add the <b>Resource tokens</b> and Masks' <b>3 extra Gate tokens</b> (Gate stack) to the pools.</li>");
          if (c.has("cir"))
            bits.push("<li>Shuffle the <b>Disaster deck</b> (facedown by the Mythos deck) and the <b>Devastation Encounter deck</b> (with the other encounter decks); add the <b>Devastation tokens</b> to the pool.</li>");
          bits.push("<li><b>Stays in the box unless called for:</b> side boards and their encounter decks, board-specific Clues/Gates, Mystic Ruins cards, and Adventure cards — they are used only by specific Ancient Ones or Preludes (this checklist adds the ones your chosen Ancient One needs; a Prelude that needs one says so).</li>");
          return "<ul>" + bits.join("") + "</ul>";
        },
        src: (c) => "“Using This Expansion”" + EH.helpers.cite(c, { fl: "FL p.1", mom: "MoM p.2", sr: "SR p.1", utp: "UtP p.2", soc: "SoC p.1", td: "The Dreamlands p.2", cir: "CiR p.1", mon: "Masks p.2" }),
        when: (c) => EH.expansions.some(e => e.id !== "base" && c.has(e.id)) },
      { exp: "mon",
        t: "Decide on Personal Stories",
        d: "All players together decide whether to use <b>Personal Stories</b> this game — everyone plays with them or nobody does. (Toggle the module above to include them in these steps.)",
        src: "Masks of Nyarlathotep p.6",
        when: (c) => c.has("mon") && !c.mod("stories") && !c.mod("campaign") },
      { exp: (c) => "base",
        t: "Draw the Prelude",
        d: (c) => {
          if (c.mod("noPrelude") && !c.mod("campaign")) return "You've chosen to play <b>without a Prelude</b> (Control Your Fate optional rule) — skip this step.";
          let d = c.mod("campaign")
            ? "<b>Campaign mode</b> — no random draw. In games 1–5, first randomly determine the Ancient One for the <i>next</i> game (defeated ones excluded), then play with <b>two Preludes</b>: the one matching this game's Ancient One and the one matching the next game's. In game 6, play this game's Prelude plus <i>Unto the Breach</i>."
            : c.mod("choosePrelude")
            ? "Using <b>Control Your Fate</b>: the group chooses one <b>Prelude card</b> instead of drawing at random."
            : "Draw <b>one random Prelude card</b>.";
          d += " Resolve " + (c.mod("campaign") ? "each Prelude's" : "its") + " effect immediately unless it specifies other timing (such as “after resolving setup”). Preludes can add side boards, Adventures, the Mystic Ruins deck, or other twists.";
          if (c.has("mon") && (c.has("mom") || c.has("sr") || c.has("td") || c.has("utp")))
            d += " Masks of Nyarlathotep reprints four earlier Preludes (<i>Beginning of the End</i>, <i>The Dunwich Horror</i>, <i>Twin Blasphemies of the Black Goat</i>, <i>Call of Cthulhu</i>) — remove the duplicates you own from the pool.";
          return d;
        },
        src: (c) => "Mountains of Madness p.4 · Masks p.4" + (c.mod("campaign") ? " · Masks p.7" : (c.mod("choosePrelude") || c.mod("noPrelude")) ? EH.helpers.cite(c, { mom: "MoM p.6", sr: "SR p.3", utp: "UtP p.6", soc: "SoC p.3", td: "The Dreamlands p.7", cir: "CiR p.3", mon: "Masks p.6" }, true) : ""),
        when: (c) => EH.helpers.hasPreludes(c) }
    ] },

  { title: "Core Setup (Rulebook steps 1–4)",
    steps: [
      { exp: "base",
        t: "1 · Place the game board",
        d: "Unfold the game board and place it in the center of the play area within easy reach of all players.",
        src: "Base Rulebook p.4, step 1",
        when: () => true },
      { exp: "base",
        t: "2 · Organize the tokens",
        d: (c) => {
          const sb = EH.helpers.sideBoard(c);
          const xg = [["mom", "Mountains of Madness"], ["utp", "Under the Pyramids"], ["mon", "Masks"]].filter(e => c.has(e[0]));
          return "<ul><li><b>Gate stack:</b> randomize the nine Gate tokens" + (xg.length ? " (" + ["twelve", "fifteen", "eighteen"][xg.length - 1] + " with the three non-side-board Gates from " + (xg.length > 1 ? "each of " : "") + xg.map(e => e[1]).join(", ") + ")" : "") + " facedown, common side up." + (sb ? " <b>Add the side board's three Gates first</b> — they shuffle into the stack." : "") + "</li>" +
          "<li><b>Clue pool:</b> all Clue tokens facedown (common side up), randomized." + (sb ? " <b>Add the side board's Clues</b> (" + (sb === "dreamlands" ? "seven" : "six") + ") before randomizing.</li>" : "</li>") +
          "<li><b>General pool:</b> Health, Sanity, Improvement, Travel Ticket, Eldritch, Mystery and Rumor" + ((c.has("mom") || c.has("sr") || c.has("td") || c.has("mon")) ? ", plus Focus" : "") + ((c.has("utp") || c.has("soc")) ? ", Impairment" : "") + ((c.has("mon")) ? ", Resource" : "") + ((c.has("cir")) ? ", Devastation" : "") + " tokens in reach of everyone.</li></ul>";
        },
        src: (c) => {
          const sb = EH.helpers.sideBoard(c);
          return "Base Rulebook p.4, step 2" + EH.helpers.cite(c, { mom: "MoM p.2–3", sr: "SR p.1", utp: "UtP p.2–3", soc: "SoC p.1", td: "The Dreamlands p.2", cir: "CiR p.1", mon: "Masks p.2" }) +
            (sb === "antarctica" ? " · MoM p.4" : sb === "egypt" ? " · UtP p.4" : sb === "dreamlands" ? " · The Dreamlands p.4" : "");
        },
        when: () => true },
      { exp: "base",
        t: "3 · Choose and place investigators",
        d: (c) => "Agree on a player to take the <b>Lead Investigator token</b> (random if you can't decide). Starting with the Lead Investigator and going clockwise, each of the <b>" + c.p + "</b> player" + (c.p > 1 ? "s" : "") + " chooses an investigator, takes the sheet, and places the matching token on the <b>starting space printed on the back of the sheet</b>." + (c.has("td") ? " (Exception: <i>Luke Robinson</i> waits — after setup he starts on any space containing a Gate, or anywhere if there are none.)" : ""),
        src: (c) => "Base Rulebook p.4, step 3" + (c.has("td") ? " · FAQ p.7 (Luke Robinson)" : ""),
        when: () => true },
      { exp: "base",
        t: "4 · Starting possessions, Health and Sanity",
        d: (c) => "Each investigator takes the <b>starting possessions</b> listed on the back of their sheet (matching cards from the box) and <b>Health and Sanity tokens equal to their printed maximums</b>." + ((c.mod("stories") || c.mod("campaign")) ? " Each investigator also takes their <b>Personal Mission</b> card (matched by portrait art) and places it with their possessions." + (c.mod("campaign") ? " Anyone who earned a Reward or Consequence in a previous campaign game starts with it, and carried-over Dark Pact / Promise of Power Conditions return." : "") : ""),
        src: (c) => "Base Rulebook p.4, step 4" + ((c.mod("stories") || c.mod("campaign")) ? " · Masks p.6–7" : ""),
        when: () => true }
    ] },

  { title: "The Ancient One (steps 5–6)",
    steps: [
      { exp: "base",
        t: "5 · Determine the Ancient One",
        d: (c) => {
          let d = c.ao
            ? "You are facing <b>" + c.ao.name + "</b>. Place the sheet faceup (Doom value visible, top-left) near the board and <b>resolve the Setup effect printed on the sheet</b>."
            : "As a group, choose an <b>Ancient One sheet</b>, place it faceup near the board, and <b>resolve its Setup effect</b>.";
          if (c.ao) d += "<br><i>" + c.ao.notes + "</i>";
          if (c.mod("campaign")) d += "<br>Campaign: this Ancient One was selected at random (game 1) or during the previous game's setup, and the <b>next</b> game's Ancient One was already determined for the Preludes (not in game 6).";
          return d;
        },
        src: (c) => "Base Rulebook p.4, step 5" + (c.ao ? " · " + c.ao.src : "") + (c.mod("campaign") ? " · Masks p.7" : ""),
        when: () => true },
      { exp: (c) => EH.helpers.sideBoard(c) === "antarctica" ? "mom" : EH.helpers.sideBoard(c) === "egypt" ? "utp" : "td",
        t: "5a · Set up the side board",
        d: (c) => {
          const sb = EH.helpers.sideBoard(c);
          if (sb === "antarctica") return "<ul><li>Unfold the <b>Antarctica side board</b> near the main board.</li><li>Its 6 Clues and 3 Gates are already in the pools (step 2).</li><li><b>Set aside from the Monster cup:</b> 1 Elder Thing, 1 Giant Penguin, 1 Proto-Shoggoth and 1 Shoggoth — anything that would return to the cup is set aside instead.</li><li>Shuffle the <b>Outpost</b>, <b>Mountain</b> and <b>Antarctica Research</b> Encounter decks near the board.</li><li>Antarctica ↔ Miskatonic Outpost are joined by a Local path (once per round, free, not while Delayed); or spend 2 successes from an Acquire Assets action to jump to Miskatonic Outpost.</li></ul>";
          if (sb === "egypt") return "<ul><li>Unfold the <b>Egypt side board</b> near the main board.</li><li>Its 6 Clues and 3 Gates are already in the pools (step 2).</li><li><b>Set aside from the Monster cup:</b> 1 Mummy, 1 Sand Dweller and 1 Spawn of Sebak — anything that would return to the cup is set aside instead.</li><li>Shuffle the <b>Egypt</b> and <b>Africa</b> Encounter decks near the board.</li><li>Connections: The Pyramids ↔ Alexandria, Cairo, Tel el-Amarna and The Bent Pyramid (Local paths); The Heart of Africa ↔ The Nile River (Local); space 10 ↔ The Sahara Desert (Local); space 17 ↔ Cairo (Ship path).</li></ul>";
          return "<ul><li>Unfold the <b>Dreamlands side board</b> near the main board.</li><li>Its 7 Clues and 3 Gates are already in the pools (step 2).</li><li><b>Set aside from the Monster cup:</b> 1 Ghoul, 1 Moon-beast, 1 Nightgaunt and 1 Zoog — anything that would return to the cup is set aside instead.</li><li>Shuffle the <b>Dreamlands</b> and <b>Dream-Quest</b> Encounter decks; place the <b>Dream-Quest token</b> on the space matching the top Dream-Quest card.</li><li><b>Spawn 3 Dream Portals:</b> reveal Gates from the top of the Gate stack until three reveal main-board spaces; place a Dream Portal token on each. Revealed Gates stay revealed in the stack — do not reshuffle.</li><li>Reach the Dreamlands by Dream Portal (Local path to its twin space), or when Resting off-board: spend 1 Clue or pass a Will–1 test to move to The Enchanted Wood.</li></ul>";
        },
        src: (c) => EH.helpers.sideBoard(c) === "antarctica" ? "Mountains of Madness p.4" : EH.helpers.sideBoard(c) === "egypt" ? "Under the Pyramids p.4–5" : "The Dreamlands p.4–5",
        when: (c) => !!EH.helpers.sideBoard(c) },
      { exp: (c) => c.ao && c.ao.id === "syzygy" ? "sr" : "mon",
        t: "5a · Build the Mystic Ruins deck",
        d: (c) => "Shuffle all <b>Mystic Ruins Encounter cards</b>" + ((c.has("sr") && c.has("mon")) ? " — Strange Remnants' and Masks' cards combine into one deck" : "") + " and have <b>another player cut the deck</b>. Place the <b>Mystic Ruins token</b> on the space matching the top card's back; it moves whenever the top card changes. During the Encounter Phase an investigator there may draw and resolve the top card (a complex, multi-test encounter).",
        src: (c) => "Strange Remnants p.2 · Masks of Nyarlathotep p.4" + ((c.has("sr") && c.has("mon")) ? " · FAQ p.19" : ""),
        when: (c) => EH.helpers.mysticRuins(c) },
      { exp: "base",
        t: "6 · Create the Monster cup",
        d: "Place all <b>non-Epic Monster tokens</b> in an opaque container (bowl, mug, box lid) and shake to randomize. <b>Epic Monsters never go in the cup</b> — they are red with a clipped corner, and are spawned only by effects that name them. Set-aside monsters (Ancient One or side-board instructions) also stay out.",
        src: "Base Rulebook p.4, step 6 · p.15",
        when: () => true }
    ] },

  { title: "Decks & Final Steps (steps 7–9)",
    steps: [
      { exp: "base",
        t: "7 · Separate and place the decks",
        d: (c) => "<ul><li>Return every <b>Research Encounter, Special Encounter and Mystery card that does not match " + (c.ao ? c.ao.name : "the chosen Ancient One") + "</b> to the box (each carries its Ancient One's portrait on the back). Keep the matching Research deck, Mystery deck, and any Special Encounter decks its setup names — <b>separate Special Encounters into decks by card back</b>.</li><li>Shuffle <b>all Expedition Encounter cards into a single deck</b> regardless of back.</li><li>Shuffle the <b>Spell</b> and <b>Condition</b> decks and place them <b>faceup</b> (name and art showing — their backs are secret).</li><li>Separate all other encounter cards into decks by back (America, Europe, Asia/Australia, General, Other World) and shuffle each.</li><li>Set the Mythos cards aside for step 8.</li></ul>",
        src: "Base Rulebook p.4, step 7 · FAQ p.10 (Special Encounter backs)",
        when: () => true },
      { exp: "base",
        t: "8 · Build the Mythos deck",
        d: (c) => {
          let d = "Separate the Mythos cards into <b>green, yellow and blue</b> piles and shuffle each. Following the chart at the bottom of the Ancient One sheet, build <b>Stage I, II and III</b> from random cards of the listed colors and counts, shuffling each stage on its own; stack them Stage I on top, III on the bottom. <b>Do not shuffle the combined deck</b>, and return unused Mythos cards to the box unseen.";
          if (c.mod("staged")) d += "<br><b>Staged Difficulty:</b> use only <i>easy</i> cards for Stage I, <i>normal</i> for Stage II, <i>hard</i> for Stage III.";
          if (c.mod("insane")) d += "<br><b>Insane Difficulty:</b> build the entire deck using only <i>hard</i> Mythos cards.";
          return d;
        },
        src: (c) => "Base Rulebook p.5–6, step 8" + (c.mod("staged") ? EH.helpers.cite(c, { mom: "MoM p.6", td: "The Dreamlands p.7", mon: "Masks p.6" }, true) : "") + (c.mod("insane") ? EH.helpers.cite(c, { sr: "SR p.3", soc: "SoC p.3", td: "The Dreamlands p.7", cir: "CiR p.3", mon: "Masks p.6" }, true) : ""),
        when: () => true },
      { exp: "base",
        t: "9 · Resolve the starting effects (A–H)",
        d: "<ul><li><b>A.</b> Place the <b>Reference card</b> matching the player count by the Mythos deck; box the rest.</li><li><b>B.</b> Put the <b>Doom token</b> on the Doom-track space printed top-left on the Ancient One sheet.</li><li><b>C.</b> Put the <b>Omen token</b> on the <b>green (comet)</b> space of the Omen track.</li><li><b>D.</b> Deal the top <b>four Asset cards</b> faceup into the reserve slots.</li><li><b>E.</b> <b>Spawn Gates</b> equal to the Reference card's number — top token of the Gate stack faceup on its printed space, plus <b>one random Monster from the cup</b> on each.</li><li><b>F.</b> Place the <b>Active Expedition token</b> on the space matching the back of the top Expedition Encounter card.</li><li><b>G.</b> <b>Spawn Clues</b> equal to the Reference card's number (random Clue tokens facedown on their printed spaces).</li><li><b>H.</b> Draw one <b>Mystery card</b> for the Ancient One, place it by the sheet, and resolve any “when this card enters play” effect.</li></ul>",
        src: "Base Rulebook p.5, step 9",
        when: () => true },
      { exp: "base",
        t: "Begin the first round",
        d: (c) => "Play proceeds in rounds of three phases — <b>Action → Encounter → Mythos</b> — starting with the Lead Investigator and passing clockwise, until the investigators win or the world ends." + ((c.mod("stories") || c.mod("campaign")) ? " Keep Personal Missions visible — several trigger from ordinary play." : "") + " The full phase structure is in the reference below." + (EH.helpers.hasPreludes(c) && (!c.mod("noPrelude") || c.mod("campaign")) ? " (Some Preludes fire “after resolving setup” — check yours now.)" : ""),
        src: (c) => "Base Rulebook p.6" + (EH.helpers.hasPreludes(c) && (!c.mod("noPrelude") || c.mod("campaign")) ? " · MoM p.4" : ""),
        when: () => true }
    ] }
];

/* ---- REFERENCE SECTIONS ------------------------------------------------------ */
EH.reference = [
  { id: "round", title: "The Game Round",
    when: () => true,
    html: (c) => `
<h4>1 · Action Phase</h4>
<p>Starting with the Lead Investigator and going clockwise, each investigator performs <b>up to two actions</b> — each specific action at most <b>once per round</b>:</p>
<ul>
<li><b>Travel</b> — move to an adjacent space; then spend travel tickets (max 2 held) to move one extra space each (Train tickets on Train paths, Ship tickets on Ship paths).</li>
<li><b>Prepare for Travel</b> — on a City space, gain 1 travel ticket matching a path connected to your space.</li>
<li><b>Acquire Assets</b> — on a City space with no Monster: test <b>Influence</b>; gain reserve Assets totaling ≤ your successes${c.has("mon") ? " (spend Resources for +1 success each)" : ""}. No cards gained? You may discard one reserve card. Refill the reserve afterward.</li>
<li><b>Rest</b> — no Monster on your space: recover 1 Health and 1 Sanity${c.has("mon") ? " (spend Resources for +1 Health or Sanity each)" : ""}${c.ao && c.ao.id === "hypnos" ? " — <b>against Hypnos: only Health or only Sanity, chosen first</b>" : ""}.</li>
<li><b>Trade</b> — exchange possessions (Assets, Artifacts, Clues, Spells, travel tickets${(c.has("mom") || c.has("sr") || c.has("td") || c.has("cir") || c.has("utp") || c.has("soc") || c.has("mon")) ? ", Unique Assets" : ""}${c.has("mon") ? ", Resources" : ""}) with an investigator on your space. Traded items are not “gained.”</li>
${(c.has("mom") || c.has("sr") || c.has("td") || c.has("mon")) ? "<li><b>Focus</b> — gain 1 Focus token (max 2). Spend a Focus to reroll one die during any test, any number of times. Focus is not a possession and is lost when defeated.</li>" : ""}
${c.has("mon") ? "<li><b>Gather Resources</b> — gain 1 Resource token (max 2).</li>" : ""}
<li><b>Component actions</b> — any effect starting with bold <b>Action:</b> on a card or your sheet. Each component's action once per round, but different components each count separately (two copies = two uses). <b>Local Action:</b> effects can be used from components held by others on your space.</li>
</ul>
<h4>2 · Encounter Phase</h4>
<ul>
<li>Each investigator (Lead first, clockwise) resolves <b>one encounter</b>.</li>
<li>On a space with Monsters you <b>must</b> resolve a Combat Encounter against each one, in your chosen order${(c.has("fl") || c.has("mom") || c.has("sr") || c.has("utp") || c.has("soc") || c.has("td") || c.has("cir") || c.has("mon")) ? " — <b>all non-Epic Monsters before any Epic Monster</b>" : ""}. Clear them all and you may still take a normal encounter.</li>
<li>Otherwise choose: a <b>location encounter</b> (your space's regional deck or the General deck — resolve the entry matching your space's type or name) or a <b>token encounter</b>: Clue → Research Encounter; Gate → Other World Encounter; Active Expedition → Expedition Encounter; Rumor → that Rumor's encounter; defeated investigator → the encounter on their sheet back${c.has("cir") ? "; devastated space → Devastation Encounter (its only option besides tokens)" : ""}${EH.helpers.mysticRuins(c) ? "; Mystic Ruins token → top Mystic Ruins card" : ""}${EH.helpers.sideBoard(c) === "dreamlands" ? "; Dream-Quest token → top Dream-Quest card" : ""}.</li>
<li><b>Complex encounters</b> (Expedition, Other World, Special${c.has("cir") ? ", Devastation" : ""}${EH.helpers.mysticRuins(c) ? ", Mystic Ruins" : ""}${EH.helpers.sideBoard(c) === "dreamlands" ? ", Dream-Quest" : ""}): resolve the top box; pass → middle box, fail → bottom box.</li>
<li>“As an encounter” effects follow normal encounter rules — Monsters must be gone first. “Instead of resolving an encounter” effects (like Detained) work even with Monsters present (FAQ).</li>
</ul>
<h4>3 · Mythos Phase</h4>
<p>The Lead Investigator draws the top Mythos card and resolves its icons <b>left to right, top to bottom</b>:</p>
<ol>
<li><b>Advance Omen</b> — move the Omen token one space clockwise, then advance Doom 1 per Gate matching the new Omen space.</li>
<li><b>Reckoning</b> — trigger every reckoning-icon effect in play, in order: Monsters, Ancient One sheet, ongoing Mythos cards, then investigator possessions/Conditions. Components added mid-reckoning don't trigger this pass (FAQ).</li>
<li><b>Spawn Gates</b> — per the Reference card (top Gate token + 1 random Monster on its space).</li>
<li><b>Monster Surge</b> — at each Gate matching the current Omen: spawn the Reference card's number of Monsters. No matching Gates? Spawn one Gate instead.</li>
<li><b>Spawn Clues</b> — per the Reference card.</li>
<li><b>Place Rumor token</b> / <b>place Eldritch tokens</b> as shown.</li>
<li><b>Resolve the text</b> — an <i>Event</i> resolves and discards; an <i>Ongoing</i> card stays in play.</li>
</ol>
<p>Only icons printed on the card are resolved. At the end of the phase the Lead Investigator may pass the Lead token to anyone. If a Mythos card can't be drawn (deck empty), the phase ends and — if you haven't already won — <b>you lose</b> (errata wording).</p>
<p class="src-line">Base Rulebook p.6–12 · FAQ/Errata p.1${c.ao && c.ao.id === "hypnos" ? ", p.11" : ""}${(c.has("mom") || c.has("sr") || c.has("td") || c.has("mon")) ? ", p.14" : ""}, p.17–18, p.21${EH.helpers.cite(c, { fl: "FL p.2", mom: "MoM p.5–6", sr: EH.helpers.mysticRuins(c) ? "SR p.2–3" : "SR p.3", utp: "UtP p.5–6", soc: "SoC p.2–3", td: EH.helpers.sideBoard(c) === "dreamlands" ? "The Dreamlands p.5–6" : "The Dreamlands p.6", cir: "CiR p.2–3", mon: EH.helpers.mysticRuins(c) ? "Masks p.4–5" : "Masks p.5" })}</p>` },

  { id: "tests", title: "Tests, Skills & Rerolls",
    when: () => true,
    html: (c) => `
<ul>
<li>Roll dice equal to the tested <b>skill</b> (sheet value ± Improvement/Impairment tokens) plus any modifier printed with the test (e.g. “–1”) plus bonuses. <b>5s and 6s are successes</b>; one success passes unless the effect says otherwise. Your final pool below 1 die? Roll <b>1 die</b>.</li>
<li>Only <b>one bonus card effect per test</b> — use the single highest that applies (errata). Rerolls, dice-manipulation and “additional dice” effects stack freely on top.</li>
<li>Declare additional dice <b>before</b> rolling — you can't add them after seeing the roll (FAQ).</li>
<li><b>Rerolls:</b> spend 1 Clue to reroll one die, repeatable${(c.has("mom") || c.has("sr") || c.has("td") || c.has("mon")) ? "; spend 1 Focus to reroll one die, repeatable" : ""}. A manipulated die counts as if it rolled its new value naturally (FAQ).</li>
<li><b>Improve a skill</b>: gain the matching Improvement token (+1, flip to +2; max +2)${(c.has("utp") || c.has("soc")) ? ". <b>Impair a skill</b>: gain a –1 token (flip to –2; max –2). Improvements and impairments on the same skill cancel each other; a skill can't be impaired below a value of 1" : ""}.</li>
<li>A <b>skill's value</b> = printed value ± tokens only; test-time bonuses from Assets don't count toward effects that compare skill values.</li>
<li>An effect telling you to roll dice outside a test (Conditions, reckonings) is <b>not a test</b> — test rerolls and bonuses don't apply.</li>
</ul>
<p class="src-line">Base Rulebook p.12 · FAQ/Errata p.1, p.3–4, p.6, p.18${EH.helpers.cite(c, { mom: "MoM p.5", sr: "SR p.3", utp: "UtP p.5–6", soc: "SoC p.2–3", td: "The Dreamlands p.6", cir: "CiR p.3", mon: "Masks p.5" })}</p>` },

  { id: "combat", title: "Combat Encounters",
    when: () => true,
    html: (c) => `
<ul>
<li>Flip the Monster token and read its back. Resolve the <b>Will test</b> first: lose Sanity equal to (its <b>horror</b> − your successes). Then the <b>Strength test</b>: lose Health equal to (its <b>damage</b> − your successes), and the Monster loses <b>Health equal to your successes</b>.</li>
<li>A Monster with total lost Health ≥ its <b>toughness</b> is defeated → back to the cup (toughness reduced to 0 also defeats it). Undefeated Monsters keep their damage tokens.</li>
<li><b>Alternate tests:</b> a different skill icon replaces Will or Strength on some Monsters — test that skill instead.</li>
<li><b>Epic Monsters</b> (red, clipped corner): immune to being moved, discarded or returned to the cup — except that a solved Rumor discards the Epic Monsters it placed (errata); defeated ones (lost Health ≥ toughness) go to the box. Spawned only by name${(c.has("fl") || c.has("mom") || c.has("sr") || c.has("utp") || c.has("soc") || c.has("td") || c.has("cir") || c.has("mon")) ? "; fight all non-Epics on your space first" : ""}.</li>
<li><b>Ambush:</b> “a Monster ambushes you” — draw from the cup, fight immediately, then return it to the cup win or lose, and continue the interrupted effect.</li>
${(c.has("mom") || c.has("sr") || c.has("utp") || c.has("soc") || c.has("cir") || c.has("mon")) ? "<li><b>Physical Resistance</b>: no dice-pool bonuses apply except from Spells and MAGICAL possessions. <b>Magical Resistance</b>: no bonuses from Spells or MAGICAL possessions. Rerolls and dice manipulation always work. Test-substitution spells (Storm of Spirits) aren't bonuses and slip past both — though bonuses to the substituted skill are still filtered as usual (FAQ).</li>" : ""}
<li>Defeating the last Monster on your space still lets you take a normal encounter afterward — unless an effect (Gug, Byakhee movement) replaces it (FAQ).</li>
<li>“During a Combat Encounter” means the tests printed on the Monster token itself; spells cast alongside aren't part of the encounter (FAQ).</li>
</ul>
<p class="src-line">Base Rulebook p.9, p.14–15 · MoM p.6${c.has("fl") ? " · FL p.2" : ""} · FAQ/Errata p.1${(c.has("mom") || c.has("sr") || c.has("utp") || c.has("soc") || c.has("cir") || c.has("mon")) ? ", p.16, p.18–21" : ", p.19–21"}</p>` },

  { id: "defeat", title: "Health, Sanity & Defeated Investigators",
    when: () => true,
    html: (c) => `
<ul>
<li>Health/Sanity never exceed your maximums; reducing a maximum clamps the current value but doesn't otherwise lower it. <b>Losing</b> is involuntary; <b>spending</b> is a voluntary cost — effects care about the difference. Group losses can't initially assign more to an investigator than they have; any loss left over after mitigation can then go to anyone.</li>
<li><b>At 0 Health or 0 Sanity you are defeated:</b> ① advance Doom by 1; ② move your token to the nearest City space, tip it over, and mark it with a Health token (crippled) or Sanity token (insane); ③ leave your possessions on your sheet (Conditions, Health/Sanity, Improvements${(c.has("mom") || c.has("sr") || c.has("td") || c.has("mon")) ? ", Focus" : ""} are discarded); ④ pass the Lead Investigator token if you held it.</li>
<li>Another investigator on that space may later <b>encounter the defeated token</b>: resolve the Crippled or Insane encounter on the sheet's back — usually gaining the possessions and possibly retreating Doom — then remove that investigator from the game.</li>
<li><b>Devoured</b> investigators skip the token: advance Doom, pass the Lead token if held, discard everything, sheet out of the game.</li>
<li>The defeated player chooses a <b>new investigator at the end of the Mythos Phase</b> (starting possessions come from decks, discard piles or the reserve — not from other investigators). After the Ancient One awakens, defeat means <b>elimination</b> instead${c.ao && c.ao.id === "yig" ? " — except against Yig, where you keep drawing new investigators" : ""}. Every player eliminated = game lost.</li>
<li>Exact timing matters: everyone defeated by the same effect that awakens the Ancient One still gets replacements; only defeats <i>after</i> the awakening eliminate (FAQ).</li>
</ul>
<p class="src-line">Base Rulebook p.14, p.16 · FAQ p.3–4, p.7, ${c.ao && c.ao.id === "yig" ? "p.9–10" : "p.10"}${(c.has("mom") || c.has("sr") || c.has("td") || c.has("mon")) ? ", p.14" : ""}, p.19, p.22</p>` },

  { id: "gates", title: "Gates, Omen & Doom",
    when: () => true,
    html: (c) => `
<ul>
<li><b>Spawning a Gate:</b> top token of the Gate stack faceup on its printed space + 1 random Monster from the cup there. Monsters with the spawn icon resolve their back-of-token effect immediately.</li>
<li><b>Closing a Gate</b> — usually via an Other World Encounter's “close this Gate” — discards it. Discarding a Gate by other effects is <b>not</b> “closing” it.</li>
<li><b>Advancing the Omen</b> = move it clockwise one step at a time, advancing Doom 1 per matching Gate <i>per step</i>. Merely <b>moving</b> the Omen advances no Doom. “Advance to the red space” from the red space wraps all the way around — four advances${c.ao && c.ao.id === "syzygy" ? ", and yes, that triggers Syzygy" : ""}.</li>
<li><b>Doom advances one space at a time</b>; at “0” the Ancient One awakens (flip the sheet, resolve its Awakens effect, play on toward the Final Mystery — its back replaces everything on the front, Cultists included).</li>
<li>Multiple Gates or Clues can share a space. A “random space” = flip a Clue token from the pool and use its back.</li>
${EH.helpers.sideBoard(c) === "dreamlands" ? "<li><b>Dream Portals:</b> a Gate that would spawn on a portal space spawns on the portal's twin space instead. Spawning a portal reveals Gates from the top of the stack (revealed Gates stay put, stack unshuffled) until a legal main-board space appears.</li>" : ""}
</ul>
<p class="src-line">Base Rulebook p.10–12, p.16 · FAQ p.19–21, p.23${EH.helpers.sideBoard(c) === "dreamlands" ? " · The Dreamlands p.5" : ""}</p>` },

  { id: "mysteries", title: "Mysteries, Rumors & Winning",
    when: () => true,
    html: (c) => `
<ul>
<li><b>Win:</b> solve <b>three Mysteries</b>${c.ao && c.ao.id === "elderthings" ? " — <b>four against Rise of the Elder Things</b>" : ""}${c.ao && c.ao.id === "nyarlathotep" ? " — <b>only two against Nyarlathotep</b>" : ""}. Each solved Mystery immediately reveals the next. If the Ancient One awakens first, you must also solve the <b>Final Mystery</b> on the sheet's back${c.ao && c.ao.id === "azathoth" ? " — but Azathoth has none: if he wakes, the world is devoured and the game is lost" : ""}${c.ao && ["cthulhu", "shudde", "syzygy", "yig"].includes(c.ao.id) ? " — though against " + c.ao.name + ", once awake, solving any additional Mysteries is not required (FAQ)" : ""}.</li>
<li><b>Lose:</b> the Ancient One's lose condition on its back; all players eliminated; a card effect says so; or the Mythos deck runs out.</li>
${(c.has("mom") || c.has("sr") || c.has("utp") || c.has("soc") || c.has("td") || c.has("cir") || c.has("mon")) ? "<li><b>“Advance the active Mystery”:</b> place one required token on it (Clue/Gate/Monster from their pools); if it needs an Epic Monster defeated, place 2 Health on the card (each Health = −1 toughness; if it spawns several Epics, place 1). Clues placed this way can be spent by anyone resolving that card." + (c.has("mon") ? " If the active Mystery had you set aside Adventure cards, the current Adventure counts as the active Mystery for advancing." : "") + " The Final Mystery is never “the active Mystery.”</li>" : ""}
<li><b>Rumors</b> (blue Ongoing Mythos cards) place Rumor tokens; encounter the token to work the Rumor's own effect. A solved Rumor discards the card, tokens on it, and the Rumor tokens/Epic Monsters/Eldritch tokens it placed — but not Clues, Gates, ordinary Monsters, or Conditions it handed out (errata). Unsolved Rumors often end the game or maim the world.</li>
</ul>
<p class="src-line">Base Rulebook p.6, p.11, p.16${c.ao && c.ao.id === "elderthings" ? " · MoM p.3" : ""}${c.ao && c.ao.id === "nyarlathotep" ? " · Masks p.3" : ""}${(c.has("mom") || c.has("sr") || c.has("utp") || c.has("soc") || c.has("td") || c.has("cir") || c.has("mon")) ? " · MoM p.6 · CiR p.3" : ""}${c.has("mon") ? " · Masks p.5" : ""} · FAQ/Errata p.1, p.9–11</p>` },

  { id: "possessions", title: "Possessions, Conditions & Delayed",
    when: () => true,
    html: (c) => `
<ul>
<li><b>Spells and Conditions are double-sided</b> — gain them showing the front; never peek at the back until an effect flips them. All text on a Spell, front and back, counts as that Spell's effect, but only a card's currently showing face is active (FAQ).</li>
<li>You <b>cannot</b> gain a copy of a Condition you already have (nor choose to), and you cannot voluntarily discard possessions — trade them away or wait for an effect.</li>
<li>Searching a deck also searches its discard pile (bottom-to-top); named cards come from the reserve directly.</li>
<li><b>Delayed</b> (tipped token): you skip your actions — standing back up <i>is</i> your Action Phase. Becoming Delayed mid-action ends your turn and eats remaining actions; already-Delayed investigators can't be Delayed again (so a “lose 3 Health unless Delayed” effect just hurts). “During the Action Phase” effects (including Local-path moves) are unavailable while Delayed.</li>
${c.has("fl") ? "<li><b>Lost in Time and Space:</b> off the board entirely — no space, no actions, no movement, immune to Mythos/reckonings except its own Condition; passes the Lead token; can't take part in group spending. Still wins or loses with the team.</li>" : ""}
${(c.has("mom") || c.has("utp") || c.has("td")) ? "<li><b>Local paths</b> join spaces so close no action is needed: once per round during the Action Phase (not while Delayed) move along any number of interconnected Local paths — before, during or between your actions. Locally-joined spaces are adjacent, and the path counts as 1 for distances.</li>" : ""}
${(c.has("mom") || c.has("sr") || c.has("utp") || c.has("soc") || c.has("td") || c.has("cir") || c.has("mon")) ? "<li><b>Unique Assets</b> are double-sided possessions (no value, no limit, duplicates fine); “Asset” includes them, “non-Unique Asset” excludes them; random-Asset draws never come from the Unique deck; discarding one discards its tokens.</li>" : ""}
<li>Conditions blocking Rest recovery (Poisoned, Hypothermia, Despair…) also block <i>bonus</i> recovery during that Rest — even if discarded mid-resolution; recovery outside Rest actions is fine.</li>
</ul>
<p class="src-line">Base Rulebook p.13 · FAQ/Errata p.1${(c.has("mom") || c.has("sr") || c.has("utp") || c.has("soc") || c.has("td") || c.has("cir") || c.has("mon")) ? ", p.9" : ""}, p.11–15, p.17${(c.has("mom") || c.has("utp") || c.has("td")) ? ", p.23" : ""}${c.has("fl") ? " · FL p.2" : ""}${(c.has("mom") || c.has("sr") || c.has("utp") || c.has("soc") || c.has("td") || c.has("cir") || c.has("mon")) ? " · MoM p.5" : ""}${c.has("mom") ? " · MoM p.4" : ""}${c.has("utp") ? " · UtP p.5" : ""}${c.has("td") ? " · The Dreamlands p.5" : ""}</p>` },

  { id: "expmech", title: "Expansion Mechanics on the Table",
    when: (c) => EH.expansions.some(e => e.id !== "base" && c.has(e.id)),
    html: (c) => {
      const bits = [];
      if (c.has("mom") || c.has("sr") || c.has("td") || c.has("mon"))
        bits.push("<li><b>Focus</b> (action): gain 1 token, max 2; spend to reroll one die per token, unlimited per test.</li>");
      if (c.has("mon"))
        bits.push("<li><b>Resources</b> (Gather Resources action): max 2, tradable. Spend during Rest (+1 Health/Sanity each) or Acquire Assets (+1 success each).</li>");
      if (c.has("utp") || c.has("soc"))
        bits.push("<li><b>Impairments</b>: permanent −1/−2 skill tokens; they annihilate Improvement tokens 1-for-1, can't push a skill below 1, max two per skill.</li>");
      if (c.has("cir"))
        bits.push("<li><b>Disasters & Devastation</b>: Disaster cards (read by the Lead Investigator, resolved immediately) devastate named City spaces — discard its Clues and defeated investigator tokens, box its Expedition cards, place a Devastation token. A devastated space has no type: no General/location encounters, only the Devastation Encounter deck. Clues can't spawn or move there. <b>All nine main-board cities devastated = you lose.</b></li>");
      if (c.has("mom") || c.has("sr") || c.has("utp") || c.has("td") || c.has("mon"))
        bits.push("<li><b>Adventures</b> (specific Preludes/Ancient Ones): staged stories — resolve “when this card enters play,” complete via the printed effect, resolve “when completed,” draw the next stage. The Adventure token marks where the action is.</li>");
      if (c.mod("stories") || c.mod("campaign"))
        bits.push("<li><b>Personal Stories</b>: your Mission's completion grants the Reward, its failure the Consequence — permanent, undiscardable, not a possession. A dead investigator's story dies too.</li>");
      return "<ul>" + bits.join("") + "</ul><p class='src-line'>MoM p.5 · SR p.2–3 · UtP p.5 · SoC p.2 · The Dreamlands p.4, p.6 · CiR p.2 · Masks p.4–6" + ((c.mod("stories") || c.mod("campaign")) ? " · FAQ p.7" : "") + "</p>";
    } },

  { id: "rulings", title: "Rulings Worth Remembering (FAQ & Errata)",
    when: () => true,
    html: (c) => `
<ul>
<li>The <b>Reference Guide beats the rulebook</b>; a card beats both; “cannot” is absolute; the Ultimate FAQ's rulings take precedence over everything older. Half a number = round up. The Lead Investigator settles disputes.</li>
<li>“May,” “or” and “unless” are all choices. With “unless” you may resolve the effect after it; if you won't or can't, resolve the effect before it — even one that does nothing (discarding all of zero Improvement tokens is legal).</li>
<li>Effects on “an investigator” include yourself unless they say “another.” “You” = one single investigator.</li>
<li>A triggered effect fires once per trigger, resolving <i>after</i> its triggering event completes (Astral Travel's bonus space comes after the whole Travel action).</li>
<li>Passive bonuses aren't optional; “may” bonuses are.</li>
<li>An additional action can't repeat an action you already took this round — component actions from different copies excepted.</li>
<li>Eldritch tokens are anonymous — one placed by a Mystery equals one placed by a reckoning${c.has("mon") ? " (except tokens gained <i>by an investigator</i>, e.g. Corruption, which sit on your sheet until spent)" : ""}.</li>
<li>Reading ahead on encounter cards is legal — suspense is optional.</li>
</ul>
<p class="src-line">Base Rulebook p.2–3, p.16 · Ultimate FAQ 2.0 p.3–4, p.7${c.has("mon") ? ", p.13" : ""}, p.15, p.17–19${c.has("mon") ? " · Masks p.5" : ""}</p>` },

  { id: "roster", title: "Ancient One Roster",
    when: () => true,
    html: (c) => {
      const rows = EH.ancientOnes.filter(a => c.has(a.set)).map(a =>
        `<tr><td class="tag ${EH.expMeta[a.set].cls}">${EH.expMeta[a.set].name}</td><td><b>${a.name}</b></td><td>${a.notes}<div class="src-line">${a.src}</div></td></tr>`).join("");
      return `<div class="twrap"><table>${rows}</table></div>`;
    } }
];

/* ---- TEACHING SCRIPT (read aloud, ~5 min; content per the base rulebook /
   Reference Guide, expansion rulebooks and Ultimate FAQ — see references) ---- */
EH.teach = {
  intro: "Read this aloud — about five minutes. Sheets down until the end.",
  sections: [
    { h: "The pitch — and how we win", body: (c) => {
      const myst = c.ao && c.ao.id === "elderthings" ? "four Mysteries" : c.ao && c.ao.id === "nyarlathotep" ? "just two Mysteries" : "three Mysteries";
      return `
<p>An <b>Ancient One</b> is stirring${c.ao ? ` — ours is <b>${c.ao.name}</b>` : ""} — and we are the investigators crossing the globe to stop it. We win by solving <b>${myst}</b>: each Mystery card names what it wants — usually Clues, closed Gates, or dead monsters delivered to the right places.</p>
<p>We lose when the <b>Doom track hits zero</b> and the Final Mystery beats us${c.ao && c.ao.id === "azathoth" ? " — and against Azathoth there is no Final Mystery: if he wakes, the world simply ends" : ""}, when the Mythos deck runs out, or when every investigator is gone. Fully cooperative: the board is the enemy, so talk everything through.</p>
${!EH.helpers.hasPreludes(c) ? "" : c.mod("campaign")
  ? "<p>One more thing: our two <b>Prelude cards</b> have already twisted this particular game during setup — read them out now, because they change the opening.</p>"
  : c.mod("noPrelude")
  ? "<p>One more thing: we're playing <b>without a Prelude</b> this time — the Control Your Fate rule lets us skip it.</p>"
  : "<p>One more thing: " + (c.mod("choosePrelude") ? "the <b>Prelude card</b> we picked ourselves (Control Your Fate)" : "a <b>Prelude card</b>") + " has already twisted this particular game during setup — read it out now, because it changes the opening.</p>"}`;
    }},

    { h: "The round — actions, encounters, doom", body: (c) => `
<p>Every round has three phases. <b>Actions</b>: each of us takes two — travel, prepare, shop, rest, trade. <b>Encounters</b>: each of us resolves one story where we stand — this is where Clues, items and progress actually come from. <b>Mythos</b>: we flip the card that makes everything worse — doom, gates, monsters, rumors${c.has("cir") ? ". With Cities in Ruin on the table, some effects also draw <b>Disasters</b> that can flatten whole cities into devastated ruins (all nine main-board cities devastated and we lose outright)" : ""}.</p>
<p>That's the rhythm: two deliberate steps forward, one card dragging us back.${(c.mod("staged") || c.mod("insane")) ? ` And fair warning — we've stacked the Mythos deck ${c.mod("insane") ? "entirely from <b>hard</b> cards (Insane difficulty)" : "to escalate: easy, then normal, then <b>hard</b> (Staged difficulty)"}.` : ""}</p>` },

    { h: "Your two actions — and why", body: (c) => `
<p><b>Travel</b> moves you one space — grab train and ship <b>tickets</b> with Prepare for Travel in a city to chain further; being in the right city is half this game. <b>Acquire Assets</b> shops with an Influence test. <b>Rest</b> heals body and mind. <b>Trade</b> hands gear to whoever needs it${(c.has("mom") || c.has("sr") || c.has("td") || c.has("mon")) ? ". <b>Focus</b> banks a reroll token — cheap insurance before a big test" : ""}${c.has("mon") ? ". <b>Gather Resources</b> stocks the currency that boosts Rests and shopping" : ""}. Cards with a bold <b>Action:</b> line add more options.</p>
${(c.has("mom") || c.has("utp") || c.has("td")) && (EH.helpers.sideBoard(c) || !c.mod("noPrelude") || c.mod("campaign"))
  ? "<p>" + (EH.helpers.sideBoard(c) ? "Our side board links" : "Any side board a Prelude brings out links") + " to the main map by <b>Local paths</b>: once per round, during your own turn and never while Delayed, you can slide along them for free — no action spent." +
    (EH.helpers.sideBoard(c) === "antarctica" ? " You can also spend two successes from an Acquire Assets action to move straight to Miskatonic Outpost." : "") +
    (EH.helpers.sideBoard(c) === "dreamlands" ? " Here those links are <b>Dream Portals</b>, and resting anywhere off the side board lets you drift into The Enchanted Wood by spending a Clue or passing a Will test at −1." : "") + "</p>"
  : ""}` },

    { h: "Tests — the universal dice", body: (c) => `
<p>Everything risky is a <b>test</b>: roll dice equal to the named skill, and every <b>5 or 6</b> is a success — usually one is enough. Spend a <b>Clue</b> to reroll a die, as often as you can pay${(c.has("mom") || c.has("sr") || c.has("td") || c.has("mon")) ? "; Focus tokens do the same" : ""}. <b>Improvement tokens</b> raise a skill permanently — train your specialty${(c.has("utp") || c.has("soc")) ? " — and their evil twins, <b>Impairment tokens</b>, drag skills down until cancelled" : ""}. Low dice? Don't roll there; go where your investigator is strong. That's the whole tactical layer.</p>` },

    { h: "Encounters, gates & combat", body: (c) => `
<p>On a clear space, read an encounter for your location — or encounter a <b>token</b>: a <b>Clue</b> gives a Research encounter (these feed the Mystery), a <b>Gate</b> pulls you into an Other World (pass, and you <b>close the Gate</b>), an <b>Expedition</b> pays big on faraway continents${EH.helpers.mysticRuins(c) ? ", and the <b>Mystic Ruins</b> token offers its own deck of monument encounters" : ""}.</p>
<p>Monsters block all that: stand with one and you <b>must fight</b> — a Will test (lose Sanity if short), then a Strength test (lose Health, deal your successes as damage). Some monsters are simply not your job today; walking around them is a strategy.</p>
${EH.expansions.some(e => e.id !== "base" && c.has(e.id))
  ? "<p>" + [
      "<b>Epic Monsters</b> — the big red ones, only ever spawned by name — wait their turn: you fight every ordinary monster on a space before the Epic one.",
      (c.has("fl") || c.has("mom") || c.has("utp")) ? "Some monsters swap the Will or Strength test for a different skill — test whatever skill the token shows instead." : "",
      (c.has("mom") || c.has("sr") || c.has("utp") || c.has("soc") || c.has("cir") || c.has("mon")) ? "And watch for <b>Physical Resistance</b>: only Spells and Magical possessions add dice against it" + ((c.has("mom") || c.has("utp")) ? ", while <b>Magical Resistance</b> blocks exactly those" : "") + ". Rerolls still work against resistant monsters." : ""
    ].filter(Boolean).join(" ") + "</p>"
  : ""}` },

    { h: "Doom, the Omen & dying", body: (c) => `
<p>The <b>Omen</b> wheel advances with the Mythos deck; each step charges Doom for every Gate matching the new Omen color — open Gates are a ticking bill, close them. At <b>zero Doom the Ancient One awakens</b> and everything gets harder.</p>
<p>Hit 0 Health or Sanity and you're <b>defeated</b>: you drag Doom down one, your body is moved to the nearest city, and you return as a fresh investigator at the end of the Mythos phase — someone should visit your old body for its stuff and its story. After the awakening, defeat is permanent${c.ao && c.ao.id === "yig" ? " — except against Yig, where we keep drawing new investigators" : ""}.</p>` },

    { h: "What our expansions add", when: (c) => EH.expansions.some(e => e.id !== "base" && c.has(e.id)), body: (c) => {
      const any = (...ids) => ids.some(id => c.has(id));
      const prelude = EH.helpers.hasPreludes(c) && (!c.mod("noPrelude") || c.mod("campaign"));
      const adv = [prelude && any("mom", "sr", "utp", "td") ? "Certain Preludes" : "", c.has("mon") && (!c.ao || c.ao.id === "nyarlathotep") ? "Nyarlathotep's Mysteries" : ""].filter(Boolean);
      const p = [];
      if (c.has("fl"))
        p.push("Forsaken Lore adds the <b>Lost in Time and Space</b> Condition: whoever gains it leaves the board entirely — no actions, no movement, untouched by Mythos cards and reckonings — and only that Condition card affects them. They still win or lose with the rest of us.");
      if (any("mom", "sr", "utp", "soc", "td", "cir", "mon")) {
        p.push("Some encounters pay out <b>Unique Assets</b>: double-sided treasures that trade like any possession, with no limit on how many you hold. Like Spells, you can't look at the back until an effect lets you" + (any("mom", "utp") ? " — and some are Tasks: do what the card asks and you get to flip it." : "."));
        p.push("Some effects <b>advance the active Mystery</b>, putting progress straight onto the card — usually one of the tokens it's asking for.");
      }
      if (adv.length)
        p.push(adv.join(" and ") + " can bring out <b>Adventures</b>: multi-chapter side stories. An Adventure token marks where to go; completing a chapter pays off and draws the next one.");
      if (any("sr", "mon") && prelude && !EH.helpers.mysticRuins(c))
        p.push("A Prelude may also set up the <b>Mystic Ruins</b> deck; its token marks a ruin we can explore as an encounter.");
      if (c.has("mon"))
        p.push("Masks can also hand you <b>Eldritch tokens</b> personally — Corruption does it — and they stay on your sheet until an effect lets you spend or discard them.");
      return p.length ? "<p>" + p.join("</p><p>") + "</p>" : "";
    }},

    { h: "Your Ancient One", when: (c) => !!c.ao, body: (c) => `
<p>${c.ao.notes}</p>` },

    { h: "Personal Stories", when: (c) => c.mod("stories") || c.mod("campaign"), body: (c) => `
<p>Each of us also carries a <b>Personal Mission</b> — a personal side quest with a real reward for finishing and a real consequence for failing. It's yours alone; weave it into the team plan${c.mod("campaign") ? ". And remember, this is a <b>campaign</b>: surviving investigators carry their Reward or Consequence and any Dark Pact or Promise of Power into the next game — and if we lose once, the whole world falls" : ""}.</p>` },

    { h: "Don't worry about these yet", body: (c) => {
      const later = ["Conditions' hidden backs", "reckonings", "Rumor cards"];
      if (EH.helpers.sideBoard(c)) later.push("the side board's own encounter decks");
      if (c.has("cir")) later.push("Devastation Encounters");
      if (c.has("td")) later.push("Gates revealed in the stack");
      return `<p>I'll explain ${later.join(", ")} when the first one appears. Opening advice: split up — clustered investigators waste encounters — and read your Mystery out loud <i>now</i>, because every turn should serve it.</p>`;
    }}
  ]
};
