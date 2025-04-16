/*
  # Fix RLS Policies for Services

  1. New Policies
    - Enable RLS on all tables
    - Add policies for services table
    - Add policies for service features
    - Add policies for delivery options
    - Add policies for service areas
    - Add policies for storage bucket

  2. Security
    - Ensure authenticated users can manage their own services
    - Allow public access to view active services
    - Restrict modifications to service owners
    - Enable secure file uploads
*/

-- Enable RLS on all tables
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_features ENABLE ROW LEVEL SECURITY;
ALTER TABLE delivery_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_areas ENABLE ROW LEVEL SECURITY;

-- Create storage bucket for services if it doesn't exist
DO $$
BEGIN
  INSERT INTO storage.buckets (id, name, public)
  VALUES ('services', 'services', true)
  ON CONFLICT (id) DO NOTHING;
END $$;

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Anyone can view active services" ON services;
DROP POLICY IF EXISTS "Users can insert their own services" ON services;
DROP POLICY IF EXISTS "Users can update their own services" ON services;
DROP POLICY IF EXISTS "Users can delete their own services" ON services;

-- Services policies
CREATE POLICY "Anyone can view active services"
ON services FOR SELECT
TO public
USING (status = 'active' OR auth.uid() = provider_id);

CREATE POLICY "Users can insert their own services"
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

-- Service Features policies
DROP POLICY IF EXISTS "Anyone can view service features" ON service_features;
DROP POLICY IF EXISTS "Users can manage their service features" ON service_features;

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
    WHERE id = service_features.service_id
    AND provider_id = auth.uid()
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM services
    WHERE id = service_features.service_id
    AND provider_id = auth.uid()
  )
);

-- Delivery Options policies
DROP POLICY IF EXISTS "Anyone can view delivery options" ON delivery_options;
DROP POLICY IF EXISTS "Users can manage their delivery options" ON delivery_options;

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
    WHERE id = delivery_options.service_id
    AND provider_id = auth.uid()
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM services
    WHERE id = delivery_options.service_id
    AND provider_id = auth.uid()
  )
);

-- Service Areas policies
DROP POLICY IF EXISTS "Anyone can view service areas" ON service_areas;
DROP POLICY IF EXISTS "Users can manage their service areas" ON service_areas;

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
    WHERE id = service_areas.service_id
    AND provider_id = auth.uid()
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM services
    WHERE id = service_areas.service_id
    AND provider_id = auth.uid()
  )
);

-- Storage policies for service images
DROP POLICY IF EXISTS "Anyone can view service images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload service images" ON storage.objects;

CREATE POLICY "Anyone can view service images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'services');

CREATE POLICY "Authenticated users can upload service images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'services');