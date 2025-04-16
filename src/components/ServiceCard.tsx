import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Star, MapPin, Heart, Edit, MoreVertical, MessageCircle, Truck, Clock, DollarSign } from 'lucide-react';
import { Service } from '../types/service';
import { motion } from 'framer-motion';
import CommissionInfo from './CommissionInfo';
import { useAuth } from '../context/AuthContext';
import { useChat } from '../context/ChatContext';

interface ServiceCardProps {
  service: Service;
  index: number;
  isProvider?: boolean;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service, index, isProvider = false }) => {
  const [isFavorite, setIsFavorite] = React.useState(false);
  const [showOptions, setShowOptions] = React.useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();
  const { createConversation } = useChat();

  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFavorite(!isFavorite);
  };

  const toggleOptions = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowOptions(!showOptions);
  };
  
  const handleStartChat = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      navigate('/auth');
      return;
    }
    
    const providerId = service.provider?.id || "provider-123";
    const conversationId = await createConversation(providerId, service.id);
    
    if (conversationId) {
      navigate(`/chat/${conversationId}`);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="relative"
    >
      <Link to={`/service/${service.id}`} className="block">
        <motion.div 
          whileHover={{ y: -5 }}
          transition={{ type: "spring", stiffness: 300 }}
          className="card-glass overflow-hidden"
        >
          <div className="relative">
            <img 
              src={service.image} 
              alt={service.title} 
              className="w-full h-48 object-cover hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute top-3 left-3 backdrop-blur-glass bg-white/60 dark:bg-secondary-800/60 px-2 py-1 rounded-lg flex items-center">
              <Star className="w-4 h-4 text-yellow-500 fill-yellow-500 ml-1" />
              <span className="font-medium dark:text-white">{service.rating}</span>
            </div>
            {isProvider ? (
              <motion.button 
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleOptions}
                className="absolute top-3 right-3 w-8 h-8 backdrop-blur-glass bg-white/60 dark:bg-secondary-800/60 rounded-full flex items-center justify-center"
              >
                <MoreVertical className="w-4 h-4 text-secondary-500 dark:text-secondary-400" />
              </motion.button>
            ) : (
              <motion.button 
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleFavorite}
                className="absolute top-3 right-3 w-8 h-8 backdrop-blur-glass bg-white/60 dark:bg-secondary-800/60 rounded-full flex items-center justify-center"
              >
                <Heart className={`w-4 h-4 ${isFavorite ? 'text-red-500 fill-red-500' : 'text-secondary-500 dark:text-secondary-400'}`} />
              </motion.button>
            )}
            
            {/* Price tag */}
            <div className="absolute bottom-3 right-3 backdrop-blur-glass bg-white/60 dark:bg-secondary-800/60 px-3 py-1 rounded-lg">
              <span className="font-bold text-primary-600 dark:text-primary-400">{service.price} ريال</span>
              <span className="text-xs text-secondary-500 dark:text-secondary-400 mr-1">/ للساعة</span>
            </div>
            
            {/* Chat button */}
            {!isProvider && (
              <motion.button 
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleStartChat}
                className="absolute bottom-3 left-3 backdrop-blur-glass bg-primary-500/80 text-white px-2 py-1 rounded-lg flex items-center"
              >
                <MessageCircle className="w-4 h-4 ml-1" />
                <span className="text-xs">تواصل</span>
              </motion.button>
            )}
          </div>
          <div className="p-4">
            <h3 className="font-bold text-lg mb-1 line-clamp-1 dark:text-white">{service.title}</h3>
            <div className="flex items-center text-secondary-500 dark:text-secondary-400 text-sm mb-2">
              <MapPin className="w-4 h-4 ml-1" />
              <span>{service.location}</span>
            </div>
            <p className="text-secondary-600 dark:text-secondary-300 text-sm mb-3 line-clamp-2">{service.description}</p>
            
            {/* Service features preview */}
            <div className="flex flex-wrap gap-1 mt-2">
              {service.features.slice(0, 2).map((feature, idx) => (
                <span key={idx} className="text-xs bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 px-2 py-1 rounded-full">
                  {feature.length > 15 ? feature.substring(0, 15) + '...' : feature}
                </span>
              ))}
              {service.features.length > 2 && (
                <span className="text-xs bg-secondary-100 dark:bg-secondary-700 text-secondary-600 dark:text-secondary-300 px-2 py-1 rounded-full">
                  +{service.features.length - 2}
                </span>
              )}
            </div>
            
            {/* Delivery Options */}
            {service.deliveryOptions && service.deliveryOptions.type !== 'none' && (
              <div className="mt-3 p-2 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Truck className="w-4 h-4 text-primary-500 ml-1" />
                    <span className="text-sm text-primary-600 dark:text-primary-400">
                      {service.deliveryOptions.type === 'free' && 'توصيل مجاني'}
                      {service.deliveryOptions.type === 'paid' && `توصيل ${service.deliveryOptions.price} ريال`}
                      {service.deliveryOptions.type === 'company' && `توصيل عبر ${service.deliveryOptions.companyName}`}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 text-primary-500 ml-1" />
                    <span className="text-sm text-primary-600 dark:text-primary-400">
                      {service.deliveryOptions.estimatedTime}
                    </span>
                  </div>
                </div>
                {service.deliveryOptions.areas.length > 0 && (
                  <div className="mt-1 text-xs text-secondary-500 dark:text-secondary-400">
                    مناطق التغطية: {service.deliveryOptions.areas.join('، ')}
                  </div>
                )}
              </div>
            )}
            
            {/* Commission info */}
            <CommissionInfo commission={service.price * 0.05} />
          </div>
        </motion.div>
      </Link>
    </motion.div>
  );
};

export default ServiceCard;