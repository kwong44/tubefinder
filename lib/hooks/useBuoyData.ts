'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchBuoyObservation } from '@/lib/services/observations-api';
import { getNearestBuoy } from '@/lib/utils/buoy-stations';
import type { BuoyObservation, BuoyStation } from '@/lib/types/observations';

/**
 * Hook to fetch real-time buoy observations for a surf spot
 */
export function useBuoyData(spotId: string) {
  // Find the nearest buoy station for this spot
  const buoyStation: BuoyStation | null = getNearestBuoy(spotId);

  const {
    data: observation,
    isLoading,
    error,
    refetch,
  } = useQuery<BuoyObservation | null>({
    queryKey: ['buoy', buoyStation?.id],
    queryFn: () => {
      if (!buoyStation) return Promise.resolve(null);
      return fetchBuoyObservation(buoyStation.id);
    },
    enabled: !!buoyStation,
    staleTime: 10 * 60 * 1000, // 10 minutes (buoy data updates every 30-60 min)
    gcTime: 30 * 60 * 1000, // 30 minutes
    retry: 2,
    retryDelay: 1000,
  });

  return {
    observation,
    buoyStation,
    isLoading,
    error,
    refetch,
    hasBuoyData: !!buoyStation && !!observation,
  };
}
