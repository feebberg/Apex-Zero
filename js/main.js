window.APEX = {};

function $(id) {
    return document.getElementById(id);
}

document.addEventListener("DOMContentLoaded", async () => {
    try {
        APEX.storage.init();
        APEX.theme.loadAll();
        APEX.settings.init();
        APEX.layout.init();
        APEX.fps.init();
        APEX.ui_panel.init();
        APEX.ui_tabs.init();
        APEX.ui_events.init();
        APEX.search.init();

        const auto = await APEX.autoscan.scan();
        const manual = window.APEX_MANUAL_GAMES || [];
        APEX.ALL_GAMES = APEX.autoscan.merge(auto, manual);

        APEX.render.all(APEX.ALL_GAMES);
        APEX.render.recent();
        APEX.render.favorites();
    } catch (err) {
        document.body.innerHTML = `
            <div style="background:#300;color:#f88;padding:20px;font-size:18px;font-family:monospace;">
                <b>Runtime Error:</b><br>${err}
            </div>
        `;
    }
});
