/**
 * Video Search Example
 *
 * Run: SERPER_API_KEY=your-key deno run --allow-net --allow-env examples/video_search.ts
 */

import { SerperClient } from "../mod.ts";

const client = new SerperClient({
  apiKey: Deno.env.get("SERPER_API_KEY")!,
});

const results = await client.searchVideos("TypeScript tutorial", { num: 5 });

console.log("=== Video Search Results ===\n");

for (const video of results.videos) {
  console.log(`🎬 ${video.title}`);
  console.log(`   Source: ${video.source}`);
  console.log(`   Duration: ${video.duration || "N/A"}`);
  console.log(`   ${video.link}\n`);
}
