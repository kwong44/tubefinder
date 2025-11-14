'use client';

import { useMemo } from 'react';
import type { ForecastData } from '@/lib/types';
import { formatWaveHeight, getWaveHeightColor } from '@/lib/utils/helpers';
import { format } from 'date-fns';

interface ForecastChartProps {
  forecast: ForecastData[];
  type: '24h' | '7d';
}

export default function ForecastChart({ forecast, type }: ForecastChartProps) {
  const chartData = useMemo(() => {
    if (type === '24h') {
      // Next 24 hours (hourly)
      return forecast.slice(0, 24);
    } else {
      // Next 7 days (one per day around noon)
      const dailyData: ForecastData[] = [];
      const seenDays = new Set<string>();

      for (const item of forecast) {
        const date = new Date(item.timestamp);
        const dayKey = date.toISOString().split('T')[0];

        if (!seenDays.has(dayKey)) {
          const hour = date.getHours();
          // Prefer noon-ish forecasts
          if (hour >= 10 && hour <= 14) {
            dailyData.push(item);
            seenDays.add(dayKey);
          }
        }

        if (dailyData.length >= 7) break;
      }

      return dailyData;
    }
  }, [forecast, type]);

  const maxHeight = useMemo(() => {
    return Math.max(...chartData.map((d) => d.wave.height), 1);
  }, [chartData]);

  if (chartData.length === 0) {
    return (
      <div className="text-center text-sm text-gray-500 py-4">
        No forecast data available
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {/* Chart */}
      <div className="flex items-end justify-between gap-1 h-32 px-1">
        {chartData.map((data, index) => {
          const heightPercent = (data.wave.height / maxHeight) * 100;
          const color = getWaveHeightColor(data.wave.height);

          return (
            <div
              key={index}
              className="flex-1 flex flex-col items-center justify-end group relative"
            >
              {/* Tooltip */}
              <div className="absolute bottom-full mb-2 hidden group-hover:block z-10 bg-gray-900 text-white text-xs rounded px-2 py-1 whitespace-nowrap">
                <div className="font-semibold">
                  {formatWaveHeight(data.wave.height)}
                </div>
                <div>
                  {format(
                    new Date(data.timestamp),
                    type === '24h' ? 'ha' : 'EEE'
                  )}
                </div>
                <div className="text-gray-300">
                  {data.wind.speed.toFixed(1)} m/s wind
                </div>
              </div>

              {/* Bar */}
              <div
                className="w-full rounded-t transition-all hover:opacity-80 cursor-pointer"
                style={{
                  height: `${heightPercent}%`,
                  backgroundColor: color,
                  minHeight: '4px',
                }}
              />

              {/* Label */}
              <div className="text-[9px] text-gray-600 mt-1 text-center">
                {type === '24h'
                  ? format(new Date(data.timestamp), 'ha')
                  : format(new Date(data.timestamp), 'EEE')}
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-between text-[10px] text-gray-500 px-1">
        <span>Wave Height</span>
        <span>Max: {formatWaveHeight(maxHeight)}</span>
      </div>
    </div>
  );
}
