# 🌊 Tube Finder

**Discover hidden surf spots and track swells in remote archipelagos**

Tube Finder is a web-based application that helps surfing storm chasers find unknown swells and optimal surf conditions in places like Indonesia and the Philippines. By aggregating data from multiple free weather APIs, buoy sensors, and marine forecasts, it provides real-time insights into wave conditions across remote locations.

## Features

- 🗺️ Interactive map focused on Southeast Asian archipelagos
- 🌊 Real-time swell forecasting (height, period, direction)
- 💨 Wind conditions and overlays
- 📍 Buoy data visualization from NOAA stations
- 🎯 Spot discovery based on optimal conditions
- ⚡ Fast, responsive design optimized for mobile
- 🆓 Completely free - uses only public data sources

## Tech Stack

- **Frontend**: Next.js 14 + TypeScript + Tailwind CSS
- **Mapping**: Leaflet / React-Leaflet
- **Database**: PostgreSQL with PostGIS (Supabase)
- **Caching**: Redis (Upstash)
- **Deployment**: Vercel

## Data Sources

We use entirely free and public data sources:

1. **Open-Meteo Marine API** - Wave forecasts (no API key required)
2. **NOAA NDBC** - Real-time buoy observations
3. **OpenStreetMap** - Base map tiles

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account (free tier)

### Installation

```bash
# Clone the repository
git clone https://github.com/kwong44/tubefinder.git
cd tubefinder

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your configuration

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## Project Structure

```
tubefinder/
├── src/
│   ├── app/              # Next.js app directory
│   ├── components/       # React components
│   ├── lib/             # Utilities and helpers
│   ├── services/        # API integration services
│   └── types/           # TypeScript type definitions
├── public/              # Static assets
├── docs/               # Documentation
└── tests/              # Test files
```

## Development Roadmap

See [PROJECT_PLAN.md](./PROJECT_PLAN.md) for the complete development roadmap and technical details.

### Current Phase: Setup & Core Infrastructure
- [x] Project planning and architecture
- [ ] Next.js project initialization
- [ ] Database schema setup
- [ ] Basic map implementation
- [ ] API integration layer

## Contributing

This is currently a personal project, but contributions and suggestions are welcome! Please open an issue to discuss proposed changes.

## License

MIT License - See [LICENSE](./LICENSE) for details

## Acknowledgments

- Wave data provided by [Open-Meteo](https://open-meteo.com/)
- Buoy data from [NOAA National Data Buoy Center](https://www.ndbc.noaa.gov/)
- Maps powered by [OpenStreetMap](https://www.openstreetmap.org/)

## Contact

For questions or suggestions, please open an issue on GitHub.

---

**Disclaimer**: This tool is for recreational purposes. Always check local conditions, weather warnings, and surf forecasts from official sources before entering the water. Surfing can be dangerous.
