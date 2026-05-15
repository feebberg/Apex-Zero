export const APEX_UPDATE = {
    currentVersion: "1.0.0",
    versionURL: "https://raw.githubusercontent.com/feebberg/Apex-Zero/main/version.txt",

    async check() {
        try {
            const res = await fetch(this.versionURL + "?t=" + Date.now());
            const latest = (await res.text()).trim();

            // 🔥 HARD SHUTDOWN MODE
            if (latest.toLowerCase() === "shutdown") {
                document.body.innerHTML = `
                    <div style="
                        display:flex;
                        align-items:center;
                        justify-content:center;
                        height:100vh;
                        background:black;
                        color:white;
                        font-family:Arial, sans-serif;
                        font-size:32px;
                        text-align:center;
                    ">
                        Apex Zero has been disabled by the administrator.
                    </div>
                `;
                return; // STOP EVERYTHING
            }

            // 🔄 Version mismatch → refresh
            if (latest !== this.currentVersion) {
                console.log("Update detected:", latest);
                location.reload();
            }
        } catch (err) {
            console.warn("Update check failed:", err);
        }
    },

    start() {
        // Check every 5 seconds
        setInterval(() => this.check(), 5000);
    }
};
