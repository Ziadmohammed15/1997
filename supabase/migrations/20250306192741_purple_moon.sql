/*
  # Fix Services and Related Tables RLS Policies

  1. Changes
    - Drop existing policies to avoid conflicts
    - Enable RLS on all service-related tables
    - Add policies for service management
    - Add policies for service features
    - Add policies for delivery options
    - Add policies for service areas

  2. Security
    - Allow public to view active services
    - Allow providers to manage their own services
    - Allow service role full access
*/

-- Drop existing policies if they exist
DO $$ BEGIN
  -- Services policies
  DROP POLICY IF EXISTS "Services are viewable by everyone" ON services;
  DROP POLICY IF EXISTS "Providers can manage their own services" ON services;
  DROP POLICY IF EXISTS "Service role can manage all services" ON services;
  
  -- Service features policies
  DROP POLICY IF EXISTS "Service features are viewable by everyone" ON service_features;
  DROP POLICY IF EXISTS "Providers can manage their service features" ON service_features;
  
  -- Delivery options policies
  DROP POLICY IF EXISTS "Delivery options are viewable by everyone" ON delivery_options;
  DROP POLICY IF EXISTS "Providers can manage their delivery options" ON delivery_options;
  
  -- Service areas policies
  DROP POLICY IF EXISTS "Service areas are viewable by everyone" ON service_areas;
  DROP POLICY IF EXISTS "Providers can manage their service areas" ON service_areas;
END $$;

-- Enable RLS on services table
ALTER TABLE services ENABLE ROW LEVEL SECURITY;

-- Create policies for services table
CREATE POLICY "Services are viewable by everyone" 
  ON services
  FOR SELECT
  TO public
  USING (status = 'active');

CREATE POLICY "Providers can manage their own services" 
  ON services
  FOR ALL 
  TO authenticated
  USING (provider_id = auth.uid())
  WITH CHECK (provider_id = auth.uid());

CREATE POLICY "Service role can manage all services" 
  ON services
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Enable RLS on service_features table
ALTER TABLE service_features ENABLE ROW LEVEL SECURITY;

-- Create policies for service_features table
CREATE POLICY "Service features are viewable by everyone"
  ON service_features
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Providers can manage their service features"
  ON service_features
  FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM services 
    WHERE services.id = service_features.service_id 
    AND services.provider_id = auth.uid()
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM services 
    WHERE services.id = service_features.service_id 
    AND services.provider_id = auth.uid()
  ));

-- Enable RLS on delivery_options table
ALTER TABLE delivery_options ENABLE ROW LEVEL SECURITY;

-- Create policies for delivery_options table
CREATE POLICY "Delivery options are viewable by everyone"
  ON delivery_options
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Providers can manage their delivery options"
  ON delivery_options
  FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM services 
    WHERE services.id = delivery_options.service_id 
    AND services.provider_id = auth.uid()
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM services 
    WHERE services.id = delivery_options.service_id 
    AND services.provider_id = auth.uid()
  ));

-- Enable RLS on service_areas table
ALTER TABLE service_areas ENABLE ROW LEVEL SECURITY;

-- Create policies for service_areas table
CREATE POLICY "Service areas are viewable by everyone"
  ON service_areas
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Providers can manage their service areas"
  ON service_areas
  FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM services 
    WHERE services.id = service_areas.service_id 
    AND services.provider_id = auth.uid()
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM services 
    WHERE services.id = service_areas.service_id 
    AND services.provider_id = auth.uid()
  ));