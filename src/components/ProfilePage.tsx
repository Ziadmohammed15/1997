import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  User, Mail, Phone, MapPin, Edit, LogOut, Camera, 
  Settings, ShieldCheck, HelpCircle, MessageCircle, 
  Bell, Star, Heart, Calendar, Clock, ChevronRight, 
  Search, Upload, Trash2, Moon, Sun
} from 'lucide-react';
import Header from './Header';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useChat } from '../context/ChatContext';
import { supabase } from '../services/supabaseClient';
import { useTheme } from '../context/ThemeContext';

interface ProfilePageProps {
  userType: 'client' | 'provider' | null;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ userType }) => {
  const [activeTab, setActiveTab] = useState('personal');
  const [activeSection, setActiveSection] = useState('info');
  const [isEditing, setIsEditing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [editedProfile, setEditedProfile] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    bio: '',
    avatar_url: null as string | null
  });
  
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { conversations } = useChat();
  const { theme, toggleTheme } = useTheme();
  
  const unreadCount = conversations.reduce((total, conv) => total + conv.unread_count, 0);
  
  useEffect(() => {
    const loadProfile = async () => {
      if (!user) return;
      
      try {
        const { error: upsertError } = await supabase
          .from('profiles')
          .upsert({ 
            id: user.id,
            email: user.email,
            name: user.user_metadata?.name || '',
            phone: user.user_metadata?.phone || '',
            user_type: userType
          });
          
        if (upsertError) throw upsertError;
        
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
          
        if (error) throw error;
        
        if (profile) {
          setEditedProfile({
            name: profile.name || '',
            email: profile.email || user.email || '',
            phone: profile.phone || '',
            location: profile.location || '',
            bio: profile.bio || '',
            avatar_url: profile.avatar_url
          });
        }
      } catch (error) {
        console.error('Error loading profile:', error);
      }
    };
    
    loadProfile();
  }, [user, userType]);
  
  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;
    
    try {
      setIsUploading(true);
      
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${Math.random()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file);
        
      if (uploadError) throw uploadError;
      
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);
      
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ 
          avatar_url: publicUrl,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);
        
      if (updateError) throw updateError;
      
      setEditedProfile(prev => ({ ...prev, avatar_url: publicUrl }));
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteAvatar = async () => {
    if (!user || !editedProfile.avatar_url) return;
    
    try {
      const path = editedProfile.avatar_url.split('/').slice(-2).join('/');
      
      const { error: deleteError } = await supabase.storage
        .from('avatars')
        .remove([path]);
        
      if (deleteError) throw deleteError;
      
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ 
          avatar_url: null,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);
        
      if (updateError) throw updateError;
      
      setEditedProfile(prev => ({ ...prev, avatar_url: null }));
    } catch (error) {
      console.error('Error deleting avatar:', error);
      alert('Failed to delete avatar. Please try again.');
    }
  };
  
  const handleSaveProfile = async () => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          name: editedProfile.name,
          email: editedProfile.email,
          phone: editedProfile.phone,
          location: editedProfile.location,
          bio: editedProfile.bio
        })
        .eq('id', user.id);
        
      if (error) throw error;
      
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile. Please try again.');
    }
  };
  
  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };
  
  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <p className="text-secondary-600 dark:text-secondary-400 mb-4">
          يرجى تسجيل الدخول للوصول إلى الملف الشخصي
        </p>
        <Link to="/auth" className="btn-primary">
          تسجيل الدخول
        </Link>
      </div>
    );
  }

  return (
    <>
      <Header title="الملف الشخصي" showBack={true} />
      
      <div className="page-container">
        {/* الجزء العلوي المعدل */}
        <div className="relative mb-8">
          {/* الخلفية العلوية */}
          <div className="h-32 rounded-xl bg-gradient-primary overflow-hidden relative">
            <div className="absolute inset-0 bg-dots opacity-10"></div>
          </div>
          
          {/* الصورة الشخصية - تم تعديل الموضع */}
          <div className="flex flex-col items-center mt-4">
            <div className="relative -mt-16"> {/* تم تعديل الـ margin-top هنا */}
              <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white dark:border-secondary-800 shadow-lg bg-secondary-100 dark:bg-secondary-800">
                {editedProfile.avatar_url ? (
                  <img 
                    src={editedProfile.avatar_url} 
                    alt={editedProfile.name} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <User className="w-12 h-12 text-secondary-400" />
                  </div>
                )}
              </div>
              <input
                type="file"
                id="avatar-upload"
                className="hidden"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={isUploading}
              />
              <label
                htmlFor="avatar-upload"
                className="absolute bottom-0 right-0 bg-primary-500 text-white p-2 rounded-full shadow-lg cursor-pointer"
              >
                {isUploading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <Camera className="w-4 h-4" />
                )}
              </label>
              {editedProfile.avatar_url && (
                <button
                  onClick={handleDeleteAvatar}
                  className="absolute bottom-0 left-0 bg-red-500 text-white p-2 rounded-full shadow-lg"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
            
            {/* معلومات المستخدم - تم نقلها هنا */}
            <div className="mt-4 text-center">
              <h2 className="text-xl font-bold dark:text-white">{editedProfile.name || user.email}</h2>
              <p className="text-secondary-500 dark:text-secondary-400 flex items-center justify-center">
                {userType === 'provider' ? (
                  <>
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500 ml-1" />
                    مقدم خدمة
                  </>
                ) : (
                  <>
                    <User className="w-4 h-4 ml-1" />
                    عميل
                  </>
                )}
              </p>
            </div>
          </div>
        </div>
        
        {/* باقي الكود بدون تغيير */}
        <div className="flex mb-6 bg-secondary-100 dark:bg-secondary-800 rounded-xl p-1">
          <button
            className={`flex-1 py-2 text-center rounded-lg transition-all ${
              activeTab === 'personal'
                ? 'bg-white dark:bg-secondary-700 text-primary-600 dark:text-primary-400 shadow-sm font-medium'
                : 'text-secondary-600 dark:text-secondary-400'
            }`}
            onClick={() => setActiveTab('personal')}
          >
            المعلومات الشخصية
          </button>
          <button
            className={`flex-1 py-2 text-center rounded-lg transition-all ${
              activeTab === 'settings'
                ? 'bg-white dark:bg-secondary-700 text-primary-600 dark:text-primary-400 shadow-sm font-medium'
                : 'text-secondary-600 dark:text-secondary-400'
            }`}
            onClick={() => setActiveTab('settings')}
          >
            الإعدادات
          </button>
        </div>
        
        <AnimatePresence mode="wait">
          {activeTab === 'personal' ? (
            <motion.div
              key="personal"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              {isEditing ? (
                <div className="card-glass p-4">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">
                        الاسم
                      </label>
                      <input
                        type="text"
                        value={editedProfile.name}
                        onChange={(e) => setEditedProfile(prev => ({ ...prev, name: e.target.value }))}
                        className="input-field"
                        placeholder="أدخل اسمك"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">
                        البريد الإلكتروني
                      </label>
                      <input
                        type="email"
                        value={editedProfile.email}
                        onChange={(e) => setEditedProfile(prev => ({ ...prev, email: e.target.value }))}
                        className="input-field"
                        placeholder="أدخل بريدك الإلكتروني"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">
                        رقم الهاتف
                      </label>
                      <input
                        type="tel"
                        value={editedProfile.phone}
                        onChange={(e) => setEditedProfile(prev => ({ ...prev, phone: e.target.value }))}
                        className="input-field"
                        placeholder="أدخل رقم هاتفك"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">
                        الموقع
                      </label>
                      <input
                        type="text"
                        value={editedProfile.location}
                        onChange={(e) => setEditedProfile(prev => ({ ...prev, location: e.target.value }))}
                        className="input-field"
                        placeholder="أدخل موقعك"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">
                        نبذة عني
                      </label>
                      <textarea
                        value={editedProfile.bio}
                        onChange={(e) => setEditedProfile(prev => ({ ...prev, bio: e.target.value }))}
                        className="input-field"
                        rows={4}
                        placeholder="اكتب نبذة عنك"
                      />
                    </div>
                  </div>
                  
                  <div className="flex space-x-3 rtl:space-x-reverse mt-6">
                    <button
                      onClick={() => setIsEditing(false)}
                      className="btn-glass flex-1"
                    >
                      إلغاء
                    </button>
                    <button
                      onClick={handleSaveProfile}
                      className="btn-primary flex-1"
                    >
                      حفظ التغييرات
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="card-glass p-4">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="font-bold text-lg dark:text-white">نبذة عني</h3>
                      <button 
                        onClick={() => setIsEditing(true)}
                        className="p-2 text-primary-500 dark:text-primary-400"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-secondary-600 dark:text-secondary-300">
                      {editedProfile.bio || 'لم يتم إضافة نبذة بعد'}
                    </p>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="card p-4">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/50 flex items-center justify-center ml-3">
                          <User className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-secondary-500 dark:text-secondary-400">الاسم</p>
                          <p className="font-medium dark:text-white">{editedProfile.name || 'لم يتم تحديد الاسم'}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="card p-4">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/50 flex items-center justify-center ml-3">
                          <Mail className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-secondary-500 dark:text-secondary-400">البريد الإلكتروني</p>
                          <p className="font-medium dark:text-white">{editedProfile.email || user.email}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="card p-4">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/50 flex items-center justify-center ml-3">
                          <Phone className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-secondary-500 dark:text-secondary-400">رقم الهاتف</p>
                          <p className="font-medium dark:text-white">{editedProfile.phone || 'لم يتم تحديد رقم الهاتف'}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="card p-4">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/50 flex items-center justify-center ml-3">
                          <MapPin className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-secondary-500 dark:text-secondary-400">الموقع</p>
                          <p className="font-medium dark:text-white">{editedProfile.location || 'لم يتم تحديد الموقع'}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
              
              <button 
                onClick={handleLogout}
                className="w-full mt-8 flex items-center justify-center p-3 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400"
              >
                <LogOut className="w-5 h-5 ml-2" />
                <span>تسجيل الخروج</span>
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="settings"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              <div className="card p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="font-medium dark:text-white">الوضع الليلي</span>
                    {theme === 'dark' ? (
                      <Moon className="w-5 h-5 mr-2 text-primary-500" />
                    ) : (
                      <Sun className="w-5 h-5 mr-2 text-primary-500" />
                    )}
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer" 
                      checked={theme === 'dark'}
                      onChange={toggleTheme}
                    />
                    <div className="w-11 h-6 bg-secondary-200 dark:bg-secondary-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:translate-x-[-100%] peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:right-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"></div>
                  </label>
                </div>
              </div>
              
              <div className="card p-4">
                <div className="flex items-center justify-between">
                  <span className="font-medium dark:text-white">الإشعارات</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-secondary-200 dark:bg-secondary-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:translate-x-[-100%] peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:right-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"></div>
                  </label>
                </div>
              </div>
              
              <div className="card p-4">
                <div className="flex items-center justify-between">
                  <span className="font-medium dark:text-white">إشعارات البريد الإلكتروني</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-secondary-200 dark:bg-secondary-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:translate-x-[-100%] peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:right-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"></div>
                  </label>
                </div>
              </div>
              
              <div className="card p-4">
                <div className="flex items-center justify-between">
                  <span className="font-medium dark:text-white">إشعارات الرسائل</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-secondary-200 dark:bg-secondary-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:translate-x-[-100%] peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:right-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"></div>
                  </label>
                </div>
              </div>
              
              <div className="card p-4">
                <div className="flex items-center justify-between">
                  <span className="font-medium dark:text-white">اللغة</span>
                  <select className="bg-secondary-50 dark:bg-secondary-700 border-none rounded-lg p-2 text-sm dark:text-white">
                    <option value="ar">العربية</option>
                    <option value="en">English</option>
                  </select>
                </div>
              </div>
              
              <div className="mt-8 space-y-4">
                <button className="w-full p-3 rounded-xl bg-secondary-100 dark:bg-secondary-800 text-secondary-700 dark:text-secondary-300 flex items-center">
                  <ShieldCheck className="w-5 h-5 ml-2" />
                  <span>سياسة الخصوصية</span>
                </button>
                <button className="w-full p-3 rounded-xl bg-secondary-100 dark:bg-secondary-800 text-secondary-700 dark:text-secondary-300 flex items-center">
                  <Settings className="w-5 h-5 ml-2" />
                  <span>شروط الاستخدام</span>
                </button>
                <button className="w-full p-3 rounded-xl bg-secondary-100 dark:bg-secondary-800 text-secondary-700 dark:text-secondary-300 flex items-center">
                  <HelpCircle className="w-5 h-5 ml-2" />
                  <span>عن التطبيق</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export default ProfilePage;