import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { motion } from 'framer-motion';
import { useToast } from '../context/ToastContext';
import { Camera, Plus, Tag, MapPin, DollarSign, FileText, Save, ChevronDown } from 'lucide-react';
import { categories, getSubcategoriesByParent } from '../data/categories';
import DeliveryOptionsForm from '../components/DeliveryOptionsForm';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../services/supabaseClient';

// قائمة المحافظات السعودية
const saudiCities = [
  "الرياض",
  "جدة",
  "مكة المكرمة",
  "المدينة المنورة",
  "الدمام",
  "الخبر",
  "الطائف",
  "تبوك",
  "بريدة",
  "خميس مشيط",
  "حائل",
  "الجبيل",
  "أبها",
  "نجران",
  "ينبع",
  "القنفذة",
  "الظهران",
  "سكاكا",
  "عرعر",
  "رفحاء",
  "ضباء",
  "الباحة",
  "الزلفي",
  "الدوادمي",
  "وادي الدواسر",
  "بيشة",
  "النماص",
  "بلجرشي",
  "شرورة",
  "الحوية"
];

const AddService = () => {
  const navigate = useNavigate();
  const { showSuccess, showError } = useToast();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [showCitiesModal, setShowCitiesModal] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
    subcategory: '',
    location: '',
    features: [] as string[],
    image: null as File | null
  });
  
  const [newFeature, setNewFeature] = useState('');
  const [deliveryOptions, setDeliveryOptions] = useState({
    type: 'none' as 'free' | 'paid' | 'none' | 'company',
    price: 0,
    companyName: '',
    areas: [] as string[],
    estimatedTime: ''
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        showError('حجم الصورة يجب أن لا يتجاوز 5 ميجابايت');
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      
      setImageFile(file);
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

  const validateForm = () => {
    if (!formData.title) {
      showError('عنوان الخدمة مطلوب');
      return false;
    }
    
    if (!formData.description) {
      showError('وصف الخدمة مطلوب');
      return false;
    }
    
    if (!formData.price || isNaN(Number(formData.price))) {
      showError('السعر مطلوب ويجب أن يكون رقماً');
      return false;
    }
    
    if (!formData.category) {
      showError('الفئة مطلوبة');
      return false;
    }
    
    if (!formData.location) {
      showError('الموقع مطلوب');
      return false;
    }
    
    if (!imageFile && !imagePreview) {
      showError('صورة الخدمة مطلوبة');
      return false;
    }

    return true;
  };

  const handlePublish = async () => {
    if (!validateForm()) return;
    if (!user) {
      showError('يجب تسجيل الدخول أولاً');
      return;
    }

    setIsSubmitting(true);

    try {
      let imageUrl = '';
      
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${Date.now()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('services')
          .upload(fileName, imageFile);
          
        if (uploadError) throw uploadError;
        
        const { data: { publicUrl } } = supabase.storage
          .from('services')
          .getPublicUrl(fileName);
          
        imageUrl = publicUrl;
      }

      const { data: service, error: serviceError } = await supabase
        .from('services')
        .insert({
          title: formData.title,
          description: formData.description,
          price: Number(formData.price),
          category: formData.category,
          subcategory: formData.subcategory || null,
          location: formData.location,
          image_url: imageUrl,
          provider_id: user.id,
          status: 'active'
        })
        .select()
        .single();

      if (serviceError) throw serviceError;

      if (formData.features.length > 0) {
        const { error: featuresError } = await supabase
          .from('service_features')
          .insert(
            formData.features.map(feature => ({
              service_id: service.id,
              feature
            }))
          );

        if (featuresError) throw featuresError;
      }

      if (deliveryOptions.type !== 'none') {
        const { error: deliveryError } = await supabase
          .from('delivery_options')
          .insert({
            service_id: service.id,
            type: deliveryOptions.type,
            price: deliveryOptions.type === 'paid' ? deliveryOptions.price : null,
            company_name: deliveryOptions.type === 'company' ? deliveryOptions.companyName : null,
            estimated_time: deliveryOptions.estimatedTime
          });

        if (deliveryError) throw deliveryError;

        if (deliveryOptions.areas.length > 0) {
          const { error: areasError } = await supabase
            .from('service_areas')
            .insert(
              deliveryOptions.areas.map(area => ({
                service_id: service.id,
                area_name: area
              }))
            );

          if (areasError) throw areasError;
        }
      }

      showSuccess('تم نشر الخدمة بنجاح');
      navigate('/provider/my-services');
    } catch (error) {
      console.error('Error publishing service:', error);
      showError('حدث خطأ أثناء نشر الخدمة');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCitySelect = (city: string) => {
    setFormData(prev => ({ ...prev, location: city }));
    setShowCitiesModal(false);
  };

  return (
    <>
      <Header title="إضافة خدمة جديدة" showBack={true} />
      
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="sticky top-[57px] z-50 bg-white dark:bg-secondary-900 border-b border-secondary-100 dark:border-secondary-800 p-4"
      >
        <button
          onClick={handlePublish}
          disabled={isSubmitting}
          className="btn-primary w-full flex items-center justify-center"
        >
          {isSubmitting ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin ml-2"></div>
              <span>جاري الحفظ...</span>
            </>
          ) : (
            <>
              <Save className="w-5 h-5 ml-2" />
              <span>حفظ الخدمة</span>
            </>
          )}
        </button>
      </motion.div>

      <div className="page-container">
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
            className="block w-full h-48 rounded-xl overflow-hidden cursor-pointer relative group"
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
              <div className="h-full flex flex-col items-center justify-center bg-secondary-100 dark:bg-secondary-800 text-secondary-400">
                <Camera className="w-8 h-8 mb-2" />
                <span>اختر صورة للخدمة</span>
                <span className="text-xs mt-1">PNG, JPG حتى 5 ميجابايت</span>
              </div>
            )}
          </label>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-4 mt-6"
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
                onClick={() => setShowCitiesModal(true)}
                onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                className="input-field pr-10 cursor-pointer"
                placeholder="اختر موقع الخدمة"
                readOnly
              />
              <ChevronDown className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-400" />
            </div>
          </div>
        </motion.div>
        
        {/* نافذة المحافظات المنبثقة */}
        {showCitiesModal && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white dark:bg-secondary-900 rounded-xl w-full max-w-md max-h-[80vh] overflow-y-auto"
            >
              <div className="p-4 border-b border-secondary-200 dark:border-secondary-700 sticky top-0 bg-white dark:bg-secondary-900 z-10">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-bold text-black dark:text-white">اختر المحافظة</h3>
                  <button 
                    onClick={() => setShowCitiesModal(false)}
                    className="text-secondary-500 hover:text-secondary-700 dark:hover:text-secondary-300"
                  >
                    ×
                  </button>
                </div>
                <div className="relative mt-3">
                  <input
                    type="text"
                    placeholder="ابحث عن محافظة..."
                    className="input-field w-full"
                  />
                </div>
              </div>
              
              <div className="p-2">
                {saudiCities.map((city, index) => (
                  <button
                    key={index}
                    onClick={() => handleCitySelect(city)}
                    className={`w-full text-right p-3 rounded-lg mb-1 hover:bg-secondary-100 dark:hover:bg-secondary-800 ${
                      formData.location === city 
                        ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 font-medium' 
                        : 'text-black dark:text-white'
                    }`}
                  >
                    {city}
                  </button>
                ))}
              </div>
            </motion.div>
          </div>
        )}
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-4 mt-6"
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
                subcategory: ''
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
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-4 mt-6"
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
            <motion.button
              type="button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleAddFeature}
              className="btn-primary px-4"
            >
              <Plus className="w-5 h-5" />
            </motion.button>
          </div>
          
          <div className="space-y-2">
            {formData.features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center justify-between p-3 bg-secondary-50 dark:bg-secondary-800 rounded-lg"
              >
                <span className="dark:text-white">{feature}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveFeature(index)}
                  className="text-red-500 hover:text-red-600"
                >
                  ×
                </button>
              </motion.div>
            ))}
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-6"
        >
          <DeliveryOptionsForm
            onSave={options => setDeliveryOptions(options)}
            initialValues={deliveryOptions}
          />
        </motion.div>
      </div>
    </>
  );
};

export default AddService;