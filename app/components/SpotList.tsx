'use client';

import { useMemo } from 'react';
import type { Spot } from '@/lib/types';
import { useFilterStore } from '@/lib/stores/filter-store';
import { useFavorites } from '@/lib/hooks/useFavorites';
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
    showOnlyFavorites,
  } = useFilterStore();
  const { isFavorite, favorites } = useFavorites();

  // For now, we'll just filter by search and type
  // Score and wave height filtering would need data from hooks
  const filteredSpots = useMemo(() => {
    let filtered = [...spots];

    // Favorites filter
    if (showOnlyFavorites) {
      filtered = filtered.filter((spot) => isFavorite(spot.id));
    }

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter((spot) =>
        spot.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Type filter
    filtered = filtered.filter((spot) => spotTypes.includes(spot.type));

    // Sort
    if (sortBy === 'name') {
      filtered.sort((a, b) => {
        const comparison = a.name.localeCompare(b.name);
        return sortDirection === 'asc' ? comparison : -comparison;
      });
    } else if (sortBy === 'favoriteDate') {
      // Sort by when the spot was favorited (most recent first by default)
      filtered.sort((a, b) => {
        const aFav = favorites.find((f) => f.spot_id === a.id);
        const bFav = favorites.find((f) => f.spot_id === b.id);

        if (!aFav || !bFav) return 0;

        const comparison = new Date(bFav.created_at).getTime() - new Date(aFav.created_at).getTime();
        return sortDirection === 'desc' ? comparison : -comparison;
      });
    }

    return filtered;
  }, [spots, searchQuery, spotTypes, sortBy, sortDirection, showOnlyFavorites, isFavorite, favorites]);

  if (filteredSpots.length === 0) {
    return (
      <div className="py-8 text-center">
        {showOnlyFavorites ? (
          <>
            <p className="text-gray-500 text-sm">No favorite spots yet</p>
            <p className="text-gray-400 text-xs mt-1">
              Click the ❤️ icon on any spot to add it to your favorites
            </p>
          </>
        ) : (
          <>
            <p className="text-gray-500 text-sm">No spots match your filters</p>
            <p className="text-gray-400 text-xs mt-1">
              Try adjusting your search or filters
            </p>
          </>
        )}
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
