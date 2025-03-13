async function fetchBGGCollection(username = "traditz") {
    const url = `https://boardgamegeek.com/xmlapi2/collection?username=${username}&own=1&stats=1&excludesubtype=boardgameexpansion`;

    try {
        let response = await fetch(url);
        let text = await response.text();
        let parser = new DOMParser();
        let xml = parser.parseFromString(text, "text/xml");

        let games = xml.querySelectorAll("item");
        let gameList = [];

        games.forEach(game => {
            let subtype = game.getAttribute("subtype");
            if (subtype === "boardgameexpansion") return; // Skip expansions

            let name = game.querySelector("name").textContent;
            let year = game.querySelector("yearpublished")?.textContent || "Unknown";
            let image = game.querySelector("image")?.textContent || "";
            let minPlayers = game.querySelector("stats")?.getAttribute("minplayers") || "N/A";
            let maxPlayers = game.querySelector("stats")?.getAttribute("maxplayers") || "N/A";

            gameList.push({ name, year, image, minPlayers, maxPlayers });
        });

        displayGames(gameList);
    } catch (error) {
        console.error("Error fetching collection:", error);
    }
}

function displayGames(gameList) {
    let container = document.getElementById("game-container");

    if (gameList.length === 0) {
        container.innerHTML = "<p>No games found or BGG API is taking too long. Try again later.</p>";
        return;
    }

    container.innerHTML = gameList.map(game => `
        <div class="game-card">
            <img src="${game.image}" alt="${game.name}" />
            <h3>${game.name} (${game.year})</h3>
            <p>Players: ${game.minPlayers} - ${game.maxPlayers}</p>
        </div>
    `).join("");
}

// Fetch and display the collection for traditz
fetchBGGCollection();
