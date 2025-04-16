/*
  # Database Schema - Part 1: Core Tables

  1. Tables
    - providers: Store service providers information
    - services: Store services information
    - service_features: Store service features
    - service_areas: Store service coverage areas
    - delivery_options: Store delivery options
    - phone_verification_codes: Store phone verification codes

  2. Indexes and Comments
    - Add indexes for better query performance
    - Add descriptive comments
*/

-- Create providers table
CREATE TABLE IF NOT EXISTS providers (
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

-- Create services table
CREATE TABLE IF NOT EXISTS services (
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
  updated_at timestamptz DEFAULT now(),
  
  CONSTRAINT valid_price CHECK (price >= 0),
  CONSTRAINT valid_rating CHECK (rating >= 0 AND rating <= 5),
  CONSTRAINT valid_status CHECK (status IN ('active', 'inactive', 'deleted'))
);

-- Create service features table
CREATE TABLE IF NOT EXISTS service_features (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id uuid REFERENCES services(id) ON DELETE CASCADE,
  feature text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create service areas table
CREATE TABLE IF NOT EXISTS service_areas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id uuid REFERENCES services(id) ON DELETE CASCADE,
  area_name text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create delivery options table
CREATE TABLE IF NOT EXISTS delivery_options (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id uuid REFERENCES services(id) ON DELETE CASCADE,
  type text NOT NULL,
  price numeric(10,2),
  company_name text,
  estimated_time text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  
  CONSTRAINT valid_delivery_type CHECK (type IN ('free', 'paid', 'none', 'company')),
  CONSTRAINT valid_delivery_price CHECK (
    (type = 'paid' AND price IS NOT NULL AND price > 0) OR
    (type != 'paid' AND price IS NULL)
  ),
  CONSTRAINT valid_company_name CHECK (
    (type = 'company' AND company_name IS NOT NULL) OR
    (type != 'company' AND company_name IS NULL)
  )
);

-- Create phone verification codes table
CREATE TABLE IF NOT EXISTS phone_verification_codes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  phone text NOT NULL,
  code text NOT NULL,
  attempts integer DEFAULT 0,
  verified boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  expires_at timestamptz DEFAULT (now() + interval '10 minutes'),
  
  CONSTRAINT valid_phone_number CHECK (phone ~ '^\+[1-9]\d{1,14}$'),
  CONSTRAINT valid_verification_code CHECK (code ~ '^\d{6}$'),
  CONSTRAINT valid_attempts_count CHECK (attempts >= 0 AND attempts <= 3)
);

-- Enable RLS on all tables
ALTER TABLE providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_features ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_areas ENABLE ROW LEVEL SECURITY;
ALTER TABLE delivery_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE phone_verification_codes ENABLE ROW LEVEL SECURITY;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_services_provider ON services(provider_id);
CREATE INDEX IF NOT EXISTS idx_services_category ON services(category);
CREATE INDEX IF NOT EXISTS idx_services_status ON services(status);
CREATE INDEX IF NOT EXISTS idx_service_features_service ON service_features(service_id);
CREATE INDEX IF NOT EXISTS idx_service_areas_service ON service_areas(service_id);
CREATE INDEX IF NOT EXISTS idx_delivery_options_service ON delivery_options(service_id);
CREATE INDEX IF NOT EXISTS idx_phone_verification_codes_user ON phone_verification_codes(user_id);

-- Add comments
COMMENT ON TABLE providers IS 'جدول مقدمي الخدمات';
COMMENT ON TABLE services IS 'جدول الخدمات المعروضة';
COMMENT ON TABLE service_features IS 'جدول مميزات الخدمات';
COMMENT ON TABLE service_areas IS 'جدول مناطق تغطية الخدمات';
COMMENT ON TABLE delivery_options IS 'جدول خيارات التوصيل';
COMMENT ON TABLE phone_verification_codes IS 'جدول رموز التحقق من الهاتف';