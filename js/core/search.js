APEX.search = {
    init() {
        const input = $("searchInput");
        if (!input) return;

        input.addEventListener("input", () => {
            const q = input.value.toLowerCase();
            const filtered = (APEX.ALL_GAMES || []).filter(g =>
                g.title.toLowerCase().includes(q)
            );
            APEX.render.all(filtered);
        });
    }
};
