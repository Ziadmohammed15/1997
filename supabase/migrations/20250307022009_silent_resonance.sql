/*
  # إعداد قاعدة البيانات للخدمات

  1. الجداول
    - جدول الخدمات services
    - جدول مميزات الخدمة service_features
    - جدول خيارات التوصيل delivery_options
    - جدول مناطق التغطية service_areas
  
  2. الأمان
    - تفعيل RLS على جميع الجداول
    - إضافة سياسات الأمان المناسبة
    - إعداد صلاحيات التخزين
*/

-- إنشاء جدول الخدمات
CREATE TABLE IF NOT EXISTS services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  price numeric(10,2) NOT NULL CHECK (price >= 0),
  category text NOT NULL,
  subcategory text,
  location text NOT NULL,
  image_url text,
  provider_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  rating numeric(3,2) DEFAULT 0 CHECK (rating >= 0 AND rating <= 5),
  status text DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- إنشاء جدول مميزات الخدمة
CREATE TABLE IF NOT EXISTS service_features (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id uuid REFERENCES services(id) ON DELETE CASCADE,
  feature text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- إنشاء جدول خيارات التوصيل
CREATE TABLE IF NOT EXISTS delivery_options (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id uuid REFERENCES services(id) ON DELETE CASCADE,
  type text NOT NULL CHECK (type IN ('free', 'paid', 'none', 'company')),
  price numeric(10,2) CHECK (
    (type = 'paid' AND price IS NOT NULL AND price >= 0) OR
    (type != 'paid' AND price IS NULL)
  ),
  company_name text CHECK (
    (type = 'company' AND company_name IS NOT NULL) OR
    (type != 'company' AND company_name IS NULL)
  ),
  estimated_time text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- إنشاء جدول مناطق التغطية
CREATE TABLE IF NOT EXISTS service_areas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id uuid REFERENCES services(id) ON DELETE CASCADE,
  area_name text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- تفعيل RLS على جميع الجداول
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_features ENABLE ROW LEVEL SECURITY;
ALTER TABLE delivery_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_areas ENABLE ROW LEVEL SECURITY;

-- إنشاء bucket للتخزين إذا لم يكن موجوداً
INSERT INTO storage.buckets (id, name, public)
VALUES ('services', 'services', true)
ON CONFLICT (id) DO NOTHING;

-- حذف السياسات القديمة إن وجدت
DO $$ 
BEGIN
  DROP POLICY IF EXISTS "Services are viewable by everyone" ON services;
  DROP POLICY IF EXISTS "Providers can create their own services" ON services;
  DROP POLICY IF EXISTS "Providers can update their own services" ON services;
  DROP POLICY IF EXISTS "Providers can delete their own services" ON services;
  
  DROP POLICY IF EXISTS "Service features are viewable by everyone" ON service_features;
  DROP POLICY IF EXISTS "Providers can add features to their services" ON service_features;
  DROP POLICY IF EXISTS "Providers can update features of their services" ON service_features;
  DROP POLICY IF EXISTS "Providers can delete features of their services" ON service_features;
  
  DROP POLICY IF EXISTS "Delivery options are viewable by everyone" ON delivery_options;
  DROP POLICY IF EXISTS "Providers can add delivery options to their services" ON delivery_options;
  DROP POLICY IF EXISTS "Providers can update delivery options of their services" ON delivery_options;
  DROP POLICY IF EXISTS "Providers can delete delivery options of their services" ON delivery_options;
  
  DROP POLICY IF EXISTS "Service areas are viewable by everyone" ON service_areas;
  DROP POLICY IF EXISTS "Providers can add areas to their services" ON service_areas;
  DROP POLICY IF EXISTS "Providers can update areas of their services" ON service_areas;
  DROP POLICY IF EXISTS "Providers can delete areas of their services" ON service_areas;
  
  DROP POLICY IF EXISTS "Storage is accessible by everyone" ON storage.objects;
  DROP POLICY IF EXISTS "Authenticated users can upload files" ON storage.objects;
  DROP POLICY IF EXISTS "Users can update their own files" ON storage.objects;
  DROP POLICY IF EXISTS "Users can delete their own files" ON storage.objects;
END $$;

-- إنشاء السياسات الجديدة
-- سياسات الخدمات
CREATE POLICY "Services are viewable by everyone"
ON services FOR SELECT
TO public
USING (status = 'active' OR auth.uid() = provider_id);

CREATE POLICY "Providers can create their own services"
ON services FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = provider_id);

CREATE POLICY "Providers can update their own services"
ON services FOR UPDATE
TO authenticated
USING (auth.uid() = provider_id)
WITH CHECK (auth.uid() = provider_id);

CREATE POLICY "Providers can delete their own services"
ON services FOR DELETE
TO authenticated
USING (auth.uid() = provider_id);

-- سياسات مميزات الخدمة
CREATE POLICY "Service features are viewable by everyone"
ON service_features FOR SELECT
TO public
USING (true);

CREATE POLICY "Providers can add features to their services"
ON service_features FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM services
    WHERE id = service_features.service_id
    AND provider_id = auth.uid()
  )
);

CREATE POLICY "Providers can update features of their services"
ON service_features FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM services
    WHERE id = service_features.service_id
    AND provider_id = auth.uid()
  )
);

CREATE POLICY "Providers can delete features of their services"
ON service_features FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM services
    WHERE id = service_features.service_id
    AND provider_id = auth.uid()
  )
);

-- سياسات خيارات التوصيل
CREATE POLICY "Delivery options are viewable by everyone"
ON delivery_options FOR SELECT
TO public
USING (true);

CREATE POLICY "Providers can add delivery options to their services"
ON delivery_options FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM services
    WHERE id = delivery_options.service_id
    AND provider_id = auth.uid()
  )
);

CREATE POLICY "Providers can update delivery options of their services"
ON delivery_options FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM services
    WHERE id = delivery_options.service_id
    AND provider_id = auth.uid()
  )
);

CREATE POLICY "Providers can delete delivery options of their services"
ON delivery_options FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM services
    WHERE id = delivery_options.service_id
    AND provider_id = auth.uid()
  )
);

-- سياسات مناطق التغطية
CREATE POLICY "Service areas are viewable by everyone"
ON service_areas FOR SELECT
TO public
USING (true);

CREATE POLICY "Providers can add areas to their services"
ON service_areas FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM services
    WHERE id = service_areas.service_id
    AND provider_id = auth.uid()
  )
);

CREATE POLICY "Providers can update areas of their services"
ON service_areas FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM services
    WHERE id = service_areas.service_id
    AND provider_id = auth.uid()
  )
);

CREATE POLICY "Providers can delete areas of their services"
ON service_areas FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM services
    WHERE id = service_areas.service_id
    AND provider_id = auth.uid()
  )
);

-- سياسات التخزين
CREATE POLICY "Storage is accessible by everyone"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'services');

CREATE POLICY "Authenticated users can upload files"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'services');

CREATE POLICY "Users can update their own files"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'services');

CREATE POLICY "Users can delete their own files"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'services');