import React, { useState, useEffect } from 'react';
import { services } from '../data/services';
import Header from '../components/Header';
import ServiceCard from '../components/ServiceCard';
import { motion, AnimatePresence } from 'framer-motion';
import { PlusCircle, Filter, AlertTriangle, Trash2, Eye, EyeOff, Edit, Share2, DollarSign } from 'lucide-react';
import { Link } from 'react-router-dom';
import SearchBar from '../components/SearchBar';

const MyServices = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('active');
  const [myServices, setMyServices] = useState<typeof services>([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [showPromoteModal, setShowPromoteModal] = useState(false);
  
  useEffect(() => {
    // Load services from localStorage if available
    const storedServices = JSON.parse(localStorage.getItem('userServices') || '[]');
    
    // Combine with some default services for demo purposes
    // Ensure each service has a unique ID
    const defaultServices = services.slice(0, 3).map((service, index) => ({
      ...service,
      id: `default-${service.id}-${index}`, // Add index to ensure uniqueness
      status: 'active'
    }));
    
    const formattedStoredServices = storedServices.map((service: any, index: number) => ({
      ...service,
      id: `stored-${service.id}-${index}`, // Add index to ensure uniqueness
      status: 'active'
    }));
    
    setMyServices([...defaultServices, ...formattedStoredServices]);
    
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);
  
  const handleDeleteService = (serviceId: string) => {
    setSelectedService(serviceId);
    setShowDeleteModal(true);
  };
  
  const confirmDelete = () => {
    if (selectedService) {
      setMyServices(prev => prev.filter(service => service.id !== selectedService));
      // Update localStorage
      const storedServices = JSON.parse(localStorage.getItem('userServices') || '[]');
      const updatedServices = storedServices.filter((service: any) => service.id !== selectedService);
      localStorage.setItem('userServices', JSON.stringify(updatedServices));
    }
    setShowDeleteModal(false);
    setSelectedService(null);
  };
  
  const handleToggleStatus = (serviceId: string) => {
    setMyServices(prev => prev.map(service => 
      service.id === serviceId 
        ? { ...service, status: service.status === 'active' ? 'inactive' : 'active' }
        : service
    ));
  };
  
  const handlePromoteService = (serviceId: string) => {
    setSelectedService(serviceId);
    setShowPromoteModal(true);
  };
  
  const handleShare = (serviceId: string) => {
    // In a real app, this would use the Web Share API
    alert('تم نسخ رابط الخدمة!');
  };
  
  const filteredServices = myServices.filter(service => 
    service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.description.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const activeServices = filteredServices.filter(service => service.status === 'active');
  const inactiveServices = filteredServices.filter(service => service.status === 'inactive');
  
  const displayedServices = activeTab === 'active' ? activeServices : inactiveServices;

  return (
    <>
      <Header title="خدماتي" showBack={true} />
      
      <div className="page-container">
        <div className="mb-6">
          <SearchBar 
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="ابحث في خدماتك..."
          />
        </div>
        
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Link 
            to="/provider/add-service" 
            className="flex items-center justify-center btn-modern mb-6 relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-primary-400 to-primary-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <PlusCircle className="w-5 h-5 ml-2 relative z-10" />
            <span className="relative z-10">إضافة خدمة جديدة</span>
          </Link>
        </motion.div>
        
        <div className="flex mb-6 bg-secondary-100 dark:bg-secondary-800 rounded-xl p-1">
          <button
            className={`flex-1 py-2 text-center rounded-lg transition-all ${
              activeTab === 'active'
                ? 'bg-white dark:bg-secondary-700 text-primary-600 dark:text-primary-400 shadow-sm font-medium'
                : 'text-secondary-600 dark:text-secondary-400'
            }`}
            onClick={() => setActiveTab('active')}
          >
            الخدمات النشطة
          </button>
          <button
            className={`flex-1 py-2 text-center rounded-lg transition-all ${
              activeTab === 'inactive'
                ? 'bg-white dark:bg-secondary-700 text-primary-600 dark:text-primary-400 shadow-sm font-medium'
                : 'text-secondary-600 dark:text-secondary-400'
            }`}
            onClick={() => setActiveTab('inactive')}
          >
            الخدمات المعلقة
          </button>
        </div>
        
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((_, index) => (
              <motion.div 
                key={`loading-${index}`} 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="card-modern h-72 shimmer"
              />
            ))}
          </div>
        ) : (
          <>
            {displayedServices.length > 0 ? (
              <div className="space-y-4 pb-20">
                {displayedServices.map((service, index) => (
                  <div key={service.id} className="relative">
                    <ServiceCard 
                      service={service} 
                      index={index} 
                      isProvider={true} 
                    />
                    <div className="absolute top-3 right-3 flex space-x-2 rtl:space-x-reverse">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleToggleStatus(service.id)}
                        className="w-8 h-8 backdrop-blur-glass bg-white/60 dark:bg-secondary-800/60 rounded-full flex items-center justify-center shadow-glass border border-white/20 dark:border-secondary-700/30"
                        title={service.status === 'active' ? 'تعليق الخدمة' : 'تنشيط الخدمة'}
                      >
                        {service.status === 'active' ? (
                          <EyeOff className="w-4 h-4 text-secondary-600 dark:text-secondary-400" />
                        ) : (
                          <Eye className="w-4 h-4 text-secondary-600 dark:text-secondary-400" />
                        )}
                      </motion.button>
                      
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleShare(service.id)}
                        className="w-8 h-8 backdrop-blur-glass bg-white/60 dark:bg-secondary-800/60 rounded-full flex items-center justify-center shadow-glass border border-white/20 dark:border-secondary-700/30"
                        title="مشاركة"
                      >
                        <Share2 className="w-4 h-4 text-secondary-600 dark:text-secondary-400" />
                      </motion.button>
                      
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handlePromoteService(service.id)}
                        className="w-8 h-8 backdrop-blur-glass bg-primary-500/60 rounded-full flex items-center justify-center shadow-glass border border-primary-400/30"
                        title="ترويج الخدمة"
                      >
                        <DollarSign className="w-4 h-4 text-white" />
                      </motion.button>
                      
                      <Link
                        to={`/provider/edit-service/${service.id}`}
                        className="w-8 h-8 backdrop-blur-glass bg-white/60 dark:bg-secondary-800/60 rounded-full flex items-center justify-center shadow-glass border border-white/20 dark:border-secondary-700/30"
                      >
                        <Edit className="w-4 h-4 text-secondary-600 dark:text-secondary-400" />
                      </Link>
                      
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleDeleteService(service.id)}
                        className="w-8 h-8 backdrop-blur-glass bg-red-500/60 rounded-full flex items-center justify-center shadow-glass border border-red-400/30"
                        title="حذف الخدمة"
                      >
                        <Trash2 className="w-4 h-4 text-white" />
                      </motion.button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-12 text-center glass-morphism rounded-2xl"
              >
                <div className="w-16 h-16 bg-secondary-100 dark:bg-secondary-800 rounded-full flex items-center justify-center mb-4 animate-bounce-subtle">
                  <Filter className="w-8 h-8 text-secondary-400" />
                </div>
                <h3 className="text-lg font-bold text-secondary-800 dark:text-white mb-2">لا توجد خدمات</h3>
                <p className="text-secondary-600 dark:text-secondary-400">
                  {activeTab === 'active' 
                    ? 'لا توجد خدمات نشطة حالياً' 
                    : 'لا توجد خدمات معلقة حالياً'}
                </p>
                <Link 
                  to="/provider/add-service" 
                  className="mt-4 text-primary-600 dark:text-primary-400 font-medium hover:text-primary-700 dark:hover:text-primary-300 transition-colors"
                >
                  إضافة خدمة جديدة
                </Link>
              </motion.div>
            )}
          </>
        )}
      </div>
      
      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowDeleteModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-secondary-800 rounded-2xl p-6 max-w-sm mx-auto"
              onClick={e => e.stopPropagation()}
            >
              <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-8 h-8 text-red-600 dark:text-red-400" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-center dark:text-white">تأكيد الحذف</h3>
              <p className="text-secondary-600 dark:text-secondary-300 text-center mb-6">
                هل أنت متأكد من حذف هذه الخدمة؟ لا يمكن التراجع عن هذا الإجراء.
              </p>
              <div className="flex space-x-3 rtl:space-x-reverse">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 py-2 px-4 rounded-xl bg-secondary-100 dark:bg-secondary-700 text-secondary-700 dark:text-secondary-300"
                >
                  إلغاء
                </button>
                <button
                  onClick={confirmDelete}
                  className="flex-1 py-2 px-4 rounded-xl bg-red-500 text-white"
                >
                  حذف
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Promote Service Modal */}
      <AnimatePresence>
        {showPromoteModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowPromoteModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-secondary-800 rounded-2xl p-6 max-w-sm mx-auto w-full"
              onClick={e => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold mb-4 dark:text-white">ترويج الخدمة</h3>
              <div className="space-y-4 mb-6">
                <div className="card-glass p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium dark:text-white">باقة أساسية</span>
                    <span className="text-primary-600 dark:text-primary-400">50 ريال</span>
                  </div>
                  <p className="text-sm text-secondary-600 dark:text-secondary-300">
                    عرض الخدمة في القسم المميز لمدة 3 أيام
                  </p>
                </div>
                
                <div className="card-glass p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium dark:text-white">باقة متقدمة</span>
                    <span className="text-primary-600 dark:text-primary-400">100 ريال</span>
                  </div>
                  <p className="text-sm text-secondary-600 dark:text-secondary-300">
                    عرض الخدمة في القسم المميز لمدة 7 أيام
                  </p>
                </div>
                
                <div className="card-glass p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium dark:text-white">باقة احترافية</span>
                    <span className="text-primary-600 dark:text-primary-400">200 ريال</span>
                  </div>
                  <p className="text-sm text-secondary-600 dark:text-secondary-300">
                    عرض الخدمة في القسم المميز لمدة 15 يوم
                  </p>
                </div>
              </div>
              
              <div className="flex space-x-3 rtl:space-x-reverse">
                <button
                  onClick={() => setShowPromoteModal(false)}
                  className="flex-1 py-2 px-4 rounded-xl bg-secondary-100 dark:bg-secondary-700 text-secondary-700 dark:text-secondary-300"
                >
                  إلغاء
                </button>
                <button
                  onClick={() => {
                    // Handle promotion
                    setShowPromoteModal(false);
                  }}
                  className="flex-1 py-2 px-4 rounded-xl bg-primary-500 text-white"
                >
                  اختيار باقة
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default MyServices;