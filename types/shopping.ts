/**
 * Shopping search types for the /shopping endpoint.
 * @module
 */

import type { BaseSearchOptions, BaseSearchResult } from "./common.ts";

/**
 * Options for shopping search endpoint.
 *
 * @example
 * ```ts
 * const options: ShoppingSearchOptions = {
 *   gl: "us",
 *   hl: "en",
 *   num: 20
 * };
 * ```
 */
export interface ShoppingSearchOptions extends BaseSearchOptions {
  // Inherits all base options: gl, hl, location, num
}

/**
 * Single shopping/product result.
 *
 * @example
 * ```ts
 * for (const product of result.shopping) {
 *   console.log(`${product.title} - ${product.price}`);
 *   console.log(`From: ${product.source}`);
 *   console.log(`Link: ${product.link}`);
 * }
 * ```
 */
export interface ShoppingResult {
  /** Product name/title. */
  readonly title: string;

  /** Product page URL (Google Shopping or merchant). */
  readonly link: string;

  /** Product description/details. */
  readonly snippet?: string;

  /** Seller/store name. */
  readonly source: string;

  /** Price as displayed (e.g., "$19.99", "€24.99"). */
  readonly price: string;

  /** Product image URL. */
  readonly imageUrl: string;

  /** Position in results (1-based). */
  readonly position: number;
}

/**
 * Shopping search results from /shopping endpoint.
 *
 * @example
 * ```ts
 * const result: ShoppingSearchResult = await client.searchShopping("wireless headphones");
 * for (const product of result.shopping) {
 *   console.log(`${product.title}: ${product.price} from ${product.source}`);
 * }
 * ```
 */
export interface ShoppingSearchResult extends BaseSearchResult {
  /** Array of product results. */
  readonly shopping: readonly ShoppingResult[];
}
