import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';

interface LoginFormProps {
  onLogin: (email: string, password: string) => void;
  onSwitchToRegister: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLogin, onSwitchToRegister }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{email?: string; password?: string}>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors: {email?: string; password?: string} = {};
    
    if (!email) {
      newErrors.email = 'البريد الإلكتروني مطلوب';
    }
    
    if (!password) {
      newErrors.password = 'كلمة المرور مطلوبة';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      onLogin(email, password);
    } catch (error) {
      console.error('Login error:', error);
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
      <h2 className="text-3xl font-bold mb-6 text-center text-gradient">تسجيل الدخول</h2>
      
      <form onSubmit={handleSubmit} className="glass-morphism p-6 rounded-2xl">
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
              disabled={isSubmitting}
            />
          </div>
          {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
        </div>
        
        <div className="mb-6">
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
              disabled={isSubmitting}
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
            onClick={onSwitchToRegister}
            className="text-primary-600 dark:text-primary-400 font-medium hover:text-primary-700 dark:hover:text-primary-300 transition-colors"
          >
            إنشاء حساب
          </button>
        </p>
      </form>
    </motion.div>
  );
};

export default LoginForm;