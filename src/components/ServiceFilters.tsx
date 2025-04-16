import React, { useState } from 'react';
import { Filter, X, Check, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { categories } from '../data/categories';
import RatingStars from './RatingStars';

interface ServiceFiltersProps {
  isOpen: boolean;
  onClose: () => void;
  filters: {
    priceRange: [number, number];
    rating: number;
    categories: string[];
    sortBy: string;
  };
  onApplyFilters: (filters: {
    priceRange: [number, number];
    rating: number;
    categories: string[];
    sortBy: string;
  }) => void;
  onResetFilters: () => void;
}

const ServiceFilters: React.FC<ServiceFiltersProps> = ({
  isOpen,
  onClose,
  filters,
  onApplyFilters,
  onResetFilters
}) => {
  const [localFilters, setLocalFilters] = useState(filters);
  const [expandedSections, setExpandedSections] = useState({
    price: true,
    rating: true,
    categories: true,
    sort: true
  });
  
  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };
  
  const handlePriceChange = (value: number) => {
    setLocalFilters(prev => ({
      ...prev,
      priceRange: [0, value]
    }));
  };
  
  const handleRatingChange = (value: number) => {
    setLocalFilters(prev => ({
      ...prev,
      rating: value
    }));
  };
  
  const handleCategoryToggle = (categoryId: string) => {
    setLocalFilters(prev => {
      const newCategories = prev.categories.includes(categoryId)
        ? prev.categories.filter(id => id !== categoryId)
        : [...prev.categories, categoryId];
      
      return {
        ...prev,
        categories: newCategories
      };
    });
  };
  
  const handleSortChange = (value: string) => {
    setLocalFilters(prev => ({
      ...prev,
      sortBy: value
    }));
  };
  
  const handleApply = () => {
    onApplyFilters(localFilters);
    onClose();
  };
  
  const handleReset = () => {
    onResetFilters();
    setLocalFilters({
      priceRange: [0, 500],
      rating: 0,
      categories: [],
      sortBy: 'recommended'
    });
  };
  
  const sortOptions = [
    { id: 'recommended', label: 'الأكثر ملاءمة' },
    { id: 'price_asc', label: 'السعر: من الأقل للأعلى' },
    { id: 'price_desc', label: 'السعر: من الأعلى للأقل' },
    { id: 'rating_desc', label: 'التقييم: من الأعلى للأقل' },
    { id: 'newest', label: 'الأحدث' }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end md:items-center justify-center"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: 'spring', damping: 25 }}
            className="glass-morphism w-full max-w-md max-h-[85vh] overflow-y-auto rounded-t-2xl md:rounded-2xl p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center">
                <Filter className="w-5 h-5 ml-2 text-primary-500" />
                <h3 className="text-xl font-bold dark:text-white">تصفية النتائج</h3>
              </div>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="p-2 rounded-full bg-secondary-100 dark:bg-secondary-800 text-secondary-500 dark:text-secondary-400"
              >
                <X className="w-5 h-5" />
              </motion.button>
            </div>
            
            {/* Price Range */}
            <div className="mb-6 border-b border-secondary-100 dark:border-secondary-800 pb-6">
              <button 
                className="flex justify-between items-center w-full mb-4"
                onClick={() => toggleSection('price')}
              >
                <span className="font-bold dark:text-white">نطاق السعر</span>
                {expandedSections.price ? (
                  <ChevronUp className="w-5 h-5 text-secondary-500" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-secondary-500" />
                )}
              </button>
              
              {expandedSections.price && (
                <div className="px-2">
                  <input
                    type="range"
                    min="0"
                    max="1000"
                    step="50"
                    value={localFilters.priceRange[1]}
                    onChange={(e) => handlePriceChange(parseInt(e.target.value))}
                    className="w-full h-2 bg-secondary-200 dark:bg-secondary-700 rounded-lg appearance-none cursor-pointer accent-primary-500"
                  />
                  <div className="flex justify-between mt-2">
                    <span className="text-sm text-secondary-500 dark:text-secondary-400">0 ريال</span>
                    <span className="text-sm font-medium text-primary-600 dark:text-primary-400">
                      {localFilters.priceRange[1]} ريال
                    </span>
                  </div>
                </div>
              )}
            </div>
            
            {/* Rating */}
            <div className="mb-6 border-b border-secondary-100 dark:border-secondary-800 pb-6">
              <button 
                className="flex justify-between items-center w-full mb-4"
                onClick={() => toggleSection('rating')}
              >
                <span className="font-bold dark:text-white">التقييم</span>
                {expandedSections.rating ? (
                  <ChevronUp className="w-5 h-5 text-secondary-500" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-secondary-500" />
                )}
              </button>
              
              {expandedSections.rating && (
                <div className="space-y-2">
                  {[5, 4, 3, 2, 1].map((star) => (
                    <button
                      key={star}
                      onClick={() => handleRatingChange(star)}
                      className={`flex items-center justify-between w-full p-2 rounded-lg ${
                        localFilters.rating === star 
                          ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400' 
                          : 'hover:bg-secondary-50 dark:hover:bg-secondary-800'
                      }`}
                    >
                      <div className="flex items-center">
                        <RatingStars rating={star} size="sm" className="ml-2" />
                        <span className="text-sm dark:text-white">{star} نجوم أو أكثر</span>
                      </div>
                      {localFilters.rating === star && (
                        <Check className="w-4 h-4 text-primary-500" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            {/* Categories */}
            <div className="mb-6 border-b border-secondary-100 dark:border-secondary-800 pb-6">
              <button 
                className="flex justify-between items-center w-full mb-4"
                onClick={() => toggleSection('categories')}
              >
                <span className="font-bold dark:text-white">الفئات</span>
                {expandedSections.categories ? (
                  <ChevronUp className="w-5 h-5 text-secondary-500" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-secondary-500" />
                )}
              </button>
              
              {expandedSections.categories && (
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => handleCategoryToggle(category.id)}
                      className={`flex items-center justify-between w-full p-2 rounded-lg ${
                        localFilters.categories.includes(category.id) 
                          ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400' 
                          : 'hover:bg-secondary-50 dark:hover:bg-secondary-800'
                      }`}
                    >
                      <div className="flex items-center">
                        <span className="text-xl ml-2">{category.icon}</span>
                        <span className="text-sm dark:text-white">{category.name}</span>
                      </div>
                      {localFilters.categories.includes(category.id) && (
                        <Check className="w-4 h-4 text-primary-500" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            {/* Sort By */}
            <div className="mb-6">
              <button 
                className="flex justify-between items-center w-full mb-4"
                onClick={() => toggleSection('sort')}
              >
                <span className="font-bold dark:text-white">ترتيب حسب</span>
                {expandedSections.sort ? (
                  <ChevronUp className="w-5 h-5 text-secondary-500" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-secondary-500" />
                )}
              </button>
              
              {expandedSections.sort && (
                <div className="space-y-2">
                  {sortOptions.map((option) => (
                    <button
                      key={option.id}
                      onClick={() => handleSortChange(option.id)}
                      className={`flex items-center justify-between w-full p-2 rounded-lg ${
                        localFilters.sortBy === option.id 
                          ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400' 
                          : 'hover:bg-secondary-50 dark:hover:bg-secondary-800'
                      }`}
                    >
                      <span className="text-sm dark:text-white">{option.label}</span>
                      {localFilters.sortBy === option.id && (
                        <Check className="w-4 h-4 text-primary-500" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            <div className="flex space-x-3 rtl:space-x-reverse">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleReset}
                className="flex-1 py-3 px-4 rounded-xl bg-secondary-100 dark:bg-secondary-800 text-secondary-700 dark:text-secondary-300 font-medium"
              >
                إعادة ضبط
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleApply}
                className="flex-1 py-3 px-4 rounded-xl bg-primary-500 text-white font-medium shadow-button"
              >
                تطبيق الفلاتر
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ServiceFilters;