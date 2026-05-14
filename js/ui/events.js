APEX.ui_events = {
    init() {
        document.body.addEventListener("click", e => {
            const card = e.target.closest(".game-card");
            if (card) {
                const id = card.dataset.id;
                const game = (APEX.ALL_GAMES || []).find(g => g.id === id);
                if (game) APEX.launch.open(game);
            }
        });

        const playBtn = $("playBtn");
        const cancelBtn = $("cancelLaunch");

        if (playBtn) playBtn.addEventListener("click", () => APEX.launch.play());
        if (cancelBtn) cancelBtn.addEventListener("click", () => APEX.launch.close());
    }
};
