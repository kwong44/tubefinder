'use client';

import { useState } from 'react';
import { useFilterStore } from '@/lib/stores/filter-store';
import { useAuthStore } from '@/lib/stores/auth-store';
import { useUIStore } from '@/lib/stores/ui-store';
import { Filter, X, ChevronDown, ChevronUp, Heart } from 'lucide-react';
import PresetManager from './PresetManager';

export default function FilterPanel() {
  const [isExpanded, setIsExpanded] = useState(false);
  const {
    minScore,
    maxScore,
    setScoreRange,
    minWaveHeight,
    maxWaveHeight,
    setWaveHeightRange,
    spotTypes,
    toggleSpotType,
    showOnlyFavorites,
    setShowOnlyFavorites,
    resetFilters,
  } = useFilterStore();
  const { user } = useAuthStore();
  const { openSignInModal } = useUIStore();

  const hasActiveFilters =
    minScore > 0 ||
    maxScore < 100 ||
    minWaveHeight > 0 ||
    maxWaveHeight < 10 ||
    spotTypes.length < 4 ||
    showOnlyFavorites;

  return (
    <div className="bg-gray-50 rounded-lg border border-gray-200">
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-100 transition rounded-t-lg"
      >
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-gray-600" />
          <span className="font-semibold text-sm text-gray-700">Filters</span>
          {hasActiveFilters && (
            <span className="bg-ocean-600 text-white text-xs px-2 py-0.5 rounded-full">
              Active
            </span>
          )}
        </div>
        {isExpanded ? (
          <ChevronUp className="h-4 w-4 text-gray-600" />
        ) : (
          <ChevronDown className="h-4 w-4 text-gray-600" />
        )}
      </button>

      {/* Filter Content */}
      {isExpanded && (
        <div className="px-4 pb-4 space-y-4 border-t border-gray-200">
          {/* Preset Manager */}
          <div className="pt-2">
            <PresetManager />
          </div>

          {/* Divider */}
          <div className="border-t border-gray-200"></div>

          {/* Favorites Toggle */}
          <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200">
            <div className="flex items-center gap-2">
              <Heart className="h-4 w-4 text-red-500 fill-current" />
              <span className="text-sm font-medium text-gray-700">
                Show Only Favorites
              </span>
            </div>
            <button
              onClick={() => {
                if (!user) {
                  openSignInModal('Sign in to filter by your favorite spots! 🌊');
                  return;
                }
                setShowOnlyFavorites(!showOnlyFavorites);
              }}
              className={`
                relative inline-flex h-6 w-11 items-center rounded-full transition-colors
                ${showOnlyFavorites && user ? 'bg-ocean-600' : 'bg-gray-300'}
                ${!user ? 'opacity-50' : 'hover:opacity-80'}
              `}
              aria-label="Toggle favorites filter"
            >
              <span
                className={`
                  inline-block h-4 w-4 transform rounded-full bg-white transition-transform
                  ${showOnlyFavorites && user ? 'translate-x-6' : 'translate-x-1'}
                `}
              />
            </button>
          </div>

          {/* Score Range */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-2">
              Surf Score: {minScore}-{maxScore}
            </label>
            <div className="flex gap-2 items-center">
              <input
                type="range"
                min="0"
                max="100"
                value={minScore}
                onChange={(e) =>
                  setScoreRange(
                    Number(e.target.value),
                    Math.max(Number(e.target.value), maxScore)
                  )
                }
                className="flex-1"
              />
              <input
                type="range"
                min="0"
                max="100"
                value={maxScore}
                onChange={(e) =>
                  setScoreRange(
                    Math.min(minScore, Number(e.target.value)),
                    Number(e.target.value)
                  )
                }
                className="flex-1"
              />
            </div>
          </div>

          {/* Wave Height Range */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-2">
              Wave Height: {minWaveHeight}m - {maxWaveHeight}m
            </label>
            <div className="flex gap-2 items-center">
              <input
                type="range"
                min="0"
                max="10"
                step="0.5"
                value={minWaveHeight}
                onChange={(e) =>
                  setWaveHeightRange(
                    Number(e.target.value),
                    Math.max(Number(e.target.value), maxWaveHeight)
                  )
                }
                className="flex-1"
              />
              <input
                type="range"
                min="0"
                max="10"
                step="0.5"
                value={maxWaveHeight}
                onChange={(e) =>
                  setWaveHeightRange(
                    Math.min(minWaveHeight, Number(e.target.value)),
                    Number(e.target.value)
                  )
                }
                className="flex-1"
              />
            </div>
          </div>

          {/* Spot Types */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-2">
              Spot Type
            </label>
            <div className="grid grid-cols-2 gap-2">
              {(['reef', 'beach', 'point', 'unknown'] as const).map((type) => (
                <label
                  key={type}
                  className="flex items-center gap-2 text-sm cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={spotTypes.includes(type)}
                    onChange={() => toggleSpotType(type)}
                    className="rounded border-gray-300 text-ocean-600 focus:ring-ocean-500"
                  />
                  <span className="capitalize text-gray-700">{type}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Reset Button */}
          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition"
            >
              <X className="h-4 w-4" />
              Reset Filters
            </button>
          )}
        </div>
      )}
    </div>
  );
}
