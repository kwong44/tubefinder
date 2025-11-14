import { create } from 'zustand';
import type { Coordinates, MapBounds } from '@/lib/types';

interface MapState {
  center: Coordinates;
  zoom: number;
  bounds: MapBounds | null;
  selectedSpotId: string | null;
  selectedDate: Date | null; // null = current/live forecast
  setCenter: (center: Coordinates) => void;
  setZoom: (zoom: number) => void;
  setBounds: (bounds: MapBounds) => void;
  setSelectedSpot: (spotId: string | null) => void;
  setSelectedDate: (date: Date | null) => void;
}

// Default center: Indonesia/Philippines region
const DEFAULT_CENTER: Coordinates = { lat: 0, lng: 115 };
const DEFAULT_ZOOM = 5;

export const useMapStore = create<MapState>((set) => ({
  center: DEFAULT_CENTER,
  zoom: DEFAULT_ZOOM,
  bounds: null,
  selectedSpotId: null,
  selectedDate: null, // null = live/current forecast
  setCenter: (center) => set({ center }),
  setZoom: (zoom) => set({ zoom }),
  setBounds: (bounds) => set({ bounds }),
  setSelectedSpot: (spotId) => set({ selectedSpotId: spotId }),
  setSelectedDate: (date) => set({ selectedDate: date }),
}));
