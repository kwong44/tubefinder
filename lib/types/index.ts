// Core type definitions for Tube Finder

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface Spot {
  id: string;
  name: string;
  location: Coordinates;
  type: 'reef' | 'beach' | 'point' | 'unknown';
  facing: number; // degrees (0-360)
  optimalSwell: {
    minHeight: number; // meters
    maxHeight: number; // meters
    direction: number; // degrees
    minPeriod: number; // seconds
  };
  optimalWind: {
    direction: number; // degrees
    maxSpeed: number; // m/s
  };
  discovered: boolean;
  rating?: number; // 0-5
  photos?: string[];
  description?: string;
}

export interface WaveData {
  height: number; // meters
  period: number; // seconds
  direction: number; // degrees (0-360)
}

export interface WindData {
  speed: number; // m/s
  direction: number; // degrees (0-360)
  gusts?: number; // m/s
}

export interface ForecastData {
  spotId?: string;
  location: Coordinates;
  timestamp: Date;
  wave: WaveData;
  wind: WindData;
  swell?: WaveData;
  seaTemp?: number; // Celsius
  score?: number; // 0-100 calculated score
}

export interface BuoyData {
  stationId: string;
  name: string;
  location: Coordinates;
  timestamp: Date;
  wind: WindData;
  wave: WaveData;
  pressure?: number; // hPa
  airTemp?: number; // Celsius
  waterTemp?: number; // Celsius
}

export interface OpenMeteoMarineResponse {
  latitude: number;
  longitude: number;
  hourly_units: {
    time: string;
    wave_height: string;
    wave_direction: string;
    wave_period: string;
    swell_wave_height?: string;
    swell_wave_direction?: string;
    swell_wave_period?: string;
  };
  hourly: {
    time: string[];
    wave_height: number[];
    wave_direction: number[];
    wave_period: number[];
    swell_wave_height?: number[];
    swell_wave_direction?: number[];
    swell_wave_period?: number[];
  };
}

export interface MapBounds {
  north: number;
  south: number;
  east: number;
  west: number;
}

export interface FilterOptions {
  minWaveHeight?: number;
  maxWaveHeight?: number;
  minPeriod?: number;
  windDirection?: 'offshore' | 'onshore' | 'any';
  spotType?: Spot['type'][];
}
