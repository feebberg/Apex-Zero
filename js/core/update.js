export const APEX_UPDATE = {
    // Saved version or default
    currentVersion: localStorage.getItem("apex_version") || "1.0.1",

    versionURL: "https://raw.githubusercontent.com/feebberg/Apex-Zero/main/version.txt",

    async check() {
        try {
            const res = await fetch(this.versionURL + "?t=" + Date.now());
            const latest = (await res.text()).trim();

            // SHUTDOWN MODE
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
                return;
            }

            // VERSION CHANGE → SAVE + RELOAD ONCE
            if (latest !== this.currentVersion) {
                console.log("New version detected:", latest);

                localStorage.setItem("apex_version", latest);
                this.currentVersion = latest;

                location.reload();
            }

        } catch (err) {
            console.warn("Update check failed:", err);
        }
    },

    start() {
        // Check every 1 minute
        setInterval(() => this.check(), 60000);
    }
};
