'use client';

import { useMemo } from 'react';
import type { Spot } from '@/lib/types';
import { useForecast, getCurrentConditions } from '@/lib/hooks/useForecast';
import { useMapStore } from '@/lib/stores/map-store';
import { useUIStore } from '@/lib/stores/ui-store';
import FavoriteButton from './spots/FavoriteButton';
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
  const { selectedDate } = useMapStore();
  const { openSignInModal } = useUIStore();

  const currentConditions = useMemo(() => {
    return getCurrentConditions(data?.forecast, selectedDate);
  }, [data, selectedDate]);

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

  // Calculate trend (comparing current to 6 hours from now)
  const trend = useMemo(() => {
    if (!data?.forecast || data.forecast.length < 7) return null;

    const futureConditions = data.forecast[6]; // 6 hours from now
    const futureScore = calculateSurfScore({
      waveHeight: futureConditions.wave.height,
      wavePeriod: futureConditions.wave.period,
      waveDirection: futureConditions.wave.direction,
      windSpeed: futureConditions.wind.speed,
      windDirection: futureConditions.wind.direction,
      optimalSwellHeight:
        (spot.optimalSwell.minHeight + spot.optimalSwell.maxHeight) / 2,
      optimalSwellDirection: spot.optimalSwell.direction,
      optimalPeriod: spot.optimalSwell.minPeriod,
      spotFacing: spot.facing,
    });

    if (score === null) return null;

    const diff = futureScore - score;
    if (diff > 10) return 'improving';
    if (diff < -10) return 'worsening';
    return 'stable';
  }, [data, score, spot]);

  return (
    <div
      className="border border-gray-200 rounded-lg p-4 hover:border-ocean-400 hover:shadow-md transition cursor-pointer active:scale-98 touch-manipulation"
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          onClick?.();
        }
      }}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1">
          <h3 className="font-semibold text-ocean-800">{spot.name}</h3>
          <p className="text-xs text-gray-500">
            {spot.location.lat.toFixed(2)}, {spot.location.lng.toFixed(2)}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <FavoriteButton
            spotId={spot.id}
            size="md"
            onAuthRequired={() => openSignInModal('Sign in to save your favorite spots! 🌊')}
          />
          {spot.rating && (
            <div className="text-yellow-500 text-xs">
              {'⭐'.repeat(spot.rating)}
            </div>
          )}
        </div>
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
          {/* Score Badge with Trend */}
          {score !== null && (
            <div className="flex items-center justify-center gap-2">
              <div
                className="px-4 py-1.5 rounded-full text-white text-sm font-bold shadow-sm"
                style={{ backgroundColor: getScoreColor(score) }}
              >
                {score}/100
              </div>
              {trend === 'improving' && (
                <span className="text-green-600 text-lg" title="Improving conditions">
                  ↗
                </span>
              )}
              {trend === 'worsening' && (
                <span className="text-red-600 text-lg" title="Worsening conditions">
                  ↘
                </span>
              )}
              {trend === 'stable' && (
                <span className="text-gray-500 text-lg" title="Stable conditions">
                  →
                </span>
              )}
            </div>
          )}

          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="bg-blue-50 rounded-lg px-3 py-2">
              <div className="text-gray-600 text-xs">Wave</div>
              <div className="font-semibold text-blue-700 mt-0.5">
                {formatWaveHeight(currentConditions.wave.height)}
              </div>
            </div>
            <div className="bg-green-50 rounded-lg px-3 py-2">
              <div className="text-gray-600 text-xs">Wind</div>
              <div className="font-semibold text-green-700 mt-0.5">
                {(currentConditions.wind.speed * 3.6).toFixed(0)} km/h
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
