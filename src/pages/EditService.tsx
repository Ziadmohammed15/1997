import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { motion } from 'framer-motion';
import { useToast } from '../context/ToastContext';
import { Camera, Plus, X, DollarSign, MapPin, Tag, FileText } from 'lucide-react';
import { categories, getSubcategoriesByParent } from '../data/categories';
import { services } from '../data/services';
import DeliveryOptionsForm from '../components/DeliveryOptionsForm';

const EditService = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showSuccess, showError } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
    subcategory: '',
    location: '',
    features: [] as string[],
    image: '',
    status: 'active' as 'active' | 'inactive'
  });
  
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [newFeature, setNewFeature] = useState('');
  const [deliveryOptions, setDeliveryOptions] = useState({
    type: 'none' as 'free' | 'paid' | 'none' | 'company',
    price: 0,
    companyName: '',
    areas: [] as string[],
    estimatedTime: ''
  });
  
  useEffect(() => {
    // Load service data
    const service = services.find(s => s.id === Number(id));
    if (service) {
      setFormData({
        title: service.title,
        description: service.description,
        price: service.price.toString(),
        category: service.category,
        subcategory: service.subcategory || '',
        location: service.location,
        features: service.features,
        image: service.image,
        status: 'active'
      });
      setImagePreview(service.image);
      
      if (service.deliveryOptions) {
        setDeliveryOptions({
          type: service.deliveryOptions.type,
          price: service.deliveryOptions.price || 0,
          companyName: service.deliveryOptions.companyName || '',
          areas: service.deliveryOptions.areas,
          estimatedTime: service.deliveryOptions.estimatedTime
        });
      }
    }
    setIsLoading(false);
  }, [id]);
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleAddFeature = () => {
    if (newFeature.trim()) {
      setFormData(prev => ({
        ...prev,
        features: [...prev.features, newFeature.trim()]
      }));
      setNewFeature('');
    }
  };
  
  const handleRemoveFeature = (index: number) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Validate form
      if (!formData.title || !formData.description || !formData.price || !formData.category || !formData.location) {
        throw new Error('جميع الحقول المطلوبة يجب تعبئتها');
      }
      
      // In a real app, update service in database
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      showSuccess('تم تحديث الخدمة بنجاح');
      navigate('/provider/my-services');
    } catch (error) {
      showError(error instanceof Error ? error.message : 'حدث خطأ أثناء تحديث الخدمة');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <>
        <Header title="تعديل الخدمة" showBack={true} />
        <div className="page-container">
          <div className="animate-pulse space-y-4">
            <div className="h-48 bg-secondary-200 dark:bg-secondary-700 rounded-xl"></div>
            <div className="h-10 bg-secondary-200 dark:bg-secondary-700 rounded-xl w-3/4"></div>
            <div className="h-32 bg-secondary-200 dark:bg-secondary-700 rounded-xl"></div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header title="تعديل الخدمة" showBack={true} />
      
      <div className="page-container pb-24">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Image Upload */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative"
          >
            <input
              type="file"
              id="service-image"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
            <label
              htmlFor="service-image"
              className="block w-full h-48 rounded-xl overflow-hidden bg-secondary-100 dark:bg-secondary-800 cursor-pointer relative group"
            >
              {imagePreview ? (
                <>
                  <img
                    src={imagePreview}
                    alt="Service preview"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Camera className="w-8 h-8 text-white" />
                  </div>
                </>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-secondary-400">
                  <Camera className="w-8 h-8 mb-2" />
                  <span>اختر صورة للخدمة</span>
                </div>
              )}
            </label>
          </motion.div>
          
          {/* Basic Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-4"
          >
            <div>
              <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                عنوان الخدمة
              </label>
              <div className="relative">
                <Tag className="absolute right-3 top-1/2 transform -translate-y-1/2 text-secondary-400" />
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="input-field pr-10"
                  placeholder="أدخل عنوان الخدمة"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                وصف الخدمة
              </label>
              <div className="relative">
                <FileText className="absolute right-3 top-3 text-secondary-400" />
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="input-field pr-10"
                  rows={4}
                  placeholder="اكتب وصفاً تفصيلياً للخدمة"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                السعر
              </label>
              <div className="relative">
                <DollarSign className="absolute right-3 top-1/2 transform -translate-y-1/2 text-secondary-400" />
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                  className="input-field pr-10"
                  placeholder="أدخل سعر الخدمة"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                الموقع
              </label>
              <div className="relative">
                <MapPin className="absolute right-3 top-1/2 transform -translate-y-1/2 text-secondary-400" />
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                  className="input-field pr-10"
                  placeholder="أدخل موقع الخدمة"
                />
              </div>
            </div>
          </motion.div>
          
          {/* Category Selection */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-4"
          >
            <div>
              <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                الفئة
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  category: e.target.value,
                  subcategory: '' // Reset subcategory when category changes
                }))}
                className="input-field"
              >
                <option value="">اختر الفئة</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            
            {formData.category && (
              <div>
                <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                  الفئة الفرعية
                </label>
                <select
                  value={formData.subcategory}
                  onChange={(e) => setFormData(prev => ({ ...prev, subcategory: e.target.value }))}
                  className="input-field"
                >
                  <option value="">اختر الفئة الفرعية</option>
                  {getSubcategoriesByParent(formData.category).map(subcategory => (
                    <option key={subcategory.id} value={subcategory.id}>
                      {subcategory.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </motion.div>
          
          {/* Features */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-4"
          >
            <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300">
              مميزات الخدمة
            </label>
            
            <div className="flex space-x-2 rtl:space-x-reverse">
              <input
                type="text"
                value={newFeature}
                onChange={(e) => setNewFeature(e.target.value)}
                className="input-field flex-1"
                placeholder="أضف ميزة جديدة"
              />
              <button
                type="button"
                onClick={handleAddFeature}
                className="btn-primary px-4"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-2">
              {formData.features.map((feature, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-secondary-50 dark:bg-secondary-800 rounded-lg"
                >
                  <span className="dark:text-white">{feature}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveFeature(index)}
                    className="text-red-500 hover:text-red-600"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          </motion.div>
          
          {/* Delivery Options */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <DeliveryOptionsForm
              onSave={options => setDeliveryOptions(options)}
              initialValues={deliveryOptions}
            />
          </motion.div>
          
          {/* Submit Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="fixed bottom-0 left-0 right-0 p-4 bg-white dark:bg-secondary-900 border-t border-secondary-100 dark:border-secondary-800"
          >
            <button
              type="submit"
              className="btn-primary w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin ml-2"></div>
                  <span>جاري الحفظ...</span>
                </div>
              ) : (
                'حفظ التغييرات'
              )}
            </button>
          </motion.div>
        </form>
      </div>
    </>
  );
};

export default EditService;