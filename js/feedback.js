const feedbackForm = document.getElementById("feedbackForm");
const feedbackError = document.getElementById("feedback-submit-error");

if (feedbackForm && feedbackError) {
    feedbackForm.addEventListener("submit", (event) => {
        event.preventDefault();

        const selectedRating = feedbackForm.querySelector('input[name="rating"]:checked');
        if (!selectedRating) return;

        const newFeedback = {
            name: document.getElementById("name").value,
            email: document.getElementById("email").value,
            problem: document.getElementById("problem").value,
            rating: selectedRating.value,
            date: new Date().toLocaleDateString("vi-VN")
        };

        try {
            const savedFeedback = localStorage.getItem("tew_feedbacks");
            const allFeedbacks = savedFeedback === null ? [] : JSON.parse(savedFeedback);
            if (!Array.isArray(allFeedbacks)) {
                throw new Error("Saved feedback data is invalid.");
            }

            allFeedbacks.unshift(newFeedback);
            localStorage.setItem("tew_feedbacks", JSON.stringify(allFeedbacks));
        } catch (error) {
            feedbackError.textContent = "Unable to save your feedback. Please try again.";
            feedbackError.classList.remove("d-none");
            console.error("Unable to save feedback.", error);
            return;
        }

        window.alert("Thank you for your feedback! Your response has been recorded.");
        window.location.href = "index.html";
    });
}
