import { APEX_THEME } from "./core/theme.js";
import { APEX_AUTOSCAN } from "./core/autoscan.js";
import { APEX_RECENT } from "./core/recent.js";
import { APEX_RENDER } from "./core/render.js";
import { APEX_SEARCH } from "./core/search.js";
import { APEX_LAUNCH } from "./core/launch.js";
import { APEX_SETTINGS } from "./core/settings.js";
import { APEX_FPS } from "./core/fps.js";
import { APEX_MANUAL_GAMES } from "./games.js";

// Make modules globally accessible for click handlers
window.APEX_LAUNCH = APEX_LAUNCH;
window.APEX_RENDER = APEX_RENDER;
window.APEX_FPS = APEX_FPS;

window.APEX = {
    manualGames: APEX_MANUAL_GAMES,
    allGames: []
};

async function init() {
    APEX_THEME.loadCustomization();

    APEX.allGames = await APEX_AUTOSCAN.loadAllGames();
    APEX_RENDER.renderGames(APEX.allGames);
    APEX_RENDER.renderRecent();

    APEX_SEARCH.setupSearch();
    APEX_SETTINGS.setupSettingsPanel();
    APEX_SETTINGS.setupCustomizationControls();

    document.getElementById("cancelLaunch").onclick = APEX_LAUNCH.closeLaunchPrompt;
    document.getElementById("confirmLaunch").onclick = APEX_LAUNCH.confirmLaunch;
}

document.addEventListener("DOMContentLoaded", init);
