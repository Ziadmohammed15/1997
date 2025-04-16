/*
  # Create Services Storage and Update Policies

  1. Changes
    - Create storage bucket for services if it doesn't exist
    - Set up storage policies for authenticated users
    - Update RLS policies for services table
    - Enable RLS on services table

  2. Security
    - Only authenticated users can upload service images
    - Public read access for service images
    - Proper RLS policies for service management
*/

-- Create services storage bucket if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM storage.buckets WHERE id = 'services'
  ) THEN
    INSERT INTO storage.buckets (id, name, public)
    VALUES ('services', 'services', true);
  END IF;
END $$;

-- Drop existing policies if they exist
DO $$
BEGIN
  -- Storage policies
  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE policyname = 'Authenticated users can upload service images'
    AND tablename = 'objects'
    AND schemaname = 'storage'
  ) THEN
    DROP POLICY "Authenticated users can upload service images" ON storage.objects;
  END IF;

  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE policyname = 'Anyone can view service images'
    AND tablename = 'objects'
    AND schemaname = 'storage'
  ) THEN
    DROP POLICY "Anyone can view service images" ON storage.objects;
  END IF;

  -- Service policies
  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE policyname = 'Anyone can view services'
    AND tablename = 'services'
  ) THEN
    DROP POLICY "Anyone can view services" ON services;
  END IF;

  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE policyname = 'Authenticated users can create services'
    AND tablename = 'services'
  ) THEN
    DROP POLICY "Authenticated users can create services" ON services;
  END IF;

  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE policyname = 'Users can update their own services'
    AND tablename = 'services'
  ) THEN
    DROP POLICY "Users can update their own services" ON services;
  END IF;

  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE policyname = 'Users can delete their own services'
    AND tablename = 'services'
  ) THEN
    DROP POLICY "Users can delete their own services" ON services;
  END IF;
END $$;

-- Set up storage policies
CREATE POLICY "Authenticated users can upload service images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'services');

CREATE POLICY "Anyone can view service images"
ON storage.objects FOR SELECT
USING (bucket_id = 'services');

-- Enable RLS on services table if not already enabled
ALTER TABLE services ENABLE ROW LEVEL SECURITY;

-- Create service management policies
CREATE POLICY "Anyone can view services"
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