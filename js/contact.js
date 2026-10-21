document.addEventListener("DOMContentLoaded", () => {
    const emailInput = document.getElementById("emailAddress");
    const emailFeedback = document.getElementById("emailAddressFeedback");

    if (!(emailInput instanceof HTMLInputElement) || !(emailFeedback instanceof HTMLElement)) return;

    let emailWasBlurred = false;

    function updateEmailFeedback() {
        let message = "";

        if (emailInput.value.length === 0 && emailWasBlurred) {
            message = "Email address is required.";
        } else if (emailInput.validity.typeMismatch) {
            message = "Please enter a valid email address.";
        }

        emailFeedback.textContent = message;
        emailInput.classList.toggle("is-invalid", message.length > 0);
        emailInput.setAttribute("aria-invalid", String(message.length > 0));
    }

    emailInput.addEventListener("input", updateEmailFeedback);
    emailInput.addEventListener("blur", () => {
        emailWasBlurred = true;
        updateEmailFeedback();
    });
    emailInput.addEventListener("invalid", () => {
        emailWasBlurred = true;
        updateEmailFeedback();
    });
});
