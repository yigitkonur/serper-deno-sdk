/**
 * Common types shared across all Serper API endpoints.
 * @module
 */

/**
 * Safe search filter options for filtering adult content.
 *
 * @example
 * ```ts
 * const options = { safe: "active" as SafeSearchFilter };
 * ```
 */
export type SafeSearchFilter = "active" | "off";

/**
 * Base options available for all search endpoints.
 *
 * @example
 * ```ts
 * const options: BaseSearchOptions = {
 *   gl: "us",
 *   hl: "en",
 *   num: 10
 * };
 * ```
 */
export interface BaseSearchOptions {
  /**
   * Two-letter country code for geographic targeting.
   * @example "us", "gb", "de", "fr"
   * @see https://developers.google.com/custom-search/docs/json_api_reference#countryCodes
   */
  gl?: string;

  /**
   * Two-letter language code for results.
   * @example "en", "es", "fr", "de"
   */
  hl?: string;

  /**
   * Specific location name to refine results.
   * @example "New York, NY", "London, UK"
   */
  location?: string;

  /**
   * Number of results to return.
   * @default 10
   * @minimum 1
   * @maximum 100
   */
  num?: number;
}

/**
 * Search parameters echoed back in all API responses.
 * Useful for debugging and verifying the query that was executed.
 *
 * @example
 * ```ts
 * const params: SearchParameters = {
 *   q: "typescript tutorial",
 *   type: "search",
 *   engine: "google"
 * };
 * ```
 */
export interface SearchParameters {
  /** The search query that was executed. */
  readonly q: string;

  /** Type of search performed (e.g., "search", "images", "news"). */
  readonly type: string;

  /** Search engine used (always "google" for Serper). */
  readonly engine: string;

  /** Country code that was applied to the search. */
  readonly gl?: string;

  /** Language code that was applied to the search. */
  readonly hl?: string;

  /** Location that was applied to the search. */
  readonly location?: string;

  /** Number of results that were requested. */
  readonly num?: number;
}

/**
 * Base structure for all API responses.
 * All endpoint-specific result types extend this interface.
 *
 * @example
 * ```ts
 * interface MySearchResult extends BaseSearchResult {
 *   results: MyResult[];
 * }
 * ```
 */
export interface BaseSearchResult {
  /** Parameters that were used for this search. */
  readonly searchParameters: SearchParameters;
}
