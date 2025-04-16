import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

const Welcome = () => {
  return (
    <div className="app-container flex flex-col bg-dots bg-noise">
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <motion.div 
            className="w-32 h-32 mx-auto mb-4"
            whileHover={{ scale: 1.1, rotate: 5 }}
          >
            <img 
              src="https://l.top4top.io/p_3343oc4gu1.png" 
              alt="أجار" 
              className="w-full h-full object-contain"
            />
          </motion.div>
        </motion.div>
        
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-4xl font-bold mb-3 text-gradient"
        >
          أهلاً بك في أجار
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-lg mb-8 text-secondary-600 dark:text-secondary-300"
        >
          منصة حجز وإدارة الخدمات المتكاملة
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="w-full"
        >
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Link 
              to="/auth" 
              className="btn-modern flex items-center justify-center w-full"
            >
              <span>تسجيل الدخول</span>
              <ArrowLeft className="mr-2 h-5 w-5" />
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Welcome;