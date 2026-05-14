export const APEX_LAUNCH = {
    init() {
        this.modal = document.getElementById("launch-modal");
        this.frame = document.getElementById("launch-frame");
        this.closeBtn = document.getElementById("launch-close");

        this.closeBtn.onclick = () => this.close();
    },

    open(game) {
        this.frame.src = game.url;
        this.modal.classList.add("open");
    },

    close() {
        this.modal.classList.remove("open");
        this.frame.src = "";
    }
};
