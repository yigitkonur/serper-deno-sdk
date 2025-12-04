/**
 * Comprehensive test of all Serper SDK endpoints.
 *
 * Run with:
 * SERPER_API_KEY=your-key deno run --allow-net --allow-env examples/all_endpoints.ts
 */

import {
  SerperAuthError,
  SerperClient,
  SerperRateLimitError,
  SerperServerError,
  SerperValidationError,
} from "../mod.ts";

// Get API key from environment
const apiKey = Deno.env.get("SERPER_API_KEY");
if (!apiKey) {
  console.error("❌ SERPER_API_KEY environment variable is required");
  Deno.exit(1);
}

// Create client
const client = new SerperClient({
  apiKey,
  defaultCountry: "us",
  defaultLanguage: "en",
});

console.log("🚀 Testing Serper SDK - All 11 Endpoints\n");
console.log("=".repeat(60));

let passed = 0;
let failed = 0;

// Helper to run a test
async function runTest<T>(
  name: string,
  fn: () => Promise<T>,
  validate: (result: T) => void,
): Promise<void> {
  console.log(`\n📋 Testing: ${name}`);
  try {
    const start = performance.now();
    const result = await fn();
    const duration = (performance.now() - start).toFixed(0);
    validate(result);
    console.log(`   ✅ PASSED (${duration}ms)`);
    passed++;
  } catch (error) {
    console.log(`   ❌ FAILED: ${error instanceof Error ? error.message : error}`);
    if (error instanceof SerperAuthError) {
      console.log("   💡 Check your API key");
    } else if (error instanceof SerperRateLimitError) {
      console.log("   💡 Rate limit exceeded, wait and retry");
    } else if (error instanceof SerperValidationError) {
      console.log("   💡 Invalid parameters");
    } else if (error instanceof SerperServerError) {
      console.log("   💡 Server error, retry later");
    }
    failed++;
  }
}

// ========================================
// 1. Web Search
// ========================================
await runTest(
  "search() - Web Search",
  () => client.search("TypeScript Deno runtime", { num: 5 }),
  (result) => {
    console.log(`   → Found ${result.organic.length} organic results`);
    console.log(`   → Query: "${result.searchParameters.q}"`);
    if (result.organic[0]) {
      console.log(`   → First result: "${result.organic[0].title}"`);
    }
    if (result.knowledgeGraph) {
      console.log(`   → Knowledge Graph: "${result.knowledgeGraph.title}"`);
    }
    if (result.peopleAlsoAsk?.length) {
      console.log(`   → People Also Ask: ${result.peopleAlsoAsk.length} questions`);
    }
    if (!result.organic.length) throw new Error("No organic results");
  },
);

// ========================================
// 2. Image Search
// ========================================
await runTest(
  "searchImages() - Image Search",
  () => client.searchImages("mountain landscape sunset", { num: 5, safe: "active" }),
  (result) => {
    console.log(`   → Found ${result.images.length} images`);
    if (result.images[0]) {
      console.log(`   → First image: "${result.images[0].title}"`);
      console.log(`   → Size: ${result.images[0].imageWidth}x${result.images[0].imageHeight}`);
    }
    if (!result.images.length) throw new Error("No images found");
  },
);

// ========================================
// 3. News Search
// ========================================
await runTest(
  "searchNews() - News Search",
  () => client.searchNews("artificial intelligence technology 2024", { num: 5 }),
  (result) => {
    console.log(`   → Found ${result.news.length} articles`);
    if (result.news[0]) {
      console.log(`   → First article: "${result.news[0].title}"`);
      console.log(`   → Source: ${result.news[0].source}`);
      console.log(`   → Date: ${result.news[0].date}`);
    }
    if (!result.news.length) throw new Error("No news articles found");
  },
);

// ========================================
// 4. Video Search
// ========================================
await runTest(
  "searchVideos() - Video Search",
  () => client.searchVideos("TypeScript tutorial beginners", { num: 5 }),
  (result) => {
    console.log(`   → Found ${result.videos.length} videos`);
    if (result.videos[0]) {
      console.log(`   → First video: "${result.videos[0].title}"`);
      console.log(`   → Source: ${result.videos[0].source}`);
      if (result.videos[0].duration) {
        console.log(`   → Duration: ${result.videos[0].duration}`);
      }
    }
    if (!result.videos.length) throw new Error("No videos found");
  },
);

// ========================================
// 5. Shopping Search
// ========================================
await runTest(
  "searchShopping() - Shopping Search",
  () => client.searchShopping("wireless bluetooth headphones", { num: 5 }),
  (result) => {
    console.log(`   → Found ${result.shopping.length} products`);
    if (result.shopping[0]) {
      console.log(`   → First product: "${result.shopping[0].title}"`);
      console.log(`   → Price: ${result.shopping[0].price}`);
      console.log(`   → Source: ${result.shopping[0].source}`);
    }
    if (!result.shopping.length) throw new Error("No products found");
  },
);

// ========================================
// 6. Maps Search
// ========================================
let placeId: string | undefined;

await runTest(
  "searchMaps() - Maps Search",
  () => client.searchMaps("Starbucks", { location: "Seattle, WA", num: 5 }),
  (result) => {
    console.log(`   → Found ${result.places.length} places`);
    if (result.places[0]) {
      console.log(`   → First place: "${result.places[0].title}"`);
      console.log(`   → Address: ${result.places[0].address}`);
      console.log(`   → Rating: ${result.places[0].rating ?? "N/A"}⭐`);
      console.log(`   → Type: ${result.places[0].type}`);
      // Save placeId for reviews test
      placeId = result.places[0].placeId;
      console.log(`   → PlaceId: ${placeId}`);
    }
    if (!result.places.length) throw new Error("No places found");
  },
);

// ========================================
// 7. Places Search (alias for Maps)
// ========================================
await runTest(
  "searchPlaces() - Places Search (alias)",
  () => client.searchPlaces("pizza", { location: "New York, NY", num: 3 }),
  (result) => {
    console.log(`   → Found ${result.places.length} places`);
    if (result.places[0]) {
      console.log(`   → First place: "${result.places[0].title}"`);
    }
    if (!result.places.length) throw new Error("No places found");
  },
);

// ========================================
// 8. Reviews (requires placeId from Maps)
// ========================================
await runTest(
  "getReviews() - Place Reviews",
  async () => {
    if (!placeId) {
      // Get a placeId first if we don't have one
      const mapsResult = await client.searchMaps("Starbucks", { location: "Seattle, WA", num: 1 });
      placeId = mapsResult.places[0]?.placeId;
    }
    if (!placeId) throw new Error("No placeId available for reviews test");
    return client.getReviews({ placeId, limit: 5 });
  },
  (result) => {
    console.log(`   → Found ${result.reviews.length} reviews`);
    if (result.reviews[0]) {
      console.log(`   → First review by: "${result.reviews[0].user.name}"`);
      console.log(`   → Rating: ${result.reviews[0].rating}⭐`);
      console.log(`   → Text preview: "${result.reviews[0].snippet.substring(0, 50)}..."`);
    }
    if (!result.reviews.length) throw new Error("No reviews found");
  },
);

// ========================================
// 9. Scholar Search
// ========================================
await runTest(
  "searchScholar() - Scholar Search",
  () => client.searchScholar("machine learning neural networks", { "as_ylo": 2022, num: 5 }),
  (result) => {
    console.log(`   → Found ${result.organic.length} papers`);
    if (result.organic[0]) {
      console.log(`   → First paper: "${result.organic[0].title}"`);
      console.log(`   → Publication: ${result.organic[0].publicationInfo}`);
      if (result.organic[0].pdfLink) {
        console.log(`   → PDF available: Yes`);
      }
    }
    if (!result.organic.length) throw new Error("No papers found");
  },
);

// ========================================
// 10. Patents Search
// ========================================
await runTest(
  "searchPatents() - Patents Search",
  () => client.searchPatents("electric vehicle battery technology", { num: 5 }),
  (result) => {
    console.log(`   → Found ${result.organic.length} patents`);
    if (result.organic[0]) {
      console.log(`   → First patent: "${result.organic[0].title}"`);
      if (result.organic[0].patentNumber) {
        console.log(`   → Patent #: ${result.organic[0].patentNumber}`);
      }
    }
    if (!result.organic.length) throw new Error("No patents found");
  },
);

// ========================================
// 11. Autocomplete
// ========================================
await runTest(
  "autocomplete() - Search Suggestions",
  () => client.autocomplete("how to learn prog"),
  (result) => {
    console.log(`   → Found ${result.suggestions.length} suggestions`);
    if (result.suggestions.length > 0) {
      console.log(`   → Suggestions:`);
      result.suggestions.slice(0, 5).forEach((s, i) => {
        console.log(`      ${i + 1}. "${s.value}"`);
      });
    }
    if (!result.suggestions.length) throw new Error("No suggestions found");
  },
);

// ========================================
// Summary
// ========================================
console.log("\n" + "=".repeat(60));
console.log(`\n📊 Test Summary:`);
console.log(`   ✅ Passed: ${passed}`);
console.log(`   ❌ Failed: ${failed}`);
console.log(`   📝 Total:  ${passed + failed}`);

if (failed === 0) {
  console.log("\n🎉 All tests passed! SDK is working correctly.\n");
} else {
  console.log(`\n⚠️  ${failed} test(s) failed. Check output above for details.\n`);
  Deno.exit(1);
}
