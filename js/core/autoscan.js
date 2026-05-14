APEX.autoscan = {
    async scan() {
        // Simple: rely only on manual games for now
        return [];
    },

    merge(auto, manual) {
        return [...manual, ...auto];
    }
};
