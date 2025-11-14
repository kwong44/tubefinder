'use client';

import { useMemo, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import type { Spot } from '@/lib/types';
import { useForecast, getCurrentConditions } from '@/lib/hooks/useForecast';
import { calculateSurfScore, getScoreColor } from '@/lib/utils/helpers';
import ForecastPopup from './ForecastPopup';

const Marker = dynamic(
  () => import('react-leaflet').then((mod) => mod.Marker),
  { ssr: false }
);
const Popup = dynamic(
  () => import('react-leaflet').then((mod) => mod.Popup),
  { ssr: false }
);

interface SpotMarkerProps {
  spot: Spot;
}

/**
 * Create a custom colored marker icon based on surf score
 */
function createColoredIcon(color: string, isLoading: boolean, L: any) {
  const svg = isLoading
    ? `<svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
        <circle cx="16" cy="16" r="12" fill="#94a3b8" stroke="white" stroke-width="3"/>
        <circle cx="16" cy="16" r="5" fill="white"/>
      </svg>`
    : `<svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
        <circle cx="16" cy="16" r="12" fill="${color}" stroke="white" stroke-width="3"/>
        <path d="M16 8 L20 14 L12 14 Z" fill="white"/>
        <circle cx="16" cy="18" r="2" fill="white"/>
      </svg>`;

  return new L.Icon({
    iconUrl: `data:image/svg+xml;base64,${btoa(svg)}`,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16],
  });
}

export default function SpotMarker({ spot }: SpotMarkerProps) {
  const [L, setL] = useState<any>(null);
  const { data, isLoading, error } = useForecast(spot.location);

  useEffect(() => {
    // Dynamically import Leaflet only on client side
    import('leaflet').then((leaflet) => {
      setL(leaflet.default);
    });
  }, []);

  const currentConditions = useMemo(() => {
    return getCurrentConditions(data?.forecast);
  }, [data]);

  const score = useMemo(() => {
    if (!currentConditions) return null;

    return calculateSurfScore({
      waveHeight: currentConditions.wave.height,
      wavePeriod: currentConditions.wave.period,
      waveDirection: currentConditions.wave.direction,
      windSpeed: currentConditions.wind.speed,
      windDirection: currentConditions.wind.direction,
      optimalSwellHeight:
        (spot.optimalSwell.minHeight + spot.optimalSwell.maxHeight) / 2,
      optimalSwellDirection: spot.optimalSwell.direction,
      optimalPeriod: spot.optimalSwell.minPeriod,
      spotFacing: spot.facing,
    });
  }, [currentConditions, spot]);

  const markerIcon = useMemo(() => {
    if (!L) return undefined;
    const color = score !== null ? getScoreColor(score) : '#3b82f6';
    return createColoredIcon(color, isLoading, L);
  }, [score, isLoading, L]);

  if (!L || !markerIcon) {
    return null;
  }

  return (
    <Marker
      position={[spot.location.lat, spot.location.lng]}
      icon={markerIcon}
    >
      <Popup maxWidth={350} minWidth={280}>
        <ForecastPopup
          spot={spot}
          currentConditions={currentConditions}
          fullForecast={data?.forecast}
          isLoading={isLoading}
          error={error}
        />
      </Popup>
    </Marker>
  );
}
