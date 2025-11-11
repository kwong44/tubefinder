# Tube Finder - Project Plan

## Overview
Tube Finder is a web-based application designed to help surfing storm chasers discover unknown swells and surf spots in remote archipelagos like Indonesia and the Philippines. The app aggregates weather data from multiple free sources to identify optimal surfing conditions.

## Core Features

### Phase 1 - MVP (Minimum Viable Product)
- [ ] Interactive map interface focused on Southeast Asia archipelagos
- [ ] Real-time buoy data visualization
- [ ] Swell forecast display (height, period, direction)
- [ ] Wind conditions overlay
- [ ] Basic spot markers and discovery

### Phase 2 - Enhanced Features
- [ ] Storm tracking and visualization
- [ ] Ocean currents and tides
- [ ] Historical data analysis for pattern recognition
- [ ] User-contributed spot ratings and photos
- [ ] Multi-day forecast timeline
- [ ] Alert system for ideal conditions

### Phase 3 - Advanced Features
- [ ] Machine learning for spot recommendation
- [ ] Community features (sharing, comments)
- [ ] Mobile app (Progressive Web App)
- [ ] Offline mode with cached data

## Tech Stack Recommendation

### Frontend
- **Framework**: Next.js 14+ (React)
  - Server-side rendering for better SEO
  - API routes for backend functionality
  - Built-in optimization
  - TypeScript support

- **Mapping Library**: Leaflet with React-Leaflet
  - Lightweight and free
  - Excellent for custom overlays
  - Good plugin ecosystem
  - Alternative: Mapbox GL JS (free tier available)

- **UI Framework**: Tailwind CSS + shadcn/ui
  - Rapid development
  - Responsive by default
  - Modern component library

- **State Management**: Zustand or React Query
  - Simple and lightweight
  - Great for API data caching

### Backend
- **API Layer**: Next.js API Routes
  - Serverless functions
  - Easy deployment
  - Built-in API aggregation

- **Database**: PostgreSQL with PostGIS extension
  - Geospatial queries
  - Store spot data, user contributions
  - Free hosting: Supabase or Neon

- **Caching**: Redis (Upstash for serverless)
  - Cache API responses
  - Rate limiting
  - Reduce API calls

### Data Sources (Free APIs)

#### Primary Data Sources

1. **Open-Meteo Marine Weather API**
   - URL: https://open-meteo.com/en/docs/marine-weather-api
   - Cost: Free, no API key required
   - Data: Wave height, period, direction, sea surface temperature
   - Coverage: Global
   - Forecast: 7 days hourly
   - Rate Limit: 10,000 requests/day (generous for MVP)

2. **NOAA NDBC (National Data Buoy Center)**
   - URL: https://www.ndbc.noaa.gov/
   - Cost: Free, no API key
   - Data: Real-time buoy observations (45 days)
   - Access: Direct HTTP (e.g., `https://www.ndbc.noaa.gov/data/realtime2/[STATION].txt`)
   - Coverage: Primarily Pacific and Atlantic (some near Philippines)
   - Update: Real-time

3. **Stormglass.io** (Optional - has free tier)
   - Free tier: 50 requests/day
   - Data: Wave, swell, wind, weather, tides
   - Good for testing/development
   - Can upgrade later if needed

#### Secondary Data Sources

4. **Open-Meteo Weather API**
   - Wind speed/direction
   - Precipitation
   - Cloud cover
   - Temperature

5. **OpenStreetMap (OSM)**
   - Base maps
   - Coastline data
   - Geographic features

### Hosting & Deployment
- **Frontend**: Vercel (free tier)
  - Optimized for Next.js
  - Global CDN
  - Automatic deployments

- **Database**: Supabase (free tier)
  - PostgreSQL with PostGIS
  - Real-time subscriptions
  - Authentication built-in

- **Caching**: Upstash Redis (free tier)
  - 10,000 requests/day
  - Serverless compatible

## Architecture

```
┌─────────────────────────────────────────────────────┐
│                   Frontend (Next.js)                 │
│  ┌──────────────┐  ┌──────────────┐  ┌───────────┐ │
│  │  Map View    │  │  Spot List   │  │  Filters  │ │
│  │  (Leaflet)   │  │              │  │           │ │
│  └──────────────┘  └──────────────┘  └───────────┘ │
└─────────────────────────────────────────────────────┘
                          │
                          ↓
┌─────────────────────────────────────────────────────┐
│              API Routes (Next.js)                    │
│  ┌──────────────────────────────────────────────┐  │
│  │         Data Aggregation Layer                │  │
│  │  - Fetch from multiple APIs                   │  │
│  │  - Normalize data formats                     │  │
│  │  - Cache responses                            │  │
│  └──────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────┘
           │                │              │
           ↓                ↓              ↓
    ┌──────────┐    ┌─────────────┐  ┌──────────┐
    │Open-Meteo│    │ NOAA NDBC   │  │Stormglass│
    │  Marine  │    │   Buoys     │  │   (opt)  │
    └──────────┘    └─────────────┘  └──────────┘
                          │
                          ↓
              ┌───────────────────────┐
              │  PostgreSQL + PostGIS │
              │     (Supabase)        │
              └───────────────────────┘
                          │
                          ↓
                 ┌─────────────────┐
                 │  Redis Cache    │
                 │   (Upstash)     │
                 └─────────────────┘
```

## Data Model

### Core Entities

#### Spots
```typescript
interface Spot {
  id: string;
  name: string;
  location: {
    lat: number;
    lng: number;
  };
  type: 'reef' | 'beach' | 'point' | 'unknown';
  facing: number; // degrees
  optimalSwell: {
    minHeight: number; // meters
    maxHeight: number;
    direction: number; // degrees
    minPeriod: number; // seconds
  };
  optimalWind: {
    direction: number;
    maxSpeed: number; // m/s
  };
  discovered: boolean;
  rating?: number;
  photos?: string[];
}
```

#### Forecast Data
```typescript
interface ForecastData {
  spotId: string;
  timestamp: Date;
  wave: {
    height: number; // meters
    period: number; // seconds
    direction: number; // degrees
  };
  wind: {
    speed: number; // m/s
    direction: number; // degrees
  };
  swell: {
    height: number;
    period: number;
    direction: number;
  };
  score: number; // 0-100 calculated score
}
```

## Implementation Roadmap

### Week 1-2: Project Setup & Core Infrastructure
- [x] Initialize Git repository
- [ ] Set up Next.js project with TypeScript
- [ ] Configure Tailwind CSS and shadcn/ui
- [ ] Set up database schema (Supabase)
- [ ] Implement basic map with Leaflet
- [ ] Create data fetching utilities for Open-Meteo
- [ ] Set up caching layer

### Week 3-4: Data Integration
- [ ] Implement Open-Meteo Marine API integration
- [ ] Implement NOAA NDBC buoy data parser
- [ ] Create data normalization layer
- [ ] Build API routes for data aggregation
- [ ] Implement geospatial queries (PostGIS)
- [ ] Add real-time data updates

### Week 5-6: Map & Visualization
- [ ] Create interactive map with controls
- [ ] Add buoy location markers
- [ ] Implement swell direction visualization
- [ ] Add wind overlay
- [ ] Create forecast timeline component
- [ ] Build spot detail view

### Week 7-8: Spot Discovery & Scoring
- [ ] Develop scoring algorithm
- [ ] Implement spot recommendation engine
- [ ] Add filters (swell height, wind, etc.)
- [ ] Create spot search functionality
- [ ] Build "optimal conditions" alerts

### Week 9-10: Polish & Deploy
- [ ] Performance optimization
- [ ] Mobile responsiveness
- [ ] Error handling and loading states
- [ ] Deploy to Vercel
- [ ] Set up monitoring
- [ ] Documentation

## Key Algorithms

### Spot Scoring Algorithm
```
Score = (SwellScore * 0.4) + (WindScore * 0.3) +
        (PeriodScore * 0.2) + (DirectionScore * 0.1)

Where:
- SwellScore: How close to optimal swell height (0-100)
- WindScore: Offshore winds = 100, Onshore = 0
- PeriodScore: Longer period = higher score (>12s = 100)
- DirectionScore: How aligned with spot's optimal direction
```

## API Rate Limiting Strategy
- Cache forecast data for 6 hours
- Cache buoy data for 1 hour
- Implement request queuing
- Use Redis for distributed rate limiting
- Batch requests where possible

## Security Considerations
- API key management via environment variables
- Rate limiting on API routes
- CORS configuration
- Input validation
- SQL injection prevention (use ORM/parameterized queries)

## Monitoring & Analytics
- Vercel Analytics (free)
- Error tracking: Sentry (free tier)
- API performance monitoring
- User behavior tracking (privacy-focused)

## Future Enhancements
- Tide data integration
- Current/rip information
- Crowd factor estimation
- Local weather conditions
- Satellite imagery overlay
- Social features (check-ins, photos)
- Historical conditions analysis
- ML-based spot discovery

## Resources & Documentation
- Open-Meteo Marine API: https://open-meteo.com/en/docs/marine-weather-api
- NOAA NDBC Documentation: https://www.ndbc.noaa.gov/docs/ndbc_web_data_guide.pdf
- Leaflet Documentation: https://leafletjs.com/
- Next.js Documentation: https://nextjs.org/docs
- PostGIS Documentation: https://postgis.net/docs/

## Estimated Costs (Free Tier Limits)
- Vercel: Free for hobby projects
- Supabase: Free (500MB database, 2GB bandwidth)
- Upstash Redis: Free (10K requests/day)
- Open-Meteo: Free (10K requests/day)
- NOAA NDBC: Free (unlimited)
- **Total: $0/month for MVP**

## Success Metrics
- Forecast accuracy correlation with actual conditions
- User engagement (session time, return visits)
- Spots discovered and rated
- API response times <2s
- Map load time <3s
- Mobile performance score >90
