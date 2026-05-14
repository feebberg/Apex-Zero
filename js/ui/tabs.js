APEX.ui_tabs = {
    init() {
        const buttons = document.querySelectorAll(".tab-btn");
        buttons.forEach(btn => {
            btn.addEventListener("click", () => {
                const tab = btn.dataset.tab;
                this.show(tab);
            });
        });
    },

    show(tab) {
        const contents = document.querySelectorAll(".tab-content");
        contents.forEach(c => c.style.display = "none");

        const active = $("tab-" + tab);
        if (active) active.style.display = "block";

        const buttons = document.querySelectorAll(".tab-btn");
        buttons.forEach(b => b.classList.remove("active"));
        const btn = document.querySelector(`.tab-btn[data-tab="${tab}"]`);
        if (btn) btn.classList.add("active");
    }
};
