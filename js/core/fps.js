APEX.fps = {
    enabled: false,
    last: performance.now(),
    frames: 0,

    init() {
        const btn = $("toggleFPS");
        if (!btn) return;

        btn.addEventListener("click", () => {
            this.enabled = !this.enabled;
            $("fpsCounter").style.display = this.enabled ? "block" : "none";
        });

        this.loop();
    },

    loop() {
        requestAnimationFrame(() => this.loop());
        if (!this.enabled) return;

        const now = performance.now();
        this.frames++;
        if (now - this.last >= 1000) {
            const fps = this.frames;
            this.frames = 0;
            this.last = now;
            $("fpsCounter").textContent = fps + " FPS";
        }
    }
};
