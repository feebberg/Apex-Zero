APEX.launch = {
    selected: null,

    open(game) {
        this.selected = game;

        $("launchThumb").src = game.thumbnail;
        $("launchName").textContent = game.name;

        $("launchPrompt").classList.add("active");
    },

    close() {
        $("launchPrompt").classList.remove("active");
    },

    confirm() {
        if (!this.selected) return;

        const recent = APEX.storage.load(APEX.storage.keys.recent, []);
        const filtered = recent.filter(g => g.id !== this.selected.id);
        filtered.unshift(this.selected);
        APEX.storage.save(APEX.storage.keys.recent, filtered);

        APEX.render.recent();

        const a = document.createElement("a");
        a.href = this.selected.url;
        a.target = "_blank";
        a.rel = "noopener";
        document.body.appendChild(a);
        a.click();
        a.remove();

        this.close();
    }
};
