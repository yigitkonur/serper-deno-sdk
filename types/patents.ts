/**
 * Patents search types for the /patents endpoint.
 * @module
 */

import type { BaseSearchOptions, BaseSearchResult } from "./common.ts";

/**
 * Options for Google Patents search.
 *
 * @example
 * ```ts
 * const options: PatentsSearchOptions = {
 *   gl: "us",
 *   hl: "en",
 *   num: 10
 * };
 * ```
 */
export interface PatentsSearchOptions extends Omit<BaseSearchOptions, "location"> {
  // Inherits gl, hl, num from base (location not applicable)
}

/**
 * Single patent result.
 *
 * @example
 * ```ts
 * for (const patent of result.patents) {
 *   console.log(`${patent.patentNumber}: ${patent.title}`);
 *   console.log(`Published: ${patent.publicationDate}`);
 *   console.log(`Link: ${patent.link}`);
 * }
 * ```
 */
export interface PatentResult {
  /** Patent title. */
  readonly title: string;

  /** Google Patents URL. */
  readonly link: string;

  /** Patent abstract excerpt. */
  readonly snippet: string;

  /** Patent publication number (e.g., "US1234567B2"). */
  readonly patentNumber?: string;

  /** Publication date. */
  readonly publicationDate?: string;
}

/**
 * Patents search results from /patents endpoint.
 *
 * @example
 * ```ts
 * const result: PatentsSearchResult = await client.searchPatents("solar panel efficiency");
 * for (const patent of result.patents) {
 *   console.log(`${patent.patentNumber}: ${patent.title}`);
 * }
 * ```
 */
export interface PatentsSearchResult extends BaseSearchResult {
  /** Array of patent results. */
  readonly patents: readonly PatentResult[];
}
