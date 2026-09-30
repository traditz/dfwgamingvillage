/* =============================================================================
   Twilight Imperium 4th Edition — Components glossary data (standard v1; rendered by js/comp-widget.js)
   Sources (pictures cropped from these component pages): LtP p.4 (base game) · PoK p.7 · TE p.5 ·
   TF p.6 (Twilight's Fall). The Rules Reference and the four Twilight Codex volumes have no component list.
   Gating, from the rulebooks:
   · First game (LtP p.6, p.21): promissory notes are an advanced rule, and the six first-game factions
     don't include the Ghosts of Creuss, Nekro Virus or Naalu, so their tokens return to the box.
   · Twilight's Fall (TF p.6): its own components show only in that mode, and the standard components it
     returns to the box (strategy, action, agenda, technology and promissory cards, standard faction sheets,
     leaders, standard mechs, faction command and control tokens, breakthroughs, galactic events and the
     Thunder's Edge token) are hidden there. The one exception: in a normal Thunder's Edge game any player
     may use TF's colour-based command and control tokens instead of their faction's (TE p.6), so those two
     show there too, marked optional. TE's 74 Codex cards mix kinds TF keeps and kinds it boxes (TE p.4 lists
     them: 20 action, 3 relic, 6 exploration, 1 planet, 1 legendary, 11 leader, 2 mech, 6 promissory, 21
     technology and 3 secret objective cards), so in TF their note says which are still used.
   · Partial replacements (PoK p.6, TE p.4) are noted on the replacing component; nothing is replaced
     wholesale. TE's Prophecy of Kings cards show only with Prophecy of Kings (TE p.4).
   · TE galactic events are an optional standard-game setup choice (TE p.6), as on the setup page.
   ============================================================================= */
window.AID_COMPONENTS = (function () {
  "use strict";
  const isTF = (c) => c.mode === "twilightsfall";
  const notTF = (c) => c.mode !== "twilightsfall";
  const notFirst = (c) => c.mode !== "firstgame";
  const notTFnotFirst = (c) => c.mode !== "twilightsfall" && c.mode !== "firstgame";

  return {
    sets: [
      { id: "base", name: "Twilight Imperium: Fourth Edition (base game)", src: "LtP p.4" },
      { id: "pok", name: "Prophecy of Kings", src: "PoK p.7", when: (c) => c.has("pok") },
      { id: "te", name: "Thunder’s Edge", src: "TE p.5", when: (c) => c.has("te") },
      { id: "tf", name: "Twilight’s Fall (game mode)", src: "TF p.6", fig: "#ffffff", when: (c) => c.has("te") }
    ],
    items: [
      /* ---- base game: LtP p.4, in the page's reading order ---- */
      { set: "base", qty: "17", name: "Faction sheets", img: "base-faction-sheets.webp", w: 320, h: 228, when: notTFnotFirst },
      { set: "base", qty: "17", name: "Faction sheets", note: "The first game uses six: the Xxcha Kingdom, the Federation of Sol, the Emirates of Hacan, the Barony of Letnev, the Sardakk N’orr and the Universities of Jol-Nar (LtP p.6)", img: "base-faction-sheets.webp", w: 320, h: 228, when: (c) => c.mode === "firstgame" },
      { set: "base", qty: "6", name: "Command sheets", img: "base-command-sheets.webp", w: 320, h: 252 },
      { set: "base", qty: "51", name: "System tiles", img: "base-system-tiles.webp", w: 320, h: 274 },
      { set: "base", qty: "354", name: "Plastic units", note: "59 units in 6 colors", img: "base-plastic-units.webp", w: 320, h: 163 },
      { set: "base", qty: "8", name: "Strategy cards", img: "base-strategy-cards.webp", w: 300, h: 306, when: notTF },
      { set: "base", qty: "8", name: "Ten-sided dice", img: "base-dice.webp", w: 271, h: 159 },
      { set: "base", qty: "1", name: "Victory point track", note: "Two sides: 10 and 14 spaces (RR p.3)", img: "base-vp-track.webp", w: 320, h: 59, when: notFirst },
      { set: "base", qty: "1", name: "Victory point track", note: "The first game uses its 0–10 side (LtP p.7)", img: "base-vp-track.webp", w: 320, h: 59, when: (c) => c.mode === "firstgame" },
      { set: "base", qty: "59", name: "Planet cards", img: "base-planet-cards.webp", w: 275, h: 237 },
      { set: "base", qty: "40", name: "Objective cards", img: "base-objective-cards.webp", w: 275, h: 237 },
      { set: "base", qty: "80", name: "Action cards", img: "base-action-cards.webp", w: 273, h: 237, when: notTF },
      { set: "base", qty: "50", name: "Agenda cards", img: "base-agenda-cards.webp", w: 273, h: 238, when: notTF },
      { set: "base", qty: "41", name: "Promissory note cards", img: "base-promissory-notes.webp", w: 276, h: 237, when: notTFnotFirst },
      { set: "base", qty: "1", name: "Speaker token", img: "base-speaker-token.webp", w: 229, h: 142 },
      { set: "base", qty: "122", name: "Technology cards", img: "base-technology-cards.webp", w: 320, h: 160, when: notTF },
      { set: "base", qty: "62", name: "Unit upgrade technology cards", img: "base-unit-upgrades.webp", w: 320, h: 169, when: notTF },
      { set: "base", qty: "2", name: "Creuss alpha/beta wormhole tokens", img: "base-creuss-wormholes.webp", w: 217, h: 183, when: notFirst },
      { set: "base", qty: "1", name: "Naalu “0” token", img: "base-naalu-token.webp", w: 166, h: 151, when: notFirst },
      { set: "base", qty: "1", name: "Custodians token", img: "base-custodians-token.webp", w: 201, h: 209, when: (c) => c.mode !== "ordinian" && c.mode !== "liberation" },
      { set: "base", qty: "1", name: "Custodians token", note: "In the Ordinian scenario it represents the Argent Flight flagship, the Coatl (Codex I p.12)", img: "base-custodians-token.webp", w: 201, h: 209, when: (c) => c.mode === "ordinian" },
      { set: "base", qty: "1", name: "Custodians token", note: "Not placed in the Liberation of Ordinian scenario (Codex IV p.18)", img: "base-custodians-token.webp", w: 201, h: 209, when: (c) => c.mode === "liberation" },
      { set: "base", qty: "2", name: "Nekro X/Y assimilator tokens", img: "base-nekro-tokens.webp", w: 161, h: 107, when: notFirst },
      { set: "base", qty: "272", name: "Command tokens", img: "base-command-tokens.webp", w: 210, h: 141, when: notTF },
      { set: "base", qty: "289", name: "Control tokens", img: "base-control-tokens.webp", w: 191, h: 117, when: notTF },
      { set: "base", qty: "48", name: "Trade good and commodity tokens", note: "Double-sided", img: "base-trade-goods.webp", w: 171, h: 157 },
      { set: "base", qty: "49", name: "Infantry tokens", img: "base-infantry-tokens.webp", w: 193, h: 131 },
      { set: "base", qty: "49", name: "Fighter tokens", img: "base-fighter-tokens.webp", w: 183, h: 129 },

      /* ---- Prophecy of Kings: PoK p.7 ---- */
      { set: "pok", qty: "7", name: "Faction sheets", img: "pok-faction-sheets.webp", w: 320, h: 226, when: notTF },
      { set: "pok", qty: "8", name: "Leader sheets", img: "pok-leader-sheets.webp", w: 320, h: 305 },
      { set: "pok", qty: "2", name: "Command sheets", img: "pok-command-sheets.webp", w: 320, h: 252 },
      { set: "pok", qty: "2", name: "Revised strategy cards", note: "Revised “Diplomacy” and “Construction”: they replace the base game’s (PoK p.6)", img: "pok-strategy-cards.webp", w: 297, h: 317, when: (c) => c.mode !== "twilightsfall" && !c.has("te") },
      { set: "pok", qty: "2", name: "Revised strategy cards", note: "Revised “Diplomacy” and “Construction”: they replace the base game’s (PoK p.6). Thunder’s Edge’s own revised “Construction” replaces this one in turn (TE p.4)", img: "pok-strategy-cards.webp", w: 297, h: 317, when: (c) => c.mode !== "twilightsfall" && c.has("te") },
      { set: "pok", qty: "118", name: "Plastic base game units", note: "59 units in 2 colors", img: "pok-plastic-units.webp", w: 320, h: 163 },
      { set: "pok", qty: "32", name: "Plastic mech units", note: "4 units in 8 colors", img: "pok-mech-units.webp", w: 293, h: 173 },
      { set: "pok", qty: "40", name: "System and hyperlane tiles", img: "pok-system-tiles.webp", w: 320, h: 182 },
      { set: "pok", qty: "40", name: "Planet cards", img: "pok-planet-cards.webp", w: 275, h: 233 },
      { set: "pok", qty: "74", name: "Exploration cards", note: "20 cultural, 20 industrial, 20 hazardous, and 14 frontier", img: "pok-exploration-cards.webp", w: 273, h: 236 },
      { set: "pok", qty: "10", name: "Relic cards", img: "pok-relic-cards.webp", w: 274, h: 236 },
      { set: "pok", qty: "20", name: "Action cards", img: "pok-action-cards.webp", w: 273, h: 236, when: notTF },
      { set: "pok", qty: "13", name: "Agenda cards", note: "13 base-game agendas are removed when playing with Prophecy of Kings (PoK p.6)", img: "pok-agenda-cards.webp", w: 274, h: 236, when: notTF },
      { set: "pok", qty: "40", name: "Objective cards", img: "pok-objective-cards.webp", w: 273, h: 236 },
      { set: "pok", qty: "24", name: "Promissory note cards", img: "pok-promissory-notes.webp", w: 275, h: 236, when: notTF },
      { set: "pok", qty: "74", name: "Leader cards", img: "pok-leader-cards.webp", w: 241, h: 245, when: (c) => c.mode !== "twilightsfall" && !c.has("te") },
      { set: "pok", qty: "74", name: "Leader cards", note: "With Thunder’s Edge, the Jol-Nar’s “Agnlan Oln” replaces their “Ta Zern” (TE p.4)", img: "pok-leader-cards.webp", w: 241, h: 245, when: (c) => c.mode !== "twilightsfall" && c.has("te") },
      { set: "pok", qty: "24", name: "Mech unit cards", img: "pok-mech-cards.webp", w: 240, h: 249, when: notTF },
      { set: "pok", qty: "4", name: "Legendary planet ability cards", img: "pok-legendary-cards.webp", w: 241, h: 247 },
      { set: "pok", qty: "128", name: "Technology cards", img: "pok-technology-cards.webp", w: 256, h: 249, when: notTF },
      { set: "pok", qty: "1", name: "Mirage planet token", img: "pok-mirage-token.webp", w: 228, h: 204 },
      { set: "pok", qty: "1", name: "Destroyed planet token", img: "pok-destroyed-planet.webp", w: 197, h: 195 },
      { set: "pok", qty: "13", name: "Attachment tokens", note: "6 generic, 4 tech, 1 DMZ, and 2 Titan", img: "pok-attachment-tokens.webp", w: 229, h: 213 },
      { set: "pok", qty: "1", name: "Ion storm token", note: "Double-sided", img: "pok-ion-storm.webp", w: 267, h: 216 },
      { set: "pok", qty: "6", name: "Dimensional tear tokens", note: "3 Cabal and 3 Nekro Virus", img: "pok-dimensional-tears.webp", w: 264, h: 213 },
      { set: "pok", qty: "4", name: "Gamma wormhole tokens", note: "3 generic and 1 Creuss", img: "pok-gamma-wormholes.webp", w: 233, h: 185 },
      { set: "pok", qty: "5", name: "Ul sleeper tokens", img: "pok-sleeper-tokens.webp", w: 131, h: 131 },
      { set: "pok", qty: "20", name: "Frontier tokens", img: "pok-frontier-tokens.webp", w: 133, h: 131 },
      { set: "pok", qty: "119", name: "Control tokens", img: "pok-control-tokens.webp", w: 192, h: 118, when: notTF },
      { set: "pok", qty: "112", name: "Command tokens", img: "pok-command-tokens.webp", w: 207, h: 138, when: notTF },
      { set: "pok", qty: "42", name: "Trade good and commodity tokens", note: "Double-sided", img: "pok-trade-goods.webp", w: 172, h: 142 },
      { set: "pok", qty: "71", name: "Infantry tokens", img: "pok-infantry-tokens.webp", w: 151, h: 137 },
      { set: "pok", qty: "71", name: "Fighter tokens", img: "pok-fighter-tokens.webp", w: 147, h: 137 },

      /* ---- Thunder's Edge: TE p.5 ---- */
      { set: "te", qty: "7", name: "Faction sheets", img: "te-faction-sheets.webp", w: 320, h: 224, when: notTF },
      { set: "te", qty: "2", name: "Revised strategy cards", note: "Revised “Construction” and “Warfare”: they replace the older versions (TE p.4)", img: "te-strategy-cards.webp", w: 297, h: 313, when: notTF },
      { set: "te", qty: "63", name: "Plastic neutral units", img: "te-neutral-units.webp", w: 320, h: 161 },
      { set: "te", qty: "1", name: "Thunder’s Edge token", note: "Two sides, expedition and planet; it starts expedition side up (TE p.6)", img: "te-thunders-edge-token.webp", w: 310, h: 320, when: notTF },
      { set: "te", qty: "33", name: "System and hyperlane tiles", note: "Use the Mecatol Rex tile that has a legendary planet icon instead of the base game’s (TE p.4)", img: "te-system-tiles.webp", w: 320, h: 191 },
      { set: "te", qty: "3", name: "Fracture system tiles", note: "Set aside at setup; they may come into play during the game (TE p.6)", img: "te-fracture-tiles.webp", w: 320, h: 243 },
      { set: "te", qty: "20", name: "Galactic event cards", note: "Optional: at setup the group may choose one or draw one at random (TE p.6)", img: "te-galactic-events.webp", w: 320, h: 202, when: (c) => c.mode === "standard" && c.has("pok") },
      { set: "te", qty: "20", name: "Galactic event cards", note: "Optional: at setup the group may choose one or draw one at random (TE p.6). Without Prophecy of Kings, remove “Cultural Exchange Program” (TE p.4)", img: "te-galactic-events.webp", w: 320, h: 202, when: (c) => c.mode === "standard" && !c.has("pok") },
      { set: "te", qty: "30", name: "Faction reference cards", note: "Thunder’s Edge’s own complete set: the Twilight Codex print-and-play versions aren’t used (TE p.4)", img: "te-faction-reference.webp", w: 320, h: 201 },
      { set: "te", qty: "43", name: "Planet cards", img: "te-planet-cards.webp", w: 275, h: 237 },
      { set: "te", qty: "31", name: "Alliance reference cards", note: "Thunder’s Edge’s own complete set: the Twilight Codex print-and-play versions aren’t used (TE p.4)", img: "te-alliance-reference.webp", w: 242, h: 247 },
      { set: "te", qty: "20", name: "Action cards", img: "te-action-cards.webp", w: 275, h: 237, when: notTF },
      { set: "te", qty: "30", name: "Breakthrough cards", img: "te-breakthrough-cards.webp", w: 244, h: 247, when: notTF },
      { set: "te", qty: "10", name: "Legendary planet ability cards", img: "te-legendary-cards.webp", w: 241, h: 247 },
      { set: "te", qty: "10", name: "Relic cards", img: "te-relic-cards.webp", w: 273, h: 237 },
      { set: "te", qty: "6", name: "Promissory note cards", img: "te-promissory-notes.webp", w: 275, h: 237, when: notTF },
      { set: "te", qty: "10", name: "Faction technology cards", img: "te-faction-technology.webp", w: 242, h: 247, when: notTF },
      { set: "te", qty: "16", name: "Faction mechanic cards", note: "5 Firmament plot cards, 5 Deepwrought ocean cards, and 6 Helios cards", img: "te-faction-mechanic-cards.webp", w: 320, h: 220 },
      { set: "te", qty: "74", name: "Codex cards", note: "Revised Twilight Codex cards: some join their decks, the rest replace matching base game and Prophecy of Kings cards. They also replace any earlier print-and-play Codex components (TE p.4)", img: "te-codex-cards.webp", w: 320, h: 198, when: (c) => c.has("pok") && notTF(c) },
      { set: "te", qty: "74", name: "Codex cards", note: "Revised Twilight Codex cards: some join their decks, the rest replace matching cards. They also replace any earlier print-and-play Codex components. Without Prophecy of Kings, remove their leaders, mechs and exploration cards (TE p.4)", img: "te-codex-cards.webp", w: 320, h: 198, when: (c) => !c.has("pok") && notTF(c) },
      { set: "te", qty: "74", name: "Codex cards", note: "Revised Twilight Codex cards (TE p.4). Twilight’s Fall uses only their relic, exploration, planet, legendary planet ability and secret objective cards: action cards, leaders, mechs, promissory notes and technologies go back in the box (TF p.6)", img: "te-codex-cards.webp", w: 320, h: 198, when: (c) => isTF(c) && c.has("pok") },
      { set: "te", qty: "74", name: "Codex cards", note: "Revised Twilight Codex cards (TE p.4). Twilight’s Fall uses only their relic, planet, legendary planet ability and secret objective cards: action cards, leaders, mechs, promissory notes and technologies go back in the box (TF p.6), and without Prophecy of Kings so do exploration cards (TE p.4)", img: "te-codex-cards.webp", w: 320, h: 198, when: (c) => isTF(c) && !c.has("pok") },
      { set: "te", qty: "24", name: "Prophecy of Kings cards", note: "19 leaders and 5 mechs; used only with Prophecy of Kings (TE p.4)", img: "te-pok-cards.webp", w: 320, h: 194, when: (c) => c.has("pok") && c.mode !== "twilightsfall" },
      { set: "te", qty: "1", name: "Reference card", img: "te-reference-card.webp", w: 251, h: 285 },
      { set: "te", qty: "1", name: "Avernus planet token", img: "te-avernus-token.webp", w: 237, h: 206 },
      { set: "te", qty: "1", name: "Nano-Forge attachment token", img: "te-nano-forge-token.webp", w: 163, h: 167 },
      { set: "te", qty: "2", name: "Empyrean void tether tokens", img: "te-void-tether-tokens.webp", w: 320, h: 120 },
      { set: "te", qty: "7", name: "Nekro Z assimilator tokens", img: "te-nekro-z-tokens.webp", w: 169, h: 117 },
      { set: "te", qty: "7", name: "Ingress tokens", img: "te-ingress-tokens.webp", w: 172, h: 160 },
      { set: "te", qty: "1", name: "Diplomacy token", note: "A player aid for simple uses of the “Diplomacy” strategy card’s primary ability (TE p.12)", img: "te-diplomacy-token.webp", w: 195, h: 186 },
      { set: "te", qty: "7", name: "Crimson breach tokens", note: "Double-sided", img: "te-breach-tokens.webp", w: 273, h: 181 },
      { set: "te", qty: "1", name: "Crimson sever token", img: "te-sever-token.webp", w: 174, h: 169 },
      { set: "te", qty: "85", name: "Control tokens", img: "te-control-tokens.webp", w: 191, h: 118, when: notTF },
      { set: "te", qty: "80", name: "Command tokens", img: "te-command-tokens.webp", w: 210, h: 141, when: notTF },
      { set: "te", qty: "7", name: "Bastion galvanize tokens", note: "The component list counts 7; the setup text gives the Last Bastion 8 (TE p.6)", img: "te-galvanize-tokens.webp", w: 264, h: 214 },
      { set: "te", qty: "6", name: "Helios tokens", note: "3 Nekro, 3 Bastion", img: "te-helios-tokens.webp", w: 197, h: 196 },
      { set: "te", qty: "5", name: "Commerce tokens", note: "Reminders of the +1 commodity value for each space station a player controls (TE p.10)", img: "te-commerce-tokens.webp", w: 231, h: 226 },

      /* ---- Twilight's Fall game mode: TF p.6 (TE box; not used in a normal game, TE p.4, except the
              colour-based command and control tokens, which any player may choose in a normal game, TE p.6) ---- */
      { set: "tf", qty: "8", name: "Twilight’s Fall faction sheets", note: "The Mahact Kings, used instead of the standard faction sheets (TF p.6–7)", img: "tf-faction-sheets.webp", w: 320, h: 226, when: (c) => isTF(c) && c.has("pok") },
      { set: "tf", qty: "8", name: "Twilight’s Fall faction sheets", note: "The Mahact Kings, used instead of the standard faction sheets. Without Prophecy of Kings, use the side without mech units (TF p.6–7)", img: "tf-faction-sheets.webp", w: 320, h: 226, when: (c) => isTF(c) && !c.has("pok") },
      { set: "tf", qty: "8", name: "Twilight’s Fall strategy cards", note: "Used instead of the standard strategy cards (TF p.8)", img: "tf-strategy-cards.webp", w: 297, h: 314, when: isTF },
      { set: "tf", qty: "10", name: "Edict cards", note: "The tyrant draws three and resolves one in the benediction phase, which replaces the agenda phase (TF p.10)", img: "tf-edict-cards.webp", w: 275, h: 237, when: isTF },
      { set: "tf", qty: "50", name: "Twilight’s Fall action cards", note: "Used instead of the standard action cards (TF p.8)", img: "tf-action-cards.webp", w: 276, h: 237, when: isTF },
      { set: "tf", qty: "1", name: "Benediction token", note: "Granted by the “Tyrannus” strategy card; its holder is the tyrant (TF p.10)", img: "tf-benediction-token.webp", w: 292, h: 172, when: isTF },
      { set: "tf", qty: "87", name: "Ability cards", img: "tf-ability-cards.webp", w: 243, h: 232, when: (c) => isTF(c) && c.has("pok") },
      { set: "tf", qty: "87", name: "Ability cards", note: "Without Prophecy of Kings, “Distant Suns”, “Fabrication” and “Dimensional Tear” aren’t used (TF p.6)", img: "tf-ability-cards.webp", w: 243, h: 232, when: (c) => isTF(c) && !c.has("pok") },
      { set: "tf", qty: "31", name: "Unit upgrade cards", img: "tf-unit-upgrade-cards.webp", w: 243, h: 232, when: (c) => isTF(c) && c.has("pok") },
      { set: "tf", qty: "31", name: "Unit upgrade cards", note: "Without Prophecy of Kings, the 3 mech unit upgrades aren’t used (TF p.6)", img: "tf-unit-upgrade-cards.webp", w: 243, h: 232, when: (c) => isTF(c) && !c.has("pok") },
      { set: "tf", qty: "31", name: "Genome cards", img: "tf-genome-cards.webp", w: 244, h: 232, when: (c) => isTF(c) && c.has("pok") },
      { set: "tf", qty: "31", name: "Genome cards", note: "Without Prophecy of Kings, “Brutal Genome” and “Curious Genome” aren’t used (TF p.6)", img: "tf-genome-cards.webp", w: 244, h: 232, when: (c) => isTF(c) && !c.has("pok") },
      { set: "tf", qty: "31", name: "Paradigm cards", img: "tf-paradigm-cards.webp", w: 241, h: 232, when: (c) => isTF(c) && c.has("pok") },
      { set: "tf", qty: "31", name: "Paradigm cards", note: "Without Prophecy of Kings, “Forge Legend” and “Opening the Eye” aren’t used (TF p.6)", img: "tf-paradigm-cards.webp", w: 241, h: 232, when: (c) => isTF(c) && !c.has("pok") },
      { set: "tf", qty: "16", name: "Twilight’s Fall faction technology cards", note: "Each King’s wavelength and antimatter technologies; there is no technology deck (TF p.10)", img: "tf-faction-technology.webp", w: 243, h: 232, when: isTF },
      { set: "tf", qty: "2", name: "Echo cards", note: "Taken by a player who uses the Ghosts of Creuss or Crimson Rebellion home system (TF p.7)", img: "tf-echo-cards.webp", w: 243, h: 232, when: isTF },
      { set: "tf", qty: "136", name: "Color-based control tokens", note: "Used instead of the faction control tokens (TF p.6–7)", img: "tf-control-tokens.webp", w: 187, h: 117, when: isTF },
      { set: "tf", qty: "136", name: "Color-based control tokens", note: "Optional in a normal game: a player may use these instead of their faction’s control tokens (TE p.6)", img: "tf-control-tokens.webp", w: 187, h: 117, when: notTF },
      { set: "tf", qty: "128", name: "Color-based command tokens", note: "Used instead of the faction command tokens (TF p.6–7)", img: "tf-command-tokens.webp", w: 210, h: 139, when: isTF },
      { set: "tf", qty: "128", name: "Color-based command tokens", note: "Optional in a normal game: a player may use these instead of their faction’s command tokens (TE p.6)", img: "tf-command-tokens.webp", w: 210, h: 139, when: notTF },
      { set: "tf", qty: "3", name: "Singularity tokens", note: "X, Y, Z", img: "tf-singularity-tokens.webp", w: 163, h: 111, when: isTF }
    ]
  };
})();
