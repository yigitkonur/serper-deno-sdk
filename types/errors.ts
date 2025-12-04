/**
 * Error-related type definitions.
 * @module
 */

/**
 * Options for creating Serper error instances.
 *
 * @example
 * ```ts
 * const options: SerperErrorOptions = {
 *   status: 401,
 *   cause: originalError
 * };
 * ```
 */
export interface SerperErrorOptions {
  /** HTTP status code from the API response. */
  status?: number;

  /** Original error if this error wraps another. */
  cause?: Error;
}

/**
 * Structure of error responses from the Serper API.
 *
 * @example
 * ```ts
 * const errorResponse: ApiErrorResponse = {
 *   error: "Invalid API key"
 * };
 * ```
 */
export interface ApiErrorResponse {
  /** Error message from the API. */
  error: string;
}
