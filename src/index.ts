import { app, BrowserWindow, ipcMain, Notification } from 'electron';
import { LoadAverageInfo } from './interfaces/info';
import isDev from 'electron-is-dev';
import dotenv from 'dotenv';
import { getCpuLoadAverage, getCpuStatus } from './utils';

require('loadavg-windows');

dotenv.config();

declare const MAIN_WINDOW_WEBPACK_ENTRY: string;

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
  app.quit();
}

let mainWindow: BrowserWindow;

const createWindow = () => {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 720,
    webPreferences: {
      nodeIntegration: true
    }
  });
  // and load the index.html of the app.
  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

  if (isDev) {
    // Open the DevTools.
    mainWindow.webContents.openDevTools();
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  // if (process.platform !== 'darwin') {
  app.quit();
  // }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

const data: LoadAverageInfo[] = [];
ipcMain.on('getCpuInfo', (event) => {
  const interval = setInterval(() => {
    if (!mainWindow || mainWindow.isDestroyed()) {
      clearInterval(interval);
      return;
    }
    const currentLoadAverage = {
      date: new Date(),
      value: getCpuLoadAverage(),
    };
    data.push(currentLoadAverage);
    try {
      event.sender.send('getCpuInfoResponse', currentLoadAverage);
    }
    catch (e) {
      console.log(e);
    }
  }, +process.env.GET_CPU_INFO_INTERVAL);
});

ipcMain.on('getExceedingLimit', (event) => {
  if (!mainWindow || mainWindow.isDestroyed()) {
    return;
  }
  const cpuStatus = getCpuStatus(data);
  if (cpuStatus !== null) {
    try {
      event.sender.send('getExceedingLimitResponse', {
        isExceedingLimit: cpuStatus,
        lastValue: data[data.length - +process.env.THRESHOLD_DURATION + 1].value,
        date: new Date(),
      });
      const notification = {
        title: 'CPU Load Monitoring',
        body: cpuStatus ? '🔥 CPU has reached the average load limit' : '👌🏻  CPU has recovered from high average load limit',
      };
      new Notification(notification).show();
    }
    catch (e) {
      console.log(e);
    }
  }
});
