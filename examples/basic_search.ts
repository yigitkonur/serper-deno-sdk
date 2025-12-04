import { SerperClient } from "../mod.ts";

const apiKey = Deno.env.get("SERPER_API_KEY");
if (!apiKey) {
  console.error("SERPER_API_KEY required");
  Deno.exit(1);
}

const client = new SerperClient({ apiKey });

try {
  const results = await client.search("Deno runtime");
  
  console.log("--- Organic Results ---");
  for (const result of results.organic) {
    console.log(`${result.title}`);
    console.log(result.link);
    console.log("");
  }

  if (results.knowledgeGraph) {
    console.log("--- Knowledge Graph ---");
    console.log(results.knowledgeGraph.title);
    console.log(results.knowledgeGraph.description);
  }
} catch (error) {
  console.error(error);
}
