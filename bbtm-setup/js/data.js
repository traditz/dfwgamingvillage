/* =============================================================================
   Blood Bowl: Team Manager — Setup Utility & Reference
   All data grounded in the official rulebook + Sudden Death + Foul Play
   expansions + official FAQ + the community Legendary Edition rulebook.
   Difficulty / Style values are transcribed exactly from the Legendary rulebook
   team pages (verified against the printed ★ ratings).
   ============================================================================= */
const BBTM = {};

/* ---- Content sources (expansions / modules) ------------------------------ */
BBTM.sources = {
  core:      { id:"core",      name:"Core Box",          short:"Core", cls:"src-core", always:true,
               blurb:"The base game: 6 teams across the Old World Association (OWA) and Chaos Wastes Confederation (CWC), for 2–4 managers." },
  sudden:    { id:"sudden",    name:"Sudden Death",      short:"DSS",  cls:"src-dss",
               blurb:"Adds the Dark Sorcery Syndicate (3 undead/magic teams), Contracts, Enchanted Balls, the Regeneration skill, Downed skills and Blood tokens." },
  foul:      { id:"foul",      name:"Foul Play",         short:"PPG",  cls:"src-ppg",
               blurb:"Adds the Putrid Players’ Guild (3 teams), a 5th manager, Penalties, Disease tokens, the Corrupt Ref, the Fouling skill and Stadiums." },
  legendary: { id:"legendary", name:"Legendary Edition", short:"LEG",  cls:"src-leg",
               blurb:"Community fan expansion. Reorganises all teams into themed leagues and adds 7 new unofficial leagues (21 teams), each with its own special mechanic." }
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
    blurb:"Disease-spreading followers of Nurgle, chainsaw-wielding goblins, and grudge-bearing Chaos Dwarfs. The final subdivision to join the Team Managers’ Union, added by the Foul Play expansion." },

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
    special:[{name:"Regeneration & Downed skills",text:"Like all DSS teams, the Nightmares use the Regeneration downed skill (roll 2 dice; on a Target-Down result you may stand the player) and resolve downed skills the moment a player is downed."}],
    stars:["Asperon Thorn","Arkhul Blackhand","Meriann Lightning"] },
  { id:"champions-of-death", league:"dss", name:"Champions of Death", race:"Undead",
    difficulty:"Low", style:"Regeneration", since:"2439", location:"Underearth",
    stadium:"Pain Park, Underearth", coach:"Tomolandry the Undying",
    blurb:"Not even mortality can stand between an Undead player and the pitch. Zombies and Skeletons aren’t durable, but they survive nearly any beating and come back for more — and woe to anyone facing a Mummy or Wight.",
    special:[{name:"Regeneration & Downed skills",text:"The flagship DSS team: use Regeneration to stand downed players (roll 2 dice; on a Target-Down result, return the player to standing), resolved in sequence with their other downed skills."}],
    stars:["G’Ral Blodschüker","Skrull Halfheight","Throttlesnot «The Impaler»"] },

  /* PPG — Putrid Players’ Guild (Foul Play) */
  { id:"nurgles-rotters", league:"ppg", name:"Nurgle’s Rotters", race:"Nurgle",
    difficulty:"High", style:"Disease Tokens", since:"2402", location:"Unknown",
    stadium:"Unknown", coach:"Captain Sven «Four-Eyes» Erikksen",
    blurb:"A vile bunch, constantly spreading disease and oozing their way to victory. They can even turn opponents into more Nurgle players. With disease tokens lowering everyone else’s Star Power, the team is an unstoppable plague.",
    special:[{name:"Disease tokens (Spread Disease)",text:"Spread Disease places disease tokens at midfield; any player committed or moved to that matchup is assigned all of them. Each disease token lowers a player’s standing and downed Star Power by 1 (minimum 0) until ‘Clear the Pitch’."}],
    stars:["Ivan Bouldercrusher","«Smelly» Pete","Goran «The Tentacle» Svengard"] },
  { id:"lowdown-rats", league:"ppg", name:"The Lowdown Rats", race:"Goblins",
    difficulty:"High", style:"Stunty / Foul", since:"2472", location:"Ubrovnia",
    stadium:"The Swampdome", coach:"Hymie Snivel",
    blurb:"These goblins take the cake — chainsaws, bombs and pogo sticks at a football game. The Lowdown Rats never consider fighting fair; they play to win by any means, and failing that, total mayhem will suffice.",
    special:[{name:"Fouling & Penalties",text:"As a PPG team they make heavy use of the Fouling skill (peek at and discard a random card from an opposing hand) and the cheating tokens that carry Penalty icons."}],
    stars:["Scrappa Sorehead","Figgit Spleenpuncher","Dug «Elbows» Snitchit"] },
  { id:"zharr-naggrund-ziggurats", league:"ppg", name:"The Zharr-Naggrund Ziggurats", race:"Chaos Dwarfs",
    difficulty:"Medium", style:"Cheat / Foul", since:"Unknown", location:"Unknown",
    stadium:"Unknown", coach:"Unknown",
    blurb:"Famed weapon-smiths whose creations are as twisted and cruel as they are. Not even being downed can stop these players from fouling their opponents. With thick skulls and intimidating centaurs, they fight to the last breath — and beyond.",
    special:[{name:"Downed Fouling / Trample",text:"Chaos Dwarf players foul even from the floor via downed skills, and Bull Centaurs can Trample — re-attempt a tackle on a player they just downed, using their downed Star Power."}],
    stars:["Hthark the Unstoppable","Rashnak Backstabber","Zzharg Madeye"] },

  /* CABAL — Cabal Vision (Legendary) */
  { id:"elfheim-eagles", league:"cabal", name:"Elfheim Eagles", race:"High Elves",
    difficulty:"High", style:"Level Up", since:"2468", location:"Tor Lithanel",
    stadium:"Laurelorn Stadium", coach:"Perellian Lamecendre",
    blurb:"Even if Elven Union is stereotypical, few know how to counter it: long pass, catch, long pass, touchdown. Simple, efficient. The Eagles’ players can improve their performance during the game.",
    special:[{name:"Veteran players (Level Up)",text:"Each player has a normal card and a golden “Veteran” upgrade (set the Veterans aside at setup). Each time you win a matchup with a Team Upgrade reward, draw a random Veteran card, replace that player’s normal card with the upgraded version, and reshuffle your Team deck."}],
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
  { id:"galadrieth-gladiators", league:"afi", name:"Galadrieth Gladiators", race:"High Elves",
    difficulty:"Low", style:"Dodge", since:"2468", location:"Tor Lithanel",
    stadium:"Laurelorn Stadium", coach:"Perellian Lamecendre",
    blurb:"When the Beechtrees and the Valar merged into the Elfheim Eagles, many veterans were bought by the Gladiators. They’re credited as the first Elven team to develop an effective running game, led by top blitzer Lucien Swift.",
    stars:["Lucien Swift","Highelm Lyrpdre","Rowan «Rootstem» Elderbranch"] },
  { id:"bright-crusaders", league:"afi", name:"Bright Crusaders", race:"Bretonnians",
    difficulty:"Medium", style:"All Around", since:"Unknown", location:"Unknown",
    stadium:"Unknown", coach:"Unknown",
    blurb:"Descended from the Bretonnian and Tilean teams of the island’s occupation. The Crusaders are devotees of Nuffle and therefore stand against all forms of dirty play, fouls and underhanded tricks.",
    stars:["«Big» Gunn Schonn"] },
  { id:"greenfield-grasshuggers", league:"afi", name:"Greenfield Grasshuggers", race:"Halflings",
    difficulty:"High", style:"Synergy / Food Tokens", since:"2465", location:"Greenfield",
    stadium:"Dinner Dome", coach:"Hungry Draco",
    blurb:"The Halflings began to take themselves more seriously, training for the pitch as well as the buffet table. In 2476 they became the first (and only) team to score two touchdowns without the ball touching the ground.",
    special:[{name:"Food tokens",text:"During Maintenance, 15 Food tokens are mixed face-down into a pool. When an effect assigns a Food token, draw one at random, place it as instructed and reveal it — most change a player’s Star Power (mostly +1/+2, some −2) and some grant fans or draws. The effect lasts until the Scoreboard phase; an injured player returns the token to the pool."}],
    stars:["Jingo Merrychap","«Big» Jobo Hairyfeet"] },

  /* TCD — Tomb Crushers Division (Legendary) */
  { id:"neter-khertet", league:"tcd", name:"Neter-Khertet", race:"Tomb Kings",
    difficulty:"High", style:"Synergy / Tomb Prince", since:"−8000", location:"Nehekhara desert",
    stadium:"Unknown", coach:"Unknown",
    blurb:"The oldest team on the circuit — some players were there for the very first game. The Khemri are tenacious, and they don’t like to die: it annoys them. A curse follows them, though no one yet knows whom it concerns.",
    special:[
      {name:"Immortality",text:"The Tomb Prince’s “Immortal” ability prevents him from being downed or injured by any effect — ignore any tackle, team upgrade or staff upgrade that would down him or remove him from play."},
      {name:"Pharaoh skill",text:"An exclusive skill: if a player with Pharaoh is committed to a matchup, every friendly player committed to that same matchup may use their Pharaoh-flagged abilities."}],
    stars:["Setekh","Ramtut III","Ithaca Benoin","Sinnedbad"] },
  { id:"underworld-creepers", league:"tcd", name:"Underworld Creepers", race:"Underworld",
    difficulty:"Very High", style:"Synergy / Warpstone", since:"2440", location:"Naggaroth",
    stadium:"Underworld Coliseum", coach:"Lance Fleshbarb",
    blurb:"An alliance of Goblins and Skaven that triggers an absolute health emergency. They can’t agree for more than ten minutes except to collect Warpstone — and they’ve won the prize for ‘team that killed the most of its own players’ 14 times in 20 years.",
    special:[{name:"Warpstone fragments",text:"Players enter a matchup with Warpstone fragments; the more players committed, the higher the matchup’s Warpstone total. Abilities marked with a Warpstone icon are only active while the matchup’s Warpstone total is equal to or greater than the icon’s number (or, with the open icon, any amount)."}],
    stars:["Split Tendoncutter","Garbage Throttlesnot","Grograt Crunchskull","Rasta Tailspike"] },
  { id:"bruendar-grimjacks", league:"tcd", name:"Bruendar Grimjacks", race:"Necromantic",
    difficulty:"Very High", style:"Synergy / Moon Phase", since:"Unknown", location:"Unknown",
    stadium:"The Graveyard", coach:"Unknown",
    blurb:"Creatures of the night under a Necromancer’s orders — they tend to howl at the moon if a match drags on, and often field around 180 (pieces of) players per game.",
    special:[{name:"Moon phases",text:"A two-sided Moon Phases card starts each week on the Morrslieb side. Morrslieb activates only dark-background Morrslieb abilities; Mannslieb activates only Mannslieb abilities. The mandatory ‘Moon Phase change’ skill is always resolved last and flips the card to the other side."}],
    stars:["Frank N. Stein","Helmut Wulf","Slarga Foulstrike","G’Ral Blödschuker"] },

  /* FFS — Foul Fiends Syndicate (Legendary) */
  { id:"midden-moors-marauders", league:"ffs", name:"The Midden Moors Marauders", race:"Slaanesh",
    difficulty:"Medium", style:"Seduce Tokens", since:"2468", location:"Middenheim",
    stadium:"Middenheim Arena", coach:"Uthar Hagg",
    blurb:"Worshippers of Slaanesh, Chaos God of excess, who wish either for the greatest popularity or the most ecstatic pleasure. Unable to pull themselves together into a truly cooperative team, they are as selfish as they are unpredictable.",
    special:[{name:"Seduce tokens",text:"A Slaanesh-themed mechanic that uses Seduce tokens to manipulate and disrupt opposing players at a matchup."}],
    stars:["Gobbler Grimlich","Dorjak Sureclaw","Bellow Thunderslam"] },
  { id:"drakwald-beasts", league:"ffs", name:"Drakwald Beasts", race:"Tzeentch",
    difficulty:"Very High", style:"Mutations", since:"Unknown", location:"Drakwald Forest",
    stadium:"Unknown", coach:"Unknown",
    blurb:"A team in constant mutation through their devotion to Tzeentch, the Lord of Change. During the game its players win or lose mutations that increase their playing technique.",
    special:[
      {name:"Mutations",text:"At setup, form an 11-card Mutation deck and set the 4 Blue Horror token-cards aside. When a player gains a Mutation, draw one at random, assign it and resolve its skill immediately; it stays in play until the Scoreboard phase but is inactive while the player is downed."},
      {name:"Pink & Blue Horrors",text:"When the Pink Horror would be downed, discard it and assign 2 Blue Horrors to the same matchup. An injured Blue Horror is removed from the game."}],
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
    special:[{name:"Chomp! tokens",text:"The team comes into play with 3 “Chomp!” tokens. When a Chomp! token is assigned to a matchup it cancels the next skill listed on it for the opposing Black Orc’s target — once an opponent with that skill symbol joins the matchup, he can’t use that skill and the token is discarded until end of the Scoreboard phase."}],
    stars:["Gorbag «Rabid» Foamface","Ugar Rancid","Grishnak Lancegobelin"] },
  { id:"evil-gitz", league:"naf", name:"Evil Gitz", race:"Goblins / Squigs",
    difficulty:"High", style:"Giant Squig / Ingest", since:"2450", location:"Unknown",
    stadium:"Unknown", coach:"Unknown",
    blurb:"What’s more dangerous than a hungry attacking squig? That’s what the goblin brains of the team said (and that’s the problem). Squig riders look great, but their mount tends to pummel its rider — and sometimes the ball.",
    special:[
      {name:"Giant Squig",text:"The Giant Squig is a 2-part player; you must hold both cards (parts 1 & 2) to commit him. When committed, draw a new player from your Team deck. If you hold only one part, you may discard it at the start of your turn to draw a replacement."},
      {name:"Ingest",text:"Some Squigs can ‘Ingest’ a player — place the ingested player beneath the Squig’s card. During the Scoreboard phase, add the standing Star Power of ingested players to the Squig. Ingested players return to their owner’s discard pile during Maintenance."}],
    stars:["—"] },
  { id:"bogenhafen-barons", league:"naf", name:"Bögenhafen Barons", race:"Humans",
    difficulty:"High", style:"Synergy / Banners", since:"2494", location:"Bögenhafen",
    stadium:"Bögenhafen Stadium", coach:"Tobias Rheinlich",
    blurb:"Founded only six years ago by lifelong fan Dietrich Lugendörf, yet already a powerhouse of the Nobility leagues — a huge stadium, a roster of the best players money can buy, and a feverishly devoted fanbase.",
    special:[{name:"Banner tokens",text:"During Maintenance, place the 3 Banner tokens. Assigned to a matchup, a Banner affects all friendly players there: Banner of Glory (gain 1 Fan in the Scoreboard phase), Banner of Prestige (players gain Stand Firm), Banner of Strength (+1 Star Power). A Banner can only be moved or discarded by Team Upgrade cards."}],
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
    note:c=> (c.has("sudden")||c.has("foul")) ? "Shuffle the new Highlight cards from your expansions into this deck first." : "" },

  { order:2, ph:0, src:"core", page:"Rulebook p.4",
    t:"Choose teams",
    d:c=>{
      const pools = ["the 6 base-game teams (OWA & CWC)"];
      if (c.has("sudden")) pools.push("the 3 Dark Sorcery Syndicate teams");
      if (c.has("foul"))   pools.push("the 3 Putrid Players’ Guild teams");
      if (c.has("legendary")) pools.push("the 21 Legendary-Edition teams across 7 unofficial leagues");
      return "Draw team tokens at random (one manager cups one token from each team), or simply agree who manages which team. Available pools: "+pools.join(", ")+". "+
             "Each manager takes that team’s scoreboard (set to “00”), its 12 Starting Player cards, its 5 Team Upgrade cards and its 3 team tokens. Return everything belonging to unmanaged teams to the box."; } },

  { order:3, ph:1, src:"core", page:"Rulebook p.4",
    t:"Shuffle Team decks & Team Upgrade decks",
    d:"Each manager shuffles their 12 Starting Player cards (no Star Players) facedown, leaving room for a discard pile, then shuffles their Team Upgrade cards facedown nearby.",
    note:c=> (c.has("sudden")||c.has("foul")) ? "Any base-game manager also shuffles in the one extra Team Upgrade card their expansion provides for their team. (If using both expansions, use only the Sudden Death version.)" : "" },

  { order:4, ph:0, src:"core", page:"Rulebook p.4",
    t:"Prepare the Star Player decks",
    d:c=>{
      const decks=["OWA","CWC"];
      if (c.has("sudden") && c.teamsFrom("sudden")) decks.push("DSS");
      if (c.has("foul")   && c.teamsFrom("foul"))   decks.push("PPG");
      return "Separate all Star Player cards (marked with ✪) by their card back and shuffle each subdivision deck separately, placing them facedown near the Highlight deck. Decks in play: "+decks.join(" · ")+". A manager may only draft Star Players from their own subdivision (neutral free agents are available to all)."; } },

  { order:5, ph:0, src:"core", page:"Rulebook p.5 · FAQ",
    t:"Prepare the Staff Upgrade deck",
    d:"Shuffle all Staff Upgrade cards and place them facedown near the Highlight deck.",
    note:c=> c.opt("noSalary")
      ? "No Salary Cap variant ON: shuffle in every Staff Upgrade card, including the expensive ones."
      : "Standard rules (FAQ errata): before shuffling, return these premium cards to the box — Hall of Famers, Fan Club Enrollment, We’ll Get ’Em Next Season, Staffing Office (×2) and Talent Scout (×2)." },

  { order:6, ph:0, src:"core", page:"Rulebook p.5 / p.16 · p.17",
    t:"Prepare the Spike! Magazine deck",
    d:c=>{
      if (c.p===2){
        if (c.has("sudden")) return "Two managers: shuffle together all Tournament cards from the Sudden Death expansion to form the deck — the game lasts 5 rounds. (Remove all Headlines.)";
        return "Two managers: remove all Headline cards. Set aside “The Blood Bowl”, shuffle the other three Tournament cards, then place “The Blood Bowl” on the bottom — a 2-manager game lasts 4 rounds.";
      }
      if (c.season==="abbrev") return "Abbreviated season (4 weeks): set aside “The Blood Bowl”. Draw 1 Tournament card and 2 Headline cards, shuffle them, place “The Blood Bowl” on the bottom.";
      if (c.season==="extended") return "Extended season (6 weeks): set aside “The Blood Bowl”. Draw 2 Tournament cards and 3 Headline cards, shuffle them, place “The Blood Bowl” on the bottom.";
      return "Standard season (5 weeks): set aside “The Blood Bowl”. Draw 2 of the 3 remaining Tournament cards and 2 of the Headline cards, shuffle the four together, then place “The Blood Bowl” facedown on the bottom. Place the deck at the opposite end from the Highlight deck.";
    },
    note:c=> (c.has("sudden")||c.has("foul")) && c.p>2
      ? "First swap in the expansion cards (see the two steps below) before drawing." : "" },

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
      if (c.has("foul")) s+=" Include the extra Foul Play cheating tokens (some carry the Penalty icon).";
      if (c.opt("enchanted")) s+=" (Enchanted Balls is on — the base ball tokens are returned to the box instead; see below.)";
      return s; } },

  { order:7.1, ph:0, src:"sudden", page:"Sudden Death p.2",
    when:c=>c.has("sudden"),
    t:"Form the Contract-token supply",
    d:"After preparing the cheating pool, gather all Contract tokens, place them facedown (hiding their fan values) to the side, and mix them into the contract-token supply pool." },

  { order:7.2, ph:0, src:"sudden", page:"Sudden Death p.1",
    when:c=>c.has("sudden") && c.teamPlayed("black-fangs"),
    t:"Set out Blood tokens",
    d:"The Black Fangs manager gathers all Blood tokens into a supply near their Team deck." },

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
      ? "Abbreviated season: now distribute starting improvements (see the note below) before play begins." : "" },

  { order:8.1, ph:2, src:"core", page:"Rulebook p.17",
    when:c=>c.season==="abbrev",
    t:"Distribute starting improvements (Abbreviated season)",
    d:"Each manager: draw 4 Star Players from their subdivision and draft 2; take 1 Team Upgrade; draw 3 Staff Upgrades and keep 1. Place these in the improvement pile, then reveal them as usual." },

  { order:8.2, ph:2, src:"sudden", page:"Sudden Death p.4",
    when:c=>c.opt("enchanted"),
    t:"Prepare for Enchanted Balls (optional)",
    d:"Return all base ball tokens to the box. Each Maintenance phase, during ‘Prepare for Kickoff’, the first manager mixes the Enchanted Ball tokens facedown and places one faceup on every Highlight and Tournament card — its effect (Star Power, Fans or a Skill) is visible to all." },

  { order:8.3, ph:2, src:"foul", page:"Foul Play p.3",
    when:c=>c.opt("corruptRef"),
    t:"Prepare the Corrupt Ref (optional)",
    d:"Each Maintenance phase, during ‘Prepare for Kickoff’, the first manager places the Corrupt Ref at midfield of any matchup. Committing a player there assigns that player a faceup cheating token, then the ref moves toward the Spike! Magazine deck a number of spaces equal to the player’s printed standing Star Power." }
];

/* Notes shown beneath the steps for the current configuration. */
BBTM.setupCallouts = [
  { when:c=>c.p===2, src:"core",
    t:"Two-manager game",
    d:"When rolling the Highlights, reveal four; after two highlights each have a committed player, return the other two to the box. There is no runner-up payout — the winner takes the trophy payout and the loser takes the LOSE! payout." },
  { when:c=>c.opt("scheduling"), src:"core",
    t:"Scheduling Limitations (optional)",
    d:"When rolling the Highlight reel, reveal only as many highlights as needed for the total number of matchups (highlights + any tournament) to equal the number of managers." },
  { when:c=>c.has("legendary"), src:"legendary",
    t:"Legendary-Edition teams",
    d:"Each Legendary team brings its own special mechanic (Veteran cards, Food tokens, Warpstone, Moon phases, Mutations, Chomp! tokens, Banners, Immortality, etc.). Set out that team’s unique tokens/cards as described on its rulebook page — see each team in the Teams & Leagues tab." },
  { when:c=>c.opt("noSalary"), src:"core",
    t:"No Salary Cap",
    d:"All premium Staff Upgrade cards stay in the deck, making powerful (expensive) staff available to draft all season." }
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
        "First manager ‘rolls the Highlights’ — draw Highlight cards equal to the number of managers and lay them in a line (the Highlight Reel).",
        "Prepare for Kickoff — place one ball on each Highlight (and the Tournament). The ball there counts as Midfield." ] },
      { h:"2 · Matchup Phase", items:[
        "Starting with the first manager and going clockwise, each turn: Commit one player to a matchup — or Pass.",
        "On commit: resolve ‘When Played’ abilities, then use the player’s skills left-to-right.",
        "You may then resolve one Matchup Action (exhaust a Team or Staff Upgrade).",
        "Passing is permanent for the phase — a passed manager commits no more players and resolves no more actions, but may discard unwanted players.",
        "The phase ends once every manager has passed." ] },
      { h:"3 · Scoreboard Phase", items:[
        "Resolve matchups in Reel order (closest to the Highlight deck first); resolve Tournaments last.",
        "Per matchup: reveal cheating tokens → resolve Scoreboard-phase abilities → determine the winner → collect payouts → clear the pitch.",
        "Reveal your improvement pile (read each card aloud), then pass the golden coin to the left." ] }
    ]
  },

  skills: {
    id:"sec-skills", title:"Skills",
    intro:"Skills are the icons between a player’s art and text box, used left-to-right when the player is committed. Cheating is mandatory; everything else is optional. A skill must be fully resolved before the next.",
    items:[
      { k:"Cheating", icon:"cheating", tag:"core", t:"Mandatory. For each icon, draw one random cheating token from the pool and place it facedown (skull-up) on the player. Tokens are revealed and resolved in the Scoreboard phase." },
      { k:"Passing", icon:"passing", tag:"core", t:"Optional. Take the ball if it’s at midfield; if an opponent is the ball carrier, move it to midfield; if a teammate holds it, you may take it. The carrier adds +2 Star Power to their team." },
      { k:"Sprinting", icon:"sprinting", tag:"core", t:"Optional. For each icon, draw the top card of your Team deck, then discard one card from your hand (it may be the one just drawn)." },
      { k:"Tackling", icon:"tackling", tag:"core", t:"Optional. For each icon, attempt one tackle against an opposing player at the matchup (see Tackle Outcomes). Multiple icons resolve separately." },
      { k:"Regeneration", icon:"regeneration", tag:"sudden", t:"Optional downed skill (Sudden Death). On a downed player, roll 2 dice and choose one; a Target-Down result lets you stand the player. Resolved in sequence with other downed skills." },
      { k:"Fouling", icon:"fouling", tag:"foul", t:"Optional (Foul Play). Choose an opposing manager at the matchup and randomly take one card from their hand; secretly look, then either return it or discard it (they then draw one). Needs an opponent at the matchup." }
    ],
    downed:"Downed skills (Sudden Death / Foul Play): icons printed next to a player’s downed Star Power resolve the instant that player is downed, interrupting the active turn. They use the downed Star Power and are resolved left-to-right; the player still loses all printed abilities."
  },

  tackle: {
    id:"sec-tackle", title:"Tackle Outcomes",
    intro:"Compare the tackler’s Star Power to the target’s, then roll the tackle dice:",
    dice:[
      { c:"Tackler SP > Target SP", d:"Roll 2 dice — tackler’s manager picks one result." },
      { c:"Tackler SP = Target SP", d:"Roll 1 die — apply that result." },
      { c:"Tackler SP < Target SP", d:"Roll 2 dice — the opposing manager picks one result." }
    ],
    results:[
      { k:"Target Down", t:"The tackle succeeds: a standing target becomes downed; a downed target becomes injured." },
      { k:"Target Missed", t:"The tackle fails, with no other effect." },
      { k:"Tackler Down", t:"The target evades: a standing tackler becomes downed; a downed tackler becomes injured. (Not a ‘successful tackle’.)" }
    ],
    states:[
      { k:"Standing", t:"Upright; uses standing Star Power (top-left of the card)." },
      { k:"Downed", t:"Rotate 90° clockwise; uses downed Star Power; drops the ball; loses all abilities and remaining skills but keeps already-assigned cheating tokens." },
      { k:"Injured", t:"Removed to the discard pile; drops the ball; discards its cheating tokens. Recovers when the discard pile next becomes the new deck." }
    ]
  },

  winner: {
    id:"sec-winner", title:"Determine the Winner & Payouts",
    intro:"Total each team’s Star Power at the matchup: standing players use standing SP, downed players use downed SP, cheating tokens add their SP, and the ball carrier’s team gets +2.",
    bullets:[
      "Highest total wins. On a tie, the team with the ball carrier wins.",
      "Highlight tie with the ball at midfield → a draw (no central payout).",
      "Tournament tie with no ball → the first manager decides which tied team is higher (FAQ).",
      "Highlight: each manager collects their team-zone payout; the winner also takes the central payout.",
      "Tournament: winner takes the trophy payout, runner-up the ribbon payout, everyone else with a player there takes the LOSE! payout. (At tournaments both winner and runner-up count as ‘winners’.)",
      "Alone at a matchup → you collect every payout shown on the card.",
      "Fans are gained immediately; cards go facedown into your improvement pile."
    ],
    icons:[
      { k:"Fan", icon:"fan", t:"Gain one fan per icon (turn the scoreboard dials)." },
      { k:"Star Player", icon:"star-player", t:"Draw one from your subdivision per icon, draft one, return the rest to the bottom of the deck." },
      { k:"Team Upgrade", icon:"team-upgrade", t:"Draw one per icon, keep one, return the rest to the bottom." },
      { k:"Staff Upgrade", icon:"staff-upgrade", t:"Draw one per icon, keep one, return the rest to the bottom." },
      { k:"Either / Or", t:"A central payout split by a slash — the winner chooses one of the listed rewards." },
      { k:"Contract", icon:"contract", tag:"sudden", t:"(Sudden Death) Draw a facedown Contract token per icon; reveal and score its fans only at the end of the game." }
    ]
  },

  mechanics: {
    id:"sec-mech", title:"Expansion Mechanics",
    items:[
      { src:"sudden", h:"Contracts", t:"Earn facedown Contract tokens from Cabalvision Contract icons on Highlights/Tournaments. They stay hidden until after all ‘End of Game’ abilities, then are revealed and scored as fans. If the supply is empty, gain 1 fan instead. Contracts don’t count as improvements." },
      { src:"sudden", h:"Either/Or skills", t:"Skill icons split by slashes form skill sets. When you commit such a player you must choose one set to use (you may use every icon on that side); the other sets are ignored while the card is in play." },
      { src:"sudden", h:"Blood tokens", t:"Bloodlust (Black Fangs) gains Blood tokens; each adds +1 to standing and downed Star Power until ‘Clear the Pitch’. Limited to the supply." },
      { src:"sudden", h:"Enchanted Balls (optional)", t:"Replace the base balls. Each is placed faceup and benefits its carrier with bonus Star Power, fans, or a skill icon used the moment the player takes the ball." },
      { src:"foul", h:"Penalties", t:"Penalty icons appear on some cheating tokens and the Goblin Tribal Leeg. Each penalty makes you draw a facedown Penalty card; after ‘Reveal Improvement Pile’, flip and resolve them. They linger faceup until you’re told to discard them." },
      { src:"foul", h:"Disease tokens", t:"Spread Disease drops tokens at midfield; any player committed/moved there takes them. Each lowers standing and downed Star Power by 1 (min 0) until ‘Clear the Pitch’." },
      { src:"foul", h:"The Corrupt Ref (optional)", t:"Placed at a matchup each Kickoff; committing a player there gives them a faceup cheating token, then the ref moves toward the Spike! deck by the player’s printed standing SP. At Scoreboard, a team with no faceup token there receives a penalty." },
      { src:"foul", h:"Stadiums", t:"Stadium cards add a fifth player and venue effects that apply to the matchup they’re attached to." }
    ]
  },

  abilities: {
    id:"sec-abil", title:"Named Abilities",
    intro:"The keyword abilities printed on Player cards (base game).",
    items:[
      ["Dauntless","When attacking a higher-SP player, roll only one die and apply the result."],
      ["Dirty Player","If this player injures an opponent, gain a fan."],
      ["Dodge","During a tackle against this player, you may force the opponent to reroll all dice."],
      ["Dump-off","If this player would take or drop the ball, you may move it to a friendly player at this matchup."],
      ["Fend","If an opponent successfully tackles this player, you may stand one of your other downed players here."],
      ["Freebooter","When revealed from the improvement pile, you may return one of your players to the box, then add this Star Player and reshuffle your Team deck. (Resolves only that turn.)"],
      ["Frenzy","When this player attempts a tackle, increase his Star Power by 1 during the attempt."],
      ["Guard","When an opponent tackles one of your players, you may apply the dice result to this player instead (after the roll, before applying)."],
      ["Juggernaut","When this player attempts a tackle, opponents cannot use Guard."],
      ["Nerves of Steel","While this player is the ball carrier, his Star Power is +1."],
      ["Piling On","Each Target-Down you roll on this player’s tackle lets him attempt another tackle against a different opponent."],
      ["Stand Firm","While this player is the ball carrier, opponents cannot tackle him."],
      ["Strip Ball","Instead of taking the ball with Passing, you may place it at midfield."],
      ["Sure Hands","If this ball carrier becomes downed, he does not drop the ball (but loses the ability while downed)."],
      ["Throw Team-mate","When played, move one of your players from this matchup to another (give the ball to a player here if needed)."]
    ]
  },

  winning: {
    id:"sec-win", title:"Winning the Season",
    intro:"The season culminates in The Blood Bowl tournament and ends after the final round. After ‘End of Game’ abilities (and revealing Contract tokens, if any), the manager with the most fans wins the “Manager of the Year” award.",
    ties:[
      "Tie on fans → the most-developed team wins (most Star Players + team + staff upgrades gained all season).",
      "Still tied → the TMU suspends the tied managers (they lose all fans) and awards the prize to the next manager with the most fans.",
      "Everyone tied → the fans revolt and nobody wins."
    ]
  },

  faq: {
    id:"sec-faq", title:"Handy Rulings (FAQ)",
    items:[
      { q:"What counts as my ‘roster’?", a:"Every Player card belonging to your team — at matchups, in your Team deck, discard pile and hand. Cards in the improvement pile aren’t part of the roster until added during ‘Reveal Improvement Pile’." },
      { q:"Do I have to commit my whole hand each round?", a:"No. You may pass early, discard players you don’t want, and replenish back up to six next Maintenance." },
      { q:"Only three team tokens — am I limited to three Star Players?", a:"No. Tokens just mark Star Players whose icon differs from your team’s. There’s no limit to how many Star Players you can draft." },
      { q:"Which Star Players can I draft?", a:"Any from your own subdivision (e.g. the Athelorn Avengers can draft Wood Elf, Dwarf and Human stars), plus neutral free agents. You can never draft from another subdivision." },
      { q:"Does a downed ball carrier with Sure Hands keep the ball?", a:"He keeps it on the way down, but Sure Hands (like all abilities) is lost while he’s downed." },
      { q:"Collecting a payout I can’t fulfil?", a:"If no components of that type are available, you earn nothing for that payout." }
    ]
  }
};
