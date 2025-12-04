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
 *   console.log(`${review.user.name}: ${review.rating}⭐`);
 *   console.log(`"${review.snippet}"`);
 *   console.log(`Date: ${review.date}`);
 * }
 * ```
 */
export interface PlaceReview {
  /** Star rating (1-5). */
  readonly rating: number;

  /** Relative date string (e.g., "a week ago"). */
  readonly date: string;

  /** ISO date string (e.g., "2025-11-27T..."). */
  readonly isoDate?: string;

  /** Review text content. */
  readonly snippet: string;

  /** Number of likes/upvotes (null if none). */
  readonly likes?: number | null;

  /** User who wrote the review. */
  readonly user: {
    readonly name: string;
    readonly thumbnail?: string;
    readonly link?: string;
    readonly reviews?: number;
    readonly photos?: number;
  };

  /** Owner response if available. */
  readonly response?: {
    readonly date: string;
    readonly isoDate?: string;
    readonly snippet: string;
  };

  /** Unique review identifier. */
  readonly id?: string;
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
 *   console.log(`${review.user.name}: ${review.rating}⭐ - "${review.snippet}"`);
 * }
 * ```
 */
export interface ReviewsResult extends BaseSearchResult {
  /** Array of reviews */
  readonly reviews: readonly PlaceReview[];

  /** Topics mentioned in reviews. */
  readonly topics?: readonly {
    readonly name: string;
    readonly reviews: number;
    readonly id: string;
  }[];

  /** Token for the next page of reviews. */
  readonly nextPageToken?: string;
}
