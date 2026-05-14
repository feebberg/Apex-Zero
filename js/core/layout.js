APEX.layout = {
    applyDensity(mode) {
        const gap = mode === "compact" ? 8 : mode === "spacious" ? 24 : 16;
        document.documentElement.style.setProperty("--grid-gap", gap + "px");
        APEX.storage.save(APEX.storage.keys.density, mode);
    },

    applyMode(mode) {
        document.body.setAttribute("data-layout", mode);
        APEX.storage.save(APEX.storage.keys.layout, mode);
    }
};
