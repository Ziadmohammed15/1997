import { supabase } from './supabaseClient';
import twilio from 'twilio';

// إعداد عميل Twilio باستخدام معلومات الاعتماد الخاصة بك
const accountSid = process.env.TWILIO_ACCOUNT_SID; // SID الخاص بحساب Twilio
const authToken = process.env.TWILIO_AUTH_TOKEN; // توكن المصادقة
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER; // رقم هاتف Twilio
const client = twilio(accountSid, authToken);

/**
 * خدمة التحقق من رقم الهاتف
 */

// إرسال رمز التحقق
export const sendVerificationCode = async (phoneNumber: string): Promise<{ success: boolean; error?: string }> => {
  try {
    // التحقق من تنسيق رقم الهاتف
    let formattedPhone = phoneNumber;
    if (!formattedPhone.startsWith('+')) {
      formattedPhone = `+${formattedPhone}`;
    }

    // إرسال رسالة نصية عبر Twilio
    await client.messages.create({
      body: `رمز التحقق الخاص بك هو: 123456`, // يمكنك استخدام رمز عشوائي هنا
      from: twilioPhoneNumber,
      to: formattedPhone,
    });

    console.log(`تم إرسال رمز التحقق إلى ${formattedPhone}`);
    return { success: true };
  } catch (error) {
    console.error('خطأ في إرسال رمز التحقق:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'حدث خطأ غير معروف'
    };
  }
};

// التحقق من صحة الرمز
export const verifyCode = async (phoneNumber: string, code: string): Promise<{ success: boolean; error?: string }> => {
  try {
    // في هذه الحالة، يجب عليك تخزين الرمز المرسل والتحقق منه
    // هنا نقوم فقط بالتحقق من الرمز الثابت 123456
    const isValid = code === '123456'; // يجب استبدال هذا بالتحقق من الرمز المخزن

    if (!isValid) {
      return { 
        success: false, 
        error: 'رمز التحقق غير صحيح. الرمز الصحيح هو 123456'
      };
    }

    return { success: true };
  } catch (error) {
    console.error('خطأ في التحقق من الرمز:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'حدث خطأ غير معروف'
    };
  }
};