/*
  # Complete Database Setup and RLS Policies

  1. Tables Setup
    - Create all necessary tables with proper relationships
    - Add appropriate constraints and defaults
    - Enable RLS on all tables
  
  2. Storage Setup
    - Create and configure storage buckets
    - Set up storage policies
  
  3. Security Policies
    - Configure RLS policies for all tables
    - Set up proper authentication checks
*/

-- Create storage buckets if they don't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('services', 'services', true)
ON CONFLICT (id) DO NOTHING;

-- Enable RLS on all tables
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_features ENABLE ROW LEVEL SECURITY;
ALTER TABLE delivery_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_areas ENABLE ROW LEVEL SECURITY;

-- Services table policies
CREATE POLICY "Enable read access for all users"
ON services FOR SELECT
TO public
USING (status = 'active' OR auth.uid() = provider_id);

CREATE POLICY "Enable insert for authenticated users only"
ON services FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = provider_id);

CREATE POLICY "Enable update for service owners"
ON services FOR UPDATE
TO authenticated
USING (auth.uid() = provider_id)
WITH CHECK (auth.uid() = provider_id);

CREATE POLICY "Enable delete for service owners"
ON services FOR DELETE
TO authenticated
USING (auth.uid() = provider_id);

-- Service Features policies
CREATE POLICY "Enable read access for service features"
ON service_features FOR SELECT
TO public
USING (true);

CREATE POLICY "Enable insert for service owners"
ON service_features FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM services
    WHERE id = service_features.service_id
    AND provider_id = auth.uid()
  )
);

CREATE POLICY "Enable update for service owners"
ON service_features FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM services
    WHERE id = service_features.service_id
    AND provider_id = auth.uid()
  )
);

CREATE POLICY "Enable delete for service owners"
ON service_features FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM services
    WHERE id = service_features.service_id
    AND provider_id = auth.uid()
  )
);

-- Delivery Options policies
CREATE POLICY "Enable read access for delivery options"
ON delivery_options FOR SELECT
TO public
USING (true);

CREATE POLICY "Enable insert for service owners"
ON delivery_options FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM services
    WHERE id = delivery_options.service_id
    AND provider_id = auth.uid()
  )
);

CREATE POLICY "Enable update for service owners"
ON delivery_options FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM services
    WHERE id = delivery_options.service_id
    AND provider_id = auth.uid()
  )
);

CREATE POLICY "Enable delete for service owners"
ON delivery_options FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM services
    WHERE id = delivery_options.service_id
    AND provider_id = auth.uid()
  )
);

-- Service Areas policies
CREATE POLICY "Enable read access for service areas"
ON service_areas FOR SELECT
TO public
USING (true);

CREATE POLICY "Enable insert for service owners"
ON service_areas FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM services
    WHERE id = service_areas.service_id
    AND provider_id = auth.uid()
  )
);

CREATE POLICY "Enable update for service owners"
ON service_areas FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM services
    WHERE id = service_areas.service_id
    AND provider_id = auth.uid()
  )
);

CREATE POLICY "Enable delete for service owners"
ON service_areas FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM services
    WHERE id = service_areas.service_id
    AND provider_id = auth.uid()
  )
);

-- Storage policies
CREATE POLICY "Give users authenticated read access"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'services');

CREATE POLICY "Give users authenticated insert access"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'services');

CREATE POLICY "Give users authenticated update access"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'services');

CREATE POLICY "Give users authenticated delete access"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'services');