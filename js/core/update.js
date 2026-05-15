export const APEX_UPDATE = {
    // 🔥 This will be overwritten by saved version so reload loops NEVER happen
    currentVersion: localStorage.getItem("apex_version") || "1.0.1",

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

            // 🔄 ONLY reload if version number changed
            if (latest !== this.currentVersion) {
                console.log("New version detected:", latest);

                // 🔥 Save new version so reload loop NEVER happens
                localStorage.setItem("apex_version", latest);
                this.currentVersion = latest;

                location.reload();
            }

        } catch (err) {
            console.warn("Update check failed:", err);
        }
    },

    start() {
        // Check every 1 minute (60000 ms)
        setInterval(() => this.check(), 60000);
    }
};
