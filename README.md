# FRESHO – Online Grocery Store

A responsive grocery store website built with plain **HTML, CSS and JavaScript**: no frameworks and no build step.
Shoppers can browse products, fill a cart that is saved across every page, check out with tax and delivery worked
out automatically, total up a shopping list with a calculator, and plan their groceries for the week.

**Live demo:** https://maksudaakhtertumpa.github.io/FRESHO/

![HTML](https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white) ![CSS](https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white) ![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black)

<!-- Add a screenshot: save one as docs/home.png and uncomment the next line -->
<!-- ![FRESHO home page](docs/home.png) -->

## Pages

| Page | What it does |
|---|---|
| Home | Hero, shop-by-category links and "fresh picks" with add-to-cart |
| Products | 16 products with live search and category filters (`products.html?category=FRUITS` opens a filtered view) |
| Cart | Change quantities or remove items; subtotal, 6% SST, delivery and total update instantly |
| Checkout | Delivery form with validation; placing an order clears the cart |
| Calculator | Add item rows (name, price, quantity) and a tax rate; validates every row and shows subtotal, tax and final amount. Can load the current cart |
| Planner | Plan grocery items for each day of the week, tick them off and see a weekly overview |
| Offers | Discount codes with one-click copy, filtered by category |
| Tips, About, Contact | Freshness tips, store information, and a contact form with validation |

## How it works

- **One shared cart.** `js/cart-store.js` is the only code that reads or writes the cart in `localStorage` (key
  `freshoCart`). Every page loads it, so the cart badge in the header is correct everywhere. Saved data is checked
  when it is read back, so a damaged or edited entry is dropped instead of breaking the totals. If storage is blocked
  (for example in private browsing), it falls back to an in-memory cart.
- **Pricing rules** live in one place per page: 6% sales tax, RM5 delivery, free delivery on orders of RM80 and above.
- **Form validation** shows errors per field, only after the user leaves a field or submits, and clears them as soon
  as the field becomes valid. Typing in one row never hides the error on another.
- **Responsive layout** using CSS variables, flexbox and grid, with a mobile menu on small screens.

## Run it locally

No installation needed. Open `index.html` in a browser, or serve the folder so links behave like a real site:

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

## Project structure

```text
index.html, products.html, cart.html, checkout.html, calculator.html,
planner.html, offers.html, tips.html, about.html, contact.html
css/   one stylesheet per page, plus style.css for shared layout and colours
js/    page scripts, plus cart-store.js (the shared cart); the home and cart pages keep theirs inside the HTML
```

## Credits

Built by **Maksuda Akther Tumpa** as a university project at the University of Cyberjaya.
Product photos are from [Unsplash](https://unsplash.com) and are loaded from their servers; fonts are DM Sans and
Playfair Display from Google Fonts.

## License

Code: [MIT](LICENSE). The photos belong to their Unsplash photographers and are covered by the Unsplash License.
