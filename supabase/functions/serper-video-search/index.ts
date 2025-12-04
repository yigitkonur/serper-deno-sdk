// Serper Video Search Edge Function
// curl -X POST http://localhost:54321/functions/v1/serper-video-search \
//   -H "Content-Type: application/json" \
//   -d '{"query": "TypeScript tutorial"}'

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
    const { query, num = 10, gl, hl } = await req.json();
    if (!query) {
      return Response.json({ error: "Missing query" }, { status: 400, headers: corsHeaders });
    }

    const client = new SerperClient({ apiKey: Deno.env.get("SERPER_API_KEY")! });
    const results = await client.searchVideos(query, { num, gl, hl });

    return Response.json(results, { headers: corsHeaders });
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500, headers: corsHeaders },
    );
  }
});
