/* =============================================================================
   Vast: The Crystal Caverns — Setup & Reference Utility · data (roles, variant engine, setup)
   Sources (the only sources): the Vast: The Crystal Caverns rulebook (file dated 2016-11-27, "Rules"),
   the Official FAQ last updated 2019-07-12 ("FAQ", no printed page numbers: PDF pages), and the
   Fearsome Foes rulebooks for the Ghost / Cave Ghost ("Ghost"), Ghoul / Vile Ghoul ("Ghoul") and
   Nightmare / Shadow Unicorn ("Unicorn"), web editions of 2020-10-15.
   Precedence: FAQ > rulebook; each Fearsome Foes book governs its own roles and the base rules it changes.
   Reference sections live in data-ref.js, the teaching script in data-teach.js.
   ============================================================================= */
var VC = {};

/* tag shown on each setup step */
VC.expMeta = {
  core:    { name: "Base game",      cls: "tag-core" },
  variant: { name: "Role variant",   cls: "tag-var" },
  ghost:   { name: "Fearsome Foes",  cls: "tag-ff" },
  ghoul:   { name: "Fearsome Foes",  cls: "tag-ff" },
  unicorn: { name: "Fearsome Foes",  cls: "tag-ff" },
  faq:     { name: "FAQ",            cls: "tag-faq" },
  opt:     { name: "Optional",       cls: "tag-opt" }
};

/* ---------------------------------------------------------------------------
   ROLES — pos = turn-order number printed on each player board (FAQ p.2)
   --------------------------------------------------------------------------- */
VC.roles = [
  { id: "knight",    name: "The Knight",            short: "Knight",            letter: "K", pos: 1, box: "core",
    blurb: "Explore, grow in Grit, slay the Dragon", src: "Rules p.6" },
  { id: "goblins",   name: "The Goblins",           short: "Goblins",           letter: "G", pos: 2, box: "core",
    blurb: "Three Tribes hunting the Knight", src: "Rules p.8" },
  { id: "vileghoul", name: "The Vile Ghoul",        short: "Vile Ghoul",        letter: "G", pos: 2, box: "ghoul", replaces: "goblins",
    blurb: "Replaces the Goblins: kill the Knight with dice", src: "Ghoul p.6" },
  { id: "dragon",    name: "The Dragon",            short: "Dragon",            letter: "D", pos: 3, box: "core",
    blurb: "Wake up, surface and escape", src: "Rules p.10" },
  { id: "unicorn",   name: "The Nightmare Unicorn", short: "Nightmare Unicorn", letter: "D", pos: 3, box: "unicorn", replaces: "dragon",
    blurb: "Replaces (or joins) the Dragon: gain Radiance, escape", src: "Unicorn p.2" },
  { id: "cave",      name: "The Cave",              short: "Cave",              letter: "C", pos: 4, box: "core",
    blurb: "Grow, then collapse on everyone", src: "Rules p.12" },
  { id: "caveghost", name: "The Cave Ghost",        short: "Cave Ghost",        letter: "C", pos: 4, box: "ghost", replaces: "cave",
    blurb: "Replaces the Cave: haunt it and collapse it", src: "Ghost p.6" },
  { id: "thief",     name: "The Thief",             short: "Thief",             letter: "T", pos: 5, box: "core",
    blurb: "Steal and stash Treasures", src: "Rules p.14" },
  { id: "ghoul",     name: "The Ghoul",             short: "Ghoul",             letter: "",  pos: 6, box: "ghoul",
    blurb: "Added role: build Fury, then escape", src: "Ghoul p.2" },
  { id: "ghost",     name: "The Ghost",             short: "Ghost",             letter: "",  pos: 7, box: "ghost",
    blurb: "Added role: possess the others, lock Artifacts, then escape", src: "Ghost p.2" }
];
VC.role = {};
VC.roles.forEach((r) => { VC.role[r.id] = r; });

/* pairs that cannot both be in play: a replacement role, or one shared set of pieces
   (Rules p.5 Component Limits: "do not use proxy components") */
VC.exclusive = [
  ["goblins", "vileghoul", "The Vile Ghoul replaces the Goblins (Ghoul p.6)"],
  ["cave", "caveghost", "The Cave Ghost replaces the Cave (Ghost p.6)"],
  ["ghoul", "vileghoul", "The Ghoul and Vile Ghoul share one set of Ghoul pieces, dice and discs (Ghoul p.1 · Rules p.5)"],
  ["ghost", "caveghost", "The Ghost and Cave Ghost share one Ghost piece, Possession deck and Ghost tiles (Ghost p.1 · Rules p.5)"]
];

/* difficulty levels: index 0 Easiest … 2 Standard … 4 Expert (Rules p.19 · Ghost p.5, p.7 · Ghoul p.5, p.7 · Unicorn p.4) */
VC.levels = {
  knight:    ["Novice", "Squire", "Knight", "Baroness", "Lady"],
  goblins:   ["Miscreant", "Boss", "Chief", "Master", "Warlord"],
  dragon:    ["Hatchling", "Whelp", "Dragon", "Elder Dragon", "Ancient Dragon"],
  cave:      ["Lava Tube", "Spillway", "Cave", "Great Cave", "Grand Cave"],
  thief:     ["Footpad", "Burglar", "Thief", "Prowler", "Invader"],
  ghost:     ["Spirit", "Specter", "Ghost", "Phantom", "Wraith"],
  caveghost: ["Spirit", "Specter", "Ghost", "Phantom", "Wraith"],
  ghoul:     ["Ragpicker", "Scavenger", "Ghoul", "Stalker", "Hunter"],
  vileghoul: ["Ragpicker", "Scavenger", "Ghoul", "Stalker", "Hunter"],
  unicorn:   ["Terror Pony", "Night Mare", "Nightmare Unicorn", "Dire Unicorn", "Phantasm Unicorn"]
};
VC.levelWord = ["Easiest", "Easy", "Standard", "Hard", "Expert"];

/* optional variants (toggles) */
VC.mods = [
  { id: "terrain", name: "Terrain Variant", summary: "8 Terrain tiles: Canyon, Lake, Magma, Mushroom Forest, 3 Pits, River",
    description: "Optional; all players agree before the game. Terrain is placed the first time each round an Event tile is revealed.", src: "Rules p.16" },
  { id: "collapse", name: "Collapse Variant", summary: "Randomly remove Cave tiles at setup (2–4 recommended) for a shorter, harder game",
    description: "Removes Cave tiles before the Crystal tiles are added, so the Collapse begins sooner.", src: "Rules p.19" },
  { id: "shadow", name: "Shadow Unicorn", summary: "A non-player antagonist: solo, your goal becomes killing him (a solo Ghost keeps her own goal); with more players, one player may take that goal if everyone agrees",
    description: "Not with the Nightmare Unicorn (they share the Unicorn pieces and deck). Not designed against the Cave or Cave Ghost alone.", src: "Unicorn p.5, p.7" },
  { id: "crowded", name: "Crowded House", summary: "Variant card for 4+ players (tiles) and 6+ players (Omens)",
    description: "4+ players without a Cave [Ghost]: place or remove only 1 tile at the end of your turn. 6+ players: the Cave [Ghost] draws Omens as if one more Crystal token were on the map.", src: "Ghost p.7" },
  { id: "faq1", name: "FAQ: 1 tile per turn in the Collapse", summary: "Recommended for 4+ players without a Cave player",
    description: "Each player removes only a single tile at the end of their turn during the Collapse, instead of 3.", src: "FAQ p.21" },
  { id: "skitter", name: "Skitter Variant", summary: "Ghoul picks the symbol; its opponent places it",
    description: "Agree during setup and use it all game.", src: "Ghoul p.4" },
  { id: "simple", name: "Simple Teleport Variant", summary: "Unicorn cards' arrow points away from your seat",
    description: "May be chosen at setup; switching later is announced at the end of the Perform Actions phase.", src: "Unicorn p.4" },
  { id: "focused", name: "Fully Focused Variant", summary: "Ghost: after locking your Artifacts, end a turn on a Ghost tile without a locked Artifact (or lock one more), then escape",
    description: "Combine with any Ghost difficulty except Wraith.", src: "Ghost p.5" }
];

/* ---------------------------------------------------------------------------
   VARIANT ENGINE — works out the role variant for the roles chosen.
   S = { roles:Set, mods:Set, lvl:{role:0..4}, opt:{…} }
   --------------------------------------------------------------------------- */
(function () {
  const LET = { K: "knight", G: "goblins", D: "dragon", C: "cave", T: "thief" };
  const ORDER = ["K", "G", "D", "C", "T"];
  const WORD = { K: "Knight", G: "Goblins", D: "Dragon", C: "Cave", T: "Thief" };

  // 3-player, 2-player and solo role variants (Rules p.17–18). Letters are in turn order.
  const B3 = {
    KGD: { star: 1, pp: "D", src: "Rules p.17" },
    KGC: { star: 1, flare: ["K"], src: "Rules p.17" },
    KDC: { inf: "A", hunger: 2, locked: 1, knightSkip: 1, src: "Rules p.17" },
    GDC: { ash: "map", src: "Rules p.17" }
  };
  const B2 = {
    KG: { star: 1, pp: "G", src: "Rules p.17" },
    KD: { star: 1, inf: "A", pp: "D", hunger: 2, dAmbush: 1, src: "Rules p.17" },
    KC: { sq: 1, flare: ["K"], inf: "B", cAmbush: 1, src: "Rules p.17" },
    KT: { inf: "C", flare: ["T"], kt: 1, src: "Rules p.18" },
    GD: { star: 1, ash: "map", pp: "G", src: "Rules p.18" },
    GC: { flare: ["G"], src: "Rules p.18" },
    GT: { flare: ["G", "T"], flareMap: 1, src: "Rules p.18" },
    DC: { hunger: 2, locked: 1, src: "Rules p.18" },
    DT: { ash: "dragon", flare: ["T"], src: "Rules p.18" },
    CT: { flare: ["T"], ptOpt: 1, src: "Rules p.18" }
  };
  const B1 = {
    K: { star: 1, sq: 1, aid: "I", inf: "solo", decks: 1, src: "Rules p.18" },
    G: { star: 1, aid: "I", flare: ["G"], src: "Rules p.18" },
    D: { star: 1, aid: "I", hunger: "solo", src: "Rules p.18" },
    T: { star: 1, aid: "I", flare: ["T"], src: "Rules p.18" }
  };
  // two-player games with the Ghoul (Ghoul p.4–5)
  const GH2 = {
    K: { inf: "A", pp: "ghoul", ghoulGoal: "kOr", src: "Ghoul p.4" },
    G: { flare: ["G", "ghoul"], flareMap: 1, pp: "ghoul", gEscape: 1, src: "Ghoul p.5" },
    D: { ash: "map", pp: "ghoul", hunger: 0, ghoulGoal: "dOr", src: "Ghoul p.5" },
    C: { flare: ["ghoul"], ghoulGoal: "cOr", src: "Ghoul p.5" },
    T: { flare: ["T", "ghoul"], flareMap: 1, src: "Ghoul p.5" }
  };

  function nameOf(L, map) { return VC.role[map[L]].short; }

  VC.variant = function (S) {
    const has = (r) => S.roles.has(r);
    const ffIn = ["vileghoul", "unicorn", "caveghost", "ghost", "ghoul"].some(has) || S.mods.has("shadow");
    const alongside = has("dragon") && has("unicorn");
    const players = VC.turnOrder(S.roles);
    const n = players.length;
    const map = {};   // letter -> role id actually in play
    players.forEach((r) => {
      const L = VC.role[r].letter;
      if (!L) return;
      if (r === "unicorn" && alongside) return;
      map[L] = r;
    });
    const letters = ORDER.filter((L) => map[L]).join("");
    const v = {
      n, players, alongside, letters, map,
      layers: [], warn: [], extra: [], src: [], valid: true, invalid: "",
      flare: new Set(), flareMap: false, pp: null, ppNote: "", inf: null, ash: null, unicornArmor: false,
      aid: null, hunger: 0, locked: false, sq: false, ptOpt: false, knightSkip: false, decks: false,
      dAmbush: false, cAmbush: false, kt: false, gEscape: false, ghoulGoal: null, ghoulSolo: false,
      ghostMode: null, ghoulMode: null, vg: null, uThief: false, gvGhost: false, vgThief: false, vgCave: false,
      shadow: null, solo: n === 1, noCave: !(has("cave") || has("caveghost")), baseKey: ""
    };
    const R = (L) => map[L];
    const add = (spec, label, cite) => {
      v.layers.push({ name: label, src: cite || spec.src, star: !!spec.star && !ffIn });
      if (spec.src || cite) v.src.push(cite || spec.src);
      if (spec.pp) v.pp = spec.pp === "ghoul" ? "ghoul" : R(spec.pp);
      (spec.flare || []).forEach((f) => { const id = f.length > 1 ? f : R(f); if (id) v.flare.add(id); });
      if (spec.flareMap) v.flareMap = true;
      if (spec.inf) v.inf = spec.inf;
      if (spec.ash) v.ash = spec.ash;
      if (spec.aid) v.aid = spec.aid;
      if (spec.hunger !== undefined) v.hunger = spec.hunger;
      if (spec.locked) v.locked = true;
      if (spec.sq) v.sq = true;
      if (spec.ptOpt) v.ptOpt = true;
      if (spec.knightSkip) v.knightSkip = true;
      if (spec.decks) v.decks = true;
      if (spec.dAmbush) v.dAmbush = true;
      if (spec.cAmbush) v.cAmbush = true;
      if (spec.kt) v.kt = true;
      if (spec.gEscape) v.gEscape = true;
      if (spec.ghoulGoal) v.ghoulGoal = spec.ghoulGoal;
    };
    const vsName = (ls) => ls.split("").map((L) => nameOf(L, map)).join(" vs. ");

    // ---- validity --------------------------------------------------------
    if (!n) { v.valid = false; v.invalid = "Choose at least one role."; return v; }
    if (n === 1 && (has("cave") || has("caveghost"))) {
      v.valid = false;
      v.invalid = has("cave") ? "The Cave cannot be played in solo games (Rules p.18). Add another role."
        : "Like the Cave, there is no solo variant for the Cave Ghost (Ghost p.7). Add another role.";
      return v;
    }

    // ---- base variant for the base-game roles (with replacements in their slots) ----
    function base(ls, layerNote) {
      const k = ls;
      v.baseKey = k;
      const vgNote = has("vileghoul") ? "; plus the Vile Ghoul's changes, Ghoul p.7" : "";
      if (k.length === 5) { add({ star: 1, src: "Rules p.17" }, "5 players: " + vsName(k) + " (all roles, standard rules" + vgNote + ")"); return; }
      if (k.length === 4 && k.indexOf("T") < 0) { add({ star: 1, src: "Rules p.17" }, "4 players: " + vsName(k) + " (standard rules" + vgNote + ")"); return; }
      if (k.length === 4) {
        const o = k.replace("T", "");
        add({ src: "Rules p.17" }, "4 players: Any 3 roles vs. Thief — the others play “" + vsName(o) + "”");
        v.baseKey = o + "+T";
        add(Object.assign({}, B3[o], { star: 0 }), "3-player variant: " + vsName(o));
        return;
      }
      if (k.length === 3 && k.indexOf("T") < 0) { add(B3[k], "3 players: " + vsName(k)); return; }
      if (k.length === 3) {
        const o = k.replace("T", "");
        add({ src: "Rules p.17" }, "3 players: Any 2 roles vs. Thief — the others play “" + vsName(o) + "” with exceptions");
        v.baseKey = o + "+T";
        add(Object.assign({}, B2[o], { star: 0 }), "2-player variant: " + vsName(o));
        // exceptions (Rules p.17)
        v.pp = null;
        if (o.indexOf("C") >= 0) v.ptOpt = true;
        if (v.flare.size) v.flareMap = true;
        v.flare.add(R("T"));
        v.sq = false;
        v.thief3 = true;
        return;
      }
      if (k.length === 2) { add(B2[k], "2 players: " + vsName(k)); return; }
      if (k.length === 1) {
        // solo variants: Fearsome Foes replacements have their own
        if (k === "G" && R("G") === "vileghoul") { v.vgSolo = true; add({ src: "Ghoul p.7", aid: "II", flare: ["G"] }, "Solo: the Vile Ghoul"); return; }
        if (k === "D" && R("D") === "unicorn") { v.uSolo = true; add({ src: "Unicorn p.4", aid: "II" }, "Solo: the Nightmare Unicorn"); return; }
        add(B1[k], "Solo: the " + nameOf(k, map));
        return;
      }
    }

    // ---- core layer: base roles + the Ghoul (the Ghoul's Player Variants come first — Ghost p.5) ----
    const baseCount = letters.length;
    const withGhoul = has("ghoul");
    if (letters === "C" && !withGhoul) {
      // only reachable with the Ghost: she joins another role's solo variant, and the Cave has none
      v.valid = false;
      v.invalid = "A 2-player game with the Ghost adds her to another role's solo variant (Ghost p.5), and the " + VC.role[map.C].short + " has no solo variant (Rules p.18" + (map.C === "caveghost" ? " · Ghost p.7" : "") + "). Add another role.";
      return v;
    }
    const alongSolo = alongside && baseCount === 1 && !withGhoul;
    if (alongSolo) {
      // the Dragon is the only other base role: the books define no variant for the Dragon and Unicorn on their own
      add({ src: "Unicorn p.4" }, "Dragon and Nightmare Unicorn (Unicorn vs. Dragon rules; standard rules otherwise)");
      v.warn.push("The books give no variant for the Dragon and the Nightmare Unicorn on their own. This page uses the standard rules (no variant cards) plus the Unicorn vs. Dragon rules; with no Cave player, everyone loses if the Cave collapses (Rules p.4).");
      v.baseKey = "D";
    } else if (withGhoul) {
      v.ghoulMode = baseCount >= 3 ? "4" : baseCount === 2 ? "3" : baseCount === 1 ? "2" : "solo";
      if (baseCount >= 3) {
        base(letters);
        add({ src: "Ghoul p.4" }, "+ the Ghoul (4+ players)");
        if (v.noCave) { v.pp = "ghoul"; v.ppNote = "The Ghoul gets Past Plunder instead of any other player, even if the variant would not include it (Ghoul p.4)."; }
      } else if (baseCount === 2) {
        v.baseKey = letters;
        add(Object.assign({}, B2[letters], { star: 0 }), "2-player variant for the others: " + vsName(letters));
        add({ src: "Ghoul p.4" }, "3 players: Any 2 roles vs. Ghoul");
        v.hunger = 0; v.locked = false;
        if (v.flare.size) v.flareMap = true;
        v.flare.add("ghoul");
        if (v.pp) { v.ppNote = "The Ghoul gets Past Plunder instead of the " + VC.role[v.pp].short + " (Ghoul p.4)."; v.pp = "ghoul"; }
      } else if (baseCount === 1) {
        v.baseKey = letters + "+ghoul";
        const L = letters;
        add(GH2[L], "2 players: " + nameOf(L, map) + " vs. Ghoul");
      } else {
        v.ghoulSolo = true;
        add({ src: "Ghoul p.5", aid: "II", flare: ["ghoul"] }, "Solo: the Ghoul");
      }
    } else if (baseCount) {
      base(letters);
    }

    // ---- the Ghost (added after the Ghoul — Ghost p.5) ----
    if (has("ghost")) {
      const m = baseCount + (withGhoul ? 1 : 0) + (alongside ? 1 : 0);   // players the Ghost joins
      v.ghostMode = m >= 3 ? "4" : m === 2 ? "3" : m === 1 ? "2" : "solo";
      if (m >= 3) {
        add({ src: "Ghost p.5" }, "+ the Ghost (4+ players)");
        if (v.noCave) { v.pp = "ghost"; v.ppNote = "The Ghost always gets Past Plunder, even if another player would get it or the variant would not include it (Ghost p.5)."; }
      } else if (m === 2) {
        add({ src: "Ghost p.5" }, "3 players: the Ghost joins a 2-player variant");
        if (v.pp && v.pp !== "ghost") { v.ppNote = "The Ghost gets Past Plunder instead of the " + VC.role[v.pp].short + " (Ghost p.5" + (v.pp === "ghoul" ? "; Ghoul p.4" : "") + ")."; v.pp = "ghost"; }
      } else if (m === 1) {
        const other = players.find((r) => r !== "ghost" && r !== "unicorn") || players.find((r) => r !== "ghost");
        if (other === "cave") {
          v.valid = false;
          v.invalid = "A 2-player game with the Ghost adds her to another role's solo variant (Ghost p.5), and the Cave has no solo variant (Rules p.18). Add another role.";
          return v;
        }
        add({ src: "Ghost p.5" }, "2 players: the Ghost joins the " + VC.role[other].short + (/s$/.test(VC.role[other].short) ? "'" : "'s") + " solo variant");
        v.aid = null;   // neither player takes Alone in the Dark (II)
        if (other === "goblins") v.gvGhost = true;
      } else {
        add({ src: "Ghost p.5", aid: "II", flare: ["ghost"] }, "Solo: the Ghost");
      }
    }

    // ---- Nightmare Unicorn alongside the Dragon (Unicorn p.4) ----
    if (alongside) {
      if (!alongSolo) {
        add({ src: "Unicorn p.4" }, "+ the Nightmare Unicorn alongside the Dragon (Unicorn vs. Dragon)");
        v.warn.push("The Unicorn book gives rules for the Unicorn alongside the Dragon (“Unicorn vs. Dragon (+Any)”) but not which player-count variant the other roles use. This page sets the other roles up exactly as they would play without the Unicorn. Agree on it before you start.");
      }
      v.hunger = 0; v.locked = false;
    }

    // ---- Fearsome Foes replacement roles ----
    if (has("vileghoul")) {
      v.vg = true;
      if (has("knight")) v.inf = v.inf || "A";
      if (has("dragon")) { v.hunger = 0; v.locked = false; }
      const noKD = !has("knight") && !has("dragon") && !has("unicorn");
      if (noKD && has("thief")) v.vgThief = true;
      else if (noKD && (has("cave") || has("caveghost"))) v.vgCave = true;
      if (n > 1) v.src.push("Ghoul p.7");
    }
    if (has("unicorn") && !alongside) {
      if (v.ash) { v.ash = null; v.unicornArmor = true; }
      if (v.pp === "unicorn") { v.pp = null; v.ppNote = "The Dragon's Past Plunder card is not used: the Nightmare Unicorn is set up normally (Unicorn p.4)."; v.warn.push("Reading of the Unicorn book: “set up all other players as directed by the variant, and set up the Nightmare Unicorn normally” — so the Past Plunder card this variant gives the Dragon is not handed to the Unicorn. Agree on it if your group reads it differently."); }
      if (v.hunger === 2) { v.hunger = 0; v.locked = false; }
      if (v.dAmbush) { v.dAmbush = false; v.warn.push("This variant also lets the Dragon win if a Goblin Ambush kills the Knight. The Unicorn book sets the Unicorn up normally with his own goal, so this page doesn't carry that extra win over to him; agree on it before you start."); }
      if (has("thief") && n > 1 && (letters === "DT" || letters === "DCT")) v.uThief = true;
      if (n > 1) v.src.push("Unicorn p.4");
    }
    if (has("caveghost") && n > 1) v.src.push("Ghost p.7");

    // ---- Shadow Unicorn (Unicorn p.5, p.7) ----
    if (S.mods.has("shadow")) {
      v.shadow = n === 1 ? "solo" : "multi";
      v.src.push(n === 1 ? "Unicorn p.5" : "Unicorn p.7");
      if (n === 1) {
        // "Choose your role and set it up normally" — the solo variant's own setup is replaced
        const r = players[0];
        v.layers = [{ name: "Solo vs. the Shadow Unicorn: the " + VC.role[r].short + " (set up normally)", src: "Unicorn p.5", star: false }];
        v.src = ["Unicorn p.5"];
        v.aid = null; v.sq = false; v.hunger = 0; v.decks = r === "knight";
        v.flare = new Set(); v.flareMap = false; v.inf = null; v.ghoulSolo = false; v.vgSolo = false;
        if (r === "knight") v.inf = "shadow";
        if (["goblins", "thief", "ghoul", "vileghoul"].indexOf(r) >= 0) v.flare.add(r);
      } else {
        v.layers.push({ name: "+ the Shadow Unicorn (non-player; not counted as a player)", src: "Unicorn p.7", star: false });
      }
    }

    // ---- remaining notes ----
    if (v.flare.size >= 2) v.flareMap = true;
    if (v.noCave && n >= 4 && !S.mods.has("crowded") && !v.ghoulMode && !v.ghostMode) {
      v.extra.push("tip4");
    }
    v.src = Array.from(new Set(v.src));
    return v;
  };

  /* turn order: board numbers; the Unicorn alongside the Dragon takes his turn after the Dragon (Unicorn p.4) */
  VC.turnOrder = function (roles) {
    const list = Array.from(roles).filter((r) => VC.role[r]);
    const key = (r) => VC.role[r].pos + (r === "unicorn" && roles.has("dragon") ? 0.5 : 0);
    return list.sort((a, b) => key(a) - key(b));
  };
})();

/* ---------------------------------------------------------------------------
   NUMBERS that depend on difficulty levels (Rules p.19 · Ghost p.5, p.7 · Ghoul p.5, p.7 · Unicorn p.4)
   --------------------------------------------------------------------------- */
VC.num = {
  dragonTargetHealth(c) {                       // the Knight's (or, without her, the Goblins') level sets it
    if (c.has("knight")) return [3, 4, 5, 6, 7][c.lvl("knight")];
    if (c.has("vileghoul")) return [3, 4, 5, 5, 6][c.lvl("vileghoul")];
    if (c.has("goblins")) return [3, 4, 5, 6, 7][c.lvl("goblins")];
    return 5;
  },
  knightHealth(c) {
    if (c.has("vileghoul")) return [5, 6, 7, 7, 8][c.lvl("vileghoul")];
    if (c.has("goblins")) return [5, 6, 7, 8, 9][c.lvl("goblins")];
    return 7;
  },
  knightCrystals(c) {
    if (c.v.kt) return c.opt.kt;
    return [4, 4, 5, 6, 6][c.lvl("knight")];
  },
  knightSmashStr(c) { if (c.has("dragon") || c.has("unicorn")) return 3; return c.lvl("knight") === 0 ? 2 : c.lvl("knight") === 4 ? 4 : 3; },
  goblinCrystals(c) {
    if (c.v.gvGhost) return c.opt.gg;
    return [4, 4, 5, 6, 6][c.lvl("goblins")];
  },
  vileCrystals(c) {
    if (c.v.vgSolo) return { easy: 5, medium: 6, hard: 7 }[c.opt.vSolo];
    if (c.v.vgThief) return c.opt.vt + 1;
    if (c.v.vgCave) return 6;
    return [3, 4, 5, 5, 6][c.lvl("vileghoul")];
  },
  wake(c) { return [7, 9, 11, 13, 13][c.lvl("dragon")]; },
  caveCrystals(c) {
    const r = c.has("caveghost") ? "caveghost" : "cave";
    return [3, 4, 5, 5, 5][c.lvl(r)];
  },
  caveHatred(c) {
    const r = c.has("caveghost") ? "caveghost" : "cave";
    return [0, 0, 0, 4, 8][c.lvl(r)];
  },
  thiefStash(c) {
    if (c.v.kt) return c.opt.kt;
    if (c.v.vgThief) return c.opt.vt;
    return [4, 5, 6, 7, 8][c.lvl("thief")];
  },
  artifacts(c) {
    if (c.v.gvGhost) return c.opt.gg + 1;
    return [3, 4, 5, 5, 6][c.lvl("ghost")];
  },
  fury(c) {
    if (c.v.ghoulSolo) return { easy: 7, medium: 8, hard: 9 }[c.opt.gSolo];
    return Math.min(14, [5, 6, 7, 7, 8][c.lvl("ghoul")] + c.n);
  },
  ghoulSoloCrystals(c) { return { easy: 5, medium: 6, hard: 7 }[c.opt.gSolo]; },
  radiance(c) { return [7, 8, 9, 10, 11][c.lvl("unicorn")]; }
};

/* helpers for building HTML */
VC.list = (items) => "<ul>" + items.filter(Boolean).map((x) => "<li>" + x + "</li>").join("") + "</ul>";
VC.cite = (arr) => {
  const order = [], pages = {};
  arr.filter(Boolean).join(" · ").split("·").map((x) => x.trim()).filter(Boolean).forEach((part) => {
    const m = part.match(/^(.*?)\s+p\.(.*)$/);
    if (!m) { if (!(part in pages)) { order.push(part); pages[part] = null; } return; }
    const doc = m[1].trim();
    if (!(doc in pages)) { order.push(doc); pages[doc] = []; }
    if (pages[doc] === null) return;
    m[2].split(",").map((x) => x.trim().replace(/^p\./, "")).forEach((pg) => { if (pg && pages[doc].indexOf(pg) < 0) pages[doc].push(pg); });
  });
  const covered = (pg, list) => list.some((r) => { const mm = r.match(/^(\d+)[–-](\d+)$/); const n = parseInt(pg, 10); return mm && String(n) === pg && n >= +mm[1] && n <= +mm[2]; });
  return order.map((d) => {
    if (pages[d] === null) return d;
    const list = pages[d].filter((pg) => !covered(pg, pages[d]));
    return d + " " + list.sort((a, b) => parseInt(a, 10) - parseInt(b, 10)).map((pg) => "p." + pg).join(", ");
  }).join(" · ");
};
VC.names = (ids) => {
  const a = ids.map((r) => "the " + VC.role[r].short);
  return a.length <= 1 ? a.join("") : a.slice(0, -1).join(", ") + " and " + a[a.length - 1];
};
VC.target = (c) => (c.has("unicorn") && !c.has("dragon")) ? "the Nightmare Unicorn" : "the Dragon";

/* ---------------------------------------------------------------------------
   VICTORY CONDITIONS — each role's goal for this exact setup
   --------------------------------------------------------------------------- */
VC.goal = function (r, c) {
  const v = c.v, N = VC.num;
  const D = c.has("dragon") || c.has("unicorn");
  const tgt = VC.target(c);
  // Shadow Unicorn solo: the goal becomes killing the Unicorn (Unicorn p.5); the Ghost keeps hers (FAQ p.19)
  const shadowHunter = (v.shadow === "solo" && r !== "ghost") || (v.shadow === "multi" && c.opt.shadowHunter === r);
  const shadowGoal = () => "<b>Kill the Shadow Unicorn</b> (Health 7)" +
    (["knight", "dragon", "thief", "ghoul", "vileghoul"].indexOf(r) >= 0 ? ", then escape the Cave by entering the Entrance tile" + (r === "dragon" ? " (awaken and surface first, as normal)" : "") : "") + ".";
  if (shadowHunter) return shadowGoal();
  const uHunt = v.alongside && c.opt.uHunter === r;
  let g = "";
  switch (r) {
    case "knight": {
      if (D) g = "<b>Kill " + tgt + "</b>: reduce " + (tgt === "the Dragon" ? "his" : "his") + " Health from <b>" + N.dragonTargetHealth(c) + "</b> to 0.";
      else {
        const k = N.knightCrystals(c);
        g = "<b>Smash " + k + " Crystal tokens</b>" + (N.knightSmashStr(c) !== 3 ? " (smashing needs Strength " + N.knightSmashStr(c) + ")" : "") + ", then <b>escape</b> by entering the Entrance tile." +
          (v.kt ? " <i>(Knight vs. Thief: you agree on 5 or 6 before the game.)</i>" : "");
      }
      break;
    }
    case "goblins": {
      if (c.has("knight")) g = "<b>Kill the Knight</b>: reduce her Health from <b>" + N.knightHealth(c) + "</b> to 0.";
      else if (D) g = "<b>Kill " + tgt + "</b>: reduce his Health from <b>" + N.dragonTargetHealth(c) + "</b> to 0.";
      else g = "<b>Smash " + N.goblinCrystals(c) + " Crystal tokens</b>" + (v.gEscape ? ", <b>then escape the Cave</b> (as printed for Goblins vs. Ghoul, Ghoul p.5)" : "") + "." +
        (v.gvGhost ? " <i>(Goblins vs. Ghost: agree on 4 or 5.)</i>" : "");
      break;
    }
    case "vileghoul": {
      if (v.vgSolo) g = "<b>Smash " + N.vileCrystals(c) + " Crystals</b>, then <b>escape</b> by entering the Entrance tile (solo difficulty).";
      else if (c.has("knight")) g = "<b>Kill the Knight</b>: reduce her Health from <b>" + N.knightHealth(c) + "</b> to 0 (a Goblin Ambush kill counts for you).";
      else if (D) g = "<b>Kill " + tgt + "</b>: reduce his Health from <b>" + N.dragonTargetHealth(c) + "</b> to 0.";
      else g = "<b>Smash " + N.vileCrystals(c) + " Crystals</b>, then <b>escape</b> by entering the Entrance tile." +
        (v.vgThief ? " <i>(Vile Ghoul vs. Thief: one more than the Thief's agreed 5 or 6.)</i>" : v.vgCave ? " <i>(Vile Ghoul vs. Cave.)</i>" : "");
      break;
    }
    case "dragon": {
      g = "<b>Wake up</b> (move " + N.wake(c) + " Sloth cubes to Wakefulness" + (c.lvl("dragon") === 4 ? " <i>and</i> use Shriek on three separate turns" : "") + "), <b>surface</b> by ending a turn on a Crystal tile, then <b>escape</b> by entering the Entrance tile." +
        (v.dAmbush ? " <b>Or</b> win if the Knight is killed by a Goblin Ambush." : "");
      if (uHunt) g = "<b>Kill the Nightmare Unicorn</b> (Health 5 → 0) <i>and</i> wake up, surface and escape the Cave as normal.";
      break;
    }
    case "unicorn": {
      g = "<b>Gain " + N.radiance(c) + " Radiance</b> (mark Crystal tiles, collect Treasures, attack at 3 Anger), then <b>escape</b> by entering the Entrance tile during your turn.";
      break;
    }
    case "cave": case "caveghost": {
      const h = N.caveHatred(c);
      g = "<b>Collapse the Cave</b>: place every Cave tile, then remove tiles until <b>" + N.caveCrystals(c) + " Crystal tiles</b>" + (h ? " <i>and all " + h + " Hatred tokens</i>" : "") + " have been removed." +
        (v.cAmbush ? " <b>Or</b> win if the Knight is killed by a Goblin Ambush." : "");
      break;
    }
    case "thief": {
      if (v.kt) g = "<b>Stash " + N.thiefStash(c) + " Treasure tokens</b> (as many as the Knight's Crystal goal), <b>or</b> win if the Knight is killed by a Goblin Ambush.";
      else g = "<b>Stash " + N.thiefStash(c) + " Treasure or Dragon Gem tokens</b> to break your curse" + (c.lvl("thief") >= 3 ? " (your first " + (c.lvl("thief") === 4 ? "2 stashed tokens don't" : "stashed token doesn't") + " go on upgrade spaces)" : "") + "." +
        (v.uThief ? " <b>Or</b> win if you kill the Nightmare Unicorn (Unicorn p.4)." : "") +
        (v.vgThief ? " <i>(Vile Ghoul vs. Thief: agree on 5 or 6.)</i>" : "");
      break;
    }
    case "ghoul": {
      if (v.ghoulSolo) g = "<b>Gain " + N.fury(c) + " Fury or smash " + N.ghoulSoloCrystals(c) + " Crystals</b>, then <b>escape</b> by entering the Entrance tile (solo difficulty).";
      else {
        const f = N.fury(c);
        if (v.ghoulGoal === "kOr") g = "<b>Win if the Knight is killed</b>, or <b>gain " + f + " Fury</b> and then escape the Cave.";
        else if (v.ghoulGoal === "dOr") g = "<b>Win if " + tgt + " is killed</b>, or <b>gain " + f + " Fury</b> and then escape the Cave.";
        else if (v.ghoulGoal === "cOr") g = "<b>Gain " + f + " Fury or smash 6 Crystals</b>, then escape the Cave.";
        else g = "<b>Gain " + f + " Fury</b> (goal = " + ["5", "6", "7", "7", "8"][c.lvl("ghoul")] + " + " + c.n + " players, max 14) by attacking and collecting Treasures, then <b>escape</b> by entering the Entrance tile.";
      }
      break;
    }
    case "ghost": {
      const a = N.artifacts(c);
      g = "<b>Lock " + a + " Artifacts</b> onto Ghost tiles" + (c.mod("focused") ? ", then end a turn on a Ghost tile without a locked Artifact (or lock one more Artifact) — Fully Focused" : "") + ", then <b>escape</b> by entering the Entrance tile." +
        (v.gvGhost ? " <i>(Goblins vs. Ghost: one more Artifact than the Goblins' Crystal goal.)</i>" : "");
      break;
    }
  }
  if (uHunt && r !== "dragon") g = "<b>Kill the Nightmare Unicorn</b> by reducing his Health (5) to 0. <i>(Replaces your normal goal — everyone agreed at setup.)</i>";
  return g;
};

VC.loseLine = function (c) {
  const v = c.v;
  if (v.shadow) return "If the Cave collapses, everyone loses except the Cave [Ghost] and the Shadow Unicorn." + (c.has("knight") || c.has("dragon") ? " The " + (c.has("knight") && c.has("dragon") ? "Knight and Dragon also lose" : c.has("knight") ? "Knight also loses" : "Dragon also loses") + " if " + (c.has("knight") && c.has("dragon") ? "their" : c.has("knight") ? "her" : "his") + " Health drops to 0." : "");
  if (v.solo) return "You lose if the Cave collapses" + (c.has("knight") ? " or if you are killed" : "") +
    (v.ghostMode === "solo" ? ({ easy: "", medium: " — or if 2 Ghost tiles collapse", hard: " — or if any Ghost tile collapses" })[c.opt.hSolo] : "") + ".";
  if (!v.noCave) return "If the Cave collapses, the " + (c.has("caveghost") ? "Cave Ghost" : "Cave") + " wins — everyone else loses.";
  if (v.ghostMode === "2" && c.has("knight")) return "<b>Everyone loses</b> if the Cave collapses (there is no Cave player). The Knight also loses if she is killed (Knight solo variant, Rules p.18).";
  return "<b>Everyone loses</b> if the Cave collapses (there is no Cave player).";
};

/* ---------------------------------------------------------------------------
   END-OF-TURN TILES when there is no Cave [Ghost] player
   --------------------------------------------------------------------------- */
VC.tileRule = function (c) {
  const v = c.v, out = [], src = [];
  if (!v.noCave) return null;
  if (v.aid) {
    out.push("<b>" + (v.aid === "II" ? "Alone in the Dark II" : "Alone in the Dark") + "</b>: at the end of your turn, place (or during the Collapse, remove) tiles as the card directs — <i>instead of</i> the normal placement, not in addition to it.");
    if (v.aid === "I") out.push("Alone in the Dark: draw and place tiles equal to the greatest of — the number of revealed Crystal tiles (including collapsed ones); Knight: your Hero cubes available or placed; Goblins: your largest Tribe's Population; Dragon: your Spirit; Thief: your Movement. Remove that many instead once the Collapse has begun, choosing Crystal tiles first, then Dark, then Lit — on top of the usual exposed-edges order (FAQ p.21).");
    src.push(v.aid === "II" ? (c.has("ghost") ? "Ghost p.5" : c.has("vileghoul") ? "Ghoul p.7" : c.has("ghoul") ? "Ghoul p.5" : "Unicorn p.4") : "Rules p.3, p.18, p.23", "FAQ p.21");
    if (v.ghostMode === "solo") out.push("Ghost solo: place or remove tiles only at the end of your own turn, not after possession turns; then roll Flare for each Artifact on a Dark tile, using that Artifact as the center space for the roll.");
    return { html: VC.list(out), src: VC.cite(src) };
  }
  const uni = c.has("unicorn") || v.shadow;
  const one = (c.mod("crowded") && v.n >= 4) || v.ghoulMode === "4" || v.ghostMode === "4";
  if (uni) {
    out.push("<b>Unicorn rule</b>: before the Collapse, place 1 Dark tile adjacent to any tile only <b>if no Dark tiles were revealed during your turn</b>; during the Collapse, remove 3 tiles regardless." + (v.shadow ? " The Shadow Unicorn never places or removes tiles." : ""));
    src.push(v.shadow ? "Unicorn p.6" : "Unicorn p.4");
  } else if (!one) {
    out.push(c.mod("faq1") && v.n >= 4 ? "At the end of your own turn, <b>place 1 Dark tile</b> from the stack; once the Collapse has begun, <b>remove 1 tile</b> instead (FAQ recommendation for 4+ players, chosen; the standard rule is 3)."
      : "At the end of your own turn, <b>place 1 Dark tile</b> from the stack; once the Collapse has begun, <b>remove 3 tiles</b> instead.");
    src.push("Rules p.2, p.4, p.23");
    if (c.mod("faq1") && v.n >= 4) src.push("FAQ p.21");
  }
  if (one) {
    const who = [];
    if (c.mod("crowded") && v.n >= 4) who.push("Crowded House (Ghost p.7)");
    if (v.ghoulMode === "4") who.push("the Ghoul's 4+ player rule (Ghoul p.4)");
    if (v.ghostMode === "4") who.push("the Ghost's 4+ player rule (Ghost p.5)");
    out.push("<b>1 tile only</b>: each player places <i>or</i> removes only 1 tile at the end of their own turn (instead of placing 1 or removing 3) — " + who.join(", ") + ".");
    src.push(c.mod("crowded") ? "Ghost p.7" : "", v.ghoulMode === "4" ? "Ghoul p.4" : "", v.ghostMode === "4" ? "Ghost p.5" : "");
    if (uni) out.push("<i>Unresolved:</i> the Unicorn book's tile rule and the 1-tile rule both apply to this setup and the books don't say which wins. Agree before you start (the 1-tile rule exists to slow the Collapse in big games).");
  } else if (uni && c.mod("faq1") && v.n >= 4) {
    out.push("<b>FAQ recommendation</b> (chosen): during the Collapse each player removes only <b>1 tile</b> at the end of their turn, not 3 — 3 can end a 4+ player game too quickly.");
    src.push("FAQ p.21");
  }
  out.push("Fill new open edges from the top of the stack yourself, and remove Collapse tiles yourself: first tiles touching only one tile, then those touching two; a revealed Crystal tile that can be removed must go first.");
  if (v.pp) out.push("Past Plunder holder: place its Treasure token <i>after</i> placing your Dark tile at the end of your turn — it may go on that tile (FAQ p.21).");
  if (c.has("ghost")) out.push("The Ghost reveals a Possession card only after the player has placed or collapsed tiles, and she places or collapses tiles only at the end of her own turn, not after possession turns (Ghost p.5).");
  src.push("Rules p.4", "FAQ p.21");
  return { html: VC.list(out), src: VC.cite(src) };
};

/* ---------------------------------------------------------------------------
   SETUP PHASES — c = context (see app.js ctx()); every step has when/t/d/src/exp
   --------------------------------------------------------------------------- */
VC.cardNames = {
  flare: "<b>Flare</b> Variant card", pp: "<b>Past Plunder</b> Variant card", inf: "<b>Goblin Infestation</b> Variant card and the 2 <b>Monster tokens</b>",
  ash: "<b>Ash Dragon</b> Variant card", aid: "<b>Alone in the Dark</b> Variant card", aid2: "<b>Alone in the Dark II</b> Variant card"
};
VC.infLine = function (c) {
  const v = c.v;
  const k = v.inf === "solo" ? c.opt.kSolo : v.inf === "shadow" ? c.opt.kShadow : v.inf;
  return { A: "Normal Goblins (line A)", B: "Tough Goblins (line B)", C: "Monsters (line C)" }[k];
};
/* the variant cards one role receives */
VC.cardsFor = function (r, c, skipShared) {
  const v = c.v, out = [];
  if (v.flare.has(r) && !(skipShared && v.flareMap)) out.push(VC.cardNames.flare + (v.flareMap ? " — placed near the map and shared by " + VC.names(Array.from(v.flare)) : "") +
    ((r === "ghoul" || r === "vileghoul") ? "; you may target your own space with Flare, spending 1 movement point each time" : "") + ".");
  if (v.pp === r) out.push(VC.cardNames.pp + ".");
  if (r === "knight" && v.inf) out.push(VC.cardNames.inf + " — use <b>" + VC.infLine(c) + "</b>.");
  if (r === "dragon" && v.ash === "dragon") out.push(VC.cardNames.ash + " (+1 Armor, max 4; Goblins may attack you).");
  if (v.aid && (v.solo)) out.push(v.aid === "II" ? VC.cardNames.aid2 + " (replaces the Cave Reference card)." : VC.cardNames.aid + " (replaces the Cave Reference card).");
  return out;
};

VC.phases = [
  {
    title: "Roles, Variant & Victory",
    steps: [
      { when: (c) => c.v.valid, exp: (c) => c.ff ? "ghost" : "core",
        t: (c) => "Seat " + (c.n === 1 ? "yourself" : "the " + c.n + " players") + " in turn order",
        d: (c) => {
          const v = c.v;
          const seats = v.players.map((r) => "<li><b>" + VC.role[r].name + "</b>" +
            (r === "unicorn" && v.alongside ? " — takes his turn right after the Dragon" : "") +
            (r === "vileghoul" ? " — in the Goblins' seat" : r === "unicorn" && !v.alongside ? " — in the Dragon's seat" : r === "caveghost" ? " — in the Cave's seat" : "") + "</li>").join("");
          return "<ol class='seats'>" + seats + (v.shadow ? "<li><b>Shadow Unicorn</b> (non-player) — takes his turn after all players</li>" : "") + "</ol>" +
            VC.list([
              "Sit clockwise in this order and play in this order. If you sit out of order, turns still follow the number in the upper-right corner of each player board, lowest first (FAQ).",
              v.n === 5 && !c.ff ? "Five players: play with all of the roles." : "",
              (c.has("ghost") || c.has("caveghost")) ? "The Ghost and Cave Ghost are <b>advanced roles</b>: not for new players; best for someone who knows every other role in play." : "",
              (c.has("ghoul") || c.has("ghost")) && v.n >= 6 ? "More than five players may slow the game significantly (Ghoul p.1 · Ghost p.1)." : "",
              "Mixing roles with <i>Vast: The Mysterious Manor</i> follows that game's rules — see the <a href='../vastmanor-setup/'>Mysterious Manor page</a>."
            ]);
        },
        src: (c) => VC.cite(["Rules p.2", "FAQ p.2", c.has("vileghoul") ? "Ghoul p.6" : "", c.has("ghoul") ? "Ghoul p.2" : "", c.has("unicorn") ? "Unicorn p.2" + (c.v.alongside ? ", p.4" : "") : "",
          c.has("caveghost") ? "Ghost p.6" : "", c.has("ghost") ? "Ghost p.2" : "", c.v.shadow ? "Unicorn p.5" : "", (c.has("ghost") || c.has("caveghost")) ? "Ghost p.1" : ""]) },

      { when: (c) => c.v.valid, exp: "variant",
        t: (c) => "Your role variant" + (c.v.layers.length && c.v.layers.every((l) => l.star) ? " ★" : ""),
        d: (c) => {
          const v = c.v;
          const lay = "<ul class='layers'>" + v.layers.map((l) => "<li>" + (l.star ? "<b>★</b> " : "") + l.name + " <span class='mini-src'>(" + l.src + ")</span></li>").join("") + "</ul>";
          const cards = [];
          if (v.flareMap) cards.push(VC.cardNames.flare + " near the map: " + VC.names(Array.from(v.flare)) + " may each use it.");
          v.players.forEach((r) => VC.cardsFor(r, c, v.flareMap).forEach((x) => cards.push("<b>" + VC.role[r].short + ":</b> " + x)));
          if (v.ash === "map") cards.push(VC.cardNames.ash + " near the map: the Dragon gets +1 Armor (max 4) and the Goblins may use the Attack action against him.");
          if (v.unicornArmor) cards.push("<b>Nightmare Unicorn:</b> instead of the Ash Dragon card, place a Unicorn cube from your supply (not the Radiance track) on the first Armor upgrade space — Armor starts at 2. The Cave cannot remove it.");
          const special = [];
          if (v.hunger === 2) special.push("<b>Dragon:</b> move <b>2 Sloth cubes</b> from Hunger to Wakefulness." + (v.locked ? " The Cave cannot move them back." : ""));
          if (v.hunger === "solo") special.push("<b>Dragon (solo):</b> move <b>" + ({ easy: "all 4", medium: "2", hard: "no" })[c.opt.dSolo] + "</b> Hunger cubes to Wakefulness (" + ({ easy: "Easy", medium: "Medium", hard: "Hard" })[c.opt.dSolo] + ").");
          if (v.hunger === 0 && c.has("dragon") && (v.ghoulMode === "2" || v.ghoulMode === "3" || v.vg || v.alongside)) special.push("<b>Dragon:</b> do <b>not</b> move any Hunger cubes to Wakefulness" +
            (v.alongside ? " (Unicorn vs. Dragon, Unicorn p.4)" : v.vg ? " (Vile Ghoul vs. Dragon, Ghoul p.7)" : v.ghoulMode === "3" ? " (Ghoul p.4)" : " (Dragon vs. Ghoul, Ghoul p.5)") + ".");
          if (v.sq) special.push("<b>Knight:</b> remove the <i>Daring</i> and <i>Eagle-Eyed</i> cards from the Sidequest deck.");
          if (v.thief3 && c.has("knight")) special.push("<b>Knight:</b> do not remove any cards from the Sidequest deck.");
          if (v.thief3 && !v.pp) special.push("Any 2 roles vs. Thief: the Past Plunder card is <b>not used</b>.");
          if (v.ptOpt) special.push("<b>" + (c.has("caveghost") ? "Cave Ghost" : "Cave") + ":</b> the Place Treasure phase is <b>optional</b>. Treasure Room tiles still get Treasure tokens when revealed.");
          if (v.knightSkip) { const others = v.players.filter((r) => r !== "knight").map((r) => VC.role[r].short); special.push("If the Knight is killed, skip her turns for the rest of the game; keep playing until the " + others.slice(0, -1).join(", ") + (others.length > 1 ? " or " : "") + others[others.length - 1] + " wins."); }
          if (v.decks) special.push("<b>Knight:</b> take the Event and Treasure decks (you resolve Events and draw Treasures yourself).");
          if (v.ppNote) special.push(v.ppNote);
          if (v.vg && c.has("knight")) special.push("<b>Vile Ghoul:</b> if the Knight is killed by an Ambush, it counts toward your victory (Ghoul p.7).");
          if (v.alongside) special.push("<b>Unicorn vs. Dragon:</b> if everyone agrees, one player may change their goal to “Kill the Nightmare Unicorn by reducing his Health to 0” — the others' attacks then only force him to Teleport. A Dragon who takes this goal must still awaken, surface and escape.");
          if (v.ghoulMode === "solo" || v.ghoulMode === "2" || v.ghoulMode === "3") { /* Flare/PP shown under cards */ }
          return "<p class='lead'>" + v.n + (v.n === 1 ? " player" : " players") + " — the books' variant for these roles" + (v.layers.some((l) => l.star) ? " (★ = recommended for a first game)" : "") + ":</p>" + lay +
            (v.warn.length ? "<div class='warn'>" + v.warn.map((w) => "<p>" + w + "</p>").join("") + "</div>" : "") +
            (cards.length ? "<h5>Variant cards</h5>" + VC.list(cards) : "<p class='inline-note'>No Variant cards are used.</p>") +
            (special.length ? "<h5>Special setup</h5>" + VC.list(special) : "") +
            (v.extra.indexOf("tip4") >= 0 && !c.mod("faq1") ? "<p class='inline-note'>Tip: with 4+ players and no Cave player, the FAQ recommends removing only 1 tile per turn during the Collapse (option below).</p>" : "");
        },
        src: (c) => VC.cite(c.v.src.concat(["Rules p.17"])) },

      { when: (c) => c.v.valid, exp: "variant",
        t: "Victory conditions",
        d: (c) => {
          const rows = c.v.players.map((r) => "<li><b>" + VC.role[r].short + ":</b> " + VC.goal(r, c) + "</li>").join("");
          return "<ul class='goals'>" + rows + "</ul><p class='lose'>" + VC.loseLine(c) + "</p>" +
            (c.v.shadow === "multi" && !c.opt.shadowHunter ? "<p class='inline-note'>Shadow Unicorn: nobody has chosen to hunt him (optional — pick a hunter in the configurator).</p>" : "") +
            "<p class='inline-note'>Difficulty levels already applied. Change them in the configurator above.</p>";
        },
        src: (c) => VC.cite(["Rules p.2", c.has("knight") ? "Rules p.6" : "", c.has("goblins") ? "Rules p.8" : "", c.has("dragon") ? "Rules p.10" : "", c.has("cave") ? "Rules p.12" : "", c.has("thief") ? "Rules p.14" : "", c.v.n < 5 ? "Rules p.17–18" : "", c.anyDiff ? "Rules p.19" : "", c.has("ghoul") || c.has("vileghoul") ? "Ghoul p.2, p.4–7" : "", c.has("ghost") || c.has("caveghost") ? "Ghost p.2, p.5–7" : "",
          c.has("unicorn") ? "Unicorn p.2, p.4" : "", c.v.shadow ? "Unicorn p.5, p.7" : "", c.v.shadow === "solo" && c.has("ghost") ? "FAQ p.19" : ""]) },

      { when: (c) => c.v.valid && c.anyDiff, exp: "opt",
        t: "Difficulty levels",
        d: (c) => {
          const out = [];
          c.v.players.forEach((r) => {
            const L = c.lvl(r);
            if (L === 2) return;
            const nm = VC.levels[r][L] + " (" + VC.levelWord[L] + ")";
            let t = VC.diffText[r](L, c);
            const hunter = (c.v.shadow === "solo" && r !== "ghost") || (c.v.shadow === "multi" && c.opt.shadowHunter === r);
            if (hunter) {
              const H = "your goal is now to kill the Shadow Unicorn (Unicorn " + (c.v.shadow === "solo" ? "p.5" : "p.7") + ")";
              const dice = L >= 3 ? "; you still use only <b>2 Ghoul dice</b>" : "";
              const tgtD = c.has("dragon") || c.has("unicorn");
              if (r === "dragon") t = H + "; you still need <b>" + VC.num.wake(c) + " Wakefulness</b>" + (L === 4 ? " <i>and</i> Shriek on three separate turns" : "") + " to awaken before you escape.";
              else if (r === "thief") t = H + ", so this level's Treasure count doesn't apply" + (L >= 3 ? "; agree whether its upgrade-space restriction still applies" : "") + ".";
              else if (r === "ghoul") t = H + ", so this level's Fury goal doesn't apply" + dice + ".";
              else if (r === "ghost") t = H + ", so this level's Artifact goal doesn't apply" + (L >= 3 ? "; you still remove the <i>Ghost</i> card from your Possession deck" : "") + ".";
              else if ((r === "knight" && !tgtD) || ((r === "goblins" || r === "vileghoul") && !c.has("knight") && !tgtD)) t = H + ", so this level's Crystal goal doesn't apply" + (r === "vileghoul" ? dice : "") + ".";
              else if (r === "cave" || r === "caveghost") t = t + " (The Collapse count still applies; " + H + ".)";
              else t = t + " (That starting Health still applies, but killing them is no longer your goal — " + H + ".)";
            }
            out.push("<b>" + VC.role[r].short + " — " + nm + ":</b> " + t);
          });
          out.push("Give a <b>Hard</b> or <b>Expert</b> card that raises a target's starting Health to that player, so they can track it on the card's extra spaces (FAQ p.21).");
          return VC.list(out);
        },
        src: (c) => VC.cite(["Rules p.19", "FAQ p.21", c.v.kt && c.has("thief") ? "Rules p.18" : "", c.has("ghost") ? "Ghost p.5" : "", c.has("caveghost") ? "Ghost p.7" : "", c.has("ghoul") ? "Ghoul p.5" : "", c.has("vileghoul") || c.v.vgThief ? "Ghoul p.7" : "", c.has("unicorn") ? "Unicorn p.4" : "", c.v.shadow ? (c.v.shadow === "solo" ? "Unicorn p.5" : "Unicorn p.7") : ""]) }
    ]
  },
  {
    title: "The Cave",
    steps: [
      { when: (c) => c.v.valid, exp: (c) => (c.has("ghost") || c.mod("collapse") || c.caveRemove) ? "opt" : "core",
        t: "Entrance tile and the Cave tile stack",
        d: (c) => {
          const N = VC.num, v = c.v, out = [];
          out.push("Place the <b>Entrance tile</b> in the center of the table.");
          if (c.has("ghost")) out.push("<b>Ghost:</b> return <b>2 Ambush, 2 Event and 2 Treasure Room tiles</b> to the box before setting up the Cave.");
          if (c.caveRemove) out.push("<b>" + VC.role[c.has("caveghost") ? "caveghost" : "cave"].short + " difficulty:</b> remove <b>" + c.caveRemove + " tile" + (c.caveRemove > 1 ? "s" : "") + " of each type</b> — Ambush, Treasure Room, Event, Crystal and Vault" + (c.has("caveghost") ? ", and Ghost tiles at random, returned facedown to the box" : "") + ". Never the Entrance" + (c.has("ghost") ? ", Ghost" : "") + " or Terrain tiles.");
          const cr = c.caveRemove || 0;
          out.push("Set aside the " + (cr ? "remaining <b>" + (9 - cr) + " Crystal tiles</b> and <b>" + (6 - cr) + " Vault tiles</b>" + (c.has("ghost") ? ", and the <b>6 Ghost tiles</b>" : "") :
            "<b>9 Crystal tiles</b>" + (c.has("ghost") ? ", the <b>6 Vault tiles</b> and the <b>6 Ghost tiles</b>" : " and the <b>6 Vault tiles</b>")) +
            (c.has("thief") ? "" : " — <i>no Thief: return the Vault tiles to the box</i>") + (c.has("caveghost") ? " (the Cave Ghost keeps the " + (6 - cr) + " Ghost tiles by her; they are never shuffled in)" : "") + ".");
          if (c.mod("collapse")) out.push("<b>Collapse Variant:</b> randomly remove some of the remaining Cave tiles before adding Crystal tiles — <b>2 to 4</b> is recommended.");
          out.push("Shuffle the other tiles. Place <b>4</b>, Dark side up, adjacent to the Entrance tile — take them from the stack <i>before</i> adding Crystal or Vault tiles. They needn't show different Goblin symbols.");
          const per = cr ? [] : ["3 Crystal tiles"];
          if (c.has("thief") && !cr) per.push("2 Vault tiles");
          if (c.has("ghost")) per.push("2 Ghost tiles");
          out.push("Divide the remaining tiles into <b>3 piles</b>, as even as possible; " +
            (per.length ? "shuffle " + per.join(" and ") + " into <b>each</b> pile" : "") +
            (cr ? (per.length ? ", and " : "") + "shuffle the <b>" + (9 - cr) + " Crystal tiles</b>" + (c.has("thief") ? " and <b>" + (6 - cr) + " Vault tiles</b>" : "") + " as evenly as you can into the 3 piles <i>(the books don't say how to split them)</i>" : "") +
            (c.has("ghost") ? ", reshuffling until no pile shows a Ghost tile on top" : "") + "; then stack the piles in any order.");
          if (!c.v.solo || c.v.shadow) out.push("Place the <b>Cave Reference card</b> where everyone can reach it, “<b>The Cave Grows…</b>” side up.");
          if (c.v.aid) out.push("Solo: the " + (c.v.aid === "II" ? "<b>Alone in the Dark II</b>" : "<b>Alone in the Dark</b>") + " Variant card replaces the Cave Reference card.");
          if (c.has("ghost")) out.push("<b>Ghost:</b> place the <b>Blocking the Ghost</b> Reference card where everyone can see it.");
          if (c.mod("crowded") && v.n >= 4) out.push("<b>Crowded House:</b> place the Crowded House Variant card where everyone can see it.");
          return VC.list(out);
        },
        src: (c) => VC.cite(["Rules p.2", "FAQ p.2–3", c.has("ghost") ? "Ghost p.2" : "", c.has("caveghost") ? "Ghost p.6–7" : "", c.caveRemove ? (c.has("caveghost") ? "Ghost p.7" : "Rules p.19") : "",
          c.caveRemove ? "FAQ p.21" : "", c.mod("collapse") ? "Rules p.19" : "", c.v.aid ? (c.v.aid === "II" ? (c.has("ghost") ? "Ghost p.5" : c.has("vileghoul") ? "Ghoul p.7" : c.has("ghoul") ? "Ghoul p.5" : "Unicorn p.4") : "Rules p.18") : "", c.mod("crowded") && c.v.n >= 4 ? "Ghost p.7" : ""]) },

      { when: (c) => c.v.valid && c.v.noCave, exp: "core",
        t: "No Cave player: who places the tiles",
        d: (c) => {
          const tr = VC.tileRule(c);
          return VC.list([
            "Even without a Cave player, the Cave can collapse — and then " + (c.v.solo ? "you lose" : "everyone loses") + ". Read the " + (c.v.aid ? (c.v.aid === "II" ? "Alone in the Dark II" : "Alone in the Dark") + " card" : "Cave Reference card") + ".",
            c.has("knight") ? "You still use the Cave's <b>Event deck</b> and <b>Treasure deck</b>: shuffle both. The player who triggers one draws from it." : "No Knight: leave the Treasure cards, Event cards and Event tokens in the box.",
            "Keep the Crystal" + (c.has("knight") ? ", Event" : "") + " and Treasure tokens within reach — revealed tiles still get them. Only " + (c.has("thief") ? "12" : "10") + " Treasure tokens are available " + (c.has("thief") ? "with" : "without") + " the Thief (FAQ p.17)."
          ]) + "<h5>End of each turn</h5>" + tr.html;
        },
        src: (c) => VC.cite(["Rules p.2", "Rules p.12", VC.tileRule(c).src]) },

      { when: (c) => c.v.valid && c.mod("terrain"), exp: "opt",
        t: "Terrain Variant: set the Terrain tiles aside",
        d: (c) => VC.list([
          "Everyone agrees to play with Terrain before the game starts.",
          "Set the <b>8 Terrain tiles</b> aside: Canyon, Lake, Magma, Mushroom Forest, 3 Pits and River.",
          "During play, Terrain is placed the <b>first time each round</b> an Event tile is revealed — by " + (c.v.noCave ? "the player who revealed it (no Cave player)" : "the " + (c.has("caveghost") ? "Cave Ghost" : "Cave")) + ", as close as possible to the piece that revealed it. Never once the Collapse has begun."
        ]),
        src: "Rules p.16" }
    ]
  },
  {
    title: "Each Role's Setup",
    steps: [
      { when: (c) => c.v.valid && c.has("knight"), exp: "core",
        t: "The Knight",
        d: (c) => {
          const N = VC.num, cards = VC.cardsFor("knight", c);
          return VC.list([
            "Set your <b>Health to " + N.knightHealth(c) + "</b>" + (N.knightHealth(c) > 7 ? " (track the extra Health on the Difficulty card)" : "") + " and your <b>Grit to 0</b> with the two red markers.",
            "Put the <b>Knight piece</b> on the Entrance tile. Place the <b>3 Bomb tokens</b> near your board.",
            (c.v.sq ? "Remove the <i>Daring</i> and <i>Eagle-Eyed</i> cards, then shuffle" : "Shuffle") + " the <b>Sidequest deck</b> and place it facedown; draw <b>3 Sidequest cards</b>.",
            "Place <b>2 Hero cubes</b> near your board (the two shown on the “0” space of the Grit track). Put the other 5 on the white Grit spaces <b>5, 11, 18, 26 and 35</b>.",
            c.v.decks ? "Take the <b>Event</b> and <b>Treasure</b> decks." : ""
          ].concat(cards));
        },
        src: (c) => VC.cite(["Rules p.6", (VC.cardsFor("knight", c).length || c.v.sq || c.v.decks) ? "Rules p.17–18" : "", c.v.vg ? "Ghoul p.7" : "", c.has("goblins") && c.lvl("goblins") !== 2 ? "Rules p.19" : "", VC.num.knightHealth(c) > 7 ? "FAQ p.21" : "",
          (c.v.ghoulMode === "2" || c.v.ghoulMode === "3") ? "Ghoul p.4" : "", (c.v.ghostMode === "2" || c.v.ghostMode === "3") ? "Ghost p.5" : "", c.v.shadow === "solo" ? "Unicorn p.5" : ""]) },

      { when: (c) => c.v.valid && c.has("goblins"), exp: "core",
        t: "The Goblins",
        d: (c) => VC.list([
          "Place the <b>3 Goblin Tribe pieces</b> (Fangs, Bones, Eye) on your player board — they start hidden.",
          "Place the <b>Goblin discs</b> (green) and <b>Strength discs</b> (red) near your board; put <b>1 Strength disc on the Fangs Tribe</b> space.",
          "Shuffle the <b>War</b>, <b>Monster</b> and <b>Secrets</b> decks separately and place them near your board.",
          "Set your <b>Rage to 1</b>.",
          c.has("ghost") && (c.v.ghostMode === "3" || c.v.ghostMode === "4") ? "Ghost Artifact: yours starts off the map and goes to the <b>first Tribe to reveal</b>; whenever it leaves the map, give it to the next Tribe to reveal (one Artifact for all three Tribes)." : ""
        ].concat(VC.cardsFor("goblins", c))),
        src: (c) => { const k = VC.cardsFor("goblins", c).length > 0; return VC.cite(["Rules p.8", k && c.v.shadow !== "solo" ? "Rules p.17–18" : "", k && c.has("ghoul") ? "Ghoul p.4–5" : "", k && c.has("unicorn") ? "Unicorn p.4" : "", k && c.v.shadow === "solo" ? "Unicorn p.5" : "", k && c.has("ghost") ? "Ghost p.5" : "", c.has("ghost") && (c.v.ghostMode === "3" || c.v.ghostMode === "4") ? "Ghost p.2, p.4" : ""]); } },

      { when: (c) => c.v.valid && c.has("vileghoul"), exp: "ghoul",
        t: "The Vile Ghoul",
        d: (c) => VC.list([
          "Use the <b>Vile Ghoul player board</b>.",
          "Set the <b>Ghoul piece</b>, the <b>3 Ghoul dice</b> and the <b>Ghoul discs</b> near your board. Shuffle the <b>Terror cards</b> into the Terror deck.",
          "No Fury cube: the Vile Ghoul doesn't track Fury.",
          "At the start of your first turn, place the Ghoul piece on any unoccupied <b>Dark tile</b>; if there is none, a Dark tile is placed (by the Cave player, if present) and you go there.",
          c.lvl("vileghoul") >= 3 ? "Stalker/Hunter: you use only <b>2 Ghoul dice</b>." : ""
        ].concat(VC.cardsFor("vileghoul", c))),
        src: (c) => VC.cite(["Ghoul p.6–7"]) },

      { when: (c) => c.v.valid && c.has("dragon"), exp: "core",
        t: "The Dragon",
        d: (c) => {
          const v = c.v, N = VC.num;
          const h = N.dragonTargetHealth(c);
          return VC.list([
            "Place the <b>14 Sloth cubes</b> in the Sloth boxes on your board (Greed 4, Hunger 4, Pride 4 + 1 + 1). Place the <b>Eaten Goblins marker</b> on “0”.",
            "Set your <b>Health to " + h + "</b>" + (h > 5 ? " (track the extra Health on the Difficulty card)" : "") + ".",
            "Shuffle the <b>18 Power cards</b> and draw <b>3</b>.",
            "Place the <b>Awakened Dragon piece</b> near your board. You begin play <b>underground</b>.",
            "At the start of your first turn, place the <b>Sleeping Dragon</b> on the Knight's tile" + (c.has("knight") ? "" : " — <i>no Knight: on the Entrance tile</i>") + "."
          ].concat(VC.cardsFor("dragon", c)));
        },
        src: (c) => { const r = c.has("knight") ? "knight" : c.has("vileghoul") ? "vileghoul" : c.has("goblins") ? "goblins" : null; return VC.cite(["Rules p.3, p.10", r && c.lvl(r) !== 2 ? (r === "vileghoul" ? "Ghoul p.7" : "Rules p.19") : "", VC.cardsFor("dragon", c).length ? "Rules p.17–18" : ""]); } },

      { when: (c) => c.v.valid && c.has("unicorn"), exp: "unicorn",
        t: "The Nightmare Unicorn",
        d: (c) => { const uh = c.v.alongside ? 5 : (c.has("knight") || c.has("goblins") || c.has("vileghoul") ? VC.num.dragonTargetHealth(c) : 5); return VC.list([
          "Use the <b>Nightmare Unicorn board</b>. With the 2 Tracking cubes set your <b>Health to " + uh + "</b> and your <b>Anger to 1</b>." +
            (uh > 5 ? " Your board's Health track holds only 5: the player whose difficulty level set this gives you their Difficulty card — track the extra Health on its spaces (FAQ p.21)." : ""),
          "Place Unicorn cubes on the <b>12 spaces of the Radiance track</b>; keep the rest in a supply by your board.",
          "Shuffle the <b>Unicorn deck</b> and draw <b>4 cards</b>.",
          c.v.unicornArmor ? "Ash Dragon variant: take a Unicorn cube from your supply and place it on the <b>first Armor upgrade space</b> — Armor starts at 2. The Cave cannot remove it." : "",
          "At the start of your first turn, place the Unicorn on a <b>Lit tile adjacent to the Knight, facing directly away</b> from her" + (c.has("knight") ? "" : " — <i>no Knight: on the Entrance tile facing any cardinal direction, away from other pieces if possible</i>") +
            ". If no valid Lit tile exists and the Entrance is occupied, use an unoccupied Dark tile adjacent to the Entrance and reveal it.",
          c.mod("simple") ? "<b>Simple Teleport Variant:</b> point each card's arrow (^) directly away from your seat, not along the Unicorn's facing." : "",
          c.v.uSolo ? "Solo: take the <b>Alone in the Dark II</b> Variant card." : ""
        ]); },
        src: (c) => VC.cite(["Unicorn p.2", c.v.unicornArmor || c.v.alongside || c.mod("simple") || c.v.uSolo ? "Unicorn p.4" : "", (() => { if (c.v.alongside) return ""; const r = c.has("knight") ? "knight" : c.has("vileghoul") ? "vileghoul" : c.has("goblins") ? "goblins" : ""; if (!r || c.lvl(r) === 2) return ""; return (r === "vileghoul" ? "Ghoul p.7" : "Rules p.19") + " · FAQ p.18" + (VC.num.dragonTargetHealth(c) > 5 ? ", p.21" : ""); })()]) },

      { when: (c) => c.v.valid && c.has("cave"), exp: "core",
        t: "The Cave",
        d: (c) => {
          const h = VC.num.caveHatred(c);
          return VC.list([
            c.has("knight") ? "" : "No Knight: leave the <b>Treasure cards</b>, <b>Event cards</b> and <b>Event tokens</b> in the box.",
            "Put the <b>36 Omen tokens</b> in the draw bag.",
            "Place <b>" + (c.has("thief") ? "12" : "10") + " Treasure tokens</b> on your player board" + (c.has("thief") ? " (12 with a Thief)" : "") + ".",
            "Place the <b>Crystal</b>, " + (c.has("knight") ? "<b>Event</b> " : "") + "and <b>Rockslide</b> tokens near your board.",
            c.has("knight") ? "Shuffle the <b>Treasure deck</b> and the <b>Event deck</b> and place them near your board." : "",
            "Draw a hand of <b>3 Cave tiles</b> from the stack.",
            h ? "Place <b>" + h + " Hatred tokens</b> near your board (any spare pieces, such as the duplicate Treasure or Crystal tokens)." : ""
          ]);
        },
        src: (c) => VC.cite(["Rules p.12", VC.num.caveHatred(c) ? "Rules p.19 · FAQ p.21" : ""]) },

      { when: (c) => c.v.valid && c.has("caveghost"), exp: "ghost",
        t: "The Cave Ghost",
        d: (c) => {
          const h = VC.num.caveHatred(c);
          return VC.list([
            "Place the <b>Ghost tiles</b> near you — do <i>not</i> shuffle them into the tile stack.",
            "Take the <b>Possession cards</b> matching the roles in play (" + c.v.players.filter((r) => r !== "caveghost").map((r) => "Possessed " + VC.role[r].short).join(", ") + "), but <b>not</b> the Ghost card. Return the rest to the box.",
            "Leave the <b>Artifact tokens</b> in the box.",
            "Then follow <b>all of the Cave's setup</b>: Omen tokens in the bag; " + (c.has("thief") ? "12" : "10") + " Treasure tokens on your board; Crystal, " + (c.has("knight") ? "Event " : "") + "and Rockslide tokens nearby; " + (c.has("knight") ? "shuffle the Treasure and Event decks; " : "no Knight: Treasure cards, Event cards and Event tokens stay in the box; ") + "draw a hand of <b>3 Cave tiles</b>.",
            h ? "Place <b>" + h + " Hatred tokens</b> near your board." : "",
            "At the start of your first turn, place the <b>Ghost piece</b> on any unoccupied Dark tile; if there is none, place a Dark tile from your hand and put her there."
          ]);
        },
        src: (c) => VC.cite(["Ghost p.6", "Rules p.12", VC.num.caveHatred(c) || c.caveRemove ? "Ghost p.7" : ""]) },

      { when: (c) => c.v.valid && c.has("thief"), exp: "core",
        t: "The Thief",
        d: (c) => VC.list([
          "Place the <b>Action die</b>, the <b>5 Action cubes</b> and the <b>3 Stat tokens</b> (2, 3, 4 — light-gray sides showing) near your board.",
          "Place the <b>Loot Drop token</b> on the “3” space of your Loot Drop Level chart.",
          "Place the <b>6 Vault tokens</b> near your board.",
          "Place the <b>Thief piece</b> on the Entrance tile just before your first turn — not at the start of the game.",
          c.lvl("thief") === 3 ? "Prowler: your first stashed Treasure token cannot go on an upgrade space." : c.lvl("thief") === 4 ? "Invader: your first 2 stashed Treasure tokens cannot go on upgrade spaces." : ""
        ].concat(VC.cardsFor("thief", c))),
        src: (c) => { const cards = VC.cardsFor("thief", c).length; return VC.cite(["Rules p.3, p.14", cards && c.v.shadow !== "solo" ? "Rules p.17–18" : "", "FAQ p.17", c.lvl("thief") >= 3 ? "Rules p.19" : "", cards && c.has("ghoul") ? "Ghoul p.4–5" : "", cards && c.has("vileghoul") ? "Ghoul p.7" : "", c.v.shadow === "solo" ? "Unicorn p.5" : ""]); } },

      { when: (c) => c.v.valid && c.has("ghoul"), exp: "ghoul",
        t: "The Ghoul",
        d: (c) => VC.list([
          "Place the <b>Ghoul piece</b>, the <b>3 Ghoul dice</b> and the <b>9 Ghoul discs</b> near your board.",
          "Shuffle the <b>13 Terror cards</b> to form the Terror deck.",
          (c.v.shadow === "solo" || (c.v.shadow === "multi" && c.opt.shadowHunter === "ghoul") || (c.v.alongside && c.opt.uHunter === "ghoul")) ?
            "Place the <b>Fury cube</b> on “0” of the Fury track (Fury still earns Terror cards; your goal this game is in Victory conditions)." :
            "Place the <b>Fury cube</b> on “0” of the Fury track. Your goal: <b>" + VC.num.fury(c) + " Fury</b>" + (c.v.ghoulSolo ? " (solo difficulty)" : "") + ".",
          c.lvl("ghoul") >= 3 ? "Stalker/Hunter: you roll only <b>2 Ghoul dice</b> (draw a Terror card on a total of 4 or less)." : "",
          "At the start of your first turn, place the Ghoul on any unoccupied <b>Dark tile</b>; if there is none, a Dark tile is placed (by the Cave player, if present) and you go there.",
          c.mod("skitter") ? "<b>Skitter Variant</b> (agreed for the whole game): when you skitter, <i>you</i> name the Dark symbol and your opponent in the attack places you." : ""
        ].concat(VC.cardsFor("ghoul", c))),
        src: (c) => VC.cite(["Ghoul p.2", c.v.ghoulMode ? "Ghoul p.4–5" : "", c.mod("skitter") ? "Ghoul p.4" : "",
          c.v.shadow === "solo" ? "Ghoul p.3 · Unicorn p.5" : c.v.shadow === "multi" && c.opt.shadowHunter === "ghoul" ? "Ghoul p.3 · Unicorn p.7" : c.v.alongside && c.opt.uHunter === "ghoul" ? "Ghoul p.3 · Unicorn p.4" : ""]) },

      { when: (c) => c.v.valid && c.has("vileghoul") && c.mod("skitter"), exp: "opt",
        t: "Skitter Variant (Vile Ghoul)",
        d: () => VC.list(["Agreed for the whole game: when the Vile Ghoul skitters, <i>it</i> names a Dark symbol (Fangs, Bones or Eye) matching an unoccupied Dark tile, and its opponent in the attack places the piece. With no unoccupied Dark tiles, the opponent places it on any unoccupied space surrounding the Entrance tile.",
          "Attacks that don't involve another player use the standard skitter rules."]),
        src: "Ghoul p.4, p.6" },

      { when: (c) => c.v.valid && c.has("ghost"), exp: "ghost",
        t: "The Ghost",
        d: (c) => {
          const v = c.v, small = v.ghostMode === "2" || v.ghostMode === "solo";
          const deck = small
            ? "Form the <b>Possession deck</b> for " + (v.ghostMode === "solo" ? "solo" : "two-player") + " play: " + (v.ghostMode === "2" ? "remove the card of your opponent's role; " : "") +
              "for each turn-order position (1–7) " + (v.ghostMode === "2" ? "except your opponent's " : "") + "that has several cards (Goblins / Vile Ghoul; Dragon / Unicorn), randomly remove cards until one remains" +
              (v.ghostMode === "2" ? "; if your opponent shares a position, randomly remove the other roles' cards there until only your opponent's and one other remain" : "") +
              (v.ghostMode === "solo" ? "; then remove the Ghost card, so positions 1–6 each have one card" : "") + "."
            : "Form the <b>Possession deck</b> from the cards matching the roles in play: " + v.players.map((r) => r === "ghost" ? "Ghost" : "Possessed " + VC.role[r].short).join(", ") + ". Return the others to the box.";
          return VC.list([
            "(The Cave tiles were already adjusted: 2 Ambush, 2 Event and 2 Treasure Room tiles out, 2 Ghost tiles in each pile.)",
            "With the <b>Focus cube</b>, set your Focus to <b>0</b> (Movement 3, Influence 1).",
            deck,
            v.ghostMode === "solo" && !v.shadow && c.opt.hSolo !== "easy" ? "<b>" + ({ medium: "Medium", hard: "Hard" })[c.opt.hSolo] + " solo:</b> shuffle the Possession deck, draw 3 cards to use and remove the rest from the game." : "",
            c.lvl("ghost") >= 3 ? "<b>" + VC.levels.ghost[c.lvl("ghost")] + ":</b> remove the <i>Ghost</i> card from your Possession deck." : "",
            "If any Possession card in your deck refers to <b>Flare</b>, take the Flare Variant card (if other players also get Flare, place it near the map; each of you may use it).",
            small ? "Place <b>all 6 Artifact tokens</b> on the Entrance tile." : "Give <b>1 Artifact token</b> to each other player" + (c.has("cave") ? " except the Cave" : "") + " (" + v.players.filter((r) => r !== "ghost" && r !== "cave").map((r) => VC.role[r].short).join(", ") + "); place the remaining Artifacts on the Entrance tile.",
            "At the start of your first turn, place the <b>Ghost piece</b> on any unoccupied Dark tile; if there is none, place a Dark tile (provided by the Cave, if present) and put the Ghost piece there. Skip the Resolve Possession Card phase on that first turn.",
            v.ghostMode === "2" ? "Two players: neither of you takes the Alone in the Dark or Alone in the Dark II card." : ""
          ].concat(VC.cardsFor("ghost", c)));
        },
        src: (c) => VC.cite(["Ghost p.2", c.v.ghostMode === "2" || c.v.ghostMode === "solo" ? "Ghost p.4–5" : "Ghost p.5", c.lvl("ghost") >= 3 ? "Ghost p.5" : ""]) },

      { when: (c) => c.v.valid && !!c.v.shadow, exp: "unicorn",
        t: "The Shadow Unicorn (non-player)",
        d: (c) => {
          const v = c.v, hunter = v.shadow === "solo" ? v.players[0] : c.opt.shadowHunter;
          return VC.list([
            "Place the <b>Shadow Unicorn player board</b> near " + (v.shadow === "solo" ? "yours" : "the map") + ". With the Tracking cubes, set his <b>Health to 7</b> and the <b>Revealed Crystals track to 0–2</b>.",
            "Draw <b>3 Unicorn cards</b> and place them by his board to form his <b>Spirit pile</b>.",
            v.shadow === "solo" ? (v.players[0] === "knight" ? "<b>Knight:</b> take the Goblin Infestation card and Monster tokens at any level — " + VC.infLine(c) + " chosen (Monsters is recommended; first-timers may prefer Normal or Tough Goblins)." :
              ["goblins", "thief", "ghoul", "vileghoul"].indexOf(v.players[0]) >= 0 ? "<b>" + VC.role[v.players[0]].short + ":</b> take the <b>Flare</b> Variant card." : "") : "",
            v.shadow === "solo" ? "Set up your role normally, but do <b>not</b> take the Alone in the Dark Variant card." + (v.players[0] === "ghost" ? " The Ghost keeps her normal victory goal (FAQ p.19)." : "") : "",
            "He takes his turn <b>after all players</b>. On his first turn, " + (hunter ? "the " + VC.role[hunter].short + (v.shadow === "solo" ? "" : " (his hunter)") : "the player whose goal is killing him") + " places him on any <b>Lit tile adjacent to " + (hunter ? "that player's" : "their") + " piece</b>, facing directly away; if there is none, on an unoccupied adjacent Dark tile, revealed. He does not Rampage on his first turn.",
            "<b>Rampage difficulty — " + ({ easy: "Easy", medium: "Medium", hard: "Hard" })[c.opt.shadowLvl] + ":</b> " + ({ easy: "only an angry action provokes a Rampage", medium: "a Move or an angry action provokes a Rampage (not a non-angry Turn)", hard: "any action provokes a Rampage" })[c.opt.shadowLvl] + ".",
            v.shadow === "multi" ? (hunter ? "<b>Hunter:</b> the " + VC.role[hunter].short + "'s goal becomes killing the Shadow Unicorn; only the hunter's attacks reduce his Health (others' attacks just make him Teleport)." : "No hunter chosen: if everyone agrees, one player may change their goal to killing him.") : "",
            "Make room: his movement and Teleports can expand the map quickly in unpredictable directions."
          ]);
        },
        src: (c) => VC.cite(["Unicorn p.5–7", c.v.shadow === "solo" && c.has("ghost") ? "FAQ p.19" : ""]) }
    ]
  },
  {
    title: "Before the First Turn",
    steps: [
      { when: (c) => c.v.valid, exp: "core",
        t: "First-turn reminders",
        d: (c) => {
          const v = c.v, out = [];
          v.players.forEach((r) => {
            const t = {
              knight: "<b>Knight</b> goes first: pick up your 2 Hero cubes. All stats start at 1 each turn.",
              goblins: "<b>Goblins</b>: your Rage is 1, so you draw 1 War card; Tribes enter the map with the Reveal action.",
              vileghoul: "<b>Vile Ghoul</b>: no dice in your supply yet — roll all three in Prepare Board; place your piece on an unoccupied Dark tile (none: place a Dark tile and start there).",
              dragon: "<b>Dragon</b>: place the Sleeping Dragon on " + (c.has("knight") ? "the Knight's tile" : "the Entrance tile") + " at the start of your turn.",
              unicorn: "<b>Nightmare Unicorn</b>: at the start of your turn, place your piece " + (c.has("knight") ? "on a Lit tile adjacent to the Knight, facing directly away from her" : "on the Entrance tile, facing any cardinal direction (away from other pieces if possible)") + "; if no valid Lit tile exists and the Entrance is occupied, use an unoccupied Dark tile adjacent to the Entrance and reveal it.",
              cave: "<b>Cave</b>: Collect Omens first (based on Treasure + Crystal tokens on the map), then Shape the Cave — " + (c.has("ghost") ? "a Ghost tile in your hand goes down before any other tile, Crystal tiles included (even on other players' turns), then Crystal tiles" : "Crystal tiles first") + " — then Place Treasure" + (v.ptOpt ? " (optional this game)" : "") + ".",
              caveghost: "<b>Cave Ghost</b>: place the Ghost piece on an unoccupied Dark tile at the start of your turn.",
              thief: "<b>Thief</b>: place your piece on the Entrance tile, then assign your Stat tokens.",
              ghoul: "<b>Ghoul</b>: place your piece on an unoccupied Dark tile; no discs to clear on this first Roll and Set Statistics.",
              ghost: "<b>Ghost</b>: place your piece on an unoccupied Dark tile; skip Resolve Possession Card on this first turn."
            }[r];
            out.push(t);
          });
          if (v.shadow) out.push("<b>Shadow Unicorn</b>: placed by " + (v.shadow === "solo" || c.opt.shadowHunter ? "his hunter" : "the player whose goal is killing him") + "; no Rampage on his first turn.");
          if (!v.noCave) out.push("Every time a revealed tile has an open edge, the " + (c.has("caveghost") ? "Cave Ghost fills it from her" : "Cave fills it from its") + " hand of 3 tiles, drawing back up after each tile.");
          return VC.list(out);
        },
        src: (c) => VC.cite(["Rules p.6, p.8, p.10, p.12, p.14", "FAQ p.17", c.has("unicorn") || c.v.shadow ? "Unicorn " + [c.has("unicorn") ? "p.2" : "", c.v.shadow ? "p.5" : "", c.v.shadow === "multi" ? "p.7" : ""].filter(Boolean).join(", ") : "", c.has("ghoul") || c.has("vileghoul") ? "Ghoul p.2, p.6" : "", c.has("ghost") ? "Ghost p.2, p.4" : c.has("caveghost") ? "Ghost p.6" : ""]) }
    ]
  }
];

/* difficulty level effects, as worded by the books (Rules p.19 · Ghost p.5, p.7 · Ghoul p.5, p.7 · Unicorn p.4) */
VC.diffText = {
  knight: (L, c) => (c.has("dragon") || c.has("unicorn"))
    ? "the " + (VC.target(c) === "the Dragon" ? "Dragon" : "Nightmare Unicorn") + " starts at <b>" + [3, 4, 5, 6, 7][L] + " Health</b>" + (L >= 3 ? " (track it with the Variant card's spaces)" : "") + "."
    : "you must smash <b>" + [4, 4, 5, 6, 6][L] + " Crystals</b>" + (L === 0 ? ", and smashing needs only <b>2 Strength</b>" : L === 4 ? ", and smashing needs <b>4 Strength</b>" : "") + "." + (c.v.kt ? " <i>(Knight vs. Thief fixes the goal at the agreed 5 or 6; agree whether the card's number replaces it.)</i>" : ""),
  goblins: (L, c) => c.has("knight") ? "the Knight starts at <b>" + [5, 6, 7, 8, 9][L] + " Health</b>" + (L >= 3 ? " (use tokens to track the extra Health)" : "") + "."
    : (c.has("dragon") || c.has("unicorn")) ? "no Knight, so the Knight's level table is used: the " + (VC.target(c) === "the Dragon" ? "Dragon" : "Unicorn") + " starts at <b>" + [3, 4, 5, 6, 7][L] + " Health</b>."
    : "no Knight or Dragon: you must smash <b>" + [4, 4, 5, 6, 6][L] + " Crystals</b>." + (c.v.gvGhost ? " <i>(Goblins vs. Ghost fixes 4 or 5 by agreement.)</i>" : ""),
  dragon: (L) => "you need <b>" + [7, 9, 11, 13, 13][L] + " Wakefulness</b>" + (L === 4 ? " <i>and</i> must have used your <b>Shriek</b> power on three separate turns" : "") + ".",
  cave: (L) => ["remove <b>2 tiles of each type</b> (Ambush, Treasure, Event, Crystal, Vault) during setup; the Cave collapses when <b>3 Crystal tiles</b> have been removed.",
    "remove <b>1 tile of each type</b> during setup; the Cave collapses when <b>4 Crystal tiles</b> have been removed.", "",
    "place <b>4 Hatred tokens</b> near your board. When you use Hatred while any remain, you may ignore its effect to remove a token instead. You win when 5 Crystal tiles <i>and</i> all Hatred tokens are gone — leftover tokens don't stop the Collapse from starting (FAQ p.21).",
    "place <b>8 Hatred tokens</b> near your board. When you use Hatred while any remain, you may ignore its effect to remove a token instead. You win when 5 Crystal tiles <i>and</i> all Hatred tokens are gone — leftover tokens don't stop the Collapse from starting (FAQ p.21)."][L],
  caveghost: (L) => ["remove <b>2 tiles of each type, including Ghost tiles</b> (at random, facedown to the box) during setup; the Cave collapses at <b>3 Crystal tiles</b>.",
    "remove <b>1 tile of each type, including a Ghost tile</b> (at random, facedown to the box) during setup; the Cave collapses at <b>4 Crystal tiles</b>.", "",
    "place <b>4 Hatred tokens</b>; using Hatred while any remain, you may remove a token instead of its effect. You win when 5 Crystal tiles and all Hatred tokens are gone — leftover tokens don't stop the Collapse from starting (FAQ p.21).",
    "place <b>8 Hatred tokens</b>; using Hatred while any remain, you may remove a token instead of its effect. You win when 5 Crystal tiles and all Hatred tokens are gone — leftover tokens don't stop the Collapse from starting (FAQ p.21)."][L],
  thief: (L, c) => {
    const up = L === 3 ? "; your first stashed token cannot go on an upgrade space" : L === 4 ? "; your first 2 stashed tokens cannot go on upgrade spaces" : "";
    const card = [4, 5, 6, 7, 8][L];
    if (c.v.kt) return "Knight vs. Thief ties your goal to the Crystals the Knight must smash (here <b>" + VC.num.thiefStash(c) + " Treasure tokens</b>, Rules p.18); this card's " + card + " applies only if your group agrees it replaces that" + up + ".";
    if (c.v.vgThief) return "Vile Ghoul vs. Thief fixes your goal at the agreed 5 or 6 (here <b>" + VC.num.thiefStash(c) + " Treasure tokens</b>, Ghoul p.7); this card's " + card + " applies only if your group agrees it replaces that" + up + ".";
    return ["stash <b>4 Treasure tokens</b>.", "stash <b>5 Treasure tokens</b>.", "", "stash <b>7 Treasure tokens</b>; your first stashed token cannot go on an upgrade space.", "stash <b>8 Treasure tokens</b>; your first 2 stashed tokens cannot go on upgrade spaces."][L];
  },
  ghost: (L, c) => c.v.gvGhost ? "Goblins vs. Ghost sets your goal at one more Artifact than the Goblins' agreed 4 or 5 (here <b>" + VC.num.artifacts(c) + " Artifacts</b>, Ghost p.5); this card's " + [3, 4, 5, 5, 6][L] + " applies only if your group agrees it replaces that" + (L >= 3 ? "; remove the <i>Ghost</i> card from your Possession deck" : "") + "." + (L === 4 ? " (Fully Focused can't be combined with Wraith.)" : "")
    : ["lock <b>3 Artifacts</b>.", "lock <b>4 Artifacts</b>.", "", "lock <b>5 Artifacts</b>, and remove the <i>Ghost</i> card from your Possession deck.", "lock <b>6 Artifacts</b>, and remove the <i>Ghost</i> card from your Possession deck. (Fully Focused can't be combined with Wraith.)"][L],
  ghoul: (L, c) => c.v.ghoulSolo ? "your solo difficulty sets the goal (here <b>" + VC.num.fury(c) + " Fury or " + VC.num.ghoulSoloCrystals(c) + " Crystals</b>, Ghoul p.5)" + (L >= 3 ? "; you use only <b>2 Ghoul dice</b>" : "") + "."
    : "Fury goal = <b>" + [5, 6, 7, 7, 8][L] + " + the number of players</b> (here " + VC.num.fury(c) + ", never above 14)" + (L >= 3 ? "; you use only <b>2 Ghoul dice</b>" : "") + ".",
  vileghoul: (L, c) => {
    const dice = L >= 3 ? "; you use only <b>2 Ghoul dice</b>" : "";
    const card = [3, 4, 5, 5, 6][L];
    if (c.v.vgSolo) return "your solo difficulty sets the goal (here smash <b>" + VC.num.vileCrystals(c) + " Crystals</b>, Ghoul p.7)" + dice + ".";
    if (c.v.vgThief) return "Vile Ghoul vs. Thief sets your goal at one more Crystal than the Thief's agreed 5 or 6 (here <b>" + VC.num.vileCrystals(c) + " Crystals</b>, Ghoul p.7); this card's " + card + " applies only if your group agrees it replaces that" + dice + ".";
    if (c.v.vgCave) return "Vile Ghoul vs. Cave sets your goal at <b>6 Crystals</b> (Ghoul p.7); this card's " + card + " applies only if your group agrees it replaces that" + dice + ".";
    const tg = VC.target(c) === "the Dragon" ? "the Dragon" : "the Nightmare Unicorn";
    return "the Knight starts at <b>" + [5, 6, 7, 7, 8][L] + "</b> Health / " + tg + " at <b>" + card + "</b> / or smash <b>" + card + "</b> Crystals (whichever is your goal)" + dice + ".";
  },
  unicorn: (L) => "you must gain <b>" + [7, 8, 9, 10, 11][L] + " Radiance</b>."
};
