export const APEX_FPS = {
    init() {
        let last = performance.now();
        let fpsCounter = document.getElementById("fps-counter");

        const loop = () => {
            const now = performance.now();
            const fps = Math.round(1000 / (now - last));
            last = now;

            fpsCounter.textContent = fps + " FPS";
            requestAnimationFrame(loop);
        };

        loop();
    }
};
