'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import type { Spot } from '@/lib/types';
import { FAMOUS_SPOTS } from '@/lib/utils/constants';
import SpotMarker from './SpotMarker';
import MapLegend from './MapLegend';

// Dynamically import Leaflet components to avoid SSR issues
const MapContainer = dynamic(
  () => import('react-leaflet').then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import('react-leaflet').then((mod) => mod.TileLayer),
  { ssr: false }
);

interface MapProps {
  spots?: readonly Spot[];
  className?: string;
}

export default function Map({ spots = FAMOUS_SPOTS, className = '' }: MapProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div className={`${className} bg-ocean-100 flex items-center justify-center`}>
        <div className="text-ocean-600">Loading map...</div>
      </div>
    );
  }

  return (
    <div className={`${className} relative`}>
      <MapContainer
        center={[0, 115]}
        zoom={5}
        className="h-full w-full"
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {spots.map((spot) => (
          <SpotMarker key={spot.id} spot={spot} />
        ))}
      </MapContainer>

      {/* Legend overlay */}
      <MapLegend />
    </div>
  );
}
