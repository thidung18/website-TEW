/**
 * TEW - Timeless Elegance Watches
 * Main Shared JavaScript File with Interactive Effects (common.js)
 */

document.addEventListener('DOMContentLoaded', function () {

    /* ==========================================================================
       1. AUTO-ACTIVE NAVIGATION MENU (Header & Mobile Offcanvas)
       ========================================================================== */
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-link-custom');

    navLinks.forEach(link => {
        const linkHref = link.getAttribute('href');
        if (linkHref === currentPath || (currentPath === '' && linkHref === 'index.html')) {
            link.classList.add('text-white', 'fw-semibold');
        }
    });

    /* ==========================================================================
       2. SMOOTH SCROLL FOR INTERNAL LINKS (#id)
       ========================================================================== */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId && targetId !== '#') {
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    e.preventDefault();
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });

    /* ==========================================================================
       3. HEADER SHADOW ON SCROLL
       ========================================================================== */
    const header = document.querySelector('header');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('shadow-lg', 'bg-dark');
                header.style.transition = 'all 0.3s ease';
            } else {
                header.classList.remove('shadow-lg', 'bg-dark');
            }
        });
    }

    /* ==========================================================================
       4. SCROLL REVEAL ANIMATION (Xuất hiện mượt khi cuộn)
       ========================================================================== */
    const revealElements = document.querySelectorAll('section, .bg-brand-card, article, footer');
    
    // Thêm CSS động cho hiệu ứng reveal
    const styleSheet = document.createElement('style');
    styleSheet.textContent = `
        .tew-reveal {
            opacity: 0;
            transform: translateY(30px);
            transition: opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
            will-change: opacity, transform;
        }
        .tew-reveal.tew-active {
            opacity: 1;
            transform: translateY(0);
        }
        #backToTopBtn {
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s ease;
        }
        #backToTopBtn.show {
            opacity: 1;
            visibility: visible;
        }
        .bg-brand-card {
            transition: transform 0.3s ease, box-shadow 0.3s ease !important;
        }
        .bg-brand-card:hover {
            transform: translateY(-6px) !important;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.5) !important;
        }
    `;
    document.head.appendChild(styleSheet);

    revealElements.forEach(el => el.classList.add('tew-reveal'));

    const revealOnScroll = () => {
        const windowHeight = window.innerHeight;
        revealElements.forEach(el => {
            const elementTop = el.getBoundingClientRect().top;
            if (elementTop < windowHeight - 80) {
                el.classList.add('tew-active');
            }
        });
    };

    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll(); // Chạy 1 lần ban đầu khi load trang

    /* ==========================================================================
       5. BACK TO TOP BUTTON
       ========================================================================== */
    const backToTopBtn = document.createElement('button');
    backToTopBtn.id = 'backToTopBtn';
    backToTopBtn.className = 'btn btn-emerald rounded-circle position-fixed bottom-0 start-0 m-3 m-md-4 shadow-lg d-flex align-items-center justify-content-center z-3';
    backToTopBtn.style.width = '45px';
    backToTopBtn.style.height = '45px';
    backToTopBtn.setAttribute('aria-label', 'Back to Top');
    backToTopBtn.innerHTML = '<i class="fa-solid fa-arrow-up text-white fs-6"></i>';
    document.body.appendChild(backToTopBtn);

    window.addEventListener('scroll', () => {
        if (window.scrollY > 400) {
            backToTopBtn.classList.add('show');
        } else {
            backToTopBtn.classList.remove('show');
        }
    });

    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    /* ==========================================================================
       6. FEATURED BRAND FILTERING (Rolex, Patek Philippe, Omega)
       ========================================================================== */
    const brandFilters = document.querySelectorAll("[data-brand-filter]");
    const brandCards = document.querySelectorAll("[data-brand-grid] [data-brand]");

    if (brandFilters.length > 0 && brandCards.length > 0) {
        brandFilters.forEach((filter) => {
            filter.addEventListener("click", () => {
                const selectedBrand = filter.dataset.brandFilter;

                brandCards.forEach((card) => {
                    const isMatch = card.dataset.brand === selectedBrand;
                    if (isMatch) {
                        card.classList.remove("d-none");
                        setTimeout(() => card.classList.add("tew-active"), 50);
                    } else {
                        card.classList.add("d-none");
                    }
                });

                brandFilters.forEach((button) => {
                    const isActive = button.dataset.brandFilter === selectedBrand;
                    button.setAttribute("aria-pressed", String(isActive));
                    button.classList.toggle("text-brand-purple", isActive);
                    button.classList.toggle("fw-medium", isActive);
                    button.classList.toggle("text-secondary", !isActive);
                    button.classList.toggle("pb-2", !isActive);
                    button.classList.toggle("d-flex", isActive);
                    button.classList.toggle("flex-column", isActive);
                    button.classList.toggle("align-items-center", isActive);

                    const accent = button.querySelector(".common-section-accent");
                    if (accent) {
                        accent.classList.toggle("d-none", !isActive);
                    }
                });
            });
        });
    }

    /* ==========================================================================
       7. TIMEPIECE CATEGORY FILTERING (Featured, New arrivals, Bestseller)
       ========================================================================== */
    const timepieceFilters = document.querySelectorAll("[data-timepiece-filter]");
    const timepieceCards = document.querySelectorAll("[data-timepiece-grid] [data-timepiece-category]");

    if (timepieceFilters.length > 0 && timepieceCards.length > 0) {
        timepieceFilters.forEach((filter) => {
            filter.addEventListener("click", () => {
                const selectedCategory = filter.dataset.timepieceFilter;

                timepieceCards.forEach((card) => {
                    const isMatch = card.dataset.timepieceCategory === selectedCategory;
                    if (isMatch) {
                        card.classList.remove("d-none");
                        setTimeout(() => card.classList.add("tew-active"), 50);
                    } else {
                        card.classList.add("d-none");
                    }
                });

                timepieceFilters.forEach((button) => {
                    const isActive = button.dataset.timepieceFilter === selectedCategory;
                    button.setAttribute("aria-pressed", String(isActive));
                    button.classList.toggle("text-brand-purple", isActive);
                    button.classList.toggle("fw-medium", isActive);
                    button.classList.toggle("text-secondary", !isActive);
                    button.classList.toggle("pb-2", !isActive);
                    button.classList.toggle("d-flex", isActive);
                    button.classList.toggle("flex-column", isActive);
                    button.classList.toggle("align-items-center", isActive);

                    const accent = button.querySelector(".common-section-accent");
                    if (accent) {
                        accent.classList.toggle("d-none", !isActive);
                    }
                });
            });
        });
    }

    /* ==========================================================================
       7. PRODUCT PAGE BLOG / COLLECTION FILTERING
       ========================================================================== */
    const productBlogFilters = document.querySelectorAll("[data-blog-filter]");
    const productBlogCards = document.querySelectorAll("[data-blog-grid] [data-blog-category]");

    if (productBlogFilters.length > 0 && productBlogCards.length > 0) {
        productBlogFilters.forEach((filter) => {
            filter.addEventListener("click", () => {
                const selectedCategory = filter.dataset.blogFilter;

                productBlogCards.forEach((card) => {
                    const isMatch = card.dataset.blogCategory === selectedCategory;
                    card.classList.toggle("d-none", !isMatch);
                    card.classList.remove("tew-active");
                    if (isMatch) {
                        setTimeout(() => card.classList.add("tew-active"), 50);
                    }
                });

                productBlogFilters.forEach((button) => {
                    const isActive = button === filter;
                    button.setAttribute("aria-pressed", String(isActive));
                    button.classList.toggle("text-brand-purple", isActive);
                    button.classList.toggle("fw-medium", isActive);
                    button.classList.toggle("text-secondary", !isActive);
                    button.classList.toggle("pb-2", !isActive);
                    button.classList.toggle("d-flex", isActive);
                    button.classList.toggle("flex-column", isActive);
                    button.classList.toggle("align-items-center", isActive);

                    const accent = button.querySelector(".common-section-accent");
                    if (accent) {
                        accent.classList.toggle("d-none", !isActive);
                    }
                });
            });
        });
    }

    /* ==========================================================================
       8. BLOG ARTICLE CATEGORY FILTERING
       ========================================================================== */
    const blogFilters = document.querySelectorAll("[data-blog-category-filter]");
    const blogArticles = document.querySelectorAll("[data-blog-category-item]");

    if (blogFilters.length > 0 && blogArticles.length > 0) {
        blogFilters.forEach((filter) => {
            filter.addEventListener("click", () => {
                const selectedCategory = filter.dataset.blogCategoryFilter;

                blogArticles.forEach((article) => {
                    const isMatch = selectedCategory === "all"
                        || article.dataset.blogCategoryItem === selectedCategory;
                    article.classList.toggle("d-none", !isMatch);
                });

                document.querySelectorAll("[data-blog-column]").forEach((column) => {
                    const hasVisibleArticle = column.matches("[data-blog-category-item]:not(.d-none)")
                        || column.querySelector("[data-blog-category-item]:not(.d-none)");
                    column.classList.toggle("d-none", !hasVisibleArticle);
                });

                blogFilters.forEach((button) => {
                    const isActive = button === filter;
                    button.setAttribute("aria-pressed", String(isActive));
                    button.classList.toggle("text-brand-purple", isActive);
                    button.classList.toggle("fw-medium", isActive);
                    button.classList.toggle("text-secondary", !isActive);
                    button.classList.toggle("pb-2", !isActive);
                    button.classList.toggle("d-flex", isActive);
                    button.classList.toggle("flex-column", isActive);
                    button.classList.toggle("align-items-center", isActive);

                    const accent = button.querySelector(".common-section-accent");
                    if (accent) {
                        accent.classList.toggle("d-none", !isActive);
                    } else if (isActive) {
                        const indicator = document.createElement("span");
                        indicator.className = "d-block mt-2 common-section-accent";
                        indicator.setAttribute("aria-hidden", "true");
                        button.append(indicator);
                    }
                });
            });
        });
    }

    /* ==========================================================================
       9. URL SEARCH PARAMS HANDLER
       ========================================================================== */
    const searchParams = new URLSearchParams(window.location.search);
    const brandParam = searchParams.get("brand");
    const timepieceParam = searchParams.get("timepiece");

    if (brandParam) {
        const requestedBrandFilter = document.querySelector(`[data-brand-filter="${brandParam}"]`);
        if (requestedBrandFilter) requestedBrandFilter.click();
    }

    if (timepieceParam) {
        const requestedTimepieceFilter = document.querySelector(`[data-timepiece-filter="${timepieceParam}"]`);
        if (requestedTimepieceFilter) requestedTimepieceFilter.click();
    }

    /* ==========================================================================
       10. PRODUCT DETAIL SIZE AND DIAL COLOR OPTIONS
       ========================================================================== */
    const mainWatchImage = document.querySelector(".main-watch-image");
    const dialColorSpecification = document.getElementById("dialColorSpecification");
    const dialColorOptions = Array.from(document.querySelectorAll(".dial-color-option"));
    const dialColorThumbnails = Array.from(document.querySelectorAll("[data-dial-color]"));

    if (mainWatchImage && dialColorOptions.length && dialColorThumbnails.length) {
        function selectDialColor(option) {
            const optionIndex = dialColorOptions.indexOf(option);
            const thumbnail = dialColorThumbnails[optionIndex]?.querySelector("img");
            if (!thumbnail) return;

            mainWatchImage.src = thumbnail.src;
            mainWatchImage.alt = thumbnail.alt;
            if (dialColorSpecification) {
                dialColorSpecification.textContent = option.value;
            }
        }

        dialColorOptions.forEach((option) => {
            option.addEventListener("change", () => selectDialColor(option));
        });

        const selectedDialColor = dialColorOptions.find((option) => option.checked);
        if (selectedDialColor) {
            selectDialColor(selectedDialColor);
        }
    }

    const caseSizeOptions = Array.from(document.querySelectorAll(".case-size-option"));
    const caseDiameterSpecification = document.getElementById("caseDiameterSpecification");

    if (caseSizeOptions.length && caseDiameterSpecification) {
        caseSizeOptions.forEach((option) => {
            option.addEventListener("click", () => {
                caseSizeOptions.forEach((sizeOption) => {
                    const isSelected = sizeOption === option;
                    sizeOption.classList.toggle("active", isSelected);
                    sizeOption.classList.toggle("btn-outline-light", isSelected);
                    sizeOption.classList.toggle("btn-outline-secondary", !isSelected);
                    sizeOption.setAttribute("aria-pressed", String(isSelected));
                });

                caseDiameterSpecification.textContent = `${option.dataset.caseSize} mm`;
            });
        });
    }

    /* ==========================================================================
       10. TEW CHATBOT WIDGET CONTROLLER
       ========================================================================== */
    if (!document.getElementById('tewChatbotToggleBtn')) {
        document.body.insertAdjacentHTML('beforeend', `
            <div class="tew-chatbot">
                <button id="tewChatbotToggleBtn" class="btn btn-emerald rounded-circle shadow-lg d-flex align-items-center justify-content-center tew-chatbot-toggle" type="button" aria-label="Open chat" aria-expanded="false">
                    <i class="fa-solid fa-comments fs-3 text-white" aria-hidden="true"></i>
                </button>
                <section id="tewChatbotWindow" class="tew-chatbot-window rounded-4 overflow-hidden shadow-lg border border-secondary border-opacity-25 d-none flex-column" aria-label="TEW chat">
                    <header class="bg-brand-header p-3 text-white d-flex align-items-center justify-content-between border-bottom border-success-subtle border-opacity-10">
                        <div class="d-flex align-items-center gap-3">
                            <img src="img/logo.png" alt="TEW" class="rounded-circle border border-2 border-white bg-dark p-1 tew-chatbot-logo">
                            <div>
                                <h2 class="serif-font fw-bold m-0 text-white tew-chatbot-title">Timeless Elegance Watches</h2>
                                <small class="text-light opacity-75">Online assistance</small>
                            </div>
                        </div>
                        <button id="tewChatbotCloseBtn" type="button" class="btn btn-link text-white p-1" aria-label="Close chat">
                            <i class="fa-solid fa-chevron-down fs-5" aria-hidden="true"></i>
                        </button>
                    </header>
                    <div class="flex-grow-1 p-3 overflow-y-auto d-flex flex-column gap-3 tew-chatbot-messages" aria-live="polite">
                        <div class="d-flex align-items-start gap-2">
                            <img src="img/logo.png" alt="" class="rounded-circle bg-dark p-1 border border-secondary border-opacity-25 tew-chatbot-avatar">
                            <div class="bg-white text-dark p-2 px-3 rounded-3 shadow-sm">
                                <span class="fw-bold d-block text-uppercase extra-small text-muted mb-1">TEW</span>
                    Hello! I can help you with watches, brands, pricing, shipping, warranty, or returns.
                            </div>
                        </div>
                        <div class="d-flex align-items-start gap-2">
                            <img src="img/logo.png" alt="" class="rounded-circle bg-dark p-1 border border-secondary border-opacity-25 tew-chatbot-avatar">
                            <div class="d-flex flex-column align-items-start gap-2">
                                <button type="button" class="btn btn-light btn-sm" data-chat-question="Explore watches">Explore watches</button>
                                <button type="button" class="btn btn-light btn-sm" data-chat-question="Browse our brands">Browse our brands</button>
                    <button type="button" class="btn btn-light btn-sm" data-chat-question="Shipping and returns">Shipping and returns</button>
                            </div>
                        </div>
                    </div>
                    <form class="p-2 bg-white border-top border-secondary border-opacity-10 d-flex align-items-center gap-2" data-chat-form>
                        <input type="text" class="form-control border-0 bg-transparent text-dark shadow-none px-1" placeholder="Type your message..." aria-label="Message" autocomplete="off">
                        <button type="submit" class="btn btn-emerald rounded-circle p-2 d-flex align-items-center justify-content-center text-white tew-chatbot-send" aria-label="Send message">
                            <i class="fa-solid fa-paper-plane extra-small" aria-hidden="true"></i>
                        </button>
                    </form>
                </section>
            </div>
        `);
    }

    const toggleBtn = document.getElementById('tewChatbotToggleBtn');
    const closeBtn = document.getElementById('tewChatbotCloseBtn');
    const chatbotWindow = document.getElementById('tewChatbotWindow');

    if (toggleBtn && closeBtn && chatbotWindow) {
        const chatBody = chatbotWindow.querySelector('.overflow-y-auto');
        const chatInput = chatbotWindow.querySelector('input[type="text"]');

        toggleBtn.addEventListener('click', function () {
            chatbotWindow.classList.remove('d-none');
            chatbotWindow.classList.add('d-flex');
            toggleBtn.classList.add('d-none');
            toggleBtn.setAttribute('aria-expanded', 'true');
            if (chatInput) chatInput.focus();
        });

        closeBtn.addEventListener('click', function () {
            chatbotWindow.classList.remove('d-flex');
            chatbotWindow.classList.add('d-none');
            toggleBtn.classList.remove('d-none');
            toggleBtn.setAttribute('aria-expanded', 'false');
        });

        function scrollToBottom() {
            if (chatBody) chatBody.scrollTop = chatBody.scrollHeight;
        }

        function appendUserMessage(text) {
            if (!chatBody) return;
            const row = document.createElement('div');
            row.className = 'd-flex align-items-end justify-content-end gap-2 ms-auto max-w-85';
            const content = document.createElement('div');
            content.className = 'd-flex flex-column align-items-end';
            const sender = document.createElement('span');
            sender.className = 'text-secondary extra-small mb-1 me-1';
            sender.textContent = 'You';
            const bubble = document.createElement('div');
            bubble.className = 'bg-brand-header text-white p-2 px-3 rounded-3 shadow-sm';
            bubble.textContent = text;
            content.append(sender, bubble);
            row.append(content);
            chatBody.append(row);
            scrollToBottom();
        }

        function showTypingIndicator() {
            if (!chatBody) return;
            const indicator = document.createElement('div');
            indicator.id = 'aiTypingIndicator';
            indicator.className = 'd-flex align-items-start gap-2 max-w-85';
            const avatar = document.createElement('img');
            avatar.src = 'img/logo.png';
            avatar.alt = '';
            avatar.className = 'rounded-circle bg-dark p-1 border border-secondary border-opacity-25 tew-chatbot-avatar';
            const bubble = document.createElement('div');
            bubble.className = 'bg-white text-dark p-2 px-3 rounded-3 shadow-sm';
            bubble.textContent = 'TEW is typing...';
            indicator.append(avatar, bubble);
            chatBody.append(indicator);
            scrollToBottom();
        }

        function removeTypingIndicator() {
            const indicator = document.getElementById('aiTypingIndicator');
            if (indicator) indicator.remove();
        }

        function appendBotMessage(text) {
            if (!chatBody) return;
            const row = document.createElement('div');
            row.className = 'd-flex align-items-start gap-2 max-w-85';
            const avatar = document.createElement('img');
            avatar.src = 'img/logo.png';
            avatar.alt = '';
            avatar.className = 'rounded-circle bg-dark p-1 border border-secondary border-opacity-25 tew-chatbot-avatar';
            const bubble = document.createElement('div');
            bubble.className = 'bg-white text-dark p-2 px-3 rounded-3 shadow-sm';
            const sender = document.createElement('span');
            sender.className = 'fw-bold d-block text-uppercase extra-small text-muted mb-1';
            sender.textContent = 'TEW';
            const message = document.createElement('span');
            message.textContent = text;
            bubble.append(sender, message);
            row.append(avatar, bubble);
            chatBody.append(row);
            scrollToBottom();
        }

        function generateFAQResponse(userText) {
            showTypingIndicator();
            const lowerText = userText.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

            setTimeout(() => {
                removeTypingIndicator();
                let reply;
                if (/\b(hello|hi|hey)\b/.test(lowerText) || lowerText.includes('xin chao') || lowerText.includes('chao ban')) {
                    reply = 'Hello! Would you like help with our watches, brands, pricing, shipping, warranty, or returns?';
                } else if (['brand', 'brands', 'thuong hieu', 'rolex', 'omega', 'patek'].some((word) => lowerText.includes(word))) {
                    reply = 'TEW features Rolex, OMEGA, and Patek Philippe watches. Browse the collections on our Products page.';
                } else if (['price', 'pricing', 'cost', 'how much', 'gia', 'bao nhieu', 'availability', 'available'].some((word) => lowerText.includes(word))) {
                    reply = 'Prices vary by model and brand. The Aqua Terra detail page currently lists $6,400. See the Products page or contact TEW for a specific model.';
                } else if (['ship', 'shipping', 'delivery', 'giao hang', 'van chuyen'].some((word) => lowerText.includes(word))) {
                    reply = 'TEW offers global shipping and shipment insurance. Please contact us to confirm delivery timing for your address.';
                } else if (['return', 'exchange', 'refund', 'doi tra', 'hoan tien'].some((word) => lowerText.includes(word))) {
                    reply = 'The product page lists a 14-day return policy. Contact TEW for help with a specific order.';
                } else if (['warranty', 'guarantee', 'bao hanh'].some((word) => lowerText.includes(word))) {
                    reply = 'The OMEGA product detail page lists a 5-year international OMEGA warranty. Coverage may vary by model and brand.';
                } else if (['contact', 'expert', 'help', 'lien he', 'tu van', 'dia chi', 'address', 'location', 'where'].some((word) => lowerText.includes(word))) {
                    reply = 'Please use the Contact page to reach TEW. The website lists Can Tho and tewwatches.gmail.com.';
                } else if (['watch', 'watches', 'product', 'collection', 'dong ho', 'san pham', 'mau'].some((word) => lowerText.includes(word))) {
                    reply = 'TEW features Rolex, OMEGA, and Patek Philippe collections. Visit Products to browse watches and open a product detail page for specifications.';
                } else {
                    reply = 'I can help with common questions about watches, brands, pricing, shipping, warranty, and returns. What would you like to know?';
                }
                appendBotMessage(reply);
            }, 1200);
        }

        function handleSendMessage(text) {
            if (!chatInput) return;
            const message = (text === undefined ? chatInput.value : text).trim();
            if (!message) return;
            appendUserMessage(message);
            chatInput.value = '';
            generateFAQResponse(message);
        }

        const chatForm = chatbotWindow.querySelector('[data-chat-form]');
        if (chatForm) {
            chatForm.addEventListener('submit', function (event) {
                event.preventDefault();
                handleSendMessage();
            });
        } else {
            const sendBtn = chatbotWindow.querySelector('button[aria-label="Send Message"]');
            if (sendBtn) sendBtn.addEventListener('click', () => handleSendMessage());
            if (chatInput) {
                chatInput.addEventListener('keydown', function (event) {
                    if (event.key === 'Enter') {
                        event.preventDefault();
                        handleSendMessage();
                    }
                });
            }
        }

        if (chatBody) {
            chatBody.addEventListener('click', function (e) {
                const button = e.target.closest('[data-chat-question], .btn-light');
                if (button) {
                    const question = button.dataset.chatQuestion || button.textContent.trim();
                    handleSendMessage(question);
                }
            });
        }
    }
});