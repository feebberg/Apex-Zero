export const APEX_THEME = {
    themeKey: "apex_theme",
    accentKey: "apex_accent",
    radiusKey: "apex_radius",
    fontKey: "apex_font",
    cardKey: "apex_card",
    densityKey: "apex_density",
    layoutKey: "apex_layout",
    backgroundKey: "apex_background",
    contrastKey: "apex_contrast",

    applyTheme(v) {
        document.documentElement.setAttribute("data-theme", v);
        localStorage.setItem(this.themeKey, v);
    },

    applyAccent(v) {
        document.documentElement.style.setProperty("--accent", v);
        localStorage.setItem(this.accentKey, v);
    },

    applyRadius(v) {
        document.documentElement.style.setProperty("--radius", v + "px");
        localStorage.setItem(this.radiusKey, v);
    },

    applyFontSize(v) {
        document.documentElement.style.setProperty("--font-size", v + "px");
        localStorage.setItem(this.fontKey, v);
    },

    applyCardSize(v) {
        document.documentElement.style.setProperty("--card-size", v + "px");
        localStorage.setItem(this.cardKey, v);
    },

    applyDensity(v) {
        const gap = v === "compact" ? 8 : v === "spacious" ? 24 : 16;
        document.documentElement.style.setProperty("--grid-gap", gap + "px");
        localStorage.setItem(this.densityKey, v);
    },

    applyLayout(v) {
        document.body.setAttribute("data-layout", v);
        localStorage.setItem(this.layoutKey, v);
    },

    applyBackground(v) {
        document.body.setAttribute("data-bgstyle", v);
        localStorage.setItem(this.backgroundKey, v);
    },

    applyContrast(v) {
        document.body.setAttribute("data-contrast", v);
        localStorage.setItem(this.contrastKey, v);
    },

    loadCustomization() {
        this.applyTheme(localStorage.getItem(this.themeKey) || "dark");
        this.applyAccent(localStorage.getItem(this.accentKey) || "#888888");
        this.applyRadius(localStorage.getItem(this.radiusKey) || 8);
        this.applyFontSize(localStorage.getItem(this.fontKey) || 16);
        this.applyCardSize(localStorage.getItem(this.cardKey) || 160);
        this.applyDensity(localStorage.getItem(this.densityKey) || "comfort");
        this.applyLayout(localStorage.getItem(this.layoutKey) || "grid");
        this.applyBackground(localStorage.getItem(this.backgroundKey) || "solid");
        this.applyContrast(localStorage.getItem(this.contrastKey) || "medium");
    }
};
