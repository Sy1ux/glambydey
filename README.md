# GlamByDey

Mobile-first French-language beauty storefront inspired by the GlamByDey prototype. Built as a lightweight static site for GitHub Pages.

## Preview

Open `index.html` in a browser or publish the repository with GitHub Pages. The homepage, product filters, mobile navigation, and demo shopping cart work without a build step or external dependencies.

This is a visual storefront preview, not a live shop: the sample catalogue and prices are indicative, and checkout, payments, inventory, shipping, and customer orders are not connected.

## Updating the catalogue from a phone

1. Open this repository on GitHub.com in your phone's browser and sign in.
2. Open `assets/products.js`, tap the pencil icon, and update a product's name, category, price, image path, and alt text. Keep prices as numbers in euros and keep product IDs unique.
3. Commit the change. If GitHub Pages is enabled for the repository, it will publish the updated site automatically.
4. To replace a product photo, upload the image into `assets/products/` using GitHub's **Add file → Upload files**, then enter its path in `assets/products.js`.

Product images and descriptions are rendered from `assets/products.js`; the available category filters are `Teint`, `Yeux`, and `Visage`. Edit `index.html` to update the brand story and other page copy.

## Before launch

- Replace the example product details, sample prices, and reference images with approved brand assets and real product information.
- Connect a commerce platform such as Shopify for secure checkout, real orders, inventory, shipping, and mobile product management.
- Add the real shop and customer-service links once they're available.
