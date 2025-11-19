'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ReviewCard from './ReviewCard';
import { useSpotReviews } from '@/lib/hooks/useSpotReviews';

interface ReviewListProps {
  spotId: string;
}

export default function ReviewList({ spotId }: ReviewListProps) {
  const [currentPage, setCurrentPage] = useState(1);

  const {
    reviews,
    totalCount,
    totalPages,
    helpfulVotes,
    isLoading,
    error,
    voteHelpful,
    deleteReview,
    isVoting,
    isDeleting,
  } = useSpotReviews(spotId, currentPage);

  if (isLoading && reviews.length === 0) {
    return (
      <div className="py-8 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-ocean-600"></div>
        <p className="text-sm text-gray-600 mt-2">Loading reviews...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-6 px-4 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-sm text-red-700">Failed to load reviews</p>
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="py-8 text-center">
        <p className="text-gray-500 text-sm">No reviews yet</p>
        <p className="text-gray-400 text-xs mt-1">Be the first to share your experience!</p>
      </div>
    );
  }

  const handleVoteHelpful = (reviewId: string) => {
    voteHelpful.mutate(reviewId);
  };

  const handleDeleteReview = (reviewId: string) => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      deleteReview.mutate(reviewId);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top of reviews
    document.querySelector('#reviews-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div id="reviews-section" className="space-y-4">
      {/* Reviews */}
      <div className="space-y-3">
        {reviews.map((review) => (
          <ReviewCard
            key={review.id}
            review={review}
            onVoteHelpful={handleVoteHelpful}
            onDelete={handleDeleteReview}
            hasVoted={helpfulVotes[review.id] || false}
            isVoting={isVoting}
            isDeleting={isDeleting}
          />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <div className="text-sm text-gray-600">
            Showing {(currentPage - 1) * 10 + 1}-{Math.min(currentPage * 10, totalCount)} of{' '}
            {totalCount}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                // Show first, last, current, and adjacent pages
                if (
                  page === 1 ||
                  page === totalPages ||
                  (page >= currentPage - 1 && page <= currentPage + 1)
                ) {
                  return (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`min-w-[32px] h-8 px-2 rounded-lg text-sm font-medium transition ${
                        page === currentPage
                          ? 'bg-ocean-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {page}
                    </button>
                  );
                } else if (page === currentPage - 2 || page === currentPage + 2) {
                  return (
                    <span key={page} className="px-1 text-gray-400">
                      ...
                    </span>
                  );
                }
                return null;
              })}
            </div>

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
