'use client';

import { useMemo } from 'react';
import type { Spot } from '@/lib/types';
import { useFilterStore } from '@/lib/stores/filter-store';
import SpotCard from './SpotCard';

interface SpotListProps {
  spots: readonly Spot[];
}

// Individual spot cards handle their own data fetching
function SpotWithForecast({ spot }: { spot: Spot }) {
  return <SpotCard key={spot.id} spot={spot} />;
}

export default function SpotList({ spots }: SpotListProps) {
  const {
    searchQuery,
    spotTypes,
    sortBy,
    sortDirection,
  } = useFilterStore();

  // For now, we'll just filter by search and type
  // Score and wave height filtering would need data from hooks
  const filteredSpots = useMemo(() => {
    let filtered = [...spots];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter((spot) =>
        spot.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Type filter
    filtered = filtered.filter((spot) => spotTypes.includes(spot.type));

    // Sort by name for now (score/wave height would need data)
    if (sortBy === 'name') {
      filtered.sort((a, b) => {
        const comparison = a.name.localeCompare(b.name);
        return sortDirection === 'asc' ? comparison : -comparison;
      });
    }

    return filtered;
  }, [spots, searchQuery, spotTypes, sortBy, sortDirection]);

  if (filteredSpots.length === 0) {
    return (
      <div className="py-8 text-center">
        <p className="text-gray-500 text-sm">No spots match your filters</p>
        <p className="text-gray-400 text-xs mt-1">
          Try adjusting your search or filters
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {filteredSpots.map((spot) => (
        <SpotWithForecast key={spot.id} spot={spot} />
      ))}
    </div>
  );
}
