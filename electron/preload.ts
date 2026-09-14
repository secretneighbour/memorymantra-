import { contextBridge, ipcRenderer } from 'electron';

// Expose secure, limited APIs to the renderer process
contextBridge.exposeInMainWorld('electronAPI', {
  isElectron: true,
  platform: process.platform,
  appVersion: '1.0.0',

  // Window Controls
  minimize: () => ipcRenderer.send('window:minimize'),
  maximize: () => ipcRenderer.send('window:maximize'),
  close: () => ipcRenderer.send('window:close'),
  isMaximized: () => ipcRenderer.invoke('window:isMaximized'),

  // Safe Memory Vault & Media Storage
  saveMemoryMedia: (params: { fileName: string; dataBase64: string }) =>
    ipcRenderer.invoke('storage:saveMemoryMedia', params),
  readMemoryMedia: (filePath: string) =>
    ipcRenderer.invoke('storage:readMemoryMedia', filePath),

  // Persistent App Data
  saveUserData: (key: string, data: any) =>
    ipcRenderer.invoke('storage:saveUserData', { key, data }),
  loadUserData: (key: string) =>
    ipcRenderer.invoke('storage:loadUserData', key),

  // Safe Native File Picker
  selectImageFile: () =>
    ipcRenderer.invoke('dialog:selectImageFile'),

  // Safe External URL Handler
  openExternalUrl: (url: string) =>
    ipcRenderer.invoke('shell:openExternal', url),

  // App Diagnostics
  getAppPaths: () =>
    ipcRenderer.invoke('app:getPaths'),
});
