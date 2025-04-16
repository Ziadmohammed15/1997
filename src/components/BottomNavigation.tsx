import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Calendar, User, Heart, MessageCircle, PlusCircle, Briefcase } from 'lucide-react';
import { motion } from 'framer-motion';
import { useChat } from '../context/ChatContext';

interface BottomNavigationProps {
  userType: 'client' | 'provider' | null;
}

const BottomNavigation: React.FC<BottomNavigationProps> = ({ userType }) => {
  const location = useLocation();
  const { conversations } = useChat();
  
  // Calculate total unread messages
  const unreadCount = conversations?.reduce((total, conv) => total + (conv.unread_count || 0), 0) || 0;
  
  const clientNavItems = [
    { path: '/home', icon: Home, label: 'الرئيسية' },
    { path: '/my-bookings', icon: Calendar, label: 'حجوزاتي' },
    { path: '/chats', icon: MessageCircle, label: 'المحادثات', badge: unreadCount },
    { path: '/favorites', icon: Heart, label: 'المفضلة' },
    { path: '/profile', icon: User, label: 'حسابي' },
  ];

  const providerNavItems = [
    { path: '/provider/home', icon: Home, label: 'الرئيسية' },
    { path: '/provider/bookings', icon: Calendar, label: 'الحجوزات' },
    { path: '/provider/add-service', icon: PlusCircle, label: 'إضافة خدمة', className: 'bg-primary-500 text-white rounded-full p-3 -mt-5 shadow-lg' },
    { path: '/provider/my-services', icon: Briefcase, label: 'خدماتي' },
    { path: '/chats', icon: MessageCircle, label: 'المحادثات', badge: unreadCount },
    { path: '/provider/profile', icon: User, label: 'حسابي' },
  ];

  const navItems = userType === 'provider' ? providerNavItems : clientNavItems;

  return (
    <div className="fixed bottom-0 left-0 right-0 w-full max-w-md mx-auto bg-white dark:bg-secondary-900 shadow-lg border-t border-secondary-100 dark:border-secondary-800">
      <div className="flex items-center justify-around px-2 py-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path || 
                          (item.path === '/chats' && location.pathname.startsWith('/chat/'));
          const Icon = item.icon;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`relative flex flex-col items-center justify-center min-w-[3rem] py-1 px-2 rounded-lg transition-colors ${
                isActive 
                  ? 'text-primary-500' 
                  : 'text-secondary-400 hover:text-secondary-600 dark:text-secondary-500 dark:hover:text-secondary-300'
              }`}
            >
              <div className={`relative ${item.className || ''}`}>
                <Icon className="w-6 h-6" />
                {item.badge && item.badge > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-[10px] text-white font-bold">
                    {item.badge > 9 ? '9+' : item.badge}
                  </span>
                )}
              </div>
              <span className="text-xs mt-1">{item.label}</span>
              {isActive && !item.className && (
                <span className="absolute bottom-0 left-1/2 w-4 h-1 bg-primary-500 rounded-full transform -translate-x-1/2" />
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNavigation;