import { User } from '@supabase/supabase-js';
import RecordRTC from 'recordrtc';

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  type: 'text' | 'image' | 'voice' | 'location';
  media_url?: string;
  created_at: string;
  read: boolean;
}

export interface Conversation {
  id: string;
  created_at: string;
  service_id: number | null;
  last_message: string | null;
  last_message_time: string | null;
  unread_count: number;
  participants: {
    id: string;
    name: string;
    avatar_url: string | null;
    online: boolean;
  }[];
}

export interface ChatContextType {
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