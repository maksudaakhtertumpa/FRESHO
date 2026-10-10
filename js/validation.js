/* =========================================================
   FRESHO - GROCERY CALCULATOR: VALIDATION FEEDBACK
   Error handling, input validation, error messages
   and CSS styling

   WHAT THIS FILE DOES NOW
   -----------------------
   The validation RULES live in js/calculator.js, next to the
   calculation they guard. An earlier version of this file
   carried a second, separate set of rules that ran on the same
   form at the same time. Two validators on one form fight each
   other: each one clears the other's messages on every
   keystroke, so an error on one row would vanish as soon as the
   user typed in a different row, then reappear on blur.

   So this file no longer validates anything. It adds the visual
   feedback on top of the state calculator.js has already
   worked out:

     - a short shake on each row that failed, when Calculate is
       pressed, so the eye is drawn to the rows that need work
     - a brief green flash on the summary panel when a total is
       calculated successfully

   Load order in calculator.html:
     1. js/cart-store.js  (shared cart)
     2. js/calculator.js  (calculation and validation rules)
     3. js/validation.js  (this file - feedback only)

   Because this file registers its submit listener after
   calculator.js has registered its own, calculator.js has
   already finished marking the bad rows by the time the code
   below runs, and this file simply reads the result.
========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    var form = document.getElementById("grocery-form");

    if (!form) {
        // Calculator markup is not on this page - stop safely.
        return;
    }

    var summaryPanel = document.querySelector(".calc-summary");
    var formError = document.getElementById("form-error");


    /* =====================================================
       RESTART A CSS ANIMATION

       Removing the class is not enough on its own: the browser
       batches the change, so the animation never replays. Reading
       offsetWidth forces a reflow in between, which makes the
       browser treat the class as newly added.
    ====================================================== */

    function replayAnimation(element, className) {

        element.classList.remove(className);

        void element.offsetWidth;

        element.classList.add(className);

    }


    function shakeRow(row) {

        replayAnimation(row, "shake");

        row.addEventListener("animationend", function handler() {

            row.classList.remove("shake");
            row.removeEventListener("animationend", handler);

        });

    }


    /* =====================================================
       REACT TO THE RESULT OF A CALCULATION

       calculator.js has already decided which rows are wrong and
       marked them with the row-invalid class, so there is no
       second opinion here about what counts as valid.
    ====================================================== */

    form.addEventListener("submit", function () {

        var badRows = form.querySelectorAll(".grocery-row.row-invalid");

        if (badRows.length > 0) {

            Array.prototype.forEach.call(badRows, shakeRow);

            return;

        }

        // A visible summary message means the calculation was
        // blocked for some other reason, for example an empty
        // list, so this is not a success.
        if (formError && !formError.hidden) {
            return;
        }

        if (summaryPanel) {
            replayAnimation(summaryPanel, "success-flash");
        }

    });

});
