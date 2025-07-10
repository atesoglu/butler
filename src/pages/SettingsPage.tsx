import React from "react";
import {
  Grid,
  Column,
  Form,
  FormGroup,
  TextInput,
  Select,
  SelectItem,
  Checkbox,
  Toggle,
  NumberInput,
  TextArea,
  Button,
  InlineLoading,
  InlineNotification,
  Tile,
  Tag,
} from "@carbon/react";
import { Save, Reset, User, Notification as NotificationIcon, Security, Settings as SettingsIcon } from "@carbon/icons-react";
import { THEME_OPTIONS, LANGUAGE_OPTIONS } from "../constants";
import { useSettings } from "../hooks/useSettings";
import { logger, logInfo, logError, logDebug, logWarn } from "../services/loggerService";
import { Settings } from "../types";

const SettingsPage: React.FC = () => {
  logger.logFunctionCall('SettingsPage.render');
  
  const {
    settings,
    loading,
    error,
    updateSetting,
    updateSettings,
    resetSettings,
  } = useSettings();

  const handleSave = async () => {
    logger.logFunctionCall('SettingsPage.handleSave');
    
    if (!settings) {
      logWarn('Cannot save settings: no settings available');
      return;
    }
    
    try {
      logDebug('Saving all settings', {
        theme: settings.theme,
        language: settings.language,
        username: settings.username
      });
      
      const startTime = performance.now();
      await updateSettings(settings);
      const duration = performance.now() - startTime;
      
      logger.logPerformance('saveAllSettings', duration, { success: true });
      logInfo('All settings saved successfully', {
        duration: `${duration.toFixed(2)}ms`
      });
      
      logger.logUserAction('save_settings', {
        theme: settings.theme,
        language: settings.language,
        duration: `${duration.toFixed(2)}ms`
      });
      
      logger.logFunctionReturn('SettingsPage.handleSave', { success: true });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      logError('Failed to save settings', err instanceof Error ? err : new Error(errorMessage), {
        operation: 'handleSave',
        error: errorMessage
      });
      
      logger.logFunctionReturn('SettingsPage.handleSave', { success: false, error: errorMessage });
    }
  };

  const handleReset = async () => {
    logger.logFunctionCall('SettingsPage.handleReset');
    
    try {
      logWarn('User requested settings reset');
      
      const startTime = performance.now();
      await resetSettings();
      const duration = performance.now() - startTime;
      
      logger.logPerformance('resetSettings', duration, { success: true });
      logInfo('Settings reset successfully', {
        duration: `${duration.toFixed(2)}ms`
      });
      
      logger.logUserAction('reset_settings', {
        duration: `${duration.toFixed(2)}ms`
      });
      
      logger.logFunctionReturn('SettingsPage.handleReset', { success: true });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      logError('Failed to reset settings', err instanceof Error ? err : new Error(errorMessage), {
        operation: 'handleReset',
        error: errorMessage
      });
      
      logger.logFunctionReturn('SettingsPage.handleReset', { success: false, error: errorMessage });
    }
  };

  const handleSettingChange = <K extends keyof Settings>(
    key: K,
    value: Settings[K]
  ) => {
    logger.logFunctionCall('SettingsPage.handleSettingChange', { key: String(key), value });
    
    logDebug('Setting changed by user', { key: String(key), value });
    updateSetting(key, value);
    
    logger.logUserAction('setting_changed', {
      key: String(key),
      value,
      success: true
    });
    
    logger.logFunctionReturn('SettingsPage.handleSettingChange', { success: true });
  };

  if (loading) {
    logDebug('Settings page showing loading state');
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <InlineLoading description="Loading settings..." />
      </div>
    );
  }

  if (!settings) {
    logError('Settings page: no settings available', new Error('Settings not loaded'), {
      operation: 'SettingsPage.render',
      loading,
      error
    });
    
    return (
      <div style={{ padding: "2rem" }}>
        <InlineNotification
          kind="error"
          title="Error"
          subtitle="Failed to load settings"
        />
      </div>
    );
  }

  logDebug('Settings page rendering with settings', {
    theme: settings.theme,
    language: settings.language,
    hasError: !!error
  });

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Settings</h1>
      <p>Configure your application preferences and account settings.</p>

      {error && (
        <InlineNotification
          kind="error"
          title="Error"
          subtitle={error}
          style={{ marginBottom: "1rem" }}
        />
      )}

      <Form>
        <Grid fullWidth>
          <Column lg={8} md={4} sm={4}>
            {/* Theme Settings */}
            <Tile style={{ marginBottom: "2rem" }}>
              <div style={{ display: "flex", alignItems: "center", marginBottom: "1rem" }}>
                <SettingsIcon size={20} style={{ marginRight: "0.5rem" }} />
                <h3>Appearance</h3>
              </div>
              <FormGroup legendText="Theme">
                <Select
                  id="theme-select"
                  labelText="Theme"
                  value={settings.theme}
                  onChange={(e) => handleSettingChange('theme', e.target.value as 'light' | 'dark' | 'auto')}
                >
                  {THEME_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value} text={option.label} />
                  ))}
                </Select>
              </FormGroup>
              <FormGroup legendText="Language">
                <Select
                  id="language-select"
                  labelText="Language"
                  value={settings.language}
                  onChange={(e) => handleSettingChange('language', e.target.value)}
                >
                  {LANGUAGE_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value} text={option.label} />
                  ))}
                </Select>
              </FormGroup>
            </Tile>

            {/* Notification Settings */}
            <Tile style={{ marginBottom: "2rem" }}>
              <div style={{ display: "flex", alignItems: "center", marginBottom: "1rem" }}>
                <NotificationIcon size={20} style={{ marginRight: "0.5rem" }} />
                <h3>Notifications</h3>
              </div>
              <FormGroup legendText="Notification Settings">
                <Checkbox
                  id="notifications"
                  labelText="Enable notifications"
                  checked={settings.notifications}
                  onChange={(_, { checked }) => handleSettingChange('notifications', checked)}
                />
              </FormGroup>
              <FormGroup legendText="Email Settings">
                <Checkbox
                  id="email-notifications"
                  labelText="Email notifications"
                  checked={settings.emailNotifications}
                  onChange={(_, { checked }) => handleSettingChange('emailNotifications', checked)}
                />
              </FormGroup>
            </Tile>

            {/* Auto-save Settings */}
            <Tile style={{ marginBottom: "2rem" }}>
              <div style={{ display: "flex", alignItems: "center", marginBottom: "1rem" }}>
                <SettingsIcon size={20} style={{ marginRight: "0.5rem" }} />
                <h3>Auto-save</h3>
              </div>
              <FormGroup legendText="Auto-save Settings">
                <Checkbox
                  id="auto-save"
                  labelText="Enable auto-save"
                  checked={settings.autoSave}
                  onChange={(_, { checked }) => handleSettingChange('autoSave', checked)}
                />
              </FormGroup>
              {settings.autoSave && (
                <FormGroup legendText="Auto-save Interval">
                  <NumberInput
                    id="auto-save-interval"
                    label="Auto-save interval (minutes)"
                    value={settings.autoSaveInterval}
                    min={1}
                    max={60}
                    onChange={(e) => {
                      const target = e.target as HTMLInputElement;
                      handleSettingChange('autoSaveInterval', parseInt(target.value) || 5);
                    }}
                  />
                </FormGroup>
              )}
            </Tile>

            {/* Privacy Settings */}
            <Tile style={{ marginBottom: "2rem" }}>
              <div style={{ display: "flex", alignItems: "center", marginBottom: "1rem" }}>
                <Security size={20} style={{ marginRight: "0.5rem" }} />
                <h3>Privacy & Security</h3>
              </div>
              <FormGroup legendText="Privacy Settings">
                <Toggle
                  id="privacy-mode"
                  labelText="Privacy mode"
                  labelA="Off"
                  labelB="On"
                  toggled={settings.privacyMode}
                  onChange={() => handleSettingChange('privacyMode', !settings.privacyMode)}
                />
              </FormGroup>
              <FormGroup legendText="Data Collection">
                <Checkbox
                  id="data-collection"
                  labelText="Allow data collection for analytics"
                  checked={settings.dataCollection}
                  onChange={(_, { checked }) => handleSettingChange('dataCollection', checked)}
                />
              </FormGroup>
            </Tile>

            {/* Account Information */}
            <Tile style={{ marginBottom: "2rem" }}>
              <div style={{ display: "flex", alignItems: "center", marginBottom: "1rem" }}>
                <User size={20} style={{ marginRight: "0.5rem" }} />
                <h3>Account Information</h3>
              </div>
              <FormGroup legendText="Account Details">
                <TextInput
                  id="username"
                  labelText="Username"
                  value={settings.username}
                  onChange={(e) => handleSettingChange('username', e.target.value)}
                />
              </FormGroup>
              <FormGroup legendText="Profile Information">
                <TextInput
                  id="display-name"
                  labelText="Display Name"
                  value={settings.displayName}
                  onChange={(e) => handleSettingChange('displayName', e.target.value)}
                />
              </FormGroup>
              <FormGroup legendText="Bio">
                <TextArea
                  id="bio"
                  labelText="Bio"
                  value={settings.bio}
                  onChange={(e) => handleSettingChange('bio', e.target.value)}
                  rows={3}
                />
              </FormGroup>
            </Tile>

            {/* Action Buttons */}
            <div style={{ display: "flex", gap: "1rem", marginTop: "2rem" }}>
              <Button
                kind="primary"
                renderIcon={Save}
                onClick={handleSave}
              >
                Save Settings
              </Button>
              <Button
                kind="secondary"
                renderIcon={Reset}
                onClick={handleReset}
              >
                Reset to Defaults
              </Button>
            </div>
          </Column>

          <Column lg={4} md={4} sm={4}>
            {/* Quick Actions */}
            <Tile>
              <h3>Quick Actions</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <Button kind="ghost" size="sm">
                  Export Settings
                </Button>
                <Button kind="ghost" size="sm">
                  Import Settings
                </Button>
                <Button kind="ghost" size="sm">
                  Clear Cache
                </Button>
                <Button kind="ghost" size="sm">
                  Check for Updates
                </Button>
              </div>
            </Tile>

            <hr style={{ margin: "2rem 0", border: "none", borderTop: "1px solid #e0e0e0" }} />

            {/* Settings Info */}
            <Tile>
              <h3>Settings Info</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                <div>
                  <strong>Theme:</strong> <Tag type="blue">{settings.theme}</Tag>
                </div>
                <div>
                  <strong>Language:</strong> <Tag type="green">{settings.language}</Tag>
                </div>
                <div>
                  <strong>Auto-save:</strong>{" "}
                  <Tag type={settings.autoSave ? "green" : "gray"}>
                    {settings.autoSave ? "Enabled" : "Disabled"}
                  </Tag>
                </div>
                <div>
                  <strong>Notifications:</strong>{" "}
                  <Tag type={settings.notifications ? "green" : "gray"}>
                    {settings.notifications ? "Enabled" : "Disabled"}
                  </Tag>
                </div>
              </div>
            </Tile>
          </Column>
        </Grid>
      </Form>
    </div>
  );
};

export default SettingsPage; 