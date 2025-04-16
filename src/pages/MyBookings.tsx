import React, { useState, useEffect } from 'react';
import { bookings } from '../data/bookings';
import Header from '../components/Header';
import BookingCard from '../components/BookingCard';
import { motion } from 'framer-motion';
import { Calendar, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface MyBookingsProps {
  isProvider?: boolean;
}

const MyBookings: React.FC<MyBookingsProps> = ({ isProvider = false }) => {
  const [activeTab, setActiveTab] = useState('upcoming');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  
  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);
  
  const upcomingBookings = bookings.filter(booking => 
    new Date(booking.date) >= new Date() &&
    (booking.service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
     booking.location.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  
  const pastBookings = bookings.filter(booking => 
    new Date(booking.date) < new Date() &&
    (booking.service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
     booking.location.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  
  const displayedBookings = activeTab === 'upcoming' ? upcomingBookings : pastBookings;

  return (
    <>
      <Header 
        title={isProvider ? "الحجوزات الواردة" : "حجوزاتي"} 
        showBack={true} 
      />
      
      <div className="page-container">
        <div className="relative mb-6">
          <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
            <Search className="w-5 h-5 text-secondary-400" />
          </div>
          <input
            type="text"
            className="input-field pr-12"
            placeholder={isProvider ? "ابحث في الحجوزات الواردة..." : "ابحث عن حجز..."}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex mb-6 bg-secondary-100 rounded-xl p-1">
          <button
            className={`flex-1 py-2 text-center rounded-lg transition-all ${
              activeTab === 'upcoming'
                ? 'bg-white text-primary-600 shadow-sm font-medium'
                : 'text-secondary-600'
            }`}
            onClick={() => setActiveTab('upcoming')}
          >
            {isProvider ? "الحجوزات القادمة" : "حجوزاتي القادمة"}
          </button>
          <button
            className={`flex-1 py-2 text-center rounded-lg transition-all ${
              activeTab === 'past'
                ? 'bg-white text-primary-600 shadow-sm font-medium'
                : 'text-secondary-600'
            }`}
            onClick={() => setActiveTab('past')}
          >
            {isProvider ? "الحجوزات السابقة" : "حجوزاتي السابقة"}
          </button>
        </div>
        
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((_, index) => (
              <div key={index} className="card p-4 animate-pulse">
                <div className="flex">
                  <div className="w-24 h-24 bg-secondary-200 rounded-lg"></div>
                  <div className="p-3 flex-1">
                    <div className="h-5 bg-secondary-200 rounded w-3/4 mb-3"></div>
                    <div className="space-y-2">
                      <div className="h-4 bg-secondary-200 rounded w-1/2"></div>
                      <div className="h-4 bg-secondary-200 rounded w-2/3"></div>
                      <div className="h-4 bg-secondary-200 rounded w-1/3"></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            {displayedBookings.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-12 bg-secondary-50 rounded-xl"
              >
                <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mb-4">
                  <Calendar className="w-8 h-8 text-secondary-400" />
                </div>
                <p className="text-secondary-600 mb-2">
                  {isProvider 
                    ? `لا توجد حجوزات ${activeTab === 'upcoming' ? 'قادمة' : 'سابقة'}`
                    : `لا توجد حجوزات ${activeTab === 'upcoming' ? 'قادمة' : 'سابقة'}`}
                </p>
                {activeTab === 'upcoming' && !isProvider && (
                  <button 
                    onClick={() => navigate('/home')}
                    className="text-primary-600 font-medium"
                  >
                    استكشف الخدمات
                  </button>
                )}
              </motion.div>
            ) : (
              <div className="pb-24">
                {displayedBookings.map((booking, index) => (
                  <BookingCard 
                    key={booking.id} 
                    booking={booking} 
                    index={index}
                    isPast={activeTab === 'past'}
                    isProvider={isProvider}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default MyBookings;