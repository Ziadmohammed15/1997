import React from 'react';
import { Search } from 'lucide-react';
import { motion } from 'framer-motion';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ 
  value, 
  onChange, 
  placeholder = "ابحث عن خدمة..." 
}) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="relative"
    >
      <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
        <Search className="w-5 h-5 text-secondary-400" />
      </div>
      <input
        type="text"
        className="w-full backdrop-blur-glass bg-white/60 dark:bg-secondary-800/60 border border-white/20 dark:border-secondary-700/30 rounded-xl px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-white/50 dark:focus:ring-secondary-700/50 transition-all duration-200 text-secondary-900 dark:text-white placeholder:text-secondary-400 dark:placeholder:text-secondary-500 shadow-glass"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </motion.div>
  );
};

export default SearchBar;