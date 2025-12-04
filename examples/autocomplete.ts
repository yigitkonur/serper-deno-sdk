/**
 * Autocomplete Example
 *
 * Run: SERPER_API_KEY=your-key deno run --allow-net --allow-env examples/autocomplete.ts
 */

import { SerperClient } from "../mod.ts";

const client = new SerperClient({
  apiKey: Deno.env.get("SERPER_API_KEY")!,
});

const results = await client.autocomplete("how to learn prog");

console.log("=== Autocomplete Suggestions ===\n");

for (let i = 0; i < results.suggestions.length; i++) {
  console.log(`${i + 1}. ${results.suggestions[i]!.value}`);
}
