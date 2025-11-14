'use client';

import { useState } from 'react';
import { useMapStore } from '@/lib/stores/map-store';
import { Calendar, Clock, X } from 'lucide-react';
import { format, addHours, addDays } from 'date-fns';

interface DatePreset {
  label: string;
  value: Date | null;
  description: string;
}

export default function DateTimePicker() {
  const { selectedDate, setSelectedDate } = useMapStore();
  const [isExpanded, setIsExpanded] = useState(false);
  const [customDate, setCustomDate] = useState('');
  const [customTime, setCustomTime] = useState('');

  const now = new Date();

  const presets: DatePreset[] = [
    {
      label: 'Now',
      value: null,
      description: 'Live forecast',
    },
    {
      label: '+6h',
      value: addHours(now, 6),
      description: '6 hours ahead',
    },
    {
      label: '+12h',
      value: addHours(now, 12),
      description: '12 hours ahead',
    },
    {
      label: '+24h',
      value: addHours(now, 24),
      description: 'Tomorrow',
    },
    {
      label: '+3d',
      value: addDays(now, 3),
      description: '3 days ahead',
    },
    {
      label: '+7d',
      value: addDays(now, 7),
      description: '7 days ahead',
    },
  ];

  const handlePresetClick = (preset: DatePreset) => {
    setSelectedDate(preset.value);
    if (preset.value === null) {
      setIsExpanded(false);
    }
  };

  const handleCustomDateTimeApply = () => {
    if (!customDate || !customTime) return;

    try {
      const dateTime = new Date(`${customDate}T${customTime}`);
      if (!isNaN(dateTime.getTime())) {
        setSelectedDate(dateTime);
        setIsExpanded(false);
      }
    } catch (error) {
      console.error('Invalid date/time:', error);
    }
  };

  const isPresetActive = (preset: DatePreset) => {
    if (preset.value === null && selectedDate === null) return true;
    if (preset.value && selectedDate) {
      return Math.abs(preset.value.getTime() - selectedDate.getTime()) < 60000; // Within 1 minute
    }
    return false;
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
      {/* Header */}
      <div className="p-3 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-ocean-600" />
            <span className="text-sm font-semibold text-gray-700">
              Forecast Time
            </span>
          </div>
          {selectedDate && (
            <button
              onClick={() => setSelectedDate(null)}
              className="text-xs text-ocean-600 hover:text-ocean-700 font-medium"
              title="Return to live forecast"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Current Selection Display */}
        <div className="mt-2 text-xs text-gray-600">
          {selectedDate ? (
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>{format(selectedDate, 'MMM d, yyyy h:mm a')}</span>
            </div>
          ) : (
            <div className="flex items-center gap-1">
              <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
              <span>Live forecast (updating)</span>
            </div>
          )}
        </div>
      </div>

      {/* Quick Presets */}
      <div className="p-3">
        <div className="grid grid-cols-3 gap-2">
          {presets.map((preset) => (
            <button
              key={preset.label}
              onClick={() => handlePresetClick(preset)}
              className={`
                px-3 py-2 rounded-lg text-xs font-medium transition
                ${
                  isPresetActive(preset)
                    ? 'bg-ocean-600 text-white shadow-sm'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }
              `}
              title={preset.description}
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {/* Custom Date/Time Picker */}
      <div className="px-3 pb-3">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full text-xs text-ocean-600 hover:text-ocean-700 font-medium text-left py-1"
        >
          {isExpanded ? '▼' : '▶'} Custom date/time
        </button>

        {isExpanded && (
          <div className="mt-2 space-y-2">
            <div className="flex gap-2">
              <div className="flex-1">
                <label className="text-xs text-gray-600 block mb-1">
                  Date
                </label>
                <input
                  type="date"
                  value={customDate}
                  onChange={(e) => setCustomDate(e.target.value)}
                  className="w-full px-2 py-1.5 text-xs border border-gray-300 rounded focus:ring-2 focus:ring-ocean-500 focus:border-transparent"
                />
              </div>
              <div className="flex-1">
                <label className="text-xs text-gray-600 block mb-1">
                  Time
                </label>
                <input
                  type="time"
                  value={customTime}
                  onChange={(e) => setCustomTime(e.target.value)}
                  className="w-full px-2 py-1.5 text-xs border border-gray-300 rounded focus:ring-2 focus:ring-ocean-500 focus:border-transparent"
                />
              </div>
            </div>
            <button
              onClick={handleCustomDateTimeApply}
              disabled={!customDate || !customTime}
              className="w-full px-3 py-2 bg-ocean-600 text-white text-xs font-medium rounded-lg hover:bg-ocean-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition"
            >
              Apply Custom Time
            </button>
          </div>
        )}
      </div>

      {/* Info Note */}
      <div className="px-3 pb-3">
        <p className="text-xs text-gray-500 italic">
          {selectedDate
            ? 'Viewing forecast for selected time'
            : 'Forecasts update every 6 hours'}
        </p>
      </div>
    </div>
  );
}
