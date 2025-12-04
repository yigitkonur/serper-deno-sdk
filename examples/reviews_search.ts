/**
 * Reviews Example (requires placeId from Maps search)
 *
 * Run: SERPER_API_KEY=your-key deno run --allow-net --allow-env examples/reviews_search.ts
 */

import { SerperClient } from "../mod.ts";

const client = new SerperClient({
  apiKey: Deno.env.get("SERPER_API_KEY")!,
});

// First, get a placeId from Maps search
const mapsResult = await client.searchMaps("Starbucks", {
  location: "Seattle, WA",
  num: 1,
});

const placeId = mapsResult.places[0]?.placeId;

if (!placeId) {
  console.error("No placeId found");
  Deno.exit(1);
}

console.log(`Getting reviews for: ${mapsResult.places[0]!.title}\n`);

// Now get reviews
const results = await client.getReviews({ placeId, limit: 5 });

console.log("=== Reviews ===\n");

for (const review of results.reviews) {
  console.log(`⭐ ${review.rating}/5 by ${review.user.name}`);
  console.log(`   "${review.snippet.slice(0, 150)}..."`);
  console.log(`   Date: ${review.date}\n`);
}
