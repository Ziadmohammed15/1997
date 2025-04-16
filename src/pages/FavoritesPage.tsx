import React, { useState } from 'react';
import { services } from '../data/services';
import Header from '../components/Header';
import ServiceCard from '../components/ServiceCard';
import { motion } from 'framer-motion';

const FavoritesPage = () => {
  // In a real app, this would come from a user's saved favorites
  // For demo purposes, we'll just use the first 3 services
  const [favorites] = useState(services.slice(0, 3));

  return (
    <>
      <Header title="المفضلة" showBack={true} />
      
      <div className="page-container">
        {favorites.length > 0 ? (
          <div className="space-y-4">
            {favorites.map((service, index) => (
              <ServiceCard key={service.id} service={service} index={index} />
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-12"
          >
            <div className="w-24 h-24 bg-secondary-100 rounded-full flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-secondary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-secondary-800 mb-2">لا توجد خدمات مفضلة</h3>
            <p className="text-secondary-600 text-center">
              يمكنك إضافة الخدمات المفضلة لديك للوصول إليها بسهولة لاحقاً
            </p>
          </motion.div>
        )}
      </div>
    </>
  );
};

export default FavoritesPage;