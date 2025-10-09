/**
 * Unified Logger Utility
 * Centralized logging with environment-aware output
 *
 * Usage:
 * import { logger } from '@shared/utils/logger';
 *
 * logger.debug('Debug message');
 * logger.info('Info message');
 * logger.warn('Warning message');
 * logger.error('Error message', error);
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LoggerConfig {
  enabled: boolean;
  logLevel: LogLevel;
  prefix: string;
}

class Logger {
  private config: LoggerConfig;

  constructor(config?: Partial<LoggerConfig>) {
    this.config = {
      enabled: __DEV__, // Only log in development by default
      logLevel: 'debug',
      prefix: '🌟 Solace AI',
      ...config,
    };
  }

  private shouldLog(level: LogLevel): boolean {
    if (!this.config.enabled) return false;

    const levels: LogLevel[] = ['debug', 'info', 'warn', 'error'];
    const currentLevelIndex = levels.indexOf(this.config.logLevel);
    const requestedLevelIndex = levels.indexOf(level);

    return requestedLevelIndex >= currentLevelIndex;
  }

  private formatMessage(level: LogLevel, message: string, ...args: any[]): void {
    if (!this.shouldLog(level)) return;

    const emoji = {
      debug: '🔍',
      info: 'ℹ️',
      warn: '⚠️',
      error: '❌',
    };

    const timestamp = new Date().toISOString();
    const prefix = `${emoji[level]} ${this.config.prefix}`;

    switch (level) {
      case 'debug':
        console.log(`${prefix} [${timestamp}]`, message, ...args);
        break;
      case 'info':
        console.info(`${prefix} [${timestamp}]`, message, ...args);
        break;
      case 'warn':
        console.warn(`${prefix} [${timestamp}]`, message, ...args);
        break;
      case 'error':
        console.error(`${prefix} [${timestamp}]`, message, ...args);
        break;
    }
  }

  /**
   * Log debug messages (development only)
   */
  debug(message: string, ...args: any[]): void {
    this.formatMessage('debug', message, ...args);
  }

  /**
   * Log informational messages
   */
  info(message: string, ...args: any[]): void {
    this.formatMessage('info', message, ...args);
  }

  /**
   * Log warning messages
   */
  warn(message: string, ...args: any[]): void {
    this.formatMessage('warn', message, ...args);
  }

  /**
   * Log error messages (always logged)
   */
  error(message: string, error?: Error | any, ...args: any[]): void {
    if (error instanceof Error) {
      this.formatMessage('error', message, {
        message: error.message,
        stack: error.stack,
        ...args,
      });
    } else {
      this.formatMessage('error', message, error, ...args);
    }
  }

  /**
   * Group related log messages
   */
  group(title: string): void {
    if (this.shouldLog('debug') && console.group) {
      console.group(`${this.config.prefix}: ${title}`);
    }
  }

  /**
   * End grouped log messages
   */
  groupEnd(): void {
    if (this.shouldLog('debug') && console.groupEnd) {
      console.groupEnd();
    }
  }

  /**
   * Log performance timing
   */
  time(label: string): void {
    if (this.shouldLog('debug') && console.time) {
      console.time(`${this.config.prefix}: ${label}`);
    }
  }

  /**
   * End performance timing
   */
  timeEnd(label: string): void {
    if (this.shouldLog('debug') && console.timeEnd) {
      console.timeEnd(`${this.config.prefix}: ${label}`);
    }
  }

  /**
   * Update logger configuration
   */
  configure(config: Partial<LoggerConfig>): void {
    this.config = { ...this.config, ...config };
  }
}

// Export singleton instance
export const logger = new Logger();

// Export for custom loggers
export { Logger };
export type { LoggerConfig, LogLevel };
