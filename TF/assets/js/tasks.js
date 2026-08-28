requireAuth();

lucide.createIcons();

// ====================
// Task Storage
// ====================

const TASKS_KEY = "taskflow_tasks";

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

// ====================
// Add Task Modal
// ====================

const addTaskBtn = document.getElementById("addTaskBtn");
const taskModal = document.getElementById("taskModal");
const closeTaskModal = document.getElementById("closeTaskModal");
const cancelTask = document.getElementById("cancelTask");

// Open Modal

addTaskBtn.addEventListener("click", function () {
  taskModal.classList.remove("hidden");
  taskModal.classList.add("flex");
});

// Close Modal

closeTaskModal.addEventListener("click", function () {
  taskModal.classList.add("hidden");
  taskModal.classList.remove("flex");
});

// Cancel

cancelTask.addEventListener("click", function () {
  taskModal.classList.add("hidden");
  taskModal.classList.remove("flex");
});

// ====================
// Task Form
// ====================

const taskForm = document.getElementById("taskForm");

taskForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const taskName = document.getElementById("taskName").value.trim();
  const taskDescription = document
    .getElementById("taskDescription")
    .value.trim();
  const taskDueDate = document.getElementById("taskDueDate").value;
  const taskPriority = document.getElementById("taskPriority").value;

  const newTask = {
    id: crypto.randomUUID(),
    name: taskName,
    description: taskDescription,
    dueDate: taskDueDate,
    priority: taskPriority,
    completed: false,
  };

  const currentUser = getCurrentUser();
  const tasks = getData(TASKS_KEY, []);

  tasks.push({
    ...newTask,
    userId: currentUser.id,
  });
  saveData(TASKS_KEY, tasks);

  displayTasks();

  taskForm.reset();

  taskModal.classList.add("hidden");
  taskModal.classList.remove("flex");

  console.log("Task saved:", tasks);
});

// ====================
// Display Tasks
// ====================

function displayTasks() {
  const currentUser = getCurrentUser();

  const tasks = getData(TASKS_KEY, []);

  const userTasks = tasks.filter(function (task) {
    return task.userId === currentUser.id;
  });

  const today = new Date();

  const todayDate =
    today.getFullYear() +
    "-" +
    String(today.getMonth() + 1).padStart(2, "0") +
    "-" +
    String(today.getDate()).padStart(2, "0");

  const todayTasks = document.getElementById("todayTasks");
  const upcomingTasks = document.getElementById("upcomingTasks");

  todayTasks.innerHTML = "";
  upcomingTasks.innerHTML = "";

  userTasks.forEach(function (task) {
    const taskElement = document.createElement("div");

    taskElement.className =
      "group flex items-center gap-4 px-5 py-4 transition hover:bg-[#FAF9F7]";

    taskElement.innerHTML = `
    <input
      type="checkbox"
      class="h-4 w-4 shrink-0 accent-[#B89B5E]"
      ${task.completed ? "checked" : ""}
    />

    <div class="min-w-0 flex-1">
      <p class="truncate text-sm font-medium">
        ${task.name}
      </p>

      <p class="mt-1 text-xs text-[#9A9A9A]">
        ${task.dueDate || "No due date"}
      </p>
    </div>

    <button
      type="button"
      class="flex h-8 w-8 shrink-0 items-center justify-center text-[#9A9A9A] transition hover:text-[#2F3033]"
      aria-label="Task options"
    >
      <i data-lucide="more-vertical" class="h-5 w-5"></i>
    </button>
  `;
    if (task.dueDate === todayDate) {
      todayTasks.appendChild(taskElement);
    } else {
      upcomingTasks.appendChild(taskElement);
    }
  });

  lucide.createIcons();
}

displayTasks();

// ====================
// Logout
// ====================

const logoutBtn = document.getElementById("logoutBtn");

logoutBtn.addEventListener("click", function () {
  logoutUser();

  window.location.href = "./login.html";
});
