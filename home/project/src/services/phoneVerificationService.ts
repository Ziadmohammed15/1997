import axios from 'axios';

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

    // إرسال طلب إلى الخادم لإرسال رمز التحقق
    const response = await axios.post('/api/verify/send', { phoneNumber: formattedPhone });

    if (response.data.success) {
      console.log(`تم إرسال رمز التحقق إلى الرقم ${formattedPhone}`);
      return { success: true };
    } else {
      return { success: false, error: response.data.error || 'فشل في إرسال رمز التحقق' };
    }
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
    // التحقق من تنسيق رقم الهاتف
    let formattedPhone = phoneNumber;
    if (!formattedPhone.startsWith('+')) {
      formattedPhone = `+${formattedPhone}`;
    }

    // إرسال طلب إلى الخادم للتحقق من الرمز
    const response = await axios.post('/api/verify/check', { phoneNumber: formattedPhone, code });

    if (response.data.success) {
      return { success: true };
    } else {
      return { 
        success: false, 
        error: response.data.error || 'رمز التحقق غير صحيح'
      };
    }
  } catch (error) {
    console.error('خطأ في التحقق من الرمز:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'حدث خطأ غير معروف'
    };
  }
};