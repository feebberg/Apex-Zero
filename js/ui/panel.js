APEX.ui_panel = {
    init() {
        const openBtn = $("openSettings");
        const closeBtn = $("closeSettings");
        const panel = $("settingsPanel");

        if (openBtn && panel) {
            openBtn.addEventListener("click", () => {
                panel.classList.add("open");
            });
        }

        if (closeBtn && panel) {
            closeBtn.addEventListener("click", () => {
                panel.classList.remove("open");
            });
        }
    }
};
