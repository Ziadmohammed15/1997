import React from 'react';
import Header from '../components/Header';
import { motion } from 'framer-motion';
import { Shield, Lock, Eye, UserCheck, FileText } from 'lucide-react';

const PrivacyPolicy = () => {
  const sections = [
    {
      icon: Shield,
      title: 'جمع المعلومات',
      content: `نقوم بجمع المعلومات التي تقدمها لنا بشكل مباشر عند:
        • إنشاء حساب
        • إضافة خدمة
        • إجراء حجز
        • التواصل مع الدعم الفني
        
        نحن نجمع فقط المعلومات الضرورية لتقديم خدماتنا بشكل فعال.`
    },
    {
      icon: Lock,
      title: 'حماية البيانات',
      content: `نستخدم تقنيات تشفير متقدمة لحماية بياناتك الشخصية. نحن نتبع أفضل ممارسات الأمان في الصناعة لضمان سرية وأمان معلوماتك.`
    },
    {
      icon: Eye,
      title: 'استخدام المعلومات',
      content: `نستخدم معلوماتك لـ:
        • تقديم وتحسين خدماتنا
        • التواصل معك
        • معالجة المدفوعات
        • تحسين تجربة المستخدم
        
        لن نقوم ببيع أو مشاركة معلوماتك مع أطراف ثالثة دون موافقتك.`
    },
    {
      icon: UserCheck,
      title: 'حقوق المستخدم',
      content: `لديك الحق في:
        • الوصول إلى بياناتك
        • تصحيح معلوماتك
        • حذف حسابك
        • طلب نسخة من بياناتك
        
        يمكنك ممارسة هذه الحقوق من خلال إعدادات حسابك أو التواصل مع فريق الدعم.`
    }
  ];

  return (
    <>
      <Header title="سياسة الخصوصية" showBack={true} />
      
      <div className="page-container">
        {/* Intro */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="w-8 h-8 text-primary-500" />
          </div>
          <h1 className="text-2xl font-bold mb-2 dark:text-white">سياسة الخصوصية</h1>
          <p className="text-secondary-600 dark:text-secondary-300">
            نحن نلتزم بحماية خصوصيتك وضمان أمان بياناتك الشخصية
          </p>
        </motion.div>
        
        {/* Last Updated */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-center mb-8 text-sm text-secondary-500 dark:text-secondary-400"
        >
          آخر تحديث: 1 مارس 2024
        </motion.div>
        
        {/* Sections */}
        <div className="space-y-6">
          {sections.map((section, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
              className="card-glass p-6"
            >
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center ml-3">
                  <section.icon className="w-5 h-5 text-primary-500" />
                </div>
                <h2 className="text-lg font-bold dark:text-white">{section.title}</h2>
              </div>
              <div className="text-secondary-600 dark:text-secondary-300 whitespace-pre-line">
                {section.content}
              </div>
            </motion.div>
          ))}
        </div>
        
        {/* Contact Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-8 p-6 card-glass text-center"
        >
          <h3 className="font-bold mb-2 dark:text-white">للتواصل معنا</h3>
          <p className="text-secondary-600 dark:text-secondary-300 mb-4">
            إذا كان لديك أي أسئلة حول سياسة الخصوصية، يرجى التواصل معنا:
          </p>
          <div className="space-y-2">
            <p className="text-primary-600 dark:text-primary-400">البريد الإلكتروني: privacy@ajar.com</p>
            <p className="text-primary-600 dark:text-primary-400">الهاتف: +966 123 456 789</p>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default PrivacyPolicy;