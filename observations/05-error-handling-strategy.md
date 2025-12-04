# Error Handling Strategy: Serper.dev SDK

**Date:** 2024-12-04
**Philosophy:** Explicit errors with rich context, no silent failures

---

## Error Hierarchy

```
SerperError (base)
├── SerperAuthError        (401)
├── SerperRateLimitError   (429)
├── SerperValidationError  (400)
└── SerperServerError      (500+)
```

---

## Error Class Definitions

### Base Error: `SerperError`

````typescript
/**
 * Base error class for all Serper SDK errors.
 * Extends native Error with additional context.
 *
 * @example Catching all Serper errors
 * ```ts
 * try {
 *   await client.search("query");
 * } catch (error) {
 *   if (error instanceof SerperError) {
 *     console.error(`Serper error: ${error.message} (status: ${error.status})`);
 *   }
 * }
 * ```
 */
export class SerperError extends Error {
  /** HTTP status code from the API response */
  readonly status?: number;

  /** Original error if this wraps another error */
  readonly cause?: Error;

  constructor(message: string, status?: number, cause?: Error) {
    super(message);
    this.name = "SerperError";
    this.status = status;
    this.cause = cause;

    // Ensure proper prototype chain in ES5 environments
    Object.setPrototypeOf(this, SerperError.prototype);
  }
}
````

### Authentication Error: `SerperAuthError`

````typescript
/**
 * Thrown when API authentication fails.
 *
 * **Common causes:**
 * - Missing API key
 * - Invalid API key
 * - Expired API key
 * - API key lacks required permissions
 *
 * **Resolution:**
 * 1. Verify API key is correct
 * 2. Check key hasn't expired at serper.dev dashboard
 * 3. Ensure key is passed in X-API-KEY header
 *
 * @example Handling auth errors
 * ```ts
 * try {
 *   await client.search("query");
 * } catch (error) {
 *   if (error instanceof SerperAuthError) {
 *     console.error("Check your API key!");
 *   }
 * }
 * ```
 */
export class SerperAuthError extends SerperError {
  constructor(message: string = "Invalid or missing API key") {
    super(message, 401);
    this.name = "SerperAuthError";
    Object.setPrototypeOf(this, SerperAuthError.prototype);
  }
}
````

### Rate Limit Error: `SerperRateLimitError`

````typescript
/**
 * Thrown when rate limit or quota is exceeded.
 *
 * **Common causes:**
 * - Too many requests per second (>300 QPS default)
 * - Monthly quota exhausted
 * - Burst of requests exceeded plan limits
 *
 * **Resolution:**
 * 1. Implement request throttling
 * 2. Check remaining quota at serper.dev dashboard
 * 3. Upgrade plan if needed
 * 4. Implement exponential backoff for retries
 *
 * @example Handling rate limits
 * ```ts
 * try {
 *   await client.search("query");
 * } catch (error) {
 *   if (error instanceof SerperRateLimitError) {
 *     // Wait and retry
 *     await new Promise(r => setTimeout(r, 1000));
 *     await client.search("query");
 *   }
 * }
 * ```
 */
export class SerperRateLimitError extends SerperError {
  constructor(message: string = "Rate limit exceeded or quota depleted") {
    super(message, 429);
    this.name = "SerperRateLimitError";
    Object.setPrototypeOf(this, SerperRateLimitError.prototype);
  }
}
````

### Validation Error: `SerperValidationError`

````typescript
/**
 * Thrown when request parameters are invalid.
 *
 * **Common causes:**
 * - Missing required parameter (e.g., `q` for search)
 * - Invalid parameter value
 * - Malformed request body
 *
 * **Resolution:**
 * 1. Check required parameters are provided
 * 2. Validate parameter types and values
 * 3. Review API documentation for correct format
 *
 * @example Handling validation errors
 * ```ts
 * try {
 *   await client.search("");  // Empty query
 * } catch (error) {
 *   if (error instanceof SerperValidationError) {
 *     console.error("Invalid search parameters:", error.message);
 *   }
 * }
 * ```
 */
export class SerperValidationError extends SerperError {
  constructor(message: string = "Invalid request parameters") {
    super(message, 400);
    this.name = "SerperValidationError";
    Object.setPrototypeOf(this, SerperValidationError.prototype);
  }
}
````

### Server Error: `SerperServerError`

````typescript
/**
 * Thrown when Serper.dev servers have an issue.
 *
 * **Common causes:**
 * - Serper.dev service outage
 * - Temporary server overload
 * - Network connectivity issues
 * - Request timeout
 *
 * **Resolution:**
 * 1. Retry the request after a delay
 * 2. Check Serper.dev status page
 * 3. Implement circuit breaker pattern for production
 *
 * @example Handling server errors
 * ```ts
 * try {
 *   await client.search("query");
 * } catch (error) {
 *   if (error instanceof SerperServerError) {
 *     console.error("Serper service issue, retrying...");
 *     await new Promise(r => setTimeout(r, 2000));
 *     // Retry logic...
 *   }
 * }
 * ```
 */
export class SerperServerError extends SerperError {
  constructor(message: string = "Server error") {
    super(message, 500);
    this.name = "SerperServerError";
    Object.setPrototypeOf(this, SerperServerError.prototype);
  }
}
````

---

## HTTP Status to Error Mapping

| Status Code | Error Class             | Description                          |
| ----------- | ----------------------- | ------------------------------------ |
| 400         | `SerperValidationError` | Bad request - invalid parameters     |
| 401         | `SerperAuthError`       | Unauthorized - bad API key           |
| 403         | `SerperAuthError`       | Forbidden - insufficient permissions |
| 429         | `SerperRateLimitError`  | Rate limit or quota exceeded         |
| 500         | `SerperServerError`     | Internal server error                |
| 502         | `SerperServerError`     | Bad gateway                          |
| 503         | `SerperServerError`     | Service unavailable                  |
| 504         | `SerperServerError`     | Gateway timeout                      |
| Other 4xx   | `SerperValidationError` | Client error                         |
| Other 5xx   | `SerperServerError`     | Server error                         |

---

## Error Handling Implementation

### In Client Class

```typescript
/**
 * Handles error responses from the API.
 * Maps HTTP status codes to appropriate error classes.
 */
async #handleError(response: Response): Promise<never> {
  let errorMessage: string;
  
  try {
    const errorBody = await response.json() as { error?: string };
    errorMessage = errorBody.error ?? response.statusText;
  } catch {
    // Response body wasn't valid JSON
    errorMessage = response.statusText || `HTTP ${response.status}`;
  }

  const status = response.status;

  // Map status codes to error classes
  if (status === 401 || status === 403) {
    throw new SerperAuthError(errorMessage);
  }
  
  if (status === 429) {
    throw new SerperRateLimitError(errorMessage);
  }
  
  if (status >= 400 && status < 500) {
    throw new SerperValidationError(errorMessage);
  }
  
  // 500+ or other unexpected status
  throw new SerperServerError(`${status}: ${errorMessage}`);
}
```

### Timeout Handling

```typescript
async #request<T>(endpoint: string, body: Record<string, unknown>): Promise<T> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), this.#timeout);

  try {
    const response = await fetch(`${this.#baseUrl}${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-KEY": this.#apiKey,
      },
      body: JSON.stringify(body),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      await this.#handleError(response);
    }

    return await response.json() as T;
  } catch (error) {
    clearTimeout(timeoutId);
    
    if (error instanceof Error && error.name === "AbortError") {
      throw new SerperServerError(
        `Request timeout after ${this.#timeout}ms. Consider increasing timeout.`
      );
    }
    
    // Re-throw Serper errors as-is
    if (error instanceof SerperError) {
      throw error;
    }
    
    // Wrap unknown errors
    throw new SerperServerError(
      `Network error: ${error instanceof Error ? error.message : "Unknown error"}`,
      undefined,
      error instanceof Error ? error : undefined
    );
  }
}
```

---

## Edge Cases

### 1. Empty Query Validation

```typescript
async search(query: string, options?: SearchOptions): Promise<SearchResult> {
  // Pre-validate query
  if (!query || query.trim().length === 0) {
    throw new SerperValidationError("Search query cannot be empty");
  }
  
  return this.#request<SearchResult>("/search", { q: query.trim(), ...options });
}
```

### 2. Reviews Identifier Validation

```typescript
async getReviews(options: ReviewsOptions): Promise<ReviewsResult> {
  // At least one identifier required
  if (!options.placeId && !options.cid && !options.q) {
    throw new SerperValidationError(
      "At least one of placeId, cid, or q is required for reviews"
    );
  }
  
  return this.#request<ReviewsResult>("/reviews", options);
}
```

### 3. Invalid Constructor Arguments

```typescript
constructor(options: SerperClientOptions) {
  if (!options) {
    throw new Error("SerperClientOptions is required");
  }
  
  if (!options.apiKey) {
    throw new Error(
      "API key is required. Get one at https://serper.dev"
    );
  }
  
  if (options.apiKey.length < 10) {
    throw new Error("API key appears to be invalid (too short)");
  }
  
  if (options.timeout !== undefined && options.timeout < 0) {
    throw new Error("Timeout must be a positive number");
  }
  
  // ... initialization
}
```

---

## Error Message Guidelines

Following Deno style guide:

1. **Sentence case** - Start with capital letter
2. **No trailing period** - Unless multiple sentences
3. **Include relevant info** - Status codes, parameter names
4. **Actionable when possible** - Suggest resolution

### Good Error Messages

```typescript
// Good: Clear, actionable
throw new SerperAuthError("API key is invalid. Verify at https://serper.dev/dashboard");

// Good: Specific issue
throw new SerperValidationError("Parameter 'num' must be between 1 and 100, got 150");

// Good: Context included
throw new SerperServerError(`Request to /search failed after 3 retries: ${response.status}`);
```

### Bad Error Messages (Avoid)

```typescript
// Bad: Too vague
throw new SerperError("Error");

// Bad: No context
throw new SerperValidationError("Invalid");

// Bad: Developer-facing only
throw new SerperError("ECONNRESET at 0x7fff...");
```

---

## User-Facing Error Handling Patterns

### Pattern 1: Try-Catch with Type Checking

```typescript
import {
  SerperAuthError,
  SerperClient,
  SerperError,
  SerperRateLimitError,
  SerperServerError,
  SerperValidationError,
} from "@serper/sdk";

try {
  const result = await client.search("query");
  console.log(result);
} catch (error) {
  if (error instanceof SerperAuthError) {
    // Log and alert team - API key issue
    console.error("Authentication failed:", error.message);
  } else if (error instanceof SerperRateLimitError) {
    // Queue for retry with backoff
    console.warn("Rate limited, queuing for retry");
  } else if (error instanceof SerperValidationError) {
    // User input issue - show to user
    console.error("Invalid search:", error.message);
  } else if (error instanceof SerperServerError) {
    // Retry or fallback
    console.error("Service issue:", error.message);
  } else if (error instanceof SerperError) {
    // Generic Serper error
    console.error("Serper error:", error.message);
  } else {
    // Unexpected error
    throw error;
  }
}
```

### Pattern 2: Error-First Result Type

```typescript
type Result<T> = { ok: true; data: T } | { ok: false; error: SerperError };

async function safeSearch(
  client: SerperClient,
  query: string,
): Promise<Result<SearchResult>> {
  try {
    const data = await client.search(query);
    return { ok: true, data };
  } catch (error) {
    if (error instanceof SerperError) {
      return { ok: false, error };
    }
    return { ok: false, error: new SerperServerError(String(error)) };
  }
}

// Usage
const result = await safeSearch(client, "query");
if (result.ok) {
  console.log(result.data.organic[0]);
} else {
  console.error(result.error.message);
}
```

### Pattern 3: Retry with Exponential Backoff

```typescript
async function searchWithRetry(
  client: SerperClient,
  query: string,
  maxRetries: number = 3,
): Promise<SearchResult> {
  let lastError: Error;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await client.search(query);
    } catch (error) {
      lastError = error as Error;

      // Don't retry auth or validation errors
      if (
        error instanceof SerperAuthError ||
        error instanceof SerperValidationError
      ) {
        throw error;
      }

      // Retry rate limit and server errors
      if (
        error instanceof SerperRateLimitError ||
        error instanceof SerperServerError
      ) {
        const delay = Math.pow(2, attempt) * 1000; // 1s, 2s, 4s
        await new Promise((r) => setTimeout(r, delay));
        continue;
      }

      throw error;
    }
  }

  throw lastError!;
}
```

---

## Supabase Edge Function Example

```typescript
import { serve } from "https://deno.land/std@0.200.0/http/server.ts";
import {
  SerperAuthError,
  SerperClient,
  SerperRateLimitError,
  SerperValidationError,
} from "@serper/sdk";

const client = new SerperClient({
  apiKey: Deno.env.get("SERPER_API_KEY")!,
});

serve(async (req: Request) => {
  try {
    const { query } = await req.json();
    const results = await client.search(query);

    return new Response(JSON.stringify(results), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    // Map SDK errors to appropriate HTTP responses
    if (error instanceof SerperValidationError) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (error instanceof SerperAuthError) {
      return new Response(JSON.stringify({ error: "Service configuration error" }), {
        status: 500, // Don't expose auth details to client
        headers: { "Content-Type": "application/json" },
      });
    }

    if (error instanceof SerperRateLimitError) {
      return new Response(JSON.stringify({ error: "Service temporarily unavailable" }), {
        status: 503,
        headers: {
          "Content-Type": "application/json",
          "Retry-After": "60",
        },
      });
    }

    // Server error or unknown
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});
```

---

## Testing Error Scenarios

```typescript
// tests/errors_test.ts

import { assertEquals, assertRejects } from "https://deno.land/std@0.200.0/testing/asserts.ts";
import { SerperAuthError, SerperClient, SerperRateLimitError } from "../mod.ts";

Deno.test("throws SerperAuthError on 401", async () => {
  const client = new SerperClient({ apiKey: "invalid-key" });

  // Mock fetch to return 401
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async () => {
    return new Response('{"error": "Invalid API key"}', { status: 401 });
  };

  await assertRejects(
    () => client.search("test"),
    SerperAuthError,
    "Invalid API key",
  );

  globalThis.fetch = originalFetch;
});

Deno.test("throws SerperRateLimitError on 429", async () => {
  const client = new SerperClient({ apiKey: "test-key" });

  const originalFetch = globalThis.fetch;
  globalThis.fetch = async () => {
    return new Response('{"error": "Rate limit exceeded"}', { status: 429 });
  };

  await assertRejects(
    () => client.search("test"),
    SerperRateLimitError,
  );

  globalThis.fetch = originalFetch;
});
```

---

## Security Considerations

1. **Never log API key** - Even in error messages
2. **Redact sensitive data** - Strip credentials from stack traces
3. **Don't expose internal errors** - Map to safe external messages
4. **Validate input early** - Before making API calls

```typescript
// BAD: Leaks API key in error
throw new Error(`Request failed with key ${this.#apiKey}`);

// GOOD: No sensitive data
throw new SerperAuthError("Request failed: authentication error");
```
