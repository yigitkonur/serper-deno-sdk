# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.0.0] - 2024-12-04

### Added

- Initial release of @serper/deno-sdk
- `SerperClient` class with secure API key handling
- Complete TypeScript type definitions for all endpoints

### Endpoints

- `search()` - Google Web Search with Knowledge Graph, Answer Box support
- `searchImages()` - Google Image Search
- `searchNews()` - Google News Search
- `searchVideos()` - Google Video Search
- `searchShopping()` - Google Shopping Search
- `searchMaps()` - Google Maps / Local Search
- `searchPlaces()` - Alias for Maps Search
- `getReviews()` - Google Place Reviews
- `searchScholar()` - Google Scholar Search
- `searchPatents()` - Google Patents Search
- `autocomplete()` - Google Search Suggestions

### Error Handling

- `SerperError` - Base error class
- `SerperAuthError` - Authentication errors (401)
- `SerperRateLimitError` - Rate limit errors (429)
- `SerperValidationError` - Validation errors (400)
- `SerperServerError` - Server errors (500+)

### Features

- Zero dependencies - uses only Web standard APIs
- Supabase Edge Functions compatible
- Comprehensive JSDoc documentation
- Full test coverage
- JSR publishing ready

[Unreleased]: https://github.com/serper/deno-sdk/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/serper/deno-sdk/releases/tag/v1.0.0
