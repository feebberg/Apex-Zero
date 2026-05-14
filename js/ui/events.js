APEX.ui_events = {
    init() {
        // Keyboard shortcuts
        document.addEventListener("keydown", e => {
            // Ctrl + , opens settings
            if (e.ctrlKey && e.key === ",") {
                $("settingsPanel").classList.toggle("active");
            }

            // Escape closes everything
            if (e.key === "Escape") {
                APEX.ui_panel.closeAll();
            }
        });

        // Launch prompt buttons
        $("cancelLaunch").onclick = () => APEX.launch.close();
        $("confirmLaunch").onclick = () => APEX.launch.confirm();
    }
};
