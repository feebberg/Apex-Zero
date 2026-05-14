/* ============================================================
   APEX ZERO — MANUAL GAME LIST (FINAL + STABLE)
   This file ONLY contains manually added games.
   Autoscan handles everything inside /games automatically.
============================================================ */

/*
 HOW TO USE THIS FILE:

 Add manual games ONLY when:

 - The game is hosted externally (not inside /games)
 - The game uses a custom URL
 - You want to override autoscan behavior
 - You want to add hidden/admin‑only games

 Each entry looks like:

 {
     id: "unique-id",
     name: "Game Name",
     desc: "Short description",
     url: "https://example.com/game/",
     thumbnail: "assets/thumbnails/example.png",
     source: "manual"
 }

 Leave the array empty if you don't need manual games.
*/

window.APEX_MANUAL_GAMES = [

    // Example manual game (you can delete this)
    /*
    {
        id: "example-game",
        name: "Example Game",
        desc: "This is a manually added game.",
        url: "https://example.com/game/",
        thumbnail: "assets/fallback.png",
        source: "manual"
    }
    */

];
