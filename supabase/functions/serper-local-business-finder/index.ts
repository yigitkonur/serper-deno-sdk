/**
 * Serper Local Business Finder Edge Function
 *
 * Business Use Case: Find local businesses with reviews
 * Useful for: Directory apps, local search, business discovery
 *
 * Example Request:
 * POST /serper-local-business-finder
 * {
 *   "query": "coffee shops",
 *   "location": "San Francisco, CA",
 *   "includeReviews": true,
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
    const { query, location, includeReviews = false, maxResults = 10 } = await req.json();

    if (!query || !location) {
      return new Response(
        JSON.stringify({ error: "Query and location are required" }),
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

    // Search for places
    const placesResult = await client.searchMaps(query, {
      location,
      num: maxResults,
    });

    // Optionally fetch reviews for top results
    let businessesWithReviews = placesResult.places.map((place) => ({
      name: place.title,
      address: place.address,
      rating: place.rating,
      reviews: place.reviews,
      type: place.type,
      phone: place.phoneNumber,
      website: place.website,
      placeId: place.placeId,
      position: place.position,
      reviewsData: null as any,
    }));

    if (includeReviews && businessesWithReviews.length > 0) {
      // Fetch reviews for top 3 places
      const reviewsPromises = businessesWithReviews.slice(0, 3).map(async (business) => {
        if (business.placeId) {
          try {
            const reviews = await client.getReviews({
              placeId: business.placeId,
              limit: 5,
            });
            return {
              placeId: business.placeId,
              reviews: reviews.reviews.map((r) => ({
                rating: r.rating,
                date: r.date,
                snippet: r.snippet,
                author: r.user.name,
              })),
            };
          } catch {
            return { placeId: business.placeId, reviews: [] };
          }
        }
        return null;
      });

      const reviewsData = await Promise.all(reviewsPromises);

      // Merge reviews data
      businessesWithReviews = businessesWithReviews.map((business) => {
        const reviewData = reviewsData.find((r) => r?.placeId === business.placeId);
        return {
          ...business,
          reviewsData: reviewData?.reviews || null,
        };
      });
    }

    return new Response(
      JSON.stringify({
        success: true,
        query,
        location,
        totalResults: businessesWithReviews.length,
        businesses: businessesWithReviews,
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
