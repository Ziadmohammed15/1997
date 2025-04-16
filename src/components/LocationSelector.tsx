import React, { useState, useEffect } from 'react';
import { MapPin, Search, X, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface LocationSelectorProps {
  selectedLocation: string;
  onSelectLocation: (location: string) => void;
  className?: string;
}

const LocationSelector: React.FC<LocationSelectorProps> = ({
  selectedLocation,
  onSelectLocation,
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [locations, setLocations] = useState<string[]>([]);
  
  // Popular cities in Saudi Arabia
  const popularLocations = [
    'الرياض',
    'جدة',
    'مكة المكرمة',
    'المدينة المنورة',
    'الدمام',
    'الخبر',
    'تبوك',
    'أبها',
    'القصيم',
    'حائل',
    'نجران',
    'الطائف',
    'جازان',
    'الأحساء',
    'الجبيل',
    'ينبع',
    'الخرج'
  ];
  
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setLocations(popularLocations);
    } else {
      const filtered = popularLocations.filter(location => 
        location.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setLocations(filtered);
    }
  }, [searchTerm]);
  
  const handleSelectLocation = (location: string) => {
    onSelectLocation(location);
    setIsOpen(false);
    setSearchTerm('');
  };
  
  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center space-x-2 rtl:space-x-reverse bg-white/70 dark:bg-secondary-800/70 backdrop-blur-glass px-3 py-2 rounded-xl border border-white/20 dark:border-secondary-700/30 shadow-glass w-full"
      >
        <MapPin className="w-5 h-5 text-primary-500" />
        <span className="flex-1 text-right text-secondary-700 dark:text-secondary-300 truncate">
          {selectedLocation || 'اختر المدينة'}
        </span>
        <ChevronDown className="w-4 h-4 text-secondary-400" />
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute z-50 top-full right-0 left-0 mt-2 bg-white dark:bg-secondary-800 rounded-xl shadow-lg border border-secondary-100 dark:border-secondary-700 max-h-64 overflow-hidden"
          >
            <div className="p-2 border-b border-secondary-100 dark:border-secondary-700 sticky top-0 bg-white dark:bg-secondary-800 z-10">
              <div className="relative">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-secondary-400 w-4 h-4" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="ابحث عن مدينة..."
                  className="w-full pr-10 py-2 px-3 bg-secondary-50 dark:bg-secondary-700 rounded-lg text-secondary-900 dark:text-white placeholder-secondary-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  autoFocus
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-400 hover:text-secondary-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
            
            <div className="overflow-y-auto max-h-52">
              {locations.length > 0 ? (
                locations.map((location) => (
                  <motion.button
                    key={location}
                    whileHover={{ backgroundColor: 'rgba(0,0,0,0.05)' }}
                    onClick={() => handleSelectLocation(location)}
                    className={`w-full text-right px-4 py-3 ${
                      selectedLocation === location 
                        ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 font-medium' 
                        : 'text-secondary-700 dark:text-secondary-300'
                    }`}
                  >
                    {location}
                  </motion.button>
                ))
              ) : (
                <div className="p-4 text-center text-secondary-500 dark:text-secondary-400">
                  لا توجد نتائج مطابقة
                </div>
              )}
            </div>
            
            <div className="p-2 border-t border-secondary-100 dark:border-secondary-700 sticky bottom-0 bg-white dark:bg-secondary-800">
              <button
                onClick={() => setIsOpen(false)}
                className="w-full py-2 px-4 bg-secondary-100 dark:bg-secondary-700 rounded-lg text-secondary-700 dark:text-secondary-300 font-medium"
              >
                إلغاء
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LocationSelector;