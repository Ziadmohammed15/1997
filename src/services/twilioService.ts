import { Client } from '@twilio/conversations';

const API_BASE_URL = import.meta.env.VITE_SUPABASE_URL;

export const sendVerificationCode = async (phoneNumber: string): Promise<{ 
  success: boolean, 
  error?: string 
}> => {
  try {
    const response = await fetch(`${API_BASE_URL}/functions/v1/send-verification-code`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
      },
      body: JSON.stringify({ phoneNumber })
    });

    const data = await response.json();
    return {
      success: data.success,
      error: data.error
    };
  } catch (error) {
    console.error('Error sending verification:', error);
    return {
      success: false,
      error: 'فشل إرسال رمز التحقق'
    };
  }
};

export const verifyCode = async (
  phoneNumber: string, 
  code: string
): Promise<{ 
  success: boolean, 
  error?: string 
}> => {
  try {
    const response = await fetch(`${API_BASE_URL}/functions/v1/verify-phone-code`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
      },
      body: JSON.stringify({ phoneNumber, code })
    });

    const data = await response.json();
    return {
      success: data.success,
      error: data.error
    };
  } catch (error) {
    console.error('Error verifying code:', error);
    return {
      success: false,
      error: 'فشل التحقق من الرمز'
    };
  }
};

// Types
interface TwilioService {
  sendVerificationCode: (phoneNumber: string) => Promise<{ success: boolean, error?: string }>;
  verifyCode: (phoneNumber: string, code: string) => Promise<{ success: boolean, error?: string }>;
}

export default {
  sendVerificationCode,
  verifyCode
} as TwilioService;