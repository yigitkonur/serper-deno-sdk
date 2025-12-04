/**
 * Type definitions for the Serper.dev SDK.
 *
 * This module re-exports all types used by the SDK.
 * Use `import type` for type-only imports.
 *
 * @module
 *
 * @example
 * ```ts
 * import type { SearchResult, OrganicResult } from "@yigitkonur/serper-deno-sdk";
 * ```
 */

// Client configuration types
export type { ResolvedSerperConfig, SerperClientOptions } from "./client.ts";

// Common types shared across endpoints
export type {
  BaseSearchOptions,
  BaseSearchResult,
  SafeSearchFilter,
  SearchParameters,
} from "./common.ts";

// Error types
export type { ApiErrorResponse, SerperErrorOptions } from "./errors.ts";

// Web search types
export type {
  AnswerBox,
  KnowledgeGraph,
  OrganicResult,
  PeopleAlsoAsk,
  RelatedSearch,
  SearchOptions,
  SearchResult,
  Sitelink,
  TopStory,
} from "./search.ts";

// Image search types
export type { ImageResult, ImageSearchOptions, ImageSearchResult } from "./images.ts";

// News search types
export type { NewsResult, NewsSearchOptions, NewsSearchResult } from "./news.ts";

// Video search types
export type { VideoResult, VideoSearchOptions, VideoSearchResult } from "./videos.ts";

// Shopping search types
export type { ShoppingResult, ShoppingSearchOptions, ShoppingSearchResult } from "./shopping.ts";

// Maps/places search types
export type { MapsSearchOptions, MapsSearchResult, PlaceResult } from "./maps.ts";

// Reviews types
export type { PlaceReview, ReviewsOptions, ReviewsResult } from "./reviews.ts";

// Scholar search types
export type { ScholarResult, ScholarSearchOptions, ScholarSearchResult } from "./scholar.ts";

// Patents search types
export type { PatentResult, PatentsSearchOptions, PatentsSearchResult } from "./patents.ts";

// Autocomplete types
export type { AutocompleteOptions, AutocompleteResult } from "./autocomplete.ts";
