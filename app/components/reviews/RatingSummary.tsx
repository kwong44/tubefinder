'use client';

import RatingStars from './RatingStars';
import type { RatingSummary as RatingSummaryType } from '@/lib/types/ratings';

interface RatingSummaryProps {
  summary: RatingSummaryType;
  showDistribution?: boolean;
}

export default function RatingSummary({ summary, showDistribution = true }: RatingSummaryProps) {
  const { average_rating, total_ratings, rating_distribution } = summary;

  return (
    <div className="space-y-3">
      {/* Average Rating */}
      <div className="flex items-center gap-4">
        <div className="text-center">
          <div className="text-4xl font-bold text-gray-900">
            {average_rating.toFixed(1)}
          </div>
          <div className="text-sm text-gray-500 mt-1">
            out of 5
          </div>
        </div>

        <div className="flex-1">
          <RatingStars rating={average_rating} readonly size="lg" />
          <p className="text-sm text-gray-600 mt-1">
            {total_ratings} {total_ratings === 1 ? 'rating' : 'ratings'}
          </p>
        </div>
      </div>

      {/* Rating Distribution */}
      {showDistribution && (
        <div className="space-y-2 pt-3 border-t border-gray-200">
          {[5, 4, 3, 2, 1].map((stars) => {
            const count = rating_distribution[stars as keyof typeof rating_distribution];
            const percentage = total_ratings > 0 ? (count / total_ratings) * 100 : 0;

            return (
              <div key={stars} className="flex items-center gap-2 text-sm">
                <span className="w-8 text-gray-600">{stars}★</span>

                <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-yellow-400 transition-all duration-300"
                    style={{ width: `${percentage}%` }}
                  />
                </div>

                <span className="w-12 text-right text-gray-500 text-xs">
                  {count}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
