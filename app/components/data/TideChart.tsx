'use client';

import { ArrowUp, ArrowDown } from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';
import type { TideSummary } from '@/lib/types/observations';
import DataSourceBadge from './DataSourceBadge';

interface TideChartProps {
  tideSummary: TideSummary;
  compact?: boolean;
}

export default function TideChart({ tideSummary, compact = false }: TideChartProps) {
  const { predictions, nextHighTide, nextLowTide, stationName } = tideSummary;

  // Get min/max heights for scaling
  const heights = predictions.map((p) => p.height);
  const minHeight = Math.min(...heights);
  const maxHeight = Math.max(...heights);
  const range = maxHeight - minHeight;

  if (compact) {
    return (
      <div className="p-3 bg-cyan-50 border border-cyan-200 rounded-lg">
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-sm font-semibold text-cyan-900">Tide Predictions</h4>
          <DataSourceBadge source="noaa-tide" size="sm" />
        </div>

        <div className="space-y-2">
          {nextHighTide && (
            <div className="flex items-center gap-2 text-xs">
              <ArrowUp className="h-3.5 w-3.5 text-cyan-600" />
              <span className="font-medium">High Tide:</span>
              <span className="text-cyan-700">
                {format(nextHighTide.timestamp, 'h:mm a')} ({nextHighTide.height.toFixed(1)}m)
              </span>
            </div>
          )}

          {nextLowTide && (
            <div className="flex items-center gap-2 text-xs">
              <ArrowDown className="h-3.5 w-3.5 text-cyan-600" />
              <span className="font-medium">Low Tide:</span>
              <span className="text-cyan-700">
                {format(nextLowTide.timestamp, 'h:mm a')} ({nextLowTide.height.toFixed(1)}m)
              </span>
            </div>
          )}
        </div>

        <p className="text-xs text-cyan-700 mt-2">{stationName}</p>
      </div>
    );
  }

  return (
    <div className="p-4 bg-cyan-50 border border-cyan-200 rounded-lg">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h4 className="text-sm font-semibold text-cyan-900">Tide Predictions</h4>
          <p className="text-xs text-cyan-700">{stationName}</p>
        </div>
        <DataSourceBadge source="noaa-tide" />
      </div>

      {/* Next Tides */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        {nextHighTide && (
          <div className="p-3 bg-white rounded-lg border border-cyan-200">
            <div className="flex items-center gap-1.5 mb-1">
              <ArrowUp className="h-4 w-4 text-cyan-600" />
              <span className="text-xs font-semibold text-cyan-800">Next High</span>
            </div>
            <p className="text-sm font-bold text-cyan-900">
              {format(nextHighTide.timestamp, 'h:mm a')}
            </p>
            <p className="text-xs text-cyan-600">{nextHighTide.height.toFixed(1)}m</p>
            <p className="text-xs text-cyan-500 mt-1">
              {formatDistanceToNow(nextHighTide.timestamp, { addSuffix: true })}
            </p>
          </div>
        )}

        {nextLowTide && (
          <div className="p-3 bg-white rounded-lg border border-cyan-200">
            <div className="flex items-center gap-1.5 mb-1">
              <ArrowDown className="h-4 w-4 text-cyan-600" />
              <span className="text-xs font-semibold text-cyan-800">Next Low</span>
            </div>
            <p className="text-sm font-bold text-cyan-900">
              {format(nextLowTide.timestamp, 'h:mm a')}
            </p>
            <p className="text-xs text-cyan-600">{nextLowTide.height.toFixed(1)}m</p>
            <p className="text-xs text-cyan-500 mt-1">
              {formatDistanceToNow(nextLowTide.timestamp, { addSuffix: true })}
            </p>
          </div>
        )}
      </div>

      {/* Tide Timeline */}
      <div className="space-y-2">
        <h5 className="text-xs font-semibold text-cyan-800">Upcoming Tides</h5>
        <div className="space-y-1.5">
          {predictions.slice(0, 6).map((prediction, index) => {
            const heightPercent = ((prediction.height - minHeight) / range) * 100;
            const isHigh = prediction.type === 'H';

            return (
              <div key={index} className="flex items-center gap-2">
                <div className="flex-shrink-0 w-16 text-xs text-cyan-700">
                  {format(prediction.timestamp, 'h:mm a')}
                </div>

                <div className="flex-1 relative h-6 bg-white rounded overflow-hidden border border-cyan-200">
                  <div
                    className={`absolute top-0 left-0 h-full ${
                      isHigh ? 'bg-cyan-400' : 'bg-cyan-200'
                    }`}
                    style={{ width: `${heightPercent}%` }}
                  />
                  <div className="absolute inset-0 flex items-center justify-end pr-2">
                    <span className="text-xs font-medium text-cyan-900">
                      {prediction.height.toFixed(1)}m
                    </span>
                  </div>
                </div>

                <div className="flex-shrink-0">
                  {isHigh ? (
                    <ArrowUp className="h-3.5 w-3.5 text-cyan-600" />
                  ) : (
                    <ArrowDown className="h-3.5 w-3.5 text-cyan-600" />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
