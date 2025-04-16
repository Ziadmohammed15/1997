import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Calendar, PlusCircle, User, Briefcase, MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useChat } from '../context/ChatContext';

const ProviderBottomNavigation = () => {
  const location = useLocation();
  const { conversations } = useChat();
  
  // Calculate total unread messages
  const unreadCount = conversations?.reduce((total, conv) => total + (conv.unread_count || 0), 0) || 0;
  
  const navItems = [
    { 
      path: '/provider/home', 
      icon: Home, 
      label: 'الرئيسية',
      showBadge: false
    },
    { 
      path: '/provider/bookings', 
      icon: Calendar, 
      label: 'الحجوزات',
      showBadge: false
    },
    { 
      path: '/provider/add-service', 
      icon: PlusCircle, 
      label: 'إضافة خدمة', 
      className: 'bg-primary-500 text-white rounded-full p-3 -mt-5 shadow-lg',
      showBadge: false
    },
    { 
      path: '/provider/my-services', 
      icon: Briefcase, 
      label: 'خدماتي',
      showBadge: false
    },
    { 
      path: '/chats', 
      icon: MessageCircle, 
      label: 'المحادثات', 
      badge: unreadCount,
      showBadge: true
    },
    { 
      path: '/provider/profile', 
      icon: User, 
      label: 'حسابي',
      showBadge: false
    }
  ];

  return (
    <motion.div 
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ delay: 0.3, type: "spring", stiffness: 300, damping: 30 }}
      className="fixed bottom-0 left-0 right-0 bg-white/90 dark:bg-secondary-800/90 backdrop-blur-glass shadow-lg dark:shadow-secondary-900/50 rounded-t-3xl py-2 z-50 border-t border-secondary-100/50 dark:border-secondary-700/50 transition-colors duration-300"
    >
      <div className="max-w-md mx-auto flex justify-around items-center">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path || 
                          (item.path === '/chats' && location.pathname.startsWith('/chat/'));
          const Icon = item.icon;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center justify-center py-2 px-1 ${
                isActive 
                  ? 'text-primary-500' 
                  : 'text-secondary-400 dark:text-secondary-500 hover:text-secondary-600 dark:hover:text-secondary-300'
              }`}
            >
              <motion.div 
                whileHover={item.path !== '/provider/add-service' ? { y: -3 } : { scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className={`relative ${item.className || ''}`}
              >
                <Icon size={item.path === '/provider/add-service' ? 28 : 24} />
                {isActive && item.path !== '/provider/add-service' && (
                  <motion.div
                    layoutId="providerBottomNavIndicator"
                    className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-5 h-1 bg-primary-500 rounded-full"
                    initial={false}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
                
                {item.showBadge && item.badge > 0 && (
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-[10px] font-bold">
                      {item.badge > 9 ? '9+' : item.badge}
                    </span>
                  </div>
                )}
              </motion.div>
              <span className="text-xs mt-1">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </motion.div>
  );
};

export default ProviderBottomNavigation;