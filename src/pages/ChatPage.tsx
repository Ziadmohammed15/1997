import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowRight, Send, Image, Smile, Paperclip, Mic, MoreVertical, Phone, Video, Info, Camera, File, MapPin, X } from 'lucide-react';
import Header from '../components/Header';
import { motion, AnimatePresence } from 'framer-motion';
import TextareaAutosize from 'react-textarea-autosize';
import EmojiPicker from 'emoji-picker-react';
import { services } from '../data/services';
import { useAuth } from '../context/AuthContext';
import { useChat } from '../context/ChatContext';
import { format, isToday, isYesterday, formatDistanceToNow } from 'date-fns';
import { ar } from 'date-fns/locale';
import ChatSkeleton from '../components/ChatSkeleton';
import Linkify from 'linkify-react';

const ChatPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { 
    conversations, 
    messages, 
    loadingMessages, 
    sendMessage, 
    setCurrentConversation,
    markAsRead
  } = useChat();
  
  const [messageText, setMessageText] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [showServiceInfo, setShowServiceInfo] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [showImagePreview, setShowImagePreview] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Find the current conversation
  const conversation = conversations.find(c => c.id === id);
  
  // Get the other participant (not the current user)
  const otherParticipant = conversation?.participants.find(p => p.id !== user?.id);
  
  // Find the service if serviceId exists
  const service = conversation?.service_id ? services.find(s => s.id === conversation.service_id) : null;
  
  useEffect(() => {
    if (id) {
      setCurrentConversation(id);
      
      // Mark messages as read when opening the chat
      if (conversation?.unread_count && conversation.unread_count > 0) {
        markAsRead(id);
      }
    }
    
    return () => {
      setCurrentConversation(null);
    };
  }, [id, conversation?.unread_count]);
  
  useEffect(() => {
    // Scroll to bottom of messages
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  // Recording timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRecording]);
  
  if (!id) {
    return (
      <>
        <Header title="المحادثة" showBack={true} />
        <div className="page-container flex flex-col items-center justify-center">
          <p className="text-secondary-600 dark:text-secondary-400">المحادثة غير موجودة</p>
          <button 
            onClick={() => navigate('/chats')}
            className="mt-4 text-primary-600 dark:text-primary-400"
          >
            العودة للمحادثات
          </button>
        </div>
      </>
    );
  }
  
  const handleSendMessage = () => {
    if (messageText.trim() === '') return;
    
    sendMessage(messageText);
    setMessageText('');
    setShowEmojiPicker(false);
    setShowAttachMenu(false);
  };
  
  const handleEmojiClick = (emojiData: any) => {
    setMessageText(prev => prev + emojiData.emoji);
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Handle file upload
      console.log('File selected:', file);
    }
  };
  
  const handleImageClick = (imageUrl: string) => {
    setSelectedImage(imageUrl);
    setShowImagePreview(true);
  };
  
  const formatRecordingTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };
  
  const formatMessageDate = (timestamp: string) => {
    const date = new Date(timestamp);
    
    if (isToday(date)) {
      return format(date, 'h:mm a', { locale: ar });
    } else if (isYesterday(date)) {
      return `الأمس ${format(date, 'h:mm a', { locale: ar })}`;
    } else {
      return format(date, 'dd/MM/yyyy h:mm a', { locale: ar });
    }
  };
  
  const formatLastSeen = (lastOnline: string | null | boolean) => {
    if (lastOnline === true) return 'متصل الآن';
    if (!lastOnline) return 'غير متصل';
    
    const date = new Date(lastOnline as string);
    return `آخر ظهور ${formatDistanceToNow(date, { addSuffix: true, locale: ar })}`;
  };

  return (
    <div className="flex flex-col h-screen bg-secondary-50 dark:bg-secondary-900">
      {/* Chat Header */}
      <div className="sticky top-0 z-10 backdrop-blur-glass bg-white/80 dark:bg-secondary-900/80 py-3 px-4 flex items-center justify-between border-b border-secondary-100/50 dark:border-secondary-800/50 transition-colors duration-300">
        <div className="flex items-center">
          <motion.button 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate(-1)}
            className="p-2 -mr-2 rounded-full hover:bg-secondary-100/70 dark:hover:bg-secondary-800/70 transition-colors"
          >
            <ArrowRight className="w-5 h-5 text-secondary-700 dark:text-secondary-300" />
          </motion.button>
          
          {otherParticipant && (
            <div className="flex items-center mr-2" onClick={() => setShowServiceInfo(!showServiceInfo)}>
              <div className="relative">
                <div className="w-10 h-10 rounded-full overflow-hidden">
                  <img 
                    src={otherParticipant.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(otherParticipant.name)}&background=random`} 
                    alt={otherParticipant.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                {otherParticipant.online && (
                  <div className="absolute bottom-0 left-0 w-2 h-2 bg-green-500 rounded-full border-2 border-white dark:border-secondary-900"></div>
                )}
              </div>
              
              <div className="mr-3">
                <h2 className="font-bold text-secondary-900 dark:text-white">{otherParticipant.name}</h2>
                <p className="text-xs text-secondary-500 dark:text-secondary-400">
                  {formatLastSeen(otherParticipant.online)}
                </p>
              </div>
            </div>
          )}
        </div>
        
        <div className="flex items-center space-x-2 rtl:space-x-reverse">
          <motion.button 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 rounded-full hover:bg-secondary-100/70 dark:hover:bg-secondary-800/70 transition-colors"
          >
            <Phone className="w-5 h-5 text-primary-500" />
          </motion.button>
          
          <motion.button 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 rounded-full hover:bg-secondary-100/70 dark:hover:bg-secondary-800/70 transition-colors"
          >
            <Video className="w-5 h-5 text-primary-500" />
          </motion.button>
          
          <motion.button 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowOptions(!showOptions)}
            className="p-2 rounded-full hover:bg-secondary-100/70 dark:hover:bg-secondary-800/70 transition-colors relative"
          >
            <MoreVertical className="w-5 h-5 text-secondary-700 dark:text-secondary-300" />
            
            <AnimatePresence>
              {showOptions && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute left-0 top-full mt-2 w-48 bg-white dark:bg-secondary-800 rounded-xl shadow-lg border border-secondary-100 dark:border-secondary-700 z-50"
                >
                  <div className="py-1">
                    <button className="w-full text-right px-4 py-2 text-secondary-700 dark:text-secondary-300 hover:bg-secondary-100 dark:hover:bg-secondary-700">
                      عرض الملف الشخصي
                    </button>
                    <button className="w-full text-right px-4 py-2 text-secondary-700 dark:text-secondary-300 hover:bg-secondary-100 dark:hover:bg-secondary-700">
                      كتم الإشعارات
                    </button>
                    <button className="w-full text-right px-4 py-2 text-secondary-700 dark:text-secondary-300 hover:bg-secondary-100 dark:hover:bg-secondary-700">
                      حظر المستخدم
                    </button>
                    <button className="w-full text-right px-4 py-2 text-red-600 dark:text-red-400 hover:bg-secondary-100 dark:hover:bg-secondary-700">
                      حذف المحادثة
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </div>
      
      {/* Service Info */}
      <AnimatePresence>
        {showServiceInfo && service && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="p-4 bg-primary-50 dark:bg-primary-900/20 border-b border-primary-100 dark:border-primary-800/30">
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-lg overflow-hidden">
                  <img 
                    src={service.image} 
                    alt={service.title} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="mr-3 flex-1">
                  <h3 className="font-bold text-secondary-900 dark:text-white">{service.title}</h3>
                  <p className="text-xs text-secondary-500 dark:text-secondary-400">
                    {service.price} ريال / للساعة
                  </p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate(`/service/${service.id}`)}
                  className="px-3 py-1 bg-primary-500 text-white text-sm rounded-lg"
                >
                  عرض
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 momentum-scroll no-scrollbar bg-dots">
        {loadingMessages ? (
          <ChatSkeleton />
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full">
            <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center mb-4">
              <Send className="w-8 h-8 text-primary-500" />
            </div>
            <p className="text-secondary-600 dark:text-secondary-400">
              ابدأ المحادثة مع {otherParticipant?.name}
            </p>
          </div>
        ) : (
          messages.map((msg, index) => {
            const isFirstMessage = index === 0 || new Date(msg.created_at).getDate() !== new Date(messages[index - 1].created_at).getDate();
            
            return (
              <React.Fragment key={msg.id}>
                {isFirstMessage && (
                  <div className="flex justify-center">
                    <span className="px-3 py-1 bg-secondary-100 dark:bg-secondary-800 text-secondary-600 dark:text-secondary-300 text-xs rounded-full">
                      {format(new Date(msg.created_at), 'EEEE, d MMMM yyyy', { locale: ar })}
                    </span>
                  </div>
                )}
                
                <div className={`flex ${msg.sender_id === user?.id ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] ${msg.sender_id === user?.id ? 'order-1' : 'order-2'}`}>
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`rounded-2xl p-3 ${
                        msg.sender_id === user?.id 
                          ? 'bg-primary-500 text-white rounded-br-none' 
                          : 'bg-white dark:bg-secondary-800 text-secondary-900 dark:text-white rounded-bl-none shadow-sm'
                      }`}
                    >
                      <Linkify options={{ target: '_blank' }}>
                        <p className="text-sm whitespace-pre-wrap break-words">{msg.content}</p>
                      </Linkify>
                    </motion.div>
                    <div className={`flex items-center mt-1 text-xs text-secondary-500 dark:text-secondary-400 ${msg.sender_id === user?.id ? 'justify-end' : 'justify-start'}`}>
                      <span>{formatMessageDate(msg.created_at)}</span>
                      {msg.sender_id === user?.id && (
                        <span className="mr-1">{msg.read ? 'تم القراءة' : 'تم الإرسال'}</span>
                      )}
                    </div>
                  </div>
                  
                  {msg.sender_id !== user?.id && otherParticipant && (
                    <div className="w-8 h-8 rounded-full overflow-hidden ml-2 order-1">
                      <img 
                        src={otherParticipant.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(otherParticipant.name)}&background=random`} 
                        alt={otherParticipant.name} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                </div>
              </React.Fragment>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>
      
      {/* Message Input */}
      <div className="border-t border-secondary-100 dark:border-secondary-800 bg-white dark:bg-secondary-900 p-3">
        <div className="relative">
          <div className="flex items-end">
            <div className="flex-1 relative">
              <TextareaAutosize
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="اكتب رسالتك هنا..."
                className="w-full rounded-2xl bg-secondary-100 dark:bg-secondary-800 border-none py-3 px-4 pr-12 max-h-32 resize-none focus:ring-0 text-secondary-900 dark:text-white placeholder:text-secondary-400 dark:placeholder:text-secondary-500"
                minRows={1}
                maxRows={5}
              />
              
              <div className="absolute right-2 bottom-2 flex items-center space-x-2 rtl:space-x-reverse">
                <motion.button 
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setShowEmojiPicker(!showEmojiPicker);
                    setShowAttachMenu(false);
                  }}
                  className="p-1 text-secondary-500 hover:text-secondary-700 dark:text-secondary-400 dark:hover:text-secondary-200 transition-colors"
                >
                  <Smile className="w-5 h-5" />
                </motion.button>
                
                <motion.button 
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setShowAttachMenu(!showAttachMenu);
                    setShowEmojiPicker(false);
                  }}
                  className="p-1 text-secondary-500 hover:text-secondary-700 dark:text-secondary-400 dark:hover:text-secondary-200 transition-colors"
                >
                  <Paperclip className="w-5 h-5" />
                </motion.button>
              </div>
            </div>
            
            {messageText.trim() === '' ? (
              <motion.button 
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onTouchStart={() => setIsRecording(true)}
                onTouchEnd={() => setIsRecording(false)}
                onMouseDown={() => setIsRecording(true)}
                onMouseUp={() => setIsRecording(false)}
                onMouseLeave={() => setIsRecording(false)}
                className={`p-3 rounded-full ml-2 ${
                  isRecording 
                    ? 'bg-red-500 text-white animate-pulse' 
                    : 'bg-primary-500 text-white'
                }`}
              >
                <Mic className="w-5 h-5" />
              </motion.button>
            ) : (
              <motion.button 
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSendMessage}
                className="p-3 rounded-full ml-2 bg-primary-500 text-white"
              >
                <Send className="w-5 h-5" />
              </motion.button>
            )}
          </div>
          
          {/* Recording Timer */}
          <AnimatePresence>
            {isRecording && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute top-0 left-0 right-0 -mt-8 flex items-center justify-center"
              >
                <div className="px-3 py-1 bg-red-500 text-white rounded-full text-sm flex items-center">
                  <span className="animate-pulse mr-2">●</span>
                  <span>{formatRecordingTime(recordingTime)}</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Emoji Picker */}
          <AnimatePresence>
            {showEmojiPicker && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="absolute bottom-full mb-2 right-0 z-10"
              >
                <EmojiPicker
                  onEmojiClick={handleEmojiClick}
                  width={300}
                  height={400}
                  searchDisabled
                />
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Attach Menu */}
          <AnimatePresence>
            {showAttachMenu && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="absolute bottom-full mb-2 right-0 bg-white dark:bg-secondary-800 rounded-xl shadow-lg border border-secondary-100 dark:border-secondary-700 p-2 z-10"
              >
                <div className="grid grid-cols-3 gap-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => fileInputRef.current?.click()}
                    className="flex flex-col items-center p-3 rounded-lg hover:bg-secondary-100 dark:hover:bg-secondary-700"
                  >
                    <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-1">
                      <Image className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <span className="text-xs text-secondary-700 dark:text-secondary-300">صورة</span>
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex flex-col items-center p-3 rounded-lg hover:bg-secondary-100 dark:hover:bg-secondary-700"
                  >
                    <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mb-1">
                      <Camera className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <span className="text-xs text-secondary-700 dark:text-secondary-300">كاميرا</span>
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex flex-col items-center p-3 rounded-lg hover:bg-secondary-100 dark:hover:bg-secondary-700"
                  >
                    <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-1">
                      <File className="w-5 h-5 text-green-600 dark:text-green-400" />
                    </div>
                    <span className="text-xs text-secondary-700 dark:text-secondary-300">ملف</span>
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex flex-col items-center p-3 rounded-lg hover:bg-secondary-100 dark:hover:bg-secondary-700"
                  >
                    <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mb-1">
                      <MapPin className="w-5 h-5 text-red-600 dark:text-red-400" />
                    </div>
                    <span className="text-xs text-secondary-700 dark:text-secondary-300">موقع</span>
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Hidden File Input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileUpload}
          />
        </div>
      </div>
      
      {/* Image Preview Modal */}
      <AnimatePresence>
        {showImagePreview && selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
            onClick={() => setShowImagePreview(false)}
          >
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="absolute top-4 right-4 p-2 bg-white/10 rounded-full"
              onClick={() => setShowImagePreview(false)}
            >
              <X className="w-6 h-6 text-white" />
            </motion.button>
            
            <motion.img
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              src={selectedImage}
              alt="Preview"
              className="max-w-full max-h-full object-contain"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ChatPage;