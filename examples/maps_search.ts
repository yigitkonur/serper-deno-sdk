/**
 * Maps/Places Search Example
 *
 * Run: SERPER_API_KEY=your-key deno run --allow-net --allow-env examples/maps_search.ts
 */

import { SerperClient } from "../mod.ts";

const client = new SerperClient({
  apiKey: Deno.env.get("SERPER_API_KEY")!,
});

const results = await client.searchMaps("coffee shops", {
  location: "San Francisco, CA",
  num: 5,
});

console.log("=== Maps Search Results ===\n");

for (const place of results.places) {
  console.log(`📍 ${place.title}`);
  console.log(`   Address: ${place.address}`);
  console.log(`   Rating: ${place.rating || "N/A"}⭐ (${place.ratingCount || 0} reviews)`);
  console.log(`   Type: ${place.type}`);
  console.log(`   PlaceId: ${place.placeId}\n`);
}
