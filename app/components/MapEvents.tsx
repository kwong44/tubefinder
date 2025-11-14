'use client';

import { useMapEvents } from 'react-leaflet';
import { useMapStore } from '@/lib/stores/map-store';

/**
 * Component to handle map events and sync with store
 * Must be used inside a MapContainer
 */
export default function MapEvents() {
  const { setBounds, setZoom, setCenter } = useMapStore();

  const map = useMapEvents({
    moveend: () => {
      const bounds = map.getBounds();
      const center = map.getCenter();
      const zoom = map.getZoom();

      setBounds({
        north: bounds.getNorth(),
        south: bounds.getSouth(),
        east: bounds.getEast(),
        west: bounds.getWest(),
      });
      setCenter({ lat: center.lat, lng: center.lng });
      setZoom(zoom);
    },
  });

  return null;
}
