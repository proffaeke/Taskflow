// ====================
// Task Progress Chart
// ====================

const taskProgressChart = document.getElementById("taskProgressChart");
const periodButtons = document.querySelectorAll("[data-period]");

let progressChart = null;
let selectedPeriod = "daily";

// ====================
// Get Local Date
// ====================

function getLocalDateString(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

// ====================
// Get Chart Data
// ====================

function getChartData(period) {
  const tasks = getData(STORAGE_KEYS.tasks);

  const currentUserTasks = tasks.filter(function (task) {
    return task.userId === currentUser.id;
  });

  const today = new Date();

  // Daily
  if (period === "daily") {
    const labels = [];
    const completed = [];
    const active = [];

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);

      const dateString = getLocalDateString(date);

      const dayTasks = currentUserTasks.filter(function (task) {
        return task.dueDate === dateString;
      });

      labels.push(
        date.toLocaleDateString("en-US", {
          weekday: "short",
        }),
      );

      completed.push(
        dayTasks.filter(function (task) {
          return task.completed;
        }).length,
      );

      active.push(
        dayTasks.filter(function (task) {
          return !task.completed;
        }).length,
      );
    }

    return {
      labels,
      completed,
      active,
    };
  }

  // Weekly
  if (period === "weekly") {
    const labels = [];
    const completed = [];
    const active = [];

    for (let i = 3; i >= 0; i--) {
      const endDate = new Date(today);
      endDate.setDate(today.getDate() - i * 7);

      const startDate = new Date(endDate);
      startDate.setDate(endDate.getDate() - 6);

      const weekTasks = currentUserTasks.filter(function (task) {
        if (!task.dueDate) {
          return false;
        }

        const taskDate = new Date(task.dueDate + "T00:00:00");

        return taskDate >= startDate && taskDate <= endDate;
      });

      labels.push(`Week ${4 - i}`);

      completed.push(
        weekTasks.filter(function (task) {
          return task.completed;
        }).length,
      );

      active.push(
        weekTasks.filter(function (task) {
          return !task.completed;
        }).length,
      );
    }

    return {
      labels,
      completed,
      active,
    };
  }

  // Monthly
  if (period === "monthly") {
    const labels = [];
    const completed = [];
    const active = [];

    for (let i = 5; i >= 0; i--) {
      const date = new Date(today.getFullYear(), today.getMonth() - i, 1);

      const year = date.getFullYear();
      const month = date.getMonth();

      const monthTasks = currentUserTasks.filter(function (task) {
        if (!task.dueDate) {
          return false;
        }

        const taskDate = new Date(task.dueDate + "T00:00:00");

        return taskDate.getFullYear() === year && taskDate.getMonth() === month;
      });

      labels.push(
        date.toLocaleDateString("en-US", {
          month: "short",
        }),
      );

      completed.push(
        monthTasks.filter(function (task) {
          return task.completed;
        }).length,
      );

      active.push(
        monthTasks.filter(function (task) {
          return !task.completed;
        }).length,
      );
    }

    return {
      labels,
      completed,
      active,
    };
  }

  // Yearly
  if (period === "yearly") {
    const labels = [];
    const completed = [];
    const active = [];

    for (let i = 4; i >= 0; i--) {
      const year = today.getFullYear() - i;
      const yearTasks = currentUserTasks.filter(function (task) {
        if (!task.dueDate) {
          return false;
        }

        const taskDate = new Date(task.dueDate + "T00:00:00");

        return taskDate.getFullYear() === year;
      });

      labels.push(String(year));

      completed.push(
        yearTasks.filter(function (task) {
          return task.completed;
        }).length,
      );

      active.push(
        yearTasks.filter(function (task) {
          return !task.completed;
        }).length,
      );
    }

    return {
      labels,
      completed,
      active,
    };
  }
}

// ====================
// Render Chart
// ====================

function renderTaskProgressChart(period) {
  const chartData = getChartData(period);

  if (progressChart) {
    progressChart.destroy();
  }

  progressChart = new Chart(taskProgressChart, {
    type: "line",

    data: {
      labels: chartData.labels,

      datasets: [
        {
          label: "Completed",
          data: chartData.completed,
          borderColor: "#B89B5E",
          backgroundColor: "rgba(184, 155, 94, 0.15)",
          tension: 0.3,
          fill: true,
          borderWidth: 2,
          pointRadius: 4,
          pointHoverRadius: 6,
        },

        {
          label: "Active",
          data: chartData.active,
          borderColor: "#2F3033",
          backgroundColor: "rgba(47, 48, 51, 0.08)",
          tension: 0.3,
          fill: true,
          borderWidth: 2,
          pointRadius: 4,
          pointHoverRadius: 6,
        },
      ],
    },

    options: {
      responsive: true,
      maintainAspectRatio: false,

      plugins: {
        legend: {
          position: "top",

          labels: {
            usePointStyle: true,
            padding: 20,
          },
        },
      },

      scales: {
        y: {
          beginAtZero: true,

          ticks: {
            precision: 0,
          },
        },

        x: {
          grid: {
            display: false,
          },
        },
      },
    },
  });
}

// ====================
// Period Buttons
// ====================

periodButtons.forEach(function (button) {
  button.addEventListener("click", function () {
    selectedPeriod = button.dataset.period;

    periodButtons.forEach(function (button) {
      button.classList.remove("bg-[#2F3033]", "text-white");

      button.classList.add("text-[#6B6B6B]");
    });

    button.classList.add("bg-[#2F3033]", "text-white");

    button.classList.remove("text-[#6B6B6B]");

    renderTaskProgressChart(selectedPeriod);
  });
});

// ====================
// Initial Chart
// ====================

renderTaskProgressChart(selectedPeriod);
