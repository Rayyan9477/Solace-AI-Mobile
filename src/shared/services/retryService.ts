/**
 * Retry Service
 * Provides intelligent retry logic with exponential backoff
 * Handles network errors, timeouts, and transient failures
 */

import { logger } from "@shared/utils/logger";
import NetInfo from "@react-native-community/netinfo";

interface RetryOptions {
  maxRetries?: number;
  initialDelay?: number;
  maxDelay?: number;
  backoffMultiplier?: number;
  retryableStatusCodes?: number[];
  timeout?: number;
  onRetry?: (attempt: number, error: any) => void;
}

interface RetryResult<T> {
  success: boolean;
  data?: T;
  error?: Error;
  attempts: number;
}

class RetryService {
  private defaultOptions: Required<RetryOptions> = {
    maxRetries: 3,
    initialDelay: 1000, // 1 second
    maxDelay: 30000, // 30 seconds
    backoffMultiplier: 2,
    retryableStatusCodes: [408, 429, 500, 502, 503, 504],
    timeout: 10000,
    onRetry: () => {},
  };

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

        logger.info("Request succeeded", { attempt });
        return {
          success: true,
          data: result,
          attempts: attempt + 1,
        };
      } catch (error: any) {
        lastError = error;

        // Check if error is retryable
        if (!this.isRetryable(error, opts)) {
          logger.warn("Error is not retryable", { error: error.message });
          break;
        }

        // Check if we have more retries left
        if (attempt < opts.maxRetries) {
          logger.info("Retrying request", {
            attempt: attempt + 1,
            delay,
            error: error.message,
          });

          opts.onRetry(attempt + 1, error);

          // Wait before retry
          await this.sleep(delay);

          // Calculate next delay with exponential backoff
          delay = Math.min(delay * opts.backoffMultiplier, opts.maxDelay);
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
}

// Export singleton instance
export const retryService = new RetryService();
export default retryService;