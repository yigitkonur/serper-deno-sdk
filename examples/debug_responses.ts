/**
 * Debug script to see actual API response structures.
 */

import { SerperClient } from "../mod.ts";

const apiKey = Deno.env.get("SERPER_API_KEY");
if (!apiKey) {
  console.error("SERPER_API_KEY required");
  Deno.exit(1);
}

const client = new SerperClient({ apiKey });

// Test each problematic endpoint
console.log("\n=== searchPlaces() ===");
try {
  const places = await client.searchPlaces("restaurants", { location: "New York, NY", num: 3 });
  console.log(JSON.stringify(places, null, 2));
} catch (e) {
  console.error(e);
}

console.log("\n=== getReviews() ===");
try {
  const reviews = await client.getReviews({ placeId: "ChIJy8vmGC2BhYARu919i3bko-Q", limit: 2 });
  console.log(JSON.stringify(reviews, null, 2));
} catch (e) {
  console.error(e);
}

console.log("\n=== searchScholar() ===");
try {
  const scholar = await client.searchScholar("machine learning", { num: 2 });
  console.log(JSON.stringify(scholar, null, 2));
} catch (e) {
  console.error(e);
}

console.log("\n=== searchPatents() ===");
try {
  const patents = await client.searchPatents("electric vehicle", { num: 2 });
  console.log(JSON.stringify(patents, null, 2));
} catch (e) {
  console.error(e);
}

console.log("\n=== autocomplete() ===");
try {
  const auto = await client.autocomplete("how to");
  console.log(JSON.stringify(auto, null, 2));
} catch (e) {
  console.error(e);
}
