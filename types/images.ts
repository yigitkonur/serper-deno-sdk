/**
 * Image search types for the /images endpoint.
 * @module
 */

import type { BaseSearchOptions, BaseSearchResult, SafeSearchFilter } from "./common.ts";

/**
 * Options for image search endpoint.
 *
 * @example
 * ```ts
 * const options: ImageSearchOptions = {
 *   gl: "us",
 *   num: 20,
 *   safe: "active"
 * };
 * ```
 */
export interface ImageSearchOptions extends BaseSearchOptions {
  /**
   * Safe search filter for adult content.
   * Set to "active" to filter explicit content.
   */
  safe?: SafeSearchFilter;
}

/**
 * Single image search result.
 *
 * @example
 * ```ts
 * for (const img of result.images) {
 *   console.log(img.title);
 *   console.log(`Full: ${img.imageUrl} (${img.imageWidth}x${img.imageHeight})`);
 *   console.log(`Thumb: ${img.thumbnailUrl}`);
 *   console.log(`Source: ${img.source} (${img.domain})`);
 * }
 * ```
 */
export interface ImageResult {
  /** Image title/alt text. */
  readonly title: string;

  /** Direct URL to full-size image. */
  readonly imageUrl: string;

  /** URL to thumbnail image. */
  readonly thumbnailUrl: string;

  /** Full image width in pixels. */
  readonly imageWidth: number;

  /** Full image height in pixels. */
  readonly imageHeight: number;

  /** Thumbnail width in pixels. */
  readonly thumbnailWidth: number;

  /** Thumbnail height in pixels. */
  readonly thumbnailHeight: number;

  /** Source website name. */
  readonly source: string;

  /** Source domain. */
  readonly domain: string;

  /** Page URL where image appears. */
  readonly link: string;

  /** Google's redirect URL for the image. */
  readonly googleUrl: string;

  /** Position in results (1-based). */
  readonly position: number;
}

/**
 * Image search results from /images endpoint.
 *
 * @example
 * ```ts
 * const result: ImageSearchResult = await client.searchImages("sunset beach");
 * console.log(`Found ${result.images.length} images`);
 * console.log(`First image: ${result.images[0].imageUrl}`);
 * ```
 */
export interface ImageSearchResult extends BaseSearchResult {
  /** Array of image results. */
  readonly images: readonly ImageResult[];
}
