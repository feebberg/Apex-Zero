// MAIN INITIALIZER FOR APEX ZERO LAUNCHER

import { APEX_THEME } from './core/theme.js';
import { APEX_SETTINGS } from './core/settings.js';
import { APEX_LAYOUT } from './core/layout.js';
import { APEX_RENDER } from './core/render.js';
import { APEX_LAUNCH } from './core/launch.js';
import { APEX_FPS } from './core/fps.js';
import { APEX_SEARCH } from './core/search.js';
import { APEX_PANEL } from './ui/panel.js';
import { APEX_TABS } from './ui/tabs.js';
import { APEX_EVENTS } from './ui/events.js';
import { GAMES } from './games.js';

window.APEX = {
    theme: APEX_THEME,
    settings: APEX_SETTINGS,
    layout: APEX_LAYOUT,
    render: APEX_RENDER,
    launch: APEX_LAUNCH,
    fps: APEX_FPS,
    search: APEX_SEARCH,
    panel: APEX_PANEL,
    tabs: APEX_TABS,
    events: APEX_EVENTS,
    games: GAMES
};

window.addEventListener("DOMContentLoaded", () => {
    APEX_THEME.init();
    APEX_SETTINGS.init();
    APEX_LAYOUT.init();
    APEX_RENDER.init(GAMES);
    APEX_LAUNCH.init();
    APEX_FPS.init();
    APEX_SEARCH.init();
    APEX_PANEL.init();
    APEX_TABS.init();
    APEX_EVENTS.init();

    console.log("Apex Zero Launcher Loaded Successfully.");
});
