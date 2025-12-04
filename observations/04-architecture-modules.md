# Architecture & Module Design: Serper.dev SDK

**Date:** 2024-12-04
**Pattern:** Single Client Class with Method-per-Endpoint
**Dependencies:** Zero (Deno built-ins only)

---

## Directory Structure

```
serper-deno-sdk/
├── mod.ts                    # Entry point: exports client + types
├── src/
│   ├── client.ts             # SerperClient class implementation
│   ├── errors.ts             # Custom error classes
│   ├── constants.ts          # API constants (base URL, defaults)
│   └── utils.ts              # Internal utilities
├── types/
│   ├── mod.ts                # Type re-exports
│   ├── client.ts             # Client configuration types
│   ├── common.ts             # Shared types
│   ├── search.ts             # Web search types
│   ├── images.ts             # Image search types
│   ├── news.ts               # News search types
│   ├── videos.ts             # Video search types
│   ├── shopping.ts           # Shopping search types
│   ├── maps.ts               # Maps/places types
│   ├── reviews.ts            # Reviews types
│   ├── scholar.ts            # Scholar search types
│   ├── patents.ts            # Patents search types
│   ├── autocomplete.ts       # Autocomplete types
│   └── errors.ts             # Error types
├── tests/
│   ├── client_test.ts        # Client unit tests
│   ├── search_test.ts        # Search endpoint tests
│   ├── images_test.ts        # Image search tests
│   ├── news_test.ts          # News search tests
│   ├── errors_test.ts        # Error handling tests
│   └── integration_test.ts   # Integration tests (optional)
├── examples/
│   ├── basic_search.ts       # Simple search example
│   ├── supabase_edge.ts      # Supabase Edge Function example
│   └── all_endpoints.ts      # Comprehensive usage example
├── deno.json                 # Deno config + JSR package info
├── deno.lock                 # Lock file (auto-generated)
├── README.md                 # Documentation
├── CHANGELOG.md              # Version history
└── LICENSE                   # MIT License
```

---

## Core Module: `mod.ts`

````typescript
/**
 * @module
 * Serper.dev SDK for Deno - Google Search API client.
 *
 * ## Quick Start
 *
 * ```ts
 * import { SerperClient } from "@serper/sdk";
 *
 * const client = new SerperClient({ apiKey: Deno.env.get("SERPER_API_KEY")! });
 * const results = await client.search("Deno runtime");
 * console.log(results.organic[0].title);
 * ```
 *
 * ## Features
 *
 * - 🔍 Full Google Search API coverage (Web, Images, News, Videos, Shopping, Maps, Scholar, Patents)
 * - 🦕 Built for Deno and Supabase Edge Functions
 * - 📦 Zero dependencies
 * - 🔒 Secure API key handling
 * - 📘 Complete TypeScript types
 *
 * @example Basic web search
 * ```ts
 * const results = await client.search("TypeScript tutorial", { num: 5 });
 * for (const result of results.organic) {
 *   console.log(result.title, result.link);
 * }
 * ```
 *
 * @example Image search
 * ```ts
 * const images = await client.searchImages("sunset beach", { safe: "active" });
 * console.log(images.images[0].imageUrl);
 * ```
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

// Type exports (re-exported from types module)
export type {
  AnswerBox,
  // Autocomplete types
  AutocompleteOptions,
  AutocompleteResult,
  // Common types
  BaseSearchOptions,
  ImageResult,
  // Image types
  ImageSearchOptions,
  ImageSearchResult,
  KnowledgeGraph,
  // Maps types
  MapsSearchOptions,
  MapsSearchResult,
  NewsResult,
  // News types
  NewsSearchOptions,
  NewsSearchResult,
  OrganicResult,
  PatentResult,
  // Patents types
  PatentsSearchOptions,
  PatentsSearchResult,
  PeopleAlsoAsk,
  PlaceResult,
  PlaceReview,
  RelatedSearch,
  // Reviews types
  ReviewsOptions,
  ReviewsResult,
  SafeSearchFilter,
  ScholarResult,
  // Scholar types
  ScholarSearchOptions,
  ScholarSearchResult,
  // Search types
  SearchOptions,
  SearchParameters,
  SearchResult,
  // Client types
  SerperClientOptions,
  ShoppingResult,
  // Shopping types
  ShoppingSearchOptions,
  ShoppingSearchResult,
  Sitelink,
  TopStory,
  VideoResult,
  // Video types
  VideoSearchOptions,
  VideoSearchResult,
} from "./types/mod.ts";
````

---

## Client Class Design: `src/client.ts`

````typescript
import type {
  AutocompleteOptions,
  AutocompleteResult,
  ImageSearchOptions,
  ImageSearchResult,
  MapsSearchOptions,
  MapsSearchResult,
  NewsSearchOptions,
  NewsSearchResult,
  PatentsSearchOptions,
  PatentsSearchResult,
  ReviewsOptions,
  ReviewsResult,
  ScholarSearchOptions,
  ScholarSearchResult,
  SearchOptions,
  SearchResult,
  SerperClientOptions,
  ShoppingSearchOptions,
  ShoppingSearchResult,
  VideoSearchOptions,
  VideoSearchResult,
} from "../types/mod.ts";

import {
  SerperAuthError,
  SerperRateLimitError,
  SerperServerError,
  SerperValidationError,
} from "./errors.ts";

import { BASE_URL, DEFAULT_TIMEOUT } from "./constants.ts";

/**
 * Serper.dev API client for Google Search.
 *
 * @example Create a client
 * ```ts
 * const client = new SerperClient({
 *   apiKey: Deno.env.get("SERPER_API_KEY")!
 * });
 * ```
 *
 * @example With custom configuration
 * ```ts
 * const client = new SerperClient({
 *   apiKey: "your-api-key",
 *   defaultCountry: "us",
 *   defaultLanguage: "en",
 *   timeout: 60000
 * });
 * ```
 */
export class SerperClient {
  /** Private API key - never exposed */
  readonly #apiKey: string;

  /** Base URL for API requests */
  readonly #baseUrl: string;

  /** Default country code for searches */
  readonly #defaultCountry?: string;

  /** Default language code for searches */
  readonly #defaultLanguage?: string;

  /** Request timeout in milliseconds */
  readonly #timeout: number;

  /**
   * Creates a new Serper client instance.
   *
   * @param options - Client configuration options
   * @throws {Error} If API key is not provided
   *
   * @example Using environment variable
   * ```ts
   * const client = new SerperClient({
   *   apiKey: Deno.env.get("SERPER_API_KEY")!
   * });
   * ```
   */
  constructor(options: SerperClientOptions) {
    if (!options.apiKey) {
      throw new Error("API key is required. Get one at https://serper.dev");
    }

    this.#apiKey = options.apiKey;
    this.#baseUrl = options.baseUrl ?? BASE_URL;
    this.#defaultCountry = options.defaultCountry;
    this.#defaultLanguage = options.defaultLanguage;
    this.#timeout = options.timeout ?? DEFAULT_TIMEOUT;
  }

  /**
   * Performs a Google web search.
   *
   * @param query - Search query string
   * @param options - Optional search parameters
   * @returns Search results including organic listings, knowledge graph, etc.
   * @throws {SerperAuthError} Invalid or missing API key
   * @throws {SerperRateLimitError} Rate limit exceeded
   * @throws {SerperValidationError} Invalid parameters
   *
   * @example Basic search
   * ```ts
   * const results = await client.search("Deno runtime");
   * console.log(results.organic[0].title);
   * ```
   *
   * @example With options
   * ```ts
   * const results = await client.search("news today", {
   *   gl: "us",
   *   hl: "en",
   *   num: 20,
   *   tbs: "qdr:d" // Past day
   * });
   * ```
   */
  async search(query: string, options?: SearchOptions): Promise<SearchResult> {
    return this.#request<SearchResult>("/search", { q: query, ...options });
  }

  /**
   * Searches Google Images.
   *
   * @param query - Image search query
   * @param options - Optional search parameters
   * @returns Image search results
   *
   * @example
   * ```ts
   * const images = await client.searchImages("mountain landscape", {
   *   num: 15,
   *   safe: "active"
   * });
   * for (const img of images.images) {
   *   console.log(img.imageUrl);
   * }
   * ```
   */
  async searchImages(query: string, options?: ImageSearchOptions): Promise<ImageSearchResult> {
    return this.#request<ImageSearchResult>("/images", { q: query, ...options });
  }

  /**
   * Searches Google News.
   *
   * @param query - News search query
   * @param options - Optional search parameters
   * @returns News article results
   *
   * @example
   * ```ts
   * const news = await client.searchNews("AI technology", { gl: "us" });
   * for (const article of news.news) {
   *   console.log(`${article.source}: ${article.title}`);
   * }
   * ```
   */
  async searchNews(query: string, options?: NewsSearchOptions): Promise<NewsSearchResult> {
    return this.#request<NewsSearchResult>("/news", { q: query, ...options });
  }

  /**
   * Searches Google Videos.
   *
   * @param query - Video search query
   * @param options - Optional search parameters
   * @returns Video search results
   *
   * @example
   * ```ts
   * const videos = await client.searchVideos("TypeScript tutorial");
   * console.log(videos.videos[0].duration);
   * ```
   */
  async searchVideos(query: string, options?: VideoSearchOptions): Promise<VideoSearchResult> {
    return this.#request<VideoSearchResult>("/videos", { q: query, ...options });
  }

  /**
   * Searches Google Shopping.
   *
   * @param query - Product search query
   * @param options - Optional search parameters
   * @returns Shopping/product results
   *
   * @example
   * ```ts
   * const products = await client.searchShopping("wireless headphones");
   * for (const item of products.shopping) {
   *   console.log(`${item.title}: ${item.price}`);
   * }
   * ```
   */
  async searchShopping(
    query: string,
    options?: ShoppingSearchOptions,
  ): Promise<ShoppingSearchResult> {
    return this.#request<ShoppingSearchResult>("/shopping", { q: query, ...options });
  }

  /**
   * Searches Google Maps for local businesses/places.
   *
   * @param query - Place/business search query
   * @param options - Optional search parameters
   * @returns Local place results
   *
   * @example
   * ```ts
   * const places = await client.searchMaps("coffee shops", {
   *   location: "San Francisco, CA"
   * });
   * for (const place of places.places) {
   *   console.log(`${place.title} - ${place.rating}⭐`);
   * }
   * ```
   */
  async searchMaps(query: string, options?: MapsSearchOptions): Promise<MapsSearchResult> {
    return this.#request<MapsSearchResult>("/maps", { q: query, ...options });
  }

  /**
   * Searches Google Places (alias for searchMaps).
   *
   * @param query - Place/business search query
   * @param options - Optional search parameters
   * @returns Local place results
   */
  async searchPlaces(query: string, options?: MapsSearchOptions): Promise<MapsSearchResult> {
    return this.searchMaps(query, options);
  }

  /**
   * Retrieves reviews for a specific place.
   *
   * @param options - Place identifier (placeId, cid, or q) and options
   * @returns Place reviews
   * @throws {SerperValidationError} If no place identifier provided
   *
   * @example Using Place ID (recommended)
   * ```ts
   * const reviews = await client.getReviews({
   *   placeId: "ChIJxxxxxxxxxxxxxxxxx",
   *   limit: 10
   * });
   * ```
   *
   * @example Using place name
   * ```ts
   * const reviews = await client.getReviews({
   *   q: "Starbucks Times Square",
   *   limit: 5
   * });
   * ```
   */
  async getReviews(options: ReviewsOptions): Promise<ReviewsResult> {
    if (!options.placeId && !options.cid && !options.q) {
      throw new SerperValidationError("At least one of placeId, cid, or q is required");
    }
    return this.#request<ReviewsResult>("/reviews", options);
  }

  /**
   * Searches Google Scholar for academic publications.
   *
   * @param query - Academic search query
   * @param options - Optional search parameters
   * @returns Scholar search results
   *
   * @example
   * ```ts
   * const papers = await client.searchScholar("machine learning", {
   *   as_ylo: 2020,
   *   num: 10
   * });
   * for (const paper of papers.scholar) {
   *   console.log(paper.title, paper.publicationInfo);
   * }
   * ```
   */
  async searchScholar(query: string, options?: ScholarSearchOptions): Promise<ScholarSearchResult> {
    return this.#request<ScholarSearchResult>("/scholar", { q: query, ...options });
  }

  /**
   * Searches Google Patents.
   *
   * @param query - Patent search query
   * @param options - Optional search parameters
   * @returns Patent search results
   *
   * @example
   * ```ts
   * const patents = await client.searchPatents("solar panel efficiency");
   * for (const patent of patents.patents) {
   *   console.log(patent.patentNumber, patent.title);
   * }
   * ```
   */
  async searchPatents(query: string, options?: PatentsSearchOptions): Promise<PatentsSearchResult> {
    return this.#request<PatentsSearchResult>("/patents", { q: query, ...options });
  }

  /**
   * Gets Google Search autocomplete suggestions.
   *
   * @param query - Partial query for suggestions
   * @param options - Optional parameters
   * @returns Autocomplete suggestions
   *
   * @example
   * ```ts
   * const suggestions = await client.autocomplete("how to le");
   * console.log(suggestions.suggestions);
   * // ["how to learn programming", "how to learn python", ...]
   * ```
   */
  async autocomplete(query: string, options?: AutocompleteOptions): Promise<AutocompleteResult> {
    return this.#request<AutocompleteResult>("/autocomplete", { q: query, ...options });
  }

  /**
   * Internal method to make API requests.
   *
   * @internal
   */
  async #request<T>(endpoint: string, body: Record<string, unknown>): Promise<T> {
    // Apply defaults
    const requestBody = {
      ...body,
      gl: body.gl ?? this.#defaultCountry,
      hl: body.hl ?? this.#defaultLanguage,
    };

    // Remove undefined values
    const cleanBody = Object.fromEntries(
      Object.entries(requestBody).filter(([_, v]) => v !== undefined),
    );

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.#timeout);

    try {
      const response = await fetch(`${this.#baseUrl}${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-API-KEY": this.#apiKey,
        },
        body: JSON.stringify(cleanBody),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        await this.#handleError(response);
      }

      const data: unknown = await response.json();
      return data as T;
    } catch (error) {
      clearTimeout(timeoutId);

      if (error instanceof Error && error.name === "AbortError") {
        throw new SerperServerError(`Request timeout after ${this.#timeout}ms`);
      }

      throw error;
    }
  }

  /**
   * Handles error responses from the API.
   *
   * @internal
   */
  async #handleError(response: Response): Promise<never> {
    let errorMessage: string;

    try {
      const errorBody = await response.json() as { error?: string };
      errorMessage = errorBody.error ?? response.statusText;
    } catch {
      errorMessage = response.statusText;
    }

    switch (response.status) {
      case 400:
        throw new SerperValidationError(errorMessage);
      case 401:
        throw new SerperAuthError(errorMessage);
      case 429:
        throw new SerperRateLimitError(errorMessage);
      default:
        throw new SerperServerError(`${response.status}: ${errorMessage}`);
    }
  }
}
````

---

## Error Classes: `src/errors.ts`

```typescript
/**
 * Base error class for all Serper SDK errors.
 */
export class SerperError extends Error {
  /** HTTP status code if applicable */
  readonly status?: number;

  constructor(message: string, status?: number) {
    super(message);
    this.name = "SerperError";
    this.status = status;
  }
}

/**
 * Thrown when API key is invalid or missing.
 * HTTP 401 responses.
 */
export class SerperAuthError extends SerperError {
  constructor(message: string = "Invalid or missing API key") {
    super(message, 401);
    this.name = "SerperAuthError";
  }
}

/**
 * Thrown when rate limit is exceeded.
 * HTTP 429 responses.
 */
export class SerperRateLimitError extends SerperError {
  constructor(message: string = "Rate limit exceeded") {
    super(message, 429);
    this.name = "SerperRateLimitError";
  }
}

/**
 * Thrown when request parameters are invalid.
 * HTTP 400 responses.
 */
export class SerperValidationError extends SerperError {
  constructor(message: string = "Invalid request parameters") {
    super(message, 400);
    this.name = "SerperValidationError";
  }
}

/**
 * Thrown when Serper.dev server has an error.
 * HTTP 500+ responses.
 */
export class SerperServerError extends SerperError {
  constructor(message: string = "Server error") {
    super(message, 500);
    this.name = "SerperServerError";
  }
}
```

---

## Constants: `src/constants.ts`

```typescript
/** Default base URL for Serper API */
export const BASE_URL = "https://google.serper.dev";

/** Default request timeout in milliseconds (30 seconds) */
export const DEFAULT_TIMEOUT = 30_000;

/** SDK version */
export const SDK_VERSION = "1.0.0";

/** User agent string for requests (optional enhancement) */
export const USER_AGENT = `serper-deno-sdk/${SDK_VERSION}`;
```

---

## Utilities: `src/utils.ts`

```typescript
/**
 * Type guard to check if a value is a non-null object.
 */
export function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

/**
 * Removes undefined values from an object.
 */
export function removeUndefined<T extends Record<string, unknown>>(obj: T): Partial<T> {
  return Object.fromEntries(
    Object.entries(obj).filter(([_, v]) => v !== undefined),
  ) as Partial<T>;
}
```

---

## Configuration: `deno.json`

```json
{
  "name": "@serper/deno-sdk",
  "version": "1.0.0",
  "description": "Deno SDK for Serper.dev Google Search API - Web, Images, News, Videos, Shopping, Maps, Scholar, Patents",
  "license": "MIT",
  "exports": "./mod.ts",

  "compilerOptions": {
    "strict": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedIndexedAccess": true
  },

  "lint": {
    "rules": {
      "tags": ["recommended", "jsr"],
      "include": [
        "explicit-function-return-type",
        "explicit-module-boundary-types",
        "camelcase",
        "single-var-declarator",
        "no-console",
        "ban-untagged-todo"
      ]
    }
  },

  "fmt": {
    "indentWidth": 2,
    "lineWidth": 100,
    "singleQuote": false,
    "proseWrap": "preserve"
  },

  "test": {
    "include": ["tests/**/*_test.ts"]
  },

  "tasks": {
    "test": "deno test --allow-env",
    "test:coverage": "deno test --allow-env --coverage=coverage",
    "lint": "deno lint",
    "fmt": "deno fmt",
    "fmt:check": "deno fmt --check",
    "doc": "deno doc mod.ts",
    "doc:lint": "deno doc --lint mod.ts",
    "check": "deno check mod.ts",
    "publish:dry": "deno publish --dry-run",
    "all": "deno task fmt && deno task lint && deno task doc:lint && deno task test"
  }
}
```

---

## Module Dependency Graph

```
mod.ts
├── src/client.ts
│   ├── src/errors.ts
│   ├── src/constants.ts
│   └── types/mod.ts
├── src/errors.ts
└── types/mod.ts
    ├── types/client.ts
    ├── types/common.ts
    ├── types/search.ts
    ├── types/images.ts
    ├── types/news.ts
    ├── types/videos.ts
    ├── types/shopping.ts
    ├── types/maps.ts
    ├── types/reviews.ts
    ├── types/scholar.ts
    ├── types/patents.ts
    ├── types/autocomplete.ts
    └── types/errors.ts
```

**No circular dependencies** - types flow one direction, client imports types.

---

## Design Decisions

### 1. Single Client Class

**Why:** Simpler API surface, all methods in one place.
**Alternative considered:** Separate classes per endpoint (rejected - adds complexity).

### 2. Private API Key (`#apiKey`)

**Why:** True encapsulation, key never accessible.
**Per guide:** "stored in a private field (#apiKey), not exposed publicly"

### 3. Method Naming (`searchX()` pattern)

**Why:** Consistent, discoverable, matches endpoint names.
**Exception:** `getReviews()` uses "get" as it retrieves rather than searches.

### 4. Readonly Response Types

**Why:** Signals immutability, prevents accidental mutation.
**Per guide:** Type safety best practice.

### 5. Separate Types Directory

**Why:** Clean separation, easier to maintain, explicit exports.
**Alternative:** Co-located types (rejected - harder to manage).

### 6. Zero Dependencies

**Why:** Faster installs, no version conflicts, smaller bundle.
**Per guide:** "Aim for zero or few dependencies"

---

## Supabase Edge Function Compatibility

All patterns are compatible:

- ✅ `fetch()` - Standard Web API
- ✅ `AbortController` - Standard Web API
- ✅ `Deno.env` - Supported in Edge Functions
- ✅ `JSON.stringify/parse` - Standard
- ✅ No file system access
- ✅ No subprocess spawning
- ✅ No `window` global
- ✅ No Node.js globals
