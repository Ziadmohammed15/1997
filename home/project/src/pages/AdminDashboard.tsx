import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabaseClient';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import {
  Users, ShoppingBag, Calendar, Star, 
  UserPlus, Trash2, Edit, Search
} from 'lucide-react';

const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState<'users' | 'services' | 'bookings'>('users');

  useEffect(() => {
    checkAdminAccess();
    loadDashboardData();
  }, []);

  const checkAdminAccess = async () => {
    const { data: adminData } = await supabase
      .from('admin_users')
      .select('*')
      .eq('id', user?.id)
      .single();

    if (!adminData) {
      navigate('/');
    }
  };

  const loadDashboardData = async () => {
    try {
      // Load users
      const { data: usersData } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (usersData) setUsers(usersData);

      // Load services
      const { data: servicesData } = await supabase
        .from('services')
        .select('*, provider:profiles(name)')
        .order('created_at', { ascending: false });
      
      if (servicesData) setServices(servicesData);

      // Load bookings
      const { data: bookingsData } = await supabase
        .from('bookings')
        .select(`
          *,
          service:services(title),
          client:profiles!bookings_client_id_fkey(name),
          provider:profiles!services_provider_id_fkey(name)
        `)
        .order('created_at', { ascending: false });
      
      if (bookingsData) setBookings(bookingsData);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', userId);

      if (error) throw error;
      
      setUsers(users.filter(user => user.id !== userId));
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const handleDeleteService = async (serviceId: string) => {
    try {
      const { error } = await supabase
        .from('services')
        .delete()
        .eq('id', serviceId);

      if (error) throw error;
      
      setServices(services.filter(service => service.id !== serviceId));
    } catch (error) {
      console.error('Error deleting service:', error);
    }
  };

  const filteredData = () => {
    const term = searchTerm.toLowerCase();
    
    switch (selectedTab) {
      case 'users':
        return users.filter(user => 
          user.name?.toLowerCase().includes(term) ||
          user.phone?.toLowerCase().includes(term)
        );
      
      case 'services':
        return services.filter(service =>
          service.title?.toLowerCase().includes(term) ||
          service.provider?.name?.toLowerCase().includes(term)
        );
      
      case 'bookings':
        return bookings.filter(booking =>
          booking.service?.title?.toLowerCase().includes(term) ||
          booking.client?.name?.toLowerCase().includes(term)
        );
      
      default:
        return [];
    }
  };

  return (
    <div className="min-h-screen bg-secondary-50 dark:bg-secondary-900">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold dark:text-white">لوحة التحكم</h1>
          <p className="text-secondary-600 dark:text-secondary-400">مرحباً بك في لوحة تحكم المشرفين</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="card-glass p-6"
          >
            <div className="flex items-center">
              <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center">
                <Users className="w-6 h-6 text-primary-600 dark:text-primary-400" />
              </div>
              <div className="mr-4">
                <p className="text-sm text-secondary-600 dark:text-secondary-400">المستخدمين</p>
                <p className="text-2xl font-bold dark:text-white">{users.length}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="card-glass p-6"
          >
            <div className="flex items-center">
              <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center">
                <ShoppingBag className="w-6 h-6 text-primary-600 dark:text-primary-400" />
              </div>
              <div className="mr-4">
                <p className="text-sm text-secondary-600 dark:text-secondary-400">الخدمات</p>
                <p className="text-2xl font-bold dark:text-white">{services.length}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="card-glass p-6"
          >
            <div className="flex items-center">
              <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center">
                <Calendar className="w-6 h-6 text-primary-600 dark:text-primary-400" />
              </div>
              <div className="mr-4">
                <p className="text-sm text-secondary-600 dark:text-secondary-400">الحجوزات</p>
                <p className="text-2xl font-bold dark:text-white">{bookings.length}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="card-glass p-6"
          >
            <div className="flex items-center">
              <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center">
                <Star className="w-6 h-6 text-primary-600 dark:text-primary-400" />
              </div>
              <div className="mr-4">
                <p className="text-sm text-secondary-600 dark:text-secondary-400">متوسط التقييم</p>
                <p className="text-2xl font-bold dark:text-white">4.8</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Tabs and Search */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
          <div className="flex space-x-2 rtl:space-x-reverse mb-4 sm:mb-0">
            <button
              onClick={() => setSelectedTab('users')}
              className={`px-4 py-2 rounded-lg ${
                selectedTab === 'users'
                  ? 'bg-primary-500 text-white'
                  : 'bg-white dark:bg-secondary-800 text-secondary-600 dark:text-secondary-400'
              }`}
            >
              المستخدمين
            </button>
            <button
              onClick={() => setSelectedTab('services')}
              className={`px-4 py-2 rounded-lg ${
                selectedTab === 'services'
                  ? 'bg-primary-500 text-white'
                  : 'bg-white dark:bg-secondary-800 text-secondary-600 dark:text-secondary-400'
              }`}
            >
              الخدمات
            </button>
            <button
              onClick={() => setSelectedTab('bookings')}
              className={`px-4 py-2 rounded-lg ${
                selectedTab === 'bookings'
                  ? 'bg-primary-500 text-white'
                  : 'bg-white dark:bg-secondary-800 text-secondary-600 dark:text-secondary-400'
              }`}
            >
              الحجوزات
            </button>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-secondary-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pr-10 py-2 bg-white dark:bg-secondary-800 border border-secondary-200 dark:border-secondary-700 rounded-lg"
              placeholder="بحث..."
            />
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="mt-4 text-secondary-600 dark:text-secondary-400">جاري تحميل البيانات...</p>
          </div>
        ) : (
          <div className="bg-white dark:bg-secondary-800 rounded-xl shadow-sm overflow-hidden">
            {selectedTab === 'users' && (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-secondary-200 dark:divide-secondary-700">
                  <thead className="bg-secondary-50 dark:bg-secondary-900">
                    <tr>
                      <th className="px-6 py-3 text-right text-xs font-medium text-secondary-500 uppercase tracking-wider">
                        المستخدم
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-secondary-500 uppercase tracking-wider">
                        رقم الهاتف
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-secondary-500 uppercase tracking-wider">
                        نوع الحساب
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-secondary-500 uppercase tracking-wider">
                        الإجراءات
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-secondary-800 divide-y divide-secondary-200 dark:divide-secondary-700">
                    {filteredData().map((user) => (
                      <tr key={user.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-10 w-10 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                              <Users className="h-6 w-6 text-primary-600 dark:text-primary-400" />
                            </div>
                            <div className="mr-4">
                              <div className="text-sm font-medium text-secondary-900 dark:text-white">
                                {user.name}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-500 dark:text-secondary-400">
                          {user.phone}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            user.role === 'admin'
                              ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400'
                              : user.role === 'provider'
                              ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                              : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                          }`}>
                            {user.role === 'admin' ? 'مشرف' : user.role === 'provider' ? 'مزود خدمة' : 'عميل'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-500">
                          <button
                            onClick={() => handleDeleteUser(user.id)}
                            className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 mr-4"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                          <button className="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300">
                            <Edit className="w-5 h-5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {selectedTab === 'services' && (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-secondary-200 dark:divide-secondary-700">
                  <thead className="bg-secondary-50 dark:bg-secondary-900">
                    <tr>
                      <th className="px-6 py-3 text-right text-xs font-medium text-secondary-500 uppercase tracking-wider">
                        الخدمة
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-secondary-500 uppercase tracking-wider">
                        مزود الخدمة
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-secondary-500 uppercase tracking-wider">
                        السعر
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-secondary-500 uppercase tracking-wider">
                        الحالة
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-secondary-500 uppercase tracking-wider">
                        الإجراءات
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-secondary-800 divide-y divide-secondary-200 dark:divide-secondary-700">
                    {filteredData().map((service) => (
                      <tr key={service.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <img
                              src={service.image_url || 'https://via.placeholder.com/40'}
                              alt={service.title}
                              className="h-10 w-10 rounded-lg object-cover"
                            />
                            <div className="mr-4">
                              <div className="text-sm font-medium text-secondary-900 dark:text-white">
                                {service.title}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-500 dark:text-secondary-400">
                          {service.provider?.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-500 dark:text-secondary-400">
                          {service.price} ريال
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            service.status === 'active'
                              ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                              : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                          }`}>
                            {service.status === 'active' ? 'نشط' : 'معطل'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-500">
                          <button
                            onClick={() => handleDeleteService(service.id)}
                            className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 mr-4"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                          <button className="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300">
                            <Edit className="w-5 h-5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {selectedTab === 'bookings' && (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-secondary-200 dark:divide-secondary-700">
                  <thead className="bg-secondary-50 dark:bg-secondary-900">
                    <tr>
                      <th className="px-6 py-3 text-right text-xs font-medium text-secondary-500 uppercase tracking-wider">
                        الخدمة
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-secondary-500 uppercase tracking-wider">
                        العميل
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-secondary-500 uppercase tracking-wider">
                        التاريخ
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-secondary-500 uppercase tracking-wider">
                        الحالة
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-secondary-500 uppercase tracking-wider">
                        الإجراءات
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-secondary-800 divide-y divide-secondary-200 dark:divide-secondary-700">
                    {filteredData().map((booking) => (
                      <tr key={booking.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-secondary-900 dark:text-white">
                            {booking.service?.title}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-500 dark:text-secondary-400">
                          {booking.client?.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-500 dark:text-secondary-400">
                          {new Date(booking.date).toLocaleDateString('ar-SA')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            booking.status === 'confirmed'
                              ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                              : booking.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                              : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                          }`}>
                            {booking.status === 'confirmed' ? 'مؤكد' : booking.status === 'pending' ? 'قيد الانتظار' : 'ملغي'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-500">
                          <button className="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300">
                            <Edit className="w-5 h-5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;