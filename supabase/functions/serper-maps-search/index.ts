// Serper Maps Search Edge Function
// curl -X POST http://localhost:54321/functions/v1/serper-maps-search \
//   -H "Content-Type: application/json" \
//   -d '{"query": "coffee shops", "location": "San Francisco, CA"}'

import { SerperClient } from "jsr:@yigitkonur/serper-deno-sdk@1.0.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { query, location, num = 10, gl, hl, ll } = await req.json();
    if (!query) {
      return Response.json({ error: "Missing query" }, { status: 400, headers: corsHeaders });
    }

    const client = new SerperClient({ apiKey: Deno.env.get("SERPER_API_KEY")! });
    const results = await client.searchMaps(query, { location, num, gl, hl, ll });

    return Response.json(results, { headers: corsHeaders });
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500, headers: corsHeaders },
    );
  }
});
