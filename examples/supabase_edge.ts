import { serve } from "https://deno.land/std@0.208.0/http/server.ts";
import { SerperClient } from "../mod.ts";

const client = new SerperClient({
  apiKey: Deno.env.get("SERPER_API_KEY")!,
});

serve(async (req) => {
  try {
    const { query } = await req.json();
    if (!query) {
      return new Response("Missing query", { status: 400 });
    }

    const results = await client.search(query);

    return new Response(
      JSON.stringify(results),
      { headers: { "Content-Type": "application/json" } },
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
});
