import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Star, MapPin, Clock, Calendar, User, ChevronDown, ChevronUp, Check, ArrowRight, Heart, Share2, MessageCircle } from 'lucide-react';
import { services } from '../data/services';
import { reviews } from '../data/reviews';
import { motion, AnimatePresence } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import CommissionInfo from '../components/CommissionInfo';
import RatingStars from '../components/RatingStars';
import DateTimePicker from '../components/DateTimePicker';
import { useAuth } from '../context/AuthContext';
import { useChat } from '../context/ChatContext';
import 'swiper/css';
import 'swiper/css/pagination';
import { Pagination, Autoplay, EffectFade } from 'swiper/modules';

const ServiceDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { createConversation } = useChat();
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  
  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);
  
  const service = services.find(s => s.id === Number(id));
  const serviceReviews = reviews.filter(review => review.serviceId === Number(id));
  
  const displayedReviews = showAllReviews ? serviceReviews : serviceReviews.slice(0, 3);
  
  if (isLoading) {
    return (
      <div className="app-container flex flex-col items-center justify-center p-6">
        <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-secondary-600 dark:text-secondary-400">جاري تحميل تفاصيل الخدمة...</p>
      </div>
    );
  }
  
  if (!service) {
    return (
      <div className="app-container flex items-center justify-center">
        <p className="text-secondary-600 dark:text-secondary-400">الخدمة غير موجودة</p>
      </div>
    );
  }

  const availableTimes = [
    '09:00 ص',
    '10:00 ص',
    '11:00 ص',
    '12:00 م',
    '01:00 م',
    '02:00 م',
    '03:00 م',
    '04:00 م',
  ];

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };
  
  const handleBookNow = () => {
    if (selectedDate && selectedTime) {
      navigate('/booking-confirmation');
    } else {
      setShowBookingModal(true);
    }
  };
  
  const handleShare = () => {
    // In a real app, this would use the Web Share API
    alert('تم نسخ رابط الخدمة!');
  };
  
  const handleStartChat = async () => {
    if (!user) {
      // Redirect to login if not authenticated
      navigate('/auth');
      return;
    }
    
    // In a real app, we would get the provider's ID from the service
    // For now, we'll use a mock provider ID
    const providerId = "provider-123";
    
    // Create or get existing conversation
    const conversationId = await createConversation(providerId, service.id);
    
    if (conversationId) {
      navigate(`/chat/${conversationId}`);
    }
  };
  
  // Additional images for the service (for demo purposes)
  const serviceImages = [
    service.image,
    "https://images.unsplash.com/photo-1581578731548-c64695cc6952?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    "https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
  ];

  return (
    <div className="app-container pb-24">
      <div className="relative">
        <div className="absolute top-0 left-0 right-0 z-10 flex justify-between items-center p-4">
          <motion.button 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => navigate(-1)}
            className="w-10 h-10 backdrop-blur-glass bg-white/60 dark:bg-secondary-800/60 rounded-full flex items-center justify-center shadow-glass border border-white/20 dark:border-secondary-700/30"
          >
            <ArrowRight className="w-5 h-5 text-secondary-800 dark:text-secondary-200" />
          </motion.button>
          
          <div className="flex space-x-2 rtl:space-x-reverse">
            <motion.button 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleShare}
              className="w-10 h-10 backdrop-blur-glass bg-white/60 dark:bg-secondary-800/60 rounded-full flex items-center justify-center shadow-glass border border-white/20 dark:border-secondary-700/30"
            >
              <Share2 className="w-5 h-5 text-secondary-800 dark:text-secondary-200" />
            </motion.button>
            <motion.button 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={toggleFavorite}
              className="w-10 h-10 backdrop-blur-glass bg-white/60 dark:bg-secondary-800/60 rounded-full flex items-center justify-center shadow-glass border border-white/20 dark:border-secondary-700/30"
            >
              <Heart 
                className={`w-5 h-5 ${isFavorite ? 'text-red-500 fill-red-500' : 'text-secondary-800 dark:text-secondary-200'}`} 
              />
            </motion.button>
          </div>
        </div>
        
        <Swiper
          spaceBetween={0}
          slidesPerView={1}
          pagination={{ 
            clickable: true,
            bulletActiveClass: 'swiper-pagination-bullet-active bg-primary-500'
          }}
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
          }}
          effect="fade"
          modules={[Pagination, Autoplay, EffectFade]}
          className="h-72"
          onSlideChange={(swiper) => setActiveImageIndex(swiper.activeIndex)}
        >
          {serviceImages.map((image, index) => (
            <SwiperSlide key={index}>
              <img 
                src={image} 
                alt={`${service.title} - صورة ${index + 1}`} 
                className="w-full h-full object-cover"
              />
            </SwiperSlide>
          ))}
        </Swiper>
        
        {/* Thumbnail navigation */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10 flex space-x-2 rtl:space-x-reverse">
          {serviceImages.map((_, index) => (
            <motion.button
              key={index}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setActiveImageIndex(index)}
              className={`w-2 h-2 rounded-full ${
                activeImageIndex === index 
                  ? 'bg-primary-500 w-4' 
                  : 'bg-white/60'
              } transition-all duration-200`}
            />
          ))}
        </div>
      </div>
      
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl font-bold dark:text-white"
          >
            {service.title}
          </motion.h1>
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="backdrop-blur-glass bg-yellow-50/80 dark:bg-yellow-900/30 px-2 py-1 rounded-lg flex items-center shadow-glass border border-yellow-100/50 dark:border-yellow-700/30"
          >
            <RatingStars rating={service.rating} size="sm" className="ml-1" />
            <span className="font-medium text-yellow-700 dark:text-yellow-400">{service.rating}</span>
          </motion.div>
        </div>
        
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex items-center text-secondary-600 dark:text-secondary-400 mb-4"
        >
          <MapPin className="w-4 h-4 ml-1" />
          <span>{service.location}</span>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-6 backdrop-blur-glass bg-primary-50/80 dark:bg-primary-900/30 p-3 rounded-xl shadow-glass border border-primary-100/50 dark:border-primary-700/30"
        >
          <div className="flex justify-between items-center">
            <span className="text-2xl font-bold text-primary-600 dark:text-primary-400">{service.price} ريال</span>
            <span className="text-secondary-600 dark:text-secondary-400">/ للساعة</span>
          </div>
          
          {/* Commission info */}
          <CommissionInfo commission={service.commission} />
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-6"
        >
          <h2 className="text-lg font-bold mb-2 dark:text-white">وصف الخدمة</h2>
          <p className="text-secondary-600 dark:text-secondary-300 leading-relaxed">{service.description}</p>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-6"
        >
          <h2 className="text-lg font-bold mb-3 dark:text-white">ما يميز الخدمة</h2>
          <div className="grid grid-cols-1 gap-2">
            {service.features.map((feature, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
                className="flex items-center backdrop-blur-glass bg-secondary-50/80 dark:bg-secondary-800/80 p-3 rounded-xl shadow-glass border border-secondary-100/50 dark:border-secondary-700/30"
              >
                <div className="w-6 h-6 rounded-full bg-primary-100 dark:bg-primary-900/50 flex items-center justify-center ml-3">
                  <Check className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                </div>
                <span className="text-secondary-700 dark:text-secondary-300">{feature}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mb-6"
        >
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold dark:text-white">التقييمات</h2>
            {serviceReviews.length > 3 && (
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowAllReviews(!showAllReviews)}
                className="text-primary-600 dark:text-primary-400 text-sm flex items-center"
              >
                {showAllReviews ? 'عرض أقل' : 'عرض الكل'}
                {showAllReviews ? <ChevronUp className="mr-1 w-4 h-4" /> : <ChevronDown className="mr-1 w-4 h-4" />}
              </motion.button>
            )}
          </div>
          
          {displayedReviews.length > 0 ? (
            <div className="space-y-4">
              {displayedReviews.map((review, index) => (
                <motion.div 
                  key={review.id} 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="backdrop-blur-glass bg-secondary-50/80 dark:bg-secondary-800/80 p-4 rounded-xl shadow-glass border border-secondary-100/50 dark:border-secondary-700/30"
                >
                  <div className="flex items-center mb-2">
                    <div className="w-10 h-10 rounded-full bg-secondary-200 dark:bg-secondary-700 flex items-center justify-center ml-3">
                      <User className="w-6 h-6 text-secondary-500 dark:text-secondary-400" />
                    </div>
                    <div>
                      <h4 className="font-medium dark:text-white">{review.userName}</h4>
                      <div className="flex items-center">
                        <RatingStars rating={review.rating} size="sm" />
                        <span className="text-secondary-500 dark:text-secondary-400 text-xs mr-2">{review.date}</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-secondary-700 dark:text-secondary-300 text-sm">{review.comment}</p>
                </motion.div>
              ))}
            </div>
          ) : (
            <p className="text-secondary-500 dark:text-secondary-400 text-center py-4">لا توجد تقييمات بعد.</p>
          )}
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mb-6"
        >
          <h2 className="text-lg font-bold mb-3 dark:text-white">احجز الآن</h2>
          
          <DateTimePicker 
            selectedDate={selectedDate}
            selectedTime={selectedTime}
            onSelectDate={(date) => setSelectedDate(date)}
            onSelectTime={(time) => setSelectedTime(time)}
            availableTimes={availableTimes}
            className="mb-6"
          />
          
          {/* Detailed commission info */}
          <CommissionInfo price={service.price} showDetailed={true} />
        </motion.div>
      </div>
      
      <motion.div 
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.8, type: "spring" }}
        className="fixed bottom-0 left-0 right-0 p-4 backdrop-blur-glass bg-white/80 dark:bg-secondary-800/80 border-t border-white/20 dark:border-secondary-700/30 shadow-glass"
      >
        <div className="flex space-x-3 rtl:space-x-reverse">
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleStartChat}
            className="flex-1 flex items-center justify-center py-3 px-4 rounded-xl bg-secondary-100 dark:bg-secondary-700 text-primary-600 dark:text-primary-400"
          >
            <MessageCircle className="w-5 h-5 ml-2" />
            <span>تواصل مع المزود</span>
          </motion.button>
          
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleBookNow}
            className={`flex-1 btn-neon ${
              !selectedDate || !selectedTime ? 'opacity-90' : ''
            }`}
          >
            احجز الآن
          </motion.button>
        </div>
        
        <div className="mt-2 text-xs text-secondary-500 dark:text-secondary-400 flex items-center justify-center">
          <Calendar className="w-3 h-3 ml-1" />
          <span>يمكنك إلغاء الحجز قبل 24 ساعة</span>
        </div>
      </motion.div>
      
      <AnimatePresence>
        {showBookingModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowBookingModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="backdrop-blur-glass bg-white/90 dark:bg-secondary-900/90 rounded-2xl p-6 w-full max-w-sm shadow-glass border border-white/20 dark:border-secondary-700/30"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold mb-4 dark:text-white">اختر موعد الحجز</h3>
              <p className="text-secondary-600 dark:text-secondary-300 mb-4">
                يرجى اختيار التاريخ والوقت المناسب لحجز الخدمة
              </p>
              
              <DateTimePicker 
                selectedDate={selectedDate}
                selectedTime={selectedTime}
                onSelectDate={(date) => setSelectedDate(date)}
                onSelectTime={(time) => setSelectedTime(time)}
                availableTimes={availableTimes}
                className="mb-6"
              />
              
              {/* Commission info in modal */}
              <CommissionInfo price={service.price} showDetailed={true} />
              
              <div className="flex space-x-3 rtl:space-x-reverse mt-6">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowBookingModal(false)}
                  className="btn-glass flex-1"
                >
                  إلغاء
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    if (selectedDate && selectedTime) {
                      navigate('/booking-confirmation');
                    }
                  }}
                  className={`btn-neon flex-1 ${
                    !selectedDate || !selectedTime ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                  disabled={!selectedDate || !selectedTime}
                >
                  تأكيد
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ServiceDetails;