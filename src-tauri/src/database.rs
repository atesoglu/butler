use rusqlite::{Connection, Result};
use serde::{Deserialize, Serialize};
use std::path::PathBuf;
use tauri::AppHandle;
use tauri::Manager;
// macros are available globally, no need to import

#[derive(Debug, Serialize, Deserialize)]
pub struct Settings {
    pub id: Option<i32>,
    pub theme: String,
    pub language: String,
    pub notifications: bool,
    pub email_notifications: bool,
    pub auto_save: bool,
    pub auto_save_interval: i32,
    pub privacy_mode: bool,
    pub data_collection: bool,
    pub username: String,
    pub display_name: String,
    pub bio: String,
    pub created_at: Option<String>,
    pub updated_at: Option<String>,
}

impl Default for Settings {
    fn default() -> Self {
        log_debug!("Creating default settings");
        Self {
            id: None,
            theme: "auto".to_string(),
            language: "en".to_string(),
            notifications: true,
            email_notifications: false,
            auto_save: true,
            auto_save_interval: 5,
            privacy_mode: false,
            data_collection: true,
            username: "user@example.com".to_string(),
            display_name: "John Doe".to_string(),
            bio: "".to_string(),
            created_at: None,
            updated_at: None,
        }
    }
}

pub struct Database {
    conn: Connection,
}

impl Database {
    pub fn new(app_handle: &AppHandle) -> Result<Self> {
        log_info!("Initializing database connection");
        
        let app_dir = app_handle
            .path()
            .app_data_dir()
            .expect("Failed to get app data directory");
        
        log_info_with_props!("App data directory resolved", "path" => app_dir.to_string_lossy().to_string());
        
        std::fs::create_dir_all(&app_dir).expect("Failed to create app data directory");
        
        let db_path = app_dir.join("butler.db");
        log_info_with_props!("Opening database connection", "db_path" => db_path.to_string_lossy().to_string());
        
        let conn = Connection::open(&db_path)?;
        
        let db = Database { conn };
        db.init()?;
        
        log_info!("Database connection established successfully");
        Ok(db)
    }
    
    fn init(&self) -> Result<()> {
        log_debug!("Initializing database schema");
        
        self.conn.execute(
            "CREATE TABLE IF NOT EXISTS settings (
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
            )",
            [],
        )?;
        
        log_debug!("Settings table created/verified");
        
        // Insert default settings if table is empty
        let count: i32 = self.conn.query_row("SELECT COUNT(*) FROM settings", [], |row| row.get(0))?;
        log_info_with_props!("Checking existing settings count", "count" => count);
        
        if count == 0 {
            log_info!("No settings found, inserting default settings");
            self.insert_default_settings()?;
        } else {
            log_info_with_props!("Found existing settings", "count" => count);
        }
        
        log_debug!("Database initialization completed");
        Ok(())
    }
    
    fn insert_default_settings(&self) -> Result<()> {
        log_debug!("Inserting default settings into database");
        
        let default_settings = Settings::default();
        let result = self.conn.execute(
            "INSERT INTO settings (
                theme, language, notifications, email_notifications, 
                auto_save, auto_save_interval, privacy_mode, data_collection,
                username, display_name, bio
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
            (
                &default_settings.theme,
                &default_settings.language,
                default_settings.notifications,
                default_settings.email_notifications,
                default_settings.auto_save,
                default_settings.auto_save_interval,
                default_settings.privacy_mode,
                default_settings.data_collection,
                &default_settings.username,
                &default_settings.display_name,
                &default_settings.bio,
            ),
        );
        
        match result {
            Ok(_) => {
                log_info!("Default settings inserted successfully");
                Ok(())
            }
            Err(e) => {
                log_error_with_exception!("Failed to insert default settings", e);
                Err(e)
            }
        }
    }
    
    pub fn get_settings(&self) -> Result<Settings> {
        log_debug!("Retrieving settings from database");
        
        let result = self.conn.query_row(
            "SELECT id, theme, language, notifications, email_notifications, 
                    auto_save, auto_save_interval, privacy_mode, data_collection,
                    username, display_name, bio, created_at, updated_at 
             FROM settings ORDER BY id DESC LIMIT 1",
            [],
            |row| {
                Ok(Settings {
                    id: row.get(0)?,
                    theme: row.get(1)?,
                    language: row.get(2)?,
                    notifications: row.get(3)?,
                    email_notifications: row.get(4)?,
                    auto_save: row.get(5)?,
                    auto_save_interval: row.get(6)?,
                    privacy_mode: row.get(7)?,
                    data_collection: row.get(8)?,
                    username: row.get(9)?,
                    display_name: row.get(10)?,
                    bio: row.get(11)?,
                    created_at: row.get(12)?,
                    updated_at: row.get(13)?,
                })
            },
        );
        
        match result {
            Ok(settings) => {
                log_info_with_props!("Settings retrieved successfully", 
                    "theme" => settings.theme.clone(),
                    "language" => settings.language.clone(),
                    "username" => settings.username.clone()
                );
                Ok(settings)
            }
            Err(e) => {
                log_error_with_exception!("Failed to retrieve settings", e);
                Err(e)
            }
        }
    }
    
    pub fn update_settings(&self, settings: &Settings) -> Result<()> {
        log_debug!("Updating settings in database");
        
        let settings_id = settings.id.unwrap_or(1);
        log_info_with_props!("Updating settings", 
            "settings_id" => settings_id,
            "theme" => settings.theme.clone(),
            "language" => settings.language.clone(),
            "username" => settings.username.clone()
        );
        
        let result = self.conn.execute(
            "UPDATE settings SET 
                theme = ?, language = ?, notifications = ?, email_notifications = ?,
                auto_save = ?, auto_save_interval = ?, privacy_mode = ?, data_collection = ?,
                username = ?, display_name = ?, bio = ?, updated_at = CURRENT_TIMESTAMP
             WHERE id = ?",
            (
                &settings.theme,
                &settings.language,
                settings.notifications,
                settings.email_notifications,
                settings.auto_save,
                settings.auto_save_interval,
                settings.privacy_mode,
                settings.data_collection,
                &settings.username,
                &settings.display_name,
                &settings.bio,
                settings_id,
            ),
        );
        
        match result {
            Ok(rows_affected) => {
                log_info_with_props!("Settings updated successfully", "rows_affected" => rows_affected);
                Ok(())
            }
            Err(e) => {
                log_error_with_exception!("Failed to update settings", e);
                Err(e)
            }
        }
    }
    
    pub fn reset_settings(&self) -> Result<()> {
        log_warn!("Resetting settings to defaults");
        
        let delete_result = self.conn.execute("DELETE FROM settings", []);
        match delete_result {
            Ok(rows_deleted) => {
                log_info_with_props!("Deleted existing settings", "rows_deleted" => rows_deleted);
            }
            Err(e) => {
                log_error_with_exception!("Failed to delete existing settings", e);
                return Err(e);
            }
        }
        
        let insert_result = self.insert_default_settings();
        match insert_result {
            Ok(_) => {
                log_info!("Settings reset to defaults successfully");
                Ok(())
            }
            Err(e) => {
                log_error_with_exception!("Failed to insert default settings during reset", e);
                Err(e)
            }
        }
    }
} 