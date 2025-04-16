import React, { useState } from 'react';
import { Truck, Clock, MapPin, Package, DollarSign, Info } from 'lucide-react';
import { motion } from 'framer-motion';

interface DeliveryOptionsFormProps {
  onSave: (options: {
    type: 'free' | 'paid' | 'none' | 'company';
    price?: number;
    companyName?: string;
    areas: string[];
    estimatedTime: string;
  }) => void;
  initialValues?: {
    type: 'free' | 'paid' | 'none' | 'company';
    price?: number;
    companyName?: string;
    areas: string[];
    estimatedTime: string;
  };
}

const DeliveryOptionsForm: React.FC<DeliveryOptionsFormProps> = ({
  onSave,
  initialValues = {
    type: 'none',
    areas: [],
    estimatedTime: ''
  }
}) => {
  const [deliveryType, setDeliveryType] = useState<'free' | 'paid' | 'none' | 'company'>(initialValues.type);
  const [price, setPrice] = useState(initialValues.price?.toString() || '');
  const [companyName, setCompanyName] = useState(initialValues.companyName || '');
  const [areas, setAreas] = useState<string[]>(initialValues.areas);
  const [estimatedTime, setEstimatedTime] = useState(initialValues.estimatedTime);
  const [newArea, setNewArea] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      type: deliveryType,
      price: price ? Number(price) : undefined,
      companyName: deliveryType === 'company' ? companyName : undefined,
      areas,
      estimatedTime
    });
  };
  
  const handleAddArea = () => {
    if (newArea.trim() && !areas.includes(newArea.trim())) {
      setAreas([...areas, newArea.trim()]);
      setNewArea('');
    }
  };
  
  const handleRemoveArea = (area: string) => {
    setAreas(areas.filter(a => a !== area));
  };
  
  const deliveryCompanies = [
    'أرامكس',
    'سمسا',
    'زاجل',
    'DHL',
    'فيديكس',
    'UPS'
  ];

  return (
    <div className="card-glass p-4">
      <div className="flex items-center mb-4">
        <Truck className="w-5 h-5 text-primary-500 ml-2" />
        <span className="font-medium dark:text-white">خيارات التوصيل</span>
      </div>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
            نوع التوصيل
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setDeliveryType('free')}
              className={`p-3 rounded-xl text-center transition-all ${
                deliveryType === 'free'
                  ? 'bg-primary-500 text-white'
                  : 'bg-secondary-100 dark:bg-secondary-800 text-secondary-700 dark:text-secondary-300'
              }`}
            >
              <DollarSign className="w-5 h-5 mx-auto mb-1" />
              توصيل مجاني
            </button>
            
            <button
              type="button"
              onClick={() => setDeliveryType('paid')}
              className={`p-3 rounded-xl text-center transition-all ${
                deliveryType === 'paid'
                  ? 'bg-primary-500 text-white'
                  : 'bg-secondary-100 dark:bg-secondary-800 text-secondary-700 dark:text-secondary-300'
              }`}
            >
              <Package className="w-5 h-5 mx-auto mb-1" />
              توصيل مدفوع
            </button>
            
            <button
              type="button"
              onClick={() => setDeliveryType('company')}
              className={`p-3 rounded-xl text-center transition-all ${
                deliveryType === 'company'
                  ? 'bg-primary-500 text-white'
                  : 'bg-secondary-100 dark:bg-secondary-800 text-secondary-700 dark:text-secondary-300'
              }`}
            >
              <Truck className="w-5 h-5 mx-auto mb-1" />
              شركة توصيل
            </button>
            
            <button
              type="button"
              onClick={() => setDeliveryType('none')}
              className={`p-3 rounded-xl text-center transition-all ${
                deliveryType === 'none'
                  ? 'bg-primary-500 text-white'
                  : 'bg-secondary-100 dark:bg-secondary-800 text-secondary-700 dark:text-secondary-300'
              }`}
            >
              <Info className="w-5 h-5 mx-auto mb-1" />
              بدون توصيل
            </button>
          </div>
        </div>
        
        {deliveryType !== 'none' && (
          <>
            {deliveryType === 'paid' && (
              <div>
                <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                  سعر التوصيل
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="أدخل سعر التوصيل"
                    className="input-field pl-16"
                  />
                  <div className="absolute left-0 top-0 bottom-0 flex items-center px-3 border-r border-secondary-200 dark:border-secondary-700">
                    <span className="text-secondary-500 dark:text-secondary-400">ريال</span>
                  </div>
                </div>
              </div>
            )}
            
            {deliveryType === 'company' && (
              <div>
                <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                  شركة التوصيل
                </label>
                <select
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="input-field"
                >
                  <option value="">اختر شركة التوصيل</option>
                  {deliveryCompanies.map((company) => (
                    <option key={company} value={company}>{company}</option>
                  ))}
                </select>
              </div>
            )}
            
            <div>
              <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                مناطق التغطية
              </label>
              <div className="flex space-x-2 rtl:space-x-reverse mb-2">
                <input
                  type="text"
                  value={newArea}
                  onChange={(e) => setNewArea(e.target.value)}
                  placeholder="أدخل منطقة التغطية"
                  className="input-field flex-1"
                />
                <button
                  type="button"
                  onClick={handleAddArea}
                  className="px-4 py-2 bg-primary-500 text-white rounded-xl"
                >
                  إضافة
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {areas.map((area) => (
                  <div
                    key={area}
                    className="bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 px-3 py-1 rounded-full flex items-center"
                  >
                    <span>{area}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveArea(area)}
                      className="mr-2 hover:text-primary-700 dark:hover:text-primary-300"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                الوقت المتوقع للتوصيل
              </label>
              <input
                type="text"
                value={estimatedTime}
                onChange={(e) => setEstimatedTime(e.target.value)}
                placeholder="مثال: 2-3 ساعات"
                className="input-field"
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default DeliveryOptionsForm;