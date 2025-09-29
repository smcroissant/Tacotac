import { app, shell, BrowserWindow, ipcMain, clipboard, Tray, Menu, screen } from 'electron'
import path, { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import { clipboardDB, ClipboardItem } from './database'
const { autoUpdater } = require('electron-updater');


// Maximum number of items to keep in clipboard history
const MAX_HISTORY_SIZE = 50

// Store clipboard history in memory for quick access
let clipboardHistory: ClipboardItem[] = []
let lastClipboardContent = ''

// Function to monitor clipboard changes
function startClipboardMonitoring(): void {
  // Load initial history from database
  clipboardHistory = clipboardDB.getHistory(MAX_HISTORY_SIZE)
  lastClipboardContent = clipboardHistory[0]?.text || ''

  // Check clipboard every second
  setInterval(() => {
    const currentContent = clipboard.readText()

    // Only add to history if content has changed and is not empty
    if (currentContent && currentContent !== lastClipboardContent) {
      lastClipboardContent = currentContent

      // Add to database
      clipboardDB.addItem(currentContent)

      // Update in-memory history
      clipboardHistory = clipboardDB.getHistory(MAX_HISTORY_SIZE)

      // Notify renderer about the update
      BrowserWindow.getAllWindows().forEach(window => {
        window.webContents.send('clipboard-updated', clipboardHistory)
      })
    }
  }, 1000)
}

function createWindow(): void {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 300,
    height: 670,
    show: false,
    frame: false,
    // titleBarStyle: 'hidden',
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false
    }
  })

  mainWindow.setAlwaysOnTop(true, 'floating');

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }

  mainWindow.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });

  mainWindow.on('blur', () => {
    mainWindow.hide();
  });

  const tray = new Tray(icon); // icon name ends with 'template' for dark mode support

  tray.setToolTip('Tacotac');

  const contextMenu = Menu.buildFromTemplate([
    { label: 'Quit', click: () => app.quit() }
  ]);


  tray.on('click', () => {
    if(mainWindow.isVisible()) {
      mainWindow.hide();
    } else {
      // Get mouse position

      mainWindow.show();
      mainWindow.focus();

    }
  });

  tray.on('right-click', () => {
    tray.popUpContextMenu(contextMenu);
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // Start clipboard monitoring
  startClipboardMonitoring()

  // Setup IPC handlers for clipboard operations
  ipcMain.handle('get-clipboard-history', () => clipboardHistory)

  ipcMain.on('set-clipboard-content', (_, content: string) => {
    clipboard.writeText(content)
  })

  ipcMain.on('clear-clipboard-history', () => {
    clipboardDB.clearHistory()
    clipboardHistory = []
    BrowserWindow.getAllWindows().forEach(window => {
      window.webContents.send('clipboard-updated', clipboardHistory)
    })
  })

  ipcMain.on('delete-clipboard-item', (_, id: number) => {
    clipboardDB.deleteItem(id)
    clipboardHistory = clipboardDB.getHistory(MAX_HISTORY_SIZE)
    BrowserWindow.getAllWindows().forEach(window => {
      window.webContents.send('clipboard-updated', clipboardHistory)
    })
  })

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

autoUpdater.on('update-available', () => {
  console.log('Update available');
});
autoUpdater.on('update-downloaded', () => {
  console.log('Update downloaded');
  autoUpdater.quitAndInstall();
});

app.on('ready', () => {
  autoUpdater.checkForUpdatesAndNotify();
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
