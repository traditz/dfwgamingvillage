/* =============================================================================
   Terraforming Mars — Components glossary data (standard format v1; rendered by js/comp-widget.js)
   Sources (the page's citation labels; Venus, Colonies and M&A print no page numbers, so their pages count
   from the cover, as elsewhere on this page):
     Base p.16 ("Components list", text only) · Venus p.4 ("Components", text only) · Colonies p.4
     ("Components", text only) · Turmoil back cover ("Components", text only; the PDF is image-only) ·
     H&E, A&V and U&C box wraps (the boards pictured, plus A&V's "NOTE: Includes …" line) · M&A p.1
     ("These 70 Milestone and Award tiles", pictured) · Automa A p.2 ("Components", pictured).
   Pictures are cropped from those pages; the text-only lists have none. The wrap, M&A and cube pictures
   are cropped from copies of their pages with the neighbouring live text (paragraphs, captions) removed;
   the pictures themselves are untouched. The wrap and M&A panels (set.fig, v1.1) take their Mars art's colour.
   The lists' rulebook lines
   ("1 Rules Booklet", "These rules", and MarsBot's three rulebooks) are left out.
   No components list: Prelude (its p.2 setup text names its cards, but the rulebook has no list) and
   Prelude 2, so neither has a set here.
   Items the lists print without a number ("Venus board", "Dominance marker", …) have no count.
   Gating (c = the page's context, see app.js):
     - Base game board: only while Tharsis is the chosen map. Every other map is a whole game board played
       in its place (the H&E wrap: "can be used instead of the ordinary game board"); each map box's boards
       show whenever that box is on.
     - A&V's extra material is listed with the Amazonis Planitia map (A&V wrap), so it shows only when that
       map is chosen; its optional Venus board also needs Venus Next.
     - Solo: milestones and awards aren't used (Base p.13), so the M&A tiles, Venus's Hoverlord and
       Venuphile tiles and Turmoil's Terraformer tile are hidden in the solo game. Turmoil's Terraformer tile
       is used only on the base game board, Tharsis (Turmoil p.2).
     - MarsBot components show only in the Versus MarsBot mode: its Venus Next and Colonies boards only with
       those expansions (Automa C p.2, p.4); the MarsBot corporation cards and the black and white cubes only
       with the MarsBot corporations option (Automa A p.3; Automa B p.1).
     - The books list no solo-only components.
   ============================================================================= */
window.AID_COMPONENTS = {
  sets: [
    { id: "base", name: "Terraforming Mars", src: "Base p.16" },
    { id: "venus", name: "Venus Next", src: "Venus p.4", when: (c) => c.has("venus") },
    { id: "colonies", name: "Colonies", src: "Colonies p.4", when: (c) => c.has("colonies") },
    { id: "turmoil", name: "Turmoil", src: "Turmoil back cover", when: (c) => c.has("turmoil") },
    { id: "he", name: "Hellas & Elysium", src: "H&E wrap", fig: "#53320f", when: (c) => c.has("he") },
    { id: "av", name: "Amazonis & Vastitas", src: "A&V wrap", fig: "#612e08", when: (c) => c.has("av") },
    { id: "uc", name: "Utopia & Cimmeria", src: "U&C wrap", fig: "#603106", when: (c) => c.has("uc") },
    { id: "ma", name: "Milestones & Awards", src: "M&A p.1–4", fig: "#ab6f50", when: (c) => c.has("ma") && c.mode !== "solo" },
    { id: "automa", name: "MarsBot (Automa)", src: "Automa A p.2", when: (c) => c.has("automa") && c.mode === "automa" }
  ],
  items: [
    /* ---- base game (Base p.16, "Components list") ---- */
    { set: "base", qty: "1", name: "Game board", note: "A map of the Tharsis region of Mars (Base p.4)",
      when: (c) => !c.map || c.map === "tharsis" },
    { set: "base", qty: "5", name: "Player boards" },
    { set: "base", qty: "17", name: "Corporation cards" },
    { set: "base", qty: "208", name: "Project cards" },
    { set: "base", qty: "8", name: "Reference cards" },
    { set: "base", qty: "200", name: "Player markers", note: "Transparent plastic cubes, 5 colors" },
    { set: "base", qty: "200", name: "Resource markers", note: "Opaque plastic cubes in gold, silver, and copper in different sizes" },
    { set: "base", qty: "3", name: "Game board markers", note: "Big white plastic cubes" },
    { set: "base", qty: "9", name: "Ocean tiles" },
    { set: "base", qty: "60", name: "Greenery/city tiles" },
    { set: "base", qty: "11", name: "Special tiles" },
    { set: "base", qty: "1", name: "First player marker" },

    /* ---- Venus Next (Venus p.4, "Components") ---- */
    { set: "venus", name: "Venus board" },
    { set: "venus", qty: "5", name: "Corporation cards" },
    { set: "venus", qty: "49", name: "Project cards" },
    { set: "venus", name: "Venus marker" },
    { set: "venus", name: "Hoverlord milestone tile", note: "Placed over the Milestones headline on the game board (Venus p.3)",
      when: (c) => c.mode !== "solo" },
    { set: "venus", name: "Venuphile award tile", note: "Placed over the Awards headline on the game board (Venus p.3)",
      when: (c) => c.mode !== "solo" },

    /* ---- Colonies (Colonies p.4, "Components") ---- */
    { set: "colonies", qty: "49", name: "Project cards" },
    { set: "colonies", qty: "5", name: "Corporation cards" },
    { set: "colonies", qty: "11", name: "Colony tiles" },
    { set: "colonies", name: "Reference tile" },
    { set: "colonies", name: "Trade fleets tile" },
    { set: "colonies", qty: "8", name: "Trade fleets" },
    { set: "colonies", qty: "8", name: "Colony track markers" },

    /* ---- Turmoil (back cover, "Components") ---- */
    { set: "turmoil", qty: "6", name: "Policy tiles" },
    { set: "turmoil", qty: "16", name: "Project cards" },
    { set: "turmoil", qty: "5", name: "Corporation cards" },
    { set: "turmoil", qty: "2", name: "Reference cards" },
    { set: "turmoil", qty: "31", name: "Global Event cards" },
    { set: "turmoil", qty: "14", name: "Neutral delegates" },
    { set: "turmoil", qty: "35", name: "Delegates", note: "7 in each color" },
    { set: "turmoil", name: "Dominance marker" },
    { set: "turmoil", name: "Terraformer milestone tile",
      note: "Replaces the Terraformer milestone when playing on the base game board (Tharsis): it requires only TR 26 (Turmoil p.2)",
      when: (c) => (!c.map || c.map === "tharsis") && c.mode !== "solo" },
    { set: "turmoil", name: "Terraforming Committee board" },
    { set: "turmoil", name: "Global Event board" },

    /* ---- map boxes (box wraps) ---- */
    { set: "he", qty: "2", name: "Game boards",
      note: "Hellas and Elysium: either one can be used instead of the ordinary game board",
      img: "he-boards.webp", w: 320, h: 156 },
    { set: "av", name: "Maps",
      note: "Amazonis Planitia (a larger map with longer global parameters) and Vastitas Borealis, each a new region of Mars",
      img: "av-boards.webp", w: 320, h: 154 },
    { set: "av", qty: "2", name: "Additional ocean tiles", note: "Listed with the Amazonis Planitia map",
      when: (c) => c.map === "amazonis" },
    { set: "av", qty: "13", name: "Cities/greeneries", note: "Listed with the Amazonis Planitia map",
      when: (c) => c.map === "amazonis" },
    { set: "av", qty: "1", name: "Standard project tile", note: "Listed with the Amazonis Planitia map",
      when: (c) => c.map === "amazonis" },
    { set: "av", qty: "1", name: "Optional Venus board", note: "With a longer Venus track; listed with the Amazonis Planitia map",
      when: (c) => c.map === "amazonis" && c.has("venus") },
    { set: "uc", name: "Maps", note: "Utopia Planitia and Terra Cimmeria, each a new region of Mars",
      img: "uc-boards.webp", w: 320, h: 154 },

    /* ---- Milestones & Awards (M&A p.1; the tiles are listed on p.2–4) ---- */
    { set: "ma", qty: "70", name: "Milestone and award tiles",
      note: "Choose 5 milestones and 5 awards to replace the ones printed on the game board (M&A p.1); the sheet lists 35 of each (M&A p.2–4)",
      img: "ma-tiles.webp", w: 320, h: 93 },

    /* ---- MarsBot (Automa A p.2, "Components") ---- */
    { set: "automa", qty: "1", name: "Neural Instance tile", img: "automa-neural-instance.webp", w: 108, h: 105 },
    { set: "automa", qty: "1", name: "Colonies shipping board", note: "Used with Colonies (Automa C p.4)",
      img: "automa-colonies-shipping-board.webp", w: 219, h: 320, when: (c) => c.has("colonies") },
    { set: "automa", qty: "6", name: "MarsBot boards", note: "1 for each map, double sided",
      img: "automa-marsbot-boards.webp", w: 320, h: 215 },
    { set: "automa", qty: "1", name: "MarsBot board holder", img: "automa-board-holder.webp", w: 316, h: 251 },
    { set: "automa", qty: "1", name: "Venus Next MarsBot board", note: "Used with Venus Next (Automa C p.2)",
      img: "automa-venus-board.webp", w: 320, h: 63, when: (c) => c.has("venus") },
    { set: "automa", qty: "6", name: "Black cubes", note: "Set aside only when MarsBot’s corporation mentions them (Automa B p.1)",
      img: "automa-black-cubes.webp", w: 176, h: 85, when: (c) => c.mod("mb-corps") },
    { set: "automa", qty: "6", name: "White cubes", note: "Set aside only when MarsBot’s corporation mentions them (Automa B p.1)",
      img: "automa-white-cubes.webp", w: 169, h: 83, when: (c) => c.mod("mb-corps") },
    { set: "automa", qty: "8", name: "Clear cubes", note: "One starts on the 0 space of each MarsBot track (Automa A p.3)",
      img: "automa-clear-cubes.webp", w: 241, h: 89 },
    { set: "automa", qty: "1", name: "Final scoring reference card", img: "automa-final-scoring.webp", w: 140, h: 180 },
    { set: "automa", qty: "46", name: "MarsBot corporation cards", note: "Used with the MarsBot corporations option (Automa A p.3; Automa B p.1)",
      img: "automa-corporations.webp", w: 234, h: 216, when: (c) => c.mod("mb-corps") },
    { set: "automa", qty: "6", name: "Board reference cards",
      note: "Set out the one for your map: Tharsis (Automa A p.3), or Hellas, Elysium, Terra Cimmeria, Utopia Planitia or Vastitas Borealis (Automa C p.8)",
      img: "automa-board-refs.webp", w: 300, h: 219 },
    { set: "automa", qty: "32", name: "MarsBot bonus cards", img: "automa-bonus-cards.webp", w: 212, h: 243 }
  ]
};
