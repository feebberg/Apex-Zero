export const APEX_RENDER = {
    init(games) {
        const grid = document.getElementById("game-grid");
        grid.innerHTML = "";

        games.forEach(game => {
            const card = document.createElement("div");
            card.className = "game-card";

            card.innerHTML = `
                <img src="${game.thumbnail}">
                <div class="title">${game.name}</div>
            `;

            card.onclick = () => window.APEX.launch.open(game);

            grid.appendChild(card);
        });
    }
};

