APEX.autoscan = {
    async scan() {
        try {
            const response = await fetch("games/");
            const text = await response.text();

            const parser = new DOMParser();
            const doc = parser.parseFromString(text, "text/html");

            const links = [...doc.querySelectorAll("a")];
            const games = [];

            for (const link of links) {
                const name = link.textContent.trim();
                if (!name.endsWith("/")) continue;

                const folder = name.replace("/", "");
                games.push({
                    id: folder,
                    title: folder,
                    thumb: `games/${folder}/thumb.png`,
                    path: `games/${folder}/index.html`
                });
            }

            return games;
        } catch (err) {
            console.error("Autoscan failed:", err);
            return [];
        }
    },

    merge(auto, manual) {
        return [...auto, ...manual];
    }
};
