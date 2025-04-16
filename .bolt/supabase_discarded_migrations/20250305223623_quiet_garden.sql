/*
  # إنشاء جداول المصادقة والملفات الشخصية

  1. الجداول الجديدة
    - `users`: جدول المستخدمين الأساسي
    - `profiles`: جدول الملفات الشخصية
    - `phone_verifications`: جدول التحقق من أرقام الهواتف

  2. الأمان
    - تفعيل RLS على جميع الجداول
    - إضافة سياسات الأمان المناسبة
*/

-- إنشاء جدول الملفات الشخصية
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name text,
  email text,
  phone text,
  phone_verified boolean DEFAULT false,
  avatar_url text,
  user_type text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- تفعيل RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- إنشاء سياسات الأمان
CREATE POLICY "يمكن للمستخدمين قراءة ملفاتهم الشخصية"
  ON profiles
  FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "يمكن للمستخدمين تحديث ملفاتهم الشخصية"
  ON profiles
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- إنشاء جدول التحقق من أرقام الهواتف
CREATE TABLE IF NOT EXISTS phone_verifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  phone text NOT NULL,
  code text NOT NULL,
  expires_at timestamptz NOT NULL,
  verified boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- تفعيل RLS
ALTER TABLE phone_verifications ENABLE ROW LEVEL SECURITY;

-- إنشاء سياسات الأمان
CREATE POLICY "يمكن للمستخدمين الوصول إلى سجلات التحقق الخاصة بهم"
  ON phone_verifications
  FOR ALL
  USING (auth.uid() = user_id);

-- إنشاء دالة للتحقق من صحة رمز التحقق
CREATE OR REPLACE FUNCTION verify_phone_code(
  p_user_id uuid,
  p_phone text,
  p_code text
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_verification_record phone_verifications;
BEGIN
  -- البحث عن سجل التحقق
  SELECT *
  INTO v_verification_record
  FROM phone_verifications
  WHERE user_id = p_user_id
    AND phone = p_phone
    AND code = p_code
    AND NOT verified
    AND expires_at > now();

  -- إذا وجد السجل، قم بتحديث حالة التحقق
  IF FOUND THEN
    UPDATE phone_verifications
    SET verified = true
    WHERE id = v_verification_record.id;

    UPDATE profiles
    SET phone_verified = true
    WHERE id = p_user_id;

    RETURN true;
  END IF;

  RETURN false;
END;
$$;