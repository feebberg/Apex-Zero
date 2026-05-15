export const APEX_SEARCH = {
    setupSearch() {
        const input = document.getElementById("searchInput");
        if (!input) return;

        input.addEventListener("input", () => {
            const q = input.value.toLowerCase().trim();
            if (!q) return window.APEX_RENDER.renderGames(window.APEX.allGames);

            const filtered = window.APEX.allGames.filter(g =>
                g.name.toLowerCase().includes(q)
            );

            window.APEX_RENDER.renderGames(filtered);
        });
    }
};
