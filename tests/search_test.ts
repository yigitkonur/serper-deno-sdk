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
  const restore = mockFetch(jsonResponse(mockSearchResult()));

  try {
    const client = new SerperClient({ apiKey: "test-key" });
    const result = await client.search("test query");

    assertEquals(result.organic.length, 2);
    assertEquals(result.organic[0]?.title, "Test Result 1");
    assertEquals(result.organic[0]?.position, 1);
  } finally {
    restore();
  }
});

Deno.test("search - includes search parameters", async () => {
  const restore = mockFetch(jsonResponse(mockSearchResult()));

  try {
    const client = new SerperClient({ apiKey: "test-key" });
    const result = await client.search("test query");

    assertExists(result.searchParameters);
    assertEquals(result.searchParameters.q, "test query");
    assertEquals(result.searchParameters.type, "search");
  } finally {
    restore();
  }
});

Deno.test("search - sends correct headers", async () => {
  let apiKeyHeader = "";
  let contentTypeHeader = "";

  const restore = mockFetch((req: Request) => {
    apiKeyHeader = req.headers.get("X-API-KEY") ?? "";
    contentTypeHeader = req.headers.get("Content-Type") ?? "";
    return jsonResponse(mockSearchResult());
  });

  try {
    const client = new SerperClient({ apiKey: "test-api-key" });
    await client.search("test");

    assertEquals(apiKeyHeader, "test-api-key");
    assertEquals(contentTypeHeader, "application/json");
  } finally {
    restore();
  }
});

Deno.test("search - sends query in request body", async () => {
  let capturedBody: string | null = null;

  const restore = mockFetch(async (req: Request) => {
    capturedBody = await req.text();
    return jsonResponse(mockSearchResult());
  });

  try {
    const client = new SerperClient({ apiKey: "test-key" });
    await client.search("my search query");

    assertExists(capturedBody);
    const body = JSON.parse(capturedBody);
    assertEquals(body.q, "my search query");
  } finally {
    restore();
  }
});

Deno.test("search - applies default country from config", async () => {
  let capturedBody: string | null = null;

  const restore = mockFetch(async (req: Request) => {
    capturedBody = await req.text();
    return jsonResponse(mockSearchResult());
  });

  try {
    const client = new SerperClient({
      apiKey: "test-key",
      defaultCountry: "us",
    });
    await client.search("test");

    const body = JSON.parse(capturedBody!);
    assertEquals(body.gl, "us");
  } finally {
    restore();
  }
});

Deno.test("search - request options override defaults", async () => {
  let capturedBody: string | null = null;

  const restore = mockFetch(async (req: Request) => {
    capturedBody = await req.text();
    return jsonResponse(mockSearchResult());
  });

  try {
    const client = new SerperClient({
      apiKey: "test-key",
      defaultCountry: "us",
    });
    await client.search("test", { gl: "de" });

    const body = JSON.parse(capturedBody!);
    assertEquals(body.gl, "de");
  } finally {
    restore();
  }
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
