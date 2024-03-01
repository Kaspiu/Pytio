const sideBtn = document.getElementById("side-button");
const sideBar = document.getElementById("side-bar");
let isOpen = false;

sideBtn.addEventListener("click", toggleSidebar);

sideBar.addEventListener("mouseleave", () => {
  sideBar.style.left = "-5.5rem";
  isOpen = false;
});

function toggleSidebar() {
  if (!isOpen) {
    // Open sidebar
    sideBar.style.left = "0";
  } else {
    // Close sidebar
    sideBar.style.left = "-5.5rem";
  }

  isOpen = !isOpen;
}
