/**
 * Video search types for the /videos endpoint.
 * @module
 */

import type { BaseSearchOptions, BaseSearchResult, SafeSearchFilter } from "./common.ts";

/**
 * Options for video search endpoint.
 *
 * @example
 * ```ts
 * const options: VideoSearchOptions = {
 *   gl: "us",
 *   hl: "en",
 *   num: 15
 * };
 * ```
 */
export interface VideoSearchOptions extends BaseSearchOptions {
  /**
   * Safe search filter for content filtering.
   */
  safe?: SafeSearchFilter;
}

/**
 * Single video search result.
 *
 * @example
 * ```ts
 * for (const video of result.videos) {
 *   console.log(`${video.title} (${video.duration})`);
 *   console.log(`Source: ${video.source}`);
 *   console.log(`Link: ${video.link}`);
 * }
 * ```
 */
export interface VideoResult {
  /** Video title. */
  readonly title: string;

  /** Video URL (often YouTube or source site). */
  readonly link: string;

  /** Video description/snippet. */
  readonly snippet?: string;

  /** Platform name (e.g., "YouTube"). */
  readonly source: string;

  /** Video duration (e.g., "10:30", "1:30:00"). */
  readonly duration?: string;

  /** Upload date or relative time. */
  readonly date?: string;

  /** Position in results (1-based). */
  readonly position: number;
}

/**
 * Video search results from /videos endpoint.
 *
 * @example
 * ```ts
 * const result: VideoSearchResult = await client.searchVideos("TypeScript tutorial");
 * for (const video of result.videos) {
 *   console.log(`${video.title} - ${video.duration}`);
 * }
 * ```
 */
export interface VideoSearchResult extends BaseSearchResult {
  /** Array of video results. */
  readonly videos: readonly VideoResult[];
}
