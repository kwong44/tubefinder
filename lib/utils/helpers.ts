import type { Coordinates } from '@/lib/types';
import { DIRECTION_LABELS } from './constants';

/**
 * Calculate distance between two coordinates using Haversine formula
 * @returns distance in kilometers
 */
export function calculateDistance(
  coord1: Coordinates,
  coord2: Coordinates
): number {
  const R = 6371; // Earth's radius in km
  const dLat = toRad(coord2.lat - coord1.lat);
  const dLon = toRad(coord2.lng - coord1.lng);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(coord1.lat)) *
      Math.cos(toRad(coord2.lat)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

/**
 * Convert degrees to compass direction label
 */
export function degreesToDirection(degrees: number): string {
  const normalized = ((degrees % 360) + 360) % 360;
  const index = Math.round(normalized / 45) % 8;
  const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  return directions[index];
}

/**
 * Calculate if wind is offshore for a given spot
 * @param windDirection - direction wind is coming FROM (meteorological)
 * @param spotFacing - direction the spot faces (where waves come from)
 * @returns true if wind is offshore (within 90 degrees either side)
 */
export function isOffshore(
  windDirection: number,
  spotFacing: number
): boolean {
  const diff = Math.abs(windDirection - spotFacing);
  const normalizedDiff = Math.min(diff, 360 - diff);
  return normalizedDiff <= 90;
}

/**
 * Calculate surf score (0-100) based on conditions
 */
export function calculateSurfScore(params: {
  waveHeight: number;
  wavePeriod: number;
  waveDirection: number;
  windSpeed: number;
  windDirection: number;
  optimalSwellHeight: number;
  optimalSwellDirection: number;
  optimalPeriod: number;
  spotFacing: number;
}): number {
  const {
    waveHeight,
    wavePeriod,
    waveDirection,
    windSpeed,
    windDirection,
    optimalSwellHeight,
    optimalSwellDirection,
    optimalPeriod,
    spotFacing,
  } = params;

  // Height score (0-100)
  const heightDiff = Math.abs(waveHeight - optimalSwellHeight);
  const heightScore = Math.max(0, 100 - heightDiff * 30);

  // Period score (0-100) - longer period is generally better
  const periodScore = Math.min(100, (wavePeriod / optimalPeriod) * 80);

  // Direction score (0-100) - how well aligned with optimal direction
  const directionDiff = Math.abs(waveDirection - optimalSwellDirection);
  const normalizedDirectionDiff = Math.min(directionDiff, 360 - directionDiff);
  const directionScore = Math.max(0, 100 - normalizedDirectionDiff * 0.5);

  // Wind score (0-100) - offshore is best, light winds
  const offshore = isOffshore(windDirection, spotFacing);
  const windSpeedScore = Math.max(0, 100 - windSpeed * 10);
  const windScore = offshore ? windSpeedScore : windSpeedScore * 0.5;

  // Weighted average
  const totalScore =
    heightScore * 0.3 +
    periodScore * 0.25 +
    directionScore * 0.2 +
    windScore * 0.25;

  return Math.round(Math.max(0, Math.min(100, totalScore)));
}

/**
 * Get color for wave height
 */
export function getWaveHeightColor(height: number): string {
  if (height < 1) return '#93c5fd'; // blue-300
  if (height < 2) return '#60a5fa'; // blue-400
  if (height < 3) return '#3b82f6'; // blue-500
  if (height < 4) return '#2563eb'; // blue-600
  if (height < 5) return '#1d4ed8'; // blue-700
  if (height < 6) return '#1e40af'; // blue-800
  return '#1e3a8a'; // blue-900
}

/**
 * Get color for surf score
 */
export function getScoreColor(score: number): string {
  if (score >= 80) return '#22c55e'; // green-500
  if (score >= 60) return '#84cc16'; // lime-500
  if (score >= 40) return '#eab308'; // yellow-500
  if (score >= 20) return '#f97316'; // orange-500
  return '#ef4444'; // red-500
}

/**
 * Format wave height for display
 */
export function formatWaveHeight(meters: number): string {
  return `${meters.toFixed(1)}m`;
}

/**
 * Format wave period for display
 */
export function formatPeriod(seconds: number): string {
  return `${seconds.toFixed(0)}s`;
}

/**
 * Format wind speed for display
 */
export function formatWindSpeed(ms: number): string {
  const kmh = ms * 3.6;
  return `${kmh.toFixed(0)} km/h`;
}

/**
 * Debounce function
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}
