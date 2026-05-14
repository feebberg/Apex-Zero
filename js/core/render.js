APEX.render = {
    games(list) {
        const grid = $("gamesGrid");
        if (!grid) return;

        const sortMode = $("sortSelect")?.value || "az";
        const sorted = APEX.search.sort(list, sortMode);

        grid.innerHTML = "";

        sorted.forEach(game => {
            const card = document.createElement("div");
            card.className = "game-card";

            card.innerHTML = `
                <img class="game-thumb" src="${game.thumbnail}" onerror="this.src='assets/fallback.png'">
                <div class="game-title">${game.name}</div>
            `;

            card.onclick = () => APEX.launch.open(game);
            grid.appendChild(card);
        });
    },

    recent() {
        const grid = $("recentGrid");
        if (!grid) return;

        const recent = APEX.storage.load(APEX.storage.keys.recent, []);
        grid.innerHTML = "";

        recent.forEach(game => {
            const card = document.createElement("div");
            card.className = "game-card";

            card.innerHTML = `
                <img class="game-thumb" src="${game.thumbnail}" onerror="this.src='assets/fallback.png'">
                <div class="game-title">${game.name}</div>
            `;

            card.onclick = () => APEX.launch.open(game);
            grid.appendChild(card);
        });
    }
};
