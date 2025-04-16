import React from 'react';
import { motion } from 'framer-motion';

interface Category {
  id: string;
  name: string;
  icon?: React.ReactNode;
}

interface CategorySelectorProps {
  categories: Category[];
  selectedCategory: string;
  onSelectCategory: (categoryId: string) => void;
}

const CategorySelector: React.FC<CategorySelectorProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
}) => {
  return (
    <div className="flex overflow-x-auto py-2 -mx-4 px-4 no-scrollbar">
      <div className="flex space-x-3 rtl:space-x-reverse">
        {categories.map((category, index) => (
          <motion.button
            key={category.id}
            onClick={() => onSelectCategory(category.id)}
            className="flex-shrink-0"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + index * 0.05 }}
          >
            <div
              className={`px-4 py-2 rounded-full whitespace-nowrap ${
                selectedCategory === category.id
                  ? 'bg-primary-500/90 text-white font-medium shadow-neon dark:shadow-neon-dark'
                  : 'text-secondary-700 dark:text-secondary-300 hover:bg-white/10 dark:hover:bg-white/5'
              }`}
            >
              {category.icon && <span className="mr-2">{category.icon}</span>}
              {category.name}
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default CategorySelector;