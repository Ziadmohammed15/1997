import React from 'react';
import { Bell, Calendar, CheckCircle, AlertCircle, Info } from 'lucide-react';
import Header from './Header';
import { motion } from 'framer-motion';

interface Notification {
  id: number;
  title: string;
  message: string;
  time: string;
  type: 'booking' | 'success' | 'warning' | 'info';
  read: boolean;
}

const NotificationsPage = () => {
  const notifications: Notification[] = [
    {
      id: 1,
      title: 'تم تأكيد الحجز',
      message: 'تم تأكيد حجزك لخدمة تنظيف المنزل يوم الأربعاء القادم الساعة 10 صباحاً.',
      time: 'منذ 5 دقائق',
      type: 'success',
      read: false
    },
    {
      id: 2,
      title: 'تذكير بموعد',
      message: 'لديك موعد غداً الساعة 2 ظهراً مع خدمة صيانة وإصلاح الأجهزة المنزلية.',
      time: 'منذ 3 ساعات',
      type: 'booking',
      read: false
    },
    {
      id: 3,
      title: 'تم إلغاء الحجز',
      message: 'تم إلغاء حجزك لخدمة تنسيق الحدائق بنجاح وسيتم استرداد المبلغ خلال 3-5 أيام عمل.',
      time: 'منذ يوم',
      type: 'warning',
      read: true
    },
    {
      id: 4,
      title: 'عرض خاص',
      message: 'استمتع بخصم 15% على خدمات التنظيف هذا الأسبوع. استخدم كود: CLEAN15',
      time: 'منذ 3 أيام',
      type: 'info',
      read: true
    },
    {
      id: 5,
      title: 'تقييم الخدمة',
      message: 'لا تنسى تقييم خدمة الطبخ التي استخدمتها الأسبوع الماضي.',
      time: 'منذ 5 أيام',
      type: 'info',
      read: true
    }
  ];

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'booking':
        return <Calendar className="w-6 h-6 text-primary-500" />;
      case 'success':
        return <CheckCircle className="w-6 h-6 text-green-500" />;
      case 'warning':
        return <AlertCircle className="w-6 h-6 text-red-500" />;
      case 'info':
        return <Info className="w-6 h-6 text-blue-500" />;
      default:
        return <Bell className="w-6 h-6 text-primary-500" />;
    }
  };

  const getNotificationBg = (type: string, read: boolean) => {
    if (read) return 'bg-white dark:bg-secondary-800';
    
    switch (type) {
      case 'booking':
        return 'bg-primary-50 dark:bg-primary-900/20';
      case 'success':
        return 'bg-green-50 dark:bg-green-900/20';
      case 'warning':
        return 'bg-red-50 dark:bg-red-900/20';
      case 'info':
        return 'bg-blue-50 dark:bg-blue-900/20';
      default:
        return 'bg-white dark:bg-secondary-800';
    }
  };

  return (
    <>
      <Header title="الإشعارات" showBack={true} />
      
      <div className="page-container">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold dark:text-white">الإشعارات الأخيرة</h2>
          <button className="text-primary-500 dark:text-primary-400 text-sm">تحديد الكل كمقروء</button>
        </div>
        
        <div className="space-y-4">
          {notifications.map((notification, index) => (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className={`card p-4 ${getNotificationBg(notification.type, notification.read)}`}
            >
              <div className="flex">
                <div className="ml-4">
                  {getNotificationIcon(notification.type)}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h3 className="font-bold text-secondary-900 dark:text-white">{notification.title}</h3>
                    <span className="text-xs text-secondary-500 dark:text-secondary-400">{notification.time}</span>
                  </div>
                  <p className="text-secondary-600 dark:text-secondary-300 mt-1">{notification.message}</p>
                </div>
              </div>
              {!notification.read && (
                <div className="w-2 h-2 bg-primary-500 rounded-full absolute top-4 left-4"></div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </>
  );
};

export default NotificationsPage;