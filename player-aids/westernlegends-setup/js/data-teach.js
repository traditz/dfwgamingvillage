/* =============================================================================
   Western Legends — Setup & Reference Utility · teaching script
   A ~5-minute read-aloud teach for the configuration selected, in teaching order.
   Rules content: written from the Complete Rules (cited in the setup and reference).
   Sections: { id, when(c), h, body(c) }. Variant and game-mode inserts: "variants", "mode".
   ============================================================================= */
WL.teach = {
  intro: "A ~5-minute teach for the exact sets, player count, length, variants and mode selected above. Read it aloud, or hit Copy and tweak it. Every rule in it comes from the Complete Rules cited in the setup and reference.",
  sections: [
    { id: "hook",
      h: "The hook — and how you win",
      body: (c) => "<p>Welcome to the Wild West. Each of you is a real legend of the frontier, and you’re racing for <b>Legendary Points</b> — LP. Tonight the end marker sits on <b>" + c.len + " LP</b>. When someone ends their turn at " + c.len + " or more, we finish the round, everyone gets one last turn, and then we do final scoring. Most LP wins.</p>" +
        "<p>LP comes from almost everything you do: winning duels, beating bandits, delivering cattle, " + (c.bt ? "improving your homestead" : "selling gold at the Bank") + ", winning at the Saloon" + (c.lss ? ", completing legendary stories" : ", completing story cards") + ". Some only counts at the end: upgraded weapons and mounts" + (c.legItems ? ", LP printed on Legendary items" : "") + ", legendary tokens" + (c.noDeeds ? "" : ", deeds") + ", 1 LP for every " + (c.mode === "golden" ? "$40" : "$60") + " you still have" + (c.bt ? ", 1 LP for every gold nugget you’re holding" : "") + ", your row on the Marshal track, 1 LP for whoever is furthest along the Gambler track (all tied players score it), and 3 LP for the most Wanted player — every other Wanted player gets 1 LP, and if the most Wanted is tied, every Wanted player gets 1 LP instead. And you lose 1 LP for every wound you’re still carrying" + (c.noInjury ? "" : ", plus any LP loss printed on an injury card") + ".</p>" +
        "<p>Your <b>character card</b> tells you " + (c.bt ? "what you start with (in Border Town we ignore its starting location: once turn order is set, each of you picks any unoccupied space)" : "where you start and what you start with") + " — some of you begin with money, an item, or a point on the Marshal or Wanted track. Every Legend also has one special ability, but it only switches on once you reach <b>5 LP</b>: that’s the star on the track. Items help too: a <b>mount</b> lets you move farther, a <b>weapon</b> helps in fights, and you can carry up to three pieces of other gear.</p>"
    },
    { id: "turn",
      h: "The shape of a turn",
      body: (c) => "<p>Every turn has three parts. <b>Start:</b> the Train chugs to its next stop; then you take income — $20, or two poker cards, or $10 and one card — and pick which weapon and mount you’re using this turn.</p>" +
        "<p><b>Actions:</b> you take <b>three actions</b>, in any order, and you can repeat them." + (c.lss ? " Once a turn you may also roll the <b>risk die</b> for a quick bonus — we’ll come back to that." : "") + "</p>" +
        "<p><b>End:</b> resolve any end-of-turn abilities" + (c.lss ? "; story conditions tied to where you stand are checked, and a finished legendary story card resolves" : "") + "; then, if you’re Wanted, you score LP for your row on the Wanted track; and you discard down to your hand size — five cards, minus one for each wound. Then we check whether you’ve hit " + c.len + " LP.</p>"
    },
    { id: "actions",
      h: "Your three actions — and why you’d take them",
      body: (c) => "<p>There are four kinds of action.</p><ul>" +
        "<li><b>Move.</b> Two spaces on foot, more on a horse. Diagonals count, you can’t cross the mesas, and walking into a bandit or another NPC stops you dead and starts a fight.</li>" +
        (c.bt
          ? "<li><b>Location actions</b> — the board is full of them. <b>Work</b> at any location for $10. The <b>Trading Post</b> sells weapons, mounts and gear from both store stands — and upgrades, which are worth LP at the end. <b>Mines</b> let you roll for gold, <b>Ranches</b> give you a cattle token to drive, and the <b>Saloon</b> is poker and faro. There’s no Bank, Cabaret or Doctor out here: your <b>homestead</b> takes their place.</li>"
          : "<li><b>Location actions</b> — the board is full of them. <b>Work</b> at any location for $10. The <b>Bank</b> buys gold nuggets for $20 and 1 LP each. The <b>Cabaret</b> sells LP at $30 apiece. The <b>Doctor</b> heals every wound for $10 and hands you a card for each. The <b>General Store</b>" + (c.has("au") ? " and the <b>Trading Post</b>" : "") + " sell weapons, mounts and gear — and upgrades, which are worth LP at the end. <b>Mines</b> let you roll for gold, <b>Ranches</b> give you a cattle token to drive, and the <b>Saloon</b> is poker and faro." + (c.noDeeds ? "" : " Many locations also have a <b>deed</b> you can claim: a one-shot power that scores at the end.") + "</li>") +
        "<li><b>Card actions.</b> Any card that says ACTION costs one action to use.</li>" +
        "<li><b>Fight another player</b> in your space: Duel for 2 LP, Rob them for half their money or half their gold nuggets, rounded up (plus one cattle or longhorn token they’re carrying, and you gain a Wanted point), or — if you’re a Marshal and they’re Wanted — Arrest them.</li></ul>" +
        (c.noTrader ? "" : "<p>The <b>Traveling Trader</b> wanders from region to region; anywhere in his region you can shop his stock and upgrade any weapon or mount" + (c.legItems ? " — and he sells <b>Legendary items</b> for $40 each" : "") + ". Then he moves on.</p>")
    },
    { id: "core",
      h: "The heart of it: law, disorder and poker-card fights",
      body: (c) => "<p>The big choice is which side of the law you’re on — or neither. <b>Outlaws</b> earn Wanted points by " + (c.bt ? "robbing the Train, rustling cattle, or robbing each other" : "robbing the Bank or the Train, rustling cattle to the wrong Ranch, or robbing each other") + ". Wanted players score LP <b>every turn</b>, more the higher their row. But the Sheriff hunts them, and an Arrest strips all your Wanted points, your cattle, half your cash and half your gold.</p>" +
        "<p><b>Marshals</b> earn Marshal points by beating bandits, wrangling cattle to a Rail Station and arresting Wanted players. They collect cash and LP as they climb, and score their row at the end. Gain a single Wanted point as a Marshal and you’re an outlaw now.</p>" +
        "<p>Every fight uses <b>poker cards</b>: each side plays one facedown, you reveal, and the higher card wins. Against another player, the attacker plays first and the target may decline instead, which hands the attacker the win; the active player also wins ties. Against bandits and other NPCs, the player on your right draws fight cards for the NPC, and the NPC wins ties. The loser takes a wound and draws a poker card, so even losing refills your hand. Poker cards are everything here: fight values, special actions, reactions, and your hand at the Saloon.</p>"
    },
    { id: "au", when: (c) => c.has("au") && !c.bt,
      h: "Ante Up — Buzzard Gulch",
      body: () => "<p>Off to the side is <b>Buzzard Gulch</b>: a third town with the <b>Trading Post</b>, a Saloon and the Marshal’s Office. Around it lies the <b>Frontier</b>, with a Ranch, a Rail Station, the <b>Outlaw Camp</b> and the frontier spaces: discard poker cards adding up to at least the token’s number plus the space’s number to flip a frontier token for its reward. The <b>Outlaw Camp</b> is where rustlers sell stolen cattle. Get there by rail — $10 to jump to the other station, then a move — or by a slow <b>Trail</b> through the mountain passes.</p>"
    },
    { id: "bm", when: (c) => c.lss,
      h: "Blood Money — legendary stories and the risk die",
      body: () => "<p>On top of the story deck sits a <b>legendary story card</b>. While it’s showing, its game effect is in force, and it lists two or three conditions. Meet one on your turn, drop a story disc beside it, and take its reward — but each condition can only be claimed once. When every condition is filled, the card flips: everyone who chipped in gets the payoff, and a new story begins.</p>" +
        "<p>Story points move you along the short <b>Story track</b>: it moves the Sheriff, spawns bandits, and at the end gives you a point of your choice before you loop back. You also earn them from the <b>risk die</b>: once a turn, pick a bonus — a card, $10 or a free step — then roll, and take Story points, wounds or both.</p>"
    },
    { id: "csc", when: (c) => c.csc,
      h: "Story cards",
      body: (c) => "<p>Two <b>story cards</b> sit on the board, triggers faceup. When you meet a card’s trigger on your turn, you may put one of your story discs on it, one disc per turn. It takes <b>" + (c.p <= 4 ? "two" : "three") + "</b> discs to finish a card. Then whoever finished it reads it out, every contributor collects the reward, bandits may spawn, and the Sheriff may ride.</p>"
    },
    { id: "small", when: (c) => c.has("ffe") || c.has("gbh") || c.has("wbe") || c.has("promo"),
      h: "The small boxes",
      body: (c) => {
        const parts = [];
        if (c.has("ffe")) parts.push("<b>Fistful of Extras</b> adds Legends, items and more Man in Black cards, plus a bag for the legendary tokens");
        if (c.has("gbh")) parts.push("<b>The Good, The Bad, and The Handsome</b> adds Legends, Legendary items and story cards");
        if (c.has("wbe")) parts.push("<b>Wild Bunch of Extras</b> adds Legends, items, Legendary items and story cards");
        if (c.has("promo")) parts.push("the <b>promos</b> add a few extra cards, such as Man in Black cards and the Carbine");
        return "<p>" + parts.join("; ") + ". That mostly means more characters to draw from and more gear on the shelves — the rules don’t change.</p>";
      }
    },
    { id: "altpoker", when: (c) => c.v("altpoker"),
      h: "Our poker deck",
      body: () => "<p>We’re using the expansion versions of some poker cards. They have the same suits and values as the cards they replace, just different effects, so read each one as you draw it.</p>"
    },
    { id: "mib", when: (c) => c.mib,
      h: "Two players — the Man in Black",
      body: () => "<p>With two of us, a third rider joins: the <b>Man in Black</b>. After we’ve both taken a turn, we draw and resolve one of his cards. He counts as a player for game effects, never runs out of money or gold, draws three fight cards in fights, makes our poker cards worth one less against him, and wins every tie. We can Duel or Rob him. If he has the most LP at the end — or ties — he wins.</p>"
    },
    { id: "unique", when: (c) => c.v("unique"),
      h: "Unique events",
      body: () => "<p>The event deck has some <b>Unique events</b> shuffled in; they place their own tokens on the board. Read each one as it comes up.</p>"
    },
    { id: "variants", when: (c) => ["bandit", "gang", "goal", "hsp", "joker", "sheriff", "title"].some(v => c.v(v)),
      h: "Variants we’re using",
      body: (c) => "<ul>" + [
        c.v("goal") ? "<b>Goal cards.</b> Each of you has 3 secret goals for your character. When you meet one, flip it — no action needed — and you get legendary tokens: as many as goals you’ve completed so far, keeping one more than you had, up to three. Unfinished goals cost nothing." : "",
        c.v("gang") ? "<b>Gangs and posses.</b> There’s a new action, <b>Recruit</b>: $20 buys a Marshal a posse at the Sheriff’s" + (c.has("au") ? " or Marshal’s" : "") + " Office" + (c.has("au") ? ", or a Wanted player a gang at the Outlaw Camp" : "") + ". It draws you an extra poker card at the start of a fight (a posse only against bandits, claim jumpers, outlaws, or when you make an arrest attempt), and once it can cancel the wounds from a fight you lose — then it’s discarded. One at a time, and switch sides and it’s gone." : "",
        c.v("bandit") ? "<b>Named bandits.</b> When you ride into a bandit, flip a bandit card and check the number under that bandit — it might add an effect, a bonus or a penalty to the fight. And whoever spawns bandits chooses which ones and where." : "",
        c.v("sheriff") ? "<b>The Sheriff has a personality.</b> The face-up sheriff card changes how he behaves. Beat him in a fight and we draw a new sheriff card." : "",
        c.v("title") ? "<b>Title card.</b> The title card we revealed changes a rule for the whole game — let’s read it out now. Where it disagrees with the rulebook, the card wins." : "",
        c.v("hsp") ? "<b>High Stakes Poker.</b> At the Saloon you can also start a bigger game: $10 to ante, the Saloon puts in $40, and after the flop everyone pays $20 more or folds. The winner takes the pot plus 1 LP and 1 Gambler point." : "",
        c.v("joker") ? "<b>Jokers.</b> Two Jokers are in the poker deck. Play one and reveal a card from your hand: the Joker copies it, and you keep the real card. On the flop, or when the dealer plays one, they’re wild for everyone." : ""
      ].filter(Boolean).map(x => "<li>" + x + "</li>").join("") + "</ul>"
    },
    { id: "mode", when: (c) => c.mode !== "std",
      h: (c) => "Tonight’s game mode: " + c.modeName,
      body: (c) => {
        if (c.mode === "serenade") return "<p><b>Serenade of the Six Guns</b> is all about shootouts between players. The characters and items are picked for fighting, and the only story cards in play are triggered by starting a fight with another player. Everyone starts with <b>two extra poker cards</b>. There’s no Traveling Trader and no deeds, and Legendary items can’t be bought — you only get them from card effects.</p>";
        if (c.mode === "golden") return "<p><b>The Golden Rule</b>: whoever has the gold makes the rules. It’s about mining, ranching, gambling and deeds. At the end, cash is worth <b>1 LP per $40</b> instead of $60, and whoever has the greatest combined value of items, money and deeds gets <b>1 more LP</b>. The only story cards are triggered by spending $80 or more in a town with one action. And there are no injury cards this game.</p>";
        if (c.mode === "law") return "<p><b>Law and Disorder</b>: white hats against black hats. The characters are ones who begin the game Wanted or as Marshals, and gangs and posses are in. One special rule, <b>Infamous</b>: if you’re Wanted and get Arrested, you can discard your whole hand to drop back to the first space of the Wanted track instead of losing all your Wanted points — and the Sheriff leaves you alone for the rest of that turn. There are no deeds, and the story cards are triggered by fights between players or by gaining Marshal or Wanted points.</p>";
        if (c.mode === "risky") return "<p><b>Risky Business</b> is built around the story cards and the risk die. The characters are picked to use them, every event card is in, and each of you has goal cards. One special rule: whenever you reach <b>space 4 of the Story track</b>, you get <b>1 LP</b> on top of the reward you choose there.</p>";
        return "<p><b>Who Runs Border Town?</b> We play only on the Buzzard Gulch board. No Bank, Cabaret, Doctor, Traveling Trader or deeds. Mines and Bandit Hideouts are moved onto this board. On a <b>Frontier</b> space with a frontier token, spend an action and discard poker cards adding up to at least the token’s number plus the space’s number to flip the token for its reward. The <b>Outlaw Camp</b> is where rustlers deliver stolen cattle. Or, on a Frontier space with no frontier token and no other player’s homestead, spend an action and $40 to found your <b>homestead</b> — once per game. At your homestead, <b>Improvement</b> buys 1 LP per $30, and <b>Recuperate</b> clears all your wounds and draws you a card for each. Gold nuggets are cash here: spend them as $20 each, they don’t count toward the $120 limit, and each one you still hold at the end is worth 1 LP. The Train just loops Rail Station, Mountain Pass A, Mountain Pass C. Any card that names a place on the big board means its Buzzard Gulch equivalent." + (c.p === 2 ? " And with two of us, there’s no Man in Black — we play it straight." : "") + "</p>";
      }
    },
    { id: "later",
      h: "Don’t worry about these until they come up",
      body: (c) => "<ul>" + [
        "<b>Bonus and Reaction text</b> on cards — the card tells you when it works.",
        "<b>Events</b> — whoever first crosses an event marker on a track flips one, and we resolve it together.",
        "<b>Outlaws, claim jumpers and high rollers</b> — event tokens with their numbers printed on them.",
        c.noInjury ? "" : "<b>Injuries</b> — only if you take more than three wounds.",
        "<b>Faro</b> — the Saloon’s other game; we’ll walk through it the first time.",
        "<b>Train heists</b> — the train encounter card says what you win or lose.",
        "<b>Gambler track rewards</b> — printed right on the track.",
        "<b>Ruins and Repair</b> — only if something gets destroyed.",
        "<b>Legendary tokens</b> — keep them facedown; you can hold three."
      ].filter(Boolean).map(x => "<li>" + x + "</li>").join("") + "</ul>"
    }
  ]
};
