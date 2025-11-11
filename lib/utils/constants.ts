// API Configuration
export const API_CONFIG = {
  OPEN_METEO_MARINE: 'https://marine-api.open-meteo.com/v1/marine',
  OPEN_METEO_WEATHER: 'https://api.open-meteo.com/v1/forecast',
  NOAA_NDBC_REALTIME: 'https://www.ndbc.noaa.gov/data/realtime2',
} as const;

// Cache durations (in seconds)
export const CACHE_DURATION = {
  FORECAST: 6 * 60 * 60, // 6 hours
  BUOY: 60 * 60, // 1 hour
  STATIONS: 24 * 60 * 60, // 24 hours
} as const;

// Famous surf spots for initial display
export const FAMOUS_SPOTS = [
  {
    id: 'uluwatu',
    name: 'Uluwatu',
    location: { lat: -8.8292, lng: 115.0853 },
    type: 'reef' as const,
    facing: 225,
    optimalSwell: {
      minHeight: 1.5,
      maxHeight: 4.0,
      direction: 225,
      minPeriod: 12,
    },
    optimalWind: {
      direction: 90, // East
      maxSpeed: 5,
    },
    discovered: true,
    rating: 5,
    description: 'World-class left reef break in Bali',
  },
  {
    id: 'gland',
    name: 'G-Land',
    location: { lat: -8.7832, lng: 114.4287 },
    type: 'reef' as const,
    facing: 180,
    optimalSwell: {
      minHeight: 2.0,
      maxHeight: 6.0,
      direction: 200,
      minPeriod: 14,
    },
    optimalWind: {
      direction: 45, // Northeast
      maxSpeed: 5,
    },
    discovered: true,
    rating: 5,
    description: 'Epic left barrel in East Java',
  },
  {
    id: 'cloud9',
    name: 'Cloud 9',
    location: { lat: 9.8503, lng: 126.0450 },
    type: 'reef' as const,
    facing: 90,
    optimalSwell: {
      minHeight: 1.5,
      maxHeight: 4.0,
      direction: 90,
      minPeriod: 10,
    },
    optimalWind: {
      direction: 270, // West
      maxSpeed: 5,
    },
    discovered: true,
    rating: 5,
    description: 'Famous reef break in Siargao, Philippines',
  },
  {
    id: 'mentawai',
    name: 'Mentawai Islands',
    location: { lat: -2.0833, lng: 99.8667 },
    type: 'reef' as const,
    facing: 225,
    optimalSwell: {
      minHeight: 2.0,
      maxHeight: 5.0,
      direction: 225,
      minPeriod: 14,
    },
    optimalWind: {
      direction: 90, // East
      maxSpeed: 5,
    },
    discovered: true,
    rating: 5,
    description: 'World-class surf destination with multiple breaks',
  },
] as const;

// Swell direction labels
export const DIRECTION_LABELS: Record<number, string> = {
  0: 'N',
  45: 'NE',
  90: 'E',
  135: 'SE',
  180: 'S',
  225: 'SW',
  270: 'W',
  315: 'NW',
};

// Color scales for wave height visualization
export const WAVE_HEIGHT_COLORS = {
  0: '#93c5fd', // blue-300
  1: '#60a5fa', // blue-400
  2: '#3b82f6', // blue-500
  3: '#2563eb', // blue-600
  4: '#1d4ed8', // blue-700
  5: '#1e40af', // blue-800
  6: '#1e3a8a', // blue-900
} as const;

// Map configuration
export const MAP_CONFIG = {
  tileLayer: {
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  },
  defaultCenter: { lat: 0, lng: 115 } as const,
  defaultZoom: 5,
  minZoom: 3,
  maxZoom: 18,
} as const;
