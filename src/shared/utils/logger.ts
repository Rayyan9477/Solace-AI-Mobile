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
  private sensitivePatterns: RegExp[] = [
    /Bearer\s+[\w-]+\.[\w-]+\.[\w-]+/gi,
    /token["\s:]+["']?[\w-]+\.[\w-]+\.[\w-]+["']?/gi,
    /password["\s:]+["']?[^"'\s]+["']?/gi,
    /api[_-]?key["\s:]+["']?[^"'\s]+["']?/gi,
    /secret["\s:]+["']?[^"'\s]+["']?/gi,
    /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/gi,
    /\b\d{3}-\d{2}-\d{4}\b/g,
    /\b\d{16}\b/g,
  ];

  constructor(config?: Partial<LoggerConfig>) {
    this.config = {
      enabled: __DEV__,
      logLevel: 'debug',
      prefix: 'Solace AI',
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

  private sanitize(data: any): any {
    if (typeof data === 'string') {
      let sanitized = data;
      this.sensitivePatterns.forEach(pattern => {
        sanitized = sanitized.replace(pattern, '[REDACTED]');
      });
      return sanitized;
    }

    if (Array.isArray(data)) {
      return data.map(item => this.sanitize(item));
    }

    if (data && typeof data === 'object') {
      const sanitized: any = {};
      const sensitiveKeys = [
        'token', 'accessToken', 'refreshToken', 'password', 'secret',
        'apiKey', 'authorization', 'email', 'phone', 'ssn', 'cardNumber'
      ];

      for (const key in data) {
        if (data.hasOwnProperty(key)) {
          if (sensitiveKeys.some(k => key.toLowerCase().includes(k.toLowerCase()))) {
            sanitized[key] = '[REDACTED]';
          } else {
            sanitized[key] = this.sanitize(data[key]);
          }
        }
      }
      return sanitized;
    }

    return data;
  }

  private formatMessage(level: LogLevel, message: string, ...args: any[]): void {
    if (!this.shouldLog(level)) return;

    const sanitizedMessage = this.sanitize(message);
    const sanitizedArgs = args.map(arg => this.sanitize(arg));

    const timestamp = new Date().toISOString();
    const prefix = `${this.config.prefix} [${level.toUpperCase()}]`;

    switch (level) {
      case 'debug':
        console.log(`${prefix} [${timestamp}]`, sanitizedMessage, ...sanitizedArgs);
        break;
      case 'info':
        console.info(`${prefix} [${timestamp}]`, sanitizedMessage, ...sanitizedArgs);
        break;
      case 'warn':
        console.warn(`${prefix} [${timestamp}]`, sanitizedMessage, ...sanitizedArgs);
        break;
      case 'error':
        console.error(`${prefix} [${timestamp}]`, sanitizedMessage, ...sanitizedArgs);
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
