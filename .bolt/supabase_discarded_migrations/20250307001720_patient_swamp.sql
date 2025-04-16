/*
  # إضافة سياسات الأمان للخدمات

  1. السياسات
    - تمكين مقدمي الخدمات من إضافة خدماتهم
    - السماح بتحميل الصور في مجلد services
    - تمكين إضافة مميزات الخدمة
    - تمكين إضافة خيارات التوصيل
    - تمكين إضافة مناطق التغطية

  2. الأمان
    - تفعيل RLS على جميع الجداول
    - ربط الخدمات بمقدميها
    - التحقق من الهوية عند الإضافة
*/

-- تمكين RLS على جدول الخدمات
ALTER TABLE services ENABLE ROW LEVEL SECURITY;

-- سياسة إضافة الخدمات
CREATE POLICY "Users can insert their own services"
ON services
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = provider_id);

-- سياسة تحديث الخدمات
CREATE POLICY "Users can update their own services"
ON services
FOR UPDATE
TO authenticated
USING (auth.uid() = provider_id)
WITH CHECK (auth.uid() = provider_id);

-- سياسة عرض الخدمات
CREATE POLICY "Anyone can view active services"
ON services
FOR SELECT
TO public
USING (status = 'active' OR auth.uid() = provider_id);

-- تمكين RLS على جدول مميزات الخدمة
ALTER TABLE service_features ENABLE ROW LEVEL SECURITY;

-- سياسة إضافة مميزات الخدمة
CREATE POLICY "Users can add features to their services"
ON service_features
FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM services
    WHERE id = service_features.service_id
    AND provider_id = auth.uid()
  )
);

-- تمكين RLS على جدول خيارات التوصيل
ALTER TABLE delivery_options ENABLE ROW LEVEL SECURITY;

-- سياسة إضافة خيارات التوصيل
CREATE POLICY "Users can add delivery options to their services"
ON delivery_options
FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM services
    WHERE id = delivery_options.service_id
    AND provider_id = auth.uid()
  )
);

-- تمكين RLS على جدول مناطق التغطية
ALTER TABLE service_areas ENABLE ROW LEVEL SECURITY;

-- سياسة إضافة مناطق التغطية
CREATE POLICY "Users can add service areas to their services"
ON service_areas
FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM services
    WHERE id = service_areas.service_id
    AND provider_id = auth.uid()
  )
);

-- تمكين تخزين الملفات في مجلد services
INSERT INTO storage.buckets (id, name, public) 
VALUES ('services', 'services', true)
ON CONFLICT (id) DO NOTHING;

-- سياسة رفع الصور في مجلد services
CREATE POLICY "Anyone can upload images"
ON storage.objects
FOR INSERT
TO public
WITH CHECK (bucket_id = 'services');

-- سياسة عرض الصور من مجلد services
CREATE POLICY "Anyone can view images"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'services');