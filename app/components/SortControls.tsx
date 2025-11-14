'use client';

import { useFilterStore } from '@/lib/stores/filter-store';
import { ArrowUpDown, TrendingUp, Waves, SortAsc, Clock } from 'lucide-react';

export default function SortControls() {
  const { sortBy, sortDirection, setSortBy, toggleSortDirection, showOnlyFavorites } =
    useFilterStore();

  const baseOptions = [
    { value: 'score' as const, label: 'Score', icon: TrendingUp },
    { value: 'waveHeight' as const, label: 'Wave Height', icon: Waves },
    { value: 'name' as const, label: 'Name', icon: SortAsc },
  ];

  const favoriteOption = {
    value: 'favoriteDate' as const,
    label: 'Recent',
    icon: Clock,
  };

  const options = showOnlyFavorites
    ? [favoriteOption, ...baseOptions]
    : baseOptions;

  return (
    <div className="flex items-center gap-2">
      <div className="flex bg-gray-100 rounded-lg p-1">
        {options.map((option) => {
          const Icon = option.icon;
          const isActive = sortBy === option.value;

          return (
            <button
              key={option.value}
              onClick={() => setSortBy(option.value)}
              className={`flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded transition ${
                isActive
                  ? 'bg-white text-ocean-700 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">{option.label}</span>
            </button>
          );
        })}
      </div>

      <button
        onClick={toggleSortDirection}
        className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition"
        title={`Sort ${sortDirection === 'asc' ? 'Ascending' : 'Descending'}`}
      >
        <ArrowUpDown
          className={`h-4 w-4 text-gray-600 transition-transform ${
            sortDirection === 'desc' ? 'rotate-180' : ''
          }`}
        />
      </button>
    </div>
  );
}
