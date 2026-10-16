/* =========================
   TaskFlow In-App Reminders
========================= */

function renderTaskReminders() {
  const currentUser = getCurrentUser();

  if (!currentUser) {
    return;
  }

  const reminderSection = document.getElementById("taskRemindersSection");
  const reminderCount = document.getElementById("taskReminderCount");
  const reminderList = document.getElementById("taskRemindersList");

  if (!reminderSection || !reminderCount || !reminderList) {
    return;
  }

  // Check whether this user has enabled reminders.
  const reminderStorageKey = `taskflow_reminders_${currentUser.id}`;

  const savedSetting = localStorage.getItem(reminderStorageKey);

  const remindersEnabled = savedSetting === null || savedSetting === "true";

  if (!remindersEnabled) {
    reminderSection.classList.add("hidden");
    return;
  }

  // Get only this user's unfinished tasks.
  const allTasks = getData(STORAGE_KEYS.tasks);

  // Use the local calendar date to avoid timezone issues.
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const today = `${year}-${month}-${day}`;

  const reminderTasks = allTasks.filter(function (task) {
    return (
      task.userId === currentUser.id &&
      !task.completed &&
      task.dueDate &&
      task.dueDate <= today
    );
  });

  // Hide the panel if there are no reminders.
  if (reminderTasks.length === 0) {
    reminderSection.classList.add("hidden");
    return;
  }

  // Update the reminder count and clear previous items.
  reminderCount.textContent = reminderTasks.length;
  reminderList.replaceChildren();

  // Display each overdue or due-today task.
  reminderTasks.forEach(function (task) {
    const isOverdue = task.dueDate < today;

    const item = document.createElement("div");
    item.className = "flex items-start gap-3 px-4 py-4";

    const iconWrapper = document.createElement("div");
    iconWrapper.className =
      "flex h-10 w-10 shrink-0 items-center justify-center " +
      (isOverdue ? "bg-[#F8E8E5]" : "bg-[#F7F0DF]");

    const icon = document.createElement("i");
    icon.setAttribute(
      "data-lucide",
      isOverdue ? "clock-alert" : "calendar-clock",
    );
    icon.className =
      "h-5 w-5 " + (isOverdue ? "text-[#B54736]" : "text-[#92743C]");

    iconWrapper.appendChild(icon);

    const details = document.createElement("div");
    details.className = "min-w-0 flex-1";

    const taskName = document.createElement("p");
    taskName.className = "break-words text-sm font-semibold text-[#2F3033]";
    taskName.textContent = task.name;

    const status = document.createElement("p");
    status.className =
      "mt-1 text-xs " + (isOverdue ? "text-[#B54736]" : "text-[#92743C]");

    if (isOverdue) {
      status.textContent = `Overdue · Due ${task.dueDate}`;
    } else {
      status.textContent = "Due today";
    }

    details.append(taskName, status);
    item.append(iconWrapper, details);
    reminderList.appendChild(item);
  });

  reminderSection.classList.remove("hidden");

  // Render the newly added Lucide icons.
  lucide.createIcons();
}

// Render reminders when the Dashboard loads.
renderTaskReminders();

/* =========================
   Automatic Reminder Updates
========================= */

// Update when tasks change in another open TaskFlow tab.
window.addEventListener("storage", function (event) {
  const currentUser = getCurrentUser();

  if (!currentUser) return;

  const reminderStorageKey = `taskflow_reminders_${currentUser.id}`;

  if (event.key === STORAGE_KEYS.tasks || event.key === reminderStorageKey) {
    renderTaskReminders();
  }
});
