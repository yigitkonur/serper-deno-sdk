import { assertEquals, assertRejects } from "https://deno.land/std@0.208.0/assert/mod.ts";
import { SerperClient, SerperServerError, SerperValidationError } from "../mod.ts";
import { jsonResponse, mockFetch } from "./helpers.ts";

Deno.test("searchImages - returns image results", async () => {
  const mockData = {
    searchParameters: { q: "cats", type: "images" },
    images: [{ title: "Cute Cat", imageUrl: "http://example.com/cat.jpg" }],
  };
  using _fetch = mockFetch(jsonResponse(mockData));

  const client = new SerperClient({ apiKey: "test-key" });
  const result = await client.searchImages("cats");

  assertEquals(result.images[0]?.title, "Cute Cat");
});

Deno.test("searchNews - returns news results", async () => {
  const mockData = {
    searchParameters: { q: "tech", type: "news" },
    news: [{ title: "New Tech", link: "http://example.com/news" }],
  };
  using _fetch = mockFetch(jsonResponse(mockData));

  const client = new SerperClient({ apiKey: "test-key" });
  const result = await client.searchNews("tech");

  assertEquals(result.news[0]?.title, "New Tech");
});

Deno.test("searchVideos - returns video results", async () => {
  const mockData = {
    searchParameters: { q: "deno tutorial", type: "videos" },
    videos: [{ title: "Deno 101", link: "http://youtube.com/watch?v=123" }],
  };
  using _fetch = mockFetch(jsonResponse(mockData));

  const client = new SerperClient({ apiKey: "test-key" });
  const result = await client.searchVideos("deno tutorial");

  assertEquals(result.videos[0]?.title, "Deno 101");
});

Deno.test("searchShopping - returns shopping results", async () => {
  const mockData = {
    searchParameters: { q: "shoes", type: "shopping" },
    shopping: [{ title: "Nike Shoes", price: "$100" }],
  };
  using _fetch = mockFetch(jsonResponse(mockData));

  const client = new SerperClient({ apiKey: "test-key" });
  const result = await client.searchShopping("shoes");

  assertEquals(result.shopping[0]?.title, "Nike Shoes");
});

Deno.test("searchMaps - returns places results", async () => {
  const mockData = {
    searchParameters: { q: "coffee", type: "places" },
    places: [{ title: "Coffee Shop", address: "123 Main St" }],
  };
  using _fetch = mockFetch(jsonResponse(mockData));

  const client = new SerperClient({ apiKey: "test-key" });
  const result = await client.searchMaps("coffee", { location: "New York" });

  assertEquals(result.places[0]?.title, "Coffee Shop");
});

Deno.test("searchPlaces - alias for searchMaps", async () => {
  const mockData = {
    searchParameters: { q: "coffee", type: "places" },
    places: [{ title: "Coffee Shop", address: "123 Main St" }],
  };
  using _fetch = mockFetch(jsonResponse(mockData));

  const client = new SerperClient({ apiKey: "test-key" });
  const result = await client.searchPlaces("coffee");

  assertEquals(result.places[0]?.title, "Coffee Shop");
});

Deno.test("getReviews - returns reviews results", async () => {
  const mockData = {
    searchParameters: { placeId: "123", type: "reviews" },
    reviews: [
      {
        rating: 5,
        date: "1 day ago",
        snippet: "Great place",
        user: { name: "John" },
      },
    ],
  };
  using _fetch = mockFetch(jsonResponse(mockData));

  const client = new SerperClient({ apiKey: "test-key" });
  const result = await client.getReviews({ placeId: "123" });

  assertEquals(result.reviews[0]?.user.name, "John");
  assertEquals(result.reviews[0]?.snippet, "Great place");
});

Deno.test("searchScholar - returns scholar results (organic)", async () => {
  const mockData = {
    searchParameters: { q: "AI", type: "scholar" },
    organic: [{ title: "AI Paper", link: "http://arxiv.org/123" }],
  };
  using _fetch = mockFetch(jsonResponse(mockData));

  const client = new SerperClient({ apiKey: "test-key" });
  const result = await client.searchScholar("AI");

  assertEquals(result.organic[0]?.title, "AI Paper");
});

Deno.test("searchPatents - returns patents results (organic)", async () => {
  const mockData = {
    searchParameters: { q: "patent", type: "patents" },
    organic: [{ title: "New Patent", link: "http://patents.google.com/123" }],
  };
  using _fetch = mockFetch(jsonResponse(mockData));

  const client = new SerperClient({ apiKey: "test-key" });
  const result = await client.searchPatents("patent");

  assertEquals(result.organic[0]?.title, "New Patent");
});

Deno.test("autocomplete - returns suggestions", async () => {
  const mockData = {
    searchParameters: { q: "deno", type: "autocomplete" },
    suggestions: [{ value: "deno deploy" }, { value: "deno runtime" }],
  };
  using _fetch = mockFetch(jsonResponse(mockData));

  const client = new SerperClient({ apiKey: "test-key" });
  const result = await client.autocomplete("deno");

  assertEquals(result.suggestions[0]?.value, "deno deploy");
});

// ========================================
// Empty Query Validation Tests
// ========================================

Deno.test("searchImages - throws on empty query", async () => {
  const client = new SerperClient({ apiKey: "test-key" });
  await assertRejects(
    () => client.searchImages(""),
    SerperValidationError,
    "Search query cannot be empty",
  );
});

Deno.test("searchNews - throws on empty query", async () => {
  const client = new SerperClient({ apiKey: "test-key" });
  await assertRejects(
    () => client.searchNews("   "),
    SerperValidationError,
    "Search query cannot be empty",
  );
});

Deno.test("searchVideos - throws on empty query", async () => {
  const client = new SerperClient({ apiKey: "test-key" });
  await assertRejects(
    () => client.searchVideos(""),
    SerperValidationError,
    "Search query cannot be empty",
  );
});

Deno.test("searchShopping - throws on empty query", async () => {
  const client = new SerperClient({ apiKey: "test-key" });
  await assertRejects(
    () => client.searchShopping(""),
    SerperValidationError,
    "Search query cannot be empty",
  );
});

Deno.test("searchMaps - throws on empty query", async () => {
  const client = new SerperClient({ apiKey: "test-key" });
  await assertRejects(
    () => client.searchMaps(""),
    SerperValidationError,
    "Search query cannot be empty",
  );
});

Deno.test("searchScholar - throws on empty query", async () => {
  const client = new SerperClient({ apiKey: "test-key" });
  await assertRejects(
    () => client.searchScholar(""),
    SerperValidationError,
    "Search query cannot be empty",
  );
});

Deno.test("searchPatents - throws on empty query", async () => {
  const client = new SerperClient({ apiKey: "test-key" });
  await assertRejects(
    () => client.searchPatents(""),
    SerperValidationError,
    "Search query cannot be empty",
  );
});

Deno.test("autocomplete - throws on empty query", async () => {
  const client = new SerperClient({ apiKey: "test-key" });
  await assertRejects(
    () => client.autocomplete(""),
    SerperValidationError,
    "Query cannot be empty",
  );
});

// ========================================
// Default Language Tests
// ========================================

Deno.test("search - applies default language from config", async () => {
  let capturedBody: string | null = null;
  const mockData = { searchParameters: { q: "test" }, organic: [] };

  using _fetch = mockFetch(async (req: Request) => {
    capturedBody = await req.text();
    return jsonResponse(mockData);
  });

  const client = new SerperClient({
    apiKey: "test-key",
    defaultLanguage: "de",
  });
  await client.search("test");

  const body = JSON.parse(capturedBody!);
  assertEquals(body.hl, "de");
});

// ========================================
// Error Handling Tests
// ========================================

Deno.test("search - handles non-JSON error response", async () => {
  using _fetch = mockFetch(
    new Response("Internal Server Error", {
      status: 500,
      headers: { "Content-Type": "text/plain" },
    }),
  );

  const client = new SerperClient({ apiKey: "test-key" });
  await assertRejects(
    () => client.search("test"),
    SerperServerError,
  );
});

Deno.test("getReviews - works with cid parameter", async () => {
  const mockData = {
    searchParameters: { cid: "123" },
    reviews: [{ rating: 5, snippet: "Great", user: { name: "Test" } }],
  };
  using _fetch = mockFetch(jsonResponse(mockData));

  const client = new SerperClient({ apiKey: "test-key" });
  const result = await client.getReviews({ cid: "123" });

  assertEquals(result.reviews[0]?.rating, 5);
});

Deno.test("getReviews - works with q parameter", async () => {
  const mockData = {
    searchParameters: { q: "coffee shop" },
    reviews: [{ rating: 4, snippet: "Nice", user: { name: "User" } }],
  };
  using _fetch = mockFetch(jsonResponse(mockData));

  const client = new SerperClient({ apiKey: "test-key" });
  const result = await client.getReviews({ q: "coffee shop" });

  assertEquals(result.reviews[0]?.rating, 4);
});
