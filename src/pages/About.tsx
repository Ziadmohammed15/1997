import React from 'react';
import Header from '../components/Header';
import { motion } from 'framer-motion';
import { Camera, Star, Users, Shield, Award, Heart } from 'lucide-react';

const About = () => {
  const stats = [
    { label: 'مستخدم نشط', value: '10K+' },
    { label: 'مقدم خدمة', value: '500+' },
    { label: 'خدمة متاحة', value: '1000+' },
    { label: 'حجز شهري', value: '5K+' }
  ];

  const features = [
    {
      icon: Users,
      title: 'مجتمع موثوق',
      description: 'نضمن لك التعامل مع مقدمي خدمات موثوقين وذوي خبرة'
    },
    {
      icon: Shield,
      title: 'دفع آمن',
      description: 'جميع المعاملات المالية مؤمنة ومشفرة بالكامل'
    },
    {
      icon: Star,
      title: 'خدمة متميزة',
      description: 'نقدم أفضل تجربة مستخدم مع دعم فني على مدار الساعة'
    },
    {
      icon: Heart,
      title: 'رضا العملاء',
      description: 'نضع رضا عملائنا في المقام الأول ونسعى دائماً للتطوير'
    }
  ];

  return (
    <>
      <Header title="عن التطبيق" showBack={true} />
      
      <div className="page-container">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="w-20 h-20 bg-primary-500 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <Camera className="w-10 h-10 text-white" />
          </motion.div>
          
          <h1 className="text-3xl font-bold mb-4 text-gradient">أجار</h1>
          <p className="text-secondary-600 dark:text-secondary-300 max-w-md mx-auto">
            منصة متكاملة لحجز وإدارة الخدمات المختلفة بطريقة سهلة وفعالة
          </p>
        </motion.div>
        
        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-2 gap-4 mb-12"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 + index * 0.1 }}
              className="card-glass p-4 text-center"
            >
              <span className="block text-2xl font-bold text-primary-500 mb-1">{stat.value}</span>
              <span className="text-sm text-secondary-600 dark:text-secondary-300">{stat.label}</span>
            </motion.div>
          ))}
        </motion.div>
        
        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="space-y-6 mb-12"
        >
          <h2 className="text-xl font-bold dark:text-white mb-6">لماذا أجار؟</h2>
          
          <div className="space-y-4">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                className="card-glass p-4 flex items-start"
              >
                <div className="w-12 h-12 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center ml-4 flex-shrink-0">
                  <feature.icon className="w-6 h-6 text-primary-500" />
                </div>
                <div>
                  <h3 className="font-bold mb-1 dark:text-white">{feature.title}</h3>
                  <p className="text-secondary-600 dark:text-secondary-300">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
        
        {/* Awards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="card-glass p-6 text-center"
        >
          <Award className="w-12 h-12 text-primary-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2 dark:text-white">جوائز وتقديرات</h2>
          <p className="text-secondary-600 dark:text-secondary-300 mb-4">
            حصلنا على العديد من الجوائز والتقديرات في مجال التقنية وخدمة العملاء
          </p>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-primary-50 dark:bg-primary-900/30 rounded-lg">
              <span className="block font-bold text-primary-600 dark:text-primary-400">2024</span>
              <span className="text-sm text-secondary-600 dark:text-secondary-300">أفضل تطبيق خدمات</span>
            </div>
            <div className="p-3 bg-primary-50 dark:bg-primary-900/30 rounded-lg">
              <span className="block font-bold text-primary-600 dark:text-primary-400">2023</span>
              <span className="text-sm text-secondary-600 dark:text-secondary-300">أفضل تجربة مستخدم</span>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default About;