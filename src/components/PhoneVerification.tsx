import React, { useState, useEffect, useRef } from 'react';
import { Phone, Check, AlertCircle, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

interface PhoneVerificationProps {
  phoneNumber: string;
  onVerified: () => void;
  onCancel: () => void;
  onChangePhone: () => void;
}

const PhoneVerification: React.FC<PhoneVerificationProps> = ({
  phoneNumber,
  onVerified,
  onCancel,
  onChangePhone
}) => {
  const { user, verifyPhoneCode, sendPhoneVerification } = useAuth();
  const [phoneValid, setPhoneValid] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(60);
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  // Initialize input refs
  useEffect(() => {
    inputRefs.current = Array(6).fill(null);
  }, []);

  // Timer for resend code
  useEffect(() => {
    if (!verificationSent || timeLeft <= 0) return;
    
    const timer = setTimeout(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [timeLeft, verificationSent]);

 const handleSendCode = async () => {
  if (!validatePhoneNumber(phoneNumber)) {
    setError('رقم الهاتف غير صالح');
    return;
  }

  setError(null);
  setIsSending(true);
  
  try {
    const { success, error } = await sendPhoneVerification(phoneNumber);
    
    if (success) {
      setVerificationSent(true);
      setTimeLeft(60);
      setTimeout(() => inputRefs.current[0]?.focus(), 100);
    } else {
      setError(error || 'Failed to send verification code');
    }
  } catch (err) {
    setError('حدث خطأ أثناء إرسال رمز التحقق');
  } finally {
    setIsSending(false);
  }
};

// أضف دالة التحقق من رقم الهاتف:
const validatePhoneNumber = (phone: string) => {
  const phoneUtil = require('libphonenumber-js');
  const phoneNumber = phoneUtil.parsePhoneNumber(phone);
  return phoneNumber?.isValid();
};

  const handleVerifyCode = async () => {
    if (!user) {
      setError('يجب تسجيل الدخول أولاً');
      return;
    }

    if (verificationCode.length !== 6) {
      setError('يرجى إدخال رمز التحقق المكون من 6 أرقام');
      return;
    }
    
    setError(null);
    setIsVerifying(true);
    
    try {
      const { success, error } = await verifyPhoneCode(phoneNumber, verificationCode);
      
      if (success) {
        // Call onVerified callback immediately when verification is successful
        onVerified();
      } else {
        setError(error || 'رمز التحقق غير صحيح');
      }
    } catch (err) {
      setError('حدث خطأ أثناء التحقق من الرمز');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendCode = () => {
    setVerificationCode('');
    setTimeLeft(60);
    handleSendCode();
  };

  const handleInputChange = (index: number, value: string) => {
    if (value.length > 1) {
      // Handle paste event
      const pastedValue = value.slice(0, 6);
      setVerificationCode(pastedValue.padEnd(6, ''));
      
      // Fill the inputs with pasted value
      for (let i = 0; i < pastedValue.length; i++) {
        if (i < inputRefs.current.length && inputRefs.current[i]) {
          inputRefs.current[i].value = pastedValue[i];
        }
      }
      
      // Focus the appropriate input
      const nextIndex = Math.min(pastedValue.length, 5);
      if (nextIndex < inputRefs.current.length && inputRefs.current[nextIndex]) {
        inputRefs.current[nextIndex].focus();
      }
      return;
    }
    
    // Handle normal input
    if (/^\d?$/.test(value)) {
      const newCode = verificationCode.split('');
      newCode[index] = value;
      const newVerificationCode = newCode.join('');
      setVerificationCode(newVerificationCode);
      
      // Auto-focus next input
      if (value && index < 5 && inputRefs.current[index + 1]) {
        inputRefs.current[index + 1].focus();
      }
      
      // Auto-verify when all digits are entered
      if (newVerificationCode.length === 6) {
        handleVerifyCode();
      }
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !verificationCode[index] && index > 0 && inputRefs.current[index - 1]) {
      inputRefs.current[index - 1].focus();
    }
  };

  // Auto-send verification code on component mount
  useEffect(() => {
    handleSendCode();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="glass-morphism p-6 rounded-2xl"
    >
      <div className="flex items-center justify-center mb-6">
        <div className="w-16 h-16 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
          <Phone className="w-8 h-8 text-primary-600 dark:text-primary-400" />
        </div>
      </div>
      
      <h2 className="text-xl font-bold mb-2 text-center dark:text-white">التحقق من رقم الهاتف</h2>
      
      <p className="text-secondary-600 dark:text-secondary-300 text-center mb-6">
        تم إرسال رمز التحقق إلى {phoneNumber}
      </p>
      
      <div className="mb-6">
        <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2 text-center">
          أدخل رمز التحقق
        </label>
        <div className="flex justify-center space-x-2 rtl:space-x-reverse">
          {[0, 1, 2, 3, 4, 5].map((index) => (
            <input
              key={index}
              ref={(el) => {
                inputRefs.current[index] = el;
              }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={verificationCode[index] || ''}
              onChange={(e) => handleInputChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className="w-10 h-12 text-center text-lg font-bold bg-white dark:bg-secondary-800 border border-secondary-200 dark:border-secondary-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 text-secondary-900 dark:text-white"
            />
          ))}
        </div>
      </div>
      
      {error && (
        <div className="mb-6 p-3 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-100 dark:border-red-800/30 flex items-center">
          <AlertCircle className="w-5 h-5 text-red-500 dark:text-red-400 ml-2 flex-shrink-0" />
          <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
        </div>
      )}
      
      <div className="text-center mb-6">
        <p className="text-secondary-600 dark:text-secondary-300 text-sm mb-2">
          لم يصلك الرمز؟
        </p>
        {timeLeft > 0 ? (
          <p className="text-primary-600 dark:text-primary-400 text-sm">
            يمكنك إعادة الإرسال بعد {timeLeft} ثانية
          </p>
        ) : (
          <button
            onClick={handleResendCode}
            disabled={isSending}
            className="text-primary-600 dark:text-primary-400 text-sm font-medium"
          >
            {isSending ? 'جاري إعادة الإرسال...' : 'إعادة إرسال الرمز'}
          </button>
        )}
      </div>
      
      <div className="flex space-x-3 rtl:space-x-reverse">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onChangePhone}
          className="flex-1 flex items-center justify-center py-3 px-4 rounded-xl bg-secondary-100 dark:bg-secondary-800 text-secondary-700 dark:text-secondary-300 font-medium"
        >
          <ArrowRight className="w-5 h-5 ml-1" />
          تغيير الرقم
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleVerifyCode}
          disabled={isVerifying || verificationCode.length !== 6}
          className={`flex-1 py-3 px-4 rounded-xl bg-primary-500 text-white font-medium shadow-button flex items-center justify-center ${
            isVerifying || verificationCode.length !== 6 ? 'opacity-70' : ''
          }`}
        >
          {isVerifying ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin ml-2"></div>
              جاري التحقق...
            </>
          ) : (
            <>
              <Check className="w-5 h-5 ml-1" />
              تأكيد
            </>
          )}
        </motion.button>
      </div>
    </motion.div>
  );
};

export default PhoneVerification;