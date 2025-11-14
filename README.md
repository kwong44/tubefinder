# 🌊 Tube Finder

**Discover hidden surf spots and track swells in remote archipelagos**

Tube Finder is a web-based application that helps surfing storm chasers find unknown swells and optimal surf conditions in places like Indonesia and the Philippines. By aggregating data from multiple free weather APIs, buoy sensors, and marine forecasts, it provides real-time insights into wave conditions across remote locations.

![Status](https://img.shields.io/badge/status-in%20development-yellow)
![Next.js](https://img.shields.io/badge/Next.js-15-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)

## Features

- 🗺️ **Interactive Map** - Leaflet-based map focused on Southeast Asian archipelagos
- 🌊 **Live Wave Forecasts** - Real-time wave height, period, and direction from Open-Meteo
- 💨 **Wind Conditions** - Live wind speed, direction, and gust information
- 🎯 **Surf Scoring** - Intelligent 0-100 scoring system based on optimal conditions
- 🎨 **Color-Coded Markers** - Visual scoring (Epic, Great, Good, Fair, Poor)
- 📍 **Famous Surf Spots** - Pre-loaded with world-class breaks
- 📊 **Detailed Popups** - Click markers for comprehensive condition breakdown
- ⚡ **Fast & Responsive** - Optimized for mobile and desktop with smart caching
- 🆓 **Completely Free** - Uses only public data sources (Open-Meteo, NOAA)

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

🚧 **In Progress (Phase 3 - Advanced Features)**
- [ ] Date/time picker for historical forecasts
- [ ] Spot search and filtering
- [ ] Wind/swell overlay on map tiles

📋 **Planned (Phase 4 - Advanced Features)**
- [ ] NOAA buoy data integration
- [ ] Tide predictions
- [ ] User authentication
- [ ] Save favorite spots
- [ ] Custom spot creation
- [ ] Mobile PWA
- [ ] Database integration (Supabase)
- [ ] Community features
- [ ] Email/SMS alerts for optimal conditions

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
