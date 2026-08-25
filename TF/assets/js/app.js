lucide.createIcons();

const menuBtn = document.getElementById("menuBtn");
const mobileMenu = document.getElementById("mobileMenu");

if (menuBtn && mobileMenu) {
  menuBtn.addEventListener("click", () => {
    mobileMenu.classList.toggle("hidden");

    const isOpen = !mobileMenu.classList.contains("hidden");

    menuBtn.innerHTML = isOpen
      ? '<i data-lucide="x" class="h-7 w-7"></i>'
      : '<i data-lucide="menu" class="h-7 w-7"></i>';

    lucide.createIcons();
  });
}
