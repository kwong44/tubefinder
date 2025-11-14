// NOAA Buoy Stations near famous surf spots
// Data from NOAA National Data Buoy Center (NDBC)

import type { BuoyStation, SpotBuoyMapping, TideStation, SpotTideMapping } from '@/lib/types/observations';

export const BUOY_STATIONS: Record<string, BuoyStation> = {
  // Indonesia - Indian Ocean
  '23010': {
    id: '23010',
    name: 'Southern Java',
    location: { lat: -10.5, lng: 105.0 },
    owner: 'Indonesia',
    type: 'buoy',
  },

  // Philippines - Pacific Ocean
  '52402': {
    id: '52402',
    name: 'Philippines East',
    location: { lat: 14.0, lng: 127.0 },
    owner: 'Philippines',
    type: 'buoy',
  },

  // Indonesia - Near Sumatra (for Mentawai)
  '23011': {
    id: '23011',
    name: 'West Sumatra',
    location: { lat: -2.3, lng: 98.9 },
    owner: 'Indonesia',
    type: 'buoy',
  },
};

// Map spots to their nearest buoy stations
export const SPOT_BUOY_MAPPINGS: SpotBuoyMapping[] = [
  {
    spotId: 'uluwatu',
    buoyStationId: '23010',
    distance: 850, // approximate km
  },
  {
    spotId: 'gland',
    buoyStationId: '23010',
    distance: 200,
  },
  {
    spotId: 'cloud9',
    buoyStationId: '52402',
    distance: 150,
  },
  {
    spotId: 'mentawai',
    buoyStationId: '23011',
    distance: 100,
  },
];

// NOAA Tide Stations (US coastal areas)
export const TIDE_STATIONS: Record<string, TideStation> = {
  // California
  '9414290': {
    id: '9414290',
    name: 'San Francisco',
    location: { lat: 37.806, lng: -122.465 },
    state: 'CA',
    timeZone: 'America/Los_Angeles',
  },
  '9410840': {
    id: '9410840',
    name: 'Santa Monica',
    location: { lat: 34.008, lng: -118.500 },
    state: 'CA',
    timeZone: 'America/Los_Angeles',
  },

  // Hawaii
  '1612340': {
    id: '1612340',
    name: 'Honolulu',
    location: { lat: 21.307, lng: -157.867 },
    state: 'HI',
    timeZone: 'Pacific/Honolulu',
  },

  // Indonesia/Bali area - using nearest available (limited NOAA coverage)
  // For international locations, we'll use Open-Meteo tide data as fallback
};

// Map spots to tide stations (primarily for US spots)
export const SPOT_TIDE_MAPPINGS: SpotTideMapping[] = [
  // International spots will use Open-Meteo marine API for tide data
  // US spots can be added here as needed
];

// Helper function to get nearest buoy for a spot
export function getNearestBuoy(spotId: string): BuoyStation | null {
  const mapping = SPOT_BUOY_MAPPINGS.find((m) => m.spotId === spotId);
  if (!mapping) return null;

  return BUOY_STATIONS[mapping.buoyStationId] || null;
}

// Helper function to get nearest tide station for a spot
export function getNearestTideStation(spotId: string): TideStation | null {
  const mapping = SPOT_TIDE_MAPPINGS.find((m) => m.spotId === spotId);
  if (!mapping) return null;

  return TIDE_STATIONS[mapping.tideStationId] || null;
}
