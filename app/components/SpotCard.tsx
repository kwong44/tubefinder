'use client';

import { useMemo } from 'react';
import type { Spot } from '@/lib/types';
import { useForecast, getCurrentConditions } from '@/lib/hooks/useForecast';
import {
  formatWaveHeight,
  calculateSurfScore,
  getScoreColor,
} from '@/lib/utils/helpers';

interface SpotCardProps {
  spot: Spot;
  onClick?: () => void;
}

export default function SpotCard({ spot, onClick }: SpotCardProps) {
  const { data, isLoading } = useForecast(spot.location);

  const currentConditions = useMemo(() => {
    return getCurrentConditions(data?.forecast);
  }, [data]);

  const score = useMemo(() => {
    if (!currentConditions) return null;

    return calculateSurfScore({
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
    });
  }, [currentConditions, spot]);

  return (
    <div
      className="border border-gray-200 rounded-lg p-3 hover:border-ocean-400 hover:shadow-md transition cursor-pointer"
      onClick={onClick}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1">
          <h3 className="font-semibold text-ocean-800">{spot.name}</h3>
          <p className="text-xs text-gray-500">
            {spot.location.lat.toFixed(2)}, {spot.location.lng.toFixed(2)}
          </p>
        </div>
        {spot.rating && (
          <div className="text-yellow-500 text-xs">
            {'⭐'.repeat(spot.rating)}
          </div>
        )}
      </div>

      {/* Description */}
      {spot.description && (
        <p className="text-sm text-gray-600 mb-2">{spot.description}</p>
      )}

      {/* Current Conditions */}
      {isLoading && (
        <div className="flex items-center justify-center py-2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-ocean-600"></div>
          <span className="ml-2 text-xs text-gray-500">Loading...</span>
        </div>
      )}

      {!isLoading && currentConditions && (
        <div className="space-y-2">
          {/* Score Badge */}
          {score !== null && (
            <div className="flex items-center justify-center">
              <div
                className="px-3 py-1 rounded-full text-white text-xs font-bold"
                style={{ backgroundColor: getScoreColor(score) }}
              >
                Score: {score}/100
              </div>
            </div>
          )}

          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-blue-50 rounded px-2 py-1">
              <div className="text-gray-600">Wave</div>
              <div className="font-semibold text-blue-700">
                {formatWaveHeight(currentConditions.wave.height)}
              </div>
            </div>
            <div className="bg-green-50 rounded px-2 py-1">
              <div className="text-gray-600">Wind</div>
              <div className="font-semibold text-green-700">
                {(currentConditions.wind.speed * 3.6).toFixed(0)} km/h
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
