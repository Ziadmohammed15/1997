import React from 'react';
import { motion } from 'framer-motion';
import { Star, Calendar, Heart, MessageCircle } from 'lucide-react';

interface UserStatsProps {
  stats: {
    totalReviews: number;
    averageRating: number;
    completedServices: number;
    totalBookings: number;
  };
}

const UserStats: React.FC<UserStatsProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      <motion.div
        whileHover={{ scale: 1.05 }}
        className="card-glass p-4"
      >
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
            <Star className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
          </div>
          <div className="mr-3">
            <p className="text-sm text-secondary-600 dark:text-secondary-400">التقييم</p>
            <p className="text-lg font-bold dark:text-white">{stats.averageRating.toFixed(1)}</p>
          </div>
        </div>
      </motion.div>

      <motion.div
        whileHover={{ scale: 1.05 }}
        className="card-glass p-4"
      >
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
            <Calendar className="w-5 h-5 text-green-600 dark:text-green-400" />
          </div>
          <div className="mr-3">
            <p className="text-sm text-secondary-600 dark:text-secondary-400">الحجوزات</p>
            <p className="text-lg font-bold dark:text-white">{stats.totalBookings}</p>
          </div>
        </div>
      </motion.div>

      <motion.div
        whileHover={{ scale: 1.05 }}
        className="card-glass p-4"
      >
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
            <Heart className="w-5 h-5 text-red-600 dark:text-red-400" />
          </div>
          <div className="mr-3">
            <p className="text-sm text-secondary-600 dark:text-secondary-400">الخدمات المكتملة</p>
            <p className="text-lg font-bold dark:text-white">{stats.completedServices}</p>
          </div>
        </div>
      </motion.div>

      <motion.div
        whileHover={{ scale: 1.05 }}
        className="card-glass p-4"
      >
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
            <MessageCircle className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="mr-3">
            <p className="text-sm text-secondary-600 dark:text-secondary-400">التقييمات</p>
            <p className="text-lg font-bold dark:text-white">{stats.totalReviews}</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default UserStats;