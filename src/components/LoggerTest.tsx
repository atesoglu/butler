import React from 'react';
import { Button, Tile, Grid, Column } from '@carbon/react';
import { logger, logInfo, logError, logWarn, logDebug } from '../services/loggerService';

const LoggerTest: React.FC = () => {
  const testBasicLogging = () => {
    logger.info('Basic logging test - INFO level');
    logger.debug('Basic logging test - DEBUG level');
    logger.warn('Basic logging test - WARN level');
    logger.error('Basic logging test - ERROR level');
  };

  const testStructuredLogging = () => {
    logger.info('Structured logging test', {
      userId: 'test-user-123',
      action: 'test_action',
      timestamp: new Date().toISOString(),
      properties: {
        testProperty: 'testValue',
        numberProperty: 42,
        booleanProperty: true
      }
    });
  };

  const testErrorLogging = () => {
    try {
      throw new Error('This is a test error for logging');
    } catch (error) {
      logger.logError(error instanceof Error ? error : new Error('Unknown error'), {
        context: 'LoggerTest',
        operation: 'testErrorLogging'
      });
    }
  };

  const testPerformanceLogging = () => {
    const startTime = performance.now();
    
    // Simulate some work
    setTimeout(() => {
      const duration = performance.now() - startTime;
      logger.logPerformance('testOperation', duration, {
        operationType: 'simulated',
        success: true
      });
    }, 100);
  };

  const testUserActionLogging = () => {
    logger.logUserAction('test_button_clicked', {
      buttonId: 'testButton',
      page: 'LoggerTest',
      timestamp: new Date().toISOString()
    });
  };

  const testFunctionCallLogging = () => {
    logger.logFunctionCall('testFunction', {
      parameter1: 'value1',
      parameter2: 123
    });
    
    // Simulate function execution
    setTimeout(() => {
      logger.logFunctionReturn('testFunction', {
        result: 'success',
        data: { processed: true }
      });
    }, 50);
  };

  return (
    <div style={{ padding: '1rem' }}>
      <h2>Logger Test Component</h2>
      <p>Use this component to test the logging functionality. Check the browser console and backend logs.</p>

      <Grid fullWidth>
        <Column lg={6} md={4} sm={4}>
          <Tile style={{ marginBottom: '1rem' }}>
            <h3>Basic Logging</h3>
            <Button onClick={testBasicLogging} style={{ marginRight: '0.5rem' }}>
              Test Basic Logging
            </Button>
            <p>Tests all log levels (INFO, DEBUG, WARN, ERROR)</p>
          </Tile>

          <Tile style={{ marginBottom: '1rem' }}>
            <h3>Structured Logging</h3>
            <Button onClick={testStructuredLogging} style={{ marginRight: '0.5rem' }}>
              Test Structured Logging
            </Button>
            <p>Tests logging with structured properties and context</p>
          </Tile>

          <Tile style={{ marginBottom: '1rem' }}>
            <h3>Error Logging</h3>
            <Button onClick={testErrorLogging} style={{ marginRight: '0.5rem' }}>
              Test Error Logging
            </Button>
            <p>Tests error logging with stack traces</p>
          </Tile>
        </Column>

        <Column lg={6} md={4} sm={4}>
          <Tile style={{ marginBottom: '1rem' }}>
            <h3>Performance Logging</h3>
            <Button onClick={testPerformanceLogging} style={{ marginRight: '0.5rem' }}>
              Test Performance Logging
            </Button>
            <p>Tests performance tracking with timing</p>
          </Tile>

          <Tile style={{ marginBottom: '1rem' }}>
            <h3>User Action Logging</h3>
            <Button onClick={testUserActionLogging} style={{ marginRight: '0.5rem' }}>
              Test User Action Logging
            </Button>
            <p>Tests user action tracking for analytics</p>
          </Tile>

          <Tile style={{ marginBottom: '1rem' }}>
            <h3>Function Call Logging</h3>
            <Button onClick={testFunctionCallLogging} style={{ marginRight: '0.5rem' }}>
              Test Function Call Logging
            </Button>
            <p>Tests function call and return logging</p>
          </Tile>
        </Column>
      </Grid>

      <Tile style={{ marginTop: '1rem' }}>
        <h3>Log Output</h3>
        <p>Check the following locations for log output:</p>
        <ul>
          <li><strong>Browser Console:</strong> All frontend logs will appear here</li>
          <li><strong>Backend Console:</strong> Backend logs and forwarded frontend logs</li>
          <li><strong>Log File:</strong> JSON structured logs in app data directory</li>
        </ul>
        <p><strong>Note:</strong> If you see "Backend logging not available" warnings, that's normal during development when Tauri is not fully initialized.</p>
      </Tile>
    </div>
  );
};

export default LoggerTest; 