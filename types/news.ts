/**
 * News search types for the /news endpoint.
 * @module
 */

import type { BaseSearchOptions, BaseSearchResult, SafeSearchFilter } from "./common.ts";

/**
 * Options for news search endpoint.
 *
 * @example
 * ```ts
 * const options: NewsSearchOptions = {
 *   gl: "us",
 *   hl: "en",
 *   num: 10
 * };
 * ```
 */
export interface NewsSearchOptions extends BaseSearchOptions {
  /**
   * Safe search filter for content filtering.
   */
  safe?: SafeSearchFilter;
}

/**
 * Single news article result.
 *
 * @example
 * ```ts
 * for (const article of result.news) {
 *   console.log(`${article.source}: ${article.title}`);
 *   console.log(`Published: ${article.date}`);
 *   console.log(`Link: ${article.link}`);
 * }
 * ```
 */
export interface NewsResult {
  /** Article headline. */
  readonly title: string;

  /** Article URL. */
  readonly link: string;

  /** Article excerpt/snippet. */
  readonly snippet: string;

  /** Publication time (e.g., "2 hours ago", "Jan 5, 2025"). */
  readonly date: string;

  /** Publisher/source name. */
  readonly source: string;

  /** Thumbnail image URL if available. */
  readonly imageUrl?: string;

  /** Position in results (1-based). */
  readonly position: number;
}

/**
 * News search results from /news endpoint.
 *
 * @example
 * ```ts
 * const result: NewsSearchResult = await client.searchNews("AI technology");
 * for (const article of result.news) {
 *   console.log(`${article.source}: ${article.title}`);
 * }
 * ```
 */
export interface NewsSearchResult extends BaseSearchResult {
  /** Array of news articles. */
  readonly news: readonly NewsResult[];
}
