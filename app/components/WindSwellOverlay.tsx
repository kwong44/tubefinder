'use client';

import { useEffect, useState, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { useMapStore } from '@/lib/stores/map-store';
import { useForecast, getCurrentConditions } from '@/lib/hooks/useForecast';

const SVGOverlay = dynamic(
  () => import('react-leaflet').then((mod) => mod.SVGOverlay),
  { ssr: false }
);

interface WindSwellOverlayProps {
  type: 'wind' | 'wave' | 'both';
  gridSpacing?: number; // degrees of lat/lng between arrows
  enabled: boolean;
}

/**
 * Creates an arrow SVG element
 */
function createArrowSVG(
  direction: number,
  color: string,
  x: number,
  y: number
): string {
  return `
    <g transform="translate(${x}, ${y}) rotate(${direction})">
      <path d="M 0,-15 L 5,0 L 0,-3 L -5,0 Z" fill="${color}" stroke="white" stroke-width="1" opacity="0.8"/>
      <line x1="0" y1="-3" x2="0" y2="15" stroke="${color}" stroke-width="2" opacity="0.8"/>
    </g>
  `;
}

export default function WindSwellOverlay({
  type,
  gridSpacing = 2,
  enabled,
}: WindSwellOverlayProps) {
  const { bounds, selectedDate } = useMapStore();
  const [L, setL] = useState<any>(null);

  useEffect(() => {
    import('leaflet').then((leaflet) => setL(leaflet.default));
  }, []);

  // Generate grid points based on current map bounds
  const gridPoints = useMemo(() => {
    if (!bounds) return [];

    const points: Array<{ lat: number; lng: number }> = [];

    // Create a grid of points
    for (
      let lat = bounds.south;
      lat <= bounds.north;
      lat += gridSpacing
    ) {
      for (
        let lng = bounds.west;
        lng <= bounds.east;
        lng += gridSpacing
      ) {
        points.push({ lat, lng });
      }
    }

    return points;
  }, [bounds, gridSpacing]);

  // Fetch forecast data for center point (representative)
  const centerLat = bounds
    ? (bounds.north + bounds.south) / 2
    : 0;
  const centerLng = bounds
    ? (bounds.east + bounds.west) / 2
    : 115;

  const { data } = useForecast({ lat: centerLat, lng: centerLng }, enabled);

  const currentConditions = useMemo(() => {
    return getCurrentConditions(data?.forecast, selectedDate);
  }, [data, selectedDate]);

  // Generate SVG content
  const svgContent = useMemo(() => {
    if (!currentConditions || !enabled || gridPoints.length === 0) return '';

    const width = 800;
    const height = 600;
    const gridCols = Math.ceil(Math.sqrt(gridPoints.length));
    const gridRows = Math.ceil(gridPoints.length / gridCols);
    const cellWidth = width / gridCols;
    const cellHeight = height / gridRows;

    let arrows = '';
    let index = 0;

    for (let row = 0; row < gridRows; row++) {
      for (let col = 0; col < gridCols; col++) {
        if (index >= gridPoints.length) break;

        const x = col * cellWidth + cellWidth / 2;
        const y = row * cellHeight + cellHeight / 2;

        if (type === 'wind' || type === 'both') {
          arrows += createArrowSVG(
            currentConditions.wind.direction,
            '#22c55e',
            x - (type === 'both' ? 15 : 0),
            y
          );
        }

        if (type === 'wave' || type === 'both') {
          arrows += createArrowSVG(
            currentConditions.wave.direction,
            '#3b82f6',
            x + (type === 'both' ? 15 : 0),
            y
          );
        }

        index++;
      }
    }

    return `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}">
        ${arrows}
      </svg>
    `;
  }, [currentConditions, enabled, gridPoints, type]);

  if (!L || !bounds || !enabled || !currentConditions) {
    return null;
  }

  const boundsArray: [[number, number], [number, number]] = [
    [bounds.south, bounds.west],
    [bounds.north, bounds.east],
  ];

  return (
    <SVGOverlay bounds={boundsArray} attributes={{ xmlns: 'http://www.w3.org/2000/svg' }}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 800 600"
        dangerouslySetInnerHTML={{ __html: svgContent }}
      />
    </SVGOverlay>
  );
}
