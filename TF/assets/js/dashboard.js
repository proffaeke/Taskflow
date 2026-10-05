requireAuth();

lucide.createIcons();

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

// ====================
// Dashboard Data
// ====================

const currentUser = getCurrentUser();
const totalTasksElement = document.getElementById("totalTasks");
const activeTasksElement = document.getElementById("activeTasks");
const completedTasksElement = document.getElementById("completedTasks");
const headerUserName = document.getElementById("headerUserName");
const userInitial = document.getElementById("userInitial");
const welcomeMessage = document.getElementById("welcomeMessage");
const tasks = getData(STORAGE_KEYS.tasks);
const userTasks = tasks.filter(function (task) {
  return task.userId === currentUser.id;
});
const totalTasks = userTasks.length;
const completedTasks = userTasks.filter(function (task) {
  return task.completed;
}).length;
const activeTasks = userTasks.filter(function (task) {
  return !task.completed;
}).length;

totalTasksElement.textContent = totalTasks;
activeTasksElement.textContent = activeTasks;
completedTasksElement.textContent = completedTasks;

const firstName = currentUser.name.split(" ")[0];
headerUserName.textContent = firstName;
userInitial.textContent = firstName.charAt(0).toUpperCase();
welcomeMessage.querySelector("span").textContent =
  `WELCOME BACK, ${firstName.toUpperCase()}`;

// ====================
// Logout
// ====================

const logoutBtn = document.getElementById("logoutBtn");
logoutBtn.addEventListener("click", function () {
  logoutUser();
  window.location.href = "./login.html";
});
