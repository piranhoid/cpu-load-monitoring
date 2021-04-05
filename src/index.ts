import { app, BrowserWindow, ipcMain, Notification } from 'electron';
import { LoadAverageInfo } from './interfaces/info';
import os from 'os';
import isDev from 'electron-is-dev';

require('loadavg-windows');

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

const THRESHOLD_DURATION = 5; // in seconds
const GET_CPU_INFO_INTERVAL = 5000; // in milliseconds TODO chanage to 10 minutes
const HIGH_LOAD_AVERAGE_THRESHOLD = 0.7;
let currentStatus: boolean;

const data: LoadAverageInfo[] = [];
ipcMain.on('getCpuInfo', (event) => {
  const interval = setInterval(() => {
    if (!mainWindow || mainWindow.isDestroyed()) {
      clearInterval(interval);
      return;
    }
    const cpus = os.cpus().length;
    let loadAverage = os.loadavg()[0] / cpus;
    loadAverage = Math.round(loadAverage * 100) / 100;
    const currentLoadAverage = {
      date: new Date(),
      value: loadAverage,
    };
    data.push(currentLoadAverage);
    try {
      event.sender.send('getCpuInfoResponse', currentLoadAverage);
    }
    catch (e) {
      console.log(e);
    }
  }, GET_CPU_INFO_INTERVAL);
});

ipcMain.on('getExceedingLimit', (event) => {
  if (!mainWindow || mainWindow.isDestroyed()) {
    return;
  }
  let j = 0;
  let isExceedingLimit = false;
  for (let i = data.length - 1; i >= 0 && j < THRESHOLD_DURATION - 1; i -= 1) {
    if (data[i].value >= HIGH_LOAD_AVERAGE_THRESHOLD) {
      isExceedingLimit = true;
    } else {
      isExceedingLimit = false;
    }
    j += 1;
  }
  if (j === THRESHOLD_DURATION - 1 && currentStatus !== isExceedingLimit) {
    try {
      event.sender.send('getExceedingLimitResponse', {
        isExceedingLimit,
        lastValue: data[data.length - THRESHOLD_DURATION + 1].value,
        date: new Date(),
      });
      currentStatus = isExceedingLimit;
      const notification = {
        title: 'CPU Load Monitoring',
        body: isExceedingLimit ? '🔥 CPU has reached the average load limit' : '👌🏻  CPU has recovered from high average load limit',
      };
      new Notification(notification).show();
    }
    catch (e) {
      console.log(e);
    }
  }
});
