import { create } from 'zustand';
import type { Spot } from '@/lib/types';

export type SortOption = 'score' | 'waveHeight' | 'name';
export type SortDirection = 'asc' | 'desc';

export interface FilterPreset {
  id: string;
  name: string;
  filters: {
    searchQuery: string;
    minScore: number;
    maxScore: number;
    minWaveHeight: number;
    maxWaveHeight: number;
    spotTypes: Spot['type'][];
    sortBy: SortOption;
    sortDirection: SortDirection;
  };
}

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

  // Presets
  presets: FilterPreset[];
  savePreset: (name: string) => void;
  loadPreset: (id: string) => void;
  deletePreset: (id: string) => void;

  // Reset
  resetFilters: () => void;
}

const STORAGE_KEY = 'tubefinder-filter-presets';

// Load presets from localStorage
function loadPresetsFromStorage(): FilterPreset[] {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

// Save presets to localStorage
function savePresetsToStorage(presets: FilterPreset[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(presets));
  } catch (error) {
    console.error('Failed to save presets:', error);
  }
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

export const useFilterStore = create<FilterState>((set, get) => ({
  ...initialState,
  presets: loadPresetsFromStorage(),

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

  savePreset: (name) => {
    const state = get();
    const newPreset: FilterPreset = {
      id: `preset-${Date.now()}`,
      name,
      filters: {
        searchQuery: state.searchQuery,
        minScore: state.minScore,
        maxScore: state.maxScore,
        minWaveHeight: state.minWaveHeight,
        maxWaveHeight: state.maxWaveHeight,
        spotTypes: [...state.spotTypes],
        sortBy: state.sortBy,
        sortDirection: state.sortDirection,
      },
    };
    const updatedPresets = [...state.presets, newPreset];
    savePresetsToStorage(updatedPresets);
    set({ presets: updatedPresets });
  },

  loadPreset: (id) => {
    const state = get();
    const preset = state.presets.find((p) => p.id === id);
    if (preset) {
      set({
        searchQuery: preset.filters.searchQuery,
        minScore: preset.filters.minScore,
        maxScore: preset.filters.maxScore,
        minWaveHeight: preset.filters.minWaveHeight,
        maxWaveHeight: preset.filters.maxWaveHeight,
        spotTypes: [...preset.filters.spotTypes],
        sortBy: preset.filters.sortBy,
        sortDirection: preset.filters.sortDirection,
      });
    }
  },

  deletePreset: (id) => {
    const state = get();
    const updatedPresets = state.presets.filter((p) => p.id !== id);
    savePresetsToStorage(updatedPresets);
    set({ presets: updatedPresets });
  },

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
