/**
 * Unit tests for search methods.
 */

import {
  assertEquals,
  assertExists,
  assertRejects,
} from "https://deno.land/std@0.208.0/assert/mod.ts";
import { SerperClient, SerperValidationError } from "../mod.ts";
import { jsonResponse, mockFetch, mockSearchResult } from "./helpers.ts";

Deno.test("search - returns organic results", async () => {
  using _fetch = mockFetch(jsonResponse(mockSearchResult()));
  const client = new SerperClient({ apiKey: "test-key" });
  const result = await client.search("test query");

  assertEquals(result.organic.length, 2);
  assertEquals(result.organic[0]?.title, "Test Result 1");
});

Deno.test("search - includes search parameters", async () => {
  using _fetch = mockFetch(jsonResponse(mockSearchResult()));
  const client = new SerperClient({ apiKey: "test-key" });
  const result = await client.search("test query");

  assertEquals(result.searchParameters.q, "test query");
  assertEquals(result.searchParameters.type, "search");
});

Deno.test("search - sends correct headers", async () => {
  let capturedHeaders: Headers | undefined;

  using _fetch = mockFetch((req) => {
    capturedHeaders = req.headers;
    return jsonResponse(mockSearchResult());
  });

  const client = new SerperClient({ apiKey: "test-key-123" });
  await client.search("test");

  assertEquals(capturedHeaders?.get("X-API-KEY"), "test-key-123");
  assertEquals(capturedHeaders?.get("Content-Type"), "application/json");
});

Deno.test("search - sends query in request body", async () => {
  let capturedBody: string | null = null;

  using _fetch = mockFetch(async (req: Request) => {
    capturedBody = await req.text();
    return jsonResponse(mockSearchResult());
  });

  const client = new SerperClient({ apiKey: "test-key" });
  await client.search("my search query");

  assertExists(capturedBody);
  const body = JSON.parse(capturedBody);
  assertEquals(body.q, "my search query");
});

Deno.test("search - applies default country from config", async () => {
  let capturedBody: string | null = null;

  using _fetch = mockFetch(async (req: Request) => {
    capturedBody = await req.text();
    return jsonResponse(mockSearchResult());
  });

  const client = new SerperClient({
    apiKey: "test-key",
    defaultCountry: "us",
  });
  await client.search("test");

  const body = JSON.parse(capturedBody!);
  assertEquals(body.gl, "us");
});

Deno.test("search - request options override defaults", async () => {
  let capturedBody: string | null = null;

  using _fetch = mockFetch(async (req: Request) => {
    capturedBody = await req.text();
    return jsonResponse(mockSearchResult());
  });

  const client = new SerperClient({
    apiKey: "test-key",
    defaultCountry: "us",
  });
  await client.search("test", { gl: "de" });

  const body = JSON.parse(capturedBody!);
  assertEquals(body.gl, "de");
});

Deno.test("search - throws on empty query", async () => {
  const client = new SerperClient({ apiKey: "test-key" });

  await assertRejects(
    () => client.search(""),
    SerperValidationError,
    "empty",
  );
});

Deno.test("search - throws on whitespace-only query", async () => {
  const client = new SerperClient({ apiKey: "test-key" });

  await assertRejects(
    () => client.search("   "),
    SerperValidationError,
    "empty",
  );
});
