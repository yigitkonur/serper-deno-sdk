/**
 * News Search Example
 *
 * Run: SERPER_API_KEY=your-key deno run --allow-net --allow-env examples/news_search.ts
 */

import { SerperClient } from "../mod.ts";

const client = new SerperClient({
  apiKey: Deno.env.get("SERPER_API_KEY")!,
});

const results = await client.searchNews("artificial intelligence", { num: 5 });

console.log("=== News Search Results ===\n");

for (const article of results.news) {
  console.log(`📰 ${article.title}`);
  console.log(`   Source: ${article.source}`);
  console.log(`   Date: ${article.date}`);
  console.log(`   ${article.link}\n`);
}
