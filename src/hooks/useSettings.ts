import { useState, useEffect, useCallback } from 'react';
import { Settings } from '../types';
import DatabaseService from '../services/databaseService';
import { logger, logInfo, logError, logDebug, logWarn } from '../services/loggerService';

export const useSettings = () => {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load settings from database
  const loadSettings = useCallback(async () => {
    logger.logFunctionCall('useSettings.loadSettings');
    
    try {
      logDebug('Loading settings from database');
      setLoading(true);
      setError(null);
      
      const startTime = performance.now();
      const data = await DatabaseService.getSettings();
      const duration = performance.now() - startTime;
      
      logger.logPerformance('loadSettings', duration, { success: true });
      
      setSettings(data);
      logInfo('Settings loaded successfully', {
        theme: data.theme,
        language: data.language,
        duration: `${duration.toFixed(2)}ms`
      });
      
      logger.logFunctionReturn('useSettings.loadSettings', { success: true });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      logError('Failed to load settings', err instanceof Error ? err : new Error(errorMessage), {
        operation: 'loadSettings',
        error: errorMessage
      });
      
      setError(errorMessage);
      logger.logFunctionReturn('useSettings.loadSettings', { success: false, error: errorMessage });
    } finally {
      setLoading(false);
    }
  }, []);

  // Update a single setting
  const updateSetting = useCallback(async <K extends keyof Settings>(
    key: K,
    value: Settings[K]
  ) => {
    logger.logFunctionCall('useSettings.updateSetting', { key: String(key), value });
    
    if (!settings) {
      logWarn('Cannot update setting: no settings loaded', { key: String(key), value });
      return;
    }

    try {
      logDebug('Updating single setting', { key: String(key), value });
      setError(null);
      
      const startTime = performance.now();
      const updatedSettings = { ...settings, [key]: value };
      await DatabaseService.updateSettings(updatedSettings);
      const duration = performance.now() - startTime;
      
      logger.logPerformance('updateSetting', duration, { success: true });
      
      setSettings(updatedSettings);
      logInfo('Single setting updated successfully', {
        key: String(key),
        value,
        duration: `${duration.toFixed(2)}ms`
      });
      
      logger.logFunctionReturn('useSettings.updateSetting', { success: true });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      logError('Failed to update single setting', err instanceof Error ? err : new Error(errorMessage), {
        operation: 'updateSetting',
        key: String(key),
        value,
        error: errorMessage
      });
      
      setError(errorMessage);
      logger.logFunctionReturn('useSettings.updateSetting', { success: false, error: errorMessage });
      throw err;
    }
  }, [settings]);

  // Update multiple settings at once
  const updateSettings = useCallback(async (newSettings: Partial<Settings>) => {
    logger.logFunctionCall('useSettings.updateSettings', { newSettings });
    
    if (!settings) {
      logWarn('Cannot update settings: no settings loaded', { newSettings });
      return;
    }

    try {
      logDebug('Updating multiple settings', { newSettings });
      setError(null);
      
      const startTime = performance.now();
      const updatedSettings = { ...settings, ...newSettings };
      await DatabaseService.updateSettings(updatedSettings);
      const duration = performance.now() - startTime;
      
      logger.logPerformance('updateSettings', duration, { success: true });
      
      setSettings(updatedSettings);
      logInfo('Multiple settings updated successfully', {
        updatedKeys: Object.keys(newSettings),
        duration: `${duration.toFixed(2)}ms`
      });
      
      logger.logFunctionReturn('useSettings.updateSettings', { success: true });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      logError('Failed to update multiple settings', err instanceof Error ? err : new Error(errorMessage), {
        operation: 'updateSettings',
        newSettings,
        error: errorMessage
      });
      
      setError(errorMessage);
      logger.logFunctionReturn('useSettings.updateSettings', { success: false, error: errorMessage });
      throw err;
    }
  }, [settings]);

  // Reset settings to defaults
  const resetSettings = useCallback(async () => {
    logger.logFunctionCall('useSettings.resetSettings');
    
    try {
      logWarn('Resetting settings to defaults');
      setError(null);
      
      const startTime = performance.now();
      await DatabaseService.resetSettings();
      const duration = performance.now() - startTime;
      
      logger.logPerformance('resetSettings', duration, { success: true });
      
      await loadSettings(); // Reload settings after reset
      logInfo('Settings reset to defaults successfully', {
        duration: `${duration.toFixed(2)}ms`
      });
      
      logger.logFunctionReturn('useSettings.resetSettings', { success: true });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      logError('Failed to reset settings', err instanceof Error ? err : new Error(errorMessage), {
        operation: 'resetSettings',
        error: errorMessage
      });
      
      setError(errorMessage);
      logger.logFunctionReturn('useSettings.resetSettings', { success: false, error: errorMessage });
      throw err;
    }
  }, [loadSettings]);

  // Load settings on mount
  useEffect(() => {
    logDebug('useSettings hook mounted, loading settings');
    loadSettings();
  }, [loadSettings]);

  return {
    settings,
    loading,
    error,
    updateSetting,
    updateSettings,
    resetSettings,
    reloadSettings: loadSettings,
  };
}; 