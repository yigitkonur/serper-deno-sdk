/**
 * Serper.dev API client implementation.
 * @module
 */

import type {
  AutocompleteOptions,
  AutocompleteResult,
  ImageSearchOptions,
  ImageSearchResult,
  MapsSearchOptions,
  MapsSearchResult,
  NewsSearchOptions,
  NewsSearchResult,
  PatentsSearchOptions,
  PatentsSearchResult,
  ReviewsOptions,
  ReviewsResult,
  ScholarSearchOptions,
  ScholarSearchResult,
  SearchOptions,
  SearchResult,
  SerperClientOptions,
  ShoppingSearchOptions,
  ShoppingSearchResult,
  VideoSearchOptions,
  VideoSearchResult,
} from "../types/mod.ts";

import {
  SerperAuthError,
  SerperRateLimitError,
  SerperServerError,
  SerperValidationError,
} from "./errors.ts";

import { BASE_URL, DEFAULT_TIMEOUT } from "./constants.ts";

/**
 * Serper.dev API client for Google Search.
 *
 * Provides type-safe access to all Serper.dev endpoints including
 * web search, images, news, videos, shopping, maps, scholar, and patents.
 *
 * @example Basic usage
 * ```ts
 * import { SerperClient } from "@serper/deno-sdk";
 *
 * const client = new SerperClient({
 *   apiKey: Deno.env.get("SERPER_API_KEY")!
 * });
 *
 * const results = await client.search("TypeScript");
 * console.log(results.organic[0].title);
 * ```
 *
 * @example With configuration
 * ```ts
 * const client = new SerperClient({
 *   apiKey: "your-api-key",
 *   defaultCountry: "us",
 *   defaultLanguage: "en",
 *   timeout: 60000
 * });
 * ```
 *
 * @example In Supabase Edge Function
 * ```ts
 * import { SerperClient } from "@serper/deno-sdk";
 *
 * const client = new SerperClient({
 *   apiKey: Deno.env.get("SERPER_API_KEY")!
 * });
 *
 * Deno.serve(async (req) => {
 *   const { q } = await req.json();
 *   const results = await client.search(q);
 *   return Response.json(results);
 * });
 * ```
 */
export class SerperClient {
  /** Private API key - never exposed. */
  readonly #apiKey: string;

  /** Base URL for API requests. */
  readonly #baseUrl: string;

  /** Default country code for searches. */
  readonly #defaultCountry?: string;

  /** Default language code for searches. */
  readonly #defaultLanguage?: string;

  /** Request timeout in milliseconds. */
  readonly #timeout: number;

  /**
   * Creates a new Serper client instance.
   *
   * @param options - Client configuration options
   * @throws {Error} If API key is not provided or invalid
   *
   * @example Using environment variable
   * ```ts
   * const client = new SerperClient({
   *   apiKey: Deno.env.get("SERPER_API_KEY")!
   * });
   * ```
   */
  constructor(options: SerperClientOptions) {
    if (!options.apiKey) {
      throw new Error("API key is required. Get one at https://serper.dev");
    }

    this.#apiKey = options.apiKey;
    this.#baseUrl = options.baseUrl ?? BASE_URL;
    this.#defaultCountry = options.defaultCountry;
    this.#defaultLanguage = options.defaultLanguage;
    this.#timeout = options.timeout ?? DEFAULT_TIMEOUT;
  }

  /**
   * Performs a Google web search.
   *
   * Returns organic results, knowledge graph, answer boxes,
   * "People Also Ask" questions, and related searches.
   *
   * @param query - Search query string
   * @param options - Optional search parameters
   * @returns Search results with organic listings and SERP features
   * @throws {SerperValidationError} When query is empty or invalid
   * @throws {SerperAuthError} When API key is invalid
   * @throws {SerperRateLimitError} When rate limit is exceeded
   * @throws {SerperServerError} When server has an issue
   *
   * @example Basic search
   * ```ts
   * const results = await client.search("Deno runtime");
   * console.log(results.organic[0].title);
   * ```
   *
   * @example With options
   * ```ts
   * const results = await client.search("news today", {
   *   gl: "us",
   *   hl: "en",
   *   num: 20,
   *   tbs: "qdr:d"
   * });
   * ```
   */
  async search(query: string, options?: SearchOptions): Promise<SearchResult> {
    if (!query || query.trim().length === 0) {
      throw new SerperValidationError("Search query cannot be empty");
    }
    return await this.#request<SearchResult>("/search", { q: query.trim(), ...options });
  }

  /**
   * Searches Google Images.
   *
   * @param query - Image search query
   * @param options - Optional search parameters
   * @returns Image search results with thumbnails and metadata
   * @throws {SerperValidationError} When query is empty
   * @throws {SerperAuthError} When API key is invalid
   * @throws {SerperRateLimitError} When rate limit is exceeded
   *
   * @example
   * ```ts
   * const images = await client.searchImages("mountain landscape", {
   *   num: 15,
   *   safe: "active"
   * });
   * for (const img of images.images) {
   *   console.log(img.imageUrl);
   * }
   * ```
   */
  async searchImages(query: string, options?: ImageSearchOptions): Promise<ImageSearchResult> {
    if (!query || query.trim().length === 0) {
      throw new SerperValidationError("Search query cannot be empty");
    }
    return await this.#request<ImageSearchResult>("/images", { q: query.trim(), ...options });
  }

  /**
   * Searches Google News.
   *
   * @param query - News search query
   * @param options - Optional search parameters
   * @returns News article results
   * @throws {SerperValidationError} When query is empty
   * @throws {SerperAuthError} When API key is invalid
   * @throws {SerperRateLimitError} When rate limit is exceeded
   *
   * @example
   * ```ts
   * const news = await client.searchNews("AI technology", { gl: "us" });
   * for (const article of news.news) {
   *   console.log(`${article.source}: ${article.title}`);
   * }
   * ```
   */
  async searchNews(query: string, options?: NewsSearchOptions): Promise<NewsSearchResult> {
    if (!query || query.trim().length === 0) {
      throw new SerperValidationError("Search query cannot be empty");
    }
    return await this.#request<NewsSearchResult>("/news", { q: query.trim(), ...options });
  }

  /**
   * Searches Google Videos.
   *
   * @param query - Video search query
   * @param options - Optional search parameters
   * @returns Video search results
   * @throws {SerperValidationError} When query is empty
   * @throws {SerperAuthError} When API key is invalid
   * @throws {SerperRateLimitError} When rate limit is exceeded
   *
   * @example
   * ```ts
   * const videos = await client.searchVideos("TypeScript tutorial");
   * console.log(videos.videos[0].duration);
   * ```
   */
  async searchVideos(query: string, options?: VideoSearchOptions): Promise<VideoSearchResult> {
    if (!query || query.trim().length === 0) {
      throw new SerperValidationError("Search query cannot be empty");
    }
    return await this.#request<VideoSearchResult>("/videos", { q: query.trim(), ...options });
  }

  /**
   * Searches Google Shopping for products.
   *
   * @param query - Product search query
   * @param options - Optional search parameters
   * @returns Shopping/product results with prices
   * @throws {SerperValidationError} When query is empty
   * @throws {SerperAuthError} When API key is invalid
   * @throws {SerperRateLimitError} When rate limit is exceeded
   *
   * @example
   * ```ts
   * const products = await client.searchShopping("wireless headphones");
   * for (const item of products.shopping) {
   *   console.log(`${item.title}: ${item.price}`);
   * }
   * ```
   */
  async searchShopping(
    query: string,
    options?: ShoppingSearchOptions,
  ): Promise<ShoppingSearchResult> {
    if (!query || query.trim().length === 0) {
      throw new SerperValidationError("Search query cannot be empty");
    }
    return await this.#request<ShoppingSearchResult>("/shopping", { q: query.trim(), ...options });
  }

  /**
   * Searches Google Maps for local businesses and places.
   *
   * @param query - Place/business search query
   * @param options - Optional search parameters including location
   * @returns Local place results with ratings and details
   * @throws {SerperValidationError} When query is empty
   * @throws {SerperAuthError} When API key is invalid
   * @throws {SerperRateLimitError} When rate limit is exceeded
   *
   * @example
   * ```ts
   * const places = await client.searchMaps("coffee shops", {
   *   location: "San Francisco, CA"
   * });
   * for (const place of places.places) {
   *   console.log(`${place.title} - ${place.rating}⭐`);
   * }
   * ```
   */
  async searchMaps(query: string, options?: MapsSearchOptions): Promise<MapsSearchResult> {
    if (!query || query.trim().length === 0) {
      throw new SerperValidationError("Search query cannot be empty");
    }
    return await this.#request<MapsSearchResult>("/maps", { q: query.trim(), ...options });
  }

  /**
   * Searches Google Places (alias for searchMaps).
   *
   * @param query - Place/business search query
   * @param options - Optional search parameters
   * @returns Local place results
   * @throws {SerperValidationError} When query is empty
   * @throws {SerperAuthError} When API key is invalid
   *
   * @example
   * ```ts
   * const places = await client.searchPlaces("restaurants", {
   *   location: "New York, NY"
   * });
   * ```
   */
  async searchPlaces(query: string, options?: MapsSearchOptions): Promise<MapsSearchResult> {
    return await this.searchMaps(query, options);
  }

  /**
   * Retrieves reviews for a specific place.
   *
   * At least one of `placeId`, `cid`, or `q` must be provided.
   * Using `placeId` is recommended for accuracy.
   *
   * @param options - Place identifier and review options
   * @returns Place reviews
   * @throws {SerperValidationError} When no place identifier is provided
   * @throws {SerperAuthError} When API key is invalid
   * @throws {SerperRateLimitError} When rate limit is exceeded
   *
   * @example Using Place ID (recommended)
   * ```ts
   * const reviews = await client.getReviews({
   *   placeId: "ChIJxxxxxxxxxxxxxxxxx",
   *   limit: 10
   * });
   * for (const review of reviews.reviews) {
   *   console.log(`${review.author}: ${review.rating}⭐`);
   * }
   * ```
   *
   * @example Using place name
   * ```ts
   * const reviews = await client.getReviews({
   *   q: "Starbucks Times Square",
   *   limit: 5
   * });
   * ```
   */
  async getReviews(options: ReviewsOptions): Promise<ReviewsResult> {
    if (!options.placeId && !options.cid && !options.q) {
      throw new SerperValidationError(
        "At least one of placeId, cid, or q is required for reviews",
      );
    }
    return await this.#request<ReviewsResult>("/reviews", { ...options });
  }

  /**
   * Searches Google Scholar for academic publications.
   *
   * @param query - Academic search query
   * @param options - Optional parameters including year filters
   * @returns Scholar search results with papers
   * @throws {SerperValidationError} When query is empty
   * @throws {SerperAuthError} When API key is invalid
   * @throws {SerperRateLimitError} When rate limit is exceeded
   *
   * @example
   * ```ts
   * const papers = await client.searchScholar("machine learning", {
   *   as_ylo: 2020,
   *   num: 10
   * });
   * for (const paper of papers.scholar) {
   *   console.log(paper.title, paper.publicationInfo);
   * }
   * ```
   */
  async searchScholar(
    query: string,
    options?: ScholarSearchOptions,
  ): Promise<ScholarSearchResult> {
    if (!query || query.trim().length === 0) {
      throw new SerperValidationError("Search query cannot be empty");
    }
    return await this.#request<ScholarSearchResult>("/scholar", { q: query.trim(), ...options });
  }

  /**
   * Searches Google Patents.
   *
   * @param query - Patent search query
   * @param options - Optional search parameters
   * @returns Patent search results
   * @throws {SerperValidationError} When query is empty
   * @throws {SerperAuthError} When API key is invalid
   * @throws {SerperRateLimitError} When rate limit is exceeded
   *
   * @example
   * ```ts
   * const patents = await client.searchPatents("solar panel efficiency");
   * for (const patent of patents.patents) {
   *   console.log(patent.patentNumber, patent.title);
   * }
   * ```
   */
  async searchPatents(
    query: string,
    options?: PatentsSearchOptions,
  ): Promise<PatentsSearchResult> {
    if (!query || query.trim().length === 0) {
      throw new SerperValidationError("Search query cannot be empty");
    }
    return await this.#request<PatentsSearchResult>("/patents", { q: query.trim(), ...options });
  }

  /**
   * Gets Google Search autocomplete suggestions.
   *
   * @param query - Partial query for suggestions
   * @param options - Optional parameters
   * @returns Autocomplete suggestions
   * @throws {SerperValidationError} When query is empty
   * @throws {SerperAuthError} When API key is invalid
   * @throws {SerperRateLimitError} When rate limit is exceeded
   *
   * @example
   * ```ts
   * const suggestions = await client.autocomplete("how to le");
   * console.log(suggestions.suggestions);
   * // ["how to learn programming", "how to learn python", ...]
   * ```
   */
  async autocomplete(query: string, options?: AutocompleteOptions): Promise<AutocompleteResult> {
    if (!query || query.trim().length === 0) {
      throw new SerperValidationError("Query cannot be empty");
    }
    return await this.#request<AutocompleteResult>("/autocomplete", {
      q: query.trim(),
      ...options,
    });
  }

  /**
   * Internal method to make API requests.
   *
   * @internal
   */
  async #request<T>(endpoint: string, body: Record<string, unknown>): Promise<T> {
    // Apply defaults
    const requestBody: Record<string, unknown> = {
      ...body,
    };

    // Apply default country/language if not specified in request
    if (this.#defaultCountry && !requestBody.gl) {
      requestBody.gl = this.#defaultCountry;
    }
    if (this.#defaultLanguage && !requestBody.hl) {
      requestBody.hl = this.#defaultLanguage;
    }

    // Remove undefined values
    const cleanBody = Object.fromEntries(
      Object.entries(requestBody).filter(([_, v]) => v !== undefined),
    );

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.#timeout);

    try {
      const response = await fetch(`${this.#baseUrl}${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-API-KEY": this.#apiKey,
        },
        body: JSON.stringify(cleanBody),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        await this.#handleError(response);
      }

      const data: unknown = await response.json();
      return data as T;
    } catch (error) {
      clearTimeout(timeoutId);

      // Handle abort/timeout
      if (error instanceof Error && error.name === "AbortError") {
        throw new SerperServerError(
          `Request timeout after ${this.#timeout}ms. Consider increasing timeout.`,
        );
      }

      // Re-throw Serper errors as-is
      if (
        error instanceof SerperAuthError ||
        error instanceof SerperRateLimitError ||
        error instanceof SerperValidationError ||
        error instanceof SerperServerError
      ) {
        throw error;
      }

      // Wrap unknown errors
      throw new SerperServerError(
        `Network error: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  }

  /**
   * Handles error responses from the API.
   *
   * @internal
   */
  async #handleError(response: Response): Promise<never> {
    let errorMessage: string;

    try {
      const errorBody = (await response.json()) as { error?: string };
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
}
