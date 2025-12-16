/**
 * Comprehensive Error Handling Service
 * Centralized error management with mental health sensitive messaging
 *
 * Features:
 * - Global error boundary support
 * - Categorized error types
 * - User-friendly error messages
 * - Automatic error reporting
 * - Recovery suggestions
 * - Crisis detection in error scenarios
 * - Stack trace management
 * - Error analytics integration
 */

import { Alert, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { logger } from '@shared/utils/logger';
import { i18n } from '@shared/services/i18nService';
import { retryService } from '@shared/services/retryService';
import { hapticService, HapticFeedbackType } from '@shared/services/hapticService';

// HIGH-007 FIX: Declare ErrorUtils type for React Native global error handling
// ErrorUtils is a global object provided by React Native, not a module export
declare const ErrorUtils: {
  getGlobalHandler: () => ((error: Error, isFatal?: boolean) => void) | null;
  setGlobalHandler: (handler: (error: Error, isFatal?: boolean) => void) => void;
};

// ============ TYPES ============

export enum ErrorSeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
}

export enum ErrorCategory {
  NETWORK = 'network',
  AUTHENTICATION = 'authentication',
  VALIDATION = 'validation',
  PERMISSION = 'permission',
  DATA = 'data',
  SYSTEM = 'system',
  CRISIS = 'crisis',
  UNKNOWN = 'unknown',
}

export interface ErrorContext {
  userId?: string;
  screen?: string;
  action?: string;
  metadata?: Record<string, any>;
  timestamp: Date;
}

export interface ErrorReport {
  id: string;
  message: string;
  stack?: string;
  severity: ErrorSeverity;
  category: ErrorCategory;
  context: ErrorContext;
  userMessage: string;
  recoverySuggestions: string[];
  isRecoverable: boolean;
  requiresSupport: boolean;
}

export interface ErrorRecoveryStrategy {
  canRecover: boolean;
  recoveryAction?: () => Promise<void>;
  fallbackAction?: () => void;
  userGuidance: string;
}

export interface CrisisIndicator {
  keywords: string[];
  severity: 'immediate' | 'high' | 'moderate';
  supportAction: () => void;
}

// ============ CONSTANTS ============

const ERROR_LOG_KEY = 'error_logs';
const MAX_ERROR_LOGS = 100;
const ERROR_REPORT_ENDPOINT = '/api/errors/report';

const CRISIS_KEYWORDS = [
  'suicide',
  'self-harm',
  'hurt myself',
  'end it all',
  'not worth living',
  'better off without me',
  'cant go on',
  'no point',
  'give up',
  'hopeless',
];

const ERROR_MESSAGES: Record<ErrorCategory, (error?: any) => string> = {
  [ErrorCategory.NETWORK]: () => i18n.t('errors.network'),
  [ErrorCategory.AUTHENTICATION]: () => i18n.t('errors.authentication'),
  [ErrorCategory.VALIDATION]: () => i18n.t('errors.validation'),
  [ErrorCategory.PERMISSION]: () => 'Permission denied. Please check your settings.',
  [ErrorCategory.DATA]: () => 'Data error occurred. Your information is safe.',
  [ErrorCategory.SYSTEM]: () => i18n.t('errors.general'),
  [ErrorCategory.CRISIS]: () => 'We noticed you might need immediate support.',
  [ErrorCategory.UNKNOWN]: () => i18n.t('errors.general'),
};

const RECOVERY_SUGGESTIONS: Record<ErrorCategory, string[]> = {
  [ErrorCategory.NETWORK]: [
    'Check your internet connection',
    'Try again in a few moments',
    'Your data has been saved locally',
  ],
  [ErrorCategory.AUTHENTICATION]: [
    'Please sign in again',
    'Check your credentials',
    'Reset your password if needed',
  ],
  [ErrorCategory.VALIDATION]: [
    'Please check your input',
    'Ensure all required fields are filled',
    'Follow the format guidelines',
  ],
  [ErrorCategory.PERMISSION]: [
    'Go to Settings to enable permissions',
    'Grant necessary access for this feature',
    'Contact support if issue persists',
  ],
  [ErrorCategory.DATA]: [
    'Your data is being synced',
    'Try refreshing the content',
    'Check back in a moment',
  ],
  [ErrorCategory.SYSTEM]: [
    'Restart the app',
    'Update to the latest version',
    'Contact support if problem continues',
  ],
  [ErrorCategory.CRISIS]: [
    'Reach out to crisis support',
    'Talk to someone you trust',
    'Emergency services are available',
  ],
  [ErrorCategory.UNKNOWN]: [
    'Try again',
    'Restart the app if needed',
    'We apologize for the inconvenience',
  ],
};

// ============ ERROR HANDLING SERVICE CLASS ============

class ErrorHandlingService {
  private errorLogs: ErrorReport[] = [];
  private errorHandlers: Map<string, (error: ErrorReport) => void> = new Map();
  private isInitialized: boolean = false;
  private currentContext: Partial<ErrorContext> = {};

  constructor() {
    this.initialize();
  }

  // ============ INITIALIZATION ============

  private async initialize(): Promise<void> {
    try {
      // Load persisted error logs
      await this.loadErrorLogs();

      // Set up global error handlers
      this.setupGlobalErrorHandlers();

      // Set up unhandled rejection handler
      this.setupUnhandledRejectionHandler();

      this.isInitialized = true;
      logger.info('Error handling service initialized');
    } catch (error) {
      logger.error('Failed to initialize error handling service', error);
    }
  }

  private setupGlobalErrorHandlers(): void {
    if (Platform.OS === 'web') {
      // Web error handling
      window.addEventListener('error', (event) => {
        this.handleError(event.error, {
          action: 'window_error',
          metadata: { message: event.message },
        });
      });
    } else {
      // React Native error handling
      const originalHandler = ErrorUtils.getGlobalHandler();
      ErrorUtils.setGlobalHandler((error, isFatal) => {
        this.handleError(error, {
          action: 'global_error',
          metadata: { isFatal },
        });

        // Call original handler
        if (originalHandler) {
          originalHandler(error, isFatal);
        }
      });
    }
  }

  private setupUnhandledRejectionHandler(): void {
    if (Platform.OS === 'web') {
      window.addEventListener('unhandledrejection', (event) => {
        this.handleError(event.reason, {
          action: 'unhandled_rejection',
          metadata: { promise: event.promise },
        });
      });
    } else {
      // React Native doesn't have a direct API for this
      // It's handled through the global error handler
    }
  }

  private async loadErrorLogs(): Promise<void> {
    try {
      const stored = await AsyncStorage.getItem(ERROR_LOG_KEY);
      if (stored) {
        this.errorLogs = JSON.parse(stored);
        logger.info(`Loaded ${this.errorLogs.length} error logs`);
      }
    } catch (error) {
      logger.error('Failed to load error logs', error);
    }
  }

  private async persistErrorLogs(): Promise<void> {
    try {
      // Keep only recent logs
      if (this.errorLogs.length > MAX_ERROR_LOGS) {
        this.errorLogs = this.errorLogs.slice(-MAX_ERROR_LOGS);
      }

      await AsyncStorage.setItem(ERROR_LOG_KEY, JSON.stringify(this.errorLogs));
    } catch (error) {
      logger.error('Failed to persist error logs', error);
    }
  }

  // ============ ERROR HANDLING ============

  /**
   * Main error handling method
   */
  async handleError(
    error: any,
    context?: Partial<ErrorContext>,
    options?: {
      silent?: boolean;
      skipLogging?: boolean;
      skipReporting?: boolean;
    }
  ): Promise<ErrorReport> {
    // Create error report
    const report = this.createErrorReport(error, context);

    // Check for crisis indicators
    if (this.checkCrisisIndicators(report)) {
      report.category = ErrorCategory.CRISIS;
      report.severity = ErrorSeverity.CRITICAL;
      report.requiresSupport = true;
    }

    // Log error
    if (!options?.skipLogging) {
      this.logError(report);
    }

    // Save to persistent storage
    this.errorLogs.push(report);
    await this.persistErrorLogs();

    // Report to backend
    if (!options?.skipReporting && this.shouldReportError(report)) {
      this.reportError(report);
    }

    // Show user notification
    if (!options?.silent) {
      this.notifyUser(report);
    }

    // Trigger recovery if available
    const recovery = this.getRecoveryStrategy(report);
    if (recovery.canRecover && recovery.recoveryAction) {
      try {
        await recovery.recoveryAction();
      } catch (recoveryError) {
        logger.error('Recovery action failed', recoveryError);
      }
    }

    // Notify registered handlers
    this.errorHandlers.forEach(handler => handler(report));

    return report;
  }

  private createErrorReport(error: any, context?: Partial<ErrorContext>): ErrorReport {
    const category = this.categorizeError(error);
    const severity = this.determineSeverity(error, category);

    const report: ErrorReport = {
      id: this.generateErrorId(),
      message: error?.message || 'Unknown error occurred',
      stack: error?.stack,
      severity,
      category,
      context: {
        ...this.currentContext,
        ...context,
        timestamp: new Date(),
      },
      userMessage: this.getUserMessage(error, category),
      recoverySuggestions: this.getRecoverySuggestions(category),
      isRecoverable: this.isRecoverable(error, category),
      requiresSupport: severity === ErrorSeverity.CRITICAL,
    };

    return report;
  }

  private categorizeError(error: any): ErrorCategory {
    // Network errors
    if (
      error?.code === 'NETWORK_ERROR' ||
      error?.code === 'ECONNREFUSED' ||
      error?.message?.toLowerCase().includes('network') ||
      error?.message?.toLowerCase().includes('fetch')
    ) {
      return ErrorCategory.NETWORK;
    }

    // Authentication errors
    if (
      error?.code === 'AUTH_FAILED' ||
      error?.status === 401 ||
      error?.status === 403 ||
      error?.message?.toLowerCase().includes('auth') ||
      error?.message?.toLowerCase().includes('unauthorized')
    ) {
      return ErrorCategory.AUTHENTICATION;
    }

    // Validation errors
    if (
      error?.type === 'validation' ||
      error?.status === 400 ||
      error?.message?.toLowerCase().includes('invalid') ||
      error?.message?.toLowerCase().includes('required')
    ) {
      return ErrorCategory.VALIDATION;
    }

    // Permission errors
    if (
      error?.code === 'PERMISSION_DENIED' ||
      error?.message?.toLowerCase().includes('permission')
    ) {
      return ErrorCategory.PERMISSION;
    }

    // Data errors
    if (
      error?.code === 'DATA_ERROR' ||
      error?.message?.toLowerCase().includes('data') ||
      error?.message?.toLowerCase().includes('database')
    ) {
      return ErrorCategory.DATA;
    }

    // System errors
    if (
      error?.status >= 500 ||
      error?.message?.toLowerCase().includes('system') ||
      error?.message?.toLowerCase().includes('internal')
    ) {
      return ErrorCategory.SYSTEM;
    }

    return ErrorCategory.UNKNOWN;
  }

  private determineSeverity(error: any, category: ErrorCategory): ErrorSeverity {
    // Critical categories
    if (category === ErrorCategory.CRISIS) {
      return ErrorSeverity.CRITICAL;
    }

    // Check for fatal errors
    if (error?.isFatal || error?.critical) {
      return ErrorSeverity.CRITICAL;
    }

    // System errors are high severity
    if (category === ErrorCategory.SYSTEM) {
      return ErrorSeverity.HIGH;
    }

    // Authentication errors are medium
    if (category === ErrorCategory.AUTHENTICATION) {
      return ErrorSeverity.MEDIUM;
    }

    // Network and validation are low
    if (
      category === ErrorCategory.NETWORK ||
      category === ErrorCategory.VALIDATION
    ) {
      return ErrorSeverity.LOW;
    }

    // Default based on status code
    if (error?.status >= 500) {
      return ErrorSeverity.HIGH;
    }

    return ErrorSeverity.MEDIUM;
  }

  private checkCrisisIndicators(report: ErrorReport): boolean {
    const textToCheck = `${report.message} ${JSON.stringify(report.context.metadata || {})}`.toLowerCase();

    return CRISIS_KEYWORDS.some(keyword => textToCheck.includes(keyword));
  }

  private getUserMessage(error: any, category: ErrorCategory): string {
    // Use custom message if provided
    if (error?.userMessage) {
      return error.userMessage;
    }

    // Use category-specific message
    const messageGenerator = ERROR_MESSAGES[category];
    if (messageGenerator) {
      return messageGenerator(error);
    }

    // Fallback
    return i18n.t('errors.general');
  }

  private getRecoverySuggestions(category: ErrorCategory): string[] {
    return RECOVERY_SUGGESTIONS[category] || RECOVERY_SUGGESTIONS[ErrorCategory.UNKNOWN];
  }

  private isRecoverable(error: any, category: ErrorCategory): boolean {
    // Non-recoverable errors
    if (error?.isFatal || category === ErrorCategory.CRISIS) {
      return false;
    }

    // Generally recoverable categories
    if (
      category === ErrorCategory.NETWORK ||
      category === ErrorCategory.VALIDATION ||
      category === ErrorCategory.DATA
    ) {
      return true;
    }

    // Check specific error properties
    if (error?.recoverable !== undefined) {
      return error.recoverable;
    }

    // Default to potentially recoverable
    return true;
  }

  private generateErrorId(): string {
    return `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // ============ ERROR RECOVERY ============

  getRecoveryStrategy(report: ErrorReport): ErrorRecoveryStrategy {
    const strategy: ErrorRecoveryStrategy = {
      canRecover: report.isRecoverable,
      userGuidance: report.recoverySuggestions[0] || 'Please try again',
    };

    switch (report.category) {
      case ErrorCategory.NETWORK:
        strategy.recoveryAction = async () => {
          // Wait for network and retry
          await retryService.retryApiCall(
            async () => {
              // Retry the failed network operation
              logger.info('Retrying network operation');
              return Promise.resolve();
            },
            'Network recovery'
          );
        };
        break;

      case ErrorCategory.AUTHENTICATION:
        strategy.recoveryAction = async () => {
          // Navigate to login screen
          logger.info('Navigating to authentication');
          // Navigation would be handled by the app
        };
        break;

      case ErrorCategory.DATA:
        strategy.recoveryAction = async () => {
          // Trigger data sync
          logger.info('Triggering data recovery');
          // Data sync would be handled by data service
        };
        break;

      case ErrorCategory.CRISIS:
        strategy.canRecover = false;
        strategy.userGuidance = 'Immediate support is available';
        strategy.fallbackAction = () => {
          this.triggerCrisisSupport();
        };
        break;
    }

    return strategy;
  }

  // ============ USER NOTIFICATION ============

  private notifyUser(report: ErrorReport): void {
    // Haptic feedback for errors
    hapticService.trigger(HapticFeedbackType.ERROR);

    // Show alert based on severity
    if (report.severity === ErrorSeverity.CRITICAL) {
      this.showCriticalErrorAlert(report);
    } else if (report.severity === ErrorSeverity.HIGH) {
      this.showErrorAlert(report);
    } else {
      this.showErrorToast(report);
    }
  }

  private showCriticalErrorAlert(report: ErrorReport): void {
    const buttons = [
      {
        text: i18n.t('common.cancel'),
        style: 'cancel' as const,
      },
    ];

    if (report.requiresSupport) {
      buttons.push({
        text: 'Get Help',
        onPress: () => this.triggerCrisisSupport(),
        style: 'default' as const,
      });
    }

    Alert.alert(
      'Immediate Attention Required',
      report.userMessage,
      buttons,
      { cancelable: false }
    );
  }

  private showErrorAlert(report: ErrorReport): void {
    Alert.alert(
      i18n.t('common.error'),
      report.userMessage,
      [
        {
          text: i18n.t('common.ok'),
          onPress: () => {
            const recovery = this.getRecoveryStrategy(report);
            if (recovery.fallbackAction) {
              recovery.fallbackAction();
            }
          },
        },
      ]
    );
  }

  private showErrorToast(report: ErrorReport): void {
    // In a real app, this would show a toast notification
    logger.info('Error toast:', report.userMessage);
  }

  private triggerCrisisSupport(): void {
    logger.warn('Crisis support triggered');
    hapticService.trigger(HapticFeedbackType.SOS);

    // In a real app, this would:
    // - Navigate to crisis support screen
    // - Show emergency contacts
    // - Potentially notify emergency contacts
    // - Start calming exercises
  }

  // ============ ERROR REPORTING ============

  private shouldReportError(report: ErrorReport): boolean {
    // Always report critical errors
    if (report.severity === ErrorSeverity.CRITICAL) {
      return true;
    }

    // Report high severity errors
    if (report.severity === ErrorSeverity.HIGH) {
      return true;
    }

    // Report authentication errors for security
    if (report.category === ErrorCategory.AUTHENTICATION) {
      return true;
    }

    // Don't report expected errors
    if (report.category === ErrorCategory.VALIDATION) {
      return false;
    }

    return true;
  }

  private async reportError(report: ErrorReport): Promise<void> {
    try {
      // Send error report to backend
      await retryService.retryApiCall(
        async () => {
          // This would be the actual API call
          logger.info('Reporting error to backend', { errorId: report.id });

          // Simulate API call
          return Promise.resolve();
        },
        'Error reporting'
      );
    } catch (error) {
      logger.error('Failed to report error', error);
      // Store for later reporting
      this.queueErrorForLaterReporting(report);
    }
  }

  private queueErrorForLaterReporting(report: ErrorReport): void {
    // Store in queue for retry when connection is restored
    retryService.retryWithQueue(
      `error_report_${report.id}`,
      async () => {
        // Retry error reporting
        return Promise.resolve();
      },
      {
        maxRetries: 5,
        initialDelay: 5000,
      },
      { errorReport: report }
    ).catch(error => {
      logger.error('Failed to queue error report', error);
    });
  }

  // ============ ERROR LOGGING ============

  private logError(report: ErrorReport): void {
    const logData = {
      id: report.id,
      message: report.message,
      category: report.category,
      severity: report.severity,
      context: report.context,
    };

    switch (report.severity) {
      case ErrorSeverity.CRITICAL:
        logger.error('CRITICAL ERROR', logData);
        break;
      case ErrorSeverity.HIGH:
        logger.error('High severity error', logData);
        break;
      case ErrorSeverity.MEDIUM:
        logger.warn('Medium severity error', logData);
        break;
      case ErrorSeverity.LOW:
        logger.info('Low severity error', logData);
        break;
    }
  }

  // ============ PUBLIC API ============

  /**
   * Set current context for error tracking
   */
  setContext(context: Partial<ErrorContext>): void {
    this.currentContext = { ...this.currentContext, ...context };
  }

  /**
   * Clear current context
   */
  clearContext(): void {
    this.currentContext = {};
  }

  /**
   * Register error handler
   */
  onError(handler: (error: ErrorReport) => void): () => void {
    const id = `handler_${Date.now()}`;
    this.errorHandlers.set(id, handler);
    return () => this.errorHandlers.delete(id);
  }

  /**
   * Get error logs
   */
  getErrorLogs(filter?: {
    category?: ErrorCategory;
    severity?: ErrorSeverity;
    since?: Date;
  }): ErrorReport[] {
    let logs = [...this.errorLogs];

    if (filter?.category) {
      logs = logs.filter(log => log.category === filter.category);
    }

    if (filter?.severity) {
      logs = logs.filter(log => log.severity === filter.severity);
    }

    if (filter?.since) {
      logs = logs.filter(log => new Date(log.context.timestamp) >= filter.since);
    }

    return logs;
  }

  /**
   * Clear error logs
   */
  async clearErrorLogs(): Promise<void> {
    this.errorLogs = [];
    await AsyncStorage.removeItem(ERROR_LOG_KEY);
    logger.info('Error logs cleared');
  }

  /**
   * Test error handling
   */
  testError(category: ErrorCategory = ErrorCategory.UNKNOWN): void {
    const testError = new Error(`Test error for category: ${category}`);
    (testError as any).category = category;
    this.handleError(testError, { action: 'test' });
  }
}

// ============ EXPORTS ============

export const errorHandler = new ErrorHandlingService();

// Convenience functions
export const handleError = (error: any, context?: Partial<ErrorContext>) =>
  errorHandler.handleError(error, context);

export const setErrorContext = (context: Partial<ErrorContext>) =>
  errorHandler.setContext(context);

export default errorHandler;