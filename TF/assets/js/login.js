// ====================
// Login Form
// ====================

const loginForm = document.getElementById("loginForm");

loginForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  const result = loginUser(email, password);

  if (!result.success) {
    alert(result.message);
    return;
  }

  // Login successful
  createSession(result.user.id);

  window.location.href = "./dashboard.html";
});
