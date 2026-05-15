export const APEX_UPDATE = {
    currentVersion: "1.0.0",
    versionURL: "https://raw.githubusercontent.com/feebberg/Apex-Zero/main/version.txt",

    async check() {
        try {
            const res = await fetch(this.versionURL + "?t=" + Date.now());
            const latest = (await res.text()).trim();

            // Remote shutdown
            if (latest.toLowerCase() === "shutdown") {
                alert("Apex Zero has been disabled by the administrator.");
                location.reload();
                return;
            }

            // Version mismatch → force refresh
            if (latest !== this.currentVersion) {
                console.log("Update detected:", latest);
                location.reload();
            }
        } catch (err) {
            console.warn("Update check failed:", err);
        }
    },

    start() {
        // Check every 10 seconds
        setInterval(() => this.check(), 10000);
    }
};
