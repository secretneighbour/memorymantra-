export interface ElectronAPI {
  isElectron: boolean;
  platform: string;
  appVersion: string;

  // Window Controls
  minimize: () => void;
  maximize: () => void;
  close: () => void;
  isMaximized: () => Promise<boolean>;

  // Safe Memory Vault & Media Storage
  saveMemoryMedia: (params: {
    fileName: string;
    dataBase64: string;
  }) => Promise<{
    success: boolean;
    filePath?: string;
    relativePath?: string;
    error?: string;
  }>;
  readMemoryMedia: (filePath: string) => Promise<{
    success: boolean;
    dataBase64?: string;
    error?: string;
  }>;

  // Persistent App Data
  saveUserData: (key: string, data: any) => Promise<{
    success: boolean;
    error?: string;
  }>;
  loadUserData: (key: string) => Promise<{
    success: boolean;
    data?: any;
    error?: string;
  }>;

  // Safe Native File Picker
  selectImageFile: () => Promise<{
    canceled: boolean;
    fileName?: string;
    dataBase64?: string;
    filePath?: string;
  }>;

  // Safe External URL Handler
  openExternalUrl: (url: string) => Promise<boolean>;

  // App Diagnostics
  getAppPaths: () => Promise<{
    userData: string;
    appData: string;
  }>;
}

declare global {
  interface Window {
    electronAPI?: ElectronAPI;
  }
}
