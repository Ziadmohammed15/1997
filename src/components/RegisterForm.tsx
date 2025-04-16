import React, { useState } from 'react';
import { User, Mail, Lock, Phone, Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';
import phoneVerificationService from '../services/phoneVerificationService'; // تأكد من استيراد الخدمة

interface RegisterFormProps {
  onRegister: (name: string, email: string, phone: string, password: string) => void;
  onSwitchToLogin: () => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onRegister, onSwitchToLogin }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    phone?: string;
    password?: string;
    confirmPassword?: string;
    verificationCode?: string; // إضافة حقل للرمز
  }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [verificationCode, setVerificationCode] = useState(''); // حالة للرمز
  const [verificationSent, setVerificationSent] = useState(false); // حالة لتتبع إرسال الرمز

  const validateForm = () => {
    const newErrors: {
      name?: string;
      email?: string;
      phone?: string;
      password?: string;
      confirmPassword?: string;
      verificationCode?: string; // إضافة حقل للرمز
    } = {};
    
    if (!name) {
      newErrors.name = 'الاسم مطلوب';
    }
    
    if (!email) {
      newErrors.email = 'البريد الإلكتروني مطلوب';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'البريد الإلكتروني غير صحيح';
    }
    
    if (!phone) {
      newErrors.phone = 'رقم الهاتف مطلوب';
    }
    
    if (!password) {
      newErrors.password = 'كلمة المرور مطلوبة';
    } else if (password.length < 6) {
      newErrors.password = 'كلمة المرور يجب أن تكون 6 أحرف على الأقل';
    }
    
    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'كلمات المرور غير متطابقة';
    }

    if (verificationSent && !verificationCode) {
      newErrors.verificationCode = 'رمز التحقق مطلوب';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSendVerification = async () => {
    try {
      await phoneVerificationService.sendVerificationCode(phone);
      setVerificationSent(true);
      setErrors({}); // إعادة تعيين الأخطاء
    } catch (error) {
      setErrors({ phone: 'فشل في إرسال رمز التحقق. حاول مرة أخرى.' });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      // تحقق من الرمز
      const verificationResult = await phoneVerificationService.verifyCode(phone, verificationCode);
      if (verificationResult.verified) {
        // إذا تم التحقق، تابع التسجيل
        onRegister(name, email, phone, password);
      } else {
        setErrors({ verificationCode: 'رمز التحقق غير صحيح.' });
      }
    } catch (error) {
      console.error('Registration error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full"
    >
      <h2 className="text-3xl font-bold mb-6 text-center text-gradient">إنشاء حساب جديد</h2>
      
      <form onSubmit={handleSubmit} className="glass-morphism p-6 rounded-2xl">
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
            الاسم الكامل
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <User  className="w-5 h-5 text-secondary-400" />
            </div>
            <input
              type="text"
              id="name"
              className={`input-field pr-10 ${errors.name ? 'border-red-500 focus:ring-red-500' : ''}`}
              placeholder="أدخل اسمك الكامل"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
        </div>
        
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
            البريد الإلكتروني
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <Mail className="w-5 h-5 text-secondary-400" />
            </div>
            <input
              type="email"
              id="email"
              className={`input-field pr-10 ${errors.email ? 'border-red-500 focus:ring-red-500' : ''}`}
              placeholder="أدخل بريدك الإلكتروني"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
        </div>
        
        <div className="mb-4">
          <label htmlFor="phone" className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
            رقم الهاتف
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <Phone className="w-5 h-5 text-secondary-400" />
            </div>
            <input
              type="text"
              id="phone"
              className={`input-field pr-10 ${errors.phone ? 'border-red-500' : ''}`}
              placeholder="أدخل رقم الهاتف"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
          {errors.phone && <p className="mt-1 text-sm text-red-500">{errors.phone}</p>}
        </div>

        {verificationSent && (
          <div className="mb-4">
            <label htmlFor="verificationCode" className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
              رمز التحقق
            </label>
            <div className="relative">
              <input
                type="text"
                id="verificationCode"
                className={`input-field ${errors.verificationCode ? 'border-red-500' : ''}`}
                placeholder="أدخل رمز التحقق"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
              />
            </div>
            {errors.verificationCode && <p className="mt-1 text-sm text-red-500">{errors.verificationCode}</p>}
            <button
              type="button"
              onClick={handleSendVerification}
              className="btn-modern mt-2"
            >
              إرسال رمز التحقق
            </button>
          </div>
        )}
        
        <div className="mb-4">
          <label htmlFor="password" className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
            كلمة المرور
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <Lock className="w-5 h-5 text-secondary-400" />
            </div>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              className={`input-field pr-10 ${errors.password ? 'border-red-500 focus:ring-red-500' : ''}`}
              placeholder="أدخل كلمة المرور"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              className="absolute inset-y-0 left-0 flex items-center pl-3"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5 text-secondary-400" />
              ) : (
                <Eye className="w-5 h-5 text-secondary-400" />
              )}
            </button>
          </div>
          {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password}</p>}
        </div>
        
        <div className="mb-6">
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
            تأكيد كلمة المرور
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <Lock className="w-5 h-5 text-secondary-400" />
            </div>
            <input
              type={showPassword ? "text" : "password"}
              id="confirmPassword"
              className={`input-field pr-10 ${errors.confirmPassword ? 'border-red-500 focus:ring-red-500' : ''}`}
              placeholder="أعد إدخال كلمة المرور"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
          {errors.confirmPassword && <p className="mt-1 text-sm text-red-500">{errors.confirmPassword}</p>}
        </div>
        
        <button
          type="submit"
          className="btn-modern w-full mb-4"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <div className="flex items-center justify-center">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin ml-2"></div>
              <span>جاري إنشاء الحساب...</span>
            </div>
          ) : (
            'إنشاء حساب'
          )}
        </button>
        
        <p className="text-center text-secondary-600 dark:text-secondary-300">
          لديك حساب بالفعل؟{' '}
          <button
            type="button"
            onClick={onSwitchToLogin}
            className="text-primary-600 dark:text-primary-400 font-medium hover:text-primary-700 dark:hover:text-primary-300 transition-colors"
          >
            تسجيل الدخول
          </button>
        </p>
      </form>
    </motion.div>
  );
};

export default RegisterForm;