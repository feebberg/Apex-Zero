APEX.search = {
    init() {
        const input = $("searchInput");
        if (!input) return;

        input.addEventListener("input", () => {
            const q = input.value.toLowerCase().trim();
            if (!q) return APEX.render.games(APEX.ALL_GAMES);

            const filtered = APEX.ALL_GAMES.filter(g =>
                g.name.toLowerCase().includes(q)
            );

            APEX.render.games(filtered);
        });
    },

    sort(list, mode) {
        if (mode === "az") return list.sort((a, b) => a.name.localeCompare(b.name));
        if (mode === "recent") return list;
        if (mode === "played") return list;
        return list;
    }
};
