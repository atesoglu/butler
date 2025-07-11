// Electron main process
const { app, BrowserWindow, ipcMain } = require('electron');
const fs = require('fs');
const path = require('path');

// Settings file path
const settingsPath = path.join(app.getPath('userData'), 'settings.json');

// In-memory log queue (FIFO, max 1000)
const memoryLogs = [];
const MAX_LOGS = 1000;

function log(message) {
  const timestamp = new Date().toISOString();
  memoryLogs.unshift({ timestamp, message });
  if (memoryLogs.length > MAX_LOGS) memoryLogs.pop();
}

function readSettings() {
  try {
    if (fs.existsSync(settingsPath)) {
      return JSON.parse(fs.readFileSync(settingsPath, 'utf-8'));
    }
  } catch (e) {
    log('Error reading settings: ' + e.message);
  }
  return {};
}

function writeSettings(settings) {
  try {
    fs.writeFileSync(settingsPath, JSON.stringify(settings, null, 2), 'utf-8');
    return true;
  } catch (e) {
    log('Error writing settings: ' + e.message);
    return false;
  }
}

// IPC handlers
ipcMain.handle('get-settings', () => {
  return readSettings();
});
ipcMain.handle('set-setting', (event, key, value) => {
  const settings = readSettings();
  settings[key] = value;
  writeSettings(settings);
  log(`Setting updated: ${key}=${value}`);
  return true;
});
ipcMain.handle('get-logs', () => {
  return memoryLogs;
});
ipcMain.handle('log-message', (event, message) => {
  log(message);
  return true;
});

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
    icon: path.join(__dirname, 'assets', 'butler.svg'),
  });

  // In development, load Vite dev server; in production, load built index.html
  if (process.env.NODE_ENV === 'development') {
    win.loadURL('http://localhost:5173');
  } else {
    win.loadFile(path.join(__dirname, 'dist', 'index.html'));
  }
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

// Log app start
log(`App started in ${process.env.VITE_ENV || process.env.NODE_ENV || 'development'} mode.`); 