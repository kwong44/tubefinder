'use client';

import { useState } from 'react';
import { useFilterStore } from '@/lib/stores/filter-store';
import { Save, Trash2, Check } from 'lucide-react';

export default function PresetManager() {
  const { presets, savePreset, loadPreset, deletePreset } = useFilterStore();
  const [isCreating, setIsCreating] = useState(false);
  const [presetName, setPresetName] = useState('');

  const handleSave = () => {
    if (presetName.trim()) {
      savePreset(presetName.trim());
      setPresetName('');
      setIsCreating(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      setIsCreating(false);
      setPresetName('');
    }
  };

  return (
    <div className="space-y-2">
      {/* Header */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-gray-700">
          Filter Presets
        </span>
        {!isCreating && (
          <button
            onClick={() => setIsCreating(true)}
            className="flex items-center gap-1 px-2 py-1 text-xs bg-ocean-600 text-white rounded hover:bg-ocean-700 transition"
            title="Save current filters as preset"
          >
            <Save className="h-3 w-3" />
            <span>Save</span>
          </button>
        )}
      </div>

      {/* Create New Preset */}
      {isCreating && (
        <div className="flex gap-1">
          <input
            type="text"
            value={presetName}
            onChange={(e) => setPresetName(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Preset name..."
            className="flex-1 px-2 py-1.5 text-xs border border-gray-300 rounded focus:ring-2 focus:ring-ocean-500 focus:border-transparent"
            autoFocus
          />
          <button
            onClick={handleSave}
            disabled={!presetName.trim()}
            className="px-2 py-1.5 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition"
            title="Save preset"
          >
            <Check className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => {
              setIsCreating(false);
              setPresetName('');
            }}
            className="px-2 py-1.5 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition"
            title="Cancel"
          >
            ✕
          </button>
        </div>
      )}

      {/* Preset List */}
      {presets.length > 0 ? (
        <div className="space-y-1">
          {presets.map((preset) => (
            <div
              key={preset.id}
              className="flex items-center justify-between gap-2 p-2 bg-gray-50 rounded hover:bg-gray-100 transition"
            >
              <button
                onClick={() => loadPreset(preset.id)}
                className="flex-1 text-left text-xs font-medium text-gray-700 hover:text-ocean-700 transition"
                title="Load this preset"
              >
                {preset.name}
              </button>
              <button
                onClick={() => deletePreset(preset.id)}
                className="p-1 text-gray-500 hover:text-red-600 transition"
                title="Delete preset"
              >
                <Trash2 className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      ) : (
        !isCreating && (
          <p className="text-xs text-gray-500 italic py-2">
            No saved presets. Click Save to create one.
          </p>
        )
      )}

      {/* Info */}
      {presets.length > 0 && (
        <p className="text-xs text-gray-500 italic pt-1">
          Click a preset to load its filters
        </p>
      )}
    </div>
  );
}
