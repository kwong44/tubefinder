'use client';

import { useState } from 'react';
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
import { Star } from 'lucide-react';
import ForecastChart from './ForecastChart';
import DirectionArrow from './DirectionArrow';
import FavoriteButton from './spots/FavoriteButton';
import BuoyObservationCard from './data/BuoyObservationCard';
import TideChart from './data/TideChart';
import DataSourceBadge from './data/DataSourceBadge';
import RatingSummary from './reviews/RatingSummary';
import ReviewList from './reviews/ReviewList';
import WriteReviewModal from './reviews/WriteReviewModal';
import { useUIStore } from '@/lib/stores/ui-store';
import { useAuthStore } from '@/lib/stores/auth-store';
import { useBuoyData } from '@/lib/hooks/useBuoyData';
import { useTideData } from '@/lib/hooks/useTideData';
import { useSpotRatings } from '@/lib/hooks/useSpotRatings';

interface ForecastPopupProps {
  spot: Spot;
  currentConditions: ForecastData | null;
  fullForecast?: ForecastData[];
  isLoading?: boolean;
  error?: Error | null;
}

export default function ForecastPopup({
  spot,
  currentConditions,
  fullForecast,
  isLoading,
  error,
}: ForecastPopupProps) {
  const [chartView, setChartView] = useState<'24h' | '7d'>('24h');
  const [isWriteReviewOpen, setIsWriteReviewOpen] = useState(false);
  const { openSignInModal } = useUIStore();
  const { user } = useAuthStore();

  // Fetch buoy and tide data
  const { observation, buoyStation, hasBuoyData } = useBuoyData(spot.id);
  const { tideSummary, hasTideData } = useTideData(spot.id);

  // Fetch ratings
  const { ratingSummary } = useSpotRatings(spot.id);

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
        <div className="flex items-start justify-between">
          <h3 className="font-bold text-lg text-gray-900 flex-1">{spot.name}</h3>
          <FavoriteButton
            spotId={spot.id}
            size="lg"
            onAuthRequired={() => openSignInModal('Sign in to save your favorite spots! 🌊')}
          />
        </div>
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
              <div className="flex items-center justify-between mb-1">
                <div className="text-xs text-gray-600 uppercase font-semibold">
                  Wave
                </div>
                <DataSourceBadge source="open-meteo" size="sm" showLabel={false} />
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
                <div className="flex items-center gap-1">
                  <DirectionArrow
                    direction={currentConditions.wave.direction}
                    size={16}
                    color="#1d4ed8"
                  />
                  <span className="font-semibold text-blue-700">
                    {degreesToDirection(currentConditions.wave.direction)}
                  </span>
                </div>
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
                  <div className="flex items-center gap-1">
                    <DirectionArrow
                      direction={currentConditions.swell.direction}
                      size={16}
                      color="#4f46e5"
                    />
                    <span className="font-semibold text-indigo-700">
                      {degreesToDirection(currentConditions.swell.direction)}
                    </span>
                  </div>
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
                <div className="flex items-center gap-1">
                  <DirectionArrow
                    direction={currentConditions.wind.direction}
                    size={16}
                    color="#15803d"
                  />
                  <span className="font-semibold text-green-700">
                    {degreesToDirection(currentConditions.wind.direction)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Timestamp */}
          <div className="text-xs text-gray-500 text-center pt-2 border-t">
            Updated: {format(new Date(currentConditions.timestamp), 'PPp')}
          </div>

          {/* Buoy Observations */}
          {hasBuoyData && observation && buoyStation && (
            <div className="mt-4">
              <BuoyObservationCard
                observation={observation}
                buoyStation={buoyStation}
                compact={true}
              />
            </div>
          )}

          {/* Tide Predictions */}
          {hasTideData && tideSummary && (
            <div className="mt-4">
              <TideChart tideSummary={tideSummary} compact={true} />
            </div>
          )}

          {/* Forecast Chart */}
          {fullForecast && fullForecast.length > 0 && (
            <div className="mt-4 pt-4 border-t">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-semibold text-gray-700">
                  Forecast
                </h4>
                <div className="flex gap-1">
                  <button
                    onClick={() => setChartView('24h')}
                    className={`px-2 py-1 text-xs rounded ${
                      chartView === '24h'
                        ? 'bg-ocean-600 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    24h
                  </button>
                  <button
                    onClick={() => setChartView('7d')}
                    className={`px-2 py-1 text-xs rounded ${
                      chartView === '7d'
                        ? 'bg-ocean-600 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    7d
                  </button>
                </div>
              </div>
              <ForecastChart forecast={fullForecast} type={chartView} />
            </div>
          )}
        </>
      )}

      {/* Spot Description */}
      {spot.description && (
        <div className="mt-3 pt-3 border-t">
          <p className="text-sm text-gray-600">{spot.description}</p>
        </div>
      )}

      {/* Reviews Section */}
      <div className="mt-4 pt-4 border-t">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-sm font-semibold text-gray-700">Reviews</h4>
          <button
            onClick={() => {
              if (!user) {
                openSignInModal('Sign in to write a review! 📝');
                return;
              }
              setIsWriteReviewOpen(true);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-ocean-600 hover:bg-ocean-700 text-white text-sm font-medium rounded-lg transition"
          >
            <Star className="h-4 w-4" />
            <span>Write Review</span>
          </button>
        </div>

        {/* Rating Summary */}
        {ratingSummary && (
          <div className="mb-4">
            <RatingSummary summary={ratingSummary} showDistribution={false} />
          </div>
        )}

        {/* Reviews List */}
        <ReviewList spotId={spot.id} />
      </div>

      {/* Write Review Modal */}
      <WriteReviewModal
        isOpen={isWriteReviewOpen}
        onClose={() => setIsWriteReviewOpen(false)}
        spotId={spot.id}
        spotName={spot.name}
      />
    </div>
  );
}
