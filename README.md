# 🌊 Tube Finder

**Discover hidden surf spots and track swells in remote archipelagos**

Tube Finder is a web-based application that helps surfing storm chasers find unknown swells and optimal surf conditions in places like Indonesia and the Philippines. By aggregating data from multiple free weather APIs, buoy sensors, and marine forecasts, it provides real-time insights into wave conditions across remote locations.

![Status](https://img.shields.io/badge/status-in%20development-yellow)
![Next.js](https://img.shields.io/badge/Next.js-15-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)

## Features

### Core Functionality
- 🗺️ **Interactive Map** - Leaflet-based map focused on Southeast Asian archipelagos
- 🌊 **Live Wave Forecasts** - Real-time wave height, period, and direction from Open-Meteo
- 💨 **Wind Conditions** - Live wind speed, direction, and gust information
- 🎯 **Surf Scoring** - Intelligent 0-100 scoring system based on optimal conditions
- 🎨 **Color-Coded Markers** - Visual scoring (Epic, Great, Good, Fair, Poor)
- 📍 **Famous Surf Spots** - Pre-loaded with world-class breaks (Uluwatu, G-Land, Cloud 9, Mentawai)
- 📊 **Detailed Popups** - Click markers for comprehensive condition breakdown
- 🆓 **Completely Free** - Uses only public data sources (Open-Meteo, NOAA)

### Advanced Features
- 🔍 **Real-time Search** - Instant spot filtering by name
- 🎛️ **Smart Filters** - Filter by score, wave height, and spot type
- 📈 **Sort Controls** - Sort by score, wave height, or name
- 📱 **Mobile Responsive** - Collapsible sidebar with smooth animations
- ⏰ **Forecast Timeline** - 24-hour and 7-day interactive charts
- 🧭 **Direction Arrows** - Visual wave/wind direction indicators
- 📊 **Trend Analysis** - See if conditions are improving or worsening
- 📅 **Date/Time Picker** - View forecasts at different times (quick presets + custom selection)
- 🗺️ **Wind/Swell Overlay** - Toggle directional arrows on map (wind/wave/both)
- 💾 **Filter Presets** - Save and load custom filter configurations
- 🔐 **User Authentication** - Email/password, Google OAuth, magic links
- ❤️ **Favorites System** - Save spots, filter by favorites, sort by recency
- ➕ **Custom Spots** - Create and share your own surf spots
- 👤 **User Profiles** - Track your activity, favorites, and custom spots
- 🌊 **Live Buoy Data** - Real-time wave observations from NOAA buoys
- 🌙 **Tide Predictions** - High/low tide forecasts with visual timeline
- 🏷️ **Data Source Indicators** - See where data comes from (forecast/buoy/tide)
- ⭐ **Ratings & Reviews** - Rate spots (1-5 stars), write detailed reviews
- 💬 **Review System** - Experience level, visited date, helpful voting
- 📊 **Rating Summaries** - Average ratings with distribution visualization
- ⚡ **Performance** - Smart caching, optimized bundle (191KB First Load)

## Tech Stack

- **Framework**: Next.js 15 (App Router) + TypeScript
- **Styling**: Tailwind CSS
- **Mapping**: Leaflet / React-Leaflet
- **State Management**: Zustand
- **Data Fetching**: TanStack Query (React Query)
- **Database**: PostgreSQL with PostGIS (Supabase) - *planned*
- **Caching**: Redis (Upstash) - *planned*

## Data Sources

We use entirely free and public data sources:

1. **Open-Meteo Marine API** - Wave forecasts, swell data (no API key required, 10K requests/day)
2. **NOAA NDBC** - Real-time buoy observations from Pacific stations
3. **OpenStreetMap** - Base map tiles

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Git

### Installation

```bash
# Clone the repository
git clone https://github.com/kwong44/tubefinder.git
cd tubefinder

# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

### Building for Production

```bash
# Build the application
npm run build

# Start production server
npm start
```

## Project Structure

```
tubefinder/
├── app/
│   ├── api/              # API routes
│   │   └── forecast/     # Forecast endpoint
│   ├── components/       # React components
│   │   └── Map.tsx       # Interactive map component
│   ├── layout.tsx        # Root layout
│   ├── page.tsx          # Home page
│   └── globals.css       # Global styles
├── lib/
│   ├── services/         # API services
│   │   └── marine-data.service.ts
│   ├── stores/           # Zustand stores
│   │   └── map-store.ts
│   ├── types/            # TypeScript types
│   │   └── index.ts
│   └── utils/            # Utility functions
│       ├── constants.ts
│       └── helpers.ts
├── public/               # Static assets
├── docs/                 # Documentation
│   ├── API_REFERENCE.md
│   ├── PROJECT_PLAN.md
│   └── TECH_STACK.md
└── package.json
```

## Current Status

✅ **Completed (Phase 1 - Live Data Display)**
- [x] Project initialization and configuration
- [x] Next.js app with TypeScript
- [x] Tailwind CSS styling
- [x] Interactive Leaflet map
- [x] Famous surf spots markers
- [x] Open-Meteo API integration
- [x] API route for forecast data
- [x] Responsive layout
- [x] **React Query data fetching**
- [x] **Live forecast data display**
- [x] **Color-coded surf scoring (0-100)**
- [x] **Detailed forecast popups**
- [x] **Wind and swell conditions**
- [x] **Loading and error states**
- [x] **Map legend**
- [x] **Sidebar with live conditions**

✅ **Completed (Phase 2 - Enhanced Features)**
- [x] **Forecast timeline chart (24 hours/7 days)**
- [x] **Wind/swell direction arrows in popups**
- [x] **Condition trend indicators (improving/worsening)**
- [x] **Interactive chart with hover tooltips**
- [x] **Tabbed 24h/7d views**

✅ **Completed (Phase 3 - Search, Filter & Mobile)**
- [x] **Real-time search** (filter spots by name)
- [x] **Advanced filters** (score range, wave height, spot type)
- [x] **Sort controls** (by score, wave height, or name)
- [x] **Responsive sidebar** (collapsible on mobile)
- [x] **Mobile optimizations** (touch targets, spacing, gestures)
- [x] **Filter state management** (Zustand store)
- [x] **Improved UX** (empty states, loading indicators, feedback)

✅ **Completed (Phase 4 - Advanced Features)**
- [x] **Date/time picker** for viewing forecasts at different times
- [x] **Quick presets** (Now, +6h, +12h, +24h, +3d, +7d)
- [x] **Custom date/time selection** for precise forecast viewing
- [x] **Wind/swell overlay arrows** on map tiles
- [x] **Overlay controls** (toggle wind/wave/both directions)
- [x] **Filter presets** (save/load/delete custom filter configurations)
- [x] **LocalStorage persistence** for saved presets

✅ **Completed (Phase 5A - Authentication Foundation)**
- [x] **Supabase integration** (database, auth, storage setup)
- [x] **Authentication system** (email/password, Google OAuth, magic links)
- [x] **Auth UI** (sign in modal, user menu, profile dropdown)
- [x] **Auth store** (Zustand state management for user session)
- [x] **Row Level Security** (database schema with RLS policies)
- [x] **Setup documentation** (complete Supabase setup guide)

✅ **Completed (Phase 5B - Favorites System)**
- [x] **Favorites hooks** (React Query with optimistic updates)
- [x] **FavoriteButton component** (animated heart icon with states)
- [x] **Integrated in UI** (SpotCard, ForecastPopup with favorites)
- [x] **Contextual auth prompts** (sign-in modal with custom messages)
- [x] **Global UI store** (centralized modal management)
- [x] **Favorites filtering** ("show only favorites" toggle in FilterPanel)
- [x] **Favorites sorting** (by most recent favorite date)
- [x] **Empty states** (contextual messaging for unauthenticated users)

✅ **Completed (Phase 5C - User Content)**
- [x] **Custom spot creation** (CreateSpotModal with full form validation)
- [x] **Custom spots database** (Supabase schema with RLS policies)
- [x] **useCustomSpots hook** (CRUD operations with React Query)
- [x] **Spot type & location** (lat/lng, type, directions, skill level)
- [x] **Privacy controls** (public/private spot visibility)
- [x] **Merged spot display** (custom + default spots on map and list)
- [x] **User profile modal** (stats, favorites count, custom spots list)
- [x] **Profile integration** (accessible from UserMenu)
- [x] **Photo storage infrastructure** (Supabase storage bucket + RLS policies)
- [x] **Photo metadata table** (track uploads with spot associations)

✅ **Completed (Phase 5D - Enhanced Data)**
- [x] **NOAA buoy integration** (real-time wave and wind observations)
- [x] **Buoy data types and API** (NDBC observations with retry logic)
- [x] **useBuoyData hook** (React Query with caching and error handling)
- [x] **BuoyObservationCard** (display live buoy data with compact mode)
- [x] **NOAA tide predictions** (CO-OPS API for high/low tide forecasts)
- [x] **useTideData hook** (fetch and cache tide predictions)
- [x] **TideChart component** (visual timeline of upcoming tides)
- [x] **Data source badges** (show data origin: forecast, buoy, tide)
- [x] **Integrated in ForecastPopup** (buoy and tide data alongside forecasts)
- [x] **Buoy station mapping** (link surf spots to nearest buoy stations)

✅ **Completed (Phase 6A - Spot Ratings & Reviews)**
- [x] **Database schema** (spot_ratings, spot_reviews, helpful_votes tables)
- [x] **TypeScript types** (rating, review, summary interfaces)
- [x] **Rating hooks** (useSpotRatings with React Query)
- [x] **Review hooks** (useSpotReviews with pagination, useUserReviews)
- [x] **RatingStars component** (display and input modes, partial stars)
- [x] **RatingSummary component** (average rating, distribution bars)
- [x] **ReviewCard component** (display individual reviews)
- [x] **ReviewList component** (pagination, helpful voting)
- [x] **WriteReviewModal** (full form with validation)
- [x] **UI Integration** (SpotCard ratings, ForecastPopup reviews, UserProfile reviews)

📋 **Planned (Phase 6 - Community & Alerts)**
- [ ] Community condition reports (Phase 6B)
- [ ] Mobile PWA (Phase 6D)
- [ ] Email/SMS alerts for optimal conditions (Phase 6C)
- [ ] Friend system and social features (Phase 6E)

## Development

### Running Tests

```bash
npm test
```

### Type Checking

```bash
npm run type-check
```

### Linting

```bash
npm run lint
```

## API Usage Example

### Fetch Forecast Data

```bash
curl "http://localhost:3000/api/forecast?lat=-8.8292&lng=115.0853"
```

Response:
```json
{
  "location": { "lat": -8.8292, "lng": 115.0853 },
  "forecast": [
    {
      "timestamp": "2025-11-11T00:00:00Z",
      "wave": {
        "height": 2.1,
        "period": 12.5,
        "direction": 225
      },
      "wind": {
        "speed": 4.2,
        "direction": 90
      }
    }
  ],
  "generatedAt": "2025-11-11T10:00:00Z"
}
```

## Configuration

### Environment Variables

Copy `.env.example` to `.env.local` and configure:

```bash
cp .env.example .env.local
```

Required variables:
- `NEXT_PUBLIC_APP_URL` - Your application URL (default: http://localhost:3000)

Optional (for future features):
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anonymous key
- `UPSTASH_REDIS_REST_URL` - Upstash Redis URL
- `UPSTASH_REDIS_REST_TOKEN` - Upstash Redis token

## Contributing

This is currently a personal project, but contributions and suggestions are welcome! Please open an issue to discuss proposed changes.

## Roadmap

See [PROJECT_PLAN.md](./docs/PROJECT_PLAN.md) for the complete development roadmap.

**Short-term (Next 2-4 weeks)**
- Display forecast data on map interface
- Implement spot detail views
- Add wind and swell visualizations
- Mobile responsiveness improvements

**Medium-term (1-3 months)**
- User accounts and authentication
- Save favorite spots
- Custom spot creation
- Advanced filtering
- Spot scoring and recommendations

**Long-term (3-6 months)**
- Mobile app (PWA)
- Community features
- Historical data analysis
- ML-based spot discovery
- Offline mode

## License

MIT License - See [LICENSE](./LICENSE) for details

## Acknowledgments

- Wave data provided by [Open-Meteo](https://open-meteo.com/)
- Buoy data from [NOAA National Data Buoy Center](https://www.ndbc.noaa.gov/)
- Maps powered by [OpenStreetMap](https://www.openstreetmap.org/)
- Built with [Next.js](https://nextjs.org/), [React](https://react.dev/), and [Leaflet](https://leafletjs.com/)

## Contact

For questions or suggestions, please open an issue on GitHub.

---

**Disclaimer**: This tool is for recreational purposes only. Always check local conditions, weather warnings, and official surf forecasts before entering the water. Surfing can be dangerous.

**Made with 🌊 for surfers, by surfers**
