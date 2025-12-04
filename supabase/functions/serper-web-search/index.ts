/**
 * Serper Web Search Edge Function
 * 
 * Business Use Case: General web search API for applications
 * 
 * Example Request:
 * POST /serper-web-search
 * {
 *   "query": "best restaurants in San Francisco",
 *   "num": 10,
 *   "gl": "us"
 * }
 */

import { serve } from "https://deno.land/std@0.208.0/http/server.ts";
import { SerperClient } from "jsr:@yigitkonur/serper-deno-sdk@1.0.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { query, num = 10, gl, hl, safe } = await req.json();

    if (!query) {
      return new Response(
        JSON.stringify({ error: "Query parameter is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const apiKey = Deno.env.get("SERPER_API_KEY");
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: "SERPER_API_KEY not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const client = new SerperClient({ apiKey });
    const results = await client.search(query, { num, gl, hl, safe });

    return new Response(
      JSON.stringify({
        success: true,
        query,
        totalResults: results.organic.length,
        results: results.organic.map(r => ({
          title: r.title,
          link: r.link,
          snippet: r.snippet,
          position: r.position,
        })),
        knowledgeGraph: results.knowledgeGraph,
        peopleAlsoAsk: results.peopleAlsoAsk,
        relatedSearches: results.relatedSearches,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Search error:", error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : "Unknown error" 
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
