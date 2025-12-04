# Type System Design: Serper.dev SDK

**Date:** 2024-12-04
**Total Types:** ~35 interfaces/types
**JSR Compliance:** Explicit exports, no slow types

---

## Design Principles

1. **Explicit over Implicit** - All types have explicit definitions
2. **Strict Nullability** - Use `undefined` for optional, never implicit `any`
3. **Readonly where sensible** - Response types are readonly
4. **Discriminated Unions** - For polymorphic responses
5. **Branded Types** - For IDs where confusion is possible
6. **JSDoc Everything** - Every property documented

---

## File Organization

```
types/
├── mod.ts          # Re-exports all public types
├── client.ts       # Client configuration types
├── common.ts       # Shared types across endpoints
├── search.ts       # Web search types
├── images.ts       # Image search types
├── news.ts         # News search types
├── videos.ts       # Video search types
├── shopping.ts     # Shopping search types
├── maps.ts         # Maps/places types
├── reviews.ts      # Reviews types
├── scholar.ts      # Scholar search types
├── patents.ts      # Patents search types
├── autocomplete.ts # Autocomplete types
└── errors.ts       # Error types
```

---

## Client Configuration Types

```typescript
// types/client.ts

/**
 * Configuration options for the Serper client.
 */
export interface SerperClientOptions {
  /**
   * Your Serper.dev API key.
   * Can be obtained from https://serper.dev
   * @example "your-api-key-here"
   */
  apiKey: string;

  /**
   * Base URL for the Serper API.
   * @default "https://google.serper.dev"
   */
  baseUrl?: string;

  /**
   * Default country code for all searches.
   * Can be overridden per-request.
   * @example "us"
   */
  defaultCountry?: string;

  /**
   * Default language code for all searches.
   * Can be overridden per-request.
   * @example "en"
   */
  defaultLanguage?: string;

  /**
   * Timeout in milliseconds for API requests.
   * @default 30000
   */
  timeout?: number;
}

/**
 * Internal resolved configuration with defaults applied.
 * @internal
 */
export interface ResolvedSerperConfig {
  readonly apiKey: string;
  readonly baseUrl: string;
  readonly defaultCountry?: string;
  readonly defaultLanguage?: string;
  readonly timeout: number;
}
```

---

## Common Types (Shared Across Endpoints)

```typescript
// types/common.ts

/**
 * Safe search filter options.
 */
export type SafeSearchFilter = "active" | "off";

/**
 * Base options for all search endpoints.
 */
export interface BaseSearchOptions {
  /**
   * Two-letter country code for geographic targeting.
   * @example "us", "gb", "de"
   * @see https://developers.google.com/custom-search/docs/json_api_reference#countryCodes
   */
  gl?: string;

  /**
   * Two-letter language code for results.
   * @example "en", "es", "fr"
   */
  hl?: string;

  /**
   * Specific location name to refine results.
   * @example "New York, NY"
   */
  location?: string;

  /**
   * Number of results to return.
   * @default 10
   * @minimum 1
   * @maximum 100
   */
  num?: number;
}

/**
 * Search parameters echoed back in API response.
 * Useful for debugging and verification.
 */
export interface SearchParameters {
  /** The search query that was executed */
  readonly q: string;
  /** Type of search performed */
  readonly type: string;
  /** Search engine used */
  readonly engine: string;
  /** Country code applied */
  readonly gl?: string;
  /** Language code applied */
  readonly hl?: string;
  /** Location applied */
  readonly location?: string;
  /** Number of results requested */
  readonly num?: number;
}

/**
 * Base structure for all API responses.
 */
export interface BaseSearchResult {
  /** Parameters that were used for this search */
  readonly searchParameters: SearchParameters;
}
```

---

## Web Search Types

```typescript
// types/search.ts

import type { BaseSearchOptions, BaseSearchResult, SearchParameters } from "./common.ts";

/**
 * Options for web search endpoint.
 */
export interface SearchOptions extends BaseSearchOptions {
  /**
   * Time-based search filters (Google TBS parameter).
   * @example "qdr:d" for past day, "qdr:w" for past week
   */
  tbs?: string;
}

/**
 * Knowledge Graph panel information.
 */
export interface KnowledgeGraph {
  /** Entity name/title */
  readonly title: string;
  /** Entity type (e.g., "Company", "Person") */
  readonly type?: string;
  /** Description text */
  readonly description?: string;
  /** Source of description */
  readonly descriptionSource?: string;
  /** Link to description source */
  readonly descriptionLink?: string;
  /** Image URL for the entity */
  readonly imageUrl?: string;
  /** Official website */
  readonly website?: string;
  /** Additional attributes (key-value pairs) */
  readonly attributes?: Readonly<Record<string, string>>;
}

/**
 * Answer box / featured snippet.
 * Structure varies based on query type.
 */
export interface AnswerBox {
  /** Answer text or snippet */
  readonly snippet?: string;
  /** Direct answer (for calculations, definitions) */
  readonly answer?: string;
  /** Title of source */
  readonly title?: string;
  /** Link to source */
  readonly link?: string;
  /** Additional answer box content */
  readonly [key: string]: unknown;
}

/**
 * Single organic search result.
 */
export interface OrganicResult {
  /** Result title */
  readonly title: string;
  /** Result URL */
  readonly link: string;
  /** Text snippet with query context */
  readonly snippet?: string;
  /** Position in results (1-based) */
  readonly position: number;
  /** Publication date if available */
  readonly date?: string;
  /** Sitelinks under this result */
  readonly sitelinks?: readonly Sitelink[];
  /** Additional attributes */
  readonly attributes?: Readonly<Record<string, string>>;
}

/**
 * Sitelink under an organic result.
 */
export interface Sitelink {
  readonly title: string;
  readonly link: string;
}

/**
 * "People Also Ask" question and answer.
 */
export interface PeopleAlsoAsk {
  /** The question */
  readonly question: string;
  /** Answer snippet */
  readonly snippet?: string;
  /** Source page title */
  readonly title?: string;
  /** Source page URL */
  readonly link?: string;
}

/**
 * Related search suggestion.
 */
export interface RelatedSearch {
  /** Suggested query */
  readonly query: string;
}

/**
 * Top story in news carousel.
 */
export interface TopStory {
  readonly title: string;
  readonly link: string;
  readonly source: string;
  readonly date?: string;
  readonly imageUrl?: string;
}

/**
 * Complete web search result.
 */
export interface SearchResult extends BaseSearchResult {
  /** Knowledge Graph panel if present */
  readonly knowledgeGraph?: KnowledgeGraph;
  /** Answer box / featured snippet if present */
  readonly answerBox?: AnswerBox;
  /** Organic search results */
  readonly organic: readonly OrganicResult[];
  /** People Also Ask questions */
  readonly peopleAlsoAsk?: readonly PeopleAlsoAsk[];
  /** Related search suggestions */
  readonly relatedSearches?: readonly RelatedSearch[];
  /** Top stories carousel if present */
  readonly topStories?: readonly TopStory[];
}
```

---

## Image Search Types

```typescript
// types/images.ts

import type { BaseSearchOptions, BaseSearchResult, SafeSearchFilter } from "./common.ts";

/**
 * Options for image search endpoint.
 */
export interface ImageSearchOptions extends BaseSearchOptions {
  /**
   * Safe search filter for adult content.
   */
  safe?: SafeSearchFilter;
}

/**
 * Single image search result.
 */
export interface ImageResult {
  /** Image title/alt text */
  readonly title: string;
  /** Direct URL to full-size image */
  readonly imageUrl: string;
  /** URL to thumbnail image */
  readonly thumbnailUrl: string;
  /** Full image width in pixels */
  readonly imageWidth: number;
  /** Full image height in pixels */
  readonly imageHeight: number;
  /** Thumbnail width in pixels */
  readonly thumbnailWidth: number;
  /** Thumbnail height in pixels */
  readonly thumbnailHeight: number;
  /** Source website name */
  readonly source: string;
  /** Source domain */
  readonly domain: string;
  /** Page URL where image appears */
  readonly link: string;
  /** Google's redirect URL for the image */
  readonly googleUrl: string;
  /** Position in results */
  readonly position: number;
}

/**
 * Image search results.
 */
export interface ImageSearchResult extends BaseSearchResult {
  /** Array of image results */
  readonly images: readonly ImageResult[];
}
```

---

## News Search Types

```typescript
// types/news.ts

import type { BaseSearchOptions, BaseSearchResult, SafeSearchFilter } from "./common.ts";

/**
 * Options for news search endpoint.
 */
export interface NewsSearchOptions extends BaseSearchOptions {
  /**
   * Safe search filter.
   */
  safe?: SafeSearchFilter;
}

/**
 * Single news article result.
 */
export interface NewsResult {
  /** Article headline */
  readonly title: string;
  /** Article URL */
  readonly link: string;
  /** Article excerpt */
  readonly snippet: string;
  /** Publication time (e.g., "2 hours ago") */
  readonly date: string;
  /** Publisher name */
  readonly source: string;
  /** Thumbnail image URL */
  readonly imageUrl?: string;
  /** Position in results */
  readonly position: number;
}

/**
 * News search results.
 */
export interface NewsSearchResult extends BaseSearchResult {
  /** Array of news articles */
  readonly news: readonly NewsResult[];
}
```

---

## Video Search Types

```typescript
// types/videos.ts

import type { BaseSearchOptions, BaseSearchResult, SafeSearchFilter } from "./common.ts";

/**
 * Options for video search endpoint.
 */
export interface VideoSearchOptions extends BaseSearchOptions {
  /**
   * Safe search filter.
   */
  safe?: SafeSearchFilter;
}

/**
 * Single video search result.
 */
export interface VideoResult {
  /** Video title */
  readonly title: string;
  /** Video URL */
  readonly link: string;
  /** Video description */
  readonly snippet?: string;
  /** Platform name (e.g., "YouTube") */
  readonly source: string;
  /** Video duration (e.g., "10:30") */
  readonly duration?: string;
  /** Upload date */
  readonly date?: string;
  /** Position in results */
  readonly position: number;
}

/**
 * Video search results.
 */
export interface VideoSearchResult extends BaseSearchResult {
  /** Array of video results */
  readonly videos: readonly VideoResult[];
}
```

---

## Shopping Search Types

```typescript
// types/shopping.ts

import type { BaseSearchOptions, BaseSearchResult } from "./common.ts";

/**
 * Options for shopping search endpoint.
 */
export interface ShoppingSearchOptions extends BaseSearchOptions {
  // Inherits all base options
}

/**
 * Single shopping/product result.
 */
export interface ShoppingResult {
  /** Product name */
  readonly title: string;
  /** Product page URL */
  readonly link: string;
  /** Product description */
  readonly snippet?: string;
  /** Seller/store name */
  readonly source: string;
  /** Price as displayed (e.g., "$19.99") */
  readonly price: string;
  /** Product image URL */
  readonly imageUrl: string;
  /** Position in results */
  readonly position: number;
}

/**
 * Shopping search results.
 */
export interface ShoppingSearchResult extends BaseSearchResult {
  /** Array of product results */
  readonly shopping: readonly ShoppingResult[];
}
```

---

## Maps/Places Search Types

```typescript
// types/maps.ts

import type { BaseSearchOptions, BaseSearchResult } from "./common.ts";

/**
 * Options for maps/places search endpoint.
 */
export interface MapsSearchOptions extends BaseSearchOptions {
  /**
   * Latitude/Longitude/Zoom specification.
   * Format: "@lat,lng,zoom" (e.g., "@40.7547,-73.9845,15z")
   */
  ll?: string;
}

/**
 * Single place/business result.
 */
export interface PlaceResult {
  /** Business/place name */
  readonly title: string;
  /** Full address */
  readonly address: string;
  /** Latitude coordinate */
  readonly latitude: number;
  /** Longitude coordinate */
  readonly longitude: number;
  /** Average rating (1-5 stars) */
  readonly rating?: number;
  /** Number of reviews */
  readonly ratingCount?: number;
  /** Primary category */
  readonly type: string;
  /** All applicable categories */
  readonly types: readonly string[];
  /** Business website */
  readonly website?: string;
  /** Contact phone number */
  readonly phoneNumber?: string;
  /** Business description */
  readonly description?: string;
  /** Google CID (internal identifier) */
  readonly cid: string;
  /** Google Place ID */
  readonly placeId: string;
  /** Position in results */
  readonly position: number;
}

/**
 * Maps search results.
 */
export interface MapsSearchResult extends BaseSearchResult {
  /** Center coordinates used for search */
  readonly ll?: string;
  /** Array of place results */
  readonly places: readonly PlaceResult[];
}
```

---

## Reviews Types

```typescript
// types/reviews.ts

import type { BaseSearchResult } from "./common.ts";

/**
 * Options for retrieving place reviews.
 * At least one of placeId, cid, or q must be provided.
 */
export interface ReviewsOptions {
  /** Google Place ID (recommended) */
  placeId?: string;
  /** Google CID (alternative to placeId) */
  cid?: string;
  /** Place name (fallback, less precise) */
  q?: string;
  /** Number of reviews to fetch */
  limit?: number;
  /** Language code for reviews */
  hl?: string;
}

/**
 * Single place review.
 */
export interface PlaceReview {
  /** Reviewer name/alias */
  readonly author: string;
  /** Star rating (1-5) */
  readonly rating: number;
  /** Review date */
  readonly date: string;
  /** Review text content */
  readonly text: string;
  /** Number of likes on this review */
  readonly likes?: number;
  /** Unique review identifier */
  readonly reviewId?: string;
}

/**
 * Reviews retrieval result.
 */
export interface ReviewsResult extends BaseSearchResult {
  /** Array of reviews */
  readonly reviews: readonly PlaceReview[];
}
```

---

## Scholar Search Types

```typescript
// types/scholar.ts

import type { BaseSearchOptions, BaseSearchResult } from "./common.ts";

/**
 * Options for Google Scholar search.
 */
export interface ScholarSearchOptions extends Omit<BaseSearchOptions, "location"> {
  /**
   * Filter results from this year onward.
   * @example 2020
   */
  as_ylo?: number;

  /**
   * Filter results up to this year.
   * @example 2024
   */
  as_yhi?: number;
}

/**
 * Single academic publication result.
 */
export interface ScholarResult {
  /** Paper/article title */
  readonly title: string;
  /** Link to paper */
  readonly link: string;
  /** Abstract excerpt */
  readonly snippet: string;
  /** Publication info (authors, journal, year) */
  readonly publicationInfo: string;
  /** Direct PDF link if available */
  readonly pdfLink?: string;
}

/**
 * Scholar search results.
 */
export interface ScholarSearchResult extends BaseSearchResult {
  /** Array of academic results */
  readonly scholar: readonly ScholarResult[];
}
```

---

## Patents Search Types

```typescript
// types/patents.ts

import type { BaseSearchOptions, BaseSearchResult } from "./common.ts";

/**
 * Options for Google Patents search.
 */
export interface PatentsSearchOptions extends Omit<BaseSearchOptions, "location"> {
  // Inherits gl, hl, num
}

/**
 * Single patent result.
 */
export interface PatentResult {
  /** Patent title */
  readonly title: string;
  /** Google Patents URL */
  readonly link: string;
  /** Patent abstract excerpt */
  readonly snippet: string;
  /** Patent publication number */
  readonly patentNumber?: string;
  /** Publication date */
  readonly publicationDate?: string;
}

/**
 * Patents search results.
 */
export interface PatentsSearchResult extends BaseSearchResult {
  /** Array of patent results */
  readonly patents: readonly PatentResult[];
}
```

---

## Autocomplete Types

```typescript
// types/autocomplete.ts

import type { BaseSearchResult } from "./common.ts";

/**
 * Options for autocomplete suggestions.
 */
export interface AutocompleteOptions {
  /** Country code for localized suggestions */
  gl?: string;
  /** Language code for suggestions */
  hl?: string;
  /** Client type hint (e.g., "chrome") */
  client?: string;
}

/**
 * Autocomplete results.
 */
export interface AutocompleteResult extends BaseSearchResult {
  /** Array of suggestion strings */
  readonly suggestions: readonly string[];
}
```

---

## Error Types

```typescript
// types/errors.ts

/**
 * Base error for all Serper SDK errors.
 */
export interface SerperErrorOptions {
  /** HTTP status code if applicable */
  status?: number;
  /** Original error if wrapping */
  cause?: Error;
}

/**
 * API error response structure.
 */
export interface ApiErrorResponse {
  /** Error message from API */
  error: string;
}
```

---

## Type Re-exports (mod.ts)

```typescript
// types/mod.ts

// Client types
export type { SerperClientOptions } from "./client.ts";

// Common types
export type {
  BaseSearchOptions,
  BaseSearchResult,
  SafeSearchFilter,
  SearchParameters,
} from "./common.ts";

// Search types
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

// Image types
export type { ImageResult, ImageSearchOptions, ImageSearchResult } from "./images.ts";

// News types
export type { NewsResult, NewsSearchOptions, NewsSearchResult } from "./news.ts";

// Video types
export type { VideoResult, VideoSearchOptions, VideoSearchResult } from "./videos.ts";

// Shopping types
export type { ShoppingResult, ShoppingSearchOptions, ShoppingSearchResult } from "./shopping.ts";

// Maps types
export type { MapsSearchOptions, MapsSearchResult, PlaceResult } from "./maps.ts";

// Reviews types
export type { PlaceReview, ReviewsOptions, ReviewsResult } from "./reviews.ts";

// Scholar types
export type { ScholarResult, ScholarSearchOptions, ScholarSearchResult } from "./scholar.ts";

// Patents types
export type { PatentResult, PatentsSearchOptions, PatentsSearchResult } from "./patents.ts";

// Autocomplete types
export type { AutocompleteOptions, AutocompleteResult } from "./autocomplete.ts";

// Error types
export type { ApiErrorResponse, SerperErrorOptions } from "./errors.ts";
```

---

## JSR Compliance Checklist

- [x] All types have explicit definitions
- [x] No circular dependencies
- [x] No slow types (no complex inferences)
- [x] All exports are typed
- [x] `readonly` on response properties
- [x] JSDoc on all public types
- [x] `@example` tags where helpful
- [x] Type-only imports used (`import type`)

---

## Type Safety Patterns

### 1. Discriminated Unions for Error Handling

```typescript
type SerperResult<T> =
  | { success: true; data: T }
  | { success: false; error: SerperError };
```

### 2. Branded Types for IDs (Optional Enhancement)

```typescript
type PlaceId = string & { readonly __brand: "PlaceId" };
type Cid = string & { readonly __brand: "Cid" };
```

### 3. Strict Options Validation

```typescript
// Ensure at least one identifier in reviews
type ReviewsOptionsStrict =
  | (ReviewsOptions & { placeId: string })
  | (ReviewsOptions & { cid: string })
  | (ReviewsOptions & { q: string });
```

---

## Notes

1. **All response types are readonly** - Prevents accidental mutation
2. **Optional fields use `?`** - Not `| undefined` for cleaner types
3. **Arrays are `readonly T[]`** - Immutability signal
4. **Records are `Readonly<Record<>>`** - Consistent immutability
5. **No `any` anywhere** - `unknown` with type guards instead
