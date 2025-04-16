import React from 'react';
import Header from '../components/Header';
import { motion } from 'framer-motion';
import { 
  HelpCircle, MessageCircle, Phone, Mail, 
  ChevronLeft, FileText, AlertCircle, Book 
} from 'lucide-react';

const Help = () => {
  const faqs = [
    {
      question: 'كيف يمكنني إضافة خدمة جديدة؟',
      answer: 'يمكنك إضافة خدمة جديدة من خلال الضغط على زر "إضافة خدمة" في الصفحة الرئيسية لمقدمي الخدمات. قم بتعبئة جميع المعلومات المطلوبة وإضافة صور للخدمة.'
    },
    {
      question: 'كيف يتم الدفع؟',
      answer: 'نقبل جميع طرق الدفع الرئيسية بما في ذلك البطاقات الائتمانية ومدى وآبل باي. يتم معالجة جميع المدفوعات بشكل آمن من خلال بوابة دفع موثوقة.'
    },
    {
      question: 'ما هي سياسة الإلغاء؟',
      answer: 'يمكنك إلغاء الحجز مجاناً قبل 24 ساعة من موعد الخدمة. في حالة الإلغاء قبل أقل من 24 ساعة، سيتم تطبيق رسوم إلغاء بنسبة 10% من قيمة الحجز.'
    },
    {
      question: 'كيف يمكنني التواصل مع مقدم الخدمة؟',
      answer: 'يمكنك التواصل مع مقدم الخدمة مباشرة من خلال نظام المحادثات في التطبيق. اضغط على زر "تواصل" في صفحة الخدمة لبدء محادثة.'
    }
  ];

  const contactMethods = [
    {
      icon: MessageCircle,
      title: 'المحادثة المباشرة',
      description: 'متوفرون على مدار الساعة للرد على استفساراتك',
      action: 'بدء محادثة',
      primary: true
    },
    {
      icon: Phone,
      title: 'اتصل بنا',
      description: '+966 123 456 789',
      action: 'اتصال',
      href: 'tel:+966123456789'
    },
    {
      icon: Mail,
      title: 'البريد الإلكتروني',
      description: 'support@ajar.com',
      action: 'إرسال بريد',
      href: 'mailto:support@ajar.com'
    }
  ];

  return (
    <>
      <Header title="المساعدة والدعم" showBack={true} />
      
      <div className="page-container">
        <div className="space-y-6">
          {/* Quick Help */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <h2 className="text-xl font-bold dark:text-white flex items-center">
              <HelpCircle className="w-6 h-6 ml-2 text-primary-500" />
              كيف يمكننا مساعدتك؟
            </h2>
            
            <div className="grid grid-cols-2 gap-4">
              <button className="card-glass p-4 text-center">
                <FileText className="w-8 h-8 text-primary-500 mx-auto mb-2" />
                <span className="block font-medium dark:text-white">دليل الاستخدام</span>
              </button>
              
              <button className="card-glass p-4 text-center">
                <AlertCircle className="w-8 h-8 text-primary-500 mx-auto mb-2" />
                <span className="block font-medium dark:text-white">الإبلاغ عن مشكلة</span>
              </button>
              
              <button className="card-glass p-4 text-center">
                <Book className="w-8 h-8 text-primary-500 mx-auto mb-2" />
                <span className="block font-medium dark:text-white">الشروط والأحكام</span>
              </button>
              
              <button className="card-glass p-4 text-center">
                <MessageCircle className="w-8 h-8 text-primary-500 mx-auto mb-2" />
                <span className="block font-medium dark:text-white">تواصل معنا</span>
              </button>
            </div>
          </motion.section>
          
          {/* FAQs */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-4"
          >
            <h2 className="text-xl font-bold dark:text-white">الأسئلة الشائعة</h2>
            
            <div className="space-y-3">
              {faqs.map((faq, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                  className="card-glass"
                >
                  <button className="w-full text-right p-4 flex items-center justify-between">
                    <span className="font-medium dark:text-white">{faq.question}</span>
                    <ChevronLeft className="w-5 h-5 text-secondary-400" />
                  </button>
                  <div className="px-4 pb-4 text-secondary-600 dark:text-secondary-300">
                    {faq.answer}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>
          
          {/* Contact Methods */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-4"
          >
            <h2 className="text-xl font-bold dark:text-white">تواصل معنا</h2>
            
            <div className="space-y-3">
              {contactMethods.map((method, index) => (
                <motion.a
                  key={index}
                  href={method.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className={`card-glass p-4 flex items-center justify-between ${
                    method.primary ? 'bg-primary-500 text-white' : ''
                  }`}
                >
                  <div className="flex items-center">
                    <method.icon className={`w-6 h-6 ml-3 ${
                      method.primary ? 'text-white' : 'text-primary-500'
                    }`} />
                    <div>
                      <h3 className={`font-medium ${
                        method.primary ? 'text-white' : 'dark:text-white'
                      }`}>{method.title}</h3>
                      <p className={method.primary ? 'text-white/80' : 'text-secondary-600 dark:text-secondary-300'}>
                        {method.description}
                      </p>
                    </div>
                  </div>
                  <span className={`text-sm ${
                    method.primary ? 'text-white' : 'text-primary-500'
                  }`}>{method.action}</span>
                </motion.a>
              ))}
            </div>
          </motion.section>
        </div>
      </div>
    </>
  );
};

export default Help;