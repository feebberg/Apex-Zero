APEX.ui_panel = {
    init() {
        $("settingsBtn").onclick = () =>
            $("settingsPanel").classList.add("active");

        $("closeSettings").onclick = () =>
            $("settingsPanel").classList.remove("active");
    },

    closeAll() {
        $("settingsPanel").classList.remove("active");
        APEX.launch.close();
    }
};
