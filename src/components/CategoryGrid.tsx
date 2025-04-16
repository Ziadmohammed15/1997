import React from 'react';
import { useNavigate } from 'react-router-dom';
import { categories } from '../data/categories';
import { motion } from 'framer-motion';

const CategoryGrid: React.FC = () => {
  const navigate = useNavigate();

  const handleCategoryClick = (categoryId: string) => {
    navigate(`/category/${categoryId}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="mb-8"
    >
      <h2 className="text-lg font-bold mb-4 dark:text-white">استكشف الفئات</h2>
      
      <div className="grid grid-cols-4 gap-3">
        {categories.map((category, index) => (
          <motion.div
            key={category.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 + index * 0.05 }}
            whileHover={{ y: -5, scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleCategoryClick(category.id)}
            className="cursor-pointer"
          >
            <div className="flex flex-col items-center justify-center p-3 relative group">
              {/* Background with glass effect */}
              <div className="absolute inset-0 backdrop-blur-glass bg-white/40 dark:bg-secondary-800/40 rounded-xl border border-white/20 dark:border-secondary-700/30 shadow-glass group-hover:shadow-lg transition-all duration-300"></div>
              
              {/* Glowing circle behind icon */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary-400/20 to-primary-600/20 dark:from-primary-400/10 dark:to-primary-600/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              {/* Icon container with glass effect */}
              <div className="relative mb-2">
                <div className="w-12 h-12 backdrop-blur-glass bg-gradient-to-br from-white/80 to-white/40 dark:from-white/20 dark:to-white/5 rounded-xl flex items-center justify-center shadow-glass group-hover:shadow-lg transition-all duration-300 border border-white/30 dark:border-white/10">
                  {/* Glowing effect on hover */}
                  <div className="absolute inset-0 bg-primary-500/20 dark:bg-primary-400/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  {/* Icon */}
                  <span className="text-2xl relative z-10 transform group-hover:scale-110 transition-transform duration-300">
                    {category.icon}
                  </span>
                </div>
                
                {/* Glow effect */}
                <div className="absolute -inset-1 bg-primary-500/20 dark:bg-primary-400/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              
              {/* Category name */}
              <span className="relative text-xs font-medium text-secondary-800 dark:text-secondary-200 line-clamp-2 text-center group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-300">
                {category.name}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default CategoryGrid;