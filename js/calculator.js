/* =========================================================
   FRESHO - GROCERY LIST CALCULATOR

   Grocery calculator: form, calculation, sales tax and final
   amount, plus error handling, input validation and messages.

   Task 1(a) - Capture user input for the groceries purchased,
               calculate the total cost including sales tax and
               display the final amount dynamically.
   Task 1(b) - Handle invalid input and missing fields.

   The calculator also talks to the shopping cart through
   js/cart-store.js, so a list built on the Products page can be
   loaded straight into this form instead of being retyped.


   WHEN ERRORS APPEAR
   ------------------
   Error state belongs to each row on its own, never to the form
   as a whole, so typing in one row can never hide or show the
   error on a different row. Three rules govern every row:

     1. A row that has not been left yet stays quiet. A message
        only appears once the user tabs or clicks out of it, or
        presses Calculate.
     2. A row the user is currently editing never turns red for
        the first time mid-keystroke. If it is already red, the
        message updates live and disappears the moment the row
        becomes valid.
     3. Once a row is red it stays red until it is actually
        fixed. Editing a different row leaves it alone.

   The sales tax field follows the same three rules.
========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    /* =====================================================
       ELEMENT REFERENCES
    ====================================================== */

    var form = document.getElementById("grocery-form");

    if (!form) {
        // The calculator markup is not on this page. Stop safely.
        return;
    }

    var itemsContainer = document.getElementById("grocery-items");
    var addRowBtn = document.getElementById("add-row-btn");
    var resetBtn = document.getElementById("reset-btn");
    var taxRateInput = document.getElementById("tax-rate");
    var formError = document.getElementById("form-error");

    var loadCartBtn = document.getElementById("load-cart-btn");
    var cartStatus = document.getElementById("cart-status");

    var summarySubtotal = document.getElementById("summary-subtotal");
    var summaryTax = document.getElementById("summary-tax");
    var summaryTaxLabel = document.getElementById("summary-tax-label");
    var summaryTotal = document.getElementById("summary-total");
    var summaryStatus = document.getElementById("summary-status");


    /* =====================================================
       VALIDATION LIMITS
    ====================================================== */

    var MAX_PRICE = 9999;
    var MAX_QTY = 99;
    var MAX_ROWS = 50;


    /* The sales tax field is the only control outside the rows,
       so it needs its own "has been left once" flag. */
    var taxTouched = false;

    /* True once the cart has been loaded into the form at least
       once, so the button can offer to reload rather than load. */
    var cartLoadedOnce = false;


    /* =====================================================
       HELPERS
    ====================================================== */

    // Format a number as Malaysian Ringgit for display.
    function formatCurrency(amount) {
        return "RM " + amount.toFixed(2);
    }

    // Every grocery row currently in the form.
    function getRows() {
        return Array.prototype.slice.call(
            itemsContainer.querySelectorAll(".grocery-row")
        );
    }

    // Has the user finished with this row at least once?
    function isTouched(row) {
        return row.getAttribute("data-touched") === "yes";
    }

    function markTouched(row) {
        row.setAttribute("data-touched", "yes");
    }

    function clearTouched(row) {
        row.removeAttribute("data-touched");
    }

    // Is the user typing in this row right now?
    function isBeingEdited(row) {
        return row.contains(document.activeElement);
    }

    // Is this row already showing a red error?
    function isShowingError(row) {
        return row.classList.contains("row-invalid");
    }

    // Blank a row without deleting it.
    function blankRow(row) {

        row.querySelector(".item-name").value = "";
        row.querySelector(".item-price").value = "";
        row.querySelector(".item-qty").value = "1";
        row.querySelector(".row-subtotal").textContent = formatCurrency(0);

        clearRowError(row);
        clearTouched(row);

    }

    // Build a new empty row by cloning the first one.
    function createRow() {

        var templateRow = itemsContainer.querySelector(".grocery-row");
        var newRow = templateRow.cloneNode(true);

        // A brand new row starts untouched, so it stays quiet
        // until the user has finished with it.
        blankRow(newRow);

        return newRow;

    }


    /* =====================================================
       ERROR MESSAGES

       Each row carries its own message element, so the user is
       told which field is wrong and why, instead of getting one
       vague message for the whole form.
    ====================================================== */

    function setRowError(row, message, fieldSelector) {

        row.classList.add("row-invalid");

        var messageEl = row.querySelector(".row-error");

        if (messageEl) {
            messageEl.textContent = message;
            messageEl.hidden = false;
        }

        // Mark the specific field so screen readers announce it
        // and the red outline lands on the right input.
        var fields = row.querySelectorAll("input");

        Array.prototype.forEach.call(fields, function (field) {
            field.classList.remove("field-invalid");
            field.removeAttribute("aria-invalid");
        });

        if (fieldSelector) {

            var badField = row.querySelector(fieldSelector);

            if (badField) {
                badField.classList.add("field-invalid");
                badField.setAttribute("aria-invalid", "true");
            }

        }

    }


    function clearRowError(row) {

        row.classList.remove("row-invalid");

        var messageEl = row.querySelector(".row-error");

        if (messageEl) {
            messageEl.textContent = "";
            messageEl.hidden = true;
        }

        var fields = row.querySelectorAll("input");

        Array.prototype.forEach.call(fields, function (field) {
            field.classList.remove("field-invalid");
            field.removeAttribute("aria-invalid");
        });

    }


    // kind lets the live recheck know which summary message is
    // on screen, so it can refresh or hide the right one.
    function showFormError(message, kind) {

        formError.textContent = message;
        formError.hidden = false;
        formError.setAttribute("data-kind", kind || "general");

    }


    function hideFormError() {

        formError.textContent = "";
        formError.hidden = true;
        formError.removeAttribute("data-kind");

    }


    function countMessage(invalidRows) {

        return invalidRows === 1
            ? "One item needs fixing. Check the message on the highlighted row."
            : invalidRows + " items need fixing. Check the messages on the highlighted rows.";

    }


    /* =====================================================
       VALIDATE ONE ROW

       Returns a description of the row rather than acting on
       it, so the same rules drive the live summary, the red
       styling and the final submit check.
    ====================================================== */

    function checkRow(row) {

        var name = row.querySelector(".item-name").value.trim();
        var priceRaw = row.querySelector(".item-price").value.trim();
        var qtyRaw = row.querySelector(".item-qty").value.trim();

        // A row the user has not started is not an error.
        // Quantity is ignored here because it is pre-filled with 1.
        if (name === "" && priceRaw === "") {
            return { state: "empty" };
        }

        if (name === "") {
            return {
                state: "invalid",
                message: "Enter an item name.",
                field: ".item-name"
            };
        }

        if (priceRaw === "") {
            return {
                state: "invalid",
                message: "Enter a price for " + name + ".",
                field: ".item-price"
            };
        }

        var price = parseFloat(priceRaw);

        if (isNaN(price)) {
            return {
                state: "invalid",
                message: "Price must be a number, for example 8.50.",
                field: ".item-price"
            };
        }

        if (price < 0) {
            return {
                state: "invalid",
                message: "Price cannot be negative.",
                field: ".item-price"
            };
        }

        if (price === 0) {
            return {
                state: "invalid",
                message: "Price must be more than RM 0.00.",
                field: ".item-price"
            };
        }

        if (price > MAX_PRICE) {
            return {
                state: "invalid",
                message: "Price cannot be more than RM " + MAX_PRICE + ".",
                field: ".item-price"
            };
        }

        if (qtyRaw === "") {
            return {
                state: "invalid",
                message: "Enter a quantity of at least 1.",
                field: ".item-qty"
            };
        }

        var qty = Number(qtyRaw);

        if (isNaN(qty) || !isFinite(qty)) {
            return {
                state: "invalid",
                message: "Quantity must be a number.",
                field: ".item-qty"
            };
        }

        if (qty % 1 !== 0) {
            return {
                state: "invalid",
                message: "Quantity must be a whole number.",
                field: ".item-qty"
            };
        }

        if (qty < 0) {
            return {
                state: "invalid",
                message: "Quantity cannot be negative.",
                field: ".item-qty"
            };
        }

        if (qty < 1) {
            return {
                state: "invalid",
                message: "Quantity must be at least 1.",
                field: ".item-qty"
            };
        }

        if (qty > MAX_QTY) {
            return {
                state: "invalid",
                message: "Quantity cannot be more than " + MAX_QTY + ".",
                field: ".item-qty"
            };
        }

        return {
            state: "valid",
            rowTotal: price * qty
        };

    }


    /* =====================================================
       VALIDATE THE SALES TAX RATE

       Same shape as checkRow: it reports what is wrong rather
       than acting on it, so the live summary, the red outline
       and the submit check all read from one place.
    ====================================================== */

    function checkTaxRate() {

        var raw = taxRateInput.value.trim();

        if (raw === "") {
            return { valid: false, message: "Enter a sales tax rate." };
        }

        var rate = parseFloat(raw);

        if (isNaN(rate) || !isFinite(rate)) {
            return { valid: false, message: "Sales tax rate must be a number." };
        }

        if (rate < 0) {
            return { valid: false, message: "Sales tax rate cannot be negative." };
        }

        if (rate === 0) {
            return { valid: false, message: "Sales tax rate must be more than 0%." };
        }

        if (rate > 100) {
            return { valid: false, message: "Sales tax rate cannot be more than 100%." };
        }

        return { valid: true, rate: rate };

    }


    /* =====================================================
       DECIDE WHETHER A ROW SHOWS ITS ERROR

       This is the whole fix for the flickering. The decision is
       made per row from that row's own state, so nothing that
       happens in another row can change it.
    ====================================================== */

    function applyRowError(row, result, force) {

        // force is set by the code that KNOWS the user has
        // finished with this row: leaving it, or pressing
        // Calculate. That is more reliable than inspecting which
        // element has focus, because browsers disagree about what
        // document.activeElement holds during a focusout event.
        if (force) {
            setRowError(row, result.message, result.field);
            return;
        }

        // Rule 3: a row that is already red stays red, and its
        // message is kept current, until the row is fixed.
        if (isShowingError(row)) {
            setRowError(row, result.message, result.field);
            return;
        }

        // Rule 2: never turn a row red for the first time while
        // the user is still typing in it.
        if (isBeingEdited(row)) {
            return;
        }

        // Rule 1: otherwise show the error once the row has been
        // left at least once.
        if (isTouched(row)) {
            setRowError(row, result.message, result.field);
        }

    }


    /* =====================================================
       CORE CALCULATION

       Reads every row and the tax rate, updates each row
       subtotal and the summary panel, and returns the totals.
    ====================================================== */

    function calculateTotals(options) {

        options = options || {};

        var forceAll = options.forceAll === true;
        var forceRow = options.forceRow || null;
        var forceTax = options.forceTax === true;

        var rows = getRows();

        var subtotal = 0;
        var validItems = 0;
        var invalidRows = 0;
        var emptyRows = 0;

        rows.forEach(function (row) {

            var result = checkRow(row);
            var rowSubtotalEl = row.querySelector(".row-subtotal");

            if (result.state === "empty") {

                // An untouched blank row is not an error, and a
                // row the user has just emptied stops being one.
                emptyRows = emptyRows + 1;
                clearRowError(row);
                rowSubtotalEl.textContent = formatCurrency(0);
                return;

            }

            if (result.state === "invalid") {

                invalidRows = invalidRows + 1;
                rowSubtotalEl.textContent = formatCurrency(0);

                applyRowError(
                    row,
                    result,
                    forceAll || row === forceRow
                );

                return;

            }

            // Valid, so the red always comes off immediately.
            clearRowError(row);

            rowSubtotalEl.textContent = formatCurrency(result.rowTotal);

            subtotal = subtotal + result.rowTotal;
            validItems = validItems + 1;

        });


        /* SALES TAX RATE - same three rules as a row */

        var taxCheck = checkTaxRate();

        var taxRateIsValid = taxCheck.valid;

        var taxShowingError =
            taxRateInput.classList.contains("field-invalid");

        if (taxRateIsValid) {

            taxRateInput.classList.remove("field-invalid");
            taxRateInput.removeAttribute("aria-invalid");

        } else if (
            forceTax ||
            taxShowingError ||
            (taxTouched && document.activeElement !== taxRateInput)
        ) {

            taxRateInput.classList.add("field-invalid");
            taxRateInput.setAttribute("aria-invalid", "true");

        }


        /* FINAL AMOUNT */

        var effectiveTaxRate = taxRateIsValid ? taxCheck.rate : 0;
        var taxAmount = subtotal * (effectiveTaxRate / 100);
        var total = subtotal + taxAmount;


        /* UPDATE THE SUMMARY PANEL */

        summarySubtotal.textContent = formatCurrency(subtotal);
        summaryTax.textContent = formatCurrency(taxAmount);
        summaryTaxLabel.textContent =
            "Sales Tax (" + effectiveTaxRate + "%)";
        summaryTotal.textContent = formatCurrency(total);


        var result = {
            subtotal: subtotal,
            taxAmount: taxAmount,
            total: total,
            validItems: validItems,
            invalidRows: invalidRows,
            emptyRows: emptyRows,
            taxRateIsValid: taxRateIsValid,
            taxMessage: taxCheck.message
        };


        refreshFormError(result, forceTax);

        refreshCartStatus();

        return result;

    }


    /* =====================================================
       KEEP THE SUMMARY MESSAGE HONEST

       If the message at the bottom of the form is on screen, it
       is refreshed on every recalculation, so it can never sit
       there claiming three items are broken after two of them
       have been fixed.
    ====================================================== */

    function refreshFormError(result, forceTax) {

        // Unlike a grocery row, the tax field has no message line
        // of its own, so the summary is the only place its reason
        // can appear. When the user has just left the field, show
        // it there even if the summary was hidden. Any broken rows
        // are already explaining themselves on the rows, so there
        // is no competition for this space.
        if (forceTax && !result.taxRateIsValid) {

            showFormError(result.taxMessage, "tax");

            return;

        }

        if (formError.hidden) {
            return;
        }

        var kind = formError.getAttribute("data-kind");

        // The row limit notice is advice, not an error, so it
        // stays until the user does something else.
        if (kind === "limit") {
            return;
        }

        // The notice about an unfinished row clears itself as soon
        // as every row is finished.
        if (kind === "blocked") {

            if (result.emptyRows === 0 && result.invalidRows === 0) {
                hideFormError();
            }

            return;

        }

        // The negative value notice is feedback about a single
        // keystroke, so it removes itself on a timer instead.
        if (kind === "negative") {
            return;
        }

        var everythingValid =
            result.invalidRows === 0 &&
            result.validItems > 0 &&
            result.taxRateIsValid;

        if (everythingValid) {

            hideFormError();

            summaryStatus.textContent =
                "All items look good. Select Calculate final total to confirm your amount.";

            return;

        }

        if (result.invalidRows > 0) {
            showFormError(countMessage(result.invalidRows), "rows");
            return;
        }

        if (result.validItems === 0) {
            showFormError(
                "Add at least one item with a name, price and quantity.",
                "items"
            );
            return;
        }

        if (!result.taxRateIsValid) {
            showFormError(result.taxMessage, "tax");
        }

    }


    /* =====================================================
       CART BRIDGE

       The Products page saves the shopping cart in the browser
       through js/cart-store.js. Rather than making the user
       retype the same list here, this loads the cart straight
       into the calculator rows.
    ====================================================== */

    // A short fingerprint of a list, used to tell whether what is
    // in the form already matches what is in the cart.
    function signature(entries) {

        return entries.join("~");

    }


    function cartSignature() {

        if (!window.FreshoCart) {
            return "";
        }

        return signature(window.FreshoCart.read().map(function (item) {

            return item.name.trim().toLowerCase() +
                "|" + item.price.toFixed(2) +
                "|" + item.quantity;

        }));

    }


    function formSignature() {

        var entries = [];

        getRows().forEach(function (row) {

            var name = row.querySelector(".item-name").value.trim();
            var priceRaw = row.querySelector(".item-price").value.trim();
            var qtyRaw = row.querySelector(".item-qty").value.trim();

            // Blank rows are ignored, so an untouched spare row at
            // the bottom does not count as a difference.
            if (name === "" && priceRaw === "") {
                return;
            }

            var price = parseFloat(priceRaw);

            entries.push(
                name.toLowerCase() +
                "|" + (isNaN(price) ? priceRaw : price.toFixed(2)) +
                "|" + qtyRaw
            );

        });

        return signature(entries);

    }


    /* The button offers to do something. Once it has been done,
       it says so and stops offering, and it comes back only if
       the list and the cart actually differ again. */

    function refreshCartStatus() {

        if (!cartStatus || !loadCartBtn) {
            return;
        }

        if (!window.FreshoCart) {

            cartStatus.textContent = "The cart is not available on this page.";
            loadCartBtn.textContent = "Load my cart items";
            loadCartBtn.disabled = true;

            return;

        }

        var items = window.FreshoCart.read();

        if (items.length === 0) {

            cartStatus.textContent =
                "Your cart is empty. Add products, or type your list below.";

            loadCartBtn.textContent = "Load my cart items";
            loadCartBtn.disabled = true;

            return;

        }

        if (cartSignature() === formSignature()) {

            cartStatus.textContent =
                "Your cart items are in the list below. Editing them here does not change your cart.";

            loadCartBtn.textContent = "Cart items loaded";
            loadCartBtn.disabled = true;

            return;

        }

        var units = window.FreshoCart.count();

        cartStatus.textContent = "Your cart has " +
            units + (units === 1 ? " item" : " items") +
            " worth " + formatCurrency(window.FreshoCart.subtotal()) +
            " before tax.";

        loadCartBtn.textContent = cartLoadedOnce
            ? "Reload from cart"
            : "Load my cart items";

        loadCartBtn.disabled = false;

    }


    function loadCartIntoForm() {

        hideFormError();

        if (!window.FreshoCart) {
            showFormError("The cart is not available on this page.", "general");
            return;
        }

        var items = window.FreshoCart.read();

        if (items.length === 0) {
            showFormError(
                "Your cart is empty. Add products first, or type your list below.",
                "general"
            );
            return;
        }

        // Clear the form down to a single blank row.
        getRows().slice(1).forEach(function (row) {
            row.remove();
        });

        blankRow(getRows()[0]);

        // Fill one row per cart item.
        items.forEach(function (item, index) {

            var row;

            if (index === 0) {
                row = getRows()[0];
            } else {
                row = createRow();
                itemsContainer.appendChild(row);
            }

            row.querySelector(".item-name").value = item.name;
            row.querySelector(".item-price").value = item.price.toFixed(2);
            row.querySelector(".item-qty").value = item.quantity;

            // These came from the cart already complete, so they
            // are treated as finished rows.
            markTouched(row);

        });

        cartLoadedOnce = true;

        calculateTotals();

        summaryStatus.textContent =
            "Loaded " + items.length +
            (items.length === 1 ? " item" : " items") +
            " from your cart. Adjust anything, then calculate your total.";

    }


    /* =====================================================
       ROW MANAGEMENT
    ====================================================== */

    addRowBtn.addEventListener("click", function () {

        // Adding a row means the user has finished with the row
        // they were in, so that row is marked before the focus
        // moves. Existing red messages are untouched.
        var currentRow = document.activeElement
            ? document.activeElement.closest(".grocery-row")
            : null;

        if (currentRow) {
            markTouched(currentRow);
        }

        if (getRows().length >= MAX_ROWS) {
            showFormError(
                "You can add up to " + MAX_ROWS + " items to one list.",
                "limit"
            );
            return;
        }

        // A new row is only allowed once every row already in the
        // list is finished. This covers two cases: a blank row the
        // user has not started, and a row that still has something
        // wrong with it. Either way the list should be tidied up
        // before it grows.
        var blockingRow = null;
        var blockingResult = null;

        getRows().forEach(function (row) {

            if (blockingRow) {
                return;
            }

            var rowResult = checkRow(row);

            if (rowResult.state !== "valid") {
                blockingRow = row;
                blockingResult = rowResult;
            }

        });

        if (blockingRow) {

            if (blockingResult.state === "invalid") {

                // Make sure the reason is on screen before asking
                // the user to fix it, even if they never left the
                // row and so have never seen the message.
                markTouched(blockingRow);

                setRowError(
                    blockingRow,
                    blockingResult.message,
                    blockingResult.field
                );

                var badField = blockingRow.querySelector(blockingResult.field);

                if (badField) {
                    badField.focus();
                }

                showFormError(
                    "Fix the highlighted item before adding another.",
                    "blocked"
                );

            } else {

                blockingRow.querySelector(".item-name").focus();

                showFormError(
                    "Fill in the empty item before adding another.",
                    "blocked"
                );

            }

            return;

        }

        var newRow = createRow();

        itemsContainer.appendChild(newRow);

        newRow.querySelector(".item-name").focus();

        calculateTotals();

    });


    // Event delegation, because rows are created dynamically.
    itemsContainer.addEventListener("click", function (event) {

        var removeBtn = event.target.closest(".remove-row-btn");

        if (!removeBtn) {
            return;
        }

        var rows = getRows();

        if (rows.length === 1) {
            // Always keep one row. Clear it instead of removing it.
            blankRow(rows[0]);
        } else {
            removeBtn.closest(".grocery-row").remove();
        }

        calculateTotals();

    });


    /* =====================================================
       NEGATIVE VALUES ARE NOT ACCEPTED

       The min attributes in the HTML only govern the spinner
       arrows and the browser's own validity check. They do not
       stop someone typing a minus sign, so the validation rules
       in checkRow catch a negative price or quantity when the
       row is finished.

       These two handlers stop it one step earlier: the minus key
       does nothing in a price, quantity or tax field, and a
       negative value that arrives by paste is stripped straight
       away. The rules in checkRow stay in place as the backstop.
    ====================================================== */

    var negativeNoticeTimer = null;


    function showNegativeNotice() {

        showFormError(
            "Prices, quantities and the tax rate cannot be negative.",
            "negative"
        );

        if (negativeNoticeTimer) {
            clearTimeout(negativeNoticeTimer);
        }

        // This is feedback about one keystroke, so it clears
        // itself rather than sitting there for the rest of the
        // session.
        negativeNoticeTimer = setTimeout(function () {

            if (formError.getAttribute("data-kind") === "negative") {
                hideFormError();
            }

            negativeNoticeTimer = null;

        }, 4000);

    }


    function isNumericField(element) {

        return element && (
            element.classList.contains("item-price") ||
            element.classList.contains("item-qty") ||
            element === taxRateInput
        );

    }


    // The minus sign never reaches the field. e and E are blocked
    // too, because a number input accepts them as scientific
    // notation and 1e-3 is a way back to a negative value.
    function blockNegativeKeys(event) {

        if (!isNumericField(event.target)) {
            return;
        }

        if (
            event.key === "-" ||
            event.key === "e" ||
            event.key === "E"
        ) {

            event.preventDefault();

            showNegativeNotice();

        }

    }


    // Catches paste, drag and drop, and anything else that gets a
    // minus sign into the field without a keystroke.
    function stripNegative(element) {

        if (!isNumericField(element)) {
            return false;
        }

        if (element.value.indexOf("-") === -1) {
            return false;
        }

        element.value = element.value.replace(/-/g, "");

        showNegativeNotice();

        return true;

    }


    itemsContainer.addEventListener("keydown", blockNegativeKeys);

    taxRateInput.addEventListener("keydown", blockNegativeKeys);


    /* =====================================================
       LIVE UPDATES

       Every keystroke recalculates the totals. Whether any red
       appears is decided per row inside applyRowError, so
       typing in one row never disturbs another.
    ====================================================== */

    itemsContainer.addEventListener("input", function (event) {

        stripNegative(event.target);

        calculateTotals();

    });

    taxRateInput.addEventListener("input", function () {

        stripNegative(taxRateInput);

        calculateTotals();

    });


    /* =====================================================
       LEAVING A ROW

       focusout also fires when moving between fields inside the
       same row, so the row is only marked as finished once the
       focus has actually left it.
    ====================================================== */

    itemsContainer.addEventListener("focusout", function (event) {

        var row = event.target.closest(".grocery-row");

        if (!row) {
            return;
        }

        var movingTo = event.relatedTarget;

        if (movingTo && row.contains(movingTo)) {
            // Still inside the same row, for example tabbing
            // from the name field to the price field.
            return;
        }

        markTouched(row);

        // The focus has left this row, so its message is shown
        // now whether or not it has ever been shown before.
        calculateTotals({ forceRow: row });

    });


    taxRateInput.addEventListener("blur", function () {

        taxTouched = true;

        calculateTotals({ forceTax: true });

    });


    /* =====================================================
       LOAD FROM CART
    ====================================================== */

    if (loadCartBtn) {
        loadCartBtn.addEventListener("click", loadCartIntoForm);
    }

    // If the cart changes in another tab, refresh the note.
    window.addEventListener("storage", function (event) {

        if (window.FreshoCart && event.key === window.FreshoCart.key) {
            refreshCartStatus();
        }

    });


    /* =====================================================
       SUBMIT - FINAL CALCULATION AND VALIDATION

       Pressing Calculate marks every row as finished, so any
       row still holding a problem shows its message even if the
       user never visited it.
    ====================================================== */

    form.addEventListener("submit", function (event) {

        event.preventDefault();

        getRows().forEach(markTouched);

        taxTouched = true;

        var result = calculateTotals({ forceAll: true, forceTax: true });

        if (result.invalidRows > 0) {

            showFormError(countMessage(result.invalidRows), "rows");

            summaryStatus.textContent =
                "Fix the highlighted items to see your final total.";

            var firstBadField = itemsContainer.querySelector(".field-invalid");

            if (firstBadField) {
                firstBadField.focus();
            }

            return;

        }

        if (result.validItems === 0) {

            showFormError(
                "Add at least one item with a name, price and quantity.",
                "items"
            );

            summaryStatus.textContent = "Add a grocery item to get started.";

            var firstName = itemsContainer.querySelector(".item-name");

            if (firstName) {
                firstName.focus();
            }

            return;

        }

        if (!result.taxRateIsValid) {

            showFormError(result.taxMessage, "tax");

            summaryStatus.textContent =
                "Fix the sales tax rate to calculate your total.";

            taxRateInput.focus();

            return;

        }

        // Everything is valid, so show the final amount.
        hideFormError();

        summaryStatus.textContent =
            result.validItems +
            (result.validItems === 1 ? " item" : " items") +
            ". Subtotal " + formatCurrency(result.subtotal) +
            " plus " + formatCurrency(result.taxAmount) +
            " tax. Final amount " + formatCurrency(result.total) + ".";

    });


    /* =====================================================
       RESET
    ====================================================== */

    resetBtn.addEventListener("click", function () {

        // Let the native reset clear the fields first, then tidy
        // up the rows on the next tick.
        setTimeout(function () {

            getRows().slice(1).forEach(function (row) {
                row.remove();
            });

            blankRow(getRows()[0]);

            hideFormError();

            taxTouched = false;

            taxRateInput.value = "6";
            taxRateInput.classList.remove("field-invalid");
            taxRateInput.removeAttribute("aria-invalid");

            summaryStatus.textContent =
                "Fill in your grocery items to see your total.";

            calculateTotals();
            refreshCartStatus();

        }, 0);

    });


    /* =====================================================
       INITIAL STATE
    ====================================================== */

    refreshCartStatus();
    calculateTotals();

});
