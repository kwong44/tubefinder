'use client';

import { Waves, Wind, Thermometer, ArrowUp, Clock } from 'lucide-react';
import type { BuoyObservation, BuoyStation } from '@/lib/types/observations';
import DataSourceBadge from './DataSourceBadge';
import { formatDistanceToNow } from 'date-fns';

interface BuoyObservationCardProps {
  observation: BuoyObservation;
  buoyStation: BuoyStation;
  compact?: boolean;
}

export default function BuoyObservationCard({
  observation,
  buoyStation,
  compact = false,
}: BuoyObservationCardProps) {
  if (compact) {
    return (
      <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-sm font-semibold text-green-900">Live Buoy Data</h4>
          <DataSourceBadge source="noaa-buoy" lastUpdated={observation.timestamp} size="sm" />
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs">
          {observation.waveHeight && (
            <div className="flex items-center gap-1.5">
              <Waves className="h-3.5 w-3.5 text-green-600" />
              <span className="font-medium">{observation.waveHeight.toFixed(1)}m</span>
              <span className="text-gray-500">waves</span>
            </div>
          )}

          {observation.dominantWavePeriod && (
            <div className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 text-green-600" />
              <span className="font-medium">{observation.dominantWavePeriod.toFixed(0)}s</span>
              <span className="text-gray-500">period</span>
            </div>
          )}

          {observation.windSpeed && (
            <div className="flex items-center gap-1.5">
              <Wind className="h-3.5 w-3.5 text-green-600" />
              <span className="font-medium">{(observation.windSpeed * 1.94384).toFixed(0)} kts</span>
              <span className="text-gray-500">wind</span>
            </div>
          )}

          {observation.waterTemperature && (
            <div className="flex items-center gap-1.5">
              <Thermometer className="h-3.5 w-3.5 text-green-600" />
              <span className="font-medium">{observation.waterTemperature.toFixed(0)}°C</span>
              <span className="text-gray-500">water</span>
            </div>
          )}
        </div>

        <p className="text-xs text-green-700 mt-2">
          {buoyStation.name} · {formatDistanceToNow(observation.timestamp, { addSuffix: true })}
        </p>
      </div>
    );
  }

  return (
    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h4 className="text-sm font-semibold text-green-900">Live Buoy Observations</h4>
          <p className="text-xs text-green-700">{buoyStation.name} (Station {buoyStation.id})</p>
        </div>
        <DataSourceBadge source="noaa-buoy" lastUpdated={observation.timestamp} />
      </div>

      <div className="space-y-3">
        {/* Wave Data */}
        {(observation.waveHeight || observation.dominantWavePeriod || observation.waveDirection) && (
          <div className="border-t border-green-200 pt-3">
            <h5 className="text-xs font-semibold text-green-800 mb-2 flex items-center gap-1">
              <Waves className="h-3.5 w-3.5" />
              Wave Conditions
            </h5>
            <div className="grid grid-cols-3 gap-3">
              {observation.waveHeight && (
                <div>
                  <p className="text-xs text-green-600">Height</p>
                  <p className="text-sm font-bold text-green-900">{observation.waveHeight.toFixed(1)}m</p>
                </div>
              )}
              {observation.dominantWavePeriod && (
                <div>
                  <p className="text-xs text-green-600">Period</p>
                  <p className="text-sm font-bold text-green-900">{observation.dominantWavePeriod.toFixed(0)}s</p>
                </div>
              )}
              {observation.waveDirection && (
                <div>
                  <p className="text-xs text-green-600">Direction</p>
                  <div className="flex items-center gap-1">
                    <ArrowUp
                      className="h-4 w-4 text-green-700"
                      style={{ transform: `rotate(${observation.waveDirection}deg)` }}
                    />
                    <p className="text-sm font-bold text-green-900">{observation.waveDirection}°</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Wind Data */}
        {(observation.windSpeed || observation.windDirection) && (
          <div className="border-t border-green-200 pt-3">
            <h5 className="text-xs font-semibold text-green-800 mb-2 flex items-center gap-1">
              <Wind className="h-3.5 w-3.5" />
              Wind Conditions
            </h5>
            <div className="grid grid-cols-3 gap-3">
              {observation.windSpeed && (
                <div>
                  <p className="text-xs text-green-600">Speed</p>
                  <p className="text-sm font-bold text-green-900">
                    {(observation.windSpeed * 1.94384).toFixed(0)} kts
                  </p>
                  <p className="text-xs text-green-500">{observation.windSpeed.toFixed(1)} m/s</p>
                </div>
              )}
              {observation.windGust && (
                <div>
                  <p className="text-xs text-green-600">Gusts</p>
                  <p className="text-sm font-bold text-green-900">
                    {(observation.windGust * 1.94384).toFixed(0)} kts
                  </p>
                </div>
              )}
              {observation.windDirection && (
                <div>
                  <p className="text-xs text-green-600">Direction</p>
                  <div className="flex items-center gap-1">
                    <ArrowUp
                      className="h-4 w-4 text-green-700"
                      style={{ transform: `rotate(${observation.windDirection}deg)` }}
                    />
                    <p className="text-sm font-bold text-green-900">{observation.windDirection}°</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Temperature Data */}
        {(observation.waterTemperature || observation.airTemperature) && (
          <div className="border-t border-green-200 pt-3">
            <h5 className="text-xs font-semibold text-green-800 mb-2 flex items-center gap-1">
              <Thermometer className="h-3.5 w-3.5" />
              Temperature
            </h5>
            <div className="grid grid-cols-2 gap-3">
              {observation.waterTemperature && (
                <div>
                  <p className="text-xs text-green-600">Water</p>
                  <p className="text-sm font-bold text-green-900">{observation.waterTemperature.toFixed(1)}°C</p>
                </div>
              )}
              {observation.airTemperature && (
                <div>
                  <p className="text-xs text-green-600">Air</p>
                  <p className="text-sm font-bold text-green-900">{observation.airTemperature.toFixed(1)}°C</p>
                </div>
              )}
            </div>
          </div>
        )}

        <p className="text-xs text-green-600 pt-2 border-t border-green-200">
          Updated {formatDistanceToNow(observation.timestamp, { addSuffix: true })}
        </p>
      </div>
    </div>
  );
}
