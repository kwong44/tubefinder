# Tech Stack Decision Document

## Overview
This document explains the technology choices for Tube Finder and the reasoning behind each decision.

## Frontend Framework: Next.js 14

### Why Next.js?
1. **Server-Side Rendering (SSR)**: Better SEO for surf spot pages
2. **API Routes**: Built-in backend capabilities without separate server
3. **Performance**: Automatic code splitting, image optimization
4. **Developer Experience**: Hot reload, TypeScript support, great documentation
5. **Deployment**: Optimized for Vercel (free hosting)

### Alternatives Considered
- **React SPA**: Lacks SSR, would need separate backend
- **Vue/Nuxt**: Smaller ecosystem for mapping libraries
- **Svelte/SvelteKit**: Less mature ecosystem

## Mapping Library: Leaflet

### Why Leaflet?
1. **Free & Open Source**: No API keys or usage limits
2. **Lightweight**: ~40KB minified
3. **Flexible**: Easy to add custom layers and overlays
4. **Plugin Ecosystem**: Many community plugins for weather overlays
5. **React Integration**: Well-supported via react-leaflet

### Alternatives Considered
- **Mapbox GL JS**: Requires API key, has rate limits (though generous free tier)
- **Google Maps**: Expensive, requires API key
- **OpenLayers**: More powerful but steeper learning curve

## Database: PostgreSQL + PostGIS (via Supabase)

### Why PostgreSQL with PostGIS?
1. **Geospatial Queries**: PostGIS extension for radius searches, distance calculations
2. **SQL Standard**: Mature, reliable, well-documented
3. **Supabase**: Managed hosting with free tier (500MB storage)
4. **Real-time**: Supabase provides real-time subscriptions out of the box

### Example Geospatial Query
```sql
-- Find all spots within 50km of a location
SELECT * FROM spots
WHERE ST_DWithin(
  location::geography,
  ST_SetSRID(ST_MakePoint(longitude, latitude), 4326)::geography,
  50000
);
```

### Alternatives Considered
- **MongoDB**: Lacks mature geospatial support compared to PostGIS
- **Firebase**: More expensive, less flexible for complex queries

## Caching: Redis (Upstash)

### Why Redis?
1. **Fast**: In-memory data store, <1ms latency
2. **Serverless-Compatible**: Upstash designed for edge functions
3. **Free Tier**: 10,000 requests/day
4. **TTL Support**: Automatic expiration of cached data
5. **Rate Limiting**: Built-in support

### Cache Strategy
```typescript
// Cache forecast data for 6 hours
const cacheKey = `forecast:${lat}:${lng}`;
const ttl = 6 * 60 * 60; // 6 hours in seconds

// Cache buoy data for 1 hour (more dynamic)
const buoyCacheKey = `buoy:${stationId}`;
const buoyTtl = 60 * 60; // 1 hour
```

## UI Framework: Tailwind CSS + shadcn/ui

### Why Tailwind CSS?
1. **Utility-First**: Rapid development, less context switching
2. **Responsive**: Mobile-first by default
3. **Tree-Shaking**: Only includes used classes in production
4. **Consistency**: Design tokens prevent style drift

### Why shadcn/ui?
1. **Copy-Paste Components**: Own the code, not a dependency
2. **Accessible**: Built on Radix UI primitives
3. **Customizable**: Full control over styling
4. **Modern**: Follows current React patterns

## State Management: Zustand + React Query

### Why Zustand?
1. **Simple API**: Less boilerplate than Redux
2. **Small**: ~1KB minified
3. **No Context Provider**: Works outside React
4. **DevTools**: Debugging support

### Why React Query?
1. **Data Fetching**: Built-in caching, refetching, error handling
2. **Optimistic Updates**: Better UX for mutations
3. **Background Sync**: Auto-refresh stale data
4. **Perfect for APIs**: Designed for REST/GraphQL data

### Usage Example
```typescript
// Zustand for UI state
const useMapStore = create((set) => ({
  center: [0, 115],
  zoom: 5,
  setCenter: (center) => set({ center }),
}));

// React Query for API data
const { data, isLoading } = useQuery({
  queryKey: ['forecast', lat, lng],
  queryFn: () => fetchForecast(lat, lng),
  staleTime: 6 * 60 * 60 * 1000, // 6 hours
});
```

## API Data Sources

### Open-Meteo Marine API
**Why?**
- 100% free, no API key
- 10,000 requests/day (plenty for MVP)
- Global coverage
- Reliable uptime
- 7-day forecasts

**Data Provided:**
- Wave height, period, direction
- Swell data
- Sea surface temperature

### NOAA NDBC (National Data Buoy Center)
**Why?**
- Free, public data
- Real-time observations
- High accuracy
- Historical data available

**Coverage:**
- Strong in Pacific (near Philippines)
- Atlantic coverage
- Some buoys in Southeast Asia

**Data Provided:**
- Wind speed/direction
- Wave height/period
- Water temperature
- Air temperature
- Pressure

## Hosting & Deployment

### Vercel (Frontend)
**Why?**
1. **Optimized for Next.js**: Created by same team
2. **Free Tier**: Generous limits for hobby projects
3. **Global CDN**: Fast load times worldwide
4. **Auto-Deploy**: Git integration, preview deployments
5. **Edge Functions**: Run code close to users

### Supabase (Database)
**Why?**
1. **Free Tier**: 500MB database, 2GB bandwidth
2. **PostgreSQL**: Standard SQL database
3. **PostGIS**: Built-in geospatial extension
4. **Auth**: Built-in authentication (for future features)
5. **Real-time**: WebSocket subscriptions

### Upstash (Redis Cache)
**Why?**
1. **Serverless**: Works with Vercel edge functions
2. **Free Tier**: 10,000 requests/day
3. **Global**: Low latency worldwide
4. **REST API**: Easy integration

## Development Tools

### TypeScript
- Type safety prevents runtime errors
- Better IDE support
- Self-documenting code
- Easier refactoring

### ESLint + Prettier
- Code quality and consistency
- Automatic formatting
- Catch bugs early

### Vitest (Testing)
- Fast unit tests
- Jest-compatible API
- Native ESM support

## Estimated Monthly Costs

| Service | Free Tier | Estimated Usage | Cost |
|---------|-----------|-----------------|------|
| Vercel | 100GB bandwidth | ~10GB | $0 |
| Supabase | 500MB DB, 2GB bandwidth | ~200MB, ~1GB | $0 |
| Upstash | 10K requests/day | ~5K/day | $0 |
| Open-Meteo | 10K requests/day | ~1K/day | $0 |
| NOAA NDBC | Unlimited | Variable | $0 |
| **Total** | | | **$0/month** |

## Scalability Considerations

### When to Upgrade (Beyond MVP)

**Vercel** ($20/month Pro):
- When bandwidth exceeds 100GB/month
- Need for team collaboration features

**Supabase** ($25/month Pro):
- Database exceeds 500MB
- Need for daily backups
- More than 2GB bandwidth

**Upstash** ($0.20 per 100K requests):
- Exceeding 10K requests/day consistently

**Stormglass.io** ($50+/month):
- Need more detailed forecast data
- Want tide predictions
- Need higher API limits

### Horizontal Scaling
- Next.js API routes auto-scale on Vercel
- Supabase can handle read replicas
- Redis cache reduces database load

## Performance Targets

| Metric | Target | Strategy |
|--------|--------|----------|
| First Contentful Paint | <1.5s | SSR, code splitting |
| Time to Interactive | <3s | Lazy load map components |
| API Response Time | <500ms | Redis caching |
| Map Load Time | <2s | Tile caching, lazy loading |
| Lighthouse Score | >90 | Optimized images, fonts |

## Security Considerations

1. **Environment Variables**: API keys in `.env.local`, never committed
2. **Rate Limiting**: Prevent API abuse via Redis
3. **CORS**: Restrict API access to known domains
4. **Input Validation**: Zod schemas for all API inputs
5. **SQL Injection**: Use Supabase client (parameterized queries)
6. **XSS Protection**: React escapes by default, sanitize user content

## Monitoring & Observability

1. **Vercel Analytics**: Page views, performance metrics
2. **Sentry** (optional): Error tracking, performance monitoring
3. **Uptime Robot**: Health checks (free)
4. **Console Logs**: API response times, cache hit rates

## Future Tech Considerations

### If User Base Grows
- **CDN**: Cloudflare for additional caching
- **API Gateway**: Rate limiting, authentication
- **Message Queue**: Bull/BullMQ for background jobs
- **Monitoring**: Datadog or New Relic

### If Adding Mobile App
- **React Native**: Share code with web app
- **Expo**: Faster development, OTA updates
- **Push Notifications**: Firebase Cloud Messaging

### If Adding ML Features
- **Python Backend**: FastAPI for ML models
- **TensorFlow.js**: Client-side inference
- **AWS Lambda**: Serverless ML predictions

## Conclusion

This tech stack prioritizes:
1. **Zero Cost**: Everything stays free during MVP
2. **Developer Experience**: Modern tools, good documentation
3. **Scalability**: Easy upgrade path as app grows
4. **Performance**: Fast load times, global CDN
5. **Reliability**: Mature, battle-tested technologies

The stack allows rapid development while maintaining flexibility for future growth.
