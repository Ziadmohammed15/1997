import React, { useState } from 'react';
import { Phone, AlertCircle, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

interface PhoneInputProps {
  initialPhoneNumber?: string;
  onSubmit: (phoneNumber: string) => void;
  onCancel?: () => void;
}

const PhoneInput: React.FC<PhoneInputProps> = ({
  initialPhoneNumber = '',
  onSubmit,
  onCancel
}) => {
  const { user } = useAuth();
  const [phoneNumber, setPhoneNumber] = useState(initialPhoneNumber);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Handle phone number change
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    // Only allow numbers and plus sign at the beginning
    if (!/^[+\d]*$/.test(value)) return;
    
    setPhoneNumber(value);
    
    // Clear error when user types
    if (error) setError(null);
  };
  
  // Validate phone number
  const validatePhoneNumber = (number: string): boolean => {
    // Basic validation for international phone numbers
    // Should start with + followed by country code and number
    // Total length should be between 8 and 15 digits
    return /^(\+)?[\d]{8,15}$/.test(number);
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      setError('يجب تسجيل الدخول أولاً');
      return;
    }
    
    // Validate phone number
    if (!validatePhoneNumber(phoneNumber)) {
      setError('يرجى إدخال رقم هاتف دولي صحيح');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Format phone number to E.164 format if needed
      let formattedPhoneNumber = phoneNumber;
      if (!phoneNumber.startsWith('+')) {
        formattedPhoneNumber = `+${phoneNumber}`;
      }
      
      // In a real app, we'll proceed to the next step
      onSubmit(formattedPhoneNumber);
    } catch (err) {
      setError('حدث خطأ أثناء معالجة رقم الهاتف، يرجى المحاولة مرة أخرى');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="glass-morphism p-6 rounded-2xl max-w-md mx-auto"
    >
      <div className="flex items-center justify-between mb-6">
        {onCancel && (
          <button
            onClick={onCancel}
            className="p-2 -mr-2 rounded-full hover:bg-secondary-100/70 dark:hover:bg-secondary-800/70 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-secondary-700 dark:text-secondary-300" />
          </button>
        )}
        <h2 className="text-xl font-bold text-center flex-1 dark:text-white">التحقق من رقم الهاتف</h2>
        <div className="w-9"></div> {/* Spacer for centering */}
      </div>
      
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
          <Phone className="w-8 h-8 text-primary-600 dark:text-primary-400" />
        </div>
        <p className="text-secondary-600 dark:text-secondary-300">
          سنرسل لك رمز تحقق عبر رسالة نصية للتأكد من رقم هاتفك
        </p>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <label htmlFor="phone" className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
            رقم الهاتف الدولي
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <Phone className="w-5 h-5 text-secondary-400" />
            </div>
            <input
              type="tel"
              id="phone"
              dir="ltr"
              className={`input-glass pr-10 text-left ${error ? 'border-red-500 focus:ring-red-500' : ''}`}
              placeholder="+966*********"
              value={phoneNumber}
              onChange={handlePhoneChange}
              disabled={isSubmitting}
            />
          </div>
          
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center mt-2 text-red-500 text-sm"
            >
              <AlertCircle className="w-4 h-4 ml-1" />
              <span>{error}</span>
            </motion.div>
          )}
          
          <p className="mt-2 text-xs text-secondary-500 dark:text-secondary-400">
            أدخل رقم هاتفك الدولي مع رمز الدولة (مثال: +966 للسعودية)
          </p>
        </div>
        
        <div className="flex space-x-3 rtl:space-x-reverse">
          {onCancel && (
            <motion.button
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onCancel}
              className="btn-glass flex-1"
              disabled={isSubmitting}
            >
              إلغاء
            </motion.button>
          )}
          
          <motion.button
            type="submit"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="btn-modern flex-1"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                جاري الإرسال...
              </>
            ) : (
              'إرسال رمز التحقق'
            )}
          </motion.button>
        </div>
      </form>
    </motion.div>
  );
};

export default PhoneInput;