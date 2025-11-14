'use client';

import { Database, Waves, TrendingUp, User } from 'lucide-react';
import type { DataSourceInfo } from '@/lib/types/observations';

interface DataSourceBadgeProps {
  source: DataSourceInfo['source'];
  lastUpdated?: Date;
  size?: 'sm' | 'md';
  showLabel?: boolean;
}

export default function DataSourceBadge({
  source,
  lastUpdated,
  size = 'sm',
  showLabel = true,
}: DataSourceBadgeProps) {
  const config = getSourceConfig(source);

  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-1.5',
  };

  const iconSize = size === 'sm' ? 'h-3 w-3' : 'h-4 w-4';

  const dataAge = lastUpdated ? Math.floor((Date.now() - lastUpdated.getTime()) / 60000) : null;

  return (
    <div
      className={`inline-flex items-center gap-1.5 rounded-full ${config.bgColor} ${config.textColor} ${sizeClasses[size]} font-medium`}
      title={config.description + (dataAge ? ` (${dataAge}m ago)` : '')}
    >
      <config.icon className={iconSize} />
      {showLabel && <span>{config.label}</span>}
      {dataAge !== null && dataAge > 0 && (
        <span className="opacity-75">· {formatDataAge(dataAge)}</span>
      )}
    </div>
  );
}

function getSourceConfig(source: DataSourceInfo['source']) {
  switch (source) {
    case 'open-meteo':
      return {
        label: 'Forecast',
        icon: TrendingUp,
        bgColor: 'bg-blue-100',
        textColor: 'text-blue-700',
        description: 'Open-Meteo Marine Forecast',
      };
    case 'noaa-buoy':
      return {
        label: 'Buoy',
        icon: Waves,
        bgColor: 'bg-green-100',
        textColor: 'text-green-700',
        description: 'NOAA Buoy Observation',
      };
    case 'noaa-tide':
      return {
        label: 'Tide',
        icon: Database,
        bgColor: 'bg-cyan-100',
        textColor: 'text-cyan-700',
        description: 'NOAA Tide Prediction',
      };
    case 'user-report':
      return {
        label: 'Report',
        icon: User,
        bgColor: 'bg-purple-100',
        textColor: 'text-purple-700',
        description: 'User-Submitted Report',
      };
  }
}

function formatDataAge(minutes: number): string {
  if (minutes < 60) {
    return `${minutes}m`;
  }
  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return `${hours}h`;
  }
  const days = Math.floor(hours / 24);
  return `${days}d`;
}
