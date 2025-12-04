/**
 * Test helper utilities for mocking fetch and creating responses.
 * @module
 */

/**
 * Mocks globalThis.fetch with a custom response.
 * Returns a cleanup function to restore the original fetch.
 *
 * @param response - Response to return, or a function that returns a Response
 * @returns Object with Symbol.dispose to restore original fetch
 */
export function mockFetch(
  response: Response | ((req: Request) => Response | Promise<Response>),
): { [Symbol.dispose]: () => void } {
  const originalFetch = globalThis.fetch;

  globalThis.fetch = async (
    input: RequestInfo | URL,
    init?: RequestInit,
  ): Promise<Response> => {
    if (typeof response === "function") {
      const request = new Request(input, init);
      return await response(request);
    }
    return response.clone();
  };

  return {
    [Symbol.dispose]: () => {
      globalThis.fetch = originalFetch;
    },
  };
}

/**
 * Creates a mock JSON Response.
 *
 * @param data - Data to serialize as JSON
 * @param status - HTTP status code (default 200)
 * @returns Response object
 */
export function jsonResponse<T>(data: T, status: number = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

/**
 * Creates a mock error Response.
 *
 * @param message - Error message
 * @param status - HTTP status code
 * @returns Response object
 */
export function errorResponse(message: string, status: number): Response {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

/**
 * Creates a mock search result for testing.
 */
export function mockSearchResult(): Record<string, unknown> {
  return {
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
    relatedSearches: [{ query: "related query 1" }],
  };
}
