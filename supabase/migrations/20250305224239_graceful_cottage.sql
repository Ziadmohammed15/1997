/*
  # إنشاء النظام الأساسي لقاعدة البيانات
  
  1. الجداول الجديدة
    - `services`: جدول الخدمات
    - `delivery_options`: جدول خيارات التوصيل
    - `service_areas`: جدول مناطق تغطية الخدمة
    - `service_features`: جدول مميزات الخدمة
    - `providers`: جدول مقدمي الخدمات
  
  2. الأمان
    - تفعيل RLS على جميع الجداول
    - إضافة سياسات الأمان المناسبة
*/

-- إنشاء جدول مقدمي الخدمات
CREATE TABLE providers (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  phone text,
  email text,
  avatar_url text,
  rating numeric(3,2) DEFAULT 0,
  verified boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- إنشاء جدول الخدمات
CREATE TABLE services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id uuid REFERENCES providers(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text NOT NULL,
  price numeric(10,2) NOT NULL,
  category text NOT NULL,
  subcategory text,
  location text NOT NULL,
  image_url text,
  rating numeric(3,2) DEFAULT 0,
  status text DEFAULT 'active',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- إنشاء جدول خيارات التوصيل
CREATE TABLE delivery_options (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id uuid REFERENCES services(id) ON DELETE CASCADE,
  type text NOT NULL CHECK (type IN ('free', 'paid', 'none', 'company')),
  price numeric(10,2),
  company_name text,
  estimated_time text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT valid_delivery_price CHECK (
    (type = 'paid' AND price IS NOT NULL) OR
    (type != 'paid' AND price IS NULL)
  ),
  CONSTRAINT valid_company_name CHECK (
    (type = 'company' AND company_name IS NOT NULL) OR
    (type != 'company' AND company_name IS NULL)
  )
);

-- إنشاء جدول مناطق التغطية
CREATE TABLE service_areas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id uuid REFERENCES services(id) ON DELETE CASCADE,
  area_name text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- إنشاء جدول مميزات الخدمة
CREATE TABLE service_features (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id uuid REFERENCES services(id) ON DELETE CASCADE,
  feature text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- تفعيل RLS
ALTER TABLE providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE delivery_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_areas ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_features ENABLE ROW LEVEL SECURITY;

-- سياسات الأمان لجدول مقدمي الخدمات
CREATE POLICY "يمكن للمستخدمين قراءة جميع مقدمي الخدمات"
  ON providers FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "يمكن لمقدمي الخدمات تحديث بياناتهم"
  ON providers FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- سياسات الأمان لجدول الخدمات
CREATE POLICY "يمكن للمستخدمين قراءة جميع الخدمات النشطة"
  ON services FOR SELECT
  TO authenticated
  USING (status = 'active' OR provider_id = auth.uid());

CREATE POLICY "يمكن لمقدمي الخدمات إضافة خدمات جديدة"
  ON services FOR INSERT
  TO authenticated
  WITH CHECK (provider_id = auth.uid());

CREATE POLICY "يمكن لمقدمي الخدمات تحديث خدماتهم"
  ON services FOR UPDATE
  TO authenticated
  USING (provider_id = auth.uid())
  WITH CHECK (provider_id = auth.uid());

CREATE POLICY "يمكن لمقدمي الخدمات حذف خدماتهم"
  ON services FOR DELETE
  TO authenticated
  USING (provider_id = auth.uid());

-- سياسات الأمان لجدول خيارات التوصيل
CREATE POLICY "يمكن للمستخدمين قراءة خيارات التوصيل"
  ON delivery_options FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "يمكن لمقدمي الخدمات إدارة خيارات التوصيل"
  ON delivery_options FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM services
    WHERE services.id = delivery_options.service_id
    AND services.provider_id = auth.uid()
  ));

-- سياسات الأمان لجدول مناطق التغطية
CREATE POLICY "يمكن للمستخدمين قراءة مناطق التغطية"
  ON service_areas FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "يمكن لمقدمي الخدمات إدارة مناطق التغطية"
  ON service_areas FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM services
    WHERE services.id = service_areas.service_id
    AND services.provider_id = auth.uid()
  ));

-- سياسات الأمان لجدول مميزات الخدمة
CREATE POLICY "يمكن للمستخدمين قراءة مميزات الخدمة"
  ON service_features FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "يمكن لمقدمي الخدمات إدارة مميزات الخدمة"
  ON service_features FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM services
    WHERE services.id = service_features.service_id
    AND services.provider_id = auth.uid()
  ));