/* --------------------------------------------------
   APEX ZERO — GAME LIST
   (Games only — no apps/tools)
-------------------------------------------------- */

window.APEX_GAMES = [

    // --- CORE GAMES ---
    {
        id: "2048cupcakes",
        name: "2048 Cupcakes",
        url: "2048cupcakes.html",
        desc: "Classic 2048 with cupcakes."
    },

    {
        id: "agariolite",
        name: "Agario Lite",
        url: "agariolite.html",
        desc: "Lightweight agar-style multiplayer."
    },

    {
        id: "cookieclicker",
        name: "Cookie Clicker",
        url: "cookieclicker (1).htm",
        desc: "Endless cookie clicking madness."
    },

    {
        id: "mc1122",
        name: "Minecraft 1.12.2",
        url: "Eaglercraft_1.12.2_WASM_Offline_Download (2).html",
        desc: "Sandbox survival and creativity."
    },

    {
        id: "paperio2",
        name: "Paper.io 2",
        url: "paperio2.htm",
        desc: "Capture territory with smooth lines."
    },

    {
        id: "rooftopsnipers2",
        name: "Rooftop Snipers 2",
        url: "rooftopsnipers2.html",
        desc: "Chaotic rooftop duels."
    }

];

/* --------------------------------------------------
   CUSTOM GAME SUPPORT
   (Admin Panel adds entries here)
-------------------------------------------------- */

window.addCustomGame = function(name, url) {
    const id = "custom_" + Date.now();
    window.APEX_GAMES.push({
        id,
        name,
        url: url || "#",
        desc: "Custom game entry."
    });
};
