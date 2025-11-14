import { create } from 'zustand';
import type { Spot } from '@/lib/types';

export type SortOption = 'score' | 'waveHeight' | 'name';
export type SortDirection = 'asc' | 'desc';

interface FilterState {
  // Search
  searchQuery: string;
  setSearchQuery: (query: string) => void;

  // Filters
  minScore: number;
  maxScore: number;
  setScoreRange: (min: number, max: number) => void;

  minWaveHeight: number;
  maxWaveHeight: number;
  setWaveHeightRange: (min: number, max: number) => void;

  spotTypes: Spot['type'][];
  toggleSpotType: (type: Spot['type']) => void;

  // Sort
  sortBy: SortOption;
  sortDirection: SortDirection;
  setSortBy: (option: SortOption) => void;
  toggleSortDirection: () => void;

  // UI State
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;

  // Reset
  resetFilters: () => void;
}

const initialState = {
  searchQuery: '',
  minScore: 0,
  maxScore: 100,
  minWaveHeight: 0,
  maxWaveHeight: 10,
  spotTypes: ['reef', 'beach', 'point', 'unknown'] as Spot['type'][],
  sortBy: 'score' as SortOption,
  sortDirection: 'desc' as SortDirection,
  isSidebarOpen: true,
};

export const useFilterStore = create<FilterState>((set) => ({
  ...initialState,

  setSearchQuery: (query) => set({ searchQuery: query }),

  setScoreRange: (min, max) => set({ minScore: min, maxScore: max }),

  setWaveHeightRange: (min, max) =>
    set({ minWaveHeight: min, maxWaveHeight: max }),

  toggleSpotType: (type) =>
    set((state) => {
      const spotTypes = state.spotTypes.includes(type)
        ? state.spotTypes.filter((t) => t !== type)
        : [...state.spotTypes, type];
      return { spotTypes };
    }),

  setSortBy: (option) => set({ sortBy: option }),

  toggleSortDirection: () =>
    set((state) => ({
      sortDirection: state.sortDirection === 'asc' ? 'desc' : 'asc',
    })),

  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),

  setSidebarOpen: (open) => set({ isSidebarOpen: open }),

  resetFilters: () =>
    set({
      searchQuery: '',
      minScore: 0,
      maxScore: 100,
      minWaveHeight: 0,
      maxWaveHeight: 10,
      spotTypes: ['reef', 'beach', 'point', 'unknown'],
    }),
}));
