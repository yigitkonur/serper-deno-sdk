/**
 * Serper Bulk Search Edge Function
 * 
 * Business Use Case: Batch processing multiple search queries
 * Useful for: SEO tools, market research, content analysis at scale
 * 
 * Example Request:
 * POST /serper-bulk-search
 * {
 *   "queries": [
 *     { "query": "best laptops 2024", "type": "search" },
 *     { "query": "AI news", "type": "news" },
 *     { "query": "restaurants NYC", "type": "places", "location": "New York, NY" }
 *   ],
 *   "maxResultsPerQuery": 10
 * }
 */

import { serve } from "https://deno.land/std@0.208.0/http/server.ts";
import { SerperClient } from "jsr:@yigitkonur/serper-deno-sdk@1.0.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface SearchQuery {
  query: string;
  type: "search" | "news" | "images" | "videos" | "shopping" | "places";
  location?: string;
  gl?: string;
  hl?: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { queries, maxResultsPerQuery = 10 } = await req.json();

    if (!queries || !Array.isArray(queries) || queries.length === 0) {
      return new Response(
        JSON.stringify({ error: "Queries array is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (queries.length > 50) {
      return new Response(
        JSON.stringify({ error: "Maximum 50 queries allowed per request" }),
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

    // Process all queries in parallel
    const results = await Promise.allSettled(
      queries.map(async (q: SearchQuery) => {
        const options = { num: maxResultsPerQuery, gl: q.gl, hl: q.hl };
        
        switch (q.type) {
          case "search":
            return { ...q, results: await client.search(q.query, options) };
          case "news":
            return { ...q, results: await client.searchNews(q.query, options) };
          case "images":
            return { ...q, results: await client.searchImages(q.query, options) };
          case "videos":
            return { ...q, results: await client.searchVideos(q.query, options) };
          case "shopping":
            return { ...q, results: await client.searchShopping(q.query, options) };
          case "places":
            return { 
              ...q, 
              results: await client.searchMaps(q.query, { 
                ...options, 
                location: q.location 
              }) 
            };
          default:
            throw new Error(`Unknown search type: ${q.type}`);
        }
      })
    );

    const successful = results.filter(r => r.status === "fulfilled").length;
    const failed = results.filter(r => r.status === "rejected").length;

    return new Response(
      JSON.stringify({
        success: true,
        timestamp: new Date().toISOString(),
        summary: {
          total: queries.length,
          successful,
          failed,
        },
        results: results.map((r, i) => ({
          index: i,
          query: queries[i],
          status: r.status,
          data: r.status === "fulfilled" ? r.value : null,
          error: r.status === "rejected" ? r.reason.message : null,
        })),
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : "Unknown error" 
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
