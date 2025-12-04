/**
 * Serper News Aggregator Edge Function
 * 
 * Business Use Case: Real-time news monitoring and aggregation
 * Useful for: News apps, content curation, market intelligence
 * 
 * Example Request:
 * POST /serper-news-aggregator
 * {
 *   "topics": ["AI technology", "cryptocurrency", "climate change"],
 *   "num": 5
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
    const { topics, num = 5, gl = "us" } = await req.json();

    if (!topics || !Array.isArray(topics) || topics.length === 0) {
      return new Response(
        JSON.stringify({ error: "Topics array is required" }),
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

    const client = new SerperClient({ apiKey, defaultCountry: gl });

    // Fetch news for all topics in parallel
    const newsPromises = topics.map(topic =>
      client.searchNews(topic, { num }).then(result => ({
        topic,
        articles: result.news.map(article => ({
          title: article.title,
          link: article.link,
          source: article.source,
          date: article.date,
          snippet: article.snippet,
          imageUrl: article.imageUrl,
        })),
      }))
    );

    const allNews = await Promise.all(newsPromises);

    return new Response(
      JSON.stringify({
        success: true,
        timestamp: new Date().toISOString(),
        totalTopics: topics.length,
        news: allNews,
        summary: {
          totalArticles: allNews.reduce((sum, n) => sum + n.articles.length, 0),
          topicsQueried: topics,
        },
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
