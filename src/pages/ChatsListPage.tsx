import React, { useState } from 'react';
import { Search, Plus, Filter, MessageCircle } from 'lucide-react';
import Header from '../components/Header';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useChat } from '../context/ChatContext';
import { useAuth } from '../context/AuthContext';
import { formatDistanceToNow } from 'date-fns';
import { ar } from 'date-fns/locale';
import ChatListSkeleton from '../components/ChatListSkeleton';

const ChatsListPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const { conversations, loadingConversations } = useChat();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const filteredChats = conversations.filter(chat => {
    // Get the other participant (not the current user)
    const otherParticipant = chat.participants.find(p => p.id !== user?.id);
    
    if (!otherParticipant) return false;
    
    const matchesSearch = otherParticipant.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = 
      activeFilter === 'all' || 
      (activeFilter === 'unread' && chat.unread_count > 0) ||
      (activeFilter === 'online' && otherParticipant.online);
    
    return matchesSearch && matchesFilter;
  });
  
  const formatLastMessageTime = (time: string | null) => {
    if (!time) return '';
    
    try {
      return formatDistanceToNow(new Date(time), { addSuffix: true, locale: ar });
    } catch (error) {
      return time;
    }
  };
  
  return (
    <>
      <Header title="المحادثات" showBack={true} />
      
      <div className="page-container">
        <div className="mb-6">
          <div className="relative">
            <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
              <Search className="w-5 h-5 text-secondary-400" />
            </div>
            <input
              type="text"
              className="input-field pr-12"
              placeholder="ابحث في المحادثات..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        <div className="flex mb-6 bg-secondary-100 dark:bg-secondary-800 rounded-xl p-1">
          <button
            className={`flex-1 py-2 text-center rounded-lg transition-all ${
              activeFilter === 'all'
                ? 'bg-white dark:bg-secondary-700 text-primary-600 dark:text-primary-400 shadow-sm font-medium'
                : 'text-secondary-600 dark:text-secondary-400'
            }`}
            onClick={() => setActiveFilter('all')}
          >
            الكل
          </button>
          <button
            className={`flex-1 py-2 text-center rounded-lg transition-all ${
              activeFilter === 'unread'
                ? 'bg-white dark:bg-secondary-700 text-primary-600 dark:text-primary-400 shadow-sm font-medium'
                : 'text-secondary-600 dark:text-secondary-400'
            }`}
            onClick={() => setActiveFilter('unread')}
          >
            غير مقروءة
          </button>
          <button
            className={`flex-1 py-2 text-center rounded-lg transition-all ${
              activeFilter === 'online'
                ? 'bg-white dark:bg-secondary-700 text-primary-600 dark:text-primary-400 shadow-sm font-medium'
                : 'text-secondary-600 dark:text-secondary-400'
            }`}
            onClick={() => setActiveFilter('online')}
          >
            متصل الآن
          </button>
        </div>
        
        {loadingConversations ? (
          <ChatListSkeleton />
        ) : filteredChats.length > 0 ? (
          <div className="space-y-3">
            {filteredChats.map((chat, index) => {
              // Get the other participant (not the current user)
              const otherParticipant = chat.participants.find(p => p.id !== user?.id);
              
              if (!otherParticipant) return null;
              
              return (
                <Link key={chat.id} to={`/chat/${chat.id}`}>
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="card-glass p-3 flex items-center relative"
                  >
                    <div className="relative">
                      <div className="w-14 h-14 rounded-full overflow-hidden">
                        <img 
                          src={otherParticipant.avatar_url || 'https://via.placeholder.com/100?text=' + otherParticipant.name.charAt(0)} 
                          alt={otherParticipant.name} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      {otherParticipant.online && (
                        <div className="absolute bottom-0 left-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-secondary-800"></div>
                      )}
                    </div>
                    
                    <div className="mr-3 flex-1 min-w-0">
                      <div className="flex justify-between items-center">
                        <h4 className="font-medium dark:text-white truncate">{otherParticipant.name}</h4>
                        <span className="text-xs text-secondary-500 dark:text-secondary-400">
                          {formatLastMessageTime(chat.last_message_time)}
                        </span>
                      </div>
                      <p className={`text-sm truncate ${
                        chat.unread_count > 0 
                          ? 'text-secondary-900 dark:text-white font-medium' 
                          :  'text-secondary-600 dark:text-secondary-300'
                      }`}>
                        {chat.last_message || 'ابدأ المحادثة الآن'}
                      </p>
                    </div>
                    
                    {chat.unread_count > 0 && (
                      <div className="w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                        {chat.unread_count}
                      </div>
                    )}
                  </motion.div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-16 h-16 bg-secondary-100 dark:bg-secondary-800 rounded-full flex items-center justify-center mb-4">
              <Filter className="w-8 h-8 text-secondary-400" />
            </div>
            <h3 className="text-lg font-bold text-secondary-800 dark:text-white mb-2">لا توجد محادثات</h3>
            <p className="text-secondary-600 dark:text-secondary-400">
              {searchTerm 
                ? 'لا توجد نتائج مطابقة لبحثك' 
                : activeFilter === 'unread' 
                  ? 'لا توجد محادثات غير مقروءة' 
                  : activeFilter === 'online' 
                    ? 'لا يوجد مستخدمين متصلين حالياً' 
                    : 'لا توجد محادثات حتى الآن'}
            </p>
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm('')}
                className="mt-4 text-primary-600 dark:text-primary-400 font-medium"
              >
                مسح البحث
              </button>
            )}
          </div>
        )}
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/home')}
          className="fixed bottom-20 left-1/2 transform -translate-x-1/2 bg-primary-500 text-white p-4 rounded-full shadow-lg"
        >
          <MessageCircle className="w-6 h-6" />
        </motion.button>
      </div>
    </>
  );
};

export default ChatsListPage;