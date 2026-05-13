/* --------------------------------------------------
   APEX ZERO — MAIN LOGIC (FULL ADMIN + AUTOSCAN)
-------------------------------------------------- */

let games = [];
let searchQuery = "";
let pendingGame = null;
let hoverEnabled = true;
let autoscanEnabled = true;
let launchCount = 0;
let startTime = Date.now();
let adminOpen = false;

/* --------------------------------------------------
   ELEMENTS
-------------------------------------------------- */

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

/* --------------------------------------------------
   UTIL
-------------------------------------------------- */

function uuid() {
    return "g_" + Math.random().toString(36).slice(2, 10);
}

/* --------------------------------------------------
   LOADING
-------------------------------------------------- */

function setLoadingProgress(pct) {
    loadingFill.style.width = `${pct}%`;
}

function hideLoading() {
    loadingScreen.style.display = "none";
}

/* --------------------------------------------------
   AUTOSCAN (GITHUB API)
-------------------------------------------------- */

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
                return {
                    id: name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
                    name: name.replace(/[-_]/g, " "),
                    desc: "Local game from /games",
                    url: `games/${item.name}`,
                    source: "autoscan"
                };
            });

        return autoGames;
    } catch (e) {
        console.error("Auto-scan failed:", e);
        return [];
    }
}

/* --------------------------------------------------
   GAME MERGE (AUTOSCAN + MANUAL)
-------------------------------------------------- */

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

/* --------------------------------------------------
   GRID RENDERING
-------------------------------------------------- */

function renderGrid() {
    grid.innerHTML = "";

    const filtered = games.filter(g => {
        if (searchQuery && !g.name.toLowerCase().includes(searchQuery.toLowerCase()))
            return false;
        return true;
    });

    if (filtered.length === 0) {
        const empty = document.createElement("div");
        empty.style.fontSize = "11px";
        empty.style.color = "#777";
        empty.textContent = "No games found. Add games to /games or via Admin → Games.";
        grid.appendChild(empty);
        return;
    }

    filtered.forEach(g => {
        const card = document.createElement("div");
        card.className = "icon";
        card.dataset.id = g.id;

        const title = document.createElement("div");
        title.className = "iconTitle";
        title.textContent = g.name;

        const desc = document.createElement("div");
        desc.className = "iconDesc";
        desc.textContent = g.desc || (g.source === "autoscan" ? "Local game from /games" : "Game");

        card.appendChild(title);
        card.appendChild(desc);

        card.addEventListener("click", () => openLaunchOverlay(g));

        grid.appendChild(card);
    });

    applyHoverState();
}

/* --------------------------------------------------
   LAUNCH OVERLAY
-------------------------------------------------- */

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

    if (pendingGame.url && pendingGame.url !== "#") {
        window.open(pendingGame.url, "_blank");
    }

    addRecent(pendingGame);
    launchCount++;

    closeLaunchOverlay();
};

cancelBtn.onclick = closeLaunchOverlay;

/* --------------------------------------------------
   RECENT SYSTEM
-------------------------------------------------- */

function getRecent() {
    try {
        const raw = localStorage.getItem("apex_recent");
        if (!raw) return [];
        return JSON.parse(raw);
    } catch {
        return [];
    }
}

function saveRecent(list) {
    localStorage.setItem("apex_recent", JSON.stringify(list));
}

function addRecent(game) {
    let list = getRecent();
    list = list.filter(id => id !== game.id);
    list.unshift(game.id);
    if (list.length > 5) list = list.slice(0, 5);
    saveRecent(list);
    renderRecent();
}

function renderRecent() {
    recentList.innerHTML = "";
    const list = getRecent();

    if (list.length === 0) {
        recentList.textContent = "No games played yet.";
        return;
    }

    list.forEach(id => {
        const g = games.find(x => x.id === id);
        if (!g) return;

        const item = document.createElement("div");
        item.className = "recentItem";
        item.textContent = g.name;

        item.addEventListener("click", () => openLaunchOverlay(g));

        recentList.appendChild(item);
    });
}

clearRecentBtn.onclick = () => {
    saveRecent([]);
    renderRecent();
};

clearRecentSettingsBtn.onclick = () => {
    saveRecent([]);
    renderRecent();
};

/* --------------------------------------------------
   SEARCH
-------------------------------------------------- */

searchBox.addEventListener("input", () => {
    searchQuery = searchBox.value.trim();
    renderGrid();
});

/* --------------------------------------------------
   SETTINGS
-------------------------------------------------- */

function openSettings() {
    settingsOverlay.style.display = "flex";
}

function closeSettings() {
    settingsOverlay.style.display = "none";
}

settingsBtn.onclick = openSettings;
closeSettingsBtn.onclick = closeSettings;

toggleHoverBtn.onclick = () => {
    hoverEnabled = !hoverEnabled;
    applyHoverState();
    updateSettingsToggles();
    localStorage.setItem("apex_hover", hoverEnabled ? "1" : "0");
};

toggleAutoscanBtn.onclick = () => {
    autoscanEnabled = !autoscanEnabled;
    updateSettingsToggles();
    localStorage.setItem("apex_autoscan", autoscanEnabled ? "1" : "0");
    // Reload games when autoscan toggled
    initGames();
};

function updateSettingsToggles() {
    toggleHoverBtn.textContent = hoverEnabled ? "ON" : "OFF";
    toggleHoverBtn.classList.toggle("active", hoverEnabled);

    toggleAutoscanBtn.textContent = autoscanEnabled ? "ON" : "OFF";
    toggleAutoscanBtn.classList.toggle("active", autoscanEnabled);
}

function applyHoverState() {
    document.querySelectorAll(".icon").forEach(card => {
        card.style.transition = hoverEnabled ? "0.25s" : "0s";
        card.style.transform = "none";
    });
}

/* --------------------------------------------------
   SETTINGS LOAD
-------------------------------------------------- */

function loadSettings() {
    const h = localStorage.getItem("apex_hover");
    if (h !== null) hoverEnabled = h === "1";

    const a = localStorage.getItem("apex_autoscan");
    if (a !== null) {
        autoscanEnabled = a === "1";
    } else {
        autoscanEnabled = window.APEX_CONFIG.autoscanDefault;
    }

    updateSettingsToggles();
}

/* --------------------------------------------------
   ADMIN DASHBOARD
-------------------------------------------------- */

function openAdmin() {
    adminOpen = true;
    adminOverlay.style.display = "flex";
    renderAdminTab("system");
}

function closeAdmin() {
    adminOpen = false;
    adminOverlay.style.display = "none";
}

function renderAdminTab(tab) {
    adminTabs.forEach(t => t.classList.toggle("active", t.dataset.tab === tab));

    if (tab === "system") renderAdminSystem();
    if (tab === "games") renderAdminGames();
    if (tab === "dev") renderAdminDev();
}

function renderAdminSystem() {
    const recentCount = getRecent().length;

    adminContent.innerHTML = `
        <div class="adminSectionTitle">SYSTEM STATS</div>
        <div class="adminRow"><div>Uptime</div><div class="adminValue" id="adminUptime">...</div></div>
        <div class="adminRow"><div>Launches</div><div class="adminValue">${launchCount}</div></div>
        <div class="adminRow"><div>Total Games</div><div class="adminValue">${games.length}</div></div>
        <div class="adminRow"><div>Recently Played</div><div class="adminValue">${recentCount}</div></div>
        <div class="adminRow"><div>Autoscan</div><div class="adminValue">${autoscanEnabled ? "ON" : "OFF"}</div></div>

        <div class="adminSectionTitle" style="margin-top:10px;">ACTIONS</div>
        <div class="adminBtnRow">
            <button class="adminBtn" id="adminClearRecent">Clear Recent</button>
            <button class="adminBtn" id="adminReloadGames">Reload Games</button>
        </div>
    `;

    document.getElementById("adminClearRecent").onclick = () => {
        saveRecent([]);
        renderRecent();
        renderAdminSystem();
    };

    document.getElementById("adminReloadGames").onclick = async () => {
        await initGames();
        renderAdminSystem();
    };

    const updateAdminUptime = () => {
        const diff = Date.now() - startTime;
        const totalSeconds = Math.floor(diff / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        const el = document.getElementById("adminUptime");
        if (el) el.textContent = `${minutes}:${String(seconds).padStart(2, "0")}`;
    };

    updateAdminUptime();
}

function renderAdminGames() {
    const listHtml = games
        .map(g => `<li data-id="${g.id}">${g.name} <span style="opacity:0.6;">[${g.source || "manual"}]</span></li>`)
        .join("");

    adminContent.innerHTML = `
        <div class="adminSectionTitle">GAME LIBRARY</div>
        <ul style="margin-top:4px; padding-left:18px; font-size:11px; max-height:120px; overflow-y:auto;">
            ${listHtml || "<li style='opacity:0.6;'>No games loaded.</li>"}
        </ul>

        <div class="adminSectionTitle" style="margin-top:10px;">ADD / EDIT GAME (MANUAL)</div>
        <input class="adminInput" id="adminGameId" placeholder="ID (auto if blank)">
        <input class="adminInput" id="adminGameName" placeholder="Name">
        <input class="adminInput" id="adminGameDesc" placeholder="Description">
        <input class="adminInput" id="adminGameURL" placeholder="URL (e.g. games/mygame.html or https://...)">
        <div class="adminBtnRow">
            <button class="adminBtn" id="adminAddGame">Save / Add</button>
            <button class="adminBtn" id="adminDeleteGame">Delete by ID</button>
        </div>
    `;

    document.getElementById("adminAddGame").onclick = () => {
        const idInput = document.getElementById("adminGameId").value.trim();
        const name = document.getElementById("adminGameName").value.trim();
        const desc = document.getElementById("adminGameDesc").value.trim();
        const url = document.getElementById("adminGameURL").value.trim();

        if (!name || !url) return;

        let id = idInput || uuid();

        const existingIndex = games.findIndex(g => g.id === id);
        const newGame = {
            id,
            name,
            desc,
            url,
            source: "manual"
        };

        if (existingIndex >= 0) {
            games[existingIndex] = newGame;
        } else {
            games.push(newGame);
        }

        renderGrid();
        renderAdminGames();
    };

    document.getElementById("adminDeleteGame").onclick = () => {
        const id = document.getElementById("adminGameId").value.trim();
        if (!id) return;
        games = games.filter(g => g.id !== id);
        renderGrid();
        renderAdminGames();
    };
}

function renderAdminDev() {
    const recentRaw = JSON.stringify(getRecent());
    const cfg = window.APEX_CONFIG;

    adminContent.innerHTML = `
        <div class="adminSectionTitle">DEV TOOLS</div>
        <div class="adminRow"><div>Recent IDs</div><div class="adminValue">${recentRaw}</div></div>
        <div class="adminRow"><div>Search Query</div><div class="adminValue">${searchQuery || "(none)"}</div></div>
        <div class="adminRow"><div>Repo</div><div class="adminValue">${cfg.repoOwner}/${cfg.repoName}</div></div>
        <div class="adminRow"><div>Games Folder</div><div class="adminValue">${cfg.gamesFolder}</div></div>

        <div class="adminSectionTitle" style="margin-top:10px;">ACTIONS</div>
        <div class="adminBtnRow">
            <button class="adminBtn" id="adminForceReload">Force Reload</button>
            <button class="adminBtn" id="adminClearAllStorage">Clear Local Storage</button>
        </div>

        <div style="margin-top:8px; font-size:10px; opacity:0.7;">
            Admin Mode is local only. No data leaves this browser.
        </div>
    `;

    document.getElementById("adminForceReload").onclick = () => location.reload();
    document.getElementById("adminClearAllStorage").onclick = () => {
        localStorage.clear();
        location.reload();
    };
}

adminTabs.forEach(tab => {
    tab.addEventListener("click", () => renderAdminTab(tab.dataset.tab));
});

/* --------------------------------------------------
   KEYBOARD SHORTCUTS (ALT + A)
-------------------------------------------------- */

document.addEventListener("keydown", e => {
    if (overlay.style.display === "flex") {
        if (e.key === "Enter") launchBtn.click();
        if (e.key === "Escape") closeLaunchOverlay();
    }

    if (settingsOverlay.style.display === "flex" && e.key === "Escape")
        closeSettings();

    if (e.altKey && e.key.toLowerCase() === "a") {
        adminOpen ? closeAdmin() : openAdmin();
    }

    if (adminOpen && e.key === "Escape")
        closeAdmin();
});

/* --------------------------------------------------
   INIT
-------------------------------------------------- */

async function initGames() {
    setLoadingProgress(10);
    await loadGames();
    setLoadingProgress(70);
    renderGrid();
    renderRecent();
    setLoadingProgress(100);
    setTimeout(hideLoading, 300);
}

async function init() {
    loadSettings();
    await initGames();
}

init();
