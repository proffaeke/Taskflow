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
  const currentUser = getCurrentUser();
  const tasks = getData(TASKS_KEY, []);

  // ====================
  // Edit Existing Task
  // ====================

  if (editingTaskId !== null) {
    const task = tasks.find(function (task) {
      return task.id === editingTaskId;
    });

    task.name = taskName;
    task.description = taskDescription;
    task.dueDate = taskDueDate;
    task.priority = taskPriority;

    editingTaskId = null;

    console.log("Task updated:", task);
  }

  // ====================
  // Add New Task
  // ====================
  else {
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

    console.log("Task added:", newTask);
  }

  saveData(TASKS_KEY, tasks);

  displayTasks();

  taskForm.reset();

  taskModal.classList.add("hidden");
  taskModal.classList.remove("flex");
});

// ====================
// Display Tasks
// ====================

let editingTaskId = null;
let deletingTaskId = null;
let currentFilter = "all";
let searchQuery = "";

const todayTasks = document.getElementById("todayTasks");
const dueTasks = document.getElementById("dueTasks");
const upcomingTasks = document.getElementById("upcomingTasks");
const todayTaskCount = document.getElementById("todayTaskCount");
const dueTaskCount = document.getElementById("dueTaskCount");
const deleteTaskModal = document.getElementById("deleteTaskModal");
const cancelDelete = document.getElementById("cancelDelete");
const confirmDelete = document.getElementById("confirmDelete");
const taskSearch = document.getElementById("taskSearch");
const taskModalTitle = taskModal.querySelector("h2");
const taskModalLabel = taskModal.querySelector("p");
const taskSubmitButton = taskForm.querySelector('button[type="submit"]');

function displayTasks() {
  const currentUser = getCurrentUser();
  const tasks = getData(TASKS_KEY, []);
  const userTasks = tasks.filter(function (task) {
    return task.userId === currentUser.id;
  });

  let filteredTasks = userTasks;

  // ====================
  // Filter Tasks
  // ====================

  if (currentFilter === "active") {
    filteredTasks = filteredTasks.filter(function (task) {
      return !task.completed;
    });
  }

  if (currentFilter === "completed") {
    filteredTasks = filteredTasks.filter(function (task) {
      return task.completed;
    });
  }

  // ====================
  // Search Tasks
  // ====================

  if (searchQuery !== "") {
    filteredTasks = filteredTasks.filter(function (task) {
      return (
        task.name.toLowerCase().includes(searchQuery) ||
        task.description.toLowerCase().includes(searchQuery)
      );
    });
  }

  const today = new Date();

  const todayDate =
    today.getFullYear() +
    "-" +
    String(today.getMonth() + 1).padStart(2, "0") +
    "-" +
    String(today.getDate()).padStart(2, "0");

  todayTasks.innerHTML = "";
  dueTasks.innerHTML = "";
  upcomingTasks.innerHTML = "";

  let todayCount = 0;
  let dueCount = 0;

  filteredTasks.forEach(function (task) {
    const taskElement = document.createElement("div");

    taskElement.className =
      "group relative flex items-center gap-4 px-5 py-4 transition hover:bg-[#FAF9F7]";

    taskElement.innerHTML = `
   <input
  type="checkbox"
  class="task-checkbox h-4 w-4 shrink-0 accent-[#B89B5E]"
  data-task-id="${task.id}"
  ${task.completed ? "checked" : ""}
/>

    <div class="min-w-0 flex-1">
     <p
  class="truncate text-sm font-medium ${
    task.completed ? "text-[#9A9A9A] line-through" : "text-[#2F3033]"
  }"
>
  ${task.name}
</p>

     <p class="mt-1 text-xs text-[#9A9A9A]">
  ${task.completed ? "Completed" : task.dueDate || "No due date"}
</p>
    </div>

    <button
  type="button"
  class="task-options flex h-8 w-8 shrink-0 items-center justify-center text-[#9A9A9A] transition hover:text-[#2F3033]"
  data-task-id="${task.id}"
  aria-label="Task options"
>
  <i data-lucide="more-vertical" class="h-5 w-5"></i>
</button>

<div
  class="task-menu absolute right-4 top-12 z-10 hidden w-32 border border-[#E3E0D9] bg-white py-1 shadow-sm"
>
  <button
    type="button"
    class="edit-task flex w-full px-4 py-2 text-left text-sm text-[#2F3033] hover:bg-[#FAF9F7]"
    data-task-id="${task.id}"
  >
    Edit
  </button>

  <button
    type="button"
    class="delete-task flex w-full px-4 py-2 text-left text-sm text-red-500 hover:bg-[#FAF9F7]"
    data-task-id="${task.id}"
  >
    Delete
  </button>
</div>
  `;
    if (!task.dueDate) {
      upcomingTasks.appendChild(taskElement);
    } else if (task.dueDate === todayDate) {
      todayTasks.appendChild(taskElement);

      if (!task.completed) {
        todayCount++;
      }
    } else if (task.dueDate < todayDate) {
      dueTasks.appendChild(taskElement);

      if (!task.completed) {
        dueCount++;
      }
    } else {
      upcomingTasks.appendChild(taskElement);
    }
  });

  todayTaskCount.textContent =
    todayCount === 1 ? "1 Task" : `${todayCount} Tasks`;

  dueTaskCount.textContent =
    dueCount === 1 ? "1 Overdue Task" : `${dueCount} Overdue Tasks`;

  const taskCheckboxes = document.querySelectorAll(".task-checkbox");

  taskCheckboxes.forEach(function (checkbox) {
    checkbox.addEventListener("change", function () {
      const taskId = checkbox.dataset.taskId;

      const task = tasks.find(function (task) {
        return task.id === taskId;
      });

      task.completed = checkbox.checked;

      saveData(TASKS_KEY, tasks);

      displayTasks();
    });
  });

  // Task options menu

  const taskOptions = document.querySelectorAll(".task-options");

  taskOptions.forEach(function (button) {
    button.addEventListener("click", function () {
      const menu = button.parentElement.querySelector(".task-menu");

      menu.classList.toggle("hidden");
    });
  });

  const editButtons = document.querySelectorAll(".edit-task");

  editButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      const taskId = button.dataset.taskId;

      const task = tasks.find(function (task) {
        return task.id === taskId;
      });

      editingTaskId = taskId;

      taskModalLabel.textContent = "EDIT TASK";
      taskModalTitle.textContent = "Edit Task";
      taskSubmitButton.textContent = "Save Changes";

      taskName.value = task.name;
      taskDescription.value = task.description || "";
      taskDueDate.value = task.dueDate || "";
      taskPriority.value = task.priority || "medium";

      taskModal.classList.remove("hidden");
      taskModal.classList.add("flex");
    });
  });

  const deleteButtons = document.querySelectorAll(".delete-task");

  deleteButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      deletingTaskId = button.dataset.taskId;

      deleteTaskModal.classList.remove("hidden");
      deleteTaskModal.classList.add("flex");
    });
  });

  const filterButtons = document.querySelectorAll("[data-filter]");

  filterButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      currentFilter = button.dataset.filter;

      filterButtons.forEach(function (filterButton) {
        filterButton.classList.remove("bg-[#2F3033]", "text-white");

        filterButton.classList.add(
          "border",
          "border-[#D8D5CF]",
          "bg-white",
          "text-[#6B6B6B]",
        );
      });

      button.classList.remove(
        "border",
        "border-[#D8D5CF]",
        "bg-white",
        "text-[#6B6B6B]",
      );

      button.classList.add("bg-[#2F3033]", "text-white");

      displayTasks();
    });
  });

  lucide.createIcons();
}

taskSearch.addEventListener("input", function () {
  searchQuery = taskSearch.value.trim().toLowerCase();

  displayTasks();
});

displayTasks();

cancelDelete.addEventListener("click", function () {
  deletingTaskId = null;

  deleteTaskModal.classList.add("hidden");
  deleteTaskModal.classList.remove("flex");
});

confirmDelete.addEventListener("click", function () {
  const tasks = getData(TASKS_KEY, []);

  const updatedTasks = tasks.filter(function (task) {
    return task.id !== deletingTaskId;
  });

  saveData(TASKS_KEY, updatedTasks);

  deletingTaskId = null;

  deleteTaskModal.classList.add("hidden");
  deleteTaskModal.classList.remove("flex");

  displayTasks();
});

// ====================
// Logout
// ====================

const logoutBtn = document.getElementById("logoutBtn");

logoutBtn.addEventListener("click", function () {
  logoutUser();

  window.location.href = "./login.html";
});
