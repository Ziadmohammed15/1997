import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { motion } from 'framer-motion';

interface ThemeToggleProps {
  className?: string;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ className = '' }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={`relative overflow-hidden ${className}`}
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
          <Moon className="w-5 h-5" />
        ) : (
          <Sun className="w-5 h-5" />
        )}
      </motion.div>
    </button>
  );
};

export default ThemeToggle;