/* =============================================================================
   Vast: The Crystal Caverns — Rules Reference sections
   Every section: { title, when(c), html(c), src(c) }. Sources as in data.js; FAQ = PDF page numbers.
   ============================================================================= */
(function () {
  const L = VC.list;
  const has = (c, ...ids) => ids.some((r) => c.has(r));
  /* No Goblins player: what the Dragon can still "eat" (FAQ p.15 · Ghoul p.3, p.6 · Unicorn p.3, p.6) */
  const slitherLine = (c) => {
    const e = [has(c, "ghoul") ? "Ghoul" : "", has(c, "vileghoul") ? "Vile Ghoul" : "", has(c, "unicorn") ? "Nightmare Unicorn" : "", c.v.shadow ? "Shadow Unicorn" : ""].filter(Boolean);
    const cites = VC.cite([has(c, "ghoul", "vileghoul") ? "Ghoul p.3" + (has(c, "vileghoul") ? ", p.6" : "") : "", has(c, "unicorn") ? "Unicorn p.3" : "", c.v.shadow ? "Unicorn p.6" : ""]);
    return "No Goblins player: Claw, Scratch and Hiss can't eat Goblins (FAQ p.15)" + (e.length ? ", except that Claw on the " + e.join(" or ") + " counts as eating 1 Goblin and Scratch as eating 3 (" + cites + ")" : "") +
      ". Use <b>Slither</b> to move Hunger cubes to Greed or Pride" + (e.length ? " when you can't fill Hunger that way" : "") + ".";
  };
  const tbl = (head, rows, cls) => "<div class='tbl-wrap'><table" + (cls ? " class='" + cls + "'" : "") + "><thead><tr>" + head.map((h) => "<th>" + h + "</th>").join("") + "</tr></thead><tbody>" +
    rows.map((r) => "<tr>" + r.map((x) => "<td>" + x + "</td>").join("") + "</tr>").join("") + "</tbody></table></div>";

  VC.reference = [
    /* ------------------------------------------------------------------ */
    { title: "How a game flows",
      when: () => true,
      html: (c) => {
        const order = c.v.valid ? c.v.players.map((r, i) => (i + 1) + ". " + VC.role[r].short).join(" → ") + (c.v.shadow ? " → Shadow Unicorn" : "") : "Knight → Goblins → Dragon → Cave → Thief";
        return "<h4>Objectives</h4>" + L([
          "<b>Knight</b>: kill the Dragon (or the Nightmare Unicorn when he replaces the Dragon; with neither: smash Crystals and escape).",
          "<b>Goblins</b>: kill the Knight (no Knight: kill the Dragon, or the Nightmare Unicorn in his place; neither: smash Crystals).",
          "<b>Dragon</b>: wake up and escape the Cave.",
          "<b>Cave</b>: fully expand, then collapse and bury everyone.",
          "<b>Thief</b>: collect and stash treasures.",
          has(c, "ghoul") ? "<b>Ghoul</b>: build Fury, then escape." : "",
          has(c, "vileghoul") ? "<b>Vile Ghoul</b>: kill the Knight (or the Dragon; or smash Crystals and escape)." : "",
          has(c, "unicorn") ? "<b>Nightmare Unicorn</b>: gain Radiance, then escape." : "",
          has(c, "ghost") ? "<b>Ghost</b>: lock Artifacts onto Ghost tiles, then escape." : "",
          has(c, "caveghost") ? "<b>Cave Ghost</b>: collapse the Cave, like the Cave." : ""
        ]) +
        "<h4>Turn order</h4><p>" + order + "</p>" + L([
          "Turn order always follows the number in the upper-right of each player board, lowest first, even if you sit out of order (FAQ p.2).",
          "Each role has its own turn structure — see its section below."
        ]) +
        "<h4>The Cave grows, then collapses</h4>" + L([
          "<b>Growing:</b> " + (c.v.noCave ? "with no Cave player, each player places tiles at the end of their own turn (see <i>The Collapse and removing tiles</i>)." : "the " + (c.has("caveghost") ? "Cave Ghost" : "Cave") + " places 1 tile in Shape the Cave each turn, and fills every open edge as tiles are revealed."),
          "<b>The Collapse</b> begins on the turn immediately after the last Cave tile is placed (FAQ p.3). From then on, open edges are never filled and tiles are removed instead of placed.",
          "<b>The game ends</b> the moment a player meets their victory condition, or when the Collapse has removed " + (c.v.valid && !c.v.noCave ? VC.num.caveCrystals(c) : 5) + " Crystal tiles" + (c.v.valid && !c.v.noCave && VC.num.caveHatred(c) ? " <i>and</i> all " + VC.num.caveHatred(c) + " Hatred tokens are gone (leftover Hatred tokens don't stop the Collapse from starting, but the " + (c.has("caveghost") ? "Cave Ghost" : "Cave") + " can't win until they're removed — FAQ p.21)" : "") + ": the " + (c.has("caveghost") ? "Cave Ghost" : "Cave") + " wins" + (c.v.noCave ? " — with no Cave player, everyone loses" : "") + "."
        ]) +
        "<h4>Public information</h4>" + L([
          "Everything is public except: Sidequest cards in the Knight's hand, Secrets cards in the Goblins' hand, Power cards in the Dragon's hand, Cave tiles in the Cave's hand, and anything facedown or unrevealed (cards in decks, the Lit undersides of Dark tiles).",
          "Components are limited to the quantities in the box — never use proxies.",
          "Rules disagreements: a variant beats the standard rules; a card or ability (Dragon powers, Cave omens…) beats both."
        ]);
      },
      src: (c) => VC.cite(["Rules p.2, p.4–6, p.8", "FAQ p.2–3" + (c.v.valid && !c.v.noCave && VC.num.caveHatred(c) ? ", p.21" : ""), c.v.valid && !c.v.noCave && VC.num.caveHatred(c) ? (c.has("caveghost") ? "Ghost p.7" : "Rules p.19") : "", has(c, "ghoul", "vileghoul") ? "Ghoul p.2, p.6" : "", has(c, "unicorn") ? "Unicorn p.2, p.4" : "", c.v.shadow ? "Unicorn p.5" : "", has(c, "ghost", "caveghost") ? "Ghost p.2, p.6" : ""]) },

    /* ------------------------------------------------------------------ */
    { title: "The map: tiles, revealing and visibility",
      when: () => true,
      html: (c) => "<h4>Cave tiles</h4>" + L([
          "Every Cave tile has a <b>Dark side</b> (a Goblin Tribe symbol: Fangs, Bones or Eye) and a <b>Lit side</b> (a piece of the Cave, with walls).",
          "52 Cave tiles: <b>15 Ambush</b>, <b>9 Crystal</b>, <b>15 Event</b>, <b>6 Treasure Room</b>, <b>6 Vault</b> and the <b>Entrance</b>." + (has(c, "ghost", "caveghost") ? " Plus <b>6 Ghost tiles</b> (Fearsome Foes): their Lit side shows an Ambush, Event or Treasure symbol and the Ghost symbol." : ""),
          "<b>Adjacent</b> = the 4 tiles touching in the cardinal directions. <b>Surrounding</b> = all 8, diagonals included. Count distances orthogonally, never diagonally."
        ]) +
        "<h4>Revealing a Dark tile — before anything else</h4><ol>" +
        "<li><b>Orient it</b> as you choose, but at least one open edge must connect back to the Entrance through open edges (through Lit tiles), if possible. If not possible, orient it any legal way. Revealing several at once: reveal and place them one at a time, in the order you choose.</li>" +
        "<li><b>Fill its new open edges</b> with Dark tiles — from the Cave player's hand, or (no Cave player) drawn from the stack by the player who created the open edges. Once the Collapse has begun, open edges are never filled.</li>" +
        "<li>Then resolve the effects of revealing (see each role), and carry on.</li></ol>" +
        L(["Before the Collapse, open edges on Lit tiles are <b>always</b> filled immediately, however the tile was revealed and whoever revealed it (FAQ p.3).",
          (has(c, "knight", "unicorn") ? "Your role may add placement rules (" + [c.has("knight") ? "the Knight" : "", c.has("unicorn") ? "the Nightmare Unicorn" : ""].filter(Boolean).join(" and ") + " must connect a tile revealed by entering it to the tile entered from). " : "Some roles add their own placement rules. ") + "If a role's placement rules conflict with these steps, follow the role's; if you can satisfy both, you must (Rules p.4)."]) +
        "<h4>Glossary</h4>" + L([
          "<b>Open edge</b>: an edge without a wall on a Lit tile. <b>Open space</b>: a square with no tile.",
          "<b>Space</b>: any tile-sized square, on or around the map. Each Cave tile is one space; Terrain tiles (except Pits) hold several.",
          "<b>The map</b>: the connected Cave and Terrain tiles in play — not tiles in hand, in the stack or in the box.",
          "<b>Impassable</b>: blocks movement into the space, except with an exception (Ancient Map, Climb).",
          "<b>Unoccupied</b>: no player pieces or tokens.",
          "<b>Visible</b>: a straight cardinal line between two objects that passes through no walls, Dark tiles or open spaces. Objects on a Dark tile can still be visible."
        ]),
      src: (c) => VC.cite(["Rules p.2, p.4–5, p.23", has(c, "knight") ? "Rules p.6" : "", "FAQ p.3", has(c, "unicorn") ? "Unicorn p.2" : "", has(c, "ghost", "caveghost") ? "Ghost p.4, p.7" : ""]) },

    /* ------------------------------------------------------------------ */
    { title: "The Collapse and removing tiles",
      when: () => true,
      html: (c) => {
        const tr = c.v.valid ? VC.tileRule(c) : null;
        const hh = c.v.valid && !c.v.noCave ? VC.num.caveHatred(c) : 0, cv = has(c, "caveghost") ? "Cave Ghost" : "Cave";
        const gs = c.v.valid && c.v.ghostMode === "solo" && !c.v.shadow && c.opt.hSolo !== "easy" ? c.opt.hSolo : "";
        return "<h4>When it starts</h4>" + L([
          "Once every Cave tile is on the map, the Collapse begins on the very next turn.",
          "If tiles are removed by an ability on the same turn the last tile was placed, the non-Crystal ones go back into the stack; if they aren't placed again that turn, the Collapse doesn't begin on the next player's turn (FAQ p.3).",
          c.v.noCave ? "" : "The Cave flips its Reference card over when the last tile is placed."
        ]) +
        "<h4>During the Collapse</h4>" + L([
          "Open edges are never filled.",
          c.v.noCave ? "No Cave player: tiles are removed at the end of each player's turn — see below." : "In Shape the Cave, the " + (c.has("caveghost") ? "Cave Ghost" : "Cave") + " <b>removes 3 tiles</b> instead of placing one.",
          "<b>Which tiles:</b> first tiles that touch only one tile, then tiles that touch only two. Among eligible tiles the remover chooses — but a revealed Crystal tile that can be removed must be removed first. A removed Dark tile is revealed to see if it's a Crystal tile.",
          "The <b>Entrance</b> tile can never be removed.",
          "Tokens on a removed tile go back to their owners (Bomb tokens to the box). Crystal tokens removed in the Collapse count toward nobody's victory.",
          "A player piece on a removed tile is moved off by the player removing the tile (Forced Movement). If it can't legally leave, that tile isn't removed — take the next eligible one (FAQ p.3).",
          has(c, "ghost") ? "Ghost tiles <b>without</b> a locked Artifact can't be collapsed (take the next eligible tile); with one, they collapse normally and the Artifact still counts." : "",
          "<b>" + (c.v.valid && !c.v.noCave ? VC.num.caveCrystals(c) : 5) + " Crystal tiles" + (hh ? " and all " + hh + " Hatred tokens" : "") + " removed</b>: the Cave collapses and the game ends" + (c.v.noCave ? " — everyone loses" : " — the " + cv + " wins") + "." + (hh ? " Leftover Hatred tokens don't stop the Collapse starting, but the " + cv + " can't win until they're gone, even past 5 Crystal tiles (FAQ p.21)." : "") +
            (gs ? " Ghost solo (" + (gs === "medium" ? "Medium" : "Hard") + "): you also lose if " + (gs === "medium" ? "2 Ghost tiles" : "any Ghost tile") + " collapse (Ghost p.5)." : "")
        ]) +
        (tr ? "<h4>End of each turn (no Cave player)</h4>" + tr.html : "") +
        "<h4>Cave-In and Wrath</h4>" + L([
          "The Goblins' <i>Cave-In</i> Secrets card removes tiles anywhere, except the Entrance, tiles occupied by other players, tiles with unsmashed Crystal tokens, and tiles whose rules prevent removal; the exposed-edge rule doesn't apply (FAQ p.12). The Dragon's <i>Wrath</i> removes every tile it affects.",
          "<b>Before the Collapse:</b> Crystal tiles removed this way leave the game and count toward the Cave's victory; the others are shuffled onto the bottom of the stack. Reconnect the map, then fill open edges." + (has(c, "caveghost") ? " Cave Ghost: a removed Ghost tile returns to her supply, not to the stack (Ghost p.7)." : ""),
          "<b>During the Collapse:</b> removed tiles leave the game; no edges are filled."
        ]) +
        "<h4>Connecting the map</h4>" + L([
          "Only when the map splits into separate sections — never to close holes in a connected map (FAQ p.3).",
          "The player who split it slides one section in one cardinal direction until a tile edge touches the rest; repeat for other sections; <i>then</i> fill open edges."
        ]);
      },
      src: (c) => { const hh = c.v.valid && !c.v.noCave ? VC.num.caveHatred(c) : 0; return VC.cite(["Rules p.4, p.12, p.22", "FAQ p.3, p.12", c.v.valid && c.v.noCave ? VC.tileRule(c).src : "", has(c, "ghost") ? "Ghost p.4" : "", has(c, "caveghost") ? "Ghost p.7" : "",
        hh ? (has(c, "caveghost") ? "Ghost p.7" : "Rules p.19") : "", hh ? "FAQ p.21" : "", c.v.valid && c.v.ghostMode === "solo" && !c.v.shadow && c.opt.hSolo !== "easy" ? "Ghost p.5" : ""]); } },

    /* ------------------------------------------------------------------ */
    { title: "Forced movement (errata)",
      when: () => true,
      html: (c) => L([
          "Applies only when a piece is moved by <b>another</b> player, or forced off a removed tile. Your own voluntary movement follows your role's rules (FAQ p.4). These rules replace all older rules and abilities that force player pieces to move (including, but not limited to, Wisp, Claw, Slap, Giant Bats and the Collapse).",
          "When a piece must leave a tile that is being removed (the Collapse, Wrath), the player removing the tile moves it the <b>shortest distance</b> to a legal space and picks between equal options (FAQ p.4). Abilities that move another player's piece (Wisp, Claw, Slap, Giant Bats…) move it as the ability says, within the limits below.",
          "Several pieces at once (e.g. Wrath): move them one at a time in turn order, starting with the Knight."
        ]) + "<h4>What can't go where</h4>" + L([
          "Nothing can be moved onto open spaces.",
          has(c, "knight") ? "<b>Knight</b>: not through walls, onto Dark tiles or onto spaces with other players. Entering a space with an Event token, she stops; she must resolve it as an Encounter before moving on her next turn — unless another effect moves her away first." : "",
          has(c, "goblins") ? "<b>Goblin Tribes</b>: not through walls or onto spaces with other players; they lose no Population for tiles left when forced to move." : "",
          has(c, "dragon") ? "<b>Dragon</b>: underground, not onto spaces with other players; surfaced, also not through walls or onto Dark tiles." : "",
          has(c, "thief") ? "<b>Thief</b>: not through walls or onto spaces with other players." : "",
          has(c, "ghoul", "vileghoul") ? "<b>[Vile] Ghoul</b>: not through walls or onto spaces with other players." : "",
          has(c, "unicorn") ? "<b>Nightmare Unicorn</b>: when forced to move (not Teleport), not through walls, onto Dark tiles or onto spaces with other players; if collapsing tiles would force him to move, he is forced to Teleport instead." : "",
          has(c, "ghost") ? "<b>Ghost</b>: not onto spaces holding Artifacts. A removed tile's non-locked Artifact is moved by the remover to an adjacent space without the Ghost, never through a wall." : "",
          "<b>Treasure tokens and Dragon Gems</b>: not through walls; they may pass through spaces with player pieces but can't end there.",
          "<b>Crystal, Event, Bomb, Vault, Rockslide and Flame Wall tokens</b> can't be moved.",
          "Effects of entering a space (Terrain, a Flame Wall) still apply when moved by another player.",
          c.v.inf ? "Goblin Infestation: a space with a Monster token counts as occupied by a player; Monster tokens can't be moved." : ""
        ]),
      src: (c) => VC.cite(["Rules p.4–5, p.23", "FAQ p.4", has(c, "ghoul", "vileghoul") ? "Ghoul p.4" : "", has(c, "unicorn") ? "Unicorn p.4" : "", has(c, "ghost") ? "Ghost p.4" : ""]) },

    /* ------------------------------------------------------------------ */
    { title: "Attacks — what counts, and who must interact",
      when: () => true,
      html: (c) => "<h4>These are attacks</h4>" + L([
          has(c, "knight") ? "The Knight Encountering an opposing player (or a Crystal) on her space." : "",
          has(c, "goblins") ? "The Goblins' Attack action (including the <i>Hiding Spots</i> Secrets card), and a Goblin Ambush on the Knight." : "",
          has(c, "dragon") ? "The Dragon's Claw or Scratch." : "",
          has(c, "thief") ? "The Thief's Pickpocket or Backstab (also with the Hand Crossbow)." : "",
          has(c, "ghoul", "vileghoul") ? "The [Vile] Ghoul attacking another player (or a Crystal) on its space." : "",
          has(c, "unicorn") || c.v.shadow ? "The Nightmare or Shadow Unicorn attacking another player (not a Crystal) by entering its space." : ""
        ]) + "<h4>These are not attacks</h4>" + L([
          "Taking a Treasure token or Dragon Gem from the map; any harm from a trapped Dragon Gem; entering a Flame Wall for any reason.",
          has(c, "knight") ? "The Knight's Bow or Enchanted Bow." : "",
          has(c, "goblins") ? "The Goblins' <i>Hex</i> or <i>Cave-In</i>." : "",
          has(c, "dragon") ? "The Dragon's Hiss, Slap, Flame Wall or Wrath." : "",
          has(c, "cave") ? "The Cave's Soporific Spores or Giant Bats." : "",
          has(c, "unicorn") ? "The Nightmare Unicorn marking a Crystal tile." : ""
        ]) + "<h4>Entering another player's space (guide)</h4>" + L([
          has(c, "knight") ? "<b>Knight</b>: must interact with Goblins, the surfaced Dragon, Unicorns and Ghouls — her Strength must be higher (or equal, for the Dragon and Unicorns) to enter. May ignore the underground Dragon, the Thief and Ghosts." : "",
          has(c, "goblins") ? "<b>Goblins</b>: must interact with the Knight, Unicorns and Ghouls (Strength must be higher to enter). May interact with the Dragon or pass through (Strength must beat his Armor to enter). May ignore the Thief and Ghosts." : "",
          has(c, "dragon") ? "<b>Dragon</b>: underground, may ignore everyone. Surfaced, must interact with the Knight, Goblins (Ash Dragon only), Unicorns and Ghouls; may ignore the Thief and Ghosts." : "",
          has(c, "thief") ? "<b>Thief</b>: may ignore all other players." : "",
          has(c, "unicorn") || c.v.shadow ? "<b>Unicorns</b>: must interact with the Knight, Goblins, Dragon, Thief and Ghouls; ignore Ghosts." : "",
          has(c, "ghoul", "vileghoul") ? "<b>[Vile] Ghoul</b>: may spend +1 movement to enter a space with the Knight, Goblins, Dragon, Unicorns or Thief without interacting; otherwise it must interact. Its Attack must be higher to attack. Ignores Ghosts." : "",
          has(c, "ghost", "caveghost") ? "<b>Ghost and Cave Ghost</b>: may ignore all other players." : ""
        ]) + "<p class='inline-note'>A guide only: abilities and effects can make exceptions (FAQ p.6).</p>",
      src: () => "FAQ p.5–6" },

    /* ------------------------------------------------------------------ */
    { title: "The Dragon die",
      when: () => true,
      html: (c) => L([
        "The <b>center</b> mark is the roller's own space; the other 8 marks are the surrounding spaces.",
        "Apply the effect to every <b>white</b> space on the rolled face — except open spaces with no tile, even if the effect adds tiles there.",
        "An effect that needs “the center tile affected” happens on any of the <b>three</b> faces that show the center mark.",
        "Effects that apply to all affected tiles use only the tiles present when the die was rolled.",
        "Used for: the Dragon's Claw, Flame and Wrath; trapped Dragon Gems (everyone); the Knight attacking the Dragon" + (has(c, "unicorn") || c.v.shadow ? " or a Unicorn" : "") + " at equal Strength; the Thief looting a Gem with 1 cube."
      ]),
      src: (c) => VC.cite(["Rules p.5, p.7, p.10–11, p.14", has(c, "unicorn") || c.v.shadow ? "Unicorn p.3, p.6" : ""]) },

    /* ================================================================== */
    { title: "The Knight",
      when: (c) => c.has("knight"),
      html: (c) => "<h4>Statistics</h4>" + L([
          "<b>Movement</b>: tiles you can move (track 1 / 3 / 5 / 7). <b>Perception</b>: Encounters you can have, and your defense against the Thief (1 / 2 / 3 / 4). <b>Strength</b>: which attacks you can make, and your defense outside your turn (1 / 2 / 3 / 4).",
          "All three start at 1 at the start of every turn (the leftmost icon spaces only show your base stats)."
        ]) +
        "<h4>Your turn</h4><ol><li><b>Pick Up Hero Cubes</b>: take every cube on your board except those on the Grit track and discarded ones. (First turn: the 2 you set aside.)</li>" +
        "<li><b>Move and Act</b>: move up to your Movement and spend up to your Perception in Encounters, in any order — but you can only move while you have an Encounter left.</li></ol>" +
        L(["You may end your turn early. Before ending, you may still assign unused cubes to stats, equipment or Treasures that don't need an Encounter."]) +
        "<h4>Hero cubes</h4>" + L([
          "Assign them any time during your turn, not all at once. On a stat track, fill left to right from the second space; on equipment or a Treasure card, the cube activates it.",
          "Placed cubes stay until your next Pick Up. Discarded cubes go on the Discarded Hero Cubes space — only the <i>Cave Bread</i> Event brings them back.",
          "You can never drop below your 2 starting cubes: with only 2, ignore effects that would remove or discard one (e.g. <i>Poison</i>), and you can't use effects that discard one (Mighty Axe, Potion Kit, <i>Light</i>) (FAQ p.7).",
          "A cube on a Treasure that is later lost (without discarding the cube) is set aside until your next Pick Up."
        ]) +
        "<h4>An Encounter — in this order</h4><ol><li><b>Reveal and resolve a Dark tile</b> (required when you enter one).</li><li><b>Resolve attacks</b>, any order: Crystals, Dragon, Goblins, Thief.</li><li><b>Collect treasures</b>: Dragon Gems, Treasure tokens.</li></ol>" +
        L(["One Encounter can do any or all of these; everything must be on your tile.",
          "Entering a previously revealed tile you may ignore Crystal and Treasure tokens, Dragon Gems, the underground Dragon and the Thief — but you must Encounter Event tokens and Goblin Tribes there (FAQ p.7).",
          "A Treasure you left on a tile costs an Encounter to take later."]) +
        "<h4>Revealing a tile</h4>" + L([
          "Entering a Dark tile you <b>must</b> reveal it: connect it to the tile you came from (open side to open side if you came through an open side). The Cave then fills its open edges — before you resolve the tile or interact with anything on it.",
          "Resolve it, then <b>gain 1 Grit</b> (before interacting with other pieces or tokens there).",
          "<b>Event</b>: " + (c.v.noCave ? "draw and resolve an Event card." : "the Cave draws 3 Event cards and plays one on you.") + " Entering or starting your turn on an Event token: resolve it like an Event tile, then remove the token — before you move away.",
          "<b>Ambush</b>: first you may add Hero cubes to Strength; then a hidden Goblin Tribe with Strength greater than yours may attack: you lose 1 Health, the Tribe scatters, Rage −1." + (c.v.inf ? " (No Goblins player: the Goblin Infestation card resolves Ambushes; if it has you draw a Monster, you may add cubes after seeing its Strength — FAQ p.7.)" : "") + " Only when first revealed by entering it.",
          "<b>Treasure Room</b>: place a Treasure token; take it now or leave it. <b>Crystal</b>: place a Crystal token; smash it now or leave it." + (has(c, "thief") ? " <b>Vault</b>: place a Vault token (for the Thief)." : ""),
          "Tiles revealed another way (Flare, <i>Vantage Point</i>) get their tokens but don't affect you until you enter them."
        ]) +
        "<h4>Attacking</h4>" + L([
          (has(c, "dragon") ? "<b>The Dragon</b> — underground: enter his tile freely if you don't attack. Before the Collapse you can attack him only with your <b>Bomb</b>, once per turn (you must be on his space) — the Bomb only lets you attack him; it doesn't start an attack by itself, and you still need sufficient Strength to attack him (Rules p.23); during the Collapse no Bomb is needed, still once per turn. Surfaced: your Strength must be at least his Armor to enter, and you must attack; you may attack again each Encounter without moving. Strength <b>greater</b> than Armor: hit. <b>Equal</b>: roll the Dragon die — hit only if the center is affected. Each hit: −1 Health; at 0 he dies and you win." : ""),
          has(c, "unicorn") ? "<b>The Nightmare Unicorn</b> — he is never underground and no Bomb is needed: you can enter his space only if your Strength is at least his Armor, and entering it attacks him (an Encounter). Strength <b>greater</b>: the attack succeeds. <b>Equal</b>: roll the Dragon die — it succeeds only if the center is affected. " + (c.has("dragon") ? "Unless killing him is your agreed goal, your attack only forces him to Teleport (Unicorn p.3–4)." : "A successful attack costs him 1 Health; after the attack he is forced to Teleport (Unicorn p.3).") : "",
          has(c, "goblins") ? "<b>Goblin Tribes</b> — enter a revealed Tribe's tile only if your Strength is greater than the Tribe's; then you must attack it (an Encounter) and it scatters. Several Tribes there: attack them all in one Encounter." : "",
          has(c, "thief") ? "<b>The Thief</b> — enter his tile freely; to attack (an Encounter) your Perception must beat his Stealth. You kill him and gain Grit equal to his Loot Drop Level; you may take the Treasures he dropped in the same Encounter." : "",
          "<b>Crystals</b> — with Strength " + (c.v.valid ? VC.num.knightSmashStr(c) : 3) + "+ you may smash Crystal tokens on your tile: put them on your Smashed Crystals space and gain 2 Grit."
        ]) +
        "<h4>Equipment (needs a Hero cube)</h4>" + L([
          "<b>Bomb</b>: attack the underground Dragon before the Collapse (as an Encounter; uses no token), <i>or</i> place a Bomb token on a wall next to your space to remove it. Not both in one turn. Only 3 tokens, ever. A bombed wall is an open edge for everyone; if it opens onto an open space before the Collapse, fill it with a Dark tile. It stays open until the token is removed — rotating that tile removes the Bomb token from the game — or a Rockslide is placed on that edge, which makes it a wall again; the Bomb token stays with it, so if the Rockslide is later moved the edge is open again (Rules p.7 · FAQ p.9, p.17).",
          "<b>Bow</b>: shoot a visible Goblin Tribe at any range, in a cardinal line: Population −(Strength − 1); it doesn't scatter. Before, during or after moving; no Encounter.",
          "<b>Ancient Map</b> (3 cube spaces): each cube lets you move through one wall at normal Movement cost; walls on both touching edges count as one. Into a Dark tile it reveals normally (you may orient it wall to wall). Never into an open space.",
          "<b>Shield</b>: other players can't move you, and each Grit loss is reduced to 1. It must be active before the effect is revealed."
        ]) +
        "<h4>Treasure cards</h4>" + L([
          "<b>Elven Sword</b>: +1 Perception, and +1 Strength during your turn.",
          "<b>Enchanted Bow</b>: shoot the Dragon or Thief up to 5 tiles away in a cardinal line — even underground, through walls, Dark tiles and (errata) empty spaces. No Encounter. Thief: killed. Dragon: discards Power cards equal to your Strength − 1.",
          "<b>Javelin</b>: no cube needed; your next attack may target the underground Dragon at +1 Strength (still an Encounter); then remove it from the game. Not on a turn you attack him with a Bomb; once revealed it must be used on your next non-Bomb attack.",
          "<i>Revised Javelin</i> (Bonus Cards set only; its card text isn't in these books; FAQ p.10): an attack at range follows the normal rules for attacking that target in your own space, but effects that need you to be in, or to enter, the target's space can't be used. It needs no Hero cube but still uses an Encounter (you must have one left), and you may combine it with other Encounters on your space.",
          "<b>Heroic Boots</b>: +4 Movement. <b>Pixie Lantern</b>: +1 Movement and +1 Perception.",
          "<b>Mighty Axe</b>: +1 Strength during your turn; after a successful hit on the Dragon with a cube already on it, discard that cube to deal 1 more damage. Not with a Bomb attack underground (a Javelin attack is fine). If you still have enough Hero cubes after discarding it, you may put another cube on the Axe, use another Encounter to attack again, and discard that cube for extra damage again (FAQ p.10).",
          "<b>Potion Kit</b>: remove it from the game and discard its cube to regain 2 Health."
        ]) +
        "<h4>Tokens you collect</h4>" + L([
          "<b>Treasure token</b>: " + (c.v.noCave ? "draw the top Treasure card." : "the Cave draws 2 Treasure cards and gives you one (the other goes to the bottom).") + " Keep it facedown (reveal later) or decline it for <b>+5 Grit</b> (removed from the game). Deck empty: just gain 5 Grit. Several tokens: resolve each in turn.",
          has(c, "dragon") ? "<b>Dragon Gem</b>: roll the Dragon die — center affected: −2 Grit (a trap); otherwise +5 Grit. Return it to the Dragon." : ""
        ]) +
        "<h4>Sidequests</h4>" + L([
          "On your turn, reveal one whose requirements you meet: remove it from the game, gain the Grit in its corner, draw a replacement if any remain. You needn't reveal it at once, but an “it happened” requirement must happen again later. A newly drawn Sidequest you already qualify for may be revealed at once; one that needs a task done several times in a turn is revealed only when complete (FAQ p.8).",
          "An “attack” must be one you make by entering the target's tile on your turn — not a Bow shot or an Ambush.",
          "FAQ: <i>Bedecked</i> needs 2+ Treasures face up at once; <i>Cunning</i> completes just by trying to pick up a Gem; <i>Daring</i>, <i>Fearless</i> and <i>Stalwart</i> can all complete on one attack; <i>Eagle-Eyed</i> needs a shot that does damage; <i>Persistent</i> counts every smashed Crystal, whoever smashed it." + (c.v.sq ? " <b>This game:</b> Daring and Eagle-Eyed are out of the deck." : "")
        ]) +
        "<h4>Grit</h4>" + L([
          "Reaching a white space (5, 11, 18, 26, 35) gives you that Hero cube — usable this turn. Dropping below one returns a cube: an unplaced one if you can; if it must be a placed one, your turn ends immediately.",
          "Never below 0; 45+ is the cap (extra Grit is lost)."
        ]) +
        tbl(["Gain Grit", "", "Lose Grit", ""], [
          ["Reveal a Cave tile", "1", "Backstab (Thief)", "1–5"], ["Smash a Crystal", "2", "Blob (Monster)", "5"], ["Decline a Treasure", "5", "Flame Wall (Dragon)", "5"],
          ["Kill the Thief", "0–3", "Hex (Goblins)", "1–4"], ["Complete a Sidequest", "3–6", "Rats (Event)", "2"], ["Dragon Gem", "+5 / −2", "Scratch (Dragon)", "5"], ["", "", "Soporific Spores (Cave)", "5"]], "grit") +
        "<h4>Event FAQ</h4>" + L([
          "<i>Rats</i>: the Grit loss happens first, before the Grit for exploring; if it costs a placed cube, your turn ends even if the exploring Grit would win it back.",
          "<i>Cave Bread</i> (original version): gaining the top Grit cube from it means no extra cube for passing that number later.",
          "<i>Vantage Point</i>: reveals only tiles on the map when it was played."
        ]),
      src: (c) => VC.cite(["Rules p.3, p.6–7" + (c.v.noCave ? "" : ", p.13") + (c.v.valid && VC.num.knightSmashStr(c) !== 3 ? ", p.19" : "") + ", p.23", c.has("unicorn") ? "Unicorn p.3" + (c.has("dragon") ? "–4" : "") : "", "FAQ p.7–10, p.17"]) },

    /* ================================================================== */
    { title: "The Goblins",
      when: (c) => c.has("goblins"),
      html: (c) => "<h4>Tribes</h4>" + L([
          "<b>Fangs</b>: a permanent Strength disc (+1 Strength, never lost). Special action: <b>+1 Rage</b>.",
          "<b>Bones</b>: can hold <b>2 Monsters</b>. Special action: <b>draw and assign 1 Monster</b>.",
          "<b>Eye</b>: more powerful Secrets. Special action: <b>draw 1 Secrets card</b>.",
          "<b>Population</b> = Goblin discs under the piece. <b>Strength</b> = Population + Strength discs. <b>Perception</b> = Population + 1.",
          "A Tribe on your board is <b>hidden</b>: it can't be targeted and can't move" + (c.has("knight") ? ", but can <b>Ambush</b> the Knight when she reveals an Ambush tile or Ambush Event card: she may first add Hero cubes to Strength, then a hidden Tribe (lurking ones included) with Strength greater than hers may attack — she loses 1 Health, the Tribe scatters, Rage −1 (Rules p.6, p.9; FAQ p.13)." + (c.has("dragon") ? " Tribes can't Ambush the Dragon (FAQ p.13)." : "") : ". With no Knight, Ambush tiles have no effect: the Goblins can't use them to attack anyone (FAQ p.21).") + " A Tribe on the map is <b>revealed</b>. A Tribe with 0 Population can't act."
        ]) +
        "<h4>Your turn</h4><ol>" +
        "<li><b>Choose War Card</b>: if Rage is 0, raise it to 1. Draw War cards equal to your Rage, choose one, discard the rest.</li>" +
        "<li><b>Populate Tribes</b>: add Goblin discs to each Tribe as the War card shows. Spend 1 Rage per Tribe to block <i>all</i> its discs. Max 4 per Tribe: add all discs first, then if any Tribe would exceed 4, reduce them to 4 and <b>scatter one revealed Tribe</b> (any; if none is on the map, a hidden one). Only one scatter however many overpopulate. Resolve this before Monsters, Secrets or Rage from the War card.</li>" +
        "<li><b>Assign Monsters</b>: draw the War card's number of Monsters; assign to slots (Fangs 1, Bones 2, Eye 1), replacing old ones if you like; discard the rest — never keep them. Total assigned can't exceed the Bones Tribe's Population (existing ones stay if it drops).</li>" +
        "<li><b>Draw Secrets</b>: draw the War card's number. Hand limit 5, face-up cards included. Play them any time on your turn; discard after use unless the card says otherwise.</li>" +
        "<li><b>Activate Tribes</b>: each Tribe once, in any order, finishing one before the next: move, then one action.</li></ol>" +
        L(["At the end of your turn, shuffle the <b>whole War deck</b>, the chosen card included. Monster and Secrets decks are reshuffled only when they run out."]) +
        "<h4>Moving</h4>" + L([
          "Any number of tiles, Lit or Dark, never through walls.",
          "<b>−1 Population for every 2 Lit tiles exited</b> this turn (remove the disc as it leaves the second). Cumulative over the whole move, Dark tiles in between don't reset it, leaving the starting Lit tile counts, and each Lit tile counts once (FAQ p.13)."
        ]) +
        "<h4>Actions</h4>" + L([
          "<b>Attack</b>: the Knight, the Thief" + (c.v.ash ? ", the Dragon (Ash Dragon card in play)" : "") + " on your tile, or a Crystal with another Tribe. To enter the Knight's tile, Strength must beat her Strength" + (c.has("dragon") ? "; to enter the Dragon's tile, it must beat his Armor" : "") + ". <b>Knight</b>: she loses 1 Health, the Tribe scatters, Rage −1. <b>Thief</b>: always enter; Perception must beat his Stealth; he's killed, Rage −1, no scatter, then take Secrets or Rage by his Loot Drop Level." +
            (c.v.ash ? " <b>Dragon</b> (Ash Dragon): his Health −1, Rage −1, the Tribe scatters." : "") +
            (c.has("ghoul") ? " <b>Ghoul</b>: enter only if Strength beats its Defense; entering attacks it — it skitters, you <i>gain</i> 1 Rage and the Tribe doesn't scatter (Ghoul p.3)." : "") +
            (c.has("unicorn") ? " <b>Nightmare Unicorn</b>: enter only if Strength beats his Armor; entering attacks him (the Tribe scatters, Rage −1); he loses 1 Health only if killing him is your goal, then he is forced to Teleport (Unicorn p.3)." : "") +
            (c.v.shadow ? " <b>Shadow Unicorn</b>: enter only if Strength beats his Armor; entering attacks him — the Tribe scatters, Rage −1, and he loses 1 Health" + (c.v.shadow === "multi" ? " only if you are his hunter (otherwise he just Teleports)" : "") + " (Unicorn p.6" + (c.v.shadow === "multi" ? ", p.7" : "") + ")." : ""),
          "<b>Smash a Crystal</b>: two Tribes, each Strength 3+, each use Attack on it before your turn ends. Give the Crystal to the Knight (no Knight: keep it), scatter both Tribes, Rage −1 (only 1 in total).",
          "<b>Plunder</b> a Treasure token (+1 Rage; token to the Cave's supply)" + (c.has("dragon") ? " or Dragon Gem (roll the Dragon die: center = the Tribe scatters; else +1 Rage; Gem back to the Dragon). From the Dragon himself only if no Gems are on the map and Strength beats his Armor (he keeps his Gems)" : "") + ". The Tribe stays on the map.",
          "<b>Explore</b> (on a Dark tile): pick an adjacent open space; a Cave tile is placed there Dark side up" + (c.v.noCave ? " (drawn by you)" : " (by the Cave)") + "; move the Tribe onto it.",
          "<b>Reveal</b>: move the piece from your board onto any Dark tile showing its symbol — never a tile with another player's piece (errata), but another Tribe or a Treasure is fine. None on the map? Place it on an open space next to the map: it's <b>lurking</b> (still hidden" + (c.has("knight") ? ", so it can still Ambush the Knight" : "") + "; on a later turn its activation may only move it onto an adjacent tile — ending its movement there, with no action after — or Hide it; if a tile is placed under it first, it is revealed and moves normally — Rules p.9, FAQ p.13). Revealing uses the activation.",
          "<b>Hide</b>: put the piece on your board.",
          "<b>Special action</b> (revealed only; may move first): Fangs +1 Rage · Bones draw and assign 1 Monster · Eye draw 1 Secrets card."
        ]) +
        "<h4>Scatter</h4>" + L(["When a Tribe attacks, is attacked (unless stated otherwise) or drops to 0 Population: piece to your board, <b>Population −2</b>, discard its Monster (Bones with 2: discard one of your choice)."]) +
        "<h4>Rage (0–3)</h4>" + L([
          "<b>+1</b> each time a Tribe is attacked or shot by the Knight or Dragon, affected by Hiss or Soporific Spores, or hit by the Thief's Pickpocket or Backstab (+1 per Tribe hit). Also by Plunder (+1), the Fangs special action (+1), or killing the Thief (after the −1 for attacking, you may take Rage equal to his Loot Drop Level instead of Secrets — a net gain only at Level 2–3; FAQ p.14).",
          "<b>−1</b> each time a Tribe successfully attacks another player; you may also spend it in Populate Tribes." + (c.has("ghoul") ? " (Attacking the Ghoul instead <i>gains</i> 1 Rage, with no scatter — Ghoul p.3.)" : ""),
          "At <b>0 Rage: Malaise</b> — all Tribes −1 Strength until Rage rises again."
        ]) +
        "<h4>Strength discs and Monsters</h4>" + L([
          "Flame Giant, Ogre and Troll give their Tribe a Strength disc (+1). Strength discs never count as Population.",
          "FAQ: <i>Bright Beetles</i> — Claw, Scratch (or discarding it vs. Hiss) eats 1 fewer Goblin. <i>Pet Frog</i> — its Tribe won't overpopulate but can still be the one scattered. <i>Underworm</i> — the diagonal move happens all at once in one direction. <i>Wisp</i> — usable any time in the move; the Knight need only be visible at its start. The Ambush text on Monster cards and the Ogre/Troll tokens are only for games with no Goblins player."
        ]) +
        "<h4>Secrets FAQ</h4>" + L([
          "<i>Cave-In</i>: see The Collapse. <i>Goblin Ruby</i>: once face up it's discarded only when a Tribe's Population is reduced to 0. <i>Hiding Spots</i>: walls don't block it. <i>Poison</i>: the Knight regains her cubes automatically on entering the Entrance tile.",
          "<i>Trap</i>: adds to a Tribe's Strength vs. the Knight entering and its Perception vs. the Thief; not vs. Ambushes or Bow shots. Using it vs. a Dragon power is optional: the power still affects others, but no Tribe and no Goblins eaten."
        ]),
      src: (c) => VC.cite(["Rules p.3" + (c.has("knight") ? ", p.6" : "") + ", p.8–9" + (c.v.ash ? ", p.17" : "") + ", p.23", "FAQ p.6, p.11–14" + (c.has("knight") ? "" : ", p.21"), c.has("ghoul") ? "Ghoul p.3" : "", c.has("unicorn") ? "Unicorn p.3" : "", c.v.shadow ? "Unicorn p.6" : "", c.v.shadow === "multi" ? "Unicorn p.7" : ""]) },

    /* ================================================================== */
    { title: "The Dragon",
      when: (c) => c.has("dragon"),
      html: (c) => "<h4>Your turn</h4><ol>" +
        "<li><b>Move and Use Powers</b>: once per turn, a free move of 1 or 2 tiles in a straight line, before or after powers. Use any powers, any number of times, by discarding Power cards with the symbols shown. Finish each movement before using a power.</li>" +
        "<li><b>Pick Up Treasure</b> (after all movement): take Treasure tokens on your tile; give one to the Cave to satisfy <b>Greed</b>. Keep extras and give one per later turn. Once Greed is empty, extra Treasures go back to the Cave with no effect.</li>" +
        "<li><b>Place Dragon Gem</b>: you may place one of your Gems on your current tile.</li>" +
        "<li><b>Replace Hand</b>: discard your hand, shuffle all Power cards, draw cards equal to your <b>Spirit</b>.</li></ol>" +
        "<h4>Powers (cost in Power symbols; <b>?</b> = any symbol)</h4>" +
        tbl(["Power", "Cost", "Effect"], [
          ["Claw", "Claw", "Roll the Dragon die. Affected tiles: every Goblin Tribe scatters and you eat Goblins equal to the Population scattered; you may move the Knight 1 space; the Thief is killed."],
          ["Flame", "Flame", "Roll the die. Reveal affected Dark tiles (only tiles present at the roll)."],
          ["Wing", "Wing", "Move up to 2 tiles in a straight line, or 1 tile through a wall."],
          ["Hiss", "Claw + Claw", "A Goblin Tribe anywhere becomes hidden and loses 1 Population. You eat 1 Goblin."],
          ["Slither", "Claw + Flame", "Move a Sloth cube to another Sloth track with an empty space."],
          ["Swat", "Claw + Wing", "Move a Dragon Gem or Treasure token on an adjacent space by 5 spaces, in any directions."],
          ["Scorch", "Flame + Flame", "Reveal all surrounding Dark tiles (not your own)."],
          ["Burn", "Flame + Wing", "Reveal a Dark tile anywhere on the map."],
          ["Slap", "Wing + Wing", "Move the Knight, from a space adjacent to you, up to 3 spaces."],
          ["Shriek", "? + ?", "Place the Shriek token to hide this power's cost. When you roll the Dragon die, you may spend the placed Shriek token to reroll it."],
          ["Scratch", "Claw ×3", "Attack the Knight, all Goblin Tribes or the Thief on your tile: Knight −5 Grit; Tribes drop to 0 Population (you eat what they lost); Thief killed."],
          ["Flame Wall", "Flame ×3", "Place the Flame Wall token on a visible adjacent tile. Entering it: Knight −5 Grit, a Tribe −1 Population, Thief killed; you are not damaged by it. Only the first entry per player per turn (errata), not players already there. Returns at the start of your next turn."],
          ["Smash", "? ×3", "Smash a Crystal token on your tile (removed from the game)."],
          ["Wrath", "? ×4", "Roll the die. Affected tiles collapse; scatter all Goblin Tribes; move other pieces off (see FAQ below); reconnect the map if split."]
        ], "powers") +
        L([
          "Each <b>Dragon Gem</b> on the map lends its symbol once per turn (flip it to mark it spent). The Gem stays on the map.",
          "Walls never block powers. Claw, Scratch and Flame Wall ignore the Thief's Stealth. Slap and Swat need an adjacent target, wall or no wall."
        ]) +
        "<h4>Underground and surfaced</h4>" + L([
          "<b>Underground</b>: move through walls and onto Dark tiles; entering a player's tile prompts no attack (attacking or being attacked is optional).",
          "<b>Surfaced</b>: obey walls, no Dark tiles. Entering the Knight's tile when her Strength is at least your Armor resolves her attack on you" + (c.v.ash ? "; with the Ash Dragon card, so does entering the tile of a Tribe whose Strength is greater than your Armor. Ash Dragon also gives you +1 Armor (max 4) over the table below" : (has(c, "goblins") ? "; Goblin Tribes can attack you only with the Ash Dragon Variant card, so entering their tile prompts no attack" : "")) + ". The attack doesn't stop your movement (Rules p.9–11" + (c.v.ash ? ", p.17 · FAQ p.6, p.13" : " · FAQ p.6") + ").",
          "Beware: once you're surfaced, or the Collapse has begun, the Knight needs no Bomb; surfaced, she can attack you once per Encounter."
        ]) +
        "<h4>Sloth, Wakefulness and awakening</h4>" + L([
          "<b>Greed</b> (4 cubes): give the Cave 1 Treasure token. <b>Hunger</b> (4): lower Eaten Goblins by 2. <b>Pride</b>: reveal an Event tile (4), or don't move this turn (1), or place a Dragon Gem while another Gem is on the map (1).",
          "Up to <b>3 cubes per turn, 1 per track</b> — Pride counts as one track (one cube from the whole Pride section per turn). Pride's three parts don't share cubes; only Slither moves cubes between them.",
          "Armor and Spirit come from the highest Wakefulness row with a cube (the shield space takes no cube). Armor rises at once; Spirit at your next Replace Hand.",
          "At <b>" + (c.v.valid ? VC.num.wake(c) : 11) + " Wakefulness</b> you awaken" + (c.lvl("dragon") === 4 ? " (and you must have used Shriek on three separate turns)" : "") + ": swap to the Awakened piece. You never fall asleep again.",
          "<b>Surface</b> by ending your turn on a Crystal tile (smashing any Crystal token there; a smashed Crystal tile works). Awakening while on a Crystal tile surfaces you at once, in any phase.",
          "Surfaced, enter the <b>Entrance tile</b> to win.",
          has(c, "goblins") ? "" : slitherLine(c)
        ]) +
        tbl(["Wakefulness cubes", "Armor", "Spirit"], [["0–1", "1", "3"], ["2–3", "1", "4"], ["4–5", "2", "4"], ["6–7", "2", "5"], ["8–9", "3", "5"], ["10–11", "3", "6"], ["12–13", "4", "6"], ["14", "4", "7"]], "wake") +
        "<h4>Eating, killing, and your Gems</h4>" + L([
          "Claw, Scratch or Hiss on Goblins: raise Eaten Goblins by the total Population they lost. Killing the Thief with Claw or Scratch: draw Power cards equal to his Loot Drop Level.",
          has(c, "knight") ? "When the <b>Knight</b> takes a Gem: die center affected = −2 Grit, else +5 Grit." : "",
          has(c, "goblins") ? "When a <b>Tribe</b> takes a Gem: center = it scatters, else it may plunder it." : "",
          has(c, "thief") ? "When the <b>Thief</b> loots a Gem: center = he's killed (no Loot Drop for you); otherwise, or if he pays a 2nd cube, he carries it — you can still spend its symbol until he stashes it. If he dies first, the Gem drops on his tile." : "",
          "Gems taken by the Knight or a Tribe return to your supply."
        ]) +
        "<h4>Tiles revealed by your powers</h4>" + L([
          "Flip them in your order, each oriented to connect toward the Entrance if possible; then, before the Collapse, " + (has(c, "cave") ? "the Cave fills open edges" : has(c, "caveghost") ? "the Cave Ghost fills open edges" : "fill the open edges yourself with Dark tiles drawn from the top of the stack (no Cave player)") + ". Once the Collapse has begun, open edges are never filled (FAQ p.3). Flame, Scorch and Burn reveal only tiles present when you used them.",
          "Event tile: the Cave places an Event token (the Knight must Encounter it). Ambush: no attack on you — or on the Knight later. Treasure Room: a Treasure token. Crystal: a Crystal token." + (has(c, "thief") ? " Vault: a Vault token." : "")
        ]) +
        "<h4>Wrath (FAQ)</h4><ol><li>Identify every affected tile. In turn order from the Knight, move each piece on them to the nearest legal tile (Forced Movement); it may pass through affected tiles. If several tiles are equally close, you choose.</li><li>If it can't get clear, move it as close as possible; if nowhere, it stays.</li><li>Remove every affected tile except those still occupied. Tokens on them go back to their supplies.</li><li>Before the Collapse, non-Crystal tiles go to the bottom of the stack and open edges are filled; during it, removed tiles leave the game.</li></ol>" +
        L(["Flame Wall on the Entrance stops the Thief stashing: he's killed entering it (he's unharmed if he appears there at the start of his turn)."]),
      src: (c) => VC.cite(["Rules p.3, p.10–11" + (c.v.valid && c.lvl("dragon") !== 2 ? ", p.19" : "") + ", p.23", "FAQ p.3, p.6, p.14–16", c.v.ash ? "Rules p.9, p.17 · FAQ p.13" : ""]) },

    /* ================================================================== */
    { title: "The Cave",
      when: (c) => has(c, "cave", "caveghost"),
      html: (c) => (c.has("caveghost") ? "<p class='inline-note'>The Cave Ghost follows these Cave rules for tiles, Treasures, Events and the Collapse — but she can't look at the top Event cards, and her own Omen and power rules are in her section.</p>" : "") +
        (c.has("cave") ? "<h4>Your turn</h4><ol>" +
        "<li><b>Collect Omen Tokens</b> (always first): draw Omen tokens from the bag by the number of Treasure tokens plus Crystal tokens on the map (table below)" + (c.mod("crowded") && c.v.n >= 6 ? " — Crowded House, 6+ players: count one more Crystal token" : "") + ". Then spend Omens any time on your turn.</li>" +
        "<li><b>Shape the Cave</b>: place a tile from your hand, Dark side up, adjacent to any tile. <b>Crystal tiles first</b> whenever you place on your own turn. Once your hand's last tile is placed, the Collapse begins on the <b>next</b> turn (FAQ: not if tiles removed that same turn were not returned to the map that turn); from your next turn on, remove 3 tiles here instead.</li>" +
        "<li><b>Place Treasure</b>" + (c.v.ptOpt ? " (<b>optional</b> this game)" : "") + ": put a Treasure token on a Dark tile with no player piece and no Treasure token (none: skip).</li></ol>" +
        tbl(["Treasure + Crystal tokens on the map", "Omen tokens"], [["0", "1"], ["1", "2"], ["2–3", "3"], ["4–6", "4"], ["7–10", "5"], ["11+", "6"]], "omens") : "") +
        "<h4>Cave tiles</h4>" + L([
          "Keep a hand of 3; draw a replacement after <b>each</b> tile you place.",
          "Until the Collapse, every open edge must get a Dark tile from your hand, including when tiles are revealed; with several revealed at once, fill in any order. Once the Collapse begins, open edges are never filled. On other players' turns, Crystal tiles needn't go first." + (has(c, "ghost") ? " <b>Ghost in play:</b> a Ghost tile in your hand must be placed before any other tile — Crystal tiles included — even on other players' turns." : ""),
          "You may look at Dark tiles on the map any time; don't show anyone."
        ]) +
        (c.has("cave") ? "<h4>Omens</h4>" + L([
          "Pay by returning Omen tokens to the bag. Each omen accepts three of the six symbols, in any mix — even the same symbol repeatedly. Use each omen any number of times; save unused tokens.",
          "Hatred and Past Plunder cost 1, then 2, then 3 for their 1st, 2nd and 3rd use in a turn, then 3 each; the cost resets every turn.",
          "Tiles and Treasures placed by omens follow the normal placement rules (Crystal tiles first; Treasures on Dark tiles without pieces or Treasures)."
        ]) +
        tbl(["Omen", "Cost", "Effect"], [
          ["Giant Bats", "1", "Move a Treasure token, the Knight or a Goblin Tribe up to 3 spaces (nothing else — not the Dragon, Thief, Gems or other tokens)."],
          ["Rockslide", "2", "Place a Rockslide token on an edge between two tiles without walls — it becomes a wall. Not between two Dark tiles. All 3 placed: move one. Removed if either tile is rotated or removed."],
          ["Past Plunder", "1 / 2 / 3", "Place a Treasure token, following the Place Treasure rules."],
          ["Soporific Spores", "3", "Target a player: Knight −5 Grit; Goblins reduce a Tribe to 1 Population (they choose one that can be reduced); Dragon moves a Sloth cube from Wakefulness back to a Sloth track; Thief loses an upgrade (keeps the token)."],
          ["Hatred", "1 / 2 / 3", "Place a tile. During the Collapse, remove a tile instead." + (VC.num.caveHatred(c) ? " Or remove a Hatred token instead of the effect." : "")],
          ["Crystal Curse", "1", "One of: rotate a tile to any orthogonal orientation (no need to connect to the Entrance); place an Event token on an empty Event tile (even the Knight's — she must resolve it before moving); or move the top 3 Event cards to the bottom."]
        ], "omens") : "") +
        "<h4>Treasures</h4>" + L([
          has(c, "knight") ? "Knight claims a Treasure token: you draw 2 Treasure cards, give her one, put the other on the bottom. She may decline it for 5 Grit." : "",
          has(c, "goblins") ? "A Goblin Tribe claims one: Goblins +1 Rage." : "",
          has(c, "dragon") ? "The Dragon picks up any Treasure tokens on his tile after all his movement. He gives you one to move a Sloth cube from his Greed track to Wakefulness, keeps the rest and gives them to you one per later turn. Once his Greed track is empty, tokens he picks up return to you with no effect." : "",
          "Tokens claimed by the Knight or Goblins return to you at once" + (has(c, "dragon") ? "; the Dragon's return as he gives them to you" : "") + ".",
          has(c, "thief") ? "The Thief's carried tokens still count for your Omens; once stashed they don't, and can't return to the map." : "",
          "Treasure tokens are limited: " + (has(c, "thief") ? "12 with the Thief" : "10 without the Thief") + "; when all are out, no more can be placed."
        ]) +
        (has(c, "knight") ? "<h4>Events</h4>" + L([
          "When the Knight reveals an Event tile or enters an Event token's tile: draw 3 Event cards, play one on her, put the others on the bottom. Played Events leave the game; once all are gone, Event tiles and tokens are ignored.",
          c.has("cave") ? "You may look at the top 3 Event cards any time." : ""
        ]) : "") +
        "<h4>Rockslides</h4>" + L(["Revealing a Dark tile removes a Rockslide on its edge only if the tile's wall lands on that edge. A Rockslide on a Bombed wall: both stay; if the Rockslide later goes, the wall is open again. Rockslides may go on a Terrain tile's edge next to another tile."]) +
        "<h4>Collapse reminders</h4>" + L(["Remove 3 tiles per turn; track Crystal tiles removed. A piece on a removed tile is moved off by you (Forced Movement); if it can't leave, take another tile. Crystal tiles removed by Cave-In or Wrath before the Collapse also count for you."]),
      src: (c) => VC.cite(["Rules p.3, p.12–13, p.23", has(c, "dragon") ? "Rules p.10" : "", "FAQ p.3, p.16–17", has(c, "dragon") ? "FAQ p.15" : "", c.has("cave") && VC.num.caveHatred(c) ? "Rules p.19" : "", c.has("caveghost") ? "Ghost p.6" : "", c.mod("crowded") ? "Ghost p.7" : "", has(c, "ghost") ? "Ghost p.4" : ""]) },

    /* ================================================================== */
    { title: "The Thief",
      when: (c) => c.has("thief"),
      html: (c) => { const kgd = has(c, "knight", "goblins", "dragon"), gh = has(c, "ghoul", "vileghoul"); return "<h4>Your turn</h4><ol><li><b>Assign Stat Tokens</b>: put your 3 Stat tokens on Movement, Stealth and Thievery, one each; place Action cubes equal to your Thievery. They stay until your next turn.</li>" +
        "<li><b>Move and Take Actions</b>, in any order and freely mixed — you can keep doing one after the other runs out.</li></ol>" +
        L(["Your turn ends when you're out of Movement and cubes, or you stop. Remove unused Action cubes."]) +
        "<h4>Moving</h4>" + L([
          "Movement = tiles you can enter this turn: Lit, Dark, and tiles with other players. Not through walls or impassable terrain, except by Climb.",
          "Ending your movement on a Dark tile, you may peek at it and may reveal it, oriented as you like (an Ambush revealed this way never triggers — not even for the Knight later).",
          "Each carried Treasure or Gem: <b>−1 Stealth</b>. Need a Treasure from the Cave's supply and there are none? Take one from anywhere on the map."
        ]) +
        "<h4>Actions (Action cubes; repeat as often as you can pay)</h4>" +
        tbl(["Action", "Cubes", "Effect"], [
          ["Loot", "1 / 2", "Take a Treasure token or Dragon Gem on your space. 1 cube: if it's a Gem, roll the Dragon die — center affected, you're killed. 2 cubes: take the Gem safely."],
          ["Climb", "2 / 3", "2: move through a wall. 3: move through impassable terrain (not ending on it). Still costs Movement. <i>Climbing Gear</i>: −1 cube."],
          ["Pickpocket", "1 / 2 / 3", "Attack a player on your space: 1 cube succeeds on 4+, 2 on 2+, 3 automatically. <i>Sticky Fingers</i>: one reroll per turn. Success: take a Treasure token from the Cave's supply, and harm the target (below)."],
          ["Pick Lock", "1 / 2 / 3", "Open a Vault token on your space: 4+ / 2+ / automatic. Success: remove the Vault, take a Treasure token. Each Vault once per turn. <i>Lock Picking Kit</i>: −1 cube."],
          ["Backstab", "1 / 2 / 3", "Attack a player on your space: Light / Moderate / Heavy injury. <i>Hand Crossbow</i>: a visible player up to 3 spaces away (cardinal lines only)."],
          ["Hide Loot", "X", "Lower your Loot Drop Level by X."]
        ], "thief") +
        (kgd || gh ? "<h4>Pickpocket harm</h4>" + L([
          has(c, "knight") ? "<b>Knight</b>: move one of her Treasure cards (a revealed one, or a random unrevealed one) to the bottom of the deck. No Treasures: you can't target her." : "",
          has(c, "goblins") ? "<b>Goblins</b>: take 1 Secrets card — any face-up (revealed) one, or a random unrevealed one (FAQ p.18; the rulebook allowed only the Goblin Ruby face up, Rules p.14); it's discarded and you take the Treasure token. None takeable: can't target them." : "",
          has(c, "dragon") ? "<b>Dragon</b>: move 1 Sloth cube from his Wakefulness track back to Greed. No room on Greed: can't target him." : "",
          gh ? "<b>[Vile] Ghoul</b>: steal a Treasure token from its board or make it discard a Terror card (shuffled back); neither: can't target it." : ""
        ]) : "") +
        (kgd || gh ? "<h4>Backstab injuries</h4>" : "") +
        (kgd ? tbl(["Injury", has(c, "knight") ? "Knight" : "", has(c, "goblins") ? "Goblins (Tribe)" : "", has(c, "dragon") ? "Dragon" : ""].filter(Boolean),
          [["Light", "−1 Grit", "−1 Population", "discard 1 card"], ["Moderate", "−3 Grit", "−2 Population", "discard 2 cards"], ["Heavy", "−5 Grit", "−3 Population", "discard 3 cards"]]
            .map((r) => [r[0]].concat([has(c, "knight") ? r[1] : null, has(c, "goblins") ? r[2] : null, has(c, "dragon") ? r[3] : null].filter((x) => x !== null))), "inj") : "") +
        (has(c, "goblins") || gh ? L([has(c, "goblins") ? "A Backstabbed Tribe only loses Population — it scatters only at 0 — and the Goblins gain 1 Rage." : "", gh ? "A Backstabbed [Vile] Ghoul loses 1 movement point on its next turn per cube spent." : ""]) : "") +
        "<h4>Targeting and being targeted</h4>" + L([
          "You may target each other player with an action only <b>once per turn</b>, and only if your <b>Stealth beats their Perception</b> (Knight: her Perception; a Tribe: Population + 1, plus Trap if the Goblins use it). Versus the Dragon, your Stealth must beat his <b>Armor</b>." +
            (gh ? " <b>[Vile] Ghoul</b>: you may enter its space only if your Stealth beats its Defense (then you may Pickpocket or Backstab it)." : ""),
          "The Knight or Goblins need Perception greater than your Stealth to target you; the Dragon and Cave always can. <b>Any attack on you kills you.</b> Stealth 0 or less changes nothing — they still spend the Encounter or action." +
            (has(c, "ghoul") ? " The Ghoul attacks you by spending Ghoul discs equal to 1 + your Stealth." : "") + (has(c, "vileghoul") ? " The Vile Ghoul can attack you only if its Attack is greater than your Stealth." : ""),
          has(c, "unicorn") ? "<b>Nightmare Unicorn</b>: you may enter his space freely but can't Pickpocket him; you may Backstab him only by spending 3 cubes, and only if your Stealth beats his Armor (he loses 1 Health only if killing him is your goal; either way he Teleports). His attack always kills you: he draws cards equal to your Loot Drop Level + 0/1/2 by his Anger, and at 3 Anger you also lose an upgrade (keep its Treasure token)." : "",
          c.v.shadow ? "<b>Shadow Unicorn</b>: you may enter his space freely; you may Backstab him only by spending 3 cubes, and only if your Stealth beats his Armor (−1 Health" + (c.v.shadow === "multi" ? " only if killing him is your goal; otherwise he just Teleports" : "") + "). His attack always kills you." : "",
          "<b>Unnatural Evasion</b> (upgrade): the first time each turn you're attacked, roll the Action die — 4+ the attack fails and you may move 1 space. Only vs. attacks: the Knight's Encounter, the Goblins' Attack action, the Dragon's Claw or Scratch" +
            (gh ? ", the [Vile] Ghoul's attack (you move after it skitters)" : "") + (has(c, "unicorn") ? ", the Nightmare Unicorn's attack (you move 1 space, then he still Teleports but gains no Radiance)" : "") + (c.v.shadow ? ", the Shadow Unicorn's attack" : "") + " — not shots, Hex or Soporific Spores."
        ]) +
        "<h4>Carrying, stashing and upgrades</h4>" + L([
          "Carried tokens sit on your Unstashed Tokens space and still count as on the map. Enter the <b>Entrance tile</b> to stash everything you carry, after resolving any effects there (it doesn't end your turn)." + (has(c, "dragon") ? " A Flame Wall on the Entrance kills you as you enter it, so you stash nothing and drop what you carry there; appearing there at the start of your turn (after dying) doesn't harm you." : ""),
          "Stashing a Gem: return it to the Dragon and stash a Treasure token from the Cave's supply instead.",
          "Each stashed Treasure goes on an upgrade space (permanent, effective at once) and resets your <b>Loot Drop Level to 3</b>." + (c.lvl("thief") >= 3 ? " (" + VC.levels.thief[c.lvl("thief")] + ": your first " + (c.lvl("thief") === 4 ? "2 tokens skip" : "token skips") + " the upgrade spaces.)" : ""),
          "Upgrades: Sticky Fingers, Lock Picking Kit, Climbing Gear, Hand Crossbow, Unnatural Evasion, +1 Movement, +1 Stealth, +1 Thievery (stats max 5), and Flip Stat Tokens left to right: 2→3, 3→4, then ALL 4.",
          "Soporific Spores removes an upgrade's token from its space, but the token still counts toward your win."
        ]) +
        "<h4>Dying</h4>" + L([
          "Drop everything you carry on your tile (anyone may pick it up; you can Loot it back). Put your piece on your board; at the start of your next turn place it on the Entrance tile.",
          "Your killer gains a bonus by your Loot Drop Level — it does not reset when you die."
        ]) +
        (kgd ? tbl(["Loot Drop", has(c, "knight") ? "Knight" : "", has(c, "goblins") ? "Goblins" : "", has(c, "dragon") ? "Dragon" : ""].filter(Boolean),
          [["Level 3", "+3 Grit", "3 Secrets or +3 Rage", "draw 3 Power cards"], ["Level 2", "+2 Grit", "2 Secrets or +2 Rage", "draw 2"], ["Level 1", "+1 Grit", "1 Secret or +1 Rage", "draw 1"], ["Level 0", "—", "—", "—"]]
            .map((r) => [r[0]].concat([has(c, "knight") ? r[1] : null, has(c, "goblins") ? r[2] : null, has(c, "dragon") ? r[3] : null].filter((x) => x !== null))), "loot") : "") +
        (gh ? L(["Killed by the [Vile] Ghoul: it draws Terror cards equal to your Loot Drop Level (min 1), keeps one."]) : ""); },
      src: (c) => VC.cite(["Rules p.3, p.14–15, p.23", "FAQ p.5" + (has(c, "goblins") ? ", p.13" : "") + (has(c, "dragon") ? ", p.14" : "") + ", p.17–18", has(c, "ghoul", "vileghoul") ? "Ghoul p.2–4" + (has(c, "vileghoul") ? ", p.6" : "") : "", has(c, "unicorn") ? "Unicorn p.2–3" : "", c.v.shadow ? "Unicorn p.6" + (c.v.shadow === "multi" ? ", p.7" : "") : ""]) },

    /* ================================================================== */
    { title: "The Ghoul (Fearsome Foes)",
      when: (c) => c.has("ghoul"),
      html: (c) => "<h4>Your turn</h4><ol>" +
        "<li><b>Roll and Set Statistics</b>: return the discs on your Attack space (not on turn 1). Roll " + (c.lvl("ghoul") >= 3 ? "<b>2</b> Ghoul dice (Stalker/Hunter) — 4 or less draws" : "all <b>3</b> Ghoul dice — a total of 7 or less draws") + " a Terror card. Keep two dice: the <b>higher is movement points</b>, the <b>lower is attack points</b> (put that many Ghoul discs on your Attack space; set the die aside)." + (c.lvl("ghoul") >= 3 ? "" : " Set the third die aside.") + " Track movement above 6 with discs.</li>" +
        "<li><b>Move and Act</b>: spend movement points to move and collect; attack points to attack and smash Crystals; use Terror cards.</li>" +
        "<li><b>Set Defense</b>: the discs left on your Attack space are your <b>Defense</b> until your next turn (they aren't removed when you're attacked).</li></ol>" +
        "<h4>Moving and collecting</h4>" + L([
          "1 movement per adjacent space, Lit or Dark. You don't reveal Dark tiles.",
          "<b>+1</b> to move through a wall. <b>+1</b> to enter a space with other pieces without attacking at once (or if any piece there is one you can't attack). Entering to attack costs no extra.",
          "Collect a Treasure or Gem on your space: <b>2 movement each</b>. Gem: roll the Dragon die — center affected, you skitter (a trap) and the Gem goes back; otherwise take a Treasure token from the Cave's supply (from the map if the supply is empty) and return the Gem. Treasures sit on your Treasure space (the Thief can Pickpocket them); every <b>2 Treasures = +1 Fury</b> (return both)."
        ]) +
        "<h4>Attacking</h4>" + L([
          "On a space with another piece: spend Ghoul discs equal to <b>1 + the target's defense</b> (Strength, Armor or Stealth). Each piece at most once per turn.",
          has(c, "knight") ? "<b>Knight</b> loses 1 Grit per Hero cube available, or 1 Health, or 1 Treasure card (to the bottom of the deck) — her choice." : "",
          has(c, "goblins") ? "<b>Goblin Tribe</b>: scatters." : "",
          has(c, "dragon") ? "<b>Dragon</b> discards Power cards equal to his Armor, or loses 1 Health, or returns 1 Sloth cube from Wakefulness to any open Sloth space — his choice." : "",
          has(c, "unicorn") ? "<b>Unicorn</b> loses 1 Health or discards Unicorn cards equal to his Armor, his choice; he Teleports after you skitter." : "",
          has(c, "thief") ? "<b>Thief</b>: killed; draw Terror cards equal to his Loot Drop Level (min 1), keep one, put the rest on the bottom. (If Unnatural Evasion succeeds, he moves after you skitter.)" : "",
          "<b>Crystal</b>: spend 3 discs to smash it (it counts for other players' goals).",
          "After any attack: <b>+1 Fury</b>, then <b>skitter</b>. You may keep moving and attacking after skittering."
        ]) +
        "<h4>Fury and Terror cards</h4>" + L([
          "+1 Fury per attack and per 2 Treasures. Each even-numbered Fury space reached: draw a Terror card. Once you reach your goal, losing Fury later doesn't matter — just escape.",
          "Terror cards go face up. Each has a persistent or once-per-turn effect, and a once-per-game effect (then remove the card; “During this turn” ones at the end of the turn). Not both effects of one card in a turn, nor the once-per-game effects of two identical cards in one turn."
        ]) +
        "<h4>Skittering</h4>" + L([
          c.mod("skitter") ? "<b>Skitter Variant (in use)</b>: you name a Dark symbol (Fangs, Bones, Eye) matching an unoccupied Dark tile; your opponent in the attack places you on such a tile — or, if there are none, on any unoccupied space surrounding the Entrance. Attacks not involving another player use the standard rules below." : "After you attack or are attacked, the other player names a Dark symbol (Fangs, Bones or Eye) shown on an unoccupied Dark tile; you move to any unoccupied Dark tile with that symbol.",
          "No other player involved (e.g. smashing a Crystal with no Cave player, or the Shadow Unicorn's attack): use the symbol on the top tile of the stack; during the Collapse, a random collapsed tile's symbol.",
          "No unoccupied Dark tiles left: go to any unoccupied space surrounding the Entrance."
        ]) +
        "<h4>When others go after you (you skitter afterwards)</h4>" + L([
          has(c, "knight") ? "<b>Knight</b>: enters only with Strength greater than your Defense, and attacks (completes <i>Daring</i>; <i>Stalwart</i> if your Defense was 3+; <i>Fearless</i> if you were on the Dark tile she just revealed). Her Bow hits you if her Strength is 2+." : "",
          has(c, "goblins") ? "<b>Goblin Tribe</b>: enters only with Strength greater than your Defense, and attacks; the Goblins <i>gain</i> 1 Rage and the Tribe doesn't scatter." : "",
          has(c, "dragon") ? "<b>Dragon</b>: enters freely underground; surfaced only if his Armor beats your Defense. Claw counts as eating 1 Goblin; Scratch as eating 3 and you discard 1 Terror card. Hiss doesn't affect you; a Flame Wall just makes you skitter." : "",
          has(c, "unicorn") ? "<b>Unicorn</b>: enters freely and attacks; at 3 Anger you also discard a Terror card." : "",
          has(c, "cave") ? "<b>Cave</b>: Soporific Spores takes 1 Fury (no Terror cards lost)." : "",
          has(c, "thief") ? "<b>Thief</b>: enters only with Stealth greater than your Defense. Pickpocket: a Treasure token from your board or a Terror card (shuffled back). Backstab: −1 movement on your next turn per cube spent." : ""
        ]) +
        "<h4>Also</h4>" + L(["Forced movement can't take you through walls or onto other players.", "If you're also playing with the Ghost, set up the Ghoul's variant first, then add the Ghost."]),
      src: (c) => VC.cite(["Ghoul p.2–5", "FAQ p.6, p.19", c.mod("skitter") ? "Ghoul p.4" : ""]) },

    /* ================================================================== */
    { title: "The Vile Ghoul (Fearsome Foes)",
      when: (c) => c.has("vileghoul"),
      html: (c) => "<p>Follow all of the Ghoul's rules (below, summarised) except where noted. It replaces the Goblins: their setup and victory conditions, their place in turn order.</p>" +
        "<h4>Your turn</h4><ol>" +
        "<li><b>Prepare Board</b>: no dice in your supply? Collect all three from the dice chart, roll them and put them in your supply (always on turn 1). Otherwise slide the die on the left side of the chart to the right side of the same row (dice already on the right stay). Clear the discs from your Attack space.</li>" +
        "<li><b>Select Statistics</b>: pick one die from your supply — don't roll it — and place it on the matching face of the dice chart. That row gives your <b>Movement</b> and <b>Attack</b> for the turn; dice on the right side of that row are <b>Boost dice</b>. Put Ghoul discs equal to your Attack on the Attack space as a reminder.</li>" +
        "<li><b>Move and Act</b>: like the Ghoul, but your <b>Attack stays constant</b> (you don't spend discs). Spend each Boost die once this turn (it stays put) for +1 movement or +1 to one attack; the <i>Hunt</i> Terror card adds temporary Attack too.</li>" +
        "<li><b>Set Defense</b>: your Attack is your Defense. Boost dice can't raise Defense.</li></ol>" +
        L(["The Movement and Attack values of each dice-chart row are printed on your board.", c.lvl("vileghoul") >= 3 ? "Stalker/Hunter: you use only 2 Ghoul dice." : ""]) +
        "<h4>Moving and attacking</h4>" + L([
          "Entering a space with another piece costs +1 movement if your Attack is less than or equal to its defense (Strength, Armor or Stealth), or if you don't attack it at once. A temporary Attack bonus lasts for that movement and the attack on entering.",
          "Attack only if your Attack is <b>greater than</b> the target's defense. Smashing a Crystal needs Attack 3+.",
          "Effects as the Ghoul's, except: your discs stay; " + (has(c, "knight") ? "the Knight must lose 1 Health; " : "") + "a player you must kill to win must choose to lose Health.",
          has(c, "dragon") ? "<b>Dragon</b>: discards Power cards equal to his Armor, or loses 1 Health, or returns 1 Sloth cube from Wakefulness to any open Sloth space — his choice (Health if killing him is your goal)." : "",
          has(c, "unicorn") ? "<b>Unicorn</b>: loses 1 Health or discards Unicorn cards equal to his Armor — his choice (Health if killing him is your goal); he Teleports after you skitter." : "",
          has(c, "thief") ? "<b>Thief</b>: killed; draw Terror cards equal to his Loot Drop Level (min 1), keep one, put the rest on the bottom. (If Unnatural Evasion succeeds, he moves after you skitter.)" : "",
          "You can't attack the same piece more than once per turn.",
          "Draw a Terror card each time you attack successfully or collect 2 Treasures or Dragon Gems. No Fury track.",
          "FAQ: Boost dice only work on a turn when a new die is placed on the left of their row; several in a row stack."
        ]) +
        "<h4>From the Ghoul's rules</h4>" + L([
          "Moving: 1 per space, Lit or Dark, no revealing; +1 through a wall. Collect a Treasure/Gem for 2 movement (Gem: Dragon die center = skitter).",
          "After any attack you make or suffer, you <b>skitter</b>: the other player names a Dark symbol and you move to an unoccupied Dark tile showing it." + (c.mod("skitter") ? " <b>Skitter Variant in use:</b> you name the symbol; they place you." : ""),
          "You may keep moving and attacking after you skitter (FAQ p.19).",
          "No other player involved (e.g. smashing a Crystal with no Cave player, or the Shadow Unicorn's attack): use the symbol on the top tile of the Cave tile stack; during the Collapse, a random collapsed tile's symbol" + (c.mod("skitter") ? " (standard rules, even with the Skitter Variant)" : "") + ".",
          "No unoccupied Dark tiles: " + (c.mod("skitter") ? "your opponent in the attack places you on" : "go to") + " any unoccupied space surrounding the Entrance.",
          "Terror cards go face up. Each has a persistent or once-per-turn effect, and a once-per-game effect (then remove the card; “During this turn” ones at the end of the turn). Not both effects of one card in a turn, nor the once-per-game effects of two identical cards in one turn.",
          "Others need Strength/Armor/Stealth greater than your Defense to enter your space (the underground Dragon and the Unicorn enter freely)."
        ]) +
        (has(c, "knight", "dragon", "unicorn", "thief") ? "<h4>When others go after you (you skitter afterwards)</h4>" + L([
          has(c, "knight") ? "<b>Knight</b>: enters only with Strength greater than your Defense, and attacks (completes <i>Daring</i>; <i>Stalwart</i> if your Defense was 3+; <i>Fearless</i> if you were on the Dark tile she just revealed). Her Bow hits you if her Strength is 2+." : "",
          has(c, "dragon") ? "<b>Dragon</b>: enters freely underground; surfaced only if his Armor beats your Defense. Claw counts as eating 1 Goblin; Scratch as eating 3 and you discard 1 Terror card. Hiss doesn't affect you; a Flame Wall just makes you skitter." : "",
          has(c, "unicorn") ? "<b>Unicorn</b>: enters freely and attacks; at 3 Anger you also discard a Terror card." : "",
          has(c, "thief") ? "<b>Thief</b>: enters only with Stealth greater than your Defense. Pickpocket: a Treasure token from your board or a Terror card (shuffled back). Backstab: −1 movement on your next turn per cube spent." : ""
        ]) : ""),
      src: (c) => VC.cite(["Ghoul p.2–4, p.6–7", "FAQ p.6, p.19"]) },

    /* ================================================================== */
    { title: "The Nightmare Unicorn (Fearsome Foes)",
      when: (c) => c.has("unicorn"),
      html: (c) => "<h4>Statistics</h4>" + L([
          "<b>Spirit</b>: cards drawn at the end of your turn (you start with 4). <b>Pace</b>: actions per turn. <b>Armor</b>: defense on others' turns (1 at the start" + (c.v.unicornArmor ? "; 2 this game" : "") + "). <b>Clarity</b>: cards revealed when forced to Teleport. Starting Pace and Clarity are printed on your board.",
          "Your <b>facing</b> matters — it's the direction you move. Keep the piece clearly facing one cardinal direction; change it only when a card says so."
        ]) +
        "<h4>Your turn</h4><ol><li><b>Perform Actions</b>, up to your Pace, finishing each before the next: <b>Move</b> or <b>Turn</b> (play a card showing it, then discard it) or <b>Teleport</b> (play any two cards). An <b>angry action</b> card: first +1 Anger (max 3), then the action — but during it you can't mark Crystals or collect Treasures.</li>" +
        "<li><b>Replace Hand and Reset Anger</b>: discard your hand, draw cards equal to your Spirit (shuffle the discards when the deck is empty), then reset Anger to 1" + " (2 with <i>Unbridled</i>).</li></ol>" +
        "<h4>Move and Turn</h4>" + L([
          "<b>Move</b> forward the card's number of spaces — as many as possible. Entering a Dark tile reveals it: connect an open edge to where you came from and, if you're not done, orient it so you can continue straight (if you can't, you stop).",
          "Entering a space with another player piece: you <b>attack</b> it at once (several players there: you choose which)" + (has(c, "ghost", "caveghost") ? " — except the Ghost or Cave Ghost, whom you ignore whether you move or Teleport into her space (FAQ p.6 · Ghost p.2, p.6)" : "") + ".",
          "End a non-angry Move on a <b>Crystal tile</b> (even smashed) without a Unicorn cube: place one, <b>+1 Radiance</b>. End on a <b>Treasure token</b>: collect it, +1 Radiance each (it returns to the Cave).",
          "<b>Turn</b> 90° or 180° in the card's direction; you may also mark a Crystal tile or collect a Treasure on your space.",
          "Outside your turn you never gain Radiance this way."
        ]) +
        "<h4>Attacking — always succeeds</h4>" +
        tbl(["Target", "Anger 1", "Anger 2", "Anger 3"], [
          has(c, "knight") ? ["Knight", "−1 Grit", "−3 Grit", "−5 Grit"] : null,
          has(c, "goblins") ? ["Goblin Tribe", "scatters", "+ discard a Secrets card", "+ Population to 0"] : null,
          has(c, "dragon") ? ["Dragon", "discard 1 Power card", "discard 2", "discard 3"] : null,
          has(c, "thief") ? ["Thief", "killed; you draw Loot Drop + 0 cards", "+1 card", "+2 cards; he also loses an upgrade (keeping its Treasure token)"] : null,
          has(c, "ghoul", "vileghoul") ? ["[Vile] Ghoul", "skitters", "skitters", "skitters + discards a Terror card"] : null
        ].filter(Boolean), "anger") +
        L([
          "At 3 Anger you also gain <b>1 Radiance</b> — only for the first attack on each player per turn.",
          "After attacking you are <b>forced to Teleport</b> (so you can't mark or collect where you attacked). If the Goblins discard a face-up <i>Trap</i> card, or the Thief succeeds at Unnatural Evasion (he moves 1 space away first), the attack has no effect: you still Teleport and gain no Radiance."
        ]) +
        "<h4>Teleporting</h4>" + L([
          "Each card shows a grid with you in the center and one marked destination; turn the card so its arrow (^) points the way you face" + (c.mod("simple") ? " — <b>Simple Teleport Variant in use</b>: point the arrow directly away from your seat" : "") + ". Move there, keeping your facing; reveal a Dark tile there; attack any player piece there" + (has(c, "ghost", "caveghost") ? " except a Ghost" : "") + " (then Teleport again); on your turn, mark/collect.",
          "<b>Teleport action</b>: play 2 cards, use either destination; their actions don't happen and give no Anger; costs 1 action; impossible with 1 card. Before the Collapse it may target an open space: add a Dark tile there, connect it to the map with the fewest Dark tiles, reveal it" + (c.v.noCave ? "" : " (the Cave provides the tiles)") + ". Not during the Collapse.",
          "<b>Forced Teleport</b>: reveal cards equal to your Clarity, pick one destination, discard them. Never to an open space — reveal more, one at a time, until valid.",
          "Teleporting into open spaces adds many tiles: use it sparingly or you'll speed the Collapse."
        ]) +
        "<h4>Radiance and upgrades</h4>" + L([
          "Each Radiance: move a cube from the Radiance track to an upgrade space. Spirit, Pace, Armor, Clarity: raised at once (Spirit cards at your next draw). <i>Unbridled</i>: +1 Anger now, and Anger resets to 2. <i>Displacement Blast</i>: an action, once per turn — play a card and remove its marked tile instead of its action.",
          "A collapsed Crystal tile takes its cube with it; the cube doesn't return to the track.",
          has(c, "dragon") ? "With a Dragon player, Dragon Gems work like Treasures for you: roll the Dragon die — center affected, no Radiance and you're forced to Teleport; else +1 Radiance. The Gem returns to the Dragon either way." : "",
          "Win: gain " + (c.v.valid ? VC.num.radiance(c) : 9) + " Radiance, then enter the Entrance tile during your turn — by moving or teleporting, even if another piece is there. If attacking the piece on the Entrance would give your last Radiance, you must Teleport away and come back (FAQ p.18)."
        ]) +
        "<h4>When others go after you (you're forced to Teleport after)</h4>" + L([
          "Only a player whose goal is killing you makes you lose 1 Health" + (has(c, "ghoul", "vileghoul") ? " (except a [Vile] Ghoul's attack — see below)" : "") + "; anyone else's attack just makes you Teleport." + (!c.v.alongside ? " Replacing the Dragon, you are the target of any goal that names the Dragon (FAQ p.18)." : ""),
          has(c, "knight") ? "<b>Knight</b>: enters with Strength at least your Armor; greater hits, equal rolls the Dragon die (center hits). <i>Daring</i> counts. Enchanted Bow: you discard Unicorn cards as the Dragon would. Mighty Axe: Strength bonus only." : "",
          has(c, "goblins") ? "<b>Goblin Tribe</b>: enters with Strength greater than your Armor, and attacks. <i>Hex</i> makes you discard cards." : "",
          has(c, "dragon") ? "<b>Dragon</b>: enters freely; Claw (eats 1 Goblin) or Scratch (eats 3). Hiss doesn't affect you; entering a Flame Wall forces a Teleport." : "",
          has(c, "thief") ? "<b>Thief</b>: enters freely; Backstab for 3 cubes if his Stealth beats your Armor; no Pickpocket." : "",
          has(c, "ghoul", "vileghoul") ? "<b>[Vile] Ghoul</b>: may enter regardless; attacks if its spent discs (Ghoul) or Attack (Vile Ghoul) beat your Armor. Its attack: you lose 1 Health or discard Unicorn cards equal to your Armor, your choice (a Vile Ghoul whose goal is killing you: you must lose Health) (Ghoul p.3, p.6). You Teleport after it skitters." : "",
          has(c, "cave") ? "<b>Cave</b>: Soporific Spores removes one upgrade of your choice (no Radiance lost). Giant Bats can't move you." : ""
        ]) +
        "<h4>Also</h4>" + L([
          "Forced to move (not Teleport): not through walls, onto Dark tiles or onto other players. If collapsing tiles would move you, you're forced to Teleport.",
          c.v.noCave ? "No Cave [Ghost] player: see the Unicorn tile rule under <i>The Collapse and removing tiles</i>." : "",
          c.v.alongside ? "<b>Unicorn vs. Dragon</b>: you take your turn right after the Dragon; no Hunger cubes were moved; if agreed, one player's goal is to kill you." : "",
          c.v.uThief ? "<b>Unicorn vs. Thief</b>: the Thief also wins by killing you." : ""
        ]),
      src: (c) => VC.cite(["Unicorn p.2–4", "FAQ p.5–6, p.18", has(c, "ghost", "caveghost") ? "Ghost p.2, p.6" : "", has(c, "ghoul", "vileghoul") ? "Ghoul p.3, p.6" : ""]) },

    /* ================================================================== */
    { title: "The Shadow Unicorn (Fearsome Foes)",
      when: (c) => !!c.v.shadow,
      html: (c) => "<p>A non-player antagonist with no victory condition of his own. “You” below is the player whose goal is killing him; that player makes his decisions.</p>" +
        "<h4>Statistics</h4>" + L(["<b>Spirit</b> (cards in his Spirit pile) and <b>Armor</b> improve along his <b>Revealed Crystals track</b>: count every Crystal tile revealed all game, including ones revealed as they collapse.", "His facing decides where he moves."]) +
        "<h4>His turn (after all players)</h4><ol>" +
        "<li><b>Resolve Spirit Pile</b>: draw and reveal one card. Odd cards (1st, 3rd, 5th, 7th) prompt a <b>Move</b>, even cards a <b>Turn</b> — unless the card shows an angry action, which prompts its own listed action. Then check for a <b>Rampage</b> (below); if none, resolve the prompted action. Repeat until the pile is empty.</li>" +
        "<li><b>Refresh Spirit Pile</b>: draw cards equal to his Spirit (shuffle his discards if the deck is empty).</li></ol>" +
        "<h4>Rampage</h4>" + L([
          "He Rampages instead when <b>both</b> are true: the prompted action provokes one (<b>" + ({ easy: "Easy: only an angry action", medium: "Medium: a Move or an angry action", hard: "Hard: any action" })[c.opt.shadowLvl] + "</b>), and a player piece other than a [Cave] Ghost is <b>visible</b> to him (facing doesn't matter — he can smell you). Never on his first turn.",
          "Rampage: turn to face the target, move to its space and attack. Several visible Tribes: the highest Strength, then the closest, then your choice." + (c.v.shadow === "multi" ? " Multiplayer priority: the visible hunter, then the closest visible piece, then a random one." : ""),
          "During a Rampage he doesn't Teleport on tiles holding only a Unicorn cube."
        ]) +
        "<h4>Move and Turn</h4>" + L([
          "<b>Move</b>: facing a wall? Turn right until he faces an open edge. Then move forward the card's number, as far as possible. On each new space: 1) reveal a Dark tile: connect an open edge to where he came from and, if his Move isn't finished, orient it so he can keep going (if it can't be, he stops). If more than one orientation is valid, " + (c.v.shadow === "solo" ? "you choose" : "the latest player in turn order who isn't hunting him chooses") + " (FAQ p.18); 2) attack any player piece there; 3) a Unicorn cube there → he Teleports; 4) facing a wall → mark the tile with a Unicorn cube and turn right until he faces an open edge. A Teleport ends the Move. Once the Collapse has begun, open edges that don't connect to another tile count as walls (FAQ p.18).",
          "<b>Turn</b>: turn in the listed direction until he faces the first open edge."
        ]) +
        "<h4>His attacks — always succeed, then he Teleports</h4>" + L([
          has(c, "knight") ? "Knight −1 Health" + (c.v.shadow === "multi" ? " (−5 Grit instead if another player's goal is killing her)" : "") + "." : "",
          has(c, "goblins") ? "A Goblin Tribe scatters." : "",
          has(c, "dragon") ? "Dragon −1 Health" + (c.v.shadow === "multi" ? " (discards 2 Power cards instead if another player's goal is killing him)" : "") + "." : "",
          has(c, "thief") ? "The Thief is killed." : "",
          has(c, "ghoul", "vileghoul") ? "The [Vile] Ghoul skitters." : "",
          "He never targets the Ghost or Cave Ghost.",
          c.v.shadow === "multi" ? "If he kills the Knight or Dragon and nobody's goal is killing that player, they are eliminated: skip their turns; play continues." : ""
        ]) +
        "<h4>Attacking him (he Teleports afterwards)</h4>" + L([
          c.v.shadow === "multi" ? "Only the hunter's attacks reduce his Health; others' attacks just make him Teleport." : "",
          has(c, "knight") ? "<b>Knight</b>: enter with Strength at least his Armor; greater hits (−1 Health), equal rolls the Dragon die. <i>Daring</i> counts. Enchanted Bow: he discards from his Spirit pile, then Teleports. Mighty Axe: Strength only." : "",
          has(c, "goblins") ? "<b>Goblin Tribe</b>: Strength greater than his Armor; he loses 1 Health, the Tribe scatters, Rage −1. <i>Hex</i>: he discards from his Spirit pile." : "",
          has(c, "dragon") ? "<b>Dragon</b>: enters freely; Claw (eats 1) or Scratch (eats 3), each −1 Health. Hiss doesn't affect him; a Flame Wall makes him Teleport." : "",
          has(c, "thief") ? "<b>Thief</b>: enters freely; Backstab for 3 cubes if Stealth beats his Armor (−1 Health)." : "",
          has(c, "ghoul", "vileghoul") ? "<b>[Vile] Ghoul</b>: may enter regardless; attacks if its Attack beats his Armor." : "",
          has(c, "cave") ? "The Cave's Giant Bats can't move him." : ""
        ]) +
        "<h4>Teleporting</h4>" + L([
          "Whenever he enters a space with a Unicorn cube, attacks, or is attacked: draw and reveal 1 card (arrow along his facing) and place him on its destination, facing unchanged.",
          "Destination an open space? Before the Collapse: add a Dark tile there and connect it with the fewest Dark tiles. During the Collapse: collapse 3 tiles, then draw cards one at a time until a valid destination (no more collapsing this Teleport).",
          "After placing him, run the same 4 steps (reveal, attack, cube → Teleport, wall → mark and turn right).",
          "On a collapsing tile, or a tile with no open edges, he Teleports at once. Give him plenty of table space."
        ]),
      src: () => "Unicorn p.5–7 · FAQ p.18" },

    /* ================================================================== */
    { title: "The Ghost (Fearsome Foes)",
      when: (c) => c.has("ghost"),
      html: (c) => "<h4>Statistics</h4>" + L(["Your <b>Focus</b> (0–7) sets your <b>Movement</b> and <b>Influence</b> [INF] for the turn:"]) +
        tbl(["Focus", "0", "1", "2", "3", "4", "5", "6", "7"], [["Movement", "3", "4", "4", "5", "5", "6", "6", "7"], ["Influence", "1", "1", "2", "2", "3", "3", "4", "4"]], "focus") +
        "<h4>Your turn</h4><ol>" +
        "<li><b>Resolve Possession Card</b> (skip on turn 1): if an unrevealed card is on your Possession space, <b>+1 Focus</b>. If it's the <i>Ghost</i> card you may reveal it for +2 Movement and +1 Influence this turn" + (c.v.ghostMode === "2" || c.v.ghostMode === "solo" ? " (in 2-player and solo games, then remove it from the game at the end of your turn)" : "") + ". Not if any player piece is on a Ghost tile with a locked Artifact.</li>" +
        "<li><b>Move and Act</b>: move and use Telekinesis in any order.</li>" +
        "<li><b>Select Possession Card</b>: collect every Possession card except the one on your Mental Block space; place one facedown on your Possession space; set the rest aside facedown.</li></ol>" +
        "<h4>Move</h4>" + L(["Up to your Movement, through walls and into any spaces — open spaces too — without effect; others enter your space freely. You can't end this phase on an open space, a space with Artifacts, or a space with a player carrying one."]) +
        "<h4>Telekinesis</h4>" + L([
          "Move an <b>object</b> (a token or another player piece) that is orthogonal to you, visible or not, in a straight line toward or away from you — even into and back out of your space.",
          "Influence = how many different objects you can move per turn <i>and</i> how many spaces each can move in total (split freely across the turn).",
          "Objects obey Forced Movement. A non-locked Artifact may go onto Dark or Lit tiles and spaces with players; into your space but not ending there; through a wall only with 3+ Influence and if you haven't moved it yet this turn (then it can't move further).",
          "Crystal, Event, Vault and Bomb tokens can't be moved. Nor can the Knight with a cube on her Shield."
        ]) +
        "<h4>Possession turns</h4>" + L([
          v2(c) ? "At the end of another player's turn, you may reveal the card on your Possession space if it matches that player, and play a <b>possession turn</b> — their turn from the start, with the card's statistics and restrictions." :
            "Two-player and solo: you summon ghostly remnants of other roles instead. Two players: reveal a card whose turn-order position is before your opponent's at the end of your turn, or one after it at the end of their turn. Solo: the possession turn comes after you end your turn (and place or remove tiles), before your next turn (FAQ p.19). Place that role's piece by its first-turn setup rules (no Artifact, but it may collect one); at the end, drop its Artifact, remove the piece, and remove the card from the game.",
          "Track that role's states (Grit, Wakefulness, Fury…) as normal unless the card says otherwise. Draw their components from the decks and supplies; discard unused ones at the end.",
          "It isn't a separate turn: per-turn limits count what the player already did (e.g. a second Pride cube, a second Backstab on the same player, Hatred's rising cost).",
          "You don't see their private information — except the Cave's hand of tiles. Missing dice can be substituted or rerolled.",
          "Blocked while any player piece (not you) stands on a Ghost tile with a locked Artifact. Locking an Artifact during a possession turn ends it at once. A possessed piece entering the Mushroom Forest ends it too.",
          has(c, "knight") && v2(c) ? "<i>Possessed Knight</i> (example card): Movement 5, Perception INF+1, Strength 3; may use the Ancient Map, Bomb (tokens only) and Bow once each, even if the Knight player already used them; earned Hero cubes wait for the Knight's next Pick Up; she decides whether to keep a Treasure card. Her Shield doesn't stop a possession move (FAQ p.19)." : "",
          c.v.noCave ? "No Cave player: reveal after the player has placed or collapsed tiles; you place/collapse only at the end of your own turn." : ""
        ]) +
        "<h4>Artifacts</h4>" + L([
          "Six tokens, same rules, unlocked side up at the start. <b>Lock</b> one — flip it to its blue-bordered side on the Ghost tile — when, during your turn or a possession turn, an Artifact (or a piece carrying one) enters a Ghost tile without a locked Artifact: moved there by Telekinesis, carried by a possessed player, or carried by a piece a possessed player forced in.",
          "Not when a non-possessed player carries one in on their own turn, or forces another non-possessed carrier in.",
          "Locked Artifacts never move and still count if their tile is removed. Lock on any Ghost tile, Lit or Dark (locking doesn't reveal it).",
          "Each player carries at most one; the Cave and the Ghost carry none. If the Goblins got an Artifact at setup, it starts off the map and goes to the first Tribe to reveal; if the Tribe carrying it leaves the map, the Artifact leaves too, and whenever it is off the map it goes to the next Tribe to reveal (one Artifact for all three Tribes). During a possession turn you may make the possessed piece drop its Artifact onto its space or, if it carries none, collect a non-locked Artifact there, at no action or resource cost, on non-Ghost tiles only (FAQ p.19)."
        ]) +
        "<h4>Blocking you — the only ways</h4>" + L([
          "Standing on a Ghost tile with a locked Artifact (any piece but yours): you can't reveal Possession cards.",
          "<b>Mental Block</b>: on their turn, from your space or an adjacent one (walls ignored), a player pays — Knight: lose INF+2 Grit (her Shield doesn't reduce it); Goblins: discard INF Secrets; Dragon: discard INF Power cards; Unicorn: discard INF Unicorn cards; Thief: spend INF Action cubes; [Vile] Ghoul: spend INF+1 movement. The Cave just hits you with Soporific Spores.",
          "Their Possession card goes face up to your Mental Block space (from your deck or Possession space — then no possession turn for it and no +1 Focus next turn). A second blocked card sends the first back to your deck."
        ]) +
        "<h4>Ghost tiles</h4>" + L([
          has(c, "cave") ? "The Cave must place a Ghost tile from its hand before any other tile, even Crystal tiles, even on other players' turns." : "No Cave player: Ghost tiles are placed like any other tile when drawn.",
          "Their Lit side shows an Ambush, Event or Treasure symbol plus the Ghost symbol. Without a locked Artifact they can't be collapsed (take the next eligible tile)."
        ]) +
        (c.mod("focused") ? "<h4>Fully Focused (in use)</h4>" + L(["After locking your Artifacts, end a turn on a Ghost tile without a locked Artifact (or simply lock one more); then escape via the Entrance."]) : ""),
      src: (c) => VC.cite(["Ghost p.2–5", "FAQ p.6, p.19"]) },

    /* ================================================================== */
    { title: "The Cave Ghost (Fearsome Foes)",
      when: (c) => c.has("caveghost"),
      html: (c) => "<h4>Your turn</h4><ol>" +
        "<li><b>Collect Omen Tokens</b> by your Isolation plus the Crystal tokens and Ghost tiles on the map (not Treasure tokens, nothing removed) — always at least 1" + (c.mod("crowded") && c.v.n >= 6 ? "; Crowded House (6+ players): count one more Crystal token" : "") + ".</li>" +
        "<li><b>Shape the Cave</b>: place a tile Dark side up adjacent to the map, then draw. Crystal tiles first on your turn. The Collapse begins on your next turn after your last tile is placed.</li>" +
        "<li><b>Move and Use Powers</b>, in any order: move up to <b>6 spaces</b> through walls and open spaces (not ending on an open space); spend Omens on your powers.</li>" +
        "<li><b>Place Treasure</b>" + (c.v.ptOpt ? " (optional this game)" : "") + " on a Dark tile with no player piece or Treasure.</li>" +
        "<li><b>Check Past Plunder</b>: while 6+ Omen tokens sit on your Past Plunder space, return 6 to the bag and place a Treasure token on such a Dark tile.</li></ol>" +
        tbl(["Isolation + Crystals & Ghost tiles", "Omen tokens"], [["0–1", "1"], ["2", "2"], ["3–4", "3"], ["5–7", "4"], ["8–11", "5"], ["12+", "6"]], "omens") +
        "<h4>Isolation</h4>" + L([
          "Counted in rings of surrounding spaces around you (1 = the 8 surrounding spaces, 2 = the next ring…), ignoring walls, tile features and open spaces.",
          "Collecting Omens: measure to the <b>closest</b> player piece — more Isolation, more Omens. Telekinesis and Possession: measure to the <b>target</b> — less Isolation, more power. If it can't be measured (e.g. no Tribes on the map), ignore it (for Possessing the Goblins, measure to where you'll reveal the first Tribe)."
        ]) +
        "<h4>Powers (Omen costs on your board; spent tokens go to Past Plunder, not the bag)</h4>" + L([
          "<b>Rockslide</b>: place a Rockslide token on an edge <b>adjacent to your space</b> between two tiles without walls (not between two Dark tiles). It is a wall. If all 3 are placed, you may move one. It returns to your supply if either tile is rotated or removed. <b>Hatred</b>: place a tile in a <b>surrounding</b> space. During the Collapse, remove a tile in a surrounding space instead, still following the touching-tiles order. <b>Crystal Curse</b> (on a surrounding space), one per use: rotate a tile to any orthogonal orientation (no need to connect to the Entrance); place an Event token on an empty Event tile; or move the top 3 Event cards to the bottom. Tiles added or removed in Shape the Cave needn't be near you.",
          "<b>Plot Twist</b>: place a Ghost tile of your choice, Dark side up, in a surrounding space.",
          "<b>Telekinesis</b>: move <b>one</b> object (a token or another player's piece) that is orthogonal to you, visible or not, in a straight line toward or away from you (it may move into your space). The distance comes from your Isolation from it (table), and you may target the same object again with further uses. Moves obey Forced Movement. Crystal, Event, Vault and Bomb tokens can't be moved, and neither can the Knight with a Hero cube on her Shield.",
          "<b>Possession</b>: the possession turn starts <b>immediately</b> and can't be blocked. Cost = the Isolation cost + the role's Possession value (top corner of its card); treat your INF as 2. Play that role's turn from its beginning under its normal rules, but use the Possession card's statistics and restrictions. Track the role's victory conditions and states (Grit, Wakefulness, Fury…) as normal unless the card says otherwise. Take components from the decks and supplies, not the player; at the end, discard unused cards and return unused components. It isn't a separate turn: per-turn limits count what the player already did that turn. You get none of their private information. If the card calls for more dice than are available, substitute or reroll dice."
        ]) +
        tbl(["Isolation from target", "0–1", "2", "3", "4", "5", "6+"], [["Telekinesis distance", "5", "4", "3", "2", "1", "1"], ["Possession cost (+ card)", "0", "1", "2", "3", "4", "✕"]], "iso") +
        "<p class='inline-note'>The Isolation row values are read from the Cave Ghost board pictured on Ghost p.1.</p>" +
        "<h4>Also</h4>" + L([
          "Follow the Cave's rules for Cave tiles, Treasures, Events and the Collapse — but you can't look at the top Event cards.",
          "Ghost tiles on the map add to your Omens; their symbols just mark them. A Ghost tile removed before the Collapse returns to your supply.",
          "Other players can't target you with anything (except as the rules say). There is no solo Cave Ghost."
        ]),
      src: (c) => VC.cite(["Ghost p.1–3, p.6–7", "Rules p.3, p.13", "FAQ p.16–17, p.20", c.mod("crowded") ? "Ghost p.7" : ""]) },

    /* ================================================================== */
    { title: "Variant cards in this game",
      when: (c) => c.v.valid && (c.v.flare.size || c.v.pp || c.v.inf || c.v.ash || c.v.aid || c.v.unicornArmor),
      html: (c) => {
        const v = c.v;
        return L([
          v.flare.size ? "<b>Flare</b> (" + VC.names(Array.from(v.flare)) + "): reveals Dark tiles as the card describes; tiles it reveals get their tokens but don't affect the Knight until she enters them, and an Ambush tile revealed by Flare never triggers (FAQ p.7). Uses (FAQ p.21): the Knight once per turn; each Goblin Tribe once per turn (up to 3); the Thief any number of times, 1 Action each; the [Vile] Ghoul any number of times, 1 movement point each (it may target its own space)." +
            (v.flare.has("ghost") ? " Solo Ghost: after placing tiles by Alone in the Dark II, roll Flare for each Artifact on a Dark tile, using the Artifact as the center space for the roll (Ghost p.5)." : "") : "",
          v.pp ? "<b>Past Plunder</b> (the " + VC.role[v.pp].short + "): lets its holder place Treasure tokens, as the card says." + (v.noCave ? " With no Cave player, place the Treasure after placing your Dark tile at the end of your turn; it may go on that tile (FAQ p.21)." : "") : "",
          v.inf ? "<b>Goblin Infestation</b> (Knight, <b>" + VC.infLine(c) + "</b>) with the Ogre and Troll <b>Monster tokens</b>: the card's chosen line decides how Ambushes treat the Knight. The Ambush text at the bottom of Monster cards and the two Monster tokens are used only in games with no Goblins player, with this card (FAQ p.11–12). Ogre/Troll: their card stays out until you defeat them; to fight again, enter the token's space and Encounter it as an Ambush; tokens count as occupied spaces. Underworm (Ambush): move to the nearest diagonal Dark tile (place one if none)." : "",
          v.ash ? "<b>Ash Dragon</b>" + (v.ash === "map" ? " (near the map)" : " (the Dragon)") + ": the Dragon gets +1 Armor (max 4); the Goblins may Attack him — a hit costs him 1 Health, the Goblins 1 Rage, and the Tribe scatters. They may attack him at any time; Tribes can't Ambush him (FAQ p.13)." : "",
          v.unicornArmor ? "<b>Ash Dragon → Unicorn</b>: no card. Instead, put a Unicorn cube from your supply (not the Radiance track) on the first Armor upgrade space: his Armor starts at 2, and the Cave can't remove this cube (Unicorn p.4)." : "",
          v.aid === "I" ? "<b>Alone in the Dark</b>: replaces the Cave Reference card; at the end of your turn draw and place tiles equal to the greatest of the listed values (or remove that many once the Collapse begins: Crystal tiles first, then Dark, then Lit). It replaces the normal end-of-turn placement." : "",
          v.aid === "II" ? "<b>Alone in the Dark II</b>: the Fearsome Foes solo card; place or remove tiles at the end of your turn as it directs (its text isn't printed in the rulebooks)." : ""
        ]) + "<p class='inline-note'>The Flare, Past Plunder, Goblin Infestation and Alone in the Dark II card texts aren't reproduced in the rulebooks — follow the cards themselves.</p>";
      },
      src: (c) => VC.cite(["Rules p.3, p.17–18", "FAQ p.7, p.11–13, p.21", (c.v.flare.has("ghoul") || c.v.pp === "ghoul") ? "Ghoul p.4–5" : "", c.has("vileghoul") ? "Ghoul p.7" : "", (c.v.flare.has("ghost") || c.v.pp === "ghost") ? "Ghost p.5" : "", (c.has("unicorn") && (c.v.aid === "II" || c.v.unicornArmor)) ? "Unicorn p.4" : "", c.v.shadow === "solo" ? "Unicorn p.5" : ""]) },

    /* ================================================================== */
    { title: "All role variants (players and roles)",
      when: () => true,
      html: () => "<p>★ = recommended for a first game. Except where noted, all normal rules apply. With 4 or fewer players, choose one of these; for a first game, play every role except the Thief.</p>" +
        "<h4>5 and 4 players</h4>" + L([
          "★ <b>Knight vs. Goblins vs. Dragon vs. Cave vs. Thief</b> and ★ <b>Knight vs. Goblins vs. Dragon vs. Cave</b>: standard rules and goals.",
          "<b>Any 3 roles vs. Thief</b>: the Thief plays normally (6 Treasure or Gem tokens); the others use their 3-player variant."
        ]) +
        "<h4>3 players</h4>" + L([
          "★ <b>Knight vs. Goblins vs. Dragon</b>: Dragon gets Past Plunder; all lose if the Cave collapses.",
          "★ <b>Knight vs. Goblins vs. Cave</b>: Knight gets Flare and wins by smashing 5 Crystals and escaping.",
          "<b>Knight vs. Dragon vs. Cave</b>: Knight gets Goblin Infestation (line A) + Monster tokens; move 2 Hunger cubes to Wakefulness (the Cave can't move them back); a killed Knight skips her turns.",
          "<b>Goblins vs. Dragon vs. Cave</b>: Ash Dragon near the map; the Goblins must kill the Dragon.",
          "<b>Any 2 roles vs. Thief</b>: the Thief plays normally and wins by stashing 6 Treasure tokens; the others use their 2-player variant, but no Past Plunder, the Cave's Place Treasure is optional, the Thief gets Flare (shared if someone else has it), and no Sidequests are removed."
        ]) +
        "<h4>2 players</h4>" + L([
          "★ <b>Knight vs. Goblins</b>: Goblins get Past Plunder; Knight: 5 Crystals + escape.",
          "★ <b>Knight vs. Dragon</b>: Knight gets Goblin Infestation (A) + Monsters; Dragon gets Past Plunder; move 2 Hunger cubes; the Dragon also wins if a Goblin Ambush kills the Knight.",
          "<b>Knight vs. Cave</b>: remove Daring and Eagle-Eyed; Knight gets Flare and Goblin Infestation (B) + Monsters; the Cave also wins if a Goblin Ambush kills her.",
          "<b>Knight vs. Thief</b>: Knight gets Goblin Infestation (C) + Monsters; Thief gets Flare; Knight smashes 5 or 6 Crystals (agreed) and escapes; the Thief wins by a Goblin Ambush kill or by stashing as many Treasures as her Crystal goal.",
          "★ <b>Goblins vs. Dragon</b>: Ash Dragon near the map; Goblins get Past Plunder and must kill the Dragon.",
          "<b>Goblins vs. Cave</b>: Goblins get Flare and smash 5 Crystals. <b>Goblins vs. Thief</b>: Flare near the map for both; Goblins 5 Crystals, Thief 6 Treasures.",
          "<b>Dragon vs. Cave</b>: move 2 Hunger cubes (locked). <b>Dragon vs. Thief</b>: Dragon gets Ash Dragon, Thief gets Flare. <b>Cave vs. Thief</b>: Thief gets Flare; the Cave's Place Treasure is optional.",
          "Without a Cave player, both players lose if the Cave collapses."
        ]) +
        "<h4>Solo (the Cave can't be played solo)</h4>" + L([
          "Replace the Cave Reference card with <b>Alone in the Dark</b>.",
          "★ <b>Knight</b>: remove Daring and Eagle-Eyed; take Goblin Infestation (Easy A / Medium B / Hard C), the Monster tokens and the Event and Treasure decks; win with 5 Crystals + escape; lose if killed or the Cave collapses.",
          "★ <b>Goblins</b>: take Flare; win with 5 Crystals. ★ <b>Dragon</b>: Easy moves all 4 Hunger cubes to Wakefulness, Medium 2, Hard none. ★ <b>Thief</b>: take Flare; stash 6 Treasures.",
          "Every solo role loses if the Cave collapses."
        ]) +
        "<h4>Fearsome Foes</h4>" + L([
          "<b>Ghoul</b>: added to any variant for 4+ players (no Cave: it takes Past Plunder; 1 tile per turn); 3 players: any 2 roles vs. Ghoul (their 2-player variant; no Hunger cubes moved; Ghoul gets Flare and any Past Plunder; 10 Fury); 2-player and solo variants of its own (Ghoul p.4–5).",
          "<b>Ghost</b>: added to any variant for 3+ other players (no Cave: she always takes Past Plunder; 1 tile per turn); 3 players: joins a 2-player variant (takes any Past Plunder); 2 players: joins another role's solo variant, no Alone in the Dark (I or II); Goblins vs. Ghost: the Goblins smash 4 or 5 Crystals (agreed) and the Ghost locks one more Artifact; solo with Alone in the Dark II and Flare (Ghost p.5).",
          "<b>Vile Ghoul</b> (Ghoul p.7): replaces the Goblins in any 2+ player variant, using their setup and victory conditions. In any setup with the Knight, she also takes Goblin Infestation (Normal Goblins, line A) + the Monster tokens; if an Ambush kills her, it counts toward the Vile Ghoul's victory. Vile Ghoul vs. Dragon (+any): move none of the Dragon's Hunger cubes. Vile Ghoul vs. Cave: smash 6 Crystals. Vile Ghoul vs. Thief (vs. Cave): the Thief stashes 5 or 6 Treasures (agreed at setup); the Vile Ghoul smashes one more Crystal than that. Solo: Alone in the Dark II + Flare (you may target your own space, 1 movement point each time); smash 5/6/7 Crystals (Easy/Medium/Hard), then escape; you lose if the Cave collapses.",
          "<b>Nightmare Unicorn</b> (Unicorn p.4): replaces the Dragon in any 2+ player variant and is set up normally. If the variant gives the Ash Dragon card, instead put a Unicorn cube from your supply (not the Radiance track) on the first Armor upgrade space: Armor starts at 2, and the Cave can't remove that cube. With no Cave [Ghost]: before the Collapse, place 1 Dark tile only if no Dark tiles were revealed during your turn; during the Collapse, remove 3 tiles regardless. Unicorn vs. Dragon (+any): move no Hunger cubes; the Unicorn plays right after the Dragon (before the Cave); if everyone agrees, one player's goal becomes killing the Unicorn (others' attacks only make him Teleport; a Dragon with that goal must still awaken, surface and escape). Unicorn vs. Thief (or vs. Cave vs. Thief): the Thief wins if he stashes 6 Treasures or kills the Unicorn. Solo: Alone in the Dark II; gain 9 Radiance, then escape; you lose if the Cave collapses.",
          "<b>Cave Ghost</b> (Ghost p.7): replaces the Cave in any variant that includes the Cave, using the Cave's setup and victory conditions; like the Cave, she has no solo variant.",
          "<b>Shadow Unicorn</b>: add to any solo or multiplayer game (not against the Cave or Cave Ghost alone); he isn't counted as a player. Solo: set up your role normally but take no Alone in the Dark card; the Knight takes Goblin Infestation (any line; Monsters recommended) + the Monster tokens; the Goblins, Thief and [Vile] Ghoul take Flare. Your goal becomes killing the Shadow Unicorn; the Knight, Dragon, Thief and [Vile] Ghoul must also escape the Cave (the Dragon must still awaken and surface first). Multiplayer: if everyone agrees, one player may take that goal. If the Cave collapses, everyone loses except the Cave [Ghost] (Unicorn p.5, p.7)."
        ]),
      src: () => "Rules p.2, p.17–18 · Ghoul p.4–5, p.7 · Ghost p.5, p.7 · Unicorn p.4–5, p.7" },

    /* ================================================================== */
    { title: "Difficulty, Collapse, Speed and Campaign variants",
      when: () => true,
      html: (c) => {
        const rows = [];
        const add = (r, label, f, show) => { if ((show !== undefined ? show : c.has(r)) || !c.v.valid) rows.push([label].concat([0, 1, 2, 3, 4].map((i) => "<b>" + VC.levels[r][i] + "</b><br>" + f(i)))); };
        add("knight", c.has("knight") || !c.v.valid ? "Knight (sets Dragon Health / Crystals)" : "Knight levels — used by the Goblins (no Knight): Dragon Health / Crystals", (i) => [3, 4, 5, 6, 7][i] + " Health / " + [4, 4, 5, 6, 6][i] + " Crystals" + (i === 0 ? ", Str 2 to smash" : i === 4 ? ", Str 4 to smash" : ""), c.has("knight") || c.has("goblins"));
        add("goblins", "Goblins (sets Knight Health)", (i) => [5, 6, 7, 8, 9][i] + " Health", c.has("goblins") && c.has("knight"));
        add("dragon", "Dragon (Wakefulness needed)", (i) => [7, 9, 11, 13, 13][i] + (i === 4 ? " + Shriek on 3 turns" : ""));
        add("cave", "Cave", (i) => ["remove 2 of each type; 3 Crystal tiles", "remove 1 of each type; 4 Crystal tiles", "5 Crystal tiles", "5 + 4 Hatred tokens", "5 + 8 Hatred tokens"][i]);
        add("thief", "Thief (Treasures to stash)", (i) => ["4", "5", "6", "7, 1st not on an upgrade", "8, first 2 not on upgrades"][i]);
        add("ghost", "Ghost (Artifacts)", (i) => ["3", "4", "5", "5, no Ghost card", "6, no Ghost card"][i]);
        add("caveghost", "Cave Ghost", (i) => ["remove 2 of each type (incl. Ghost); 3 Crystal tiles", "remove 1 of each type (incl. Ghost); 4 Crystal tiles", "5 Crystal tiles", "5 + 4 Hatred", "5 + 8 Hatred"][i]);
        add("ghoul", "Ghoul (Fury goal, max 14)", (i) => ["5", "6", "7", "7", "8"][i] + " + players" + (i >= 3 ? ", 2 dice" : ""));
        add("vileghoul", "Vile Ghoul (Knight / Dragon Health / Crystals)", (i) => ["5 / 3 / 3", "6 / 4 / 4", "7 / 5 / 5", "7 / 5 / 5, 2 dice", "8 / 6 / 6, 2 dice"][i]);
        add("unicorn", "Nightmare Unicorn (Radiance)", (i) => ["7", "8", "9", "10", "11"][i]);
        return "<p>Lower levels make a role easier, higher ones harder. Standard is the default; with everyone on Standard you don't need the Difficulty cards.</p>" +
          tbl(["Role", "Easiest", "Easy", "Standard", "Hard", "Expert"], rows, "diff") +
          L([
            "No Knight: the Goblins use the Knight's levels to set the Dragon's Health or the Crystals to smash.",
            "Hard/Expert target Health: give the card to that player to track the extra Health. Hatred tokens: any spare pieces (duplicate Treasure or Crystal tokens). Leftover Hatred tokens don't stop the Collapse starting, but the Cave can't win until they're gone (FAQ p.21).",
            "Cave/Cave Ghost tile removal: from Ambush, Crystal, Event, Treasure and Vault types — never the Entrance, Ghost tiles (Cave) or Terrain tiles (FAQ p.21). The Cave Ghost removes Ghost tiles too, at random, facedown to the box (Ghost p.7)."
          ]) +
          "<h4>Collapse Variant</h4>" + L(["Randomly remove Cave tiles during setup (before adding Crystal tiles) to bring the Collapse sooner; 2 to 4 tiles is recommended."]) +
          "<h4>Speed Variants</h4>" + L(["Shorter game: everyone at Easy or Easiest. Longer game: everyone at Hard or Expert. (Buttons in the configurator.)"]) +
          "<h4>Campaign Variant</h4>" + L(["Everyone starts at Easiest. Each time you win, move up a level and play at it next game, whatever role you play; the others stay put. The first player to win at Expert is declared <b>Your Vastness</b>."]);
      },
      src: () => "Rules p.19 · FAQ p.21 · Ghost p.5, p.7 · Ghoul p.5, p.7 · Unicorn p.4" },

    /* ================================================================== */
    { title: "Terrain Variant",
      when: (c) => c.mod("terrain"),
      html: (c) => "<h4>Placing Terrain</h4>" + L([
          "A Terrain tile is placed the first time each round an Event tile is revealed, regardless of which player revealed it. Never once the Collapse has begun.",
          (c.v.noCave ? "No Cave player: the player who revealed the Event tile chooses and places it." : "The Cave always chooses and places Terrain tiles."),
          "As close as possible to the piece that revealed the Event tile; after filling new open edges with Cave tiles; never touching another Terrain tile (not even corner to corner); sharing at least one edge with a Cave tile. No valid spot: no Terrain.",
          "Terrain edges are open for movement but don't prompt Dark tiles — except the Canyon's bridge, treated as a Lit tile (fill its open spaces with Dark tiles when placed, unless the Collapse has begun)."
        ]) +
        "<h4>Terrain rules</h4>" + L([
          "Terrain tiles are neither Lit nor Dark; they may hold several spaces. Everyone may move and attack through them, unless a tile says otherwise. Movement between Terrain and Cave tiles needs an edge without a wall, and neither space impassable.",
          "Once per action or Encounter, any player may leave a Terrain tile across any edge — even onto an open space, which gets a Dark tile as if next to a Lit tile (the Knight still reveals and resolves it as an Encounter).",
          "Collapse: a Terrain tile can be removed only if half or more of its edges are exposed (remover's choice); it counts toward the tiles removed. Cave-In or Wrath removes a Terrain tile, but it may be placed again later.",
          has(c, "cave", "caveghost") ? "Rockslide tokens may go on any edge of a Terrain tile that touches another tile, unless that shared edge has a wall (FAQ p.17)." : ""
        ]) +
        tbl(["Terrain", "Effect"], [
          ["Canyon", "Bridge space in the center must touch a Cave tile; a Dark tile goes on the bridge's far side. The two outer spaces are impassable. Surfaced, the Dragon may cross one with one Wing; the Thief may Climb across; neither ends there."],
          ["Lake", "A Goblin Tribe entering loses 1 Population; on the Lake it counts Lake spaces as Lit for movement."],
          ["Magma", "Knight ending her turn there loses 1 Health (not if at 1). A Tribe loses 1 Population each time it exits a Magma space; ending its turn there drops it to 0. The Thief ending his turn there is killed. The Dragon is unharmed. Only at the end of the player's own turn (FAQ)."],
          ["Mushroom Forest", "Pieces inside are protected from all outside effects and can only attack a piece in the same space (blocks the Bows, Hex, Hiding Spots, Hiss, Slap, Giant Bats, Hand Crossbow). It doesn't protect itself: Wrath still hits it (FAQ)."],
          ["Pits (3 pieces)", "Place all three: one as close as possible to the revealer, the others as far from it and each other as possible; if only 1 or 2 fit, place a different Terrain. Each Pit is adjacent to the other two but gives no visible path. Never end a turn on a Pit. Using one costs at least 3 movement (enter, travel, exit); if you can't complete all of it this turn, you can't enter the first Pit (FAQ p.20); the Dragon needs two movements. Collapsed one at a time; with two gone, the third is dead."],
          ["River", "Entering it, you may move free with the current (arrows) to any other River space; against the current costs normal movement. A Tribe entering loses 1 Population, and 1 more per space against the current."]
        ], "terrain") +
        L([
          has(c, "ghoul", "vileghoul") ? "<b>[Vile] Ghoul</b>: River free with the current; moves through Pits normally; can't enter the Canyon's impassable spaces; ending a turn on Magma = skitter, nothing else." : "",
          has(c, "unicorn") ? "<b>Nightmare Unicorn</b>: River free (doesn't count against the Move); ending any Move or Teleport on Magma or a Pit just forces a Teleport; no Pit-to-Pit; never onto the Canyon's impassable spaces; can't Teleport onto a Mushroom Forest space with another player, nor out of the Forest onto any occupied space." : "",
          has(c, "ghost") ? "<b>Ghost</b>: River free for you and possessed pieces; you may move through Pits, but Telekinesis can't move Artifacts onto or through them; you may enter the Canyon's impassable spaces but not end there (Artifacts can't); Telekinesis and Possession can't target pieces in the Mushroom Forest, and a possessed piece entering it ends the possession turn; Magma doesn't affect you or Artifacts." : ""
        ]),
      src: (c) => VC.cite(["Rules p.16", "FAQ p.17, p.20", has(c, "ghoul", "vileghoul") ? "Ghoul p.4" : "", has(c, "unicorn") ? "Unicorn p.4" : "", has(c, "ghost") ? "Ghost p.4" : ""]) },

    /* ================================================================== */
    { title: "Easily forgotten rules",
      when: () => true,
      html: (c) => "<h4>Everyone</h4>" + L([
          "Before the Collapse, open edges on Lit tiles are always filled with Dark tiles, whoever revealed them. Once the Collapse begins, never.",
          "A revealed tile must be oriented to connect back to the Entrance through Lit tiles if possible; if it can't, any legal orientation.",
          c.v.noCave ? "No Cave player: each player places 1 Dark tile at the end of their own turn (see your tile rule above); in the Collapse each removes tiles instead." : "",
          c.v.solo && c.v.aid ? "Solo: place or remove tiles by the Alone in the Dark" + (c.v.aid === "II" ? " II" : "") + " card instead of — not in addition to — the normal placement." : ""
        ]) +
        (c.has("knight") ? "<h4>Knight</h4>" + L(["You must reveal Dark tiles you enter.", "Out of Encounters, you can't move (you can still place cubes for things that need no movement or Encounter).", "Never below 2 Hero cubes.", "A Bomb lets you attack the underground Dragon but doesn't attack by itself — you still need the Strength.", "In the Collapse, or once he's surfaced, no Bomb is needed; surfaced, attack him once per Encounter."]) : "") +
        (c.has("goblins") ? "<h4>Goblins</h4>" + L(["Shuffle the War deck every turn; Monster and Secrets decks only when they run out.", "Several Tribes overpopulating: still only one scatters.", "A Monster you don't assign is discarded — never kept in hand."]) : "") +
        (c.has("dragon") ? "<h4>Dragon</h4>" + L(["Only one Sloth cube per track per turn.", "Pride's three parts are separate — only Slither moves cubes between them; up to 4 cubes from revealing Event tiles, only 1 each from placing a Gem or not moving.", has(c, "goblins") ? "" : slitherLine(c)]) : "") +
        (has(c, "cave", "caveghost") ? "<h4>" + (c.has("caveghost") ? "Cave Ghost" : "Cave") + "</h4>" + L(["Asked for several Dark tiles, draw back up to 3 after <b>each</b> tile, not after all of them.", "On your turn, Crystal tiles before any other tile; on others' turns you needn't.",
          c.has("ghost") ? "Ghost in play: a Ghost tile in your hand must be placed before any other tile — Crystal tiles included — even on other players' turns (Ghost p.4)." : ""]) : "") +
        (c.has("thief") ? "<h4>Thief</h4>" + L(["Carried Treasures and Gems count as on the map until stashed.", "Pickpocket or Backstab each other piece only once per turn.", "Loot Drop Level resets to 3 only when you stash — not when you pick up Treasure or die."]) : ""),
      src: (c) => VC.cite(["Rules p.23", "FAQ p.3", c.has("ghost") ? "Ghost p.4" : "", c.has("caveghost") ? "Ghost p.6" : ""]) },

    /* ================================================================== */
    { title: "Key FAQ rulings, errata and editions",
      when: () => true,
      html: (c) => "<h4>Errata (FAQ, 12 July 2019) — already applied on this page</h4>" + L([
          "<b>Forced Movement</b> (FAQ p.4): the second printing's General Rules replace all older movement-by-others rules; a piece forced off a removed tile is moved the shortest distance by the current player. This also replaces the Cave chapter's older wording that a player on a collapsing tile “may first move to an adjacent tile” (Rules p.12).",
          has(c, "knight") ? "<b>Enchanted Bow</b> (FAQ p.9): it may also shoot through empty spaces; cardinal directions only." : "",
          has(c, "dragon") ? "<b>Flame Wall</b> (FAQ p.14): affects a player only the first time they enter its space each turn." : "",
          has(c, "goblins") ? "<b>Reveal</b> (FAQ p.13): a Tribe can't reveal on a tile with another player's piece, even one it wouldn't attack." : ""
        ]) +
        "<h4>Clarifications worth knowing</h4>" + L([
          "The Collapse begins on the turn right after the last tile is placed (the Cave chapter says “your next turn”; the FAQ settles it) (FAQ p.3).",
          "The four starting tiles come off the stack before Crystal and Vault tiles are added; piles may be stacked in any order (FAQ p.2–3).",
          "Cardboard, wooden and plastic versions of pieces may be mixed freely (FAQ p.3).",
          has(c, "cave", "caveghost") ? "Placing Crystal tiles first on your own turn is a rule, but no component enforces it — remind new Cave players (FAQ p.17)." : ""
        ]) +
        "<h4>Editions</h4>" + L([
          "First printing: yellow Treasure tokens, 2 mm Goblin discs, purple 10 mm Vault tokens, wooden Dragon die, black Thief die.",
          "Second printing: natural-wood Treasure tokens, 5 mm discs, gray 5 mm Vaults, plastic Dragon die, gray Thief die; revised rulebook, rule sheets, boards and cards (the General Rules chapter was added; its only rules change is Forced Movement). Third printing: dark-brown Treasure tokens, otherwise the same."
        ]) +
        "<h4>Not covered by these rulebooks</h4>" + L([
          "The FAQ has entries for a separate <i>Bonus Cards</i> set (revised Javelin, revised Cave Bread, Ground Kraken and others). Its card text isn't in these books (the FAQ's revised-Javelin ruling is under The Knight); use them only if you own that set.",
          "Mixing roles with <i>Vast: The Mysterious Manor</i>: see that game's rules and the <a href='../vastmanor-setup/'>Mysterious Manor page</a>."
        ]),
      src: () => "FAQ p.2–4, p.9–11, p.13–14, p.17 · Rules p.12" }
  ];

  function v2(c) { return !(c.v.ghostMode === "2" || c.v.ghostMode === "solo"); }
})();
