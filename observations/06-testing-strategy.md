# Testing Strategy: Serper.dev SDK

**Date:** 2024-12-04
**Framework:** Deno built-in test runner
**Goal:** 100% coverage of public API, edge cases, and error paths

---

## Test Organization

```
tests/
├── client_test.ts          # Client construction & configuration
├── search_test.ts          # Web search endpoint
├── images_test.ts          # Image search endpoint
├── news_test.ts            # News search endpoint
├── videos_test.ts          # Video search endpoint
├── shopping_test.ts        # Shopping search endpoint
├── maps_test.ts            # Maps/places search endpoint
├── reviews_test.ts         # Reviews endpoint
├── scholar_test.ts         # Scholar search endpoint
├── patents_test.ts         # Patents search endpoint
├── autocomplete_test.ts    # Autocomplete endpoint
├── errors_test.ts          # Error handling & edge cases
├── types_test.ts           # Type validation (compile-time checks)
└── integration_test.ts     # Live API tests (optional, requires key)
```

---

## Testing Approach

### Mock Strategy

All unit tests mock `globalThis.fetch` to:

1. Avoid real API calls in tests
2. Simulate various response scenarios
3. Test error handling paths
4. Run fast without network

```typescript
// Helper to create mock fetch
function mockFetch(response: Response | (() => Response)): () => void {
  const originalFetch = globalThis.fetch;

  globalThis.fetch = async (): Promise<Response> => {
    return typeof response === "function" ? response() : response;
  };

  return () => {
    globalThis.fetch = originalFetch;
  };
}

// Usage in test
Deno.test("search returns organic results", async () => {
  const restore = mockFetch(
    new Response(JSON.stringify({
      searchParameters: { q: "test", type: "search", engine: "google" },
      organic: [{ title: "Result 1", link: "https://example.com", position: 1 }],
    })),
  );

  try {
    const client = new SerperClient({ apiKey: "test-key" });
    const result = await client.search("test");
    assertEquals(result.organic.length, 1);
  } finally {
    restore();
  }
});
```

---

## Test Categories

### 1. Client Construction Tests

```typescript
// tests/client_test.ts

import { assertEquals, assertThrows } from "https://deno.land/std@0.200.0/testing/asserts.ts";
import { SerperClient } from "../mod.ts";

Deno.test("client construction - requires API key", () => {
  assertThrows(
    () => new SerperClient({ apiKey: "" }),
    Error,
    "API key is required",
  );
});

Deno.test("client construction - accepts valid API key", () => {
  const client = new SerperClient({ apiKey: "test-api-key" });
  // Should not throw
  assertEquals(typeof client, "object");
});

Deno.test("client construction - uses default base URL", () => {
  const client = new SerperClient({ apiKey: "test-key" });
  // Internal assertion - we verify by testing actual requests
});

Deno.test("client construction - accepts custom base URL", () => {
  const client = new SerperClient({
    apiKey: "test-key",
    baseUrl: "https://custom.api.com",
  });
  // Verify by mocking and checking request URL
});

Deno.test("client construction - accepts default country/language", () => {
  const client = new SerperClient({
    apiKey: "test-key",
    defaultCountry: "us",
    defaultLanguage: "en",
  });
  // Should not throw
});

Deno.test("client construction - accepts custom timeout", () => {
  const client = new SerperClient({
    apiKey: "test-key",
    timeout: 60000,
  });
  // Should not throw
});
```

### 2. Search Endpoint Tests

```typescript
// tests/search_test.ts

import {
  assertEquals,
  assertExists,
  assertRejects,
} from "https://deno.land/std@0.200.0/testing/asserts.ts";
import { SerperClient } from "../mod.ts";
import type { SearchResult } from "../mod.ts";

// Mock response fixture
const mockSearchResponse: SearchResult = {
  searchParameters: {
    q: "test query",
    type: "search",
    engine: "google",
  },
  organic: [
    {
      title: "Test Result 1",
      link: "https://example.com/1",
      snippet: "This is a test snippet",
      position: 1,
    },
    {
      title: "Test Result 2",
      link: "https://example.com/2",
      snippet: "Another test snippet",
      position: 2,
    },
  ],
  relatedSearches: [
    { query: "related query 1" },
  ],
};

Deno.test("search - returns organic results", async () => {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async () => new Response(JSON.stringify(mockSearchResponse));

  try {
    const client = new SerperClient({ apiKey: "test-key" });
    const result = await client.search("test query");

    assertEquals(result.organic.length, 2);
    assertEquals(result.organic[0].title, "Test Result 1");
    assertEquals(result.organic[0].position, 1);
  } finally {
    globalThis.fetch = originalFetch;
  }
});

Deno.test("search - includes search parameters in response", async () => {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async () => new Response(JSON.stringify(mockSearchResponse));

  try {
    const client = new SerperClient({ apiKey: "test-key" });
    const result = await client.search("test query");

    assertExists(result.searchParameters);
    assertEquals(result.searchParameters.q, "test query");
  } finally {
    globalThis.fetch = originalFetch;
  }
});

Deno.test("search - sends correct headers", async () => {
  let capturedHeaders: Headers | null = null;

  const originalFetch = globalThis.fetch;
  globalThis.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
    capturedHeaders = new Headers(init?.headers);
    return new Response(JSON.stringify(mockSearchResponse));
  };

  try {
    const client = new SerperClient({ apiKey: "test-api-key" });
    await client.search("test");

    assertExists(capturedHeaders);
    assertEquals(capturedHeaders!.get("X-API-KEY"), "test-api-key");
    assertEquals(capturedHeaders!.get("Content-Type"), "application/json");
  } finally {
    globalThis.fetch = originalFetch;
  }
});

Deno.test("search - sends query in request body", async () => {
  let capturedBody: string | null = null;

  const originalFetch = globalThis.fetch;
  globalThis.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
    capturedBody = init?.body as string;
    return new Response(JSON.stringify(mockSearchResponse));
  };

  try {
    const client = new SerperClient({ apiKey: "test-key" });
    await client.search("my search query");

    assertExists(capturedBody);
    const body = JSON.parse(capturedBody);
    assertEquals(body.q, "my search query");
  } finally {
    globalThis.fetch = originalFetch;
  }
});

Deno.test("search - applies default country from client config", async () => {
  let capturedBody: string | null = null;

  const originalFetch = globalThis.fetch;
  globalThis.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
    capturedBody = init?.body as string;
    return new Response(JSON.stringify(mockSearchResponse));
  };

  try {
    const client = new SerperClient({
      apiKey: "test-key",
      defaultCountry: "us",
    });
    await client.search("test");

    const body = JSON.parse(capturedBody!);
    assertEquals(body.gl, "us");
  } finally {
    globalThis.fetch = originalFetch;
  }
});

Deno.test("search - request options override defaults", async () => {
  let capturedBody: string | null = null;

  const originalFetch = globalThis.fetch;
  globalThis.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
    capturedBody = init?.body as string;
    return new Response(JSON.stringify(mockSearchResponse));
  };

  try {
    const client = new SerperClient({
      apiKey: "test-key",
      defaultCountry: "us",
    });
    await client.search("test", { gl: "de" });

    const body = JSON.parse(capturedBody!);
    assertEquals(body.gl, "de");
  } finally {
    globalThis.fetch = originalFetch;
  }
});

Deno.test("search - handles empty query gracefully", async () => {
  const client = new SerperClient({ apiKey: "test-key" });

  await assertRejects(
    () => client.search(""),
    Error,
    "empty",
  );
});
```

### 3. Error Handling Tests

```typescript
// tests/errors_test.ts

import { assertInstanceOf, assertRejects } from "https://deno.land/std@0.200.0/testing/asserts.ts";
import {
  SerperAuthError,
  SerperClient,
  SerperError,
  SerperRateLimitError,
  SerperServerError,
  SerperValidationError,
} from "../mod.ts";

Deno.test("errors - 401 throws SerperAuthError", async () => {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async () => {
    return new Response('{"error": "Invalid API key"}', { status: 401 });
  };

  try {
    const client = new SerperClient({ apiKey: "bad-key" });

    await assertRejects(
      () => client.search("test"),
      SerperAuthError,
      "Invalid API key",
    );
  } finally {
    globalThis.fetch = originalFetch;
  }
});

Deno.test("errors - 429 throws SerperRateLimitError", async () => {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async () => {
    return new Response('{"error": "Rate limit exceeded"}', { status: 429 });
  };

  try {
    const client = new SerperClient({ apiKey: "test-key" });

    await assertRejects(
      () => client.search("test"),
      SerperRateLimitError,
    );
  } finally {
    globalThis.fetch = originalFetch;
  }
});

Deno.test("errors - 400 throws SerperValidationError", async () => {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async () => {
    return new Response('{"error": "Missing required parameter"}', { status: 400 });
  };

  try {
    const client = new SerperClient({ apiKey: "test-key" });

    await assertRejects(
      () => client.search("test"),
      SerperValidationError,
    );
  } finally {
    globalThis.fetch = originalFetch;
  }
});

Deno.test("errors - 500 throws SerperServerError", async () => {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async () => {
    return new Response('{"error": "Internal server error"}', { status: 500 });
  };

  try {
    const client = new SerperClient({ apiKey: "test-key" });

    await assertRejects(
      () => client.search("test"),
      SerperServerError,
    );
  } finally {
    globalThis.fetch = originalFetch;
  }
});

Deno.test("errors - timeout throws SerperServerError", async () => {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async () => {
    // Simulate never resolving
    await new Promise(() => {});
    return new Response();
  };

  try {
    const client = new SerperClient({
      apiKey: "test-key",
      timeout: 100, // Very short timeout
    });

    await assertRejects(
      () => client.search("test"),
      SerperServerError,
      "timeout",
    );
  } finally {
    globalThis.fetch = originalFetch;
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
```

### 4. Other Endpoint Tests Pattern

Each endpoint follows similar pattern:

```typescript
// tests/images_test.ts

import { assertEquals, assertExists } from "https://deno.land/std@0.200.0/testing/asserts.ts";
import { SerperClient } from "../mod.ts";
import type { ImageSearchResult } from "../mod.ts";

const mockImageResponse: ImageSearchResult = {
  searchParameters: { q: "test", type: "images", engine: "google" },
  images: [
    {
      title: "Test Image",
      imageUrl: "https://example.com/image.jpg",
      thumbnailUrl: "https://example.com/thumb.jpg",
      imageWidth: 1920,
      imageHeight: 1080,
      thumbnailWidth: 160,
      thumbnailHeight: 90,
      source: "Example",
      domain: "example.com",
      link: "https://example.com/page",
      googleUrl: "https://google.com/imgres?...",
      position: 1,
    },
  ],
};

Deno.test("searchImages - returns image results", async () => {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async () => new Response(JSON.stringify(mockImageResponse));

  try {
    const client = new SerperClient({ apiKey: "test-key" });
    const result = await client.searchImages("test");

    assertEquals(result.images.length, 1);
    assertEquals(result.images[0].title, "Test Image");
    assertExists(result.images[0].imageUrl);
  } finally {
    globalThis.fetch = originalFetch;
  }
});

Deno.test("searchImages - sends correct endpoint", async () => {
  let capturedUrl: string | null = null;

  const originalFetch = globalThis.fetch;
  globalThis.fetch = async (input: RequestInfo | URL) => {
    capturedUrl = input.toString();
    return new Response(JSON.stringify(mockImageResponse));
  };

  try {
    const client = new SerperClient({ apiKey: "test-key" });
    await client.searchImages("test");

    assertExists(capturedUrl);
    assertEquals(capturedUrl!.endsWith("/images"), true);
  } finally {
    globalThis.fetch = originalFetch;
  }
});

Deno.test("searchImages - includes safe search option", async () => {
  let capturedBody: string | null = null;

  const originalFetch = globalThis.fetch;
  globalThis.fetch = async (_: RequestInfo | URL, init?: RequestInit) => {
    capturedBody = init?.body as string;
    return new Response(JSON.stringify(mockImageResponse));
  };

  try {
    const client = new SerperClient({ apiKey: "test-key" });
    await client.searchImages("test", { safe: "active" });

    const body = JSON.parse(capturedBody!);
    assertEquals(body.safe, "active");
  } finally {
    globalThis.fetch = originalFetch;
  }
});
```

### 5. Reviews Endpoint Tests (Special Case)

```typescript
// tests/reviews_test.ts

import { assertEquals, assertRejects } from "https://deno.land/std@0.200.0/testing/asserts.ts";
import { SerperClient, SerperValidationError } from "../mod.ts";

Deno.test("getReviews - requires at least one identifier", async () => {
  const client = new SerperClient({ apiKey: "test-key" });

  await assertRejects(
    () => client.getReviews({}),
    SerperValidationError,
    "At least one of placeId, cid, or q is required",
  );
});

Deno.test("getReviews - accepts placeId", async () => {
  let capturedBody: string | null = null;

  const originalFetch = globalThis.fetch;
  globalThis.fetch = async (_: RequestInfo | URL, init?: RequestInit) => {
    capturedBody = init?.body as string;
    return new Response(JSON.stringify({
      searchParameters: {},
      reviews: [],
    }));
  };

  try {
    const client = new SerperClient({ apiKey: "test-key" });
    await client.getReviews({ placeId: "ChIJ123" });

    const body = JSON.parse(capturedBody!);
    assertEquals(body.placeId, "ChIJ123");
  } finally {
    globalThis.fetch = originalFetch;
  }
});

Deno.test("getReviews - accepts cid", async () => {
  let capturedBody: string | null = null;

  const originalFetch = globalThis.fetch;
  globalThis.fetch = async (_: RequestInfo | URL, init?: RequestInit) => {
    capturedBody = init?.body as string;
    return new Response(JSON.stringify({
      searchParameters: {},
      reviews: [],
    }));
  };

  try {
    const client = new SerperClient({ apiKey: "test-key" });
    await client.getReviews({ cid: "12345" });

    const body = JSON.parse(capturedBody!);
    assertEquals(body.cid, "12345");
  } finally {
    globalThis.fetch = originalFetch;
  }
});

Deno.test("getReviews - accepts q", async () => {
  let capturedBody: string | null = null;

  const originalFetch = globalThis.fetch;
  globalThis.fetch = async (_: RequestInfo | URL, init?: RequestInit) => {
    capturedBody = init?.body as string;
    return new Response(JSON.stringify({
      searchParameters: {},
      reviews: [],
    }));
  };

  try {
    const client = new SerperClient({ apiKey: "test-key" });
    await client.getReviews({ q: "Starbucks NYC" });

    const body = JSON.parse(capturedBody!);
    assertEquals(body.q, "Starbucks NYC");
  } finally {
    globalThis.fetch = originalFetch;
  }
});
```

---

## Integration Tests (Optional)

```typescript
// tests/integration_test.ts

/**
 * Integration tests that call the real Serper API.
 * Requires SERPER_API_KEY environment variable.
 * Run with: deno test --allow-env --allow-net tests/integration_test.ts
 */

import { assertEquals, assertExists } from "https://deno.land/std@0.200.0/testing/asserts.ts";
import { SerperClient } from "../mod.ts";

const apiKey = Deno.env.get("SERPER_API_KEY");

// Skip if no API key
const describeIntegration = apiKey ? Deno.test : Deno.test.ignore;

describeIntegration("integration - search returns results", async () => {
  const client = new SerperClient({ apiKey: apiKey! });
  const result = await client.search("Deno runtime", { num: 3 });

  assertExists(result.organic);
  assertEquals(result.organic.length > 0, true);
  assertEquals(result.searchParameters.q, "Deno runtime");
});

describeIntegration("integration - searchImages returns images", async () => {
  const client = new SerperClient({ apiKey: apiKey! });
  const result = await client.searchImages("sunset", { num: 3 });

  assertExists(result.images);
  assertEquals(result.images.length > 0, true);
});

describeIntegration("integration - autocomplete returns suggestions", async () => {
  const client = new SerperClient({ apiKey: apiKey! });
  const result = await client.autocomplete("how to ");

  assertExists(result.suggestions);
  assertEquals(result.suggestions.length > 0, true);
});
```

---

## Documentation Tests

```typescript
// Run with: deno test --doc mod.ts

/**
 * Deno's --doc flag validates that code examples in JSDoc compile and run.
 * All @example blocks are tested automatically.
 */
```

---

## Test Coverage

### Running Coverage

```bash
# Run tests with coverage
deno test --coverage=coverage

# Generate HTML report
deno coverage coverage --html

# Generate lcov report for CI
deno coverage coverage --lcov > coverage.lcov
```

### Coverage Goals

| Area                | Target             |
| ------------------- | ------------------ |
| Client construction | 100%               |
| Public methods      | 100%               |
| Error handling      | 100%               |
| Edge cases          | 90%+               |
| Type exports        | N/A (compile-time) |

---

## Test Helpers

```typescript
// tests/helpers.ts

/**
 * Helper to mock fetch with a specific response.
 * Returns a cleanup function to restore original fetch.
 */
export function mockFetch(
  response: Response | ((req: Request) => Response),
): () => void {
  const originalFetch = globalThis.fetch;

  globalThis.fetch = async (
    input: RequestInfo | URL,
    init?: RequestInit,
  ): Promise<Response> => {
    if (typeof response === "function") {
      const request = new Request(input, init);
      return response(request);
    }
    return response.clone();
  };

  return () => {
    globalThis.fetch = originalFetch;
  };
}

/**
 * Creates a mock Response with JSON body.
 */
export function jsonResponse<T>(data: T, status: number = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

/**
 * Creates a mock error Response.
 */
export function errorResponse(message: string, status: number): Response {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}
```

---

## CI Configuration

```yaml
# .github/workflows/test.yml

name: Tests

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - uses: denoland/setup-deno@v1
        with:
          deno-version: v2.x

      - name: Check formatting
        run: deno fmt --check

      - name: Lint
        run: deno lint

      - name: Type check
        run: deno check mod.ts

      - name: Documentation lint
        run: deno doc --lint mod.ts

      - name: Unit tests
        run: deno test --allow-env

      - name: Documentation tests
        run: deno test --doc

      - name: Coverage
        run: |
          deno test --coverage=coverage --allow-env
          deno coverage coverage --lcov > coverage.lcov

      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          files: coverage.lcov
```

---

## Test Checklist

### Before Each Release

- [ ] All unit tests pass
- [ ] All doc tests pass
- [ ] Coverage meets threshold (90%+)
- [ ] No lint warnings
- [ ] Type check passes
- [ ] Integration tests pass (if API key available)

### For Each New Feature

- [ ] Add unit tests for happy path
- [ ] Add unit tests for error cases
- [ ] Add JSDoc with @example
- [ ] Verify example in @example works
- [ ] Update coverage report
