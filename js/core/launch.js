export const APEX_LAUNCH = {
    init() {
        console.log("Launch system ready (classic mode)");
    },

    open(game) {
        window.open(game.url, "_blank");
    }
};
