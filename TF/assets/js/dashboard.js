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

// ====================
// Update Task Statistics
// ====================

function updateTaskStatistics() {
  const tasks = getData(STORAGE_KEYS.tasks);
  const currentUserTasks = tasks.filter(function (task) {
    return task.userId === currentUser.id;
  });
  const totalTasks = currentUserTasks.length;
  const completedTasks = currentUserTasks.filter(function (task) {
    return task.completed;
  }).length;
  const activeTasks = currentUserTasks.filter(function (task) {
    return !task.completed;
  }).length;

  totalTasksElement.textContent = totalTasks;
  activeTasksElement.textContent = activeTasks;
  completedTasksElement.textContent = completedTasks;
}
updateTaskStatistics();

const firstName = currentUser.name.split(" ")[0];
headerUserName.textContent = firstName;
userInitial.textContent = firstName.charAt(0).toUpperCase();
welcomeMessage.querySelector("span").textContent =
  `WELCOME BACK, ${firstName.toUpperCase()}`;

// ====================
// Today's Tasks
// ====================

const todayTasksContainer = document.getElementById("todayTasks");
function displayTodayTasks() {
  const today = new Date().toISOString().split("T")[0];
  const todayTasks = userTasks.filter(function (task) {
    return task.dueDate === today;
  });
  todayTasksContainer.innerHTML = "";
  if (todayTasks.length === 0) {
    todayTasksContainer.innerHTML = `
      <div class="px-5 py-10 text-center">
        <i
          data-lucide="calendar-check"
          class="mx-auto h-8 w-8 text-[#B89B5E]"
        ></i>
        <p class="mt-3 text-sm font-medium text-[#6B6B6B]">
          No tasks for today
        </p>
        <p class="mt-1 text-xs text-[#9A9A9A]">
          You're all caught up. Enjoy your day!
        </p>
      </div>
    `;
    lucide.createIcons();
    return;
  }
  todayTasks.forEach(function (task) {
    const taskElement = document.createElement("div");
    taskElement.className = "flex items-center gap-4 px-5 py-4";
    taskElement.innerHTML = `
      <input
        type="checkbox"
        class="dashboard-task-checkbox h-4 w-4 shrink-0 accent-[#B89B5E]"
        data-task-id="${task.id}"
        ${task.completed ? "checked" : ""}
      />
      <span
        class="text-sm ${
          task.completed ? "text-[#9A9A9A] line-through" : "text-[#2F3033]"
        }"
      >
        ${task.name}
      </span>
    `;
    todayTasksContainer.appendChild(taskElement);
  });
  lucide.createIcons();
}
displayTodayTasks();

// ====================
// Complete Today's Task
// ====================

todayTasksContainer.addEventListener("change", function (event) {
  if (!event.target.classList.contains("dashboard-task-checkbox")) {
    return;
  }
  const taskId = event.target.dataset.taskId;
  const tasks = getData(STORAGE_KEYS.tasks);
  const task = tasks.find(function (task) {
    return task.id === taskId;
  });
  if (!task) {
    return;
  }
  task.completed = event.target.checked;
  saveData(STORAGE_KEYS.tasks, tasks);

  // Update dashboard statistics
  updateTaskStatistics();

  // Refresh today's tasks
  userTasks.length = 0;
  const updatedUserTasks = tasks.filter(function (task) {
    return task.userId === currentUser.id;
  });
  updatedUserTasks.forEach(function (task) {
    userTasks.push(task);
  });

  displayTodayTasks();
});

// ====================
// Quick Add Task Modal
// ====================

const quickAddTaskBtn = document.getElementById("quickAddTaskBtn");
const quickAddModal = document.getElementById("quickAddModal");
const closeQuickAddModal = document.getElementById("closeQuickAddModal");
const cancelQuickAdd = document.getElementById("cancelQuickAdd");

function openQuickAddModal() {
  const today = getLocalDateString(new Date());
  const dueDateInput = document.getElementById("quickTaskDueDate");
  dueDateInput.min = today;
  dueDateInput.value = today;
  quickAddModal.classList.remove("hidden");
  quickAddModal.classList.add("flex");
}
function closeQuickAddTaskModal() {
  quickAddModal.classList.add("hidden");
  quickAddModal.classList.remove("flex");
}
quickAddTaskBtn.addEventListener("click", function (event) {
  event.preventDefault();
  openQuickAddModal();
});
closeQuickAddModal.addEventListener("click", closeQuickAddTaskModal);
cancelQuickAdd.addEventListener("click", closeQuickAddTaskModal);

// ====================
// Save Quick Add Task
// ====================

const quickAddForm = document.getElementById("quickAddForm");
quickAddForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const taskNameInput = document.getElementById("quickTaskName");
  const taskNameError = document.getElementById("quickTaskNameError");
  const taskName = taskNameInput.value.trim();

  if (!taskName) {
    taskNameError.classList.remove("hidden");
    taskNameInput.focus();
    return;
  }

  taskNameError.classList.add("hidden");
  const taskDescription = document
    .getElementById("quickTaskDescription")
    .value.trim();
  const taskDueDate = document.getElementById("quickTaskDueDate").value;
  const taskPriority = document.getElementById("quickTaskPriority").value;

  const tasks = getData(STORAGE_KEYS.tasks);
  const newTask = {
    id: crypto.randomUUID(),
    name: taskName,
    description: taskDescription,
    dueDate: taskDueDate,
    priority: taskPriority,
    completed: false,
    userId: currentUser.id,
  };

  tasks.push(newTask);
  saveData(STORAGE_KEYS.tasks, tasks);
  quickAddForm.reset();
  closeQuickAddTaskModal();
  updateTaskStatistics();
  displayTodayTasks();
  renderTaskProgressChart(selectedPeriod);
});

// ====================
// Logout Confirmation Modal
// ====================

const logoutBtn = document.getElementById("logoutBtn");
const logoutModal = document.getElementById("logoutModal");
const cancelLogout = document.getElementById("cancelLogout");
const confirmLogout = document.getElementById("confirmLogout");

logoutBtn.addEventListener("click", function (event) {
  event.preventDefault();

  logoutModal.classList.remove("hidden");
  logoutModal.classList.add("flex");
});
cancelLogout.addEventListener("click", function () {
  logoutModal.classList.add("hidden");
  logoutModal.classList.remove("flex");
});
confirmLogout.addEventListener("click", function () {
  logoutUser();
  window.location.href = "./login.html";
});
