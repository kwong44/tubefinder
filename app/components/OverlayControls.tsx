'use client';

import { useState } from 'react';
import { Wind, Waves, Eye, EyeOff } from 'lucide-react';

interface OverlayControlsProps {
  onOverlayChange: (enabled: boolean, type: 'wind' | 'wave' | 'both') => void;
}

export default function OverlayControls({
  onOverlayChange,
}: OverlayControlsProps) {
  const [enabled, setEnabled] = useState(false);
  const [overlayType, setOverlayType] = useState<'wind' | 'wave' | 'both'>('both');

  const handleToggle = () => {
    const newEnabled = !enabled;
    setEnabled(newEnabled);
    onOverlayChange(newEnabled, overlayType);
  };

  const handleTypeChange = (type: 'wind' | 'wave' | 'both') => {
    setOverlayType(type);
    onOverlayChange(enabled, type);
  };

  return (
    <div className="absolute top-4 right-4 z-[1000] bg-white rounded-lg shadow-lg border border-gray-200 p-3">
      <div className="space-y-3">
        {/* Header */}
        <div className="flex items-center justify-between gap-3">
          <span className="text-sm font-semibold text-gray-700">
            Direction Overlay
          </span>
          <button
            onClick={handleToggle}
            className={`
              p-1.5 rounded-lg transition
              ${
                enabled
                  ? 'bg-ocean-600 text-white hover:bg-ocean-700'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }
            `}
            title={enabled ? 'Hide overlay' : 'Show overlay'}
          >
            {enabled ? (
              <Eye className="h-4 w-4" />
            ) : (
              <EyeOff className="h-4 w-4" />
            )}
          </button>
        </div>

        {/* Type Selector */}
        {enabled && (
          <div className="flex gap-2">
            <button
              onClick={() => handleTypeChange('wind')}
              className={`
                flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition
                ${
                  overlayType === 'wind'
                    ? 'bg-green-600 text-white shadow-sm'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }
              `}
              title="Show wind direction"
            >
              <Wind className="h-3.5 w-3.5" />
              <span>Wind</span>
            </button>
            <button
              onClick={() => handleTypeChange('wave')}
              className={`
                flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition
                ${
                  overlayType === 'wave'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }
              `}
              title="Show wave direction"
            >
              <Waves className="h-3.5 w-3.5" />
              <span>Wave</span>
            </button>
            <button
              onClick={() => handleTypeChange('both')}
              className={`
                flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition
                ${
                  overlayType === 'both'
                    ? 'bg-ocean-600 text-white shadow-sm'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }
              `}
              title="Show wind and wave directions"
            >
              <span>Both</span>
            </button>
          </div>
        )}

        {/* Legend */}
        {enabled && (
          <div className="pt-2 border-t border-gray-200 space-y-1">
            {(overlayType === 'wind' || overlayType === 'both') && (
              <div className="flex items-center gap-2 text-xs">
                <div className="w-4 h-0.5 bg-green-600 rounded"></div>
                <span className="text-gray-600">Wind direction</span>
              </div>
            )}
            {(overlayType === 'wave' || overlayType === 'both') && (
              <div className="flex items-center gap-2 text-xs">
                <div className="w-4 h-0.5 bg-blue-600 rounded"></div>
                <span className="text-gray-600">Wave direction</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
