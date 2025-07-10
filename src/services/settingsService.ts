import { Settings } from '../types';
import { DEFAULT_SETTINGS } from '../constants';

class SettingsService {
  private readonly STORAGE_KEY = 'butler-settings';

  async getSettings(): Promise<Settings> {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        return { ...DEFAULT_SETTINGS, ...JSON.parse(stored) };
      }
      return { ...DEFAULT_SETTINGS };
    } catch (error) {
      console.error('Error loading settings:', error);
      return { ...DEFAULT_SETTINGS };
    }
  }

  async saveSettings(settings: Partial<Settings>): Promise<void> {
    try {
      const currentSettings = await this.getSettings();
      const updatedSettings = { ...currentSettings, ...settings };
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updatedSettings));
    } catch (error) {
      console.error('Error saving settings:', error);
      throw new Error('Failed to save settings');
    }
  }

  async resetSettings(): Promise<void> {
    try {
      localStorage.removeItem(this.STORAGE_KEY);
    } catch (error) {
      console.error('Error resetting settings:', error);
      throw new Error('Failed to reset settings');
    }
  }

  async updateTheme(theme: Settings['theme']): Promise<void> {
    await this.saveSettings({ theme });
    this.applyTheme(theme);
  }

  private applyTheme(theme: Settings['theme']): void {
    const root = document.documentElement;
    
    if (theme === 'dark' || (theme === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      root.setAttribute('data-carbon-theme', 'g100');
    } else {
      root.setAttribute('data-carbon-theme', 'white');
    }
  }
}

export const settingsService = new SettingsService(); 