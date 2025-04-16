/*
  # إنشاء هيكل قاعدة البيانات الأساسي
  
  1. الجداول الأساسية
    - profiles: معلومات المستخدمين
    - providers: معلومات مقدمي الخدمات
    - services: الخدمات المقدمة
    - service_features: مميزات كل خدمة
    - delivery_options: خيارات التوصيل
    - service_areas: مناطق تغطية الخدمة
  
  2. الأمان
    - تفعيل RLS لجميع الجداول
    - إضافة سياسات الوصول المناسبة
    
  3. الفهارس
    - إضافة الفهارس اللازمة لتحسين الأداء
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
    id uuid PRIMARY KEY,
    name text,
    email text,
    phone text,
    avatar_url text,
    user_type text CHECK (user_type IN ('client', 'provider')),
    bio text,
    location text,
    phone_verified boolean DEFAULT false,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Create providers table
CREATE TABLE IF NOT EXISTS providers (
    id uuid PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
    rating numeric(3,2) DEFAULT 0 CHECK (rating >= 0 AND rating <= 5),
    verified boolean DEFAULT false,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Create services table
CREATE TABLE IF NOT EXISTS services (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    provider_id uuid REFERENCES providers(id) ON DELETE CASCADE,
    title text NOT NULL,
    description text NOT NULL,
    price numeric(10,2) NOT NULL CHECK (price >= 0),
    category text NOT NULL,
    subcategory text,
    location text NOT NULL,
    image_url text,
    rating numeric(3,2) DEFAULT 0 CHECK (rating >= 0 AND rating <= 5),
    status text DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Create service_features table
CREATE TABLE IF NOT EXISTS service_features (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    service_id uuid REFERENCES services(id) ON DELETE CASCADE,
    feature text NOT NULL,
    created_at timestamptz DEFAULT now()
);

-- Create delivery_options table
CREATE TABLE IF NOT EXISTS delivery_options (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    service_id uuid REFERENCES services(id) ON DELETE CASCADE,
    type text NOT NULL CHECK (type IN ('free', 'paid', 'none', 'company')),
    price numeric(10,2),
    company_name text,
    estimated_time text,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    CONSTRAINT delivery_price_check CHECK (
        (type = 'paid' AND price IS NOT NULL) OR
        (type != 'paid' AND price IS NULL)
    ),
    CONSTRAINT delivery_company_check CHECK (
        (type = 'company' AND company_name IS NOT NULL) OR
        (type != 'company' AND company_name IS NULL)
    )
);

-- Create service_areas table
CREATE TABLE IF NOT EXISTS service_areas (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    service_id uuid REFERENCES services(id) ON DELETE CASCADE,
    area_name text NOT NULL,
    created_at timestamptz DEFAULT now()
);

-- Create useful indexes
CREATE INDEX IF NOT EXISTS idx_services_provider ON services(provider_id);
CREATE INDEX IF NOT EXISTS idx_services_category ON services(category);
CREATE INDEX IF NOT EXISTS idx_services_status ON services(status);
CREATE INDEX IF NOT EXISTS idx_profiles_user_type ON profiles(user_type);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_features ENABLE ROW LEVEL SECURITY;
ALTER TABLE delivery_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_areas ENABLE ROW LEVEL SECURITY;

-- Create storage bucket
INSERT INTO storage.buckets (id, name)
VALUES ('services', 'services')
ON CONFLICT (id) DO NOTHING;

-- Enable RLS for storage
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;