import React from 'react';
import { Bell } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

interface NotificationBadgeProps {
  count?: number;
  size?: 'sm' | 'md' | 'lg';
  showCount?: boolean;
  className?: string;
}

const NotificationBadge: React.FC<NotificationBadgeProps> = ({
  count = 0,
  size = 'md',
  showCount = false,
  className = ''
}) => {
  const hasNotifications = count > 0;
  const navigate = useNavigate();
  
  const containerSizes = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12'
  };
  
  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };
  
  const badgeSizes = {
    sm: 'w-2 h-2',
    md: 'w-2.5 h-2.5',
    lg: 'w-3 h-3'
  };
  
  const countBadgeSizes = {
    sm: 'w-4 h-4 text-[10px]',
    md: 'w-5 h-5 text-xs',
    lg: 'w-6 h-6 text-sm'
  };

  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={() => navigate('/notifications')}
      className={`${containerSizes[size]} bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-colors relative ${className}`}
    >
      <Bell className={iconSizes[size]} />
      
      {hasNotifications && !showCount && (
        <motion.span 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring" }}
          className={`absolute top-1 right-1 ${badgeSizes[size]} bg-red-500 rounded-full animate-pulse`}
        />
      )}
      
      {hasNotifications && showCount && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring" }}
          className={`absolute -top-1 -right-1 ${countBadgeSizes[size]} bg-red-500 rounded-full flex items-center justify-center text-white font-bold`}
        >
          {count > 9 ? '9+' : count}
        </motion.div>
      )}
    </motion.button>
  );
};

export default NotificationBadge;