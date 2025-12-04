/**
 * Patents Search Example
 *
 * Run: SERPER_API_KEY=your-key deno run --allow-net --allow-env examples/patents_search.ts
 */

import { SerperClient } from "../mod.ts";

const client = new SerperClient({
  apiKey: Deno.env.get("SERPER_API_KEY")!,
});

const results = await client.searchPatents("electric vehicle battery", { num: 5 });

console.log("=== Patents Search Results ===\n");

for (const patent of results.organic) {
  console.log(`📜 ${patent.title}`);
  if (patent.patentNumber) {
    console.log(`   Patent #: ${patent.patentNumber}`);
  }
  if (patent.publicationDate) {
    console.log(`   Published: ${patent.publicationDate}`);
  }
  console.log(`   ${patent.link}\n`);
}
