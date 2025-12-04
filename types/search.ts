/**
 * Web search types for the /search endpoint.
 * @module
 */

import type { BaseSearchOptions, BaseSearchResult } from "./common.ts";

/**
 * Options for web search endpoint.
 *
 * @example
 * ```ts
 * const options: SearchOptions = {
 *   gl: "us",
 *   hl: "en",
 *   num: 20,
 *   tbs: "qdr:d" // Past day
 * };
 * ```
 */
export interface SearchOptions extends BaseSearchOptions {
  /**
   * Time-based search filters (Google TBS parameter).
   *
   * Common values:
   * - `qdr:h` - Past hour
   * - `qdr:d` - Past day
   * - `qdr:w` - Past week
   * - `qdr:m` - Past month
   * - `qdr:y` - Past year
   *
   * @example "qdr:d" for past day, "qdr:w" for past week
   */
  tbs?: string;
}

/**
 * Knowledge Graph panel information.
 * Appears for entities like companies, people, places.
 *
 * @example
 * ```ts
 * if (result.knowledgeGraph) {
 *   console.log(result.knowledgeGraph.title);
 *   console.log(result.knowledgeGraph.description);
 * }
 * ```
 */
export interface KnowledgeGraph {
  /** Entity name/title (e.g., "OpenAI"). */
  readonly title: string;

  /** Entity type (e.g., "Company", "Person", "Place"). */
  readonly type?: string;

  /** Description text, usually from Wikipedia. */
  readonly description?: string;

  /** Source of the description (e.g., "Wikipedia"). */
  readonly descriptionSource?: string;

  /** URL to the description source. */
  readonly descriptionLink?: string;

  /** URL of an image associated with the entity. */
  readonly imageUrl?: string;

  /** Official website of the entity. */
  readonly website?: string;

  /**
   * Additional key-value attributes about the entity.
   * Examples: "Founded", "CEO", "Headquarters".
   */
  readonly attributes?: Readonly<Record<string, string>>;
}

/**
 * Answer box / featured snippet.
 * Appears for direct answer queries.
 *
 * Note: Structure varies based on query type (calculation, definition, etc.).
 *
 * @example
 * ```ts
 * if (result.answerBox) {
 *   console.log(result.answerBox.snippet || result.answerBox.answer);
 * }
 * ```
 */
export interface AnswerBox {
  /** Answer snippet text. */
  readonly snippet?: string;

  /** Direct answer (for calculations, definitions). */
  readonly answer?: string;

  /** Title of the source. */
  readonly title?: string;

  /** URL of the source. */
  readonly link?: string;

  /** Allow additional properties for varying answer box formats. */
  readonly [key: string]: unknown;
}

/**
 * Sitelink under an organic result.
 *
 * @example
 * ```ts
 * for (const sitelink of result.sitelinks ?? []) {
 *   console.log(sitelink.title, sitelink.link);
 * }
 * ```
 */
export interface Sitelink {
  /** Sitelink title. */
  readonly title: string;

  /** Sitelink URL. */
  readonly link: string;
}

/**
 * Single organic search result.
 *
 * @example
 * ```ts
 * for (const result of searchResult.organic) {
 *   console.log(`${result.position}. ${result.title}`);
 *   console.log(`   ${result.link}`);
 *   console.log(`   ${result.snippet}`);
 * }
 * ```
 */
export interface OrganicResult {
  /** Result title. */
  readonly title: string;

  /** Result URL. */
  readonly link: string;

  /** Text snippet with query context. */
  readonly snippet?: string;

  /** Position in results (1-based). */
  readonly position: number;

  /** Publication date if available. */
  readonly date?: string;

  /** Sitelinks under this result. */
  readonly sitelinks?: readonly Sitelink[];

  /**
   * Additional attributes (e.g., for Wikipedia: "Available in", "URL").
   */
  readonly attributes?: Readonly<Record<string, string>>;
}

/**
 * "People Also Ask" question and answer.
 *
 * @example
 * ```ts
 * for (const paa of result.peopleAlsoAsk ?? []) {
 *   console.log(`Q: ${paa.question}`);
 *   console.log(`A: ${paa.snippet}`);
 * }
 * ```
 */
export interface PeopleAlsoAsk {
  /** The question that was asked. */
  readonly question: string;

  /** A snippet of the answer. */
  readonly snippet?: string;

  /** Title of the source page. */
  readonly title?: string;

  /** URL of the source page. */
  readonly link?: string;
}

/**
 * Related search suggestion.
 *
 * @example
 * ```ts
 * for (const related of result.relatedSearches ?? []) {
 *   console.log(`Related: ${related.query}`);
 * }
 * ```
 */
export interface RelatedSearch {
  /** Suggested query. */
  readonly query: string;
}

/**
 * Top story in news carousel.
 *
 * @example
 * ```ts
 * for (const story of result.topStories ?? []) {
 *   console.log(`${story.source}: ${story.title}`);
 * }
 * ```
 */
export interface TopStory {
  /** Story headline. */
  readonly title: string;

  /** Story URL. */
  readonly link: string;

  /** News source name. */
  readonly source: string;

  /** Publication date/time. */
  readonly date?: string;

  /** Thumbnail image URL. */
  readonly imageUrl?: string;
}

/**
 * Complete web search result from /search endpoint.
 *
 * Includes organic results plus optional SERP features like
 * Knowledge Graph, Answer Box, People Also Ask, etc.
 *
 * @example
 * ```ts
 * const result: SearchResult = await client.search("OpenAI");
 *
 * // Access organic results
 * for (const item of result.organic) {
 *   console.log(item.title, item.link);
 * }
 *
 * // Check for Knowledge Graph
 * if (result.knowledgeGraph) {
 *   console.log(result.knowledgeGraph.description);
 * }
 *
 * // Check for Answer Box
 * if (result.answerBox) {
 *   console.log(result.answerBox.snippet);
 * }
 * ```
 */
export interface SearchResult extends BaseSearchResult {
  /** Knowledge Graph panel if present. */
  readonly knowledgeGraph?: KnowledgeGraph;

  /** Answer box / featured snippet if present. */
  readonly answerBox?: AnswerBox;

  /** Organic search results. */
  readonly organic: readonly OrganicResult[];

  /** People Also Ask questions. */
  readonly peopleAlsoAsk?: readonly PeopleAlsoAsk[];

  /** Related search suggestions. */
  readonly relatedSearches?: readonly RelatedSearch[];

  /** Top stories carousel if present. */
  readonly topStories?: readonly TopStory[];
}
