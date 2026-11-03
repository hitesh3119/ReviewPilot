import React from 'react';
import { Star } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface StarRatingProps {
  rating: number; // 1 to 5
  maxStars?: number;
  size?: 'sm' | 'md' | 'lg';
  showNumber?: boolean;
  className?: string;
}

export const StarRating: React.FC<StarRatingProps> = ({
  rating,
  maxStars = 5,
  size = 'md',
  showNumber = false,
  className,
}) => {
  const sizeMap = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  const starSize = sizeMap[size];

  return (
    <div className={cn('inline-flex items-center gap-1', className)}>
      <div className="flex items-center gap-0.5">
        {Array.from({ length: maxStars }).map((_, index) => {
          const starValue = index + 1;
          const isFilled = rating >= starValue;
          const isHalf = !isFilled && rating >= starValue - 0.5;

          return (
            <span key={index} className="relative inline-block">
              <Star
                className={cn(
                  starSize,
                  'transition-colors',
                  isFilled
                    ? 'fill-amber-400 text-amber-400'
                    : isHalf
                    ? 'text-amber-400 fill-amber-400/50'
                    : 'text-border fill-transparent'
                )}
              />
            </span>
          );
        })}
      </div>
      {showNumber && (
        <span className="ml-1 text-xs font-semibold text-foreground">
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
};

