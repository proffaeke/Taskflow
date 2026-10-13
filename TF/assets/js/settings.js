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

logoutBtn.addEventListener("click", function () {
  logoutUser();

  window.location.href = "./login.html";
});

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
