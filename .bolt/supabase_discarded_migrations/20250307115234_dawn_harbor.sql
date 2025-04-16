/*
  # Fix RLS Policies for Services and Related Tables

  1. Security Setup
    - Enable RLS on all tables
    - Add policies for services table
    - Add policies for service features
    - Add policies for delivery options
    - Add policies for service areas
    - Add policies for storage buckets

  2. Policies Overview
    - Allow authenticated users to manage their own services
    - Allow public access to view active services
    - Restrict modifications to service owners
    - Enable secure file uploads

  3. Changes
    - Enable RLS on all related tables
    - Create CRUD policies for each table
    - Link policies to authenticated users
    - Add storage bucket policies
*/

-- Enable RLS on all tables
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_features ENABLE ROW LEVEL SECURITY;
ALTER TABLE delivery_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_areas ENABLE ROW LEVEL SECURITY;

-- Services table policies
CREATE POLICY "Services are viewable by everyone"
ON services FOR SELECT
TO public
USING (status = 'active' OR auth.uid() = provider_id);

CREATE POLICY "Users can create their own services"
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

CREATE POLICY "Users can create features for their services"
ON service_features FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM services
    WHERE services.id = service_features.service_id
    AND services.provider_id = auth.uid()
  )
);

CREATE POLICY "Users can update features of their services"
ON service_features FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM services
    WHERE services.id = service_features.service_id
    AND services.provider_id = auth.uid()
  )
);

CREATE POLICY "Users can delete features of their services"
ON service_features FOR DELETE
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

CREATE POLICY "Users can create delivery options for their services"
ON delivery_options FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM services
    WHERE services.id = delivery_options.service_id
    AND services.provider_id = auth.uid()
  )
);

CREATE POLICY "Users can update delivery options of their services"
ON delivery_options FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM services
    WHERE services.id = delivery_options.service_id
    AND services.provider_id = auth.uid()
  )
);

CREATE POLICY "Users can delete delivery options of their services"
ON delivery_options FOR DELETE
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

CREATE POLICY "Users can create areas for their services"
ON service_areas FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM services
    WHERE services.id = service_areas.service_id
    AND services.provider_id = auth.uid()
  )
);

CREATE POLICY "Users can update areas of their services"
ON service_areas FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM services
    WHERE services.id = service_areas.service_id
    AND services.provider_id = auth.uid()
  )
);

CREATE POLICY "Users can delete areas of their services"
ON service_areas FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM services
    WHERE services.id = service_areas.service_id
    AND services.provider_id = auth.uid()
  )
);

-- Storage policies for service images
BEGIN;
  -- Enable RLS for storage
  ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

  -- Policy for reading service images
  CREATE POLICY "Service images are publicly accessible"
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id = 'services');

  -- Policy for uploading service images
  CREATE POLICY "Authenticated users can upload service images"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'services' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

  -- Policy for deleting service images
  CREATE POLICY "Users can delete their own service images"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'services' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );
COMMIT;