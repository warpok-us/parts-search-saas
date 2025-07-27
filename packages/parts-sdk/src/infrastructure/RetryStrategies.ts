import { RetryStrategy } from '../contracts/index.js';
import { APIError } from '../errors.js';

/**
 * Exponential backoff retry strategy
 * Follows Single Responsibility Principle - only handles retry logic
 */
export class ExponentialBackoffRetryStrategy implements RetryStrategy {
  constructor(
    private maxAttempts: number = 3,
    private baseDelay: number = 1000,
    private maxDelay: number = 10000
  ) {}

  shouldRetry(attempt: number, error: Error): boolean {
    if (attempt >= this.maxAttempts) {
      return false;
    }

    // Don't retry client errors (4xx)
    if (error instanceof APIError && error.status) {
      return error.status >= 500; // Only retry server errors
    }

    return true;
  }

  getRetryDelay(attempt: number): number {
    const delay = this.baseDelay * Math.pow(2, attempt - 1);
    return Math.min(delay, this.maxDelay);
  }

  getMaxAttempts(): number {
    return this.maxAttempts;
  }
}

/**
 * No retry strategy for cases where retries are not desired
 */
export class NoRetryStrategy implements RetryStrategy {
  shouldRetry(): boolean {
    return false;
  }

  getRetryDelay(): number {
    return 0;
  }

  getMaxAttempts(): number {
    return 1;
  }
}

/**
 * Fixed delay retry strategy
 */
export class FixedDelayRetryStrategy implements RetryStrategy {
  constructor(
    private maxAttempts: number = 3,
    private delay: number = 1000
  ) {}

  shouldRetry(attempt: number, error: Error): boolean {
    if (attempt >= this.maxAttempts) {
      return false;
    }

    // Don't retry client errors (4xx)
    if (error instanceof APIError && error.status) {
      return error.status >= 500;
    }

    return true;
  }

  getRetryDelay(): number {
    return this.delay;
  }

  getMaxAttempts(): number {
    return this.maxAttempts;
  }
}
