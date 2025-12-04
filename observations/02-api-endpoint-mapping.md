# API Endpoint Mapping: Serper.dev SDK

**Date:** 2024-12-04
**Source:** OpenAPI YAML Specification
**Endpoints:** 12 (11 unique + 1 alias)

---

## Overview

All endpoints use:

- **Method:** POST
- **Content-Type:** application/json
- **Auth Header:** `X-API-KEY: <api_key>`
- **Base URL:** `https://google.serper.dev`

---

## Endpoint 1: Web Search (`/search`)

### SDK Method

```typescript
async search(query: string, options?: SearchOptions): Promise<SearchResult>
```

### Request Parameters

| Parameter  | Type   | Required | Default | Description                |
| ---------- | ------ | -------- | ------- | -------------------------- |
| `q`        | string | ✅       | -       | Search query               |
| `gl`       | string | ❌       | -       | Country code (e.g., "us")  |
| `hl`       | string | ❌       | -       | Language code (e.g., "en") |
| `location` | string | ❌       | -       | Location name              |
| `num`      | number | ❌       | 10      | Results count (max ~100)   |
| `tbs`      | string | ❌       | -       | Time/advanced filters      |

### Response Structure

```typescript
interface SearchResult {
  searchParameters: SearchParameters;
  knowledgeGraph?: KnowledgeGraph;
  answerBox?: AnswerBox;
  organic: OrganicResult[];
  peopleAlsoAsk?: PeopleAlsoAsk[];
  relatedSearches?: RelatedSearch[];
  topStories?: TopStory[]; // If news carousel appears
  images?: ImageResult[]; // If image pack appears
  videos?: VideoResult[]; // If video pack appears
}
```

### Example Usage

```typescript
const result = await client.search("OpenAI ChatGPT", {
  gl: "us",
  hl: "en",
  num: 20,
});

console.log(result.organic[0].title);
console.log(result.knowledgeGraph?.description);
```

---

## Endpoint 2: Image Search (`/images`)

### SDK Method

```typescript
async searchImages(query: string, options?: ImageSearchOptions): Promise<ImageSearchResult>
```

### Request Parameters

| Parameter | Type              | Required | Default | Description        |
| --------- | ----------------- | -------- | ------- | ------------------ |
| `q`       | string            | ✅       | -       | Image search query |
| `gl`      | string            | ❌       | -       | Country code       |
| `hl`      | string            | ❌       | -       | Language code      |
| `safe`    | "active" \| "off" | ❌       | -       | Safe search filter |
| `num`     | number            | ❌       | 10      | Number of images   |

### Response Structure

```typescript
interface ImageSearchResult {
  searchParameters: SearchParameters;
  images: ImageResult[];
}

interface ImageResult {
  title: string;
  imageUrl: string;
  thumbnailUrl: string;
  imageWidth: number;
  imageHeight: number;
  thumbnailWidth: number;
  thumbnailHeight: number;
  source: string;
  domain: string;
  link: string;
  googleUrl: string;
  position: number;
}
```

### Example Usage

```typescript
const images = await client.searchImages("African lions", {
  num: 15,
  safe: "active",
});

for (const img of images.images) {
  console.log(img.imageUrl, img.source);
}
```

---

## Endpoint 3: News Search (`/news`)

### SDK Method

```typescript
async searchNews(query: string, options?: NewsSearchOptions): Promise<NewsSearchResult>
```

### Request Parameters

| Parameter  | Type              | Required | Default | Description             |
| ---------- | ----------------- | -------- | ------- | ----------------------- |
| `q`        | string            | ✅       | -       | News search query       |
| `gl`       | string            | ❌       | -       | Country code            |
| `hl`       | string            | ❌       | -       | Language code           |
| `location` | string            | ❌       | -       | Location for local news |
| `safe`     | "active" \| "off" | ❌       | -       | Safe search filter      |
| `num`      | number            | ❌       | 10      | Number of articles      |

### Response Structure

```typescript
interface NewsSearchResult {
  searchParameters: SearchParameters;
  news: NewsResult[];
}

interface NewsResult {
  title: string;
  link: string;
  snippet: string;
  date: string;
  source: string;
  imageUrl?: string;
  position: number;
}
```

### Example Usage

```typescript
const news = await client.searchNews("AI breakthroughs 2025", {
  gl: "us",
  num: 10,
});
```

---

## Endpoint 4: Video Search (`/videos`)

### SDK Method

```typescript
async searchVideos(query: string, options?: VideoSearchOptions): Promise<VideoSearchResult>
```

### Request Parameters

| Parameter  | Type              | Required | Default | Description        |
| ---------- | ----------------- | -------- | ------- | ------------------ |
| `q`        | string            | ✅       | -       | Video search query |
| `gl`       | string            | ❌       | -       | Country code       |
| `hl`       | string            | ❌       | -       | Language code      |
| `location` | string            | ❌       | -       | Location           |
| `safe`     | "active" \| "off" | ❌       | -       | Safe search filter |
| `num`      | number            | ❌       | 10      | Number of videos   |

### Response Structure

```typescript
interface VideoSearchResult {
  searchParameters: SearchParameters;
  videos: VideoResult[];
}

interface VideoResult {
  title: string;
  link: string;
  snippet: string;
  source: string;
  duration?: string;
  date?: string;
  position: number;
}
```

---

## Endpoint 5: Shopping Search (`/shopping`)

### SDK Method

```typescript
async searchShopping(query: string, options?: ShoppingSearchOptions): Promise<ShoppingSearchResult>
```

### Request Parameters

| Parameter  | Type   | Required | Default | Description               |
| ---------- | ------ | -------- | ------- | ------------------------- |
| `q`        | string | ✅       | -       | Product search query      |
| `gl`       | string | ❌       | -       | Country code              |
| `hl`       | string | ❌       | -       | Language code             |
| `location` | string | ❌       | -       | Location for availability |
| `num`      | number | ❌       | 10      | Number of products        |

### Response Structure

```typescript
interface ShoppingSearchResult {
  searchParameters: SearchParameters;
  shopping: ShoppingResult[];
}

interface ShoppingResult {
  title: string;
  link: string;
  snippet?: string;
  source: string;
  price: string;
  imageUrl: string;
  position: number;
}
```

---

## Endpoint 6: Maps Search (`/maps`)

### SDK Method

```typescript
async searchMaps(query: string, options?: MapsSearchOptions): Promise<MapsSearchResult>
```

### Request Parameters

| Parameter  | Type   | Required | Default | Description                    |
| ---------- | ------ | -------- | ------- | ------------------------------ |
| `q`        | string | ✅       | -       | Place/business query           |
| `ll`       | string | ❌       | -       | Lat/Lng/Zoom (`@lat,lng,zoom`) |
| `location` | string | ❌       | -       | Location name                  |
| `gl`       | string | ❌       | -       | Country code                   |
| `hl`       | string | ❌       | -       | Language code                  |
| `num`      | number | ❌       | 10      | Number of places               |

### Response Structure

```typescript
interface MapsSearchResult {
  searchParameters: SearchParameters;
  ll?: string;
  places: PlaceResult[];
}

interface PlaceResult {
  title: string;
  address: string;
  latitude: number;
  longitude: number;
  rating?: number;
  ratingCount?: number;
  type: string;
  types: string[];
  website?: string;
  phoneNumber?: string;
  description?: string;
  cid: string;
  placeId: string;
  position: number;
}
```

---

## Endpoint 7: Places Search (`/places`)

### SDK Method

```typescript
async searchPlaces(query: string, options?: MapsSearchOptions): Promise<MapsSearchResult>
// Alias for searchMaps - same implementation
```

**Note:** This is functionally identical to `/maps`. SDK should expose both methods pointing to the same implementation for backward compatibility.

---

## Endpoint 8: Reviews (`/reviews`)

### SDK Method

```typescript
async getReviews(options: ReviewsOptions): Promise<ReviewsResult>
```

### Request Parameters

| Parameter | Type   | Required | Default | Description                 |
| --------- | ------ | -------- | ------- | --------------------------- |
| `placeId` | string | ⚠️       | -       | Google Place ID             |
| `cid`     | string | ⚠️       | -       | Google CID (alt to placeId) |
| `q`       | string | ⚠️       | -       | Place name (fallback)       |
| `limit`   | number | ❌       | 5-10    | Number of reviews           |
| `hl`      | string | ❌       | -       | Language code               |

⚠️ One of `placeId`, `cid`, or `q` is required.

### Response Structure

```typescript
interface ReviewsResult {
  searchParameters: SearchParameters;
  reviews: PlaceReview[];
}

interface PlaceReview {
  author: string;
  rating: number;
  date: string;
  text: string;
  likes?: number;
  reviewId?: string;
}
```

### Example Usage

```typescript
// By Place ID (recommended)
const reviews = await client.getReviews({
  placeId: "ChIJxxxxxxxxxxxxxxxxx",
  limit: 10,
});

// By name (less precise)
const reviews = await client.getReviews({
  q: "Coffee Roasters HQ, San Francisco",
});
```

---

## Endpoint 9: Scholar Search (`/scholar`)

### SDK Method

```typescript
async searchScholar(query: string, options?: ScholarSearchOptions): Promise<ScholarSearchResult>
```

### Request Parameters

| Parameter | Type   | Required | Default | Description           |
| --------- | ------ | -------- | ------- | --------------------- |
| `q`       | string | ✅       | -       | Academic search query |
| `hl`      | string | ❌       | "en"    | Language code         |
| `as_ylo`  | number | ❌       | -       | Year from (filter)    |
| `as_yhi`  | number | ❌       | -       | Year to (filter)      |
| `num`     | number | ❌       | 10      | Number of results     |

### Response Structure

```typescript
interface ScholarSearchResult {
  searchParameters: SearchParameters;
  scholar: ScholarResult[];
}

interface ScholarResult {
  title: string;
  link: string;
  snippet: string;
  publicationInfo: string;
  pdfLink?: string;
}
```

---

## Endpoint 10: Patents Search (`/patents`)

### SDK Method

```typescript
async searchPatents(query: string, options?: PatentsSearchOptions): Promise<PatentsSearchResult>
```

### Request Parameters

| Parameter | Type   | Required | Default | Description         |
| --------- | ------ | -------- | ------- | ------------------- |
| `q`       | string | ✅       | -       | Patent search query |
| `gl`      | string | ❌       | -       | Country code        |
| `hl`      | string | ❌       | -       | Language code       |
| `num`     | number | ❌       | 10      | Number of patents   |

### Response Structure

```typescript
interface PatentsSearchResult {
  searchParameters: SearchParameters;
  patents: PatentResult[];
}

interface PatentResult {
  title: string;
  link: string;
  snippet: string;
  patentNumber?: string;
  publicationDate?: string;
}
```

---

## Endpoint 11: Autocomplete (`/autocomplete`)

### SDK Method

```typescript
async autocomplete(query: string, options?: AutocompleteOptions): Promise<AutocompleteResult>
```

### Request Parameters

| Parameter | Type   | Required | Default | Description      |
| --------- | ------ | -------- | ------- | ---------------- |
| `q`       | string | ✅       | -       | Partial query    |
| `gl`      | string | ❌       | -       | Country code     |
| `hl`      | string | ❌       | -       | Language code    |
| `client`  | string | ❌       | -       | Client type hint |

### Response Structure

```typescript
interface AutocompleteResult {
  searchParameters: SearchParameters;
  suggestions: string[];
}
```

### Example Usage

```typescript
const suggestions = await client.autocomplete("OpenAI Cha", {
  gl: "us",
});

console.log(suggestions.suggestions);
// ["openai chatgpt", "openai chatbot", ...]
```

---

## Common Types Across All Endpoints

### SearchParameters (included in all responses)

```typescript
interface SearchParameters {
  q: string;
  type: string;
  engine: string;
  gl?: string;
  hl?: string;
  location?: string;
  num?: number;
}
```

### Base Options (extended by all endpoint options)

```typescript
interface BaseSearchOptions {
  /** Two-letter country code (e.g., "us") */
  gl?: string;
  /** Two-letter language code (e.g., "en") */
  hl?: string;
  /** Specific location name */
  location?: string;
  /** Number of results (default 10, max ~100) */
  num?: number;
}
```

---

## Method Naming Convention

| Endpoint        | Method             | Rationale              |
| --------------- | ------------------ | ---------------------- |
| `/search`       | `search()`         | Primary/default action |
| `/images`       | `searchImages()`   | Noun-based search      |
| `/news`         | `searchNews()`     | Noun-based search      |
| `/videos`       | `searchVideos()`   | Noun-based search      |
| `/shopping`     | `searchShopping()` | Noun-based search      |
| `/maps`         | `searchMaps()`     | Noun-based search      |
| `/places`       | `searchPlaces()`   | Alias for maps         |
| `/reviews`      | `getReviews()`     | Get action (retrieval) |
| `/scholar`      | `searchScholar()`  | Noun-based search      |
| `/patents`      | `searchPatents()`  | Noun-based search      |
| `/autocomplete` | `autocomplete()`   | Action verb            |

---

## Error Mapping

| HTTP Status | Error Class             | Thrown When             |
| ----------- | ----------------------- | ----------------------- |
| 400         | `SerperValidationError` | Invalid parameters      |
| 401         | `SerperAuthError`       | Bad/missing API key     |
| 429         | `SerperRateLimitError`  | Rate limit exceeded     |
| 500+        | `SerperServerError`     | Serper.dev server issue |

---

## Implementation Priority

### Phase 1: Core (P0)

1. `search()` - Most used endpoint
2. `searchImages()` - Common use case
3. `searchNews()` - Common use case

### Phase 2: Extended (P1)

4. `searchVideos()`
5. `searchShopping()`
6. `searchMaps()`
7. `searchPlaces()` (alias)

### Phase 3: Specialized (P1)

8. `getReviews()`
9. `searchScholar()`
10. `searchPatents()`
11. `autocomplete()`

---

## Notes for Implementation

1. **All endpoints are POST** - No GET methods
2. **JSON body required** - Always send Content-Type header
3. **API key in header** - Never in query params
4. **Response always includes searchParameters** - Useful for debugging
5. **Optional fields may be undefined** - Use optional chaining
6. **Dates are strings** - No Date objects in API responses
