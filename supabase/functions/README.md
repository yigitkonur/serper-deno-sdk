# Serper SDK Edge Functions

10 granular Edge Functions for each Serper API endpoint.

## Setup

```bash
# Link project
supabase link --project-ref <your-project-ref>

# Set API key (already set if using existing project)
supabase secrets set SERPER_API_KEY=<your-key>

# Deploy all (no JWT verification)
supabase functions deploy --no-verify-jwt
```

## Functions

Base URL: `https://dugggxrwvfakrzmnlfif.supabase.co/functions/v1/`

### Web Search

```bash
curl -X POST https://dugggxrwvfakrzmnlfif.supabase.co/functions/v1/serper-web-search \
  -H "Content-Type: application/json" \
  -d '{"query": "TypeScript Deno", "num": 10}'
```

### Image Search

```bash
curl -X POST https://dugggxrwvfakrzmnlfif.supabase.co/functions/v1/serper-image-search \
  -H "Content-Type: application/json" \
  -d '{"query": "mountain sunset", "num": 5}'
```

### News Search

```bash
curl -X POST https://dugggxrwvfakrzmnlfif.supabase.co/functions/v1/serper-news-search \
  -H "Content-Type: application/json" \
  -d '{"query": "AI technology", "num": 10}'
```

### Video Search

```bash
curl -X POST https://dugggxrwvfakrzmnlfif.supabase.co/functions/v1/serper-video-search \
  -H "Content-Type: application/json" \
  -d '{"query": "TypeScript tutorial", "num": 5}'
```

### Shopping Search

```bash
curl -X POST https://dugggxrwvfakrzmnlfif.supabase.co/functions/v1/serper-shopping-search \
  -H "Content-Type: application/json" \
  -d '{"query": "wireless headphones", "num": 10}'
```

### Maps/Places Search

```bash
curl -X POST https://dugggxrwvfakrzmnlfif.supabase.co/functions/v1/serper-maps-search \
  -H "Content-Type: application/json" \
  -d '{"query": "coffee", "location": "San Francisco, CA", "num": 5}'
```

### Reviews (requires placeId from Maps)

```bash
curl -X POST https://dugggxrwvfakrzmnlfif.supabase.co/functions/v1/serper-reviews \
  -H "Content-Type: application/json" \
  -d '{"placeId": "ChIJI4d_BLFqkFQRO0yT9N6-MhM", "limit": 10}'
```

### Scholar Search

```bash
curl -X POST https://dugggxrwvfakrzmnlfif.supabase.co/functions/v1/serper-scholar-search \
  -H "Content-Type: application/json" \
  -d '{"query": "machine learning", "as_ylo": 2022, "num": 10}'
```

### Patents Search

```bash
curl -X POST https://dugggxrwvfakrzmnlfif.supabase.co/functions/v1/serper-patents-search \
  -H "Content-Type: application/json" \
  -d '{"query": "electric vehicle battery", "num": 10}'
```

### Autocomplete

```bash
curl -X POST https://dugggxrwvfakrzmnlfif.supabase.co/functions/v1/serper-autocomplete \
  -H "Content-Type: application/json" \
  -d '{"query": "how to learn"}'
```

## Parameters

| Param               | Description                      | Endpoints          |
| ------------------- | -------------------------------- | ------------------ |
| `query`             | Search term (required)           | All except reviews |
| `num`               | Number of results (default: 10)  | All except reviews |
| `gl`                | Country code (e.g., "us")        | All                |
| `hl`                | Language code (e.g., "en")       | All                |
| `location`          | Location for geo-specific search | maps               |
| `placeId`           | Google Place ID (required)       | reviews            |
| `limit`             | Max reviews to return            | reviews            |
| `as_ylo` / `as_yhi` | Year range                       | scholar            |
| `safe`              | Safe search ("active"/"off")     | images             |

## Local Development

```bash
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
