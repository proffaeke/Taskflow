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
