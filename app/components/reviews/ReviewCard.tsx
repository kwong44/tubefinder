'use client';

import { ThumbsUp, Trash2, Calendar, User } from 'lucide-react';
import { format } from 'date-fns';
import RatingStars from './RatingStars';
import { useAuthStore } from '@/lib/stores/auth-store';
import type { ReviewWithUser } from '@/lib/types/ratings';

interface ReviewCardProps {
  review: ReviewWithUser;
  onVoteHelpful?: (reviewId: string) => void;
  onDelete?: (reviewId: string) => void;
  hasVoted?: boolean;
  isVoting?: boolean;
  isDeleting?: boolean;
}

export default function ReviewCard({
  review,
  onVoteHelpful,
  onDelete,
  hasVoted = false,
  isVoting = false,
  isDeleting = false,
}: ReviewCardProps) {
  const { user } = useAuthStore();
  const isOwnReview = user?.id === review.user_id;

  const getExperienceBadgeColor = (level?: string | null) => {
    switch (level) {
      case 'beginner':
        return 'bg-green-100 text-green-700';
      case 'intermediate':
        return 'bg-blue-100 text-blue-700';
      case 'advanced':
        return 'bg-purple-100 text-purple-700';
      case 'expert':
        return 'bg-orange-100 text-orange-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-ocean-100 flex items-center justify-center">
            <User className="h-5 w-5 text-ocean-600" />
          </div>
          <div>
            <p className="font-medium text-gray-900">
              {review.user_email?.split('@')[0] || 'Anonymous'}
            </p>
            <p className="text-xs text-gray-500">
              {format(new Date(review.created_at), 'MMM d, yyyy')}
            </p>
          </div>
        </div>

        {isOwnReview && onDelete && (
          <button
            onClick={() => onDelete(review.id)}
            disabled={isDeleting}
            className="p-2 hover:bg-red-50 rounded-lg transition text-red-600 disabled:opacity-50"
            title="Delete review"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Rating */}
      {review.rating && (
        <div className="mb-2">
          <RatingStars rating={review.rating} readonly size="sm" />
        </div>
      )}

      {/* Experience Level */}
      {review.experience_level && (
        <div className="mb-2">
          <span
            className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getExperienceBadgeColor(
              review.experience_level
            )}`}
          >
            {review.experience_level.charAt(0).toUpperCase() + review.experience_level.slice(1)}
          </span>
        </div>
      )}

      {/* Visited Date */}
      {review.visited_date && (
        <div className="flex items-center gap-1 text-xs text-gray-500 mb-2">
          <Calendar className="h-3.5 w-3.5" />
          <span>Visited: {format(new Date(review.visited_date), 'MMM d, yyyy')}</span>
        </div>
      )}

      {/* Review Text */}
      <p className="text-gray-700 text-sm leading-relaxed mb-3">
        {review.review_text}
      </p>

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
        {onVoteHelpful ? (
          <button
            onClick={() => onVoteHelpful(review.id)}
            disabled={isVoting || !user}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition ${
              hasVoted
                ? 'bg-ocean-100 text-ocean-700'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            } disabled:opacity-50`}
          >
            <ThumbsUp className={`h-4 w-4 ${hasVoted ? 'fill-current' : ''}`} />
            <span>Helpful ({review.helpful_count})</span>
          </button>
        ) : (
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <ThumbsUp className="h-4 w-4" />
            <span>{review.helpful_count} found this helpful</span>
          </div>
        )}

        {review.updated_at !== review.created_at && (
          <span className="text-xs text-gray-400">Edited</span>
        )}
      </div>
    </div>
  );
}
