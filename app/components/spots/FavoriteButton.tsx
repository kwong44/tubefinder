'use client';

import { useState } from 'react';
import { Heart } from 'lucide-react';
import { useFavorites } from '@/lib/hooks/useFavorites';
import { useAuthStore } from '@/lib/stores/auth-store';

interface FavoriteButtonProps {
  spotId: string;
  size?: 'sm' | 'md' | 'lg';
  onAuthRequired?: () => void;
}

export default function FavoriteButton({
  spotId,
  size = 'md',
  onAuthRequired,
}: FavoriteButtonProps) {
  const { user } = useAuthStore();
  const { isFavorite, toggleFavorite, isAdding, isRemoving } = useFavorites();
  const [showAnimation, setShowAnimation] = useState(false);

  const favorited = isFavorite(spotId);
  const isLoading = isAdding || isRemoving;

  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6',
  };

  const handleClick = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering parent click handlers

    // If not signed in, trigger auth modal
    if (!user) {
      onAuthRequired?.();
      return;
    }

    try {
      // Trigger animation
      setShowAnimation(true);
      setTimeout(() => setShowAnimation(false), 600);

      await toggleFavorite(spotId);
    } catch (error: any) {
      console.error('Failed to toggle favorite:', error);
      // Error is handled by the hook with rollback
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={isLoading}
      className={`
        relative transition-all duration-200
        ${isLoading ? 'opacity-50 cursor-wait' : 'hover:scale-110 active:scale-95'}
        ${favorited ? 'text-red-500' : 'text-gray-400 hover:text-red-500'}
        disabled:hover:scale-100
      `}
      title={favorited ? 'Remove from favorites' : 'Add to favorites'}
      aria-label={favorited ? 'Remove from favorites' : 'Add to favorites'}
    >
      <Heart
        className={`${sizeClasses[size]} transition-all duration-200 ${
          favorited ? 'fill-current' : 'fill-none'
        }`}
      />

      {/* Animation ripple effect */}
      {showAnimation && (
        <span
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
          key={Date.now()}
        >
          <Heart
            className={`${sizeClasses[size]} text-red-500 fill-current animate-ping opacity-75`}
          />
        </span>
      )}
    </button>
  );
}
