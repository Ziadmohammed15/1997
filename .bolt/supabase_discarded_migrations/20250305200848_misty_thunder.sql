/*
  # تحديث جدول الملفات الشخصية

  1. التغييرات
    - إضافة حقول جديدة للملف الشخصي:
      - `bio` - نبذة شخصية
      - `rating` - تقييم المستخدم
      - `reviews_count` - عدد التقييمات
      - `verified` - حالة التحقق من الحساب
      - `delivery_available` - توفر خدمة التوصيل

  2. الأمان
    - تحديث سياسات RLS للحقول الجديدة
*/

-- إضافة الحقول الجديدة
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS bio text,
ADD COLUMN IF NOT EXISTS rating numeric(3,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS reviews_count integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS verified boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS delivery_available boolean DEFAULT false;

-- تحديث سياسات RLS
CREATE POLICY "يمكن للجميع قراءة التقييمات والمراجعات"
  ON profiles
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "يمكن للمستخدم تحديث معلومات التوصيل الخاصة به"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);