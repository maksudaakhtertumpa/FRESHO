/* =========================================================
   FRESHO - FRESH TIPS PAGE
   Category filtering for the tip cards.
========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    const filterButtons = document.querySelectorAll(".tips-filter-btn");
    const cards = document.querySelectorAll(".tip-card");
    const emptyMessage = document.getElementById("tips-empty-message");

    if (!filterButtons.length || !cards.length) {
        return;
    }

    function applyFilter(category) {

        let visibleCount = 0;

        cards.forEach(function (card) {
            const matches = category === "all" || card.dataset.category === category;
            card.hidden = !matches;
            if (matches) {
                visibleCount += 1;
            }
        });

        if (emptyMessage) {
            emptyMessage.hidden = visibleCount > 0;
        }
    }

    filterButtons.forEach(function (button) {

        button.addEventListener("click", function () {

            filterButtons.forEach(function (btn) {
                btn.classList.remove("active");
                btn.setAttribute("aria-selected", "false");
            });

            button.classList.add("active");
            button.setAttribute("aria-selected", "true");

            applyFilter(button.dataset.filter);
        });
    });

});
