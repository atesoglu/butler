# Log Buffer System Documentation

## Overview

The Butler application now includes a comprehensive FIFO (First-In-First-Out) log buffer system that stores the last 1000 log entries in memory with automatic cleanup. This system provides real-time log viewing capabilities through a dedicated log viewer component in the right panel.

## Architecture

### Backend (Rust/Tauri)

#### Log Buffer Implementation
- **Location**: `src-tauri/src/logger.rs`
- **Key Components**:
  - `LogBuffer`: FIFO buffer with configurable max size (default: 1000 entries)
  - `LogEntry`: Structured log entry with timestamp, level, message, and metadata
  - `StructuredLogger`: Enhanced logger that writes to buffer, console, and file

#### Features
- **FIFO Management**: Automatically removes oldest entries when buffer exceeds max size
- **Thread Safety**: Uses `Arc<Mutex<LogBuffer>>` for safe concurrent access
- **Memory Management**: Automatic cleanup of old entries to prevent memory leaks
- **Structured Logging**: Rich metadata including correlation IDs, user IDs, and properties

#### Tauri Commands
- `get_logs()`: Retrieve all logs from buffer
- `get_recent_logs(count)`: Get the most recent N logs
- `clear_logs()`: Clear the entire log buffer
- `get_log_count()`: Get current number of logs in buffer
- `log_entry(entry)`: Add a log entry from frontend

### Frontend (React/TypeScript)

#### Log Service
- **Location**: `src/services/logService.ts`
- **Features**:
  - Connection management with backend
  - Log filtering and formatting
  - Error handling and retry logic
  - CSV export functionality

#### Log Viewer Component
- **Location**: `src/components/LogViewer.tsx`
- **Features**:
  - Real-time log display with auto-refresh
  - Advanced filtering by level, search terms, correlation ID
  - Pagination and view modes (list/table)
  - Export logs to CSV
  - Color-coded log levels

## Usage

### Accessing the Log Viewer

1. **Open Log Viewer**: Click the "View" icon (👁️) in the header global bar
2. **Close Log Viewer**: Click the "Close" button (✕) in the top-right corner

### Log Viewer Features

#### Filtering
- **Search**: Filter logs by message content or target
- **Level Filter**: Show only specific log levels (ERROR, WARN, INFO, DEBUG, TRACE)
- **Log Limit**: Control how many recent logs to fetch (50, 100, 200, 500)

#### View Options
- **Auto-refresh**: Toggle automatic refresh every 5 seconds
- **View Mode**: Switch between list and table views
- **Page Size**: Adjust number of logs per page (25, 50, 100)

#### Actions
- **Refresh**: Manually refresh logs
- **Clear**: Clear all logs from buffer
- **Export**: Download logs as CSV file

### Log Entry Format

Each log entry includes:
- **Timestamp**: ISO 8601 formatted timestamp
- **Level**: Log level (ERROR, WARN, INFO, DEBUG, TRACE)
- **Message**: Log message content
- **Target**: Source module/component
- **Correlation ID**: Request correlation for tracing
- **User ID**: Associated user (if available)
- **File/Line**: Source code location
- **Properties**: Additional structured data

## Memory Management

### FIFO Buffer Behavior
- **Max Size**: 1000 log entries (configurable)
- **Cleanup**: Oldest entries automatically removed when limit exceeded
- **Memory Usage**: Approximately 1-2KB per log entry
- **Total Memory**: ~1-2MB for full buffer

### Application Lifecycle
- **Startup**: Buffer initialized empty
- **Runtime**: Logs accumulate up to max size
- **Shutdown**: Buffer automatically cleared from memory

## Configuration

### Backend Configuration
```rust
const MAX_LOG_BUFFER_SIZE: usize = 1000; // Adjust as needed
```

### Frontend Configuration
```typescript
// In logService.ts
const DEFAULT_LOG_LIMIT = 100;
const AUTO_REFRESH_INTERVAL = 5000; // 5 seconds
```

## Performance Considerations

### Memory Usage
- **Per Entry**: ~1-2KB (depending on message length and properties)
- **Full Buffer**: ~1-2MB
- **Cleanup**: Automatic, no manual intervention required

### Network Impact
- **Initial Load**: Fetches recent logs on viewer open
- **Auto-refresh**: Only fetches new logs since last refresh
- **Filtering**: Applied client-side for performance

### CPU Impact
- **Logging**: Minimal impact (simple buffer operations)
- **Viewer**: Moderate impact during filtering and rendering
- **Auto-refresh**: Low impact (5-second intervals)

## Troubleshooting

### Common Issues

#### Logs Not Appearing
1. Check if backend logger is properly initialized
2. Verify Tauri commands are working
3. Check browser console for errors

#### Performance Issues
1. Reduce auto-refresh interval
2. Lower log limit
3. Clear old logs periodically

#### Memory Issues
1. Reduce `MAX_LOG_BUFFER_SIZE`
2. Implement log rotation
3. Monitor memory usage

### Debug Commands

#### Backend
```bash
# Check log buffer status
cargo run --bin log-status

# Clear logs manually
cargo run --bin clear-logs
```

#### Frontend
```javascript
// Check log service status
console.log(await logService.getLogCount());

// Test log entry
await logService.sendLogEntry({
  level: 'INFO',
  message: 'Test log entry',
  target: 'test'
});
```

## Integration with Existing Systems

### Logger Service Integration
The existing `loggerService` automatically sends logs to the backend buffer:
- Frontend logs are sent via Tauri commands
- Backend logs are automatically added to buffer
- Unified logging experience across frontend and backend

### Database Integration
- Logs are stored in memory only (not persisted to database)
- Database operations are logged to the buffer
- Correlation IDs link database operations to log entries

## Future Enhancements

### Planned Features
1. **Log Persistence**: Save logs to database for long-term storage
2. **Log Rotation**: Automatic log file rotation
3. **Advanced Filtering**: Date range, user filtering
4. **Log Analytics**: Statistical analysis of log patterns
5. **Alert System**: Notifications for error patterns

### Performance Optimizations
1. **Virtual Scrolling**: For large log volumes
2. **Lazy Loading**: Load logs on demand
3. **Compression**: Compress old log entries
4. **Indexing**: Fast search across logs

## Security Considerations

### Data Privacy
- Logs may contain sensitive information
- Consider log sanitization for production
- Implement log retention policies

### Access Control
- Log viewer accessible to all users
- Consider role-based access for sensitive logs
- Audit log access patterns

## Monitoring and Maintenance

### Health Checks
- Monitor buffer size and memory usage
- Check log generation rates
- Verify auto-cleanup is working

### Maintenance Tasks
- Periodically clear old logs
- Monitor log file sizes
- Review log patterns for optimization

---

This log buffer system provides a robust foundation for application monitoring and debugging while maintaining good performance and memory management practices. 