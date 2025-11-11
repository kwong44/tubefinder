'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import type { Spot } from '@/lib/types';
import { FAMOUS_SPOTS } from '@/lib/utils/constants';

// Dynamically import Leaflet components to avoid SSR issues
const MapContainer = dynamic(
  () => import('react-leaflet').then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import('react-leaflet').then((mod) => mod.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import('react-leaflet').then((mod) => mod.Marker),
  { ssr: false }
);
const Popup = dynamic(
  () => import('react-leaflet').then((mod) => mod.Popup),
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
    <div className={className}>
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
          <Marker key={spot.id} position={[spot.location.lat, spot.location.lng]}>
            <Popup>
              <div className="p-2">
                <h3 className="font-bold text-lg">{spot.name}</h3>
                <p className="text-sm text-gray-600">{spot.type}</p>
                {spot.description && (
                  <p className="text-sm mt-2">{spot.description}</p>
                )}
                {spot.rating && (
                  <div className="mt-2 text-yellow-500">
                    {'⭐'.repeat(spot.rating)}
                  </div>
                )}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
