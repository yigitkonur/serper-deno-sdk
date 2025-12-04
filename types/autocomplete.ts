/**
 * Autocomplete types for the /autocomplete endpoint.
 * @module
 */

import type { BaseSearchResult } from "./common.ts";

/**
 * Options for autocomplete suggestions.
 *
 * @example
 * ```ts
 * const options: AutocompleteOptions = {
 *   gl: "us",
 *   hl: "en"
 * };
 * ```
 */
export interface AutocompleteOptions {
  /**
   * Country code for localized suggestions.
   */
  gl?: string;

  /**
   * Language code for suggestions.
   */
  hl?: string;

  /**
   * Client type hint (e.g., "chrome", "firefox").
   * Affects suggestion style/format.
   */
  client?: string;
}

/**
 * Autocomplete results from /autocomplete endpoint.
 *
 * @example
 * ```ts
 * const result: AutocompleteResult = await client.autocomplete("how to le");
 * console.log(result.suggestions);
 * // ["how to learn programming", "how to learn python", ...]
 * ```
 */
export interface AutocompleteResult extends BaseSearchResult {
  /** Array of suggestion strings. */
  readonly suggestions: readonly string[];
}
