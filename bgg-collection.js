let allGames = []; // Store all games globally

async function fetchBGGCollection(username = "traditz") {
    const url = `https://boardgamegeek.com/xmlapi2/collection?username=${username}&own=1&stats=1&excludesubtype=boardgameexpansion`;

    try {
        let response = await fetch(url);
        let text = await response.text();
        let parser = new DOMParser();
        let xml = parser.parseFromString(text, "text/xml");

        let games = xml.querySelectorAll("item");
        allGames = []; // Reset the global array

        games.forEach(game => {
            let name = game.querySelector("name").textContent.toLowerCase();
            let year = game.querySelector("yearpublished")?.textContent || "Unknown";
            let image = game.querySelector("image")?.textContent || "";
            let minPlayers = game.querySelector("stats")?.getAttribute("minplayers") || "N/A";
            let maxPlayers = game.querySelector("stats")?.getAttribute("maxplayers") || "N/A";

            allGames.push({ name, year, image, minPlayers, maxPlayers });
        });

        displayGames(allGames);
    } catch (error) {
        console.error("Error fetching collection:", error);
    }
}

function displayGames(gameList) {
    let container = document.getElementById("game-container");

    if (gameList.length === 0) {
        container.innerHTML = "<p>No games found.</p>";
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

// Search Function
function searchGames() {
    let searchQuery = document.getElementById("search-input").value.toLowerCase();
    let maxPlayersFilter = document.getElementById("max-players").value;

    let filteredGames = allGames.filter(game => 
        game.name.includes(searchQuery) &&
        (maxPlayersFilter === "" || parseInt(game.maxPlayers) >= parseInt(maxPlayersFilter))
    );

    displayGames(filteredGames);
}

// Fetch and display the collection for traditz on page load
fetchBGGCollection();
