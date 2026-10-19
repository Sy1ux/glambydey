function initGlamByDeyStore() {
  const products = window.glamByDeyProducts;
  const productGrid = document.getElementById("product-grid");
  const cartDialog = document.getElementById("cart-dialog");
  const cartItems = document.getElementById("cart-items");
  const cartEmpty = document.getElementById("cart-empty");
  const cartCount = document.querySelector(".cart-count");
  const cartTotal = document.getElementById("cart-total");
  const toast = document.getElementById("toast");
  const menuToggle = document.querySelector(".menu-toggle");
  const siteNav = document.getElementById("site-nav");
  const cart = new Map();
  let toastTimer;

  if (!Array.isArray(products) || !productGrid || !cartDialog || !cartItems || !cartEmpty || !cartCount || !cartTotal || !toast) {
    throw new Error("The GlamByDey store could not be initialized.");
  }

  const formatPrice = (price) => new Intl.NumberFormat("fr-BE", {
    style: "currency",
    currency: "EUR"
  }).format(price);

  function renderProducts(category = "Tous") {
    const visibleProducts = category === "Tous"
      ? products
      : products.filter((product) => product.category === category);
    const fragment = document.createDocumentFragment();

    productGrid.replaceChildren();

    visibleProducts.forEach((product, index) => {
      const card = document.createElement("article");
      card.className = "product-card";

      const imageWrap = document.createElement("div");
      imageWrap.className = "product-image-wrap";

      const image = document.createElement("img");
      image.className = "product-image";
      image.src = product.image;
      image.alt = product.alt;
      image.loading = "lazy";
      image.width = 700;
      image.height = 800;

      const number = document.createElement("span");
      number.className = "product-number";
      number.setAttribute("aria-hidden", "true");
      number.textContent = String(index + 1).padStart(2, "0");

      const addButton = document.createElement("button");
      addButton.className = "add-button";
      addButton.type = "button";
      addButton.dataset.addProduct = product.id;
      addButton.setAttribute("aria-label", `Ajouter ${product.name} au panier`);
      addButton.innerHTML = "<span>Ajouter au panier</span><span aria-hidden=\"true\">＋</span>";

      imageWrap.append(image, number, addButton);

      const meta = document.createElement("div");
      meta.className = "product-meta";

      const name = document.createElement("h3");
      name.className = "product-name";
      name.textContent = product.name;

      const price = document.createElement("span");
      price.className = "product-price";
      price.textContent = formatPrice(product.price);
      meta.append(name, price);

      const productCategory = document.createElement("p");
      productCategory.className = "product-category";
      productCategory.textContent = product.category;
      card.append(imageWrap, meta, productCategory);
      fragment.append(card);
    });

    productGrid.append(fragment);
  }

  document.querySelector(".filter-count").textContent = String(products.length).padStart(2, "0");

  function showToast(message) {
    toast.textContent = message;
    toast.classList.add("is-visible");
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => toast.classList.remove("is-visible"), 2400);
  }

  function renderCart() {
    const entries = Array.from(cart.values());
    const itemCount = entries.reduce((total, entry) => total + entry.quantity, 0);
    const subtotal = entries.reduce((total, entry) => total + entry.product.price * entry.quantity, 0);
    const fragment = document.createDocumentFragment();

    cartItems.replaceChildren();
    cartEmpty.hidden = entries.length > 0;
    cartItems.hidden = entries.length === 0;
    cartCount.textContent = String(itemCount);
    cartCount.setAttribute("aria-label", `${itemCount} article${itemCount === 1 ? "" : "s"}`);
    cartTotal.textContent = formatPrice(subtotal);

    entries.forEach(({ product, quantity }) => {
      const row = document.createElement("article");
      row.className = "cart-item";

      const image = document.createElement("img");
      image.src = product.image;
      image.alt = "";

      const details = document.createElement("div");
      const name = document.createElement("h3");
      name.className = "cart-item-name";
      name.textContent = product.name;

      const price = document.createElement("p");
      price.className = "cart-item-price";
      price.textContent = formatPrice(product.price);

      const controls = document.createElement("div");
      controls.className = "cart-item-controls";

      const decrease = document.createElement("button");
      decrease.className = "quantity-button";
      decrease.type = "button";
      decrease.dataset.changeQuantity = product.id;
      decrease.dataset.changeBy = "-1";
      decrease.setAttribute("aria-label", `Retirer un ${product.name}`);
      decrease.textContent = "−";

      const quantityLabel = document.createElement("span");
      quantityLabel.className = "quantity";
      quantityLabel.textContent = String(quantity);
      quantityLabel.setAttribute("aria-label", `Quantité : ${quantity}`);

      const increase = document.createElement("button");
      increase.className = "quantity-button";
      increase.type = "button";
      increase.dataset.changeQuantity = product.id;
      increase.dataset.changeBy = "1";
      increase.setAttribute("aria-label", `Ajouter un ${product.name}`);
      increase.textContent = "+";

      const remove = document.createElement("button");
      remove.className = "remove-item";
      remove.type = "button";
      remove.dataset.removeProduct = product.id;
      remove.textContent = "Supprimer";

      controls.append(decrease, quantityLabel, increase, remove);
      details.append(name, price, controls);
      row.append(image, details);
      fragment.append(row);
    });

    cartItems.append(fragment);
  }

  document.querySelectorAll(".filter-button").forEach((button) => {
    button.addEventListener("click", () => {
      document.querySelector(".filter-button.is-active")?.classList.remove("is-active");
      document.querySelector(".filter-button[aria-pressed=\"true\"]")?.setAttribute("aria-pressed", "false");
      button.classList.add("is-active");
      button.setAttribute("aria-pressed", "true");
      renderProducts(button.dataset.category);
    });
  });

  productGrid.addEventListener("click", (event) => {
    const button = event.target.closest("[data-add-product]");
    if (!button) return;

    const product = products.find((entry) => entry.id === button.dataset.addProduct);
    if (!product) throw new Error(`Unknown GlamByDey product: ${button.dataset.addProduct}`);

    const entry = cart.get(product.id);
    cart.set(product.id, { product, quantity: entry ? entry.quantity + 1 : 1 });
    renderCart();
    showToast(`${product.name} ajouté au panier`);
  });

  cartItems.addEventListener("click", (event) => {
    const removeButton = event.target.closest("[data-remove-product]");
    if (removeButton) {
      cart.delete(removeButton.dataset.removeProduct);
      renderCart();
      return;
    }

    const quantityButton = event.target.closest("[data-change-quantity]");
    if (!quantityButton) return;

    const productId = quantityButton.dataset.changeQuantity;
    const entry = cart.get(productId);
    if (!entry) return;

    const quantity = entry.quantity + Number(quantityButton.dataset.changeBy);
    if (quantity < 1) {
      cart.delete(productId);
    } else {
      cart.set(productId, { ...entry, quantity });
    }
    renderCart();
  });

  document.querySelector(".cart-trigger").addEventListener("click", () => cartDialog.showModal());
  document.querySelectorAll("[data-close-cart]").forEach((button) => {
    button.addEventListener("click", () => cartDialog.close());
  });

  cartDialog.addEventListener("click", (event) => {
    if (event.target === cartDialog) cartDialog.close();
  });

  menuToggle.addEventListener("click", () => {
    const isExpanded = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!isExpanded));
    menuToggle.setAttribute("aria-label", isExpanded ? "Ouvrir le menu" : "Fermer le menu");
    siteNav.classList.toggle("is-open", !isExpanded);
  });

  siteNav.addEventListener("click", (event) => {
    if (!event.target.closest("a")) return;
    siteNav.classList.remove("is-open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Ouvrir le menu");
  });

  renderProducts();
  renderCart();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initGlamByDeyStore, { once: true });
} else {
  initGlamByDeyStore();
}
