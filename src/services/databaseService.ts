import { Settings } from '../types';
import { logger, logInfo, logError, logDebug, logWarn } from './loggerService';

// Extend Window interface to include Tauri
declare global {
  interface Window {
    __TAURI__?: any;
  }
}

// Database service for interacting with SQLite via Tauri
export class DatabaseService {
  private static invokeFunction: any = null;

  /**
   * Get the Tauri invoke function safely
   */
  private static async getInvokeFunction() {
    if (this.invokeFunction) {
      return this.invokeFunction;
    }

    // Check if we're in a Tauri environment
    if (typeof window !== 'undefined' && window.__TAURI__) {
      try {
        const tauriModule = await import('@tauri-apps/api/core');
        if (tauriModule.invoke && typeof tauriModule.invoke === 'function') {
          this.invokeFunction = tauriModule.invoke;
          logDebug('Tauri invoke function successfully loaded');
          return this.invokeFunction;
        } else {
          logDebug('Tauri module loaded but invoke function not found');
        }
      } catch (error) {
        logDebug('Tauri invoke not available', { error: error instanceof Error ? error.message : 'Unknown error' });
      }
    } else {
      logDebug('Not running in Tauri environment');
    }
    
    return null;
  }

  /**
   * Get settings from the database
   */
  static async getSettings(): Promise<Settings> {
    logger.logFunctionCall('DatabaseService.getSettings');
    
    try {
      logDebug('Invoking Tauri command: get_settings');
      const startTime = performance.now();
      
      const invoke = await this.getInvokeFunction();
      if (!invoke) {
        // Don't log this as an error since it's expected during development
        logDebug('Tauri invoke function not available, returning default settings');
        return {
          theme: 'auto',
          language: 'en',
          notifications: true,
          emailNotifications: false,
          autoSave: true,
          autoSaveInterval: 5,
          privacyMode: false,
          dataCollection: true,
          username: 'user@example.com',
          displayName: 'John Doe',
          bio: '',
        };
      }
      
      const settings = await invoke('get_settings') as Settings;
      
      const duration = performance.now() - startTime;
      logger.logPerformance('get_settings', duration, { success: true });
      
      logInfo('Settings retrieved successfully', {
        theme: settings.theme,
        language: settings.language,
        username: settings.username,
        duration: `${duration.toFixed(2)}ms`
      });
      
      logger.logFunctionReturn('DatabaseService.getSettings', { success: true });
      return settings;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      // Only log as error if it's not a Tauri availability issue
      if (errorMessage.includes('Tauri invoke function not available')) {
        logDebug('Tauri not available, returning default settings', { error: errorMessage });
      } else {
        logError('Failed to get settings from database', error instanceof Error ? error : new Error(errorMessage), {
          operation: 'get_settings',
          error: errorMessage
        });
      }
      
      logger.logFunctionReturn('DatabaseService.getSettings', { success: false, error: errorMessage });
      
      // Return default settings if database fails
      logWarn('Returning default settings due to database error');
      return {
        theme: 'auto',
        language: 'en',
        notifications: true,
        emailNotifications: false,
        autoSave: true,
        autoSaveInterval: 5,
        privacyMode: false,
        dataCollection: true,
        username: 'user@example.com',
        displayName: 'John Doe',
        bio: '',
      };
    }
  }

  /**
   * Update settings in the database
   */
  static async updateSettings(settings: Settings): Promise<void> {
    logger.logFunctionCall('DatabaseService.updateSettings', { 
      theme: settings.theme,
      language: settings.language,
      username: settings.username 
    });
    
    try {
      logDebug('Invoking Tauri command: update_settings', {
        theme: settings.theme,
        language: settings.language
      });
      
      const startTime = performance.now();
      const invoke = await this.getInvokeFunction();
      if (!invoke) {
        throw new Error('Tauri invoke function not available');
      }
      
      await invoke('update_settings', { settings });
      const duration = performance.now() - startTime;
      
      logger.logPerformance('update_settings', duration, { success: true });
      
      logInfo('Settings updated successfully', {
        theme: settings.theme,
        language: settings.language,
        duration: `${duration.toFixed(2)}ms`
      });
      
      logger.logFunctionReturn('DatabaseService.updateSettings', { success: true });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      logError('Failed to update settings in database', error instanceof Error ? error : new Error(errorMessage), {
        operation: 'update_settings',
        error: errorMessage
      });
      
      logger.logFunctionReturn('DatabaseService.updateSettings', { success: false, error: errorMessage });
      throw new Error('Failed to save settings to database');
    }
  }

  /**
   * Reset settings to defaults
   */
  static async resetSettings(): Promise<void> {
    logger.logFunctionCall('DatabaseService.resetSettings');
    
    try {
      logWarn('Invoking Tauri command: reset_settings');
      const startTime = performance.now();
      
      const invoke = await this.getInvokeFunction();
      if (!invoke) {
        throw new Error('Tauri invoke function not available');
      }
      
      await invoke('reset_settings');
      const duration = performance.now() - startTime;
      
      logger.logPerformance('reset_settings', duration, { success: true });
      
      logInfo('Settings reset successfully', {
        duration: `${duration.toFixed(2)}ms`
      });
      
      logger.logFunctionReturn('DatabaseService.resetSettings', { success: true });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      logError('Failed to reset settings', error instanceof Error ? error : new Error(errorMessage), {
        operation: 'reset_settings',
        error: errorMessage
      });
      
      logger.logFunctionReturn('DatabaseService.resetSettings', { success: false, error: errorMessage });
      throw new Error('Failed to reset settings');
    }
  }

  /**
   * Save a specific setting
   */
  static async saveSetting<K extends keyof Settings>(
    key: K,
    value: Settings[K]
  ): Promise<void> {
    logger.logFunctionCall('DatabaseService.saveSetting', { key: String(key), value });
    
    try {
      logDebug('Saving individual setting', { key: String(key), value });
      
      const currentSettings = await this.getSettings();
      const updatedSettings = { ...currentSettings, [key]: value };
      
      await this.updateSettings(updatedSettings);
      
      logInfo('Individual setting saved successfully', {
        key: String(key),
        value,
        success: true
      });
      
      logger.logFunctionReturn('DatabaseService.saveSetting', { success: true });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      logError(`Failed to save setting ${String(key)}`, error instanceof Error ? error : new Error(errorMessage), {
        operation: 'saveSetting',
        key: String(key),
        value,
        error: errorMessage
      });
      
      logger.logFunctionReturn('DatabaseService.saveSetting', { success: false, error: errorMessage });
      throw new Error(`Failed to save ${String(key)}`);
    }
  }

  /**
   * Get a specific setting
   */
  static async getSetting<K extends keyof Settings>(
    key: K
  ): Promise<Settings[K]> {
    logger.logFunctionCall('DatabaseService.getSetting', { key: String(key) });
    
    try {
      logDebug('Getting individual setting', { key: String(key) });
      
      const settings = await this.getSettings();
      const value = settings[key];
      
      logInfo('Individual setting retrieved successfully', {
        key: String(key),
        value,
        success: true
      });
      
      logger.logFunctionReturn('DatabaseService.getSetting', { success: true, value });
      return value;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      logError(`Failed to get setting ${String(key)}`, error instanceof Error ? error : new Error(errorMessage), {
        operation: 'getSetting',
        key: String(key),
        error: errorMessage
      });
      
      logger.logFunctionReturn('DatabaseService.getSetting', { success: false, error: errorMessage });
      throw new Error(`Failed to get ${String(key)}`);
    }
  }
}

export default DatabaseService;