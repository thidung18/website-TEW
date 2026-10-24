function addProductCardActions(root) {
    root.querySelectorAll(
        "[data-brand-grid] [data-brand], [data-timepiece-grid] [data-timepiece-category], [data-blog-grid] [data-blog-category], #all-products-grid [data-brand]"
    ).forEach((card) => {
        if (card.querySelector(".product-card-actions")) return;

        const image = card.querySelector(".common-watch-image");
        const productId = image && image.dataset.productId;
        const productLink = card.querySelector("a");
        const productPanel = productLink && productLink.firstElementChild;
        if (!productId || !productLink || !productPanel) return;

        const actions = document.createElement("div");
        actions.className = "product-card-actions";

        const feedback = document.createElement("span");
        feedback.className = "small text-brand-green product-card-feedback";
        feedback.dataset.productFeedback = "";
        feedback.setAttribute("role", "status");
        feedback.setAttribute("aria-live", "polite");
        actions.appendChild(feedback);

        const buttons = document.createElement("div");
        buttons.className = "d-flex gap-2";

        const addButton = document.createElement("button");
        addButton.type = "button";
        addButton.className = "btn btn-emerald product-card-action-button";
        addButton.dataset.addToCart = "";
        addButton.dataset.productId = productId;
        addButton.textContent = "Add to Cart";

        const buyButton = document.createElement("button");
        buyButton.type = "button";
        buyButton.className = "btn btn-outline-light product-card-action-button";
        buyButton.dataset.addToCart = "";
        buyButton.dataset.buyNow = "";
        buyButton.dataset.productId = productId;
        buyButton.textContent = "Buy Now";

        buttons.append(addButton, buyButton);
        actions.appendChild(buttons);

        const productDetailsLink = document.createElement("a");
        productDetailsLink.href = productLink.href;
        productDetailsLink.className = "text-decoration-none d-block flex-grow-1";
        while (productPanel.firstChild) {
            productDetailsLink.appendChild(productPanel.firstChild);
        }

        productPanel.classList.add("product-card-actions-host");
        productPanel.replaceChildren(productDetailsLink, actions);
        productLink.replaceWith(productPanel);
    });
}

addProductCardActions(document);

const allProductsGrid = document.getElementById("all-products-grid");
if (allProductsGrid) {
    new MutationObserver(() => addProductCardActions(allProductsGrid)).observe(allProductsGrid, {
        childList: true
    });
}
