use chrono::{DateTime, Utc};
use log::{Level, LevelFilter, Log, Metadata, Record};
use serde::{Deserialize, Serialize};
use std::collections::{HashMap, VecDeque};
use std::fs::{File, OpenOptions};
use std::io::{self, Write};
use std::path::PathBuf;
use std::sync::{Arc, Mutex};
use uuid::Uuid;

const MAX_LOG_BUFFER_SIZE: usize = 1000;

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum LogLevel {
    Trace,
    Debug,
    Info,
    Warn,
    Error,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct LogEntry {
    pub timestamp: DateTime<Utc>,
    pub level: String,
    pub message: String,
    pub target: String,
    pub module_path: Option<String>,
    pub file: Option<String>,
    pub line: Option<u32>,
    pub correlation_id: Option<String>,
    pub user_id: Option<String>,
    pub session_id: Option<String>,
    pub properties: HashMap<String, serde_json::Value>,
    pub exception: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct LogContext {
    pub correlation_id: Option<String>,
    pub user_id: Option<String>,
    pub session_id: Option<String>,
    pub properties: HashMap<String, serde_json::Value>,
}

impl LogContext {
    pub fn new() -> Self {
        Self {
            correlation_id: Some(Uuid::new_v4().to_string()),
            user_id: None,
            session_id: None,
            properties: HashMap::new(),
        }
    }

    pub fn with_user_id(mut self, user_id: String) -> Self {
        self.user_id = Some(user_id);
        self
    }

    pub fn with_session_id(mut self, session_id: String) -> Self {
        self.session_id = Some(session_id);
        self
    }

    pub fn with_property(mut self, key: String, value: serde_json::Value) -> Self {
        self.properties.insert(key, value);
        self
    }

    pub fn with_correlation_id(mut self, correlation_id: String) -> Self {
        self.correlation_id = Some(correlation_id);
        self
    }
}

pub struct LogBuffer {
    logs: VecDeque<LogEntry>,
    max_size: usize,
}

impl LogBuffer {
    pub fn new(max_size: usize) -> Self {
        Self {
            logs: VecDeque::with_capacity(max_size),
            max_size,
        }
    }

    pub fn add_log(&mut self, entry: LogEntry) {
        // Add new log entry
        self.logs.push_back(entry);
        
        // Remove oldest entries if we exceed max size
        while self.logs.len() > self.max_size {
            self.logs.pop_front();
        }
    }

    pub fn get_logs(&self) -> Vec<LogEntry> {
        self.logs.iter().cloned().collect()
    }

    pub fn get_logs_recent(&self, count: usize) -> Vec<LogEntry> {
        let start = if self.logs.len() > count {
            self.logs.len() - count
        } else {
            0
        };
        self.logs.range(start..).cloned().collect()
    }

    pub fn clear(&mut self) {
        self.logs.clear();
    }

    pub fn len(&self) -> usize {
        self.logs.len()
    }

    pub fn is_empty(&self) -> bool {
        self.logs.is_empty()
    }
}

pub struct StructuredLogger {
    level: LevelFilter,
    log_file: Option<PathBuf>,
    console_output: bool,
    file_output: bool,
    context: Arc<Mutex<LogContext>>,
    buffer: Arc<Mutex<LogBuffer>>,
}

impl StructuredLogger {
    pub fn new() -> Self {
        Self {
            level: LevelFilter::Info,
            log_file: None,
            console_output: true,
            file_output: false,
            context: Arc::new(Mutex::new(LogContext::new())),
            buffer: Arc::new(Mutex::new(LogBuffer::new(MAX_LOG_BUFFER_SIZE))),
        }
    }

    pub fn with_level(mut self, level: LevelFilter) -> Self {
        self.level = level;
        self
    }

    pub fn with_console_output(mut self, enabled: bool) -> Self {
        self.console_output = enabled;
        self
    }

    pub fn with_file_output(mut self, log_file: PathBuf) -> Self {
        self.log_file = Some(log_file);
        self.file_output = true;
        self
    }

    pub fn set_context(&self, context: LogContext) {
        if let Ok(mut ctx) = self.context.lock() {
            *ctx = context;
        }
    }

    pub fn update_context<F>(&self, f: F)
    where
        F: FnOnce(&mut LogContext),
    {
        if let Ok(mut ctx) = self.context.lock() {
            f(&mut *ctx);
        }
    }

    pub fn get_buffer(&self) -> Arc<Mutex<LogBuffer>> {
        self.buffer.clone()
    }

    fn format_log_entry(&self, record: &Record) -> LogEntry {
        let context = self.context.lock().unwrap();
        
        LogEntry {
            timestamp: Utc::now(),
            level: record.level().to_string(),
            message: record.args().to_string(),
            target: record.target().to_string(),
            module_path: record.module_path().map(|s| s.to_string()),
            file: record.file().map(|s| s.to_string()),
            line: record.line(),
            correlation_id: context.correlation_id.clone(),
            user_id: context.user_id.clone(),
            session_id: context.session_id.clone(),
            properties: context.properties.clone(),
            exception: None,
        }
    }

    fn write_to_console(&self, entry: &LogEntry) {
        if !self.console_output {
            return;
        }

        let timestamp = entry.timestamp.format("%Y-%m-%d %H:%M:%S%.3f");
        let level_color = match entry.level.as_str() {
            "ERROR" => "\x1b[31m", // Red
            "WARN" => "\x1b[33m",  // Yellow
            "INFO" => "\x1b[32m",  // Green
            "DEBUG" => "\x1b[36m", // Cyan
            "TRACE" => "\x1b[35m", // Magenta
            _ => "\x1b[0m",        // Reset
        };
        let reset_color = "\x1b[0m";

        let mut output = format!(
            "{}[{}] {}{} {}",
            level_color, timestamp, entry.level, reset_color, entry.message
        );

        // Add correlation ID if present
        if let Some(correlation_id) = &entry.correlation_id {
            output.push_str(&format!(" [CorrelationId: {}]", correlation_id));
        }

        // Add user ID if present
        if let Some(user_id) = &entry.user_id {
            output.push_str(&format!(" [UserId: {}]", user_id));
        }

        // Add properties if any
        if !entry.properties.is_empty() {
            let props: Vec<String> = entry
                .properties
                .iter()
                .map(|(k, v)| format!("{}={}", k, v))
                .collect();
            output.push_str(&format!(" [{}]", props.join(", ")));
        }

        // Add source location
        if let (Some(file), Some(line)) = (&entry.file, entry.line) {
            output.push_str(&format!(" [{}:{}]", file, line));
        }

        println!("{}", output);
    }

    fn write_to_file(&self, entry: &LogEntry) -> io::Result<()> {
        if !self.file_output {
            return Ok(());
        }

        let log_file = match &self.log_file {
            Some(path) => path,
            None => return Ok(()),
        };

        // Ensure directory exists
        if let Some(parent) = log_file.parent() {
            std::fs::create_dir_all(parent)?;
        }

        let file = OpenOptions::new()
            .create(true)
            .append(true)
            .open(log_file)?;

        let json = serde_json::to_string_pretty(entry)?;
        writeln!(file, "{}", json)?;
        file.sync_all()?;

        Ok(())
    }

    fn add_to_buffer(&self, entry: LogEntry) {
        if let Ok(mut buffer) = self.buffer.lock() {
            buffer.add_log(entry);
        }
    }
}

impl Log for StructuredLogger {
    fn enabled(&self, metadata: &Metadata) -> bool {
        metadata.level() <= self.level
    }

    fn log(&self, record: &Record) {
        if !self.enabled(record.metadata()) {
            return;
        }

        let entry = self.format_log_entry(record);

        // Add to buffer first
        self.add_to_buffer(entry.clone());

        // Write to console
        self.write_to_console(&entry);

        // Write to file
        if let Err(e) = self.write_to_file(&entry) {
            eprintln!("Failed to write to log file: {}", e);
        }
    }

    fn flush(&self) {
        // Flush is handled automatically by the file operations
    }
}

// Convenience macros for structured logging
#[macro_export]
macro_rules! log_info {
    ($($arg:tt)*) => {
        log::info!($($arg)*)
    };
}

#[macro_export]
macro_rules! log_warn {
    ($($arg:tt)*) => {
        log::warn!($($arg)*)
    };
}

#[macro_export]
macro_rules! log_error {
    ($($arg:tt)*) => {
        log::error!($($arg)*)
    };
}

#[macro_export]
macro_rules! log_debug {
    ($($arg:tt)*) => {
        log::debug!($($arg)*)
    };
}

#[macro_export]
macro_rules! log_trace {
    ($($arg:tt)*) => {
        log::trace!($($arg)*)
    };
}

// Structured logging macros with properties
#[macro_export]
macro_rules! log_info_with_props {
    ($msg:expr, $($key:expr => $value:expr),*) => {{
        let mut props = std::collections::HashMap::new();
        $(
            props.insert($key.to_string(), serde_json::json!($value));
        )*
        log::info!("{}", $msg);
    }};
}

#[macro_export]
macro_rules! log_error_with_exception {
    ($msg:expr, $err:expr) => {{
        log::error!("{}: {}", $msg, $err);
    }};
}

pub fn init_logger(app_data_dir: &PathBuf) -> Result<Arc<Mutex<LogBuffer>>, Box<dyn std::error::Error>> {
    let log_file = app_data_dir.join("logs").join("butler.log");
    
    let logger = StructuredLogger::new()
        .with_level(LevelFilter::Debug)
        .with_console_output(true)
        .with_file_output(log_file);

    let buffer = logger.get_buffer();
    
    log::set_boxed_logger(Box::new(logger))?;
    log::set_max_level(LevelFilter::Debug);

    log::info!("Logger initialized successfully");
    log::info!("Log file location: {:?}", app_data_dir.join("logs").join("butler.log"));
    
    Ok(buffer)
}

pub fn get_logger_context() -> Arc<Mutex<LogContext>> {
    // This would need to be implemented to get the current logger's context
    // For now, we'll create a new one
    Arc::new(Mutex::new(LogContext::new()))
} 