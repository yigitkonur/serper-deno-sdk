/**
 * Example Supabase Edge Function using Serper SDK
 *
 * This is a reference implementation. See supabase/functions/ for
 * individual endpoint-specific functions.
 *
 * Deploy with:
 * supabase functions deploy serper-web-search
 */

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
    const { query, endpoint = "search", ...options } = await req.json();
    if (!query) {
      return Response.json({ error: "Missing query" }, { status: 400, headers: corsHeaders });
    }

    const client = new SerperClient({ apiKey: Deno.env.get("SERPER_API_KEY")! });

    // Route to appropriate method based on endpoint
    const methods: Record<string, (q: string, o: Record<string, unknown>) => Promise<unknown>> = {
      search: (q, o) => client.search(q, o),
      images: (q, o) => client.searchImages(q, o),
      news: (q, o) => client.searchNews(q, o),
      videos: (q, o) => client.searchVideos(q, o),
      shopping: (q, o) => client.searchShopping(q, o),
      maps: (q, o) => client.searchMaps(q, o),
      scholar: (q, o) => client.searchScholar(q, o),
      patents: (q, o) => client.searchPatents(q, o),
      autocomplete: (q, o) => client.autocomplete(q, o),
    };

    const method = methods[endpoint];
    if (!method) {
      return Response.json({ error: `Unknown endpoint: ${endpoint}` }, {
        status: 400,
        headers: corsHeaders,
      });
    }

    const results = await method(query, options);
    return Response.json(results, { headers: corsHeaders });
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500, headers: corsHeaders },
    );
  }
});
