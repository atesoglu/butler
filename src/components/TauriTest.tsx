import React, { useState, useEffect } from 'react';
import { Button, Tile, Tag, Loading } from '@carbon/react';
import { Checkmark, Close } from '@carbon/icons-react';
import { logService } from '../services/logService';
import { DatabaseService } from '../services/databaseService';

const TauriTest: React.FC = () => {
  const [tauriStatus, setTauriStatus] = useState<'checking' | 'available' | 'unavailable'>('checking');
  const [databaseStatus, setDatabaseStatus] = useState<'checking' | 'working' | 'error'>('checking');
  const [logStatus, setLogStatus] = useState<'checking' | 'working' | 'error'>('checking');
  const [testResults, setTestResults] = useState<string[]>([]);

  useEffect(() => {
    runTests();
  }, []);

  const runTests = async () => {
    const results: string[] = [];
    
    // Test 1: Check if Tauri is available
    try {
      if (typeof window !== 'undefined' && window.__TAURI__) {
        setTauriStatus('available');
        results.push('✅ Tauri environment detected');
      } else {
        setTauriStatus('unavailable');
        results.push('❌ Tauri environment not detected');
      }
    } catch (error) {
      setTauriStatus('unavailable');
      results.push('❌ Tauri environment check failed');
    }

    // Test 2: Test database service
    try {
      const settings = await DatabaseService.getSettings();
      setDatabaseStatus('working');
      results.push('✅ Database service working');
      results.push(`   Theme: ${settings.theme}, Language: ${settings.language}`);
    } catch (error) {
      setDatabaseStatus('error');
      results.push('❌ Database service failed');
      results.push(`   Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }

    // Test 3: Test log service
    try {
      const logCount = await logService.getLogCount();
      setLogStatus('working');
      results.push('✅ Log service working');
      results.push(`   Current log count: ${logCount}`);
    } catch (error) {
      setLogStatus('error');
      results.push('❌ Log service failed');
      results.push(`   Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }

    setTestResults(results);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
      case 'working':
        return 'green';
      case 'unavailable':
      case 'error':
        return 'red';
      default:
        return 'warm-gray';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'available':
      case 'working':
        return <Checkmark size={16} />;
      case 'unavailable':
      case 'error':
        return <Close size={16} />;
      default:
        return <Loading small />;
    }
  };

  return (
    <div style={{ padding: '1rem' }}>
      <h3>Tauri Integration Test</h3>
      
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
        <Tag type={getStatusColor(tauriStatus)} size="md">
          {getStatusIcon(tauriStatus)} Tauri: {tauriStatus}
        </Tag>
        <Tag type={getStatusColor(databaseStatus)} size="md">
          {getStatusIcon(databaseStatus)} Database: {databaseStatus}
        </Tag>
        <Tag type={getStatusColor(logStatus)} size="md">
          {getStatusIcon(logStatus)} Logs: {logStatus}
        </Tag>
      </div>

      <Tile style={{ marginBottom: '1rem' }}>
        <h4>Test Results:</h4>
        <div style={{ fontFamily: 'monospace', fontSize: '0.875rem' }}>
          {testResults.map((result, index) => (
            <div key={index} style={{ marginBottom: '0.25rem' }}>
              {result}
            </div>
          ))}
        </div>
      </Tile>

      <Button onClick={runTests} size="sm">
        Run Tests Again
      </Button>

      <div style={{ marginTop: '1rem', fontSize: '0.875rem', color: 'var(--cds-text-secondary)' }}>
        <p><strong>Expected Behavior:</strong></p>
        <ul>
          <li>Tauri should be "available" when running in Tauri app</li>
          <li>Database should be "working" when Tauri is available</li>
          <li>Logs should be "working" when Tauri is available</li>
          <li>All services should show "error" when running in browser</li>
        </ul>
      </div>
    </div>
  );
};

export default TauriTest; 