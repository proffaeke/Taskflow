// =========================
// Forgot Password Form
// =========================

lucide.createIcons();

const forgotPasswordForm = document.getElementById("forgotPasswordForm");
const emailInput = document.getElementById("email");
const recoveryMessage = document.getElementById("recoveryMessage");

// Display an inline message
function showRecoveryMessage(message, type = "error") {
  recoveryMessage.textContent = message;

  recoveryMessage.className =
    "border px-4 py-3 text-sm " +
    (type === "error"
      ? "border-red-200 bg-red-50 text-red-700"
      : "border-green-200 bg-green-50 text-green-700");

  recoveryMessage.classList.remove("hidden");
}

// Hide the message
function hideRecoveryMessage() {
  recoveryMessage.textContent = "";
  recoveryMessage.classList.add("hidden");
}

// Clear feedback when the user edits the email
emailInput.addEventListener("input", hideRecoveryMessage);

// Handle form submission
forgotPasswordForm.addEventListener("submit", function (event) {
  event.preventDefault();
  hideRecoveryMessage();

  const email = emailInput.value.trim();

  // Check for an empty email
  if (!email) {
    showRecoveryMessage("Please enter your email address.");
    emailInput.focus();
    return;
  }

  // Validate email format
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailPattern.test(email)) {
    showRecoveryMessage("Please enter a valid email address.");
    emailInput.focus();
    return;
  }

  // Check whether an account exists with this email
  const existingUser = findUserByEmail(email);

  if (!existingUser) {
    showRecoveryMessage(
      "No account was found with that email address. Please check it and try again.",
    );
    emailInput.focus();
    return;
  }

  // Account found — continue to the reset page
  sessionStorage.setItem("taskflow_reset_email", existingUser.email);

  window.location.href = "./reset-password.html";
});
