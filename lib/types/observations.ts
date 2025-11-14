// NOAA buoy and tide data type definitions

export interface BuoyStation {
  id: string; // Station ID (e.g., "46259")
  name: string;
  location: {
    lat: number;
    lng: number;
  };
  owner: string;
  type: 'buoy' | 'fixed' | 'other';
}

export interface BuoyObservation {
  stationId: string;
  timestamp: Date;

  // Wave data
  waveHeight?: number; // meters (significant wave height)
  dominantWavePeriod?: number; // seconds
  averageWavePeriod?: number; // seconds
  waveDirection?: number; // degrees (direction waves are coming from)

  // Wind data
  windSpeed?: number; // m/s
  windDirection?: number; // degrees
  windGust?: number; // m/s

  // Atmospheric
  pressure?: number; // hPa
  pressureTendency?: number; // hPa change over 3 hours
  airTemperature?: number; // Celsius

  // Water
  waterTemperature?: number; // Celsius
  dewPoint?: number; // Celsius
  visibility?: number; // nautical miles
}

export interface TideStation {
  id: string; // Station ID (e.g., "9414290")
  name: string;
  location: {
    lat: number;
    lng: number;
  };
  state?: string;
  timeZone: string;
}

export interface TidePrediction {
  stationId: string;
  timestamp: Date;
  height: number; // meters
  type: 'H' | 'L'; // High or Low tide
}

export interface TideDataPoint {
  time: Date;
  height: number; // meters
}

export interface TideSummary {
  stationId: string;
  stationName: string;
  predictions: TidePrediction[];
  hourlyData: TideDataPoint[];
  nextHighTide?: TidePrediction;
  nextLowTide?: TidePrediction;
}

export interface DataSourceInfo {
  source: 'open-meteo' | 'noaa-buoy' | 'noaa-tide' | 'user-report';
  lastUpdated?: Date;
  dataAge?: number; // minutes since last update
  reliability?: 'high' | 'medium' | 'low';
  description: string;
}

// Mapping of surf spots to nearest buoy stations
export interface SpotBuoyMapping {
  spotId: string;
  buoyStationId: string;
  distance: number; // km from spot to buoy
}

// Mapping of surf spots to nearest tide stations
export interface SpotTideMapping {
  spotId: string;
  tideStationId: string;
  distance: number; // km from spot to station
}
