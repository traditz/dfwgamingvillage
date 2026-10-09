/* =============================================================================
   Vast: The Mysterious Manor — Setup & Reference Utility · data (configuration + setup)
   Sources (the only ones used):
     LR  = the official living rules, https://vast.mm.livingrules.io/ (offline snapshot 2026-10-08).
           The site has no page numbers, so it is cited by section path: "LR › The Spider › Webs".
     Setup Sheets = VastTMM_Setup_Sheets.pdf (no printed page numbers: cited by role sheet + PDF page).
     HH  = Vast: The Haunted Hallways rulebook (printed pp.2–4; p.1 unnumbered, first page).
   Precedence: LR is the current official core rulebook; where a printed setup sheet disagrees,
   LR wins (and the page says so). Haunted Hallways governs its two roles.
   Reference sections live in data-ref.js, the teaching script in data-teach.js.
   ============================================================================= */
var VM = {};

/* ---- citations ------------------------------------------------------------ */
VM.LR = function (p) { return "LR › " + p; };
VM.SS = {
  paladin:   "Setup Sheet › Paladin (PDF p.1)",
  skeletons: "Setup Sheet › Skeletons (PDF p.3)",
  spider:    "Setup Sheet › Spider (PDF p.5)",
  manor:     "Setup Sheet › Manor (PDF p.7)",
  warlock:   "Setup Sheet › Warlock (PDF p.9)"
};
VM.SSB = {
  paladin:   "Setup Sheet › Paladin, back (PDF p.2)",
  skeletons: "Setup Sheet › Skeletons, back (PDF p.4)",
  spider:    "Setup Sheet › Spider, back (PDF p.6)",
  manor:     "Setup Sheet › Manor, back (PDF p.8)",
  warlock:   "Setup Sheet › Warlock, back (PDF p.10)"
};
VM.HH = function (p) { return "Haunted Hallways p." + p; };
VM.cites = function (arr) { return arr.filter(Boolean).join(" · "); };
VM.CAVES_URL = "/player-aids/vastcaverns-setup/";
VM.CAVES_LINK = "<a href=\"/player-aids/vastcaverns-setup/\">our Crystal Caverns page</a>";

/* step/section tags */
VM.expMeta = {
  core:   { name: "Mysterious Manor",  cls: "tag-core" },
  mix:    { name: "Role mix",          cls: "tag-mix" },
  var:    { name: "Difficulty",        cls: "tag-var" },
  hh:     { name: "Haunted Hallways",  cls: "tag-hh" },
  solo:   { name: "Solo",              cls: "tag-solo" },
  travel: { name: "Traveling",         cls: "tag-travel" }
};

/* ---- roles ---------------------------------------------------------------- */
/* The five Manor roles are also the five "seats" (colours): a Haunted Hallways role or a role visiting
   from The Crystal Caverns replaces the Manor role of the same colour (HH p.1; LR › Traveling Between Vast Games). */
VM.SEATS = ["paladin", "skeletons", "spider", "manor", "warlock"];   // turn order (LR › How to Play)
VM.roles = {
  paladin:   { name: "Paladin",        the: "the Paladin",        seat: "paladin" },
  skeletons: { name: "Skeletons",      the: "the Skeletons",      seat: "skeletons" },
  spider:    { name: "Spider",         the: "the Spider",         seat: "spider" },
  manor:     { name: "Manor",          the: "the Manor",          seat: "manor" },
  warlock:   { name: "Warlock",        the: "the Warlock",        seat: "warlock" },
  aknight:   { name: "Armored Knight", the: "the Armored Knight", seat: "paladin", hh: true },
  shadow:    { name: "Shadow Paladin", the: "the Shadow Paladin", seat: "spider",  hh: true },
  knight:    { name: "Knight",         the: "the Knight",         seat: "paladin", visitor: true },
  goblins:   { name: "Goblins",        the: "the Goblins",        seat: "skeletons", visitor: true },
  dragon:    { name: "Dragon",         the: "the Dragon",         seat: "spider",  visitor: true },
  thief:     { name: "Thief",          the: "the Thief",          seat: "warlock", visitor: true }
};
VM.roleName = function (id) { return (VM.roles[id] || { name: id }).name; };

/* ---- modes ---------------------------------------------------------------- */
VM.modes = [
  { id: "multi", name: "The Mysterious Manor", blurb: "2–5 players, each with a different role — the full game or any official role mix." },
  { id: "solo",  name: "The Paladin's Journey", blurb: "Solo: the Paladin against automated Skeletons, rising Terror and the Manor's poltergeists." },
  { id: "cave",  name: "Take a role to the Cave", blurb: "A Manor role travels to Vast: The Crystal Caverns (Traveling Between Vast Games)." }
];

/* ---- player counts and role mixes (LR › Player Counts and Role Mixes) ---- */
/* Each change: { t: html, role: role it adjusts (for the setup step) } */
var GEAR5 = "Shield (Slashy), Kukri (Stabby), Pauldrons (Screamy), Poison (Stabby) and Iron Spike (Smashy — an expansion Skeleton)";
VM.mixes = [
  { id: "m5",   p: 5, roles: ["paladin", "skeletons", "spider", "manor", "warlock"], star: false, name: "All five roles",
    sec: "Player Counts and Role Mixes", changes: [] },
  { id: "m4nw", p: 4, roles: ["paladin", "skeletons", "spider", "manor"], star: true, name: "No Warlock",
    sec: "Player Counts and Role Mixes › Four Players › No Warlock*", changes: [] },
  { id: "m4nm", p: 4, roles: ["paladin", "skeletons", "spider", "warlock"], star: true, name: "No Manor",
    sec: "Player Counts and Role Mixes › Four Players › No Manor*",
    changes: [{ role: "warlock", t: "The Warlock begins with the <b>Expand</b> spell." }] },
  { id: "m3pks", p: 3, roles: ["paladin", "skeletons", "spider"], star: true, name: "Paladin / Skeletons / Spider",
    sec: "Player Counts and Role Mixes › Three Players › Paladin/Skeletons/Spider*",
    changes: [{ role: "spider", t: "The Spider begins with the Warlock’s <b>Expand</b> spell." }] },
  { id: "m3psm", p: 3, roles: ["paladin", "spider", "manor"], star: true, name: "Paladin / Spider / Manor",
    sec: "Player Counts and Role Mixes › Three Players › Paladin/Spider/Manor*",
    changes: [{ role: "paladin", t: "Return these Paladin cards to the box: <b>Armor</b> (treasure), <b>Disdain</b> (favor) and <b>Radiant Lamps</b> (favor)." },
              { role: "spider", t: "The Spider begins with <b>2 Terror</b> (but still starts with 3 cards)." },
              { role: "manor", t: "The Manor begins with <b>3 Seals</b>." }] },
  { id: "m3psw", p: 3, roles: ["paladin", "spider", "warlock"], star: true, name: "Paladin / Spider / Warlock",
    sec: "Player Counts and Role Mixes › Three Players › Paladin/Spider/Warlock*",
    changes: [{ role: "paladin", t: "Return these Paladin cards to the box: <b>Armor</b> (treasure), <b>Disdain</b> (favor) and <b>Radiant Lamps</b> (favor)." },
              { role: "spider", t: "The Spider begins with <b>2 Terror</b> (but will still start with 3 cards)." },
              { role: "warlock", t: "The Warlock begins with the <b>Syphon Specialize</b> spell and the <b>Expand</b> spell." }] },
  { id: "m3ksw", p: 3, roles: ["skeletons", "spider", "warlock"], star: false, name: "Skeletons / Spider / Warlock",
    sec: "Player Counts and Role Mixes › Three Players › Skeletons/Spider/Warlock",
    changes: [{ role: "skeletons", t: "The Skeletons now win if they <b>kill the Spider</b>." },
              { role: "spider", t: "The Spider begins with <b>2 Terror</b> (but will still start with 3 cards)." },
              { role: "skeletons", t: "<b>Spiderlings now force the Skeletons to attack.</b>" },
              { role: "warlock", t: "The Warlock begins with the <b>Expand</b> and <b>Enclose</b> spells." },
              { role: "skeletons", t: "Return these Skeleton gear cards to the box: " + GEAR5 + "." }] },
  { id: "m3ksm", p: 3, roles: ["skeletons", "spider", "manor"], star: false, name: "Skeletons / Spider / Manor",
    sec: "Player Counts and Role Mixes › Three Players › Skeletons/Spider/Manor",
    changes: [{ role: "skeletons", t: "The Skeletons now win if they <b>kill the Spider</b>." },
              { role: "spider", t: "The Spider begins with <b>2 Terror</b> (but still starts with 3 cards)." },
              { role: "manor", t: "The Manor begins with <b>3 Seals</b>." },
              { role: "skeletons", t: "<b>Spiderlings now force the Skeletons to attack.</b>" },
              { role: "skeletons", t: "Return these Skeleton gear cards to the box: " + GEAR5 + "." }] },
  { id: "m2ps", p: 2, roles: ["paladin", "spider"], star: true, name: "Paladin / Spider",
    sec: "Player Counts and Role Mixes › Two Players › Paladin/Spider*",
    changes: [{ role: "paladin", t: "Return these Paladin cards to the box: <b>Armor</b> (treasure) and <b>Radiant Lamps</b> (favor)." },
              { role: "spider", t: "The Spider begins with <b>2 Terror</b> and the Warlock’s <b>Expand</b> spell." }] },
  { id: "m2ks", p: 2, roles: ["skeletons", "spider"], star: true, name: "Skeletons / Spider",
    sec: "Player Counts and Role Mixes › Two Players › Skeletons/Spider*",
    changes: [{ role: "skeletons", t: "The Skeletons now win if they <b>kill the Spider</b>." },
              { role: "spider", t: "The Spider begins with <b>2 Terror</b> and the Warlock’s <b>Expand</b> spell." },
              { role: "skeletons", t: "<b>Spiderlings now force the Skeletons to attack.</b>" }] }
];
VM.mixById = function (id) { return VM.mixes.find(function (m) { return m.id === id; }) || VM.mixes[0]; };
VM.skelHuntSpider = function (c) { return c.mode === "multi" && ["m3ksw", "m3ksm", "m2ks"].indexOf(c.mix) >= 0; };
VM.removesPaladinCards = function (c) { return c.mode === "multi" && ["m3psm", "m3psw", "m2ps"].indexOf(c.mix) >= 0; };
VM.removesGear = function (c) { return c.mode === "multi" && ["m3ksw", "m3ksm"].indexOf(c.mix) >= 0; };
VM.spiderTwoTerror = function (c) { return c.mode === "multi" && ["m3psm", "m3psw", "m3ksw", "m3ksm", "m2ps", "m2ks"].indexOf(c.mix) >= 0; };
VM.manorThreeSeals = function (c) { return c.mode === "multi" && ["m3psm", "m3ksm"].indexOf(c.mix) >= 0; };
VM.warlockStartSpells = function (c) {
  if (c.mode !== "multi") return "";
  return { m4nm: "the <b>Expand</b> spell", m3psw: "the <b>Syphon Specialize</b> spell and the <b>Expand</b> spell", m3ksw: "the <b>Expand</b> and <b>Enclose</b> spells" }[c.mix] || "";
};
VM.spiderExpand = function (c) { return c.mode === "multi" && ["m3pks", "m2ps", "m2ks"].indexOf(c.mix) >= 0; };

/* ---- difficulty variants (LR › Difficulty Variants) ----------------------- */
VM.variantRoles = ["paladin", "skeletons", "spider", "manor", "warlock"];
VM.variants = {
  paladin: [
    { id: "squire",    name: "Squire",    lvl: "very easy", t: "The Spider gives you 2 Spiderlings at the start of the game." },
    { id: "protector", name: "Protector", lvl: "easy",      t: "The Spider gives you 1 Spiderling at the start of the game." },
    { id: "justicar",  name: "Justicar",  lvl: "hard",      t: "You cannot use Shrines." },
    { id: "lord",      name: "Lord",      lvl: "very hard", t: "You begin the game with only 2 hero cubes. Return 1 hero cube to the box." }],
  skeletons: [
    { id: "miscreant", name: "Miscreant", lvl: "very easy", t: "The Paladin starts at 5 Health." },
    { id: "boss",      name: "Boss",      lvl: "easy",      t: "The Paladin starts at 6 Health." },
    { id: "master",    name: "Master",    lvl: "hard",      t: "The Paladin starts with the Armor treasure." },
    { id: "warlord",   name: "Warlord",   lvl: "very hard", t: "The Paladin starts with the Armor and the Halo treasures." }],
  spider: [
    { id: "hatchling", name: "Hatchling", lvl: "very easy", t: "You need 8 Terror to escape." },
    { id: "consumer",  name: "Consumer",  lvl: "easy",      t: "You need 10 Terror to escape." },
    { id: "matriarch", name: "Matriarch", lvl: "hard",      t: "You cannot use the Legs spell." },
    { id: "demonqueen", name: "Demon Queen", lvl: "very hard", t: "You must play the entire game as the Giant Spider." }],
  manor: [
    { id: "shack",  name: "Shack",  lvl: "very easy", t: "You need 11 Seals to win." },
    { id: "villa",  name: "Villa",  lvl: "easy",      t: "You need 13 Seals to win." },
    { id: "keep",   name: "Keep",   lvl: "hard",      t: "Return all rituals worth 3 Seals to the box." },
    { id: "castle", name: "Castle", lvl: "very hard", t: "Return all rituals worth 1 Seal to the box." }],
  warlock: [
    { id: "charlatan",  name: "Charlatan",   lvl: "very easy", t: "You must only dominate 4 pieces to win." },
    { id: "controller", name: "Controller",  lvl: "easy",      t: "Before your first turn, draw 3 spells." },
    { id: "beguiler",   name: "Beguiler",    lvl: "hard",      t: "Before your first turn, advance your Spells track twice, but do not draw cards for this." },
    { id: "mindbender", name: "Mind Bender", lvl: "very hard", t: "You begin the game with only 2 magic cubes. Return 1 magic cube to the box." }]
};
VM.variantSec = function (role, v) {
  var head = { paladin: "Paladin", skeletons: "Skeletons", spider: "Spider", manor: "Manor", warlock: "Warlock" }[role];
  var lv = v.lvl;
  if (v.id === "shack") lv = "Very Easy";            // the site's own capitalisation
  return "Difficulty Variants › " + head + " › " + v.name + " (" + lv + ")";
};
VM.variant = function (c, role) {
  var id = c.diff(role);
  return id ? (VM.variants[role] || []).find(function (v) { return v.id === id; }) || null : null;
};

/* ---- visitors (Crystal Caverns roles in the Manor) and travelers (Manor roles in the Cave) ---- */
VM.visitors = [
  { id: "knight",  replaces: "paladin",   sec: "Traveling Between Vast Games › Visiting the Manor › Knight in the Manor" },
  { id: "goblins", replaces: "skeletons", sec: "Traveling Between Vast Games › Visiting the Manor › Goblins in the Manor" },
  { id: "dragon",  replaces: "spider",    sec: "Traveling Between Vast Games › Visiting the Manor › Dragon in the Manor" },
  { id: "thief",   replaces: "warlock",   sec: "Traveling Between Vast Games › Visiting the Manor › Thief in the Manor" }
];
VM.travelers = [
  { id: "paladin",   cave: "Knight",  sec: "Traveling Between Vast Games › Visiting the Cave › Paladin in the Cave" },
  { id: "skeletons", cave: "Goblins", sec: "" },
  { id: "spider",    cave: "Dragon",  sec: "Traveling Between Vast Games › Visiting the Cave › Spider in the Cave" },
  { id: "warlock",   cave: "Thief",   sec: "Traveling Between Vast Games › Visiting the Cave › Warlock in the Cave" },
  { id: "aknight",   cave: "Knight",  sec: "", hh: true },
  { id: "shadow",    cave: "Dragon",  sec: "", hh: true }
];
VM.visitorById = function (id) { return VM.visitors.find(function (v) { return v.id === id; }) || null; };
VM.travelerById = function (id) { return VM.travelers.find(function (v) { return v.id === id; }) || null; };

/* ---- solo (LR › The Paladin's Journey (Solo)) ----------------------------- */
VM.soloLevels = {
  easy:   { name: "Easy",   skels: 4, terror: 12, polts: 5 },
  normal: { name: "Normal", skels: 5, terror: 12, polts: 6 },
  hard:   { name: "Hard",   skels: 6, terror: 10, polts: 7 }
};
VM.campaignRanks = [            // LR › The Paladin's Journey (Solo) › Campaign Play
  { fl: 3, st: 0, te: 0 }, { fl: 2, st: 1, te: 1 }, { fl: 1, st: 2, te: 2 }, { fl: 0, st: 3, te: 3 }
];

/* =============================================================================
   CONFIGURATION STATE → context
   state = { mode, mix, hh, hhOpts:Set, vis, trav, diff:{role:id}, solo:{level, campaign, ranks:{fl,st,te}} }
   ============================================================================= */
VM.defaultState = function () {
  return { mode: "multi", mix: "m5", hh: false, hhOpts: new Set(), vis: "", trav: "paladin",
           diff: { paladin: "", skeletons: "", spider: "", manor: "", warlock: "" },
           solo: { level: "normal", campaign: false, ranks: { fl: 0, st: 0, te: 0 } } };
};

/* Which configurator choices are available, with the reason when not (shown as a tooltip). */
VM.avail = {
  hhOpt: function (s, id) {
    if (!s.hh) return "Turn on Haunted Hallways first";
    var mix = VM.mixById(s.mix);
    if (id === "aknight") {
      if (s.mode !== "multi") return s.mode === "cave" ? "Choose the Armored Knight as the traveling role instead" : "The solo mode is played with the Paladin";
      if (mix.roles.indexOf("paladin") < 0) return "This role mix has no Paladin to replace";
      if (s.vis === "knight") return "The visiting Knight already replaces the Paladin";
    }
    if (id === "shadow") {
      if (s.mode !== "multi") return s.mode === "cave" ? "Choose the Shadow Paladin as the traveling role instead" : "The solo mode has no Spider player";
      if (s.vis === "dragon") return "The visiting Dragon already replaces the Spider";
    }
    if (id === "hhskel") {
      if (s.mode === "multi" && mix.roles.indexOf("skeletons") < 0) return "This role mix has no Skeletons";
      if (s.mode === "multi" && s.vis === "goblins") return "The visiting Goblins replace the Skeletons";
      if (s.mode === "cave" && s.trav !== "skeletons") return "Only when the Skeletons travel to the Cave";
    }
    return "";
  },
  visitor: function (s, id) {
    var v = VM.visitorById(id), mix = VM.mixById(s.mix);
    if (mix.roles.indexOf(v.replaces) < 0) return "This role mix has no " + VM.roleName(v.replaces) + " to replace";
    return "";
  },
  traveler: function (s, id) {
    var t = VM.travelerById(id);
    if (t && t.hh && !s.hh) return "Needs Haunted Hallways";
    return "";
  },
  soloLevel: function (s, id) { return id === "hard" && !s.hh ? "Hard needs a 6th Skeleton from Haunted Hallways" : ""; }
};

VM.normalize = function (s) {
  if (!VM.modes.some(function (m) { return m.id === s.mode; })) s.mode = "multi";
  s.mix = VM.mixById(s.mix).id;
  if (!s.hh) s.hhOpts.clear();
  if (s.vis && (!VM.visitorById(s.vis) || VM.avail.visitor(s, s.vis))) s.vis = "";
  if (s.mode !== "multi") s.vis = "";
  // a visitor wins its seat over a Haunted Hallways replacement (the visitor is chosen afterwards in the UI flow)
  ["aknight", "shadow", "hhskel", "hhmini"].forEach(function (id) { if (s.hhOpts.has(id) && VM.avail.hhOpt(s, id)) s.hhOpts.delete(id); });
  if (!VM.travelerById(s.trav) || VM.avail.traveler(s, s.trav)) s.trav = "paladin";
  if (s.mode === "cave" && s.hhOpts.has("hhskel") && s.trav !== "skeletons") s.hhOpts.delete("hhskel");
  if (VM.avail.soloLevel(s, s.solo.level)) s.solo.level = "normal";
  if (!VM.soloLevels[s.solo.level]) s.solo.level = "normal";
  // variants only for base roles actually in play (multi only)
  var c = VM.makeCtx(s);
  VM.variantRoles.forEach(function (r) {
    if (!s.diff[r]) return;
    if (s.mode !== "multi" || !c.has(r) || !VM.variants[r].some(function (v) { return v.id === s.diff[r]; })) s.diff[r] = "";
  });
  return s;
};

VM.makeCtx = function (s) {
  var mix = VM.mixById(s.mix);
  var seats = s.mode === "multi" ? mix.roles.slice() : [];
  function occupant(seat) {
    if (seats.indexOf(seat) < 0) return null;
    var v = VM.visitorById(s.vis);
    if (v && v.replaces === seat) return v.id;
    if (seat === "paladin" && s.hhOpts.has("aknight")) return "aknight";
    if (seat === "spider" && s.hhOpts.has("shadow")) return "shadow";
    return seat;
  }
  var inPlay = [];
  if (s.mode === "multi") seats.forEach(function (st) { inPlay.push(occupant(st)); });
  else if (s.mode === "solo") inPlay = ["paladin"];
  else inPlay = [s.trav];
  var c = {
    mode: s.mode,
    p: s.mode === "multi" ? mix.p : (s.mode === "solo" ? 1 : 0),
    mix: s.mode === "multi" ? mix.id : "",
    mixObj: s.mode === "multi" ? mix : null,
    vis: s.mode === "multi" ? (s.vis || "") : "",
    trav: s.mode === "cave" ? s.trav : "",
    roles: inPlay,                                         // roles at the table, in turn order
    seat: function (st) { return seats.indexOf(st) >= 0; },
    occupant: occupant,
    has: function (id) {
      if (id === "hh") return !!s.hh;
      if (id === "hhskel" || id === "hhmini") return s.hhOpts.has(id);
      if (id === "map") return s.mode !== "cave";
      if (id === "solo") return s.mode === "solo";
      if (id === "cave") return s.mode === "cave";
      if (id === "visit") return s.mode === "multi" && !!s.vis;
      if (id === "travel") return s.mode === "cave" || (s.mode === "multi" && !!s.vis);
      return inPlay.indexOf(id) >= 0;
    },
    diff: function (r) { return (s.mode === "multi" && s.diff[r]) || ""; },
    mod: function (id) {
      if (id === "campaign") return s.mode === "solo" && !!s.solo.campaign;
      for (var r in s.diff) if (s.mode === "multi" && s.diff[r] === id) return true;
      return false;
    },
    solo: { level: s.solo.level, lv: VM.soloLevels[s.solo.level] || VM.soloLevels.normal, campaign: !!s.solo.campaign,
            ranks: { fl: s.solo.ranks.fl, st: s.solo.ranks.st, te: s.solo.ranks.te } }
  };
  return c;
};

/* small helpers used by data files */
VM.v = function (c, role, id) { return c.diff(role) === id; };
VM.li = function (arr) { return "<ul>" + arr.filter(Boolean).map(function (x) { return "<li>" + x + "</li>"; }).join("") + "</ul>"; };
VM.ol = function (arr) { return "<ol>" + arr.filter(Boolean).map(function (x) { return "<li>" + x + "</li>"; }).join("") + "</ol>"; };
VM.varTag = function (role, id) {
  var v = (VM.variants[role] || []).find(function (x) { return x.id === id; });
  return v ? " <i>(" + v.name + " variant)</i>" : "";
};
VM.mixTag = " <i>(role mix)</i>";
/* the role that "the Paladin" / "the Spider" means at this table (HH p.1 and LR find-and-replace) */
VM.seatName = function (c, seat) {
  if (c.mode === "cave") {          // in the Cave the other seats hold the Caverns roles of the same colour
    var t = VM.travelerById(c.trav);
    if (t && VM.roles[c.trav].seat === seat) return VM.roleName(c.trav);
    return { paladin: "Knight", skeletons: "Goblins", spider: "Dragon", warlock: "Thief", manor: "Manor" }[seat];
  }
  var o = c.occupant(seat);
  return o ? VM.roleName(o) : VM.roleName(seat);
};

/* =============================================================================
   ROLE SETUP LISTS (Setup Sheets, with LR mix/variant/solo changes applied)
   ============================================================================= */
VM.setupList = {
  paladin: function (c) {
    var solo = c.mode === "solo", rk = solo && c.solo.campaign ? VM.campaignRanks[c.solo.ranks.fl] : null;
    var health = VM.v(c, "skeletons", "miscreant") ? "<b>“5”</b> space of your Health track" + VM.varTag("skeletons", "miscreant")
      : VM.v(c, "skeletons", "boss") ? "<b>“6”</b> space of your Health track" + VM.varTag("skeletons", "boss")
      : "“7” space of your Health track";
    var cubes = VM.v(c, "paladin", "lord")
      ? "Collect the <b>7 hero cubes</b>. Place only <b>2</b> in the Unassigned Hero Cubes box on your board and return <b>1</b> hero cube to the box" + VM.varTag("paladin", "lord") + "."
      : "Collect the <b>7 hero cubes</b>. Place <b>3</b> in the Unassigned Hero Cubes box on your board.";
    var rm = VM.removesPaladinCards(c);
    var treas = "Shuffle the <b>7 treasure cards</b> and place the deck near the Manor board.";
    if (rm) treas = "Return the <b>Armor</b> treasure to the box" + VM.mixTag + ", then shuffle the other treasure cards and place the deck near the Manor board.";
    else if (VM.v(c, "skeletons", "warlord")) treas = "Take the <b>Armor</b> and <b>Halo</b> treasures: the Paladin starts with them" + VM.varTag("skeletons", "warlord") + ". Shuffle the other treasure cards and place the deck near the Manor board.";
    else if (VM.v(c, "skeletons", "master")) treas = "Take the <b>Armor</b> treasure: the Paladin starts with it" + VM.varTag("skeletons", "master") + ". Shuffle the other treasure cards and place the deck near the Manor board.";
    var favFace = solo ? "Find the <b>Illuminate</b>, <b>Vigor</b> and <b>Disdain</b> favor cards and place them face up near you (solo: you start with Disdain as well)."
      : "Find the <b>Illuminate</b> and <b>Vigor</b> favor cards and place them face up near you.";
    var favDeck = solo ? "Shuffle the remaining favor cards into a deck."
      : c.mode === "multi" && (c.mix === "m3psm" || c.mix === "m3psw") ? "Return the <b>Disdain</b> and <b>Radiant Lamps</b> favor cards to the box" + VM.mixTag + ", then shuffle the remaining favor cards into a deck."
      : c.mode === "multi" && c.mix === "m2ps" ? "Return the <b>Radiant Lamps</b> favor card to the box" + VM.mixTag + ", then shuffle the remaining favor cards into a deck."
      : "Shuffle the remaining <b>7 favor cards</b> into a deck.";
    var items = [
      "Place the <b>Paladin board</b> in front of you.",
      "Place the <b>Paladin figure</b> on the <b>Entrance tile</b>.",
      "Place the <b>health cube</b> on the " + health + ".",
      "Set your <b>Grit dial</b> to 0.",
      "Collect the <b>8 light tokens</b>, the <b>5 fury tokens</b> and the <b>pillar of light</b> figure." +
        (rk ? " <b>Campaign:</b> start with <b>" + rk.fl + " Fury and " + rk.fl + " Light</b> (Fury &amp; Light rank " + c.solo.ranks.fl + ")." : ""),
      cubes, treas, favFace, favDeck
    ];
    var extra = [];
    ["squire", "protector"].forEach(function (id) {
      if (!VM.v(c, "paladin", id)) return;
      var n = id === "squire" ? "2 Spiderlings" : "1 Spiderling";
      extra.push(c.has("spider") ? "The Spider gives you <b>" + n + "</b> at the start of the game" + VM.varTag("paladin", id) + "."
        : "“The Spider gives you " + n + "”" + VM.varTag("paladin", id) + " — with the " + VM.seatName(c, "spider") + " in the Spider’s seat there are no Spiderlings to give; the sources don’t cover this.");
    });
    if (VM.v(c, "paladin", "justicar")) extra.push("You cannot use Shrines this game" + VM.varTag("paladin", "justicar") + ".");
    return VM.ol(items) + (extra.length ? VM.li(extra) : "");
  },
  skeletons: function (c) {
    var gear = VM.removesGear(c)
      ? "Return these gear cards to the box" + VM.mixTag + ": " + GEAR5 + ". Shuffle the rest into a deck."
      : "Shuffle the <b>15 gear cards</b> into a deck.";
    var cards = "Shuffle the <b>5 Skeleton cards</b> and place them facedown below the 5 March Order spaces on your board. Flip the <b>2 leftmost</b> Skeletons face up.";
    var items = [
      "Place the <b>Skeletons board</b> in front of you.",
      "Set your <b>Stability dial</b> to 2.",
      "Collect the <b>2 cackling skulls tokens</b> and the <b>4 pit markers</b>.",
      gear, cards,
      "Roll the <b>spawn die</b> and place the Skeleton figure that is 1st in March Order on the Spawn whose number matches the roll. Do this again for the Skeleton that is 2nd in March Order.",
      "Place the other <b>Skeleton figures</b> nearby."
    ];
    var extra = [];
    if (c.has("hhskel")) extra.push("<b>Haunted Hallways Skeletons:</b> any of the 4 new Skeletons can replace Skeletons from The Mysterious Manor one-for-one, in any combination; each comes with its own gear cards (the booklet gives no more detail — gear cards name their Skeleton).");
    if (VM.skelHuntSpider(c)) extra.push("This mix: you win if you <b>kill the " + VM.seatName(c, "spider") + "</b>, and <b>Spiderlings force the Skeletons to attack</b>" + VM.mixTag + ".");
    var sv = VM.variant(c, "skeletons");
    if (sv) extra.push("Your <b>" + sv.name + "</b> variant (" + sv.lvl + "): “" + sv.t + "” " +
      (c.has("paladin") ? "— applied in the Paladin’s setup." : c.has("aknight") ? (["master", "warlord"].indexOf(sv.id) >= 0 ? "— the Armored Knight has no treasure cards; the sources don’t cover this (see her setup)." : "— read as the Armored Knight (see her setup).") : c.has("knight") ? "— under Find and Replace it names the Knight; read it literally (Dead Cards and Abilities)." : "— this mix has no Paladin, so it has no effect as written."));
    return VM.ol(items) + (extra.length ? VM.li(extra) : "");
  },
  spider: function (c) {
    var terror = VM.spiderTwoTerror(c) ? "Set the <b>Terror dial</b> to <b>2</b>" + VM.mixTag + " — you still draw only 3 cards." : "Set the <b>Terror dial</b> to 0 Terror.";
    var items = [
      "Collect the <b>3 form boards</b>. Place the <b>Giant Spider</b> board in front of you. <i>(You must stay in Giant Spider form on your first turn.)</i>",
      "Shuffle the <b>12 power cards</b> into a deck, and draw <b>3</b> power cards.",
      "Collect the <b>15 blood tokens</b> and <b>10 web tokens</b>.",
      terror,
      "Collect the <b>Giant Spider</b>, <b>Sorcerer</b>, <b>5 Spiderling</b> and <b>3 Egg</b> figures. Place the Giant Spider figure on the <b>central Pit</b> on the map."
    ];
    var extra = [];
    if (VM.spiderExpand(c)) extra.push("You begin with the Warlock’s <b>Expand</b> spell" + VM.mixTag + ".");
    if (VM.v(c, "paladin", "squire")) extra.push("Give the " + VM.seatName(c, "paladin") + " <b>2 Spiderlings</b>" + VM.varTag("paladin", "squire") + ".");
    if (VM.v(c, "paladin", "protector")) extra.push("Give the " + VM.seatName(c, "paladin") + " <b>1 Spiderling</b>" + VM.varTag("paladin", "protector") + ".");
    if (VM.v(c, "spider", "hatchling")) extra.push("You need only <b>8 Terror</b> to escape" + VM.varTag("spider", "hatchling") + ".");
    if (VM.v(c, "spider", "consumer")) extra.push("You need only <b>10 Terror</b> to escape" + VM.varTag("spider", "consumer") + ".");
    if (VM.v(c, "spider", "matriarch")) extra.push("You cannot use the <b>Legs</b> spell" + VM.varTag("spider", "matriarch") + ".");
    if (VM.v(c, "spider", "demonqueen")) extra.push("You must play the <b>entire game as the Giant Spider</b>" + VM.varTag("spider", "demonqueen") + ".");
    return VM.ol(items) + (extra.length ? VM.li(extra) : "");
  },
  manor: function (c) {
    var seals = VM.manorThreeSeals(c) ? "Place the <b>seals cube</b> on the <b>“3”</b> space of your Seals track — the Manor begins with 3 Seals" + VM.mixTag + "."
      : "Place the <b>seals cube</b> on the “0” space of your Seals track.";
    var rit = VM.v(c, "manor", "keep") ? "Return all rituals worth <b>3 Seals</b> to the box" + VM.varTag("manor", "keep") + ". Shuffle the other ritual cards into a deck, and draw <b>3</b>."
      : VM.v(c, "manor", "castle") ? "Return all rituals worth <b>1 Seal</b> to the box" + VM.varTag("manor", "castle") + ". Shuffle the other ritual cards into a deck, and draw <b>3</b>."
      : "Shuffle the <b>13 ritual cards</b> into a deck, and draw <b>3</b> ritual cards.";
    var items = [
      "Place the <b>Manor board</b> in front of you.",
      "Collect the <b>6 portent cubes</b>.",
      "Place the <b>3 omen cubes</b> in the Unassigned Omens box on your board.",
      "Collect the <b>Wraith</b> figure.",
      seals, rit,
      "<i>At the start of your first turn</i>, place the Wraith on any tile with no figures."
    ];
    var extra = [];
    if (VM.v(c, "manor", "shack")) extra.push("You need only <b>11 Seals</b> to win" + VM.varTag("manor", "shack") + ".");
    if (VM.v(c, "manor", "villa")) extra.push("You need only <b>13 Seals</b> to win" + VM.varTag("manor", "villa") + ".");
    return VM.ol(items) + (extra.length ? VM.li(extra) : "");
  },
  warlock: function (c) {
    var cubes = VM.v(c, "warlock", "mindbender")
      ? "Collect the <b>5 magic cubes</b>. Place only <b>2</b> in the Unassigned Magic Cubes box on your board and return <b>1</b> magic cube to the box" + VM.varTag("warlock", "mindbender") + "."
      : "Collect the <b>5 magic cubes</b>. Place <b>3</b> in the Unassigned Magic Cubes box on your board.";
    var items = [
      "Place the <b>Warlock board</b> in front of you.",
      "Collect the <b>20 curse markers</b>.",
      cubes,
      "Place the <b>spells cube</b> on the bottom space of the Spells track.",
      "Shuffle the <b>10 spell cards</b> into a deck.",
      "<i>At the start of your first turn</i>, place the Warlock on any tile with no figures."
    ];
    var extra = [];
    var sp = VM.warlockStartSpells(c);
    if (sp) extra.push("You begin with " + sp + VM.mixTag + ".");
    if (VM.v(c, "warlock", "charlatan")) extra.push("You need to dominate only <b>4 pieces</b> to win" + VM.varTag("warlock", "charlatan") + ".");
    if (VM.v(c, "warlock", "controller")) extra.push("Before your first turn, <b>draw 3 spells</b>" + VM.varTag("warlock", "controller") + ".");
    if (VM.v(c, "warlock", "beguiler")) extra.push("Before your first turn, <b>advance your Spells track twice</b>, but do not draw cards for this" + VM.varTag("warlock", "beguiler") + ".");
    return VM.ol(items) + (extra.length ? VM.li(extra) : "");
  }
};
VM.setupSrc = function (c, role) {
  var s = [VM.SS[role]];
  var vv = VM.variant(c, role);
  if (vv) s.push(VM.LR(VM.variantSec(role, vv)));
  if (role === "paladin") {
    ["miscreant", "boss", "master", "warlord"].forEach(function (id) { if (VM.v(c, "skeletons", id)) s.push(VM.LR(VM.variantSec("skeletons", VM.variants.skeletons.find(function (x) { return x.id === id; })))); });
    if (c.mode === "solo") s.push(VM.LR("The Paladin’s Journey (Solo) › Setup"));
    if (c.mode === "solo" && c.solo.campaign) s.push(VM.LR("The Paladin’s Journey (Solo) › Campaign Play"));
  }
  if (role === "spider") ["squire", "protector"].forEach(function (id) { if (VM.v(c, "paladin", id)) s.push(VM.LR(VM.variantSec("paladin", VM.variants.paladin.find(function (x) { return x.id === id; })))); });
  if (role === "skeletons" && c.has("hhskel")) s.push(VM.HH(1));
  if (c.mixObj && c.mixObj.changes.some(function (ch) { return ch.role === role; })) s.push(VM.LR(c.mixObj.sec));
  return VM.cites(s);
};

/* ---- notes about roles replaced at this table ----------------------------- */
VM.replaceNote = function (c) {
  var out = [];
  if (c.has("aknight")) out.push("the <b>Armored Knight</b> replaces the Paladin");
  if (c.has("shadow")) out.push("the <b>Shadow Paladin</b> replaces the Spider");
  if (c.vis) { var v = VM.visitorById(c.vis); out.push("the <b>" + VM.roleName(v.id) + "</b> from The Crystal Caverns " + (v.id === "goblins" ? "replace" : "replaces") + " the " + VM.roleName(v.replaces)); }
  return out;
};

/* notes when a role-mix change names a role that a Haunted Hallways role or a visitor has replaced */
VM.mixNotes = function (c) {
  var notes = [];
  if (!c.mixObj) return notes;
  var ch = c.mixObj.changes, by = function (r) { return ch.some(function (x) { return x.role === r; }); };
  var sp = c.occupant("spider"), pa = c.occupant("paladin"), sk = c.occupant("skeletons"), wl = c.occupant("warlock");
  if (sp && sp !== "spider" && (by("spider") || VM.skelHuntSpider(c))) {
    var terms = []; if (VM.spiderTwoTerror(c)) terms.push("Terror"); if (VM.skelHuntSpider(c)) terms.push("Spiderlings");
    notes.push("These changes are written for the Spider. With " + VM.roles[sp].the + " in her seat, text naming the Spider refers to " + VM.roles[sp].the + (terms.length ? ", but " + terms.join(" and ") + (terms.length > 1 ? " belong" : " belongs") + " to the Spider" : "") + (VM.spiderExpand(c) ? (terms.length ? ", and" : ", but") + " the Expand spell is a Warlock card handed to the Spider" : "") + " — the sources don’t say how those changes apply. Agree a ruling before you start.");
  }
  if (sp === "shadow" && VM.skelHuntSpider(c) && !pa) notes.push("The Skeletons now hunt the Shadow Paladin, but her Formidable trait costs her Health only when the Paladin (or Armored Knight) hits her, and this mix has neither — the sources don’t say how the Skeletons can kill her. Agree a ruling before you start.");
  if (pa && pa !== "paladin" && by("paladin")) notes.push("The card removals are Paladin cards; " + VM.roles[pa].the + " doesn’t use them.");
  if (sk && sk !== "skeletons" && by("skeletons")) notes.push("The Skeleton changes are written for the Skeletons; the sources don’t say how they apply to " + VM.roles[sk].the + ".");
  if (wl && wl !== "warlock" && by("warlock")) notes.push("The spells named are Warlock cards; " + VM.roles[wl].the + " doesn’t use them (read card text literally — Dead Cards and Abilities).");
  return notes;
};

/* =============================================================================
   SETUP PHASES — c = VM.makeCtx(state)
   ============================================================================= */
VM.phases = [
  {
    title: "The Manor map",
    steps: [
      { when: function (c) { return c.has("map"); }, exp: "core",
        t: "Place the map and starting tiles",
        d: function (c) {
          return VM.li([
            "Lay out the <b>map board</b>: a grid of square <b>crypts</b> ringed by the <b>grounds</b> (rectangular spaces behind the hedges; the Skeletons’ numbered <b>Spawns</b> are there).",
            "Place the <b>starting Pit tile</b> <i>(marked “S”)</i> <b>face up</b> on the center space.",
            "Place the <b>4 Armory tiles</b> <i>(crossed swords)</i> <b>facedown</b> on the four matching spaces.",
            "Place the <b>Entrance tile</b> <i>(marked “E”)</i> <b>face up</b> on the space above the staircase at the bottom, with the <b>wall facing the center space</b>.",
            "Collect the other <b>45 tiles</b>, shuffle them facedown into a stack, and place <b>six</b> facedown as shown in the rulebook’s setup picture." +
              "<div class=\"inline-note\">The living rules say “as shown right”, but the site leaves that setup picture out (it omits some diagrams) — use the printed rulebook’s picture for where the six go.</div>"
          ]);
        },
        src: function () { return VM.LR("Setup › 1. Place Map and Starting Tiles") + " · " + VM.LR("The Map"); } },
      { when: function (c) { return c.has("map"); }, exp: function (c) { return c.has("hhmini") ? "hh" : "core"; },
        t: "Collect the shared supplies",
        d: function (c) {
          return VM.li([
            "Put supplies of <b>poltergeist figures</b>, <b>treasure markers</b>, <b>breach markers</b> and <b>force wall markers</b> near the map.",
            c.has("hhmini") ? "<b>Haunted Hallways miniatures</b> can replace many of the cardboard pieces: 1 Shadow Paladin, 1 Armored Knight, 4 Skeletons, 6 force walls, 9 poltergeists, 10 treasures, 10 webs, 3 Eggs and 1 pillar of light." : "",
            c.mode === "solo" ? "<b>Solo:</b> the Paladin’s Journey also uses the <b>Stability</b> and <b>Terror</b> dials, the Skeleton cards and figures, the spawn die and a <b>blood token</b> (steps below)." : ""
          ]);
        },
        src: function (c) { return VM.cites([VM.LR("Setup › 2. Collect Supplies"), c.has("hhmini") ? VM.HH(1) : ""]); } }
    ]
  },
  {
    title: "Players & roles",
    steps: [
      { when: function (c) { return c.mode === "multi"; }, exp: function (c) { return (c.has("aknight") || c.has("shadow")) ? "hh" : c.vis ? "travel" : "core"; },
        t: "Choose roles",
        d: function (c) {
          var m = c.mixObj;
          var list = c.roles.map(function (r) { return "<b>" + VM.roleName(r) + "</b>"; }).join(", ");
          var rep = VM.replaceNote(c);
          var core3 = ["paladin", "skeletons", "spider"].every(function (s) { return c.seat(s); });
          return VM.li([
            "Each player chooses a role and follows its <b>setup sheet</b> (next steps). This game: " + list + " — " + m.p + " players" + (m.star ? " ★ <i>(a mix suggested for new players)</i>" : "") + ".",
            m.id === "m5" ? "This is the full five-player game." : "Only the mixes listed under <i>Player Counts and Role Mixes</i> can be played; this one " + (m.changes.length ? "changes the setup as shown in the next step." : "needs <b>no rule changes</b>."),
            rep.length ? "At this table " + rep.join("; ") + " — any game text that refers to the replaced role refers to its replacement." : "",
            c.vis ? "Traveling roles: the rules assume a recommended mix with at least the core roles (Paladin/Skeletons/Spider, or their replacements)." + (core3 ? "" : " <b>This mix lacks one of them</b>, so expect to make some rulings during play.") + " Using one migrated role at a time is recommended." : ""
          ]);
        },
        src: function (c) {
          return VM.cites([VM.LR("Setup › 3. Set Up the Player Roles"), VM.LR("Player Counts and Role Mixes"),
            (c.has("aknight") || c.has("shadow")) ? VM.HH(1) : "", c.vis ? VM.LR("Traveling Between Vast Games") : "",
            c.vis ? VM.LR("Traveling Between Vast Games › General Rules › Find and Replace") : ""]);
        } },
      { when: function (c) { return c.mode === "multi" && c.mixObj.changes.length > 0; }, exp: "mix",
        t: function (c) { return "Role-mix changes: " + c.mixObj.name; },
        d: function (c) {
          var notes = VM.mixNotes(c);
          return VM.li(c.mixObj.changes.map(function (ch) { return ch.t; })) + (notes.length ? "<div class=\"inline-note\">" + notes.join(" ") + "</div>" : "");
        },
        src: function (c) { return VM.cites([VM.LR(c.mixObj.sec), (c.has("shadow") && VM.skelHuntSpider(c) && !c.occupant("paladin")) ? VM.HH(2) : ""]); } }
    ]
  },
  {
    title: "Each role's setup",
    steps: [
      { when: function (c) { return c.mode === "multi" && c.has("paladin"); }, exp: function (c) { return (c.diff("paladin") || ["miscreant", "boss", "master", "warlord"].indexOf(c.diff("skeletons")) >= 0) ? "var" : VM.removesPaladinCards(c) ? "mix" : "core"; },
        t: "The Paladin", d: function (c) { return VM.setupList.paladin(c); }, src: function (c) { return VM.setupSrc(c, "paladin"); } },
      { when: function (c) { return c.mode === "multi" && c.has("aknight"); }, exp: "hh",
        t: "The Armored Knight (replaces the Paladin)",
        d: function (c) {
          return VM.li([
            "Set her up from <b>her own setup sheet</b> (in the Haunted Hallways box — it isn’t among this page’s sources).",
            "Her pieces: player board and setup sheet, <b>Armored Knight figure</b>, <b>7 hero cubes</b>, <b>1 health cube</b>, <b>1 grit cube</b>, <b>3 javelin tokens</b>, <b>3 armor tokens</b>, <b>10 sidequest cards</b> and <b>7 artifact cards</b>.",
            "She starts with <b>1 Strength and 1 Defense</b>.",
            "Any game text that refers to the Paladin refers to her.",
            VM.v(c, "skeletons", "miscreant") || VM.v(c, "skeletons", "boss") ? "The Skeletons’ " + VM.variant(c, "skeletons").name + " variant says “the Paladin starts at " + (VM.v(c, "skeletons", "miscreant") ? 5 : 6) + " Health” — read as the Armored Knight." : "",
            VM.v(c, "skeletons", "master") || VM.v(c, "skeletons", "warlord") ? "The Skeletons’ " + VM.variant(c, "skeletons").name + " variant gives the Paladin treasure cards; the Armored Knight has no treasure cards, and the sources don’t cover this." : "",
            c.diff("paladin") ? "" : ""
          ]);
        },
        src: function (c) { return VM.cites([VM.HH(1), VM.HH(3), (VM.variant(c, "skeletons") ? VM.LR(VM.variantSec("skeletons", VM.variant(c, "skeletons"))) : "")]); } },
      { when: function (c) { return c.mode === "multi" && c.has("knight"); }, exp: "travel",
        t: "The Knight (visiting from The Crystal Caverns)",
        d: function () {
          return VM.li([
            "The Knight replaces the <b>Paladin</b> (a migrated role replaces the role of the same colour).",
            "Set her up by The Crystal Caverns’ own rules — see " + VM.CAVES_LINK + ".",
            "In the Manor she <b>does not use bomb tokens</b>: her Bomb equipment places a breach marker on a wall of her tile instead."
          ]);
        },
        src: function () { return VM.cites([VM.LR("Traveling Between Vast Games"), VM.LR("Traveling Between Vast Games › Visiting the Manor › Knight in the Manor")]); } },
      { when: function (c) { return c.mode === "multi" && c.has("skeletons"); }, exp: function (c) { return c.has("hhskel") ? "hh" : VM.removesGear(c) ? "mix" : "core"; },
        t: "The Skeletons", d: function (c) { return VM.setupList.skeletons(c); }, src: function (c) { return VM.setupSrc(c, "skeletons"); } },
      { when: function (c) { return c.mode === "multi" && c.has("goblins"); }, exp: "travel",
        t: "The Goblins (visiting from The Crystal Caverns)",
        d: function () {
          return VM.li([
            "The Goblins replace the <b>Skeletons</b> (the role of the same colour).",
            "Set them up by The Crystal Caverns’ own rules — see " + VM.CAVES_LINK + " — with this change: <b>roll the spawn die for each Tribe and place it on the matching Spawn</b>."
          ]);
        },
        src: function () { return VM.cites([VM.LR("Traveling Between Vast Games"), VM.LR("Traveling Between Vast Games › Visiting the Manor › Goblins in the Manor")]); } },
      { when: function (c) { return c.mode === "multi" && c.has("spider"); }, exp: function (c) { return (c.diff("spider") || VM.v(c, "paladin", "squire") || VM.v(c, "paladin", "protector")) ? "var" : (VM.spiderTwoTerror(c) || VM.spiderExpand(c)) ? "mix" : "core"; },
        t: "The Spider", d: function (c) { return VM.setupList.spider(c); }, src: function (c) { return VM.setupSrc(c, "spider"); } },
      { when: function (c) { return c.mode === "multi" && c.has("shadow"); }, exp: "hh",
        t: "The Shadow Paladin (replaces the Spider)",
        d: function (c) {
          var ruin = c.seat("paladin") || c.seat("skeletons");
          return VM.li([
            "Set up from the Shadow Paladin’s <b>own setup sheet</b> (in the Haunted Hallways box — it isn’t among this page’s sources).",
            "Pieces: player board and setup sheet, <b>Shadow Paladin figure</b>, <b>20 ruin cubes</b>, <b>1 health cube</b>, <b>5 ice tokens</b>, <b>16 power cards</b> and <b>12 chain cards</b>.",
            ruin ? "<b>Starting Ruin:</b> in games with the Paladin or the Skeletons, the Shadow Paladin begins with <b>5 ruin cubes</b>." : "<b>Starting Ruin:</b> only games with the Paladin or the Skeletons give the Shadow Paladin 5 starting ruin cubes — this mix has neither.",
            "Starts with <b>no Strength and 1 Defense</b>; any game text that refers to the Spider refers to the Shadow Paladin.",
            (VM.v(c, "paladin", "squire") || VM.v(c, "paladin", "protector")) ? "The Paladin’s " + VM.variant(c, "paladin").name + " variant has the Spider hand over Spiderlings; the Shadow Paladin has none, and the sources don’t cover this." : ""
          ]);
        },
        src: function (c) { return VM.cites([VM.HH(1), VM.HH(2), VM.variant(c, "paladin") && (VM.v(c, "paladin", "squire") || VM.v(c, "paladin", "protector")) ? VM.LR(VM.variantSec("paladin", VM.variant(c, "paladin"))) : ""]); } },
      { when: function (c) { return c.mode === "multi" && c.has("dragon"); }, exp: "travel",
        t: "The Dragon (visiting from The Crystal Caverns)",
        d: function () {
          return VM.li([
            "The Dragon replaces the <b>Spider</b> (the role of the same colour); the Paladin’s cards that name the Spider now name the Dragon.",
            "Set him up by The Crystal Caverns’ own rules — see " + VM.CAVES_LINK + ". The living rules list no setup changes for him; his Manor rules are in the reference below."
          ]);
        },
        src: function () { return VM.cites([VM.LR("Traveling Between Vast Games"), VM.LR("Traveling Between Vast Games › General Rules › Find and Replace"), VM.LR("Traveling Between Vast Games › Visiting the Manor › Dragon in the Manor")]); } },
      { when: function (c) { return c.mode === "multi" && c.has("manor"); }, exp: function (c) { return c.diff("manor") ? "var" : VM.manorThreeSeals(c) ? "mix" : "core"; },
        t: "The Manor", d: function (c) { return VM.setupList.manor(c); }, src: function (c) { return VM.setupSrc(c, "manor"); } },
      { when: function (c) { return c.mode === "multi" && c.has("warlock"); }, exp: function (c) { return c.diff("warlock") ? "var" : VM.warlockStartSpells(c) ? "mix" : "core"; },
        t: "The Warlock", d: function (c) { return VM.setupList.warlock(c); }, src: function (c) { return VM.setupSrc(c, "warlock"); } },
      { when: function (c) { return c.mode === "multi" && c.has("thief"); }, exp: "travel",
        t: "The Thief (visiting from The Crystal Caverns)",
        d: function () {
          return VM.li([
            "The Thief replaces the <b>Warlock</b>. <i>(The living rules don’t name this colour pair outright; their Warlock-in-the-Cave rules play alongside the Knight, the Goblins and, optionally, the Cave role, so the Warlock and the Thief share a colour.)</i>",
            "Set up by The Crystal Caverns’ own rules — see " + VM.CAVES_LINK + ". The living rules list no setup changes; the Thief’s Manor rules are in the reference below (a <b>vault token</b> goes on each Shrine when it is revealed)."
          ]);
        },
        src: function () { return VM.cites([VM.LR("Traveling Between Vast Games"), VM.LR("Traveling Between Vast Games › Visiting the Manor › Thief in the Manor")]); } }
    ]
  },
  {
    title: "Before the first turn",
    steps: [
      { when: function (c) { return c.mode === "multi"; }, exp: "core",
        t: "Turn order and first-turn reminders",
        d: function (c) {
          var order = c.roles.map(function (r) { return VM.roleName(r); }).join(" → ");
          return VM.li([
            "Turns go in this order, then repeat: <b>" + order + "</b>." + (VM.replaceNote(c).length ? " <i>(A replacement role takes the turn of the role it replaces.)</i>" : ""),
            "Play continues until a player wins.",
            c.has("spider") ? "The <b>Spider</b> ignores her Choose Form step on her first turn — she starts as the Giant Spider." : "",
            c.has("manor") ? "The <b>Manor</b> places the Wraith on any tile with no figures at the start of its first turn." : "",
            c.has("warlock") ? "The <b>Warlock</b> places his figure on any tile with no figures at the start of his first turn" +
              (VM.v(c, "warlock", "controller") ? "; before it, he draws 3 spells (Controller)" : VM.v(c, "warlock", "beguiler") ? "; before it, he advances his Spells track twice without drawing (Beguiler)" : "") + "." : "",
            c.p < 4 && VM.variantRoles.some(function (r) { return c.diff(r); }) ? "<b>Difficulty variants</b> assume a game with 4 or 5 players; some may not suit low player counts." : ""
          ]);
        },
        src: function (c) {
          return VM.cites([VM.LR("How to Play"), c.has("spider") ? VM.LR("The Spider › 1) Choose Form") + " · " + VM.SS.spider : "", c.has("manor") ? VM.SS.manor : "",
            c.has("warlock") ? VM.SS.warlock : "", VM.variantRoles.some(function (r) { return c.diff(r); }) ? VM.LR("Difficulty Variants") : "",
            (c.has("aknight") || c.has("shadow")) ? VM.HH(1) : "", c.vis ? VM.LR("Traveling Between Vast Games") : ""]);
        } }
    ]
  },
  {
    title: "The Paladin's Journey (solo)",
    steps: [
      { when: function (c) { return c.mode === "solo"; }, exp: function (c) { return c.solo.campaign ? "solo" : "core"; },
        t: "Set up the Paladin", d: function (c) { return VM.setupList.paladin(c); }, src: function (c) { return VM.setupSrc(c, "paladin"); } },
      { when: function (c) { return c.mode === "solo"; }, exp: function (c) { return (c.solo.level === "hard" || c.has("hhskel")) ? "hh" : "solo"; },
        t: "Line up the Skeletons",
        d: function (c) {
          var n = c.solo.lv.skels;
          return VM.li([
            "Shuffle <b>" + n + " Skeleton cards</b> and place them <b>face up</b> in a line nearby as their <b>March Order</b>" +
              (c.solo.level === "easy" ? " (Easy: 4 Skeletons)" : c.solo.level === "hard" ? " (Hard: 6 Skeletons — the 6th comes from Haunted Hallways)" : "") + ".",
            "Roll the <b>spawn die</b> to spawn each Skeleton on its numbered Spawn. <b>All " + n + " begin in play.</b>",
            c.has("hhskel") ? "Any of the 4 Haunted Hallways Skeletons can replace Skeletons from the base game one-for-one, in any combination." : "",
            "The Skeletons don’t use abilities or gear in this mode."
          ]);
        },
        src: function (c) { return VM.cites([VM.LR("The Paladin’s Journey (Solo) › Setup"), VM.LR("The Paladin’s Journey (Solo) › The Skeletons"), c.solo.level !== "normal" ? VM.LR("The Paladin’s Journey (Solo) › Difficulty") : "", c.has("hhskel") ? VM.HH(1) : ""]); } },
      { when: function (c) { return c.mode === "solo"; }, exp: "solo",
        t: "Enemy dials and the first blood",
        d: function (c) {
          var r = c.solo.campaign ? c.solo.ranks : null;
          return VM.li([
            "Place the <b>Stability</b> and <b>Terror</b> dials nearby and set them to <b>" + (r ? VM.campaignRanks[r.st].st + " Stability</b> and <b>" + VM.campaignRanks[r.te].te + " Terror</b> (campaign ranks " + r.st + " and " + r.te + ")" : "0</b>") + ".",
            "Place a <b>blood token</b> on the central Pit tile."
          ]);
        },
        src: function (c) { return VM.cites([VM.LR("The Paladin’s Journey (Solo) › Setup"), c.solo.campaign ? VM.LR("The Paladin’s Journey (Solo) › Campaign Play") : ""]); } },
      { when: function (c) { return c.mode === "solo"; }, exp: "solo",
        t: function (c) { return "Goal — " + c.solo.lv.name + " difficulty" + (c.solo.campaign ? ", campaign" : ""); },
        d: function (c) {
          var lv = c.solo.lv;
          return VM.li([
            "<b>Win</b> by hitting <b>" + lv.polts + " poltergeists</b> (keep each one you hit to track it).",
            "<b>Lose</b> if you reach <b>0 Health</b> or <b>" + lv.terror + " Terror</b>.",
            c.solo.campaign ? "<b>Campaign:</b> each time you win, raise one category (Fury &amp; Light, Stability or Terror) by one rank, up to rank 3. You can’t raise a category whose rank is higher than any other category’s. Finish a game with all three at rank 3 and you are a <b>Vast Master</b>." : ""
          ]);
        },
        src: function (c) { return VM.cites([VM.LR("The Paladin’s Journey (Solo) › Goal"), c.solo.level !== "normal" ? VM.LR("The Paladin’s Journey (Solo) › Difficulty") : "", c.solo.campaign ? VM.LR("The Paladin’s Journey (Solo) › Campaign Play") : ""]); } }
    ]
  },
  {
    title: "Traveling to The Crystal Caverns",
    steps: [
      { when: function (c) { return c.mode === "cave"; }, exp: "travel",
        t: "Set up The Crystal Caverns",
        d: function (c) {
          var t = VM.travelerById(c.trav);
          return VM.li([
            "Set up <b>Vast: The Crystal Caverns</b> by its own rules — see " + VM.CAVES_LINK + ".",
            "<b>" + VM.roleName(c.trav) + "</b> replaces the <b>" + t.cave + "</b> — a migrated role replaces the role of the same colour" + (c.trav === "warlock" ? " <i>(the living rules don’t name this pair outright: their Warlock-in-the-Cave rules play alongside the Knight, the Goblins and, optionally, the Cave role)</i>" : "") + ".",
            "The rules assume one of the Caverns’ recommended player mixes with at least its core roles (Knight/Goblins/Dragon — or your traveler in place of the one it replaces). Other mixes are possible but will likely need some rulings. Migrating one role at a time is recommended.",
            "If you play without a role, use the variant rules from that role’s original game. <i>Example: if the Skeletons visit the Cave with the Knight and the Dragon, the Dragon takes the Past Plunder variant card.</i>"
          ]);
        },
        src: function (c) { return VM.cites([VM.LR("Traveling Between Vast Games"), (c.trav === "aknight" || c.trav === "shadow") ? VM.HH(1) + " · " + VM.HH(4) : ""]); } },
      { when: function (c) { return c.mode === "cave" && ["paladin", "skeletons", "spider", "warlock"].indexOf(c.trav) >= 0; }, exp: "travel",
        t: function (c) { return "Set up the " + VM.roleName(c.trav); },
        d: function (c) {
          var notes = {
            paladin: "Your sheet puts your figure on the Entrance tile — the Cave has one too (its Entrance can’t be flipped Dark). Treasure: without a Manor player you draw a treasure card for each treasure marker you collect.",
            skeletons: "Your sheet places Skeletons on numbered Spawns in the Manor’s grounds; the living rules give no Cave placement for them, so agree one before play.",
            spider: "Your sheet puts the Giant Spider on the Manor’s central Pit; the living rules give no Cave starting space, so agree one before play.",
            warlock: "Bring the <b>poltergeist figures</b> and <b>force wall markers</b>: the Warlock uses them in the Cave. In games without the Cave <i>(the Cave role, not the game: this rule is written for games already in the Caverns)</i>, the Warlock starts with the <b>Past Plunder</b> variant card."
          }[c.trav];
          return VM.setupList[c.trav](c) + "<div class=\"inline-note\">" + notes + "</div>";
        },
        src: function (c) {
          var t = VM.travelerById(c.trav);
          return VM.cites([VM.SS[c.trav], t.sec ? VM.LR(t.sec) : VM.LR("Traveling Between Vast Games"), c.trav === "paladin" ? VM.LR("The Paladin › 2) Take Actions › Crusade › 4: COLLECT TREASURES") + " · " + VM.LR("Traveling Between Vast Games › Visiting the Cave › General") : "",
            c.has("hhskel") ? VM.HH(1) : ""]);
        } },
      { when: function (c) { return c.mode === "cave" && (c.trav === "aknight" || c.trav === "shadow"); }, exp: "hh",
        t: function (c) { return "Set up the " + VM.roleName(c.trav); },
        d: function (c) {
          if (c.trav === "aknight") return VM.li([
            "Set her up from <b>her own setup sheet</b> (in the Haunted Hallways box — not among this page’s sources). Pieces: player board and setup sheet, figure, 7 hero cubes, 1 health cube, 1 grit cube, 3 javelin tokens, 3 armor tokens, 10 sidequest cards, 7 artifact cards.",
            "In the Cave she uses the <b>Knight’s sidequest cards</b>. When she completes a sidequest she gains an <b>artifact</b>, not Grit."
          ]);
          return VM.li([
            "Set up from the Shadow Paladin’s <b>own setup sheet</b> (in the Haunted Hallways box — not among this page’s sources). Pieces: player board and setup sheet, figure, 20 ruin cubes, 1 health cube, 5 ice tokens, 16 power cards, 12 chain cards.",
            "The 5 starting ruin cubes are for games with the Paladin or the Skeletons; in the Cave those seats hold the Knight and the Goblins, and the booklet doesn’t say whether they count."
          ]);
        },
        src: function (c) { return VM.cites([VM.HH(1), VM.HH(4), c.trav === "shadow" ? VM.HH(2) : ""]); } },
      { when: function (c) { return c.mode === "cave"; }, exp: "travel",
        t: "Traveling rules in force",
        d: function (c) {
          return VM.li([
            "<b>Find and Replace:</b> any reference to the replaced role means your traveler (e.g. Caverns cards naming the " + VM.travelerById(c.trav).cave + " now name the " + VM.roleName(c.trav) + ").",
            "<b>Dead cards and abilities:</b> read card text literally; don’t convert game terms unless told to. Some cards may do nothing.",
            "<b>Attacking by movement:</b> attacks broadly follow the <b>defender’s</b> original game (not card or ability text). Caverns roles are forced to attack by moving into a space with an enemy figure only if that colour of Manor role would be.",
            "<b>Forced move:</b> when a Caverns role forces a Manor role to move, it can move it onto any legal tile — the Warlock may be forced into crypts, the Skeletons into crypts and grounds.",
            "<b>In the Cave:</b> the Entrance and Crystal tiles cannot be flipped to their Dark side.",
            "Your role’s own Cave rules are in the reference below."
          ]);
        },
        src: function () { return VM.cites([VM.LR("Traveling Between Vast Games › General Rules (Find and Replace, Dead Cards and Abilities, Attacking by Movement, Forced Move)"), VM.LR("Traveling Between Vast Games › Visiting the Cave › General")]); } }
    ]
  }
];
