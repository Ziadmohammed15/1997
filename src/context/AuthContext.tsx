import React, { createContext, useState, useEffect, useContext } from 'react';
import { supabase } from '../services/supabaseClient';
import { Session, User } from '@supabase/supabase-js';
import { sendVerificationCode, verifyCode } from '../services/twilioService'; // تأكد من استيراد الخدمة الصحيحة

interface AuthContextType {
  session: Session | null;
  user: User | null;
  loading: boolean;
  phoneVerified: boolean;
  signInWithPhone: (phone: string, password: string) => Promise<{ error: any }>;
  signUp: (phone: string, userData: any) => Promise<{ error: any, user: any }>;
  signOut: () => Promise<void>;
  updateProfile: (data: any) => Promise<{ error: any }>;
  setPhoneVerified: (verified: boolean) => void;
  sendPhoneVerification: (phone: string) => Promise<{ success: boolean; error?: string }>;
  verifyPhoneCode: (phone: string, code: string) => Promise<{ success: boolean; error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Generate a valid UUID for mock user
const MOCK_USER_ID = '123e4567-e89b-12d3-a456-426614174000';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser ] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [phoneVerified, setPhoneVerified] = useState(false);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser (session?.user ?? null);
      
      if (session?.user) {
        checkPhoneVerified(session.user.id);
      }
      
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      setUser (session?.user ?? null);
      
      if (session?.user) {
        checkPhoneVerified(session.user.id);
      }
      
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);
  
  const checkPhoneVerified = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('phone_verified')
        .eq('id', userId)
        .single();
        
      if (error) throw error;
      
      setPhoneVerified(data?.phone_verified || false);
    } catch (error) {
      console.error('Error checking phone verification status:', error);
    }
  };

  const signInWithPhone = async (phone: string, password: string) => {
    try {
      // For demo purposes, simulate successful login
      const mockUser  = {
        id: MOCK_USER_ID,
        phone: phone,
        user_metadata: {
          phone_verified: true
        }
      };
      
      setUser (mockUser  as User);
      setSession({ user: mockUser  } as Session);
      setPhoneVerified(true);

      // Create or update profile after successful login
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: mockUser .id,
          phone: phone,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'id'
        });

      if (profileError) throw profileError;
      
      return { error: null };
    } catch (error) {
      console.error('Sign in error:', error);
      return { error };
    }
  };

  const signUp = async (phone: string, userData: any) => {
    try {
      // For demo purposes, simulate successful registration
      const mockUser  = {
        id: MOCK_USER_ID,
        phone: phone,
        user_metadata: {
          name: userData.name,
          phone_verified: userData.phone_verified || false
        }
      };
      
      setUser (mockUser  as User);
      setSession({ user: mockUser  } as Session);
      setPhoneVerified(userData.phone_verified || false);
      
      // Create initial profile
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: mockUser .id,
          name: userData.name,
          phone: phone,
          email: userData.email,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'id'
        });

      if (profileError) throw profileError;
      
      return { error: null, user: mockUser  };
    } catch (error) {
      console.error('Sign up error:', error);
      return { error, user: null };
    }
  };

  const signOut = async () => {
    try {
      setUser (null);
      setSession(null);
      setPhoneVerified(false);
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const updateProfile = async (data: any) => {
    if (!user) return { error: new Error('User  not authenticated') };

    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          ...data,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'id'
        });

      if (error) throw error;

      setUser (prev => ({
        ...prev!,
        user_metadata: {
          ...prev!.user_metadata,
          ...data
        }
      }));
      
      return { error: null };
    } catch (error) {
      console.error('Update profile error:', error);
      return { error };
    }
  };
  
  const sendPhoneVerification = async (phone: string) => {
    if (!user) return { success: false, error: 'يجب تسجيل الدخول أولاً' };
    return await sendVerificationCode(phone);
  };
  
  const verifyPhoneCode = async (phone: string, code: string) => {
    if (!user) return { success: false, error: 'يجب تسجيل الدخول أولاً' };
    
    const result = await verifyCode(phone, code);
    
    if (result.success) {
      // Update profile to mark phone as verified
      await supabase
        .from('profiles')
        .update({ phone_verified: true })
        .eq('id', user.id);
      
      setPhoneVerified(true);
    }
    
    return result;
  };

  return (
    <AuthContext.Provider value={{ 
      session, 
      user, 
      loading,
      phoneVerified,
      signInWithPhone,
      signUp, 
      signOut, 
      updateProfile,
      setPhoneVerified,
      sendPhoneVerification,
      verifyPhoneCode
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};