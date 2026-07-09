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
    blurb: "The Antarctica side board, Ithaqua and Rise of the Elder Things, Preludes, the Focus action, Unique Assets, Adventures, and Epic Monster resistances." },
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
   notes = only claims verifiable from the PDFs. Every Ancient One also has a
   Setup effect printed on its sheet that must be resolved during step 5.     */
EH.ancientOnes = [
  { id: "azathoth", name: "Azathoth", set: "base",
    notes: "Recommended for a first game — the most straightforward Ancient One. Doom starts at 15; his setup places 1 Eldritch token on the green space of the Omen track (Doom advances by 1 per Eldritch token there whenever the Omen reaches green). Win by solving 3 Mysteries. If Azathoth ever awakens, the world is devoured — there is no final battle." },
  { id: "cthulhu", name: "Cthulhu", set: "base",
    notes: "Win by solving 3 Mysteries before Doom reaches zero; if he awakens, resolve the flip side and its Final Mystery." },
  { id: "shub", name: "Shub-Niggurath", set: "base",
    notes: "If she awakens (errata'd wording): spawn the Shub-Niggurath Epic Monster on The Heart of Africa, then move all Ghoul, Goat Spawn and Dark Young Monsters to that space. Her Cultists' reckoning moves them toward her; defeating her solves the Final Mystery." },
  { id: "yog", name: "Yog-Sothoth", set: "base",
    notes: "Win by solving 3 Mysteries before Doom reaches zero; if he awakens, resolve the flip side and its Final Mystery." },
  { id: "yig", name: "Yig", set: "fl",
    notes: "Setup sets aside exactly 6 Cultist Monsters (extras stay in the cup; removed Cultists return to the set-aside pool up to 6). Uniquely, a player defeated after Yig awakens is not eliminated — they choose a new investigator as normal." },
  { id: "ithaqua", name: "Ithaqua", set: "mom",
    notes: "The Wind-Walker. Hypothermia Conditions feature heavily — remember they block all Health recovery during Rest actions." },
  { id: "elderthings", name: "Rise of the Elder Things", set: "mom",
    notes: "Setup sets aside all Rise of the Elder Things Special Encounters and builds the ANTARCTICA SIDE BOARD (see the side-board setup step below). Requires 4 solved Mysteries to win instead of 3. After resolving an Other World Encounter you may move to Plateau of Leng. Its Cultists are mind-controlled victims: pass the Lore test and you free them, defeating the Cultist and gaining a random Ally." },
  { id: "syzygy", name: "Syzygy", set: "sr",
    notes: "Setup builds the MYSTIC RUINS ENCOUNTER DECK (shuffle all Mystic Ruins cards; another player cuts the deck; place the Mystic Ruins token on the space matching the top card). Beware Omen effects: 'advance the Omen to the red space' triggers her ability even if it wraps all the way around. When she flips, solved Mysteries become Clues on her sheet — Mysteries aren't required to win, but they make the Final Mystery far easier." },
  { id: "nephrenka", name: "Nephren-Ka", set: "utp",
    notes: "The Dark Pharaoh. Setup sets aside all Nephren-Ka Special Encounters and builds the EGYPT SIDE BOARD (see the side-board setup step below). His reckoning pulls each investigator 1 space toward The Bent Pyramid — anyone who doesn't move (including anyone already there) loses 1 Sanity." },
  { id: "abhoth", name: "Abhoth", set: "utp",
    notes: "Separate his Special Encounters into their two decks by card back (Spawn of Abhoth and Deep Caverns). Spawn of Abhoth Special Encounters are NOT Combat Encounters — combat-only bonuses don't apply to their tests — but a Cultist defeated through one still clears your space for an additional encounter (FAQ, superseding the older Under the Pyramids printing). His sheet sets aside Cultist Monsters; effects referring to Monsters 'on this sheet' mean that set-aside pool." },
  { id: "hastur", name: "Hastur", set: "soc",
    notes: "The King in Yellow. Watch the Spawn of Hastur Epic Monster: it can never lose more than 1 Health from a single effect." },
  { id: "hypnos", name: "Hypnos", set: "td",
    notes: "Setup builds the DREAMLANDS SIDE BOARD (see the side-board setup step below). While playing against Hypnos, a Rest action recovers only Health or only Sanity — chosen before resolving, including any bonus recovery (FAQ)." },
  { id: "atlach", name: "Atlach-Nacha", set: "td",
    notes: "Setup sets aside the Leng Spider Monster, and the Lead Investigator gains 1 Spell. Her reckoning spawns a Gate unless the group discards Clues and/or Spells equal to half the reference number. Cultists she spawns immediately scuttle to a space without a Gate or Monster." },
  { id: "shudde", name: "Shudde M'ell", set: "cir",
    notes: "The burrower beneath brings the DISASTER deck to bear — expect cities to be devastated. If all nine named City spaces on the main board are ever devastated, the investigators lose." },
  { id: "nyarlathotep", name: "Nyarlathotep", set: "mon",
    notes: "Setup sets aside all Nyarlathotep Special Encounters, and his Mysteries use the four cult ADVENTURE stories (Brotherhood of the Dark Pharaoh, Cult of the Bloody Tongue, Order of the Bloated Woman, Cult of the Sand Bat). Only 2 solved Mysteries are needed to win — but an investigator whose Eldritch tokens reach their maximum Sanity is devoured." },
  { id: "antediluvium", name: "Antediluvium", set: "mon",
    notes: "Setup builds the MYSTIC RUINS ENCOUNTER DECK (shuffle all Mystic Ruins cards — combine Strange Remnants' if you have it; another player cuts; place the Mystic Ruins token on the space matching the top card). When flipped, Sanity tokens already on the sheet stay there (FAQ)." }
];

/* ---- Modules & variants ------------------------------------------------------ */
EH.modules = [
  { id: "stories", name: "Personal Stories", requires: "mon",
    summary: "Every investigator gets a Personal Mission with a unique Reward or Consequence.",
    description: "Decide before setup — all players use them or none do. During setup step 4 each investigator takes their Personal Mission card. Completing (or failing) it grants the matching Reward or Consequence, kept to the end of the game; these cards are not possessions or Conditions and can't be discarded by other effects. A replacement investigator enters with their own Personal Mission.",
    src: "Masks of Nyarlathotep p.6" },
  { id: "campaign", name: "Campaign Mode", requires: "mon",
    summary: "Six sequential games; lose one and the world ends. Devastation and pacts carry over.",
    description: "Personal Stories are mandatory. Game 1's Ancient One is random, and each game also randomly determines the NEXT game's Ancient One — you play with two Preludes: the current Ancient One's own Prelude and the next one's (game 6 uses Unto the Breach). Defeated or devoured investigators are gone for the whole campaign; survivors carry forward (with their Reward/Consequence and any Dark Pact or Promise of Power), but not possessions or improvements. Devastated cities stay devastated. A defeated Ancient One can't be drawn again.",
    src: "Masks of Nyarlathotep p.7" },
  { id: "choosePrelude", name: "Control Your Fate (choose the Prelude)", requires: "mom",
    summary: "The group picks the Prelude instead of drawing one at random.",
    description: "Instead of drawing a random Prelude card before setup, players as a group choose one Prelude — or choose to play without a Prelude entirely.",
    src: "Mountains of Madness p.6 (and every later rulebook)" },
  { id: "noPrelude", name: "No Prelude", requires: "mom",
    summary: "Skip the Prelude card entirely this game.",
    description: "The Control Your Fate optional rule allows the group to simply not use a Prelude card.",
    src: "Mountains of Madness p.6" },
  { id: "staged", name: "Staged Difficulty", requires: "mom",
    summary: "Stage I easy Mythos cards, Stage II normal, Stage III hard — the game ramps up.",
    description: "Build stage I of the Mythos deck using only easy Mythos cards, stage II using only normal, stage III using only hard. For more pain, use normal blue cards in stage I and hard blue in stage II, and consider a Starting Rumor (Reference Guide).",
    src: "Mountains of Madness p.6 · The Dreamlands p.7 · Masks p.6" },
  { id: "insane", name: "Insane Difficulty", requires: "sr",
    summary: "Build the whole Mythos deck from hard cards only.",
    description: "Harder than the Reference Guide's Hard difficulty: build the entire Mythos deck using only hard Mythos cards. May require additional expansions depending on the chosen Ancient One's deck requirements.",
    src: "Strange Remnants p.3 · Signs of Carcosa p.3 · Cities in Ruin p.3" }
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
  mysticRuins: (c) => c.ao && (c.ao.id === "syzygy" || c.ao.id === "antediluvium")
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
            bits.push("<li>Add the <b>Impairment tokens</b> to the general token pool.</li>");
          if (c.has("mon"))
            bits.push("<li>Add the <b>Resource tokens</b> and Masks' <b>3 extra Gate tokens</b> (Gate stack) to the pools.</li>");
          if (c.has("cir"))
            bits.push("<li>Shuffle the <b>Disaster deck</b> (facedown by the Mythos deck) and the <b>Devastation Encounter deck</b> (with the other encounter decks); add the <b>Devastation tokens</b> to the pool.</li>");
          bits.push("<li><b>Stays in the box unless called for:</b> side boards and their encounter decks, board-specific Clues/Gates, Mystic Ruins cards, and Adventure cards — they are used only by specific Ancient Ones or Preludes (this checklist adds the right ones automatically).</li>");
          return "<ul>" + bits.join("") + "</ul>";
        },
        src: "Each expansion's “Using This Expansion” page",
        when: (c) => EH.expansions.some(e => e.id !== "base" && c.has(e.id)) },
      { exp: "mon",
        t: "Decide on Personal Stories",
        d: "All players together decide whether to use <b>Personal Stories</b> this game — everyone plays with them or nobody does. (Toggle the module above to include them in these steps.)",
        src: "Masks of Nyarlathotep p.6",
        when: (c) => c.has("mon") && !c.mod("stories") && !c.mod("campaign") },
      { exp: (c) => "base",
        t: "Draw the Prelude",
        d: (c) => {
          if (c.mod("noPrelude")) return "You've chosen to play <b>without a Prelude</b> (Control Your Fate optional rule) — skip this step.";
          let d = c.mod("choosePrelude")
            ? "Using <b>Control Your Fate</b>: the group chooses one <b>Prelude card</b> instead of drawing at random."
            : "Draw <b>one random Prelude card</b>.";
          d += " Resolve its effect immediately unless it specifies other timing (such as “after resolving setup”). Preludes can add side boards, Adventures, the Mystic Ruins deck, or other twists.";
          if (c.has("mon") && (c.has("mom") || c.has("sr") || c.has("td") || c.has("utp")))
            d += " Masks of Nyarlathotep reprints four earlier Preludes (<i>Beginning of the End</i>, <i>The Dunwich Horror</i>, <i>Twin Blasphemies of the Black Goat</i>, <i>Call of Cthulhu</i>) — remove the duplicates you own from the pool.";
          if (c.mod("campaign"))
            d += " <b>Campaign mode:</b> play with <b>two Preludes</b> — the one matching this game's Ancient One and the one matching the Ancient One randomly determined for the <i>next</i> game (game 6: <i>Unto the Breach</i>).";
          return d;
        },
        src: (c) => "Mountains of Madness p.4 · Masks p.4" + (c.mod("campaign") ? " · Masks p.7" : ""),
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
          return "<ul><li><b>Gate stack:</b> randomize the nine Gate tokens" + (c.has("mon") ? " (twelve with Masks' three extras)" : "") + " facedown, common side up." + (sb ? " <b>Add the side board's three Gates first</b> — they shuffle into the stack." : "") + "</li>" +
          "<li><b>Clue pool:</b> all Clue tokens facedown (common side up), randomized." + (sb ? " <b>Add the side board's Clues</b> (" + (sb === "dreamlands" ? "seven" : "six") + ") before randomizing.</li>" : "</li>") +
          "<li><b>General pool:</b> Health, Sanity, Improvement, Travel Ticket, Eldritch, Mystery and Rumor tokens" + ((c.has("mom") || c.has("sr") || c.has("td") || c.has("mon")) ? ", plus Focus" : "") + ((c.has("utp") || c.has("soc")) ? ", Impairment" : "") + ((c.has("mon")) ? ", Resource" : "") + ((c.has("cir")) ? ", Devastation" : "") + " tokens in reach of everyone.</li></ul>";
        },
        src: (c) => "Base Rulebook p.4, step 2" + (EH.helpers.sideBoard(c) ? " · side-board setup" : ""),
        when: () => true },
      { exp: "base",
        t: "3 · Choose and place investigators",
        d: (c) => "Agree on a player to take the <b>Lead Investigator token</b> (random if you can't decide). Starting with the Lead Investigator and going clockwise, each of the <b>" + c.p + "</b> player" + (c.p > 1 ? "s" : "") + " chooses an investigator, takes the sheet, and places the matching token on the <b>starting space printed on the back of the sheet</b>." + (c.has("td") ? " (Exception: <i>Luke Robinson</i> waits — after setup he starts on any space containing a Gate, or anywhere if there are none.)" : ""),
        src: (c) => "Base Rulebook p.4, step 3" + (c.has("td") ? " · FAQ (Luke Robinson)" : ""),
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
          if (c.mod("campaign")) d += "<br>Campaign: the Ancient One was determined at random — and randomly determine the <b>next</b> game's Ancient One now (defeated ones excluded).";
          return d;
        },
        src: (c) => "Base Rulebook p.4, step 5" + (c.ao && c.ao.set !== "base" ? " · " + EH.expMeta[c.ao.set].name : ""),
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
        src: "Strange Remnants p.2 · Masks of Nyarlathotep p.4",
        when: (c) => EH.helpers.mysticRuins(c) },
      { exp: "base",
        t: "6 · Create the Monster cup",
        d: "Place all <b>non-Epic Monster tokens</b> in an opaque container (bowl, mug, box lid) and shake to randomize. <b>Epic Monsters never go in the cup</b> — they are red with a clipped corner, and are spawned only by effects that name them. Set-aside monsters (Ancient One or side-board instructions) also stay out.",
        src: "Base Rulebook p.4, step 6",
        when: () => true }
    ] },

  { title: "Decks & Final Steps (steps 7–9)",
    steps: [
      { exp: "base",
        t: "7 · Separate and place the decks",
        d: (c) => "<ul><li>Return every <b>Research Encounter, Special Encounter and Mystery card that does not match " + (c.ao ? c.ao.name : "the chosen Ancient One") + "</b> to the box (each carries its Ancient One's portrait on the back). Keep the matching Research deck, Mystery deck, and any Special Encounter decks its setup names — <b>separate Special Encounters into decks by card back</b>.</li><li>Shuffle <b>all Expedition Encounter cards into a single deck</b> regardless of back.</li><li>Shuffle the <b>Spell</b> and <b>Condition</b> decks and place them <b>faceup</b> (name and art showing — their backs are secret).</li><li>Separate all other encounter cards into decks by back (America, Europe, Asia/Australia, General, Other World) and shuffle each.</li><li>Set the Mythos cards aside for step 8.</li></ul>",
        src: "Base Rulebook p.4, step 7 · FAQ (Special Encounter backs)",
        when: () => true },
      { exp: "base",
        t: "8 · Build the Mythos deck",
        d: (c) => {
          let d = "Separate the Mythos cards into <b>green, yellow and blue</b> piles and shuffle each. Following the chart at the bottom of the Ancient One sheet, build <b>Stage I, II and III</b> from random cards of the listed colors and counts; stack them Stage I on top, III on the bottom. <b>Do not shuffle the combined deck</b>, and return unused Mythos cards to the box unseen.";
          if (c.mod("staged")) d += "<br><b>Staged Difficulty:</b> use only <i>easy</i> cards for Stage I, <i>normal</i> for Stage II, <i>hard</i> for Stage III.";
          if (c.mod("insane")) d += "<br><b>Insane Difficulty:</b> build the entire deck using only <i>hard</i> Mythos cards.";
          return d;
        },
        src: (c) => "Base Rulebook p.4 & 6, step 8" + (c.mod("staged") ? " · MoM p.6" : "") + (c.mod("insane") ? " · SR p.3" : ""),
        when: () => true },
      { exp: "base",
        t: "9 · Resolve the starting effects (A–H)",
        d: "<ul><li><b>A.</b> Place the <b>Reference card</b> matching the player count by the Mythos deck; box the rest.</li><li><b>B.</b> Put the <b>Doom token</b> on the Doom-track space printed top-left on the Ancient One sheet.</li><li><b>C.</b> Put the <b>Omen token</b> on the <b>green (comet)</b> space of the Omen track.</li><li><b>D.</b> Deal the top <b>four Asset cards</b> faceup into the reserve slots.</li><li><b>E.</b> <b>Spawn Gates</b> equal to the Reference card's number — top token of the Gate stack faceup on its printed space, plus <b>one random Monster from the cup</b> on each.</li><li><b>F.</b> Place the <b>Active Expedition token</b> on the space matching the back of the top Expedition Encounter card.</li><li><b>G.</b> <b>Spawn Clues</b> equal to the Reference card's number (random Clue tokens facedown on their printed spaces).</li><li><b>H.</b> Draw one <b>Mystery card</b> for the Ancient One, place it by the sheet, and resolve any “when this card enters play” effect.</li></ul>",
        src: "Base Rulebook p.4–6, step 9",
        when: () => true },
      { exp: "base",
        t: "Begin the first round",
        d: (c) => "Play proceeds in rounds of three phases — <b>Action → Encounter → Mythos</b> — starting with the Lead Investigator and passing clockwise, until the investigators win or the world ends." + ((c.mod("stories") || c.mod("campaign")) ? " Keep Personal Missions visible — several trigger from ordinary play." : "") + " The full phase structure is in the reference below." + (EH.helpers.hasPreludes(c) && !c.mod("noPrelude") ? " (Some Preludes fire “after resolving setup” — check yours now.)" : ""),
        src: "Base Rulebook p.6",
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
<li>On a space with Monsters you <b>must</b> resolve a Combat Encounter against each one, in your chosen order${(c.has("mom") || c.has("sr") || c.has("utp") || c.has("soc") || c.has("td") || c.has("cir") || c.has("mon")) ? " — <b>all non-Epic Monsters before any Epic Monster</b>" : ""}. Clear them all and you may still take a normal encounter.</li>
<li>Otherwise choose: a <b>location encounter</b> (your space's regional deck or the General deck — resolve the entry matching your space's type or name) or a <b>token encounter</b>: Clue → Research Encounter; Gate → Other World Encounter; Active Expedition → Expedition Encounter; Rumor → that Rumor's encounter; defeated investigator → the encounter on their sheet back${c.has("cir") ? "; devastated space → Devastation Encounter (its only option besides tokens)" : ""}${EH.helpers.mysticRuins(c) ? "; Mystic Ruins token → top Mystic Ruins card" : ""}.</li>
<li><b>Complex encounters</b> (Expedition, Other World, Special${c.has("cir") ? ", Devastation" : ""}${EH.helpers.mysticRuins(c) ? ", Mystic Ruins" : ""}${EH.helpers.sideBoard(c) === "dreamlands" ? ", Dream-Quest" : ""}): resolve the top box; pass → middle box, fail → bottom box.</li>
<li>“As an encounter” effects follow normal encounter rules — Monsters must be gone first. “Instead of resolving an encounter” effects (like Detained) work even with Monsters present (FAQ).</li>
</ul>
<h4>3 · Mythos Phase</h4>
<p>The Lead Investigator draws the top Mythos card and resolves its icons <b>left to right, top to bottom</b>:</p>
<ol>
<li><b>Advance Omen</b> — move the Omen token one space clockwise, then advance Doom 1 per Gate matching the new Omen space.</li>
<li><b>Reckoning</b> — trigger every ☗ effect in play, in order: Monsters, Ancient One sheet, ongoing Mythos cards, then investigator possessions/Conditions. Components added mid-reckoning don't trigger this pass (FAQ).</li>
<li><b>Spawn Gates</b> — per the Reference card (top Gate token + 1 random Monster on its space).</li>
<li><b>Monster Surge</b> — at each Gate matching the current Omen: spawn the Reference card's number of Monsters. No matching Gates? Spawn one Gate instead.</li>
<li><b>Spawn Clues</b> — per the Reference card.</li>
<li><b>Place Rumor token</b> / <b>place Eldritch tokens</b> as shown.</li>
<li><b>Resolve the text</b> — an <i>Event</i> resolves and discards; an <i>Ongoing</i> card stays in play.</li>
</ol>
<p>Only icons printed on the card are resolved. At the end of the phase the Lead Investigator may pass the Lead token to anyone. If a Mythos card can't be drawn (deck empty), the phase ends and — if you haven't already won — <b>you lose</b> (errata wording).</p>
<p class="src-line">Base Rulebook p.6–11 · FAQ/Errata p.1, p.19–21</p>` },

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
<p class="src-line">Base Rulebook p.12 · Reference Guide (definitive) · FAQ p.1, 3–4${(c.has("utp") || c.has("soc")) ? " · UtP p.5 · SoC p.2" : ""}</p>` },

  { id: "combat", title: "Combat Encounters",
    when: () => true,
    html: (c) => `
<ul>
<li>Flip the Monster token and read its back. Resolve the <b>Will test</b> first: lose Sanity equal to (its <b>horror</b> − your successes). Then the <b>Strength test</b>: lose Health equal to (its <b>damage</b> − your successes), and the Monster loses <b>Health equal to your successes</b>.</li>
<li>A Monster with total lost Health ≥ its <b>toughness</b> is defeated → back to the cup (toughness reduced to 0 also defeats it). Undefeated Monsters keep their damage tokens.</li>
<li><b>Alternate tests:</b> a different skill icon replaces Will or Strength on some Monsters — test that skill instead.</li>
<li><b>Epic Monsters</b> (red, clipped corner): immune to being moved, discarded or returned to the cup; only defeat-by-toughness removes them (to the box). Spawned only by name${(c.has("mom") || c.has("sr") || c.has("utp") || c.has("soc") || c.has("td") || c.has("cir") || c.has("mon")) ? "; fight all non-Epics on your space first" : ""}.</li>
<li><b>Ambush:</b> “a Monster ambushes you” — draw from the cup, fight immediately, then return it to the cup win or lose, and continue the interrupted effect.</li>
${(c.has("mom") || c.has("sr") || c.has("utp") || c.has("soc") || c.has("td") || c.has("cir") || c.has("mon")) ? "<li><b>Physical Resistance</b>: no dice-pool bonuses apply except from Spells and MAGICAL possessions. <b>Magical Resistance</b>: no bonuses from Spells or MAGICAL possessions. Rerolls and dice manipulation always work. Test-substitution spells (Storm of Spirits) aren't bonuses and slip past both.</li>" : ""}
<li>Defeating the last Monster on your space still lets you take a normal encounter afterward — unless an effect (Gug, Byakhee movement) replaces it (FAQ).</li>
<li>“During a Combat Encounter” means the tests printed on the Monster token itself; spells cast alongside aren't part of the encounter (FAQ).</li>
</ul>
<p class="src-line">Base Rulebook p.14–15 · MoM p.6 · FAQ p.18–19</p>` },

  { id: "defeat", title: "Health, Sanity & Defeated Investigators",
    when: () => true,
    html: (c) => `
<ul>
<li>Health/Sanity never exceed your maximums; reducing a maximum clamps the current value but doesn't otherwise lower it. <b>Losing</b> is involuntary; <b>spending</b> is a voluntary cost — effects care about the difference. Group losses can't assign more to an investigator than they have.</li>
<li><b>At 0 Health or 0 Sanity you are defeated:</b> ① advance Doom by 1; ② move your token to the nearest City space, tip it over, and mark it with a Health token (crippled) or Sanity token (insane); ③ leave your possessions on your sheet (Conditions, Health/Sanity, Improvements${(c.has("mom") || c.has("sr") || c.has("td") || c.has("mon")) ? ", Focus" : ""} are discarded); ④ pass the Lead Investigator token if you held it.</li>
<li>Another investigator on that space may later <b>encounter the defeated token</b>: resolve the Crippled or Insane encounter on the sheet's back — usually gaining the possessions and possibly retreating Doom — then remove that investigator from the game.</li>
<li><b>Devoured</b> investigators skip the token: advance Doom, discard everything, sheet out of the game.</li>
<li>The defeated player chooses a <b>new investigator at the end of the Mythos Phase</b> (starting possessions come from decks/discards — not from other investigators). After the Ancient One awakens, defeat means <b>elimination</b> instead${c.ao && c.ao.id === "yig" ? " — except against Yig, where you keep drawing new investigators" : ""}. Every player eliminated = game lost.</li>
<li>Exact timing matters: everyone defeated by the same effect that awakens the Ancient One still gets replacements; only defeats <i>after</i> the awakening eliminate (FAQ).</li>
</ul>
<p class="src-line">Base Rulebook p.14, p.16 · FAQ p.7, 10, 22</p>` },

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
<p class="src-line">Base Rulebook p.10–11, p.16 · FAQ p.19–21</p>` },

  { id: "mysteries", title: "Mysteries, Rumors & Winning",
    when: () => true,
    html: (c) => `
<ul>
<li><b>Win:</b> solve <b>three Mysteries</b>${c.ao && c.ao.id === "elderthings" ? " — <b>four against Rise of the Elder Things</b>" : ""}${c.ao && c.ao.id === "nyarlathotep" ? " — <b>only two against Nyarlathotep</b>" : ""}. Each solved Mystery immediately reveals the next. If the Ancient One awakens first, you must also solve the <b>Final Mystery</b> on the sheet's back${c.ao && c.ao.id === "azathoth" ? " — but Azathoth has none: if he wakes, the world is devoured and the game is lost" : ""}.</li>
<li><b>Lose:</b> the Ancient One's lose condition on its back; all players eliminated; a card effect says so; or the Mythos deck runs out.</li>
${(c.has("mom") || c.has("sr") || c.has("utp") || c.has("soc") || c.has("td") || c.has("cir") || c.has("mon")) ? "<li><b>“Advance the active Mystery”:</b> place one required token on it (Clue/Gate/Monster from their pools); if it needs an Epic Monster defeated, place 2 Health on the card (each Health = −1 toughness; if it spawns several Epics, place 1). Clues placed this way can be spent by anyone resolving that card. The Final Mystery is never “the active Mystery.”</li>" : ""}
<li><b>Rumors</b> (blue Ongoing Mythos cards) place Rumor tokens; encounter the token to work the Rumor's own effect. A solved Rumor discards the card, tokens on it, and the Rumor tokens/Epic Monsters/Eldritch tokens it placed — but not Clues, Gates, ordinary Monsters, or Conditions it handed out (errata). Unsolved Rumors often end the game or maim the world.</li>
</ul>
<p class="src-line">Base Rulebook p.11, p.16 · FAQ/Errata p.1, p.9–11</p>` },

  { id: "possessions", title: "Possessions, Conditions & Delayed",
    when: () => true,
    html: (c) => `
<ul>
<li><b>Spells and Conditions are double-sided</b> — gain them showing the front; never peek at the back until an effect flips them. All text on both faces is that card's effect.</li>
<li>You <b>cannot</b> gain a copy of a Condition you already have (nor choose to), and you cannot voluntarily discard possessions — trade them away or wait for an effect.</li>
<li>Searching a deck also searches its discard pile (bottom-to-top); named cards come from the reserve directly.</li>
<li><b>Delayed</b> (tipped token): you skip your actions — standing back up <i>is</i> your Action Phase. Becoming Delayed mid-action ends your turn and eats remaining actions; already-Delayed investigators can't be Delayed again (so a “lose 3 Health unless Delayed” effect just hurts). “During the Action Phase” effects (including Local-path moves) are unavailable while Delayed.</li>
${c.has("fl") ? "<li><b>Lost in Time and Space:</b> off the board entirely — no space, no actions, no movement, immune to Mythos/reckonings except its own Condition; passes the Lead token; can't take part in group spending. Still wins or loses with the team.</li>" : ""}
${(c.has("utp") || c.has("td")) ? "<li><b>Local paths</b> join spaces so close no action is needed: once per round during the Action Phase (not while Delayed) move along any number of interconnected Local paths — before, during or between your actions. Locally-joined spaces are adjacent, and the path counts as 1 for distances.</li>" : ""}
${(c.has("mom") || c.has("sr") || c.has("utp") || c.has("soc") || c.has("td") || c.has("cir") || c.has("mon")) ? "<li><b>Unique Assets</b> are double-sided possessions (no value, no limit, duplicates fine); “Asset” includes them, “non-Unique Asset” excludes them; random-Asset draws never come from the Unique deck; discarding one discards its tokens.</li>" : ""}
<li>Conditions blocking Rest recovery (Poisoned, Hypothermia, Despair…) also block <i>bonus</i> recovery during that Rest — even if discarded mid-resolution; recovery outside Rest actions is fine.</li>
</ul>
<p class="src-line">Reference Guide · FAQ/Errata p.1, p.13–17 · FL rulesheet${(c.has("utp") || c.has("td")) ? " · UtP p.5" : ""}</p>` },

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
        bits.push("<li><b>Disasters & Devastation</b>: Disaster cards (read by the Lead Investigator, resolved immediately) devastate named City spaces — discard its Clues and defeated investigator tokens, box its Expedition cards, place a Devastation token. A devastated space has no type: no General/location encounters, only its Devastation Encounter deck. Clues can't spawn or move there. <b>All nine main-board cities devastated = you lose.</b></li>");
      if (c.has("mom") || c.has("sr") || c.has("utp") || c.has("td") || c.has("mon"))
        bits.push("<li><b>Adventures</b> (specific Preludes/Ancient Ones): staged stories — resolve “when this card enters play,” complete via the printed effect, resolve “when completed,” draw the next stage. The Adventure token marks where the action is.</li>");
      if (c.mod("stories") || c.mod("campaign"))
        bits.push("<li><b>Personal Stories</b>: your Mission's completion grants the Reward, its failure the Consequence — permanent, undiscardable, not a possession. A dead investigator's story dies too.</li>");
      return "<ul>" + bits.join("") + "</ul><p class='src-line'>MoM p.5 · SR p.2–3 · UtP p.5 · SoC p.2 · CiR p.2 · Masks p.4–6</p>";
    } },

  { id: "rulings", title: "Rulings Worth Remembering (FAQ & Errata)",
    when: () => true,
    html: (c) => `
<ul>
<li>The <b>Reference Guide beats the rulebook</b>; a card beats both; “cannot” is absolute; the Ultimate FAQ's rulings take precedence over everything older. Half a number = round up. The Lead Investigator settles disputes.</li>
<li>“May,” “or” and “unless” are all choices — and you may pick an “unless” branch you can only partly fulfil (discarding zero Improvement tokens is legal).</li>
<li>Effects on “an investigator” include yourself unless they say “another.” “You” = one single investigator.</li>
<li>A triggered effect fires once per trigger, resolving <i>after</i> its triggering event completes (Astral Travel's bonus space comes after the whole Travel action).</li>
<li>Passive bonuses aren't optional; “may” bonuses are.</li>
<li>An additional action can't repeat an action you already took this round — component actions from different copies excepted.</li>
<li>Eldritch tokens are anonymous — one placed by a Mystery equals one placed by a reckoning${c.has("mon") ? " (except tokens gained <i>by an investigator</i>, e.g. Corruption, which sit on your sheet until spent)" : ""}.</li>
<li>Reading ahead on encounter cards is legal — suspense is optional.</li>
</ul>
<p class="src-line">Base Rulebook p.2, p.16 · Ultimate FAQ 2.0 p.3–8</p>` },

  { id: "roster", title: "Ancient One Roster",
    when: () => true,
    html: (c) => {
      const rows = EH.ancientOnes.filter(a => c.has(a.set)).map(a =>
        `<tr><td class="tag ${EH.expMeta[a.set].cls}">${EH.expMeta[a.set].name}</td><td><b>${a.name}</b></td><td>${a.notes}</td></tr>`).join("");
      return `<div class="twrap"><table>${rows}</table></div>
<p class="src-line">Ancient One sheets & expansion rulebooks · FAQ p.9–11</p>`;
    } }
];
