/**
 * Unit tests for error handling.
 */

import {
  assertEquals,
  assertInstanceOf,
  assertRejects,
} from "https://deno.land/std@0.208.0/assert/mod.ts";
import {
  SerperAuthError,
  SerperClient,
  SerperError,
  SerperRateLimitError,
  SerperServerError,
  SerperValidationError,
} from "../mod.ts";
import { errorResponse, jsonResponse, mockFetch, mockSearchResult } from "./helpers.ts";

Deno.test("errors - 401 throws SerperAuthError", async () => {
  const restore = mockFetch(errorResponse("Invalid API key", 401));

  try {
    const client = new SerperClient({ apiKey: "bad-key" });

    await assertRejects(
      () => client.search("test"),
      SerperAuthError,
      "Invalid API key",
    );
  } finally {
    restore();
  }
});

Deno.test("errors - 429 throws SerperRateLimitError", async () => {
  const restore = mockFetch(errorResponse("Rate limit exceeded", 429));

  try {
    const client = new SerperClient({ apiKey: "test-key" });

    await assertRejects(() => client.search("test"), SerperRateLimitError);
  } finally {
    restore();
  }
});

Deno.test("errors - 400 throws SerperValidationError", async () => {
  const restore = mockFetch(errorResponse("Missing required parameter", 400));

  try {
    const client = new SerperClient({ apiKey: "test-key" });

    // Need to bypass client-side validation
    const restore2 = mockFetch(errorResponse("Missing required parameter", 400));
    try {
      await assertRejects(() => client.search("valid query"), SerperValidationError);
    } finally {
      restore2();
    }
  } finally {
    restore();
  }
});

Deno.test("errors - 500 throws SerperServerError", async () => {
  const restore = mockFetch(errorResponse("Internal server error", 500));

  try {
    const client = new SerperClient({ apiKey: "test-key" });

    await assertRejects(() => client.search("test"), SerperServerError);
  } finally {
    restore();
  }
});

Deno.test("errors - error inheritance chain is correct", () => {
  const authError = new SerperAuthError("test");
  const rateLimitError = new SerperRateLimitError("test");
  const validationError = new SerperValidationError("test");
  const serverError = new SerperServerError("test");

  // All extend SerperError
  assertInstanceOf(authError, SerperError);
  assertInstanceOf(rateLimitError, SerperError);
  assertInstanceOf(validationError, SerperError);
  assertInstanceOf(serverError, SerperError);

  // All extend Error
  assertInstanceOf(authError, Error);
  assertInstanceOf(rateLimitError, Error);
  assertInstanceOf(validationError, Error);
  assertInstanceOf(serverError, Error);
});

Deno.test("errors - status codes are set correctly", () => {
  const authError = new SerperAuthError("test");
  const rateLimitError = new SerperRateLimitError("test");
  const validationError = new SerperValidationError("test");
  const serverError = new SerperServerError("test");

  assertEquals(authError.status, 401);
  assertEquals(rateLimitError.status, 429);
  assertEquals(validationError.status, 400);
  assertEquals(serverError.status, 500);
});

Deno.test("errors - error names are correct", () => {
  const authError = new SerperAuthError("test");
  const rateLimitError = new SerperRateLimitError("test");
  const validationError = new SerperValidationError("test");
  const serverError = new SerperServerError("test");

  assertEquals(authError.name, "SerperAuthError");
  assertEquals(rateLimitError.name, "SerperRateLimitError");
  assertEquals(validationError.name, "SerperValidationError");
  assertEquals(serverError.name, "SerperServerError");
});

Deno.test("getReviews - throws when no identifier provided", async () => {
  const restore = mockFetch(jsonResponse(mockSearchResult()));

  try {
    const client = new SerperClient({ apiKey: "test-key" });

    await assertRejects(
      () => client.getReviews({}),
      SerperValidationError,
      "At least one of placeId, cid, or q is required",
    );
  } finally {
    restore();
  }
});
