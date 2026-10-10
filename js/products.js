/* =========================================================
   FRESHO PRODUCTS JAVASCRIPT
========================================================= */

document.addEventListener("DOMContentLoaded", function () {


    /* =====================================================
       PRODUCT DATA
    ===================================================== */

    const products = [

        /* FRUITS */

        {
            id: 1,
            name: "Fresh Apple",
            price: 8.50,
            category: "FRUITS",
            unit: "per kg",
            description: "Crisp and naturally sweet apples.",
            image: "https://images.unsplash.com/photo-1579613832125-5d34a13ffe2a?auto=format&fit=crop&w=800&q=85"
        },

        {
            id: 2,
            name: "Banana",
            price: 6.00,
            category: "FRUITS",
            unit: "per kg",
            description: "Naturally sweet and perfect for everyday snacks.",
            image: "https://images.unsplash.com/photo-1481349518771-20055b2a7b24?auto=format&fit=crop&w=800&q=85"
        },

        {
            id: 3,
            name: "Fresh Orange",
            price: 7.50,
            category: "FRUITS",
            unit: "per kg",
            description: "Juicy oranges with a refreshing citrus taste.",
            image: "https://images.unsplash.com/photo-1557800636-894a64c1696f?auto=format&fit=crop&w=800&q=85"
        },

        {
            id: 4,
            name: "Strawberry",
            price: 12.00,
            category: "FRUITS",
            unit: "per pack",
            description: "Fresh and naturally sweet strawberries.",
            image: "https://images.unsplash.com/photo-1601004890684-d8cbf643f5f2?auto=format&fit=crop&w=800&q=85"
        },


        /* VEGETABLES */

        {
            id: 5,
            name: "Fresh Broccoli",
            price: 6.50,
            category: "VEGETABLES",
            unit: "per kg",
            description: "Fresh green broccoli for healthy meals.",
            image: "https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?auto=format&fit=crop&w=800&q=85"
        },

        {
            id: 6,
            name: "Fresh Tomato",
            price: 5.50,
            category: "VEGETABLES",
            unit: "per kg",
            description: "Bright and juicy tomatoes for everyday cooking.",
            image: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=800&q=85"
        },

        {
            id: 7,
            name: "Fresh Carrot",
            price: 4.50,
            category: "VEGETABLES",
            unit: "per kg",
            description: "Crunchy carrots full of natural flavour.",
            image: "https://images.unsplash.com/photo-1522184216316-3c25379f9760?auto=format&fit=crop&w=800&q=85"
        },

        {
            id: 8,
            name: "Fresh Spinach",
            price: 4.00,
            category: "VEGETABLES",
            unit: "per bunch",
            description: "Fresh leafy greens for nutritious meals.",
            image: "https://images.unsplash.com/photo-1574316071802-0d684efa7bf5?auto=format&fit=crop&w=800&q=85"
        },


        /* DAIRY */

        {
            id: 9,
            name: "Fresh Milk",
            price: 8.90,
            category: "DAIRY",
            unit: "1 litre",
            description: "Smooth and fresh milk for everyday use.",
            image: "https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=800&q=85"
        },

        {
            id: 10,
            name: "Greek Yogurt",
            price: 9.50,
            category: "DAIRY",
            unit: "per cup",
            description: "Creamy yogurt with a rich natural taste.",
            image: "https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=800&q=85"
        },

        {
            id: 11,
            name: "Fresh Cheese",
            price: 13.00,
            category: "DAIRY",
            unit: "per pack",
            description: "Creamy cheese for breakfast and cooking.",
            image: "https://images.unsplash.com/photo-1452195100486-9cc805987862?auto=format&fit=crop&w=800&q=85"
        },


        /* PANTRY */

        {
            id: 12,
            name: "White Rice",
            price: 18.00,
            category: "PANTRY",
            unit: "5 kg",
            description: "Quality rice for everyday family meals.",
            image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=85"
        },

        {
            id: 13,
            name: "Whole Wheat Bread",
            price: 7.50,
            category: "PANTRY",
            unit: "per loaf",
            description: "Soft whole wheat bread for everyday meals.",
            image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=85"
        },

        {
            id: 14,
            name: "Pasta",
            price: 6.90,
            category: "PANTRY",
            unit: "per pack",
            description: "Easy-to-cook pasta for quick family meals.",
            image: "https://images.unsplash.com/photo-1551462147-ff29053bfc14?auto=format&fit=crop&w=800&q=85"
        },


        /* BEVERAGES */

        {
            id: 15,
            name: "Fresh Orange Juice",
            price: 9.90,
            category: "BEVERAGES",
            unit: "1 litre",
            description: "Refreshing orange juice with a fresh citrus taste.",
            image: "https://images.unsplash.com/photo-1600271886742-f049cd451bba?auto=format&fit=crop&w=800&q=85"
        },

        {
            id: 16,
            name: "Mineral Water",
            price: 3.50,
            category: "BEVERAGES",
            unit: "1.5 litre",
            description: "Refreshing drinking water for everyday hydration.",
            image: "https://images.unsplash.com/photo-1548839140-29a749e1cf4d?auto=format&fit=crop&w=800&q=85"
        }

    ];


    /* =====================================================
       DOM ELEMENTS
    ===================================================== */

    const productsGrid =
        document.getElementById("productsGrid");

    const searchInput =
        document.getElementById("productSearch");

    const categoryButtons =
        document.querySelectorAll(".category-btn");

    const productCount =
        document.getElementById("productCount");

    const noProducts =
        document.getElementById("noProducts");

    const resetSearch =
        document.getElementById("resetSearch");

    const productsError =
        document.getElementById("productsError");

    const headerCartCount =
        document.getElementById("headerCartCount");



    /* =====================================================
       CURRENT FILTER
    ===================================================== */

    let currentCategory = "ALL";



    /* =====================================================
       ERROR HANDLING
    ===================================================== */

    function showError(message) {

        productsError.textContent = message;

        productsError.style.display = "block";

    }


    function clearError() {

        productsError.textContent = "";

        productsError.style.display = "none";

    }



    /* =====================================================
       LOAD CART
    ===================================================== */

    function getCart() {
        // The shared cart store (js/cart-store.js) checks every saved item,
        // so all pages agree on what is in the cart.
        if (window.FreshoCart) {
            return window.FreshoCart.read();
        }


        try {

            const savedCart =
                localStorage.getItem("freshoCart");

            if (!savedCart) {

                return [];

            }

            const cart =
                JSON.parse(savedCart);

            if (!Array.isArray(cart)) {

                return [];

            }

            return cart;

        } catch (error) {

            showError(
                "Unable to read your shopping cart."
            );

            return [];

        }

    }



    /* =====================================================
       SAVE CART
    ===================================================== */

    function saveCart(cart) {
        if (window.FreshoCart) {
            return window.FreshoCart.write(cart);
        }


        try {

            localStorage.setItem(
                "freshoCart",
                JSON.stringify(cart)
            );

            return true;

        } catch (error) {

            showError(
                "Unable to save your cart. Please try again."
            );

            return false;

        }

    }



    /* =====================================================
       UPDATE CART COUNT
    ===================================================== */

    function updateCartCount() {

        const cart = getCart();

        let totalQuantity = 0;

        cart.forEach(function (item) {

            totalQuantity +=
                Number(item.quantity) || 0;

        });

        headerCartCount.textContent =
            totalQuantity;

    }



    /* =====================================================
       ADD TO CART
    ===================================================== */

    function addToCart(product) {

        clearError();

        try {

            const cart = getCart();

            const existingItem =
                cart.find(function (item) {

                    return item.id === product.id;

                });


            if (existingItem) {

                existingItem.quantity =
                    Number(existingItem.quantity) + 1;

            } else {

                cart.push({

                    id: product.id,

                    name: product.name,

                    price: product.price,

                    quantity: 1,

                    category: product.category,

                    image: product.image

                });

            }


            const saved =
                saveCart(cart);


            if (saved) {

                updateCartCount();

                showAddedMessage(product.id);

            }

        } catch (error) {

            showError(
                "Something went wrong while adding the product."
            );

        }

    }



    /* =====================================================
       BUTTON FEEDBACK
    ===================================================== */

    function showAddedMessage(productId) {

        const button =
            document.querySelector(
                '[data-product-id="' +
                productId +
                '"]'
            );

        if (!button) {

            return;

        }

        const originalText =
            button.textContent;

        button.textContent =
            "✓ Added";

        button.classList.add("added");

        setTimeout(function () {

            button.textContent =
                originalText;

            button.classList.remove("added");

        }, 1200);

    }



    /* =====================================================
       RENDER PRODUCTS
    ===================================================== */

    function renderProducts() {

        clearError();

        productsGrid.innerHTML = "";

        const searchTerm =
            searchInput.value
                .trim()
                .toLowerCase();


        const filteredProducts =
            products.filter(function (product) {

                const matchesCategory =
                    currentCategory === "ALL" ||
                    product.category === currentCategory;


                const matchesSearch =
                    product.name
                        .toLowerCase()
                        .includes(searchTerm) ||

                    product.category
                        .toLowerCase()
                        .includes(searchTerm);


                return (
                    matchesCategory &&
                    matchesSearch
                );

            });


        productCount.textContent =
            filteredProducts.length +
            (
                filteredProducts.length === 1
                    ? " product"
                    : " products"
            );


        if (filteredProducts.length === 0) {

            noProducts.style.display =
                "block";

            productsGrid.style.display =
                "none";

            return;

        }


        noProducts.style.display =
            "none";

        productsGrid.style.display =
            "grid";


        filteredProducts.forEach(
            function (product) {

                const card =
                    document.createElement("article");

                card.className =
                    "product-card";


                /* IMAGE */

                const imageBox =
                    document.createElement("div");

                imageBox.className =
                    "product-image";


                const image =
                    document.createElement("img");

                image.src =
                    product.image;

                image.alt =
                    product.name;

                image.loading =
                    "lazy";


                image.onerror =
                    function () {

                        imageBox.innerHTML =
                            "<span>🥬</span>";

                    };


                const category =
                    document.createElement("span");

                category.className =
                    "product-category";

                category.textContent =
                    product.category;


                imageBox.appendChild(image);

                /* The category label goes inside the info block,
                   above the product name, which is where the home
                   page puts it. It used to sit as a pill over the
                   image, so the same .product-card class rendered
                   two different ways depending on the page. */



                /* INFO */

                const info =
                    document.createElement("div");

                info.className =
                    "product-info";


                const name =
                    document.createElement("h3");

                name.textContent =
                    product.name;


                const description =
                    document.createElement("p");

                description.className =
                    "product-description";

                description.textContent =
                    product.description;


                /* BOTTOM */

                const bottom =
                    document.createElement("div");

                bottom.className =
                    "product-bottom";


                const priceBox =
                    document.createElement("div");


                const price =
                    document.createElement("strong");

                price.className =
                    "product-price";

                price.textContent =
                    "RM " +
                    product.price.toFixed(2);


                const unit =
                    document.createElement("small");

                unit.className =
                    "product-unit";

                unit.textContent =
                    product.unit;


                priceBox.appendChild(price);

                priceBox.appendChild(unit);


                /* ADD BUTTON */

                const addButton =
                    document.createElement("button");

                addButton.type =
                    "button";

                addButton.className =
                    "add-to-cart";

                addButton.dataset.productId =
                    product.id;

                addButton.textContent =
                    "Add to Cart";


                addButton.addEventListener(
                    "click",
                    function () {

                        addToCart(product);

                    }
                );


                bottom.appendChild(priceBox);

                bottom.appendChild(addButton);
                /* SEE MORE BUTTON */

const detailsButton =
    document.createElement("button");

detailsButton.type =
    "button";

detailsButton.className =
    "see-more";

detailsButton.textContent =
    "See More";

detailsButton.addEventListener(
    "click",
    function () {

        const existingDetails =
            info.querySelector(".product-details");

        if (existingDetails) {

            existingDetails.remove();

        } else {

            const detailsBox =
                document.createElement("div");

            detailsBox.className =
                "product-details";

            detailsBox.innerHTML =
                "<h2>" + product.name + "</h2>" +
                "<p><strong>Category:</strong> " +
                product.category + "</p>" +
                "<p><strong>Price:</strong> RM " +
                product.price.toFixed(2) + "</p>" +
                "<p><strong>Unit:</strong> " +
                product.unit + "</p>";

            info.appendChild(detailsBox);
        }

    }
);

bottom.appendChild(detailsButton);
                




                info.appendChild(category);

                info.appendChild(name);

                info.appendChild(description);

                info.appendChild(bottom);


                card.appendChild(imageBox);

                card.appendChild(info);


                productsGrid.appendChild(card);

            }
        );

    }



    /* =====================================================
       CATEGORY FILTER
    ===================================================== */

    categoryButtons.forEach(
        function (button) {

            button.addEventListener(
                "click",
                function () {

                    categoryButtons.forEach(
                        function (btn) {

                            btn.classList.remove(
                                "active"
                            );

                        }
                    );


                    button.classList.add(
                        "active"
                    );


                    currentCategory =
                        button.dataset.category;


                    renderProducts();

                }
            );

        }
    );



    /* =====================================================
       SEARCH
    ===================================================== */

    searchInput.addEventListener(
        "input",
        function () {

            renderProducts();

        }
    );



    /* =====================================================
       RESET SEARCH
    ===================================================== */

    resetSearch.addEventListener(
        "click",
        function () {

            searchInput.value = "";

            currentCategory = "ALL";


            categoryButtons.forEach(
                function (button) {

                    button.classList.remove(
                        "active"
                    );

                }
            );


            document
                .querySelector(
                    '[data-category="ALL"]'
                )
                .classList.add("active");


            renderProducts();

        }
    );



    /* =====================================================
       URL CATEGORY
       Example:
       products.html?category=FRUITS
    ===================================================== */

    const urlParams =
        new URLSearchParams(
            window.location.search
        );

    const urlCategory =
        urlParams.get("category");


    if (urlCategory) {

        const validCategory =
            Array.from(categoryButtons)
                .some(function (button) {

                    return (
                        button.dataset.category ===
                        urlCategory.toUpperCase()
                    );

                });


        if (validCategory) {

            currentCategory =
                urlCategory.toUpperCase();


            categoryButtons.forEach(
                function (button) {

                    button.classList.toggle(
                        "active",
                        button.dataset.category ===
                        currentCategory
                    );

                }
            );

        }

    }



    /* =====================================================
       MOBILE MENU
    ===================================================== */

    const menuButton =
        document.querySelector(
            ".mobile-menu-btn"
        );

    const navigation =
        document.querySelector(
            ".main-nav"
        );


    if (
        menuButton &&
        navigation
    ) {

        menuButton.addEventListener(
            "click",
            function () {

                navigation.classList.toggle(
                    "nav-open"
                );

            }
        );

    }



    /* =====================================================
       INITIAL LOAD
    ===================================================== */

    updateCartCount();

    renderProducts();

});