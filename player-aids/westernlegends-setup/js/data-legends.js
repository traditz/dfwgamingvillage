/* =============================================================================
   Western Legends — Setup & Reference Utility · Legends and items lookup
   Appendix V Legends of the West (Rules p.60–81), Appendix VI Items of the West
   (p.81–87) and Appendix VII Legendary items (p.88–95), as printed. Each entry
   carries its set (the italic line under its name) for gating by sets owned.
   Entry fields: n name, set, p page, ab ability ("@A " = red ACTION:, "@R " = red
   Reaction:), notes (the book's bullet clarifications), start (a start mentioned in
   the book's Tips and Tricks), type/cost/lp/mv/mvU, up + upName (upgraded side, its
   name from the card pictured), faces (die-face lines printed with icons),
   sp (references Story points: removed in the Core Story Card variant, p.14),
   risk (uses the risk die), flag (a difference between the text and the card picture).
   Loaded after data-modes.js (uses WL.modeInfo for game-mode lists).
   ============================================================================= */
WL.legendList = [
  {"n": "Ada Curnutt", "set": "wbe", "p": 60, "ab": "At the start of your turn, move a number of spaces up to your level on the Marshal or Wanted track (level is determined by the row your cube is on)."},
  {"n": "Al Swearengen", "set": "bm", "p": 60, "ab": "Deeds cost you $10 less to purchase. Once per turn, you may discard a poker card to use the action ability of 1 of your deeds.", "notes": ["When Al uses his ability to activate one of his deeds, the deed is still flipped as if it were activated in the normal way."]},
  {"n": "Allan Pinkerton", "set": "ffe", "p": 61, "ab": "@A Choose a player within 1 space to show you their poker cards. That player must discard all cards of a value of your choice."},
  {"n": "Annie Oakley", "set": "core", "p": 61, "ab": "At the start of a fight with another player, that player must discard 1 poker card or gain 1 wound.", "notes": ["The player that Annie targets with a Fight Another Player action always makes the choice for her ability.", "A player can choose the discard a card option even if they do not have cards in their hand.", "A player can choose to gain a wound even if they are already at maximum wounds. This could result in the player gaining an injury instead. If they are already injured, they will be forced to discard a card per the rules for gaining an injury."]},
  {"n": "Bass Reeves", "set": "core", "p": 62, "ab": "At the start of your turn, draw 1 poker card."},
  {"n": "Bat Masterson", "set": "ffe", "p": 62, "ab": "At the start of your turn, you may add or remove a bandit from any Bandit Hideout to move up to 2 spaces.", "notes": ["It is possible for Bat to use his ability to place a bandit in a Bandit Hideout and then move into it, triggering a fight before he takes his standard 3 actions for the turn."]},
  {"n": "Belle Starr", "set": "ffe", "p": 63, "ab": "In a fight against a bandit, guard, or the Sheriff, decrease the value of the fight card played against you by 2. After you win a fight against a bandit, you may choose to gain 1 Wanted point instead.", "notes": ["Belle’s ability only affects the fights specifically named in her ability text. Other fights are not affected by her ability. For example, NPC characters such as claim jumper and outlaw tokens, the Man in Black, and fights triggered by story cards are not affected."]},
  {"n": "Ben Hodges", "set": "bm", "p": 63, "ab": "The first time you use an action on an item or a poker card each turn, gain $20."},
  {"n": "Billy the Kid", "set": "core", "p": 64, "ab": "After you end a Move action in a space with one or more players, a player of your choice in that space must give you $10 or 1 poker card.", "notes": ["Unlike Annie Oakley’s ability, Billy is the one who makes the choice as to whether the player targeted by his ability gives him 1 poker card or $10.", "His card back, reprinted on p.52, gives his start: either Bandit A hideout space, with 2 poker cards, 1 Revolver and 2 Wanted points (the card says “Do not gain rewards” for those points)."]},
  {"n": "Bloody Knife", "set": "core", "p": 64, "ab": "You may move through a mesa as though it were a single space. You may not end a Move action in a mesa. After you move through a mesa, lose 1 wound."},
  {"n": "Buckshot Roberts", "set": "bm", "p": 65, "ab": "If you start your turn with an injury, draw 1 poker card and gain 1 action."},
  {"n": "Buffalo Bill Cody", "set": "ffe", "p": 65, "ab": "If you start your turn outside of a town, gain 1 gold nugget."},
  {"n": "Butch Cassidy", "set": "gbh", "p": 66, "ab": "After you Rob another player, you may steal 1 non-mount/non-weapon item that you do not already own instead of half of their money or gold nuggets. After you Arrest another player, you may steal half of that player’s money or gold nuggets."},
  {"n": "Calamity Jane", "set": "core", "p": 66, "ab": "Your hand size is increased by 1. After you contribute to a story card, draw 1 poker card."},
  {"n": "Charley Parkhurst", "sp": true, "set": "bm", "p": 67, "ab": "Once on your turn, you may reroll any 1 die. After you gain the result of rolling the risk die, gain 1 Story point."},
  {"n": "Dave Rudabaugh", "set": "wbe", "p": 67, "ab": "At the end of a Move action you may move 1 additional space. The first time you end a Move action in the same space as another player, draw 1 poker card.", "notes": ["The second part of Dave’s ability to draw 1 poker card can be used once during each of his turns."]},
  {"n": "Doc Holliday", "set": "core", "p": 68, "ab": "After you gain any number of wounds, draw 1 poker card. Wounds do not reduce your hand size."},
  {"n": "Elfego Baca", "set": "bm", "p": 68, "ab": "While you have an upgraded weapon, decrease the value of a card played against you in a fight by 1. The first time you would gain any number of wounds on your turn, cancel 1 of those wounds."},
  {"n": "Fee Lee Wong", "set": "au", "p": 69, "ab": "Your hand size is increased by 1. You can carry a maximum of $180."},
  {"n": "Isom Dart", "set": "ffe", "p": 69, "ab": "If you start your turn with at least 1 cattle token, you may gain 1 additional action. If you do, you must discard all cattle tokens at the end of your turn.", "notes": ["All cattle tokens, whether they were gained during the turn the bonus action was gained or during a previous turn, are discarded at the end of a turn where Isom gains a bonus action.", "Longhorn tokens are not cattle tokens for the purpose of resolving Isom’s ability."]},
  {"n": "James “Bloody Arm” Beckwourth", "sp": true, "set": "bm", "p": 70, "ab": "After you roll the risk die, draw 1 poker card. The first time you win a fight on your turn, gain 1 Story point."},
  {"n": "Jefferson “Soapy” Smith", "set": "au", "p": 70, "ab": "After you gain a Gambler point, roll 1 prospecting die and gain the result. If you roll gravel, refill your hand.", "notes": ["From the book’s tips (p.70): the ability works every time you gain a Gambler point, even if it is on another player’s turn."]},
  {"n": "Jesse James", "set": "core", "p": 71, "ab": "In a fight outside of a town, decrease the value of a card played against you by 1. In a fight against another player, you win all ties."},
  {"n": "Joaquin Murrieta", "set": "gbh", "p": 71, "ab": "If you are a Wanted player, gain 1 Legendary point (LP) after you fight a Marshal player. If you are a Marshal player, gain 1LP after you fight a Wanted player."},
  {"n": "Johnny Ringo", "set": "wbe", "p": 72, "ab": "At the end of a fight, lose 1 wound. At the end of a fight against another player, that player gains 1 wound.", "notes": ["From the book’s tips (p.72): his ability will not affect Doc Holliday."]},
  {"n": "Judge Roy Bean", "set": "gbh", "p": 72, "ab": "In a fight against a bandit, guard, or the Sheriff, they must choose and reveal their card first. In a fight against a bandit, guard, or the Sheriff, you win all ties."},
  {"n": "Kit Carson", "set": "core", "p": 73, "ab": "At the end of a Move action, you may move 1 additional space. In a fight outside of a town, decrease the value of a card played against you by 1."},
  {"n": "Lottie Deno", "sp": true, "set": "bm", "p": 73, "ab": "After you use a Bonus effect on a poker card, gain 1 Story point."},
  {"n": "Lozen", "start": "starts Wanted", "set": "bm", "p": 74, "ab": "At the start of your turn, you may look at the top card of the fight deck, poker deck, or train encounter deck. You may choose to put that card on the bottom of the deck."},
  {"n": "Maria Gertrudis Barcelo", "set": "au", "p": 74, "ab": "If you start your turn in a town, gain $10 or draw 1 poker card."},
  {"n": "Pat Garrett", "start": "starts with a Marshal point", "set": "au", "p": 75, "ab": "@A Once per turn you may move the Sheriff up to 6 spaces. Gain 1 Legendary point if this results in an arrest."},
  {"n": "Pearl Hart", "set": "ffe", "p": 75, "ab": "After you gain any number of Marshal or Wanted points on your turn, draw 1 poker card and move up to 2 spaces."},
  {"n": "Poker Alice", "start": "starts the game with 3 poker cards", "set": "au", "p": 76, "ab": "@A Once per turn, draw 1 poker card and initiate a game of poker. Any player may join, regardless of their location."},
  {"n": "Seth Bullock", "start": "starts with 1 Marshal point", "set": "au", "p": 76, "ab": "The first time you win a fight against a bandit each turn, draw 2 poker cards."},
  {"n": "Stagecoach Mary Fields", "set": "core", "p": 77, "ab": "At the start of your turn, gain $10. After you contribute to a story card, gain $10."},
  {"n": "Sundance Kid", "start": "starts with 1 Wanted point", "set": "au", "p": 77, "ab": "@A Once per turn, you may move to the space where the Train is currently located (this is considered a Move action)."},
  {"n": "Texas John Slaughter", "start": "starts the game with 1 Marshal point", "set": "bm", "p": 78, "ab": "@A Choose 2: draw 1 poker card, gain $10, lose 1 wound, move 1 space, or spawn 1 bandit at any Bandit Hideout."},
  {"n": "Tiburcio Vasquez", "start": "chooses his starting path", "set": "wbe", "p": 78, "ab": "@A Move your cube to the corresponding-numbered space of the Marshal or Wanted track without gaining the rewards."},
  {"n": "Tom Tobin", "start": "starts the game with 1 Legendary item", "set": "bm", "p": 79, "ab": "Legendary items cost you $10 less to purchase. If you end your turn in the same region as the Traveling Trader, you may purchase a Legendary item."},
  {"n": "Wild Bill Hickok", "set": "core", "p": 79, "ab": "After you win a game of poker, gain $20. After you lose a game of poker, you may keep 1 random poker card you played."},
  {"n": "William “Curly Bill” Brocius", "start": "starts the game with 1 Wanted point", "set": "au", "p": 80, "ab": "If you start your turn outside of a town, draw 2 poker cards and discard 1."},
  {"n": "Wyatt Earp", "start": "starts the game with 1 Marshal point", "set": "core", "p": 80, "ab": "The first time you win a fight against a bandit each turn, gain 1 additional action."},
  {"n": "Y.B. Rowdy", "start": "starts the game at the Cliff Junction Mine", "set": "core", "p": 81, "ab": "After you start your turn outside of a town, you may discard 1 poker card to move up to 3 spaces."}
];

WL.itemList = [
  {"n": "Bedroll", "set": "wbe", "p": 81, "type": "Miscellaneous", "cost": 20, "lp": 0, "ab": "@A Lose 1 wound and refill your hand. (You may only use this when outside of a town)."},
  {"n": "Boot Knife", "set": "bm", "p": 82, "type": "Miscellaneous", "cost": 10, "lp": 0, "ab": "After you give another player any number of wounds during your turn, gain 1LP. After you lose a fight to another player, discard this."},
  {"n": "Bullwhip", "set": "bm", "p": 82, "type": "Miscellaneous", "cost": 10, "lp": 0, "ab": "Longhorns do not reduce your movement. @R At the end of a Move action, you may gain 1 gold nugget or 1 longhorn on the board up to 1 space away."},
  {"n": "Burro", "set": "bm", "p": 82, "type": "Mount", "cost": 20, "lp": 1, "mv": 3, "mvU": 3, "ab": "Increase your hand size by 1.", "up": "Increase your hand size by 2.", "upName": "Bramble"},
  {"n": "Carbine", "set": "promo", "p": 82, "type": "Weapon", "cost": 40, "lp": 2, "ab": "@R After cards are revealed in a fight you may roll 1 prospecting die and apply the result:", "faces": [["X", "You lose this fight automatically, and gain 1 additional wound."], ["rock", "Decrease the value of a card played against you by 1."], ["$", "Decrease the value of a card played against you by 2."], ["dollar", "You win this fight automatically."]], "up": "Same as basic ability.", "upName": "Tomboy"},
  {"n": "Derringer", "set": "au", "p": 83, "type": "Weapon", "cost": 20, "lp": 1, "ab": "@R You may discard this after you win a fight to gain 1LP.", "up": "@R After cards are revealed in a fight, flip this to its other side to discard your played card and replace it with the top card of the fight deck.", "upName": "Severance", "flag": "The card pictured on p.83 says “the top card of the <b>poker deck</b>”; the text beside it says “fight deck”. The book doesn’t say which is right."},
  {"n": "Gazette", "set": "au", "p": 83, "type": "Miscellaneous", "cost": 10, "lp": 0, "ab": "After you gain this, resolve an event. @R Discard after gaining any number of Marshal, Wanted, or Gambler points to gain 1 additional point of the same type."},
  {"n": "Holster", "set": "ffe", "p": 83, "type": "Miscellaneous", "cost": 30, "lp": 0, "ab": "@R After cards are revealed in a fight, you may discard any number of poker cards to decrease the value of a card played against you by 1 for each poker card discarded this way."},
  {"n": "Medicine Pouch", "set": "bm", "p": 83, "type": "Miscellaneous", "cost": 10, "lp": 0, "ab": "After you gain this, lose 1 wound. @A Discard this to lose 2 wounds. Gain 1LP if you lose an injury in this way."},
  {"n": "Miner’s Map", "set": "core", "p": 84, "type": "Miscellaneous", "cost": 10, "lp": 0, "ab": "After you prospect for gold, you may reroll 1 of your prospecting dice."},
  {"n": "Mule", "set": "core", "p": 84, "type": "Mount", "cost": 30, "lp": 1, "mv": 3, "mvU": 4, "ab": "You can carry 2 additional gold nuggets.", "up": "You can carry 2 additional gold nuggets. After you deposit 4 or more gold nuggets, gain 1LP.", "upName": "Clyde"},
  {"n": "Mustang", "set": "core", "p": 84, "type": "Mount", "cost": 50, "lp": 2, "mv": 4, "mvU": 5, "ab": "none", "up": "none", "upName": "Poncho"},
  {"n": "Peacekeeper", "set": "ffe", "p": 84, "type": "Weapon", "cost": 50, "lp": 2, "ab": "If you are a Marshal, gain 1 additional Marshal point after you Arrest a player or wrangle. If you are Wanted, gain 1 additional Wanted point after you Rob a player or rustle.", "up": "Same as basic ability.", "upName": "Equalizer"},
  {"n": "Pocket Watch", "set": "bm", "p": 85, "type": "Miscellaneous", "cost": 20, "lp": 0, "ab": "At the start of your turn, you may discard this to gain 1 additional action this turn."},
  {"n": "Provisions", "set": "core", "p": 85, "type": "Miscellaneous", "cost": 20, "lp": 0, "ab": "After you gain this, draw 1 poker card. @A Discard this to draw 1 poker card and lose 1 wound."},
  {"n": "Quarter Horse", "set": "au", "p": 85, "type": "Mount", "cost": 30, "lp": 1, "mv": 3, "mvU": 4, "ab": "At the end of a Move action, you may discard 1 poker card to move 1 additional space.", "up": "@R At the end of a Move action, flip this to draw 1 poker card and gain 1 action.", "upName": "Bucky"},
  {"n": "Repeating Shotgun", "set": "bm", "p": 85, "type": "Weapon", "cost": 10, "lp": 1, "ab": "@R At the start of a fight, you may pay $10 to upgrade this item.", "up": "After cards are revealed in a fight, you may flip this to cancel the text of a card played against you.", "upName": "Crimson"},
  {"n": "Revolver", "set": "core", "p": 86, "type": "Weapon", "cost": 20, "lp": 1, "ab": "none", "up": "After cards are revealed in a fight, decrease the value of a card played against you by 1.", "upName": "Widowmaker"},
  {"n": "Rifle", "set": "core", "p": 86, "type": "Weapon", "cost": 40, "lp": 1, "ab": "At the start of a fight, look at 2 random cards in the targeted player’s hand.", "up": "At the start of a fight, look at 2 random cards in the targeted player’s hand. After cards are revealed in a fight, decrease the value of a card played against you by 1.", "upName": "Old Betsy"},
  {"n": "Saddle Bags", "set": "wbe", "p": 86, "type": "Miscellaneous", "cost": 20, "lp": 0, "ab": "You can carry any number of miscellaneous items. (You cannot carry multiple copies of the same item.)"},
  {"n": "Shotgun", "set": "core", "p": 86, "type": "Weapon", "cost": 30, "lp": 1, "ab": "After you win a fight, draw 1 poker card.", "up": "After cards are revealed in a fight, decrease the value of a card played against you by 1. After you win a fight, draw 1 poker card.", "upName": "Boomstick"},
  {"n": "Snake Oil", "set": "au", "p": 87, "type": "Miscellaneous", "cost": 10, "lp": 0, "ab": "@A Discard this to roll 1 prospecting die and gain the result. Move the Sheriff to a space adjacent to you."},
  {"n": "Ten-Gallon", "set": "core", "p": 87, "type": "Miscellaneous", "cost": 20, "lp": 0, "ab": "After you win a game of poker, gain 1LP. After you lose a game of poker, gain $10."},
  {"n": "Whiskey", "set": "core", "p": 87, "type": "Miscellaneous", "cost": 10, "lp": 0, "ab": "After you gain this, lose 1 wound. @R After you end a Move action in a space with another player, you may discard this to give another player in your space 1 wound."},
  {"n": "Workhorse", "set": "ffe", "p": 87, "type": "Mount", "cost": 40, "lp": 1, "mv": 3, "mvU": 4, "ab": "You can carry 1 additional cattle token. After you use an Acquire action at a Ranch space, gain 1 additional cattle token.", "up": "Same as basic ability.", "upName": "Petunia"}
];

WL.legItemList = [
  {"n": "Bandolier", "set": "wbe", "p": 88, "type": "Miscellaneous", "lp": 0, "ab": "After you gain this, refill your hand. @A Discard this to refill your hand."},
  {"n": "Black Coat", "set": "gbh", "p": 88, "notes": ["This is one of the only ways for a Wanted player to move their cube to the Marshal track without getting arrested and losing their Wanted status first."], "type": "Miscellaneous", "lp": 0, "ab": "After you gain this, gain 2 Marshal points or 2 Wanted points. A Wanted player that gains this may choose to gain Marshal points in this way."},
  {"n": "Bowie Knife", "set": "gbh", "p": 88, "type": "Miscellaneous", "lp": 0, "ab": "After your cards are revealed in a fight against another player, discard this to decrease the value of a card played against you by 1. Give that player 1 wound and gain 1LP."},
  {"n": "Canteen", "set": "bm", "p": 88, "type": "Miscellaneous", "lp": 0, "ab": "If you end your turn outside of a town, draw 1 poker card or lose 1 wound."},
  {"n": "Cattle Brand", "set": "bm", "p": 89, "type": "Miscellaneous", "lp": 0, "ab": "If you start your turn with at least 1 cattle token, you may move 2 spaces."},
  {"n": "Companion", "set": "gbh", "p": 89, "type": "Miscellaneous", "lp": 0, "ab": "If you start your turn outside of a town, gain 1 additional action."},
  {"n": "Dime Western", "sp": true, "set": "bm", "p": 89, "type": "Miscellaneous", "lp": 0, "ab": "After you contribute to a story card, gain 1 Story point. After you trigger an event, gain 1 Story point."},
  {"n": "Dragoons", "set": "bm", "p": 89, "type": "Weapon", "lp": 0, "ab": "After you win a fight against another player, gain 1LP and give that player 1 additional wound."},
  {"n": "Dynamite", "set": "gbh", "p": 90, "type": "Miscellaneous", "lp": 0, "ab": "@A Discard this to give each other player within 1 space 1 wound. Those players must also discard 1 random poker card. Gain 1LP."},
  {"n": "Fiddle", "risk": true, "set": "bm", "p": 90, "type": "Miscellaneous", "lp": 1, "ab": "If you end your turn in a town, gain $10. You may roll the risk die to gain $20 instead."},
  {"n": "Lasso", "set": "gbh", "p": 90, "type": "Miscellaneous", "lp": 1, "ab": "After you move into a Ranch space, gain 1 cattle token. This is worth 1LP at the end of the game."},
  {"n": "Lightning", "set": "gbh", "p": 90, "type": "Mount", "lp": 1, "mv": 3, "ab": "@A Move to a Bandit Hideout."},
  {"n": "Lucky Coin", "set": "wbe", "p": 91, "type": "Miscellaneous", "lp": 0, "ab": "@R After you gamble and lose, flip a coin. If you win, gain $10 or draw 1 poker card."},
  {"n": "Marked Cards", "set": "wbe", "p": 91, "type": "Miscellaneous", "lp": 0, "ab": "@R Discard after the flop is revealed, replace 1 card from the flop with 1 card from your hand. @R Discard after the first card is revealed in faro, move 1 of your bet markers."},
  {"n": "Marshal’s Badge", "set": "gbh", "p": 91, "type": "Miscellaneous", "lp": 0, "ab": "After cards are revealed in an arrest, you may discard this to cancel that arrest and initiate another arrest. If you do, draw 1 poker card and gain 1LP."},
  {"n": "Mesa Deed", "set": "gbh", "p": 91, "type": "Miscellaneous", "lp": 0, "ab": "@A Discard this and choose three: gain $50, 1 cattle token, 1 gold nugget, 1LP, or move to any space outside of a town."},
  {"n": "Molasses", "set": "wbe", "p": 92, "type": "Mount", "lp": 1, "mv": 2, "ab": "Once per turn, you may discard a 10 value poker card or higher to gain 1 action."},
  {"n": "Outlaw’s Mask", "set": "gbh", "p": 92, "type": "Miscellaneous", "lp": 0, "ab": "After cards are revealed in a fight against a bandit, guard, or the Sheriff, you may discard this to win that fight instead. If you do, draw 1 poker card and gain 1LP."},
  {"n": "Portrait", "set": "bm", "p": 92, "notes": ["The legendary token gained from Portrait does not count towards a player’s limit of 3 legendary tokens."], "type": "Miscellaneous", "lp": 1, "ab": "After you gain this, draw 1 legendary token and place it facedown on this. Keep this legendary token separate from those on your player mat."},
  {"n": "Pump Trolley", "set": "bm", "p": 92, "type": "Mount", "lp": 1, "mv": 2, "ab": "@A If you are in a Train Checkpoint space, move to any other Train Checkpoint space."},
  {"n": "Saber", "set": "wbe", "p": 93, "type": "Weapon", "lp": 0, "ab": "After you win a fight, gain 1LP. After you lose a fight, lose 1LP."},
  {"n": "Serape", "set": "wbe", "p": 93, "type": "Miscellaneous", "lp": 0, "ab": "@R You may discard this at the start of a fight to reduce the card played against you by 2 and prevent any wounds you would gain from this fight."},
  {"n": "Short Cut", "set": "bm", "p": 93, "type": "Miscellaneous", "lp": 0, "ab": "You can move through Mountain Passes as part of a Move action for 1 movement."},
  {"n": "Shot Glass", "set": "bm", "p": 93, "type": "Miscellaneous", "lp": 0, "ab": "If you end your turn in a town, draw 1 poker card or lose 1 wound."},
  {"n": "Silver Flask", "set": "gbh", "p": 94, "type": "Miscellaneous", "lp": 0, "ab": "@A Discard this to lose all wounds, draw to your maximum hand size, and gain 1LP."},
  {"n": "Snakeskin Boots", "set": "bm", "p": 94, "type": "Miscellaneous", "lp": 1, "ab": "If you start your turn in a town, you may move 1 space. @R After another player or the Sheriff ends their move in your space, you may discard this to move to an unoccupied space up to 4 spaces away."},
  {"n": "Spurs", "set": "bm", "p": 94, "type": "Miscellaneous", "lp": 1, "ab": "Your movement is increased by 1 while you have a mount. Your movement is increased by 2 while you have an upgraded mount."},
  {"n": "Spyglass", "set": "wbe", "p": 94, "type": "Miscellaneous", "lp": 1, "ab": "@A Choose 1: Look at all cards in another player’s hand, look at the top card of the train deck, or look at any facedown token. Then move up to 1 space."},
  {"n": "Telegram", "set": "bm", "p": 95, "type": "Miscellaneous", "lp": 1, "ab": "@A Give this to another player. Exchange all poker cards in your hand with all poker cards in that player’s hand. This does not count towards your limit of miscellaneous items."},
  {"n": "Thunder", "set": "gbh", "p": 95, "type": "Weapon", "lp": 0, "ab": "After you win a fight against a bandit, guard, or the Sheriff, gain 1LP."},
  {"n": "Tomahawk", "set": "gbh", "p": 95, "type": "Miscellaneous", "lp": 1, "ab": "At the start of a fight, you may discard 1 poker card to draw 1 poker card."},
  {"n": "Treasure Map", "set": "wbe", "p": 95, "notes": ["Players do not gain the results of the mining die."], "type": "Miscellaneous", "lp": 0, "ab": "@A Roll 1 prospecting die at a Mine.", "faces": [["rock", "You may discard this to gain 1LP and 1 Legendary item of your choice."]]}
];


/* ---- lookup helpers ------------------------------------------------------------------ */
(function () {
  const ul = WL.ul, join = WL.join;
  const SETLABEL = { core: "Western Legends", au: "Ante Up", bm: "Blood Money", ffe: "Fistful of Extras", gbh: "The Good, The Bad, and The Handsome", wbe: "Wild Bunch of Extras", promo: "Promo" };
  WL.lkSetLabel = SETLABEL;

  /* names as the game-mode lists print them (p.19–25) → the Appendix headings */
  const ALIAS = { "soapy smith": "jefferson soapy smith", "shortcut": "short cut" };
  const key = (n) => n.toLowerCase().replace(/[“”"’']/g, "").replace(/\s+/g, " ").trim();
  WL.lkKey = (n) => { const k = key(n); return ALIAS[k] || k; };
  WL.lkFind = (list, n) => list.find(x => key(x.n) === WL.lkKey(n));

  /* "Action:" / "Reaction:" as the book prints them (red keyword) */
  const kw = (t) => t.replace(/@A /g, "<span class=\"kw kw-act\">Action:</span> ").replace(/@R /g, "<span class=\"kw kw-rx\">Reaction:</span> ");
  const esc = (t) => t.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
  const plain = (t) => t.replace(/@A /g, "Action: ").replace(/@R /g, "Reaction: ");

  /* prospecting (mining) die faces on Carbine p.82 and Treasure Map p.95, shown with the icons and names of the
     mining die legend on p.39 (Gold Nugget, Gold Dust, Gravel, Tailings). Carbine prints Gravel and Tailings as
     the letters “X” and “$”. */
  const ic = (file, alt) => "<img class=\"aid-ic aid-ic-inline\" src=\"images/icons/" + file + ".webp\" alt=\"" + alt + "\">";
  const face = (f) => f === "rock" ? ic("die-gold-nugget", "Gold Nugget") + " <b>Gold Nugget</b>"
    : f === "dollar" ? ic("die-gold-dust", "Gold Dust") + " <b>Gold Dust</b>"
    : f === "X" ? ic("die-gravel", "Gravel") + " <b>Gravel</b> (printed “X”)"
    : f === "$" ? ic("die-tailings", "Tailings") + " <b>Tailings</b> (printed “$”)"
    : "<b class=\"lk-face\">" + f + "</b>";
  const faces = (x) => x.faces ? "<ul class=\"lk-faces\">" + x.faces.map(([f, t]) => "<li><span class=\"ic-nb\">" + face(f) + ":</span> " + t + "</li>").join("") + "</ul>" : "";

  const item = (x, meta, body, extraKey) =>
    "<details class=\"lk-item\" data-k=\"" + esc(key([x.n, x.upName || "", SETLABEL[x.set], meta, plain(x.ab), x.up ? plain(x.up) : "", extraKey || ""].join(" "))) + "\">" +
    "<summary><span class=\"lk-name\">" + x.n + "</span> " + (meta ? "<span class=\"lk-meta\">" + meta + "</span> " : "") +
    "<span class=\"lk-set lk-set-" + x.set + "\">(" + SETLABEL[x.set] + ")</span></summary>" +
    "<div class=\"lk-body\">" + body + "<p class=\"lk-cite\">Rules p." + x.p + "</p></div></details>";

  const filterBox = (id, label, ph, n, noun) =>
    "<div class=\"lk-tools\"><label class=\"lk-label\" for=\"lk-" + id + "\">" + label + "</label>" +
    "<input type=\"search\" class=\"lk-filter\" id=\"lk-" + id + "\" data-lk=\"" + id + "\" placeholder=\"" + ph + "\" autocomplete=\"off\">" +
    "<p class=\"lk-count\" aria-live=\"polite\" data-noun=\"" + noun + "\">" + n + " " + noun + "</p></div>";

  const hiddenNote = (parts) => {
    const p = parts.filter(([n]) => n > 0).map(([n, why]) => n + " " + why);
    return p.length ? "<p class=\"lk-hidden\">Not listed: " + p.join("; ") + ".</p>" : "";
  };

  /* ---- which entries are in play ------------------------------------------------------- */
  WL.lkLegends = (c) => {
    const M = c.mode !== "std" ? WL.modeInfo[c.mode] : null;
    const owned = WL.legendList.filter(x => c.has(x.set));
    let inMode = owned;
    if (M && M.chars) inMode = owned.filter(x => M.chars.some(n => WL.lkKey(n) === key(x.n)));
    if (M && M.charsExcept) inMode = owned.filter(x => !M.charsExcept.some(n => WL.lkKey(n) === key(x.n)));
    const shown = c.csc ? inMode.filter(x => !x.sp) : inMode;
    return { shown, unowned: WL.legendList.length - owned.length, mode: owned.length - inMode.length, csc: inMode.length - shown.length };
  };
  WL.lkItems = (c) => {
    const owned = WL.itemList.filter(x => c.has(x.set));
    let shown = owned;
    if (c.mode !== "std") {
      const S = WL.modeInfo[c.mode].stores, all = [].concat(S.both || [], S.gs || [], S.tp || [], S.tt || []);
      shown = owned.filter(x => all.some(n => WL.lkKey(n) === key(x.n)));
    }
    return { shown, unowned: WL.itemList.length - owned.length, mode: owned.length - shown.length };
  };
  WL.lkLegItems = (c) => {
    const L = c.mode !== "std" ? WL.modeInfo[c.mode].legendary : null;
    const owned = WL.legItemList.filter(x => c.has(x.set));
    let inMode = owned;
    if (L && L.only) inMode = owned.filter(x => L.only.some(n => WL.lkKey(n) === key(x.n)));
    if (L && L.except) inMode = owned.filter(x => !L.except.some(n => WL.lkKey(n) === key(x.n)));
    const shown = c.csc ? inMode.filter(x => !x.sp) : inMode;
    return { shown, unowned: WL.legItemList.length - owned.length, mode: owned.length - inMode.length, csc: inMode.length - shown.length };
  };
  /* which store stand an item goes in, in a game mode (p.19–24) */
  const stand = (c, x) => {
    if (c.mode === "std") return "";
    const S = WL.modeInfo[c.mode].stores, has = (a) => a && a.some(n => WL.lkKey(n) === key(x.n));
    if (has(S.both)) return "General Store / Trading Post";
    if (has(S.gs)) return "General Store";
    if (has(S.tp)) return "Trading Post";
    if (has(S.tt)) return "Traveling Trader";
    return "";
  };

  /* ---- reference sections ---------------------------------------------------------------- */
  const sections = [
    { id: "legends", title: "Legends of the West: every character", when: () => true,
      html: (c) => {
        const L = WL.lkLegends(c);
        return ul([
            "Each Legend’s ability is active only once you have <b>5 LP</b> (the star on the Legendary Point track). If an ability conflicts with the rulebook, the card text wins.",
            "Your starting items, money, poker cards and points, any starting wounds, and your <b>Starting Location</b> are on the back of your character card; follow it as printed (Billy the Kid’s, for example, says “Do not gain rewards” for his starting Wanted points). The Complete Rules reprints only Billy the Kid’s card back (p.52); where the book’s tips mention a Legend’s start, it’s noted below.",
            "<span class=\"kw kw-act\">Action:</span> in red means the ability costs 1 of your actions."
          ]) +
          (c.mode !== "std" ? "<p class=\"note\">" + c.modeName + ": only the characters this mode uses are listed.</p>" : "") +
          (c.csc ? "<p class=\"note\">Core Story Card variant: characters that reference Story points are removed" + (c.v("goal") ? ". With goal cards, also remove the characters whose goal cards reference Story points: the book doesn’t list them, so check each goal card" : "") + ".</p>" : "") +
          filterBox("legends", "Find a Legend", "Name, set or ability (e.g. Wyatt, poker, Sheriff)", L.shown.length, "Legends") +
          "<div class=\"lk-list\" data-lk-list=\"legends\">" + L.shown.map(x => item(x, "", "<p class=\"lk-ab\"><b>Ability:</b> " + kw(x.ab) + "</p>" +
            (x.notes ? "<p class=\"lk-sub\">Clarifications</p>" + ul(x.notes) : "") +
            (x.start ? "<p class=\"lk-start\"><b>Start (from the book’s tips):</b> " + x.start + ".</p>" : "") +
            (x.sp && c.lss ? "<p class=\"lk-flag\">References Story points: removed in the Core Story Card variant (p.14).</p>" : ""),
            x.start || "")).join("") + "</div>" +
          hiddenNote([[L.unowned, "Legends from sets you haven’t selected"], [L.mode, "Legends this game mode doesn’t use"], [L.csc, "Legends that reference Story points (Core Story Card variant)"]]);
      },
      src: (c) => join(["Rules p.6, 28, 35, 52, 60–81", c.csc ? "p.14" : "", c.mode !== "std" ? WL.modeInfo[c.mode].srcShort : ""]) },

    { id: "itemlist", title: "Items of the West: store items", when: () => true,
      html: (c) => {
        const I = WL.lkItems(c);
        const meta = (x) => x.type + " · $" + x.cost;
        return ul([
            "<b>Cost</b> is printed top left. The same amount again upgrades a mount or weapon: flip it to its named upgraded side.",
            "<b>Mounts</b> show their movement; <b>weapons</b> help in fights. Upgraded mounts and weapons score their <b>LP</b> at the end of the game.",
            "<b>Miscellaneous</b> items can’t be upgraded, and you can hold up to 3 of them. You can never own two copies of the same item, of any type.",
            "<span class=\"kw kw-act\">Action:</span> costs 1 of your actions; the card isn’t discarded unless it says so. <span class=\"kw kw-rx\">Reaction:</span> costs no action and can be used whenever its condition is met, even on another player’s turn."
          ]) +
          (c.mode !== "std" ? "<p class=\"note\">" + c.modeName + ": only the items this mode stocks are listed, with the stand each one goes in.</p>" : "") +
          filterBox("items", "Find an item", "Name, set or type (e.g. Rifle, mount, wound)", I.shown.length, "items") +
          "<div class=\"lk-list\" data-lk-list=\"items\">" + I.shown.map(x => {
            const st = stand(c, x);
            const facts = [
              "<b>Type:</b> " + x.type, "<b>Cost:</b> $" + x.cost,
              x.mv !== undefined ? "<b>Movement:</b> " + x.mv + (x.mvU !== undefined ? " (upgraded " + x.mvU + ")" : "") : "",
              "<b>End of game LP:</b> " + x.lp + (x.up ? " (upgraded)" : ""),
              st ? "<b>Stand:</b> " + st : ""
            ].filter(Boolean).join(" · ");
            const body = "<p class=\"lk-facts\">" + facts + "</p>" +
              (x.up
                ? "<p class=\"lk-ab\"><b>Basic:</b> " + (x.ab === "none" ? "no ability" : kw(x.ab)) + "</p>" + faces(x) +
                  "<p class=\"lk-ab\"><b>Upgraded (" + x.upName + "):</b> " + (x.up === "none" ? "no ability" : kw(x.up)) + "</p>"
                : "<p class=\"lk-ab\"><b>Ability:</b> " + kw(x.ab) + "</p>" + faces(x)) +
              (x.faces ? "<p class=\"lk-note\">The card prints these results as die-face symbols; the names are from the mining die legend (p.39).</p>" : "") +
              (x.flag ? "<p class=\"lk-flag\">" + x.flag + "</p>" : "");
            return item(x, meta(x) + (x.up ? " · upgrades to " + x.upName : ""), body, st);
          }).join("") + "</div>" +
          hiddenNote([[I.unowned, "items from sets you haven’t selected"], [I.mode, "items this game mode doesn’t stock"]]);
      },
      src: (c) => join(["Rules p.12, 28, 34–35, 39, 42–43, 81–87", c.mode !== "std" ? WL.modeInfo[c.mode].srcStores : ""]) },

    { id: "legitems", title: "Legendary items", when: (c) => c.legItems,
      html: (c) => {
        const I = WL.lkLegItems(c);
        return ul([
            "Legendary items follow all the item rules, but can’t be upgraded. They count as <b>miscellaneous</b> unless the card says Mount or Weapon.",
            c.noTrader ? "Gain them through card and token effects." + (c.mode === "serenade" ? " In Serenade of the Six Guns they can’t be purchased." : "")
              : "Gain them through card and token effects, or buy revealed ones from the Traveling Trader for <b>$40 each</b> (several in one Trader action; each space is refilled at once).",
            "Some score <b>LP</b> at the end of the game (shown below and on the card’s top left)."
          ]) +
          (c.mode !== "std" ? "<p class=\"note\">" + c.modeName + ": only the Legendary items in this mode’s deck are listed.</p>" : "") +
          (c.csc ? "<p class=\"note\">Core Story Card variant: Legendary items that reference Story points are removed. The risk die isn’t used either, so a “roll the risk die” option can’t be taken; the book doesn’t say more.</p>" : "") +
          filterBox("legitems", "Find a Legendary item", "Name, set or effect (e.g. Spurs, fight, cattle)", I.shown.length, "Legendary items") +
          "<div class=\"lk-list\" data-lk-list=\"legitems\">" + I.shown.map(x => {
            const meta = x.type + (x.lp ? " · " + x.lp + " LP" : "");
            const body = "<p class=\"lk-facts\">" + ["<b>Type:</b> Legendary, " + x.type, x.mv !== undefined ? "<b>Movement:</b> " + x.mv : "", "<b>End of game LP:</b> " + x.lp].filter(Boolean).join(" · ") + "</p>" +
              "<p class=\"lk-ab\"><b>Ability:</b> " + kw(x.ab) + "</p>" + faces(x) +
              (x.faces ? "<p class=\"lk-note\">The card prints this result as a die-face symbol; its name is from the mining die legend (p.39).</p>" : "") +
              (x.notes ? "<p class=\"lk-sub\">Clarifications</p>" + ul(x.notes) : "") +
              (x.sp && c.lss ? "<p class=\"lk-flag\">References Story points: removed in the Core Story Card variant (p.14).</p>" : "") +
              (x.risk && c.csc ? "<p class=\"lk-flag\">The risk die isn’t used in the Core Story Card variant (p.14).</p>" : "");
            return item(x, meta, body);
          }).join("") + "</div>" +
          hiddenNote([[I.unowned, "Legendary items from sets you haven’t selected"], [I.mode, "Legendary items this game mode removes"], [I.csc, "Legendary items that reference Story points (Core Story Card variant)"]]);
      },
      src: (c) => join(["Rules p.12, 28, 35, 39, 43, 47, 88–95", c.csc ? "p.14" : "", c.mode !== "std" ? WL.modeInfo[c.mode].srcShort : ""]) }
  ];
  WL.reference.push(...sections);

  /* ---- setup steps point to the lookup ----------------------------------------------------- */
  const link = (id, label) => "<a href=\"#ref-" + id + "\" class=\"ref-link\" data-ref=\"" + id + "\">" + label + "</a>";
  WL.stepHooks.push(
    { step: "C-character", when: () => true,
      html: (c) => "<p class=\"lk-see\">Look up both characters you drew in " + link("legends", "Legends of the West") + " (Rules Reference): each ability as printed" + (c.mode !== "std" ? ", filtered to this mode’s list" : "") + ".</p>",
      src: "p.60–81" },
    { step: "A-stores", when: () => true,
      html: () => "<p class=\"lk-see\">Every store item’s cost, type, movement and abilities: " + link("itemlist", "Items of the West") + ".</p>",
      src: "p.81–87" },
    { step: "A-legendary", when: (c) => c.legItems,
      html: () => "<p class=\"lk-see\">What each Legendary item does: " + link("legitems", "Legendary items") + ".</p>" }
  );
})();
