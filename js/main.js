// --- DIAGNOSTIC MODE ---
// This will show errors directly on the page so you can see them without devtools.

window.onerror = function (msg, url, line) {
    document.body.innerHTML = `
        <div style="
            background:#300;
            color:#f88;
            padding:20px;
            font-size:20px;
            font-family:monospace;
        ">
            <b>JavaScript Error:</b><br>${msg}<br><br>
            <b>File:</b> ${url}<br>
            <b>Line:</b> ${line}
        </div>
    `;
};

// --- NORMAL CODE STARTS HERE ---

window.APEX = {
    ALL_GAMES: []
};

function $(id) {
    return document.getElementById(id);
}

document.addEventListener("DOMContentLoaded", async () => {
    try {
        APEX.theme.loadAll();
        const auto = await APEX.autoscan.scan();
        const manual = window.APEX_MANUAL_GAMES || [];
        APEX.ALL_GAMES = APEX.autoscan.merge(auto, manual);

        APEX.render.games(APEX.ALL_GAMES);
        APEX.render.recent();

        APEX.search.init();
        APEX.settings.init();
        APEX.ui_panel.init();
        APEX.ui_tabs.init();
        APEX.ui_events.init();
    } catch (err) {
        document.body.innerHTML = `
            <div style="
                background:#300;
                color:#f88;
                padding:20px;
                font-size:20px;
                font-family:monospace;
            ">
                <b>Runtime Error:</b><br>${err}<br><br>
                <b>Check missing files or wrong paths.</b>
            </div>
        `;
    }
});
