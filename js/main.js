/* ============================================================
   APEX ZERO — MAIN SCRIPT (SIDE PANEL + LAUNCH PROMPT EDITION)
============================================================ */

const APEX = {
    gamesFolder: "games",
    thumbnailName: "thumbnail.png",
    autoscanEnabled: true,
    recentKey: "apex_recent",
    themeKey: "apex_theme",
    accentKey: "apex_accent",
    radiusKey: "apex_radius",
    fontKey: "apex_font",
    cardKey: "apex_card",
    densityKey: "apex_density",
    layoutKey: "apex_layout",
    backgroundKey: "apex_background",
    contrastKey: "apex_contrast",
    manualGames: window.APEX_MANUAL_GAMES || []
};

let APEX_ALL_GAMES = [];
let selectedGame = null;

/* ------------------------------------------------------------
   UTIL
------------------------------------------------------------ */
function $(id) { return document.getElementById(id); }

/* ------------------------------------------------------------
   THEME + CUSTOMIZATION ENGINE
------------------------------------------------------------ */
function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem(APEX.themeKey, theme);
}

function applyAccent(color) {
    document.documentElement.style.setProperty("--accent", color);
    localStorage.setItem(APEX.accentKey, color);
}

function applyRadius(px) {
    document.documentElement.style.setProperty("--radius", px + "px");
    localStorage.setItem(APEX.radiusKey, px);
}

function applyFontSize(px) {
    document.documentElement.style.setProperty("--font-size", px + "px");
    localStorage.setItem(APEX.fontKey, px);
}

function applyCardSize(px) {
    document.documentElement.style.setProperty("--card-size", px + "px");
    localStorage.setItem(APEX.cardKey, px);
}

function applyDensity(mode) {
    const gap = mode === "compact" ? 8 : mode === "spacious" ? 24 : 16;
    document.documentElement.style.setProperty("--grid-gap", gap + "px");
    localStorage.setItem(APEX.densityKey, mode);
}

function applyLayout(mode) {
    document.body.setAttribute("data-layout", mode);
    localStorage.setItem(APEX.layoutKey, mode);
}

function applyBackground(style) {
    document.body.setAttribute("data-bgstyle", style);
    localStorage.setItem(APEX.backgroundKey, style);
}

function applyContrast(level) {
    document.body.setAttribute("data-contrast", level);
    localStorage.setItem(APEX.contrastKey, level);
}

function loadCustomization() {
    applyTheme(localStorage.getItem(APEX.themeKey) || "dark");
    applyAccent(localStorage.getItem(APEX.accentKey) || "#888888");
    applyRadius(localStorage.getItem(APEX.radiusKey) || 8);
    applyFontSize(localStorage.getItem(APEX.fontKey) || 16);
    applyCardSize(localStorage.getItem(APEX.cardKey) || 160);
    applyDensity(localStorage.getItem(APEX.densityKey) || "comfort");
    applyLayout(localStorage.getItem(APEX.layoutKey) || "grid");
    applyBackground(localStorage.getItem(APEX.backgroundKey) || "solid");
    applyContrast(localStorage.getItem(APEX.contrastKey) || "medium");
}

/* ------------------------------------------------------------
   RECENT SYSTEM
------------------------------------------------------------ */
function addRecent(game) {
    let recent = JSON.parse(localStorage.getItem(APEX.recentKey) || "[]");
    recent = recent.filter(g => g.id !== game.id);
    recent.unshift(game);
    if (recent.length > 12) recent.pop();
    localStorage.setItem(APEX.recentKey, JSON.stringify(recent));
}

function loadRecent() {
    return JSON.parse(localStorage.getItem(APEX.recentKey) || "[]");
}

function clearRecent() {
    localStorage.removeItem(APEX.recentKey);
    renderRecent();
}

/* ------------------------------------------------------------
   AUTOSCAN
------------------------------------------------------------ */
async function autoscanGames() {
    const url = `https://api.github.com/repos/feebberg/Apex-Zero/contents/${APEX.gamesFolder}`;
    let data = [];

    try {
        const res = await fetch(url);
        data = await res.json();
    } catch {
        return [];
    }

    const games = [];

    for (const item of data) {
        if (item.type === "file" && item.name.endsWith(".html")) {
            const name = item.name.replace(".html", "");
            const id = name.toLowerCase().replace(/[^a-z0-9]+/g, "-");

            games.push({
                id,
                name,
                url: `${APEX.gamesFolder}/${item.name}`,
                thumbnail: `${APEX.gamesFolder}/${name}/${APEX.thumbnailName}`,
                source: "autoscan"
            });
        }
    }

    return games;
}

/* ------------------------------------------------------------
   MERGE AUTOSCAN + MANUAL
------------------------------------------------------------ */
async function loadAllGames() {
    const auto = await autoscanGames();
    const manual = APEX.manualGames;

    const merged = [...auto];
    for (const m of manual) {
        if (!merged.find(g => g.id === m.id)) merged.push(m);
    }

    return merged;
}

/* ------------------------------------------------------------
   SORTING
------------------------------------------------------------ */
function sortGames(list, mode) {
    if (mode === "az") {
        return list.sort((a, b) => a.name.localeCompare(b.name));
    }
    if (mode === "recent") {
        return list; // autoscan order
    }
    if (mode === "played") {
        return list; // future feature
    }
    return list;
}

/* ------------------------------------------------------------
   RENDERING
------------------------------------------------------------ */
function renderGames(list) {
    const grid = $("gamesGrid");
    if (!grid) return;

    const sortMode = $("sortSelect")?.value || "az";
    const sorted = sortGames([...list], sortMode);

    grid.innerHTML = "";

    sorted.forEach(game => {
        const card = document.createElement("div");
        card.className = "game-card";

        card.innerHTML = `
            <img class="game-thumb" src="${game.thumbnail}" onerror="this.src='assets/fallback.png'">
            <div class="game-title">${game.name}</div>
        `;

        card.onclick = () => openLaunchPrompt(game);
        grid.appendChild(card);
    });
}

function renderRecent() {
    const grid = $("recentGrid");
    if (!grid) return;

    const recent = loadRecent();
    grid.innerHTML = "";

    recent.forEach(game => {
        const card = document.createElement("div");
        card.className = "game-card";

        card.innerHTML = `
            <img class="game-thumb" src="${game.thumbnail}" onerror="this.src='assets/fallback.png'">
            <div class="game-title">${game.name}</div>
        `;

        card.onclick = () => openLaunchPrompt(game);
        grid.appendChild(card);
    });
}

/* ------------------------------------------------------------
   SEARCH BAR
------------------------------------------------------------ */
function setupSearch() {
    const input = $("searchInput");
    if (!input) return;

    input.addEventListener("input", () => {
        const q = input.value.toLowerCase().trim();
        if (!q) return renderGames(APEX_ALL_GAMES);

        const filtered = APEX_ALL_GAMES.filter(g =>
            g.name.toLowerCase().includes(q)
        );

        renderGames(filtered);
    });
}

/* ------------------------------------------------------------
   LAUNCH PROMPT
------------------------------------------------------------ */
function openLaunchPrompt(game) {
    selectedGame = game;

    $("launchThumb").src = game.thumbnail;
    $("launchName").textContent = game.name;

    $("launchPrompt").classList.add("active");
}

function closeLaunchPrompt() {
    $("launchPrompt").classList.remove("active");
}

function confirmLaunch() {
    if (!selectedGame) return;

    addRecent(selectedGame);
    renderRecent();

    const a = document.createElement("a");
    a.href = selectedGame.url;
    a.target = "_blank";
    a.rel = "noopener";
    document.body.appendChild(a);
    a.click();
    a.remove();

    closeLaunchPrompt();
}

/* ------------------------------------------------------------
   SETTINGS PANEL + TABS
------------------------------------------------------------ */
function setupSettingsPanel() {
    $("settingsBtn").onclick = () =>
        $("settingsPanel").classList.add("active");

    $("closeSettings").onclick = () =>
        $("settingsPanel").classList.remove("active");

    document.addEventListener("keydown", e => {
        if (e.ctrlKey && e.key === ",") {
            $("settingsPanel").classList.toggle("active");
        }
        if (e.key === "Escape") {
            $("settingsPanel").classList.remove("active");
            closeLaunchPrompt();
        }
    });

    document.querySelectorAll(".tab-btn").forEach(btn => {
        btn.onclick = () => {
            document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
            btn.classList.add("active");

            document.querySelectorAll(".tab-content").forEach(tab => tab.style.display = "none");
            $(btn.dataset.tab).style.display = "block";
        };
    });
}

/* ------------------------------------------------------------
   SETTINGS INPUTS
------------------------------------------------------------ */
function setupCustomizationControls() {
    $("themeSelect").onchange = e => applyTheme(e.target.value);
    $("accentPicker").onchange = e => applyAccent(e.target.value);
    $("radiusSelect").onchange = e => applyRadius(e.target.value);
    $("fontSizeSlider").oninput = e => applyFontSize(e.target.value);
    $("cardSizeSlider").oninput = e => applyCardSize(e.target.value);
    $("densitySelect").onchange = e => applyDensity(e.target.value);
    $("layoutModeSelect").onchange = e => applyLayout(e.target.value);
    $("backgroundSelect").onchange = e => applyBackground(e.target.value);
    $("contrastSelect").onchange = e => applyContrast(e.target.value);

    $("sortSelect").onchange = () => renderGames(APEX_ALL_GAMES);

    $("toggleRecent").onchange = e =>
        $("recentSection").style.display = e.target.checked ? "block" : "none";

    $("autoscanToggle").onchange = e =>
        APEX.autoscanEnabled = e.target.checked;

    $("clearRecentBtn").onclick = clearRecent;

    $("clearCacheBtn").onclick = () => {
        localStorage.clear();
        alert("Cache cleared.");
    };

    $("fpsToggleBtn").onclick = toggleFPS;
}

/* ------------------------------------------------------------
   FPS MONITOR
------------------------------------------------------------ */
let fpsInterval;

function toggleFPS() {
    const fps = $("fpsCounter");
    if (fps.style.display === "block") {
        fps.style.display = "none";
        cancelAnimationFrame(fpsInterval);
        return;
    }

    fps.style.display = "block";

    let last = performance.now();
    function loop() {
        const now = performance.now();
        const fpsVal = Math.round(1000 / (now - last));
        last = now;

        fps.textContent = fpsVal + " FPS";
        fpsInterval = requestAnimationFrame(loop);
    }
    loop();
}

/* ------------------------------------------------------------
   INIT
------------------------------------------------------------ */
async function init() {
    loadCustomization();

    APEX_ALL_GAMES = await loadAllGames();
    renderGames(APEX_ALL_GAMES);
    renderRecent();

    setupSearch();
    setupSettingsPanel();
    setupCustomizationControls();

    $("cancelLaunch").onclick = closeLaunchPrompt;
    $("confirmLaunch").onclick = confirmLaunch;
}

document.addEventListener("DOMContentLoaded", init);
