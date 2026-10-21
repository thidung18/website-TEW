const cartStorageKey = "tew-cart";

function readCart() {
    const savedCart = localStorage.getItem(cartStorageKey);
    if (savedCart === null) return [];

    const cart = JSON.parse(savedCart);
    if (!Array.isArray(cart)) {
        throw new Error("Saved cart data is invalid.");
    }

    const hasInvalidItem = cart.some((item) =>
        !item
        || typeof item.id !== "string"
        || !Number.isSafeInteger(item.quantity)
        || item.quantity <= 0
        || typeof productsData === "undefined"
        || !Object.hasOwn(productsData, item.id)
    );
    if (hasInvalidItem) {
        throw new Error("Saved cart contains invalid products or quantities.");
    }

    return cart;
}

function saveCart(cart) {
    localStorage.setItem(cartStorageKey, JSON.stringify(cart));
}

function getProductPrice(product) {
    const price = Number.parseFloat(product.price.replace(/[$,\s]/g, ""));
    if (!Number.isFinite(price)) {
        throw new Error(`Invalid price for product "${product.title}".`);
    }
    return price;
}

function formatCartPrice(price) {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD"
    }).format(price);
}

document.addEventListener("DOMContentLoaded", () => {
    const addToCartButtons = document.querySelectorAll("[data-add-to-cart]");
    const addFeedback = document.getElementById("cart-add-feedback");

    addToCartButtons.forEach((button) => {
        button.addEventListener("click", () => {
            const productId = new URLSearchParams(window.location.search).get("id") || "1";
            const product = typeof productsData !== "undefined" ? productsData[productId] : null;

            if (!product) {
                if (addFeedback) addFeedback.textContent = "This product could not be added to your cart.";
                return;
            }

            let cart;
            try {
                cart = readCart();
                const cartItem = cart.find((item) => item.id === productId);
                if (cartItem) {
                    cartItem.quantity += 1;
                } else {
                    cart.push({ id: productId, quantity: 1 });
                }
                saveCart(cart);
            } catch (error) {
                if (addFeedback) addFeedback.textContent = "Unable to save your cart. Please try again.";
                console.error("Unable to update the shopping cart.", error);
                return;
            }

            if (button.hasAttribute("data-buy-now")) {
                window.location.href = "cart.html";
                return;
            }

            if (addFeedback) addFeedback.textContent = `${product.title} added to your cart.`;
        });
    });

    const cartItems = document.getElementById("cart-items");
    if (!cartItems) return;

    const errorMessage = document.getElementById("cart-error");
    const subtotalElement = document.getElementById("cart-subtotal");
    const totalElement = document.getElementById("cart-total");

    function showCartError(message) {
        if (!errorMessage) return;
        errorMessage.textContent = message;
        errorMessage.classList.remove("d-none");
    }

    function createQuantityButton(label, action, productId, disabled = false) {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "btn btn-outline-secondary text-white";
        button.textContent = label;
        button.dataset.cartAction = action;
        button.dataset.productId = productId;
        button.disabled = disabled;
        button.setAttribute("aria-label", `${action === "decrease" ? "Decrease" : "Increase"} quantity`);
        return button;
    }

    function createCartItem(item) {
        const product = productsData[item.id];
        const price = getProductPrice(product);
        const lineTotal = formatCartPrice(price * item.quantity);
        const row = document.createElement("article");
        row.className = "cart-item-row bg-secondary bg-opacity-25 p-3 rounded d-flex flex-column flex-sm-row align-items-center justify-content-between gap-3";

        const productInfo = document.createElement("div");
        productInfo.className = "d-flex align-items-center gap-3 w-100 flex-sm-grow-1";

        const imageFrame = document.createElement("div");
        imageFrame.className = "bg-dark rounded p-2 d-flex align-items-center justify-content-center";
        imageFrame.style.cssText = "width: 100px; height: 100px; flex-shrink: 0;";

        const image = document.createElement("img");
        image.src = product.mainImage;
        image.alt = product.title;
        image.className = "img-fluid object-fit-contain h-100";
        imageFrame.appendChild(image);

        const details = document.createElement("div");
        details.className = "flex-grow-1";
        const brand = document.createElement("h2");
        brand.className = "serif-font fs-5 text-brand-green m-0";
        brand.textContent = product.collection.replace(/\s+COLLECTION$/, "");
        const title = document.createElement("p");
        title.className = "text-light small mb-1";
        title.textContent = product.title;
        const reference = document.createElement("span");
        reference.className = "text-secondary small d-block";
        reference.textContent = `Ref. ${product.reference}`;
        const mobilePrice = document.createElement("span");
        mobilePrice.className = "fw-semibold text-white d-sm-none mt-2 d-block";
        mobilePrice.textContent = lineTotal;
        details.append(brand, title, reference, mobilePrice);
        productInfo.append(imageFrame, details);

        const controls = document.createElement("div");
        controls.className = "cart-item-controls d-flex align-items-center justify-content-end w-100 w-sm-auto flex-sm-grow-1 gap-3";

        const quantityContainer = document.createElement("div");
        quantityContainer.className = "cart-quantity-container d-flex justify-content-center";
        const quantityGroup = document.createElement("div");
        quantityGroup.className = "input-group input-group-sm";
        quantityGroup.style.width = "130px";
        const decreaseButton = createQuantityButton("-", "decrease", item.id, item.quantity <= 1);
        const quantityInput = document.createElement("input");
        quantityInput.type = "text";
        quantityInput.inputMode = "numeric";
        quantityInput.pattern = "[0-9]*";
        quantityInput.value = String(item.quantity);
        quantityInput.className = "form-control text-center bg-transparent text-white border-secondary";
        quantityInput.dataset.cartQuantity = item.id;
        quantityInput.setAttribute("aria-label", `Quantity for ${product.title}`);
        const increaseButton = createQuantityButton("+", "increase", item.id);
        quantityGroup.append(decreaseButton, quantityInput, increaseButton);
        quantityContainer.appendChild(quantityGroup);

        const priceAndRemove = document.createElement("div");
        priceAndRemove.className = "d-flex align-items-center gap-3";
        const desktopPrice = document.createElement("span");
        desktopPrice.className = "fw-semibold text-white fs-5 d-none d-sm-block";
        desktopPrice.style.cssText = "min-width: 90px; text-align: right;";
        desktopPrice.textContent = lineTotal;

        const removeButton = document.createElement("button");
        removeButton.type = "button";
        removeButton.className = "btn btn-link text-secondary text-hover-white p-1";
        removeButton.dataset.cartAction = "remove";
        removeButton.dataset.productId = item.id;
        removeButton.setAttribute("aria-label", `Remove ${product.title} from cart`);
        const removeIcon = document.createElement("i");
        removeIcon.className = "fa-solid fa-xmark fs-5";
        removeIcon.setAttribute("aria-hidden", "true");
        removeButton.appendChild(removeIcon);

        priceAndRemove.append(desktopPrice, removeButton);
        controls.append(quantityContainer, priceAndRemove);
        row.append(productInfo, controls);
        return { row, lineTotal: price * item.quantity };
    }

    function renderCart(cart) {
        const rows = [];
        let subtotal = 0;

        cart.forEach((item) => {
            const product = productsData[item.id];
            if (!product) return;
            const renderedItem = createCartItem(item);
            rows.push(renderedItem.row);
            subtotal += renderedItem.lineTotal;
        });

        cartItems.replaceChildren(...rows);
        if (rows.length === 0) {
            const emptyMessage = document.createElement("p");
            emptyMessage.className = "text-secondary text-center py-4";
            emptyMessage.textContent = "Your cart is empty.";
            cartItems.appendChild(emptyMessage);
        }

        const formattedSubtotal = formatCartPrice(subtotal);
        if (subtotalElement) subtotalElement.textContent = formattedSubtotal;
        if (totalElement) totalElement.textContent = formattedSubtotal;
    }

    let cart;
    try {
        cart = readCart();
        renderCart(cart);
    } catch (error) {
        showCartError("Unable to load your cart. Please refresh the page or try again.");
        console.error("Unable to load the shopping cart.", error);
        return;
    }

    cartItems.addEventListener("click", (event) => {
        if (!(event.target instanceof Element)) return;
        const actionButton = event.target.closest("[data-cart-action]");
        if (!actionButton) return;

        const { cartAction, productId } = actionButton.dataset;
        const item = cart.find((cartItem) => cartItem.id === productId);
        if (!item) return;

        if (cartAction === "remove") {
            cart = cart.filter((cartItem) => cartItem.id !== productId);
        } else if (cartAction === "increase") {
            item.quantity += 1;
        } else if (cartAction === "decrease" && item.quantity > 1) {
            item.quantity -= 1;
        }

        saveCart(cart);
        renderCart(cart);
    });

    cartItems.addEventListener("change", (event) => {
        if (!(event.target instanceof HTMLInputElement) || !event.target.matches("[data-cart-quantity]")) return;
        const item = cart.find((cartItem) => cartItem.id === event.target.dataset.cartQuantity);
        if (!item) return;

        const quantity = Number(event.target.value);
        item.quantity = Number.isSafeInteger(quantity) && quantity > 0 ? quantity : 1;
        saveCart(cart);
        renderCart(cart);
    });
});
