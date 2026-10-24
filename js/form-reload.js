document.querySelectorAll("form[data-reload-on-submit]").forEach((form) => {
    form.addEventListener("submit", (event) => {
        event.preventDefault();
        const redirectUrl = form.dataset.redirectOnSubmit;
        const successMessage = form.dataset.successMessage;
        if (successMessage) {
            window.alert(successMessage);
        }
        if (redirectUrl) {
            window.location.href = redirectUrl;
            return;
        }
        window.location.reload();
    });
});
