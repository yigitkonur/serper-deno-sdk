# Serper SDK Supabase Edge Functions

Business-oriented Edge Functions demonstrating real-world use cases for the Serper Deno SDK.

## Available Functions

### 1. **serper-web-search**

General web search API endpoint.

**Use Case:** Search engine integration, content discovery

```bash
curl -X POST https://your-project.supabase.co/functions/v1/serper-web-search \
  -H "Content-Type: application/json" \
  -d '{"query": "best restaurants in San Francisco", "num": 10}'
```

### 2. **serper-news-aggregator**

Multi-topic news aggregation.

**Use Case:** News monitoring, content curation, market intelligence

```bash
curl -X POST https://your-project.supabase.co/functions/v1/serper-news-aggregator \
  -H "Content-Type: application/json" \
  -d '{"topics": ["AI technology", "cryptocurrency"], "num": 5}'
```

### 3. **serper-local-business-finder**

Find local businesses with optional reviews.

**Use Case:** Directory apps, local search, business discovery

```bash
curl -X POST https://your-project.supabase.co/functions/v1/serper-local-business-finder \
  -H "Content-Type: application/json" \
  -d '{"query": "coffee shops", "location": "San Francisco, CA", "includeReviews": true}'
```

### 4. **serper-product-research**

E-commerce product research with price comparison.

**Use Case:** Price monitoring, competitor analysis, product discovery

```bash
curl -X POST https://your-project.supabase.co/functions/v1/serper-product-research \
  -H "Content-Type: application/json" \
  -d '{"products": ["iPhone 15 Pro", "Samsung Galaxy S24"], "maxResults": 10}'
```

### 5. **serper-academic-search**

Academic paper discovery and research.

**Use Case:** Research platforms, citation tools, academic databases

```bash
curl -X POST https://your-project.supabase.co/functions/v1/serper-academic-search \
  -H "Content-Type: application/json" \
  -d '{"query": "machine learning", "yearFrom": 2020, "yearTo": 2024}'
```

### 6. **serper-bulk-search**

Batch processing for multiple search queries.

**Use Case:** SEO tools, market research, content analysis at scale

```bash
curl -X POST https://your-project.supabase.co/functions/v1/serper-bulk-search \
  -H "Content-Type: application/json" \
  -d '{
    "queries": [
      {"query": "best laptops 2024", "type": "search"},
      {"query": "AI news", "type": "news"},
      {"query": "restaurants NYC", "type": "places", "location": "New York, NY"}
    ]
  }'
```

## Setup

### 1. Install Supabase CLI

```bash
npm install -g supabase
```

### 2. Initialize Supabase (if not already done)

```bash
supabase init
```

### 3. Set Environment Variables

```bash
supabase secrets set SERPER_API_KEY=your_api_key_here
```

### 4. Deploy Functions

```bash
# Deploy all functions
supabase functions deploy

# Or deploy individually
supabase functions deploy serper-web-search
supabase functions deploy serper-news-aggregator
supabase functions deploy serper-local-business-finder
supabase functions deploy serper-product-research
supabase functions deploy serper-academic-search
supabase functions deploy serper-bulk-search
```

### 5. Test Locally

```bash
# Start local development
supabase start

# Serve a function locally
supabase functions serve serper-web-search --env-file ./supabase/.env.local

# Test it
curl -X POST http://localhost:54321/functions/v1/serper-web-search \
  -H "Content-Type: application/json" \
  -d '{"query": "test query"}'
```

## Environment Variables

Create `.env.local` in `supabase/` directory:

```
SERPER_API_KEY=your_serper_api_key_here
```

## Architecture Patterns

### CORS Handling

All functions include proper CORS headers for browser-based applications.

### Error Handling

Consistent error response format:

```json
{
  "error": "Error message here"
}
```

### Parallel Processing

Functions like `serper-news-aggregator` and `serper-bulk-search` use `Promise.all()` for efficient parallel API calls.

### Type Safety

All functions leverage the SDK's TypeScript types for compile-time safety.

## Business Use Cases

| Function              | Industry       | Use Case                              |
| --------------------- | -------------- | ------------------------------------- |
| web-search            | General        | Search integration, content discovery |
| news-aggregator       | Media          | News monitoring, content curation     |
| local-business-finder | Local Services | Directory apps, business discovery    |
| product-research      | E-commerce     | Price monitoring, competitor analysis |
| academic-search       | Education      | Research platforms, citation tools    |
| bulk-search           | SEO/Marketing  | Market research, content analysis     |

## Rate Limiting

Consider implementing rate limiting for production:

```typescript
// Example using Supabase Edge Function rate limiting
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_ANON_KEY")!,
);

// Check rate limit in your function
const { data, error } = await supabase.rpc("check_rate_limit", {
  user_id: userId,
  endpoint: "serper-web-search",
});
```

## Monitoring

View function logs:

```bash
supabase functions logs serper-web-search
```

## Cost Optimization

- Use caching for repeated queries
- Implement request batching with `serper-bulk-search`
- Set appropriate `maxResults` limits
- Monitor API usage via Serper dashboard

## Support

- SDK Documentation: https://jsr.io/@yigitkonur/serper-deno-sdk
- Serper API Docs: https://serper.dev/docs
- Supabase Docs: https://supabase.com/docs/guides/functions
