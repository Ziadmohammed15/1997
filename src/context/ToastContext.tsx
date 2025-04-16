import React, { createContext, useContext } from 'react';
import { Toaster, toast } from 'react-hot-toast';

interface ToastContextType {
  showSuccess: (message: string) => void;
  showError: (message: string) => void;
  showInfo: (message: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const showSuccess = (message: string) => {
    toast.success(message, {
      style: {
        background: '#10B981',
        color: '#fff',
        direction: 'rtl'
      },
      duration: 3000
    });
  };

  const showError = (message: string) => {
    toast.error(message, {
      style: {
        background: '#EF4444',
        color: '#fff',
        direction: 'rtl'
      },
      duration: 4000
    });
  };

  const showInfo = (message: string) => {
    toast(message, {
      icon: 'ℹ️',
      style: {
        direction: 'rtl'
      },
      duration: 3000
    });
  };

  return (
    <ToastContext.Provider value={{ showSuccess, showError, showInfo }}>
      {children}
      <Toaster position="top-center" reverseOrder={false} />
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};