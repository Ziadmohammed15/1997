import React from 'react';
import { Link } from 'react-router-dom';
import { Camera, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gradient-primary text-white">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="mb-4 flex items-center">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center mr-2">
                <Camera className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold">أجار</span>
            </div>
            <p className="text-primary-100">
              منصة متكاملة لحجز وإدارة الخدمات المختلفة بطريقة سهلة وفعالة.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">روابط سريعة</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/home" className="text-primary-100 hover:text-white transition-colors">الرئيسية</Link>
              </li>
              <li>
                <Link to="/my-bookings" className="text-primary-100 hover:text-white transition-colors">حجوزاتي</Link>
              </li>
              <li>
                <Link to="/add-service" className="text-primary-100 hover:text-white transition-colors">إضافة خدمة</Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">تواصل معنا</h3>
            <ul className="space-y-2">
              <li className="flex items-center">
                <Mail className="w-4 h-4 ml-2" />
                <span className="text-primary-100">info@ajar.com</span>
              </li>
              <li className="flex items-center">
                <Phone className="w-4 h-4 ml-2" />
                <span className="text-primary-100">+966 123 456 789</span>
              </li>
              <li className="flex items-center">
                <MapPin className="w-4 h-4 ml-2" />
                <span className="text-primary-100">الرياض، المملكة العربية السعودية</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-primary-400/30 text-center">
          <p className="text-primary-100">© {new Date().getFullYear()} أجار. جميع الحقوق محفوظة.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;