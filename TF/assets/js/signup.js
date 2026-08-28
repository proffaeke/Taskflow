// ====================
// Signup Form
// ====================

const signupForm = document.getElementById("signupForm");

signupForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirmPassword").value;

  // ====================
  // Password Validation
  // ====================

  if (password !== confirmPassword) {
    alert("Passwords do not match.");
    return;
  }

  // ====================
  // Check Existing Email
  // ====================

  const existingUser = findUserByEmail(email);

  if (existingUser) {
    alert("An account with this email already exists.");
    return;
  }

  const newUser = createUser(name, email, password);

  console.log("User created:", newUser);
});
