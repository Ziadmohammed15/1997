/*
  # Fix Services Database Schema and Policies

  1. Changes
    - Create services storage bucket
    - Update storage and service policies
    - Fix RLS policies for all tables

  2. Security
    - Enable RLS on all tables
    - Add proper access control policies
    - Ensure secure data access

  3. Notes
    - Split into smaller operations for stability
    - Policies use unique names to avoid conflicts
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

-- Enable RLS on all tables
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_features ENABLE ROW LEVEL SECURITY;
ALTER TABLE delivery_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_areas ENABLE ROW LEVEL SECURITY;

-- Storage policies
DO $$
BEGIN
  -- Drop old policies if they exist
  DROP POLICY IF EXISTS "Services bucket upload policy" ON storage.objects;
  DROP POLICY IF EXISTS "Services bucket select policy" ON storage.objects;
  
  -- Create new policies
  CREATE POLICY "Services storage upload policy v1" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'services');

  CREATE POLICY "Services storage select policy v1" ON storage.objects
  FOR SELECT TO public
  USING (bucket_id = 'services');
END $$;

-- Service policies
DO $$
BEGIN
  -- Drop old policies if they exist
  DROP POLICY IF EXISTS "Public services select policy" ON services;
  DROP POLICY IF EXISTS "Service creation policy" ON services;
  DROP POLICY IF EXISTS "Service update policy" ON services;
  DROP POLICY IF EXISTS "Service deletion policy" ON services;
  
  -- Create new policies
  CREATE POLICY "Services view policy v1" ON services
  FOR SELECT TO public
  USING (status = 'active' OR auth.uid() = provider_id);

  CREATE POLICY "Services insert policy v1" ON services
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = provider_id);

  CREATE POLICY "Services update policy v1" ON services
  FOR UPDATE TO authenticated
  USING (auth.uid() = provider_id)
  WITH CHECK (auth.uid() = provider_id);

  CREATE POLICY "Services delete policy v1" ON services
  FOR DELETE TO authenticated
  USING (auth.uid() = provider_id);
END $$;

-- Service features policies
DO $$
BEGIN
  -- Drop old policies if they exist
  DROP POLICY IF EXISTS "Service features select policy" ON service_features;
  DROP POLICY IF EXISTS "Service features management policy" ON service_features;
  
  -- Create new policies
  CREATE POLICY "Features view policy v1" ON service_features
  FOR SELECT TO public
  USING (true);

  CREATE POLICY "Features management policy v1" ON service_features
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM services
      WHERE services.id = service_features.service_id
      AND services.provider_id = auth.uid()
    )
  );
END $$;

-- Delivery options policies
DO $$
BEGIN
  -- Drop old policies if they exist
  DROP POLICY IF EXISTS "Delivery options select policy" ON delivery_options;
  DROP POLICY IF EXISTS "Delivery options management policy" ON delivery_options;
  
  -- Create new policies
  CREATE POLICY "Delivery view policy v1" ON delivery_options
  FOR SELECT TO public
  USING (true);

  CREATE POLICY "Delivery management policy v1" ON delivery_options
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM services
      WHERE services.id = delivery_options.service_id
      AND services.provider_id = auth.uid()
    )
  );
END $$;

-- Service areas policies
DO $$
BEGIN
  -- Drop old policies if they exist
  DROP POLICY IF EXISTS "Service areas select policy" ON service_areas;
  DROP POLICY IF EXISTS "Service areas management policy" ON service_areas;
  
  -- Create new policies
  CREATE POLICY "Areas view policy v1" ON service_areas
  FOR SELECT TO public
  USING (true);

  CREATE POLICY "Areas management policy v1" ON service_areas
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM services
      WHERE services.id = service_areas.service_id
      AND services.provider_id = auth.uid()
    )
  );
END $$;