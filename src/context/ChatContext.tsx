import React, { createContext, useState, useEffect, useContext } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useAuth } from './AuthContext';
import { supabase } from '../services/supabaseClient';
import { Message, Conversation } from '../types/chat';
import { uploadImage, startVoiceRecording, stopVoiceRecording } from '../services/chatMediaService';
import RecordRTC from 'recordrtc';

interface ChatContextType {
  conversations: Conversation[];
  currentConversation: string | null;
  messages: Message[];
  loadingConversations: boolean;
  loadingMessages: boolean;
  voiceRecorder: RecordRTC | null;
  setCurrentConversation: (id: string | null) => void;
  sendMessage: (content: string, type?: Message['type'], mediaUrl?: string) => Promise<void>;
  createConversation: (participantId: string, serviceId?: number) => Promise<string | null>;
  markAsRead: (conversationId: string) => Promise<void>;
  startRecording: () => Promise<void>;
  stopRecording: () => Promise<string | null>;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversation, setCurrentConversation] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loadingConversations, setLoadingConversations] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [voiceRecorder, setVoiceRecorder] = useState<RecordRTC | null>(null);

  // Load conversations
  useEffect(() => {
    if (!user) {
      setConversations([]);
      setLoadingConversations(false);
      return;
    }

    const loadConversations = async () => {
      try {
        const { data, error } = await supabase
          .from('conversations')
          .select(`
            *,
            participants:conversation_participants(
              user:profiles(*)
            )
          `)
          .order('updated_at', { ascending: false });

        if (error) throw error;

        const formattedConversations: Conversation[] = data.map(conv => ({
          id: conv.id,
          created_at: conv.created_at,
          service_id: conv.service_id,
          last_message: conv.last_message,
          last_message_time: conv.last_message_time,
          unread_count: conv.participants.find(p => p.user.id === user.id)?.unread_count || 0,
          participants: conv.participants.map(p => ({
            id: p.user.id,
            name: p.user.name,
            avatar_url: p.user.avatar_url,
            online: p.user.online
          }))
        }));

        setConversations(formattedConversations);
      } catch (error) {
        console.error('Error loading conversations:', error);
      } finally {
        setLoadingConversations(false);
      }
    };

    loadConversations();

    // Subscribe to new messages
    const messagesSubscription = supabase
      .channel('messages')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages'
      }, payload => {
        const newMessage = payload.new as Message;
        
        // Update messages if in current conversation
        if (currentConversation === newMessage.conversation_id) {
          setMessages(prev => [...prev, newMessage]);
        }
        
        // Update conversation last message
        setConversations(prev => 
          prev.map(conv => 
            conv.id === newMessage.conversation_id
              ? {
                  ...conv,
                  last_message: newMessage.content,
                  last_message_time: newMessage.created_at,
                  unread_count: newMessage.sender_id !== user.id 
                    ? conv.unread_count + 1 
                    : conv.unread_count
                }
              : conv
          )
        );
      })
      .subscribe();

    return () => {
      messagesSubscription.unsubscribe();
    };
  }, [user]);

  // Load messages for current conversation
  useEffect(() => {
    if (!currentConversation || !user) {
      setMessages([]);
      return;
    }

    const loadMessages = async () => {
      setLoadingMessages(true);
      try {
        const { data, error } = await supabase
          .from('messages')
          .select('*')
          .eq('conversation_id', currentConversation)
          .order('created_at', { ascending: true });

        if (error) throw error;
        setMessages(data);

        // Mark messages as read
        await markAsRead(currentConversation);
      } catch (error) {
        console.error('Error loading messages:', error);
      } finally {
        setLoadingMessages(false);
      }
    };

    loadMessages();

    // Subscribe to new messages in this conversation
    const subscription = supabase
      .channel(`conversation:${currentConversation}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `conversation_id=eq.${currentConversation}`
      }, payload => {
        const newMessage = payload.new as Message;
        setMessages(prev => [...prev, newMessage]);
        
        // Mark message as read if from other user
        if (newMessage.sender_id !== user.id) {
          markAsRead(currentConversation);
        }
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [currentConversation, user]);

  const sendMessage = async (
    content: string,
    type: Message['type'] = 'text',
    mediaUrl?: string
  ) => {
    if (!user || !currentConversation || !content.trim()) return;

    try {
      const { error } = await supabase
        .from('messages')
        .insert({
          conversation_id: currentConversation,
          sender_id: user.id,
          content,
          type,
          media_url: mediaUrl
        });

      if (error) throw error;
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const createConversation = async (
    participantId: string,
    serviceId?: number
  ): Promise<string | null> => {
    if (!user) return null;

    try {
      // Check if conversation already exists
      const { data: existingConv } = await supabase
        .from('conversations')
        .select('id')
        .eq('service_id', serviceId)
        .contains('participants', [{ user_id: user.id }, { user_id: participantId }]);

      if (existingConv?.[0]) {
        return existingConv[0].id;
      }

      // Create new conversation
      const { data: newConv, error: convError } = await supabase
        .from('conversations')
        .insert({
          service_id: serviceId,
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      if (convError) throw convError;

      // Add participants
      const { error: partError } = await supabase
        .from('conversation_participants')
        .insert([
          { conversation_id: newConv.id, user_id: user.id },
          { conversation_id: newConv.id, user_id: participantId }
        ]);

      if (partError) throw partError;

      return newConv.id;
    } catch (error) {
      console.error('Error creating conversation:', error);
      return null;
    }
  };

  const markAsRead = async (conversationId: string) => {
    if (!user) return;

    try {
      // Mark messages as read
      const { error: msgError } = await supabase
        .from('messages')
        .update({ read: true })
        .eq('conversation_id', conversationId)
        .neq('sender_id', user.id);

      if (msgError) throw msgError;

      // Reset unread count
      const { error: countError } = await supabase
        .from('conversation_participants')
        .update({ unread_count: 0 })
        .eq('conversation_id', conversationId)
        .eq('user_id', user.id);

      if (countError) throw countError;

      // Update local state
      setConversations(prev =>
        prev.map(conv =>
          conv.id === conversationId
            ? { ...conv, unread_count: 0 }
            : conv
        )
      );
    } catch (error) {
      console.error('Error marking messages as read:', error);
    }
  };

  const startRecording = async () => {
    try {
      const recorder = await startVoiceRecording();
      setVoiceRecorder(recorder);
    } catch (error) {
      console.error('Error starting recording:', error);
    }
  };

  const stopRecording = async () => {
    if (!voiceRecorder || !user) return null;

    try {
      const audioUrl = await stopVoiceRecording(voiceRecorder, user.id);
      setVoiceRecorder(null);
      return audioUrl;
    } catch (error) {
      console.error('Error stopping recording:', error);
      return null;
    }
  };

  return (
    <ChatContext.Provider value={{
      conversations,
      currentConversation,
      messages,
      loadingConversations,
      loadingMessages,
      voiceRecorder,
      setCurrentConversation,
      sendMessage,
      createConversation,
      markAsRead,
      startRecording,
      stopRecording
    }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};