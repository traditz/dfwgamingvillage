// Ad-hoc verification of the BGG parsing logic against LIVE data. Mirrors the
// regexes in cloudflare/bgg-proxy/src/worker.js so you can re-validate (and fix)
// the Top-100 scraper when BGG changes its browse-page markup.
// Not part of the site; safe to delete. Run: node scripts/bgg-parse-check.mjs
// Note: BGG blocks some datacenter IPs (401/403) — run from a normal network.
const BROWSER_UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36";
function decodeEntities(s){return s.replace(/&amp;/g,"&").replace(/&lt;/g,"<").replace(/&gt;/g,">").replace(/&quot;/g,'"').replace(/&#39;/g,"'").replace(/&#(\d+);/g,(_,c)=>String.fromCodePoint(parseInt(c,10)));}

async function checkTop(){
  console.log("\n=== TOP-100 SCRAPE (browse page 1) ===");
  const res = await fetch("https://boardgamegeek.com/browse/boardgame/page/1",{headers:{"User-Agent":BROWSER_UA,"Accept":"text/html,application/xhtml+xml"}});
  console.log("status", res.status);
  const html = await res.text();
  const rows = html.match(/<tr[^>]*id=['"]row_['"][\s\S]*?<\/tr>/g) || [];
  console.log("rows matched:", rows.length);
  const games=[];
  for(const row of rows){
    const linkMatch = row.match(/\/boardgame\/(\d+)\/[^"]*"\s+class=['"]primary['"]\s*>([^<]+)<\/a>/);
    if(!linkMatch) continue;
    const rankMatch = row.match(/<a name="(\d+)"><\/a>/);
    const yearMatch = row.match(/<span[^>]*class=['"]smallerfont dull['"][^>]*>\(([^)]+)\)<\/span>/);
    const imgMatch = row.match(/<img[^>]+\ssrc="([^"]+)"/);
    const ratingCells = [...row.matchAll(/<td[^>]*class=['"]collection_bggrating['"][^>]*>\s*([\d.]+|N\/A)/g)];
    games.push({rank:rankMatch?parseInt(rankMatch[1],10):games.length+1,id:linkMatch[1],name:decodeEntities(linkMatch[2]).trim(),year:yearMatch?yearMatch[1]:"N/A",geek:ratingCells[0]?ratingCells[0][1]:"N/A",avg:ratingCells[1]?ratingCells[1][1]:"N/A",img:(imgMatch?imgMatch[1]:"").slice(0,60)});
  }
  console.log("games parsed:", games.length);
  console.table(games.slice(0,8));
}

async function checkPlays(){
  console.log("\n=== PLAYS (traditz page 1) ===");
  const res = await fetch("https://boardgamegeek.com/xmlapi2/plays?username=traditz&page=1",{headers:{"User-Agent":BROWSER_UA}});
  console.log("status", res.status);
  const xml = await res.text();
  const total = (xml.match(/<plays[^>]*\btotal="(\d+)"/)||[])[1];
  console.log("total plays attr:", total);
  const plays = xml.match(/<play\b[^>]*>[\s\S]*?<\/play>/g)||[];
  console.log("play blocks on page 1:", plays.length);
  const agg={};
  for(const p of plays){
    const q=parseInt((p.match(/\bquantity="(\d+)"/)||[])[1]||"1",10);
    const item=p.match(/<item\b[^>]*\bobjectid="(\d+)"[^>]*>/); if(!item) continue;
    const name=(p.match(/<item\b[^>]*\bname="([^"]*)"/)||[])[1]||"";
    const cm=p.match(/<comments>([\s\S]*?)<\/comments>/);
    if(!agg[item[1]]) agg[item[1]]={name:decodeEntities(name),plays:0,comments:0};
    agg[item[1]].plays+=q; if(cm&&cm[1].trim()) agg[item[1]].comments++;
  }
  console.log("distinct games on page 1:", Object.keys(agg).length);
  console.table(Object.values(agg).slice(0,8));
}

async function checkThing(){
  console.log("\n=== THING (Wingspan #266192 expansions) ===");
  const res = await fetch("https://boardgamegeek.com/xmlapi2/thing?id=266192&stats=1",{headers:{"User-Agent":BROWSER_UA}});
  console.log("status", res.status);
  const xml = await res.text();
  const links=[...xml.matchAll(/<link type="boardgameexpansion" id="(\d+)" value="([^"]+)"/g)];
  console.log("expansion links:", links.length);
  links.slice(0,6).forEach(l=>console.log("  ", l[1], decodeEntities(l[2])));
}

await checkTop();
await checkPlays();
await checkThing();
