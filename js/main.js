/* ============================================================
   APEX ZERO — MAIN SCRIPT (FINAL + STABLE + NULL-SAFE)
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
    if ($("adminThemeSelect")) $("adminThemeSelect").value = theme;
    if ($("accentPicker")) $("accentPicker").value = accent;
    if ($("adminAccentPicker")) $("adminAccentPicker").value = accent;
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
   LAUNCHER
------------------------------------------------------------ */
function launchGame(game) {
    if ($("launchTitle")) $("launchTitle").textContent = game.name;
    if ($("launchFrame")) $("launchFrame").src = game.url;

    addRecent(game);
    renderRecent();

    if ($("launchOverlay")) $("launchOverlay").classList.add("active");
}

if ($("closeLaunch")) {
    $("closeLaunch").onclick = () => {
        if ($("launchOverlay")) $("launchOverlay").classList.remove("active");
        if ($("launchFrame")) $("launchFrame").src = "";
    };
}

/* ------------------------------------------------------------
   SETTINGS
------------------------------------------------------------ */
function setupSettings() {
    if ($("settingsBtn")) $("settingsBtn").onclick = () => $("settingsOverlay").classList.add("active");
    if ($("closeSettings")) $("closeSettings").onclick = () => $("settingsOverlay").classList.remove("active");

    if ($("themeSelect")) $("themeSelect").onchange = e => applyTheme(e.target.value);
    if ($("accentPicker")) $("accentPicker").onchange = e => applyAccent(e.target.value);
    if ($("adminThemeSelect")) $("adminThemeSelect").onchange = e => applyTheme(e.target.value);
    if ($("adminAccentPicker")) $("adminAccentPicker").onchange = e => applyAccent(e.target.value);

    if ($("clearRecentSettingsBtn")) $("clearRecentSettingsBtn").onclick = clearRecent;
}

/* ------------------------------------------------------------
   ADMIN PANEL (ALT + A)
------------------------------------------------------------ */
function setupAdmin() {
    const overlay = $("adminOverlay");
    if (!overlay) return;

    let open = false;

    document.addEventListener("keydown", e => {
        if (e.altKey && e.key.toLowerCase() === "a") {
            open = !open;
            overlay.classList.toggle("active", open);
        }
    });

    if ($("closeAdmin")) {
        $("closeAdmin").onclick = () => {
            open = false;
            overlay.classList.remove("active");
        };
    }

    document.querySelectorAll(".admin-tab").forEach(btn => {
        btn.onclick = () => {
            document.querySelectorAll(".admin-tab").forEach(b => b.classList.remove("active"));
            document.querySelectorAll(".admin-tab-content").forEach(c => c.classList.remove("active"));

            btn.classList.add("active");
            $(btn.dataset.tab).classList.add("active");
        };
    });

    if ($("autoscanToggle")) $("autoscanToggle").onchange = e => APEX.autoscanEnabled = e.target.checked;

    if ($("forceScanBtn")) $("forceScanBtn").onclick = async () => {
        APEX_ALL_GAMES = await loadAllGames();
        renderGames(APEX_ALL_GAMES);
    };

    if ($("clearRecentBtn")) $("clearRecentBtn").onclick = clearRecent;

    if ($("clearCacheBtn")) $("clearCacheBtn").onclick = () => {
        localStorage.clear();
        alert("Cache cleared.");
    };

    if ($("fpsToggleBtn")) setupFPS();
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

    if ($("autoscanToggle")) $("autoscanToggle").checked = APEX.autoscanEnabled;

    if ($("localStorageDump")) $("localStorageDump").textContent = JSON.stringify(localStorage, null, 2);

    setupSearch();
    setupSettings();
    setupAdmin();
}

document.addEventListener("DOMContentLoaded", init);
