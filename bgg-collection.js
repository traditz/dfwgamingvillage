document.addEventListener('DOMContentLoaded', function() {
    // --- Configuration ---
    const BGG_USERNAME = 'traditz'; // Your BGG username
    const API_URL = `https://boardgamegeek.com/xmlapi2/collection?username=${BGG_USERNAME}&stats=1`;

    // --- State Variables ---
    let allGames = []; // This will hold the master list of all games from your collection.
    let collectionLoaded = false; // A flag to track if the initial data fetch is complete.

    /**
     * Main function to fetch the entire game collection from the BGG API.
     * It handles the "202 Accepted" response by waiting and retrying.
     */
    async function fetchBGGCollection() {
        const container = document.getElementById('game-container');
        try {
            let response = await fetch(API_URL);

            // BGG API sends status 202 if the collection is being prepared. We need to wait and retry.
            while (response.status === 202) {
                container.innerHTML = 'BoardGameGeek is preparing your collection data. Please wait...';
                await new Promise(resolve => setTimeout(resolve, 5000)); // Wait 5 seconds
                response = await fetch(API_URL);
            }

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            // Parse the XML response from BGG
            const xmlText = await response.text();
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(xmlText, "text/xml");
            const items = xmlDoc.getElementsByTagName('item');
            
            const gamesData = [];
            for (let item of items) {
                const name = item.getElementsByTagName('name')[0]?.textContent || 'N/A';
                const image = item.getElementsByTagName('image')[0]?.textContent || 'placeholder.jpg';
                const stats = item.getElementsByTagName('stats')[0];
                const minplayers = stats?.getAttribute('minplayers');
                const maxplayers = stats?.getAttribute('maxplayers');
                const bggid = item.getAttribute('objectid');

                // Ensure we have valid data before adding the game to our list
                const minP = parseInt(minplayers);
                const maxP = parseInt(maxplayers);
                if (!isNaN(minP) && !isNaN(maxP)) {
                   gamesData.push({ name, image, minplayers: minP, maxplayers: maxP, bggid });
                }
            }

            // Store the final, sorted list of games
            allGames = gamesData.sort((a, b) => a.name.localeCompare(b.name));
            collectionLoaded = true; // Set the flag indicating data is ready!

            // --- KEY FIX #1 ---
            // Now that the data is loaded, trigger the initial display of all games.
            searchGames();

        } catch (error) {
            console.error('Error fetching BGG collection:', error);
            container.innerHTML = '<p style="color: red;">Failed to load game library. Please check the BGG username or try again later.</p>';
        }
    }

    /**
     * Renders a list of games to the page.
     * @param {Array} gamesToDisplay - The array of game objects to display.
     */
    function displayGames(gamesToDisplay) {
        const container = document.getElementById('game-container');

        // If the filtered list is empty after the collection has loaded, show the "no games found" message.
        if (gamesToDisplay.length === 0 && collectionLoaded) {
            container.innerHTML = '<p>No games found matching your criteria.</p>';
            return;
        }

        // Build the HTML for each game card and render it.
        container.innerHTML = gamesToDisplay.map(game => `
            <div class="game-card">
                <a href="https://boardgamegeek.com/boardgame/${game.bggid}" target="_blank" title="View ${game.name} on BoardGameGeek">
                    <img src="${game.image}" alt="${game.name}" loading="lazy">
                    <p>${game.name}</p>
                </a>
            </div>
        `).join('');
    }

    /**
     * Filters the master game list based on user input and calls displayGames.
     * This function is attached to the window object to be accessible from the HTML `oninput` attribute.
     */
    window.searchGames = function() {
        // --- KEY FIX #2 ---
        // This is a "guard clause". If the collection data hasn't been fetched yet,
        // do nothing. This prevents errors if the user types before the initial load is complete.
        if (!collectionLoaded) {
            return;
        }

        // Get current values from the input fields
        const searchTerm = document.getElementById('search-input').value.toLowerCase();
        const playerCount = parseInt(document.getElementById('max-players').value);

        // Filter the master list of games
        const filteredGames = allGames.filter(game => {
            // Match by name
            const nameMatch = game.name.toLowerCase().includes(searchTerm);

            // Match by player count (true if no count is entered or if it fits the game's range)
            const playerMatch = isNaN(playerCount) || (game.minplayers <= playerCount && game.maxplayers >= playerCount);

            return nameMatch && playerMatch;
        });

        // Display the result of the filtering
        displayGames(filteredGames);
    };

    // --- Start the process when the page loads ---
    fetchBGGCollection();
});
