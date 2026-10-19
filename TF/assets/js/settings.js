lucide.createIcons();

// Mobile Sidebar

const mobileMenuBtn = document.getElementById("mobileMenuBtn");
const sidebar = document.getElementById("sidebar");
const sidebarOverlay = document.getElementById("sidebarOverlay");

mobileMenuBtn.addEventListener("click", () => {
  sidebar.classList.toggle("-translate-x-full");
  sidebar.classList.toggle("translate-x-0");

  sidebarOverlay.classList.toggle("hidden");
});

sidebarOverlay.addEventListener("click", () => {
  sidebar.classList.add("-translate-x-full");
  sidebar.classList.remove("translate-x-0");

  sidebarOverlay.classList.add("hidden");
});

requireAuth();

// ====================
// User Preferences
// ====================

const taskReminderToggle = document.querySelector(
  '#preferences button[role="switch"]:not(#showCompletedToggle)',
);

const currentUser = getCurrentUser();
const reminderStorageKey = `taskflow_reminders_${currentUser.id}`;

// Load the saved preference, defaulting to ON
const savedReminderSetting = localStorage.getItem(reminderStorageKey);
const remindersEnabled =
  savedReminderSetting === null ? true : savedReminderSetting === "true";

// Update the switch appearance
function updateReminderToggle(enabled) {
  taskReminderToggle.setAttribute("aria-checked", String(enabled));
  taskReminderToggle.classList.toggle("bg-[#2F3033]", enabled);
  taskReminderToggle.classList.toggle("bg-[#D8D5CF]", !enabled);
  const toggleCircle = taskReminderToggle.querySelector("span");
  toggleCircle.classList.toggle("right-1", enabled);
  toggleCircle.classList.toggle("left-1", !enabled);
}

// Set the initial state
updateReminderToggle(remindersEnabled);

// Save changes whenever the switch is clicked
taskReminderToggle.addEventListener("click", function () {
  const currentlyEnabled =
    taskReminderToggle.getAttribute("aria-checked") === "true";
  const newSetting = !currentlyEnabled;
  localStorage.setItem(reminderStorageKey, String(newSetting));
  updateReminderToggle(newSetting);
});

// ====================
// Show Completed Tasks Preference
// ====================

const showCompletedToggle = document.getElementById("showCompletedToggle");
const showCompletedStorageKey = `taskflow_show_completed_${currentUser.id}`;

// Load the saved preference, defaulting to ON
const savedShowCompleted = localStorage.getItem(showCompletedStorageKey);
const showCompletedEnabled =
  savedShowCompleted === null ? true : savedShowCompleted === "true";

// Update the switch appearance
function updateShowCompletedToggle(enabled) {
  showCompletedToggle.setAttribute("aria-checked", String(enabled));
  showCompletedToggle.classList.toggle("bg-[#2F3033]", enabled);
  showCompletedToggle.classList.toggle("bg-[#D8D5CF]", !enabled);
  const toggleCircle = showCompletedToggle.querySelector("span");
  toggleCircle.classList.toggle("right-1", enabled);
  toggleCircle.classList.toggle("left-1", !enabled);
}

// Set the initial state
updateShowCompletedToggle(showCompletedEnabled);

// Save changes whenever the switch is clicked
showCompletedToggle.addEventListener("click", function () {
  const currentlyEnabled =
    showCompletedToggle.getAttribute("aria-checked") === "true";
  const newSetting = !currentlyEnabled;
  localStorage.setItem(showCompletedStorageKey, String(newSetting));
  updateShowCompletedToggle(newSetting);
});

// ====================
// Default Task Priority Preference
// ====================

const defaultPrioritySelect = document.getElementById("defaultPriority");
const priorityStorageKey = `taskflow_default_priority_${currentUser.id}`;

// Load the saved priority, defaulting to Medium
const savedPriority = localStorage.getItem(priorityStorageKey);
const allowedPriorities = ["Low", "Medium", "High"];
const defaultPriority = allowedPriorities.includes(savedPriority)
  ? savedPriority
  : "Medium";

// Display the saved priority
defaultPrioritySelect.value = defaultPriority;

// Save changes whenever the selection changes
defaultPrioritySelect.addEventListener("change", function () {
  localStorage.setItem(priorityStorageKey, defaultPrioritySelect.value);
});

// ====================
// Edit Profile
// ====================

const editProfileBtn = document.getElementById("editProfileBtn");
const editProfileModal = document.getElementById("editProfileModal");
const closeEditProfile = document.getElementById("closeEditProfile");
const cancelEditProfile = document.getElementById("cancelEditProfile");
const editProfileForm = document.getElementById("editProfileForm");
const editFullName = document.getElementById("editFullName");
const editEmail = document.getElementById("editEmail");
const profileName = document.getElementById("profileName");
const profileEmail = document.getElementById("profileEmail");
const displayFullName = document.getElementById("displayFullName");
const displayEmail = document.getElementById("displayEmail");
const headerUserName = document.getElementById("headerUserName");
const userInitial = document.getElementById("userInitial");
const profileInitial = document.getElementById("profileInitial");

// Open the modal
editProfileBtn.addEventListener("click", function () {
  const currentUser = getCurrentUser();

  if (!currentUser) {
    window.location.href = "./login.html";
    return;
  }

  editFullName.value = currentUser.name;
  editEmail.value = currentUser.email;

  editProfileModal.classList.remove("hidden");
  editProfileModal.classList.add("flex");
});

// Close the modal
function closeProfileModal() {
  editProfileModal.classList.add("hidden");
  editProfileModal.classList.remove("flex");
}

closeEditProfile.addEventListener("click", closeProfileModal);
cancelEditProfile.addEventListener("click", closeProfileModal);

// Save profile changes
editProfileForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const currentUser = getCurrentUser();

  if (!currentUser) {
    window.location.href = "./login.html";
    return;
  }

  const name = editFullName.value.trim();
  const email = editEmail.value.trim().toLowerCase();

  if (!name || !email) {
    alert("Please enter your full name and email address.");
    return;
  }

  // Check whether another account already uses this email
  const users = getData(STORAGE_KEYS.users);

  const emailExists = users.some(
    (user) => user.email.toLowerCase() === email && user.id !== currentUser.id,
  );

  if (emailExists) {
    alert("This email address is already registered.");
    return;
  }

  // Update the matching user record
  const updatedUsers = users.map((user) =>
    user.id === currentUser.id ? { ...user, name, email } : user,
  );

  saveData(STORAGE_KEYS.users, updatedUsers);

  // Update the current session
  const updatedCurrentUser = {
    ...currentUser,
    name,
    email,
  };

  saveData(STORAGE_KEYS.currentUser, updatedCurrentUser);

  // Update profile information on the page
  profileName.textContent = name;
  profileEmail.textContent = email;
  displayFullName.textContent = name;
  displayEmail.textContent = email;
  headerUserName.textContent = name.split(" ")[0];

  const initial = name.charAt(0).toUpperCase();
  userInitial.textContent = initial;
  profileInitial.textContent = initial;

  // Close the modal
  closeProfileModal();
});

// ====================
// Logout
// ====================

const logoutBtn = document.getElementById("logoutBtn");
const settingsLogoutBtn = document.getElementById("settingsLogoutBtn");
const logoutModal = document.getElementById("logoutModal");
const cancelLogoutBtn = document.getElementById("cancelLogout");
const confirmLogoutBtn = document.getElementById("confirmLogout");

function openLogoutModal() {
  if (!logoutModal) return;
  logoutModal.classList.remove("hidden");
  logoutModal.classList.add("flex");
}

function closeLogoutModal() {
  if (!logoutModal) return;
  logoutModal.classList.add("hidden");
  logoutModal.classList.remove("flex");
}
function handleLogoutClick() {
  openLogoutModal();
}
function confirmLogout() {
  logoutUser();
  window.location.href = "./login.html";
}
if (logoutBtn) {
  logoutBtn.addEventListener("click", handleLogoutClick);
}
if (settingsLogoutBtn) {
  settingsLogoutBtn.addEventListener("click", handleLogoutClick);
}
if (cancelLogoutBtn) {
  cancelLogoutBtn.addEventListener("click", closeLogoutModal);
}
if (confirmLogoutBtn) {
  confirmLogoutBtn.addEventListener("click", confirmLogout);
}

// ====================
// Load Saved Profile
// ====================

function loadProfile() {
  const currentUser = getCurrentUser();

  if (!currentUser) {
    return;
  }

  // Display the saved name and email
  profileName.textContent = currentUser.name;
  profileEmail.textContent = currentUser.email;
  displayFullName.textContent = currentUser.name;
  displayEmail.textContent = currentUser.email;
  headerUserName.textContent = currentUser.name.split(" ")[0];

  // Update the user's initials
  const initial = currentUser.name.charAt(0).toUpperCase();

  userInitial.textContent = initial;
  profileInitial.textContent = initial;
}

// Load the profile when the page opens
loadProfile();

// ==============================
// Change Password Modal
// ==============================

const changePasswordBtn = document.getElementById("changePasswordBtn");
const changePasswordModal = document.getElementById("changePasswordModal");
const closeChangePasswordModal = document.getElementById(
  "closeChangePasswordModal",
);
const cancelChangePassword = document.getElementById("cancelChangePassword");
const changePasswordForm = document.getElementById("changePasswordForm");

function openChangePasswordModal() {
  changePasswordModal.classList.remove("hidden");
  changePasswordModal.classList.add("flex");

  document.getElementById("currentPassword").focus();
}

function closePasswordModal() {
  changePasswordModal.classList.add("hidden");
  changePasswordModal.classList.remove("flex");
  changePasswordForm.reset();

  const message = document.getElementById("changePasswordMessage");
  message.textContent = "";
  message.classList.add("hidden");
}

if (changePasswordBtn && changePasswordModal) {
  changePasswordBtn.addEventListener("click", openChangePasswordModal);
}

if (closeChangePasswordModal) {
  closeChangePasswordModal.addEventListener("click", closePasswordModal);
}

if (cancelChangePassword) {
  cancelChangePassword.addEventListener("click", closePasswordModal);
}

// Close the modal when clicking the dark background.
if (changePasswordModal) {
  changePasswordModal.addEventListener("click", (event) => {
    if (event.target === changePasswordModal) {
      closePasswordModal();
    }
  });
}

// Close the modal with the Escape key.
document.addEventListener("keydown", (event) => {
  if (
    event.key === "Escape" &&
    changePasswordModal &&
    !changePasswordModal.classList.contains("hidden")
  ) {
    closePasswordModal();
  }
});

changePasswordForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const loggedInUser = getCurrentUser();

  const currentPassword = document.getElementById("currentPassword").value;
  const newPassword = document.getElementById("newPassword").value;
  const confirmNewPassword =
    document.getElementById("confirmNewPassword").value;

  const message = document.getElementById("changePasswordMessage");

  function showPasswordMessage(text, isSuccess = false) {
    message.textContent = text;
    message.classList.remove("hidden", "text-red-600", "text-green-600");
    message.classList.add(isSuccess ? "text-green-600" : "text-red-600");
  }

  // Check that a user is logged in.
  if (!loggedInUser) {
    showPasswordMessage("Please log in again to change your password.");
    return;
  }

  // Get the saved user accounts.
  const users = getData(STORAGE_KEYS.users);

  // Find the account belonging to the logged-in user.
  const userIndex = users.findIndex((user) => user.id === loggedInUser.id);

  if (userIndex === -1) {
    showPasswordMessage("Your account could not be found.");
    return;
  }

  // Verify the current password.
  if (users[userIndex].password !== currentPassword) {
    showPasswordMessage("Your current password is incorrect.");
    return;
  }

  // Validate the new password.
  if (newPassword.length < 8) {
    showPasswordMessage("Your new password must be at least 8 characters.");
    return;
  }

  if (newPassword !== confirmNewPassword) {
    showPasswordMessage("The new passwords do not match.");
    return;
  }

  if (newPassword === currentPassword) {
    showPasswordMessage(
      "Your new password must be different from your current password.",
    );
    return;
  }

  // Update the saved password.
  users[userIndex].password = newPassword;
  saveData(STORAGE_KEYS.users, users);

  // Show success message.
  showPasswordMessage("Password updated successfully!", true);

  // Close the modal after a short delay.
  setTimeout(() => {
    closePasswordModal();
  }, 1200);
});

// ==============================
// Delete Account Modal
// ==============================

const deleteAccountBtn = document.getElementById("deleteAccountBtn");
const deleteAccountModal = document.getElementById("deleteAccountModal");
const cancelDeleteAccount = document.getElementById("cancelDeleteAccount");
const confirmDeleteAccount = document.getElementById("confirmDeleteAccount");

confirmDeleteAccount.addEventListener("click", function () {
  const loggedInUser = getCurrentUser();
  if (!loggedInUser) {
    window.location.href = "./login.html";
    return;
  }

  // Get all saved accounts and tasks.
  const users = getData(STORAGE_KEYS.users);
  const tasks = getData(STORAGE_KEYS.tasks);

  // Remove only the current user's account.
  const updatedUsers = users.filter((user) => user.id !== loggedInUser.id);

  // Remove only the current user's tasks.
  const updatedTasks = tasks.filter((task) => task.userId !== loggedInUser.id);

  // Save the remaining accounts and tasks.
  saveData(STORAGE_KEYS.users, updatedUsers);
  saveData(STORAGE_KEYS.tasks, updatedTasks);

  // Remove this user's TaskFlow preferences.
  localStorage.removeItem(`taskflow_reminders_${loggedInUser.id}`);
  localStorage.removeItem(`taskflow_show_completed_${loggedInUser.id}`);
  localStorage.removeItem(`taskflow_default_priority_${loggedInUser.id}`);

  // Log out and return to the login page.
  logoutUser();
  window.location.href = "./login.html";
});

function openDeleteAccountModal() {
  if (!deleteAccountModal) return;

  deleteAccountModal.classList.remove("hidden");
  deleteAccountModal.classList.add("flex");
}

function closeDeleteAccountModal() {
  if (!deleteAccountModal) return;

  deleteAccountModal.classList.add("hidden");
  deleteAccountModal.classList.remove("flex");
}

if (deleteAccountBtn) {
  deleteAccountBtn.addEventListener("click", openDeleteAccountModal);
}

if (cancelDeleteAccount) {
  cancelDeleteAccount.addEventListener("click", closeDeleteAccountModal);
}

// Close when clicking the dark background.
if (deleteAccountModal) {
  deleteAccountModal.addEventListener("click", (event) => {
    if (event.target === deleteAccountModal) {
      closeDeleteAccountModal();
    }
  });
}

// Close when pressing Escape.
document.addEventListener("keydown", (event) => {
  if (
    event.key === "Escape" &&
    deleteAccountModal &&
    !deleteAccountModal.classList.contains("hidden")
  ) {
    closeDeleteAccountModal();
  }
});
