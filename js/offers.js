/* =========================================================
   FRESHO - OFFERS PAGE
   - Live countdown timer for the "Deal of the Day"
   - Copy-to-clipboard for promo codes, with visual feedback
   - Category filtering for the offers grid
========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    /* =====================================================
       COUNTDOWN TIMER
       Counts down to midnight (the "deal" resets each day).
    ====================================================== */

    const hoursEl = document.getElementById("timer-hours");
    const minutesEl = document.getElementById("timer-minutes");
    const secondsEl = document.getElementById("timer-seconds");

    function pad(num) {
        return String(num).padStart(2, "0");
    }

    function updateCountdown() {

        const now = new Date();
        const midnight = new Date(now);
        midnight.setHours(24, 0, 0, 0);

        const diffMs = midnight - now;
        const totalSeconds = Math.max(0, Math.floor(diffMs / 1000));

        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        if (hoursEl) hoursEl.textContent = pad(hours);
        if (minutesEl) minutesEl.textContent = pad(minutes);
        if (secondsEl) secondsEl.textContent = pad(seconds);
    }

    if (hoursEl && minutesEl && secondsEl) {
        updateCountdown();
        setInterval(updateCountdown, 1000);
    }


    /* =====================================================
       COPY-TO-CLIPBOARD FOR PROMO CODES
    ====================================================== */

    const copyButtons = document.querySelectorAll(".copy-btn");

    copyButtons.forEach(function (button) {

        button.addEventListener("click", function () {

            const code = button.dataset.code || "";

            function showCopied() {
                const originalText = button.dataset.originalText || button.textContent;
                button.dataset.originalText = originalText;
                button.textContent = "Copied!";
                button.classList.add("copied");

                setTimeout(function () {
                    button.textContent = originalText;
                    button.classList.remove("copied");
                }, 1500);
            }

            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(code).then(showCopied).catch(function () {
                    fallbackCopy(code);
                    showCopied();
                });
            } else {
                fallbackCopy(code);
                showCopied();
            }
        });
    });

    // Fallback for browsers/environments without the Clipboard API
    // (e.g. older browsers or non-HTTPS local file preview).
    function fallbackCopy(text) {
        const textarea = document.createElement("textarea");
        textarea.value = text;
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";
        document.body.appendChild(textarea);
        textarea.select();
        try {
            document.execCommand("copy");
        } catch (e) {
            // Copying isn't available in this environment - the code
            // is still visible on the page for the user to select
            // manually, so this fails silently.
        }
        document.body.removeChild(textarea);
    }


    /* =====================================================
       CATEGORY FILTER
    ====================================================== */

    const filterButtons = document.querySelectorAll(".offers-filter-btn");
    const offerCards = document.querySelectorAll(".offer-card");
    const emptyMessage = document.getElementById("offers-empty-message");

    function applyFilter(category) {

        let visibleCount = 0;

        offerCards.forEach(function (card) {
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
