import { APEX_RECENT } from "./recent.js";
import { APEX_RENDER } from "./render.js";

export const APEX_LAUNCH = {
    selectedGame: null,

    openLaunchPrompt(game) {
        this.selectedGame = game;

        document.getElementById("launchThumb").src = game.thumbnail;
        document.getElementById("launchName").textContent = game.name;

        document.getElementById("launchPrompt").classList.add("active");
    },

    closeLaunchPrompt() {
        document.getElementById("launchPrompt").classList.remove("active");
    },

    confirmLaunch() {
        if (!this.selectedGame) return;

        APEX_RECENT.add(this.selectedGame);
        APEX_RENDER.renderRecent();

        window.open(this.selectedGame.url, "_blank", "noopener");

        this.closeLaunchPrompt();
    }
};
