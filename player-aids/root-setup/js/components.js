/* =============================================================================
   Root — Components glossary data (standard v1.1; rendered by js/comp-widget.js)
   Counts and names: the Law of Root, Appendix C (Law p.24–25 §C.1–C.12), split per piece type so each piece shows only
   with the faction, map, deck or module that uses it. Booklets are left out (standard: rulebooks are not components).
   Pictures: no book has a pictured components page, so each piece is cropped from where a book pictures it —
   LtP p.4 (setup), p.23 (Winter map), p.24 (Piece Glossary); Walkthrough PDF p.3, p.6, p.19; Riverfolk p.3, p.5, p.7;
   Underworld p.3–7; Marauder p.2–8, p.12–13, p.18, p.20; Homeland p.2–19; Rootbotics p.3, p.7.
   Gating (the context c from app.js / RT.ctx):
     - faction pieces show while that faction is in play (c.fac), and its faction board only while a person plays it
       (bots use their own boards from the Clockwork boxes, Rootbotics §4–11);
     - the original Mechanical Marquise doesn't use the Marquise's buildings (Riverfolk p.6, step 7); Mechanical Marquise 2.0
       gathers no wood (Rootbotics p.4 §4.3.1), while the original follows the Marquise's step 1, which forms the wood supply;
     - map pieces with their map, deck replacements with their deck (Law p.22 §A.2), module pieces with their module.
   ============================================================================= */
(function () {
  "use strict";
  function f(c, k) { return typeof c[k] === "function" ? c[k] : function () { return false; }; }
  function fac(c, id) { return !!f(c, "fac")(id); }
  function human(c, id) { return !!f(c, "human")(id); }
  function any(c, ids) { return ids.some(function (id) { return fac(c, id); }); }
  function vbH(c) { return !!c.vbH; }
  function vb(c) { return fac(c, "vagabond") || fac(c, "vagabond2"); }
  function bots(c) {                                       // [{fid, type, diff, traits, vbot}]
    return (c.facs || []).map(function (id) {
      var b = f(c, "botCfg")(id);
      return b ? { fid: id, type: b.type, diff: b.diff, traits: b.traits, vbot: b.vbot } : null;
    }).filter(Boolean);
  }
  var CW = ["mm2", "eyriebot", "allybot", "vagabot", "vagabot2"], CW2 = ["lizbot", "riverbot", "duchybot", "corvbot"];
  var VB1 = ["thief", "tinker", "ranger"], VB2 = ["vagrant", "scoundrel", "arbiter"];
  function boxBots(c, box) { return bots(c).filter(function (b) { return box.indexOf(b.type) >= 0; }); }
  function vagabots(c, chars) { return bots(c).some(function (b) { return (b.type === "vagabot" || b.type === "vagabot2") && chars.indexOf(b.vbot) >= 0; }); }
  function rbBot(c) { return boxBots(c, CW.concat(CW2)).length > 0; }
  function catBuildings(c) { return fac(c, "marquise") && !c.mmorig; }   // Marquise buildings: a person or Mechanical Marquise 2.0
  function mapIs(c, m) { return c.map === m; }
  function lmIn(c, id) { return f(c, "lmPool")(id) || (c.map === "marsh" && c.p >= 5); }   // Law p.28 §M.5.1: Marsh, 5+ players
  function hire(c, id) { return !!f(c, "hireDealt")(id); }
  function hpacks(c) {   // pack pieces only while at least one of the three dealt hirelings can come from a pack (Law p.23 §A.6.1)
    if (!c.hire) return false;
    var n = ["patrol", "dynasty", "uprising", "exile"].filter(function (id) { return hire(c, id); }).length;
    return n < 3;
  }

  window.AID_COMPONENTS = {
    sets: [
      { id: "base", name: "Root (base game)", src: "Law p.24 §C.1 · pictures LtP p.4, p.23–24, Walkthrough PDF p.3, p.6, p.19" },
      { id: "riverfolk", name: "Riverfolk Expansion", src: "Law p.24 §C.2 · pictures Riverfolk p.3, p.5, p.7", fig: "#fdf8ea", when: function (c) { return c.has("riverfolk"); } },
      { id: "underworld", name: "Underworld Expansion", src: "Law p.24 §C.3 · pictures Underworld p.3–7", fig: "#fcf9ee", when: function (c) { return c.has("underworld"); } },
      { id: "marauder", name: "Marauder Expansion", src: "Law p.24 §C.4 · pictures Marauder p.2–20", fig: "#f9f6e1", when: function (c) { return c.has("marauder"); } },
      { id: "homeland", name: "Homeland Expansion", src: "Law p.24 §C.5 · pictures Homeland p.2–19", fig: "#fcf6e2", when: function (c) { return c.has("homeland"); } },
      { id: "clockwork", name: "Clockwork Expansion", src: "Law p.25 §C.6 · pictures Rootbotics p.3, p.7", fig: "#fcf8ec", when: function (c) { return c.has("clockwork"); } },
      { id: "clockwork2", name: "Clockwork Expansion 2", src: "Law p.25 §C.7 · pictures Rootbotics p.3", fig: "#fcf8ec", when: function (c) { return c.has("clockwork2"); } },
      { id: "vpack", name: "Vagabond Pack", src: "Law p.25 §C.11", when: function (c) { return c.has("vpack"); } },
      { id: "epdeck", name: "Exiles and Partisans Deck", src: "Law p.25 §C.8", when: function (c) { return c.has("epdeck"); } },
      { id: "sddeck", name: "Squires and Disciples Deck", src: "Law p.25 §C.9", when: function (c) { return c.has("sddeck"); } },
      { id: "lpack", name: "Landmarks Pack", src: "Law p.25 §C.10", when: function (c) { return c.has("lpack"); } },
      { id: "hpacks", name: "Hireling Packs", src: "Law p.25 §C.12", when: function (c) { return c.has("hpacks"); } }
    ],
    items: [
      /* ---------- Root (Law p.24 §C.1) ---------- */
      { set: "base", qty: "1", name: "Board (Fall and Winter maps)", note: "Tonight: the Fall side — the Autumn map (Law p.27 §M.1).", img: "base-board-autumn.webp", w: 320, h: 292, when: function (c) { return mapIs(c, "autumn"); } },
      { set: "base", qty: "1", name: "Board (Fall and Winter maps)", note: "Tonight: the Winter map side, on the back of the Fall map (LtP p.23).", img: "base-board-winter.webp", w: 320, h: 292, when: function (c) { return mapIs(c, "winter"); } },
      { set: "base", qty: "12", name: "Clearing markers", note: "4 rabbit, 4 fox, 4 mouse. On every map except Autumn, shuffle these suit markers face down, place one on each clearing, then flip them all face up (Law p.22 §A.1; LtP p.23). On the Marsh map with 5+ players, the three landmark clearings get no suit marker (Law p.28 §M.5.1).", img: "base-suit-markers.webp", w: 237, h: 320, when: function (c) { return !!c.map && c.map !== "autumn"; } },
      { set: "base", qty: "4", name: "Ruins", img: "base-ruin.webp", w: 288, h: 301 },
      { set: "base", qty: "23", name: "Items", note: "4 boots, 4 swords, 4 bags, 3 hammers, 3 tea, 2 coins, 2 crossbows, 1 torch.", img: "base-items.webp", w: 320, h: 111 },
      { set: "base", qty: "4", name: "Victory point markers", note: "Score markers for the Marquise, Eyrie, Alliance and Vagabond.", img: "base-score-markers.webp", w: 320, h: 87 },
      { set: "base", qty: "2", name: "Battle dice", img: "base-dice.webp", w: 241, h: 301 },
      { set: "base", qty: "16", name: "Faction overviews", img: "base-overviews.webp", w: 320, h: 236 },
      { set: "base", qty: "54", name: "Cards for shared deck", note: "Four are dominance cards, one in each suit (LtP p.21).", img: "base-shared-deck.webp", w: 285, h: 260, when: function (c) { return !c.deck || c.deck === "standard"; } },
      { set: "base", qty: "4", name: "Walkthroughs", note: "The walkthrough cards, one per faction (Walkthrough PDF p.2).", img: "base-walkthrough-cards.webp", w: 320, h: 150, when: function (c) { return !!c.walk; } },
      // Marquise de Cat
      { set: "base", qty: "25", name: "Marquise warriors", img: "base-warrior-marquise.webp", w: 221, h: 181, when: function (c) { return fac(c, "marquise"); } },
      { set: "base", qty: "6", name: "Sawmills", note: "Marquise buildings.", img: "base-sawmill.webp", w: 134, h: 134, when: catBuildings },
      { set: "base", qty: "6", name: "Workshops", note: "Marquise buildings.", img: "base-workshop.webp", w: 254, h: 308, when: catBuildings },
      { set: "base", qty: "6", name: "Recruiters", note: "Marquise buildings.", img: "base-recruiter.webp", w: 134, h: 141, when: catBuildings },
      { set: "base", qty: "8", name: "Wood tokens", img: "base-wood.webp", w: 228, h: 261, when: function (c) { return human(c, "marquise") || !!c.mmorig; } },
      { set: "base", qty: "1", name: "Keep token", img: "base-keep.webp", w: 247, h: 287, when: function (c) { return fac(c, "marquise"); } },
      { set: "base", qty: "1", name: "Marquise faction board", note: "One of the 4 faction boards.", img: "base-board-marquise.webp", w: 303, h: 237, when: function (c) { return human(c, "marquise"); } },
      // Eyrie Dynasties
      { set: "base", qty: "20", name: "Eyrie warriors", img: "base-warrior-eyrie.webp", w: 227, h: 181, when: function (c) { return fac(c, "eyrie"); } },
      { set: "base", qty: "7", name: "Roosts", note: "Eyrie buildings.", img: "base-roost.webp", w: 274, h: 308, when: function (c) { return fac(c, "eyrie"); } },
      { set: "base", qty: "4", name: "Eyrie leaders", when: function (c) { return human(c, "eyrie"); } },
      { set: "base", qty: "2", name: "Loyal viziers", img: "base-viziers.webp", w: 320, h: 230, when: function (c) { return fac(c, "eyrie"); } },
      { set: "base", qty: "1", name: "Eyrie faction board", note: "One of the 4 faction boards. Pictured: the Decree along its bottom edge.", img: "base-board-eyrie.webp", w: 320, h: 151, when: function (c) { return human(c, "eyrie"); } },
      // Woodland Alliance
      { set: "base", qty: "10", name: "Alliance warriors", img: "base-warrior-alliance.webp", w: 234, h: 181, when: function (c) { return fac(c, "alliance"); } },
      { set: "base", qty: "3", name: "Bases", note: "Alliance buildings.", img: "base-base.webp", w: 227, h: 261, when: function (c) { return fac(c, "alliance"); } },
      { set: "base", qty: "10", name: "Sympathy tokens", img: "base-sympathy.webp", w: 208, h: 207, when: function (c) { return fac(c, "alliance"); } },
      { set: "base", qty: "1", name: "Alliance faction board", note: "One of the 4 faction boards.", when: function (c) { return human(c, "alliance"); } },
      // Vagabond
      { set: "base", qty: "1", name: "Vagabond pawn", img: "base-pawn.webp", w: 260, h: 194, when: function (c) { return vb(c); } },
      { set: "base", qty: "1", name: "Vagabond pawn", note: "The Knaves use the matching Vagabond pawn as a Captain's warrior — the Thief Captain uses the Thief pawn from the base game (Homeland p.15).", img: "base-pawn.webp", w: 260, h: 194, when: function (c) { return !vb(c) && fac(c, "knaves"); } },
      { set: "base", qty: "3", name: "Vagabond characters", note: "Thief, Tinker and Ranger.", when: vbH },
      { set: "base", qty: "15", name: "Quests", img: "base-quest.webp", w: 244, h: 320, when: vb },
      { set: "base", qty: "3", name: "Relationship markers", note: "The Vagabond's markers for the other base factions.", img: "base-relationship.webp", w: 248, h: 288, when: vbH },
      { set: "base", qty: "1", name: "Vagabond faction board", note: "One of the 4 faction boards.", when: function (c) { return human(c, "vagabond"); } },

      /* ---------- Riverfolk Expansion (Law p.24 §C.2) ---------- */
      { set: "riverfolk", qty: "3", name: "Victory point markers", when: function (c) { return any(c, ["lizard", "riverfolk", "vagabond2"]); } },
      { set: "riverfolk", qty: "2", name: "Faction overviews", when: function (c) { return any(c, ["lizard", "riverfolk"]); } },
      { set: "riverfolk", qty: "17", name: "Spare pieces", note: "With letter backs, for future scenarios." },
      // Lizard Cult
      { set: "riverfolk", qty: "25", name: "Lizard warriors", img: "riverfolk-warrior-lizard.webp", w: 147, h: 134, when: function (c) { return fac(c, "lizard"); } },
      { set: "riverfolk", qty: "15", name: "Gardens", note: "Lizard Cult buildings.", when: function (c) { return fac(c, "lizard"); } },
      { set: "riverfolk", qty: "1", name: "Outcast marker", when: function (c) { return fac(c, "lizard"); } },
      { set: "riverfolk", qty: "1", name: "Lizard Cult faction board", note: "One of the 4 Riverfolk faction boards.", when: function (c) { return human(c, "lizard"); } },
      // Riverfolk Company
      { set: "riverfolk", qty: "15", name: "Riverfolk warriors", img: "riverfolk-warrior-riverfolk.webp", w: 127, h: 120, when: function (c) { return fac(c, "riverfolk"); } },
      { set: "riverfolk", qty: "9", name: "Trade posts", note: "Riverfolk Company tokens.", img: "riverfolk-trade-post.webp", w: 141, h: 141, when: function (c) { return fac(c, "riverfolk"); } },
      { set: "riverfolk", qty: "3", name: "Service markers", when: function (c) { return human(c, "riverfolk"); } },
      { set: "riverfolk", qty: "1", name: "Riverfolk Company faction board", note: "One of the 4 Riverfolk faction boards.", when: function (c) { return human(c, "riverfolk"); } },
      // Vagabonds
      { set: "riverfolk", qty: "1", name: "Vagabond pawn", note: "For the second Vagabond (Law p.10 §9.7).", when: function (c) { return fac(c, "vagabond2"); } },
      { set: "riverfolk", qty: "1", name: "Vagabond pawn", note: "The Knaves can use the Riverfolk Vagabond pawn as a unique warrior for the matching Captain (Homeland p.15).", when: function (c) { return !fac(c, "vagabond2") && fac(c, "knaves"); } },
      { set: "riverfolk", qty: "1", name: "Second Vagabond faction board", note: "One of the 4 Riverfolk faction boards.", when: function (c) { return human(c, "vagabond2"); } },
      { set: "riverfolk", qty: "3", name: "Vagabond characters", note: "Vagrant, Arbiter and Scoundrel.", when: vbH },
      { set: "riverfolk", qty: "11", name: "Items", note: "3 boots, 3 swords, 1 bag, 1 hammer, 1 torch, 1 coins, 1 crossbow. With two Vagabonds, use both sets of “R” items (Law p.10 §9.7.1)." },
      { set: "riverfolk", qty: "9", name: "Relationship markers", when: vbH },
      // the original Mechanical Marquise
      { set: "riverfolk", qty: "1", name: "Mechanical Marquise faction board", note: "The original Mechanical Marquise (Riverfolk p.6–8). One of the 4 Riverfolk faction boards.", when: function (c) { return !!c.mmorig; } },
      { set: "riverfolk", qty: "4", name: "Spies", note: "Spy cards: shuffled into the deck in place of the four dominance cards when the original Mechanical Marquise plays (Riverfolk p.6–7).", img: "riverfolk-spy.webp", w: 207, h: 320, when: function (c) { return !!c.mmorig; } },
      { set: "riverfolk", qty: "1", name: "Card stand", note: "Holds the Mechanical Marquise's Schedule of Orders (Riverfolk p.6).", when: function (c) { return !!c.mmorig; } },

      /* ---------- Underworld Expansion (Law p.24 §C.3) ---------- */
      { set: "underworld", qty: "1", name: "Board (Lake and Mountain maps)", note: "Tonight: the Lake map side.", img: "underworld-board-lake.webp", w: 320, h: 295, when: function (c) { return mapIs(c, "lake"); } },
      { set: "underworld", qty: "1", name: "Board (Lake and Mountain maps)", note: "Tonight: the Mountain map side.", img: "underworld-board-mountain.webp", w: 320, h: 294, when: function (c) { return mapIs(c, "mountain"); } },
      { set: "underworld", qty: "1", name: "Ferry", img: "underworld-ferry.webp", w: 260, h: 214, when: function (c) { return mapIs(c, "lake"); } },
      { set: "underworld", qty: "1", name: "Tower", img: "underworld-tower.webp", w: 160, h: 280, when: function (c) { return mapIs(c, "mountain"); } },
      { set: "underworld", qty: "6", name: "Closed path markers", when: function (c) { return mapIs(c, "mountain"); } },
      { set: "underworld", qty: "2", name: "Battle dice" },
      { set: "underworld", qty: "2", name: "Victory point markers", when: function (c) { return any(c, ["duchy", "corvid"]); } },
      { set: "underworld", qty: "2", name: "Overviews", when: function (c) { return any(c, ["duchy", "corvid"]); } },
      { set: "underworld", qty: "4", name: "Relationship markers", when: vbH },
      // Underground Duchy
      { set: "underworld", qty: "20", name: "Duchy warriors", img: "underworld-warrior-duchy.webp", w: 107, h: 108, when: function (c) { return fac(c, "duchy"); } },
      { set: "underworld", qty: "1", name: "The Burrow", img: "underworld-burrow.webp", w: 184, h: 209, when: function (c) { return fac(c, "duchy"); } },
      { set: "underworld", qty: "3", name: "Tunnels", note: "Duchy tokens.", img: "underworld-tunnel.webp", w: 94, h: 87, when: function (c) { return fac(c, "duchy"); } },
      { set: "underworld", qty: "3", name: "Markets", note: "Duchy buildings.", when: function (c) { return fac(c, "duchy"); } },
      { set: "underworld", qty: "3", name: "Citadels", note: "Duchy buildings.", when: function (c) { return fac(c, "duchy"); } },
      { set: "underworld", qty: "9", name: "Crowns", when: function (c) { return fac(c, "duchy"); } },
      { set: "underworld", qty: "9", name: "Ministers", note: "Minister cards.", img: "underworld-minister.webp", w: 272, h: 320, when: function (c) { return human(c, "duchy"); } },
      { set: "underworld", qty: "1", name: "Duchy faction board", note: "One of the 2 Underworld faction boards.", when: function (c) { return human(c, "duchy"); } },
      // Corvid Conspiracy
      { set: "underworld", qty: "15", name: "Corvid warriors", img: "underworld-warrior-corvid.webp", w: 121, h: 108, when: function (c) { return fac(c, "corvid"); } },
      { set: "underworld", qty: "8", name: "Plots", note: "Two each of four kinds: bomb, snare, extortion and raid (Underworld p.4).", img: "underworld-plots.webp", w: 79, h: 320, when: function (c) { return fac(c, "corvid"); } },
      { set: "underworld", qty: "8", name: "Spare plots", note: "A second set of plot tokens, for replacement in case of damage (Underworld p.4).", when: function (c) { return fac(c, "corvid"); } },
      { set: "underworld", qty: "1", name: "Corvid faction board", note: "One of the 2 Underworld faction boards.", when: function (c) { return human(c, "corvid"); } },

      /* ---------- Marauder Expansion (Law p.24 §C.4) ---------- */
      { set: "marauder", qty: "11", name: "Extra markers", note: "9 victory points and 2 relationships: score markers with faction faces for the earlier factions, and an extra set of Underworld relationship markers for games with two Vagabonds (Marauder p.20).", img: "marauder-extra-markers.webp", w: 231, h: 320 },
      { set: "marauder", qty: "3", name: "Club items" },
      { set: "marauder", qty: "2", name: "Victory point markers", when: function (c) { return any(c, ["hundreds", "keepers"]); } },
      { set: "marauder", qty: "2", name: "Overviews", when: function (c) { return any(c, ["hundreds", "keepers"]); } },
      { set: "marauder", qty: "4", name: "Relationship markers", when: vbH },
      { set: "marauder", qty: "10", name: "Faction setup", note: "Faction setup cards for the Advanced Setup draft (Law p.23 §A.8; Marauder p.18). Militant cards have a red name with a sword; insurgent cards a grey name with no sword.", img: "marauder-setup-cards.webp", w: 320, h: 313, when: function (c) { return !!c.advCards; } },
      // Lord of the Hundreds
      { set: "marauder", qty: "20", name: "Hundreds warriors", img: "marauder-warrior-hundreds.webp", w: 121, h: 108, when: function (c) { return fac(c, "hundreds"); } },
      { set: "marauder", qty: "1", name: "Hundreds warlord", img: "marauder-warlord.webp", w: 187, h: 160, when: function (c) { return fac(c, "hundreds"); } },
      { set: "marauder", qty: "6", name: "Strongholds", note: "Hundreds buildings.", img: "marauder-stronghold.webp", w: 141, h: 140, when: function (c) { return fac(c, "hundreds"); } },
      { set: "marauder", qty: "5", name: "Mobs", note: "Hundreds tokens.", img: "marauder-mob.webp", w: 134, h: 134, when: function (c) { return fac(c, "hundreds"); } },
      { set: "marauder", qty: "8", name: "Moods", note: "Mood cards.", img: "marauder-mood.webp", w: 227, h: 279, when: function (c) { return fac(c, "hundreds"); } },
      { set: "marauder", qty: "1", name: "Mob die", when: function (c) { return fac(c, "hundreds"); } },
      { set: "marauder", qty: "1", name: "Hundreds faction board", note: "One of the 2 Marauder faction boards. Pictured: its Hoard (Marauder p.3).", img: "marauder-hoard.webp", w: 320, h: 219, when: function (c) { return human(c, "hundreds"); } },
      // Keepers in Iron
      { set: "marauder", qty: "15", name: "Keepers warriors", img: "marauder-warrior-keepers.webp", w: 114, h: 91, when: function (c) { return fac(c, "keepers"); } },
      { set: "marauder", qty: "3", name: "Waystations", note: "Keepers buildings, two-sided: each side shows the relic type you can recover there (Marauder p.7).", img: "marauder-waystation.webp", w: 320, h: 143, when: function (c) { return fac(c, "keepers"); } },
      { set: "marauder", qty: "12", name: "Relics", note: "Keepers tokens: figures, jewelry and tablets (Marauder p.7).", when: function (c) { return fac(c, "keepers"); } },
      { set: "marauder", qty: "3", name: "Faithful retainers", note: "Faithful Retainer cards.", img: "marauder-retainer.webp", w: 237, h: 320, when: function (c) { return fac(c, "keepers"); } },
      { set: "marauder", qty: "1", name: "Keepers faction board", note: "One of the 2 Marauder faction boards. Pictured: its Retinue (Marauder p.8).", img: "marauder-board-keepers.webp", w: 320, h: 47, when: function (c) { return human(c, "keepers"); } },
      // Hirelings
      { set: "marauder", qty: "4", name: "Hirelings", note: "Hireling cards: Forest Patrol, Last Dynasty, Spring Uprising and The Exile, each with a Promoted and a Demoted side (Marauder p.12).", img: "marauder-hireling-card.webp", w: 215, h: 197, when: function (c) { return !!c.hire; } },
      { set: "marauder", qty: "3", name: "Hireling markers", note: "Marked “4”, “8” and “12”, placed on those spaces of the score track (Marauder p.12).", img: "marauder-hireling-marker.webp", w: 320, h: 180, when: function (c) { return !!c.hire; } },
      { set: "marauder", qty: "12", name: "Control markers", img: "marauder-control-markers.webp", w: 193, h: 249, when: function (c) { return !!c.hire; } },
      { set: "marauder", qty: "1", name: "Control die", img: "marauder-control-die.webp", w: 300, h: 300, when: function (c) { return !!c.hire; } },
      { set: "marauder", qty: "12", name: "Patrol warriors", note: "Forest Patrol hireling.", when: function (c) { return hire(c, "patrol"); } },
      { set: "marauder", qty: "5", name: "Dynasty warriors", note: "Last Dynasty hireling.", when: function (c) { return hire(c, "dynasty"); } },
      { set: "marauder", qty: "4", name: "Uprising warriors", note: "Spring Uprising hireling.", when: function (c) { return hire(c, "uprising"); } },
      { set: "marauder", qty: "1", name: "Uprising die", note: "Spring Uprising hireling.", when: function (c) { return hire(c, "uprising"); } },
      { set: "marauder", qty: "1", name: "Exile pawn", note: "The Exile hireling.", when: function (c) { return hire(c, "exile"); } },

      /* ---------- Homeland Expansion (Law p.24 §C.5) ---------- */
      { set: "homeland", qty: "1", name: "Board (Marsh and Gorge maps)", note: "Tonight: the Marsh map side.", img: "homeland-board-marsh.webp", w: 320, h: 295, when: function (c) { return mapIs(c, "marsh"); } },
      { set: "homeland", qty: "1", name: "Board (Marsh and Gorge maps)", note: "Tonight: the Gorge map side.", img: "homeland-board-gorge.webp", w: 320, h: 295, when: function (c) { return mapIs(c, "gorge"); } },
      { set: "homeland", qty: "3", name: "Flood markers", note: "One each for a light green, a dark green and a dark brown clearing space; used on the Marsh map with fewer than 5 players (Homeland p.17).", img: "homeland-flood.webp", w: 320, h: 124, when: function (c) { return mapIs(c, "marsh") && c.p < 5; } },
      { set: "homeland", qty: "1", name: "Foxburrow", note: "Wooden landmark, with its landmark card.", img: "homeland-foxburrow.webp", w: 320, h: 204, when: function (c) { return lmIn(c, "foxburrow"); } },
      { set: "homeland", qty: "1", name: "Rabbittown", note: "Wooden landmark, with its landmark card.", img: "homeland-rabbittown.webp", w: 319, h: 224, when: function (c) { return lmIn(c, "rabbittown"); } },
      { set: "homeland", qty: "1", name: "Mousehold", note: "Wooden landmark, with its landmark card.", img: "homeland-mousehold.webp", w: 320, h: 217, when: function (c) { return lmIn(c, "mousehold"); } },
      { set: "homeland", qty: "3", name: "Landmarks", note: "Landmark cards for Foxburrow, Rabbittown and Mousehold.", when: function (c) { return lmIn(c, "foxburrow") || lmIn(c, "rabbittown") || lmIn(c, "mousehold"); } },
      { set: "homeland", qty: "28", name: "Items", note: "4 coins, 4 boots, 4 swords, 5 tea, 4 hammers, 4 bags, 3 crossbows. With the ruins below, a full extra set: with a second deck you can play two games of Root at once (Homeland p.19).", img: "homeland-items-ruins.webp", w: 257, h: 187 },
      { set: "homeland", qty: "4", name: "Ruins", note: "A full extra set of ruins (Homeland p.19).", img: "homeland-items-ruins.webp", w: 257, h: 187 },
      { set: "homeland", qty: "2", name: "Battle dice", note: "In a new colour (Homeland p.19).", img: "homeland-dice.webp", w: 320, h: 308 },
      { set: "homeland", qty: "9", name: "Reminder markers", note: "Place next to a turn phase on your board to remind you of a crafted effect or faction ability that happens then (Homeland p.19).", img: "homeland-reminder.webp", w: 260, h: 202 },
      { set: "homeland", qty: "19", name: "Updates", note: "Updated cards that replace cards from the base game, the Riverfolk Expansion and the Exiles and Partisans deck, with wording compatible with later content (Homeland p.19).", img: "homeland-update.webp", w: 237, h: 320 },
      { set: "homeland", qty: "4", name: "Clarifications" },
      { set: "homeland", qty: "3", name: "Faction setup", note: "Advanced Setup cards for the three Homeland factions; the cards for the other factions come in the Marauder Expansion (Homeland p.19).", img: "homeland-setup-card.webp", w: 238, h: 320, when: function (c) { return !!c.advCards; } },
      { set: "homeland", qty: "3", name: "Victory point markers", when: function (c) { return any(c, ["diaspora", "council", "knaves"]); } },
      { set: "homeland", qty: "3", name: "Overviews", when: function (c) { return any(c, ["diaspora", "council", "knaves"]); } },
      { set: "homeland", qty: "4", name: "Relationship markers", when: vbH },
      // Lilypad Diaspora
      { set: "homeland", qty: "20", name: "Diaspora warriors", img: "homeland-warrior-diaspora.webp", w: 107, h: 101, when: function (c) { return fac(c, "diaspora"); } },
      { set: "homeland", qty: "12", name: "Enclaves", note: "Diaspora tokens with a Peaceful and a Militant side (Homeland p.2).", img: "homeland-enclave.webp", w: 320, h: 320, when: function (c) { return fac(c, "diaspora"); } },
      { set: "homeland", qty: "14", name: "Frog cards", note: "Shuffled into the shared deck — 13 in a two-player game, where the Frog Dominance card is removed permanently (Law p.19 §16.3.3–16.3.4; Homeland p.3).", img: "homeland-frog.webp", w: 215, h: 264, when: function (c) { return fac(c, "diaspora"); } },
      { set: "homeland", qty: "1", name: "Pond placard", note: "The frog cards' discard pile (Homeland p.3).", img: "homeland-pond.webp", w: 200, h: 252, when: function (c) { return fac(c, "diaspora"); } },
      { set: "homeland", qty: "1", name: "Diaspora faction board", note: "One of the 3 Homeland faction boards.", when: function (c) { return human(c, "diaspora"); } },
      // Twilight Council
      { set: "homeland", qty: "20", name: "Council warriors", img: "homeland-warrior-council.webp", w: 121, h: 108, when: function (c) { return fac(c, "council"); } },
      { set: "homeland", qty: "6", name: "Assemblies", note: "Council tokens with a Closed and a Governing side (Homeland p.8).", img: "homeland-assembly.webp", w: 320, h: 319, when: function (c) { return fac(c, "council"); } },
      { set: "homeland", qty: "1", name: "Council faction board", note: "One of the 3 Homeland faction boards.", when: function (c) { return human(c, "council"); } },
      // Knaves of the Deepwood
      { set: "homeland", qty: "10", name: "Knave Skunks", note: "Skunk warriors.", img: "homeland-skunks.webp", w: 267, h: 208, when: function (c) { return fac(c, "knaves"); } },
      { set: "homeland", qty: "8", name: "Acclaim", note: "Acclaim tokens.", img: "homeland-acclaim.webp", w: 291, h: 307, when: function (c) { return fac(c, "knaves"); } },
      { set: "homeland", qty: "12", name: "Captains", note: "Captain cards.", img: "homeland-captain-card.webp", w: 228, h: 320, when: function (c) { return fac(c, "knaves"); } },
      { set: "homeland", qty: "3", name: "Vagabond / Knave Captains (Jailor, Gladiator, Cheat)", note: "Wooden pieces: Captain warriors for the Knaves, or Vagabond pawns. The other Captains use the matching Vagabond pawns (Homeland p.15).", img: "homeland-captains.webp", w: 320, h: 143, when: function (c) { return fac(c, "knaves") || vb(c); } },
      { set: "homeland", qty: "1", name: "Knaves faction board", note: "One of the 3 Homeland faction boards.", when: function (c) { return human(c, "knaves"); } },
      { set: "homeland", qty: "3", name: "Vagabonds", note: "Vagabond character cards: Cheat, Gladiator and Jailor.", when: vbH },

      /* ---------- Clockwork Expansion (Law p.25 §C.6; the Law of Rootbotics) ---------- */
      { set: "clockwork", qty: "12", name: "Priority markers", note: "Placed on the clearings as the map's chart shows (Rootbotics p.2–3 §3.1); the sources print no chart for the Marsh or Gorge, so your group places them.", img: "clockwork-priority.webp", w: 320, h: 167, when: rbBot },
      { set: "clockwork", qty: "4", name: "Faction boards", note: "Mechanical Marquise 2.0, Electric Eyrie, Automated Alliance and Vagabot (Rootbotics §4–7). Pictured: the Electric Eyrie's Decree (Rootbotics p.7).", img: "clockwork-board-eyrie.webp", w: 320, h: 95, when: function (c) { return boxBots(c, CW).length > 0; } },
      { set: "clockwork", qty: "12", name: "Difficulties", note: "Difficulty cards: place the matching card by a bot on easy, challenging or nightmare (Rootbotics p.3 §3.3.1).", when: function (c) { return boxBots(c, CW).some(function (b) { return b.diff && b.diff !== "default"; }); } },
      { set: "clockwork", qty: "16", name: "Traits", note: "Trait cards: choose any number for each bot (Rootbotics p.3 §3.3.2).", when: function (c) { return boxBots(c, CW).some(function (b) { return !!b.traits; }); } },
      { set: "clockwork", qty: "3", name: "Vagabots", note: "Vagabot character cards: Thief, Tinker and Ranger (Rootbotics p.11 §7.7).", when: function (c) { return vagabots(c, VB1); } },

      /* ---------- Clockwork Expansion 2 (Law p.25 §C.7) ---------- */
      { set: "clockwork2", qty: "12", name: "Priority markers", note: "Placed on the clearings as the map's chart shows (Rootbotics p.2–3 §3.1); the sources print no chart for the Marsh or Gorge, so your group places them.", img: "clockwork-priority.webp", w: 320, h: 167, when: function (c) { return rbBot(c) && !c.has("clockwork"); } },
      { set: "clockwork2", qty: "4", name: "Faction boards", note: "Logical Lizards, Riverfolk Robots, Drillbit Duchy and Cogwheel Corvids (Rootbotics §8–11).", when: function (c) { return boxBots(c, CW2).length > 0; } },
      { set: "clockwork2", qty: "12", name: "Difficulties", note: "Difficulty cards: place the matching card by a bot on easy, challenging or nightmare (Rootbotics p.3 §3.3.1).", when: function (c) { return boxBots(c, CW2).some(function (b) { return b.diff && b.diff !== "default"; }); } },
      { set: "clockwork2", qty: "20", name: "Traits", note: "Trait cards: choose any number for each bot (Rootbotics p.3 §3.3.2).", when: function (c) { return boxBots(c, CW2).some(function (b) { return !!b.traits; }); } },
      { set: "clockwork2", qty: "3", name: "Vagabots", note: "Vagabot character cards: Vagrant, Scoundrel and Arbiter (Rootbotics p.11 §7.7).", when: function (c) { return vagabots(c, VB2); } },
      { set: "clockwork2", qty: "1", name: "Interaction", when: rbBot },
      { set: "clockwork2", qty: "11", name: "Services", note: "3 Basic and 8 Advanced Services cards: how bots buy and use the Riverfolk's services (Rootbotics p.18 §9.7).", when: function (c) { return fac(c, "riverfolk") && bots(c).some(function (b) { return b.fid !== "riverfolk" && (CW.indexOf(b.type) >= 0 || CW2.indexOf(b.type) >= 0); }); } },

      /* ---------- Vagabond Pack (Law p.25 §C.11) ---------- */
      { set: "vpack", qty: "3", name: "Vagabond characters", note: "Adventurer, Harrier and Ronin.", when: vbH },
      { set: "vpack", qty: "3", name: "Items", note: "1 coins, 1 hammer, 1 boot." },
      { set: "vpack", qty: "7", name: "Vagabond pawns", note: "The Knaves can use these as unique warriors for their Captains (Homeland p.15).", when: function (c) { return vb(c) || fac(c, "knaves"); } },

      /* ---------- decks (Law p.25 §C.8–C.9) ---------- */
      { set: "epdeck", qty: "54", name: "Cards for shared deck", note: "Replaces the entire base-game shared deck (Law p.22 §A.2).", when: function (c) { return c.deck === "ep"; } },
      { set: "sddeck", qty: "54", name: "Cards for shared deck", note: "Replaces the entire base-game shared deck (Law p.22 §A.2).", when: function (c) { return c.deck === "sd"; } },

      /* ---------- Landmarks Pack (Law p.25 §C.10) ---------- */
      { set: "lpack", qty: "1", name: "Setup/Rules", note: "Setup and rules card.", when: function (c) { return !!f(c, "lmPool")("pack"); } },
      { set: "lpack", qty: "6", name: "Landmarks", note: "Landmark cards.", when: function (c) { return !!f(c, "lmPool")("pack"); } },
      { set: "lpack", qty: "4", name: "Wooden landmarks", when: function (c) { return !!f(c, "lmPool")("pack"); } },

      /* ---------- Hireling Packs (Law p.25 §C.12) ---------- */
      { set: "hpacks", qty: "3", name: "Hirelings", note: "Hireling cards.", when: hpacks },
      { set: "hpacks", qty: "3", name: "Hireling markers", when: hpacks },
      { set: "hpacks", qty: "12", name: "Control markers", when: hpacks },
      { set: "hpacks", qty: "1", name: "Control die", when: hpacks },
      { set: "hpacks", qty: "1", name: "Flotilla pawn", note: "Riverfolk Pack.", when: hpacks },
      { set: "hpacks", qty: "4", name: "Prophet warriors", note: "Riverfolk Pack.", when: hpacks },
      { set: "hpacks", qty: "4", name: "Bandit warriors", note: "Riverfolk Pack.", when: hpacks },
      { set: "hpacks", qty: "3", name: "Foothold tokens", note: "Underworld Pack.", when: hpacks },
      { set: "hpacks", qty: "8", name: "Expedition warriors", note: "Underworld Pack.", when: hpacks },
      { set: "hpacks", qty: "6", name: "Spy warriors", note: "Underworld Pack.", when: hpacks },
      { set: "hpacks", qty: "1", name: "Protector pawn", note: "Underworld Pack.", when: hpacks },
      { set: "hpacks", qty: "6", name: "Vault buildings", note: "Marauder Pack.", when: hpacks },
      { set: "hpacks", qty: "6", name: "Bearer warriors", note: "Marauder Pack.", when: hpacks },
      { set: "hpacks", qty: "6", name: "Keeper warriors", note: "Marauder Pack.", when: hpacks },
      { set: "hpacks", qty: "5", name: "Band warriors", note: "Marauder Pack.", when: hpacks },
      { set: "hpacks", qty: "4", name: "Farm buildings", note: "Homeland Pack.", when: hpacks },
      { set: "hpacks", qty: "5", name: "Lilypad tokens", note: "Homeland Pack.", when: hpacks },
      { set: "hpacks", qty: "10", name: "Frog warriors", note: "Homeland Pack.", when: hpacks },
      { set: "hpacks", qty: "8", name: "Bat warriors", note: "Homeland Pack.", when: hpacks },
      { set: "hpacks", qty: "9", name: "Duck warriors", note: "Homeland Pack.", when: hpacks }
    ]
  };
})();
