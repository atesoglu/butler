import React, { useState, useEffect } from 'react';
import { Button, InlineNotification, Tile } from '@carbon/react';
import { useSettings } from '../hooks/useSettings';

const DatabaseTest: React.FC = () => {
  const { settings, loading, error, updateSetting, resetSettings } = useSettings();
  const [testResult, setTestResult] = useState<string>('');

  const testDatabase = async () => {
    try {
      if (!settings) {
        setTestResult('No settings loaded');
        return;
      }

      // Test updating a setting
      await updateSetting('theme', 'dark');
      setTestResult('Database test successful! Theme updated to dark.');
      
      // Reset after a delay
      setTimeout(async () => {
        await updateSetting('theme', 'auto');
        setTestResult('Database test completed! Theme reset to auto.');
      }, 2000);
    } catch (err) {
      setTestResult(`Database test failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  const testReset = async () => {
    try {
      await resetSettings();
      setTestResult('Settings reset successfully!');
    } catch (err) {
      setTestResult(`Reset failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  if (loading) {
    return <InlineNotification kind="info" title="Loading" subtitle="Loading settings from database..." />;
  }

  if (error) {
    return <InlineNotification kind="error" title="Error" subtitle={error} />;
  }

  return (
    <Tile>
      <h3>Database Test</h3>
      <p>Current theme: <strong>{settings?.theme}</strong></p>
      <p>Current language: <strong>{settings?.language}</strong></p>
      <p>Notifications enabled: <strong>{settings?.notifications ? 'Yes' : 'No'}</strong></p>
      
      <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
        <Button onClick={testDatabase}>Test Database</Button>
        <Button kind="secondary" onClick={testReset}>Reset Settings</Button>
      </div>
      
      {testResult && (
        <InlineNotification
          kind="success"
          title="Test Result"
          subtitle={testResult}
          style={{ marginTop: '1rem' }}
        />
      )}
    </Tile>
  );
};

export default DatabaseTest; 