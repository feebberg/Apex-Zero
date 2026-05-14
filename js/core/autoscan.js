APEX.autoscan = {
    folder: "games",
    thumbnailName: "thumbnail.png",

    async scan() {
        const url = `https://api.github.com/repos/feebberg/Apex-Zero/contents/${this.folder}`;
        let data = [];

        try {
            const res = await fetch(url);
            data = await res.json();
        } catch {
            console.warn("Autoscan failed.");
            return [];
        }

        const games = [];

        for (const item of data) {
            if (item.type === "dir") {
                const name = item.name;
                const id = name.toLowerCase().replace(/[^a-z0-9]+/g, "-");

                games.push({
                    id,
                    name,
                    url: `${this.folder}/${name}/index.html`,
                    thumbnail: `${this.folder}/${name}/${this.thumbnailName}`,
                    source: "autoscan"
                });
            }
        }

        return games;
    },

    merge(auto, manual) {
        const merged = [...auto];
        for (const m of manual) {
            if (!merged.find(g => g.id === m.id)) merged.push(m);
        }
        return merged;
    }
};
