/*
  # Initialize Services Schema
  
  1. New Tables
    - services
    - service_features
    - delivery_options 
    - service_areas
  
  2. Security
    - Enable RLS on all tables
    - Set up proper access policies
    - Create storage bucket for service images
*/

-- Create services table if not exists
CREATE TABLE IF NOT EXISTS services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  price numeric(10,2) NOT NULL CHECK (price >= 0),
  category text NOT NULL,
  subcategory text,
  location text NOT NULL,
  image_url text,
  provider_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  status text DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  rating numeric(3,2) DEFAULT 0 CHECK (rating >= 0 AND rating <= 5),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create service features table
CREATE TABLE IF NOT EXISTS service_features (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id uuid REFERENCES services(id) ON DELETE CASCADE,
  feature text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create delivery options table
CREATE TABLE IF NOT EXISTS delivery_options (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id uuid REFERENCES services(id) ON DELETE CASCADE,
  type text NOT NULL CHECK (type IN ('free', 'paid', 'none', 'company')),
  price numeric(10,2) CHECK (price >= 0),
  company_name text,
  estimated_time text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT valid_delivery_options CHECK (
    (type = 'paid' AND price IS NOT NULL) OR
    (type = 'company' AND company_name IS NOT NULL) OR
    (type IN ('free', 'none'))
  )
);

-- Create service areas table
CREATE TABLE IF NOT EXISTS service_areas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id uuid REFERENCES services(id) ON DELETE CASCADE,
  area_name text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create services storage bucket if not exists
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

-- Storage policies (only create if they don't exist)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'objects' 
    AND policyname = 'Authenticated users can upload service images'
  ) THEN
    CREATE POLICY "Authenticated users can upload service images"
    ON storage.objects FOR INSERT
    TO authenticated
    WITH CHECK (bucket_id = 'services');
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'objects' 
    AND policyname = 'Anyone can view service images'
  ) THEN
    CREATE POLICY "Anyone can view service images"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'services');
  END IF;
END $$;

-- Services policies
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'services' 
    AND policyname = 'Anyone can view active services'
  ) THEN
    CREATE POLICY "Anyone can view active services"
    ON services FOR SELECT
    USING (status = 'active' OR auth.uid() = provider_id);
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'services' 
    AND policyname = 'Authenticated users can create services'
  ) THEN
    CREATE POLICY "Authenticated users can create services"
    ON services FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = provider_id);
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'services' 
    AND policyname = 'Users can update their own services'
  ) THEN
    CREATE POLICY "Users can update their own services"
    ON services FOR UPDATE
    TO authenticated
    USING (auth.uid() = provider_id)
    WITH CHECK (auth.uid() = provider_id);
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'services' 
    AND policyname = 'Users can delete their own services'
  ) THEN
    CREATE POLICY "Users can delete their own services"
    ON services FOR DELETE
    TO authenticated
    USING (auth.uid() = provider_id);
  END IF;
END $$;

-- Service features policies
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'service_features' 
    AND policyname = 'Anyone can view service features'
  ) THEN
    CREATE POLICY "Anyone can view service features"
    ON service_features FOR SELECT
    TO public
    USING (true);
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'service_features' 
    AND policyname = 'Users can manage their service features'
  ) THEN
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
  END IF;
END $$;

-- Delivery options policies
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'delivery_options' 
    AND policyname = 'Anyone can view delivery options'
  ) THEN
    CREATE POLICY "Anyone can view delivery options"
    ON delivery_options FOR SELECT
    TO public
    USING (true);
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'delivery_options' 
    AND policyname = 'Users can manage their delivery options'
  ) THEN
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
  END IF;
END $$;

-- Service areas policies
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'service_areas' 
    AND policyname = 'Anyone can view service areas'
  ) THEN
    CREATE POLICY "Anyone can view service areas"
    ON service_areas FOR SELECT
    TO public
    USING (true);
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'service_areas' 
    AND policyname = 'Users can manage their service areas'
  ) THEN
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
  END IF;
END $$;