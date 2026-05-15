export const APEX_RECENT = {
    key: "apex_recent",

    add(game) {
        let recent = JSON.parse(localStorage.getItem(this.key) || "[]");
        recent = recent.filter(g => g.id !== game.id);
        recent.unshift(game);
        if (recent.length > 12) recent.pop();
        localStorage.setItem(this.key, JSON.stringify(recent));
    },

    load() {
        return JSON.parse(localStorage.getItem(this.key) || "[]");
    },

    clear() {
        localStorage.removeItem(this.key);
    }
};
