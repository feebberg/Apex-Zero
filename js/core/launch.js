export const APEX_LAUNCH = {
    init() {
        console.log("Launch system ready (new tab mode).");
    },

    open(game) {
        // Open game in a new browser tab
        window.open(game.url, "_blank");
    }
};
