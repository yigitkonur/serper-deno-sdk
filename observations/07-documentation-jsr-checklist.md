# Documentation & JSR Publishing Checklist: Serper.dev SDK

**Date:** 2024-12-04
**Target:** JSR 100% Score + Comprehensive Documentation
**Registry:** jsr.io (@serper/deno-sdk)

---

## JSR Score Components

JSR calculates a quality score based on these factors:

| Factor                    | Weight | How to Achieve         |
| ------------------------- | ------ | ---------------------- |
| Has README or module doc  | ✓      | Module JSDoc in mod.ts |
| Has examples              | ✓      | @example in JSDoc      |
| All symbols documented    | ✓      | JSDoc on every export  |
| No slow types             | ✓      | Explicit return types  |
| Description in config     | ✓      | In deno.json/jsr.json  |
| At least 2 runtime compat | ✓      | deno + node (via JSR)  |
| Provenance (signed)       | ✓      | Publish from CI        |

---

## Documentation Requirements

### 1. Module Documentation (`mod.ts`)

````typescript
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
 * import { SerperClient, SerperAuthError, SerperRateLimitError } from "@serper/deno-sdk";
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
 * import { serve } from "https://deno.land/std/http/server.ts";
 * import { SerperClient } from "@serper/deno-sdk";
 *
 * const client = new SerperClient({
 *   apiKey: Deno.env.get("SERPER_API_KEY")!
 * });
 *
 * serve(async (req) => {
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
````

### 2. Class Documentation

````typescript
/**
 * Serper.dev API client for Google Search.
 * 
 * Provides type-safe access to all Serper.dev endpoints including
 * web search, images, news, videos, shopping, maps, scholar, and patents.
 * 
 * @example Basic usage
 * ```ts
 * const client = new SerperClient({ 
 *   apiKey: Deno.env.get("SERPER_API_KEY")! 
 * });
 * 
 * const results = await client.search("TypeScript");
 * console.log(results.organic[0].title);
 * ```
 * 
 * @example With configuration
 * ```ts
 * const client = new SerperClient({
 *   apiKey: "your-api-key",
 *   defaultCountry: "us",
 *   defaultLanguage: "en",
 *   timeout: 60000
 * });
 * ```
 * 
 * @example In Supabase Edge Function
 * ```ts
 * const client = new SerperClient({
 *   apiKey: Deno.env.get("SERPER_API_KEY")!
 * });
 * 
 * export default async function handler(req: Request) {
 *   const { q } = await req.json();
 *   const results = await client.search(q);
 *   return Response.json(results);
 * }
 * ```
 */
export class SerperClient { ... }
````

### 3. Method Documentation Pattern

````typescript
/**
 * Performs a Google web search.
 * 
 * Returns organic results, knowledge graph, answer boxes, 
 * "People Also Ask" questions, and related searches.
 * 
 * @param query - The search query string
 * @param options - Optional search parameters
 * @returns Search results with organic listings and SERP features
 * @throws {SerperAuthError} When API key is invalid
 * @throws {SerperRateLimitError} When rate limit is exceeded
 * @throws {SerperValidationError} When query is empty or invalid
 * @throws {SerperServerError} When Serper.dev has a server issue
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
 *   gl: "us",          // Country: United States
 *   hl: "en",          // Language: English
 *   num: 20,           // Get 20 results
 *   tbs: "qdr:d"       // From past day
 * });
 * ```
 * 
 * @example Accessing different result types
 * ```ts
 * const results = await client.search("OpenAI");
 * 
 * // Organic results
 * for (const item of results.organic) {
 *   console.log(item.title, item.link);
 * }
 * 
 * // Knowledge Graph (if present)
 * if (results.knowledgeGraph) {
 *   console.log(results.knowledgeGraph.description);
 * }
 * 
 * // People Also Ask
 * for (const paa of results.peopleAlsoAsk ?? []) {
 *   console.log(paa.question);
 * }
 * ```
 */
async search(query: string, options?: SearchOptions): Promise<SearchResult>
````

### 4. Type Documentation Pattern

````typescript
/**
 * Options for configuring the Serper client.
 *
 * @example Minimal configuration
 * ```ts
 * const options: SerperClientOptions = {
 *   apiKey: "your-api-key"
 * };
 * ```
 *
 * @example Full configuration
 * ```ts
 * const options: SerperClientOptions = {
 *   apiKey: "your-api-key",
 *   baseUrl: "https://google.serper.dev",
 *   defaultCountry: "us",
 *   defaultLanguage: "en",
 *   timeout: 30000
 * };
 * ```
 */
export interface SerperClientOptions {
  /**
   * Your Serper.dev API key.
   *
   * Get one at https://serper.dev (free tier: 2,500 queries).
   * Store securely in environment variables.
   *
   * @example
   * ```ts
   * apiKey: Deno.env.get("SERPER_API_KEY")!
   * ```
   */
  apiKey: string;

  /**
   * Base URL for Serper API.
   *
   * Only change if using a proxy or custom endpoint.
   *
   * @default "https://google.serper.dev"
   */
  baseUrl?: string;

  /**
   * Default country code for all searches.
   *
   * Two-letter ISO 3166-1 alpha-2 code.
   * Can be overridden per-request.
   *
   * @example "us", "gb", "de", "fr"
   */
  defaultCountry?: string;

  /**
   * Default language code for all searches.
   *
   * Two-letter ISO 639-1 code.
   * Can be overridden per-request.
   *
   * @example "en", "es", "de", "fr"
   */
  defaultLanguage?: string;

  /**
   * Request timeout in milliseconds.
   *
   * @default 30000 (30 seconds)
   */
  timeout?: number;
}
````

### 5. Error Documentation Pattern

````typescript
/**
 * Thrown when API key authentication fails.
 * 
 * ## Common Causes
 * 
 * - API key is missing or empty
 * - API key is invalid or malformed
 * - API key has been revoked or expired
 * 
 * ## Resolution
 * 
 * 1. Verify your API key at https://serper.dev/dashboard
 * 2. Ensure key is passed correctly to SerperClient
 * 3. Check environment variable is set correctly
 * 
 * @example Handling auth errors
 * ```ts
 * try {
 *   await client.search("query");
 * } catch (error) {
 *   if (error instanceof SerperAuthError) {
 *     console.error("API key issue:", error.message);
 *     // Log for debugging, alert team
 *   }
 * }
 * ```
 */
export class SerperAuthError extends SerperError { ... }
````

---

## README.md Structure

````markdown
# @serper/deno-sdk

> Type-safe Deno SDK for Serper.dev Google Search API

[![JSR](https://jsr.io/badges/@serper/deno-sdk)](https://jsr.io/@serper/deno-sdk)
[![JSR Score](https://jsr.io/badges/@serper/deno-sdk/score)](https://jsr.io/@serper/deno-sdk)

## Features

- 🔍 Complete Google Search API coverage
- 🦕 Built for Deno and Supabase Edge Functions
- 📦 Zero dependencies
- 🔒 Secure API key handling
- 📘 Full TypeScript support

## Installation

```bash
deno add @serper/deno-sdk
```
````

Or import directly:

```ts
import { SerperClient } from "jsr:@serper/deno-sdk";
```

## Quick Start

```ts
import { SerperClient } from "@serper/deno-sdk";

const client = new SerperClient({
  apiKey: Deno.env.get("SERPER_API_KEY")!,
});

// Web Search
const results = await client.search("Deno runtime");
console.log(results.organic[0].title);

// Image Search
const images = await client.searchImages("sunset beach");
console.log(images.images[0].imageUrl);

// News Search
const news = await client.searchNews("tech news");
console.log(news.news[0].title);
```

## API Reference

### `new SerperClient(options)`

Create a new client instance.

| Option            | Type     | Required | Default                     | Description             |
| ----------------- | -------- | -------- | --------------------------- | ----------------------- |
| `apiKey`          | `string` | ✅       | -                           | Your Serper.dev API key |
| `baseUrl`         | `string` | ❌       | `https://google.serper.dev` | API base URL            |
| `defaultCountry`  | `string` | ❌       | -                           | Default country code    |
| `defaultLanguage` | `string` | ❌       | -                           | Default language code   |
| `timeout`         | `number` | ❌       | `30000`                     | Request timeout (ms)    |

### Methods

#### `search(query, options?)`

Google Web Search.

```ts
const results = await client.search("TypeScript", {
  gl: "us",
  hl: "en",
  num: 20,
});
```

#### `searchImages(query, options?)`

Google Image Search.

```ts
const images = await client.searchImages("landscape", {
  safe: "active",
  num: 15,
});
```

#### `searchNews(query, options?)`

Google News Search.

```ts
const news = await client.searchNews("AI", { gl: "us" });
```

#### `searchVideos(query, options?)`

Google Video Search.

```ts
const videos = await client.searchVideos("tutorial");
```

#### `searchShopping(query, options?)`

Google Shopping Search.

```ts
const products = await client.searchShopping("headphones");
```

#### `searchMaps(query, options?)`

Google Maps Search.

```ts
const places = await client.searchMaps("coffee shops", {
  location: "San Francisco, CA",
});
```

#### `getReviews(options)`

Google Place Reviews.

```ts
const reviews = await client.getReviews({
  placeId: "ChIJ...",
  limit: 10,
});
```

#### `searchScholar(query, options?)`

Google Scholar Search.

```ts
const papers = await client.searchScholar("machine learning", {
  as_ylo: 2020,
});
```

#### `searchPatents(query, options?)`

Google Patents Search.

```ts
const patents = await client.searchPatents("solar panel");
```

#### `autocomplete(query, options?)`

Google Autocomplete Suggestions.

```ts
const suggestions = await client.autocomplete("how to");
```

## Error Handling

```ts
import {
  SerperAuthError,
  SerperClient,
  SerperRateLimitError,
  SerperServerError,
  SerperValidationError,
} from "@serper/deno-sdk";

try {
  const results = await client.search("query");
} catch (error) {
  if (error instanceof SerperAuthError) {
    // Invalid API key
  } else if (error instanceof SerperRateLimitError) {
    // Rate limit exceeded
  } else if (error instanceof SerperValidationError) {
    // Invalid parameters
  } else if (error instanceof SerperServerError) {
    // Server error
  }
}
```

## Supabase Edge Functions

```ts
import { serve } from "https://deno.land/std/http/server.ts";
import { SerperClient } from "@serper/deno-sdk";

const client = new SerperClient({
  apiKey: Deno.env.get("SERPER_API_KEY")!,
});

serve(async (req) => {
  const { query } = await req.json();

  try {
    const results = await client.search(query);
    return Response.json(results);
  } catch (error) {
    return Response.json(
      { error: "Search failed" },
      { status: 500 },
    );
  }
});
```

## License

MIT

````
---

## JSR Configuration (`deno.json`)

```json
{
  "name": "@serper/deno-sdk",
  "version": "1.0.0",
  "description": "Type-safe Deno SDK for Serper.dev Google Search API - Web, Images, News, Videos, Shopping, Maps, Scholar, Patents",
  "license": "MIT",
  "exports": "./mod.ts",
  "publish": {
    "include": [
      "mod.ts",
      "src/**/*.ts",
      "types/**/*.ts",
      "README.md",
      "LICENSE"
    ],
    "exclude": [
      "tests/**",
      "examples/**",
      "observations/**",
      ".github/**"
    ]
  }
}
````

---

## Pre-Publish Checklist

### Code Quality

- [ ] `deno fmt` passes
- [ ] `deno lint` passes with strict config
- [ ] `deno check mod.ts` passes
- [ ] `deno test` passes
- [ ] `deno test --doc` passes (example validation)

### Documentation

- [ ] `deno doc --lint mod.ts` passes
- [ ] Module-level @module JSDoc in mod.ts
- [ ] All exports have JSDoc
- [ ] All public methods have @param, @returns, @throws
- [ ] All public methods have @example
- [ ] README.md is complete
- [ ] CHANGELOG.md has current version

### JSR Specifics

- [ ] No slow types (explicit return types everywhere)
- [ ] `import type` used for type-only imports
- [ ] Package description in deno.json
- [ ] Version follows semver
- [ ] License specified
- [ ] exports field points to mod.ts

### Pre-Flight

- [ ] `deno publish --dry-run` succeeds
- [ ] Review generated documentation at jsr.io
- [ ] Test import in fresh project

---

## Publishing Process

### 1. Verify Everything

```bash
# Run all checks
deno task all

# Specific checks
deno fmt --check
deno lint
deno check mod.ts
deno doc --lint mod.ts
deno test --allow-env
deno test --doc
```

### 2. Dry Run

```bash
deno publish --dry-run
```

Review output for:

- Correct files included
- No sensitive files
- Version is correct
- No slow types warnings

### 3. Publish

```bash
# Interactive (prompts for auth)
deno publish

# Or from CI with token
DENO_REGISTRY_TOKEN=$TOKEN deno publish
```

### 4. Verify Publication

1. Check https://jsr.io/@serper/deno-sdk
2. Verify documentation generated correctly
3. Check JSR score (aim for 100%)
4. Test installation in new project:
   ```bash
   deno add @serper/deno-sdk
   ```

---

## CI Publishing (GitHub Actions)

```yaml
# .github/workflows/publish.yml

name: Publish to JSR

on:
  push:
    tags:
      - "v*"

jobs:
  publish:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      id-token: write # Required for JSR provenance

    steps:
      - uses: actions/checkout@v4

      - uses: denoland/setup-deno@v1
        with:
          deno-version: v2.x

      - name: Verify
        run: |
          deno fmt --check
          deno lint
          deno check mod.ts
          deno doc --lint mod.ts
          deno test --allow-env

      - name: Publish to JSR
        run: deno publish
```

---

## Version Bump Workflow

### For Patch (bug fix)

```bash
# Update version in deno.json: 1.0.0 -> 1.0.1
# Update CHANGELOG.md

git add .
git commit -m "chore: release v1.0.1"
git tag v1.0.1
git push && git push --tags
```

### For Minor (new feature)

```bash
# Update version in deno.json: 1.0.0 -> 1.1.0
# Update CHANGELOG.md

git add .
git commit -m "chore: release v1.1.0"
git tag v1.1.0
git push && git push --tags
```

### For Major (breaking change)

```bash
# Update version in deno.json: 1.0.0 -> 2.0.0
# Update CHANGELOG.md with migration guide

git add .
git commit -m "chore: release v2.0.0"
git tag v2.0.0
git push && git push --tags
```

---

## CHANGELOG.md Template

```markdown
# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.0.0] - 2024-12-XX

### Added

- Initial release
- `SerperClient` class with 11 search methods
- Full TypeScript type definitions
- Comprehensive error handling
- Supabase Edge Functions support

### Endpoints

- `search()` - Google Web Search
- `searchImages()` - Google Images
- `searchNews()` - Google News
- `searchVideos()` - Google Videos
- `searchShopping()` - Google Shopping
- `searchMaps()` - Google Maps
- `searchPlaces()` - Alias for Maps
- `getReviews()` - Place Reviews
- `searchScholar()` - Google Scholar
- `searchPatents()` - Google Patents
- `autocomplete()` - Search Suggestions

[Unreleased]: https://github.com/serper/deno-sdk/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/serper/deno-sdk/releases/tag/v1.0.0
```

---

## Documentation Linting Commands

```bash
# Check JSDoc completeness
deno doc --lint mod.ts

# Generate documentation JSON
deno doc --json mod.ts > docs.json

# View documentation in terminal
deno doc mod.ts

# View specific symbol
deno doc mod.ts SerperClient

# Test all examples in documentation
deno test --doc
```

---

## JSR Score Troubleshooting

### "Missing documentation"

- Add JSDoc to all exported symbols
- Ensure @param, @returns tags are present

### "Slow types detected"

- Add explicit return type annotations
- Use `import type` for type-only imports
- Avoid complex conditional types

### "Missing examples"

- Add @example to public methods
- Ensure examples are valid TypeScript

### "Missing description"

- Add `description` field to deno.json

### "Low runtime compatibility"

- Mark compatible runtimes in package config
- Test on multiple runtimes

---

## Final Verification Checklist

Before announcing release:

- [ ] JSR page shows 100% score
- [ ] Documentation renders correctly
- [ ] All examples in docs work
- [ ] Import works: `deno add @serper/deno-sdk`
- [ ] Basic usage works in fresh project
- [ ] Works in Supabase Edge Function
- [ ] GitHub README matches JSR docs
- [ ] CHANGELOG is up to date
- [ ] Git tag matches version
