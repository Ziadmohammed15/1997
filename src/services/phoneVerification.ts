import { supabase } from './supabaseClient';

/**
 * خدمة التحقق من رقم الهاتف
 */

// إرسال رمز التحقق
export const sendVerificationCode = async (phoneNumber: string): Promise<boolean> => {
  try {
    // التحقق من تنسيق رقم الهاتف
    if (!phoneNumber.match(/^\+[1-9]\d{1,14}$/)) {
      throw new Error('رقم هاتف غير صالح');
    }

    // إرسال طلب إلى خدمة Twilio
    const response = await fetch('/api/send-verification', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phoneNumber })
    });

    if (!response.ok) {
      throw new Error('فشل في إرسال رمز التحقق');
    }

    return true;
  } catch (error) {
    console.error('خطأ في إرسال رمز التحقق:', error);
    return false;
  }
};

// التحقق من صحة الرمز
export const verifyCode = async (phoneNumber: string, code: string): Promise<boolean> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('المستخدم غير مسجل الدخول');

    // التحقق من صحة الرمز
    const { data, error } = await supabase.rpc('verify_phone_code', {
      p_user_id: user.id,
      p_phone: phoneNumber,
      p_code: code
    });

    if (error) throw error;
    return data || false;
  } catch (error) {
    console.error('خطأ في التحقق من الرمز:', error);
    return false;
  }
};