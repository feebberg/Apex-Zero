APEX.settings = {
    init() {
        this.bindControls();
    },

    bindControls() {
        $("themeSelect").onchange = e => APEX.theme.apply(e.target.value);
        $("accentPicker").onchange = e => APEX.theme.applyAccent(e.target.value);
        $("radiusSelect").onchange = e => APEX.theme.applyRadius(e.target.value);
        $("fontSizeSlider").oninput = e => APEX.theme.applyFont(e.target.value);
        $("cardSizeSlider").oninput = e => APEX.theme.applyCard(e.target.value);
        $("densitySelect").onchange = e => APEX.layout.applyDensity(e.target.value);
        $("layoutModeSelect").onchange = e => APEX.layout.applyMode(e.target.value);
        $("backgroundSelect").onchange = e => APEX.theme.applyBackground(e.target.value);
        $("contrastSelect").onchange = e => APEX.theme.applyContrast(e.target.value);

        $("sortSelect").onchange = () => APEX.render.games(APEX.ALL_GAMES);

        $("toggleRecent").onchange = e =>
            $("recentSection").style.display = e.target.checked ? "block" : "none";

        $("clearRecentBtn").onclick = () => {
            APEX.storage.save(APEX.storage.keys.recent, []);
            APEX.render.recent();
        };

        $("clearCacheBtn").onclick = () => {
            APEX.storage.clearAll();
            alert("Cache cleared.");
        };

        $("fpsToggleBtn").onclick = () => APEX.fps.toggle();
    }
};
