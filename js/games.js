/* ============================================================
   APEX ZERO — MANUAL GAME LIST
   (Used in addition to autoscan)
============================================================ */

/*
    HOW THIS WORKS:

    Autoscan loads all .html files inside /games automatically.

    This file is ONLY for:
    - External games
    - Custom URLs
    - Games not stored in /games
    - Games you want to override manually

    Each entry looks like this:

    {
        id: "unique-id",
        name: "Game Name",
        desc: "Short description",
        url: "https://example.com/game/",
        thumbnail: "https://example.com/thumb.png",
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
        thumbnail: "assets/thumbnails/example.png",
        source: "manual"
    }
    */

];
