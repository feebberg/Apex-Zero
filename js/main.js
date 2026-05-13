/* --------------------------------------------------
   APEX ZERO — MAIN LOGIC (THUMBNAILS + HYBRID)
-------------------------------------------------- */

let games = [];
let searchQuery = "";
let pendingGame = null;
let hoverEnabled = true;
let autoscanEnabled = true;

/* ELEMENTS */

const grid = document.getElementById("grid");
const searchBox = document.getElementById("searchBox");

const overlay = document.getElementById("overlay");
const overlayGameName = document.getElementById("overlayGameName");
const overlayGameDesc = document.getElementById("overlayGameDesc");
const launchBtn = document.getElementById("launchBtn");
const cancelBtn = document.getElementById("cancelBtn");

const recentList = document.getElementById("recentList");
const clearRecentBtn = document.getElementById("clearRecentBtn");

const settingsOverlay = document.getElementById("settingsOverlay");
const settingsBtn = document.getElementById("settingsBtn");
const closeSettingsBtn = document.getElementById("closeSettingsBtn");
const toggleHoverBtn = document.getElementById("toggleHoverBtn");
const clearRecentSettingsBtn = document.getElementById("clearRecentSettingsBtn");
const toggleAutoscanBtn = document.getElementById("toggleAutoscanBtn");

const adminOverlay = document.getElementById("adminOverlay");
const adminTabs = document.querySelectorAll(".adminTab");
const adminContent = document.getElementById("adminContent");

const loadingScreen = document.getElementById("loadingScreen");
const loadingFill = document.getElementById("loadingFill");

/* UTIL */

function uuid() {
    return "g_" + Math.random().toString(36).slice(2, 10);
}

/* LOADING */

function setLoadingProgress(pct) {
    loadingFill.style.width = `${pct}%`;
}

function hideLoading() {
    loadingScreen.style.display = "none";
}

/* AUTOSCAN */

async function fetchGamesFromGitHub() {
    const cfg = window.APEX_CONFIG;
    const base = `https://api.github.com/repos/${cfg.repoOwner}/${cfg.repoName}/contents/${cfg.gamesFolder}`;

    try {
        const res = await fetch(base);
        if (!res.ok) throw new Error("GitHub API error");
        const data = await res.json();

        const autoGames = data
            .filter(item => item.type === "file" && item.name.toLowerCase().endsWith(".html"))
            .map(item => {
                const name = item.name.replace(/\.html$/i, "");
                const thumb = `games/${name}/${cfg.thumbnailName}`;

                return {
                    id: name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
                    name: name.replace(/[-_]/g, " "),
                    desc: "Local game",
                    url: `games/${item.name}`,
                    thumbnail: thumb,
                    source: "autoscan"
                };
            });

        return autoGames;
    } catch (e) {
        console.error("Auto-scan failed:", e);
        return [];
    }
}

/* MERGE */

async function loadGames() {
    const manual = window.APEX_MANUAL_GAMES || [];
    let auto = [];

    if (autoscanEnabled) {
        setLoadingProgress(30);
        auto = await fetchGamesFromGitHub();
    }

    const byId = new Map();

    manual.forEach(g => byId.set(g.id, { ...g, source: g.source || "manual" }));
    auto.forEach(g => {
        if (!byId.has(g.id)) byId.set(g.id, g);
    });

    games = Array.from(byId.values());
}

/* GRID RENDERING */

function renderGrid() {
    const cfg = window.APEX_CONFIG;
    grid.innerHTML = "";

    const filtered = games.filter(g =>
        !searchQuery || g.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (filtered.length === 0) {
        const empty = document.createElement("div");
        empty.style.fontSize = "14px";
        empty.style.color = "#777";
        empty.textContent = "No games found.";
        grid.appendChild(empty);
        return;
    }

    filtered.forEach(g => {
        const card = document.createElement("div");
        card.className = "icon";
        card.dataset.id = g.id;

        /* Thumbnail */
        const thumb = document.createElement("div");
        thumb.className = "iconThumb";

        const img = new Image();
        img.src = g.thumbnail || cfg.fallbackThumbnail;

        img.onload = () => {
            thumb.style.backgroundImage = `url('${img.src}')`;
        };

        img.onerror = () => {
            thumb.style.backgroundImage = `url('${cfg.fallbackThumbnail}')`;
        };

        /* Body */
        const body = document.createElement("div");
        body.className = "iconBody";

        const title = document.createElement("div");
        title.className = "iconTitle";
        title.textContent = g.name;

        const desc = document.createElement("div");
        desc.className = "iconDesc";
        desc.textContent = g.desc || "Game";

        body.appendChild(title);
        body.appendChild(desc);

        card.appendChild(thumb);
        card.appendChild(body);

        card.addEventListener("click", () => openLaunchOverlay(g));

        grid.appendChild(card);
    });
}

/* LAUNCH OVERLAY */

function openLaunchOverlay(game) {
    pendingGame = game;
    overlayGameName.textContent = game.name;
    overlayGameDesc.textContent = game.desc || "";
    overlay.style.display = "flex";
}

function closeLaunchOverlay() {
    overlay.style.display = "none";
    pendingGame = null;
}

launchBtn.onclick = () => {
    if (!pendingGame) return;
    window.open(pendingGame.url, "_blank");
    closeLaunchOverlay();
};

cancelBtn.onclick = closeLaunchOverlay;

/* SEARCH */

searchBox.addEventListener("input", () => {
    searchQuery = searchBox.value.trim();
    renderGrid();
});

/* SETTINGS */

function openSettings() {
    settingsOverlay.style.display = "flex";
}

function closeSettings() {
    settingsOverlay.style.display = "none";
}

settingsBtn.onclick = openSettings;
closeSettingsBtn.onclick = closeSettings;

/* INIT */

async function init() {
    await loadGames();
    renderGrid();
    hideLoading();
}

init();
