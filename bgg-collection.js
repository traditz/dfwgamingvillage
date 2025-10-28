document.addEventListener('DOMContentLoaded', function() {
    let allGames = [];
    let collectionLoaded = false;
    const BGG_USERNAME = 'traditz';

    /**
     * Fetches the user's collection from BGG. This is now a single, fast API call.
     */
    async function fetchBGGCollection() {
        const container = document.getElementById("game-container");
        container.innerHTML = "<p>Loading game library from BGG...</p>";

        // === ADDED FOR TOKEN AUTH ===
        const BGG_TOKEN = "ee6de5d1-dc6b-4648-b71f-32c62f18fa95";
        const fetchOptions = {
         headers: {
           'Authorization': `Bearer ${BGG_TOKEN}`
         }
        };
        // ============================

        try {
            const url = `https://boardgamegeek.com/xmlapi2/collection?username=${BGG_USERNAME}&own=1&stats=1&excludesubtype=boardgameexpansion`;
            
            // Pass the fetchOptions to the fetch call
            let response = await fetch(url, fetchOptions);
            
            // Handle BGG's "please wait" 202 status
            while (response.status === 202) {
                container.innerHTML = "<p>BoardGameGeek is preparing your collection. Please wait...</p>";
                await new Promise(resolve => setTimeout(resolve, 5000));
                
                // Pass the fetchOptions to this fetch call as well
                response = await fetch(url, fetchOptions);
            }

            if (!response.ok) {
                // Handle specific auth errors
                if (response.status === 401) {
                    throw new Error("BGG API responded with 401 (Unauthorized). Please check your API token.");
                }
                throw new Error(`BGG API responded with status: ${response.status}`);
            }

            const text = await response.text();
            const parser = new DOMParser();
            const xml = parser.parseFromString(text, "text/xml");
            const items = xml.querySelectorAll("item");
            const gamesList = [];

            items.forEach(item => {
                const stats = item.querySelector("stats");
                gamesList.push({
                    id: item.getAttribute("objectid"),
                    name: item.querySelector("name")?.textContent || "Unknown Name",
                    year: item.querySelector("yearpublished")?.textContent || "N/A",
                    image: item.querySelector("image")?.textContent || "",
                    minPlayers: parseInt(stats?.getAttribute("minplayers") || "1"),
                    maxPlayers: parseInt(stats?.getAttribute("maxplayers") || "1"),
                    playTime: stats?.getAttribute("playingtime") || "N/A",
                    bggLink: `https://boardgamegeek.com/boardgame/${item.getAttribute("objectid")}`
                });
            });

            allGames = gamesList.sort((a, b) => a.name.localeCompare(b.name));
            collectionLoaded = true;
            displayGames(allGames);

        } catch (error) {
            console.error("Error fetching BGG collection:", error);
            container.innerHTML = `<p style='color:red;'>Failed to load game library. Please try again later. The console may have more details.</p><p style='color:#ccc; font-size: small'>Error: ${error.message}</p>`;
        }
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
     * Filters the collection based on name and player count.
     */
    window.searchGames = function() {
        if (!collectionLoaded) return;

        const searchQuery = document.getElementById("search-input").value.toLowerCase();
        const playerCount = parseInt(document.getElementById("player-count").value);

        const filteredGames = allGames.filter(game => {
            const nameMatch = game.name.toLowerCase().includes(searchQuery);
            const playerMatch = isNaN(playerCount) || (playerCount >= game.minPlayers && playerCount <= game.maxPlayers);
            
            return nameMatch && playerMatch;
        });

        displayGames(filteredG<ctrl61>ames);
    }

    // Initial call to start the process.
    fetchBGGCollection();
});
