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

window.APEX_LAUNCH = APEX_LAUNCH;
window.APEX_RENDER = APEX_RENDER;
window.APEX_FPS = APEX_FPS;

window.APEX = {
    manualGames: APEX_MANUAL_GAMES,
    allGames: [],
    autoscanEnabled: true
};

// PREMIUM LOADING SEQUENCE
async function apexLoadingSequence() {
    const loading = document.getElementById("apex-loading");
    if (!loading) return;

    const bar = document.querySelector(".loading-bar");
    const status = document.querySelector(".loading-status");

    const steps = [
        "Initializing UI...",
        "Loading game library...",
        "Applying theme...",
        "Checking for updates...",
        "Preparing launcher..."
    ];

    let progress = 0;

    for (let i = 0; i < steps.length; i++) {
        status.textContent = steps[i];

        await new Promise(resolve => {
            const target = (i + 1) * (100 / steps.length);
            const interval = setInterval(() => {
                progress += 1;
                if (progress > 100) progress = 100;
                bar.style.width = progress + "%";

                if (progress >= target) {
                    clearInterval(interval);
                    resolve();
                }
            }, 20);
        });
    }

    loading.classList.add("loading-hidden");
    setTimeout(() => loading.remove(), 800);
}

async function init() {
    // Start loading animation (parallel)
    apexLoadingSequence();

    // Early shutdown / version check
    await APEX_UPDATE.check();

    // Load customization
    APEX_THEME.loadCustomization();

    // Load games
    APEX.allGames = await APEX_AUTOSCAN.loadAllGames();
    APEX_RENDER.renderGames(APEX.allGames);
    APEX_RENDER.renderRecent();

    // Wire systems
    APEX_SEARCH.setupSearch();
    APEX_SETTINGS.setupSettingsPanel();
    APEX_SETTINGS.setupCustomizationControls();

    // Launch prompt buttons
    const cancelBtn = document.getElementById("cancelLaunch");
    const confirmBtn = document.getElementById("confirmLaunch");

    if (cancelBtn) cancelBtn.onclick = () => APEX_LAUNCH.closeLaunchPrompt();
    if (confirmBtn) confirmBtn.onclick = () => APEX_LAUNCH.confirmLaunch();

    // Start periodic update checks
    APEX_UPDATE.start();
}

document.addEventListener("DOMContentLoaded", init);
