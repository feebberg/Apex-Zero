/* ============================================================
   APEX ZERO — MAIN INITIALIZER
   Loads all modules and boots the launcher.
============================================================ */

window.APEX = {
    ALL_GAMES: []
};

function $(id) {
    return document.getElementById(id);
}

document.addEventListener("DOMContentLoaded", async () => {

    // Load theme + customization first
    APEX.theme.loadAll();

    // Autoscan + manual merge
    const auto = await APEX.autoscan.scan();
    const manual = window.APEX_MANUAL_GAMES || [];
    APEX.ALL_GAMES = APEX.autoscan.merge(auto, manual);

    // Render UI
    APEX.render.games(APEX.ALL_GAMES);
    APEX.render.recent();

    // Initialize systems
    APEX.search.init();
    APEX.settings.init();
    APEX.ui_panel.init();
    APEX.ui_tabs.init();
    APEX.ui_events.init();

    console.log("Apex Zero initialized.");
});
