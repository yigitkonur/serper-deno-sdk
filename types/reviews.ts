/**
 * Reviews types for the /reviews endpoint.
 * @module
 */

import type { BaseSearchResult } from "./common.ts";

/**
 * Options for retrieving place reviews.
 *
 * **Important:** At least one of `placeId`, `cid`, or `q` must be provided.
 * Using `placeId` is recommended for accuracy.
 *
 * @example Using Place ID (recommended)
 * ```ts
 * const options: ReviewsOptions = {
 *   placeId: "ChIJxxxxxxxxxxxxxxxxx",
 *   limit: 10
 * };
 * ```
 *
 * @example Using place name (less precise)
 * ```ts
 * const options: ReviewsOptions = {
 *   q: "Starbucks Times Square NYC",
 *   limit: 5
 * };
 * ```
 */
export interface ReviewsOptions {
  /**
   * Google Place ID (recommended).
   * Get this from a maps search result's `placeId` field.
   */
  placeId?: string;

  /**
   * Google CID (alternative to placeId).
   * Get this from a maps search result's `cid` field.
   */
  cid?: string;

  /**
   * Place name search (fallback, less precise).
   * Use when placeId/cid are not available.
   */
  q?: string;

  /**
   * Maximum number of reviews to fetch.
   * @default 5-10
   */
  limit?: number;

  /**
   * Language code for reviews.
   */
  hl?: string;
}

/**
 * Single place review.
 *
 * @example
 * ```ts
 * for (const review of result.reviews) {
 *   console.log(`${review.author}: ${review.rating}⭐`);
 *   console.log(`"${review.text}"`);
 *   console.log(`Date: ${review.date}`);
 * }
 * ```
 */
export interface PlaceReview {
  /** Reviewer name or alias. */
  readonly author: string;

  /** Star rating (1-5). */
  readonly rating: number;

  /** Review date. */
  readonly date: string;

  /** Review text content. */
  readonly text: string;

  /** Number of upvotes/likes on this review. */
  readonly likes?: number;

  /** Unique review identifier. */
  readonly reviewId?: string;
}

/**
 * Reviews result from /reviews endpoint.
 *
 * @example
 * ```ts
 * const result: ReviewsResult = await client.getReviews({
 *   placeId: "ChIJxxxxxxxxxxxxxxxxx",
 *   limit: 10
 * });
 * console.log(`Found ${result.reviews.length} reviews`);
 * for (const review of result.reviews) {
 *   console.log(`${review.author}: ${review.rating}⭐ - "${review.text}"`);
 * }
 * ```
 */
export interface ReviewsResult extends BaseSearchResult {
  /** Array of reviews. */
  readonly reviews: readonly PlaceReview[];
}
