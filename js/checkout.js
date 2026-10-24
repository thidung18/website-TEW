document.addEventListener("DOMContentLoaded", () => {
    const checkoutItemsElement = document.getElementById("checkout-items");
    const errorElement = document.getElementById("checkout-error");
    const subtotalElement = document.getElementById("checkout-subtotal");
    const shippingElement = document.getElementById("checkout-shipping");
    const totalElement = document.getElementById("checkout-total");
    const payButton = document.querySelector(".order-summary-panel button[type='submit']");
    const expressShipping = document.getElementById("expressShipping");

    if (!checkoutItemsElement || !errorElement || !subtotalElement || !shippingElement || !totalElement) return;

    function formatPrice(price) {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD"
        }).format(price);
    }

    function getProductPrice(product) {
        const price = Number.parseFloat(product.price.replace(/[$,\s]/g, ""));
        if (!Number.isFinite(price)) {
            throw new Error(`Invalid price for product "${product.title}".`);
        }
        return price;
    }

    function renderOrder(items) {
        const rows = [];
        let subtotal = 0;

        items.forEach((item) => {
            const product = productsData[item.id];
            const price = getProductPrice(product);
            const row = document.createElement("div");
            row.className = "bg-dark bg-opacity-50 p-3 rounded d-flex align-items-center justify-content-between gap-3 border border-secondary border-opacity-25 order-summary-item";

            const productInfo = document.createElement("div");
            productInfo.className = "d-flex align-items-center gap-3";

            const imageFrame = document.createElement("div");
            imageFrame.className = "bg-dark rounded p-1 d-flex align-items-center justify-content-center";
            imageFrame.style.cssText = "width: 70px; height: 70px; flex-shrink: 0;";

            const image = document.createElement("img");
            image.src = product.mainImage;
            image.alt = product.title;
            image.className = "img-fluid object-fit-contain h-100";
            imageFrame.appendChild(image);

            const details = document.createElement("div");
            details.className = "order-summary-item-details";

            const title = document.createElement("h3");
            title.className = "serif-font fs-6 text-white m-0";
            title.textContent = product.title;

            const reference = document.createElement("div");
            reference.className = "text-secondary extra-small";
            reference.textContent = `Ref. ${product.reference}`;

            const lineTotal = document.createElement("span");
            lineTotal.className = "text-brand-green fw-semibold small";
            lineTotal.textContent = formatPrice(price * item.quantity);
            details.append(title, reference, lineTotal);

            const quantity = document.createElement("span");
            quantity.className = "badge bg-secondary text-white fw-normal";
            quantity.textContent = `x${item.quantity}`;

            productInfo.append(imageFrame, details);
            row.append(productInfo, quantity);
            rows.push(row);
            subtotal += price * item.quantity;
        });

        checkoutItemsElement.replaceChildren(...rows);
        subtotalElement.textContent = formatPrice(subtotal);
        updateTotals(subtotal);
    }

    function updateTotals(subtotal) {
        const shipping = expressShipping && expressShipping.checked ? 20 : 0;
        shippingElement.textContent = formatPrice(shipping);
        totalElement.textContent = formatPrice(subtotal + shipping);
    }

    try {
        if (typeof productsData === "undefined") {
            throw new Error("Product data is unavailable.");
        }

        const savedItems = sessionStorage.getItem("tew-checkout-items");
        if (savedItems === null) {
            throw new Error("No products were selected for checkout.");
        }

        const items = JSON.parse(savedItems);
        const hasInvalidItem = !Array.isArray(items)
            || items.length === 0
            || items.some((item) =>
                !item
                || typeof item.id !== "string"
                || !Number.isSafeInteger(item.quantity)
                || item.quantity <= 0
                || !Object.hasOwn(productsData, item.id)
            );
        if (hasInvalidItem) {
            throw new Error("Checkout contains invalid products or quantities.");
        }

        renderOrder(items);
        if (payButton) payButton.disabled = false;
    } catch (error) {
        errorElement.textContent = "Unable to load checkout items. Return to your cart and select products to try again.";
        errorElement.classList.remove("d-none");
        console.error("Unable to load checkout items.", error);
        if (payButton) payButton.disabled = true;
    }

    if (expressShipping) {
        expressShipping.addEventListener("change", () => {
            const subtotal = Number.parseFloat(subtotalElement.textContent.replace(/[$,\s]/g, ""));
            if (!Number.isFinite(subtotal)) {
                errorElement.textContent = "Unable to update the order total.";
                errorElement.classList.remove("d-none");
                console.error("Unable to update checkout total: subtotal is invalid.");
                return;
            }
            updateTotals(subtotal);
        });
    }
});
