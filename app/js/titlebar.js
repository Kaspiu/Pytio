const { ipcRenderer } = require("electron");

// Listen for button clicks
document.getElementById("close-button").addEventListener("click", () => {
  ipcRenderer.send("close-app");
});

document.getElementById("min-button").addEventListener("click", () => {
  ipcRenderer.send("minimize-app");
});

document.getElementById("max-button").addEventListener("click", () => {
  ipcRenderer.send("maximize-app");
});
