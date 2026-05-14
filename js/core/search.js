export const APEX_SEARCH = {
    init() {
        const input = document.getElementById("search-input");
        input.addEventListener("input", () => this.filter(input.value));
    },

    filter(query) {
        const cards = document.querySelectorAll(".game-card");
        query = query.toLowerCase();

        cards.forEach(card => {
            const title = card.querySelector(".title").textContent.toLowerCase();
            card.style.display = title.includes(query) ? "block" : "none";
        });
    }
};
