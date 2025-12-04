/**
 * Web Search Example
 *
 * Run: SERPER_API_KEY=your-key deno run --allow-net --allow-env examples/web_search.ts
 */

import { SerperClient } from "../mod.ts";

const client = new SerperClient({
  apiKey: Deno.env.get("SERPER_API_KEY")!,
});

const results = await client.search("TypeScript Deno runtime", { num: 5 });

console.log("=== Web Search Results ===\n");

// Organic results
for (const result of results.organic) {
  console.log(`📄 ${result.title}`);
  console.log(`   ${result.link}`);
  console.log(`   ${result.snippet?.slice(0, 100)}...\n`);
}

// Knowledge Graph (if available)
if (results.knowledgeGraph) {
  console.log("=== Knowledge Graph ===");
  console.log(`📚 ${results.knowledgeGraph.title}`);
  console.log(`   ${results.knowledgeGraph.description}\n`);
}

// People Also Ask
if (results.peopleAlsoAsk?.length) {
  console.log("=== People Also Ask ===");
  for (const paa of results.peopleAlsoAsk.slice(0, 3)) {
    console.log(`❓ ${paa.question}`);
  }
}
