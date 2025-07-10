export enum LogLevel {
  TRACE = 'TRACE',
  DEBUG = 'DEBUG',
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
}

export interface LogContext {
  correlationId?: string;
  userId?: string;
  sessionId?: string;
  properties?: Record<string, any>;
}

export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  target: string;
  modulePath?: string;
  file?: string;
  line?: number;
  correlationId?: string;
  userId?: string;
  sessionId?: string;
  properties?: Record<string, any>;
  exception?: string;
}

class LoggerService {
  private context: LogContext = {};
  private isInitialized = false;
  private tauriAvailable = false;
  private invokeFunction: any = null;
  private hasLoggedBackendError = false;
  private initializationPromise: Promise<void> | null = null;

  constructor() {
    this.initialize();
  }

  private initialize() {
    // Generate a correlation ID for this session
    this.context.correlationId = this.generateCorrelationId();
    this.context.sessionId = this.generateSessionId();
    this.isInitialized = true;
    
    // Check if Tauri is available (will be done asynchronously)
    this.initializationPromise = this.checkTauriAvailability();
    
    this.info('Logger service initialized', {
      correlationId: this.context.correlationId,
      sessionId: this.context.sessionId,
      tauriAvailable: this.tauriAvailable
    });
  }

  private async checkTauriAvailability() {
    try {
      // Try to import Tauri invoke dynamically
      const tauriModule = await import('@tauri-apps/api/core');
      if (tauriModule.invoke && typeof tauriModule.invoke === 'function') {
        this.tauriAvailable = true;
        this.invokeFunction = tauriModule.invoke;
        this.debug('Tauri invoke function loaded successfully');
      } else {
        this.tauriAvailable = false;
        this.debug('Tauri invoke function not available');
      }
    } catch (error) {
      this.tauriAvailable = false;
      this.debug('Tauri module not available', { error: error instanceof Error ? error.message : 'Unknown error' });
    }
  }

  private generateCorrelationId(): string {
    return `corr_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private formatMessage(level: LogLevel, message: string, properties?: Record<string, any>): string {
    const timestamp = new Date().toISOString();
    const props = properties ? ` ${JSON.stringify(properties)}` : '';
    const context = this.context.correlationId ? ` [CorrelationId: ${this.context.correlationId}]` : '';
    
    return `[${timestamp}] ${level} ${message}${props}${context}`;
  }

  private logToConsole(level: LogLevel, message: string, properties?: Record<string, any>) {
    const formattedMessage = this.formatMessage(level, message, properties);
    
    switch (level) {
      case LogLevel.ERROR:
        console.error(formattedMessage);
        break;
      case LogLevel.WARN:
        console.warn(formattedMessage);
        break;
      case LogLevel.INFO:
        console.info(formattedMessage);
        break;
      case LogLevel.DEBUG:
        console.debug(formattedMessage);
        break;
      case LogLevel.TRACE:
        console.trace(formattedMessage);
        break;
    }
  }

  private async logToBackend(entry: LogEntry) {
    // Wait for initialization to complete
    if (this.initializationPromise) {
      await this.initializationPromise;
    }

    // Only try to send to backend if Tauri is available and invoke function is loaded
    if (!this.tauriAvailable || !this.invokeFunction) {
      return;
    }

    try {
      await this.invokeFunction('log_entry', { entry });
    } catch (error) {
      // Silently fail for backend logging - don't spam console with errors
      // Only log the first error to avoid spam
      if (!this.hasLoggedBackendError) {
        console.warn('Backend logging failed - logs will only appear in console');
        this.hasLoggedBackendError = true;
      }
    }
  }

  private createLogEntry(
    level: LogLevel,
    message: string,
    properties?: Record<string, any>,
    error?: Error
  ): LogEntry {
    const stack = error?.stack;
    const fileInfo = this.getFileInfo(stack);

    return {
      timestamp: new Date().toISOString(),
      level,
      message,
      target: 'frontend',
      modulePath: fileInfo.modulePath,
      file: fileInfo.file,
      line: fileInfo.line,
      correlationId: this.context.correlationId,
      userId: this.context.userId,
      sessionId: this.context.sessionId,
      properties: { ...this.context.properties, ...properties },
      exception: error?.message,
    };
  }

  private getFileInfo(stack?: string): { modulePath?: string; file?: string; line?: number } {
    if (!stack) return {};

    const lines = stack.split('\n');
    // Skip the first line (error message) and find the first meaningful stack frame
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (line.startsWith('at ') && !line.includes('node_modules')) {
        // Extract file and line information
        const match = line.match(/at\s+(.+?)\s+\((.+):(\d+):(\d+)\)/);
        if (match) {
          return {
            modulePath: match[1],
            file: match[2],
            line: parseInt(match[3]),
          };
        }
      }
    }
    return {};
  }

  // Public logging methods
  trace(message: string, properties?: Record<string, any>) {
    this.logToConsole(LogLevel.TRACE, message, properties);
    this.logToBackend(this.createLogEntry(LogLevel.TRACE, message, properties));
  }

  debug(message: string, properties?: Record<string, any>) {
    this.logToConsole(LogLevel.DEBUG, message, properties);
    this.logToBackend(this.createLogEntry(LogLevel.DEBUG, message, properties));
  }

  info(message: string, properties?: Record<string, any>) {
    this.logToConsole(LogLevel.INFO, message, properties);
    this.logToBackend(this.createLogEntry(LogLevel.INFO, message, properties));
  }

  warn(message: string, properties?: Record<string, any>) {
    this.logToConsole(LogLevel.WARN, message, properties);
    this.logToBackend(this.createLogEntry(LogLevel.WARN, message, properties));
  }

  error(message: string, error?: Error, properties?: Record<string, any>) {
    this.logToConsole(LogLevel.ERROR, message, properties);
    this.logToBackend(this.createLogEntry(LogLevel.ERROR, message, properties, error));
  }

  // Context management
  setContext(context: Partial<LogContext>) {
    this.context = { ...this.context, ...context };
    this.info('Logger context updated', context);
  }

  setUserId(userId: string) {
    this.context.userId = userId;
    this.info('User ID set', { userId });
  }

  setCorrelationId(correlationId: string) {
    this.context.correlationId = correlationId;
    this.info('Correlation ID set', { correlationId });
  }

  addProperty(key: string, value: any) {
    if (!this.context.properties) {
      this.context.properties = {};
    }
    this.context.properties[key] = value;
  }

  // Utility methods
  logFunctionCall(functionName: string, parameters?: Record<string, any>) {
    this.debug(`Function called: ${functionName}`, parameters);
  }

  logFunctionReturn(functionName: string, returnValue?: any) {
    this.debug(`Function returned: ${functionName}`, { returnValue });
  }

  logApiCall(endpoint: string, method: string, parameters?: Record<string, any>) {
    this.info(`API call: ${method} ${endpoint}`, parameters);
  }

  logApiResponse(endpoint: string, status: number, responseTime?: number) {
    this.info(`API response: ${endpoint}`, { status, responseTime });
  }

  logUserAction(action: string, details?: Record<string, any>) {
    this.info(`User action: ${action}`, details);
  }

  logError(error: Error, context?: Record<string, any>) {
    this.error(`Application error: ${error.message}`, error, context);
  }

  logPerformance(operation: string, duration: number, properties?: Record<string, any>) {
    this.info(`Performance: ${operation}`, { duration, ...properties });
  }
}

// Create and export a singleton instance
export const logger = new LoggerService();

// Convenience functions for easier usage
export const logTrace = (message: string, properties?: Record<string, any>) => 
  logger.trace(message, properties);

export const logDebug = (message: string, properties?: Record<string, any>) => 
  logger.debug(message, properties);

export const logInfo = (message: string, properties?: Record<string, any>) => 
  logger.info(message, properties);

export const logWarn = (message: string, properties?: Record<string, any>) => 
  logger.warn(message, properties);

export const logError = (message: string, error?: Error, properties?: Record<string, any>) => 
  logger.error(message, error, properties);

export default logger; 