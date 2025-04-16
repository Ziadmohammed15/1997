import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Header from '../components/Header';
import PhoneInput from '../components/PhoneInput';
import PhoneVerification from '../components/PhoneVerification';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

const PhoneVerificationPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, phoneVerified } = useAuth();
  const [phoneNumber, setPhoneNumber] = useState(location.state?.phone || '');
  const [showVerification, setShowVerification] = useState(!!location.state?.phone);
  const [verificationComplete, setVerificationComplete] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check if user is already verified
  useEffect(() => {
    if (phoneVerified) {
      navigate('/user-type');
    }
  }, [phoneVerified, navigate]);

  if (!user) {
    navigate('/auth');
    return null;
  }

  const handlePhoneSubmit = async (phone: string) => {
    setPhoneNumber(phone);
    setShowVerification(true);
  };
  
  const handleVerified = () => {
    setVerificationComplete(true);
    
    // Redirect after a short delay
    setTimeout(() => {
      navigate('/user-type');
    }, 1500);
  };
  
  const handleCancel = () => {
    navigate('/auth');
  };
  
  const handleChangePhone = () => {
    setShowVerification(false);
  };

  return (
    <>
      <Header title="التحقق من رقم الهاتف" showBack={true} />
      
      <div className="page-container">
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-100 dark:border-red-800/30 flex items-center"
          >
            <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
          </motion.div>
        )}
        
        {verificationComplete ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-morphism p-6 rounded-2xl max-w-md mx-auto text-center"
          >
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
            <h2 className="text-xl font-bold mb-2 dark:text-white">تم التحقق بنجاح</h2>
            <p className="text-secondary-600 dark:text-secondary-300 mb-6">
              تم التحقق من رقم هاتفك بنجاح. جاري تحويلك...
            </p>
            <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          </motion.div>
        ) : showVerification ? (
          <PhoneVerification
            phoneNumber={phoneNumber}
            onVerified={handleVerified}
            onCancel={handleCancel}
            onChangePhone={handleChangePhone}
          />
        ) : (
          <PhoneInput
            initialPhoneNumber={phoneNumber}
            onSubmit={handlePhoneSubmit}
            onCancel={handleCancel}
          />
        )}
      </div>
    </>
  );
};

export default PhoneVerificationPage;