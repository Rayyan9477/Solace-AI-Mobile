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

type LogLevel = "debug" | "info" | "warn" | "error";

interface LoggerConfig {
  enabled: boolean;
  logLevel: LogLevel;
  prefix: string;
}

class Logger {
  private config: LoggerConfig;
  private readonly MAX_LOG_LENGTH = 10000; // Maximum characters per log entry

  // MED-012 FIX: Minimum length thresholds for patterns
  // Short strings below these lengths cannot possibly match sensitive patterns
  private readonly MIN_SENSITIVE_LENGTH = 7; // Shortest pattern match: "1.1.1.1" (IP)
  private readonly MIN_BEARER_LENGTH = 20; // Shortest Bearer token pattern

  // MED-012 FIX: Quick pre-check regex to avoid running all patterns on clean strings
  // This single regex checks for common indicators of sensitive data
  private readonly quickCheckPattern =
    /Bearer|token|api[_-]?key|secret|password|@|\d{3}[-.\s]?\d{3}/i;

  // Patterns for sensitive data that should be redacted
  private sensitivePatterns: RegExp[] = [
    // JWT tokens and Bearer tokens
    /Bearer\s+[\w-]+\.[\w-]+\.[\w-]+/gi,
    /token["\s:]+["']?[\w-]+\.[\w-]+\.[\w-]+["']?/gi,

    // API keys and secrets
    /api[_-]?key["\s:]+["']?[^"'\s]+["']?/gi,
    /secret["\s:]+["']?[^"'\s]+["']?/gi,

    // Passwords
    /password["\s:]+["']?[^"'\s]+["']?/gi,

    // Email addresses (PII)
    /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/gi,

    // Social Security Numbers (US)
    /\b\d{3}-\d{2}-\d{4}\b/g,

    // Credit card numbers
    /\b\d{16}\b/g,
    /\b\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}\b/g,

    // Phone numbers
    /\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/g,
    /\b\+?1?\s*\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}\b/g,

    // IP addresses (potential PII)
    /\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/g,
  ];

  constructor(config?: Partial<LoggerConfig>) {
    this.config = {
      enabled: __DEV__,
      logLevel: "debug",
      prefix: "Solace AI",
      ...config,
    };
  }

  private shouldLog(level: LogLevel): boolean {
    if (!this.config.enabled) return false;

    const levels: LogLevel[] = ["debug", "info", "warn", "error"];
    const currentLevelIndex = levels.indexOf(this.config.logLevel);
    const requestedLevelIndex = levels.indexOf(level);

    return requestedLevelIndex >= currentLevelIndex;
  }

  /**
   * Prevent log injection attacks by escaping control characters
   * Removes newlines, carriage returns, and other control characters that could
   * be used to inject malicious content into logs
   */
  private preventLogInjection(str: string): string {
    return str
      .replace(/\n/g, "\\n") // Escape newlines
      .replace(/\r/g, "\\r") // Escape carriage returns
      .replace(/\t/g, "\\t") // Escape tabs
      .replace(/[\x00-\x1F\x7F]/g, "") // Remove other control characters
      .substring(0, this.MAX_LOG_LENGTH); // Limit length
  }

  private sanitize(data: any): any {
    if (typeof data === "string") {
      // First prevent log injection attacks
      let sanitized = this.preventLogInjection(data);

      // MED-012 FIX: Early bailout for short strings that can't contain sensitive data
      if (sanitized.length < this.MIN_SENSITIVE_LENGTH) {
        return sanitized;
      }

      // MED-012 FIX: Quick pre-check to avoid running all patterns on clean strings
      // If the quick check doesn't find any sensitive indicators, skip full pattern matching
      if (!this.quickCheckPattern.test(sanitized)) {
        return sanitized;
      }

      // Then redact sensitive data
      this.sensitivePatterns.forEach((pattern) => {
        sanitized = sanitized.replace(pattern, "[REDACTED]");
      });

      return sanitized;
    }

    if (Array.isArray(data)) {
      return data.map((item) => this.sanitize(item));
    }

    if (data && typeof data === "object") {
      const sanitized: any = {};
      const sensitiveKeys = [
        "token",
        "accessToken",
        "refreshToken",
        "password",
        "secret",
        "apiKey",
        "authorization",
        "email",
        "phone",
        "ssn",
        "cardNumber",
      ];

      for (const key in data) {
        if (data.hasOwnProperty(key)) {
          if (
            sensitiveKeys.some((k) =>
              key.toLowerCase().includes(k.toLowerCase()),
            )
          ) {
            sanitized[key] = "[REDACTED]";
          } else {
            sanitized[key] = this.sanitize(data[key]);
          }
        }
      }
      return sanitized;
    }

    return data;
  }

  private formatMessage(
    level: LogLevel,
    message: string,
    ...args: any[]
  ): void {
    if (!this.shouldLog(level)) return;

    const sanitizedMessage = this.sanitize(message);
    const sanitizedArgs = args.map((arg) => this.sanitize(arg));

    const timestamp = new Date().toISOString();
    const prefix = `${this.config.prefix} [${level.toUpperCase()}]`;

    switch (level) {
      case "debug":
        console.log(
          `${prefix} [${timestamp}]`,
          sanitizedMessage,
          ...sanitizedArgs,
        );
        break;
      case "info":
        console.info(
          `${prefix} [${timestamp}]`,
          sanitizedMessage,
          ...sanitizedArgs,
        );
        break;
      case "warn":
        console.warn(
          `${prefix} [${timestamp}]`,
          sanitizedMessage,
          ...sanitizedArgs,
        );
        break;
      case "error":
        console.error(
          `${prefix} [${timestamp}]`,
          sanitizedMessage,
          ...sanitizedArgs,
        );
        break;
    }
  }

  /**
   * Log debug messages (development only)
   */
  debug(message: string, ...args: any[]): void {
    this.formatMessage("debug", message, ...args);
  }

  /**
   * Log informational messages
   */
  info(message: string, ...args: any[]): void {
    this.formatMessage("info", message, ...args);
  }

  /**
   * Log warning messages
   */
  warn(message: string, ...args: any[]): void {
    this.formatMessage("warn", message, ...args);
  }

  /**
   * Log error messages (always logged)
   */
  error(message: string, error?: Error | any, ...args: any[]): void {
    if (error instanceof Error) {
      this.formatMessage("error", message, {
        message: error.message,
        stack: error.stack,
        ...args,
      });
    } else {
      this.formatMessage("error", message, error, ...args);
    }
  }

  /**
   * Group related log messages
   */
  group(title: string): void {
    if (this.shouldLog("debug") && console.group) {
      console.group(`${this.config.prefix}: ${title}`);
    }
  }

  /**
   * End grouped log messages
   */
  groupEnd(): void {
    if (this.shouldLog("debug") && console.groupEnd) {
      console.groupEnd();
    }
  }

  /**
   * Log performance timing
   */
  time(label: string): void {
    if (this.shouldLog("debug") && console.time) {
      console.time(`${this.config.prefix}: ${label}`);
    }
  }

  /**
   * End performance timing
   */
  timeEnd(label: string): void {
    if (this.shouldLog("debug") && console.timeEnd) {
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
