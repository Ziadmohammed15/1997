import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Star, Award, Target } from 'lucide-react';

interface AchievementBadgeProps {
  type: string;
  date: string;
  data?: any;
  size?: 'sm' | 'md' | 'lg';
}

const AchievementBadge: React.FC<AchievementBadgeProps> = ({
  type,
  date,
  data,
  size = 'md'
}) => {
  const getAchievementIcon = () => {
    switch (type) {
      case 'first_service':
        return Trophy;
      case 'popular_service':
        return Star;
      case 'top_rated':
        return Award;
      default:
        return Target;
    }
  };

  const getAchievementTitle = () => {
    switch (type) {
      case 'first_service':
        return 'أول خدمة';
      case 'popular_service':
        return 'خدمة مميزة';
      case 'top_rated':
        return 'تقييم عالي';
      default:
        return 'إنجاز جديد';
    }
  };

  const sizes = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  };

  const Icon = getAchievementIcon();

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="relative group"
    >
      <div className={`${sizes[size]} rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center`}>
        <Icon className="w-1/2 h-1/2 text-primary-600 dark:text-primary-400" />
      </div>
      
      {/* Tooltip */}
      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-48 opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="bg-white dark:bg-secondary-800 rounded-lg shadow-lg p-3 text-center">
          <p className="font-medium dark:text-white">{getAchievementTitle()}</p>
          <p className="text-xs text-secondary-500 dark:text-secondary-400">
            {new Date(date).toLocaleDateString('ar-SA')}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default AchievementBadge;