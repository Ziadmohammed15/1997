import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowRight, Bell } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import { motion } from 'framer-motion';

interface HeaderProps {
  title?: string;
  showBack?: boolean;
  showNotification?: boolean;
  showThemeToggle?: boolean;
}

const Header: React.FC<HeaderProps> = ({ 
  title, 
  showBack = false, 
  showNotification = false,
  showThemeToggle = true
}) => {
  const navigate = useNavigate();
  
  return (
    <motion.div 
      initial={{ y: -10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="sticky top-0 z-10 backdrop-blur-glass bg-white/80 dark:bg-secondary-900/80 py-4 px-4 flex items-center justify-between border-b border-secondary-100/50 dark:border-secondary-800/50 transition-colors duration-300"
    >
      <div className="flex items-center">
        {showBack && (
          <motion.button 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate(-1)}
            className="p-2 -mr-2 rounded-full hover:bg-secondary-100/70 dark:hover:bg-secondary-800/70 transition-colors"
          >
            <ArrowRight className="w-5 h-5 text-secondary-700 dark:text-secondary-300" />
          </motion.button>
        )}
        {title && (
          <motion.h1 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg font-bold mr-2 text-secondary-900 dark:text-white"
          >
            {title}
          </motion.h1>
        )}
      </div>
      
      {!title && (
        <div className="flex-1 flex justify-center">
          <motion.div 
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="w-10 h-10"
          >
            <img 
              src="/logo.png" 
              alt="أجار" 
              className="w-full h-full object-contain"
            />
          </motion.div>
        </div>
      )}
      
      <div className="flex items-center space-x-3 rtl:space-x-reverse">
        {showThemeToggle && (
          <motion.div 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 rounded-full hover:bg-secondary-100/70 dark:hover:bg-secondary-800/70 transition-colors"
          >
            <ThemeToggle className="text-secondary-700 dark:text-secondary-300" />
          </motion.div>
        )}
        
        {showNotification && (
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link to="/notifications" className="p-2 rounded-full hover:bg-secondary-100/70 dark:hover:bg-secondary-800/70 transition-colors relative">
              <Bell className="w-5 h-5 text-secondary-700 dark:text-secondary-300" />
              <motion.span 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
                className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"
              />
            </Link>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default Header;