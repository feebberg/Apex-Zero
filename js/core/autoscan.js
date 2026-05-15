export const APEX_AUTOSCAN = {
    gamesFolder: "games",
    thumbnailName: "thumbnail.png",

    async autoscanGames() {
        const url = `https://api.github.com/repos/feebberg/Apex-Zero/contents/${this.gamesFolder}`;
        let data = [];

        try {
            const res = await fetch(url);
            data = await res.json();
        } catch {
            return [];
        }

        const games = [];

        for (const item of data) {
            if (item.type === "file" && item.name.endsWith(".html")) {
                const name = item.name.replace(".html", "");
                const id = name.toLowerCase().replace(/[^a-z0-9]+/g, "-");

                games.push({
                    id,
                    name,
                    url: `${this.gamesFolder}/${item.name}`,
                    thumbnail: `${this.gamesFolder}/${name}/${this.thumbnailName}`,
                    source: "autoscan"
                });
            }
        }

        return games;
    },

    async loadAllGames() {
        const auto = await this.autoscanGames();
        const manual = window.APEX.manualGames || [];

        const merged = [...auto];
        for (const m of manual) {
            if (!merged.find(g => g.id === m.id)) merged.push(m);
        }

        return merged;
    }
};
