/**
 * Shopping Search Example
 *
 * Run: SERPER_API_KEY=your-key deno run --allow-net --allow-env examples/shopping_search.ts
 */

import { SerperClient } from "../mod.ts";

const client = new SerperClient({
  apiKey: Deno.env.get("SERPER_API_KEY")!,
});

const results = await client.searchShopping("wireless headphones", { num: 5 });

console.log("=== Shopping Search Results ===\n");

for (const product of results.shopping) {
  console.log(`🛒 ${product.title}`);
  console.log(`   Price: ${product.price}`);
  console.log(`   Source: ${product.source}`);
  console.log(`   ${product.link}\n`);
}
