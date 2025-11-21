/**
 * Enhanced Retry Service
 * Provides intelligent retry logic with exponential backoff, circuit breaker,
 * and persistent queue for offline operations
 *
 * Features:
 * - Exponential backoff with jitter
 * - Circuit breaker pattern
 * - Persistent retry queue for offline operations
 * - Network connectivity monitoring
 * - Integration with data sync service
 */

import { logger } from "@shared/utils/logger";
import NetInfo, { NetInfoState } from "@react-native-community/netinfo";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface RetryOptions {
  maxRetries?: number;
  initialDelay?: number;
  maxDelay?: number;
  backoffMultiplier?: number;
  retryableStatusCodes?: number[];
  timeout?: number;
  jitter?: boolean;
  onRetry?: (attempt: number, error: any) => void;
  retryCondition?: (error: any) => boolean;
}

interface RetryResult<T> {
  success: boolean;
  data?: T;
  error?: Error;
  attempts: number;
}

interface RetryableOperation<T = any> {
  id: string;
  operation: () => Promise<T>;
  options?: RetryOptions;
  attempts: number;
  lastAttempt?: Date;
  nextRetry?: Date;
  error?: any;
  metadata?: Record<string, any>;
}

interface CircuitBreakerConfig {
  failureThreshold: number;
  resetTimeout: number;
  halfOpenRequests: number;
}

enum CircuitState {
  CLOSED = 'closed',
  OPEN = 'open',
  HALF_OPEN = 'half_open',
}

// ============ CONSTANTS ============

const STORAGE_KEY = 'retry_queue';
const CIRCUIT_BREAKER_KEY = 'circuit_breaker_state';

// ============ CIRCUIT BREAKER CLASS ============

class CircuitBreaker {
  private state: CircuitState = CircuitState.CLOSED;
  private failures: number = 0;
  private lastFailureTime?: Date;
  private halfOpenRequests: number = 0;

  constructor(private config: CircuitBreakerConfig) {}

  recordSuccess(): void {
    if (this.state === CircuitState.HALF_OPEN) {
      this.halfOpenRequests++;
      if (this.halfOpenRequests >= this.config.halfOpenRequests) {
        this.state = CircuitState.CLOSED;
        this.failures = 0;
        this.halfOpenRequests = 0;
        logger.info('Circuit breaker closed');
      }
    } else if (this.state === CircuitState.CLOSED) {
      this.failures = 0;
    }
  }

  recordFailure(): void {
    this.failures++;
    this.lastFailureTime = new Date();

    if (this.failures >= this.config.failureThreshold) {
      this.state = CircuitState.OPEN;
      logger.warn('Circuit breaker opened');

      // Schedule transition to half-open
      setTimeout(() => {
        this.state = CircuitState.HALF_OPEN;
        this.halfOpenRequests = 0;
        logger.info('Circuit breaker half-open');
      }, this.config.resetTimeout);
    }
  }

  isOpen(): boolean {
    return this.state === CircuitState.OPEN;
  }

  getState(): CircuitState {
    return this.state;
  }
}

// ============ RETRY SERVICE CLASS ============

class RetryService {
  private defaultOptions: Required<RetryOptions> = {
    maxRetries: 3,
    initialDelay: 1000, // 1 second
    maxDelay: 30000, // 30 seconds
    backoffMultiplier: 2,
    retryableStatusCodes: [408, 429, 500, 502, 503, 504],
    timeout: 10000,
    jitter: true,
    onRetry: () => {},
    retryCondition: (error) => {
      // Default retry condition
      if (!error) return false;

      // Network errors
      if (error.code === 'NETWORK_ERROR' || error.code === 'ECONNREFUSED') {
        return true;
      }

      // Timeout errors
      if (error.code === 'ETIMEDOUT' || error.code === 'ECONNABORTED') {
        return true;
      }

      // HTTP status codes
      if (error.statusCode) {
        return this.defaultOptions.retryableStatusCodes.includes(error.statusCode);
      }

      return false;
    },
  };

  private retryQueue: Map<string, RetryableOperation> = new Map();
  private isOnline: boolean = true;
  private unsubscribeNetInfo: (() => void) | null = null;
  private circuitBreakers: Map<string, CircuitBreaker> = new Map();
  private retryTimers: Map<string, NodeJS.Timeout> = new Map();

  constructor() {
    this.initializeNetworkListener();
    this.loadPersistedQueue();
  }

  // ============ INITIALIZATION ============

  private async initializeNetworkListener(): Promise<void> {
    this.unsubscribeNetInfo = NetInfo.addEventListener((state: NetInfoState) => {
      const wasOffline = !this.isOnline;
      this.isOnline = state.isConnected ?? false;

      logger.debug('Network state changed', {
        isOnline: this.isOnline,
        type: state.type,
      });

      // Retry queued operations when coming back online
      if (wasOffline && this.isOnline) {
        logger.info('Network restored, processing retry queue');
        this.processQueue();
      }
    });

    // Get initial network state
    const state = await NetInfo.fetch();
    this.isOnline = state.isConnected ?? false;
  }

  private async loadPersistedQueue(): Promise<void> {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        const operations = JSON.parse(stored) as RetryableOperation[];
        operations.forEach(op => {
          // Reconstruct operations (functions can't be persisted)
          if (op.metadata?.type === 'api_call') {
            this.retryQueue.set(op.id, {
              ...op,
              operation: () => this.reconstructApiCall(op.metadata),
            });
          }
        });

        logger.info(`Loaded ${operations.length} operations from persistent queue`);

        // Process queue if online
        if (this.isOnline) {
          this.processQueue();
        }
      }
    } catch (error) {
      logger.error('Failed to load retry queue', error);
    }
  }

  private async persistQueue(): Promise<void> {
    try {
      const operations = Array.from(this.retryQueue.values()).map(op => ({
        ...op,
        operation: undefined, // Can't persist functions
      }));

      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(operations));
    } catch (error) {
      logger.error('Failed to persist retry queue', error);
    }
  }

  // ============ MAIN RETRY METHODS ============

  /**
   * Execute a function with retry logic
   */
  async executeWithRetry<T>(
    fn: () => Promise<T>,
    options: RetryOptions = {}
  ): Promise<RetryResult<T>> {
    const opts = { ...this.defaultOptions, ...options };
    let lastError: Error | undefined;
    let delay = opts.initialDelay;

    // Check circuit breaker
    const circuitKey = this.getCircuitKey(fn);
    if (this.isCircuitOpen(circuitKey)) {
      logger.warn('Circuit breaker is open, skipping retry');
      return {
        success: false,
        error: new Error('Circuit breaker is open'),
        attempts: 0,
      };
    }

    for (let attempt = 0; attempt <= opts.maxRetries; attempt++) {
      try {
        // Check connectivity before attempting
        if (attempt > 0) {
          const isConnected = await this.checkConnectivity();
          if (!isConnected) {
            throw new Error("No internet connection");
          }
        }

        // Execute with timeout
        const result = await this.withTimeout(fn(), opts.timeout);

        // Record success for circuit breaker
        this.recordSuccess(circuitKey);

        logger.info("Request succeeded", { attempt });
        return {
          success: true,
          data: result,
          attempts: attempt + 1,
        };
      } catch (error: any) {
        lastError = error;

        // Record failure for circuit breaker
        this.recordFailure(circuitKey);

        // Check if error is retryable
        const isRetryable = opts.retryCondition
          ? opts.retryCondition(error)
          : this.isRetryable(error, opts);

        if (!isRetryable) {
          logger.warn("Error is not retryable", { error: error.message });
          break;
        }

        // Check if we have more retries left
        if (attempt < opts.maxRetries) {
          // Calculate delay with optional jitter
          delay = this.calculateDelay(
            attempt,
            opts.initialDelay,
            opts.maxDelay,
            opts.backoffMultiplier,
            opts.jitter
          );

          logger.info("Retrying request", {
            attempt: attempt + 1,
            delay,
            error: error.message,
          });

          opts.onRetry(attempt + 1, error);

          // Wait before retry
          await this.sleep(delay);
        }
      }
    }

    logger.error("Max retries exceeded", {
      error: lastError?.message,
      attempts: opts.maxRetries + 1,
    });

    return {
      success: false,
      error: lastError,
      attempts: opts.maxRetries + 1,
    };
  }

  /**
   * Retry with queue for offline support
   */
  async retryWithQueue<T>(
    id: string,
    operation: () => Promise<T>,
    options?: RetryOptions,
    metadata?: Record<string, any>
  ): Promise<T> {
    try {
      // Try immediate execution if online
      if (this.isOnline) {
        const result = await this.executeWithRetry(operation, options);
        if (result.success) {
          return result.data as T;
        }
      }
    } catch (error) {
      logger.warn('Operation failed, adding to retry queue', { id, error });
    }

    // Add to queue for later retry
    await this.addToQueue({
      id,
      operation,
      options,
      attempts: 0,
      metadata,
    });

    throw new Error(`Operation ${id} queued for retry`);
  }

  // ============ QUEUE MANAGEMENT ============

  async addToQueue(operation: RetryableOperation): Promise<void> {
    this.retryQueue.set(operation.id, {
      ...operation,
      lastAttempt: new Date(),
      nextRetry: this.calculateNextRetry(operation.attempts),
    });

    await this.persistQueue();

    logger.info(`Added operation ${operation.id} to retry queue`);

    // Schedule retry
    this.scheduleRetry(operation);
  }

  async removeFromQueue(id: string): Promise<void> {
    this.retryQueue.delete(id);

    // Clear any scheduled timer
    const timer = this.retryTimers.get(id);
    if (timer) {
      clearTimeout(timer);
      this.retryTimers.delete(id);
    }

    await this.persistQueue();

    logger.info(`Removed operation ${id} from retry queue`);
  }

  async processQueue(): Promise<void> {
    if (!this.isOnline) {
      logger.debug('Skipping queue processing - offline');
      return;
    }

    const operations = Array.from(this.retryQueue.values());

    logger.info(`Processing ${operations.length} queued operations`);

    for (const op of operations) {
      // Skip if not ready for retry
      if (op.nextRetry && op.nextRetry > new Date()) {
        continue;
      }

      try {
        const result = await this.executeWithRetry(op.operation, op.options);

        if (result.success) {
          logger.info(`Successfully processed queued operation ${op.id}`);
          await this.removeFromQueue(op.id);
        } else {
          throw result.error;
        }
      } catch (error) {
        logger.error(`Failed to process queued operation ${op.id}`, error);

        // Update operation with new attempt count
        const updatedOp: RetryableOperation = {
          ...op,
          attempts: op.attempts + 1,
          lastAttempt: new Date(),
          error,
          nextRetry: this.calculateNextRetry(op.attempts + 1),
        };

        // Check if exceeded max attempts
        const maxAttempts = op.options?.maxRetries ?? this.defaultOptions.maxRetries;
        if (updatedOp.attempts >= maxAttempts) {
          logger.error(`Operation ${op.id} exceeded max attempts, removing from queue`);
          await this.removeFromQueue(op.id);
        } else {
          this.retryQueue.set(op.id, updatedOp);
          await this.persistQueue();
          this.scheduleRetry(updatedOp);
        }
      }
    }
  }

  // ============ CIRCUIT BREAKER METHODS ============

  private getCircuitKey(operation: Function): string {
    // Generate a key based on the function signature
    return operation.toString().substring(0, 50);
  }

  private isCircuitOpen(key: string): boolean {
    const breaker = this.circuitBreakers.get(key);
    if (!breaker) return false;

    return breaker.isOpen();
  }

  private recordSuccess(key: string): void {
    const breaker = this.circuitBreakers.get(key);
    if (breaker) {
      breaker.recordSuccess();
    }
  }

  private recordFailure(key: string): void {
    let breaker = this.circuitBreakers.get(key);
    if (!breaker) {
      breaker = new CircuitBreaker({
        failureThreshold: 5,
        resetTimeout: 60000,
        halfOpenRequests: 3,
      });
      this.circuitBreakers.set(key, breaker);
    }

    breaker.recordFailure();
  }

  // ============ HELPER METHODS ============

  /**
   * Check if error is retryable
   */
  private isRetryable(error: any, options: Required<RetryOptions>): boolean {
    // Network errors are retryable
    if (
      error.name === "AbortError" ||
      error.message?.includes("timeout") ||
      error.message?.includes("network") ||
      error.message?.includes("connection")
    ) {
      return true;
    }

    // Check status code
    if (error.statusCode && options.retryableStatusCodes.includes(error.statusCode)) {
      return true;
    }

    // Rate limiting errors
    if (error.statusCode === 429) {
      return true;
    }

    return false;
  }

  /**
   * Calculate delay with exponential backoff and jitter
   */
  private calculateDelay(
    attempt: number,
    initialDelay: number,
    maxDelay: number,
    multiplier: number,
    jitter?: boolean
  ): number {
    let delay = Math.min(
      initialDelay * Math.pow(multiplier, attempt),
      maxDelay
    );

    if (jitter) {
      // Add random jitter (±25%)
      const jitterAmount = delay * 0.25;
      delay = delay + (Math.random() * 2 - 1) * jitterAmount;
    }

    return Math.round(delay);
  }

  private calculateNextRetry(attempts: number): Date {
    const delay = this.calculateDelay(
      attempts,
      this.defaultOptions.initialDelay,
      this.defaultOptions.maxDelay,
      this.defaultOptions.backoffMultiplier,
      true
    );

    return new Date(Date.now() + delay);
  }

  private scheduleRetry(operation: RetryableOperation): void {
    if (!operation.nextRetry) return;

    const delay = operation.nextRetry.getTime() - Date.now();
    if (delay <= 0) {
      // Process immediately
      this.processQueue();
      return;
    }

    // Clear existing timer
    const existingTimer = this.retryTimers.get(operation.id);
    if (existingTimer) {
      clearTimeout(existingTimer);
    }

    // Schedule new timer
    const timer = setTimeout(() => {
      this.retryTimers.delete(operation.id);
      this.processQueue();
    }, delay);

    this.retryTimers.set(operation.id, timer);
  }

  /**
   * Execute function with timeout
   */
  private async withTimeout<T>(promise: Promise<T>, timeout: number): Promise<T> {
    return Promise.race([
      promise,
      new Promise<T>((_, reject) =>
        setTimeout(() => reject(new Error("Request timeout")), timeout)
      ),
    ]);
  }

  /**
   * Sleep for specified milliseconds
   */
  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * Check network connectivity
   */
  private async checkConnectivity(): Promise<boolean> {
    try {
      const netInfoState = await NetInfo.fetch();
      return netInfoState.isConnected === true && netInfoState.isInternetReachable === true;
    } catch (error) {
      logger.error("Failed to check connectivity", error);
      // Assume connected if check fails
      return true;
    }
  }

  private async reconstructApiCall(metadata: any): Promise<any> {
    // Reconstruct API calls from metadata
    // This would integrate with your API service
    logger.warn('Reconstructing API call from metadata', metadata);

    // Placeholder - integrate with actual API service
    throw new Error('API reconstruction not implemented');
  }

  /**
   * Retry a specific API call with better error handling
   */
  async retryApiCall<T>(
    apiCall: () => Promise<T>,
    context: string = "API call"
  ): Promise<T> {
    const result = await this.executeWithRetry(apiCall, {
      maxRetries: 3,
      initialDelay: 1000,
      onRetry: (attempt, error) => {
        logger.info(`Retrying ${context}`, { attempt, error: error.message });
      },
    });

    if (!result.success) {
      throw result.error || new Error(`Failed to ${context} after retries`);
    }

    return result.data as T;
  }

  /**
   * Create a retry wrapper for a function
   */
  createRetryWrapper<T extends (...args: any[]) => Promise<any>>(
    fn: T,
    options: RetryOptions = {}
  ): T {
    return (async (...args: Parameters<T>) => {
      const result = await this.executeWithRetry(
        () => fn(...args),
        options
      );

      if (!result.success) {
        throw result.error || new Error("Operation failed after retries");
      }

      return result.data;
    }) as T;
  }

  /**
   * Batch retry multiple operations
   */
  async retryBatch<T>(
    operations: Array<() => Promise<T>>,
    options: RetryOptions = {}
  ): Promise<Array<RetryResult<T>>> {
    const results = await Promise.all(
      operations.map((op) => this.executeWithRetry(op, options))
    );

    const successful = results.filter((r) => r.success).length;
    const failed = results.filter((r) => !r.success).length;

    logger.info("Batch retry completed", {
      total: operations.length,
      successful,
      failed,
    });

    return results;
  }

  /**
   * Check if a status code indicates a transient error
   */
  isTransientError(statusCode: number): boolean {
    return this.defaultOptions.retryableStatusCodes.includes(statusCode);
  }

  /**
   * Get recommended delay for rate limiting
   */
  getRateLimitDelay(retryAfter?: string | number): number {
    if (!retryAfter) {
      return this.defaultOptions.initialDelay;
    }

    if (typeof retryAfter === "number") {
      return retryAfter * 1000; // Convert seconds to milliseconds
    }

    const delay = parseInt(retryAfter, 10);
    return isNaN(delay) ? this.defaultOptions.initialDelay : delay * 1000;
  }

  // ============ PUBLIC API ============

  /**
   * Get queue size
   */
  getQueueSize(): number {
    return this.retryQueue.size;
  }

  /**
   * Get queued operations
   */
  getQueuedOperations(): RetryableOperation[] {
    return Array.from(this.retryQueue.values());
  }

  /**
   * Check if network is available
   */
  isNetworkAvailable(): boolean {
    return this.isOnline;
  }

  /**
   * Clear retry queue
   */
  async clearQueue(): Promise<void> {
    this.retryQueue.clear();

    // Clear all timers
    this.retryTimers.forEach(timer => clearTimeout(timer));
    this.retryTimers.clear();

    await AsyncStorage.removeItem(STORAGE_KEY);

    logger.info('Cleared retry queue');
  }

  /**
   * Dispose service and cleanup
   */
  dispose(): void {
    if (this.unsubscribeNetInfo) {
      this.unsubscribeNetInfo();
    }

    // Clear all timers
    this.retryTimers.forEach(timer => clearTimeout(timer));
    this.retryTimers.clear();
  }
}

// Export singleton instance
export const retryService = new RetryService();
export default retryService;

// Export types for external use
export type { RetryOptions, RetryResult, RetryableOperation, CircuitBreakerConfig };
export { CircuitState };