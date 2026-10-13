/* =============================================================================
   Western Legends — Setup & Reference Utility · data
   Single source: Western Legends Complete Rules v1.2 (2021-01-26). Printed page
   numbers match the PDF page numbers; citations read "Rules p.N".
   Context c (from WL.ctx): has(set), p, len, mode, v(variant), lss, csc, mib.
   Mode flags in c: bt, noTrader, noDeeds, noInjury. Game-mode data (WL.modeInfo),
   the variant/mode/appendix reference sections live in js/data-modes.js.
   Legends, items and Legendary items (p.60–95): js/data-legends.js.
   ============================================================================= */
var WL = {};

/* ---- tags shown on setup steps ------------------------------------------------ */
WL.expMeta = {
  core:  { name: "Core",           cls: "tag-core" },
  au:    { name: "Ante Up",        cls: "tag-au" },
  bm:    { name: "Blood Money",    cls: "tag-bm" },
  small: { name: "Small box",      cls: "tag-small" },
  var:   { name: "Variant",        cls: "tag-var" },
  mode:  { name: "Game mode",      cls: "tag-mode" },
  p2:    { name: "2 players",      cls: "tag-2p" }
};

/* ---- sets (the book's Set Abbreviations, p.2) ------------------------------------ */
WL.sets = [
  { id: "core", short: "Western Legends", abbr: "Core", blurb: "The base game. Always in play." },
  { id: "au", short: "Ante Up", abbr: "AU", blurb: "The Buzzard Gulch board (Trading Post, Frontier, Outlaw Camp, Mountain Passes), Legends and items, the High Stakes Poker variant, legendary tokens and alternate poker cards (Rules p.3, 15–16, 23, 60–87)." },
  { id: "bm", short: "Blood Money", abbr: "BM", blurb: "The Legendary Story System — story board overlay, legendary story cards, Story track and risk die — plus Legends, items, Legendary items, Bandit Hideout/Mine location tokens and alternate poker cards (Rules p.3, 14, 23, 60–95)." },
  { id: "ffe", short: "Fistful of Extras", abbr: "FFE", blurb: "Legends and items, bandit cards 1–6, the Jokers, Man in Black cards 11–21 and the legendary token bag (Rules p.3, 13, 16–17, 60–87)." },
  { id: "gbh", short: "The Good, The Bad, and The Handsome", abbr: "GBH", blurb: "Legends, Legendary items and story cards (Rules p.19, 60–95)." },
  { id: "wbe", short: "Wild Bunch of Extras", abbr: "WBE", blurb: "Legends, items, Legendary items, story cards, Unique events, bandit cards 7–8, gang/posse, sheriff and title cards (Rules p.6, 13, 15, 17–18, 23, 60–95)." },
  { id: "promo", short: "Promos", abbr: "Promo", blurb: "Promo cards: Man in Black P-01 and P-03 to P-07 (Kickstarter promos) and the Carbine promo item (Rules p.17, 82)." }
];

WL.lengths = [
  { n: 15, name: "Short" },
  { n: 20, name: "Average" },
  { n: 25, name: "Long" }
];

/* ---- game modes (p.18–25) ----------------------------------------------------- */
WL.modes = [
  { id: "std", name: "Standard game", blurb: "The full sandbox, with every system your sets provide.", needs: [], src: "Rules p.3–12" },
  { id: "serenade", name: "Serenade of the Six Guns", blurb: "Shootouts between players. Recommended for 3–5 players at 15 or 20 LP.", needs: ["au", "bm", "gbh"], src: "Rules p.18–19",
    vars: { csc: true } },
  { id: "golden", name: "The Golden Rule", blurb: "Strike it rich: mining, ranching, gambling and deeds. Recommended for 3–6 players at 20 LP.", needs: ["au", "bm"], src: "Rules p.18, 20",
    vars: { csc: true } },
  { id: "law", name: "Law and Disorder", blurb: "Marshals against outlaws, with gangs and posses. Recommended for 3–6 players at 20 LP.", needs: ["au", "bm", "wbe"], src: "Rules p.18, 21",
    vars: { csc: true, gang: true } },
  { id: "risky", name: "Risky Business", blurb: "Story cards, the risk die and goal cards. Recommended for 3–5 players at 20–25 LP.", needs: ["au", "bm"], src: "Rules p.18, 22",
    vars: { goal: true } },
  { id: "border", name: "Who Runs Border Town?", blurb: "Played entirely on the Buzzard Gulch board, with homesteads. Recommended for 2–4 players at 15–20 LP; 2 players without the Man in Black.", needs: ["au", "bm", "wbe"], src: "Rules p.18, 23–25",
    vars: { csc: true } }
];

/* ---- variants (p.13–18, plus the setup options on p.3 and p.6) ----------------------- */
WL.variants = [
  { id: "altpoker", name: "Alternate poker cards", needsAny: ["au", "bm"],
    summary: "Swap in the Ante Up / Blood Money poker cards: the Standard Blood Money Poker Deck (recommended).", src: "Rules p.3, 18" },
  { id: "csc", name: "Core Story Card variant", needsAny: [],
    summary: "The original story cards instead of the Legendary Story System. Automatic without Blood Money.", src: "Rules p.14" },
  { id: "mib", name: "Man in Black (2 players)", needsAny: [],
    summary: "An automated rival for 2-player games. Set automatically by the player count.", src: "Rules p.3, 17" },
  { id: "unique", name: "Unique Events", needsAny: ["wbe"],
    summary: "Unique event cards shuffled into the event deck; their Unique event tokens go in a supply near the board.", src: "Rules p.6" },
  { id: "bandit", name: "Bandit Card variant", needsAny: ["ffe", "wbe"],
    summary: "Numbered, named bandits: each bandit fight reveals the top card of the shuffled bandit deck, and the result for the fought bandit’s number applies.", src: "Rules p.13" },
  { id: "gang", name: "Gang/Posse variant", needsAny: ["wbe"],
    summary: "A Recruit action for Marshals (posse) and Wanted players (gang).", src: "Rules p.15" },
  { id: "goal", name: "Goal Cards variant", needsAny: [],
    summary: "Secret character goals that pay legendary tokens.", src: "Rules p.15" },
  { id: "hsp", name: "High Stakes Poker variant", needsAny: ["au"],
    summary: "An extra poker game with communal cards (flop, turn and river) that you can choose when you Gamble at a Saloon.", src: "Rules p.16" },
  { id: "joker", name: "Joker Card variant", needsAny: ["ffe"],
    summary: "Two wild Jokers in the poker deck.", src: "Rules p.16" },
  { id: "sheriff", name: "Sheriff variant", needsAny: ["wbe"],
    summary: "A sheriff deck that gives the Sheriff a personality.", src: "Rules p.17" },
  { id: "title", name: "Title Card variant", needsAny: ["wbe"],
    summary: "One random title card that adds or alters one or two rules for the whole game; where it conflicts with the normal rules, follow the title card.", src: "Rules p.18" }
];

WL.setName = (id) => { const s = WL.sets.find(x => x.id === id); return s ? s.short : id; };
WL.modeById = (id) => WL.modes.find(m => m.id === id) || WL.modes[0];

/* Why a mode can't be chosen ("" when it can). */
WL.modeBlock = (m, sets) => {
  const miss = m.needs.filter(n => !sets.has(n));
  return miss.length ? "Needs " + miss.map(WL.setName).join(", ") + " (Rules p.18" + (m.id === "serenade" ? ", 19" : m.id === "law" ? ", 21" : m.id === "border" ? ", 23" : "") + ")" : "";
};

/* Variant status for a state: { avail, on, locked, why } */
WL.variantStatus = (vr, st) => {
  const sets = st.sets, mode = st.mode;
  const hasAny = !vr.needsAny.length || vr.needsAny.some(n => sets.has(n));
  if (!hasAny) return { avail: false, on: false, locked: true, why: "Needs " + vr.needsAny.map(WL.setName).join(" or ") };
  if (vr.id === "mib") {
    if (st.p !== 2) return { avail: false, on: false, locked: true, why: "Only in 2-player games (Rules p.17)" };
    if (mode === "border") return { avail: true, on: false, locked: true, why: "Who Runs Border Town? plays 2 players without the Man in Black (Rules p.25)" };
    return { avail: true, on: true, locked: true, why: "Used in every 2-player game (Rules p.3, 17)" };
  }
  if (vr.id === "csc" && !sets.has("bm")) return { avail: true, on: true, locked: true, why: "Without Blood Money there is no Legendary Story System (Rules p.14)" };
  if (mode !== "std") {
    const m = WL.modeById(mode);
    if (vr.id === "altpoker") return { avail: true, on: true, locked: true, why: "Game modes use the Base Blood Money Poker deck (Rules p.18)" };
    if (vr.id === "joker") return { avail: true, on: true, locked: true, why: "Game modes use the Jokers from Fistful of Extras if you have them (Rules p.18)" };
    if (vr.id === "unique") {
      if (mode === "golden") return { avail: true, on: true, locked: true, why: "The Golden Rule removes only 4 named Unique event cards, so the rest are in the event deck (Rules p.20)" };
      if (mode === "risky") return { avail: true, on: true, locked: true, why: "Risky Business uses all event cards (Rules p.22)" };
      return { avail: true, on: false, locked: true, why: m.name + " removes all Unique event cards (Rules p." + (mode === "serenade" ? "19" : mode === "law" ? "21" : "25") + ")" };
    }
    const want = !!(m.vars && m.vars[vr.id]);
    return { avail: true, on: want, locked: true, why: want ? "Part of " + m.name + " (" + m.src + ")" : "Not used with game modes unless the mode says so (Rules p.18)" };
  }
  return { avail: true, on: st.vars.has(vr.id), locked: false, why: "" };
};

/* Make a state consistent with the book's stated compatibility rules. */
WL.normalize = (st) => {
  st.sets.add("core");
  if (!(st.p >= 2 && st.p <= 6)) st.p = Math.min(6, Math.max(2, st.p | 0 || 4));
  if (!WL.lengths.some(l => l.n === st.len)) st.len = 20;
  const m = WL.modeById(st.mode);
  if (WL.modeBlock(m, st.sets)) st.mode = "std";
  /* st.vars holds the effective variants; st._pick remembers the user's own choice for each
     variant while a mode or a missing set locks it, and is restored when the lock lifts. */
  const wasLocked = st._locked || new Set(), nowLocked = new Set();
  st._pick = st._pick || new Set();
  for (const vr of WL.variants) {
    const id = vr.id;
    if (wasLocked.has(id)) { if (st._pick.has(id)) st.vars.add(id); else st.vars.delete(id); }
    else if (st.vars.has(id)) st._pick.add(id); else st._pick.delete(id);
    const s = WL.variantStatus(vr, st);
    if (s.locked) nowLocked.add(id);
    if (s.on) st.vars.add(id); else st.vars.delete(id);
  }
  st._locked = nowLocked;
  return st;
};

WL.ctx = (st) => {
  const vars = new Set(st.vars);
  const c = {
    has: (id) => st.sets.has(id),
    p: st.p,
    len: st.len,
    mode: st.mode,
    v: (id) => vars.has(id),
    mod: (id) => vars.has(id) || st.mode === id   // components glossary convention
  };
  c.csc = vars.has("csc");
  c.lss = !c.csc && st.sets.has("bm");
  c.mib = vars.has("mib");
  c.modeName = WL.modeById(st.mode).name;
  c.legItems = st.sets.has("bm") || st.sets.has("gbh") || st.sets.has("wbe");
  /* game-mode flags (Rules p.19–25) */
  c.bt = st.mode === "border";                                         // Who Runs Border Town?
  c.noTrader = st.mode === "serenade" || st.mode === "border";         // Traveling Trader not used (p.19, 24)
  c.noDeeds = st.mode === "serenade" || st.mode === "law" || st.mode === "border";   // deed cards not used (p.19, 21, 25)
  c.noInjury = st.mode === "golden";                                   // injury cards not used (p.20)
  return c;
};

/* small helpers */
WL.join = (a) => a.filter(Boolean).join(" · ");
WL.ul = (items) => "<ul>" + items.filter(Boolean).map(i => "<li>" + i + "</li>").join("") + "</ul>";
/* a labelled block inside a step for a variant or game-mode change */
WL.vx = (label, items) => "<div class=\"vx\"><p class=\"vx-h\">" + label + "</p>" + WL.ul(items) + "</div>";

/* =============================================================================
   SETUP — three stages, Rules p.3–6
   ============================================================================= */
WL.phases = [
  {
    id: "before",
    title: "Before you start",
    steps: [
      { id: "sets", when: (c) => !(c.has("au") && c.has("bm")), exp: "core",
        t: "The sets on the table",
        d: (c) => {
          const out = [];
          out.push("The Complete Rules writes its setup for <b>Western Legends + Ante Up + Blood Money</b> together. It doesn’t give a separate setup for other combinations, and it doesn’t list what each box contains.");
          out.push("This page leaves out only what the book itself ties to a set you haven’t selected. Skip any other component you don’t have.");
          if (!c.has("au")) out.push("<b>No Ante Up:</b> no Buzzard Gulch board, so none of its locations: the Trading Post, the Buzzard Gulch Rail Station, Ranch, Saloon and Marshal’s Office, the Outlaw Camp, the Frontier spaces and the Mountain Passes. There is also no High Stakes Poker variant. The main board’s own Rail Station, Ranches and Saloons stay.");
          if (!c.has("bm")) out.push("<b>No Blood Money:</b> no Legendary Story System (story board overlay, legendary story cards, risk die). You play the original story cards: the <b>Core Story Card variant</b>.");
          out.push("The <b>game modes</b> need Western Legends, Ante Up and Blood Money at a minimum.");
          return WL.ul(out);
        },
        src: (c) => WL.join(["Rules p.3", !c.has("au") ? "p.16, 23, 31, 39–40, 42, 45–46, 48" : "", !c.has("bm") ? "p.14" : "", "p.18"]) },
      { id: "mode", when: (c) => c.mode !== "std", exp: "mode",
        t: (c) => "Game mode: " + c.modeName,
        d: (c) => {
          const M = WL.modeInfo[c.mode];
          const offP = c.p < M.rec.pmin || c.p > M.rec.pmax, offL = M.rec.lps.indexOf(c.len) < 0;
          const used = [];
          used.push("<b>Poker deck:</b> the Base Blood Money Poker deck (all the alternate poker cards" + (c.has("ffe") ? ", plus both Jokers from Fistful of Extras" : "") + ")" + (M.poker ? ", with this mode’s swaps" : "") + ".");
          used.push(M.story ? "<b>Story system:</b> the Core Story Card variant, using only the story cards with the trigger" + (M.story.length > 1 ? "s " : " ") + M.story.map(s => "“" + s + "”").join(" or ") + "." : "<b>Story system:</b> the Legendary Story System (the standard setup).");
          if (M.gang) used.push("<b>Gang/Posse variant</b> (Wild Bunch of Extras).");
          if (M.goal) used.push("<b>Goal Cards variant.</b>");
          if (c.v("unique")) used.push("<b>Unique Events</b> (Wild Bunch of Extras)" + (c.mode === "golden" ? ", without Orphan, Grizzly Bear, Wounded Deputy and Bathcat. The mode doesn’t name the variant, but it removes only those 4 Unique event cards (p.20), so this page reads the rest as staying in the event deck." : c.mode === "risky" ? ": the mode uses all event cards (p.22)." : "."));
          used.push("No other variants: the book says variants aren’t used with game modes unless the mode names them." + (c.mib ? " The Man in Black still joins a 2-player game" + (M.p2 ? " (with this mode’s card list)" : "") + "." : ""));
          const off = [];
          if (c.noTrader) off.push("the <b>Traveling Trader</b>");
          if (c.noDeeds) off.push("<b>deed cards</b>");
          if (c.noInjury) off.push("<b>injury cards</b>");
          if (c.bt) off.push("the <b>Bank</b>, <b>Cabaret</b> and <b>Doctor’s Office</b>");
          return WL.ul([
            "Follow the standard setup below, except where this game mode says otherwise. The steps below already include this mode’s changes.",
            "<b>Recommended:</b> " + M.rec.p + " players, " + M.rec.lp + " LP." + (offP || offL ? " Tonight’s " + (offP ? c.p + " players" : "") + (offP && offL ? " and " : "") + (offL ? c.len + " LP" : "") + " is outside the recommendation (allowed, just not what the mode was tuned for)." : ""),
            "<b>Required content:</b> Western Legends, Ante Up and Blood Money" + (M.required ? ", plus <b>" + M.required + "</b>" : "") + ". The mode assumes you own everything else too; skip any listed character or item you don’t own.",
            off.length ? "<b>Not used in this mode:</b> " + off.join(", ") + "." : ""
          ]) + WL.vx("What this mode uses", used) +
          "<p class=\"note\">Special rules for play are in the Rules Reference under “Game mode: " + c.modeName + "”.</p>";
        },
        src: (c) => "Rules p.18 · " + WL.modeInfo[c.mode].srcShort + (c.v("unique") ? " · p.6" : "") }
    ]
  },
  {
    id: "A",
    title: "A. Pre-Setup",
    note: "Set up the play area and randomize anything that needs randomizing.",
    steps: [
      { id: "A-boards", when: () => true, exp: "core",
        t: "Unbox & lay out the boards",
        d: (c) => WL.ul([
          "Remove all of the components from the box.",
          c.bt ? "Place the game boards in the center of the table: the Western Legends board, the <b>Buzzard Gulch</b> board and the train board extension, arranged for Who Runs Border Town? as in the next step (diagram on page 24)." : "Place the game boards in the center of the table" + (c.has("au") ? ": the Western Legends board and the <b>Buzzard Gulch</b> board from Ante Up, plus the train board extension, as in the diagram on pages 4–5." : ", plus the train board extension, as in the diagram on pages 4–5."),
          c.lss ? "Place the <b>story board overlay</b> on top of the story card spaces on the game board." : "",
          c.csc ? (c.has("bm") ? "<b>Core Story Card variant:</b> leave the story board overlay in the box. The story cards go straight onto the game board (book step A14)." : "<b>Core Story Card variant:</b> the story cards go straight onto the game board (see the story cards step).") : ""
        ]),
        src: (c) => WL.join(["Rules p.3", "p.4–5", c.has("au") ? "p.23" : "", c.csc ? "p.14" : ""]) },
      { id: "A-bt", when: (c) => c.bt, exp: "mode",
        t: "Border Town: the Buzzard Gulch board",
        d: () => "<p>The game is played entirely on the <b>Buzzard Gulch</b> board. Follow the diagram on page 24 (its numbers match these):</p><ol>" + [
            "Place the Buzzard Gulch board <b>sideways on top of</b> the Western Legends board: the edge with the Rail Station just above the Legendary Point track, and the leftmost edge just to the right of the spaces for the story deck.",
            "Fold under the rightmost section of the <b>train board extension</b> and place it just above the Buzzard Gulch board, its left edge just right of the Wanted track.",
            "The Train starts at the <b>Buzzard Gulch Rail Station</b> (see “Tokens, dice and the Train”).",
            "Place the <b>Bandit Hideout</b> tokens (Blood Money) or 3D buildings on the spaces with a red Bandit Hideout icon. The diagram shows 3: A, B and C.",
            "Place the <b>Mine</b> tokens or buildings on the spaces with a yellow Mine icon. The diagram shows 2."
          ].map(x => "<li>" + x + "</li>").join("") + "</ol>" +
          WL.ul([
            "The <b>Bank</b>, <b>Cabaret</b> and <b>Doctor’s Office</b> aren’t used.",
            "The Buzzard Gulch <b>Marshal’s Office</b> also counts as the Sheriff’s Office for cards, arrests and the Sheriff."
          ]),
        src: "Rules p.23–25" },
      { id: "A-stands", when: () => true, exp: "core",
        t: "Assemble the store stands",
        d: (c) => WL.ul([
          "If they aren’t already assembled, assemble the " + (c.noTrader ? "<b>General Store</b> and <b>Trading Post</b>" : "<b>General Store</b>" + (c.has("au") ? ", <b>Trading Post</b>" : "") + " and <b>Traveling Trader</b>") + " stands.",
          c.has("au") && !c.bt ? "The Trading Post stand belongs to the Trading Post location in Buzzard Gulch (Ante Up)." : "",
          c.bt ? "Who Runs Border Town? uses both the General Store and Trading Post stands. They count as <b>one store</b> for the Purchase/Upgrade action." : "",
          c.noTrader ? "The <b>Traveling Trader</b> isn’t used in " + c.modeName + ": leave its stand, miniature and trader movement cards in the box." : ""
        ]),
        src: (c) => WL.join(["Rules p.3", c.has("au") ? "p.48" : "", c.mode === "serenade" ? "p.19" : "", c.bt ? "p.24" : ""]) },
      { id: "A-legendary", when: (c) => c.legItems, exp: (c) => c.has("bm") ? "bm" : "small",
        t: "Legendary item deck",
        d: (c) => {
          const M = c.mode !== "std" ? WL.modeInfo[c.mode] : null;
          const L = M && M.legendary;
          const it = [];
          if (c.csc && !(L && L.only)) it.push("<b>Core Story Card variant:</b> first remove every Legendary item that references Story points.");
          if (L && L.only) it.push("<b>" + c.modeName + ":</b> the Legendary item deck is only these " + L.only.length + " cards: " + L.only.join(", ") + ".");
          if (L && L.except) it.push("<b>" + c.modeName + ":</b> use every Legendary item card <b>except</b> " + L.except.join(", ") + ".");
          it.push("Shuffle " + (L ? "those" : "all of the") + " Legendary items together to form the <b>Legendary item deck</b>.");
          if (c.noTrader) {
            it.push("The Traveling Trader isn’t used, so there is no Trader stand to put the deck in and nowhere to buy Legendary items. Keep the deck near the board for the game effects that gain them.");
          } else {
            it.push("Place it facedown in the <b>top left</b> section of the Traveling Trader stand. Put the Legendary item deck <b>blocker card</b> on the bottom of the deck.");
            it.push("Draw <b>3</b> cards and place 1 in each of the 3 spaces on the <b>bottom row</b> of the Traveling Trader stand.");
          }
          return WL.ul(it) +
            (c.mode === "serenade" ? "<p class=\"note\">Serenade of the Six Guns: Legendary items can’t be purchased; they must be gained through game effects.</p>" : "") +
            (c.noTrader ? "<p class=\"note\">The book doesn’t say where the Legendary item deck goes when the Traveling Trader isn’t used.</p>" : "") +
            "<p class=\"note\">The Legendary items in Appendix VII come from Blood Money, The Good, The Bad, and The Handsome and Wild Bunch of Extras.</p>";
        },
        src: (c) => WL.join(["Rules p.3", c.csc ? "p.14" : "", c.mode !== "std" ? WL.modeInfo[c.mode].srcShort : "", "p.88–95"]) },
      { id: "A-stores", when: () => true, exp: "core",
        t: "Stock the stores",
        d: (c) => {
          if (c.mode !== "std") {
            const S = WL.modeInfo[c.mode].stores;
            const rows = [];
            if (S.both) rows.push("<b>General Store and Trading Post</b> (" + S.both.length + " items, one store): " + S.both.join(", ") + ".");
            if (S.gs) rows.push("<b>General Store</b> (" + S.gs.length + "): " + S.gs.join(", ") + ".");
            if (S.tp) rows.push("<b>Trading Post</b> (" + S.tp.length + "): " + S.tp.join(", ") + ".");
            if (S.tt) rows.push("<b>Traveling Trader</b> (" + S.tt.length + "): " + S.tt.join(", ") + ".");
            return "<p><b>" + c.modeName + "</b> doesn’t use the store randomizer cards. Set up the store stands with exactly these items:</p>" + WL.ul(rows) +
              WL.ul([
                "Place each item deck in its stand." + (S.tt ? " The Traveling Trader’s items go in its 2 empty spaces, which can put several items in the same space." : ""),
                S.both ? "The book doesn’t say how to split these between the two stands. They count as one store: buy or upgrade any of them from a space adjacent to the Buzzard Gulch Trading Post, the only store location on the Buzzard Gulch board." : "",
                c.noTrader ? "No Traveling Trader in this mode." : "",
                "Items that aren’t listed aren’t used. If you don’t own a listed item, skip it."
              ]);
          }
          const it = [];
          it.push("Prepare the <b>store randomizer cards</b>. Remove the cards for any items you aren’t using and return them to the box." + (c.csc ? " (Core Story Card variant: this includes every item that references Story points.)" : ""));
          it.push("Set aside the <b>standard setup card</b> as a quick reference for how the stores should be set up. Shuffle the remaining randomizer cards into a facedown deck.");
          if (c.has("au")) {
            it.push("Deal 1 randomizer card to each space in the <b>General Store</b> and the <b>Trading Post</b>.");
            it.push("The <b>first weapon</b> and <b>first mount</b> revealed go into the General Store. The <b>second weapon</b> and <b>second mount</b> go into the Trading Post.");
            it.push("Standard setup: each stand must hold <b>at least 1 weapon and 1 mount</b>. Randomly replace items as needed until it does.");
          } else {
            it.push("Deal 1 randomizer card to each space in the <b>General Store</b>. The first weapon and first mount revealed go into the General Store.");
            it.push("Standard setup: the General Store must hold <b>at least 1 weapon and 1 mount</b>. Randomly replace items as needed until it does.");
          }
          it.push("Place the item decks in the spaces matching the randomizer cards.");
          it.push("Place all remaining items in the <b>2 empty spaces</b> of the Traveling Trader stand. Set their randomizer cards near the stand so players can see which items are available there. This can put several items in the same space.");
          let d = WL.ul(it);
          if (!c.has("au")) d += "<p class=\"note\">The book’s store setup assumes the Trading Post from Ante Up. It doesn’t say how to split the stores without it.</p>";
          return d;
        },
        src: (c) => c.mode !== "std" ? "Rules p.3, 18 · " + WL.modeInfo[c.mode].srcStores + (c.bt ? ", 32, 48" : "") : WL.join(["Rules p.3", c.csc ? "p.14" : ""]) },
      { id: "A-deeds", when: (c) => !c.noDeeds, exp: "core",
        t: "Deeds",
        d: () => WL.ul([
          "Separate the deeds by type (icon).",
          "Place a <b>deed token</b> on each location that has a deed.",
          "Place the deeds in a stack."
        ]),
        src: "Rules p.3" },
      { id: "A-money", when: () => true, exp: "core",
        t: "Money",
        d: () => WL.ul(["Separate the money cards by value into <b>2 decks</b>: $10 and $20 (pictured on page 5)."]),
        src: "Rules p.3, 5" },
      { id: "A-poker", when: () => true, exp: (c) => c.v("altpoker") ? (c.has("bm") ? "bm" : "au") : "core",
        t: "Poker deck",
        d: (c) => {
          if (c.mode !== "std") return WL.ul([
              "Game modes use the <b>Base Blood Money Poker deck</b>: swap in <b>all</b> of the alternate poker cards from the Western Legends expansions" + (c.has("ffe") ? " and use the Jokers from Fistful of Extras (below)" : "") + ".",
              "To swap, exchange each base game poker card for the expansion poker card of the <b>same suit and value</b>. Return the removed base cards to the box.",
              WL.modeInfo[c.mode].poker ? "Then make this mode’s card swaps (below)." : c.modeName + " makes no further changes to it.",
              "Shuffle the poker deck" + (WL.modeInfo[c.mode].poker || c.v("joker") ? " once the changes below are made." : ".")
            ]);
          if (c.v("altpoker")) {
            const which = c.has("au") && c.has("bm") ? "Ante Up and Blood Money" : c.has("au") ? "Ante Up" : "Blood Money";
            return WL.ul([
              "Use the <b>alternate poker cards</b> from " + which + " (recommended).",
              "Exchange each base game poker card for the expansion poker card of the <b>same suit and value</b>. Return the removed base cards to the box.",
              c.has("au") && c.has("bm") ? "This deck is the <b>Standard Blood Money Poker Deck</b>." : "The book’s Standard Blood Money Poker Deck uses the alternate cards from both Ante Up and Blood Money. It doesn’t cover swapping in only one set’s cards.",
              "Shuffle the poker deck."
            ]);
          }
          return WL.ul(["Shuffle the base game poker cards into the poker deck." + ((c.has("au") || c.has("bm")) ? " (The book recommends swapping in the alternate poker cards; see the variants above.)" : "")]);
        },
        src: (c) => WL.join(["Rules p.3", c.mode !== "std" ? "p.18" : ""]) },
      { id: "A-story", when: () => true, exp: (c) => c.lss ? "bm" : "core",
        t: (c) => c.lss ? "Legendary story deck" : "Story cards (Core Story Card variant)",
        d: (c) => {
          if (c.lss) return WL.ul([
            "Shuffle the <b>legendary story cards</b> together.",
            "Separate them into <b>2 decks</b>, each containing 1 of each numbered card, so you have 2 decks numbered 1 through 20.",
            "Choose 1 deck to play with and return the other to the box.",
            "Shuffle the chosen deck and place it facedown on the story board overlay."
          ]);
          return WL.ul([
            c.has("bm") ? "Remove the Blood Money story content: the story board overlay, the legendary story cards and the risk die." : "",
            "Remove all characters that reference Story points on their character card" + (c.v("goal") ? ", and all characters whose <b>goal cards</b> reference Story points" : "") + ".",
            "Remove all items and Legendary items that reference Story points (book steps A5 and A7).",
            (c.mode !== "std" && WL.modeInfo[c.mode].story
              ? "<b>" + c.modeName + ":</b> use only the story cards with " + (WL.modeInfo[c.mode].story.length > 1 ? "either of these triggers" : "this trigger") + " printed on the back: " + WL.modeInfo[c.mode].story.map(s => "“" + s + "”").join(" or ") + ". Return the others to the box. Shuffle the ones you use"
              : "Shuffle all of the <b>story cards</b> together") + " and place them on the game board in <b>2 roughly even piles</b>, trigger side faceup."
          ]) + (c.has("gbh") || c.has("wbe") ? "<p class=\"note\">The Good, The Bad, and The Handsome and Wild Bunch of Extras also contain story cards (Rules p.19, 23).</p>" : "");
        },
        src: (c) => c.lss ? WL.join(["Rules p.3", c.mode === "risky" ? "p.22" : ""]) : WL.join(["Rules p.14", (c.has("gbh") || c.has("wbe")) ? "p.19, 23" : "", c.mode !== "std" ? WL.modeInfo[c.mode].srcShort : ""]) },
      { id: "A-decks", when: () => true, exp: "core",
        t: "Shuffle the card decks",
        d: (c) => {
          const M = c.mode !== "std" ? WL.modeInfo[c.mode] : null;
          const decks = ["<b>event cards</b>", "<b>fight cards</b>", c.noInjury ? "" : "<b>injury cards</b>", "<b>train encounter cards</b>", c.noTrader ? "" : "<b>trader movement cards</b>"].filter(Boolean);
          return WL.ul([
            M ? "<b>" + c.modeName + " — event deck:</b> " + M.events : "",
            "Shuffle each into its own facedown deck and place it as shown in the diagram on pages 4–5: " + decks.slice(0, -1).join(", ") + " and " + decks[decks.length - 1] + ".",
            c.noInjury ? "<b>The Golden Rule:</b> injury cards aren’t used in this mode." : "",
            c.noTrader ? "The Traveling Trader isn’t used, so leave out the trader movement cards." : ""
          ]);
        },
        src: (c) => WL.join(["Rules p.3–5", c.mode !== "std" ? WL.modeInfo[c.mode].srcEvents : ""]) },
      { id: "A-tokens", when: () => true, exp: "core",
        t: "Shuffle the token stacks",
        d: (c) => WL.ul([
          "Shuffle each into its own facedown stack and place it as shown in the diagram on pages 4–5: <b>cattle tokens</b>, <b>outlaw tokens</b>, <b>high roller tokens</b> and <b>claim jumper tokens</b>.",
          "Each Ranch has its own identical set of <b>8 cattle tokens</b> in its colour" + (c.has("au") ? " (3 Ranches)" : "") + "."
        ]),
        src: "Rules p.3, 28" },
      { id: "A-legtokens", when: () => true, exp: (c) => c.has("ffe") ? "small" : "core",
        t: "Legendary tokens",
        d: (c) => WL.ul([
          "Shuffle the <b>legendary tokens</b> into a facedown supply" + (c.has("ffe") ? ", or put them in the <b>legendary token bag</b> from Fistful of Extras." : "."),
          c.has("au") ? "With Ante Up’s tokens there are <b>27</b>: 3 worth 0 LP, 7 worth 1 LP, 10 worth 2 LP, 4 worth 3 LP and 3 worth 4 LP." : ""
        ]),
        src: (c) => WL.join(["Rules p.3", c.has("au") ? "p.15, 36" : ""]) }
    ]
  },
  {
    id: "B",
    title: "B. Play Area Setup",
    note: "Place the components where the diagram on pages 4–5 shows. Numbers match that diagram.",
    steps: [
      { id: "B-cards", when: () => true, exp: "core",
        t: "Stands, decks and money",
        d: (c) => WL.ul([
          "<b>1</b> General Store stand" + (c.noTrader ? "" : " · <b>2</b> Traveling Trader stand · <b>3</b> trader movement deck") + (c.has("au") ? " · <b>4</b> Trading Post stand" : ""),
          "<b>5</b> fight deck · <b>6</b> money cards ($20 and $10 decks) · <b>7</b> poker deck",
          c.lss ? "<b>8</b> legendary story cards, on the story board overlay" : "<b>8</b> story cards: the 2 piles on the game board’s story card spaces (Core Story Card variant)",
          (c.noInjury ? "" : "<b>11</b> injury deck · ") + "<b>12</b> event deck · <b>13</b> train encounter deck",
          c.noDeeds ? "" : "<b>18</b> deeds",
          c.mode !== "std" && (c.noTrader || c.noDeeds || c.noInjury) ? "Left out in " + c.modeName + ": " + [c.noTrader ? "the Traveling Trader stand and trader movement deck (2, 3)" : "", c.noInjury ? "the injury deck (11)" : "", c.noDeeds ? "the deeds (18)" : ""].filter(Boolean).join(", ") + "." : "",
          c.bt ? "The Buzzard Gulch board now sits on top of the main board (step “Border Town: the Buzzard Gulch board”), so place these around it." : ""
        ]),
        src: (c) => WL.join(["Rules p.4–5", c.csc ? "p.14" : "", c.mode !== "std" ? WL.modeInfo[c.mode].srcShort : ""]) },
      { id: "B-board", when: () => true, exp: "core",
        t: "Tokens, dice and the Train",
        d: (c) => WL.ul([
          c.bt ? "<b>14</b> cattle tokens: the Buzzard Gulch Ranch’s stack on its Ranch. The Mesito’s Point and Sunny Hills Ranches are under the Buzzard Gulch board in this mode; the book doesn’t say whether their cattle tokens are used." : "<b>14</b> cattle tokens: each Ranch’s stack on its Ranch" + (c.has("au") ? " (Mesito’s Point, Sunny Hills and Buzzard Gulch)." : "."),
          "<b>15</b> longhorn tokens · <b>16</b> outlaw, high roller and claim jumper tokens · <b>17</b> legendary tokens: in supplies beside the board.",
          c.lss ? "<b>9</b> map tokens and <b>10</b> ruin tokens: beside the story board overlay." : "<b>10</b> ruin tokens: beside the board. (The 3 map tokens, diagram <b>9</b>, are used only by legendary story cards.)",
          c.has("au") && !c.bt ? "<b>19</b> mountain pass markers: on the main board’s two Trailheads, Bandit Hideout A in Sunny Hills and Bandit Hideout C in Cliff Junction." : "",
          c.bt ? "<b>19</b> mountain pass markers: they go on the main board’s Trailheads, which the Buzzard Gulch board now covers. The book’s Border Town setup doesn’t mention them." : "",
          c.bt ? "<b>Train miniature:</b> at the <b>Buzzard Gulch Rail Station</b>. In this mode the Train has only 3 checkpoints: Buzzard Gulch Rail Station → Mountain Pass A → Mountain Pass C → back to the Rail Station." : "<b>20</b> train miniature: at <b>Spike’s View Rail Station</b>, the Train’s first checkpoint.",
          "<b>21</b> mining dice" + (c.lss ? " and risk die" : "") + " · <b>22</b> gold nuggets: beside the board."
        ]) + (c.bt ? "<p class=\"note\">Who Runs Border Town? is played entirely on the Buzzard Gulch board, which covers the main board’s Ranches and Trailheads. Apart from the Train, the book doesn’t change this step.</p>" : ""),
        src: (c) => WL.join(["Rules p.4–5", "p.28", c.lss ? "" : "p.37", c.has("au") && !c.bt ? "p.39" : "", "p.48", c.bt ? "p.24–25" : "", c.bt ? "p.42" : ""]) }
    ]
  },
  {
    id: "C",
    title: "C. Final Setup",
    note: "Each player sets up their own play space, picks a character, and you finish the setup that depends on them.",
    steps: [
      { id: "C-length", when: () => true, exp: "core",
        t: (c) => "Game length: " + c.len + " LP",
        d: (c) => WL.ul([
          "Decide the length of game: Short <b>15 LP</b>, Average <b>20 LP</b> or Long <b>25 LP</b>. Tonight: <b>" + c.len + " LP</b>.",
          "Place the <b>end of game marker</b> on space <b>" + c.len + "</b> of the Legendary Point track.",
          c.mode !== "std" ? c.modeName + " recommends <b>" + WL.modeInfo[c.mode].rec.lp + " LP</b>." : ""
        ]),
        src: (c) => WL.join(["Rules p.6, 8", c.mode !== "std" ? WL.modeInfo[c.mode].srcShort : ""]) },
      { id: "C-events", when: () => true, exp: "core",
        t: "Event markers",
        d: (c) => {
          const lp = []; for (let s = 5; s < c.len; s += 5) lp.push(s);
          return WL.ul([
            "Place 1 event marker on the <b>5th space</b> of the Gambler, Marshal and Wanted tracks.",
            "Place 1 event marker on every fifth space of the Legendary Point track before the end of game marker: spaces <b>" + lp.join(", ") + "</b>.",
            "That is <b>" + (3 + lp.length) + "</b> event markers. Return the unused ones to the box."
          ]);
        },
        src: "Rules p.6" },
      { id: "C-opening", when: () => true, exp: (c) => c.v("unique") ? "small" : "core",
        t: "Opening events",
        d: (c) => {
          const n = Math.ceil(c.p / 2);
          return WL.ul([
            c.v("unique") ? "<b>Unique Events (Wild Bunch of Extras):</b> shuffle the Unique event cards into the event deck, and place the <b>Unique event tokens</b> in a supply near the board." : "",
            "Draw and resolve <b>1 event card for every 2 players, rounded up</b>: <b>" + n + "</b> event card" + (n === 1 ? "" : "s") + " for " + c.p + " players.",
            "If a drawn event calls for the <b>Sheriff</b> to move, ignore that effect. The Sheriff isn’t on the board yet.",
            c.bt ? "<b>Border Town:</b> event text that names a space or region on the Western Legends board uses the <b>Buzzard Gulch equivalent</b> instead. If several locations qualify, the active player chooses." : ""
          ]) + "<p class=\"note\">The book prints the opening draw inside the Unique Events step. It applies to every game, though: book step C15 removes the event tokens these cards place." + (c.mib ? " The book doesn’t say whether the Man in Black counts as a player for this draw." : "") + (c.bt ? " It also doesn’t say who chooses between equivalent locations before anyone has taken a turn." : "") + "</p>";
        },
        src: (c) => WL.join(["Rules p.6", c.bt ? "p.25" : ""]) },
      { id: "C-frontier", when: (c) => c.has("au"), exp: "au",
        t: "Frontier tokens",
        d: () => WL.ul([
          "Randomly place 1 <b>frontier token</b>, number faceup, on each Frontier space on the Buzzard Gulch board.",
          "Put the unused frontier tokens in a supply near the board."
        ]),
        src: "Rules p.6, 31" },
      { id: "C-trader", when: (c) => !c.noTrader, exp: "core",
        t: "Place the Traveling Trader",
        d: () => WL.ul([
          "Reveal the top card of the <b>trader movement deck</b>.",
          "Place the <b>Traveling Trader</b> miniature on any empty space in the region shown on the card."
        ]),
        src: "Rules p.6" },
      { id: "C-kits", when: () => true, exp: "core",
        t: "Player kits & scoring cubes",
        d: (c) => WL.ul([
          "Each player chooses a colour and takes a <b>player mat</b>, their <b>scoring cubes</b>, <b>bet markers</b>, <b>story discs</b>, a <b>ring</b> of their colour and a <b>wound token</b>. Use the side of the player mat with spaces for <b>legendary tokens</b>.",
          "Each player places 1 scoring cube to the <b>left of the 1 space</b> on the Legendary Point track.",
          c.lss ? "Each player places 1 scoring cube on the <b>starting space of the Story track</b>." : "",
          "Each player places their remaining " + (c.lss ? "2 scoring cubes" : "scoring cubes") + " and all <b>3 story discs</b> to the left of the board.",
          c.csc ? "Core Story Card variant: the Story track is on the story board overlay, which isn’t used, so no cube goes on it." : "",
          c.bt ? "<b>Border Town:</b> each player also sets aside <b>1 of their cubes</b> near their player mat. It is their <b>homestead marker</b>." : ""
        ]),
        src: (c) => WL.join(["Rules p.6", c.csc ? "p.14, 47" : "", c.bt ? "p.24" : ""]) },
      { id: "C-character", when: () => true, exp: "core",
        t: "Choose characters",
        d: (c) => WL.ul([
          c.mode !== "std" ? WL.modeChars(c) : "",
          c.csc ? "Core Story Card variant: the characters that reference Story points" + (c.v("goal") ? " (and those whose goal cards do)" : "") + " are already removed (Story cards step, Rules p.14)." : "",
          "Each player draws <b>2 character cards</b>" + (c.mode !== "std" ? " from those" : "") + ", chooses 1, and returns the other to the box.",
          "Each player gains everything listed on the back of their character card: items, money, poker cards, and Gambler, Legendary, Marshal, Story or Wanted points.",
          "A character that starts with Gambler, Legendary, Marshal or Wanted points places 1 scoring cube on that track, on the matching space.",
          "A character’s ability is only active once they have <b>5 LP</b> (the star on the Legendary Point track).",
          c.mode === "serenade" ? "<b>Serenade of the Six Guns:</b> every player also starts with <b>2 extra poker cards</b> in their hand." : ""
        ]),
        src: (c) => WL.join(["Rules p.6", "p.28, 35", c.csc ? "p.14" : "", c.mode !== "std" ? WL.modeInfo[c.mode].srcShort : ""]) },
      { id: "C-first", when: () => true, exp: "core",
        t: "First player",
        d: () => WL.ul([
          "The <b>most Wanted</b> player takes the first player token.",
          "If players are tied for most Wanted, or nobody starts Wanted, choose the first player another way.",
          "The book strongly recommends that Wanted players sit next to each other in clockwise turn order, so they aren’t arrested early."
        ]),
        src: "Rules p.6" },
      { id: "C-wounds", when: () => true, exp: "core",
        t: "Wound tokens",
        d: () => WL.ul([
          "Each player places their wound token on the starting <b>crosshair</b> space of the wound track on their player mat.",
          "A character that begins the game with wounds moves its wound token to mark them."
        ]),
        src: "Rules p.6" },
      { id: "C-minis", when: () => true, exp: "core",
        t: "Miniatures & starting locations",
        d: (c) => WL.ul([
          "Starting with the first player, each player picks a <b>miniature</b> and attaches their colour ring to its base.",
          c.bt ? "<b>Border Town:</b> ignore the Starting Location on your character card. In turn order (determined normally), each player places their miniature on <b>any unoccupied space</b> on the board." : "Place your miniature in the space listed under <b>Starting Location</b> on the back of your character card.",
          c.bt ? "" : "If your Starting Location is a General Store, Trading Post or Saloon, you may choose any of the <b>3 spaces adjacent</b> to it.",
          "Remove any <b>event tokens</b> from spaces where a player places their miniature: claim jumper, high roller, longhorn" + (c.v("unique") ? ", outlaw and Unique event" : " and outlaw") + " tokens."
        ]),
        src: (c) => WL.join(["Rules p.6", c.bt ? "p.24" : ""]) },
      { id: "C-mib", when: (c) => c.mib, exp: "p2",
        t: "The Man in Black (2 players)",
        d: (c) => WL.ul([
          "Choose a miniature and colour for the <b>Man in Black</b>. Attach the coloured ring to his base.",
          c.has("au") ? "Place him at either <b>Rail Station</b>, as the players choose." : "Place him at the <b>Rail Station</b> on the main board (the second Rail Station is on Ante Up’s Buzzard Gulch board).",
          "Place a scoring cube of his colour to the left of the 1 space of the Legendary Point track, with the players’ cubes.",
          c.mode === "serenade"
            ? "<b>Serenade of the Six Guns:</b> use only Man in Black cards <b>1–9, 11–15 and 19</b>" + (c.has("ffe") ? "" : " (11–15 and 19 are from Fistful of Extras, so you play with 1–9)") + ". Shuffle them into the Man in Black deck and place it near the board."
            : "Shuffle the <b>Man in Black deck</b> and place it near the board: cards 1–10 (Western Legends)" + (c.has("ffe") ? ", 11–21 (Fistful of Extras)" : "") + (c.has("promo") ? ", and the promo cards P-01 and P-03 to P-07" : "") + "."
        ]),
        src: (c) => WL.join(["Rules p.3, 17", c.has("au") ? "" : "p.42", c.mode === "serenade" ? "p.19" : ""]) },
      { id: "C-sheriff", when: () => true, exp: "core",
        t: "The Sheriff",
        d: (c) => WL.ul([
          "Choose one of the remaining miniatures to be the <b>Sheriff</b> and attach the <b>brown ring</b> to its base.",
          c.bt ? "Place the Sheriff in the Buzzard Gulch <b>Marshal’s Office</b>. In Who Runs Border Town? it counts as the Sheriff’s Office for cards, arrests and the Sheriff." : "Place the Sheriff in the <b>Sheriff’s Office</b> in Darkrock."
        ]),
        src: (c) => WL.join(["Rules p.6, 45", c.bt ? "p.25" : ""]) },
      { id: "C-bandits", when: () => true, exp: "core",
        t: "Bandits",
        d: (c) => WL.ul([
          "Choose <b>six</b> of the remaining miniatures to be bandits and attach a <b>grey ring</b> to each.",
          "Place 1 bandit at each <b>Bandit Hideout</b> that doesn’t already hold a player miniature.",
          c.bt ? "<b>Border Town:</b> the Bandit Hideouts in play are the tokens or buildings you placed on the Buzzard Gulch board (3 in the diagram on p.24)." : ""
        ]),
        src: (c) => WL.join(["Rules p.6, 27", c.bt ? "p.24" : ""]) },
      { id: "C-aids", when: () => true, exp: "core",
        t: "Player aids & variants",
        d: (c) => WL.ul([
          "Give each player a <b>player aid</b>.",
          "Then set up any additional variants you plan to use, following their setup instructions (Rules p.13–18)" + (c.mode === "std" ? "." : ". In a game mode, use only the variants the mode names.")
        ]),
        src: "Rules p.6" }
    ]
  }
];

/* =============================================================================
   STEP HOOKS — extra text appended to (or hiding) a setup step for a variant or
   game mode. { step, when(c), html(c), src, hide }. Variants: Rules p.13–18.
   Game-mode store, story, character and event changes are written into the
   steps themselves (WL.modeInfo in js/data-modes.js).
   ============================================================================= */
WL.stepHooks = [
  /* Game-mode poker swaps (Rules p.19–21) */
  { step: "A-poker", when: (c) => c.mode !== "std" && !!WL.modeInfo[c.mode].poker,
    html: (c) => {
      const P = WL.modeInfo[c.mode].poker;
      return "<div class=\"vx\"><p class=\"vx-h\">" + c.modeName + ": poker card swaps</p>" +
        "<div class=\"tbl-wrap\"><table><thead><tr><th>Remove</th><th>Add</th></tr></thead><tbody>" +
        P.remove.map((r, i) => "<tr><td>" + WL.suit(r) + "</td><td>" + WL.suit(P.add[i]) + "</td></tr>").join("") +
        "</tbody></table></div></div>";
    },
    src: (c) => WL.modeInfo[c.mode].srcPoker },
  /* Joker Card variant (Fistful of Extras), Rules p.16; game modes use them if able, p.18 */
  { step: "A-poker", when: (c) => c.v("joker"),
    html: (c) => WL.vx("Joker Card variant (Fistful of Extras)", [
      "Shuffle <b>both Joker cards</b> into the poker deck (book step A13)." + (c.mode !== "std" ? " Game modes use the Jokers if you have them." : "")
    ]),
    src: (c) => c.mode !== "std" ? "p.16, 18" : "p.16" },
  /* Goal Cards variant, Rules p.15 */
  { step: "C-character", when: (c) => c.v("goal"),
    html: (c) => WL.vx("Goal Cards variant" + (c.mode === "risky" ? " (part of Risky Business)" : ""), [
      "As part of this step (book step C11), each player takes the <b>4 goal cards</b> for their character.",
      "Each player discards <b>1 at random</b>, back to the box, <b>without looking at it</b>. It isn’t used this game.",
      "Keep your other 3 goal cards facedown, hidden from the other players."
    ]),
    src: (c) => c.mode === "risky" ? "p.15, 22" : "p.15" },
  /* Sheriff variant (Wild Bunch of Extras), Rules p.17 */
  { step: "C-sheriff", when: (c) => c.v("sheriff"),
    html: () => WL.vx("Sheriff variant (Wild Bunch of Extras)", [
      "Shuffle the <b>sheriff cards</b> and reveal the top card. It is the active sheriff card: this Sheriff’s personality."
    ]),
    src: "p.17" },
  /* Bandit Card variant (Fistful of Extras 1–6, Wild Bunch of Extras 7–8), Rules p.13 */
  { step: "C-bandits", when: (c) => c.v("bandit"),
    html: (c) => WL.vx("Bandit Card variant", [
      "Apply the numbered <b>bandit stickers</b> to the bottom of the grey bandit rings or of the miniatures. Each number names that bandit.",
      "Suggested miniatures (pictured on p.13; use any you like): <b>1</b> The Gambler · <b>2</b> The Desperado · <b>3</b> The Fugitive · <b>4</b> The Robber · <b>5</b> The Bandido · <b>6</b> The Horse Thief.",
      "Shuffle the <b>bandit cards</b> and place them facedown near the fight deck. Bandit cards 1–6 are in Fistful of Extras and 7–8 in Wild Bunch of Extras" + (c.has("ffe") && c.has("wbe") ? "." : ": use the ones you own.")
    ]),
    src: "p.13" },
  /* Gang/Posse variant (Wild Bunch of Extras), Rules p.15 */
  { step: "C-aids", when: (c) => c.v("gang"),
    html: (c) => WL.vx("Gang/Posse variant (Wild Bunch of Extras)" + (c.mode === "law" ? ", part of Law and Disorder" : ""), [
      "Place the double-sided <b>gang/posse cards</b> beside the board."
    ]),
    src: (c) => c.mode === "law" ? "p.15, 21" : "p.15" },
  /* Title Card variant (Wild Bunch of Extras), Rules p.18 */
  { step: "C-aids", when: (c) => c.v("title"),
    html: () => WL.vx("Title Card variant (Wild Bunch of Extras)", [
      "Shuffle all of the <b>title cards</b> into a deck and reveal <b>1 at random</b>. Its rule is in effect for the whole game."
    ]),
    src: "p.18" },
  /* High Stakes Poker variant (Ante Up), Rules p.16 */
  { step: "C-aids", when: (c) => c.v("hsp"),
    html: () => WL.vx("High Stakes Poker variant (Ante Up)", [
      "No extra setup. It adds a game you can choose when you Gamble at a Saloon (see the Rules Reference)."
    ]),
    src: "p.16" }
];
