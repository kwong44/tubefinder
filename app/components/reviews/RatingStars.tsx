'use client';

import { Star } from 'lucide-react';
import { useState } from 'react';

interface RatingStarsProps {
  rating: number; // 0-5
  onChange?: (rating: number) => void;
  readonly?: boolean;
  size?: 'sm' | 'md' | 'lg';
  showCount?: boolean;
  count?: number;
}

export default function RatingStars({
  rating,
  onChange,
  readonly = false,
  size = 'md',
  showCount = false,
  count,
}: RatingStarsProps) {
  const [hoverRating, setHoverRating] = useState(0);

  const sizeClasses = {
    sm: 'h-3.5 w-3.5',
    md: 'h-5 w-5',
    lg: 'h-6 w-6',
  };

  const iconSize = sizeClasses[size];
  const displayRating = readonly ? rating : (hoverRating || rating);

  const handleClick = (value: number) => {
    if (!readonly && onChange) {
      onChange(value);
    }
  };

  const handleMouseEnter = (value: number) => {
    if (!readonly) {
      setHoverRating(value);
    }
  };

  const handleMouseLeave = () => {
    if (!readonly) {
      setHoverRating(0);
    }
  };

  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((value) => {
          const isFilled = value <= displayRating;
          const isPartial = value === Math.ceil(displayRating) && displayRating % 1 !== 0;

          return (
            <button
              key={value}
              type="button"
              onClick={() => handleClick(value)}
              onMouseEnter={() => handleMouseEnter(value)}
              onMouseLeave={handleMouseLeave}
              disabled={readonly}
              className={`relative transition-transform ${
                readonly ? 'cursor-default' : 'cursor-pointer hover:scale-110'
              }`}
              aria-label={`Rate ${value} stars`}
            >
              {isPartial ? (
                <div className="relative">
                  <Star className={`${iconSize} text-gray-300`} />
                  <div
                    className="absolute inset-0 overflow-hidden"
                    style={{ width: `${(displayRating % 1) * 100}%` }}
                  >
                    <Star className={`${iconSize} text-yellow-400 fill-yellow-400`} />
                  </div>
                </div>
              ) : (
                <Star
                  className={`${iconSize} ${
                    isFilled
                      ? 'text-yellow-400 fill-yellow-400'
                      : 'text-gray-300 fill-none'
                  } transition-colors`}
                />
              )}
            </button>
          );
        })}
      </div>

      {showCount && count !== undefined && (
        <span className="text-sm text-gray-600 ml-1">
          ({count})
        </span>
      )}
    </div>
  );
}
