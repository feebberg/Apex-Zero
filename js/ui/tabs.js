APEX.ui_tabs = {
    init() {
        const buttons = document.querySelectorAll(".tab-btn");
        const tabs = document.querySelectorAll(".tab-content");

        buttons.forEach(btn => {
            btn.onclick = () => {
                buttons.forEach(b => b.classList.remove("active"));
                btn.classList.add("active");

                tabs.forEach(t => t.style.display = "none");
                $(btn.dataset.tab).style.display = "block";
            };
        });
    }
};
