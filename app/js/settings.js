function copyData() {
  const { ipcRenderer } = require("electron");
  ipcRenderer.send("copy-data");
}
