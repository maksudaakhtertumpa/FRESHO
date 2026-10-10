/* =========================================================
   FRESHO - CHECKOUT PAGE
   Reads the cart saved by cart.html (localStorage key
   "freshoCart"), shows an order summary using the same
   pricing rules as the cart page, validates the delivery
   form, and "places" the order (clears the cart) on submit.
========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    /* =====================================================
       CONSTANTS
       Kept identical to cart.html so totals match exactly
       between the Cart and Checkout pages.
    ====================================================== */

    const SALES_TAX_RATE = 0.06;
    const FREE_DELIVERY_LIMIT = 80;
    const STANDARD_DELIVERY = 5;


    /* =====================================================
       ELEMENT REFERENCES
    ====================================================== */

    const emptyState = document.getElementById("checkout-empty-state");
    const successState = document.getElementById("checkout-success-state");
    const formSection = document.getElementById("checkout-form-section");
    const form = document.getElementById("checkout-form");
    const formError = document.getElementById("checkout-form-error");
    const headerCartCount = document.getElementById("headerCartCount");

    const itemListEl = document.getElementById("checkout-item-list");
    const subtotalEl = document.getElementById("checkout-subtotal");
    const taxEl = document.getElementById("checkout-tax");
    const deliveryEl = document.getElementById("checkout-delivery");
    const totalEl = document.getElementById("checkout-total");

    if (!form) {
        // Checkout markup is not on this page - stop safely.
        return;
    }


    /* =====================================================
       HELPERS
    ====================================================== */

    function formatMoney(amount) {
        return "RM " + amount.toFixed(2);
    }

    function loadCart() {
        // The shared cart store (js/cart-store.js) checks every saved item,
        // so all pages agree on what is in the cart.
        if (window.FreshoCart) {
            return window.FreshoCart.read();
        }


        try {
            const saved = localStorage.getItem("freshoCart");
            const parsed = saved ? JSON.parse(saved) : [];
            return Array.isArray(parsed) ? parsed : [];
        } catch (error) {
            return [];
        }
    }

    function saveCart(cart) {
        if (window.FreshoCart) {
            window.FreshoCart.write(cart);
            return;
        }

        try {
            localStorage.setItem("freshoCart", JSON.stringify(cart));
        } catch (error) {
            // If storage isn't available, the order can still be
            // "placed" for this session - nothing to recover here.
        }
    }


    /* =====================================================
       RENDER ORDER SUMMARY
    ====================================================== */

    let currentCart = [];
    let currentTotal = 0;
    let currentItemCount = 0;

    function renderSummary() {

        currentCart = loadCart().filter(function (item) {
            return item && typeof item.price === "number" && item.price >= 0;
        });

        if (currentCart.length === 0) {
            emptyState.hidden = false;
            formSection.hidden = true;
            if (headerCartCount) headerCartCount.textContent = "0";
            return;
        }

        emptyState.hidden = true;
        formSection.hidden = false;

        itemListEl.innerHTML = "";

        let subtotal = 0;
        let totalItems = 0;

        currentCart.forEach(function (item) {

            const quantity = Number(item.quantity) || 1;
            const lineTotal = item.price * quantity;
            subtotal += lineTotal;
            totalItems += quantity;

            const li = document.createElement("li");
            li.className = "checkout-item-row";
            li.innerHTML =
                "<span class=\"checkout-item-name\">" +
                    escapeHtml(item.name || "Item") +
                    " <span class=\"checkout-item-qty\">x" + quantity + "</span>" +
                "</span>" +
                "<strong>" + formatMoney(lineTotal) + "</strong>";
            itemListEl.appendChild(li);
        });

        const salesTax = subtotal * SALES_TAX_RATE;

        let deliveryFee = 0;
        if (subtotal > 0 && subtotal < FREE_DELIVERY_LIMIT) {
            deliveryFee = STANDARD_DELIVERY;
        }

        const grandTotal = subtotal + salesTax + deliveryFee;

        subtotalEl.textContent = formatMoney(subtotal);
        taxEl.textContent = formatMoney(salesTax);
        deliveryEl.textContent = deliveryFee === 0 ? "FREE" : formatMoney(deliveryFee);
        totalEl.textContent = formatMoney(grandTotal);

        if (headerCartCount) {
            headerCartCount.textContent = totalItems;
        }

        currentTotal = grandTotal;
        currentItemCount = totalItems;
    }

    function escapeHtml(text) {
        const div = document.createElement("div");
        div.textContent = text;
        return div.innerHTML;
    }


    /* =====================================================
       FORM VALIDATION
    ====================================================== */

    function setFieldError(inputId, errorId, message) {
        const input = document.getElementById(inputId);
        const errorEl = document.getElementById(errorId);
        if (input) input.classList.add("field-invalid");
        if (errorEl) errorEl.textContent = message;
    }

    function clearFieldError(inputId, errorId) {
        const input = document.getElementById(inputId);
        const errorEl = document.getElementById(errorId);
        if (input) input.classList.remove("field-invalid");
        if (errorEl) errorEl.textContent = "";
    }

    function showFormError(message) {
        formError.textContent = message;
        formError.hidden = false;
    }

    function hideFormError() {
        formError.textContent = "";
        formError.hidden = true;
    }

    function validateForm() {

        let isValid = true;
        let firstInvalidField = null;

        const name = document.getElementById("checkout-name");
        const phone = document.getElementById("checkout-phone");
        const email = document.getElementById("checkout-email");
        const address = document.getElementById("checkout-address");

        // Name
        if (name.value.trim() === "") {
            setFieldError("checkout-name", "error-name", "Please enter your full name.");
            isValid = false;
            firstInvalidField = firstInvalidField || name;
        } else {
            clearFieldError("checkout-name", "error-name");
        }

        // Phone - at least 7 digits
        const phoneDigits = phone.value.replace(/\D/g, "");
        if (phone.value.trim() === "") {
            setFieldError("checkout-phone", "error-phone", "Please enter a phone number.");
            isValid = false;
            firstInvalidField = firstInvalidField || phone;
        } else if (phoneDigits.length < 7) {
            setFieldError("checkout-phone", "error-phone", "Enter a valid phone number.");
            isValid = false;
            firstInvalidField = firstInvalidField || phone;
        } else {
            clearFieldError("checkout-phone", "error-phone");
        }

        // Email - simple format check
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (email.value.trim() === "") {
            setFieldError("checkout-email", "error-email", "Please enter your email address.");
            isValid = false;
            firstInvalidField = firstInvalidField || email;
        } else if (!emailPattern.test(email.value.trim())) {
            setFieldError("checkout-email", "error-email", "Enter a valid email address.");
            isValid = false;
            firstInvalidField = firstInvalidField || email;
        } else {
            clearFieldError("checkout-email", "error-email");
        }

        // Address
        if (address.value.trim() === "") {
            setFieldError("checkout-address", "error-address", "Please enter your delivery address.");
            isValid = false;
            firstInvalidField = firstInvalidField || address;
        } else if (address.value.trim().length < 10) {
            setFieldError("checkout-address", "error-address", "Please enter a more complete address.");
            isValid = false;
            firstInvalidField = firstInvalidField || address;
        } else {
            clearFieldError("checkout-address", "error-address");
        }

        return { isValid: isValid, firstInvalidField: firstInvalidField };
    }


    /* =====================================================
       EVENTS
    ====================================================== */

    // Clear a field's error the moment the user starts fixing it,
    // matching the "don't scold while typing" pattern used by the
    // Grocery Calculator elsewhere on this site.
    ["checkout-name", "checkout-phone", "checkout-email", "checkout-address"].forEach(function (id) {
        const el = document.getElementById(id);
        const errorId = "error-" + id.replace("checkout-", "");
        if (el) {
            el.addEventListener("input", function () {
                clearFieldError(id, errorId);
                hideFormError();
            });
        }
    });

    form.addEventListener("submit", function (event) {

        event.preventDefault();

        if (currentCart.length === 0) {
            showFormError("Your cart is empty - add items before placing an order.");
            return;
        }

        const result = validateForm();

        if (!result.isValid) {
            showFormError("Please fix the highlighted fields before placing your order.");
            if (result.firstInvalidField) {
                result.firstInvalidField.focus();
            }
            return;
        }

        hideFormError();

        // "Place" the order: clear the cart and show a confirmation.
        saveCart([]);

        const successMessage = document.getElementById("checkout-success-message");
        if (successMessage) {
            successMessage.textContent =
                "Thank you! Your order of " + currentItemCount +
                (currentItemCount === 1 ? " item" : " items") +
                " (" + formatMoney(currentTotal) + ") has been placed.";
        }

        formSection.hidden = true;
        emptyState.hidden = true;
        successState.hidden = false;

        if (headerCartCount) {
            headerCartCount.textContent = "0";
        }
    });


    /* =====================================================
       INITIAL RENDER
    ====================================================== */

    renderSummary();

});
