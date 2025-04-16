import React from 'react';
import { useNavigate } from 'react-router-dom';
import { UserCircle, Briefcase, Camera } from 'lucide-react';
import { motion } from 'framer-motion';

interface UserTypeProps {
  onSelectUserType: (type: 'client' | 'provider') => void;
}

const UserType: React.FC<UserTypeProps> = ({ onSelectUserType }) => {
  const navigate = useNavigate();

  const handleSelectClient = () => {
    onSelectUserType('client');
    navigate('/home');
  };

  const handleSelectProvider = () => {
    onSelectUserType('provider');
    navigate('/provider/home');
  };

  return (
    <div className="app-container flex flex-col bg-grid bg-noise">
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6"
        >
          <motion.div 
            className="w-20 h-20 rounded-full bg-primary-500 flex items-center justify-center shadow-neon dark:shadow-neon-dark animate-pulse-glow"
            whileHover={{ scale: 1.1, rotate: 5 }}
          >
            <Camera className="w-12 h-12 text-white" />
          </motion.div>
        </motion.div>
        
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-3xl font-bold mb-2 text-center text-gradient"
        >
          اختر نوع الحساب
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-secondary-600 dark:text-secondary-300 mb-10 text-center"
        >
          حدد نوع حسابك للحصول على تجربة مخصصة
        </motion.p>
        
        <div className="w-full space-y-4">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            whileHover={{ scale: 1.02, y: -5 }}
            whileTap={{ scale: 0.98 }}
          >
            <button 
              onClick={handleSelectClient}
              className="card-modern flex items-center p-6 hover-lift w-full text-right"
            >
              <div className="w-16 h-16 rounded-full bg-primary-100 dark:bg-primary-900/50 flex items-center justify-center animate-bounce-subtle">
                <UserCircle className="w-10 h-10 text-primary-600 dark:text-primary-400" />
              </div>
              <div className="mr-4">
                <h2 className="text-xl font-bold mb-1 dark:text-white">عميل</h2>
                <p className="text-secondary-600 dark:text-secondary-300">ابحث عن خدمات واحجز ما تحتاجه</p>
              </div>
            </button>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            whileHover={{ scale: 1.02, y: -5 }}
            whileTap={{ scale: 0.98 }}
          >
            <button 
              onClick={handleSelectProvider}
              className="card-modern-alt flex items-center p-6 hover-lift w-full text-right"
            >
              <div className="w-16 h-16 rounded-full bg-secondary-100 dark:bg-secondary-700 flex items-center justify-center animate-bounce-subtle">
                <Briefcase className="w-10 h-10 text-secondary-600 dark:text-secondary-300" />
              </div>
              <div className="mr-4">
                <h2 className="text-xl font-bold mb-1 dark:text-white">مقدم خدمة</h2>
                <p className="text-secondary-600 dark:text-secondary-300">أضف خدماتك واستقبل الحجوزات</p>
              </div>
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default UserType;