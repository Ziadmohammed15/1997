import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { motion } from 'framer-motion';

interface DarkModeToggleProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const DarkModeToggle: React.FC<DarkModeToggleProps> = ({ 
  className = '', 
  size = 'md' 
}) => {
  const { theme, toggleTheme } = useTheme();
  
  const iconSize = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };
  
  const containerSize = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12'
  };

  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={toggleTheme}
      className={`${containerSize[size]} rounded-full flex items-center justify-center transition-colors ${className}`}
      aria-label={theme === 'dark' ? 'تفعيل الوضع النهاري' : 'تفعيل الوضع الليلي'}
    >
      <motion.div
        initial={false}
        animate={{ 
          rotate: theme === 'dark' ? 40 : 0,
          scale: [1, 1.2, 1]
        }}
        transition={{ 
          type: 'spring', 
          stiffness: 300, 
          damping: 30,
          scale: { duration: 0.5, repeat: 0 }
        }}
      >
        {theme === 'dark' ? (
          <Moon className={iconSize[size]} />
        ) : (
          <Sun className={iconSize[size]} />
        )}
      </motion.div>
    </motion.button>
  );
};

export default DarkModeToggle;