const { app, BrowserWindow } = require('electron');
const path = require('path');

let mainWindow;
const PROTOCOL_NAME = 'myapp';

// Register the deeplink protocol
if (process.defaultApp) {
  if (process.argv.length >= 2) {
    app.setAsDefaultProtocolClient(PROTOCOL_NAME, process.execPath, [path.resolve(process.argv[1])]);
  }
} else {
  app.setAsDefaultProtocolClient(PROTOCOL_NAME);
}

// Handle single instance
const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
  app.quit();
} else {
  app.on('second-instance', (event, commandLine, workingDirectory) => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
      
      const deeplinkUrl = commandLine.find(arg => arg.startsWith(`${PROTOCOL_NAME}://`));
      if (deeplinkUrl) {
        handleDeeplink(deeplinkUrl);
      }
    }
  });

  function createWindow() {
    mainWindow = new BrowserWindow({
      width: 800,
      height: 600,
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false
      }
    });

    mainWindow.loadFile(path.join(__dirname, 'index.html'));

    // Handle deeplink on startup
    if (process.platform === 'win32') {
      const deeplinkUrl = process.argv.find(arg => arg.startsWith(`${PROTOCOL_NAME}://`));
      if (deeplinkUrl) {
        handleDeeplink(deeplinkUrl);
      }
    }
  }

  function handleDeeplink(url) {
    console.log('Deeplink received:', url);
    if (mainWindow) {
      mainWindow.webContents.send('deeplink-received', url);
    }
  }

  app.whenReady().then(createWindow);

  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
}
