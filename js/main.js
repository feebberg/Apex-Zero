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

// PREMIUM LOADING SEQUENCE
function apexLoadingSequence() {
    const screen = document.getElementById("apexLoading");
    if (!screen) return;

    const bar = document.querySelector(".apex-loading-bar");
    const status = document.querySelector(".apex-loading-status");

    const steps = [
        "Initializing UI…",
        "Loading game library…",
        "Applying theme…",
        "Checking for updates…",
        "Preparing launcher…"
    ];

    let progress = 0;

    function animateTo(target, text) {
        return new Promise(resolve => {
            status.textContent = text;
            const interval = setInterval(() => {
                progress += 1;
                if (progress > 100) progress = 100;
                bar.style.width = progress + "%";

                if (progress >= target) {
                    clearInterval(interval);
                    resolve();
                }
            }, 18);
        });
    }

    (async () => {
        for (let i = 0; i < steps.length; i++) {
            const target = (i + 1) * (100 / steps.length);
            await animateTo(target, steps[i]);
        }

        screen.classList.add("apex-loading-hidden");
        setTimeout(() => screen.remove(), 800);
    })();
}

// Expose modules globally
window.APEX_LAUNCH = APEX_LAUNCH;
window.APEX_RENDER = APEX_RENDER;
window.APEX_FPS = APEX_FPS;

window.APEX = {
    manualGames: APEX_MANUAL_GAMES,
    allGames: [],
    autoscanEnabled: true
};

async function init() {
    // EARLY SHUTDOWN CHECK
    await APEX_UPDATE.check();

    // Load saved customization
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

    // Start update checker loop
    APEX_UPDATE.start();
}

window.addEventListener("load", () => {
    apexLoadingSequence();
    init();
});
