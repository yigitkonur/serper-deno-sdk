/**
 * Maps/places search types for the /maps and /places endpoints.
 * @module
 */

import type { BaseSearchOptions, BaseSearchResult } from "./common.ts";

/**
 * Options for maps/places search endpoint.
 *
 * @example Using location name
 * ```ts
 * const options: MapsSearchOptions = {
 *   location: "San Francisco, CA",
 *   num: 10
 * };
 * ```
 *
 * @example Using coordinates
 * ```ts
 * const options: MapsSearchOptions = {
 *   ll: "@37.7749,-122.4194,15z"
 * };
 * ```
 */
export interface MapsSearchOptions extends BaseSearchOptions {
  /**
   * Latitude/Longitude/Zoom specification for map search area.
   * Format: "@lat,lng,zoom" (e.g., "@40.7547,-73.9845,15z").
   *
   * Alternative to `location` for precise geographic targeting.
   */
  ll?: string;
}

/**
 * Single place/business result from Google Maps.
 *
 * @example
 * ```ts
 * for (const place of result.places) {
 *   console.log(`${place.title} - ${place.rating}⭐ (${place.ratingCount} reviews)`);
 *   console.log(`Address: ${place.address}`);
 *   console.log(`Type: ${place.type}`);
 *   if (place.website) console.log(`Website: ${place.website}`);
 * }
 * ```
 */
export interface PlaceResult {
  /** Business/place name. */
  readonly title: string;

  /** Full street address. */
  readonly address: string;

  /** Latitude coordinate. */
  readonly latitude: number;

  /** Longitude coordinate. */
  readonly longitude: number;

  /** Average rating (1-5 stars). */
  readonly rating?: number;

  /** Total number of reviews. */
  readonly ratingCount?: number;

  /** Primary category/type (e.g., "Coffee shop", "Restaurant"). */
  readonly type: string;

  /** All applicable categories. */
  readonly types: readonly string[];

  /** Business website URL. */
  readonly website?: string;

  /** Contact phone number. */
  readonly phoneNumber?: string;

  /** Business description from Google Maps. */
  readonly description?: string;

  /** Google CID (internal identifier). */
  readonly cid: string;

  /** Google Place ID (for use with other APIs). */
  readonly placeId: string;

  /** Position in results (1-based). */
  readonly position: number;
}

/**
 * Maps search results from /maps or /places endpoint.
 *
 * @example
 * ```ts
 * const result: MapsSearchResult = await client.searchMaps("coffee shops", {
 *   location: "Seattle, WA"
 * });
 * for (const place of result.places) {
 *   console.log(`${place.title} - ${place.rating}⭐`);
 * }
 * ```
 */
export interface MapsSearchResult extends BaseSearchResult {
  /** Center coordinates used for the search, if applicable. */
  readonly ll?: string;

  /** Array of place results. */
  readonly places: readonly PlaceResult[];
}
