import { APEX_THEME } from "./theme.js";
import { APEX_RECENT } from "./recent.js";

export const APEX_SETTINGS = {
    setupSettingsPanel() {
        document.getElementById("settingsBtn").onclick =
            () => document.getElementById("settingsPanel").classList.add("active");

        document.getElementById("closeSettings").onclick =
            () => document.getElementById("settingsPanel").classList.remove("active");

        document.addEventListener("keydown", e => {
            if (e.ctrlKey && e.key === ",") {
                document.getElementById("settingsPanel").classList.toggle("active");
            }
            if (e.key === "Escape") {
                document.getElementById("settingsPanel").classList.remove("active");
                document.getElementById("launchPrompt").classList.remove("active");
            }
        });

        document.querySelectorAll(".tab-btn").forEach(btn => {
            btn.onclick = () => {
                document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
                btn.classList.add("active");

                document.querySelectorAll(".tab-content").forEach(tab => tab.style.display = "none");
                document.getElementById(btn.dataset.tab).style.display = "block";
            };
        });
    },

    setupCustomizationControls() {
        document.getElementById("themeSelect").onchange = e => APEX_THEME.applyTheme(e.target.value);
        document.getElementById("accentPicker").onchange = e => APEX_THEME.applyAccent(e.target.value);
        document.getElementById("radiusSelect").onchange = e => APEX_THEME.applyRadius(e.target.value);
        document.getElementById("fontSizeSlider").oninput = e => APEX_THEME.applyFontSize(e.target.value);
        document.getElementById("cardSizeSlider").oninput = e => APEX_THEME.applyCardSize(e.target.value);
        document.getElementById("densitySelect").onchange = e => APEX_THEME.applyDensity(e.target.value);
        document.getElementById("layoutModeSelect").onchange = e => APEX_THEME.applyLayout(e.target.value);
        document.getElementById("backgroundSelect").onchange = e => APEX_THEME.applyBackground(e.target.value);
        document.getElementById("contrastSelect").onchange = e => APEX_THEME.applyContrast(e.target.value);

        document.getElementById("sortSelect").onchange =
            () => window.APEX_RENDER.renderGames(window.APEX.allGames);

        document.getElementById("toggleRecent").onchange = e =>
            document.getElementById("recentSection").style.display = e.target.checked ? "block" : "none";

        document.getElementById("autoscanToggle").onchange = e =>
            window.APEX.autoscanEnabled = e.target.checked;

        document.getElementById("clearRecentBtn").onclick = () => {
            APEX_RECENT.clear();
            window.APEX_RENDER.renderRecent();
        };

        document.getElementById("clearCacheBtn").onclick = () => {
            localStorage.clear();
            alert("Cache cleared.");
        };

        // FIXED: use global APEX_FPS
        document.getElementById("fpsToggleBtn").onclick = () =>
            window.APEX_FPS.toggleFPS();
    }
};
