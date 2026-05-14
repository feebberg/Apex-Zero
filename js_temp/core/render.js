APEX.render = {
    all(games) {
        this._renderGrid("gameGrid", games);
    },

    recent() {
        const recentIds = APEX.storage.get("apex_recent", []);
        const games = (APEX.ALL_GAMES || []).filter(g => recentIds.includes(g.id));
        this._renderGrid("recentGrid", games);
    },

    favorites() {
        const favIds = APEX.storage.get("apex_favorites", []);
        const games = (APEX.ALL_GAMES || []).filter(g => favIds.includes(g.id));
        this._renderGrid("favoritesGrid", games);
    },

    _renderGrid(id, games) {
        const el = $(id);
        if (!el) return;
        el.innerHTML = "";

        games.forEach(game => {
            const card = document.createElement("div");
            card.className = "game-card";
            card.dataset.id = game.id;
            card.innerHTML = `
                <div class="thumb" style="background-image:url('${game.thumb}')"></div>
                <div class="title">${game.title}</div>
            `;
            el.appendChild(card);
        });
    }
};
