/* =========================================================
   FRESHO - SHARED CART STORE

   Why this file exists
   --------------------
   Every page draws the same cart badge in the header, but only
   the pages that had their own cart code were updating it, so the
   badge showed "0" on the Calculator, Planner, Offers, Tips,
   About and Contact pages even when the cart was full.

   The browser keeps the cart in localStorage, which survives page
   navigation and browser restarts. This file is the single place
   that reads and writes that storage, and it is loaded on every
   page so the header badge is always correct.

   Storage key: "freshoCart"
   Stored value: JSON array of
       { id, name, price, quantity, category, image }
========================================================= */

(function (window, document) {

    "use strict";


    /* =====================================================
       CONFIGURATION
    ====================================================== */

    var CART_KEY = "freshoCart";

    var MAX_QUANTITY = 99;


    /* =====================================================
       STORAGE AVAILABILITY CHECK

       Private browsing and blocked-cookie settings can make
       localStorage throw on write. We test once and fall back
       to an in-memory list so the site still works for the
       current page instead of crashing.
    ====================================================== */

    var memoryCart = [];

    var storageWorks = (function () {

        try {

            var testKey = "__fresho_test__";

            window.localStorage.setItem(testKey, "1");
            window.localStorage.removeItem(testKey);

            return true;

        } catch (error) {

            return false;

        }

    })();


    /* =====================================================
       VALIDATE ONE STORED ITEM

       Anything read back from storage is untrusted: a user can
       edit it, and an older version of the site may have saved
       a different shape. Bad entries are dropped rather than
       allowed to break the totals.
    ====================================================== */

    function cleanItem(item) {

        if (!item || typeof item !== "object") {
            return null;
        }

        var name = typeof item.name === "string" ? item.name.trim() : "";

        if (name === "") {
            return null;
        }

        var price = Number(item.price);

        if (!isFinite(price) || price < 0) {
            return null;
        }

        var quantity = parseInt(item.quantity, 10);

        if (!isFinite(quantity) || quantity < 1) {
            quantity = 1;
        }

        if (quantity > MAX_QUANTITY) {
            quantity = MAX_QUANTITY;
        }

        return {
            id: item.id,
            name: name,
            price: price,
            quantity: quantity,
            category: typeof item.category === "string" ? item.category : "GROCERY",
            image: typeof item.image === "string" ? item.image : ""
        };

    }


    /* =====================================================
       READ THE CART
    ====================================================== */

    function read() {

        if (!storageWorks) {
            return memoryCart.slice();
        }

        try {

            var saved = window.localStorage.getItem(CART_KEY);

            if (!saved) {
                return [];
            }

            var parsed = JSON.parse(saved);

            if (!Array.isArray(parsed)) {
                return [];
            }

            var cleaned = [];

            parsed.forEach(function (item) {

                var safeItem = cleanItem(item);

                if (safeItem) {
                    cleaned.push(safeItem);
                }

            });

            return cleaned;

        } catch (error) {

            // Corrupted JSON. Report it in the console for the
            // developer and hand back an empty cart so the page
            // still renders.
            console.error("FRESHO: could not read the saved cart.", error);

            return [];

        }

    }


    /* =====================================================
       WRITE THE CART
       Returns true on success so callers can show an error.
    ====================================================== */

    function write(cart) {

        var list = Array.isArray(cart) ? cart : [];

        if (!storageWorks) {

            memoryCart = list.slice();
            updateBadge();

            return false;

        }

        try {

            window.localStorage.setItem(CART_KEY, JSON.stringify(list));

            updateBadge();

            return true;

        } catch (error) {

            console.error("FRESHO: could not save the cart.", error);

            return false;

        }

    }


    /* =====================================================
       TOTALS
    ====================================================== */

    function count() {

        var total = 0;

        read().forEach(function (item) {
            total += item.quantity;
        });

        return total;

    }


    function subtotal() {

        var total = 0;

        read().forEach(function (item) {
            total += item.price * item.quantity;
        });

        return total;

    }


    /* =====================================================
       ADD ONE PRODUCT
    ====================================================== */

    function add(product) {

        var cart = read();

        var existing = null;

        cart.forEach(function (item) {

            if (item.id === product.id) {
                existing = item;
            }

        });

        if (existing) {

            if (existing.quantity >= MAX_QUANTITY) {
                return false;
            }

            existing.quantity = existing.quantity + 1;

        } else {

            var safeItem = cleanItem({
                id: product.id,
                name: product.name,
                price: product.price,
                quantity: 1,
                category: product.category,
                image: product.image
            });

            if (!safeItem) {
                return false;
            }

            cart.push(safeItem);

        }

        return write(cart);

    }


    /* =====================================================
       EMPTY THE CART
    ====================================================== */

    function clear() {

        return write([]);

    }


    /* =====================================================
       UPDATE THE HEADER BADGE

       Targets every element with the .cart-count class, so it
       works on all nine pages without any extra markup.
    ====================================================== */

    // Last count shown, so the badge only "pops" when items are added.
    var lastShownCount = null;

    function updateBadge() {

        var total = count();

        var badges = document.querySelectorAll(".cart-count");

        Array.prototype.forEach.call(badges, function (badge) {

            badge.textContent = total;

        });

        if (lastShownCount !== null && total > lastShownCount) {
            Array.prototype.forEach.call(badges, function (badge) {
                badge.classList.remove("is-bumped");
                void badge.offsetWidth; // restart the animation on repeat clicks
                badge.classList.add("is-bumped");
            });
        }

        lastShownCount = total;

    }


    /* =====================================================
       KEEP TABS IN SYNC

       The "storage" event fires in every OTHER open tab when
       localStorage changes, so adding an item in one tab
       updates the badge in the rest.
    ====================================================== */

    window.addEventListener("storage", function (event) {

        if (event.key === CART_KEY) {
            updateBadge();
        }

    });


    /* =====================================================
       DRAW THE BADGE AS SOON AS THE PAGE IS READY
    ====================================================== */

    if (document.readyState === "loading") {

        document.addEventListener("DOMContentLoaded", updateBadge);

    } else {

        updateBadge();

    }


    /* =====================================================
       PUBLIC API
    ====================================================== */

    window.FreshoCart = {
        key: CART_KEY,
        maxQuantity: MAX_QUANTITY,
        isPersistent: storageWorks,
        read: read,
        write: write,
        add: add,
        clear: clear,
        count: count,
        subtotal: subtotal,
        updateBadge: updateBadge
    };

})(window, document);
