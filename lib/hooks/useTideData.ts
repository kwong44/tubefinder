'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchTidePredictions } from '@/lib/services/observations-api';
import { getNearestTideStation } from '@/lib/utils/buoy-stations';
import type { TideSummary, TideStation } from '@/lib/types/observations';

/**
 * Hook to fetch tide predictions for a surf spot
 */
export function useTideData(spotId: string, days: number = 3) {
  // Find the nearest tide station for this spot
  const tideStation: TideStation | null = getNearestTideStation(spotId);

  const {
    data: tideSummary,
    isLoading,
    error,
    refetch,
  } = useQuery<TideSummary | null>({
    queryKey: ['tide', tideStation?.id, days],
    queryFn: () => {
      if (!tideStation) return Promise.resolve(null);

      const now = new Date();
      const end = new Date(now);
      end.setDate(end.getDate() + days);

      return fetchTidePredictions(tideStation.id, now, end);
    },
    enabled: !!tideStation,
    staleTime: 60 * 60 * 1000, // 1 hour (tide predictions don't change frequently)
    gcTime: 2 * 60 * 60 * 1000, // 2 hours
    retry: 2,
    retryDelay: 1000,
  });

  return {
    tideSummary,
    tideStation,
    isLoading,
    error,
    refetch,
    hasTideData: !!tideStation && !!tideSummary,
  };
}
