# SQLite Database Integration

This document explains the SQLite database integration implemented in the Butler Tauri application.

## Overview

The application now uses SQLite to persistently store user settings and preferences. The database is automatically created in the application's data directory and provides a robust foundation for data persistence.

## Architecture

### Backend (Rust/Tauri)

#### Database Module (`src-tauri/src/database.rs`)

The database module provides:

- **Settings Struct**: Defines the structure for user settings with all necessary fields
- **Database Struct**: Manages SQLite connection and operations
- **CRUD Operations**: Create, read, update, and delete settings

#### Key Features:

1. **Automatic Database Creation**: The database is created automatically in the app's data directory
2. **Default Settings**: Default settings are inserted when the database is first initialized
3. **Thread-Safe Operations**: Uses mutex for thread-safe database access
4. **Error Handling**: Comprehensive error handling with meaningful error messages

#### Database Schema:

```sql
CREATE TABLE settings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    theme TEXT NOT NULL DEFAULT 'auto',
    language TEXT NOT NULL DEFAULT 'en',
    notifications BOOLEAN NOT NULL DEFAULT 1,
    email_notifications BOOLEAN NOT NULL DEFAULT 0,
    auto_save BOOLEAN NOT NULL DEFAULT 1,
    auto_save_interval INTEGER NOT NULL DEFAULT 5,
    privacy_mode BOOLEAN NOT NULL DEFAULT 0,
    data_collection BOOLEAN NOT NULL DEFAULT 1,
    username TEXT NOT NULL DEFAULT 'user@example.com',
    display_name TEXT NOT NULL DEFAULT 'John Doe',
    bio TEXT NOT NULL DEFAULT '',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### Frontend (React/TypeScript)

#### Database Service (`src/services/databaseService.ts`)

Provides a clean interface for frontend components to interact with the database:

- **getSettings()**: Retrieve current settings from database
- **updateSettings()**: Update all settings at once
- **resetSettings()**: Reset settings to defaults
- **saveSetting()**: Update a single setting
- **getSetting()**: Get a specific setting

#### Settings Hook (`src/hooks/useSettings.ts`)

A custom React hook that provides:

- **State Management**: Manages settings state with loading and error states
- **Database Operations**: Wraps database service calls
- **Real-time Updates**: Automatically updates UI when settings change
- **Error Handling**: Provides error handling and fallback to default settings

#### Settings Page Integration

The Settings page now uses the database hook instead of local state:

- **Persistent Storage**: All settings are saved to SQLite
- **Real-time Updates**: Changes are immediately reflected in the database
- **Loading States**: Shows loading indicators while fetching settings
- **Error Handling**: Displays error notifications if database operations fail

## Usage

### Testing the Integration

1. **Database Test Component**: Navigate to the "Database Test" tab in the Home page
2. **Test Buttons**: Use the test buttons to verify database operations
3. **Settings Page**: Modify settings in the Settings page to see persistence

### Adding New Settings

To add a new setting:

1. **Backend**: Add the field to the `Settings` struct in `database.rs`
2. **Database Schema**: Add the column to the SQL table creation
3. **Frontend Types**: Update the `Settings` interface in `types.ts`
4. **Default Values**: Set appropriate default values

### Example: Adding a New Setting

```rust
// In database.rs
pub struct Settings {
    // ... existing fields
    pub new_setting: String,
}

impl Default for Settings {
    fn default() -> Self {
        Self {
            // ... existing defaults
            new_setting: "default_value".to_string(),
        }
    }
}
```

```sql
-- In database.rs init() function
ALTER TABLE settings ADD COLUMN new_setting TEXT NOT NULL DEFAULT 'default_value';
```

```typescript
// In types.ts
export interface Settings {
    // ... existing fields
    newSetting: string;
}
```

## Benefits

1. **Data Persistence**: Settings survive application restarts
2. **Cross-Session Storage**: Settings are maintained between sessions
3. **Reliability**: SQLite provides ACID compliance and data integrity
4. **Performance**: Fast read/write operations for settings
5. **Scalability**: Easy to extend with additional data tables
6. **Cross-Platform**: SQLite works consistently across all platforms

## File Structure

```
src-tauri/
├── src/
│   ├── database.rs          # Database operations and schema
│   └── main.rs              # Tauri commands and database initialization
src/
├── services/
│   └── databaseService.ts   # Frontend database service
├── hooks/
│   └── useSettings.ts       # Settings management hook
├── components/
│   └── DatabaseTest.tsx     # Database testing component
├── pages/
│   └── SettingsPage.tsx     # Updated settings page with database integration
└── types/
    └── index.ts             # TypeScript interfaces
```

## Dependencies

### Backend Dependencies (Cargo.toml)
- `rusqlite = "0.31"` - SQLite database driver
- `tokio = "1"` - Async runtime
- `anyhow = "1"` - Error handling

### Frontend Dependencies (package.json)
- `@tauri-apps/api` - Tauri API for invoking backend commands

## Error Handling

The integration includes comprehensive error handling:

1. **Database Connection Errors**: Graceful fallback to default settings
2. **Query Errors**: Meaningful error messages for debugging
3. **Frontend Errors**: User-friendly error notifications
4. **Network Errors**: Offline capability with local storage

## Future Enhancements

1. **Data Migration**: Version-based schema migration system
2. **Backup/Restore**: Export/import settings functionality
3. **Multiple Users**: Support for multiple user profiles
4. **Encryption**: Optional encryption for sensitive settings
5. **Sync**: Cloud synchronization of settings

## Troubleshooting

### Common Issues

1. **Database Not Found**: Check app data directory permissions
2. **Settings Not Saving**: Verify Tauri command permissions
3. **Build Errors**: Ensure all dependencies are properly installed

### Debug Commands

```bash
# Check database file location
npm run tauri dev -- --debug

# View database contents (requires SQLite CLI)
sqlite3 ~/.local/share/butler/butler.db "SELECT * FROM settings;"
```

## Conclusion

The SQLite integration provides a robust, scalable foundation for data persistence in the Butler application. It enables reliable storage of user preferences while maintaining excellent performance and cross-platform compatibility. 