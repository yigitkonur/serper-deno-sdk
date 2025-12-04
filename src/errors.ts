/**
 * Error classes for the Serper SDK.
 *
 * All errors extend the base `SerperError` class for easy catch-all handling.
 *
 * @module
 *
 * @example Catching all Serper errors
 * ```ts
 * import { SerperError } from "@yigitkonur/serper-deno-sdk";
 *
 * try {
 *   await client.search("query");
 * } catch (error) {
 *   if (error instanceof SerperError) {
 *     console.error(`Serper error: ${error.message}`);
 *   }
 * }
 * ```
 */

/**
 * Base error class for all Serper SDK errors.
 *
 * Extends the native Error with additional context like HTTP status.
 * All other Serper errors extend this class.
 *
 * @example
 * ```ts
 * try {
 *   await client.search("query");
 * } catch (error) {
 *   if (error instanceof SerperError) {
 *     console.error(`Status: ${error.status}, Message: ${error.message}`);
 *   }
 * }
 * ```
 */
export class SerperError extends Error {
  /** HTTP status code from the API response, if applicable. */
  readonly status?: number;

  /** Original error if this error wraps another. */
  override readonly cause?: Error;

  /**
   * Creates a new SerperError.
   *
   * @param message - Error message describing what went wrong
   * @param status - HTTP status code if from API response
   * @param cause - Original error being wrapped
   */
  constructor(message: string, status?: number, cause?: Error) {
    super(message);
    this.name = "SerperError";
    this.status = status;
    this.cause = cause;

    // Ensure proper prototype chain in ES5 environments
    Object.setPrototypeOf(this, SerperError.prototype);
  }
}

/**
 * Thrown when API key authentication fails.
 *
 * ## Common Causes
 *
 * - API key is missing or empty
 * - API key is invalid or malformed
 * - API key has been revoked or expired
 * - API key lacks required permissions
 *
 * ## Resolution
 *
 * 1. Verify your API key at https://serper.dev/dashboard
 * 2. Ensure the key is passed correctly to SerperClient
 * 3. Check that the environment variable is set correctly
 *
 * @example
 * ```ts
 * import { SerperAuthError } from "@yigitkonur/serper-deno-sdk";
 *
 * try {
 *   await client.search("query");
 * } catch (error) {
 *   if (error instanceof SerperAuthError) {
 *     console.error("Check your API key!");
 *   }
 * }
 * ```
 */
export class SerperAuthError extends SerperError {
  /**
   * Creates a new SerperAuthError.
   *
   * @param message - Error message, defaults to "Invalid or missing API key"
   */
  constructor(message: string = "Invalid or missing API key") {
    super(message, 401);
    this.name = "SerperAuthError";
    Object.setPrototypeOf(this, SerperAuthError.prototype);
  }
}

/**
 * Thrown when rate limit or quota is exceeded.
 *
 * ## Common Causes
 *
 * - Too many requests per second (exceeds 300 QPS default limit)
 * - Monthly quota exhausted
 * - Burst of requests exceeded plan limits
 *
 * ## Resolution
 *
 * 1. Implement request throttling or backoff
 * 2. Check remaining quota at https://serper.dev/dashboard
 * 3. Upgrade your plan if needed
 * 4. Implement exponential backoff for retries
 *
 * @example
 * ```ts
 * import { SerperRateLimitError } from "@yigitkonur/serper-deno-sdk";
 *
 * try {
 *   await client.search("query");
 * } catch (error) {
 *   if (error instanceof SerperRateLimitError) {
 *     // Wait and retry with exponential backoff
 *     await new Promise(r => setTimeout(r, 1000));
 *   }
 * }
 * ```
 */
export class SerperRateLimitError extends SerperError {
  /**
   * Creates a new SerperRateLimitError.
   *
   * @param message - Error message, defaults to "Rate limit exceeded"
   */
  constructor(message: string = "Rate limit exceeded") {
    super(message, 429);
    this.name = "SerperRateLimitError";
    Object.setPrototypeOf(this, SerperRateLimitError.prototype);
  }
}

/**
 * Thrown when request parameters are invalid.
 *
 * ## Common Causes
 *
 * - Missing required parameter (e.g., empty search query)
 * - Invalid parameter value or type
 * - Malformed request body
 *
 * ## Resolution
 *
 * 1. Check that required parameters are provided
 * 2. Validate parameter types and values
 * 3. Review the API documentation for correct format
 *
 * @example
 * ```ts
 * import { SerperValidationError } from "@yigitkonur/serper-deno-sdk";
 *
 * try {
 *   await client.search(""); // Empty query
 * } catch (error) {
 *   if (error instanceof SerperValidationError) {
 *     console.error("Invalid parameters:", error.message);
 *   }
 * }
 * ```
 */
export class SerperValidationError extends SerperError {
  /**
   * Creates a new SerperValidationError.
   *
   * @param message - Error message, defaults to "Invalid request parameters"
   */
  constructor(message: string = "Invalid request parameters") {
    super(message, 400);
    this.name = "SerperValidationError";
    Object.setPrototypeOf(this, SerperValidationError.prototype);
  }
}

/**
 * Thrown when Serper.dev servers have an issue.
 *
 * ## Common Causes
 *
 * - Serper.dev service outage
 * - Temporary server overload
 * - Network connectivity issues
 * - Request timeout
 *
 * ## Resolution
 *
 * 1. Retry the request after a short delay
 * 2. Check Serper.dev status page
 * 3. Implement circuit breaker pattern for production
 * 4. Consider increasing timeout for slow connections
 *
 * @example
 * ```ts
 * import { SerperServerError } from "@yigitkonur/serper-deno-sdk";
 *
 * try {
 *   await client.search("query");
 * } catch (error) {
 *   if (error instanceof SerperServerError) {
 *     console.error("Service issue, retrying...");
 *   }
 * }
 * ```
 */
export class SerperServerError extends SerperError {
  /**
   * Creates a new SerperServerError.
   *
   * @param message - Error message, defaults to "Server error"
   */
  constructor(message: string = "Server error") {
    super(message, 500);
    this.name = "SerperServerError";
    Object.setPrototypeOf(this, SerperServerError.prototype);
  }
}
