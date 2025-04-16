import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Calendar, Clock, MapPin, User, CreditCard, Download, Share2 } from 'lucide-react';
import Header from '../components/Header';
import { motion } from 'framer-motion';
import CommissionInfo from '../components/CommissionInfo';

const BookingConfirmation = () => {
  const navigate = useNavigate();
  
  // In a real app, this would come from the booking process
  const bookingDetails = {
    serviceName: 'خدمة تنظيف المنازل',
    date: '2025-01-20',
    time: '10:00 ص',
    location: 'حي النزهة، الرياض',
    provider: 'شركة النظافة المثالية',
    price: 150,
    bookingId: 'BK12345'
  };
  
  const handleShare = () => {
    // In a real app, this would use the Web Share API
    alert('تم نسخ رابط الحجز!');
  };

  // Calculate commission and VAT
  const commission = bookingDetails.price * 0.05; // 5% commission
  const vat = bookingDetails.price * 0.15; // 15% VAT
  const total = bookingDetails.price + commission + vat;

  return (
    <>
      <Header showBack={true} />
      
      <div className="page-container">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center text-center mb-8"
        >
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
            className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-4"
          >
            <CheckCircle className="w-12 h-12 text-green-500 dark:text-green-400" />
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-2xl font-bold mb-2 dark:text-white"
          >
            تم تأكيد الحجز
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-secondary-600 dark:text-secondary-300"
          >
            تم تأكيد حجزك بنجاح. ستصلك رسالة تأكيد على بريدك الإلكتروني.
          </motion.p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="card-glass p-6 mb-6"
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold dark:text-white">تفاصيل الحجز</h2>
            <div className="flex space-x-2 rtl:space-x-reverse">
              <motion.button 
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleShare}
                className="flex items-center text-primary-600 dark:text-primary-400 text-sm"
              >
                <Share2 className="w-4 h-4 ml-1" />
                مشاركة
              </motion.button>
              <motion.button 
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="flex items-center text-primary-600 dark:text-primary-400 text-sm"
              >
                <Download className="w-4 h-4 ml-1" />
                حفظ
              </motion.button>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-start">
              <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/50 flex items-center justify-center ml-3">
                <Calendar className="w-5 h-5 text-primary-600 dark:text-primary-400" />
              </div>
              <div>
                <p className="text-sm text-secondary-500 dark:text-secondary-400">التاريخ</p>
                <p className="font-medium dark:text-white">{bookingDetails.date}</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/50 flex items-center justify-center ml-3">
                <Clock className="w-5 h-5 text-primary-600 dark:text-primary-400" />
              </div>
              <div>
                <p className="text-sm text-secondary-500 dark:text-secondary-400">الوقت</p>
                <p className="font-medium dark:text-white">{bookingDetails.time}</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/50 flex items-center justify-center ml-3">
                <MapPin className="w-5 h-5 text-primary-600 dark:text-primary-400" />
              </div>
              <div>
                <p className="text-sm text-secondary-500 dark:text-secondary-400">الموقع</p>
                <p className="font-medium dark:text-white">{bookingDetails.location}</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/50 flex items-center justify-center ml-3">
                <User className="w-5 h-5 text-primary-600 dark:text-primary-400" />
              </div>
              <div>
                <p className="text-sm text-secondary-500 dark:text-secondary-400">مقدم الخدمة</p>
                <p className="font-medium dark:text-white">{bookingDetails.provider}</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/50 flex items-center justify-center ml-3">
                <CreditCard className="w-5 h-5 text-primary-600 dark:text-primary-400" />
              </div>
              <div>
                <p className="text-sm text-secondary-500 dark:text-secondary-400">طريقة الدفع</p>
                <p className="font-medium dark:text-white">بطاقة مدى **** 5678</p>
              </div>
            </div>
          </div>
          
          <div className="mt-6 pt-6 border-t border-secondary-100 dark:border-secondary-700">
            <div className="flex justify-between items-center mb-2">
              <span className="text-secondary-600 dark:text-secondary-400">سعر الخدمة</span>
              <span className="font-medium dark:text-white">{bookingDetails.price} ريال</span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-secondary-600 dark:text-secondary-400">عمولة المنصة (5%)</span>
              <span className="font-medium dark:text-white">{commission.toFixed(2)} ريال</span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-secondary-600 dark:text-secondary-400">ضريبة القيمة المضافة (15%)</span>
              <span className="font-medium dark:text-white">{vat.toFixed(2)} ريال</span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-secondary-100 dark:border-secondary-700">
              <span className="font-bold dark:text-white">الإجمالي</span>
              <span className="font-bold text-primary-600 dark:text-primary-400">{total.toFixed(2)} ريال</span>
            </div>
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="card-glass p-4 mb-8 bg-secondary-50/80 dark:bg-secondary-800/80"
        >
          <div className="flex justify-between items-center">
            <span className="text-secondary-600 dark:text-secondary-400">رقم الحجز</span>
            <span className="font-medium dark:text-white">{bookingDetails.bookingId}</span>
          </div>
        </motion.div>
        
        <div className="space-y-4">
          <motion.button 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/my-bookings')}
            className="btn-neon w-full"
          >
            عرض حجوزاتي
          </motion.button>
          
          <motion.button 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/home')}
            className="btn-glass w-full"
          >
            العودة للرئيسية
          </motion.button>
        </div>
      </div>
    </>
  );
};

export default BookingConfirmation;