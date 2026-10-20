lucide.createIcons();

const resetPasswordForm = document.getElementById("resetPasswordForm");
const newPasswordInput = document.getElementById("newPassword");
const confirmPasswordInput = document.getElementById("confirmPassword");
const resetMessage = document.getElementById("resetMessage");

function showResetMessage(message, type = "error") {
  resetMessage.textContent = message;

  resetMessage.className =
    "border px-4 py-3 text-sm " +
    (type === "error"
      ? "border-red-200 bg-red-50 text-red-700"
      : "border-green-200 bg-green-50 text-green-700");

  resetMessage.classList.remove("hidden");
}

function hideResetMessage() {
  resetMessage.textContent = "";
  resetMessage.classList.add("hidden");
}

const resetEmail = sessionStorage.getItem("taskflow_reset_email");

if (!resetEmail) {
  showResetMessage(
    "No password reset request was found. Please start from the Forgot Password page.",
  );
  resetPasswordForm.querySelector('button[type="submit"]').disabled = true;
  newPasswordInput.disabled = true;
  confirmPasswordInput.disabled = true;
}
newPasswordInput.addEventListener("input", hideResetMessage);
confirmPasswordInput.addEventListener("input", hideResetMessage);
resetPasswordForm.addEventListener("submit", function (event) {
  event.preventDefault();
  hideResetMessage();

  if (!resetEmail) {
    showResetMessage("Please start again from the Forgot Password page.");
    return;
  }

  const newPassword = newPasswordInput.value;
  const confirmPassword = confirmPasswordInput.value;

  if (!newPassword || !confirmPassword) {
    showResetMessage("Please fill in both password fields.");
    return;
  }
  if (newPassword.length < 8) {
    showResetMessage("Your new password must contain at least 8 characters.");
    newPasswordInput.focus();
    return;
  }
  if (newPassword !== confirmPassword) {
    showResetMessage("Your passwords do not match. Please try again.");
    confirmPasswordInput.focus();
    return;
  }

  const users = getData(STORAGE_KEYS.users);
  const userIndex = users.findIndex((user) => user.email === resetEmail);

  if (userIndex === -1) {
    showResetMessage("We couldn't find your account. Please start again.");
    return;
  }

  users[userIndex].password = newPassword;
  saveData(STORAGE_KEYS.users, users);
  sessionStorage.removeItem("taskflow_reset_email");
  showResetMessage(
    "Your password has been reset successfully! You can now log in with your new password.",
    "success",
  );

  resetPasswordForm.reset();
});
