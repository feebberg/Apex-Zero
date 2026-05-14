import { APEX_RENDER } from './core/render.js';
import { APEX_LAUNCH } from './core/launch.js';
import { APEX_FPS } from './core/fps.js';
import { APEX_SEARCH } from './core/search.js';
import { APEX_EVENTS } from './ui/events.js';
import { GAMES } from './games.js';

window.APEX = {
    render: APEX_RENDER,
    launch: APEX_LAUNCH,
    fps: APEX_FPS,
    search: APEX_SEARCH,
    events: APEX_EVENTS,
    games: GAMES
};

window.addEventListener("DOMContentLoaded", () => {
    APEX_RENDER.init(GAMES);
    APEX_LAUNCH.init();
    APEX_FPS.init();
    APEX_SEARCH.init();
    APEX_EVENTS.init();

    console.log("Apex Zero (Classic) Loaded");
});
