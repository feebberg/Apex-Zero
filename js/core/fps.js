export const APEX_FPS = {
    fpsInterval: null,

    toggleFPS() {
        const fps = document.getElementById("fpsCounter");

        if (fps.style.display === "block") {
            fps.style.display = "none";
            cancelAnimationFrame(this.fpsInterval);
            return;
        }

        fps.style.display = "block";

        let last = performance.now();
        const loop = () => {
            const now = performance.now();
            const fpsVal = Math.round(1000 / (now - last));
            last = now;

            fps.textContent = fpsVal + " FPS";
            this.fpsInterval = requestAnimationFrame(loop);
        };

        loop();
    }
};
