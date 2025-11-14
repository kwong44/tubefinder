import type { Spot } from '@/lib/types';
import type { SortOption, SortDirection } from '@/lib/stores/filter-store';

interface SpotWithScore extends Spot {
  score?: number | null;
  currentWaveHeight?: number;
}

export function filterSpots(
  spots: SpotWithScore[],
  filters: {
    searchQuery: string;
    minScore: number;
    maxScore: number;
    minWaveHeight: number;
    maxWaveHeight: number;
    spotTypes: Spot['type'][];
  }
): SpotWithScore[] {
  return spots.filter((spot) => {
    // Search filter
    if (
      filters.searchQuery &&
      !spot.name.toLowerCase().includes(filters.searchQuery.toLowerCase())
    ) {
      return false;
    }

    // Score filter
    if (
      spot.score !== null &&
      spot.score !== undefined &&
      (spot.score < filters.minScore || spot.score > filters.maxScore)
    ) {
      return false;
    }

    // Wave height filter
    if (
      spot.currentWaveHeight !== undefined &&
      (spot.currentWaveHeight < filters.minWaveHeight ||
        spot.currentWaveHeight > filters.maxWaveHeight)
    ) {
      return false;
    }

    // Spot type filter
    if (!filters.spotTypes.includes(spot.type)) {
      return false;
    }

    return true;
  });
}

export function sortSpots(
  spots: SpotWithScore[],
  sortBy: SortOption,
  sortDirection: SortDirection
): SpotWithScore[] {
  const sorted = [...spots].sort((a, b) => {
    let comparison = 0;

    switch (sortBy) {
      case 'score':
        comparison = (a.score ?? 0) - (b.score ?? 0);
        break;
      case 'waveHeight':
        comparison =
          (a.currentWaveHeight ?? 0) - (b.currentWaveHeight ?? 0);
        break;
      case 'name':
        comparison = a.name.localeCompare(b.name);
        break;
    }

    return sortDirection === 'asc' ? comparison : -comparison;
  });

  return sorted;
}
