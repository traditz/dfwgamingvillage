/* =============================================================================
   Aquatica — Components glossary data (standard format v1.1; rendered by js/comp-widget.js)
   Sources: Base rulebook p.4–5 (Game Components) · Cold Waters p.4 (New Components) ·
   Coral Reefs p.3 (New Components). Pictures cropped from those pages.
   Gating follows the rulebooks and this page's own set / mode / module ids:
   - King cards: used "in further games" (the King cards module here) and always in solo (Base p.7, p.27);
     the Turn Order Mantas module removes them (Coral Reefs p.4).
   - Goal tokens: only for Variable Goals (Base p.26, p.28), and always with Coral Reefs in Goals play,
     whose New Goals module is then required (Coral Reefs p.5–6). Never in Tribes play.
   - Tribe cards and the Tribe board: Tribes module, including Tribes Solo (Cold Waters p.6, p.12).
   - Coral Reefs' double-sided board replaces the base board (Coral Reefs p.5); in Tribes play its day side
     holds the Tribe cards itself (Coral Reefs p.6), so the Tribe board is not used.
   - Turn Order Mantas: that module only. Southern Tribes: Tribes play, and Tribes Solo with Cold Waters, whose
     Tribe decks they join (Coral Reefs p.6; Cold Waters p.12). New Goals: Goals play only.
   - Coral Reefs pictures come from p.3 with the numbered callouts removed; outside the tilted board is panel colour.
   ============================================================================= */
window.AID_COMPONENTS = {
  sets: [
    { id: "base", name: "Aquatica", src: "Base p.4–5", fig: "#d4dae5" },
    { id: "cw", name: "Cold Waters", src: "Cold Waters p.4", fig: "#e5e9f3", when: (c) => c.has("cw") },
    { id: "cr", name: "Coral Reefs", src: "Coral Reefs p.3", fig: "#d8dfe3", when: (c) => c.has("cr") }
  ],
  items: [
    { set: "base", qty: "1", name: "Game board", img: "base-board.webp", w: 320, h: 319,
      when: (c) => !c.has("cr") },
    { set: "base", qty: "4", name: "Three-layered player boards", note: "Each has five slots for the Locations you conquer or buy", img: "base-player-boards.webp", w: 320, h: 221 },
    { set: "base", qty: "56", name: "Location cards", img: "base-locations.webp", w: 320, h: 172 },
    { set: "base", qty: "8", name: "King cards", note: "Each King has a unique set of effects. Used in further games and in solo play (Base p.7, p.27)", img: "base-kings.webp", w: 320, h: 137,
      when: (c) => c.mode === "solo" || c.mod("kings") || c.mod("kingsdraft") },
    { set: "base", qty: "24", name: "Starting Character cards", note: "4 sets of 6 starting cards, each set marked by a unique symbol", img: "base-starting-characters.webp", w: 320, h: 169 },
    { set: "base", qty: "18", name: "Ocean Character cards", note: "2 identical sets of cards (Base p.6)", img: "base-ocean-characters.webp", w: 320, h: 159 },
    { set: "base", qty: "16", name: "Trained Mantas miniatures", note: "A set of 4 per player, marked with the symbol of their Starting Character cards", img: "base-trained-mantas.webp", w: 320, h: 105 },
    { set: "base", qty: "23", name: "Wild Mantas miniatures", img: "base-wild-mantas.webp", w: 320, h: 156 },
    { set: "base", qty: "5", name: "Double-sided Goal tokens", note: "Variable Goals: 4 drawn at random are placed over the Goals printed on the board (Base p.26, p.28). With Coral Reefs: shuffled with the expansions' Goal tokens, and 4 random ones (or 4 the players agree on) go on the Goal spaces of the board's night side (Coral Reefs p.6)", img: "base-goal-tokens.webp", w: 320, h: 205,
      when: (c) => c.mode !== "tribes" && (c.mod("advgoals") || c.has("cr")) },

    { set: "cw", qty: "6", name: "Starting Character cards for the 5th player", img: "cw-starting-characters.webp", w: 320, h: 167 },
    { set: "cw", qty: "4", name: "Trained Manta miniatures for the 5th player", img: "cw-trained-mantas.webp", w: 291, h: 111 },
    { set: "cw", qty: "1", name: "Three-layered player board for the 5th player", img: "cw-player-board.webp", w: 320, h: 197 },
    { set: "cw", qty: "12", name: "New Ocean Character cards", note: "2 sets each of six different Characters", img: "cw-ocean-characters.webp", w: 320, h: 143 },
    { set: "cw", qty: "14", name: "New Location cards", img: "cw-locations.webp", w: 320, h: 170 },
    { set: "cw", qty: "6", name: "New Wild Manta miniatures", img: "cw-wild-mantas.webp", w: 320, h: 81 },
    { set: "cw", qty: "3", name: "New King cards", img: "cw-kings.webp", w: 320, h: 149,
      when: (c) => c.mode === "solo" || c.mod("kings") || c.mod("kingsdraft") },
    { set: "cw", qty: "2", name: "New double-sided Goal tokens", note: "Can be combined with the base game's Goal tokens (Cold Waters p.11)", img: "cw-goal-tokens.webp", w: 221, h: 169,
      when: (c) => c.mode !== "tribes" && (c.mod("advgoals") || c.has("cr")) },
    { set: "cw", qty: "20", name: "Tribe cards", note: "Tribes module: two decks, with I and II on the back (Cold Waters p.6, p.9)", img: "cw-tribe-cards.webp", w: 320, h: 111,
      when: (c) => c.mode === "tribes" || c.mode === "solo" },
    { set: "cw", qty: "1", name: "Tribe board", note: "Tribes module: placed over the Goal tracks (Cold Waters p.6)", img: "cw-tribe-board.webp", w: 320, h: 93,
      when: (c) => (c.mode === "tribes" || c.mode === "solo") && !c.has("cr") },

    { set: "cr", qty: "5", name: "Medusa Arcadio Starting Character cards", note: "1 for each player", img: "cr-medusa-arcadio.webp", w: 239, h: 209 },
    { set: "cr", qty: "5", name: "Trained +1 coin / +1 power Mantas", note: "1 for each player", img: "cr-trained-mantas.webp", w: 320, h: 63 },
    { set: "cr", qty: "5", name: "Turn Order Mantas", note: "Turn Order Mantas module: all King cards are removed (Coral Reefs p.4)", img: "cr-turn-order-mantas.webp", w: 320, h: 69,
      when: (c) => c.mod("turnorder") },
    { set: "cr", qty: "1", name: "Double-sided game board", note: "Replaces the base game's board: night side for Goals play, day side for Tribes play, with spaces for the Tribe cards (Coral Reefs p.5–6)", img: "cr-board.webp", w: 320, h: 271 },
    { set: "cr", qty: "22", name: "New Ocean Character cards", img: "cr-ocean-characters.webp", w: 320, h: 66 },
    { set: "cr", qty: "30", name: "Reef tokens", img: "cr-reef-tokens.webp", w: 320, h: 86 },
    { set: "cr", qty: "70", name: "Coral miniatures", img: "cr-corals.webp", w: 320, h: 216 },
    { set: "cr", qty: "8", name: "New Tribe cards", note: "Southern Tribes module: 4 Tribe I and 4 Tribe II cards (Coral Reefs p.12); with Cold Waters they join its I and II Tribe decks (Coral Reefs p.6)", img: "cr-tribe-cards.webp", w: 320, h: 56,
      when: (c) => c.mode === "tribes" || (c.mode === "solo" && c.has("cw")) },
    { set: "cr", qty: "5", name: "New Goal tokens", note: "New Goals module, required with Coral Reefs when playing with Goals (Coral Reefs p.5, p.13)", img: "cr-goal-tokens.webp", w: 258, h: 157,
      when: (c) => c.mode !== "tribes" }
  ]
};
