APEX.storage = {
    keys: {
        recent: "apex_recent",
        theme: "apex_theme",
        accent: "apex_accent",
        radius: "apex_radius",
        font: "apex_font",
        card: "apex_card",
        density: "apex_density",
        layout: "apex_layout",
        background: "apex_background",
        contrast: "apex_contrast"
    },

    save(key, value) {
        localStorage.setItem(key, JSON.stringify(value));
    },

    load(key, fallback = null) {
        const raw = localStorage.getItem(key);
        return raw ? JSON.parse(raw) : fallback;
    },

    clearAll() {
        localStorage.clear();
    }
};
