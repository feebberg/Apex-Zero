import { APEX_THEME } from "./core/theme.js";
import { APEX_AUTOSCAN } from "./core/autoscan.js";
import { APEX_RECENT } from "./core/recent.js";
import { APEX_RENDER } from "./core/render.js";
import { APEX_SEARCH } from "./core/search.js";
import { APEX_LAUNCH } from "./core/launch.js";
import { APEX_SETTINGS } from "./core/settings.js";
import { APEX_FPS } from "./core/fps.js";
import { APEX_UPDATE } from "./core/update.js";
import { APEX_MANUAL_GAMES } from "./games.js";

// Expose modules globally for handlers that reference window.*
// Expose modules globally
window.APEX_LAUNCH = APEX_LAUNCH;
window.APEX_RENDER = APEX_RENDER;
window.APEX_FPS = APEX_FPS;
@@ -21,15 +21,19 @@
};

async function init() {

    // 🔥 EARLY SHUTDOWN CHECK — BEFORE ANYTHING LOADS
    await APEX_UPDATE.check();

// Load saved customization
APEX_THEME.loadCustomization();

    // Load games (autoscan + manual)
    // Load games
APEX.allGames = await APEX_AUTOSCAN.loadAllGames();
APEX_RENDER.renderGames(APEX.allGames);
APEX_RENDER.renderRecent();

    // Wire core systems
    // Wire systems
APEX_SEARCH.setupSearch();
APEX_SETTINGS.setupSettingsPanel();
APEX_SETTINGS.setupCustomizationControls();
@@ -38,7 +42,7 @@
document.getElementById("cancelLaunch").onclick = () => APEX_LAUNCH.closeLaunchPrompt();
document.getElementById("confirmLaunch").onclick = () => APEX_LAUNCH.confirmLaunch();

    // Start update checker (remote control)
    // Start update checker loop
APEX_UPDATE.start();
}
