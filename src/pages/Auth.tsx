import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, Lock, Eye, EyeOff, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

// E.164 format validation regex
const PHONE_REGEX = /^\+[1-9]\d{1,14}$/;

const Auth = () => {
  const navigate = useNavigate();
  const { signInWithPhone, signUp } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Login state
  const [loginPhone, setLoginPhone] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  
  // Register state
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Validate phone number format
  const validatePhoneNumber = (phoneNumber: string): boolean => {
    return PHONE_REGEX.test(phoneNumber);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    // Format phone number if needed
    let formattedPhone = loginPhone;
    if (!formattedPhone.startsWith('+')) {
      formattedPhone = `+${formattedPhone}`;
    }
    
    // Validate phone number format
    if (!validatePhoneNumber(formattedPhone)) {
      setError('يجب إدخال رقم الهاتف بالتنسيق الدولي (مثال: +966501234567)');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const { error } = await signInWithPhone(formattedPhone, loginPassword);
      
      if (error) {
        throw error;
      }
      
      // Navigate to phone verification if login successful
      navigate('/verify-phone');
    } catch (error) {
      console.error('Login error:', error);
      setError('فشل تسجيل الدخول. تأكد من صحة رقم الهاتف وكلمة المرور.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    // Validate inputs
    if (!name.trim()) {
      setError('الاسم مطلوب');
      return;
    }
    
    // Format phone number if needed
    let formattedPhone = phone;
    if (!formattedPhone.startsWith('+')) {
      formattedPhone = `+${formattedPhone}`;
    }
    
    // Validate phone number format
    if (!validatePhoneNumber(formattedPhone)) {
      setError('يجب إدخال رقم الهاتف بالتنسيق الدولي (مثال: +966501234567)');
      return;
    }
    
    if (!password) {
      setError('كلمة المرور مطلوبة');
      return;
    }
    
    if (password.length < 6) {
      setError('كلمة المرور يجب أن تكون 6 أحرف على الأقل');
      return;
    }
    
    if (password !== confirmPassword) {
      setError('كلمات المرور غير متطابقة');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const { error, user } = await signUp(formattedPhone, {
        name,
        password,
        phone_verified: false
      });
      
      if (error) {
        throw error;
      }
      
      // Navigate to phone verification
      navigate('/verify-phone', { state: { phone: formattedPhone } });
    } catch (error) {
      console.error('Registration error:', error);
      setError('فشل إنشاء الحساب. قد يكون رقم الهاتف مستخدم بالفعل.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle phone number input change with live validation
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>, isLogin: boolean) => {
    const value = e.target.value;
    
    // Only allow digits, plus sign, and empty string
    if (!/^[0-9+]*$/.test(value)) {
      return;
    }
    
    if (isLogin) {
      setLoginPhone(value);
    } else {
      setPhone(value);
    }
  };

  return (
    <div className="app-container flex flex-col bg-dots bg-noise">
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <motion.div 
            className="w-32 h-32 mx-auto mb-4"
            whileHover={{ scale: 1.1, rotate: 5 }}
          >
            <img 
              src="https://l.top4top.io/p_3343oc4gu1.png" 
              alt="أجار" 
              className="w-full h-full object-contain"
            />
          </motion.div>
        </motion.div>
        
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-md mb-4 p-3 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-800/30 text-red-600 dark:text-red-400 text-center"
          >
            {error}
          </motion.div>
        )}
        
        <AnimatePresence mode="wait">
          {isLogin ? (
            <motion.div
              key="login"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="w-full max-w-md"
            >
              <h2 className="text-3xl font-bold mb-6 text-center text-gradient">تسجيل الدخول</h2>
              
              <form onSubmit={handleLogin} className="glass-morphism p-6 rounded-2xl">
                <div className="mb-4">
                  <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                    رقم الهاتف الدولي
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <Phone className="w-5 h-5 text-secondary-400" />
                    </div>
                    <input
                      type="tel"
                      dir="ltr"
                      className="input-field pr-12 text-left"
                      placeholder="+966*********"
                      value={loginPhone}
                      onChange={(e) => handlePhoneChange(e, true)}
                      required
                    />
                  </div>
                  <p className="mt-1 text-xs text-secondary-500">
                    أدخل رقم هاتفك الدولي مع رمز الدولة (مثال: +966 للسعودية)
                  </p>
                </div>
                
                <div className="mb-6">
                  <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                    كلمة المرور
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <Lock className="w-5 h-5 text-secondary-400" />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      className="input-field pr-12"
                      placeholder="أدخل كلمة المرور"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      required
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
                </div>
                
                <div className="flex justify-end mb-6">
                  <button type="button" className="text-primary-600 dark:text-primary-400 text-sm hover:text-primary-700 dark:hover:text-primary-300 transition-colors">
                    نسيت كلمة المرور؟
                  </button>
                </div>
                
                <button
                  type="submit"
                  className="btn-modern w-full mb-4"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin ml-2"></div>
                      <span>جاري تسجيل الدخول...</span>
                    </div>
                  ) : (
                    'تسجيل الدخول'
                  )}
                </button>
                
                <p className="text-center text-secondary-600 dark:text-secondary-300">
                  ليس لديك حساب؟{' '}
                  <button
                    type="button"
                    onClick={() => setIsLogin(false)}
                    className="text-primary-600 dark:text-primary-400 font-medium hover:text-primary-700 dark:hover:text-primary-300 transition-colors"
                  >
                    إنشاء حساب
                  </button>
                </p>
              </form>
            </motion.div>
          ) : (
            <motion.div
              key="register"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="w-full max-w-md"
            >
              <h2 className="text-3xl font-bold mb-6 text-center text-gradient">إنشاء حساب جديد</h2>
              
              <form onSubmit={handleRegister} className="glass-morphism p-6 rounded-2xl">
                <div className="mb-4">
                  <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                    الاسم الكامل
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <User className="w-5 h-5 text-secondary-400" />
                    </div>
                    <input
                      type="text"
                      className="input-field pr-12"
                      placeholder="أدخل اسمك الكامل"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                    رقم الهاتف الدولي
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <Phone className="w-5 h-5 text-secondary-400" />
                    </div>
                    <input
                      type="tel"
                      dir="ltr"
                      className="input-field pr-12 text-left"
                      placeholder="+966********"
                      value={phone}
                      onChange={(e) => handlePhoneChange(e, false)}
                      required
                    />
                  </div>
                  <p className="mt-1 text-xs text-secondary-500">
                    أدخل رقم هاتفك الدولي مع رمز الدولة (مثال: +966 للسعودية)
                  </p>
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                    كلمة المرور
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <Lock className="w-5 h-5 text-secondary-400" />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      className="input-field pr-12"
                      placeholder="أدخل كلمة المرور"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
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
                </div>
                
                <div className="mb-6">
                  <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                    تأكيد كلمة المرور
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <Lock className="w-5 h-5 text-secondary-400" />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      className="input-field pr-12"
                      placeholder="أعد إدخال كلمة المرور"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                  </div>
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
                    onClick={() => setIsLogin(true)}
                    className="text-primary-600 dark:text-primary-400 font-medium hover:text-primary-700 dark:hover:text-primary-300 transition-colors"
                  >
                    تسجيل الدخول
                  </button>
                </p>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Auth;