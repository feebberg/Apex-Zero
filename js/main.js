/* --------------------------------------------------
   APEX ZERO — MAIN LOGIC
   - Thumbnails
   - Recent with icons
   - Dark mode
-------------------------------------------------- */

const cfg = window.APEX_CONFIG;

let games = [];
let searchQuery = "";
let pendingGame = null;
let recent = [];

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
const clearRecentSettingsBtn = document.getElementById("clearRecentSettingsBtn");
const darkModeToggle = document.getElementById("darkModeToggle");

const loadingScreen = document.getElementById("loadingScreen");
const loadingFill = document.getElementById("loadingFill");

/* LOADING BAR */

function setLoadingProgress(pct) {
  loadingFill.style.width = `${pct}%`;
}

function hideLoading() {
  loadingScreen.style.display = "none";
}

/* THEME */

function applyTheme(theme) {
  document.body.setAttribute("data-theme", theme);
  localStorage.setItem("apex_theme", theme);
  darkModeToggle.textContent = theme === "dark" ? "ON" : "OFF";
  darkModeToggle.classList.toggle("active", theme === "dark");
}

function initTheme() {
  const saved = localStorage.getItem("apex_theme");
  const theme = saved === "dark" ? "dark" : "light";
  applyTheme(theme);
}

/* RECENT STORAGE */

function loadRecent() {
  try {
    const raw = localStorage.getItem("apex_recent");
    recent = raw ? JSON.parse(raw) : [];
  } catch {
    recent = [];
  }
}

function saveRecent() {
  localStorage.setItem("apex_recent", JSON.stringify(recent));
}

function addRecent(game) {
  recent = recent.filter(r => r.id !== game.id);
  recent.unshift({
    id: game.id,
    name: game.name,
    url: game.url,
    thumbnail: game.thumbnail || cfg.fallbackThumbnail
  });
  if (recent.length > 10) recent = recent.slice(0, 10);
  saveRecent();
  renderRecent();
}

/* GITHUB AUTOSCAN */

async function fetchGamesFromGitHub() {
  const base = `https://api.github.com/repos/${cfg.repoOwner}/${cfg.repoName}/contents/${cfg.gamesFolder}`;

  try {
    const res = await fetch(base);
    if (!res.ok) throw new Error("GitHub API error");
    const data = await res.json();

    const autoGames = data
      .filter(item => item.type === "file" && item.name.toLowerCase().endsWith(".html"))
      .map(item => {
        const name = item.name.replace(/\.html$/i, "");
        const id = name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
        const thumb = `${cfg.gamesFolder}/${name}/${cfg.thumbnailName}`;

        return {
          id,
          name: name.replace(/[-_]/g, " "),
          desc: "",
          url: `${cfg.gamesFolder}/${item.name}`,
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

/* LOAD + MERGE GAMES */

async function loadGames() {
  const manual = window.APEX_MANUAL_GAMES || [];
  setLoadingProgress(20);
  const auto = await fetchGamesFromGitHub();
  setLoadingProgress(60);

  const byId = new Map();
  manual.forEach(g => byId.set(g.id, { ...g, source: g.source || "manual" }));
  auto.forEach(g => {
    if (!byId.has(g.id)) byId.set(g.id, g);
  });

  games = Array.from(byId.values());
  setLoadingProgress(100);
}

/* RENDER GRID */

function renderGrid() {
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

    const body = document.createElement("div");
    body.className = "iconBody";

    const title = document.createElement("div");
    title.className = "iconTitle";
    title.textContent = g.name;

    const desc = document.createElement("div");
    desc.className = "iconDesc";
    desc.textContent = g.desc || "";

    body.appendChild(title);
    body.appendChild(desc);

    card.appendChild(thumb);
    card.appendChild(body);

    card.addEventListener("click", () => openLaunchOverlay(g));

    grid.appendChild(card);
  });
}

/* RENDER RECENT */

function renderRecent() {
  recentList.innerHTML = "";
  if (!recent.length) return;

  recent.forEach(r => {
    const item = document.createElement("div");
    item.className = "recentItem";

    const t = document.createElement("div");
    t.className = "recentThumb";

    const img = new Image();
    img.src = r.thumbnail || cfg.fallbackThumbnail;
    img.onload = () => {
      t.style.backgroundImage = `url('${img.src}')`;
    };
    img.onerror = () => {
      t.style.backgroundImage = `url('${cfg.fallbackThumbnail}')`;
    };

    const label = document.createElement("span");
    label.textContent = r.name;

    item.appendChild(t);
    item.appendChild(label);

    item.addEventListener("click", () => {
      window.open(r.url, "_blank");
    });

    recentList.appendChild(item);
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
  addRecent(pendingGame);
  closeLaunchOverlay();
};

cancelBtn.onclick = closeLaunchOverlay;

overlay.addEventListener("click", e => {
  if (e.target === overlay) closeLaunchOverlay();
});

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

settingsOverlay.addEventListener("click", e => {
  if (e.target === settingsOverlay) closeSettings();
});

darkModeToggle.addEventListener("click", () => {
  const current = document.body.getAttribute("data-theme") || "light";
  applyTheme(current === "light" ? "dark" : "light");
});

clearRecentBtn.addEventListener("click", () => {
  recent = [];
  saveRecent();
  renderRecent();
});

clearRecentSettingsBtn.addEventListener("click", () => {
  recent = [];
  saveRecent();
  renderRecent();
});

/* INIT */

async function init() {
  initTheme();
  loadRecent();
  renderRecent();
  await loadGames();
  renderGrid();
  hideLoading();
}

init();
