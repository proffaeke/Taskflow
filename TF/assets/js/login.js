// ====================
// Login Form
// ====================

const loginForm = document.getElementById("loginForm");
const loginMessage = document.getElementById("loginMessage");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");

// Display a message inside the form
function showLoginMessage(message, type = "error") {
  loginMessage.textContent = message;
  loginMessage.className =
    "border px-4 py-3 text-sm " +
    (type === "error"
      ? "border-red-200 bg-red-50 text-red-700"
      : "border-green-200 bg-green-50 text-green-700");

  loginMessage.classList.remove("hidden");
}

// Hide the message
function hideLoginMessage() {
  loginMessage.textContent = "";
  loginMessage.classList.add("hidden");
}

// Clear the message when the user starts correcting their input
emailInput.addEventListener("input", hideLoginMessage);
passwordInput.addEventListener("input", hideLoginMessage);

// Handle login form submission
loginForm.addEventListener("submit", function (event) {
  event.preventDefault();
  hideLoginMessage();

  const email = emailInput.value.trim();
  const password = passwordInput.value;

  // Check for empty fields
  if (!email || !password.trim()) {
    showLoginMessage("Please enter your email address and password.");
    return;
  }

  // Validate email format
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailPattern.test(email)) {
    showLoginMessage("Please enter a valid email address.");
    emailInput.focus();
    return;
  }

  // Check login credentials
  const result = loginUser(email, password);

  if (!result.success) {
    showLoginMessage(
      "The email or password you entered is incorrect. Please try again.",
    );

    // Clear both fields
    emailInput.value = "";
    passwordInput.value = "";

    // Return focus to the email field
    emailInput.focus();
    return;
  }

  // Login successful
  createSession(result.user);

  window.location.href = "./dashboard.html";
});
