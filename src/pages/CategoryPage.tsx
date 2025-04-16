import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { categories, getSubcategoriesByParent } from '../data/categories';
import { services } from '../data/services';
import Header from '../components/Header';
import ServiceCard from '../components/ServiceCard';
import { motion } from 'framer-motion';
import { Filter, ChevronDown } from 'lucide-react';
import SearchBar from '../components/SearchBar';

const CategoryPage: React.FC = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);
  const [showSubcategories, setShowSubcategories] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  const category = categories.find(cat => cat.id === categoryId);
  const subcategories = getSubcategoriesByParent(categoryId || '');
  
  useEffect(() => {
    // Reset selected subcategory when category changes
    setSelectedSubcategory(null);
    
    // Simulate loading
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, [categoryId]);
  
  // Filter services based on category, subcategory, and search term
  const filteredServices = services.filter(service => {
    const matchesCategory = service.category === categoryId;
    const matchesSubcategory = !selectedSubcategory || service.subcategory === selectedSubcategory;
    const matchesSearch = !searchTerm || 
                          service.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          service.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesCategory && matchesSubcategory && matchesSearch;
  });
  
  if (!category) {
    return (
      <>
        <Header title="فئة غير موجودة" showBack={true} />
        <div className="page-container">
          <p className="text-center text-secondary-600 dark:text-secondary-300">
            الفئة المطلوبة غير موجودة
          </p>
          <Link 
            to="/home" 
            className="btn-primary block text-center mt-4"
          >
            العودة للرئيسية
          </Link>
        </div>
      </>
    );
  }
  
  return (
    <>
      <Header title={category.name} showBack={true} />
      
      <div className="page-container touch-scroll">
        <div className="mb-6">
          <SearchBar 
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder={`ابحث في ${category.name}...`}
            className="bg-white dark:bg-gray-700 text-black dark:text-white border border-gray-300 dark:border-gray-600"
          />
        </div>
        
        {subcategories.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <button 
              onClick={() => setShowSubcategories(!showSubcategories)}
              className="flex items-center justify-between w-full p-3 backdrop-blur-glass bg-white/60 dark:bg-secondary-800/60 rounded-xl border border-white/20 dark:border-secondary-700/30 shadow-glass"
            >
              <span className="font-medium text-black dark:text-white">
                {selectedSubcategory 
                  ? subcategories.find(sub => sub.id === selectedSubcategory)?.name 
                  : 'جميع الأقسام الفرعية'}
              </span>
              <ChevronDown className={`w-5 h-5 text-secondary-500 transition-transform ${showSubcategories ? 'rotate-180' : ''}`} />
            </button>
            
            {showSubcategories && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-2 p-2 backdrop-blur-glass bg-white/90 dark:bg-secondary-800/90 rounded-xl border border-white/20 dark:border-secondary-700/30 shadow-glass"
              >
                <button
                  onClick={() => {
                    setSelectedSubcategory(null);
                    setShowSubcategories(false);
                  }}
                  className={`block w-full text-right p-2 rounded-lg mb-1 text-black dark:text-white ${
                    !selectedSubcategory 
                      ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 font-medium' 
                      : 'hover:bg-secondary-50 dark:hover:bg-secondary-700/50'
                  }`}
                >
                  جميع الأقسام الفرعية
                </button>
                
                {subcategories.map(subcategory => (
                  <button
                    key={subcategory.id}
                    onClick={() => {
                      setSelectedSubcategory(subcategory.id);
                      setShowSubcategories(false);
                    }}
                    className={`block w-full text-right p-2 rounded-lg text-black dark:text-white ${
                      selectedSubcategory === subcategory.id 
                        ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 font-medium' 
                        : 'hover:bg-secondary-50 dark:hover:bg-secondary-700/50'
                    }`}
                  >
                    {subcategory.name}
                  </button>
                ))}
              </motion.div>
            )}
          </motion.div>
        )}
        
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((_, index) => (
              <motion.div 
                key={index} 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="card-modern h-72 shimmer"
              />
            ))}
          </div>
        ) : (
          <>
            {filteredServices.length > 0 ? (
              <div className="space-y-4 pb-20">
                {filteredServices.map((service, index) => (
                  <ServiceCard key={service.id} service={service} index={index} />
                ))}
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-12 text-center glass-morphism rounded-2xl"
              >
                <div className="w-16 h-16 bg-secondary-100 dark:bg-secondary-800 rounded-full flex items-center justify-center mb-4 animate-bounce-subtle">
                  <Filter className="w-8 h-8 text-secondary-400" />
                </div>
                <h3 className="text-lg font-bold text-black dark:text-white mb-2">لا توجد نتائج</h3>
                <p className="text-secondary-600 dark:text-secondary-400">
                  لم يتم العثور على خدمات تطابق معايير البحث
                </p>
                <button 
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedSubcategory(null);
                  }}
                  className="mt-4 text-primary-600 dark:text-primary-400 font-medium hover:text-primary-700 dark:hover:text-primary-300 transition-colors"
                >
                  إعادة ضبط البحث
                </button>
              </motion.div>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default CategoryPage;