/*
  # إعداد نظام التحقق من رقم الهاتف
  
  1. الجداول الجديدة
    - `phone_verification_codes`: جدول رموز التحقق
  
  2. الوظائف
    - `verify_phone_code`: وظيفة التحقق من صحة الرمز
    - `update_phone_verified`: وظيفة تحديث حالة التحقق
  
  3. الأمان
    - تفعيل RLS على الجداول
    - إضافة سياسات الأمان المناسبة
*/

-- إنشاء جدول رموز التحقق
CREATE TABLE phone_verification_codes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  phone text NOT NULL,
  code text NOT NULL,
  attempts int DEFAULT 0,
  verified boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  expires_at timestamptz DEFAULT (now() + interval '10 minutes')
);

-- إضافة عمود للتحقق من الهاتف في جدول الملفات الشخصية
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS phone_verified boolean DEFAULT false;

-- تفعيل RLS
ALTER TABLE phone_verification_codes ENABLE ROW LEVEL SECURITY;

-- سياسات الأمان
CREATE POLICY "يمكن للمستخدمين إنشاء رموز التحقق الخاصة بهم"
  ON phone_verification_codes FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "يمكن للمستخدمين قراءة رموز التحقق الخاصة بهم"
  ON phone_verification_codes FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- وظيفة التحقق من صحة الرمز
CREATE OR REPLACE FUNCTION verify_phone_code(
  p_user_id uuid,
  p_phone text,
  p_code text
) RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_code_record phone_verification_codes%ROWTYPE;
BEGIN
  -- البحث عن آخر رمز تحقق للمستخدم ورقم الهاتف
  SELECT * INTO v_code_record
  FROM phone_verification_codes
  WHERE user_id = p_user_id 
    AND phone = p_phone
    AND verified = false
    AND expires_at > now()
  ORDER BY created_at DESC
  LIMIT 1;
  
  -- التحقق من وجود الرمز
  IF v_code_record IS NULL THEN
    RETURN false;
  END IF;
  
  -- زيادة عدد المحاولات
  UPDATE phone_verification_codes
  SET attempts = attempts + 1
  WHERE id = v_code_record.id;
  
  -- التحقق من عدد المحاولات
  IF v_code_record.attempts >= 3 THEN
    RETURN false;
  END IF;
  
  -- التحقق من صحة الرمز
  IF v_code_record.code = p_code THEN
    -- تحديث حالة التحقق
    UPDATE phone_verification_codes
    SET verified = true
    WHERE id = v_code_record.id;
    
    -- تحديث حالة التحقق في الملف الشخصي
    UPDATE profiles
    SET phone_verified = true,
        phone = p_phone
    WHERE id = p_user_id;
    
    RETURN true;
  END IF;
  
  RETURN false;
END;
$$;