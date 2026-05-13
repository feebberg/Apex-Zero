/* --------------------------------------------------
   APEX ZERO — MAIN LOGIC (MONOCHROME EDITION)
-------------------------------------------------- */

let games = window.APEX_GAMES;
let searchQuery = "";
let pendingGame = null;
let hoverEnabled = true;
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

const adminOverlay = document.getElementById("adminOverlay");
const adminTabs = document.querySelectorAll(".adminTab");
const adminContent = document.getElementById("adminContent");

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

    filtered.forEach(g => {
        const card = document.createElement("div");
        card.className = "icon";
        card.dataset.id = g.id;

        const title = document.createElement("div");
        title.className = "iconTitle";
        title.textContent = g.name;

        const desc = document.createElement("div");
        desc.className = "iconDesc";
        desc.textContent = g.desc;

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
    overlayGameDesc.textContent = game.desc;
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

function updateSettingsToggles() {
    toggleHoverBtn.textContent = hoverEnabled ? "ON" : "OFF";
    toggleHoverBtn.classList.toggle("active", hoverEnabled);
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

        <div class="adminBtnRow">
            <button class="adminBtn" id="adminClearRecent">Clear Recent</button>
        </div>
    `;

    document.getElementById("adminClearRecent").onclick = () => {
        saveRecent([]);
        renderRecent();
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
        .map(g => `<li>${g.name} <span style="opacity:0.6;">[game]</span></li>`)
        .join("");

    adminContent.innerHTML = `
        <div class="adminSectionTitle">GAME LIBRARY</div>
        <ul style="margin-top:4px; padding-left:18px; font-size:11px;">
            ${listHtml}
        </ul>

        <div class="adminSectionTitle" style="margin-top:10px;">ADD CUSTOM GAME</div>
        <input class="adminInput" id="adminGameName" placeholder="Name">
        <input class="adminInput" id="adminGameURL" placeholder="URL (or #)">
        <button class="adminBtn" id="adminAddGame">Add Game</button>
    `;

    document.getElementById("adminAddGame").onclick = () => {
        const name = document.getElementById("adminGameName").value.trim();
        const url = document.getElementById("adminGameURL").value.trim() || "#";

        if (!name) return;

        window.addCustomGame(name, url);
        renderGrid();
        renderAdminGames();
    };
}

function renderAdminDev() {
    const recentRaw = JSON.stringify(getRecent());

    adminContent.innerHTML = `
        <div class="adminSectionTitle">DEV TOOLS</div>
        <div class="adminRow"><div>Recent IDs</div><div class="adminValue">${recentRaw}</div></div>
        <div class="adminRow"><div>Search Query</div><div class="adminValue">${searchQuery || "(none)"}</div></div>

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

    // NEW SHORTCUT: ALT + A
    if (e.altKey && e.key.toLowerCase() === "a") {
        adminOpen ? closeAdmin() : openAdmin();
    }

    if (adminOpen && e.key === "Escape")
        closeAdmin();
});

/* --------------------------------------------------
   INIT
-------------------------------------------------- */

function init() {
    loadSettings();
    renderGrid();
    renderRecent();
}

init();
