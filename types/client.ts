/**
 * Client configuration types for SerperClient.
 * @module
 */

/**
 * Configuration options for the Serper client.
 *
 * @example Minimal configuration
 * ```ts
 * const options: SerperClientOptions = {
 *   apiKey: Deno.env.get("SERPER_API_KEY")!
 * };
 * ```
 *
 * @example Full configuration
 * ```ts
 * const options: SerperClientOptions = {
 *   apiKey: "your-api-key",
 *   baseUrl: "https://google.serper.dev",
 *   defaultCountry: "us",
 *   defaultLanguage: "en",
 *   timeout: 60000
 * };
 * ```
 */
export interface SerperClientOptions {
  /**
   * Your Serper.dev API key.
   *
   * Get one at https://serper.dev (free tier: 2,500 queries).
   * Store securely in environment variables, never hardcode.
   *
   * @example
   * ```ts
   * apiKey: Deno.env.get("SERPER_API_KEY")!
   * ```
   */
  apiKey: string;

  /**
   * Base URL for Serper API.
   *
   * Only change if using a proxy or custom endpoint.
   *
   * @default "https://google.serper.dev"
   */
  baseUrl?: string;

  /**
   * Default country code for all searches.
   *
   * Two-letter ISO 3166-1 alpha-2 code.
   * Can be overridden per-request via the `gl` option.
   *
   * @example "us", "gb", "de", "fr"
   */
  defaultCountry?: string;

  /**
   * Default language code for all searches.
   *
   * Two-letter ISO 639-1 code.
   * Can be overridden per-request via the `hl` option.
   *
   * @example "en", "es", "de", "fr"
   */
  defaultLanguage?: string;

  /**
   * Request timeout in milliseconds.
   *
   * @default 30000 (30 seconds)
   */
  timeout?: number;
}

/**
 * Internal resolved configuration with defaults applied.
 * Used internally by SerperClient after processing options.
 *
 * @internal
 */
export interface ResolvedSerperConfig {
  /** The API key (required, validated). */
  readonly apiKey: string;

  /** The resolved base URL. */
  readonly baseUrl: string;

  /** Default country code if set. */
  readonly defaultCountry?: string;

  /** Default language code if set. */
  readonly defaultLanguage?: string;

  /** The resolved timeout in milliseconds. */
  readonly timeout: number;
}
