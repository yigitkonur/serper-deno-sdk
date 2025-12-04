# @serper/deno-sdk

> Type-safe Deno SDK for Serper.dev Google Search API

[![JSR](https://jsr.io/badges/@serper/deno-sdk)](https://jsr.io/@serper/deno-sdk)
[![JSR Score](https://jsr.io/badges/@serper/deno-sdk/score)](https://jsr.io/@serper/deno-sdk)

## Features

- 🔍 **Complete API Coverage** - Web, Images, News, Videos, Shopping, Maps, Scholar, Patents
- 🦕 **Built for Deno** - Works in Deno CLI and Supabase Edge Functions
- 📦 **Zero Dependencies** - Only uses Web standard APIs
- 🔒 **Secure** - API key never exposed, proper error handling
- 📘 **Fully Typed** - Complete TypeScript definitions

## Installation

```bash
deno add @serper/deno-sdk
```

Or import directly:

```ts
import { SerperClient } from "jsr:@serper/deno-sdk";
```

## Quick Start

```ts
import { SerperClient } from "@serper/deno-sdk";

// Create a client with your API key
const client = new SerperClient({
  apiKey: Deno.env.get("SERPER_API_KEY")!,
});

// Perform a web search
const results = await client.search("Deno runtime");

// Access organic results
for (const result of results.organic) {
  console.log(result.title, result.link);
}
```

## Configuration

```ts
const client = new SerperClient({
  apiKey: "your-api-key", // Required
  baseUrl: "https://...", // Optional: custom endpoint
  defaultCountry: "us", // Optional: default country code
  defaultLanguage: "en", // Optional: default language code
  timeout: 30000, // Optional: request timeout (ms)
});
```

## API Reference

### Web Search

```ts
const results = await client.search("TypeScript tutorial", {
  gl: "us", // Country
  hl: "en", // Language
  num: 20, // Number of results
  tbs: "qdr:d", // Past day
});

console.log(results.organic); // Organic results
console.log(results.knowledgeGraph); // Knowledge Graph (if present)
console.log(results.answerBox); // Featured snippet (if present)
console.log(results.peopleAlsoAsk); // Related questions
```

### Image Search

```ts
const images = await client.searchImages("sunset beach", {
  num: 15,
  safe: "active",
});

for (const img of images.images) {
  console.log(img.imageUrl, img.source);
}
```

### News Search

```ts
const news = await client.searchNews("AI technology", { gl: "us" });

for (const article of news.news) {
  console.log(`${article.source}: ${article.title}`);
}
```

### Video Search

```ts
const videos = await client.searchVideos("TypeScript tutorial");

for (const video of videos.videos) {
  console.log(`${video.title} (${video.duration})`);
}
```

### Shopping Search

```ts
const products = await client.searchShopping("wireless headphones");

for (const item of products.shopping) {
  console.log(`${item.title}: ${item.price}`);
}
```

### Maps/Places Search

```ts
const places = await client.searchMaps("coffee shops", {
  location: "San Francisco, CA",
});

for (const place of places.places) {
  console.log(`${place.title} - ${place.rating}⭐`);
}
```

### Place Reviews

```ts
// Using Place ID (recommended)
const reviews = await client.getReviews({
  placeId: "ChIJxxxxxxxxxxxxxxxxx",
  limit: 10,
});

// Or using place name
const reviews = await client.getReviews({
  q: "Starbucks Times Square",
});

for (const review of reviews.reviews) {
  console.log(`${review.author}: ${review.rating}⭐`);
}
```

### Scholar Search

```ts
const papers = await client.searchScholar("machine learning", {
  as_ylo: 2020, // From year
  num: 10,
});

for (const paper of papers.scholar) {
  console.log(paper.title, paper.publicationInfo);
}
```

### Patents Search

```ts
const patents = await client.searchPatents("solar panel efficiency");

for (const patent of patents.patents) {
  console.log(patent.patentNumber, patent.title);
}
```

### Autocomplete

```ts
const suggestions = await client.autocomplete("how to le");
console.log(suggestions.suggestions);
// ["how to learn programming", "how to learn python", ...]
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
    // 401 - Invalid API key
    console.error("Check your API key");
  } else if (error instanceof SerperRateLimitError) {
    // 429 - Rate limit exceeded
    console.error("Rate limit exceeded, retry later");
  } else if (error instanceof SerperValidationError) {
    // 400 - Invalid parameters
    console.error("Invalid search parameters");
  } else if (error instanceof SerperServerError) {
    // 500+ - Server error
    console.error("Server error, retry later");
  }
}
```

## Supabase Edge Functions

```ts
import { SerperClient } from "@serper/deno-sdk";

const client = new SerperClient({
  apiKey: Deno.env.get("SERPER_API_KEY")!,
});

Deno.serve(async (req) => {
  try {
    const { query } = await req.json();
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

## Types

All types are exported for use in your application:

```ts
import type {
  ImageResult,
  NewsResult,
  OrganicResult,
  PlaceResult,
  SearchResult,
  // ... and more
} from "@serper/deno-sdk";
```

## Links

- [Serper.dev](https://serper.dev) - Get your API key
- [API Documentation](https://serper.dev/docs) - Official API docs
- [JSR Package](https://jsr.io/@serper/deno-sdk) - Package registry

## License

MIT
