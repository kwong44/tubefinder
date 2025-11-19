'use client';

import { useState } from 'react';
import { X, Star, AlertCircle } from 'lucide-react';
import RatingStars from './RatingStars';
import { useSpotReviews } from '@/lib/hooks/useSpotReviews';
import type { SubmitReviewInput, ExperienceLevel } from '@/lib/types/ratings';

interface WriteReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  spotId: string;
  spotName: string;
}

export default function WriteReviewModal({ isOpen, onClose, spotId, spotName }: WriteReviewModalProps) {
  const { submitReview, isSubmitting } = useSpotReviews(spotId);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<SubmitReviewInput>({
    spot_id: spotId,
    rating: 0,
    review_text: '',
    experience_level: undefined,
    visited_date: undefined,
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (formData.rating === 0) {
      setError('Please select a rating');
      return;
    }

    if (formData.review_text.trim().length < 10) {
      setError('Review must be at least 10 characters');
      return;
    }

    if (formData.review_text.trim().length > 2000) {
      setError('Review must be less than 2000 characters');
      return;
    }

    try {
      await submitReview.mutateAsync(formData);

      // Reset form
      setFormData({
        spot_id: spotId,
        rating: 0,
        review_text: '',
        experience_level: undefined,
        visited_date: undefined,
      });

      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to submit review');
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
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
              <Star className="h-5 w-5 text-ocean-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Write a Review</h2>
              <p className="text-sm text-gray-500">{spotName}</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            disabled={isSubmitting}
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

          {/* Rating */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Overall Rating <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center gap-3">
              <RatingStars
                rating={formData.rating}
                onChange={(rating) => setFormData({ ...formData, rating })}
                size="lg"
              />
              {formData.rating > 0 && (
                <span className="text-sm text-gray-600">
                  {formData.rating === 1 && 'Poor'}
                  {formData.rating === 2 && 'Fair'}
                  {formData.rating === 3 && 'Good'}
                  {formData.rating === 4 && 'Very Good'}
                  {formData.rating === 5 && 'Excellent'}
                </span>
              )}
            </div>
          </div>

          {/* Review Text */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Your Review <span className="text-red-500">*</span>
            </label>
            <textarea
              value={formData.review_text}
              onChange={(e) => setFormData({ ...formData, review_text: e.target.value })}
              placeholder="Share your experience at this spot. What were the conditions like? How was the crowd? Any tips for others?"
              rows={6}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ocean-500 focus:border-transparent resize-none"
              required
              minLength={10}
              maxLength={2000}
            />
            <div className="flex items-center justify-between mt-1">
              <p className="text-xs text-gray-500">Minimum 10 characters</p>
              <p className={`text-xs ${
                formData.review_text.length > 2000 ? 'text-red-600' : 'text-gray-500'
              }`}>
                {formData.review_text.length}/2000
              </p>
            </div>
          </div>

          {/* Experience Level */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Your Experience Level
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {(['beginner', 'intermediate', 'advanced', 'expert'] as ExperienceLevel[]).map((level) => (
                <button
                  key={level}
                  type="button"
                  onClick={() => setFormData({ ...formData, experience_level: level })}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                    formData.experience_level === level
                      ? 'bg-ocean-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {level.charAt(0).toUpperCase() + level.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Visited Date */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              When did you visit?
            </label>
            <input
              type="date"
              value={formData.visited_date || ''}
              onChange={(e) => setFormData({ ...formData, visited_date: e.target.value })}
              max={new Date().toISOString().split('T')[0]}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ocean-500 focus:border-transparent"
            />
          </div>

          {/* Guidelines */}
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="text-sm font-semibold text-blue-900 mb-2">Review Guidelines</h3>
            <ul className="text-xs text-blue-800 space-y-1 list-disc list-inside">
              <li>Be honest and respectful in your review</li>
              <li>Focus on your personal experience at the spot</li>
              <li>Include details about conditions, crowds, and accessibility</li>
              <li>Avoid offensive language or personal attacks</li>
            </ul>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              disabled={isSubmitting}
              className="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || formData.rating === 0 || formData.review_text.trim().length < 10}
              className="flex-1 px-4 py-2 bg-ocean-600 hover:bg-ocean-700 text-white font-medium rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Review'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
