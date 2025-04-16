/*
  # Fix RLS Policies

  1. تحديث السياسات
    - إعادة تعيين سياسات الخدمات
    - تحسين صلاحيات التخزين
    - إضافة فحوصات إضافية للأمان

  2. الأمان
    - التأكد من ملكية الخدمات
    - حماية عمليات التعديل والحذف
    - تحسين صلاحيات الوصول للملفات
*/

-- حذف السياسات القديمة
DO $$ 
BEGIN
  -- حذف سياسات الخدمات
  DROP POLICY IF EXISTS "Services are viewable by everyone" ON services;
  DROP POLICY IF EXISTS "Providers can create their own services" ON services;
  DROP POLICY IF EXISTS "Providers can update their own services" ON services;
  DROP POLICY IF EXISTS "Providers can delete their own services" ON services;
  
  -- حذف سياسات التخزين
  DROP POLICY IF EXISTS "Storage is accessible by everyone" ON storage.objects;
  DROP POLICY IF EXISTS "Authenticated users can upload files" ON storage.objects;
  DROP POLICY IF EXISTS "Users can update their own files" ON storage.objects;
  DROP POLICY IF EXISTS "Users can delete their own files" ON storage.objects;
END $$;

-- إنشاء السياسات الجديدة للخدمات
CREATE POLICY "Services are viewable by everyone"
ON services FOR SELECT
TO public
USING (
  status = 'active' OR 
  auth.uid() = provider_id
);

CREATE POLICY "Providers can create their own services"
ON services FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() = provider_id AND
  auth.role() = 'authenticated'
);

CREATE POLICY "Providers can update their own services"
ON services FOR UPDATE
TO authenticated
USING (auth.uid() = provider_id)
WITH CHECK (auth.uid() = provider_id);

CREATE POLICY "Providers can delete their own services"
ON services FOR DELETE
TO authenticated
USING (auth.uid() = provider_id);

-- إنشاء السياسات الجديدة للتخزين
CREATE POLICY "Storage is accessible by everyone"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'services');

CREATE POLICY "Authenticated users can upload files"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'services' AND
  auth.role() = 'authenticated'
);

CREATE POLICY "Users can update their own files"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'services' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users can delete their own files"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'services' AND
  (storage.foldername(name))[1] = auth.uid()::text
);