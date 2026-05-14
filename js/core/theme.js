APEX.theme = {
    current: "dark",

    loadAll() {
        const saved = localStorage.getItem("apex_theme");
        if (saved) this.apply(saved);
        else this.apply("dark");
    },

    apply(theme) {
        this.current = theme;
        document.body.setAttribute("data-theme", theme);
        localStorage.setItem("apex_theme", theme);
    }
};

