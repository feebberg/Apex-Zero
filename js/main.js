/* ============================================================
   APEX ZERO — MAIN SCRIPT (UPGRADED ADMIN PANEL)
   Full autoscan, launcher, admin panel, theme engine
============================================================ */

/* ------------------------------------------------------------
   CONFIG
------------------------------------------------------------ */
const APEX = {
    gamesFolder: "games",
    thumbnailName: "thumbnail.png",
    autoscanEnabled: true,
    recentKey: "apex_recent",
    themeKey: "apex_theme",
    accentKey: "apex_accent",
    manualGames: window.APEX_MANUAL_GAMES || []
};

/* ------------------------------------------------------------
   UTILITIES
------------------------------------------------------------ */
function $(id) { return document.getElementById(id); }
function logEvent(msg) {
    const log = $("eventLog");
    log.textContent += msg + "\n";
    log.scrollTop = log.scrollHeight;
}

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
    const savedTheme = localStorage.getItem(APEX.themeKey) || "dark";
    const savedAccent = localStorage.getItem(APEX.accentKey) || "#888888";

    applyTheme(savedTheme);
    applyAccent(savedAccent);

    $("themeSelect").value = savedTheme;
    $("adminThemeSelect").value = savedTheme;
    $("accentPicker").value = savedAccent;
    $("adminAccentPicker").value = savedAccent;
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

/* ------------------------------------------------------------
   AUTOSCAN
------------------------------------------------------------ */
async function autoscanGames() {
    if (!APEX.autoscanEnabled) return [];

    $("autoscanLog").textContent = "Scanning GitHub…\n";

    const url = `https://api.github.com/repos/feebberg/Apex-Zero/contents/${APEX.gamesFolder}`;
    const res = await fetch(url);
    const data = await res.json();

    $("autoscanLog").textContent += "Fetched directory listing.\n";

    const games = [];

    for (const item of data) {
        if (item.type === "file" && item.name.endsWith(".html")) {
            const name = item.name.replace(".html", "");
            const id = name.toLowerCase().replace(/[^a-z0-9]+/g, "-");

            const thumb = `${APEX.gamesFolder}/${name}/${APEX.thumbnailName}`;

            games.push({
                id,
                name,
                url: `${APEX.gamesFolder}/${item.name}`,
                thumbnail: thumb,
                source: "autoscan"
            });

            $("autoscanLog").textContent += `Found game: ${name}\n`;
        }
    }

    $("autoscanLog").textContent += "Autoscan complete.\n";

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
        if (!merged.find(g => g.id === m.id)) {
            merged.push(m);
        }
    }

    return merged;
}

/* ------------------------------------------------------------
   RENDERING
------------------------------------------------------------ */
function renderGames(list) {
    const grid = $("gamesGrid");
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
    const recent = loadRecent();
    const grid = $("recentGrid");
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
   LAUNCHER
------------------------------------------------------------ */
function launchGame(game) {
    $("launchTitle").textContent = game.name;
    $("launchFrame").src = game.url;

    addRecent(game);
    renderRecent();

    $("launchOverlay").classList.add("active");
}

$("closeLaunch").onclick = () => {
    $("launchOverlay").classList.remove("active");
    $("launchFrame").src = "";
};

/* ------------------------------------------------------------
   SETTINGS
------------------------------------------------------------ */
$("settingsBtn").onclick = () => $("settingsOverlay").classList.add("active");
$("closeSettings").onclick = () => $("settingsOverlay").classList.remove("active");

$("themeSelect").onchange = e => applyTheme(e.target.value);
$("accentPicker").onchange = e => applyAccent(e.target.value);

/* ------------------------------------------------------------
   ADMIN PANEL
------------------------------------------------------------ */
let adminOpen = false;

document.addEventListener("keydown", e => {
    if (e.altKey && e.key.toLowerCase() === "a") {
        adminOpen = !adminOpen;
        $("adminOverlay").classList.toggle("active", adminOpen);
    }
});

$("closeAdmin").onclick = () => {
    adminOpen = false;
    $("adminOverlay").classList.remove("active");
};

/* Tabs */
document.querySelectorAll(".admin-tab").forEach(btn => {
    btn.onclick = () => {
        document.querySelectorAll(".admin-tab").forEach(b => b.classList.remove("active"));
        document.querySelectorAll(".admin-tab-content").forEach(c => c.classList.remove("active"));

        btn.classList.add("active");
        $(btn.dataset.tab).classList.add("active");
    };
});

/* Autoscan toggle */
$("autoscanToggle").onchange = e => {
    APEX.autoscanEnabled = e.target.checked;
};

/* Force rescan */
$("forceScanBtn").onclick = async () => {
    const games = await loadAllGames();
    renderGames(games);
};

/* System tools */
$("clearRecentBtn").onclick = () => {
    localStorage.removeItem(APEX.recentKey);
    renderRecent();
};

$("clearCacheBtn").onclick = () => {
    localStorage.clear();
    alert("Cache cleared.");
};

let fpsInterval;
$("fpsToggleBtn").onclick = () => {
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
};

/* ------------------------------------------------------------
   INIT
------------------------------------------------------------ */
async function init() {
    loadTheme();

    const games = await loadAllGames();
    renderGames(games);
    renderRecent();

    $("autoscanToggle").checked = APEX.autoscanEnabled;

    $("localStorageDump").textContent = JSON.stringify(localStorage, null, 2);
}

init();
