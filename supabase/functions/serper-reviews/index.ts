// Serper Reviews Edge Function
// curl -X POST http://localhost:54321/functions/v1/serper-reviews \
//   -H "Content-Type: application/json" \
//   -d '{"placeId": "ChIJj61dQgK6j4AR4GeTYWZsKWw"}'

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
    const { placeId, limit = 10 } = await req.json();
    if (!placeId) {
      return Response.json({ error: "Missing placeId" }, { status: 400, headers: corsHeaders });
    }

    const client = new SerperClient({ apiKey: Deno.env.get("SERPER_API_KEY")! });
    const results = await client.getReviews({ placeId, limit });

    return Response.json(results, { headers: corsHeaders });
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500, headers: corsHeaders },
    );
  }
});
