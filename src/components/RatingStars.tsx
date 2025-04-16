import React from 'react';
import { Star } from 'lucide-react';
import { motion } from 'framer-motion';

interface RatingStarsProps {
  rating: number;
  maxRating?: number;
  size?: 'sm' | 'md' | 'lg';
  interactive?: boolean;
  onRatingChange?: (rating: number) => void;
  className?: string;
}

const RatingStars: React.FC<RatingStarsProps> = ({
  rating,
  maxRating = 5,
  size = 'md',
  interactive = false,
  onRatingChange,
  className = ''
}) => {
  const [hoverRating, setHoverRating] = React.useState(0);
  
  const starSizes = {
    sm: 'w-3 h-3',
    md: 'w-5 h-5',
    lg: 'w-7 h-7'
  };
  
  const handleClick = (selectedRating: number) => {
    if (interactive && onRatingChange) {
      onRatingChange(selectedRating);
    }
  };
  
  const handleMouseEnter = (hoveredRating: number) => {
    if (interactive) {
      setHoverRating(hoveredRating);
    }
  };
  
  const handleMouseLeave = () => {
    if (interactive) {
      setHoverRating(0);
    }
  };
  
  const displayRating = hoverRating > 0 ? hoverRating : rating;
  
  return (
    <div className={`flex ${className}`}>
      {[...Array(maxRating)].map((_, index) => {
        const starValue = index + 1;
        const isFilled = starValue <= displayRating;
        
        return (
          <motion.div
            key={index}
            whileHover={interactive ? { scale: 1.2 } : {}}
            whileTap={interactive ? { scale: 0.9 } : {}}
            onClick={() => handleClick(starValue)}
            onMouseEnter={() => handleMouseEnter(starValue)}
            onMouseLeave={handleMouseLeave}
            className={interactive ? 'cursor-pointer' : ''}
          >
            <Star 
              className={`${starSizes[size]} ${
                isFilled 
                  ? 'text-yellow-500 fill-yellow-500' 
                  : 'text-secondary-300 dark:text-secondary-600'
              } ${interactive && 'transition-all duration-200'}`}
            />
          </motion.div>
        );
      })}
    </div>
  );
};

export default RatingStars;