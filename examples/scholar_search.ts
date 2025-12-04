/**
 * Scholar Search Example
 *
 * Run: SERPER_API_KEY=your-key deno run --allow-net --allow-env examples/scholar_search.ts
 */

import { SerperClient } from "../mod.ts";

const client = new SerperClient({
  apiKey: Deno.env.get("SERPER_API_KEY")!,
});

const results = await client.searchScholar("machine learning neural networks", {
  num: 5,
  as_ylo: 2022, // Papers from 2022 onwards
});

console.log("=== Scholar Search Results ===\n");

for (const paper of results.organic) {
  console.log(`📄 ${paper.title}`);
  console.log(`   ${paper.publicationInfo}`);
  if (paper.pdfLink) {
    console.log(`   PDF: ${paper.pdfLink}`);
  }
  console.log(`   ${paper.link}\n`);
}
