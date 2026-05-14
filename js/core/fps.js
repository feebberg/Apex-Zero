APEX.fps = {
    active: false,
    frame: null,

    toggle() {
        const box = $("fpsCounter");
        if (!box) return;

        if (this.active) {
            this.active = false;
            box.style.display = "none";
            cancelAnimationFrame(this.frame);
            return;
        }

        this.active = true;
        box.style.display = "block";

        let last = performance.now();

        const loop = () => {
            const now = performance.now();
            const fps = Math.round(1000 / (now - last));
            last = now;

            box.textContent = fps + " FPS";
            this.frame = requestAnimationFrame(loop);
        };

        loop();
    }
};
