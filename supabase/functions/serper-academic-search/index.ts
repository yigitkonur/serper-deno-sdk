/**
 * Serper Academic Search Edge Function
 *
 * Business Use Case: Research paper discovery and academic literature search
 * Useful for: Research platforms, citation tools, academic databases
 *
 * Example Request:
 * POST /serper-academic-search
 * {
 *   "query": "machine learning neural networks",
 *   "yearFrom": 2020,
 *   "yearTo": 2024,
 *   "maxResults": 20
 * }
 */

import { serve } from "https://deno.land/std@0.208.0/http/server.ts";
import { SerperClient } from "jsr:@yigitkonur/serper-deno-sdk@1.0.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { query, yearFrom, yearTo, maxResults = 20 } = await req.json();

    if (!query) {
      return new Response(
        JSON.stringify({ error: "Query is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const apiKey = Deno.env.get("SERPER_API_KEY");
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: "SERPER_API_KEY not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const client = new SerperClient({ apiKey });

    // Build search options
    const options: Record<string, unknown> = { num: maxResults };
    if (yearFrom) options.as_ylo = yearFrom;
    if (yearTo) options.as_yhi = yearTo;

    const results = await client.searchScholar(query, options as any);

    const papers = results.organic.map((paper) => ({
      title: paper.title,
      link: paper.link,
      snippet: paper.snippet,
      publicationInfo: paper.publicationInfo,
      citedBy: paper.citedBy,
      relatedPages: paper.relatedPages,
      versions: paper.versions,
      pdfLink: paper.pdfLink,
    }));

    return new Response(
      JSON.stringify({
        success: true,
        query,
        filters: {
          yearFrom: yearFrom || null,
          yearTo: yearTo || null,
        },
        totalResults: papers.length,
        papers,
        summary: {
          withPdf: papers.filter((p) => p.pdfLink).length,
          withCitations: papers.filter((p) => p.citedBy).length,
        },
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
