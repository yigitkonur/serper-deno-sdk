/**
 * Scholar search types for the /scholar endpoint.
 * @module
 */

import type { BaseSearchOptions, BaseSearchResult } from "./common.ts";

/**
 * Options for Google Scholar search.
 *
 * @example
 * ```ts
 * const options: ScholarSearchOptions = {
 *   hl: "en",
 *   as_ylo: 2020,  // From 2020
 *   as_yhi: 2024,  // To 2024
 *   num: 10
 * };
 * ```
 */
export interface ScholarSearchOptions extends Omit<BaseSearchOptions, "location"> {
  /**
   * Filter results from this year onward.
   * @example 2020
   */
  "as_ylo"?: number;

  /**
   * Filter results up to this year.
   * @example 2024
   */
  "as_yhi"?: number;
}

/**
 * Single academic publication result.
 *
 * @example
 * ```ts
 * for (const paper of result.scholar) {
 *   console.log(paper.title);
 *   console.log(`By: ${paper.publicationInfo}`);
 *   if (paper.pdfLink) console.log(`PDF: ${paper.pdfLink}`);
 * }
 * ```
 */
export interface ScholarResult {
  /** Paper/article title. */
  readonly title: string;

  /** Link to the paper (Google Scholar or publisher). */
  readonly link: string;

  /** Abstract excerpt or snippet. */
  readonly snippet: string;

  /** Publication info (authors, journal, year). */
  readonly publicationInfo: string;

  /** Direct PDF link if available. */
  readonly pdfLink?: string;
}

/**
 * Scholar search results from /scholar endpoint.
 *
 * @example
 * ```ts
 * const result: ScholarSearchResult = await client.searchScholar("machine learning", {
 *   as_ylo: 2022,
 *   num: 10
 * });
 * for (const paper of result.scholar) {
 *   console.log(`${paper.title} - ${paper.publicationInfo}`);
 * }
 * ```
 */
export interface ScholarSearchResult extends BaseSearchResult {
  /** Array of academic results. */
  readonly organic: readonly ScholarResult[];
}
