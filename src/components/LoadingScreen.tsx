import React from 'react';
import { motion } from 'framer-motion';
import { Camera } from 'lucide-react';

const LoadingScreen: React.FC = () => {
  return (
    <div className="fixed inset-0 bg-white dark:bg-secondary-900 flex items-center justify-center z-50">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 360]
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="w-20 h-20 bg-primary-500 rounded-full flex items-center justify-center mx-auto mb-4"
        >
          <Camera className="w-10 h-10 text-white" />
        </motion.div>
        <h2 className="text-xl font-bold mb-2 dark:text-white">جاري التحميل...</h2>
        <p className="text-secondary-600 dark:text-secondary-400">يرجى الانتظار قليلاً</p>
      </motion.div>
    </div>
  );
};

export default LoadingScreen;