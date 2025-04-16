/*
  # Services Schema Setup

  1. New Tables
    - services
      - Basic service information
      - Provider details
      - Pricing and status
    - service_features
      - Features/amenities for each service
    - delivery_options
      - Delivery configuration
    - service_areas
      - Coverage areas for delivery

  2. Security
    - Enable RLS on all tables
    - Add policies for service management
    - Add policies for public access
*/

-- Services table
CREATE TABLE IF NOT EXISTS services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  price numeric(10,2) NOT NULL CHECK (price >= 0),
  category text NOT NULL,
  subcategory text,
  location text NOT NULL,
  image_url text,
  provider_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  rating numeric(3,2) DEFAULT 0 CHECK (rating >= 0 AND rating <= 5),
  status text DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Service features table
CREATE TABLE IF NOT EXISTS service_features (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id uuid REFERENCES services(id) ON DELETE CASCADE,
  feature text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Delivery options table
CREATE TABLE IF NOT EXISTS delivery_options (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id uuid REFERENCES services(id) ON DELETE CASCADE,
  type text NOT NULL CHECK (type IN ('free', 'paid', 'none', 'company')),
  price numeric(10,2) CHECK (price >= 0),
  company_name text,
  estimated_time text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT delivery_options_check CHECK (
    (type = 'paid' AND price IS NOT NULL) OR
    (type != 'paid' AND price IS NULL)
  ),
  CONSTRAINT delivery_options_check1 CHECK (
    (type = 'company' AND company_name IS NOT NULL) OR
    (type != 'company' AND company_name IS NULL)
  )
);

-- Service areas table
CREATE TABLE IF NOT EXISTS service_areas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id uuid REFERENCES services(id) ON DELETE CASCADE,
  area_name text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_features ENABLE ROW LEVEL SECURITY;
ALTER TABLE delivery_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_areas ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DO $$ 
BEGIN
  -- Services policies
  DROP POLICY IF EXISTS "Services are viewable by everyone" ON services;
  DROP POLICY IF EXISTS "Providers can manage their own services" ON services;
  
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

-- Services policies
CREATE POLICY "Services are viewable by everyone" 
  ON services
  FOR SELECT 
  USING (status = 'active');

CREATE POLICY "Providers can manage their own services" 
  ON services
  USING (provider_id = auth.uid())
  WITH CHECK (provider_id = auth.uid());

-- Service features policies
CREATE POLICY "Service features are viewable by everyone" 
  ON service_features
  FOR SELECT 
  USING (true);

CREATE POLICY "Providers can manage their service features" 
  ON service_features
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

-- Delivery options policies
CREATE POLICY "Delivery options are viewable by everyone" 
  ON delivery_options
  FOR SELECT 
  USING (true);

CREATE POLICY "Providers can manage their delivery options" 
  ON delivery_options
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

-- Service areas policies
CREATE POLICY "Service areas are viewable by everyone" 
  ON service_areas
  FOR SELECT 
  USING (true);

CREATE POLICY "Providers can manage their service areas" 
  ON service_areas
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

-- Indexes
CREATE INDEX IF NOT EXISTS idx_services_provider ON services(provider_id);
CREATE INDEX IF NOT EXISTS idx_services_category ON services(category);
CREATE INDEX IF NOT EXISTS idx_services_status ON services(status);