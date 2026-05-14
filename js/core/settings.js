APEX.settings = {
    init() {
        const themeSelect = $("themeSelect");
        const layoutSelect = $("layoutSelect");

        if (themeSelect) {
            themeSelect.addEventListener("change", () => {
                APEX.theme.apply(themeSelect.value);
            });
        }

        if (layoutSelect) {
            const saved = APEX.storage.get("apex_layout", "grid");
            layoutSelect.value = saved;
            APEX.layout.apply(saved);

            layoutSelect.addEventListener("change", () => {
                APEX.layout.apply(layoutSelect.value);
                APEX.storage.set("apex_layout", layoutSelect.value);
            });
        }
    }
};
