APEX.launch = {
    current: null,

    open(game) {
        this.current = game;
        $("launchTitle").textContent = game.title;
        $("launchThumb").src = game.thumb;
        $("launchOverlay").style.display = "flex";
    },

    close() {
        this.current = null;
        $("launchOverlay").style.display = "none";
    },

    play() {
        if (!this.current) return;
        window.open(this.current.path, "_blank");
        this._addRecent(this.current.id);
        this.close();
        APEX.render.recent();
    },

    _addRecent(id) {
        let recent = APEX.storage.get("apex_recent", []);
        recent = [id, ...recent.filter(x => x !== id)].slice(0, 12);
        APEX.storage.set("apex_recent", recent);
    }
};
