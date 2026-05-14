/* ============================================================
   APEX ZERO — MAIN SCRIPT (FINAL, NO ADMIN PANEL, NEW TAB MODE)
============================================================ */

const APEX = {
    gamesFolder: "games",
    thumbnailName: "thumbnail.png",
    autoscanEnabled: true,
    recentKey: "apex_recent",
    themeKey: "apex_theme",
    accentKey: "apex_accent",
    manualGames: window.APEX_MANUAL_GAMES || []
};

let APEX_ALL_GAMES = [];

/* ------------------------------------------------------------
   UTIL
------------------------------------------------------------ */
function $(id) { return document.getElementById(id); }

/* ------------------------------------------------------------
   THEME ENGINE
------------------------------------------------------------ */
function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem(APEX.themeKey, theme);
}

function applyAccent(color) {
    document.documentElement.style.setProperty("--accent", color);
    localStorage.setItem(APEX.accentKey, color);
}

function loadTheme() {
    const theme = localStorage.getItem(APEX.themeKey) || "dark";
    const accent = localStorage.getItem(APEX.accentKey) || "#888888";

    applyTheme(theme);
    applyAccent(accent);

    if ($("themeSelect")) $("themeSelect").value = theme;
    if ($("accentPicker")) $("accentPicker").value = accent;
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
   RENDERING
------------------------------------------------------------ */
function renderGames(list) {
    const grid = $("gamesGrid");
    if (!grid) return;

    grid.innerHTML = "";

    list.forEach(game => {
        const card = document.createElement("div");
        card.className = "game-card";

        card.innerHTML = `
            <img class="game-thumb" src="${game.thumbnail}" onerror="this.src='assets/fallback.png'">
            <div class="game-title">${game.name}</div>
        `;

        card.onclick = () => launchGame(game);
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

        card.onclick = () => launchGame(game);
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
   GAME LAUNCHER (NEW TAB MODE)
------------------------------------------------------------ */
function launchGame(game) {
    addRecent(game);
    renderRecent();
    window.open(game.url, "_blank");
}

/* ------------------------------------------------------------
   SETTINGS PANEL
------------------------------------------------------------ */
function setupSettings() {
    if ($("settingsBtn")) $("settingsBtn").onclick = () =>
        $("settingsOverlay").classList.add("active");

    if ($("closeSettings")) $("closeSettings").onclick = () =>
        $("settingsOverlay").classList.remove("active");

    if ($("themeSelect")) $("themeSelect").onchange = e =>
        applyTheme(e.target.value);

    if ($("accentPicker")) $("accentPicker").onchange = e =>
        applyAccent(e.target.value);

    if ($("autoscanToggle"))
        $("autoscanToggle").onchange = e =>
            APEX.autoscanEnabled = e.target.checked;

    if ($("clearRecentBtn"))
        $("clearRecentBtn").onclick = clearRecent;

    if ($("clearCacheBtn"))
        $("clearCacheBtn").onclick = () => {
            localStorage.clear();
            alert("Cache cleared.");
        };

    if ($("fpsToggleBtn"))
        setupFPS();
}

/* ------------------------------------------------------------
   FPS MONITOR
------------------------------------------------------------ */
let fpsInterval;

function setupFPS() {
    const fps = $("fpsCounter");
    if (!fps) return;

    $("fpsToggleBtn").onclick = () => {
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
    };
}

/* ------------------------------------------------------------
   INIT
------------------------------------------------------------ */
async function init() {
    loadTheme();

    APEX_ALL_GAMES = await loadAllGames();
    renderGames(APEX_ALL_GAMES);
    renderRecent();

    if ($("autoscanToggle"))
        $("autoscanToggle").checked = APEX.autoscanEnabled;

    if ($("localStorageDump"))
        $("localStorageDump").textContent =
            JSON.stringify(localStorage, null, 2);

    setupSearch();
    setupSettings();
}

document.addEventListener("DOMContentLoaded", init);
