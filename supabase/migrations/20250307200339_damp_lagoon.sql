/*
  # Complete Database Security Setup

  1. Tables Setup
    - Create all necessary tables with proper constraints
    - Add appropriate indexes for performance
    - Set up foreign key relationships

  2. Security Configuration
    - Enable RLS on all tables
    - Set up authentication policies
    - Configure storage security

  3. Access Control
    - Public read access for active services
    - Authenticated user CRUD permissions
    - Service owner restrictions
*/

-- Start transaction to ensure all changes are atomic
BEGIN;

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
    id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
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
    price numeric(10,2) CHECK (
        (type = 'paid' AND price IS NOT NULL) OR
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

-- Enable Row Level Security on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_features ENABLE ROW LEVEL SECURITY;
ALTER TABLE delivery_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_areas ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DO $$ 
BEGIN
    -- Profiles policies
    DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON profiles;
    DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
    
    -- Providers policies
    DROP POLICY IF EXISTS "Provider profiles are viewable by everyone" ON providers;
    DROP POLICY IF EXISTS "Providers can update their own profile" ON providers;
    
    -- Services policies
    DROP POLICY IF EXISTS "Services are viewable by everyone" ON services;
    DROP POLICY IF EXISTS "Providers can create their own services" ON services;
    DROP POLICY IF EXISTS "Providers can update their own services" ON services;
    DROP POLICY IF EXISTS "Providers can delete their own services" ON services;
    
    -- Service features policies
    DROP POLICY IF EXISTS "Service features are viewable by everyone" ON service_features;
    DROP POLICY IF EXISTS "Providers can manage features for their services" ON service_features;
    
    -- Delivery options policies
    DROP POLICY IF EXISTS "Delivery options are viewable by everyone" ON delivery_options;
    DROP POLICY IF EXISTS "Providers can manage delivery options for their services" ON delivery_options;
    
    -- Service areas policies
    DROP POLICY IF EXISTS "Service areas are viewable by everyone" ON service_areas;
    DROP POLICY IF EXISTS "Providers can manage areas for their services" ON service_areas;
    
    -- Storage policies
    DROP POLICY IF EXISTS "Service images are publicly accessible" ON storage.objects;
    DROP POLICY IF EXISTS "Authenticated users can upload service images" ON storage.objects;
    DROP POLICY IF EXISTS "Users can delete their own service images" ON storage.objects;
END $$;

-- Create new policies
-- Profiles policies
CREATE POLICY "Public profiles are viewable by everyone"
ON profiles FOR SELECT
TO public
USING (true);

CREATE POLICY "Users can update their own profile"
ON profiles FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Providers policies
CREATE POLICY "Provider profiles are viewable by everyone"
ON providers FOR SELECT
TO public
USING (true);

CREATE POLICY "Providers can update their own profile"
ON providers FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Services policies
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

-- Service features policies
CREATE POLICY "Service features are viewable by everyone"
ON service_features FOR SELECT
TO public
USING (
    EXISTS (
        SELECT 1 FROM services
        WHERE services.id = service_features.service_id
        AND (services.status = 'active' OR services.provider_id = auth.uid())
    )
);

CREATE POLICY "Providers can manage features for their services"
ON service_features FOR ALL
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM services
        WHERE services.id = service_features.service_id
        AND services.provider_id = auth.uid()
    )
);

-- Delivery options policies
CREATE POLICY "Delivery options are viewable by everyone"
ON delivery_options FOR SELECT
TO public
USING (
    EXISTS (
        SELECT 1 FROM services
        WHERE services.id = delivery_options.service_id
        AND (services.status = 'active' OR services.provider_id = auth.uid())
    )
);

CREATE POLICY "Providers can manage delivery options for their services"
ON delivery_options FOR ALL
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM services
        WHERE services.id = delivery_options.service_id
        AND services.provider_id = auth.uid()
    )
);

-- Service areas policies
CREATE POLICY "Service areas are viewable by everyone"
ON service_areas FOR SELECT
TO public
USING (
    EXISTS (
        SELECT 1 FROM services
        WHERE services.id = service_areas.service_id
        AND (services.status = 'active' OR services.provider_id = auth.uid())
    )
);

CREATE POLICY "Providers can manage areas for their services"
ON service_areas FOR ALL
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM services
        WHERE services.id = service_areas.service_id
        AND services.provider_id = auth.uid()
    )
);

-- Storage setup
DO $$ 
BEGIN
    -- Enable RLS for storage
    ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

    -- Create storage policies
    CREATE POLICY "Service images are publicly accessible"
    ON storage.objects FOR SELECT
    TO public
    USING (bucket_id = 'services');

    CREATE POLICY "Authenticated users can upload service images"
    ON storage.objects FOR INSERT
    TO authenticated
    WITH CHECK (
        bucket_id = 'services' AND
        (storage.foldername(name))[1] = auth.uid()::text
    );

    CREATE POLICY "Users can delete their own service images"
    ON storage.objects FOR DELETE
    TO authenticated
    USING (
        bucket_id = 'services' AND
        (storage.foldername(name))[1] = auth.uid()::text
    );
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

-- Create storage bucket for services if it doesn't exist
INSERT INTO storage.buckets (id, name)
VALUES ('services', 'services')
ON CONFLICT (id) DO NOTHING;

COMMIT;