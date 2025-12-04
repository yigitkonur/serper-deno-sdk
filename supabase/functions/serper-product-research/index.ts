/**
 * Serper Product Research Edge Function
 *
 * Business Use Case: E-commerce product research and price comparison
 * Useful for: Price monitoring, competitor analysis, product discovery
 *
 * Example Request:
 * POST /serper-product-research
 * {
 *   "products": ["iPhone 15 Pro", "Samsung Galaxy S24"],
 *   "maxResults": 10
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
    const { products, maxResults = 10, gl = "us" } = await req.json();

    if (!products || !Array.isArray(products) || products.length === 0) {
      return new Response(
        JSON.stringify({ error: "Products array is required" }),
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

    const client = new SerperClient({ apiKey, defaultCountry: gl });

    // Search shopping results for all products in parallel
    const productPromises = products.map(async (product) => {
      const results = await client.searchShopping(product, { num: maxResults });

      const items = results.shopping.map((item) => ({
        title: item.title,
        price: item.price,
        source: item.source,
        link: item.link,
        rating: item.rating,
        ratingCount: item.ratingCount,
        delivery: item.delivery,
        imageUrl: item.imageUrl,
      }));

      // Calculate price statistics
      const prices = items
        .map((item) => {
          const match = item.price?.match(/[\d,]+\.?\d*/);
          return match ? parseFloat(match[0].replace(/,/g, "")) : null;
        })
        .filter((p): p is number => p !== null);

      const stats = prices.length > 0
        ? {
          min: Math.min(...prices),
          max: Math.max(...prices),
          avg: prices.reduce((a, b) => a + b, 0) / prices.length,
          count: prices.length,
        }
        : null;

      return {
        product,
        totalResults: items.length,
        items,
        priceStats: stats,
      };
    });

    const allProducts = await Promise.all(productPromises);

    return new Response(
      JSON.stringify({
        success: true,
        timestamp: new Date().toISOString(),
        totalProducts: products.length,
        products: allProducts,
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
