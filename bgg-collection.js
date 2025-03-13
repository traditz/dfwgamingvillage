let allGames = []; // Store all games globally
let allMechanisms = new Set(); // Store unique mechanisms

async function fetchBGGCollection(username = "traditz") {
    const url = `https://boardgamegeek.com/xmlapi2/collection?username=${username}&own=1&stats=1&excludesubtype=boardgameexpansion`;

    try {
        let response = await fetch(url);
        let text = await response.text();
        let parser = new DOMParser();
        let xml = parser.parseFromString(text, "text/xml");

        let games = xml.querySelectorAll("item");
        allGames = [];
        let gameIds = [];

        games.forEach(game => {
            let id = game.getAttribute("objectid");
            let name = game.querySelector("name").textContent;
            let year = game.querySelector("yearpublished")?.textContent || "Unknown";
            let image = game.querySelector("image")?.textContent || "";
            let minPlayers = game.querySelector("stats")?.getAttribute("minplayers") || "N/A";
            let maxPlayers = game.querySelector("stats")?.getAttribute("maxplayers") || "N/A";
            let bggLink = `https://boardgamegeek.com/boardgame/${id}`;

            allGames.push({ id, name, year, image, minPlayers, maxPlayers, bggLink, mechanisms: [] });
            gameIds.push(id);
        });

        if (gameIds.length > 0) {
            await fetchGameMechanisms(gameIds); // Fetch mechanisms for all games at once
        } else {
            displayGames(allGames);
        }

    } catch (error) {
        console.error("Error fetching collection:", error);
    }
}

async function fetchGameMechanisms(gameIds) {
    const batchSize = 50; // Maximize API efficiency by batching requests
    let batches = [];

    for (let i = 0; i < gameIds.length; i += batchSize) {
        batches.push(gameIds.slice(i, i + batchSize).join(",")); // Create batched requests
    }

    try {
        await Promise.all(batches.map(async (batch) => {
            const url = `https://boardgamegeek.com/xmlapi2/thing?id=${batch}&stats=1`;
            let response = await fetch(url);
            let text = await response.text();
            let parser = new DOMParser();
            let xml = parser.parseFromString(text, "text/xml");

            let games = xml.querySelectorAll("item");

            games.forEach(game => {
                let id = game.getAttribute("id");
                let mechanisms = [...game.querySelectorAll("link[type='boardgamemechanic']")]
                    .map(mech => mech.getAttribute("value"));

                let gameEntry = allGames.find(g => g.id === id);
                if (gameEntry) {
                    gameEntry.mechanisms = mechanisms;
                    mechanisms.forEach(mech => allMechanisms.add(mech)); // Store unique mechanisms
                }
            });
        }));

        populateMechanismFilter(); // Populate mechanism dropdown after fetching data
        displayGames(allGames);
    } catch (error) {
        console.error("Error fetching game mechanisms:", error);
    }
}

function populateMechanismFilter() {
    let filter = document.getElementById("mechanism-filter");
    filter.innerHTML = `<option value="">All Mechanisms</option>`; // Default option

    Array.from(allMechanisms).sort().forEach(mech => {
        let option = document.createElement("option");
        option.value = mech;
        option.textContent = mech;
        filter.appendChild(option);
    });
}

function displayGames(gameList) {
    let container = document.getElementById("game-container");

    if (gameList.length === 0) {
        container.innerHTML = "<p>No games found.</p>";
        return;
    }

    container.innerHTML = gameList.map(game => `
        <div class="game-card">
            <a href="${game.bggLink}" target="_blank">
                <img src="${game.image}" alt="${game.name}" />
                <h3>${game.name} (${game.year})</h3>
            </a>
            <p>Players: ${game.minPlayers} - ${game.maxPlayers}</p>
            <p><strong>Mechanisms:</strong> ${game.mechanisms.length > 0 ? game.mechanisms.join(", ") : "N/A"}</p>
        </div>
    `).join("");
}

// Search & Filter Function
function searchGames() {
    let searchQuery = document.getElementById("search-input").value.toLowerCase();
    let maxPlayersFilter = document.getElementById("max-players").value;
    let mechanismFilter = document.getElementById("mechanism-filter").value;

    let filteredGames = allGames.filter(game => 
        game.name.toLowerCase().includes(searchQuery) &&
        (maxPlayersFilter === "" || parseInt(game.maxPlayers) >= parseInt(maxPlayersFilter)) &&
        (mechanismFilter === "" || game.mechanisms.includes(mechanismFilter))
    );

    displayGames(filteredGames);
}

// Fetch and display the collection for traditz on page load
fetchBGGCollection();
