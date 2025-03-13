async function fetchBGGCollection(username) {
    const url = `https://boardgamegeek.com/xmlapi2/collection?username=traditz&own=1&stats=1`;

    try {
        let response = await fetch(url);
        let text = await response.text();
        let parser = new DOMParser();
        let xml = parser.parseFromString(text, "text/xml");

        let games = xml.querySelectorAll("item");
        let gameList = [];

        games.forEach(game => {
            let name = game.querySelector("name").textContent;
            let year = game.querySelector("yearpublished")?.textContent || "Unknown";
            let image = game.querySelector("image")?.textContent || "";
            let rating = game.querySelector("stats rating")?.getAttribute("value") || "N/A";

            gameList.push({ name, year, image, rating });
        });

        displayGames(gameList);
    } catch (error) {
        console.error("Error fetching collection:", error);
    }
}

function displayGames(gameList) {
    let container = document.getElementById("game-container");
    container.innerHTML = gameList.map(game => `
        <div class="game-card">
            <img src="${game.image}" alt="${game.name}" />
            <h3>${game.name} (${game.year})</h3>
            <p>Rating: ${game.rating}</p>
        </div>
    `).join("");
}

// Change 'YOUR_USERNAME' to your BGG username
fetchBGGCollection("Traditz");
