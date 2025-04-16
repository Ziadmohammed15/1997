/*
  # Row Level Security Policies

  1. Security Changes
    - Add RLS policies for profiles table
    - Add RLS policies for providers table
    - Add RLS policies for services and related tables
    - Add RLS policies for storage

  2. Changes
    - Add policies to control data access based on user role and ownership
    - Enable public read access for active services
    - Allow providers to manage their own services and related data
    - Configure storage access for service images
*/

-- Drop existing policies to avoid conflicts
DO $$ 
BEGIN
    -- Profiles policies
    DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON profiles;
    DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
    
    -- Providers policies
    DROP POLICY IF EXISTS "Providers are viewable by everyone" ON providers;
    DROP POLICY IF EXISTS "Providers can update own profile" ON providers;
    
    -- Services policies
    DROP POLICY IF EXISTS "Active services are viewable by everyone" ON services;
    DROP POLICY IF EXISTS "Providers can insert services" ON services;
    DROP POLICY IF EXISTS "Providers can update own services" ON services;
    DROP POLICY IF EXISTS "Providers can delete own services" ON services;
    
    -- Service features policies
    DROP POLICY IF EXISTS "Features are viewable with service" ON service_features;
    DROP POLICY IF EXISTS "Providers can manage service features" ON service_features;
    
    -- Delivery options policies
    DROP POLICY IF EXISTS "Delivery options are viewable with service" ON delivery_options;
    DROP POLICY IF EXISTS "Providers can manage delivery options" ON delivery_options;
    
    -- Service areas policies
    DROP POLICY IF EXISTS "Areas are viewable with service" ON service_areas;
    DROP POLICY IF EXISTS "Providers can manage service areas" ON service_areas;
    
    -- Storage policies
    DROP POLICY IF EXISTS "Service images are publicly accessible" ON storage.objects;
    DROP POLICY IF EXISTS "Authenticated users can upload service images" ON storage.objects;
    DROP POLICY IF EXISTS "Users can delete own service images" ON storage.objects;
END $$;

-- Profiles policies
CREATE POLICY "Profiles are viewable by everyone"
ON profiles FOR SELECT
TO public
USING (true);

CREATE POLICY "Users can update own profile"
ON profiles FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Providers policies
CREATE POLICY "Providers are viewable by everyone"
ON providers FOR SELECT
TO public
USING (true);

CREATE POLICY "Providers can update own profile"
ON providers FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Services policies
CREATE POLICY "Active services are viewable by everyone"
ON services FOR SELECT
TO public
USING (status = 'active' OR auth.uid() = provider_id);

CREATE POLICY "Providers can insert services"
ON services FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = provider_id);

CREATE POLICY "Providers can update own services"
ON services FOR UPDATE
TO authenticated
USING (auth.uid() = provider_id)
WITH CHECK (auth.uid() = provider_id);

CREATE POLICY "Providers can delete own services"
ON services FOR DELETE
TO authenticated
USING (auth.uid() = provider_id);

-- Service features policies
CREATE POLICY "Features are viewable with service"
ON service_features FOR SELECT
TO public
USING (
    EXISTS (
        SELECT 1 FROM services
        WHERE services.id = service_features.service_id
        AND (services.status = 'active' OR services.provider_id = auth.uid())
    )
);

CREATE POLICY "Providers can manage service features"
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
CREATE POLICY "Delivery options are viewable with service"
ON delivery_options FOR SELECT
TO public
USING (
    EXISTS (
        SELECT 1 FROM services
        WHERE services.id = delivery_options.service_id
        AND (services.status = 'active' OR services.provider_id = auth.uid())
    )
);

CREATE POLICY "Providers can manage delivery options"
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
CREATE POLICY "Areas are viewable with service"
ON service_areas FOR SELECT
TO public
USING (
    EXISTS (
        SELECT 1 FROM services
        WHERE services.id = service_areas.service_id
        AND (services.status = 'active' OR services.provider_id = auth.uid())
    )
);

CREATE POLICY "Providers can manage service areas"
ON service_areas FOR ALL
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM services
        WHERE services.id = service_areas.service_id
        AND services.provider_id = auth.uid()
    )
);

-- Storage policies
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

CREATE POLICY "Users can delete own service images"
ON storage.objects FOR DELETE
TO authenticated
USING (
    bucket_id = 'services' AND
    (storage.foldername(name))[1] = auth.uid()::text
);