'use client';

import { useState } from 'react';
import { X, MapPin, AlertCircle } from 'lucide-react';
import { useCustomSpots } from '@/lib/hooks/useCustomSpots';
import type { CreateCustomSpotInput } from '@/lib/types/custom-spots';

interface CreateSpotModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialLocation?: { lat: number; lng: number };
}

export default function CreateSpotModal({ isOpen, onClose, initialLocation }: CreateSpotModalProps) {
  const { createSpot, isCreating } = useCustomSpots();
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<CreateCustomSpotInput>({
    name: '',
    latitude: initialLocation?.lat || 0,
    longitude: initialLocation?.lng || 0,
    type: 'beach',
    description: '',
    best_swell_direction: '',
    best_wind_direction: '',
    skill_level: undefined,
    is_public: true,
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!formData.name.trim()) {
      setError('Spot name is required');
      return;
    }

    if (formData.latitude < -90 || formData.latitude > 90) {
      setError('Latitude must be between -90 and 90');
      return;
    }

    if (formData.longitude < -180 || formData.longitude > 180) {
      setError('Longitude must be between -180 and 180');
      return;
    }

    try {
      await createSpot.mutateAsync({
        ...formData,
        description: formData.description?.trim() || undefined,
        best_swell_direction: formData.best_swell_direction?.trim() || undefined,
        best_wind_direction: formData.best_wind_direction?.trim() || undefined,
      });

      // Reset form and close
      setFormData({
        name: '',
        latitude: 0,
        longitude: 0,
        type: 'beach',
        description: '',
        best_swell_direction: '',
        best_wind_direction: '',
        skill_level: undefined,
        is_public: true,
      });
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to create spot');
    }
  };

  const handleClose = () => {
    if (!isCreating) {
      setError(null);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-xl">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-ocean-100 rounded-lg">
              <MapPin className="h-5 w-5 text-ocean-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Create Custom Spot</h2>
              <p className="text-sm text-gray-500">Add your favorite surf break to the map</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            disabled={isCreating}
            className="p-2 hover:bg-gray-100 rounded-lg transition disabled:opacity-50"
          >
            <X className="h-5 w-5 text-gray-600" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Error Message */}
          {error && (
            <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          {/* Spot Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Spot Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Secret Beach"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ocean-500 focus:border-transparent"
              required
            />
          </div>

          {/* Location */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Latitude <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                step="0.000001"
                value={formData.latitude}
                onChange={(e) => setFormData({ ...formData, latitude: parseFloat(e.target.value) })}
                placeholder="-8.6500"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ocean-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Longitude <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                step="0.000001"
                value={formData.longitude}
                onChange={(e) => setFormData({ ...formData, longitude: parseFloat(e.target.value) })}
                placeholder="115.0900"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ocean-500 focus:border-transparent"
                required
              />
            </div>
          </div>

          {/* Spot Type */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Spot Type <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-4 gap-2">
              {(['beach', 'reef', 'point', 'unknown'] as const).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setFormData({ ...formData, type })}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                    formData.type === type
                      ? 'bg-ocean-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe the spot, best conditions, local tips..."
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ocean-500 focus:border-transparent resize-none"
            />
          </div>

          {/* Best Conditions */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Best Swell Direction
              </label>
              <input
                type="text"
                value={formData.best_swell_direction}
                onChange={(e) => setFormData({ ...formData, best_swell_direction: e.target.value })}
                placeholder="e.g., SW, 225"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ocean-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">Use compass direction (N, SW) or degrees (0-360)</p>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Best Wind Direction
              </label>
              <input
                type="text"
                value={formData.best_wind_direction}
                onChange={(e) => setFormData({ ...formData, best_wind_direction: e.target.value })}
                placeholder="e.g., NE, 45"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ocean-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">Offshore wind direction</p>
            </div>
          </div>

          {/* Skill Level */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Skill Level
            </label>
            <div className="grid grid-cols-4 gap-2">
              {(['beginner', 'intermediate', 'advanced', 'expert'] as const).map((level) => (
                <button
                  key={level}
                  type="button"
                  onClick={() => setFormData({ ...formData, skill_level: level })}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                    formData.skill_level === level
                      ? 'bg-ocean-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {level.charAt(0).toUpperCase() + level.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Privacy Toggle */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="text-sm font-semibold text-gray-700">Make spot public</p>
              <p className="text-xs text-gray-500">Other users can see this spot on the map</p>
            </div>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, is_public: !formData.is_public })}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                formData.is_public ? 'bg-ocean-600' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  formData.is_public ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              disabled={isCreating}
              className="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isCreating}
              className="flex-1 px-4 py-2 bg-ocean-600 hover:bg-ocean-700 text-white font-medium rounded-lg transition disabled:opacity-50 disabled:cursor-wait"
            >
              {isCreating ? 'Creating...' : 'Create Spot'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
