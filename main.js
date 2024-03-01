// Main process
const { app, BrowserWindow } = require("electron");
const { ipcMain, dialog } = require("electron");
const fs = require("fs-extra");
const os = require("os");
const path = require("path");
const currentUserName = os.userInfo().username;
const sourceFolder = `C:\\Users\\${currentUserName}\\AppData\\Roaming\\pytio\\Local Storage`;
const devValue = false;

function createWindow() {
  let win = new BrowserWindow({
    width: 1400,
    height: 800,
    title: "Pytio",
    icon: "./app/images/logo.png",
    frame: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      devTools: true,
    },
  });

  win.loadFile("./app/index.html");
  if (devValue === true) {
    win.webContents.openDevTools();
  }

  // Titlebar buttons
  ipcMain.on("close-app", () => {
    win.close();
  });

  ipcMain.on("minimize-app", () => {
    win.minimize();
  });

  ipcMain.on("maximize-app", () => {
    if (win.isMaximized()) {
      win.restore();
    } else {
      win.maximize();
    }
  });

  ipcMain.on("copy-data", () => {
    dialog.showOpenDialog({ properties: ["openDirectory"] }).then((result) => {
      if (!result.canceled) {
        const destinationFolder = result.filePaths[0];
        const destinationPath = path.join(destinationFolder, "Local Storage");

        fs.copy(sourceFolder, destinationPath);
      }
    });
  });
}

app.whenReady().then(() => {
  createWindow();
});
