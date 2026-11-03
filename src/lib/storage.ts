export interface AppSettings {
  theme: 'light' | 'dark';
  compactDensity: boolean;
  defaultExportFormat: 'csv' | 'xlsx' | 'json';
  autoSyncMinutes: number;
  dbPath: string;
}

const DEFAULT_SETTINGS: AppSettings = {
  theme: 'light',
  compactDensity: false,
  defaultExportFormat: 'csv',
  autoSyncMinutes: 60,
  dbPath: '%APPDATA%\\ReviewPilot\\reviewpilot.db',
};

const STORAGE_KEY = 'reviewpilot_settings_v1';

export function loadSettings(): AppSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveSettings(settings: AppSettings): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch (e) {
    console.error('Failed to save settings to localStorage:', e);
  }
}

