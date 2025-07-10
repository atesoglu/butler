export interface LogEntry {
  timestamp: string;
  level: string;
  message: string;
  target: string;
  module_path?: string;
  file?: string;
  line?: number;
  correlation_id?: string;
  user_id?: string;
  session_id?: string;
  properties: Record<string, any>;
  exception?: string;
}

export interface LogFilter {
  level?: string;
  search?: string;
  correlation_id?: string;
  user_id?: string;
  limit?: number;
}

// Extend Window interface to include Tauri
declare global {
  interface Window {
    __TAURI__?: any;
  }
}

class LogService {
  private isInitialized = false;
  private static invokeFunction: any = null;

  /**
   * Get the Tauri invoke function safely
   */
  private static async getInvokeFunction() {
    if (this.invokeFunction) {
      return this.invokeFunction;
    }

    // Check if we're in a Tauri environment
    if (typeof window !== 'undefined' && window.__TAURI__) {
      try {
        const tauriModule = await import('@tauri-apps/api/core');
        if (tauriModule.invoke && typeof tauriModule.invoke === 'function') {
          this.invokeFunction = tauriModule.invoke;
          console.log('Tauri invoke function successfully loaded');
          return this.invokeFunction;
        } else {
          console.warn('Tauri module loaded but invoke function not found');
        }
      } catch (error) {
        console.warn('Tauri invoke not available:', error);
      }
    } else {
      console.warn('Not running in Tauri environment');
    }
    
    return null;
  }

  async initialize(): Promise<void> {
    if (this.isInitialized) return;
    
    try {
      // Test connection to backend
      await this.getLogCount();
      this.isInitialized = true;
      console.log('LogService initialized successfully');
    } catch (error) {
      console.warn('LogService initialization failed:', error);
      this.isInitialized = false;
    }
  }

  async getLogs(): Promise<LogEntry[]> {
    await this.initialize();
    
    try {
      const invoke = await LogService.getInvokeFunction();
      if (!invoke) {
        console.warn('Tauri invoke not available, returning empty logs');
        return [];
      }
      
      const logs = await invoke('get_logs') as LogEntry[];
      return logs || [];
    } catch (error) {
      console.error('Failed to get logs:', error);
      return [];
    }
  }

  async getRecentLogs(count: number = 100): Promise<LogEntry[]> {
    await this.initialize();
    
    try {
      const invoke = await LogService.getInvokeFunction();
      if (!invoke) {
        console.warn('Tauri invoke not available, returning empty logs');
        return [];
      }
      
      const logs = await invoke('get_recent_logs', { count }) as LogEntry[];
      return logs || [];
    } catch (error) {
      console.error('Failed to get recent logs:', error);
      return [];
    }
  }

  async clearLogs(): Promise<void> {
    await this.initialize();
    
    try {
      const invoke = await LogService.getInvokeFunction();
      if (!invoke) {
        throw new Error('Tauri invoke function not available');
      }
      
      await invoke('clear_logs');
      console.log('Logs cleared successfully');
    } catch (error) {
      console.error('Failed to clear logs:', error);
      throw error;
    }
  }

  async getLogCount(): Promise<number> {
    await this.initialize();
    
    try {
      const invoke = await LogService.getInvokeFunction();
      if (!invoke) {
        console.warn('Tauri invoke not available, returning 0');
        return 0;
      }
      
      const count = await invoke('get_log_count') as number;
      return count || 0;
    } catch (error) {
      console.error('Failed to get log count:', error);
      return 0;
    }
  }

  async sendLogEntry(entry: Omit<LogEntry, 'timestamp'>): Promise<void> {
    await this.initialize();
    
    try {
      const invoke = await LogService.getInvokeFunction();
      if (!invoke) {
        console.warn('Tauri invoke not available, skipping log entry');
        return;
      }
      
      await invoke('log_entry', {
        entry: {
          ...entry,
          timestamp: new Date().toISOString()
        }
      });
    } catch (error) {
      console.error('Failed to send log entry:', error);
    }
  }

  filterLogs(logs: LogEntry[], filter: LogFilter): LogEntry[] {
    return logs.filter(log => {
      // Level filter
      if (filter.level && log.level !== filter.level) {
        return false;
      }

      // Search filter
      if (filter.search) {
        const searchLower = filter.search.toLowerCase();
        const messageLower = log.message.toLowerCase();
        const targetLower = log.target.toLowerCase();
        
        if (!messageLower.includes(searchLower) && !targetLower.includes(searchLower)) {
          return false;
        }
      }

      // Correlation ID filter
      if (filter.correlation_id && log.correlation_id !== filter.correlation_id) {
        return false;
      }

      // User ID filter
      if (filter.user_id && log.user_id !== filter.user_id) {
        return false;
      }

      return true;
    }).slice(0, filter.limit || logs.length);
  }

  formatLogEntry(log: LogEntry): string {
    const timestamp = new Date(log.timestamp).toLocaleString();
    const level = log.level.padEnd(5);
    const message = log.message;
    
    let formatted = `[${timestamp}] ${level} ${message}`;
    
    if (log.correlation_id) {
      formatted += ` [CorrelationId: ${log.correlation_id}]`;
    }
    
    if (log.user_id) {
      formatted += ` [UserId: ${log.user_id}]`;
    }
    
    if (log.file && log.line) {
      formatted += ` [${log.file}:${log.line}]`;
    }
    
    if (Object.keys(log.properties).length > 0) {
      const props = Object.entries(log.properties)
        .map(([k, v]) => `${k}=${v}`)
        .join(', ');
      formatted += ` [${props}]`;
    }
    
    return formatted;
  }

  getLogLevelColor(level: string): string {
    switch (level.toUpperCase()) {
      case 'ERROR':
        return '#da1e28'; // Red
      case 'WARN':
        return '#f1c21b'; // Yellow
      case 'INFO':
        return '#24a148'; // Green
      case 'DEBUG':
        return '#0043ce'; // Blue
      case 'TRACE':
        return '#8a3ffc'; // Purple
      default:
        return '#525252'; // Gray
    }
  }

  getLogLevelIcon(level: string): string {
    switch (level.toUpperCase()) {
      case 'ERROR':
        return '🔴';
      case 'WARN':
        return '🟡';
      case 'INFO':
        return '🟢';
      case 'DEBUG':
        return '🔵';
      case 'TRACE':
        return '🟣';
      default:
        return '⚪';
    }
  }
}

export const logService = new LogService(); 