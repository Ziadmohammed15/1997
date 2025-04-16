import React, { useState } from 'react';
import Header from '../components/Header';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Bell, Lock, Globe, Shield, HelpCircle, Info, ChevronLeft, Moon, Sun, ToggleLeft as Toggle } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const Settings = () => {
  const { user, signOut } = useAuth();
  const { showSuccess } = useToast();
  const { theme, toggleTheme } = useTheme();
  const [notifications, setNotifications] = useState({
    push: true,
    email: true,
    chat: true
  });
  const [language, setLanguage] = useState('ar');

  const handleNotificationChange = (type: keyof typeof notifications) => {
    setNotifications(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
    showSuccess('تم حفظ الإعدادات');
  };

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLanguage(e.target.value);
    showSuccess('تم تغيير اللغة');
  };

  return (
    <>
      <Header title="الإعدادات" showBack={true} />
      
      <div className="page-container">
        <div className="space-y-6">
          {/* Notifications */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card-glass p-4"
          >
            <h2 className="text-lg font-bold mb-4 dark:text-white flex items-center">
              <Bell className="w-5 h-5 ml-2 text-primary-500" />
              الإشعارات
            </h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="dark:text-white">إشعارات التطبيق</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notifications.push}
                    onChange={() => handleNotificationChange('push')}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-secondary-200 dark:bg-secondary-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:translate-x-[-100%] peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:right-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"></div>
                </label>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="dark:text-white">إشعارات البريد الإلكتروني</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notifications.email}
                    onChange={() => handleNotificationChange('email')}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-secondary-200 dark:bg-secondary-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:translate-x-[-100%] peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:right-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"></div>
                </label>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="dark:text-white">إشعارات المحادثات</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notifications.chat}
                    onChange={() => handleNotificationChange('chat')}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-secondary-200 dark:bg-secondary-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:translate-x-[-100%] peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:right-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"></div>
                </label>
              </div>
            </div>
          </motion.div>
          
          {/* Appearance */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="card-glass p-4"
          >
            <h2 className="text-lg font-bold mb-4 dark:text-white flex items-center">
              {theme === 'dark' ? (
                <Moon className="w-5 h-5 ml-2 text-primary-500" />
              ) : (
                <Sun className="w-5 h-5 ml-2 text-primary-500" />
              )}
              المظهر
            </h2>
            
            <div className="flex items-center justify-between">
              <span className="dark:text-white">الوضع الليلي</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={theme === 'dark'}
                  onChange={toggleTheme}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-secondary-200 dark:bg-secondary-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:translate-x-[-100%] peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:right-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"></div>
              </label>
            </div>
          </motion.div>
          
          {/* Language */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="card-glass p-4"
          >
            <h2 className="text-lg font-bold mb-4 dark:text-white flex items-center">
              <Globe className="w-5 h-5 ml-2 text-primary-500" />
              اللغة
            </h2>
            
            <select
              value={language}
              onChange={handleLanguageChange}
              className="w-full bg-white dark:bg-secondary-800 border border-secondary-200 dark:border-secondary-700 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:text-white"
            >
              <option value="ar">العربية</option>
              <option value="en">English</option>
            </select>
          </motion.div>
          
          {/* Security */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-4"
          >
            <button className="w-full p-4 card-glass flex items-center justify-between">
              <div className="flex items-center">
                <Lock className="w-5 h-5 ml-2 text-primary-500" />
                <span className="dark:text-white">تغيير كلمة المرور</span>
              </div>
              <ChevronLeft className="w-5 h-5 text-secondary-400" />
            </button>
            
            <button className="w-full p-4 card-glass flex items-center justify-between">
              <div className="flex items-center">
                <Shield className="w-5 h-5 ml-2 text-primary-500" />
                <span className="dark:text-white">الخصوصية والأمان</span>
              </div>
              <ChevronLeft className="w-5 h-5 text-secondary-400" />
            </button>
          </motion.div>
          
          {/* Help & Support */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-4"
          >
            <button className="w-full p-4 card-glass flex items-center justify-between">
              <div className="flex items-center">
                <HelpCircle className="w-5 h-5 ml-2 text-primary-500" />
                <span className="dark:text-white">المساعدة والدعم</span>
              </div>
              <ChevronLeft className="w-5 h-5 text-secondary-400" />
            </button>
            
            <button className="w-full p-4 card-glass flex items-center justify-between">
              <div className="flex items-center">
                <Info className="w-5 h-5 ml-2 text-primary-500" />
                <span className="dark:text-white">عن التطبيق</span>
              </div>
              <ChevronLeft className="w-5 h-5 text-secondary-400" />
            </button>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default Settings;