/* =============================================================================
   Blood Bowl: Team Manager — Setup Utility & Reference
   All data grounded in the official rulebook + Sudden Death + Foul Play
   expansions + official FAQ + the community Legendary Edition rulebook.
   Difficulty / Style values are transcribed exactly from the Legendary rulebook
   team pages (printed ★ ratings agree with the labels except the Grudgebearers,
   labelled “High” but drawn with 4 ★ — the label is used here).
   ============================================================================= */
const BBTM = {};

/* ---- Content sources (expansions / modules) ------------------------------ */
BBTM.sources = {
  core:      { id:"core",      name:"Core Box",          short:"Core", cls:"src-core", always:true,
               blurb:"The base game: 6 teams across the Old World Association (OWA) and Chaos Wastes Confederation (CWC), for 2–4 managers." },
  sudden:    { id:"sudden",    name:"Sudden Death",      short:"DSS",  cls:"src-dss",
               blurb:"Adds the Dark Sorcery Syndicate (3 undead/magic teams), Contracts, Enchanted Balls, the Regeneration skill, Downed skills and Blood tokens." },
  foul:      { id:"foul",      name:"Foul Play",         short:"PPG",  cls:"src-ppg",
               blurb:"Adds the Putrid Players’ Guild (3 teams), a 5th manager, Penalties, Disease tokens, the Corrupt Ref, Stadiums, the Fouling skill, plus Regeneration and downed skills." },
  legendary: { id:"legendary", name:"Legendary Edition", short:"LEG",  cls:"src-leg",
               blurb:"Community fan expansion. Adds 7 new unofficial leagues (21 teams) alongside the four official subdivisions; nine of the new teams have their own special rules." }
};
BBTM.sourceOrder = ["core","sudden","foul","legendary"];

/* ---- Difficulty scale (as printed in the Legendary rulebook) ------------- */
BBTM.difficulty = {
  "Low":       { pips:1, cls:"d-low",  label:"Low" },
  "Medium":    { pips:2, cls:"d-med",  label:"Medium" },
  "High":      { pips:3, cls:"d-high", label:"High" },
  "Very High": { pips:4, cls:"d-vhigh",label:"Very High" }
};

/* ---- Leagues -------------------------------------------------------------
   Official leagues map to a TMU subdivision (OWA / CWC / DSS / PPG) which
   determines the Star Player deck. The Legendary leagues are self-contained. */
BBTM.leagues = [
  { id:"owa",  code:"OWA",  name:"Old World Association", source:"core", division:"OWA", official:true,
    blurb:"Amateur pub leagues sprung up across the towns and cities of the Old World, where the local taverns have always been the centres of drunken activity. The OWA is one of the two founding subdivisions of the Team Managers’ Union." },
  { id:"cwc",  code:"CWC",  name:"Chaos Wastes Confederation", source:"core", division:"CWC", official:true,
    blurb:"From the impossibly vast wastelands beyond civilisation, Blood Bowl is even more popular among the followers of the Chaos gods than among civilised folk. The CWC is the second founding subdivision of the TMU." },
  { id:"dss",  code:"DSS",  name:"Dark Sorcery Syndicate", source:"sudden", division:"DSS", official:true,
    blurb:"Dabblers in forbidden magics who just don’t know when to stay down — undead Champions of Death, the blood-thirsty Black Fangs, and the merciless Naggaroth Nightmares. Added by the Sudden Death expansion." },
  { id:"ppg",  code:"PPG",  name:"Putrid Players’ Guild", source:"foul", division:"PPG", official:true,
    blurb:"Disease-spreading followers of Nurgle, chainsaw-wielding goblins, and grudge-bearing Chaos Dwarfs — the final team to join the Team Managers’ Union. Added by the Foul Play expansion." },

  { id:"cabal", code:"CABAL", name:"Cabal Vision", source:"legendary", division:"—", official:false,
    blurb:"Take a good look at your Cabalvision screens! These three teams love the show, the sound of creaking bones, and the most incredible touchdown celebrations — the biggest stars of the Old World want the halftime show." },
  { id:"woa",  code:"WOA",  name:"World Outsiders Association", source:"legendary", division:"—", official:false,
    blurb:"Arguably the most physical of the unions, the WOA takes its name from the cry of admiration its supporters give at a bloody wound. Even a back-up substitute is proud to belong." },
  { id:"all",  code:"ALL",  name:"Ancient Legendary League", source:"legendary", division:"—", official:false,
    blurb:"From the fertile jungles of Lustria, this league brings together some of the teams closest to the original sport — far from the foul play of the Old World." },
  { id:"afi",  code:"AFI",  name:"Albion Football Institution", source:"legendary", division:"—", official:false,
    blurb:"Albion is a small, fog-cloaked island north of the Old World where it rains every day of the year. Bloodbowl is one of only two sports played by its human inhabitants." },
  { id:"tcd",  code:"TCD",  name:"Tomb Crushers Division", source:"legendary", division:"—", official:false,
    blurb:"From Arabian crypts, underground slums and obscure cemeteries. If this league smells of carrion, it can boast some of the oldest Blood Bowl players (or what’s left of them) — particularly effective at night." },
  { id:"ffs",  code:"FFS",  name:"Foul Fiends Syndicate", source:"legendary", division:"—", official:false,
    blurb:"A colourful league of teams as attractive as they are changing — a subtle and aggressive game capable of turning any match to its advantage, if the players’ individual excesses don’t turn against them." },
  { id:"naf",  code:"NAF",  name:"Nuffle Amorical Football", source:"legendary", division:"—", official:false,
    blurb:"NAF was the governing body of Blood Bowl, creating the first official rules in 2409. By 2490 the organisation had declared bankruptcy — but some nostalgic teams keep the legend alive." }
];

/* ---- Teams ---------------------------------------------------------------
   difficulty + style transcribed from the Legendary rulebook team pages.    */
BBTM.teams = [
  /* OWA — Old World Association (Core Box) */
  { id:"reikland-reavers", league:"owa", name:"Reikland Reavers", race:"Humans",
    difficulty:"Low", style:"All Around", since:"2389", location:"Reikland",
    stadium:"The Altdorf Oldbowl", coach:"JJ Griswell Jr.",
    blurb:"Probably the finest all-round team in the world. Humans are well rounded and suited to any position — they can pass, run and smash when called for, and their versatility can thwart an opponent’s game plan.",
    stars:["Walter Damn Kempft","Griff Oberwald","Zug la Bête","Jacob von Altdorf"] },
  { id:"athelorn-avengers", league:"owa", name:"Athelorn Avengers", race:"Wood Elves",
    difficulty:"Medium", style:"Pass", since:"2429", location:"Unknown",
    stadium:"Unknown", coach:"Aed Hothriss",
    blurb:"For Wood Elves the long pass is everything — virtually all of their effort goes into the offensive game plan. Their natural athletic ability keeps them out of trouble; it takes a very agile or lucky opponent to lay a hand on a Wood Elf.",
    stars:["Jordell Freshbreeze","Eldril Sidewinder","Aurora Silverleaf","Deeproot Strongbranch"] },
  { id:"grudgebearers", league:"owa", name:"Grudgebearers", race:"Dwarfs",
    difficulty:"High", style:"Stunty", since:"Unknown", location:"Unknown",
    stadium:"Unknown", coach:"Unknown",
    blurb:"Short, tough and well-armoured — ideal Blood Bowl players. The Grudgebearers wear down the opposing team until there’s no one left to stop them scoring the winning touchdown.",
    stars:["Skuff Whitebeard","Barik Farblast","Grim Ironjaw","The Death Roller"] },

  /* CWC — Chaos Wastes Confederation (Core Box) */
  { id:"gouged-eye", league:"cwc", name:"Gouged Eye", race:"Orcs",
    difficulty:"Low", style:"Tackle", since:"2403", location:"Drakwald",
    stadium:"The Doom Dome", coach:"Gort Severlimb",
    blurb:"Orcs have played Blood Bowl since the game was invented, and Gouged Eye is among the best teams in the league. They rely on a tough, hard-hitting game plan that gradually grinds down the opposition.",
    stars:["Varag Machegoule","Eruck Ogrehack","Krug Painspear","Urfrik Skullhack"] },
  { id:"chaos-all-stars", league:"cwc", name:"Chaos All-Stars", race:"Chaos",
    difficulty:"Medium", style:"Cheat", since:"2402", location:"Unknown",
    stadium:"The Palace of Eternal Suffering", coach:"Unknown",
    blurb:"Not noted for subtlety. A simple drive up the centre of the field, maiming and injuring as many opposing players as possible, is about the limit of their game plan — they’re more concerned with cheating than scoring touchdowns.",
    stars:["Duke Luthor von Hawkfire","Morg ’N Thorg","V’hnn Qllss Zzchhtrr"] },
  { id:"skavenblight-scramblers", league:"cwc", name:"Skavenblight Scramblers", race:"Skaven",
    difficulty:"Low", style:"Sprint", since:"2442", location:"The City of Skavenblight",
    stadium:"Skavenblight Stadium", coach:"Vytik the Many Headed",
    blurb:"They may not be strong or tough, but boy are Skaven fast! Many an opponent is left dumbfounded as a Skaven runner finds a gap in the line and scampers for a touchdown. They’re certainly not above cheating, so watch the ref!",
    stars:["Hide-Sneak","Bite-Bite","Niknik Yellowtail","Headsplitter"] },

  /* DSS — Dark Sorcery Syndicate (Sudden Death) */
  { id:"black-fangs", league:"dss", name:"Black Fangs", race:"Vampires",
    difficulty:"High", style:"Tokens / Synergy", since:"Unknown", location:"Vampire Coast",
    stadium:"Unknown", coach:"Unknown",
    blurb:"The mighty Vampires of the Black Fangs do not know the meaning of mercy — they don’t even show it to their own teammates. When a Vampire isn’t feasting on a Thrall, his eyes and fangs are on the opponent.",
    special:[{name:"Blood tokens",text:"Black Fang players with Bloodlust gain Blood tokens; each Blood token on a player raises both their standing and downed Star Power by 1 until ‘Clear the Pitch’. Tokens are limited to the supply."}],
    stars:["Count Luthor von Drakenborg","Crazy Igor"] },
  { id:"naggaroth-nightmares", league:"dss", name:"Naggaroth Nightmares", race:"Dark Elves",
    difficulty:"Low", style:"Versatile", since:"2380", location:"Naggarond",
    stadium:"Unknown", coach:"Duriath Helblade",
    blurb:"More aggressive than their Elven cousins. Merciless players who always look to exploit an opponent’s weakness and find the quickest path to victory — even if it means eviscerating the competition. Versatility and brutality, plain and simple.",
    special:[{name:"Regeneration & Downed skills",text:"Sudden Death’s Regeneration downed skill reflects the DSS teams’ tenacity (roll 2 dice; on a ✖ result — the Tackler-Down face — you may stand the player); downed skills resolve the moment a player is downed."}],
    stars:["Asperon Thorn","Arkhul Blackhand","Meriann Lightning"] },
  { id:"champions-of-death", league:"dss", name:"Champions of Death", race:"Undead",
    difficulty:"Low", style:"Regeneration", since:"2439", location:"Underearth",
    stadium:"Pain Park, Underearth", coach:"Tomolandry the Undying",
    blurb:"Not even mortality can stand between an Undead player and the pitch. Zombies and Skeletons aren’t durable, but they survive nearly any beating and come back for more — and woe to anyone facing a Mummy or Wight.",
    special:[{name:"Regeneration & Downed skills",text:"Listed style: Regeneration. An optional downed skill, never used on commit: roll 2 dice and choose one; applying a ✖ result (the Tackler-Down face) lets you return the player to standing. Resolve it left to right in sequence with the player’s other downed skills. If he stands, his later downed skills are not used and his standing skills are ignored (Sudden Death p.3)."}],
    stars:["G’Ral Blodschüker","Skrull Halfheight","Throttlesnot «The Impaler»"] },

  /* PPG — Putrid Players’ Guild (Foul Play) */
  { id:"nurgles-rotters", league:"ppg", name:"Nurgle’s Rotters", race:"Nurgle",
    difficulty:"High", style:"Disease Tokens", since:"2402", location:"Unknown",
    stadium:"Unknown", coach:"Captain Sven «Four-Eyes» Erikksen",
    blurb:"A vile bunch, constantly spreading disease and oozing their way to victory. They can even turn opponents into more Nurgle players. With disease tokens sapping the Star Power of any player who walks into them, the team is an unstoppable plague.",
    special:[{name:"Disease tokens (Spread Disease)",text:"Spread Disease places disease tokens at midfield; any player (Rotters included) committed or moved to that matchup is assigned all of them. Each disease token lowers a player’s standing and downed Star Power by 1 (minimum 0) until ‘Clear the Pitch’. Tokens are limited to the supply — none can be placed while it’s empty."}],
    stars:["Ivan Bouldercrusher","«Smelly» Pete","Goran «The Tentacle» Svengard"] },
  { id:"lowdown-rats", league:"ppg", name:"The Lowdown Rats", race:"Goblins",
    difficulty:"High", style:"Stunty / Foul", since:"2472", location:"Ubrovnia",
    stadium:"The Swampdome", coach:"Hymie Snivel",
    blurb:"These goblins take the cake — chainsaws, bombs and pogo sticks at a football game. The Lowdown Rats never consider fighting fair; they play to win by any means, and failing that, total mayhem will suffice.",
    special:[{name:"Fouling",text:"Listed style: Stunty/Foul. Fouling (Foul Play): randomly take a card from the hand of an opposing manager at the matchup, look at it, then return it or discard it (if discarded, he draws a replacement)."}],
    stars:["Scrappa Sorehead","Figgit Spleenpuncher","Dug «Elbows» Snitchit"] },
  { id:"zharr-naggrund-ziggurats", league:"ppg", name:"The Zharr-Naggrund Ziggurats", race:"Chaos Dwarfs",
    difficulty:"Medium", style:"Cheat / Foul", since:"Unknown", location:"Unknown",
    stadium:"Unknown", coach:"Unknown",
    blurb:"Famed weapon-smiths whose creations are as twisted and cruel as they are. Not even being downed can stop these players from fouling their opponents. With thick skulls and intimidating centaurs, they fight to the last breath — and beyond.",
    special:[{name:"Downed Fouling / Trample",text:"Chaos Dwarf players foul even from the floor via downed skills (Foul Play p.3). Bull Centaurs have Trample, as printed on the Bull Centaur card in Foul Play p.3’s Ref Movement Example: “Each time this player downs an opposing player, he may immediately attempt to tackle that player again using his downed Star Power.” A Target Down result against the now-downed player injures him (Rulebook p.11)."}],
    stars:["Hthark the Unstoppable","Rashnak Backstabber","Zzharg Madeye"] },

  /* CABAL — Cabal Vision (Legendary) */
  { id:"elfheim-eagles", league:"cabal", name:"Elfheim Eagles", race:"Elves",
    difficulty:"High", style:"Level Up", since:"2468", location:"Tor Lithanel",
    stadium:"Laurelorn Stadium", coach:"Perellian Lamecendre",
    blurb:"Even if Elven Union is stereotypical, few know how to counter it: long pass, catch, long pass, touchdown. Simple, efficient. The Eagles’ players can improve their performance during the game.",
    special:[{name:"Veteran players (Level Up)",text:"Each player has a normal card and a golden “Veteran” upgrade (set the Veterans aside at setup). Each time you win a matchup with a Team Upgrade reward, draw a random Veteran card, replace that player’s normal card with the upgraded version, and reshuffle your Team deck. If you won several Team Upgrade rewards, draw that many Veteran cards and choose one."}],
    stars:["Valen Swift","Highelm Lyrpdre","Ibrahim Aubedor","Erewine Ar-Khorigan"] },
  { id:"norsca-rampagers", league:"cabal", name:"Norsca Rampagers", race:"Norse",
    difficulty:"Low", style:"All Around", since:"2442", location:"Vynheim",
    stadium:"Longship Stadium", coach:"Mangus Manglesson",
    blurb:"Hailing from the frozen north, the Norse are a hardy folk forged by extreme cold. A warm fur, a helmet with sharp points, and they’re ready. Nothing appeals to them more than the duel and raw power.",
    stars:["Icepelt Hammerblow","Thrud the Barbarian"] },
  { id:"praag-changelings", league:"cabal", name:"Praag Changelings", race:"Kislev",
    difficulty:"High", style:"Synergy", since:"Unknown", location:"Praag",
    stadium:"Praag Stadium", coach:"Unknown",
    blurb:"The Kislev Circus Caravan enters the arena! Watch their acrobats, trained animals, and freak show — they’ll make you lose your mind, literally and figuratively.",
    stars:["Gregor « Sur Hands » Meissen","Spider Smith"] },

  /* WOA — World Outsiders Association (Legendary) */
  { id:"mongrel-horde", league:"woa", name:"Mongrel Horde", race:"Chaos Renegades",
    difficulty:"Medium", style:"Versatile", since:"Unknown", location:"Unknown",
    stadium:"Unknown", coach:"Unknown",
    blurb:"One of the better-known Chaos Renegade teams despite a less-than-glorious record. A large, unruly roster of the most maladjusted and downright evil players ever to set foot on a gridiron — held together by hating others.",
    stars:["Dieter Hammerlash","Dirty Dan","Wazbasha Thunderkrump","Flatulent Don"] },
  { id:"oldheim-ogres", league:"woa", name:"Oldheim Ogres", race:"Ogres",
    difficulty:"Very High", style:"Synergy", since:"2425", location:"Oldheim",
    stadium:"Goadmalice Park", coach:"Glasra Gones",
    blurb:"The hard part is knowing which direction to launch the snotling. After a few unfortunate deaths they get a good hold of him, then throw (not too high) and release at the right time — or get angry and out of control.",
    stars:["Bertha Grospoing","M’Gorg’Gn’Throg","Pet’Brik et Minab’"] },
  { id:"khornes-killers", league:"woa", name:"Khorne’s Killers", race:"Daemons of Khorne",
    difficulty:"Low", style:"Tackle", since:"Unknown", location:"Chaos Wasteland",
    stadium:"Unknown", coach:"Unknown",
    blurb:"The Daemons of Khorne have infinite bloodlust and rage. Bloodletters, Bloodthirsters and Heralds turned their attention to violent games and made their entrance in the stadiums — today they are the most violent and feared players of all time.",
    stars:["Scylla Anfingrim","Galmen Goreblade","Wormhowl Greyscar"] },

  /* ALL — Ancient Legendary League (Legendary) */
  { id:"amazones-all-stars", league:"all", name:"Amazones All-Stars", race:"Amazons",
    difficulty:"Medium", style:"Versatile", since:"2494", location:"Lustria",
    stadium:"Unknown", coach:"Dianna ‘Mistress of Pain’ Thunderlash",
    blurb:"The first Amazon team to journey from Lustria to the Old World, made up of the top players from several Lustrian-league teams. They quickly made their mark and have remained the top Amazon team ever since.",
    stars:["Bjork Callisto","Sonia Wulfrouj","Vikki Skallagrimson"] },
  { id:"soteks-word", league:"all", name:"Sotek’s Word", race:"Lizardmen",
    difficulty:"Low", style:"All Around", since:"2422", location:"Quetza",
    stadium:"Quetza Temple", coach:"Unknown",
    blurb:"Lizardmen epitomise teamwork, with up to three species working together at once. Skinks are numerous, agile and quick as lightning, balanced by Sauruses — monstrosities capable of felling an Ogre with a single blow.",
    stars:["Anqi Panqi","Glotl Stop","Quetzal Leap","Zolcath the Zoat"] },
  { id:"lustria-croakers", league:"all", name:"Lustria Croakers", race:"Slann",
    difficulty:"Low", style:"Sprint", since:"2411", location:"Xahutec",
    stadium:"Unknown", coach:"Jvêtoudir",
    blurb:"The Slann are an ancient race who once roamed the stuff of Chaos in silver spaceships. The Croakers are reasonably good, with a natural ability to outjump players — their only weakness is the arrogance to pick the hardest games.",
    stars:["—"] },

  /* AFI — Albion Football Institution (Legendary) */
  { id:"galadrieth-gladiators", league:"afi", name:"Galadrieth Gladiators", race:"Elves",
    difficulty:"Low", style:"Dodge", since:"2468", location:"Tor Lithanel",
    stadium:"Laurelorn Stadium", coach:"Perellian Lamecendre",
    blurb:"When the Beechtrees and the Valar merged into the Elfheim Eagles, many veterans were bought by the Gladiators. They’re credited as the first Elven team to develop an effective running game, led by top blitzer Lucien Swift.",
    stars:["Lucien Swift","Highelm Lyrpdre","Rowan «Rootstem» Elderbranch"] },
  { id:"bright-crusaders", league:"afi", name:"Bright Crusaders", race:"Bretonnians",
    difficulty:"Medium", style:"All Around", since:"Unknown", location:"Unknown",
    stadium:"Unknown", coach:"Unknown",
    blurb:"Albion’s first Blood Bowl teams were Bretonnian sides of Peasants, Squires and Knights from the Bretonnian and Tilean occupation — a far cry from today’s Albion teams. The Crusaders are devotees of Nuffle and therefore stand against all forms of dirty play, fouls and underhanded tricks.",
    stars:["«Big» Gunn Schonn"] },
  { id:"greenfield-grasshuggers", league:"afi", name:"Greenfield Grasshuggers", race:"Halflings",
    difficulty:"High", style:"Synergy / Food Tokens", since:"2465", location:"Greenfield",
    stadium:"Dinner Dome", coach:"Hungry Draco",
    blurb:"The Halflings began to take themselves more seriously, training for the pitch as well as the buffet table. In 2476 they became the first (and only) team to score two touchdowns without the ball touching the ground.",
    special:[{name:"Food tokens",text:"During Maintenance, 15 Food tokens are mixed face-down into a pool. When an effect assigns a Food token, draw one at random, place it as instructed and reveal it — 6× give +1 Star Power, 2× give +2, 2× reduce power by 2 (min 0), 3× grant an immediate fan, 2× do nothing. If the pool is empty when a Food token would be assigned, ignore that ability. The effect lasts until the Scoreboard phase; a power-boosting token works whether the player is standing or downed; an injured player returns the token to the pool (re-mix it face-down)."}],
    stars:["Jingo Merrychap","«Big» Jobo Hairyfeet"] },

  /* TCD — Tomb Crushers Division (Legendary) */
  { id:"neter-khertet", league:"tcd", name:"Neter-Khertet", race:"Tomb Kings",
    difficulty:"High", style:"Synergy / Tomb Prince", since:"−8000", location:"Nehekhara desert",
    stadium:"Unknown", coach:"Unknown",
    blurb:"The oldest team on the circuit — it is said some of its players were already there for their first game. The Khemri are tenacious, and they don’t like to die: it annoys them. A curse follows them, though no one yet knows whom it concerns.",
    special:[
      {name:"Immortality",text:"The Tomb Prince’s “Immortal” ability prevents him from being downed or injured by any effect — his manager may ignore any tackle, team upgrade or staff upgrade that would down him or remove him from play."},
      {name:"Pharaoh skill",text:"An exclusive skill: once a player with the Pharaoh skill is committed to a matchup, friendly players committed there afterwards may use their Pharaoh abilities (e.g. a Thro-Ra committed after the Tomb Prince can Pass and also Sprint)."}],
    stars:["Setekh","Ramtut III","Ithaca Benoin","Sinnedbad"] },
  { id:"underworld-creepers", league:"tcd", name:"Underworld Creepers", race:"Underworld",
    difficulty:"Very High", style:"Synergy / Warpstone", since:"2440", location:"Naggaroth",
    stadium:"Underworld Coliseum", coach:"Lance Fleshbarb",
    blurb:"An alliance of Goblins and Skaven that triggers an absolute health emergency. They can’t agree for more than ten minutes except to collect Warpstone — and they’ve won the prize for ‘team that killed the most of its own players’ 14 times in 20 years.",
    special:[{name:"Warpstone fragments",text:"Players come into play with Warpstone fragments. A player’s green Warpstone value adds to the matchup’s Warpstone total as long as he stays committed there, standing or downed. An ability marked with a black Warpstone icon is active only while the matchup’s total is equal to or greater than the number in the icon (an “X” icon means any amount). A grey Warpstone value is the total needed to activate that player’s downed skills."}],
    stars:["Split Tendoncutter","Garbage Throttlesnot","Grograt Crunchskull","Rasta Tailspike"] },
  { id:"bruendar-grimjacks", league:"tcd", name:"Bruendar Grimjacks", race:"Necromantic",
    difficulty:"Very High", style:"Synergy / Moon Phase", since:"Unknown", location:"Unknown",
    stadium:"The Graveyard", coach:"Unknown",
    blurb:"Creatures of the night under a Necromancer’s orders — they tend to howl at the moon if a match drags on, and often field around 180 (pieces of) players per game.",
    special:[{name:"Moon phases",text:"A two-sided Moon Phases card starts each week on the Morrslieb side. Morrslieb activates only dark-background Morrslieb abilities; Mannslieb activates only Mannslieb abilities. The mandatory ‘Moon Phase change’ skill is always resolved last (only if the player is still standing) and sets the card to the side its icon shows."}],
    stars:["Frank N. Stein","Helmut Wulf","Slarga Foulstrike","G’Ral Blödschuker"] },

  /* FFS — Foul Fiends Syndicate (Legendary) */
  { id:"midden-moors-marauders", league:"ffs", name:"The Midden Moors Marauders", race:"Slaanesh",
    difficulty:"Medium", style:"Seduce Tokens", since:"2468", location:"Middenheim",
    stadium:"Middenheim Arena", coach:"Uthar Hagg",
    blurb:"Worshippers of Slaanesh, Chaos God of excess, who wish either for the greatest popularity or the most ecstatic pleasure. Unable to pull themselves together into a truly cooperative team, they are as selfish as they are unpredictable.",
    special:[{name:"Seduce tokens",text:"The rulebook lists this team’s style as “Seduce Tokens” but has no special-rules section explaining them (the team is not in its Special Rules index)."}],
    stars:["Gobbler Grimlich","Dorjak Sureclaw","Bellow Thunderslam"] },
  { id:"drakwald-beasts", league:"ffs", name:"Drakwald Beasts", race:"Tzeentch",
    difficulty:"Very High", style:"Mutations", since:"Unknown", location:"Drakwald Forest",
    stadium:"Unknown", coach:"Unknown",
    blurb:"A team in constant mutation through their devotion to Tzeentch, the Lord of Change. During the game its players win or lose mutations that increase their playing technique.",
    special:[
      {name:"Mutations",text:"At setup, form an 11-card face-down Mutation deck and set the 4 Blue Horror token-cards aside with your team tokens. When a player gains a Mutation, draw one at random, assign it and resolve its skill immediately; it stays in play until the Scoreboard phase but is inactive while the player is downed. During Maintenance, shuffle all Mutation cards back into a fresh Mutation deck."},
      {name:"Pink & Blue Horrors",text:"When the Pink Horror would be downed, discard it and assign 2 Blue Horrors to the same matchup. An injured Blue Horror is removed from the game and placed back next to your team tokens (Blue Horrors count as tokens and are always kept apart from the team deck). Per its card, each Blue Horror is also removed from the game during the Scoreboard phase."}],
    stars:["Withergrasp Doubledrool","Lewdgrip Whiparm"] },
  { id:"frozen-phantoms", league:"ffs", name:"Frozen Phantoms", race:"Ethereal",
    difficulty:"High", style:"Synergy", since:"Unknown", location:"Unknown",
    stadium:"Unknown", coach:"Unknown",
    blurb:"Incorporeal creatures, invisible to the naked eye. They pass through all physical barriers and fly across the field at incredible speeds — a single scream can scare a mortal to death.",
    stars:["—"] },

  /* NAF — Nuffle Amorical Football (Legendary) */
  { id:"orcland-raiders", league:"naf", name:"Orcland Raiders", race:"Orcs",
    difficulty:"High", style:"Synergy / Chomp Tokens", since:"2435", location:"Orcland",
    stadium:"Skull Stadium", coach:"Cruel-Eye",
    blurb:"An impressive track record on the NFC Championship and an equally impressive history. Saved from bankruptcy when King Ironclaw of Orcland bought the team and hired Ogre ex-torturer Cruel-Eye to ready them for strong competition.",
    special:[{name:"Chomp! tokens",text:"During Maintenance, place the 3 “Chomp!” tokens (one each for Tackle, Pass and Sprint) in front of you. When a card effect assigns a Chomp! token to a matchup, you must place the matching token there if it is available. It cancels the next use of that skill by an opponent: once an opposing player with that skill symbol is committed to the matchup, he can’t use that skill and the token is discarded (unavailable) until the end of the Scoreboard phase. Take all 3 back during Maintenance."}],
    stars:["Gorbag «Rabid» Foamface","Ugar Rancid","Grishnak Lancegobelin"] },
  { id:"evil-gitz", league:"naf", name:"Evil Gitz", race:"Goblins / Squigs",
    difficulty:"High", style:"Giant Squig / Ingested players", since:"2450", location:"Unknown",
    stadium:"Unknown", coach:"Unknown",
    blurb:"What’s more dangerous than a hungry attacking squig? That’s what the goblin brains of the team said (and that’s the problem). Squig riders look great, but their mount tends to pummel its rider — and sometimes the ball.",
    special:[
      {name:"Giant Squig",text:"The Giant Squig is a 2-part player; you must hold both cards (parts 1 & 2) to commit him. When committed, draw a new player from your Team deck. If you hold only one part, you may discard it at the start of your turn to draw a replacement."},
      {name:"Ingest",text:"Some Squigs can ‘Ingest’ a player — place the ingested player beneath the Squig’s card. During the Scoreboard phase, add the standing Star Power of ingested players to the Squig. Ingested players return to their owner’s discard pile during Maintenance."}],
    stars:["—"] },
  { id:"bogenhafen-barons", league:"naf", name:"Bögenhafen Barons", race:"Humans",
    difficulty:"High", style:"Synergy", since:"2494", location:"Bögenhafen",
    stadium:"Bögenhafen Stadium", coach:"Tobias Rheinlich",
    blurb:"Founded only six years ago by lifelong fan Dietrich Lugendörf, yet already a powerhouse of the Nobility leagues — a huge stadium, a roster of the best players money can buy, and a feverishly devoted fanbase.",
    special:[{name:"Banner tokens",text:"During Maintenance, place the 3 Banner tokens in front of you. When a card effect assigns a Banner to a matchup, you may place that Banner there if it is available. It affects all friendly players committed to that matchup: Banner of Glory (you gain 1 Fan during the Scoreboard phase), Banner of Prestige (they gain Stand Firm), Banner of Strength (+1 Star Power). Once assigned to a matchup, a Banner can only be moved or discarded by Team Upgrade cards."}],
    stars:["Griff Oberwald","Lietpold Hegunden","Jorge Bergen"] }
];

/* =============================================================================
   SETUP STEPS — each is tagged with its source and cites a rulebook page.
   `when(c)` filters by the current configuration; `order` sets sequence.
   c = { has(src), p (managers), season, opt(id), teamsFrom(src) }
   ============================================================================= */
BBTM.setupPhases = [
  "Prepare the common play area",
  "Prepare each manager",
  "Final preparations"
];
BBTM.setup = [
  { order:1, ph:0, src:"core", page:"Rulebook p.4",
    t:"Prepare the Highlight deck",
    d:"Shuffle all Highlight cards and place the deck facedown at one end of the common play area.",
    note:c=> c.has("sudden") ? "Shuffle the 15 new Sudden Death Highlight cards into this deck first (Sudden Death p.1–2)." + (c.has("foul") ? " Foul Play adds no Highlight cards." : "") : "" },

  { order:2, ph:0, src:"core", page:"Rulebook p.4",
    t:"Choose teams",
    d:c=>{
      const pools = ["the 6 base-game teams (OWA & CWC)"];
      if (c.has("sudden")) pools.push("the 3 Dark Sorcery Syndicate teams (Sudden Death p.2)");
      if (c.has("foul"))   pools.push("the 3 Putrid Players’ Guild teams (Foul Play p.1)");
      if (c.has("legendary")) pools.push("the 21 Legendary-Edition teams across 7 unofficial leagues");
      const tu = (c.has("sudden")||c.has("foul"))
        ? "its Team Upgrade cards (5 for a base-game team; 6 for a DSS or PPG team)"
        : "its 5 Team Upgrade cards";
      return "Draw team tokens at random (one manager cups one token from each team), or simply agree who manages which team. Available pools: "+pools.join(", ")+". "+
             "Each manager takes a scoreboard (set to “00”) and that team’s 12 Starting Player cards, "+tu+" and its 3 team tokens. Return everything belonging to unmanaged teams to the box."; } },

  { order:3, ph:1, src:"core", page:"Rulebook p.4",
    t:"Shuffle Team decks & Team Upgrade decks",
    d:"Each manager shuffles their 12 Starting Player cards (no Star Players) facedown, leaving room for a discard pile, then shuffles their Team Upgrade cards facedown nearby.",
    note:c=> (c.has("sudden")||c.has("foul")) ? "Any base-game manager also shuffles in the one extra Team Upgrade card their expansion provides for their team. (If using both expansions, use only the Sudden Death version.) — Sudden Death p.2 · Foul Play p.1" : "" },

  { order:4, ph:0, src:"core", page:"Rulebook p.3–4 · p.7",
    t:"Prepare the Star Player decks",
    d:c=>{
      const decks=["OWA","CWC"];
      if (c.has("sudden") && c.teamsFrom("sudden")) decks.push("DSS");
      if (c.has("foul")   && c.teamsFrom("foul"))   decks.push("PPG");
      const extra = decks.length>2 ? " (the DSS/PPG deck is only set out if someone is managing a team from that subdivision — "+[c.has("sudden")&&"Sudden Death p.2", c.has("foul")&&"Foul Play p.1"].filter(Boolean).join(" · ")+")" : "";
      return "Separate all Star Player cards (marked with ✪) by their card back and shuffle each subdivision deck separately, placing them facedown near the Highlight deck. Decks in play: "+decks.join(" · ")+extra+". A manager may only draft Star Players from their own subdivision’s deck — free agents are neutral players that belong to no team, but they are still drafted from the deck they appear in."; } },

  { order:5, ph:0, src:"core", page:"Rulebook p.5 · FAQ p.1",
    t:"Prepare the Staff Upgrade deck",
    d:c=> c.opt("noSalary") ? "Shuffle all Staff Upgrade cards (No Salary Cap) and place the deck facedown near the Highlight deck." : "Return the 7 premium Staff Upgrade cards listed below to the box, then shuffle the Staff Upgrade deck and place it facedown near the Highlight deck.",
    note:c=> c.opt("noSalary")
      ? "No Salary Cap variant ON: shuffle in every Staff Upgrade card, including the expensive ones."
      : "Standard rules (FAQ p.1 errata): before shuffling, return these premium cards to the box — Hall of Famers, Fan Club Enrollment, We’ll Get ’Em Next Season, Staffing Office (×2) and Talent Scout (×2)." },

  { order:6, ph:0, src:"core", page:"Rulebook p.5 / p.16 · p.17",
    t:"Prepare the Spike! Magazine deck",
    d:c=>{
      if (c.p===2){
        const gtl = c.has("foul") ? " Include the Goblin Tribal Leeg in the tournaments you shuffle (Foul Play p.1) — one more card, so one more round." : "";
        if (c.has("sudden")) return "Two managers (Sudden Death p.4): shuffle together all Tournament cards from the Sudden Death expansion to form the deck — the game lasts 5 rounds. (Remove all Headlines, and keep “The Blood Bowl” on the bottom as in the base two-manager rule — the season ends the week it is resolved.)"+gtl+" Place the deck at the opposite end from the Highlight deck.";
        return "Two managers: remove all Headline cards. Set aside “The Blood Bowl”, shuffle the other three Tournament cards, then place “The Blood Bowl” on the bottom — a 2-manager game lasts 4 rounds."+gtl+" Place the deck at the opposite end from the Highlight deck.";
      }
      if (c.season==="abbrev") return "Abbreviated season (4 weeks): set aside “The Blood Bowl”. At random, draw 1 Tournament card and 2 Headline cards (return the rest to the box unseen), shuffle them, place “The Blood Bowl” on the bottom — a 4-card deck, 4 weeks. Place the deck at the opposite end from the Highlight deck. Note: the rulebook’s “two Headline cards (instead of three)” (p.17) is a misprint; the standard deck already uses two Headlines, so the abbreviated season simply drops one Tournament.";
      if (c.season==="extended") return "Extended season (6 weeks): set aside “The Blood Bowl”. At random, draw 2 Tournament cards and 3 Headline cards (return the rest to the box unseen), shuffle them, place “The Blood Bowl” on the bottom. Place the deck at the opposite end from the Highlight deck.";
      return "Standard season (5 weeks): set aside “The Blood Bowl”. At random, draw 2 of the "+((c.has("sudden")||c.has("foul")) ? "remaining" : "3 remaining")+" Tournament cards and 2 of the Headline cards, returning the undrawn cards to the box without looking at them. Shuffle the four together, then place “The Blood Bowl” facedown on the bottom. Place the deck at the opposite end from the Highlight deck.";
    },
    note:c=> (c.has("sudden")||c.has("foul")) && c.p>2
      ? "First swap in the expansion cards (see below) before drawing, and shuffle the new Headline cards into the Headline pool — "
        + [c.has("sudden") && "Sudden Death’s 3 (p.1)", c.has("foul") && "Foul Play’s 3 (Foul Play p.1: its 4 Spike! cards are 3 Headlines plus the Goblin Tribal Leeg)"].filter(Boolean).join(" and ") + "." : "" },

  { order:6.1, ph:0, src:"sudden", page:"Sudden Death p.2",
    when:c=>c.has("sudden"),
    t:"Swap in the Sudden Death tournaments",
    d:"Find and remove the four base-game Tournament cards from the Spike! Magazine deck and replace them with the new Tournament cards from Sudden Death (which now feature Contract payouts)." },

  { order:6.2, ph:0, src:"foul", page:"Foul Play p.1",
    when:c=>c.has("foul"),
    t:"Add the Goblin Tribal Leeg tournament",
    d:"Add the “Goblin Tribal Leeg” Tournament card to the Tournament cards already in use." },

  { order:7, ph:0, src:"core", page:"Rulebook p.5",
    t:"Prepare cheating tokens & dice",
    d:c=>{
      let s="Place all cheating tokens facedown (skull-side up) to one side and mix them into the cheating-token pool. Put the ball tokens and both tackle dice where everyone can reach them.";
      if (c.has("foul")) s+=" Include the 8 extra Foul Play cheating tokens (some carry the Penalty icon — Foul Play p.2).";
      if (c.opt("enchanted")) s+=" (Enchanted Balls is on — the base ball tokens are returned to the box instead; see below.)";
      return s; } },

  { order:7.1, ph:0, src:"sudden", page:"Sudden Death p.2",
    when:c=>c.has("sudden"),
    t:"Form the Contract-token supply",
    d:"After preparing the cheating pool, gather all Contract tokens, place them facedown (hiding their fan values) to the side, and mix them into the contract-token supply pool." },

  { order:7.2, ph:0, src:"sudden", page:"Sudden Death p.2",
    when:c=>c.has("sudden") && c.teamPlayed("black-fangs"),
    t:"Set out Blood tokens",
    d:"Only if someone is managing the Black Fangs: that manager gathers all Blood tokens into a supply near their Team deck." },

  { order:7.3, ph:0, src:"foul", page:"Foul Play p.1",
    when:c=>c.has("foul"),
    t:"Build the Penalty deck",
    d:"Shuffle all Penalty cards and place them facedown to create the Penalty deck." },

  { order:7.4, ph:0, src:"foul", page:"Foul Play p.1",
    when:c=>c.has("foul") && c.teamsFrom("foul"),
    t:"Set out Disease tokens",
    d:"If anyone is playing a Putrid Players’ Guild team, one of those managers gathers all Disease tokens into a supply within reach of all managers." },

  { order:7.5, ph:0, src:"foul", page:"Foul Play p.2",
    when:c=>c.has("foul") && c.p===5,
    t:"Add the 5th scoreboard",
    d:"Foul Play supplies the extra scoreboard needed for a fifth manager. With five managers, follow all the normal base-game rules." },

  { order:8, ph:2, src:"core", page:"Rulebook p.5",
    t:"Assign the first manager",
    d:"The youngest manager takes the golden coin and is the first manager for the first round.",
    note:c=> c.season==="abbrev"
      ? "Abbreviated season: now distribute starting improvements (next step) before play begins." : "" },

  { order:8.1, ph:2, src:"core", page:"Rulebook p.17 · p.15 · FAQ p.2",
    when:c=>c.season==="abbrev",
    t:"Distribute starting improvements (Abbreviated season)",
    d:"Each manager: draw 4 Star Players from their subdivision’s deck and draft 2 (the rest go to the bottom of that deck); draw 1 card from your shuffled Team Upgrade deck; draw 3 Staff Upgrades and keep 1 (the rest go to the bottom). Place these in the improvement pile, then reveal them in the normal order — Staff Upgrades, Team Upgrades, Freebooters, other Star Players. For each Freebooter you may first return any one Player card from your roster to the box (optional), then shuffle the Freebooter into your Team deck; the other Star Players go on top of it, so they will be in your opening hand when you replenish to six in the first Maintenance phase." },

  { order:8.2, ph:2, src:"sudden", page:"Sudden Death p.4",
    when:c=>c.opt("enchanted"),
    t:"Prepare for Enchanted Balls (optional)",
    d:"Return all base ball tokens to the box. Each Maintenance phase, during ‘Prepare for Kickoff’, the first manager mixes the Enchanted Ball tokens facedown and places one faceup on every Highlight and Tournament card — its effect (Star Power, Fans or a Skill) is visible to all." },

  { order:8.3, ph:2, src:"foul", page:"Foul Play p.3",
    when:c=>c.opt("corruptRef"),
    t:"Prepare the Corrupt Ref (optional)",
    d:c=>"Each Maintenance phase, during ‘Prepare for Kickoff’, the first manager places the Corrupt Ref at midfield of any matchup. Committing a player there assigns that player a faceup cheating token, then the ref moves toward the Spike! Magazine deck one matchup per space, a number of spaces equal to the player’s printed standing Star Power; if he is at the matchup nearest the Spike! deck with spaces left, he moves to the matchup furthest from it and keeps going."
      + (c.p===2 ? " In a two-manager game, place the ref at any matchup after the two unused highlights are removed." : "") },

  { order:8.4, ph:2, src:"foul", page:"Foul Play p.4",
    when:c=>c.opt("stadiums"),
    t:"Prepare the Stadiums (optional)",
    d:c=> "Shuffle the Stadium cards and draw " + (c.p===2 ? "four" : "a number equal to the managers (" + c.p + ")") +
      "; lay them in a line between the Spike! Magazine and Highlight decks and return the rest to the box. Each round when rolling the Highlights, place each Highlight on top of one Stadium so their team-zone payouts align (one highlight per stadium). The stadiums stay in that order and position for the whole game, and each stadium’s restriction (banned skill / player limit / Star Power requirement) stays active all game." }
];

/* Notes shown beneath the steps for the current configuration. */
BBTM.setupCallouts = [
  { when:c=>c.p===2, src:"core",
    t:"Two-manager game",
    d:"When rolling the Highlights, reveal four; after two highlights each have a committed player, return the other two to the box. There is no runner-up payout — the winner takes the trophy payout and the loser takes the LOSE! payout. A team alone at a tournament collects the winner’s and the LOSE! payouts (not the runner-up’s) (Rulebook p.16)." },
  { when:c=>c.opt("scheduling"), src:"core",
    t:"Scheduling Limitations (optional)",
    d:"When rolling the Highlight reel, reveal only as many highlights as needed for the total number of matchups (highlights + any tournament) to equal the number of managers (Rulebook p.17)." },
  { when:c=>c.has("legendary"), src:"legendary",
    t:"Legendary-Edition teams",
    d:"Nine Legendary teams have their own special rules (Veteran cards, Food tokens, Warpstone, Moon phases, Mutations, Chomp! tokens, Banners, Immortality, Giant Squig). If you’re managing one, set out its unique tokens/cards as described on its Special Rules pages — see each team in the Teams & Leagues tab." },
  { when:c=>c.opt("noSalary"), src:"core",
    t:"No Salary Cap",
    d:"All premium Staff Upgrade cards stay in the deck, making the expensive, non-essential staff positions available all season (FAQ p.1)." }
];

/* =============================================================================
   GAME REFERENCE
   ============================================================================= */
BBTM.reference = {
  rounds: {
    id:"sec-round", title:"The Game Round",
    intro:"A standard season is five rounds (‘weeks’), each with three phases. Adjust the count for season length / player count (4–6 rounds).",
    phases:[
      { h:"1 · Maintenance Phase", items:[
        "Refresh all exhausted cards to upright.",
        "Replenish each hand to 6 cards (reshuffle your discard pile into a new Team deck when it runs out).",
        "First manager restocks the cheating-token pool (flip all facedown and mix).",
        "First manager reveals the top Spike! Magazine card (a Headline is read aloud; a Tournament can be competed for this round).",
        "First manager ‘rolls the Highlights’ — draw Highlight cards equal to the number of managers and lay them in a line (the Highlight Reel) (two managers: reveal four and return the two left without players once two each have a committed player; Scheduling Limitations: highlights + tournament = number of managers — Rulebook p.16–17).",
        "Prepare for Kickoff — place one ball on each Highlight (and the Tournament). The ball there counts as Midfield." ] },
      { h:"2 · Matchup Phase", items:[
        "Starting with the first manager and going clockwise, each turn: Commit one player to a matchup — or Pass.",
        "Highlight: commit to an empty team zone or the one already holding your players — never both zones of the same highlight, and at most two managers per highlight (if a zone is emptied, another manager may take it). Tournament: any number of managers may commit.",
        "On commit: resolve ‘When Played’ abilities, then use the player’s skills left-to-right.",
        "You may then resolve one Matchup Action (exhaust a Team or Staff Upgrade).",
        "Passing is permanent for the phase — a passed manager commits no more players and resolves no more actions, but may discard unwanted players.",
        "The phase ends once every manager has passed." ] },
      { h:"3 · Scoreboard Phase", items:[
        "Resolve matchups in Reel order (closest to the Highlight deck first); resolve Tournaments last.",
        "Per matchup, finishing each before the next: reveal cheating tokens → resolve Scoreboard-phase abilities (in turn order) → determine the winner → collect payouts → clear the pitch (players to their owners' discard piles; the Highlight card back to the box).",
        "In turn order, reveal your improvement pile and read each card aloud, in this order: Staff Upgrades → Team Upgrades → Freebooter Star Players (shuffled into a new Team deck; see Freebooter) → all other Star Players (placed on top of your Team deck in any order).",
        "Pass the golden coin to the manager on the left." ] }
    ]
  },

  skills: {
    id:"sec-skills", title:"Skills",
    intro:"Skills are the icons between a player’s art and text box, used left-to-right when the player is committed. Cheating is mandatory; everything else is optional. A skill must be fully resolved before the next.",
    items:[
      { k:"Cheating", icon:"cheating", tag:"core", t:"Mandatory. For each icon, draw one random cheating token from the pool and place it facedown (skull-up) on the player. Tokens are revealed and resolved in the Scoreboard phase." },
      { k:"Passing", icon:"passing", tag:"core", t:"Optional. Take the ball if it’s at midfield; if an opponent is the ball carrier, move it to midfield; if a teammate holds it, you may take it or leave it. Extra pass icons on a player who already carries the ball are ignored. The carrier adds +2 Star Power to their team." },
      { k:"Sprinting", icon:"sprinting", tag:"core", t:"Optional. For each icon, draw the top card of your Team deck, then discard one card from your hand (it may be the one just drawn)." },
      { k:"Tackling", icon:"tackling", tag:"core", t:"Optional. For each icon, attempt one tackle against an opposing player at the matchup (see Tackle Outcomes). Multiple icons resolve separately." },
      { k:"Regeneration", icon:"regeneration", tag:"sudden", t:"Optional downed skill (Sudden Death p.3 · Foul Play p.2); never used when the player is committed. On a downed player, roll 2 dice and choose one; a ✖ result (the Tackler-Down face) lets you return the player to standing — all other results are ignored. Resolve it in sequence (left to right) with the player’s other downed skills; if he stands, any downed skills after it are not used and his standing skills are ignored. Also part of Foul Play, so it applies with either expansion." },
      { k:"Fouling", icon:"fouling", tag:"foul", t:"Optional (Foul Play p.2). Choose an opposing manager at the matchup and randomly take one card from their hand; secretly look, then either return it or discard it (they then draw one). Needs an opponent at the matchup." }
    ],
    downed:"Downed skills (Sudden Death p.3 · Foul Play p.2): icons printed next to a player’s downed Star Power resolve the instant that player is downed, interrupting the active turn; then the active manager’s turn resumes and he may use the remaining standing skills on the card he just played. If players of two managers are downed at the same time, the active manager resolves his downed skills first. Downed skills resolve left-to-right (cheating is mandatory, the rest optional); a downed tackle uses the downed Star Power; the player still loses all printed abilities."
  },

  tackle: {
    id:"sec-tackle", title:"Tackle Outcomes",
    intro:"Compare the tackler’s Star Power to the target’s, then roll the tackle dice. (The ball token does not affect a player’s Star Power during tackle attempts unless an ability says so.)",
    dice:[
      { c:"Tackler SP > Target SP", d:"Roll 2 dice — tackler’s manager picks one result." },
      { c:"Tackler SP = Target SP", d:"Roll 1 die — apply that result." },
      { c:"Tackler SP < Target SP", d:"Roll 2 dice — the opposing manager picks one result." }
    ],
    results:[
      { k:"Target Down", icon:"target-down", t:"The tackle succeeds: a standing target becomes downed; a downed target becomes injured." },
      { k:"Target Missed", icon:"target-missed", t:"The tackle fails, with no other effect." },
      { k:"Tackler Down", icon:"tackler-down", t:"The target evades: a standing tackler becomes downed; a downed tackler becomes injured. (Not a ‘successful tackle’.)" }
    ],
    states:[
      { k:"Standing", t:"Upright; uses standing Star Power (top-left of the card)." },
      { k:"Downed", t:"Rotate 90° clockwise; uses downed Star Power; a downed ball carrier drops the ball to midfield (unless an ability such as Sure Hands or Dump-off says otherwise); loses all abilities and remaining skills but keeps already-assigned cheating tokens." },
      { k:"Injured", t:"Removed to the discard pile; an injured ball carrier drops the ball to midfield; discards its cheating tokens. Recovers when the discard pile next becomes the new deck." }
    ]
  },

  cheating: {
    id:"sec-cheat", title:"Cheating Tokens",
    intro:"Cheating tokens are drawn blind from the pool and stay facedown on the player until the Scoreboard phase. When a matchup is resolved, the first manager flips every assigned token at that matchup and applies them in this order:",
    order:[
      { k:"1 · Ejection (whistle)", t:"The ref caught him: remove the player from the matchup to his manager’s discard pile and discard his other cheating tokens without resolving them. An ejected ball carrier drops the ball to midfield." },
      { k:"2 · Fan Frenzy (flag)", t:"For each flag icon, that player’s manager immediately gains one fan." },
      { k:"3 · Star Power (star)", t:"Star-Power tokens are cumulative and count toward the team’s total in the Determine Winner step." }
    ],
    pool:[
      { src:"core", h:"Base pool (30 tokens)", t:"6× whistle (ejection) · 4× ★0 · 9× ★+1 · 4× ★+2 · 2× ★+3 · 4× one flag (+1 fan) · 1× two flags (+2 fans)." },
      { src:"foul", h:"Foul Play adds 8", t:"4× Penalty (the player’s manager takes a penalty, applied at the end of the Reveal Cheating Tokens step) · 2× ★+1 · 1× ★+2 · 1× ★+3." }
    ],
    notes:[
      "No one may look at a facedown token unless a card ability allows it.",
      "Downed players keep their assigned tokens; injured or ejected players discard theirs.",
      "“Discarded” tokens are set aside — they only return to the pool when the first manager restocks it in the next Maintenance phase."
    ]
  },

  winner: {
    id:"sec-winner", title:"Determine the Winner & Payouts",
    intro:"Total each team’s Star Power at the matchup: standing players use standing SP, downed players use downed SP, cheating tokens add their SP, and the ball carrier’s team gets +2.",
    bullets:[
      "Highest total wins. On a tie, the team with the ball carrier wins.",
      "Highlight tie with the ball at midfield → a draw: neither team is the winner or the loser, and no one takes the central payout (team-zone payouts are still collected).",
      "Tournament tie (for winner or runner-up) where neither tied team has the ball → the first manager decides which tied team is higher (FAQ p.1 errata).",
      "Highlight: each manager with at least one player still in their team zone at Collect Payouts takes that zone's payout; the winner also takes the central payout.",
      "Tournament: winner takes the trophy payout, runner-up the ribbon payout, everyone else with a player there takes the LOSE! payout. (At tournaments both winner and runner-up count as ‘winners’.) With two managers there is no runner-up payout: the loser takes LOSE!, and a team alone takes the trophy and LOSE! payouts (Rulebook p.16).",
      "Alone at a matchup → you collect every payout shown on the card.",
      "Fans are gained immediately; cards go facedown into your improvement pile.",
      "Sudden Death p.3 / Foul Play p.2 clarification: Scoreboard-phase abilities that score fans for winning or losing a matchup are resolved after the Determine Winner step."
    ],
    icons:[
      { k:"Fan", icon:"fan", t:"Gain one fan per icon (turn the scoreboard dials)." },
      { k:"Star Player", icon:"star-player", t:"Draw one from your subdivision per icon, draft one, return the rest to the bottom of the deck." },
      { k:"Team Upgrade", icon:"team-upgrade", t:"Draw one per icon, keep one, return the rest to the bottom." },
      { k:"Staff Upgrade", icon:"staff-upgrade", t:"Draw one per icon, keep one, return the rest to the bottom." },
      { k:"Either / Or", t:"A central payout split by a slash — the winner chooses one of the listed rewards." },
      { k:"Contract", icon:"contract", tag:"sudden", t:"(Sudden Death p.2) Draw a facedown Contract token per icon; reveal and score its fans only at the end of the game." }
    ]
  },

  mechanics: {
    id:"sec-mech", title:"Expansion Mechanics",
    items:[
      { src:"sudden", h:"Contracts", t:"Earn facedown Contract tokens from Cabalvision Contract icons on Highlights/Tournaments. They stay hidden until after all ‘End of Game’ abilities, then are revealed and scored as fans (15 tokens: 6× 2 fans, 4× 3 fans, 3× 4 fans, 2× 5 fans). If the supply is empty, gain 2 fans instead. Contracts don’t count as improvements." },
      { src:"sudden", h:"Either/Or skills", t:"Skill icons split by slashes form skill sets. When you commit such a player you must choose one set to use (you may use every icon on that side); the other sets are ignored while the card is in play." },
      { src:"sudden", h:"Blood tokens", t:"Bloodlust (Black Fangs) gains Blood tokens; each adds +1 to standing and downed Star Power until ‘Clear the Pitch’. Limited to the supply." },
      { src:"sudden", h:"Enchanted Balls (optional)", t:"Optional rule (all managers agree): return the base balls to the box. In each ‘Prepare for Kickoff’ the first manager mixes the Enchanted Balls facedown and places one at random, faceup, on every Highlight and Tournament. Besides breaking ties as normal, each ball gives one effect: Star Power (if your player holds it during the Scoreboard phase, add the printed amount to your team’s total when determining the winner), Fans (if your player holds it during the Scoreboard phase, gain the printed fans), or a Skill (each time a player becomes its carrier, his manager may immediately use the icon, interrupting the active turn; a mandatory icon such as cheating must be used). (Sudden Death p.4)" },
      { src:"foul", h:"Penalties", t:"You receive a penalty from a revealed penalty cheating token (applied at the end of the ‘Reveal Cheating Tokens’ step), from collecting the LOSE! payout of the Goblin Tribal Leeg tournament, and, if used, from the Corrupt Ref and Stadium restrictions. For each penalty, draw one Penalty card and place it facedown without looking. At the end of the ‘Reveal Improvement Pile’ step every manager flips his Penalty cards and resolves them one at a time; they stay faceup until a card tells you to discard them. If a penalty makes you lose a payout type you don’t have, ignore it. (Foul Play p.2)" },
      { src:"foul", h:"Disease tokens", t:"Spread Disease drops tokens at midfield; any player committed/moved there takes them all. Each lowers standing and downed Star Power by 1 (min 0) until ‘Clear the Pitch’. Limited to the supply — none can be placed while it’s empty." },
      { src:"foul", h:"The Corrupt Ref (optional)", t:"In ‘Prepare for Kickoff’ of each Maintenance phase, the first manager places him at midfield of any matchup (2 managers: at any matchup after the two unused highlights are removed). Each time a player is committed to his matchup, that player is immediately assigned one cheating token faceup (faceup tokens take effect only when revealed by a game effect or in the ‘Reveal Cheating Tokens’ step). Then the ref moves toward the Spike! Magazine deck one matchup per point of that player’s printed standing Star Power. If he is at the matchup nearest the Spike! deck with spaces left, he moves to the matchup furthest from the deck and keeps moving. At the start of the Scoreboard phase at his matchup, each team there without at least one player holding a faceup cheating token receives one penalty; then all faceup cheating tokens at that matchup are removed without taking effect. (Foul Play p.3)" },
      { src:"foul", h:"Stadiums (optional)", t:"Optional venue cards laid in a line between the Spike! Magazine and Highlight decks; each rolled Highlight is placed on a Stadium so their payouts combine (one highlight per stadium). A stadium’s restrictive effect lasts all game — a Banned Skill (using it earns a penalty; a banned Cheating icon also makes cheating optional there), a Player Limit per team zone (exceeding it earns a penalty), or a Star Power Requirement (committing/moving a player whose printed standing Star Power is outside the range earns a penalty). Stadiums also add extra payouts to the team zone of the highlight on them." }
    ]
  },

  abilities: {
    id:"sec-abil", title:"Named Abilities",
    intro:"The keyword abilities printed on Player cards (base game) — Rulebook p.17, with FAQ p.1–3 clarifications.",
    items:[
      ["Dauntless","When attacking a higher-SP player, roll only one die and apply the result."],
      ["Dirty Player","If this player injures an opponent, gain a fan."],
      ["Dodge","During a tackle against this player, you may force the opponent to reroll all dice."],
      ["Dump-off","If this player would become the ball carrier or drop the ball, you may move the ball to a friendly player at this matchup — even a downed one (FAQ p.2)."],
      ["Fend","If an opponent successfully tackles this player, you may stand one of your other downed players here."],
      ["Freebooter","When you reveal this Star Player from your improvement pile, you may return any one Player card from your Team deck, discard pile or hand to the game box. Then add the Freebooter to your roster and shuffle him with your Team deck and discard pile into a new Team deck. You must shuffle even if you returned no one, and you don’t have to shuffle the cards in your hand back in. Resolve all Freebooters before placing your other new Star Players on top of the Team deck. Unlike other abilities, it only works on the turn he is drafted. (Rulebook p.15, p.17 · FAQ p.1–2)"],
      ["Frenzy","When this player attempts a tackle, increase his Star Power by 1 during the attempt."],
      ["Guard","When an opponent successfully tackles one of your other players, you may apply the dice result to this player instead (after the roll, before applying). A Guard player can’t guard himself, and Guard can’t interfere with rolls that aren’t tackle attempts, such as Hired Wizard or Eshin Assassination Coordinator (FAQ p.2–3)."],
      ["Juggernaut","When this player attempts a tackle, opponents cannot use Guard."],
      ["Nerves of Steel","While this player is the ball carrier, his Star Power is +1."],
      ["Piling On","Each time you roll two Target-Down results (a double) on this player’s tackle attempt, he may attempt another tackle against a different opponent. An opponent he has already successfully tackled can’t be targeted by him again this round (FAQ p.2)."],
      ["Stand Firm","While this player is the ball carrier, opponents cannot tackle him."],
      ["Strip Ball","Instead of using a Tackling icon, you may place the ball at midfield."],
      ["Sure Hands","If this ball carrier becomes downed, he does not drop the ball (but loses the ability while downed)."],
      ["Throw Team-mate","When played, you may move one of your players from this matchup to a different matchup. If you move the ball carrier, give the ball to any of your players at this matchup."]
    ]
  },

  extra: {
    id:"sec-extra", title:"Additional Rulings",
    intro:"The rulebook’s ‘Additional Rules’ (p.16), plus p.8’s card-wording rule — the ones that come up mid-game.",
    items:[
      { h:"Ability timing", t:"Abilities only interact with players at the same matchup unless they say otherwise. If two abilities occur in the same phase, resolve them in turn order starting with the manager holding the golden coin." },
      { h:"‘Matchup’ vs ‘highlight’", t:"Card text that says ‘matchup’ applies to both highlights and tournaments; text that says ‘highlight’ applies only to highlights and can’t be used at a tournament (Rulebook p.8)." },
      { h:"Contradicting responses", t:"If two Response abilities contradict each other, the last one used takes effect and the earlier one is ignored." },
      { h:"Upgrade abilities", t:"Matchup Actions are used on your turn; Responses when their trigger occurs; Scoreboard-phase abilities during the Scoreboard phase; End-of-Game abilities after the final week. An upgrade you must exhaust is rotated 90°, usable once per round, and refreshes in Maintenance." },
      { h:"Winning & losing", t:"‘Win’ / ‘lose’ abilities need you to have committed at least one player to that matchup. At a tournament the winner and runner-up both count as winners; LOSE! collectors are losers. A manager alone at a matchup is its winner." },
      { h:"Moving a committed player", t:"A player relocated by an ability is ‘moved’, not ‘committed’, so he can’t use his skills at the new matchup. He may go to any matchup with an open team zone, or one where a friendly player already is. If the ball carrier is moved, give the ball to a friendly player of your choice at the original matchup." },
      { h:"Fans", t:"The scoreboard’s left dial is tens and the right is ones; your fan total can never drop below 00." }
    ]
  },

  winning: {
    id:"sec-win", title:"Winning the Season",
    intro:"The season culminates in The Blood Bowl tournament and ends after the final round. After ‘End of Game’ abilities (and revealing Contract tokens, if any), the manager with the most fans wins the “Manager of the Year” award (Rulebook p.2, p.9 · Sudden Death p.2).",
    ties:[
      "Tie on fans → the most-developed team wins (most Star Players + team + staff upgrades gained all season). (Contract tokens don’t count as improvements — Sudden Death p.2)",
      "Still tied → the TMU suspends the tied managers (they lose all fans) and awards the prize to the next manager with the most fans.",
      "Everyone tied → the fans revolt and nobody wins."
    ]
  },

  faq: {
    id:"sec-faq", title:"Handy Rulings (FAQ)",
    items:[
      { q:"What counts as my ‘roster’?", a:"Every Player card belonging to your team — at matchups, in your Team deck, discard pile and hand. Cards in the improvement pile aren’t part of the roster until added during ‘Reveal Improvement Pile’ (FAQ p.1)." },
      { q:"Do I have to commit my whole hand each round?", a:"No. You may pass early, discard players you don’t want, and replenish back up to six next Maintenance (FAQ p.1 · Rulebook p.9)." },
      { q:"Only three team tokens — am I limited to three Star Players?", a:"No — there’s no limit to how many Star Players you can draft. A team token is needed only when the first player you commit to a matchup has a different team icon from yours; cover that icon with a token, and remove it once you commit a player whose icon matches (FAQ p.1)." },
      { q:"Which Star Players can I draft?", a:"Any from your own subdivision’s deck (e.g. the Athelorn Avengers can draft Wood Elf, Dwarf and Human stars); you can never draft from another subdivision (FAQ p.2). Free agents are neutral Star Players with grey cards that belong to no team (Rulebook p.7); they are drafted from whichever subdivision deck they appear in. Morg ’N Thorg, One Ear and Slab are neutral, not Freebooters — only players with the Freebooter ability are (FAQ p.2). Morg ’N Thorg has one OWA and one CWC card; once one manager commits him to a matchup, no one can commit the other copy there (Rulebook p.16)." },
      { q:"Does a downed ball carrier with Sure Hands keep the ball?", a:"He keeps it on the way down, but Sure Hands (like all abilities) is lost while he’s downed (Rulebook p.17 · FAQ p.2)." },
      { q:"Can upgrade cards affect a downed player?", a:"Yes — Staff and Team Upgrade abilities can target a downed player, including coach cards: the card lets the player you committed this turn use its skill even if he is now downed, although he has lost his own abilities and skills (FAQ p.2)." },
      { q:"Collecting a payout I can’t fulfil?", a:"If no components of that type are available, you earn nothing for that payout (FAQ p.3)." },
      { q:"Is any card’s printed text wrong?", a:"Yes — the Grudgebearers’ team upgrade “Rigorous Training” should read: “Response: Each time 1 of your players with the Guard ability becomes downed, draw 1 card from your Team deck and then choose 1 card to discard from your hand.” (FAQ p.1 errata)" }
    ]
  }
};

/* ---- TEACHING SCRIPT (read aloud, ~5 min; every claim checked against the
   BBTM rulebook, Sudden Death, Foul Play and the FAQ — see the setup citations) -- */
BBTM.teach = {
  intro: "Read this aloud — about five minutes. No peeking at the Highlight Reel.",
  sections: [
    { h: "The pitch — and how you win", body: (c) => {
      const len = c.season === "twoPlayer" ? (c.has("sudden")
                    ? (c.has("foul") ? "six weeks (the two-manager Sudden Death schedule plus the Goblin Tribal Leeg)" : "five weeks (the two-manager Sudden Death schedule)")
                    : (c.has("foul") ? "five weeks (the two-manager schedule plus the Goblin Tribal Leeg)" : "four weeks (the two-manager schedule)"))
                : c.season === "abbrev" ? "an abbreviated four weeks"
                : c.season === "extended" ? "an extended six weeks" : "five weeks";
      return `
<p>We are Blood Bowl <b>team managers</b>, and nothing on this table matters except <b>fans</b>. The season runs ${len}, capped by the Blood Bowl tournament itself — when the dust settles, the manager with the most fans lifts the trophy. (Tied? Whoever gained the most improvements over the season — Star Players, Team Upgrades and Staff Upgrades — wins.) Touchdowns are nice. Ratings are everything.</p>${c.season === "abbrev" ? `
<p>Because the season is short, we each start with a head start before the first week: draft <b>two Star Players</b> from four drawn, draw <b>one Team Upgrade</b>, and keep <b>one Staff Upgrade</b> from three drawn — then reveal them all.</p>` : ""}`; } },

    { h: "The week — one round of the season", body: (c) => `
<p>Each week: we each draw up to six cards, then the manager holding the <b>golden coin</b> flips the <b>Spike! Magazine</b> card — ${c.p === 2 ? "with two of us it's always a <b>tournament</b> with a big pot" : "a <b>headline</b> that bends this week's rules, or a <b>tournament</b> with a big pot"} — then roll the <b>Highlight Reel</b>: ${c.p === 2 ? "four matchup cards (once two of them each have a player, the other two go back in the box)" : "one matchup card per manager"}, each printing what each side takes home and a central prize for the winner. Then the heart of it, the <b>Matchup phase</b>: we take turns committing <b>one player card at a time</b> from hand to a side of a highlight (or to the tournament), resolving his ability and skills as he lands — and then you may take one <b>matchup action</b>: use the matchup-action text on one of your Staff or Team Upgrades (one that has you exhaust it is spent until next week). Only two teams can meet at a highlight, so claiming a side is claiming a fight. When you're done — or done for — you <b>pass</b>, and can bin the cards you don't want to keep. Once everyone has passed, the <b>Scoreboard phase</b> pays out: at each matchup compare total <b>Star Power</b> — each side keeps its own zone's payout, and the winner also grabs the central pot.${c.p === 2 ? " If you're alone at a highlight, you collect every payout on the card and count as the winner; alone at the tournament, you take both the trophy and the <b>LOSE!</b> payouts (never the runner-up's)." : " If you're alone at a matchup, you collect every payout on the card and count as the winner."} Then the golden coin passes to the left and we do it again, one week older.</p>` },

    { h: "Star Power & skills — the actual football", body: (c) => `
<p>Every player card has <b>Star Power</b> — his weight on the scale — and <b>skills</b> that fire left-to-right when he's committed. <b>Passing</b> is the ball skill: take the ball from midfield, or knock it out of an opponent's hands — the ball is worth <b>two Star Power</b> and breaks ties. <b>Sprinting</b> digs for talent: draw a card, ditch a card. <b>Tackling</b> tries to knock an opposing player <b>down</b> — a downed player's Star Power drops to his weaker number, he loses his remaining skills and abilities, and he drops the ball; tackle a man who's already down and he's <b>injured</b>, off the pitch to the discard pile. But the dice can put <i>you</i> on the turf instead — and against a bigger man, your opponent picks the die. <b>Cheating</b> is mandatory: slide a facedown token onto that player — when it flips it might be extra Star Power, might be fans, might be the ref's whistle and an <b>ejection</b>. Committing second means committing informed: going last at a highlight is power.</p>` },

    { h: "Payouts — how a team gets better", body: (c) => `
<p>Matchups pay <b>fans</b> — but also <b>Star Players</b> (legends who join your deck), <b>Team Upgrades</b> and <b>Staff Upgrades</b> that thicken your roster and bend the rules; everything you win is revealed together at the end of the week. The engine matters more than any single week: early weeks buy the machine, late weeks cash it in. ${c.p === 2 ? "We can both pile onto the tournament — the winner takes the trophy payout and the loser the <b>LOSE!</b> payout; with two managers there's no runner-up prize." : "On tournament weeks any number of managers can pile onto the tournament — winner and runner-up get paid, everyone else at it takes the <b>LOSE!</b> payout."}</p>` },

    { h: "Sudden Death teams", when: (c) => c.has("sudden"), body: (c) => `
<p>The <b>Dark Sorcery Syndicate</b> is in the league: undead and sorcerous teams with <b>Regeneration</b> (a downed player rolls to get back on his feet), <b>downed skills</b> that fire the moment a player hits the turf, and the Black Fangs' Blood tokens. Some new cards print <b>either/or skills</b> — pick one side of the slash when you commit him. And some of the new highlights and tournaments pay facedown <b>Contracts</b> that only score at the end of the season.${c.opt && c.opt("enchanted") ? " We're also playing with <b>Enchanted Balls</b> — each matchup's ball is placed faceup with its own magic: extra Star Power or fans for whoever holds it at the Scoreboard, or a skill the ball carrier may use each time he grabs it (a cheating icon must be used) — and it still breaks ties." : ""}</p>` },

    { h: "Foul Play teams", when: (c) => c.has("foul"), body: (c) => `
<p>The <b>Putrid Players' Guild</b> is in the league — Nurgle's Rotters, goblins and Chaos Dwarfs. The Rotters' <b>Disease</b> tokens wait at midfield and latch onto the next player committed or moved there — <i>anyone's</i>, yours included — sapping his Star Power. There's also the <b>Fouling</b> skill (peek at a random card from the hand of an opponent at that matchup and either give it back or discard it — if you discard it, they draw a replacement), which some players can even use as a <b>downed skill</b> from the floor, and <b>Penalties</b>: some of the new cheating tokens carry a penalty icon, and collecting the LOSE! payout at the Goblin Tribal Leeg tournament costs one too — each penalty is a facedown Penalty card you draw without looking and resolve at the end of the week. A fifth manager can also join the season.${c.opt && c.opt("corruptRef") ? " The <b>Corrupt Ref</b> is roaming — everyone who commits where he stands gets a faceup cheating token, then he moves on toward the Spike! deck as many matchups as that player's printed standing Star Power; at the Scoreboard, a team at his final matchup without a faceup token eats a penalty, and the faceup tokens at that matchup are removed without effect (faceup tokens he left elsewhere count as normal)." : ""}${c.opt && c.opt("stadiums") ? " And every highlight is played in a <b>Stadium</b> with its own house rule — a banned skill, a player limit per team zone, or a minimum or maximum Star Power — and bonus team-zone payouts. Breaking the house rule isn't forbidden, it just earns you a penalty (and where cheating is banned, cheating becomes optional). Read the venue before you commit." : ""}</p>` },

    { h: "Legendary leagues", when: (c) => c.has("legendary"), body: () => `
<p>We're using the <b>Legendary</b> fan expansion: seven new unofficial leagues (21 teams) join the official ones, and nine of those teams have their own special rules — Veteran upgrades, Food tokens, Warpstone, Moon phases, Mutations and more. If yours does, its Special Rules pages in the Legendary rulebook (and the Teams tab on this site) explain it. Read them with your team.</p>` },

    { h: "Table rules in play", when: (c) => c.opt && (c.opt("noSalary") || c.opt("scheduling")), body: (c) => {
      const bits = [];
      if (c.opt("noSalary")) bits.push("<b>No Salary Cap</b> — every Staff Upgrade, premium ones included, is in the deck");
      if (c.opt("scheduling")) { if (c.p === 2) bits.push("<b>Scheduling Limitations</b> — the matchups (highlights plus the tournament) must equal the number of managers, so with two of us we play just one highlight beside each week's tournament instead of two"); else bits.push("<b>Scheduling Limitations</b> — on tournament weeks we roll one fewer highlight, so every matchup is a knife fight"); }
      return `<p>Also agreed: ${bits.join("; ")}.</p>`;
    }},

    { h: "Don't worry about these yet", body: (c) => `
<p>Individual team gimmicks come alive on their own cards — read yours before we start. Opening advice: don't fight every highlight; <b>concede the small pots to dominate the big ones</b>, and remember a cheating token you can't read is exactly as scary as your opponent wants it to be.</p>` }
  ]
};
