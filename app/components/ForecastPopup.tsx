'use client';

import type { Spot, ForecastData } from '@/lib/types';
import {
  formatWaveHeight,
  formatPeriod,
  formatWindSpeed,
  degreesToDirection,
  getScoreColor,
  calculateSurfScore,
} from '@/lib/utils/helpers';
import { format } from 'date-fns';

interface ForecastPopupProps {
  spot: Spot;
  currentConditions: ForecastData | null;
  isLoading?: boolean;
  error?: Error | null;
}

export default function ForecastPopup({
  spot,
  currentConditions,
  isLoading,
  error,
}: ForecastPopupProps) {
  const score = currentConditions
    ? calculateSurfScore({
        waveHeight: currentConditions.wave.height,
        wavePeriod: currentConditions.wave.period,
        waveDirection: currentConditions.wave.direction,
        windSpeed: currentConditions.wind.speed,
        windDirection: currentConditions.wind.direction,
        optimalSwellHeight:
          (spot.optimalSwell.minHeight + spot.optimalSwell.maxHeight) / 2,
        optimalSwellDirection: spot.optimalSwell.direction,
        optimalPeriod: spot.optimalSwell.minPeriod,
        spotFacing: spot.facing,
      })
    : null;

  return (
    <div className="min-w-[280px] max-w-[320px]">
      {/* Header */}
      <div className="border-b pb-2 mb-3">
        <h3 className="font-bold text-lg text-gray-900">{spot.name}</h3>
        <div className="flex items-center justify-between mt-1">
          <span className="text-xs text-gray-500 capitalize">{spot.type}</span>
          {spot.rating && (
            <div className="text-sm">{'⭐'.repeat(spot.rating)}</div>
          )}
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="py-4 text-center">
          <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-ocean-600"></div>
          <p className="text-sm text-gray-600 mt-2">Loading forecast...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="py-3 px-3 bg-red-50 rounded text-sm text-red-700">
          Failed to load forecast data
        </div>
      )}

      {/* Current Conditions */}
      {!isLoading && !error && currentConditions && (
        <>
          {/* Score Badge */}
          {score !== null && (
            <div className="mb-3 flex items-center justify-center">
              <div
                className="px-4 py-2 rounded-full text-white font-bold text-lg shadow-md"
                style={{ backgroundColor: getScoreColor(score) }}
              >
                Score: {score}/100
              </div>
            </div>
          )}

          {/* Wave Conditions */}
          <div className="space-y-2 mb-3">
            <div className="bg-blue-50 rounded p-2">
              <div className="text-xs text-gray-600 uppercase font-semibold mb-1">
                Wave
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Height:</span>
                <span className="font-semibold text-blue-700">
                  {formatWaveHeight(currentConditions.wave.height)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Period:</span>
                <span className="font-semibold text-blue-700">
                  {formatPeriod(currentConditions.wave.period)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Direction:</span>
                <span className="font-semibold text-blue-700">
                  {degreesToDirection(currentConditions.wave.direction)}
                </span>
              </div>
            </div>

            {/* Swell Conditions */}
            {currentConditions.swell && (
              <div className="bg-indigo-50 rounded p-2">
                <div className="text-xs text-gray-600 uppercase font-semibold mb-1">
                  Swell
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">Height:</span>
                  <span className="font-semibold text-indigo-700">
                    {formatWaveHeight(currentConditions.swell.height)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">Period:</span>
                  <span className="font-semibold text-indigo-700">
                    {formatPeriod(currentConditions.swell.period)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">Direction:</span>
                  <span className="font-semibold text-indigo-700">
                    {degreesToDirection(currentConditions.swell.direction)}
                  </span>
                </div>
              </div>
            )}

            {/* Wind Conditions */}
            <div className="bg-green-50 rounded p-2">
              <div className="text-xs text-gray-600 uppercase font-semibold mb-1">
                Wind
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Speed:</span>
                <span className="font-semibold text-green-700">
                  {formatWindSpeed(currentConditions.wind.speed)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Direction:</span>
                <span className="font-semibold text-green-700">
                  {degreesToDirection(currentConditions.wind.direction)}
                </span>
              </div>
            </div>
          </div>

          {/* Timestamp */}
          <div className="text-xs text-gray-500 text-center pt-2 border-t">
            Updated: {format(new Date(currentConditions.timestamp), 'PPp')}
          </div>
        </>
      )}

      {/* Spot Description */}
      {spot.description && (
        <div className="mt-3 pt-3 border-t">
          <p className="text-sm text-gray-600">{spot.description}</p>
        </div>
      )}
    </div>
  );
}
