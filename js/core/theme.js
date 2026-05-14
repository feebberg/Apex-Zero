APEX.theme = {
    current: "dark",

    loadAll() {
        const saved = APEX.storage.get("apex_theme", "dark");
        this.apply(saved);
    },

    apply(theme) {
        this.current = theme;
        document.body.setAttribute("data-theme", theme);
        APEX.storage.set("apex_theme", theme);
        const select = $("themeSelect");
        if (select) select.value = theme;
    }
};
