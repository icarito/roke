import { app, BrowserWindow } from "electron";

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 900,
    webPreferences: {
      nodeIntegration: true,
    },
    show: false,
  });
  win.once("ready-to-show", () => {
    win.show();
  });
  // win.removeMenu();
  win.setFullScreen(true);
  win.setMenuBarVisibility(false);
  win.loadURL("http://localhost:5173");
}

app.whenReady().then(createWindow);
