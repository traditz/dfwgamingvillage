document.addEventListener('DOMContentLoaded', function() {
    let allGames = [];
    let collectionLoaded = false;
    const BGG_USERNAME = 'traditz'; // Your BGG username

    /**
     * Fetches detailed game data using a list of game IDs.
     * This is the second step, which gets mechanics and other details.
     */
    async function fetchGameDetails(gameIds) {
        if (gameIds.length === 0) return [];
        
        const ids = gameIds.join(',');
        const url = `https://boardgamegeek.com/xmlapi2/thing?id=${ids}&stats=1`;
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`BGG Thing API responded with status: ${response.status}`);
        }
        
        const text = await response.text();
        const parser = new DOMParser();
        const xml = parser.parseFromString(text, "text/xml");
        const items = xml.querySelectorAll("item");
        const gameDetails = [];

        items.forEach(item => {
            const stats = item.querySelector("stats");
            const mechanics = Array.from(item.querySelectorAll('link[type="boardgamemechanic"]'))
                                   .map(link => link.getAttribute('value'));

            gameDetails.push({
                id: item.getAttribute("id"),
                name: item.querySelector("name")?.getAttribute("value") || "Unknown Name",
                year: item.querySelector("yearpublished")?.getAttribute("value") || "N/A",
                image: item.querySelector("image")?.textContent || "",
                minPlayers: parseInt(stats?.getAttribute("minplayers") || "1"),
                maxPlayers: parseInt(stats?.getAttribute("maxplayers") || "1"),
                playTime: stats?.getAttribute("playingtime") || "N/A",
                bggLink: `https://boardgamegeek.com/boardgame/${item.getAttribute("id")}`,
                mechanics: mechanics
            });
        });

        return gameDetails;
    }

    /**
     * Fetches the user's collection to get the list of game IDs.
     * This is the first step.
     */
    async function fetchBGGCollection() {
        const container = document.getElementById("game-container");
        container.innerHTML = "<p>Loading game library from BGG...</p>";

        try {
            const collectionUrl = `https://boardgamegeek.com/xmlapi2/collection?username=${BGG_USERNAME}&own=1&excludesubtype=boardgameexpansion`;
            let response = await fetch(collectionUrl);
            
            while (response.status === 202) {
                container.innerHTML = "<p>BoardGameGeek is preparing your collection. Please wait...</p>";
                await new Promise(resolve => setTimeout(resolve, 5000));
                response = await fetch(collectionUrl);
            }

            if (!response.ok) {
                throw new Error(`BGG Collection API responded with status: ${response.status}`);
            }

            const text = await response.text();
            const parser = new DOMParser();
            const xml = parser.parseFromString(text, "text/xml");
            const gameIds = Array.from(xml.querySelectorAll("item")).map(item => item.getAttribute("objectid"));

            // --- KEY CHANGE: Now fetch detailed data for the collected IDs ---
            if (gameIds.length > 0) {
                container.innerHTML = "<p>Fetching game details and mechanics...</p>";
                const detailedGames = await fetchGameDetails(gameIds);
                allGames = detailedGames.sort((a, b) => a.name.localeCompare(b.name));
                populateMechanicsFilter();
            }

            collectionLoaded = true;
            displayGames(allGames);

        } catch (error) {
            console.error("Error fetching BGG collection:", error);
            container.innerHTML = "<p style='color:red;'>Failed to load game library. Please try again later.</p>";
        }
    }

    /**
     * Populates the mechanics filter dropdown with unique, sorted mechanics.
     */
    function populateMechanicsFilter() {
        const mechanics = new Set();
        allGames.forEach(game => {
            game.mechanics.forEach(mech => mechanics.add(mech));
        });

        const filterDropdown = document.getElementById('mechanics-filter');
        const sortedMechanics = Array.from(mechanics).sort();
        
        sortedMechanics.forEach(mech => {
            const option = document.createElement('option');
            option.value = mech;
            option.textContent = mech;
            filterDropdown.appendChild(option);
        });
    }
    
    /**
     * Renders a list of games into the container.
     */
    function displayGames(gameList) {
        const container = document.getElementById("game-container");

        if (gameList.length === 0 && collectionLoaded) {
            container.innerHTML = "<p>No games found matching your criteria.</p>";
            return;
        }

        container.innerHTML = gameList.map(game => `
            <div class="game-card">
                <a href="${game.bggLink}" target="_blank">
                    <img src="${game.image}" alt="Box art for ${game.name}" loading="lazy" />
                    <h3>${game.name} (${game.year})</h3>
                </a>
                <div>
                    <p>Players: ${game.minPlayers} - ${game.maxPlayers}</p>
                    <p>Playtime: ${game.playTime} min</p>
                </div>
            </div>
        `).join("");
    }

    /**
     * Filters the collection based on all user inputs.
     */
    window.searchGames = function() {
        if (!collectionLoaded) return;

        const searchQuery = document.getElementById("search-input").value.toLowerCase();
        const playerCount = parseInt(document.getElementById("player-count").value);
        const selectedMechanic = document.getElementById("mechanics-filter").value;

        const filteredGames = allGames.filter(game => {
            const nameMatch = game.name.toLowerCase().includes(searchQuery);
            const playerMatch = isNaN(playerCount) || (playerCount >= game.minPlayers && playerCount <= game.maxPlayers);
            const mechanicMatch = !selectedMechanic || game.mechanics.includes(selectedMechanic);
            
            return nameMatch && playerMatch && mechanicMatch;
        });

        displayGames(filteredGames);
    }

    // Initial call to start the process.
    fetchBGGCollection();
});
