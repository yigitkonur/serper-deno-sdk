/**
 * Image Search Example
 *
 * Run: SERPER_API_KEY=your-key deno run --allow-net --allow-env examples/image_search.ts
 */

import { SerperClient } from "../mod.ts";

const client = new SerperClient({
  apiKey: Deno.env.get("SERPER_API_KEY")!,
});

const results = await client.searchImages("mountain sunset landscape", {
  num: 5,
  safe: "active",
});

console.log("=== Image Search Results ===\n");

for (const image of results.images) {
  console.log(`🖼️  ${image.title}`);
  console.log(`   Size: ${image.imageWidth}x${image.imageHeight}`);
  console.log(`   URL: ${image.imageUrl}`);
  console.log(`   Source: ${image.source}\n`);
}
