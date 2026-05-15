export const APEX_UPDATE = {
    currentVersion: "1.0.0",
    // 🔥 This will be overwritten by saved version so reload loops NEVER happen
    currentVersion: localStorage.getItem("apex_version") || "1.0.1",

versionURL: "https://raw.githubusercontent.com/feebberg/Apex-Zero/main/version.txt",

async check() {
@@ -30,6 +32,11 @@ export const APEX_UPDATE = {
// 🔄 ONLY reload if version number changed
if (latest !== this.currentVersion) {
console.log("New version detected:", latest);

                // 🔥 Save new version so reload loop NEVER happens
                localStorage.setItem("apex_version", latest);
                this.currentVersion = latest;

location.reload();
}
