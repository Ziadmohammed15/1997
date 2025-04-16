/*
  # Update Services RLS Policies

  1. Changes
    - Drop existing policies that may conflict
    - Create new policies with proper permissions for service management
    - Ensure authenticated users can create and manage their own services
    - Allow public access to active services

  2. Security
    - Providers can manage their own services
    - Everyone can view active services
    - Proper cascade for related tables
*/

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Services are viewable by everyone" ON services;
DROP POLICY IF EXISTS "Providers can manage their own services" ON services;

-- Create new policies with proper permissions
CREATE POLICY "Anyone can view active services"
ON services FOR SELECT
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

-- Ensure service features policies are correct
DROP POLICY IF EXISTS "Service features are viewable by everyone" ON service_features;
DROP POLICY IF EXISTS "Providers can manage their service features" ON service_features;

CREATE POLICY "Anyone can view service features"
ON service_features FOR SELECT
USING (true);

CREATE POLICY "Users can manage their service features"
ON service_features 
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM services 
    WHERE services.id = service_features.service_id 
    AND services.provider_id = auth.uid()
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM services 
    WHERE services.id = service_features.service_id 
    AND services.provider_id = auth.uid()
  )
);