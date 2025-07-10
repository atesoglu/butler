// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod database;
mod logger;

use database::{Database, Settings};
use tauri::State;
use std::sync::Mutex;
use crate::logger::{log_info, log_error, log_debug, log_warn, log_info_with_props, log_error_with_exception, init_logger, LogContext, LogLevel, LogBuffer};

// Database state
struct DbState(Mutex<Database>);

// Log buffer state
struct LogBufferState(Mutex<LogBuffer>);

#[derive(serde::Deserialize)]
struct FrontendLogEntry {
    timestamp: String,
    level: String,
    message: String,
    target: String,
    module_path: Option<String>,
    file: Option<String>,
    line: Option<u32>,
    correlation_id: Option<String>,
    user_id: Option<String>,
    session_id: Option<String>,
    properties: Option<std::collections::HashMap<String, serde_json::Value>>,
    exception: Option<String>,
}

#[tauri::command]
async fn log_entry(entry: FrontendLogEntry) -> Result<(), String> {
    let level = match entry.level.as_str() {
        "TRACE" => LogLevel::Trace,
        "DEBUG" => LogLevel::Debug,
        "INFO" => LogLevel::Info,
        "WARN" => LogLevel::Warn,
        "ERROR" => LogLevel::Error,
        _ => LogLevel::Info,
    };

    let message = format!("[Frontend] {}", entry.message);
    
    match level {
        LogLevel::Trace => log::trace!("{}", message),
        LogLevel::Debug => log::debug!("{}", message),
        LogLevel::Info => log::info!("{}", message),
        LogLevel::Warn => log::warn!("{}", message),
        LogLevel::Error => log::error!("{}", message),
    }

    Ok(())
}

#[tauri::command]
async fn get_logs(log_buffer: State<'_, LogBufferState>) -> Result<Vec<logger::LogEntry>, String> {
    let buffer = log_buffer.0.lock().map_err(|_| "Failed to acquire log buffer lock")?;
    Ok(buffer.get_logs())
}

#[tauri::command]
async fn get_recent_logs(count: usize, log_buffer: State<'_, LogBufferState>) -> Result<Vec<logger::LogEntry>, String> {
    let buffer = log_buffer.0.lock().map_err(|_| "Failed to acquire log buffer lock")?;
    Ok(buffer.get_logs_recent(count))
}

#[tauri::command]
async fn clear_logs(log_buffer: State<'_, LogBufferState>) -> Result<(), String> {
    let mut buffer = log_buffer.0.lock().map_err(|_| "Failed to acquire log buffer lock")?;
    buffer.clear();
    log_info!("Log buffer cleared");
    Ok(())
}

#[tauri::command]
async fn get_log_count(log_buffer: State<'_, LogBufferState>) -> Result<usize, String> {
    let buffer = log_buffer.0.lock().map_err(|_| "Failed to acquire log buffer lock")?;
    Ok(buffer.len())
}

#[tauri::command]
async fn get_settings(db: State<'_, DbState>) -> Result<Settings, String> {
    log_info!("Tauri command invoked: get_settings");
    
    let db = match db.0.lock() {
        Ok(db) => db,
        Err(e) => {
            log_error_with_exception!("Failed to acquire database lock", e);
            return Err("Database lock error".to_string());
        }
    };
    
    match db.get_settings() {
        Ok(settings) => {
            log_info_with_props!("Settings retrieved successfully via Tauri command", 
                "theme" => settings.theme.clone(),
                "language" => settings.language.clone()
            );
            Ok(settings)
        }
        Err(e) => {
            log_error_with_exception!("Failed to get settings via Tauri command", e);
            Err(e.to_string())
        }
    }
}

#[tauri::command]
async fn update_settings(settings: Settings, db: State<'_, DbState>) -> Result<(), String> {
    log_info!("Tauri command invoked: update_settings");
    log_info_with_props!("Updating settings via Tauri command", 
        "theme" => settings.theme.clone(),
        "language" => settings.language.clone(),
        "username" => settings.username.clone()
    );
    
    let db = match db.0.lock() {
        Ok(db) => db,
        Err(e) => {
            log_error_with_exception!("Failed to acquire database lock", e);
            return Err("Database lock error".to_string());
        }
    };
    
    match db.update_settings(&settings) {
        Ok(_) => {
            log_info!("Settings updated successfully via Tauri command");
            Ok(())
        }
        Err(e) => {
            log_error_with_exception!("Failed to update settings via Tauri command", e);
            Err(e.to_string())
        }
    }
}

#[tauri::command]
async fn reset_settings(db: State<'_, DbState>) -> Result<(), String> {
    log_warn!("Tauri command invoked: reset_settings");
    
    let db = match db.0.lock() {
        Ok(db) => db,
        Err(e) => {
            log_error_with_exception!("Failed to acquire database lock", e);
            return Err("Database lock error".to_string());
        }
    };
    
    match db.reset_settings() {
        Ok(_) => {
            log_info!("Settings reset successfully via Tauri command");
            Ok(())
        }
        Err(e) => {
            log_error_with_exception!("Failed to reset settings via Tauri command", e);
            Err(e.to_string())
        }
    }
}

fn main() {
    log_info!("Starting Butler Tauri application");
    
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .setup(|app| {
            log_info!("Setting up Tauri application");
            
            // Initialize logger
            let app_data_dir = app.handle()
                .path_resolver()
                .app_data_dir()
                .expect("Failed to get app data directory");
            
            log_info_with_props!("Initializing logger", "app_data_dir" => app_data_dir.to_string_lossy().to_string());
            
            let log_buffer = match init_logger(&app_data_dir) {
                Ok(buffer) => {
                    log_info!("Logger initialized successfully");
                    buffer
                }
                Err(e) => {
                    eprintln!("Failed to initialize logger: {}", e);
                    Arc::new(Mutex::new(LogBuffer::new(1000)))
                }
            };
            
            // Initialize database
            log_info!("Initializing database");
            let db = match Database::new(&app.handle()) {
                Ok(db) => {
                    log_info!("Database initialized successfully");
                    db
                }
                Err(e) => {
                    log_error_with_exception!("Failed to initialize database", e);
                    panic!("Failed to initialize database: {}", e);
                }
            };
            
            app.manage(DbState(Mutex::new(db)));
            app.manage(LogBufferState(log_buffer));
            
            log_info!("Tauri application setup completed successfully");
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            get_settings,
            update_settings,
            reset_settings,
            log_entry,
            get_logs,
            get_recent_logs,
            clear_logs,
            get_log_count
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
