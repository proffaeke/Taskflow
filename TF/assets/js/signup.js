// ====================
// Signup Form
// ====================

const signupForm = document.getElementById("signupForm");
const signupMessage = document.getElementById("signupMessage");

const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const confirmPasswordInput = document.getElementById("confirmPassword");

function showSignupMessage(message, type = "error") {
  signupMessage.textContent = message;
  signupMessage.className =
    "border px-4 py-3 text-sm " +
    (type === "error"
      ? "border-red-200 bg-red-50 text-red-700"
      : "border-green-200 bg-green-50 text-green-700");

  signupMessage.classList.remove("hidden");
}

function hideSignupMessage() {
  signupMessage.textContent = "";
  signupMessage.classList.add("hidden");
}

signupForm.addEventListener("submit", function (event) {
  event.preventDefault();
  hideSignupMessage();

  const name = nameInput.value.trim();
  const email = emailInput.value.trim();
  const password = passwordInput.value;
  const confirmPassword = confirmPasswordInput.value;

  // Check for empty fields
  if (!name || !email || !password || !confirmPassword) {
    showSignupMessage("Please fill in all fields.");
    return;
  }

  // Validate email format
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailPattern.test(email)) {
    showSignupMessage("Please enter a valid email address.");
    emailInput.focus();
    return;
  }

  // Validate password length
  if (password.length < 8) {
    showSignupMessage("Your password must contain at least 8 characters.");
    passwordInput.focus();
    return;
  }

  // Confirm password
  if (password !== confirmPassword) {
    showSignupMessage("Your passwords do not match.");
    confirmPasswordInput.focus();
    return;
  }

  // Check for an existing account
  const existingUser = findUserByEmail(email);

  if (existingUser) {
    showSignupMessage("An account with this email already exists.");
    emailInput.focus();
    return;
  }

  // Create the account and log the user in
  const newUser = createUser(name, email, password);
  createSession(newUser);

  window.location.href = "./login.html";
});
