import { app, BrowserWindow, ipcMain, shell, dialog } from 'electron';
import path from 'path';
import fs from 'fs';

let mainWindow: BrowserWindow | null = null;

// Determine environment
const isDev = !app.isPackaged && (process.env.NODE_ENV === 'development' || process.argv.includes('--dev'));
const devServerUrl = process.env.VITE_DEV_SERVER_URL || 'http://localhost:3000';

function getMemoryStorageDir(): string {
  const dir = path.join(app.getPath('userData'), 'smriti-memories');
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  return dir;
}

function getUserDataStoreDir(): string {
  const dir = path.join(app.getPath('userData'), 'smriti-store');
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  return dir;
}

function createWindow(): void {
  const iconPath = process.platform === 'win32'
    ? path.join(__dirname, '../build/icon.ico')
    : path.join(__dirname, '../build/icon.png');

  mainWindow = new BrowserWindow({
    title: 'Smriti Care',
    width: 1440,
    height: 900,
    minWidth: 1024,
    minHeight: 700,
    show: false, // Prevent visual flicker before rendering
    autoHideMenuBar: true, // Clean native Windows UI
    backgroundColor: '#F5F5F2',
    icon: fs.existsSync(iconPath) ? iconPath : undefined,
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      contextIsolation: true,
      nodeIntegration: false,
      webSecurity: true,
      sandbox: false,
    },
  });

  // Clean title
  mainWindow.setTitle('Smriti Care');

  // Prevent title from resetting if unwanted
  mainWindow.on('page-title-updated', (e) => {
    e.preventDefault();
  });

  // Graceful show on ready
  mainWindow.once('ready-to-show', () => {
    if (mainWindow) {
      mainWindow.show();
      mainWindow.focus();
    }
  });

  // Load URL in dev, file in production
  if (isDev) {
    console.log(`[Smriti Care] Connecting to development server at: ${devServerUrl}`);
    mainWindow.loadURL(devServerUrl).catch((err) => {
      console.error('[Smriti Care] Failed to load dev server:', err);
    });
    mainWindow.webContents.openDevTools({ mode: 'detach' });
  } else {
    const indexPath = path.join(__dirname, '../dist/index.html');
    console.log(`[Smriti Care] Loading production assets from: ${indexPath}`);
    mainWindow.loadFile(indexPath).catch((err) => {
      console.error('[Smriti Care] Failed to load production index.html:', err);
    });
  }

  // Intercept new window creations (target="_blank" or window.open)
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('http://') || url.startsWith('https://')) {
      shell.openExternal(url);
    }
    return { action: 'deny' };
  });

  // Prevent unexpected in-app navigation to external websites
  mainWindow.webContents.on('will-navigate', (event, navigationUrl) => {
    const parsedUrl = new URL(navigationUrl);
    if (parsedUrl.protocol === 'file:' || (isDev && parsedUrl.host === new URL(devServerUrl).host)) {
      return;
    }
    event.preventDefault();
    if (navigationUrl.startsWith('http://') || navigationUrl.startsWith('https://')) {
      shell.openExternal(navigationUrl);
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// Register IPC Handlers
function setupIpcHandlers(): void {
  // Window controls
  ipcMain.on('window:minimize', () => {
    mainWindow?.minimize();
  });

  ipcMain.on('window:maximize', () => {
    if (!mainWindow) return;
    if (mainWindow.isMaximized()) {
      mainWindow.unmaximize();
    } else {
      mainWindow.maximize();
    }
  });

  ipcMain.on('window:close', () => {
    mainWindow?.close();
  });

  ipcMain.handle('window:isMaximized', () => {
    return mainWindow ? mainWindow.isMaximized() : false;
  });

  // Storage: Save Memory media (offline image persistence)
  ipcMain.handle('storage:saveMemoryMedia', async (_event, { fileName, dataBase64 }: { fileName: string; dataBase64: string }) => {
    try {
      const storageDir = getMemoryStorageDir();
      const sanitizedName = `${Date.now()}-${fileName.replace(/[^a-zA-Z0-9._-]/g, '')}`;
      const fullPath = path.join(storageDir, sanitizedName);

      const matches = dataBase64.match(/^data:([A-Za-z-+/]+);base64,(.+)$/);
      const buffer = matches ? Buffer.from(matches[2], 'base64') : Buffer.from(dataBase64, 'base64');

      fs.writeFileSync(fullPath, buffer);
      return { success: true, filePath: fullPath, relativePath: sanitizedName };
    } catch (err: any) {
      console.error('[Smriti Care IPC] Error saving media:', err);
      return { success: false, error: err.message };
    }
  });

  // Storage: Read Memory media
  ipcMain.handle('storage:readMemoryMedia', async (_event, filePath: string) => {
    try {
      const storageDir = getMemoryStorageDir();
      const resolvedPath = path.isAbsolute(filePath) ? filePath : path.join(storageDir, path.basename(filePath));
      if (!resolvedPath.startsWith(storageDir)) {
        throw new Error('Access denied: Path outside safe storage directory');
      }

      if (!fs.existsSync(resolvedPath)) {
        throw new Error('File does not exist');
      }

      const buffer = fs.readFileSync(resolvedPath);
      const ext = path.extname(resolvedPath).replace('.', '').toLowerCase();
      const mimeType = ext === 'png' ? 'image/png' : ext === 'webp' ? 'image/webp' : 'image/jpeg';
      const base64 = `data:${mimeType};base64,${buffer.toString('base64')}`;

      return { success: true, dataBase64: base64 };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  });

  // Storage: Save structured user data (JSON)
  ipcMain.handle('storage:saveUserData', async (_event, { key, data }: { key: string; data: any }) => {
    try {
      const dir = getUserDataStoreDir();
      const safeKey = key.replace(/[^a-zA-Z0-9_-]/g, '');
      const filePath = path.join(dir, `${safeKey}.json`);
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  });

  // Storage: Load structured user data (JSON)
  ipcMain.handle('storage:loadUserData', async (_event, key: string) => {
    try {
      const dir = getUserDataStoreDir();
      const safeKey = key.replace(/[^a-zA-Z0-9_-]/g, '');
      const filePath = path.join(dir, `${safeKey}.json`);
      if (!fs.existsSync(filePath)) {
        return { success: true, data: null };
      }
      const raw = fs.readFileSync(filePath, 'utf-8');
      return { success: true, data: JSON.parse(raw) };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  });

  // Safe native file selection dialog for photos
  ipcMain.handle('dialog:selectImageFile', async () => {
    if (!mainWindow) return { canceled: true };
    try {
      const result = await dialog.showOpenDialog(mainWindow, {
        title: 'Select Photo for Memory Vault',
        properties: ['openFile'],
        filters: [
          { name: 'Images', extensions: ['jpg', 'jpeg', 'png', 'webp', 'gif'] },
        ],
      });

      if (result.canceled || result.filePaths.length === 0) {
        return { canceled: true };
      }

      const selectedPath = result.filePaths[0];
      const buffer = fs.readFileSync(selectedPath);
      const ext = path.extname(selectedPath).replace('.', '').toLowerCase();
      const mimeType = ext === 'png' ? 'image/png' : ext === 'webp' ? 'image/webp' : 'image/jpeg';
      const base64 = `data:${mimeType};base64,${buffer.toString('base64')}`;
      const fileName = path.basename(selectedPath);

      return {
        canceled: false,
        filePath: selectedPath,
        fileName,
        dataBase64: base64,
      };
    } catch (err) {
      console.error('[Smriti Care IPC] File selection error:', err);
      return { canceled: true };
    }
  });

  // Shell open external URL
  ipcMain.handle('shell:openExternal', async (_event, url: string) => {
    try {
      if (url && (url.startsWith('https://') || url.startsWith('http://'))) {
        await shell.openExternal(url);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  });

  // Diagnostic paths
  ipcMain.handle('app:getPaths', async () => {
    return {
      userData: app.getPath('userData'),
      appData: app.getPath('appData'),
    };
  });
}

// App lifecycle
app.whenReady().then(() => {
  setupIpcHandlers();
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
