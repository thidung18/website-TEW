document.querySelectorAll("#togglePassword").forEach((button) => {
    const input = button.closest(".position-relative")?.querySelector('input[type="password"], input[type="text"]');
    const icon = button.querySelector("i");
    if (!(input instanceof HTMLInputElement) || !icon) return;

    button.addEventListener("click", () => {
        const isPasswordVisible = input.type === "password";
        input.type = isPasswordVisible ? "text" : "password";
        button.setAttribute("aria-label", isPasswordVisible ? "Hide password" : "Show password");
        button.setAttribute("aria-pressed", String(isPasswordVisible));
        icon.classList.toggle("fa-eye", isPasswordVisible);
        icon.classList.toggle("fa-eye-slash", !isPasswordVisible);
    });
});
