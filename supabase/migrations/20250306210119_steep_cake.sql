/*
  # Fix Service Policies
  
  1. Tables
    - Enable RLS on all service-related tables
    - Drop existing policies to avoid conflicts
    - Create new policies with proper permissions
  
  2. Storage
    - Set up storage bucket and policies for service images
    
  This migration ensures clean policy setup by dropping existing ones first.
*/

-- Create services bucket if not exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM storage.buckets WHERE id = 'services'
  ) THEN
    INSERT INTO storage.buckets (id, name, public)
    VALUES ('services', 'services', true);
  END IF;
END $$;

-- Drop existing storage policies
DO $$
BEGIN
  DROP POLICY IF EXISTS "Authenticated users can upload service images" ON storage.objects;
  DROP POLICY IF EXISTS "Anyone can view service images" ON storage.objects;
END $$;

-- Create storage policies
CREATE POLICY "Authenticated users can upload service images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'services');

CREATE POLICY "Anyone can view service images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'services');

-- Enable RLS on all tables
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_features ENABLE ROW LEVEL SECURITY;
ALTER TABLE delivery_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_areas ENABLE ROW LEVEL SECURITY;

-- Drop all existing policies from service tables
DO $$
BEGIN
  -- Services policies
  DROP POLICY IF EXISTS "Anyone can view active services" ON services;
  DROP POLICY IF EXISTS "Authenticated users can create services" ON services;
  DROP POLICY IF EXISTS "Users can update their own services" ON services;
  DROP POLICY IF EXISTS "Users can delete their own services" ON services;
  
  -- Service features policies
  DROP POLICY IF EXISTS "Anyone can view service features" ON service_features;
  DROP POLICY IF EXISTS "Users can manage their service features" ON service_features;
  
  -- Delivery options policies
  DROP POLICY IF EXISTS "Anyone can view delivery options" ON delivery_options;
  DROP POLICY IF EXISTS "Users can manage their delivery options" ON delivery_options;
  
  -- Service areas policies
  DROP POLICY IF EXISTS "Anyone can view service areas" ON service_areas;
  DROP POLICY IF EXISTS "Users can manage their service areas" ON service_areas;
END $$;

-- Create service policies
CREATE POLICY "Anyone can view active services"
ON services FOR SELECT
TO public
USING (status = 'active' OR auth.uid() = provider_id);

CREATE POLICY "Authenticated users can create services"
ON services FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = provider_id);

CREATE POLICY "Users can update their own services"
ON services FOR UPDATE
TO authenticated
USING (auth.uid() = provider_id)
WITH CHECK (auth.uid() = provider_id);

CREATE POLICY "Users can delete their own services"
ON services FOR DELETE
TO authenticated
USING (auth.uid() = provider_id);

-- Create service features policies
CREATE POLICY "Anyone can view service features"
ON service_features FOR SELECT
TO public
USING (true);

CREATE POLICY "Users can manage their service features"
ON service_features FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM services
    WHERE services.id = service_features.service_id
    AND services.provider_id = auth.uid()
  )
);

-- Create delivery options policies
CREATE POLICY "Anyone can view delivery options"
ON delivery_options FOR SELECT
TO public
USING (true);

CREATE POLICY "Users can manage their delivery options"
ON delivery_options FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM services
    WHERE services.id = delivery_options.service_id
    AND services.provider_id = auth.uid()
  )
);

-- Create service areas policies
CREATE POLICY "Anyone can view service areas"
ON service_areas FOR SELECT
TO public
USING (true);

CREATE POLICY "Users can manage their service areas"
ON service_areas FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM services
    WHERE services.id = service_areas.service_id
    AND services.provider_id = auth.uid()
  )
);