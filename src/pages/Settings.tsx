import React, { useEffect, useState } from 'react';
import { Form, TextInput, Toggle, Select, SelectItem, Button, InlineNotification } from '@carbon/react';

const defaultSettings = {
  username: '',
  darkmode: false,
  language: 'en',
};

const Settings: React.FC = () => {
  const [settings, setSettings] = useState(defaultSettings);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (window.electronAPI) {
      window.electronAPI.invoke('get-settings').then((data) => {
        setSettings({
          username: data.username || '',
          darkmode: data.darkmode === 'true',
          language: data.language || 'en',
        });
        setLoading(false);
      });
    }
  }, []);

  const handleChange = (e: any) => {
    const { id, value, checked, type } = e.target;
    setSettings((prev) => ({
      ...prev,
      [id]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSave = async () => {
    if (window.electronAPI) {
      await window.electronAPI.invoke('set-setting', 'username', settings.username);
      await window.electronAPI.invoke('set-setting', 'darkmode', settings.darkmode ? 'true' : 'false');
      await window.electronAPI.invoke('set-setting', 'language', settings.language);
      await window.electronAPI.invoke('log-message', `Settings saved: ${JSON.stringify(settings)}`);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: 24 }}>
      <h2>App Settings</h2>
      <Form>
        <TextInput id="username" labelText="Username" value={settings.username} onChange={handleChange} style={{ marginBottom: 16 }} />
        <Toggle id="darkmode" labelText="Enable Dark Mode" labelA="Off" labelB="On" toggled={settings.darkmode} onChange={handleChange} style={{ marginBottom: 16 }} />
        <Select id="language" labelText="Language" value={settings.language} onChange={handleChange} style={{ marginBottom: 16 }}>
          <SelectItem value="en" text="English" />
          <SelectItem value="tr" text="Turkish" />
          <SelectItem value="de" text="German" />
        </Select>
        <Button kind="primary" onClick={handleSave}>Save Settings</Button>
      </Form>
      {saved && <InlineNotification kind="success" title="Settings saved!" lowContrast style={{ marginTop: 16 }} />}
    </div>
  );
};

export default Settings; 