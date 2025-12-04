/**
 * Unit tests for SerperClient construction and configuration.
 */

import { assertEquals, assertThrows } from "https://deno.land/std@0.208.0/assert/mod.ts";
import { SerperClient } from "../mod.ts";

Deno.test("SerperClient - requires API key", () => {
  assertThrows(
    () => new SerperClient({ apiKey: "" }),
    Error,
    "API key is required",
  );
});

Deno.test("SerperClient - accepts valid API key", () => {
  const client = new SerperClient({ apiKey: "test-api-key" });
  assertEquals(typeof client, "object");
});

Deno.test("SerperClient - accepts custom configuration", () => {
  const client = new SerperClient({
    apiKey: "test-key",
    baseUrl: "https://custom.api.com",
    defaultCountry: "us",
    defaultLanguage: "en",
    timeout: 60000,
  });
  assertEquals(typeof client, "object");
});

Deno.test("SerperClient - has all expected methods", () => {
  const client = new SerperClient({ apiKey: "test-key" });

  // Verify all public methods exist
  assertEquals(typeof client.search, "function");
  assertEquals(typeof client.searchImages, "function");
  assertEquals(typeof client.searchNews, "function");
  assertEquals(typeof client.searchVideos, "function");
  assertEquals(typeof client.searchShopping, "function");
  assertEquals(typeof client.searchMaps, "function");
  assertEquals(typeof client.searchPlaces, "function");
  assertEquals(typeof client.getReviews, "function");
  assertEquals(typeof client.searchScholar, "function");
  assertEquals(typeof client.searchPatents, "function");
  assertEquals(typeof client.autocomplete, "function");
});
