import React, { useEffect, useState } from 'react';
import {
  Form,
  TextInput,
  Toggle,
  Select,
  SelectItem,
  Button,
  InlineNotification,
  FormGroup,
  FormLabel,
  Stack,
  RadioButtonGroup,
  RadioButton
} from '@carbon/react';
import { useTheme } from '../contexts/ThemeContext';

const defaultSettings = {
  username: '',
  darkmode: false,
  language: 'en',
  email: '',
  notifications: true,
  theme: 'g10' as 'white' | 'g10' | 'g90' | 'g100',
};

const Settings: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const [settings, setSettings] = useState(defaultSettings);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    if (window.electronAPI) {
      window.electronAPI.invoke('get-settings').then((data) => {
        setSettings({
          username: data.username || '',
          darkmode: data.darkmode === 'true',
          language: data.language || 'en',
          email: data.email || '',
          notifications: data.notifications !== 'false',
          theme: (data.theme as 'white' | 'g10' | 'g90' | 'g100') || 'g10',
        });
        setLoading(false);
      });
    }
  }, []);

  // Update local theme when settings change
  useEffect(() => {
    if (settings.theme !== theme) {
      setTheme(settings.theme);
    }
  }, [settings.theme, theme, setTheme]);

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (!settings.username.trim()) {
      newErrors.username = 'Username is required';
    } else if (settings.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }
    
    if (settings.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(settings.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    setErrors(newErrors);
    setIsValid(Object.keys(newErrors).length === 0);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: any) => {
    const { id, value, checked, type } = e.target;
    
    if (id === 'darkmode') {
      // Handle legacy darkmode toggle - sync with theme
      const newDarkMode = checked;
      const newTheme = newDarkMode ? 'g100' : 'g10';
      setSettings(prev => ({ 
        ...prev, 
        darkmode: newDarkMode,
        theme: newTheme
      }));
      setTheme(newTheme);
    } else {
      setSettings((prev) => ({
        ...prev,
        [id]: type === 'checkbox' ? checked : value,
      }));
    }
    
    // Clear error when user starts typing
    if (errors[id]) {
      setErrors(prev => ({ ...prev, [id]: '' }));
    }
  };

  const handleThemeChange = (newTheme: string | number | undefined) => {
    if (typeof newTheme === 'string' && (newTheme === 'white' || newTheme === 'g10' || newTheme === 'g90' || newTheme === 'g100')) {
      const isDarkTheme = newTheme === 'g100' || newTheme === 'g90';
      setSettings(prev => ({ 
        ...prev, 
        theme: newTheme as 'white' | 'g10' | 'g90' | 'g100',
        darkmode: isDarkTheme // Sync legacy darkmode setting
      }));
      setTheme(newTheme as 'white' | 'g10' | 'g90' | 'g100');
    }
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      if (window.electronAPI) {
        await window.electronAPI.invoke('set-setting', 'username', settings.username);
        await window.electronAPI.invoke('set-setting', 'darkmode', settings.darkmode ? 'true' : 'false');
        await window.electronAPI.invoke('set-setting', 'language', settings.language);
        await window.electronAPI.invoke('set-setting', 'email', settings.email);
        await window.electronAPI.invoke('set-setting', 'notifications', settings.notifications ? 'true' : 'false');
        await window.electronAPI.invoke('set-setting', 'theme', settings.theme);
        await window.electronAPI.invoke('log-message', `Settings saved: ${JSON.stringify(settings)}`);
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    } catch (error) {
      console.error('Failed to save settings:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ maxWidth: 600, margin: '0 auto', padding: 24 }}>
        <h2>App Settings</h2>
        <div>Loading settings...</div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: 24 }}>
      <h2>App Settings</h2>
      {saved && (
        <InlineNotification 
          kind="success" 
          title="Settings saved successfully!" 
          subtitle="Your preferences have been updated."
          lowContrast 
          style={{ marginBottom: 24 }}
        />
      )}
      <Form>
        <Stack gap={6}>
          <FormGroup legendText="User Information">
            <FormLabel>Username</FormLabel>
            <TextInput 
              id="username" 
              labelText="" 
              value={settings.username} 
              onChange={handleChange}
              invalid={!!errors.username}
              invalidText={errors.username}
              helperText="Enter your display name (minimum 3 characters)"
            />
            <FormLabel>Email (Optional)</FormLabel>
            <TextInput 
              id="email" 
              labelText="" 
              value={settings.email} 
              onChange={handleChange}
              invalid={!!errors.email}
              invalidText={errors.email}
              helperText="Enter your email address for notifications"
              type="email"
            />
          </FormGroup>
          
          <FormGroup legendText="Appearance">
            <FormLabel>Theme</FormLabel>
            <RadioButtonGroup
              name="theme"
              valueSelected={settings.theme}
              onChange={handleThemeChange}
              legendText=""
            >
              <RadioButton
                id="theme-white"
                labelText="White Theme"
                value="white"
              />
              <RadioButton
                id="theme-light"
                labelText="Light Gray Theme"
                value="g10"
              />
              <RadioButton
                id="theme-dark"
                labelText="Dark Gray Theme"
                value="g90"
              />
              <RadioButton
                id="theme-darker"
                labelText="Dark Theme"
                value="g100"
              />
            </RadioButtonGroup>
          </FormGroup>
          
          <FormGroup legendText="Preferences">
            <FormLabel>Language</FormLabel>
            <Select 
              id="language" 
              labelText="" 
              value={settings.language} 
              onChange={handleChange}
              helperText="Choose your preferred language"
            >
              <SelectItem value="en" text="English" />
              <SelectItem value="tr" text="Turkish" />
              <SelectItem value="de" text="German" />
              <SelectItem value="es" text="Spanish" />
              <SelectItem value="fr" text="French" />
            </Select>
            
            <FormLabel>Dark Mode (Legacy)</FormLabel>
            <Toggle 
              id="darkmode" 
              labelText="Enable Dark Mode" 
              labelA="Off" 
              labelB="On" 
              toggled={settings.darkmode} 
              onChange={handleChange}
            />
            
            <FormLabel>Notifications</FormLabel>
            <Toggle 
              id="notifications" 
              labelText="Enable Notifications" 
              labelA="Off" 
              labelB="On" 
              toggled={settings.notifications} 
              onChange={handleChange}
            />
          </FormGroup>
          
          <Button 
            kind="primary" 
            onClick={handleSave}
            disabled={!isValid || loading}
          >
            {loading ? 'Saving...' : 'Save Settings'}
          </Button>
        </Stack>
      </Form>
    </div>
  );
};

export default Settings; 