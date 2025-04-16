import React from 'react';
import { Calendar, Clock, MapPin, ChevronLeft, User, Phone } from 'lucide-react';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import { Booking } from '../data/bookings';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

interface BookingCardProps {
  booking: Booking;
  index: number;
  isPast?: boolean;
  isProvider?: boolean;
}

const BookingCard: React.FC<BookingCardProps> = ({ booking, index, isPast = false, isProvider = false }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      default:
        return 'bg-secondary-100 text-secondary-800 dark:bg-secondary-700 dark:text-secondary-300';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'مؤكد';
      case 'pending':
        return 'قيد الانتظار';
      case 'cancelled':
        return 'ملغي';
      default:
        return status;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      whileHover={{ y: -5 }}
      className="card-glass mb-4 relative overflow-hidden"
    >
      <Link to={`/service/${booking.service.id}`} className="block">
        <div className="flex">
          <img 
            src={booking.service.image} 
            alt={booking.service.title} 
            className="w-24 h-24 object-cover hover:scale-105 transition-transform duration-500"
          />
          <div className="p-3 flex-1">
            <div className="flex justify-between items-start">
              <h3 className="font-bold text-secondary-900 dark:text-white line-clamp-1">{booking.service.title}</h3>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                {getStatusText(booking.status)}
              </span>
            </div>
            
            <div className="mt-2 space-y-1">
              <div className="flex items-center text-secondary-600 dark:text-secondary-400 text-sm">
                <Calendar className="w-4 h-4 ml-2" />
                <span>{format(new Date(booking.date), 'EEEE, d MMMM yyyy', { locale: ar })}</span>
              </div>
              <div className="flex items-center text-secondary-600 dark:text-secondary-400 text-sm">
                <Clock className="w-4 h-4 ml-2" />
                <span>{booking.time}</span>
              </div>
              <div className="flex items-center text-secondary-600 dark:text-secondary-400 text-sm">
                <MapPin className="w-4 h-4 ml-2" />
                <span className="line-clamp-1">{booking.location}</span>
              </div>
              
              {isProvider && (
                <div className="flex items-center text-secondary-600 dark:text-secondary-400 text-sm">
                  <User className="w-4 h-4 ml-2" />
                  <span>محمد عبدالله</span>
                </div>
              )}
            </div>
          </div>
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-400 dark:text-secondary-500">
            <ChevronLeft className="w-5 h-5" />
          </div>
        </div>
      </Link>
      
      {/* أزرار للعميل */}
      {!isProvider && !isPast && booking.status !== 'cancelled' && (
        <div className="flex p-3 pt-0 justify-end space-x-2 rtl:space-x-reverse">
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="btn-glass text-sm py-2 px-4"
          >
            تعديل
          </motion.button>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-red-500/90 backdrop-blur-glass text-white text-sm py-2 px-4 rounded-xl hover:bg-red-600 shadow-glass border border-red-400/30"
          >
            إلغاء
          </motion.button>
        </div>
      )}
      
      {!isProvider && isPast && booking.status === 'confirmed' && !booking.reviewed && (
        <div className="p-3 pt-0 flex justify-end">
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="btn-neon text-sm py-2 px-4"
          >
            إضافة تقييم
          </motion.button>
        </div>
      )}
      
      {/* أزرار لمقدم الخدمة */}
      {isProvider && booking.status === 'pending' && (
        <div className="flex p-3 pt-0 justify-end space-x-2 rtl:space-x-reverse">
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="btn-neon text-sm py-2 px-4"
          >
            قبول
          </motion.button>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-red-500/90 backdrop-blur-glass text-white text-sm py-2 px-4 rounded-xl hover:bg-red-600 shadow-glass border border-red-400/30"
          >
            رفض
          </motion.button>
        </div>
      )}
      
      {isProvider && booking.status === 'confirmed' && !isPast && (
        <div className="flex p-3 pt-0 justify-end space-x-2 rtl:space-x-reverse">
          <motion.a 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            href="tel:+966555123456" 
            className="flex items-center btn-glass text-sm py-2 px-4"
          >
            <Phone className="w-4 h-4 ml-1" />
            <span>اتصال</span>
          </motion.a>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-red-500/90 backdrop-blur-glass text-white text-sm py-2 px-4 rounded-xl hover:bg-red-600 shadow-glass border border-red-400/30"
          >
            إلغاء
          </motion.button>
        </div>
      )}
    </motion.div>
  );
};

export default BookingCard;