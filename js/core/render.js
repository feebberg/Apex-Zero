import { APEX_RECENT } from "./recent.js";

export const APEX_RENDER = {
    renderGames(list) {
        const grid = document.getElementById("gamesGrid");
        if (!grid) return;

        const sortMode = document.getElementById("sortSelect")?.value || "az";
        const sorted = [...list].sort((a, b) => a.name.localeCompare(b.name));

        grid.innerHTML = "";

        sorted.forEach(game => {
            const card = document.createElement("div");
            card.className = "game-card";

            card.innerHTML = `
                <img class="game-thumb" src="${game.thumbnail}" onerror="this.src='assets/fallback.png'">
                <div class="game-title">${game.name}</div>
            `;

            card.onclick = () => window.APEX_LAUNCH.openLaunchPrompt(game);
            grid.appendChild(card);
        });
    },

    renderRecent() {
        const grid = document.getElementById("recentGrid");
        if (!grid) return;

        const recent = APEX_RECENT.load();
        grid.innerHTML = "";

        recent.forEach(game => {
            const card = document.createElement("div");
            card.className = "game-card";

            card.innerHTML = `
                <img class="game-thumb" src="${game.thumbnail}" onerror="this.src='assets/fallback.png'">
                <div class="game-title">${game.name}</div>
            `;

            card.onclick = () => window.APEX_LAUNCH.openLaunchPrompt(game);
            grid.appendChild(card);
        });
    }
};
