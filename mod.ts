/**
 * @module
 * Serper.dev SDK for Deno - A type-safe client for Google Search API.
 *
 * ## Features
 *
 * - 🔍 **Complete API Coverage** - Web, Images, News, Videos, Shopping, Maps, Scholar, Patents
 * - 🦕 **Built for Deno** - Works in Deno CLI and Supabase Edge Functions
 * - 📦 **Zero Dependencies** - Only uses Web standard APIs
 * - 🔒 **Secure** - API key never exposed, proper error handling
 * - 📘 **Fully Typed** - Complete TypeScript definitions
 *
 * ## Installation
 *
 * ```bash
 * # Using Deno
 * deno add @serper/deno-sdk
 *
 * # Or import directly
 * import { SerperClient } from "jsr:@serper/deno-sdk";
 * ```
 *
 * ## Quick Start
 *
 * ```ts
 * import { SerperClient } from "@serper/deno-sdk";
 *
 * // Create a client with your API key
 * const client = new SerperClient({
 *   apiKey: Deno.env.get("SERPER_API_KEY")!
 * });
 *
 * // Perform a web search
 * const results = await client.search("Deno runtime");
 *
 * // Access organic results
 * for (const result of results.organic) {
 *   console.log(result.title, result.link);
 * }
 * ```
 *
 * ## Available Methods
 *
 * | Method | Description |
 * |--------|-------------|
 * | `search()` | Google Web Search |
 * | `searchImages()` | Google Images |
 * | `searchNews()` | Google News |
 * | `searchVideos()` | Google Videos |
 * | `searchShopping()` | Google Shopping |
 * | `searchMaps()` | Google Maps / Local |
 * | `searchPlaces()` | Alias for searchMaps |
 * | `getReviews()` | Google Reviews |
 * | `searchScholar()` | Google Scholar |
 * | `searchPatents()` | Google Patents |
 * | `autocomplete()` | Search Suggestions |
 *
 * ## Error Handling
 *
 * ```ts
 * import {
 *   SerperClient,
 *   SerperAuthError,
 *   SerperRateLimitError
 * } from "@serper/deno-sdk";
 *
 * try {
 *   const results = await client.search("query");
 * } catch (error) {
 *   if (error instanceof SerperAuthError) {
 *     console.error("Check your API key");
 *   } else if (error instanceof SerperRateLimitError) {
 *     console.error("Rate limit exceeded, retry later");
 *   }
 * }
 * ```
 *
 * ## Supabase Edge Functions
 *
 * ```ts
 * import { SerperClient } from "@serper/deno-sdk";
 *
 * const client = new SerperClient({
 *   apiKey: Deno.env.get("SERPER_API_KEY")!
 * });
 *
 * Deno.serve(async (req) => {
 *   const { query } = await req.json();
 *   const results = await client.search(query);
 *   return Response.json(results);
 * });
 * ```
 *
 * ## Links
 *
 * - [Serper.dev](https://serper.dev) - Get your API key
 * - [GitHub](https://github.com/serper/deno-sdk) - Source code
 * - [API Docs](https://serper.dev/docs) - Serper API documentation
 *
 * @license MIT
 */

// Main client export
export { SerperClient } from "./src/client.ts";

// Error exports
export {
  SerperAuthError,
  SerperError,
  SerperRateLimitError,
  SerperServerError,
  SerperValidationError,
} from "./src/errors.ts";

// Type exports (using export type for type-only exports)
export type {
  // Web search types
  AnswerBox,
  // Autocomplete types
  AutocompleteOptions,
  AutocompleteResult,
  // Common types
  BaseSearchOptions,
  BaseSearchResult,
  // Image search types
  ImageResult,
  ImageSearchOptions,
  ImageSearchResult,
  KnowledgeGraph,
  // Maps/places search types
  MapsSearchOptions,
  MapsSearchResult,
  // News search types
  NewsResult,
  NewsSearchOptions,
  NewsSearchResult,
  OrganicResult,
  // Patents search types
  PatentResult,
  PatentsSearchOptions,
  PatentsSearchResult,
  PeopleAlsoAsk,
  PlaceResult,
  // Reviews types
  PlaceReview,
  RelatedSearch,
  ReviewsOptions,
  ReviewsResult,
  SafeSearchFilter,
  // Scholar search types
  ScholarResult,
  ScholarSearchOptions,
  ScholarSearchResult,
  SearchOptions,
  SearchParameters,
  SearchResult,
  // Client configuration
  SerperClientOptions,
  // Shopping search types
  ShoppingResult,
  ShoppingSearchOptions,
  ShoppingSearchResult,
  Sitelink,
  TopStory,
  // Video search types
  VideoResult,
  VideoSearchOptions,
  VideoSearchResult,
} from "./types/mod.ts";
