import { app, BrowserWindow, ipcMain, Notification } from 'electron';
import { AverageListItem } from './interfaces/info';
import os from 'os';

require('loadavg-windows');

declare const MAIN_WINDOW_WEBPACK_ENTRY: string;

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
  app.quit();
}

const createWindow = () => {
  // Create the browser window.
  let mainWindow = new BrowserWindow({
    height: 600,
    width: 800,
    webPreferences: {
      nodeIntegration: true
    }
  });

  // and load the index.html of the app.
  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

  // Open the DevTools.
  mainWindow.webContents.openDevTools();

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
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

const THRESHOLD_DURATION = 5; // in seconds
const HIGH_LOAD_AVERAGE_THRESHOLD = 0.7;
let currentStatus: boolean;

const data: AverageListItem[] = [];
ipcMain.on('getCpuInfo', (event) => {
  setInterval(() => {
    const cpus = os.cpus().length;
    let loadAverage = os.loadavg()[0] / cpus;
    loadAverage = Math.round(loadAverage * 100) / 100;
    const currentLoadAverage = {
      index: new Date().getSeconds(),
      value: loadAverage,
    };
    data.push(currentLoadAverage);
    event.sender.send('getCpuInfoResponse', currentLoadAverage);
    // TODO change to 10sec
  }, 2000);
});

ipcMain.on('getExceedingLimit', (event) => {
  // TODO MUST IMPROVE
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
  // todo check if data.length - THRESHOLD_DURATION in the last value
  if (j === THRESHOLD_DURATION - 1 && currentStatus !== isExceedingLimit) {
    event.sender.send('getExceedingLimitResponse', {
      isExceedingLimit,
      lastValue: data[data.length - THRESHOLD_DURATION + 1].value,
      date: new Date(),
    });
    currentStatus = isExceedingLimit;
    const notification = {
      title: 'CPU LOAD MONITORING',
      body: isExceedingLimit ? '🔥' : '👌🏻',
    };
    new Notification(notification).show();
  }
});
