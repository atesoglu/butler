# Comprehensive Logging System Integration

This document describes the comprehensive logging system implemented in the Butler Tauri application, which provides structured logging similar to Serilog with both backend (Rust) and frontend (TypeScript) components.

## Overview

The logging system provides:
- **Structured logging** with correlation IDs, user context, and custom properties
- **Multiple output destinations** (console and file)
- **Performance tracking** for operations
- **Error tracking** with stack traces
- **User action logging** for analytics
- **Consistent formatting** across backend and frontend

## Architecture

### Backend Logging (Rust)

Located in `src-tauri/src/logger.rs`, the backend logger provides:

#### Core Components

1. **LogEntry**: Structured log entry with timestamp, level, message, context, and properties
2. **LogContext**: Contextual information including correlation ID, user ID, session ID, and custom properties
3. **StructuredLogger**: Main logger implementation with console and file output

#### Features

- **Colored console output** with different colors for each log level
- **JSON file logging** for structured analysis
- **Correlation ID tracking** for request tracing
- **Context management** for user and session information
- **Performance metrics** with timing information

#### Usage Examples

```rust
// Basic logging
log_info!("Application started");
log_debug!("Processing request", "request_id" => "12345");
log_warn!("Resource usage high", "memory_usage" => "85%");
log_error!("Database connection failed", db_error);

// Structured logging with properties
log_info_with_props!("User action completed", 
    "user_id" => "user123",
    "action" => "save_settings",
    "duration_ms" => 150
);

// Error logging with exception
log_error_with_exception!("Failed to process file", file_error);
```

### Frontend Logging (TypeScript)

Located in `src/services/loggerService.ts`, the frontend logger provides:

#### Core Components

1. **LoggerService**: Singleton logger service with context management
2. **LogEntry**: Frontend log entry structure
3. **LogContext**: Frontend context management
4. **Convenience functions**: Easy-to-use logging functions

#### Features

- **Console logging** with structured formatting
- **Performance tracking** for operations
- **User action logging** for analytics
- **Error tracking** with stack traces
- **Context management** with correlation IDs

#### Usage Examples

```typescript
// Basic logging
logger.info('Component mounted');
logger.debug('Processing data', { dataSize: 1024 });
logger.warn('API rate limit approaching');
logger.error('Failed to load data', error);

// Convenience functions
logInfo('User clicked button', { buttonId: 'save' });
logError('API call failed', apiError, { endpoint: '/api/data' });

// Performance logging
logger.logPerformance('dataProcessing', 150, { recordCount: 1000 });

// User action logging
logger.logUserAction('settings_changed', { 
  setting: 'theme', 
  value: 'dark' 
});

// Function call logging
logger.logFunctionCall('processData', { input: data });
logger.logFunctionReturn('processData', { result: processedData });
```

## Integration Points

### Database Operations

All database operations are logged with:
- **Operation type** (get, update, reset)
- **Performance metrics** (duration)
- **Success/failure status**
- **Error details** when applicable

Example:
```rust
log_info_with_props!("Settings retrieved successfully", 
    "theme" => settings.theme.clone(),
    "language" => settings.language.clone(),
    "duration_ms" => duration
);
```

### Tauri Commands

All Tauri commands include:
- **Command invocation** logging
- **Parameter validation** logging
- **Success/failure** logging
- **Performance metrics**

Example:
```rust
log_info!("Tauri command invoked: get_settings");
log_info_with_props!("Settings retrieved successfully via Tauri command", 
    "theme" => settings.theme.clone(),
    "language" => settings.language.clone()
);
```

### Frontend Components

React components log:
- **Component lifecycle** events
- **User interactions** and actions
- **State changes** and updates
- **Error handling**

Example:
```typescript
logger.logFunctionCall('SettingsPage.handleSave');
logger.logUserAction('save_settings', {
  theme: settings.theme,
  language: settings.language
});
```

## Configuration

### Backend Configuration

The logger is initialized in `src-tauri/src/main.rs`:

```rust
// Initialize logger with app data directory
let app_data_dir = app.handle()
    .path_resolver()
    .app_data_dir()
    .expect("Failed to get app data directory");

init_logger(&app_data_dir)?;
```

### Frontend Configuration

The frontend logger is automatically initialized when imported:

```typescript
// Automatically initializes with correlation ID and session ID
import { logger } from '../services/loggerService';
```

## Log Levels

### Backend (Rust)
- **TRACE**: Detailed diagnostic information
- **DEBUG**: Diagnostic information for debugging
- **INFO**: General information about application flow
- **WARN**: Warning messages for potentially harmful situations
- **ERROR**: Error messages for error conditions

### Frontend (TypeScript)
- **TRACE**: Detailed diagnostic information
- **DEBUG**: Diagnostic information for debugging
- **INFO**: General information about application flow
- **WARN**: Warning messages for potentially harmful situations
- **ERROR**: Error messages for error conditions

## Log Output

### Console Output

Backend console output includes:
- **Timestamp** with millisecond precision
- **Log level** with color coding
- **Message** with context information
- **Correlation ID** for request tracing
- **User ID** when available
- **Properties** in key=value format
- **Source location** (file:line)

Example:
```
[2024-01-15 10:30:45.123] INFO Application started [CorrelationId: corr_1705311045123_abc123def] [main.rs:25]
[2024-01-15 10:30:45.124] INFO Database connection established successfully [CorrelationId: corr_1705311045123_abc123def] [database.rs:45]
```

### File Output

Log files are stored in JSON format for easy parsing and analysis:

```json
{
  "timestamp": "2024-01-15T10:30:45.123Z",
  "level": "INFO",
  "message": "Settings retrieved successfully",
  "target": "database",
  "module_path": "butler::database",
  "file": "database.rs",
  "line": 45,
  "correlation_id": "corr_1705311045123_abc123def",
  "user_id": null,
  "session_id": null,
  "properties": {
    "theme": "auto",
    "language": "en",
    "duration_ms": 15.5
  },
  "exception": null
}
```

## Performance Monitoring

The logging system includes built-in performance monitoring:

### Backend Performance Logging

```rust
let start_time = std::time::Instant::now();
// ... operation ...
let duration = start_time.elapsed();
log_info_with_props!("Operation completed", "duration_ms" => duration.as_millis());
```

### Frontend Performance Logging

```typescript
const startTime = performance.now();
// ... operation ...
const duration = performance.now() - startTime;
logger.logPerformance('operationName', duration, { success: true });
```

## Error Handling

### Backend Error Logging

```rust
match result {
    Ok(data) => {
        log_info!("Operation successful");
        Ok(data)
    }
    Err(e) => {
        log_error_with_exception!("Operation failed", e);
        Err(e)
    }
}
```

### Frontend Error Logging

```typescript
try {
    const result = await operation();
    logger.logFunctionReturn('operationName', { success: true });
    return result;
} catch (error) {
    logger.logError('Operation failed', error, { context: 'operationName' });
    throw error;
}
```

## Context Management

### Correlation IDs

Each request/session gets a unique correlation ID for tracing:

```typescript
// Frontend automatically generates correlation ID
logger.setCorrelationId('custom-correlation-id');

// Backend uses correlation ID from context
log_info_with_props!("Request processed", "correlation_id" => correlation_id);
```

### User Context

User information can be added to all log entries:

```typescript
// Set user context
logger.setUserId('user123');
logger.addProperty('userRole', 'admin');

// All subsequent logs will include user context
logger.info('User action performed');
```

## Best Practices

### 1. Use Appropriate Log Levels

- **TRACE**: For detailed debugging information
- **DEBUG**: For diagnostic information during development
- **INFO**: For general application flow
- **WARN**: For potentially problematic situations
- **ERROR**: For error conditions that need attention

### 2. Include Relevant Context

```typescript
// Good: Include relevant context
logger.info('User updated settings', {
  userId: user.id,
  setting: 'theme',
  oldValue: oldTheme,
  newValue: newTheme
});

// Bad: Missing context
logger.info('Settings updated');
```

### 3. Log Performance for Critical Operations

```typescript
const startTime = performance.now();
await criticalOperation();
const duration = performance.now() - startTime;
logger.logPerformance('criticalOperation', duration, { success: true });
```

### 4. Handle Errors Properly

```typescript
try {
    await riskyOperation();
} catch (error) {
    logger.logError('Risky operation failed', error, {
        operation: 'riskyOperation',
        context: 'userAction'
    });
    // Handle error appropriately
}
```

### 5. Use Structured Logging

```typescript
// Good: Structured logging
logger.info('API response received', {
    endpoint: '/api/users',
    statusCode: 200,
    responseTime: 150,
    userId: user.id
});

// Bad: String concatenation
logger.info(`API response received for endpoint /api/users with status 200`);
```

## Troubleshooting

### Common Issues

1. **Logs not appearing**: Check log level configuration
2. **Performance impact**: Use appropriate log levels in production
3. **File permissions**: Ensure app has write permissions to log directory
4. **Correlation ID missing**: Check context initialization

### Debug Mode

Enable debug logging by setting the log level to DEBUG:

```rust
// Backend
.with_level(LevelFilter::Debug)

// Frontend
logger.debug('Debug information');
```

### Log Analysis

Log files can be analyzed using:
- **JSON parsers** for structured analysis
- **Log aggregation tools** like ELK stack
- **Custom scripts** for specific metrics

## Future Enhancements

1. **Log rotation** for file size management
2. **Remote logging** to external services
3. **Log filtering** by correlation ID or user
4. **Metrics aggregation** for performance monitoring
5. **Alerting** for critical errors
6. **Log compression** for storage efficiency

## Conclusion

The comprehensive logging system provides structured, contextual logging across both backend and frontend components, enabling effective debugging, monitoring, and analysis of the Butler application. The system follows Serilog-like patterns while being optimized for the Tauri architecture. 