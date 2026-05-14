APEX.layout = {
    current: "grid",

    init() {},

    apply(mode) {
        this.current = mode;
        const grids = document.querySelectorAll(".grid");
        grids.forEach(g => {
            g.setAttribute("data-layout", mode);
        });
    }
};
