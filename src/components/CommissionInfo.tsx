import React from 'react';
import { Info } from 'lucide-react';
import { motion } from 'framer-motion';

interface CommissionInfoProps {
  price?: number;
  commission?: number;
  showDetailed?: boolean;
}

const CommissionInfo: React.FC<CommissionInfoProps> = ({ price, commission, showDetailed = false }) => {
  const commissionRate = 0.05; // 5%
  const commissionAmount = price ? price * commissionRate : commission || 0;
  const totalPrice = price ? price + commissionAmount : 0;
  
  if (showDetailed) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-4 p-4 backdrop-blur-glass bg-secondary-50/80 dark:bg-secondary-800/80 rounded-xl border border-secondary-100/50 dark:border-secondary-700/30"
      >
        <div className="flex items-start">
          <Info className="w-5 h-5 text-primary-500 mt-0.5 ml-2 flex-shrink-0" />
          <div>
            <h4 className="font-medium text-secondary-900 dark:text-white mb-2">تفاصيل السعر</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-secondary-600 dark:text-secondary-300">سعر الخدمة</span>
                <span className="font-medium dark:text-white">{price?.toFixed(2) || '0.00'} ريال</span>
              </div>
              <div className="flex justify-between">
                <span className="text-secondary-600 dark:text-secondary-300">عمولة المنصة (5%)</span>
                <span className="font-medium dark:text-white">{commissionAmount.toFixed(2)} ريال</span>
              </div>
              <div className="pt-2 border-t border-secondary-200 dark:border-secondary-700 flex justify-between">
                <span className="font-medium text-secondary-900 dark:text-white">المجموع</span>
                <span className="font-bold text-primary-600 dark:text-primary-400">{totalPrice.toFixed(2)} ريال</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }
  
  return (
    <div className="mt-2 flex items-center text-xs text-secondary-500 dark:text-secondary-400">
      <Info className="w-3 h-3 ml-1" />
      <span>السعر يشمل عمولة المنصة (5%)</span>
    </div>
  );
};

export default CommissionInfo;