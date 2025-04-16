import React from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, EffectFade } from 'swiper/modules';
import { promotions } from '../data/promotions';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

const PromotionBanner: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="mb-6 overflow-hidden rounded-2xl shadow-glass"
    >
      <Swiper
        spaceBetween={0}
        slidesPerView={1}
        effect="fade"
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
          bulletActiveClass: 'swiper-pagination-bullet-active bg-primary-500'
        }}
        modules={[Autoplay, Pagination, EffectFade]}
        className="h-48 sm:h-56 md:h-64 rounded-2xl"
      >
        {promotions.map((promo) => (
          <SwiperSlide key={promo.id}>
            <div className="relative h-full w-full overflow-hidden rounded-2xl">
              {/* Background Image with Overlay */}
              <div className="absolute inset-0">
                <img 
                  src={promo.image} 
                  alt={promo.title} 
                  className="h-full w-full object-cover"
                />
                <div className={`absolute inset-0 bg-gradient-to-r ${promo.backgroundColor || 'from-primary-600 to-primary-500'} opacity-80`}></div>
              </div>
              
              {/* Content */}
              <div className="absolute inset-0 flex flex-col justify-center p-6 text-white">
                <h3 className="text-xl font-bold mb-2">{promo.title}</h3>
                <p className="text-sm mb-4 opacity-90 line-clamp-2">{promo.description}</p>
                
                <Link 
                  to={promo.link} 
                  className="self-start bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-xl hover:bg-white/30 transition-colors flex items-center w-fit"
                >
                  <span>{promo.buttonText || 'اكتشف المزيد'}</span>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                </Link>
                
                {promo.expiryDate && (
                  <div className="absolute bottom-3 left-3 bg-black/30 backdrop-blur-sm px-2 py-1 rounded-lg text-xs">
                    ينتهي في: {new Date(promo.expiryDate).toLocaleDateString('ar-SA')}
                  </div>
                )}
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </motion.div>
  );
};

export default PromotionBanner;